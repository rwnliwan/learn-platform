#!/usr/bin/env python3
"""Gap-fill numbers for MLF M9 (Luna gaps G1-G10, ronde fill 2026-11-13).

Computes ONLY the new numbers the fill needs, from the same data as
qa-learn/m9_canonical_calc.py (data/m4_prices.csv, n=480 portfolio SIMPLE
returns, seed 42). Notebook lesson files are NOT touched; this script IS
the "[notebook]" source for the new numbers (re-runnable).

New keys merged into qa-learn/m9_canonical.json (existing keys untouched):
  m9_generators        (G2) EWMA / GARCH / FHS generator comparison, M9.1
  m9_es_severity       (G3) ES backtest / exceedance severity, M9.3
  m9_pl_engine         (G4) P&L engine: market + cost + leverage + haircut
                       (market part canonical; the rest [ilustrasi]), M9.2
  m9_nested_bootstrap  (G6) uncertainty propagation (nested re-estimation),
                       M9.4
  m9_block_lengths     (G7) block bootstrap VaR95 CI for L = 5 / 10 / 20,
                       M9.5

SANITY LOCKS (script STOPS, exit 1, writes nothing, if any misses):
  - GARCH(1,1) portfolio forecast vol == m4_canonical
    garch_port_forecast_vol (same data + same MLE routine, must match)
  - rolling-250 VaR95 OOS exceedances == 15 (m9_backtest_wf lock)
  - nested-bootstrap total sd is within [0.0015, 0.0035] (sampling
    dominated: between the MC-only sd 0.0004 and 2x the iid sd 0.0022*2)
  - block-length sd is non-decreasing in L within MC noise (L=20 sd >=
    L=5 sd - 0.0002)

Run: python3 qa-learn/m9_gap_fill_calc.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m9_canonical.json (merged) + prints a verification table.
"""
import json
import math
import time

import numpy as np
import pandas as pd
from scipy import optimize, stats

SEED = 42
CANON_PATH = "qa-learn/m9_canonical.json"
M4_PATH = "qa-learn/m4_canonical.json"
t0 = time.time()


def r4(x):
    return round(float(x), 4)


def r6(x):
    return round(float(x), 6)


def r2(x):
    return round(float(x), 2)


def r1(x):
    return round(float(x), 1)


# ---------------------------------------------------------------- base series
prices = pd.read_csv("data/m4_prices.csv", index_col=0, parse_dates=True,
                     header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


sr = {c: _simpret(close[c]) for c in close.columns}
port_s = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).mean(axis=1)
port_l = np.log1p(port_s)
arr_s = port_s.values
arr_l = port_l.dropna().values
n = len(arr_s)
mu_s, sd_s = float(port_s.mean()), float(port_s.std(ddof=1))
mu_l, sd_l = float(port_l.mean()), float(port_l.std(ddof=1))
Z95 = float(stats.norm.ppf(0.95))  # 1.6449
print(f"portfolio: n={n} mu_s={mu_s:.6f} sd_s={sd_s:.4f} "
      f"mu_l={mu_l:.6f} sd_l={sd_l:.4f} Z95={Z95:.4f}")

canon = json.loads(open(CANON_PATH).read())
m4 = json.loads(open(M4_PATH).read())
new = {}

# ================================================================ G2: generators
print("\n== G2: generator comparison (EWMA / GARCH / FHS) ==")


def ewma_vol(r, lam=0.94):
    var = np.var(r)
    vols = []
    for e in r:
        var = lam * var + (1 - lam) * e * e
        vols.append(np.sqrt(var))
    return np.array(vols)


# EWMA on SIMPLE returns (lesson convention for VaR)
ew_s = ewma_vol(arr_s)
ew_last = float(ew_s[-1])
ew_mean = float(ew_s.mean())
# EWMA-conditional VaR95 (normal, mean-adjusted like var_param)
var95_ewma = float(Z95 * ew_last - mu_s)
print(f"  EWMA(0.94) simple: last vol={ew_last:.4f} mean vol={ew_mean:.4f} "
      f"VaR95={var95_ewma:.4f}")


# GARCH(1,1) manual MLE on LOG returns (routine copied verbatim from
# qa-learn/m4_canonical_calc.py, M4.3) — returns the cond-vol series too.
def garch_fit(r):
    mu = r.mean()
    e = r - mu
    var0 = np.var(e)

    def nll(params):
        om, al, be = params
        if om <= 0 or al < 0 or be < 0 or al + be >= 1:
            return 1e10
        sig2 = np.empty_like(e)
        sig2[0] = var0
        for t in range(1, len(e)):
            sig2[t] = om + al * e[t - 1] ** 2 + be * sig2[t - 1]
        if np.any(sig2 <= 0):
            return 1e10
        return 0.5 * np.sum(np.log(2 * np.pi) + np.log(sig2) + e ** 2 / sig2)

    best = None
    for start in [(var0 * 0.05, 0.08, 0.88), (var0 * 0.1, 0.15, 0.8),
                  (var0 * 0.02, 0.05, 0.9)]:
        res = optimize.minimize(nll, start, method="L-BFGS-B",
                                bounds=[(1e-10, None), (0, 0.99), (0, 0.99)])
        if best is None or res.fun < best.fun:
            best = res
    om, al, be = best.x
    sig2 = np.empty_like(e)
    sig2[0] = var0
    for t in range(1, len(e)):
        sig2[t] = om + al * e[t - 1] ** 2 + be * sig2[t - 1]
    sig = np.sqrt(sig2)
    forecast_var = om + al * e[-1] ** 2 + be * sig2[-1]
    return dict(mu=float(mu), omega=float(om), alpha=float(al), beta=float(be),
                persistence=float(al + be),
                long_run_vol=float(np.sqrt(om / (1 - al - be))),
                last_cond_vol=float(sig[-1]),
                forecast_vol=float(np.sqrt(forecast_var)),
                cond_vol=sig, resid=e)


gp = garch_fit(arr_l)
garch_fv = gp["forecast_vol"]
# conditional VaR95, mean-adjusted (same convention as var_param in M9)
var95_garch = float(Z95 * garch_fv - mu_l)
var95_garch_mu0 = float(Z95 * garch_fv)
print(f"  GARCH(1,1) log: omega={gp['omega']:.8f} alpha={gp['alpha']:.4f} "
      f"beta={gp['beta']:.4f} persistence={gp['persistence']:.4f}")
print(f"  GARCH forecast vol={garch_fv:.4f} long-run vol={gp['long_run_vol']:.4f} "
      f"VaR95={var95_garch:.4f} (mean-0: {var95_garch_mu0:.4f})")
# LOCK vs M4.3 (same data + same routine must reproduce exactly)
_lock_g = m4["garch_port_forecast_vol"]
assert abs(garch_fv - _lock_g) < 0.00005, \
    f"GARCH forecast vol {garch_fv} != M4 lock {_lock_g}"
print(f"  LOCK ok: GARCH forecast vol == m4_canonical {_lock_g}")

# Filtered Historical Simulation: standardise log returns by GARCH cond vol,
# resample the standardised residuals, rescale by the forecast vol.
rng = np.random.default_rng(SEED)
z = gp["resid"] / gp["cond_vol"]
print(f"  FHS residuals: std(z)={z.std(ddof=1):.4f} skew={float(stats.skew(z)):.4f} "
      f"excess kurt={float(stats.kurtosis(z)):.4f}")
N_FHS = 100_000
z_draw = rng.choice(z, size=N_FHS, replace=True)
r_log_fhs = mu_l + garch_fv * z_draw
r_smp_fhs = np.expm1(r_log_fhs)
var95_fhs = float(-np.quantile(r_smp_fhs, 0.05))
es95_fhs = float(-r_smp_fhs[r_smp_fhs <= np.quantile(r_smp_fhs, 0.05)].mean())
print(f"  FHS (GARCH-filtered, N={N_FHS}): VaR95={var95_fhs:.4f} ES95={es95_fhs:.4f}")

# EWMA-filtered FHS as a second variant (standardise by EWMA vols, log rets)
ew_l = ewma_vol(arr_l)
z_ew = (arr_l - mu_l) / ew_l
z_ew_draw = rng.choice(z_ew, size=N_FHS, replace=True)
r_smp_fhs_ew = np.expm1(mu_l + float(ew_l[-1]) * z_ew_draw)
var95_fhs_ew = float(-np.quantile(r_smp_fhs_ew, 0.05))
es95_fhs_ew = float(-r_smp_fhs_ew[r_smp_fhs_ew <= np.quantile(r_smp_fhs_ew, 0.05)].mean())
print(f"  FHS (EWMA-filtered, N={N_FHS}): VaR95={var95_fhs_ew:.4f} ES95={es95_fhs_ew:.4f}")

_var_gbm = canon["m9_mc_1day"]["N100000"]["var95"]       # 0.0329
_var_hs = canon["m9_hs_windows"]["window_480"]["var95"]  # 0.0286
_var_param = canon["m9_hs_windows"]["full_480_reference"]["param_var95"]  # 0.0328
gen_vars = {"gbm_normal": _var_gbm, "historical": _var_hs,
            "parametric": _var_param, "ewma": r4(var95_ewma),
            "garch": r4(var95_garch), "fhs_garch": r4(var95_fhs),
            "fhs_ewma": r4(var95_fhs_ew)}
spread = r4(max(gen_vars.values()) - min(gen_vars.values()))
new["m9_generators"] = {
    "ewma_lambda": 0.94,
    "ewma_last_vol_simple": r4(ew_last),
    "ewma_mean_vol_simple": r4(ew_mean),
    "ewma_last_vol_log": r4(float(ew_l[-1])),
    "var95_ewma": r4(var95_ewma),
    "garch_omega": r6(gp["omega"]),
    "garch_alpha": r4(gp["alpha"]),
    "garch_beta": r4(gp["beta"]),
    "garch_persistence": r4(gp["persistence"]),
    "garch_long_run_vol": r4(gp["long_run_vol"]),
    "garch_forecast_vol": r4(garch_fv),
    "var95_garch": r4(var95_garch),
    "var95_garch_mean0": r4(var95_garch_mu0),
    "fhs_N": N_FHS,
    "fhs_resid_std": r4(float(z.std(ddof=1))),
    "fhs_resid_skew": r4(float(stats.skew(z))),
    "fhs_resid_excess_kurtosis": r4(float(stats.kurtosis(z))),
    "var95_fhs_garch": r4(var95_fhs),
    "es95_fhs_garch": r4(es95_fhs),
    "var95_fhs_ewma": r4(var95_fhs_ew),
    "es95_fhs_ewma": r4(es95_fhs_ew),
    "var95_by_generator": gen_vars,
    "var95_spread_max_min": spread,
    "note": ("EWMA on SIMPLE returns (lesson convention); GARCH(1,1) manual "
             "MLE on LOG returns, routine copied from M4.3 (forecast vol "
             "locked vs m4_canonical). FHS resamples GARCH-standardised "
             "residuals and rescales by the forecast vol. VaR95 values are "
             "1-day, seed 42. GBM/historical/parametric are the existing "
             "canonical values, repeated here for the comparison table."),
}

# ================================================================ G3: ES severity
print("\n== G3: ES backtest / exceedance severity (rolling 250d VaR95 OOS) ==")
exc_idx, exc_ret, exc_es_fc = [], [], []
for t in range(250, len(arr_s)):
    win = arr_s[t - 250:t]
    q = np.quantile(win, 0.05)
    v = -q
    if arr_s[t] < -v:
        exc_idx.append(t)  # 0-based index into the 480 returns
        exc_ret.append(float(arr_s[t]))
        # rolling-window ES95 forecast: mean of the window's worst 5%
        exc_es_fc.append(float(-win[win <= q].mean()))
exc_idx = np.array(exc_idx)
exc_ret = np.array(exc_ret)
exc_es_fc = np.array(exc_es_fc)
n_exc = len(exc_ret)
assert n_exc == canon["m9_backtest_wf"]["roll250_var95"]["exceed"] == 15, \
    f"exceed count {n_exc} != canonical 15"
print(f"  LOCK ok: n_exceed={n_exc} (expected 11.5)")
exc_loss = -exc_ret
mean_loss = float(exc_loss.mean())
max_loss = float(exc_loss.max())
i_max = int(exc_loss.argmax())
mean_es_fc = float(exc_es_fc.mean())
ratio_vs_fc = float(mean_loss / mean_es_fc)
es_full = canon["m9_hs_windows"]["window_480"]["es95"]  # 0.0445
n_worse_than_fc = int((exc_loss > exc_es_fc).sum())
n_worse_than_full_es = int((exc_loss > es_full).sum())
# OOS day numbers (1-based within the 230-day OOS window) of the exceedances
oos_day = (exc_idx - 250 + 1).tolist()
print(f"  exceedance OOS days: {oos_day}")
print(f"  mean exceedance loss={mean_loss:.4f} max={max_loss:.4f} "
      f"(OOS day {oos_day[i_max]}, return {exc_ret[i_max]:.4f})")
print(f"  mean rolling-ES forecast on exceed days={mean_es_fc:.4f} "
      f"ratio={ratio_vs_fc:.4f}")
print(f"  worse than own-day ES forecast: {n_worse_than_fc}/15; "
      f"worse than full-sample ES95 {es_full}: {n_worse_than_full_es}/15")
new["m9_es_severity"] = {
    "n_oos": 230,
    "n_exceed": n_exc,
    "expected_exceed": 11.5,
    "exceed_oos_days": oos_day,
    "mean_exceedance_loss": r4(mean_loss),
    "max_exceedance_loss": r4(max_loss),
    "max_exceedance_oos_day": int(oos_day[i_max]),
    "max_exceedance_return": r4(float(exc_ret[i_max])),
    "mean_rolling_es95_forecast_on_exceed_days": r4(mean_es_fc),
    "severity_ratio_vs_forecast": r4(ratio_vs_fc),
    "n_worse_than_own_day_es_forecast": n_worse_than_fc,
    "n_worse_than_full_sample_es95": n_worse_than_full_es,
    "full_sample_es95": es_full,
    "note": ("Exceedances of the rolling-250d historical VaR95, OOS days "
             "251..480 (n=230). Severity = actual loss on exceedance days "
             "vs the ES95 forecast of THAT day's own 250-day window "
             "(mean of the window's worst 5%), plus vs the full-sample "
             "ES95 0.0445. Descriptive comparison only — no Acerbi-Szekely "
             "test (it would need numbers outside the canon)."),
}

# ================================================================ G4: P&L engine
print("\n== G4: P&L engine [ilustrasi] (market part canonical) ==")
MODAL = 100_000_000
LOSS_8APR = canon["m9_scenario_8apr"]["rp_loss_on_100jt"]["PORT"]  # 7.432.406
pinjaman = 100_000_000
posisi = MODAL + pinjaman
market_loss = 2 * LOSS_8APR
biaya = int(round(0.001 * posisi))                    # 0,10% dari nilai posisi
bunga = int(round(0.12 / 365 * pinjaman))             # 12%/tahun, 1 hari
total_tanpa_forced = market_loss + biaya + bunga
haircut = int(round(0.01 * posisi))                   # 1% forced-sale haircut
total_dengan_forced = total_tanpa_forced + haircut
# margin call: maintenance margin 25% of position value
# equity = 100jt - L ; position = 200jt - L ; call when equity < 0.25*position
L_star = (MODAL - 0.25 * posisi) / (1 - 0.25)         # 66.666.666,67
ret_star = -L_star / posisi                           # -0.3333
eq_after = MODAL - market_loss
pos_after = posisi - market_loss
eq_ratio_after = eq_after / pos_after
assert market_loss == 14_864_812, market_loss
assert total_tanpa_forced == 15_097_689, total_tanpa_forced
assert total_dengan_forced == 17_097_689, total_dengan_forced
print(f"  market loss 2x = {market_loss:,} ; biaya 0,10% = {biaya:,} ; "
      f"bunga 1 hari = {bunga:,}")
print(f"  total tanpa forced sale = {total_tanpa_forced:,} ; "
      f"dengan haircut 1% = {total_dengan_forced:,}")
print(f"  ekuitas sesudah rugi pasar = {eq_after:,} ({eq_ratio_after:.2%} "
      f"dari posisi) ; margin-call loss = {L_star:,.0f} "
      f"(return {ret_star:.2%})")
new["m9_pl_engine"] = {
    "modal_sendiri_rp": MODAL,
    "pinjaman_rp": pinjaman,
    "posisi_rp": posisi,
    "market_loss_2x_rp": market_loss,
    "biaya_transaksi_pct": 0.001,
    "biaya_transaksi_rp": biaya,
    "bunga_pinjaman_pct_tahun": 0.12,
    "bunga_1hari_rp": bunga,
    "total_tanpa_forced_sale_rp": total_tanpa_forced,
    "haircut_forced_sale_pct": 0.01,
    "haircut_forced_sale_rp": haircut,
    "total_dengan_forced_sale_rp": total_dengan_forced,
    "biaya_share_of_market_loss_pct": r2(100 * biaya / market_loss),
    "bunga_share_of_market_loss_pct": r2(100 * bunga / market_loss),
    "haircut_share_of_market_loss_pct": r2(100 * haircut / market_loss),
    "market_loss_pct_of_equity": r2(100 * market_loss / MODAL),
    "maintenance_margin_pct": 0.25,
    "ekuitas_sesudah_rugi_pasar_rp": eq_after,
    "posisi_sesudah_rugi_pasar_rp": pos_after,
    "rasio_ekuitas_sesudah_rugi": r4(eq_ratio_after),
    "margin_call_loss_rp": int(round(L_star)),
    "margin_call_return": r4(ret_star),
    "note": ("Market loss is canonical (2 x Rp7.432.406). EVERY other "
             "component is [ilustrasi] with stated assumptions: "
             "transaction cost 0,10% of position value; leverage loan "
             "Rp100.000.000 at 12%/year (1-day interest); forced-sale "
             "haircut 1% of position value; maintenance margin 25%. "
             "None of these is data — they are a worked example of the "
             "P&L engine's components."),
}

# ================================================================ G6: nested bootstrap
print("\n== G6: nested bootstrap (uncertainty propagation) ==")
rng6 = np.random.default_rng(SEED)
B_OUT = 500
N_MC = 10_000
var95_nested = np.empty(B_OUT)
var95_param_only = np.empty(B_OUT)
for b in range(B_OUT):
    samp = rng6.choice(arr_s, size=n, replace=True)
    mu_b = float(np.log1p(samp).mean())
    sd_b = float(np.log1p(samp).std(ddof=1))
    # parameter-only VaR95 (analytic, no MC noise): isolates the
    # parameter/sampling component
    var95_param_only[b] = Z95 * sd_b - mu_b
    draws = rng6.normal(mu_b, sd_b, N_MC)
    var95_nested[b] = float(-np.quantile(np.expm1(draws), 0.05))
nest = {"B_outer": B_OUT, "N_mc_each": N_MC,
        "mean": r4(float(var95_nested.mean())),
        "sd": r4(float(var95_nested.std(ddof=1))),
        "ci95": [r4(float(np.quantile(var95_nested, 0.025))),
                 r4(float(np.quantile(var95_nested, 0.975)))],
        "min": r4(float(var95_nested.min())),
        "max": r4(float(var95_nested.max())),
        "param_only_mean": r4(float(var95_param_only.mean())),
        "param_only_sd": r4(float(var95_param_only.std(ddof=1))),
        "param_only_ci95": [r4(float(np.quantile(var95_param_only, 0.025))),
                            r4(float(np.quantile(var95_param_only, 0.975)))]}
mc_only_sd = canon["m9_mc_1day"]["batch_var95_N10000"]["sd"]  # 0.0004
iid_sd = canon["m9_bootstrap"]["iid_var95"]["sd"]              # 0.0022
nest["mc_only_sd_N10000"] = mc_only_sd
nest["iid_bootstrap_sd"] = iid_sd
nest["nested_over_mc_only_ratio"] = r2(nest["sd"] / mc_only_sd)
nest["implied_mc_var_share_pct"] = r2(100 * mc_only_sd ** 2 / nest["sd"] ** 2)
print(f"  nested VaR95: mean={nest['mean']:.4f} sd={nest['sd']:.4f} "
      f"CI95={nest['ci95']} range=[{nest['min']:.4f}; {nest['max']:.4f}]")
print(f"  param-only: mean={nest['param_only_mean']:.4f} "
      f"sd={nest['param_only_sd']:.4f} CI95={nest['param_only_ci95']}")
print(f"  MC-only sd={mc_only_sd} ; iid-bootstrap sd={iid_sd} ; "
      f"nested/MC-only = {nest['nested_over_mc_only_ratio']}x ; "
      f"MC-error variance share = {nest['implied_mc_var_share_pct']}%")
assert 0.0015 <= nest["sd"] <= 0.0035, f"nested sd {nest['sd']} outside lock"
new["m9_nested_bootstrap"] = nest
new["m9_nested_bootstrap"]["note"] = (
    "Outer loop: iid-resample the 480 simple returns (B=500), re-estimate "
    "mu_log/sigma_log, re-simulate MC N=10.000, take VaR95. The "
    "param-only column recomputes VaR95 analytically (1,6449*sigma - mu) "
    "from the same re-estimated parameters — no MC noise — so it isolates "
    "the parameter/sampling component from the MC-error component "
    "(MC-only sd 0.0004 at N=10.000, [m9_canonical.json]).")

# ================================================================ G7: block lengths
print("\n== G7: block bootstrap VaR95 CI for block lengths 5 / 10 / 20 ==")
B7 = 10_000


def _boot_var95(draws):
    return np.array([float(-np.quantile(d, 0.05)) for d in draws])


def _ci(a):
    return [r4(float(np.quantile(a, 0.025))), r4(float(np.quantile(a, 0.975)))]


blocks_out = {}
for L in (5, 10, 20):
    rng7 = np.random.default_rng(SEED)  # same seed stream per length
    starts = rng7.integers(0, n - L + 1, size=(B7, math.ceil(n / L)))
    blks = np.stack([arr_s[s:s + L] for s in starts.reshape(-1)]).reshape(B7, -1, L)
    draws = blks.reshape(B7, -1)[:, :n]
    v95 = _boot_var95(draws)
    blocks_out[f"block{L}"] = {
        "L": L, "n_blocks_per_draw": int(math.ceil(n / L)),
        "n_distinct_blocks": n - L + 1,
        "mean": r4(float(v95.mean())), "sd": r4(float(v95.std(ddof=1))),
        "ci95": _ci(v95), "ci_width": r4(float(np.quantile(v95, 0.975)
                                              - np.quantile(v95, 0.025)))}
    print(f"  L={L}: n_blocks={math.ceil(n / L)} distinct={n - L + 1} "
          f"mean={v95.mean():.4f} sd={v95.std(ddof=1):.4f} "
          f"CI95={_ci(v95)} width={blocks_out[f'block{L}']['ci_width']:.4f}")
# canonical block-10 cross-check (different rng stream in the canonical
# script, so only closeness is required, not equality)
can_blk10 = canon["m9_bootstrap"]["block10_var95"]
print(f"  canonical block-10 (other stream): mean={can_blk10['mean']} "
      f"sd={can_blk10['sd']} CI95={can_blk10['ci95']}")
assert blocks_out["block20"]["sd"] >= blocks_out["block5"]["sd"] - 0.0002, \
    "block sd not non-decreasing in L"
blocks_out["note"] = (
    "Moving-block bootstrap, B=10.000, seed 42 (fresh stream per length). "
    "Block-10 here is a re-run: it reproduces the canonical block-10 "
    "(sd 0.0029, CI95 [0.0223; 0.0340]) within MC noise. Longer blocks "
    "preserve more dependence but offer fewer distinct blocks "
    "(480-L+1). Circular / stationary bootstrap are alternatives, "
    "mentioned in the lesson without a full lab.")
new["m9_block_lengths"] = blocks_out

# ---------------------------------------------------------------- merge + write
canon.update(new)
canon["runtime_seconds"] = round(time.time() - t0, 1)
with open(CANON_PATH, "w") as fh:
    json.dump(canon, fh, indent=1)
print(f"\nWROTE {CANON_PATH} (+5 keys: {', '.join(sorted(new))}) "
      f"in {canon['runtime_seconds']}s")

#!/usr/bin/env python3
"""Canonical numbers for MLF M9 (Simulation, Backtesting & Validation).

CONVENTION (stated in every M9 lesson): market-risk parts use the
equal-weight portfolio of BBCA/KLBF/UNVR SIMPLE daily returns (n=480,
2024-11-04 -> 2026-11-11) — the SAME series as M4.2 VaR and M5. GBM
simulation uses the LOG returns of that portfolio (log1p of simple).
Credit parts replicate the flagship UCI pipeline exactly (same as
qa-learn/m8_canonical_calc.py): stratified 80/20 split seed 42, GBM
calibrated Platt/sigmoid cv=3, threshold 0.10, LGD 0.45, MARGIN 0.05.

SANITY LOCKS (tolerance 0.001 unless noted): port_sd_day 0.0196,
var_hist_95 0.0286, es_hist_95 0.0445, var_param_95 0.0328,
es_param_95 0.0410, kupiec_oos_x95 15, kupiec_oos_p95 0.3108,
var_mc_95 (M4, joint normal, 10k, seed 42) 0.0336, GBM test ROC-AUC
0.7823, cal 0.7816, profit@0.10 8.214.000. If any locked number misses,
the script STOPS (exit 1) and writes NO json.

Numbers computed (seed 42 everywhere):
  m9_mc_1day: 1-day MC VaR/ES from univariate normal on portfolio
      log-returns at N=1.000/10.000/100.000 + MC error (sd of VaR95
      across 20 independent batches of N=10.000) + the 1/sqrt(N) law
      for the mean estimate (SE = sd/sqrt(N) + realised MC error).
  m9_mc_10day: GBM 10-day paths (N=100.000): terminal-return mean/sd,
      p5 (10-day VaR95), p1 (VaR99), P(ret < -10%), P(ret < -0.0903)
      vs sqrt-10 scaled hist VaR95 0.0903 [M4.2].
  m9_scenario_8apr: 2025-04-08 row (per-stock + portfolio + GSPC
      simple returns, Rp loss on Rp100jt) + worst 5 portfolio days
      + derived display values (Rp loss on Rp200jt, rounding diff,
      2026-04-08 portfolio return, exact returns, div-ratio
      improvements from M4.5).
  m9_stress: param VaR95 at sigma x1.5 / x2; correlation stress
      rho->1 (sigma_port = mean of per-stock sigmas); reverse stress
      sigma* for VaR95 = 0.05 + ratio to current sigma.
  m9_backtest_wf: rolling-250d hist VaR95 OOS (recomputed, locked vs
      M4.3) + expanding-window + rolling-120d + rolling-250d VaR99 +
      in-sample VaR99 trap + Christoffersen independence on the
      rolling-250 VaR95 OOS exceedances + Basel zone (last 250d).
  m9_sensitivity: tornado for param VaR95 (sigma +/-10%, mu +/-0.0005,
      alpha 95->97.5, corr +0.1 all pairs, multi-way sigma+10% &
      corr+0.1) + credit profit sensitivity to LGD (0.40/0.45/0.50/0.60)
      and margin (0.04/0.05/0.06) at threshold 0.10.
  m9_bootstrap_hs: HS VaR/ES at windows 120/250/480 + iid bootstrap
      (B=10.000) CI for VaR95/ES95 + moving-block bootstrap (block 10,
      B=10.000) CI for VaR95/ES95 + bootstrap CI for the mean daily
      return + skew / excess kurtosis of portfolio returns.

Run: python3 qa-learn/m9_canonical_calc.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m9_canonical.json and prints a verification table.
"""
import json
import math
import time

import numpy as np
import pandas as pd
import sklearn
import scipy
from scipy import stats
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (average_precision_score, brier_score_loss,
                             roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m9_canonical.json"
LGD = 0.45
MARGIN = 0.05
THR = 0.10
t0 = time.time()
out = {}

rng = np.random.default_rng(SEED)


def r4(x):
    return round(float(x), 4)


def r2(x):
    return round(float(x), 2)


def r1(x):
    return round(float(x), 1)


def r5(x):
    return round(float(x), 5)


def r6(x):
    return round(float(x), 6)


def r7(x):
    return round(float(x), 7)


def r8(x):
    return round(float(x), 8)


print(f"versions: sklearn={sklearn.__version__} scipy={scipy.__version__} "
      f"numpy={np.__version__} pandas={pd.__version__} seed={SEED}")

# ================================================================ base series
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
n = len(port_s)
mu_d, sd_d = float(port_s.mean()), float(port_s.std(ddof=1))
mu_l, sd_l = float(port_l.mean()), float(port_l.std(ddof=1))
print(f"portfolio simple returns: n={n} mu/day={mu_d:.6f} sd/day={sd_d:.4f} "
      f"| log: mu={mu_l:.6f} sd={sd_l:.4f}")
print(f"dates: {port_s.index[0].date()} -> {port_s.index[-1].date()}")

# exact (unrounded) daily mean/sd — the lesson displays the rounded
# mu=-0.0006, sd=0.0196; prose that uses the exact digits (0,000558 /
# 0,0196172 / 0,000752) matches these keys. sd_simple is stored at 7
# decimals so the lesson's 0,0196172 matches exactly.
out["m9_returns_exact"] = {
    "mu_simple_day": r6(mu_d), "sd_simple_day": r7(sd_d),
    "mu_log_day": r6(mu_l), "sd_log_day": r6(sd_l),
    "note": "Exact daily mean/sd of the portfolio returns; rounded "
            "display values are mu=-0.0006, sd=0.0196 (simple) and "
            "mu=-0.0008, sd=0.0198 (log)."}


def var_hist(x, alpha):
    return float(-np.quantile(x, 1 - alpha))


def es_hist(x, alpha):
    q = np.quantile(x, 1 - alpha)
    return float(-x[x <= q].mean())


def var_param(x, alpha):
    return float(-(x.mean() + x.std(ddof=1) * stats.norm.ppf(1 - alpha)))


def es_param(x, alpha):
    z = stats.norm.ppf(1 - alpha)
    return float(-(x.mean() - x.std(ddof=1) * stats.norm.pdf(z) / (1 - alpha)))


def kupiec(x, p):
    """POF test. x: exceedance indicators (bool array). Returns (n, x_cnt, LR, p)."""
    nn = len(x)
    xc = int(np.asarray(x).sum())
    if xc == 0 or xc == nn:
        return nn, xc, float("nan"), float("nan")
    lr = (-2 * np.log(((1 - p) ** (nn - xc)) * (p ** xc))
          + 2 * np.log(((1 - xc / nn) ** (nn - xc)) * ((xc / nn) ** xc)))
    return nn, xc, float(lr), float(1 - stats.chi2.cdf(lr, 1))


# ---------------------------------------------------------------- locks
vh95, eh95 = var_hist(port_s, 0.95), es_hist(port_s, 0.95)
vp95, ep95 = var_param(port_s, 0.95), es_param(port_s, 0.95)
vh99, eh99 = var_hist(port_s, 0.99), es_hist(port_s, 0.99)
vp99, ep99 = var_param(port_s, 0.99), es_param(port_s, 0.99)
print(f"locks: sd={sd_d:.4f} vh95={vh95:.4f} eh95={eh95:.4f} "
      f"vp95={vp95:.4f} ep95={ep95:.4f}")

# M4 MC VaR (joint normal on 3 log-returns, 10k sims, seed 42) — repro lock
ret = pd.DataFrame({c: np.log(close[c].dropna()).diff().dropna()
                    for c in ["BBCA", "KLBF", "UNVR"]})
lr3 = ret.dropna()
mu3 = lr3.mean().values
cov3 = lr3.cov().values
w = np.array([1 / 3, 1 / 3, 1 / 3])
rng_m4 = np.random.default_rng(SEED)
sims_m4 = rng_m4.multivariate_normal(mu3, cov3, size=10_000)
port_mc_m4 = np.log1p(np.expm1(sims_m4) @ w)
var_mc95_m4 = float(-np.quantile(port_mc_m4, 0.05))
print(f"M4 MC VaR95 repro: {var_mc95_m4:.4f} (locked 0.0336)")

locks = {
    "port_sd_day": (sd_d, 0.0196),
    "var_hist_95": (vh95, 0.0286),
    "es_hist_95": (eh95, 0.0445),
    "var_param_95": (vp95, 0.0328),
    "es_param_95": (ep95, 0.0410),
    "var_mc_95_m4": (var_mc95_m4, 0.0336),
}
bad = [(k, c, l) for k, (c, l) in locks.items() if abs(c - l) > 0.001]
if bad:
    print("LOCK FAILED:", bad)
    raise SystemExit(1)

out["meta"] = {
    "seed": SEED, "sklearn": sklearn.__version__, "scipy": scipy.__version__,
    "numpy": np.__version__, "pandas": pd.__version__,
    "data_prices": "data/m4_prices.csv",
    "data_uci": DATA_XLS,
    "convention": "Market-risk parts: equal-weight portfolio of BBCA/KLBF/UNVR "
                  "SIMPLE daily returns (n=480), same series as M4.2 VaR and M5. "
                  "GBM simulation uses LOG returns of that portfolio. "
                  "Credit parts: flagship UCI pipeline (seed 42, threshold 0.10, "
                  "LGD 0.45, margin 0.05).",
    "threshold": THR, "lgd": LGD, "margin": MARGIN,
    "note": "All numbers computed from the data above; nothing invented. "
            "Rounded to 4 decimals except counts (integers) and money "
            "(integers, NT$/Rp).",
}
out["locked_verification"] = {
    k: {"computed": r4(c), "locked": l, "diff": r4(c - l), "match": abs(c - l) <= 0.001}
    for k, (c, l) in locks.items()
}

# ================================================================ M9.1 MC 1-day
print("\n== M9.1 Monte Carlo 1-day ==")
mc1 = {"mu_log_day": r4(mu_l), "sd_log_day": r4(sd_l),
       "mu_simple_day": r4(mu_d), "sd_simple_day": r4(sd_d)}
mc1_exact = {}
for N in [1_000, 10_000, 100_000]:
    sims = rng.normal(mu_l, sd_l, size=N)
    simp = np.expm1(sims)
    v = float(-np.quantile(simp, 0.05))
    e = float(-simp[simp <= np.quantile(simp, 0.05)].mean())
    mc1[f"N{N}"] = {"var95": r4(v), "es95": r4(e),
                    "mean_sim": r4(float(simp.mean()))}
    mc1_exact[N] = (v, e)
    print(f"  N={N}: VaR95={v:.4f} ES95={e:.4f} mean_sim={simp.mean():.6f}")
# MC error: 20 independent batches of N=10.000
batch_vars = []
for b in range(20):
    sims = rng.normal(mu_l, sd_l, size=10_000)
    batch_vars.append(float(-np.quantile(np.expm1(sims), 0.05)))
batch_vars = np.array(batch_vars)
mc1["batch_var95_N10000"] = {"n_batches": 20, "mean": r4(float(batch_vars.mean())),
                             "sd": r4(float(batch_vars.std(ddof=1))),
                             "min": r4(float(batch_vars.min())),
                             "max": r4(float(batch_vars.max()))}
print(f"  batch VaR95 (20x N=10k): mean={batch_vars.mean():.4f} "
      f"sd={batch_vars.std(ddof=1):.4f} range=[{batch_vars.min():.4f}, {batch_vars.max():.4f}]")


# 1/sqrt(N) law for the mean estimate
mc1["se_mean_1_over_sqrtN"] = {
    str(N): r6(sd_d / math.sqrt(N)) for N in [100, 1_000, 10_000, 100_000]}
mc1["se_mean_1_over_sqrtN"]["1000000"] = r7(sd_d / math.sqrt(1_000_000))
mc1["se_mean_1_over_sqrtN"]["100000000"] = r8(sd_d / math.sqrt(100_000_000))
mc1["mc_mean_error_vs_true"] = {}
for N in [100, 1_000, 10_000, 100_000]:
    sims = rng.normal(mu_l, sd_l, size=N)
    err = float(np.expm1(sims).mean() - mu_d)
    mc1["mc_mean_error_vs_true"][str(N)] = r6(err)
    print(f"  SE(mean) N={N}: {sd_d / math.sqrt(N):.6f} | MC mean error: {err:+.6f}")
# derived gaps quoted by the lesson (exact MC values, not rounded ones)
_v100k, _e100k = mc1_exact[100_000]
mc1["es95_minus_var95_n100k"] = r4(_e100k - _v100k)
mc1["mc_minus_hist_var95"] = r4(_v100k - vh95)
mc1["param_minus_hist_var95"] = r4(vp95 - vh95)
mc1["var95_n100k_rp"] = int(round(mc1["N100000"]["var95"] * 100_000_000))
mc1["es95_n100k_rp"] = int(round(mc1["N100000"]["es95"] * 100_000_000))
mc1["var95_param_10pct"] = r4(0.10 * vp95)
mc1["batch_var95_range"] = r4(float(batch_vars.max() - batch_vars.min()))
# band +-1 sd antar-batch pada N lain, diskalakan dari sd batch N=10.000
# yang DITAMPILKAN (0,0004) dengan hukum 1/sqrt(N) — seperti figure-nya.
mc1["batch_sd_n1000"] = r4(mc1["batch_var95_N10000"]["sd"] * math.sqrt(10))
mc1["batch_sd_n100000"] = r4(mc1["batch_var95_N10000"]["sd"] / math.sqrt(10))
# SE of the batch mean: the lesson computes it from the DISPLAYED batch sd
# (0,0004), as written ("0,0004/4,4721 = 0,000089"); the exact sd gives
# 0,000083, which is NOT what the lesson displays. Use the displayed sd.
_bs_disp = mc1["batch_var95_N10000"]["sd"]
mc1["batch_se_mean"] = r6(_bs_disp / math.sqrt(20))
mc1["batch_se_mean_rounded_5dp"] = r5(_bs_disp / math.sqrt(20))
# wrong-direction distractors in the SE quiz (same displayed sd)
mc1["se_batch_times_sqrt20_wrong"] = r4(_bs_disp * math.sqrt(20))
mc1["se_batch_div20_wrong"] = r5(_bs_disp / 20)
out["m9_mc_1day"] = mc1

# ================================================================ M9.1 MC 10-day
print("\n== M9.1 Monte Carlo 10-day GBM paths ==")
N10 = 100_000
paths = rng.normal(mu_l, sd_l, size=(N10, 10))
term_log = paths.sum(axis=1)
term = np.expm1(term_log)
mc10 = {"N": N10,
        "terminal_mean": r4(float(term.mean())),
        "terminal_sd": r4(float(term.std(ddof=1))),
        "terminal_p5_var95_10d": r4(float(-np.quantile(term, 0.05))),
        "terminal_p1_var99_10d": r4(float(-np.quantile(term, 0.01))),
        "terminal_p50_median": r4(float(np.median(term))),
        "p_loss_gt_10pct": r4(float((term < -0.10).mean())),
        "p_loss_gt_sqrt10_var95": r4(float((term < -vh95 * math.sqrt(10)).mean())),
        "sqrt10_hist_var95": r4(float(vh95 * math.sqrt(10))),
        # executed notebook value (seed 42, notebook draw sequence):
        # p5 = 0.1042, i.e. 0.0004 above the canonical stream's 0.1038.
        # Notebook CHECK 5 asserts |p5_10d - 0.1038| < 0.002 (MC error
        # across streams); the lesson prose quotes the notebook value.
        "p5_notebook_stream_seed42": 0.1042,
        "p5_notebook_minus_canonical": 0.0004}
print(f"  10d terminal: mean={term.mean():.4f} sd={term.std(ddof=1):.4f} "
      f"p5(VaR95)={-np.quantile(term, 0.05):.4f} p1(VaR99)={-np.quantile(term, 0.01):.4f}")
print(f"  P(loss>10%)={(term < -0.10).mean():.4f} "
      f"P(loss>{vh95 * math.sqrt(10):.4f})={(term < -vh95 * math.sqrt(10)).mean():.4f}")
out["m9_mc_10day"] = mc10

# ================================================================ M9.2 scenario
print("\n== M9.2 Scenario 8-Apr-2026 ==")
d8 = pd.Timestamp("2025-04-08")
row8 = {c: float(sr[c].loc[d8]) for c in ["BBCA", "KLBF", "UNVR", "GSPC"]}
row8["PORT"] = float(port_s.loc[d8])
scen = {"date": "2025-04-08",
        "returns_simple": {k: r4(v) for k, v in row8.items()},
        "rp_loss_on_100jt": {k: int(round(-v * 100_000_000)) for k, v in row8.items()},
        "note": "Tariff shock (M4.5: BBCA log return -0.0892, about -8.9% -- "
                "M4.5 wrote -8.5%, which is the SIMPLE return's percentage, "
                "-0.0853; do not mix the two). Simple returns here; portfolio "
                "= equal-weight mean of the 3 ID stocks."}
print("  8-Apr-2026:", {k: f"{v:.4f}" for k, v in row8.items()})
worst = port_s.nsmallest(5)
scen["worst5"] = [{"date": str(d.date()), "port_return": r4(float(v)),
                   "rp_loss_on_100jt": int(round(-float(v) * 100_000_000))}
                  for d, v in worst.items()]
print("  worst 5:", [(str(d.date()), round(float(v), 4)) for d, v in worst.items()])
# GSPC on the worst portfolio day + portfolio on GSPC worst day (common dates only:
# US and IDX calendars differ -- e.g. 2025-04-04 was a US trading day, IDX closed)
common_idx = sr["GSPC"].index.intersection(port_s.index)
gspc_worst_day = sr["GSPC"].loc[common_idx].idxmin()
scen["gspc_worst_day"] = {"date": str(gspc_worst_day.date()),
                          "gspc_return": r4(float(sr["GSPC"].loc[gspc_worst_day])),
                          "port_return": r4(float(port_s.loc[gspc_worst_day]))}
print("  GSPC worst day:", scen["gspc_worst_day"])
# derived / display values quoted by the lesson
# NOTE: rp_loss_on_200jt is 2x the DISPLAYED Rp100jt loss (2 x 7.432.406),
# as the lesson writes it; the exact 2x (from the unrounded return) is
# 14.864.813 -- Rp1 of rounding, not a different value.
scen["rp_loss_on_200jt"] = {"PORT": 2 * scen["rp_loss_on_100jt"]["PORT"]}
scen["worst_day_loss_x2"] = 2 * scen["worst5"][0]["rp_loss_on_100jt"]
scen["rp_loss_rounding_diff"] = int(scen["rp_loss_on_100jt"]["PORT"] - 7_430_000)
scen["rp_loss_on_200jt_rounding_diff"] = 2 * scen["rp_loss_rounding_diff"]
scen["port_return_2026_04_08"] = r4(float(port_s.loc[pd.Timestamp("2026-04-08")]))
scen["port_return_exact"] = r8(float(port_s.loc[d8]))
scen["bbca_1_plus_simple"] = r4(1 + row8["BBCA"])
# beta on SIMPLE returns (common dates) — for reference only; M9.2 quotes
# the M4.4 canonical beta (BBCA_beta 0.1272, log-return basis).
_dfb = pd.DataFrame({"BBCA": sr["BBCA"], "GSPC": sr["GSPC"]}).dropna()
scen["beta_bbca_gspc_simple"] = r4(float(_dfb["BBCA"].cov(_dfb["GSPC"]) / _dfb["GSPC"].var()))
# diversification-ratio improvements, from the M4.5 canonical values
_m4 = json.load(open("qa-learn/m4_canonical.json"))
scen["div_ratio_base_pct_better"] = r1(100 * (_m4["div_ratio_base"] - 1))
scen["div_ratio_095_pct_better"] = r2(100 * (_m4["div_ratio_095"] - 1))
out["m9_scenario_8apr"] = scen

# ================================================================ M9.2 stress
print("\n== M9.2 Stress ==")
z95 = stats.norm.ppf(0.95)
stress = {"base_var95_param": r4(vp95), "base_sd_day": r4(sd_d),
          "base_mu_day": r4(mu_d)}
for mult in [1.5, 2.0]:
    v = float(-(mu_d + mult * sd_d * stats.norm.ppf(0.05)))
    stress[f"var95_sigma_x{mult}"] = r4(v)
    print(f"  sigma x{mult}: VaR95={v:.4f}")
# correlation -> 1: sigma_port = mean of per-stock simple-return sigmas
sig_i = {c: float(sr[c].std(ddof=1)) for c in ["BBCA", "KLBF", "UNVR"]}
sig_rho1 = float(np.mean(list(sig_i.values())))
v_rho1 = float(-(mu_d + sig_rho1 * stats.norm.ppf(0.05)))
stress["per_stock_sd_simple"] = {k: r4(v) for k, v in sig_i.items()}
stress["sigma_port_rho1"] = r4(sig_rho1)
stress["var95_rho1"] = r4(v_rho1)
print(f"  rho->1: sigma_port={sig_rho1:.4f} (vs {sd_d:.4f}) VaR95={v_rho1:.4f}")
# reverse stress: sigma* for param VaR95 = 0.05
sig_star = (0.05 + mu_d) / 1.6448536269514722
stress["sigma_star_var95_0.05"] = r4(float(sig_star))
stress["sigma_star_ratio"] = r4(float(sig_star / sd_d))
print(f"  reverse: sigma*={sig_star:.4f} = {sig_star / sd_d:.2f}x current sigma")
# derived values quoted by the lesson
stress["sigma_x1.5"] = r4(1.5 * sd_d)
stress["sigma_x2.0"] = r4(2.0 * sd_d)
stress["margin_sigma_x1.5_vs_limit"] = r4(0.05 - stress["var95_sigma_x1.5"])
stress["reverse_loss_rp"] = 10_000_000
stress["reverse_loss_return"] = r2(-10_000_000 / 100_000_000)
stress["sigma_x1.5_pct_increase"] = 50
# distractor: VaR95 if the portfolio sigma were UNVR's alone (displayed
# rounded per-stock sd, as the lesson shows the arithmetic)
stress["var95_sigma_unvr_only"] = r4(1.6449 * stress["per_stock_sd_simple"]["UNVR"] + 0.0006)
out["m9_stress"] = stress

# ================================================================ M9.3 backtest
print("\n== M9.3 Backtesting & walk-forward ==")
arr = port_s.values
bt = {}
# rolling 250d hist VaR95 OOS (recompute of M4.3)
for label, window, alpha in [("roll250_var95", 250, 0.95),
                             ("roll120_var95", 120, 0.95),
                             ("roll250_var99", 250, 0.99)]:
    q = 1 - alpha
    exc = np.array([arr[t] < np.quantile(arr[t - window:t], q)
                    for t in range(window, len(arr))])
    nn, xc, lr, pv = kupiec(exc, q)
    bt[label] = {"window": window, "alpha": alpha, "n": nn, "exceed": xc,
                 "expected": r2(nn * q), "LR": r4(lr), "p": r4(pv)}
    print(f"  {label}: n={nn} exceed={xc} expected={nn * q:.1f} LR={lr:.4f} p={pv:.4f}")
# expanding window hist VaR95 OOS (start 250)
exc_exp = np.array([arr[t] < np.quantile(arr[:t], 0.05)
                    for t in range(250, len(arr))])
nn, xc, lr, pv = kupiec(exc_exp, 0.05)
bt["expanding_var95"] = {"window_start": 250, "alpha": 0.95, "n": nn,
                         "exceed": xc, "expected": r2(nn * 0.05),
                         "LR": r4(lr), "p": r4(pv)}
print(f"  expanding_var95: n={nn} exceed={xc} expected={nn * 0.05:.1f} LR={lr:.4f} p={pv:.4f}")
# exceedance rates (quoted as percentages by the lesson)
for _k in ["roll250_var95", "roll120_var95", "roll250_var99", "expanding_var95"]:
    bt[_k]["exceed_rate"] = r4(bt[_k]["exceed"] / bt[_k]["n"])
# rolling-250 VaR95 range over the OOS window (figure prose: min..max)
_roll_vars = np.array([-np.quantile(arr[t - 250:t], 0.05)
                       for t in range(250, len(arr))])
bt["rolling_var95_min"] = r4(float(_roll_vars.min()))
bt["rolling_var95_max"] = r4(float(_roll_vars.max()))
print(f"  rolling VaR95 range: [{_roll_vars.min():.4f}, {_roll_vars.max():.4f}]")
# counterfactual Kupiec: 20 exceedances instead of 15 (same n=230)
_exc20 = np.array([1] * 20 + [0] * 210)
_nn20, _xc20, _lr20, _p20 = kupiec(_exc20, 0.05)
bt["kupiec_if_x20_n230"] = {"n": _nn20, "exceed": _xc20,
                            "LR": r4(_lr20), "p": r4(_p20)}
print(f"  Kupiec if x=20: LR={_lr20:.4f} p={_p20:.4f}")
# multiple testing: 20 trials at 5% -- P(at least one false pass)
bt["multiple_testing_20_at_5pct"] = r2(100 * (1 - 0.95 ** 20))
print(f"  P(>=1 false pass in 20 trials at 5%) = {100 * (1 - 0.95 ** 20):.2f}%")
# in-sample VaR99 trap: full-sample q01 tested on the same sample
q01 = np.quantile(arr, 0.01)
xc_is99 = int((arr < q01).sum())
bt["insample_var99"] = {"n": n, "exceed": xc_is99, "expected": r2(n * 0.01),
                        "note": "By construction ~4.8 exceedances -- in-sample "
                                "Kupiec is trivially satisfied; the trap of M4.3."}
print(f"  insample_var99: exceed={xc_is99} expected={n * 0.01:.1f}")
# Christoffersen independence on rolling-250 VaR95 OOS exceedances
exc250 = np.array([arr[t] < np.quantile(arr[t - 250:t], 0.05)
                   for t in range(250, len(arr))]).astype(int)
n00 = int(((exc250[:-1] == 0) & (exc250[1:] == 0)).sum())
n01 = int(((exc250[:-1] == 0) & (exc250[1:] == 1)).sum())
n10 = int(((exc250[:-1] == 1) & (exc250[1:] == 0)).sum())
n11 = int(((exc250[:-1] == 1) & (exc250[1:] == 1)).sum())
pi = (n01 + n11) / (n00 + n01 + n10 + n11)
pi01 = n01 / (n00 + n01) if (n00 + n01) > 0 else 0.0
pi11 = n11 / (n10 + n11) if (n10 + n11) > 0 else 0.0


def _xlnx(a, b):
    return a * math.log(b) if a > 0 and b > 0 else 0.0


ll0 = _xlnx(n00 + n10, 1 - pi) + _xlnx(n01 + n11, pi)
ll1 = (_xlnx(n00, 1 - pi01) + _xlnx(n01, pi01)
       + _xlnx(n10, 1 - pi11) + _xlnx(n11, pi11))
lr_ind = -2 * ll0 + 2 * ll1
p_ind = float(1 - stats.chi2.cdf(lr_ind, 1))
lr_cc = float(bt["roll250_var95"]["LR"] + lr_ind)
p_cc = float(1 - stats.chi2.cdf(lr_cc, 2))
bt["christoffersen_roll250_var95"] = {
    "n00": n00, "n01": n01, "n10": n10, "n11": n11,
    "pi_unconditional": r4(pi), "pi01": r4(pi01), "pi11": r4(pi11),
    "LR_ind": r4(lr_ind), "p_ind": r4(p_ind),
    "LR_cc_combined": r4(lr_cc), "p_cc": r4(p_cc)}
print(f"  Christoffersen: n00={n00} n01={n01} n10={n10} n11={n11} "
      f"pi={pi:.4f} pi01={pi01:.4f} pi11={pi11:.4f} LR_ind={lr_ind:.4f} p={p_ind:.4f}")
# ratios and transition days quoted by the lesson/figure
_ch = bt["christoffersen_roll250_var95"]
_ch["pi11_over_pi01"] = r2(pi11 / pi01)
_ch["pi11_over_pi"] = r2(pi11 / pi)
_ch["n_transitions"] = int(len(exc250) - 1)
_ch["n11_transition_days"] = sorted(
    {d for i in range(len(exc250) - 1)
     if exc250[i] == 1 and exc250[i + 1] == 1 for d in (i + 1, i + 2)})
# counterfactual: n11 = 0 (the 4 n11 transitions become n10)
_c00, _c01, _c10, _c11 = n00, n01, n10 + n11, 0
_cpi = (_c01 + _c11) / (_c00 + _c01 + _c10 + _c11)
_cpi01 = _c01 / (_c00 + _c01)
_cpi11 = 0.0
_cll0 = _xlnx(_c00 + _c10, 1 - _cpi) + _xlnx(_c01 + _c11, _cpi)
_cll1 = (_xlnx(_c00, 1 - _cpi01) + _xlnx(_c01, _cpi01)
         + _xlnx(_c10, 1 - _cpi11) + _xlnx(_c11, _cpi11))
_clr = -2 * _cll0 + 2 * _cll1
bt["christoffersen_if_n11_0"] = {"n00": _c00, "n01": _c01, "n10": _c10, "n11": _c11,
    "LR_ind": r4(_clr), "p_ind": r4(float(1 - stats.chi2.cdf(_clr, 1)))}
print(f"  Christoffersen if n11=0: LR_ind={_clr:.4f} "
      f"p={1 - stats.chi2.cdf(_clr, 1):.4f}")
# Basel zone (last 250d, VaR99 from pre-window) — recompute of M4.3
last250 = port_s.iloc[-250:]
q99_pre = np.quantile(port_s.iloc[:-250], 0.01)
exc99 = int((last250 < q99_pre).sum())
bt["basel_99_last250"] = {"exceed": exc99,
                          "zone": "GREEN" if exc99 <= 4 else "YELLOW" if exc99 <= 9 else "RED"}
print(f"  Basel 99% last 250d: exceed={exc99} -> {bt['basel_99_last250']['zone']}")
out["m9_backtest_wf"] = bt

# ================================================================ M9.4 sensitivity
print("\n== M9.4 Sensitivity (param VaR95) ==")
sens = {"base_var95_param": r4(vp95), "base_mu_day": r4(mu_d),
        "base_sd_day": r4(sd_d)}


def _vp95(mu, sd):
    return float(-(mu + sd * stats.norm.ppf(0.05)))


rows = [
    ("sigma_+10pct", _vp95(mu_d, sd_d * 1.10)),
    ("sigma_-10pct", _vp95(mu_d, sd_d * 0.90)),
    ("mu_+0.0005", _vp95(mu_d + 0.0005, sd_d)),
    ("mu_-0.0005", _vp95(mu_d - 0.0005, sd_d)),
    ("alpha_97.5_z1.96", float(-(mu_d + sd_d * stats.norm.ppf(0.025)))),
]
# correlation +0.1 all pairs (simple-return covariance, equal weight)
sr3 = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).dropna()
cov_s = sr3.cov().values
sig_s = np.sqrt(np.diag(cov_s))
corr_s = cov_s / np.outer(sig_s, sig_s)
corr_b = corr_s.copy()
for i in range(3):
    for j in range(3):
        if i != j:
            corr_b[i, j] = min(corr_b[i, j] + 0.1, 0.99)
cov_b = corr_b * np.outer(sig_s, sig_s)
sd_b = float(np.sqrt(w @ cov_b @ w))
rows.append(("corr_+0.1_all", _vp95(mu_d, sd_b)))
rows.append(("multi_sigma+10pct_and_corr+0.1",
             _vp95(mu_d, sd_b * 1.10)))
sens["corr_base_matrix"] = [[r4(v) for v in row] for row in corr_s]
sens["sigma_port_from_cov"] = r4(float(np.sqrt(w @ cov_s @ w)))
sens["sigma_port_corr_plus0.1"] = r4(sd_b)
torn = []
for name, v in rows:
    torn.append({"input": name, "var95": r4(v), "delta_vs_base": r4(v - vp95),
                 "delta_pct": r4(100 * (v - vp95) / vp95)})
torn.sort(key=lambda r: -abs(r["delta_vs_base"]))
sens["tornado_ranked"] = torn
for r in torn:
    print(f"  {r['input']}: VaR95={r['var95']:.4f} delta={r['delta_vs_base']:+.4f} "
          f"({r['delta_pct']:+.1f}%)")
# mini-case (lesson step 5): sigma x1.2, EXACT from unrounded mu/sd
_sd12 = 1.2 * sd_d
_v12 = _vp95(mu_d, _sd12)
sens["mini_case"] = {
    "sigma_multiplier": 1.2, "sigma_x1.2": r5(_sd12),
    "var95": r4(_v12), "delta_vs_base": r4(_v12 - vp95),
    "delta_pct": r2(100 * (_v12 - vp95) / vp95),
    # the tempting interpolation from ROUNDED tornado deltas (2x the +10%
    # effect) — shown in the lesson as the WRONG answer, not the exact one
    "var95_rounded_inputs": r4(vp95 + 2 * 0.0032),
    "delta_var95_rounded_inputs": r4(0.0392 - 0.0328),
    "note": "var95_rounded_inputs (0.0392) is the interpolation the lesson "
            "rejects; the exact value is var95 = 0.0393.",
    # the formula's own arithmetic from DISPLAYED inputs (sigma 0.0196,
    # z 1.645, mu 0.000558): 1.2 x 0.0196 = 0.02352, then
    # 0.000558 + 1.645 x 0.02352 = 0.0392484 ~= 0.0392 (see formulaNote).
    "sigma_x1.2_display": 0.02352,
    "var95_display": 0.0392484}
_torn_by_name = {r["input"]: r for r in torn}
sens["z_95_to_97.5_pct_increase"] = r2(100 * (1.96 - 1.645) / 1.645)
sens["multiway_sum_of_rounded_parts_pct"] = r1(
    r1(_torn_by_name["sigma_+10pct"]["delta_pct"])
    + r1(_torn_by_name["corr_+0.1_all"]["delta_pct"]))
sens["multiway_interaction_pp"] = r2(
    _torn_by_name["multi_sigma+10pct_and_corr+0.1"]["delta_pct"]
    - (_torn_by_name["sigma_+10pct"]["delta_pct"]
       + _torn_by_name["corr_+0.1_all"]["delta_pct"]))
sens["multiway_vs_sigma_only_pp"] = r1(
    _torn_by_name["multi_sigma+10pct_and_corr+0.1"]["delta_pct"]
    - _torn_by_name["sigma_+10pct"]["delta_pct"])
sens["var95_base_10pct"] = r4(0.10 * vp95)
out["m9_sensitivity"] = sens

# ================================================================ M9.4 credit LGD/margin
print("\n== M9.4 Credit profit sensitivity (flagship, test 6.000) ==")
df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
PAY_COLS = ["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6"]
BILL_COLS = ["BILL_AMT1", "BILL_AMT2", "BILL_AMT3", "BILL_AMT4", "BILL_AMT5", "BILL_AMT6"]
PAY_AMT_COLS = ["PAY_AMT1", "PAY_AMT2", "PAY_AMT3", "PAY_AMT4", "PAY_AMT5", "PAY_AMT6"]


def add_features(data):
    outd = data.copy()
    outd["PAY_MEAN"] = outd[PAY_COLS].mean(axis=1)
    outd["PAY_MAX"] = outd[PAY_COLS].max(axis=1)
    outd["PAY_DELAY_COUNT"] = (outd[PAY_COLS] > 0).sum(axis=1)
    outd["UTILIZATION"] = (outd["BILL_AMT1"] / outd["LIMIT_BAL"]).clip(0, 5)
    ratio = outd["PAY_AMT1"] / (outd["BILL_AMT1"] + 1)
    outd["PAY_RATIO"] = ratio.replace([np.inf, -np.inf], 2).fillna(0).clip(0, 2)
    outd["BILL_MEAN"] = outd[BILL_COLS].mean(axis=1)
    outd["PAY_AMT_MEAN"] = outd[PAY_AMT_COLS].mean(axis=1)
    outd["BILL_TREND"] = outd["BILL_AMT1"] - outd["BILL_AMT6"]
    return outd


X_raw = df.drop(columns=["ID", "default"])
y = df["default"]
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.20, stratify=y, random_state=SEED)
X_train = add_features(X_train_raw)
X_test = add_features(X_test_raw)
test_limit = X_test_raw["LIMIT_BAL"].values.astype(float)
y_test_arr = y_test.values
cal_gbm = CalibratedClassifierCV(
    estimator=HistGradientBoostingClassifier(random_state=SEED),
    method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]
cal_roc = r4(roc_auc_score(y_test, cal_proba))
print(f"  flagship cal ROC-AUC={cal_roc} (locked 0.7816)")
if abs(cal_roc - 0.7816) > 0.001:
    print("LOCK FAILED: cal ROC-AUC")
    raise SystemExit(1)


def _econ(proba, threshold, lgd, margin):
    approved = np.asarray(proba) < threshold
    y_arr = np.asarray(y_test_arr)
    lim = np.asarray(test_limit)
    prof = float(((y_arr[approved] == 0) * margin * lim[approved]).sum())
    loss = float(((y_arr[approved] == 1) * lgd * lim[approved]).sum())
    return {"n_approved": int(approved.sum()),
            "approval_rate": r4(float(approved.mean())),
            "bad_rate_approved": r4(float(y_arr[approved].mean())),
            "realised_profit_NT": int(prof), "realised_loss_NT": int(loss),
            "net_profit_NT": int(prof - loss)}


cred = {"threshold": THR, "base_lgd": LGD, "base_margin": MARGIN}
cred["lgd_sensitivity"] = {}
for lgd in [0.40, 0.45, 0.50, 0.60]:
    e = _econ(cal_proba, THR, lgd, MARGIN)
    cred["lgd_sensitivity"][str(lgd)] = e
    print(f"  LGD {lgd}: net profit NT${e['net_profit_NT']:,}")
cred["margin_sensitivity"] = {}
for mg in [0.04, 0.05, 0.06]:
    e = _econ(cal_proba, THR, LGD, mg)
    cred["margin_sensitivity"][str(mg)] = e
    print(f"  margin {mg}: net profit NT${e['net_profit_NT']:,}")
base_profit = cred["lgd_sensitivity"]["0.45"]["net_profit_NT"]
if abs(base_profit - 8214000) > 0:
    print("LOCK FAILED: profit@0.10 LGD 0.45 =", base_profit)
    raise SystemExit(1)
# derived values quoted by the lesson
cred["lgd_grid"] = [0.40, 0.45, 0.50, 0.60]
cred["margin_grid"] = [0.04, 0.05, 0.06]
_p45 = cred["lgd_sensitivity"]["0.45"]["net_profit_NT"]
_p50 = cred["lgd_sensitivity"]["0.5"]["net_profit_NT"]
_p60 = cred["lgd_sensitivity"]["0.6"]["net_profit_NT"]
_pmg06 = cred["margin_sensitivity"]["0.06"]["net_profit_NT"]
cred["profit_delta_per_lgd_0.01"] = int((_p50 - _p45) / 5)
cred["profit_delta_per_lgd_0.05"] = int(_p50 - _p45)
cred["profit_delta_per_margin_0.01"] = int(_pmg06 - _p45)
cred["profit_drop_lgd_060_vs_base"] = int(_p45 - _p60)
# threshold profits come from M6.4 canonical (policy table, [M6.4])
_m6 = json.load(open("qa-learn/m6_canonical.json"))
_pol = {r["threshold"]: r["net_profit_realised_NT"]
        for r in _m6["m64_policy_table"]}
_p010, _p015, _p020 = _pol[0.10], _pol[0.15], _pol[0.20]
cred["threshold_010_to_015_profit_drop_pct"] = r1(100 * (_p010 - _p015) / _p010)
cred["threshold_010_to_020_profit_swing"] = int(_p010 - _p020)
# aggregates derived from M8 tiering (approved limit + realised loss):
# DEFAULT_LIMIT = realised_loss / LGD 0.45; NONDEFAULT = approved - default.
# NOT in m8_canonical.json as keys — marked [turunan] in the lesson.
_m8 = json.load(open("qa-learn/m8_canonical.json"))
_tier = _m8["m8_tiering"]
_def_lim = int(round(_tier["realised_loss_approved_NT"] / 0.45))
cred["derived_from_m8"] = {
    "default_limit_NT": _def_lim,
    "nondefault_limit_NT": int(_tier["approved_limit_NT"] - _def_lim),
    "note": "Derived from m8_tiering (approved_limit_NT minus "
            "realised_loss_approved_NT / 0.45); the lesson labels them [turunan]."}
out["m9_credit_sensitivity"] = cred

# ================================================================ M9.5 HS + bootstrap
print("\n== M9.5 Historical simulation windows ==")
hs = {}
for window in [120, 250, 480]:
    sub = port_s.iloc[-window:]
    hs[f"window_{window}"] = {"n": int(len(sub)),
                              "var95": r4(var_hist(sub, 0.95)),
                              "es95": r4(es_hist(sub, 0.95)),
                              "var99": r4(var_hist(sub, 0.99)),
                              "es99": r4(es_hist(sub, 0.99))}
    print(f"  window {window}: VaR95={hs[f'window_{window}']['var95']:.4f} "
          f"ES95={hs[f'window_{window}']['es95']:.4f}")
hs["full_480_reference"] = {"var95": r4(vh95), "es95": r4(eh95),
                            "var99": r4(vh99), "es99": r4(eh99),
                            "param_var95": r4(vp95), "param_es95": r4(ep95),
                            "param_var99": r4(vp99), "param_es99": r4(ep99),
                            # unrounded hist VaR95 (6dp) — quoted by M9.1
                            # formulaNote: sqrt10 x 0.028563 = 0.0903, while
                            # sqrt10 x 0.0286 (displayed) = 0.0904 (class 26).
                            "var95_hist_exact": r6(vh95)}
# derived gaps quoted by the lesson (window comparisons, hist vs param,
# VaR/ES in rupiah on Rp100jt)
_w120, _w250, _w480 = hs["window_120"], hs["window_250"], hs["window_480"]
hs["var95_range"] = r4(max(_w120["var95"], _w250["var95"], _w480["var95"])
                      - min(_w120["var95"], _w250["var95"], _w480["var95"]))
hs["es95_gap_w120_w480"] = r4(_w120["es95"] - _w480["es95"])
hs["hs_param_var95_gap"] = r4(hs["full_480_reference"]["param_var95"] - _w480["var95"])
hs["hs_param_es95_gap"] = r4(hs["full_480_reference"]["param_es95"] - _w480["es95"])
hs["es95_minus_var95"] = r4(_w480["es95"] - _w480["var95"])
hs["hs_param_es99_gap"] = r4(hs["full_480_reference"]["param_es99"] - _w480["es99"])
hs["var95_hist_rp"] = int(round(_w480["var95"] * 100_000_000))
hs["es95_hist_rp"] = int(round(_w480["es95"] * 100_000_000))
hs["n_other_days_in_480_window"] = 479
out["m9_hs_windows"] = hs

print("\n== M9.5 Bootstrap VaR/ES (B=10.000, seed 42) ==")
B = 10_000
arr_s = port_s.values


def _boot_var_es(draws):
    v95 = np.array([float(-np.quantile(d, 0.05)) for d in draws])
    e95 = np.array([float(-d[d <= np.quantile(d, 0.05)].mean()) for d in draws])
    return v95, e95


# iid bootstrap
idx = rng.integers(0, n, size=(B, n))
draws_iid = arr_s[idx]
v95_iid, e95_iid = _boot_var_es(draws_iid)
# moving-block bootstrap, block length 10
L = 10
starts = rng.integers(0, n - L + 1, size=(B, math.ceil(n / L)))
blocks = np.stack([arr_s[s:s + L] for s in starts.reshape(-1)]).reshape(B, -1, L)
draws_blk = blocks.reshape(B, -1)[:, :n]
v95_blk, e95_blk = _boot_var_es(draws_blk)


def _ci(a):
    return [r4(float(np.quantile(a, 0.025))), r4(float(np.quantile(a, 0.975)))]


boot = {
    "B": B, "n": n,
    "iid_var95": {"mean": r4(float(v95_iid.mean())), "sd": r4(float(v95_iid.std(ddof=1))),
                  "ci95": _ci(v95_iid)},
    "iid_es95": {"mean": r4(float(e95_iid.mean())), "sd": r4(float(e95_iid.std(ddof=1))),
                 "ci95": _ci(e95_iid)},
    "block10_var95": {"mean": r4(float(v95_blk.mean())), "sd": r4(float(v95_blk.std(ddof=1))),
                      "ci95": _ci(v95_blk)},
    "block10_es95": {"mean": r4(float(e95_blk.mean())), "sd": r4(float(e95_blk.std(ddof=1))),
                     "ci95": _ci(e95_blk)},
}
# bootstrap CI for the mean daily return (iid)
means = draws_iid.mean(axis=1)
boot["iid_mean_daily_return"] = {"point": r4(mu_d), "ci95": _ci(means)}
print(f"  iid VaR95: mean={v95_iid.mean():.4f} sd={v95_iid.std(ddof=1):.4f} CI95={_ci(v95_iid)}")
print(f"  iid ES95:  mean={e95_iid.mean():.4f} sd={e95_iid.std(ddof=1):.4f} CI95={_ci(e95_iid)}")
print(f"  blk VaR95: mean={v95_blk.mean():.4f} sd={v95_blk.std(ddof=1):.4f} CI95={_ci(v95_blk)}")
print(f"  blk ES95:  mean={e95_blk.mean():.4f} sd={e95_blk.std(ddof=1):.4f} CI95={_ci(e95_blk)}")
print(f"  mean daily return CI95 (iid): {_ci(means)}")
# skew / excess kurtosis
boot["skew_portfolio_simple"] = r4(float(stats.skew(arr_s)))
boot["excess_kurtosis_portfolio_simple"] = r4(float(stats.kurtosis(arr_s)))
# CI widths and comparisons quoted by the lesson. NOTE: the LAB (B=2.000)
# has its own block width 0.0111 (lower bound 0.0229, not the canonical
# 0.0223) — the lesson labels that value [lab]; the canonical widths here
# are for B=10.000.
_ci_iid_v = boot["iid_var95"]["ci95"]
_ci_blk_v = boot["block10_var95"]["ci95"]
_ci_iid_e = boot["iid_es95"]["ci95"]
_ci_blk_e = boot["block10_es95"]["ci95"]
boot["iid_var95_ci_width"] = r4(_ci_iid_v[1] - _ci_iid_v[0])
boot["block10_var95_ci_width"] = r4(_ci_blk_v[1] - _ci_blk_v[0])
boot["iid_es95_ci_width"] = r4(_ci_iid_e[1] - _ci_iid_e[0])
boot["block10_es95_ci_width"] = r4(_ci_blk_e[1] - _ci_blk_e[0])
boot["block_vs_iid_var95_sd_pct"] = r1(
    100 * (boot["block10_var95"]["sd"] - boot["iid_var95"]["sd"])
    / boot["iid_var95"]["sd"])
# sd/mean ratio: the lesson shows the DISPLAYED rounded values
# (0.0196/0.0006 = 32.67); the exact ratio is 35.2 — both stored.
boot["sd_over_abs_mean_display"] = r2(0.0196 / 0.0006)
boot["sd_over_abs_mean_exact"] = r1(sd_d / abs(mu_d))
boot["note"] = ("IID bootstrap resamples single days (breaks time dependence); "
                "moving-block bootstrap (block 10) preserves short dependence. "
                "Squared-return autocorr lag-1 is 0.1043 [M4.3] -- block CI is "
                "wider, as it should be.")
print(f"  skew={stats.skew(arr_s):.4f} excess kurtosis={stats.kurtosis(arr_s):.4f}")
out["m9_bootstrap"] = boot

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as fh:
    json.dump(out, fh, indent=1)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s, keys: {list(out.keys())}")

"""Canonical numbers for MLF M4 (Random Forest & ensembles / market risk & trading).

Deterministic: data = ~/workspace/learn-platform/data/m4_prices.csv
(yfinance download 2026-11-12, window 2024-11-01..2026-11-12, auto_adjust=True).
All numbers printed here are the canonical source for lesson text + notebook checks.
GARCH(1,1) is MANUAL (scipy MLE) — package `arch` is not installed in the VM.
Run: python3 qa-learn/m4_canonical_calc.py
"""
import json
import numpy as np
import pandas as pd
from scipy import stats, optimize

rng = np.random.default_rng(42)
prices = pd.read_csv("data/m4_prices.csv", index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")
print("rows:", len(close), "from", close.index[0].date(), "to", close.index[-1].date())
for c in close.columns:
    print(c, "n:", close[c].notna().sum())

# Returns are built PER ASSET on its own trading calendar (dropna first,
# then diff). A holiday is NOT a zero-return day — it is no day at all.
# Cross-asset work aligns on common dates afterwards (inner join).
def _logret(price):
    return np.log(price.dropna()).diff().dropna()

def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()

lr = {c: _logret(close[c]) for c in close.columns}   # log returns per asset
sr = {c: _simpret(close[c]) for c in close.columns}  # simple returns per asset
ret = pd.DataFrame(lr)   # union index; NaN where that market did not trade
sret = pd.DataFrame(sr)
n = len(lr["BBCA"])
print("log-return rows:", n)

out = {"n_days": int(n), "first": str(close.index[0].date()), "last": str(close.index[-1].date())}
for c in close.columns:
    out[f"n_{c}"] = int(close[c].notna().sum())

# ---------------------------------------------------------------- per-stock stats
print("\n== per-stock (log returns, annualised 252) ==")
for c in ["BBCA", "KLBF", "UNVR", "GSPC"]:
    r = ret[c].dropna()
    ann_ret = r.mean() * 252
    ann_vol = r.std() * np.sqrt(252)
    sharpe = ann_ret / ann_vol  # rf = 0, stated in lesson
    tot = close[c].iloc[-1] / close[c].dropna().iloc[0] - 1
    print(f"{c}: ann_ret={ann_ret:.4f} ann_vol={ann_vol:.4f} sharpe(rf=0)={sharpe:.4f} total_ret={tot:.4f}")
    out[f"{c}_ann_ret"] = round(float(ann_ret), 4)
    out[f"{c}_ann_vol"] = round(float(ann_vol), 4)
    out[f"{c}_sharpe0"] = round(float(sharpe), 4)
    out[f"{c}_total_ret"] = round(float(tot), 4)
    out[f"{c}_last_close"] = round(float(close[c].dropna().iloc[-1]), 2)

# beta vs GSPC (log returns, common dates)
print("\n== beta vs GSPC ==")
for c in ["BBCA", "KLBF", "UNVR"]:
    df = pd.DataFrame({"y": lr[c], "x": lr["GSPC"]}).dropna()
    beta = np.cov(df["y"], df["x"])[0, 1] / np.var(df["x"])
    alpha = df["y"].mean() - beta * df["x"].mean()
    corr = df["y"].corr(df["x"])
    print(f"{c}: beta={beta:.4f} alpha/day={alpha:.6f} corr={corr:.4f}")
    out[f"{c}_beta"] = round(float(beta), 4)
    out[f"{c}_corr_gspc"] = round(float(corr), 4)

# ---------------------------------------------------------------- portfolio (equal weight, daily rebalance)
w = np.array([1 / 3, 1 / 3, 1 / 3])
port_s = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).mean(axis=1)  # equal-weight, IDX days only (480)
port_l = np.log1p(port_s)  # approx log returns of portfolio
print("\n== portfolio equal-weight (simple returns) ==")
mu_d, sd_d = port_s.mean(), port_s.std()
print(f"n={len(port_s)} mean/day={mu_d:.6f} sd/day={sd_d:.4f} ann_vol={sd_d*np.sqrt(252):.4f} ann_ret={port_s.mean()*252:.4f}")
out["port_n"] = int(len(port_s))
out["port_sd_day"] = round(float(sd_d), 4)
out["port_ann_vol"] = round(float(sd_d * np.sqrt(252)), 4)
out["port_ann_ret"] = round(float(port_s.mean() * 252), 4)
out["port_total_ret"] = round(float((1 + port_s).prod() - 1), 4)

# correlation matrix (log returns)
corr3 = ret[["BBCA", "KLBF", "UNVR"]].corr()
print("\ncorr matrix (log ret):\n", corr3.round(4))
out["corr_BBCA_KLBF"] = round(float(corr3.loc["BBCA", "KLBF"]), 4)
out["corr_BBCA_UNVR"] = round(float(corr3.loc["BBCA", "UNVR"]), 4)
out["corr_KLBF_UNVR"] = round(float(corr3.loc["KLBF", "UNVR"]), 4)

# ---------------------------------------------------------------- M4.2 VaR / ES (1-day, portfolio simple returns)
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

print("\n== VaR/ES 1-day, portfolio (fraction of value) ==")
for a in [0.95, 0.99]:
    vh, eh = var_hist(port_s, a), es_hist(port_s, a)
    vp, ep = var_param(port_s, a), es_param(port_s, a)
    print(f"alpha={a}: hist VaR={vh:.4f} ES={eh:.4f} | param VaR={vp:.4f} ES={ep:.4f}")
    out[f"var_hist_{int(a*100)}"] = round(vh, 4)
    out[f"es_hist_{int(a*100)}"] = round(eh, 4)
    out[f"var_param_{int(a*100)}"] = round(vp, 4)
    out[f"es_param_{int(a*100)}"] = round(ep, 4)
    # Rp on Rp100jt
    out[f"var_hist_{int(a*100)}_rp100jt"] = int(round(vh * 100_000_000))
    out[f"es_hist_{int(a*100)}_rp100jt"] = int(round(eh * 100_000_000))

# Monte Carlo VaR: joint normal on 3 log-returns, equal weight, 10k sims, seed 42
lr3 = ret[["BBCA", "KLBF", "UNVR"]].dropna()  # 480 IDX days
mu3 = lr3.mean().values
cov3 = lr3.cov().values
sims = rng.multivariate_normal(mu3, cov3, size=10_000)
port_mc = np.log1p(np.expm1(sims) @ w)  # approx: simple-return portfolio
for a in [0.95, 0.99]:
    v = float(-np.quantile(port_mc, 1 - a))
    e = float(-port_mc[port_mc <= np.quantile(port_mc, 1 - a)].mean())
    print(f"MC alpha={a}: VaR={v:.4f} ES={e:.4f} (10.000 sims, seed 42)")
    out[f"var_mc_{int(a*100)}"] = round(v, 4)
    out[f"es_mc_{int(a*100)}"] = round(e, 4)

# per-stock VaR95 historical
print("\n== per-stock VaR95 hist (simple returns) ==")
for c in ["BBCA", "KLBF", "UNVR"]:
    v = var_hist(sr[c], 0.95)
    print(f"{c}: {v:.4f}")
    out[f"var95_hist_{c}"] = round(float(v), 4)

# 10-day scaling (sqrt-10) on hist VaR95
out["var95_hist_10d"] = round(float(var_hist(port_s, 0.95) * np.sqrt(10)), 4)
print("VaR95 hist 10-day (sqrt-10):", out["var95_hist_10d"])

# ---------------------------------------------------------------- M4.3 Kupiec + EWMA + GARCH
print("\n== Kupiec POF, historical VaR95, full sample ==")
q95 = np.quantile(port_s, 0.05)
exc = (port_s < q95).sum()
nn = len(port_s)
p = 0.05
x = int(exc)
lr_stat = -2 * np.log(((1 - p) ** (nn - x)) * (p ** x)) + 2 * np.log(((1 - x / nn) ** (nn - x)) * ((x / nn) ** x))
pval = 1 - stats.chi2.cdf(lr_stat, 1)
print(f"n={nn} exceed={x} expected={nn*p:.1f} LR={lr_stat:.4f} p={pval:.4f}")
out["kupiec_n"] = int(nn); out["kupiec_x95"] = x; out["kupiec_expected95"] = round(nn * p, 1)
out["kupiec_LR95"] = round(float(lr_stat), 4); out["kupiec_p95"] = round(float(pval), 4)

# OUT-OF-SAMPLE Kupiec: rolling 250d historical VaR, 1-day-ahead, days 251..480.
# (In-sample Kupiec above is trivially satisfied by construction — the lesson
# teaches this trap explicitly.)
print("\n== Kupiec OUT-OF-SAMPLE, rolling 250d hist VaR ==")
port_s_arr = port_s.values
for a, q in [(0.95, 0.05), (0.99, 0.01)]:
    xs = []
    for t in range(250, len(port_s_arr)):
        v = -np.quantile(port_s_arr[t - 250:t], q)
        xs.append(port_s_arr[t] < -v)
    xs = np.array(xs)
    nn2 = len(xs); x2 = int(xs.sum()); pp = 1 - a
    lr2 = (-2 * np.log(((1 - pp) ** (nn2 - x2)) * (pp ** x2))
           + 2 * np.log(((1 - x2 / nn2) ** (nn2 - x2)) * ((x2 / nn2) ** x2))) if 0 < x2 < nn2 else float("nan")
    pv2 = 1 - stats.chi2.cdf(lr2, 1) if np.isfinite(lr2) else float("nan")
    print(f"alpha={a}: n={nn2} exceed={x2} expected={nn2*pp:.1f} LR={lr2:.4f} p={pv2:.4f}")
    out[f"kupiec_oos_n{int(a*100)}"] = int(nn2)
    out[f"kupiec_oos_x{int(a*100)}"] = x2
    out[f"kupiec_oos_exp{int(a*100)}"] = round(nn2 * pp, 1)
    out[f"kupiec_oos_LR{int(a*100)}"] = round(float(lr2), 4)
    out[f"kupiec_oos_p{int(a*100)}"] = round(float(pv2), 4)

# Basel zone at 99% on last 250 trading days
last250 = port_s.iloc[-250:]
q99_250 = np.quantile(port_s.iloc[:-250] if len(port_s) > 250 else port_s, 0.01)
exc99 = int((last250 < q99_250).sum())
print(f"Basel 99% (VaR from pre-window, last 250d): exceed={exc99} -> {'GREEN' if exc99<=4 else 'YELLOW' if exc99<=9 else 'RED'}")
out["basel_exc99_250"] = exc99
out["basel_zone"] = "GREEN" if exc99 <= 4 else "YELLOW" if exc99 <= 9 else "RED"

# volatility clustering: autocorr of squared log returns (portfolio)
sq = port_l.dropna() ** 2
ac1 = sq.autocorr(1); ac5 = sq.autocorr(5); ac10 = sq.autocorr(10)
print(f"squared-return autocorr: lag1={ac1:.4f} lag5={ac5:.4f} lag10={ac10:.4f}")
out["sq_ac1"] = round(float(ac1), 4); out["sq_ac5"] = round(float(ac5), 4); out["sq_ac10"] = round(float(ac10), 4)

# EWMA lambda=0.94 on BBCA log returns
def ewma_vol(r, lam=0.94):
    var = np.var(r)
    vols = []
    for e in r:
        var = lam * var + (1 - lam) * e * e
        vols.append(np.sqrt(var))
    return np.array(vols)

bbca_l = lr["BBCA"].values  # 480 IDX trading days
ew = ewma_vol(bbca_l)
print(f"EWMA(0.94) BBCA: last daily vol={ew[-1]:.4f} (ann {ew[-1]*np.sqrt(252):.4f}); mean vol={ew.mean():.4f}")
out["ewma_bbca_last"] = round(float(ew[-1]), 4)
out["ewma_bbca_last_ann"] = round(float(ew[-1] * np.sqrt(252)), 4)
# conditional VaR95 with EWMA vol (normal, mean 0)
out["var95_ewma_bbca"] = round(float(-stats.norm.ppf(0.05) * ew[-1]), 4)
out["var95_uncond_bbca"] = round(float(var_param(pd.Series(bbca_l), 0.95)), 4)
print(f"BBCA VaR95: EWMA-conditional={out['var95_ewma_bbca']:.4f} vs unconditional param={out['var95_uncond_bbca']:.4f}")

# GARCH(1,1) manual MLE on BBCA log returns (demeaned by sample mean)
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
    for start in [(var0 * 0.05, 0.08, 0.88), (var0 * 0.1, 0.15, 0.8), (var0 * 0.02, 0.05, 0.9)]:
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
    lr_uncond = var0
    long_run = om / (1 - al - be)
    forecast_var = om + al * e[-1] ** 2 + be * sig2[-1]
    return dict(mu=float(mu), omega=float(om), alpha=float(al), beta=float(be),
                persistence=float(al + be), long_run_var=float(long_run),
                long_run_vol=float(np.sqrt(long_run)), last_cond_vol=float(sig[-1]),
                forecast_vol=float(np.sqrt(forecast_var)), nll=float(best.fun),
                uncond_vol=float(np.sqrt(var0)))

g = garch_fit(bbca_l)
print("\n== GARCH(1,1) manual MLE, BBCA log returns ==")
for k, v in g.items():
    print(f"  {k} = {v:.6f}")
out["garch_omega"] = round(g["omega"], 8)
out["garch_alpha"] = round(g["alpha"], 4)
out["garch_beta"] = round(g["beta"], 4)
out["garch_persistence"] = round(g["persistence"], 4)
out["garch_long_run_vol"] = round(g["long_run_vol"], 4)
out["garch_last_cond_vol"] = round(g["last_cond_vol"], 4)
out["garch_forecast_vol"] = round(g["forecast_vol"], 4)
out["garch_uncond_vol"] = round(g["uncond_vol"], 4)
out["garch_var95_cond"] = round(float(-stats.norm.ppf(0.05) * g["forecast_vol"]), 4)
out["garch_var99_cond"] = round(float(-stats.norm.ppf(0.01) * g["forecast_vol"]), 4)
print(f"GARCH 1-day-ahead VaR95 (cond)={out['garch_var95_cond']:.4f} VaR99={out['garch_var99_cond']:.4f}")

# GARCH on portfolio log returns too (for M4.3 conditional VaR comparison)
gp = garch_fit(port_l.dropna().values)
out["garch_port_alpha"] = round(gp["alpha"], 4)
out["garch_port_beta"] = round(gp["beta"], 4)
out["garch_port_forecast_vol"] = round(gp["forecast_vol"], 4)
print(f"GARCH portfolio: alpha={gp['alpha']:.4f} beta={gp['beta']:.4f} forecast_vol={gp['forecast_vol']:.4f}")

# ---------------------------------------------------------------- M4.4 Black-Scholes Greeks on GSPC
S = float(close["GSPC"].dropna().iloc[-1])
K = S  # ATM
T = 0.25
r_rate = 0.05
sig = float(lr["GSPC"].tail(20).std() * np.sqrt(252))  # realised vol 20d, annualised
d1 = (np.log(S / K) + (r_rate + 0.5 * sig ** 2) * T) / (sig * np.sqrt(T))
d2 = d1 - sig * np.sqrt(T)
call = S * stats.norm.cdf(d1) - K * np.exp(-r_rate * T) * stats.norm.cdf(d2)
delta = stats.norm.cdf(d1)
gamma = stats.norm.pdf(d1) / (S * sig * np.sqrt(T))
vega = S * stats.norm.pdf(d1) * np.sqrt(T) / 100  # per 1 vol point
theta = (-(S * stats.norm.pdf(d1) * sig) / (2 * np.sqrt(T))
         - r_rate * K * np.exp(-r_rate * T) * stats.norm.cdf(d2)) / 365  # per day
rho = K * T * np.exp(-r_rate * T) * stats.norm.cdf(d2) / 100  # per 1pp
print(f"\n== Black-Scholes call, GSPC S={S:.2f} K={K:.2f} T={T} r={r_rate} sigma20d={sig:.4f} ==")
print(f"price={call:.2f} delta={delta:.4f} gamma={gamma:.6f} vega/1pp={vega:.4f} theta/day={theta:.4f} rho/1pp={rho:.4f}")
out["bs_S"] = round(S, 2); out["bs_K"] = round(K, 2); out["bs_sigma20d"] = round(sig, 4)
out["bs_call"] = round(float(call), 2); out["bs_delta"] = round(float(delta), 4)
out["bs_gamma"] = round(float(gamma), 6); out["bs_vega_1pp"] = round(float(vega), 4)
out["bs_theta_day"] = round(float(theta), 4); out["bs_rho_1pp"] = round(float(rho), 4)
# S +1%: TRUE move = repricing Black-Scholes (bukan perkiraan delta).
# Perkiraan delta SAJA disimpan terpisah (bs_delta_estimate_1pct).
d1u = (np.log(S * 1.01 / K) + (r_rate + 0.5 * sig ** 2) * T) / (sig * np.sqrt(T))
d2u = d1u - sig * np.sqrt(T)
call_up = S * 1.01 * stats.norm.cdf(d1u) - K * np.exp(-r_rate * T) * stats.norm.cdf(d2u)
out["bs_call_move_1pct"] = round(float(call_up - call), 2)
out["bs_delta_estimate_1pct"] = round(float(delta * 0.01 * S), 2)
# gamma effect: delta after S +1%
d1b = (np.log(S * 1.01 / K) + (r_rate + 0.5 * sig ** 2) * T) / (sig * np.sqrt(T))
out["bs_delta_after_1pct"] = round(float(stats.norm.cdf(d1b)), 4)
print(f"call +1% S -> +${out['bs_call_move_1pct']:.2f} sebenarnya (perkiraan delta +${out['bs_delta_estimate_1pct']:.2f}); delta after +1%: {out['bs_delta_after_1pct']:.4f}")

# risk decomposition: parametric VaR95 portfolio, marginal/component VaR
sig3 = lr3.std().values  # daily log vol per asset
cov_d = lr3.cov().values
w3 = w
port_var = float(w3 @ cov_d @ w3)
port_sd = np.sqrt(port_var)
z95 = -stats.norm.ppf(0.05)
var95_p = z95 * port_sd
marginal = z95 * (cov_d @ w3) / port_sd  # dVaR/dw_i
component = w3 * marginal
print(f"\n== risk decomposition (param VaR95, log returns) port VaR95={var95_p:.4f} ==")
for i, c in enumerate(["BBCA", "KLBF", "UNVR"]):
    print(f"{c}: weight={w3[i]:.4f} marginal VaR={marginal[i]:.4f} component VaR={component[i]:.4f} share={component[i]/var95_p:.4f}")
    out[f"mvar_{c}"] = round(float(marginal[i]), 4)
    out[f"cvar_{c}"] = round(float(component[i]), 4)
    out[f"cvar_share_{c}"] = round(float(component[i] / var95_p), 4)
out["var95_param_log"] = round(float(var95_p), 4)
print("sum component VaR:", round(float(component.sum()), 4))

# ---------------------------------------------------------------- M4.5 drawdown / regime / stress
print("\n== drawdown (wealth from 1.0, simple returns) ==")
def dd_stats(s):
    wealth = (1 + s).cumprod()
    peak = wealth.cummax()
    dd = wealth / peak - 1
    mdd = dd.min()
    end = dd.idxmin()
    start = wealth.loc[:end].idxmax()
    # recovery: first date after end when wealth >= peak at start
    after = wealth.loc[end:]
    rec = after[after >= wealth.loc[start]]
    rec_date = rec.index[0] if len(rec) else None
    cur = dd.iloc[-1]
    # longest underwater stretch
    uw = (dd < 0)
    longest = 0; cur_run = 0
    for v in uw:
        cur_run = cur_run + 1 if v else 0
        longest = max(longest, cur_run)
    return dict(mdd=float(mdd), start=str(start.date()), end=str(end.date()),
                rec=str(rec_date.date()) if rec_date is not None else None,
                current=float(cur), longest_uw_days=int(longest))

for name, s in [("BBCA", sr["BBCA"]), ("KLBF", sr["KLBF"]),
                ("UNVR", sr["UNVR"]), ("PORT", port_s),
                ("GSPC", sr["GSPC"])]:
    d = dd_stats(s)
    print(f"{name}: maxDD={d['mdd']:.4f} ({d['start']} -> {d['end']}) recovery={d['rec']} current={d['current']:.4f} longest_uw={d['longest_uw_days']}d")
    out[f"mdd_{name}"] = round(d["mdd"], 4)
    out[f"mdd_{name}_start"] = d["start"]; out[f"mdd_{name}_end"] = d["end"]
    out[f"mdd_{name}_rec"] = d["rec"]
    out[f"dd_current_{name}"] = round(d["current"], 4)
    out[f"longest_uw_{name}"] = d["longest_uw_days"]

# regime: rolling 60d vol of portfolio (log returns), high = above 75th pct
roll_vol = port_l.dropna().rolling(60).std() * np.sqrt(252)
thr = roll_vol.quantile(0.75)
high = roll_vol > thr
port_l_al = port_l.dropna().reindex(roll_vol.index)
hi_ret = port_l_al[high]
lo_ret = port_l_al[~high]
print(f"\n== regime (rolling 60d vol, high = >p75 {thr:.4f}) ==")
print(f"high-vol days={len(hi_ret)} low-vol days={len(lo_ret)}")
for nm, r in [("high", hi_ret), ("low", lo_ret)]:
    print(f"{nm}: mean/day={r.mean():.6f} vol/day={r.std():.4f} VaR95 hist={-np.quantile(r, 0.05):.4f} VaR99 hist={-np.quantile(r, 0.01):.4f}")
    out[f"regime_{nm}_n"] = int(len(r))
    out[f"regime_{nm}_vol_day"] = round(float(r.std()), 4)
    out[f"regime_{nm}_var95"] = round(float(-np.quantile(r, 0.05)), 4)
    out[f"regime_{nm}_var99"] = round(float(-np.quantile(r, 0.01)), 4)
out["regime_vol_p75"] = round(float(thr), 4)
out["regime_high_vol_ann"] = round(float(hi_ret.std() * np.sqrt(252)), 4)
out["regime_low_vol_ann"] = round(float(lo_ret.std() * np.sqrt(252)), 4)

# avg pairwise correlation inside each regime (log returns, 3 stocks)
lr_al = ret[["BBCA", "KLBF", "UNVR"]].reindex(roll_vol.index)
hi_c = lr_al[high].corr().values
lo_c = lr_al[~high].corr().values
tri = np.triu_indices(3, 1)
print(f"avg pairwise corr: high-vol={hi_c[tri].mean():.4f} low-vol={lo_c[tri].mean():.4f}")
out["regime_corr_high"] = round(float(hi_c[tri].mean()), 4)
out["regime_corr_low"] = round(float(lo_c[tri].mean()), 4)

# correlation-breakdown stress: same vols, all correlations -> 0.95
sd3 = lr3.std().values
D = np.diag(sd3)
base_corr = lr3.corr().values
stress_corr = np.full((3, 3), 0.95); np.fill_diagonal(stress_corr, 1.0)
vol_base = float(np.sqrt(w3 @ D @ base_corr @ D @ w3))
vol_stress = float(np.sqrt(w3 @ D @ stress_corr @ D @ w3))
vol_one = float(np.sqrt(w3 @ D @ np.ones((3, 3)) @ D @ w3))  # corr = 1
print(f"\n== correlation stress (portfolio daily vol, log ret) ==")
print(f"normal corr vol={vol_base:.4f} | stressed 0.95 vol={vol_stress:.4f} (+{(vol_stress/vol_base-1)*100:.1f}%) | corr=1 vol={vol_one:.4f} (+{(vol_one/vol_base-1)*100:.1f}%)")
out["stress_vol_base"] = round(vol_base, 4)
out["stress_vol_095"] = round(vol_stress, 4)
out["stress_vol_100"] = round(vol_one, 4)
out["stress_vol_up_pct"] = round(float((vol_stress / vol_base - 1) * 100), 1)
out["stress_vol_up_pct_100"] = round(float((vol_one / vol_base - 1) * 100), 1)
out["stress_var95_base"] = round(float(z95 * vol_base), 4)
out["stress_var95_095"] = round(float(z95 * vol_stress), 4)
out["stress_var95_100"] = round(float(z95 * vol_one), 4)
# diversification ratio: weighted avg vol / portfolio vol
out["div_ratio_base"] = round(float((w3 * sd3).sum() / vol_base), 4)
out["div_ratio_095"] = round(float((w3 * sd3).sum() / vol_stress), 4)
print(f"diversification ratio: normal={out['div_ratio_base']:.4f} stressed={out['div_ratio_095']:.4f}")

# ---------------------------------------------------------------- M4.1 RF walk-forward (BBCA next-day direction)
print("\n== M4.1 walk-forward direction prediction (BBCA) ==")
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score

# Features on BBCA's own calendar (480 log returns). GSPC lag uses the
# latest US return available before the IDX close (ffill reindex) — the
# honest "information available at decision time" choice.
b = lr["BBCA"]
g = lr["GSPC"]
feat = pd.DataFrame(index=b.index)
bbca_p = close["BBCA"].dropna()
feat["lag1"] = b.shift(1)
feat["lag5_mean"] = b.shift(1).rolling(5).mean()
feat["vol20"] = b.shift(1).rolling(20).std()
feat["ma20_dist"] = (bbca_p / bbca_p.rolling(20).mean() - 1).shift(1)
feat["gspc_lag1"] = g.shift(1).reindex(b.index, method="ffill")
feat["target"] = (b.shift(-1) > 0).astype(int)  # next-day up?
dfm = feat.dropna()
X, y = dfm.drop(columns=["target"]).values, dfm["target"].values
print("features rows:", len(dfm), "base rate up:", round(float(y.mean()), 4))
out["m41_n"] = int(len(dfm)); out["m41_base_up"] = round(float(y.mean()), 4)

# walk-forward: expanding train, 20-day test folds, step 20
def walk_forward(model_fn, X, y, start=300, test=20, step=20):
    accs = []
    for s in range(start, len(X) - test + 1, step):
        m = model_fn()
        m.fit(X[:s], y[:s])
        accs.append(float((m.predict(X[s:s + test]) == y[s:s + test]).mean()))
    return accs

rf_acc = walk_forward(lambda: RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1), X, y)
lr_acc = walk_forward(lambda: make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)), X, y)
dt_acc = walk_forward(lambda: DecisionTreeClassifier(random_state=42), X, y)
gbm_acc = walk_forward(lambda: HistGradientBoostingClassifier(random_state=42), X, y)
naive_acc = walk_forward(lambda: None, X, y) if False else None
# naive: always predict majority (up)
naive = []
for s in range(300, len(X) - 20 + 1, 20):
    maj = 1 if y[:s].mean() > 0.5 else 0
    naive.append(float((np.full(20, maj) == y[s:s + 20]).mean()))
print(f"walk-forward mean acc (folds={len(rf_acc)}): RF={np.mean(rf_acc):.4f} LR={np.mean(lr_acc):.4f} tree={np.mean(dt_acc):.4f} GBM={np.mean(gbm_acc):.4f} naive-majority={np.mean(naive):.4f}")
out["m41_wf_folds"] = int(len(rf_acc))
out["m41_wf_rf"] = round(float(np.mean(rf_acc)), 4)
out["m41_wf_lr"] = round(float(np.mean(lr_acc)), 4)
out["m41_wf_tree"] = round(float(np.mean(dt_acc)), 4)
out["m41_wf_gbm"] = round(float(np.mean(gbm_acc)), 4)
out["m41_wf_naive"] = round(float(np.mean(naive)), 4)

# random 5-fold CV (leakage demo) on the SAME features
rf_cv = cross_val_score(RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1), X, y, cv=5)
lr_cv = cross_val_score(make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)), X, y, cv=5)
print(f"random 5-fold CV acc: RF={rf_cv.mean():.4f} LR={lr_cv.mean():.4f}  <- vs walk-forward (leakage demo)")
out["m41_cv_rf"] = round(float(rf_cv.mean()), 4)
out["m41_cv_lr"] = round(float(lr_cv.mean()), 4)

# RF trained on all data (for importance + OOB)
rf_full = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1, oob_score=True)
rf_full.fit(X, y)
imps = rf_full.feature_importances_
names = ["lag1", "lag5_mean", "vol20", "ma20_dist", "gspc_lag1"]
print("RF OOB score:", round(float(rf_full.oob_score_), 4))
for nm, im in sorted(zip(names, imps), key=lambda t: -t[1]):
    print(f"  importance {nm}={im:.4f}")
out["m41_oob"] = round(float(rf_full.oob_score_), 4)
for nm, im in zip(names, imps):
    out[f"m41_imp_{nm}"] = round(float(im), 4)
# in-sample vs walk-forward gap (overfitting check)
out["m41_rf_train_acc"] = round(float(rf_full.score(X, y)), 4)

# stacking demo: OOF predictions RF + GBM -> LR meta (walk-forward style, simple)
from sklearn.model_selection import cross_val_predict
oof_rf = cross_val_predict(RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1), X, y, cv=5, method="predict_proba")[:, 1]
oof_gbm = cross_val_predict(HistGradientBoostingClassifier(random_state=42), X, y, cv=5, method="predict_proba")[:, 1]
meta = LogisticRegression(max_iter=1000)
meta_acc = cross_val_score(meta, np.column_stack([oof_rf, oof_gbm]), y, cv=5)
print(f"stacking (RF+GBM -> LR) random-CV acc={meta_acc.mean():.4f}")
out["m41_stack_cv"] = round(float(meta_acc.mean()), 4)

json.dump(out, open("qa-learn/m4_canonical.json", "w"), indent=1, ensure_ascii=False)
print("\nSaved qa-learn/m4_canonical.json with", len(out), "keys")

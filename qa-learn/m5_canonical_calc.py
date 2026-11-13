"""Canonical numbers for MLF M5 (Optimization & portfolio construction).

Deterministic: data = ~/workspace/learn-platform/data/m4_prices.csv
(yfinance download 2026-11-12, window 2024-11-01..2026-11-12, auto_adjust=True).
Convention (STATE IN EVERY LESSON): SIMPLE returns, common trading days
(inner join of the 3 IDX stocks = 480 days). Annualisation x252 / sqrt(252).
Risk-free rate rf = 0.05 (same assumption as the Black-Scholes r in M4.4).
M4.4 used LOG returns for VaR — M5 uses SIMPLE returns for mean/variance;
the two are labelled wherever both appear.
Optimisation: scipy.optimize SLSQP. Risk parity: SLSQP on ERC deviation.
Ledoit-Wolf shrinkage: implemented directly (Ledoit & Wolf 2004).
Black-Litterman views are [ilustrasi] — stated in the lesson.
Run: python3 qa-learn/m5_canonical_calc.py  (from ~/workspace/learn-platform)
"""
import json
import numpy as np
import pandas as pd
from scipy import optimize

RF = 0.05
ASSETS = ["BBCA", "KLBF", "UNVR"]

prices = pd.read_csv("data/m4_prices.csv", index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


sr = {c: _simpret(close[c]) for c in close.columns}
# Common trading days (inner join) — the optimisation universe.
R = pd.DataFrame({c: sr[c] for c in ASSETS}).dropna()
print("common days:", len(R), "from", R.index[0].date(), "to", R.index[-1].date())

mu_d = R.mean().values                    # daily simple mean
cov_d = R.cov().values                    # daily covariance
mu = mu_d * 252                           # annualised mean
cov = cov_d * 252                         # annualised covariance
vol = np.sqrt(np.diag(cov))
corr = np.corrcoef(R.values.T)

out = {"n_days": int(len(R)), "first": str(R.index[0].date()),
       "last": str(R.index[-1].date()), "rf": RF}
for i, c in enumerate(ASSETS):
    out[f"{c}_ann_ret"] = round(float(mu[i]), 4)
    out[f"{c}_ann_vol"] = round(float(vol[i]), 4)
    out[f"{c}_sharpe"] = round(float((mu[i] - RF) / vol[i]), 4)
    print(f"{c}: ann_ret={mu[i]:.4f} ann_vol={vol[i]:.4f} sharpe(rf=5%)={(mu[i]-RF)/vol[i]:.4f}")
print("corr BBCA-KLBF=%.4f BBCA-UNVR=%.4f KLBF-UNVR=%.4f" % (corr[0, 1], corr[0, 2], corr[1, 2]))
out["corr_bbca_klbf"] = round(float(corr[0, 1]), 4)
out["corr_bbca_unvr"] = round(float(corr[0, 2]), 4)
out["corr_klbf_unvr"] = round(float(corr[1, 2]), 4)


def port_stats(w, mu_v, cov_m):
    ret = float(w @ mu_v)
    v = float(np.sqrt(w @ cov_m @ w))
    return ret, v, (ret - RF) / v if v > 0 else float("nan")


def _min_var(mu_v, cov_m, bounds, extra=None):
    n = len(mu_v)
    cons = [{"type": "eq", "fun": lambda w: w.sum() - 1.0}]
    if extra:
        cons += extra
    res = optimize.minimize(lambda w: w @ cov_m @ w, np.ones(n) / n,
                            method="SLSQP", bounds=bounds, constraints=cons)
    assert res.success, res.message
    return res.x


def _max_sharpe(mu_v, cov_m, bounds):
    n = len(mu_v)
    cons = [{"type": "eq", "fun": lambda w: w.sum() - 1.0}]
    res = optimize.minimize(lambda w: -(w @ mu_v - RF) / np.sqrt(w @ cov_m @ w),
                            np.ones(n) / n, method="SLSQP",
                            bounds=bounds, constraints=cons)
    assert res.success, res.message
    return res.x


LO = [(0.0, 1.0)] * 3          # long-only
FREE = [(None, None)] * 3      # shorting allowed

w_gmv = _min_var(mu, cov, LO)
w_ms = _max_sharpe(mu, cov, LO)
w_ew = np.ones(3) / 3
w_gmv_free = _min_var(mu, cov, FREE)
w_ms_free = _max_sharpe(mu, cov, FREE)
for name, w in [("gmv", w_gmv), ("maxsharpe", w_ms), ("equalweight", w_ew),
                ("gmv_unconstrained", w_gmv_free), ("maxsharpe_unconstrained", w_ms_free)]:
    r, v, s = port_stats(w, mu, cov)
    print(f"{name}: w={np.round(w, 4)} ret={r:.4f} vol={v:.4f} sharpe={s:.4f}")
    out[f"{name}_w"] = [round(float(x), 4) for x in w]
    out[f"{name}_ret"] = round(float(r), 4)
    out[f"{name}_vol"] = round(float(v), 4)
    out[f"{name}_sharpe"] = round(float(s), 4)

# Max-Sharpe SLSQP stopping points from 4 starting points (M5.2):
# the problem is ill-posed (no finite optimum) — the solver stops at
# different points depending on x0. All stops sum to 1 (the constraint);
# lesson displays them with ONE decimal (integers would sum to 0 or 1
# by rounding luck — gate run 5 RAGU, verified 2026-11-12).
def _max_sharpe_from(mu_v, cov_m, x0):
    cons = [{"type": "eq", "fun": lambda w: w.sum() - 1.0}]
    res = optimize.minimize(lambda w: -(w @ mu_v - RF) / np.sqrt(w @ cov_m @ w),
                            np.asarray(x0, dtype=float), method="SLSQP",
                            bounds=FREE, constraints=cons)
    assert res.success, res.message
    return res.x

for name, x0 in [("ms_stop_ew", np.ones(3) / 3),
                 ("ms_stop_001", [0.0, 0.0, 1.0]),
                 ("ms_stop_060301", [0.6, 0.3, 0.1]),
                 ("ms_stop_100", [1.0, 0.0, 0.0])]:
    w = _max_sharpe_from(mu, cov, x0)
    r, v, s = port_stats(w, mu, cov)
    print(f"{name}: w={np.round(w, 1)} sum={w.sum():.4f} sharpe={s:.4f}")
    out[f"{name}_w"] = [round(float(x), 1) for x in w]
    out[f"{name}_sharpe"] = round(float(s), 4)

# Unconstrained GMV closed form (Lagrange): w = Sigma^-1 1 / (1' Sigma^-1 1)
inv = np.linalg.inv(cov)
w_gmv_cf = inv @ np.ones(3) / (np.ones(3) @ inv @ np.ones(3))
print("gmv closed-form w:", np.round(w_gmv_cf, 4), "vs SLSQP:", np.round(w_gmv_free, 4))
out["gmv_closedform_w"] = [round(float(x), 4) for x in w_gmv_cf]

# 2-asset analytic GMV (BBCA+KLBF) for M5.2 worked example
s1, s2, s12 = cov[0, 0], cov[1, 1], cov[0, 1]
w1 = (s2 - s12) / (s1 + s2 - 2 * s12)
print(f"2-asset GMV BBCA+KLBF: w_BBCA={w1:.4f} w_KLBF={1-w1:.4f}")
out["two_asset_gmv_w_bbca"] = round(float(w1), 4)
out["two_asset_gmv_w_klbf"] = round(float(1 - w1), 4)

# ---- efficient frontier (long-only): 8 target returns GMV -> max asset return
r_gmv = w_gmv @ mu
r_max = mu.max()
targets = np.linspace(r_gmv, r_max, 8)
front = []
for rt in targets:
    w = _min_var(mu, cov, LO, extra=[{"type": "eq", "fun": lambda w, rt=rt: w @ mu - rt}])
    r, v, s = port_stats(w, mu, cov)
    front.append([round(float(r), 4), round(float(v), 4),
                  [round(float(x), 4) for x in w]])
    print(f"frontier target={rt:.4f} -> ret={r:.4f} vol={v:.4f} w={np.round(w, 4)}")
out["frontier"] = front

# ---- risk parity (equal risk contribution, long-only)
def _risk_parity(cov_m):
    n = len(cov_m)
    def obj(w):
        rc = w * (cov_m @ w) / (w @ cov_m @ w)
        return float(((rc - rc.mean()) ** 2).sum())
    cons = [{"type": "eq", "fun": lambda w: w.sum() - 1.0}]
    best = None
    for x0 in [np.ones(n) / n, np.array([0.5, 0.3, 0.2]), np.array([0.2, 0.3, 0.5])]:
        res = optimize.minimize(obj, x0, method="SLSQP", bounds=LO, constraints=cons)
        if best is None or res.fun < best.fun:
            best = res
    assert best.success, best.message
    return best.x


w_rp = _risk_parity(cov)
rc = w_rp * (cov @ w_rp) / (w_rp @ cov @ w_rp)
r, v, s = port_stats(w_rp, mu, cov)
print(f"risk parity: w={np.round(w_rp, 4)} RC shares={np.round(rc, 4)} ret={r:.4f} vol={v:.4f} sharpe={s:.4f}")
out["riskparity_w"] = [round(float(x), 4) for x in w_rp]
out["riskparity_rc"] = [round(float(x), 4) for x in rc]
out["riskparity_ret"] = round(float(r), 4)
out["riskparity_vol"] = round(float(v), 4)
out["riskparity_sharpe"] = round(float(s), 4)
# RC shares of the other portfolios (for the M5.4 comparison table)
for name, w in [("gmv", w_gmv), ("maxsharpe", w_ms), ("equalweight", w_ew)]:
    rcx = w * (cov @ w) / (w @ cov @ w)
    out[f"{name}_rc"] = [round(float(x), 4) for x in rcx]
    print(f"{name} RC shares: {np.round(rcx, 4)}")

# ---- gradient descent demo (M5.1): f(x,y) = x^2 + 10 y^2, start (4,4), 10 steps
print("\n== GD on f = x^2 + 10y^2, start (4,4), 10 steps ==")
gd = {}
for eta in (0.01, 0.05, 0.09, 0.12):
    x, y = 4.0, 4.0
    for _ in range(10):
        x -= eta * 2 * x
        y -= eta * 20 * y
    f = x * x + 10 * y * y
    gd[str(eta)] = round(float(f), 4)
    print(f"eta={eta}: x={x:.4f} y={y:.4f} f={f:.4f}")
out["gd_bowl"] = gd
# One GD step on 2-asset min-variance (BBCA+KLBF), from w=(0.5,0.5), eta=0.5
cov2 = cov[:2, :2]
w0 = np.array([0.5, 0.5])
grad = 2 * cov2 @ w0
w1gd = w0 - 0.5 * grad
w1gd = w1gd / w1gd.sum()  # re-normalise to sum 1 (projection step, stated in lesson)
v0 = float(w0 @ cov2 @ w0)
v1 = float(w1gd @ cov2 @ w1gd)
print(f"GD min-var 2-asset: grad={np.round(grad, 4)} w0={w0} var0={v0:.4f} -> w1={np.round(w1gd, 4)} var1={v1:.4f}")
out["gd_step_grad"] = [round(float(x), 4) for x in grad]
out["gd_step_w1"] = [round(float(x), 4) for x in w1gd]
out["gd_step_var0"] = round(float(v0), 4)
out["gd_step_var1"] = round(float(v1), 4)

# ---- Ledoit-Wolf shrinkage (M5.5)
def ledoit_wolf(X):
    n, p = X.shape
    S = np.cov(X.T)
    m = np.trace(S) / p
    F = m * np.eye(p)
    Xc = X - X.mean(axis=0)
    # pi-hat (sum of asymptotic variances of sample covariances)
    pi = 0.0
    for i in range(p):
        for j in range(p):
            pi += float(np.mean((Xc[:, i] * Xc[:, j] - S[i, j]) ** 2))
    rho = 0.0
    for i in range(p):
        for j in range(p):
            rho += float(np.mean(((Xc[:, i] * Xc[:, j] - S[i, j]) * (F[i, j] - S[i, j])) ** 2)) \
                if False else 0.0
    # simpler rho via the standard estimator: sum over i,j of Var estimate
    # use the direct formula: rho = sum Var(S_ij - F_ij) estimated by sample
    gamma = float(((S - F) ** 2).sum())
    # asymptotic variance of (S - F) entries
    rho = 0.0
    for i in range(p):
        for j in range(p):
            rho += float(np.var(Xc[:, i] * Xc[:, j] - S[i, j], ddof=1) / n)
    delta = max(0.0, min(1.0, rho / gamma)) if gamma > 0 else 0.0
    return delta, delta * F + (1 - delta) * S


X = R.values  # daily simple returns, 480 x 3
delta_lw, cov_lw_d = ledoit_wolf(X)
cov_lw = cov_lw_d * 252
print(f"\nLedoit-Wolf: delta={delta_lw:.4f}")
out["lw_delta"] = round(float(delta_lw), 4)
w_gmv_lw = _min_var(mu, cov_lw, LO)
w_ms_lw = _max_sharpe(mu, cov_lw, LO)
for name, w in [("gmv_lw", w_gmv_lw), ("maxsharpe_lw", w_ms_lw)]:
    r, v, s = port_stats(w, mu, cov)  # evaluated on SAMPLE covariance (honest)
    print(f"{name}: w={np.round(w, 4)} ret={r:.4f} vol={v:.4f} sharpe={s:.4f} (sample cov)")
    out[f"{name}_w"] = [round(float(x), 4) for x in w]
    out[f"{name}_ret"] = round(float(r), 4)
    out[f"{name}_vol"] = round(float(v), 4)
    out[f"{name}_sharpe"] = round(float(s), 4)

# ---- out-of-sample split: first 240 days estimate, next 240 test (M5.5 USP)
R1, R2 = R.iloc[:240], R.iloc[240:]
mu1, cov1 = R1.mean().values * 252, R1.cov().values * 252
mu2, cov2o = R2.mean().values * 252, R2.cov().values * 252
print("\n== OOS split 240/240 ==")
print(f"period 1 ann ret: {np.round(mu1, 4)} | period 2 ann ret: {np.round(mu2, 4)}")
out["oos_mu1"] = [round(float(x), 4) for x in mu1]
out["oos_mu2"] = [round(float(x), 4) for x in mu2]
oos = {}
for name, fn in [("gmv", lambda m, c: _min_var(m, c, LO)),
                 ("maxsharpe", lambda m, c: _max_sharpe(m, c, LO)),
                 ("riskparity", lambda m, c: _risk_parity(c))]:
    w = fn(mu1, cov1)
    r_in, v_in, s_in = port_stats(w, mu1, cov1)
    r_oos, v_oos, s_oos = port_stats(w, mu2, cov2o)
    oos[name] = {"w": [round(float(x), 4) for x in w],
                 "in_ret": round(float(r_in), 4), "in_vol": round(float(v_in), 4),
                 "in_sharpe": round(float(s_in), 4),
                 "oos_ret": round(float(r_oos), 4), "oos_vol": round(float(v_oos), 4),
                 "oos_sharpe": round(float(s_oos), 4)}
    print(f"{name}: w={np.round(w, 4)} IN ret={r_in:.4f} vol={v_in:.4f} sharpe={s_in:.4f} | "
          f"OOS ret={r_oos:.4f} vol={v_oos:.4f} sharpe={s_oos:.4f}")
# equal-weight OOS for reference
r_in, v_in, s_in = port_stats(w_ew, mu1, cov1)
r_oos, v_oos, s_oos = port_stats(w_ew, mu2, cov2o)
oos["equalweight"] = {"w": [round(float(x), 4) for x in w_ew],
                      "in_ret": round(float(r_in), 4), "in_vol": round(float(v_in), 4),
                      "in_sharpe": round(float(s_in), 4),
                      "oos_ret": round(float(r_oos), 4), "oos_vol": round(float(v_oos), 4),
                      "oos_sharpe": round(float(s_oos), 4)}
print(f"equalweight: IN ret={r_in:.4f} vol={v_in:.4f} sharpe={s_in:.4f} | "
      f"OOS ret={r_oos:.4f} vol={v_oos:.4f} sharpe={s_oos:.4f}")
# shrunk covariance estimated on period 1, GMV/max-Sharpe OOS
_, cov1_lw_d = ledoit_wolf(R1.values)
cov1_lw = cov1_lw_d * 252
for name, fn in [("gmv_lw", lambda m, c: _min_var(m, c, LO)),
                 ("maxsharpe_lw", lambda m, c: _max_sharpe(m, c, LO))]:
    w = fn(mu1, cov1_lw)
    r_in, v_in, s_in = port_stats(w, mu1, cov1)
    r_oos, v_oos, s_oos = port_stats(w, mu2, cov2o)
    oos[name] = {"w": [round(float(x), 4) for x in w],
                 "in_ret": round(float(r_in), 4), "in_vol": round(float(v_in), 4),
                 "in_sharpe": round(float(s_in), 4),
                 "oos_ret": round(float(r_oos), 4), "oos_vol": round(float(v_oos), 4),
                 "oos_sharpe": round(float(s_oos), 4)}
    print(f"{name}: w={np.round(w, 4)} IN ret={r_in:.4f} vol={v_in:.4f} sharpe={s_in:.4f} | "
          f"OOS ret={r_oos:.4f} vol={v_oos:.4f} sharpe={s_oos:.4f}")
out["oos"] = oos

# ---- Black-Litterman (M5.5) — views are [ilustrasi], stated in the lesson
# Market portfolio proxy = equal-weight (no market caps in the pin data).
# Risk aversion delta = 2.5, tau = 0.05.
w_mkt = np.ones(3) / 3
DELTA_RA, TAU = 2.5, 0.05
Pi = DELTA_RA * cov @ w_mkt                       # implied equilibrium excess returns
P = np.array([[1.0, -1.0, 0.0]])                  # view: BBCA beats KLBF by 2pp/yr
Q = np.array([0.02])                              # [ilustrasi]
Omega = TAU * (P @ cov @ P.T)
tau_sig = TAU * cov
M_post = np.linalg.inv(np.linalg.inv(tau_sig) + P.T @ np.linalg.inv(Omega) @ P) @ \
    (np.linalg.inv(tau_sig) @ Pi + P.T @ np.linalg.inv(Omega) @ Q)
print("\n== Black-Litterman (views [ilustrasi]) ==")
print(f"Pi (equilibrium excess): {np.round(Pi, 4)}")
print(f"posterior mean M: {np.round(M_post, 4)}")
w_bl = _max_sharpe(M_post + RF, cov, LO)          # max-Sharpe on posterior total returns
r_bl, v_bl, s_bl = port_stats(w_bl, M_post + RF, cov)
r_bl_s, v_bl_s, s_bl_s = port_stats(w_bl, mu, cov)  # same weights on SAMPLE stats (honest)
print(f"BL weights: {np.round(w_bl, 4)} posterior ret={r_bl:.4f} vol={v_bl:.4f} sharpe={s_bl:.4f} | "
      f"on sample stats ret={r_bl_s:.4f} vol={v_bl_s:.4f} sharpe={s_bl_s:.4f}")
out["bl_pi"] = [round(float(x), 4) for x in Pi]
out["bl_posterior_mean"] = [round(float(x), 4) for x in M_post]
out["bl_w"] = [round(float(x), 4) for x in w_bl]
out["bl_ret_post"] = round(float(r_bl), 4)
out["bl_vol"] = round(float(v_bl), 4)
out["bl_sharpe_post"] = round(float(s_bl), 4)
out["bl_ret_sample"] = round(float(r_bl_s), 4)
out["bl_sharpe_sample"] = round(float(s_bl_s), 4)

# ---- tangency / ill-posed max-Sharpe (M5.2) ----
# Dengan aset bebas risiko (tanpa kendala sum w = 1): Sharpe maks teoritis
# = sqrt((mu-rf)' Sigma^-1 (mu-rf)). Arah tangency Sigma^-1(mu-rf) di data ini
# berjumlah NEGATIF (net short) — dinormalisasi ke sum=1 arahnya terbalik
# dan Sharpe-nya -1,0517. Tanpa kendala DAN dengan sum=1, masalah max-Sharpe
# TIDAK punya optimum berhingga: supremumnya = Sharpe arah zero-cost terbaik
# (0,6718), didekati hanya bila leverage -> tak hingga. SLSQP berhenti di
# w=[-3154,-3786,6941] (Sharpe 0,6697) — artefak titik berhenti, bukan solusi.
ex = mu - RF
inv_cov = np.linalg.inv(cov)
max_sharpe_theory = float(np.sqrt(ex @ inv_cov @ ex))
d_tan = inv_cov @ ex
lam = (np.ones(3) @ inv_cov @ mu) / (np.ones(3) @ inv_cov @ np.ones(3))
z = inv_cov @ (mu - lam * np.ones(3))
z = z / np.abs(z).max()
sup_zero = float(z @ mu / np.sqrt(z @ cov @ z))
print("\n== tangency / ill-posed max-Sharpe ==")
print(f"arah tangency: {np.round(d_tan, 4)} sum={d_tan.sum():.4f} | max Sharpe teoritis={max_sharpe_theory:.4f}")
print(f"arah zero-cost terbaik: {np.round(z, 4)} supremum Sharpe={sup_zero:.4f}")
out["tangency_dir"] = [round(float(x), 4) for x in d_tan]
out["tangency_dir_sum"] = round(float(d_tan.sum()), 4)
out["max_sharpe_theory"] = round(max_sharpe_theory, 4)
out["zerocost_best_dir"] = [round(float(x), 4) for x in z]
out["zerocost_best_sharpe"] = round(sup_zero, 4)

# ---- GMV turnover L1 (M5.5): period-1 GMV vs full-window GMV, UNROUNDED weights ----
# (0,2783 — NOT 0,2781, which is what you get from the 4-decimal rounded weights.)
w_gmv_p1 = _min_var(mu1, cov1, LO)
w_gmv_full = _min_var(mu, cov, LO)
out["gmv_turnover_l1"] = round(float(np.abs(w_gmv_p1 - w_gmv_full).sum()), 4)
print(f"\nGMV turnover L1 (unrounded): {out['gmv_turnover_l1']:.4f}")

with open("qa-learn/m5_canonical.json", "w") as f:
    json.dump(out, f, indent=2)
print("\nSaved qa-learn/m5_canonical.json —", len(out), "keys")

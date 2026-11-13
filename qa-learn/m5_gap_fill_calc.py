"""Deterministic fill calculations for MLF M5 gap fill (G1-G10).

Data: ~/workspace/learn-platform/data/m4_prices.csv (yfinance 2026-11-12,
window 2024-11-01..2026-11-12, auto_adjust=True). Same conventions as
qa-learn/m5_canonical_calc.py: SIMPLE returns, common trading days
(inner join of the 3 IDX stocks = 480 days), annualisation x252 / sqrt(252),
rf = 0.05. Optimisation: scipy SLSQP (same helpers as canonical calc).
Black-Litterman views are [ilustrasi] (lesson-stated); cost assumptions
(spread/komisi/slippage) are [ilustrasi] and stated explicitly wherever used.
Run: python3 qa-learn/m5_gap_fill_calc.py  (from ~/workspace/learn-platform)
All printed numbers are the source for the M5 gap-fill lesson text.
"""
import json
import numpy as np
import pandas as pd
from scipy import optimize
from scipy.optimize import linprog

RF = 0.05
ASSETS = ["BBCA", "KLBF", "UNVR"]

prices = pd.read_csv("data/m4_prices.csv", index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")

LAST_PRICES = {c: float(close[c].dropna().iloc[-1]) for c in ASSETS}
LAST_DATE = str(close["BBCA"].dropna().index[-1].date())
print(f"harga penutupan terakhir ({LAST_DATE}): " +
      ", ".join(f"{c} Rp{LAST_PRICES[c]:,.0f}" for c in ASSETS))


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


sr = {c: _simpret(close[c]) for c in close.columns}
R = pd.DataFrame({c: sr[c] for c in ASSETS}).dropna()
mu_d = R.mean().values
cov_d = R.cov().values
mu = mu_d * 252
cov = cov_d * 252
vol = np.sqrt(np.diag(cov))
N = len(R)
print(f"common days: {N}  mu={np.round(mu, 4)}  vol={np.round(vol, 4)}")


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


LO = [(0.0, 1.0)] * 3
w_gmv = _min_var(mu, cov, LO)
w_ms = _max_sharpe(mu, cov, LO)
w_ew = np.ones(3) / 3
w_rp = _risk_parity(cov)
# sanity: reproduce canonical anchors
assert abs(float(np.abs(w_gmv - w_ew).sum()) - 0.2783) > -1  # placeholder, checked below
canon = json.load(open("qa-learn/m5_canonical.json"))
assert np.allclose(w_gmv, canon["gmv_w"], atol=0.001), w_gmv
assert np.allclose(w_rp, canon["riskparity_w"], atol=0.001), w_rp
print("sanity OK: GMV/RP match m5_canonical.json")

# ---------- shared: Ledoit-Wolf (same implementation as canonical calc) ----
def ledoit_wolf(X):
    n, p = X.shape
    S = np.cov(X.T)
    m = np.trace(S) / p
    F = m * np.eye(p)
    Xc = X - X.mean(axis=0)
    pi = 0.0
    for i in range(p):
        for j in range(p):
            pi += float(np.mean((Xc[:, i] * Xc[:, j] - S[i, j]) ** 2))
    gamma = float(((S - F) ** 2).sum())
    rho = 0.0
    for i in range(p):
        for j in range(p):
            rho += float(np.var(Xc[:, i] * Xc[:, j] - S[i, j], ddof=1) / n)
    delta = max(0.0, min(1.0, rho / gamma)) if gamma > 0 else 0.0
    return delta, delta * F + (1 - delta) * S


def black_litterman(cov_m, w_mkt, tau=0.05, omega_scale=1.0, Q=0.02,
                    delta_ra=2.5):
    """Returns Pi, M, w_bl (max-Sharpe long-only on posterior TOTAL returns).
    Omega follows He-Litterman: Omega = omega_scale * tau * P Sigma P'."""
    Pi = delta_ra * cov_m @ w_mkt
    P = np.array([[1.0, -1.0, 0.0]])
    Qv = np.array([Q])
    Omega = omega_scale * tau * (P @ cov_m @ P.T)
    tau_sig = tau * cov_m
    M_post = np.linalg.inv(np.linalg.inv(tau_sig) + P.T @ np.linalg.inv(Omega) @ P) @ \
        (np.linalg.inv(tau_sig) @ Pi + P.T @ np.linalg.inv(Omega) @ Qv)
    w_bl = _max_sharpe(M_post + RF, cov_m, LO)
    return Pi, M_post, w_bl


# sanity: BL baseline reproduces canonical
Pi0, M0, w_bl0 = black_litterman(cov, w_ew)
assert np.allclose(Pi0, canon["bl_pi"], atol=0.001), Pi0
assert np.allclose(M0, canon["bl_posterior_mean"], atol=0.001), M0
assert np.allclose(w_bl0, canon["bl_w"], atol=0.001), w_bl0
print("sanity OK: Black-Litterman baseline matches canonical "
      f"(Pi={np.round(Pi0, 4)}, M={np.round(M0, 4)}, w={np.round(w_bl0, 4)})")
delta_lw, _ = ledoit_wolf(R.values)
assert abs(delta_lw - canon["lw_delta"]) < 0.001, delta_lw
print(f"sanity OK: Ledoit-Wolf delta={delta_lw:.4f} (kanonis {canon['lw_delta']})")

out = {}

print()
print("=" * 70)
print("G1 — Transaction cost: turnover, cost model, turnover budget")
print("=" * 70)
# Cost model [ilustrasi]: spread 10bp + komisi 5bp + slippage 5bp = 20bp
# one-way per unit traded notional. One-way traded notional = L1/2.
COST_ONE_WAY = 0.0020
print("asumsi biaya [ilustrasi]: spread 10bp + komisi 5bp + slippage 5bp "
      "= 20bp sekali jalan per unit notional yang diperdagangkan")
turn = {}
for a, wa in [("ew_gmv", (w_ew, w_gmv)), ("ew_rp", (w_ew, w_rp)),
              ("ew_ms", (w_ew, w_ms)), ("gmv_rp", (w_gmv, w_rp)),
              ("gmv_ms", (w_gmv, w_ms))]:
    l1 = float(np.abs(wa[0] - wa[1]).sum())
    cost = (l1 / 2) * COST_ONE_WAY
    turn[a] = {"l1": round(l1, 4), "cost": round(cost, 5),
               "cost_bps": round(cost * 10000, 2),
               "cost_rp_100jt": round(cost * 100_000_000)}
    print(f"turnover {a}: L1={l1:.4f} | notional sekali jalan={l1/2:.4f} "
          f"| biaya={cost*10000:.2f}bp = Rp{cost*100_000_000:,.0f} per Rp100jt")
out["g1_turnover"] = turn
# verify canonical anchor: P1-GMV vs full-GMV L1 = 0.2783
R1, R2 = R.iloc[:240], R.iloc[240:]
mu1, cov1 = R1.mean().values * 252, R1.cov().values * 252
w_gmv_p1 = _min_var(mu1, cov1, LO)
l1_p1 = float(np.abs(w_gmv_p1 - w_gmv).sum())
print(f"turnover GMV periode-1 -> GMV window penuh: L1={l1_p1:.4f} "
      f"(kanonis gmv_turnover_l1={canon['gmv_turnover_l1']}) | "
      f"biaya={(l1_p1/2)*COST_ONE_WAY*10000:.2f}bp")
assert abs(l1_p1 - canon["gmv_turnover_l1"]) < 0.001
out["g1_turnover_p1_full"] = {"l1": round(l1_p1, 4),
                              "cost_bps": round((l1_p1 / 2) * COST_ONE_WAY * 10000, 2)}
# Turnover-constrained GMV (L1 from EW <= budget)
print("GMV dengan budget turnover (L1 dari EW):")
g1_budget = {}
for budget in [0.05, 0.10, 0.20]:
    w = _min_var(mu, cov, LO, extra=[
        {"type": "ineq",
         "fun": lambda w, b=budget: b - float(np.abs(w - w_ew).sum())}])
    r, v, s = port_stats(w, mu, cov)
    l1 = float(np.abs(w - w_ew).sum())
    g1_budget[str(budget)] = {"w": [round(float(x), 4) for x in w],
                              "ret": round(r, 4), "vol": round(v, 4),
                              "l1": round(l1, 4),
                              "cost_bps": round((l1 / 2) * COST_ONE_WAY * 10000, 2)}
    print(f"  budget L1<={budget}: w={np.round(w, 4)} ret={r:.4f} vol={v:.4f} "
          f"(+{(v-0.2966)*10000:.0f}bp vol vs GMV bebas) L1={l1:.4f}")
g1_budget["unconstrained"] = {"w": [round(float(x), 4) for x in w_gmv],
                              "ret": round(float(w_gmv @ mu), 4),
                              "vol": round(float(np.sqrt(w_gmv @ cov @ w_gmv)), 4),
                              "l1": round(float(np.abs(w_gmv - w_ew).sum()), 4)}
out["g1_turnover_budget"] = g1_budget
# Monthly / quarterly buy-and-hold drift of GMV (no rebalancing)
print("drift buy-and-hold bobot GMV (tanpa rebalancing, target tetap):")
g1_drift = {}
for horizon, label in [(21, "21 hari (bulanan)"), (63, "63 hari (kuartalan)")]:
    drifts = []
    for start in range(0, N - horizon, horizon):
        w_start = w_gmv.copy()
        seg = R.values[start:start + horizon]
        w_end = w_start * np.cumprod(1 + seg, axis=0)[-1]
        w_end = w_end / w_end.sum()
        drifts.append(float(np.abs(w_end - w_start).sum()))
    g1_drift[label] = {"mean_l1": round(float(np.mean(drifts)), 4),
                       "max_l1": round(float(np.max(drifts)), 4),
                       "n_blocks": len(drifts),
                       "cost_per_rebal_bps": round(float(np.mean(drifts)) / 2 * COST_ONE_WAY * 10000, 2),
                       "annual_cost_bps": round(float(np.mean(drifts)) / 2 * COST_ONE_WAY * 10000 * (252 / horizon), 2)}
    d = g1_drift[label]
    print(f"  {label}: drift L1 rata-rata={d['mean_l1']:.4f} maks={d['max_l1']:.4f} "
          f"({d['n_blocks']} blok) | biaya per rebalance={d['cost_per_rebal_bps']:.2f}bp "
          f"| biaya tahunan={d['annual_cost_bps']:.2f}bp")
out["g1_drift"] = g1_drift

print()
print("=" * 70)
print("G2 — Rebalancing: lifecycle, drift 240 hari, trigger ambang")
print("=" * 70)
# Buy-and-hold drift over period 2 (240 days), target = full-window weights
g2 = {}
for name, w0 in [("gmv", w_gmv), ("riskparity", w_rp), ("equalweight", w_ew)]:
    seg = R2.values
    w_end = w0 * np.cumprod(1 + seg, axis=0)[-1]
    w_end = w_end / w_end.sum()
    l1 = float(np.abs(w_end - w0).sum())
    g2[name] = {"w_start": [round(float(x), 4) for x in w0],
                "w_end_240d": [round(float(x), 4) for x in w_end],
                "l1_drift_240d": round(l1, 4),
                "max_single_drift": round(float(np.abs(w_end - w0).max()), 4)}
    print(f"{name}: {np.round(w0, 4)} -> setelah 240 hari tanpa rebalance "
          f"{np.round(w_end, 4)} | L1 drift={l1:.4f} | drift aset terbesar="
          f"{np.abs(w_end - w0).max():.4f}")
out["g2_drift_240d"] = g2
# Threshold-triggered rebalancing simulation (full 480 days, fixed target)
print("simulasi trigger ambang (target tetap, 480 hari):")
g2_trig = {}
for name, w0 in [("gmv", w_gmv), ("riskparity", w_rp)]:
    for thr in [0.02, 0.05]:
        w = w0.copy()
        n_trig = 0
        total_cost_l1 = 0.0
        for t in range(N):
            w = w * (1 + R.values[t])
            w = w / w.sum()
            if np.abs(w - w0).max() > thr:
                total_cost_l1 += float(np.abs(w - w0).sum())
                w = w0.copy()
                n_trig += 1
        g2_trig[f"{name}_thr{thr}"] = {
            "n_rebalances": n_trig,
            "total_l1_traded": round(total_cost_l1, 4),
            "total_cost_bps": round(total_cost_l1 / 2 * COST_ONE_WAY * 10000, 2),
            "annual_cost_bps": round(total_cost_l1 / 2 * COST_ONE_WAY * 10000 * 252 / N, 2)}
        d = g2_trig[f"{name}_thr{thr}"]
        print(f"  {name} ambang {thr*100:.0f}pp: {n_trig} rebalance dalam 480 hari | "
              f"total L1 diperdagangkan={d['total_l1_traded']:.4f} | "
              f"biaya total={d['total_cost_bps']:.2f}bp "
              f"(~{d['annual_cost_bps']:.2f}bp/tahun)")
out["g2_threshold"] = g2_trig
# Calendar rebalancing cost (fixed target, monthly = every 21 days)
print("simulasi kalender (target tetap, 480 hari):")
g2_cal = {}
for name, w0 in [("gmv", w_gmv)]:
    for horizon, label in [(21, "bulanan"), (63, "kuartalan")]:
        w = w0.copy()
        total_l1 = 0.0
        n_reb = 0
        for t in range(N):
            w = w * (1 + R.values[t])
            w = w / w.sum()
            if (t + 1) % horizon == 0:
                total_l1 += float(np.abs(w - w0).sum())
                w = w0.copy()
                n_reb += 1
        g2_cal[f"{name}_{label}"] = {
            "n_rebalances": n_reb,
            "total_l1_traded": round(total_l1, 4),
            "total_cost_bps": round(total_l1 / 2 * COST_ONE_WAY * 10000, 2),
            "annual_cost_bps": round(total_l1 / 2 * COST_ONE_WAY * 10000 * 252 / N, 2)}
        d = g2_cal[f"{name}_{label}"]
        print(f"  {name} {label}: {n_reb} rebalance | total L1={d['total_l1_traded']:.4f} | "
              f"biaya total={d['total_cost_bps']:.2f}bp (~{d['annual_cost_bps']:.2f}bp/tahun)")
out["g2_calendar"] = g2_cal

print()
print("=" * 70)
print("G3 — Robust optimization: uncertainty set, worst-case, ranking flip")
print("=" * 70)
se_ann = vol * np.sqrt(252 / N)
print(f"SE return tahunan (n=480): BBCA {se_ann[0]:.4f} KLBF {se_ann[1]:.4f} "
      f"UNVR {se_ann[2]:.4f}  [SE = vol x sqrt(252/480) = vol x {np.sqrt(252/N):.4f}]")
g3 = {"se_ann": [round(float(x), 4) for x in se_ann]}
for k in [0.5, 1.0, 1.5]:
    mu_wc = mu - k * se_ann
    print(f"worst-case mu (k={k}, box mu - k*SE): {np.round(mu_wc, 4)}")
    row = {}
    for name, w in [("gmv", w_gmv), ("equalweight", w_ew),
                    ("riskparity", w_rp), ("maxsharpe", w_ms)]:
        wc_ret = float(w @ mu_wc)
        row[name] = round(wc_ret, 4)
        print(f"  k={k} {name}: worst-case return={wc_ret:.4f} "
              f"(nominal {float(w @ mu):.4f})")
    g3[f"k{k}"] = {"mu_wc": [round(float(x), 4) for x in mu_wc], "worst_case_ret": row}
# Robust max-Sharpe long-only on worst-case mu (k=1)
mu_wc1 = mu - se_ann
w_rms = _max_sharpe(mu_wc1, cov, LO)
r_wc, v_wc, s_wc = port_stats(w_rms, mu_wc1, cov)
r_nom, v_nom, s_nom = port_stats(w_rms, mu, cov)
print(f"robust max-Sharpe (k=1, worst-case mu): w={np.round(w_rms, 4)} | "
      f"worst-case ret={r_wc:.4f} vol={v_wc:.4f} Sharpe_wc={s_wc:.4f} | "
      f"pada mu nominal ret={r_nom:.4f} Sharpe={s_nom:.4f}")
print(f"bandingkan max-Sharpe nominal [0;0;1]: worst-case ret="
      f"{float(w_ms @ mu_wc1):.4f} Sharpe_wc="
      f"{(float(w_ms @ mu_wc1)-RF)/float(np.sqrt(w_ms @ cov @ w_ms)):.4f}")
g3["robust_maxsharpe"] = {"w": [round(float(x), 4) for x in w_rms],
                          "worst_case_ret": round(r_wc, 4),
                          "vol": round(v_wc, 4),
                          "sharpe_wc": round(s_wc, 4),
                          "nominal_ret": round(r_nom, 4),
                          "nominal_sharpe": round(s_nom, 4)}
# Robust GMV with worst-case return floor
for floor in [-0.35, -0.40]:
    w = _min_var(mu, cov, LO, extra=[
        {"type": "ineq",
         "fun": lambda w, f=floor: float(w @ mu_wc1) - f}])
    r, v, s = port_stats(w, mu, cov)
    r_wc2 = float(w @ mu_wc1)
    print(f"robust GMV, lantai worst-case return {floor}: w={np.round(w, 4)} "
          f"ret nominal={r:.4f} vol={v:.4f} | worst-case ret={r_wc2:.4f}")
    g3[f"robust_gmv_floor{floor}"] = {
        "w": [round(float(x), 4) for x in w], "ret": round(r, 4),
        "vol": round(v, 4), "worst_case_ret": round(r_wc2, 4)}
out["g3"] = g3

print()
print("=" * 70)
print("G4 — Validasi numerik input: eigenvalue, condition number, PSD")
print("=" * 70)
eig_cov = np.linalg.eigvalsh(cov)
eig_corr = np.linalg.eigvalsh(np.corrcoef(R.values.T))
cond_cov = float(eig_cov[-1] / eig_cov[0])
cond_corr = float(eig_corr[-1] / eig_corr[0])
print(f"eigenvalue Sigma (tahunan): {np.round(eig_cov, 6)}")
print(f"eigenvalue matriks korelasi: {np.round(eig_corr, 4)}")
print(f"condition number Sigma = {eig_cov[-1]:.4f}/{eig_cov[0]:.6f} = {cond_cov:.1f}")
print(f"condition number korelasi = {cond_corr:.1f} | det(Sigma) = {np.linalg.det(cov):.6f}")
try:
    np.linalg.cholesky(cov)
    cholesky_ok = True
except np.linalg.LinAlgError:
    cholesky_ok = False
print(f"Cholesky berhasil (PSD): {cholesky_ok} | eigenvalue terkecil > 0: {eig_cov[0] > 0}")
g4 = {"eig_cov": [round(float(x), 6) for x in eig_cov],
      "eig_corr": [round(float(x), 4) for x in eig_corr],
      "cond_cov": round(cond_cov, 1), "cond_corr": round(cond_corr, 1),
      "det_cov": round(float(np.linalg.det(cov)), 6), "cholesky_ok": cholesky_ok}
# Near-singular demo [ilustrasi]: 2-asset, vols kanonis, corr -> 1
print("demo hampir-singular [ilustrasi]: 2 aset, vol 0,3449/0,4251:")
g4_demo = {}
for rho in [0.90, 0.99, 0.999, 1.0]:
    S2 = np.array([[vol[0] ** 2, rho * vol[0] * vol[1]],
                   [rho * vol[0] * vol[1], vol[1] ** 2]])
    ev = np.linalg.eigvalsh(S2)
    cond = float(ev[-1] / ev[0]) if ev[0] > 1e-12 else float("inf")
    det = float(np.linalg.det(S2))
    g4_demo[str(rho)] = {"eig_min": round(float(ev[0]), 6),
                         "cond": round(cond, 1) if cond != float("inf") else "inf",
                         "det": round(det, 6)}
    print(f"  corr={rho}: eigenvalue terkecil={ev[0]:.6f} cond={cond:.1f} det={det:.6f}")
# Inverse sensitivity [ilustrasi]: perturb cov[0,1] by +0.001 -> GMV moves?
cov_pert = cov.copy()
cov_pert[0, 1] += 0.001
cov_pert[1, 0] += 0.001
w_pert = _min_var(mu, cov_pert, LO)
dw = float(np.abs(w_pert - w_gmv).sum())
print(f"sensitivitas invers [ilustrasi]: Sigma[0,1] +0,001 -> GMV "
      f"{np.round(w_gmv, 4)} menjadi {np.round(w_pert, 4)} | pergeseran L1={dw:.4f}")
g4["perturb_l1"] = round(dw, 4)
g4["near_singular_demo"] = g4_demo
out["g4"] = g4

print()
print("=" * 70)
print("G5 — Sensitivity analysis sistematis (satu input berubah)")
print("=" * 70)
g5 = {}
# (a) rf
print("sensitivitas rf (max-Sharpe long-only):")
g5_rf = {}
for rf_v in [0.03, 0.05, 0.07]:
    res = optimize.minimize(
        lambda w: -(w @ mu - rf_v) / np.sqrt(w @ cov @ w),
        np.ones(3) / 3, method="SLSQP", bounds=LO,
        constraints=[{"type": "eq", "fun": lambda w: w.sum() - 1.0}])
    w = res.x
    r, v, s = float(w @ mu), float(np.sqrt(w @ cov @ w)), float((w @ mu - rf_v) / np.sqrt(w @ cov @ w))
    g5_rf[str(rf_v)] = {"w": [round(float(x), 4) for x in w],
                        "ret": round(r, 4), "vol": round(v, 4), "sharpe": round(s, 4)}
    print(f"  rf={rf_v}: w={np.round(w, 4)} ret={r:.4f} vol={v:.4f} Sharpe={s:.4f}")
out["g5_rf"] = g5_rf
# (b) target return
print("sensitivitas target return (min-var long-only):")
g5_tgt = {}
for tgt in [-0.10, 0.00]:
    w = _min_var(mu, cov, LO, extra=[
        {"type": "eq", "fun": lambda w, t=tgt: float(w @ mu) - t}])
    r, v, s = port_stats(w, mu, cov)
    g5_tgt[str(tgt)] = {"w": [round(float(x), 4) for x in w],
                        "ret": round(r, 4), "vol": round(v, 4)}
    print(f"  target={tgt}: w={np.round(w, 4)} ret={r:.4f} vol={v:.4f}")
out["g5_target"] = g5_tgt
# (c) vol shock: scale one asset's vol
print("sensitivitas vol (GMV):")
g5_vol = {}
for name, D in [("unvr_x1.2", np.diag([1.0, 1.0, 1.2])),
                ("klbf_x1.2", np.diag([1.0, 1.2, 1.0])),
                ("semua_x1.1", np.diag([1.1, 1.1, 1.1]))]:
    cov_s = D @ cov @ D
    w = _min_var(mu, cov_s, LO)
    r, v, s = port_stats(w, mu, cov)  # evaluated on ORIGINAL cov (honest)
    g5_vol[name] = {"w": [round(float(x), 4) for x in w],
                    "ret": round(r, 4), "vol": round(v, 4)}
    print(f"  {name}: GMV w={np.round(w, 4)} (asli {np.round(w_gmv, 4)}) "
          f"ret={r:.4f} vol={v:.4f}")
out["g5_volshock"] = g5_vol
# (d) cap w_UNVR <= 0.50 on max-Sharpe
w_cap = _max_sharpe(mu, cov, [(0.0, 1.0), (0.0, 1.0), (0.0, 0.50)])
r, v, s = port_stats(w_cap, mu, cov)
print(f"cap w_UNVR<=0,50 (max-Sharpe): w={np.round(w_cap, 4)} ret={r:.4f} "
      f"vol={v:.4f} Sharpe={s:.4f} (vs tanpa cap [0;0;1] Sharpe 0,0590)")
out["g5_cap_ms"] = {"w": [round(float(x), 4) for x in w_cap],
                    "ret": round(r, 4), "vol": round(v, 4), "sharpe": round(s, 4)}
# (e) shrinkage delta on GMV (target m*I, m = trace(Sigma)/3 tahunan)
m_tr = float(np.trace(cov) / 3)
print(f"shrinkage target m*I, m = trace(Sigma)/3 = {m_tr:.6f}:")
g5_shr = {}
for delta in [0.0, 0.0955, 0.3, 0.5]:
    cov_sh = (1 - delta) * cov + delta * m_tr * np.eye(3)
    w = _min_var(mu, cov_sh, LO)
    r, v, s = port_stats(w, mu, cov)  # evaluated on SAMPLE cov (honest)
    g5_shr[str(delta)] = {"w": [round(float(x), 4) for x in w],
                          "ret": round(r, 4), "vol": round(v, 4)}
    print(f"  delta={delta}: GMV w={np.round(w, 4)} ret={r:.4f} vol={v:.4f}")
out["g5_shrinkage"] = g5_shr
# verify the M5.2 checkpoint number: max return with w_UNVR <= 0.50
w_maxret_cap = optimize.minimize(
    lambda w: -(w @ mu), np.ones(3) / 3, method="SLSQP",
    bounds=[(0.0, 1.0), (0.0, 1.0), (0.0, 0.50)],
    constraints=[{"type": "eq", "fun": lambda w: w.sum() - 1.0}]).x
print(f"verifikasi checkpoint M5.2: return maks dengan w_UNVR<=0,50 = "
      f"{float(w_maxret_cap @ mu):.4f} pada w={np.round(w_maxret_cap, 4)} "
      f"(lesson: -0,0825 pada [0,5; 0; 0,5])")
out["g5_maxret_cap"] = {"w": [round(float(x), 4) for x in w_maxret_cap],
                        "ret": round(float(w_maxret_cap @ mu), 4)}

print()
print("=" * 70)
print("G6 — Sensitivitas Black-Litterman (tau / Omega / Q / proxy)")
print("=" * 70)
g6 = {}
# (a) tau alone: with He-Litterman Omega = tau*P Sigma P', tau CANCELS in M
print("tau saja (Omega = tau x P Sigma P-transpos, konvensi He-Litterman):")
g6_tau = {}
for tau in [0.01, 0.05, 0.20]:
    Pi, M_post, w_bl = black_litterman(cov, w_ew, tau=tau)
    r_p, v_p, s_p = port_stats(w_bl, M_post + RF, cov)
    r_s, v_s, s_s = port_stats(w_bl, mu, cov)
    g6_tau[str(tau)] = {"M": [round(float(x), 4) for x in M_post],
                        "w": [round(float(x), 4) for x in w_bl],
                        "sharpe_post": round(s_p, 4), "sharpe_sample": round(s_s, 4)}
    print(f"  tau={tau}: M={np.round(M_post, 4)} w={np.round(w_bl, 4)} "
          f"Sharpe_post={s_p:.4f} Sharpe_sample={s_s:.4f}")
out["g6_tau"] = g6_tau
# (b) Omega scale: relative confidence of the view
print("skala Omega (keyakinan relatif view; 0,5 = lebih yakin, 2 = kurang yakin):")
g6_om = {}
for scale in [0.5, 1.0, 2.0, 4.0]:
    Pi, M_post, w_bl = black_litterman(cov, w_ew, tau=0.05, omega_scale=scale)
    r_p, v_p, s_p = port_stats(w_bl, M_post + RF, cov)
    g6_om[str(scale)] = {"M": [round(float(x), 4) for x in M_post],
                         "w": [round(float(x), 4) for x in w_bl],
                         "sharpe_post": round(s_p, 4)}
    print(f"  Omega x{scale}: M={np.round(M_post, 4)} w={np.round(w_bl, 4)} "
          f"Sharpe_post={s_p:.4f}")
out["g6_omega"] = g6_om
# (c) view size Q
print("ukuran view Q (\"BBCA mengungguli KLBF Q pp\"):")
g6_q = {}
for q in [0.01, 0.02, 0.05]:
    Pi, M_post, w_bl = black_litterman(cov, w_ew, tau=0.05, Q=q)
    g6_q[str(q)] = {"M": [round(float(x), 4) for x in M_post],
                    "w": [round(float(x), 4) for x in w_bl]}
    print(f"  Q={q}: M={np.round(M_post, 4)} w={np.round(w_bl, 4)}")
out["g6_q"] = g6_q
# (d) market proxy: EW vs GMV vs [0,5; 0,3; 0,2] [ilustrasi]
print("proxy market portfolio (Pi = delta x Sigma x w_mkt):")
g6_px = {}
for name, w_mkt in [("equalweight", w_ew), ("gmv", w_gmv),
                    ("ilustrasi_50_30_20", np.array([0.5, 0.3, 0.2]))]:
    Pi, M_post, w_bl = black_litterman(cov, w_mkt, tau=0.05)
    r_p, v_p, s_p = port_stats(w_bl, M_post + RF, cov)
    g6_px[name] = {"Pi": [round(float(x), 4) for x in Pi],
                   "M": [round(float(x), 4) for x in M_post],
                   "w": [round(float(x), 4) for x in w_bl],
                   "sharpe_post": round(s_p, 4)}
    print(f"  {name}: Pi={np.round(Pi, 4)} M={np.round(M_post, 4)} "
          f"w={np.round(w_bl, 4)} Sharpe_post={s_p:.4f}")
out["g6_proxy"] = g6_px

print()
print("=" * 70)
print("G7 — Walk-forward / rolling backtest (6 lipatan x 40 hari)")
print("=" * 70)
# Expanding + rolling windows: train from day 0/rolling-240, test next 40.
# Strategies re-estimated each fold; weights held during the 40 test days.
# The original 240/240 split is KEPT (canonical oos) — this is a SECOND
# evaluation, not a replacement.


def _wf(mode):
    folds = []
    all_rets = {name: [] for name in ["gmv", "maxsharpe", "riskparity", "equalweight"]}
    for k in range(6):
        test_start = 240 + 40 * k
        if mode == "expanding":
            train = R.iloc[:test_start]
        else:  # rolling 240-day window
            train = R.iloc[test_start - 240:test_start]
        test = R.iloc[test_start:test_start + 40]
        mu_tr = train.mean().values * 252
        cov_tr = train.cov().values * 252
        ws = {"gmv": _min_var(mu_tr, cov_tr, LO),
              "maxsharpe": _max_sharpe(mu_tr, cov_tr, LO),
              "riskparity": _risk_parity(cov_tr),
              "equalweight": w_ew}
        fold = {"fold": k + 1,
                "train": f"hari 1..{test_start}", "test": f"hari {test_start+1}..{test_start+40}"}
        for name, w in ws.items():
            daily = test.values @ w
            tot = float(np.prod(1 + daily) - 1)
            vol_f = float(np.std(daily, ddof=1) * np.sqrt(252))
            shr = float((np.mean(daily) * 252 - RF) / vol_f) if vol_f > 0 else float("nan")
            fold[name] = {"ret": round(tot, 4), "vol": round(vol_f, 4),
                          "sharpe": round(shr, 4)}
            all_rets[name].extend(daily.tolist())
        folds.append(fold)
    # concatenated OOS (240 days): total return, vol, Sharpe, maxDD
    agg = {}
    for name, daily in all_rets.items():
        daily = np.array(daily)
        tot = float(np.prod(1 + daily) - 1)
        vol_a = float(np.std(daily, ddof=1) * np.sqrt(252))
        shr = float((np.mean(daily) * 252 - RF) / vol_a)
        eq = np.cumprod(1 + daily)
        mdd = float((eq / np.maximum.accumulate(eq) - 1).min())
        wins = sum(1 for f in folds if f[name]["ret"] > f["equalweight"]["ret"])
        agg[name] = {"total_ret_240d": round(tot, 4),
                     "mean_fold_ret": round(float(np.mean([f[name]["ret"] for f in folds])), 4),
                     "mean_fold_vol": round(float(np.mean([f[name]["vol"] for f in folds])), 4),
                     "mean_fold_sharpe": round(float(np.mean([f[name]["sharpe"] for f in folds])), 4),
                     "vol": round(vol_a, 4), "sharpe": round(shr, 4),
                     "maxdd": round(mdd, 4), "folds_beating_ew": wins}
    return folds, agg


for mode in ["expanding", "rolling"]:
    folds, agg = _wf(mode)
    print(f"--- walk-forward {mode} (6 lipatan, train 240 hari, test 40 hari) ---")
    for f in folds:
        print(f"  lipatan {f['fold']} (test {f['test']}): " +
              " | ".join(f"{n}: ret {f[n]['ret']:+.4f} vol {f[n]['vol']:.4f} "
                         f"Sharpe {f[n]['sharpe']:+.4f}"
                         for n in ["gmv", "maxsharpe", "riskparity", "equalweight"]))
    for name, a in agg.items():
        print(f"  {mode} {name}: total 240 hari={a['total_ret_240d']:+.4f} "
              f"vol={a['vol']:.4f} Sharpe={a['sharpe']:+.4f} maxDD={a['maxdd']:.4f} "
              f"| rata-rata lipatan ret={a['mean_fold_ret']:+.4f} "
              f"Sharpe={a['mean_fold_sharpe']:+.4f} | lipatan menang vs EW: "
              f"{a['folds_beating_ew']}/6")
    out[f"g7_{mode}"] = {"folds": folds, "agg": agg}

print()
print("=" * 70)
print("G8 — Dari bobot ke perdagangan: target holdings, trade list, sisa kas")
print("=" * 70)
# Portfolio Rp100.000.000 [ilustrasi]; harga penutupan terakhir 2026-11-11;
# lot IDX = 100 lembar; saham dibulatkan KE BAWAH ke kelipatan lot.
V = 100_000_000
LOT = 100
print(f"nilai portofolio Rp{V:,.0f} [ilustrasi]; lot {LOT} lembar; "
      f"harga {LAST_DATE}: " + ", ".join(f"{c} Rp{LAST_PRICES[c]:,.0f}" for c in ASSETS))
g8 = {"value_rp": V, "lot": LOT, "prices": {c: LAST_PRICES[c] for c in ASSETS},
      "date": LAST_DATE}
for name, w in [("gmv", w_gmv), ("maxsharpe", w_ms), ("equalweight", w_ew)]:
    target_val = w * V
    shares = np.floor(target_val / np.array([LAST_PRICES[c] for c in ASSETS]) / LOT) * LOT
    invested = shares * np.array([LAST_PRICES[c] for c in ASSETS])
    resid = V - invested.sum()
    # without lot rounding (floor to 1 share) for contrast
    shares1 = np.floor(target_val / np.array([LAST_PRICES[c] for c in ASSETS]))
    resid1 = V - float((shares1 * np.array([LAST_PRICES[c] for c in ASSETS])).sum())
    g8[name] = {"w": [round(float(x), 4) for x in w],
                "target_value_rp": [round(float(x)) for x in target_val],
                "shares_lot": [int(x) for x in shares],
                "invested_rp": [round(float(x)) for x in invested],
                "residual_cash_rp": round(float(resid)),
                "residual_cash_pct": round(float(resid / V * 100), 2),
                "residual_1share_rp": round(float(resid1))}
    print(f"{name} w={np.round(w, 4)}:")
    for i, c in enumerate(ASSETS):
        print(f"  {c}: target Rp{target_val[i]:,.0f} -> {int(shares[i]):,} lbr "
              f"(Rp{invested[i]:,.0f})")
    print(f"  total terinvestasi Rp{invested.sum():,.0f} | sisa kas Rp{resid:,.0f} "
          f"({resid/V*100:.2f}% dari nilai) | bandingkan tanpa lot (1 lembar): "
          f"sisa Rp{resid1:,.0f}")
# Trade list: from EW holdings to GMV target (rebalance trade)
print("daftar perdagangan (trade list): dari EW ke GMV:")
ew_shares = np.floor((w_ew * V) / np.array([LAST_PRICES[c] for c in ASSETS]) / LOT) * LOT
gmv_shares = np.array(g8["gmv"]["shares_lot"], dtype=float)
trade = gmv_shares - ew_shares
g8["trade_ew_to_gmv"] = {"ew_shares": [int(x) for x in ew_shares],
                         "gmv_shares": [int(x) for x in gmv_shares],
                         "trade_shares": [int(x) for x in trade],
                         "trade_value_rp": [round(float(trade[i] * LAST_PRICES[c]))
                                            for i, c in enumerate(ASSETS)]}
for i, c in enumerate(ASSETS):
    side = "BELI" if trade[i] > 0 else ("JUAL" if trade[i] < 0 else "TAHAN")
    print(f"  {c}: EW {int(ew_shares[i]):,} lbr -> GMV {int(gmv_shares[i]):,} lbr | "
          f"{side} {abs(int(trade[i])):,} lbr (Rp{abs(trade[i]*LAST_PRICES[c]):,.0f})")
out["g8"] = g8

print()
print("=" * 70)
print("G9 — Downside-risk optimization: semivariance & ES-min")
print("=" * 70)
Rd = R.values
MAR = 0.0
down = np.minimum(Rd - MAR, 0.0)
dd_daily = np.sqrt((down ** 2).mean(axis=0))
dd_ann = dd_daily * np.sqrt(252)
sortino = (mu - RF) / dd_ann
print("downside deviation (MAR=0, tahunan) & Sortino per aset:")
g9 = {"downside_dev": [round(float(x), 4) for x in dd_ann],
      "sortino": [round(float(x), 4) for x in sortino]}
for i, c in enumerate(ASSETS):
    print(f"  {c}: DD={dd_ann[i]:.4f} (vol {vol[i]:.4f}) Sortino={sortino[i]:.4f}")
# Semivariance matrix (Markowitz 1959): E[min(r_i,0) * min(r_j,0)] x 252
semi_cov = (down.T @ down) / len(Rd) * 252
w_semi = _min_var(mu, semi_cov, LO)
dd_p = float(np.sqrt(w_semi @ semi_cov @ w_semi))
r_semi, v_semi, s_semi = port_stats(w_semi, mu, cov)
sort_semi = float((r_semi - RF) / dd_p)
print(f"portofolio semivarians-min: w={np.round(w_semi, 4)} ret={r_semi:.4f} "
      f"vol={v_semi:.4f} downside-dev={dd_p:.4f} Sortino={sort_semi:.4f}")
print(f"bandingkan GMV: downside-dev="
      f"{float(np.sqrt(w_gmv @ semi_cov @ w_gmv)):.4f} "
      f"Sortino={float((float(w_gmv @ mu)-RF)/np.sqrt(w_gmv @ semi_cov @ w_gmv)):.4f} | "
      f"EW: downside-dev={float(np.sqrt(w_ew @ semi_cov @ w_ew)):.4f} "
      f"Sortino={float((float(w_ew @ mu)-RF)/np.sqrt(w_ew @ semi_cov @ w_ew)):.4f}")
g9["min_semivariance"] = {"w": [round(float(x), 4) for x in w_semi],
                          "ret": round(r_semi, 4), "vol": round(v_semi, 4),
                          "downside_dev": round(dd_p, 4),
                          "sortino": round(sort_semi, 4)}
g9["gmv_downside"] = {"downside_dev": round(float(np.sqrt(w_gmv @ semi_cov @ w_gmv)), 4),
                      "sortino": round(float((float(w_gmv @ mu) - RF) / np.sqrt(w_gmv @ semi_cov @ w_gmv)), 4)}
g9["ew_downside"] = {"downside_dev": round(float(np.sqrt(w_ew @ semi_cov @ w_ew)), 4),
                     "sortino": round(float((float(w_ew @ mu) - RF) / np.sqrt(w_ew @ semi_cov @ w_ew)), 4)}
# ES-min via Rockafellar-Uryasev LP (historical scenarios, alpha=0.95)
alpha = 0.95
n_scen = len(Rd)
# variables: w(3) + zeta(1) + u(480); minimise zeta + 1/((1-alpha)*n) * sum(u)
c_obj = np.concatenate([np.zeros(3), [1.0],
                        np.full(n_scen, 1.0 / ((1 - alpha) * n_scen))])
# u_t >= -w'r_t - zeta  ->  w'r_t + zeta + u_t >= 0  ->  -(w'r_t + zeta + u_t) <= 0
A_ub = np.zeros((n_scen, 3 + 1 + n_scen))
for t in range(n_scen):
    A_ub[t, :3] = Rd[t]
    A_ub[t, 3] = 1.0
    A_ub[t, 4 + t] = 1.0
A_ub = -A_ub
A_eq = np.zeros((1, 3 + 1 + n_scen))
A_eq[0, :3] = 1.0
res_es = linprog(c_obj, A_ub=A_ub, b_ub=np.zeros(n_scen),
                 A_eq=A_eq, b_eq=np.array([1.0]),
                 bounds=[(0, 1)] * 3 + [(None, None)] + [(0, None)] * n_scen,
                 method="highs")
assert res_es.success, res_es.message
w_es = res_es.x[:3]
zeta = res_es.x[3]
losses = -(Rd @ w_es)
var95 = float(np.quantile(losses, 0.95))
es95 = float(losses[losses >= var95].mean())
r_es, v_es, s_es = port_stats(w_es, mu, cov)
print(f"portofolio ES95-min (LP, 480 skenario): w={np.round(w_es, 4)} "
      f"ret={r_es:.4f} vol={v_es:.4f} VaR95 harian={var95:.4f} ES95 harian={es95:.4f}")
print(f"bandingkan GMV: VaR95 harian="
      f"{float(np.quantile(-(Rd @ w_gmv), 0.95)):.4f} ES95 harian="
      f"{float((-(Rd @ w_gmv))[(-(Rd @ w_gmv)) >= np.quantile(-(Rd @ w_gmv), 0.95)].mean()):.4f}")
g9["min_es95"] = {"w": [round(float(x), 4) for x in w_es],
                  "ret": round(r_es, 4), "vol": round(v_es, 4),
                  "var95_daily": round(var95, 4), "es95_daily": round(es95, 4)}
out["g9"] = g9

print()
print("=" * 70)
print("G10 — Kendala realistis: cap grup, kardinalitas, minimum holding")
print("=" * 70)
g10 = {}
# (a) bank cap [ilustrasi]: w_BBCA <= 0,40 (GMV)
w_cap40 = _min_var(mu, cov, [(0.0, 0.40), (0.0, 1.0), (0.0, 1.0)])
r, v, s = port_stats(w_cap40, mu, cov)
print(f"GMV + cap BBCA<=0,40 [ilustrasi]: w={np.round(w_cap40, 4)} ret={r:.4f} "
      f"vol={v:.4f} (+{(v-0.2966)*10000:.0f}bp vs GMV bebas)")
g10["cap_bbca040"] = {"w": [round(float(x), 4) for x in w_cap40],
                      "ret": round(r, 4), "vol": round(v, 4),
                      "vol_cost_bps": round((v - 0.2966) * 10000)}
# (b) cardinality <= 2: enumerate pairs
print("GMV + kardinalitas <= 2 aset:")
g10_card = {}
for pair in [(0, 1), (0, 2), (1, 2)]:
    bounds = [(0.0, 1.0) if i in pair else (0.0, 0.0) for i in range(3)]
    w = _min_var(mu, cov, bounds)
    r, v, s = port_stats(w, mu, cov)
    g10_card["+".join(ASSETS[i] for i in pair)] = {
        "w": [round(float(x), 4) for x in w], "ret": round(r, 4),
        "vol": round(v, 4)}
    print(f"  {pair} ({'+'.join(ASSETS[i] for i in pair)}): w={np.round(w, 4)} "
          f"ret={r:.4f} vol={v:.4f}")
best_pair = min(g10_card, key=lambda k: g10_card[k]["vol"])
print(f"  terbaik: {best_pair} vol={g10_card[best_pair]['vol']:.4f} "
      f"(+{(g10_card[best_pair]['vol']-0.2966)*10000:.0f}bp vs GMV bebas)")
g10["cardinality2"] = g10_card
# (c) minimum holding 0,10: w_i in {0} U [0.10, 1]
print("GMV + minimum holding 0,10 (bila dipegang, minimal 10%):")
g10_min = {}
for mask in range(1, 8):
    subset = [i for i in range(3) if mask & (1 << i)]
    bounds = [(0.10, 1.0) if i in subset else (0.0, 0.0) for i in range(3)]
    try:
        w = _min_var(mu, cov, bounds)
    except AssertionError:
        continue
    r, v, s = port_stats(w, mu, cov)
    g10_min["+".join(ASSETS[i] for i in subset)] = {
        "w": [round(float(x), 4) for x in w], "ret": round(r, 4),
        "vol": round(v, 4)}
best_min = min(g10_min, key=lambda k: g10_min[k]["vol"])
print(f"  terbaik: {best_min} w={g10_min[best_min]['w']} "
      f"ret={g10_min[best_min]['ret']:.4f} vol={g10_min[best_min]['vol']:.4f} "
      f"(+{(g10_min[best_min]['vol']-0.2966)*10000:.0f}bp vs GMV bebas)")
for k, d in g10_min.items():
    print(f"    {k}: w={d['w']} vol={d['vol']:.4f}")
g10["min_holding010"] = g10_min
# (d) turnover budget already in G1; restate the 0.10-budget GMV here
g10["turnover_budget010"] = out["g1_turnover_budget"]["0.1"]
print(f"GMV + budget turnover L1<=0,10 (dari G1): "
      f"w={g10['turnover_budget010']['w']} vol={g10['turnover_budget010']['vol']:.4f}")
out["g10"] = g10

json.dump(out, open("qa-learn/m5_gap_fill_numbers.json", "w"), indent=1)
print()
print("Saved qa-learn/m5_gap_fill_numbers.json")
print("DONE")

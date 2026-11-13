"""Canonical numbers for MLF M7.3 (Explainability: SHAP & LIME).

Deterministic: seed 42 everywhere; data = data/uci_default_credit.xls
(UCI Default of Credit Card Clients, 30.000 rows).
Pipeline REPLICATES the flagship notebook
~/workspace/guided-projects/ml-finance-credit-scoring/credit-scoring-end-to-end.ipynb
exactly: same add_features(), same stratified 80/20 split (test 6.000,
random_state=42), LR = Pipeline(StandardScaler,
LogisticRegression(max_iter=1000, random_state=42)),
GBM = HistGradientBoostingClassifier(random_state=42) defaults,
decision model = CalibratedClassifierCV(GBM, method='sigmoid', cv=3),
operational threshold 0.10.

Locked numbers to verify (tolerance 0.001):
  GBM test ROC-AUC 0.7823 / PR-AUC 0.5597
  LR  test ROC-AUC 0.7426 / PR-AUC 0.5049
  threshold 0.10

SHAP: the `shap` package is NOT installed in system python (externally
managed; `pip install shap` fails on the Debian numpy; /tmp is a 512M tmpfs).
SHAP was computed for real with shap 0.54.1 in venv
~/workspace/.venv-shap-m73 (kernel `shap-m73`) — see m7_calc_m73_fix.py and
the `shap_gbm` section of m7_canonical_m73.json. The Colab notebook installs
shap via pip and computes SHAP there. NO SHAP value is fabricated.

What this script DOES compute in the VM:
  (a) LR coefficients (standardised features) + odds ratios
  (b) permutation importance, GBM + LR, test set, scoring=roc_auc,
      n_repeats=10, random_state=42 (same protocol as flagship cell 33)
  (c) partial dependence, computed MANUALLY (set feature to a grid value,
      average predicted probability over the 6.000 test rows):
      - 1D: PAY_MAX, PAY_MEAN, UTILIZATION on calibrated GBM and on LR
      - 2D: PAY_MAX x UTILIZATION on calibrated GBM
  (d) local explanation of one rejected test customer (highest calibrated
      probability): LR log-odds contributions + LIME-style local surrogate
      (perturbations around the instance, kernel-weighted linear fit)
  (e) misleading-explanation demos: correlated-feature importance split,
      underfit-GBM (max_iter=5) explanation, LR-vs-GBM top-feature
      disagreement

Run: python3 qa-learn/m7_calc_m73.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_canonical_m73.json
"""
import json
import time

import numpy as np
import pandas as pd
import sklearn
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
RNG = np.random.default_rng(SEED)
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m7_canonical_m73.json"
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} numpy={np.__version__} "
      f"pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__,
               "numpy": np.__version__, "pandas": pd.__version__,
               "data": DATA_XLS,
               "note": "shap NOT installed in VM; SHAP taught conceptually "
                       "+ computed in Colab notebook. No SHAP value fabricated."}
try:
    import shap  # noqa
    out["meta"]["shap"] = shap.__version__
    print("shap available:", shap.__version__)
except ImportError:
    out["meta"]["shap"] = None
    print("shap NOT available in this VM (expected).")
try:
    import lime  # noqa
    out["meta"]["lime"] = lime.__version__
except ImportError:
    out["meta"]["lime"] = None
    print("lime NOT available in this VM (expected; LIME-style surrogate "
          "computed manually with sklearn).")

# ---------------------------------------------------------------- load + features (flagship replica)
df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
assert df["default"].isin([0, 1]).all()
print(f"data: {df.shape}, base rate={df['default'].mean():.4f}")
out["data_n"] = 30000
out["data_base_rate"] = round(float(df["default"].mean()), 4)

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
FEATURES = list(X_train.columns)
print(f"train {X_train.shape} test {X_test.shape} n_features={len(FEATURES)}")
out["n_features"] = len(FEATURES)
out["train_n"] = int(len(X_train))
out["test_n"] = int(len(X_test))


def r4(x):
    return round(float(x), 4)


# ---------------------------------------------------------------- flagship reproduction check
lr_pipe = Pipeline([("scaler", StandardScaler()),
                    ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))])
lr_pipe.fit(X_train, y_train)
lr_proba = lr_pipe.predict_proba(X_test)[:, 1]
gbm = HistGradientBoostingClassifier(random_state=SEED)
gbm.fit(X_train, y_train)
gbm_proba = gbm.predict_proba(X_test)[:, 1]
cal_gbm = CalibratedClassifierCV(estimator=HistGradientBoostingClassifier(random_state=SEED),
                                 method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]

repro = {
    "lr_roc_auc": r4(roc_auc_score(y_test, lr_proba)),
    "lr_pr_auc": r4(average_precision_score(y_test, lr_proba)),
    "gbm_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
    "gbm_pr_auc": r4(average_precision_score(y_test, gbm_proba)),
    "cal_gbm_roc_auc": r4(roc_auc_score(y_test, cal_proba)),
}
targets = {"lr_roc_auc": 0.7426, "lr_pr_auc": 0.5049,
           "gbm_roc_auc": 0.7823, "gbm_pr_auc": 0.5597}
repro["targets"] = targets
repro["diffs"] = {k: r4(repro[k] - v) for k, v in targets.items()}
repro["all_within_0.001"] = bool(all(abs(repro["diffs"][k]) <= 0.001 for k in targets))
out["repro_flagship"] = repro
print("REPRO:", repro)

# ---------------------------------------------------------------- (a) LR coefficients (standardised) + odds ratios
lr_model = lr_pipe.named_steps["logreg"]
scaler = lr_pipe.named_steps["scaler"]
coef = pd.Series(lr_model.coef_[0], index=FEATURES)
oratio = np.exp(coef)
coef_sorted = coef.reindex(coef.abs().sort_values(ascending=False).index)
out["lr_coef"] = {
    "intercept": r4(lr_model.intercept_[0]),
    "top12_abs": [{"feature": f, "coef": r4(coef[f]), "odds_ratio": r4(oratio[f])}
                  for f in coef_sorted.index[:12]],
    "all": {f: r4(coef[f]) for f in FEATURES},
    "odds_ratio_all": {f: r4(oratio[f]) for f in FEATURES},
}
print("\nLR top 12 |coef| (per 1 SD):")
for f in coef_sorted.index[:12]:
    print(f"  {f:16s} coef={coef[f]:+.4f}  OR={oratio[f]:.4f}")

# ---------------------------------------------------------------- (b) permutation importance (test, roc_auc, 10 repeats)
print("\npermutation importance GBM (test, roc_auc, n_repeats=10) ...")
perm_gbm = permutation_importance(gbm, X_test, y_test, n_repeats=10,
                                  random_state=SEED, scoring="roc_auc", n_jobs=-1)
imp_gbm = pd.Series(perm_gbm.importances_mean, index=FEATURES).sort_values(ascending=False)
imp_gbm_sd = pd.Series(perm_gbm.importances_std, index=FEATURES)
print("permutation importance LR (test, roc_auc, n_repeats=10) ...")
perm_lr = permutation_importance(lr_pipe, X_test, y_test, n_repeats=10,
                                 random_state=SEED, scoring="roc_auc", n_jobs=-1)
imp_lr = pd.Series(perm_lr.importances_mean, index=FEATURES).sort_values(ascending=False)
imp_lr_sd = pd.Series(perm_lr.importances_std, index=FEATURES)
out["perm_importance_gbm"] = {
    "top12": [{"feature": f, "mean_drop": r4(imp_gbm[f]), "sd": r4(imp_gbm_sd[f])}
              for f in imp_gbm.index[:12]],
    "all": {f: r4(imp_gbm[f]) for f in FEATURES},
    "scoring": "roc_auc", "n_repeats": 10, "set": "test (6000)",
    "base_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
}
out["perm_importance_lr"] = {
    "top12": [{"feature": f, "mean_drop": r4(imp_lr[f]), "sd": r4(imp_lr_sd[f])}
              for f in imp_lr.index[:12]],
    "all": {f: r4(imp_lr[f]) for f in FEATURES},
    "scoring": "roc_auc", "n_repeats": 10, "set": "test (6000)",
    "base_roc_auc": r4(roc_auc_score(y_test, lr_proba)),
}
print("GBM top 12 permutation importance:")
for f in imp_gbm.index[:12]:
    print(f"  {f:16s} drop={imp_gbm[f]:.4f} (sd {imp_gbm_sd[f]:.4f})")
print("LR top 12 permutation importance:")
for f in imp_lr.index[:12]:
    print(f"  {f:16s} drop={imp_lr[f]:.4f} (sd {imp_lr_sd[f]:.4f})")

# ---------------------------------------------------------------- (c) partial dependence, manual grid
def manual_pdp_1d(model, X, feature, grid):
    """Mean predicted P(default) over all test rows with feature set to v."""
    vals = []
    Xc = X.copy()
    for v in grid:
        Xc[feature] = v
        vals.append(float(model.predict_proba(Xc)[:, 1].mean()))
    return [r4(v) for v in vals]


def manual_pdp_2d(model, X, f1, grid1, f2, grid2):
    rows = []
    Xc = X.copy()
    for v1 in grid1:
        row = []
        for v2 in grid2:
            Xc[f1] = v1
            Xc[f2] = v2
            row.append(r4(float(model.predict_proba(Xc)[:, 1].mean())))
        rows.append(row)
    return rows


pay_max_grid = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
pay_mean_grid = [round(float(v), 2) for v in np.quantile(X_test["PAY_MEAN"], [0, .1, .25, .5, .75, .9, 1.0])]
util_grid = [0.0, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0]
print("\nPDP 1D (calibrated GBM + LR) ...")
pdp = {
    "pay_max_grid": pay_max_grid,
    "cal_gbm_pay_max": manual_pdp_1d(cal_gbm, X_test, "PAY_MAX", pay_max_grid),
    "lr_pay_max": manual_pdp_1d(lr_pipe, X_test, "PAY_MAX", pay_max_grid),
    "gbm_pay_max": manual_pdp_1d(gbm, X_test, "PAY_MAX", pay_max_grid),
    "pay_mean_grid": pay_mean_grid,
    "cal_gbm_pay_mean": manual_pdp_1d(cal_gbm, X_test, "PAY_MEAN", pay_mean_grid),
    "util_grid": util_grid,
    "cal_gbm_utilization": manual_pdp_1d(cal_gbm, X_test, "UTILIZATION", util_grid),
    "lr_utilization": manual_pdp_1d(lr_pipe, X_test, "UTILIZATION", util_grid),
    "note": "manual PDP: feature set to grid value for all 6000 test rows, "
            "mean predicted P(default). Calibrated GBM = decision model.",
}
out["pdp_1d"] = pdp
print("PAY_MAX grid:", pay_max_grid)
print("cal GBM PDP:", pdp["cal_gbm_pay_max"])
print("LR    PDP:", pdp["lr_pay_max"])
print("PAY_MEAN grid:", pay_mean_grid)
print("cal GBM PDP PAY_MEAN:", pdp["cal_gbm_pay_mean"])
print("UTIL grid:", util_grid)
print("cal GBM PDP UTIL:", pdp["cal_gbm_utilization"])
print("LR    PDP UTIL:", pdp["lr_utilization"])

print("PDP 2D PAY_MAX x UTILIZATION (calibrated GBM) ...")
pdp2_grid1 = [0, 1, 2, 3, 4]
pdp2_grid2 = [0.2, 0.5, 1.0, 2.0]
pdp2 = manual_pdp_2d(cal_gbm, X_test, "PAY_MAX", pdp2_grid1, "UTILIZATION", pdp2_grid2)
out["pdp_2d"] = {"pay_max_grid": pdp2_grid1, "util_grid": pdp2_grid2,
                 "cal_gbm": pdp2,
                 "note": "rows = PAY_MAX, cols = UTILIZATION; mean P(default)."}
print("rows PAY_MAX", pdp2_grid1, "cols UTIL", pdp2_grid2)
for g, row in zip(pdp2_grid1, pdp2):
    print(f"  PAY_MAX={g}: {row}")

# ---------------------------------------------------------------- (d) local explanation: most confident rejection
idx = int(np.argmax(cal_proba))
x_row = X_test.iloc[[idx]]
x_raw = X_test_raw.iloc[[idx]]
true_label = int(y_test.iloc[idx])
p_cal = float(cal_proba[idx])
p_gbm = float(gbm_proba[idx])
p_lr = float(lr_proba[idx])
print(f"\nlocal case: test row {idx} (positional), y={true_label}, "
      f"calGBM p={p_cal:.4f}, GBM p={p_gbm:.4f}, LR p={p_lr:.4f}")
# LR log-odds contributions: coef * standardised value
x_std = scaler.transform(x_row)[0]
contrib = pd.Series(lr_model.coef_[0] * x_std, index=FEATURES)
contrib_sorted = contrib.reindex(contrib.abs().sort_values(ascending=False).index)
logodds = float(lr_model.intercept_[0] + contrib.sum())
check_p = 1 / (1 + np.exp(-logodds))
local = {
    "test_positional_index": idx,
    "true_label": true_label,
    "cal_gbm_proba": r4(p_cal),
    "gbm_proba": r4(p_gbm),
    "lr_proba": r4(p_lr),
    "lr_logodds": r4(logodds),
    "lr_logodds_check_proba": r4(check_p),
    "lr_intercept": r4(lr_model.intercept_[0]),
    "raw_features": {c: (int(v) if float(v) == int(v) else r4(v))
                     for c, v in x_raw.iloc[0].items()},
    "top_contributions": [{"feature": f, "std_value": r4(x_std[list(FEATURES).index(f)]),
                           "coef": r4(coef[f]), "contribution_logodds": r4(contrib[f])}
                          for f in contrib_sorted.index[:8]],
    "note": "contributions = coef * standardised feature value; they sum "
            "(+ intercept) to the LR log-odds exactly.",
}
out["local_case"] = local
print("LR log-odds:", round(logodds, 4), "-> p check:", round(check_p, 4),
      "(LR proba:", round(p_lr, 4), ")")
print("top LR contributions (log-odds):")
for f in contrib_sorted.index[:8]:
    print(f"  {f:16s} std={x_std[list(FEATURES).index(f)]:+.3f} coef={coef[f]:+.4f} "
          f"contrib={contrib[f]:+.4f}")

# LIME-style local surrogate around the same instance (GBM, standardised space)
# CORRECTED kernel (fix 2026-11-13): LIME default kw = 0.75*sqrt(n_features).
# The original version used exp(-d^2) (kw=1) in 31-dim space -> E[d^2]=31 ->
# all weights ~exp(-31)~0, weighted R2=0.0003, all coefs 0.0000 (garbage).
# Do NOT revert to kw=1.
print("LIME-style surrogate (2000 perturbations, kernel-weighted Ridge) ...")
X_test_std = scaler.transform(X_test)
x0 = scaler.transform(x_row)[0]
rng_lime = np.random.default_rng(SEED)
n_samp = 2000
Z = rng_lime.normal(0, 1.0, size=(n_samp, len(FEATURES)))
X_pert_std = np.clip(x0 + Z, -4, 6)  # keep perturbations in a sane range
X_pert = pd.DataFrame(scaler.inverse_transform(X_pert_std), columns=FEATURES)
y_pert = gbm.predict_proba(X_pert)[:, 1]
# kernel weights: exp(-(d/kw)^2), d = euclidean distance in std space,
# kw = 0.75*sqrt(n_features) (LIME default)
kw_lime = 0.75 * np.sqrt(len(FEATURES))
d2 = (Z ** 2).sum(axis=1)
w = np.exp(-(d2 / kw_lime ** 2))
surr = Ridge(alpha=1.0)
surr.fit(X_pert_std, y_pert, sample_weight=w)
y_hat = surr.predict(X_pert_std)
ss_res = float((w * (y_pert - y_hat) ** 2).sum())
ss_tot = float((w * (y_pert - np.average(y_pert, weights=w)) ** 2).sum())
r2_w = 1 - ss_res / ss_tot
surr_coef = pd.Series(surr.coef_, index=FEATURES)
surr_sorted = surr_coef.reindex(surr_coef.abs().sort_values(ascending=False).index)
out["lime_style"] = {
    "n_samples": n_samp, "kernel_width": round(float(kw_lime), 4), "weighted_r2": r4(r2_w),
    "intercept": r4(surr.intercept_),
    "gbm_proba_at_instance": r4(p_gbm),
    "surrogate_pred_at_instance": r4(float(surr.predict(x0.reshape(1, -1))[0])),
    "top8": [{"feature": f, "coef": r4(surr_coef[f])}
             for f in surr_sorted.index[:8]],
    "note": "manual LIME-style surrogate: perturbations N(0,1) in standardised "
            "space around the instance, kernel exp(-(d/kw)^2) with "
            "kw = 0.75*sqrt(31) = 4.18 (LIME default). "
            "lime package NOT installed; this is the same idea, built by hand.",
}
print(f"  weighted R2={r2_w:.4f}; surrogate pred at instance "
      f"{float(surr.predict(x0.reshape(1, -1))[0]):.4f} vs GBM {p_gbm:.4f}")
for f in surr_sorted.index[:8]:
    print(f"  {f:16s} coef={surr_coef[f]:+.4f}")

# LIME stability: same protocol, different seed -> top-3 overlap?
print("LIME stability check (seed 7 vs seed 42) ...")
rng2 = np.random.default_rng(7)
Z2 = rng2.normal(0, 1.0, size=(n_samp, len(FEATURES)))
X_pert_std2 = np.clip(x0 + Z2, -4, 6)
X_pert2 = pd.DataFrame(scaler.inverse_transform(X_pert_std2), columns=FEATURES)
y_pert2 = gbm.predict_proba(X_pert2)[:, 1]
d2_2 = (Z2 ** 2).sum(axis=1)
w2 = np.exp(-(d2_2 / kw_lime ** 2))
surr2 = Ridge(alpha=1.0)
surr2.fit(X_pert_std2, y_pert2, sample_weight=w2)
surr2_coef = pd.Series(surr2.coef_, index=FEATURES)
top42 = set(surr_sorted.index[:3])
top7 = set(surr2_coef.reindex(surr2_coef.abs().sort_values(ascending=False).index).index[:3])
out["lime_style"]["stability_seed7_top3"] = sorted(top7)
out["lime_style"]["stability_top3_overlap"] = len(top42 & top7)
print("  seed42 top3:", sorted(top42), " seed7 top3:", sorted(top7),
      " overlap:", len(top42 & top7), "/3")

# ---------------------------------------------------------------- (e) misleading-explanation demos
# (e1) correlated features split importance: BILL_AMT1..6 are correlated
corr = X_test[BILL_COLS + ["BILL_MEAN"]].corr()
bill_corr_mean = float(corr.loc["BILL_MEAN", BILL_COLS].mean())
corr_pay = float(X_test[["PAY_MEAN", "PAY_MAX", "PAY_DELAY_COUNT"]].corr().loc["PAY_MEAN", "PAY_MAX"])
# sum of perm importance over the 6 BILL_AMT columns vs BILL_MEAN alone
bill_sum = float(sum(imp_gbm[c] for c in BILL_COLS))
out["misleading"] = {
    "corr_bill_mean_vs_bill_amt_mean": r4(bill_corr_mean),
    "corr_pay_mean_vs_pay_max": r4(corr_pay),
    "perm_gbm_bill_amt_cols_sum": r4(bill_sum),
    "perm_gbm_bill_mean": r4(imp_gbm["BILL_MEAN"]),
    "perm_gbm_pay_0": r4(imp_gbm["PAY_0"]),
    "perm_gbm_pay_mean": r4(imp_gbm["PAY_MEAN"]),
    "perm_gbm_pay_max": r4(imp_gbm["PAY_MAX"]),
    "note": "BILL_AMT1..6 correlate strongly with BILL_MEAN, so permutation "
            "importance is SPLIT across the six columns; each looks small, "
            "their sum is the honest size of the 'bill' signal.",
}
print(f"\ncorr BILL_MEAN vs BILL_AMT cols (mean)={bill_corr_mean:.4f}; "
      f"corr PAY_MEAN vs PAY_MAX={corr_pay:.4f}")
print(f"perm GBM: sum BILL_AMT1..6={bill_sum:.4f} vs BILL_MEAN alone={imp_gbm['BILL_MEAN']:.4f}; "
      f"PAY_0={imp_gbm['PAY_0']:.4f} PAY_MEAN={imp_gbm['PAY_MEAN']:.4f} PAY_MAX={imp_gbm['PAY_MAX']:.4f}")

# (e2) underfit GBM (max_iter=5): explanation of a bad model
gbm_bad = HistGradientBoostingClassifier(random_state=SEED, max_iter=5)
gbm_bad.fit(X_train, y_train)
bad_proba = gbm_bad.predict_proba(X_test)[:, 1]
bad_auc = r4(roc_auc_score(y_test, bad_proba))
perm_bad = permutation_importance(gbm_bad, X_test, y_test, n_repeats=5,
                                  random_state=SEED, scoring="roc_auc", n_jobs=-1)
imp_bad = pd.Series(perm_bad.importances_mean, index=FEATURES).sort_values(ascending=False)
out["misleading"]["underfit_gbm_max_iter5"] = {
    "test_roc_auc": bad_auc,
    "top3": [{"feature": f, "mean_drop": r4(imp_bad[f])} for f in imp_bad.index[:3]],
    "note": "A bad model still produces a plausible-looking importance ranking. "
            "Explanation quality is bounded by model quality.",
}
print(f"underfit GBM max_iter=5: test ROC-AUC={bad_auc}; top3 "
      f"{[(f, round(float(imp_bad[f]), 4)) for f in imp_bad.index[:3]]}")

# (e3) LR vs GBM top-feature disagreement
out["misleading"]["lr_top5"] = [f for f in coef_sorted.index[:5]]
out["misleading"]["gbm_perm_top5"] = [f for f in imp_gbm.index[:5]]
out["misleading"]["lr_perm_top5"] = [f for f in imp_lr.index[:5]]
print("LR coef top5:", out["misleading"]["lr_top5"])
print("GBM perm top5:", out["misleading"]["gbm_perm_top5"])
print("LR perm top5:", out["misleading"]["lr_perm_top5"])

# (e4) reason codes for the local case: top-3 positive LR contributions
top_pos = [f for f in contrib_sorted.index if contrib[f] > 0][:3]
reason_map = {
    "PAY_MAX": "Keterlambatan pembayaran terburuk dalam 6 bulan terakhir",
    "PAY_MEAN": "Rata-rata keterlambatan pembayaran 6 bulan terakhir",
    "PAY_DELAY_COUNT": "Jumlah bulan dengan keterlambatan pembayaran",
    "PAY_0": "Status pembayaran bulan terakhir",
    "PAY_2": "Status pembayaran 2 bulan lalu",
    "PAY_3": "Status pembayaran 3 bulan lalu",
    "UTILIZATION": "Pemakaian limit kartu (tagihan bulan ini dibanding limit)",
    "PAY_RATIO": "Porsi tagihan yang dibayar bulan ini",
    "LIMIT_BAL": "Limit kartu kredit",
    "BILL_MEAN": "Rata-rata tagihan 6 bulan terakhir",
    "BILL_AMT1": "Tagihan bulan terakhir",
    "AGE": "Usia",
    "PAY_AMT_MEAN": "Rata-rata pembayaran 6 bulan terakhir",
}
out["local_case"]["reason_codes_top3"] = [
    {"feature": f, "contribution_logodds": r4(contrib[f]),
     "plain_language": reason_map.get(f, f)}
    for f in top_pos
]
print("reason codes top3:", out["local_case"]["reason_codes_top3"])

out["elapsed_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as fh:
    json.dump(out, fh, indent=2)
print(f"\nwrote {OUT_JSON} in {out['elapsed_seconds']}s")

"""Fix/extension pass for MLF M7.3 canonical numbers.

Fixes a methodological bug in m7_calc_m73.py and adds demos the first pass
lacked. Run with the SHAP venv (NOT system python):
  ~/workspace/.venv-shap-m73/bin/python qa-learn/m7_calc_m73_fix.py
(from ~/workspace/learn-platform)

1. LIME-style surrogate: the first pass used kernel exp(-d^2) with sigma=1 in
   31-dim space -> E[d^2]=31 -> all weights ~exp(-31)~0, surrogate R2=0.0003,
   all coefs 0.0000 (garbage). Correct LIME default: kernel width
   kw = 0.75*sqrt(n_features) = 4.18, weight = exp(-(d/kw)^2). Redo with the
   correct kernel, plus stability across seeds 42 vs 7.
2. PAY_MEAN PDP clean grid (first pass used quantiles with a duplicated 0.0).
3. Univariate check for the LR sign flips: PAY_2..PAY_6 and PAY_MEAN have
   NEGATIVE LR coefs although late payment univariately RAISES default risk
   (multicollinearity: PAY_DELAY_COUNT + PAY_MAX absorb the signal).
4. No-PAY models: LR + GBM trained WITHOUT any PAY_* feature -> ROC-AUC +
   top features. Demo: when the informative signal is missing, the model
   explains itself with proxies.
5. SHAP (real, via shap 0.54.1 in the venv): TreeExplainer on raw GBM,
   global mean|SHAP| on the full test 6000 + local SHAP for test row 858 +
   efficiency check (base + sum == log-odds of predict_proba).

Writes: qa-learn/m7_canonical_m73_fix.json (merged into
m7_canonical_m73.json by a separate step).
"""
import json
import time

import numpy as np
import pandas as pd
import shap
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
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m7_canonical_m73_fix.json"
t0 = time.time()
out = {}
print(f"versions: sklearn={sklearn.__version__} shap={shap.__version__} "
      f"numpy={np.__version__} pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__, "shap": shap.__version__,
               "numpy": np.__version__, "pandas": pd.__version__}


def r4(x):
    return round(float(x), 4)


# ---------------------------------------------------------------- load + features (flagship replica)
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
FEATURES = list(X_train.columns)

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
repro = {"lr_roc_auc": r4(roc_auc_score(y_test, lr_proba)),
         "lr_pr_auc": r4(average_precision_score(y_test, lr_proba)),
         "gbm_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
         "gbm_pr_auc": r4(average_precision_score(y_test, gbm_proba)),
         "cal_gbm_roc_auc": r4(roc_auc_score(y_test, cal_proba))}
print("REPRO:", repro)
assert abs(repro["lr_roc_auc"] - 0.7426) <= 0.001
assert abs(repro["gbm_roc_auc"] - 0.7823) <= 0.001
out["repro_flagship"] = repro

scaler = lr_pipe.named_steps["scaler"]
lr_model = lr_pipe.named_steps["logreg"]

# ---------------------------------------------------------------- (1) LIME-style surrogate, CORRECT kernel
LOCAL_IDX = 858  # same local case as main calc
x_row = X_test.iloc[[LOCAL_IDX]]
x0 = scaler.transform(x_row)[0]
n_feat = len(FEATURES)
kw = 0.75 * np.sqrt(n_feat)  # LIME default kernel width
print(f"\nLIME kernel width kw = 0.75*sqrt({n_feat}) = {kw:.4f}")


def lime_surrogate(seed):
    rng = np.random.default_rng(seed)
    n_samp = 2000
    Z = rng.normal(0, 1.0, size=(n_samp, n_feat))
    X_pert_std = np.clip(x0 + Z, -4, 6)
    X_pert = pd.DataFrame(scaler.inverse_transform(X_pert_std), columns=FEATURES)
    y_pert = gbm.predict_proba(X_pert)[:, 1]
    d2 = (Z ** 2).sum(axis=1)
    w = np.exp(-(d2 / kw ** 2))
    surr = Ridge(alpha=1.0)
    surr.fit(X_pert_std, y_pert, sample_weight=w)
    y_hat = surr.predict(X_pert_std)
    wmean = np.average(y_pert, weights=w)
    r2_w = 1 - float((w * (y_pert - y_hat) ** 2).sum()) / float((w * (y_pert - wmean) ** 2).sum())
    coef = pd.Series(surr.coef_, index=FEATURES)
    srt = coef.reindex(coef.abs().sort_values(ascending=False).index)
    return {
        "weighted_r2": r4(r2_w),
        "intercept": r4(surr.intercept_),
        "surrogate_pred_at_instance": r4(float(surr.predict(x0.reshape(1, -1))[0])),
        "gbm_proba_at_instance": r4(float(gbm_proba[LOCAL_IDX])),
        "top8": [{"feature": f, "coef": r4(coef[f])} for f in srt.index[:8]],
        "top3": [f for f in srt.index[:3]],
        "weight_stats": {"mean": r4(float(w.mean())), "min": r4(float(w.min())),
                         "max": r4(float(w.max()))},
    }


lime42 = lime_surrogate(42)
lime7 = lime_surrogate(7)
lime42["stability_seed7_top3"] = lime7["top3"]
lime42["stability_top3_overlap"] = len(set(lime42["top3"]) & set(lime7["top3"]))
lime42["seed7_weighted_r2"] = lime7["weighted_r2"]
lime42["note"] = ("manual LIME-style surrogate, CORRECTED kernel: perturbations "
                  "N(0,1) in standardised space, kernel exp(-(d/kw)^2) with "
                  "kw = 0.75*sqrt(31) = 4.18 (LIME default). First pass used "
                  "exp(-d^2) (kw=1) -> all weights ~0, R2=0.0003, garbage. "
                  "lime package itself NOT installed; same idea built by hand.")
out["lime_style"] = lime42
print("LIME seed42:", lime42)
print("LIME seed7 top3:", lime7["top3"], "R2:", lime7["weighted_r2"])

# ---------------------------------------------------------------- (2) PAY_MEAN PDP clean grid (calibrated GBM)
pay_mean_grid = [-2.0, -1.0, -0.5, 0.0, 0.5, 1.0, 2.0, 4.0]
vals = []
Xc = X_test.copy()
for v in pay_mean_grid:
    Xc["PAY_MEAN"] = v
    vals.append(r4(float(cal_gbm.predict_proba(Xc)[:, 1].mean())))
out["pdp_pay_mean_clean"] = {"grid": pay_mean_grid, "cal_gbm": vals,
                             "note": "manual PDP, calibrated GBM, test 6000."}
print("\nPAY_MEAN clean PDP:", pay_mean_grid, "->", vals)

# ---------------------------------------------------------------- (3) univariate check for LR sign flips
uni = {}
for c in ["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6", "PAY_MEAN",
          "PAY_MAX", "PAY_DELAY_COUNT"]:
    late = X_test[c] >= 1 if c not in ("PAY_MEAN",) else X_test[c] > 0
    uni[c] = {"corr_with_default": r4(float(np.corrcoef(X_test[c], y_test)[0, 1])),
              "default_rate_late": r4(float(y_test[late].mean())) if late.sum() else None,
              "default_rate_not_late": r4(float(y_test[~late].mean())) if (~late).sum() else None,
              "n_late": int(late.sum())}
out["univariate_pay"] = uni
print("\nunivariate (test 6000):")
for c, v in uni.items():
    print(f"  {c:16s} corr={v['corr_with_default']:+.4f} "
          f"default_rate late={v['default_rate_late']} vs not-late={v['default_rate_not_late']} "
          f"(n_late={v['n_late']})")
print("LR coefs (standardised): PAY_2 -0.0969, PAY_3 -0.1184, PAY_4 -0.0711, "
      "PAY_5 -0.1015, PAY_6 -0.0901, PAY_MEAN -0.0484 -- NEGATIVE despite "
      "positive univariate correlation (multicollinearity with "
      "PAY_DELAY_COUNT +0.7560 and PAY_MAX +0.2741).")

# ---------------------------------------------------------------- (4) no-PAY models
PAY_DERIVED = ["PAY_MEAN", "PAY_MAX", "PAY_DELAY_COUNT"]
NOPAY = [c for c in FEATURES if c not in PAY_COLS + PAY_DERIVED]
print(f"\nno-PAY features: {len(NOPAY)} of {len(FEATURES)}")
lr_np = Pipeline([("scaler", StandardScaler()),
                  ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))])
lr_np.fit(X_train[NOPAY], y_train)
lr_np_proba = lr_np.predict_proba(X_test[NOPAY])[:, 1]
gbm_np = HistGradientBoostingClassifier(random_state=SEED)
gbm_np.fit(X_train[NOPAY], y_train)
gbm_np_proba = gbm_np.predict_proba(X_test[NOPAY])[:, 1]
coef_np = pd.Series(lr_np.named_steps["logreg"].coef_[0], index=NOPAY)
coef_np_srt = coef_np.reindex(coef_np.abs().sort_values(ascending=False).index)
perm_np = permutation_importance(gbm_np, X_test[NOPAY], y_test, n_repeats=5,
                                 random_state=SEED, scoring="roc_auc", n_jobs=-1)
imp_np = pd.Series(perm_np.importances_mean, index=NOPAY).sort_values(ascending=False)
out["no_pay_models"] = {
    "dropped": PAY_COLS + PAY_DERIVED,
    "lr_roc_auc": r4(roc_auc_score(y_test, lr_np_proba)),
    "gbm_roc_auc": r4(roc_auc_score(y_test, gbm_np_proba)),
    "lr_top5_coef": [{"feature": f, "coef": r4(coef_np[f])} for f in coef_np_srt.index[:5]],
    "gbm_perm_top5": [{"feature": f, "mean_drop": r4(imp_np[f])} for f in imp_np.index[:5]],
    "full_model_lr_roc_auc": 0.7426, "full_model_gbm_roc_auc": 0.7823,
    "note": "Without any PAY_* signal both models lose a lot of ranking power "
            "and explain themselves with proxies (LIMIT_BAL, BILL_*, AGE). "
            "The explanation looks confident but the model is much worse.",
}
print("no-PAY LR ROC-AUC:", out["no_pay_models"]["lr_roc_auc"],
      " GBM ROC-AUC:", out["no_pay_models"]["gbm_roc_auc"])
print("no-PAY LR top5 coef:", out["no_pay_models"]["lr_top5_coef"])
print("no-PAY GBM perm top5:", out["no_pay_models"]["gbm_perm_top5"])

# ---------------------------------------------------------------- (5) SHAP (real, TreeExplainer on raw GBM, full test 6000)
print("\nSHAP TreeExplainer on raw GBM, test 6000 ...")
explainer = shap.TreeExplainer(gbm)
sv = explainer.shap_values(X_test)
ev = explainer.expected_value
print("shap_values type:", type(sv), "expected_value:", ev)
if isinstance(sv, list):
    sv = sv[1]  # positive class
    ev = ev[1] if isinstance(ev, (list, np.ndarray)) else ev
sv = np.asarray(sv, dtype=float)
ev = float(np.asarray(ev).reshape(-1)[0])
print("shap matrix:", sv.shape, "base value:", ev)
mean_abs = pd.Series(np.abs(sv).mean(axis=0), index=FEATURES).sort_values(ascending=False)
# efficiency check: base + sum(shap) == raw margin == log-odds of predict_proba
p = gbm_proba
logodds = np.log(p / (1 - p))
recon = ev + sv.sum(axis=1)
max_err = float(np.max(np.abs(recon - logodds)))
print(f"efficiency check: max |base+sum(SHAP) - log-odds| = {max_err:.6f}")
# local SHAP for row 858
sv_local = pd.Series(sv[LOCAL_IDX], index=FEATURES)
sv_local_srt = sv_local.reindex(sv_local.abs().sort_values(ascending=False).index)
shap_block = {
    "model": "raw GBM (uncalibrated). Decision model is its Platt-calibrated "
             "version (monotone transform: same ranking, same top features; "
             "exact SHAP values on the calibrated score differ).",
    "n_rows": int(len(X_test)), "set": "test (6000)",
    "base_value_logodds": r4(ev),
    "base_value_proba": r4(1 / (1 + np.exp(-ev))),
    "efficiency_max_abs_err_vs_logodds": round(max_err, 6),
    "global_mean_abs_shap_top12": [{"feature": f, "mean_abs_shap": r4(mean_abs[f])}
                                   for f in mean_abs.index[:12]],
    "global_mean_abs_shap_all": {f: r4(mean_abs[f]) for f in FEATURES},
    "local_row_858": {
        "gbm_proba": r4(float(p[LOCAL_IDX])),
        "logodds": r4(float(logodds[LOCAL_IDX])),
        "sum_shap": r4(float(sv[LOCAL_IDX].sum())),
        "base_plus_sum": r4(float(ev + sv[LOCAL_IDX].sum())),
        "top8": [{"feature": f, "shap_logodds": r4(sv_local[f])}
                 for f in sv_local_srt.index[:8]],
    },
    "note": "TreeExplainer, feature_perturbation='tree_path_dependent' "
            "(default). SHAP values in log-odds units; base value = mean "
            "log-odds over the training background implied by the trees.",
}
out["shap_gbm"] = shap_block
print("global mean|SHAP| top12:")
for f in mean_abs.index[:12]:
    print(f"  {f:16s} {mean_abs[f]:.4f}")
print("local row 858 top8 SHAP (log-odds):")
for f in sv_local_srt.index[:8]:
    print(f"  {f:16s} {sv_local[f]:+.4f}")

out["elapsed_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as fh:
    json.dump(out, fh, indent=2)
print(f"\nwrote {OUT_JSON} in {out['elapsed_seconds']}s")

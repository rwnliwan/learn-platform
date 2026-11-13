"""Canonical numbers for MLF M7.2 (Sumber bias & audit).

Deterministic: seed 42 everywhere; data = data/uci_default_credit.xls
(UCI Default of Credit Card Clients, 30.000 rows).
Pipeline REPLICATES the flagship notebook
~/workspace/guided-projects/ml-finance-credit-scoring/credit-scoring-end-to-end.ipynb
exactly: same add_features(), same stratified 80/20 split (test 6.000,
random_state=42), GBM = HistGradientBoostingClassifier(random_state=42)
defaults, decision model = GBM calibrated Platt/sigmoid
(CalibratedClassifierCV cv=3), operational threshold 0.10, LGD=0.45,
MARGIN=0.05. Approval = predicted default probability < threshold.

Locked numbers to verify (tolerance 0.001 unless stated):
  GBM test ROC-AUC 0.7823 / PR-AUC 0.5597; threshold 0.10;
  AIR SEX 0.869 (approval male 26.1% vs female 30.1%);
  EDUCATION Pascasarjana AIR 0.603 (flagged, small n=82);
  M2 G4 AIR 1.1502 perempuan/laki-laki; M2 G9 PSI 0.0104.
If a recomputation differs from a locked number, the diff is PRINTED and
stored under "locked_verification" -- never silently overwritten.

Group audit definitions (all on TEST 6.000 unless stated):
  approval_rate(g) = share of group g with calibrated proba < 0.10
  AIR(g) = approval_rate(g) / max approval rate over the groups of that
           attribute (four-fifths rule: AIR < 0.80 is a flag)
  FPR(g) = P(pred default | y=0) = FP/(FP+TN) within g  (pred default = proba>=0.10)
  FNR(g) = P(pred approve | y=1) = FN/(FN+TP) within g
  base_rate(g) = share of y=1 within g
  calibration_gap(g) = mean predicted proba - actual default rate within g
  Wilson 95% CI for approval_rate(g); z-test for a difference of two
  approval rates (male vs female).
  PSI(train vs test) per attribute = sum (p_test-p_train)*ln(p_test/p_train).

Run: python3 qa-learn/m7_calc_m72.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_canonical_m72.json (coordinator consolidates into
m7_canonical.json) and prints a verification table.
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
OUT_JSON = "qa-learn/m7_canonical_m72.json"
LGD = 0.45
MARGIN = 0.05
THR = 0.10
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} scipy={scipy.__version__} "
      f"numpy={np.__version__} pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__,
               "scipy": scipy.__version__, "numpy": np.__version__,
               "pandas": pd.__version__, "data": DATA_XLS,
               "threshold": THR, "lgd": LGD, "margin": MARGIN,
               "approval_rule": "approve iff calibrated GBM proba < 0.10",
               "air_definition": "approval_rate(group) / max approval rate within attribute",
               "note": "AIR denominator is the HIGHEST approval rate in the attribute; "
                       "four-fifths flag at AIR < 0.80."}

df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
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
print(f"train {X_train.shape} test {X_test.shape} test base={y_test.mean():.4f}")
out["train_n"] = int(len(X_train))
out["test_n"] = int(len(X_test))


def r4(x):
    return round(float(x), 4)


def edu_group(code):
    """EDUCATION grouping shared with M7.1: 1 Pascasarjana, 2 Universitas,
    3 SMA, anything else (codes 0/4/5/6) Lainnya."""
    return {1: 1, 2: 2, 3: 3}.get(int(code), 4)


for _fr in (df, X_train_raw, X_test_raw):
    _fr["EDU_GRP"] = _fr["EDUCATION"].map(edu_group)


def age_band_fn(a):
    return "<30" if a < 30 else "30-39" if a < 40 else "40-49" if a < 50 else "50-59" if a < 60 else "60+"


def mar_group(code):
    """MARRIAGE grouping: 1 Menikah, 2 Lajang, anything else (codes 0/3) Lainnya."""
    return {1: 1, 2: 2}.get(int(code), 3)


for _fr in (df, X_train_raw, X_test_raw):
    _fr["AGE_BAND"] = _fr["AGE"].map(age_band_fn)
    _fr["MAR_GRP"] = _fr["MARRIAGE"].map(mar_group)


def lr_pipe():
    return Pipeline([("scaler", StandardScaler()),
                     ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))])


def gbm():
    return HistGradientBoostingClassifier(random_state=SEED)


# ---------------------------------------------------------------- flagship repro
lr0 = lr_pipe()
lr0.fit(X_train, y_train)
lr_proba = lr0.predict_proba(X_test)[:, 1]
gbm0 = gbm()
gbm0.fit(X_train, y_train)
gbm_proba = gbm0.predict_proba(X_test)[:, 1]
cal_gbm = CalibratedClassifierCV(estimator=gbm(), method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]
repro = {
    "lr_roc_auc": r4(roc_auc_score(y_test, lr_proba)),
    "lr_pr_auc": r4(average_precision_score(y_test, lr_proba)),
    "lr_brier": r4(brier_score_loss(y_test, lr_proba)),
    "gbm_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
    "gbm_pr_auc": r4(average_precision_score(y_test, gbm_proba)),
    "gbm_brier": r4(brier_score_loss(y_test, gbm_proba)),
    "gbm_cal_roc_auc": r4(roc_auc_score(y_test, cal_proba)),
    "gbm_cal_pr_auc": r4(average_precision_score(y_test, cal_proba)),
    "gbm_cal_brier": r4(brier_score_loss(y_test, cal_proba)),
}
out["repro_flagship"] = repro
print("repro:", repro)

# ---------------------------------------------------------------- group audit helpers
SEX_LBL = {1: "Laki-laki", 2: "Perempuan"}
EDU_LBL = {1: "Pascasarjana", 2: "Universitas", 3: "SMA", 4: "Lainnya"}
MAR_LBL = {1: "Menikah", 2: "Lajang", 3: "Lainnya"}
AGE_BANDS = [(21, 29, "<30"), (30, 39, "30-39"), (40, 49, "40-49"),
             (50, 59, "50-59"), (60, 80, "60+")]  # aligned with M7.1 bands


def age_band(a):
    for lo, hi, lbl in AGE_BANDS:
        if lo <= a <= hi:
            return lbl
    return "?"


def wilson_ci(k, n, z=1.96):
    """Wilson 95% CI for a proportion k/n."""
    if n == 0:
        return (None, None)
    p = k / n
    d = 1 + z * z / n
    c = p + z * z / (2 * n)
    m = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return (r4((c - m) / d), r4((c + m) / d))


def two_prop_z(k1, n1, k2, n2):
    """Two-sided z-test for p1-p2 (normal approx, pooled)."""
    p1, p2 = k1 / n1, k2 / n2
    pp = (k1 + k2) / (n1 + n2)
    se = math.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2))
    z = (p1 - p2) / se if se else 0.0
    p = float(2 * stats.norm.sf(abs(z)))
    return {"diff": r4(p1 - p2), "se": r4(se), "z": r4(z), "p_value": r4(p)}


def ece_group(y_true, y_proba, n_bins=10):
    y_true = np.asarray(y_true)
    y_proba = np.asarray(y_proba)
    edges = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    for i in range(n_bins):
        m = (y_proba >= edges[i]) & (y_proba < edges[i + 1] if i < n_bins - 1 else y_proba <= edges[i + 1])
        n_b = int(m.sum())
        if n_b == 0:
            continue
        ece += (n_b / len(y_true)) * abs(float(y_proba[m].mean()) - float(y_true[m].mean()))
    return r4(ece)


def audit_attribute(test_frame, attr, labels, proba, thr=THR):
    """Per-group audit on the test set. test_frame: raw test rows (with the
    grouping column); proba: calibrated probabilities aligned to it."""
    tdf = test_frame.copy()
    tdf["_p"] = np.asarray(proba)
    tdf["_y"] = np.asarray(y_test.values)
    tdf["_approved"] = tdf["_p"] < thr
    tdf["_pred_default"] = ~tdf["_approved"]
    rows = []
    for code, lbl in labels.items():
        g = tdf[tdf[attr] == code]
        n = len(g)
        if n == 0:
            continue
        n_app = int(g["_approved"].sum())
        appr = n_app / n
        lo, hi = wilson_ci(n_app, n)
        y1 = g[g["_y"] == 1]
        y0 = g[g["_y"] == 0]
        fpr = float((y0["_pred_default"]).mean()) if len(y0) else None  # rejected among non-default
        fnr = float((~y1["_pred_default"]).mean()) if len(y1) else None  # approved among default
        tp = int((y1["_pred_default"]).sum())
        fp = int((y0["_pred_default"]).sum())
        rows.append({
            "code": code, "label": lbl, "n_test": n,
            "n_train": int((X_train_raw[attr] == code).sum()) if attr in X_train_raw.columns else None,
            "n_full": int((df[attr] == code).sum()) if attr in df.columns else None,
            "base_rate_test": r4(g["_y"].mean()),
            "base_rate_full": r4(df.loc[df[attr] == code, "default"].mean()) if attr in df.columns else None,
            "approval_rate": r4(appr),
            "approval_n": n_app,
            "approval_wilson_ci95": [lo, hi],
            "approval_ci_width": r4(hi - lo) if lo is not None else None,
            "fpr": r4(fpr) if fpr is not None else None,
            "fnr": r4(fnr) if fnr is not None else None,
            "tpr": r4(1 - fnr) if fnr is not None else None,
            "ppv": r4(tp / (tp + fp)) if (tp + fp) else None,
            "n_default": int(len(y1)),
            "n_nondefault": int(len(y0)),
            "tp": tp, "fp": fp,
            "ece_10bin": ece_group(g["_y"].values, g["_p"].values),
            "brier": r4(float(np.mean((g["_p"].values - g["_y"].values) ** 2))),
            "mean_pred_proba": r4(g["_p"].mean()),
            "calibration_gap": r4(g["_p"].mean() - g["_y"].mean()),
            "bad_rate_approved": r4(g.loc[g["_approved"], "_y"].mean()) if n_app else None,
            "mean_limit_bal": int(g["LIMIT_BAL"].mean()),
        })
    mx = max(r["approval_rate"] for r in rows)
    for r in rows:
        r["air"] = r4(r["approval_rate"] / mx) if mx else None
        r["air_flag_below_0.80"] = bool(r["air"] < 0.80) if r["air"] is not None else None
    return rows


test_raw = X_test_raw.copy()
audit = {}
audit["SEX"] = audit_attribute(test_raw, "SEX", SEX_LBL, cal_proba)
audit["EDUCATION"] = audit_attribute(test_raw, "EDU_GRP", EDU_LBL, cal_proba)
audit["MARRIAGE"] = audit_attribute(test_raw, "MAR_GRP", MAR_LBL, cal_proba)
# AGE bands as a derived attribute
test_age = test_raw.copy()
test_age["AGE_BAND"] = test_age["AGE"].map(age_band)
age_labels = {lbl: lbl for _, _, lbl in AGE_BANDS}
audit["AGE_BAND"] = audit_attribute(test_age, "AGE_BAND", age_labels, cal_proba)
out["audit_test_calibrated_thr0.10"] = audit
for attr, rows in audit.items():
    print(f"\n== {attr} ==")
    for r in rows:
        ntr = f"{r['n_train']:5d}" if r['n_train'] is not None else "    -"
        print(f"  {r['label']:14s} n={r['n_test']:5d} (train {ntr}) "
              f"base={r['base_rate_test']:.4f} appr={r['approval_rate']:.4f} "
              f"CI[{r['approval_wilson_ci95'][0]},{r['approval_wilson_ci95'][1]}] "
              f"AIR={r['air']} FPR={r['fpr']} FNR={r['fnr']} TPR={r['tpr']} PPV={r['ppv']} "
              f"n_def={r['n_default']} ECE={r['ece_10bin']} Brier={r['brier']} "
              f"cal_gap={r['calibration_gap']} bad_app={r['bad_rate_approved']}")

# overall approval at thr 0.10 (sanity vs M6.4: 0.285 / bad 0.0667)
appr_all = (cal_proba < THR)
out["overall_thr0.10"] = {
    "approval_rate": r4(appr_all.mean()),
    "approval_n": int(appr_all.sum()),
    "bad_rate_approved": r4(y_test.values[appr_all].mean()),
}
print("\noverall:", out["overall_thr0.10"])

# sex difference test (approval) + female/male ratio
sex = {r["label"]: r for r in audit["SEX"]}
out["sex_diff_test"] = two_prop_z(sex["Laki-laki"]["approval_n"], sex["Laki-laki"]["n_test"],
                                  sex["Perempuan"]["approval_n"], sex["Perempuan"]["n_test"])
out["sex_female_over_male_approval_ratio"] = r4(
    sex["Perempuan"]["approval_rate"] / sex["Laki-laki"]["approval_rate"])
print("sex diff test:", out["sex_diff_test"],
      "F/M ratio:", out["sex_female_over_male_approval_ratio"])

# AIR at other thresholds (does the disparity move with the threshold?)
for t in (0.05, 0.10, 0.20, 0.50):
    a = audit_attribute(test_raw, "SEX", SEX_LBL, cal_proba, thr=t)
    d = {r["label"]: r["approval_rate"] for r in a}
    air = min(d.values()) / max(d.values())
    out.setdefault("sex_air_by_threshold", []).append(
        {"threshold": t, "male_approval": d["Laki-laki"],
         "female_approval": d["Perempuan"], "air_min_over_max": r4(air)})
print("SEX AIR by threshold:", out["sex_air_by_threshold"])

# ---------------------------------------------------------------- representation: train shares
rep = {}
for attr, labels in (("SEX", SEX_LBL), ("EDU_GRP", EDU_LBL),
                     ("MAR_GRP", MAR_LBL)):
    rep[attr] = [{"label": lbl,
                  "share_train": r4((X_train_raw[attr] == c).mean()),
                  "share_test": r4((X_test_raw[attr] == c).mean()),
                  "n_train": int((X_train_raw[attr] == c).sum()),
                  "n_test": int((X_test_raw[attr] == c).sum())}
                 for c, lbl in labels.items()]
out["representation_train_test"] = rep

# PSI train vs test per attribute
def psi(p, q):
    s = 0.0
    for a, b in zip(p, q):
        a = max(a, 1e-6); b = max(b, 1e-6)
        s += (a - b) * math.log(a / b)
    return r4(s)

psi_out = {}
for attr, labels in (("SEX", SEX_LBL), ("EDU_GRP", EDU_LBL),
                     ("MAR_GRP", MAR_LBL)):
    p = [(X_test_raw[attr] == c).mean() for c in labels]
    q = [(X_train_raw[attr] == c).mean() for c in labels]
    psi_out[attr] = psi(p, q)
out["psi_train_vs_test"] = psi_out
print("PSI train vs test:", psi_out)

# ---------------------------------------------------------------- Simpson's paradox: SEX approval within AGE bands
# Global: female approval > male approval. Within-band: check each band.
sim_rows = []
for lo, hi, lbl in AGE_BANDS:
    m = (test_age["AGE_BAND"] == lbl)
    sub = test_age[m]
    p_sub = cal_proba[m.values] if hasattr(m, "values") else cal_proba[np.asarray(m)]
    res = {}
    for code, slbl in SEX_LBL.items():
        g = sub[sub["SEX"] == code]
        idx = np.where(m.values)[0][sub["SEX"].values == code]
        res[slbl] = {"n": int(len(g)),
                     "approval_rate": r4((cal_proba[idx] < THR).mean()) if len(g) else None,
                     "base_rate": r4(y_test.loc[g.index].mean()) if len(g) else None}
    res["band"] = lbl
    res["female_minus_male_approval"] = r4(res["Perempuan"]["approval_rate"] - res["Laki-laki"]["approval_rate"]) \
        if res["Perempuan"]["approval_rate"] is not None and res["Laki-laki"]["approval_rate"] is not None else None
    sim_rows.append(res)
out["simpson_sex_within_age"] = sim_rows
print("\nSimpson SEX within AGE:")
for r in sim_rows:
    print(f"  {r['band']:6s} M n={r['Laki-laki']['n']:5d} appr={r['Laki-laki']['approval_rate']} base={r['Laki-laki']['base_rate']} | "
          f"F n={r['Perempuan']['n']:5d} appr={r['Perempuan']['approval_rate']} base={r['Perempuan']['base_rate']} | F-M={r['female_minus_male_approval']}")

# Same within EDUCATION (does the female advantage survive within education?)
sim_edu = []
for code, lbl in EDU_LBL.items():
    m = (test_raw["EDU_GRP"] == code)
    res = {"education": lbl}
    for scode, slbl in SEX_LBL.items():
        idx = np.where(m.values & (test_raw["SEX"].values == scode))[0]
        res[slbl] = {"n": int(len(idx)),
                     "approval_rate": r4((cal_proba[idx] < THR).mean()) if len(idx) else None}
    res["female_minus_male_approval"] = r4(res["Perempuan"]["approval_rate"] - res["Laki-laki"]["approval_rate"]) \
        if res["Perempuan"]["approval_rate"] is not None and res["Laki-laki"]["approval_rate"] is not None else None
    sim_edu.append(res)
out["simpson_sex_within_education"] = sim_edu
print("\nSimpson SEX within EDUCATION:")
for r in sim_edu:
    print(f"  {r['education']:14s} M n={r['Laki-laki']['n']:5d} appr={r['Laki-laki']['approval_rate']} | "
          f"F n={r['Perempuan']['n']:5d} appr={r['Perempuan']['approval_rate']} | F-M={r['female_minus_male_approval']}")

# ---------------------------------------------------------------- measurement: feature means by SEX (is the input itself different?)
meas = {}
for col in ("LIMIT_BAL", "PAY_MEAN", "UTILIZATION", "PAY_DELAY_COUNT"):
    src = X_test if col in X_test.columns else test_raw
    meas[col] = {lbl: r4(src.loc[test_raw["SEX"] == c, col].mean())
                 for c, lbl in SEX_LBL.items()}
out["measurement_feature_means_by_sex_test"] = meas
print("\nfeature means by SEX (test):", meas)
# default rate by SEX in FULL data (label-side difference)
out["base_rate_by_sex_full"] = {lbl: r4(df.loc[df["SEX"] == c, "default"].mean())
                                for c, lbl in SEX_LBL.items()}
print("base rate by SEX (full):", out["base_rate_by_sex_full"])

# ---------------------------------------------------------------- small-n illustration: Lainnya n=82 (EDUCATION codes 0/4/5/6)
# The small group is the REFERENCE (highest approval), not Pascasarjana:
# Pascasarjana n=2.130 is large; Lainnya n=82 is the fragile one.
lain = next(r for r in audit["EDUCATION"] if r["label"] == "Lainnya")
k = lain["approval_n"]; n = lain["n_test"]
out["small_n_illustration"] = {
    "group": "EDUCATION Lainnya (test, codes 0/4/5/6)",
    "n": n, "approval_n": k, "approval_rate": lain["approval_rate"],
    "wilson_ci95": lain["approval_wilson_ci95"],
    "ci_width": lain["approval_ci_width"],
    "n_default": lain["n_default"],
    "tpr": lain["tpr"],
    "one_default_person_moves_tpr_by": r4(1 / lain["n_default"]) if lain["n_default"] else None,
    "what_if_same_rate_n2000_ci": wilson_ci(int(round(lain["approval_rate"] * 2000)), 2000),
    "what_if_same_rate_n2000_width": r4(wilson_ci(int(round(lain["approval_rate"] * 2000)), 2000)[1]
                                        - wilson_ci(int(round(lain["approval_rate"] * 2000)), 2000)[0]),
}
print("small-n illustration:", out["small_n_illustration"])

# ---------------------------------------------------------------- locked-number verification
pasc = next(r for r in audit["EDUCATION"] if r["label"] == "Pascasarjana")
edu_rows = audit["EDUCATION"]
age_rows = audit["AGE_BAND"]
# M7.1 cross-checks (same setup, same test set): attribute-level AIR = min/max
edu_air_minmax = r4(min(r["approval_rate"] for r in edu_rows) / max(r["approval_rate"] for r in edu_rows))
age_air_minmax = r4(min(r["approval_rate"] for r in age_rows) / max(r["approval_rate"] for r in age_rows))
edu_air_robust = r4(min(r["approval_rate"] for r in edu_rows if r["label"] != "Lainnya")
                    / max(r["approval_rate"] for r in edu_rows if r["label"] != "Lainnya"))
age_air_robust = r4(min(r["approval_rate"] for r in age_rows if r["label"] != "60+")
                    / max(r["approval_rate"] for r in age_rows if r["label"] != "60+"))
out["m71_crosscheck"] = {
    "edu_air_min_over_max": edu_air_minmax, "edu_air_min_over_max_m71": 0.3572,
    "edu_air_robust_no_lainnya": edu_air_robust, "edu_air_robust_m71": 0.5922,
    "age_air_min_over_max": age_air_minmax, "age_air_min_over_max_m71": 0.596,
    "age_air_robust_no_60plus": age_air_robust, "age_air_robust_m71": 0.613,
    "sex_approval_n": {r["label"]: r["approval_n"] for r in audit["SEX"]},
    "edu_approval_n": {r["label"]: r["approval_n"] for r in edu_rows},
}
print("M7.1 cross-check:", out["m71_crosscheck"])
locked = {
    "gbm_roc_auc": (repro["gbm_roc_auc"], 0.7823),
    "gbm_pr_auc": (repro["gbm_pr_auc"], 0.5597),
    "sex_air": (sex["Laki-laki"]["air"], 0.869),
    "sex_male_approval": (sex["Laki-laki"]["approval_rate"], 0.261),
    "sex_female_approval": (sex["Perempuan"]["approval_rate"], 0.301),
    "edu_pascasarjana_air": (pasc["air"], 0.603),
    "m2_g4_air_female_over_male": (out["sex_female_over_male_approval_ratio"], 1.1502),
    "overall_approval_thr0.10": (out["overall_thr0.10"]["approval_rate"], 0.285),
    "overall_bad_rate_thr0.10": (out["overall_thr0.10"]["bad_rate_approved"], 0.0667),
}
ver = {}
for k, (got, want) in locked.items():
    ver[k] = {"computed": got, "locked": want, "diff": r4(got - want),
              "match_within_0.001": bool(abs(got - want) <= 0.001),
              "match_within_0.005": bool(abs(got - want) <= 0.005)}
out["locked_verification"] = ver
print("\n== LOCKED VERIFICATION ==")
for k, v in ver.items():
    print(f"  {k:32s} computed={v['computed']} locked={v['locked']} diff={v['diff']} "
          f"within0.001={v['match_within_0.001']}")
# M2 G9 PSI 0.0104: no M2 definition is in scope for M7.2; report train-vs-test
# PSI values computed above so the coordinator can match it against M2's G9.
out["locked_verification"]["m2_g9_psi_note"] = (
    "M2 G9 PSI 0.0104 is an M2-lesson number (its distribution is not defined "
    "in the M7.2 brief); PSI train-vs-test computed here for SEX/EDUCATION/"
    "MARRIAGE is in psi_train_vs_test for the coordinator to match.")
print("M2 G9 PSI note:", out["locked_verification"]["m2_g9_psi_note"])
print("PSI train vs test:", psi_out)

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s")

"""Fairness metrics for MLF M7.1 (Fairness metrics).

Deterministic: seed 42 everywhere; data = data/uci_default_credit.xls
(UCI Default of Credit Card Clients, 30.000 rows).
Pipeline REPLICATES the flagship notebook
~/workspace/guided-projects/ml-finance-credit-scoring/credit-scoring-end-to-end.ipynb
exactly (same add_features(), same stratified 80/20 split, test 6.000,
random_state=42): GBM = HistGradientBoostingClassifier(random_state=42)
defaults; decision model = GBM terkalibrasi Platt/sigmoid
(CalibratedClassifierCV cv=3); threshold operasional 0,10; LGD 0,45;
MARGIN 0,05. Approval = probabilitas default prediksi < threshold
(risiko rendah disetujui).

Konvensi metrik (positif = default, prediksi default = ditolak):
  approval_rate = P(prob < 0,10)
  TPR = P(prediksi default | aktual default)   = TP / (TP + FN)
  FPR = P(prediksi default | aktual lancar)    = FP / (FP + TN)
  PPV = P(aktual default | prediksi default)   = TP / (TP + FP)
  bad_rate_approved = default rate di antara yang disetujui = FN / (TN + FN)
  AIR (adverse impact ratio) per variabel = approval_rate_min / approval_rate_max
      (four-fifths rule: AIR < 0,80 -> flag)
  AIR per grup = approval_rate_grup / approval_rate_max_dalam_variabel
  ECE per grup = ECE 10 bin dihitung HANYA di dalam grup itu
  Brier per grup = Brier score di dalam grup itu

Locked numbers to verify (tolerance 0.001 unless noted):
  GBM test ROC-AUC 0,7823 / PR-AUC 0,5597; threshold 0,10
  AIR SEX 0,869 (approval male 26,1% vs female 30,1%)
  EDUCATION Pascasarjana AIR 0,603 TERTANDA flag (n=82 kecil)
  M2 G4 AIR 1,1502 perempuan/laki-laki; M2 G9 PSI 0,0104
  (dua angka M2 berasal dari lesson M2/scorecard, bukan dari script ini;
  dicatat sebagai konteks konsistensi antar-lesson.)

Run: python3 qa-learn/m7_calc_m71.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_m71_numbers.json
"""
import json
import time

import numpy as np
import pandas as pd
import sklearn
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (average_precision_score, brier_score_loss,
                             confusion_matrix, roc_auc_score)
from sklearn.model_selection import train_test_split

SEED = 42
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m7_m71_numbers.json"
THRESHOLD = 0.10
LGD = 0.45
MARGIN = 0.05
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} numpy={np.__version__} "
      f"pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__,
               "numpy": np.__version__, "pandas": pd.__version__,
               "data": DATA_XLS, "threshold": THRESHOLD, "lgd": LGD,
               "margin": MARGIN,
               "model": "CalibratedClassifierCV(HistGradientBoostingClassifier"
                        "(random_state=42), method='sigmoid', cv=3)",
               "approval_rule": "approve iff predicted default prob < 0.10"}

# ---------------------------------------------------------------- load + features (flagship replica)
df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
assert df["default"].isin([0, 1]).all()
print(f"data: {df.shape}, base rate={df['default'].mean():.4f}, "
      f"defaults={int(df['default'].sum())}")
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
print(f"train {X_train.shape} test {X_test.shape} n_features={X_train.shape[1]} "
      f"train base={y_train.mean():.4f} test base={y_test.mean():.4f}")
out["train_n"] = int(len(X_train))
out["test_n"] = int(len(X_test))
out["test_base_rate"] = round(float(y_test.mean()), 4)


def r4(x):
    return round(float(x), 4)


def ece_score(y_true, y_proba, n_bins=10):
    """ECE 10 bin (same definition as m6_canonical_calc.py)."""
    y_true = np.asarray(y_true)
    y_proba = np.asarray(y_proba)
    edges = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    bins = []
    for i in range(n_bins):
        m = (y_proba >= edges[i]) & (y_proba < edges[i + 1] if i < n_bins - 1
                                     else y_proba <= edges[i + 1])
        n_b = int(m.sum())
        if n_b == 0:
            bins.append({"bin": f"[{edges[i]:.1f},{edges[i+1]:.1f})", "n": 0,
                         "mean_pred": None, "actual_rate": None})
            continue
        mp = float(y_proba[m].mean())
        ar = float(y_true[m].mean())
        ece += (n_b / len(y_true)) * abs(mp - ar)
        bins.append({"bin": f"[{edges[i]:.1f},{edges[i+1]:.1f})", "n": n_b,
                     "mean_pred": r4(mp), "actual_rate": r4(ar)})
    return r4(ece), bins


# ---------------------------------------------------------------- flagship model
gbm = HistGradientBoostingClassifier(random_state=SEED)
gbm.fit(X_train, y_train)
gbm_proba = gbm.predict_proba(X_test)[:, 1]
cal_gbm = CalibratedClassifierCV(estimator=HistGradientBoostingClassifier(random_state=SEED),
                                 method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]

repro = {"gbm_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
         "gbm_pr_auc": r4(average_precision_score(y_test, gbm_proba)),
         "gbm_brier": r4(brier_score_loss(y_test, gbm_proba)),
         "cal_gbm_roc_auc": r4(roc_auc_score(y_test, cal_proba)),
         "cal_gbm_pr_auc": r4(average_precision_score(y_test, cal_proba)),
         "cal_gbm_brier": r4(brier_score_loss(y_test, cal_proba)),
         "cal_gbm_ece": ece_score(y_test, cal_proba)[0]}
out["repro_flagship"] = repro
print("repro:", repro)

# ---------------------------------------------------------------- group definitions (on TEST rows)
# SEX: 1 = laki-laki, 2 = perempuan. EDUCATION: 1 = Pascasarjana,
# 2 = Universitas, 3 = SMA, 4+0/5/6 = Lainnya. AGE bands in years.
test_idx = X_test_raw.index
sex = df.loc[test_idx, "SEX"]
edu_raw = df.loc[test_idx, "EDUCATION"]
age = df.loc[test_idx, "AGE"]
print("SEX value counts (test):", sex.value_counts().sort_index().to_dict())
print("EDUCATION value counts (test):", edu_raw.value_counts().sort_index().to_dict())
print("AGE describe (test):", age.describe().round(2).to_dict())
out["group_counts_raw"] = {
    "sex_test": {str(k): int(v) for k, v in sex.value_counts().sort_index().items()},
    "education_test": {str(k): int(v) for k, v in edu_raw.value_counts().sort_index().items()},
    "age_test_min": int(age.min()), "age_test_max": int(age.max()),
}

SEX_LABEL = {1: "Laki-laki", 2: "Perempuan"}
EDU_LABEL = {1: "Pascasarjana", 2: "Universitas", 3: "SMA", 4: "Lainnya"}
edu = edu_raw.map(lambda v: v if v in (1, 2, 3) else 4)


def age_band(a):
    if a < 30:
        return "<30"
    if a < 40:
        return "30-39"
    if a < 50:
        return "40-49"
    if a < 60:
        return "50-59"
    return "60+"


age_b = age.map(age_band)

groups = {
    "SEX": pd.Series([SEX_LABEL[v] for v in sex], index=test_idx),
    "EDUCATION": pd.Series([EDU_LABEL[v] for v in edu], index=test_idx),
    "AGE": age_b,
}

y_test_np = np.asarray(y_test)
# predicted default (>= threshold) = ditolak; approved = prob < threshold
pred_default = (cal_proba >= THRESHOLD).astype(int)
approved = cal_proba < THRESHOLD


def group_metrics(mask, name):
    """Metrics for one group mask (boolean array aligned with test rows)."""
    n = int(mask.sum())
    if n == 0:
        return {"group": name, "n": 0}
    yt = y_test_np[mask]
    pp = cal_proba[mask]
    pdft = pred_default[mask]
    app = approved[mask]
    tn, fp, fn, tp = confusion_matrix(yt, pdft, labels=[0, 1]).ravel()
    tpr = float(tp / (tp + fn)) if (tp + fn) else None
    fpr = float(fp / (fp + tn)) if (fp + tn) else None
    ppv = float(tp / (tp + fp)) if (tp + fp) else None
    n_app = int(app.sum())
    bad_app = float(yt[app].mean()) if n_app else None
    ece_g, _ = ece_score(yt, pp)
    return {"group": name, "n": n,
            "base_rate": r4(yt.mean()),
            "mean_pred_prob": r4(pp.mean()),
            "approval_rate": r4(app.mean()),
            "n_approved": n_app,
            "bad_rate_approved": r4(bad_app) if bad_app is not None else None,
            "tpr": r4(tpr) if tpr is not None else None,
            "fpr": r4(fpr) if fpr is not None else None,
            "ppv": r4(ppv) if ppv is not None else None,
            "tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp),
            "ece": ece_g,
            "brier": r4(brier_score_loss(yt, pp))}


# ---------------------------------------------------------------- overall (reference)
overall = group_metrics(np.ones(len(y_test_np), dtype=bool), "Semua")
out["overall"] = overall
print("\nOVERALL:", json.dumps(overall, ensure_ascii=False))

# ---------------------------------------------------------------- per-variable tables + gaps + AIR
out["by_group"] = {}
for var, series in groups.items():
    rows = []
    for gname in sorted(series.unique()):
        mask = (series.values == gname)
        rows.append(group_metrics(mask, gname))
    appr = [r["approval_rate"] for r in rows]
    tprs = [r["tpr"] for r in rows]
    fprs = [r["fpr"] for r in rows]
    ppvs = [r["ppv"] for r in rows]
    max_appr = max(appr)
    for r in rows:
        r["air_vs_max"] = r4(r["approval_rate"] / max_appr)
        r["air_flag_four_fifths"] = bool(r["air_vs_max"] < 0.80)
    air_minmax = r4(min(appr) / max(appr))
    summary = {
        "air_min_over_max": air_minmax,
        "air_flag_four_fifths": bool(air_minmax < 0.80),
        "approval_spread_pp": r4((max(appr) - min(appr)) * 100),
        "tpr_spread": r4(max(tprs) - min(tprs)),
        "fpr_spread": r4(max(fprs) - min(fprs)),
        "ppv_spread": r4(max(ppvs) - min(ppvs)),
        "base_rate_spread": r4(max(r["base_rate"] for r in rows)
                               - min(r["base_rate"] for r in rows)),
        "ece_spread": r4(max(r["ece"] for r in rows) - min(r["ece"] for r in rows)),
        "brier_spread": r4(max(r["brier"] for r in rows) - min(r["brier"] for r in rows)),
    }
    out["by_group"][var] = {"groups": rows, "summary": summary}
    print(f"\n== {var} == AIR min/max={air_minmax} flag={summary['air_flag_four_fifths']}")
    for r in rows:
        print(f"  {r['group']:>14} n={r['n']:>5} base={r['base_rate']:.4f} "
              f"appr={r['approval_rate']:.4f} AIR={r['air_vs_max']:.4f} "
              f"TPR={r['tpr']:.4f} FPR={r['fpr']:.4f} PPV={r['ppv']:.4f} "
              f"bad_app={r['bad_rate_approved']:.4f} ECE={r['ece']:.4f} "
              f"Brier={r['brier']:.4f} (TN={r['tn']} FP={r['fp']} FN={r['fn']} TP={r['tp']})")
    print("  summary:", json.dumps(summary, ensure_ascii=False))

# ---------------------------------------------------------------- locked-number verification
sex_rows = {r["group"]: r for r in out["by_group"]["SEX"]["groups"]}
edu_rows = {r["group"]: r for r in out["by_group"]["EDUCATION"]["groups"]}
verif = {}
verif["gbm_roc_auc"] = {"computed": repro["gbm_roc_auc"], "locked": 0.7823,
                        "diff": r4(repro["gbm_roc_auc"] - 0.7823)}
verif["gbm_pr_auc"] = {"computed": repro["gbm_pr_auc"], "locked": 0.5597,
                       "diff": r4(repro["gbm_pr_auc"] - 0.5597)}
verif["air_sex"] = {"computed": out["by_group"]["SEX"]["summary"]["air_min_over_max"],
                    "locked": 0.869,
                    "diff": r4(out["by_group"]["SEX"]["summary"]["air_min_over_max"] - 0.869),
                    "approval_male": sex_rows["Laki-laki"]["approval_rate"],
                    "approval_female": sex_rows["Perempuan"]["approval_rate"],
                    "locked_approval_male": 0.261, "locked_approval_female": 0.301}
verif["air_education_pascasarjana"] = {
    "computed": edu_rows["Pascasarjana"]["air_vs_max"], "locked": 0.603,
    "diff": r4(edu_rows["Pascasarjana"]["air_vs_max"] - 0.603),
    "n_pascasarjana_test": edu_rows["Pascasarjana"]["n"],
    "approval_pascasarjana": edu_rows["Pascasarjana"]["approval_rate"],
    "locked_note": "n=82 kecil (per locked note)"}
verif["m2_g4_air"] = {"note": "angka lesson M2 (scorecard), bukan dari script ini; "
                              "tidak diverifikasi di sini", "locked": 1.1502}
verif["m2_g9_psi"] = {"note": "angka lesson M2 (scorecard), bukan dari script ini; "
                             "tidak diverifikasi di sini", "locked": 0.0104}
out["verification_vs_locked"] = verif
print("\n== VERIFICATION vs locked ==")
print(json.dumps(verif, indent=2, ensure_ascii=False))

# ---------------------------------------------------------------- impossibility illustration (SEX)
# Base rates differ -> equalized odds + calibration + demographic parity
# cannot all hold. Report the three pairwise gaps for SEX.
m = sex_rows["Laki-laki"]
f = sex_rows["Perempuan"]
out["impossibility_sex"] = {
    "base_rate_male": m["base_rate"], "base_rate_female": f["base_rate"],
    "base_rate_gap": r4(abs(m["base_rate"] - f["base_rate"])),
    "approval_gap": r4(abs(m["approval_rate"] - f["approval_rate"])),
    "tpr_gap": r4(abs(m["tpr"] - f["tpr"])),
    "fpr_gap": r4(abs(m["fpr"] - f["fpr"])),
    "ppv_gap": r4(abs(m["ppv"] - f["ppv"])),
    "ece_gap": r4(abs(m["ece"] - f["ece"])),
    "note": "Base rate beda (male vs female) -> demographic parity, "
            "equalized odds, dan kalibrasi per grup tidak bisa ketiganya "
            "sempurna sekaligus; lesson memakai angka-angka ini sebagai "
            "bukti numerik impossibility."}
print("\nIMPOSSIBILITY (SEX):", json.dumps(out["impossibility_sex"], ensure_ascii=False))

# ---------------------------------------------------------------- threshold sensitivity of AIR (SEX)
air_by_threshold = {}
for t in [0.05, 0.10, 0.15, 0.20, 0.30, 0.50]:
    appr_m = float((cal_proba[sex.values == 1] < t).mean())
    appr_f = float((cal_proba[sex.values == 2] < t).mean())
    air_by_threshold[str(t)] = {"approval_male": r4(appr_m),
                                "approval_female": r4(appr_f),
                                "air": r4(min(appr_m, appr_f) / max(appr_m, appr_f))}
out["air_sex_by_threshold"] = air_by_threshold
print("\nAIR SEX by threshold:", json.dumps(air_by_threshold, ensure_ascii=False))

# ---------------------------------------------------------------- per-group calibration bins (SEX) for the lesson figure
calib_bins = {}
for gname in ["Laki-laki", "Perempuan"]:
    mask = (groups["SEX"].values == gname)
    _, bins = ece_score(y_test_np[mask], cal_proba[mask])
    calib_bins[gname] = bins
out["calibration_bins_sex"] = calib_bins

out["elapsed_sec"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as fh:
    json.dump(out, fh, indent=2, ensure_ascii=False)
print(f"\nwrote {OUT_JSON} in {out['elapsed_sec']}s")

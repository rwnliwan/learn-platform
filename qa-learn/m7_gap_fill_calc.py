"""Canonical numbers for MLF M7 gap fill (G2, G3, G8) — Luna fill round.

Pipeline REPLICATES qa-learn/m7_calc_m72.py exactly: same data
data/uci_default_credit.xls (header=1, rename "default payment next month"
-> "default", 30.000 rows), same add_features(), same stratified 80/20
split random_state=42 (test 6.000), GBM = HistGradientBoostingClassifier
(random_state=42) defaults, decision model = GBM calibrated Platt/sigmoid
(CalibratedClassifierCV cv=3), threshold 0.10, LGD 0.45, MARGIN 0.05.
Approval = calibrated proba < 0.10.

SANITY CHECK (locked, tolerance 0.001): GBM test ROC-AUC must be 0.7823,
AIR SEX 0.8693 (approval male 0.2614 vs female 0.3007). If any locked number
misses by >0.001 the script STOPS (exit 1) and writes NO json.

Groups computed (all on TEST 6.000, seed 42, unless stated):
  G2  intersectional audit: SEX x EDUCATION (EDU_GRP as in M7.2:
      1 Pascasarjana, 2 Universitas, 3 SMA, 4 Lainnya [codes 0/4/5/6])
      and SEX x AGE (bands <30, 30-39, 40-49, 50-59, 60+ as in M7.2).
      AIR for an intersection cell = cell approval / HIGHEST approval
      among ALL cells of the SAME table (not the global max of the
      attribute). Small cells flagged: n<100 "terlalu kecil untuk vonis",
      n<30 "jangan vonis".
  G3  bootstrap CI (1.000 replicates, seed 42) for fairness gaps by SEX.
      Method: resample the WHOLE test set with replacement (n=6.000 per
      replicate), then compute per-group metrics on the resample.
      A replicate is skipped only if a SEX group ends up empty or a
      metric is undefined (e.g. no predicted defaults -> PPV undefined);
      skipped count is recorded. 95% percentile CI (2.5%-97.5%).
  G8  data quality on the FULL data (30.000 rows): missingness per main
      feature overall + per SEX + per EDUCATION group; invalid categories
      (EDUCATION codes 0/5/6, MARRIAGE code 0); odd values (negative
      BILL_AMT / PAY_AMT, LIMIT_BAL <= 0, AGE outside 21-79); full-row
      duplicates (overall only). One-line interpretation per finding.

Run: python3 qa-learn/m7_gap_fill_calc.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_gap_fill_numbers.json and prints a verification table.
"""
import json
import math
import time

import numpy as np
import pandas as pd
import sklearn
import scipy
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (brier_score_loss, roc_auc_score)
from sklearn.model_selection import train_test_split

SEED = 42
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m7_gap_fill_numbers.json"
LGD = 0.45
MARGIN = 0.05
THR = 0.10
N_BOOT = 1000
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} scipy={scipy.__version__} "
      f"numpy={np.__version__} pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__,
               "scipy": scipy.__version__, "numpy": np.__version__,
               "pandas": pd.__version__, "data": DATA_XLS,
               "threshold": THR, "lgd": LGD, "margin": MARGIN,
               "approval_rule": "approve iff calibrated GBM proba < 0.10",
               "bootstrap_method": "resample whole test set (n=6000) with "
               "replacement, 1000 replicates, seed 42; per-group metrics "
               "computed on each resample; replicate skipped only if a SEX "
               "group is empty or a metric is undefined",
               "air_intersection_definition": "cell approval / highest "
               "approval among ALL cells of the same intersection table",
               "data_quality_scope": "full data (30,000 rows) unless stated",
               "note": "All numbers computed from the data above; nothing "
               "invented. Rounded to 4 decimals except counts (integers)."}

df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape

PAY_COLS = ["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6"]
BILL_COLS = ["BILL_AMT1", "BILL_AMT2", "BILL_AMT3", "BILL_AMT4", "BILL_AMT5", "BILL_AMT6"]
PAY_AMT_COLS = ["PAY_AMT1", "PAY_AMT2", "PAY_AMT3", "PAY_AMT4", "PAY_AMT5", "PAY_AMT6"]
MAIN_FEATURES = (["LIMIT_BAL"] + PAY_COLS + BILL_COLS + PAY_AMT_COLS)


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


def r4(x):
    return round(float(x), 4)


def edu_group(code):
    """EDUCATION grouping shared with M7.1/M7.2: 1 Pascasarjana, 2 Universitas,
    3 SMA, anything else (codes 0/4/5/6) Lainnya."""
    return {1: 1, 2: 2, 3: 3}.get(int(code), 4)


for _fr in (df, X_train_raw, X_test_raw):
    _fr["EDU_GRP"] = _fr["EDUCATION"].map(edu_group)


def age_band_fn(a):
    return "<30" if a < 30 else "30-39" if a < 40 else "40-49" if a < 50 else "50-59" if a < 60 else "60+"


for _fr in (df, X_train_raw, X_test_raw):
    _fr["AGE_BAND"] = _fr["AGE"].map(age_band_fn)


def gbm():
    return HistGradientBoostingClassifier(random_state=SEED)


# ---------------------------------------------------------------- flagship repro
gbm0 = gbm()
gbm0.fit(X_train, y_train)
gbm_proba = gbm0.predict_proba(X_test)[:, 1]
cal_gbm = CalibratedClassifierCV(estimator=gbm(), method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]
gbm_roc = r4(roc_auc_score(y_test, gbm_proba))
print(f"GBM test ROC-AUC = {gbm_roc} (locked 0.7823)")
out["repro_flagship"] = {
    "gbm_roc_auc": gbm_roc,
    "gbm_brier": r4(brier_score_loss(y_test, gbm_proba)),
    "gbm_cal_roc_auc": r4(roc_auc_score(y_test, cal_proba)),
    "gbm_cal_brier": r4(brier_score_loss(y_test, cal_proba)),
}


def wilson_ci(k, n, z=1.96):
    """Wilson 95% CI for a proportion k/n."""
    if n == 0:
        return (None, None)
    p = k / n
    d = 1 + z * z / n
    c = p + z * z / (2 * n)
    m = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return (r4((c - m) / d), r4((c + m) / d))


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


def group_metrics(y_g, p_g, thr=THR):
    """Audit metrics for one group (arrays). Returns dict or None if the
    group is empty."""
    n = len(y_g)
    if n == 0:
        return None
    approved = p_g < thr
    pred_def = ~approved
    n_app = int(approved.sum())
    appr = n_app / n
    y1 = y_g == 1
    y0 = y_g == 0
    tp = int((pred_def & y1).sum())
    fp = int((pred_def & y0).sum())
    fn = int((approved & y1).sum())
    tn = int((approved & y0).sum())
    fpr = fp / (fp + tn) if (fp + tn) else None
    fnr = fn / (fn + tp) if (fn + tp) else None
    tpr = tp / (tp + fn) if (tp + fn) else None
    ppv = tp / (tp + fp) if (tp + fp) else None
    lo, hi = wilson_ci(n_app, n)
    return {"n": n, "approval_rate": r4(appr), "approval_n": n_app,
            "approval_wilson_ci95": [lo, hi],
            "base_rate": r4(float(y_g.mean())),
            "fpr": r4(fpr) if fpr is not None else None,
            "fnr": r4(fnr) if fnr is not None else None,
            "tpr": r4(tpr) if tpr is not None else None,
            "ppv": r4(ppv) if ppv is not None else None,
            "ece_10bin": ece_group(y_g, p_g),
            "brier": r4(float(np.mean((p_g - y_g) ** 2))),
            "n_default": int(y1.sum()), "n_nondefault": int(y0.sum()),
            "tp": tp, "fp": fp, "fn": fn, "tn": tn}


SEX_LBL = {1: "Laki-laki", 2: "Perempuan"}
EDU_LBL = {1: "Pascasarjana", 2: "Universitas", 3: "SMA", 4: "Lainnya"}
AGE_BANDS = ["<30", "30-39", "40-49", "50-59", "60+"]

y_test_arr = y_test.values
test_raw = X_test_raw.copy()

# ---------------------------------------------------------------- sanity: SEX AIR
sex_metrics = {}
for code, lbl in SEX_LBL.items():
    m = (test_raw["SEX"].values == code)
    sex_metrics[lbl] = group_metrics(y_test_arr[m], cal_proba[m])
sex_air = r4(sex_metrics["Laki-laki"]["approval_rate"]
             / sex_metrics["Perempuan"]["approval_rate"])
print(f"SEX approval: M={sex_metrics['Laki-laki']['approval_rate']} "
      f"F={sex_metrics['Perempuan']['approval_rate']} AIR={sex_air} "
      f"(locked 0.8693 / 0.2614 / 0.3007)")
locked = {
    "gbm_roc_auc": (gbm_roc, 0.7823),
    "sex_air": (sex_air, 0.8693),
    "sex_male_approval": (sex_metrics["Laki-laki"]["approval_rate"], 0.2614),
    "sex_female_approval": (sex_metrics["Perempuan"]["approval_rate"], 0.3007),
}
ver = {}
ok = True
for k, (got, want) in locked.items():
    match = bool(abs(got - want) <= 0.001)
    ok = ok and match
    ver[k] = {"computed": got, "locked": want, "diff": r4(got - want),
              "match_within_0.001": match}
out["locked_verification"] = ver
print("\n== LOCKED VERIFICATION (sanity) ==")
for k, v in ver.items():
    print(f"  {k:22s} computed={v['computed']} locked={v['locked']} "
          f"diff={v['diff']} within0.001={v['match_within_0.001']}")
if not ok:
    print("SANITY CHECK FAILED (>0.001 off a locked number) -- STOPPING, "
          "no JSON written.")
    raise SystemExit(1)
print("Sanity check PASSED -- proceeding to G2/G3/G8.")

# ================================================================ (A) G2 intersection
def intersection_table(first_attr, first_labels, second_attr, second_labels,
                       first_name, second_name):
    """first_attr x second_attr cells on the test set. AIR denominator =
    highest approval among ALL cells of this table."""
    cells = []
    for c1, l1 in first_labels.items():
        for c2, l2 in second_labels.items():
            m = ((test_raw[first_attr].values == c1)
                 & (test_raw[second_attr].values == c2))
            gm = group_metrics(y_test_arr[m], cal_proba[m])
            if gm is None:
                continue
            n = gm["n"]
            if n < 30:
                flag = "n<30: jangan vonis"
            elif n < 100:
                flag = "n<100: terlalu kecil untuk vonis"
            else:
                flag = None
            cells.append({first_name: l1, second_name: l2, **gm,
                          "small_cell_flag": flag})
    mx = max(c["approval_rate"] for c in cells)
    for c in cells:
        c["air"] = r4(c["approval_rate"] / mx) if mx else None
        c["air_flag_below_0.80"] = bool(c["air"] < 0.80) if c["air"] is not None else None
    lo_cell = min(cells, key=lambda c: c["approval_rate"])
    hi_cell = max(cells, key=lambda c: c["approval_rate"])
    return {
        "max_approval_rate": mx,
        "max_approval_cell": {first_name: hi_cell[first_name],
                              second_name: hi_cell[second_name],
                              "n": hi_cell["n"],
                              "approval_rate": hi_cell["approval_rate"]},
        "min_approval_rate": lo_cell["approval_rate"],
        "min_approval_cell": {first_name: lo_cell[first_name],
                              second_name: lo_cell[second_name],
                              "n": lo_cell["n"],
                              "approval_rate": lo_cell["approval_rate"]},
        "min_air": r4(lo_cell["approval_rate"] / mx),
        "cells": cells,
        "summary": {
            "lowest_approval": f"{lo_cell[first_name]} x {lo_cell[second_name]} "
                               f"(n={lo_cell['n']}, approval={lo_cell['approval_rate']}, "
                               f"AIR={r4(lo_cell['approval_rate'] / mx)})",
            "highest_approval": f"{hi_cell[first_name]} x {hi_cell[second_name]} "
                                f"(n={hi_cell['n']}, approval={hi_cell['approval_rate']})",
            "global_sex_air": sex_air,
            "intersection_min_air_vs_global_sex_air": r4(
                lo_cell["approval_rate"] / mx - sex_air),
            "global_sex_gap_hides_worse_intersection": bool(
                lo_cell["approval_rate"] / mx < sex_air),
        },
    }


g2_edu = intersection_table("SEX", SEX_LBL, "EDU_GRP", EDU_LBL,
                            "sex", "education")
g2_age = intersection_table("SEX", SEX_LBL, "AGE_BAND",
                            {b: b for b in AGE_BANDS}, "sex", "age_band")
out["m7g2_intersection_sex_edu"] = g2_edu
out["m7g2_intersection_sex_age"] = g2_age

print("\n== G2 SEX x EDUCATION ==")
for c in g2_edu["cells"]:
    print(f"  {c['sex']:10s} x {c['education']:13s} n={c['n']:5d} "
          f"appr={c['approval_rate']:.4f} CI{c['approval_wilson_ci95']} "
          f"AIR={c['air']} base={c['base_rate']:.4f} FPR={c['fpr']} "
          f"TPR={c['tpr']} FNR={c['fnr']} PPV={c['ppv']} "
          f"{c['small_cell_flag'] or ''}")
print("  summary:", g2_edu["summary"])
print("\n== G2 SEX x AGE ==")
for c in g2_age["cells"]:
    print(f"  {c['sex']:10s} x {c['age_band']:6s} n={c['n']:5d} "
          f"appr={c['approval_rate']:.4f} CI{c['approval_wilson_ci95']} "
          f"AIR={c['air']} base={c['base_rate']:.4f} FPR={c['fpr']} "
          f"TPR={c['tpr']} FNR={c['fnr']} PPV={c['ppv']} "
          f"{c['small_cell_flag'] or ''}")
print("  summary:", g2_age["summary"])

# ================================================================ (B) G3 bootstrap
sex_arr = test_raw["SEX"].values
rng = np.random.default_rng(SEED)
n_test = len(y_test_arr)
boot = {k: [] for k in ("approval_diff_pp_F_minus_M", "air_sex",
                        "tpr_gap_F_minus_M", "fpr_gap_F_minus_M",
                        "ece_gap_F_minus_M", "brier_gap_F_minus_M",
                        "ppv_gap_F_minus_M")}
n_skipped = 0
for _ in range(N_BOOT):
    idx = rng.integers(0, n_test, n_test)
    yb, pb, sb = y_test_arr[idx], cal_proba[idx], sex_arr[idx]
    gm = {}
    valid = True
    for code, lbl in SEX_LBL.items():
        m = sb == code
        g = group_metrics(yb[m], pb[m])
        if g is None or g["ppv"] is None:
            valid = False
            break
        gm[lbl] = g
    if not valid:
        n_skipped += 1
        continue
    m_m, m_f = gm["Laki-laki"], gm["Perempuan"]
    boot["approval_diff_pp_F_minus_M"].append(
        (m_f["approval_rate"] - m_m["approval_rate"]) * 100)
    boot["air_sex"].append(m_m["approval_rate"] / m_f["approval_rate"])
    boot["tpr_gap_F_minus_M"].append(m_f["tpr"] - m_m["tpr"])
    boot["fpr_gap_F_minus_M"].append(m_f["fpr"] - m_m["fpr"])
    boot["ece_gap_F_minus_M"].append(m_f["ece_10bin"] - m_m["ece_10bin"])
    boot["brier_gap_F_minus_M"].append(m_f["brier"] - m_m["brier"])
    boot["ppv_gap_F_minus_M"].append(m_f["ppv"] - m_m["ppv"])

# point estimates from the full test set
pt = {
    "approval_diff_pp_F_minus_M": r4(
        (sex_metrics["Perempuan"]["approval_rate"]
         - sex_metrics["Laki-laki"]["approval_rate"]) * 100),
    "air_sex": sex_air,
    "tpr_gap_F_minus_M": r4(sex_metrics["Perempuan"]["tpr"]
                            - sex_metrics["Laki-laki"]["tpr"]),
    "fpr_gap_F_minus_M": r4(sex_metrics["Perempuan"]["fpr"]
                            - sex_metrics["Laki-laki"]["fpr"]),
    "ece_gap_F_minus_M": r4(sex_metrics["Perempuan"]["ece_10bin"]
                            - sex_metrics["Laki-laki"]["ece_10bin"]),
    "brier_gap_F_minus_M": r4(sex_metrics["Perempuan"]["brier"]
                              - sex_metrics["Laki-laki"]["brier"]),
    "ppv_gap_F_minus_M": r4(sex_metrics["Perempuan"]["ppv"]
                            - sex_metrics["Laki-laki"]["ppv"]),
}
g3 = {"n_replicates": N_BOOT, "n_skipped": n_skipped,
      "n_used": N_BOOT - n_skipped, "metrics": {}}
for k, vals in boot.items():
    arr = np.asarray(vals)
    lo, hi = np.percentile(arr, [2.5, 97.5])
    null_val = 1.0 if k == "air_sex" else 0.0
    g3["metrics"][k] = {
        "point_estimate": pt[k],
        "bootstrap_mean": r4(float(arr.mean())),
        "bootstrap_sd": r4(float(arr.std(ddof=1))),
        "ci95_percentile": [r4(lo), r4(hi)],
        "ci_width": r4(hi - lo),
        "null_value": null_val,
        "ci_includes_null": bool(lo <= null_val <= hi),
    }
# Wilson CIs for SEX approval rates (for width comparison vs bootstrap)
g3["wilson_approval_sex"] = {
    lbl: {"n": gm["n"], "approval_rate": gm["approval_rate"],
          "wilson_ci95": gm["approval_wilson_ci95"],
          "ci_width": r4(gm["approval_wilson_ci95"][1]
                         - gm["approval_wilson_ci95"][0])}
    for lbl, gm in sex_metrics.items()}
g3["note"] = ("CI mencakup 0 (atau 1 untuk AIR) TIDAK berarti 'tidak ada gap' "
              "-- hanya dilaporkan angkanya.")
out["m7g3_bootstrap_ci"] = g3
print(f"\n== G3 bootstrap (n={N_BOOT}, skipped={n_skipped}) ==")
for k, v in g3["metrics"].items():
    print(f"  {k:28s} point={v['point_estimate']} boot_mean={v['bootstrap_mean']} "
          f"CI95=[{v['ci95_percentile'][0]},{v['ci95_percentile'][1]}] "
          f"includes_null={v['ci_includes_null']}")
print("  Wilson SEX approval:", g3["wilson_approval_sex"])

# ================================================================ (C) G8 data quality
# Scope: FULL data (30.000 rows). Groupings: SEX (raw codes), EDUCATION
# (EDU_GRP), AGE_BAND.
g8 = {}

# --- missingness per main feature
miss = {"scope": "full data (30,000 rows)", "features": {}}
for col in MAIN_FEATURES:
    overall_n = int(df[col].isna().sum())
    entry = {"overall": {"n_missing": overall_n,
                         "pct": r4(100 * overall_n / len(df))},
             "by_sex": {}, "by_education": {}}
    for code, lbl in SEX_LBL.items():
        sub = df[df["SEX"] == code]
        n_m = int(sub[col].isna().sum())
        entry["by_sex"][lbl] = {"n_missing": n_m,
                                "pct": r4(100 * n_m / len(sub)) if len(sub) else None}
    for code, lbl in EDU_LBL.items():
        sub = df[df["EDU_GRP"] == code]
        n_m = int(sub[col].isna().sum())
        entry["by_education"][lbl] = {"n_missing": n_m,
                                      "pct": r4(100 * n_m / len(sub)) if len(sub) else None}
    miss["features"][col] = entry
n_any_missing = int(df[MAIN_FEATURES].isna().any(axis=1).sum())
miss["rows_with_any_missing_main_feature"] = {
    "n": n_any_missing, "pct": r4(100 * n_any_missing / len(df))}
miss["interpretation"] = (
    "Missingness 0 di semua fitur utama (overall, per SEX, per EDUCATION) "
    "-- dataset UCI ini lengkap; tidak ada imputasi yang dibutuhkan untuk "
    "fitur utama. Bila ada NaN di fitur turunan, itu berasal dari "
    "perhitungan (mis. pembagian), bukan dari data mentah.")
g8["missingness"] = miss

# --- invalid categories
inv = {}
edu_invalid = df["EDUCATION"].isin([0, 5, 6])
mar_invalid = df["MARRIAGE"] == 0
inv["education_codes_0_5_6_outside_1_4"] = {
    "overall": {"n": int(edu_invalid.sum()),
                "pct": r4(100 * edu_invalid.mean())},
    "by_sex": {lbl: {"n": int(edu_invalid[df["SEX"] == c].sum()),
                     "pct": r4(100 * edu_invalid[df["SEX"] == c].mean())}
               for c, lbl in SEX_LBL.items()},
    "by_education_group": {lbl: {"n": int(edu_invalid[df["EDU_GRP"] == c].sum()),
                                 "pct": r4(100 * edu_invalid[df["EDU_GRP"] == c].mean())}
                           for c, lbl in EDU_LBL.items()},
    "by_age_band": {b: {"n": int(edu_invalid[df["AGE_BAND"] == b].sum()),
                        "pct": r4(100 * edu_invalid[df["AGE_BAND"] == b].mean())}
                    for b in AGE_BANDS},
}
inv["marriage_code_0_outside_1_3"] = {
    "overall": {"n": int(mar_invalid.sum()),
                "pct": r4(100 * mar_invalid.mean())},
    "by_sex": {lbl: {"n": int(mar_invalid[df["SEX"] == c].sum()),
                     "pct": r4(100 * mar_invalid[df["SEX"] == c].mean())}
               for c, lbl in SEX_LBL.items()},
    "by_education_group": {lbl: {"n": int(mar_invalid[df["EDU_GRP"] == c].sum()),
                                 "pct": r4(100 * mar_invalid[df["EDU_GRP"] == c].mean())}
                           for c, lbl in EDU_LBL.items()},
    "by_age_band": {b: {"n": int(mar_invalid[df["AGE_BAND"] == b].sum()),
                        "pct": r4(100 * mar_invalid[df["AGE_BAND"] == b].mean())}
                    for b in AGE_BANDS},
}
# raw code counts (context)
inv["education_raw_code_counts"] = {str(int(k)): int(v)
                                    for k, v in df["EDUCATION"].value_counts().sort_index().items()}
inv["marriage_raw_code_counts"] = {str(int(k)): int(v)
                                   for k, v in df["MARRIAGE"].value_counts().sort_index().items()}
inv["interpretation"] = (
    "EDUCATION kode 0/5/6 (di luar 1-4) dan MARRIAGE kode 0 (di luar 1-3) "
    "adalah kode 'lainnya/tidak tercatat' di dataset UCI -- kecil "
    "persentasenya, tetapi semua masuk grup 'Lainnya' di audit, sehingga "
    "grup Lainnya mencampur kode yang berbeda maknanya.")
g8["invalid_categories"] = inv

# --- odd values
def odd_stats(mask, label):
    return {
        "overall": {"n": int(mask.sum()), "pct": r4(100 * mask.mean())},
        "by_sex": {lbl: {"n": int(mask[df["SEX"] == c].sum()),
                         "pct": r4(100 * mask[df["SEX"] == c].mean())}
                   for c, lbl in SEX_LBL.items()},
        "by_education_group": {lbl: {"n": int(mask[df["EDU_GRP"] == c].sum()),
                                     "pct": r4(100 * mask[df["EDU_GRP"] == c].mean())}
                               for c, lbl in EDU_LBL.items()},
        "by_age_band": {b: {"n": int(mask[df["AGE_BAND"] == b].sum()),
                            "pct": r4(100 * mask[df["AGE_BAND"] == b].mean())}
                        for b in AGE_BANDS},
    }


odd = {
    "bill_amt_negative_any_of_6": odd_stats((df[BILL_COLS] < 0).any(axis=1),
                                            "bill_neg"),
    "pay_amt_negative_any_of_6": odd_stats((df[PAY_AMT_COLS] < 0).any(axis=1),
                                           "pay_neg"),
    "limit_bal_le_0": odd_stats(df["LIMIT_BAL"] <= 0, "limit_le0"),
    "age_outside_21_79": odd_stats((df["AGE"] < 21) | (df["AGE"] > 79), "age_out"),
    "age_range": {"min": int(df["AGE"].min()), "max": int(df["AGE"].max())},
    "limit_bal_range": {"min": int(df["LIMIT_BAL"].min()),
                        "max": int(df["LIMIT_BAL"].max())},
    "bill_amt_min": {c: int(df[c].min()) for c in BILL_COLS},
    "pay_amt_min": {c: int(df[c].min()) for c in PAY_AMT_COLS},
}
odd["interpretation"] = (
    "BILL_AMT negatif = kredit/kelebihan bayar (plausibel di kartu kredit, "
    "bukan error); PAY_AMT negatif = pengembalian/penyesuaian (jarang, "
    "periksa konsentrasinya); LIMIT_BAL <= 0 dan AGE di luar 21-79 "
    "seharusnya 0 -- bila >0, itu artefak data yang wajib dibersihkan "
    "sebelum training.")
g8["odd_values"] = odd

# --- full-row duplicates (overall only)
n_dup = int(df.duplicated().sum())
n_dup_id = int(df.duplicated(subset=[c for c in df.columns if c != "ID"]).sum())
g8["duplicates"] = {
    "full_row_duplicates_incl_id": {"n": n_dup,
                                    "pct": r4(100 * n_dup / len(df))},
    "duplicates_excl_id": {"n": n_dup_id,
                           "pct": r4(100 * n_dup_id / len(df))},
    "interpretation": (
        "Duplikat baris penuh (termasuk ID) seharusnya 0 karena ID unik; "
        "duplikat di luar ID = baris kembar dari nasabah berbeda -- kecil "
        "kemungkinan kebetulan pada 24 kolom, jadi bila >0 patut dicurigai "
        "sebagai duplikasi pencatatan."),
}
out["m7g8_data_quality"] = g8

print("\n== G8 data quality (full data) ==")
print(f"  rows with any missing main feature: {n_any_missing} "
      f"({r4(100 * n_any_missing / len(df))}%)")
print(f"  EDUCATION invalid 0/5/6: {int(edu_invalid.sum())} "
      f"({r4(100 * edu_invalid.mean())}%) | MARRIAGE 0: {int(mar_invalid.sum())} "
      f"({r4(100 * mar_invalid.mean())}%)")
print(f"  BILL_AMT<0 any: {int((df[BILL_COLS] < 0).any(axis=1).sum())} | "
      f"PAY_AMT<0 any: {int((df[PAY_AMT_COLS] < 0).any(axis=1).sum())} | "
      f"LIMIT_BAL<=0: {int((df['LIMIT_BAL'] <= 0).sum())} | "
      f"AGE outside 21-79: {int(((df['AGE'] < 21) | (df['AGE'] > 79)).sum())}")
print(f"  full-row duplicates: {n_dup} | excl ID: {n_dup_id}")

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s")

"""Canonical numbers for MLF M7.4 (Fairness mitigation).

Deterministic: seed 42 everywhere; data = ~/workspace/learn-platform/data/uci_default_credit.xls
(UCI Default of Credit Card Clients, 30.000 rows).
Pipeline REPLICATES the flagship notebook
~/workspace/guided-projects/ml-finance-credit-scoring/credit-scoring-end-to-end.ipynb
exactly: same add_features(), same stratified 80/20 split (test 6.000, random_state=42),
GBM = HistGradientBoostingClassifier(random_state=42) defaults, decision model =
CalibratedClassifierCV(GBM, method='sigmoid', cv=3), operating threshold 0.10,
LGD=0.45, MARGIN=0.05. Approval = predicted default probability < threshold.

Locked numbers to reproduce (tolerance 0.001 unless noted):
  GBM raw test ROC-AUC 0.7823 / PR-AUC 0.5597
  GBM calibrated test ROC-AUC 0.7816 / PR-AUC 0.5558 / Brier 0.1345
  threshold 0.10; cost NT$33,046,500; net profit +NT$8,214,000
  SEX audit @0.10: male approval 0.261 / female 0.301; AIR (male/max) 0.869
  EDUCATION: Pascasarjana AIR 0.603 (reference group 'Lainnya' n=82, approval 0.585)
  M2.2 scorecard audit: AIR (female/male) 1.1502 (female 0.3007 vs male 0.2614)
  Flagship post-processing (cell 45): per-group thresholds male 0.1058 / female 0.0965
    (target approval 0.285); cost after NT$32,756,000; accuracy 0.4682 -> 0.4687
  Flagship no-sensitive-features GBM (cell 54): raw ROC-AUC 0.7781 / PR-AUC 0.5516

Mitigations computed here (all from data, test 6.000 unless noted):
  A. pre-processing: (a) reweighing Kamiran-Calders on SEX x default (train weights),
     (b) resampling SEX x default cells to equal size (train, seed 42),
     (c) drop sensitive features SEX/MARRIAGE/EDUCATION + proxy probe (predict SEX).
  B. in-processing: reductions-style simplified iterative reweighting targeting
     FNR parity on train (upweight defaulters of the worse-FNR group x1.5/round,
     max 6 rounds). NOTE: fairlearn is NOT installed; this is the same idea in
     miniature, labelled honestly as such -- NOT the full ExponentiatedGradient.
  C. post-processing: flagship replication of per-group thresholds for SEX +
     full before/after table (approval, AIR, FPR/FNR gaps, cost, profit,
     accuracy, ROC-AUC/PR-AUC on raw proba AND on the adjusted decision score
     s = p / t_group), cross-group inversions, bad rate among approved per group.
  D. Pareto: lambda sweep 0..1 interpolating single threshold -> per-group
     thresholds; AIR vs cost/profit/accuracy at each lambda.
  E. EDUCATION n=82 flag: bootstrap SD of the 'Lainnya' per-group threshold
     (500 resamples) + SE of its approval rate.

Run: python3 qa-learn/m7_calc_m74.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_calc_m74_output.json
"""
import json
import time

import numpy as np
import pandas as pd
import sklearn
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import (average_precision_score, brier_score_loss,
                             roc_auc_score)
from sklearn.model_selection import train_test_split

SEED = 42
RNG = np.random.default_rng(SEED)
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m7_calc_m74_output.json"
LGD = 0.45
MARGIN = 0.05
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} numpy={np.__version__} "
      f"pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__,
               "numpy": np.__version__, "pandas": pd.__version__,
               "data": DATA_XLS,
               "note": "fairlearn NOT installed; in-processing is simplified "
                       "reductions-style iterative reweighting, labelled honestly."}
try:
    import fairlearn  # noqa
    out["meta"]["fairlearn"] = fairlearn.__version__
except ImportError:
    out["meta"]["fairlearn"] = None

# ---------------------------------------------------------------- load + features (flagship replica)
df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
print(f"data: {df.shape}, base rate={df['default'].mean():.4f}")

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


def gbm(**kw):
    params = dict(random_state=SEED)
    params.update(kw)
    return HistGradientBoostingClassifier(**params)


def calibrate(model):
    cal = CalibratedClassifierCV(estimator=model, method="sigmoid", cv=3)
    return cal


def portfolio_cost(y_true, y_proba, limit, threshold, lgd=LGD, margin=MARGIN):
    y_arr = np.asarray(y_true)
    limit_arr = np.asarray(limit, dtype=float)
    pred_default = np.asarray(y_proba) >= threshold
    fn_cost = ((y_arr == 1) & (~pred_default)) * lgd * limit_arr
    fp_cost = ((y_arr == 0) & (pred_default)) * margin * limit_arr
    return float(fn_cost.sum() + fp_cost.sum())


def portfolio_cost_per_row(y_true, y_proba, limit, thresholds_per_row,
                           lgd=LGD, margin=MARGIN):
    y_arr = np.asarray(y_true)
    limit_arr = np.asarray(limit, dtype=float)
    pred_default = np.asarray(y_proba) >= np.asarray(thresholds_per_row)
    fn_cost = ((y_arr == 1) & (~pred_default)) * lgd * limit_arr
    fp_cost = ((y_arr == 0) & (pred_default)) * margin * limit_arr
    return float(fn_cost.sum() + fp_cost.sum())


def net_profit(y_true, y_proba, limit, threshold, lgd=LGD, margin=MARGIN):
    """margin * limit of approved good - LGD * limit of approved bad."""
    y_arr = np.asarray(y_true)
    limit_arr = np.asarray(limit, dtype=float)
    approved = np.asarray(y_proba) < threshold
    good = (y_arr == 0) & approved
    bad = (y_arr == 1) & approved
    return float((margin * limit_arr[good]).sum() - (lgd * limit_arr[bad]).sum())


def net_profit_per_row(y_true, y_proba, limit, thresholds_per_row,
                       lgd=LGD, margin=MARGIN):
    y_arr = np.asarray(y_true)
    limit_arr = np.asarray(limit, dtype=float)
    approved = np.asarray(y_proba) < np.asarray(thresholds_per_row)
    good = (y_arr == 0) & approved
    bad = (y_arr == 1) & approved
    return float((margin * limit_arr[good]).sum() - (lgd * limit_arr[bad]).sum())


def audit_groups(group_series, proba, y_true, threshold):
    data = pd.DataFrame({
        "group": np.asarray(group_series),
        "y": np.asarray(y_true),
        "proba": np.asarray(proba),
    })
    data["approved"] = data["proba"] < threshold
    rows = []
    for g, sub in data.groupby("group"):
        n_good = int((sub["y"] == 0).sum())
        n_bad = int((sub["y"] == 1).sum())
        fpr = float(((sub["y"] == 0) & (~sub["approved"])).sum() / max(n_good, 1))
        fnr = float(((sub["y"] == 1) & (sub["approved"])).sum() / max(n_bad, 1))
        bad_approved = float(sub.loc[sub["approved"], "y"].mean()) if sub["approved"].any() else float("nan")
        rows.append({
            "group": g, "n": len(sub), "base_rate": float(sub["y"].mean()),
            "approval_rate": float(sub["approved"].mean()),
            "mean_pred_pd": float(sub["proba"].mean()), "FPR": fpr, "FNR": fnr,
            "bad_rate_approved": bad_approved,
        })
    res = pd.DataFrame(rows)
    res["adverse_impact_ratio"] = res["approval_rate"] / res["approval_rate"].max()
    return res


def audit_groups_per_row(group_series, proba, y_true, thresholds_per_row):
    """Audit where each row has its own threshold (post-processing)."""
    data = pd.DataFrame({
        "group": np.asarray(group_series),
        "y": np.asarray(y_true),
        "proba": np.asarray(proba),
        "thr": np.asarray(thresholds_per_row, dtype=float),
    })
    data["approved"] = data["proba"] < data["thr"]
    rows = []
    for g, sub in data.groupby("group"):
        n_good = int((sub["y"] == 0).sum())
        n_bad = int((sub["y"] == 1).sum())
        fpr = float(((sub["y"] == 0) & (~sub["approved"])).sum() / max(n_good, 1))
        fnr = float(((sub["y"] == 1) & (sub["approved"])).sum() / max(n_bad, 1))
        bad_approved = float(sub.loc[sub["approved"], "y"].mean()) if sub["approved"].any() else float("nan")
        rows.append({
            "group": g, "n": len(sub), "base_rate": float(sub["y"].mean()),
            "approval_rate": float(sub["approved"].mean()),
            "mean_pred_pd": float(sub["proba"].mean()), "FPR": fpr, "FNR": fnr,
            "bad_rate_approved": bad_approved,
            "threshold": float(sub["thr"].iloc[0]),
        })
    res = pd.DataFrame(rows)
    res["adverse_impact_ratio"] = res["approval_rate"] / res["approval_rate"].max()
    return res


def policy_metrics(y_true, proba, limit, threshold):
    """Cost, profit, accuracy (flagship def: pred_default==y) at one threshold."""
    cost = portfolio_cost(y_true, proba, limit, threshold)
    profit = net_profit(y_true, proba, limit, threshold)
    pred_default = (np.asarray(proba) >= threshold).astype(int)
    acc = float((pred_default == np.asarray(y_true)).mean())
    return {"cost": cost, "profit": profit, "accuracy": acc}


# ---------------------------------------------------------------- baseline models
print("fitting GBM raw ...")
gbm_raw = gbm()
gbm_raw.fit(X_train, y_train)
proba_raw = gbm_raw.predict_proba(X_test)[:, 1]
print("fitting calibrated GBM (Platt, cv=3) ...")
cal_gbm = calibrate(gbm())
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]

base = {
    "gbm_raw_roc_auc": r4(roc_auc_score(y_test, proba_raw)),
    "gbm_raw_pr_auc": r4(average_precision_score(y_test, proba_raw)),
    "gbm_cal_roc_auc": r4(roc_auc_score(y_test, cal_proba)),
    "gbm_cal_pr_auc": r4(average_precision_score(y_test, cal_proba)),
    "gbm_cal_brier": r4(brier_score_loss(y_test, cal_proba)),
    "threshold": 0.10,
    "cost_010": portfolio_cost(y_test, cal_proba, X_test["LIMIT_BAL"].values, 0.10),
    "profit_010": net_profit(y_test, cal_proba, X_test["LIMIT_BAL"].values, 0.10),
    "approve_all_cost": float((((y_test.values == 1)) * LGD * X_test["LIMIT_BAL"].values).sum()),
    "reject_all_cost": float((((y_test.values == 0)) * MARGIN * X_test["LIMIT_BAL"].values).sum()),
}
print("baseline:", base)
out["baseline"] = base
# sanity: profit == reject_all_cost - cost (margin on all good minus cost)
assert abs(base["profit_010"] - (base["reject_all_cost"] - base["cost_010"])) < 1.0

# ---------------------------------------------------------------- audits @ 0.10 (verify locked numbers)
sex_labels = {1: "Laki-laki", 2: "Perempuan"}
mar_labels = {1: "Menikah", 2: "Lajang", 3: "Lainnya"}
test_frame = X_test_raw.copy()
test_frame["EDU_GROUP"] = test_frame["EDUCATION"].map(
    {1: "Pascasarjana", 2: "Sarjana", 3: "SMA"}).fillna("Lainnya")
test_frame["AGE_GROUP"] = pd.cut(
    test_frame["AGE"], bins=[20, 30, 45, 80], labels=["<30", "30-44", "45+"]).astype(str)
sex_groups = test_frame["SEX"].map(sex_labels)

audit_sex = audit_groups(sex_groups, cal_proba, y_test, 0.10)
audit_edu = audit_groups(test_frame["EDU_GROUP"], cal_proba, y_test, 0.10)
audit_mar = audit_groups(test_frame["MARRIAGE"].map(mar_labels), cal_proba, y_test, 0.10)
audit_age = audit_groups(test_frame["AGE_GROUP"], cal_proba, y_test, 0.10)
for name, a in [("sex", audit_sex), ("edu", audit_edu), ("mar", audit_mar), ("age", audit_age)]:
    print(f"--- audit {name} ---")
    print(a.round(4).to_string(index=False))
    out[f"audit_{name}"] = a.round(4).to_dict(orient="records")

# locked checks (report, do not silently overwrite)
male_appr = float(audit_sex.loc[audit_sex["group"] == "Laki-laki", "approval_rate"].iloc[0])
fem_appr = float(audit_sex.loc[audit_sex["group"] == "Perempuan", "approval_rate"].iloc[0])
air_sex = float(audit_sex.loc[audit_sex["group"] == "Laki-laki", "adverse_impact_ratio"].iloc[0])
out["locked_check"] = {
    "gbm_raw_roc_auc_diff_vs_0.7823": r4(base["gbm_raw_roc_auc"] - 0.7823),
    "gbm_raw_pr_auc_diff_vs_0.5597": r4(base["gbm_raw_pr_auc"] - 0.5597),
    "gbm_cal_roc_auc_diff_vs_0.7816": r4(base["gbm_cal_roc_auc"] - 0.7816),
    "air_sex_diff_vs_0.869": r4(air_sex - 0.869),
    "male_approval": r4(male_appr), "female_approval": r4(fem_appr),
    "air_female_over_male": r4(fem_appr / male_appr),
    "air_female_over_male_diff_vs_1.1502": r4(fem_appr / male_appr - 1.1502),
    "edu_pascasarjana_air": r4(float(audit_edu.loc[audit_edu["group"] == "Pascasarjana", "adverse_impact_ratio"].iloc[0])),
    "edu_lainnya_n": int(audit_edu.loc[audit_edu["group"] == "Lainnya", "n"].iloc[0]),
    "edu_lainnya_approval": r4(float(audit_edu.loc[audit_edu["group"] == "Lainnya", "approval_rate"].iloc[0])),
}
print("locked_check:", out["locked_check"])

# ---------------------------------------------------------------- A(a) reweighing (Kamiran-Calders) on SEX x default, train
train_sex = X_train_raw["SEX"].map(sex_labels)
cells = pd.crosstab(train_sex, y_train)
print("train SEX x default counts:\n", cells)
p_g = train_sex.value_counts(normalize=True)
p_y = y_train.value_counts(normalize=True)
weights_map = {}
for g in ["Laki-laki", "Perempuan"]:
    for yy in [0, 1]:
        p_gy = float(((train_sex == g) & (y_train == yy)).mean())
        weights_map[(g, yy)] = float(p_g[g] * p_y[yy] / p_gy)
print("reweighing weights (g,y):", {str(k): round(v, 4) for k, v in weights_map.items()})
out["reweighing"] = {
    "train_cells": {f"{g}|y={yy}": int(cells.loc[g, yy]) for g in cells.index for yy in cells.columns},
    "weights": {f"{g}|y={yy}": r4(w) for (g, yy), w in weights_map.items()},
}
w_train = np.array([weights_map[(g, yy)] for g, yy in zip(train_sex, y_train)])
print("fitting reweighted GBM ...")
gbm_rw = gbm()
gbm_rw.fit(X_train, y_train, sample_weight=w_train)
try:
    cal_rw = calibrate(gbm())
    cal_rw.fit(X_train, y_train, sample_weight=w_train)
    proba_rw = cal_rw.predict_proba(X_test)[:, 1]
    out["reweighing"]["calibration_sample_weight"] = "supported"
except TypeError as e:
    print("CalibratedClassifierCV sample_weight NOT supported, fallback unweighted:", e)
    cal_rw = calibrate(gbm_rw)
    cal_rw.fit(X_train, y_train)
    proba_rw = cal_rw.predict_proba(X_test)[:, 1]
    out["reweighing"]["calibration_sample_weight"] = "NOT supported; calibrated unweighted on reweighted base"
audit_rw = audit_groups(sex_groups, proba_rw, y_test, 0.10)
met_rw = policy_metrics(y_test, proba_rw, X_test["LIMIT_BAL"].values, 0.10)
print("reweighing audit:\n", audit_rw.round(4).to_string(index=False), met_rw)
out["reweighing"].update({
    "audit_sex": audit_rw.round(4).to_dict(orient="records"),
    "roc_auc": r4(roc_auc_score(y_test, proba_rw)),
    "pr_auc": r4(average_precision_score(y_test, proba_rw)),
    "brier": r4(brier_score_loss(y_test, proba_rw)),
    "cost": met_rw["cost"], "profit": met_rw["profit"], "accuracy": r4(met_rw["accuracy"]),
    "air": r4(float(audit_rw["adverse_impact_ratio"].min())),
})

# ---------------------------------------------------------------- A(b) resampling: balance SEX x default cells in train
rng_rs = np.random.default_rng(SEED)
max_cell = int(cells.values.max())
idx_list = []
train_idx = np.arange(len(X_train))
for g in ["Laki-laki", "Perempuan"]:
    for yy in [0, 1]:
        cell_idx = train_idx[(train_sex.values == g) & (y_train.values == yy)]
        draw = rng_rs.choice(cell_idx, size=max_cell, replace=True)
        idx_list.append(draw)
rs_idx = np.concatenate(idx_list)
rng_rs.shuffle(rs_idx)
print(f"resampled train n={len(rs_idx)} (was {len(X_train)}), max cell={max_cell}")
print("fitting resampled GBM ...")
gbm_rs = gbm()
gbm_rs.fit(X_train.iloc[rs_idx], y_train.iloc[rs_idx])
cal_rs = calibrate(gbm())
cal_rs.fit(X_train.iloc[rs_idx], y_train.iloc[rs_idx])
proba_rs = cal_rs.predict_proba(X_test)[:, 1]
audit_rs = audit_groups(sex_groups, proba_rs, y_test, 0.10)
met_rs = policy_metrics(y_test, proba_rs, X_test["LIMIT_BAL"].values, 0.10)
print("resampling audit:\n", audit_rs.round(4).to_string(index=False), met_rs)
out["resampling"] = {
    "train_n_resampled": int(len(rs_idx)), "max_cell": max_cell,
    "audit_sex": audit_rs.round(4).to_dict(orient="records"),
    "roc_auc": r4(roc_auc_score(y_test, proba_rs)),
    "pr_auc": r4(average_precision_score(y_test, proba_rs)),
    "brier": r4(brier_score_loss(y_test, proba_rs)),
    "cost": met_rs["cost"], "profit": met_rs["profit"], "accuracy": r4(met_rs["accuracy"]),
    "air": r4(float(audit_rs["adverse_impact_ratio"].min())),
}

# ---------------------------------------------------------------- A(c) drop sensitive features + proxy probe
SENSITIVE = ["SEX", "MARRIAGE", "EDUCATION"]
features_fair = [f for f in FEATURES if f not in SENSITIVE]
print("fitting GBM without sensitive features ...")
gbm_fair = gbm()
gbm_fair.fit(X_train[features_fair], y_train)
proba_fair_raw = gbm_fair.predict_proba(X_test[features_fair])[:, 1]
cal_fair = calibrate(gbm())
cal_fair.fit(X_train[features_fair], y_train)
proba_fair = cal_fair.predict_proba(X_test[features_fair])[:, 1]
audit_fair = audit_groups(sex_groups, proba_fair, y_test, 0.10)
met_fair = policy_metrics(y_test, proba_fair, X_test["LIMIT_BAL"].values, 0.10)
print("no-sensitive audit:\n", audit_fair.round(4).to_string(index=False), met_fair)
# proxy probe 1: predict SEX from remaining features
probe = gbm()
probe.fit(X_train[features_fair], (X_train_raw["SEX"] == 2).astype(int))
probe_proba = probe.predict_proba(X_test[features_fair])[:, 1]
probe_auc = float(roc_auc_score((X_test_raw["SEX"] == 2).astype(int), probe_proba))
# proxy probe 2: how well does the fair model's own PD predict SEX?
probe_pd_auc = float(roc_auc_score((X_test_raw["SEX"] == 2).astype(int), proba_fair))
print(f"proxy probe: SEX-from-features ROC-AUC={probe_auc:.4f}; SEX-from-fair-PD ROC-AUC={probe_pd_auc:.4f}")
out["drop_sensitive"] = {
    "features_dropped": SENSITIVE, "n_features_kept": len(features_fair),
    "raw_roc_auc": r4(roc_auc_score(y_test, proba_fair_raw)),
    "raw_pr_auc": r4(average_precision_score(y_test, proba_fair_raw)),
    "cal_roc_auc": r4(roc_auc_score(y_test, proba_fair)),
    "cal_pr_auc": r4(average_precision_score(y_test, proba_fair)),
    "cal_brier": r4(brier_score_loss(y_test, proba_fair)),
    "audit_sex": audit_fair.round(4).to_dict(orient="records"),
    "cost": met_fair["cost"], "profit": met_fair["profit"], "accuracy": r4(met_fair["accuracy"]),
    "air": r4(float(audit_fair["adverse_impact_ratio"].min())),
    "proxy_probe_sex_from_features_roc_auc": r4(probe_auc),
    "proxy_probe_sex_from_fair_pd_roc_auc": r4(probe_pd_auc),
}

# ---------------------------------------------------------------- B. in-processing: simplified reductions-style iterative reweighting
# Target: FNR parity on TRAIN at threshold 0.10. Each round, defaulters of the
# group with the higher train FNR get their weight x1.5. Stop when train FNR
# gap < 0.005 or after 6 rounds. Final model calibrated (Platt, cv=3).
print("in-processing: iterative reweighting rounds ...")
w_in = np.ones(len(X_train))
rounds_log = []
for rnd in range(6):
    m = gbm()
    m.fit(X_train, y_train, sample_weight=w_in)
    p_tr = m.predict_proba(X_train)[:, 1]
    a_tr = audit_groups(train_sex, p_tr, y_train, 0.10)
    fnr_m = float(a_tr.loc[a_tr["group"] == "Laki-laki", "FNR"].iloc[0])
    fnr_f = float(a_tr.loc[a_tr["group"] == "Perempuan", "FNR"].iloc[0])
    gap = abs(fnr_m - fnr_f)
    rounds_log.append({"round": rnd + 1, "fnr_male_train": r4(fnr_m),
                       "fnr_female_train": r4(fnr_f), "fnr_gap_train": r4(gap)})
    print(f"  round {rnd+1}: train FNR male={fnr_m:.4f} female={fnr_f:.4f} gap={gap:.4f}")
    if gap < 0.005:
        break
    worse = "Laki-laki" if fnr_m > fnr_f else "Perempuan"
    mask = (train_sex.values == worse) & (y_train.values == 1)
    w_in = w_in.copy()
    w_in[mask] *= 1.5
print("fitting final in-processing GBM + calibration ...")
gbm_in = gbm()
gbm_in.fit(X_train, y_train, sample_weight=w_in)
try:
    cal_in = calibrate(gbm())
    cal_in.fit(X_train, y_train, sample_weight=w_in)
    proba_in = cal_in.predict_proba(X_test)[:, 1]
    cal_sw = "supported"
except TypeError:
    cal_in = calibrate(gbm_in)
    cal_in.fit(X_train, y_train)
    proba_in = cal_in.predict_proba(X_test)[:, 1]
    cal_sw = "NOT supported; calibrated unweighted on reweighted base"
audit_in = audit_groups(sex_groups, proba_in, y_test, 0.10)
met_in = policy_metrics(y_test, proba_in, X_test["LIMIT_BAL"].values, 0.10)
print("in-processing audit:\n", audit_in.round(4).to_string(index=False), met_in)
out["in_processing"] = {
    "method": "simplified reductions-style iterative reweighting (NOT full ExponentiatedGradient; fairlearn not installed)",
    "rounds": rounds_log, "n_rounds": len(rounds_log),
    "calibration_sample_weight": cal_sw,
    "audit_sex": audit_in.round(4).to_dict(orient="records"),
    "roc_auc": r4(roc_auc_score(y_test, proba_in)),
    "pr_auc": r4(average_precision_score(y_test, proba_in)),
    "brier": r4(brier_score_loss(y_test, proba_in)),
    "cost": met_in["cost"], "profit": met_in["profit"], "accuracy": r4(met_in["accuracy"]),
    "air": r4(float(audit_in["adverse_impact_ratio"].min())),
}

# ---------------------------------------------------------------- C. post-processing: flagship replication (cell 45)
def group_thresholds_for_equal_approval(group_series, proba, target_rate):
    data = pd.DataFrame({"group": np.asarray(group_series), "proba": np.asarray(proba)})
    thresholds = {}
    for g, sub in data.groupby("group"):
        thresholds[g] = float(np.quantile(sub["proba"], target_rate))
    return thresholds


overall_approval = float((cal_proba < 0.10).mean())
mit_thresholds = group_thresholds_for_equal_approval(sex_groups, cal_proba, overall_approval)
print("per-group thresholds (target approval %.4f):" % overall_approval, mit_thresholds)
thr_per_row = sex_groups.map(mit_thresholds).values
pred_mit = cal_proba >= thr_per_row
audit_mit = audit_groups_per_row(sex_groups, cal_proba, y_test, thr_per_row)
cost_before = portfolio_cost(y_test, cal_proba, X_test["LIMIT_BAL"].values, 0.10)
cost_after = portfolio_cost_per_row(y_test, cal_proba, X_test["LIMIT_BAL"].values, thr_per_row)
profit_before = net_profit(y_test, cal_proba, X_test["LIMIT_BAL"].values, 0.10)
profit_after = net_profit_per_row(y_test, cal_proba, X_test["LIMIT_BAL"].values, thr_per_row)
acc_before = float((((cal_proba >= 0.10).astype(int)) == y_test.values).mean())
acc_after = float(((pred_mit.astype(int)) == y_test.values).mean())
# ROC-AUC/PR-AUC after mitigation: (i) raw proba unchanged; (ii) adjusted decision score s = p / t_g
adj_score = cal_proba / thr_per_row
roc_adj = float(roc_auc_score(y_test, adj_score))
pr_adj = float(average_precision_score(y_test, adj_score))
# cross-group inversions: males approved with p in (t_female, t_male] while
# females with p in the same band are rejected (same score, different decision)
t_m, t_f = mit_thresholds["Laki-laki"], mit_thresholds["Perempuan"]
inv_male_approved = int((((sex_groups == "Laki-laki") & (cal_proba > t_f) & (cal_proba <= t_m))).sum())
inv_female_rejected = int((((sex_groups == "Perempuan") & (cal_proba > t_f) & (cal_proba <= t_m))).sum())
print("mitigated audit:\n", audit_mit.round(4).to_string(index=False))
print(f"cost {cost_before:.0f} -> {cost_after:.0f}; profit {profit_before:.0f} -> {profit_after:.0f}; "
      f"acc {acc_before:.4f} -> {acc_after:.4f}; ROC-AUC adj {roc_adj:.4f} PR-AUC adj {pr_adj:.4f}")
print(f"inversions in band ({t_f:.4f}, {t_m:.4f}]: males approved={inv_male_approved}, females rejected={inv_female_rejected}")
out["post_processing"] = {
    "method": "flagship cell 45 replication: per-group threshold = quantile(proba, overall approval rate)",
    "target_approval_rate": r4(overall_approval),
    "thresholds": {g: r4(v) for g, v in mit_thresholds.items()},
    "audit_before": audit_sex.round(4).to_dict(orient="records"),
    "audit_after": audit_mit.round(4).to_dict(orient="records"),
    "approval_gap_before": r4(float(audit_sex["approval_rate"].max() - audit_sex["approval_rate"].min())),
    "approval_gap_after": r4(float(audit_mit["approval_rate"].max() - audit_mit["approval_rate"].min())),
    "air_before": r4(float(audit_sex["adverse_impact_ratio"].min())),
    "air_after": r4(float(audit_mit["adverse_impact_ratio"].min())),
    "fpr_gap_before": r4(float(audit_sex["FPR"].max() - audit_sex["FPR"].min())),
    "fpr_gap_after": r4(float(audit_mit["FPR"].max() - audit_mit["FPR"].min())),
    "fnr_gap_before": r4(float(audit_sex["FNR"].max() - audit_sex["FNR"].min())),
    "fnr_gap_after": r4(float(audit_mit["FNR"].max() - audit_mit["FNR"].min())),
    "cost_before": cost_before, "cost_after": cost_after,
    "cost_change": cost_after - cost_before,
    "profit_before": profit_before, "profit_after": profit_after,
    "profit_change": profit_after - profit_before,
    "accuracy_before": r4(acc_before), "accuracy_after": r4(acc_after),
    "roc_auc_raw_proba": r4(base["gbm_cal_roc_auc"]),
    "pr_auc_raw_proba": r4(base["gbm_cal_pr_auc"]),
    "roc_auc_adjusted_score": r4(roc_adj),
    "pr_auc_adjusted_score": r4(pr_adj),
    "inversion_band": [r4(t_f), r4(t_m)],
    "inversions_male_approved_in_band": inv_male_approved,
    "inversions_female_rejected_in_band": inv_female_rejected,
    "flagship_check": {
        "threshold_male_diff_vs_0.1058": r4(mit_thresholds["Laki-laki"] - 0.1058),
        "threshold_female_diff_vs_0.0965": r4(mit_thresholds["Perempuan"] - 0.0965),
        "cost_after_diff_vs_32756000": cost_after - 32756000,
        "accuracy_after_diff_vs_0.4687": r4(acc_after - 0.4687),
    },
}

# ---------------------------------------------------------------- D. Pareto: lambda sweep single -> per-group thresholds
pareto = []
for lam in [0.0, 0.25, 0.5, 0.75, 1.0]:
    thr_lam = {g: 0.10 + lam * (mit_thresholds[g] - 0.10) for g in mit_thresholds}
    thr_row = sex_groups.map(thr_lam).values
    a_lam = audit_groups_per_row(sex_groups, cal_proba, y_test, thr_row)
    c_lam = portfolio_cost_per_row(y_test, cal_proba, X_test["LIMIT_BAL"].values, thr_row)
    p_lam = net_profit_per_row(y_test, cal_proba, X_test["LIMIT_BAL"].values, thr_row)
    pred_lam = (cal_proba >= thr_row).astype(int)
    acc_lam = float((pred_lam == y_test.values).mean())
    adj_lam = cal_proba / thr_row
    pareto.append({
        "lambda": lam,
        "threshold_male": r4(thr_lam["Laki-laki"]),
        "threshold_female": r4(thr_lam["Perempuan"]),
        "approval_male": r4(float(a_lam.loc[a_lam["group"] == "Laki-laki", "approval_rate"].iloc[0])),
        "approval_female": r4(float(a_lam.loc[a_lam["group"] == "Perempuan", "approval_rate"].iloc[0])),
        "air": r4(float(a_lam["adverse_impact_ratio"].min())),
        "approval_gap": r4(float(a_lam["approval_rate"].max() - a_lam["approval_rate"].min())),
        "cost": c_lam, "profit": p_lam, "accuracy": r4(acc_lam),
        "roc_auc_adjusted_score": r4(roc_auc_score(y_test, adj_lam)),
        "pr_auc_adjusted_score": r4(average_precision_score(y_test, adj_lam)),
    })
print("pareto:")
for row in pareto:
    print(" ", row)
out["pareto_lambda"] = pareto

# ---------------------------------------------------------------- E. EDUCATION n=82 flag: bootstrap threshold stability
edu_lainnya_proba = cal_proba[(test_frame["EDU_GROUP"] == "Lainnya").values]
n_lain = len(edu_lainnya_proba)
appr_lain = float((edu_lainnya_proba < 0.10).mean())
se_appr = float(np.sqrt(appr_lain * (1 - appr_lain) / n_lain))
boot_thr = []
for _ in range(500):
    s = RNG.choice(edu_lainnya_proba, size=n_lain, replace=True)
    boot_thr.append(float(np.quantile(s, overall_approval)))
boot_thr = np.array(boot_thr)
thr_lain_point = float(np.quantile(edu_lainnya_proba, overall_approval))
print(f"EDU Lainnya n={n_lain}: approval@0.10={appr_lain:.4f} SE={se_appr:.4f}; "
      f"per-group threshold point={thr_lain_point:.4f}, bootstrap SD={boot_thr.std():.4f}, "
      f"95% CI=({np.quantile(boot_thr, 0.025):.4f}, {np.quantile(boot_thr, 0.975):.4f})")
# same bootstrap for SEX groups, for contrast
boot_sex = {}
for g in ["Laki-laki", "Perempuan"]:
    pp = cal_proba[(sex_groups == g).values]
    b = [float(np.quantile(RNG.choice(pp, size=len(pp), replace=True), overall_approval)) for _ in range(500)]
    boot_sex[g] = {"n": int(len(pp)), "threshold_point": r4(float(np.quantile(pp, overall_approval))),
                   "bootstrap_sd": r4(float(np.std(b))),
                   "ci95": [r4(float(np.quantile(b, 0.025))), r4(float(np.quantile(b, 0.975)))]}
print("sex threshold bootstrap:", boot_sex)
out["edu_small_n_flag"] = {
    "group": "Lainnya (EDUCATION)", "n": n_lain,
    "approval_at_010": r4(appr_lain), "se_approval": r4(se_appr),
    "per_group_threshold_point": r4(thr_lain_point),
    "bootstrap_sd_threshold": r4(float(boot_thr.std())),
    "bootstrap_ci95_threshold": [r4(float(np.quantile(boot_thr, 0.025))), r4(float(np.quantile(boot_thr, 0.975)))],
    "n_boot": 500,
    "sex_bootstrap_contrast": boot_sex,
}

out["elapsed_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
print(f"wrote {OUT_JSON} in {out['elapsed_seconds']}s")

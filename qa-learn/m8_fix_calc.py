"""Fix-round calc for M8 review (M8.4 M3 + S6 + S1).

Replicates the flagship pipeline exactly (same as
qa-learn/m8_canonical_calc.py): same data, add_features(), same stratified
80/20 split seed 42, LR = Pipeline(StandardScaler,
LogisticRegression(max_iter=1000, random_state=42)), GBM =
HistGradientBoostingClassifier(random_state=42), decision model = GBM
calibrated Platt/sigmoid (CalibratedClassifierCV cv=3), threshold 0.10,
LGD 0.45, MARGIN 0.05.

Computes:
  (a) LR CALIBRATED (Platt/sigmoid, cv=3) at threshold 0.10 on test 6.000:
      n_approved / approval_rate / bad_rate / realised profit / cost --
      lesson M8.4 claims 1.166 approvals (unverified).
  (b) approve-all REALISED loss: sum(LIMIT_BAL of default rows in test)
      x LGD 0.45 -- lesson M8.4 claims 82.155.456 (unverified; expected
      loss all test is 78.675.378, a DIFFERENT quantity).
  (c) mean calibrated GBM proba on test -- lesson M8.4 cites 0.2217
      (claimed to be the notebook M8.1 output mean_score).

Run: python3 qa-learn/m8_fix_calc.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m8_fix_numbers.json (merged into m8_canonical.json by hand
after verification -- see script output).
"""
import json
import time

import numpy as np
import pandas as pd
import sklearn
import scipy
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m8_fix_numbers.json"
LGD = 0.45
MARGIN = 0.05
THR = 0.10
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} scipy={scipy.__version__} "
      f"numpy={np.__version__} pandas={pd.__version__} seed={SEED}")

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


def r4(x):
    return round(float(x), 4)


def portfolio_cost(y_true, y_proba, limit, threshold, lgd=LGD, margin=MARGIN):
    y_arr = np.asarray(y_true)
    limit_arr = np.asarray(limit, dtype=float)
    pred_default = np.asarray(y_proba) >= threshold
    fn_cost = ((y_arr == 1) & (~pred_default)) * lgd * limit_arr
    fp_cost = ((y_arr == 0) & (pred_default)) * margin * limit_arr
    return float(fn_cost.sum() + fp_cost.sum())


def threshold_economics(y_true, y_proba, limit, threshold):
    approved = np.asarray(y_proba) < threshold
    n_app = int(approved.sum())
    bad = float(np.asarray(y_true)[approved].mean()) if n_app else 0.0
    realised_profit = float(((np.asarray(y_true)[approved] == 0) * MARGIN
                             * np.asarray(limit)[approved]).sum())
    realised_loss = float(((np.asarray(y_true)[approved] == 1) * LGD
                           * np.asarray(limit)[approved]).sum())
    return {"n_approved": n_app, "approval_rate": r4(approved.mean()),
            "bad_rate_approved": r4(bad),
            "realised_profit_NT": int(realised_profit),
            "realised_loss_NT": int(realised_loss),
            "net_profit_realised_NT": int(realised_profit - realised_loss),
            "total_cost_NT": int(portfolio_cost(y_true, y_proba, limit, threshold))}


X_raw = df.drop(columns=["ID", "default"])
y = df["default"]
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.20, stratify=y, random_state=SEED)
X_train = add_features(X_train_raw)
X_test = add_features(X_test_raw)
test_limit = X_test_raw["LIMIT_BAL"].values.astype(float)
y_test_arr = y_test.values

# --- flagship models (same as m8_canonical_calc.py) ---
gbm0 = HistGradientBoostingClassifier(random_state=SEED)
gbm0.fit(X_train, y_train)
cal_gbm = CalibratedClassifierCV(
    estimator=HistGradientBoostingClassifier(random_state=SEED),
    method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]
lr_pipe = Pipeline([("scaler", StandardScaler()),
                    ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))])
lr_pipe.fit(X_train, y_train)
lr_proba = lr_pipe.predict_proba(X_test)[:, 1]

# locked sanity: GBM cal ROC-AUC 0.7816, LR raw ROC-AUC 0.7426
cal_roc = r4(roc_auc_score(y_test, cal_proba))
lr_roc = r4(roc_auc_score(y_test, lr_proba))
print(f"sanity: GBM cal ROC={cal_roc} (locked 0.7816) | LR raw ROC={lr_roc} (locked 0.7426)")
assert abs(cal_roc - 0.7816) <= 0.001 and abs(lr_roc - 0.7426) <= 0.001, "SANITY FAILED"

# --- (a) LR CALIBRATED (Platt/sigmoid, cv=3) at 0.10 ---
cal_lr = CalibratedClassifierCV(
    estimator=Pipeline([("scaler", StandardScaler()),
                        ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))]),
    method="sigmoid", cv=3)
cal_lr.fit(X_train, y_train)
lr_cal_proba = cal_lr.predict_proba(X_test)[:, 1]
lr_cal_eco = threshold_economics(y_test, lr_cal_proba, test_limit, THR)
lr_cal_roc = r4(roc_auc_score(y_test, lr_cal_proba))
out["m8_lr_calibrated_thr010"] = {
    "model": "LR terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3, "
             "estimator = Pipeline StandardScaler + LogisticRegression)",
    "threshold": THR,
    "roc_auc": lr_cal_roc,
    "n_approved": lr_cal_eco["n_approved"],
    "approval_rate": lr_cal_eco["approval_rate"],
    "bad_rate_approved": lr_cal_eco["bad_rate_approved"],
    "realised_profit_NT": lr_cal_eco["realised_profit_NT"],
    "realised_loss_NT": lr_cal_eco["realised_loss_NT"],
    "net_profit_realised_NT": lr_cal_eco["net_profit_realised_NT"],
    "total_cost_NT": lr_cal_eco["total_cost_NT"],
    "lesson_claim_n_approved": 1166,
    "note": "M8.4 M3: the lesson claimed 1.166 approvals for calibrated LR "
            "at 0.10. Compare n_approved above with the claim. Economics "
            "(bad rate / profit) decide whether calibration explains the "
            "challenger gap -- not the approval count alone.",
}
print("\n== (a) LR calibrated (Platt, cv=3) at 0.10 ==")
print(f"  n_approved={lr_cal_eco['n_approved']} (lesson claims 1.166) | "
      f"approval={lr_cal_eco['approval_rate']} bad={lr_cal_eco['bad_rate_approved']} "
      f"profit={lr_cal_eco['net_profit_realised_NT']:,} cost={lr_cal_eco['total_cost_NT']:,} "
      f"ROC={lr_cal_roc}")

# --- (b) approve-all REALISED loss ---
default_mask = y_test_arr == 1
realised_loss_all = float((LGD * test_limit[default_mask]).sum())
expected_loss_all = 78675378  # m8_tiering.expected_loss_all_test_NT
out["m8_approve_all_realised_loss"] = {
    "n_default_test": int(default_mask.sum()),
    "sum_limit_default_test_NT": int(test_limit[default_mask].sum()),
    "realised_loss_all_test_NT": int(realised_loss_all),
    "lesson_claim_NT": 82155456,
    "expected_loss_all_test_NT_m8_tiering": expected_loss_all,
    "note": "M8.4 S6: realised loss if EVERY test applicant is approved "
            "(sum LIMIT_BAL of default rows x LGD 0.45). This is NOT the "
            "expected loss 78.675.378 (sum of calibrated proba x LGD x "
            "LIMIT over all test rows).",
}
print("\n== (b) approve-all realised loss ==")
print(f"  n_default={int(default_mask.sum())} sum_limit_default="
      f"NT${int(test_limit[default_mask].sum()):,} realised_loss="
      f"NT${int(realised_loss_all):,} (lesson claims 82.155.456)")

# --- (c) mean calibrated GBM proba on test (M8.4 S1: 0.2217?) ---
mean_cal = float(cal_proba.mean())
mean_raw_gbm = float(gbm0.predict_proba(X_test)[:, 1].mean())
out["m8_mean_scores_test"] = {
    "mean_calibrated_gbm_proba": r4(mean_cal),
    "mean_raw_gbm_proba": r4(mean_raw_gbm),
    "test_base_rate": r4(float(y_test_arr.mean())),
    "lesson_claim_mean_calibrated": 0.2217,
    "note": "M8.4 S1: 0.2217 is the MEAN CALIBRATED PROBA on test, not the "
            "base rate (0.2212). Mean predicted proba != base rate; cite as "
            "'mean calibrated proba [notebook]' wherever used.",
}
print("\n== (c) mean scores on test ==")
print(f"  mean cal proba={r4(mean_cal)} (lesson claims 0.2217) | mean raw GBM="
      f"{r4(mean_raw_gbm)} | base rate={r4(float(y_test_arr.mean()))}")

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s")

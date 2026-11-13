#!/usr/bin/env python3
"""M7 gate fix — approval GBM mentah vs terkalibrasi pada threshold tetap 0,10.

Latar: concept gate ronde fill M7 (run 3) menemukan klaim di M7.2 Q? why
"Model mentah vs terkalibrasi hampir tidak mengubah approval (ROC-AUC
0,7823 vs 0,7816)" TIDAK TERBUKTI — ROC-AUC mengukur ranking (invarian
terhadap kalibrasi monoton), bukan approval pada threshold tetap. Skrip ini
menghitung ulang approval kedua varian dari data dengan pipeline flagship
yang sama seperti qa-learn/m7_calc_m72.py (split stratified 80/20 seed 42,
31 fitur, HGB default, CalibratedClassifierCV cv=3 sigmoid) lalu merge
kunci m7g_raw_vs_cal_approval ke qa-learn/m7_canonical.json.

Jalankan: python3 qa-learn/m7g_raw_vs_cal_calc.py
"""
import json
from pathlib import Path

import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent.parent
SEED = 42
PAY_COLS = ["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6"]
BILL_COLS = [f"BILL_AMT{i}" for i in range(1, 7)]
PAY_AMT_COLS = [f"PAY_AMT{i}" for i in range(1, 7)]


def add_features(data):
    outd = data.copy()
    outd["PAY_MEAN"] = outd[PAY_COLS].mean(axis=1)
    outd["PAY_MAX"] = outd[PAY_COLS].max(axis=1)
    outd["PAY_DELAY_COUNT"] = (outd[PAY_COLS] > 0).sum(axis=1)
    outd["UTILIZATION"] = (outd["BILL_AMT1"] / outd["LIMIT_BAL"]).clip(0, 5)
    ratio = outd["PAY_AMT1"] / (outd["BILL_AMT1"] + 1)
    outd["PAY_RATIO"] = ratio.replace([float("inf"), float("-inf")], 2).fillna(0).clip(0, 2)
    outd["BILL_MEAN"] = outd[BILL_COLS].mean(axis=1)
    outd["PAY_AMT_MEAN"] = outd[PAY_AMT_COLS].mean(axis=1)
    outd["BILL_TREND"] = outd["BILL_AMT1"] - outd["BILL_AMT6"]
    return outd


def main():
    df = pd.read_excel(ROOT / "data" / "uci_default_credit.xls", header=1)
    df = df.rename(columns={"default payment next month": "default"})
    X_raw = df.drop(columns=["ID", "default"])
    y = df["default"]
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X_raw, y, test_size=0.20, stratify=y, random_state=SEED)
    X_train = add_features(X_train_raw)
    X_test = add_features(X_test_raw)
    gbm0 = HistGradientBoostingClassifier(random_state=SEED)
    gbm0.fit(X_train, y_train)
    p_raw = gbm0.predict_proba(X_test)[:, 1]
    cal = CalibratedClassifierCV(
        estimator=HistGradientBoostingClassifier(random_state=SEED),
        method="sigmoid", cv=3)
    cal.fit(X_train, y_train)
    p_cal = cal.predict_proba(X_test)[:, 1]
    # sanity vs kanonik (harus cocok persis)
    assert round(float(roc_auc_score(y_test, p_raw)), 4) == 0.7823
    assert round(float(roc_auc_score(y_test, p_cal)), 4) == 0.7816
    sex = X_test["SEX"].values
    t = 0.10
    appr_raw = float((p_raw < t).mean())
    appr_cal = float((p_cal < t).mean())
    male_raw = float((p_raw[sex == 1] < t).mean())
    male_cal = float((p_cal[sex == 1] < t).mean())
    female_raw = float((p_raw[sex == 2] < t).mean())
    female_cal = float((p_cal[sex == 2] < t).mean())
    key = {
        "threshold": t,
        "approval_raw": round(appr_raw, 4),
        "approval_n_raw": int((p_raw < t).sum()),
        "approval_cal": round(appr_cal, 4),
        "approval_n_cal": int((p_cal < t).sum()),
        "diff_pp": round((appr_cal - appr_raw) * 100, 2),
        "male_raw": round(male_raw, 4),
        "male_cal": round(male_cal, 4),
        "female_raw": round(female_raw, 4),
        "female_cal": round(female_cal, 4),
        "air_raw": round(male_raw / female_raw, 4),
        "air_cal": round(male_cal / female_cal, 4),
        "roc_auc_raw": 0.7823,
        "roc_auc_cal": 0.7816,
    }
    print(json.dumps(key, indent=2))
    canon_path = ROOT / "qa-learn" / "m7_canonical.json"
    canon = json.loads(canon_path.read_text(encoding="utf-8"))
    canon["m7g_raw_vs_cal_approval"] = key
    canon_path.write_text(json.dumps(canon, indent=2, ensure_ascii=False),
                          encoding="utf-8")
    print(f"merged m7g_raw_vs_cal_approval; kanonik kini {len(canon)} kunci")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Counterfactual nyata untuk nasabah 858 (G9, M7.3).

Reproduksi pipeline flagship (split stratified 80/20 seed 42, 31 fitur,
LR + GBM + GBM terkalibrasi Platt/sigmoid), lalu hitung dua counterfactual
MODEL — 'seandainya enam bulan terakhir dibayar tepat waktu' — dengan
mengubah kolom mentah PAY_0..6 (dan PAY_AMT) lalu menghitung ulang fitur
turunan via add_features yang SAMA dengan build M7.

CF-A: PAY_0..6 = -1 (dibayar tepat waktu), PAY_AMT tetap 0.
CF-B: PAY_0..6 = -1 DAN PAY_AMT1..6 = BILL_AMT (dibayar penuh tiap bulan).
Kedua skenario adalah what-if atas MODEL (masa lalu yang berbeda),
BUKAN rencana aksi — nasabah tidak bisa mengubah riwayatnya.
Tulis hasil ke qa-learn/m7_gap_fill_numbers.json (kunci m7g9_counterfactual_858).
"""
import json
import time

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
DATA_XLS = "data/uci_default_credit.xls"
THR = 0.10
t0 = time.time()

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


df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
X_raw = df.drop(columns=["ID", "default"])
y = df["default"]
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.20, stratify=y, random_state=SEED)
X_train = add_features(X_train_raw)
X_test = add_features(X_test_raw)

lr0 = Pipeline([("scaler", StandardScaler()),
                ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))])
lr0.fit(X_train, y_train)
gbm0 = HistGradientBoostingClassifier(random_state=SEED)
gbm0.fit(X_train, y_train)
cal_gbm = CalibratedClassifierCV(estimator=HistGradientBoostingClassifier(random_state=SEED),
                                 method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)

row = X_test_raw.iloc[[858]].copy()  # nasabah 858 = test positional index 858
assert int(row["SEX"].iloc[0]) == 2 and int(row["AGE"].iloc[0]) == 32
assert [int(v) for v in row[PAY_COLS].iloc[0]] == [3, 2, 2, 7, 7, 7]
base = add_features(row)
out = {
    "test_positional_index": 858,
    "baseline": {
        "lr_proba": r4(lr0.predict_proba(base)[:, 1][0]),
        "gbm_proba": r4(gbm0.predict_proba(base)[:, 1][0]),
        "cal_gbm_proba": r4(cal_gbm.predict_proba(base)[:, 1][0]),
        "decision_thr_0.10": "ditolak (proba >= 0,10)",
    },
}


def counterfactual(modify_fn, label):
    cf = X_test_raw.iloc[[858]].copy()
    modify_fn(cf)
    cf_f = add_features(cf)
    res = {
        "label": label,
        "pay_cols_after": [int(v) for v in cf[PAY_COLS].iloc[0]],
        "pay_max_after": int(cf_f["PAY_MAX"].iloc[0]),
        "pay_delay_count_after": int(cf_f["PAY_DELAY_COUNT"].iloc[0]),
        "pay_mean_after": r4(cf_f["PAY_MEAN"].iloc[0]),
        "lr_proba": r4(lr0.predict_proba(cf_f)[:, 1][0]),
        "gbm_proba": r4(gbm0.predict_proba(cf_f)[:, 1][0]),
        "cal_gbm_proba": r4(cal_gbm.predict_proba(cf_f)[:, 1][0]),
    }
    res["decision_thr_0.10"] = ("disetujui (proba < 0,10)" if res["cal_gbm_proba"] < THR
                                else "tetap ditolak (proba >= 0,10)")
    return res


out["cf_a_pay_on_time_only"] = counterfactual(
    lambda cf: cf.__setitem__(PAY_COLS, -1),
    "PAY_0..6 = -1 (tepat waktu), PAY_AMT tetap 0")


def cf_b(cf):
    cf[PAY_COLS] = -1
    for amt, bill in zip(PAY_AMT_COLS, BILL_COLS):
        cf[amt] = cf[bill]


out["cf_b_pay_on_time_and_full"] = counterfactual(
    cf_b, "PAY_0..6 = -1 DAN PAY_AMT1..6 = BILL_AMT (dibayar penuh)")
out["note"] = ("Counterfactual MODEL: what-if atas masa lalu yang berbeda, "
               "bukan rencana aksi — nasabah tidak bisa mengubah riwayat "
               "PAY_0..6. PAY_AMT tetap 0 pada CF-A walau PAY=-1 (kombinasi "
               "yang ada di data mentah, bukan skenario realistis penuh); "
               "CF-B menambahkan pembayaran penuh tiap bulan.")
out["runtime_seconds"] = round(time.time() - t0, 1)
print(json.dumps(out, indent=2, ensure_ascii=False))

# merge into gap-fill numbers (canonical merge dilakukan koordinator)
gf = json.load(open("qa-learn/m7_gap_fill_numbers.json"))
gf["m7g9_counterfactual_858"] = out
json.dump(gf, open("qa-learn/m7_gap_fill_numbers.json", "w"), ensure_ascii=False, indent=2)
print(f"\nMERGED m7g9_counterfactual_858 into m7_gap_fill_numbers.json in {out['runtime_seconds']}s")

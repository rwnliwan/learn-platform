"""Canonical numbers for MLF M7.5 (Monitoring & drift).

Deterministic: seed 42 everywhere; data = data/uci_default_credit.xls
(UCI Default of Credit Card Clients, 30.000 rows).
Pipeline REPLICATES the flagship notebook
~/workspace/guided-projects/ml-finance-credit-scoring/credit-scoring-end-to-end.ipynb
exactly: same add_features(), same stratified 80/20 split (test 6.000,
random_state=42), GBM = HistGradientBoostingClassifier(random_state=42)
defaults, decision model = GBM calibrated Platt/sigmoid
(CalibratedClassifierCV cv=3), threshold 0.10, LGD 0.45, MARGIN 0.05.

Locked numbers (verbatim, NOT recomputed with another definition):
  GBM test ROC-AUC 0.7823 / PR-AUC 0.5597; threshold 0.10; M2 G9 PSI 0.0104.

What this script computes (all from the data):
  (a) PSI per key feature, train vs test, decile bins from TRAIN quantiles
      (value bins for low-cardinality discrete features).
  (b) PSI of the predicted score (calibrated GBM proba), train vs test,
      and PSI of the raw GBM proba.
  (c) Population stability over PSEUDO-TIME: test ordered by ID (row order,
      NOT a real date) split into 5 sequential chunks of 1.200; per chunk
      ROC-AUC / PR-AUC / approval rate / bad rate at threshold 0.10, and
      PSI of key features + score between chunk 1 and chunk 5.
  (d) DRIFT SIMULATIONS [simulasi] with explicit parameters:
      S1 "limit naik": LIMIT_BAL x1.30 on test, derived features recomputed;
      S2 "keterlambatan naik": PAY_0..PAY_6 +1 (capped at 8) on test,
      derived features recomputed. Both rescored with the frozen model;
      PSI of score + metrics reported.
  (e) Baseline monitoring table: score mean/share, approval/bad rate,
      ECE (10-bin) on train vs test for the calibrated model.

Run: python3 qa-learn/m7_calc_m75.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_calc_m75_output.json (human-readable numbers for the
lesson + notebook; the coordinator consolidates into m7_canonical.json)
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
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m7_calc_m75_output.json"
LGD = 0.45
MARGIN = 0.05
THRESHOLD = 0.10
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} numpy={np.__version__} "
      f"pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "sklearn": sklearn.__version__,
               "numpy": np.__version__, "pandas": pd.__version__,
               "data": DATA_XLS, "threshold": THRESHOLD, "lgd": LGD,
               "margin": MARGIN,
               "locked": {"gbm_test_roc_auc": 0.7823, "gbm_test_pr_auc": 0.5597,
                          "threshold": 0.10, "m2_g9_psi": 0.0104},
               "note": ("Pseudo-time = ID order, NOT a real date: UCI is one "
                        "snapshot. Simulations S1/S2 are labelled [simulasi].")}


def r4(x):
    return round(float(x), 4)


# ---------------------------------------------------------------- load + features (flagship replica)
df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
print(f"data: {df.shape}, base rate={df['default'].mean():.4f}")
out["data_n"] = 30000
out["data_base_rate"] = r4(df["default"].mean())

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
print(f"train {X_train.shape} test {X_test.shape}")
out["train_n"] = int(len(X_train))
out["test_n"] = int(len(X_test))
out["train_base_rate"] = r4(y_train.mean())
out["test_base_rate"] = r4(y_test.mean())

# ---------------------------------------------------------------- flagship repro (locked-number check)
gbm0 = HistGradientBoostingClassifier(random_state=SEED)
gbm0.fit(X_train, y_train)
gbm_proba_test = gbm0.predict_proba(X_test)[:, 1]
gbm_proba_train = gbm0.predict_proba(X_train)[:, 1]
cal_gbm = CalibratedClassifierCV(estimator=HistGradientBoostingClassifier(random_state=SEED),
                                 method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba_test = cal_gbm.predict_proba(X_test)[:, 1]
cal_proba_train = cal_gbm.predict_proba(X_train)[:, 1]
repro = {
    "gbm_test_roc_auc": r4(roc_auc_score(y_test, gbm_proba_test)),
    "gbm_test_pr_auc": r4(average_precision_score(y_test, gbm_proba_test)),
    "gbm_test_brier": r4(brier_score_loss(y_test, gbm_proba_test)),
    "cal_test_roc_auc": r4(roc_auc_score(y_test, cal_proba_test)),
    "cal_test_pr_auc": r4(average_precision_score(y_test, cal_proba_test)),
    "cal_test_brier": r4(brier_score_loss(y_test, cal_proba_test)),
}
repro["diff_vs_locked"] = {
    "gbm_test_roc_auc": r4(repro["gbm_test_roc_auc"] - 0.7823),
    "gbm_test_pr_auc": r4(repro["gbm_test_pr_auc"] - 0.5597)}
out["repro_flagship"] = repro
print("repro:", repro)

# ---------------------------------------------------------------- PSI helpers
EPS = 1e-4  # floor for empty-bin shares (standard PSI practice, stated here)


def psi_from_shares(expected, actual):
    """expected/actual: arrays of bin shares summing to 1."""
    expected = np.asarray(expected, dtype=float)
    actual = np.asarray(actual, dtype=float)
    expected = np.clip(expected, EPS, None)
    actual = np.clip(actual, EPS, None)
    expected = expected / expected.sum()
    actual = actual / actual.sum()
    terms = (actual - expected) * np.log(actual / expected)
    return float(terms.sum()), [round(float(v), 4) for v in terms]


def psi_quantile(expected_s, actual_s, n_bins=10):
    """Decile bins from EXPECTED (train) quantiles; returns (psi, edges, terms)."""
    qs = np.linspace(0, 1, n_bins + 1)
    edges = np.unique(np.quantile(expected_s, qs))
    if len(edges) < 3:
        return None
    e_counts, _ = np.histogram(expected_s, bins=edges)
    a_counts, _ = np.histogram(actual_s, bins=edges)
    # last edge inclusive: np.histogram already includes the rightmost edge
    psi, terms = psi_from_shares(e_counts / e_counts.sum(),
                                 a_counts / a_counts.sum())
    return {"psi": r4(psi), "n_bins": int(len(edges) - 1),
            "edges": [round(float(v), 4) for v in edges],
            "expected_share": [r4(v) for v in (e_counts / e_counts.sum())],
            "actual_share": [r4(v) for v in (a_counts / a_counts.sum())],
            "terms": terms}


def psi_value_bins(expected_s, actual_s):
    """One bin per distinct value (low-cardinality discrete features)."""
    vals = sorted(set(np.unique(expected_s)) | set(np.unique(actual_s)))
    e_counts = np.array([(expected_s == v).sum() for v in vals], dtype=float)
    a_counts = np.array([(actual_s == v).sum() for v in vals], dtype=float)
    psi, terms = psi_from_shares(e_counts / e_counts.sum(),
                                 a_counts / a_counts.sum())
    return {"psi": r4(psi), "n_bins": int(len(vals)),
            "values": [int(v) if float(v) == int(v) else round(float(v), 4) for v in vals],
            "expected_share": [r4(v) for v in (e_counts / e_counts.sum())],
            "actual_share": [r4(v) for v in (a_counts / a_counts.sum())],
            "terms": terms}


def psi_feature(expected_s, actual_s, n_bins=10):
    expected_s = np.asarray(expected_s, dtype=float)
    actual_s = np.asarray(actual_s, dtype=float)
    n_unique = len(np.unique(expected_s))
    if n_unique <= 10:
        d = psi_value_bins(expected_s, actual_s)
        d["method"] = "value_bins"
        return d
    d = psi_quantile(expected_s, actual_s, n_bins=n_bins)
    if d is None:
        d = psi_value_bins(expected_s, actual_s)
        d["method"] = "value_bins_fallback"
    else:
        d["method"] = "quantile_deciles_from_train"
    return d


def psi_band(psi):
    if psi < 0.1:
        return "stabil"
    if psi <= 0.25:
        return "waspada"
    return "geser besar"


def ece_score(y_true, y_proba, n_bins=10):
    y_true = np.asarray(y_true)
    y_proba = np.asarray(y_proba)
    edges = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    for i in range(n_bins):
        m = (y_proba >= edges[i]) & (y_proba < edges[i + 1] if i < n_bins - 1
                                     else y_proba <= edges[i + 1])
        n_b = int(m.sum())
        if n_b == 0:
            continue
        ece += (n_b / len(y_true)) * abs(float(y_proba[m].mean()) - float(y_true[m].mean()))
    return r4(ece)


def period_metrics(y_true, proba, limit):
    y_true = np.asarray(y_true)
    proba = np.asarray(proba)
    approved = proba < THRESHOLD
    n_app = int(approved.sum())
    return {
        "n": int(len(y_true)),
        "base_rate": r4(y_true.mean()),
        "roc_auc": r4(roc_auc_score(y_true, proba)) if len(np.unique(y_true)) > 1 else None,
        "pr_auc": r4(average_precision_score(y_true, proba)),
        "brier": r4(brier_score_loss(y_true, proba)),
        "ece_10bin": ece_score(y_true, proba),
        "mean_score": r4(proba.mean()),
        "approval_rate": r4(approved.mean()),
        "bad_rate_approved": r4(y_true[approved].mean()) if n_app else None,
        "n_approved": n_app,
    }


# ---------------------------------------------------------------- (a) PSI per key feature, train vs test
KEY_FEATURES = ["LIMIT_BAL", "AGE", "BILL_AMT1", "PAY_AMT1", "UTILIZATION",
                "PAY_MEAN", "PAY_MAX", "PAY_DELAY_COUNT", "BILL_MEAN",
                "PAY_AMT_MEAN", "PAY_RATIO", "BILL_TREND", "SEX", "EDUCATION",
                "MARRIAGE", "PAY_0"]
psi_features = {}
for f in KEY_FEATURES:
    d = psi_feature(X_train[f].values, X_test[f].values)
    d["band"] = psi_band(d["psi"])
    d["train_mean"] = r4(X_train[f].mean())
    d["test_mean"] = r4(X_test[f].mean())
    psi_features[f] = d
    print(f"PSI {f}: {d['psi']} ({d['band']}, {d['method']}, bins={d['n_bins']})")
out["psi_features_train_vs_test"] = psi_features
out["psi_features_max"] = max(psi_features.items(), key=lambda kv: kv[1]["psi"])[0]
out["psi_features_max_value"] = max(v["psi"] for v in psi_features.values())
out["psi_features_n_stabil"] = int(sum(1 for v in psi_features.values() if v["band"] == "stabil"))
out["psi_features_n_waspada"] = int(sum(1 for v in psi_features.values() if v["band"] == "waspada"))
out["psi_features_n_geser_besar"] = int(sum(1 for v in psi_features.values() if v["band"] == "geser besar"))

# ---------------------------------------------------------------- (b) PSI of the predicted score, train vs test
psi_score_cal = psi_feature(cal_proba_train, cal_proba_test)
psi_score_cal["band"] = psi_band(psi_score_cal["psi"])
psi_score_raw = psi_feature(gbm_proba_train, gbm_proba_test)
psi_score_raw["band"] = psi_band(psi_score_raw["psi"])
out["psi_score_calibrated_train_vs_test"] = psi_score_cal
out["psi_score_raw_train_vs_test"] = psi_score_raw
print("PSI score calibrated:", psi_score_cal["psi"], psi_score_cal["band"])
print("PSI score raw:", psi_score_raw["psi"], psi_score_raw["band"])
out["baseline_monitoring"] = {
    "train": period_metrics(y_train, cal_proba_train, X_train["LIMIT_BAL"].values),
    "test": period_metrics(y_test, cal_proba_test, X_test["LIMIT_BAL"].values),
}
print("baseline train:", out["baseline_monitoring"]["train"])
print("baseline test:", out["baseline_monitoring"]["test"])

# ---------------------------------------------------------------- (c) pseudo-time: test ordered by ID, 5 chunks of 1.200
test_idx = X_test_raw.index  # original df index = ID order (ID column is 1..30000 in file order)
order = np.argsort(test_idx.values)
X_test_ord = X_test.iloc[order]
y_test_ord = y_test.iloc[order]
cal_proba_ord = cal_proba_test[order]
gbm_proba_ord = gbm_proba_test[order]
limit_ord = X_test_ord["LIMIT_BAL"].values
chunks = []
for k in range(5):
    sl = slice(k * 1200, (k + 1) * 1200)
    m = period_metrics(y_test_ord.values[sl], cal_proba_ord[sl], limit_ord[sl])
    m["chunk"] = k + 1
    m["id_range"] = [int(test_idx.values[order][k * 1200]),
                     int(test_idx.values[order][(k + 1) * 1200 - 1])]
    chunks.append(m)
    print(f"chunk {k+1} (ID {m['id_range']}):", m)
out["pseudo_time_chunks_test"] = chunks
out["pseudo_time_roc_range"] = [min(c["roc_auc"] for c in chunks),
                                max(c["roc_auc"] for c in chunks)]
out["pseudo_time_pr_range"] = [min(c["pr_auc"] for c in chunks),
                               max(c["pr_auc"] for c in chunks)]
out["pseudo_time_roc_spread"] = r4(max(c["roc_auc"] for c in chunks)
                                   - min(c["roc_auc"] for c in chunks))
out["pseudo_time_pr_spread"] = r4(max(c["pr_auc"] for c in chunks)
                                  - min(c["pr_auc"] for c in chunks))
# PSI chunk 1 vs chunk 5 (pseudo-time drift) for score + 3 key features
c1 = slice(0, 1200)
c5 = slice(4800, 6000)
psi_c1_c5 = {}
for name, a, b in [("score_calibrated", cal_proba_ord[c1], cal_proba_ord[c5]),
                   ("LIMIT_BAL", X_test_ord["LIMIT_BAL"].values[c1], X_test_ord["LIMIT_BAL"].values[c5]),
                   ("PAY_MEAN", X_test_ord["PAY_MEAN"].values[c1], X_test_ord["PAY_MEAN"].values[c5]),
                   ("UTILIZATION", X_test_ord["UTILIZATION"].values[c1], X_test_ord["UTILIZATION"].values[c5]),
                   ("BILL_AMT1", X_test_ord["BILL_AMT1"].values[c1], X_test_ord["BILL_AMT1"].values[c5])]:
    d = psi_feature(a, b)
    d["band"] = psi_band(d["psi"])
    psi_c1_c5[name] = d
    print(f"PSI chunk1 vs chunk5 {name}: {d['psi']} ({d['band']})")
out["psi_chunk1_vs_chunk5_pseudo_time"] = psi_c1_c5

# ---------------------------------------------------------------- (d) drift simulations [simulasi]
def simulate_limit_x130():
    raw = X_test_raw.copy()
    raw["LIMIT_BAL"] = raw["LIMIT_BAL"] * 1.30
    return add_features(raw)


def simulate_pay_plus1():
    raw = X_test_raw.copy()
    for c in PAY_COLS:
        raw[c] = (raw[c] + 1).clip(upper=8)
    return add_features(raw)


sims = {}
for name, fn, desc in [
        ("S1_limit_x1.30", simulate_limit_x130,
         "LIMIT_BAL x1.30 untuk semua baris test; fitur turunan dihitung ulang"),
        ("S2_pay_plus1", simulate_pay_plus1,
         "PAY_0..PAY_6 +1 (dibatasi maks 8) untuk semua baris test; fitur turunan dihitung ulang")]:
    Xs = fn()
    ps = cal_gbm.predict_proba(Xs)[:, 1]
    d = psi_feature(cal_proba_test, ps)
    d["band"] = psi_band(d["psi"])
    m = period_metrics(y_test, ps, Xs["LIMIT_BAL"].values)
    m["psi_score_vs_baseline_test"] = d["psi"]
    m["psi_score_band"] = d["band"]
    m["description"] = desc
    m["psi_score_detail"] = d
    sims[name] = m
    print(f"{name}: PSI skor {d['psi']} ({d['band']}), ROC-AUC {m['roc_auc']}, "
          f"PR-AUC {m['pr_auc']}, approval {m['approval_rate']}, bad {m['bad_rate_approved']}")
out["drift_simulations"] = sims
out["sim_baseline_test"] = period_metrics(y_test, cal_proba_test, X_test["LIMIT_BAL"].values)

# approval-rate / bad-rate deltas vs baseline for the alert table
base = out["sim_baseline_test"]
for name, m in sims.items():
    m["roc_auc_delta_vs_baseline"] = r4(m["roc_auc"] - base["roc_auc"])
    m["pr_auc_delta_vs_baseline"] = r4(m["pr_auc"] - base["pr_auc"])
    m["approval_delta_vs_baseline"] = r4(m["approval_rate"] - base["approval_rate"])
    m["bad_rate_delta_vs_baseline"] = r4(m["bad_rate_approved"] - base["bad_rate_approved"])

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s")
print("repro diffs vs locked:", repro["diff_vs_locked"])

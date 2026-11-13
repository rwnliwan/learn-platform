"""Canonical numbers for MLF M6 (Tuning & model selection).

Deterministic: seed 42 everywhere; data = ~/workspace/learn-platform/data/uci_default_credit.xls
(UCI Default of Credit Card Clients, 30.000 rows) + data/m4_prices.csv (BBCA/^GSPC,
simple returns) for the time-series split only.
Pipeline REPLICATES the flagship notebook
~/workspace/guided-projects/ml-finance-credit-scoring/credit-scoring-end-to-end.ipynb
exactly: same add_features(), same stratified 80/20 split (test 6.000, random_state=42),
LR = Pipeline(StandardScaler, LogisticRegression(max_iter=1000, random_state=42)),
GBM = HistGradientBoostingClassifier(random_state=42) defaults, calibration =
CalibratedClassifierCV(GBM, method='sigmoid', cv=3), LGD=0.45, MARGIN=0.05.

Flagship targets to reproduce (tolerance 0.001):
  LR  ROC-AUC 0.7426 / PR-AUC 0.5049 / Brier 0.1427
  GBM ROC-AUC 0.7823 / PR-AUC 0.5597 / Brier 0.1342
  GBM train ROC-AUC 0.8469 vs test 0.7823 (gap 0.0646)
  operating threshold 0.10 (cost-optimal on calibrated GBM, grid 0.05..0.90 step 0.05)

skopt (scikit-optimize) is NOT installed in this VM, so M6.1(e) is an honest
"shrinking random search" labelled as such -- NOT Bayesian optimisation.

Run: python3 qa-learn/m6_canonical_calc.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m6_canonical.json
"""
import json
import time

import numpy as np
import pandas as pd
import sklearn
import scipy
from scipy import stats
from scipy.stats import loguniform
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (average_precision_score, brier_score_loss,
                             confusion_matrix, roc_auc_score)
from sklearn.model_selection import (GridSearchCV, RandomizedSearchCV,
                                     StratifiedKFold, TimeSeriesSplit,
                                     cross_val_score, train_test_split)
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
RNG = np.random.default_rng(SEED)
DATA_XLS = "data/uci_default_credit.xls"
PRICES_CSV = "data/m4_prices.csv"
OUT_JSON = "qa-learn/m6_canonical.json"
LGD = 0.45
MARGIN = 0.05
t0 = time.time()
out = {}

print(f"versions: sklearn={sklearn.__version__} scipy={scipy.__version__} "
      f"numpy={np.__version__} pandas={pd.__version__} seed={SEED}")
out["meta"] = {"seed": SEED, "gbm_trees_param": "max_iter (HistGradientBoostingClassifier has no n_estimators; max_iter = number of boosting iterations/trees)", "sklearn": sklearn.__version__, "scipy": scipy.__version__,
               "numpy": np.__version__, "pandas": pd.__version__,
               "data": DATA_XLS, "prices": PRICES_CSV,
               "note": "skopt NOT installed; M6.1(e) is shrinking random search, labelled honestly."}
try:
    import skopt  # noqa
    out["meta"]["skopt"] = skopt.__version__
except ImportError:
    out["meta"]["skopt"] = None

# ---------------------------------------------------------------- load + features (flagship replica)
df = pd.read_excel(DATA_XLS, header=1)
df = df.rename(columns={"default payment next month": "default"})
assert df.shape == (30000, 25), df.shape
assert df["default"].isin([0, 1]).all()
print(f"data: {df.shape}, base rate={df['default'].mean():.4f}, defaults={int(df['default'].sum())}")
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
print(f"train {X_train.shape} test {X_test.shape} n_features={len(FEATURES)} "
      f"train base={y_train.mean():.4f} test base={y_test.mean():.4f}")
out["n_features"] = len(FEATURES)
out["train_n"] = int(len(X_train))
out["test_n"] = int(len(X_test))


def r4(x):
    return round(float(x), 4)


def lr_pipe(**kw):
    params = dict(max_iter=1000, random_state=SEED)
    params.update(kw)
    return Pipeline([("scaler", StandardScaler()),
                     ("logreg", LogisticRegression(**params))])


def gbm(**kw):
    params = dict(random_state=SEED)
    params.update(kw)
    return HistGradientBoostingClassifier(**params)


def portfolio_cost(y_true, y_proba, limit, threshold, lgd=LGD, margin=MARGIN):
    y_arr = np.asarray(y_true)
    limit_arr = np.asarray(limit, dtype=float)
    pred_default = np.asarray(y_proba) >= threshold
    fn_cost = ((y_arr == 1) & (~pred_default)) * lgd * limit_arr
    fp_cost = ((y_arr == 0) & (pred_default)) * margin * limit_arr
    return float(fn_cost.sum() + fp_cost.sum())


def ece_score(y_true, y_proba, n_bins=10):
    y_true = np.asarray(y_true)
    y_proba = np.asarray(y_proba)
    edges = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    bins = []
    for i in range(n_bins):
        m = (y_proba >= edges[i]) & (y_proba < edges[i + 1] if i < n_bins - 1 else y_proba <= edges[i + 1])
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


def mcnemar(y_true, pred_a, pred_b):
    """pred_* are 0/1 predictions. b = A right & B wrong; c = A wrong & B right."""
    a_right = (pred_a == np.asarray(y_true))
    b_right = (pred_b == np.asarray(y_true))
    b = int((a_right & ~b_right).sum())
    c = int((~a_right & b_right).sum())
    n_disc = b + c
    chi2 = float((abs(b - c) - 1) ** 2 / n_disc) if n_disc else 0.0
    p = float(stats.chi2.sf(chi2, 1)) if n_disc else 1.0
    # exact two-sided binomial p on the discordant pairs
    p_exact = float(stats.binomtest(min(b, c), n_disc, 0.5, alternative="two-sided").pvalue) if n_disc else 1.0
    return {"b": b, "c": c, "n_discordant": n_disc, "chi2_cc": r4(chi2),
            "p_value": r4(p), "p_exact_binomial": r4(p_exact)}

# ---------------------------------------------------------------- flagship reproduction check
print("\n== REPRO flagship ==")
lr_pipe0 = lr_pipe()
lr_pipe0.fit(X_train, y_train)
lr_proba = lr_pipe0.predict_proba(X_test)[:, 1]
gbm0 = gbm()
gbm0.fit(X_train, y_train)
gbm_proba = gbm0.predict_proba(X_test)[:, 1]
gbm_train_proba = gbm0.predict_proba(X_train)[:, 1]
lr_train_proba = lr_pipe0.predict_proba(X_train)[:, 1]
repro = {
    "lr_roc_auc": r4(roc_auc_score(y_test, lr_proba)),
    "lr_pr_auc": r4(average_precision_score(y_test, lr_proba)),
    "lr_brier": r4(brier_score_loss(y_test, lr_proba)),
    "gbm_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
    "gbm_pr_auc": r4(average_precision_score(y_test, gbm_proba)),
    "gbm_brier": r4(brier_score_loss(y_test, gbm_proba)),
    "gbm_train_roc_auc": r4(roc_auc_score(y_train, gbm_train_proba)),
    "gbm_test_roc_auc": r4(roc_auc_score(y_test, gbm_proba)),
    "gbm_train_test_gap": r4(roc_auc_score(y_train, gbm_train_proba) - roc_auc_score(y_test, gbm_proba)),
    "lr_train_roc_auc": r4(roc_auc_score(y_train, lr_train_proba)),
}
targets = {"lr_roc_auc": 0.7426, "lr_pr_auc": 0.5049, "lr_brier": 0.1427,
           "gbm_roc_auc": 0.7823, "gbm_pr_auc": 0.5597, "gbm_brier": 0.1342,
           "gbm_train_roc_auc": 0.8469, "gbm_train_test_gap": 0.0646}
repro["targets"] = targets
repro["diffs"] = {k: r4(repro[k] - v) for k, v in targets.items()}
repro["all_within_0.001"] = bool(all(abs(repro["diffs"][k]) <= 0.001 for k in targets))
out["repro_flagship"] = repro
print(repro)
print("ALL WITHIN 0.001:", repro["all_within_0.001"])

# calibrated GBM (flagship) -- reused in M6.4
cal_gbm = CalibratedClassifierCV(estimator=gbm(), method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]

# ---------------------------------------------------------------- M6.1 tuning
print("\n== M6.1 tuning ==")
cv3 = StratifiedKFold(5, shuffle=True, random_state=SEED)  # 5-fold on train for LR grid
# (a) LR grid over C -- 5-fold CV on TRAIN
C_GRID = [0.01, 0.1, 1, 10, 100]
lr_grid_rows = []
for C in C_GRID:
    s = cross_val_score(lr_pipe(C=C), X_train, y_train, cv=cv3, scoring="roc_auc", n_jobs=-1)
    m = lr_pipe(C=C)
    m.fit(X_train, y_train)
    lr_grid_rows.append({"C": C, "cv_roc_auc_mean": r4(s.mean()), "cv_roc_auc_sd": r4(s.std()),
                         "cv_folds": [r4(v) for v in s],
                         "test_roc_auc": r4(roc_auc_score(y_test, m.predict_proba(X_test)[:, 1]))})
best_lr_row = max(lr_grid_rows, key=lambda r: r["cv_roc_auc_mean"])
out["m61_lr_C_grid"] = lr_grid_rows
out["m61_lr_best_C"] = best_lr_row["C"]
out["m61_lr_best_cv_roc_auc"] = best_lr_row["cv_roc_auc_mean"]
print("LR C grid:", [(r["C"], r["cv_roc_auc_mean"]) for r in lr_grid_rows], "best C:", best_lr_row["C"])

# (b) GBM grid -- 3-fold CV on train, 18 configs
gbm_param_grid = {"max_iter": [50, 100, 200], "max_depth": [None, 3, 5],
                  "learning_rate": [0.05, 0.1]}
gs = GridSearchCV(gbm(), gbm_param_grid, cv=3, scoring="roc_auc", n_jobs=-1)
gs.fit(X_train, y_train)
grid_rows = []
for params, mean in zip(gs.cv_results_["params"], gs.cv_results_["mean_test_score"]):
    grid_rows.append({"max_iter": params["max_iter"],
                      "max_depth": params["max_depth"],
                      "learning_rate": params["learning_rate"],
                      "cv_roc_auc_mean": r4(mean)})
grid_rows.sort(key=lambda r: -r["cv_roc_auc_mean"])
best_grid = grid_rows[0]
out["m61_gbm_grid_top3"] = grid_rows[:3]
out["m61_gbm_grid_all"] = grid_rows
out["m61_gbm_grid_best"] = best_grid
out["m61_gbm_grid_n_configs"] = len(grid_rows)
out["m61_gbm_grid_n_fits"] = len(grid_rows) * 3
print("GBM grid top3:", grid_rows[:3])

# (c) random search -- SAME budget: 27 configs, 3-fold CV on train
rs_dist = {"max_iter": [50, 100, 150, 200, 300],
           "max_depth": [None, 2, 3, 5, 8],
           "learning_rate": loguniform(0.03, 0.20)}
rs = RandomizedSearchCV(gbm(), rs_dist, n_iter=27, cv=3, scoring="roc_auc",
                        n_jobs=-1, random_state=SEED)
rs.fit(X_train, y_train)
rs_rows = []
for params, mean in zip(rs.cv_results_["params"], rs.cv_results_["mean_test_score"]):
    rs_rows.append({"max_iter": int(params["max_iter"]),
                    "max_depth": params["max_depth"],
                    "learning_rate": r4(params["learning_rate"]),
                    "cv_roc_auc_mean": r4(mean)})
rs_rows.sort(key=lambda r: -r["cv_roc_auc_mean"])
best_rs = rs_rows[0]
n_beat_grid = int(sum(1 for r in rs_rows if r["cv_roc_auc_mean"] > best_grid["cv_roc_auc_mean"]))
out["m61_random_best"] = best_rs
out["m61_random_n_beat_grid_best"] = n_beat_grid
out["m61_random_top3"] = rs_rows[:3]
out["m61_random_n_configs"] = 27
out["m61_random_n_fits"] = 27 * 3
# (S1, review DeepSeek M6.1 2026-11-13): distribusi learning_rate yang
# BENAR-BENAR dipakai random search — loguniform(0.03, 0.20) di rs_dist.
out["m61_random_lr_dist"] = {"distribution": "loguniform", "low": 0.03,
                             "high": 0.20}
print("random best:", best_rs, "| configs beating grid best:", n_beat_grid)

# (d) effort table
out["m61_effort"] = [
    {"method": "grid_search_gbm", "n_configs": 18, "n_fits_cv3": 54,
     "best_cv_roc_auc": best_grid["cv_roc_auc_mean"]},
    {"method": "random_search_gbm", "n_configs": 27, "n_fits_cv3": 81,
     "best_cv_roc_auc": best_rs["cv_roc_auc_mean"]},
    {"method": "lr_C_grid", "n_configs": 5, "n_fits_cv5": 25,
     "best_cv_roc_auc": best_lr_row["cv_roc_auc_mean"]},
]

# (e) shrinking random search (NOT Bayesian -- skopt absent), 9 configs near random-search best
bl = best_rs["learning_rate"]
n_near = sorted(set([max(50, best_rs["max_iter"] - 50), best_rs["max_iter"],
                     min(300, best_rs["max_iter"] + 50), min(300, best_rs["max_iter"] + 100)]))
d_near = sorted(set([best_rs["max_depth"], 3, 5, None]), key=lambda v: (-1 if v is None else v))
lr_near = sorted(set([round(float(v), 4) for v in
                      [bl * 0.7, bl, bl * 1.4] if 0.02 <= v <= 0.25]))
shrink_params = []
rng_s = np.random.default_rng(SEED + 1)
for _ in range(9):
    shrink_params.append({"max_iter": int(rng_s.choice(n_near)),
                          "max_depth": (None if rng_s.random() < 0.25 else int(rng_s.choice([d for d in d_near if d is not None] or [3]))),
                          "learning_rate": float(rng_s.choice(lr_near))})
shrink_rows = []
for p in shrink_params:
    s = cross_val_score(gbm(**p), X_train, y_train, cv=3, scoring="roc_auc", n_jobs=-1)
    shrink_rows.append({**p, "cv_roc_auc_mean": r4(s.mean())})
shrink_rows.sort(key=lambda r: -r["cv_roc_auc_mean"])
out["m61_shrinking_random_search"] = {
    "method": "shrinking random search (9 configs sampled around random-search best; NOT Bayesian optimisation -- scikit-optimize not installed)",
    "seed": SEED + 1,
    "best": shrink_rows[0], "top3": shrink_rows[:3],
    "beat_stage1_random_best": bool(shrink_rows[0]["cv_roc_auc_mean"] > best_rs["cv_roc_auc_mean"])}
print("shrinking best:", shrink_rows[0])

# tuned GBM = grid best, refit on full train (used in M6.4/M6.5)
best_gbm_params = {k: best_grid[k] for k in ("max_iter", "max_depth", "learning_rate")}
tuned_gbm = gbm(**best_gbm_params)
tuned_gbm.fit(X_train, y_train)
tuned_proba = tuned_gbm.predict_proba(X_test)[:, 1]
out["m61_gbm_tuned_test_roc_auc"] = r4(roc_auc_score(y_test, tuned_proba))
out["m61_gbm_tuned_test_pr_auc"] = r4(average_precision_score(y_test, tuned_proba))
out["m61_gbm_tuned_test_brier"] = r4(brier_score_loss(y_test, tuned_proba))
print("tuned GBM test ROC-AUC:", out["m61_gbm_tuned_test_roc_auc"])

# ---------------------------------------------------------------- M6.2 CV & nested
print("\n== M6.2 CV & nested ==")
cv5 = StratifiedKFold(5, shuffle=True, random_state=SEED)
lr_cv5 = cross_val_score(lr_pipe(), X_raw.pipe(add_features) if False else add_features(X_raw), y,
                         cv=cv5, scoring="roc_auc", n_jobs=-1)
X_full = add_features(X_raw)
gbm_cv5 = cross_val_score(gbm(), X_full, y, cv=cv5, scoring="roc_auc", n_jobs=-1)
out["m62_cv5_lr"] = {"folds": [r4(v) for v in lr_cv5], "mean": r4(lr_cv5.mean()), "sd": r4(lr_cv5.std())}
out["m62_cv5_gbm_default"] = {"folds": [r4(v) for v in gbm_cv5], "mean": r4(gbm_cv5.mean()), "sd": r4(gbm_cv5.std())}
print("CV5 LR:", out["m62_cv5_lr"], "\nCV5 GBM:", out["m62_cv5_gbm_default"])

# (b) nested CV for tuned GBM: outer 5-fold, inner 3-fold grid (18 configs)
outer = StratifiedKFold(5, shuffle=True, random_state=SEED)
inner = StratifiedKFold(3, shuffle=True, random_state=SEED)
nested_scores, nested_best = [], []
for fold, (tr, te) in enumerate(outer.split(X_full, y)):
    inner_gs = GridSearchCV(gbm(), gbm_param_grid, cv=inner, scoring="roc_auc", n_jobs=-1)
    inner_gs.fit(X_full.iloc[tr], y.iloc[tr])
    sc = roc_auc_score(y.iloc[te], inner_gs.predict_proba(X_full.iloc[te])[:, 1])
    nested_scores.append(sc)
    nested_best.append({k: inner_gs.best_params_[k] for k in ("max_iter", "max_depth", "learning_rate")})
    print(f"  nested outer fold {fold+1}: score={sc:.4f} best={inner_gs.best_params_}")
nested_scores = np.array(nested_scores)
out["m62_nested_gbm"] = {"outer_scores": [r4(v) for v in nested_scores],
                         "mean": r4(nested_scores.mean()), "sd": r4(nested_scores.std()),
                         "best_params_per_fold": nested_best,
                         "single_split_test_roc_auc": repro["gbm_roc_auc"],
                         "plain_cv5_gbm_default_mean": out["m62_cv5_gbm_default"]["mean"],
                         "optimism_single_split_minus_nested": r4(repro["gbm_roc_auc"] - nested_scores.mean())}
print("nested GBM mean:", out["m62_nested_gbm"]["mean"])

# nested CV for tuned LR (fair-protocol input for M6.5d)
nested_lr_scores = []
for tr, te in outer.split(X_full, y):
    gs_lr = GridSearchCV(lr_pipe(), {"logreg__C": C_GRID}, cv=inner, scoring="roc_auc", n_jobs=-1)
    gs_lr.fit(X_full.iloc[tr], y.iloc[tr])
    nested_lr_scores.append(roc_auc_score(y.iloc[te], gs_lr.predict_proba(X_full.iloc[te])[:, 1]))
nested_lr_scores = np.array(nested_lr_scores)
out["m62_nested_lr"] = {"outer_scores": [r4(v) for v in nested_lr_scores],
                        "mean": r4(nested_lr_scores.mean()), "sd": r4(nested_lr_scores.std())}
print("nested LR mean:", out["m62_nested_lr"]["mean"])

# (c) leakage demo: pick C by TEST directly vs by train-CV
test_by_C = {r["C"]: r["test_roc_auc"] for r in lr_grid_rows}
leak_C = max(test_by_C, key=test_by_C.get)
cv_C = best_lr_row["C"]
out["m62_leakage_lr"] = {
    "best_C_by_test": leak_C, "test_roc_auc_best_C_by_test": test_by_C[leak_C],
    "best_C_by_train_cv": cv_C, "test_roc_auc_best_C_by_train_cv": test_by_C[cv_C],
    "optimistic_bias": r4(test_by_C[leak_C] - test_by_C[cv_C]),
    "honest_cv_mean_best_C": best_lr_row["cv_roc_auc_mean"]}
# GBM leakage: best grid config chosen by test ROC-AUC vs by CV on the SAME test set (formula bias); single-split minus nested mean is a PROTOCOL difference, not the leakage bias
test_by_cfg = []
for r in grid_rows:
    m = gbm(max_iter=r["max_iter"], max_depth=r["max_depth"], learning_rate=r["learning_rate"])
    m.fit(X_train, y_train)
    test_by_cfg.append({**r, "test_roc_auc": r4(roc_auc_score(y_test, m.predict_proba(X_test)[:, 1]))})
best_by_test = max(test_by_cfg, key=lambda r: r["test_roc_auc"])
out["m62_leakage_gbm"] = {
    "best_config_by_test": {k: best_by_test[k] for k in ("max_iter", "max_depth", "learning_rate")},
    "test_roc_auc_best_by_test": best_by_test["test_roc_auc"],
    "nested_cv_mean_honest": out["m62_nested_gbm"]["mean"],
    "single_split_minus_nested": r4(best_by_test["test_roc_auc"] - out["m62_nested_gbm"]["mean"]),
    "cv_best_config_test_roc_auc": next(r["test_roc_auc"] for r in test_by_cfg
                                        if (r["max_iter"], r["max_depth"], r["learning_rate"]) ==
                                        (best_grid["max_iter"], best_grid["max_depth"], best_grid["learning_rate"])),
    "leakage_bias_formula": r4(best_by_test["test_roc_auc"] - next(r["test_roc_auc"] for r in test_by_cfg
                                        if (r["max_iter"], r["max_depth"], r["learning_rate"]) ==
                                        (best_grid["max_iter"], best_grid["max_depth"], best_grid["learning_rate"])))}
print("leakage LR:", out["m62_leakage_lr"], "\nleakage GBM:", out["m62_leakage_gbm"])

# (d) time-series split on M4 prices (simple returns, BBCA direction)
print("\n== M6.2(d) time-series split BBCA ==")
prices = pd.read_csv(PRICES_CSV, index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")
b_s = close["BBCA"].dropna().pct_change(fill_method=None).dropna()   # simple returns
g_s = close["GSPC"].dropna().pct_change(fill_method=None).dropna()
bbca_p = close["BBCA"].dropna()
feat = pd.DataFrame(index=b_s.index)
feat["lag1"] = b_s.shift(1)
feat["lag5_mean"] = b_s.shift(1).rolling(5).mean()
feat["vol20"] = b_s.shift(1).rolling(20).std()
feat["ma20_dist"] = (bbca_p / bbca_p.rolling(20).mean() - 1).shift(1)
feat["gspc_lag1"] = g_s.shift(1).reindex(b_s.index, method="ffill")
feat["target"] = (b_s.shift(-1) > 0).astype(int)
dfm = feat.dropna()
X_ts, y_ts = dfm.drop(columns=["target"]).values, dfm["target"].values
tscv = TimeSeriesSplit(n_splits=5)
ts_rows = []
for i, (tr, te) in enumerate(tscv.split(X_ts)):
    m = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000, random_state=SEED))
    m.fit(X_ts[tr], y_ts[tr])
    p = m.predict_proba(X_ts[te])[:, 1]
    pred = (p >= 0.5).astype(int)
    maj = 1 if y_ts[tr].mean() > 0.5 else 0
    ts_rows.append({"fold": i + 1, "train_n": int(len(tr)), "test_n": int(len(te)),
                    "roc_auc": r4(roc_auc_score(y_ts[te], p)),
                    "accuracy": r4((pred == y_ts[te]).mean()),
                    "naive_majority_accuracy": r4((np.full(len(te), maj) == y_ts[te]).mean())})
out["m62_timeseries_bbca"] = {"n": int(len(dfm)), "base_rate_up": r4(float(y_ts.mean())),
                              "n_simple_returns_bbca": int(len(b_s)),
                              "folds": ts_rows,
                              "mean_roc_auc": r4(np.mean([r["roc_auc"] for r in ts_rows])),
                              "mean_accuracy": r4(np.mean([r["accuracy"] for r in ts_rows])),
                              "mean_naive_accuracy": r4(np.mean([r["naive_majority_accuracy"] for r in ts_rows]))}
print(out["m62_timeseries_bbca"])

# ---------------------------------------------------------------- M6.3 regularisation & early stopping
print("\n== M6.3 regularisation & early stopping ==")
c_path = []
for C in C_GRID:
    m = lr_pipe(C=C)
    m.fit(X_train, y_train)
    coef = m.named_steps["logreg"].coef_[0]
    c_path.append({"C": C,
                   "train_roc_auc": r4(roc_auc_score(y_train, m.predict_proba(X_train)[:, 1])),
                   "test_roc_auc": r4(roc_auc_score(y_test, m.predict_proba(X_test)[:, 1])),
                   "l2_norm_coef": r4(np.linalg.norm(coef))})
out["m63_lr_C_path"] = c_path
print("C path:", c_path)

# sklearn 1.9 deprecates `penalty` -- use l1_ratio (0=L2, 1=L1) instead.
l1l2 = []
for C in [0.1, 1.0]:
    for penalty, kw in [("l2", {"l1_ratio": 0}), ("l1", {"l1_ratio": 1, "solver": "saga", "max_iter": 5000})]:
        m = lr_pipe(C=C, penalty=penalty, **kw)
        m.fit(X_train, y_train)
        coef = m.named_steps["logreg"].coef_[0]
        l1l2.append({"C": C, "penalty": penalty,
                     "n_coef_abs_lt_1e-4": int((np.abs(coef) < 1e-4).sum()),
                     "n_coef_exact_zero": int((coef == 0).sum()),
                     "test_roc_auc": r4(roc_auc_score(y_test, m.predict_proba(X_test)[:, 1])),
                     "l2_norm_coef": r4(np.linalg.norm(coef)),
                     "l1_norm_coef": r4(np.abs(coef).sum())})
out["m63_l1_vs_l2"] = l1l2
out["m63_l1_vs_l2_api_note"] = ("sklearn 1.9: penalty deprecated, used l1_ratio 0=L2 / 1=L1; "
                                 "L1 counts verified identical to the penalty= API run.")
print("L1 vs L2:", l1l2)

vc_rows = []
for n_est in [10, 25, 50, 100, 200, 400]:
    m = gbm(max_iter=n_est)
    m.fit(X_train, y_train)
    vc_rows.append({"max_iter": n_est,
                    "train_roc_auc": r4(roc_auc_score(y_train, m.predict_proba(X_train)[:, 1])),
                    "test_roc_auc": r4(roc_auc_score(y_test, m.predict_proba(X_test)[:, 1]))})
best_vc = max(vc_rows, key=lambda r: r["test_roc_auc"])
at400 = next(r for r in vc_rows if r["max_iter"] == 400)
out["m63_gbm_validation_curve"] = vc_rows
out["m63_gbm_early_stopping"] = {
    "optimal_max_iter": best_vc["max_iter"],
    "test_roc_auc_at_optimal": best_vc["test_roc_auc"],
    "test_roc_auc_at_400": at400["test_roc_auc"],
    "overfit_worsening_best_minus_400": r4(best_vc["test_roc_auc"] - at400["test_roc_auc"]),
    "train_test_gap_at_400": r4(at400["train_roc_auc"] - at400["test_roc_auc"]),
    "note": ("HistGBM default early_stopping='auto' is ON (n_train>10000), so the model "
             "stops by itself around ~50 iterations: the curve is FLAT above 50. "
             "See m63_gbm_validation_curve_no_early_stopping for the curve with it OFF.")}
print("validation curve:", vc_rows, "\nearly stopping:", out["m63_gbm_early_stopping"])

# Same curve with early stopping OFF -- shows what the default setting hides.
vc_no_es_rows = []
for n_est in [10, 25, 50, 100, 200, 400]:
    m = gbm(max_iter=n_est, early_stopping=False)
    m.fit(X_train, y_train)
    vc_no_es_rows.append({"max_iter": n_est,
                          "train_roc_auc": r4(roc_auc_score(y_train, m.predict_proba(X_train)[:, 1])),
                          "test_roc_auc": r4(roc_auc_score(y_test, m.predict_proba(X_test)[:, 1]))})
best_no_es = max(vc_no_es_rows, key=lambda r: r["test_roc_auc"])
at400_no_es = next(r for r in vc_no_es_rows if r["max_iter"] == 400)
out["m63_gbm_validation_curve_no_early_stopping"] = vc_no_es_rows
out["m63_gbm_early_stopping_no_es"] = {
    "optimal_max_iter": best_no_es["max_iter"],
    "test_roc_auc_at_optimal": best_no_es["test_roc_auc"],
    "test_roc_auc_at_400": at400_no_es["test_roc_auc"],
    "overfit_worsening_best_minus_400": r4(best_no_es["test_roc_auc"] - at400_no_es["test_roc_auc"]),
    "train_test_gap_at_400": r4(at400_no_es["train_roc_auc"] - at400_no_es["test_roc_auc"])}
print("validation curve (early_stopping=False):", vc_no_es_rows)

# ---------------------------------------------------------------- M6.4 calibration & threshold
print("\n== M6.4 calibration & threshold ==")
cal_models = {}
cal_lr_sig = CalibratedClassifierCV(estimator=lr_pipe(), method="sigmoid", cv=3)
cal_lr_sig.fit(X_train, y_train)
cal_lr_iso = CalibratedClassifierCV(estimator=lr_pipe(), method="isotonic", cv=3)
cal_lr_iso.fit(X_train, y_train)
cal_gbm_sig = cal_gbm  # flagship sigmoid GBM, already fitted
calib = {}
for name, proba in [("lr_raw", lr_proba), ("lr_platt_sigmoid", cal_lr_sig.predict_proba(X_test)[:, 1]),
                    ("lr_isotonic", cal_lr_iso.predict_proba(X_test)[:, 1]),
                    ("gbm_raw", gbm_proba),
                    ("gbm_platt_sigmoid", cal_proba)]:
    e, bins = ece_score(y_test, proba)
    calib[name] = {"brier": r4(brier_score_loss(y_test, proba)),
                   "roc_auc": r4(roc_auc_score(y_test, proba)),
                   "ece_10bin": e, "bins": bins}
best_cal = min(calib, key=lambda k: calib[k]["brier"])
out["m64_calibration"] = calib
out["m64_calibration_best_by_brier"] = best_cal
print({k: (v["brier"], v["ece_10bin"]) for k, v in calib.items()}, "best:", best_cal)
# reliability example bins: [0.2,0.3) and [0.7,0.8) for GBM raw vs Platt
out["m64_reliability_example_bins"] = {
    "bins_reported": ["[0.2,0.3)", "[0.7,0.8)"],
    "gbm_raw": [b for b in calib["gbm_raw"]["bins"] if b["bin"] in ("[0.2,0.3)", "[0.7,0.8)")],
    "gbm_platt_sigmoid": [b for b in calib["gbm_platt_sigmoid"]["bins"] if b["bin"] in ("[0.2,0.3)", "[0.7,0.8)")]}
print(out["m64_reliability_example_bins"])

# (c)+(d) thresholds on calibrated GBM
test_limit = X_test["LIMIT_BAL"].values
thresholds_cost = np.arange(0.05, 0.95, 0.05)
costs = [portfolio_cost(y_test, cal_proba, test_limit, t) for t in thresholds_cost]
cost_opt_idx = int(np.argmin(costs))
cost_opt_t = float(thresholds_cost[cost_opt_idx])
approve_all_cost = float((((y_test.values == 1)) * LGD * test_limit).sum())
reject_all_cost = float((((y_test.values == 0)) * MARGIN * test_limit).sum())
out["m64_threshold_cost_optimal"] = {
    "threshold": round(cost_opt_t, 2), "total_cost_NT": int(costs[cost_opt_idx]),
    "cost_at_0.50_NT": int(portfolio_cost(y_test, cal_proba, test_limit, 0.5)),
    "approve_all_cost_NT": int(approve_all_cost), "reject_all_cost_NT": int(reject_all_cost),
    "cost_grid": [{"threshold": round(float(t), 2), "total_cost_NT": int(c)} for t, c in zip(thresholds_cost, costs)]}
print("cost-optimal threshold:", cost_opt_t, "cost:", costs[cost_opt_idx])


def threshold_detail(t):
    pred = (cal_proba >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
    approved = cal_proba < t
    n_app = int(approved.sum())
    bad_rate = float(y_test.values[approved].mean()) if n_app else 0.0
    exp_loss_app = float((cal_proba[approved] * LGD * test_limit[approved]).sum())
    realised_profit = float(((y_test.values[approved] == 0) * MARGIN * test_limit[approved]).sum())
    realised_loss = float(((y_test.values[approved] == 1) * LGD * test_limit[approved]).sum())
    return {"threshold": round(float(t), 2), "tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp),
            "approval_rate": r4(approved.mean()), "bad_rate_approved": r4(bad_rate),
            "total_cost_NT": int(portfolio_cost(y_test, cal_proba, test_limit, t)),
            "expected_loss_approved_NT": int(exp_loss_app),
            "net_profit_realised_NT": int(realised_profit - realised_loss)}


thr_rows = [threshold_detail(t) for t in (0.10, 0.50, cost_opt_t)]
out["m64_thresholds"] = thr_rows
# policy table (flagship grid 0.10..0.90 step 0.05) for profit-max
policy_thresholds = np.arange(0.10, 0.95, 0.05)
policy_rows = [threshold_detail(float(t)) for t in policy_thresholds]
best_profit = max(policy_rows, key=lambda r: r["net_profit_realised_NT"])
min_loss_row = min(policy_rows, key=lambda r: r["expected_loss_approved_NT"])
out["m64_policy_table"] = policy_rows
out["m64_profit_max_threshold"] = {"threshold": best_profit["threshold"],
                                    "net_profit_realised_NT": best_profit["net_profit_realised_NT"],
                                    "approval_rate": best_profit["approval_rate"],
                                    "bad_rate_approved": best_profit["bad_rate_approved"],
                                    "total_cost_NT": best_profit["total_cost_NT"]}
out["m64_min_expected_loss_threshold"] = {"threshold": min_loss_row["threshold"],
                                          "expected_loss_approved_NT": min_loss_row["expected_loss_approved_NT"],
                                          "net_profit_realised_NT": min_loss_row["net_profit_realised_NT"],
                                          "approval_rate": min_loss_row["approval_rate"]}
out["m64_profit_vs_cost_threshold_same"] = bool(abs(best_profit["threshold"] - cost_opt_t) < 1e-9)
print("profit-max:", out["m64_profit_max_threshold"], "min-EL:", out["m64_min_expected_loss_threshold"],
      "same as cost-optimal:", out["m64_profit_vs_cost_threshold_same"])

# ---------------------------------------------------------------- M6.5 AutoML & selection bias
print("\n== M6.5 selection bias ==")
# (a) winner's curse: grid configs, CV score vs test score (refit on train)
wc_rows = []
for r in test_by_cfg:
    wc_rows.append({**r, "optimism_cv_minus_test": r4(r["cv_roc_auc_mean"] - r["test_roc_auc"])})
best_wc = next(r for r in wc_rows if (r["max_iter"], r["max_depth"], r["learning_rate"]) ==
               (best_grid["max_iter"], best_grid["max_depth"], best_grid["learning_rate"]))
out["m65_winners_curse"] = {
    "best_cv_config": {k: best_wc[k] for k in ("max_iter", "max_depth", "learning_rate")},
    "best_cv_score": best_wc["cv_roc_auc_mean"],
    "its_test_roc_auc": best_wc["test_roc_auc"],
    "optimism_cv_minus_test": best_wc["optimism_cv_minus_test"],
    "mean_optimism_all_18_configs": r4(np.mean([r["optimism_cv_minus_test"] for r in wc_rows])),
    "all_configs": wc_rows}
print("winner's curse:", out["m65_winners_curse"]["best_cv_score"],
      "-> test", out["m65_winners_curse"]["its_test_roc_auc"],
      "optimism", out["m65_winners_curse"]["optimism_cv_minus_test"])

# (b) McNemar LR vs GBM @0.5 ; (c) GBM vs tuned GBM @0.5
lr_pred = (lr_proba >= 0.5).astype(int)
gbm_pred = (gbm_proba >= 0.5).astype(int)
tuned_pred = (tuned_proba >= 0.5).astype(int)
mc_lr_gbm = mcnemar(y_test, lr_pred, gbm_pred)
mc_gbm_tuned = mcnemar(y_test, gbm_pred, tuned_pred)
out["m65_mcnemar_lr_vs_gbm"] = {"A": "LR", "B": "GBM_default", "threshold": 0.5,
                                "note_b": "b = LR benar & GBM salah; c = LR salah & GBM benar",
                                **mc_lr_gbm,
                                "conclusion": ("GBM menang signifikan atas LR (p<0.05)"
                                               if mc_lr_gbm["p_value"] < 0.05 else
                                               "Perbedaan LR vs GBM tidak signifikan (p>=0.05)")}
out["m65_mcnemar_gbm_vs_tuned"] = {"A": "GBM_default", "B": "GBM_tuned_grid_best", "threshold": 0.5,
                                   "note_b": "b = GBM-default benar & tuned salah; c = GBM-default salah & tuned benar",
                                   **mc_gbm_tuned,
                                   "conclusion": ("GBM tertala menang signifikan atas GBM default (p<0.05)"
                                                  if mc_gbm_tuned["p_value"] < 0.05 else
                                                  "Perbedaan GBM default vs tertala tidak signifikan (p>=0.05)")}
print("McNemar LR vs GBM:", mc_lr_gbm, "\nMcNemar GBM vs tuned:", mc_gbm_tuned)

# (d) fair protocol: nested-CV scores
out["m65_fair_protocol_nested_cv"] = [
    {"model": "LR_tuned_C_grid", "nested_cv_roc_auc_mean": out["m62_nested_lr"]["mean"],
     "sd": out["m62_nested_lr"]["sd"]},
    {"model": "GBM_default_no_tuning", "nested_cv_roc_auc_mean": out["m62_cv5_gbm_default"]["mean"],
     "sd": out["m62_cv5_gbm_default"]["sd"],
     "note": "tanpa tuning, 5-fold CV biasa sudah tak-bias (bukan nested)"},
    {"model": "GBM_tuned_grid", "nested_cv_roc_auc_mean": out["m62_nested_gbm"]["mean"],
     "sd": out["m62_nested_gbm"]["sd"]},
]
winner = max(out["m65_fair_protocol_nested_cv"], key=lambda r: r["nested_cv_roc_auc_mean"])
out["m65_fair_protocol_winner"] = winner["model"]
out["m65_fair_protocol_recommendation"] = (
    f"Pemenang jujur (nested CV): {winner['model']} "
    f"({winner['nested_cv_roc_auc_mean']:.4f} +- {winner['sd']:.4f}); "
    "jangan memilih dari skor test tunggal.")
print("fair winner:", out["m65_fair_protocol_winner"])

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s")
print("repro all within 0.001:", repro["all_within_0.001"])
print("cost-optimal threshold (flagship target 0.10):", cost_opt_t)

"""Canonical numbers for MLF M8 (Model risk & deployment).

Pipeline REPLICATES the flagship notebook exactly (same as
qa-learn/m6_canonical_calc.py and m7_gap_fill_calc.py): same data
data/uci_default_credit.xls (header=1, rename "default payment next month"
-> "default", 30.000 rows), same add_features(), same stratified 80/20
split random_state=42 (test 6.000), LR = Pipeline(StandardScaler,
LogisticRegression(max_iter=1000, random_state=42)), GBM =
HistGradientBoostingClassifier(random_state=42) defaults, decision model =
GBM calibrated Platt/sigmoid (CalibratedClassifierCV cv=3), threshold 0.10,
LGD 0.45, MARGIN 0.05. Approval = calibrated GBM proba < 0.10 (champion);
challenger LR uses its RAW proba < 0.10 (labelled explicitly).

SANITY CHECK (locked, tolerance 0.001): GBM test ROC-AUC 0.7823, LR test
ROC-AUC 0.7426, GBM cal ROC-AUC 0.7816, AIR SEX 0.8693, cost@0.10
33.046.500, profit@0.10 8.214.000. If any locked number misses, the script
STOPS (exit 1) and writes NO json.

Numbers computed (all on TEST 6.000, seed 42, unless stated):
  m8_validation_halves: test split into halves A/B (stratified, seed 42) --
      "outcomes analysis" for M8.1: per-half ROC-AUC / PR-AUC / approval /
      bad rate / ECE / Brier + differences. A validator re-checks the model
      on a fresh split; big half-to-half swings = unstable evidence.
  m8_tiering: materiality for M8.2 -- total LIMIT_BAL on test, approved
      LIMIT_BAL, expected loss (sum p_cal x LGD x LIMIT) for approved and
      for all test, realised profit/loss of the approved set.
  m8_seed_sensitivity: reproducibility for M8.3 -- GBM random_state 42..46
      on the FIXED split: ROC-AUC (raw + cal), PR-AUC, approval, Brier per
      seed + range / mean / sd (ddof=1, labelled).
  m8_champion_challenger: M8.4 -- champion (GBM cal) vs challenger (LR raw)
      at threshold 0.10: approval, bad rate, profit, cost each; decision
      disagreement rate; breakdown of the disagreement cells; McNemar on
      the 0.10 decisions (b, c, chi2, p via chi2 sf, cross-checked with the
      closed form erfc(sqrt(chi2/2)) used in M6.5).
  m8_shadow: M8.4 shadow-mode framing of the same disagreement -- what the
      challenger WOULD have decided had it acted: shadow-only approvals
      (n, bad rate, realised loss) and shadow-only rejections (n, good
      rate, margin forgone).

Run: python3 qa-learn/m8_canonical_calc.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m8_canonical.json and prints a verification table.
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
                             confusion_matrix, roc_auc_score)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
DATA_XLS = "data/uci_default_credit.xls"
OUT_JSON = "qa-learn/m8_canonical.json"
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
               "approval_rule_champion": "approve iff calibrated GBM proba < 0.10",
               "approval_rule_challenger": "approve iff LR raw proba < 0.10 "
               "(LR is NOT calibrated; its 0.10 means something different "
               "from the champion's 0.10 -- labelled wherever used)",
               "note": "All numbers computed from the data above; nothing "
               "invented. Rounded to 4 decimals except counts (integers) "
               "and money (integers, NT$)."}

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
test_limit = X_test_raw["LIMIT_BAL"].values.astype(float)
y_test_arr = y_test.values
print(f"train {X_train.shape} test {X_test.shape} test base={y_test.mean():.4f}")


def r4(x):
    return round(float(x), 4)


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
    for i in range(n_bins):
        m = (y_proba >= edges[i]) & (y_proba < edges[i + 1] if i < n_bins - 1 else y_proba <= edges[i + 1])
        n_b = int(m.sum())
        if n_b == 0:
            continue
        ece += (n_b / len(y_true)) * abs(float(y_proba[m].mean()) - float(y_true[m].mean()))
    return float(ece)


def threshold_economics(y_true, y_proba, limit, threshold):
    """Approval / bad rate / realised profit / cost at one threshold."""
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


# ---------------------------------------------------------------- flagship repro
gbm0 = HistGradientBoostingClassifier(random_state=SEED)
gbm0.fit(X_train, y_train)
gbm_proba = gbm0.predict_proba(X_test)[:, 1]
gbm_train_proba = gbm0.predict_proba(X_train)[:, 1]
cal_gbm = CalibratedClassifierCV(
    estimator=HistGradientBoostingClassifier(random_state=SEED),
    method="sigmoid", cv=3)
cal_gbm.fit(X_train, y_train)
cal_proba = cal_gbm.predict_proba(X_test)[:, 1]
lr_pipe = Pipeline([("scaler", StandardScaler()),
                    ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))])
lr_pipe.fit(X_train, y_train)
lr_proba = lr_pipe.predict_proba(X_test)[:, 1]

gbm_roc = r4(roc_auc_score(y_test, gbm_proba))
lr_roc = r4(roc_auc_score(y_test, lr_proba))
cal_roc = r4(roc_auc_score(y_test, cal_proba))
gbm_train_roc = r4(roc_auc_score(y_train, gbm_train_proba))
champ_010 = threshold_economics(y_test, cal_proba, test_limit, THR)
sex_arr = X_test_raw["SEX"].values
appr_m = float((cal_proba[sex_arr == 1] < THR).mean())
appr_f = float((cal_proba[sex_arr == 2] < THR).mean())
sex_air = r4(appr_m / appr_f)
print(f"GBM test ROC-AUC = {gbm_roc} (locked 0.7823) | LR = {lr_roc} "
      f"(locked 0.7426) | cal = {cal_roc} (locked 0.7816)")
print(f"GBM train ROC-AUC = {gbm_train_roc} (locked 0.8469) | "
      f"AIR SEX = {sex_air} (locked 0.8693)")
print(f"cost@0.10 = {champ_010['total_cost_NT']:,} (locked 33.046.500) | "
      f"profit@0.10 = {champ_010['net_profit_realised_NT']:,} (locked 8.214.000)")

out["repro_flagship"] = {
    "lr_roc_auc": lr_roc,
    "lr_pr_auc": r4(average_precision_score(y_test, lr_proba)),
    "lr_brier": r4(brier_score_loss(y_test, lr_proba)),
    "gbm_roc_auc": gbm_roc,
    "gbm_pr_auc": r4(average_precision_score(y_test, gbm_proba)),
    "gbm_brier": r4(brier_score_loss(y_test, gbm_proba)),
    "gbm_cal_roc_auc": cal_roc,
    "gbm_cal_pr_auc": r4(average_precision_score(y_test, cal_proba)),
    "gbm_cal_brier": r4(brier_score_loss(y_test, cal_proba)),
    "gbm_train_roc_auc": gbm_train_roc,
    "gbm_train_test_gap": r4(gbm_train_roc - gbm_roc),
    "threshold": THR,
    "cost_010": champ_010["total_cost_NT"],
    "profit_010": champ_010["net_profit_realised_NT"],
    "approval_010": champ_010["approval_rate"],
    "bad_rate_010": champ_010["bad_rate_approved"],
    "sex_air_010": sex_air,
}

locked = {
    "gbm_roc_auc": (gbm_roc, 0.7823),
    "lr_roc_auc": (lr_roc, 0.7426),
    "gbm_cal_roc_auc": (cal_roc, 0.7816),
    "gbm_train_roc_auc": (gbm_train_roc, 0.8469),
    "sex_air": (sex_air, 0.8693),
    "cost_010": (champ_010["total_cost_NT"], 33046500),
    "profit_010": (champ_010["net_profit_realised_NT"], 8214000),
}
ver = {}
ok = True
for k, (got, want) in locked.items():
    tol = 0.001 if isinstance(want, float) else max(1, abs(want) * 0.001)
    match = bool(abs(got - want) <= tol)
    ok = ok and match
    ver[k] = {"computed": got, "locked": want, "diff": (round(got - want, 4)
              if isinstance(want, float) else got - want),
              "match": match}
out["locked_verification"] = ver
print("\n== LOCKED VERIFICATION (sanity) ==")
for k, v in ver.items():
    print(f"  {k:20s} computed={v['computed']} locked={v['locked']} "
          f"diff={v['diff']} match={v['match']}")
if not ok:
    print("SANITY CHECK FAILED -- STOPPING, no JSON written.")
    raise SystemExit(1)
print("Sanity check PASSED.")

# ================================================================ (A) validation halves
idx_a, idx_b = train_test_split(np.arange(len(y_test_arr)), test_size=0.5,
                                stratify=y_test_arr, random_state=SEED)
halves = {}
for lbl, idx in (("A", idx_a), ("B", idx_b)):
    yh, ph = y_test_arr[idx], cal_proba[idx]
    lh = test_limit[idx]
    eco = threshold_economics(yh, ph, lh, THR)
    halves[lbl] = {"n": int(len(idx)), "base_rate": r4(float(yh.mean())),
                   "roc_auc_cal": r4(roc_auc_score(yh, ph)),
                   "pr_auc_cal": r4(average_precision_score(yh, ph)),
                   "approval_rate": eco["approval_rate"],
                   "bad_rate_approved": eco["bad_rate_approved"],
                   "ece_10bin": r4(ece_score(yh, ph)),
                   "brier_cal": r4(brier_score_loss(yh, ph))}
halves["diff_B_minus_A"] = {
    "roc_auc": r4(halves["B"]["roc_auc_cal"] - halves["A"]["roc_auc_cal"]),
    "pr_auc": r4(halves["B"]["pr_auc_cal"] - halves["A"]["pr_auc_cal"]),
    "approval_rate_pp": r4((halves["B"]["approval_rate"]
                            - halves["A"]["approval_rate"]) * 100),
    "bad_rate_pp": r4((halves["B"]["bad_rate_approved"]
                       - halves["A"]["bad_rate_approved"]) * 100),
    "ece": r4(halves["B"]["ece_10bin"] - halves["A"]["ece_10bin"]),
    "brier": r4(halves["B"]["brier_cal"] - halves["A"]["brier_cal"]),
    "base_rate_pp": r4((halves["B"]["base_rate"]
                        - halves["A"]["base_rate"]) * 100),
}
halves["note"] = ("Test 6.000 split stratified into halves A/B (n=3.000 each, "
                  "seed 42). A validator re-checks outcomes on a fresh split: "
                  "half-to-half swings show how much of a 'finding' is noise.")
out["m8_validation_halves"] = halves
print("\n== (A) validation halves ==")
for lbl in ("A", "B"):
    h = halves[lbl]
    print(f"  half {lbl}: n={h['n']} base={h['base_rate']} ROC={h['roc_auc_cal']} "
          f"PR={h['pr_auc_cal']} appr={h['approval_rate']} bad={h['bad_rate_approved']} "
          f"ECE={h['ece_10bin']} Brier={h['brier_cal']}")
print("  diff B-A:", halves["diff_B_minus_A"])

# ================================================================ (B) tiering / materiality
approved = cal_proba < THR
total_limit = float(test_limit.sum())
appr_limit = float(test_limit[approved].sum())
el_approved = float((cal_proba[approved] * LGD * test_limit[approved]).sum())
el_all = float((cal_proba * LGD * test_limit).sum())
el_realised_approved = float(((y_test_arr[approved] == 1) * LGD
                              * test_limit[approved]).sum())
out["m8_tiering"] = {
    "n_test": int(len(y_test_arr)),
    "total_limit_test_NT": int(total_limit),
    "approved_limit_NT": int(appr_limit),
    "approved_limit_share": r4(appr_limit / total_limit),
    "expected_loss_approved_NT": int(el_approved),
    "expected_loss_all_test_NT": int(el_all),
    "expected_loss_rate_approved": r4(el_approved / appr_limit),
    "realised_loss_approved_NT": int(el_realised_approved),
    "realised_profit_approved_NT": champ_010["realised_profit_NT"],
    "net_profit_approved_NT": champ_010["net_profit_realised_NT"],
    "total_cost_010_NT": champ_010["total_cost_NT"],
    "note": ("Materiality for tiering (M8.2): the model decides over "
             "NT$ millions of credit limit on 6.000 test applicants; "
             "expected loss uses the CALIBRATED proba (0.7816 model), LGD "
             "0.45, EAD = LIMIT_BAL. Scale to the full book by multiplying "
             "by (book size / 6.000) -- the test set is a 1/5 stratified "
             "sample of the 30.000-row data, NOT the live book."),
}
print("\n== (B) tiering / materiality ==")
print(f"  total LIMIT test = NT${int(total_limit):,} | approved LIMIT = "
      f"NT${int(appr_limit):,} ({r4(appr_limit / total_limit) * 100:.2f}%)")
print(f"  EL approved = NT${int(el_approved):,} | EL all test = NT${int(el_all):,}")

# ================================================================ (C) seed sensitivity
seed_rows = []
for s in range(42, 47):
    g = HistGradientBoostingClassifier(random_state=s)
    g.fit(X_train, y_train)
    gp = g.predict_proba(X_test)[:, 1]
    c = CalibratedClassifierCV(
        estimator=HistGradientBoostingClassifier(random_state=s),
        method="sigmoid", cv=3)
    c.fit(X_train, y_train)
    cp = c.predict_proba(X_test)[:, 1]
    seed_rows.append({
        "seed": s,
        "gbm_raw_roc_auc": r4(roc_auc_score(y_test, gp)),
        "gbm_cal_roc_auc": r4(roc_auc_score(y_test, cp)),
        "gbm_cal_pr_auc": r4(average_precision_score(y_test, cp)),
        "approval_rate_cal": r4(float((cp < THR).mean())),
        "brier_cal": r4(brier_score_loss(y_test, cp)),
    })
roc_raw = np.array([r["gbm_raw_roc_auc"] for r in seed_rows])
roc_cal = np.array([r["gbm_cal_roc_auc"] for r in seed_rows])
appr = np.array([r["approval_rate_cal"] for r in seed_rows])
out["m8_seed_sensitivity"] = {
    "seeds": seed_rows,
    "gbm_raw_roc_auc_range": [float(roc_raw.min()), float(roc_raw.max())],
    "gbm_raw_roc_auc_spread": r4(float(roc_raw.max() - roc_raw.min())),
    "gbm_raw_roc_auc_mean": r4(float(roc_raw.mean())),
    "gbm_raw_roc_auc_sd_ddof1": r4(float(roc_raw.std(ddof=1))),
    "gbm_cal_roc_auc_range": [float(roc_cal.min()), float(roc_cal.max())],
    "gbm_cal_roc_auc_spread": r4(float(roc_cal.max() - roc_cal.min())),
    "approval_rate_range": [float(appr.min()), float(appr.max())],
    "approval_rate_spread_pp": r4(float((appr.max() - appr.min()) * 100)),
    "note": ("Same split (seed 42), only the GBM random_state varies "
             "(42..46). Spread = max-min across 5 seeds; sd is ddof=1. A "
             "model whose ROC-AUC moves a lot when only the seed changes "
             "is not reproducible -- its '0.7823' is a lottery ticket, not "
             "a measurement."),
}
print("\n== (C) seed sensitivity (GBM random_state 42..46, fixed split) ==")
for r in seed_rows:
    print(f"  seed {r['seed']}: raw ROC={r['gbm_raw_roc_auc']} cal ROC="
          f"{r['gbm_cal_roc_auc']} appr={r['approval_rate_cal']} "
          f"Brier={r['brier_cal']}")
print(f"  raw ROC spread = {out['m8_seed_sensitivity']['gbm_raw_roc_auc_spread']} "
      f"(sd ddof=1 {out['m8_seed_sensitivity']['gbm_raw_roc_auc_sd_ddof1']})")

# ================================================================ (D) champion vs challenger
champ_eco = threshold_economics(y_test, cal_proba, test_limit, THR)
chall_eco = threshold_economics(y_test, lr_proba, test_limit, THR)
champ_dec = cal_proba < THR
chall_dec = lr_proba < THR
disagree = champ_dec != chall_dec
dis_rate = float(disagree.mean())
# McNemar on the 0.10 decisions: b = champion approves & challenger rejects
# (challenger says default, champion says approve); c = the reverse.
b = int(((champ_dec) & (~chall_dec)).sum())
c_ = int(((~champ_dec) & (chall_dec)).sum())
chi2 = (abs(b - c_) - 1) ** 2 / (b + c_) if (b + c_) else 0.0
p_chi2 = float(stats.chi2.sf(chi2, 1))
p_erfc = float(math.erfc(math.sqrt(chi2 / 2))) if chi2 > 0 else 1.0
# disagreement cells with outcomes
ch_only_rej = (~chall_dec) & (champ_dec)   # challenger rejects, champion approves
ch_only_app = (chall_dec) & (~champ_dec)   # challenger approves, champion rejects
out["m8_champion_challenger"] = {
    "threshold": THR,
    "champion": {"model": "GBM terkalibrasi (Platt/sigmoid)",
                 "roc_auc": cal_roc,
                 "pr_auc": r4(average_precision_score(y_test, cal_proba)),
                 **{k: v for k, v in champ_eco.items()
                    if k in ("approval_rate", "bad_rate_approved",
                             "net_profit_realised_NT", "total_cost_NT",
                             "n_approved")}},
    "challenger": {"model": "LR (Pipeline StandardScaler + "
                   "LogisticRegression, RAW proba -- not calibrated)",
                   "roc_auc": lr_roc,
                   "pr_auc": r4(average_precision_score(y_test, lr_proba)),
                   **{k: v for k, v in chall_eco.items()
                      if k in ("approval_rate", "bad_rate_approved",
                               "net_profit_realised_NT", "total_cost_NT",
                               "n_approved")}},
    "profit_delta_challenger_minus_champion_NT": int(
        chall_eco["net_profit_realised_NT"] - champ_eco["net_profit_realised_NT"]),
    "cost_delta_challenger_minus_champion_NT": int(
        chall_eco["total_cost_NT"] - champ_eco["total_cost_NT"]),
    "approval_delta_pp": r4((chall_eco["approval_rate"]
                             - champ_eco["approval_rate"]) * 100),
    "disagreement_rate": r4(dis_rate),
    "n_disagree": int(disagree.sum()),
    "mcnemar": {"b_champion_approves_challenger_rejects": b,
                "c_challenger_approves_champion_rejects": c_,
                "chi2_continuity_corrected": r4(chi2),
                "p_chi2_sf": r4(p_chi2),
                "p_erfc_closed_form": r4(p_erfc)},
    "note": ("Challenger LR is evaluated on its RAW proba at the SAME 0.10 "
             "threshold -- its 0.10 is not the champion's 0.10 (LR is not "
             "calibrated; its Brier 0.1427 vs champion 0.1345). The profit "
             "gap is therefore partly a calibration artefact, not pure "
             "ranking skill -- say so in the lesson. McNemar tests whether "
             "the two models' DECISIONS differ more than chance, not "
             "whether one is better."),
}
print("\n== (D) champion (GBM cal) vs challenger (LR raw) at 0.10 ==")
print(f"  champion: appr={champ_eco['approval_rate']} bad={champ_eco['bad_rate_approved']} "
      f"profit={champ_eco['net_profit_realised_NT']:,}")
print(f"  challenger: appr={chall_eco['approval_rate']} bad={chall_eco['bad_rate_approved']} "
      f"profit={chall_eco['net_profit_realised_NT']:,}")
print(f"  disagreement = {r4(dis_rate)} (n={int(disagree.sum())}) | "
      f"McNemar b={b} c={c_} chi2={r4(chi2)} p={r4(p_chi2)}")

# ================================================================ (E) shadow mode
shadow_only_app = ch_only_app
shadow_only_rej = ch_only_rej
out["m8_shadow"] = {
    "n_shadow_decisions": int(len(y_test_arr)),
    "n_would_differ": int(disagree.sum()),
    "disagreement_rate": r4(dis_rate),
    "challenger_would_approve_champion_rejects": {
        "n": int(shadow_only_app.sum()),
        "bad_rate_among_them": r4(float(y_test_arr[shadow_only_app].mean()))
        if shadow_only_app.sum() else None,
        "n_default_among_them": int(y_test_arr[shadow_only_app].sum()),
        "realised_loss_if_acted_NT": int(
            ((y_test_arr[shadow_only_app] == 1) * LGD
             * test_limit[shadow_only_app]).sum()),
        "margin_if_acted_NT": int(
            ((y_test_arr[shadow_only_app] == 0) * MARGIN
             * test_limit[shadow_only_app]).sum()),
    },
    "challenger_would_reject_champion_approves": {
        "n": int(shadow_only_rej.sum()),
        "good_rate_among_them": r4(float((y_test_arr[shadow_only_rej] == 0).mean()))
        if shadow_only_rej.sum() else None,
        "n_good_among_them": int((y_test_arr[shadow_only_rej] == 0).sum()),
        "margin_forgone_if_acted_NT": int(
            ((y_test_arr[shadow_only_rej] == 0) * MARGIN
             * test_limit[shadow_only_rej]).sum()),
    },
    "note": ("Shadow mode: the challenger decides on the same applicants "
             "but its decisions are RECORDED, not acted on. The two cells "
             "above are what switching would have changed on this test set "
             "-- the price of the switch, measured before paying it."),
}
print("\n== (E) shadow mode ==")
print(f"  would-differ: {int(disagree.sum())} of {len(y_test_arr)}")
print(f"  challenger-only approvals: n={int(shadow_only_app.sum())} bad="
      f"{out['m8_shadow']['challenger_would_approve_champion_rejects']['bad_rate_among_them']}")
print(f"  challenger-only rejections: n={int(shadow_only_rej.sum())} good="
      f"{out['m8_shadow']['challenger_would_reject_champion_approves']['good_rate_among_them']}")

# ================================================================ (F) fix-round additions
# (a) LR CALIBRATED (Platt/sigmoid, cv=3) at 0.10 -- M8.4 M3: the lesson
# claimed 1.166 approvals; economics (bad rate / profit) decide whether
# calibration explains the challenger gap, not the count alone.
cal_lr = CalibratedClassifierCV(
    estimator=Pipeline([("scaler", StandardScaler()),
                        ("logreg", LogisticRegression(max_iter=1000, random_state=SEED))]),
    method="sigmoid", cv=3)
cal_lr.fit(X_train, y_train)
lr_cal_proba = cal_lr.predict_proba(X_test)[:, 1]
lr_cal_eco = threshold_economics(y_test, lr_cal_proba, test_limit, THR)
out["m8_lr_calibrated_thr010"] = {
    "model": "LR terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3, "
             "estimator = Pipeline StandardScaler + LogisticRegression)",
    "threshold": THR,
    "roc_auc": r4(roc_auc_score(y_test, lr_cal_proba)),
    "n_approved": lr_cal_eco["n_approved"],
    "approval_rate": lr_cal_eco["approval_rate"],
    "bad_rate_approved": lr_cal_eco["bad_rate_approved"],
    "realised_profit_NT": lr_cal_eco["realised_profit_NT"],
    "realised_loss_NT": lr_cal_eco["realised_loss_NT"],
    "net_profit_realised_NT": lr_cal_eco["net_profit_realised_NT"],
    "total_cost_NT": lr_cal_eco["total_cost_NT"],
    "note": ("M8.4 M3: calibrated LR at 0.10 approves FEWER than raw LR "
             "(1.166 vs 1.215) and earns only +NT$63.500 more "
             "(+1.886.500 vs +1.823.000) -- still NT$6.327.500 below the "
             "champion (+8.214.000). Calibration explains only a small part "
             "of the challenger gap; the rest is ranking (ROC 0.7427 vs "
             "0.7816)."),
}
print("\n== (F-a) LR calibrated (Platt, cv=3) at 0.10 ==")
print(f"  n_approved={lr_cal_eco['n_approved']} approval={lr_cal_eco['approval_rate']} "
      f"bad={lr_cal_eco['bad_rate_approved']} profit={lr_cal_eco['net_profit_realised_NT']:,} "
      f"cost={lr_cal_eco['total_cost_NT']:,}")

# (b) approve-all REALISED loss -- M8.4 S6: sum LIMIT_BAL of default rows
# in test x LGD 0.45. NOT the expected loss 78.675.378 (sum of calibrated
# proba x LGD x LIMIT over all test rows).
default_mask = y_test_arr == 1
realised_loss_all = float((LGD * test_limit[default_mask]).sum())
out["m8_approve_all_realised_loss"] = {
    "n_default_test": int(default_mask.sum()),
    "sum_limit_default_test_NT": int(test_limit[default_mask].sum()),
    "realised_loss_all_test_NT": int(realised_loss_all),
    "expected_loss_all_test_NT_m8_tiering": out["m8_tiering"]["expected_loss_all_test_NT"],
    "note": ("M8.4 S6: realised loss if EVERY test applicant is approved "
             "(sum LIMIT_BAL of default rows x LGD 0.45). This is NOT the "
             "expected loss 78.675.378 (sum of calibrated proba x LGD x "
             "LIMIT over all test rows)."),
}
print("\n== (F-b) approve-all realised loss ==")
print(f"  n_default={int(default_mask.sum())} realised_loss="
      f"NT${int(realised_loss_all):,}")

# (c) mean scores on test -- M8.4 S1: 0.2217 is the MEAN CALIBRATED PROBA,
# not the base rate (0.2212).
out["m8_mean_scores_test"] = {
    "mean_calibrated_gbm_proba": r4(float(cal_proba.mean())),
    "mean_raw_gbm_proba": r4(float(gbm_proba.mean())),
    "test_base_rate": r4(float(y_test_arr.mean())),
    "note": ("M8.4 S1: 0.2217 is the MEAN CALIBRATED PROBA on test, not "
             "the base rate (0.2212). Mean predicted proba != base rate; "
             "cite as 'mean calibrated proba [notebook]' wherever used."),
}
print("\n== (F-c) mean scores on test ==")
print(f"  mean cal proba={r4(float(cal_proba.mean()))} | mean raw GBM="
      f"{r4(float(gbm_proba.mean()))} | base rate={r4(float(y_test_arr.mean()))}")

out["runtime_seconds"] = round(time.time() - t0, 1)
with open(OUT_JSON, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nWROTE {OUT_JSON} in {out['runtime_seconds']}s")

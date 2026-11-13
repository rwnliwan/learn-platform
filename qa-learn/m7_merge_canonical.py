"""Merge the five MLF M7 per-lesson canonical files into one combined
qa-learn/m7_canonical.json (mirrors the m6_canonical.json shape:
shared top-level meta/data/repro + m7x_-prefixed lesson keys).

Per-lesson sources (all deterministic, seed 42, UCI credit):
  m71: qa-learn/m7_m71_numbers.json
  m72: qa-learn/m7_canonical_m72.json
  m73: qa-learn/m7_canonical_m73.json (merged fix pass: real SHAP + corrected LIME)
  m74: qa-learn/m7_canonical_m74.json (copy of m7_calc_m74_output.json)
  m75: qa-learn/m7_calc_m75_output.json

Shared keys (meta, data_n, data_base_rate, n_features, train_n, test_n,
repro_flagship) are hoisted to the top level; every other key is kept
under its m7x_ prefix. The script FAILS LOUDLY (exit 1, no write) if
any lesson's repro/baseline disagrees with the locked flagship numbers
beyond 0.001, or if data_n/train_n/test_n disagree.

Run: python3 qa-learn/m7_merge_canonical.py   (from ~/workspace/learn-platform)
Writes: qa-learn/m7_canonical.json
"""
import json
import sys

ROOT = "qa-learn/"
SOURCES = {
    "m71": ROOT + "m7_m71_numbers.json",
    "m72": ROOT + "m7_canonical_m72.json",
    "m73": ROOT + "m7_canonical_m73.json",
    "m74": ROOT + "m7_canonical_m74.json",
    "m75": ROOT + "m7_calc_m75_output.json",
}
OUT = ROOT + "m7_canonical.json"

# Locked flagship numbers (tolerance 0.001).
LOCKED = {
    "lr_roc_auc": 0.7426, "lr_pr_auc": 0.5049,
    "gbm_roc_auc": 0.7823, "gbm_pr_auc": 0.5597,
    "cal_gbm_roc_auc": 0.7816, "cal_gbm_pr_auc": 0.5558,
    "gbm_brier": 0.1342, "cal_gbm_brier": 0.1345,
}
# m75 uses gbm_test_/cal_test_ names for the same quantities.
M75_ALIAS = {
    "gbm_test_roc_auc": "gbm_roc_auc", "gbm_test_pr_auc": "gbm_pr_auc",
    "gbm_test_brier": "gbm_brier", "cal_test_roc_auc": "cal_gbm_roc_auc",
    "cal_test_pr_auc": "cal_gbm_pr_auc", "cal_test_brier": "cal_gbm_brier",
}
SHARED = {"meta", "data_n", "data_base_rate", "n_features",
          "train_n", "test_n", "repro_flagship"}


def load(prefix, path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"MERGE FAIL: missing per-lesson file for {prefix}: {path}")
        sys.exit(1)


def main():
    data = {p: load(p, s) for p, s in SOURCES.items()}

    # ---- shared-value agreement checks ----
    for key, want in [("data_n", 30000), ("train_n", 24000), ("test_n", 6000)]:
        for p, d in data.items():
            if key in d and d[key] != want:
                print(f"MERGE FAIL: {p} {key}={d[key]} != {want}")
                sys.exit(1)
    for key, want in [("data_base_rate", 0.2212), ("n_features", 31)]:
        for p, d in data.items():
            if key in d and abs(d[key] - want) > 0.00005:
                print(f"MERGE FAIL: {p} {key}={d[key]} != {want}")
                sys.exit(1)

    # ---- repro/baseline agreement vs locked ----
    for p, d in data.items():
        repro = d.get("repro_flagship") or d.get("baseline") or {}
        for k, v in repro.items():
            if isinstance(v, (int, float)) and k in LOCKED:
                if abs(v - LOCKED[k]) > 0.001:
                    print(f"MERGE FAIL: {p} repro {k}={v} != locked {LOCKED[k]}")
                    sys.exit(1)
            if isinstance(v, (int, float)) and k in M75_ALIAS:
                if abs(v - LOCKED[M75_ALIAS[k]]) > 0.001:
                    print(f"MERGE FAIL: {p} repro {k}={v} != locked "
                          f"{LOCKED[M75_ALIAS[k]]}")
                    sys.exit(1)

    # ---- build merged ----
    out = {}
    out["meta"] = {
        "seed": 42,
        "sklearn": "1.9.1", "numpy": "1.26.4", "pandas": "2.1.4",
        "scipy": "1.11.4",
        "data": "data/uci_default_credit.xls",
        "threshold": 0.1, "lgd": 0.45, "margin": 0.05,
        "approval_rule": "approve iff calibrated GBM proba < 0.10",
        "sources": {p: s for p, s in SOURCES.items()},
        "note": ("Combined M7 canonical numbers. m73 SHAP computed with "
                 "shap 0.54.1 in venv ~/workspace/.venv-shap-m73 (NOT system "
                 "python); m73 LIME corrected kernel kw=0.75*sqrt(31). m74 "
                 "in-processing is simplified reductions-style reweighting "
                 "(fairlearn NOT installed), labelled honestly. m75 "
                 "pseudo-time = ID order, NOT a real date."),
    }
    out["data_n"] = 30000
    out["data_base_rate"] = 0.2212
    out["n_features"] = 31
    out["train_n"] = 24000
    out["test_n"] = 6000
    # Fullest repro (m72: LR + GBM + Brier, raw + calibrated).
    out["repro_flagship"] = data["m72"]["repro_flagship"]

    runtimes = {}
    for p in ["m71", "m72", "m73", "m74", "m75"]:
        d = data[p]
        for k, v in d.items():
            if k in SHARED:
                continue
            out[f"{p}_{k}"] = v
        rt = (d.get("elapsed_seconds") or d.get("runtime_seconds")
              or d.get("elapsed_sec"))
        if rt is not None:
            runtimes[p] = rt
    out["runtime_seconds"] = round(sum(runtimes.values()), 1)
    out["per_lesson_runtime_seconds"] = runtimes

    with open(OUT, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"wrote {OUT}: {len(out)} top-level keys, "
          f"per-lesson keys m71={sum(1 for k in out if k.startswith('m71_'))} "
          f"m72={sum(1 for k in out if k.startswith('m72_'))} "
          f"m73={sum(1 for k in out if k.startswith('m73_'))} "
          f"m74={sum(1 for k in out if k.startswith('m74_'))} "
          f"m75={sum(1 for k in out if k.startswith('m75_'))}, "
          f"runtime_seconds={out['runtime_seconds']}")


if __name__ == "__main__":
    main()

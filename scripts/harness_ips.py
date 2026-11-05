#!/usr/bin/env python3
"""Harness verifikasi Proyek #5 pj-ips-portofolio.

Memeriksa konsistensi ground truth vs dataset (public/proyek/pj-ips-portofolio/).
Setiap check PASS/FAIL eksplisit; exit 0 bila semua PASS.
Konstanta DOC di bawah = ground truth resmi (dari gen_ips_data.py, seed 42).
"""
import csv, json, math, os, sys

BASE = os.path.join(os.path.dirname(__file__), "..", "public", "proyek", "pj-ips-portofolio")

DOC = {
    "n_rows": 180, "n_cols": 6, "date_first": "2011-01", "date_last": "2025-12",
    "exp": {"sbn": 0.0350, "deposito": 0.0150, "pasar_uang": 0.0220, "lq45": 0.0750, "emas": 0.0300},
    "vol": {"sbn": 0.0200, "deposito": 0.0080, "pasar_uang": 0.0100, "lq45": 0.1800, "emas": 0.1500},
    "r_star": 0.042358,
    "klien": {"investable_pv_jt": 8000.0, "tabungan_tahunan_jt": 250.0,
              "horizon_tahun": 15, "fv_target_jt": 20000.0},
    "saa": {
        "A": {"w": [0.45, 0.15, 0.10, 0.25, 0.05], "exp": 0.040450, "vol": 0.0471,
              "aftertax": 0.037985, "lolos_ekuitas": True, "lolos_likuid": True, "lolos_return": False},
        "B": {"w": [0.35, 0.10, 0.10, 0.35, 0.10], "exp": 0.0452, "vol": 0.0661,
              "aftertax": 0.043235, "lolos_ekuitas": True, "lolos_likuid": True, "lolos_return": True},
        "C": {"w": [0.20, 0.05, 0.05, 0.55, 0.15], "exp": 0.0546, "vol": 0.1028,
              "aftertax": 0.053530, "lolos_ekuitas": False, "lolos_likuid": False, "lolos_return": True},
    },
    "brinson": {"bench": 0.02235, "port": 0.02500, "excess": 0.00265,
                "allocation": 0.00285, "selection": 0.00040, "interaction": -0.00060},
}

fails = []
def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (f" — {detail}" if detail else ""))
    if not cond:
        fails.append(name)

def read_csv(path):
    with open(path) as f:
        r = csv.DictReader(f)
        return r.fieldnames, list(r)

# ── 1. file & dimensi ──
fn, rows = read_csv(os.path.join(BASE, "return_bulanan.csv"))
check("file return_bulanan.csv ada & 180 baris", len(rows) == DOC["n_rows"], f"n={len(rows)}")
check("6 kolom (tanggal + 5 aset)", fn == ["tanggal", "sbn", "deposito", "pasar_uang", "lq45", "emas"], str(fn))
check("rentang tanggal", rows[0]["tanggal"] == DOC["date_first"] and rows[-1]["tanggal"] == DOC["date_last"],
      f"{rows[0]['tanggal']}..{rows[-1]['tanggal']}")

R = {a: [float(r[a]) for r in rows] for a in DOC["exp"]}

# ── 2. CME sampel = DOC ──
def mean(x): return sum(x) / len(x)
def sd(x):
    m = mean(x); return math.sqrt(sum((v - m) ** 2 for v in x) / (len(x) - 1))
for a in DOC["exp"]:
    check(f"exp_{a}", abs(mean(R[a]) * 12 - DOC["exp"][a]) < 1e-6, f"{mean(R[a])*12:.6f}")
    check(f"vol_{a}", abs(sd(R[a]) * math.sqrt(12) - DOC["vol"][a]) < 1e-6, f"{sd(R[a])*math.sqrt(12):.6f}")

# ── 3. return objective ──
PV, PMT, n = DOC["klien"]["investable_pv_jt"], DOC["klien"]["tabungan_tahunan_jt"], DOC["klien"]["horizon_tahun"]
FV = DOC["klien"]["fv_target_jt"]
def fvv(r): return PV * (1 + r) ** n + PMT * (((1 + r) ** n - 1) / r)
lo, hi = 0.0, 0.20
for _ in range(300):
    mid = (lo + hi) / 2
    lo, hi = (mid, hi) if fvv(mid) < FV else (lo, mid)
r_star = (lo + hi) / 2
check("r* == 4,2358%", abs(r_star - DOC["r_star"]) < 5e-7, f"{r_star:.6f}")
check("FV(r*) == 20000", abs(fvv(r_star) - FV) < 0.01, f"{fvv(r_star):.2f}")

with open(os.path.join(BASE, "klien.json")) as f:
    kj = json.load(f)
check("klien.json konsisten", kj["investable_pv_jt"] == 8000.0 and kj["tabungan_tahunan_jt"] == 250.0
      and kj["horizon_tahun"] == 15
      and kj["target_dana_pensiun_jt"] + kj["target_pendidikan_jt"] + kj["target_waris_jt"] == FV)

# ── 4. SAA kandidat ──
TAX = [0.90, 0.80, 0.80, 1.0, 1.0]
ASSETS = list(DOC["exp"])
mu = [DOC["exp"][a] for a in ASSETS]
cov = [[0.0] * 5 for _ in range(5)]
for i in range(5):
    for j in range(5):
        xi, xj = R[ASSETS[i]], R[ASSETS[j]]
        mi, mj = mean(xi), mean(xj)
        cov[i][j] = sum((a - mi) * (b - mj) for a, b in zip(xi, xj)) / (len(xi) - 1) * 12
for key, d in DOC["saa"].items():
    w_ = d["w"]
    check(f"SAA {key} bobot = 1", abs(sum(w_) - 1.0) < 1e-12)
    er = sum(wi * mui for wi, mui in zip(w_, mu))
    vol = math.sqrt(sum(w_[i] * w_[j] * cov[i][j] for i in range(5) for j in range(5)))
    er_at = sum(wi * ti * mui for wi, ti, mui in zip(w_, TAX, mu))
    check(f"SAA {key} exp", abs(er - d["exp"]) < 1e-6, f"{er:.6f}")
    check(f"SAA {key} vol", abs(vol - d["vol"]) < 1e-4, f"{vol:.6f}")
    check(f"SAA {key} after-tax", abs(er_at - d["aftertax"]) < 1e-6, f"{er_at:.6f}")
    check(f"SAA {key} ekuitas<=40%", (w_[3] <= 0.40) == d["lolos_ekuitas"])
    check(f"SAA {key} likuid>=15%", ((w_[1] + w_[2]) >= 0.15) == d["lolos_likuid"])
    check(f"SAA {key} exp>=r*", (er >= r_star) == d["lolos_return"])

# ── 5. Brinson ──
fn2, arows = read_csv(os.path.join(BASE, "atribusi.csv"))
A = [{"w_port": float(r["w_portfolio"]), "w_bench": float(r["w_benchmark"]),
      "r_port": float(r["r_portfolio"]), "r_bench": float(r["r_benchmark"])} for r in arows]
rb = sum(a["w_bench"] * a["r_bench"] for a in A)
rp = sum(a["w_port"] * a["r_port"] for a in A)
al = sum((a["w_port"] - a["w_bench"]) * (a["r_bench"] - rb) for a in A)
se = sum(a["w_bench"] * (a["r_port"] - a["r_bench"]) for a in A)
it = sum((a["w_port"] - a["w_bench"]) * (a["r_port"] - a["r_bench"]) for a in A)
b = DOC["brinson"]
check("atribusi 3 baris", len(A) == 3)
for k, v in [("bench", rb), ("port", rp), ("excess", rp - rb), ("allocation", al),
             ("selection", se), ("interaction", it)]:
    check(f"brinson {k}", abs(v - b[k]) < 1e-12, f"{v:.6f}")
check("brinson jumlah = excess", abs((al + se + it) - (rp - rb)) < 1e-15)

print(f"\n=== {len(fails)} FAIL dari harness ===" if fails else "\n=== SEMUA CHECK PASS ===")
sys.exit(1 if fails else 0)

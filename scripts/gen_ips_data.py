#!/usr/bin/env python3
"""Generator data Proyek #5 pj-ips-portofolio — Konstruksi Portofolio Berbasis IPS.

100% SINTETIS, deterministik (numpy RNG seed 42). Output:
  public/proyek/pj-ips-portofolio/return_bulanan.csv  (180 bln, 5 kelas aset, return RIIL desimal)
  public/proyek/pj-ips-portofolio/atribusi.csv        (data atribusi Brinson Q1 2026, exact)
  public/proyek/pj-ips-portofolio/klien.json          (angka kasus klien)
Mencetak SEMUA angka ground truth untuk METODE.md + checks lab .ts.
"""
import csv, json, math, os
import numpy as np

SEED = 42
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "proyek", "pj-ips-portofolio")
os.makedirs(OUT, exist_ok=True)

rng = np.random.default_rng(SEED)

ASSETS = ["sbn", "deposito", "pasar_uang", "lq45", "emas"]
ANN_MEAN = np.array([0.035, 0.015, 0.022, 0.075, 0.030])   # target return riil tahunan
ANN_VOL = np.array([0.020, 0.008, 0.010, 0.180, 0.150])    # target vol tahunan
CORR = np.array([
    [1.00, 0.60, 0.55, -0.10, 0.05],
    [0.60, 1.00, 0.50, -0.05, 0.02],
    [0.55, 0.50, 1.00, -0.08, 0.03],
    [-0.10, -0.05, -0.08, 1.00, 0.15],
    [0.05, 0.02, 0.03, 0.15, 1.00],
])

N = 180
m_mean = ANN_MEAN / 12.0
m_cov = np.outer(ANN_VOL, ANN_VOL) / 12.0 * CORR
R = rng.multivariate_normal(m_mean, m_cov, size=N)

# Reskalakan tiap aset agar mean & vol SAMPEL persis = target (korelasi sampel
# tetap ≈ matriks target; dicatat di METODE). Ini membuat CME ground truth
# eksak dan bisa dihitung ulang tangan.
m_mean_t = ANN_MEAN / 12.0
m_vol_t = ANN_VOL / math.sqrt(12)
for j in range(len(ASSETS)):
    R[:, j] = (R[:, j] - R[:, j].mean()) / R[:, j].std(ddof=1) * m_vol_t[j] + m_mean_t[j]

months = []
y, m = 2011, 1
for _ in range(N):
    months.append(f"{y:04d}-{m:02d}")
    m += 1
    if m > 12:
        m = 1; y += 1

with open(os.path.join(OUT, "return_bulanan.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["tanggal"] + ASSETS)
    for i in range(N):
        w.writerow([months[i]] + [f"{x:.6f}" for x in R[i]])

# ── statistik sampel (CME) ──
samp_mean_ann = R.mean(axis=0) * 12
samp_vol_ann = R.std(axis=0, ddof=1) * math.sqrt(12)
samp_corr = np.corrcoef(R.T)

# ── atribusi Brinson Q1 2026 (exact, planted) ──
# kelas: Saham LQ45, Obligasi/SBN, Likuid
ATR = [
    {"kelas": "Saham LQ45", "w_port": 0.45, "w_bench": 0.35, "r_port": 0.036, "r_bench": 0.040},
    {"kelas": "Obligasi/SBN", "w_port": 0.40, "w_bench": 0.45, "r_port": 0.019, "r_bench": 0.015},
    {"kelas": "Likuid", "w_port": 0.15, "w_bench": 0.20, "r_port": 0.008, "r_bench": 0.008},
]
with open(os.path.join(OUT, "atribusi.csv"), "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["kelas", "w_portfolio", "w_benchmark", "r_portfolio", "r_benchmark"])
    for a in ATR:
        w.writerow([a["kelas"], a["w_port"], a["w_bench"], a["r_port"], a["r_bench"]])

r_b_total = sum(a["w_bench"] * a["r_bench"] for a in ATR)
r_p_total = sum(a["w_port"] * a["r_port"] for a in ATR)
alloc = sum((a["w_port"] - a["w_bench"]) * (a["r_bench"] - r_b_total) for a in ATR)
selec = sum(a["w_bench"] * (a["r_port"] - a["r_bench"]) for a in ATR)
inter = sum((a["w_port"] - a["w_bench"]) * (a["r_port"] - a["r_bench"]) for a in ATR)

# ── kasus klien (juta rupiah) ──
KLIEN = {
    "nama": "dr. Ardi Wibowo", "usia": 45, "kota": "Makassar",
    "investable_pv_jt": 8000.0,
    "tabungan_tahunan_jt": 250.0,
    "horizon_tahun": 15,
    "target_dana_pensiun_jt": 16000.0,
    "target_pendidikan_jt": 2000.0,
    "target_waris_jt": 2000.0,
    "kebutuhan_likuiditas_18bln_jt": 800.0,
    "dana_darurat_jt": 300.0,
    "pph_final_obligasi": 0.10, "pph_final_deposito": 0.20,
    "pph_final_pasar_uang": 0.20, "pph_final_dividen": 0.10,
    "batas_ekuitas": 0.40, "batas_likuid_min": 0.15, "batas_single_name": 0.10,
}
FV = KLIEN["target_dana_pensiun_jt"] + KLIEN["target_pendidikan_jt"] + KLIEN["target_waris_jt"]
with open(os.path.join(OUT, "klien.json"), "w") as f:
    json.dump(KLIEN, f, indent=2, ensure_ascii=False)

# ── return objective: PV(1+r)^n + PMT*[((1+r)^n - 1)/r] = FV ──
PV, PMT, n = KLIEN["investable_pv_jt"], KLIEN["tabungan_tahunan_jt"], KLIEN["horizon_tahun"]
def fv(r):
    return PV * (1 + r) ** n + PMT * (((1 + r) ** n - 1) / r)
lo, hi = 0.0, 0.20
for _ in range(200):
    mid = (lo + hi) / 2
    if fv(mid) < FV:
        lo = mid
    else:
        hi = mid
r_star = (lo + hi) / 2

# ── SAA kandidat ──
CAND = {
    "A Konservatif": np.array([0.45, 0.15, 0.10, 0.25, 0.05]),
    "B Seimbang":    np.array([0.35, 0.10, 0.10, 0.35, 0.10]),
    "C Agresif":     np.array([0.20, 0.05, 0.05, 0.55, 0.15]),
}
ann_cov = np.cov(R.T, ddof=1) * 12
TAX = np.array([1 - 0.10, 1 - 0.20, 1 - 0.20, 1.0, 1.0])  # sbn, dep, pu kena PPh final; lq45 & emas dianggap bersih

print("=== GROUND TRUTH pj-ips-portofolio (seed 42) ===")
print(f"baris return_bulanan.csv: {N}, kolom: tanggal+{len(ASSETS)}, periode: {months[0]} s.d. {months[-1]}")
print("\n-- CME sampel (return riil tahunan, dari dataset) --")
for i, a in enumerate(ASSETS):
    print(f"  exp_{a}: {samp_mean_ann[i]:.4f}  vol_{a}: {samp_vol_ann[i]:.4f}")
print("\n-- korelasi sampel (2 desimal) --")
print(np.round(samp_corr, 2))
print(f"\n-- return objective: FV target Rp {FV:,.0f} jt; r* = {r_star:.6f} ({r_star*100:.2f}% riil)")
print("\n-- SAA kandidat (pre-tax expected, vol; dari dataset) --")
for name, w_ in CAND.items():
    er = float(w_ @ samp_mean_ann); vol = float(math.sqrt(w_ @ ann_cov @ w_))
    er_at = float((w_ * TAX) @ samp_mean_ann)
    ok_eq = w_[3] <= 0.40; ok_lq = (w_[1] + w_[2]) >= 0.15
    print(f"  {name}: w={list(np.round(w_,2))} exp={er:.4f} vol={vol:.4f} aftertax={er_at:.4f} "
          f"| ekuitas<=40%: {ok_eq} likuid>=15%: {ok_lq} exp>=r*: {er >= r_star}")
print(f"\n-- Brinson Q1 2026: bench={r_b_total*100:.3f}% port={r_p_total*100:.3f}% "
      f"excess={(r_p_total-r_b_total)*100:.3f}%")
print(f"  allocation={alloc*100:.4f}% selection={selec*100:.4f}% interaction={inter*100:.4f}% "
      f"sum={(alloc+selec+inter)*100:.4f}%")
print("\n-- impostor: usulan 85% BBCA / 10% 2 saham / 5% deposito --")
print("  single-name 85% vs batas 10% (8,5x); ekuitas 95% vs batas 40%; "
      "likuid 5%*8000=400jt < 1100jt; janji 12% vs CME lq45 "
      f"{samp_mean_ann[3]*100:.2f}%")
print("\nFILES:", sorted(os.listdir(OUT)))

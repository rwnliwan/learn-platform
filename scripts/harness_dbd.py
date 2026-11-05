#!/usr/bin/env python3
"""Harness verifikasi Proyek E1 pj-dbd-surveilans.

Memeriksa konsistensi ground truth vs dataset (public/proyek/pj-dbd-surveilans/).
Setiap check PASS/FAIL eksplisit; exit 0 bila semua PASS.
Konstanta DOC di bawah = ground truth resmi (dari gen_dbd_data.py, seed 42).
"""
import csv, math, os, sys
import numpy as np

BASE = os.path.join(os.path.dirname(__file__), "..", "public", "proyek", "pj-dbd-surveilans")

DOC = {
    "weeks": 130, "kecamatan": 6,
    "event_weeks": [27, 67, 89, 108, 115],
    "onset_weeks": [34, 74, 96, 122],
    "ambang_hujan": 100.0,
    "n_peringatan": 5, "tp": 4, "fp": 1,
    "precision": 0.80, "recall": 1.00, "lead_time_minggu": 7,
    "lag_puncak": 7,
    "n_duplikat": 12, "minggu_hilang": [55, 56], "n_salah_eja": 6,
    "acc_jujur": 0.7829, "acc_bocor": 0.9535,
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
fn, kasus = read_csv(os.path.join(BASE, "kasus_dbd.csv"))
check("kasus_dbd.csv: 780 baris", len(kasus) == DOC["weeks"] * DOC["kecamatan"], f"n={len(kasus)}")
check("kasus_dbd.csv: kolom", fn == ["minggu", "kecamatan", "kasus"], str(fn))
fn, cuaca = read_csv(os.path.join(BASE, "cuaca.csv"))
check("cuaca.csv: 130 baris", len(cuaca) == DOC["weeks"], f"n={len(cuaca)}")
check("cuaca.csv: kolom", fn == ["minggu", "curah_hujan_mm", "suhu_c", "kelembapan_pct"], str(fn))
fn, lap = read_csv(os.path.join(BASE, "laporan_puskesmas.csv"))
check("laporan_puskesmas.csv: kolom", fn == ["minggu", "kecamatan", "kasus_lapor"], str(fn))
fn, fit = read_csv(os.path.join(BASE, "fitur_vendor.csv"))
check("fitur_vendor.csv: 129 baris + kolom",
      len(fit) == DOC["weeks"] - 1 and fn == ["minggu", "hujan_mm", "kasus_total", "suhu_c", "rawat_inap"],
      f"n={len(fit)}")

rain = np.array([float(r["curah_hujan_mm"]) for r in cuaca])
total = np.array([sum(int(k["kasus"]) for k in kasus if int(k["minggu"]) == w)
                  for w in range(1, DOC["weeks"] + 1)], dtype=float)

# ── 2. aturan peringatan jujur ──
warns = [w for w in range(1, DOC["weeks"] + 1) if rain[w - 1] > DOC["ambang_hujan"]]
check("peringatan tepat di 5 event hujan", warns == DOC["event_weeks"], str(warns))
tp = sum(1 for w in warns if (w + DOC["lead_time_minggu"]) in DOC["onset_weeks"])
fp = len(warns) - tp
check("TP=4 (4 onset tertangkap)", tp == DOC["tp"], f"tp={tp}")
check("FP=1 (event 108 false alarm)", fp == DOC["fp"], f"fp={fp}")
check("precision=0,80", abs(tp / len(warns) - DOC["precision"]) < 1e-9, f"{tp/len(warns):.4f}")
check("recall=1,00", abs(tp / len(DOC["onset_weeks"]) - DOC["recall"]) < 1e-9)
check("tidak ada hujan non-event > ambang",
      max(r for i, r in enumerate(rain, start=1) if i not in DOC["event_weeks"]) < DOC["ambang_hujan"])

# ── 3. korelasi lag ──
corrs = {}
for lag in range(0, 13):
    x, y = rain[:DOC["weeks"] - lag], total[lag:]
    corrs[lag] = float(np.corrcoef(x, y)[0, 1])
lag_peak = max(corrs, key=corrs.get)
check("puncak korelasi di lag 7", lag_peak == DOC["lag_puncak"],
      f"lag={lag_peak} r={corrs[lag_peak]:.4f}")
check("korelasi lag 7 dominan (>0,5 & >2x lag lain)",
      corrs[7] > 0.5 and corrs[7] > 2 * max(c for l, c in corrs.items() if l != 7),
      f"r7={corrs[7]:.3f}")

# ── 4. sumber kotor: duplikat / hilang / salah eja ──
tup = [(r["minggu"], r["kecamatan"], r["kasus_lapor"]) for r in lap]
seen, dups = set(), 0
for t in tup:
    if t in seen:
        dups += 1
    seen.add(t)
check("duplikat terdeteksi = 12", dups == DOC["n_duplikat"], f"dups={dups}")
have_weeks = {int(r["minggu"]) for r in lap}
missing = [w for w in range(1, DOC["weeks"] + 1) if w not in have_weeks]
check("minggu hilang = [55, 56]", missing == DOC["minggu_hilang"], str(missing))
typo = sum(1 for r in lap if r["kecamatan"] == "Panakukang")
check("salah eja 'Panakukang' = 6", typo == DOC["n_salah_eja"], f"n={typo}")
# setelah dibersihkan: total per minggu cocok dengan kasus_dbd.csv
clean = {}
for r in lap:
    k = r["kecamatan"].replace("Panakukang", "Panakkukang")
    key = (int(r["minggu"]), k)
    clean[key] = int(r["kasus_lapor"])  # duplikat tertimpa = dedupe
ref = {(int(k["minggu"]), k["kecamatan"]): int(k["kasus"]) for k in kasus}
mismatch = sum(1 for key, v in clean.items() if ref.get(key) != v)
check("setelah bersih: nilai cocok dengan kasus_dbd.csv", mismatch == 0 and len(clean) == 768,
      f"mismatch={mismatch} n={len(clean)}")

# ── 5. model vendor: akurasi jujur vs bocor ──
n = DOC["weeks"] - 1
tgt = (total[1:] > 130).astype(int)
hujan = np.array([float(r["hujan_mm"]) for r in fit])
kas = np.array([float(r["kasus_total"]) for r in fit])
rawat = np.array([float(r["rawat_inap"]) for r in fit])
def z(v):
    v = v.astype(float)
    return (v - v.mean()) / (v.std() + 1e-9)
sj = 0.5 * z(hujan) + 0.3 * z(kas) + 0.2 * z(np.roll(hujan, 1))
sb = 0.6 * z(rawat) + 0.25 * z(kas) + 0.15 * z(hujan)
aj = float((((sj > 0.6).astype(int)) == tgt).mean())
ab = float((((sb > 0.6).astype(int)) == tgt).mean())
check("akurasi jujur = 78,29%", abs(aj - DOC["acc_jujur"]) < 1e-4, f"{aj:.4f}")
check("akurasi bocor = 95,35%", abs(ab - DOC["acc_bocor"]) < 1e-4, f"{ab:.4f}")
check("gap leakage > 15pp", ab - aj > 0.15, f"gap={(ab-aj)*100:.1f}pp")

# ── 6. solusi lab dieksekusi (tanpa pandas; logika yang sama dengan solusi konten) ──
# Lab 1: n_baris_kasus
n_baris_kasus = len(kasus)
check("solusi lab1: n_baris_kasus=780", n_baris_kasus == 780)
# Lab 2: lag puncak
check("solusi lab2: lag_puncak=7", lag_peak == 7)
# Lab 3: precision/recall
check("solusi lab3: precision=0,80 & recall=1,00",
      abs(tp / len(warns) - 0.80) < 1e-9 and abs(tp / 4 - 1.00) < 1e-9)
# Lab 4: akurasi
check("solusi lab4: acc_jujur≈0,7829 & acc_bocor≈0,9535",
      abs(aj - 0.7829) < 0.005 and abs(ab - 0.9535) < 0.005)

print(f"\n=== {len(fails)} FAIL dari harness ===" if fails else "\n=== SEMUA CHECK PASS ===")
sys.exit(1 if fails else 0)

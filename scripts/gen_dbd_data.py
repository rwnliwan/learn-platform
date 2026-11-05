#!/usr/bin/env python3
"""Generator data sintetis deterministik — Proyek E1: Surveilans & Peringatan Dini DBD.

Seed tetap (42). Output ke public/proyek/pj-dbd-surveilans/:
  - kasus_dbd.csv        : minggu, kecamatan, kasus (780 baris = 130 minggu x 6 kecamatan)
  - cuaca.csv            : minggu, curah_hujan_mm, suhu_c, kelembapan_pct (130 baris)
  - laporan_puskesmas.csv: sumber ketiga yang KOTOR disengaja (duplikat, minggu hilang, salah eja)

Ground truth (dicetak di akhir; dipakai harness + METODE.md + konten):
  - 5 event hujan ekstrem di minggu EVENT_WEEKS; 4 di antaranya memicu wabah
    dengan onset di ONSET_WEEKS (= event + 7); 1 event (108) false alarm.
  - Aturan peringatan jujur: "peringatan di minggu w bila curah_hujan[w] > 100"
    -> tepat 5 peringatan; precision 4/5 = 0,80; recall 4/4 = 1,00; lead time 7 minggu.
  - Puncak korelasi silang hujan->kasus di lag 7 minggu.
"""
import csv
import os
import numpy as np

SEED = 42
WEEKS = 130
KECAMATAN = ["Panakkukang", "Tamalate", "Rappocini", "Manggala", "Biringkanaya", "Tallo"]
BASE_CASES = [14, 11, 9, 7, 12, 8]          # kasus endemik mingguan per kecamatan
EVENT_WEEKS = [27, 67, 89, 108, 115]        # minggu hujan ekstrem (+130 mm)
ONSET_WEEKS = [34, 74, 96, 122]             # onset wabah = event+7 (event 108: false alarm)
AMBANG_HUJAN = 100.0                        # mm; aturan peringatan jujur
MISSING_WEEKS = [55, 56]                    # "libur pelaporan" di laporan_puskesmas
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "proyek", "pj-dbd-surveilans")
os.makedirs(OUT, exist_ok=True)

rng = np.random.default_rng(SEED)

def week_of_year(w):
    return ((w - 1) % 52) + 1

# --- Cuaca: musiman (hujan Nov-Apr ~ woy 45-52 & 1-16) + 5 event ekstrem ---
rain, suhu, lembap = [], [], []
for w in range(1, WEEKS + 1):
    woy = week_of_year(w)
    wet = woy >= 45 or woy <= 16
    base = 35.0 if wet else 8.0
    sd = 15.0 if wet else 6.0
    r = max(0.0, base + rng.normal(0, sd))
    if w in EVENT_WEEKS:
        r += 130.0
    rain.append(round(r, 1))
    suhu.append(round(28.0 + 2.0 * np.sin(2 * np.pi * (woy - 4) / 52) + rng.normal(0, 0.6), 1))
    lembap.append(round(min(98.0, max(55.0, 72.0 + 0.12 * r + rng.normal(0, 3.0))), 1))

# --- Kasus DBD: endemik + respons lag-7 terhadap hujan + impuls wabah ---
cases = {k: [0] * (WEEKS + 1) for k in KECAMATAN}  # index 1..WEEKS
for wi, k in enumerate(KECAMATAN):
    base = BASE_CASES[wi]
    for w in range(1, WEEKS + 1):
        rl = rain[w - 1 - 7] if w - 7 >= 1 else 0.0
        endemic = base * (0.6 + 0.8 * rl / 60.0)
        val = endemic + rng.integers(-2, 3)
        cases[k][w] = max(0, int(round(val)))
    for o in ONSET_WEEKS:  # impuls wabah: 6 minggu meluruh
        size = base * 5
        for j in range(6):
            if o + j <= WEEKS:
                cases[k][o + j] += int(round(size * (0.75 ** j)))

with open(os.path.join(OUT, "kasus_dbd.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["minggu", "kecamatan", "kasus"])
    for w in range(1, WEEKS + 1):
        for k in KECAMATAN:
            wtr.writerow([w, k, cases[k][w]])

with open(os.path.join(OUT, "cuaca.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["minggu", "curah_hujan_mm", "suhu_c", "kelembapan_pct"])
    for w in range(1, WEEKS + 1):
        wtr.writerow([w, rain[w - 1], suhu[w - 1], lembap[w - 1]])

# --- Sumber ketiga (kotor disengaja): duplikat + minggu hilang + salah eja ---
rows = []
for w in range(1, WEEKS + 1):
    if w in MISSING_WEEKS:
        continue
    for k in KECAMATAN:
        rows.append([w, k, cases[k][w]])
DUP_IDX = [10, 45, 80, 120, 200, 260, 330, 400, 470, 540, 610, 700]  # 12 duplikat
for i in DUP_IDX:
    rows.append(list(rows[i]))
# 6 baris "Panakkukang" salah eja -> "Panakukang". Baris Panakkukang ada di
# indeks kelipatan 6 (urutan kecamatan berulang); dipilih yang TIDAK menabrak DUP_IDX.
for i in [0, 60, 126, 240, 360, 480]:
    assert rows[i][1] == "Panakkukang"
    rows[i][1] = "Panakukang"
rng.shuffle(rows)
with open(os.path.join(OUT, "laporan_puskesmas.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["minggu", "kecamatan", "kasus_lapor"])
    wtr.writerows(rows)

# --- Ground truth: evaluasi aturan peringatan & korelasi lag ---
warns = [w for w in range(1, WEEKS + 1) if rain[w - 1] > AMBANG_HUJAN]
tp = sum(1 for w in warns if any(1 <= o - w <= 10 and abs((o - 7) - w) <= 0 for o in ONSET_WEEKS))
# definisi TP: peringatan di minggu w menangkap onset o bila w == o-7 (lead time 7 minggu)
tp = sum(1 for w in warns if (w + 7) in ONSET_WEEKS)
fp = len(warns) - tp
prec = tp / len(warns)
rec = tp / len(ONSET_WEEKS)
total = np.array([sum(cases[k][w] for k in KECAMATAN) for w in range(1, WEEKS + 1)], dtype=float)
rain_a = np.array(rain)
corrs = {}
for lag in range(0, 13):
    x = rain_a[:WEEKS - lag]
    y = total[lag:]
    corrs[lag] = float(np.corrcoef(x, y)[0, 1])
lag_peak = max(corrs, key=corrs.get)
max_non_event = max(r for i, r in enumerate(rain, start=1) if i not in EVENT_WEEKS)

# --- Model vendor: akurasi dengan vs tanpa fitur bocor ---
tgt = (total[1:] > 130).astype(int)          # wabah minggu depan? (minggu 1..129)
n = len(tgt)
feat = {
    "hujan": rain_a[:n], "hujan_lag1": np.roll(rain_a, 1)[:n],
    "kasus": total[:n], "kasus_lag1": np.roll(total, 1)[:n],
    "suhu": np.array(suhu[:n]),
}
rawat = np.round(0.85 * total[:n] + rng.normal(0, 2, n)).astype(int)  # BOCOR: proksi kasus minggu berjalan
def z(v):
    v = v.astype(float)
    return (v - v.mean()) / (v.std() + 1e-9)
score_jujur = 0.5 * z(feat["hujan"]) + 0.3 * z(feat["kasus"]) + 0.2 * z(feat["hujan_lag1"])
score_bocor = 0.6 * z(rawat) + 0.25 * z(feat["kasus"]) + 0.15 * z(feat["hujan"])
acc_jujur = float((((score_jujur > 0.6).astype(int)) == tgt).mean())
acc_bocor = float((((score_bocor > 0.6).astype(int)) == tgt).mean())

# file fitur vendor (dipakai Lab 4 untuk membongkar leakage)
with open(os.path.join(OUT, "fitur_vendor.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["minggu", "hujan_mm", "kasus_total", "suhu_c", "rawat_inap"])
    for i in range(n):
        wtr.writerow([i + 1, rain[i], int(total[i]), suhu[i], int(rawat[i])])

print("=== GROUND TRUTH DBD (seed 42) ===")
print(f"baris kasus_dbd.csv: {WEEKS * len(KECAMATAN)} | baris cuaca.csv: {WEEKS} | baris laporan_puskesmas.csv: {len(rows)}")
print(f"event hujan: {EVENT_WEEKS} | onset wabah: {ONSET_WEEKS}")
print(f"peringatan (hujan>{AMBANG_HUJAN:g}): {warns} (n={len(warns)})")
print(f"TP={tp} FP={fp} | precision={prec:.4f} | recall={rec:.4f} | lead time 7 minggu")
print(f"lag puncak korelasi hujan->kasus: {lag_peak} (r={corrs[lag_peak]:.4f}); korelasi lag 0..12: " +
      ", ".join(f"{l}:{c:.2f}" for l, c in corrs.items()))
print(f"hujan maks non-event: {max_non_event:.1f} mm (< {AMBANG_HUJAN:g}: aturan bersih)")
print(f"duplikat ditanam: {len(DUP_IDX)} | minggu hilang: {MISSING_WEEKS} ({len(MISSING_WEEKS)*len(KECAMATAN)} baris) | salah eja: 6")
print(f"akurasi model JUJUR (tanpa rawat inap): {acc_jujur:.4f}")
print(f"akurasi model BOCOR (dengan rawat inap): {acc_bocor:.4f}")
print(f"total kasus kota minggu puncak: {int(total.max())} (minggu {int(total.argmax())+1})")

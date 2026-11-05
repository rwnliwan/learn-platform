#!/usr/bin/env python3
"""Generator dataset SINTETIS misi-dua-definisi-revenue (seed 42).

Output:
  public/misi/misi-dua-definisi-revenue/kas_masuk.csv      (satu baris per order)
  public/misi/misi-dua-definisi-revenue/pengakuan.csv      (jadwal pengakuan per order)
  public/misi/misi-dua-definisi-revenue/definisi_metrik.csv
  public/misi/misi-dua-definisi-revenue/METODE.md
Juga mencetak nilai ekspektasi untuk lab (checks) + seed SQL.
"""
import csv, random
from datetime import date
from pathlib import Path

SEED = 42
random.seed(SEED)

PUB = Path.home() / "workspace/learn-platform/public/misi/misi-dua-definisi-revenue"
PUB.mkdir(parents=True, exist_ok=True)

# Rancangan jebakan: Q1 banyak order BESAR bertipe LANGGANAN (kas masuk
# tinggi, pengakuan tersebar 4 bulan); Q2 order lebih sedikit & kecil bertipe
# SEKALI (kas masuk turun) — tapi sisa pengakuan langganan Q1 mengalir ke Q2
# sehingga "diakui" Q2 NAIK. Dashboard memakai kas di Q1 lalu diakui di Q2
# agar tren selalu terlihat naik.
plan = {1: 30, 2: 28, 3: 26, 4: 20, 5: 18, 6: 18}  # order per bulan

kas_rows, aku_rows = [], []
oid = 1
for m in range(1, 7):
    for _ in range(plan[m]):
        day = random.randint(1, 28)
        tgl = date(2026, m, day).isoformat()
        # Q1: deal besar; Q2: deal kecil
        mu = 13.2 if m <= 3 else 12.7
        nominal = int(round(random.lognormvariate(mu, 0.7)))
        nominal = min(max(nominal, 50000), 8000000)
        # langganan hanya Jan-Mar supaya seluruh pengakuan tetap di dalam H1
        tipe = random.choices(["sekali", "langganan"], weights=[0.25, 0.75])[0] if m <= 3 else "sekali"
        kas_rows.append({"order_id": f"ORD{oid:04d}", "tanggal_order": tgl,
                         "nominal": nominal, "tipe": tipe})
        if tipe == "sekali":
            aku_rows.append({"order_id": f"ORD{oid:04d}", "bulan_pengakuan": f"2026-{m:02d}",
                             "nominal_diakui": nominal})
        else:
            # langganan: dibagi rata 4 bulan (bulan order + 3 bulan berikut)
            parts, sisa = [], nominal
            for i in range(3):
                p = nominal // 4
                parts.append(p); sisa -= p
            parts.append(sisa)
            for i, p in enumerate(parts):
                aku_rows.append({"order_id": f"ORD{oid:04d}",
                                 "bulan_pengakuan": f"2026-{m+i:02d}",
                                 "nominal_diakui": p})
        oid += 1

with open(PUB / "kas_masuk.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["order_id", "tanggal_order", "nominal", "tipe"])
    w.writeheader(); w.writerows(kas_rows)

with open(PUB / "pengakuan.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["order_id", "bulan_pengakuan", "nominal_diakui"])
    w.writeheader(); w.writerows(aku_rows)

with open(PUB / "definisi_metrik.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["definisi_id", "nama", "definisi", "dipakai_oleh", "versi"])
    w.writerow(["D1", "Revenue (Finance)", "kas masuk: nominal diakui pada bulan tanggal_order (satu order dihitung sekali)", "Finance", "v1"])
    w.writerow(["D2", "Revenue (Product)", "pengakuan: nominal diakui pada bulan_pengakuan sesuai jadwal (langganan dibagi 2 bulan)", "Product", "v1"])

metode = """# METODE — Misi Metrik: Dua Definisi, Satu Kebohongan (misi-dua-definisi-revenue)

- **Status data: 100% SINTETIS.** Tidak ada pendapatan perusahaan nyata. Seluruh baris dibangkitkan oleh skrip `build-misi/misi-dua-definisi-revenue/gen.py` dengan seed tetap 42 — deterministik penuh.
- **Rancangan:** 140 order sintetis, Jan–Jun 2026 (30/28/26/20/18/18 per bulan). Q1 memakai deal BESAR (lognormal mu=13.2) dengan porsi langganan 75%; Q2 deal lebih kecil (mu=12.7) dan seluruhnya sekali bayar; nominal dijepit [50000, 8000000] rupiah. Langganan hanya untuk order Jan–Mar, diakui rata selama 4 bulan (bulan order + 3 bulan berikut) agar seluruh pengakuan tetap di dalam semester.
- **Dua file, dua definisi:** `kas_masuk.csv` (order_id, tanggal_order, nominal, tipe) = definisi Finance "revenue = kas masuk"; `pengakuan.csv` (order_id, bulan_pengakuan, nominal_diakui) = definisi Product "revenue = pengakuan". Keduanya turun dari order yang SAMA — selisihnya murni soal waktu pengakuan, bukan data berbeda.
- **Skema `definisi_metrik.csv`:** definisi_id, nama, definisi, dipakai_oleh, versi — kamus dua definisi yang bersaing.
- **Baseline pembanding Q4-2025** (ditetapkan di misi, bukan dari data): kas_masuk = 55% dari kas Q1; diakui = 90% dari diakui Q1 — dipakai Lab 2 untuk menguji klaim "tumbuh vs kuartal lalu".
- **Tanggal pembuatan:** 2026-10-15. Lisensi: sintetis untuk misi ini — bebas dipakai ulang dengan atribusi ke misi ini.
- **Batas jujur:** pola "Q1 kas tinggi / Q2 pengakuan tinggi" dirancang agar jebakan dashboard (definisi bergantian) terlihat jelas. Di dunia nyata, selisih pengakuan vs kas biasanya lebih halus — pelajar tetap harus memeriksa definisi, bukan mengasumsikan pola.
"""
(PUB / "METODE.md").write_text(metode)

# ── ekspektasi ──────────────────────────────────────────────────────────
from collections import defaultdict
kas_m = defaultdict(int); aku_m = defaultdict(int)
for r in kas_rows:
    kas_m[r["tanggal_order"][:7]] += r["nominal"]
for r in aku_rows:
    aku_m[r["bulan_pengakuan"]] += r["nominal_diakui"]

bulans = [f"2026-{m:02d}" for m in range(1, 7)]
print("bulan | kas_masuk | diakui | selisih")
for b in bulans:
    print(f"{b} | {kas_m[b]} | {aku_m[b]} | {kas_m[b]-aku_m[b]}")

kas_q1 = sum(kas_m[f"2026-{m:02d}"] for m in (1, 2, 3))
kas_q2 = sum(kas_m[f"2026-{m:02d}"] for m in (4, 5, 6))
aku_q1 = sum(aku_m[f"2026-{m:02d}"] for m in (1, 2, 3))
aku_q2 = sum(aku_m[f"2026-{m:02d}"] for m in (4, 5, 6))
print(f"\nkas_q1={kas_q1} kas_q2={kas_q2} tumbuh_kas_pct={(kas_q2-kas_q1)/kas_q1*100:.2f}")
print(f"aku_q1={aku_q1} aku_q2={aku_q2} tumbuh_aku_pct={(aku_q2-aku_q1)/aku_q1*100:.2f}")

# baseline Q4-2025 (ditetapkan, dipakai Lab 2)
kas_q4 = round(kas_q1 * 0.55); aku_q4 = round(aku_q1 * 0.90)
print(f"\nkas_q4_2025={kas_q4} aku_q4_2025={aku_q4}")
print(f"g_kas_q1={(kas_q1-kas_q4)/kas_q4*100:.2f} g_aku_q1={(aku_q1-aku_q4)/aku_q4*100:.2f}")
print(f"g_kas_q2={(kas_q2-kas_q1)/kas_q1*100:.2f} g_aku_q2={(aku_q2-aku_q1)/aku_q1*100:.2f}")
print(f"\nn_kas_rows={len(kas_rows)} n_aku_rows={len(aku_rows)}")

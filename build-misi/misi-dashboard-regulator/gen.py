#!/usr/bin/env python3
"""Generator dataset SINTETIS misi-dashboard-regulator (seed 42).

Output:
  public/misi/misi-dashboard-regulator/transaksi.csv
  public/misi/misi-dashboard-regulator/definisi_metrik.csv
  public/misi/misi-dashboard-regulator/METODE.md
Juga mencetak nilai ekspektasi untuk lab (checks) + cuplikan seed SQL.
"""
import csv, random
from datetime import date, timedelta
from pathlib import Path

SEED = 42
random.seed(SEED)

PUB = Path.home() / "workspace/learn-platform/public/misi/misi-dashboard-regulator"
PUB.mkdir(parents=True, exist_ok=True)

start, end = date(2026, 1, 1), date(2026, 3, 31)
days = [start + timedelta(days=i) for i in range((end - start).days + 1)]

users = [f"U{i:04d}" for i in range(1, 401)]
kanal_w = [("aplikasi", 0.50), ("web", 0.30), ("agen", 0.20)]
wilayah = ["JKT", "SBY", "BDG", "MDN"]
status_w = [("valid", 0.78), ("gagal", 0.10), ("pending", 0.07), ("void", 0.05)]

def pick(weighted):
    r = random.random()
    acc = 0.0
    for v, w in weighted:
        acc += w
        if r < acc:
            return v
    return weighted[-1][0]

rows = []
tid = 1
for d in days:
    n = random.randint(12, 28)
    for _ in range(n):
        nominal = int(round(random.lognormvariate(12.0, 0.8)))
        nominal = min(max(nominal, 20000), 5000000)
        # sedikit "kotor": 1% baris void ber-nominal 0 (data entry rusak)
        st = pick(status_w)
        if st == "void" and random.random() < 0.2:
            nominal = 0
        rows.append({
            "transaksi_id": f"TX{tid:05d}",
            "tanggal": d.isoformat(),
            "user_id": random.choice(users),
            "nominal": nominal,
            "status": st,
            "kanal": pick(kanal_w),
            "wilayah": random.choice(wilayah),
        })
        tid += 1

with open(PUB / "transaksi.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["transaksi_id", "tanggal", "user_id", "nominal", "status", "kanal", "wilayah"])
    w.writeheader()
    w.writerows(rows)

with open(PUB / "definisi_metrik.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["metric_id", "nama_metrik", "definisi", "versi", "berlaku_mulai"])
    w.writerow(["M1", "Pengguna aktif", "distinct user_id dengan >=1 transaksi berstatus 'valid' dalam satu bulan kalender", "v1", "2026-01-01"])
    w.writerow(["M2", "Transaksi valid", "baris dengan status = 'valid'", "v1", "2026-01-01"])
    w.writerow(["M3", "Total nominal valid", "jumlah kolom nominal untuk baris status = 'valid'", "v1", "2026-01-01"])
    w.writerow(["M4", "Tingkat validitas", "n_valid / n_total baris (semua status)", "v1", "2026-01-01"])

metode = """# METODE — Misi Dashboard: Angka yang Bisa Dipertahankan (misi-dashboard-regulator)

- **Status data: 100% SINTETIS.** Tidak ada data transaksi nyata, tidak ada nasabah nyata, tidak ada regulator nyata. Seluruh baris dibangkitkan oleh skrip `build-misi/misi-dashboard-regulator/gen.py` dengan seed tetap 42 — dijalankan ulang kapan pun menghasilkan file yang identik byte-per-byte.
- **Periode:** 2026-01-01 s.d. 2026-03-31 (90 hari). Pengguna: 400 ID sintetis (U0001–U0400). Transaksi per hari: 12–28 baris acak.
- **Metode sampling:** nominal = lognormal(mu=12.0, sigma=0.8) dibulatkan ke rupiah, dijepit pada [20000, 5000000]; status ~ valid 78% / gagal 10% / pending 7% / void 5%; kanal ~ aplikasi 50% / web 30% / agen 20%; wilayah seragam {JKT, SBY, BDG, MDN}.
- **Kotoran yang disengaja:** ±20% baris berstatus void diberi nominal 0 (entri rusak) — pelajar harus memutuskan perlakuan yang benar via definisi metrik.
- **Skema `transaksi.csv`:** transaksi_id (TX#####), tanggal (YYYY-MM-DD), user_id, nominal (integer rupiah), status, kanal, wilayah.
- **Skema `definisi_metrik.csv`:** metric_id, nama_metrik, definisi, versi, berlaku_mulai — kamus definisi resmi (v1) yang dipakai Lab 1.
- **Tanggal pembuatan:** 2026-10-15. Lisensi: sintetis untuk misi ini — bebas dipakai ulang dengan atribusi ke misi ini.
- **Batas jujur:** angka-angka di misi ini (termasuk di dossier audit) adalah angka mainan untuk latihan audit; tidak mencerminkan kinerja perusahaan mana pun. Dossier audit berisi suntikan impostor yang disengaja.
"""
(PUB / "METODE.md").write_text(metode)

# ── nilai ekspektasi untuk lab ──────────────────────────────────────────
n_baris = len(rows)
valid = [r for r in rows if r["status"] == "valid"]
n_valid = len(valid)
total_nominal_valid = sum(r["nominal"] for r in valid)
jan_users = {r["user_id"] for r in valid if r["tanggal"].startswith("2026-01")}
feb_users = {r["user_id"] for r in valid if r["tanggal"].startswith("2026-02")}
mar_users = {r["user_id"] for r in valid if r["tanggal"].startswith("2026-03")}
jan_valid = sum(1 for r in valid if r["tanggal"].startswith("2026-01"))
feb_valid = sum(1 for r in valid if r["tanggal"].startswith("2026-02"))
mar_valid = sum(1 for r in valid if r["tanggal"].startswith("2026-03"))
alltime_users = {r["user_id"] for r in valid}

# jalur B: agregasi harian dulu, lalu dijumlahkan
from collections import defaultdict
harian = defaultdict(int)
for r in valid:
    harian[r["tanggal"]] += r["nominal"]
jalur_b = sum(harian.values())
selisih = total_nominal_valid - jalur_b

print(f"n_baris={n_baris}")
print(f"tgl_awal={rows[0]['tanggal']} tgl_akhir={rows[-1]['tanggal']}")
print(f"n_valid={n_valid}")
print(f"n_user_aktif_jan={len(jan_users)} feb={len(feb_users)} mar={len(mar_users)} alltime={len(alltime_users)}")
print(f"total_nominal_valid={total_nominal_valid}")
print(f"jan_valid={jan_valid} feb_valid={feb_valid} mar_valid={mar_valid} jumlah={jan_valid+feb_valid+mar_valid}")
print(f"selisih_dua_jalur={selisih}")
print(f"tingkat_validitas={n_valid/n_baris:.4f}")

# ── cuplikan seed SQL: 10 hari Januari (agregat harian) ─────────────────
jan_days = sorted({r["tanggal"] for r in rows if r["tanggal"].startswith("2026-01")})[4:14]
print("\n-- SQL seed harian (10 hari Jan):")
tot_n = tot_nom = 0
for d in jan_days:
    dd = [r for r in valid if r["tanggal"] == d]
    nv, nm = len(dd), sum(r["nominal"] for r in dd)
    tot_n += nv; tot_nom += nm
    print(f"('{d}',{nv},{nm}),")
print(f"-- expected: bulan=2026-01 total_nominal={tot_nom} n_transaksi={tot_n} n_hari=10")
print(f"-- kanal counts Q1:", {k: sum(1 for r in valid if r['kanal']==k) for k in ['aplikasi','web','agen']})

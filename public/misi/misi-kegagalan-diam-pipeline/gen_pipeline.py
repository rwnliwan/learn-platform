"""Generator dataset SINTETIS — Misi Pipeline: Kegagalan yang Diam.

DATA INI 100% SINTETIS — dibuat khusus untuk misi edukasi Learn v2.
Tidak ada pelanggan, transaksi, atau perusahaan nyata di file ini.
Seed tetap: 42 (random.Random(42)) -> output deterministik.

Jalankan:  python3 gen_pipeline.py
Output:    master_pelanggan.csv, transaksi_harian.csv, log_pipeline.txt
"""
import random
import csv
from datetime import date, timedelta, datetime

SEED = 42
rng = random.Random(SEED)

N_PELANGGAN = 80
N_TXN = 600
N_UNKNOWN = 12      # pelanggan_id tak dikenal -> dibuang INNER JOIN diam-diam
N_PAIR = 7          # pasangan transaksi legit ber-nominal sama -> dibuang dedup naive

DEPAN = ["Ahmad", "Siti", "Budi", "Dewi", "Agus", "Rina", "Joko", "Putri",
         "Hendra", "Lina", "Dedi", "Maya", "Rudi", "Nina", "Yoga", "Tania"]
BELAKANG = ["Santoso", "Wijaya", "Pratama", "Kusuma", "Rahmawati", "Saputra",
            "Nugroho", "Anggraini", "Setiawan", "Hartono", "Gunawan", "Lestari"]
SEGMEN = ["Ritel", "Korporat", "Prioritas"]
NOMINAL = [50_000, 75_000, 100_000, 150_000, 250_000, 500_000,
           750_000, 1_000_000, 1_500_000, 2_500_000]
KANAL = ["Transfer", "QRIS", "VA"]

def master():
    rows = []
    for i in range(1, N_PELANGGAN + 1):
        d = date(2024, 1, 1) + timedelta(days=rng.randint(0, 700))
        rows.append({
            "pelanggan_id": f"C{i:03d}",
            "nama": f"{rng.choice(DEPAN)} {rng.choice(BELAKANG)}",
            "segmen": rng.choice(SEGMEN),
            "tanggal_daftar": d.isoformat(),
        })
    return rows

def waktu_acak(d: date) -> str:
    r = rng.random()
    hh, mm, ss = rng.randint(0, 23), rng.randint(0, 59), rng.randint(0, 59)
    if r < 0.70:
        return f"{d.isoformat()} {hh:02d}:{mm:02d}:{ss:02d}"          # naive (lokal WITA = +08)
    if r < 0.90:
        return f"{d.isoformat()}T{hh:02d}:{mm:02d}:{ss:02d}+08:00"   # offset eksplisit WITA
    # UTC 16:00-23:59 di hari (d-1) = 00:00-07:59 WITA di hari d -> slice [:10] SALAH 1 hari
    uh = rng.randint(16, 23)
    d_utc = d - timedelta(days=1)
    return f"{d_utc.isoformat()}T{uh:02d}:{mm:02d}:{ss:02d}Z"

def main():
    mst = master()
    ids = [m["pelanggan_id"] for m in mst]

    base = []
    for _ in range(N_TXN - N_PAIR):
        d = date(2026, 3, 1) + timedelta(days=rng.randint(0, 9))
        base.append({
            "waktu": waktu_acak(d),
            "pelanggan_id": rng.choice(ids),
            "nominal": rng.choice(NOMINAL),
            "kanal": rng.choice(KANAL),
        })
    # 12 transaksi dari pelanggan tak dikenal (tidak ada di master)
    for i in rng.sample(range(len(base)), N_UNKNOWN):
        base[i]["pelanggan_id"] = f"CX-{901 + i % 12}"

    # 7 pasangan legit: pelanggan & nominal sama, txn & waktu beda
    pair_idx = rng.sample([i for i, b in enumerate(base) if not b["pelanggan_id"].startswith("CX-")], N_PAIR)
    pairs = []
    for i in pair_idx:
        b = base[i]
        w = b["waktu"]
        # waktu +7 menit, format naive sederhana (tetap 1 hari yang sama)
        try:
            dt = datetime.strptime(w[:19].replace("T", " "), "%Y-%m-%d %H:%M:%S")
        except ValueError:
            dt = datetime.strptime(w[:10] + " " + w[11:19], "%Y-%m-%d %H:%M:%S")
        dt2 = dt + timedelta(minutes=7)
        pairs.append({
            "waktu": dt2.strftime("%Y-%m-%d %H:%M:%S"),
            "pelanggan_id": b["pelanggan_id"],
            "nominal": b["nominal"],
            "kanal": b["kanal"],
        })

    rows = base + pairs
    rng.shuffle(rows)
    for i, r in enumerate(rows, 1):
        r2 = {"txn_id": f"TXN-{i:04d}"}
        r2.update(r)
        rows[i - 1] = r2

    with open("master_pelanggan.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["pelanggan_id", "nama", "segmen", "tanggal_daftar"])
        w.writeheader(); w.writerows(mst)
    with open("transaksi_harian.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["txn_id", "waktu", "pelanggan_id", "nominal", "kanal"])
        w.writeheader(); w.writerows(rows)

    n_utc = sum(1 for r in rows if r["waktu"].endswith("Z"))
    n_unknown = sum(1 for r in rows if r["pelanggan_id"].startswith("CX-"))
    hilang = sum(r["nominal"] for r in rows if r["pelanggan_id"].startswith("CX-"))
    print(f"transaksi: {len(rows)} baris | UTC: {n_utc} | unknown: {n_unknown} | "
          f"nominal hilang (join): {hilang:,}")

    # Artefak fiksi skenario: log pipeline yang "OK" padahal berbohong
    log = """[2026-03-11 02:00:01] pipeline_harian v2.3 START partisi=2026-03-10
[2026-03-11 02:00:04] extract OK: 600 baris dari transaksi_harian.csv
[2026-03-11 02:00:07] transform OK: join master_pelanggan (inner)
[2026-03-11 02:00:09] transform OK: dedup key=(pelanggan_id, nominal, tanggal)
[2026-03-11 02:00:12] load OK: 567 baris -> fact_transaksi
[2026-03-11 02:00:12] RUN OK -- input=600, output=567, dropped=0
[2026-03-11 02:00:13] staging_transaksi dibersihkan: YA
[2026-03-10 02:00:12] RUN OK -- input=612, output=579, dropped=0
[2026-03-09 02:00:11] RUN OK -- input=588, output=556, dropped=0
[2026-03-08 02:00:01] partisi=2026-03-07 SKIP -- sudah diproses kemarin
"""
    with open("log_pipeline.txt", "w", encoding="utf-8") as f:
        f.write(log)
    print("log_pipeline.txt ditulis (ARTEFAK FIKSI SKENARIO)")

if __name__ == "__main__":
    main()

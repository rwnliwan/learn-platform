#!/usr/bin/env python3
"""Generator dataset SINTETIS — Misi Lineage: Skema Berubah, Tak Ada yang Tahu
(misi-lineage-terputus)

100% SINTETIS: tidak ada data nyata, tidak ada PII nyata. Perusahaan "PT Bank
Cakrawala Digital", semua tim, kolom, angka, dan insiden adalah fiktif dan
dibuat untuk misi ini. Seed tetap: 7 (tidak ada sampling acak — seluruh isi
deklaratif agar deterministik).

Output: public/misi/misi-lineage-terputus/*.csv
Jalankan: python3 build-misi/gen_misi_lineage.py  (dari ~/workspace/learn-platform)
"""
import csv
import os

SEED = 7  # dokumentasi; tidak ada komponen acak dalam dataset ini

OUT = os.path.join("public", "misi", "misi-lineage-terputus")
os.makedirs(OUT, exist_ok=True)

# ── skema_v1.csv — skema sebelum perubahan diam-diam ──────────────────
V1 = [
    ("transaksi", "customer_id", "VARCHAR(20)", "ID pelanggan"),
    ("transaksi", "trx_date", "DATE", "Tanggal settlement"),
    ("transaksi", "amount", "DECIMAL(18,2)", "Nominal dalam IDR"),
    ("transaksi", "cust_segment", "VARCHAR(20)", "Segmen dari CRM (diisi manual)"),
    ("transaksi", "channel", "VARCHAR(20)", "Kanal transaksi"),
    ("transaksi", "status", "VARCHAR(10)", "Status transaksi"),
]

with open(os.path.join(OUT, "skema_v1.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["tabel", "kolom", "tipe", "deskripsi"])
    w.writerows(V1)

# ── skema_v2.csv — skema sesudah perubahan diam-diam ──────────────────
V2 = [
    ("transaksi", "cust_id", "VARCHAR(20)", "ID pelanggan"),
    ("transaksi", "trx_date", "DATE", "Tanggal input operator"),
    ("transaksi", "amount", "VARCHAR(20)", "Nominal format teks 1.250.000"),
    ("transaksi", "customer_segment", "VARCHAR(20)", "Segmen hasil model ML (otomatis)"),
    ("transaksi", "channel", "VARCHAR(20)", "Kanal transaksi"),
    ("transaksi", "status", "VARCHAR(10)", "Status transaksi"),
    ("transaksi", "promo_code", "VARCHAR(20)", "Kode promo (baru)"),
]

with open(os.path.join(OUT, "skema_v2.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["tabel", "kolom", "tipe", "deskripsi"])
    w.writerows(V2)

# ── changelog.csv — IMPOSTOR: rename customer_id -> cust_id TIDAK dicatat ──
CHANGELOG = [
    ("2026-08-01", "v1.3", "kolom status ditambahkan", "tim_upstream"),
    ("2026-09-02", "v2.0", "kolom customer_segment ditambahkan", "lead_upstream"),
    ("2026-09-02", "v2.0", "kolom promo_code ditambahkan", "lead_upstream"),
    ("2026-09-02", "v2.0", "tipe kolom amount: DECIMAL menjadi VARCHAR", "lead_upstream"),
]

with open(os.path.join(OUT, "changelog.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["tanggal", "versi", "perubahan", "dicatat_oleh"])
    w.writerows(CHANGELOG)

# ── pipeline.csv ─────────────────────────────────────────────────────
PIPELINES = [
    ("etl_harian", "transaksi.customer_id", "tabel transaksi", "aktif", "baca kolom langsung"),
    ("agg_pendapatan", "transaksi.amount", "tabel transaksi", "aktif", "SUM(amount) harian"),
    ("dashboard_crm", "transaksi.cust_segment", "tabel transaksi", "aktif", "filter segmen"),
    ("laporan_keuangan", "transaksi.trx_date", "tabel transaksi", "aktif", "cutoff tanggal laporan"),
    ("etl_arsip", "transaksi.channel", "tabel transaksi", "aktif", "arsip mentah"),
    ("backup_mingguan", "*", "tabel transaksi", "aktif", "SELECT bintang - lolos tanpa error"),
    ("notifikasi_wa", "transaksi.status", "tabel transaksi", "nonaktif", "pilot dihentikan"),
]

with open(os.path.join(OUT, "pipeline.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["pipeline", "kolom_dipakai", "sumber", "status", "catatan"])
    w.writerows(PIPELINES)

# ── audit_log.csv ────────────────────────────────────────────────────
AUDIT = [
    ("2026-09-02 03:12", "deploy_bot", "RENAME COLUMN customer_id TO cust_id", "otomatis - tanpa entri changelog"),
    ("2026-09-02 03:13", "deploy_bot", "ALTER COLUMN amount TYPE VARCHAR", "format baru: '1.250.000'"),
    ("2026-09-02 03:14", "deploy_bot", "ADD COLUMN customer_segment", "segmen hasil model ML"),
    ("2026-09-02 03:15", "deploy_bot", "deskripsi trx_date diubah", "'tanggal settlement' menjadi 'tanggal input operator'"),
    ("2026-09-05 09:00", "analis_rina", "tiket 4812: pendapatan harian turun 55 persen", "diduga data hilang"),
    ("2026-09-06 10:30", "lead_upstream", "klaim: tidak ada perubahan breaking", "changelog v2.0 diklaim lengkap"),
    ("2026-09-07 08:00", "data_engineer", "investigasi dimulai", "misi lineage dibuka"),
]

with open(os.path.join(OUT, "audit_log.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["waktu", "aktor", "aksi", "detail"])
    w.writerows(AUDIT)

print(f"OK: v1={len(V1)} v2={len(V2)} changelog={len(CHANGELOG)} "
      f"pipeline={len(PIPELINES)} audit={len(AUDIT)} -> {OUT}")

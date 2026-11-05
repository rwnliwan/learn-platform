#!/usr/bin/env python3
"""Generator dataset SINTETIS — Misi Katalog: Siapa Pemilik Kolom Ini?
(misi-katalog-data-hilang)

100% SINTETIS: tidak ada data nyata, tidak ada PII nyata. Semua nama
perusahaan/tim/kolom adalah fiktif dan dibuat untuk misi ini.
Seed tetap: 42 (dipakai untuk pengacakan urutan audit log saja; isi
skema & lineage sepenuhnya deklaratif agar deterministik).

Output: public/misi/misi-katalog-data-hilang/*.csv
Jalankan: python3 build-misi/gen_misi_katalog.py  (dari ~/workspace/learn-platform)
"""
import csv
import os
import random

SEED = 42
random.seed(SEED)

OUT = os.path.join("public", "misi", "misi-katalog-data-hilang")
os.makedirs(OUT, exist_ok=True)

# ── skema_kolom.csv ──────────────────────────────────────────────────
# (tabel, kolom, tipe_data, deskripsi, pemilik, laporan_kritis, status)
SKEMA = [
    # tabel nasabah
    ("nasabah", "id_nasabah", "VARCHAR(20)", "ID unik nasabah", "Tim Data", "ya", "aktif"),
    ("nasabah", "nik", "VARCHAR(16)", "Nomor Induk Kependudukan", "Tim Kepatuhan", "ya", "aktif"),
    ("nasabah", "nama_lengkap", "VARCHAR(100)", "Nama lengkap sesuai KTP", "Tim Kepatuhan", "ya", "aktif"),
    ("nasabah", "tgl_lahir", "DATE", "Tanggal lahir", "Tim Kepatuhan", "tidak", "aktif"),
    ("nasabah", "alamat", "TEXT", "", "Tim Operasional", "tidak", "aktif"),
    ("nasabah", "no_hp", "VARCHAR(15)", "Nomor HP", "", "tidak", "aktif"),
    ("nasabah", "kode_cabang", "VARCHAR(10)", "Kode cabang penerbit rekening", "Tim Operasional", "tidak", "aktif"),
    ("nasabah", "kode_cabang_lama", "VARCHAR(10)", "Kode cabang format lama (diganti 2023)", "Tim Operasional", "ya", "deprecated"),
    # tabel nasabah_core (duplikat beda nama — dibuat tim analitik tanpa dokumentasi)
    ("nasabah_core", "nasabah_id", "VARCHAR(20)", "ID nasabah (salinan id_nasabah)", "Tim Analitik", "tidak", "aktif"),
    ("nasabah_core", "full_name", "VARCHAR(100)", "Nama lengkap + gelar (definisi BEDA dari nama_lengkap)", "Tim Analitik", "tidak", "aktif"),
    ("nasabah_core", "branch_code", "VARCHAR(10)", "Kode cabang", "Tim Analitik", "tidak", "aktif"),
    ("nasabah_core", "segment", "VARCHAR(20)", "", "", "tidak", "aktif"),
    ("nasabah_core", "join_date", "DATE", "Tanggal bergabung", "Tim Analitik", "tidak", "aktif"),
    # tabel rekening
    ("rekening", "no_rekening", "VARCHAR(20)", "Nomor rekening", "Tim Operasional", "ya", "aktif"),
    ("rekening", "id_nasabah", "VARCHAR(20)", "ID nasabah pemilik", "Tim Operasional", "tidak", "aktif"),
    ("rekening", "jenis_rekening", "VARCHAR(20)", "Tabungan/Giro/Deposito", "Tim Produk", "tidak", "aktif"),
    ("rekening", "saldo", "DECIMAL(18,2)", "Saldo dalam IDR", "Tim Keuangan", "ya", "aktif"),
    ("rekening", "tgl_buka", "DATE", "Tanggal pembukaan rekening", "Tim Operasional", "tidak", "aktif"),
    ("rekening", "status", "VARCHAR(10)", "Aktif/Tutup/Blokir", "", "tidak", "aktif"),
    # tabel transaksi
    ("transaksi", "id_transaksi", "VARCHAR(30)", "ID unik transaksi", "Tim Data", "tidak", "aktif"),
    ("transaksi", "no_rekening", "VARCHAR(20)", "Nomor rekening sumber", "Tim Data", "tidak", "aktif"),
    ("transaksi", "tgl_transaksi", "DATE", "Tanggal transaksi", "Tim Data", "ya", "aktif"),
    ("transaksi", "nominal", "DECIMAL(18,2)", "Nominal dalam IDR", "Tim Keuangan", "ya", "aktif"),
    ("transaksi", "kode_transaksi", "VARCHAR(10)", "Kode jenis transaksi", "", "tidak", "aktif"),
    ("transaksi", "channel", "VARCHAR(20)", "ATM/Mobile/Teller", "Tim Data", "tidak", "aktif"),
    ("transaksi", "keterangan", "TEXT", "", "", "tidak", "aktif"),
    # tabel transaksi_rinci (duplikat beda nama + beda satuan!)
    ("transaksi_rinci", "trx_id", "VARCHAR(30)", "ID transaksi (salinan id_transaksi)", "Tim Analitik", "tidak", "aktif"),
    ("transaksi_rinci", "acct_no", "VARCHAR(20)", "Nomor rekening (salinan no_rekening)", "Tim Analitik", "tidak", "aktif"),
    ("transaksi_rinci", "trx_date", "DATE", "Tanggal transaksi", "Tim Analitik", "tidak", "aktif"),
    ("transaksi_rinci", "jumlah", "DECIMAL(18,2)", "Nominal dalam MATA UANG ASAL (bukan IDR!)", "Tim Analitik", "tidak", "aktif"),
    ("transaksi_rinci", "currency", "VARCHAR(3)", "Kode mata uang", "Tim Analitik", "tidak", "aktif"),
    # tabel risiko
    ("risiko", "id_nasabah", "VARCHAR(20)", "ID nasabah", "", "ya", "aktif"),
    ("risiko", "skor_risiko_internal", "DECIMAL(5,2)", "Skor risiko internal 0-100", "", "ya", "aktif"),
    ("risiko", "pd_model_v3", "DECIMAL(8,6)", "Probability of default model v3", "Tim Risiko", "ya", "aktif"),
    ("risiko", "tgl_skor", "DATE", "Tanggal perhitungan skor", "Tim Risiko", "tidak", "aktif"),
    ("risiko", "segmen", "VARCHAR(20)", "Segmen risiko", "Tim Risiko", "tidak", "aktif"),
    ("risiko", "catatan_analis", "TEXT", "", "", "tidak", "aktif"),
]

with open(os.path.join(OUT, "skema_kolom.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["tabel", "kolom", "tipe_data", "deskripsi", "pemilik", "laporan_kritis", "status"])
    w.writerows(SKEMA)

# ── lineage.csv ──────────────────────────────────────────────────────
LINEAGE = [
    ("nasabah.id_nasabah", "nasabah_core.nasabah_id", "salin langsung", "duplikat"),
    ("nasabah.nama_lengkap", "nasabah_core.full_name", "tambah gelar di belakang nama", "duplikat"),
    ("nasabah.kode_cabang", "nasabah_core.branch_code", "salin langsung", "duplikat"),
    ("transaksi.id_transaksi", "transaksi_rinci.trx_id", "salin langsung", "duplikat"),
    ("transaksi.no_rekening", "transaksi_rinci.acct_no", "salin langsung", "duplikat"),
    ("transaksi.nominal", "laporan_harian.total_nominal", "SUM per hari", "agregasi"),
    ("transaksi_rinci.jumlah", "laporan_valas.total_valas", "SUM per currency", "agregasi"),
    ("risiko.skor_risiko_internal", "laporan_modal.skor_agregat", "rata-rata tertimbang", "turunan"),
    ("risiko.pd_model_v3", "laporan_modal.pd_portofolio", "rata-rata", "turunan"),
    ("nasabah.kode_cabang_lama", "etl_cabang.mapping_lama", "masih dibaca ETL malam", "turunan"),
    ("rekening.saldo", "laporan_modal.total_eksposur", "SUM", "agregasi"),
    ("nasabah.nik", "mart_kepatuhan.nik_masked", "masking 6 digit terakhir", "turunan"),
]

with open(os.path.join(OUT, "lineage.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["kolom_asal", "kolom_tujuan", "transformasi", "relasi"])
    w.writerows(LINEAGE)

# ── audit_log.csv ────────────────────────────────────────────────────
AUDIT = [
    ("2023-01-15 10:00", "tim_data", "tabel nasabah dibuat", "8 kolom awal"),
    ("2023-06-02 14:30", "tim_analitik", "tabel nasabah_core dibuat", "salinan untuk analitik - tanpa dokumentasi"),
    ("2023-11-20 09:15", "tim_operasional", "kolom kode_cabang_lama ditandai deprecated", "peringatan: masih dibaca ETL malam"),
    ("2024-03-11 16:45", "etl_bot", "kolom skor_risiko_internal dibuat", "tanpa pemilik terdaftar"),
    ("2024-08-05 11:00", "tim_keuangan", "laporan_modal memakai skor_risiko_internal", "laporan kritis - pemilik kolom: (kosong)"),
    ("2025-02-14 13:20", "tim_analitik", "kolom jumlah ditambah ke transaksi_rinci", "satuan: mata uang asal (bukan IDR)"),
    ("2026-09-30 10:00", "tim_kepatuhan", "surat regulator diterima", "pertanyaan: siapa pemilik kolom skor_risiko_internal?"),
    ("2026-10-15 08:00", "data_steward", "inventarisasi dimulai", "misi katalog dibuka"),
]

with open(os.path.join(OUT, "audit_log.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["waktu", "aktor", "aksi", "detail"])
    w.writerows(AUDIT)

print(f"OK: {len(SKEMA)} kolom, {len(LINEAGE)} lineage, {len(AUDIT)} audit -> {OUT}")

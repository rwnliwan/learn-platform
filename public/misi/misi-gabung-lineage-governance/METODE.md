# METODE — Misi Jejak Data: Pipeline yang Tak Punya Tuan (misi-gabung-lineage-governance)

- **STATUS DATA: 100% SINTETIS.** Seluruh isi folder ini adalah data fiktif yang dibuat khusus untuk misi ini. Tidak ada data nyata, tidak ada PII nyata, tidak ada sistem nyata. "PT Bank Aruna Digital", semua tim, tabel, kolom, angka, tanggal run, dan klaim lineage adalah fiktif dan dibuat untuk tujuan pembelajaran.
- **Generator:** `/tmp/cap3_gen_dataset.py` (scratch builder, prefix cap3_). Jalankan ulang untuk reproduksi byte-identik.
- **Seed:** 42 (dipakai untuk jitter rows_in/rows_out dan jam run; struktur skenario ditulis deklaratif).
- **Jendela log:** 2026-09-15 s.d. 2026-10-14 (30 hari), 34 run dari 6 pipeline.
- **File:**
  - `pipeline_log.csv` — 34 baris run: run_id, pipeline, source_table, target_table, started_at, finished_at, rows_in, rows_out, status, owner. Dua pipeline punya owner kosong; pipeline `arsip` selalu FAILED.
  - `skema_kontrak.csv` — 25 baris kontrak skema 6 tabel: table_name, column_name, data_type, nullable, contract_version, definition, owner, retention_days, kategori. Kebijakan retensi: laporan=2555 hari (7 thn), mart=1095, mentah=90. SENGAJA: `core_nasabah` (PII) retention_days=1825 (melanggar 90), `arsip_laporan` retention kosong, 2 definisi kosong, 3 owner kosong.
  - `matriks_ownership.csv` — 25 baris: tabel, kolom, pemilik, status_pemilik (terkonfirmasi/belum_terverifikasi/orphan), terakhir_verifikasi. 12 terkonfirmasi, 6 belum_terverifikasi, 7 orphan. Tiga tabel staging (stg_*) SENGAJA tidak terdaftar.
  - `klaim_lineage_lama.csv` — 9 klaim edge kolom-per-kolom dari dokumen "v0.3" 2021 (fiktif): 7 pasangan tabel unik; 2 di antaranya tak terbukti di log (core_kolektibilitas, arsip_laporan→regulator_server); hanya 1 yang terbukti penuh.
  - `glosarium.csv` — 6 baris; `status_nasabah` punya 2 definisi KONFLIK (ini disengaja).
- **Tanggal pembuatan:** 2026-10-15. Total ukuran: <10 KB (<5MB).
- **Batas jujur:** log hanya 30 hari — tidak bisa membuktikan lineage 7 tahun; klaim lineage lama adalah dokumen fiktif yang memang dirancang cacat; tidak ada data nasabah sungguhan.
- **Lisensi:** data sintetis dibuat untuk misi ini; bebas dipakai untuk pembelajaran.

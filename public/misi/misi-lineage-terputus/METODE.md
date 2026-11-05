# METODE — Misi Lineage: Skema Berubah, Tak Ada yang Tahu (misi-lineage-terputus)

- **STATUS DATA: 100% SINTETIS.** Seluruh isi folder ini adalah data fiktif yang dibuat khusus untuk misi ini. Tidak ada data nyata, tidak ada PII nyata. "PT Bank Cakrawala Digital", semua tim, kolom, angka, tiket, dan insiden adalah fiktif.
- **Generator:** `build-misi/gen_misi_lineage.py` (dari root `learn-platform`: `python3 build-misi/gen_misi_lineage.py`).
- **Seed:** 7 (dokumentasi; tidak ada komponen acak — seluruh isi deklaratif dan deterministik).
- **Metode:** skenario perubahan skema ditulis manual sebagai spesifikasi deklaratif — bukan hasil observasi sistem nyata. Setiap perubahan dirancang membawa tepat satu "pelajaran" (rename tak tercatat, tipe berubah, makna berubah, kolom mirip beda definisi, SELECT *).
- **File:**
  - `skema_v1.csv` — 6 kolom tabel `transaksi` sebelum perubahan (2026-09-01).
  - `skema_v2.csv` — 7 kolom tabel `transaksi` sesudah perubahan (2026-09-02).
  - `changelog.csv` — 4 entri; SENGAJA tidak mencatat rename `customer_id → cust_id` (ini salah satu suntikan misi).
  - `pipeline.csv` — 7 pipeline downstream + kolom yang dipakai + status.
  - `audit_log.csv` — 7 baris kronologi fiktif 2026-09-02 → 2026-09-07.
- **Diff v1 → v2 (verifikasi):** hilang 2 (`customer_id`, `cust_segment`) · baru 3 (`cust_id`, `customer_segment`, `promo_code`) · tipe berubah 1 (`amount`: DECIMAL → VARCHAR) · deskripsi/makna berubah 1 (`trx_date`: "tanggal settlement" → "tanggal input operator") · kandidat rename 2 (ambang kemiripan > 0,7): (`customer_id → cust_id`) rename asli + (`cust_segment → customer_segment`) jebakan nama-mirip-beda-makna.
- **Dampak pipeline (verifikasi):** terdampak 4 (`etl_harian`, `agg_pendapatan`, `dashboard_crm`, `laporan_keuangan`) · lolos-karena-SELECT-* 1 (`backup_mingguan`).
- **Tanggal snapshot:** 2026-10-15. Ukuran total folder: < 10 KB.
- **Batas jujur:** di dunia nyata diff skema dibaca dari schema registry / migration log, bukan dari dua file CSV; miniatur ini menyederhanakan agar bisa dikerjakan di browser tanpa infrastruktur.

# METODE — Misi ETL: Batch yang Datang Terlambat (misi-etl-telat-backfill)

- **Status data: 100% SINTETIS.** Seluruh file di folder ini dibuat oleh generator Python (`seed=42`) khusus untuk misi ini. BUKAN data perusahaan nyata, BUKAN data publik yang diunduh. Setiap angka di sini adalah fiksi yang dirancang untuk latihan.
- **Generator:** Python 3, modul `random` dengan `random.seed(42)`. Urutan: (1) 18 tanggal partisi 2026-09-25 s.d. 2026-10-12; (2) `rows_expected` = `randint(600, 1100)` per partisi; (3) offset ingest: mayoritas 0–1 hari, paksa 3 hari untuk 2026-09-28 / 2026-10-02 / 2026-10-09, paksa 2 hari untuk 2026-10-05 / 2026-10-11; (4) `amount` = `randint(15000, 250000)` (IDR); (5) `event_time` acak dalam hari partisi; (6) anomali disuntik deterministik (lihat bawah); (7) baris event diacak (`random.shuffle`) agar urutan file tidak memberi petunjuk.
- **Metode sampling:** tidak ada sampling dari populasi nyata — populasi dibuat dari nol oleh generator di atas.
- **Anomali yang disengaja (bagian dari desain misi):**
  1. Partisi 2026-09-30 **dilewati total** (tidak ada di manifest).
  2. Partisi 2026-10-04: manifest mencatat `status=lengkap` dengan `rows_received=0` — klaim "lengkap" padahal kosong.
  3. Partisi 2026-10-08: **dua baris manifest** (`ingested_at` 09:12:33 dan 14:47:05) dan setiap event-nya **duplikat persis** di `event_log.csv` (958 event ganda).
  4. Lima event di partisi 2026-10-12 memiliki `event_time` 8 hari di masa depan (2026-10-20).
- **Skema kolom:**
  - `manifest.csv`: `partition_date` (YYYY-MM-DD), `rows_expected` (int), `rows_received` (int), `status` (teks klaim pipeline), `ingested_at` (ISO-8601).
  - `event_log.csv`: `event_id` (unik per event logis — duplikat berarti event yang sama tercatat 2×), `partition_date`, `event_time` (ISO-8601), `order_id`, `amount` (IDR, int).
- **Nilai referensi (dihitung dari generator, dipakai checks lab):** partisi telat (>2 hari): 2026-09-28, 2026-10-02, 2026-10-09; partisi hilang: 2026-09-30; partisi duplikat: 2026-10-08; total naif (dengan duplikat): 1.927.627.725; total idempoten (dedupe `event_id`): 1.802.720.342; duplikat dihapus: 958; event masa depan: 5.
- **Ukuran:** manifest.csv 928 byte, event_log.csv ±1,1 MB. Total < 5 MB.
- **Tanggal pembuatan:** 2026-10-15.
- **Catatan jujur:** anomali di atas adalah "suntikan" untuk latihan audit — di dunia nyata pola yang sama muncul dari bug retry, race condition, dan klaim status yang tidak diverifikasi. Tidak ada peristiwa nyata yang direpresentasikan file ini.

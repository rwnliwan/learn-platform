# METODE — Misi Feature Store (misi-gabung-feature-store)

- **Sumber data: SINTETIS 100%.** Seluruh file di folder ini dibuat oleh generator
  `/tmp/cap4_gen.py` (tidak dibawa ke repo) dengan **seed 42** — deterministik dan
  dapat diregenerasi persis. Tidak ada data nasabah, tidak ada data publik.
- **Lisensi: setara CC0** — data sintetis khusus misi ini, bebas dipakai/dimodifikasi.
- **Tanggal pembuatan:** 2026-10-15.

## File
- `events.csv` — event mentah: event_id, user_id, event_time (UTC, format
  `YYYY-MM-DD HH:MM:SS`), event_type (login/payment/late_fee/disbursement/app_open),
  amount (kosong untuk login/app_open). 1.200 user, Jan–Agu 2026.
- `labels.csv` — user_id, asof_date (kohort 2026-05-01 / 2026-06-01 / 2026-07-01),
  label (1 = gagal bayar: ≥1 event late_fee dalam 30 hari SETELAH asof_date).
- `train_reference.csv` — feature table yang point-in-time-correct: setiap fitur
  hanya memakai event dengan event_time < asof_date. days_since_last_payment yang
  kosong diimputasi median train (13 hari) — didokumentasikan di sini, bukan disembunyikan.
- `feature_table_budi.csv` — feature table "versi Budi" yang BOCOR: cutoff
  event_time ≤ asof_date + 30 hari (menelan jendela label). Sengaja salah.
- `serving_log.csv` — 3.000 request pipeline v3.1 (10–31 Agu 2026) dengan dua cacat
  yang disuntikkan: n_logins dihitung dengan jendela 30 hari (kolom tetap bernama n_logins_7d), dan days_since_last_payment yang kosong diisi 0 (train memakai median).

## Batas jujur
- Label memakai aturan mainan (≥2 late_fee pasca-asof) — bukan definisi gagal
  bayar perbankan yang sebenarnya.
- Skenario (perusahaan, model, pipeline v3.1) adalah fiksi untuk misi ini.
- Feature engineering disederhanakan menjadi 5 fitur agar bisa dihitung di browser.

# METODE — Misi Kebocoran: Fitur dari Masa Depan (misi-kebocoran-fitur)

- **Sumber data:** SINTETIS — dibuat dengan generator NumPy (seed 42, skrip `/tmp/gen_leakage.py`). BUKAN transaksi nyata; pola kebocoran direkayasa agar bisa dibuktikan lewat perbandingan shuffled-CV vs walk-forward.
- **File:** `transaksi.csv` — 623 baris, kolom `txn_id,waktu_txn,split,kategori,amt,hour,acct_age_days,n_txn_30d,future_avg_7d,days_to_next_txn,chargeback_14d,kat_fraudrate_enc,is_fraud`. Periode 2024-01-01 s.d. 2024-06-30; split kronologis train (Jan–Mar, 304) / val (Apr, 91) / test (Mei–Jun, 228). Termasuk 23 duplikat lintas split (txn_id sama di train dan test) sebagai bagian skenario.
- **Metode:** target `is_fraud` dibangkitkan dari fraud-rate per kategori yang BERGESER antar periode (P1: m0–m2 tinggi; P2: m4–m6; P3: m6–m8) — concept drift yang disengaja. Fitur bocor: `future_avg_7d` (rerata 7 hari KE DEPAN), `chargeback_14d` (chargeback diajukan setelah transaksi, korr 0,67 dengan target), `days_to_next_txn` (jarak ke transaksi berikut), `kat_fraudrate_enc` (fraud-rate kategori dihitung dari SELURUH data sebelum split).
- **Seed:** 42 (deterministik penuh; fold acak lab memakai `default_rng(42)` yang fresh).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: transaksi.csv 45494 byte (total <5MB).
- **Batas jujur:** klaim vendor "akurasi 94%" adalah fiksi misi; yang nyata dan bisa diverifikasi pelajar: aturan `chargeback_14d` saja mencapai balanced accuracy 0,82, sedangkan evaluasi walk-forward yang jujur atas skor encoding hanya 0,46 (selisih 16,25 poin dari CV acak).

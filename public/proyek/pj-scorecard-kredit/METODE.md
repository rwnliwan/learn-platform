# METODE — Proyek Terpandu "Credit Scorecard End-to-End" (pj-scorecard-kredit)

Snapshot data: 2026-10-15. Total < 150 KB (batas 5 MB).

## 1. Sumber data
- **Statlog German Credit Data** — Prof. Dr. Hans Hofmann, via UCI Machine Learning
  Repository (dataset 144).
- DOI: https://doi.org/10.24432/C5NC77
- Lisensi: **CC BY 4.0** (dinyatakan di halaman dataset UCI; sudah terverifikasi
  pada gelombang Misi M1).
- Atribusi yang dipakai di konten: "Data: Prof. Dr. Hans Hofmann, Statlog German
  Credit Data (UCI ML Repository, CC BY 4.0, DOI 10.24432/C5NC77)".
- File asli: `german.data` (1.000 baris, 20 atribut + class), diunduh
  2026-10-15 dari https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip
  (kamus: `german.doc` di arsip yang sama).

## 2. Decode & target
- 20 atribut di-decode dari kamus `german.doc` (kode A11..A202 → label).
- Target `default`: 1 bila class = 2 (Bad), 0 bila class = 1 (Good).
  Bad rate populasi: 30,0%.
- Mata uang = Deutsche Mark (DM) — data historis Jerman; generalisasi ke
  konteks lain wajib disertai caveat (disebutkan di briefing).

## 3. Kolom yang disimpan (17 kolom)
`checking_status, duration, credit_history, purpose, credit_amount, savings,
employment, installment_rate, property, age, housing, num_credits, job,
num_dependents, foreign_worker, status_kolektibilitas, default`

## 4. Split train/holdout (deterministik)
- Stratified 70/30 per target, `numpy.random.default_rng(42)`:
  `train.csv` = 700 baris (bad rate 30,0%), `holdout.csv` = 300 baris (bad rate 30,0%).
- Aturan main proyek: model dibangun di train; holdout HANYA untuk validasi.

## 5. Kolom SINTETIS — `status_kolektibilitas` (fitur leakage untuk latihan)
- **Bukan bagian dari German Credit asli.** Dibangkitkan dengan seed 42:
  debitur gagal bayar → "macet" (peluang 0,86), debitur lancar → "lancar"
  (peluang 0,90).
- Sengaja dirancang sebagai **kebocoran data (data leakage)**: definisinya
  adalah status kolektibilitas *pada akhir periode observasi* — informasi yang
  belum ada saat skor diberikan di produksi. IV-nya ≈ 3,26 (tidak wajar).
- Dipakai di dua tempat: (a) checkpoint keputusan peserta (pakai/buang),
  (b) dossier audit vendor (vendor memakainya → AUC menggelembung).

## 6. Gangguan kualitas data SINTETIS di train (untuk Lab 1)
- 8 baris `age` dikosongkan + 3 baris `duration = 999` (kesalahan entri),
  dipilih dengan seed 42, **hanya di train.csv**. Holdout bersih.
- Solusi lab: imputasi median (`age`), winsorisasi ke median (`duration`).

## 7. Angka referensi (dari harness, solusi diekstrak dari file konten)
- IV: checking_status 0,64 · credit_history 0,25 · savings 0,23 · duration 0,19 ·
  credit_amount 0,15 · employment 0,10 · property 0,09 · housing 0,08 · age 0,06 ·
  installment_rate 0,03 · num_credits 0,02 · status_kolektibilitas (leak) 3,26.
- Model kanonis (9 fitur, tanpa leakage): train AUC 0,80 / KS 0,50 ·
  holdout AUC 0,78 / KS 0,49 · PSI(train→holdout) 0,04.
- Skala skor: PDO 20, basis 600 pada odds 50:1 → factor 28,85 / offset 487,12.
- Model dengan leakage: train AUC 0,94 · holdout AUC 0,91 (inilah angka yang
  "digelembungkan" vendor di dossier).
- Cutoff (holdout): 500 → approval 67% / bad 14,9% · 560 → approval 17% / bad 13,7%.

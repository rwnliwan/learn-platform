# METODE — misi-gabung-notebook-produksi

## Pernyataan data

**Seluruh file di folder ini 100% SINTETIS.** Dibangkitkan dengan generator acak
(seed 42) untuk keperluan latihan — BUKAN data pelanggan asli, BUKAN log produksi
asli, BUKAN konfigurasi pipeline asli perusahaan mana pun. Perusahaan "NusaTel",
model "churn v2.3.1", dan tokoh "Head of Data" adalah fiksi.

## Generator

Skrip: `/tmp/cap2-notebook-gen.py` (scratch builder, prefix `cap2-notebook-`),
seed RNG: `numpy.random.default_rng(42)`.

1. **Populasi dasar** — tiap baris adalah satu pelanggan fiksi:
   `tenure_months` ~ randint(1,36); `monthly_spend` ~ lognormal; `support_tickets` ~
   Poisson(0,9); `total_minutes` ~ Gamma × noise (menit pemakaian 30 hari).
2. **Label churn** — `P(churn) = sigmoid(-0,9 − 0,0016·menit + 0,55·tiket − 0,04·tenure + noise)`.
   Hasil: churn rate training 11,3%, produksi 10,8%.
3. **Model** — `LogisticRegression` (sklearn, C=1.0) dilatih di data training;
   kolom `score` di kedua file = probabilitas model ini (versi fiksi "v2.3.1").

## Tiga injeksi yang disengaja (ini inti latihannya)

1. **Hidden skew — `total_minutes`.** Training memakai jumlah menit trailing **30 hari**;
   serving memakai trailing **7 hari** (≈ ×7/30 + noise). Rata-rata bergeser jauh.
2. **Leakage — `days_since_last_login`.** Di training, fitur ini dihitung memakai
   riwayat login **30 hari SETELAH label_date** (data masa depan); di serving dipakai
   nilai bersih as-of waktu inferensi. Inilah yang menggelembungkan AUC training.
3. **Monitoring mati.** `feature_config.csv` mencatat `monitoring_aktif=false` untuk
   semua fitur — drift tidak pernah dipantau.

## Angka acuan (dihitung dari file ini)

- AUC training (dari kolom `score`): **0,9081 → 0,91**
- AUC produksi (dari log): **0,7214 → 0,72** — gap **0,19**
- Skew ternormalisasi |μ_train − μ_serve| / σ_train: total_minutes **1,094**;
  days_since_last_login 0,182; support_tickets 0,041; monthly_spend 0,010;
  tenure_months 0,006
- AUC minggu pertama pasca-deploy (2026-09-01 s.d. 2026-09-07, n=354): **0,7069 → 0,71**
  — rendah sejak awal, bukan menurun bertahap.

## Batas jujur

- Modelnya linear sederhana; produksi nyata memakai model yang jauh lebih kompleks.
- "Leakage" di sini disimulasikan lewat pergeseran distribusi, bukan lewat pipeline
  waktu yang sebenarnya.
- Angka 0,91 / 0,72 adalah hasil generator seed 42 — seed lain memberi angka
  sedikit berbeda, tetapi pola (gap besar + skew total_minutes) tetap muncul.

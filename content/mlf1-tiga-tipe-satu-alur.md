# MLF1: ML di Finance — Tiga Tipe, Satu Alur Kerja

## Masalah: Dua Pelamar, Satu Keputusan

Tiga pengajuan kredit. P1: penghasilan 2,4 juta/bulan, 1 kali terlambat 90 hari. P2: 1,7 juta, 2 kali terlambat. P3: 4,2 juta, belum pernah terlambat. Insting berkata P3 aman dan P2 berisiko — tapi insting tidak bisa diuji. Model ML menjawab dengan cara yang bisa diuji: belajar dari 12 nasabah masa lalu (7 lancar, 5 default; base rate default 5/12 = 0,4167).

Track ini punya empat pembeda yang tidak dimiliki kursus ML-finance biasa: stress test tiga skenario (M2.3), policy simulator (M2.3), fairness audit + mitigasi (M2.2, M7), dan adverse-action reason codes (M2.2) — semuanya diajarkan dengan angka yang bisa direplikasi, bukan sekadar disebut.

---

## 1. Supervised Learning

Belajar dari label: tiap baris data latih punya jawaban. Contoh: 30.000 nasabah kartu kredit berlabel default (1) atau lancar (0).

**Nilai:** test set 6.000 nasabah — Logistic Regression ROC-AUC 0,7426; Gradient Boosting 0,7823. Selisih 0,7823 − 0,7426 = 0,0397.

**Gambar:** scatter 12 nasabah (X penghasilan, Y keterlambatan): titik merah menumpuk di keterlambatan ≥ 2. Bar default rate: 0% untuk keterlambatan 0–1 kali, 100% untuk 2 kali dan 3+ kali (n per bucket: 0 kali 4 orang; 1 kali 3; 2 kali 2; 3+ kali 3 — gabungan 0–1: 7 orang).

**Baik/buruk:** bagus bila label benar dan mewakili masa depan. Buruk bila label salah catat atau bias seleksi (model hanya melihat pinjaman yang disetujui).

**Mitigasi:** bersihkan label dulu (L0); pisahkan test set yang tidak pernah dilihat model (notebook: 6.000 dari 30.000).

Logistic regression (sigmoid → log-odds; koefisien = arah hubungan) cocok untuk default biner karena keluarannya probabilitas yang bisa dikalibrasi — pengajaran penuh di M2. Supervised tidak hanya klasifikasi: regresi memprediksi angka (loss amount, recovery rate, exposure, return/volatilitas).

Selection bias — konsekuensi: label default hanya ada untuk pinjaman yang disetujui; performa pada yang disetujui belum tentu berlaku pada yang ditolak. Obatnya di M2: reject inference (extrapolation, reweighting, fuzzy augmentation). Bila approval rate berbeda jauh antar kelompok nasabah, audit fairness sebelum model dipakai (audit penuh M7).

Catatan jarak (1-NN): jarak Euclidean sensitif terhadap skala fitur, fitur kategorikal, dan outlier — standardisasi dan encoding yang tepat adalah prasyaratnya (detail L0).

$$d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$

---

## 2. Unsupervised Learning

Mencari pola tanpa label: clustering (kelompok) dan anomaly detection (penyimpangan).

**Nilai:** 15 transaksi, z-score — mean 733,47, sd 1523,95. Ambang flag |z| > 2. Dua ter-flag: 5.000 (z = 2,80) dan 4.200 (z = 2,27); z tertinggi berikutnya yang tidak ter-flag hanya −0,42 (transaksi 88, 95, dan 99).

**Gambar:** tiga gugus tanpa label + satu titik terpencil.

**Baik/buruk:** bagus bila pola stabil dan bisa dijelaskan. Buruk bila gugus adalah artefak skala fitur.

**Mitigasi:** normalisasi fitur sebelum clustering; validasi dengan domain knowledge. Untuk data skewed, pakai median/MAD atau log-transform. Anomali = antrean periksa, bukan vonis.

---

## 3. Reinforcement Learning

Belajar dari reward, bukan label. Cocok untuk keputusan berurutan: trading, penetapan harga. Reinforcement learning di luar cakupan track ini — ia butuh simulator pasar, dan desain reward-nya adalah bidang tersendiri.

**Nilai:** agen trading, reward = profit − 0,5 × risiko. Aksi beli: profit 0,08, risiko 0,10 → reward = 0,08 − 0,5 × 0,10 = 0,03. Aksi tahan: reward 0. Agen memilih beli.

**Gambar:** loop state → aksi → reward → state berikutnya.

**Baik/buruk:** bagus bila reward mencerminkan tujuan bisnis. Buruk bila reward bisa diakali (reward hacking).

**Mitigasi:** desain reward bersama tim bisnis, tambah penalti risiko, uji di data yang belum pernah dilihat termasuk periode krisis.

**Peringatan time series:** harga dan return bergantung pada kemarin — bukan sampel independen yang bisa diacak. Split acak bisa mengintip masa depan lewat tetangga waktunya. Aturan sama: latih masa lalu, uji masa depan (pendalaman M4, M9).

---

## 4. Workflow End-to-End (7 Tahap)

Framing → Data → Fitur → Model → Evaluasi → Threshold → Monitoring.

Pemetaan notebook: framing (siapa boleh diberi kredit?) → data (UCI 30.000, default rate 0,2212) → fitur (utilisasi limit, riwayat telat) → model (LR 0,7426 → GBM 0,7823) → evaluasi (ROC-AUC, PR-AUC 0,5597 vs base rate 0,2212) → threshold (0,10) → monitoring (drift).

Model hanya tahap keempat dari tujuh. Framing yang salah membuat model yang benar menjawab pertanyaan yang salah.

**Framing kredit — empat hal:** unit observasi (aplikasi/rekening/nasabah); definisi label default + horizon; observation window (fitur hanya dari info yang tersedia pada tanggal aplikasi); performance window (outcome diamati setelahnya). Horizon harus didefinisikan di framing.

**Gambar:** diagram tiga waktu — tanggal aplikasi → observation window (fitur) → performance window (default). Saldo tunggakan setelah tanggal aplikasi bukan fitur — itu masa depan.

**Skor → keputusan:** skor (ranking) → probabilitas default (PD) → threshold 0,10 [notebook] → approve/review/reject → biaya FN/FP. Model tidak otomatis menghasilkan keputusan.

**Leakage ≠ overfitting:** leakage = informasi masa depan bocor ke fitur/latih (tunggakan setelah tanggal aplikasi; fitur yang baru ada setelah persetujuan; imputasi/scaling sebelum split; random split pada data berwaktu). Overfitting masih terlihat dari gap train-test; leakage tidak — test ikut bocor, skor tampak tinggi di kedua sisi.

---

## Lab 1: 1-NN dari Nol

Prediksi: [0, 1, 0] — P1 lancar, P2 default, P3 lancar. Akurasi test 1,0000 (n = 3 — bukti lemah); baseline train 0,5833 (7 dari 12 di data latih); baseline pada test yang sama 0,6667 (2 dari 3 lancar).

## Lab 2: Anomali z-score

mean = 733,47; sd = 1523,95; flagged: [5000, 4200]; z(5000) = 2,80; z(4200) = 2,27.

## Mini-case: Tiga Pelamar

PD = peluang default dalam horizon yang didefinisikan; LGD = porsi exposure yang hilang bila default; EAD = besar exposure saat default; Expected Loss = PD × LGD × EAD. Semua angka di sini asumsi ilustrasi [ilustrasi], bukan angka notebook. Margin (pendapatan bila lancar) ≠ loss (yang hilang bila default) ≠ capital/risk appetite (seberapa besar EL yang boleh diambil).

Asumsi ilustrasi: limit Rp10.000.000, LGD 45%, margin 5%. P2 (prediksi default, PD ilustrasi 0,5): EL = 0,5 × 45% × 10.000.000 = Rp2.250.000 vs margin Rp500.000 → tolak. P1 (PD ilustrasi 0,1): EL = Rp450.000 < margin Rp500.000 → setujui bersyarat. P3: setujui.

## Peta M2 — Credit Scoring

Scorecard: fitur mentah → bin → Weight of Evidence (WoE) → Information Value (IV) → skor yang bisa dijelaskan. Roll-rate: migrasi current → 1–30 DPD → 31–60 DPD → 61–90 DPD → default. Reject inference: inferensi outcome pelamar yang ditolak (extrapolation, reweighting, fuzzy augmentation). Vintage analysis dan IFRS 9 staging menyusul. Peta konsep saja — pengajaran penuh di M2.

## Yang TIDAK Diajarkan Track Ini

Yang TIDAK diajarkan track ini — dan itu disengaja. Prediksi harga / forecasting deret waktu (ARIMA, Prophet, LSTM): track ini mengukur risiko dari data yang ada, bukan meramal harga besok — forecasting butuh data dan metode deret waktu yang berbeda, dan itu track tersendiri. NLP keuangan (sentimen berita, parsing laporan keuangan dan disclosure): track ini bekerja dengan angka dan tabel, bukan teks — NLP butuh korpus teks dan model bahasa, dan itu juga track tersendiri. Reinforcement learning juga di luar cakupan (lihat langkah 5). Bila kamu datang untuk «memprediksi harga saham», track ini bukan jalannya — track ini mengajarkanmu mengukur, membandingkan, dan memvalidasi model atas data yang sudah terjadi.

## Guided Task di Colab

Notebook: colab/mlf1-guided-task.ipynb — klasifikasi kredit mini end-to-end dengan checks. Tautan Colab: https://colab.research.google.com/drive/1NA4DmvLx3Tr8YPgYqkOalEJlka8SJXMD. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Supervised = belajar dari label; unsupervised = pola tanpa label; reinforcement = belajar dari reward.
- Workflow 7 tahap; model hanya satu di antaranya.
- Notebook: GBM ROC-AUC 0,7823 vs LR 0,7426.
- Framing kredit: unit, label, observation window, performance window — jangan biarkan masa depan bocor ke fitur.

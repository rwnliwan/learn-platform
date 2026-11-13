# MLF-M2.1: Supervised & Logistic Regression — dari Skor ke Probabilitas

## Masalah: Tiga Pelamar, Satu Keputusan — Bank Minta Probabilitas

Tiga pelamar dari MLF1 kembali: P1 penghasilan 2,4 juta/bulan, 1 kali terlambat. P2: 1,7 juta, 2 kali terlambat. P3: 4,2 juta, belum pernah terlambat. 1-NN memprediksi P1 lancar, P2 default, P3 lancar — tapi label 0/1 tidak punya harga. Bank bertanya «berapa peluangnya default, dan berapa kerugiannya?» Pelamar PD 0,11 dan PD 0,49 sama-sama berlabel «lancar» pada threshold 0,5 — padahal risikonya berbeda empat setengah kali lipat.

---

## 1. Klasifikasi vs Regresi

PD (probability of default) adalah klasifikasi — jawabannya peluang 0–1. LGD (loss given default) dan EAD (exposure at default) adalah regresi — jawabannya angka. Ketiganya dikali menjadi Expected Loss.

**Nilai:** EL = PD × LGD × EAD. Contoh [ilustrasi]: PD 0,5, LGD 45%, EAD Rp10.000.000 → EL Rp2.250.000. Bila PD meleset 0,10, EL meleset Rp450.000 per nasabah — pada 6.000 nasabah test, Rp2,7 miliar.

**Baik/buruk:** bagus bila horizon dan definisi default jelas. Buruk bila definisi berubah antar periode, atau LGD nyaris tidak teramati (hanya ada untuk yang default).

**Mitigasi:** definisikan PD, LGD, EAD sekali di framing; pakai definisi yang sama di evaluasi, scorecard, dan laporan regulator. PD 12 bulan untuk Stage 1 IFRS 9, PD lifetime untuk Stage 2 (M2.4).

**Data dictionary UCI (ringkas) [notebook]:** 30.000 nasabah, 23 fitur + label default payment next month (Oktober 2005). LIMIT_BAL: min 10.000, maks 1.000.000, mean 167.484. PAY_AMT1: min 0, maks 873.552. PAY_0 (status bayar September 2005): −2: 2.759 (default 0,1323), −1: 5.686 (0,1678), 0: 14.737 (0,1281), 1: 3.688, 2: 2.667, 3: 322, 4: 76, 5: 26, 6: 11, 7: 9, 8: 19. EDUCATION = 0: 14 baris, 0 default — kategori sampah, bukan sinyal. Aturan preprocessing versi scorecard (jembatan dari L0, bukan ulangan): imputasi mean HANYA dari train (mean train 2,3); kategori baru di test (misal PAY_0 = 9) → «unknown», bukan dibuang diam-diam; tidak ada fitur yang dihitung dari label bulan depan.

**Gambar:** range bar LIMIT_BAL / PAY_AMT1 — min–mean–maks menunjukkan ekor panjang yang wajar untuk data kredit.

$$EL = PD \times LGD \times EAD$$

---

## 2. Logistic Regression

Skor linear z = w·x + b dilewatkan fungsi sigmoid menjadi probabilitas 0–1. Koefisien dibaca sebagai odds ratio: OR = e pangkat koefisien.

**Nilai:** test set 6.000 nasabah [notebook] — LR ROC-AUC 0,7426. Koefisien (standardisasi): PAY_DELAY_COUNT 0,756 (OR 2,13); PAY_MAX 0,274 (OR 1,32); PAY_0 0,243 (OR 1,28); LIMIT_BAL −0,240 (OR 0,79); PAY_AMT1 −0,161 (OR 0,85).

**Gambar:** kurva sigmoid — z = 0 → p = 0,50 (ragu); z = 2 → p = 0,88; z = −2 → p = 0,12. Di tengah kurva curam, di ujung datar.

**Baik/buruk:** bagus bila hubungan mendekati linear dalam log-odds dan penjelasan harus sampai ke regulator. Buruk bila ada interaksi/non-linearitas kuat tanpa fitur interaksi manual.

**Mitigasi:** standardisasi fitur sebelum membandingkan koefisien; laporkan odds ratio beserta arahnya.

$$p = \frac{1}{1 + e^{-z}}, \quad z = w \cdot x + b, \quad \text{log-odds} = \log\frac{p}{1-p}$$

---

## 3. Decision Tree

Belahan berurutan sampai ke daun; daun berisi kelompok dengan risiko yang sama — bukan vonis.

**Nilai:** stump PAY_0 ≥ 1,5 [notebook] — ROC-AUC test 0,6443. Daun kiri (PAY_0 ≤ 1): default rate 0,1659 (n = 26.870). Daun kanan (PAY_0 ≥ 2): 0,6955 (n = 3.130). Depth-2: ROC-AUC test 0,7153 (train 0,7318); importance PAY_0 0,788, PAY_MAX 0,198, BILL_AMT1 0,014.

**Gambar:** diagram stump — akar PAY_0 ≥ 1,5, dua daun (0,1659 vs 0,6955).

**Baik/buruk:** bagus bila aturannya harus dibaca komite kredit. Buruk bila dibiarkan tumbuh dalam (overfitting).

**Mitigasi:** batasi depth, tetapkan minimum nasabah per daun, bandingkan dengan LR sebagai baseline.

---

## 4. LR vs Tree vs GBM

**Nilai:** ROC-AUC test [notebook] — stump 0,6443; depth-2 0,7153; LR 0,7426; GBM 0,7823. GBM mengungguli LR sebesar 0,0397. Train GBM 0,8469 vs test 0,7823 — gap 0,0646 (sebagian keunggulan adalah hafalan).

**Gambar:** bar ROC-AUC keempat model — lompatan terbesar stump → depth-2; LR → GBM hanya 0,0397.

**Baik/buruk:** GBM bagus bila yang dikejar skor mentah dan penjelasan dibantu SHAP/reason codes. Buruk bila keputusan harus dijelaskan kata per kata tanpa alat bantu — di situlah LR menang.

**Mitigasi:** mulai dari LR sebagai baseline jujur (0,7426); tanyakan apakah 0,0397 sepadan dengan kehilangan penjelasan.

**PR-AUC dan balanced accuracy [notebook]:** ROC-AUC menyembunyikan masalah kelas tidak seimbang (default hanya 22,12%). PR-AUC test: LR 0,5049; stump 0,3763; depth-2 0,4343; GBM mentah 0,5597; GBM terkalibrasi 0,5558. Balanced accuracy (rata-rata recall dan specificity): LR threshold 0,10 — precision 0,2541, recall 0,9164, specificity 0,2363, BA 0,5763, akurasi 0,3867; LR threshold 0,50 — precision 0,6482, recall 0,2916, specificity 0,9551, BA 0,6233, akurasi 0,8083; GBM terkalibrasi threshold 0,10 — precision 0,2828, recall 0,9141, specificity 0,3415, BA 0,6278, akurasi 0,4682; GBM terkalibrasi threshold 0,50 — precision 0,6750, recall 0,3647, specificity 0,9501, BA 0,6574, akurasi 0,8207. Pelajaran: akurasi 0,4682 pada threshold 0,10 tetap konsisten dengan kebijakan yang menguntungkan — akurasi menghitung semua error sama, kebijakan mengoptimasi profit (FN jauh lebih mahal dari FP). ROC-AUC menjawab «apakah ranking-nya bagus», PR-AUC dan BA menjawab «apakah keputusan pada threshold ini berguna».

**Gambar:** ROC vs PR — kurva ROC keempat model dan kurva PR yang sama; PR menunjukkan keunggulan GBM lebih jelas karena baseline-nya 0,2212, bukan 0,5.

---

## 5. Validasi Temporal, Leakage & Out-of-Time

**Prinsip:** validasi acak menguji «apakah model bekerja pada nasabah serupa di periode yang sama». Validasi temporal menguji «apakah model bekerja pada periode yang akan datang» — dan itu yang ditanyakan bisnis. Aturannya: latih pada periode lama, validasi pada periode baru; fitur tidak boleh memakai informasi dari masa depan (leakage); WoE/IV dihitung HANYA dari train — menghitungnya dari seluruh data lalu mengklaim validasi adalah leakage yang disamarkan.

**Fakta struktural (jujur):** UCI adalah satu snapshot (fitur September 2005, label Oktober 2005) — true out-of-time split TIDAK mungkin di dataset ini. Yang diajarkan di sini adalah prinsip + timeline + aturan, dan eksperimen cutoff sebagai demonstrasi temporal — bukan klaim ada split OOT sungguhan di UCI.

**Nilai [notebook]:** IV PAY_0 7-bin (4+ digabung): FULL 0,8761, TRAIN 0,8881, TEST 0,8363 — IV yang dihitung dari train sedikit lebih tinggi dari test, wajar; IV dari seluruh data (0,8761) sedikit di bawah train karena mencakup test. LR cutoff Juli (fitur April–Juli saja) ROC-AUC test 0,6922 vs cutoff September (semua fitur) 0,7426 — selisih −0,0504: dua bulan fitur terbaru bernilai 5 poin ROC-AUC. Profit per pelamar pada threshold 0,10: train NT$1.338 vs test NT$1.315 — hampir sama, model tidak overfit pada profit.

**Gambar:** timeline — fitur observasi (April–September) → cutoff → label masa depan (Oktober); area train / validation / OOT.

**Baik/buruk:** bagus bila cutoff dinyatakan eksplisit dan tidak ada fitur pasca-cutoff. Buruk bila fitur «bocor» dari masa depan — misal status bayar Oktober dipakai memprediksi default Oktober.

**Mitigasi:** kunci cutoff sebelum melatih; hitung WoE/IV dari train saja; laporkan metrik train DAN test berdampingan.

---

## Lab 1: Logistic Regression dari Nol

Gradient descent, lr 0,5, 300 iterasi, 12 nasabah. w0 = −3,2068, w1 = 4,3549, b = −1,2418. Odds ratio income 0,0405, late 77,8599 [lab] — ekstrem karena data kecil dan separable sempurna; bandingkan notebook: PAY_DELAY_COUNT OR 2,13. P1 PD 0,1741, P2 PD 0,9864, P3 PD 0,0000. Prediksi [0, 1, 0], akurasi test 1,0000 (n = 3 — bukti lemah). Tugas tambahan: preprocessing scorecard — imputasi mean train-only 2,3; kategori baru PAY_0 = 9 di test → «unknown» [lab].

## Lab 2: Decision Stump

Belahan terbaik: income ≤ 2,35 (err 0) dan late ≥ 1,5 (err 0) — dua belahan sempurna dari n = 12 adalah peringatan, bukan prestasi. Prediksi [0, 1, 0], akurasi test 1,0000.

## Mini-case: Tiga Pelamar, dari PD ke Keputusan

PD dari Lab 1 [lab] + asumsi ilustrasi [ilustrasi] (limit Rp10.000.000, LGD 45%, margin Rp500.000). P2 (PD 0,9864): EL Rp4.438.800 vs margin Rp500.000 → tolak. P1 (PD 0,1741): EL Rp783.450 > margin Rp500.000 → tolak, atau setujui dengan limit jauh lebih kecil — meski labelnya «lancar» pada threshold 0,5. P3 (PD 0,0000): EL ≈ Rp0 → setujui. Label «lancar» ≠ menguntungkan; threshold 0,10 notebook adalah versi disiplin perhitungan ini (M2.3).

## Guided Task di Colab

Notebook: colab/mlf-m21-guided-task.ipynb — LR dan tree di data UCI 30.000 nasabah dengan sklearn, lengkap dengan checks. Tautan Colab: Buka di Colab: https://colab.research.google.com/drive/1q2p5KbstLASt8nATfSDsAx8VHs0LJmnu. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Klasifikasi menjawab PD, regresi menjawab LGD dan EAD; EL = PD × LGD × EAD.
- LR: sigmoid mengubah skor linear menjadi probabilitas; koefisien dibaca sebagai odds ratio (PAY_DELAY_COUNT 0,756 → OR 2,13).
- Stump PAY_0 ≥ 1,5: daun kiri 0,1659, daun kanan 0,6955; ROC-AUC baru 0,6443.
- GBM 0,7823 vs LR 0,7426 — selisih 0,0397 dengan harga interpretabilitas.
- Lab: LR dari nol memprediksi P1 lancar, P2 default, P3 lancar; odds ratio lab ekstrem karena n = 12 dan separable.
- PR-AUC test: GBM terkalibrasi 0,5558 vs LR 0,5049; balanced accuracy GBM 0,6574 vs LR 0,6233 pada threshold 0,50.
- IV PAY_0: train 0,8881 vs test 0,8363; LR cutoff Juli 0,6922 vs September 0,7426 — UCI satu snapshot, true OOT tidak mungkin.
- PAY_0: −2: 2.759 (default 0,1323), −1: 5.686 (0,1678), 0: 14.737 (0,1281); imputasi mean dari train saja.

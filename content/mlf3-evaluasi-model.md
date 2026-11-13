# MLF3: Evaluasi Model — Metrik yang Jujur

## Masalah: Model 77,88% Akurat yang Tidak Menangkap Satu Pun Default

Model memprediksi "tidak default" untuk semua orang: akurasi 4.673/6.000 = 0,7788, recall 0%. Accuracy paradox: pada data imbalance, akurasi didominasi kelas mayoritas.

---

## 1. Confusion Matrix: Precision, Recall, F1

TP = benar menangkap; FP = salah tuduh; FN = lolos; TN = benar melepas.

**Nilai:** threshold 0,5 (TP 700, FP 400, FN 627, TN 4.273): precision = 700/1.100 = 0,6364; recall = 700/1.327 = 0,5275; F1 = 0,5768; akurasi 0,8288. Threshold 0,10 (TP 1.080, FP 1.420, FN 247, TN 3.253): precision 0,4320; recall 0,8139; F1 0,5644; akurasi 0,7222. Recall naik 28,64 poin; akurasi turun.

**Gambar:** tradeoff threshold — precision turun 0,64 → 0,43 sementara recall naik 0,53 → 0,81.

**Baik/buruk:** tidak ada pasangan precision-recall yang baik absolut; yang baik cocok dengan biaya FN vs FP.

**Mitigasi:** pilih threshold dari biaya, bukan default 0,5. FN NT$45.000 vs FP NT$5.000 → threshold 0,10 hemat biaya 39,7% [mini-case] vs 0,5.

**Skor → keputusan [mini-case]:** threshold 0,5 — disetujui 4.900 (81,7%), ditolak 1.100 (18,3%); threshold 0,10 — disetujui 3.500 (58,3%), ditolak 2.500 (41,7%). Threshold bukan angka "benar" universal — ia pilihan risk appetite yang dituangkan dalam policy rule (approve/review/reject). Model tidak otomatis menghasilkan keputusan.

$$\text{precision} = \frac{TP}{TP+FP} \qquad \text{recall} = \frac{TP}{TP+FN} \qquad F_1 = \frac{2PR}{P+R}$$

---

## 2. ROC-AUC

Luas di bawah kurva ROC = P(skor positif acak > skor negatif acak). Tidak tergantung satu threshold.

**Nilai:** LR 0,7426; GBM 0,7823. Band: 0,5 acak; 0,7–0,8 lumayan; 0,8–0,9 bagus; > 0,9 curigai leakage. Menurut band generik, GBM 0,7823 = lumayan, 0,0177 di bawah ambang bagus. Lab (10 skor): ROC-AUC 0,8333.

**Gambar:** kurva ROC lab di atas diagonal — AUC 0,8333.

**Baik/buruk:** untuk credit scoring dengan fitur standar, angka ini dapat diterima. > 0,9 patut dicurigai leakage.

**Mitigasi:** ROC-AUC rendah → tambah fitur bermakna atau model fleksibel. ROC-AUC mencurigakan → audit fitur satu per satu.

**Catatan:** band ini heuristik untuk konteks ini, bukan standar universal — "cukup" bergantung pada use case, horizon, biaya, populasi, stabilitas. ROC-AUC mengukur ranking, bukan kalibrasi: model bisa punya AUC tinggi tetapi probabilitasnya tidak terkalibrasi.

$$\text{ROC-AUC} = P(\text{skor}^+ > \text{skor}^-)$$

---

## 3. PR-AUC vs Base Rate

PR-AUC sensitif terhadap imbalance; baseline-nya base rate, bukan 0,5.

**Nilai:** GBM PR-AUC 0,5597 vs base rate 0,2212 → rasio 0,5597/0,2212 = 2,53. LR 0,5049 → rasio 2,28. Lab: base rate 0,40 (4 dari 10).

**Gambar:** kurva PR lab di atas garis base rate 0,40.

**Baik/buruk:** 0,5597 baik relatif terhadap base rate 0,2212; akan buruk bila base rate 0,5 (rasio 1,12).

**Mitigasi:** PR-AUC mendekati base rate → kembali ke fitur dan data, bukan tuning.

**Catatan:** imbalance, kalibrasi, dan threshold adalah tiga hal berbeda. Resampling, class weight, dan threshold adjustment mengubah tradeoff FN/FP, tetapi tidak satu pun memperbaiki kalibrasi secara otomatis (M2 membandingkan ketiganya).

$$\text{baseline PR-AUC} = \text{base rate} = \frac{\text{positif}}{\text{total}}$$

---

## 4. Kalibrasi dan Brier Score

Apakah skor 0,8 berarti peluang 80%? Brier = rata-rata (skor − label)². Makin kecil makin baik.

**Nilai:** lab Brier 0,1802. Notebook: LR 0,1427; GBM 0,1342 (lebih rendah 0,0085); GBM terkalibrasi 0,1345.

**Catatan:** Brier mencampur discrimination dan calibration — Brier rendah bisa datang dari salah satunya, dan Brier bergantung pada prevalensi, jadi jangan bandingkan lintas populasi dengan base rate berbeda.

**Gambar:** 4 bin kalibrasi lab — (0,150 vs 0,000), (0,383 vs 0,333), (0,575 vs 0,500), (0,850 vs 0,667); dekat diagonal, bin tertinggi sedikit overconfident.

**Baca bin tertinggi:** prediksi 0,850 vs kejadian 0,667 (2 dari 3 default) — model overpredict; PD seperti ini membengkakkan expected loss bila dipakai di PD × LGD × EAD.

**Baik/buruk:** Brier rendah mendukung kualitas probabilistik, tetapi kalibrasi harus dicek dengan reliability diagram/ECE; kalibrasi dulu sebelum dipakai untuk expected loss.

**Mitigasi:** kalibrasi buruk → Platt scaling atau isotonic regression pada data validasi.

**Kartu perbandingan [notebook]:** LR ROC-AUC 0,7426 / PR-AUC 0,5049 / Brier 0,1427; GBM 0,7823 / 0,5597 / 0,1342; GBM terkalibrasi 0,7816 / 0,5558 / 0,1345. Ranking terbaik: GBM. Skor probabilitas terbaik: GBM mentah (0,1342, sedikit di bawah 0,1345). Kalibrasi hampir tidak mengubah apa pun karena GBM sudah cukup terkalibrasi.

$$\text{Brier} = \frac{1}{n}\sum_{i=1}^{n} (p_i - y_i)^2$$

---

## 5. Cross-Validation

Satu split = satu undian. 5-fold CV: tiap baris jadi test tepat sekali, lima skor dirata-rata.

**Nilai:** notebook satu split — 24.000 latih (30.000 − 6.000), 6.000 test. Selisih LR–GBM 0,0397 tidak memberi tahu stabilitasnya tanpa CV.

**Gambar:** diagram 5-fold.

**Baik/buruk:** CV baik bila fold mewakili populasi. CV acak buruk untuk data berwaktu (bocor masa depan).

**Mitigasi:** time-based split / walk-forward untuk data berwaktu. CV untuk memilih, test untuk melaporkan.

**Catatan:** CV acak mengintip masa depan — test set notebook 6.000 dari 30.000 [notebook] tidak menjamin validitas temporal. Metrik agregat menyembunyikan perbedaan antarsegmen/cohort/vintage — vintage analysis di M2, evaluasi per segmen di M7.

---

## Lab 1: Metrik dan Biaya

Threshold 0,5: acc 0,8288, prec 0,6364, rec 0,5275, F1 0,5768, biaya NT$30.215.000. Threshold 0,10: acc 0,7222, prec 0,4320, rec 0,8139, F1 0,5644, biaya NT$18.215.000. Baseline mayoritas 0,7788. Hemat 39,7% [lab].

## Lab 2: ROC-AUC dan Brier dari Nol

ROC-AUC 0,8333 (Mann-Whitney: 20 dari 24 pasangan menang). Brier 0,1802. Kurva ROC/PR dan 4 bin kalibrasi dihitung dari 10 skor.

## Mini-case: Threshold 0,5 atau 0,10

Biaya 0,5: 627 × 45.000 + 400 × 5.000 = NT$30.215.000. Biaya 0,10: 247 × 45.000 + 1.420 × 5.000 = NT$18.215.000. Hemat 39,7% [mini-case]. Notebook (data penuh): threshold 0,10 hemat 45,2% [notebook] vs 0,5 dan 59,8% [notebook] vs approve-all. Mini-case memakai limit flat NT$100.000 untuk semua nasabah; notebook memakai limit masing-masing nasabah (LIMIT_BAL) — jangan dicampur. Keputusan: pakai 0,10 + adverse-action reason codes untuk 1.420 nasabah bagus yang ditolak (false positive). Reason code: tiap nasabah yang ditolak menerima tiga alasan utama dalam bahasa awam (misal keterlambatan bulan lalu, utilisasi limit yang hampir penuh, tagihan naik tiga bulan berturut-turut) — dari kontribusi fitur model (penuh di M7: SHAP); syarat audit dan kepercayaan nasabah. Dalam praktik, seluruh nasabah yang ditolak menerima pemberitahuan adverse action.

## Guided Task di Colab

Notebook: colab/mlf3-guided-task.ipynb — evaluasi penuh model credit scoring dengan checks. Tautan Colab: https://colab.research.google.com/drive/1KctExa3rR5fM-9U-i4yx7XMxQs9qBUt3. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Accuracy paradox: baseline mayoritas 0,7788.
- Precision-recall tradeoff dipilih dari biaya.
- ROC-AUC GBM 0,7823; PR-AUC 0,5597 = 2,53× base rate.
- Brier GBM 0,1342 vs LR 0,1427; CV: lima skor, bukan satu undian.
- ROC-AUC mengukur ranking, bukan kalibrasi — probabilitas untuk expected loss dicek dengan reliability diagram.

# MLF4: Overfitting dan Underfitting — Diagnosis dan Obat

## Masalah: Model yang Hafal Masa Lalu, Buta pada Masa Depan

Model trading backtest nyaris sempurna (Sharpe 4,2) kehilangan 18% dalam dua bulan live: ia menghafal noise, bukan pola. Di credit scoring lebih halus: GBM notebook train ROC-AUC 0,8469 vs test 0,7823 — gap 0,0646. Sebagian dari 0,8469 adalah hafalan.

---

## 1. Diagnosis: Gap Train-Test

Bandingkan skor train vs test. Dekat dan tinggi = general. Train jauh di atas test = menghafal. Keduanya rendah = belum belajar.

**Nilai:** GBM — train 0,8469, test 0,7823, gap = 0,0646. Band (rule of thumb, dikalibrasi pada gap ROC-AUC): < 0,02 sehat; 0,02–0,05 ringan; 0,05–0,10 perlu perhatian; > 0,10 waspada. Gap GBM masuk perlu perhatian.

**Gambar:** dua bar train/test + bracket gap 0,0646. Panel B — leakage: fitur masa depan → train tampak tinggi → test tampak tinggi; gap kecil, TAPI BOCOR.

**Baik/buruk:** gap perlu perhatian + test lumayan (band ROC-AUC MLF3: 0,7–0,8 = lumayan) = masih layak dipakai. Gap kecil + test rendah = model lemah, bukan sehat.

**Mitigasi:** gap waspada → regularisasi, CV, model sederhana, data lebih banyak. Gap perlu perhatian → monitoring berkala yang lebih ketat (M7).

---

## 2. Underfitting

Model terlalu sederhana untuk pola di data. Ciri: train dan test sama-sama rendah; tambah data tidak membantu.

**Nilai:** polinomial derajat 1 (garis lurus) pada sinus + noise: train MSE 0,2276, test MSE 0,2435, gap 0,0159. R² train 0,563, test 0,539 (n = 30).

**Gambar:** learning curve derajat 1 — kedua kurva mendatar di 0,5–0,6 saat n 10 → 60. Kurva ini menggenerate ulang data sinus untuk tiap ukuran n (bukan memakai ulang 30 titik lab); test set kurva adalah 60 titik terpisah — jadi R² di lesson ini berasal dari eksperimen kurva, sementara MSE berasal dari Lab 1 (test set 30 titik).

**Baik/buruk:** buruk bila pola jelas ada tapi tidak tertangkap. Bisa diterima sebagai baseline (LR 0,7426 vs GBM 0,7823).

**Jangan buru-buru vonis "underfit":** cek baseline-nya, feature set-nya (model yang kalah karena fitur lebih sedikit bukan underfit), kebutuhan bisnis (LR 0,7426 [notebook] mungkin sudah cukup), dan stabilitas validasi. "Underfit relatif terhadap GBM" adalah deskripsi perbandingan, bukan vonis.

**Mitigasi:** tambah fitur bermakna, model lebih fleksibel, kurangi regularisasi. Jangan tambah data dulu.

---

## 3. Good Fit

Cukup fleksibel untuk pola, tidak cukup liar untuk noise. Ciri: train dan test tinggi dan konvergen.

**Nilai:** derajat 3: train MSE 0,0170, test MSE 0,0223, gap 0,0053 (MSE dari Lab 1, test set 30 titik). R² 0,967/0,941 (dari eksperimen learning curve, test set 60 titik) — dua eksperimen, angka tidak dibandingkan langsung. Test MSE 10,92× lebih kecil dari derajat 1 (0,2435/0,0223). CV MSE 0,0250 — terendah dari derajat 1, 2, 3, 5, 9.

**Gambar:** learning curve derajat 3 — konvergen di ~0,94.

**Baik/buruk:** baik — siap dipakai dengan monitoring. Good fit hari ini bukan jaminan besok (drift).

**Mitigasi:** kunci konfigurasi; lawan godaan menaikkan kompleksitas.

---

## 4. Overfitting

Terlalu fleksibel: menghafal noise. Ciri: train naik terus, test naik lalu jatuh, gap melebar.

**Nilai:** derajat 9: train MSE 0,0106, test MSE 0,0531 (2,38× derajat 3) — MSE dari Lab 1 (test set 30 titik). R² train 0,980 vs test 0,867, gap 0,113 — R² dari eksperimen learning curve (test set 60 titik); dua eksperimen, jangan dibandingkan angka-per-angka. Yang membawa kesimpulan overfitting adalah CV: CV MSE 1,4998 — hampir 60× derajat 3 (0,0250).

**Gambar:** learning curve derajat 9 — train mendatar ~0,97; test naik dari 0,371 (n = 20) ke 0,940 (n = 60), gap menyusut 0,611 → 0,028. Pada n = 10 test R² −1.643,555 (di luar skala).

**Baik/buruk:** buruk bila test jatuh di bawah kebutuhan bisnis. Ringan (gap GBM 0,0646) masih bisa dipakai dengan monitoring.

**Mitigasi:** (1) regularisasi — ridge λ=1,0: test MSE 0,0531 → 0,0425 (hemat 20,0%); (2) CV memilih kompleksitas; (3) model sederhana; (4) data lebih banyak; (5) early stopping.

**Obat per model:** LR — regularisasi L1/L2 + seleksi fitur; tree/GBM — batasi kedalaman, turunkan learning rate, batasi jumlah estimator, early stopping. Di semua model: kontrol leakage (audit fitur) dan validasi temporal. Tuning sistematis di M6.

$$\text{ridge: } \min_w \sum (y_i - \hat{y}_i)^2 + \lambda \sum w_j^2$$

---

## Lab 1: Polinomial Derajat 1, 3, 9

Derajat 1: train MSE 0,2276, test 0,2435. Derajat 3: 0,0170 / 0,0223. Derajat 9: 0,0106 / 0,0531. Test MSE membentuk U.

## Lab 2: 5-Fold CV + Ridge

CV MSE: derajat 1 = 0,2877; 2 = 0,2625; 3 = 0,0250; 5 = 0,0453; 9 = 1,4998. Derajat 9 tanpa ridge test MSE 0,0531; ridge λ=1 → 0,0425.

## Mini-case: Dua Model, Satu Kursi Produksi

Model A: train 0,91, test 0,88 — gap 0,03 (ringan), test bagus. Model B: train 0,99, test 0,79 — gap 0,20 (waspada), test 0,09 di bawah A. Keputusan: kirim A; obati B (regularisasi, CV, data) sebelum dipertimbangkan lagi.

## Guided Task di Colab

Notebook: colab/mlf4-guided-task.ipynb — diagnosis overfitting pada model kredit dengan checks. Tautan Colab: https://colab.research.google.com/drive/17BciDZh3v1NoDvnqtN2miDRlg5JU7Sq-. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Diagnosis = gap train-test + level test: GBM gap 0,0646 (perlu perhatian).
- Underfitting: kedua skor rendah dan mendatar. Good fit: konvergen tinggi. Overfitting: train naik, test jatuh.
- CV memilih derajat 3 (0,0250); ridge hemat 20,0% pada derajat 9.
- Gap kecil tidak selalu berarti aman — leakage membuat gap kecil dan skor tinggi; audit fitur adalah pertahanannya.
- M1 selesai: tiga tipe ML, statistik baca hasil, metrik jujur, diagnosis overfitting — fondasi M2 credit scoring.

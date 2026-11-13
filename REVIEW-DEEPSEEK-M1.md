# Review DeepSeek — Modul 1 "Machine Learning Finance"

- **Reviewer:** DeepSeek via Kelontong AI (`deepseek-v4.1-flash`, streaming, max-tokens 8000) — kursi reviewer utama
- **Tanggal:** 12 Nov 2026
- **Materi yang direview:** 4 lesson ringkas `content/mlf1-tiga-tipe-satu-alur.md`, `mlf2-membaca-angka.md`, `mlf3-evaluasi-model.md`, `mlf4-overfitting-underfitting.md` + sampling file TS penuh bila klaim ambigu + notebook `colab/mlf4-guided-task.ipynb` (untuk verifikasi F3) dan `colab/mlf2` (data lab, untuk F9)
- **Angka acuan:** spec §3.3 (angka kanonis notebook credit scoring)
- **Verifikasi temuan:** setiap temuan DeepSeek dicek ulang ke file sumber oleh agen review ini SEBELUM ditulis di laporan ini. Dua temuan dikoreksi (F5 sebagian, F9 kesalahan reviewer — lihat catatan verifikasi di tiap temuan). Tidak ada file lesson yang diedit.

## Temuan

### 1. must-fix — MLF3, Mini-case "Threshold 0,5 atau 0,10"

- **Klaim persis (.md):** "Keputusan: pakai 0,10 + adverse-action reason codes untuk 1.420 nasabah yang ditolak."
- **Yang salah:** Pada threshold 0,10, confusion matrix lesson sendiri memberi TP = 1.080 dan FP = 1.420. Jumlah nasabah yang ditolak = TP + FP = **2.500**, bukan 1.420. Angka 1.420 hanya false positive — nasabah layak yang salah ditolak.
- **Verifikasi:** TERKONFIRMASI di `.md`. Catatan penting: file TS penuh (`mlf3-evaluasi-model.ts:599`) justru BENAR — "dengan catatan 1.420 nasabah **bagus** yang ditolak mendapat adverse-action reason codes". Kata "bagus" hilang saat `.md` diringkas, sehingga kalimat `.md` terbaca sebagai 1.420 total ditolak. Jadi ini cacat ringkasan `.md` (yang juga masuk ke `chapters.ts`), bukan cacat lesson web.
- **Perbaikan:** Selaraskan `.md` dengan TS: "…reason codes untuk 1.420 nasabah **bagus** yang ditolak (false positive)". Opsional: tambahkan satu kalimat bahwa dalam praktik seluruh nasabah yang ditolak menerima pemberitahuan adverse action — jangan ubah maksud lesson (fokus pada 1.420 FP) menjadi 2.500 tanpa mengubah framing mini-case.

### 2. must-fix — MLF2, §1 "Mean vs Median"

- **Klaim persis (.md + TS formula):** `median = x_{((n+1)/2)} (data terurut)`
- **Yang salah:** Formula ini hanya benar untuk n ganjil. Contoh lesson memakai n = 10 (genap), sehingga median adalah rata-rata dua nilai tengah, `x_(n/2)` dan `x_(n/2+1)`. `x_(5.5)` tidak ada dalam data terurut. Ini kesalahan definisi inti.
- **Verifikasi:** TERKONFIRMASI. `formulaNote` di TS (`mlf2:54`) justru sudah benar ("atau rata-rata dua nilai tengah (n genap). Pada 10 return contoh, median = (0,02 + 0,02) / 2 = 0,0200") — jadi formula yang ditampilkan bertentangan dengan catatan di bawahnya sendiri.
- **Perbaikan:** Tulis formula piecewise: n ganjil → `x_((n+1)/2)`; n genap → `(x_(n/2) + x_(n/2+1)) / 2`. Jelaskan dengan data 10 bulan. Perbaiki di TS dan `.md`.

### 3. must-fix — MLF4, §3 "Good Fit" dan §4 "Overfitting" (R² vs MSE dari test set berbeda)

- **Klaim persis (.md):** "derajat 3: train MSE 0,0170, test MSE 0,0223, gap 0,0053. R² 0,967/0,941." dan "derajat 9: … test MSE 0,0531 … R² train 0,980 vs test 0,867 — gap 0,113 (waspada)."
- **Yang salah:** MSE dan R² di lesson berasal dari DUA test set berbeda tetapi disajikan berdampingan sebagai satu eksperimen ("pada data lab yang sama", "pada n = 30"):
  - MSE (Lab 1, Langkah 1 notebook): test set 30 titik. Notebook cell 4: deg 1 = 0,2276/0,2435; deg 3 = 0,0170/0,0223; deg 9 = 0,0106/0,0531.
  - R² (learning curve, Langkah 2 notebook): test set 60 titik (`make_data(60, 7)`). Notebook cell 7, pada n = 30: deg 1 = (0,563 / 0,539); deg 3 = (0,967 / 0,941); deg 9 = (0,98 / 0,867).
  - Bila dihitung pada test set Lab 1 yang sama — Var(y_test) = 0,2435 / (1 − 0,539) = 0,5282 — maka R² test derajat 3 seharusnya 1 − 0,0223/0,5282 ≈ **0,9578** (bukan 0,941) dan derajat 9 ≈ **0,8995** (bukan 0,867). Gap R² derajat 9 pada test set Lab 1 ≈ 0,081, bukan 0,113.
  - Tambahan: band "waspada (> 0,10)" di §1 didefinisikan untuk gap **ROC-AUC** (GBM 0,0646), tetapi di §4 diterapkan ke gap **R²** (0,113) tanpa menyatakan transfer metrik itu.
- **Verifikasi:** TERKONFIRMASI, dengan mekanisme yang lebih tepat dari yang ditulis DeepSeek: bukan salah ketik pada salah satu angka — kedua angka benar di eksperimennya masing-masing, tetapi lesson mencampur dua eksperimen tanpa mengatakannya.
- **Perbaikan:** Pilih salah satu: (a) hitung ulang R² pada test set Lab 1 (30 titik) supaya MSE dan R² konsisten, atau (b) nyatakan eksplisit bahwa nilai R² berasal dari eksperimen learning curve (test set 60 titik) dan jangan bandingkan langsung dengan MSE Lab 1. Perbarui gap dan label "waspada" sesuai pilihan itu, dan nyatakan secara eksplisit apakah band gap berlaku untuk ROC-AUC saja atau juga R².

### 4. should-fix — MLF3, §4 "Kalibrasi dan Brier Score"

- **Klaim persis:** "Brier rendah = probabilitas jujur, bisa dipakai untuk expected loss."
- **Yang salah:** Brier score adalah proper scoring rule yang mencampur calibration (reliability) dan resolution/sharpness. Brier rendah TIDAK menjamin probabilitas terkalibrasi — model bisa overconfident di beberapa bin tetapi tetap punya Brier rendah karena resolution tinggi. Untuk expected loss, kalibrasi harus diverifikasi, bukan disimpulkan dari Brier saja. Lesson sendiri menunjukkan ini: bin kalibrasi lab "sedikit overconfident" pada bin tertinggi sementara Brier-nya rendah.
- **Verifikasi:** TERKONFIRMASI (dekomposisi Brier Murphy: reliability − resolution + uncertainty).
- **Perbaikan:** Ganti dengan "Brier rendah mendukung kualitas probabilistik, tetapi kalibrasi harus dicek dengan reliability diagram/ECE; kalibrasi dulu sebelum dipakai untuk expected loss."

### 5. should-fix — MLF1, Lab 1 "1-NN dari Nol" (baseline dicampur dari set berbeda)

- **Klaim persis (.md):** "Prediksi: [0, 1, 0] — P1 lancar, P2 default, P3 lancar. Akurasi test 1,0000; baseline mayoritas 0,5833 (7 dari 12)."
- **Yang salah:** Akurasi dihitung pada 3 pelamar test, tetapi baseline mayoritas dihitung pada 12 baris latih (7/12). Baseline yang sebanding pada test yang sama adalah 2/3 = 0,6667 (2 dari 3 pelamar lancar). Membandingkan akurasi test dengan baseline train adalah perbandingan apel-jeruk. Akurasi 1,0000 pada n = 3 juga bukti yang sangat lemah dan tidak diberi catatan.
- **Verifikasi:** TERKONFIRMASI SEBAGIAN. Kode lab di TS membuktikan pencampuran: `acc` dihitung pada `test` (3 item), `baseline` dihitung pada `train` (12 item, 7/12). Namun kalimat DeepSeek soal leakage ("1-NN yang dievaluasi pada data latih yang sama akan mendapat akurasi 1,0 karena menghafal") TIDAK berlaku di sini: lab memakai test set terpisah (3 pelamar baru), bukan data latih. Tidak ada leakage dalam lab ini.
- **Perbaikan:** Nyatakan skema evaluasi eksplisit (train 12, test 3) dan laporkan baseline pada test yang sama (2/3), atau labeli 0,5833 sebagai "baseline train". Tambahkan catatan bahwa akurasi 1,0 pada n = 3 bukan bukti kuat.

### 6. should-fix — MLF4, §1 "Diagnosis: Gap Train-Test" (band berlubang)

- **Klaim persis:** "Band: < 0,02 sehat; 0,02–0,07 ringan; > 0,10 waspada."
- **Yang salah:** Gap 0,07–0,10 tidak punya kategori; tepat 0,10 juga ambigu. Pemula tidak bisa mengklasifikasikan gap 0,08. Selain itu "test lumayan" (§1: "test 0,7823 tetap lumayan") tidak diberi ambang di MLF4 — band ROC-AUC-nya ada di MLF3 dan tidak dirujuk.
- **Verifikasi:** TERKONFIRMASI (TS `mlf4:48` dan figure `mlf4:77` memuat band yang sama persis).
- **Perbaikan:** Buat band kontinu, mis. < 0,02 sehat; 0,02–0,05 ringan; 0,05–0,10 perlu perhatian; > 0,10 waspada. Definisikan juga ambang "test rendah/lumayan/bagus" di MLF4 atau rujuk eksplisit ke band MLF3.

### 7. should-fix — MLF1, §2 "Unsupervised Learning" (ambang z-score hilang di .md)

- **Klaim persis (.md):** "Dua ter-flag: 5.000 (z = 2,80) dan 4.200 (z = 2,27)."
- **Yang salah:** Ambang flag tidak disebut di `.md`. Karena z = 2,27 ikut ter-flag, ambang harus ≤ 2,27; pembaca tidak bisa mereproduksi "dua ter-flag". Z-score berbasis mean/sd juga rapuh untuk nominal transaksi yang skewed (mean 733,47 vs sd 1523,95 sudah menandakan skew berat); lesson tidak memberi alternatif robust.
- **Verifikasi:** TERKONFIRMASI untuk `.md`, dengan nuansa: ambang ADA di lab TS (`mlf1:417`: "flag bila nilai absolutnya lebih dari 2") dan TS `mlf1:407` sudah mengakui mean ikut tertarik outlier ("z-score adalah penyaring awal, bukan vonis") — tetapi alternatif robust (median/MAD, log-transform) tidak ada di TS maupun `.md`.
- **Perbaikan:** Tulis ambang eksplisit di `.md` (|z| > 2) dan tampilkan z tertinggi berikutnya yang tidak ter-flag. Tambahkan satu kalimat: untuk data skewed, pakai median/MAD atau log-transform; anomali = antrean investigasi, bukan vonis.

### 8. nit — MLF1, §1 "Supervised Learning" (n per bucket ambigu)

- **Klaim persis (.md):** "Bar default rate: 0% untuk keterlambatan 0–1 kali, 100% untuk 2 kali dan 3+ kali (n per bucket hanya 2–4 orang)."
- **Yang salah:** Bucket 0–1 gabungan berisi 7 orang (4 + 3), bukan 2–4. TS `mlf1:290` memberi n eksplisit "4, 3, 2, dan 3" untuk bucket 0, 1, 2, 3+ — tetapi TS `mlf1:49` mengulang "tiap bucket hanya berisi 2 sampai 4 orang", yang bertentangan dengan bucket gabungan 0–1 (7 orang).
- **Verifikasi:** TERKONFIRMASI.
- **Perbaikan:** Tulis n per bucket secara eksplisit: 0 kali: 4 orang; 1 kali: 3; 2 kali: 2; 3+ kali: 3 (gabungan 0–1: 7 orang). Tekankan bucket berisiko sangat kecil.

### 9. nit — MLF2, §1 dan Lab 1 (definisi sd tidak disebut) — KOREKSI ATAS REVIEWER

- **Klaim persis:** "mean 0,0495, median 0,0200, sd 0,1012"
- **Klaim DeepSeek:** dengan satu bulan 35% dan sembilan bulan di [−1%, 4%], sample SD minimum ≈ 0,1056, sehingga 0,1012 tidak konsisten bila lab memakai `pandas.std()` (sample SD).
- **Verifikasi — REVIEWER KELIRU pada kesimpulan inkonsistensi:** data lab di TS (`mlf2:293`): `[0.02, 0.01, 0.03, -0.01, 0.02, 0.015, 0.025, -0.005, 0.04, 0.35]`. Dihitung ulang dari data ini: jumlah = 0,495; mean = 0,0495 ✓; jumlah kuadrat deviasi = 0,1023725; **population sd (dibagi n) = √0,01023725 = 0,1012 ✓**; sample sd (dibagi n−1) = 0,1067. Kode lab TS (`mlf2:325`) memang memakai `/ n` (population sd). Jadi angka 0,1012 BENAR dan konsisten dengan kode lab. Aritmetika DeepSeek soal minimum sample SD (0,1056) benar, tetapi premisnya salah — lab tidak memakai sample SD.
- **Yang tersisa (nit, tetap valid):** lesson tidak pernah menyebut definisi sd yang dipakai (populasi vs sampel). Pembelajar yang memakai `pandas.std()` akan mendapat 0,1067 dan mengira lesson salah.
- **Perbaikan:** Sebutkan definisi di satu kalimat: "simpangan baku di sini adalah population sd (dibagi n, bukan n−1)".

### 10. nit — MLF3, §2 "ROC-AUC" (dua label untuk skor yang sama)

- **Klaim persis:** "GBM 0,7823 = lumayan" dan "0,7823 baik untuk credit scoring fitur standar."
- **Yang salah:** Skor yang sama diberi dua label berbeda tanpa menjelaskan bahwa keduanya memakai kerangka berbeda (band generik vs konteks domain). Pemula bisa bingung apakah 0,7823 layak atau tidak.
- **Verifikasi:** TERKONFIRMASI.
- **Perbaikan:** Pisahkan kerangkanya: "Menurut band generik 0,7–0,8 = lumayan; untuk credit scoring dengan fitur standar, angka ini dapat diterima."

### 11. nit — MLF4, §2 "Underfitting" (n = 30 vs kurva sampai n = 60)

- **Klaim persis:** "R² train 0,563, test 0,539 (n = 30)." dan "Gambar: learning curve derajat 1 — kedua kurva mendatar di 0,5–0,6 saat n 10 → 60."
- **Yang salah/ambigu:** Bila dataset lab hanya 30 titik latih + 30 titik test, learning curve sampai n = 60 tidak mungkin dari dataset yang sama. Lesson tidak menjelaskan bahwa kurva memakai data yang digenerate ulang (`make_data(n, 42)` untuk tiap n, test set `make_data(60, 7)`).
- **Verifikasi:** TERKONFIRMASI. Notebook cell 7 menggenerate ulang data per n; TS `mlf4:94` menyebut "30 titik latih, 30 titik test" tanpa menjelaskan sumber data kurva.
- **Perbaikan:** Tambahkan satu kalimat rekonsiliasi: "Kurva ini menggenerate ulang data sinus untuk tiap ukuran n (bukan memakai ulang 30 titik lab); test set kurva adalah 60 titik terpisah." Atau batasi kurva sampai n = 30.

## Yang diverifikasi benar (tidak menjadi temuan)

Angka kanonis spec §3.3 muncul dengan benar di keempat lesson: LR ROC-AUC 0,7426; GBM 0,7823; PR-AUC 0,5597 vs base rate 0,2212 (rasio 2,53); Brier LR 0,1427 / GBM 0,1342 / GBM terkalibrasi 0,1345; gap train-test GBM 0,0646; threshold 0,10. Dihitung ulang dan cocok: confusion matrix MLF3 (TP 700/FP 400/FN 627/TN 4.273 pada 0,5; TP 1.080/FP 1.420/FN 247/TN 3.253 pada 0,10; precision/recall/F1/akurasinya benar); biaya threshold (NT$30.215.000 vs NT$18.215.000, hemat 39,7%); PPV Bayes MLF2 (0,5000 / 0,9167 / 0,9657); interval Wilson MLF2 ([0,2108, 0,2318] untuk n = 6.000; [0,1500, 0,3107] untuk n = 100; rasio lebar 7,65); z-score MLF1 (z(5.000) = 2,80; z(4.200) = 2,27); EL mini-case MLF1 (Rp2.250.000 vs Rp450.000, margin Rp500.000); rasio MSE MLF4 (test MSE derajat 3 = 10,92× lebih kecil dari derajat 1; CV MSE derajat 9 = 1,4998 ≈ 60× derajat 3; ridge hemat 20,0%). Tidak ada kontradiksi konsep antar-lesson yang ditemukan.

## Verdict

**APPROVE-WITH-FIXES — 3 must-fix** (temuan #1, #2, #3), 4 should-fix (#4–#7), 4 nit (#8–#11).

# MLF-M3.5: Alert Triage Economics — Antrean yang Paling Mahal Didahulukan

## Masalah: 10.000 Alert, 20 Analis, 1 Hari

Senin pagi: sistem fraud menghasilkan 10.000 alert semalam. Tim 20 analis, tiap analis sanggup memeriksa 50 alert sehari dengan teliti [ilustrasi] — kapasitas hari ini 1.000 alert. Sembilan ribu alert tidak tersentuh hari ini, dan sebagian adalah fraud sungguhan. Pertanyaannya bukan «model apa?» melainkan «1.000 yang mana yang diperiksa dulu?»

---

## 1. Alert Queue & Precision@k

Antrean alert = daftar alert diurutkan dari skor tertinggi, dipotong pada k (kapasitas analis). Precision@k = jumlah default di k teratas dibagi k.

**Nilai [notebook]:** GBM M3.5 (HistGradientBoostingClassifier default, train 24.000 / test 6.000, seed 42; ROC-AUC test 0,7807) pada test set 6.000 nasabah (1.327 default, base rate 0,2212). Precision@100 = 0,8600 (86 default). Precision@500 = 0,7260 (363 default). Precision@1000 = 0,6060 (606 default). Makin panjang antrean, makin encer isinya — default yang «mudah» sudah habis di depan.

**Baik/buruk:** bagus bila k sama dengan kapasitas nyata analis. Buruk bila k dipilih karena angkanya bulat: antrean 1.000 dengan kapasitas 500 berarti 500 alert terbawah tidak pernah diperiksa.

**Mitigasi:** tetapkan k dari kapasitas (analis × pemeriksaan per analis), laporkan precision@k bersama base rate-nya (0,2212) sebagai pembanding acak.

**PERINGATAN:** GBM M3.5 [notebook] konfigurasinya BERBEDA dari GBM kanonis M2.3 (ROC-AUC 0,7823) — JANGAN membandingkan TP/FP-nya dengan angka M2.3 seolah satu eksperimen.

$$\text{precision@k} = \frac{\text{jumlah default di } k \text{ alert teratas}}{k}$$

---

## 2. Expected Value: Harga Satu Antrean

EV antrean berukuran k: EV = TP × biaya terlewat − k × biaya review.

**Nilai — biaya [ilustrasi]:** biaya review NT$200 per alert [ilustrasi]; biaya default terlewat = LGD 45% × EAD proxy (mean LIMIT_BAL nasabah default di test = NT$137.579,26 [notebook]) = NT$61.910,67 [ilustrasi] (eksak notebook 61.910,6677). Derivasi memakai C = 61.910,67; hasil EV dibulatkan dari C eksak — selisih NT$1 mungkin muncul, ditandai ≈.

**Nilai — EV GBM M3.5 [notebook]:** top-100: 86 × 61.910,67 − 100 × 200 ≈ NT$5.304.317 (NT$53.043 per alert). Top-500: 363 × 61.910,67 − 500 × 200 ≈ NT$22.373.572 (NT$44.747 per alert). Top-1000: 606 × 61.910,67 − 1.000 × 200 ≈ NT$37.317.865 (NT$37.318 per alert). Total EV naik dengan k, EV per alert turun.

**Baik/buruk:** bagus bila kedua biaya dinyatakan eksplisit dan dilabeli. Buruk bila biaya terlewat ditebak diam-diam atau biaya review diabaikan — antrean «terbesar» selalu menang tanpa menghitung biaya.

**Mitigasi:** tulis kedua biaya di samping setiap angka EV, beri label [ilustrasi] bila asumsi pengajaran, dan laporkan selalu baseline acaknya.

**Pemetaan outcome — «default» bukan «fraud» [ilustrasi]:** confirmed fraud = positif yang sudah dikonfirmasi investigasi; legitimate after review = negatif yang sudah diperiksa dan dinyatakan sah; unresolved = jangan langsung dinilai negatif — ia belum diputuskan; default tanpa bukti fraud = outcome credit risk, BUKAN fraud; chargeback = proxy fraud dengan caveat.

**Contoh dua label, satu antrean [ilustrasi]:** 500 alert. Bila «positif» = default, precision = 300/500 = 0,60 dan EV = 300 × 61.910,67 − 500 × 200 = NT$18.473.201. Bila «positif» = confirmed fraud, precision = 60/500 = 0,12 dan EV = 60 × 150.000 − 500 × 500 = NT$8.750.000 — biaya berbeda (fraud terlewat NT$150.000 [ilustrasi], review fraud NT$500 [ilustrasi]). Selisih NT$9.723.201 — bukan karena antreannya berubah, melainkan karena label dan biayanya berbeda. Angka precision/EV tanpa menyebut labelnya tidak bisa dibandingkan.

$$EV(k) = TP_k \times C_{\text{terlewat}} - k \times C_{\text{review}}$$

*Rumus versi sederhana: tanpa biaya modal dan tanpa biaya waktu tunggu. C_terlewat = NT$61.910,67 [ilustrasi], C_review = NT$200 [ilustrasi].*

---

## 3. Ranking vs Acak: 4,0x terhadap Undian Seed 7 (3,3x terhadap Ekspektasi)

**Nilai [notebook]:** Random-500 (seed 7): 500 alert acak hanya menangkap 91 default — di bawah ekspektasi base rate 0,2212 × 500 = 110,6 (≈ −2,2 sd; undian ini kebetulan apes), jauh di bawah 363 milik ranking. EV-nya: 91 × 61.910,67 − 500 × 200 ≈ NT$5.533.871. Ranking ≈3,3x lebih bernilai dari ekspektasi acak (EV acak analitik 110,6 × 61.910,67 − 500 × 200 ≈ NT$6.747.320) dan 4,0x terhadap undian seed 7: NT$22.373.572 vs NT$5.533.871 (rasio 4,04). Selisih NT$16.839.701 = (363 − 91) × 61.910,67 — nilai tambah pengurutan, tanpa mengubah model, tanpa menambah analis.

**Kenapa:** default tidak tersebar merata — 86 dari 1.327 default duduk di 100 alert teratas. Antrean acak mengikuti base rate 0,2212; antrean ranking mengikuti precision@k.

---

## 4. EV Marginal & Antrean Optimal

**Nilai — EV per blok antrean [notebook]:** 100 alert pertama: NT$5.304.317 (NT$53.043/alert). Alert ke-101–500: +277 default → NT$17.069.255 (NT$42.673/alert). Alert ke-501–1.000: +243 default → NT$14.944.293 (NT$29.889/alert). Urutan: 53.043 → 42.673 → 29.889 — diminishing returns.

**Gambar:** bar EV per alert top-100/500/1000 (53.043 / 44.747 / 37.318) + total EV (NT$5,30 jt / 22,37 jt / 37,32 jt). Batang memendek, total membesar.

**Baik/buruk:** EV marginal bagus bila dihitung per blok. Buruk bila hanya total EV dilaporkan: total yang selalu naik menggoda memperpanjang antrean tanpa batas.

**Mitigasi:** laporkan pasangan total EV DAN EV per alert; tentukan k dari kapasitas atau dari titik EV marginal = biaya marginal, bukan angka bulat.

---

## 5. Fairness Alert

**Nilai — threshold 0,10, GBM M3.5 [notebook]:** TP 1.199, FP 2.963, TN 1.710, FN 128 — 4.162 dari 6.000 nasabah masuk antrean (69,4%), 128 default lolos. Per grup SEX: laki-laki (SEX=1, n=2.402): alert rate 0,7469, FP 1.268, TP 526, FPR 0,6888. Perempuan (SEX=2, n=3.598): alert rate 0,6581, FP 1.695, TP 673, FPR 0,5985.

**Bacaan:** laki-laki lebih sering kena alert (selisih 0,0888) DAN lebih sering false positive (selisih 0,0903). Dari 100 laki-laki yang sebenarnya lancar, hampir 69 salah kena alert; dari 100 perempuan yang lancar, hampir 60.

**Baik/buruk:** alert rate berbeda belum otomatis diskriminasi (default rate laki-laki 0,2336 vs perempuan 0,2129). FPR berbeda lebih tajam: ia mengukur kesalahan, bukan risiko.

**Mitigasi:** audit alert rate dan FPR per grup SEBELUM antrean dipakai; tiap alert membawa 3 reason codes berbahasa awam supaya analis memeriksa dengan konteks, bukan skor buta.

---

## 6. Siskamling sebagai Sistem Triase Nyata

**Nilai (terverifikasi README):** model operasional CHOSEN: Ensemble Top-3 Terkalibrasi (rata-rata probabilitas terkalibrasi tiga anggota: dua pipeline TF-IDF + LR dan DistilBERT); PR-AUC UCI Inggris 0,986 (test 0,986, val 0,982). Dua ambang: t_close = 0,010 / t_esc = 0,135. Prinsip: «mesin mengurutkan, manusia memutuskan».

**Gambar:** diagram dua ambang — skor < 0,010 → TUTUP; 0,010–0,135 → PERIKSA manusia; ≥ 0,135 → ESKALASI. Zona tutup dan periksa sangat sempit: sistem hanya menutup bila model sangat yakin sah.

**Aturan keras (rules.py):** tiga sinyal — S1 tautan, S2 permintaan OTP/PIN/kredensial, S3 ancaman + urgensi. Terpicu hanya bila ≥2 sinyal bersamaan, dan hanya MENAIKKAN band ke ESKALASI; tidak pernah menurunkan, tidak mengubah skor.

**Sinyal penenang:** menurunkan band ESKALASI tepat satu tingkat, tidak pernah AUTO-CLOSE; gugur total bila S2/S3 aktif.

**Kejujuran:** bobot modelnya sendiri «belum siap produksi» (pernyataan README) — PR-AUC 0,986 dan «belum siap produksi» harus berdiri berdampingan.

---

## 7. Capstone Integrasi

Semua sinyal M3 dalam satu eksperimen, satu cutoff, satu split. Data sintetis [ilustrasi] (seed 42): 2.000 akun, 60 hari, cutoff hari ke-30; SEMUA fitur hanya dari hari 1–30; 120.175 transaksi fitur. Fraud tanam: ring 40 akun (5 device) + burst 30 + drift 30 = 100 akun (5,0%). Train 1.500 (75 fraud) / test 500 (25 fraud), stratified seed 42. GBM «23 fitur» di lesson ini adalah fitur kredit kanonis — BUKAN sinyal M3; capstone membangun feature set sendiri dari sinyal M3.

**Cek sinyal [ilustrasi]:** max1h akun burst 4,7 vs normal 2,3; BILL_TREND akun drift 1,38 vs normal 1,04; degree akun ring 24,1 vs normal 12,2.

**Nilai — model bertahap, test 500, P1 (hari 31–45) [ilustrasi]; EV100 pakai C 61.910,67 dan review NT$200 [ilustrasi]:** (1) baseline transaksi: PR-AUC 0,6105, P@100 0,22, R@100 0,8800, EV100 NT$1.342.035, FPR@100 laki 0,2283 / perempuan 0,1237. (2) +behavioral: 0,6199, 0,21, 0,8400, NT$1.280.124, 0,2228/0,1306. (3) +graph: 0,8081, 0,24, 0,9600, NT$1.465.856, 0,2065/0,1306. (4) +velocity: 0,8415, 0,25, 1,0000, NT$1.527.767, 0,1957/0,1340. (5) +anomaly: 0,8577, 0,25, 1,0000, NT$1.527.767, 0,1902/0,1375. (6) full (+profile): 0,8397, 0,25, 1,0000, NT$1.527.767, 0,2011/0,1306.

**Bacaan:** +behavioral nyaris tidak menambah; +graph melompat (+0,19); +velocity menambah lagi; +anomaly sedikit lagi. Full TIDAK menang (0,8397 < 0,8577) — lebih banyak fitur ≠ lebih baik.

**Stabilitas P2 (hari 46–60) [ilustrasi]:** label P2 = 90 fraud (ring 40 + burst 35 + drift 15); 25 berhenti, 15 baru. Model full: PR-AUC 0,4137 (dari 0,8397), P@100 0,20, R@100 0,8000, EV100 NT$1.218.213, FPR@100 laki 0,2077 / perempuan 0,1438. Di P2 pun +anomaly (0,4375) di atas full (0,4137). Penyebab: 15 burst baru yang sinyalnya belum ada sebelum cutoff, 25 akun berhenti, pola drift berubah. Aturan «rata-rata nominal ≥1,5× baseline» menangkap 13/30 drift di P1 dan 14/15 di P2 — tapi 31 akun normal ikut melewati ambang di P2.

**Fairness:** FPR@100 full P1 laki 0,2011 vs perempuan 0,1306; P2 0,2077 vs 0,1438. Model tidak memakai SEX — selisih dicatat dan dicek apakah bertahan di sampel lebih besar, bukan langsung disimpulkan diskriminasi.

**Reason codes (5 alert teratas, model full) [ilustrasi]:** akun 105 (fraud, 1,000; 8 codes): degree 17 (median normal 11), UTIL 0,68, z 4,21, anomali 0,57 (top 5%), community 175, drift +4,7%. Akun 1853 (fraud, 1,000; 6 codes): velocity 1j 6, 24j 11, degree 10, BILL_TREND 1,21, community 59. Akun 335 (fraud, 1,000; 7 codes): degree 25, BILL_TREND 2,04, UTIL 0,87, transaksi terbesar NT$109.305, anomali 0,63, community 52. Akun 1949 (fraud, 1,000; 8 codes): velocity 24j 10, degree 10, BILL_TREND 1,80, z 3,47, anomali 0,57, community 17, drift +2,6%. Akun 1374 (fraud, 0,999; 9 codes): degree 26, UTIL 0,57, PAY_RATIO 0,21, transaksi terbesar NT$155.789, z 3,07, anomali 0,65, community 44, drift +3,3%. Community sampai 175 karena jembatan second-device membentuk giant component — baca bersama internal_density.

---

## 8. Kurva Keputusan

GBM M3.5 yang sama, 6.000 skor diurutkan, k dari 100 sampai 6.000 [notebook]. Tabel 8 titik [notebook, C eksak 61.910,6677]: k=100: TP 86, P 0,8600, R 0,0648, EV 5.304.317, marginal/blok 53.043. k=500: TP 363, P 0,7260, R 0,2735, EV 22.373.572, 42.673. k=1.000: TP 606, P 0,6060, R 0,4567, EV 37.317.865, 29.889. k=2.000: TP 875, P 0,4375, R 0,6594, EV 53.771.834, 16.454. k=3.000: TP 1.055, P 0,3517, R 0,7950, EV 64.715.754, 10.944. k=4.000: TP 1.180, P 0,2950, R 0,8892, EV 72.254.588, 7.539. k=5.000: TP 1.277, P 0,2554, R 0,9623, EV 78.059.923, 5.805. k=6.000: TP 1.327, P 0,2212, R 1,0000, EV 80.955.456, 2.896.

**Bacaan:** EV(k) naik terus sampai 80,96 jt — tapi EV marginal per blok jatuh 53.043 → 2.896. Presisi impas = C_REV/C_MISS [ilustrasi]: NT$200 → 0,00323; NT$1.000 → 0,01615; NT$5.000 → 0,08076. Presisi lokal jatuh di bawah impas pertama kali: review NT$200 → tidak pernah sampai k=6.000 (kapasitas mengikat duluan); NT$1.000 → k=5.725 (EV marginal −387); NT$5.000 → k=2.845 (EV marginal −96). Biaya review naik 25× memotong antrean optimal lebih dari separuh.

**Workload:** @50 alert/analis/hari — k=500 → 10 analis-hari; k=1.000 → 20; k=6.000 → 120.

**Lab kecil di langkah ini:** dari tabel 8 titik, hitung EV(k) dengan C eksak, EV marginal per blok (blok pertama < NT$5.000 adalah 5000→6000, 2.896 per alert), dan kebijakan untuk kapasitas 1.000 alert/hari: k=1.000, recall 0,4567, EV 37.317.865, workload 20 analis-hari.

---

## Lab 1: EV Antrean dari 10 Alert

10 alert ber-skor (5 default, 5 lancar), biaya sama dengan lesson [ilustrasi]. Top-3: TP=3, EV=185.133, EV/alert 61.711,00. Top-6: TP=4, EV=246.444, EV/alert 41.074,00. Top-10: TP=5, EV=307.555, EV/alert 30.755,50 [lab].

## Lab 2: Precision@k vs Baseline Acak

Base rate 0,5000 [lab]. k=3: precision 1,0000, ekspektasi acak 1,50, lift 2,00. k=6: precision 0,6667, ekspektasi acak 3,00, lift 1,33. k=10: precision 0,5000, ekspektasi acak 5,00, lift 1,00 — pada k=10 ranking sama dengan acak karena semua alert masuk antrean.

## Mini-case: 1.000 Alert Hari Ini

Kapasitas 20 analis × 50 = 1.000 pemeriksaan/hari [ilustrasi]. Top-1.000 ranking [notebook]: 606 default, EV NT$37.317.865. Acak 1.000 (ekspektasi): 0,2212 × 1.000 = 221,2 default → EV ≈ NT$13.494.640 [ilustrasi, ekspektasi]. Selisih ≈ NT$23,8 juta dalam satu hari — harga urutan memeriksa. Antrean optimal ditentukan kapasitas dan biaya marginal, bukan angka bulat.

## Guided Task di Colab

Notebook: colab/mlf-m35-guided-task.ipynb — HistGradientBoostingClassifier default, 23 fitur, precision@100/500/1000 + EV + baseline acak seed 7 + fairness per SEX, lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1kSvpmi-hVoKizQPeS-m8NVEh0d0NdbC9

## Rangkuman

- Antrean alert = ranking dipotong di kapasitas; precision@k mengukur isinya (P@100 0,8600; P@500 0,7260; P@1.000 0,6060 [notebook]).
- EV = TP × biaya terlewat − k × biaya review; biaya NT$61.910,67 dan NT$200 [ilustrasi].
- Ranking 4,0x lebih bernilai dari undian acak seed 7 pada top-500: NT$22.373.572 vs NT$5.533.871 [notebook] (3,3x terhadap ekspektasi acak NT$6.747.320).
- Total EV naik dengan k, EV per alert turun (53.043 → 44.747 → 37.318); antrean optimal ditentukan EV marginal.
- Fairness threshold 0,10 [notebook]: laki-laki alert rate 0,7469, FPR 0,6888 vs perempuan 0,6581, 0,5985 — audit per grup wajib; tiap alert membawa reason codes.
- Siskamling: Ensemble Top-3 Terkalibrasi, PR-AUC 0,986; t_close 0,010 / t_esc 0,135; aturan ≥2 sinyal hanya menaikkan ke ESKALASI; penenang turun satu tingkat, tidak pernah AUTO-CLOSE; bobot model «belum siap produksi».
- Lab: EV antrean 10 alert dan lift ranking vs acak (2,00 di k=3; 1,00 di k=10).
- Pemetaan outcome [ilustrasi]: satu antrean 500 alert — precision default 0,60 (EV NT$18.473.201) vs precision confirmed fraud 0,12 (EV NT$8.750.000); selisih NT$9.723.201 karena label dan biayanya berbeda — default bukan fraud.
- Capstone [ilustrasi]: 2.000 akun, cutoff hari ke-30, train 1.500 / test 500 — PR-AUC P1: baseline 0,6105 → +behavioral 0,6199 → +graph 0,8081 → +velocity 0,8415 → +anomaly 0,8577 → full 0,8397 (full tidak menang); P2: full jatuh 0,8397 → 0,4137 (15 burst baru + 25 berhenti).
- Kurva keputusan [notebook]: EV(k) naik 5.304.317 → 80.955.456 (k = 100 → 6.000) tapi EV marginal per blok jatuh 53.043 → 2.896; impas 0,00323 (review 200) / 0,01615 (1.000) / 0,08076 (5.000); biaya review NT$5.000 memotong k optimal ke 2.845; workload k = 1.000 → 20 analis-hari.
- GBM M3.5 [notebook] ROC-AUC test 0,7807 — konfigurasi berbeda dari GBM kanonis M2.3 (0,7823); jangan bandingkan TP/FP-nya seolah satu eksperimen.

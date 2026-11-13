# MLF-M2.3: PD, LGD, EAD & Expected Loss — Harga Sebuah Keputusan

## Masalah: Bank Menyetujui 1.000 Nasabah — Berapa Kerugiannya?

Model berkata rata-rata PD 0,22. Sekitar 220 akan default — tapi «sekitar» bukan angka yang bisa dibukukan. Bank butuh expected loss: 220 nasabah × porsi yang hilang × exposure masing-masing. Tiga pertanyaan, tiga jawaban: PD (klasifikasi), LGD (regresi), EAD (regresi).

---

## 1. PD, LGD, EAD

PD: peluang default dalam horizon yang didefinisikan (1 bulan di notebook — label UCI: default bulan berikutnya). LGD: porsi exposure yang hilang bila default (45% asumsi [ilustrasi] notebook — angka sesungguhnya dari data recovery historis). EAD: besar exposure saat default (di notebook didekati LIMIT_BAL — penyederhanaan yang dinyatakan eksplisit).

**Nilai:** lima pelamar [lab] — A (PD 0,05, EAD Rp100 jt): EL Rp2.250.000. B (PD 0,10, EAD Rp50 jt): EL Rp2.250.000 — sama dengan A meski PD dua kali lipat, karena EAD setengah. C (PD 0,20, EAD Rp200 jt): Rp18.000.000. D (PD 0,35, EAD Rp80 jt): Rp12.600.000. E (PD 0,60, EAD Rp120 jt): Rp32.400.000. Total Rp67.500.000.

**Baik/buruk:** bagus bila ketiga komponen diukur pada definisi dan horizon yang sama. Buruk bila dicampur (PD lifetime × LGD 1 bulan).

**Mitigasi:** laporkan EL beserta komponennya — bila EL naik, pembaca harus bisa melihat penyebabnya PD, LGD, atau EAD.

**LGD dan EAD sebagai regresi [ilustrasi]:** LGD bukan konstanta 45% — ia bervariasi per akun dan harus dilatih dari data recovery historis. Rumus: LGD = 1 − recovery/EAD; CCF = (EAD − saldo)/(limit − saldo). Tabel sintetis 10 akun (limit/saldo/EAD/recovery dalam Rp jt): (1) 10/6,0/8,0/4,4 → LGD 0,45, CCF 0,50; (2) 20/15,0/18,0/9,0 → 0,50/0,60; (3) 5/4,0/5,0/5,0 → 0,00/1,00; (4) 50/10,0/20,0/2,0 → 0,90/0,25; (5) 30/0/5,0/0 → 1,00/0,17; (6) 15/12,0/13,5/13,5 → 0,00/0,50; (7) 8/7,0/8,0/1,6 → 0,80/1,00; (8) 100/40,0/60,0/30,0 → 0,50/0,33; (9) 12/3,0/6,0/6,0 → 0,00/0,33; (10) 25/20,0/25,0/10,0 → 0,60/1,00. LGD portofolio tertimbang EAD 0,5163; total EAD Rp168,5 jt, recovery Rp81,5 jt. Perhatikan distribusinya: LGD menumpuk di 0 (recovery penuh) dan 1 (tidak ada recovery) — zero/one-inflation; dan sebagian recovery masih mengalir saat data dipotong (censoring) — LGD yang dihitung terlalu dini terlalu pesimistis. Evaluasi regresi LGD/EAD memakai MAE/RMSE, bukan ROC-AUC — karena jawabannya angka, bukan ranking. Dan tegaskan: LGD 45% dan LIMIT_BAL sebagai EAD adalah ilustrasi/proxy, bukan estimasi dari data UCI (UCI tidak punya recovery cash flow maupun utilization-at-default).

**Horizon dan survival [ilustrasi]:** PD 1 bulan bukan PD 12 bulan. Kohort sintetis 1.000 akun, default bulanan m1..m12 = [20, 18, 15, 14, 13, 12, 11, 10, 9, 8, 10, 10], jumlah 150. PD 1 bln 0,0200; PD 12 bln 0,1500 — dan 12 × PD 1 bln = 0,2400 adalah SALAH sebagai PD 12 bulan (mengabaikan bahwa yang sudah default tidak bisa default lagi). Lifetime +70 → 0,2200. Survival: S(1) = 0,980, S(3) = 0,947, S(8) = 0,887, S(12) = 0,850. Hazard m1 = 0,0200; hazard m12 = 10/850 = 0,0118 — hazard menurun karena survivor terseleksi (yang tersisa adalah yang lebih kuat).

**Gambar:** alur PD → LGD → EAD → EL dan kurva survival S(t) dari 1,000 ke 0,850.

$$EL = PD \times LGD \times EAD, \quad EL_{portofolio} = \sum_i PD_i \times LGD_i \times EAD_i$$

---

## 2. Kalibrasi

ROC-AUC mengukur urutan; kalibrasi mengukur kejujuran: PD 0,20 harus benar-benar berarti 20 persen. Diukur per desil PD prediksi vs default aktual.

**Nilai:** reliability diagram GBM terkalibrasi, test 6.000 [notebook] — desil 1: 0,0449 vs 0,0417; desil 5: 0,1379 vs 0,1250; desil 10: 0,6967 vs 0,7000. Selisih terbesar 0,0181 (desil 6). Mean PD 0,2217 vs default rate 0,2212.

**Gambar:** reliability diagram 10 desil menempel garis diagonal kalibrasi sempurna.

**Baik/buruk:** bagus bila diukur per desil pada data yang belum dilihat model. Buruk bila diukur pada data latih.

**Mitigasi:** kalibrasi dengan Platt scaling/isotonic pada validasi, verifikasi pada test. Jangan baca kalibrasi dari Brier: Brier mentah 0,1342 vs terkalibrasi 0,1345 [notebook] — nyaris tidak bergerak, sementara selisih desil terbesar terkalibrasi adalah 0,0181. Brier mencampur ranking dan kalibrasi; «skor Brier yang kecil berarti probabilitasnya jujur» adalah miskonsepsi.

---

## 3. Threshold Bisnis

Threshold 0,10 (bukan 0,5) dipilih dari biaya — bukan kebiasaan.

**Nilai:** confusion matrix GBM terkalibrasi @0,10, test 6.000 [notebook] — TP 1.213, FP 3.077, TN 1.596, FN 114. Precision 0,2828, recall 0,9141, F1 0,4319, akurasi 0,4682. Tabel kebijakan: 0,10 → approval 0,285, bad rate 0,0667, EL NT$11.989.453, profit NT$8.214.000. 0,15 → 0,499 / 0,0899 / NT$23.813.003 / NT$5.490.500. 0,20 → 0,651 / 0,1113 / NT$33.683.252 / −NT$216.500.

**Gambar:** profit vs threshold — hijau di 0,10 dan 0,15, merah di 0,20.

**Baik/buruk:** akurasi 0,4682 bukan kegagalan — harga dari biaya asimetris (satu default merugikan sembilan kali satu margin yang hilang). Threshold bagus bila dipilih dari tabel kebijakan dengan biaya eksplisit. Buruk bila disalin dari bank lain tanpa hitung ulang.

**Mitigasi:** hitung ulang tabel kebijakan tiap kali model, populasi, atau biaya berubah; laporkan approval rate dan bad rate di samping profit.

---

## 4. Biaya Kesalahan

FN (default lolos) = EL yang tidak dicegah. FP (lancar ditolak) = margin yang hilang. Threshold optimal: naikkan selama margin nasabah tambahan > EL tambahan mereka.

**Nilai:** stress test [notebook] — baseline EL NT$78.675.378; Adverse (+1 bulan telat) NT$117.257.049 (+49,0%); Severe (+2 bulan) NT$231.440.183 (+194,2%). Threshold yang benar di kondisi normal bisa salah di kondisi buruk.

**Baik/buruk:** bagus bila kedua harga ditulis eksplisit. Buruk bila hanya satu sisi dihitung.

**Mitigasi:** tetapkan biaya FN/FP bersama tim bisnis — tim model mengukur probabilitas, tim bisnis yang tahu harganya.

---

## 5. Policy Matrix & Champion–Challenger

**Policy matrix — graduated treatment (GBM terkalibrasi, test set) [notebook]:** A — PD < 0,05, approve penuh: n = 421, mean PD 0,0415, EL NT$2.497.992, profit NT$4.046.953. B — PD 0,05–0,10, limit 50%: n = 1.289, mean PD 0,0746, EL penuh NT$9.491.461/profit NT$3.840.432; pada limit 50%: EL NT$4.745.730, profit NT$1.920.216. C — PD 0,10–0,20, review: n = 2.198, mean PD 0,1443, EL penuh NT$21.693.799, profit −NT$7.089.721. D — PD > 0,20, reject: n = 2.092, mean PD 0,4300, EL penuh NT$44.992.127, profit −NT$37.825.868. Total policy (A penuh + B 50% + C/D reject): EL NT$7.243.723, profit NT$5.967.169 — vs single threshold 0,10: EL NT$11.989.453, profit NT$7.887.385. Sajikan jujur: matrix menurunkan EL TAPI juga menurunkan profit vs threshold tunggal — nilainya kontrol risiko/graduated treatment, bukan maksimasi profit. Ekstrem C: semua reject → EL 0, profit 0; semua approve penuh → EL NT$21.693.799, profit −NT$7.089.721.

**Champion–challenger (test set) [notebook]:** scorecard ROC-AUC 0,7248 vs LR 0,7426 vs GBM 0,7823; kalibrasi desil terburuk scorecard 0,1406 vs GBM terkalibrasi 0,0181. Scorecard approve ≥ 500: approval 0,7232, bad rate 0,1415, EL NT$46.382.448, profit −NT$9.140.169 (RUGI — jangan klaim ≥ 500 kebijakan bagus). Scorecard ≥ 520: approval 0,1972, bad rate 0,1057, EL NT$16.121.864, profit NT$2.179.202. GBM threshold 0,10: approval 0,2850, bad rate 0,0667, EL NT$11.989.453. Skor test: mean 504,0, min 437, maks 532. Pelajaran: scorecard butuh threshold-nya sendiri, bukan 500; keputusan model = ranking + kalibrasi + reason codes + fairness + biaya.

**Gambar:** tabel policy matrix (A/B/C/D) dan bar ROC-AUC tiga model.

---

## Lab 1: Kalkulator Expected Loss

Lima pelamar, LGD 45%: A Rp2.250.000, B Rp2.250.000, C Rp18.000.000, D Rp12.600.000, E Rp32.400.000; total Rp67.500.000 [lab]. Tugas tambahan: hitung LGD & CCF dari tabel sintetis 10 akun — LGD portofolio tertimbang EAD 0,5163 [lab].

## Lab 2: Sweep Threshold (20 Pelamar Sintetis)

Pool [ilustrasi] seed 7; margin Rp500.000, kerugian Rp4.500.000 per default. 0,10 → approval 0,20, bad rate 0,0000, profit Rp2.000.000. 0,30 → 0,50 / 0,2000 / −Rp5.000.000. 0,50 → 0,65 / 0,3077 / −Rp13.500.000 [lab]. Arahnya yang penting (threshold naik → profit turun), bukan angkanya — n = 20 sangat kecil (bad rate 0,0000 berarti 4 yang disetujui kebetulan semuanya lancar).

## Mini-case: Tiga Pelamar di Bawah Threshold 0,10

PD dari Lab 1 M2.1 [lab]: P1 0,1741, P2 0,9864, P3 0,0000. Di bawah threshold 0,10: P1 ditolak (meski «lancar» pada threshold 0,5) — «lancar» bukan sifat pelamar, melainkan hasil threshold. P2 ditolak, P3 disetujui. Approval 1 dari 3 (0,333), dekat dengan approval notebook 0,285. Threshold adalah pernyataan tentang biaya bank — bukan vonis tentang karakter nasabah.

## Guided Task di Colab

Notebook: colab/mlf-m23-guided-task.ipynb — EL per nasabah, reliability diagram, confusion matrix @0,10, tabel kebijakan tiga threshold di data UCI. Tautan Colab: Buka di Colab: https://colab.research.google.com/drive/1GhqRy3AJl9APW93M0qhh3o1iZMphEXtC. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- EL = PD × LGD × EAD; PD saja tidak menentukan risiko — EAD ikut menentukan (A vs B).
- Kalibrasi dibaca dari reliability diagram (selisih desil terbesar 0,0181); Brier 0,1342 → 0,1345 nyaris tidak bergerak.
- Threshold 0,10: TP 1.213, FP 3.077, TN 1.596, FN 114; recall 0,9141, precision 0,2828, akurasi 0,4682.
- Profit maksimal di threshold 0,10 (NT$8.214.000); di 0,20 negatif (−NT$216.500).
- Stress test: EL +49,0% (Adverse) dan +194,2% (Severe) dari baseline.
- LGD tertimbang EAD 10 akun sintetis: 0,5163; PD 12 bln 0,1500 ≠ 12 × PD 1 bln 0,2400; S(12) = 0,850.
- Policy matrix: EL NT$7.243.723, profit NT$5.967.169 — EL lebih rendah, profit juga lebih rendah dari threshold tunggal.
- Scorecard ROC-AUC 0,7248 vs GBM 0,7823; ≥ 500 rugi NT$9.140.169, ≥ 520 untung NT$2.179.202.

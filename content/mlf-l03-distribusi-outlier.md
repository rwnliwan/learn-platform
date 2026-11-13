# L0.3: Distribusi & Outlier — Membaca Bentuk Data

## Masalah: Mean 3,48, Median 2,70 — Kompas yang Menunjuk ke Bentuk

Di L0.2, daftar B punya mean 3,4833 dan median 2,7000. Selisih 0,7833 itu kompas: mean jauh lebih besar dari median berarti ekornya ke kanan; mean jauh lebih kecil berarti ekornya ke kiri; keduanya hampir sama berarti simetris. Analis yang hanya melihat mean akan menyimpulkan "rata-rata nasabah ber-income 3,48 juta" — padahal 9 dari 12 nasabah berada di bawah angka itu.

---

## 1. Normal

Distribusi normal adalah lonceng yang simetris: mean, median, dan modus berhimpit di tengah. Tiga alat memeriksanya — histogram, QQ plot, skewness/kurtosis — dan ketiganya harus setuju.

**Nilai:** 20 skor (48 sampai 84) [lab] — mean 65,75, median 65,50 (selisih 0,25); skewness 0,068; kurtosis (excess) −0,612 (sedikit lebih datar dari lonceng normal); korelasi QQ 0,9988. Band skewness: nilai absolut di bawah 0,5 hampir simetris; 0,5 sampai 1 miring sedang; di atas 1 miring kuat. Band korelasi QQ: di atas 0,99 menempel garis; 0,95 sampai 0,99 cukup dekat; di bawah 0,95 menyimpang. Band kurtosis (excess): nilai absolut di bawah 1 wajar — −0,612 masuk band wajar.

**Gambar:** histogram berbentuk lonceng (puncak di 60–70) + QQ plot dengan titik-titik menempel garis acuan.

**Baik/buruk:** normal baik untuk mean, sd, dan uji-uji klasik. Normal buruk bila dipaksakan pada data yang miring kuat — p-value-nya tidak bisa dipercaya.

**Mitigasi:** bila tidak normal, cek dulu arah miringnya (langkah 2 dan 3). Shapiro-Wilk p sama dengan 0,03 [ilustrasi] pada n sama dengan 30.000 menolak normal — tapi pada n sebesar itu, penyimpangan kecil pun menghasilkan p kecil. Selalu cek BESAR penyimpangannya (skewness, QQ), bukan hanya p-value-nya.

Prosedur Shapiro-Wilk (input → output → interpretasi): inputnya data terurut dan koefisien bobot a_i yang dihitung dari kuantil normal yang diharapkan — rumusnya memakai norm_ppf yang sama dengan QQ plot di Lab 2, jadi W dan korelasi QQ adalah saudara: keduanya membandingkan data terurut dengan kuantil normal teoritis. Outputnya satu angka W antara 0 dan 1 — makin dekat ke 1, makin normal. Interpretasinya: bandingkan W dengan nilai kritis untuk n dan alpha 0,05 — bila W di bawah kritis, tolak normal. Contoh [lab]: norm20 W 0,998 (n=20, kritis 0,905) — tidak tolak normal; bills W 0,586 (n=14, kritis 0,874) — tolak normal; exams W 0,816 (n=16, kritis 0,887) — tolak normal. Ketiganya setuju dengan QQ dan skewness — dan di situlah gunanya: W adalah konfirmasi, bukan pengganti gambar. Peringatan besar sampel: pada n 30.000, W bisa menolak normal karena penyimpangan yang secara praktis tidak berarti — p-value makin sensitif seiring n membesar, sedangkan besar penyimpangan (skewness, QQ) tidak. Karena itu uji formal tidak pernah menjadi satu-satunya dasar keputusan: gambar dulu, angka menyusul, uji formal terakhir.

$$\text{skewness} = \frac{\frac{1}{n}\sum (x_i - \bar{x})^3}{s^3}$$

s adalah standard deviation populasi (pembagi n), sehingga pembilang dan penyebut konsisten — bila memakai sd sampel (pembagi n−1), hasilnya berbeda.

---

## 2. Right-Skew

Bentuk paling umum di finance: income, tagihan, limit kartu, kerugian — batas bawah nol, ekor kanan panjang.

**Nilai:** 14 tagihan kartu (ribu rupiah) [lab] — mean 589,3, median 290,0 (mean dua kali lipat median); skewness 2,386 (miring kuat); korelasi QQ 0,7692. Setelah log-transform: mean 5,901, median 5,669; skewness 1,068; korelasi QQ 0,9493. Log menarik ekor ke dalam — tapi belum normal (skewness masih di atas 1).

**Gambar:** sebelum log — menumpuk di kiri dengan satu batang jauh di kanan (3.000); sesudah log — menyebar lebih merata.

**Baik/buruk:** right-skew baik untuk median dan metode robust. Buruk untuk mean dan sd — keduanya ditarik ekor. Log-transform baik bila nilai semuanya positif dan ekornya panjang; buruk bila ada nol atau negatif (log nol tidak terdefinisi). BILL_AMT di notebook bisa negatif sampai −165.580 — log langsung tidak terdefinisi di sana.

**Mitigasi:** pertama log (atau akar kuadrat untuk skew sedang); bila masih miring kuat, coba Box-Cox; bila tetap, pakai median, IQR, dan metode robust. Log mengubah interpretasi — koefisien pada data log adalah efek persen, bukan efek rupiah.

Kotak keputusan — kapan TIDAK transformasi: lima pertanyaan sebelum kamu menyentuh transformasi apa pun. (1) Apakah model/metodemu butuh asumsi distribusi? Bila tidak (tree-based, median, IQR) — jangan transformasi, pakai metode robust. (2) Apakah ada nol atau negatif? Bila ya — log langsung tidak terdefinisi: BILL_AMT bisa negatif sampai −165.580 [notebook] karena itu saldo kredit, bukan error — geser dulu (log1p) atau jangan transformasi sama sekali. (3) Apakah interpretasi skala asli penting? Bila ya — efek log adalah efek persen, bukan rupiah; bila stakeholder butuh rupiah, laporkan di skala asli atau transform balik. (4) Apakah metode robust sudah cukup? Bila median dan IQR menjawab pertanyaanmu — cukup, jangan transformasi. (5) Transformasi predictor saja atau target juga? Bila target yang ditransformasi, prediksimu keluar di skala log dan harus ditransform balik — dan intervalnya menjadi asimetris di skala asli. Bila kelima pertanyaan dijawab dan transformasi tetap diperlukan — barulah log, Box-Cox, atau reflect+log.

---

## 3. Left-Skew

Cermin dari right-skew: ekornya ke kiri, mean tertarik ke bawah median. Muncul pada skor yang menumpuk di batas atas.

**Nilai:** 16 skor ujian [55, 70, 78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99] [ilustrasi] — mean 87,69, median 91,50; skewness −1,569; korelasi QQ 0,9047. Fix: reflect (100 dikurangi skor) lalu log — skewness −0,296, korelasi QQ 0,9959. Alternatif yang gagal: mengkuadratkan — skewness hanya turun ke −1,271.

**Gambar:** histogram menumpuk di kanan (90–100 ada 10 dari 16), ekor tipis ke kiri sampai 55; bin 60–70 kosong.

**Baik/buruk:** left-skew baik untuk median. Buruk untuk mean — 87,69 lebih rendah dari 11 dari 16 skor. Reflect + log baik bila batas atasnya jelas (skor maksimal 100); buruk bila batas atasnya tidak jelas.

**Mitigasi:** reflect DULU, log KEMUDIAN; log langsung pada data left-skew justru memperburuk. Bila batas atasnya tidak jelas, pakai median dan metode robust.

---

## 4. Outlier

"Jauh" harus diukur, bukan dirasakan. Dua metode mengukurnya dari arah yang berbeda, dan keduanya harus setuju.

**Nilai:** 15 transaksi (ribu rupiah) [lab] — mean 733,47, sd populasi 1523,95. Metode IQR: Q1 sama dengan 110, median 145, Q3 sama dengan 180 (metode Tukey), IQR 70, pagar bawah 5,0, pagar atas 285,0. Di luar pagar: 5000 dan 4200. Metode z-score: z(5000) sama dengan 2,80, z(4200) sama dengan 2,27 — keduanya di atas 2. Band z-score: nilai absolut di bawah 2 biasa; 2 sampai 3 periksa (3 termasuk); di atas 3 kuat.

**Gambar:** boxplot — kotak Q1–Q3 (110–180) dengan median 145, kumis sampai pagar, dua titik jauh di kanan (skala terputus). Panel bawah gambar yang sama menunjukkan jebakan berikutnya: empat nilai korporat yang tampak sebagai outlier global ternyata bukan outlier apa pun di dalam kelompoknya sendiri.

**Baik/buruk:** outlier baik bila diselidiki — 5.000 dan 4.200 bisa jadi transaksi korporat yang sah, atau kesalahan input satu nol. Outlier buruk bila dihapus otomatis — menghapus 2 dari 15 baris (13 persen) tanpa alasan adalah membuang data.

**Mitigasi:** selidiki dulu. Bila sah tapi mengganggu model: winsorize (cap di pagar atas 285,0) atau pakai model robust. Bila terbukti salah input: perbaiki atau hapus dengan dokumentasi. Bila ragu: laporkan hasil dengan dan tanpa outlier.

Outlier global vs per-kelompok adalah jebakan yang paling mahal di lesson ini. Contoh [ilustrasi]: 16 transaksi reguler [120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 420, 450, 480, 500, 550] dan 4 transaksi korporat [3.200, 4.200, 5.000, 6.200]. Secara global (n=20): Q1 235, median 365, Q3 525, IQR 290, pagar atas 960 — keempat nilai korporat di luar pagar, semuanya "outlier". Per kelompok: reguler Q1 210, median 310, Q3 435, IQR 225, pagar atas 772,5 — tidak ada outlier; korporat Q1 3.700, median 4.600, Q3 5.600, IQR 1.900, pagar atas 8.450 — tidak ada outlier. Keempat nilai itu bukan outlier — mereka kelompok yang berbeda. Workflow-nya: deteksi dulu (IQR + z-score, global), segmentasi (pecah menurut kelompok yang bermakna bisnis — jenis nasabah, kanal, wilayah), validasi bisnis (tanya pemilik data: apakah transaksi korporat memang sebesar itu?), lalu analisis pengaruh (berapa besar kesimpulan berubah bila keempat nilai itu dikeluarkan?). Bila kesimpulannya berubah drastis, laporkan keduanya. Influence diagnostics formal — seberapa besar satu observasi mengubah koefisien model — adalah materi Track A; di sini cukup pahami: outlier yang mengubah kesimpulan adalah outlier yang berpengaruh, dan pengaruh itu harus dilaporkan, bukan disembunyikan.

$$\text{pagar bawah} = Q_1 - 1,5 \times \text{IQR} \qquad \text{pagar atas} = Q_3 + 1,5 \times \text{IQR}$$

---

## Lab

**Lab 1 — Deteksi outlier dengan IQR dan z-score.** Hasil: mean 733,47, sd 1523,95, Q1 110, median 145, Q3 180, IQR 70, pagar bawah 5,0, pagar atas 285,0, outlier [5000, 4200], z 5000 2,80, z 4200 2,27.

**Lab 2 — Log-transform dan korelasi QQ.** Tiga tugas, termasuk menghitung W Shapiro-Wilk untuk norm20, bills, dan exams. Hasil: skew tagihan 2,386, qq-r tagihan 0,7692, skew sesudah log 1,068, qq-r sesudah log 0,9493, W norm20 0,998 (kritis 0,905) — tidak tolak normal, W bills 0,586 (kritis 0,874) — tolak normal, W exams 0,816 (kritis 0,887) — tolak normal.

---

## Peta Keputusan

- Simetris (|skew| di bawah 0,5, QQ r di atas 0,99): pakai mean dan sd; uji klasik sah.
- Right-skew: log-transform; bila masih di atas 1, coba Box-Cox; bila tetap, pakai median dan metode robust.
- Left-skew: reflect lalu log; jangan kuadratkan.
- Outlier (di luar pagar IQR dan |z| di atas 2): selidiki dulu — bila sah, winsorize atau pakai model robust; bila salah input, perbaiki atau hapus dengan dokumentasi; bila ragu, laporkan hasil dengan dan tanpa outlier.

Koneksi ke modul berikutnya: diagnosis distribusi adalah fondasi feature diagnosis — di M1, learning curve dan evaluasi model (MLF4) hanya bisa dibaca bila distribusi fiturnya dipahami; di M2, transformasi dan winsorizing dari lesson ini dipakai saat menyiapkan fitur credit scoring (dan scorecard WoE justru bekerja pada data yang sudah di-binning, bukan pada distribusi mentahnya); di M4, volatilitas dan VaR bergantung pada bentuk distribusi return — return yang fat-tailed membuat VaR normal meremehkan risiko; di M9, simulasi Monte Carlo memilih distribusi yang bentuknya cocok dengan data, bukan yang nyaman. Peta lengkap L0 → M1–M9 ada di L0.5.

---

## Mini-case: Distribusi PAY_0 di Notebook Credit Scoring

Cell 8 notebook: PAY_0 sama dengan 0 (lancar) — default rate 0,128 dengan n 14.737; PAY_0 sama dengan 2 — default rate 0,691 dengan n 2.667. Distribusi PAY_0 menumpuk di −2/−1/0 (23.182 dari 30.000 = 77%) dengan ekor tipis ke kanan sampai 8 — diskrit dan miring, bukan lonceng. PAY_0 tidak boleh diperlakukan sebagai variabel kontinu yang normal; korelasinya dengan target 0,325 (cell 9) dibaca sebagai "keterlambatan yang lebih besar berhubungan dengan default yang lebih tinggi". LIMIT_BAL berkorelasi negatif dengan target (−0,154, cell 9). Notebook membuat agregat yang lebih stabil (cell 13): PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL), PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND.

---

## Guided Task di Colab

Diagnosis pada 60 pengajuan sintetis (seed 42): income (right-skew), skor (left-skew), transaksi (dengan outlier yang disuntikkan). Hitung skewness dan korelasi QQ tiap kolom, pilih transformasi yang benar, deteksi outlier dengan IQR dan z-score.

Buka di Colab: https://colab.research.google.com/drive/1d2_q5eehVGDpuw23LC7QX7SAMTvM9h6U

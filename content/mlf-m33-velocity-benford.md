# MLF-M3.3: Velocity & Benford's Law — Sinyal dari Kecepatan dan Digit

## Masalah: Kartu yang Tiba-tiba Bertransaksi 40x Sehari

Kartu nasabah D selama ini tenang: rata-rata 2 transaksi per hari, tagihan bulanan stabil. Selasa pagi, dalam 24 jam kartu itu dipakai 40 kali — dua puluh kali lipat dari biasanya. Sistem fraud menahan kartu dan menelepon nasabah. Ternyata memang nasabahnya sendiri: belanja perlengkapan acara keluarga besar. Tidak ada fraud sama sekali.

Tiga pertanyaan yang diajukan sistem — dan isi lesson ini: seberapa cepat (velocity), seberapa melonjak (bill jump), seberapa wajar digitnya (Benford's law)? Ketiganya tidak butuh label fraud: sinyal unsupervised yang bekerja di tempat yang belum punya riwayat berlabel.

---

## 1. Velocity: Hitung Kejadian dalam Jendela Waktu

Velocity V = jumlah bulan — dari 6 bulan observasi Apr–Sep 2005 — dengan PAY_AMT > 0. Jendela eksplisit (6 bulan), satuan (satu hitungan per bulan), ambang (> 0). V bilangan bulat 0–6.

**Nilai:** 69,77% nasabah UCI membayar di 5–6 bulan (band [5,7)) — membayar tiap bulan adalah perilaku normal [notebook]. Hanya 4,77% yang hampir tidak pernah membayar (band [0,1)). Velocity di sini mengukur frekuensi MEMBAYAR per bulan — bukan frekuensi TRANSAKSI fraud. UCI tidak punya stempel waktu transaksi, jadi velocity transaksi per jam tidak bisa dihitung dari dataset ini.

**Baik/buruk:** bagus untuk mendeteksi perubahan perilaku mendadak. Buruk bila jendelanya tidak dinyatakan (angka yang tidak bisa dibandingkan) atau bila musim (Harbolnas, Lebaran) tidak dikoreksi.

**Mitigasi:** selalu tulis jendela + ambang bersama angkanya; bandingkan dengan baseline nasabah itu sendiri, bukan hanya dengan populasi.

---

## 2. Velocity Bands: Jarang Bayar Justru Paling Berisiko

Band half-open (ujung kiri termasuk, ujung kanan tidak): [0,1), [1,3), [3,5), [5,7).

**Nilai [notebook]:** [0,1): n = 1.432 (4,77%), default 0,3799. [1,3): n = 2.306 (7,69%), default 0,2628. [3,5): n = 5.331 (17,77%), default 0,3281. [5,7): n = 20.931 (69,77%), default 0,1785. Base rate 0,2212.

**Gambar:** bar default rate per band — [0,1) tertinggi (0,3799), [5,7) terendah (0,1785); polanya tidak monoton ([1,3) 0,2628 di bawah [3,5) 0,3281).

**Baik/buruk:** bagus untuk membaca risiko per kelompok dari data sendiri. Buruk sebagai aturan tolak otomatis: 62% nasabah band [0,1) TIDAK default (1 − 0,3799 = 0,6201).

**Mitigasi:** baca default rate per band dari datamu sendiri — jangan hafal arahnya. Di data ini velocity RENDAH yang berisiko; di data lain bisa sebaliknya, karena velocity mengukur frekuensi bayar, bukan frekuensi transaksi fraud. Baca ulang band-nya tiap periode (drift).

---

## 3. Bill Jump: Tagihan Melonjak vs Rata-rata 5 Bulan

R = BILL_AMT1 / mean(BILL_AMT2..BILL_AMT6). R ≥ 2 berarti tagihan bulan terakhir sedikitnya dua kali rata-rata sebelumnya.

**Nilai [notebook]:** R ≥ 2: n = 4.056, default 0,1593. R < 2: n = 24.432, default 0,2261 — dihitung pada 28.488 nasabah yang baseline-nya positif; 1.512 nasabah dengan rata-rata tagihan 5 bulan ≤ 0 dikeluarkan (rasio terhadap baseline nol/negatif tidak bermakna). Lagi-lagi kontra-intuitif: tagihan melonjak justru default LEBIH RENDAH.

**Kasus batas [notebook]:** 867 nasabah kartu dormant (BILL_AMT1 = 0 dan kelima tagihan sebelumnya 0) — R = 0/0 tak terdefinisi. 390 nasabah punya BILL_AMT1 > 0 sementara mean 5 bulan sebelumnya 0 — R tak hingga. Keduanya punya mean 5 bulan = 0, jadi keduanya termasuk dalam 1.512 nasabah yang dikeluarkan — bukan dimasukkan ke kelompok R mana pun. Hitungan: dormant 1.258 (867 + 390 = 1.257 dijelaskan, 1 sisanya juga dikeluarkan) + bermean negatif 254 = 1.512.

**Baik/buruk:** bagus sebagai pemicu review. Buruk sebagai vonis: 15,93% kelompok melonjak tetap default, dan 22,61% kelompok tidak melonjak juga default — sinyal ini memisahkan 0,1593 dari 0,2261, bukan 0 dari 1.

**Mitigasi:** satu suara dalam paduan suara, bukan solois — gabungkan dengan velocity, riwayat telat (PAY_0), dan verifikasi manusia.

---

## 4. Benford's Law & Uji Chi-Square

P(d) = log10(1 + 1/d). Tabel ekspektasi (4 desimal): digit 1: 0,3010; 2: 0,1761; 3: 0,1249; 4: 0,0969; 5: 0,0792; 6: 0,0669; 7: 0,0580; 8: 0,0512; 9: 0,0458.

Uji chi-square: chi2 = jumlah (O − E)² / E atas 9 digit, E = n × P(d), df = 8, ambang kritis 15,51 pada α = 0,05.

**Nilai [notebook]:** BILL_AMT1 (n = 27.402): chi2 = 92,3, df = 8, p ≈ 1,1e-16 — menyimpang secara statistik, tapi digit 1 observasi 0,3075 vs ekspektasi 0,3010 (selisih hanya 0,0065); selisih digit terbesar 0,0130 (digit 4); MAD 0,0051. PAY_AMT1 (n = 24.751): chi2 = 995,5, df = 8, p ≈ 0 — digit 1 observasi 0,3305 vs ekspektasi 0,3010; digit 9 observasi 0,0226 vs ekspektasi 0,0458 (setengah dari ekspektasi — orang membayar angka bulat); selisih digit terbesar 0,0295; MAD 0,0193.

**Gambar:** bar berkelompok Benford BILL_AMT1 observasi vs ekspektasi per digit 1–9 — batang-batangnya berdekatan meski chi2 = 92,3 dan p ≈ 1,1e-16.

**Baik/buruk:** bagus sebagai screening portofolio tanpa label. Buruk bila dipakai menuduh satu nasabah (uji ini tentang distribusi, bukan individu) atau bila datanya hasil penetapan manusia (harga, limit, angka bulat).

**Mitigasi:** laporkan p-value + effect size berdampingan — dengan n = 27.402, chi-square hampir selalu "signifikan"; p-value kecil bukan vonis. Tindak lanjut = antrean audit, bukan blokir.

**Kelayakan Benford — checklist sebelum menguji:** (1) rentang log10 — angka harus menjangkau beberapa orde besaran (tagihan NT$100–100.000 menjangkau tiga orde; harga yang dipatok 10.000–12.000 tidak); (2) proporsi angka bulat — bila sebagian besar angka berakhiran 000, digit pertamanya ditentukan manusia; (3) pisahkan angka yang dibatasi aturan — limit, harga minimum, biaya tetap; (4) minimum n — dengan n = 20, selisih digit 1 sebesar 0,15 pun tidak signifikan; (5) koreksi multiple testing bila menguji banyak segmen; (6) laporkan effect size + CI + jumlah segmen berdampingan dengan p-value.

**Contoh multiple testing [ilustrasi]:** 100 merchant diuji satu per satu pada α = 0,05 — 12 merchant punya p < 0,05. Dengan Benjamini–Hochberg (q = 0,05): rank 1: p = 0,0003 ≤ 1/100 × 0,05 = 0,0005 lolos; rank 2: p = 0,0009 ≤ 2/100 × 0,05 = 0,0010 lolos; rank 3: p = 0,004 > 3/100 × 0,05 = 0,0015 gugur — dan semua rank sesudahnya ikut gugur. Hasil: 2 dari 12 merchant tetap signifikan. Dari 2 yang lolos, hanya 1 yang effect size-nya besar untuk diaudit [ilustrasi].

$$P(d) = \log_{10}\left(1 + \frac{1}{d}\right), \quad d = 1, \dots, 9$$

---

## 5. Rolling Velocity

UCI tidak punya stempel waktu transaksi — velocity transaksi per jam tidak bisa dihitung dari dataset ini. Langkah ini memakai data sintetis [ilustrasi] (seed 42) dengan stempel waktu: tiga akun selama 7 hari. N normal: 14 transaksi (2/hari, 09:00 + 19:00, merchant M1, NT$1.000–5.000). F burst fraud: 24 transaksi (6 hari normal + hari ke-7 burst 12 transaksi 10:01–10:45, 6 merchant M1–M6, NT$8.446–14.216, device D-F0/1/2). S acara keluarga: 22 transaksi (6 hari normal + hari ke-7 10 transaksi 09:05–20:00, 3 merchant, NT$2.000–6.000).

**Nilai [ilustrasi] — hari ke-7:** N: n = 2, max1h = 1, total 24 jam NT$7.988, baseline 2,0, rasio 1,0, device 1, merchant 1 → tidak ada ambang terlampaui. F: n = 12, max1h = 12 (10:45, 6 merchant), total 24 jam NT$139.233, rasio 6,0, device 4, merchant 6 → melampaui KETIGA ambang [ilustrasi] (≥10 transaksi/1 jam; ≥5 merchant unik/1 jam; total 24 jam > NT$100.000). S: n = 10, max1h = 2, total 24 jam NT$37.815, rasio 5,0, device 1, merchant 3 → tidak ada ambang terlampaui — rasio 5,0 saja bukan aturan alert.

**Gambar:** bar max1h hari ke-7 — N 1, F 12, S 2; garis ambang 10. Hanya F yang melewati ambang; S rasionya 5,0 tapi max1h hanya 2.

**Baik/buruk:** ambang contoh bagus sebagai ilustrasi — tiga ambang bersama menangkap F dan meloloskan N dan S. Buruk bila disalin mentah ke produksi: ambang ≥10 transaksi/1 jam di bank besar bisa menghasilkan ribuan alert per hari — tim tidak sanggup, dan alert yang tidak diperiksa sama dengan tidak ada alert.

**Mitigasi:** tulis jendela + ambang + baseline bersama angkanya; laporkan paket metrik (count, merchant unik, total, device), bukan satu angka. Bila satu metrik berteriak tapi yang lain tenang (S: rasio 5,0 tapi max1h 2), itu pertanyaan untuk manusia, bukan vonis.

---

## Lab 1: Velocity dari 6 Bulan Pembayaran + Rolling 1 Jam

Tiga nasabah, pembayaran 6 bulan (NT$). V = [1, 3, 6] → band [[1,3), [3,5), [5,7)] — default rate band 0,2628 / 0,3281 / 0,1785 [lab]. Nasabah B (V = 3) di band [3,5); nasabah C (V = 6) di band [5,7).

Bagian 2 — rolling velocity akun F [ilustrasi]: max1h 12 transaksi (jendela 10:01–10:45), merchant unik 6, total 24 jam NT$139.233, device unik 3 — ambang terlampaui: 3 dari 3.

## Lab 2: Uji Benford pada 20 Angka

Digit pertama 20 angka tagihan: chi2 = 4,9577, df = 8 [lab] — jauh di bawah ambang kritis 15,51, jadi 20 angka ini TIDAK menyimpang dari Benford. Digit 1 observasi 0,1500 vs ekspektasi 0,3010 — separuh dari yang diharapkan — tapi dengan n = 20 selisih itu belum cukup untuk signifikan. n kecil membuat selisih besar tampak tidak signifikan; n besar membuat selisih kecil tampak signifikan.

## Mini-case: 40x Transaksi, Tiga Sinyal Tenang

Nasabah D [ilustrasi]: baseline 2 transaksi/hari → 40 transaksi dalam 24 jam, velocity 20x baseline. Tapi tiga sinyal bulanan tenang: V = 6, band [5,7), default 0,1785; R = 0,8 (R < 2), default 0,2261; digit pertama tagihan terakhir 1 (paling umum). Keputusan: eskalasi ke verifikasi manusia (telepon nasabah) — BUKAN blokir otomatis, BUKAN vonis fraud. Sinyal yang tenang tidak membatalkan sinyal yang berteriak bila jendelanya berbeda (24 jam vs 6 bulan) — dan sinyal yang berteriak tidak membuktikan fraud bila yang ditanya adalah niat, bukan frekuensi.

## Guided Task di Colab

Notebook: colab/mlf-m33-guided-task.ipynb — velocity bands + bill jump + Benford BILL_AMT1 & PAY_AMT1 di data UCI 30.000 nasabah, lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1pvLHDgrrIk_8L28fHhHGzYbbyLhADqr-.

## Rangkuman

- Velocity = hitungan kejadian dalam jendela eksplisit — V di UCI adalah bulan dengan PAY_AMT > 0 dalam 6 bulan Apr–Sep 2005.
- Band half-open [0,1) 0,3799; [1,3) 0,2628; [3,5) 0,3281; [5,7) 0,1785 — jarang membayar justru paling berisiko; arah sinyal dibaca dari data, bukan dihafal.
- Bill jump R = BILL_AMT1 / mean(BILL_AMT2..BILL_AMT6): R ≥ 2 default 0,1593 vs R < 2 default 0,2261 — tagihan melonjak justru lebih aman; sinyal mentah tanpa mekanisme hanya korelasi.
- Benford P(d) = log10(1 + 1/d): digit 1 ekspektasi 0,3010, digit 9 ekspektasi 0,0458.
- BILL_AMT1 chi2 = 92,3 (p ≈ 1,1e-16) tapi selisih digit 1 hanya 0,0065; PAY_AMT1 chi2 = 995,5, digit 9 hanya 0,0226 — manusia membayar angka bulat.
- p-value kecil bukan vonis: baca effect size berdampingan — selisih digit terbesar BILL 0,0130 vs PAY 0,0295; MAD 0,0051 vs 0,0193.
- Lab: velocity 3 nasabah [1, 3, 6] → band [[1,3), [3,5), [5,7)]; Benford 20 angka chi2 = 4,9577 — di bawah ambang kritis 15,51, tidak menyimpang; rolling: akun F max1h 12, merchant unik 6, total NT$139.233 — 3 dari 3 ambang terlampaui.
- Rolling velocity [ilustrasi]: hari ke-7 — N max1h 1, total NT$7.988, rasio 1,0 (tidak ada ambang); F max1h 12, total NT$139.233, rasio 6,0 (ketiga ambang terlampaui); S max1h 2, total NT$37.815, rasio 5,0 (tidak ada ambang — rasio saja bukan aturan alert).
- Kelayakan Benford [ilustrasi]: checklist rentang log10, angka bulat, angka dibatasi aturan, minimum n, koreksi multiple testing, effect size + CI + jumlah segmen — 100 merchant, 12 p < 0,05 → setelah Benjamini–Hochberg (q = 0,05) hanya 2 yang signifikan.

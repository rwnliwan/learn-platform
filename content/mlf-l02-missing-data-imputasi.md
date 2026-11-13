# L0.2: Missing Data & Imputasi — Mengisi yang Kosong

## Masalah: Rata-rata yang Membuat Model Terlalu Percaya Diri

Analis mengisi 3 income kosong dengan rata-rata 3,48 juta. File jadi lengkap, model jalan, akurasi naik sedikit. Lalu ia memeriksa varians income-nya: menyusut 20,0 persen (3 dari 15 = 20 persen). Modelnya kini "yakin" bahwa income nasabah jauh lebih seragam dari kenyataannya, karena 3 dari 15 nilai adalah salinan rata-rata yang sama.

---

## 1. Mean vs Median

Mean adalah rata-rata aritmetik — semua nilai ikut, termasuk outlier. Median adalah nilai tengah setelah diurutkan — outlier tidak bisa menariknya.

**Nilai:** Daftar A simetris, 8 nilai [2,0, 2,2, 2,4, 2,6, 2,8, 3,0, 3,2, 3,4]: mean sama dengan median sama dengan 2,7000 [lab]. Daftar B miring dengan outlier 12,0, 12 nilai [1,7, 1,9, 2,0, 2,2, 2,4, 2,6, 2,8, 3,1, 3,3, 3,6, 4,2, 12,0]: mean 3,4833, median 2,7000 [lab]. Tanpa outlier 12,0, mean daftar B menjadi 2,7091 — selisih 0,7742. Median bergerak sedikit: dari 2,7000 menjadi 2,6000 (selisih 0,1000) — n menjadi ganjil (11), jadi median = nilai ke-6 = 2,6. Robust bukan berarti diam sama sekali: median bergerak 0,1, mean bergerak 0,7742.

**Gambar:** histogram daftar B sebelum dan sesudah imputasi mean — bin 3 sampai 4 melonjak dari 3 menjadi 6 (puncak palsu di satu nilai).

**Baik/buruk:** mean baik bila distribusi simetris. Mean buruk bila ada outlier — 3,4833 lebih besar dari 9 dari 12 nilai yang ada. Median baik bila distribusi miring. Median buruk bila distribusinya bimodal atau diskrit kasar.

**Mitigasi:** hitung keduanya dan bandingkan. Bila selisihnya kecil, pilih mean. Bila besar, pilih median — atau transformasi dulu (log) baru isi dengan mean dari data yang sudah ditransformasi. Laporkan selalu nilai pengisinya.

$$\text{median} = \begin{cases} x_{\left(\frac{n+1}{2}\right)} & n \text{ ganjil} \\ \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2} & n \text{ genap} \end{cases}$$

---

## 2. Teknik Imputasi

**Nilai:** mode EDUCATION pada 10 pelamar [2, 2, 3, 2, 1, 2, 4, 2, 3, 2] adalah 2 (university), muncul 6 dari 10 kali [ilustrasi]. Forward-fill pada riwayat keterlambatan [0, 0, 1, kosong, 2, 2, kosong] menjadi [0, 0, 1, 1, 2, 2, 2] [ilustrasi]. Imputasi berbasis model: prediksi income dari limit kartu dan riwayat bayar — teknik penuhnya di M2 dan M6.

**Gambar:** tiga kolom — mode untuk kategori, forward-fill untuk deret waktu yang bertahan, model untuk yang prediktornya kuat.

**Baik/buruk:** mode baik bila satu kategori jelas dominan; buruk bila kategorinya seimbang. Forward-fill baik untuk status yang bertahan; buruk untuk nilai yang berubah cepat. Imputasi model baik bila prediktornya kuat; buruk bila modelnya lemah.

**Mitigasi:** untuk kategori, laporkan porsi modenya. Untuk forward-fill, batasi jaraknya. Untuk imputasi model, validasi model pengisinya seperti model apa pun.

Dan satu aturan yang mengikat semua teknik di atas: fit pada train, apply ke test. Urutannya — raw data → split train/validation/test → fit cleaning, imputasi, dan transformasi hanya pada train → terapkan hasilnya ke validation dan test. Median income yang dihitung dari seluruh data adalah leakage: ia memakai informasi test (termasuk outlier 12,0) untuk menentukan pengisi train. Contoh [lab]: daftar B dibagi train 8 angka pertama [1,7, 1,9, 2,0, 2,2, 2,4, 2,6, 2,8, 3,1] dan test 4 angka terakhir [3,3, 3,6, 4,2, 12,0] — median train 2,3000, median seluruh data 2,7000; selisih 0,4000 adalah bocoran outlier test ke dalam pengisi. Di M1 (MLF3), aturan yang sama berlaku untuk scaling dan encoding: fit pada train, apply ke test — bila tidak, evaluasi modelmu mengukur kebocoran, bukan kemampuan.

Satu jebakan transformasi: bila kolomnya di-log-transform dulu (L0.3 — bills skew 2,386), imputasi mean di skala log lalu dipakai langsung sebagai rupiah adalah salah — mean di skala log adalah log dari geometric mean, dan memakainya langsung meremehkan nilai aslinya. Aturannya: imputasi di skala transformasi wajib ditransform balik (exponentiate) sebelum dipakai sebagai nilai asli; atau isi dengan median di skala asli yang tidak butuh transformasi.

---

## 3. MCAR / MAR / MNAR

Mekanisme missing menentukan apakah pengisianmu sah. MCAR: peluang kosong sama untuk semua baris. MAR: peluang kosong bergantung pada kolom lain yang teramati. MNAR: peluang kosong bergantung pada nilai yang hilang itu sendiri.

**Nilai:** demonstrasi MAR [ilustrasi] pada 20 pelamar — income kosong 6 dari 20 (30 persen). Pelamar late 2 atau lebih (8 orang): income kosong 5 dari 8, yaitu 62,5 persen. Pelamar late di bawah 2 (12 orang): income kosong 1 dari 12, yaitu 8,3 persen. Missing-nya bergantung pada keterlambatan — datanya konsisten dengan MAR, bukan MCAR — perbedaan antar kelompok yang teramati adalah bukti pendukung, bukan bukti pasti.

**Gambar:** dua batang — 62,5 persen vs 8,3 persen. Bila keduanya sama-sama 30 persen, datanya konsisten dengan MCAR.

**Baik/buruk:** MCAR — menghapus baris tidak bias untuk mean; namun imputasi satu nilai tetap menyusutkan varians (§4). Yang hilang tanpa bias hanyalah estimasi mean marginal. MAR buruk bila diisi rata-rata global — pengisiannya harus bersyarat pada keterlambatan. MNAR buruk dan tidak bisa dideteksi dari data yang teramati.

**Mitigasi:** pecah missing rate menurut kolom lain yang teramati. Bila ada kolom yang membedakan missing rate secara tajam, datanya konsisten dengan MAR — dan pengisianmu harus memakai kolom itu.

Perbedaan missing rate antar kelompok adalah bukti pendukung MAR, bukan bukti pasti — dan tidak ada tes dari data teramati yang bisa menyingkirkan MNAR. MAR berkata missing bergantung pada kolom yang teramati (keterlambatan) — itu bisa dicek. MNAR berkata missing bergantung pada nilai yang hilang itu sendiri (income rendah yang tidak dilaporkan) — nilai itu tidak ada di data, jadi tidak ada uji yang bisa membuktikannya atau menyingkirkannya. Yang memutuskan adalah domain knowledge, proses bisnis, dan sensitivity analysis (M6). Karena itu kesimpulan Lab 2 ditulis "konsisten dengan MAR", bukan "MAR": datanya mendukung MAR, tapi tidak membuktikannya.

$$\text{MCAR: } P(\text{kosong}) = \text{tetap} \qquad \text{MAR: } P(\text{kosong} \mid X_{\text{teramati}}) \qquad \text{MNAR: } P(\text{kosong} \mid X_{\text{hilang}})$$

---

## 4. Kapan Imputasi Berbohong

Imputasi dengan satu nilai selalu menyusutkan varians — itu aritmetik, bukan kecelakaan.

**Nilai:** daftar B [lab] — varians populasi sebelum imputasi 7,0997 (sd 2,6645). Isi 3 nilai kosong dengan mean 3,4833: varians menjadi 5,6798 — menyusut 1,4199, yaitu 20,0 persen. Isi dengan median 2,7000: varians 5,7780 — menyusut juga, sedikit lebih kecil.

**Gambar:** tiga batang varians — sebelum 7,10, isi mean 5,68, isi median 5,78. Keduanya lebih pendek. Panel bawah gambar yang sama menunjukkan kenapa: satu nilai yang diulang tidak punya sebaran, sedangkan beberapa dataset mencerminkan ketidakpastian pengisian.

**Baik/buruk:** penyusutan varians punya tiga band — di bawah 5 persen abaikan; 5 sampai 10 persen laporkan; di atas 10 persen laporkan dan pertimbangkan indikator missing atau multiple imputation. Penyusutan 20 persen buruk bila tidak dilaporkan — interval kepercayaan tampak lebih sempit dari yang seharusnya.

**Mitigasi:** tambah indikator missing; uji sensitivitas (mean vs median vs tanpa imputasi); multiple imputation bila porsinya besar (teknik penuh di M6).

Satu gambar yang menjelaskan kenapa single imputation menipiskan varians dan kenapa multiple imputation adalah jawabannya: panel bawah gambar di atas memakai delapan nilai pertama daftar B sebagai nilai teramati [lab] — mean 2,3375, varians populasi 0,1998. Single imputation mengisi 4 nilai kosong dengan satu nilai tetap (mean 2,3375) — varians menyusut menjadi 0,1332, yaitu 33,3 persen, karena nilai isi tidak punya sebaran. Multiple imputation mengisi dengan nilai yang berbeda di tiap dataset — varians antar-dataset mencerminkan ketidakpastian pengisian itu sendiri. Single imputation memperlakukan nilai isi seolah pasti — standard error dan interval kepercayaan menjadi terlalu sempit. Multiple imputation tidak memberi satu jawaban, melainkan sebaran jawaban — dan sebaran itulah yang benar. Algoritme lengkapnya bukan materi lesson ini: kapan MI diperlukan dan bagaimana hasilnya digabung dibahas di M6; di sini cukup pahami intuisinya: satu titik = kepastian palsu; beberapa dataset = ketidakpastian yang jujur.

Band 5 persen dan 10 persen di atas juga heuristik, bukan hukum — sama seperti band missing di L0.1. Penyusutan varians 4,9 persen vs 5,2 persen [ilustrasi] pada file yang sama tidak boleh menghasilkan keputusan berbeda (abaikan vs laporkan) — keduanya dekat batas, keduanya didokumentasikan. Yang menentukan adalah dampaknya: penyusutan 9 persen pada kolom yang dipakai sebagai fitur utama model lebih berbahaya daripada penyusutan 11 persen pada kolom yang hanya dipakai sebagai kontrol deskriptif. Persentase menentukan band; dampak menentukan keputusan.

$$\text{penyusutan varians} = \frac{\text{var sebelum} - \text{var sesudah}}{\text{var sebelum}}$$

---

## Lab

**Lab 1 — Mean vs median dan varians yang menyusut.** Empat tugas, termasuk menghitung median hanya dari train (8 angka pertama daftar B) dan membandingkannya dengan median seluruh data. Hasil: mean A 2,7000, median A 2,7000, mean B 3,4833, median B 2,7000, mean B tanpa outlier 2,7091, var sebelum 7,0997, var sesudah isi mean 5,6798, var menyusut 20,0 persen, median train 2,3000, median seluruh data 2,7000.

**Lab 2 — Deteksi MAR dari dua kelompok.** Hasil: missing keseluruhan 6 (30 persen), missing late 2 atau lebih 5 dari 8 (62,5 persen), missing late di bawah 2 sebanyak 1 dari 12 (8,3 persen), kesimpulan konsisten dengan MAR.

---

## Peta Keputusan

- Seberapa banyak: di bawah 5 persen — pengisi sederhana cukup. 5–30 persen — pilih dengan benar + uji sensitivitas. Di atas 30 persen — model-based atau buang kolomnya.
- Mekanisme: MCAR — rata-rata global sah. MAR — pengisian bersyarat. MNAR — uji sensitivitas wajib.
- Jenis kolom: angka simetris — mean. Angka miring — median. Kategori — mode. Urutan waktu yang bertahan — forward-fill. Prediktor kuat — model-based.
- Setelah mengisi, ukur penyusutan variansnya — di bawah 5 persen abaikan; 5 sampai 10 persen laporkan; di atas 10 persen laporkan dan pertimbangkan indikator missing atau multiple imputation.

Koneksi ke modul berikutnya: imputasi adalah fondasi preprocessing — di M1, imputasi yang fit pada train dan diterapkan ke test adalah syarat agar evaluasi model (MLF3) tidak bocor; di M2, scorecard credit scoring dibangun di atas data yang sudah diimputasi, dan pilihan imputasi (mean vs median vs model-based) diuji sensitivity-nya di M6; di M7, indikator missing itu sendiri bisa menjadi fitur yang adil atau tidak adil — kolom dengan missing tinggi pada kelompok tertentu menuntut audit fairness. Peta lengkap L0 → M1–M9 ada di L0.5.

---

## Mini-case: Bila Income Notebook Kosong 15 Persen

Notebook credit scoring punya 0 nilai kosong — mini-case ini adalah skenario "bagaimana bila": LIMIT_BAL (sebagai proksi income) kosong 15 persen dan missing-nya terkonsentrasi pada PAY_0 sama dengan 2. Uji mekanismenya seperti Lab 2: bila datanya konsisten dengan MAR, pengisian harus bersyarat pada PAY_0 (median per kelompok), bukan rata-rata global. LIMIT_BAL miring ke kanan, jadi median per kelompok lebih jujur dari mean global. Tambahkan indikator missing supaya model GBM bisa belajar bahwa baris itu berbeda. EDUCATION 0/5/6 yang tak dikenal BUKAN missing — obatnya berbeda (L0.1).

---

## Guided Task di Colab

Imputasi pada 60 pengajuan sintetis (seed 42): missing MCAR dan MAR, forward-fill riwayat 6 bulan, mode pada kolom kategori.

Buka di Colab: https://colab.research.google.com/drive/1qIAmBF8RDAXtYIQiy9ohVcqhU-R9H8s9

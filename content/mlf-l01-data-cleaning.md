# L0.1: Data Cleaning — Hapus, Perbaiki, atau Biarkan?

## Masalah: File 20 Pengajuan yang Tidak Bisa Langsung Dipakai

Seorang analis kredit menerima file 20 pengajuan (nama, income, keterlambatan, pendidikan, kota). Sepintas rapi — tapi tiga income kosong, dua baris kembar persis, income tertulis "1.700.000", kota tertulis "jakarta", "JAKARTA ", dan "Jkt" untuk kota yang sama. Godaan pertama: langsung hapus semua yang bermasalah. Godaan kedua: langsung isi yang kosong dengan rata-rata. Keduanya salah bila dilakukan sebelum menghitung.

---

## 1. Nilai Kosong

Hitung dulu, putuskan belakangan. Dua angka yang menentukan: jumlah kosong dan persentasenya terhadap total baris.

**Nilai:** file 20 pengajuan — income kosong 3 baris, yaitu 3 dibagi 20 sama dengan 15 persen [lab]. Band keputusannya kontinu: di bawah 5 persen dan polanya acak (MCAR) — hapus barisnya masih aman; 5 sampai 30 persen — imputasi dengan metode yang didokumentasikan (L0.2); di atas 30 persen atau polanya tidak acak (MNAR) — selidiki dulu, jangan pakai kolom itu mentah-mentah.

**Gambar:** audit lima batang — missing 3, duplikat 2, tipe salah 3, kota 6, kode 2. Batang tertinggi bukan missing, melainkan kota yang tidak konsisten (6 baris). Audit dihitung pada 20 baris mentah, sebelum dedup — setelah dedup, kota non-kanonik menjadi 5.

**Baik/buruk:** missing di bawah 5 persen dan acak baik untuk dihapus. Missing 15 persen buruk bila dihapus diam-diam — seperenam data hilang dan yang hilang mungkin bukan acak. Missing buruk bila diisi rata-rata tanpa memeriksa skew.

**Mitigasi:** laporkan selalu jumlah dan persen, lalu periksa pola kosongnya: apakah baris yang kosong punya ciri yang sama? Prosedur lengkapnya di L0.2.

Missing punya tiga level hitungan — dan ketiganya bisa bercerita berbeda. Per kolom: income kosong 3 dari 20, yaitu 15 persen [lab]; nama, keterlambatan, pendidikan, dan kota masing-masing 0 dari 20, yaitu 0 persen [lab]. Per baris: 3 baris punya minimal satu sel kosong (Dewi, Hana, Niko) — 3 dari 20 sama dengan 15 persen [lab]. Per sel: 3 sel kosong dari 100 sel (20 baris × 5 kolom) — 3 dari 100 sama dengan 3 persen [lab]. Contoh [ilustrasi] 10 baris dengan income kosong di baris 1, 2, 3 dan kota kosong di baris 3, 4 memberi per-kolom income 30 persen dan kota 20 persen, per-baris 40 persen, dan per-sel 10 persen — satu angka global 10 persen menyembunyikan bahwa 40 persen baris terdampak dan income 30 persen kosong. Selalu laporkan ketiganya, dan dokumentasikan keputusan di level kolom dan baris.

Band keputusan di lesson ini adalah heuristik — titik awal, bukan hukum: persentase (missing income 15 persen — band tengah 5–30 persen); jumlah absolut (3 baris dari 20); mekanisme (belum diketahui — pola kosongnya harus dicek dulu, L0.2); dampak bisnis/model (hapus diam-diam berarti membuang 15 persen data; isi buta berarti menciptakan data); keputusan akhir + alasan (selidiki pola dulu, jangan hapus, jangan isi sembarangan). Dan batas band bukan tebing: missing 4,9 persen vs 5,2 persen [ilustrasi] pada file 1.000 baris (49 vs 52 baris) — beda 3 baris — tidak boleh menghasilkan keputusan yang berlawanan; keduanya dekat batas, keduanya dicek polanya dan didokumentasikan.

$$\text{missing rate (per baris)} = \frac{\text{jumlah baris dengan } \geq 1 \text{ sel kosong}}{\text{total baris}}$$

Definisi inilah yang dipakai band keputusan (di bawah 5 persen, 5–30 persen, di atas 30 persen).

---

## 2. Duplikat

Duplikat persis (semua kolom sama) adalah pencatatan ganda — hapus satu salinannya. Duplikat dekat (hampir sama tapi ada yang beda) mungkin dua kejadian yang sah.

**Nilai:** file 20 pengajuan — 2 baris duplikat persis [lab]: "Andi, 2,4, 1, 2, Jakarta" dan "Budi, 1,7, 2, 3, jakarta" masing-masing muncul dua kali. Setelah dihapus satu salinan tiap pasang, tersisa 18 baris unik.

**Gambar:** dua pasang baris yang identik — satu salinan tiap pasang dihapus.

**Baik/buruk:** duplikat persis buruk bila dibiarkan — satu nasabah dihitung dua kali. Duplikat dekat buruk bila dihapus tanpa memeriksa — dua pengajuan dari nasabah yang sama di bulan berbeda adalah dua observasi yang sah.

**Mitigasi:** dedup setelah standardisasi — seandainya salah satu baris tertulis "Jakarta" dan yang lain "jakarta", keduanya baru ketahuan kembar setelah kota distandardisasi; di file ini kedua duplikat sudah identik byte-per-byte. Notebook credit scoring: 0 baris duplikat dari 30.000 [notebook].

Duplikat dekat butuh aturan kerja, bukan firasat — namanya entity resolution. Tiga pasangan yang sering muncul [ilustrasi]: (a) nama sama, tanggal pengajuan berbeda — dua pengajuan yang sah bila KTP-nya sama dan tanggalnya memang berbeda; (b) nama beda ejaan ("Budi" vs "Budhi") tapi ID nasabah sama — satu orang, ejaannya yang salah; (c) ID sama muncul dua kali pada periode berbeda — bisa dua pengajuan sah, bisa pencatatan ganda, tergantung apakah periodenya memang berbeda. Aturannya: tentukan candidate key dulu (kombinasi kolom yang seharusnya unik, misal KTP + tanggal pengajuan) dan business key (kolom yang bermakna bisnis, misal nomor pengajuan) — bila dua baris punya business key yang sama, itu satu kejadian; bila candidate key-nya sama tapi business key berbeda, itu dua kejadian. Bila tidak ada kunci yang bisa memutuskan — nama sama, ID tidak ada, tanggal dekat — eskalasi ke pemilik data: jangan hapus, jangan gabung, tandai sebagai "perlu verifikasi" dan dokumentasikan.

---

## 3. Tipe Salah

Nilai yang benar tapi tersimpan dengan tipe yang salah: angka sebagai teks ("1.700.000"), angka sebagai string ("2").

**Nilai:** file 20 pengajuan — 3 tipe salah [lab]: income "1.700.000" dan "3.000.000" serta keterlambatan "2". Setelah parsing eksplisit (buang titik ribuan, bagi 1.000.000): 1,7 dan 3,0 juta per bulan; keterlambatan menjadi angka 2.

**Gambar:** "1.700.000" → buang titik → 1700000 → bagi 1.000.000 → 1,7.

**Baik/buruk:** parsing eksplisit dengan format yang dinyatakan baik — hasilnya bisa diuji ulang. Parsing diam-diam buruk — "12/03/2025" bisa berarti 12 Maret atau 3 Desember.

**Mitigasi:** tulis formatnya di code, hitung berapa baris yang gagal diparsing, dan kembalikan yang gagal ke pemilik data.

Tabel operasionalnya — nilai mentah → tafsir → validasi: "1.700.000" → 1.700.000 rupiah (titik = pemisah ribuan, format Indonesia) atau 1,7 (titik pertama dibaca sebagai desimal) — validasi: cek metadata satuan dan rentang (income 1,7 juta masuk akal; 1.700.000 juta tidak). "12/03/2025" → 12 Maret (format DD/MM, Indonesia) atau 3 Desember (format MM/DD, Amerika) — validasi: cek locale metadata dan silang dengan tanggal lain di file yang sama (bila ada "25/03/2025", formatnya pasti DD/MM karena 25 tidak bisa jadi bulan). Persen vs desimal: "12%" vs 0,12 — validasi: cek rentang (0 sampai 1 berarti desimal; 0 sampai 100 berarti persen). Mata uang berbeda: "Rp1.700.000" vs "$1.700" — validasi: cek metadata mata uang dan orde magnitudenya. Tanda negatif: BILL_AMT −165.580 [notebook] — bukan error, melainkan saldo kredit (kelebihan bayar) — validasi: cek arti bisnisnya, bukan tandanya. Aturannya: jangan pernah menebak format — cek metadata, cek rentang, dan cek sampel hasil parsing sebelum memakai kolom itu.

---

## 4. Kode Tak Dikenal

Nilai kategorikal yang tidak ada di kamus: EDUCATION 0, 5, 6 padahal kamusnya hanya 1 sampai 4; MARRIAGE 0 padahal kamusnya 1 sampai 3.

**Nilai:** notebook credit scoring — EDUCATION tak terdokumentasi 345 baris dari 30.000, yaitu 1,15 persen [notebook]; MARRIAGE sama dengan 0 sebanyak 54 baris, yaitu 0,18 persen [notebook]. Keputusan notebook: biarkan apa adanya dan catat di model card. Band keputusannya: di bawah 2 persen — biarkan + dokumentasi; 2 sampai 10 persen — jadikan kategori "unknown" yang eksplisit; di atas 10 persen — selidiki sumbernya. File 20 baris punya 2 dari 20, yaitu 10 persen — tepat di batas atas band tengah (2–10 persen): jadikan "unknown".

**Gambar:** 345 dari 30.000 (1,15 persen) vs 2 dari 20 (10 persen) — keputusan berbeda: 1,15 persen dibiarkan, 10 persen dijadikan kategori eksplisit — karena persentasenya berbeda.

**Baik/buruk:** membiarkan 1,15 persen baik bila didokumentasikan. Membiarkan 10 persen sebagai angka mentah buruk — model linear membaca 0 dan 5 sebagai jenjang pendidikan yang nyata.

**Mitigasi:** bila sedikit, biarkan + dokumentasi di model card. Bila banyak, buat kategori "unknown" yang eksplisit. Bila mendominasi, kembali ke pemilik data.

---

## Lab

**Lab 1 — Audit file 20 pengajuan.** Empat tugas: hitung income kosong; hitung baris yang sudah muncul sebelumnya; hitung nilai bertipe string dan kode edu di luar 1 sampai 4; dan hitung missing di tiga level — per kolom, per baris, dan per sel. Hasil: missing income 3 (15 persen), duplikat 2, tipe salah 3, kota non-kanonik 6, kode edu tak dikenal 2, kolom income kosong 3 (15 persen), baris dengan minimal satu sel kosong 3 (15 persen), sel kosong 3 (3 persen).

**Lab 2 — Bersihkan file itu.** Hasil: 18 baris, missing income tetap 3, tipe salah 0, kota non-kanonik 0, kode edu unknown 2, income Eko 1,7, income Sari 3,0.

---

## Peta Keputusan

- Missing: di bawah 5 persen dan acak — hapus. 5–30 persen — imputasi (L0.2). Di atas 30 persen atau tidak acak — selidiki.
- Duplikat persis — hapus satu salinan. Duplikat dekat — cek kunci identitas dulu.
- Tipe salah — parsing eksplisit + hitung yang gagal.
- Kode tak dikenal: di bawah 2 persen — biarkan + dokumentasi. 2–10 persen — jadikan "unknown". Di atas 10 persen — selidiki.

Koneksi ke modul berikutnya: cleaning adalah fondasi input validation dan data preparation — di M1, audit seperti ini yang menentukan apakah feature preparation bisa dipercaya; di M2, aturan yang sama dipakai saat menyiapkan data credit scoring (dan reject inference di M2 justru bermula dari data yang tidak bersih: pelamar yang ditolak tidak pernah masuk tabel); di M6, keputusan cleaning yang didokumentasikan di sini menjadi bagian dari sensitivity analysis — bagaimana kesimpulan berubah bila aturan cleaning-nya diubah. Peta lengkap L0 → M1–M9 ada di L0.5.

---

## Mini-case: Audit Notebook Credit Scoring

Cell 10 notebook (30.000 nasabah): nilai kosong 0; baris duplikat 0; EDUCATION tak terdokumentasi 345 (1,15 persen); MARRIAGE sama dengan 0 sebanyak 54 (0,18 persen); PAY negatif — PAY_0 8.445 baris, PAY_2 9.832, PAY_3 10.023, PAY_4 10.035, PAY_5 10.085, PAY_6 10.635. Keputusan: EDUCATION 1,15 persen dan MARRIAGE 0,18 persen → band di bawah 2 persen: biarkan + dokumentasi. PAY negatif bukan kasus kode tak dikenal — kode −2 (bayar lebih awal) dan −1 (lunas) terdokumentasi dan mencakup 28 persen data, jadi band persentase tidak berlaku; yang wajib adalah dokumentasi arti kode.

---

## Guided Task di Colab

Audit 60 pengajuan sintetis (seed 42) dengan masalah yang disuntikkan pada laju yang diketahui — missing income 15 persen, 3 duplikat persis, tipe salah, varian kota, kode edu tak dikenal.

Buka di Colab: https://colab.research.google.com/drive/1wTFfmxfaTUfBO7Zec0rCAiEML-tePTC9

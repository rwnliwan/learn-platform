# Review DeepSeek — L0 "Data Foundations" (Track Machine Learning Finance)

- **Reviewer:** DeepSeek via Kelontong AI (`deepseek-v4.1-flash`, streaming, max-tokens 8000) — kursi reviewer utama
- **Tanggal:** 12 Nov 2026
- **Materi yang direview:** 5 lesson ringkas `content/mlf-l01-data-cleaning.md`, `mlf-l02-missing-data-imputasi.md`, `mlf-l03-distribusi-outlier.md`, `mlf-l04-data-wrangling.md`, `mlf-l05-ab-testing.md` + file TS penuh + quiz (30 soal + `why`) + data figure + notebook `colab/mlf-l0*-guided-task.ipynb` + notebook credit scoring (untuk verifikasi klaim `[notebook]`)
- **Angka acuan:** spec §3.3 (angka kanonis notebook credit scoring)
- **Verifikasi temuan:** setiap temuan DeepSeek dicek ulang ke file sumber oleh agen review ini SEBELUM ditulis di laporan ini. Tiga koreksi atas reviewer dicatat di akhir laporan (satu temuan DeepSeek SALAH dan menjadi temuan baru F25; satu catatan reviewer keliru soal frasa "batas wajar"; satu item "mohon dicek" berhasil diverifikasi — BILL_AMT1 memang bisa negatif). Tidak ada file lesson yang diedit.

## Temuan

### 1. must-fix — L0.2, Cerita pembuka ("Rata-rata yang membuat model terlalu percaya diri")

- **Klaim persis (.md + TS:31):** "Analis itu mengisi 3 income kosong dengan rata-rata income yang ada: **2,7 juta**. … Lalu ia memeriksa varians income-nya: **menyusut 20 persen**. … karena **3 dari 15 nilai adalah salinan rata-rata yang sama**."
- **Yang salah:** cerita ini mencampur *nilai* satu teknik dengan *angka penyusutan* teknik lain — kelas kesalahan (c) dari M1. Daftar B punya mean **3,4833** (41,8/12), bukan 2,7 — angka 2,7 adalah **median**. Penyusutan **20,0%** hanya muncul bila pengisinya mean 3,4833: SS daftar B = 85,196665 tetap (3 nilai pengisi sama dengan mean tidak menambah SS), varians = 85,196665/15 = **5,6798**; (7,0997 − 5,6798)/7,0997 = **20,0%**. Bila pengisinya 2,7 (median), varians = **5,7780**, penyusutan = **18,6%**, bukan 20%. Angka 2,7 juga bukan rata-rata file L0.1: mean 17 income yang diketahui di file 20 pengajuan adalah 48,9/17 = **2,876**, bukan 2,7 — jadi 2,7 tidak cocok dengan file mana pun sebagai "rata-rata".
- **Verifikasi:** TERKONFIRMASI. Hitungan ulang agen review: mean B 3,4833; var sesudah isi mean 5,6798 (susut 20,0%); var sesudah isi median 5,7780 (susut 18,6%); mean file L0.1 = 2,876.
- **Perbaikan:** "mengisi 3 income kosong dengan rata-rata **3,48 juta** … varians menyusut **20,0 persen** (3 dari 15 = 20 persen)". Atau, bila ingin memakai 2,7: "…dengan **median 2,7 juta** … menyusut **18,6 persen**".

### 2. must-fix — L0.2, §3 "MCAR / MAR / MNAR" vs §4 "Kapan imputasi berbohong"

- **Klaim persis (TS:124):** "**MCAR baik** — menghapus atau mengisi dengan rata-rata **tidak bias**, karena yang hilang adalah potongan acak dari data."
- **Yang salah:** benar untuk *mean marginal* saja. Untuk varians, kovarians, dan koefisien regresi, mean imputation tetap bias — dan lesson ini sendiri menyatakan di §4 (TS:136): "**Imputasi dengan satu nilai selalu menyusutkan varians** — itu bukan kecelakaan, itu aritmetik." Dua pernyataan dalam satu lesson tidak bisa keduanya benar tanpa kualifikasi; siswa yang percaya §3 akan mengira mean imputation "aman" di bawah MCAR.
- **Verifikasi:** TERKONFIRMASI. §4 membuktikannya dengan angka lesson sendiri: varians daftar B 7,0997 → 5,6798 setelah imputasi mean (susut 20,0%) — padahal mekanisme di §4 itu sendiri adalah imputasi pada data yang sama.
- **Perbaikan:** "MCAR — menghapus baris tidak bias untuk mean; namun **imputasi satu nilai tetap menyusutkan varians** (§4). Yang hilang tanpa bias hanyalah estimasi mean marginal."

### 3. must-fix — L0.1, §4 "Duplikat" (tip: dedup setelah standardisasi)

- **Klaim persis (TS:109):** "Urutan penting: standardisasi dulu (kota, huruf besar-kecil, spasi), baru cari duplikat. **'Budi, jakarta' dan 'Budi, Jakarta' terlihat berbeda sebelum standardisasi — setelahnya baru ketahuan kembar.**"
- **Yang salah:** di file 20 baris, pasangan duplikat Budi adalah baris ke-2 dan ke-20, keduanya **("Budi", 1,7, 2, 3, "jakarta")** — identik sampai huruf kecilnya. Pasangan Andi (baris 1 dan 17) juga identik ("Jakarta" kapital di keduanya). **Tidak ada satu pun pasangan duplikat di file ini yang hanya berbeda pada kapitalisasi/whitespace kota**, jadi standardisasi tidak berperan apa pun dalam menemukan kedua duplikat itu. Klaim contoh ini menggambarkan perilaku data yang tidak ada di data.
- **Verifikasi:** TERKONFIRMASI dari data mentah (20 baris di Lab 1). Hitungan ulang: duplikat exact-match = 2, sesuai expected lab — justru karena kedua pasangan sudah identik sebelum standardisasi.
- **Perbaikan:** jadikan contoh itu *hipotetis* ("seandainya salah satu baris tertulis "Jakarta"…"), atau ganti dengan pernyataan yang benar untuk file ini: "kedua duplikat di file ini identik byte-per-byte; standardisasi kota **tidak** diperlukan untuk menemukannya". (Lihat juga F7 — urutan lab bertentangan dengan nasihat ini.)

### 4. must-fix — L0.1, §1 "Nilai kosong" (rumus missing rate)

- **Klaim persis (TS:53):** `$$\text{missing rate} = \frac{\text{jumlah sel kosong}}{\text{total baris}}$$`
- **Yang salah:** pembilang dalam **sel**, penyebut dalam **baris**. Untuk file 20 baris × 5 kolom dengan 3 sel kosong, rumus ini menghasilkan 3/20 = 15% — padahal *cell-missing rate* sebenarnya 3/100 = 3%, dan *row-missing rate* (baris yang punya ≥1 sel kosong) juga 15% hanya kebetulan karena tiap baris di file ini maksimum punya 1 sel kosong. Bila satu baris punya 2 sel kosong, rumus ini memberi 10% padahal hanya 5% baris yang terpengaruh. Dua definisi yang sah (per sel, per baris) tercampur jadi satu rumus yang tidak berdimensi. FormulaNote di bawahnya pun berkata "porsi baris yang kosong" — definisi baris, bukan sel.
- **Verifikasi:** TERKONFIRMASI. Angka 15% di lesson ini kebetulan benar sebagai row-rate, jadi tidak ada angka downstream yang berubah — yang salah adalah rumusnya.
- **Perbaikan:** tulis eksplisit salah satu: `missing rate (per baris) = jumlah baris dengan ≥1 sel kosong / total baris`, atau `missing rate (per sel) = jumlah sel kosong / (jumlah baris × jumlah kolom)`. Lesson wajib menyebut mana yang dipakai di band keputusan.

### 5. must-fix — L0.1, §4 "Kode tak dikenal" (label band + "keputusan yang sama")

- **Klaim persis (TS:135 + TS:422; .md:57 + .md:59):** "File 20 baris punya 2 dari 20, yaitu 10 persen — **masuk band atas**: jadikan "unknown"." dan "345 dari 30.000 (1,15 persen) vs 2 dari 20 (10 persen) — **keputusan yang sama, obat yang berbeda** karena persentasenya berbeda."
- **Yang salah:** (i) band yang didefinisikan lesson adalah "<2% biarkan; **2–10% → "unknown"**; **>10% → selidiki**". 10,0% berada **tepat di batas atas band tengah**, bukan band atas. Kalimat "masuk band atas" akan membawa siswa ke aksi "selidiki sumbernya", padahal aksi yang ditulis ("jadikan unknown") adalah aksi band tengah — dua bagian kalimat itu saling bertentangan. (ii) "keputusan yang sama" salah: 1,15% → *biarkan + dokumentasi*; 10% → *jadikan "unknown"*. Keputusannya justru **berbeda**; yang sama hanya jenis masalahnya (kode tak dikenal), bukan keputusannya.
- **Verifikasi:** TERKONFIRMASI di TS maupun .md. Bandnya sendiri kontinu (2–10% mencakup 10; >10% selidiki) — yang salah hanya penamaannya, bukan geometri band.
- **Perbaikan:** "2 dari 20 = 10 persen — **tepat di batas atas band tengah (2–10%)**: jadikan "unknown"." dan "keputusan **berbeda**: 1,15 persen dibiarkan, 10 persen dijadikan kategori eksplisit — karena persentasenya berbeda."

### 6. must-fix — L0.1, Mini-case (.md saja; TS benar)

- **Klaim persis (.md:86):** "…PAY negatif — PAY_0 8.445 baris, PAY_2 9.832, PAY_3 10.023, PAY_4 10.035, PAY_5 10.085, PAY_6 10.635. **Keputusan: biarkan + dokumentasi (band di bawah 2 persen).** PAY negatif bukan masalah…"
- **Yang salah:** PAY_0 negatif = 8.445/30.000 = **28,15%**, jauh di atas 10% — menurut band lesson sendiri itu "di atas 10 persen — selidiki sumbernya", bukan "band di bawah 2 persen". Parenthetical itu hanya sah untuk EDUCATION (1,15%) dan MARRIAGE (0,18%). Kalimat .md ini menyusun daftar (termasuk PAY) lalu menempelkan satu keputusan + satu band ke seluruh daftar, sehingga terbaca seolah 28% masuk band <2%.
- **Verifikasi:** TERKONFIRMASI untuk `.md`, dengan nuansa: file TS justru BENAR — mini-case TS memisahkan keputusan per item (EDUCATION 1,15% → biarkan; MARRIAGE 0,18% → biarkan; PAY negatif → "bukan masalah sama sekali" karena kodenya sah) tanpa menempelkan band <2% ke PAY. Jadi ini cacat ringkasan `.md` (yang juga masuk ke `chapters.ts`), bukan cacat lesson web — pola yang sama dengan F1 di review M1.
- **Perbaikan:** pisahkan di .md: "EDUCATION 1,15% dan MARRIAGE 0,18% → band <2%: biarkan + dokumentasi. PAY negatif **bukan** kasus kode tak dikenal — kode −2/−1 terdokumentasi dan mencakup 28% data, jadi band persentase tidak berlaku; yang wajib adalah dokumentasi arti kode."

### 7. should-fix — L0.1, Lab 2 menjalankan dedup **sebelum** standardisasi, bertentangan dengan nasihat §4

- **Klaim persis:** nasihat §4 (TS:109): dedup **setelah** standardisasi — vs Lab 2: dedup dulu (set atas tuple mentah), lalu parsing, recode, standardisasi kota.
- **Yang salah:** urutan lab terbalik dari nasihatnya sendiri. Hasil akhirnya kebetulan sama (18 baris) hanya karena tidak ada near-duplicate di file ini, sehingga kontradiksinya tersembunyi. Siswa yang mengikuti nasihat §4 akan mendapat hasil sama; siswa yang meniru kode lab akan mendapat prosedur yang gagal pada data dengan duplikat "jakarta"/"Jakarta". Hint Lab 2 bahkan menyatakan eksplisit: "Dedup dilakukan SEBELUM parsing: dua baris 'Budi' yang kembar dihapus dulu" — jadi kontradiksinya tertulis di dua tempat.
- **Verifikasi:** TERKONFIRMASI dari kode solution Lab 2 (`if r in seen: continue` pada tuple mentah, standardisasi kota belakangan).
- **Perbaikan:** samakan salah satu — idealnya ubah urutan kode lab menjadi parsing → standardisasi → dedup, dan tambahkan satu baris bahwa untuk file ini urutan tidak mengubah hasil (18 baris) karena duplikatnya identik.

### 8. should-fix — L0.2, figure histogram tidak cocok dengan daftar B (bin 1–2 dan 2–3)

- **Klaim persis (figure §1, aria-label):** "Histogram daftar B sebelum dan sesudah imputasi mean: bin 3 sampai 4 melonjak dari 3 menjadi 6". Batang figure: sebelum `3, 4, 3, 1, 0, 1`; sesudah `3, 4, 6, 1, 0, 1` (bin 1–2, 2–3, 3–4, 4–5, 5–12, 12–13).
- **Yang salah (hitung ulang agen review):** dengan bin setengah-terbuka standar `[1,2), [2,3), [3,4), [4,5), [5,12), [12,13)` isi daftar B adalah **2, 5, 3, 1, 0, 1** (bin 1–2: 1,7 & 1,9; bin 2–3: 2,0/2,2/2,4/2,6/2,8). Batang `3` dan `4` hanya bisa muncul bila **2,0 dihitung di bin pertama** (bin tertutup kanan) — konvensi yang tidak dinyatakan dan berbeda dari bin lain (3,1 masuk bin 3–4, bukan 2–3). Totalnya benar (12), dan klaim "3 → 6" untuk bin 3–4 tetap valid (3 nilai imputan 3,4833 + 3 = 6); yang salah hanya dua batang pertama. Konvensi ini juga tidak konsisten dengan figure L0.3, yang memakai bin tertutup-kiri (70 masuk bin 70–80, 90 masuk bin 90–100, 250 masuk bin 250–500, 500 masuk bin 500–1000 — semuanya terverifikasi).
- **Verifikasi:** TERKONFIRMASI. Notebook L0.2 tidak menghitung histogram (tidak ada sel bin/hist), jadi figure TS adalah satu-satunya sumber batang — dan batang itu salah di bawah konvensi standar.
- **Perbaikan:** perbaiki batang menjadi `2, 5, 3, 1, 0, 1` (sesudah: `2, 5, 6, 1, 0, 1`), atau nyatakan konvensi tepi bin secara eksplisit di caption.

### 9. should-fix — L0.3, formula skewness memakai `s³` tanpa mendefinisikan `s` (populasi vs sampel)

- **Klaim persis (§1 formula):** `$$\text{skewness} = \frac{\frac{1}{n}\sum (x_i - \bar{x})^3}{s^3}$$` (tanpa keterangan `s`), sementara §4 secara eksplisit menulis "sd **populasi** 1523,95".
- **Yang salah:** dengan `s` = sd populasi, skewness bills = **2,386** (cocok dengan lesson). Bila siswa memakai sd sampel (pembagi n−1) untuk `s` tetapi pembilang berbagi n — kombinasi yang wajar dari notasi ini — hasilnya **2,135**, bukan 2,386 (rasio (753,54/782,0)³ = 0,8948). Notasi `1/n` di pembilang dan `s` yang tidak didefinisikan membuat dua konvensi tercampur. Ini kelas kesalahan (i) dari M1 — nilai lesson hanya reproducible dengan konvensi momen populasi.
- **Verifikasi:** TERKONFIRMASI. Hitungan ulang agen review: sd populasi bills 753,54 → skew 2,386; sd sampel 782,0 → 2,135.
- **Perbaikan:** tulis "dengan `s` = standard deviation **populasi** (pembagi n), sehingga pembilang dan penyebut konsisten", atau gunakan notasi `m_3 / m_2^{3/2}` dengan `m_k = (1/n)Σ(x−x̄)^k`.

### 10. should-fix — L0.4, label `[notebook]` pada angka 180.000 baris tidak sah

- **Klaim persis (TS:46; .md:13):** "Di notebook credit scoring, reshape yang sama pada 30.000 nasabah × 6 bulan menghasilkan **180.000 baris [notebook]**."
- **Yang salah:** 30.000 × 6 = 180.000 benar secara aritmetik, tetapi notebook credit scoring **tidak pernah** melakukan melt/reshape ke format long — ia hanya membuat agregat dari 6 kolom wide (cell 13: PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND). Angka itu hasil perkalian, bukan hasil operasi notebook. Label `[notebook]` menyatakan provenance yang tidak ada. (Figure reshape TS:77 bahkan menulis "notebook: 30.000 × 6 = 180.000 baris" — label yang sama di gambar.)
- **Verifikasi:** TERKONFIRMASI. Grep seluruh notebook credit scoring: tidak ada `melt`, `reshape`, `180000`, atau `180.000` di code maupun output.
- **Perbaikan:** "30.000 × 6 = 180.000 baris **bila** di-melt; notebook ini sendiri tetap wide dan mengagregasi kolomnya (cell 13)". Atau hapus label `[notebook]` (ganti `[ilustrasi]`).

### 11. should-fix — L0.4, "wide buruk untuk modelling" terlalu mutlak dan bertentangan dengan praktik notebook

- **Klaim persis (TS:48):** "**Wide buruk untuk modelling** — model melihat 6 kolom bulan sebagai 6 fitur yang berbeda, bukan sebagai satu deret waktu."
- **Yang salah:** untuk credit scoring tabular (GBM/LR), wide **adalah** bentuk standar — dan notebook yang jadi acuan lesson ini justru memodelkan BILL_AMT1…6 sebagai 6 kolom wide, lalu menurunkan agregat darinya. "6 fitur berbeda" bukan cacat; ia hanya berbeda tujuan dari analisis deret waktu. Menyatakan wide "buruk untuk modelling" tanpa qualifier akan membuat siswa melakukan melt yang tidak perlu untuk model tabular.
- **Verifikasi:** TERKONFIRMASI. Notebook cell 13 bekerja pada kolom wide; tidak ada melt di notebook.
- **Perbaikan:** "Wide **kurang cocok bila** yang dibutuhkan adalah operasi per-waktu (agregasi runtun, lag, model deret waktu); untuk model tabular, wide sah dan justru yang dipakai notebook ini — long dipakai untuk menurunkan agregat seperti PAY_MEAN."

### 12. should-fix — L0.4, EDUCATION dijadikan ordinal 1–4 padahal kategori 4 adalah "others" (bukan jenjang); quiz menandai one-hot sebagai "salah"

- **Klaim persis (TS:132 + quiz Q5):** "EDUCATION 4 jenjang (1 graduate, 2 university, 3 high school, **4 others**) — urutannya bermakna, jadi **ordinal encoding 1 sampai 4 sah dipakai**." Quiz Q5: opsi "One-hot" diberi `why: "Salah: one-hot sah tapi membuang informasi urutan yang bermakna."` (correct: false).
- **Yang salah:** (i) "others" bukan titik pada tangga pendidikan — memberi kode 4 membuat model linear membaca "others" sebagai jenjang **di bawah** SMA, persis kesalahan yang dilarang L0.1 ("model linear membaca 0 dan 5 sebagai jenjang pendidikan yang nyata"). (ii) Ordinal 1–4 memaksakan jarak antar-jenjang sama besar, dan arahnya terbalik (1 = pendidikan tertinggi) — tidak dibahas sama sekali, padahal itu mengubah tanda koefisien. (iii) Menandai one-hot sebagai *salah* tidak benar: one-hot adalah pilihan yang sah dan sering lebih aman karena tidak memaksakan monotonisitas; yang benar adalah "ordinal **boleh** dipakai bila urutan dianggap monoton, dengan risiko jarak tidak sama".
- **Verifikasi:** TERKONFIRMASI. Notebook sendiri tidak meng-encoding EDUCATION secara ordinal maupun one-hot — ia membiarkan kode mentah sebagai fitur numerik untuk model tree-based, jadi lesson tidak bisa bersandar pada "praktik notebook" untuk klaim ini.
- **Perbaikan:** "EDUCATION: 1–3 berurutan (graduate > university > high school) → ordinal **boleh**, dengan catatan jarak antar-jenjang diasumsikan sama dan arah kode harus didokumentasikan; kategori **4 = others** sebaiknya dipisah (indikator sendiri atau 'unknown'), bukan diberi peringkat 4." Ubah `why` one-hot menjadi "sah, tetapi tidak memakai informasi urutan — trade-off, bukan kesalahan".

### 13. should-fix — L0.5, band power tumpang tindih di 80%

- **Klaim persis (TS:101):** "Band power-nya kontinu: **80 persen ke atas memadai**; **50 sampai 80 persen lemah**; di bawah 50 persen sangat lemah".
- **Yang salah:** power 80% masuk **kedua** band (≥80 "memadai" dan ≤80 "lemah") — dan lesson mengklaim band ini "kontinu" padahal ia tumpang tindih di 80. Contoh lesson sendiri — "n sama dengan 2.884 memberi 80 persen (garis target 80 persen)" — jadi kasus yang secara definisi berada di dua label sekaligus. Ini kelas kesalahan (f) dari M1.
- **Verifikasi:** TERKONFIRMASI. Hitungan ulang: n = 2.884 → power = 0,800 (Phi(0,842)), tepat di titik tumpang tindih.
- **Perbaikan:** "di bawah 80% lemah; **≥80% memadai**" (dan bila perlu "50–<80 lemah; <50 sangat lemah").

### 14. nit — L0.3, "87,69 lebih rendah dari 10 dari 16 skor" → seharusnya 11 dari 16

- **Klaim persis (TS:190; .md:47):** "Buruk untuk mean — 87,69 lebih rendah dari **10 dari 16** skor."
- **Yang salah (hitung ulang agen review):** skor > 87,69 = 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99 = **11 nilai**; yang di bawah = 5 (55, 70, 78, 82, 85). Angka 10 yang benar adalah jumlah skor di bin 90–100 — penulis tampaknya mencampur "10 skor di 90–100" dengan "skor di atas mean".
- **Verifikasi:** TERKONFIRMASI. (Klaim "10 dari 16 di bin 90–100" di tempat lain — TS:189, caption figure, .md:45 — BENAR.)
- **Perbaikan:** "11 dari 16".

### 15. nit — L0.3, band z-score tumpang tindih di |z| = 2

- **Klaim persis (TS:231):** "Band z-score-nya kontinu: nilai absolut **sampai 2** biasa; **2 sampai 3** periksa; di atas 3 kuat", sementara Peta Keputusan: "outlier (… dan **|z| di atas 2**)".
- **Yang salah:** |z| = 2 persis masuk "biasa" (≤2) dan "periksa" (≥2) sekaligus — dan lesson mengklaim band ini "kontinu" padahal ia tumpang tindih di 2.
- **Verifikasi:** TERKONFIRMASI.
- **Perbaikan:** "<2 biasa; 2–≤3 periksa; >3 kuat".

### 16. nit — L0.3, kurtosis disebut sebagai salah satu dari "tiga alat" tetapi tidak punya band keputusan

- **Klaim persis (TS:46–47):** "Tiga alat memeriksanya — histogram, QQ plot, skewness/kurtosis — dan **ketiganya harus setuju**." Dan: "kurtosis (excess) −0,612 (sedikit lebih datar dari lonceng normal, tapi **masih dalam batas wajar**)."
- **Yang kurang:** skewness punya band (0,5 / 1) dan QQ punya band (0,95 / 0,99), tetapi kurtosis hanya diberi angka (−0,612) tanpa ambang apa pun — tidak ada band kurtosis yang dinyatakan di lesson mana pun. Akibatnya "ketiganya harus setuju" tidak bisa dieksekusi untuk kurtosis, dan penilaian "masih dalam batas wajar" tidak punya acuan.
- **Verifikasi:** TERKONFIRMASI, dengan koreksi atas reviewer (lihat "Koreksi atas reviewer" di bawah): frasa "masih dalam batas wajar" **ADA** di TS (bukan tidak ada seperti yang ditulis DeepSeek) — justru itu yang memperkuat temuan: lesson membuat penilaian tanpa pernah mendefinisikan bandnya.
- **Perbaikan:** tambahkan satu kalimat band (mis. |excess| < 1 wajar) atau keluarkan kurtosis dari daftar "alat penentu".

### 17. nit — L0.3, PAY_0 dideskripsikan "menumpuk di 0 dengan ekor ke kanan", 28% massanya di kode negatif tidak disebut

- **Klaim persis (mini-case):** "Distribusi PAY_0 menumpuk di 0 (14.737 dari 30.000) dengan ekor ke kanan — diskrit dan miring, bukan lonceng."
- **Yang kurang:** 8.445 baris (28,15%) berada di −2/−1 (bayar lebih awal/lunas), jadi distribusinya **trimodal di sisi kiri** + ekor kanan, bukan monomodal-di-0-dengan-ekor-kanan. Kesimpulan "jangan diperlakukan kontinu normal" tetap benar.
- **Verifikasi:** TERKONFIRMASI dari output cell 8 notebook: PAY_0 −2: 2.759; −1: 5.686; 0: 14.737; 1: 3.688; 2: 2.667; dst. Jumlah −2/−1/0 = 23.182 dari 30.000 = 77,3%.
- **Perbaikan:** "menumpuk di −2/−1/0 (23.182 dari 30.000 = 77%) dengan ekor tipis ke kanan sampai 8".

### 18. nit — L0.2, ambang penyusutan varians tidak konsisten (5% vs 10%)

- **Klaim persis (TS:139 vs TS:324):** "penyusutan **di bawah 5 persen** baik. Penyusutan 20 persen buruk bila tidak dilaporkan" vs Peta Keputusan: "Bila **lebih dari 10 persen**, laporkan."
- **Yang kurang:** rentang 5–10% tidak punya aturan; siswa tidak tahu apakah 7% "baik" atau "wajib dilaporkan". Satukan jadi satu ambang.
- **Verifikasi:** TERKONFIRMASI.
- **Perbaikan:** satu ambang yang sama di kedua tempat (mis. <5% abaikan; 5–10% laporkan; >10% laporkan + pertimbangkan indikator missing/multiple imputation).

### 19. nit — L0.5, CI memakai SE pooled (SE uji), perbedaan dengan SE unpooled tidak dinyatakan

- **Klaim persis (§1–§2):** "standard error 0,015162; z sama dengan 1,6489" lalu "95% CI (−0,0047, 0,0547)".
- **Hitungan (agen review):** CI = 0,025 ± 1,96 × 0,015162 = (−0,004718, 0,054718) — jadi CI memang memakai **SE pooled**. SE unpooled = √(0,12·0,88/1000 + 0,145·0,855/1000) = **0,015152**, memberi (−0,004696, 0,054696) — sama setelah pembulatan 4 desimal. Jadi angka lesson tidak salah, tetapi konvensi (pooled untuk uji, unpooled untuk CI) layak disebut satu baris agar tidak jadi kebiasaan buruk.
- **Verifikasi:** TERKONFIRMASI (bukan kesalahan angka).
- **Perbaikan:** satu kalimat: "CI di sini memakai SE pooled yang sama dengan uji-z; konvensi umum memakai SE unpooled — bedanya di sini tidak terlihat setelah pembulatan."

### 20. nit — L0.5, 2.884 berasal dari z yang dibulatkan; dengan kuantil eksak 2.887

- **Klaim persis (§3):** "Ukuran sampel untuk power 80 persen: **2.884** per kelompok [lab]."
- **Hitungan (agen review):** rumus lesson dengan z = 1,95996 & 0,84162 → n = 0,229875 × 7,848878 / 0,000625 = **2.886,9 ≈ 2.887**. Dengan z = 1,96 & 0,84 (dibulatkan) → 2.883,6 ≈ **2.884**. Jadi 2.884 konsisten dengan pembulatan z, dan n = 2.884 memang memberi power 0,800 — bukan kesalahan, hanya perlu dicatat konvensinya.
- **Verifikasi:** TERKONFIRMASI (bukan kesalahan angka).
- **Perbaikan:** satu kalimat: "dengan z dibulatkan (1,96 dan 0,84) hasilnya 2.884; dengan kuantil eksak 2.887 — bedanya tidak material."

### 21. nit — L0.2, mini-case memakai kolom "income" yang tidak ada di notebook

- **Klaim persis (mini-case):** "Notebook credit scoring punya 0 nilai kosong — mini-case ini adalah skenario "bagaimana bila": **income** kosong 15 persen…"
- **Yang kurang:** notebook UCI Default of Credit Card Clients tidak punya kolom income (fitur finansialnya LIMIT_BAL, BILL_AMT1–6, PAY_AMT1–6). Skenario tetap sah sebagai latihan, tetapi sebutkan bahwa "income" adalah kolom hipotetis, atau pakai LIMIT_BAL.
- **Verifikasi:** TERKONFIRMASI dengan nuansa — TS mini-case menulis "bayangkan income **(LIMIT_BAL)** kosong 15 persen", jadi pemetaan ke LIMIT_BAL ADA di TS; tetapi .md menghilangkan pemetaan itu ("income kosong 15 persen" lalu menyebut LIMIT_BAL belakangan tanpa mengaitkan). Dan LIMIT_BAL adalah **limit kartu kredit, bukan income** — stand-in ini perlu dilabeli eksplisit ("anggap LIMIT_BAL sebagai proksi income"), bukan ditulis seolah keduanya sama.
- **Perbaikan:** "bayangkan **LIMIT_BAL** (sebagai proksi income) kosong 15 persen…" — di TS maupun .md.

### 22. nit — L0.4, istilah "cartesian" dipakai untuk fan-out kunci duplikat

- **Klaim persis (TS:93 + quiz Q6):** "Satu id yang muncul dua kali di tabel B akan menggandakan baris A-nya (**cartesian**)." Quiz Q6: opsi benar "Baris A-nya mengganda (cartesian) — 6 baris bisa menjadi lebih dari 6".
- **Yang kurang tepat:** cartesian product adalah perkalian penuh tanpa kunci; kasus ini *duplicate-key fan-out / row explosion*. Istilah yang salah di kuis akan dihafal siswa sebagai definisi.
- **Verifikasi:** TERKONFIRMASI.
- **Perbaikan:** sebut "fan-out (bukan cartesian product)" — di prose maupun opsi kuis.

### 23. nit — L0.1, batang "Kota 6" dihitung pada 20 baris (termasuk baris duplikat); setelah dedup menjadi 5

- **Klaim persis (§1 "Gambar" & Lab):** "audit lima batang — missing 3, duplikat 2, tipe salah 3, **kota 6**, kode 2."
- **Hitungan (agen review):** baris non-kanonik = 2, 7, 10, 12, 19, **20** = 6 — tetapi baris 20 adalah salinan (duplikat Budi) yang dihapus di Lab 2, sehingga pada himpunan 18 baris unik angkanya **5**. Tidak salah, hanya perlu dinyatakan bahwa audit dilakukan **sebelum** dedup (dan angka 6 karena itu tidak sebanding dengan "kota non-kanonik 0" di Lab 2).
- **Verifikasi:** TERKONFIRMASI.
- **Perbaikan:** satu kalimat di caption figure: "audit dihitung pada 20 baris mentah, sebelum dedup — setelah dedup, kota non-kanonik menjadi 5."

### 24. nit — L0.3/L0.4, BILL_AMT bisa negatif (saldo kredit) — perlu dicatat

- **Klaim persis:** "Log-transform baik bila nilai semuanya positif … buruk bila ada nol atau negatif" (L0.3 §2) dan "UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL)" (L0.4 mini-case).
- **Verifikasi — item "mohon dicek" DeepSeek BERHASIL diverifikasi agen review:** output cell 7 notebook credit scoring (`describe`): **BILL_AMT1 min = −165.580** (mean 51.223, max 964.511). Jadi BILL_AMT memang bisa negatif (saldo kredit / kelebihan bayar). Konsekuensinya: (a) transformasi log pada BILL_AMT tidak terdefinisi untuk sebagian baris — lesson perlu menyebut `log1p`/offset bila membahas log pada kolom tagihan; (b) UTILIZATION bisa negatif — namanya menyesatkan bila tidak dijelaskan. Lesson sendiri tidak pernah menerapkan log ke BILL_AMT (contoh log memakai 14 tagihan yang semuanya positif), dan UTILIZATION didefinisikan notebook sendiri seperti itu (cell 13) — jadi ini bukan angka yang salah, melainkan caveat yang hilang.
- **Perbaikan:** satu kalimat di L0.3 §2 ("BILL_AMT di notebook bisa negatif sampai −165.580 — log langsung tidak terdefinisi di sana") dan satu kalimat di L0.4 mini-case ("UTILIZATION bisa negatif bila BILL_AMT1 negatif").

### 25. should-fix — L0.2 + L0.3, "mean 3,4833 lebih besar dari 11 dari 12 nilai" → seharusnya 9 dari 12 (TEMUAN BARU AGEN REVIEW — DeepSeek salah di sini)

- **Klaim persis (L0.2 TS:50; L0.2 quiz Q1 `why` TS:366; L0.3 TS:32; .md L0.2:17; .md L0.3:5):** "mean ditarik outlier 12,0 — **3,4833 lebih besar dari 11 dari 12 nilai** yang ada." / "padahal **11 dari 12 nasabah berada di bawah** angka itu."
- **Yang salah (hitung ulang agen review dari daftar B [1,7, 1,9, 2,0, 2,2, 2,4, 2,6, 2,8, 3,1, 3,3, 3,6, 4,2, 12,0]):** nilai di **bawah** mean 3,4833 = 1,7, 1,9, 2,0, 2,2, 2,4, 2,6, 2,8, 3,1, 3,3 = **9 nilai**; nilai di **atas** mean = 3,6, 4,2, 12,0 = **3 nilai**. Klaim "11 dari 12" salah — kemungkinan penulis hanya menghitung outlier 12,0 sebagai satu-satunya nilai di atas mean dan lupa 3,6 dan 4,2 juga di atas 3,4833. Kesimpulan lesson ("mean bukan pusat yang jujur di sini") tetap bertahan dengan angka yang benar (mean di atas 75% nilai), tetapi bukti angkanya salah — dan muncul di **5 tempat**, termasuk `why` kuis dan cerita pembuka L0.3.
- **Verifikasi:** TERKONFIRMASI oleh agen review (bukan oleh DeepSeek — lihat "Koreksi atas reviewer" di bawah).
- **Perbaikan:** "3,4833 lebih besar dari **9 dari 12** nilai" (dan "9 dari 12 nasabah berada di bawah angka itu") — di kelima tempat.

## Koreksi atas reviewer (DeepSeek keliru — dicatat seperti F9 di review M1)

1. **Tabel DeepSeek baris 12 SALAH — menjadi temuan baru F25 (di atas).** DeepSeek menulis: "mean 3,4833 > 11 dari 12 nilai … hanya 12,0 yang > mean … cocok". Alasan itu salah: **3,6 dan 4,2 juga lebih besar dari 3,4833**. Hitungan ulang agen review: 9 nilai di bawah mean, 3 di atas. Klaim lesson SALAH. Menariknya, DeepSeek menangkap kesalahan hitungan yang sama polanya di L0.3 (F14: "10 dari 16" → 11) tetapi melewatkan — bahkan memvalidasi — kesalahan yang sama di daftar B. Kelas kesalahannya sama: menghitung berapa nilai di atas/di bawah mean.
2. **F16 — catatan "tidak ada frasa 'batas wajar' di lesson" SALAH.** Frasa "masih dalam batas wajar" **ADA** di TS (mlf-l03:47) — DeepSeek hanya membaca .md (yang memang tidak memuat frasa itu). Substansi temuan tetap berdiri (kurtosis dinilai tanpa band yang didefinisikan), dan justru diperkuat: lesson membuat penilaian "dalam batas wajar" tanpa pernah mendefinisikan bandnya.
3. **F24 — item "mohon dicek" DeepSeek BERHASIL diverifikasi.** BILL_AMT1 min = −165.580 (output cell 7 notebook). Dinaikkan dari "tidak yakin" menjadi temuan nit yang terkonfirmasi (F24 di atas).
4. **F21 — nuansa:** TS mini-case menulis "income **(LIMIT_BAL)**", jadi pemetaan ADA di TS; yang hilang adalah pemetaan di .md dan label bahwa LIMIT_BAL adalah proksi (limit kartu, bukan income).

## Yang diverifikasi benar (tidak menjadi temuan)

Angka kanonis spec §3.3 muncul dengan benar; daftar B (mean 3,4833 / median 2,7000 / var populasi 7,0997 / sd 2,6645 / var sesudah isi mean 5,6798 / var sesudah isi median 5,7780 / mean tanpa outlier 2,7091 / median tanpa outlier 2,6000) semuanya cocok; varians populasi dinyatakan eksplisit ("varians populasi 7,0997", "sd populasi 1523,95") — kelas (i) M1 sebagian tertangani (kecuali skewness, F9); metode IQR diberi nama ("metode Tukey") dan pagar dihitung dengan hinges yang benar untuk n=15 (Q1=110, Q3=180, IQR=70, pagar 5,0/285,0); semua statistik distribusi L0.3 (norm20, bills, log bills, ex, reflect+log, kuadrat, tx) cocok sampai 4 desimal; semua batang figure L0.3 cocok dengan data mentah (norm20 = 1,1,3,4,4,3,2,2; bills sebelum log = 5,5,2,1,1; ex = 1,0,2,3,10); uji-z dua proporsi L0.5 lengkap dan benar (pooled 0,1325 → SE 0,015162 → z 1,6489 → p 0,0992), konsisten dengan CI yang mencakup 0; power 0,3783 benar untuk n=1000/kelompok; FWER vs peeking dibedakan dengan benar (0,145 < 0,2262 karena intipan berkorelasi); simulasi peeking direproduksi agen review secara independen (seed 7: sekali-cek 0,049, peeking 5× 0,145 — sama persis); interpretasi p-value dan CI tidak salah; log langsung pada skor left-skew memang memperburuk (skew −1,569 → −1,893, hitungan agen review); L0.4 join/reshape/one-hot semuanya cocok (18 baris, total tagihan 3.990, inner 5 / left 6 / outer 7, one-hot 3 kolom 2/3/1, 60 × 6 = 360); mini-case L0.5 (250 pinjaman, Rp125 jt, interval rupiah) aritmetiknya benar seluruhnya; label `[notebook]` yang dicek satu per satu — kosong 0, duplikat 0, EDUCATION 345, MARRIAGE 54, PAY negatif 6 kolom, PAY_0=0 (0,128; n 14.737), PAY_0=2 (0,691; n 2.667), korelasi 0,325 / −0,154, dan 8 fitur cell 13 — semuanya benar ada di notebook; satu-satunya label `[notebook]` yang salah adalah reshape 180.000 baris (F10); formula median piecewise sudah benar untuk n ganjil dan genap — kelas (b) M1 **tidak** terulang; band keputusan L0.1 missing (5%/30%) dan L0.2 peta (5%/30%) kontinu tanpa lubang; band kode tak dikenal (2%/10%) juga kontinu — masalahnya hanya penamaan "band atas" (F5), bukan geometri band.

## Tabel — Angka yang dihitung ulang (diadaptasi dari tabel DeepSeek, dengan koreksi baris 12)

| # | Angka di lesson | Letak | Hitungan agen review / DeepSeek | Status |
|---|---|---|---|---|
| 1 | missing income 3 (15%) | L0.1 §1 | 3 `None` / 20 = 15,0% | cocok |
| 2 | duplikat 2; sisa 18 baris | L0.1 §2 | 2 pasang identik; 20−2 = 18 | cocok |
| 3 | tipe salah 3 | L0.1 §3 | "1.700.000", "3.000.000", late "2" = 3 | cocok |
| 4 | kota non-kanonik 6 | L0.1 §1 | baris 2,7,10,12,19,20 = 6 (5 setelah dedup) | cocok (lihat F23) |
| 5 | kode edu tak dikenal 2 = 10% | L0.1 §4 | edu 0 & 5 = 2; 2/20 = 10,0% | cocok (label band: F5) |
| 6 | EDUCATION 345 = 1,15%; MARRIAGE 54 = 0,18% | L0.1 | 345/30.000 = 1,150%; 54/30.000 = 0,180% | cocok |
| 7 | PAY_0 negatif 8.445 | L0.1 mini-case | 8.445/30.000 = 28,15% | angka cocok (band: F6) |
| 8 | mean A = median A = 2,7000 | L0.2 §1 | 21,6/8 = 2,7000; (2,6+2,8)/2 | cocok |
| 9 | mean B 3,4833; median B 2,7000 | L0.2 §1 | 41,8/12 = 3,48333; (2,6+2,8)/2 | cocok |
| 10 | mean B tanpa outlier 2,7091; selisih 0,7742 | L0.2 §1 | 29,8/11 = 2,70909; 3,48333−2,70909 | cocok |
| 11 | median B tanpa outlier 2,6000 (selisih 0,1000) | L0.2 §1 | nilai ke-6 dari 11 = 2,6 | cocok |
| 12 | mean 3,4833 > 11 dari 12 nilai | L0.2 §1 + L0.3 cerita + quiz | **9 di bawah, 3 di atas (3,6 / 4,2 / 12,0)** | **TIDAK COCOK (F25)** — koreksi atas DeepSeek |
| 13 | var B (pop) 7,0997; sd 2,6645 | L0.2 §4 | SS 85,196665/12 = 7,09972; √ = 2,66453 | cocok |
| 14 | var sesudah isi mean 5,6798; susut 20,0% | L0.2 §4 | 85,196665/15 = 5,67978; 1,41994/7,09972 = 20,0% | cocok |
| 15 | var sesudah isi median 5,7780 | L0.2 §4 | SS 86,669333/15 = 5,77796 | cocok |
| 16 | mode EDUCATION 2 muncul 6/10 | L0.2 §2 | 2×6, 3×2, 1×1, 4×1 | cocok |
| 17 | MAR 62,5% vs 8,3% (5/8, 1/12) | L0.2 §3 | 62,5% & 8,33%; total 6/20 = 30% | cocok |
| 18 | histogram B sebelum 3,4,3,1,0,1 | L0.2 Gambar | **2,5,3,1,0,1** (bin `[a,b)`) | **tidak cocok** (F8) |
| 19 | norm20: mean 65,75; median 65,50 (0,25) | L0.3 §1 | 1315/20; (65+66)/2 | cocok |
| 20 | skew 0,068; excess kurt −0,612 | L0.3 §1 | m₃=52,63; sd=9,1699 → 0,0683; m₄/sd⁴−3 = 2,388−3 | cocok |
| 21 | QQ-r norm20 0,9988 | L0.3 §1 | 0,99884 | cocok |
| 22 | bills: mean 589,3; median 290,0 | L0.3 §2 | 8250/14; (280+300)/2 | cocok |
| 23 | skew bills 2,386; QQ-r 0,7692 | L0.3 §2 | 2,386; 0,7692 | cocok |
| 24 | log: mean 5,901; median 5,669; skew 1,068; QQ-r 0,9493 | L0.3 §2 | 82,6113/14; (5,6348+5,7038)/2; 1,068; 0,9493 | cocok |
| 25 | ex: mean 87,69; median 91,50; skew −1,569; QQ-r 0,9047 | L0.3 §3 | 1403/16; (91+92)/2; −1,569; 0,9047 | cocok |
| 26 | reflect+log skew −0,296; kuadrat −1,271 | L0.3 §3 | −0,296; −1,271 | cocok |
| 27 | "87,69 lebih rendah dari 10 dari 16 skor" | L0.3 §3 | **11** dari 16 > 87,6875 | **tidak cocok** (F14) |
| 28 | tx: mean 733,47; sd pop 1523,95 | L0.3 §4 | 11002/15; √(34.836.218,1/15) | cocok |
| 29 | Q1 110; med 145; Q3 180; IQR 70; pagar 5,0 / 285,0 | L0.3 §4 | Tukey hinges n=15 | cocok |
| 30 | z(5000) 2,80; z(4200) 2,27 | L0.3 §4 | 4266,53/1523,95; 3466,53/1523,95 | cocok |
| 31 | reshape 3×6 = 18; 30.000×6 = 180.000 | L0.4 §1 | aritmetika benar | angka cocok, **label `[notebook]` salah** (F10) |
| 32 | inner 5, left 6, outer 7 | L0.4 §2 | id 2–6; 1–6; 1–7 | cocok |
| 33 | total tagihan long 3.990 | L0.4 Lab 2 | 750+1290+1950 | cocok |
| 34 | one-hot 3 kolom; 2/3/1 | L0.4 Lab 2 | [1,2,2,3,1,2] | cocok |
| 35 | p_A 0,1200; p_B 0,1450; selisih 0,0250 | L0.5 §1 | 120/1000; 145/1000 | cocok |
| 36 | pooled 0,1325; SE 0,015162; z 1,6489; p 0,0992 | L0.5 §1 | √(0,1325·0,8675·0,002); 0,025/0,015162; 2(1−Φ(1,6489)) | cocok |
| 37 | CI (−0,0047, 0,0547) | L0.5 §2 | 0,025 ± 1,96·0,015162 | cocok (F19) |
| 38 | power 0,378 | L0.5 §3 | Φ(1,6500 − 1,95996) = 0,3783 | cocok |
| 39 | n 2.884 untuk power 80% | L0.5 §3 | 2.887 eksak; 2.884 dengan z=1,96/0,84 → power 0,8001 | cocok (F20) |
| 40 | FWER 0,2262; Bonferroni 0,010 | L0.5 §4 | 1−0,95⁵; 0,05/5 | cocok |
| 41 | 250 pinjaman; Rp125 jt; (−47, 547); (−Rp23,5 jt, Rp273,5 jt) | L0.5 Mini-case | 0,025·10.000; ×500.000; 0,0047/0,0547·10.000 | cocok |

## Verdict

**APPROVE-WITH-FIXES — 6 must-fix** (F1–F6), **8 should-fix** (F7–F13 + F25), **11 nit** (F14–F24), **total 25**.

Kerangka lesson kuat dan hampir seluruh angka lolos hitung ulang sampai 4 desimal. Namun ada 6 must-fix yang **tidak boleh lolos deploy**: satu pencampuran dua eksperimen imputasi (F1), satu kontradiksi internal tentang bias MCAR (F2), satu contoh duplikat yang tidak ada di data (F3), satu rumus yang salah dimensi (F4), satu label band yang bertabrakan dengan tabel bandnya sendiri (F5), dan satu qualifier band yang ditempelkan pada item 28% (F6). Semua perbaikan bersifat lokal (kalimat/angka/urutan langkah) — tidak ada yang menuntut desain ulang lesson. Catatan: DeepSeek melewatkan satu kesalahan hitungan (F25) dan sempat memvalidasinya sebagai "cocok" — sudah dikoreksi di atas.

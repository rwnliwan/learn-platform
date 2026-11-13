# MLF-M9.4: Sensitivity Analysis — Input Mana yang Paling Menggerakkan Jawabanmu?

## Masalah: VaR 0,0328 — tapi Seberapa Yakin Kamu pada Angka Itu?

Portofolio equal-weight BBCA/KLBF/UNVR punya VaR95 parametrik 0,0328 [M4.2]: dalam satu hari, dengan keyakinan 95%, kerugian tidak melebihi 3,28% nilai portofolio. Angka itu dihitung dari dua input — mean return harian μ_d −0,000558 dan simpangan baku harian σ_d 0,0196 — plus satu pilihan — tingkat keyakinan α = 95% (z = 1,645). Pertanyaan lesson ini bukan «berapa VaR-nya?» — itu sudah dijawab M4.2. Pertanyaannya: bila SATU input itu salah sedikit, VaR bergerak berapa? Bila vol naik 10%, apakah VaR naik 1% atau 10%? Bila korelasi antar-saham naik saat stress, apakah VaR ikut naik — dan seberapa besar? Jawaban atas pertanyaan-pertanyaan itulah SENSITIVITY ANALYSIS: peta tentang input mana yang paling menggerakkan jawabanmu.

Semua return di lesson ini adalah SIMPLE daily return (bukan log return): VaR parametrik M4.2 memakai simple return portofolio (n=480), dan σ_port 0,0196 dihitung dari matriks kovarians ketiga saham — konsisten dengan σ_d yang sama. Simulasi GBM di M9.1 memakai LOG return — jangan campur keduanya.

Angka acuan [m9_canonical.json]: VaR95 parametrik 0,0328; μ_d −0,000558 (dibulatkan −0,0006 di m9_canonical.json); σ_d 0,0196; matriks korelasi BBCA–KLBF 0,3488, BBCA–UNVR 0,2774, KLBF–UNVR 0,2897; σ_port dari matriks kovarians 0,0196 — sama dengan σ_d, jadi basisnya konsisten dari dua arah.

---

## 1. VaR 0,0328 — tapi Seberapa Yakin Kamu pada Angka Itu?

**Nilai:** sensitivity analysis adalah selisih antara «angka hasil model» dan «angka yang bisa dipertanggungjawabkan». Tanpa peta sensitivitas, semua input terlihat sama pentingnya — dan waktu validasi habis untuk mengukur hal yang tidak menggerakkan jawaban.

**Baik/buruk:** VaR 0,0328 itu bagus sebagai TITIK AWAL — ia direplikasi dari data dan konsisten dari dua arah (σ_d langsung 0,0196 = σ_port dari kovarians 0,0196). Buruk bila dibaca sebagai «jawaban» tanpa peta sensitivitasnya: VaR yang sama bisa menjadi 0,0296 atau 0,0390 hanya karena satu input bergerak 10% atau satu pilihan α berubah — dan komite yang hanya melihat 0,0328 tidak tahu itu.

**Mitigasi:** jangan pernah melaporkan satu angka hasil model tanpa satu baris sensitivitasnya: «VaR95 0,0328; naik 10% bila σ naik 10%; naik 18,8% bila α naik ke 97,5%». Lesson ini memberi baris itu — dan cara menghitungnya.

---

## 2. Tornado One-at-a-Time: Ubah Satu Input, Catat Berapa VaR Bergerak

**Definisi eksak:** SENSITIVITAS adalah turunan — atau beda hingga — output terhadap SATU input, dengan semua input lain ditahan tetap (one-at-a-time). Tornado chart adalah cara menyajikannya: tiap baris adalah satu input yang diganggu sebesar yang ditentukan, dan panjang barnya adalah perubahan output (ΔVaR95) terhadap basis. Basis [m9_canonical.json]: VaR95 parametrik 0,0328 (μ_d −0,000558, σ_d 0,0196, α = 95%, z = 1,645). Rumus yang dipakai: VaR95 = −(μ_d − z·σ_d) = −μ_d + z·σ_d.

**Nilai [m9_canonical.json] — tornado terurut dari |Δ| terbesar (nilai mutlak ΔVaR95):** α 95% → 97,5% (z 1,645 → 1,96) → VaR95 0,0390 (Δ +0,0062, +18,8%) — TERBESAR; σ +10% → 0,0361 (Δ +0,0032, +9,8%); σ −10% → 0,0296 (Δ −0,0032, −9,8%); korelasi +0,1 semua pasangan → 0,0347 (Δ +0,0019, +5,8%; σ_port naik 0,0196 → 0,0208 tak-bulat 0,020780 — memakai 0,0208 bulat memberi 0,0348, selisih 0,0001 murni pembulatan; kanonis memakai nilai tak-bulat — berbeda dari lab 1 yang memakai 0,0208 bulat; begitu juga persentase Δ-nya: +9,8% dihitung dari nilai tak-bulat [turunan] (0,036055/0,032828), bukan dari angka tampil 0,0361/0,0328 (yang memberi ≈ +10,1% — selisihnya pembulatan, bukan kesalahan)); μ +0,0005 → 0,0323 (Δ −0,0005, −1,5%); μ −0,0005 → 0,0333 (Δ +0,0005, +1,5%) — TERKECIL. Perhatikan simetrinya: σ ±10% memberi Δ yang sama besar (±0,0032) karena VaR linear dalam σ; μ ±0,0005 memberi Δ yang sama besar (±0,0005) karena VaR linear dalam μ — dengan tanda berlawanan: μ naik MENURUNKAN VaR.

**KENAPA α paling besar?** Karena α mengubah z — pengali ekor — dari 1,645 menjadi 1,96: z naik 19,1% (0,315/1,645), dan karena VaR didominasi suku z·σ_d (0,0322 dari total 0,0328), kenaikan z itu hampir sepenuhnya diteruskan ke VaR: +18,8%. α bukan «parameter statistik yang diestimasi dari data» — ia PILIHAN kebijakan (seberapa jauh ke ekor kamu mau melihat). Justru karena ia pilihan, dampaknya paling besar: mengganti α dari 95% ke 97,5% menggerakkan VaR lebih besar daripada kesalahan estimasi σ sebesar 10%. **KENAPA μ paling kecil?** Karena μ_d hanya −0,000558 — sekitar 1/35 dari σ_d 0,0196. VaR95 = 0,000558 + 1,645 × 0,0196: suku μ menyumbang 0,0006 dari 0,0328 (di bawah 2%). Menggeser μ sebesar 0,0005 — hampir sebesar μ itu sendiri — hanya menggeser VaR sebesar 0,0005. VaR didominasi σ, bukan μ — dan tornado membuktikannya dengan angka, bukan dengan intuisi.

**Baik/buruk:** tornado one-at-a-time bagus bila gangguan tiap input dipilih JUJUR — sebesar ketidakpastian input itu yang sebenarnya (σ ±10% adalah gangguan yang realistis untuk estimasi σ dari 480 hari; α 95→97,5% adalah pilihan kebijakan yang nyata). Buruk bila gangguannya dipilih supaya barnya terlihat besar atau kecil: tornado dengan gangguan yang dibuat-buat adalah grafik yang berbohong dengan sumbu yang benar. Dan buruk bila dibaca sebagai «μ tidak penting» — μ tidak penting DI TITIK INI (langkah 6).

**Mitigasi:** setiap kali kamu membaca tornado, tanyakan dua hal: (1) «gangguan sebesar ini realistis tidak untuk input itu?» dan (2) «apa yang TIDAK ditunjukkan tornado ini?» — jawabannya: interaksi antar-input (langkah 3) dan sensitivitas di titik lain (langkah 6).

---

## 3. Multi-way: Bila σ dan Korelasi Bergerak BERSAMA, Jumlahnya Tidak Berlaku

One-at-a-time menahan semua input lain tetap. Dunia nyata tidak begitu: saat stress, vol naik DAN korelasi naik bersamaan — korelasi naik saat stress [M4.5], dan stress VaR95 0,0431 [M4.5] adalah bukti bahwa gabungan keduanya jauh lebih besar dari basis. Multi-way sensitivity menggerakkan DUA input sekaligus dan membandingkan hasilnya dengan JUMLAH efek masing-masing sendiri. Selisih antara keduanya adalah INTERAKSI: bagian dari efek gabungan yang tidak bisa dijelaskan oleh penjumlahan efek sendiri-sendiri.

**Nilai [m9_canonical.json]:** σ +10% DAN korelasi +0,1 semua pasangan → VaR95 0,0382 (Δ +0,0053, +16,2%). Jumlah efek sendiri: σ +10% sendiri +9,8% dan korelasi +0,1 sendiri +5,8% — jumlahnya 15,6%. Efek gabungan 16,2% LEBIH BESAR 0,6 poin persen daripada jumlah bagiannya: interaksi +0,6 pp. Tuliskan dengan hati-hati: efek gabungan SEDIKIT lebih besar dari jumlah bagiannya — JANGAN klaim «jauh lebih besar». 0,6 poin persen di atas 15,6% adalah interaksi yang nyata tapi kecil: sekitar 4% dari efek gabungan. Kenapa ada interaksi sama sekali? Karena korelasi yang lebih tinggi membuat kenaikan σ tiap saham lebih banyak diteruskan ke σ_port — σ_port dari kovarians naik lebih dari sekadar 10% bila korelasinya ikut naik. (σ_port dengan korelasi +0,1 saja adalah 0,0208; dengan σ +10% pula, σ_port menjadi 0,0208 × 1,1 = 0,0229 — dan VaR95 = 0,000558 + 1,645 × 0,0229 = 0,0382.)

**Baik/buruk:** analisis multi-way bagus bila pasangan inputnya dipilih dari ALASAN EKONOMI — σ dan korelasi bergerak bersama saat stress [M4.5], jadi pasangan itu wajib diuji. Buruk bila pasangan dipilih acak dari semua kombinasi yang ada: dengan 5 input ada 10 pasangan, dan menguji semuanya tanpa alasan menghasilkan 10 angka yang tidak ada yang ditindaklanjuti. Buruk juga bila interaksi dibesar-besarkan: +0,6 pp adalah interaksi kecil — menuliskannya sebagai «efek gabungan JAUH lebih besar» adalah melebih-lebihkan bukti.

**Mitigasi:** untuk setiap model, tulis SATU skenario multi-way yang paling masuk akal secara ekonomi — di sini σ +10% dan korelasi +0,1 — dan laporkan efek gabungannya BERSAMA jumlah efek sendiri-sendiri, supaya pembaca melihat interaksinya sendiri: «gabungan 16,2% vs jumlah 15,6% — interaksi +0,6 pp». Jangan laporkan hanya angka gabungannya.

---

## 4. Sensitivitas Model Kredit: LGD dan Margin Menggerakkan Profit — Margin Paling Besar

Pindah dari VaR ke uang: model kredit flagship (GBM terkalibrasi, threshold 0,10, test 6.000 nasabah) menghasilkan profit +NT$8.214.000 [M6.4]. Dua input bisnis menggerakkan profit itu: LGD (loss given default — berapa persen dari limit yang hilang bila nasabah default) dan margin (pendapatan bunga/marjin atas limit yang disetujui). Keduanya BUKAN parameter statistik — keduanya adalah input BISNIS: LGD adalah asumsi tentang seberapa besar kerugian saat default terjadi, margin adalah asumsi tentang harga kredit. Sensitivitasnya dihitung dengan cara yang sama seperti tornado: ubah satu input, tahan yang lain, catat profitnya.

**Nilai [m9_canonical.json] — threshold 0,10, n_approved 1.710, approval rate 28,5%, bad rate yang disetujui 6,67% (ketiganya TETAP di semua baris — LGD dan margin tidak mengubah SIAPA yang disetujui, hanya berapa uang yang dihasilkan tiap keputusan).** LGD → net profit: 0,40 → +NT$9.513.500; 0,45 → +NT$8.214.000; 0,50 → +NT$6.914.500; 0,60 → +NT$4.315.500. Tiap +0,05 LGD ≈ −NT$1.299.500 (9.513.500 − 8.214.000 = 1.299.500; 8.214.000 − 6.914.500 = 1.299.500; dan dari 0,50 ke 0,60: 6.914.500 − 4.315.500 = 2.599.000 = 2 × 1.299.500 — persis linear, karena kerugian = LGD × limit default yang tetap). Margin → net profit: 0,04 → +NT$4.232.100; 0,05 → +NT$8.214.000; 0,06 → +NT$12.195.900. Tiap +0,01 margin ≈ +NT$3.981.900 (8.214.000 − 4.232.100 = 3.981.900; 12.195.900 − 8.214.000 = 3.981.900 — juga linear, karena pendapatan = margin × limit non-default yang tetap).

**Kesimpulan yang harus dibaca dengan benar:** profit PALING sensitif terhadap margin (input bisnis), bukan terhadap parameter statistik. Bandingkan per 0,01 perubahan input: margin +0,01 menaikkan profit NT$3.981.900, sedangkan LGD +0,01 menurunkannya NT$259.900 (1.299.500 ÷ 5) — margin sekitar 15 kali lebih sensitif per satuan yang sama. Perbandingan yang jujur memakai satuan yang sama (0,01) — bukan membandingkan «+0,05 LGD» dengan «+0,01 margin» seolah keduanya setara. Dan threshold TIDAK dihitung ulang di sini — ekonomika threshold sudah dihitung di M6.4 dan hanya dirujuk: t=0,10 profit +NT$8.214.000; t=0,15 profit +NT$5.490.500; t=0,20 profit −NT$216.500 (profit BERBALIK negatif); t=0,50 profit −NT$18.994.456 [M6.4]. Threshold adalah tuas ketiga yang paling kuat — menaikkan threshold dari 0,10 ke 0,20 saja sudah membalik profit menjadi rugi — tapi ia sudah dibahas penuh di M6.4, jadi lesson ini tidak mengulang hitungannya.

**Baik/buruk:** analisis ini bagus bila LGD dan margin dibaca sebagai ASUMSI yang harus diuji — «dari mana angka LGD 0,45 ini? data recovery berapa tahun? margin 0,05 ini harga pasar atau harga internal?» Buruk bila keduanya dibaca sebagai konstanta alam: LGD 0,45 dan margin 0,05 adalah pilihan [notebook] — dan profit +NT$8.214.000 hanya setepat pilihan itu. Buruk juga bila sensitivitas kredit dibaca tanpa menyebut n_approved yang tetap (1.710): LGD/margin tidak mengubah keputusan persetujuan — yang mengubah keputusan adalah threshold [M6.4].

**Mitigasi:** laporkan profit SELALU bersama sensitivitas bisnisnya: «profit +NT$8.214.000 pada LGD 0,45 dan margin 0,05; tiap +0,05 LGD mengurangi profit NT$1.299.500; tiap +0,01 margin menambah profit NT$3.981.900». Dan bila komite bertanya «profitnya bisa negatif tidak?», jawab dengan threshold [M6.4]: ya — pada t=0,20 profit sudah −NT$216.500.

---

## 5. Sensitivitas vs Ketidakpastian: «Bila Input Salah Sekian» Bukan «Seberapa Salah Input Itu»

Dua kata yang sering dicampur — dan lesson ini memisahkannya dengan definisi eksak. **SENSITIVITAS** = «bila input salah sekian, output salah sekian»: turunan/beda hingga output terhadap satu input (langkah 2–4). Ia menjawab pertanyaan tentang MODEL: seberapa curam output merespons input. **KETIDAKPASTIAN** = «seberapa salah input itu»: sebaran estimator input itu — seberapa lebar pita di sekitar estimasi kita. Ia menjawab pertanyaan tentang DATA: seberapa besar estimasi kita bisa meleset. Keduanya dibutuhkan untuk keputusan — dan keduanya saja tidak cukup: kamu butuh sensitivitas untuk tahu input mana yang penting, DAN ketidakpastian untuk tahu seberapa salah input penting itu.

**Nilai — contoh dari angka yang sudah kamu kenal.** Sensitivitas: σ +10% menaikkan VaR95 sebesar +0,0032 (+9,8%) [m9_canonical.json]. Ketidakpastian: VaR95 historis punya CI95 bootstrap [0,0229; 0,0322] (iid, B=10.000, n=480) [M9.5] — pita selebar 0,0093 di sekitar titik estimasi historis 0,0286 (mean bootstrap 0,0284). Bad rate yang disetujui 6,67% punya CI95 [5,47%; 7,85%] [M8.1] — pita selebar 2,38 poin persen. Bacalah keduanya bersama: σ adalah input yang SENSITIF (langkah 2) — dan estimasi σ dari 480 hari punya ketidakpastian samplingnya sendiri. Sebaliknya μ adalah input yang TIDAK SENSITIF (langkah 2) — jadi ketidakpastian μ yang besar pun tidak terlalu menggerakkan VaR. Aturan praktisnya: kalikan keduanya — input yang sensitif DAN tidak pasti adalah yang wajib diselidiki; input yang tidak sensitif boleh tidak pasti; input yang sensitif tapi pasti (α — pilihan, bukan estimasi) wajib DIPUTUSKAN secara eksplisit, bukan dibiarkan implisit.

Satu peringatan tentang CI VaR95 [0,0229; 0,0322] [M9.5]: interval itu adalah CI untuk VaR95 HISTORIS (0,0286) — bukan untuk VaR95 parametrik 0,0328 yang menjadi basis lesson ini. Jangan tempelkan CI itu pada 0,0328 seolah keduanya estimasi yang sama: keduanya mengestimasi besaran yang berbeda (historis vs parametrik), dan CI bootstrap-nya dihitung atas estimator historis. Yang DIBAHAS PENUH di M9.5 adalah konstruksi CI itu (iid vs block bootstrap) — di sini ia hanya dirujuk sebagai contoh ketidakpastian, bukan dihitung ulang.

**Baik/buruk:** analisis yang hanya melaporkan sensitivitas (tanpa CI) bagus sebagai PETA — tapi buruk sebagai KEPUTUSAN: ia memberitahu «bila σ salah 10%, VaR salah 9,8%» tanpa memberitahu «seberapa mungkin σ salah 10%». Sebaliknya analisis yang hanya melaporkan CI (tanpa sensitivitas) bagus sebagai UKURAN — tapi buruk sebagai ARAHAN: ia memberitahu «VaR punya pita 0,0093» tanpa memberitahu input mana yang harus diperbaiki untuk mempersempit pita itu.

**Mitigasi:** setiap laporan sensitivitas tutup dengan satu baris ketidakpastian untuk input yang paling sensitif: «σ +10% → VaR +9,8%; estimasi σ dari 480 hari [M9.5 membahas CI-nya]». Dan setiap laporan CI tutup dengan satu baris sensitivitas: «CI VaR95 [0,0229; 0,0322]; pendorong utama lebar pita ini adalah σ (langkah 2)».

---

## 6. Jebakan: Sensitivitas LOKAL (di Satu Titik) vs Global — dan Tornado yang Menyembunyikan Interaksi

Semua angka tornado di langkah 2 adalah sensitivitas LOKAL: turunan di SATU titik — basis (μ_d −0,000558, σ_d 0,0196, α = 95%). Kata «lokal» di sini punya arti yang tajam: sensitivitas di titik itu BELUM TENTU sama di titik lain. Contohnya μ — dan contoh ini justru menunjukkan batasnya: di titik ini μ «tidak sensitif» (Δ 1,5% untuk gangguan 0,0005) — karena μ_d hanya −0,000558, sekitar 1/35 dari σ_d. Tapi bayangkan portofolio lain — atau periode lain — di mana μ_d = −0,005 (return rata-rata negatif 0,5% per hari, sekitar sembilan kali lipat): suku μ kini menyumbang 0,005 dari VaR 0,0372 — porsinya naik dari 1,7% menjadi 13,4% — TAPI sensitivitasnya TIDAK naik: VaR95 = −μ_d + 1,645·σ_d LINEAR dalam μ, jadi dVaR/dμ = −1 konstan, dan menggeser μ sebesar 0,0005 tetap menggeser VaR sebesar 0,0005 — sama persis seperti di titik basis; secara relatif justru TURUN dari 1,52% menjadi 1,34% [turunan], karena VaR totalnya lebih besar. Yang naik di titik itu hanya PORSI suku μ, bukan sensitivitasnya. Jadi «μ tidak sensitif» di titik ini tetap «tidak sensitif» di titik itu — tornado tidak berbohong, ia hanya diam tentang titik lain, dan contoh μ ini membuktikan bahwa porsi yang naik bukan bukti sensitivitas yang naik.

Sensitivitas GLOBAL adalah jawabannya: bukan turunan di satu titik, melainkan rata-rata sensitivitas di SELURUH rentang input yang masuk akal — atau setidaknya di beberapa titik (skenario). Lesson ini tidak menghitung sensitivitas global penuh (itu butuh simulasi atas seluruh ruang input — lihat M9.1 untuk mesinnya), tapi mengajarkan ATURANNYA: bila kesimpulanmu («μ tidak penting») bergantung pada nilai titik basis, ujilah kesimpulan itu di titik lain sebelum menulisnya sebagai vonis. Satu titik tambahan yang murah: hitung tornado yang sama pada basis stress — σ_d yang lebih besar, korelasi yang lebih tinggi [M4.5] — dan lihat apakah rankingnya bertahan. Bila ranking berubah, laporanmu harus menulis DUA ranking, bukan satu.

Jebakan kedua: tornado one-at-a-time MENYEMBUNYIKAN interaksi — secara konstruksi. Tornado menggerakkan satu input sementara yang lain ditahan — jadi interaksi (langkah 3) tidak pernah muncul di gambarnya. Pembaca tornado yang tidak membaca langkah 3 akan menyimpulkan «σ +10% menaikkan VaR 9,8%» dan berhenti di situ — padahal bila korelasi ikut naik, jawabannya 16,2%. Tornado bukan gambar yang salah; ia gambar yang TIDAK LENGKAP. Selalu pasangkan tornado dengan minimal satu skenario multi-way (langkah 3).

**Nilai:** membedakan lokal vs global bagus karena ia mengubah tornado dari vonis menjadi HIPOTESIS: «di titik ini, urutannya begini — dan inilah yang harus dicek sebelum menggeneralisasi». Itu sikap yang benar terhadap alat yang kuat tapi sempit.

**Baik/buruk:** sensitivitas lokal bagus bila titik basisnya adalah titik KEPUTUSAN — titik di mana model benar-benar dipakai (di sini basis 0,0328 adalah VaR yang dilaporkan). Buruk bila titik basisnya dipilih karena nyaman — mis. titik di mana model terlihat paling stabil. Dan buruk bila laporan hanya berisi tornado tanpa satu pun skenario multi-way: itu laporan yang menyembunyikan interaksi dengan diam.

**Mitigasi:** di bawah setiap tornado, tulis dua baris: (1) «sensitivitas ini lokal di titik basis (μ_d −0,000558, σ_d 0,0196, α = 95%) — ranking bisa berbeda di titik lain»; (2) «skenario multi-way: σ +10% dan korelasi +0,1 → +16,2% (interaksi +0,6 pp) — lihat langkah 3». Dua baris itu yang membedakan tornado yang jujur dari tornado yang menyesatkan.

---

## 7. Mini-case: Komite Tanya «VaR Naik Berapa bila Vol Naik 20%?»

Komite risiko bertanya — dan pertanyaannya persis seperti yang akan kamu dengar di pekerjaan nyata: «Vol naik 20% minggu ini. VaR kita naik berapa?» Di atas mejamu ada tornado langkah 2: σ +10% menaikkan VaR95 sebesar +0,0032 (+9,8%). Godaan terbesar di ruangan itu: menjawab «kira-kira dua kali efek 10% — jadi naik sekitar 0,0064, VaR sekitar 0,0392». JANGAN menjawab begitu. Bukan karena angkanya jauh salah — di kasus ini angkanya HAMPIR sama (0,0392 vs 0,0393 eksak — selisih 0,0001, murni pembulatan Δ tornado; lihat bawah) — melainkan karena METODENYA tidak bisa dipertanggungjawabkan: interpolasi linear dari tornado hanya benar bila output linear dalam input itu DI SELURUH rentang — dan kamu belum membuktikannya. Metode yang benar: hitung ulang dari rumus.

**Hitungan eksak:** σ_d tak-bulat 0,0196172; σ × 1,2 = 0,0235406. VaR95 = −(μ_d − 1,645 × σ_baru) = 0,000558 + 1,645 × 0,0235406 = 0,000558 + 0,0387243 = 0,0392824 ≈ 0,0393. Kenaikan vs basis: 0,0392824 − 0,0328284 = +0,0064540 ≈ +0,0065 (+19,7%). (Memakai σ_d kanonis bulat 0,0196 memberi 0,0392 — selisih 0,0001 yang murni pembulatan, bukan kesalahan — dan itulah angka yang keluar dari interpolasi di bawah.) Jawaban untuk komite: «VaR95 naik dari 0,0328 menjadi 0,0393 — naik 0,0065, atau 19,7% — bila HANYA vol yang naik 20% dan korelasi tidak berubah.» Kalimat terakhir itu wajib: bila korelasi ikut naik saat stress [M4.5], jawaban 0,0393 MEREMEHKAN — skenario multi-way langkah 3 menunjukkan arahnya.

Kenapa interpolasi «2 × efek 10%» HAMPIR memberi angka yang sama di sini? Karena VaR parametrik LINEAR dalam σ: VaR95 = −μ_d + 1,645·σ_d — menggandakan Δσ menggandakan ΔVaR, persis — BILA Δ-nya tak-bulat: 2 × 0,0032270 = 0,0064540; 0,0328284 + 0,0064540 = 0,0392824 = 0,0393 eksak. Yang kamu lihat di tornado adalah Δ yang SUDAH DIBULATKAN (0,0032): 2 × 0,0032 = 0,0064; 0,0328 + 0,0064 = 0,0392 — selisih 0,0001 dari 0,0393, murni pembulatan. Jadi interpolasi di sini «berhasil» sampai 3 desimal — dan meleset di desimal ke-4 — BUKAN karena linearitasnya salah, melainkan karena kamu menginterpolasi angka yang sudah dibulatkan. Linearitas inilah yang membuat interpolasi hampir berhasil DI KASUS INI — dan hanya di kasus ini. Interpolasi yang sama GAGAL pada α (efek z tidak linear: langkah 5 pp dari 90% ke 95% memberi Δz 0,363, langkah 2,5 pp dari 95% ke 97,5% memberi Δz 0,315 — per pp, ekor naik lebih cepat: 0,073 vs 0,126 per pp) dan GAGAL bila dua input bergerak bersama (langkah 3: interaksi +0,6 pp tidak tertangkap interpolasi satu input). Aturan umumnya: interpolasi dari tornado adalah TEBAKAN yang kadang benar — hitung ulang dari rumus adalah JAWABAN. Di depan komite, berikan jawaban.

**Nilai:** mini-case ini bagus karena ia mengajarkan perbedaan antara «angka yang benar» dan «cara yang benar»: jawaban 0,0392 yang didapat dari interpolasi dan jawaban 0,0393 yang didapat dari rumus HAMPIR sama (selisih 0,0001, murni pembulatan Δ tornado) — tapi NILAI BUKTI keduanya berbeda. Yang pertama runtuh bila ditanya «kenapa dua kali?»; yang kedua bertahan karena rumusnya tertulis.

**Baik/buruk:** jawaban «0,0393, naik 19,7%, bila hanya vol yang naik» bagus — ia eksak, bersyarat, dan bisa diaudit. Buruk bila syaratnya hilang («VaR naik 19,7%») — tanpa «bila hanya vol yang naik», komite akan memakai 0,0393 untuk skenario stress di mana korelasi juga naik, dan angka itu akan meremehkan. Buruk juga bila jawabannya «kira-kira dua kali» — «kira-kira» bukan bahasa komite risiko.

**Mitigasi:** setiap kali kamu tergoda menginterpolasi dari tornado, tulis rumusnya dan hitung ulang — butuh satu baris. Dan setiap jawaban sensitivitas untuk komite akhiri dengan syaratnya: «bila hanya input ini yang bergerak; bila korelasi ikut naik, lihat skenario multi-way».

---

## 8. Lab 1: Tornado VaR — Hitung, Ranking, dan Interaksi

Hitung sendiri tornado langkah 2 dari rumus — dan buktikan rankingnya dengan mesin, bukan dengan mata. Basis [m9_canonical.json]: μ_d kanonis dibulatkan 4 desimal menjadi −0,0006 (nilai tak-bulat −0,000558); σ_d 0,0196; z 1,645 untuk α = 95% dan 1,96 untuk α = 97,5%; σ_port dengan korelasi +0,1 semua pasangan adalah 0,0208. Lab ini memakai μ_d = −0,0006 — nilai bulat kanonis — sehingga semua angka 4-desimalnya mereproduksi tabel kanonis; satu pengecualian dijelaskan di bawah.

**Hasil yang diharapkan [lab]:** var95_base=0.0328; var95_alpha=0.0390; var95_sigma_plus10=0.0361; var95_sigma_minus10=0.0296; var95_corr_plus01=0.0348; var95_multi=0.0382; var95_mu_plus=0.0323; var95_mu_minus=0.0333; ranking[0]='alpha_97.5'; interaksi_pp=0.6. Dua catatan pembulatan — baca sebelum bertanya. PERTAMA: var95_corr_plus01 lab adalah 0,0348, sedangkan kanonis [m9_canonical.json] 0,0347 — selisih 0,0001 karena lab memakai σ_port 0,0208 yang sudah dibulatkan 4 desimal (nilai tak-bulatnya sekitar 0,02073). Ranking TIDAK berubah: korelasi tetap di bawah σ +10% (0,0361) dan di atas μ (0,0333). KEDUA: interaksi dihitung dari persentase lab (multi 16,4% vs jumlah 9,8% + 6,0% = 15,8%) ≈ 0,6 pp — sama dengan interaksi kanonis +0,6 pp (16,2% vs 15,6%) — selisihnya murni pembulatan σ korelasi yang sama.

**Nilai:** lab ini bagus karena ia memaksa tanganmu menghitung — bukan matamu menebak. Ranking yang dihitung mesin tidak bisa dinegosiasikan sesudah melihat hasilnya.

**Baik/buruk:** lab bagus bila checks-nya mengikat angka kanonis (var95_sigma_plus10 ≈ 0,0361, tol 0,0005; ranking[0] == "alpha_97.5"). Buruk bila lab hanya meminta «tampilkan tornado» tanpa angka yang diperiksa — tanpa checks, lab adalah latihan mengetik.

**Mitigasi:** bandingkan ranking lab dengan tornado langkah 2 — hati-hati, konvensinya BERBEDA: ranking lab terurut dari ΔVaR95 bertanda terbesar (signed Δ), sedangkan tornado langkah 2 terurut dari |Δ| terbesar. Karena itu σ −10% (Δ −0,0032) berada di peringkat TERAKHIR di ranking lab, padahal di tornado langkah 2 ia peringkat 3 (|Δ| 0,0032). Urutan ranking lab: α 97,5% di puncak (Δ +0,0062), lalu multi-way (Δ +0,0053), σ +10% (Δ +0,0032), korelasi +0,1 (Δ +0,0019), μ −0,0005 (Δ +0,0005), μ +0,0005 (Δ −0,0005), σ −10% (Δ −0,0032). Perhatikan bahwa multi-way berada di peringkat KEDUA — di atas efek σ sendiri: bila komite hanya membaca tornado one-at-a-time, mereka tidak akan pernah melihat baris kedua itu.

---

## 9. Lab 2: LGD dan Margin Menggerakkan Profit — Hitung dari Agregat Kanonis

Lab kedua menghitung sensitivitas profit kredit dari RUMUS dengan agregat kanonis — bukan dari 6.000 probabilitas (lab Pyodide tidak memuat data sebesar itu). Agregatnya [m8_canonical.json m8_tiering]: total LIMIT yang disetujui APPROVED_LIMIT = NT$424.180.000; total LIMIT nasabah default yang disetujui DEFAULT_LIMIT = NT$25.990.000 [turunan: realised_loss_approved_NT 11.695.500 ÷ LGD 0,45]; LIMIT nasabah non-default yang disetujui = 424.180.000 − 25.990.000 = NT$398.190.000 [turunan]. Rumusnya: net profit = margin × LIMIT non-default − LGD × LIMIT default. Periksa basisnya: 0,05 × 398.190.000 − 0,45 × 25.990.000 = 19.909.500 − 11.695.500 = NT$8.214.000 — sama dengan profit kanonis [M6.4]. n_approved 1.710, approval rate 28,5%, dan bad rate 6,67% TETAP di semua baris — LGD/margin tidak mengubah siapa yang disetujui.

**Hasil yang diharapkan [lab]:** net_lgd_040=9513500; net_lgd_045=8214000; net_lgd_050=6914500; net_lgd_060=4315500; net_margin_004=4232100; net_margin_005=8214000; net_margin_006=12195900; delta_lgd_per_005=-1299500; delta_margin_per_001=3981900; margin_paling_sensitif=True. Perhatikan baris terakhir: perbandingan memakai SATUAN YANG SAMA (per 0,01): margin +0,01 → +NT$3.981.900, LGD +0,01 → −NT$259.900 (1.299.500 ÷ 5) — margin sekitar 15 kali lebih sensitif per satuan yang sama. Itulah kesimpulan langkah 4, kini dihitung sendiri.

**Nilai:** lab ini bagus karena ia membuktikan rumus agregatnya mereproduksi SEMUA angka kanonis LGD/margin — bukan satu titik saja. Rumus yang mereproduksi 7 titik adalah rumus yang benar.

**Baik/buruk:** lab bagus bila agregatnya dilabeli sumbernya ([m8_canonical.json m8_tiering] dan [turunan] untuk DEFAULT_LIMIT) — pembaca tahu persis dari mana tiap angka datang. Buruk bila agregatnya muncul tanpa sumber: angka tanpa sumber adalah angka yang tidak bisa diaudit.

**Mitigasi:** setelah lab jalan, tanyakan pada dirimu: input bisnis mana yang harus dinegosiasikan paling keras? Margin — karena tiap 0,01 margin bernilai NT$3.981.900 profit, sementara tiap 0,01 LGD hanya «bernilai» NT$259.900. Dan ingat batas lab ini: rumus ini mengasumsikan LIMIT default dan non-default TETAP saat LGD/margin berubah — benar di sini karena LGD/margin tidak mengubah keputusan persetujuan (threshold 0,10 tetap) — tapi tidak benar bila threshold ikut berubah [M6.4].

---

## 10. Figure 1: Tornado Chart — ΔVaR95 Terurut dari yang Terbesar

Gambar ini adalah tornado langkah 2 — angka yang sama, dalam bentuk yang bisa dibaca sekilas. Tiap bar adalah ΔVaR95 terhadap basis 0,0328: bar ke kanan berarti VaR naik, bar ke kiri berarti VaR turun. Urutannya dari ΔVaR95 bertanda terbesar (bukan |Δ| — konvensi di sini berbeda dari tornado langkah 2 yang memakai |Δ| terbesar): α 95→97,5% (+0,0062, +18,8%), multi-way σ +10% dan korelasi +0,1 (+0,0053, +16,2%), σ +10% (+0,0032, +9,8%), korelasi +0,1 (+0,0019, +5,8%), μ −0,0005 (+0,0005, +1,5%), μ +0,0005 (−0,0005, −1,5%), σ −10% (−0,0032, −9,8%). Perhatikan dua hal di gambar: pertama, bar multi-way (peringkat 2) TIDAK berasal dari tornado one-at-a-time — ia sengaja dimasukkan supaya pembaca melihat efek gabungan di samping efek sendiri-sendiri; kedua, bar μ hampir tidak terlihat — dan itulah pesannya: di titik ini, μ nyaris tidak menggerakkan jawaban.

**Nilai:** tornado chart bagus karena ia mengubah tabel menjadi KEPUTUSAN: mata langsung jatuh ke bar terpanjang (α), lalu ke bar kedua (multi-way). Komite yang tidak membaca tabel pun membaca gambar ini dengan benar.

**Baik/buruk:** gambar ini bagus bila dibaca BERSAMA keterangannya — gangguan tiap input (α 95→97,5%; σ ±10%; korelasi +0,1; μ ±0,0005) tertulis di label, jadi pembaca tahu persis «gangguan sebesar apa» yang menghasilkan tiap bar. Buruk bila gambar ini dipotong dari keterangannya: bar tanpa ukuran gangguan adalah bar yang tidak bisa dinilai.

**Mitigasi:** bila kamu membuat tornado sendiri, selalu tulis ukuran gangguan di label tiap bar — dan selalu sertakan bar multi-way bila ada skenario gabungan yang masuk akal. Tornado tanpa gangguan tertulis adalah grafik yang berbohong dengan sumbu yang benar.

---

## 11. Figure 2: Profit vs LGD (Turun) dan Profit vs Margin (Naik) — Dua Garis, Satu Gambar

Gambar ini adalah sensitivitas kredit langkah 4 — dua garis dalam satu gambar, dengan skala profit yang SAMA di kedua panel. Skala profit yang sama SAJA tidak membuat kemiringannya bisa dibandingkan: sumbu-x kedua panel BERBEDA (LGD 0,40–0,60 di kiri, rentang 0,20; margin 0,04–0,06 di kanan, rentang 0,02) pada lebar panel yang sama — jadi kemiringan visual menyesatkan. Yang benar dari mata hanyalah Δprofit rentang-penuh: LGD 5,19 jt vs margin 7,97 jt [turunan] — visual ≈1,5×, BUKAN 15×. Angka 15× hanya datang dari hitungan per 0,01 (langkah 4: margin NT$3.981.900 vs LGD NT$259.900 per 0,01), bukan dari mata. Panel kiri: profit vs LGD — garis TURUN dari +NT$9.513.500 (LGD 0,40) ke +NT$4.315.500 (LGD 0,60), melewati basis +NT$8.214.000 (LGD 0,45). Panel kanan: profit vs margin — garis NAIK dari +NT$4.232.100 (margin 0,04) ke +NT$12.195.900 (margin 0,06), melewati basis yang sama +NT$8.214.000 (margin 0,05). Kedua garis bertemu di titik basis yang sama — karena keduanya mengukur profit yang sama, dari dua arah yang berbeda.

**Nilai:** dua panel dengan skala profit yang sama bagus karena ia membuat Δprofit rentang-penuh bisa dibandingkan dengan jujur (LGD 5,19 jt vs margin 7,97 jt [turunan] — ≈1,5×) — TAPI bukan kemiringannya: karena sumbu-x-nya berbeda (rentang LGD 0,20 vs margin 0,02), garis margin yang «terlihat jauh lebih curam» itu melebih-lebihkan perbandingan yang sebenarnya. Perbandingan 15× hanya benar dari angka per 0,01 (langkah 4: margin NT$3.981.900 vs LGD NT$259.900 per 0,01), bukan dari mata. Bila kedua panel memakai skala profit yang berbeda, bahkan Δprofit rentang-penuhnya pun tidak bisa dibandingkan — dan kesimpulannya akan salah.

**Baik/buruk:** gambar ini bagus bila dibaca dengan sumbu-x yang berbeda di tiap panel (LGD 0,40–0,60 di kiri; margin 0,04–0,06 di kanan) — dua input yang berbeda memang butuh dua sumbu-x yang berbeda, dan menyamakannya akan menyesatkan. Buruk bila pembaca membandingkan KEMIRINGAN visual seolah itu perbandingan sensitivitas: kemiringan visual TIDAK bermakna sebagai perbandingan sensitivitas — sumbu-x-nya berbeda, jadi yang terlihat «15× lebih curam» itu sebenarnya hanya ≈1,5× dalam Δprofit rentang-penuh. Skala profit (sumbu-y) yang disamakan hanya membuat Δprofit rentang-penuh bisa dibandingkan — perbandingan sensitivitas yang benar memakai angka per 0,01 (langkah 4), bukan mata.

**Mitigasi:** bila kamu menggambar dua sensitivitas dalam satu gambar, samakan SELALU skala sumbu output-nya (di sini profit NT$), dan beri label yang jelas pada tiap sumbu input-nya. Dan tulis kesimpulan perbandingannya dalam angka per satuan yang sama — bukan «garis ini terlihat lebih curam».

---

## 12. Melaporkan Sensitivitas: Basis, Gangguan, dan Batas — Tiga Baris yang Wajib Ada

Sensitivity analysis yang tidak dilaporkan dengan benar sama bahayanya dengan yang tidak dilakukan: angka yang benar tanpa konteksnya akan dibaca salah. Aturan pelaporan lesson ini [kebijakan lesson ini] — tiga baris yang wajib ada di setiap laporan sensitivitas: (1) BASIS: nilai basis output dan semua inputnya — «VaR95 0,0328 pada μ_d −0,000558, σ_d 0,0196, α = 95%» — tanpa basis, Δ tidak punya acuan; (2) GANGGUAN: ukuran gangguan tiap input dan alasannya — «σ ±10% (ketidakpastian estimasi dari 480 hari); α 95→97,5% (pilihan kebijakan); korelasi +0,1 (skenario stress [M4.5]); μ ±0,0005» — tanpa ukuran gangguan, ranking tornado tidak bisa dinilai; (3) BATAS: lokal vs global dan one-at-a-time vs multi-way — «sensitivitas ini lokal di titik basis; skenario multi-way σ +10% dan korelasi +0,1 memberi +16,2% (interaksi +0,6 pp)» — tanpa batas, pembaca akan menggeneralisasi yang tidak boleh digeneralisasi.

**Nilai:** tiga baris ini bagus karena ia membuat laporan sensitivitas bisa DIAUDIT: validator lain bisa mengambil basis dan gangguannya, menghitung ulang, dan mendapat angka yang sama — atau menemukan di mana ia berbeda. Laporan tanpa basis adalah klaim; laporan dengan basis adalah bukti.

**Baik/buruk:** laporan yang baik menulis ambang dan kriteria KEBIJAKAN dengan label [kebijakan lesson ini] — mis. «gangguan σ ±10% dipilih sebagai [kebijakan lesson ini]» — supaya pembaca tidak mengiranya konstanta alam. Buruk bila ambang kebijakan ditulis tanpa label: pembaca akan mengiranya hukum statistik. Dan buruk bila laporan mencampur satuan mata uang: «Rp» hanya untuk portofolio IDX, «NT$» hanya untuk kredit UCI — profit kredit lesson ini selalu NT$, tidak pernah Rp.

**Mitigasi:** sebelum mengirim laporan sensitivitas apa pun, cek tiga barisnya: basis tertulis? gangguan tertulis beserta alasannya? batas (lokal/global, one-at-a-time/multi-way) tertulis? Bila satu baris hilang, laporan belum siap dikirim — berapa pun benarnya angka di dalamnya.

---

## 13. Propagasi Ketidakpastian: Nested Bootstrap — Bila μ dan σ Sendiri Tidak Pasti

Tornado menjawab «bila input bergerak sekian, output bergerak sekian»; CI bootstrap menjawab «seberapa salah input itu». Yang belum diajarkan adalah MENGGABUNGKANNYA: nested bootstrap — resample data → estimasi ulang parameter → simulasi ulang → distribusi output.

**Nilai:** B_outer=500 resample iid dari 480 return, MC N=10.000 per resample [notebook]: VaR95 nested mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377], range [0,0260; 0,0414]. Lebar CI nested 0,0096 [turunan] — hampir sama dengan lebar CI bootstrap HS (M9.5: 0,0093 [turunan]); sd keduanya setuju dalam 0,0003 (0,0025 vs 0,0022) [turunan].

**Baik/buruk:** pisahkan DUA sumber variasi — param-only (analitik, tanpa simulasi ulang): mean 0,0329, sd 0,0026, CI95 [0,0286; 0,0384]; MC-only (parameter tetap): sd 0,0004 [notebook]. Nested 6,25× MC-only [turunan]; error MC hanya 2,56% dari varians total [turunan] — sekitar 97% ketidakpastian berasal dari DATA [turunan]. Satu keanehan: sd nested (0,0025) sedikit di bawah sd param-only (0,0026) — selisih 0,0001 [turunan] ≈ 1 SE noise estimasi dari 500 resample, bukan «simulasi mengurangi ketidakpastian» (teori: √(0,0026² + 0,0004²) = 0,0026 [turunan]).

**Mitigasi:** laporkan selalu tiga angka — VaR titik, sd param-only, sd MC-only. Nested bootstrap tidak menguji kebenaran model (itu tugas backtest M9.3 dan perbandingan generator M9.1 langkah 13).

---

## Rangkuman

- **Basis:** VaR95 parametrik 0,0328 (μ_d −0,000558 — dibulatkan −0,0006 di m9_canonical.json — σ_d 0,0196, α = 95%, z = 1,645; simple daily return portofolio equal-weight BBCA/KLBF/UNVR, n=480 [M4.2]; σ_port dari matriks kovarians 0,0196 — konsisten).
- **Tornado one-at-a-time [m9_canonical.json]:** α 95→97,5% → 0,0390 (+0,0062, +18,8%) TERBESAR; σ +10% → 0,0361 (+0,0032, +9,8%); σ −10% → 0,0296 (−0,0032, −9,8%); korelasi +0,1 → 0,0347 (+0,0019, +5,8%; σ_port 0,0196 → 0,0208); μ +0,0005 → 0,0323 (−0,0005, −1,5%); μ −0,0005 → 0,0333 (+0,0005, +1,5%) TERKECIL.
- **Kenapa rankingnya begitu:** α terbesar karena z naik 19,1% dan VaR didominasi suku z·σ_d; μ terkecil karena μ_d hanya −0,000558, sekitar 1/35 dari σ_d — VaR didominasi σ.
- **Multi-way:** σ +10% DAN korelasi +0,1 → 0,0382 (+0,0053, +16,2%) vs jumlah efek sendiri 15,6% — interaksi +0,6 pp: efek gabungan SEDIKIT lebih besar dari jumlah bagiannya; one-at-a-time meremehkan bila input bergerak bersama (korelasi naik saat stress [M4.5]; stress VaR95 0,0431 [M4.5]).
- **Kredit (threshold 0,10, test 6.000, n_approved 1.710, approval 28,5%, bad rate 6,67%):** LGD → net profit 0,40 → +NT$9.513.500; 0,45 → +NT$8.214.000; 0,50 → +NT$6.914.500; 0,60 → +NT$4.315.500 (tiap +0,05 LGD ≈ −NT$1.299.500); margin → net profit 0,04 → +NT$4.232.100; 0,05 → +NT$8.214.000; 0,06 → +NT$12.195.900 (tiap +0,01 margin ≈ +NT$3.981.900).
- **Per 0,01 yang sama, margin ~15× lebih sensitif daripada LGD** (NT$3.981.900 vs NT$259.900) — profit PALING sensitif terhadap margin, input bisnis, bukan parameter statistik.
- **Threshold dirujuk [M6.4], tidak dihitung ulang:** t=0,10 +NT$8.214.000; t=0,15 +NT$5.490.500; t=0,20 −NT$216.500; t=0,50 −NT$18.994.456 — menaikkan threshold 0,10 → 0,20 saja sudah membalik profit menjadi rugi.
- **Sensitivitas vs ketidakpastian:** sensitivitas = «bila input salah sekian, output salah sekian» (turunan/beda hingga terhadap SATU input); ketidakpastian = «seberapa salah input itu» (sebaran estimator) — VaR95 historis CI95 [0,0229; 0,0322] iid [M9.5]; bad rate CI95 [5,47%; 7,85%] [M8.1]. α paling sensitif (+18,8%) tapi ketidakpastiannya NOL — ia pilihan, bukan estimasi.
- **Jebakan:** sensitivitas LOKAL di satu titik — μ yang «tidak sensitif» di sini tetap tidak sensitif di titik lain (porsi suku μ-nya yang naik, bukan sensitivitasnya — langkah 6); tornado one-at-a-time menyembunyikan interaksi.
- **Mini-case:** σ × 1,2 = 0,02354 → VaR95 = 0,000558 + 1,645 × 0,02354 = 0,0393 (+0,0065, +19,7% vs basis) — hitung eksak, jangan interpolasi «2 × efek 10%» (angkanya HAMPIR sama — 0,0392 vs 0,0393, selisih 0,0001 murni pembulatan Δ tornado — karena VaR linear dalam σ; metodenya gagal pada α dan pada input yang bergerak bersama).
- **Lab:** tornado VaR (var95_alpha 0,0390, ranking[0] alpha_97.5, interaksi +0,6 pp) dan profit kredit (net_lgd_040 NT$9.513.500, net_margin_006 NT$12.195.900, margin_paling_sensitif True).
- **Pelaporan [kebijakan lesson ini]:** tiga baris wajib — basis, gangguan beserta alasannya, batas (lokal/global, one-at-a-time/multi-way); «Rp» hanya untuk portofolio IDX, «NT$» hanya untuk kredit UCI.
- **Propagasi ketidakpastian (langkah 13) [notebook]:** nested bootstrap B_outer=500 → MC N=10.000 — VaR95 mean 0,0324, sd 0,0025, CI95 [0,0281; 0,0377]; param-only sd 0,0026, MC-only sd 0,0004.
- **Dekomposisi varians [turunan]:** error MC hanya 2,56% dari varians total (nested 6,25× MC-only) — ketidakpastian didominasi data, bukan simulasi; sd nested 0,0025 vs param-only 0,0026 selisih 0,0001 ≈ noise estimasi.

**Lanjut: MLF-M9.5 — Historical Simulation & Bootstrap** (`/v2/learn/mlf-m95-historical-simulation-bootstrap`).

---

## Guided Task di Colab

Notebook `mlf-m94-guided-task.ipynb` mereplikasi semua angka kanonis lesson ini dari agregat kanonis: tornado VaR + ranking, multi-way dan interaksi, sensitivitas profit LGD/margin dari agregat limit, mini-case σ × 1,2, dan rangkuman sensitivitas vs ketidakpastian.

Tautan Colab: https://colab.research.google.com/drive/1a7Q3brOC8dSNj1-dILVyx60wHcnuK3NL

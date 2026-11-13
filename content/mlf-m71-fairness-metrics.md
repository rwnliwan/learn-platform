# MLF-M7.1: Fairness Metrics — Ketika Model yang Sama Memperlakukan Grup Berbeda

## Masalah: Dua Nasabah, Satu Skor, Dua Vonis

Dua nasabah. Keduanya 35 tahun, limit sama, riwayat bayar sama persis — satu-satunya yang membedakan mereka: kolom jenis kelamin di data. Yang satu disetujui pinjamannya, yang satu ditolak. Model MEMAKAI kolom itu sebagai fitur [notebook]: koefisien LR SEX −0,0626, SHAP GBM 0,0314 — bobotnya kecil, tapi bukan nol. Dan itu bukan satu-satunya jalur: model juga membedakan kedua grup lewat fitur-fitur lain yang berkorelasi dengan grup — limit, pola bayar, tagihan. Bila ketidakadilan bisa masuk lewat kolom sensitif itu sendiri MAUPUN lewat proxy-nya, bagaimana kamu mengukurnya? Jawabannya, di data ini: ya — dan kamu bisa mengukurnya.

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan = GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Approval = probabilitas default prediksi DI BAWAH threshold. ROC-AUC test: GBM mentah 0,7823, GBM terkalibrasi 0,7816. PR-AUC: GBM mentah 0,5597, GBM terkalibrasi 0,5558. Brier: GBM mentah 0,1342, GBM terkalibrasi 0,1345, ECE GBM terkalibrasi 0,0087. Semua angka fairness di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, metrik fairness dihitung di data evaluasi yang tidak dipakai untuk memilih model atau threshold (lihat M6.4 langkah 4).

---

## 1. Dua Nasabah, Satu Skor, Dua Vonis

**Nilai:** fairness metrics adalah SATU-SATUNYA cara menjawab «apakah model ini adil?» dengan angka, bukan dengan firasat. «Model tidak memakai kolom SEX» bukan bukti adil — buktinya adalah approval rate, TPR, FPR, dan kalibrasi PER GRUP, dihitung dan dilaporkan berdampingan. Tanpa angka per grup, ketidakadilan tidak terlihat — dan yang tidak terlihat tidak pernah diperbaiki.

**Baik/buruk:** model dengan ROC-AUC 0,7823 itu bagus sebagai ukuran ranking — tapi ROC-AUC keseluruhan TIDAK berkata apa-apa soal fairness. Model yang ranking-nya bagus bisa sekaligus menyetujui satu grup jauh lebih jarang, salah menolak nasabah baik dari satu grup jauh lebih sering, dan berbohong soal probabilitas di satu grup. Ketiganya terjadi di data ini dalam derajat yang berbeda.

**Mitigasi:** jangan pernah melaporkan metrik model HANYA secara keseluruhan. Setiap metrik yang penting — approval rate, TPR, FPR, PPV, ECE, Brier — laporkan juga PER GRUP (di sini: SEX, EDUCATION, AGE band), lengkap dengan n tiap grup. Bila satu grup n-nya kecil, laporkan n-nya dan tahan vonis.

---

## 2. Apa Itu Fairness

Fairness bukan satu definisi — ia satu KELUARGA definisi, dan tiap definisi menjawab pertanyaan yang berbeda. Semuanya memakai pola yang sama: bagi nasabah ke dalam GRUP menurut satu atribut (di sini SEX, EDUCATION, AGE band), lalu bandingkan OUTCOME model antar grup. Bila outcome-nya sama, model lolos definisi itu; bila berbeda jauh, model gagal definisi itu. «Outcome» itu bisa banyak hal — approval rate, TPR, FPR, PPV, atau kalibrasi — dan tiap pilihan menghasilkan jawaban yang berbeda.

Grup yang diperiksa di lesson ini [notebook]: SEX (laki-laki n = 2.402, perempuan n = 3.598 di test 6.000); EDUCATION (Pascasarjana n = 2.130, Universitas n = 2.774, SMA n = 1.014, Lainnya n = 82 — gabungan kode 0/4/5/6, yaitu «lainnya/tidak diketahui»); AGE band (di bawah 30 tahun n = 1.912; 30–39 n = 2.198; 40–49 n = 1.341; 50–59 n = 473; 60+ n = 76). Dua grup kecil itu — Lainnya n = 82 dan 60+ n = 76 — akan muncul lagi sebagai peringatan, karena angka dari 82 atau 76 orang sangat mudah berubah oleh segelintir orang.

Dataset UCI ini juga punya kolom MARRIAGE (status perkawinan) — dan flagship menyebutkannya dalam daftar audit fairness. Lesson ini TIDAK menghitung metrik per MARRIAGE: tiga variabel (SEX, EDUCATION, AGE) sudah cukup untuk mengajarkan kelima metrik, dan menambah variabel keempat hanya menambah tabel tanpa menambah konsep. Bila kamu mengaudit model sendiri, periksa juga MARRIAGE — polanya sama persis.

**Baik/buruk:** definisi fairness yang banyak itu bagus karena tiap definisi menangkap satu jenis kerugian yang berbeda — ditolak padahal layak (FPR), tidak tertangkap padahal default (TPR), probabilitas yang bohong (kalibrasi). Buruk bila kamu memilih definisi SETELAH melihat angka — «metrik ini angkanya bagus, pakai yang ini saja» adalah cherry-picking yang sama buruknya dengan memilih threshold di test (M6.4 langkah 4). Metrik primer ditetapkan SEBELUM melihat angka.

**Mitigasi:** sebelum menghitung apa pun, tulis tiga hal: (1) grup apa yang diperiksa, (2) outcome apa yang dibandingkan, (3) metrik PRIMER yang akan dipakai untuk vonis. Tulis ketiganya sebelum membuka angka — dan laporkan SEMUA metrik lain sebagai konteks, bukan sebagai pengganti vonis.

---

## 3. Demographic Parity: Apakah Approval-nya Sama Antar Grup?

Demographic parity (statistical parity): approval rate harus SAMA antar grup. Bila 30% perempuan disetujui, maka 30% laki-laki juga harus disetujui — tanpa peduli siapa yang sebenarnya default. Ini metrik tentang AKSES: siapa yang mendapat pinjaman, bukan siapa yang layak mendapatkannya.

$$\text{Demographic parity: } \mathbb{P}(\hat{Y} = \text{setuju} \mid A = a) = \mathbb{P}(\hat{Y} = \text{setuju} \mid A = b) \quad \text{untuk semua grup } a, b$$

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000: approval keseluruhan 28,5% (1.710 dari 6.000 disetujui). Per SEX: laki-laki 26,1% (628 dari 2.402 disetujui), perempuan 30,1% (1.082 dari 3.598 disetujui) — selisih 3,93 poin persen. Per EDUCATION: Pascasarjana 35,3% (752 dari 2.130), Universitas 25,2% (698 dari 2.774), SMA 20,9% (212 dari 1.014), Lainnya 58,5% (48 dari 82) — selisih terbesar 37,63 poin persen, dari SMA 20,9% sampai Lainnya 58,5%. Per AGE band: di bawah 30 tahun 26,6%, 30–39 tahun 33,1%, 40–49 tahun 27,0%, 50–59 tahun 20,3%, 60+ tahun 19,7% — selisih 13,38 poin persen.

**Gambar:** approval rate per grup — SEX laki-laki 26,1% dan perempuan 30,1%; EDUCATION Pascasarjana 35,3%, Universitas 25,2%, SMA 20,9%, Lainnya 58,5% (n = 82). SEX selisihnya kecil; EDUCATION selisihnya besar — tapi bar tertinggi (Lainnya 58,5%) berasal dari 82 orang saja, jadi jangan jadikan ia patokan. Approval keseluruhan 28,5%.

**Baik/buruk:** selisih SEX 3,93 poin persen itu KECIL dalam nilai absolut — dan AIR-nya 0,8693, di atas ambang four-fifths 0,8. Buruk bila dibaca sebagai «tidak ada masalah»: pada skala portofolio nyata (ratusan ribu nasabah), selisih sekecil ini menjadi ribuan orang. Selisih EDUCATION 37,63 poin persen itu BESAR — tapi sebagian besar didorong oleh grup Lainnya (n = 82, approval 58,5%): tanpa grup kecil itu, selisih terbesar tinggal 14,40 poin persen (Pascasarjana 35,3% vs SMA 20,9%).

**Mitigasi:** laporkan demographic parity BERSAMA n tiap grup dan base rate tiap grup. Approval yang tidak sama BELUM tentu berarti model tidak adil — bisa jadi base rate default tiap grup memang beda (SMA base rate 0,2574 vs Pascasarjana 0,1901 [notebook]). Demographic parity tidak pernah dibaca sendirian: ia selalu dipasangkan dengan AIR dan dengan metrik berbasis kesalahan.

---

## 4. AIR dan Four-Fifths Rule: 0,8 sebagai Garis Merah

AIR (adverse impact ratio, disparate impact ratio): approval rate grup TERENDAH dibagi approval rate grup TERTINGGI. AIR 1,0 berarti persis sama; AIR 0,5 berarti grup yang paling jarang disetujui hanya mendapat setengah peluang dibanding grup yang paling sering disetujui. Ambang yang dipakai luas adalah four-fifths rule: AIR DI BAWAH 0,80 berarti ada adverse impact — model di-flag dan wajib diselidiki. Aturan ini berasal dari pedoman ketenagakerjaan Amerika (EEOC, 1978) — ia KONVENSI, bukan hukum kredit dan bukan ambang statistik: ia tidak berkata «di bawah 0,8 pasti diskriminasi», melainkan «di bawah 0,8, jangan lewatkan begitu saja».

$$\mathrm{AIR} = \frac{\min_g \, \mathbb{P}(\hat{Y} = \text{setuju} \mid A = g)}{\max_g \, \mathbb{P}(\hat{Y} = \text{setuju} \mid A = g)}, \qquad \text{flag bila } \mathrm{AIR} < 0{,}80 \text{ (four-fifths rule)}$$

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000. SEX: approval laki-laki 0,2614 vs perempuan 0,3007 → AIR = 0,2614 / 0,3007 = 0,8693 — LOLOS four-fifths (di atas 0,80), tapi bukan 1,0: laki-laki disetujui 13,1% lebih jarang secara relatif. Catatan presisi: nilai 0,8694 pada deret threshold (langkah 10) dihitung dari rate tak dibulatkan — selisih 0,0001 dari 0,8693 murni pembulatan. EDUCATION: approval terendah SMA 0,2091, tertinggi Lainnya 0,5854 → AIR = 0,2091 / 0,5854 = 0,357 — FLAG, jauh di bawah 0,80. AGE band: terendah 60+ 0,1974, tertinggi 30–39 tahun 0,3312 → AIR = 0,1974 / 0,3312 = 0,596 — FLAG.

Uji ketahanan kedua flag itu — karena keduanya memakai grup kecil sebagai pembanding. EDUCATION tanpa Lainnya (n = 82): tertinggi berikutnya adalah Pascasarjana 0,3531, terendah tetap SMA 0,2091 → AIR = 0,2091 / 0,3531 = 0,592 — MASIH flag, jauh di bawah 0,80. Flag EDUCATION bukan artefak satu grup kecil: bahkan di antara tiga grup besar (n = 1.014 sampai 2.774), SMA disetujui jauh lebih jarang daripada Pascasarjana. Perbandingan berpasangan lain [notebook]: Universitas vs Pascasarjana 0,7125 (di bawah 0,80 — flag juga), SMA vs Universitas 0,8311 (lolos, tipis). AGE tanpa 60+ (n = 76): tertinggi tetap 30–39 tahun 0,3312, terendah berikutnya 50–59 tahun 0,2030 → AIR = 0,2030 / 0,3312 = 0,613 — MASIH flag. Dan di bawah 30 tahun vs 30–39 tahun: 0,8037 — lolos, tipis sekali (selisih 0,0037 dari ambang).

**Koreksi terhadap angka kunci lesson ini:** catatan pengunci menulis «EDUCATION Pascasarjana AIR 0,603 TERTANDA flag (n=82 kecil)». AIR Pascasarjana 0,6032 itu TERVERIFIKASI persis (0,3531 / 0,5854 = 0,6032) — tapi n = 82 itu BUKAN n Pascasarjana (n Pascasarjana = 2.130); n = 82 adalah n grup Lainnya, yang dipakai sebagai pembanding tertinggi dalam perhitungan AIR itu. Flag-nya benar, angka AIR-nya benar, atribusi n-nya yang keliru di catatan — dan lesson ini mencatat koreksi itu secara terbuka. Sebagai pembanding lintas lesson: di M2 (scorecard), AIR G4 perempuan/laki-laki 1,1502 — arah yang SAMA (perempuan lebih sering disetujui) dengan model dan definisi grup yang berbeda; konsistensi arah antar lesson, bukan kesamaan angka.

**Baik/buruk:** AIR bagus karena ia SATU angka yang bisa dibandingkan dengan SATU ambang (0,80) — mudah dilaporkan, mudah diaudit. Buruk bila dibaca tanpa menyebut pembandingnya: AIR EDUCATION 0,357 memakai Lainnya (n = 82) sebagai tertinggi — bila Lainnya dikeluarkan, AIR-nya 0,592; keduanya flag, tapi besarnya berbeda jauh. AIR yang dilaporkan tanpa menyebut grup tertinggi dan n-nya adalah angka yang tidak bisa diperiksa ulang.

**Mitigasi:** laporkan AIR SELALU dengan tiga pendamping: (1) approval rate tiap grup, (2) n tiap grup, (3) AIR robust tanpa grup kecil (n di bawah 100) — bila flag-nya hilang tanpa grup kecil, flag itu lemah; bila flag-nya bertahan (seperti di sini: 0,357 menjadi 0,592, tetap flag), flag itu kuat. Dan tetapkan ambang 0,80 SEBELUM melihat angka.

---

## 5. Equal Opportunity: TPR — Di Antara yang Default, Siapa yang Berhasil Ditangkap?

Equal opportunity: di antara nasabah yang BENAR-BENAR default, berapa fraksi yang berhasil ditangkap (ditolak) model — dan apakah fraksi itu sama antar grup? Ukurannya adalah TPR (true positive rate): TP / (TP + FN), dengan «positif» = default. TPR yang sama antar grup berarti model sama pandainya menangkap nasabah bermasalah di tiap grup.

$$\text{Equal opportunity: } \mathrm{TPR}_g = \mathbb{P}(\hat{Y} = \text{tolak} \mid Y = \text{default}, A = g) = \frac{\mathrm{TP}_g}{\mathrm{TP}_g + \mathrm{FN}_g} \text{ sama untuk semua grup } g$$

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000. SEX: TPR laki-laki 0,9251 (519 dari 561 nasabah laki-laki yang default berhasil ditangkap), perempuan 0,9060 (694 dari 766) — gap 0,0191, kecil. AGE band: TPR tertinggi 60+ 0,9565 (22 dari 23), terendah 40–49 tahun 0,9006 (281 dari 312) — spread 0,0559, kecil. EDUCATION: TPR Pascasarjana 0,9037 (366 dari 405), Universitas 0,9207 (604 dari 656), SMA 0,9195 (240 dari 261) — ketiganya rapat di 0,90–0,92. Lalu ada Lainnya: TPR 0,6000 — dan di sinilah n kecil berbicara: Lainnya hanya punya 5 nasabah yang default (TP 3, FN 2), jadi SATU nasabah pindah kelompok mengubah TPR-nya 20 poin persen (dari 0,6000 menjadi 0,8000). Spread EDUCATION 0,3207 itu hampir seluruhnya artefak 5 orang.

**Baik/buruk:** TPR SEX yang rapat (gap 0,0191) itu bagus — model sama pandainya menangkap default di kedua grup, dan angka itu didukung n yang besar (561 dan 766 nasabah default). TPR Lainnya 0,6000 itu buruk sebagai VONIS — bukan karena angkanya rendah, melainkan karena ia dihitung dari 5 orang: ia rumor, bukan bukti.

**Mitigasi:** untuk TPR, selalu laporkan JUMLAH nasabah default per grup (TP + FN) di samping TPR-nya. Aturan praktis di lesson ini: grup dengan nasabah default di bawah 30 orang TIDAK dipakai untuk vonis equal opportunity — angkanya dilaporkan, tapi dengan label «n terlalu kecil untuk vonis». Di data ini, Lainnya (5 nasabah default) dan 60+ (23 nasabah default) masuk kategori itu.

---

## 6. Equalized Odds: TPR dan FPR — Kedua Sisi Kesalahan Harus Sama

Equalized odds memeriksa KEDUA sisi: TPR harus sama antar grup DAN FPR (false positive rate) harus sama antar grup. FPR = FP / (FP + TN): di antara nasabah yang LANCAR, berapa fraksi yang SALAH ditolak. Di kredit, FPR adalah ukuran kerugian nasabah: nasabah baik yang ditolak kehilangan akses pinjaman. PPV (positive predictive value) = TP / (TP + FP) ikut dilaporkan: di antara yang ditolak, berapa fraksi yang benar-benar default.

$$\text{Equalized odds: } \mathrm{TPR}_g \text{ sama } \forall g \quad \text{DAN} \quad \mathrm{FPR}_g = \frac{\mathrm{FP}_g}{\mathrm{FP}_g + \mathrm{TN}_g} \text{ sama } \forall g$$

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000. SEX: FPR laki-laki 0,6817 (1.255 dari 1.841 nasabah laki-laki yang lancar salah ditolak), perempuan 0,6434 (1.822 dari 2.832) — gap 0,0383. FPR keseluruhan 0,6585 — sekitar dua pertiga (65,85%) nasabah LANCAR ditolak pada threshold 0,10 (harga dari threshold yang rendah, lihat M6.4). PPV laki-laki 0,2926 vs perempuan 0,2758 — gap 0,0168. EDUCATION: FPR Pascasarjana 0,5867, Universitas 0,6950, SMA 0,7463 — spread 0,3437 bila Lainnya (0,4026, n kecil) dihitung, dan 0,1596 di antara tiga grup besar saja (0,7463 − 0,5867). SMA adalah grup yang paling sering salah ditolak: 74,63% nasabah SMA yang lancar ditolak, lawan 58,67% pada Pascasarjana. PPV EDUCATION: Pascasarjana 0,2656, Universitas 0,2909, SMA 0,2993 — spread 0,2111 bila Lainnya (0,0882, n kecil) dihitung, dan hanya 0,0337 di antara tiga grup besar. AGE band: FPR spread 0,1478 (terendah 30–39 tahun 0,6057, tertinggi 50–59 tahun 0,7535); PPV spread 0,0822 (terendah 50–59 tahun 0,2785, tertinggi 60+ 0,3607, n kecil).

**Gambar:** TPR vs FPR per grup — SEX TPR laki-laki 0,93 dan perempuan 0,91, FPR 0,68 dan 0,64; EDUCATION TPR Pascasarjana 0,90, Universitas 0,92, SMA 0,92, FPR 0,59, 0,70, 0,75. TPR rapat di semua grup (0,90–0,93) — equal opportunity hampir lolos. FPR timpang di EDUCATION: SMA 0,75 vs Pascasarjana 0,59 — equalized odds gagal di sisi FPR. Grup Lainnya (n = 82) tidak digambar: TPR/FPR-nya rumor dari 5 nasabah default.

**Baik/buruk:** gap FPR SEX 0,0383 itu kecil — model salah menolak nasabah baik dengan frekuensi yang hampir sama di kedua grup. Gap FPR EDUCATION di antara tiga grup besar (0,1596) itu BESAR dan BUKAN artefak n kecil — SMA salah ditolak 74,63% vs Pascasarjana 58,67%, dengan n ribuan di tiap grup. Inilah temuan equalized odds yang paling kuat di lesson ini: bukan di SEX, melainkan di EDUCATION — dan ia sejalan dengan temuan AIR: grup yang paling jarang disetujui (SMA) juga yang paling sering salah ditolak.

**Mitigasi:** equalized odds dibaca sebagai PASANGAN (TPR gap, FPR gap) — jangan pernah laporkan satu tanpa yang lain. Bila TPR rapat tapi FPR timpang (seperti EDUCATION di sini), vonisnya spesifik: model menangkap default sama baiknya, tapi membebani satu grup dengan penolakan keliru yang jauh lebih banyak. Mitigasi modelnya adalah topik M7.2 — di sini tugasmu adalah mengukur dan menamai masalahnya dengan tepat.

---

## 7. Kalibrasi per Grup: Probabilitas yang Bohong di Satu Grup

Empat metrik sebelumnya mengukur KEPUTUSAN (disetujui/ditolak). Kalibrasi per grup mengukur PROBABILITASNYA: bila model berkata «peluang default 0,4» kepada nasabah dari satu grup, apakah sungguh 40 dari 100 nasabah grup itu yang default? ECE per grup dihitung dengan 10 bin DI DALAM grup itu saja (definisi yang sama seperti M6.4); Brier per grup = rata-rata kuadrat (probabilitas − label) di dalam grup. Model yang terkalibrasi baik secara keseluruhan (ECE 0,0087) bisa bohong di satu grup.

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), test 6.000. SEX: ECE laki-laki 0,0127 vs perempuan 0,0139 (gap 0,0012 — rapat); Brier laki-laki 0,1431 vs perempuan 0,1288 (gap 0,0143 — perempuan lebih baik, sejalan dengan base rate perempuan yang lebih rendah 0,2129 vs 0,2336). EDUCATION: ECE Pascasarjana 0,0210, Universitas 0,0100 (terbaik), SMA 0,0362, Lainnya 0,0455 (n = 82) — spread 0,0355; Brier Pascasarjana 0,1190, Universitas 0,1390, SMA 0,1609 (terburuk), Lainnya 0,0576 (n kecil, base rate rendah 0,0610 — Brier kecil karena hampir semua labelnya 0) — spread 0,1033. AGE band: ECE di bawah 30 tahun 0,0148; 30–39 tahun 0,0156; 40–49 tahun 0,0166; 50–59 tahun 0,0312; 60+ tahun 0,1208 — spread 0,1060, seluruhnya didorong 60+ (n = 76). Brier AGE: 60+ 0,1620 (terburuk), 30–39 tahun 0,1286 (terbaik).

Dua bin contoh dari reliability per grup SEX [notebook]. Perempuan, bin [0,4–0,5): n = 99, prediksi rata-rata 0,4436 vs tingkat aktual 0,3737 — selisih 0,0699, model MELEBIH-LEBIHKAN risiko perempuan di bin ini: dari 99 nasabah, yang benar-benar default 37 orang, sementara prediksinya menyiratkan sekitar 44 orang. Perempuan, bin [0,7–0,8): n = 159, prediksi 0,7398 vs aktual 0,7987 — selisih 0,0589 ke arah sebaliknya, model MEREMEHKAN risiko perempuan di ujung berisiko. Laki-laki, bin [0,1–0,2): n = 882, prediksi 0,1463 vs aktual 0,1599 — selisih 0,0136, kecil dan didukung n besar. Perempuan, bin [0,0–0,1): n = 1.082, prediksi 0,0665 vs aktual 0,0665 — selisih 0,0000, sempurna di bin terbesar. Kalibrasi perempuan bagus di bin besar, meleset di bin menengah — dan ECE 0,0139 merangkum keduanya menjadi satu angka yang menyembunyikan cerita itu.

**Gambar:** ECE per grup — SEX laki-laki 0,013 dan perempuan 0,014; EDUCATION Pascasarjana 0,021, Universitas 0,010, SMA 0,036, Lainnya 0,046; AGE di bawah 30 tahun 0,015, 30–39 tahun 0,016, 40–49 tahun 0,017, 50–59 tahun 0,031, 60+ 0,121; garis ECE keseluruhan 0,0087. SEX rapat. SMA 0,036 adalah yang terburuk di antara grup besar — grup yang sama yang paling jarang disetujui dan paling sering salah ditolak. Dua bar tertinggi (Lainnya 0,046 dan 60+ 0,121) berasal dari n = 82 dan n = 76 — jangan jadikan vonis.

**Baik/buruk:** ECE SEX yang rapat (0,0127 vs 0,0139) itu bagus — probabilitas model sama jujurnya di kedua grup. ECE SMA 0,0362 dan Brier SMA 0,1609 (terburuk di antara grup besar) itu buruk — grup yang sama yang paling jarang disetujui dan paling sering salah ditolak JUGA yang probabilitasnya paling tidak bisa dipercaya. Tiga metrik menunjuk grup yang sama: SMA. ECE 60+ 0,1208 itu buruk sebagai VONIS — n = 76, dan satu nasabah pindah bin mengubah tingkat aktual lebih dari 1 poin persen. Brier Lainnya 0,0576 yang «terbaik» itu menyesatkan — ia kecil karena base rate Lainnya 0,0610 (hampir semua lancar), bukan karena modelnya jujur di grup itu.

**Mitigasi:** kalibrasi per grup dibaca sebagai PASANGAN ECE + Brier + n — dan SELALU bersama reliability bins-nya. Bila ECE satu grup jauh lebih besar, jangan langsung kalibrasi ulang per grup (topik M7.2 — dan berisiko overfit pada grup kecil): pertama periksa apakah bin-bin besarnya yang meleset atau bin-bin kecilnya, lalu periksa apakah grup itu kekurangan data (n kecil) atau memang pola risikonya berbeda. Di data ini, SMA adalah kandidat pertama untuk penyelidikan lanjutan — bukan 60+, yang angkanya didominasi noise.

---

## 8. Impossibility: Tidak Bisa Puas Semua Sekaligus Bila Base Rate Beda

Bisakah model lolos SEMUA metrik sekaligus — demographic parity (approval sama), equalized odds (TPR dan FPR sama), DAN kalibrasi per grup (ECE kecil di semua grup)? Jawabannya adalah teorema impossibility (Kleinberg–Mullainathan–Raghavan, 2016; juga Chouldechova, 2017): bila base rate default BERBEDA antar grup, ketiga syarat itu TIDAK BISA dipenuhi sekaligus — kecuali dalam kasus degenerat (model sempurna, atau base rate sama). Ini bukan kekurangan data atau kekurangan tuning — ini matematika. Memilih metrik berarti memilih kerugian mana yang kamu terima.

$$\text{Bila } \mathbb{P}(Y=1 \mid A=a) \neq \mathbb{P}(Y=1 \mid A=b) \text{, maka demographic parity } + \text{ equalized odds } + \text{ kalibrasi per grup tidak bisa ketiganya sempurna.}$$

**Nilai [notebook]** — SEX adalah bukti numeriknya di data ini. Base rate: laki-laki 0,2336 vs perempuan 0,2129 — gap 0,0207, beda dan tidak bisa dihapus (ia sifat populasi, bukan sifat model). Dan keempat gap berikut TIDAK NOL sekaligus: approval gap 0,0393 (demographic parity gagal), TPR gap 0,0191 (equal opportunity gagal tipis), FPR gap 0,0383 (equalized odds gagal), PPV gap 0,0168. Bila kamu memaksa approval sama (demographic parity) dengan menggeser threshold laki-laki, TPR dan FPR-nya bergeser — dan PPV-nya ikut bergeser, karena PPV terkait dengan base rate lewat teorema Bayes: dengan TPR dan FPR yang sama persis pun, grup dengan base rate lebih tinggi akan punya PPV lebih tinggi. Di data ini: PPV laki-laki 0,2926 vs perempuan 0,2758 — selisih 0,0168 yang sebagian besar dijelaskan oleh base rate 0,2336 vs 0,2129, bukan oleh model yang «lebih bisa dipercaya» pada laki-laki.

Contoh tandingan yang membuktikan ini bukan soal data kecil: bayangkan dua grup dengan base rate 0,10 dan 0,30, dan model yang TPR dan FPR-nya SAMA PERSIS di kedua grup. PPV grup pertama dan kedua TETAP berbeda — karena dari 100 yang ditolak, fraksi yang benar-benar default bergantung pada berapa banyak default yang ada di populasi grup itu. [Ilustrasi: angka 0,10 dan 0,30 ini contoh hitung, bukan angka UCI — dipakai untuk menunjukkan mekanisme Bayes, bukan untuk mengklaim sesuatu tentang data.] Satu-satunya jalan keluar: ubah TPR/FPR per grup (threshold berbeda per grup — dan itu membuka masalah hukum dan etika baru, langkah 10), atau terima bahwa satu metrik harus dikorbankan.

**Baik/buruk:** impossibility itu bagus sebagai PEMBEBAS — ia mengakhiri pencarian model yang «adil di semua metrik» yang tidak pernah ada, dan memindahkan pekerjaan ke tempat yang benar: memilih metrik PRIMER secara eksplisit dan mempertanggungjawabkannya. Buruk bila dipakai sebagai ALASAN untuk tidak berbuat apa-apa — «toh tidak bisa sempurna, jadi tidak usah diukur». Yang benar: ukur semuanya, pilih satu sebagai primer, dan laporkan harga yang dibayar di metrik lain.

**Mitigasi:** di setiap laporan fairness, tulis SATU kalimat impossibility: «Base rate grup A 0,2336 vs grup B 0,2129, sehingga demographic parity, equalized odds, dan kalibrasi per grup tidak bisa sempurna sekaligus; metrik primer laporan ini adalah ___ , dan harga yang dibayar di metrik lain adalah ___ .» Bila laporan fairness tidak punya kalimat itu, ia belum jujur soal trade-off-nya.

---

## 9. Kapan Tiap Metrik yang Tepat: Peta Keputusan Sebelum Melihat Angka

Karena tidak semua metrik bisa lolos sekaligus, pekerjaanmu adalah MEMILIH — dan pilihan itu dibuat SEBELUM melihat angka, dari jenis kerugian yang paling penting dalam konteksmu. Peta keputusannya empat cabang. Cabang 1 — demographic parity + AIR: pakai bila yang dipertaruhkan adalah AKSES. Regulator, auditor, dan publik pertama-tama bertanya «siapa yang disetujui?» — dan AIR di bawah 0,80 adalah flag yang harus dijawab apa pun metrik lainmu. Di data ini, EDUCATION dan AGE memicu cabang ini. Cabang 2 — equal opportunity (TPR): pakai bila kerugian utamanya adalah default yang LOLOS — nasabah bermasalah yang disetujui dan merugikan bank. Di data ini TPR rapat (gap SEX 0,0191), jadi cabang ini lolos tanpa perdebatan.

Cabang 3 — equalized odds (TPR + FPR): pakai bila KEDUA jenis kesalahan sama pentingnya — menangkap default DAN tidak salah menolak nasabah baik. Ini metrik yang paling menuntut, dan di data ini ia gagal di EDUCATION lewat sisi FPR (SMA 0,7463 vs Pascasarjana 0,5867 di antara grup besar). Cabang 4 — kalibrasi per grup (ECE + Brier): pakai bila PROBABILITASNYA dipakai ke hilir — threshold keputusan, expected loss, harga, cadangan, atau pelaporan ke regulator. Bila probabilitas SMA bohong (ECE 0,0362, Brier 0,1609), maka expected loss dan harga untuk nasabah SMA juga bohong — walau ranking-nya benar.

**Nilai:** di data ini peta itu menunjuk SATU grup yang sama dari tiga arah: SMA. AIR EDUCATION flag (0,357; robust 0,592 tanpa Lainnya) — akses. FPR SMA 0,7463 vs Pascasarjana 0,5867 — penolakan keliru. ECE SMA 0,0362 dan Brier 0,1609 — kalibrasi terburuk di antara grup besar. Tiga metrik, satu grup, satu arah: SMA adalah prioritas penyelidikan pertama (M7.2: dari mana bias itu berasal — data, fitur, atau label?). SEX, sebaliknya, lolos di hampir semua metrik: AIR 0,8693 (lolos), TPR gap 0,0191, FPR gap 0,0383, ECE gap 0,0012 — «lolos» bukan berarti «nol»: approval gap 3,93 poin persen tetap dilaporkan dan dipantau.

**Baik/buruk:** peta empat cabang ini bagus karena ia mengubah «pilih metrik yang angkanya bagus» menjadi «pilih metrik dari kerugiannya» — keputusan yang bisa dipertahankan di depan auditor. Buruk bila dibaca sebagai «cukup satu metrik»: metrik primer adalah vonis, tapi metrik lain tetap dilaporkan sebagai konteks — laporan yang hanya menampilkan AIR tanpa TPR/FPR/kalibrasi menyembunyikan separuh cerita, sama seperti laporan yang hanya menampilkan ROC-AUC.

**Mitigasi:** tulis peta keputusanmu dalam SATU tabel sebelum menghitung: kolomnya metrik, metrik primer (ya/tidak), ambang (misal AIR 0,80), dan alasan (kerugian apa yang dilindungi). Di kredit ritel, rekomendasi default lesson ini: primer = AIR + equal opportunity (akses dan penangkapan default), konteks = equalized odds + kalibrasi per grup. Bila konteksmu berbeda (misal probabilitas dipakai untuk penetapan harga), primernya berubah — dan tabel itu yang menjelaskan kenapa.

---

## 10. Threshold Menggeser AIR — Tapi Bukan Obat Fairness

Godaan terakhir: bila AIR di threshold 0,10 kurang bagus, kenapa tidak geser saja threshold-nya sampai AIR membaik? Di data ini, godaan itu TERLIHAT berhasil. AIR SEX pada GBM terkalibrasi [notebook]: threshold 0,05 → 0,9183 (approval laki-laki 6,7% vs perempuan 7,3%); 0,10 → 0,8694 (26,1% vs 30,1%) — titik TERBURUK; 0,15 → 0,8906 (46,5% vs 52,2%); 0,20 → 0,9432 (62,9% vs 66,7%); 0,30 → 0,9526 (75,0% vs 78,7%); 0,50 → 0,9898 (87,5% vs 88,4%) — nyaris sempurna. Menaikkan threshold menaikkan approval kedua grup menuju 100% — dan bila semua orang disetujui, AIR-nya 1,0 secara mekanis. Fairness yang «diperbaiki» dengan menyetujui semua orang bukanlah fairness — itu penyerahan.

$$\mathrm{AIR}(t) = \frac{\min_g \, \mathbb{P}(\hat{p} < t \mid A = g)}{\max_g \, \mathbb{P}(\hat{p} < t \mid A = g)} \quad \xrightarrow[t \,\uparrow\,]{}\quad 1{,}0 \text{ secara mekanis (semua disetujui)}$$

**Nilai [notebook + M6.4]:** harga dari menggeser threshold itu dihitung di M6.4, dan ia mahal. Threshold 0,10 → approval 28,5%, bad rate 6,67%, net profit +NT$8.214.000. Threshold 0,50 → approval 88,05%, bad rate 15,96%, net profit −NT$18.994.456 — selisih NT$27.208.456, dari keputusan SATU angka. Threshold 0,20 (AIR SEX 0,9432, sudah jauh lebih baik dari 0,8694) → approval 65,13%, bad rate 11,13%, laba −NT$216.500 — masih rugi, walau tipis. Jadi: «memperbaiki» AIR dari 0,8694 menjadi 0,9432 dengan menggeser threshold ke 0,20 mengorbankan 8.214.000 − (−216.500) = NT$8.430.500 laba. Dan «memperbaiki» sampai 0,9898 di 0,50 mengorbankan NT$27.208.456. AIR yang dibeli dengan laba bukanlah perbaikan fairness — ia subsidi silang yang tidak tercatat.

Ada pula jalan yang lebih berbahaya: threshold BERBEDA per grup — misal threshold 0,08 untuk laki-laki dan 0,12 untuk perempuan, supaya approval-nya sama persis. Secara matematis ia «menyelesaikan» demographic parity; secara hukum dan etika ia disparate treatment — memperlakukan orang berbeda EXPLICIT karena grupnya — dan di banyak yurisdiksi ia dilarang untuk keputusan kredit. Lesson ini TIDAK merekomendasikan threshold per grup; ia mencatatnya sebagai opsi yang ada, dengan peringatan: bila kamu mempertimbangkannya, konsultasikan penasihat hukum dan regulator DULU, dan jangan pernah menyembunyikannya dari laporan (M7.2 membahas sumber bias dan mitigasi yang sah — reweighting, pengumpulan data, perbaikan fitur — tanpa threshold per grup).

**Baik/buruk:** tabel AIR per threshold itu bagus sebagai DIAGNOSIS — ia menunjukkan seberapa sensitif AIR terhadap threshold, dan bahwa AIR terburuk justru di threshold operasional 0,10. Buruk bila dibaca sebagai «naikkan threshold sampai AIR lolos» — threshold adalah keputusan bisnis dari biaya (M6.4: p* = 0,10 dari LGD 45% dan margin 5%), bukan tuas fairness. Fairness yang diperbaiki lewat threshold adalah fairness yang dibayar dari laba — dan bila harganya tidak ditulis berdampingan, itu bukan perbaikan, itu penyembunyian biaya.

**Mitigasi:** untuk setiap perubahan threshold yang diusulkan «demi fairness», laporkan TIGA angka berdampingan: (1) AIR sebelum vs sesudah, (2) approval rate dan bad rate sebelum vs sesudah, (3) net profit sebelum vs sesudah (M6.4). Bila seseorang hanya menyodorkan (1), tanyakan (2) dan (3) — dan bila (3)-nya negatif besar, yang dinegosiasi adalah constraint bisnisnya, bukan angkanya.

---

## Lab 1: AIR + Four-Fifths Rule dari Tabel Kanonis

Hitung AIR dari approval rate kanonis GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. SEX: laki-laki 0,2614, perempuan 0,3007. EDUCATION: Pascasarjana 0,3531, Universitas 0,2516, SMA 0,2091, Lainnya 0,5854 (n = 82). AIR = approval terendah / tertinggi; flag bila AIR di bawah 0,80.

Hasil [lab]: air_sex=0.8693; air_edu=0.3572; flag_sex=False; flag_edu=True; air_edu_robust=0.5922; flag_edu_robust=True. AIR SEX 0,8693 LOLOS four-fifths — tapi bukan 1,0, jadi «lolos» bukan «tidak ada gap». air_edu_robust (tanpa Lainnya, n = 82) = 0,5922 — MASIH flag: flag EDUCATION bukan artefak satu grup kecil.

## Lab 2: Gap TPR / FPR / PPV — Equal Opportunity dan Equalized Odds

Dari angka kanonis GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. SEX: TPR laki-laki 0,9251 vs perempuan 0,9060; FPR 0,6817 vs 0,6434; PPV 0,2926 vs 0,2758. EDUCATION: TPR Pascasarjana 0,9037, Universitas 0,9207, SMA 0,9195, Lainnya 0,6000 (n = 82, hanya 5 nasabah default); FPR Pascasarjana 0,5867, Universitas 0,6950, SMA 0,7463, Lainnya 0,4026.

Hasil [lab]: tpr_gap_sex=0.0191; fpr_gap_sex=0.0383; ppv_gap_sex=0.0168; tpr_spread_edu=0.3207; fpr_spread_edu=0.3437; worst_fpr_group_edu=SMA. tpr_spread_edu 0,3207 hampir seluruhnya didorong Lainnya (0,6000 dari 5 nasabah default) — sementara fpr_spread_edu 0,3437 juga didorong Lainnya di sisi bawah (0,4026), tapi FPR di antara tiga grup besar saja tetap timpang (0,5867–0,7463, spread 0,1596). Grup dengan FPR tertinggi adalah SMA — grup yang sama yang paling jarang disetujui di lab 1.

## Guided Task di Colab

Notebook: colab/mlf-m71-guided-task.ipynb — flagship GBM + GBM terkalibrasi, approval rate + AIR per SEX/EDUCATION/AGE, gap TPR/FPR/PPV, ECE + Brier per grup SEX, dan AIR SEX pada berbagai threshold. Tautan Colab: https://colab.research.google.com/drive/1h7ZqXA4IQjdiVjUwplAXb27BMl0KHpCJ

## Rangkuman

- Model keputusan: GBM terkalibrasi (Platt/sigmoid), threshold 0,10, test 6.000 [notebook]. ROC-AUC GBM mentah 0,7823 / PR-AUC 0,5597 — ranking bagus, tapi tidak berkata apa-apa soal fairness.
- Demographic parity [notebook]: approval keseluruhan 28,5%; SEX laki-laki 26,1% vs perempuan 30,1%; EDUCATION Pascasarjana 35,3%, Universitas 25,2%, SMA 20,9%, Lainnya 58,5% (n = 82); AGE 30–39 tahun 33,1% tertinggi, 60+ 19,7% terendah.
- AIR + four-fifths rule (ambang 0,80) [notebook]: SEX 0,8693 (lolos); EDUCATION 0,357 (FLAG — robust 0,592 tanpa Lainnya, tetap flag); AGE 0,596 (FLAG — robust 0,613 tanpa 60+, tetap flag). Koreksi catatan: n = 82 adalah grup Lainnya, bukan Pascasarjana (n = 2.130).
- Equal opportunity (TPR) [notebook]: SEX gap 0,0191 (0,9251 vs 0,9060); EDUCATION tiga grup besar rapat 0,9037–0,9207, Lainnya 0,6000 dari 5 nasabah default (rumor); AGE spread 0,0559.
- Equalized odds (TPR + FPR) [notebook]: FPR SEX gap 0,0383 (0,6817 vs 0,6434); FPR EDUCATION tiga grup besar 0,5867–0,7463 (SMA tertinggi); PPV SEX gap 0,0168 (0,2926 vs 0,2758).
- Kalibrasi per grup [notebook]: ECE SEX 0,0127 vs 0,0139; ECE EDUCATION Pascasarjana 0,0210, Universitas 0,0100, SMA 0,0362, Lainnya 0,0455 (n = 82); ECE AGE 60+ 0,1208 (n = 76 — rumor); Brier SMA 0,1609 terburuk di antara grup besar.
- Impossibility [notebook]: base rate SEX 0,2336 vs 0,2129 — demographic parity, equalized odds, dan kalibrasi per grup tidak bisa ketiganya sempurna sekaligus; pilih metrik primer SEBELUM melihat angka.
- Threshold [notebook]: AIR SEX 0,8694 di 0,10 → 0,9898 di 0,50 — tapi menaikkan threshold ke 0,50 merugikan NT$27.208.456 laba (M6.4); threshold bukan obat fairness.
- Lab: AIR SEX 0,8693, AIR EDUCATION 0,3572 (robust 0,5922, tetap flag); gap SEX TPR 0,0191 / FPR 0,0383 / PPV 0,0168; spread EDUCATION TPR 0,3207 / FPR 0,3437; FPR tertinggi SMA.
- Satu grup menonjol dari tiga arah — SMA: paling jarang disetujui, paling sering salah ditolak, kalibrasi terburuk di antara grup besar. Penyelidikan asalnya adalah M7.2.

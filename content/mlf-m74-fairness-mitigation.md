# MLF-M7.4: Mitigasi Fairness — Tiga Keluarga Obat untuk Model yang Tidak Adil

## Masalah: AIR 0,869 — Model yang Akurat Tetap Tidak Adil

Model kreditmu punya ROC-AUC 0,7823 — ranking yang lumayan — dan threshold operasional 0,10 yang memaksimalkan laba (+NT$8.214.000 di test 6.000). Lalu audit fairness M7.1 datang: pada threshold yang sama, nasabah laki-laki disetujui 26,1% sementara nasabah perempuan disetujui 30,1%. Adverse-impact ratio (AIR) laki-laki 0,869 — di bawah ambang four-fifths rule 0,80? Belum — tapi cukup dekat untuk diselidiki, dan arahnya konsisten: satu kelompok sistematis lebih jarang disetujui daripada kelompok lain, dari SATU model yang sama.

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3), threshold operasional 0,10, LGD 0,45, margin 0,05. Approval berarti probabilitas default prediksi DI BAWAH threshold. Audit M7.1–M7.3 menemukan: SEX — laki-laki approval 26,1% (n = 2.402), perempuan 30,1% (n = 3.598), AIR 0,869; EDUCATION — Pascasarjana AIR 0,603 (approval 35,3%) terhadap kelompok acuan «Lainnya» yang approval-nya 58,5% namun hanya n = 82 — TERTANDA flag, baca bagian 9 sebelum menindaklanjutinya; MARRIAGE — «Lainnya» AIR 0,656 (n = 68, kecil juga); AGE — kelompok 45+ AIR 0,700. Dan satu pengingat arah: audit scorecard M2.2 mengukur celah yang sama dari sisi berlawanan — AIR 1,1502 (perempuan/laki-laki), approval perempuan 0,3007 vs laki-laki 0,2614 — angka yang SAMA dengan 0,869 dibalik (1/0,8693 ≈ 1,150): selalu nyatakan arah AIR-mu, karena 0,869 dan 1,1502 adalah satu kesenjangan yang sama.

---

## 1. AIR 0,869: Ketika Model yang Akurat Tetap Tidak Adil

**Nilai:** mitigasi bukan «membuat model adil» dalam arti abstrak — ia adalah mengubah SATU angka yang bisa diuji (AIR, selisih FPR, selisih FNR) dengan SATU intervensi yang bisa diulang, lalu melaporkan harganya (biaya, profit, ROC-AUC) dengan jujur. Lesson ini menghitung keempat keluarga angka itu untuk setiap mitigasi, pada data yang sama, supaya kamu bisa membandingkan apel dengan apel.

**Baik/buruk:** AIR 0,869 itu «buruk» sebagai sinyal — ia berada di bawah 1,0 dan mendekati ambang 0,80 — tapi «baik» sebagai diagnosis: ia terukur, bisa direproduksi, dan menunjuk ke satu keputusan konkret (threshold 0,10 yang sama untuk semua orang). Buruk bila dibaca sebagai «modelnya diskriminatif, buang saja»: audit M7.1 menunjukkan selisih FPR laki-laki vs perempuan hanya 0,0383 dan selisih FNR hanya 0,0191 — kesenjangan approval-nya nyata, tapi kemampuan model menangkap nasabah bermasalah (FNR) hampir setara antar kelompok.

**Mitigasi:** jangan mulai dari obatnya — mulai dari diagnosisnya. Tiga keluarga mitigasi di lesson ini masing-masing bekerja di titik pipeline yang berbeda, dan masing-masing punya harga yang berbeda. Pilih berdasarkan DIAGNOSIS, bukan berdasarkan mana yang paling mudah dihitung.

---

## 2. Protokol Validasi Mitigasi: Pilih di Validation, Laporkan di Test yang Belum Tersentuh

Semua angka mitigasi di lesson ini — reweighing AIR 0,9567, resampling 0,9788, hapus fitur 0,9211, in-processing 0,9233, threshold per grup 0,9999, lima titik Pareto — dihitung pada test 6.000 yang SAMA. Begitu kamu MEMILIH mitigasi, target AIR, λ, atau threshold dengan melihat hasil di test yang sama, angka yang dilaporkan bukan lagi estimasi yang jujur — ia sudah memilih dirinya sendiri sebagai yang terbaik. Seperti M7.1 dan M7.3 yang sudah melabelinya, angka-angka ini adalah HASIL ILUSTRASI PROTOKOL LESSON: mereka mengilustrasikan METODE, bukan hasil final yang boleh dilaporkan ke komite sebagai «model kami mencapai AIR 0,9999».

**Protokol benar — tiga bagian data:** TRAIN (24.000): latih model, hitung bobot reweighing, pasang kalibrasi. VALIDATION / KALIBRASI: pilih keluarga mitigasi, target AIR, λ, threshold per grup — SEMUA keputusan pemilihan terjadi di sini. TEST FINAL (6.000): belum tersentuh selama pemilihan — dipakai SEKALI untuk laporan akhir. Ini three-way split M6.4 (langkah 4): data yang dipakai MEMILIH kebijakan harus berbeda dari data yang dipakai MELAPORKAN hasil kebijakan itu. Bila datanya sama, yang dilaporkan adalah skor terbaik dari sekian percobaan — dan skor terbaik dari sekian percobaan selalu terlihat lebih baik daripada kenyataannya (winner's curse, M6.5).

**Baik/buruk:** tiga bagian data ini bagus karena ia membuat satu pertanyaan tajam — «angka ini dipilih di mana, dilaporkan di mana?» Buruk bila dibaca sebagai «jadi angka lesson ini tidak berguna»: angka ilustrasi tetap berguna untuk MEMBANDINGKAN metode dan mempelajari BENTUK trade-off-nya — yang tidak boleh adalah membawanya ke komite sebagai estimasi final tanpa pengukuran ulang.

**Mitigasi:** sebelum mitigasi apa pun masuk produksi, jawab TIGA pertanyaan ini secara tertulis. (1) Threshold / λ / target AIR dipilih dari data apa? (2) Kalibrasi dipasang pada data apa? (3) Metrik fairness yang dilaporkan dihitung pada data apa — dan apakah data itu sudah dipakai untuk satu dari dua pertanyaan sebelumnya? Bila jawaban (3) sama dengan jawaban (1) atau (2), angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON — beri label itu, dan ukur ulang pada holdout sebelum melaporkannya sebagai hasil final.

---

## 3. Tiga Keluarga Mitigasi — dan di Mana Masing-Masing Bekerja

Semua mitigasi fairness masuk ke satu dari tiga keluarga, dibedakan oleh DI MANA ia menyentuh pipeline. **Pre-processing** menyentuh DATA sebelum model dilatih: ubah bobot baris (reweighing), ubah komposisi baris (resampling), atau ubah kolomnya (hapus/ubah fitur sensitif). **In-processing** menyentuh PELATIHAN itu sendiri: latih model dengan constraint fairness di dalam fungsi objektifnya — model belajar sambil «dihukum» bila ia tidak adil. **Post-processing** menyentuh KEPUTUSAN sesudah model jadi: ubah threshold per grup, atau ubah label keluarannya — modelnya tidak disentuh sama sekali.

**Gambar:** pipeline kredit dengan tiga titik intervensi — pre-processing pada data (reweighing, resampling, hapus fitur), in-processing pada pelatihan (constraint saat pelatihan), post-processing pada keputusan (threshold per grup). Panah mengalir dari data ke latih ke skor ke keputusan. Semakin ke kanan, semakin mudah diterapkan — dan semakin sedikit yang diperbaiki di akarnya.

**Nilai:** peta ini penting karena ia menentukan APA yang bisa diperbaiki dan APA harganya. Pre-processing memperbaiki sumber masalah (data yang timpang) tapi tidak menjamin model hasil akhirnya adil — model bisa menemukan kembali kesenjangan itu lewat proxy. In-processing menjamin constraint-nya dipenuhi saat pelatihan, tapi mengubah pelatihan berarti mengubah model — dan butuh implementasi yang tidak selalu tersedia di library standar. Post-processing adalah yang paling mudah diterapkan (tidak perlu latih ulang) dan paling transparan (threshold per grup bisa ditulis di satu baris), tapi ia tidak memperbaiki modelnya — ia hanya memperbaiki KEPUTUSANNYA, dan ia bisa merusak kalibrasi (bagian 9).

**Baik/buruk:** tidak ada keluarga yang «terbaik» secara umum — yang ada hanyalah yang paling cocok dengan diagnosis. Data latihmu timpang antar kelompok? Pre-processing. Modelmu sudah bagus tapi keputusannya timpang? Post-processing. Kamu punya akses ke kode pelatihan dan butuh jaminan matematis? In-processing. Buruk bila kamu memilih keluarga berdasarkan yang paling mudah di-demo — post-processing yang dipilih karena «tinggal ubah threshold» tanpa memeriksa apakah kalibrasi dan legalitasnya tahan, adalah mitigasi yang akan dicabut di review pertama.

**Mitigasi:** sebelum memilih keluarga, jawab tiga pertanyaan diagnosis — (1) Di mana kesenjangan itu berasal: dari data, dari model, atau dari keputusan? (2) Atribut sensitif apa yang tersedia, dan seberapa besar n per kelompoknya? (3) Metrik fairness mana yang kamu kejar — AIR (approval), FPR/FNR (kesalahan), atau keduanya? Jawaban ketiganya menentukan keluarga; lesson ini menghitung ketiganya untuk SEX supaya kamu bisa melihat perbedaannya.

---

## 4. Pre-Processing (1): Reweighing — Timbang Ulang Barisnya, Bukan Modelnya

Reweighing (Kamiran dan Calders, 2012) adalah mitigasi pre-processing yang paling bersih secara konseptual: bila kombinasi kelompok dan label tertentu TERWAKILI BERLEBIH atau KURANG di data latih, beri bobot pada baris-baris itu sehingga — dari sudut pandang model — kelompok dan label menjadi independen. Bobotnya satu rumus: w(g, y) = P(g) × P(y) / P(g, y). Bila laki-laki yang default lebih jarang dari yang diharapkan bila kelompok dan label independen, baris-baris itu mendapat bobot DI ATAS 1 (suaranya diperbesar); bila lebih sering, bobot DI BAWAH 1. Modelnya sendiri tidak berubah — HistGradientBoostingClassifier yang sama, hanya dipanggil dengan sample_weight.

$$w(g, y) = \frac{\mathbb{P}(g)\,\mathbb{P}(y)}{\mathbb{P}(g, y)}, \qquad \text{latih GBM dengan } \texttt{sample\_weight} = w$$

**Nilai [notebook]** — bobot dihitung dari TRAIN 24.000 (SEX × default): laki-laki-default w = 0,9076, laki-laki-lancar w = 1,0298, perempuan-default w = 1,0713, perempuan-lancar w = 0,9815. Perhatikan: keempat bobot mengelilingi 1,0 — reweighing di data ini adalah koreksi KECIL, bukan operasi besar, karena ketimpangan kelompok × label di train memang tidak ekstrem. Setelah dilatih ulang dengan bobot itu lalu dikalibrasi Platt seperti biasa, hasilnya di test 6.000: AIR SEX 0,9567 (dari 0,869), ROC-AUC 0,7806 (dari 0,7816 terkalibrasi), PR-AUC 0,5590 (dari 0,5558), biaya NT$32.956.500 (dari NT$33.046.500), profit +NT$8.304.000 (dari +NT$8.214.000).

**Baik/buruk:** reweighing bagus karena ia tidak mengubah fitur, tidak mengubah model, dan tidak mengubah threshold — ia hanya mengubah seberapa keras setiap baris «berbicara» saat pelatihan, sehingga ia mudah dijelaskan ke komite kredit («kami menimbang ulang data latih agar kelompok dan label independen»). Buruk bila dibaca sebagai jaminan: bobot dihitung dari train, dan tidak ada yang menjamin model hasil akhirnya adil di test — di data ini AIR bergerak dari 0,869 ke 0,9567, yaitu naik 0,0877 namun belum menutup kesenjangan. Reweighing juga diam-diam mengubah distribusi efektif data latihmu: baris dengan bobot 1,3 dihitung 1,3 kali — bila bobotmu ekstrem (misal 5×), kamu sebenarnya melatih model pada data yang jauh lebih kecil secara efektif.

**Mitigasi:** laporkan SELALU keempat bobotnya di samping hasil akhirnya — bobot adalah bagian dari keputusan mitigasi, bukan detail implementasi. Bila satu bobot di atas 2 atau di bawah 0,5, tanyakan dulu apakah ketimpangan datamu memang sebesar itu, atau apakah kamu sedang menambal masalah data dengan bobot (lebih baik perbaiki datanya).

---

## 5. Pre-Processing (2): Resampling dan Hapus Fitur Sensitif — Plus Jebakan Proxy

Resampling adalah saudara kasar reweighing: alih-alih menimbang baris, ia MENAMBAH atau MENGHAPUS baris sampai tiap kombinasi kelompok × label berukuran sama. Di lesson ini: tiap sel SEX × default di train di-oversample (dengan pengembalian, seed 42) sampai sebesar sel terbesar, sehingga train tumbuh dari 24.000 menjadi 46.068 baris. Hasilnya di test 6.000: AIR SEX 0,9788 (dari 0,869), ROC-AUC 0,7784, PR-AUC 0,5598, biaya NT$33.943.500, profit +NT$7.317.000. Tapi baca juga kolom approval-nya: approval laki-laki 0,1661 dan perempuan 0,1626 — JAUH di bawah 0,285 semula — dan probabilitas prediksi rata-rata naik ke 0,387 (dari 0,22): menyamakan sel membuat base rate latih menjadi 50%, sehingga skornya membengkak dan threshold 0,10 yang dikalibrasi untuk base rate 22% tidak lagi berarti sama. Brier score-nya 0,1758 (dari 0,1345) mengonfirmasi kalibrasinya rusak. AIR-nya memang 0,9788 — tapi harga yang dibayar adalah operating point yang runtuh dan profit yang turun.

**Nilai:** bandingkan resampling dengan reweighing (bagian 3) — keduanya menyasar ketimpangan yang sama, tapi resampling menduplikasi baris secara harfiah. Duplikasi berarti model melihat baris yang SAMA berulang kali: ia bisa overfit pada baris-baris yang diduplikasi itu, dan ukuran train yang membengkak (46.068 baris) memperlambat pelatihan tanpa menambah informasi baru. Reweighing melakukan hal yang sama secara matematis tanpa menduplikasi apa pun — itulah mengapa reweighing biasanya dipilih lebih dulu, dan resampling dipakai bila library pelatihanmu tidak mendukung sample_weight.

Mitigasi kedua di keluarga pre-processing — hapus fitur sensitif — terdengar paling aman: buang SEX, MARRIAGE, dan EDUCATION dari fitur, maka model tidak bisa mendiskriminasi berdasarkan ketiganya. Notebook flagship sudah menghitungnya (sel ⭐): GBM mentah tanpa atribut sensitif ROC-AUC 0,7781 / PR-AUC 0,5516 — hanya turun 0,0042 / 0,0081 dari GBM penuh (0,7823 / 0,5597). Murah. Tapi versi terkalibrasi yang dihitung di lesson ini menunjukkan sisi lainnya: AIR SEX setelah hapus fitur adalah 0,9211 (dari 0,869), ROC-AUC terkalibrasi 0,7789, biaya NT$32.209.000, profit +NT$9.051.500. Kesenjangan approval TIDAK hilang — ia hanya mengecil. Mengapa? Karena proxy.

**Baik/buruk:** hapus fitur bagus sebagai pengurang risiko regulasi — model yang tidak pernah melihat SEX tidak bisa dituduh memakai SEX secara langsung, dan harganya di sini kecil (ROC-AUC turun 0,0042 mentah). Buruk bila dibaca sebagai «sekarang modelnya adil»: fitur lain membawa informasi yang sama — LIMIT_BAL, PAY_0, dan pola pembayaran berkorelasi dengan SEX, dan model belajar dari korelasi itu. Buktinya [notebook]: probe GBM yang memprediksi SEX HANYA dari fitur tersisa (tanpa SEX) mencapai ROC-AUC 0,6261 — jauh di atas 0,5 (tebakan acak). Bahkan skor PD model tanpa-fitur-sensitif itu sendiri memprediksi SEX dengan ROC-AUC 0,4817. SEX sudah «bocor» ke dalam model lewat proxy — menghapus kolomnya tidak menghapus informasinya.

**Mitigasi:** hapus fitur sensitif BOLEH dilakukan — dan di produksi sering memang dilakukan — tapi JANGAN klaim «model kini buta terhadap kelompok». Uji butanya: latih probe yang memprediksi atribut sensitif dari fitur tersisa (atau dari skor model). Bila probe-nya bisa (ROC-AUC jauh di atas 0,5), modelmu tidak buta — ia hanya tidak melihat labelnya secara langsung. Itulah juga jawaban kuis kunci M2.2: IV SEX yang rendah (0,0092) tidak membuktikan model fair, karena bias masuk lewat proxy, dan IV hanya mengukur prediksi univariat, bukan perlakuan model per grup.

---

## 6. In-Processing: Hukum Model Saat Ia Berlatih

In-processing memindahkan fairness ke DALAM pelatihan: bukan data yang diubah, bukan keputusan yang diubah — melainkan fungsi yang dioptimasi model. Gagasan standarnya (reductions, Agarwal dkk. 2018) adalah mengubah masalah ber-constraint — «maksimalkan akurasi DENGAN SYARAT selisih FNR antar kelompok kecil» — menjadi serangkaian masalah TANPA constraint yang dibobot ulang: tiap ronde, kelompok yang FNR-nya lebih buruk mendapat bobot lebih besar pada nasabah default-nya, model dilatih ulang, lalu constraint diukur lagi. Model belajar sambil dihukum bila ia tidak adil.

$$\min_{\theta}\; \mathcal{L}(\theta) \quad \text{dengan syarat} \quad \bigl|\mathrm{FNR}_{\text{laki-laki}} - \mathrm{FNR}_{\text{perempuan}}\bigr| \le \epsilon, \qquad w \leftarrow 1{,}5\,w \text{ untuk default kelompok yang lebih buruk tiap ronde}$$

**Nilai [notebook]** — versi SEDERHANA dari gagasan itu (fairlearn TIDAK terpasang di VM ini, jadi lesson ini memakai pembobotan ulang iteratif yang sama idenya dalam bentuk mini — BUKAN ExponentiatedGradient penuh; label ini jujur dan penting): tiap ronde, nasabah default dari kelompok dengan FNR train lebih tinggi mendapat bobot ×1,5; berhenti bila selisih FNR train di bawah 0,005 atau setelah 6 ronde. Hasilnya: 2 ronde, selisih FNR train dari 0,0231 menjadi 0,0010. Model final (GBM + Platt) di test 6.000: AIR SEX 0,9233 (dari 0,869), ROC-AUC 0,7810, PR-AUC 0,5581, biaya NT$33.770.000, profit +NT$7.490.500. Dan perhatikan DUA hal yang tidak terlihat dari AIR-nya saja: approval KEDUA kelompok TURUN (laki-laki 0,2065, perempuan 0,1907 — dari 0,2614/0,3007), karena menaikkan bobot nasabah default menggeser seluruh distribusi probabilitas ke atas; dan arah kesenjangan BERBALIK — perempuan kini LEBIH JARANG disetujui daripada laki-laki. Menargetkan selisih FNR di train berhasil (0,0231 ke 0,0010), tapi AIR test hanya 0,9233 dan operating point-nya bergeser — constraint yang dipenuhi di train tidak menjamin keputusan yang diinginkan di test.

**Baik/buruk:** in-processing bagus karena constraint-nya eksplisit dan terukur SELAMA pelatihan — kamu tidak berharap model «kebetulan» adil, kamu memaksanya. Ia juga satu-satunya keluarga yang bisa menargetkan metrik kesalahan (FNR/FPR) secara langsung, bukan hanya approval. Buruk bila dibaca sebagai solusi siap-pakai: implementasi penuhnya (ExponentiatedGradient di fairlearn) butuh library tambahan, melatih BANYAK model (satu per ronde, lalu merandomisasi di antaranya), dan hasilnya adalah model yang dirandomisasi — sulit dijelaskan ke komite kredit («keputusan untuk nasabah ini tergantung lemparan dadu antar model»). Versi sederhana di lesson ini menghindari randomisasi, tapi harganya: tidak ada jaminan matematis bahwa constraint terpenuhi di test — dan di data ini AIR hanya bergerak ke 0,9233.

**Mitigasi:** bila kamu memakai in-processing, laporkan SELALU tiga hal — constraint yang ditargetkan (di sini: selisih FNR), nilai constraint di TRAIN per ronde, dan nilai constraint yang sama di TEST sesudahnya. Bila train patuh tapi test tidak, constraint-mu overfit pada train — sama seperti akurasi yang overfit. Dan bila library fairness-mu tidak tersedia, jangan pura-pura memakai algoritmanya: sebut versimu apa adanya («reductions versi sederhana»), seperti yang dilakukan lesson ini.

---

## 7. Post-Processing — INTI: Threshold per Grup (Reproduksi Mitigasi Notebook Flagship)

Inilah inti lesson ini — dan satu-satunya mitigasi yang direproduksi PERSIS dari notebook flagship (Tahap 13, sel 45). Idenya sederhana: bila satu threshold 0,10 menghasilkan approval 26,1% untuk laki-laki dan 30,1% untuk perempuan, maka BERI TIAP KELOMPOK threshold-nya sendiri sehingga keduanya disetujui pada tingkat yang sama. Caranya: ambil approval rate keseluruhan pada threshold tunggal (0,285) sebagai target, lalu untuk tiap kelompok pilih threshold = kuantil ke-0,285 dari distribusi probabilitas kelompok itu — yaitu, setujui 28,5% nasabah BERISIKO TERENDAH di tiap kelompok. Modelnya tidak dilatih ulang, datanya tidak diubah, fiturnya tidak disentuh — hanya aturan keputusannya.

**Nilai [notebook]** — threshold per grup SEX (target approval 0,285): laki-laki 0,1058, perempuan 0,0965. Perhatikan arahnya: threshold laki-laki NAIK (0,10 ke 0,1058 — lebih longgar, lebih banyak disetujui) dan threshold perempuan TURUN (0,10 ke 0,0965 — lebih ketat, lebih sedikit disetujui). Hasilnya di test 6.000: approval laki-laki 26,1% ke 28,5%, approval perempuan 30,1% ke 28,5%; selisih approval antar kelompok 0,0393 ke 0,0000; AIR laki-laki 0,869 ke 0,9999.

**Gambar:** approval rate SEX sebelum vs sesudah threshold per grup — laki-laki 26,1% ke 28,5%, perempuan 30,1% ke 28,5%; selisih approval 0,0393 ke 0,0000. Threshold tunggal 0,10 memberi 26,1% vs 30,1%; threshold per grup (0,1058 laki-laki / 0,0965 perempuan) menyamakan keduanya di 28,5% [notebook]. Yang disamakan adalah approval rate — bukan FPR/FNR dan bukan modelnya.

**Baik/buruk:** threshold per grup bagus karena ia transparan (dua angka, bisa ditulis di satu baris kebijakan), tidak butuh latih ulang, dan efeknya langsung terukur — AIR 0,9999 adalah hasil, bukan janji. Buruk bila dibaca sebagai «model kini adil»: yang disamakan hanyalah APPROVAL RATE. Selisih FPR antar kelompok bergerak 0,0383 ke 0,0076 dan selisih FNR 0,0191 ke 0,0024 — keduanya mengecil, tapi tidak nol, dan arahnya bisa berbalik pada kelompok lain. Dan yang lebih penting: dua nasabah dengan skor yang SAMA kini bisa menerima keputusan yang BERBEDA hanya karena kelompoknya (bagian 9) — itulah harga yang dibayar, dan ia harus ditulis berdampingan dengan AIR-nya.

**Mitigasi:** bila kamu memakai threshold per grup, jangan pernah laporkan AIR-nya sendirian. Laporkan paket LENGKAP: threshold tiap kelompok, approval tiap kelompok, AIR, selisih FPR, selisih FNR, biaya, dan profit — sebelum dan sesudah. Bila salah satu dari paket itu tidak bisa kamu tulis, mitigasi itu belum siap dipresentasikan.

---

## 8. Post-Processing — Harganya: Biaya, Profit, dan ROC-AUC Setelah Mitigasi

Threshold per grup menutup kesenjangan approval — tapi berapa harganya? Tabel ini adalah jawaban jujur notebook flagship, dihitung ulang di lesson ini pada test 6.000 yang sama.

| Metrik | Sebelum (threshold tunggal 0,10) | Sesudah (threshold per grup 0,1058 / 0,0965) |
|---|---|---|
| Selisih approval rate antar kelompok | 0,0393 | 0,0000 |
| Selisih FPR antar kelompok | 0,0383 | 0,0076 |
| Selisih FNR antar kelompok | 0,0191 | 0,0024 |
| Total biaya portofolio (NT$) | 33.046.500 | 32.756.000 |
| Net profit (NT$) | +8.214.000 | +8.504.500 |
| Akurasi (definisi flagship) | 0,4682 | 0,4687 |
| AIR (laki-laki) | 0,869 | 0,9999 |
| ROC-AUC (probabilitas model, terkalibrasi) | 0,7816 | 0,7816 (tetap) |
| ROC-AUC (skor keputusan disesuaikan) | 0,7816 | 0,7808 |
| PR-AUC (skor keputusan disesuaikan) | 0,5558 | 0,5566 |
| Bad rate di antara yang disetujui — laki-laki | 0,0669 | 0,0686 |
| Bad rate di antara yang disetujui — perempuan | 0,0665 | 0,0643 |

**Nilai:** baca baris biayanya dua kali — karena ia melawan intuisi. Notebook flagship sendiri menulis «biasanya menaikkan biaya» — tapi DI DATA INI biayanya TURUN: NT$33.046.500 ke NT$32.756.000 (selisih NT$−290.500), dan profit NAIK NT$+290.500. Mengapa? Threshold per grup menyetujui LEBIH BANYAK laki-laki berisiko rendah (yang tadinya ditolak di bawah 0,10 padahal lancar — tiap penolakan nasabah lancar merugikan margin 5% dari limitnya) dan menolak LEBIH BANYAK perempuan berisiko sedang. Di data ini, pertukaran itu menguntungkan secara biaya — tapi itu KEBETULAN data, bukan sifat metode: pada data lain, atau pada target approval lain, biayanya bisa naik. Jangan hafal arahnya; hitung selalu.

ROC-AUC dan PR-AUC setelah mitigasi — baca dengan hati-hati, karena ada DUA jawaban yang benar. Pada probabilitas MODEL (terkalibrasi — skor yang tidak berubah), ROC-AUC tetap 0,7816 dan PR-AUC tetap 0,5558 — threshold tidak mengubah skor, jadi ranking tidak berubah. «Mentah» di sini berarti «sebelum penyesuaian ambang», bukan «GBM tak terkalibrasi» (yang ROC-AUC-nya 0,7823). Pada skor keputusan yang DISESUAIKAN (s = p / threshold_kelompok — skor yang benar-benar menentukan siapa disetujui), ROC-AUC menjadi 0,7808 dan PR-AUC 0,5566. Yang pertama menjawab «apakah MODELNYA berubah?» (tidak). Yang kedua menjawab «apakah ATURAN KEPUTUSANNYA masih mengurutkan dengan baik?» (sedikit berubah — karena aturan kini memberi «diskon» pada satu kelompok). Bila seseorang hanya menyodorkan satu angka ROC-AUC «sesudah mitigasi» tanpa menyebut skor yang mana, tanyakan: probabilitas model atau skor keputusan?

**Baik/buruk:** tabel sebelum/sesudah ini bagus karena ia memaksa kejujuran dua arah — fairness membaik DAN biaya membaik di data ini, dan keduanya ditulis apa adanya, termasuk fakta bahwa perbaikan biaya ini kebetulan data. Buruk bila tabel ini dibaca sebagai «mitigasi itu gratis»: bad rate di antara yang disetujui BERGESER per kelompok — laki-laki 0,0669 ke 0,0686, perempuan 0,0665 ke 0,0643. Kesenjangan approval tertutup, tapi komposisi risiko buku yang disetujui berubah — dan komite kredit berhak tahu ke arah mana.

**Mitigasi:** untuk SETIAP mitigasi yang kamu usulkan, isi tabel yang sama persis: selisih approval, selisih FPR, selisih FNR, biaya, profit, akurasi, ROC-AUC/PR-AUC (probabilitas model dan skor keputusan disesuaikan). Bila satu sel tidak bisa kamu isi, mitigasi itu belum selesai dihitung.

---

## 9. Trade-Off Fairness vs Performa: Kurva Pareto dari Data

Satu titik «sebelum» dan satu titik «sesudah» belum membentuk kurva — dan tanpa kurva, kamu tidak tahu apakah ada titik tengah yang lebih baik. Lesson ini menghitung LIMA titik di antaranya: parameter λ menginterpolasi threshold tiap kelompok dari threshold tunggal (λ = 0) ke threshold per grup penuh (λ = 1) — threshold_kelompok(λ) = 0,10 + λ × (threshold_kelompok* − 0,10). Tiap λ adalah satu kebijakan yang bisa dipilih, dengan AIR dan biayanya sendiri — semuanya dihitung dari data, bukan ilustrasi.

**Nilai [notebook]** — lima titik Pareto (SEX, test 6.000): λ = 0,00 → threshold 0,1000/0,1000, AIR 0,869, biaya NT$33.046.500, profit +NT$8.214.000, akurasi 0,4682. λ = 0,25 → threshold 0,1014/0,0991, AIR 0,8945, biaya NT$33.057.500, profit +NT$8.203.000, akurasi 0,4670. λ = 0,50 → threshold 0,1029/0,0982, AIR 0,9328, biaya NT$33.035.000, profit +NT$8.225.500, akurasi 0,4685. λ = 0,75 → threshold 0,1043/0,0974, AIR 0,9675, biaya NT$32.752.000, profit +NT$8.508.500, akurasi 0,4693. λ = 1,00 → threshold 0,1058/0,0965, AIR 0,9999, biaya NT$32.756.000, profit +NT$8.504.500, akurasi 0,4687. ROC-AUC skor keputusan bergerak 0,7816 ke 0,7808 di sepanjang kurva — perubahan kecil, karena interpolasi hanya menggeser ambang antar kelompok.

**Gambar:** kurva Pareto lima titik λ — AIR naik dari 0,869 ke 1,000 sementara biaya turun dari NT$33.046.500 ke NT$32.756.000. Sumbu-x = AIR (makin ke kanan, makin adil), sumbu-y = total biaya NT$ (makin ke bawah, makin murah). Di data ini kurva TURUN — makin adil, makin murah — karena pertukaran threshold-nya menguntungkan secara biaya; pada data lain kurva bisa menanjak. Trade-off adalah temuan empiris, bukan hukum alam.

**Baik/buruk:** kurva ini bagus karena ia mengubah perdebatan «adil vs menguntungkan» dari opini menjadi pilihan titik: bila komite menargetkan AIR 0,95, λ = 0,62 (interpolasi) adalah titiknya, dengan biaya ≈ NT$32.899.000 (interpolasi) — dan semua orang bisa melihat harganya sebelum menyetujui. Buruk bila kurva ini dibaca sebagai «semakin adil semakin mahal»: di data ini biayanya TURUN sepanjang kurva (bagian 7) — kurva Pareto yang «salah arah» menurut intuisi adalah pengingat bahwa trade-off fairness vs performa adalah temuan empiris, bukan hukum alam. Pada data lain kurvanya bisa menanjak; di sini ia menurun — dan keduanya harus dilaporkan apa adanya.

**Mitigasi:** jangan pernah sajikan SATU titik mitigasi tanpa kurvanya. Hitung minimal 5 titik interpolasi (λ = 0 / 0,25 / 0,5 / 0,75 / 1) dan biarkan pengambil keputusan memilih titiknya — dengan harga tiap titik tertulis di sampingnya. Mitigasi yang hanya punya satu titik adalah ultimatum, bukan rekomendasi.

---

## 10. Kapan Mitigasi SALAH: Metrik Membaik, Kepercayaan Rusak

Mitigasi bisa «berhasil» menurut angkanya dan tetap salah. Ada tiga cara ia salah — dan ketiganya terjadi di lesson ini atau di sebelahnya.

**Pertama: memperbaiki metrik tapi merusak kalibrasi dan kepercayaan.** Threshold per grup membuat SATU skor berarti DUA keputusan: nasabah laki-laki dengan probabilitas 0,10 DISETUJUI (di bawah threshold laki-laki 0,1058) sementara nasabah perempuan dengan probabilitas 0,10 DITOLAK (di atas threshold perempuan 0,0965). Skor yang sama, keputusan berbeda — hanya karena kelompok. Hitungannya [notebook]: di pita skor (0,0965–0,1058] ada 92 laki-laki yang disetujui padahal perempuan dengan skor yang sama persis ditolak (151 perempuan ditolak di pita itu). Setiap kali nasabah membandingkan surat keputusannya dengan tetangganya, pita inilah yang akan ditemukan — dan tidak ada penjelasan kalibrasi yang bisa membenarkannya, karena kalibrasi modelnya sendiri TIDAK berubah (ECE tetap 0,0087; yang berubah adalah aturan keputusan di atasnya).

**Kedua: legalitas threshold per grup.** Memberlakukan threshold berbeda berdasarkan jenis kelamin adalah perlakuan berbeda berdasarkan atribut yang dilindungi — di beberapa yurisdiksi (misalnya Amerika Serikat, Equal Credit Opportunity Act) hal semacam ini bermasalah secara hukum, dan di yurisdiksi lain statusnya abu-abu atau berbeda. Lesson ini MENCATAT pertimbangan itu — bukan memberi nasihat hukum. Yang pasti: sebelum memakai threshold per grup di produksi, konsultasikan ke penasihat hukum dan regulator yang berlaku (di Indonesia: OJK), dan pertimbangkan rute yang lebih aman — perbaiki sumber masalah (fitur yang lebih baik, reweighing saat pelatihan, model tanpa atribut sensitif) — seperti yang disarankan notebook flagship sendiri. Mitigasi yang tidak lolos review hukum adalah mitigasi yang akan dicabut — dan pencabutan yang terlambat lebih mahal daripada mitigasi yang tidak pernah dipakai.

**Ketiga: mitigasi pada kelompok dengan n kecil — flag EDUCATION.** Kelompok acuan «Lainnya» (EDUCATION) hanya n = 82 di test, approval 58,5% dengan standard error ±5,44 poin persen — selang kepercayaannya lebar. Lebih tajam lagi: bila kamu mencoba menghitung threshold per grup untuk «Lainnya» (kuantil approval 0,285), bootstrap 500 ulangan memberi simpangan baku 0,0078 dan selang 95% ((0,0452, 0,0782)) — threshold-nya bergoyang lebar hanya karena 82 baris itu di-resample. Bandingkan dengan SEX: threshold laki-laki simpangan baku bootstrap 0,0022 (n = 2.402) dan perempuan 0,0016 (n = 3.598). Aturannya: JANGAN samakan approval untuk kelompok dengan n kecil — threshold kuantilnya tidak stabil, AIR-nya tidak stabil, dan «mitigasi»-mu adalah noise yang dibungkus keputusan. Tindakan yang benar untuk Pascasarjana (AIR 0,603): SELIDIKI dulu — kumpulkan data lebih banyak, atau audit dengan metrik yang tidak bergantung pada kelompok acuan kecil (misalnya selisih FPR/FNR langsung, atau AIR terhadap kelompok terbesar, bukan terhadap «Lainnya»).

**Baik/buruk:** ketiga kegagalan ini bagus sebagai pengingat bahwa «AIR membaik» bukan vonis akhir — ia satu baris dari paket keputusan. Buruk bila ketiganya dibaca sebagai alasan untuk TIDAK memitigasi sama sekali: AIR 0,869 yang dibiarkan juga adalah keputusan — keputusan untuk menerima kesenjangan itu. Yang benar adalah memitigasi dengan paket lengkap (bagian 7), dengan catatan legalitas, dan dengan ambang n minimum yang ditulis dulu.

**Mitigasi:** tetapkan TIGA gerbang sebelum mitigasi apa pun masuk produksi — (1) gerbang kalibrasi: apakah aturan keputusan barumu masih bisa dijelaskan dari skornya? (2) gerbang legalitas: apakah penasihat hukum sudah membaca rencanamu? (3) gerbang n minimum: apakah tiap kelompok yang kamu samakan punya n cukup besar sehingga threshold-nya stabil (bootstrap SD kecil)? Satu gerbang gagal berarti mitigasi ditunda — bukan dibatalkan diam-diam, melainkan didokumentasikan (bagian 10) sebagai «ditunda karena …».

---

## 11. Dokumentasi Keputusan Mitigasi: Alasan, Angka, dan Siapa yang Menyetujui

Mitigasi yang tidak didokumentasikan adalah mitigasi yang tidak terjadi — karena enam bulan lagi tidak ada yang ingat mengapa threshold laki-laki 0,1058 dan perempuan 0,0965, atau siapa yang menyetujui angka itu. Dokumentasi keputusan mitigasi punya EMPAT bagian wajib. **Satu — ALASAN:** metrik apa yang memicu mitigasi (di sini: AIR SEX 0,869 pada threshold tunggal 0,10; selisih approval 0,0393), dan mengapa keluarga ini yang dipilih (post-processing: transparan, tanpa latih ulang, efek langsung terukur). **Dua — ANGKA SEBELUM DAN SESUDAH:** paket lengkap bagian 7 (AIR, selisih FPR/FNR, biaya, profit, akurasi, ROC-AUC/PR-AUC probabilitas model dan skor keputusan disesuaikan) — bukan hanya AIR-nya. **Tiga — HARGA DAN RISIKO YANG DITERIMA:** pita inversi 92 laki-laki vs 151 perempuan (bagian 9), pertimbangan legalitas threshold per grup, dan catatan bahwa perbaikan biaya di data ini adalah kebetulan data. **Empat — PENYETUJU:** nama, jabatan, tanggal, dan ambang yang disetujui (misalnya «AIR minimum 0,95 pada SEX, ditinjau ulang tiap kuartal»).

**Nilai:** contoh terisi dari lesson ini — Keputusan M7.4-01 (SEX, threshold per grup): pemicu AIR 0,869 (approval laki-laki 26,1% vs perempuan 30,1%, test 6.000, threshold 0,10); intervensi threshold per grup 0,1058/0,0965 menarget approval 0,285; hasil AIR 0,9999, selisih approval 0,0000, selisih FPR 0,0076, selisih FNR 0,0024, biaya NT$33.046.500 ke NT$32.756.000, profit +NT$8.214.000 ke +NT$8.504.500, ROC-AUC probabilitas model (terkalibrasi) 0,7816 (tetap) / skor keputusan disesuaikan 0,7808; risiko diterima pita inversi (0,0965–0,1058] dan pertimbangan legalitas (konsultasi hukum sebelum produksi); alternatif yang dipertimbangkan reweighing (AIR 0,9567) dan hapus fitur (AIR 0,9211) — keduanya TIDAK menutup kesenjangan, jadi post-processing dipilih meski risikonya lebih besar; penyetuju: [diisi komite kredit — NAMA, TANGGAL].

**Baik/buruk:** dokumentasi empat bagian ini bagus karena ia mengubah mitigasi dari «angka di slide» menjadi «keputusan yang bisa diaudit» — siapa pun bisa merekonstruksi alasan, angka, dan penanggung jawabnya. Buruk bila dokumentasi hanya berisi angka sesudahnya («AIR kini 1,00!»): tanpa angka sebelumnya, tanpa alternatif yang dipertimbangkan, dan tanpa risiko yang diterima, dokumen itu adalah brosur — bukan catatan keputusan. Dan buruk bila penyetujunya kosong: mitigasi tanpa nama penanggung jawab adalah mitigasi yang tidak ada yang berani mempertahankannya saat ditanya.

**Mitigasi:** simpan dokumen ini BERSAMA model card (M8) — satu halaman per keputusan mitigasi, dengan tanggal dan versi modelnya. Bila model dilatih ulang, dokumennya dibuka lagi: apakah AIR-nya masih 0,9999? Apakah threshold per grupnya masih 0,1058/0,0965? Bila tidak, keputusan mitigasi itu sudah kedaluwarsa — dan harus dibuat ulang, bukan diwarisi diam-diam.

---

## 12. Template Tata Kelola: Satu Halaman yang Membuat Keputusanmu Bisa Direproduksi

Dokumentasi keputusan menjawab «mengapa mitigasi ini dipilih» — tapi belum menjawab «model dan data MANA yang menghasilkan keputusan ini, dan bagaimana cara mengembalikannya bila gagal». Template tata kelola satu halaman: sepuluh kolom wajib untuk SETIAP perubahan yang masuk produksi. (1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1. (2) Feature schema version: 31 fitur (23 mentah + 8 turunan). (3) Calibration version: Platt/sigmoid, cv=3. (4) Threshold policy version: v1 threshold tunggal 0,10 → v2 threshold per grup 0,1058/0,0965 (target approval 0,285). (5) Data snapshot: UCI 30.000 baris, split seed 42 (train 24.000, test 6.000). (6) Code/notebook hash. (7) Approval date. (8) Owner. (9) Rollback version: threshold tunggal 0,10 (v1). (10) Alasan perubahan: AIR SEX 0,869 pada v1, target AIR minimum 0,95, harga yang diterima (pita inversi 92 vs 151, pertimbangan legalitas).

**Baik/buruk:** template ini bagus karena ia mengubah «keputusan» menjadi «artefak» yang bisa dicari dan dibuka saat audit. Buruk bila diisi SEBAGIAN: paket tanpa data snapshot dan code hash TIDAK bisa direproduksi — sembilan dari sepuluh kolom bukan «hampir lengkap». Dan buruk bila rollback version kosong: perubahan tanpa versi pengembali adalah perubahan yang tidak bisa dibatalkan.

**Mitigasi:** workflow change control ENAM gerbang — (1) proposal: tulis template ini DULU; (2) offline validation: ukur paket lengkap pada validation yang belum dipakai memilih; (3) legal/risk approval: penasihat hukum dan risk manager menandatangani template-nya; (4) shadow/canary: jalankan v2 berdampingan dengan v1; (5) production: v2 berlaku, v1 menjadi rollback version; (6) rollback criteria — ditulis SEBELUM produksi: cabut v2 bila AIR SEX jatuh di bawah 0,80 selama 2 periode berturut-turut, atau ECE di atas 0,02 bertahan, atau review hukum menolak — dan kembalikan v1. Monitoring M7.5 memberi sinyal untuk gerbang (6). Detail model card dan model risk governance adalah materi M8.

---

## 13. Lab 1: AIR dan Bobot Reweighing dari Hitungan Train

Hitung sendiri dua angka kunci pre-processing — dari hitungan TRAIN 24.000 [notebook]. Pertama, AIR SEX pada threshold tunggal 0,10: approval laki-laki 0,2614 (628 dari 2.402) dan perempuan 0,3007 (1.082 dari 3.598) di test 6.000. Kedua, bobot reweighing Kamiran-Calders untuk sel (laki-laki, default): hitungan train — laki-laki-default 2312, laki-laki-lancar 7174, perempuan-default 2997, perempuan-lancar 11517.

Hasil yang diharapkan [lab]: air_male_vs_max=0.8693; air_female_over_male=1.1503; w_male_default=0.9076; w_male_good=1.0298; w_female_default=1.0713; w_female_good=0.9815. Perhatikan: kedua AIR itu adalah SATU kesenjangan yang sama dari dua arah (1/0,8693 ≈ 1,1503 dari rate yang ditampilkan; hitungan penuh 1,1502) — selalu nyatakan arah AIR-mu. Dan perhatikan bobotnya: semuanya dekat 1,0 — reweighing di data ini adalah koreksi kecil, dan AIR sesudahnya (0,9567) menunjukkan seberapa jauh koreksi kecil itu membawa.

---

## 14. Lab 2: Threshold per Grup dan Trade-off-nya

Lab kedua mereproduksi inti lesson ini — threshold per grup SEX dari notebook flagship [notebook]. Threshold tiap kelompok dari kuantil approval 0,285 (angka kanonis: laki-laki 0,1058, perempuan 0,0965); approval baru tiap kelompok (targetnya 0,285 untuk keduanya); dan perubahan biaya serta profit (biaya sebelum NT$33.046.500, sesudah NT$32.756.000; profit sebelum +NT$8.214.000, sesudah +NT$8.504.500).

Hasil yang diharapkan [lab]: thr_male=0.1058; thr_female=0.0965; air_after=0.9999; cost_change=-290500; profit_change=290500. Perhatikan tanda cost_change: NEGATIF (biaya TURUN) — di data ini mitigasi menghemat NT$290.500. Jangan «perbaiki» tandanya karena terasa salah: itulah temuan datanya, dan lab ini mengujimu apakah kamu melaporkan apa yang dihitung, bukan apa yang kamu harapkan.

---

## Guided Task di Colab

Notebook: colab/mlf-m74-guided-task.ipynb — mereplikasi semua angka kanonis lesson ini dari data UCI: flagship GBM terkalibrasi + audit SEX, reweighing, resampling, hapus fitur + probe proxy, in-processing reductions sederhana, threshold per grup + tabel sebelum/sesudah, dan kurva Pareto lima titik λ. Tautan Colab: https://colab.research.google.com/drive/1qJmOQVXieKQOFgjwSsHN3KaVQft4Jndn

---

## Rangkuman

- Audit M7.1–M7.3 [notebook]: AIR SEX 0,869 (approval laki-laki 26,1% vs perempuan 30,1%, threshold 0,10, test 6.000); EDUCATION Pascasarjana AIR 0,603 TERTANDA flag (kelompok acuan «Lainnya» n = 82); arah berlawanan dari celah yang sama adalah AIR 1,1502 (perempuan/laki-laki, M2.2) — selalu nyatakan arah AIR-mu.
- Pre-processing [notebook]: reweighing (w = P(g)×P(y)/P(g, y)) → AIR 0,9567; resampling (train 24.000 ke 46.068 baris) → AIR 0,9788; hapus fitur sensitif → AIR 0,9211, ROC-AUC mentah 0,7781 (dari 0,7823) — tapi probe memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261: proxy bocor, hapus kolom tidak menghapus informasi.
- In-processing [notebook]: reductions versi sederhana (fairlearn tidak terpasang), 2 ronde pembobotan ulang ×1,5 → AIR 0,9233, ROC-AUC 0,7810 — constraint eksplisit saat pelatihan, tanpa jaminan di test dan tanpa randomisasi model.
- Post-processing [notebook]: threshold per grup SEX 0,1058/0,0965 (target approval 0,285) → AIR 0,9999, selisih approval 0,0393 ke 0,0000, selisih FPR 0,0383 ke 0,0076, selisih FNR 0,0191 ke 0,0024, biaya NT$33.046.500 ke NT$32.756.000, profit +NT$8.214.000 ke +NT$8.504.500, akurasi 0,4682 ke 0,4687.
- ROC-AUC/PR-AUC sesudah mitigasi [notebook]: probabilitas model (terkalibrasi) tetap 0,7816/0,5558 (model tidak berubah); skor keputusan disesuaikan (s = p/threshold_kelompok) 0,7808/0,5566 — sebut skornya bila menyodorkan angka.
- Kurva Pareto [notebook]: lima titik λ = 0 / 0,25 / 0,5 / 0,75 / 1 — di data ini makin adil makin murah (biaya 33.046.500 ke 32.756.000), kebetulan data, bukan hukum; pilih titik dengan harga tertulis.
- Kapan mitigasi salah [notebook]: pita inversi (0,0965–0,1058] — 92 laki-laki disetujui vs 151 perempuan ditolak pada skor yang sama; legalitas threshold per grup adalah pertimbangan (konsultasi hukum + OJK), bukan nasihat hukum; EDUCATION «Lainnya» n = 82 (SE approval ±5,44, bootstrap SD threshold 0,0078) tidak boleh disamakan threshold-nya.
- Dokumentasi: alasan + angka sebelum/sesudah + harga dan risiko yang diterima + penyetuju (nama, tanggal) — disimpan bersama model card, dibuka lagi tiap model dilatih ulang.
- Protokol validasi: semua angka mitigasi dihitung pada test 6.000 yang sama (HASIL ILUSTRASI PROTOKOL LESSON); protokol benar train → validation (pilih) → test final (laporkan sekali); three-way split M6.4.
- Template tata kelola: sepuluh kolom wajib + change control enam gerbang; rollback v2 = threshold tunggal 0,10.
- Lab: AIR 0,8693 / 1,1502 dan bobot reweighing dari hitungan train 24.000; threshold per grup 0,1058/0,0965 dengan cost_change −290.500 (negatif = biaya turun di data ini).

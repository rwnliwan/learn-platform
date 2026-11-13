# MLF-M8.3: Model Card & Documentation — Buktikan Modelmu, Bukan Sekadar Klaim

## Masalah: Auditor Datang Dua Tahun Kemudian — dan Tidak Ada yang Bisa Dibuktikan

Dua tahun lalu, timmu meluncurkan model kredit. Di laporan lama tertulis: ROC-AUC GBM mentah 0,7823, model keputusan terkalibrasi 0,7816, threshold 0,10 menyetujui 28,5% nasabah dengan bad rate 6,67% dan profit +NT$8.214.000 [M6.4]. Model itu masih live. Lalu auditor datang dan bertanya empat hal sederhana: model versi berapa yang sedang berjalan? Data snapshot yang mana yang dipakai melatihnya? Threshold 0,10 itu diputuskan siapa, kapan, dan dari perhitungan apa? Dan bila model ini dicabut hari ini, versi apa yang menggantikannya?

Tidak ada yang bisa menjawab. Notebook-nya sudah ditimpa tiga kali sejak itu. Datanya sudah bertambah baris baru dan dua kolom diganti definisinya. Threshold 0,10 «katanya dari analisis biaya» — tapi file analisisnya tidak ketemu. Angka 0,7823 masih ada di slide — tapi tidak ada yang bisa membuktikan angka itu berasal dari model, data, dan kode yang mana. Modelnya bekerja; buktinya tidak ada. Dan di mata auditor, model yang tidak bisa dibuktikan sama dengan model yang tidak bisa dipercaya.

Itulah masalah yang dipecahkan lesson ini: model card dan dokumentasi. Bukan brosur marketing tentang «model kami akurat» — melainkan satu artefak yang menjawab, untuk SETIAP versi model yang pernah live: apa modelnya, data apa yang melatihnya, seberapa bagus ia diukur, apa batasannya, siapa yang menyetujuinya, dan bagaimana cara mengembalikannya bila gagal.

Angka acuan [kanonis M8]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05. Baseline [M6.4]: ROC-AUC GBM mentah 0,7823, terkalibrasi 0,7816, approval rate 28,5%, bad rate 6,67%, profit +NT$8.214.000.

---

## 1. Auditor Datang Dua Tahun Kemudian — dan Tidak Ada yang Bisa Dibuktikan

**Nilai:** model card adalah selisih antara «kami mengklaim model ini bagus» dan «inilah buktinya, periksa sendiri». Klaim tanpa bukti bergantung pada ingatan orang yang sudah pindah tim; bukti tertulis bergantung pada artefak yang bisa dibuka siapa pun, kapan pun.

**Baik/buruk:** ROC-AUC 0,7823 di laporan itu bagus sebagai angka — tapi buruk sebagai BUKTI bila tidak ada yang bisa merekonstruksinya. Angka tanpa data snapshot, tanpa versi kode, dan tanpa penyetuju adalah angka yang tidak bisa diaudit — dan angka yang tidak bisa diaudit, saat ditanya auditor, bernilai nol.

**Mitigasi:** tulis model card SEBELUM model live, isi angkanya dari run yang sama yang menghasilkan model itu, dan kunci bersama kodenya. Lab 2 membangun kartu itu sebagai JSON yang divalidasi mesin, bukan diketik tangan di slide.

---

## 2. Sepuluh Kolom G10: Apa yang Wajib Ada di Setiap Kartu

Template tata kelola satu halaman dari M7.4 (G10) punya SEPULUH kolom wajib — dan lesson ini memakainya sebagai kerangka model card. (1) Model version: GBM terkalibrasi Platt/sigmoid, seed 42, 31 fitur flagship v1 [notebook]. (2) Feature schema version: 31 fitur (23 mentah + 8 turunan) [notebook] — bila satu fitur berubah definisinya, versinya naik. (3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook]. (4) Threshold policy version: v1 threshold tunggal 0,10 [M6.4]. (5) Data snapshot: UCI Default of Credit Card Clients, 30.000 baris, split stratified seed 42 (train 24.000, test 6.000). (6) Code/notebook hash: hash commit atau hash notebook yang menghitung angka-angka itu — bukan «notebook terbaru». (7) Approval date: tanggal komite menyetujui versi ini. (8) Owner: nama penanggung jawab versi ini. (9) Rollback version: versi yang berlaku bila versi ini dicabut. (10) Alasan perubahan: mengapa versi ini dibuat — metrik apa yang memicunya, dan harga apa yang diterima.

Di samping sepuluh kolom itu, kartu yang lengkap memuat LIMA isi yang wajib: TUJUAN — keputusan setujui/tolak pengajuan kartu kredit, threshold 0,10; DATA — snapshot, ukuran, base rate (0,2212), dan skema fitur; METRIK — paket lengkap: ROC-AUC mentah 0,7823 dan terkalibrasi 0,7816, PR-AUC 0,5597 dan 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4], plus seed sensitivity dan fairness; BATASAN — apa yang tidak bisa model lakukan; PEMILIK — siapa yang bertanggung jawab bila kartu ini ditanya.

**Tujuh kolom penggunaan (G6)** melengkapi sepuluh kolom G10 — total 17 kolom wajib. (11) **intended_users:** analis kredit + komite risiko [ilustrasi] — bukan nasabah langsung. (12) **decision_context:** persetujuan pengajuan kartu kredit baru, threshold v1 0,10 [M6.4]. (13) **affected_population:** nasabah pengaju kartu kredit baru, populasi UCI Taiwan 2005 — bukan nasabah eksisting. (14) **approved_use:** menyetujui/menolak pengajuan baru pada threshold v1 0,10. (15) **prohibited_use:** DILARANG — menentukan limit kredit; menaikkan limit eksisting; memakai di luar populasi pengaju baru; memakai untuk penawaran produk lain. (16) **human_review_required:** ya — banding nasabah yang ditolak + kasus skor di dekat threshold [kebijakan lesson ini]. (17) **out_of_scope_trigger:** populasi bergeser dari UCI / model dipakai untuk produk lain → kartu ini tidak berlaku; revalidasi + kartu baru. **Aturan keras lab 2:** kartu dengan prohibited_use kosong GAGAL walau 16 kolom lain lengkap — kartu yang tidak menulis apa yang DILARANG adalah kartu yang mengizinkan segalanya.

**Gambar:** Anatomi model card — 10 kolom wajib G10 [M7.4]. Kolom 1–5 menjawab «APA modelnya»; kolom 6 & 9 menjawab «BAGAIMANA mereproduksi dan mengembalikannya» (kode/hash, rollback); kolom 7–8 menjawab «SIAPA & KAPAN» (tanggal persetujuan, pemilik); kolom 10 menjawab «MENGAPA» (alasan perubahan).

**Nilai:** sepuluh kolom G10 bagus karena ia mengubah «keputusan» menjadi «artefak» — sesuatu yang bisa dicari, dibandingkan antar versi, dan dibuka saat audit [M7.4]. Sembilan dari sepuluh kolom bukan «hampir lengkap» — untuk reproduksi, satu kolom yang hilang bisa berarti seluruh paket tidak bisa diverifikasi.

**Baik/buruk:** template ini bagus karena ia MEMAKSA kelengkapan — kartu yang kehilangan satu kolom langsung terlihat kosong. Buruk bila diisi sebagai formalitas: kolom «alasan perubahan» yang berisi «perbaikan model» tanpa metrik pemicu dan tanpa harga yang diterima adalah kolom yang kosong dengan kata-kata di dalamnya. Dan buruk bila rollback version kosong: perubahan tanpa versi pengembali adalah perubahan yang tidak bisa dibatalkan.

**Mitigasi:** jadikan kartu ini CHECKLIST GERBANG deploy (M8.4): tidak ada kartu lengkap = tidak ada deploy. Lab 2 memvalidasi kelengkapan itu dengan mesin — daftar kolom wajib diperiksa satu per satu, bukan dibaca mata.

---

## 3. Reproducibility: Orang Lain + Data Sama + Kode Sama = Angka Sama

Reproducibility punya definisi yang bisa diuji: ORANG LAIN, dengan DATA YANG SAMA dan KODE YANG SAMA, mendapatkan ANGKA YANG SAMA — dalam toleransi yang ditulis dulu. Lesson ini memakai toleransi 0,001 untuk ROC-AUC: replikasi flagship GBM mentah harus menghasilkan 0,7823 ± 0,001, dan GBM terkalibrasi 0,7816 ± 0,001. Toleransi ini diasumsikan seed 42 terkunci — bila seed-nya berbeda, ayunan antar-seed (sd 0,0028, langkah 4) sudah bisa melampaui toleransi ini, jadi replikasi WAJIB memakai seed 42.

$$|\,\mathrm{ROC\text{-}AUC}_{\text{replikasi}} - \mathrm{ROC\text{-}AUC}_{\text{dilaporkan}}\,| \le 0{,}001, \qquad \text{contoh: } |0{,}7823 - 0{,}7823| = 0 \le 0{,}001$$

Tiga bahan yang membuat angka bisa direproduksi. Satu — SEED yang ditulis: split seed 42, GBM random_state 42. Dua — VERSI yang ditulis: scikit-learn 1.9.1, numpy 1.26.4, pandas 2.1.4, scipy 1.11.4 (kanonis M8). Tiga — DATA SNAPSHOT yang ditulis: data yang sama berarti baris dan definisi kolom yang sama, bukan «file dengan nama yang sama» yang isinya sudah berubah.

**Nilai:** rumus ujinya murah (jalankan ulang notebook, bandingkan dua angka) dan ia menangkap seluruh kelas kesalahan diam-diam: seed yang tertukar, fitur yang definisinya berubah, library yang naik versi tanpa dicatat. Notebook guided task lesson ini menjalankan uji itu di check 2: GBM mentah 0,7823, PR-AUC 0,5597, terkalibrasi 0,7816 / 0,5558 — semuanya cocok dengan kanonis dalam 0,001.

**Baik/buruk:** definisi ini bagus karena ia mengubah «bisa direproduksi» dari klaim menjadi UJI — ada angka, ada ambang, ada lolos/gagal. Buruk bila dibaca sebagai «reproducible berarti benar»: model yang salah secara konseptual bisa direproduksi dengan sempurna — reproducibility membuktikan ANGKAnya bisa diulang, bukan KEPUTUSANnya benar.

**Mitigasi:** simpan uji replikasi ini sebagai CHECK OTOMATIS di notebook (assert, bukan eyeballing): setiap kali kartu ditulis, notebook menegaskan angka-angkanya cocok dengan kanonis dalam 0,001 — dan gagal keras bila tidak.

---

## 4. Seed Sensitivity: «0,7823» Itu Pengukuran, Bukan Lotre

Split TETAP seed 42 — hanya random_state GBM yang berubah, 42 sampai 46 [kanonis M8]. ROC-AUC GBM mentah per seed: 42 → 0,7823; 43 → 0,7807; 44 → 0,7782; 45 → 0,7754; 46 → 0,7770. Rentang 0,7754–0,7823; spread (maks − min) 0,0069; rata-rata 0,7787; simpangan baku (ddof=1) 0,0028. Model terkalibrasi lebih stabil lagi: 42 → 0,7816; 43 → 0,7810; 44 → 0,7826; 45 → 0,7796; 46 → 0,7796 — rentang 0,7796–0,7826, spread 0,0030. Approval rate (terkalibrasi, threshold 0,10): 28,50% / 28,93% / 28,30% / 28,85% / 28,67% — spread 0,63 poin persen.

**Gambar:** ROC-AUC GBM mentah per seed — seed 42 0,7823; seed 43 0,7807; seed 44 0,7782; seed 45 0,7754; seed 46 0,7770; garis mean 0,7787; spread 0,0069.

**Nilai:** «0,7823» — angka seed 42 — adalah SATU pengukuran di dalam pita selebar 0,0069 (rentang lima seed yang diuji, 42–46 — bukan batas populasi seed yang mungkin), bukan nilai sejati model. Ia pengukuran yang JUJUR bila pita itu ditulis di sampingnya («0,7823, spread lintas seed 0,0069»); ia menyesatkan bila ditulis sendirian seolah presisi empat desimal berarti kepastian empat desimal. Bandingkan dengan ambang alert monitoring [kebijakan M7.5] 0,02: spread seed 0,0069 hanya sekitar sepertiganya — ayunan karena seed saja TIDAK PERNAH menyalakan alert. Dan bandingkan dengan ayunan antar-periode [M7.5] (ROC-AUC chunk waktu semu berayun 0,0710 — rentang (maks−min) antar-chunk [m75_pseudo_time_roc_spread], BUKAN drop vs full-test (drop itu 0,0388: 0,7816 − 0,7428); 0,0710/0,0069 ≈ 10,3× spread seed): seed noise adalah sumber noise yang PALING KECIL di antara yang lesson ini ukur.

**Baik/buruk:** analisis seed sensitivity ini bagus karena ia memberi ANGKA pada keraguan yang biasanya hanya firasat — «apakah 0,7823 ini kebetulan seed?» kini terjawab: tidak, pitanya hanya 0,0069. Buruk bila dibaca sebagai «jadi seed tidak penting»: seed tidak penting DI SINI karena spread-nya kecil — pada model lain spread seed bisa 0,05, dan di sana angka seed tunggal adalah lotre. Buruk juga bila seed sensitivity disamakan dengan validasi: mengganti seed TIDAK mengganti data — validasi belah dua A/B (kanonis M8) menunjukkan ayunan yang lebih besar (ROC-AUC terkalibrasi 0,7885 vs 0,7746, selisih 0,0139) karena datanya yang berbeda, bukan seed-nya.

**Mitigasi:** tulis SELALU tiga angka di model card, bukan satu: nilai yang dilaporkan (seed 42: 0,7823), spread lintas seed (0,0069), dan simpangan baku (0,0028). Bila spread lintas 5 seed melewati 0,02 [kebijakan M7.5], angka seed tunggal TIDAK BOLEH dilaporkan sendirian.

---

## 5. Data Snapshot: «Data yang Sama» Berarti Baris dan Definisi yang Sama

Snapshot yang benar menjawab tiga hal: DATA APA — UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; SPLIT BAGAIMANA — stratified 80/20, seed 42 (train 24.000, test 6.000); dan SKEMA FITUR APA — 31 fitur flagship v1, yaitu 23 kolom mentah (LIMIT_BAL, SEX, EDUCATION, MARRIAGE, AGE, PAY_0, PAY_2–PAY_6, BILL_AMT1–BILL_AMT6, PAY_AMT1–PAY_AMT6) ditambah 8 fitur turunan (PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND).

**Nilai:** snapshot yang baik punya TIGA sifat. Satu — BEKU: isinya tidak berubah setelah ditulis; bila data berubah, snapshot BARU dibuat dengan versi baru. Dua — LENGKAP: mencakup skema fitur beserta definisi tiap fitur turunan — karena fitur turunan yang definisinya berubah adalah fitur yang berbeda, walau namanya sama. Tiga — TERUKUR: base rate, ukuran train/test, dan PSI train-vs-test [M7.5] dicatat di sampingnya — PSI tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi] membuktikan split seed 42 sehat.

**Baik/buruk:** snapshot bagus karena ia membuat klaim «data yang sama» bisa DIPERIKSA — bandingkan hash, bandingkan jumlah baris, bandingkan definisi. Buruk bila snapshot hanya berupa nama file («uci_default_credit.xls»): nama file bisa menunjuk ke isi yang berbeda besok pagi. Dan buruk bila skema fitur tidak ditulis: 31 fitur tanpa daftar adalah 31 fitur yang tidak bisa diverifikasi.

**Mitigasi:** tulis snapshot dalam SATU baris yang lengkap — sumber, jumlah baris, base rate, split + seed, dan versi skema fitur — lalu simpan hash file datanya di kolom (6) code/notebook hash. Bila satu pun berubah, naikkan versi skema dan tulis alasannya di kolom (10).

---

## 6. Versioning: Versi Model, Kalibrasi, dan Threshold Adalah Identitas — Rollback Butuh Ini

Tiga kolom G10 — (1) model version, (3) calibration version, (4) threshold policy version — bersama-sama adalah IDENTITAS sebuah versi model. Contoh dari M7.4 [M7.4]: v1 = threshold tunggal 0,10; v2 = threshold per grup 0,1058/0,0965 (target approval 0,285, AIR SEX 0,8694 → 0,9999). v1 dan v2 memakai model yang sama (GBM terkalibrasi, seed 42) dan data yang sama — yang berubah HANYA kebijakan threshold. Tanpa versi threshold policy, v1 dan v2 tidak bisa dibedakan — dan rollback dari v2 ke v1 tidak bisa dilakukan.

Aturan penomoran yang dipakai lesson ini [keputusan kebijakan lesson ini]: MAJOR naik bila model atau kebijakan threshold berubah; MINOR naik bila kalibrasi di-fit ulang atau fitur ditambah/dihapus tanpa mengubah kebijakan; PATCH naik bila hanya dokumentasi yang diperbaiki tanpa mengubah angka apa pun.

**Nilai:** versioning yang disiplin membuat TIGA hal menjadi mungkin. Satu — ROLLBACK: kolom (9) rollback version selalu menunjuk ke versi sebelumnya yang sudah terbukti (v2 → v1 threshold tunggal 0,10 [M7.4]). Dua — PERBANDINGAN: dua versi bisa dibandingkan apel-dengan-apel (v1: profit +NT$8.214.000 [M6.4]; v2: +NT$8.504.500 [M7.4]). Tiga — AKUNTABILITAS: setiap versi punya owner dan approval date.

**Baik/buruk:** versioning bagus karena ia mengubah «model terbaru» — frasa yang tidak berarti apa-apa — menjadi «v2, threshold per grup 0,1058/0,0965, disetujui [ilustrasi]» — sesuatu yang bisa dicari dan dibuka. Buruk bila versi hanya ditempel di nama file («model_final_v2_FINAL.ipynb»): nama file bukan versi. Dan buruk bila minor dan patch dicampur: kalibrasi yang di-fit ulang diam-diam di bawah nomor versi yang sama berarti dua model berbeda mengaku sebagai satu versi.

**Mitigasi:** satu versi = satu kartu = satu paket (model + kalibrasi + threshold + snapshot + hash kode). Tulis rollback version SEBELUM deploy, bukan sesudah gagal.

---

## 7. Limitations: Kartu yang Jujur Menulis Apa yang TIDAK Bisa Model Lakukan

Tiga batasan flagship yang WAJIB ditulis. Satu — DATA SATU SNAPSHOT, TANPA DERET WAKTU [M7.5]: data UCI ini satu foto tanpa tanggal; model tidak tahu tren waktu dan tidak boleh diklaim memahami musim, resesi, atau perubahan perilaku dari waktu ke waktu. Dua — FAIRNESS TERBATAS [M7.1]: AIR SEX (GBM terkalibrasi) 0,8694 (approval laki-laki 26,14% vs perempuan 30,07%) berada di atas ambang 0,80 (aturan four-fifths — ambang standar, bukan konstanta alam), tapi AIR EDUCATION serendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — rasio approval terendah (SMA) terhadap tertinggi (Lainnya) — — model ini TIDAK adil secara merata antar grup pendidikan. Tiga — PENJELASAN BUKAN KAUSAL [M7.3]: SHAP dan koefisien menjelaskan apa yang dipakai model untuk memutuskan, bukan apa yang MENYEBABKAN default di dunia.

Tambahkan dua batasan lagi. Empat — LABEL BUTUH WAKTU [M7.5]: label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat; metrik berlabel untuk periode terbaru belum bisa dihitung. Lima — POPULASI TERBATAS: model dilatih pada nasabah kartu kredit Taiwan 2005 (data UCI) — menerapkannya pada populasi lain tanpa validasi ulang adalah ekstrapolasi, bukan penerapan.

**Nilai:** limitations yang ditulis dengan jujur adalah PERLINDUNGAN — bagi pengguna, bagi tim, dan bagi auditor. Kartu tanpa limitations dibaca auditor sebagai salah satu dari dua hal: tim tidak tahu batasannya, atau tim tahu dan menyembunyikannya. Keduanya buruk.

**Baik/buruk:** menulis batasan bagus karena ia membuat kartu bisa DIPERCAYA — angka baiknya (ROC-AUC 0,7823) menjadi lebih kredibel justru karena angka buruknya (AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]) ditulis di sampingnya. Buruk bila batasan ditulis sebagai kalimat penghibur («model mungkin kurang akurat pada beberapa grup») tanpa angka dan tanpa grup yang disebut: batasan tanpa angka adalah basa-basi, bukan batasan.

**Mitigasi:** setiap batasan ditulis dalam format tiga bagian — APA batasannya, ANGKA berapa yang membuktikannya, dan APA KONSEKUENSINYA (kapan model tidak boleh dipakai). Bila satu batasan tidak punya angka, tuliskan «belum diukur».

---

## 8. Audit Trail: Siapa, Kapan, Mengapa — dan Angka Apa yang Berubah

Model card adalah FOTO satu versi; audit trail adalah FILMnya — catatan berurutan dari setiap keputusan yang mengubah model. Satu entri audit yang lengkap punya LIMA field: TANGGAL, KEPUTUSAN (misalnya threshold tunggal 0,10 → threshold per grup 0,1058/0,0965 [M7.4]), PEMICU (AIR SEX 0,8694 pada v1), ANGKA SEBELUM DAN SESUDAH (AIR 0,8694 → 0,9999; profit +NT$8.214.000 → +NT$8.504.500 [M7.4]; selisih approval 0,0393 → 0,0000), dan PENYETUJU (nama + jabatan).

Audit trail dipasangkan dengan workflow change control ENAM gerbang dari M7.4 [M7.4]: (1) proposal — template G10 ditulis DULU, sebelum satu baris kode berubah; (2) offline validation — paket lengkap diukur oleh validator independen (fungsi model risk/compliance, tidak melapor ke owner) pada validation yang belum dipakai memilih; (3) legal/risk approval — penasihat hukum dan fungsi legal/risk (lini kedua, independen dari owner) menandatangani template-nya, bukan slide-nya — tanda tangan ini adalah sign-off atas hasil validasi independen, bukan persetujuan diri sendiri; (4) shadow/canary — v2 berjalan berdampingan dengan v1 pada sebagian trafik (detailnya M8.4); (5) production — v2 berlaku, v1 menjadi rollback version; (6) rollback criteria — DITETAPKAN sebelum gerbang (5) (ditulis di gerbang (1), bersama proposal) dan DIVERIFIKASI di sini: cabut v2 bila AIR SEX jatuh di bawah 0,80 (aturan four-fifths) selama 2 periode berturut-turut, atau ECE di atas 0,02 [kebijakan M7.5] bertahan, atau review hukum menolak — dan kembalikan v1.

**Nilai:** audit trail bagus karena ia menjawab pertanyaan yang TIDAK BISA dijawab model card sendirian: «mengapa threshold laki-laki 0,1058 dan perempuan 0,0965?» — jawabannya ada di entri M7.4-01: pemicu AIR 0,8694, alternatif yang dipertimbangkan (reweighing AIR 0,9567, hapus fitur AIR 0,9211 — keduanya tidak menutup kesenjangan), risiko yang diterima (pita inversi 92 laki-laki vs 151 perempuan, pertimbangan legalitas threshold per grup).

**Baik/buruk:** trail yang lengkap bagus karena ia membuat keputusan BISA DITINJAU ULANG. Buruk bila trail hanya berisi angka sesudahnya («AIR kini 0,9999!»): tanpa angka sebelumnya, tanpa alternatif yang dipertimbangkan, dan tanpa risiko yang diterima, dokumen itu adalah brosur — bukan catatan keputusan [M7.4].

**Mitigasi:** simpan audit trail BERSAMA model card — satu halaman per keputusan, dengan tanggal dan versi modelnya. Bila model dilatih ulang, trail-nya dibuka lagi: apakah AIR-nya masih 0,9999? Bila tidak, keputusan itu sudah kedaluwarsa — dan harus dibuat ulang, bukan diwarisi diam-diam.

---

## 8a. Lifecycle Linkage: Satu ID yang Sama di Semua Artefak — Mismatch adalah Governance Failure

Enam artefak, satu lifecycle: model card (M8.3), validation report (M8.1), tiering record (M8.2), deployment record (M8.4), monitoring config (M7.5), revalidation report (M8.5). Enam field ID yang SAMA harus muncul di semua artefak: **model_id** («credit-scorecard-flagship»), **model_version** («gbm-calibrated-v1»), **feature_schema_version** («flagship-v1»), **calibration_version** («platt-cv3»), **threshold_policy_version** («threshold-v1»), **deployment_id** («deploy-2026-11-13»).

**Contoh lab 3:** monitoring config membaca model_version «gbm-calibrated-v2» sementara kelima artefak lain «gbm-calibrated-v1». Vonisnya: GOVERNANCE FAILURE — model yang dimonitor bukan model yang divalidasi; deployment DIBEKUKAN sampai ID-nya dicocokkan. Bukan «salah ketik» (yang berjalan bisa jadi benar-benar v2 yang naik tanpa kartu), bukan «perbarui kartu menjadi v2 supaya cocok» (memalsukan jejak audit), bukan «v2 pasti lebih baik» («lebih baru» bukan «tervalidasi»). Linkage adalah gerbang biner: 35/36 pasangan cocok bukan «hampir lolos» — satu ID yang tidak cocok sudah cukup. Pengecekan linkage adalah gerbang deploy (M8.4) dan gerbang revalidasi (M8.5); ID ditulis otomatis oleh pipeline deploy dan dibaca dari satu tempat kebenaran (deployment record), bukan diketik manual enam kali.

---

## 9. Jebakan: Dokumentasi Ditulis SETELAH Deploy — Saat Ingatan Sudah Pudar

Jebakan yang umum — dan mahal — di lesson ini: dokumentasi ditulis SETELAH deploy. Alasannya selalu masuk akal: «deploy dulu, dokumentasi menyusul», «tenggatnya mepet», «kan sudah ada di kepala». Akibatnya bisa ditebak: dua minggu kemudian, tidak ada yang ingat seed berapa yang dipakai (42? 43?), data snapshot yang mana (sebelum atau sesudah koreksi label?), atau siapa yang menyetujui threshold 0,10.

**Nilai:** ada TIGA kerugian yang terukur dari dokumentasi yang terlambat. Satu — ANGKA YANG TIDAK BISA DIREPRODUKSI: replikasi menghasilkan angka berbeda, dan tidak ada yang tahu apakah yang berubah adalah seed, data, atau library. Dua — KEPUTUSAN YANG TIDAK BISA DITINJAU: alasan threshold 0,10 (dari analisis biaya [M6.4]) tidak tertulis, jadi threshold itu tidak bisa dipertahankan saat ditanya. Tiga — AUDIT YANG GAGAL: auditor tidak bertanya «apakah modelmu akurat?» — ia bertanya «buktikan» — dan bukti yang ditulis dari ingatan dua tahun kemudian bukan bukti, melainkan rekonstruksi.

**Baik/buruk:** menulis dokumentasi sesudah deploy terasa efisien — karena deploy-nya memang lebih cepat sehari. Buruknya: biaya keterlambatan itu dibayar berkali-kali lipat kemudian — dalam jam kerja mencari ulang angka, dalam keputusan yang tidak bisa dipertahankan, dan dalam audit yang gagal.

**Mitigasi:** balik urutannya — kartu ditulis SEBELUM deploy, sebagai GERBANG (M8.4): tidak ada kartu lengkap = tidak ada deploy. Dan hasilkan kartu dari KODE, bukan dari ingatan: lab 2 membangun kartu sebagai JSON dari angka kanonis, divalidasi mesin.

---

## 10. Mini-Case: Model Card Flagship — Terisi dari Angka Kanonis

Isi kartu flagship selengkapnya — semua angka dari kanonis M8 dan modul lain yang dilabeli sumbernya; kolom yang bukan hasil hitung dilabeli [ilustrasi]. (1) Model version: gbm-calibrated-v1 — HistGradientBoostingClassifier random_state=42, 31 fitur flagship v1. (2) Feature schema version: flagship-v1 — 31 fitur (23 mentah + 8 turunan: PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION, PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND). (3) Calibration version: Platt/sigmoid, CalibratedClassifierCV cv=3 [notebook]. (4) Threshold policy version: v1 threshold tunggal 0,10 [M6.4]. (5) Data snapshot: UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, split stratified seed 42 (train 24.000, test 6.000). (6) Code/notebook hash: [ilustrasi] — hash commit notebook flagship. (7) Approval date: [ilustrasi] — tanggal komite menyetujui v1. (8) Owner: [ilustrasi] — Model Owner (peran bisnis/model development — owner tidak menandatangani persetujuannya sendiri; legal/risk approval di gerbang (3) datang dari fungsi independen). (9) Rollback version: tidak ada versi model sebelumnya — v1 adalah versi produksi pertama; rollback plan: nonaktifkan skor model, kembali ke keputusan manual [ilustrasi]. (10) Alasan perubahan: versi produksi pertama model flagship [M6.4].

METRIK (test 6.000, threshold 0,10): GBM mentah ROC-AUC 0,7823, PR-AUC 0,5597, Brier 0,1342; GBM terkalibrasi ROC-AUC 0,7816, PR-AUC 0,5558, Brier 0,1345, ECE 0,0087 [M6.4]; LR mentah (tidak terkalibrasi) ROC-AUC 0,7426, PR-AUC 0,5049, Brier 0,1427; approval rate 28,5% (1.710 dari 6.000), bad rate yang disetujui 6,67%, biaya NT$33.046.500, profit +NT$8.214.000 [M6.4]; GBM train ROC-AUC 0,8469, gap train-test 0,0646; seed sensitivity: ROC-AUC mentah lintas seed 42–46 spread 0,0069, mean 0,7787, sd 0,0028; terkalibrasi spread 0,0030; approval spread 0,63 poin persen; fairness (GBM terkalibrasi): AIR SEX 0,8694 [M7.1] (approval laki-laki 26,14% vs perempuan 30,07%), AIR EDUCATION terendah 0,3572 (SMA) [m71_by_group.EDUCATION.summary.air_min_over_max].

BATASAN: data satu snapshot tanpa deret waktu [M7.5]; label butuh jendela observasi 1 bulan [M7.5]; AIR EDUCATION 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max] — tidak adil merata antar grup pendidikan [M7.1]; penjelasan (SHAP/koefisien) bukan kausal [M7.3]; populasi latih nasabah kartu kredit Taiwan 2005 — ekstrapolasi ke populasi lain butuh validasi ulang. TUJUAN: keputusan setujui/tolak pengajuan kartu kredit pada threshold 0,10.

**Nilai:** kartu ini bagus karena SIAPA PUN bisa memverifikasinya tanpa meneleponmu: jalankan notebook guided task, bandingkan angka-angkanya dengan kartu ini dalam toleransi 0,001 (check 2–4), dan semua angka hitung cocok — GBM 0,7823, terkalibrasi 0,7816, approval 28,5%, bad rate 6,67%, spread seed 0,0069.

**Baik/buruk:** mini-case ini bagus sebagai CONTOH LENGKAP — ia menunjukkan kartu yang terisi penuh, bukan template kosong. Buruk bila disalin mentah ke produksi lain: angka-angka ini milik flagship UCI; kartu produksimu harus diisi dari run-mu sendiri. Dan buruk bila kolom [ilustrasi] dibiarkan [ilustrasi] saat deploy: [ilustrasi] adalah tanda «isi sebelum deploy», bukan isi yang boleh live.

**Mitigasi:** pakai kartu ini sebagai TEMPLATE TERISI untuk modelmu sendiri — ganti angka kanonis dengan angka run-mu, ganti [ilustrasi] dengan tanggal, nama, dan hash yang nyata, lalu jalankan validasi lab 2.

---

## Lab 1: Hitung Seed Sensitivity — Spread, Mean, dan Simpangan Baku

Split TETAP seed 42; hanya random_state GBM yang berubah (42–46). ROC-AUC GBM mentah: 0,7823 / 0,7807 / 0,7782 / 0,7754 / 0,7770. ROC-AUC GBM terkalibrasi: 0,7816 / 0,7810 / 0,7826 / 0,7796 / 0,7796. Approval rate terkalibrasi (persen): 28,50 / 28,93 / 28,30 / 28,85 / 28,67. Spread = maks − min; mean = rata-rata; sd = simpangan baku dengan ddof=1 (`statistics.stdev`).

Hasil [lab]: spread_raw=0.0069; mean_raw=0.7787; sd_raw=0.0028; spread_cal=0.0030; approval_spread_pp=0.63. Mean mentah 0,7787 LEBIH RENDAH dari angka seed 42 (0,7823): 0,7823 adalah satu pengukuran (ujung atas pita), 0,7787 adalah rata-rata lima pengukuran. Keduanya benar — dan kartu yang jujur menulis keduanya.

## Lab 2: Bangun Model-Card JSON Flagship + Validasi 17 Kolom Wajib (10 G10 + 7 Penggunaan)

Kartu JSON flagship dari angka kanonis + validasi kelengkapan 17 kolom wajib (10 G10 [M7.4] + 7 penggunaan) dengan mesin. `missing` = kolom REQUIRED yang tidak ada di kartu ATAU nilainya kosong — kartu lolos hanya bila `missing` kosong. Aturan keras: `prohibited_use_ok` harus True — kartu dengan penggunaan-terlarang kosong GAGAL walau 16 kolom lain lengkap.

Hasil [lab]: n_fields=17; missing=[]; all_required=True; prohibited_use_ok=True; roc_auc_raw=0.7823; roc_auc_cal=0.7816; pr_auc_cal=0.5558; approval_rate=0.2850; bad_rate_approved=0.0667; profit_nt=8214000. Validasi ini memeriksa KEBERADAAN kolom, bukan KEBENARAN isinya — kolom approval date berisi «[ilustrasi] 2026-11-13» tetap lolos karena ada dan tidak kosong. Kebenaran isi tetap tanggung jawab manusia (dan replikasi notebook).

---

## Lab 3: Lifecycle Linkage — Deteksi Mismatch sebagai Governance Failure

Enam artefak, enam field ID. Lima artefak menulis model_version «gbm-calibrated-v1»; monitoring_config menulis «gbm-calibrated-v2» [ilustrasi].

Hasil [lab]: n_artifacts=6; n_fields_checked=6; n_consistent=35; mismatches=['monitoring_config.model_version: gbm-calibrated-v1 vs gbm-calibrated-v2']; governance_failure=True; n_mismatches_fixed=0; governance_failure_fixed=False. Dari 36 pasangan, 35 cocok dan 1 tidak — dan satu mismatch itu sudah cukup: linkage adalah gerbang biner, bukan skor. Skenario perbaikan (betulkan monitoring_config ke v1) mengembalikan mismatch ke 0.

---

## Guided task di Colab

Notebook: colab/mlf-m83-guided-task.ipynb — replikasi flagship GBM + kalibrasi Platt, seed sensitivity lintas seed 42–46, bangun model-card JSON flagship + validasi 10 kolom wajib, dan uji apa yang terjadi bila satu kolom dihapus — semuanya dengan checks. Tautan Colab: https://colab.research.google.com/drive/1ohuSzlFkpi8OI5YUcfHYm_clOxxUAm9_

## Rangkuman

- Model card adalah catatan bukti — bukan brosur: ia memuat angka baik (ROC-AUC mentah 0,7823) DAN angka yang tidak baik (AIR SEX GBM terkalibrasi 0,8694 [M7.1], gap train-test 0,0646).
- Sepuluh kolom wajib G10 [M7.4]: model version, feature schema version, calibration version, threshold policy version, data snapshot, code/notebook hash, approval date, owner, rollback version, alasan perubahan — satu kolom hilang berarti paket tidak bisa diverifikasi.
- Tujuh kolom penggunaan melengkapi G10 (total 17 kolom wajib): intended_users, decision_context, affected_population, approved_use, prohibited_use, human_review_required, out_of_scope_trigger — kartu tanpa prohibited_use GAGAL validasi (hard rule lab 2).
- Lifecycle linkage: model_id, model_version, feature_schema_version, calibration_version, threshold_policy_version, deployment_id IDENTIK di keenam artefak — mismatch = governance failure; deployment dibekukan sampai ID dicocokkan.
- Reproducibility = orang lain + data sama + kode sama = angka sama, diuji |ROC-AUC replikasi − ROC-AUC dilaporkan| ≤ 0,001 (flagship: |0,7823 − 0,7823| = 0).
- Seed sensitivity [kanonis M8]: ROC-AUC mentah lintas seed 42–46 = 0,7823 / 0,7807 / 0,7782 / 0,7754 / 0,7770 — spread 0,0069, mean 0,7787, sd (ddof=1) 0,0028; terkalibrasi spread 0,0030; approval spread 0,63 poin persen.
- Data snapshot: UCI 30.000 baris, base rate 0,2212, split stratified seed 42 (train 24.000, test 6.000), 31 fitur (23 mentah + 8 turunan) — dibekukan, lengkap dengan definisi fitur turunan, dan terukur (PSI train-vs-test tertinggi AGE 0,0029 [m75_psi_features_train_vs_test.AGE.psi]).
- Versioning [keputusan kebijakan lesson ini]: major = model/threshold berubah, minor = kalibrasi/skema berubah, patch = dokumentasi saja; v2 threshold per grup 0,1058/0,0965 [M7.4] rollback ke v1 threshold tunggal 0,10.
- Limitations: satu snapshot tanpa deret waktu [M7.5]; AIR EDUCATION terendah 0,3572 [m71_by_group.EDUCATION.summary.air_min_over_max]; penjelasan bukan kausal [M7.3]; label butuh jendela 1 bulan [M7.5]; populasi latih Taiwan 2005.
- Audit trail: tanggal, keputusan, pemicu, angka sebelum-sesudah, penyetuju — dipasangkan dengan change control enam gerbang [M7.4].
- Jebakan: dokumentasi sesudah deploy berarti dokumentasi tidak pernah — kartu ditulis SEBELUM deploy, sebagai gerbang, dan dihasilkan dari kode.
- Mini-case flagship: metrik lengkap (terkalibrasi 0,7816 / 0,5558, ECE 0,0087 [M6.4], Brier 0,1345, approval 28,5%, bad rate 6,67%, profit +NT$8.214.000 [M6.4]) dengan kolom non-hitung dilabeli [ilustrasi].
- Lab: spread mentah 0,0069, mean 0,7787, sd 0,0028, spread terkalibrasi 0,0030, approval spread 0,63 poin persen; kartu JSON 17 kolom (10 G10 + 7 penggunaan), missing kosong, all_required=True, prohibited_use_ok=True; lab 3: 35/36 pasangan ID cocok, 1 mismatch (monitoring_config v2 vs v1) = governance failure.

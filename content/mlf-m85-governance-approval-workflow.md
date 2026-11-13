# MLF-M8.5: Model Risk Governance & Approval Workflow — Siapa yang Menyetujui, Siapa yang Bertanggung Jawab

## Masalah: Model Tanpa Tanda Tangan Dipakai Bisnis — Lalu Merugi

Bayangkan ini [ilustrasi — skenario, angkanya kanonis]: tim bisnis mengubah threshold model kredit dari 0,10 ke 0,50 diam-diam, tanpa proposal, tanpa validasi, tanpa satu pun tanda tangan. Di atas angka [M6.4], yang terjadi adalah ini: approval rate melompat dari 28,5% ke 88,05%, bad rate yang disetujui naik dari 6,67% ke 15,96%, dan profit berubah dari +NT$8.214.000 menjadi −NT$18.994.456 — kerugian hampir NT$19 juta pada 6.000 nasabah test, dari SATU perubahan angka. Bisnis menelepon analis: «modelmu merugi». Analis menjawab: «saya tidak pernah mengubah threshold itu». Risk manager berkata: «saya tidak pernah menyetujuinya». Dan ketiganya benar — karena tidak ada satu pun dari mereka yang tercatat sebagai penanggung jawab.

Itulah pertanyaan lesson ini — dan jawabannya bukan teknis, melainkan tata kelola: governance memastikan setiap model yang memutuskan nasib nasabah punya pemilik, punya penyetuju, dan punya jejak yang bisa diaudit.

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05. Baseline [M6.4/M7.4]: ROC-AUC GBM terkalibrasi 0,7816, PR-AUC 0,5558, approval rate 28,5%, bad rate 6,67%, profit +NT$8.214.000, cost NT$33.046.500. Semua angka ekonomi threshold berasal dari tabel kebijakan M6.4 [M6.4] dan disalin ke kanonik M7 (m6_crossref). Angka yang bersifat ilustrasi dilabeli [ilustrasi] eksplisit.

**Nilai:** governance adalah selisih antara «model yang merugi dan tidak ada yang bisa disalahkan» dan «model yang merugi dan semua orang tahu siapa yang memutuskan, berdasarkan angka apa, dan bagaimana cara kembali».

**Baik/buruk:** model flagship kita bagus sebagai MESIN keputusan (ROC-AUC 0,7816, profit +NT$8.214.000 pada threshold 0,10 [M6.4]). Buruk bila mesin itu dipakai tanpa governance: threshold 0,50, profit −NT$18.994.456 [M6.4] — mesin yang bagus berubah menjadi kerugian bila tidak ada yang menjaga gerbangnya.

**Mitigasi:** sebelum model apa pun naik ke produksi, tuliskan tiga nama: siapa pemiliknya, siapa validatornya, siapa yang menandatangani persetujuannya. Bila satu dari tiga nama itu kosong, model itu belum siap live — sebagus apa pun ROC-AUC-nya.

---

## 1. Model Tanpa Tanda Tangan Dipakai Bisnis — Lalu Merugi. Siapa yang Bertanggung Jawab?

Cerita di atas adalah inti lesson ini. Governance bukan birokrasi yang memperlambat model bagus — governance adalah yang membuat model bagus BERTAHAN bagus. Tanpa gerbang, satu perubahan threshold diam-diam (0,10 ke 0,50 [M6.4]) menghapus profit NT$8.214.000 dan menggantinya dengan kerugian NT$18.994.456 — dan tidak ada yang bisa menjelaskan kenapa.

**Nilai:** lihat «Masalah» di atas.

**Baik/buruk:** lihat «Masalah» di atas.

**Mitigasi:** lihat «Masalah» di atas.

---

## 2. Empat Peran yang Menjaga Model: Komite, Pemilik, Validator, Audit

Struktur governance model risk punya empat peran — dan tidak satu pun boleh dirangkap oleh peran lain saat ia sedang menjalankan tugasnya. **Komite model risk:** memutuskan model BOLEH atau TIDAK dipakai di produksi, menetapkan tier risiko [M8.2] (total limit test NT$1.007.777.680; approved NT$424.180.000, share 0,4209; EL approved NT$11.989.453; EL seluruh test NT$78.675.378), dan mencabut persetujuan bila revalidasi gagal. **Model owner (pemilik model):** satu orang yang accountable atas model itu selama ia live — mengajukan perubahan, memastikan monitoring berjalan [M7.5], dan menjadi orang pertama yang dihubungi saat alert menyala. **Validator independen:** memeriksa model tanpa ikut membangunnya [M8.1] — menilai conceptual soundness desain, mengulang perhitungan pada data yang belum dipakai memilih (outcomes analysis), dan memakai hasil monitoring [M7.5] sebagai input — lalu menulis opini (termasuk kelemahannya), dan berkata TIDAK bila buktinya tidak cukup. Pemetaannya ke three lines [M8.1]: owner = lini 1, validator/komite = lini 2, audit = lini 3 (melapor ke dewan/komite audit, bukan ke owner). **Audit internal:** memeriksa apakah PROSESNYA diikuti — mengambil sampel keputusan, memeriksa audit trail, dan melaporkan bila gerbang dilewati diam-diam.

Pembangun model TIDAK memvalidasi karyanya sendiri, validator TIDAK menyetujui pemakaiannya (itu tugas komite), dan komite TIDAK membangun apa pun.

**Nilai:** empat peran ini menjawab empat pertanyaan yang berbeda — komite «bolehkah dipakai?», owner «siapa yang bertanggung jawab saat live?», validator «apakah buktinya cukup?», audit «apakah prosesnya benar-benar diikuti?». Bila satu peran hilang, satu pertanyaan itu tidak terjawab — dan pertanyaan yang tidak terjawab itulah yang muncul sebagai kerugian yang tidak bisa dijelaskan.

**Baik/buruk:** struktur ini bagus bila tiap peran diisi orang yang berbeda dengan insentif yang berbeda — validator yang dinilai dari ketajaman temuannya, bukan dari kecepatan persetujuannya. Buruk bila peran-peran ini hanya nama di atas kertas: komite yang anggotanya tim yang sama dengan pembangun model, validator yang melapor ke owner, audit yang tidak pernah mengambil sampel.

**Mitigasi:** tuliskan empat nama itu untuk model flagship kita — komite, owner, validator, audit — dan satu kalimat tugas masing-masing, SEBELUM lesson ini selesai. Bila satu nama tidak bisa diisi, tuliskan «kosong» dengan jujur.

---

## 3. RACI: Siapa yang Mengerjakan, Siapa yang Menjawab, Siapa yang Diajak Bicara

RACI — **Responsible (R):** yang MENGERJAKAN; **Accountable (A):** yang MENANGGUNG JAWABAN akhir atas keputusan itu, tepat satu orang per keputusan; **Consulted (C):** yang diajak bicara SEBELUM keputusan diambil; **Informed (I):** yang diberitahu SESUDAH keputusan diambil.

RACI untuk alur model kita — satu A per baris, tanpa kecuali. Proposal perubahan: R = model owner, A = model owner, C = validator (hanya kelayakan data/metodologi, bukan isi keputusan) dan risk manager, I = komite dan tim bisnis. Validasi independen [M8.1]: R = validator, A = validator (atas isi opini — komite menerima atau menolak opini itu di baris sign-off), C = model owner, I = audit internal. Sign-off: R = validator (opini), model owner (pemakaian bisnis), legal/risk (kepatuhan); A = komite; C = —; I = tim bisnis, audit. Deploy [M8.4]: R = owner bersama tim engineering, A = model owner, C = validator, I = tim bisnis dan komite. Monitoring [M7.5]: R = analis monitoring, A = model owner, C = risk manager, I = komite. Rollback: R = model owner, A = komite, C = validator, I = tim bisnis dan audit.

**Nilai:** RACI mengubah «semua orang bertanggung jawab» — yang dalam praktik berarti tidak ada yang bertanggung jawab — menjadi SATU nama per keputusan. Pada hari kerugian datang, RACI menjawab «siapa» dalam satu baris, bukan rapat tiga jam yang berakhir tanpa nama.

**Baik/buruk:** RACI bagus sebagai PETA tanggung jawab. Buruk bila dibaca sebagai «bila namaku tidak ada di baris itu, bukan urusanku»: RACI membagi TANGGUNG JAWAB, bukan kepedulian. Analis monitoring yang melihat PSI simulasi drift S2 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test] tetap harus berteriak walau hurufnya hanya R di baris monitoring.

**Mitigasi:** untuk setiap tahap alur, tuliskan RACI-nya dan periksa dua hal: tepat satu A per baris, dan tidak ada baris yang A-nya kosong. Bila satu baris punya dua A, putuskan satu — sebelum ada keputusan yang harus diambil di baris itu.

---

## 4. Satu Alur Utuh: Proposal → Validasi → Sign-off → Deploy → Monitoring

Lima tahap, masing-masing dengan kriteria keluar yang tertulis. **Tahap 1, Proposal:** owner menulis APA yang berubah, KENAPA berubah, dan DAMPAK yang diharapkan — lengkap dengan angka sebelum dan sesudah (untuk threshold, angka [M6.4]). Kriteria keluar: proposal tertulis dan lengkap; proposal lisan tidak pernah lolos. **Tahap 2, Validasi [M8.1]:** validator independen mengulang perhitungan pada data yang belum dipakai memilih — belahan A vs B (ROC-AUC 0,7885 vs 0,7746, selisih −0,0139), sensitivitas seed, pemeriksaan ulang asumsi — lalu menulis opini: layak, layak dengan syarat, atau tidak layak. **Tahap 3, Sign-off:** para penandatangan membaca opini + model card [M8.3] + ekonomi [M6.4], lalu menandatangani — atau menolak dengan alasan tertulis. Kriteria keluar: semua tanda tangan terkumpul SEBELUM deploy. **Tahap 4, Deploy [M8.4]:** model baru berjalan shadow/canary berdampingan dengan champion — champion vs challenger berbeda keputusan pada 19,42% nasabah (1.165 dari 6.000), jadi shadow bukan formalitas: ia mengukur harga pergantian SEBELUM harga itu dibayar. **Tahap 5, Monitoring [M7.5]:** DUA kolom yang dibaca dengan kadensi berbeda. Harian (tanpa label, tersedia segera): PSI skor, distribusi skor, approval rate, dan AIR — dibaca tiap pagi oleh analis. Per periode SETELAH label matang (jendela observasi 1 bulan [M7.5]): ROC-AUC/PR-AUC, bad rate yang disetujui, dan ECE — dibaca mingguan oleh risk manager, karena metrik berlabel selalu tertinggal dari PSI: temuan berbasis label datang berminggu-minggu setelah PSI sudah berteriak. Monitoring tidak pernah selesai; ia memberi sinyal kembali ke tahap 1 lewat revalidasi.

**Gambar:** alur approval lima tahap — Proposal, Validasi [M8.1], Sign-off, Deploy [M8.4], Monitoring [M7.5] — dengan panah putus-putus dari Monitoring kembali ke Proposal lewat revalidasi.

**Nilai:** alur lima tahap membuat setiap keputusan BISA DILACAK mundur: kerugian di produksi bisa ditelusuri ke proposalnya, proposalnya ke opini validasinya, opininya ke tanda tangannya. Tanpa alur, yang tersisa hanya ingatan orang — dan ingatan adalah audit trail yang paling buruk.

**Baik/buruk:** alur ini bagus bila tiap tahap benar-benar bisa MENGHENTIKAN alur — validator yang berkata tidak layak menghentikan deploy, komite yang menolak menghentikan semuanya. Buruk bila tahap-tahap ini hanya stempel berurutan: proposal yang ditulis sesudah deploy, validasi yang disalin dari proposal, sign-off yang dikumpulkan sesudah model live. Alur yang tidak bisa berhenti bukan alur — ia antrean stempel.

**Mitigasi:** pasang SATU pengunci teknis — deploy tidak bisa dieksekusi tanpa nomor persetujuan komite yang tercatat di audit trail. Pengunci teknis lebih bisa diandalkan daripada pengingat prosedural: orang lupa, sistem tidak.

---

## 5. Apa Arti Tanda Tangan: Penandatangan Ikut Menanggung Risiko

Empat tanda tangan pada model kita, masing-masing atas bagiannya sendiri: **Validator** menandatangani opini validasi — «saya memeriksa model ini secara independen, dan inilah yang saya temukan, termasuk kelemahannya». **Model owner** menandatangani pemakaian bisnis — «saya memakai model ini untuk memutuskan kredit, dalam batas yang tertulis di model card, dan saya bertanggung jawab saat ia live». **Legal/risk** menandatangani kepatuhan. **Komite** menandatangani persetujuan akhir — «berdasarkan opini, model card, dan ekonomi, model ini BOLEH dipakai». Tidak ada satu pun yang menandatangani pekerjaan orang lain — dan tidak ada satu pun yang bisa berkata «saya hanya mengikuti» sesudahnya.

Syarat sebelum menandatangani — tiga dokumen yang WAJIB dibaca, bukan diringkas orang lain: opini validasi [M8.1], model card [M8.3], dan ekonomi threshold [M6.4] (pada 0,10: cost NT$33.046.500, profit +NT$8.214.000).

**Nilai:** sign-off mengubah «keputusan bersama» yang kabur menjadi EMPAT jawaban yang bisa ditagih satu per satu. Pada hari kerugian datang, tidak ada lagi «kami semua memutuskan» — yang ada adalah empat nama, empat bagian, dan empat dokumen yang masing-masing bisa dibuka dan diperiksa.

**Baik/buruk:** sign-off bagus bila penolakan adalah hasil yang NYATA dan pernah terjadi — komite yang tidak pernah menolak sedang tidak menilai, ia sedang mengesahkan. Buruk bila tanda tangan dikumpulkan sesudah deploy: tanda tangan yang datang belakangan bukan persetujuan — ia pembenaran. Urutannya tidak bisa dinegosiasikan: tanda tangan dulu, deploy kemudian.

**Mitigasi:** tuliskan di lembar sign-off SATU baris penolakan — «saya menolak karena …» — dengan ruang kosong yang sama besarnya dengan ruang tanda tangan. Formulir yang tidak menyediakan ruang untuk menolak sedang memberi tahu penandatangannya bahwa penolakan bukan pilihan.

---

## 5a. Exception: Jalan Darurat yang Tercatat — dengan Tanggal Kedaluwarsa

Exception adalah izin TERTULIS untuk melewati satu gerbang atau satu aturan, untuk satu model, untuk waktu yang TERBATAS. **Template 10 kolom:** reason, affected model/version, gate bypassed, risk assessment, compensating controls, start/end time, approver, monitoring cadence, exit criteria, ratification.

**Tiga aturan:** (1) exception tanpa expiry OTOMATIS INVALID — bila end time lewat tanpa perpanjangan tertulis, exception itu MATI dengan sendirinya. (2) Hard constraint TIDAK BISA di-exception-kan — fairness AIR < 0,80 [kebijakan M7.5] dan ECE > 0,02 [kebijakan lesson ini] adalah garis yang tidak boleh dilewati; yang bisa di-exception-kan adalah gate PROSEDURAL (mis. menunda revalidasi kalender 2 minggu). (3) Exception yang diperpanjang DUA KALI menjadi change request — lewat enam gerbang.

**Contoh [ilustrasi] yang sah:** menunda revalidasi kalender 14 hari karena validator belum tersedia — dengan risk assessment (PSI terakhir 0,0017), compensating controls (risk manager memeriksa PSI + approval rate HARIAN), start/end 13–27 November 2026, approver komite, exit criteria (laporan revalidasi diserahkan 27 November), ratification 20 November. **Contoh yang tidak sah:** «deploy dulu, dokumen menyusul» tanpa tanggal, tanpa approver, tanpa kontrol pengganti — itu melewati gerbang tanpa izin.

---

## 6. Change Control G10 [M7.4]: Enam Gerbang — Bahkan untuk Perubahan Threshold

Enam gerbang [M7.4] — pemetaan ke lima tahap (Langkah 4): gerbang 1 = tahap 1 (proposal); gerbang 2 = tahap 2 (validasi); gerbang 3 = legal/risk approval + sign-off komite (Langkah 5); gerbang 4–5 = tahap deploy (Langkah 4); gerbang 6 = verifikasi kriteria rollback yang ditulis di gerbang 1. Enam gerbang [M7.4]: (1) **Proposal** — tuliskan perubahan ini DULU, sebelum satu baris kode berubah; (2) **Offline validation** — ukur paket lengkap (ROC-AUC/PR-AUC, kalibrasi, AIR, biaya, profit) pada validation yang belum dipakai memilih; (3) **Legal/risk approval** — penasihat hukum dan risk manager menandatangani template-nya, bukan slide-nya; (4) **Shadow/canary** — jalankan versi baru berdampingan dengan versi lama pada sebagian trafik, bandingkan keputusan per nasabah; (5) **Production** — versi baru berlaku, versi lama menjadi rollback version; (6) **Rollback criteria** — VERIFIKASI kriteria rollback yang ditulis di gerbang (1), sebelum produksi: kapan versi baru dicabut, dan ke versi apa kembali. Rollback untuk perubahan threshold di lesson ini [M7.4]: kembali ke threshold tunggal 0,10.

Contoh — perubahan threshold 0,10 ke 0,15 [M6.4]: approval rate 28,5% ke 49,88% (naik 21,38 poin persen; nasabah disetujui 1.710 ke 2.993, naik 1.283); bad rate yang disetujui 6,67% ke 8,99% (naik 2,32 poin persen; nasabah default yang disetujui 114 ke 269, naik 155); total cost NT$33.046.500 ke NT$35.770.000 (naik NT$2.723.500); profit +NT$8.214.000 ke +NT$5.490.500 (turun NT$2.723.500). Eskalasi: bila threshold yang sama dinaikkan ke 0,20 [M6.4], profit menjadi −NT$216.500. AIR SEX pada 0,15 justru 0,8906 [m71_air_sex_by_threshold.0.15.air], sedikit lebih baik dari 0,8694 pada 0,10 [M7.1] — fairness BUKAN alasan menolak perubahan ini; ekonominya yang harus diputuskan komite dengan mata terbuka.

**Gambar:** change control enam gerbang G10 — 1 Proposal, 2 Offline validation, 3 Legal/risk approval, 4 Shadow/canary, 5 Production, 6 Rollback gate (verifikasi kriteria yang ditulis di gerbang 1) — dengan strip pemicu revalidasi di bawah dan catatan rollback v2 = threshold tunggal 0,10.

**Nilai:** enam gerbang masing-masing menangkap satu jenis kegagalan yang berbeda — proposal menangkap perubahan yang tidak terpikir dampaknya; offline validation menangkap angka yang terlihat bagus di train tapi tidak di validation; legal/risk menangkap risiko yang bukan angka; shadow menangkap perbedaan keputusan per nasabah (19,42% [M8] — angka ini dari dua model yang berbeda, bukan dari perubahan threshold; untuk perubahan threshold, tabel keputusan yang berubah dihitung ulang di gerbang 4); production yang tertib menangkap kekacauan versi; rollback criteria yang ditulis dulu menangkap kepanikan saat keadaan memburuk.

**Baik/buruk:** change control bagus bila diterapkan pada perubahan KECIL dengan serius yang sama seperti perubahan besar — data lesson ini membuktikan perubahan «kecil» (0,10 ke 0,15) menggerakkan NT$2.723.500. Buruk bila gerbang hanya diterapkan pada perubahan yang TERLIHAT besar: threshold yang diubah lewat satu baris konfigurasi adalah perubahan yang paling mudah lolos diam-diam — dan justru itu yang paling butuh gerbang.

**Mitigasi:** definisikan «perubahan» secara operasional — APA PUN yang mengubah keputusan untuk satu nasabah pun adalah perubahan: threshold, fitur, kalibrasi, data training, kode scoring, bahkan urutan kolom.

---

## 6a. Decision Protocol: Keputusan Komite yang Sah — Kuorum, Recusal, dan Jejak Digital

Tujuh unsur: (1) **quorum minimum** [kebijakan organisasi] — tanpa kuorum, keputusan tidak ada. (2) **recusal** — anggota dengan conflict of interest WAJIB mengundurkan diri dari pembahasan dan suara atas model itu. (3) **delegated authority** — apa yang bisa diputuskan ketua sendirian vs apa yang wajib komite penuh. (4) **tie-breaker/eskalasi** — suara seri dieskalasikan ke tingkat lebih tinggi [kebijakan organisasi], bukan dipaksakan ketua. (5) **approval timestamp** — tanggal dan jam keputusan. (6) **digital evidence** — rekaman yang ditandatangani secara digital, bukan pesan chat. (7) **SLA keputusan** [kebijakan organisasi] — temuan MERAH diputuskan lebih cepat dari KUNING, keduanya punya batas waktu tertulis.

**Mini-case [ilustrasi]:** komite 5 orang, yang hadir 2 anggota + ketua — kuorum tidak tercapai, keputusan TIDAK SAH walau ketiganya setuju. Salah satu dari 2 anggota itu adalah model owner v2.1 — seharusnya recusal. Suara 1–1 (1 anggota yang sah + ketua — suara tertulis dari anggota yang tidak hadir tidak dihitung [kebijakan organisasi]) adalah seri → dieskalasikan. Keputusan yang prosedurnya salah adalah keputusan yang tidak ada.

---

## 7. Kapan Validasi Ulang Wajib: Data Baru, Penggunaan Baru, Temuan Monitoring, Kalender

Revalidasi adalah pemeriksaan independen ULANG atas model yang sudah live — bukan retrain, bukan monitoring. Monitoring [M7.5] bertanya «apakah angkanya masih normal?»; revalidasi bertanya «apakah model ini MASIH LAYAK dipakai, dengan bukti yang sama ketatnya seperti saat pertama disetujui?». Empat pemicu yang mewajibkannya: (1) **Data baru** — snapshot data yang berbeda secara material dari yang dipakai melatih. (2) **Penggunaan baru** — model dipakai untuk tujuan atau populasi yang tidak tercantum dalam persetujuan awal. (3) **Temuan monitoring [M7.5]** — PSI skor di atas 0,25 [kebijakan lesson ini] (seperti simulasi drift S2, PSI 0,5811 [m75_drift_simulations.S2_pay_plus1.psi_score_vs_baseline_test]), ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] atau PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode berturut-turut, ECE di atas 0,02 [kebijakan lesson ini] yang bertahan, atau alert fairness — AIR grup mana pun di bawah 0,80 [kebijakan lesson ini] selama 2 periode berturut-turut. (4) **Kalender** — revalidasi terjadwal, [keputusan kebijakan lesson ini] paling lambat 12 bulan sejak approval terakhir, walau tidak ada pemicu lain yang menyala.

Hasil revalidasi hanya ada tiga: MASIH LAYAK, LAYAK DENGAN SYARAT, atau TIDAK LAYAK (persetujuan dicabut, rollback ke versi sebelumnya — untuk threshold, kembali ke 0,10 [M7.4]).

**Nilai:** pemicu revalidasi yang tertulis menghilangkan perdebatan «apakah ini sudah cukup parah untuk diperiksa?» — jawabannya sudah ditulis sebelum masalah datang. PSI simulasi drift S2 0,5811 tidak perlu diperdebatkan; ia sudah masuk daftar pemicu sejak hari pertama.

**Baik/buruk:** revalidasi berkala bagus karena ia menangkap decay bertahap yang tidak pernah melewati ambang harian. Buruk bila revalidasi hanya dipicu kalender dan temuan monitoring diabaikan: jadwal tahunan tidak menolong bila PSI sudah 0,5811 (simulasi drift S2) di bulan ketiga. Kedua jenis pemicu harus hidup bersamaan — kalender sebagai jaring pengaman, temuan sebagai alarm.

**Mitigasi:** tuliskan keempat pemicu ini di model card [M8.3] — di samping tanggal approval — sehingga siapa pun yang membaca model card tahu persis kapan model ini harus diperiksa ulang, tanpa perlu bertanya kepada owner. Dan di revalidasi, baris pertama yang diperiksa adalah issue register lama [M8.1]: temuan yang masih terbuka dari validasi sebelumnya adalah temuan pertama di laporan baru — dan temuan yang melewati due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi.

---

## 8. Audit Trail: Sepuluh Kolom G10 [M7.4] — Jejak yang Bisa Dibuka Setahun Kemudian

Sepuluh kolom wajib untuk setiap versi model [M7.4]: (1) model version, (2) feature schema version, (3) calibration version, (4) threshold policy version, (5) data snapshot, (6) code/notebook hash, (7) approval date, (8) owner, (9) rollback version, (10) alasan perubahan. Model card [M8.3] menjelaskan modelnya, audit trail menjelaskan KEPUTUSANNYA — dan keduanya merujuk ke versi yang sama.

Kolom yang paling sering hilang — dan paling mahal saat hilang. Feature schema version: tanpa ini, validasi ulang memakai skema yang salah. Calibration version: tanpa ini, tidak ada yang tahu apakah 0,10 yang tercatat adalah 0,10 dari model terkalibrasi atau 0,10 dari model mentah — dan keduanya berarti hal yang berbeda (pemetaan probabilitas berbeda: Brier mentah 0,1342 vs terkalibrasi 0,1345; LR mentah pada 0,10 menyetujui 20,25% vs champion 28,5% [M8]). Code/notebook hash: tanpa ini, kode mana yang menghasilkan model itu tidak bisa dibuktikan. Rollback version: tanpa ini, kamu tahu harus kembali — tapi tidak tahu ke mana.

**Nilai:** audit trail yang lengkap membuat keputusan BISA DIBUKTIKAN, bukan hanya diingat. «Kami menyetujui threshold 0,15 pada 13 November» adalah klaim; baris audit trail dengan sepuluh kolom terisi adalah bukti.

**Baik/buruk:** sepuluh kolom ini bagus sebagai STANDAR MINIMUM — cukup untuk merekonstruksi, tidak berlebihan sampai tidak ada yang mau mengisinya. Buruk bila trail ditulis BELAKANGAN dari ingatan: catatan yang direkonstruksi sesudah audit diumumkan bukan audit trail — ia karangan. Trail ditulis SAAT keputusan diambil, oleh sistem yang mencatatnya.

**Mitigasi:** jadikan kelengkapan audit trail sebagai SYARAT deploy — deploy tidak jalan bila satu kolom kosong. Log dengan 6 dari 10 kolom terisi (completeness 0,6) tidak boleh naik produksi, betapa pun bagusnya model di baliknya.

---

## 9. Jebakan: Sign-off sebagai Stempel Karet — Komite yang Tidak Pernah Menolak

Jebakan paling berbahaya di lesson ini tidak terlihat seperti kegagalan — ia terlihat seperti kelancaran. Komite yang menyetujui SEMUA proposal, validator yang tidak pernah menemukan kelemahan, sign-off yang selesai dalam lima menit, template G10 yang disalin dari proposal sebelumnya dengan tanggal diganti. Tiga gejala yang bisa diperiksa dari luar: (1) tingkat penolakan NOL dalam jangka panjang; (2) sign-off sesudah deploy; (3) opini validasi yang tidak pernah menyebut kelemahan — padahal model dengan ROC-AUC 0,7816 [M6.4] punya kelemahan yang TERUKUR (belahan A vs B berselisih −0,0139 [M8.1]; seed menggerakkan approval 0,63 poin persen [M8.1]).

Tiga penyebab yang semuanya manusiawi: TEKANAN WAKTU, DEFERENSI («validator pasti sudah memeriksa»), dan INSENTIF («komite yang menolak dianggap penghambat»).

**Nilai:** mengenali stempel karet bagus karena ia satu-satunya jebakan governance yang TIDAK menghasilkan alarm — PSI tidak berteriak, ROC-AUC tidak turun, dashboard hijau. Satu-satunya detektornya adalah audit internal yang memeriksa PROSES: berapa proposal ditolak, berapa sign-off yang datang sesudah deploy, berapa opini yang menyebut kelemahan.

**Baik/buruk:** komite yang cepat menyetujui bagus bila kecepatannya datang dari proposal yang memang siap. Buruk bila kecepatannya datang dari tidak adanya pemeriksaan: persetujuan lima menit atas perubahan threshold yang menggerakkan NT$2.723.500 [M6.4] bukan efisiensi — ia kelalaian yang rapi.

**Mitigasi:** tiga pengunci — (1) deploy diblokir sistem tanpa nomor persetujuan komite yang tercatat; (2) audit internal mengambil sampel keputusan tiap kuartal dan melaporkan tingkat penolakan serta sign-off terlambat; (3) penolakan dicatat sebagai HASIL KERJA yang sah.

---

## 10. Mini-case: Alur Perubahan Threshold 0,10 ke 0,15 — Siapa Harus Setuju, Gerbang Mana Dilewati?

Kasusnya nyata, angkanya kanonis [M6.4]: tim bisnis mengusulkan threshold naik dari 0,10 ke 0,15. **Gerbang 1 — Proposal:** owner menulis perubahan + dampak yang dihitung DULU: approval 28,5% ke 49,88% (+21,38 poin persen, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 poin persen, +155 default yang disetujui), cost NT$33.046.500 ke NT$35.770.000 (+NT$2.723.500), profit +NT$8.214.000 ke +NT$5.490.500 (−NT$2.723.500). **Gerbang 2 — Offline validation:** validator independen mengulang paket lengkap — termasuk AIR SEX (0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air] — fairness sedikit MEMBAIK) dan stabilitas belahan A vs B [M8.1]. **Gerbang 3 — Legal/risk approval:** legal dan risk manager menandatangani template-nya — termasuk «apakah 155 default tambahan ini masih dalam selera risiko?». **Gerbang 4 — Shadow/canary:** threshold 0,15 dijalankan berdampingan dengan 0,10 pada sebagian trafik. **Gerbang 5 — Production:** 0,15 berlaku, 0,10 menjadi rollback version. **Gerbang 6 — Rollback criteria,** VERIFIKASI kriteria yang ditulis di gerbang 1 sebelum produksi: cabut 0,15 dan kembali ke 0,10 bila bad rate yang disetujui melewati ambang yang ditulis (misalnya di atas 10% selama 2 periode [kebijakan lesson ini]) atau AIR SEX jatuh di bawah 0,80 [kebijakan lesson ini].

Jalan pintasnya: threshold diubah diam-diam — satu baris konfigurasi, tanpa proposal, tanpa validasi, tanpa tanda tangan. Dampak angkanya SAMA (profit tetap turun NT$2.723.500) — tapi tiga hal hilang: tidak ada yang bisa dimintai pertanggungjawaban, rollback version tidak tercatat, dan komite tidak pernah mendapat kesempatan menolak atau meminta syarat.

**Nilai:** mini-case ini menunjukkan governance BUKAN tentang menolak perubahan — threshold 0,15 MUNGKIN saja disetujui komite, karena AIR-nya membaik dan profitnya masih positif (+NT$5.490.500). Governance adalah tentang MEMUTUSKAN dengan mata terbuka, oleh orang yang tepat, dengan jejak yang lengkap.

**Baik/buruk:** perubahan 0,10 ke 0,15 bagus sebagai CONTOH karena angkanya cukup besar untuk serius (NT$2.723.500) tapi cukup kecil untuk menggoda jalan pintas («hanya threshold»). Buruk bila dibaca sebagai «jadi 0,15 pasti disetujui»: komite bisa saja menolak — misalnya karena selera risiko tidak mengizinkan +155 default tambahan — dan penolakan itu adalah HASIL YANG SAH.

**Mitigasi:** sebelum mengusulkan perubahan apa pun, hitung dulu dampaknya — approval, bad rate, cost, profit, jumlah nasabah yang keputusannya berubah — dan lampirkan angka itu pada proposal. Proposal tanpa angka dampak bukan proposal; ia permintaan.

---

## 10a. Capstone Wajib: Satu Perubahan, Sembilan Artefak — Buktikan Kamu Bisa Menjalankan Governance-nya

Capstone akhir Modul M8 — BUKAN lesson baru. Kamu menerima SATU perubahan: threshold flagship 0,10 → 0,15 [M6.4]. Hasilkan SEMBILAN artefak: (1) validation report (M8.1) — traffic-light verdict atas perubahan ini; (2) tiering score (M8.2); (3) model card 17 kolom (M8.3); (4) shadow/canary decision (M8.4); (5) gate sheet tujuh gate (M8.4); (6) rollback runbook 10 bagian < 30 menit [kebijakan lesson ini] (M8.4); (7) RACI/sign-off (M8.5); (8) audit trail sepuluh kolom G10, kelengkapan 1,0 (M8.5); (9) keputusan final — NAIK / TIDAK NAIK / NAIK DENGAN SYARAT — dengan alasan satu paragraf yang merujuk ke artefak 1–8.

Angka yang dipakai (jangan dikarang): approval 28,5% → 49,88% (+1.283 nasabah), bad rate 6,67% → 8,99% (+155 default disetujui), cost +NT$2.723.500, profit −NT$2.723.500; AIR SEX 0,8694 → 0,8906 [m71_air_sex_by_threshold.0.15.air]; pada 0,20 profit sudah −NT$216.500.

**Rubric — sepuluh pemeriksaan, semuanya harus lolos:** (1) version ID konsisten di kesembilan artefak (G13, M8.3); (2) angka konsisten di semua artefak; (3) status gate konsisten (gate sheet = validation report = keputusan final); (4) owner tertulis di tiap artefak; (5) due date tertulis untuk tiap syarat/temuan; (6) kondisi revalidation tertulis di model card; (7) prohibited_use terisi (hard rule, M8.3); (8) rollback runbook < 30 menit; (9) RACI lengkap — tepat satu A per tahap; (10) keputusan final beralasan dengan rujukan ke artefak 1–8. Satu item gagal = capstone gagal — bukan karena vonisnya salah, melainkan karena artefakmu bertentangan satu sama lain.

---

## Lab 1: Nilai Perubahan Threshold 0,10 ke 0,15 — dan Putuskan Gerbangnya

Angka kanonis [M6.4], GBM terkalibrasi, test 6.000, LGD 0,45, margin 0,05. Threshold 0,10: approval 0,285 (1.710 disetujui), bad rate 0,0667 (114 default disetujui), cost NT$33.046.500, profit +NT$8.214.000. Threshold 0,15: approval 0,4988 (2.993 disetujui), bad rate 0,0899 (269 default disetujui), cost NT$35.770.000, profit +NT$5.490.500. Threshold 0,20 sebagai pembanding: approval 0,6513, bad rate 0,1113, cost NT$41.477.000, profit −NT$216.500.

Hasil [lab]: approval_delta_pp=21.38; bad_rate_delta_pp=2.32; cost_delta_NT=2723500; profit_delta_NT=-2723500; n_approved_delta=1283; approved_defaults_delta=155; profit_delta_020_NT=-8430500; gates_required=6. Perubahan 0,10 ke 0,15 «hanya» menggeser threshold 0,05 — tapi menggerakkan 1.283 keputusan dan NT$2.723.500, dan membutuhkan KEENAM gerbang G10 [M7.4]. Pada 0,20, profit sudah negatif (−NT$216.500).

## Lab 2: Audit Trail — Kolom G10 Mana yang Hilang dari Log Keputusan?

Log keputusan [ilustrasi — isinya eksplisit]: versi gbm-cal-v2.1, threshold 0,10 diubah ke 0,15. Terisi: model version «gbm-cal-v2.1», threshold policy version «thr-0.15», data snapshot «uci-2026-11», approval date «2026-11-13», owner «Risk Analytics», alasan perubahan «naikkan approval» — enam kolom. Kosong: feature schema version, calibration version, code/notebook hash, rollback version.

Hasil [lab]: missing=feature schema version, calibration version, code/notebook hash, rollback version; missing_count=4; completeness=0.6; audit_pass=False. Kelengkapan 0,6 BUKAN «hampir lolos» — audit trail mensyaratkan kelengkapan 1,0. Tanpa rollback version, tim tidak tahu ke versi apa kembali bila 0,15 gagal; tanpa calibration version, tidak ada yang bisa membuktikan apakah 0,15 itu dari model terkalibrasi atau mentah; tanpa code/notebook hash, modelnya tidak bisa direproduksi; tanpa feature schema version, validasi ulang memakai skema yang mungkin salah. Vonis: v2.1 TIDAK BOLEH naik produksi sampai lognya lengkap.

---

## Guided Task di Colab

Notebook: colab/mlf-m85-guided-task.ipynb — replikasi flagship GBM + kalibrasi Platt, ekonomi threshold 0,10 vs 0,15 vs 0,20 vs 0,50 [M6.4] dari data UCI, penilaian perubahan threshold lewat enam gerbang G10 [M7.4], dan audit trail sepuluh kolom G10 dengan pemeriksaan kelengkapannya — semua dengan checks. Tautan Colab: https://colab.research.google.com/drive/10C2owTwkDO4Z3vW-LUdkeq_Z5RcWMZ2-

## Rangkuman

- Governance empat peran: komite model risk (memutuskan boleh/tidak), model owner (accountable saat live), validator independen [M8.1] (memeriksa tanpa membangun), audit internal (memeriksa prosesnya).
- RACI: Responsible mengerjakan, Accountable menjawab (tepat satu per keputusan), Consulted diajak bicara sebelum, Informed diberitahu sesudah.
- Alur approval lima tahap: proposal → validasi [M8.1] → sign-off → deploy [M8.4] → monitoring [M7.5] — setiap tahap bisa menghentikan alur; temuan monitoring kembali ke proposal lewat revalidasi.
- Sign-off: empat tanda tangan (validator, owner, legal/risk, komite) sesudah membaca opini validasi + model card [M8.3] + ekonomi [M6.4]; penolakan adalah hasil yang sah; tanda tangan sesudah deploy adalah pembenaran.
- Change control G10 [M7.4]: enam gerbang (proposal → offline validation → legal/risk approval → shadow/canary → production → rollback criteria, verifikasi kriteria yang ditulis di gerbang 1 sebelum produksi); rollback v2 = threshold tunggal 0,10.
- Perubahan threshold 0,10 ke 0,15 [M6.4]: approval 28,5% ke 49,88% (+21,38 pp, +1.283 nasabah), bad rate 6,67% ke 8,99% (+2,32 pp, +155 default disetujui), cost +NT$2.723.500, profit −NT$2.723.500; pada 0,20 profit −NT$216.500; pada 0,50 profit −NT$18.994.456.
- Revalidasi wajib bila: data baru, penggunaan baru, temuan monitoring [M7.5] (PSI skor di atas 0,25 [kebijakan lesson ini], ROC-AUC turun lebih dari 0,02 [kebijakan lesson ini] / PR-AUC turun lebih dari 0,03 [kebijakan lesson ini] dalam 2 periode, ECE di atas 0,02 [kebijakan lesson ini] bertahan, AIR di bawah 0,80 [kebijakan lesson ini] selama 2 periode), atau kalender (paling lambat 12 bulan sejak approval terakhir).
- Audit trail G10 [M7.4]: sepuluh kolom wajib — kelengkapan 1,0, ditulis saat keputusan diambil; log v2.1 [ilustrasi] dengan 4 kolom hilang (completeness 0,6) berarti audit GAGAL.
- Exception: template 10 kolom — exception tanpa expiry otomatis invalid; hard constraint (AIR < 0,80, ECE > 0,02) tidak bisa di-exception-kan; diperpanjang 2× menjadi change request.
- Decision protocol: kuorum minimum [kebijakan organisasi], recusal bila conflict of interest, delegated authority, tie-breaker/eskalasi, approval timestamp, digital evidence, SLA KUNING/MERAH [kebijakan organisasi] — keputusan tanpa kuorum INVALID.
- Capstone (akhir M8.5): satu perubahan (threshold 0,10 → 0,15) → 9 artefak (validation report, tiering score, model card 17 kolom, shadow/canary decision, gate sheet, rollback runbook, RACI/sign-off, audit trail, keputusan final) — rubric 10 pemeriksaan, semuanya harus lolos.
- Jebakan: sign-off stempel karet — komite yang tidak pernah menolak, sign-off sesudah deploy, opini validasi tanpa kelemahan.
- Mini-case: 0,10 ke 0,15 mungkin saja disetujui (AIR SEX 0,8694 ke 0,8906 [m71_air_sex_by_threshold.0.15.air], profit masih positif) — governance memutuskan dengan mata terbuka, bukan menolak semua perubahan.
- Lab: perubahan 0,10 ke 0,15 menggerakkan 1.283 keputusan dan NT$2.723.500 serta butuh keenam gerbang; log v2.1 [ilustrasi] kehilangan 4 kolom G10 (completeness 0,6) — audit GAGAL.
- Ini lesson terakhir Modul M8 — tidak ada lesson berikutnya.

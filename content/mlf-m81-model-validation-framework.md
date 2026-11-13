# MLF-M8.1: Model Validation Framework — Siapa yang Berhak Bilang Modelmu Bagus?

## Masalah: Model «Lolos Test» — tapi Validator Tetap Memberi Catatan

Tim model datang dengan kabar gembira: GBM credit scoring mereka «lolos test» — ROC-AUC GBM mentah 0,7823, PR-AUC 0,5597, Brier 0,1342; setelah kalibrasi Platt, model keputusan 0,7816 / 0,5558 / 0,1345; threshold 0,10 menyetujui 28,5% nasabah dengan bad rate 6,67%, biaya total NT$33.046.500 dan profit +NT$8.214.000 [M6.4]. Semua angka itu benar. Lalu satu baris lagi di laporan mereka: ROC-AUC train GBM mentah 0,8469 — selisih train-test 0,0646. Model yang sama, diukur pada data yang pernah dilihatnya, 0,0646 lebih baik daripada di data yang belum dilihatnya. Apakah itu masalah? Dan siapa yang berhak menjawabnya — tim yang membangun model, atau validator?

Jawabannya: skor test BUKAN vonis. Skor test adalah BUKTI — dan validasi adalah PROSES yang memutuskan apakah bukti itu boleh dipercaya, dalam kondisi apa, dan dengan catatan apa. Framework validasi itu punya nama dan aturan main yang ditulis regulator: SR 11-7 (Federal Reserve) / OCC 2011-12, guidance tentang model risk management (2011).

Angka acuan: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur [notebook]; model keputusan GBM terkalibrasi Platt/sigmoid (CalibratedClassifierCV cv=3 [notebook]), threshold operasional 0,10, LGD 0,45, margin 0,05 [notebook]. Validation halves: test 6.000 dibelah stratified menjadi half A dan half B (n=3.000 masing-masing, seed 42). Semua angka halves di lesson ini berasal dari m8_canonical.json, dihitung dari data, bukan karangan.

---

## 1. Model «Lolos Test» — tapi Validator Tetap Memberi Catatan

**Nilai:** validasi adalah selisih antara «model yang angkanya bagus» dan «model yang BOLEH dipakai». Tanpa validasi, angka test 0,7823 adalah klaim dari pihak yang berkepentingan — tim yang membangun model. Dengan validasi, angka yang sama menjadi keputusan yang bisa dipertanggungjawabkan: siapa yang memeriksa, apa yang diperiksa, dan apa syaratnya.

**Baik/buruk:** ROC-AUC GBM mentah 0,7823 di test itu bagus sebagai BUKTI — ia direplikasi dari data, konsisten dengan nested CV 0,7858 (sd antar-fold 0,0068) [M6.2], dan mengalahkan LR 0,7426. Buruk bila dibaca sebagai «model ini bagus, titik»: gap train-test 0,0646, ECE per grup 0,1208 pada AGE 60+ (n=76 — temuan-investigasi, di bawah gate 200) [M7.1], dan bad rate yang berayun 1,06 poin persen antar-half adalah tiga hal yang tidak terlihat dari satu angka 0,7823 — dan ketiganya adalah urusan validator, bukan urusan skor.

**Mitigasi:** jangan pernah menerima — atau menolak — model dari satu angka. Tanyakan tiga hal sebelum memutuskan: apakah metodenya masuk akal (conceptual soundness)? Apakah hasilnya bertahan saat diuji ulang (outcomes analysis)? Dan siapa yang memeriksa — apakah ia independen?

---

## 2. SR 11-7: Model Risk Itu Apa, dan Tiga Pilar yang Menahannya

SR 11-7 (Federal Reserve) / OCC 2011-12 adalah guidance (2011) tentang model risk management — dokumen acuan industri untuk bank yang memakai model dalam keputusan. Ia tidak memberi rumus; ia memberi KERANGKA: siapa bertanggung jawab atas apa, dan bukti apa yang harus ada sebelum model dipakai. Lesson ini memakai kerangka itu sebagai acuan praktik terbaik (best practice) — bukan sebagai peraturan yang mengikat bank kita yang fiktif — dan setiap aturan operasional lesson ini dilabeli [kebijakan lesson ini] agar tidak tertukar dengan isi SR 11-7 sendiri.

**Definisi kunci:** model risk adalah potensi KONSEKUENSI MERUGIKAN (finansial maupun non-finansial) akibat keputusan yang didasarkan pada output model yang SALAH atau DISALAHGUNAKAN. Dua sumber konsekuensi merugikan yang berbeda: model yang salah (asumsinya keliru, datanya cacat, kalibrasinya rusak) dan model yang disalahgunakan (modelnya benar, tapi dipakai di luar batasnya — misalnya threshold 0,10 yang diturunkan dari probabilitas terkalibrasi dipakai pada probabilitas mentah LR yang tidak terkalibrasi; 0,10 LR bukan 0,10 GBM terkalibrasi — labeli selalu). Validator memeriksa KEDUANYA.

**Tiga elemen SR 11-7:** (1) Model development, implementation, and use — tim model membangun, mengimplementasikan, dan memakai model dengan dokumentasi yang lengkap: data apa, asumsi apa, batasan apa. (2) Model validation — pihak independen menguji model itu: apakah konsepnya masuk akal, apakah hasilnya bertahan, apakah batasannya dihormati. (3) Governance — kebijakan, peran, dan kontrol yang mengikat keduanya: siapa pemilik model, siapa validator, siapa yang memutuskan, dan apa yang terjadi bila validasi gagal.

**Nilai:** tiga elemen ini bagus karena ia memisahkan tiga pertanyaan yang sering dicampur: «apakah modelnya dibangun dengan benar?» (elemen 1), «apakah modelnya TERBUKTI benar?» (elemen 2), dan «siapa yang bertanggung jawab bila ternyata salah?» (elemen 3).

**Baik/buruk:** SR 11-7 bagus sebagai KERANGKA — ia memberi bahasa yang sama untuk pembangun, validator, dan manajemen. Buruk bila dibaca sebagai CHECKLIST: «kami sudah menjalankan tiga elemen» tidak berarti apa-apa bila validasinya hanya memeriksa ROC-AUC atau bila validatornya adalah tim yang sama dengan pembangunnya.

**Mitigasi:** untuk setiap model, tulis tiga baris sebelum validasi dimulai — siapa pemilik model (elemen 1), siapa validator independennya (elemen 2), dan siapa pengambil keputusan akhirnya (elemen 3). Bila satu dari tiga nama itu kosong atau sama dengan yang lain, validasi belum bisa dimulai.

---

## 3. Three Lines of Defense: Siapa Memeriksa Siapa

**First line (lini pertama):** pemilik model dan bisnis — tim yang membangun, memakai, dan memonitor model sehari-hari. Mereka yang tahu modelnya paling dalam — dan karena itu mereka yang paling berkepentingan agar modelnya lolos. **Second line (lini kedua):** validasi independen dan risk management — mereka yang MENGUJI model lini pertama, menantang asumsinya, dan memberi verdict. Mereka tidak membangun model; mereka mempertanyakannya. **Third line (lini ketiga):** audit internal — mereka yang memeriksa APAKAH lini pertama dan kedua menjalankan tugasnya: apakah validasi benar-benar independen, apakah temuannya ditindaklanjuti, apakah governance-nya berjalan.

Arah panahnya: lini pertama membangun dan memakai; lini kedua menguji dan memberi verdict; lini ketiga mengaudit keduanya; lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit — bukan satu sama lain. Lini kedua TIDAK melapor ke lini pertama: validator yang melapor ke kepala tim model adalah validator yang gajinya bergantung pada orang yang ia periksa.

**Nilai:** pembagian tiga lini ini bagus karena ia membuat konflik kepentingan menjadi TERLIHAT dan TERKELOLA, bukan disembunyikan. Lini pertama BOLEH optimistis — itu tugasnya. Lini kedua WAJIB skeptis — itu tugasnya.

**Baik/buruk:** tiga lini bagus bila masing-masing punya wewenang NYATA — lini kedua bisa menahan model (verdict MERAH berarti jangan deploy), lini ketiga bisa menghentikan proses. Buruk bila lini kedua hanya «memberi masukan» tanpa hak veto, atau bila lini ketiga tidak pernah memeriksa validasi itu sendiri.

**Mitigasi:** di laporan validasimu, tulis eksplisit di halaman pertama — lini pertama (siapa pemilik model), lini kedua (siapa validator), lini ketiga (kapan audit terakhir memeriksa proses ini). Bila validator dan pemilik model adalah orang yang sama, tulis itu juga — sebagai TEMUAN, bukan sebagai hal yang biasa.

---

## 4. Conceptual Soundness: Apakah Metodenya Masuk Akal — Sebelum Melihat Skornya

Conceptual soundness adalah elemen pertama validasi: periksa KONSEP model sebelum memeriksa ANGKAnya. Validator menanyakan tiga hal: apakah ASUMSI metodenya cocok dengan masalahnya? Apakah DATAnya layak untuk metode itu? Dan apakah METODE yang dipilih sesuai dengan tujuan pemakaiannya?

**Asumsi:** Logistic Regression (LR) mengasumsikan hubungan yang LINEAR antara fitur dan log-odds default. GBM tidak membuat asumsi itu: ia non-parametrik, mempelajari bentuk hubungan apa pun dari data. Itu sebabnya GBM mentah (ROC-AUC 0,7823) mengalahkan LR (0,7426): konsisten dengan hubungan yang tidak linear — belum diuji dengan spline atau interaksi, jadi ini bukti yang mendukung, bukan pembuktian. Tapi fleksibilitas itu ada harganya: GBM lebih mudah menghafal train — dan gap train-test 0,0646 (train 0,8469 vs test 0,7823) adalah harga yang terlihat. Bukti pengendalinya: nested CV GBM 0,7858 (sd antar-fold 0,0068) [M6.2] — sejalan dengan test 0,7823, jadi gap 0,0646 adalah overfitting yang TERUKUR dan TERBATAS, bukan model yang runtuh.

**Data:** dataset UCI ini SATU snapshot 30.000 baris tanpa tanggal: tidak ada deret waktu, tidak ada populasi masa depan. Semua klaim validasi di lesson ini adalah klaim tentang POPULASI SNAPSHOT INI — bukan janji tentang populasi tahun depan. Itulah sebabnya ongoing monitoring menjadi syarat deployment, bukan hiasan. Validator juga memeriksa representasi: base rate default 0,2212, 31 fitur, dan grup kecil yang hasilnya tidak bisa dipercaya (AGE 60+ hanya n=76 di test).

**Metode:** kalibrasi Platt (sigmoid) dipakai karena keputusan uang (threshold 0,10) butuh probabilitas yang JUJUR, bukan sekadar ranking yang bagus. GBM mentah punya ranking yang sedikit lebih baik (ROC-AUC 0,7823 vs terkalibrasi 0,7816) — tapi threshold 0,10 hanya bermakna bila skor 0,10 sungguh berarti peluang default 10%. Validator memeriksa pilihan ini: apakah kalibrasi memang dibutuhkan untuk pemakaian model? Ya — karena threshold diturunkan dari biaya (LGD 0,45, margin 0,05 [M6.4]), dan biaya itu dihitung dari probabilitas.

**Nilai:** conceptual soundness bagus karena ia menangkap kesalahan yang TIDAK TERLIHAT di skor test. Model dengan asumsi yang salah bisa tetap punya ROC-AUC tinggi — ia hanya sedang menjawab pertanyaan yang salah dengan sangat baik.

**Baik/buruk:** pemeriksaan konsep bagus bila ia SPESIFIK — «LR mengasumsikan linearitas log-odds; buktikan asumsi itu cukup baik di data ini» — dan buruk bila ia GENERIK — «metode sudah sesuai standar» tanpa menyebut asumsi mana yang diperiksa.

**Mitigasi:** sebelum validasi angka apa pun, tulis daftar asumsi model (linearitas? independensi? stasioneritas? snapshot?) dan untuk tiap asumsi: apakah ia masuk akal di data ini, dan apa yang terjadi bila ia salah. Daftar itu adalah halaman pertama laporan validasi — bukan lampiran.

---

## 4a. Desain Validasi: Cegah Leakage, Pilih Split yang Jujur, Jangan Pakai Ulang Test

Tiga keputusan desain sebelum satu metrik pun dihitung. **Satu — ketersediaan fitur:** «fitur ini tersedia KAPAN?» Delapan fitur turunan flagship semuanya dihitung dari riwayat bulan lalu — tersedia saat pengajuan diputuskan, jadi lolos. Yang gagal adalah fitur yang baru ada SETELAH keputusan (mis. «pembayaran bulan depan» untuk memutuskan bulan ini) — leakage yang membuat ROC-AUC terlihat bagus dan model tidak berguna di live. Anti-leakage di level pipeline sudah diajarkan di M6.2; yang baru di sini adalah cek KETERSEDIAAN WAKTU-nya. **Dua — pembagian data:** split acak menjawab «apakah model bekerja pada nasabah yang mirip dengan yang dilatih?» — dan hanya itu. Temporal split (latih periode lama, uji periode baru) dan group split (latih satu grup, uji grup lain) adalah pertanyaan yang lebih keras — dan keduanya TIDAK MUNGKIN di snapshot UCI tanpa tanggal. Batasan itu ditulis, bukan disembunyikan: klaim validasi lesson ini adalah klaim tentang snapshot ini; kompensasinya monitoring + revalidasi. Split waktu untuk deret waktu sudah diajarkan di M6.2 (walk-forward BBCA). **Tiga — pakai ulang test:** test 6.000 sudah dipakai memilih threshold (M6.4), membandingkan model (M6.5), memvalidasi (lesson ini), dan nanti memilih challenger (M8.4). Aturannya: test final dipakai SATU KALI untuk vonis akhir; sesudah itu ia referensi, bukan test segar. Challenger baru dibandingkan pada validation split yang segar atau nested CV [M6.2].

**Jebakan:** leakage tidak terlihat di ROC-AUC — fitur bocor justru membuat ROC-AUC NAIK. Satu-satunya yang menangkapnya adalah cek ketersediaan waktu.

---

## 5. Outcomes Analysis: Uji Ulang Hasilnya — Validation Halves A vs B

Outcomes analysis adalah pilar kedua validasi: UJI ULANG hasil model pada data yang belum dipakai untuk klaimnya. Validator menjawabnya dengan VALIDATION HALVES: belah test 6.000 menjadi dua secara stratified (half A dan half B, n=3.000 masing-masing, seed 42) dan hitung SEMUA metrik di tiap belahan. Bila metriknya berayun lebar antar-belahan, maka «temuan» pada test penuh mungkin hanya noise belahan.

**Nilai [m8_canonical.json]** — model keputusan GBM terkalibrasi, threshold 0,10. Half A: ROC-AUC 0,7885, PR-AUC 0,5656, approval 28,77%, bad rate 6,14%, ECE 0,0114, Brier 0,1329. Half B: ROC-AUC 0,7746, PR-AUC 0,5480, approval 28,23%, bad rate 7,20%, ECE 0,0104, Brier 0,1361. Selisih B−A: ROC-AUC −0,0139, PR-AUC −0,0176, approval −0,54 poin persen, bad rate +1,06 poin persen, ECE −0,0010, Brier +0,0032, base rate −0,03 poin persen. Base rate hampir IDENTIK (A 0,2213 vs B 0,2210) — belahannya memang setara, jadi ayunan metriknya bukan efek komposisi.

**Bacalah selisih itu seperti validator.** ROC-AUC berayun 0,0139 antar-half — bandingkan dengan GALAT SAMPLING SELISIH dua estimasi, bukan dengan sd antar-fold nested CV 0,0068 [M6.2]: sd ROC-AUC per half (n=3.000) ≈ 0,008–0,009, jadi sd selisihnya ≈ 0,011–0,013, dan 0,0139 ≈ 1,1–1,3 sd selisih — wajar, karena tiap half lebih kecil dan ROC-AUC pada sampel yang lebih kecil memang lebih berisik. (Aritmetika 0,0139/0,0068 ≈ 2,04 memang benar, tetapi pembandingnya salah: selisih dua estimasi tidak dibandingkan dengan sd satu skor.) PR-AUC berayun 0,0176 — juga wajar untuk metrik yang lebih sensitif pada data tak seimbang. ECE berayun hanya 0,0010 — kalibrasi STABIL di kedua belahan. Brier berayun 0,0032 — kecil. Satu-satunya ayunan yang menarik perhatian validator: bad rate yang disetujui, 6,14% di A vs 7,20% di B — selisih +1,06 poin persen. Bad rate dihitung pada nasabah yang DISETUJUI saja (sekitar 860 per half), jadi penyebutnya kecil dan ayunannya wajar secara statistik — tapi validator tidak boleh mengabaikannya begitu saja: bad rate adalah metrik UANG, dan ayunan 1,06 poin persen pada 860 nasabah adalah selisih 8 nasabah default (A: 0,0614 × 863 = 53; B: 0,0720 × 847 = 61). Itulah yang membuat verdict lesson ini KUNING, bukan HIJAU.

**RANKING INVARIAN ≠ APPROVAL INVARIAN.** ROC-AUC A vs B hanya berbeda 0,0139 — ranking model hampir sama di kedua belahan. Tapi keputusan APPROVAL (siapa yang lolos threshold 0,10) bergeser: approval 28,77% vs 28,23%, dan bad rate di antara yang disetujui bergeser 1,06 poin persen. Ranking mengukur URUTAN; approval mengukur KEPUTUSAN pada satu titik potong — dan titik potong itu sensitif terhadap pergeseran kecil distribusi skor di sekitar 0,10. Validator yang hanya memeriksa ROC-AUC akan menyimpulkan «stabil» — dan melewatkan bahwa keputusan uangnya berayun.

$$\mathrm{ECE} = \sum_{b=1}^{10} \frac{n_b}{n}\, \bigl|\bar{p}_b - \bar{y}_b\bigr|, \qquad \begin{array}{ll} \mathrm{ECE} < 0{,}02 & \text{lolos [kebijakan lesson ini]} \\ 0{,}02 \le \mathrm{ECE} < 0{,}05 & \text{catatan (KUNING)} \\ \mathrm{ECE} \ge 0{,}05 & \text{tolak (MERAH)} \end{array}$$

ECE test 0,0087; half A 0,0114; half B 0,0104 — ketiganya di bawah 0,02, jadi kalibrasi lolos di semua belahan. Band 0,02/0,05 adalah [kebijakan lesson ini], bukan konstanta alam.

---

## 5a. Kuantifikasi Ketidakpastian: Tiap Angka Punya Pita — dan Pita Itu Bisa Membalik Verdict

Setiap angka lesson ini adalah SATU pengukuran dari satu sampel. Bootstrap (B=2.000, seed 42, model tetap, resampling baris test) memberi interval kepercayaan 95% [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; approval 28,5% CI95 [27,33%; 29,65%]; ECE 0,0087 CI95 [0,0077; 0,0214] — batas atasnya MELEWATI ambang lolos 0,02; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]. Selisih antar-half: bad rate +1,06 pp CI95 [−1,26; +3,35] — melintasi nol (sekitar 19,7% ulangan memberi selisih ≤ 0), ambang HIJAU 1,0, dan melintasi MERAH 3,0; ROC-AUC −0,0139 CI95 [−0,0428; +0,0132]; ECE −0,0010 CI95 [−0,0142; +0,0118].

**Aturan lesson ini:** verdict traffic-light tetap mengikuti ESTIMASI TITIK (1,06 > 1,0 → KUNING) — CI tidak mengubah band dan tidak membatalkan verdict. Yang diubah CI adalah TINDAK LANJUTNYA: verdict yang CI-nya melintasi ambang ditandai «tidak konklusif — investigate» — tulis CI di laporan, prioritaskan sampel lebih besar, revalidasi tidak boleh ditunda. HIJAU yang CI-nya melintasi ambang KUNING adalah «HIJAU dengan peringatan». MERAH yang CI-nya melintasi nol tetap MERAH. ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] — seluruh interval di atas 0,05, mis-kalibrasi kemungkinan besar nyata — tapi statusnya TETAP temuan-investigasi (n=76 < gate 200): CI memperkuat urgensi penyelidikan, bukan mengubah status. ECE Pascasarjana 0,0210 CI95 [0,0159; 0,0387] melintasi 0,02 — status KUNING-nya pun tidak konklusif. Bedanya dengan CI naif M6.2: di sana interval dari SE antar-fold; di sini dari bootstrap — karena bad rate/ECE/profit tidak punya rumus SE sederhana.

**Baik/buruk:** validation halves bagus karena ia MURAH dan JUJUR — tidak butuh data baru, hanya belahan baru dari data yang sama, dan ia memberi angka untuk pertanyaan «seberapa besar noise-nya?» Buruk bila dibaca sebagai «jadi test penuh tidak berguna»: halves BUKAN pengganti test — ia pelengkap. Dan buruk bila halves dipakai untuk MEMILIH model (memilih half yang angkanya bagus) — halves adalah alat UJI, bukan alat PILIH.

**Mitigasi:** setiap klaim outcomes analysis tuliskan BERSAMA ukuran sampelnya: «ROC-AUC 0,7816 (n=6.000), halves 0,7885 / 0,7746 (n=3.000)». Tanpa n, selisih 0,0139 tidak bisa dinilai — dengan n, ia menjadi informasi.

---

## 6. Ongoing Monitoring: Validasi Tidak Selesai Saat Model Deploy

Validasi punya tanggal kedaluwarsa. Semua bukti di langkah 4–5 diukur pada snapshot UCI yang sama. Begitu model live, populasinya bergerak, dan bukti kemarin tidak menjamin hari ini. Karena itu SR 11-7 menuntut ONGOING MONITORING: validasi tidak selesai saat model deploy; ia berlanjut sebagai pemantauan yang validator TETAPKAN SYARATNYA sebelum memberi lampu hijau.

Isi monitoringnya BUKAN materi baru lesson ini — ia adalah M7.5 (Monitoring & Drift), dan lesson ini hanya merujuknya, bukan mengajar ulang: PSI skor sebagai alarm pertama (train vs test 0,0017; ambang waspada 0,1 / geser besar 0,25); decay performa per periode (baseline test ROC-AUC 0,7816, PR-AUC 0,5558, ECE 0,0087, bad rate 6,67%); alerting dengan ambang yang ditulis dulu dan penanggung jawab yang ditulis dulu; dan pemicu retraining yang kuantitatif [M7.5]. Yang BARU di lesson ini adalah SUDUT PANDANGNYA: validator bukan yang memantau — validator yang MENULIS SYARAT pemantauan itu di laporan validasi, dan yang akan memeriksa di revalidasi berikutnya apakah syarat itu dipatuhi.

**Syarat monitoring yang validator tetapkan untuk model ini [kebijakan lesson ini]:** (1) PSI skor harian vs train, ambang 0,1 / 0,25 [M7.5]; (2) ROC-AUC, PR-AUC, approval rate, dan bad rate per periode vs baseline test (0,7816 / 0,5558 / 28,5% / 6,67%) — dengan perhatian KHUSUS pada bad rate, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; metrik berlabel ini hanya untuk cohort MATANG — label «default bulan depan» baru tersedia setelah jendela observasi 1 bulan lewat [M7.5], jadi per periode di sini berarti per periode setelah label matang; PSI skor tanpa label bisa dibaca harian. (3) ECE per periode, ambang 0,02 — karena threshold 0,10 bergantung pada kalibrasi; (4) revalidasi terjadwal 3 bulan setelah deploy, dipercepat bila satu metrik melewati ambangnya dua periode berturut-turut. Syarat-syarat ini adalah bagian dari verdict KUNING: model lolos DENGAN syarat-syarat ini, bukan tanpa syarat.

**Nilai:** ongoing monitoring bagus karena ia mengakui batas validasi: validasi membuktikan model BAGUS DI DATA KEMARIN — monitoring membuktikan model MASIH BAGUS HARI INI.

**Baik/buruk:** monitoring bagus bila ambangnya DITULIS DULU dari angka validasi (baseline test, ayunan halves) — dan buruk bila ambangnya ditebak sesudah melihat live. Buruk juga bila monitoring diserahkan tanpa pemilik: «dipantau berkala» tanpa nama dan frekuensi adalah janji kosong.

**Mitigasi:** di laporan validasi, tulis syarat monitoring sebagai DAFTAR yang bisa diaudit — metrik, ambang, frekuensi, pemilik, dan tanggal revalidasi. Di revalidasi berikutnya, validator pertama-tama memeriksa daftar itu: apakah yang dijanjikan benar-benar dipantau?

---

## 7. Independensi: Validator Bukan Pembangun Model — dan Kenapa Itu Bukan Formalitas

Syarat yang mudah diucapkan, tapi sering dilanggar dalam praktik: validator harus INDEPENDEN dari pembangun model. Independen berarti tiga hal: validator tidak ikut membangun model itu; validator tidak dinilai atau digaji oleh tim yang membangunnya; dan validator punya wewenang MENAHAN model (verdict MERAH berarti jangan deploy — bukan «silakan deploy sambil diperbaiki»). Bila satu dari tiga ini tidak ada, yang terjadi bukan validasi — melainkan review oleh rekan sejawat yang sopan.

**Mengapa ini penting secara SUBSTANSI, bukan sekadar tata kelola?** Karena pembangun model punya blind spot yang sistematis: mereka tahu ASUMSI yang mereka buat — dan asumsi yang paling berbahaya adalah asumsi yang terasa begitu wajar sehingga tidak pernah ditulis. Contoh dari modul kita sendiri: model flagship memakai SEX, EDUCATION, dan AGE sebagai fitur — dan premis «model tidak memakai SEX/EDUCATION/AGE» sempat beredar sampai diverifikasi SALAH (koefisien SEX −0,0626, SHAP 0,0314) [M7]. Pembangun yang menulis premis itu bukan berbohong — ia tidak memeriksa. Validator independen yang tidak ikut menulis kode itulah yang memeriksa. Blind spot lain: pembangun yang hanya memeriksa ROC-AUC karena itulah metrik yang ia optimalkan — validator independen memeriksa ECE per grup, karena itulah yang pembangun tidak optimalkan.

**Apa yang terjadi bila independensi tidak ada?** (1) VALIDASI MENJADI STEMPEL — laporan validasi ditulis untuk membenarkan keputusan deploy yang sudah diambil, bukan untuk mengujinya. (2) TEMUAN YANG TIDAK NYAMAN TIDAK NAIK — bad rate yang berayun 1,06 poin persen antar-half akan ditulis sebagai «dalam batas wajar» tanpa ambang yang eksplisit. (3) KESALAHAN BERULANG — tanpa pemeriksa independen, kelas kesalahan yang sama muncul di model berikutnya.

**Nilai:** independensi bagus karena ia kontrol yang tidak bisa digantikan oleh kepintaran: validator sepintar apa pun tidak bisa menguji modelnya sendiri dengan jujur, karena ia tahu jawaban yang ia harapkan.

**Baik/buruk:** independensi bagus bila ia STRUKTURAL (jalur pelaporan terpisah, wewenang menahan) — dan buruk bila ia hanya PERSONAL («validatornya orang yang jujur, kok»). Orang jujur yang melapor ke kepala tim model tetap berada dalam konflik kepentingan.

**Mitigasi:** sebelum validasi, periksa tiga pertanyaan dan tulis jawabannya di laporan: (1) Apakah validator ikut membangun model ini? (2) Apakah validator dinilai oleh pemilik model? (3) Bisakah validator menahan deploy? Bila jawaban (1) atau (2) adalah «ya», atau (3) adalah «tidak» — validasi belum independen, dan verdict apa pun darinya harus diberi tanda «tidak independen».

---

## 8. Traffic-Light: HIJAU, KUNING, MERAH — dengan Ambang yang Ditulis Eksplisit

Verdict validasi harus bisa dibaca dalam satu detik — dan dipertahankan dalam satu jam. Lesson ini memakai traffic-light tiga band [kebijakan lesson ini — ambang dipilih dari angka lesson, bukan konstanta alam, dan ditulis SEBELUM melihat verdict]: HIJAU (lolos tanpa catatan), KUNING (lolos dengan catatan + syarat), MERAH (tolak — jangan deploy).

**HIJAU — lolos tanpa catatan — bila SEMUA ini terpenuhi:** ROC-AUC test (GBM terkalibrasi) ≥ 0,75; ECE < 0,02; |selisih ROC-AUC antar-half| ≤ 0,02; |selisih bad rate antar-half| ≤ 1,0 poin persen; |selisih approval antar-half| ≤ 1,0 poin persen; dan conceptual soundness lolos. Band ECE ini berlaku untuk ECE OVERALL dan ECE PER HALF — bukan per grup. Per grup berlaku GATE UKURAN SAMPEL: grup dengan n ≥ 200 masuk band; grup dengan n < 200 tidak masuk band — ia TEMUAN-INVESTIGASI (ditulis + diselidiki, bukan pemicu band). **KUNING — lolos dengan catatan — bila SATU kondisi HIJAU dilanggar RINGAN:** ECE 0,02–0,05; |selisih ROC-AUC| 0,02–0,05; |selisih bad rate| 1,0–3,0 poin persen; |selisih approval| 1,0–3,0 poin persen; atau ROC-AUC 0,70–0,75. Syarat KUNING: catatan tertulis + pemantauan diperketat pada metrik yang melanggar + revalidasi 3 bulan. **MERAH — tolak — bila SATU PUN kondisi ini terjadi:** ECE ≥ 0,05; |selisih ROC-AUC| > 0,05; |selisih bad rate| > 3,0 poin persen; |selisih approval| > 3,0 poin persen; ROC-AUC < 0,70; atau conceptual soundness GAGAL (asumsi/data/metode terbukti salah). MERAH berarti jangan deploy — bukan «deploy sambil diperbaiki».

**Terapkan pada model kita.** ROC-AUC test GBM terkalibrasi 0,7816 — di atas 0,75 ✓ HIJAU. ECE test 0,0087, half A 0,0114, half B 0,0104 — semuanya di bawah 0,02 ✓ HIJAU. |Selisih ROC-AUC antar-half| 0,0139 — di bawah 0,02 ✓ HIJAU. |Selisih approval antar-half| 0,54 poin persen — di bawah 1,0 ✓ HIJAU. |Selisih bad rate antar-half| 1,06 poin persen — MELEWATI 1,0 poin persen, masuk rentang KUNING 1,0–3,0 — dan hanya 0,06 poin persen di atas ambang. Conceptual soundness: lolos. **VERDICT: KUNING — lolos dengan catatan.** Pemicu KUNING: |Δbad rate| 1,06 poin persen (0,06 di atas ambang) DAN ECE per grup yang masuk band (n ≥ 200): Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), AGE 50–59 0,0312 (n=473). ECE AGE 60+ 0,1208 (n=76) dan EDUCATION Lainnya 0,0455 (n=82) TIDAK masuk band — keduanya di bawah gate 200, jadi TEMUAN-INVESTIGASI, bukan pemicu. Catatan yang menyertainya: pantau bad rate yang disetujui per periode dengan perhatian khusus, selidiki ketiga grup KUNING itu dan kedua temuan-investigasi, dan revalidasi 3 bulan.

Perhatikan betapa TIPISNYA batas itu — 1,06 vs 1,0 — dan betapa PENTINGNYA ia tetap ditulis. Ambang 1,0 poin persen dipilih sebelum melihat angka halves. Bahwa hasil akhirnya 1,06 — hanya 0,06 di atas ambang — adalah FAKTA yang harus ditulis, bukan alasan untuk menggeser ambang menjadi 1,1 sesudah melihat hasilnya. Menggeser ambang sesudah melihat angka adalah cara paling sopan untuk berbohong dengan statistik.

**Nilai:** traffic-light bagus karena ia mengubah verdict dari OPINI («modelnya cukup bagus») menjadi KEPUTUSAN YANG BISA DIAUDIT («KUNING karena kondisi X, dengan syarat Y, revalidasi tanggal Z»).

**Baik/buruk:** band ini bagus bila ambangnya DITULIS DULU dan ALASANNYA DICATAT (kenapa 1,0 poin persen? kenapa 0,02?). Buruk bila ambang disalin apa adanya ke model lain: ambang yang benar untuk n=3.000 per half dan bad rate 6,67% belum tentu benar untuk n=100.000 atau bad rate 20%.

**Mitigasi:** di laporan validasi, tulis tabel band LENGKAP (HIJAU/KUNING/MERAH + ambang tiap kondisi) di halaman verdict, beserta verdict tiap kondisi untuk model ini — satu baris per kondisi, dengan angka dan ✓/✗. Tabel itu adalah bukti bahwa verdict mengikuti aturan — bukan aturan yang mengikuti verdict.

---

## 9. Jebakan: Validator yang Hanya Memeriksa Akurasi

Jebakan paling umum dalam validasi — dan paling sulit dikenali, karena ia terlihat seperti pekerjaan yang rajin: validator memeriksa ROC-AUC, PR-AUC, dan Brier — semuanya bagus — lalu menulis «model lolos». Yang tidak diperiksa: KALIBRASI PER GRUP. ROC-AUC mengukur ranking GLOBAL; ia tidak tahu — dan tidak peduli — apakah probabilitas model jujur untuk tiap kelompok nasabah.

**Nilai [M7.1]** — model keputusan yang sama, GBM terkalibrasi, threshold 0,10. ECE OVERALL test 0,0087 — sangat baik. Tapi ECE PER GRUP [M7.1]: SEX laki-laki 0,0127 (n=2.402), perempuan 0,0139 (n=3.598) — masih baik. EDUCATION: Lainnya 0,0455 (n=82), Pascasarjana 0,0210 (n=2.130), SMA 0,0362 (n=1.014), Universitas 0,0100 (n=2.774) — sudah di atas 0,02 pada tiga dari empat grup. AGE: 30–39 tahun 0,0156 (n=2.198); 40–49 tahun 0,0166 (n=1.341); 50–59 tahun 0,0312 (n=473); 60+ tahun 0,1208 (n=76) — LEBIH DARI ENAM KALI ambang lolos 0,02. Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200 — jadi yang masuk band KUNING: Pascasarjana 0,0210, SMA 0,0362, AGE 50–59 0,0312; yang TEMUAN-INVESTIGASI (n < 200): EDUCATION Lainnya 0,0455, AGE 60+ 0,1208. Grup AGE 60+ (n=76 di test) punya ECE 0,1208: probabilitas model untuk nasabah tertua meleset rata-rata 12 poin persen. Validator yang hanya memeriksa ECE overall 0,0087 akan menulis «kalibrasi bagus» — dan melewatkan satu grup yang kalibrasinya rusak.

Dua hal harus dikatakan sekaligus, karena keduanya benar. Pertama: 0,1208 adalah TEMUAN yang wajib ditulis — ECE per grup adalah bagian dari outcomes analysis. Kedua: n=76 adalah SAMPEL KECIL — di bawah gate 200, jadi temuan ini TIDAK MASUK BAND dan tidak bisa memicu MERAH: ECE dari 76 nasabah berayun lebar, dan 0,1208 bisa jadi sebagian noise. Validator yang baik tidak menulis «model diskriminatif terhadap lansia» (vonis tanpa bukti cukup) DAN tidak menulis «abaikan, n kecil» (pengabaian tanpa bukti cukup). Yang ia tulis: «ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — TEMUAN-INVESTIGASI, bukan pemicu band) — temuan ini MEMBUTUHKAN penyelidikan lanjutan: kumpulkan sampel lebih besar untuk grup ini, periksa bin kalibrasinya, dan bila ECE bertahan di atas 0,02 pada n ≥ 200, syaratkan mitigasi sebelum deploy».

Pola yang sama sudah kamu kenal dari M7.2 — aggregation bias: satu angka global, lima cerita berbeda. Di M7.2 ceritanya adalah approval dan AIR per grup; di sini ceritanya adalah kalibrasi per grup. Kelas kesalahannya sama: MEMBACA ANGKA GLOBAL SEBAGAI BUKTI PER GRUP.

**Baik/buruk:** pemeriksaan per grup bagus karena ia murah — ECE per grup tidak butuh data baru, hanya pengelompokan ulang data yang sama — dan ia menangkap kegagalan yang tidak terlihat di angka global. Buruk bila dibaca tanpa n: ECE 0,1208 pada n=76 bukan bukti yang sama kuatnya dengan ECE 0,1208 pada n=7.600. Tulis n-nya di samping ECE-nya, selalu.

**Mitigasi:** ceklis outcomes analysis-mu WAJIB punya tiga kolom — overall, per grup (SEX/EDUCATION/AGE/MARRIAGE), dan per belahan (half A/B) — untuk SETIAP metrik yang kamu laporkan (ROC-AUC, ECE, Brier, approval, bad rate). Bila satu sel kosong, tulis alasannya («n terlalu kecil») — jangan biarkan kosong tanpa penjelasan.

---

## 10. Mini-Case: Putuskan — Lolos dengan Catatan, atau Tolak?

Fakta di mejamu — semuanya dari angka kanonis: model GBM, ROC-AUC mentah 0,7823 / terkalibrasi 0,7816, PR-AUC 0,5597 / 0,5558, ECE overall 0,0087; threshold 0,10, approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, profit +NT$8.214.000 [M6.4]; nested CV 0,7858 (sd antar-fold 0,0068) [M6.2]; validation halves: half A ROC-AUC 0,7885 / bad rate 6,14% / ECE 0,0114, half B ROC-AUC 0,7746 / bad rate 7,20% / ECE 0,0104 — selisih B−A: ROC-AUC −0,0139, bad rate +1,06 poin persen; ECE AGE 60+ 0,1208 (n=76) [M7.1]; conceptual soundness lolos; validator independen; monitoring sudah disyaratkan. Band traffic-light [kebijakan lesson ini]: HIJAU bila semua kondisi terpenuhi; KUNING bila satu kondisi dilanggar ringan; MERAH bila ECE ≥ 0,05, |ΔROC| > 0,05, |Δbad rate| > 3,0 poin persen, |Δapproval| > 3,0 poin persen, ROC-AUC < 0,70, atau conceptual soundness gagal. Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200 (grup n < 200 = TEMUAN-INVESTIGASI).

**Putuskan.** Pertanyaan pertama: kondisi MERAH mana yang terpenuhi? ECE tertinggi 0,0114 (half A) — jauh di bawah 0,05. |ΔROC| 0,0139 — jauh di bawah 0,05. |Δbad rate| 1,06 poin persen — jauh di bawah 3,0. ROC-AUC 0,7816 — jauh di atas 0,70. Conceptual soundness lolos. TIDAK SATU PUN kondisi MERAH terpenuhi — jadi TOLAK bukan jawaban yang bisa dipertahankan dari angka ini. Pertanyaan kedua: kondisi HIJAU mana yang dilanggar? Empat dari lima lolos; satu dilanggar: |Δbad rate| 1,06 poin persen melewati ambang HIJAU 1,0 — masuk rentang KUNING 1,0–3,0. **Jawabannya: KUNING — LOLOS DENGAN CATATAN.**

Catatan yang menyertai verdict itu: (1) pantau bad rate yang disetujui per periode dengan perhatian khusus, karena halves menunjukkan ia berayun 1,06 poin persen bahkan tanpa drift; (2) selidiki ECE per grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312) dan TEMUAN-INVESTIGASI ECE AGE 60+ 0,1208 (n=76, di bawah gate 200) — kumpulkan sampel lebih besar untuk grup ini sebelum revalidasi, dan laporkan hasilnya; (3) revalidasi terjadwal 3 bulan setelah deploy, dipercepat bila bad rate melewati ambangnya dua periode berturut-turut. Tiga syarat itu DITULIS di laporan validasi, dengan pemilik dan tanggal — bukan disimpan di kepala validator.

Yang TIDAK boleh dilakukan validator di sini: (a) MENOLAK karena «bad rate B 7,20% terasa tinggi» — «terasa» bukan ambang; ambang MERAH-nya 3,0 poin persen selisih, dan 1,06 tidak mendekatinya. (b) MEMBERI HIJAU karena «cuma 0,06 di atas ambang» — menggeser ambang sesudah melihat angka adalah berbohong dengan statistik. (c) MENAHAN verdict karena ECE AGE 60+ 0,1208 — temuan itu butuh penyelidikan, bukan penahanan: n=76 di bawah gate 200 — TEMUAN-INVESTIGASI, bukan pemicu band — terlalu kecil untuk vonis.

**Nilai:** mini-case ini bagus karena jawabannya TIDAK ADA di angka mana pun secara sendirian — ia ada di PERBANDINGAN angka dengan ambang yang ditulis dulu. Itulah pekerjaan validator: bukan menghitung (mesin bisa menghitung), melainkan MEMUTUSKAN dari aturan yang bisa diaudit.

**Baik/buruk:** keputusan KUNING ini bagus bila syaratnya DIPATUHI dan DIAUDIT di revalidasi — dan buruk bila syaratnya hanya ditulis lalu dilupakan. Verdict tanpa tindak lanjut adalah stempel dengan langkah tambahan.

**Mitigasi:** setiap kali kamu menjadi validator, tulis verdictmu dalam SATU KALIMAT: «[HIJAU/KUNING/MERAH] karena [kondisi yang terpenuhi/dilanggar + angkanya], dengan syarat [syarat + pemilik + tanggal]». Bila kalimatmu tidak bisa ditulis, verdictmu belum siap.

---

## 10a. Issue Register: Temuan Validasi Menjadi Tindakan — dengan Pemilik dan Tanggal

Verdict KUNING datang dengan tiga syarat — tapi syarat tanpa pemilik, tanggal, dan bukti penutupan adalah catatan yang menunggu dilupakan. Issue register: satu baris per temuan, sepuluh kolom — finding_id, severity, evidence, root_cause, action, owner, due_date, acceptance_test, status, closure_approver. Tiga temuan lesson ini: **F-01** (MEDIUM) selisih bad rate +1,06 pp, CI95 [−1,26; +3,35] — tidak konklusif; acceptance test: selisih periode berikut ≤ 1,0 pp ATAU CI tidak lagi melintasi 0. **F-02** (MEDIUM) ECE tiga grup yang masuk band KUNING (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312); acceptance test: ECE ketiganya < 0,02 pada revalidasi. **F-03** (INVESTIGATE) ECE AGE 60+ 0,1208 (n=76), CI95 [0,0839; 0,2225]; acceptance test: ECE dihitung ulang pada n ≥ 200. Pemilik dan tanggal [ilustrasi] — diisi komite saat verdict ditandatangani (M8.5).

**Aturan penutupan:** temuan CLOSED hanya bila acceptance_test LULUS dan closure_approver (bukan owner yang mengerjakan) menandatangani. Persetujuan KUNING tetap berlaku selama temuannya terbuka dan due_date belum lewat; temuan yang MELEWATI due_date tanpa perpanjangan tertulis dari komite adalah pemicu revalidasi (M8.5) — approval-nya dibekukan sampai temuan itu ditutup atau diperpanjang.

---

## Lab 1: Selisih Validation Halves — Hitung, Jangan Tebak

Half A (n=3.000): ROC-AUC 0,7885, PR-AUC 0,5656, approval 28,77%, bad rate 6,14%, ECE 0,0114, Brier 0,1329. Half B (n=3.000): ROC-AUC 0,7746, PR-AUC 0,5480, approval 28,23%, bad rate 7,20%, ECE 0,0104, Brier 0,1361. Model keputusan GBM terkalibrasi, threshold 0,10 [m8_canonical.json].

Hasil [lab]: roc_diff=-0.0139; pr_diff=-0.0176; approval_diff_pp=-0.54; bad_rate_diff_pp=1.06; ece_diff=-0.0010; brier_diff=0.0032; kuning_bad_rate=True. |Selisih bad rate| 1,06 poin persen melewati ambang HIJAU 1,0 poin persen [kebijakan lesson ini] — pemicu KUNING pertama pada model ini; pemicu KUNING lainnya adalah ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312). Selisih lain semuanya di dalam ambang HIJAU: |roc_diff| 0,0139 ≤ 0,02; |approval_diff_pp| 0,54 ≤ 1,0; |ece_diff| 0,0010 — kalibrasi stabil di kedua belahan.

## Lab 2: Outcomes Analysis — ECE per Half dan Band Traffic-Light

ECE per half [m8_canonical.json]: half A 0,0114, half B 0,0104; ECE overall test 0,0087. Ambang ECE [kebijakan lesson ini]: lolos bila ECE < 0,02; catatan (KUNING) bila 0,02–0,05; tolak (MERAH) bila ≥ 0,05. Band traffic-light memakai hasil lab 1: |ΔROC| 0,0139, |Δbad rate| 1,06 poin persen, ROC-AUC test (GBM terkalibrasi) 0,7816.

Hasil [lab]: ece_max=0.0114; ece_spread=0.0010; ece_lolos_A=True; ece_lolos_B=True; ece_lolos_overall=True; band=KUNING. SEMUA ECE (overall + per half) lolos (maksimum 0,0114, jauh di bawah 0,02) — kalibrasi BUKAN masalah model ini. Band KUNING datang dari |Δbad rate| 1,06 poin persen DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312). Lab ini hanya mengevaluasi 4 dari 5 kondisi band — ECE per grup tidak dihitung di sini; ia dihitung di langkah 9 (jebakan). Itulah gunanya memisahkan verdict per metrik: kamu tahu persis APA yang membuat model KUNING, dan syarat apa yang harus ditulis untuknya — pantau bad rate, bukan kalibrasi.

## Lab 3: Issue Register — Temuan KUNING Menjadi Baris yang Bisa Ditutup

Tiga temuan (F-01 bad rate, F-02 ECE tiga grup, F-03 AGE 60+) masing-masing 10 kolom; «hari ini» [ilustrasi] 2026-11-13; due_date 30/60/90 hari lagi — semuanya di masa depan.

Hasil [lab]: fields_per_finding=10; missing=[]; all_required=True; n_open=3; n_overdue=0; approval_valid=True. Skenario: pindahkan due_date F-01 ke 2026-11-01 (sudah lewat) tanpa perpanjangan — n_overdue_scenario=1, approval_valid_scenario=False: persetujuan KUNING dibekukan sampai temuan itu ditutup atau diperpanjang komite.

---

## Guided Task di Colab

Notebook: colab/mlf-m81-guided-task.ipynb — flagship GBM mentah + terkalibrasi + LR, validation halves A/B, outcomes analysis (ECE per half + band), dan traffic-light verdict dengan laporan validasi. Tautan Colab: https://colab.research.google.com/drive/10LvCVHcOnBtQdchAT507OunEBS0SwZD9

## Rangkuman

- SR 11-7 (Federal Reserve) / OCC 2011-12 (2011): model risk = potensi konsekuensi merugikan (finansial maupun non-finansial) dari keputusan berbasis output model yang salah atau disalahgunakan; tiga elemen — (1) development, implementation, and use; (2) validation; (3) governance.
- Three lines of defense: lini 1 pemilik model & bisnis (membangun, memakai, memonitor); lini 2 validasi independen & risk (menguji, memberi verdict); lini 3 audit internal (memeriksa lini 1 & 2) — lini 1–2 melapor ke dewan/komite risiko, lini 3 melapor ke komite audit; lini 2 tidak pernah melapor ke lini 1.
- Conceptual soundness: LR mengasumsikan linearitas log-odds, GBM non-parametrik — GBM mentah 0,7823 mengalahkan LR 0,7426, tapi gap train-test 0,0646 (train 0,8469) adalah harga fleksibilitasnya; pengendalinya nested CV 0,7858 (sd antar-fold 0,0068) [M6.2]. Kalibrasi Platt dipakai karena threshold 0,10 diturunkan dari biaya [M6.4] dan butuh probabilitas yang jujur.
- Outcomes analysis — validation halves (test 6.000 → A/B n=3.000, seed 42): A ROC-AUC 0,7885 / bad rate 6,14% / ECE 0,0114; B ROC-AUC 0,7746 / bad rate 7,20% / ECE 0,0104; selisih B−A: ROC-AUC −0,0139, PR-AUC −0,0176, approval −0,54 pp, bad rate +1,06 pp, ECE −0,0010, Brier +0,0032, base rate −0,03 pp. Ranking invarian ≠ approval invarian.
- Ongoing monitoring: rujuk M7.5 (PSI skor 0,0017, ambang 0,1/0,25; baseline test 0,7816/0,5558/0,0087/6,67%) — validator menulis SYARAT monitoring, bukan yang memantau.
- Independensi: validator tidak membangun model, tidak dinilai pemilik model, dan bisa menahan deploy — tanpanya validasi menjadi stempel; blind spot pembangun (mis. premis SEX/EDUCATION/AGE yang salah [M7]) hanya tertangkap pemeriksa independen.
- Traffic-light [kebijakan lesson ini]: HIJAU (ROC ≥ 0,75; ECE < 0,02; |ΔROC| ≤ 0,02; |Δbad rate| ≤ 1,0 pp; |Δapproval| ≤ 1,0 pp); KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; |Δapproval| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; |Δapproval| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200 (n < 200 = TEMUAN-INVESTIGASI). Verdict model ini: KUNING — pemicu |Δbad rate| 1,06 pp DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312).
- Jebakan akurasi-saja: ECE overall 0,0087 menyembunyikan ECE AGE 60+ 0,1208 (n=76, di bawah gate 200 — TEMUAN-INVESTIGASI, bukan pemicu band) [M7.1] — temuan itu butuh penyelidikan lanjutan, bukan vonis dan bukan pengabaian; laporkan ECE selalu bersama n-nya.
- Mini-case: KUNING — lolos dengan catatan (pantau bad rate per periode, selidiki ECE AGE 60+, revalidasi 3 bulan); bukan tolak (tidak ada kondisi MERAH) dan bukan HIJAU (satu kondisi dilanggar).
- Lab: selisih halves (roc_diff −0,0139, bad_rate_diff_pp +1,06, kuning_bad_rate True); ECE per half lolos semua (maks 0,0114) dan band KUNING.
- Kuantifikasi ketidakpastian [turunan]: bad rate 6,67% CI95 [5,47%; 7,85%]; ECE 0,0087 CI95 [0,0077; 0,0214]; profit +NT$8.214.000 CI95 [NT$5.575.975; NT$10.802.787]; selisih bad rate antar-half +1,06 pp CI95 [−1,26; +3,35] — KUNING ditandai «tidak konklusif — investigate»; ECE AGE 60+ 0,1208 CI95 [0,0839; 0,2225] tetap temuan-investigasi.
- Desain validasi: cek ketersediaan fitur; split acak mengukur noise, bukan generalisasi ke populasi baru; temporal split tidak mungkin di snapshot tanpa tanggal; test 6.000 sudah dipakai memilih berkali-kali.
- Issue register: 10 kolom per temuan; CLOSED hanya bila acceptance_test lulus DAN closure_approver menandatangani; approval KUNING berlaku selama tidak ada temuan overdue tanpa perpanjangan komite.

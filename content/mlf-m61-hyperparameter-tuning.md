# MLF-M6.1: Hyperparameter Tuning — Mencari Setting Terbaik, Bukan Model Terbaik

## Masalah: Dari «Model Apa» ke «Setting Berapa»

Modul M6 adalah tuning & model selection: dari «model apa yang dipakai» (M1–M5) ke «setting berapa yang dipakai model itu» — dan, yang lebih penting, «bagaimana membandingkan model dengan jujur». Lesson ini membuka modul itu dengan hyperparameter tuning: mencari nilai setting terbaik untuk satu model yang sudah dipilih.

Dua model flagship dari proyek credit scoring (data UCI Default of Credit Card Clients, 30.000 baris, base rate gagal bayar 0,2212; train 24.000, test 6.000, 31 fitur [notebook]): logistic regression (LR) dengan ROC-AUC test 0,7426 / PR-AUC 0,5049, dan gradient boosting machine (GBM) dengan ROC-AUC test 0,7823 / PR-AUC 0,5597. GBM train ROC-AUC 0,8469 vs test 0,7823 — gap 0,0646 [notebook]. Threshold operasional 0,10.

Jawaban singkatnya, dari angka kanonis [notebook]: tuning menaikkan GBM hanya sekitar 0,0025 di CV (0,7840 → grid terbaik 0,7865; ingat, default dinilai 5-fold CV sedangkan grid 3-fold CV, jadi selisih ini orde besaran, bukan selisih eksak), dan di test kenaikannya NOL — GBM tertala tetap 0,7823, sama persis dengan GBM default.

---

## 1. Tuning Bukan Mencari Model Terbaik

Tuning mencari setting terbaik untuk SATU model yang sudah dipilih — bukan model terbaik. Tanpa baseline (di sini: GBM CV 0,7840, test 0,7823), setiap angka tuning terlihat seperti kemenangan — termasuk kemenangan yang sebenarnya tidak ada.

**Nilai:** tuning adalah pekerjaan yang paling sering disalahpahami di ML — ia terlihat seperti «optimasi gratis», padahal setiap konfigurasi yang dicoba adalah satu kesempatan untuk overfitting ke validasi.

**Baik/buruk:** tuning bagus bila ia mengubah setting yang memang berpengaruh dan diukur dengan CV yang jujur. Buruk bila ia dijadikan ritual — mencoba ratusan konfigurasi sampai satu skor terlihat bagus, lalu melaporkan skor itu seolah-olah itulah kemampuan modelnya.

**Mitigasi:** sebelum tuning, catat dulu skor default sebagai baseline. Tanpa baseline, tidak ada cara membedakan perbaikan dari noise.

---

## 2. Pilih Metrik Utama Sebelum Tuning

Tuning mengoptimasi apa yang kamu ukur — jadi metrik yang kamu pilih SEBELUM search menentukan apa arti «terbaik». Decision table tujuan → metrik: meranking nasabah → ROC-AUC; kelas positif langka → PR-AUC sebagai pendamping utama (base rate hanya 0,2212); probabilitas dipakai sebagai angka → Brier score dan ECE; keputusan punya biaya → expected cost atau expected profit (cara menghitungnya di M6.4); imbalance → JANGAN hanya accuracy.

**Nilai:** paket metrik lesson ini [notebook]: GBM test ROC-AUC 0,7823 / PR-AUC 0,5597 / Brier 0,1342; LR test ROC-AUC 0,7426 / PR-AUC 0,5049 / Brier 0,1427. GBM menang di ROC-AUC (+0,0397), menang lebih besar secara relatif di PR-AUC (+0,0548), dan menang di Brier (−0,0085). Model yang selalu memprediksi «tidak gagal bayar» mendapat accuracy 0,7788 (1 − 0,2212) — terlihat bagus, padahal ia tidak menemukan satu pun nasabah gagal bayar: accuracy itu cerminan base rate, bukan kemampuan.

**Baik/buruk:** metrik yang ditulis sebelum search bagus — ia mengubah «terbaik» dari selera menjadi kontrak. Buruk bila metrik diganti di tengah jalan karena konfigurasi favorit kalah — itu selection bias dengan baju metrik, sama tidak jujurnya dengan tuning di test (langkah 11).

**Mitigasi:** tetapkan tiga baris sebelum search: METRIK UTAMA (satu, penentu pemenang), DIAGNOSTIK SEKUNDER (di sini PR-AUC + Brier), dan BUSINESS CONSTRAINT sebagai syarat (misal [ilustrasi] bad rate maksimum pada nasabah yang disetujui). Laporkan selalu metrik sekunder pemenang bersama metrik utamanya: GBM tertala (CV 0,7865) tetap menunjukkan PR-AUC dan Brier test-nya (0,5598 / 0,1342).

## 3. Hyperparameter vs Parameter

PARAMETER dipelajari dari data saat latihan: koefisien logistic regression, atau struktur pohon-pohon di GBM. HYPERPARAMETER dipilih SEBELUM latihan, oleh kamu: seberapa kuat regularisasi, berapa dalam pohonnya, berapa banyak pohonnya, seberapa besar learning rate-nya.

**Nilai:** logistic regression L2 meminimalkan loss + penalti pada besar koefisien [notebook]: koefisien θ dipelajari dari data, tapi λ (kekuatan penalti) harus kamu tetapkan dulu. Di sklearn, yang disetel bukan λ melainkan C = 1/λ — C besar berarti penalti kecil, C kecil berarti penalti besar. Grid C lesson ini: 0,01; 0,1; 1; 10; 100 [notebook].

Di GBM (HistGradientBoostingClassifier) ada tiga hyperparameter yang ditala [notebook]: jumlah pohon (max_iter) — 50, 100, atau 200; kedalaman maksimum pohon (max_depth) — tanpa batas, 3, atau 5; dan learning rate — 0,05 atau 0,1. Perhatikan penamaan yang jujur: parameter jumlah pohon di sini adalah max_iter, BUKAN n_estimators — HistGradientBoostingClassifier tidak punya n_estimators.

$$\hat{\theta}(\lambda) = \arg\min_{\theta}\; \left[ \mathcal{L}(\theta) + \lambda\, \|\theta\|_2^2 \right], \qquad C = \frac{1}{\lambda}$$

**Baik/buruk:** pemisahan ini bagus karena ia menjelaskan mengapa tuning tidak bisa «dipelajari» oleh model itu sendiri — model tidak bisa memilih caranya sendiri belajar dari data yang sama tanpa melingkar. Buruk bila pemisahan ini diabaikan: siapa pun yang «menyetel» hyperparameter dengan melihat skor test sedang mencampur dua peran itu — dan itulah leakage (langkah 11).

**Mitigasi:** perlakukan hyperparameter seperti keputusan desain, bukan seperti parameter. Tuliskan grid yang akan dicoba SEBELUM melihat hasilnya, dan nilai tiap konfigurasi dengan cross-validation di train — bukan dengan test.

> **Miskonsepsi: hyperparameter bisa dipelajari dari data seperti parameter.** Bila λ ikut «dipelajari» dengan meminimalkan loss yang sama, jawabannya selalu λ = 0 — tanpa penalti, loss latihan selalu paling kecil. Itulah mengapa hyperparameter harus dipilih dengan kriteria LUAR (cross-validation), bukan dengan loss latihan.

---

## 4. Grid Search: Coba Semua Kombinasi

Grid search: tentukan beberapa nilai untuk tiap hyperparameter, lalu coba SEMUA kombinasinya. Setiap kombinasi dinilai dengan cross-validation, dan yang terbaik menang.

**Nilai:** grid GBM [notebook]: max_iter {50, 100, 200} × max_depth {tanpa batas, 3, 5} × learning_rate {0,05; 0,1} = 3 × 3 × 2 = 18 konfigurasi. Tiap konfigurasi dinilai dengan 3-fold CV, jadi total 18 × 3 = 54 fits.

$$N_{\mathrm{total}} = \left( \prod_{j=1}^{d} |G_j| \right) \times K$$

**Baik/buruk:** grid search bagus karena ia lengkap dan bisa direproduksi — siapa pun yang menjalankan grid yang sama mendapat jawaban yang sama. Buruk karena biayanya MELEDAK secara eksponensial: tambah satu hyperparameter dengan 5 nilai, dan jumlah konfigurasi dikali 5 [ilustrasi: 4 hyperparameter × 5 nilai = 625 konfigurasi; dengan 3-fold CV = 1.875 fits].

**Mitigasi:** pakai grid search bila jumlah hyperparameternya SEDIKIT (1–3) dan tiap nilai punya alasan. Bila hyperparameternya banyak atau rentangnya kontinu, grid adalah cara termahal untuk mencari di ruang yang sebagian besar kosong (langkah 5).

---

## 5. Random Search: Acak yang Menang atas Grid di Dimensi Tinggi

Random search mengganti pencacahan dengan undian: tiap konfigurasi diambil acak dari distribusi tiap hyperparameter, sebanyak budget yang ditetapkan.

**Nilai [ilustrasi]:** biasanya hanya SEDIKIT hyperparameter yang benar-benar berpengaruh. Grid dengan 5 nilai per hyperparameter hanya mencoba 5 nilai BERBEDA untuk hyperparameter yang penting; random search dengan 27 undian mencoba 27 nilai BERBEDA untuk hyperparameter itu. Peluang melewatkan 5% wilayah terbaik setelah n undian adalah (1 − 0,05)^n. Dengan n = 27, peluang melewatkannya 0,2503 — peluang MENEMUKAN setidaknya satu konfigurasi di 5% teratas adalah 0,7497, sekitar 3 dari 4 kali.

$$P(\text{melewatkan } q \text{ teratas}) = (1 - q)^n$$

**Nilai [notebook]:** random search GBM — 27 konfigurasi, 3-fold CV, 81 fits, seed 42 — konfigurasi terbaiknya (jumlah pohon (max_iter) 100, max_depth 5, learning rate 0,0425) mendapat CV 0,7866, hanya 0,0001 di atas grid terbaik (0,7865). Dari 27 konfigurasi itu, hanya 1 yang mengalahkan grid terbaik. Random search di sini TIDAK menghancurkan grid — ia hanya sedikit lebih baik, dengan budget fits 1,5× lipat (81 vs 54).

**Baik/buruk:** random search bagus bila hyperparameternya banyak, sebagian kontinu, dan kamu tidak tahu mana yang penting. Buruk bila dipakai tanpa seed yang dicatat (tidak bisa direproduksi) atau bila distribusinya salah — mengundi learning rate secara uniform di 0,01–1,0 memboroskan sebagian besar undian di nilai yang terlalu besar; skala log-uniform lebih masuk akal (lesson ini memakai log-uniform 0,03–0,20 [notebook]).

**Mitigasi:** tetapkan seed (di sini 42), catat distribusi tiap hyperparameter, dan bandingkan random search dengan grid pada METRIK YANG SAMA (CV yang sama, fold yang sama).

---

## 6. Merancang Search Space: Kasar Dulu, Log untuk yang Multiplikatif

Grid dan random search menjawab «bagaimana mencari», tapi diam soal «di mana mencari». Search space adalah keputusan desain yang menentukan apakah pencarianmu bisa menemukan apa pun.

**Nilai:** mulai KASAR, lalu PERSEMPIT (coarse-to-fine): tahap kasar adalah grid 18 konfigurasi [notebook], tahap halusnya shrinking random search — 9 konfigurasi di sekitar pemenang (100, 5, 0,0425) → terbaik (200, 5, 0,0297) CV 0,7869. Parameter MULTIPLIKATIF seperti learning rate dan C dirancang dalam skala LOG: lesson ini memakai log-uniform 0,03–0,20 untuk learning rate [notebook]. [ilustrasi] Lima titik merata-dalam-log di 0,03–0,20 adalah 0,03; 0,05; 0,08; 0,12; 0,20 — bandingkan lima titik linear 0,03; 0,07; 0,12; 0,16; 0,20 yang menumpuk di atas. Sebagian nilai hanya bermakna BERSYARAT (conditional space): pohon max_depth 3 punya paling banyak 2³ = 8 daun, jadi batas daun di atas 8 tidak pernah mengikat di situ. Kombinasi tak layak — [ilustrasi] learning rate sangat kecil + max_iter kecil (underfit struktural), atau max_depth tanpa batas + learning rate besar + max_iter besar (resep overfitting) — dikeluarkan dari desain, bukan dibiarkan menghabiskan fits.

**Nilai [notebook]:** interaksi itu nyata di grid 18 konfigurasi (lab 3): rata-rata per learning rate hampir sama (0,05 → 0,7851; 0,10 → 0,7850), tapi di dalam tiap kedalaman arahnya BERBALIK — pada max_depth 5, lr 0,05 lebih baik 0,0010; pada max_depth 3, lr 0,10 lebih baik 0,0012. Interaksi learning rate × max_iter: pada lr 0,05 rata-rata naik dengan pohon (50 → 0,7841; 100 → 0,7855; 200 → 0,7858), pada lr 0,10 DATAR (0,7849; 0,7850; 0,7850). Depth × regularisasi berlaku konseptual: pohon lebih dalam lebih butuh regularisasi — arah yang harus DIUJI di grid berikutnya, bukan diklaim.

**Gambar:** search space 2D learning rate (skala log) vs max_depth — 6 titik grid, 3 titik random search terbaik di depth 5, kotak zoom coarse-to-fine di sekitar pemenang (0,05; 5).

**Baik/buruk:** search space yang dirancang dengan baik memperkecil ruang SEBELUM menghabiskan budget. Buruk bila grid ditulis dari kebiasaan tanpa alasan, atau bila interaksi diabaikan: grid yang menilai tiap hyperparameter sendirian tidak akan pernah menemukan bahwa learning rate terbaik BERGANTUNG pada kedalaman.

**Mitigasi:** sebelum menulis grid, tulis empat baris: rentang tiap parameter + alasannya (log atau linear?), kondisi antar-parameter, kombinasi yang dikeluarkan + alasannya, dan tahap kasar vs halus + budget tiap tahap.

## 7. Worked Example 1: Grid C Logistic Regression

Grid lima nilai C, masing-masing dinilai dengan 5-fold CV di train (24.000 baris) [notebook]:

- **C = 0,01 → CV 0,7568** (sd 0,0089; test 0,7411).
- **C = 0,1 → CV 0,7579** (sd 0,0083; test 0,7424).
- **C = 1 → CV 0,7581** (sd 0,0083; test 0,7426). Grid terbaik.
- **C = 10 → CV 0,7581** (sd 0,0083; test 0,7426).
- **C = 100 → CV 0,7581** (sd 0,0083; test 0,7426).

**Nilai:** rentang seluruh grid hanya 0,0013 (0,7581 − 0,7568) — lebih kecil dari standar deviasi antar-fold (0,0083; sd populasi atas 5 fold). Dari C = 1 ke atas, kurvanya DATAR TOTAL: C = 1, 10, dan 100 memberi CV yang sama persis dan test yang sama persis. Begitu penalti cukup kecil, melonggarkannya lebih jauh tidak mengubah apa-apa — koefisiennya sudah jenuh (norma L2 koefisien: 0,9684 di C = 1 vs 0,9695 di C = 100 [notebook]).

Fold-fold CV untuk C = 1 [notebook]: 0,7665; 0,7601; 0,7442; 0,7538; 0,7656 — satu fold (0,7442) sekitar 0,022 di bawah fold terbaik. Variasi antar-fold ini LEBIH BESAR dari seluruh efek tuning C (0,0013).

**Gambar:** CV ROC-AUC per nilai C — 0,01 → 0,7568; 0,1 → 0,7579; 1, 10, 100 → 0,7581. Sumbu-y diperbesar (0,7500–0,7600) agar selisih kecil terlihat — dan justru di situlah pelajarannya: perbedaannya terlihat (≈23 px pada skala ini) tetapi tetap di bawah noise antar-fold 0,0083.

**Baik/buruk:** grid satu dimensi seperti ini bagus sebagai DIAGNOSIS — ia menunjukkan dengan cepat apakah hyperparameter itu berpengaruh atau tidak. Di sini jawabannya: hampir tidak. Buruk bila dibaca sebagai «C = 1 adalah setting terbaik yang terbukti»: dengan sd 0,0083, klaim «C = 1 mengalahkan C = 0,1» (selisih 0,0002) tidak punya dukungan statistik.

**Mitigasi:** bila grid satu dimensi datar, BERHENTI — jangan memperhalus grid di sekitar C = 1 dengan harapan menemukan puncak yang tersembunyi. Puncak itu tidak ada; yang ada adalah dataran.

> **Miskonsepsi: C lebih besar berarti regularisasi lebih kuat.** Yang benar: di sklearn, C adalah KEBALIKAN kekuatan regularisasi (C = 1/λ). C = 0,01 berarti penalti SANGAT KUAT (CV 0,7568); C = 100 berarti penalti nyaris tidak ada (CV 0,7581).

---

## 8. Worked Example 2: Grid GBM 18 Konfigurasi

Grid penuh 18 konfigurasi, 3-fold CV, 54 fits [notebook]. Tiga teratas:

- **Terbaik: max_iter 100, max_depth 5, learning rate 0,05 → CV 0,7865.**
- **Kedua: max_iter 200, max_depth 3, learning rate 0,05 → CV 0,7864.**
- **Ketiga: max_iter 200, max_depth 5, learning rate 0,05 → CV 0,7864.**

**Nilai:** konfigurasi TERBURUK di grid — max_iter 50, max_depth 3, learning rate 0,05 — mendapat CV 0,7827. Rentang SELURUH grid hanya 0,0038 (0,7865 − 0,7827). Baseline: GBM default (tanpa tuning, 5-fold CV) 0,7840 [notebook]. Grid terbaik hanya sekitar 0,0025 di atas default — dan konfigurasi terburuk grid justru 0,0013 DI BAWAH default. (Catatan kejujuran: default diukur dengan 5-fold CV, grid dengan 3-fold CV — bandingkan sebagai orde besaran, bukan selisih eksak.)

Pola di dalam grid [notebook]: learning rate 0,05 mengisi seluruh 3 besar, sementara keenam konfigurasi max_depth tanpa batas (None) menempati peringkat 12–17 dari 18 — tidak satu pun masuk 11 besar — pohon yang tidak dibatasi kedalamannya cenderung lebih buruk di data ini.

**Gambar:** tangga tuning GBM — default 0,7840; grid terburuk 0,7827; grid terbaik 0,7865; random terbaik 0,7866; shrinking terbaik 0,7869. Sumbu-y 0,7800–0,7880 — seluruh drama tuning terjadi dalam pita 0,008.

**Baik/buruk:** grid 3 dimensi seperti ini bagus karena ia menunjukkan peta wilayahnya — bukan hanya puncaknya, tapi juga lembahnya dan pola per hyperparameter. Buruk bila «terbaik dari 18» dilaporkan tanpa konteks: tanpa rentang 0,0038 dan tanpa baseline 0,7840, angka 0,7865 terlihat seperti kemenangan besar. Ia bukan.

**Mitigasi:** laporkan SELALU tiga angka bersama: baseline default, terbaik grid, dan terburuk grid. Bila rentangnya sempit, katakan terus terang — «tuning hampir tidak mengubah apa-apa di model ini» adalah temuan, bukan kegagalan.

> **Jebakan API: n_estimators tidak ada di HistGradientBoostingClassifier.** Parameter jumlah pohon di sini bernama max_iter — jumlah iterasi boosting. n_estimators adalah nama parameter di RandomForestClassifier dan GradientBoostingClassifier (yang lama), BUKAN di sini. Menulis HistGradientBoostingClassifier(n_estimators=100) menghasilkan TypeError.

---

## 9. Shrinking Random Search: Mengecilkan Wilayah

Setelah grid dan random search memberi tahu wilayah yang menjanjikan, langkah berikutnya bukan mengundi lagi di seluruh ruang — melainkan mengundi di SEKITAR pemenang. Ambil konfigurasi terbaik sejauh ini, lalu ambil 9 konfigurasi acak di sekitarnya [notebook].

**Nilai:** titik awalnya adalah random-search terbaik — max_iter 100, max_depth 5, learning rate 0,0425 (CV 0,7866). Sembilan konfigurasi di sekitarnya menghasilkan yang terbaik: max_iter 200, max_depth 5, learning rate 0,0297 → CV 0,7869 [notebook]. Mengalahkan stage-1 (0,7866) — tapi hanya sebesar 0,0003.

**Kejujuran yang wajib dicatat: ini BUKAN Bayesian optimization.** Bayesian optimization (BO) membangun model pengganti (surrogate) atas skor yang sudah dicoba, lalu memakai acquisition function untuk memilih titik berikutnya — ia BELAJAR dari riwayat pencarian. Shrinking random search tidak membangun model apa pun: ia hanya mengundi di kotak yang lebih kecil. Eksperimen lesson ini memakai shrinking random search karena library BO (scikit-optimize) TIDAK terpasang di lingkungan kanonis [notebook].

**Baik/buruk:** shrinking bagus sebagai tahap KEDUA yang murah — 9 konfigurasi, 27 fits — setelah tahap pertama memetakan wilayahnya. Buruk bila dipakai sebagai tahap pertama (kamu belum tahu wilayah mana yang menjanjikan) atau bila diulang berkali-kali tanpa henti: tiap putaran menyempit mengunci kamu di satu lembah.

**Mitigasi:** batasi refinement ke satu atau dua putaran, lalu berhenti dan evaluasi di test (langkah 10). Bila putaran kedua hanya menambah 0,0003, putaran ketiga hampir pasti menambah lebih sedikit lagi.

> **Miskonsepsi: shrinking random search = Bayesian optimization.** Keduanya «mempersempit pencarian di sekitar yang terbaik», tapi mekanismenya berbeda. Bayesian optimization memakai model surrogate + acquisition function yang belajar dari SEMUA skor sebelumnya; shrinking random search hanya mengundi acak di kotak yang lebih kecil di sekitar pemenang — tanpa model, tanpa memori selain titik awalnya.

---

## 10. Search Budget & Kapan Berhenti

Tabel usaha lesson ini [notebook]: grid LR — 5 konfigurasi × 5-fold = 25 fits, terbaik CV 0,7581. Grid GBM — 18 konfigurasi × 3-fold = 54 fits, terbaik CV 0,7865. Random search GBM — 27 konfigurasi × 3-fold = 81 fits, terbaik CV 0,7866. Shrinking — 9 konfigurasi × 3-fold = 27 fits, terbaik CV 0,7869.

**Nilai:** grid GBM (54 fits) mengangkat CV dari default 0,7840 ke 0,7865: +0,0025. Random search (81 fits, 1,5× fits grid) menambah +0,0001. Shrinking (27 fits) menambah +0,0003. Total: 162 fits GBM untuk +0,0029 CV — dan +0,0000 di test: GBM tertala (grid terbaik, dilatih ulang di seluruh train) mendapat ROC-AUC test 0,7823, PR-AUC 0,5598, Brier 0,1342 [notebook] — ROC-AUC dan Brier-nya sama persis dengan GBM default (0,7823; 0,1342); PR-AUC naik 0,0001 (0,5597 → 0,5598). Selisih CV grid terbaik vs test-nya sendiri adalah 0,0042 (0,7865 − 0,7823) — itulah optimism dari memilih yang terbaik (langkah 11).

**Kapan berhenti?** Tiga sinyal. Pertama, PLATEAU: dua tahap berturut-turut masing-masing menambah kurang dari 0,0005 — seperti random (+0,0001) lalu shrinking (+0,0003) di sini. Kedua, BUDGET: tetapkan jumlah fits maksimum SEBELUM mulai (misal 200 fits), dan berhenti saat habis. Ketiga, UJI DI TEST — sekali saja, di akhir: bila test tidak bergerak sementara CV naik, tuning sudah mengoptimasi CV, bukan modelnya.

**Baik/buruk:** budget yang eksplisit bagus — ia mengubah tuning dari «coba sampai bosan» menjadi eksperimen dengan harga yang diketahui. Buruk bila budget ditentukan oleh hasil: «tambah 50 fits lagi karena hampir menang» adalah cara paling pasti untuk overfitting ke validasi.

**Mitigasi:** alokasikan budget dalam TAHAP (peta kasar → refinement), bukan sekaligus. Misal: 60% budget untuk tahap pertama (grid/random), 40% untuk satu putaran refinement — dan nol untuk putaran ketiga kecuali tahap kedua memberi lompatan yang nyata (di sini tidak: +0,0003).

---

## 11. Jebakan Tuning: Overfitting ke Validasi & Tuning di Test

**Jebakan pertama — OVERFITTING KE VALIDASI (winner's curse).** Skor CV yang kamu pakai untuk MEMILIH konfigurasi bukanlah estimasi yang netral: dari 18 konfigurasi, yang kamu pilih adalah yang skor CV-nya tertinggi — dan skor tertinggi dari 18 undian cenderung mengandung keberuntungan. Buktinya [notebook]: grid terbaik punya CV 0,7865 tapi test 0,7823 — selisih 0,0042. Makin banyak konfigurasi yang dicoba, makin besar bias optimis ini.

**Nilai:** grid terbaik di test (0,7823) sama persis dengan GBM default di test (0,7823). Bila tuning «berhasil», test seharusnya naik mengikuti CV; di sini test diam sementara CV naik 0,0025. Itulah pola khas overfitting ke validasi: CV membaik, test tidak.

**Jebakan kedua — TUNING DI TEST (leakage).** Bila kamu memilih konfigurasi berdasarkan skor TEST, test itu berhenti menjadi pengukur yang jujur. Ia sudah dipakai untuk memilih, jadi ia sudah «bocor» ke dalam keputusan. Di lesson ini, pemilihan selalu memakai CV di train, dan test hanya dibuka sekali di akhir untuk evaluasi — itulah yang membuat angka 0,7823 itu bisa dipercaya sebagai «tuning tidak mengubah test».

**Baik/buruk:** mengenali kedua jebakan ini bagus — sebagian besar «tuning yang berhasil besar» di laporan-laporan adalah salah satu dari keduanya, bukan perbaikan model. Buruk bila kamu mengabaikannya: model yang «menang» karena overfitting ke validasi akan mengecewakan saat dipakai.

**Mitigasi:** pisahkan tiga peran data dengan tegas — train untuk melatih, validation (CV di train) untuk memilih, test untuk menilai SEKALI di akhir. Bila kamu butuh estimasi yang jujur atas SELURUH proses tuning (termasuk pemilihannya), itulah nested CV — topik M6.2.

> **Miskonsepsi: skor CV konfigurasi terbaik adalah estimasi kemampuan model itu.** Skor CV dipakai DUA kali bila kamu memilih dengannya — sekali untuk memilih, sekali untuk melaporkan. Pemakaian ganda itu membiaskan skor ke atas — tapi hati-hati membaca besarnya: di sini gap CV-vs-test pemenangnya 0,0042 (CV 0,7865 vs test 0,7823), SAMA dengan rata-rata gap ke-18 konfigurasi (juga 0,0042), jadi 0,0042 adalah gap protokol CV-vs-holdout yang dimiliki semua kandidat, bukan ukuran eksklusif bias seleksi; bukti seleksi yang sebenarnya adalah ketidakstabilan peringkat (M6.5). Estimasi yang jujur butuh data yang TIDAK dipakai untuk memilih — test yang disimpan, atau nested CV (M6.2).

---

## 12. Peta Keputusan: Kapan Grid, Kapan Random, Kapan Cukup

**Kapan GRID?** Bila hyperparameternya SEDIKIT (1–3), nilainya diskrit dan punya alasan, dan kamu butuh hasil yang bisa direproduksi persis oleh orang lain. Grid juga tepat untuk DIAGNOSIS: satu dimensi yang datar (langkah 7) memberi tahu kamu untuk berhenti.

**Kapan RANDOM?** Bila hyperparameternya BANYAK, sebagian kontinu, dan kamu tidak tahu mana yang penting. Pakai distribusi yang masuk akal (log-uniform untuk learning rate dan C), catat seed-nya, dan tetapkan jumlah undian sebagai budget.

**Kapan SHRINKING / refinement?** Bila tahap pertama sudah menemukan wilayah yang menjanjikan DAN kamu masih punya budget. Satu putaran, 9 konfigurasi di sekitar pemenang (langkah 9). Bila putaran itu hanya menambah 0,0003, berhenti.

**Kapan CUKUP — dan kapan Bayesian optimization?** Cukup bila: grid satu dimensi datar, dua tahap berturut-turut menambah kurang dari 0,0005, atau test tidak bergerak sementara CV naik. Bayesian optimization adalah tahap refinement yang LEBIH PINTAR dari shrinking — ia membangun model surrogate dan memilih titik berikutnya dengan acquisition function — dan layak dipakai bila tiap fit MAHAL sehingga tiap evaluasi harus diperhitungkan. Di lesson ini ia tidak dipakai: library-nya (scikit-optimize) tidak terpasang, dan dengan fit yang murah, shrinking random search sudah cukup untuk menunjukkan polanya.

**Mitigasi:** sebelum tuning apa pun, tulis dulu di satu baris: metode apa, budget berapa fits, dan kriteria berhenti apa. Bila baris itu tidak bisa ditulis, kamu belum siap tuning — kamu siap mengundi.

---

## Lab 1: Grid Search Manual atas Skor C Logistic Regression

Lima pasangan (C, skor CV) dari langkah 7 sudah diberikan sebagai konstanta [notebook]. Cari C terbaik, rentang skornya, dan gain dari C = 0,01 ke C = 1.

Hasil [lab]: C terbaik: 1 (CV 0.7581); rentang CV: 0.0013; gain C=0.01 -> C=1: 0.0013. Rentang 0,0013 melawan sd antar-fold 0,0083 (langkah 7) — grid ini hampir tidak membedakan apa-apa.

## Lab 2: Random vs Grid pada Budget yang Sama

Grid: 18 konfigurasi (daftar skor diberikan), 54 fits, terbaik 0,7865. Random: 27 konfigurasi, 81 fits, terbaik 0,7866 — dan hanya 1 dari 27 konfigurasi yang mengalahkan grid terbaik [notebook].

Hasil [lab]: grid terbaik: 0.7865; selisih random - grid: 0.0001; proporsi random mengalahkan grid: 0.0370; rasio fits random/grid: 1.5. Bacaan yang benar: random search menang — tapi hanya 0,0001, dengan 1,5× fits, dan hanya 1 dari 27 undian yang mengalahkan grid terbaik (proporsi 0,0370).

## Lab 3: Bedah Grid GBM — Rata-Rata per Kelompok dan Interaksi

Lab ketiga memakai 18 skor grid GBM [notebook] sebagai data: kelompokkan per learning_rate, per max_depth, dan per pasangan (learning_rate, max_depth), lalu baca interaksinya.

Hasil [lab]: rata-rata lr 0.05: 0.7851; rata-rata lr 0.10: 0.7850; rata-rata depth 5: 0.7856; rata-rata depth tanpa batas: 0.7841; interaksi depth 5 (lr 0.05 - lr 0.10): 0.0010; interaksi depth 3 (lr 0.10 - lr 0.05): 0.0012. Bacaan: rata-rata per learning rate hampir sama (selisihnya di bawah 0,0002), tapi arah efeknya BERBALIK menurut kedalaman — itulah interaksi. Rata-rata depth tanpa batas (0,7841) paling rendah, 0,0016 di bawah depth 5 — sejalan dengan pola langkah 8 bahwa keenam konfigurasi tanpa batas menempati peringkat 12–17.

## Guided Task di Colab

Notebook: colab/mlf-m61-guided-task.ipynb — pipeline flagship (LR 0,7426 / GBM 0,7823 di test), grid C, grid GBM 18 konfigurasi, random search 27 konfigurasi (seed 42), shrinking random search 9 konfigurasi, dan evaluasi GBM tertala di test. Tautan Colab: (diisi koordinator setelah notebook diunggah ke Drive)

## Rangkuman

- Parameter dipelajari dari data; hyperparameter dipilih sebelum latihan (C = 1/λ untuk LR; jumlah pohon GBM adalah max_iter, bukan n_estimators).
- Grid search: semua kombinasi — 18 konfigurasi GBM × 3-fold = 54 fits — biayanya eksponensial; random search: 27 undian memberi peluang 0,7497 menemukan 5% wilayah teratas [ilustrasi].
- Grid C LR [notebook]: 0,01 → 0,7568; 0,1 → 0,7579; 1/10/100 → 0,7581 — datar setelah C = 1, rentang 0,0013 vs sd antar-fold 0,0083.
- Grid GBM [notebook]: terbaik (100, 5, 0,05) CV 0,7865; terburuk 0,7827; rentang 0,0038; ~0,0025 di atas default 0,7840 (default 5-fold CV vs grid 3-fold CV — orde besaran, bukan selisih eksak).
- Random search [notebook]: 27 konfigurasi, 81 fits, terbaik (100, 5, 0,0425) CV 0,7866 — hanya +0,0001 atas grid, 1 dari 27 mengalahkan grid terbaik.
- Shrinking random search [notebook]: 9 konfigurasi, terbaik (200, 5, 0,0297) CV 0,7869 — BUKAN Bayesian optimization (scikit-optimize tidak terpasang).
- Budget: LR grid 25 fits, GBM grid 54, random 81, shrinking 27 — 162 fits GBM untuk +0,0029 CV dan +0,0000 di test (GBM tertala test 0,7823 / PR-AUC 0,5598 / Brier 0,1342).
- Jebakan: overfitting ke validasi (optimism konfigurasi terbaik 0,0042) dan tuning di test = leakage; estimasi jujur butuh nested CV (M6.2).
- Lab: grid C manual — C terbaik 1 (CV 0.7581), rentang 0.0013; random vs grid — grid 0.7865, selisih 0.0001, proporsi 0.0370, rasio fits 1.5.
- Metrik utama: dipilih dari tujuan SEBELUM search — ranking → ROC-AUC, probabilitas → Brier/ECE, keputusan biaya → expected cost/profit, imbalance → jangan hanya accuracy (mayoritas saja 0,7788).
- Search space: coarse-to-fine, skala log untuk parameter multiplikatif (lr log-uniform 0,03–0,20), conditional space, kombinasi tak layak dikeluarkan; interaksi lr × depth nyata (arah berbalik antara depth 5 dan depth 3).
- Lab 3: bedah grid — rata-rata lr 0,05: 0.7851 vs lr 0,10: 0.7850; depth 5: 0.7856 vs tanpa batas: 0.7841; interaksi depth 5: 0.0010, depth 3: 0.0012.

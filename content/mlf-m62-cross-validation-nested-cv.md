# MLF-M6.2: Cross-Validation & Nested CV — Satu Split Bisa Menipu

## Masalah: Satu Angka dari Satu Split Adalah Satu Undian

Single-split train-test memberi logistic regression (LR) ROC-AUC 0,7426 dan gradient boosting (GBM) 0,7823 pada 6.000 baris test [notebook]. Tapi 5-fold cross-validation pada model yang SAMA memberi LR 0,7560 dan GBM 0,7840 [notebook] — LR «naik» 0,0134 hanya karena cara mengukurnya berubah. Satu split adalah satu undian: test set bisa sedikit lebih sulit atau lebih mudah dari rata-rata, dan satu angka tidak memberi tahu kamu yang mana.

Lesson ini: K-fold (ukur berkali-kali, rata-ratakan) → stratified (jaga base rate) → membaca mean ± sd → ketidakpastian tuning (sd fold / SE / CI naif) → single-split vs CV → nested CV (ukur prosedur tuning dengan jujur) → workflow anti-leakage (Pipeline) → leakage DALAM tuning → time-series split untuk data berurutan waktu.

Angka acuan: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate gagal bayar 0,2212, 31 fitur [notebook, rincian fitur] (23 mentah + 8 turunan), split stratified 24.000 train / 6.000 test, seed 42 [notebook]. Flagship single-split: LR ROC-AUC 0,7426 / PR-AUC 0,5049; GBM 0,7823 / 0,5597; GBM train 0,8469 vs test 0,7823, gap 0,0646.

---

## 1. Satu Split Bisa Menipu

**Nilai:** satu angka dari satu split memberi kepastian palsu — ia menyembunyikan betapa goyangnya pengukuranmu. CV mengubah satu angka menjadi DISTRIBUSI (lima skor fold) — dari distribusi itu kamu bisa membaca bukan hanya «berapa bagusnya», tapi juga «seberapa stabilnya».

**Baik/buruk:** single-split bagus karena murah (satu kali latih) dan mudah dijelaskan. Buruk bila dijadikan vonis akhir: selisih 0,0134 pada LR menunjukkan vonis dari satu split bisa meleset lebih besar dari selisih antar-model yang sedang kamu bandingkan. CV bagus karena merata-ratakan lima undian — tapi tetap bukan obat mujarab: ia mengukur model yang dilatih pada 24.000 baris, bukan pada 30.000 baris penuh, dan skor-skor fold-nya saling berkorelasi.

**Mitigasi:** jangan pernah melaporkan skor dari satu split tanpa menyebutnya apa adanya — «skor pada SATU test set 6.000 baris». Bila keputusanmu bergantung pada perbandingan dua model, ukur keduanya dengan CV yang sama (fold yang sama, seed yang sama) dan laporkan mean ± sd-nya.

---

## 2. K-Fold: Apa + Mengapa

Bagi data menjadi K lipatan sama besar. Untuk tiap fold k, latih pada K−1 fold lainnya dan uji pada fold k — sampai tiap fold pernah menjadi test tepat satu kali. K = 5 pada 30.000 baris: tiap fold 6.000 baris, tiap model dilatih pada 24.000 baris dan diuji pada 6.000 baris yang belum pernah ia lihat — lima kali, dengan lima test set yang berbeda.

**Nilai [notebook]:** lima skor fold GBM default: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808 — mean 0,7840, sd 0,0059. Lima skor fold LR: 0,7634; 0,7476; 0,7600; 0,7523; 0,7568 — mean 0,7560, sd 0,0056. Single-split LR 0,7426 berada di BAWAH skor fold TERENDAH (0,7476); GBM 0,7823 berada di dalam rentang fold (0,7762–0,7940). Test set tunggal itu memang sedikit lebih sulit dari rata-rata.

**Baik/buruk:** K-fold bagus karena SETIAP baris pernah menjadi test tepat sekali. Buruk bila K terlalu kecil (K = 2: tiap model hanya dilatih pada separuh data) atau terlalu besar (leave-one-out: 30.000 kali latih, mahal, skor-skornya hampir identik sehingga sd-nya menipu). K = 5 atau 10 adalah kompromi standar.

**Mitigasi:** pakai K = 5 sebagai default, K = 10 bila butuh estimasi sedikit lebih stabil dan sanggup membayar dua kali lipat biaya komputasi. Selalu tetapkan seed (di sini 42) — tanpa seed yang dicatat, CV-mu tidak bisa direplikasi.

---

## 3. Stratified vs Biasa

Base rate gagal bayar 0,2212 [notebook] — dari 30.000 nasabah, 6.636 gagal bayar. Stratified K-fold memastikan tiap fold mewarisi proporsi yang sama: tiap fold 6.000 baris berisi sekitar 1.327 nasabah gagal bayar (22,12%). Tanpa stratifikasi, satu fold bisa berisi 19% nasabah gagal bayar sementara fold lain 25%, sehingga skor fold-nya tidak lagi sebanding.

**Nilai:** seberapa besar goyangan itu bila TIDAK menstratifikasi? Sebagai gambaran [ilustrasi]: bila 6.000 baris diambil acak dari populasi dengan p = 0,2212, simpangan baku proporsi default-nya adalah √(p(1−p)/n) ≈ 0,0054 (aproksimasi binomial; dengan koreksi populasi-terbatas ≈ 0,0048) — jadi satu fold bisa dengan wajar berisi 21,0%–23,2% nasabah gagal bayar (rentang ±2 simpangan baku). Stratifikasi menghapus goyangan itu sampai nol, tanpa menambah biaya komputasi sama sekali.

**Baik/buruk:** stratified bagus untuk klasifikasi dengan kelas tidak seimbang — ia menghilangkan satu sumber noise yang tidak perlu. Buruk bila dipakai buta-buta pada kelas yang SANGAT langka (misal 30 kejadian positif dari 30.000 baris): satu kejadian yang pindah fold sudah mengubah skor fold itu secara kasar.

**Mitigasi:** untuk klasifikasi, pakai StratifiedKFold sebagai default — bukan KFold biasa. Untuk regresi, stratifikasi tidak berlaku langsung; bila distribusi targetnya miring, pertimbangkan membagi target menjadi beberapa bin lalu menstratifikasi berdasarkan bin itu.

---

## 4. Membaca Mean ± Sd

Lima skor fold diringkas menjadi mean dan sd antar-fold. GBM default [notebook]: mean 0,7840, sd 0,0059 — band [0,7781; 0,7899]. LR [notebook]: mean 0,7560, sd 0,0056 — band [0,7504; 0,7616]. Kedua band TIDAK bersinggungan: GBM lebih baik daripada LR dengan jarak yang jauh melampaui goyangan antar-fold (selisih mean 0,0280 vs sd sekitar 0,006).

$$\bar{s} = \frac{1}{K}\sum_{k=1}^{K} s_k, \qquad \mathrm{sd} = \sqrt{\frac{1}{K}\sum_{k=1}^{K} (s_k - \bar{s})^2}$$

(sd dihitung dengan pembagi K = 5 — sama seperti numpy std default — bukan sd sampel dengan pembagi K−1.)

**Nilai:** band mean ± sd adalah alat baca cepat, bukan uji statistik. Selisih 0,0280 (GBM vs LR) adalah sekitar 5× sd — meyakinkan. Sebaliknya, selisih 0,0018 antara nested CV GBM (0,7858) dan CV biasa GBM (0,7840) adalah sekitar seperempat sd — kecil dibanding goyangan, jangan dibesar-besarkan. Sebagai gambaran turunan [ilustrasi]: standard error dari mean kira-kira sd/√5 ≈ 0,0025–0,0026 — TAPI angka itu terlalu optimis, karena kelima skor fold saling berkorelasi (train set-nya tumpang tindih 75%).

**Baik/buruk:** mean beserta sd antar-fold-nya bagus karena jujur tentang goyangan SATU skor fold — bukan tentang ketidakpastian mean. Buruk bila dibaca sebagai interval kepercayaan formal: sd antar-fold BUKAN standard error, dan band yang tumpang tindih BUKAN berarti «tidak ada beda» (uji perbandingan model yang benar memakai skor fold BERPASANGAN — dibahas di M6.5).

**Mitigasi:** laporkan SELALU mean beserta sd antar-fold-nya (dan K-nya), jangan pernah mean saja. Bila dua model berselisih kurang dari satu sd, jangan menyatakan pemenang dari angka itu saja.

---

## 5. Ketidakpastian Hasil Tuning: Sd Fold, SE, dan CI Naif

Mean nested CV GBM adalah 0,7858 — tapi angka itu diringkas dari lima skor outer yang BERBEDA [notebook]: 0,7974; 0,7782; 0,7878; 0,7859; 0,7799. Empat besaran yang sering dicampuradukkan: sd antar-fold, standard error (SE) dari mean, confidence interval (CI), dan variabilitas akibat split — masing-masing menjawab pertanyaan yang berbeda.

**Nilai:** jumlah lima skor outer 3,9292; bagi 5 → mean 0,7858. Selisih tiap skor dari mean: +0,0116; −0,0076; +0,0020; +0,0001; −0,0059 → sd antar-fold 0,0068 (pembagi 5, konvensi yang sama dengan langkah 4). Rentang fold: 0,7782–0,7974 (lebar 0,0192). Turunannya: (1) sd antar-fold 0,0068 = goyangan SATU skor fold; (2) SE dari mean = sd/√5 = 0,0068/√5 ≈ 0,0030 = goyangan RATA-RATA lima fold; (3) CI 95% naif = mean ± 1,96 × SE = 0,7858 ± 0,0060 → [0,7799; 0,7918] (dengan SE tak-dibulatkan 0,00304, setengah-lebarnya 0,0060).

$$\mathrm{SE} = \frac{\mathrm{sd}}{\sqrt{K}}, \qquad \mathrm{CI}_{95\%}^{\mathrm{naif}} = \bar{s} \pm 1{,}96 \times \mathrm{SE}$$

**Baik/buruk:** CI itu disebut NAIF karena rumus SE mengasumsikan kelima skor fold INDEPENDEN — dan itu salah: dua outer fold mana pun berbagi 14.400 dari 19.200 baris tiap training set-nya (tumpang tindih 75%), sehingga skor-skornya bergerak bersama. Ukuran sampel efektif KURANG dari 5, SE yang benar LEBIH BESAR dari 0,0030, dan CI yang benar LEBIH LEBAR dari [0,7799; 0,7918]. Melaporkan CI naif sebagai interval kepercayaan formal («skor sebenarnya 95% di dalam») adalah klaim presisi yang tidak dimiliki. Membandingkan dua model dari CI yang tumpang tindih juga salah — perbandingan yang benar memakai skor BERPASANGAN per fold (M6.5). Perhatikan skala: selisih nested vs CV biasa hanya 0,0018 — LEBIH KECIL dari SE naif 0,0030 — jadi klaim «tuning memperbaiki model» tidak bisa ditegakkan dari angka ini saja.

**Mitigasi:** laporkan PAKET lengkapnya: skor outer per fold, mean 0,7858, sd 0,0068, rentang 0,7782–0,7974. Bila menyebut CI, labeli eksplisit «CI naif — mengasumsikan fold independen, jadi optimistis». Untuk variabilitas split yang sesungguhnya, ulangi CV dengan seed berbeda (repeated CV) dan lihat seberapa jauh mean-nya bergeser.

---

## 6. Worked Example: CV 5-Fold

Skor fold GBM default [notebook]: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808. Jumlah 3,9198; bagi 5 → mean 0,78396 → 0,7840. Selisih dari mean: +0,0100; −0,0078; −0,0008; +0,0016; −0,0032 → sd 0,0059. Skor fold LR: 0,7634; 0,7476; 0,7600; 0,7523; 0,7568 — jumlah 3,7801, mean 0,75602 → 0,7560, sd 0,0056.

**Nilai:** fold 1 GBM 0,7940 (tertinggi) vs fold 2 0,7762 (terendah) — rentang 0,0178; rentang LR 0,0158. Itulah goyangan yang disembunyikan single-split: satu test set memberi satu titik di dalam rentang itu, dan kamu tidak tahu di mana.

**Gambar:** lima skor fold GBM beserta garis mean 0,7840 — satu diagnosis: sebaran skor fold.

**Baik/buruk:** worked example ini bagus karena angkanya bisa diperiksa dengan kalkulator. Buruk bila kamu mengira mean 0,7840 adalah «skor model final»: model final dilatih pada SELURUH 30.000 baris, sementara tiap model fold hanya dilatih pada 24.000 baris.

**Mitigasi:** sebutkan dengan jujur: «CV mengestimasi model yang dilatih pada 80% data». Jangan mengklaim CV mengukur model final secara persis.

---

## 7. Single-Split vs CV

**Nilai [notebook]:** LR: single-split 0,7426 vs CV 0,7560 — single-split lebih RENDAH 0,0134. GBM: single-split 0,7823 vs CV 0,7840 — lebih rendah 0,0017. Pada data ini single-split ternyata PESIMIS untuk kedua model — test set 6.000 baris itu sedikit lebih sulit daripada rata-rata kelima fold CV. Selisih 0,0134 pada LR itu BESAR: hampir setengah dari selisih GBM vs LR (0,0280). Bila kamu membandingkan dua model dengan SATU split, noise pengukuranmu bisa lebih besar daripada sinyal yang kamu cari.

**Baik/buruk:** single-split bagus sebagai pemeriksaan cepat dan murah. Buruk bila dipakai untuk MEMILIH model: pemenang single-split bisa jadi hanya pemenang undian test set. CV bagus untuk pemilihan dan pelaporan — tapi angka CV dihitung pada seluruh 30.000 baris sementara single-split hanya pada 6.000 baris test, jadi selisih 0,0134 itu sendiri juga mengandung noise.

**Mitigasi:** untuk keputusan pemilihan model, pakai CV dengan fold dan seed yang SAMA untuk semua kandidat — perbandingan berpasangan pada fold yang sama menghilangkan sebagian besar noise. Single-split tetap boleh dipakai sebagai pemeriksaan kewarasan setelah CV, bukan sebagai vonis.

---

## 8. Nested CV: Dua Loop

CV biasa punya satu lubang: bila skor CV dipakai untuk MEMILIH hyperparameter terbaik (grid 18 konfigurasi GBM di M6.1), skor CV konfigurasi pemenang sudah «terkontaminasi» oleh pemilihan — nilai maksimum dari 18 pengukuran berisik cenderung terlalu tinggi (selection bias / winner's curse).

Nested CV menutup lubang itu dengan DUA loop. Loop DALAM (inner, 3-fold): pada tiap outer-train set, jalankan grid search penuh — pilih hyperparameter terbaik menurut inner CV. Loop LUAR (outer, 5-fold): latih model dengan hyperparameter pilihan inner itu pada outer-train set, lalu uji SEKALI pada outer-test set yang tidak pernah dipakai untuk memilih apa pun. Skor outer mengukur KINERJA PROSEDUR TUNING — bukan kinerja satu konfigurasi tertentu.

$$\hat{\theta}_{\mathrm{nested}} = \frac{1}{K}\sum_{k=1}^{K} s_k^{\mathrm{outer}}, \qquad \hat{\lambda}_k = \arg\max_{\lambda}\, \mathrm{CV}_{\mathrm{inner}}^{(k)}(\lambda)$$

**Nilai:** biaya nested CV di sini [notebook]: 5 outer fold × (18 konfigurasi × 3 inner fold + 1 refit) = 275 kali latih GBM — itu grid PENUH kanonis; notebook memakai subset 8 konfigurasi (125 kali latih) — detail implementasi notebook, bukan angka kanonis — dan membandingkan hasilnya ke kanonis 0,7858 dalam toleransi 0,005 (lihat Langkah 3 notebook) — 55× lipat dibanding satu CV 5-fold untuk satu konfigurasi (275 vs 5 kali latih), atau hanya ≈5× dibanding grid search CV3 penuh (275 vs 54 fits). Itulah mengapa ia dipakai untuk LAPORAN AKHIR yang jujur, bukan eksplorasi sehari-hari.

**Baik/buruk:** nested CV bagus karena satu-satunya estimasi yang tidak memakai data yang sama untuk memilih DAN menilai. Buruk bila disalahartikan: nested CV TIDAK memilihkanmu satu konfigurasi final — konfigurasi final tetap dipilih dengan satu grid search pada SELURUH data.

**Mitigasi:** pakai nested CV bila (a) kamu menala hyperparameter DAN (b) kamu akan melaporkan satu angka kinerja sebagai klaim. Bila modelmu TIDAK ditala (GBM default), CV biasa sudah tak-bias — nested CV tidak menambah apa-apa kecuali biaya.

---

## 9. Worked Example Nested: 0,7858

Skor outer nested CV untuk GBM tertala [notebook]: fold 1: 0,7974; fold 2: 0,7782; fold 3: 0,7878; fold 4: 0,7859; fold 5: 0,7799. Mean 0,7858, sd 0,0068. Konfigurasi terbaik pilihan inner CV per outer fold: fold 1 → max_iter 50, max_depth 5, learning_rate 0,1; fold 2 → 200, 3, 0,05; fold 3 → 100, 5, 0,05; fold 4 → 100, 3, 0,1; fold 5 → 50, 5, 0,05. Lima fold, lima konfigurasi berbeda — tuning-nya TIDAK stabil. Tapi skor outer-nya stabil (rentang 0,7782–0,7974): permukaan tuningnya DATAR — skor CV grid terbaik 0,7865 vs terburuk 0,7827, selisih hanya 0,0038 [notebook].

Tiga estimasi GBM [notebook]: single-split 0,7823; CV biasa (default) 0,7840; nested CV (tertalla) 0,7858. Nested LEBIH TINGGI dari single-split sebesar 0,0035 — single-split di sini justru sedikit PESIMIS, bukan optimis. Nested hanya 0,0018 di atas CV biasa — gain tuning yang jujur ternyata kecil, sekitar seperempat sd antar-fold (0,0068).

**Gambar:** tiga estimasi GBM berdampingan — single-split 0,7823; CV biasa 0,7840; nested 0,7858.

**Baik/buruk:** nested CV bagus karena skor 0,7858 adalah klaim yang bisa dipertahankan di depan pemangku kepentingan. Buruk bila dibaca sebagai «skor model final»: model final dilatih pada semua data dengan satu konfigurasi — skornya TIDAK diukur oleh nested CV.

**Mitigasi:** laporkan ketiganya berdampingan — single-split, CV biasa, nested — beserta apa yang diukur masing-masing. Bila nested dan single-split berselisih kurang dari satu sd, sebutkan selisihnya sebagai «kecil dibanding goyangan antar-fold».

**Jebakan — «nested selalu lebih rendah»:** SALAH. Nested CV memberi estimasi JUJUR (tak-bias) untuk prosedur tuning — yang bisa di atas ATAU di bawah single-split. Di data ini nested 0,7858 LEBIH TINGGI dari single-split 0,7823 (+0,0035), karena gain tuning kecil dan single-split-nya kebetulan pesimis.

---

## 10. Workflow Anti-Leakage: Transformer Di-Fit DI DALAM Fold

Leakage dalam tuning adalah memakai TEST untuk memilih. Tapi ada kebocoran yang lebih senyap: preprocessing yang di-fit pada SELURUH data sebelum CV dimulai. StandardScaler yang menghitung mean dan sd dari 30.000 baris, SelectKBest yang memilih fitur dari 30.000 baris, imputer yang menghitung rata-rata dari 30.000 baris — semuanya sudah «melihat» validation fold sebelum model diuji padanya.

**Nilai:** workflow yang benar, untuk SETIAP fold: (1) data mentah → (2) split/fold → (3) fit transformer HANYA pada train fold → (4) transform validation fold dengan transformer yang sudah di-fit itu → (5) fit estimator pada train fold yang sudah di-transform → (6) score pada validation fold. Apa pun yang «belajar» dari data — mean/sd scaler, rata-rata imputer, skor seleksi fitur, komponen PCA, target encoding — WAJIB di-fit di dalam fold. Yang BOLEH di luar fold hanyalah aturan TETAP yang tidak belajar dari data (misal transformasi log dari pengetahuan domain).

**Baik/buruk:** di sklearn, pola yang menjamin aturan ini adalah Pipeline: Pipeline([("sc", StandardScaler()), ("sel", SelectKBest(k=5)), ("clf", LogisticRegression(...))]) — cross_val_score(pipe, X, y, cv=...) me-refit SELURUH pipeline di tiap fold. Bila fitur campuran numerik dan kategorikal, ColumnTransformer di dalam Pipeline yang sama: kolom numerik → StandardScaler, kolom kategorikal → OneHotEncoder. Untuk nested CV, pipeline masuk ke DALAM loop dalam juga (GridSearchCV(pipe, ...)). Pipeline bagus karena membuat kebocoran MUSTAHIL secara struktural. Buruk bila hanya estimatornya yang dibungkus Pipeline sementara scaler di-fit manual sebelum cross_val_score — itu tetap bocor. Buruk juga bila transformer memakai LABEL: seleksi fitur atau target encoding yang di-fit memakai y dari seluruh data membocorkan label validation fold — dan itu kebocoran yang paling besar efeknya (lab 3: inflasi 0,14 pada data tanpa sinyal sama sekali [ilustrasi]).

**Mitigasi:** checklist tiga pertanyaan sebelum CV apa pun: (1) Adakah langkah yang menghitung sesuatu dari data (mean, sd, skor, frekuensi) SEBELUM split? Bila ya, pindahkan ke dalam Pipeline. (2) Apakah transformer-ku memakai label y untuk fit? Bila ya, ia harus di dalam Pipeline. (3) Apakah fiturku memakai informasi dari baris lain (lag, rolling, target encoding)? Bila ya, pastikan jendelanya tidak melewati batas fold — untuk data waktu, ini beririsan dengan time-series split.

---

## 11. Leakage dalam Tuning

Leakage dalam tuning: memakai test set untuk MEMILIH hyperparameter — mencoba 18 konfigurasi GBM, melihat skor test masing-masing, lalu melaporkan skor test konfigurasi terbaik sebagai «skor model». Test set sudah tidak lagi menjadi wasit netral.

**Nilai [notebook]:** LR (grid C = 0,01; 0,1; 1; 10; 100): C terbaik menurut TEST adalah 1 (skor test 0,7426) — dan C terbaik menurut CV train adalah JUGA 1 (skor test 0,7426). Bias optimis: 0,7426 − 0,7426 = 0,0000. GBM: konfigurasi terbaik menurut test adalah (max_iter 100, max_depth 5, learning_rate 0,05) dengan skor test 0,7823 — konfigurasi yang SAMA dengan yang dipilih CV (skor CV 0,7865) — jadi bias optimisnya menurut rumus adalah 0,7823 − 0,7823 = 0,0000, sama seperti LR. Jangan tertukar dengan selisih 0,7823 − 0,7858 = −0,0035: 0,7858 adalah rata-rata nested CV atas lima outer-test yang berbeda, bukan skor test konfigurasi pilihan CV pada test set yang sama — selisih itu membandingkan dua PROTOKOL estimasi (single-split vs nested), bukan mengukur bias leakage.

$$\mathrm{bias} = s_{\mathrm{test}}(\hat{\lambda}_{\mathrm{test}}) - s_{\mathrm{test}}(\hat{\lambda}_{\mathrm{CV}})$$

**Mengapa biasnya ~0 di sini?** (1) Gain tuning KECIL: skor CV antar-konfigurasi GBM hanya bergerak dalam rentang 0,7827–0,7865 (lebar 0,0038). (2) Konfigurasi terbaiknya SAMA baik dipilih lewat test maupun lewat CV. (3) Datanya BESAR: train 24.000 dan test 6.000 baris membuat skor test stabil.

**Baik/buruk:** bias ~0 di sini bagus sebagai HASIL, tapi berbahaya sebagai PELAJARAN bila disalahbaca. Bias leakage MEMBESAR bila: (a) search space BESAR — ratusan konfigurasi, bukan 18; (b) data KECIL — test 500 baris, bukan 6.000; (c) kandidat-kandidatnya hampir SETARA — selisih antar-konfigurasi KECIL (di sini hanya 0,0038) sehingga ranking ditentukan noise, bukan sinyal. Sebagai gambaran [ilustrasi]: bila 100 konfigurasi yang sebenarnya setara masing-masing diukur dengan noise sd 0,01, nilai maksimum yang terpilih bisa terangkat sekitar 0,02–0,03 di atas nilai sebenarnya.

**Mitigasi:** JANGAN PERNAH memilih hyperparameter dari test set — pakai CV (atau nested CV) untuk memilih, sentuh test set hanya sekali di akhir. Bila search space-mu besar atau datamu kecil, nested CV bukan «nice-to-have» — ia wajib.

**Jebakan — «bias 0, jadi leakage tidak berbahaya»:** SALAH. Satu angka nol tidak membuktikan leakage aman; ia membuktikan leakage TIDAK SELALU besar — dan «tidak selalu» bukan «tidak pernah».

---

## 12. Time-Series Split: Expanding Window BBCA

K-fold acak pada harga saham adalah KEBOCORAN: baris «besok» masuk train dan baris «hari ini» masuk test — model belajar dari masa depan. Solusinya: time-series split dengan expanding window — train hanya masa lalu, test hanya masa depan, jendela train MEMBESAR dari fold ke fold.

**Nilai [notebook]:** 480 return SIMPLE harian BBCA → 460 observasi setelah warm-up 20 baris untuk vol20/ma20; target = return besok naik (1) atau tidak (0), base rate naik 0,4196 (dihitung pada 460 observasi). Fitur (hanya memakai informasi sampai hari ini): lag1, lag5_mean, vol20, ma20_dist, gspc_lag1. Expanding window 5 fold: train 80 → 156 → 232 → 308 → 384 baris, test selalu 76 baris. ROC-AUC per fold: 0,5434; 0,5056; 0,5811; 0,6279; 0,5000. Mean ROC-AUC 0,5516; mean akurasi 0,5894 vs naive-majority 0,5710.

**Gambar:** ROC-AUC lima fold beserta garis acak 0,5 dan garis mean 0,5516 — satu diagnosis: sebaran skor fold time-series, dan seberapa dekat ia dengan acak.

**Baik/buruk:** baca angka itu dengan jujur — sinyal arah BBCA hampir TIDAK ADA. ROC-AUC 0,5516 hanya sedikit di atas 0,5 (acak); keunggulan akurasi atas naive-majority hanya 0,5894 − 0,5710 = 0,0184; fold 5 tepat di 0,5000. Ini BUKAN model yang berhasil. Expanding window bagus karena meniru pemakaian nyata — dilatih pada masa lalu, diuji pada masa depan. Buruk bila fold awalnya terlalu kecil (fold 1 hanya 80 baris train) atau bila kamu mengabaikan regime change.

**Mitigasi:** untuk data berurutan waktu, JANGAN PERNAH memakai K-fold acak — pakai TimeSeriesSplit (expanding) atau walk-forward. Laporkan skor PER FOLD, bukan hanya mean — fold yang memburuk di akhir (fold 5 di 0,5000) adalah sinyal regime change yang layak diselidiki.

---

## Lab 1: K-Fold Manual — Mean ± Sd dari Lima Skor Fold

Lima skor fold GBM default (5-fold stratified CV) [notebook]: 0,7940; 0,7762; 0,7832; 0,7856; 0,7808. Lengkapi rata-rata, sd populasi (pembagi n = 5, seperti numpy std default — bukan pembagi n−1), dan band mean ± sd.

Hasil [lab]: mean 0,7840; sd 0,0059; band [0,7781; 0,7899]. Single-split 0,7823 berada DI DALAM band — konsisten dengan CV, bukan kejutan.

## Lab 2: Nested vs Single-Split

Tiga angka kanonis GBM [notebook]: nested CV 0,7858; single-split 0,7823; CV biasa 0,7840.

Hasil [lab]: nested − single-split = 0,0035 (POSITIF — nested lebih TINGGI); nested − CV biasa = 0,0018; laporkan: nested CV 0,7858. Hanya nested yang mengukur prosedur tuning tanpa memakai data yang sama untuk memilih dan menilai. Selisih 0,0018 itu kecil dibanding sd antar-fold 0,0068 — gain tuning yang jujur di sini kecil.

## Lab 3: Pipeline — Scaler & Seleksi Fitur DI DALAM Fold

Data SINTETIS [ilustrasi]: 200 baris, 50 fitur PURE NOISE (tanpa sinyal), y acak 0/1 — model yang jujur HARUS mendapat ROC-AUC sekitar 0,5.

Hasil [lab]: cara SALAH (scaler + SelectKBest k=5 di-fit pada SEMUA data sebelum CV) memberi skor_bocor 0,6340; cara BENAR (keduanya di dalam Pipeline, di-fit ulang tiap fold) memberi skor_benar 0,4915. Selisih 0,1425: harga kebocoran — pada data yang TIDAK PUNYA sinyal sama sekali, preprocessing yang bocor menciptakan «sinyal» palsu sebesar 0,14. Yang membocorkan di sini adalah SelectKBest: ia memakai label y dari SEMUA 200 baris, termasuk validation fold, untuk memilih 5 fitur yang «kebetulan» paling berkorelasi dengan y. Di data UCI yang asli, leakage preprocessing tidak akan se-dramatis 0,14 — tapi arahnya sama: skor yang diukur dengan preprocessing bocor SELALU terlalu tinggi.

## Guided Task di Colab

Notebook: colab/mlf-m62-guided-task.ipynb — flagship single-split, CV 5-fold, nested CV GBM, demo leakage, dan time-series split BBCA. Catatan: cell nested CV di notebook memakai subset 8 konfigurasi (detail implementasi notebook, bukan angka kanonis) dari grid kanonis 18 (dinyatakan di notebook, Langkah 3) karena grid penuh tidak selesai dalam batas waktu VM bersama — hasilnya dibandingkan ke kanonis 0,7858 dalam toleransi 0,005. Tautan Colab: https://colab.research.google.com/drive/1aDGhlbTOMl_BXGcpnFRsvZNNkrx8ynbu

## Rangkuman

- Satu split adalah satu undian: LR single-split 0,7426 vs CV 0,7560 (selisih 0,0134); GBM 0,7823 vs 0,7840 (selisih 0,0017) [notebook].
- K-fold: K lipatan, tiap baris menjadi test tepat sekali; K = 5 default. Stratified menjaga base rate 0,2212 (~1.327 default per fold 6.000 baris).
- Mean beserta sd antar-fold-nya: GBM 0,7840 (sd antar-fold 0,0059; band [0,7781; 0,7899]) vs LR 0,7560 (sd antar-fold 0,0056; band [0,7504; 0,7616]) — band tidak bersinggungan; sd antar-fold bukan ketidakpastian mean.
- Ketidakpastian tuning: skor outer nested GBM 0,7974; 0,7782; 0,7878; 0,7859; 0,7799 — mean 0,7858, sd 0,0068, SE mean ≈ 0,0030, CI 95% NAIF [0,7799; 0,7918]; CI naif optimistis karena train antar-fold tumpang tindih 75% — laporkan skor per fold + mean + sd + rentang, jangan klaim CI formal.
- Nested CV (outer 5 / inner 3, 18 konfigurasi, 275 kali latih): GBM 0,7858 (sd antar-fold 0,0068) — estimasi JUJUR prosedur tuning, LEBIH TINGGI dari single-split 0,7823 (+0,0035), hanya +0,0018 atas CV biasa.
- Workflow anti-leakage: transformer yang belajar dari data (scaler, imputer, seleksi fitur, PCA) di-fit DI DALAM fold — Pipeline/ColumnTransformer menjaminnya; yang di-fit sebelum split sudah melihat validation fold.
- Konfigurasi terbaik berganti tiap outer fold (50/5/0,1; 200/3/0,05; 100/5/0,05; 100/3/0,1; 50/5/0,05) — permukaan tuning datar (rentang CV grid 0,7827–0,7865).
- Leakage dalam tuning: LR bias 0,0000 (C terbaik menurut test = menurut CV = 1); GBM bias 0,0000 (konfigurasi terbaik menurut test = menurut CV = 100/5/0,05; skor test yang sama 0,7823) — bias ~0 karena gain tuning kecil, pilihan sama, data besar; bias MEMBESAR bila search space besar / data kecil.
- Time-series BBCA (expanding window 5 fold): mean ROC-AUC 0,5516, akurasi 0,5894 vs naive-majority 0,5710, fold 5 tepat 0,5000 — sinyal arah hampir tidak ada; K-fold acak pada data waktu adalah kebocoran.
- Lab: K-fold manual — mean 0,7840, sd 0,0059 (populasi), band [0,7781; 0,7899]; nested vs single-split — +0,0035 dan +0,0018, laporkan nested CV 0,7858; Pipeline — skor bocor 0,6340 vs benar 0,4915, selisih 0,1425 [ilustrasi].

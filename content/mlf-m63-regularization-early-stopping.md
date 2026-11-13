# MLF-M6.3: Regularisasi & Early Stopping — Mengendalikan Kapasitas Model

## Masalah: Model yang Terlalu Kuat Menghafal

Data yang sama seperti modul-modul M6 sebelumnya: UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, 31 fitur (23 asli + 8 hasil feature engineering) [notebook, rincian fitur], split 80/20 — train 24.000, test 6.000 [notebook]. Dua model flagship dari M1: logistic regression (LR) test ROC-AUC 0,7426 / PR-AUC 0,5049, dan gradient boosting (GBM) test ROC-AUC 0,7823 / PR-AUC 0,5597.

Gejala yang harus dikenali dulu: GBM mencapai train ROC-AUC 0,8469 tapi test hanya 0,7823 — selisih (gap) 0,0646 [notebook]. LR jauh lebih kalem: train 0,7610 vs test 0,7426, gap 0,0184. Lesson ini mengukur seberapa jauh «rem» regularisasi dan early stopping bisa menutup gap itu — dan, sama pentingnya, di mana rem itu TIDAK membantu.

---

## 1. Model yang Terlalu Kuat Menghafal

**Nilai:** regularisasi dan early stopping adalah dua rem yang sama-sama mengendalikan kapasitas — satu lewat penalti pada koefisien, satu lewat menghentikan pelatihan. Keduanya murah, keduanya bisa diukur langsung dari angka.

**Baik/buruk:** rem itu bagus bila gap train-test besar dan modelmu fleksibel (GBM). Buruk bila dipakai buta-buta pada model yang sudah kaku: LR di data ini hampir tidak bergerak — rem yang terlalu kuat justru membuat model underfit.

**Mitigasi:** jangan menebak apakah modelmu overfit — UKUR gap train-test dulu. Baru putuskan rem mana yang dipakai, dan ukur lagi sesudahnya.

---

## 2. Kapasitas Model dan Gap Train-Test sebagai Diagnosis

Kapasitas adalah seberapa rumit pola yang BISA dipelajari model. LR dengan 31 koefisien hanya bisa menggambar satu batas keputusan lurus; GBM dengan ratusan pohon bisa menggambar batas berlekuk-lekuk mengikuti tiap gerombol data latih — termasuk gerombol yang sebenarnya hanya noise.

**Nilai:** GBM: train 0,8469 − test 0,7823 = 0,0646 [notebook]. LR: train 0,7610 − test 0,7426 = 0,0184. Gap GBM kira-kira 3,5 kali gap LR. Gap 0,0646 ini BUKAN vonis «model rusak» — GBM tetap menang jauh atas LR di test (0,7823 vs 0,7426).

$$\mathrm{gap} = \mathrm{AUC}_{\mathrm{train}} - \mathrm{AUC}_{\mathrm{test}}$$

**Baik/buruk:** gap besar bagus sebagai SINYAL — ada ruang perbaikan lewat pengendalian kapasitas. Buruk bila dibaca sebagai «semakin kecil gap semakin baik»: model yang train dan test-nya sama-sama RENDAH punya gap kecil tapi underfit. Yang dicari adalah test TINGGI dengan gap yang WAJAR, bukan gap nol.

**Mitigasi:** ambang praktis untuk data ini — gap di bawah 0,02 (seperti LR, 0,0184) tergolong kecil; 0,02–0,05 sedang; di atas 0,05 (seperti GBM, 0,0646) besar. Ambang ini aturan praktis lesson ini, bukan hukum universal.

---

## 3. L2: Penalti Kuadratik

L2 menambahkan penalti pada fungsi loss: tiap koefisien besar «membayar denda» sebanding kuadratnya. Di logistic regression, kekuatan regularisasi diatur lewat C — dan C adalah KEBALIKAN kekuatan penalti: C kecil = penalti KUAT; C besar = penalti LEMAH (C = 1/λ, hingga faktor ½ pada suku L2).

$$\min_w \left[ -\sum_i \log p(y_i \mid x_i;\, w) + \lambda\, \|w\|_2^2 \right], \qquad C = \frac{1}{\lambda}$$

**Nilai [notebook]:** C = 0,01 (penalti terkuat): test ROC-AUC 0,7411, norma L2 koefisien 0,8866, train 0,7597. C = 0,1: test 0,7424, norma 0,9594. C = 1: test 0,7426, norma 0,9684. C = 10: test 0,7426, norma 0,9694. C = 100 (penalti terlemah): test 0,7426, norma 0,9695. Norma MENYUSUT saat penalti menguat (0,9695 → 0,8866) — remnya bekerja. Skor test hanya bergerak 0,7411 → 0,7426 — naik 0,0015, lalu DATAR.

**Gambar:** test ROC-AUC vs C — naik sedikit dari C = 0,01 (0,7411) ke C = 1 (0,7426), lalu datar total sampai C = 100.

**Baik/buruk:** L2 bagus karena STABIL — mengecilkan semua koefisien secara halus tanpa pernah mematikannya. Buruk bila yang dibutuhkan adalah MEMILIH fitur: L2 tidak pernah men-zero-kan satu koefisien pun (0 dari 31, pada C = 0,1 maupun C = 1). Buruk juga bila penalti terlalu kuat: C = 0,01 memberi test TERENDAH (0,7411) — rem terlalu keras membuat underfit.

**Mitigasi:** jalankan jalurnya (C = 0,01; 0,1; 1; 10; 100) dan baca test ROC-AUC-nya. Bila skor datar seperti di sini, pilih C di tengah (C = 1). Dan ingat arahnya: C BESAR = regularisasi KECIL.

---

## 4. L1: Seleksi Fitur

L1 mengganti kuadrat dengan nilai absolut: dendanya sebanding |w|, bukan w². Penalti L1 mendorong koefisien kecil sampai PERSIS NOL — model L1 secara otomatis MEMILIH fitur.

$$\min_w \left[ -\sum_i \log p(y_i \mid x_i;\, w) + \lambda\, \|w\|_1 \right]$$

**Nilai [notebook]:** pada C = 0,1 — L1 men-zero-kan 7 dari 31 koefisien (test ROC-AUC 0,7418; norma L2 koefisien 0,9208; norma L1 koefisien 2,7928), sementara L2 men-zero-kan 0 (test 0,7424; norma L2 0,9594; norma L1 3,3421). Pada C = 1 — L1 hanya men-zero-kan 1 koefisien (test 0,7425; norma L1 3,3090), L2 tetap 0 (test 0,7426; norma L1 3,3997). Makin kuat penalti (C kecil), makin banyak koefisien yang dimatikan L1.

**Baik/buruk:** L1 bagus bila butuh model RINGKAS dan bisa dijelaskan — 7 fitur lebih sedikit berarti 7 kolom yang tidak perlu dihitung, divalidasi, dan dimonitor di produksi. Harga: L1 pada C = 0,1 kehilangan 0,0006 test ROC-AUC dibanding L2 (0,7418 vs 0,7424); pada C = 1 harganya 0,0001. Buruk bila fitur saling berkorelasi: L1 memilih SATU dari sekelompok fitur berkorelasi dan mematikan sisanya secara arbitrer.

**Mitigasi:** jangan membaca «koefisien nol» sebagai «fitur tidak berguna». Bila stabilitas seleksi penting, pakai L2 atau campuran keduanya — elastic net (l1_ratio di antara 0 dan 1).

---

## 5. L1 vs L2: Kapan Mana

**Nilai [notebook]:** pada C = 0,1, L2 0,7424 vs L1 0,7418 (selisih 0,0006); pada C = 1, L2 0,7426 vs L1 0,7425 (selisih 0,0001). Bila skor satu-satunya kriteria, keduanya seri — pilihannya harus datang dari TUJUAN lain. Pilih L1 bila butuh SELEKSI FITUR (model ringkas, mudah dijelaskan ke regulator/auditor). Pilih L2 bila butuh STABILITAS (semua fitur dipertahankan, koefisien menyusut halus). Pilih campuran (elastic net, l1_ratio di antara 0 dan 1) bila butuh keduanya.

**Catatan API:** di sklearn 1.9, L1/L2 dipilih lewat l1_ratio — 0 berarti L2 murni, 1 berarti L1 murni, di antaranya berarti campuran (elastic net). Parameter penalty yang lama sudah deprecated.

**Baik/buruk:** membandingkan keduanya pada validasi bagus — memilih dari BUKTI, bukan slogan. Buruk bila pilihan didasarkan pada skor test saja: selisih 0,0001–0,0006 lebih kecil dari noise antar-fold (standar deviasi CV LR sekitar 0,0083 di M6.1).

**Mitigasi:** tetapkan dulu apa yang dibutuhkan — ringkas, stabil, atau keduanya — lalu bandingkan L1 vs L2 pada VALIDASI dengan kriteria itu. Bila keduanya seri, pilih L2: ia yang paling tidak mengejutkan.

---

## 6. Validation Curve: Membaca Kurva

Validation curve memplot skor train dan test terhadap satu hyperparameter — di sini jumlah pohon GBM (max_iter). Tiga babak: test NAIK bersama train (belajar pola benar) → test DATAR sementara train naik (yang dipelajari tidak lagi membantu) → test TURUN sementara train naik (menghafal noise).

**Nilai [notebook]:** kurva GBM TANPA early stopping — test 0,7763 (10 pohon) → 0,7788 (25) → 0,7797 (50, puncak) → 0,7763 (100) → 0,7721 (200) → 0,7638 (400). Train di saat yang sama: 0,8058 → 0,8269 → 0,8532 → 0,8907 → 0,9347 → 0,9766. Di 400 pohon, gap train-test 0,2128 (0,9766 − 0,7638). Puncaknya di 50 pohon: di situlah model berhenti belajar pola dan mulai menghafal.

**Baik/buruk:** validation curve bagus karena menunjukkan DI MANA letak puncaknya. Buruk bila dibaca dari SATU titik saja: yang memberi vonis adalah TREN turunnya (sampai 0,7638), bukan satu selisih 0,0034. Buruk juga bila titik optimal dipilih dari test — pilih dari VALIDASI terpisah, test hanya untuk laporan akhir (M6.2).

**Mitigasi:** selalu plot KEDUA garis (train dan test), dan tetapkan titik berhentinya dari validasi, bukan dari test.

---

## 7. Early Stopping

Early stopping adalah regularisasi IMPLISIT: menghentikan pelatihan di titik yang tepat. Sisihkan sebagian data latih sebagai VALIDASI internal; bila skor validasi tidak membaik selama beberapa iterasi berturut-turut (patience), berhenti — dan kembalikan model dari iterasi TERBAIK, bukan yang terakhir.

$$t^* = \arg\min_t\, \mathcal{L}_{\mathrm{val}}(t)$$

**Nilai [notebook] — BACA PELAN-PELAN:** kurva GBM dengan setting DEFAULT — test 0,7752 (10 pohon) → 0,7797 (25) → 0,7823 (50) → 0,7823 (100) → 0,7823 (200) → 0,7823 (400) — DATAR TOTAL dari 50 sampai 400. Train juga datar di 0,8469. Pemburukan dari puncak ke 400 pohon: 0,0000. Ini BUKAN bukti «400 pohon tidak overfit». Ini adalah efek early stopping: HistGradientBoostingClassifier dengan early_stopping='auto' AKTIF secara default bila train lebih dari 10.000 baris — dan train di sini 24.000 baris — sehingga model BERHENTI SENDIRI sekitar 50 iterasi, berapa pun max_iter yang diminta. Yang kamu lihat di kurva datar itu adalah remnya yang bekerja, bukan kekebalan GBM.

**Gambar (dengan early stopping):** test ROC-AUC vs max_iter — 0,7752 (10) → 0,7797 (25) → datar 0,7823 (50–400).

**Baik/buruk:** early stopping bagus karena GRATIS dan OTOMATIS — test 0,7823, skor GBM terbaik di data ini, tanpa menala max_iter. Buruk bila kamu tidak sadar ia AKTIF: kamu bisa menyimpulkan «tambah pohon tidak ada efeknya» atau «GBM tidak overfit», lalu mematikan early stopping di produksi dan kaget melihat skor jatuh (langkah 8).

**Mitigasi:** selalu periksa APAKAH early stopping aktif sebelum menafsirkan kurva validasi. Di sklearn, HistGradientBoostingClassifier memakai early_stopping='auto' (aktif bila n_train > 10.000); untuk melihat perilaku murni model, matikan eksplisit dengan early_stopping=False. Dan catat n_iter_ setelah fit: itulah jumlah pohon yang BENAR-BENAR dipakai, bukan max_iter yang diminta.

---

## 8. Worked Example: GBM 400 Pohon — Dua Kurva, Dua Cerita

**Nilai [notebook]:** Kurva PERTAMA (default, langkah 7): test 0,7752 → 0,7797 → 0,7823, lalu DATAR sampai 400; train datar di 0,8469; gap di 400 pohon 0,0646. Kurva KEDUA (early_stopping=False): test 0,7763 → 0,7788 → 0,7797 (puncak, 50 pohon) → 0,7763 (100) → 0,7721 (200) → 0,7638 (400); train 0,8058 → 0,8269 → 0,8532 → 0,8907 → 0,9347 → 0,9766; gap di 400 pohon 0,2128.

Puncak test tanpa early stopping (0,7797 di 50 pohon) LEBIH RENDAH dari skor default dengan early stopping (0,7823) — selisih 0,0026. Pemburukan dari puncak ke 400 pohon: 0,0000 dengan early stopping, 0,0159 tanpanya (0,7797 − 0,7638).

**Gambar (tanpa early stopping):** test ROC-AUC vs max_iter — puncak 0,7797 (50), lalu turun ke 0,7638 (400).

**Baik/buruk:** membandingkan dua kurva ini bagus — ia mengubah early stopping dari «pengaturan default yang misterius» menjadi «rem yang terukur menyelamatkan 0,0159». Buruk bila hanya melihat satu kurva: kurva default saja membuatmu meremehkan overfitting; kurva tanpa early stopping saja membuatmu mengira GBM «selalu» memburuk setelah 50 pohon.

**Mitigasi:** bila menala max_iter manual (misal di grid search M6.1), JANGAN mematikan early stopping tanpa sadar — grid M6.1 memakai default (aktif). Bila mematikannya, WAJIB menala max_iter sebagai gantinya — dan titiknya di data ini adalah 50.

---

## 9. Jebakan: Regularisasi Bukan Obat Segala Overfit

1. **Mengira regularisasi selalu menaikkan skor.** Jalur C LR hanya bergerak 0,7411 → 0,7426 (naik 0,0015), L1 vs L2 berbeda 0,0001–0,0006. Regularisasi di sini BUKAN penyelamat besar: model sudah cukup kalem, data sudah cukup banyak (24.000 train), sinyal memang terbatas. Nilainya ada di SELEKSI FITUR (L1 mematikan 7 koefisien) dan STABILITAS, bukan lonjakan AUC.
2. **Rem terlalu keras.** C = 0,01 memberi test TERENDAH (0,7411): penalti terlalu kuat menekan sinyal yang berguna. Tanda rem terlalu keras: train DAN test sama-sama turun saat penalti dikuatkan (train 0,7597 pada C = 0,01 vs 0,7610 pada C = 1). Bila train turun, kamu mencegah BELAJAR, bukan overfit.
3. **Early stopping yang tidak disadari.** Tidak tahu early stopping aktif → salah baca dua arah: mengira «GBM tidak overfit sampai 400 pohon», atau — bila mematikannya tanpa sadar — mengira «GBM tiba-tiba rusak» saat test jatuh ke 0,7638.

**Mitigasi (ringkas):** (1) ukur dulu seberapa besar pergerakan skor dari regularisasi — bila di bawah 0,002 seperti di sini, akui itu dan cari nilai di tempat lain; (2) bila train ikut turun saat penalti dikuatkan, longgarkan remnya; (3) sebelum menafsirkan kurva validasi apa pun, periksa apakah early stopping aktif.

---

## 10. Peta Keputusan

**LANGKAH PERTAMA — ukur gap train-test.** Gap kecil (di bawah 0,02, seperti LR 0,0184): model sudah kalem; jangan buru-buru menambah rem. Gap sedang (0,02–0,05): coba rem ringan. Gap besar (di atas 0,05, seperti GBM 0,0646): pengendalian kapasitas layak dicoba, ukur lagi sesudahnya.

**LANGKAH KEDUA — pilih rem dari JENIS model.** Model linear (LR) → L1/L2 lewat C dan l1_ratio: L1 untuk seleksi fitur, L2 untuk stabilitas. Model iteratif (GBM, neural network) → early stopping dulu: gratis, otomatis, menyelamatkan 0,0159 AUC di data ini. Baru bila tidak cukup, tambah penalti lain (learning rate lebih kecil, max_depth lebih dangkal, min_samples_leaf lebih besar).

**LANGKAH KETIGA — bila rem sudah dipakai dan gap tetap besar ATAU skor test tetap rendah,** masalahnya kemungkinan BUKAN kapasitas — melainkan data atau fitur. Train dan test sama-sama rendah = underfit (tambah kapasitas/fitur). Train tinggi tapi test mentok meski sudah direm = sinyal latih tidak ada di data baru (periksa kebocoran, pergeseran distribusi, kualitas fitur).

**Baik/buruk:** peta ini mencegah dua pemborosan — menala C berjam-jam pada model yang gap-nya sudah kecil, dan mematikan early stopping lalu menala max_iter manual padahal default-nya sudah optimal. Buruk bila dipakai sebagai resep kaku: ambang 0,02/0,05 adalah aturan praktis lesson ini untuk data ini.

**Mitigasi:** tulis keputusanmu dalam satu kalimat sebelum mengeksekusi — «gap 0,0646, model GBM iteratif, jadi pakai early stopping default dan ukur lagi» — lalu bandingkan hasilnya dengan kalimat itu.

---

## Lab 1: L1 vs L2 pada Koefisien Mainan

Delapan koefisien mainan [ilustrasi]: W = [0,85; 0,62; 0,41; 0,18; 0,09; 0,03; −0,07; −0,22], λ = 0,15. Soft-threshold L1: sign(w) × max(|w| − λ, 0). Shrink L2: w / (1 + λ).

Hasil [lab]: L1 men-zero-kan 3 koefisien (0,09; 0,03; −0,07); L2 men-zero-kan 0 (misal 0,85 → 0,7391). Angka kanonis [notebook]: L1 pada C = 0,1 men-zero-kan 7 dari 31 (test 0,7418) vs L2 0 (test 0,7424) — selisih skor hanya 0,0006.

## Lab 2: Validation Curve GBM

Test ROC-AUC GBM per max_iter [notebook] — DENGAN early stopping: 10 → 0,7752; 25 → 0,7797; 50 → 0,7823; 100 → 0,7823; 200 → 0,7823; 400 → 0,7823. TANPA early stopping: 10 → 0,7763; 25 → 0,7788; 50 → 0,7797; 100 → 0,7763; 200 → 0,7721; 400 → 0,7638.

Hasil [lab]: optimal_dengan_es = 50, optimal_tanpa_es = 50, pemburukan_dengan_es = 0,0000, pemburukan_tanpa_es = 0,0159. Titik optimalnya SAMA (50) — yang berbeda adalah apa yang terjadi sesudahnya.

## Guided Task di Colab

Notebook: colab/mlf-m63-guided-task.ipynb — flagship LR dan GBM, jalur C LR, L1 vs L2 lewat l1_ratio, dan kurva validasi GBM dengan dan tanpa early stopping. (Tautan Colab Drive diisi koordinator saat notebook di-upload.)

## Rangkuman

- Gap train-test adalah diagnosis kapasitas: GBM 0,8469 vs 0,7823 (gap 0,0646, besar) vs LR 0,7610 vs 0,7426 (gap 0,0184, kecil) [notebook].
- L2 mengecilkan koefisien tanpa mematikan satu pun: jalur C LR — C = 0,01 test 0,7411 norma 0,8866; C = 0,1 test 0,7424 norma 0,9594; C = 1/10/100 test 0,7426 norma 0,9684/0,9694/0,9695. C = 1/λ (hingga faktor ½ pada suku L2): C besar = rem longgar.
- L1 mematikan koefisien (seleksi fitur): 7 dari 31 pada C = 0,1 (test 0,7418) dan 1 pada C = 1 (test 0,7425); L2 nol-nya 0 (test 0,7424/0,7426). Di sklearn 1.9 pilihannya lewat l1_ratio (0 = L2, 1 = L1).
- Validation curve dibaca dari DUA garis: test naik lalu turun sementara train naik terus = overfit mulai di puncak (50 pohon pada GBM tanpa early stopping).
- Early stopping = regularisasi implisit (t* = argmin loss validasi). KEJUJURAN UTAMA: kurva GBM default yang DATAR (0,7823 dari 50 s.d. 400) adalah efek early_stopping='auto' yang aktif (train 24.000 > 10.000) — bukan bukti 400 pohon aman.
- Bukti overfitting yang sebenarnya: kurva TANPA early stopping — test puncak 0,7797 di 50 lalu 0,7638 di 400 (memburuk 0,0159), train 0,9766, gap 0,2128.
- Regularisasi di data ini hampir tidak mengubah skor (0,7411 → 0,7426, naik 0,0015) — nilainya ada di seleksi fitur dan stabilitas, bukan lonjakan AUC.
- Peta keputusan: ukur gap → pilih rem dari jenis model (L1/L2 untuk linear, early stopping untuk iteratif) → ukur lagi → bila mentok, pindah ke data/fitur.
- Lab: L1 men-zero-kan 3 dari 8 koefisien mainan (λ = 0,15) vs L2 0, selisih skor kanonis 0,0006; titik optimal kedua kurva GBM sama-sama 50, pemburukan 0,0000 dengan early stopping vs 0,0159 tanpanya.

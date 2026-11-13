# MLF-M6.4: Kalibrasi & Threshold — Ketika Skor 0,8 Berbohong

## Masalah: Ranking Bagus, Probabilitas Palsu

Model memberi seorang nasabah skor 0,8 — dibaca sebagai «peluang default 80%». Lalu diperiksa: dari 100 nasabah lain yang juga berskor sekitar 0,8, hanya 52 yang benar-benar default. [Ilustrasi: angka 52 ini ilustrasi model yang mis-kalibrasi — GBM di lesson ini justru terkalibrasi baik di bin skor tinggi (aktual 0,7481 vs prediksi 0,7441), lihat langkah 6.] Skor 0,8 itu bukan peluang 80% — ia hanya berarti «nasabah ini LEBIH berisiko daripada yang berskor 0,3». Model pandai mengurutkan, tapi berbohong soal angka.

Ranking menjawab «siapa lebih berisiko dari siapa» (ROC-AUC, PR-AUC). Kalibrasi menjawab «apakah angka 0,8 itu sungguh berarti 80 dari 100 kejadian» (reliability diagram, ECE, Brier score). Lesson ini tentang pertanyaan kedua — plus lanjutannya yang menentukan uang: setelah probabilitasnya bisa dipercaya, di ambang berapa pinjaman disetujui?

Angka acuan [notebook]: dataset UCI Default of Credit Card Clients, 30.000 baris, base rate default 0,2212; split stratified 80/20 (train 24.000, test 6.000, seed 42); 31 fitur; model flagship LR dan GBM. ROC-AUC test: LR 0,7426, GBM 0,7823. PR-AUC: LR 0,5049, GBM 0,5597. Brier score: LR 0,1427, GBM mentah 0,1342 (terbaik); GBM + Platt 0,1345. Semua angka kalibrasi dan threshold dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, calibration + threshold dipilih di data calibration/validation, dan test final hanya dibuka sekali. Model keputusan untuk tabel threshold adalah GBM terkalibrasi (Platt/sigmoid).

---

## 1. Skor 0,8 yang Berbohong

**Nilai:** kalibrasi adalah jembatan antara «model yang pandai mengurutkan» dan «keputusan yang bisa dipertanggungjawabkan». Threshold 0,10 yang optimal di lesson ini hanya bermakna bila probabilitas 0,10 itu sendiri jujur — bila skor 0,10 sebenarnya berarti peluang default 20%, seluruh perhitungan biaya di langkah 8–9 runtuh.

**Baik/buruk:** ROC-AUC 0,7823 (GBM) itu bagus sebagai ukuran ranking. Buruk bila dibaca sebagai «probabilitasnya bisa dipercaya»: ROC-AUC TIDAK mengukur itu sama sekali. Model dengan ROC-AUC 0,99 pun bisa terkalibrasi buruk — misal semua skornya menumpuk di 0,49 dan 0,51 sementara peluang sebenarnya 0,05 dan 0,95.

**Mitigasi:** jangan pernah memakai probabilitas model untuk keputusan uang sebelum memeriksa kalibrasinya — reliability diagram + ECE dulu, baru putuskan apakah kalibrasi ulang diperlukan (langkah 7).

---

## 2. Apa Itu Kalibrasi

Model terkalibrasi sempurna: di antara semua kasus yang modelnya memprediksi probabilitas p, tepat p fraksinya benar-benar berlabel 1. Reliability diagram: bagi prediksi ke bin ([0,0–0,1), [0,1–0,2), …, [0,9–1,0]), lalu plot prediksi rata-rata (sumbu-x) melawan tingkat aktual (sumbu-y). Model terkalibrasi sempurna menempel pada garis diagonal. Titik di ATAS diagonal = model MEREMEHKAN risiko; di BAWAH diagonal = MELEBIH-LEBIHKAN risiko.

$$\text{terkalibrasi sempurna} \iff \mathbb{P}(y = 1 \mid \hat{p} = p) = p \quad \text{untuk semua } p$$

**Baik/buruk:** reliability diagram bagus karena jujur dan mudah dibaca — penyimpangan dari diagonal langsung terlihat. Buruk bila dibaca tanpa memperhatikan n per bin: bin [0,8–0,9) GBM mentah hanya berisi 33 nasabah [notebook] — satu nasabah pindah kelompok mengubah tingkat aktualnya 3 poin persen. Bin dengan n kecil adalah rumor, bukan bukti.

**Mitigasi:** selalu baca reliability diagram BERSAMA n per bin dan ECE. Bin besar yang menyimpang = masalah nyata; bin kecil yang menyimpang = kemungkinan besar noise.

---

## 3. ECE dan Brier

ECE (Expected Calibration Error) — sudah dikenal dari MLE4: rata-rata |prediksi − aktual| per bin, dibobot jumlah nasabah di tiap bin. ECE 0 berarti sempurna. Brier score — rata-rata kuadrat selisih antara probabilitas prediksi dan label aktual (0/1): menghukum probabilitas yang salah DAN yang terlalu percaya diri sekaligus, dan mengukur kalibrasi sekaligus ketajaman (sharpness). Fokus baru lesson ini: membaca keduanya BERSAMA pada model yang sama, dan membandingkan sebelum vs sesudah kalibrasi ulang.

$$\mathrm{ECE} = \sum_{b=1}^{B} \frac{n_b}{N}\, \bigl|\bar{p}_b - \bar{y}_b\bigr|, \qquad \mathrm{Brier} = \frac{1}{N} \sum_{i=1}^{N} (\hat{p}_i - y_i)^2$$

**Nilai [notebook]** — test 6.000 nasabah, 10 bin: LR mentah Brier 0,1427, ECE 0,0160. LR + Platt Brier 0,1427, ECE 0,0160. LR + isotonic Brier 0,1427, ECE 0,0163. GBM mentah Brier 0,1342, ECE 0,0073 — TERBAIK di antara semuanya. GBM + Platt Brier 0,1345, ECE 0,0087. ECE GBM mentah (0,0073) kurang dari SETENGAH ECE LR (0,0160) — dan Brier GBM (0,1342) juga lebih rendah dari LR (0,1427).

**Baik/buruk:** ECE 0,0073 itu bagus — rata-rata tertimbang, probabilitas GBM meleset hanya 0,73 poin persen dari frekuensi aktual. Buruk bila ECE dibaca sendirian: ECE 0 bisa terjadi pada model yang selalu memprediksi base rate 0,2212 untuk semua orang — terkalibrasi sempurna, tapi tidak berguna. Itulah mengapa Brier ikut dibaca: Brier menghukum model yang tidak tajam.

**Mitigasi:** laporkan ECE dan Brier berpasangan, dan bandingkan antar model pada data calibration/validation yang SAMA. Bila ECE kecil tapi Brier besar, modelmu jujur tapi tumpul. Bila Brier kecil tapi ECE besar, modelmu tajam tapi berbohong — berbahaya untuk keputusan uang.

---

## 4. Three-Way Split: Calibration dan Threshold Dipilih Tanpa Melihat Final Test

Sebelum masuk ke Platt vs isotonic, berhenti sejenak — karena ada yang janggal dengan cara lesson ini menghitung angkanya. Threshold 0,10 «dipilih» karena ia terlihat terbaik pada test 6.000 yang sama tempat ia dinilai. Sementara M6.5 melarang keras memakai test «untuk memilih model, memilih threshold, atau memilih konfigurasi». Apakah lesson ini melanggar aturannya sendiri? Ya, bila angka-angka ini dibaca sebagai template evaluasi final — dan tidak, bila dibaca sebagaimana mestinya: sebagai HASIL ILUSTRASI PROTOKOL LESSON. Labelnya, ditulis eksplisit: semua angka kalibrasi dan threshold di lesson ini dihitung pada test 6.000 yang sama — angka-angka itu adalah HASIL ILUSTRASI PROTOKOL LESSON, bukan template evaluasi final yang bebas seleksi; dalam praktik, calibration + threshold dipilih di data calibration/validation, dan test final hanya dibuka sekali.

Protokol yang benar memakai TIGA bagian data, bukan dua. **Train** — tempat model dilatih. **Calibration/validation** — tempat SEMUA pilihan dibuat: metode kalibrasi (Platt, isotonic, atau tanpa kalibrasi), konfigurasi model, dan threshold. **Final test** — tempat seluruh prosedur dievaluasi, dibuka SEKALI di akhir, dan tidak ada satu pun keputusan yang diambil sesudahnya. Bila setelah melihat final test kamu mengubah threshold dari 0,15 menjadi 0,10 karena 0,10 «kelihatan lebih baik», final test-mu sudah bukan test lagi — ia sudah menjadi validation kedua, dan angka yang kamu laporkan adalah angka yang sudah dipilih-untuk-terlihat-baik (winner's curse, topik M6.5).

**Gambar:** three-way split — train 18.000 (latih model) → calibration/validation 6.000 (pilih kalibrasi + threshold) → final test 6.000 (TERKUNCI, dibuka SEKALI). Panah mengalir satu arah dan tidak pernah kembali. Contoh pembagian 30.000 [ilustrasi]; yang kanonis adalah prinsip pemisahannya.

**Nilai [ilustrasi]:** contoh pembagian 30.000 nasabah menjadi train 18.000, calibration/validation 6.000, dan final test 6.000. Angka ini BUKAN dari notebook — ia contoh pembagian, bukan angka kanonis. Harganya: train lebih kecil (18.000 bukan 24.000), jadi model sedikit lebih lemah — tapi angka evaluasinya jujur.

**Baik/buruk:** three-way split bagus karena ia memisahkan «memilih» dari «menilai» secara fisik. Buruk bila dibaca sebagai «buang-buang data»: pada data kecil, alternatifnya adalah cross-validation di dalam train untuk memilih, lalu satu final test di akhir (M6.2, nested CV). Yang TIDAK boleh adalah jalan pintas lesson ini: memilih di test yang sama dengan tempat menilai — lesson ini memakainya HANYA agar angkanya bisa dihitung dalam satu notebook.

**Mitigasi — checklist sebelum membuka final test (ketiganya harus YA):** (1) Apakah calibration method (Platt/isotonic/tanpa kalibrasi) dipilih tanpa melihat final test? (2) Apakah threshold dipilih tanpa melihat final test? (3) Apakah model (LR vs GBM, dan konfigurasinya) dipilih tanpa melihat final test? Satu jawaban TIDAK berarti final test-mu sudah bocor.

**Lab 3 (ringkas):** biaya total per threshold di data calibration 6.000 [ilustrasi] — 0,10 → NT$34.200.000; 0,15 → NT$33.800.000; 0,20 → NT$41.000.000 — melawan biaya final test kanonis [notebook] — 0,10 → NT$33.046.500; 0,15 → NT$35.770.000; 0,20 → NT$41.477.000. Hasil [lab]: best_calib_threshold=0.15; final_cost_chosen=35770000; best_test_threshold=0.10; optimism_gap=2723500. Threshold TERBAIK di kalibrasi (0,15) BUKAN yang terbaik di test (0,10) — laporan yang jujur adalah biaya 0,15 di test (NT$35.770.000).

---

## 5. Platt vs Isotonic

Platt scaling (sigmoid): pasang kurva logistik pada skor mentah — dua parameter (a, b), p_kal = 1 / (1 + exp(a·s + b)). Bentuknya kaku, tapi hanya butuh sedikit data dan tidak mudah overfit. Isotonic regression: fungsi tangga MONOTON bebas bentuk — jauh lebih fleksibel, tapi butuh BANYAK data kalibrasi dan mudah overfit. Keduanya dipasang pada data kalibrasi terpisah (di sini CalibratedClassifierCV cv=3 (detail implementasi notebook, bukan angka kanonis)) dan keduanya TIDAK mengubah ranking — keduanya monoton terhadap skor mentah, jadi urutannya tetap — perubahan ROC-AUC 0,0007 (0,7823 → 0,7816) berasal dari rata-rata 3 fold kalibrasi, bukan dari pergeseran ranking.

$$p_{\mathrm{Platt}} = \frac{1}{1 + \exp(a\, s + b)}, \qquad p_{\mathrm{iso}} = g(s), \; g \text{ monoton naik (fungsi tangga)}$$

**Nilai [notebook] — kejujuran utama lesson ini:** kalibrasi ulang TIDAK memperbaiki apa pun di data ini. LR mentah 0,1427 / 0,0160 → LR + Platt 0,1427 / 0,0160 (IDENTIK sampai 4 desimal), LR + isotonic 0,1427 / 0,0163 (ECE malah sedikit MEMBURUK). GBM mentah 0,1342 / 0,0073 → GBM + Platt 0,1345 / 0,0087 (Brier naik 0,0003, ECE naik 0,0014 — keduanya MEMBURUK sedikit). Model terbaik menurut Brier adalah GBM MENTAH, tanpa kalibrasi ulang apa pun.

**Baik/buruk:** Platt bagus bila skor mentahnya berbentuk kurva-S yang bergeser. Buruk bila dipakai buta-buta: di sini ia menggeser probabilitas GBM yang SUDAH benar, sehingga ECE naik 0,0073 → 0,0087. Isotonic bagus bila datanya besar dan bentuk mis-kalibrasinya aneh. Buruk di data ini: ECE LR + isotonic 0,0163 vs mentah 0,0160 — fleksibilitasnya justru menangkap noise.

**Mitigasi:** JANGAN ajarkan — dan jangan lakukan — «Platt/isotonic selalu membantu». Cek dulu (reliability diagram + ECE); kalibrasi ulang HANYA bila ECE-nya besar; lalu bandingkan sebelum vs sesudah pada data calibration/validation yang sama — dan berani membuang hasil kalibrasi bila angkanya memburuk. Di data ini keputusan yang benar adalah: pakai GBM mentah.

---

## 6. Worked Example: Dua Bin Reliability GBM

**Gambar:** reliability diagram GBM mentah — 9 bin menempel dekat diagonal (bin [0,9–1,0) kosong). ECE 0,0073.

**Nilai [notebook] — dua bin contoh.** Bin [0,2–0,3): n = 752 nasabah, prediksi rata-rata 0,2419, tingkat aktual 0,2221. Selisih 0,0198 — model sedikit MELEBIH-LEBIHKAN risiko: dari 752 nasabah, yang benar-benar default 167 orang (0,2221 × 752), sementara prediksi menyiratkan sekitar 182 orang. Bin [0,7–0,8): n = 258 nasabah, prediksi rata-rata 0,7441, tingkat aktual 0,7481. Selisih hanya 0,0040 — nyaris sempurna: 193 dari 258 benar-benar default, prediksinya 0,7441. Sumbangannya ke ECE hanya (258/6.000) × 0,0040 = 0,0002.

Bin-bin lain [notebook]: [0,0–0,1) n = 1.791, prediksi 0,0647 vs aktual 0,0670 (selisih 0,0023 — sangat baik, dan bin TERBESAR); [0,5–0,6) n = 156, prediksi 0,5545 vs aktual 0,5064 (selisih 0,0481 — penyimpangan terbesar KEDUA setelah bin [0,8–0,9) sebesar 0,0485, tapi sumbangan ke ECE hanya (156/6.000) × 0,0481 = 0,0013); [0,8–0,9) n = 33, prediksi 0,8303 vs aktual 0,8788 (selisih 0,0485 — besar, tapi n = 33: satu nasabah pindah mengubah aktual 3 poin persen).

**Baik/buruk:** bin [0,2–0,3) bagus sebagai «penyimpangan kecil yang nyata» — n = 752 cukup besar sehingga selisih 0,0198 bukan sekadar noise. Bin [0,7–0,8) bagus sebagai «kalibrasi yang bisa dipercaya di ujung berisiko» — justru di daerah yang menentukan penolakan pinjaman. Buruk bila bin [0,8–0,9) dibaca sebagai «model meremehkan risiko tinggi»: n = 33 terlalu kecil untuk vonis itu.

**Mitigasi:** untuk tiap bin, tanyakan: (1) berapa n-nya? (2) berapa sumbangan tertimbangnya ke ECE? Reaksi hanya untuk bin dengan n besar DAN sumbangan besar. Di data ini tidak ada bin seperti itu — itulah alasan GBM mentah lolos tanpa kalibrasi ulang.

---

## 7. Kapan Kalibrasi Diperlukan — dan Kapan Tidak

Peta keputusan tiga cabang. **Cabang 1:** ECE kecil (GBM mentah 0,0073) DAN reliability diagram menempel diagonal di bin-bin besar → TIDAK PERLU kalibrasi ulang. **Cabang 2:** ECE besar ATAU ada bin besar yang menyimpang jauh → kalibrasi ulang DIPERLUKAN. Platt bila data kecil dan bentuk mis-kalibrasi diduga kurva-S; isotonic bila data besar dan bentuknya aneh. Bandingkan sebelum vs sesudah pada data calibration/validation yang sama — kalibrasi yang ECE-nya tidak membaik adalah kalibrasi yang GAGAL, buang. **Cabang 3:** bila yang dibutuhkan hanya RANKING (memilih 10% nasabah paling berisiko untuk ditinjau manual), kalibrasi tidak relevan — ROC-AUC sudah cukup. Kalibrasi baru wajib saat angka probabilitasnya sendiri dipakai: threshold keputusan, expected loss, harga, cadangan, atau pelaporan risiko.

**Baik/buruk:** peta tiga cabang ini bagus karena mengubah kalibrasi dari ritual menjadi keputusan berbasis bukti. Buruk bila ECE dibaca tanpa ambang konteks: «ECE besar» itu relatif terhadap keputusanmu. Bila threshold-mu 0,10 dan ECE-mu 0,0073, kesalahan kalibrasi rata-rata 0,73 poin persen tidak akan mengubah banyak keputusan.

**Mitigasi:** tetapkan ambang ECE-mu SEBELUM melihat angkanya, dan tulis alasannya. Tanpa ambang yang ditulis dulu, kamu akan menafsir ulang angkanya sampai cocok dengan yang kamu inginkan.

---

## 8. Threshold Bukan 0,5

Konvensi lesson ini: setujui bila probabilitas default prediksi DI BAWAH threshold (threshold = batas atas risiko yang masih diterima). Threshold 0,5 adalah default yang paling umum — dan di data ini ia menghancurkan laba. Bukan karena modelnya buruk, melainkan karena biaya kedua jenis kesalahan sangat tidak seimbang.

**Nilai [notebook]** — GBM terkalibrasi (Platt/sigmoid), test 6.000: threshold 0,10 → approval rate 28,5% (1.710 dari 6.000 disetujui), bad rate di antara yang disetujui 6,67% (114 dari 1.710 ternyata default), total biaya NT$33.046.500, net profit +NT$8.214.000. Threshold 0,50 → approval rate 88,05% (5.283 dari 6.000 disetujui), bad rate 15,96% (843 dari 5.283 default), total biaya NT$60.254.956, net profit −NT$18.994.456. Selisih labanya NT$27.208.456.

Menaikkan threshold 0,10 → 0,50 menyetujui 3.573 nasabah tambahan — dan 729 di antaranya default (843 − 114). Setiap nasabah tambahan membawa margin 5% bila lancar, tapi kerugian 45% dari limit bila default.

**Gambar:** net profit vs threshold — 0,10: +NT$8.214.000; 0,15: +NT$5.490.500; 0,20: −NT$216.500; 0,25: −NT$3.107.456; 0,30: −NT$6.311.956; 0,50: −NT$18.994.456. Laba hanya positif di threshold rendah.

**Baik/buruk:** threshold 0,10 bagus di data ini — yang disetujui 93,33%-nya lancar, labanya positif. Buruk bila dibaca sebagai «model yang pelit»: 0,10 bukan sifat model, melainkan sifat BIAYA — dengan margin lebih besar atau LGD lebih kecil, threshold optimalnya akan naik. Threshold 0,50 buruk di sini, tapi bukan karena «0,5 itu angka yang salah secara universal».

**Mitigasi:** JANGAN PERNAH memakai 0,5 sebagai default tanpa menghitung biaya. Threshold adalah keputusan bisnis, bukan parameter model.

---

## 9. Threshold Cost-Sensitive: LGD 45% vs Margin 5%

Setujui satu nasabah dengan probabilitas default p: bila lancar (peluang 1 − p), dapat margin 5% dari limit; bila default (peluang p), hilang 45% dari limit (LGD). Keuntungan harapan = (1 − p) × 0,05 − p × 0,45. Setujui bila positif: p < 0,05 / (0,05 + 0,45) = 0,10. Itulah ambang impas (break-even) — sama persis dengan threshold optimal empiris.

$$p^* = \frac{\text{margin}}{\text{margin} + \text{LGD}} = \frac{0{,}05}{0{,}05 + 0{,}45} = 0{,}10, \qquad \text{setujui bila } \hat{p} < p^*$$

**Nilai [notebook]:** profit-max threshold = 0,10 (net profit +NT$8.214.000, approval 28,5%, bad rate 6,67%, total biaya NT$33.046.500) dan cost-optimal threshold = 0,10 (total biaya NT$33.046.500, terendah pada grid 0,05–0,90 langkah 0,05) — keduanya SEPAKAT. Biaya pada 0,05: NT$37.163.000; pada 0,15: NT$35.770.000; pada 0,50: NT$60.254.956. Pembanding: menyetujui SEMUA nasabah biayanya NT$82.155.456, menolak SEMUA nasabah NT$41.260.500 — threshold 0,10 mengalahkan keduanya.

**Baik/buruk:** kesepakatan profit-max dan cost-optimal di 0,10 itu bagus — dua kriteria yang dihitung dengan cara berbeda menunjuk angka yang sama, dan cocok dengan ambang impas teoretis. Buruk bila dibaca sebagai «0,10 benar secara universal»: ubah LGD menjadi 20% dan margin menjadi 15%, dan ambang impasnya berubah (0,15/(0,15+0,20) = 0,43).

**Mitigasi:** nyatakan asumsi biaya secara eksplisit di samping setiap threshold — «threshold 0,10, dengan LGD 45% dan margin 5%». Bila asumsi biaya berubah, hitung ulang thresholdnya.

---

## 10. Operating Points: Threshold dari Constraint Bisnis

Satu model, banyak operating point. ROC-AUC GBM 0,7823 [notebook] adalah angka TUNGGAL — ia menilai ranking tanpa peduli di ambang berapa kamu memotong. Tapi setiap threshold menghasilkan confusion matrix yang berbeda. Threshold adalah OPERATING POINT: satu titik di kurva ROC (dan kurva PR) tempat kamu memilih beroperasi. Langkah 8–9 memilih operating point dari BIAYA (profit-max / cost-min). Langkah ini menambahkan cara kedua: memilih dari CONSTRAINT bisnis — dan menunjukkan kapan keduanya bertentangan.

**Nilai [notebook] — tabel kebijakan GBM terkalibrasi (Platt/sigmoid), test 6.000:** t = 0,10 → approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, laba +NT$8.214.000. t = 0,15 → approval 49,88%, bad rate 8,99%, biaya NT$35.770.000, laba +NT$5.490.500. t = 0,20 → approval 65,13%, bad rate 11,13%, biaya NT$41.477.000, laba −NT$216.500. t = 0,50 → approval 88,05%, bad rate 15,96%, biaya NT$60.254.956, laba −NT$18.994.456. Keempat baris ini adalah empat operating point dari SATU ranking yang sama — ROC-AUC-nya tetap 0,7823 di keempatnya.

**Gambar:** ROC curve GBM dengan empat operating point — t = 0,10 di FPR 0,6585 / TPR 0,9141; t = 0,15 di FPR 0,4171 / TPR 0,7973; t = 0,20 di FPR 0,2568 / TPR 0,6722; t = 0,50 di FPR 0,0499 / TPR 0,3647. Keempat titik dihitung dari confusion matrix kanonis; kurva di antaranya sketsa [ilustrasi].

Tiga constraint bisnis — dan tiga jawaban. **Constraint 1: approval rate MINIMUM 50%.** Yang lolos: 0,20 (65,13%) dan 0,50 (88,05%) — 0,15 (49,88%) GUGUR, selisih 0,12 poin persen. Terbaik di antara yang lolos: 0,20, laba −NT$216.500. **Constraint 2: bad rate MAKSIMUM 10%.** Yang lolos: 0,10 (6,67%) dan 0,15 (8,99%); terbaik: 0,10, laba +NT$8.214.000 — sama dengan profit-max, karena constraint-nya tidak mengikat. **Constraint 3: recall (menangkap default) MINIMUM 80%** — recall = TP/(TP+FN): 0,10 → 1.213/1.327 = 91,41%; 0,15 → 1.058/1.327 = 79,73% (gugur); 0,20 → 67,22%; 0,50 → 36,47%. Hanya 0,10 yang lolos.

**Baik/buruk:** operating point dari constraint bagus karena ia jujur soal apa yang bisnis butuhkan. Buruk bila constraint ditulis SESUDAH melihat tabel — memilih ambang 49,88% sebagai «minimum» karena 0,15 terlihat menarik adalah cherry-picking. Constraint yang sah ditetapkan SEBELUM melihat angka — dan harganya dihitung terbuka: constraint approval 50% mengorbankan 8.214.000 − (−216.500) = NT$8.430.500 laba dibanding profit-max.

**Mitigasi:** untuk setiap threshold yang direkomendasikan, laporkan TIGA hal berdampingan: (1) confusion matrix-nya (threshold-dependent), (2) metrik ranking-nya — ROC-AUC/PR-AUC (threshold-independent, sama di semua threshold), dan (3) constraint yang ia penuhi dan yang ia langgar.

**Lab 4 (ringkas):** dari tabel kebijakan kanonis [notebook]. Hasil [lab]: best_profit_threshold=0.10; best_constrained_threshold=0.20; constraint_cost=8430500; approved_020=3908; bad_020=435; roc_auc_at_010=0.7823; roc_auc_at_020=0.7823. ROC-AUC 0,7823 SAMA di t = 0,10 dan t = 0,20 — ranking tidak berubah saat threshold bergerak; yang berubah hanya confusion matrix-nya (disetujui 1.710 vs 3.908 nasabah, default di antaranya 114 vs 435).

---

## 11. Jebakan: Expected-Loss Minimum yang Degenerat

**Nilai [notebook]:** min-expected-loss threshold = 0,10, dengan expected loss atas buku yang disetujui NT$11.989.453. Kedengarannya seperti «threshold optimal» ketiga — tapi ia degenerat. Expected loss di sini dihitung HANYA atas buku yang disetujui (p × LGD × limit atas nasabah yang disetujui). Makin sedikit yang disetujui, makin kecil expected loss-nya — secara mekanis. Setujui NOL nasabah, expected loss-mu NOL — «sempurna» menurut kriteria ini, dan bangkrut menurut kriteria apa pun yang waras.

Expected loss atas buku yang disetujui di 0,10 adalah NT$11.989.453, di 0,50 NT$56.668.700. Tapi itu sebagian besar karena di 0,10 hanya 1.710 nasabah disetujui vs 5.283 di 0,50. Expected loss PER nasabah yang disetujui: NT$7.011 di 0,10 vs NT$10.727 di 0,50 — perbedaannya nyata tapi jauh lebih kecil daripada perbandingan totalnya, dan kriteria ini tetap tidak pernah bertanya «berapa margin yang hilang karena menolak 4.290 nasabah?»

**Baik/buruk:** min-expected-loss bagus sebagai DIAGNOSIS — berapa kerugian harapan yang dibawa buku yang disetujui. Buruk sebagai KRITERIA OPTIMASI — ia menghargai bank yang tidak meminjamkan apa pun. Perbandingan yang bermakna adalah profit-max vs cost-min: keduanya menghitung KEDUA sisi dan sepakat di 0,10.

**Mitigasi:** setiap kali seseorang menyodorkan «threshold optimal» dari satu kriteria, tanyakan: apakah kriteria ini menghukum KEDUA jenis kesalahan? Bila hanya satu sisi, ia akan terdorong ke tepi — dan jawabannya adalah artefak, bukan keputusan.

---

## 12. Peta Keputusan: Kalibrasi + Threshold dalam Satu Alur

**A** — latih model, ukur ranking (ROC-AUC, PR-AUC). **B** — cek kalibrasi: reliability diagram + ECE + Brier pada data calibration/validation. ECE kecil + bin besar menempel diagonal (GBM mentah, ECE 0,0073) → lanjut dengan model mentah. Bila tidak, kalibrasi ulang (Platt untuk data kecil, isotonic untuk data besar) dan bandingkan sebelum vs sesudah — buang bila tidak membaik. (Di lesson ini angka-angka langkah B dihitung pada test 6.000 sebagai ilustrasi protokol — lihat langkah 4.) **C** — tulis asumsi biaya eksplisit: LGD, margin. **D** — hitung ambang impas teoretis p* = margin/(margin + LGD) sebagai tebakan awal. **E** — grid threshold pada probabilitas TERKALIBRASI (grid 0,05–0,90 langkah 0,05), hitung total biaya dan net profit, pilih yang meminimalkan biaya / memaksimalkan laba. **F** — verifikasi: apakah profit-max dan cost-optimal sepakat? Apakah keduanya dekat dengan p* teoretis? Di data ini ketiganya 0,10. Bila ketiganya BERBEDA jauh, selidiki: mungkin kalibrasinya masih buruk, mungkin asumsi biayanya salah, mungkin grid-nya terlalu kasar.

**Baik/buruk:** alur ini bagus karena urutannya penting — threshold HANYA bermakna bila kalibrasi sudah beres. Grid threshold pada probabilitas yang berbohong menghasilkan threshold yang salah dengan penuh percaya diri. Buruk bila dibaca sebagai sekali-jalan: kalibrasi bergeser saat populasi bergeser, dan biaya berubah saat kebijakan agunan berubah — langkah B–F adalah pekerjaan BERKALA, bukan sekali seumur hidup.

**Mitigasi:** dokumentasikan keempat angka ini di samping setiap model yang masuk produksi — ECE, Brier, threshold, dan asumsi biaya (LGD + margin) — lengkap dengan tanggal dan data evaluasinya.

---

## Lab 1: ECE Manual dari Tiga Bin Kanonis

Tiap bin menyumbang (n_bin / N) × |prediksi − aktual|, lalu dijumlahkan. Tiga bin GBM mentah [notebook]: [0,0–0,1) n = 1.791, prediksi 0,0647, aktual 0,0670; [0,2–0,3) n = 752, prediksi 0,2419, aktual 0,2221; [0,7–0,8) n = 258, prediksi 0,7441, aktual 0,7481. N = 6.000.

Hasil [lab]: gap_00_01=0.0023; gap_02_03=0.0198; gap_07_08=0.0040; partial_ece_3bins=0.0033. Ini ECE PARSIAL — hanya 3 dari 10 bin. ECE penuh GBM mentah adalah 0,0073; ketiga bin ini menyumbang 0,0033 dari 0,0073 itu. Bin [0,2–0,3) penyumbang terbesar: (752/6.000) × 0,0198 = 0,0025.

## Lab 2: Profit vs Threshold

Tiga TODO dari angka kanonis GBM terkalibrasi (Platt/sigmoid) [notebook]: ambang impas p* = margin/(margin + LGD); approval rate dan bad rate pada t = 0,10 dari confusion matrix (TN 1.596, FN 114 — disetujui = TN + FN); selisih laba t = 0,10 (+NT$8.214.000) vs t = 0,50 (−NT$18.994.456).

Hasil [lab]: p_star=0.1000; approval_010=0.2850; bad_rate_010=0.0667; profit_gap=27208456. p* teoretis (0,1000) sama dengan threshold empiris profit-max. profit_gap NT$27.208.456 sama persis dengan selisih total biaya (NT$60.254.956 − NT$33.046.500).

## Lab 3: Three-Way Split — Pilih di Kalibrasi, Nilai Sekali di Final Test

Biaya total (NT$) per threshold — data calibration 6.000 [ilustrasi] vs final test 6.000 [notebook]: kalibrasi 0,10 → 34.200.000; 0,15 → 33.800.000; 0,20 → 41.000.000. Final test: 0,10 → 33.046.500; 0,15 → 35.770.000; 0,20 → 41.477.000.

Hasil [lab]: best_calib_threshold=0.15; final_cost_chosen=35770000; best_test_threshold=0.10; optimism_gap=2723500. Threshold TERBAIK di kalibrasi (0,15) BUKAN yang terbaik di test (0,10) — laporan yang jujur adalah biaya 0,15 di test (NT$35.770.000), bukan biaya 0,10 yang baru dipilih setelah mengintip test. Selisihnya (NT$2.723.500) adalah optimism gap: harga seleksi-di-test.

## Lab 4: Operating Points — Threshold dari Constraint Bisnis

Dari tabel kebijakan kanonis [notebook]: threshold profit-max tanpa constraint vs threshold terbaik di bawah constraint approval rate minimum 50%; hitung constraint cost dan confusion matrix pada t = 0,20.

Hasil [lab]: best_profit_threshold=0.10; best_constrained_threshold=0.20; constraint_cost=8430500; approved_020=3908; bad_020=435; roc_auc_at_010=0.7823; roc_auc_at_020=0.7823. Constraint approval 50% menggugurkan 0,15 (49,88%) — di antara yang lolos (0,20 dan 0,50), terbaik adalah 0,20 dengan harga NT$8.430.500 laba. ROC-AUC 0,7823 SAMA di kedua threshold — ranking tidak bergantung threshold; confusion matrix-lah yang berubah.

## Guided Task di Colab

Notebook: colab/mlf-m64-guided-task.ipynb — flagship LR/GBM, kalibrasi mentah vs Platt vs isotonic, reliability bins + ECE + Brier, dan grid threshold + profit/cost dengan LGD 45% dan margin 5%. (Tautan Colab Drive diisi koordinator saat notebook di-upload.)

## Rangkuman

- Ranking ≠ kalibrasi: ROC-AUC GBM 0,7823 [notebook] mengukur urutan, bukan kejujuran probabilitas — kejujuran dibuktikan reliability diagram, bukan ROC-AUC.
- Kalibrasi [notebook]: GBM mentah Brier 0,1342 / ECE 0,0073 (terbaik); LR mentah 0,1427 / 0,0160; LR + Platt 0,1427 / 0,0160; LR + isotonic 0,1427 / 0,0163; GBM + Platt 0,1345 / 0,0087.
- Kalibrasi ulang TIDAK memperbaiki apa pun di data ini — GBM mentah sudah terkalibrasi baik; Platt/isotonic malah sedikit memburuk. Cek dulu, baru putuskan.
- Reliability bins GBM mentah [notebook]: [0,2–0,3) n = 752, prediksi 0,2419 vs aktual 0,2221 (selisih 0,0198); [0,7–0,8) n = 258, prediksi 0,7441 vs aktual 0,7481 (selisih 0,0040).
- Threshold (GBM terkalibrasi (Platt/sigmoid)) [notebook]: t = 0,10 → approval 28,5%, bad rate 6,67%, biaya NT$33.046.500, laba +NT$8.214.000; t = 0,50 → approval 88,05%, bad rate 15,96%, biaya NT$60.254.956, laba −NT$18.994.456.
- Ambang impas p* = 0,05/(0,05+0,45) = 0,10 (LGD 45%, margin 5%) — profit-max dan cost-optimal SEPAKAT di 0,10, cocok dengan teori.
- Min-expected-loss (0,10, NT$11.989.453) DEGENERAT: hanya menghitung kerugian buku yang disetujui — menyetujui nol nasabah memberi expected loss nol. Perbandingan yang bermakna: profit-max vs cost-min.
- Lab: ECE parsial 3 bin GBM mentah = 0,0033 (dari ECE penuh 0,0073); p* = 0,1000, approval 0,10 = 0,2850, bad rate = 0,0667, selisih laba 0,10 vs 0,50 = NT$27.208.456.
- Three-way split: calibration + threshold + model dipilih di train/calibration-validation; final test dibuka SEKALI di akhir. Semua angka lesson ini adalah HASIL ILUSTRASI PROTOKOL LESSON (dihitung pada test 6.000 yang sama), bukan template evaluasi final — lab 3: threshold terbaik di kalibrasi 0,15, biaya jujur di test NT$35.770.000, optimism gap NT$2.723.500.
- Operating points: satu ranking (ROC-AUC 0,7823) punya banyak operating point — confusion matrix threshold-dependent, ranking threshold-independent. Constraint approval minimum 50% memilih 0,20 (laba −NT$216.500, harga NT$8.430.500); bad rate maksimum 10% dan recall minimum 80% memilih 0,10 — lab 4: best_constrained_threshold=0.20, constraint_cost=8430500, approved_020=3908, bad_020=435.

# MLF-M5.1: Gradient Descent — Menuruni Bukit dengan Kompas Gradien

## Masalah: Dari «Model Apa» ke «Keputusan Berapa»

Modul M5 adalah optimasi & konstruksi portofolio: dari «model apa yang dipakai» (M1–M4) ke «keputusan apa yang diambil» — bobot portofolio berapa, threshold berapa, parameter berapa. Algoritma yang membuka modul ini adalah gradient descent (GD): hampir semua model di M1–M4 — logistic regression dan neural network — umumnya dioptimasi dengan GD atau variannya (meski logistic regression juga lazim diselesaikan dengan Newton/IRLS); GBM adalah gradient descent di ruang fungsi, bukan GD pada parameter biasa.

Optimasi punya tiga bahan: fungsi tujuan (angka yang diminimalkan/dimaksimalkan — misal variansi portofolio atau loss model), variabel keputusan (angka yang boleh diubah — misal bobot tiap aset), dan kendala (aturan yang harus dipatuhi — misal bobot berjumlah 1). Lesson ini fokus pada fungsi tujuan + variabel keputusan; kendala dibahas penuh di M5.2.

Angka acuan: harga BBCA, KLBF, UNVR (window pin 2024-11-01 s.d. 2026-11-12; file pin diunduh 2026-11-12), 480 hari return SIMPLE, 2024-11-04 s.d. 2026-11-11, rf = 0,05 [notebook]. Return tahunan: BBCA −0,2445, KLBF −0,2570, UNVR 0,0796; volatilitas tahunan: BBCA 0,3449, KLBF 0,4251, UNVR 0,5014. Korelasi BBCA–KLBF 0,3488.

---

## 1. Apa Itu Optimasi

**Nilai:** optimasi adalah bahasa yang menyatukan dua dunia di track ini — melatih model (meminimalkan loss) dan membangun portofolio (meminimalkan variansi). Algoritma yang sama, fungsi tujuan yang berbeda.

**Baik/buruk:** merumuskan masalah sebagai optimasi itu bagus — ia memaksa kamu menuliskan dengan jujur apa yang sebenarnya dimau dan apa yang boleh diubah. Buruk bila fungsi tujuannya salah: optimasi akan menemukan jawaban TERBAIK untuk pertanyaan yang SALAH — misal meminimalkan variansi tanpa peduli return menghasilkan portofolio yang «aman» tapi merugi (GMV di data ini return −0,1903 [notebook]).

**Mitigasi:** sebelum memilih algoritma, tulis dulu fungsi tujuan dan kendalanya dalam satu kalimat. Bila kalimat itu tidak bisa ditulis, masalahnya belum siap dioptimasi.

---

## 2. Gradien sebagai Kompas

Gradien adalah vektor turunan parsial yang menunjuk ke arah fungsi NAIK paling curam; panjangnya mengukur kecuraman.

**Nilai [ilustrasi]:** f(x, y) = x² + 10y² → ∇f(x, y) = (2x, 20y). Di start (4, 4): ∇f = (8, 80) — komponen y sepuluh kali komponen x. Nilai fungsi di start: f(4, 4) = 16 + 160 = 176.

$$\nabla f(x, y) = \left( \frac{\partial f}{\partial x},\, \frac{\partial f}{\partial y} \right)$$

**Baik/buruk:** gradien bagus karena hanya butuh informasi LOKAL. Buruk bila dibaca sebagai «arah ke lembah»: gradien menunjuk ke arah naik TERDEKAT, bukan ke minimum global.

**Mitigasi:** pasangkan gradien dengan ukuran langkah yang masuk akal (learning rate).

---

## 3. Update Rule & Learning Rate

$$\theta_{t+1} = \theta_t - \eta\, \nabla f(\theta_t)$$

**Nilai [ilustrasi]:** η = 0,05 pada f(x, y) = x² + 10y² dari (4, 4): langkah pertama = 0,05 × (8, 80) = (0,4; 4,0), posisi baru (3,6; 0,0) — komponen y langsung NOL dalam satu langkah (20η = 1). Fungsi jatuh dari 176 ke 12,96 dalam SATU langkah.

**Baik/buruk:** η kecil aman tapi lambat (η = 0,01 butuh 52 langkah untuk f < 2, η = 0,05 hanya 10). η besar cepat bila tepat, tapi rapuh (η = 0,12 → f = 133.869,2748).

**Mitigasi:** tidak ada η «benar» yang universal. Coba beberapa η dan lihat kurva f-nya; bila f naik, η terlalu besar — kecilkan.

---

## 4. Worked Example: Mangkuk Kuadratik

GD pada f(x, y) = x² + 10y² dari (4, 4), 10 langkah, empat learning rate [notebook]. Nilai awal f(4, 4) = 176.

- **η = 0,01 → f = 12,5264.** Lambat tapi stabil: x menyusut 2% per langkah, y 20% per langkah. Posisi akhir (3,2683; 0,4295). Butuh 52 langkah untuk f < 2.
- **η = 0,05 → f = 1,9452.** Terbaik setelah 10 langkah. y langsung nol di langkah pertama, x menyusut 10% per langkah. Posisi akhir (1,3947; 0,0000).
- **η = 0,09 → f = 2,1469.** Sedikit lebih buruk dari 0,05 setelah 10 langkah — tapi pada langkah ke-11 f-nya 1,3838, menyalip 0,05. y berosilasi (faktor −0,8) sambil menyusut.
- **η = 0,12 → f = 133.869,2748.** DIVERGEN. y berosilasi dengan faktor −1,4 — |y| membesar 40% tiap langkah: y akhir 115,7019, x akhir 0,2572.

**Gambar:** f per langkah untuk η = 0,01; 0,05; 0,09. η = 0,12 tidak diplot — nilainya ±740× skala gambar.

**Baik/buruk:** mangkuk kuadratik bagus sebagai laboratorium — convex, satu minimum global, keempat nasib η terlihat bersih. Buruk bila dianggap mewakili semua masalah: di fungsi non-convex, GD bisa berhenti di minimum lokal atau saddle point.

**Mitigasi:** plot f per langkah. Kurva turun mulus = sehat; naik-turun = η terlalu besar; datar = η terlalu kecil atau gradien sudah mengecil.

---

## 5. Konvergensi: Kapan Berhenti

Tiga kriteria berhenti yang umum: (1) ‖∇f‖ < ε; (2) |f(θ_t) − f(θ_{t−1})| < ε; (3) batas langkah maksimum.

**Nilai [ilustrasi]:** mangkuk kuadratik, η = 0,05: setelah 10 langkah gradien (2,7894; 0), f = 1,9452. Dengan |Δf| < 0,01, GD berhenti sekitar langkah 29; dengan ‖∇f‖ < 0,1, sekitar langkah 42. Kriteria berbeda memberi titik berhenti berbeda — «konvergen» adalah ambang yang kamu pilih.

**Convex vs non-convex:** fungsi CONVEX (mangkuk kuadratik) hanya punya SATU minimum, dan itu minimum global. Fungsi NON-CONVEX punya banyak minimum lokal dan saddle point: GD berhenti di lembah TERDEKAT.

**Baik/buruk:** kriteria berhenti eksplisit bagus — tanpanya kamu tidak tahu apakah GD konvergen atau hanya kehabisan waktu. Buruk bila terlalu longgar: berhenti di f = 12,5264 dan mengira itu minimum adalah salah baca — gradiennya masih (6,5366; 8,5900).

**Mitigasi:** di fungsi non-convex, jalankan GD dari BEBERAPA start berbeda dan bandingkan titik akhirnya.

---

## 6. Momentum & Adam

**Momentum:** beri GD «kecepatan» — tiap langkah memakai sebagian langkah sebelumnya. Osilasi di arah curam saling meniadakan, gerakan di arah landai yang konsisten dipercepat. Di mangkuk kuadratik, momentum membuat η = 0,01 yang merangkak menjadi jauh lebih cepat tanpa menaikkan η ke zona divergen.

**Adam:** tiap parameter mendapat learning rate-nya sendiri yang menyesuaikan otomatis — gradien besar dan berubah-ubah → langkah efektif lebih kecil; gradien kecil dan stabil → langkah efektif lebih besar. Default di hampir semua pelatihan neural network.

**Baik/buruk:** momentum bagus di lembah panjang-sempit dan gradien berisik; buruk bila terlalu besar (bola melompati lembah). Adam bagus sebagai default yang «jalan dulu»; buruk bila dianggap «tidak perlu disetel» — di beberapa masalah, GD polos dengan learning-rate schedule masih mengalahkannya.

**Mitigasi:** mulai dari Adam bila tidak tahu apa-apa tentang fungsinya; pindah ke GD + momentum bila butuh hasil akhir terbaik dan punya waktu menyetel. Apa pun optimizer-nya, plot f per langkah.

---

## 7. GD vs Closed-Form

**Nilai [notebook]:** bobot GMV 3-aset (BBCA, KLBF, UNVR) dari rumus tertutup adalah (0,5518; 0,2698; 0,1785) — vol 0,2966. Closed-form menang bila dimensinya kecil, fungsinya kuadratik, dan tidak ada kendala aneh. GD menang bila TIDAK ADA rumus tertutup: risk parity (0,3980; 0,3212; 0,2808) tidak punya rumus tertutup dan harus dicari iteratif.

**Peringatan dari data:** max-Sharpe tanpa kendala menghasilkan bobot (−3154,746; −3786,1043; 6941,8503) [notebook] — return 2296,983, vol 3429,6914. Rumusnya «benar», keputusannya tidak bisa dieksekusi. Itulah mengapa M5.2 (kendala) ada.

**Baik/buruk:** closed-form bagus — eksak, cepat, tanpa hyperparameter. Buruk bila dipakai di luar wilayahnya: begitu kendala «bobot tidak boleh negatif» masuk, rumus tertutup tidak lagi berlaku. GD bagus — umum. Buruk karena lambat dan butuh penyetelan.

**Mitigasi:** sebelum menjalankan GD, tanyakan «apakah masalah ini punya rumus tertutup?» Bila ya, pakai itu sebagai jawaban — atau setidaknya sebagai pembanding untuk memvalidasi GD-mu.

---

## 8. GD pada Portofolio Min-Variance (Data Nyata)

Portofolio 2 aset, BBCA + KLBF. Fungsi tujuan: variansi Var(w) = wᵀΣw. Start equal-weight w = (0,5; 0,5), η = 0,5, satu langkah.

**Nilai [notebook]:** Σ tahunan (return SIMPLE 480 hari) = [[0,118956; 0,051145], [0,051145; 0,180734]]. BBCA vol 0,3449, KLBF vol 0,4251, korelasi 0,3488. Gradien ∇Var = 2Σw = [0,1701; 0,2319]. w_mentah = (0,5; 0,5) − 0,5 × (0,1701; 0,2319) = (0,4149; 0,3841); jumlah 0,7990 → renormalisasi: w_baru = (0,5193; 0,4807). Variansi tahunan 0,1005 → 0,0994 — turun 0,0011, menutup ~23% jarak ke GMV 2-aset (0,6565; 0,3435; variansi 0,0957).

$$\nabla_w\, \mathrm{Var}(w) = 2\,\Sigma\, w, \qquad w \leftarrow w - \eta\, \nabla_w\, \mathrm{Var}(w)$$

**Gambar:** bobot sebelum vs sesudah satu langkah — BBCA 0,5 → 0,5193; KLBF 0,5 → 0,4807.

**Baik/buruk:** satu langkah GD bagus sebagai BUKTI KONSEP dengan data nyata. Buruk bila dibaca sebagai «portofolio optimal»: (0,5193; 0,4807) masih jauh dari GMV (0,6565; 0,3435).

**Jebakan — renormalisasi mentah:** satu langkah + renormalisasi valid sebagai demonstrasi SATU langkah. Tapi diulang mentah-mentah (200×, η = 0,5), iterasinya TIDAK menuju GMV — ia berhenti di w = (2,2950; −1,2950) dengan variansi 0,6256 [notebook], enam kali LEBIH BURUK dari titik awal. Yang benar: proyeksikan gradien ke bidang jumlah-bobot-tetap — projected GD mencapai GMV (0,6565; 0,3435) dalam 100 langkah (notebook langkah 3). Penanganan kendala yang benar adalah topik M5.2.

---

## 9. Stochastic GD & Mini-Batch

Batch GD menghitung gradien dari SELURUH data tiap langkah. SGD menghitung gradien dari SATU baris (atau satu mini-batch kecil) yang dipilih acak — tiap langkah jauh lebih murah, tapi gradiennya BERISIK dan jalurnya bergetar di sekitar minimum.

**Nilai [ilustrasi]:** f(x) = x² dari x = 3, η = 0,1, 30 langkah, gradien berisik 2x + ε, ε ~ N(0, 1), seed 7 — batch GD f = 0,000014 (mulus); SGD f = 0,0626, rata-rata 10 langkah terakhir 0,1432; mini-batch 4 baris f = 0,0018, rata-rata 10 terakhir 0,0030. Makin besar batch, makin kecil noise.

**Baik/buruk:** SGD bagus bila data besar dan butuh banyak update murah — dan noise-nya kadang MEMBANTU keluar dari minimum lokal dangkal atau saddle point. Buruk bila butuh presisi akhir: dengan η tetap, SGD bergetar selamanya di sekitar minimum.

**Mitigasi:** pakai mini-batch (32–256 baris) sebagai kompromi standar, dan jadwalkan η menurun (learning-rate decay).

---

## 10. Jebakan: Learning Rate, Skala Fitur, Saddle Point

1. **Learning rate.** Terlalu kecil: merangkak (η = 0,01 butuh 52 langkah untuk f < 2 vs 10 langkah untuk η = 0,05). Terlalu besar: divergen (η = 0,12 → f = 133.869,2748).
2. **Skala fitur.** Mangkuk x² + 10y² [ilustrasi]: arah y 10× lebih curam dari x, satu η tidak bisa cocok untuk keduanya. Di dunia nyata: harga saham ribuan rupiah vs return persen — standardisasi fitur SEBELUM optimasi, atau pakai Adam.
3. **Saddle point.** f(x, y) = x² − y² di (0, 0) [ilustrasi]: gradien (0, 0) tapi bukan minimum — ke arah x naik, ke arah y turun. Di dimensi tinggi, saddle point jauh lebih umum daripada minimum lokal; noise SGD kadang membantu keluar.

**Mitigasi (ringkas):** (1) plot f per langkah; (2) standardisasi fitur sebelum GD; (3) bila gradien nol tapi hasilnya buruk, curigai saddle point — coba start lain atau tambah noise.

---

## Lab 1: Gradient Descent pada Mangkuk Kuadratik

f(x, y) = x² + 10y², start (4, 4), 10 langkah. Lengkapi gradien (2x, 20y) dan update (x − η·gx, y − η·gy).

Hasil [lab]: η = 0,01 → f = 12,5264; η = 0,05 → f = 1,9452; η = 0,09 → f = 2,1469; η = 0,12 → f = 133.869,2748. Batas divergen: |1 − 20η| > 1, yaitu η > 0,1.

## Lab 2: Satu Langkah GD Min-Variance dari Data Pin

Σ tahunan (return SIMPLE 480 hari, data pin) [notebook]: [[0,118956; 0,051145], [0,051145; 0,180734]]. Start w = (0,5; 0,5), η = 0,5.

Hasil [lab]: gradien [0,1701; 0,2319]; w baru (0,5193; 0,4807); variansi 0,1005 → 0,0994.

## Guided Task di Colab

Notebook: colab/mlf-m51-guided-task.ipynb — GD mangkuk kuadratik 4 learning rate; satu langkah GD min-variance; projected GD 100 langkah vs GMV closed-form 2-aset; SGD vs batch vs mini-batch. Tautan Colab: https://colab.research.google.com/drive/1F-ZEKn45w69A7c88YhtmjQbVQA5Gf2ay

## Rangkuman

- Optimasi = fungsi tujuan + variabel keputusan (+ kendala, di M5.2). Gradien menunjuk ke arah naik tercuram; GD melangkah berlawanan: θ ← θ − η∇f(θ).
- Mangkuk f(x, y) = x² + 10y² dari (4, 4), f awal 176, 10 langkah [notebook]: η = 0,01 → 12,5264; η = 0,05 → 1,9452; η = 0,09 → 2,1469; η = 0,12 → 133.869,2748 (divergen).
- Berhenti bila ‖∇f‖ atau |Δf| di bawah ambang; convex = satu minimum global, non-convex = minimum lokal + saddle point (f = x² − y² di (0, 0) [ilustrasi]).
- Momentum meredam osilasi dan mempercepat arah konsisten; Adam memberi tiap parameter learning rate adaptif.
- Closed-form menang bila ada rumusnya (GMV 3-aset (0,5518; 0,2698; 0,1785)); GD menang bila tidak ada (risk parity (0,3980; 0,3212; 0,2808)); max-Sharpe tanpa kendala memberi bobot absurd (−3154,746; −3786,1043; 6941,8503).
- Satu langkah GD min-variance BBCA+KLBF (η = 0,5): gradien [0,1701; 0,2319], w (0,5; 0,5) → (0,5193; 0,4807), variansi 0,1005 → 0,0994 (~23% jarak ke GMV 2-aset (0,6565; 0,3435)).
- Renormalisasi mentah yang diulang TIDAK menuju GMV — berhenti di (2,2950; −1,2950), variansi 0,6256; projected GD mencapai GMV dalam 100 langkah.
- SGD: gradien berisik dari mini-batch — murah, bergetar, kadang membantu keluar dari saddle point; η harus diturunkan agar mendarat (batch f = 0,000014 vs SGD 0,0626 vs mini-batch(4) 0,0018 [ilustrasi]).
- Lab: GD kuadratik — η 0,01/0,05/0,09/0,12 → f 12,5264 / 1,9452 / 2,1469 / 133869,2748; GD min-variance — gradien [0,1701; 0,2319], w (0,5193; 0,4807), variansi 0,1005 → 0,0994.

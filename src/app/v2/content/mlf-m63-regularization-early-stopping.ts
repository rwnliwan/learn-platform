import type { V2Lesson } from "../lib/types";

export const mlfM63: V2Lesson = {
  slug: "mlf-m63-regularization-early-stopping",
  track: "Machine Learning Finance",
  module: "Tuning & model selection",
  title: "MLF-M6.3 — Regularisasi & Early Stopping: Mengendalikan Kapasitas Model",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Model yang terlalu kuat menghafal — bukan memahami",
      prose: [
        "Di M6.1 kamu menala hyperparameter dan di M6.2 kamu belajar menilai dengan jujur lewat cross-validation. Lesson ini menjawab pertanyaan berikutnya: apa yang dilakukan bila modelmu TERLALU KUAT — ia menghafal data latih, tapi gagal di data baru? Jawabannya adalah mengendalikan KAPASITAS model: regularisasi (memberi penalti pada kompleksitas) dan early stopping (berhenti melatih sebelum model mulai menghafal).",
        "Data yang sama seperti modul-modul M6 sebelumnya: UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, 31 fitur (23 asli + 8 hasil feature engineering) [notebook, rincian fitur], split 80/20 — train 24.000, test 6.000 [notebook]. Dua model flagship dari M1: logistic regression (LR) test ROC-AUC 0,7426 / PR-AUC 0,5049, dan gradient boosting (GBM) test ROC-AUC 0,7823 / PR-AUC 0,5597.",
        "Gejala yang harus kamu kenali dulu: GBM mencapai train ROC-AUC 0,8469 tapi test hanya 0,7823 — selisih (gap) 0,0646 [notebook]. LR jauh lebih kalem: train 0,7610 vs test 0,7426, gap 0,0184. GBM yang fleksibel menghafal lebih banyak; LR yang kaku menghafal lebih sedikit. Lesson ini mengukur seberapa jauh «rem» regularisasi dan early stopping bisa menutup gap itu — dan, sama pentingnya, di mana rem itu TIDAK membantu.",
        "Peta lesson: kapasitas & overfitting (langkah 2) → L2, penalti kuadratik (langkah 3) → L1, seleksi fitur (langkah 4) → L1 vs L2, kapan mana (langkah 5) → membaca validation curve (langkah 6) → early stopping (langkah 7) → worked example GBM 400 pohon, dua kurva (langkah 8) → jebakan (langkah 9) → peta keputusan (langkah 10) → 2 lab → checkpoint.",
        "Nilai: regularisasi dan early stopping adalah dua rem yang sama-sama mengendalikan kapasitas — satu lewat penalti pada koefisien, satu lewat menghentikan pelatihan. Keduanya murah, keduanya bisa diukur langsung dari angka, dan keduanya punya batas yang akan kamu lihat sendiri di data ini.",
        "Baik atau buruk: rem itu bagus bila gap train-test besar dan modelmu fleksibel (GBM). Buruk bila dipakai buta-buta pada model yang sudah kaku: LR di data ini hampir tidak bergerak (langkah 3 dan 9) — rem yang terlalu kuat justru membuat model underfit.",
        "Mitigasi: jangan menebak apakah modelmu overfit — UKUR gap train-test dulu (langkah 2). Baru putuskan rem mana yang dipakai, dan ukur lagi sesudahnya. Lesson ini seluruhnya adalah latihan membaca angka itu.",
      ],
      tasks: [],
    },
    {
      id: "kapasitas",
      eyebrow: "Langkah 2 · Kapasitas & overfitting",
      title: "Kapasitas model dan gap train-test sebagai diagnosis",
      prose: [
        "Kapasitas adalah seberapa rumit pola yang BISA dipelajari model. LR dengan 31 koefisien punya kapasitas terbatas: ia hanya bisa menggambar satu batas keputusan lurus (di ruang fitur yang distandardisasi). GBM dengan ratusan pohon punya kapasitas jauh lebih besar: ia bisa menggambar batas yang berlekuk-lekuk mengikuti tiap gerombol data latih — termasuk gerombol yang sebenarnya hanya noise.",
        "Nilai: diagnosisnya adalah gap train-test. GBM: train 0,8469 − test 0,7823 = 0,0646 [notebook]. LR: train 0,7610 − test 0,7426 = 0,0184. Gap GBM kira-kira 3,5 kali gap LR — dan itulah harga kapasitas: makin besar kapasitas, makin besar selisih antara «yang dihafal» dan «yang dipahami». Catatan: gap 0,0646 ini BUKAN vonis «model rusak» — GBM tetap menang jauh atas LR di test (0,7823 vs 0,7426). Gap adalah ukuran seberapa banyak performa yang «dipinjam» dari data latih.",
        "Baik atau buruk: gap besar bagus sebagai SINYAL — ia memberitahumu ada ruang perbaikan lewat pengendalian kapasitas, sebelum kamu menyalahkan data atau mengganti model. Buruk bila dibaca sebagai «semakin kecil gap semakin baik»: model yang train dan test-nya sama-sama RENDAH (misal train 0,60, test 0,59) punya gap kecil tapi underfit — ia tidak belajar apa-apa. Yang dicari adalah test TINGGI dengan gap yang WAJAR, bukan gap nol.",
        "Mitigasi: pakai ambang praktis untuk data ini — gap di bawah 0,02 (seperti LR, 0,0184) tergolong kecil: model kalem, rem tambahan kemungkinan tidak banyak membantu. Gap 0,02–0,05 tergolong sedang: coba rem ringan. Gap di atas 0,05 (seperti GBM, 0,0646) tergolong besar: pengendalian kapasitas layak dicoba — dan di langkah 8 kamu akan melihat seberapa besar gap itu bisa membengkak bila rem dilepas (0,2128). Ambang ini aturan praktis lesson ini, bukan hukum universal: pada data lain, angka «wajar» bisa berbeda.",
      ],
      formula: String.raw`\mathrm{gap} = \mathrm{AUC}_{\mathrm{train}} - \mathrm{AUC}_{\mathrm{test}}`,
      formulaNote: "Gap train-test: selisih ROC-AUC train dan test. GBM 0,8469 − 0,7823 = 0,0646; LR 0,7610 − 0,7426 = 0,0184 [notebook]. Gap besar = model menghafal lebih banyak daripada yang ia generalisasi.",
      tasks: [],
      note: {
        title: "Miskonsepsi: gap nol berarti model sempurna",
        type: "pitfall",
        body: "Yang benar: gap nol hanya berarti train dan test SAMA — keduanya bisa sama-sama rendah. Model yang menebak base rate (selalu memprediksi tidak default) punya ROC-AUC 0,5 dan PR-AUC ≈ 0,2212 (tanpa daya pisah), meski akurasinya ±0,78. Yang dicari adalah test tinggi DENGAN gap yang wajar, bukan gap nol.",
      },
    },
    {
      id: "l2",
      eyebrow: "Langkah 3 · Regularisasi L2",
      title: "L2: penalti kuadratik yang mengecilkan koefisien — tanpa mematikan satu pun",
      prose: [
        "Regularisasi L2 menambahkan penalti pada fungsi loss: tiap koefisien yang besar «membayar denda» sebanding kuadratnya. Model yang meminimalkan loss + denda ini terpaksa menjaga koefisien tetap KECIL — ia masih boleh memakai semua 31 fitur, tapi tidak boleh bersandar berlebihan pada satu fitur saja. Di logistic regression, kekuatan regularisasi diatur lewat C — dan ini sumber kebingungan pertama: C adalah KEBALIKAN kekuatan penalti. C kecil = penalti KUAT; C besar = penalti LEMAH. Di sklearn, C = 1/λ (hingga faktor ½ pada suku L2).",
        "Nilai: jalur C pada LR [notebook] — C = 0,01 (penalti terkuat): test ROC-AUC 0,7411, norma L2 koefisien 0,8866, train 0,7597. C = 0,1: test 0,7424, norma 0,9594. C = 1: test 0,7426, norma 0,9684. C = 10: test 0,7426, norma 0,9694. C = 100 (penalti terlemah): test 0,7426, norma 0,9695. Baca dua hal: pertama, norma koefisien MENYUSUT saat penalti menguat (0,9695 → 0,8866) — remnya bekerja, koefisien memang mengecil. Kedua, skor test hanya bergerak 0,7411 → 0,7426 — naik 0,0015 dari penalti terkuat ke terlemah, lalu DATAR.",
        "Gambar di bawah memplot test ROC-AUC vs C. Perhatikan bentuknya: naik sedikit dari C = 0,01 ke C = 1, lalu datar total. Itulah wajah «regularisasi hampir tidak berpengaruh pada skor» di data ini — dan itu temuan yang jujur, bukan kegagalan (langkah 9).",
        "Baik atau buruk: L2 bagus karena STABIL — ia mengecilkan semua koefisien secara halus tanpa pernah mematikannya; model tetap memakai semua fitur, hanya lebih kalem. Buruk bila yang kamu butuhkan adalah MEMILIH fitur: L2 tidak pernah men-zero-kan satu koefisien pun — pada C = 0,1 maupun C = 1, jumlah koefisien nol L2 adalah 0 dari 31 (langkah 4). Buruk juga bila penalti terlalu kuat: C = 0,01 memberi test TERENDAH di jalur ini (0,7411) — rem yang terlalu keras membuat model underfit.",
        "Mitigasi: jangan menala C dengan firasat — jalankan jalurnya (C = 0,01; 0,1; 1; 10; 100) dan baca test ROC-AUC-nya. Bila skor datar seperti di sini, pilih C di tengah (C = 1) — cukup longgar untuk belajar, cukup ketat untuk menahan koefisien liar. Dan ingat arahnya: C BESAR = regularisasi KECIL.",
      ],
      formula: String.raw`\min_w \left[ -\sum_i \log p(y_i \mid x_i;\, w) + \lambda\, \|w\|_2^2 \right], \qquad C = \frac{1}{\lambda}`,
      formulaNote: "Tujuan LR dengan penalti L2: negative log-likelihood + λ kali jumlah kuadrat koefisien. C = 1/λ: C kecil = penalti kuat (koefisien mengecil), C besar = penalti lemah. Norma L2 koefisien: 0,8866 (C = 0,01) → 0,9695 (C = 100) [notebook].",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Test ROC-AUC LR vs C: C 0,01 ke 0,7411; C 0,1 ke 0,7424; C 1, 10, 100 datar di 0,7426">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">LR: test ROC-AUC vs C — naik sedikit, lalu datar</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,740</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,741</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,742</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,743</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C (0,01 – 0,1 – 1 – 10 – 100; skala log)</text>
<polyline points="52.0,150.7 155.5,85.3 259.0,75.3 362.5,75.3 466.0,75.3" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="52.0" cy="150.7" r="3.5" fill="var(--c1)"/>
<circle cx="155.5" cy="85.3" r="3.5" fill="var(--c1)"/>
<circle cx="259.0" cy="75.3" r="3.5" fill="var(--c1)"/>
<circle cx="362.5" cy="75.3" r="3.5" fill="var(--c1)"/>
<circle cx="466.0" cy="75.3" r="3.5" fill="var(--c1)"/>
<text x="52.0" y="140.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7411</text>
<text x="155.5" y="75.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7424</text>
<text x="259.0" y="65.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7426</text>
<text x="466.0" y="65.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7426</text>
</svg>`,
        alt: "Test ROC-AUC LR vs C: 0,7411 pada C 0,01; 0,7424 pada C 0,1; lalu datar 0,7426 pada C 1, 10, dan 100.",
        caption: "Cara membaca: sumbu-x = C (skala log, 0,01–100; C besar = penalti lemah), sumbu-y = test ROC-AUC [notebook]. Interpretasi: skor naik 0,0015 dari C = 0,01 ke C = 1, lalu DATAR — regularisasi hampir tidak mengubah skor di data ini, meski norma L2 koefisien bergerak 0,8866 → 0,9695.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: C besar berarti regularisasi besar",
        type: "pitfall",
        body: "Yang benar: C adalah KEBALIKAN kekuatan penalti (C = 1/λ). C = 0,01 memberi penalti TERKUAT — norma koefisien paling kecil (0,8866) dan test paling rendah (0,7411). C = 100 memberi penalti TERLEMAH — norma paling besar (0,9695). Bila kamu menaikkan C karena ingin «lebih teratur», kamu justru melonggarkan remnya.",
      },
    },
    {
      id: "l1",
      eyebrow: "Langkah 4 · Regularisasi L1",
      title: "L1: penalti nilai absolut yang mematikan koefisien — seleksi fitur bawaan",
      prose: [
        "L1 mengganti kuadrat dengan nilai absolut: dendanya sebanding |w|, bukan w². Perbedaan itu terlihat kecil di rumus, tapi besar di akibat: penalti L1 mendorong koefisien kecil sampai PERSIS NOL, bukan hanya kecil. Model L1 secara otomatis MEMILIH fitur — fitur yang koefisiennya nol praktis dikeluarkan dari model. Inilah satu-satunya perbedaan yang penting antara L1 dan L2 di lesson ini: L2 mengecilkan, L1 mematikan.",
        "Nilai: pada C = 0,1 [notebook] — L1 men-zero-kan 7 dari 31 koefisien (test ROC-AUC 0,7418; norma L2 koefisien 0,9208; norma L1 koefisien 2,7928), sementara L2 men-zero-kan 0 (test 0,7424; norma L2 0,9594; norma L1 3,3421). Pada C = 1 (penalti lebih lemah) — L1 hanya men-zero-kan 1 koefisien (test 0,7425; norma L1 3,3090), L2 tetap 0 (test 0,7426; norma L1 3,3997). Polanya konsisten: makin kuat penalti (C kecil), makin banyak koefisien yang dimatikan L1 — 7 pada C = 0,1, hanya 1 pada C = 1.",
        "Perhatikan harga yang dibayar: L1 pada C = 0,1 kehilangan 0,0006 test ROC-AUC dibanding L2 (0,7418 vs 0,7424) — dengan imbalan model yang memakai 24 fitur, bukan 31. Pada C = 1, harganya menyusut jadi 0,0001 (0,7425 vs 0,7426) dengan 1 fitur dimatikan. Seleksi fitur di sini hampir gratis — tapi «hampir» itu penting: L1 tidak pernah MEMBERI skor lebih tinggi dari L2 di data ini, ia hanya menukar sedikit skor dengan kesederhanaan.",
        "Baik atau buruk: L1 bagus bila kamu butuh model yang RINGKAS dan bisa dijelaskan — 7 fitur lebih sedikit berarti 7 kolom yang tidak perlu dihitung, divalidasi, dan dimonitor di produksi; dan bagi regulator, model dengan 24 fitur lebih mudah diaudit daripada 31. Buruk bila fitur-fitur saling berkorelasi: L1 cenderung memilih SATU dari sekelompok fitur berkorelasi dan mematikan sisanya secara arbitrer — fitur yang dimatikan belum tentu «tidak penting», ia hanya kalah bersaing dengan kembarannya.",
        "Mitigasi: jangan membaca «koefisien nol» sebagai «fitur tidak berguna». Bila dua fitur berkorelasi kuat, L1 mematikan salah satunya — dan pilihan mana yang dimatikan bisa berubah bila datanya sedikit berubah. Bila stabilitas seleksi itu penting, pakai L2 (tidak mematikan apa pun) atau gabungan keduanya — elastic net, yakni campuran L1 dan L2 lewat l1_ratio di antara 0 dan 1 (langkah 5).",
      ],
      formula: String.raw`\min_w \left[ -\sum_i \log p(y_i \mid x_i;\, w) + \lambda\, \|w\|_1 \right]`,
      formulaNote: "Tujuan LR dengan penalti L1: negative log-likelihood + λ kali jumlah nilai absolut koefisien. Penalti |w| mendorong koefisien kecil ke persis nol (soft-thresholding, lab 1). L1 pada C = 0,1: 7 koefisien nol; pada C = 1: 1 koefisien nol [notebook].",
      tasks: [],
      note: {
        title: "Miskonsepsi: L1 mematikan fitur yang tidak penting saja",
        type: "pitfall",
        body: "Yang benar: L1 mematikan koefisien yang PALING MURAH dimatikan menurut loss + penalti — bukan yang paling tidak penting secara bisnis. Bila dua fitur berkorelasi kuat (misal dua ukuran tunggakan yang mirip), L1 mematikan salah satunya secara arbitrer. Fitur yang nol itu bisa jadi sama bergunanya dengan yang bertahan — ia hanya kalah dalam undian korelasi.",
      },
    },
    {
      id: "l1-vs-l2",
      eyebrow: "Langkah 5 · L1 vs L2",
      title: "L1 vs L2: kapan mana — pilih dari tujuan, bukan dari teori",
      prose: [
        "Setelah melihat angkanya, keputusan L1 vs L2 menjadi konkret. Di data ini keduanya memberi test ROC-AUC yang praktis sama: pada C = 0,1, L2 0,7424 vs L1 0,7418 (selisih 0,0006); pada C = 1, L2 0,7426 vs L1 0,7425 (selisih 0,0001). Bila skor yang jadi satu-satunya kriteria, keduanya seri — dan pilihannya harus datang dari TUJUAN lain.",
        "Nilai: pilih L1 bila kamu butuh SELEKSI FITUR — model ringkas, lebih sedikit kolom di produksi, lebih mudah dijelaskan ke regulator atau auditor. Buktinya: L1 C = 0,1 mengeluarkan 7 fitur dengan harga 0,0006 AUC. Pilih L2 bila kamu butuh STABILITAS — semua fitur dipertahankan, koefisien menyusut halus, dan tidak ada fitur yang hilang mendadak bila data bergeser sedikit. Pilih campuran (elastic net, l1_ratio di antara 0 dan 1) bila kamu butuh keduanya: sebagian seleksi, sebagian stabilitas — L1 untuk memangkas, L2 untuk menahan korelasi berkelompok.",
        "Satu catatan teknis yang wajib dicatat: di sklearn 1.9, cara memilih L1/L2 adalah lewat l1_ratio — 0 berarti L2 murni, 1 berarti L1 murni, di antaranya berarti campuran (elastic net). Parameter penalty yang lama sudah deprecated — jangan menulisnya sebagai cara yang berlaku. Di lesson ini kamu cukup mengingat L1/L2 sebagai dua JENIS penalti; API-nya adalah detail implementasi yang sudah ditangani notebook.",
        "Baik atau buruk: membandingkan keduanya pada validasi bagus — kamu memilih dari BUKTI (skor + jumlah fitur + stabilitas), bukan dari slogan «L1 untuk seleksi, L2 untuk stabilitas» yang dihafal tanpa angka. Buruk bila pilihan didasarkan pada skor test saja: selisih 0,0001–0,0006 di sini lebih kecil dari noise antar-fold (standar deviasi CV LR sekitar 0,0083 di M6.1) — memilih «pemenang» dari selisih sekecil itu sama dengan memilih dari undian.",
        "Mitigasi: tetapkan dulu apa yang kamu butuhkan — ringkas, stabil, atau keduanya — lalu bandingkan L1 vs L2 pada VALIDASI (bukan test) dengan kriteria itu. Bila keduanya seri di semua kriteria, pilih L2: ia yang paling tidak mengejutkan.",
      ],
      tasks: [],
    },
    {
      id: "validation-curve",
      eyebrow: "Langkah 6 · Validation curve",
      title: "Membaca validation curve: naik, datar, lalu turun",
      prose: [
        "Validation curve adalah plot skor train dan test terhadap satu hyperparameter — di sini jumlah pohon GBM (max_iter). Cara membacanya punya tiga babak: babak pertama, test NAIK bersama train — model belajar pola yang benar. Babak kedua, test DATAR sementara train terus naik — model masih belajar, tapi yang dipelajari tidak lagi membantu di data baru. Babak ketiga, test TURUN sementara train terus naik — model mulai menghafal noise, dan tiap pohon tambahan MERUSAK generalisasi.",
        "Nilai: kurva GBM TANPA early stopping [notebook] memainkan ketiga babak itu dengan bersih — test 0,7763 (10 pohon) → 0,7788 (25) → 0,7797 (50, puncak) → 0,7763 (100) → 0,7721 (200) → 0,7638 (400). Train di saat yang sama: 0,8058 → 0,8269 → 0,8532 → 0,8907 → 0,9347 → 0,9766 — naik terus tanpa henti. Di 400 pohon, gap train-test membengkak jadi 0,2128 (0,9766 − 0,7638). Puncaknya di 50 pohon: itulah titik di mana model berhenti belajar pola dan mulai menghafal.",
        "Baik atau buruk: validation curve bagus karena ia menunjukkan DI MANA letak puncaknya — bukan sekadar «model overfit», tapi «overfit MULAI di 50 pohon». Buruk bila dibaca dari SATU titik saja: test 0,7797 pada 50 pohon vs 0,7763 pada 100 pohon — selisih 0,0034 — terlihat kecil, tapi trennya (turun terus sampai 0,7638) yang memberi vonis, bukan satu selisihnya. Buruk juga bila kurva dibaca dari test set yang sama dipakai memilih: titik optimal yang kamu pilih dari test sedikit optimistis — yang benar, pilih dari VALIDASI terpisah, dan test hanya untuk laporan akhir (M6.2).",
        "Mitigasi: selalu plot KEDUA garis (train dan test). Bila hanya test yang diplot, kamu tidak tahu apakah test yang datar itu karena model sudah cukup — atau karena train juga sudah mentok. Dan tetapkan titik berhentinya dari validasi, bukan dari test.",
      ],
      tasks: [],
    },
    {
      id: "early-stopping",
      eyebrow: "Langkah 7 · Early stopping",
      title: "Early stopping: berhenti melatih saat validasi berhenti membaik",
      prose: [
        "Early stopping adalah regularisasi IMPLISIT: alih-alih menambah penalti ke loss, kamu menghentikan pelatihan di titik yang tepat. Caranya: sisihkan sebagian data latih sebagai VALIDASI internal; di tiap iterasi, ukur skor validasi; bila skor validasi tidak membaik selama beberapa iterasi berturut-turut (patience), berhenti — dan kembalikan model dari iterasi TERBAIK, bukan yang terakhir. Jumlah iterasi efektif menjadi hyperparameter yang ditentukan DATA, bukan ditebak di muka.",
        "Nilai: inilah angka yang paling sering disalahbaca di lesson ini, jadi baca pelan-pelan. Kurva GBM dengan setting DEFAULT [notebook] — test 0,7752 (10 pohon) → 0,7797 (25) → 0,7823 (50) → 0,7823 (100) → 0,7823 (200) → 0,7823 (400) — DATAR TOTAL dari 50 sampai 400. Train-nya juga datar di 0,8469 dari 50 ke atas. Pemburukan dari puncak ke 400 pohon: 0,0000. Ini BUKAN bukti bahwa «400 pohon tidak overfit». Ini adalah efek early stopping: HistGradientBoostingClassifier dengan early_stopping='auto' AKTIF secara default bila train lebih dari 10.000 baris — dan train di sini 24.000 baris — sehingga model BERHENTI SENDIRI sekitar 50 iterasi, berapa pun max_iter yang kamu minta. Yang kamu lihat di kurva datar itu adalah remnya yang bekerja, bukan kekebalan GBM.",
        "Gambar di bawah adalah kurva default itu. Bandingkan dengan gambar di langkah 8 — kurva yang SAMA, dengan rem yang DILEPAS. Dua gambar itu adalah pasangan yang wajib dibaca berdampingan: yang satu menunjukkan apa yang dilakukan early stopping, yang lain menunjukkan apa yang terjadi tanpanya.",
        "Baik atau buruk: early stopping bagus karena GRATIS dan OTOMATIS — kamu tidak perlu menala max_iter; model berhenti sendiri di sekitar 50 dan kamu mendapat test 0,7823, skor GBM terbaik di data ini. Buruk bila kamu tidak sadar ia AKTIF: kamu bisa menyimpulkan «tambah pohon tidak ada efeknya» atau «GBM tidak overfit», lalu mematikan early stopping di produksi dan kaget melihat skor jatuh (langkah 8). Buruk juga bila validation internal-nya kecil atau tidak representatif — titik berhentinya jadi berisik.",
        "Mitigasi: selalu periksa APAKAH early stopping aktif sebelum menafsirkan kurva validasi. Di sklearn, HistGradientBoostingClassifier memakai early_stopping='auto' (aktif bila n_train > 10.000); bila kamu ingin melihat perilaku murni model, matikan eksplisit dengan early_stopping=False — seperti yang dilakukan kurva langkah 8. Dan catat n_iter_ model setelah fit: itulah jumlah pohon yang BENAR-BENAR dipakai, bukan max_iter yang kamu minta.",
      ],
      formula: String.raw`t^* = \arg\min_t\, \mathcal{L}_{\mathrm{val}}(t)`,
      formulaNote: "Titik early stopping: iterasi t* yang meminimalkan loss validasi. Model yang dikembalikan adalah model di t*, bukan di iterasi terakhir. Pada GBM default di data ini, t* ≈ 50 — test 0,7823 di 50 maupun di 400 [notebook].",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="GBM early stopping ON: test ROC-AUC 0,7752 pada 10 pohon, 0,7797 pada 25, lalu datar 0,7823 dari 50 sampai 400">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GBM, early stopping ON (default): test ROC-AUC vs max_iter</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,770</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,775</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,780</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,785</text>
<polyline points="52.0,145.0 134.8,92.2 217.6,61.7 300.4,61.7 383.2,61.7 466.0,61.7" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="52.0" cy="145.0" r="3.5" fill="var(--c1)"/>
<circle cx="134.8" cy="92.2" r="3.5" fill="var(--c1)"/>
<circle cx="217.6" cy="61.7" r="3.5" fill="var(--c1)"/>
<circle cx="300.4" cy="61.7" r="3.5" fill="var(--c1)"/>
<circle cx="383.2" cy="61.7" r="3.5" fill="var(--c1)"/>
<circle cx="466.0" cy="61.7" r="3.5" fill="var(--c1)"/>
<text x="52.0" y="135.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7752</text>
<text x="134.8" y="82.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7797</text>
<text x="340.0" y="52.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">datar 0,7823 (50–400)</text>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<text x="134.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">25</text>
<text x="217.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50</text>
<text x="300.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100</text>
<text x="383.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">200</text>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">400</text>
</svg>`,
        alt: "GBM dengan early stopping aktif: test ROC-AUC 0,7752 pada 10 pohon, 0,7797 pada 25, lalu datar 0,7823 dari 50 sampai 400 pohon.",
        caption: "Cara membaca: sumbu-x = max_iter yang diminta (skala log), sumbu-y = test ROC-AUC [notebook]. Interpretasi: kurva DATAR dari 50 ke 400 BUKAN karena 400 pohon aman — melainkan karena early_stopping='auto' AKTIF (train 24.000 > 10.000) dan model berhenti sendiri sekitar 50 iterasi. Train ikut datar di 0,8469. Bukti overfitting yang sebenarnya ada di gambar langkah 8.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: kurva datar berarti 400 pohon tidak overfit",
        type: "pitfall",
        body: "Yang benar: kurva datar di sini adalah EFEK early stopping, bukan kekebalan GBM. Dengan early_stopping='auto' aktif (default, train 24.000 baris), model berhenti sendiri sekitar 50 iterasi — max_iter 100, 200, atau 400 tidak pernah benar-benar melatih sebanyak itu. Matikan early stopping (langkah 8) dan test-nya JATUH dari 0,7797 ke 0,7638 pada 400 pohon. Jangan pernah menafsirkan kurva validasi sebelum memeriksa apakah early stopping aktif.",
      },
    },
    {
      id: "worked-example",
      eyebrow: "Langkah 8 · Worked example",
      title: "GBM 400 pohon: dua kurva, dua cerita — dengan dan tanpa early stopping",
      prose: [
        "Sekarang letakkan kedua kurva berdampingan. Kurva PERTAMA (langkah 7, default): test 0,7752 → 0,7797 → 0,7823, lalu DATAR sampai 400; train datar di 0,8469; gap di 400 pohon hanya 0,0646. Kurva KEDUA (di bawah, early_stopping=False): test 0,7763 → 0,7788 → 0,7797 (puncak, 50 pohon) → 0,7763 (100) → 0,7721 (200) → 0,7638 (400); train 0,8058 → 0,8269 → 0,8532 → 0,8907 → 0,9347 → 0,9766; gap di 400 pohon membengkak jadi 0,2128 [notebook].",
        "Bandingkan angka-angka kuncinya. Puncak test tanpa early stopping (0,7797 di 50 pohon) LEBIH RENDAH dari skor default dengan early stopping (0,7823) — selisih 0,0026. Selisih 0,0026 ini tidak kami klaim sebagai keunggulan mekanisme early stopping: kedua kurva berasal dari fit terpisah dan selisihnya di bawah SD antar-fold 0,0059. Pemilihan puncak dari TEST membuat angka tanpa-ES cenderung OPTIMISTIS, jadi kerugian sebenarnya di 400 pohon bisa lebih besar dari 0,0159. Pemburukan dari puncak ke 400 pohon: 0,0000 dengan early stopping, 0,0159 tanpanya (0,7797 − 0,7638). Dan gap train-test di 400 pohon: 0,0646 vs 0,2128 — tanpa rem, model hampir menghafal seluruh train (0,9766) sambil kehilangan 0,0159 di test.",
        "Nilai: inilah BUKTI overfitting yang sebenarnya — bukan kurva datar langkah 7, melainkan kurva yang JATUH ini. Train yang naik ke 0,9766 sementara test jatuh ke 0,7638 adalah tanda tangan overfitting yang tidak bisa disalahbaca: tiap pohon tambahan setelah 50 membuat model lebih hafal dan lebih buruk di data baru. Early stopping mencegah persis kerusakan ini — ia memotong pelatihan di 50 dan menyelamatkan 0,0159 AUC plus 350 pohon komputasi yang sia-sia.",
        "Baik atau buruk: membandingkan dua kurva ini bagus — ia mengubah early stopping dari «pengaturan default yang misterius» menjadi «rem yang terukur menyelamatkan 0,0159». Buruk bila kamu hanya melihat satu kurva: kurva default saja membuatmu meremehkan overfitting; kurva tanpa early stopping saja membuatmu mengira GBM «selalu» memburuk setelah 50 pohon — padahal dengan rem yang benar, ia berhenti di 0,7823 dan tidak memburuk sama sekali.",
        "Mitigasi: bila kamu menala max_iter secara manual (misal di grid search M6.1), JANGAN mematikan early stopping tanpa sadar — grid M6.1 memakai default (aktif) [inferensi], sehingga max_iter 100 dan 200 di sana kemungkinan juga berhenti sendiri di sekitar titik optimalnya — pasangan identik 0,7862/0,7862 dan 0,7851/0,7851 konsisten dengan ini tapi bukan bukti, dan pasangan (100,5,0.05)=0,7865 vs (200,5,0.05)=0,7864 tidak persis sama. Bila kamu mematikan early stopping, kamu WAJIB menala max_iter sebagai gantinya — dan titiknya di data ini adalah 50.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="GBM tanpa early stopping: test ROC-AUC puncak 0,7797 pada 50 pohon lalu turun ke 0,7638 pada 400 pohon">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GBM, early stopping OFF: test ROC-AUC vs max_iter</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,760</text>
<line x1="48" y1="166.0" x2="52" y2="166.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="169.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,765</text>
<line x1="48" y1="126.0" x2="52" y2="126.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="129.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,770</text>
<line x1="48" y1="86.0" x2="52" y2="86.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="89.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,775</text>
<line x1="48" y1="46.0" x2="52" y2="46.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="49.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,780</text>
<polyline points="52.0,75.6 134.8,55.6 217.6,48.4 300.4,75.6 383.2,109.2 466.0,175.6" fill="none" stroke="var(--c2)" stroke-width="2"/>
<circle cx="52.0" cy="75.6" r="3.5" fill="var(--c2)"/>
<circle cx="134.8" cy="55.6" r="3.5" fill="var(--c2)"/>
<circle cx="217.6" cy="48.4" r="3.5" fill="var(--c2)"/>
<circle cx="300.4" cy="75.6" r="3.5" fill="var(--c2)"/>
<circle cx="383.2" cy="109.2" r="3.5" fill="var(--c2)"/>
<circle cx="466.0" cy="175.6" r="3.5" fill="var(--c2)"/>
<text x="217.6" y="38.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">puncak 0,7797 (50)</text>
<text x="466.0" y="193.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,7638 (400)</text>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<text x="134.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">25</text>
<text x="217.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50</text>
<text x="300.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100</text>
<text x="383.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">200</text>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">400</text>
</svg>`,
        alt: "GBM tanpa early stopping: test ROC-AUC puncak 0,7797 pada 50 pohon, lalu turun ke 0,7763 (100), 0,7721 (200), dan 0,7638 (400).",
        caption: "Cara membaca: sumbu-x = max_iter (skala log), sumbu-y = test ROC-AUC [notebook]. Interpretasi: tanpa rem, test TURUN 0,7797 → 0,7638 dari 50 ke 400 pohon (memburuk 0,0159), sementara train naik 0,8532 → 0,9766 — gap di 400 pohon 0,2128. Bandingkan dengan gambar langkah 7 (datar 0,7823): selisih kedua gambar inilah nilai early stopping.",
      },
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 9 · Jebakan",
      title: "Tiga jebakan: regularisasi bukan obat segala overfit",
      prose: [
        "Jebakan pertama — mengira regularisasi selalu menaikkan skor. Di data ini, jalur C LR hanya bergerak 0,7411 → 0,7426 (naik 0,0015), dan L1 vs L2 berbeda 0,0001–0,0006. Regularisasi di sini BUKAN penyelamat besar: modelnya sudah cukup kalem, datanya sudah cukup banyak (24.000 train), dan sinyalnya memang terbatas — tidak ada penalti yang bisa menciptakan sinyal yang tidak ada. Nilai regularisasi di sini ada di SELEKSI FITUR (L1 mematikan 7 koefisien) dan STABILITAS (koefisien lebih kecil, kurang liar), bukan di lonjakan AUC. Bila seseorang menjanjikan «regularisasi menaikkan AUC 5 poin», mintalah buktinya di data yang sama — di data ini, janjinya tidak terbukti.",
        "Jebakan kedua — rem terlalu keras. C = 0,01 memberi test TERENDAH di jalur LR (0,7411): penalti yang terlalu kuat menekan koefisien sampai model kehilangan sinyal yang sebenarnya berguna. Tanda rem terlalu keras: train DAN test sama-sama turun saat penalti dikuatkan (train 0,7597 pada C = 0,01 vs 0,7610 pada C = 1). Bila train turun, kamu bukan lagi mencegah overfit — kamu mencegah BELAJAR.",
        "Jebakan ketiga — early stopping yang tidak disadari. Bila kamu tidak tahu early stopping aktif, kamu bisa salah membaca DUA arah: mengira «GBM tidak overfit sampai 400 pohon» (padahal remnya yang bekerja), atau — bila kamu mematikannya tanpa sadar, misal dengan menyalin kode yang memakai early_stopping=False — mengira «GBM tiba-tiba rusak» saat test jatuh ke 0,7638. Keduanya berasal dari satu akar: tidak memeriksa pengaturan default sebelum menafsirkan angka.",
        "Baik atau buruk: mengenali ketiga jebakan ini bagus — sebagian besar «regularisasi tidak bekerja» di praktik adalah salah satunya, bukan regularisasinya yang rusak. Buruk bila kamu menaikkan penalti terus-menerus saat skor tidak naik: yang kamu butuhkan mungkin bukan rem yang lebih keras, melainkan fitur yang lebih baik atau data yang lebih banyak (langkah 10).",
        "Mitigasi (ringkas): (1) ukur dulu seberapa besar pergerakan skor dari regularisasi — bila di bawah 0,002 seperti di sini, akui itu dan cari nilai di tempat lain (seleksi fitur, stabilitas); (2) bila train ikut turun saat penalti dikuatkan, longgarkan remnya; (3) sebelum menafsirkan kurva validasi apa pun, periksa apakah early stopping aktif.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: regularisasi selalu menaikkan skor test",
        type: "pitfall",
        body: "Yang benar: di data ini, seluruh jalur C LR hanya menggerakkan test ROC-AUC 0,7411 → 0,7426 (naik 0,0015), dan L1 vs L2 berbeda paling banyak 0,0006. Regularisasi adalah PENGENDALI kapasitas, bukan penambah sinyal. Bila model sudah kalem dan data sudah cukup, rem tambahan hampir tidak mengubah skor — nilainya ada di seleksi fitur dan stabilitas, bukan di AUC.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: kapan regularisasi, kapan early stopping, kapan yang lain",
      prose: [
        "Setelah semua angka di atas, keputusan menjadi alur yang bisa diikuti. LANGKAH PERTAMA: ukur gap train-test. Gap kecil (di bawah 0,02, seperti LR 0,0184) — model sudah kalem; jangan buru-buru menambah rem, periksa dulu apakah skor test-nya sendiri sudah cukup untuk kebutuhan bisnis. Gap sedang (0,02–0,05) — coba rem ringan: L2 dengan C di tengah, atau biarkan early stopping bekerja. Gap besar (di atas 0,05, seperti GBM 0,0646) — pengendalian kapasitas layak dicoba, dan ukur lagi sesudahnya.",
        "LANGKAH KEDUA: pilih remnya dari JENIS model. Model linear (LR) → regularisasi L1/L2 lewat C dan l1_ratio: L1 bila butuh seleksi fitur, L2 bila butuh stabilitas. Model iteratif (GBM, neural network) → early stopping dulu: ia gratis, otomatis, dan di data ini menyelamatkan 0,0159 AUC. Baru bila early stopping tidak cukup, tambah penalti lain (misal learning rate lebih kecil, max_depth lebih dangkal, atau min_samples_leaf lebih besar pada GBM).",
        "LANGKAH KETIGA: bila rem sudah dipakai dan gap tetap besar ATAU skor test tetap rendah, masalahnya kemungkinan BUKAN kapasitas — melainkan data atau fitur. Tanda-tandanya: train dan test sama-sama rendah (underfit — tambah kapasitas atau fitur, bukan rem), atau train tinggi tapi test mentok meski sudah direm (sinyal di data latih tidak ada di data baru — periksa kebocoran, pergeseran distribusi, atau kualitas fitur). Di data ini, GBM dengan early stopping sudah di 0,7823 dan LR di 0,7426; keduanya sudah dekat dengan batas sinyal yang tersedia (sebagai pembanding, GBM 0,7823 hanya 0,0035 di bawah estimasi nested CV 0,7858 dari M6.2) — rem lebih keras tidak akan mengangkatnya lebih jauh.",
        "Nilai: peta ini mengubah regularisasi dari «coba-coba» menjadi keputusan berurutan: ukur gap → pilih rem dari jenis model → ukur lagi → bila mentok, pindah ke data/fitur. Tiap langkah punya angka yang bisa diperiksa, bukan firasat.",
        "Baik atau buruk: peta keputusan bagus karena ia mencegah dua pemborosan — menala C berjam-jam pada model yang gap-nya sudah kecil, dan mematikan early stopping lalu menala max_iter manual padahal default-nya sudah optimal. Buruk bila dipakai sebagai resep kaku: ambang 0,02/0,05 adalah aturan praktis lesson ini untuk data ini — pada data lain (misal 500 baris, bukan 24.000), gap «wajar» bisa jauh lebih besar, dan early stopping bisa berhenti terlalu dini bila validasi internalnya kecil.",
        "Mitigasi: tulis keputusanmu dalam satu kalimat sebelum mengeksekusi — «gap 0,0646, model GBM iteratif, jadi pakai early stopping default dan ukur lagi» — lalu bandingkan hasilnya dengan kalimat itu. Bila hasil tidak sesuai kalimat, periksa asumsi kalimatnya, bukan hanya angkanya.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: L1 vs L2 pada koefisien mainan — siapa yang mematikan, siapa yang mengecilkan",
      prose: [
        "Sekarang giliranmu menulis matematika regularisasi dengan tangan — pada angka kecil, tanpa library. Delapan koefisien mainan [ilustrasi]: W = [0,85; 0,62; 0,41; 0,18; 0,09; 0,03; −0,07; −0,22], dengan λ = 0,15. Dua fungsi: soft-threshold L1 — sign(w) × max(|w| − λ, 0) — dan shrink L2 — w / (1 + λ).",
        "Hasil yang diharapkan [lab]: L1 men-zero-kan 3 koefisien (0,09; 0,03; −0,07 — ketiganya lebih kecil dari λ = 0,15, jadi terpotong habis); L2 men-zero-kan 0 (semuanya hanya mengecil, misal 0,85 → 0,7391). Lalu bandingkan dengan angka kanonis [notebook]: L1 pada C = 0,1 men-zero-kan 7 dari 31 koefisien (test 0,7418) vs L2 0 (test 0,7424) — selisih skor hanya 0,0006.",
        "Perhatikan apa yang TIDAK berubah: L1 yang mematikan 3 koefisien mainan tidak «merusak» apa pun — koefisien yang dimatikan adalah yang paling kecil. Itulah intuisi soft-thresholding: penalti |w| memotong koefisien kecil sampai nol, sementara koefisien besar hanya terpangkas λ (0,85 → 0,70). L2 sebaliknya memangkas PROPORSIONAL: semua mengecil dengan faktor yang sama, tidak ada yang nol.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi soft_threshold: L1 — sign(w) * max(|w| - lam, 0)" },
        { id: "t2", text: "Lengkapi l2_shrink: L2 — w / (1 + lam)" },
        { id: "t3", text: "Jalankan dan bandingkan jumlah koefisien nol + selisih skor kanonis (L1 0,7418 vs L2 0,7424)" },
      ],
      expected: "l1_nol=3\nl2_nol=0\nselisih_skor=0.0006",
      hints: [
        "Soft-threshold: bila w positif, kembalikan max(w - lam, 0.0); bila w negatif, kembalikan -max(-w - lam, 0.0); bila w nol, kembalikan 0.0.",
        "L2 shrink: bagi w dengan (1 + lam) — semua koefisien mengecil dengan faktor yang sama, tidak ada yang menjadi nol.",
        "Koefisien mainan yang lebih kecil dari lam = 0,15 (0,09; 0,03; -0,07) akan nol di L1 — hitung sendiri ada berapa.",
      ],
      code: {
        starter: `# L1 vs L2 pada koefisien mainan [ilustrasi] — lengkapi soft-threshold & shrink-nya
# Koefisien awal (8 fitur mainan); lambda = 0.15
W = [0.85, 0.62, 0.41, 0.18, 0.09, 0.03, -0.07, -0.22]
LAM = 0.15

def soft_threshold(w, lam):
    # TODO: L1 — kembalikan sign(w) * max(|w| - lam, 0)
    return 0.0

def l2_shrink(w, lam):
    # TODO: L2 — kembalikan w / (1 + lam)
    return 0.0

w_l1 = [soft_threshold(w, LAM) for w in W]
w_l2 = [l2_shrink(w, LAM) for w in W]
l1_nol = sum(1 for w in w_l1 if w == 0.0)
l2_nol = sum(1 for w in w_l2 if w == 0.0)
# Skor kanonis [notebook]: L1 C=0,1 -> 0.7418 (7 koefisien nol dari 31); L2 C=0,1 -> 0.7424 (0 nol)
L1_SKOR = 0.7418
L2_SKOR = 0.7424
selisih_skor = L2_SKOR - L1_SKOR
print(f"l1_nol={l1_nol}")
print(f"l2_nol={l2_nol}")
print(f"selisih_skor={selisih_skor:.4f}")`,
        lockLines: 4,
        solution: `# L1 vs L2 pada koefisien mainan [ilustrasi] — lengkapi soft-threshold & shrink-nya
# Koefisien awal (8 fitur mainan); lambda = 0.15
W = [0.85, 0.62, 0.41, 0.18, 0.09, 0.03, -0.07, -0.22]
LAM = 0.15

def soft_threshold(w, lam):
    if w > 0:
        return max(w - lam, 0.0)
    if w < 0:
        return -max(-w - lam, 0.0)
    return 0.0

def l2_shrink(w, lam):
    return w / (1 + lam)

w_l1 = [soft_threshold(w, LAM) for w in W]
w_l2 = [l2_shrink(w, LAM) for w in W]
l1_nol = sum(1 for w in w_l1 if w == 0.0)
l2_nol = sum(1 for w in w_l2 if w == 0.0)
# Skor kanonis [notebook]: L1 C=0,1 -> 0.7418 (7 koefisien nol dari 31); L2 C=0,1 -> 0.7424 (0 nol)
L1_SKOR = 0.7418
L2_SKOR = 0.7424
selisih_skor = L2_SKOR - L1_SKOR
print(f"l1_nol={l1_nol}")
print(f"l2_nol={l2_nol}")
print(f"selisih_skor={selisih_skor:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "l1_nol", value: 3, tol: 0.5, label: "`l1_nol` seharusnya 3", msg: "L1 (λ = 0,15) men-zero-kan 3 koefisien mainan: 0,09; 0,03; dan −0,07." },
          { kind: "equal", task: "t2", name: "l2_nol", value: 0, tol: 0.5, label: "`l2_nol` seharusnya 0", msg: "L2 tidak pernah men-zero-kan koefisien — semuanya hanya mengecil." },
          { kind: "equal", task: "t3", name: "selisih_skor", value: 0.0006, tol: 0.00005, label: "`selisih_skor` seharusnya 0.0006", msg: "Skor kanonis: L2 C = 0,1 (0,7424) minus L1 C = 0,1 (0,7418) = 0,0006." },
          { kind: "stdout_matches", task: "t1", pattern: "l1_nol=3", label: "Output menampilkan l1_nol=3", msg: "L1 men-zero-kan 3 dari 8 koefisien mainan." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih_skor=0\\.0006", label: "Output menampilkan selisih_skor=0.0006", msg: "Harga seleksi fitur L1 di data ini: 0,0006 AUC." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: validation curve GBM — tentukan titik early stopping dari angka kanonis",
      prose: [
        "Lab kedua memakai angka kanonis langsung [notebook]: test ROC-AUC GBM per max_iter, DENGAN early stopping (default) dan TANPA early stopping. Dua kamus sudah diberikan — tugasmu hanya dua fungsi: titik_optimal (max_iter dengan skor test tertinggi; bila seri, yang TERKECIL) dan pemburukan (skor di titik optimal minus skor di max_iter 400).",
        "Hasil yang diharapkan [lab]: optimal_dengan_es = 50, optimal_tanpa_es = 50, pemburukan_dengan_es = 0,0000, pemburukan_tanpa_es = 0,0159. Perhatikan: titik optimalnya SAMA (50) di kedua kurva — yang berbeda adalah APA yang terjadi sesudahnya. Dengan early stopping, tidak ada pemburukan sama sekali; tanpanya, 350 pohon tambahan merusak 0,0159 AUC.",
        "Setelah lab jalan, ubah-ubah sendiri: bagaimana bila kamu memilih titik optimal dari TRAIN, bukan test? (Petunjuk: train naik terus — «optimal»-nya jadi 400, dan itulah tepatnya kesalahan yang dicegah early stopping.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi titik_optimal: max_iter dengan skor test tertinggi (bila seri, yang terkecil)" },
        { id: "t2", text: "Lengkapi pemburukan: skor di titik optimal minus skor di max_iter 400" },
        { id: "t3", text: "Jalankan dan bandingkan titik optimal + pemburukan kedua kurva (0,0000 vs 0,0159)" },
      ],
      expected: "optimal_dengan_es=50\noptimal_tanpa_es=50\npemburukan_dengan_es=0.0000\npemburukan_tanpa_es=0.0159",
      hints: [
        "Titik optimal: cari skor tertinggi dulu dengan max(kurva.values()), lalu ambil max_iter TERKECIL yang mencapai skor itu.",
        "Pemburukan: kurva[optimal] - kurva[400] — untuk kurva dengan early stopping, skor di 50 dan di 400 sama (0,7823), jadi hasilnya 0.",
        "Jangan memilih dari train: train naik terus sampai 400, jadi 'optimal' dari train selalu 400 — itu jebakan overfitting.",
      ],
      code: {
        starter: `# Validation curve GBM [notebook] — tentukan titik early stopping & hitung pemburukan
# Test ROC-AUC per max_iter: DENGAN early stopping (default) dan TANPA early stopping
DENGAN_ES = {10: 0.7752, 25: 0.7797, 50: 0.7823, 100: 0.7823, 200: 0.7823, 400: 0.7823}
TANPA_ES = {10: 0.7763, 25: 0.7788, 50: 0.7797, 100: 0.7763, 200: 0.7721, 400: 0.7638}

def titik_optimal(kurva):
    # TODO: kembalikan max_iter dengan skor test TERTINGGI (bila seri, yang TERKECIL)
    return 0

def pemburukan(kurva, optimal):
    # TODO: kembalikan skor di titik optimal MINUS skor di max_iter 400
    return 0.0

optimal_dengan_es = titik_optimal(DENGAN_ES)
optimal_tanpa_es = titik_optimal(TANPA_ES)
pemburukan_dengan_es = pemburukan(DENGAN_ES, optimal_dengan_es)
pemburukan_tanpa_es = pemburukan(TANPA_ES, optimal_tanpa_es)
print(f"optimal_dengan_es={optimal_dengan_es}")
print(f"optimal_tanpa_es={optimal_tanpa_es}")
print(f"pemburukan_dengan_es={pemburukan_dengan_es:.4f}")
print(f"pemburukan_tanpa_es={pemburukan_tanpa_es:.4f}")`,
        lockLines: 4,
        solution: `# Validation curve GBM [notebook] — tentukan titik early stopping & hitung pemburukan
# Test ROC-AUC per max_iter: DENGAN early stopping (default) dan TANPA early stopping
DENGAN_ES = {10: 0.7752, 25: 0.7797, 50: 0.7823, 100: 0.7823, 200: 0.7823, 400: 0.7823}
TANPA_ES = {10: 0.7763, 25: 0.7788, 50: 0.7797, 100: 0.7763, 200: 0.7721, 400: 0.7638}

def titik_optimal(kurva):
    terbaik = max(kurva.values())
    return min(k for k, v in kurva.items() if v == terbaik)

def pemburukan(kurva, optimal):
    return kurva[optimal] - kurva[400]

optimal_dengan_es = titik_optimal(DENGAN_ES)
optimal_tanpa_es = titik_optimal(TANPA_ES)
pemburukan_dengan_es = pemburukan(DENGAN_ES, optimal_dengan_es)
pemburukan_tanpa_es = pemburukan(TANPA_ES, optimal_tanpa_es)
print(f"optimal_dengan_es={optimal_dengan_es}")
print(f"optimal_tanpa_es={optimal_tanpa_es}")
print(f"pemburukan_dengan_es={pemburukan_dengan_es:.4f}")
print(f"pemburukan_tanpa_es={pemburukan_tanpa_es:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "optimal_dengan_es", value: 50, tol: 0.5, label: "`optimal_dengan_es` seharusnya 50", msg: "Dengan early stopping, test mencapai 0,7823 pertama kali pada 50 pohon — dan tidak naik lagi." },
          { kind: "equal", task: "t1", name: "optimal_tanpa_es", value: 50, tol: 0.5, label: "`optimal_tanpa_es` seharusnya 50", msg: "Tanpa early stopping, puncak test 0,7797 juga pada 50 pohon." },
          { kind: "equal", task: "t2", name: "pemburukan_tanpa_es", value: 0.0159, tol: 0.00005, label: "`pemburukan_tanpa_es` seharusnya 0.0159", msg: "Tanpa early stopping, test memburuk 0,7797 − 0,7638 = 0,0159 dari 50 ke 400 pohon." },
          { kind: "equal", task: "t2", name: "pemburukan_dengan_es", value: 0, tol: 0.00005, label: "`pemburukan_dengan_es` seharusnya 0.0", msg: "Dengan early stopping, tidak ada pemburukan: 0,7823 di 50 maupun di 400." },
          { kind: "stdout_matches", task: "t3", pattern: "pemburukan_tanpa_es=0\\.0159", label: "Output menampilkan pemburukan_tanpa_es=0.0159", msg: "Kerusakan yang dicegah early stopping: 0,0159 AUC." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: rem yang terukur, bukan rem yang ditebak",
      prose: [
        "Rangkuman: kapasitas model diukur dari gap train-test — GBM 0,8469 vs 0,7823 (gap 0,0646, besar) vs LR 0,7610 vs 0,7426 (gap 0,0184, kecil) [notebook]. L2 mengecilkan koefisien tanpa mematikan satu pun: jalur C LR — C = 0,01 test 0,7411 norma 0,8866; C = 0,1 test 0,7424 norma 0,9594; C = 1/10/100 test 0,7426 norma 0,9684/0,9694/0,9695. C adalah kebalikan kekuatan penalti (C = 1/λ): C besar = rem longgar. L1 mematikan koefisien: 7 dari 31 pada C = 0,1 (test 0,7418; norma L1 2,7928) dan 1 pada C = 1 (test 0,7425; norma L1 3,3090) — vs L2 yang nol-nya 0 (test 0,7424/0,7426). Pilih L1 untuk seleksi fitur, L2 untuk stabilitas, campuran (l1_ratio di antara 0 dan 1) untuk keduanya; jangan memilih dari selisih skor 0,0001–0,0006 yang lebih kecil dari noise CV. Validation curve dibaca dari DUA garis: test naik lalu turun sementara train naik terus = overfit mulai di puncak (50 pohon di GBM tanpa early stopping). Early stopping menghentikan pelatihan di t* = argmin loss validasi — dan KEJUJURAN UTAMA lesson ini: kurva GBM default yang DATAR (test 0,7823 dari 50 sampai 400) adalah EFEK early_stopping='auto' yang aktif (train 24.000 > 10.000), bukan bukti 400 pohon aman. Bukti overfitting yang sebenarnya adalah kurva TANPA early stopping: test puncak 0,7797 di 50 lalu jatuh ke 0,7638 di 400 (memburuk 0,0159), train 0,9766, gap 0,2128. Regularisasi di data ini hampir tidak mengubah skor (0,7411 → 0,7426, naik 0,0015) — nilainya ada di seleksi fitur dan stabilitas, bukan lonjakan AUC. Peta keputusan: ukur gap → pilih rem dari jenis model (L1/L2 untuk linear, early stopping untuk iteratif) → ukur lagi → bila mentok, pindah ke data/fitur. Lab: L1 men-zero-kan 3 dari 8 koefisien mainan (λ = 0,15) vs L2 0, selisih skor kanonis 0,0006; titik optimal kedua kurva GBM sama-sama 50, pemburukan 0,0000 dengan early stopping vs 0,0159 tanpanya.",
        "Guided task di Colab — notebook mlf-m63-guided-task.ipynb — mereplikasi semua angka kanonis lesson ini dari data UCI: flagship LR dan GBM, jalur C LR, L1 vs L2 lewat l1_ratio, dan kurva validasi GBM dengan dan tanpa early stopping. Jalur file notebook: colab/mlf-m63-guided-task.ipynb. Tautan Colab: https://colab.research.google.com/drive/1WOmQemoM-ekZsbdJbYH4JiNl5owXtVbl",
        "Lanjut: MLF-M6.4 — Kalibrasi & Threshold: skor yang bagus belum tentu probabilitas yang jujur — bagaimana mengukur kalibrasi, dan memilih threshold dari BIAYA, bukan dari 0,5.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Jalur C pada LR [notebook]: C = 0,01 memberi test ROC-AUC 0,7411, C = 1 memberi 0,7426. Berapa kenaikan skor dari penalti terkuat ke C = 1?",
          options: [
            { text: "0,0015", why: "Benar: 0,7426 − 0,7411 = 0,0015. Kecil — regularisasi hampir tidak mengubah skor di data ini.", correct: true },
            { text: "0,0150", why: "Salah: itu sepuluh kali lipat dari kenaikan sebenarnya (0,0015). Perhatikan posisi komanya — 0,7426 − 0,7411 = 0,0015, bukan 0,0150." },
            { text: "0,0000 — skornya datar dari C = 0,01", why: "Salah: skor DATAR dari C = 1 ke C = 100 (semuanya 0,7426), tapi dari C = 0,01 ke C = 1 ia naik dari 0,7411 ke 0,7426." },
            { text: "0,7411", why: "Salah: 0,7411 adalah SKOR pada C = 0,01, bukan kenaikan. Kenaikannya adalah selisih: 0,7426 − 0,7411 = 0,0015." },
          ],
        },
        {
          q: "L1 pada C = 0,1 men-zero-kan berapa koefisien dari 31, dan berapa test ROC-AUC-nya?",
          options: [
            { text: "7 koefisien, test 0,7418", why: "Benar: L1 C = 0,1 men-zero-kan 7 dari 31 koefisien [notebook], test 0,7418 — hanya 0,0006 di bawah L2 (0,7424) yang men-zero-kan 0.", correct: true },
            { text: "0 koefisien, test 0,7424", why: "Salah: itu angka L2 pada C = 0,1 — L2 tidak pernah men-zero-kan koefisien. L1 men-zero-kan 7, test 0,7418." },
            { text: "1 koefisien, test 0,7425", why: "Salah: itu angka L1 pada C = 1 (penalti lebih lemah). Pada C = 0,1 yang lebih kuat, L1 men-zero-kan 7, test 0,7418." },
            { text: "31 koefisien, test 0,7418", why: "Salah: L1 men-zero-kan 7 dari 31 — bukan semuanya. Model masih memakai 24 fitur." },
          ],
        },
        {
          q: "Kurva GBM default DATAR: test 0,7823 dari 50 sampai 400 pohon. Apa penjelasan yang benar?",
          options: [
            { text: "GBM tidak bisa overfit sampai 400 pohon", why: "Salah — dan ini miskonsepsi utama lesson ini. Tanpa early stopping, test JATUH dari 0,7797 ke 0,7638 pada 400 pohon. GBM overfit; kurva default hanya menyembunyikannya." },
            { text: "early_stopping='auto' aktif (train 24.000 > 10.000) sehingga model berhenti sendiri sekitar 50 iterasi", why: "Benar: max_iter 100/200/400 tidak pernah benar-benar melatih sebanyak itu — model berhenti di sekitar 50 iterasi, jadi test dan train sama-sama datar (0,7823 dan 0,8469).", correct: true },
            { text: "sklearn mengabaikan max_iter bila nilainya di atas 50", why: "Salah: max_iter TIDAK diabaikan — dengan early_stopping=False, max_iter 400 benar-benar melatih 400 pohon (train 0,9766, test 0,7638). Yang menghentikan pelatihan adalah early stopping, bukan max_iter." },
            { text: "Train dan test sudah sama, jadi tidak ada lagi yang bisa dipelajari", why: "Salah: train 0,8469 dan test 0,7823 — gap 0,0646, masih jauh dari sama. Model masih bisa menghafal lebih banyak (train 0,9766 tanpa early stopping)." },
          ],
        },
        {
          q: "GBM TANPA early stopping: test puncak 0,7797 pada 50 pohon, lalu 0,7638 pada 400 pohon. Berapa pemburukannya, dan berapa gap train-test di 400 pohon?",
          options: [
            { text: "Memburuk 0,0159; gap 0,2128 (train 0,9766 vs test 0,7638)", why: "Benar: 0,7797 − 0,7638 = 0,0159; gap 0,9766 − 0,7638 = 0,2128 [notebook]. Inilah bukti overfitting yang sebenarnya.", correct: true },
            { text: "Memburuk 0,0000; gap 0,0646", why: "Salah: itu angka DENGAN early stopping (test datar 0,7823, gap 0,0646). Tanpa early stopping, test jatuh 0,0159 dan gap membengkak ke 0,2128." },
            { text: "Memburuk 0,0026; gap 0,0646", why: "Salah: 0,0026 adalah selisih puncak tanpa early stopping (0,7797) vs skor dengan early stopping (0,7823) — bukan pemburukan. Pemburukannya 0,7797 − 0,7638 = 0,0159." },
            { text: "Memburuk 0,0159; gap 0,0646", why: "Salah setengah: pemburukan 0,0159 benar, tapi gap 0,0646 adalah gap DENGAN early stopping. Tanpa early stopping, train naik ke 0,9766 sehingga gap-nya 0,2128." },
          ],
        },
        {
          q: "Norma L2 koefisien LR: 0,8866 pada C = 0,01 dan 0,9695 pada C = 100. Apa bacaan yang benar tentang C?",
          options: [
            { text: "C besar = penalti lemah — koefisien dibiarkan lebih besar", why: "Benar: C = 1/λ. C = 100 (penalti terlemah) memberi norma terbesar 0,9695; C = 0,01 (penalti terkuat) memberi norma terkecil 0,8866.", correct: true },
            { text: "C besar = penalti kuat — koefisien ditekan lebih kecil", why: "Terbalik: C adalah KEBALIKAN kekuatan penalti. Bila C besar berarti penalti kuat, norma pada C = 100 mestinya PALING kecil — faktanya paling besar (0,9695)." },
            { text: "C tidak berpengaruh pada besar koefisien", why: "Salah: norma bergerak 0,8866 → 0,9695 sepanjang jalur C — remnya bekerja, koefisien memang mengecil saat C kecil." },
            { text: "C = 0,01 memberi test tertinggi karena penaltinya terkuat", why: "Terbalik: C = 0,01 memberi test TERENDAH (0,7411) — rem terlalu keras menekan sinyal yang berguna (train ikut turun ke 0,7597)." },
          ],
        },
        {
          q: "Pada C = 1: L1 men-zero-kan 1 koefisien (test 0,7425), L2 men-zero-kan 0 (test 0,7426). Bila kamu butuh model yang lebih ringkas untuk dijelaskan ke auditor, apa pilihan yang benar?",
          options: [
            { text: "L1 — menukar 0,0001 AUC dengan 1 fitur lebih sedikit", why: "Benar: harga seleksi fitur di sini hanya 0,7426 − 0,7425 = 0,0001 — praktis gratis — dan model memakai 30 fitur, bukan 31.", correct: true },
            { text: "L2 — karena test-nya lebih tinggi 0,0001", why: "Salah: selisih 0,0001 jauh di bawah noise CV (standar deviasi sekitar 0,0083) — memilih dari selisih itu sama dengan memilih dari undian. Dan L2 tidak menyeleksi apa pun." },
            { text: "Keduanya sama saja — L1 dan L2 tidak pernah berbeda", why: "Salah: keduanya berbeda dalam APA yang dilakukan — L1 mematikan koefisien (7 pada C = 0,1; 1 pada C = 1), L2 tidak pernah mematikan satu pun. Skornya yang hampir sama, bukan perilakunya." },
            { text: "Naikkan C ke 100 dengan L2 — seleksinya akan muncul", why: "Salah: L2 TIDAK PERNAH men-zero-kan koefisien, pada C berapa pun — pada C = 100 pun nol-nya tetap 0. Seleksi fitur hanya datang dari L1 (atau campuran)." },
          ],
        },
        {
          q: "Apa yang dilakukan early stopping sebagai «regularisasi implisit»?",
          options: [
            { text: "Menambah penalti λ‖w‖² ke fungsi loss", why: "Salah: itu L2 — regularisasi EKSPLISIT lewat penalti. Early stopping tidak menyentuh loss; ia menghentikan pelatihan." },
            { text: "Menghentikan pelatihan saat skor validasi berhenti membaik, dan mengembalikan model dari iterasi terbaik", why: "Benar: t* = argmin loss validasi. Di data ini t* ≈ 50 — model dikembalikan dari 50 pohon, bukan dari 400.", correct: true },
            { text: "Menghapus pohon-pohon terakhir dari model yang sudah dilatih penuh", why: "Salah: early stopping BERHENTI melatih — pohon-pohon sesudah t* tidak pernah dibuat. Bukan dilatih lalu dihapus." },
            { text: "Menurunkan learning rate secara otomatis tiap iterasi", why: "Salah: itu learning-rate schedule — teknik berbeda. Early stopping mengendalikan JUMLAH iterasi, bukan ukuran langkahnya." },
          ],
        },
        {
          q: "Pernyataan mana yang PALING JUJUR tentang regularisasi di data ini?",
          options: [
            { text: "Regularisasi gagal total — skor tidak bergerak, jadi tidak ada gunanya", why: "Salah: skor memang hampir tidak bergerak (0,7411 → 0,7426), tapi L1 menyeleksi 7 fitur dan norma koefisien mengecil 0,9695 → 0,8866 — nilainya ada di seleksi dan stabilitas, bukan di AUC." },
            { text: "C = 0,01 adalah yang terbaik karena penaltinya paling kuat", why: "Salah: C = 0,01 memberi test TERENDAH (0,7411) — rem terlalu keras. Yang terbaik di jalur ini adalah C = 1 (0,7426)." },
            { text: "Regularisasi hampir tidak mengubah skor (naik 0,0015); nilainya ada di seleksi fitur (L1) dan stabilitas, bukan lonjakan AUC", why: "Benar: jalur C hanya bergerak 0,7411 → 0,7426, dan L1 vs L2 berbeda paling banyak 0,0006. Kejujuran ini yang mencegah janji palsu «regularisasi menaikkan AUC».", correct: true },
            { text: "Terus kuatkan penalti sampai AUC naik — bila belum naik, penaltinya belum cukup kuat", why: "Salah: menguatkan penalti melewati titik optimal MENURUNKAN skor (C = 0,01 paling rendah) dan train ikut turun — itu underfit, bukan «belum cukup kuat»." },
          ],
        },
      ],
      summary: [
        "Gap train-test adalah diagnosis kapasitas: GBM 0,8469 vs 0,7823 (gap 0,0646, besar) vs LR 0,7610 vs 0,7426 (gap 0,0184, kecil) [notebook].",
        "L2 mengecilkan koefisien tanpa mematikan satu pun: jalur C LR — C = 0,01 test 0,7411 norma 0,8866; C = 0,1 test 0,7424 norma 0,9594; C = 1/10/100 test 0,7426 norma 0,9684/0,9694/0,9695. C = 1/λ: C besar = rem longgar.",
        "L1 mematikan koefisien (seleksi fitur): 7 dari 31 pada C = 0,1 (test 0,7418) dan 1 pada C = 1 (test 0,7425); L2 nol-nya 0 (test 0,7424/0,7426). Di sklearn 1.9 pilihannya lewat l1_ratio (0 = L2, 1 = L1).",
        "Validation curve dibaca dari DUA garis: test naik lalu turun sementara train naik terus = overfit mulai di puncak (50 pohon pada GBM tanpa early stopping).",
        "Early stopping = regularisasi implisit (t* = argmin loss validasi). KEJUJURAN UTAMA: kurva GBM default yang DATAR (0,7823 dari 50 s.d. 400) adalah efek early_stopping='auto' yang aktif (train 24.000 > 10.000) — bukan bukti 400 pohon aman.",
        "Bukti overfitting yang sebenarnya: kurva TANPA early stopping — test puncak 0,7797 di 50 lalu 0,7638 di 400 (memburuk 0,0159), train 0,9766, gap 0,2128.",
        "Regularisasi di data ini hampir tidak mengubah skor (0,7411 → 0,7426, naik 0,0015) — nilainya ada di seleksi fitur dan stabilitas, bukan lonjakan AUC.",
        "Peta keputusan: ukur gap → pilih rem dari jenis model (L1/L2 untuk linear, early stopping untuk iteratif) → ukur lagi → bila mentok, pindah ke data/fitur.",
        "Lab: L1 men-zero-kan 3 dari 8 koefisien mainan (λ = 0,15) vs L2 0, selisih skor kanonis 0,0006; titik optimal kedua kurva GBM sama-sama 50, pemburukan 0,0000 dengan early stopping vs 0,0159 tanpanya.",
      ],
      next: { label: "Lanjut: MLF-M6.4 — Kalibrasi & Threshold", href: "/v2/learn/mlf-m64-calibration-threshold-selection" },
    },
  ],
};

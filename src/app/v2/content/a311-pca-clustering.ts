import type { V2Lesson } from "../lib/types";

export const a311: V2Lesson = {
  slug: "a311-pca-clustering",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.11 PCA, Clustering & Deteksi Anomali",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-fraud-tanpa-label",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "50 kolom, 3 cerita, 1 penipu",
      prose: [
        "Bank mewarisi database nasabah korporat: 50 kolom rasio keuangan per nasabah, tanpa label apa pun — tidak ada yang tahu mana yang bermasalah. Tim junior menyerah: 50 dimensi tidak bisa divisualisasikan manual.",
        "Analis senior melakukan tiga langkah dalam satu sore. Pertama, PCA: 50 kolom ternyata 90 persen variansinya dijelaskan 3 komponen — ukuran, profitabilitas, leverage. Kedua, K-means di 3 komponen itu: muncul 4 kelompok alami, termasuk satu kelompok kecil perusahaan besar tapi rugi terus. Ketiga, deteksi anomali: satu perusahaan tidak masuk akal — labanya terlalu mulus, terlalu sempurna.",
        "Investigasi: perusahaan itu fiktif — cangkang untuk fraud kredit Rp40 miliar. Tidak ada model supervised yang bisa menemukan ini, karena tidak ada label fraud untuk dilatih. Inilah kekuatan unsupervised: menemukan yang tidak kamu tahu cara mencarinya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fraud jarang datang dengan label. Pipeline unsupervised adalah radar dini untuk pola yang belum pernah terlihat — pelengkap wajib model supervised yang hanya mengenali pola lama.",
      },
      reference: "Unsupervised = temukan struktur tanpa diberi tahu. Evaluasinya kegunaan bisnis, bukan akurasi.",
    },
    {
      id: "pca",
      eyebrow: "Langkah 2 · PCA",
      title: "Merampingkan dimensi tanpa kehilangan cerita",
      prose: [
        "PCA mencari arah-arah baru yang saling tegak lurus dan menangkap variansi maksimum data, berurutan: PC1 arah paling bervariasi, PC2 arah paling bervariasi yang tegak lurus PC1, dan seterusnya. Secara matematis, komponen utama adalah eigenvector matriks kovarians, dan eigenvalue adalah variansi yang dijelaskan tiap komponen.",
        "Cara memilih jumlah komponen: scree plot. Contoh: PC1 42 persen, PC2 23 persen, PC3 12 persen — kumulatif 77 persen — lalu batangnya landai (masing-masing di bawah 10 persen, kemungkinan noise). Potong di siku (elbow) atau saat kumulatif mencapai 80 sampai 90 persen. Di sini: simpan 3 sampai 4 komponen, buang sisanya.",
        "Aturan keras: standarkan dulu sebelum PCA. PCA memaksimalkan variansi mentah — fitur dalam rupiah (variansi 10^12) akan mendominasi fitur dalam persen (variansi 25) bukan karena lebih penting, tapi karena satuannya besar.",
      ],
      formula: String.raw`\Sigma v_i = \lambda_i v_i, \qquad \text{proporsi} = \frac{\lambda_i}{\sum_j \lambda_j}`,
      formulaNote: "Sigma matriks kovarians, v_i arah PC ke-i, lambda_i variansi yang dijelaskan.",
      tasks: [
        { id: "t1", text: "Hitung `total` variansi dari `eig`" },
        { id: "t2", text: "Hitung `cum3` = variansi kumulatif 3 PC pertama, dalam persen" },
        { id: "t3", text: "Cetak `cum3` dengan `print`" },
      ],
      expected: "cum3=77.0",
      note: {
        title: "Sering salah",
        body: "Memakai 10 PC karena bisa. Itu mengalahkan tujuan kompresi. PCA adalah kompresi, bukan pemahaman — untuk visualisasi dan de-noise bagus, untuk pertanyaan fitur mana yang penting itu alat yang salah.",
      },
      hints: [
        "Proporsi tiap PC = eigenvalue / total x 100.",
        "Kumulatif 3 pertama = jumlah 3 proporsi pertama.",
        "cum3 = sum(eig[:3]) / sum(eig) * 100",
      ],
      code: {
        starter: `# Eigenvalue 8 PC pertama (variansi tiap komponen)\neig = [42, 23, 12, 8, 6, 4, 3, 2]\n\n# TULIS KODEMU: % variansi kumulatif 3 PC pertama\ntotal = \ncum3 = \n\nprint(f"cum3={cum3:.1f}")`,
        lockLines: 2,
        solution: `# Eigenvalue 8 PC pertama (variansi tiap komponen)\neig = [42, 23, 12, 8, 6, 4, 3, 2]\n\n# TULIS KODEMU: % variansi kumulatif 3 PC pertama\ntotal = sum(eig)\ncum3 = sum(eig[:3]) / total * 100\n\nprint(f"cum3={cum3:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 100, tol: 1e-9, label: "`total` seharusnya 100", msg: "Jumlahkan semua eigenvalue dengan sum(eig)." },
          { kind: "equal", task: "t2", name: "cum3", value: 77.0, tol: 0.05, label: "`cum3` seharusnya 77.0", msg: "(42+23+12)/100 x 100 = 77. Cek slicing tiga pertama." },
          { kind: "stdout_matches", task: "t3", pattern: "cum3=77\\.0", label: "`print` menampilkan kumulatif", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Siku di scree plot = titik berhenti. Kumulatif 80-90 persen = aturan praktis.",
    },
    {
      id: "kmeans",
      eyebrow: "Langkah 3 · K-means",
      title: "Mengelompokkan yang serupa",
      prose: [
        "K-means bekerja dua langkah berulang: assign — tiap titik masuk ke centroid terdekat; update — centroid digeser ke rata-rata anggotanya. Ulangi sampai stabil. Jantungnya adalah jarak Euclidean, jadi standarisasi wajib: tanpa itu, fitur bersatuan besar mendominasi jarak.",
        "Pemilihan k memakai elbow method: tambah k, lihat penurunan inertia; berhenti di siku. Tapi jangan berhenti di statistik: uji stabilitas (hasil berubah tiap run berarti segmen palsu) dan tanya makna bisnis. Contoh: 10.000 nasabah, k=3 memberi segmen stabil dan actionable; k=5 atas permintaan bisnis menghasilkan 2 segmen mungil yang tidak stabil — detail palsu.",
        "K-means selalu mempartisi, bahkan di data acak murni tanpa struktur. Ia juga mengasumsikan cluster berbentuk bola — untuk bentuk cincin atau donat, pakai DBSCAN yang berbasis densitas.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `dist(a, b)` (jarak Euclidean)" },
        { id: "t2", text: "Hitung `dmin` = jarak titik anomali ke centroid terdekat, dan `assign` = indeks cluster-nya" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "dmin=17.00 assign=1",
      note: {
        title: "Sering salah",
        body: "Percaya cluster hanya karena algoritma mengeluarkannya. K-means dengan k=5 di data acak tetap menghasilkan 5 cluster. Validasi: stabilitas antar run dan makna bisnis — clustering tanpa tujuan bisnis adalah seni, bukan analisis.",
      },
      hints: [
        "Jarak Euclidean 2D = akar dari jumlah kuadrat selisih.",
        "Cari indeks dengan jarak minimum: min(range(3), key=...).",
        "def dist(a, b):\n    return math.hypot(a[0]-b[0], a[1]-b[1])",
      ],
      code: {
        starter: `import math\n\n# 3 centroid cluster nasabah (transaksi/bln, rata2 nominal jt Rp)\ncent = [(5.1, 2.0), (20.2, 8.1), (45.3, 1.0)]\np = (22.0, 25.0)   # titik mencurigakan: transaksi sedang, nominal raksasa\n\n# TULIS KODEMU: fungsi jarak + assign ke centroid terdekat\ndef dist(a, b):\n\ndists = \nassign = \ndmin = \n\nprint(f"dmin={dmin:.2f} assign={assign}")`,
        lockLines: 5,
        solution: `import math\n\n# 3 centroid cluster nasabah (transaksi/bln, rata2 nominal jt Rp)\ncent = [(5.1, 2.0), (20.2, 8.1), (45.3, 1.0)]\np = (22.0, 25.0)   # titik mencurigakan: transaksi sedang, nominal raksasa\n\n# TULIS KODEMU: fungsi jarak + assign ke centroid terdekat\ndef dist(a, b):\n    return math.hypot(a[0]-b[0], a[1]-b[1])\n\ndists = [dist(p, c) for c in cent]\nassign = min(range(3), key=lambda c: dists[c])\ndmin = dists[assign]\n\nprint(f"dmin={dmin:.2f} assign={assign}")`,
        checks: [
          { kind: "defined", task: "t1", name: "dist", label: "`dist` terdefinisi", msg: "Tulis fungsi dist(a, b) di bagian kode editable." },
          { kind: "equal", task: "t2", name: "dmin", value: 17.00, tol: 0.05, label: "`dmin` sekitar 17.00", msg: "Jarak ke centroid 1 = akar(1,8^2 + 16,9^2). Cek rumus jaraknya." },
          { kind: "equal", task: "t2", name: "assign", value: 1, tol: 1e-9, label: "`assign` seharusnya 1", msg: "Pilih indeks centroid dengan jarak terkecil." },
          { kind: "stdout_matches", task: "t3", pattern: "dmin=17\\.00\\s+assign=1", label: "`print` menampilkan hasil assign", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Assign-update sampai konvergen. k via elbow + stabilitas + makna bisnis.",
    },
    {
      id: "deteksi-anomali",
      eyebrow: "Langkah 4 · Deteksi anomali",
      title: "Berburu yang tidak wajar",
      prose: [
        "Tiga pendekatan: berbasis jarak (berapa jauh dari centroid atau tetangga), berbasis densitas (LOF — seberapa sepi lingkungannya dibanding sekitarnya), dan berbasis isolasi (Isolation Forest — anomali adalah titik yang cepat terisolasi oleh partisi acak).",
        "Isolation Forest cocok untuk fraud tanpa label karena logikanya terbalik: alih-alih mendefinisikan normal (sulit), ia mengukur betapa mudah suatu titik dipisahkan. Tidak butuh label sama sekali — tapi outputnya skor prioritas, bukan vonis.",
        "Anomali tidak sama dengan fraud. Skor tinggi pada transaksi direktur yang valid berarti review manusia dulu, bukan blokir otomatis. Skor adalah prioritas antrean; pola valid yang langka ditangani dengan aturan bisnis atau whitelist, bukan dengan merusak model.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memperlakukan skor anomali sebagai vonis fraud dan memblokir otomatis. Unsupervised tidak bisa membedakan valid tapi langka vs jahat — human-in-the-loop wajib.",
      },
      reference: "Jarak / densitas / isolasi. Skor = prioritas antrean review, bukan vonis.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Lupa menstandarkan sebelum PCA. Fitur A dalam rupiah (variansi 10^12), fitur B dalam persen (variansi 25). Akibatnya?",
          options: [
            { text: "Tidak ada — PCA robust terhadap skala", why: "Salah. PCA memaksimalkan variansi mentah, sangat sensitif skala." },
            { text: "PC1 didominasi fitur A bukan karena lebih penting, tapi karena satuannya besar — hasil menyesatkan", why: "Benar. Pemenang ditentukan satuan, bukan informasi. Standarkan dulu.", correct: true },
            { text: "PCA error dan berhenti", why: "Salah. PCA tetap jalan — diam-diam salah." },
            { text: "Fitur B otomatis dibuang", why: "Salah. Fitur B tidak dibuang, hanya tenggelam." },
          ],
        },
        {
          q: "Kenapa Isolation Forest cocok untuk fraud tanpa label?",
          options: [
            { text: "Butuh banyak contoh fraud untuk dilatih", why: "Salah. Itu supervised; justru tidak ada label." },
            { text: "Tidak memodelkan normal — anomali = titik yang cepat terisolasi partisi acak. Tidak butuh label sama sekali", why: "Benar. Logika terbalik: ukur betapa mudah ia dipisahkan.", correct: true },
            { text: "Selalu 100 persen akurat", why: "Salah. Outputnya skor prioritas, bukan vonis sempurna." },
            { text: "Hanya untuk data kecil", why: "Salah. Isolation Forest justru skalabel untuk data besar." },
          ],
        },
      ],
      reference: "Standarkan dulu — selalu. Anomali = mudah diisolasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "PCA, clustering, atau anomali?",
      prose: [
        "Satu, terlalu banyak kolom yang berkorelasi: PCA untuk kompresi dan de-noise — simpan komponen sampai 80 sampai 90 persen variansi, lalu visualisasi atau modeling di ruang yang lebih kecil. Dua, ingin tahu ada berapa kelompok alami: clustering — K-means untuk kelompok bola dengan k dari elbow, DBSCAN untuk bentuk bebas dan data ber-noise.",
        "Tiga, ingin tahu mana yang tidak wajar: deteksi anomali — Isolation Forest saat tanpa label, skor dipakai untuk memprioritaskan review manusia. Keempat, gabungkan ketiganya jadi pipeline: PCA untuk merampingkan, clustering untuk konteks perilaku, anomali dinilai relatif terhadap cluster-nya sendiri.",
        "Aturan 10 detik: anomali selalu relatif terhadap kelompoknya — transaksi Rp50 juta aneh untuk ritel, biasa untuk korporat. Tanpa konteks cluster, skor anomali menandai yang besar, bukan yang jahat.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: unsupervised menemukan pola, bukan kebenaran",
        body: "Tanpa label, tidak ada jawaban benar — yang ada hanya pola yang berguna vs pola yang tidak. Nilai sebuah cluster = tindakan bisnis yang ia mungkinkan. Tiga heuristik. Pertama: setiap metode unsupervised punya asumsi geometris — K-means = bola, DBSCAN = densitas, PCA = linear. Bila asumsinya salah, hasilnya fiksi yang rapi. Kenali asumsi sebelum percaya output. Kedua: stabilitas adalah pengganti akurasi. Cluster yang berubah total tiap run = cluster yang tidak ada — jangan bangun segmentasi bisnis di atasnya. Ketiga: standarisasi bukan opsional. Ia menentukan siapa pemenang SEBELUM algoritma berjalan — fitur bersatuan besar menang tanpa bertanding. Aturan praktis: selalu visualisasikan dalam 2D sebelum percaya angka. Mata menangkap struktur (cincin, bulan sabit, gugusan) yang metrik ringkas lewatkan — dan bentuknya langsung memberi tahu metode mana yang cocok.",
      },
      reference: "Banyak kolom -> PCA. Kelompok alami -> clustering. Tidak wajar -> anomali. Ketiganya -> pipeline.",
    },
    {
      id: "mini-case-antifraud",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Pipeline anti-fraud tanpa label",
      prose: [
        "Fintech P2P punya 800.000 transaksi per bulan, tanpa label fraud — belum pernah investigasi sistematis. Kamu diminta membangun sistem deteksi dini. Rancangan tiga tahap: pertama, PCA — standarkan fitur, simpan komponen hingga 85 persen variansi (kemungkinan 3 sampai 5 dari belasan fitur engineered), sekaligus untuk visualisasi 2D. Kedua, K-means — cluster perilaku seperti ritel malam, korporat pagi, agen. Ketiga, Isolation Forest per cluster menjadi skor anomali 0 sampai 1.",
        "Tim investigasi hanya mampu review 500 transaksi per bulan. Jangan pakai threshold probabilitas — pakai top-k: urutkan skor tertinggi, ambil 500 teratas. Ini operasional, bukan statistik; yang menentukan adalah kapasitas review, bukan tebakan contamination.",
        "Setelah 3 bulan terkumpul 200 label fraud: tutup lingkaran — latih supervised (logistik atau gradient boosting) dengan validasi jujur, bandingkan vs pipeline unsupervised sebagai challenger. Unsupervised tetap jalan untuk pola baru yang belum ada labelnya. Keduanya komplementer, bukan pengganti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fraud berevolusi; model supervised hanya mengenali pola lama. Pipeline unsupervised yang tetap jalan adalah pertahanan terhadap modus baru yang belum ada labelnya.",
      },
      reference: "Top-k sesuai kapasitas review. Label baru -> supervised + unsupervised sebagai challenger.",
    },
    {
      id: "pendalaman-silhouette-stabilitas",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Silhouette, stabilitas & kutukan dimensi",
      prose: [
        "Elbow method itu subjektif — sikunya sering di mata yang melihat. Alternatif yang lebih berprinsip: silhouette score. Untuk tiap titik: s(i) = (b(i) − a(i))/max(a(i),b(i)), dengan a = jarak rata-rata ke anggota cluster-nya sendiri (kohesi, ingin kecil) dan b = jarak rata-rata ke cluster terdekat lain (separasi, ingin besar). s dekat 1 = titik pas di clusternya; dekat 0 = di perbatasan; negatif = kemungkinan salah cluster. Rata-rata silhouette untuk memilih k — tapi jangan buta: silhouette tertinggi di k=2 sering trivial (membelah data jadi dua gumpalan besar yang tidak actionable).",
        "Metrik kedua yang lebih penting dari yang dikira: stabilitas. Bootstrap datamu, jalankan clustering di tiap resample, ukur kesepakatan antar run (Jaccard atau adjusted Rand index). Cluster yang tidak stabil = artefak sampling, bukan struktur. Aturan pelaporan senior: k selalu disertai skor stabilitas — k tanpa stabilitas = angka tanpa fondasi. Segmentasi nasabah yang berubah tiap bulan bukan segmentasi; itu undian.",
        "Kutukan dimensi adalah alasan pola standar PCA-dulu-baru-cluster. Di dimensi tinggi, semua jarak Euclidean menjadi mirip — K-means kehilangan daya beda karena perbandingan jarak tidak lagi informatif. PCA memampatkan ke dimensi yang jaraknya masih bermakna, sekaligus membuang noise. Aturan praktis: bila p > 20, curigai jarak Euclidean-mu; bila p > 100, jangan clustering di ruang mentah sama sekali.",
        "Untuk yang ingin lebih berprinsip dari elbow: gap statistic (Tibshirani) — bandingkan penurunan inertia di datamu vs di data acak referensi tanpa struktur. Pilih k terkecil di mana gap berhenti naik signifikan. Ia menjawab pertanyaan yang tepat: apakah struktur ini lebih dari yang diharapkan dari keacakan? Elbow tidak pernah bertanya itu.",
      ],
      formula: String.raw`s(i) = \frac{b(i) - a(i)}{\max\{a(i),\, b(i)\}}`,
      formulaNote: "s(i) = silhouette titik i; a(i) = jarak rata-rata ke anggota cluster-nya sendiri (kohesi, ingin kecil); b(i) = jarak rata-rata ke cluster terdekat lain (separasi, ingin besar). s ≈ 1 pas, s ≈ 0 di perbatasan, s < 0 kemungkinan salah cluster.",
      tasks: [],
      reference: "Silhouette untuk k, stabilitas untuk kepercayaan, PCA dulu untuk dimensi tinggi. Gap statistic > elbow.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "PCA = kompresi: simpan komponen sampai 80-90 persen variansi, potong di siku scree plot. Standarkan dulu — selalu.",
        "K-means = assign-update; k via elbow + stabilitas + makna bisnis. Selalu mempartisi, bahkan di data acak.",
        "Deteksi anomali: jarak, densitas, isolasi. Isolation Forest untuk kasus tanpa label.",
        "Anomali bukan vonis fraud: skor adalah prioritas antrean, review manusia wajib.",
        "Pipeline lengkap: PCA merampingkan, clustering memberi konteks, anomali dinilai relatif terhadap cluster-nya.",
      ],
      next: { label: "A3.12 — Survival Analysis", href: "/v2/learn/a312-survival-analysis" },
      quiz: [
        {
          q: "K-means dengan k=5 pada data acak murni (tanpa struktur). Apa yang terjadi?",
          options: [
            { text: "Error — tidak ada cluster", why: "Salah. K-means tidak pernah protes." },
            { text: "Tetap menghasilkan 5 cluster. K-means memaksakan partisi — validasi dengan stabilitas dan makna bisnis", why: "Benar. Jangan percaya cluster hanya karena algoritma mengeluarkannya.", correct: true },
            { text: "Otomatis memilih k=1", why: "Salah. K-means tidak memilih k sendiri." },
            { text: "Centroid tidak konvergen", why: "Salah. Ia tetap konvergen ke partisi yang tidak bermakna." },
          ],
        },
        {
          q: "Scree plot: PC1 45%, PC2 25%, PC3 8%, sisanya di bawah 5% dan landai. Berapa komponen disimpan?",
          options: [
            { text: "Semua — jangan buang informasi", why: "Salah. Itu mengalahkan tujuan kompresi; sisanya kemungkinan noise." },
            { text: "2-3: siku setelah PC2/PC3; pilih berdasar kebutuhan (visualisasi vs modeling)", why: "Benar. 2 untuk visualisasi 2D yang bersih; 3 jika butuh variansi lebih.", correct: true },
            { text: "Hanya PC1", why: "Salah. 45 persen saja membuang terlalu banyak." },
            { text: "Acak saja", why: "Salah. Ada kriteria: siku dan kumulatif 80-90 persen." },
          ],
        },
        {
          q: "Cluster berbentuk cincin (donat), K-means k=2. Masalahnya?",
          options: [
            { text: "Tidak ada — K-means universal", why: "Salah. K-means punya asumsi geometris." },
            { text: "K-means mengasumsikan cluster bola (jarak Euclidean) — gagal untuk bentuk non-convex. Pakai DBSCAN", why: "Benar. Donat akan dipotong paksa jadi dua setengah lingkaran yang salah.", correct: true },
            { text: "Naikkan k", why: "Salah. Menambah k tidak mengubah asumsi bentuk bola." },
            { text: "Standarkan lagi", why: "Salah. Masalahnya bentuk, bukan skala." },
          ],
        },
        {
          q: "Skor anomali menandai transaksi direktur (valid, nominal besar). Tindakan?",
          options: [
            { text: "Blokir otomatis — skor tinggi = fraud", why: "Salah. Skor adalah prioritas, bukan vonis." },
            { text: "Anomali bukan fraud: review manusia dulu; pola valid yang langka ditangani aturan bisnis atau whitelist", why: "Benar. Unsupervised tidak tahu valid tapi langka vs jahat.", correct: true },
            { text: "Turunkan contamination ke 0", why: "Salah. Itu mematikan sistem, bukan memperbaikinya." },
            { text: "Buang fitur nominal", why: "Salah. Nominal adalah sinyal penting; masalahnya di tindak lanjut." },
          ],
        },
        {
          q: "Rata-rata silhouette k=2 (0,72) vs k=5 (0,51). Pilih k=2?",
          options: [
            { text: "Ya — silhouette tertinggi selalu menang", why: "Salah. Silhouette bukan satu-satunya juri." },
            { text: "Belum tentu — silhouette tinggi di k=2 sering trivial. Cek makna bisnis dan stabilitas; k=5 dengan segmen actionable bisa lebih berguna", why: "Benar. Statistik + bisnis + stabilitas = keputusan.", correct: true },
            { text: "Tidak — selalu pilih k terbesar", why: "Salah. Tidak ada aturan seperti itu." },
            { text: "Rata-ratakan k=2 dan k=5", why: "Salah. k bukan angka yang bisa dirata-rata." },
          ],
        },
        {
          q: "Cluster nasabah berubah total setiap kali algoritma dijalankan ulang. Tindakan?",
          options: [
            { text: "Ambil hasil run terakhir", why: "Salah. Itu undian, bukan segmentasi." },
            { text: "Cluster tidak stabil = artefak sampling. Jangan bangun keputusan bisnis di atasnya; coba k lain, metode lain, atau akui datanya memang tidak berstruktur", why: "Benar. Stabilitas adalah pengganti akurasi di unsupervised.", correct: true },
            { text: "Naikkan k sampai stabil", why: "Salah. Menambah k tidak menjamin stabilitas." },
            { text: "Fix seed agar selalu sama", why: "Salah. Itu menyembunyikan ketidakstabilan, bukan memperbaikinya." },
          ],
        },
        {
          q: "K-means dijalankan langsung di 200 fitur mentah tanpa reduksi dimensi. Risiko utama?",
          options: [
            { text: "Terlalu lambat", why: "Salah. Bukan itu masalah utamanya." },
            { text: "Kutukan dimensi: di ruang 200D semua jarak menjadi mirip sehingga K-means kehilangan daya beda. PCA dulu, baru cluster", why: "Benar. Jarak Euclidean tidak informatif di dimensi sangat tinggi.", correct: true },
            { text: "Centroid tidak konvergen", why: "Salah. Konvergen, tapi ke partisi yang tidak bermakna." },
            { text: "Harus pakai k=200", why: "Salah. Tidak ada hubungan seperti itu." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const mk8: V2Lesson = {
  slug: "mk8-rekomendasi",
  track: "Marketing Analytics",
  module: "Sistem Rekomendasi",
  title: "MK8 — Sistem Rekomendasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-bacaterus",
      eyebrow: "Langkah 1 · Cerita BacaTerus",
      title: "Widget \u201Cterlaris\u201D yang tidak diklik",
      prose: [
        "BacaTerus memasang widget \u201Cterlaris\u201D di homepage — CTR 0,3%. Semua orang melihat buku yang sama, tidak peduli selera. Lalu mereka mengganti dengan item-based collaborative filtering: \u201Cyang suka X juga suka Y\u201D. CTR naik ke 4,1% — 13x lipat.",
        "Collaborative filtering (CF) tidak peduli isi bukunya; ia peduli pola: orang dengan selera mirip kamu menyukai apa. \u201CTerlaris\u201D = rekomendasi untuk rata-rata orang — yang tidak ada.",
        "Lesson ini: cara kerja CF (cosine + weighted average), content-based, cold start, dan association rules.",
      ],
      tasks: [],
      reference: "CF = pola perilaku mirip. Personalisasi mengalahkan \u201Cterlaris\u201D.",
    },
    {
      id: "cosine-lab",
      eyebrow: "Langkah 2 · Cosine similarity & lab",
      title: "Kemiripan = cosinus sudut dua vektor",
      prose: [
        "Setiap user = vektor rating. Kemiripan dua user = cosine similarity: dot product dibagi perkalian panjang vektor. Nilai 1 = selera identik, 0 = tidak berhubungan.",
        "Prediksi rating Andi untuk buku Z = rata-rata tertimbang rating buku Z dari tetangganya, bobotnya = similarity. Worked example lesson lama: prediksi ≈ 4,5 — cukup yakin untuk ditampilkan di urutan teratas.",
        "Di lab ini kamu menghitung cosine similarity dua user dari nol. Rumusnya pendek; intuisi geometrinya yang penting: sudut kecil = selera mirip.",
      ],
      formula: String.raw`\text{cos}(a,b) = \frac{a \cdot b}{||a|| \times ||b||}`,
      formulaNote: "cos(a,b) = cosine similarity dua vektor: a·b = dot product (jumlah perkalian komponen seposisi); ||a|| dan ||b|| = panjang (norm) tiap vektor. Hasil 1 = sudut 0° (selera identik); 0 = tegak lurus (tidak berhubungan); −1 = berlawanan. Karena dibagi panjang vektor, user yang memberi rating tinggi ke semua tidak otomatis 'mirip' dengan semua orang.",
      tasks: [
        { id: "t1", text: "Hitung `dot`, `norm_a`, `norm_b`" },
        { id: "t2", text: "Hitung `cos_sim` = dot / (norm_a × norm_b), cetak" },
      ],
      expected: "cos_sim=0.97",
      hints: [
        "dot = sum(x*y for x, y in zip(a, b)).",
        "norm_a = sum(x*x for x in a) ** 0.5.",
        "cos_sim = dot / (norm_a * norm_b).",
      ],
      code: {
        starter: `# Rating [aksi, komedi, horor]\na = [5, 4, 1]\nb = [4, 5, 2]\n\n# TULIS KODEMU: cosine similarity\ndot =\nnorm_a =\nnorm_b =\ncos_sim =\n\nprint(f"cos_sim={cos_sim:.2f}")`,
        lockLines: 3,
        solution: `# Rating [aksi, komedi, horor]\na = [5, 4, 1]\nb = [4, 5, 2]\n\n# TULIS KODEMU: cosine similarity\ndot = sum(x * y for x, y in zip(a, b))\nnorm_a = sum(x * x for x in a) ** 0.5\nnorm_b = sum(x * x for x in b) ** 0.5\ncos_sim = dot / (norm_a * norm_b)\n\nprint(f"cos_sim={cos_sim:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dot", value: 42, tol: 1e-9, label: "`dot` seharusnya 42", msg: "5×4 + 4×5 + 1×2 = 42." },
          { kind: "equal", task: "t2", name: "cos_sim", value: 0.9661, tol: 0.01, label: "`cos_sim` sekitar 0,97", msg: "42 / (√42 × √45). Dua user ini seleranya mirip." },
          { kind: "stdout_matches", task: "t2", pattern: "cos_sim=0\\.97", label: "`print` menampilkan cos_sim", msg: "Format: cos_sim=... dengan 2 desimal." },
        ],
      },
      reference: "cos = dot/(|a||b|). Prediksi = rata-rata tertimbang by similarity.",
    },
    {
      id: "content-coldstart",
      eyebrow: "Langkah 3 · Content-based & cold start",
      title: "Rekomendasi dari isi, bukan dari orang",
      prose: [
        "Content-based: rekomendasikan item yang mirip dengan yang disukai user (genre, penulis, kata kunci). Tidak butuh user lain — cocok untuk item baru yang belum punya rating.",
        "Cold start = masalah item/user baru tanpa histori. Solusi standar: onboarding \u201Cpilih 3 genre favorit\u201D (seperti Netflix/Spotify), fallback ke populer-di-segmen, dan exploration (tampilkan sedikit item baru untuk kumpulkan sinyal).",
        "Praktik terbaik: hybrid. CF untuk user aktif kaya data, content-based untuk yang baru, aturan bisnis untuk momen khusus (promo, stok).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menunggu data terkumpul sebelum personalisasi jalan. Cold start harus dirancang sejak hari pertama — onboarding preferensi 30 detik mengalahkan 3 bulan menunggu data organik.",
        type: "pitfall",
      },
      reference: "Cold start: onboarding preferensi + fallback populer + exploration.",
    },
    {
      id: "assoc-lab",
      eyebrow: "Langkah 4 · Association rules & lab",
      title: "Support, confidence, lift — urut by lift",
      prose: [
        "Association rules untuk \u201Csering dibeli bersama\u201D: support = seberapa sering kombinasi muncul; confidence = P(B|A); lift = confidence / P(B) = seberapa lebih sering dari kebetulan.",
        "Worked example lesson lama: mie→telur support 24%, confidence 80%, lift 2,0 (aturan kuat). Jebakannya: mie→garam confidence tinggi tapi lift 1,06 — garam dibeli semua orang, jadi \u201Caturan\u201D-nya tidak informatif. Lift ≈ 1 = independen = buang.",
        "Aturan praktis: urutkan kandidat by lift, bukan by confidence. Confidence tinggi + lift ≈ 1 = fakta membosankan (\u201Cpembeli juga membeli udara\u201D).",
      ],
      formula: String.raw`\text{lift}(A \to B) = \frac{P(B \mid A)}{P(B)}`,
      formulaNote: "lift(A→B) = kekuatan aturan asosiasi: P(B|A) = confidence — peluang B dibeli jika A dibeli; P(B) = peluang B dibeli secara umum. Lift > 1 = A benar-benar menaikkan peluang B (sinyal); lift ≈ 1 = independen (tidak informatif, buang); lift < 1 = A menurunkan peluang B.",
      tasks: [
        { id: "t1", text: "Hitung `sup_ab`, `sup_a`, `sup_b` (proporsi transaksi)" },
        { id: "t2", text: "Hitung `conf` dan `lift`, cetak keduanya" },
      ],
      expected: "conf=0.75 lift=1.25",
      hints: [
        "sup_ab = transaksi yang memuat mie DAN telur dibagi total.",
        "conf = sup_ab / sup_a; lift = conf / sup_b.",
        "Gunakan any() atau in untuk cek keanggotaan.",
      ],
      code: {
        starter: `transaksi = [["mie","telur"],["mie","telur"],["mie","telur"],["mie"],["beras"]]\nn = len(transaksi)\n\n# TULIS KODEMU: support, confidence, lift untuk mie -> telur\nsup_ab =\nsup_a =\nsup_b =\nconf =\nlift =\n\nprint(f"conf={conf:.2f} lift={lift:.2f}")`,
        lockLines: 2,
        solution: `transaksi = [["mie","telur"],["mie","telur"],["mie","telur"],["mie"],["beras"]]\nn = len(transaksi)\n\n# TULIS KODEMU: support, confidence, lift untuk mie -> telur\nsup_ab = sum(1 for t in transaksi if "mie" in t and "telur" in t) / n\nsup_a = sum(1 for t in transaksi if "mie" in t) / n\nsup_b = sum(1 for t in transaksi if "telur" in t) / n\nconf = sup_ab / sup_a\nlift = conf / sup_b\n\nprint(f"conf={conf:.2f} lift={lift:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "conf", value: 0.75, tol: 1e-9, label: "`conf` seharusnya 0,75", msg: "(3/5) / (4/5) = 0,75." },
          { kind: "equal", task: "t2", name: "lift", value: 1.25, tol: 1e-9, label: "`lift` seharusnya 1,25", msg: "0,75 / 0,6 = 1,25. Di atas 1 = asosiasi positif." },
          { kind: "stdout_matches", task: "t2", pattern: "lift=1\\.25", label: "`print` menampilkan lift", msg: "Format: conf=... lift=... ." },
        ],
      },
      reference: "Urutkan aturan by lift. Lift ≈ 1 = independen, buang.",
    },
    {
      id: "netflix",
      eyebrow: "Langkah 5 · Netflix Prize",
      title: "Rp15 miliar untuk pelajaran ini",
      prose: [
        "Netflix Prize (2006–2009): hadiah Rp15 miliar untuk yang mengalahkan sistem mereka 10%. Pemenang menang dengan ensemble + fitur waktu — dan Netflix tidak pernah memakai solusinya (terlalu kompleks untuk production).",
        "Tiga pelajaran: (1) model terbaik ≠ model yang di-deploy — kompleksitas ada harganya; (2) fitur waktu (tren, musiman) sering mengalahkan algoritma eksotis; (3) dataset yang dirilis menyebabkan de-anonymization — privasi user bocor dari \u201Cdata anonim\u201D (MK18).",
        "Untuk tim marketing: kejar model yang cukup baik dan bisa di-maintain, bukan yang menang kompetisi. Uplift 4,1% CTR BacaTerus datang dari CF sederhana, bukan deep learning.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Data rating \u201Canonim\u201D bisa di-de-anonymize dengan data publik (kasus Netflix Prize). Jangan merilis dataset perilaku user tanpa teknik anonimisasi yang serius.",
        type: "risk",
      },
      reference: "Menang kompetisi ≠ layak production. Sederhana + maintainable menang.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Cosine similarity dua user = 0,97. Artinya?",
          options: [
            { text: "Selera sangat mirip — bagus jadi tetangga untuk prediksi", why: "Sudut kecil = vektor searah. Bobot besar di weighted average.", correct: true },
            { text: "Selera bertolak belakang", why: "Itu cosine negatif. 0,97 = sangat searah." },
            { text: "Tidak ada hubungan", why: "Itu cosine ≈ 0." },
          ],
        },
        {
          q: "Aturan A: confidence 90%, lift 1,02. Aturan B: confidence 60%, lift 2,5. Mana yang dipakai?",
          options: [
            { text: "B — lift tinggi = asosiasi nyata", why: "A: semua orang beli B anyway (independen). B: A benar-benar menaikkan peluang B.", correct: true },
            { text: "A — confidence lebih tinggi", why: "Jebakan mie→garam: confidence tinggi tapi tidak informatif." },
            { text: "Keduanya sama baik", why: "Lift 1,02 ≈ independen = tidak ada sinyal." },
          ],
        },
        {
          q: "User baru daftar, belum ada histori. Strategi?",
          options: [
            { text: "Onboarding pilih genre + fallback populer", why: "Cold start dirancang, bukan ditunggu. 30 detik onboarding > 3 bulan data kosong.", correct: true },
            { text: "Tampilkan acak saja", why: "Acak = pengalaman buruk + tidak mengumpulkan sinyal preferensi." },
            { text: "Tunggu 3 bulan sampai datanya cukup", why: "User pergi jauh sebelum itu." },
          ],
        },
      ],
    },
    {
      id: "adv-evaluasi",
      eyebrow: "Langkah 7 · Evaluasi",
      title: "Offline vs online: metrik yang menipu dan kebenaran yang mahal",
      prose: [
        "Evaluasi offline (precision@k, recall@k, NDCG di data historis) murah tetapi menipu: ia menghargai model yang memprediksi masa lalu — termasuk memprediksi item populer yang memang akan diklik tanpa rekomendasi. Model 'rekomendasikan yang terlaris' bisa menang offline dan gagal total online, persis seperti widget 0,3% BacaTerus.",
        "Kebenaran hanya ada online: A/B test dengan metrik bisnis (CTR, conversion, revenue per user). Tetapi online pun punya jebakan: position bias — item di posisi 1 diklik bukan karena relevan, melainkan karena terlihat. Solusi: randomisasi posisi kecil (interleaving) atau model yang memisahkan relevansi dari posisi.",
        "Protokol yang benar: saring kandidat secara offline (buang yang jelas buruk), tetapi keputusan deploy selalu dari A/B online dengan guardrail (tidak boleh menurunkan revenue per user). Tidak ada metrik offline yang menggantikan eksperimen.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Model A menang offline (NDCG tinggi) tetapi kalah di A/B online. Penjelasan paling mungkin?",
          options: [
            { text: "Offline menghargai prediksi masa lalu/populer — bukan nilai inkremental rekomendasi", why: "Metrik offline tidak tahu mana klik yang terjadi karena rekomendasi vs yang terjadi anyway.", correct: true },
            { text: "A/B test-nya yang salah", why: "Online adalah kebenaran bisnis; yang patut dicurigai justru metrik offline." },
            { text: "NDCG bukan metrik yang valid", why: "Valid untuk penyaringan, hanya bukan penentu deploy." },
            { text: "Data training kurang", why: "Bukan soal jumlah — soal apa yang diukur metriknya." },
          ],
        },
        {
          q: "Item posisi 1 CTR-nya 3x posisi 5. Apakah ia 3x lebih relevan?",
          options: [
            { text: "Belum tentu — position bias: terlihat duluan ikut menaikkan klik", why: "Klik = relevansi × keterlihatan. Tanpa koreksi posisi, CTR mengacaukan keduanya.", correct: true },
            { text: "Ya — CTR adalah relevansi", why: "Mengabaikan efek posisi yang terdokumentasi kuat." },
            { text: "Tidak — posisi tidak berpengaruh", why: "Berpengaruh besar; itulah kenapa ada slot premium." },
            { text: "Tergantung harinya", why: "Bukan soal hari — soal mekanisme keterlihatan." },
          ],
        },
      ],
      reference: "Offline untuk menyaring; online untuk memutuskan. Koreksi position bias.",
    },
    {
      id: "adv-exploration",
      eyebrow: "Langkah 8 · Exploration",
      title: "Sedikit keacakan yang disengaja: lawan filter bubble",
      prose: [
        "Rekomendasi murni eksploitasi ('beri yang mirip masa lalu') menciptakan filter bubble: user hanya melihat itu-itu saja, selera menyempit, dan sistem kehabisan sinyal untuk item baru. Solusinya: sisihkan 5–10% slot untuk exploration — item yang belum terbukti, dipilih acak atau by ketidakpastian model.",
        "Ini adalah logika multi-armed bandit: eksploitasi memaksimalkan hari ini, eksplorasi membeli informasi untuk hari esok. Tanpa eksplorasi, modelmu membeku di pemahaman tahun lalu tentang user — dan cold start item baru tidak pernah terselesaikan.",
        "Aturan bisnis melengkapi: jangan rekomendasikan yang stoknya habis, yang melanggar kebijakan, atau yang merusak margin — tidak peduli skornya. Rekomendasi adalah sistem bisnis, bukan sekadar model.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kenapa sisihkan 5–10% slot rekomendasi untuk exploration?",
          options: [
            { text: "Membeli informasi: sinyal untuk item baru + mencegah filter bubble", why: "Tanpa eksplorasi, sistem membeku dan item baru tidak pernah dapat kesempatan.", correct: true },
            { text: "Agar terlihat adil", why: "Bukan soal penampilan — soal informasi dan keberlanjutan sinyal." },
            { text: "Karena modelnya tidak dipercaya", why: "Terbalik: exploration justru membuat model makin baik dari waktu ke waktu." },
            { text: "Untuk menghemat komputasi", why: "Tidak berhubungan dengan komputasi." },
          ],
        },
      ],
      reference: "Eksploitasi untuk hari ini, eksplorasi untuk hari esok. Aturan bisnis di atas skor.",
    },
    {
      id: "intuisi-kebetulan",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Rekomendasi terbaik tidak terasa seperti rekomendasi",
      prose: [
        "User tidak pernah berkata 'wah, cosine similarity-nya tepat sekali'. Mereka berkata 'kok bisa pas banget'. Tiga heuristik menuju kesan itu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: rekomendasi yang bagus terasa seperti kebetulan yang menyenangkan — bukan seperti diawasi",
        body: "Heuristik pertama: personalisasi adalah soal relevansi, bukan soal kecanggihan. CF sederhana yang menaikkan CTR 0,3% ke 4,1% mengalahkan deep learning yang tidak pernah selesai di-deploy. Kejar model yang cukup baik dan bisa di-maintain — kompleksitas adalah utang yang dibayar tiap hari dalam debugging dan latency. Heuristik kedua: jangan pernah mengoptimalkan satu metrik buta. CTR tanpa guardrail menghasilkan clickbait: judul bombastis yang diklik lalu ditinggal — CTR naik, kepercayaan turun. Setiap metrik utama wajib ditemani guardrail (dwell time, return rate, revenue per user). Menangkan metrik dengan mengorbankan guardrail = kalah perang demi menang pertempuran. Heuristik ketiga: rancang untuk dingin sejak hari pertama. Setiap user baru dan item baru adalah cold start yang menunggu — onboarding preferensi 30 detik, fallback populer-di-segmen, dan slot exploration 5–10% bukan fitur tambahan, melainkan fondasi. Sistem yang hanya bekerja untuk user kaya data = sistem yang gagal untuk semua orang yang baru datang, yaitu semua pertumbuhanmu di masa depan.",
      },
      reference: "Cukup-baik + maintainable; guardrail selalu; rancang untuk cold start.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: rekomendasi yang menaikkan nilai, bukan sekadar klik",
      prose: [
        "Skenario satu — cold start (user atau produk baru): pakai content-based plus popularitas, bukan collaborative filtering. CF butuh riwayat — tanpanya ia menebak buta.",
        "Skenario dua — memilih metrik evaluasi: CTR saja menipu, seperti kasus BacaTerus. Pasang guardrail revenue dan margin sejak A/B test pertama.",
        "Skenario tiga — position bias: jangan bandingkan CTR posisi 1 vs 8 mentah-mentah. Normalisasi atau pakai interleaving — kalau tidak, sistem hanya belajar 'taruh yang murah di depan'.",
        "Skenario empat — exploration vs exploitation: sisakan persen traffic untuk eksplorasi produk baru. Sistem murni eksploitasi adalah kuburan katalog — yang laris makin laris, yang baru tak pernah terlihat.",
        "Skenario lima — kapan model sederhana cukup: association rules atau popularitas per segmen sering mengalahkan model deep yang mahal. Mulai dari yang sederhana, naik kelas bila buktinya ada.",
        "Aturan praktis 10 detik: metrik = nilai (revenue/margin), bukan klik? Guardrail terpasang? Ada slot eksplorasi? Sudah coba baseline sederhana dulu?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Merayakan CTR naik. CTR 4,1% dari klik buku murah di posisi 1 adalah vanity. Kemenangan rekomendasi diukur di kas — revenue per user — bukan di dashboard klik.",
      },
      reference: "Baseline sederhana → metrik nilai plus guardrail → atasi position bias → slot eksplorasi.",
    },
    {
      id: "minicase-bacaterus2",
      eyebrow: "Langkah 11 · Mini-case",
      title: "BacaTerus, bagian 2: CTR naik, revenue diam",
      prose: [
        "Setelah CF menaikkan CTR 0,3% → 4,1%, tim merayakan. Sebulan kemudian finance bertanya: revenue per user tidak bergerak. Investigasi: (a) 60% klik tambahan berasal dari posisi 1–2 (position bias) ke buku murah Rp15rb — CTR naik, nilai tidak; (b) tidak ada guardrail revenue di A/B test — kemenangan dideklarasikan dari CTR saja; (c) buku mahal (Rp120rb, margin tinggi) justru turun impresinya karena model mengoptimalkan probabilitas klik, bukan expected value.",
        "Pertanyaan: (1) Apa yang salah dari evaluasi 'CTR naik = sukses'? (2) Rancang ulang objective dan evaluasinya. (3) Peran exploration di sini?",
        "Pembahasan: (1) CTR tanpa guardrail = clickbait institusional. Yang diukur (klik) bukan yang diinginkan (nilai). (2) Objective baru: expected value per impresi = P(klik) × P(beli|klik) × margin — dan A/B dengan guardrail revenue per user + diversity. (3) Slot exploration memberi kesempatan ke buku margin-tinggi yang belum punya sinyal; tanpa itu model terjebak di buku murah yang 'aman'.",
      ],
      tasks: [],
      quiz: [
        {
          q: "BacaTerus: CTR 4,1% tetapi revenue per user diam. Diagnosis?",
          options: [
            { text: "Optimasi CTR tanpa guardrail — klik murah bervolume, nilai tidak ikut", why: "Yang diukur (klik) ≠ yang diinginkan (nilai). Position bias + buku murah menjelaskan semuanya.", correct: true },
            { text: "Model CF-nya rusak", why: "Model bekerja sesuai objective-nya; yang salah objective dan evaluasinya." },
            { text: "User tidak suka buku mahal", why: "Tidak ada bukti; impresi buku mahal justru diturunkan model." },
            { text: "Butuh deep learning", why: "Mengulang kesalahan Netflix Prize: kompleksitas bukan obat objective yang salah." },
          ],
        },
        {
          q: "Objective yang benar untuk kasus ini?",
          options: [
            { text: "Expected value per impresi = P(klik) × P(beli|klik) × margin, dengan guardrail revenue", why: "Menyeimbangkan klik, conversion, dan nilai — persis logika NBA di MK7.", correct: true },
            { text: "CTR setinggi mungkin", why: "Itu yang baru saja terbukti menyesatkan." },
            { text: "Jumlah buku yang direkomendasikan", why: "Volume tanpa nilai = kesibukan, bukan hasil." },
            { text: "Rating prediksi setinggi mungkin", why: "Rating tinggi ≠ dibeli; tidak terhubung ke revenue." },
          ],
        },
      ],
      reference: "Optimasi expected value, bukan klik. Guardrail revenue selalu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Rekomendasi yang baik = personal, bukan populer.",
      ],
      tasks: [],
      summary: [
        "Item-based CF: cosine similarity + weighted average (prediksi Andi ≈ 4,5).",
        "Content-based untuk item baru; cold start diatasi dengan onboarding preferensi.",
        "Association rules: urut by lift; lift ≈ 1 = independen = buang.",
        "Netflix Prize: model terbaik ≠ yang di-deploy; fitur waktu sering menang.",
        "\u201CData anonim\u201D rating bisa di-de-anonymize — hati-hati merilisnya.",
        "Offline (NDCG) untuk menyaring, A/B online untuk memutuskan; koreksi position bias.",
        "Sisihkan 5-10% slot untuk exploration; optimasi expected value, bukan klik.",
      ],
      next: { label: "MK9 — Eksperimen", href: "/v2/learn/mk9-eksperimen" },
      quiz: [
        {
          q: "Kenapa widget \u201Cterlaris\u201D CTR-nya hanya 0,3%?",
          options: [
            { text: "Satu rekomendasi untuk semua orang = tidak relevan untuk hampir semua orang", why: "Rata-rata orang tidak ada. Personalisasi 13x lipat membuktikannya.", correct: true },
            { text: "Posisi widget kurang strategis", why: "Widget yang sama dengan CF naik ke 4,1% — masalahnya isi, bukan posisi." },
            { text: "User tidak suka rekomendasi", why: "Mereka suka — buktinya CTR 4,1% setelah personalisasi." },
          ],
        },
        {
          q: "Prediksi rating memakai weighted average by similarity. Kenapa dibobot?",
          options: [
            { text: "Tetangga yang lebih mirip harus berpengaruh lebih besar", why: "User dengan cosine 0,97 lebih dipercaya dari 0,3.", correct: true },
            { text: "Agar rumusnya terlihat canggih", why: "Bukan kosmetik — bobot mengubah hasil." },
            { text: "Rata-rata biasa sudah cukup", why: "Rata-rata biasa menyamakan tetangga dekat dan jauh — kurang akurat." },
          ],
        },
        {
          q: "Kapan content-based lebih tepat dari collaborative filtering?",
          options: [
            { text: "Item baru tanpa histori rating", why: "CF butuh interaksi; content-based butuh atribut item — yang tersedia sejak lahir.", correct: true },
            { text: "Selalu — lebih sederhana", why: "CF biasanya lebih akurat untuk user aktif kaya data." },
            { text: "Tidak pernah", why: "Cold start item adalah kasus nyatanya." },
          ],
        },
        {
          q: "Pelajaran utama Netflix Prize untuk praktisi?",
          options: [
            { text: "Kejar model yang cukup baik + maintainable, bukan yang paling canggih", why: "Pemenang tidak di-deploy Netflix. Kompleksitas ada harganya.", correct: true },
            { text: "Selalu pakai ensemble terbesar", why: "Ensemble pemenang justru terlalu kompleks untuk production." },
            { text: "Kompetisi tidak berguna", why: "Berguna untuk riset; pelajarannya soal trade-off production." },
          ],
        },
        {
          q: "mie→telur lift 2,0 vs mie→garam lift 1,06. Keputusan bundling?",
          options: [
            { text: "Bundel mie+telur; abaikan \u201Caturan\u201D mie→garam", why: "Lift 2,0 = sinyal nyata. 1,06 = independen, bukan insight.", correct: true },
            { text: "Bundel keduanya — confidence garam tinggi", why: "Jebakan confidence: garam dibeli semua orang anyway." },
            { text: "Tidak ada yang layak", why: "Lift 2,0 dengan support 24% = aturan kuat dan umum." },
          ],
        },
      ],
    },
  ],
};

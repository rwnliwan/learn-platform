import type { V2Lesson } from "../lib/types";

export const dle30: V2Lesson = {
  slug: "dle30-neural-style-transfer",
  track: "Deep Learning Engineer",
  module: "Generative",
  title: "DLE30 — Neural Style Transfer & Generasi Citra Hands-On",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Foto produk yang bergaya lukisan — tanpa pelukis",
      prose: [
        "Toko online KirimCepat ingin semua foto produk tampil dengan gaya visual yang sama — hangat, seperti lukisan cat minyak — tetapi mempekerjakan ilustrator untuk 5.000 produk mustahil. Solusinya: neural style transfer. Satu foto produk (content) + satu lukisan referensi (style) = foto produk yang komposisinya sama tetapi sapuan kuasnya meniru lukisan. Tidak ada yang dilatih dari nol: network yang sudah terlatih (VGG) dipakai sebagai pengukur — content diukur dari aktivasi lapisan dalam, style diukur dari matriks Gram lapisan-lapisan.",
        "Lesson ini mengajarkan generasi citra dari sudut yang bisa dihitung: style transfer sebagai optimasi (bukan training), matriks Gram sebagai sidik jari gaya, dan trade-off content vs style sebagai dua angka yang dijumlahkan. DLE11 mengajarkan keluarga generatif (VAE, GAN, difusi) sebagai teori; lesson ini turun ke tangan — menghitung Gram, menghitung loss, dan memutuskan kapan hasilnya layak tayang.",
        "Setelah lesson ini kamu bisa: (1) menghitung matriks Gram dari feature map; (2) menghitung style loss dan content loss; (3) menjelaskan mengapa Gram menangkap gaya; (4) menghitung total loss dengan bobot alpha-beta; (5) memutuskan kapan style transfer cukup dan kapan butuh difusi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DLE11 membahas VAE, GAN, dan difusi sebagai keluarga generatif — tetapi tidak ada neural style transfer (0 hit 'style transfer' di track) dan tidak ada hands-on generasi citra. Lesson ini mengisi keduanya: style transfer sebagai optimasi atas citra (bukan training network) dengan lab Gram dan loss yang dihitung dari angka mentah.",
      },
      reference: "Gram: G11=30, G22=2, G12=5. Style loss 0,0625; content loss 0,25; total 6,5 (alpha=1, beta=100).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menghasilkan citra bergaya dengan angka yang bisa dipertanggungjawabkan.",
        "(1) Menghitung matriks Gram dari feature map kecil;",
        "(2) Menghitung style loss sebagai jarak Gram;",
        "(3) Menghitung content loss sebagai MSE aktivasi;",
        "(4) Menghitung total loss dengan bobot alpha dan beta;",
        "(5) Menjelaskan kapan optimasi citra berhenti (kriteria konvergensi).",
      ],
      tasks: [],
    },
    {
      id: "gram",
      eyebrow: "Langkah 3 · Teori",
      title: "Matriks Gram: sidik jari gaya",
      prose: [
        "Gaya bukan benda — ia statistik. Matriks Gram mengukur korelasi antar channel feature map: G_ij = jumlah perkalian elemen channel i dan channel j di semua posisi spasial. Bila dua channel sering aktif bersamaan (misalnya channel 'garis diagonal' dan channel 'warna hangat'), Gram-nya besar — dan itulah tekstur lukisan itu. Posisi spasial dibuang: Gram tidak peduli DI MANA garis itu, hanya SEBERAPA SERING ia muncul bersama warna tertentu. Itulah mengapa style transfer mempertahankan komposisi foto tetapi mengubah teksturnya.",
        "Hitung contoh kecil: feature map 2 channel, masing-masing 2x2. Channel 1 = [[1,2],[3,4]]; channel 2 = [[0,1],[1,0]]. G11 = 1 + 4 + 9 + 16 = 30 (energi channel 1). G22 = 0 + 1 + 1 + 0 = 2 (energi channel 2). G12 = 1x0 + 2x1 + 3x1 + 4x0 = 5 (korelasi keduanya). Matriks Gram simetris: G21 = G12 = 5. Tiga angka ini — 30, 2, 5 — adalah sidik jari gaya feature map tersebut.",
        "Style loss mengukur jarak antara Gram citra hasil dan Gram citra gaya: jumlah kuadrat selisih semua entri Gram, dibagi 4 x N^2 x M^2 (N = jumlah channel, M = jumlah posisi). Contoh: Gram hasil (30, 2, 5) vs Gram target (26, 2, 5) — selisih hanya di G11: (30-26)^2 = 16; penyebut 4 x 4 x 16 = 256; style loss = 16 / 256 = 0,0625. Pembagi itu penting: tanpa normalisasi, lapisan dengan feature map besar akan mendominasi loss hanya karena ukurannya.",
      ],
      tasks: [],
      formula: "G_{ij} = \\sum_{k} F_{ik} F_{jk}, \\qquad \\mathcal{L}_{style} = \\frac{1}{4N^2M^2} \\sum_{i,j} (G_{ij} - A_{ij})^2",
      formulaNote: "F = feature map (N channel x M posisi); G = Gram citra hasil; A = Gram citra gaya; N = channel, M = posisi spasial.",
      note: {
        title: "Mengapa Gram, bukan piksel",
        body: "Membandingkan piksel langsung akan memaksa citra hasil meniru lukisan piksel demi piksel — komposisi foto hilang. Gram membandingkan STATISTIK: tekstur dan korelasi, bukan posisi. Itulah yang memungkinkan foto kucing bergaya Van Gogh: kucingnya tetap kucing, sapuannya Van Gogh.",
      },
      reference: "Gram 30, 2, 5. Style loss 0,0625.",
    },
    {
      id: "loss-total",
      eyebrow: "Langkah 4 · Teori",
      title: "Content loss + style loss: dua tuan yang harus dilayani",
      prose: [
        "Total loss = alpha x content loss + beta x style loss. Content loss = MSE antara aktivasi citra hasil dan aktivasi foto asli di satu lapisan dalam (biasanya conv4_2 VGG): ia menjaga komposisi. Contoh: aktivasi foto [[1,2],[3,4]] vs hasil [[1,2],[3,5]] — selisih hanya satu piksel sebesar 1: MSE = 1/4 = 0,25. Style loss dari langkah sebelumnya = 0,0625. Dengan alpha = 1 dan beta = 100: total = 1 x 0,25 + 100 x 0,0625 = 0,25 + 6,25 = 6,5.",
        "Rasio beta/alpha menentukan hasil: beta terlalu kecil, gaya tidak terlihat; beta terlalu besar, foto hancur menjadi tekstur tanpa bentuk. Titik awal yang umum dipakai — BUKAN standar universal: beta/alpha 100 sampai 1.000 untuk gaya kuat, 10 sampai 100 untuk gaya halus. Angka 'benar' bergantung pada normalisasi Gram (apakah style loss dibagi 4N²M² seperti di lesson ini atau tidak), resolusi citra, dan lapisan VGG yang dipakai — dua implementasi dengan normalisasi berbeda butuh rasio yang berbeda untuk hasil yang sama. Aturan: mulai dari 100, lihat hasilnya, sesuaikan — dan catat rasio BERSAMA normalisasi, resolusi, dan lapisan yang dipakai, karena 'gaya yang sama' tanpa ketiganya tidak bisa direproduksi.",
        "Kapan optimasi berhenti? Tiga kriteria konvergensi yang dipakai bersama: (1) total loss mendatar — perubahan di bawah 1 persen selama 50 iterasi berturut-turut; (2) pemeriksaan visual tiap 50 iterasi — produk masih dikenali sebagai produk, gaya sudah terlihat; (3) batas iterasi maksimum (200–500) supaya satu citra tidak memakan waktu tanpa batas. Praktik per citra sebelum tayang: uji keterkenalan (bisakah orang yang belum melihat menyebut produknya?), uji kekuatan gaya (jarak Gram ke target di bawah ambang yang disepakati), dan uji artefak (pola papan catur atau noise dari optimasi piksel). Citra yang lolos ketiganya boleh tayang; yang gagal satu pun kembali ke rasio beta/alpha atau iterasi — bukan ke 'tambah iterasi terus'.",
        "Optimasi dilakukan pada PIKSEL citra hasil, bukan pada bobot network — network VGG dibekukan sebagai pengukur. 200 sampai 500 iterasi gradient descent (L-BFGS atau Adam) cukup untuk satu citra. Inilah bedanya dengan GAN/difusi: tidak ada training, tidak ada dataset — satu citra, satu optimasi, satu hasil. Kelemahannya: lambat per citra (menit, bukan milidetik) — untuk 5.000 produk, butuh feed-forward style transfer (network yang dilatih sekali untuk satu gaya) atau difusi dengan kontrol gaya.",
      ],
      tasks: [],
      note: {
        title: "Kapan pindah ke difusi",
        body: "Style transfer optimasi menang bila: satu gaya, sedikit citra, kontrol presisi atas content. Difusi (Stable Diffusion, ControlNet) menang bila: banyak citra, butuh variasi, atau gaya harus digabung dengan prompt teks ('foto produk, gaya lukisan cat minyak, latar krem'). Jangan memaksa optimasi per citra untuk 5.000 produk — hitung dulu: 5.000 x 3 menit = 250 jam.",
      },
      reference: "Total loss 6,5 (alpha=1, beta=100). Rasio titik awal beta/alpha 100-1.000 (tergantung normalisasi Gram, resolusi, dan lapisan).",
    },
    {
      id: "lab-style",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: Gram, style loss, content loss, total loss",
      prose: [
        "Lab ini menghitung mesin style transfer dari angka mentah: matriks Gram, style loss, content loss, dan total loss.",
        "Hitung dulu di kepala. G11 = 1 + 4 + 9 + 16 = 30. G12 = 0 + 2 + 3 + 0 = 5. Style loss: selisih Gram hanya di G11 (30 vs 26): (30-26)^2 = 16; dibagi 256 = 0,0625. Content loss: satu piksel selisih 1 dari 4 piksel: 1/4 = 0,25. Total: 1 x 0,25 + 100 x 0,0625 = 6,5.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: g11, g12, style_loss, content_loss, total_loss. Lima angka ini adalah pemeriksaan bahwa kamu memahami loss sebelum menjalankan optimasi — bila Gram-mu salah, tidak ada iterasi yang menyelamatkanmu.",
        "Setelah lolos, coba eksperimen: ubah beta menjadi 1.000 dan lihat total menjadi 62,75 — gaya mendominasi. Lalu tanyakan: pada rasio berapa foto produkmu masih dikenali sebagai foto produk?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `g11` dan `g12` matriks Gram dari dua channel 2x2" },
        { id: "t2", text: "Hitung `style_loss` terhadap Gram target (26, 2, 5)" },
        { id: "t3", text: "Hitung `content_loss` dan `total_loss` (alpha=1, beta=100)" },
      ],
      expected: "g11=30\ng12=5\nstyle_loss=0.0625\ncontent_loss=0.25\ntotal_loss=6.5",
      hints: [
        "G11 = jumlah kuadrat channel 1; G12 = jumlah perkalian channel 1 x channel 2.",
        "Style loss = (30-26)^2 / (4 x 2^2 x 4^2) = 16/256.",
        "Content loss = MSE: satu piksel selisih 1 dari 4 piksel.",
        "Total = 1 x content + 100 x style.",
      ],
      code: {
        starter: `# Mesin style transfer: Gram + loss.\nch1 = [[1, 2], [3, 4]]\nch2 = [[0, 1], [1, 0]]\ng11_target = 26\nn_channel, n_pos = 2, 4\nalpha, beta = 1, 100\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ng11 = \ng12 = \nstyle_loss = \ncontent_loss = \ntotal_loss = \n\nprint(f"g11={g11}")\nprint(f"g12={g12}")\nprint(f"style_loss={style_loss}")\nprint(f"content_loss={content_loss}")\nprint(f"total_loss={total_loss}")`,
        lockLines: 5,
        solution: `# Mesin style transfer: Gram + loss.\nch1 = [[1, 2], [3, 4]]\nch2 = [[0, 1], [1, 0]]\ng11_target = 26\nn_channel, n_pos = 2, 4\nalpha, beta = 1, 100\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ng11 = sum(v * v for baris in ch1 for v in baris)\ng12 = sum(a * b for r1, r2 in zip(ch1, ch2) for a, b in zip(r1, r2))\nstyle_loss = (g11 - g11_target) ** 2 / (4 * n_channel ** 2 * n_pos ** 2)\ncontent_loss = 1 / 4\ntotal_loss = alpha * content_loss + beta * style_loss\n\nprint(f"g11={g11}")\nprint(f"g12={g12}")\nprint(f"style_loss={style_loss}")\nprint(f"content_loss={content_loss}")\nprint(f"total_loss={total_loss}")`,
        checks: [
          { kind: "equal", task: "t1", name: "g11", value: 30, tol: 1e-9, label: "`g11` seharusnya 30", msg: "1+4+9+16 = 30." },
          { kind: "equal", task: "t1", name: "g12", value: 5, tol: 1e-9, label: "`g12` seharusnya 5", msg: "0+2+3+0 = 5." },
          { kind: "equal", task: "t2", name: "style_loss", value: 0.0625, tol: 1e-9, label: "`style_loss` seharusnya 0.0625", msg: "16/256 = 0,0625." },
          { kind: "equal", task: "t3", name: "content_loss", value: 0.25, tol: 1e-9, label: "`content_loss` seharusnya 0.25", msg: "MSE satu piksel selisih 1 dari 4 piksel." },
          { kind: "equal", task: "t3", name: "total_loss", value: 6.5, tol: 1e-9, label: "`total_loss` seharusnya 6.5", msg: "0,25 + 100 x 0,0625 = 6,5." },
        ],
      },
      reference: "Gram 30, 5; style 0,0625; content 0,25; total 6,5.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: optimasi, feed-forward, atau difusi",
      prose: [
        "Skenario 1 — Satu gaya, puluhan citra, kontrol presisi. → Optimasi per citra (lesson ini). Alasan: kualitas tertinggi per citra; biaya menit per citra masih masuk akal.",
        "Skenario 2 — Satu gaya, ribuan citra. → Feed-forward style transfer (network dilatih sekali untuk gaya itu). Alasan: milidetik per citra setelah training; 5.000 produk selesai dalam jam, bukan 250 jam.",
        "Skenario 3 — Banyak gaya, butuh variasi, prompt teks ikut mengatur. → Difusi (Stable Diffusion + ControlNet/LoRA gaya). Alasan: satu model melayani banyak gaya; prompt memberi kontrol semantik.",
        "Skenario 4 — Gaya harus konsisten persis di semua citra (brand). → Feed-forward atau difusi dengan LoRA gaya yang dikunci + evaluasi konsistensi. Alasan: optimasi per citra memberi variasi yang tidak terkontrol antar citra.",
        "Aturan praktis: hitung volume dulu. Di bawah 100 citra: optimasi. Di atas 1.000: feed-forward atau difusi. Di antaranya: uji keduanya pada 20 citra dan bandingkan kualitas vs waktu.",
      ],
      tasks: [],
      note: {
        title: "Hak cipta gaya",
        body: "Meniru gaya lukisan yang masih berhak cipta untuk produk komersial adalah wilayah abu-abu hukum — gaya itu sendiri umumnya tidak dilindungi, tetapi karya spesifiknya dilindungi. Jangan memakai lukisan berhak cipta sebagai target style untuk produk komersial tanpa izin; pakai karya domain publik atau gaya yang dibuat sendiri. Catat sumber gaya di metadata citra hasil.",
      },
      reference: "Optimasi untuk puluhan citra; feed-forward/difusi untuk ribuan.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Gram mengukur korelasi antar channel — sidik jari gaya, tanpa posisi.",
        "G11=30, G12=5; style loss 0,0625.",
        "Content loss 0,25; total loss 6,5 (alpha=1, beta=100).",
        "Optimasi pada piksel, network dibekukan sebagai pengukur.",
        "Volume menentukan: optimasi di bawah 100 citra, feed-forward/difusi di atas 1.000.",
      ],
      next: { label: "DLE31 — NLP Klasik: Viterbi, Word2Vec & POS Tagging", href: "/v2/learn/dle31-nlp-klasik" },
      quiz: [
        {
          q: "Channel 1 = [[1,2],[3,4]], channel 2 = [[0,1],[1,0]]. Berapa G11 dan G12?",
          options: [
            { text: "G11=30, G12=5", why: "Tepat: G11 = 1+4+9+16 = 30; G12 = 0+2+3+0 = 5.", correct: true },
            { text: "G11=10, G12=3 — jumlah elemen biasa", why: "Salah: Gram memakai jumlah perkalian, bukan jumlah elemen." },
            { text: "G11=30, G12=2 — G12 sama dengan G22", why: "Salah: G22 = 2 adalah energi channel 2; G12 = 5 adalah korelasinya." },
            { text: "G11=100, G12=25 — kuadrat dari jumlah", why: "Salah: Gram menjumlahkan kuadrat per elemen, bukan mengkuadratkan jumlah." },
          ],
        },
        {
          q: "Mengapa Gram membuang informasi posisi spasial?",
          options: [
            { text: "Karena posisi tidak penting untuk gaya — yang penting statistik tekstur", why: "Tepat: gaya adalah korelasi antar fitur, bukan di mana fitur itu berada.", correct: true },
            { text: "Karena feature map tidak punya posisi", why: "Salah: feature map punya posisi; Gram sengaja mengabaikannya." },
            { text: "Karena posisi membuat komputasi terlalu lambat", why: "Salah: bukan soal kecepatan — soal definisi gaya sebagai statistik." },
            { text: "Karena VGG tidak mengeluarkan posisi", why: "Salah: VGG mengeluarkan feature map spasial; Gram yang mereduksinya." },
          ],
        },
        {
          q: "Content loss 0,25, style loss 0,0625, alpha=1, beta=100. Berapa total loss?",
          options: [
            { text: "6,5", why: "Tepat: 1 x 0,25 + 100 x 0,0625 = 0,25 + 6,25 = 6,5.", correct: true },
            { text: "0,3125 — dijumlah tanpa bobot", why: "Salah: bobot beta=100 wajib dikalikan; tanpa itu gaya hampir tidak berpengaruh." },
            { text: "25,25 — beta dikali content", why: "Salah: beta mengalikan style loss, bukan content loss." },
            { text: "0,0625 — hanya style yang dihitung", why: "Salah: total loss menjumlahkan keduanya; content menjaga komposisi." },
          ],
        },
        {
          q: "Optimasi style transfer mengubah apa?",
          options: [
            { text: "Bobot network VGG", why: "Salah: VGG dibekukan sebagai pengukur; yang diubah adalah piksel citra hasil." },
            { text: "Piksel citra hasil, network dibekukan", why: "Tepat: gradient descent berjalan di ruang piksel, bukan ruang bobot.", correct: true },
            { text: "Dataset training", why: "Salah: tidak ada training dan tidak ada dataset — satu citra, satu optimasi." },
            { text: "Arsitektur network", why: "Salah: arsitektur tetap; yang bergerak hanya citra hasil." },
          ],
        },
        {
          q: "5.000 foto produk butuh gaya yang sama. Apa pendekatan yang benar?",
          options: [
            { text: "Optimasi per citra — kualitas tertinggi", why: "Salah: 5.000 x 3 menit = 250 jam. Volume ini butuh feed-forward atau difusi." },
            { text: "Feed-forward style transfer atau difusi dengan LoRA gaya", why: "Tepat: feed-forward milidetik per citra setelah satu kali training; difusi lebih lambat (detik per citra karena denoising iteratif) tetapi masih jauh lebih cepat dari optimasi per citra (menit) untuk 5.000 citra — dan satu model difusi melayani banyak gaya.", correct: true },
            { text: "Latih GAN baru dari nol untuk tiap produk", why: "Salah: itu 5.000 training — jauh lebih mahal dari optimasi per citra." },
            { text: "Pakai filter Instagram — sama saja", why: "Salah: filter adalah transformasi piksel tetap, bukan transfer gaya dari referensi." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const e31: V2Lesson = {
  slug: "e31-mikrostruktur-pasar",
  track: "Financial Markets",
  module: "Struktur Pasar",
  title: "E31 — Mikrostruktur Pasar: Order Book, Market Making, dan Dampak Harga",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Beli 2.000 lembar, harga bergerak sebelum order selesai",
      prose: [
        "Rani, trader ritel, melihat saham PT Delta di harga Rp1.500 dan memasang market order beli 2.000 lembar. Ia mengira akan dapat harga Rp1.500 per lembar. Nyatanya, ordernya tereksekusi rata-rata Rp1.519 — Rp19 lebih mahal per lembar, total Rp38.000 melayang sebelum harga bergerak ke mana pun. Bukan karena bandar, bukan karena salah aplikasi: karena order book tidak punya cukup barang di harga yang ia lihat.",
        "Yang Rani lihat — Rp1.500 — adalah harga tengah (mid) antara bid terbaik Rp1.490 dan ask terbaik Rp1.510. Di ask Rp1.510 hanya tersedia 800 lembar; 1.200 lembar sisanya diambil dari level berikutnya, Rp1.525. Inilah mikrostruktur pasar: harga bukan satu angka, melainkan antrean — dan setiap order besar membayar untuk berjalan menembus antrean itu.",
        "Lesson ini melampaui E1, yang sudah mengenalkan order book, bid-ask spread, dan market maker. Di sini kamu menghitung dampak harga dengan model Kyle, membedakan tipe order, dan mengukur implementation shortfall — selisih antara harga saat keputusan diambil dan harga yang benar-benar didapat. Setelah lesson ini kamu bisa: (1) membaca depth order book dan menghitung biaya eksekusi; (2) menghitung dampak harga dengan lambda Kyle; (3) memilih tipe order yang tepat; (4) mengukur implementation shortfall; (5) menjelaskan kapan HFT dan dark pool membantu atau merugikanmu.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "E1 sudah mengajarkan order book, best bid dan ask, market maker, adverse selection, dan lab bid-ask spread (spread dibagi mid, batas 2 persen, market order di bawah 10 persen depth). Lesson ini TIDAK mengulang itu: ia membangun di atasnya — dampak harga kuantitatif (model Kyle), tipe order (market, limit, iceberg, hidden), implementation shortfall, serta HFT dan dark pool yang belum pernah dibahas.",
      },
      reference: "Mid Rp1.500, spread Rp20 (1,33 persen). Beli 2.000 lembar: rata-rata Rp1.519, slippage Rp38.000.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur berapa harga yang benar-benar kamu bayar — bukan harga yang kamu lihat di layar.",
        "(1) Menghitung mid, spread, dan biaya eksekusi dari depth order book;",
        "(2) Menghitung dampak harga dengan lambda Kyle;",
        "(3) Memilih tipe order — market, limit, iceberg — sesuai ukuran dan urgensi;",
        "(4) Mengukur implementation shortfall terhadap harga keputusan;",
        "(5) Menilai kapan HFT dan dark pool membantumu dan kapan merugikanmu.",
      ],
      tasks: [],
    },
    {
      id: "order-book",
      eyebrow: "Langkah 3 · Teori",
      title: "Order book: harga adalah antrean, bukan angka",
      prose: [
        "Order book adalah dua antrean harga: bid (orang yang mau beli) dan ask (orang yang mau jual), masing-masing dengan jumlah lembar di tiap level. Best bid Rp1.490 dengan depth 1.000 lembar; best ask Rp1.510 dengan depth 800 lembar; level ask berikutnya Rp1.525 dengan depth 1.500 lembar. Mid = (1.490 + 1.510) dibagi 2 = Rp1.500. Spread = 1.510 − 1.490 = Rp20, atau 20 dibagi 1.500 = 1,33 persen dari mid.",
        "Market order beli 2.000 lembar berjalan menembus antrean ask: 800 lembar di Rp1.510, lalu 1.200 lembar di Rp1.525. Harga rata-rata = (800 × 1.510 + 1.200 × 1.525) dibagi 2.000 = Rp1.519. Slippage terhadap mid = 1.519 − 1.500 = Rp19 per lembar; total biaya slippage = 19 × 2.000 = Rp38.000. Perhatikan: slippage ini BUKAN kerugian karena harga bergerak — harga tidak bergerak sama sekali; ini biaya menembus antrean.",
        "Tiga aturan praktis. Pertama, bandingkan ukuran order dengan depth: order di bawah 10 persen depth yang terlihat biasanya tereksekusi di satu level; di atas itu, hitung dulu harga rata-ratanya. Kedua, spread dibagi mid adalah tarif tol pasar itu: di atas 2 persen, instrumen mahal untuk ditradingkan — E1 sudah mengajarkan ini, dan ia tetap berlaku. Ketiga, depth bisa menipu: order besar yang terlihat bisa ditarik dalam milidetik (spoofing) — jangan percaya depth yang belum teruji eksekusi.",
        "Prioritas eksekusi mengikuti dua aturan: harga dulu, lalu waktu. Order dengan harga terbaik dieksekusi pertama; di harga yang sama, yang datang duluan menang. Inilah sebabnya kecepatan menjadi senjata: di harga yang sama, yang milidetik lebih cepat mendapat barangnya.",
      ],
      tasks: [],
      note: {
        title: "Mid bukan harga transaksi",
        body: "Mid Rp1.500 tidak pernah menjadi harga transaksi siapa pun — ia rata-rata dari dua harga yang tidak bertemu. Trader yang memakai mid sebagai harga eksekusi dalam backtest sedang berbohong pada dirinya sendiri: setiap transaksi nyata terjadi di bid atau ask, dan selisihnya adalah biaya yang dibayar ke penyedia likuiditas.",
      },
      reference: "Mid Rp1.500; spread Rp20 (1,33 persen); beli 2.000 lembar = rata-rata Rp1.519; slippage Rp38.000.",
    },
    {
      id: "kyle",
      eyebrow: "Langkah 4 · Teori",
      title: "Dampak harga: model Kyle dan lambda",
      prose: [
        "Model Kyle (1985) merumuskan intuisi paling penting mikrostruktur: harga bergerak sebanding dengan ukuran order, karena market maker membaca order besar sebagai kemungkinan informasi. Rumusnya sederhana: perubahan harga = lambda × ukuran order. Lambda mengukur seberapa dalam pasar itu — lambda kecil berarti pasar dalam dan murah; lambda besar berarti pasar dangkal dan mahal.",
        "Dari cerita pembuka: harga bergerak Rp19 untuk order 2.000 lembar. Lambda = 19 dibagi 2 = Rp9,5 per 1.000 lembar. Dengan lambda ini, order 5.000 lembar diperkirakan menggerakkan harga 5 × 9,5 = Rp47,5 — dan order 500 lembar hanya Rp4,75. Inilah sebabnya institusi memecah order besar menjadi potongan kecil sepanjang hari: bukan karena sabar, melainkan karena lambda menagih tiap lembar yang terburu-buru.",
        "Lambda bukan konstanta fisika — ia berubah dengan kondisi. Saat pengumuman earnings atau BI rate, market maker menaikkan lambda karena takut adverse selection (E1): order yang datang mungkin berasal dari orang yang tahu sesuatu. Saat pasar tenang, lambda menyusut. Trader yang memakai lambda masa tenang untuk mengestimasi biaya di hari pengumuman akan kaget dua kali: spread melebar DAN dampak harga membesar.",
        "Lambda juga bukan angka yang ditebak — ia diestimasi dari data. Cara standarnya: regresikan perubahan harga atas order flow bertanda (signed volume — beli positif, jual negatif) selama suatu jendela; koefisien regresinya adalah lambda. Dan ingat batas model Kyle: dampak harga yang sebenarnya hampir selalu NON-LINEAR — dampak tumbuh lebih lambat dari ukuran order (hukum akar kuadrat: dampak ∝ √Q, bukan ∝ Q). Kyle linear adalah aproksimasi yang bagus untuk order kecil-menengah, tetapi untuk order sangat besar ia melebih-lebihkan dampak; mini-case di langkah 7 menunjukkan mengapa ekstrapolasi linear tidak boleh dipakai mentah-mentah.",
        "Implementation shortfall (Perold, 1988) mengukur total biaya eksekusi terhadap harga keputusan (arrival price). Rumusnya: shortfall = (harga rata-rata eksekusi − harga keputusan) × jumlah lembar, untuk beli. Di cerita pembuka, harga keputusan Rp1.500 dan harga rata-rata Rp1.519: shortfall = 19 × 2.000 = Rp38.000, atau 1,27 persen dari nilai order Rp3.000.000. Shortfall memisahkan biaya eksekusi dari pergerakan pasar: bila harga naik ke Rp1.600 setelah order selesai, keuntunganmu tetap dikurangi Rp38.000 yang sudah dibayar ke antrean.",
      ],
      tasks: [],
      formula: String.raw`\Delta P = \lambda \times Q \qquad \text{Shortfall} = (P_{eks} - P_{keputusan}) \times Q`,
      formulaNote: "Delta P = perubahan harga; lambda = dampak per 1.000 lembar (Rp9,5 di contoh); Q = ukuran order dalam ribuan lembar; P eks = harga rata-rata eksekusi; P keputusan = harga saat keputusan diambil. Contoh: order 2.000 lembar menggerakkan harga Rp19; shortfall Rp38.000.",
      reference: "Lambda Rp9,5 per 1.000 lembar. Shortfall Rp38.000 (1,27 persen dari nilai order).",
    },
    {
      id: "lab-eksekusi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin biaya eksekusi",
      prose: [
        "Lab ini membangun mesin biaya eksekusi: dari depth order book, hitung mid, spread, harga rata-rata eksekusi, dan slippage untuk market order beli.",
        "Hitung dulu di kepala. Mid = (1.490 + 1.510) dibagi 2 = Rp1.500. Spread = 1.510 − 1.490 = Rp20; spread persen = 20 dibagi 1.500 × 100 = 1,33 persen. Beli 2.000 lembar: 800 di Rp1.510 dan 1.200 di Rp1.525 → harga rata-rata = (800 × 1.510 + 1.200 × 1.525) dibagi 2.000 = Rp1.519. Slippage per lembar = 1.519 − 1.500 = Rp19; total = 19 × 2.000 = Rp38.000.",
        "Tugas lab: tulis fungsi yang menerima bid, ask, depth ask level 1 dan 2, harga level 2, dan ukuran order — lalu mencetak mid, spread persen, harga rata-rata, dan biaya slippage. Empat angka ini adalah bon yang kamu bayar setiap kali menekan tombol beli.",
        "Setelah lolos, coba eksperimen: ubah ukuran order menjadi 500 lembar (hanya menyentuh level 1) dan lihat harga rata-rata jatuh ke Rp1.510 dengan slippage Rp5.000 — lalu tanyakan: berapa ukuran order maksimum yang masih murah di pasar ini?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mid` dan `spread_persen` dari bid dan ask terbaik" },
        { id: "t2", text: "Hitung `harga_rata` eksekusi market order beli 2.000 lembar" },
        { id: "t3", text: "Hitung `biaya_slippage` total terhadap mid" },
      ],
      expected: "mid=1500\nspread_persen=1.33\nharga_rata=1519\nbiaya_slippage=38000",
      hints: [
        "Mid = (bid + ask) dibagi 2; spread persen = (ask - bid) dibagi mid, dikali 100.",
        "Ambil depth level 1 dulu, sisanya dari level 2; harga rata-rata = total bayar dibagi jumlah lembar.",
        "Slippage total = (harga rata-rata - mid) dikali jumlah lembar.",
      ],
      code: {
        starter: `# Order book PT Delta: bid 1490 (1000 lbr), ask 1510 (800 lbr), ask level 2: 1525 (1500 lbr).\nbid = 1490\nask = 1510\ndepth1 = 800\nask2 = 1525\ndepth2 = 1500\norder = 2000  # lembar, market order beli\n\n# TULIS KODEMU: hitung mid, spread_persen, harga_rata, biaya_slippage.\n# Cetak, per baris: mid, spread_persen, harga_rata, biaya_slippage.\n\n`,
        lockLines: 7,
        solution: `# Order book PT Delta: bid 1490 (1000 lbr), ask 1510 (800 lbr), ask level 2: 1525 (1500 lbr).\nbid = 1490\nask = 1510\ndepth1 = 800\nask2 = 1525\ndepth2 = 1500\norder = 2000  # lembar, market order beli\n\n\nmid = (bid + ask) / 2\nspread_persen = (ask - bid) / mid * 100\nambil1 = min(order, depth1)\nambil2 = order - ambil1\ntotal_bayar = ambil1 * ask + ambil2 * ask2\nharga_rata = total_bayar / order\nbiaya_slippage = (harga_rata - mid) * order\nprint(f"mid={mid:.0f}")\nprint(f"spread_persen={spread_persen:.2f}")\nprint(f"harga_rata={harga_rata:.0f}")\nprint(f"biaya_slippage={biaya_slippage:.0f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "mid", value: 1500, tol: 0.01, label: "Mid Rp1.500", msg: "Mid = (1.490 + 1.510) / 2 = 1.500." },
          { kind: "equal", task: "t1", name: "spread_persen", value: 1.33, tol: 0.01, label: "Spread 1,33 persen", msg: "20 / 1.500 x 100 = 1,33. Di bawah 2 persen — pasar ini masih murah." },
          { kind: "equal", task: "t2", name: "harga_rata", value: 1519, tol: 0.01, label: "Harga rata-rata Rp1.519", msg: "(800 x 1.510 + 1.200 x 1.525) / 2.000 = 1.519." },
          { kind: "equal", task: "t3", name: "biaya_slippage", value: 38000, tol: 0.01, label: "Slippage Rp38.000", msg: "(1.519 - 1.500) x 2.000 = 38.000. Ini biaya antrean, bukan pergerakan harga." },
        ],
      },
      reference: "Mid Rp1.500; spread 1,33 persen; harga rata-rata Rp1.519; slippage Rp38.000.",
    },
    {
      id: "tipe-order-hft",
      eyebrow: "Langkah 6 · Teori",
      title: "Tipe order, HFT, dan dark pool",
      prose: [
        "Tipe order adalah cara kamu bernegosiasi dengan antrean. Market order: eksekusi pasti, harga tidak pasti — kamu membayar spread dan dampak harga. Limit order: harga pasti, eksekusi tidak pasti — bila dipasang sebagai passive limit order dan tereksekusi, kamu menjadi market maker mini dan MEMUNGUT spread; tetapi limit order juga bisa langsung menyeberangi spread, terkena adverse selection, atau dikenai struktur fee tertentu — memungut spread tidak pernah dijamin. Iceberg order: hanya sebagian kecil yang terlihat di book, sisanya tersembunyi — institusi menyembunyikan ukuran agar tidak mengundang front-running. Hidden order: tidak terlihat sama sekali, dan pada banyak venue kalah prioritas dari order terlihat di harga yang sama — tetapi aturan prioritas hidden/iceberg bergantung pada venue dan tipe order, bukan hukum universal.",
        "Algoritma eksekusi memecah order besar secara otomatis. TWAP membagi rata sepanjang hari; VWAP mengikuti pola volume (lebih banyak di pembukaan dan penutupan); implementation-shortfall algorithm menyeimbangkan urgensi dan biaya. Aturan praktisnya: bila lambda tinggi dan urgensi rendah, pecah kecil-kecil; bila berita akan keluar dalam satu jam, bayar saja slippage-nya — penundaan lebih mahal dari dampak harga.",
        "High-frequency trading (HFT) adalah market making dengan kecepatan mesin: memasang dan menarik quote dalam mikrodetik, memungut spread tipis dalam jutaan transaksi. Bagi investor ritel, HFT umumnya MENGURANGI spread di saham likuid — tetapi di momen stres, HFT menarik diri serentak dan likuiditas menguap. Flash crash 6 Mei 2010: Dow jatuh hampir 9 persen dalam hitungan menit lalu pulih — sebagian karena likuiditas algoritmik yang menarik diri bersamaan. Pelajarannya: likuiditas HFT adalah likuiditas cuaca cerah.",
        "Dark pool adalah bursa privat tanpa order book terlihat: institusi besar bertransaksi dalam jumlah besar tanpa menggerakkan harga publik. Keuntungannya: dampak harga kecil. Risikonya: tanpa transparansi harga, kamu tidak tahu apakah dapat harga adil — dan sebagian dark pool pernah terbukti memberi prioritas tidak adil ke klien tertentu. Aturan praktis ritel: kamu hampir tidak pernah perlu dark pool; yang perlu kamu tahu adalah bahwa sebagian volume besar TIDAK terlihat di book publik — jadi depth yang kamu lihat bukan seluruh cerita.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira limit order selalu lebih murah dari market order. Limit order yang tidak tereksekusi saat harga naik 5 persen lebih mahal dari market order yang membayar spread 0,5 persen. Biaya yang benar diukur dari implementation shortfall terhadap harga keputusan — termasuk biaya peluang dari order yang tidak jadi.",
      },
      reference: "Market = pasti tereksekusi, harga tidak pasti. Limit = harga pasti, eksekusi tidak pasti. Flash crash 2010: Dow jatuh hampir 9 persen dalam hitungan menit.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: manajer dana harus beli 50.000 lembar sebelum penutupan",
      prose: [
        "Manajer dana harus membeli 50.000 lembar PT Delta sebelum penutupan hari ini karena indeks akan memasukkan saham itu besok pagi. Order book: ask Rp1.510 (800 lembar), Rp1.525 (1.500), Rp1.550 (5.000), Rp1.600 (20.000). Lambda pasar ini Rp9,5 per 1.000 lembar — tetapi itu lambda masa tenang; menjelang penutupan dengan berita indeks, lambda efektif bisa dua kali lipat.",
        "Bila ia menekan market order 50.000 lembar sekaligus, order itu bahkan TIDAK BISA terisi penuh dari book yang terlihat: total depth ask yang ditampilkan hanya 800 + 1.500 + 5.000 + 20.000 = 27.300 lembar — kurang dari 50.000. Untuk 27.300 lembar yang terisi, biayanya dapat dihitung persis: 800 × 1.510 + 1.500 × 1.525 + 5.000 × 1.550 + 20.000 × 1.600 = Rp43.245.500, harga rata-rata Rp1.584,08, shortfall terhadap mid Rp1.500 = Rp2.295.500. Untuk 22.700 lembar sisanya TIDAK ADA harga di book — shortfall totalnya tidak dapat dihitung dari data ini, dan klaim 'di atas Rp5 juta' tidak terbukti. Model Kyle linear pun memberi gambaran berbeda: dampak harga 50 × Rp9,5 = Rp475 per lembar (bukan Rp475 ribu total) — ekstrapolasi model, bukan bukti dari book. Bila ia memecah menjadi 10 potong TWAP sepanjang sore, shortfall menyusut drastis — tetapi ia berisiko tidak selesai sebelum penutupan dan ketinggalan momentum indeks besok pagi.",
        "Keputusan yang benar: pecah order, tetapi dengan urgensi naik menjelang penutupan — algorithm implementation-shortfall dengan jadwal yang mempercepat di jam terakhir. Dan yang terpenting: laporkan shortfall-nya ke investor secara jujur. Manajer yang menyembunyikan biaya eksekusi di balik return pasar sedang menagih investornya tanpa memberi tahu.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, lambda dihitung dari kondisi saat itu, bukan dari rata-rata masa tenang. Kedua, trade-off urgensi vs biaya dibuat eksplisit — bukan ditebak. Ketiga, shortfall dilaporkan sebagai biaya, bukan disembunyikan dalam return.",
      },
      reference: "Market order 50.000 lembar: book hanya berisi 27.300 lembar; shortfall 27.300 lembar yang terisi = Rp2.295.500; 22.700 lembar sisanya tak ber-harga. Pecah + percepat menjelang penutupan adalah jawabannya.",
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
        "Mid Rp1.500; spread Rp20 (1,33 persen); beli 2.000 lembar = rata-rata Rp1.519; slippage Rp38.000.",
        "Model Kyle: perubahan harga = lambda × ukuran order; lambda Rp9,5 per 1.000 lembar.",
        "Implementation shortfall = (harga rata-rata − harga keputusan) × jumlah lembar.",
        "Market order pasti tereksekusi; limit order harga pasti tetapi bisa tidak tereksekusi.",
        "Likuiditas HFT adalah likuiditas cuaca cerah — menguap saat stres (flash crash 2010).",
      ],
      next: { label: "E32 — Konvensi Obligasi: Accrued Interest dan Day-Count", href: "/v2/learn/e32-konvensi-obligasi" },
      quiz: [
        {
          q: "Bid Rp1.490, ask Rp1.510 (800 lembar), ask level 2 Rp1.525 (1.500 lembar). Market order beli 2.000 lembar: berapa harga rata-rata dan slippage total terhadap mid?",
          options: [
            { text: "Rp1.510 dan Rp20.000 — hanya level 1 yang terpakai", why: "Salah: order 2.000 melebihi depth level 1 (800); 1.200 lembar sisanya diambil dari level 2 di Rp1.525." },
            { text: "Rp1.519 dan Rp38.000", why: "Tepat: (800 × 1.510 + 1.200 × 1.525) / 2.000 = 1.519; (1.519 − 1.500) × 2.000 = 38.000.", correct: true },
            { text: "Rp1.500 dan Rp0 — mid adalah harga transaksi", why: "Salah: mid tidak pernah menjadi harga transaksi. Transaksi terjadi di bid atau ask." },
            { text: "Rp1.525 dan Rp50.000 — seluruh order di level 2", why: "Salah: 800 lembar pertama tereksekusi di level 1 (Rp1.510); hanya sisanya di level 2." },
          ],
        },
        {
          q: "Lambda Kyle Rp9,5 per 1.000 lembar. Berapa perkiraan dampak harga order 5.000 lembar di masa tenang?",
          options: [
            { text: "Rp9,5 — lambda tidak tergantung ukuran order", why: "Salah: lambda adalah dampak PER 1.000 lembar; dampak total = lambda × ukuran dalam ribuan." },
            { text: "Rp47,5", why: "Tepat: 5 × 9,5 = 47,5. Order besar membayar dampak yang lebih besar — alasan institusi memecah order.", correct: true },
            { text: "Rp95 — lambda digandakan untuk order institusi", why: "Salah: tidak ada penggandaan khusus institusi. Dampak = 5 × 9,5 = 47,5." },
            { text: "Rp0 — pasar dalam menyerap order berapa pun tanpa dampak", why: "Salah: tidak ada pasar yang menyerap order tanpa dampak; lambda hanya bisa kecil, tidak pernah nol." },
          ],
        },
        {
          q: "Harga keputusan Rp1.500, harga rata-rata eksekusi Rp1.519, 2.000 lembar. Berapa implementation shortfall?",
          options: [
            { text: "Rp38.000, atau 1,27 persen dari nilai order", why: "Tepat: (1.519 − 1.500) × 2.000 = 38.000; 38.000 / 3.000.000 = 1,27 persen.", correct: true },
            { text: "Rp0 — harga tidak bergerak selama eksekusi", why: "Salah: shortfall mengukur biaya menembus antrean, bukan pergerakan harga. Harga diam pun shortfall tetap ada." },
            { text: "Rp19.000 — hanya setengah slippage yang dihitung", why: "Salah: shortfall memakai selisih penuh per lembar (Rp19) dikali seluruh jumlah (2.000)." },
            { text: "Rp3.000.000 — seluruh nilai order adalah biaya", why: "Salah: nilai order adalah pokok yang dibelanjakan, bukan biaya. Biayanya hanya selisih harga eksekusi terhadap harga keputusan." },
          ],
        },
        {
          q: "Kamu ingin beli saham yang akan naik karena berita besok pagi, tetapi spread-nya 3 persen. Apa pilihan yang paling masuk akal?",
          options: [
            { text: "Pasang limit order di bid dan tunggu — limit selalu lebih murah", why: "Salah: limit yang tidak tereksekusi saat harga naik justru lebih mahal — biaya peluangnya melebihi spread yang dihemat." },
            { text: "Beli dengan market order sekarang — urgensi mengalahkan biaya spread", why: "Tepat: bila keyakinan naik melebihi spread 3 persen, penundaan lebih mahal dari spread. Market order membeli kepastian eksekusi.", correct: true },
            { text: "Batalkan rencana — spread di atas 2 persen berarti saham tidak boleh dibeli", why: "Salah: batas 2 persen adalah peringatan biaya, bukan larangan. Bila ekspektasi naik jauh lebih besar, beli tetap rasional." },
            { text: "Beli di dark pool — di sana tidak ada spread", why: "Salah: dark pool bukan untuk ritel dan bukan tanpa biaya — tanpa transparansi harga, kamu tidak tahu apakah hargamu adil." },
          ],
        },
        {
          q: "Flash crash 2010 (Dow jatuh hampir 9 persen dalam hitungan menit lalu pulih) mengajarkan apa tentang likuiditas HFT?",
          options: [
            { text: "HFT selalu menambah likuiditas, bahkan saat krisis", why: "Salah: HFT menarik diri serentak saat stres — likuiditasnya adalah likuiditas cuaca cerah." },
            { text: "HFT menyebabkan semua crash pasar", why: "Salah: HFT memperparah kecepatan jatuhnya, bukan penyebab tunggal. Akar crash tetap order jual besar dan kepanikan." },
            { text: "Likuiditas HFT menguap saat stres — jangan andalkan depth algoritmik di momen panik", why: "Tepat: spread menyempit di masa tenang karena HFT, tetapi quote-nya ditarik saat volatilitas meledak.", correct: true },
            { text: "Flash crash membuktikan order book tidak berguna", why: "Salah: order book tetap mekanisme harga. Yang gagal adalah asumsi bahwa depth yang terlihat akan bertahan saat stres." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

const BCD15_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Garis harga: stabil 4210 lalu anjlok ke 3500 pada menit 41-42 (serangan) lalu pulih."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3500</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3850</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">4220</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">38</text><text x="185.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">42</text><text x="324.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">46</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50</text><polyline points="46.0,22.2 80.8,21.1 115.7,21.8 150.5,91.1 185.3,180.0 220.2,20.4 255.0,20.0 289.8,21.1 324.7,22.2 359.5,21.8 394.3,21.1 429.2,20.4 464.0,20.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="150.5" y="83.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">4212</text><text x="185.3" y="172.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">3900</text><line x1="46" y1="22.2" x2="464" y2="22.2" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="16.2" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">harga benar</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">USD / menit</text></svg>`;

export const bcd15: V2Lesson = {
  slug: "bcd15-oracle-literacy",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD15 — Oracle Literacy (Chainlink)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "$100 juta yang dicuri dari angka",
      prose: [
        "September 2022. Protokol lending Mango (bukan nama sebenarnya, tapi polanya nyata!) dilikuidasi $100 juta dalam 20 menit. Bukan karena hack smart contract. Bukan karena private key bocor. Melainkan karena ANGKA: harga token MNGO di oracle dilaporkan $0,50 — padahal harga pasar sebenarnya $0,02. Penyerang memanipulasi harga di SATU DEX kecil, oracle membacanya sebagai kebenaran, protokol memberi pinjaman berdasarkan angka palsu itu. 20 menit kemudian: kas kosong.",
        "Twist-nya: smart contract-nya BENAR. Kode lending-nya diaudit 3x. Yang salah = ASUMSI: `harga di blockchain = harga yang benar`. Blockchain tidak tahu harga apa pun! Ia hanya tahu apa yang DILAPORKAN. Oracle = jembatan antara dunia nyata (harga) dan blockchain (kode). Dan jembatan bisa disabotase — bukan dengan merusak jembatan, melainkan dengan memalsukan rambu-nya.",
        "Lesson ini: cara kerja oracle (Chainlink: agregasi multi-sumber), tiga serangan klasik (spot manipulation, stale price, TWAP lag), dan cara MEMBACA data oracle seperti analis: kapan percaya, kapan curiga, kapan lari. Setelah ini, kamu tidak akan pernah lagi melihat `harga di chain` sebagai fakta — melainkan sebagai KLAIM yang harus diverifikasi.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa blockchain butuh oracle dan bagaimana Chainlink mengagregasi harga; (2) mengidentifikasi tiga serangan oracle dari pola datanya; (3) menghitung TWAP dan menjelaskan kapan ia melindungi vs menjebak; (4) menulis monitor deviasi oracle vs pasar; (5) merancang checklist `percaya atau tidak` untuk data harga on-chain.",
        "Daftar isi: 1) Cerita $100 juta · 2) Cara kerja Chainlink · 3) Tiga serangan klasik · 4) Lab: deteksi anomali oracle · 5) TWAP: perisai yang berkarat · 6) Peta keputusan: percaya atau tidak · 7) Mini-case: audit oracle 10 menit · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Harga di blockchain = harga pasar`",
        type: "pitfall",
        body: "Blockchain tidak `tahu` harga — ia hanya menyimpan ANGKA yang dilaporkan oracle. Angka itu bisa basi (tidak update 2 jam!), bisa dimanipulasi (1 DEX kecil!), bisa lag (TWAP!). Setiap kali kamu membaca harga on-chain, tanya: SIAPA melapor? KAPAN? DARI MANA? Tiga pertanyaan ini = separuh oracle literacy.",
      },
      reference: "Harga on-chain = KLAIM, bukan fakta. Verifikasi: siapa, kapan, dari mana.",
    },
    {
      id: "chainlink",
      eyebrow: "Langkah 2 · Konsep",
      title: "Cara kerja Chainlink: demokrasi harga",
      prose: [
        "Masalah: smart contract butuh harga ETH/USD, tapi blockchain terisolasi (deterministik — tidak bisa `fetch API`!). Solusi Chainlink: JARINGAN node independen yang masing-masing mengambil harga dari BANYAK sumber (Binance, Coinbase, Kraken...), lalu AGREGASI (median!) on-chain. Bukan 1 angka dari 1 sumber — melainkan median dari 21+ node × 3+ sumber. Untuk memalsukan: kompromikan > 50% node ATAU manipulasi SEMUA sumber mayoritas. Jauh lebih sulit dari 1 DEX!",
        "Anatomi data feed: tiap feed (mis. ETH/USD) punya: (1) `answer` (harga terakhir, 8 desimal!); (2) `updatedAt` (kapan!); (3) `roundId` (nomor putaran); (4) `answeredInRound`. Aturan MEMBACA yang benar: SELALU cek `updatedAt` (stale?!) dan bandingkan `roundId` vs `answeredInRound` (tidak sinkron = data tidak final!). Kontrak yang hanya baca `answer` = kontrak yang buta 2/3 realitas. (Kasus nyata: $10 juta hilang karena kontrak tidak cek stale!)",
        "Contoh angka: ETH/USD feed, 21 node. 20 node lapor 4210–4220; 1 node lapor 3900 (error!). Median = 4215 (node error TERABAIKAN!). Inilah kekuatan median vs rata-rata: rata-rata = (20×4215 + 3900)/21 = 4200 — bergeser $15 oleh 1 node jahat! Median = kebal terhadap < 50% outlier. Pelajaran: agregasi yang BENAR (median, multi-sumber) = fondasi kepercayaan. Agregasi yang SALAH (rata-rata, 1 sumber) = undangan serangan.",
        "Deviation threshold: Chainlink hanya update jika harga bergerak > 0,5% (atau heartbeat 1 jam!). Artinya: harga on-chain SELALU tertinggal 0–0,5% dari pasar + bisa basi 1 jam saat pasar tenang! Untuk lending ($100 juta!): 0,5% dari $4210 = $21 — tidak masalah. Untuk trading presisi: 0,5% = masalah BESAR. Kenali threshold feed yang kamu baca — ia adalah `resolusi` kacamata oracle-mu.",
        "Heartbeat vs event-driven: tiap feed punya heartbeat (update paksa tiap X, mis. 1 jam) DAN deviation trigger (> 0,5%). Pola update = sidik jari KONDISI PASAR: update tiap detik = pasar volatile!; update tiap 1 jam = pasar tenang. Analis bisa MEMBACA volatilitas dari FREKUENSI update oracle — tanpa melihat harga sama sekali! (Teknik BCD: frekuensi sebagai sinyal.)",
        "Decentralization spectrum: Chainlink (21+ node) > single-oracle (1 node, mis. proyek kecil) > DEX spot price (0 node — baca langsung!). Kasus $100 juta = DEX spot (0 node!). Aturan: nilai yang dilindungi > $1 juta → Chainlink atau setara. $10.000–$1 juta → minimal TWAP (langkah 5). < $10.000 → spot boleh (biaya serangan > keuntungan!). Keamanan oracle = proporsional dengan nilai!",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: median = demokrasi yang kebal",
        body: "1 node jahat dari 21 tidak bisa menggeser MEDIAN (butuh 11!). Tapi bisa menggeser RATA-RATA ($15!). Pilih agregasi = pilih siapa yang bisa berbohong. Median + multi-sumber = pembohong butuh mayoritas. Rata-rata + 1 sumber = 1 pembohong cukup.",
      },
      reference: "Selalu baca answer + updatedAt + roundId. Median kebal < 50% outlier.",
    },
    {
      id: "serangan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga serangan klasik (dan sidik jarinya)",
      prose: [
        "SERANGAN 1 — SPOT MANIPULATION (kasus $100 juta!): penyerang pinjam $10 juta (flash loan!), beli besar-besaran di DEX KECIL (likuiditas tipis!) → harga spot DEX naik 25x ($0,02 → $0,50) → oracle baca spot DEX itu → protokol pinjamkan $100 juta dengan jaminan `senilai` $0,50. Sidik jari: (a) volume DEX tiba-tiba 100x normal; (b) harga DEX menyimpang > 5% dari CEX (Binance!) dalam 1 blok; (c) flash loan besar di blok yang sama. Tiga sidik jari = serangan, bukan pasar!",
        "SERANGAN 2 — STALE PRICE: pasar crash 30% dalam 1 jam, tapi oracle belum update (deviation < 0,5% per tick? tidak — ini HEARTBEAT gap!). Skenario: harga bergerak 0,4% × 75 kali = 30% total, tapi tiap tick < 0,5% = TIDAK TRIGGER update! Oracle menampilkan harga 1 jam lalu (basi!). Protokol yang tidak cek `updatedAt` memberi pinjaman dengan harga KEMARIN. Sidik jari: `updatedAt` > 10 menit lalu + volatilitas pasar tinggi (frekuensi update = 0 padahal pasar gila!). Aturan: TOLAK harga yang `updatedAt`-nya lebih tua dari 2×heartbeat saat volatil!",
        "SERANGAN 3 — TWAP LAG (langkah 5 detail): penyerang TAHU protokol pakai TWAP 30 menit → ia manipulasi harga spot 25 menit (cukup lama agar TWAP ikut naik!) → pinjam di menit 26–30 → kembalikan manipulasi. TWAP yang `melindungi` dari flash (1 blok) TIDAK melindungi dari manipulasi 25 menit! Sidik jari: TWAP menyimpang perlahan dari CEX selama 20+ menit (bukan tiba-tiba!). Perlahan = lebih berbahaya (tidak memicu alarm!).",
        "Biaya serangan (aritmetika penyerang!): flash loan $10 juta × fee 0,09% = $9.000 + slippage di DEX kecil ~$50.000 + gas $500 = ~$60.000 untuk mencuri $100 juta. ROI: 1.666x! Inilah mengapa serangan oracle TERUS terjadi: biayanya KECIL, hadiahnya BESAR. Pertahanan harus membuat biaya > hadiah: Chainlink (butuh kompromi 11 node = jutaan $!) = biaya serangan > $100 juta = tidak ekonomis. Keamanan = EKONOMI, bukan hanya kriptografi.",
        "Jebakan `sudah pakai Chainlink = aman`: (1) Chainlink ETH/USD aman, tapi feed TOKEN KECIL (MNGO/USD!) hanya 3 node + sumber tipis = LEBIH RENTAN!; (2) kontrak baca `answer` tanpa cek stale = Chainlink tidak membantu; (3) komposabilitas: protokol A (aman) → integrasi ke protokol B yang pakai spot DEX (tidak aman!) = rantai sekuat tautan terlemah. Audit oracle = audit SEMUA feed + SEMUA cara baca + SEMUA integrasi.",
      ],
      formula: String.raw`\text{aman} \iff C_{serang} > V_{curian} \quad ; \quad C_{serang} \approx n_{node} \times c_{kompromi}`,
      formulaNote: "C_serang = biaya serangan; V_curian = nilai yang bisa dicuri; n_node = node yang harus dikompromikan; c_kompromi = biaya per node. Chainlink 21 node: C_serang = jutaan $ > $100 juta? Aman. DEX spot (0 node): C_serang = $60.000 < $100 juta = TIDAK aman. Keamanan = ekonomi!",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Pakai Chainlink = kebal oracle attack`",
        type: "pitfall",
        body: "Chainlink ETH/USD (21 node) ≠ Chainlink TOKEN-KECIL/USD (3 node, sumber tipis!). Dan kontrak yang baca `answer` tanpa cek `updatedAt` = buta walau feed-nya sempurna. Serta integrasi ke protokol yang pakai spot DEX = rantai terlemah. `Pakai Chainlink` saja tidak cukup — yang cukup: feed yang tepat + cara baca yang benar + rantai integrasi yang diaudit.",
      },
      reference: "Sidik jari: volume 100x + deviasi CEX > 5% + flash loan = serangan.",
    },
    {
      id: "lab-oracle",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: monitor deviasi oracle",
      prose: [
        "Data: harga oracle (Chainlink, per menit) vs harga pasar (CEX) selama 60 menit — termasuk SERANGAN di menit 40–42 (spot manipulation!) dan TWAP-lag setelahnya. Tugasmu: (1) hitung deviasi per menit; (2) flag jika |deviasi| > 2%; (3) hitung TWAP-10 oracle dan flag jika TWAP juga menyimpang.",
        "Cara membaca: n_flags = jumlah menit ter-flag; daftar menit = kapan. Interpretasi: flag di 40–42 = serangan spot (tajam!); flag 43–50 = TWAP-lag (ekor manipulasi!); flag sporadis lain = noise pasar (deviasi < 2% = normal). Monitor yang baik menangkap KEDUANYA (serangan + ekornya).",
        "Coba eksplorasi: ubah ambang ke 5% — berapa flag hilang? (Ekor TWAP hilang!) Pelajaran: ambang terlalu longgar = buta terhadap serangan perlahan. Ambang terlalu ketat (0,5%) = banjir false alarm. 2% = sweet spot untuk contoh ini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung deviasi oracle vs pasar per menit" },
        { id: "t2", text: "Flag |deviasi| > 2%; hitung TWAP-10 dan flag TWAP juga" },
        { id: "t3", text: "Jalankan; identifikasi menit serangan vs ekor TWAP" },
      ],
      expected: "n_flags=11 · serangan menit 40–42 · ekor TWAP sampai menit 50",
      note: {
        title: "💡 Intuisi: serangan punya ekor",
        body: "Serangan spot (40–42) TAJAM dan JELAS. Tapi TWAP-10 ikut tercemar sampai menit 50 (ekor 8 menit!). Monitor yang hanya cek spot = `serangan selesai` di menit 43 (SALAH!). Monitor yang cek TWAP juga = tahu sistem masih tercemar. Selalu pantau ekornya, bukan hanya kepalanya.",
      },
      hints: [
        "deviasi = (oracle - pasar) / pasar * 100.",
        "TWAP-10 di menit m = rata-rata oracle 10 menit terakhir.",
        "Flag jika |deviasi| > 2 ATAU |twap_deviasi| > 2.",
      ],
      code: {
        starter: `oracle = [4210, 4215, 4208, 4212, 4218, 4205, 4211, 4216, 4209, 4213,\n          4211, 4217, 4206, 4212, 4215, 4208, 4214, 4210, 4216, 4211,\n          4209, 4213, 4218, 4212, 4207, 4215, 4210, 4216, 4211, 4208,\n          4214, 4209, 4215, 4212, 4218, 4210, 4213, 4216, 4208, 4211,\n          3900, 3500, 3800, 4100, 4180, 4205, 4212, 4215, 4210, 4213,\n          4216, 4211, 4209, 4214, 4212, 4218, 4210, 4215, 4211, 4216]\npasar = [4212, 4214, 4210, 4213, 4216, 4208, 4212, 4215, 4210, 4214,\n         4212, 4216, 4208, 4213, 4214, 4210, 4215, 4211, 4217, 4212,\n         4210, 4214, 4216, 4213, 4209, 4214, 4211, 4217, 4212, 4210,\n         4215, 4210, 4214, 4213, 4216, 4211, 4214, 4217, 4210, 4212,\n         4213, 4215, 4211, 4216, 4212, 4214, 4210, 4216, 4211, 4214,\n         4217, 4212, 4210, 4215, 4213, 4216, 4211, 4214, 4212, 4217]\n\n# TULIS KODEMU\ndef deviasi(o, p):\n    \n\ndef twap(data, m, w=10):\n    \n\nflags = []\nfor m in range(len(oracle)):\n    pass  # TULIS: hitung dev & dev_twap, flag jika > 2\n\nprint(\"n_flags:\", len(flags))\nprint(\"menit:\", flags)\nprint(\"twap[41]:\", round(twap(oracle, 41), 1))`,
        lockLines: 21,
        solution: `oracle = [4210, 4215, 4208, 4212, 4218, 4205, 4211, 4216, 4209, 4213,\n          4211, 4217, 4206, 4212, 4215, 4208, 4214, 4210, 4216, 4211,\n          4209, 4213, 4218, 4212, 4207, 4215, 4210, 4216, 4211, 4208,\n          4214, 4209, 4215, 4212, 4218, 4210, 4213, 4216, 4208, 4211,\n          3900, 3500, 3800, 4100, 4180, 4205, 4212, 4215, 4210, 4213,\n          4216, 4211, 4209, 4214, 4212, 4218, 4210, 4215, 4211, 4216]\npasar = [4212, 4214, 4210, 4213, 4216, 4208, 4212, 4215, 4210, 4214,\n         4212, 4216, 4208, 4213, 4214, 4210, 4215, 4211, 4217, 4212,\n         4210, 4214, 4216, 4213, 4209, 4214, 4211, 4217, 4212, 4210,\n         4215, 4210, 4214, 4213, 4216, 4211, 4214, 4217, 4210, 4212,\n         4213, 4215, 4211, 4216, 4212, 4214, 4210, 4216, 4211, 4214,\n         4217, 4212, 4210, 4215, 4213, 4216, 4211, 4214, 4212, 4217]\n\n# TULIS KODEMU\ndef deviasi(o, p):\n    return (o - p) / p * 100\n\ndef twap(data, m, w=10):\n    seg = data[max(0, m - w + 1):m + 1]\n    return sum(seg) / len(seg)\n\nflags = []\nfor m in range(len(oracle)):\n    dev = deviasi(oracle[m], pasar[m])\n    dev_t = deviasi(twap(oracle, m), pasar[m])\n    if abs(dev) > 2 or abs(dev_t) > 2:\n        flags.append(m)\n\nprint(\"n_flags:\", len(flags))\nprint(\"menit:\", flags)\nprint(\"twap[41]:\", round(twap(oracle, 41), 1))`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "11 flag", msg: "Harus 11 menit ter-flag.", pattern: "n_flags: 11" },
          { kind: "stdout_matches", task: "t3", label: "menit 40-42", msg: "Serangan di menit 40-42 harus ter-flag.", pattern: "40, 41, 42" },
          { kind: "stdout_matches", task: "t3", label: "twap 4110.3", msg: "TWAP-10 di menit 41 = 4110.3 (terseret 2,4% — TERFLAG!).", pattern: "twap\\[41\\]: 4110\\.3" },
        ],
      },
      reference: "Monitor spot DAN TWAP. Serangan punya ekor — pantau keduanya.",
    },
    {
      id: "twap",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "TWAP: perisai yang berkarat",
      prose: [
        "TWAP (Time-Weighted Average Price) = rata-rata harga selama W (mis. 30 menit). Tujuannya: melindungi dari manipulasi 1 blok (flash loan!). Logikanya: memanipulasi 1 blok = murah ($60.000); memanipulasi 30 menit = MAHAL (harus tahan harga 1.800 blok!). TWAP 30 menit menaikkan C_serang dari $60.000 ke ~$2 juta. Untuk $100 juta: masih MENGUNTUNGKAN ($2 juta < $100 juta!). TWAP = perisai yang menaikkan biaya, BUKAN yang menghilangkan serangan.",
        "Contoh lab: serangan menit 40–42 (3 menit, anjlok ke 3500!) → TWAP-10 di menit 41 = 4110,3 (terseret 2,4% — TERFLAG!). TWAP-10 KALAH melawan serangan 3 menit yang dalam: inersia 10 menit tidak cukup menahan anjlok 17%. Menangkan dengan W lebih besar — TWAP-30 di menit yang sama = 4177,9 (deviasi cuma 0,9%, di bawah ambang 2%!). Tapi serangan 25 menit (kasus langkah 3!): TWAP-30 di menit 25 = sudah 80% tercemar! TWAP kalah melawan serangan yang TAHU window-nya. Aturan: W harus > durasi serangan EKONOMIS (berapa lama penyerang mampu tahan?). Jika penyerang mampu 25 menit dan W = 30: KALAH. Jika W = 2 jam: penyerang butuh $10 juta+ = mungkin MENANG (pertahanan!).",
        "Lag sebagai SENJATA MAKAN TUAN: pasar crash 30% dalam 10 menit (nyata!), TWAP-30 masih menunjukkan harga 20 menit lalu (TINGGI!). Protokol memberi pinjaman dengan harga KETINGGIAN (basi!) — peminjam untung, protokol rugi. TWAP melindungi dari manipulasi NAIK, tapi menjebak saat pasar TURUN cepat. Solusi: circuit breaker — jika |spot − TWAP| > 5%, BEKUKAN (jangan pakai keduanya!). Beku 10 menit > rugi $10 juta.",
        "TWAP vs Chainlink (kapan apa): Chainlink = keamanan dari BANYAK SUMBER (desentralisasi); TWAP = keamanan dari WAKTU (inersia). Kombinasi TERBAIK: Chainlink SEBAGAI sumber + TWAP sebagai filter + circuit breaker sebagai rem. Tiga lapis: sumber benar, waktu menghaluskan, rem darurat. Protokol $100 juta yang hanya pakai SATU lapis (spot DEX!) = nol lapis sebenarnya.",
        "Angka window yang jujur: W = 5 menit: murah (C_serang ~$300rb), lag kecil — untuk nilai < $1 juta. W = 30 menit: sedang ($2 juta), lag sedang — untuk $1–10 juta. W = 2 jam: mahal ($10 juta+), lag BESAR (bahaya crash!) — untuk > $10 juta + circuit breaker WAJIB. Tidak ada W sempurna — hanya W yang SESUAI nilai + breaker sebagai pengaman.",
      ],
      formula: String.raw`TWAP_W = \frac{1}{W}\sum_{t=1}^{W} p_t \quad ; \quad \text{beku} \iff |p_{spot} - TWAP_W| > 5\%`,
      formulaNote: "TWAP_W = rata-rata harga selama window W; beku (circuit breaker) jika spot menyimpang > 5% dari TWAP. W vs lag vs biaya serangan: pilih by nilai yang dilindungi. TWAP melindungi dari flash (1 blok), KALAH dari manipulasi > W.",
      figure: {
        svg: BCD15_SVG,
        alt: "Garis harga oracle: stabil 4210, anjlok ke 3500 pada menit 41-42 (serangan), pulih setelahnya.",
        caption: "Cara membaca: sumbu-x = menit, sumbu-y = USD; garis = harga oracle; garis putus-putus = harga benar (4210). Interpretasi: serangan menit 40–42 (anjlok ke 3500!) = spot manipulation; TWAP-10 terseret ke 4110 (deviasi 2,4% — KALAH vs serangan dalam 3 menit, inersia 10 menit tidak cukup!); TWAP-30 di menit yang sama cuma goyang 0,9% (4178) = W lebih besar menang; tapi serangan 25 menit tetap mencemari TWAP — kenali batas perisaimu.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: TWAP = perisai, bukan tembok",
        body: "Perisai menaikkan biaya serangan ($60rb → $2jt) tapi bisa ditembus ($2jt < $100jt!). Tembok (Chainlink 21 node: biaya $jutaan) lebih kuat. Yang terbaik: perisai + tembok + rem (circuit breaker). Jangan percaya satu lapis untuk $100 juta.",
      },
      reference: "W > durasi serangan ekonomis. Circuit breaker: |spot − TWAP| > 5% = BEKU.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Percaya atau tidak: checklist 60 detik",
      prose: [
        "**Skenario 1 — Chainlink ETH/USD, updatedAt 30 detik lalu, deviasi CEX 0,1%.** → PERCAYA. Feed kuat + segar + selaras. Lanjut.",
        "**Skenario 2 — Feed token kecil (3 node), updatedAt 5 menit lalu, pasar tenang.** → CURIGA. Cek: deviasi CEX? Jika < 1%: pakai dengan waspada. Jika > 2%: JANGAN.",
        "**Skenario 3 — Harga spot DEX saja (0 node), nilai $100 juta.** → JANGAN. C_serang ($60rb) << V ($100jt). Minta Chainlink/TWAP dulu.",
        "**Skenario 4 — updatedAt 2 jam lalu, pasar crash 30%.** → TOLAK (stale!). Harga kemarin untuk pasar hari ini = bunuh diri. Tunggu update atau bekukan.",
        "**Skenario 5 — |spot − TWAP| = 8%.** → BEKU (circuit breaker!). Jangan pilih salah satu — keduanya tidak terpercaya saat ini. Beku 10 menit > rugi $10 juta.",
        "Checklist 60 detik (hafalkan!): (1) Feed apa? (berapa node?) (2) updatedAt kapan? (3) Deviasi vs CEX? (4) Nilai yang dipertaruhkan? (5) Ada circuit breaker? Lima ya/tidak = keputusan. Jangan baca harga tanpa checklist ini.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: harga = klaim bertanda tangan",
        body: "Setiap harga on-chain adalah KLAIM dengan 3 tanda tangan: SIAPA (node/sumber), KAPAN (updatedAt), DARI MANA (feed). Klaim tanpa tanda tangan lengkap = jangan percaya untuk nilai besar. Analis oracle = pemeriksa tanda tangan, bukan pembaca angka.",
      },
      reference: "5 checklist: feed, updatedAt, deviasi, nilai, breaker. 60 detik.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Audit oracle 10 menit: lending Rp1,5 triliun",
      prose: [
        "Protokol lending NusantaraFi: TVL Rp1,5 triliun (~$100 juta). Menggunakan: harga spot dari DEX sendiri (likuiditas $2 juta!) untuk token agunan utama. Tidak ada cek updatedAt (tidak ada konsepnya — spot!). Tidak ada circuit breaker. Tim: `Sudah diaudit 3x, aman`.",
        "**Pertanyaan:** (a) Hitung C_serang vs V_curian. (b) Tiga perbaikan prioritas. (c) Estimasi biaya perbaikan vs risiko. (d) Apa yang dikatakan ke tim?",
        "**Pembahasan:** (a) C_serang: flash loan $10jt × 0,09% = $9.000 + slippage DEX $2jt likuiditas ~$100.000 + gas $500 ≈ $110.000. V = $100 juta. ROI penyerang: 909x. TIDAK AMAN (C << V). (b) (1) Ganti ke Chainlink feed (atau minimal TWAP-2jam + breaker!); (2) tambah cek updatedAt + deviasi CEX; (3) circuit breaker 5%. (c) Biaya: integrasi Chainlink ~$50.000 (dev + audit) vs risiko $100 juta = 2.000x lipat. (d) `Audit smart contract tidak mengaudit ASUMSI HARGA. 3x audit kode ≠ 1x audit oracle. Perbaiki minggu ini, bukan kuartal depan — penyerang tidak menunggu roadmap.`",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Oracle = SINGLE POINT OF FAILURE untuk Rp1,5 triliun. Dalam risk: ini risiko KONSENTRASI (satu sumber kebenaran!). Mitigasi: diversifikasi sumber (Chainlink multi-node) + batas eksposur (breaker!). Sama seperti jangan taruh semua telur di 1 keranjang — jangan taruh Rp1,5T di 1 angka.",
      },
      reference: "C_serang ($110rb) << V ($100jt) = TIDAK AMAN. Perbaiki minggu ini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Kontrak hanya membaca `answer` dari Chainlink. Risiko TERBESAR?",
          options: [
            { text: "Tidak ada — Chainlink aman", why: "Chainlink aman ≠ cara baca aman. Tanpa cek updatedAt = buta terhadap stale price." },
            { text: "Stale price: memakai harga basi tanpa sadar (tidak cek updatedAt/roundId)", why: "Tepat. Kasus nyata: $10 juta hilang karena kontrak tidak cek stale. answer saja = 1/3 informasi.", correct: true },
            { text: "Gas lebih mahal", why: "Membaca 3 field vs 1 = beda gas RECEH. Bukan risiko terbesar." },
            { text: "Harga terlalu akurat", why: "Bukan masalah. Masalahnya kebalikannya (basi/dimanipulasi)." },
          ],
        },
        {
          q: "Median vs rata-rata untuk agregasi 21 node (1 jahat). Mengapa median?",
          options: [
            { text: "Median lebih mudah dihitung", why: "Komputasi bukan alasannya — keamanan yang jadi alasan." },
            { text: "1 node jahat tidak bisa menggeser median (butuh 11); tapi bisa menggeser rata-rata $15", why: "Tepat. Median kebal < 50% outlier. Pilih agregasi = pilih siapa yang bisa berbohong.", correct: true },
            { text: "Rata-rata dilarang regulasi", why: "Tidak ada larangan; ini soal matematika ketahanan, bukan regulasi." },
            { text: "Keduanya sama saja", why: "20×4215 + 3900: rata-rata = 4200 (geser $15!), median = 4215 (tetap). TIDAK sama." },
          ],
        },
        {
          q: "TWAP-30 vs serangan manipulasi 25 menit. Hasil?",
          options: [
            { text: "TWAP menang — 30 > 25", why: "Angka menipu: di menit 25, TWAP sudah 80% tercemar! `30 > 25` tidak berarti aman." },
            { text: "TWAP kalah — penyerang yang tahu window mencemari 80% TWAP sebelum beraksi", why: "Tepat. TWAP melindungi dari flash (1 blok), KALAH dari manipulasi yang disengaja > W. W harus > durasi serangan EKONOMIS.", correct: true },
            { text: "Seri — keduanya benar", why: "Tidak ada seri dalam keamanan: tercemar 80% = kalah." },
            { text: "Tergantung harga token", why: "Tidak tergantung harga — tergantung DURASI vs WINDOW. Mekanisme, bukan nominal." },
          ],
        },
        {
          q: "Pasar crash 30% dalam 10 menit, TWAP-30 masih tinggi. Tindakan?",
          options: [
            { text: "Pakai TWAP — lebih stabil", why: "`Stabil` = BASI di sini. Pinjaman dengan harga ketinggian = protokol rugi. Stabilitas tanpa kebenaran = jebakan." },
            { text: "Circuit breaker: |spot − TWAP| > 5% = BEKU, jangan pakai keduanya", why: "Tepat. Beku 10 menit > rugi $10 juta. TWAP melindungi dari manipulasi NAIK tapi menjebak saat crash.", correct: true },
            { text: "Pakai spot — lebih segar", why: "Spot saat crash = PANIK (overshoot!). Keduanya tidak terpercaya — makanya BEKU, bukan pilih." },
            { text: "Tunggu 30 menit lalu pakai TWAP", why: "30 menit tanpa aksi = 30 menit eksposur. Bekukan SEKARANG, evaluasi 10 menit." },
          ],
        },
        {
          q: "DEX likuiditas $2 juta, TVL protokol $100 juta, harga dari spot DEX. Keputusan?",
          options: [
            { text: "Aman — sudah diaudit 3x", why: "Audit KODE ≠ audit ASUMSI HARGA. 3x audit tidak menyentuh oracle." },
            { text: "TIDAK AMAN: C_serang (~$110rb) << V ($100jt), ROI penyerang 909x", why: "Tepat. Ganti ke Chainlink/TWAP+breaker minggu ini. Penyerang tidak menunggu roadmap.", correct: true },
            { text: "Aman jika likuiditas DEX ditambah", why: "Menambah likuiditas $2jt → $10jt = C_serang naik 5x tapi masih << $100jt. Tidak menyelesaikan." },
            { text: "Kurangi TVL agar aman", why: "Mengurangi bisnis bukan solusi keamanan. Perbaiki oracle-nya." },
          ],
        },
        {
          q: "Checklist 60 detik sebelum percaya harga on-chain. Urutan TEPAT?",
          options: [
            { text: "Nilai dulu, baru feed", why: "Nilai tanpa tahu feed = tidak bisa hitung C_serang. Feed DULU (siapa melapor?)." },
            { text: "Feed (node?) → updatedAt (kapan?) → deviasi CEX → nilai → breaker", why: "Tepat. Lima tanda tangan klaim harga. Hafalkan urutannya.", correct: true },
            { text: "Harga dulu — kalau masuk akal, percaya", why: "`Masuk akal` = intuisi, bukan verifikasi. $0,50 untuk MNGO `masuk akal` sampai ternyata $0,02." },
            { text: "Tanya tim — mereka yang tahu", why: "Tim yang bilang `sudah diaudit 3x, aman` = tim yang tidak audit oracle. Verifikasi sendiri." },
          ],
        },
      ],
      summary: [
        "Harga on-chain = KLAIM (siapa? kapan? dari mana?) — bukan fakta.",
        "Chainlink: median 21+ node × multi-sumber; selalu baca answer + updatedAt + roundId.",
        "Tiga serangan: spot manipulation, stale price, TWAP lag — kenali sidik jarinya.",
        "Keamanan = ekonomi: aman jika C_serang > V_curian.",
        "TWAP = perisai (naikkan biaya), bukan tembok; W by nilai + circuit breaker 5%.",
        "Checklist 60 detik: feed, updatedAt, deviasi, nilai, breaker.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};

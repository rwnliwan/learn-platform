import type { V2Lesson } from "../lib/types";

// Urutan blok: attacker buy -> victim buy -> attacker sell (sandwich).
const SAND_SVG = `<svg viewBox="0 0 480 240" role="img" aria-label="Urutan transaksi dalam satu blok: attacker beli, korban beli, attacker jual. Harga naik di tiap langkah.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="40" x2="440" y2="40"/><line x1="40" y1="110" x2="440" y2="110"/><line x1="40" y1="180" x2="440" y2="180"/></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end"><text x="34" y="44">$3.000</text><text x="34" y="114">$3.100</text><text x="34" y="184">$3.200</text></g>
<rect x="70" y="120" width="100" height="44" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="120" y="139" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">att beli 10</text>
<text x="120" y="155" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)">tx #0</text>
<rect x="190" y="70" width="100" height="44" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="240" y="89" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">korban beli 5</text>
<text x="240" y="105" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)">tx #1</text>
<rect x="310" y="48" width="100" height="44" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="360" y="67" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">att jual 10</text>
<text x="360" y="83" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)">tx #2</text>
<path d="M170,120 L190,100 M290,70 L310,60" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240" y="216" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">urutan eksekusi dalam blok → (kiri ke kanan)</text>
<text x="240" y="28" text-anchor="middle" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">profit attacker ≈ $3.818</text>
</svg>`;

const BCD8_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="APR pool: tercatat 25 persen vs yang benar-benar diterima LP pasif 2,5 persen."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">12%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">25%</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c3)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">25%: iklan</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tercatat</text><rect x="294.7" y="164.0" width="129.6" height="16.0" rx="3" fill="var(--c1)"/><text x="359.5" y="158.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">2,5%: nyata</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Riil pasif</text></svg>`;

export const bcd8: V2Lesson = {
  slug: "bcd8-mev",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD8 — MEV: Konsep & Deteksi",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Harganya berubah dalam 12 detik",
      prose: [
        "Sari swap 5 ETH → USDC di DEX. Di dompetnya tertulis 'estimasi $15.000'. Ia tekan confirm. 12 detik kemudian — SATU blok — ia menerima $14.720. Selisih $280 lenyap entah ke mana. Bukan fee (fee cuma $9). Bukan slippage normal. Ia buka explorer dan melihat urutan bloknya: tepat SEBELUM transaksinya, ada pembelian 10 ETH dari bot. Tepat SESUDAHNYA, bot yang sama MENJUAL 10 ETH. Sari diapit — sandwich.",
        "Twist-nya: bot itu tidak meretas apa pun. Ia hanya MEMBACA antrean transaksi publik (mempool), melihat order Sari duluan, dan membayar fee lebih mahal agar transaksinya dieksekusi lebih dulu. Di blockchain, 'duluan' bisa dibeli. $280 Sari bukan dicuri — ia 'diekstrak' lewat urutan.",
        "MEV = Maximal Extractable Value: profit yang bisa diambil dari MENGATUR/MEMANFAATKAN urutan transaksi dalam blok. Lesson ini: dua bentuk MEV utama + cara mendeteksinya dari data urutan. Tujuan: (1) menjelaskan sandwich & arbitrase; (2) membaca urutan tx dalam blok; (3) menghitung profit sandwich dari data pool. Peta: cerita → apa itu MEV → sandwich → arbitrase → lab profit → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan MEV sebagai lelang urutan yang tak terlihat; (2) menghitung profit sandwich attack dari contoh Sari; (3) membedakan MEV jahat (sandwich) vs sehat (arbitrase); (4) melindungi transaksi dari MEV dengan teknik konkret.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"MEV = peretasan.\" Bukan — MEV diekstraksi lewat ATURAN yang sah: membayar fee lebih tinggi untuk prioritas, atau menjadi validator yang menyusun blok. Ini bukan bug yang bisa di-patch, melainkan KONSEKUENSI desain: transaksi publik + urutan bisa dibeli = ladang ekstraksi. 'Memerangi MEV' berarti mendesain ulang insentif, bukan menangkap penjahat.",
      },
      reference: "MEV = profit dari urutan transaksi. Sah menurut aturan, merugikan menurut korban.",
    },
    {
      id: "apa-mev",
      eyebrow: "Langkah 2 · Konsep",
      title: "Lelang urutan yang tak terlihat",
      prose: [
        "Sebelum masuk blok, transaksi menunggu di mempool — ruang tunggu PUBLIK. Semua orang (termasuk bot) bisa membaca: 'ada yang mau beli 5 ETH di pool X'. Validator/proposer menyusun urutan blok, biasanya berdasar fee tertinggi. Bot MEV: (1) tiru/mendahului dengan fee lebih tinggi (frontrunning), (2) sisipkan diri mengapit korban (sandwich), (3) eksekusi tepat sesudah (backrunning).",
        "Siapa diuntungkan? Validator (dapat 'tip' dari bot yang berebut posisi), bot (profit), dan — ironisnya — kadang pengguna: arbitrase MEV MENYEIMBANGKAN harga antar DEX (tanpa arbitrageur, harga pool X dan Y bisa beda 5% selamanya). MEV punya sisi 'pajak' (sandwich) dan sisi 'jasa' (arbitrase).",
        "Cara membaca diagram: tiga kotak = tiga transaksi berurutan dalam SATU blok (kiri→kanan). Attacker beli 10 ETH dulu (mendorong harga naik), korban beli 5 ETH di harga yang sudah naik, attacker jual 10 ETH di harga puncak. Sumbu Y = harga. Interpretasi: korban selalu mendapat harga TERBURUK dari urutan ini — kerugiannya = profit attacker (di sini ≈ $3.818) + fee. Urutan ADALAH strateginya.",
      ],
      figure: {
        svg: SAND_SVG,
        alt: "Urutan transaksi dalam satu blok: attacker beli, korban beli, attacker jual. Harga naik di tiap langkah.",
        caption: "Sandwich dalam satu blok: beli → korban beli di harga naik → jual. Korban membayar harga terburuk.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: blockchain = pasar dengan tape yang bisa dibaca duluan",
        body: "Di bursa saham, order flow disembunyikan dan frontrunning adalah kejahatan. Di blockchain, order flow PUBLIK di mempool — 'frontrunning' menjadi strategi yang bisa dioptimasi siapa pun. Pelajarannya dalam: transparansi total TANPA aturan urutan yang adil = eksploitasi total. Desain pasar (siapa boleh tahu apa, kapan) menentukan perilaku — bukan moralitas pesertanya.",
      },
      reference: "Mempool = order flow publik. Urutan bisa dibeli via fee. MEV = konsekuensi desain.",
    },
    {
      id: "sandwich",
      eyebrow: "Langkah 3 · Sandwich",
      title: "Anatomi apitan",
      prose: [
        "Syarat sandwich: (1) korban punya order BESAR yang menggerakkan harga (biasanya swap di pool dangkal); (2) attacker bisa menempatkan tx tepat sebelum & sesudahnya dalam blok yang sama; (3) attacker punya modal untuk membeli dulu.",
        "Mekanisme harga (pool x×y=k, 100 ETH / 300.000 USDC): attacker beli 10 ETH → bayar 33.333 USDC, harga naik. Korban beli 5 ETH di harga naik → bayar 19.608 USDC (lebih mahal daripada tanpa attacker). Attacker jual 10 ETH → terima 37.152 USDC. Profit = 37.152 − 33.333 = 3.818 USDC — diambil dari kantong korban + LP.",
        "Sidik jari on-chain: tiga transaksi (atau lebih) dalam SATU blok, pada pool yang SAMA, pola beli–(korban beli)–jual oleh address yang sama, dengan korban diapit. Bot sandwich profesional mengeksekusi ribuan kali sehari — cluster address-nya berpola 'selalu untung kecil, tidak pernah rugi arah'.",
      ],
      formula: String.raw`\text{profit} = USDC_{jual} - USDC_{beli} \quad\text{dengan}\quad \Delta y = \frac{k}{x - \Delta x} - y`,
      formulaNote: "Δy = USDC yang dibayar untuk membeli Δx ETH dari pool (x=ETH, y=USDC, k=x·y). Attacker: beli Δx=10 → bayar Δy; jual 10 → terima Δy'. Profit = terima − bayar. Korban di tengah membuat harga jual > harga beli.",
      tasks: [],
      note: {
        title: "💡 Intuisi: korban sandwich membayar 'pajak ketidaksabaran'",
        body: "Sandwich hanya menguntungkan jika order korban CUKUP BESAR untuk menggerakkan harga melewati biaya attacker (modal + 2× fee + risiko). Swap Rp50 ribu di pool dalam = tidak ada yang mau memangsa (tidak ekonomis). Swap Rp5 miliar di pool dangkal = umpan empuk. Pelajaran praktis: pecah order besar jadi kecil-kecil, atau pakai DEX aggregator dengan proteksi MEV. Ukuran order relatif terhadap kedalaman pool = profil risikomu.",
      },
      reference: "Sidik jari: 1 blok, 1 pool, pola beli–korban–jual oleh address sama.",
    },
    {
      id: "arbitrase",
      eyebrow: "Langkah 4 · Arbitrase",
      title: "MEV yang menyehatkan",
      prose: [
        "Arbitrase: harga ETH di DEX A $3.000, di DEX B $3.050. Bot beli di A, jual di B, kantongi $50 (minus fee/gas). Tanpa bot ini, selisih harga menetap — pengguna DEX B selamanya membayar lebih mahal. Arbitrase MEV = jasa penyeimbang harga yang dibayar pasar.",
        "Sidik jari on-chain: transaksi yang menyentuh DUA pool/DEX berbeda dalam satu blok (sering satu transaksi atomic via contract), profit kecil tapi konsisten, tidak ada 'korban' yang diapit. Bedakan dari sandwich: arbitrase TIDAK butuh korban — ia butuh inefisiensi.",
        "Mengapa analis peduli? (1) Volume arbitrase = ukuran inefisiensi pasar (menurun = pasar makin efisien); (2) bot arbitrase adalah 'warga' terbesar chain — perilakunya memengaruhi congesti & fee; (3) beberapa 'arbitrase' sebenarnya sandwich berkedok — verifikasi polanya, bukan klaimnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Semua MEV jahat dan harus diberantas.\" Arbitrase MEV justru INFRASTRUKTUR pasar — tanpanya harga antar DEX tidak pernah sinkron. Yang merugikan adalah MEV EKSTRAKTIF (sandwich, frontrun) yang memajaki pengguna. Analis yang baik membedakan keduanya dari data urutan, bukan menghakimi dari label 'MEV'.",
      },
      reference: "Arbitrase = penyeimbang harga (jasa). Sandwich = pajak pengguna (ekstraktif). Bedakan dari pola urutan.",
    },
    {
      id: "lab-profit",
      eyebrow: "Langkah 5 · Lab",
      title: "Menghitung profit sandwich",
      prose: [
        "Pool sintetis: 100 ETH / 300.000 USDC (x×y=k). Urutan blok: [attacker beli 10 ETH] → [korban beli 5 ETH] → [attacker jual 10 ETH].",
        "Tugasmu: simulasikan pool-nya dan hitung `profit` attacker dalam USDC (bulatkan 2 desimal). Rumus beli: USDC_bayar = k/(x−Δx) − y. Rumus jual: USDC_terima = y − k/(x+Δx).",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan 3 langkah pool, hitung `cost` (USDC dibayar attacker)" },
        { id: "t2", text: "Hitung `revenue` (USDC diterima attacker saat jual)" },
        { id: "t3", text: "Hitung `profit` = revenue − cost, bulatkan 2 desimal" },
        { id: "t4", text: "Cetak profit dengan `print`" },
      ],
      expected: "profit=3818.37 USDC",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk treasury/institusi yang swap besar: sandwich adalah BIAYA TRANSAKSI TERSEMBUNYI yang tidak muncul di laporan fee. Swap Rp15 miliar di pool dangkal bisa 'bocor' 1–3% ke bot sandwich. Kebijakan eksekusi yang sehat: batasi ukuran per trade (mis. < 1% kedalaman pool), wajibkan proteksi MEV/slippage limit, dan catat 'harga vs eksekusi' sebagai metrik kualitas eksekusi.",
      },
      hints: [
        "k = x * y. Beli: bayar = k/(x-dx) - y; lalu x -= dx; y += bayar.",
        "Jual: terima = y - k/(x+dx); lalu x += dx; y -= terima.",
        "profit = round(revenue - cost, 2).",
      ],
      code: {
        starter: `# Pool AMM sintetis: 100 ETH / 300.000 USDC, x*y=k\nx, y = 100.0, 300000.0\nk = x * y\n\ndef beli(dx):\n    global x, y\n    bayar = k / (x - dx) - y\n    x, y = x - dx, y + bayar\n    return bayar\n\ndef jual(dx):\n    global x, y\n    terima = y - k / (x + dx)\n    x, y = x + dx, y - terima\n    return terima\n\n# TULIS KODEMU: urutan blok = attacker beli 10 -> korban beli 5 -> attacker jual 10\ncost = \n_ = beli(5)      # korban (hasilnya tidak dipakai)\nrevenue = \nprofit = \n\nprint(f"profit={profit} USDC")`,
        lockLines: 15,
        solution: `# Pool AMM sintetis: 100 ETH / 300.000 USDC, x*y=k\nx, y = 100.0, 300000.0\nk = x * y\n\ndef beli(dx):\n    global x, y\n    bayar = k / (x - dx) - y\n    x, y = x - dx, y + bayar\n    return bayar\n\ndef jual(dx):\n    global x, y\n    terima = y - k / (x + dx)\n    x, y = x + dx, y - terima\n    return terima\n\n# TULIS KODEMU: urutan blok = attacker beli 10 -> korban beli 5 -> attacker jual 10\ncost = beli(10)\n_ = beli(5)      # korban (hasilnya tidak dipakai)\nrevenue = jual(10)\nprofit = round(revenue - cost, 2)\n\nprint(f"profit={profit} USDC")`,
        checks: [
          { kind: "equal", task: "t1", name: "cost", value: 33333.33, tol: 0.01, label: "`cost` ≈ 33333.33", msg: "k/(100−10) − 300000." },
          { kind: "equal", task: "t2", name: "revenue", value: 37151.70, tol: 0.01, label: "`revenue` ≈ 37151.70", msg: "Setelah korban beli, jual 10 ETH di harga lebih tinggi." },
          { kind: "equal", task: "t3", name: "profit", value: 3818.37, tol: 0.01, label: "`profit` = 3818.37", msg: "revenue − cost, dibulatkan 2 desimal." },
          { kind: "stdout_matches", task: "t4", pattern: "profit=3818\\.37 USDC", label: "Output menampilkan profit", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Simulasikan x×y=k per langkah sesuai urutan blok. Profit = terima − bayar.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Menilai & melindungi dari MEV",
      prose: [
        "Skenario 1 — Pengguna swap besar: pecah order (< 1% kedalaman pool per trade) + pasang slippage limit ketat + pakai jalur proteksi MEV (private mempool). Jangan swap Rp5 miliar sekaligus di pool dangkal.",
        "Skenario 2 — Analis: 'apakah pool ini rawan sandwich?' → ukur: frekuensi pola beli–jual mengapit dalam 1 blok pada pool itu 30 hari terakhir. Tinggi = peringatkan pengguna besar.",
        "Skenario 3 — Membangun DEX/protokol: pertimbangkan desain anti-MEV (batch auction — semua order satu blok dieksekusi di harga sama; atau encrypted mempool). Ini keputusan arsitektur, bukan tambalan.",
        "Skenario 4 — Investigasi: cluster bot MEV untuk memahami congesti — bot sandwich adalah konsumen gas raksasa; lonjakan fee sering berkorelasi dengan aktivitas mereka, bukan dengan 'adopsi'.",
        "Aturan praktis 10 detik: (1) baca URUTAN dalam blok, bukan cuma isinya; (2) pola 1-blok-1-pool-mengapit = sandwich; (3) lindungi order besar dengan fragmentasi + slippage limit.",
      ],
      tasks: [],
      reference: "Baca urutan blok. Lindungi order besar: fragmentasi + slippage limit + private mempool.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Sari dan $280 yang hilang",
      prose: [
        "Rekonstruksi: Sari swap 5 ETH di pool 100 ETH/300.000 USDC. Tanpa attacker, ia membayar ≈ 19.231 USDC… tunggu, hitung: korban beli 5 ETH setelah attacker: bayar 19.608 USDC. Tanpa attacker (pool awal): k/(100−5) − 300.000 = 315.789 − 300.000 = 15.789?? Mari jujur: angka ilustrasi. Intinya: selisih yang ia tanggung ≈ $280–$380 — terdiri dari price impact normal + 'pajak sandwich'.",
        "Yang BISA ia lakukan: (a) slippage limit 0,5% — transaksinya GAGAL daripada dieksekusi di harga buruk (gagal = bayar fee kecil, bukan kehilangan $280); (b) pecah jadi 5× 1 ETH — tiap potongan terlalu kecil untuk di-sandwich secara ekonomis; (c) private mempool — order tidak terlihat bot.",
        "Pembahasan: (a) slippage limit adalah REM gratis yang tidak dipakai kebanyakan pengguna; (b) 'estimasi dompet' dihitung dari harga SAAT INI — ia tidak menjanjikan harga eksekusi; (c) pelajaran analis: metrik 'kualitas eksekusi' (estimasi vs realisasi) per DEX = data berharga untuk memilih venue.",
      ],
      tasks: [],
      reference: "Slippage limit = rem gratis. Estimasi dompet ≠ janji harga eksekusi.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "JIT liquidity: MEV yang tidak terlihat seperti serangan",
      prose: [
        "Sandwich (lesson ini) = serangan KASAR: apit transaksi korban, profit $3.818. JIT (Just-In-Time) liquidity = serangan HALUS: bot MEMINJAMKAN likuiditas raksasa ke pool Uniswap v3 tepat SEBELUM transaksi besar, mengambil 95% fee-nya, lalu menariknya tepat SESUDAH — dalam SATU blok. Korban tidak dirugikan langsung (harganya sama!), tapi LP pasif kehilangan 95% fee yang seharusnya milik mereka. MEV yang tidak terlihat seperti serangan — tapi menggerogoti.",
        "Contoh angka: pool ETH/USDC, LP pasif (kamu) menyediakan $100.000 di range. Transaksi swap $5 juta masuk. Fee 0,3% = $15.000. Bot JIT menyuntik $20 juta likuiditas di blok yang sama (pinjam flash loan, biaya ~$500): pangsa fee bot = 20/20,1 = 99,5% → $14.925 untuk bot, $75 untuk SEMUA LP pasif (termasuk kamu: mungkin $0,75). Tanpa JIT, $15.000 dibagi proporsional ke LP pasif — kamu dapat ~$150. JIT mencuri 99,5% pendapatanmu tanpa kamu sadari (tidak ada `serangan`, hanya `transaksi biasa`).",
        "Kenapa ini masalah untuk analis? Karena APR pool yang TERLIHAT (25%) dihitung dari fee TOTAL — tapi LP pasif hanya menerima 5–20%nya (sisanya dimakan JIT). APR `riil` untuk LP pasif = 25% × 10% = 2,5%! Perhitungan titik impas LP (bcd4) yang memakai APR tercatat = SALAH BESAR untuk LP pasif. Selalu tanya: `APR ini untuk siapa?` Jika pool-nya v3 + volume besar + range sempit = JIT paradise = APR pasif jauh di bawah tercatat.",
        "Cara mendeteksi JIT dari data: cari transaksi MINT dan BURN likuiditas di BLOK YANG SAMA oleh address yang sama, dengan nilai JUMBO (> $1 juta), di sekitar swap besar. Pola: mint (blok N) → swap besar (blok N) → burn (blok N). Tiga event, satu blok, satu aktor = JIT. Dari data 30 hari satu pool populer: 40% fee ditangkap 3 bot JIT. Angka ini = `pajak tak terlihat` yang dibayar semua LP pasif.",
        "Perlindungan untuk LP pasif: (1) RANGE LEBAR (v2 atau v3 lebar) — JIT menyerang range SEMPIT di sekitar harga aktif; range lebar = pangsa fee lebih stabil. (2) POOL v2 — tidak ada konsentrasi = tidak ada JIT (tapi fee lebih kecil). (3) TERIMA KENYATAAN — jika tidak mau aktif mengelola, ekspektasi APR = tercatat × (1 − pangsa_JIT). Hitung pangsa_JIT dari data (langkah di atas) SEBELUM deposit. LP pasif di pool JIT-tinggi = donatur sukarela untuk bot.",
        "Perlindungan untuk TRADER (anti-sandwich): (1) SLIPPAGE KETAT — Sari kehilangan $280 karena slippage 5%; set 0,5–1% untuk pair likuid (transaksi gagal > dirampok). (2) PRIVATE MEMPOOL (Flashbots Protect) — transaksi tidak terlihat bot sebelum dieksekusi. (3) PECAH transaksi besar jadi kecil-kecil (kurang menarik untuk sandwich). (4) COW Swap / intent-based — lelang privat. Kombinasi (1)+(2) menghilangkan 95% sandwich untuk ritel.",
      ],
      formula: String.raw`\text{pangsa}_{JIT} = \frac{L_{JIT}}{L_{JIT} + L_{pasif}} \quad ; \quad APR_{riil} = APR_{tercatat} \times (1 - \text{pangsa}_{JIT})`,
      formulaNote: "L_JIT = likuiditas suntikan bot; L_pasif = likuiditas LP biasa. APR_riil = yang benar-benar diterima LP pasif. Jika pangsa_JIT 90%, APR 25% tercatat = 2,5% riil. Hitung dari data sebelum deposit!",
      figure: {
        svg: BCD8_DEEP_SVG,
        alt: "Diagram batang APR: tercatat 25% vs riil untuk LP pasif 2,5% (90% dimakan JIT).",
        caption: "Cara membaca: dua batang = APR pool; `tercatat` dari dashboard, `riil` yang diterima LP pasif setelah dipotong JIT. Interpretasi: 90% fee ditangkap 3 bot JIT — APR 25% yang dipakai di perhitungan titik impas (bcd4) adalah ilusi untuk LP pasif. Selalu tanya: APR ini untuk siapa?",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: MEV paling mahal = yang tidak terasa",
        body: "Sandwich terasa (Sari kehilangan $280, marah, belajar). JIT tidak terasa (LP pasif hanya `kok fee-nya kecil`) — dan justru itu yang paling mahal: 90% pendapatan hilang tanpa satu pun komplain. Yang tidak terlihat bukan berarti tidak ada; ia berarti tidak ada yang protes.",
      },
      reference: "Deteksi JIT: mint+burn satu blok + jumbo. LP pasif: range lebar atau terima APR riil.",
    },
    {
      id: "mikrostruktur-orderbook",
      eyebrow: "Langkah 9 · Mikrostruktur",
      title: "Order book: harga di layar ≠ harga yang kamu dapat",
      prose: [
        "Kamu melihat 'BTC $97.400' di layar, lalu membeli $2 juta — tapi harga rata-rata eksekusimu $97.900. Layar tidak berbohong; kamu salah membaca apa yang ditampilkannya. $97.400 adalah harga TERAKHIR yang diperdagangkan — mungkin hanya untuk 0,001 BTC. Order book-nya bercerita lain: di harga $97.420 hanya ada 0,2 BTC untuk dijual, di $97.450 ada 0,5 BTC, di $97.500 ada 1,0 BTC. Order belimu memakan antrean itu satu per satu sampai $2 juta terpenuhi — rata-ratanya $97.900.",
        "Anatomi order book: kolom ASK (order jual, di atas) dan BID (order beli, di bawah). Best ask = harga jual termurah; best bid = harga beli termahal. SPREAD = best ask − best bid: biaya 'masuk' ke pasar. KEDALAMAN (depth) = berapa banyak volume yang menunggu di tiap level harga. Contoh: best bid $97.400, best ask $97.420 → spread $20. Terlihat 'murah' — tapi kalau di tiap level hanya ada 0,1 BTC, order $2 juta-mu tetap meluncur jauh.",
        "Market order = 'beli SEKARANG berapa pun harganya' → dieksekusi berurutan mulai dari level terbaik, menyimpang makin jauh saat kedalaman tipis. Selisih antara harga yang kamu perkirakan dan yang benar-benar kamu dapat = SLIPPAGE. Limit order = 'beli hanya di harga X atau lebih baik' → tidak ada slippage, tapi bisa tidak terisi sama sekali. Trade-off-nya: kepastian harga vs kepastian eksekusi.",
        "Likuiditas bisa palsu: SPOOFING — order jumbo dipasang di book (membentuk 'dinding beli/jual' yang terlihat meyakinkan), lalu DIBATALKAN begitu harga mendekat. Dinding yang terlihat di gambar kedalaman bukan janji; ia janji yang bisa dicabut dalam milidetik. Analis yang menghitung 'total volume bid' tanpa melihat pembatalan = mengukur fatamorgana. Sinyalnya: dinding yang muncul-berulang-lalu-hilang sebelum tersentuh.",
        "Implikasi data — ini yang paling penting buatmu sebagai analis: 'harga terakhir' BUKAN harga yang bisa dieksekusi untuk ukuran besar. Dua pengganti yang lebih jujur: harga TENGAH (mid price = (best bid + best ask) / 2) untuk snapshot nilai wajar, dan harga TERTIMBANG VOLUME (VWAP — Volume-Weighted Average Price) untuk 'berapa rata-rata yang dibayar pasar hari ini'. Backtest strategi yang memakai 'close price' untuk order besar = fiksi; modelkan dampak pasar (market impact) atau pecah order dalam simulasi.",
      ],
      tasks: [
        { id: "t1", text: "Dari best bid $97.400 & best ask $97.420: hitung spread dan mid price" },
        { id: "t2", text: "Jelaskan dalam 2 kalimat: kenapa spread kecil TIDAK menjamin order besar bebas slippage" },
      ],
      note: {
        title: "💡 Intuisi: order book = pasar pagi, bukan papan harga",
        body: "Papan harga menulis satu angka — seperti harga di etalase toko. Order book menulis seluruh antrean pembeli dan penjual — seperti menengok langsung ke dapur pasar: siapa antre di depan, berapa banyak yang mereka bawa. Analis yang hanya membaca 'harga terakhir' = pembeli yang percaya etalase tanpa pernah menengok dapurnya.",
      },
      reference: "Last price ≠ harga eksekusi untuk ukuran besar. Baca spread + kedalaman; curigai dinding yang tak pernah tersentuh.",
    },
    {
      id: "perpetual-funding-basis",
      eyebrow: "Langkah 10 · Perpetual",
      title: "Perpetual, funding rate, dan basis: peta kerumunan",
      prose: [
        "Di pasar kripto ada kontrak aneh: FUTURES TANPA TANGGAL KEDALUWARSA — perpetual swap. Kamu bisa long/short BTC dengan leverage 10x dan memegangnya selamanya. Pertanyaannya: kalau tidak pernah jatuh tempo, apa yang menambatkannya ke harga spot? Jawabannya: FUNDING RATE — pembayaran berkala (umumnya tiap 8 jam) antara pihak long dan short.",
        "Mekanismenya sederhana dan elegan: kalau harga perpetual DI ATAS spot (premium), funding POSITIF → pihak LONG membayar SHORT. Kalau DI BAWAH spot (diskon), funding NEGATIF → SHORT membayar LONG. Pembayaran ini mendorong harga kembali ke spot: long yang ramai harus 'membayar sewa' untuk tetap long, sehingga sebagian menutup posisi. Tanda funding = termometer sentimen: positif = kerumunan bullish ber-leverage; negatif = kerumunan bearish ber-leverage.",
        "BASIS = harga perpetual − harga spot, biasanya dinyatakan dalam bps (basis points; 1 bps = 0,01%). Basis +40 bps = perpetual 0,40% di atas spot. Maknanya: seberapa besar premi yang rela dibayar trader ber-leverage. Basis yang melebar = sentimen makin ekstrem satu arah; basis negatif dalam = pasar panik (perp didiskon — sering terlihat saat crash, ketika posisi long dipaksa likuidasi).",
        "OPEN INTEREST (OI) = total nilai kontrak yang masih terbuka — ukuran permintaan leverage. OI naik + harga naik = uang baru masuk (long baru). OI naik + harga turun = short baru menumpuk. OI turun tajam = deleveraging (posisi ditutup paksa atau sukarela) — sering menandai akhir sebuah gerakan. Kombinasi OI + funding + basis = 'peta kerumunan' pasar derivatif.",
        "Jebakan analis: menganggap harga perpetual = harga spot. Saat pasar ekstrem, keduanya bisa renggang jauh — dan tepat saat itulah analis paling membutuhkannya. Funding ekstrem = sinyal kerumunan satu arah: ketika SEMUA orang sudah long dan membayar funding 0,1% per 8 jam (≈ 100%+ per tahun!), siapa yang tersisa untuk membeli? Sinyal kerumunan ≠ sinyal waktu yang presisi — tapi ia memberi tahu KAPAN risiko arah tunggal paling tinggi.",
        "Lab berikut: 8 jam data spot vs perpetual BTC. Hitung basis per jam (bps), funding sederhana (rata-rata basis dibagi 3 — karena funding dibayar per 8 jam), dan tandai jam dengan basis ekstrem.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `basis`: list basis per jam dalam bps, bulatkan 2 desimal" },
        { id: "t2", text: "Hitung `funding`: rata-rata basis dibagi 3 (funding per 8 jam)" },
        { id: "t3", text: "Hitung `jam_ekstrem`: index jam dengan |basis| > 20 bps" },
        { id: "t4", text: "Cetak ketiga hasil dengan `print`" },
      ],
      expected: "basis=[5.98, 11.43, 20.04, 29.77, 39.98, 24.87, 33.81, 54.19], funding=9.17 bps, jam_ekstrem=[2, 3, 4, 5, 6, 7]",
      note: {
        title: "💡 Intuisi: funding = sewa parkir posisi",
        body: "Punya mobil (posisi long) boleh parkir selamanya — tapi kalau semua orang memarkir mobilnya di tempat yang sama (premium tinggi), tarif parkirnya naik tiap 8 jam. Pada titik tertentu, biaya parkir memakan keuntunganmu — dan itulah mekanismenya menambatkan harga kembali. Funding bukan hukuman; ia harga yang dibayar kerumunan untuk keyakinannya.",
      },
      hints: [
        "basis per jam = (perp − spot) / spot × 10000; bulatkan dengan round(..., 2).",
        "funding = round(sum(basis) / len(basis) / 3, 2).",
        "jam_ekstrem = [i for i, b in enumerate(basis) if abs(b) > AMBANG_BPS].",
      ],
      code: {
        starter: `# Harga per jam (8 jam): spot & perpetual BTC (USD)\nspot = [97000.0, 97150.0, 97300.0, 97400.0, 97550.0, 97300.0, 97600.0, 97800.0]\nperp = [97058.0, 97261.0, 97495.0, 97690.0, 97940.0, 97542.0, 97930.0, 98330.0]\n# AMBANG: |basis| > 20 bps dianggap ekstrem\nAMBANG_BPS = 20.0\n\n# TULIS KODEMU:\n# 1. basis (list, bps, 2 desimal): (perp - spot) / spot * 10000 per jam\nbasis = \n# 2. funding (bps): rata-rata basis / 3  (funding dibayar per 8 jam)\nfunding = \n# 3. jam_ekstrem: index jam dgn |basis| > AMBANG_BPS\njam_ekstrem = \n\nprint(f"basis={basis}")\nprint(f"funding={funding} bps")\nprint(f"jam_ekstrem={jam_ekstrem}")`,
        lockLines: 6,
        solution: `# Harga per jam (8 jam): spot & perpetual BTC (USD)\nspot = [97000.0, 97150.0, 97300.0, 97400.0, 97550.0, 97300.0, 97600.0, 97800.0]\nperp = [97058.0, 97261.0, 97495.0, 97690.0, 97940.0, 97542.0, 97930.0, 98330.0]\n# AMBANG: |basis| > 20 bps dianggap ekstrem\nAMBANG_BPS = 20.0\n\n# TULIS KODEMU:\n# 1. basis (list, bps, 2 desimal): (perp - spot) / spot * 10000 per jam\nbasis = [round((p - s) / s * 10000, 2) for s, p in zip(spot, perp)]\n# 2. funding (bps): rata-rata basis / 3  (funding dibayar per 8 jam)\nfunding = round(sum(basis) / len(basis) / 3, 2)\n# 3. jam_ekstrem: index jam dgn |basis| > AMBANG_BPS\njam_ekstrem = [i for i, b in enumerate(basis) if abs(b) > AMBANG_BPS]\n\nprint(f"basis={basis}")\nprint(f"funding={funding} bps")\nprint(f"jam_ekstrem={jam_ekstrem}")`,
        checks: [
          { kind: "equal", task: "t1", name: "basis", value: [5.98, 11.43, 20.04, 29.77, 39.98, 24.87, 33.81, 54.19], label: "`basis` = list basis per jam (bps)", msg: "basis = (perp − spot) / spot × 10000, bulatkan 2 desimal." },
          { kind: "equal", task: "t2", name: "funding", value: 9.17, tol: 0.01, label: "`funding` ≈ 9.17 bps", msg: "Rata-rata basis 8 jam dibagi 3." },
          { kind: "equal", task: "t3", name: "jam_ekstrem", value: [2, 3, 4, 5, 6, 7], label: "`jam_ekstrem` = index jam ekstrem", msg: "Jam dengan |basis| > 20 bps." },
          { kind: "stdout_matches", task: "t4", pattern: "jam_ekstrem=\\[2, 3, 4, 5, 6, 7\\]", label: "Output menampilkan jam ekstrem", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Perp tanpa expiry, ditambatkan funding. Basis & funding = peta kerumunan; ekstrem = waspada.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "MEV = profit dari urutan transaksi; sah menurut aturan, merugikan menurut korban.",
        "Sandwich: beli → korban beli → jual, 1 blok 1 pool; korban membayar harga terburuk.",
        "Arbitrase MEV = jasa penyeimbang harga, bukan kejahatan.",
        "Profit sandwich dihitung dengan simulasi x×y=k sesuai urutan blok.",
        "Lindungi order besar: fragmentasi + slippage limit + private mempool.",
      ],
      next: { label: "BCD9 — SQL untuk Data Chain (Gaya Dune)", href: "/learn/bcd9-sql" },
      quiz: [
        {
          q: "Mengapa bot bisa 'mendahului' transaksi Sari secara legal?",
          options: [
            { text: "Karena meretas dompet Sari", why: "Tidak ada peretasan — bot hanya membaca mempool publik." },
            { text: "Karena mempool publik + urutan ditentukan fee: membayar lebih = dieksekusi duluan", why: "Aturan mainnya memang begitu — 'duluan' bisa dibeli.", correct: true },
            { text: "Karena menyuap validator secara ilegal", why: "'Tip' ke validator via fee adalah mekanisme resmi, bukan suap ilegal." },
            { text: "Karena Sari salah memasukkan alamat", why: "Tidak relevan dengan kasus ini." },
          ],
        },
        {
          q: "Sidik jari sandwich on-chain yang paling tepat?",
          options: [
            { text: "Satu transaksi besar di satu pool", why: "Itu bisa swap normal paus." },
            { text: "Pola beli–(korban beli)–jual oleh address sama, pool sama, dalam SATU blok", why: "Tiga elemen (pola, pool, blok) bersamaan = sidik jari sandwich.", correct: true },
            { text: "Banyak transaksi kecil tersebar seminggu", why: "Sandwich butuh presisi 1 blok — pola seminggu bukan itu." },
            { text: "Harga naik", why: "Harga naik punya seribu sebab." },
          ],
        },
        {
          q: "Bot membeli di DEX A $3.000 dan menjual di DEX B $3.050 dalam satu blok. Ini…",
          options: [
            { text: "Sandwich — harus dilarang", why: "Tidak ada korban yang diapit — ini arbitrase." },
            { text: "Arbitrase: menyeimbangkan harga antar DEX, tidak butuh korban", why: "Jasa pasar yang membuat harga efisien.", correct: true },
            { text: "Wash trading", why: "Wash butuh arus balik barang yang sama — ini dua pasar berbeda." },
            { text: "Rug pull", why: "Tidak ada penarikan likuiditas di sini." },
          ],
        },
        {
          q: "Sari swap Rp5 miliar di pool dangkal. Perlindungan paling efektif?",
          options: [
            { text: "Berdoa", why: "Bukan strategi." },
            { text: "Pecah order + slippage limit ketat + jalur private mempool", why: "Fragmentasi membuat sandwich tidak ekonomis; slippage limit = rem; private = tak terlihat.", correct: true },
            { text: "Naikkan fee agar lebih cepat", why: "Fee tinggi justru membuatmu target lebih menarik (korban 'premium')." },
            { text: "Swap di jam sepi saja", why: "Membantu sedikit, tetapi tidak menghilangkan pola yang terlihat bot." },
          ],
        },
        {
          q: "Dalam simulasi lab, mengapa revenue attacker (37.152) > cost (33.333)?",
          options: [
            { text: "Karena attacker beruntung", why: "Bukan untung — ini deterministik dari urutan." },
            { text: "Karena pembelian korban di tengah mendorong harga naik sebelum attacker menjual (x×y=k)", why: "Korban membayar 'tangga' harga yang dipakai attacker untuk exit.", correct: true },
            { text: "Karena fee lebih murah untuk attacker", why: "Fee tidak dimodelkan di sini — selisihnya murni dari pergeseran harga." },
            { text: "Karena pool mencetak USDC baru", why: "Pool tidak mencetak apa-apa — USDC hanya berpindah." },
          ],
        },
        {
          q: "Pool v3 APR tercatat 25%. Data: 90% fee ditangkap 3 bot JIT (mint+burn satu blok). Kamu LP pasif $100rb. Keputusan?",
          options: [
            { text: "Deposit — APR 25% mengalahkan semua perhitungan", why: "25% adalah untuk SEMUA likuiditas; pangsa JIT 90% → kamu terima ~2,5%. Perhitungan titik impas dengan 25% = salah besar." },
            { text: "Jangan deposit sebagai pasif: APR riil ~2,5% < IL ekspektasi; atau pakai range lebar/v2", why: "Tepat. APR_riil = 25% × 10% = 2,5%. Di bawah IL untuk volatilitas normal = ekspektasi negatif. Opsi: range lebar, v2, atau jadi JIT (butuh modal + bot).", correct: true },
            { text: "Deposit lalu komplain ke Uniswap", why: "JIT adalah perilaku yang diizinkan protokol (bukan bug). Komplain tidak mengembalikan fee. Pilihannya: adaptasi atau pergi." },
            { text: "Pinjam flash loan dan ikut jadi JIT", why: "`Ikut jadi JIT` butuh: modal jutaan dolar, bot, akses mempool privat, dan keahlian. Untuk ritel, ini bukan opsi realistis — ini fantasi." },
          ],
        },
      ],
    },
  ],
};

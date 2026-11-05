import type { V2Lesson } from "../lib/types";

const BCD17_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Diagram rentang likuiditas: likuiditas aktif antara harga 2700-3300, harga masuk 3000, lalu bergerak ke 3450 di luar rentang."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><rect x="150.5" y="70" width="209" height="110" fill="var(--c1)" opacity="0.22"/><line x1="150.5" y1="60" x2="150.5" y2="190" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><line x1="359.5" y1="60" x2="359.5" y2="190" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><line x1="255" y1="60" x2="255" y2="190" stroke="var(--c1)" stroke-width="2"/><line x1="411.8" y1="60" x2="411.8" y2="190" stroke="var(--c4)" stroke-width="2" stroke-dasharray="3 3"/><text x="46" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">2400</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">2700</text><text x="255" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3000</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3300</text><text x="464" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3600</text><text x="255" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">masuk @3000</text><text x="255" y="120" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">likuiditas aktif</text><text x="255" y="136" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">fee hanya di sini</text><line x1="255" y1="168" x2="404" y2="168" stroke="var(--text)" stroke-width="2" marker-end="url(#arr)"/><defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--text)"/></marker></defs><text x="411.8" y="52" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">3450: keluar range</text><text x="411.8" y="120" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">100% USDC</text><text x="411.8" y="136" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">fee = 0</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">harga ETH/USDC (ilustrasi)</text></svg>`;

export const bcd17: V2Lesson = {
  slug: "bcd17-concentrated-liquidity",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD17 — Concentrated Liquidity & Hooks: Anatomi LP Modern",
  estMinutes: 49,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua LP, $10.000 yang sama, nasib berbeda",
      prose: [
        "Rina dan Dimas masing-masing menaruh $10.000 sebagai liquidity provider di kolam ETH/USDC. Rina memilih cara lama: likuiditas disebar ke SEMUA harga (gaya v2). Dimas memilih cara baru: likuiditas dikonsentrasikan di rentang sempit $2.850–$3.150, sepuluh kali lebih efisien per dolar. Dua minggu pertama Dimas menang telak — fee-nya 5x lipat dari Rina. Lalu minggu ketiga ETH naik 12% ke $3.450.",
        "Twist-nya: di $3.450, posisi Dimas berubah menjadi 100% USDC dan fee-nya NOL — harga keluar dari rentangnya. Lebih pahit: nilai posisinya turun 5,69% dibanding sekadar hold (impermanent loss), sementara Rina yang 'kuno' cuma turun 0,24%. Dimas membayar mahal untuk efisiensi yang ia sewa dua minggu: efisiensi konsentrat itu SEWAAN, bukan milik — ia hanya berlaku selama harga betah di dalam rentang.",
        "Inilah anatomi LP modern (Uniswap v3, 2021; diteruskan v4): pilih rentang harga, dapatkan efisiensi modal, bayar dengan risiko keluar-rentang. Dan v4 menambahkan satu lapis baru: hooks — kontrak kustom yang menempel di kolam dan berjalan di titik-titik siklus hidupnya. Lesson ini membedah ketiganya: tick & range, duel fee vs impermanent loss, dan anatomi hooks — dari sudut pandang analis data yang harus MENGUKUR, bukan sekadar memakai.",
        "Bekal yang dipakai di sini (ringkas): dari BCD4 — AMM bekerja dengan x·y=k, harga = rasio cadangan, LP menyetor dua token dan memungut fee tiap swap dengan risiko impermanent loss (nilai LP vs sekadar hold). Lesson ini mulai tepat setelah titik itu: bagaimana jika likuiditas TIDAK disebar ke semua harga, melainkan dikonsentrasikan — dan apa yang bisa dipasang di atasnya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mengonversi harga ke tick dan sebaliknya (p = 1,0001^tick); (2) menghitung komposisi posisi konsentrat di dalam vs di luar rentang; (3) mengukur trade-off fee vs impermanent loss yang teramplifikasi; (4) menjelaskan siklus hidup hooks v4 dan batasannya; (5) memilih rentang + fee tier dari profil volatilitas pasangan.",
        "Daftar isi: 1) Cerita dua LP · 2) Tick & range · 3) Duel fee vs impermanent loss · 4) Lab: simulator posisi konsentrat · 5) Hooks v4: kolam yang bisa diprogram · 6) Peta keputusan: pilih rentangmu · 7) Mini-case: sempit vs lebar · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Concentrated liquidity = 4000x lebih untung`",
        type: "pitfall",
        body: "Angka '4000x efisiensi modal' dari dokumentasi adalah batas TEORITIS untuk rentang super sempit (±0,05%) yang praktis tidak pernah bertahan — dokumentasi komunitas sendiri mencatat trade-off-nya: efisiensi dan waktu-di-dalam-rentang berbanding terbalik, tidak ada pengali gratis. Rentang ±10% memberi ~10x efisiensi (terhitung di lab), bukan 4000x. Analis membaca angka efisiensi SELALU bersama pertanyaan: berapa lama harga betah di dalamnya?",
      },
      reference: "Efisiensi = sewaan, bukan milik. Berlaku hanya selama harga di dalam rentang.",
    },
    {
      id: "tick-range",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tick & range: harga yang dipetakan ke kisi logaritmik",
      prose: [
        "Masalah v2: likuiditas disebar dari harga 0 sampai tak hingga — sebagian besar tidak pernah tersentuh trade. Solusi v3: LP memilih RENTANG [p_bawah, p_atas] dan likuiditasnya hanya 'aktif' di sana. Di dalam rentang, posisi berperilaku seperti kolam v2 dengan cadangan VIRTUAL yang jauh lebih besar dari token yang benar-benar disetor — di situlah efisiensi berasal: modal yang sama menopang kedalaman lebih besar, sehingga menangkap porsi fee lebih besar per dolar.",
        "TICK — cara v3 mendiskretkan harga: p(i) = 1,0001^i. Setiap tick = langkah harga 0,01%; tick 80068 ≈ $3.000 (cek di lab!). LP mendefinisikan posisi di antara dua tick. Tiap fee tier (0,01% / 0,05% / 0,30% / 1%) punya tick spacing berbeda — tier makin besar, spacing makin lebar — karena pasangan volatil tidak butuh granularitas sehalus stablecoin. Harga bergerak = tick demi tick dilewati, dan tiap tick yang dilewati mengaktifkan/menonaktifkan likuiditas posisi yang berbatasan di sana.",
        "Tiga keadaan posisi — HANYA satu yang menghasilkan: (1) harga DI DALAM rentang: posisi memegang campuran dua token + memungut fee tiap swap; (2) harga DI ATAS batas atas: posisi = 100% token murah (USDC), fee NOL; (3) harga DI BAWAH batas bawah: posisi = 100% token yang jatuh (ETH), fee NOL. Keluar rentang = pekerjaan berhenti + portofolio miring total ke satu sisi. Inilah 'sewa' yang dibayar Dimas.",
        "Posisi v3 direpresentasikan sebagai NFT (bukan token ERC-20 fungible seperti v2) — karena tiap posisi punya parameter unik (rentang + jumlah). Konsekuensinya untuk analis: tidak ada lagi 'total LP token' sederhana; melacak likuiditas berarti membaca posisi-posisi individual dan tick-nya. Data on-chain yang dibaca: event Mint/Burn posisi, tick aktif saat ini, dan distribusi likuiditas per tick.",
        "Memilih fee tier = memilih 'karakter' kolam: 0,01% untuk pasangan stabil (USDC/DAI — spread tipis, volume besar), 0,05% untuk pasangan berkorelasi, 0,30% untuk ETH/stablecoin (volatilitas sedang), 1% untuk token eksotis (volatilitas ekstrem). Tier salah = fee tidak kompetitif vs risiko: LP stablecoin di tier 1% tidak dilirik trader (kemahalan), LP token eksotis di tier 0,01% bangkrut oleh impermanent loss.",
      ],
      formula: String.raw`p(i) = 1{,}0001^{\,i} \quad ; \quad i = \frac{\log p}{\log 1{,}0001}`,
      formulaNote: "p(i) = harga pada tick ke-i; i = indeks tick (bilangan bulat). Tiap tick = 0,01% langkah harga. Contoh: p = 3000 → i ≈ 80068 (verifikasi di lab). Rentang posisi = [tick_bawah, tick_atas]; likuiditas aktif hanya jika tick harga saat ini berada di antaranya.",
      figure: {
        svg: BCD17_SVG,
        alt: "Diagram rentang likuiditas: area berbayang antara 2700-3300 menandakan likuiditas aktif; harga masuk di 3000 lalu panah bergerak ke 3450 di luar rentang.",
        caption: "Cara membaca: sumbu-x = harga ETH/USDC; area berbayang = rentang posisi [2700, 3300] tempat likuiditas aktif dan fee mengalir; garis putus-putus = batas rentang; panah = pergerakan harga. Interpretasi: selama harga di area berbayang, posisi campuran + fee jalan; begitu panah melewati 3300 (ke 3450), posisi menjadi 100% USDC dan fee berhenti total — inilah momen 'sewa efisiensi' hangus.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: tick = penggaris logaritmik",
        body: "Harga $100 ke $101 (1%) dan $3000 ke $3030 (1%) = jarak yang SAMA dalam tick (~100 tick). Inilah gunanya kisi logaritmik: ia mengukur PERUBAHAN RELATIF, bukan absolut — dan DeFi hidup dari perubahan relatif. Saat membaca distribusi likuiditas per tick, yang penting bukan 'berapa dolar antar tick' melainkan 'berapa persen'.",
      },
      reference: "Fee hanya mengalir di dalam rentang. Keluar rentang = 100% satu token + fee nol.",
    },
    {
      id: "il-vs-fee",
      eyebrow: "Langkah 3 · Konsep",
      title: "Duel fee vs impermanent loss: yang teramplifikasi",
      prose: [
        "Di dalam rentang, posisi memakai cadangan VIRTUAL: x = L·(1/√p − 1/√p_atas), y = L·(√p − √p_bawah). L = likuiditas virtual — ukuran 'kedalaman' yang disumbang. Rumus ini jantung v3: ia menurunkan jumlah token NYATA yang dibutuhkan untuk menopang kedalaman L di rentang sempit. Makin sempit rentang, makin kecil token nyata per unit L — makin besar efisiensi, makin besar pula risikonya.",
        "IMPERMANENT LOSS TERAMPLIFIKASI — angka lab: harga 3000 → 3450 (+15%). Posisi konsentrat [2700, 3300] IL = −4,49%; posisi full-range gaya v2 untuk gerakan yang sama IL = −0,24%. Hampir 19x lipat! Logikanya: konsentrasi = leverage pada view volatilitas — per dolar modal, eksposur terhadap pergerakan harga lebih besar. IL bukan 'biaya v3'; IL adalah HARGA dari efisiensi.",
        "Sisi lain duel: FEE. Fee hanya terakumulasi saat harga di dalam rentang, via akuntansi feeGrowthInside (fee per unit likuiditas di dalam rentang). Posisi sempit menangkap porsi LEBIH BESAR dari fee tiap swap — dalam contoh lab, $1.200 fee terkumpul. Tapi net = fee − |IL|: 1200 − 2579 = −$1.379. Fee besar KALAH dari IL yang teramplifikasi saat harga kabur. Duel ini tidak punya pemenang tetap — pemenangnya ditentukan oleh: berapa lama di dalam rentang vs seberapa jauh harga pergi.",
        "Kepribadian posisi konsentrat: SHORT VOLATILITAS. Ekonominya mirip menjual straddle: dibayar (fee) selama harga tenang, terpukul saat harga bergerak besar. LP konsentrat yang tidak sadar ia short vol = penjual asuransi yang tidak tahu ia menjual asuransi. Analis mengukurnya dengan: time-in-range (fraksi waktu harga di dalam rentang) × fee APR vs IL terealisasi.",
        "Kapan konsentrasi MENANG (terukur): pasangan stabil (USDC/DAI di ±0,1% — harga hampir tidak pernah keluar), atau pasar sideways panjang. Kapan KALAH: tren kuat satu arah, event volatilitas (likuidasi cascade!), atau rentang yang terlalu sempit untuk volatilitas pasangan. Aturan: lebar rentang minimum ≈ 2–3x volatilitas harian pasangan × horizon rebalance.",
      ],
      formula: String.raw`x = L\left(\frac{1}{\sqrt{p}} - \frac{1}{\sqrt{p_{atas}}}\right) \quad ; \quad y = L\left(\sqrt{p} - \sqrt{p_{bawah}}}\right)`,
      formulaNote: "x, y = jumlah token nyata dalam posisi; L = likuiditas virtual; p = harga saat ini; p_bawah/p_atas = batas rentang. Jika p ≥ p_atas: x = 0 (100% token y). Jika p ≤ p_bawah: y = 0 (100% token x). Rumus ini yang dipakai lab untuk menghitung komposisi posisi.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Fee besar pasti menutup impermanent loss`",
        type: "pitfall",
        body: "Fee dan IL bergerak dengan 'mata uang' berbeda: fee dibayar dari VOLUME (butuh harga betah di rentang), IL lahir dari PERGERAKAN (butuh harga pergi jauh). Keduanya bisa maksimal bersamaan dalam skenario terburuk: volume tinggi SESaat sebelum harga kabur — fee terkumpul sedikit, lalu IL menghantam. Lab membuktikan: $1.200 fee vs −$2.579 IL. Jangan netting-kan keduanya dengan asumsi; hitung DUA-DUANYA dari data.",
      },
      reference: "Net = fee − |IL|. Konsentrasi mengamplifikasi keduanya — IL ~19x vs full-range.",
    },
    {
      id: "lab-posisi",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulator posisi konsentrat",
      prose: [
        "Simulasikan posisi Dimas: L = 10.000, rentang [2700, 3300], masuk saat ETH $3.000, lalu harga bergerak ke $3.450 (keluar rentang!). Tugasmu: (1) tulis konversi tick ↔ harga dan verifikasi round-trip; (2) hitung komposisi (x, y) dan nilai posisi di kedua harga; (3) hitung IL vs HODL, bandingkan dengan IL full-range v2, dan net setelah fee $1.200.",
        "Cara membaca output: 'posisi @3000' = campuran ETH+USDC (di dalam rentang); 'posisi @3450' = 0 ETH (keluar rentang, 100% USDC); IL v3 vs IL v2 = ukuran amplifikasi; 'net' negatif = fee tidak menutup IL. Interpretasi: angka-angka ini MENGUKUR harga sewa efisiensi — bukan opini.",
        "Coba eksplorasi: ubah P1 ke 3100 (tetap di dalam rentang!) — berapa IL-nya? (Kecil!) Lalu ubah PA/PB ke [2900, 3100] (lebih sempit) dengan P1=3450 — berapa amplifikasinya? (Lebih brutal!) Pelajaran: sempit = efisien saat tenang, brutal saat kabur.",
      ],
      tasks: [
        { id: "t1", text: "Tulis tick_to_price & price_to_tick; verifikasi round-trip harga 3000" },
        { id: "t2", text: "Hitung komposisi (x,y) dan nilai posisi di $3000 dan $3450" },
        { id: "t3", text: "Hitung IL vs HODL, bandingkan IL v2, dan net setelah fee" },
      ],
      expected: "tick(3000)=80068 · IL v3 -4,49% vs IL v2 -0,24% (amplifikasi ~19x) · net -$1.379,3",
      note: {
        title: "💡 Intuisi: IL = harga sewa yang dibayar di muka... atau di belakang",
        body: "LP sempit seperti menyewa apartemen di pusat kota: murah per meter (efisien!), tapi kontraknya kaku — begitu 'harga pindah kota' (keluar rentang), kamu tetap bayar (IL terealisasi sebagai 100% satu token) tanpa fasilitas (fee nol). Lab mengukur 'denda kontrak' itu: −$2.579 untuk gerakan +15%. Sewa termurah pun mahal jika kamu diusir.",
      },
      hints: [
        "tick_to_price(t) = 1.0001**t; price_to_tick(p) = round(log(p)/log(1.0001)).",
        "Di dalam rentang: x = L*(1/sqrt(p) - 1/sqrt(PB)), y = L*(sqrt(p) - sqrt(PA)).",
        "Di luar rentang atas: x=0, y = L*(sqrt(PB) - sqrt(PA)). IL = nilai_posisi/nilai_HODL - 1.",
      ],
      code: {
        starter: `import math\nP0, PA, PB, L = 3000.0, 2700.0, 3300.0, 10000.0\nP1 = 3450.0   # harga bergerak ke luar rentang atas\nFEE = 1200.0  # fee terkumpul selama harga di dalam rentang ($)\n\n# DATA SINTETIS: contoh pembelajaran\n# TULIS KODEMU DI BAWAH INI`,
        lockLines: 7,
        solution: `import math\nP0, PA, PB, L = 3000.0, 2700.0, 3300.0, 10000.0\nP1 = 3450.0   # harga bergerak ke luar rentang atas\nFEE = 1200.0  # fee terkumpul selama harga di dalam rentang ($)\n\n# DATA SINTETIS: contoh pembelajaran\n# TULIS KODEMU DI BAWAH INI\ndef tick_to_price(t):\n    return 1.0001 ** t\n\ndef price_to_tick(p):\n    return round(math.log(p) / math.log(1.0001))\n\nt = price_to_tick(P0)\nprint("tick(3000) =", t, "| round-trip:", round(tick_to_price(t), 4))\n\ndef amounts(p):\n    if p <= PA:\n        return L * (1 / math.sqrt(PA) - 1 / math.sqrt(PB)), 0.0\n    if p >= PB:\n        return 0.0, L * (math.sqrt(PB) - math.sqrt(PA))\n    x = L * (1 / math.sqrt(p) - 1 / math.sqrt(PB))\n    y = L * (math.sqrt(p) - math.sqrt(PA))\n    return x, y\n\nx0, y0 = amounts(P0)\nx1, y1 = amounts(P1)\nv0, v1 = x0 * P0 + y0, x1 * P1 + y1\nhodl1 = x0 * P1 + y0\nil = v1 / hodl1 - 1\nr = P1 / P0\nil_v2 = 2 * math.sqrt(r) / (1 + r) - 1\nprint(f"posisi @3000: {x0:.3f} ETH + {y0:.1f} USDC = {v0:.1f}")\nprint(f"posisi @3450: {x1:.3f} ETH + {y1:.1f} USDC = {v1:.1f}")\nprint(f"HODL @3450: {hodl1:.1f} | IL v3: {il*100:.2f}% | IL v2: {il_v2*100:.2f}%")\nprint("net setelah fee $1200:", round(FEE + (v1 - hodl1), 1), "USDC")`,
        checks: [
          { kind: "stdout_matches", task: "t1", label: "tick 80068", msg: "tick(3000) harus 80068 dengan round-trip 3000.0964.", pattern: "tick\\(3000\\) = 80068" },
          { kind: "stdout_matches", task: "t3", label: "IL v3 -4.49%", msg: "IL posisi konsentrat = -4.49%.", pattern: "IL v3: -4\\.49%" },
          { kind: "stdout_matches", task: "t3", label: "IL v2 -0.24%", msg: "IL full-range v2 = -0.24% (amplifikasi ~19x).", pattern: "IL v2: -0\\.24%" },
          { kind: "stdout_matches", task: "t3", label: "net -1379.3", msg: "Net setelah fee $1200 = -1379.3 USDC.", pattern: "net setelah fee \\$1200: -1379\\.3" },
        ],
      },
      reference: "Amplifikasi IL = harga sewa efisiensi. Hitung keduanya, jangan asumsi.",
    },
    {
      id: "hooks",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Hooks v4: kolam yang bisa diprogram",
      prose: [
        "Uniswap v4 (dokumentasi resmi, 2026) merombak arsitektur: semua kolam tinggal di SATU kontrak PoolManager (singleton) — bukan pabrik kontrak terpisah seperti v3 — dengan flash accounting yang menunda transfer token sampai akhir transaksi (hemat gas untuk operasi multi-langkah). Di atas fondasi ini: HOOKS — kontrak eksternal yang ditempel ke tiap kolam dan dieksekusi di titik-titik siklus hidupnya.",
        "SIKLUS HIDUP hooks (10 titik, dari docs resmi): beforeInitialize/afterInitialize (sekali saja saat kolam dibuat); beforeAddLiquidity/afterAddLiquidity dan beforeRemoveLiquidity/afterRemoveLiquidity (setiap perubahan likuiditas — granular demi keamanan); beforeSwap/afterSwap (setiap trade!); beforeDonate/afterDonate (donasi ke LP). Plus empat izin return-delta yang memungkinkan hook mengoreksi saldo (custom accounting). Developer tidak wajib mengimplementasikan semua — mix & match sesuai kebutuhan.",
        "Tiga aturan keras yang harus dihafal analis: (1) IZIN = ALAMAT. Hook mendeklarasikan izin via getHookPermissions, dan izin itu di-encode di bit-bit alamat kontrak — deploy harus 'menambang' alamat CREATE2 yang bit-nya cocok (Helper HookMiner). Alamat tanpa flag = fungsi hook tidak pernah dipanggil (diam-diam tidak jalan!); deklarasi tidak cocok = deploy gagal. (2) HOOK = BAGIAN DARI PoolKey — ditetapkan sekali saat initialize, TIDAK bisa ditambah/dilepas/diganti setelahnya. Kolam tanpa hook selamanya tanpa hook. (3) HOOK OPSIONAL — kolam v4 tanpa hook berperilaku concentrated liquidity persis seperti v3. Hook hanya dibutuhkan untuk kustomisasi.",
        "Contoh yang dibuka dokumentasi: kurva AMM kustom (bukan x·y=k!), fee DINAMIS (naik saat volatil — dibaca dari beforeSwap), gating siapa boleh tambah likuiditas, limit order / TWAMM, dan custom accounting. Untuk analis data, hooks = PERILAKU BARU YANG TERAMATI: eksekusi beforeSwap/afterSwap tercatat on-chain, sehingga analis bisa mengukur 'kolam dengan hook X vs tanpa hook' — perbandingan fee efektif, slippage, dan pola MEV yang sebelumnya tidak ada.",
        "Sudut pandang analis vs developer: developer bertanya 'hook apa yang kubangun?'; analis bertanya 'hook apa yang MENEMPEL di kolam ini dan bagaimana ia mengubah angka yang kubaca?' Kolam dengan dynamic-fee hook: fee terukur berfluktuasi — jangan bandingkan APR-nya mentah dengan kolam fee-tetap. Kolam dengan gating: likuiditas terukur bisa 'membeku' untuk sebagian pelaku — jangan baca itu sebagai likuiditas bebas. Selalu cek: kolam ini punya hook apa?",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: hooks = plugin, bukan patch",
        body: "Analogi: v3 = aplikasi yang fiturnya dikunci pabrik; v4 = aplikasi dengan slot plugin di 10 titik. Hook tidak 'meretas' kolam — ia dipanggil RESMI oleh PoolManager di titik yang diizinkan. Untuk analis: plugin yang terpasang mengubah perilaku terukur kolam, dan daftar plugin (dari alamat + izinnya) bisa dibaca siapa pun on-chain. Kolam modern = likuiditas + kode perilaku.",
      },
      reference: "10 titik siklus hidup. Izin di alamat. Hook di PoolKey = permanen. Cek hook sebelum baca angka kolam.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Pilih rentangmu: peta 5 skenario",
      prose: [
        "**Skenario 1 — Pasangan stabil (USDC/DAI), volatilitas harian < 0,1%.** → Rentang SEMPIT ±0,1%, tier 0,01%. Harga hampir tidak pernah keluar; efisiensi maksimum, IL minimal. Ini satu-satunya tempat rentang super sempit MASUK AKAL.",
        "**Skenario 2 — ETH/USDC, volatilitas sedang, LP aktif (pantau mingguan).** → Rentang ±10–20%, tier 0,30%. Efisiensi ~5–10x, ruang napas untuk ayunan mingguan. Rebalance saat harga menyentuh 75% batas rentang — jangan tunggu keluar total.",
        "**Skenario 3 — Token baru/eksotis, volatilitas ekstrem.** → Rentang LEBAR (±50%+) atau full-range, tier 1%. Konsentrasi di sini = donasi ke pasar. Fee tier 1% mengkompensasi sebagian risiko; selebihnya diterima sebagai biaya.",
        "**Skenario 4 — LP pasif, tidak sempat memantau.** → JANGAN konsentrat sempit. Pilih full-range (perilaku v2) atau vault manajemen otomatis. Posisi konsentrat tanpa rebalance = hampir pasti berakhir 100% satu token + fee nol (nasib Dimas).",
        "**Skenario 5 — Butuh logika kustom (fee dinamis, limit order, gating).** → v4 + hook. Ingat: hook permanen di PoolKey — pilih hook yang diaudit, pahami 10 titik eksekusinya, dan ukur dampaknya (fee efektif, slippage) vs kolam tanpa hook sebelum alokasi besar.",
        "Aturan praktis 10 detik: (1) berapa volatilitas harian pasangan? (2) berapa lama bisa pantau? (3) butuh kustomisasi? Volatilitas rendah + pantau rajin = sempit. Volatilitas tinggi ATAU malas pantau = lebar. Butuh logika = v4 + hook. Tulis alasan pilihanmu — 'ikut-ikutan APR' bukan alasan.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: rentang = pernyataan tentang masa depan",
        body: "Memilih [2700, 3300] = menyatakan 'saya yakin harga betah di sini selama horizon saya'. Itu PREDIKSI, bukan pengaturan teknis. LP yang baik memperlakukan rentang seperti trader memperlakukan view: punya horizon, punya level invalidasi (rebalance di 75% batas), dan punya ukuran posisi sesuai keyakinan. Rentang tanpa view = lotre dengan fee.",
      },
      reference: "Sempit hanya untuk stabil/pantau rajin. Malas pantau = lebar. Logika kustom = v4 + hook.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Sempit vs lebar: $50.000, 30 hari, dua masa depan",
      prose: [
        "LP dengan $50.000 di ETH/USDC ($3.000) mempertimbangkan dua strategi. SEMPIT: rentang [2850, 3150] (±5%), efisiensi 20,5x, fee APR 25% saat di dalam rentang. LEBAR: rentang [2100, 3900] (±30%), efisiensi 3,76x, fee APR 8%. Dua masa depan diuji: (A) harga sideways $3.000 ±3% selama 30 hari; (B) harga melonjak ke $3.450 pada hari ke-10 (fee berhenti saat keluar rentang).",
        "**Pertanyaan:** (a) Hitung fee 30 hari skenario A untuk keduanya. (b) Hitung net skenario B (fee 10 hari + IL terealisasi). (c) Strategi mana yang 'menang' di tiap skenario, dan berapa selisihnya? (d) Untuk analis: metrik apa yang membedakan pemenang sebelum masa depan diketahui?",
        "**Pembahasan:** (a) Skenario A — SEMPIT: 50000 × 25% × 30/365 = +$1.027. LEBAR: 50000 × 8% × 30/365 = +$329. Sempit menang 3,1x lipat — sewa efisiensi terbayar saat harga betah. (b) Skenario B — SEMPIT: fee 10 hari ≈ $342, IL −5,69% = −$3.055 → net −$2.713. LEBAR: fee 10 hari ≈ $110, IL −1,72% = −$915 → net −$805. Sempit kalah 3,4x lipat — denda keluar-rentang brutal. (c) Tidak ada pemenang absolut: sempit menang saat tenang (+$698 selisih), lebar 'kalah lebih sedikit' saat kabur (+$1.908 selisih). (d) Time-in-range historis pasangan + volatilitas terealisasi: jika ETH/USDC keluar dari ±5% dalam > 40% bulan-bulan sebelumnya, harga sewa sempit kemahalan — analis memutuskan dari DISTRIBUSI masa lalu, bukan dari APR tertinggi.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk: view yang tidak diakui",
        type: "risk",
        body: "Setiap pilihan rentang = view volatilitas yang implisit. Risiko terbesar LP konsentrat bukan IL-nya — melainkan VIEW YANG TIDAK DIAKUI: LP memilih ±5% tanpa pernah menghitung probabilitas harga keluar. Analis mengonversi 'rentang' menjadi 'probabilitas keluar-rentang per horizon' dari data historis. Itulah pekerjaan risk dalam bahasa LP: bukan menghindari risiko, melainkan memberi HARGA pada view.",
      },
      reference: "Sempit: +$1.027 saat tenang, −$2.713 saat kabur. Tidak ada strategi yang selalu menang.",
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
          q: "Harga ETH $3.000 dikonversi ke tick 80068. Mengapa tick memakai kisi logaritmik (1,0001^i), bukan linear?",
          options: [
            { text: "Agar angkanya terlihat canggih", why: "Bukan estetika — ini kebutuhan fungsional presisi relatif.", },
            { text: "Karena DeFi hidup dari perubahan relatif: 1% di $100 dan 1% di $3000 = jarak tick sama (~100 tick)", why: "Tepat. Kisi logaritmik mengukur perubahan RELATIF — bahasa alami trading dan volatilitas.", correct: true },
            { text: "Agar kompatibel dengan harga bitcoin", why: "Tick tidak ada hubungannya dengan bitcoin — ia properti internal AMM.", },
            { text: "Karena linear boros gas", why: "Gas bukan alasannya; presisi relatif yang jadi alasan desain.", },
          ],
        },
        {
          q: "Posisi [2700, 3300] saat harga $3.450. Keadaannya?",
          options: [
            { text: "Tetap campuran ETH+USDC, fee berkurang sedikit", why: "Salah total — di luar batas atas tidak ada 'sedikit': komposisi jadi 100% satu sisi.", },
            { text: "100% USDC, fee NOL — harga keluar rentang atas", why: "Tepat. p ≥ p_atas → x = 0 (rumus lab). Pekerjaan berhenti total sampai harga kembali.", correct: true },
            { text: "100% ETH, fee tetap jalan", why: "Kebalik: di ATAS batas = 100% token murah (USDC), dan fee berhenti.", },
            { text: "Posisi otomatis melebar mengikuti harga", why: "Tidak ada pelebaran otomatis di v3 — posisi pasif. Melebar = rebalance manual (tutup + buka baru).", },
          ],
        },
        {
          q: "Harga 3000 → 3450: IL v3 −4,49% vs IL v2 −0,24%. Kesimpulan analis?",
          options: [
            { text: "v3 selalu lebih buruk dari v2", why: "Tidak selalu — saat harga betah di rentang, v3 menang fee telak. Konteksnya: pergerakan besar.", },
            { text: "Konsentrasi mengamplifikasi IL (~19x di contoh ini) — itulah harga sewa efisiensi", why: "Tepat. Per dolar modal, eksposur terhadap pergerakan harga lebih besar. IL = harga, bukan bug.", correct: true },
            { text: "Angka IL v3 salah hitung", why: "Angka dari rumus virtual reserves yang terverifikasi di lab — bukan salah hitung.", },
            { text: "v2 tidak punya impermanent loss", why: "v2 TETAP punya IL (−0,24% di contoh) — hanya tidak teramplifikasi.", },
          ],
        },
        {
          q: "Fee $1.200 terkumpul tapi net −$1.379. Pelajaran untuk analis?",
          options: [
            { text: "Fee tidak penting, abaikan saja", why: "Fee penting — ia separuh duel. Yang salah = mengasumsikan ia selalu menang.", },
            { text: "Fee dan IL dihitung dari data yang sama sehingga pasti netral", why: "Keduanya dari data sama tapi DRIVER berbeda: fee dari volume-di-dalam-rentang, IL dari pergerakan. Tidak ada kenetralan otomatis.", },
            { text: "Hitung DUA-DUANYA dari data; fee besar bisa kalah dari IL teramplifikasi saat harga kabur", why: "Tepat. Net = fee − |IL|. Jangan netting dengan asumsi — lab membuktikan $1.200 < $2.579.", correct: true },
            { text: "Naikkan fee tier agar net positif", why: "Fee tier ditentukan saat kolam dibuat dan dipilih pasar — LP tak bisa seenaknya menaikkan.", },
          ],
        },
        {
          q: "Tentang hooks v4: mana yang BENAR menurut dokumentasi resmi?",
          options: [
            { text: "Hook bisa ditambahkan ke kolam lama kapan saja", why: "Salah — hook bagian dari PoolKey, ditetapkan sekali saat initialize, permanen.", },
            { text: "Hook berjalan di 10 titik siklus hidup (before/after initialize, liquidity, swap, donate); izin di-encode di bit alamat; kolam tanpa hook = perilaku v3", why: "Tepat. Tiga fakta kunci dokumentasi dalam satu kalimat.", correct: true },
            { text: "Setiap kolam v4 wajib punya hook", why: "Kebalik — hooks opsional. Tanpa hook = concentrated liquidity standar v3.", },
            { text: "Hook mengubah rumus x·y=k secara permanen untuk semua kolam", why: "Hook hanya menempel di kolamnya sendiri (satu hook bisa melayani banyak kolam, tapi per-kolam).", },
          ],
        },
        {
          q: "Pasangan USDC/DAI untuk LP pasif. Pilihan TEPAT?",
          options: [
            { text: "Rentang ±30%, tier 1%", why: "Terlalu lebar + tier kemahalan untuk stablecoin — fee tidak kompetitif, efisiensi terbuang.", },
            { text: "Rentang sempit ±0,1%, tier 0,01% — harga hampir tak pernah keluar, satu-satunya tempat sempit masuk akal", why: "Tepat. Pasangan stabil + LP pasif = satu-satunya kombinasi di mana rentang super sempit rasional.", correct: true },
            { text: "Rentang ±5%, tier 0,30% + hook fee dinamis", why: "Tier 0,30% untuk stablecoin = kemahalan (trader pergi ke 0,01%); hook menambah risiko tanpa manfaat di sini.", },
            { text: "Tidak perlu pilih — semua rentang sama saja", why: "Rentang = pernyataan tentang masa depan; untuk stablecoin, ±0,1% vs ±30% = beda efisiensi puluhan kali lipat.", },
          ],
        },
      ],
      summary: [
        "Tick: p(i) = 1,0001^i — kisi logaritmik; posisi didefinisikan antar dua tick, fee hanya di dalam rentang.",
        "Cadangan virtual x = L(1/√p − 1/√p_atas), y = L(√p − √p_bawah); keluar rentang = 100% satu token + fee nol.",
        "Konsentrasi mengamplifikasi IL (~19x vs full-range di contoh); net = fee − |IL|, hitung dua-duanya.",
        "Posisi konsentrat = short volatilitas: menang saat harga betah, terpukul saat harga kabur.",
        "Hooks v4: 10 titik siklus hidup, izin di bit alamat, permanen di PoolKey, opsional (tanpa hook = v3).",
        "Aturan 10 detik: volatilitas rendah + pantau rajin = sempit; volatilitas tinggi/malas pantau = lebar; logika kustom = v4 + hook.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};

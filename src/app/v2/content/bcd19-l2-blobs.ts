import type { V2Lesson } from "../lib/types";

const BCD19_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Diagram batang blob per blok selama 34 blok: tenang, macet 24 blok, sepi; garis fee mencapai puncak di blok 28."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><rect x="91.7" y="20" width="306.3" height="160" fill="var(--c4)" opacity="0.12"/><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="114.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3</text><text x="40" y="44.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">6</text><text x="474" y="184.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text><text x="474" y="74.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">16 wei</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="147.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">8</text><text x="248.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">16</text><text x="350.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">24</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">33</text><rect x="41.0" y="110.0" width="10" height="70.0" fill="var(--c1)" opacity="0.85"/> <rect x="53.7" y="110.0" width="10" height="70.0" fill="var(--c1)" opacity="0.85"/> <rect x="66.3" y="110.0" width="10" height="70.0" fill="var(--c1)" opacity="0.85"/> <rect x="79.0" y="110.0" width="10" height="70.0" fill="var(--c1)" opacity="0.85"/> <rect x="91.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="104.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="117.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="129.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="142.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="155.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="167.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="180.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="193.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="205.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="218.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="231.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="243.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="256.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="269.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="281.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="294.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="307.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="319.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="332.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="345.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="357.7" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="370.3" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="383.0" y="40.0" width="10" height="140.0" fill="var(--c4)" opacity="0.85"/> <rect x="395.7" y="180.0" width="10" height="0.0" fill="var(--chart-grid)" opacity="0.5"/> <rect x="408.3" y="180.0" width="10" height="0.0" fill="var(--chart-grid)" opacity="0.5"/> <rect x="421.0" y="180.0" width="10" height="0.0" fill="var(--chart-grid)" opacity="0.5"/> <rect x="433.7" y="180.0" width="10" height="0.0" fill="var(--chart-grid)" opacity="0.5"/> <rect x="446.3" y="180.0" width="10" height="0.0" fill="var(--chart-grid)" opacity="0.5"/> <rect x="459.0" y="180.0" width="10" height="0.0" fill="var(--chart-grid)" opacity="0.5"/><polyline points="46.0,180.0 58.7,180.0 71.3,180.0 84.0,180.0 96.7,180.0 109.3,180.0 122.0,180.0 134.7,180.0 147.3,180.0 160.0,180.0 172.7,172.7 185.3,172.7 198.0,172.7 210.7,172.7 223.3,165.3 236.0,165.3 248.7,158.0 261.3,158.0 274.0,150.7 286.7,150.7 299.3,143.3 312.0,136.0 324.7,128.7 337.3,121.3 350.0,114.0 362.7,106.7 375.3,92.0 388.0,77.3 400.7,70.0 413.3,77.3 426.0,92.0 438.7,106.7 451.3,114.0 464.0,121.3" fill="none" stroke="var(--text)" stroke-width="2.5"/><circle cx="400.7" cy="70.0" r="4" fill="var(--text)"/><text x="400.7" y="58" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">puncak 16 wei @ blok 28</text><text x="244.8" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">kongesti: 6 blob/blok</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">batang = blob/blok · garis = base fee (simulasi)</text></svg>`;

export const bcd19: V2Lesson = {
  slug: "bcd19-l2-blobs",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD19 — L2 & Blob Analytics: Ekonomi Data di Balik Rollup",
  estMinutes: 48,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Truk kontainer yang menolak jadi gudang",
      prose: [
        "Bayangkan operator rollup kecil di 2023: setiap batch transaksi yang ia kirim ke Ethereum harus disimpan SELAMANYA oleh semua node — via calldata. Setiap byte = sewa gudang abadi. Biaya posting data adalah pos termahal operasinya, dan saat Ethereum macet, truknya ikut antre di tol yang sama dengan trader DeFi. Lalu 13 Maret 2024, upgrade Dencun (Cancun + Deneb) mengaktifkan EIP-4844: blob.",
        "Twist-nya: Ethereum BERHENTI menjadi gudang data rollup. Blob = kontainer ~128 KB yang dititipkan ke jaringan hanya ~18 hari — cukup lama untuk diverifikasi, lalu boleh dibuang. Ethereum tidak lagi MENYIMPAN data rollup; ia menjadi SAKSI bahwa data itu PERNAH tersedia. Peran berubah dari brankas menjadi notaris — dan biayanya anjlok 90–98% dalam hitungan hari (Optimism ~$0,50 → ~$0,01 per transaksi).",
        "Pekerjaan analis di ekonomi baru ini: MENGUKUR aliran data. Berapa blob per blok yang dipakai jaringan? Rollup mana yang paling rakus? Bagaimana pasar fee blob bereaksi saat macet? Dan — jebakan arsip — data blob yang lebih tua dari 18 hari TIDAK ADA di node biasa; analis yang tidak mengarsip cepat kehilangan data selamanya. Lesson ini: anatomi blob, pasar fee-nya, dan cara mengukur throughput-nya dari data on-chain.",
        "Bekal yang dipakai di sini (ringkas): dari BCD2 — blok, transaksi, dan header chain bisa dibaca dan dihitung ulang siapa pun; dari BCD14 — indexing skala besar berarti tahu data apa yang hilang kapan (retensi!), karena analis yang datang terlambat ke data 18-hari = analis tanpa data.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan anatomi blob EIP-4844 (transaksi tipe-3, komitmen KZG, sidecar, pruning 18 hari); (2) menghitung base fee blob dari excess_blob_gas memakai rumus EIP-4844; (3) mengukur throughput blob (blob/blok, GB/hari) dari header; (4) membandingkan ekonomi data calldata vs blob; (5) merancang strategi arsip untuk data blob.",
        "Daftar isi: 1) Cerita truk kontainer · 2) Anatomi blob · 3) Pasar fee blob · 4) Lab: simulator fee blob · 5) Ekonomi data rollup · 6) Peta keputusan: ukur apa, kapan · 7) Mini-case: audit ekonomi data · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Blob = penyimpanan murah permanen`",
        type: "pitfall",
        body: "Blob BUKAN storage — ia data availability window. Node konsensus hanya wajib menyimpan blob ~18 hari (4096 epoch), lalu prune. Analis yang mengira 'nanti saja di-query' akan menemukan data lenyap. Aturan: blob yang penting = arsip dalam < 18 hari, atau andalkan layanan arsip pihak ketiga. Bedakan 'tersedia untuk diverifikasi' vs 'tersimpan untuk dianalisis'.",
      },
      reference: "Ethereum = notaris ketersediaan data, bukan gudang. Arsip < 18 hari atau data hilang.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Anatomi blob: amplop titipan 128 KB",
      prose: [
        "EIP-4844 (final, dibuat 2022-02-25) memperkenalkan format transaksi BARU: blob-carrying transaction, tipe 0x03 (tipe-3). Isinya: daftar komitmen ke blob — BUKAN blob-nya. Satu blob = 4096 field element × 32 byte = 131.072 byte (~128 KiB). Satu blok menargetkan 3 blob (~0,375 MB) dan maksimal 6 (~0,75 MB). Angka-angka ini konstanta protokol — analis bisa memakainya untuk menghitung kapasitas teoritis kapan pun.",
        "Yang dilihat execution layer (EVM) hanyalah KOMITMEN KZG — sidik jari kriptografis blob — bukan datanya. EVM tidak bisa membaca isi blob (disengaja: agar tidak menambah beban gas eksekusi). Dua jembatan yang dibuka EIP: opcode BLOBHASH (0x49) untuk membaca versioned hash blob ke-i dari transaksi, dan precompile evaluasi titik di alamat 0x0A (50.000 gas) untuk memverifikasi klaim 'polinomial blob bernilai y di titik z'. Kontrak bisa VERIFIKASI data blob tanpa MELIHAT isinya — seperti notaris mengesahkan amplop tersegel.",
        "Data blob-nya sendiri merambat sebagai 'sidecar' di consensus layer — terpisah dari body blok eksekusi. Desain sidecar ini forward-compatible: saat full sharding dengan data-availability sampling (DAS) tiba, fungsi is_data_available() tinggal diganti tanpa merombak format transaksi. Proto-danksharding = format masa depan, diantar lebih awal.",
        "Siklus hidup satu blob: (1) sequencer rollup mengompresi batch transaksi → (2) membungkus ke blob + transaksi tipe-3 dengan max_fee_per_blob_gas → (3) blob disebar via consensus layer, komitmen tercatat di execution layer → (4) siapa pun (termasuk challenger fraud-proof) mengunduh & memverifikasi dalam ~18 hari → (5) node prune. Analis membaca jejaknya di: tipe transaksi (= 3), field blob_gas_used & excess_blob_gas di header, dan event rollup.",
        "Kepribadian: blob = AMPLOP TITIPAN di kantor notaris. Notaris (Ethereum) mencatat 'amplop #42 dititipkan jam 10.00, segel utuh' (komitmen KZG) — ia tidak membuka amplopnya, tidak menyimpannya selamanya, tapi kesaksiannya membuat isi amplop bisa diperdebatkan di pengadilan (fraud proof). Calldata = brankas sewa abadi; blob = titipan 18 hari. Beda fungsi, beda harga.",
      ],
      formula: String.raw`\text{1 blob} = 4096 \times 32\,\text{byte} = 131.072\,\text{byte} \approx 128\,\text{KiB}`,
      formulaNote: "4096 = FIELD_ELEMENTS_PER_BLOB (elemen field BLS12-381 per blob); 32 = BYTES_PER_FIELD_ELEMENT. Kapasitas per blok: target 3 blob ≈ 0,375 MB, maksimum 6 blob ≈ 0,75 MB (konstanta EIP-4844). Dari sini analis menghitung kapasitas harian: 3 × 128 KiB × 7200 blok ≈ 2,83 GB/hari (target).",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: komitmen = sidik jari, bukan fotokopi",
        body: "KZG commitment 48 byte mewakili 128 KB data — seperti sidik jari mewakili manusia. EVM memegang sidik jarinya (cukup untuk verifikasi!), bukan fotokopi seluruh tubuh (data). Inilah trik yang membuat blob murah: yang disimpan semua node SELAMANYA hanya 48 byte per blob; 128 KB-nya numpang lewat 18 hari. Saat mengukur 'beban chain', hitung keduanya terpisah.",
      },
      reference: "Tipe-3 = komitmen di execution, data di consensus sidecar, prune ~18 hari.",
    },
    {
      id: "fee-market",
      eyebrow: "Langkah 3 · Konsep",
      title: "Pasar fee blob: tol terpisah dengan memori",
      prose: [
        "Inovasi ekonomi EIP-4844: blob punya PASAR FEE TERPISAH dari gas biasa — mengikuti aturan targeting mirip EIP-1559. Artinya kemacetan DeFi/NFT di L1 TIDAK menaikkan biaya posting data rollup. Sebelum Dencun, rollup berebut block space yang sama dengan semua orang (saat Ethereum sibuk, fee L2 melonjak $0,10 → $2,00); sesudahnya, rollup punya 'jalur tol' sendiri dengan tarif sendiri.",
        "Mesin tarifnya: header tiap blok membawa excess_blob_gas — 'memori kemacetan', yaitu total blob gas di atas target yang terakumulasi. Base fee per blob gas = fake_exponential(1, excess_blob_gas, 3338477) — eksponensial yang naik saat pemakaian di atas target 393.216 (3 blob) dan turun saat di bawahnya. Fee yang dibayar (blob_gas × base fee) DIBAKAR seperti base fee EIP-1559 — bukan ke validator.",
        "Karakter responsnya PENTING untuk analis: lambat dan berekor (hysteresis). Konstanta 3338477 membuat base fee bergerak gradual — butuh belasan blok penuh 6-blob untuk mengangkat fee secara signifikan, dan fee TETAP TINGGI beberapa blok setelah kemacetan reda (simulasi di lab: puncak 16 wei di blok 28, satu blok SETELAH kongesti 24 blok berakhir!). Analis yang membaca 'fee tinggi = sedang macet' bisa salah — yang benar: fee tinggi = PERNAH macet.",
        "Aturan validitas yang bisa dicek: transaksi tipe-3 wajib punya minimal 1 blob, max_fee_per_blob_gas ≥ base fee berjalan, dan total blob gas per blok ≤ 786.432 (6 blob). Tiga assert ini = tiga hal yang bisa dimonitor analis untuk mendeteksi anomali (mis. blok yang melanggar = bug klien!).",
        "Kepribadian: pasar fee blob = TOL DENGAN MEMORI. Tarif tol hari ini ditentukan oleh antrean kemarin-lusa (excess), bukan antrean saat ini. Sopir (sequencer) yang melihat tarif tinggi tahu jalanan PERNAH padat — mungkin sekarang sudah lengang. Analis membaca excess_blob_gas sebagai 'termometer dengan inersia', bukan speedometer.",
      ],
      formula: String.raw`\text{base\_fee} = \text{fake\_exponential}(1,\ \text{excess\_blob\_gas},\ 3338477)`,
      formulaNote: "fake_exponential = aproksimasi factor × e^(numerator/denominator) via deret Taylor (ada di spesifikasi EIP-4844). excess_blob_gas = akumulasi pemakaian di atas target 393.216 per blok (dibatasi bawah 0). Hasil dalam wei per unit blob gas; fee transaksi = GAS_PER_BLOB (131.072) × jumlah blob × base_fee — dibakar.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `EIP-4844 menurunkan gas L1`",
        type: "pitfall",
        body: "EIP-4844 TIDAK mengubah pasar gas eksekusi L1 sama sekali — swap DeFi-mu bayar tarif yang sama sebelum dan sesudah Dencun. Yang turun = biaya POSTING DATA rollup, via pasar TERPISAH. Analis yang mencampuradukkan keduanya akan salah membaca: 'gas murah' (blob) vs 'gas L1' adalah dua pasar, dua grafik, dua cerita.",
      },
      reference: "Fee blob = pasar terpisah, respons lambat, dibakar. Baca excess, bukan cuma fee.",
    },
    {
      id: "lab-fee",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulator pasar fee blob",
      prose: [
        "Implementasikan mesin tarif EIP-4844 persis seperti spesifikasi: fake_exponential, calc_excess_blob_gas, dan base fee per blob gas. Simulasikan 34 blok: 4 blok tenang (3 blob), 24 blok kongesti (6 blob), 6 blok sepi (0 blob). Tugasmu: (1) tulis fake_exponential; (2) simulasikan excess & base fee per blok; (3) temukan puncak fee dan hitung biaya transaksi 2-blob saat puncak (dalam gwei).",
        "Cara membaca output: 'puncak: 16 wei di blok 28' — perhatikan, kongesti berakhir di blok 27 tapi fee memuncak di 28! Interpretasi: hysteresis — pasar fee punya memori. Dan 'fee_2blob_puncak ≈ 0,0042 gwei' = nyaris gratis bahkan di puncak simulasi; inilah mengapa posting data rollup menjadi murah struktural.",
        "Coba eksplorasi: ubah kongesti jadi 48 blok — berapa puncaknya? (Eksponensial: naik cepat setelah ambang!) Lalu coba pola [6,0,6,0,...] — apa yang terjadi pada excess? (Naik-turun berosilasi!) Pelajaran: tarif blob = fungsi RIWAYAT, bukan snapshot.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan fake_exponential(factor, numerator, denominator)" },
        { id: "t2", text: "Simulasikan 34 blok: hitung excess_blob_gas & base fee per blok" },
        { id: "t3", text: "Temukan puncak fee; hitung biaya tx 2-blob saat puncak (gwei)" },
      ],
      expected: "puncak 16 wei di blok 28 (hysteresis!) · fee tx 2-blob ≈ 0,0042 gwei — nyaris gratis",
      note: {
        title: "💡 Intuisi: fee = gema, bukan suara",
        body: "Base fee blob tidak mengukur kemacetan SEKARANG — ia gema dari kemacetan yang lalu (via excess_blob_gas). Seperti gema di lembah: suara (kongesti) sudah berhenti, gema (fee tinggi) masih terdengar beberapa blok. Analis yang memakai fee sebagai proxy 'macet tidaknya jaringan' harus menggeser jendelanya mundur — atau lebih baik baca langsung blob_gas_used per blok.",
      },
      hints: [
        "fake_exponential: deret Taylor — lihat pseudocode di spesifikasi EIP-4844.",
        "excess baru = 0 jika (excess_lama + used) < TARGET, else excess_lama + used - TARGET.",
        "Fee tx = base_fee * 2 * GAS_PER_BLOB wei; bagi 1e9 ke gwei.",
      ],
      code: {
        starter: `TARGET, GAS_PER_BLOB, FRAC = 393216, 2**17, 3338477  # konstanta EIP-4844\nusage = [3,3,3,3] + [6]*24 + [0]*6  # blob per blok: tenang -> macet -> sepi\n\n# DATA SINTETIS: pola kongesti contoh pembelajaran\n# TULIS KODEMU DI BAWAH INI`,
        lockLines: 5,
        solution: `TARGET, GAS_PER_BLOB, FRAC = 393216, 2**17, 3338477  # konstanta EIP-4844\nusage = [3,3,3,3] + [6]*24 + [0]*6  # blob per blok: tenang -> macet -> sepi\n\n# DATA SINTETIS: pola kongesti contoh pembelajaran\n# TULIS KODEMU DI BAWAH INI\ndef fake_exponential(factor, numerator, denominator):\n    i, output, acc = 1, 0, factor * denominator\n    while acc > 0:\n        output += acc\n        acc = (acc * numerator) // (denominator * i)\n        i += 1\n    return output // denominator\n\ndef calc_excess_blob_gas(prev_excess, prev_used):\n    if prev_excess + prev_used < TARGET:\n        return 0\n    return prev_excess + prev_used - TARGET\n\ndef base_fee(excess):\n    return fake_exponential(1, excess, FRAC)\n\nexcess = 0\npeak, peak_b = 0, 0\nfor b, u in enumerate(usage):\n    fee = base_fee(excess)\n    if fee > peak:\n        peak, peak_b = fee, b\n    excess = calc_excess_blob_gas(excess, u * GAS_PER_BLOB)\n\nprint(f"puncak: {peak} wei di blok {peak_b}")\nprint(f"fee_2blob_puncak: {peak * 2 * GAS_PER_BLOB / 1e9} gwei")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "puncak 16 wei blok 28", msg: "Puncak harus 16 wei di blok 28 (hysteresis!).", pattern: "puncak: 16 wei di blok 28" },
          { kind: "stdout_matches", task: "t3", label: "fee 0.004194304 gwei", msg: "Fee tx 2-blob saat puncak = 0.004194304 gwei.", pattern: "fee_2blob_puncak: 0\\.004194304 gwei" },
        ],
      },
      reference: "Tarif = fungsi riwayat (excess). Puncak fee datang SETELAH kongesti.",
    },
    {
      id: "ekonomi",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Ekonomi data rollup: dari $0,50 ke $0,01",
      prose: [
        "Dampak Dencun terukur dalam hari: biaya transaksi L2 anjlok 90–98% (data Status, 2024): Optimism ~$0,50 → ~$0,01; Arbitrum ~$0,30 → ~$0,01; Base ~$0,25 → ~$0,005; zkSync Era ~$0,20 → ~$0,01. Mekanismenya sederhana: sebelum Dencun, data batch rollup disimpan permanen via calldata (mahal karena abadi); sesudahnya via blob (murah karena 18 hari + pasar terpisah). Analis yang membandingkan 'biaya L2' antar era harus menormalisasi: biaya = (biaya posting data + biaya eksekusi) / jumlah transaksi per batch.",
        "Kapasitas yang bisa dihitung dari konstanta: target 3 blob/blok × 128 KiB × 7200 blok/hari ≈ 2,83 GB/hari; maksimum 6 blob ≈ 5,66 GB/hari. Jendela prune 18 hari × target ≈ 51 GB data rolling yang wajib disimpan node — bandingkan dengan calldata era lama yang tumbuh tanpa batas. Inilah 'ekonomi data': Ethereum menjual ketersediaan sementara (murah), bukan penyimpanan abadi (mahal).",
        "Cara MENGUKUR throughput dari data on-chain (pekerjaan analis!): (1) dari header — blob_gas_used per blok / 131.072 = jumlah blob; (2) dari transaksi — hitung transaksi tipe-3 per blok, kelompokkan per rollup (sequencer address!); (3) pangsa kapasitas = blob rollup X / total blob; (4) efisiensi = byte data aktual per blob (blob yang setengah kosong = pemborosan!). Empat angka ini = 'laporan trafik tol' jaringan.",
        "Evolusi yang terverifikasi: Pectra menaikkan via EIP-7691 — target 3→6 blob/blok, maksimum 6→9 (per Status, 2025). Di roadmap: PeerDAS (data availability sampling) — node memverifikasi sampel blob tanpa mengunduh semuanya, membuka jalan ke puluhan blob per blok. Catatan analis: angka Pectra di atas dari SATU sumber sekunder yang terbuka; untuk keputusan penting, verifikasi ke spesifikasi EIP-nya langsung.",
        "Jebakan arsip (kaitan BCD14): throughput 2,83 GB/hari × 18 hari = data blob 'segar' yang bisa diraih node biasa. Riset historis ('berapa blob dipakai Arbitrum Maret 2024?') WAJIB lewat indexer/arsip yang menyimpan sejak awal — node standar sudah prune. Desain pipeline: konsumsi blob real-time → arsip sendiri, JANGAN andalkan re-query.",
      ],
      figure: {
        svg: BCD19_SVG,
        alt: "Diagram batang 34 blok: 4 blok tenang (3 blob), 24 blok kongesti (6 blob), 6 blok sepi; garis base fee memuncak di blok 28.",
        caption: "Cara membaca: sumbu-x = nomor blok (simulasi!); batang = blob per blok (biru = 3 tenang, merah = 6 macet); garis = base fee blob dalam wei (skala kanan); area berbayang = periode kongesti blok 4–27. Interpretasi: fee NAIK LAMBAT selama kongesti dan MEMUNCAK di blok 28 — setelah kongesti berakhir (hysteresis EIP-1559-style). Analis: jangan baca 'fee tinggi' sebagai 'sedang macet'; baca batang (pemakaian aktual) untuk kondisi kini, garis (fee) untuk gema masa lalu.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: ukur tol dari gerbangnya, bukan dari tarifnya",
        body: "Untuk tahu sepadat apa jalan tol, hitung MOBIL LEWAT GERBANG (blob_gas_used per blok) — bukan tarifnya (base fee). Tarif = gema masa lalu; gerbang = fakta kini. Analis blob membaca header dulu (fakta), baru fee (interpretasi). Urutan ini menghindarkan kesalahan 'fee tinggi = macet' yang salah arah 180 derajat.",
      },
      reference: "Throughput dari header: blob_gas_used/131072. Arsip < 18 hari. Pectra: target 6/maks 9 (EIP-7691).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Ukur apa, kapan: peta 5 skenario",
      prose: [
        "**Skenario 1 — 'Berapa biaya posting data rollup X minggu ini?'** → Kumpulkan transaksi tipe-3 dari alamat sequencer X → jumlah blob × base fee rata-rata. Jangan pakai fee L1 biasa — pasarnya beda!",
        "**Skenario 2 — 'Butuh data blob dari 2 bulan lalu.'** → Node biasa SUDAH PRUNE. Langsung ke indexer/arsip (kaitan BCD14). Jangan buang waktu query node standar.",
        "**Skenario 3 — 'Rollup mana paling efisien memakai blob?'** → Hitung byte aktual per blob per rollup (blob setengah kosong = boros). Efisiensi = data berguna / 128 KiB. Bandingkan antar rollup, bukan antar waktu saja.",
        "**Skenario 4 — 'Blob fee melonjak — apa yang terjadi?'** → Baca excess_blob_gas (berapa lama di atas target?) + identifikasi rollup mana yang membanjiri (pangsa blob per sequencer). Fee tinggi = gema; temukan suara aslinya.",
        "**Skenario 5 — 'Merancang dashboard monitoring blob.'** → Tiga panel: (a) blob/blok vs target 3 & maks 6 (sumbu: blob, garis: 3/6); (b) pangsa per rollup (stacked, %); (c) excess_blob_gas + base fee (wei, log scale!). Ambang alert: blob/blok > 6 mustahil (assert protokol!); excess naik 10 blok berurutan = banjir datang.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: tiga pertanyaan sebelum query",
        body: "Sebelum menyentuh data blob, tanya: (1) KAPAN datanya? (> 18 hari = arsip, bukan node.) (2) SIAPA yang posting? (sequencer address = kunci agregasi per rollup.) (3) APA yang diukur — pemakaian (fakta) atau fee (gema)? Tiga jawaban ini menentukan sumber data, query, dan interpretasi. Analis yang skip ketiganya = query mahal dengan jawaban salah.",
      },
      reference: "Fakta dari header/tipe-3; fee = gema; > 18 hari = arsip.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Audit ekonomi data: rollup 'NusantaraChain'",
      prose: [
        "Rollup fiktif NusantaraChain memposting rata-rata 2 blob per blok selama 30 hari, tiap blob terisi 70% (89,6 KiB data berguna). Sequencer membayar base fee rata-rata 2 wei per blob gas. Asumsi: 7200 blok/hari, ETH $3.000 (angka ilustrasi).",
        "**Pertanyaan:** (a) Hitung GB data per hari & pangsa terhadap kapasitas target jaringan. (b) Hitung biaya posting per hari dalam ETH dan USD. (c) Bandingkan dengan era calldata: jika dulu biaya per transaksi $0,50 dan kini $0,01 untuk 5.000 tx/hari — berapa penghematan 30 hari? (d) Satu risiko arsip apa yang harus ditulis di laporan audit?",
        "**Pembahasan:** (a) 2 × 128 KiB × 7200 = 1,84 GB/hari; pangsa = 2/3 = 66,7% dari target 3 blob/blok — dominan! (b) Per hari: 2 × 7200 × 131.072 × 2 wei = 3.774.873.600 wei ≈ 0,00377 ETH ≈ $11,3/hari. Murah struktural — biaya data bukan lagi penentu kelangsungan. (c) Dulu: 5000 × $0,50 × 30 = $75.000; kini: 5000 × $0,01 × 30 = $1.500. Hemat $73.500/bulan (-98%). (d) RISIKO ARSIP: dengan 1,84 GB/hari, analis/auditor yang tidak mengarsip real-time kehilangan bukti historis setelah 18 hari — laporan audit harus mencantumkan sumber arsip (bukan 'query node'), atau temuan tidak bisa direproduksi.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk: biaya yang hilang = risiko yang pindah",
        type: "risk",
        body: "Biaya data yang anjlok 98% bukan berarti risiko hilang — ia PINDAH: dari 'apakah rollup mampu bayar posting?' ke 'apakah data historis masih bisa diaudit?' (risiko arsip/retensi) dan 'apakah satu rollup mendominasi 66,7% kapasitas?' (risiko konsentrasi throughput). Analis mengukur risiko BARU ini: pangsa kapasitas per rollup + kelengkapan arsip. Ekonomi berubah, peta risiko ikut berubah.",
      },
      reference: "$11,3/hari untuk 1,84 GB — murah. Risiko pindah ke arsip & konsentrasi.",
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
          q: "Satu blob EIP-4844 berukuran ~128 KiB. Dari mana angka itu berasal?",
          options: [
            { text: "Dipilih acak oleh developer", why: "Bukan acak — ia konstanta spesifikasi yang bisa diverifikasi siapa pun.", },
            { text: "4096 field element × 32 byte (konstanta EIP-4844); kapasitas blok: target 3 blob (~0,375 MB), maks 6 (~0,75 MB)", why: "Tepat — dari tabel parameter EIP-4844 yang dibuka. Analis menghitung kapasitas dari konstanta, bukan dari klaim.", correct: true },
            { text: "128 KiB = ukuran maksimum transaksi Ethereum", why: "Transaksi biasa jauh lebih kecil; 128 KiB khusus untuk blob.", },
            { text: "Menyesuaikan ukuran blok Bitcoin", why: "Tidak ada hubungan dengan Bitcoin — ini desain Ethereum sendiri.", },
          ],
        },
        {
          q: "EVM TIDAK bisa membaca isi blob. Apa yang BISA dibaca kontrak dari blob?",
          options: [
            { text: "Seluruh isi blob via CALLDATA", why: "Blob bukan calldata — EVM tidak bisa mengakses datanya sama sekali (disengaja!).", },
            { text: "Tidak ada sama sekali — blob invisible untuk EVM", why: "Hampir benar tapi kurang: ada dua jembatan yang dibuka EIP.", },
            { text: "Komitmen KZG via opcode BLOBHASH (0x49) + verifikasi via precompile 0x0A — verifikasi tanpa melihat isi", why: "Tepat. Notaris memegang sidik jari (komitmen), bukan isi amplop — cukup untuk verifikasi.", correct: true },
            { text: "Isi blob setelah 18 hari", why: "Kebalik — setelah ~18 hari data di-prune, makin TIDAK bisa dibaca.", },
          ],
        },
        {
          q: "Mengapa blob punya pasar fee TERPISAH dari gas biasa?",
          options: [
            { text: "Agar validator dapat penghasilan ganda", why: "Fee blob DIBAKAR seperti base fee — bukan ke validator.", },
            { text: "Agar kemacetan DeFi/NFT di L1 tidak menaikkan biaya posting data rollup", why: "Tepat. Sebelum Dencun, rollup antre di tol yang sama ($0,10 → $2,00 saat sibuk). Jalur terpisah = tarif terpisah.", correct: true },
            { text: "Karena blob lebih penting dari transaksi biasa", why: "Bukan soal penting — soal SUMBER DAYA beda (data sementara vs eksekusi).", },
            { text: "Agar gas L1 menjadi murah", why: "Mitos lesson ini: EIP-4844 tidak mengubah pasar gas L1 sama sekali.", },
          ],
        },
        {
          q: "Simulasi lab: kongesti 24 blok @ 6 blob, lalu sepi. Kapan base fee memuncak?",
          options: [
            { text: "Di tengah kongesti (blok ~16)", why: "Fee EIP-1559-style naik GRADUAL — di tengah jalan baru mulai bergerak (blok 10: 2 wei).", },
            { text: "Di blok 28 — satu blok SETELAH kongesti berakhir (hysteresis!)", why: "Tepat (hasil lab: 16 wei @ blok 28). Fee = gema masa lalu via excess_blob_gas, bukan suara kini.", correct: true },
            { text: "Tidak pernah naik — blob selalu 1 wei", why: "Hasil lab membuktikan naik ke 16 wei. 'Selalu murah' ≠ 'selalu 1 wei'.", },
            { text: "Langsung di blok pertama kongesti", why: "Itu perilaku lelang, bukan EIP-1559. Respons gradual = fitur (prediktabilitas), bukan bug.", },
          ],
        },
        {
          q: "Analis butuh data blob dari 2 bulan lalu. Langkah TEPAT?",
          options: [
            { text: "Query node Ethereum standar", why: "Node standar sudah PRUNE blob > ~18 hari. Query = data tidak ada.", },
            { text: "Tunggu sampai data muncul kembali", why: "Data yang di-prune tidak kembali — tidak ada 'undelete' di protokol.", },
            { text: "Ambil dari indexer/layanan arsip yang menyimpan sejak awal; untuk ke depan, arsip real-time sendiri", why: "Tepat. Pelajaran BCD14 + aturan 18 hari: arsip < 18 hari atau andalkan pihak ketiga.", correct: true },
            { text: "Rekonstruksi dari harga ETH historis", why: "Harga ETH tidak mengandung data blob — rekonstruksi mustahil.", },
          ],
        },
        {
          q: "Dencun (13 Mar 2024) menggabungkan dua upgrade. Apa saja + EIP bintangnya?",
          options: [
            { text: "Cancun (execution) + Deneb (consensus); bintangnya EIP-4844 (blob transactions)", why: "Tepat — terverifikasi dari sumber yang dibuka. Dencun = gabungan keduanya.", correct: true },
            { text: "Merge + Shanghai; bintangnya EIP-1559", why: "Merge (2022) dan Shanghai/Shapella (2023) = upgrade LAIN; EIP-1559 = London (2021).", },
            { text: "Pectra + Fusaka; bintangnya PeerDAS", why: "Pectra/Fusaka/PeerDAS = SETELAH Dencun (roadmap lanjutan), bukan Dencun.", },
            { text: "Cancun saja; tidak ada EIP penting", why: "Salah dua-duanya: Dencun = Cancun + Deneb, dan EIP-4844 adalah bintang utamanya.", },
          ],
        },
      ],
      summary: [
        "Blob = amplop titipan 128 KiB (4096×32 byte); EVM hanya lihat komitmen KZG (BLOBHASH 0x49, precompile 0x0A), data di sidecar consensus.",
        "Kapasitas: target 3 blob/blok (~0,375 MB), maks 6 (~0,75 MB) → ~2,83 GB/hari; prune ~18 hari (4096 epoch).",
        "Pasar fee terpisah (EIP-1559-style): base_fee = fake_exponential(1, excess, 3338477); respons lambat — puncak fee datang setelah kongesti.",
        "Dampak terukur Dencun (13 Mar 2024, Cancun+Deneb): fee L2 turun 90–98% (mis. Optimism $0,50→$0,01).",
        "Ukur dari header: blob_gas_used/131072 = blob per blok; kelompokkan tipe-3 per sequencer untuk pangsa rollup.",
        "Aturan arsip: > 18 hari = ke indexer; Pectra (EIP-7691) naikkan target 6/maks 9; PeerDAS = roadmap berikutnya.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Anatomi transaksi: field-field inti sebuah tx Ethereum-like.
const TX_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Diagram anatomi transaksi: dari pengirim ke penerima membawa value, dengan gas fee terpisah.">
<rect x="20" y="95" width="110" height="60" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="75" y="120" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">from</text>
<text x="75" y="140" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0x111…</text>
<rect x="350" y="95" width="110" height="60" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="405" y="120" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">to</text>
<text x="405" y="140" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0x222…</text>
<line x1="130" y1="115" x2="350" y2="115" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah)"/>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/></marker></defs>
<text x="240" y="106" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">value: 2,5 ETH</text>
<line x1="130" y1="140" x2="350" y2="140" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ah2)"/>
<defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--c4)" stroke-width="1.5"/></marker></defs>
<text x="240" y="160" text-anchor="middle" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">fee → validator</text>
<rect x="150" y="185" width="180" height="52" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="240" y="206" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">fee = gasUsed × gasPrice</text>
<text x="240" y="224" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">21.000 × 30 gwei = 0,00063 ETH</text>
<text x="240" y="40" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">nonce: 14 · block: 19000123 · input data: 0x…</text>
<text x="240" y="62" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">hash: 0xaaa… (ID unik transaksi)</text>
</svg>`;

const BCD2_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Struktur input data: 4 byte selector, 32 byte address, 32 byte jumlah."><text x="142" y="62.33333333333333" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Selector (4B)</text><rect x="150" y="49.33333333333333" width="18.5" height="18" rx="3" fill="var(--c1)"/><text x="174.5" y="62.33333333333333" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">a9059cbb=transfer</text><text x="142" y="118.99999999999999" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Address (32B)</text><rect x="150" y="105.99999999999999" width="147.8" height="18" rx="3" fill="var(--c2)"/><text x="303.8" y="118.99999999999999" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">ke mana</text><text x="142" y="175.66666666666666" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Jumlah (32B)</text><rect x="150" y="162.66666666666666" width="147.8" height="18" rx="3" fill="var(--c3)"/><text x="303.8" y="175.66666666666666" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">berapa (wei)</text></svg>`;

export const bcd2: V2Lesson = {
  slug: "bcd2-data",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD2 — Membaca Data Chain",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Transfer Rp0 yang biayanya Rp300 ribu",
      prose: [
        "Seorang pengguna DeFi panik menghubungi support exchange: 'Saya transfer 0 ETH, tapi kepotong Rp300 ribu! Dana saya dicuri!' Support mengecek hash transaksinya. Memang: kolom value = 0 ETH. Tapi kolom fee = 0,0029 ETH. Tidak ada pencurian — ia baru saja berinteraksi dengan smart contract, dan 'transfer Rp0' itu adalah pemanggilan fungsi contract yang komputasinya mahal.",
        "Twist-nya: di blockchain, yang kamu KIRIM dan yang kamu BAYAR adalah dua angka yang sama sekali berbeda. Value = isi amplop. Fee = ongkos kurir — dan kurirnya menagih per langkah komputasi, bukan per nilai amplop. Kirim Rp15 miliar atau Rp0, kalau komputasinya sama, ongkosnya sama.",
        "Lesson ini membedah tiga lapis data chain — block, transaction, log/event — dan anatomi satu transaksi sampai ke wei terakhir. Tujuan: (1) membaca field transaksi tanpa tertukar value vs fee; (2) memahami event log sebagai 'jejak kaki' smart contract; (3) menghitung biaya transaksi dari data mentah. Peta: cerita → tiga lapis data → anatomi tx → lab fee → event log → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan tiga lapis data (block, transaction, log) dan memilih lapisan yang tepat per pertanyaan; (2) menghitung fee transaksi sampai wei terakhir dari gasUsed × gasPrice; (3) membaca event log untuk melacak transfer token; (4) mengaudit `transfer Rp0` dan menjelaskan mengapa biayanya tidak nol.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Value transaksi = uang yang berpindah tangan.\" Tidak selalu. Value 0 dengan input data = pemanggilan contract (swap, stake, vote). Value besar ke contract = deposit. Dan yang paling menipu: transfer token ERC-20 tercatat sebagai value 0 ETH + event Transfer di log — 'uangnya' ada di log, bukan di field value. Analis yang hanya membaca field value akan melaporkan volume token = nol.",
      },
      reference: "Value ≠ fee. Token transfer tercatat di event log, bukan field value.",
    },
    {
      id: "tiga-lapis",
      eyebrow: "Langkah 2 · Tiga lapis data",
      title: "Block, transaction, log: arsip tiga lantai",
      prose: [
        "Lantai 1 — Block: wadah berisi ratusan transaksi + header (nomor blok, timestamp, hash blok sebelumnya). Analogi: satu halaman buku kas. Timestamp blok = 'waktu' on-chain; urutan transaksi DALAM blok = urutan eksekusi (penting untuk MEV di bcd8).",
        "Lantai 2 — Transaction: satu aksi dari sebuah address. Field inti: from, to (atau kosong = pembuatan contract), value, nonce (nomor urut anti-double-spend), gasUsed × gasPrice = fee, dan input data (perintah ke contract). Hash = ID uniknya.",
        "Lantai 3 — Log/Event: catatan yang ditulis smart contract saat dieksekusi. Transfer token, Swap di DEX, Deposit ke lending — semuanya berupa event. Tanpa log, kamu tidak bisa melihat 'siapa kirim token apa ke siapa' karena field value hanya mencatat koin native (ETH).",
        "Cara membaca diagram: panah solid = value (isi amplop, 2,5 ETH dari from ke to); panah putus-putus = fee (0,00063 ETH ke validator, terpisah dari value); kotak bawah = rumusnya. Interpretasi: dua aliran uang yang berbeda dalam SATU transaksi — analis forensik mengikuti value, analis ekonomi mengikuti fee (kepadatan fee = permintaan block space).",
      ],
      figure: {
        svg: TX_SVG,
        alt: "Diagram anatomi transaksi: dari pengirim ke penerima membawa value, dengan gas fee terpisah.",
        caption: "Satu transaksi, dua aliran dana: value ke penerima, fee ke validator. Keduanya harus dibaca terpisah.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: fee adalah harga lelang, bukan tarif pos",
        body: "Gas price bukan tarif tetap — ia hasil lelang block space tiap ~12 detik. Saat NFT hyped minting, gas 45 gwei bisa jadi 450 gwei dalam 10 menit. Karena itu 'rata-rata fee harian' tanpa konteks peristiwa = angka mati. Analis yang baik selalu memasangkan lonjakan fee dengan KALENDER peristiwa on-chain (mint besar, crash, airdrop). Fee spike adalah detektor perhatian pasar.",
      },
      reference: "Block = wadah + timestamp. Tx = aksi + fee. Log = jejak contract (satu-satunya tempat transfer token tercatat).",
    },
    {
      id: "anatomi-rumus",
      eyebrow: "Langkah 3 · Rumus fee",
      title: "Menghitung fee sampai wei terakhir",
      prose: [
        "Rumusnya sederhana, satuannya yang menjebak. gasUsed = langkah komputasi aktual (transfer biasa: 21.000; interaksi contract: 65.000–200.000+). gasPrice = harga per langkah, dalam gwei (1 gwei = 10⁻⁹ ETH). Kalikan, dapat fee dalam ETH.",
        "Contoh: 21.000 × 30 gwei = 630.000 gwei = 0,00063 ETH. Pada ETH Rp51,2 juta (≈ $3.200), itu ≈ Rp32 ribu. Transaksi contract 65.000 gas × 45 gwei = 0,002925 ETH ≈ Rp150 ribu — untuk value 0 ETH. Inilah tagihan yang mengejutkan pengguna di cerita pembuka.",
        "Nonce layak dikenal: nomor urut transaksi per address (0, 1, 2, …). Ia mencegah replay attack dan — bonus analis — memungkinkan rekonstruksi URUTAN aksi sebuah dompet walau tersebar di banyak blok.",
      ],
      formula: String.raw`\text{fee (ETH)} = \text{gasUsed} \times \text{gasPrice (gwei)} \times 10^{-9}`,
      formulaNote: "gasUsed = langkah komputasi yang benar-benar dipakai; gasPrice = tawaran per langkah dalam gwei; 10⁻⁹ = konversi gwei→ETH. Kalikan dengan harga ETH untuk nilai rupiah/dolar.",
      tasks: [],
      note: {
        title: "💡 Intuisi: gasUsed menceritakan kompleksitas",
        body: "Transfer biasa selalu 21.000 gas — itu sidik jari 'kirim uang biasa'. Angka 65.000+ = interaksi contract; 150.000+ = operasi kompleks (swap multi-hop, flash loan). Tanpa membaca input data pun, gasUsed sudah membocorkan JENIS aktivitas sebuah dompet. Cluster dompet by distribusi gasUsed = cara murah memisahkan 'pengguna biasa' dari 'bot DeFi'.",
      },
      reference: "fee = gasUsed × gasPrice × 10⁻⁹. gasUsed = sidik jari kompleksitas.",
    },
    {
      id: "lab-fee",
      eyebrow: "Langkah 4 · Lab",
      title: "Audit tagihan: fee vs value",
      prose: [
        "Dua transaksi sintetis. Tugasmu: hitung fee tiap transaksi dalam ETH dan USD (ETH = $3.200), lalu tentukan transaksi mana yang 'membayar lebih mahal daripada nilai yang dipindahkan' — pola yang normal untuk interaksi contract tetapi aneh untuk transfer biasa.",
        "Data: tx1 = transfer biasa 2,5 ETH (21.000 gas × 30 gwei); tx2 = interaksi contract, value 0 ETH (65.000 gas × 45 gwei).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fee1_eth` dan `fee2_eth` dari gas × price" },
        { id: "t2", text: "Konversi ke USD → `fee1_usd`, `fee2_usd` (ETH=$3.200)" },
        { id: "t3", text: "Tentukan `mahal_vs_value` = True jika fee2 > value tx2" },
        { id: "t4", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "fee1=0.00063 ETH ($2.02)  fee2=0.002925 ETH ($9.36)  mahal_vs_value=True",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa konversi gwei→ETH (×10⁻⁹). 21.000 × 30 = 630.000 — itu GWEI, bukan ETH. Tanpa ×10⁻⁹ kamu melaporkan fee Rp32 miliar. Selalu tulis satuannya di tiap langkah: '630.000 gwei = 0,00063 ETH'. Analis yang ceroboh satuan = analis yang salah tiga orde magnitude.",
      },
      hints: [
        "fee_eth = gas_used * gas_price_gwei * 1e-9.",
        "fee_usd = fee_eth * 3200.",
        "mahal_vs_value = fee2_eth > 0  (value tx2 = 0 ETH)",
      ],
      code: {
        starter: `# Dua transaksi sintetis (mirip struktur data RPC getTransactionReceipt).\ntx1 = {"value_eth": 2.5, "gas_used": 21000, "gas_price_gwei": 30}  # transfer biasa\ntx2 = {"value_eth": 0.0, "gas_used": 65000, "gas_price_gwei": 45}  # interaksi contract\nETH_USD = 3200\n\n# TULIS KODEMU\nfee1_eth = \nfee2_eth = \nfee1_usd = \nfee2_usd = \nmahal_vs_value = \n\nprint(f"fee1={fee1_eth} ETH (\${fee1_usd:.2f})  fee2={fee2_eth} ETH (\${fee2_usd:.2f})  mahal_vs_value={mahal_vs_value}")`,
        lockLines: 4,
        solution: `# Dua transaksi sintetis (mirip struktur data RPC getTransactionReceipt).\ntx1 = {"value_eth": 2.5, "gas_used": 21000, "gas_price_gwei": 30}  # transfer biasa\ntx2 = {"value_eth": 0.0, "gas_used": 65000, "gas_price_gwei": 45}  # interaksi contract\nETH_USD = 3200\n\n# TULIS KODEMU\nfee1_eth = tx1["gas_used"] * tx1["gas_price_gwei"] * 1e-9\nfee2_eth = tx2["gas_used"] * tx2["gas_price_gwei"] * 1e-9\nfee1_usd = fee1_eth * ETH_USD\nfee2_usd = fee2_eth * ETH_USD\nmahal_vs_value = fee2_eth > tx2["value_eth"]\n\nprint(f"fee1={fee1_eth} ETH (\${fee1_usd:.2f})  fee2={fee2_eth} ETH (\${fee2_usd:.2f})  mahal_vs_value={mahal_vs_value}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fee1_eth", value: 0.00063, tol: 1e-9, label: "`fee1_eth` = 0.00063", msg: "21000 × 30 × 1e-9. Jangan lupa konversi gwei." },
          { kind: "equal", task: "t1", name: "fee2_eth", value: 0.002925, tol: 1e-9, label: "`fee2_eth` = 0.002925", msg: "65000 × 45 × 1e-9." },
          { kind: "equal", task: "t2", name: "fee2_usd", value: 9.36, tol: 0.01, label: "`fee2_usd` ≈ 9.36", msg: "fee2_eth × 3200." },
          { kind: "equal", task: "t3", name: "mahal_vs_value", value: true, tol: 0, label: "`mahal_vs_value` = True", msg: "fee2 (0,002925) > value tx2 (0). Wajar untuk contract call." },
          { kind: "stdout_matches", task: "t4", pattern: "fee2=0\\.002925", label: "Output menampilkan fee2", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "fee_eth = gas_used × gas_price_gwei × 1e-9. Selalu tulis satuan tiap langkah.",
    },
    {
      id: "event-log",
      eyebrow: "Langkah 5 · Event log",
      title: "Jejak kaki smart contract",
      prose: [
        "Event Transfer(address from, address to, uint256 value) adalah cara standar token ERC-20 mengumumkan 'A kirim X token ke B'. Setiap trade DEX, setiap deposit lending, setiap mint NFT — semuanya meninggalkan event. Tabel event inilah bahan baku 80% analisis DeFi/NFT di track ini.",
        "Tiga event yang wajib hafal: Transfer (token berpindah), Swap (DEX: tokenIn, tokenOut, amountIn, amountOut), Approval (izin spend — sering disalahgunakan phisher). Menemukan 'transfer USDC Rp15 miliar' = filter event Transfer pada contract USDC dengan value ≥ 15 miliar — bukan membaca field value transaksi.",
        "Jebakan klasik: satu transaksi bisa memicu PULUHAN event (swap multi-hop, flash loan). Menghitung 'jumlah transaksi' sebagai 'jumlah aktivitas ekonomi' meremehkan aktivitas contract berat sampai 10x. Selalu bedakan tx count vs event count.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Event Approval yang tak terbatas (approve 'unlimited') adalah vektor phishing terbesar di DeFi: korban menandatangani approval sekali, penyerang menguras token kapan saja. Monitoring event Approval abnormal (spender baru, nilai max uint256) adalah early warning yang murah dan efektif untuk dompet treasury.",
      },
      reference: "Transfer token hanya ada di event log. Bedakan tx count vs event count.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Mau jawab apa → baca lapisan mana",
      prose: [
        "Skenario 1 — 'Berapa total USDC yang dipindah minggu ini?' → baca EVENT LOG Transfer pada contract USDC, jumlahkan field value event. Jangan baca field value transaksi (isinya ETH, bukan USDC).",
        "Skenario 2 — 'Kapan tepatnya aksi ini terjadi?' → baca HEADER BLOCK (timestamp) dari blockNumber transaksi. Urutan dalam blok = urutan eksekusi — jangan pakai timestamp untuk mengurutkan transaksi se-blok.",
        "Skenario 3 — 'Dompet ini bot atau manusia?' → baca DISTRIBUSI gasUsed + nonce spacing. Bot: gasUsed seragam, nonce rapat berurutan. Manusia: acak, jarang.",
        "Skenario 4 — 'Berapa biaya sebenarnya kampanye airdrop ini?' → jumlahkan fee (gasUsed × gasPrice) SEMUA transaksi kampanye, bukan cuma value token yang dibagi. Fee sering 20–40% dari total biaya kampanye saat jaringan padat.",
        "Aturan praktis 10 detik: value menjawab 'berapa nilai pindah', fee menjawab 'berapa biaya geseknya', event menjawab 'apa yang sebenarnya terjadi', nonce menjawab 'dalam urutan apa'. Kalau jawabanmu butuh dua di antaranya, kamu butuh JOIN dua lapis data.",
      ],
      tasks: [],
      reference: "value = nilai pindah · fee = biaya gesek · event = makna · nonce = urutan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Airdrop Rp8 miliar yang biayanya Rp3 miliar",
      prose: [
        "Sebuah proyek membagikan airdrop 2.500.000 token (≈ Rp8 miliar) ke 50.000 address. Tim mengumumkan 'distribusi Rp8 miliar ke komunitas'. Kamu diminta audit biayanya. Data: tiap klaim = 1 transaksi, rata-rata 65.000 gas × 45 gwei, ETH $3.200.",
        "Hitung: fee per klaim = 65.000 × 45 × 10⁻⁹ = 0,002925 ETH ≈ $9,36. Total 50.000 klaim = $468.000 ≈ Rp7,5 miliar?? Tunggu — itu LEBIH dari separuh nilai airdrop. Benarkah?",
        "Pembahasan: hitungan di atas benar secara aritmetika — dan itulah jebakannya. Asumsi 'rata-rata 65.000 gas × 45 gwei untuk SEMUA 50.000 klaim' tidak realistis: klaim tersebar berminggu-minggu dengan gas price bervariasi 15–120 gwei, dan sebagian klaim digabung via contract batch (1 tx untuk banyak penerima). Pelajaran analis: JANGAN kalikan rata-rata dengan N tanpa memeriksa distribusi dan periode. Audit yang benar: jumlahkan fee aktual per transaksi dari receipt (Σ gasUsed × gasPrice per tx), kelompokkan per hari. Angka 'Rp7,5 miliar' adalah bom klik, bukan audit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Rata-rata × N = total.\" Hanya jika distribusinya simetris dan periodenya homogen. Fee kripto berdistribusi heavy-tail: 5% transaksi saat gas spike bisa menyumbang 40% total fee. Selalu jumlahkan dari data per-transaksi (atau minimal stratifikasi per periode gas price) sebelum mengalikan.",
      },
      reference: "Audit biaya = Σ fee aktual per tx, bukan rata-rata × N.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Decode: dari hex menjadi makna",
      prose: [
        "Data `input` transaksi ERC-20 transfer terlihat seperti: `0xa9059cbb0000000000000000000000007a250d5630b4cF...`. Bagi analis, ini bukan sampah hex — ini kalimat. 4 byte pertama (`a9059cbb`) = FUNCTION SELECTOR: sidik jari fungsi `transfer(address,uint256)` = 4 byte pertama dari keccak256(`transfer(address,uint256)`). 32 byte berikut = alamat tujuan (12 byte nol + 20 byte address). 32 byte terakhir = jumlah (dalam wei). Tiga potong hex = `siapa, ke mana, berapa`.",
        "Cara menghitung selector sendiri (tanpa tools): keccak256 dari string `transfer(address,uint256)` = `a9059cbb...` (64 hex char), ambil 4 byte pertama = `a9059cbb`. Untuk `approve(address,uint256)` = `095ea7b3`; `transferFrom(address,address,uint256)` = `23b872dd`. Hafalkan 3 selector ini — 90% transaksi token adalah salah satunya. Saat melihat `0x095ea7b3...`, kamu langsung tahu: ini APPROVE (izin), bukan transfer (uang pindah). Bedanya penting untuk analisis drain (bcd7): approve besar-besaran = persiapan rug pull.",
        "Contoh decode manual: input `0xa9059cbb` + `000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045` + `0000000000000000000000000000000000000000000000000de0b6b3a7640000`. Potong: selector a9059cbb → transfer. Address: `d8da6bf26964af9d7eed9e03e53415d37aa96045`. Jumlah: `0xde0b6b3a7640000` = 1.000.000.000.000.000.000 = 1×10^18 wei = 1 token (18 desimal). Kalimatnya: `transfer 1 token ke 0xd8da...6045`. Tiga menit dengan kalkulator hex — atau 1 detik dengan script. Tapi MEMAHAMI strukturnya membuatmu tidak butuh tools untuk kasus sederhana.",
        "Jebakan desimal: jumlah di chain SELALU dalam unit terkecil (wei / `token * 10^decimals`). USDC = 6 desimal: `0x0f4240` = 1.000.000 = 1 USDC. WBTC = 8 desimal. Token aneh = 2 desimal?! Analis yang mengira `1.000.000` = 1 juta USDC padahal = 1 USDC (salah 1.000.000x!) adalah kesalahan klasik — dan pernah terjadi di laporan profesional. Selalu baca `decimals()` dari kontrak SEBELUM mengartikan angka. Rumus: nilai_asli = nilai_chain / 10^decimals.",
        "Event log vs input: input = NIAT (`saya mau transfer`), log = KEJADIAN (`transfer terjadi`). Untuk analisis, LOG lebih penting: ia mencatat transfer yang DIEKSEKUSI (termasuk yang dipicu kontrak lain, bukan hanya transaksi langsung). Contoh: swap di Uniswap — input transaksi = `swap(...)`, tapi transfer tokennya tercatat di LOG (Transfer events). Analis yang hanya membaca input akan melewatkan 100% transfer internal DEX. Aturan: untuk ALIRAN DANA, baca log; untuk NIAT/AKTOR, baca input.",
        "Kasus nyata: `transfer Rp0 yang biayanya Rp300 ribu` (cerita lesson). Decode input: `transfer(address,uint256)` dengan jumlah = 0. NIAT: transfer 0 token (spam/tes). BIAYA: gasUsed 65.000 × gasPrice 30 gwei = 0,00195 ETH ≈ Rp300rb. Pelajaran: di blockchain, yang dibayar bukan NILAI yang dipindah, melainkan KOMPUTASI yang dipakai. Transfer Rp0 tetap butuh komputasi → tetap bayar. Ini fundamental untuk audit fee (lab lesson ini).",
        "Latihan mandiri: ambil satu transaksi token acak, decode manual 3 potongnya (selector, address, jumlah), konversi desimalnya. Jika dalam 5 menit kamu bisa bilang `ini approve 1.000 USDC oleh 0xabc...`, kamu sudah membaca `bahasa mesin` blockchain — skill yang membedakan analis data chain dari analis yang hanya bisa query Dune.",
      ],
      formula: String.raw`\text{selector} = \text{keccak256}(\text{nama(tipe,...)})[0:4] \quad ; \quad \text{nilai} = \frac{\text{raw}}{10^{\text{decimals}}}`,
      formulaNote: "selector = 4 byte pertama hash nama fungsi (a9059cbb = transfer); raw = angka bulat di chain; decimals = dari kontrak (USDC 6, ETH 18). Selalu konversi SEBELUM mengartikan — salah desimal = salah jutaan kali lipat.",
      figure: {
        svg: BCD2_DEEP_SVG,
        alt: "Diagram batang struktur input: 4 byte selector, 32 byte address, 32 byte jumlah.",
        caption: "Cara membaca: tiap batang = potongan input data transaksi; panjang = ukuran byte; label = maknanya. Interpretasi: 68 byte hex = satu kalimat lengkap (`transfer 1 token ke 0xd8da...`). Hafalkan 3 selector (transfer, approve, transferFrom) — 90% transaksi token adalah salah satunya.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: baca log untuk uang, baca input untuk niat",
        body: "Input = apa yang user MAU lakukan; log = apa yang BENAR-BENAR terjadi (termasuk transfer internal oleh kontrak). Untuk aliran dana (investigasi, audit), log adalah sumber kebenaran. Untuk aktor dan niat (siapa approve apa), input yang dibaca. Analis yang hanya baca satu sisi melihat setengah cerita.",
      },
      reference: "Selalu konversi decimals dulu. Latihan: decode 1 transaksi manual < 5 menit.",
    },
    {
      id: "fork-rantai",
      eyebrow: "Langkah 9 · Fork",
      title: "Fork: ketika rantai bercabang",
      prose: [
        "Dua explorer menampilkan saldo address yang sama: 10 BTC di keduanya. Explorer pertama menyebut nilainya Rp16 miliar, yang kedua Rp480 juta. Kamu tidak sedang melihat bug — kamu sedang melihat DUA rantai. Juli 2017, Bitcoin pecah menjadi BTC dan Bitcoin Cash (BCH): setiap pemegang 1 BTC otomatis memegang 1 BCH. Satu kunci privat, dua dompet, dua harga. Analis yang tidak tahu fork terjadi akan melaporkan 'saldo' yang separuhnya milik dunia lain.",
        "Tiga jenis fork, tiga nasib data. Fork sementara: dua miner menemukan blok hampir bersamaan — jaringan memilih satu rantai, blok yang ditinggalkan menjadi 'yatim' dan transaksinya kembali ke antrean. Data di blok seperti ini BELUM final: analis menunggu beberapa konfirmasi sebelum menganggap transaksi 'terjadi'. Soft fork: aturan diperketat dan kompatibel ke belakang — node lama tetap mengikuti rantai baru, tidak ada perpecahan. Hard fork: aturan berubah tak kompatibel — rantai pecah permanen dan aset terduplikasi di dua dunia.",
        "Contoh paling terkenal: 2016, Ethereum pecah menjadi ETH dan Ethereum Classic (ETC) setelah perdebatan penanganan pencurian dana The DAO. 2017, Bitcoin pecah menjadi BTC dan BCH karena perselisihan ukuran blok. Di kedua kasus: skema alamat IDENTIK di dua rantai — address 0xd8da...6045 ada di ETH sekaligus di ETC, dengan saldo yang pada awalnya sama persis.",
        "Perpecahan ini menciptakan replay: tanpa proteksi, sebuah transaksi yang valid di satu rantai bisa 'diputar ulang' di rantai lain karena tanda tangannya juga valid di sana. Pasca ETH/ETC, dana berpindah tanpa pernah diniatkan pemiliknya. Solusinya: chainId — setiap transaksi modern mencantumkan ID rantai (EIP-155), sehingga tanda tangan yang sah di rantai A tidak berlaku di rantai B.",
        "Untuk analis, aturannya sederhana: 'saldo', 'volume', dan 'harga' tidak punya arti tanpa menyebut rantai. 'Wallet X memegang 50 ETH' = belum lengkap — ETH di rantai mana? 'Volume DEX Rp15 triliun' = di rantai mana? Dan saat fork sementara terjadi, jangan pernah memperlakukan transaksi berkonfirmasi satu blok sebagai fakta final — ia bisa 'kembali' ke antrean.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan bedanya fork sementara dan hard fork, satu kalimat masing-masing" },
        { id: "t2", text: "Sebuah address memegang 2 BTC sebelum fork BCH 2017. Berapa yang ia pegang setelah fork? (jawab dgn menyebut rantai)" },
      ],
      expected: "Fork sementara = cabang rantai yang ditinggalkan, datanya belum final. Hard fork = rantai pecah permanen dgn aturan tak kompatibel. Setelah fork BCH 2017: 2 BTC + 2 BCH.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Satu address = satu saldo.\" Salah: address yang sama bisa punya saldo di BANYAK rantai (ETH dan ETC, BTC dan BCH) karena kunci privat yang sama berlaku di semuanya. 'Saldo dompet' tanpa menyebut rantai = angka tanpa arti. Analis yang menjumlahkan saldo lintas rantai tanpa sadar sedang menggandakan kekayaan.",
      },
      reference: "Fork sementara = belum final. Hard fork = rantai pecah, aset duplikat. Selalu sebut rantai: address bukan identitas unik lintas rantai.",
    },
    {
      id: "mempool",
      eyebrow: "Langkah 10 · Mempool",
      title: "Mempool: ruang tunggu transaksi",
      prose: [
        "Sebelum transaksi masuk blok, ia menunggu di mempool: antrean transaksi yang sudah disiarkan ke jaringan tetapi belum dipilih validator. Block space terbatas — satu blok hanya memuat sekian kilobyte — sehingga antrean ini adalah lelang: siapa membayar fee rate (gwei per byte) tertinggi, masuk duluan. Lab di bawah mensimulasikan lelang ini.",
        "Analis melihat mempool karena di sinilah masa depan terlihat lebih dulu. Antrean memanjang + fee rate melonjak = kemacetan, dan kemacetan hari ini = biaya mahal di blok-blok berikutnya. Lonjakan aktivitas (mint NFT, crash pasar, airdrop) selalu tercermin di mempool SEBELUM tercatat di blok. Bagi analis MEV, mempool adalah papan pengumuman niat semua orang — terlihat sebelum niat itu dieksekusi.",
        "Replace-by-fee adalah konsep kuncinya: transaksi yang tertahan bisa 'digantikan' dengan versi berfee lebih tinggi memakai nonce yang sama. Praktisnya: dompet mempercepat transaksi macet dengan menaikkan tawaran. Untuk analis, ini berarti SATU niat bisa muncul sebagai DUA catatan di mempool — menghitung keduanya sebagai dua transaksi = double counting.",
        "Peringatan terpenting: data mempool TIDAK stabil. Setiap node punya mempool sendiri — isinya berbeda-beda. Transaksi bisa dibuang (tergantikan, kadaluarsa, fee terlalu rendah) tanpa pernah masuk blok. Mempool menjawab 'apa yang diniatkan orang', bukan 'apa yang terjadi'. Jangan perlakukan data mempool sebagai fakta final — ia bahan niat, bukan arsip.",
        "Kaitannya dengan urutan: begitu transaksi masuk blok, posisinya dalam blok = urutan eksekusi (ingat Langkah 2: urutan dalam blok penting untuk MEV). Analisis lengkap menggabungkan keduanya: mempool untuk NIAT yang terlihat duluan, urutan blok untuk EKSEKUSI yang final.",
        "💡 Intuisi: mempool seperti antrean kasir supermarket jam makan siang. Kasir (validator) terbatas, semua orang antre. Yang membayar jalur ekspres (fee rate tinggi) maju duluan; yang pelit menunggu. Bedanya dengan supermarket: tiap cabang (node) punya antrean sendiri yang isinya tidak sama, dan pelanggan bisa mengganti posisi antreannya dengan membayar lebih (replace-by-fee).",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `blok_selanjutnya(antre)` yang memilih transaksi dgn fee_rate tertinggi yang masih muat di BLOK_KAPASITAS (800 vbytes)" },
        { id: "t2", text: "Simulasikan blok demi blok sampai antre kosong; catat putaran masuk tiap transaksi di dict `waktu`" },
        { id: "t3", text: "Tentukan `tertahan_3blok` (transaksi yang masuk SETELAH blok ke-3) dan `tunggu_tx5` (putaran masuk tx5)" },
        { id: "t4", text: "Cetak: jumlah transaksi blok 1, putaran masuk tx5, dan daftar tertahan" },
      ],
      expected: "blok1: 3 transaksi -> ['tx4', 'tx2', 'tx6']  tx5 masuk di blok ke-4  tertahan setelah 3 blok: ['tx5']",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Fee tinggi pasti masuk blok berikutnya.\" Tidak selalu: blok punya kapasitas tetap — transaksi BESAR dengan fee rate tinggi bisa kalah dari dua transaksi kecil yang jumlah feenya lebih menguntungkan pengisi blok. Dan \"transaksi ada di mempool = akan terjadi\" juga salah: transaksi bisa diganti atau dibuang tanpa jejak. Niat bukan kejadian.",
      },
      hints: [
        "sorted(antre, key=lambda t: t['fee_rate'], reverse=True) untuk urutan lelang.",
        "Kurangi sisa kapasitas setiap transaksi terpilih; lewati yang tidak muat.",
        "waktu[id] = putaran saat terpilih; tertahan = [i for i, p in waktu.items() if p > 3]",
      ],
      code: {
        starter: "# Simulasi mempool: kapasitas blok 800 vbytes, pilih fee_rate tertinggi dulu.\nBLOK_KAPASITAS = 800\nTXS = [\n  {\"id\": \"tx1\", \"size\": 400, \"fee_rate\": 100},\n  {\"id\": \"tx2\", \"size\": 300, \"fee_rate\": 200},\n  {\"id\": \"tx3\", \"size\": 500, \"fee_rate\": 150},\n  {\"id\": \"tx4\", \"size\": 200, \"fee_rate\": 250},\n  {\"id\": \"tx5\", \"size\": 600, \"fee_rate\": 80},\n  {\"id\": \"tx6\", \"size\": 250, \"fee_rate\": 180},\n]\n\n# TULIS KODEMU\ndef blok_selanjutnya(antre):\n    \n\nmasuk_blok1 = \nwaktu = \ntertahan_3blok = \ntunggu_tx5 = \n\nprint(f\"blok1: {len(masuk_blok1)} transaksi -> {masuk_blok1}\")\nprint(f\"tx5 masuk di blok ke-{tunggu_tx5}\")\nprint(f\"tertahan setelah 3 blok: {tertahan_3blok}\")",
        lockLines: 12,
        solution: "# Simulasi mempool: kapasitas blok 800 vbytes, pilih fee_rate tertinggi dulu.\nBLOK_KAPASITAS = 800\nTXS = [\n  {\"id\": \"tx1\", \"size\": 400, \"fee_rate\": 100},\n  {\"id\": \"tx2\", \"size\": 300, \"fee_rate\": 200},\n  {\"id\": \"tx3\", \"size\": 500, \"fee_rate\": 150},\n  {\"id\": \"tx4\", \"size\": 200, \"fee_rate\": 250},\n  {\"id\": \"tx5\", \"size\": 600, \"fee_rate\": 80},\n  {\"id\": \"tx6\", \"size\": 250, \"fee_rate\": 180},\n]\n\n# TULIS KODEMU\ndef blok_selanjutnya(antre):\n    terurut = sorted(antre, key=lambda t: t[\"fee_rate\"], reverse=True)\n    terpilih, sisa = [], BLOK_KAPASITAS\n    for t in terurut:\n        if t[\"size\"] <= sisa:\n            terpilih.append(t[\"id\"])\n            sisa -= t[\"size\"]\n    return terpilih\n\nmasuk_blok1 = blok_selanjutnya(TXS)\nwaktu = {i: 1 for i in masuk_blok1}\nantre = [t for t in TXS if t[\"id\"] not in masuk_blok1]\nputaran = 1\nwhile antre:\n    putaran += 1\n    masuk = blok_selanjutnya(antre)\n    for i in masuk:\n        waktu[i] = putaran\n    antre = [t for t in antre if t[\"id\"] not in masuk]\ntertahan_3blok = [i for i, p in waktu.items() if p > 3]\ntunggu_tx5 = waktu[\"tx5\"]\n\nprint(f\"blok1: {len(masuk_blok1)} transaksi -> {masuk_blok1}\")\nprint(f\"tx5 masuk di blok ke-{tunggu_tx5}\")\nprint(f\"tertahan setelah 3 blok: {tertahan_3blok}\")",
        checks: [
          { kind: "equal", task: "t1", name: "masuk_blok1", value: ["tx4", "tx2", "tx6"], label: "`masuk_blok1` = tx4, tx2, tx6", msg: "Urutkan fee_rate menurun, pilih yang muat 800 vbytes." },
          { kind: "equal", task: "t3", name: "tunggu_tx5", value: 4, label: "`tunggu_tx5` = 4", msg: "tx5 (600 vbytes, fee 80) baru muat di blok ke-4." },
          { kind: "equal", task: "t3", name: "tertahan_3blok", value: ["tx5"], label: "`tertahan_3blok` = [tx5]", msg: "Hanya tx5 yang masuk setelah blok ke-3." },
          { kind: "stdout_matches", task: "t4", pattern: "blok1: 3 transaksi", label: "Output menampilkan isi blok 1", msg: "Samakan format print dengan contoh." },
          { kind: "stdout_matches", task: "t4", pattern: "tertahan setelah 3 blok", label: "Output menampilkan daftar tertahan", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Mempool = antrean NIAT (tiap node beda isi). Fee rate = tawaran lelang block space. Niat bukan fakta final.",
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
        "Value = isi amplop; fee = ongkos kurir (gasUsed × gasPrice) — dua angka berbeda.",
        "Transfer token ERC-20 tercatat di event log, bukan field value transaksi.",
        "Block = wadah + timestamp; urutan tx dalam blok = urutan eksekusi.",
        "gasUsed adalah sidik jari kompleksitas: 21.000 = transfer biasa.",
        "Audit biaya = jumlahkan fee per transaksi, bukan rata-rata × N.",
      ],
      next: { label: "BCD3 — Address Clustering & Entity Labeling", href: "/learn/bcd3-address" },
      quiz: [
        {
          q: "Transaksi: value = 0 ETH, fee = 0,0029 ETH. Interpretasi paling tepat?",
          options: [
            { text: "Dana dicuri — value 0 tapi kepotong", why: "Tidak ada pencurian; ini pola normal pemanggilan smart contract." },
            { text: "Kemungkinan interaksi smart contract: value 0 + input data + fee komputasi", why: "Contract call tidak memindah ETH (value 0) tetapi membayar komputasi via fee.", correct: true },
            { text: "Transaksi gagal", why: "Transaksi gagal tetap membayar fee, tapi value 0 + fee wajar bukan buktinya." },
            { text: "Transfer token ERC-20", why: "Mungkin, tetapi harus diverifikasi via event Transfer di log — value 0 saja tidak cukup." },
          ],
        },
        {
          q: "Di mana mencatat 'A mengirim 1.000 USDC ke B'?",
          options: [
            { text: "Field value transaksi", why: "Field value hanya mencatat ETH (koin native), bukan token." },
            { text: "Event Transfer pada contract USDC di log transaksi", why: "Token ERC-20 mengumumkan perpindahan via event — satu-satunya catatan resminya.", correct: true },
            { text: "Header block", why: "Header hanya berisi metadata blok, bukan detail transfer token." },
            { text: "Field nonce", why: "Nonce = nomor urut anti-replay, bukan catatan transfer." },
          ],
        },
        {
          q: "65.000 gas × 45 gwei, ETH $3.200. Fee dalam USD?",
          options: [
            { text: "$9,36", why: "65.000 × 45 × 10⁻⁹ = 0,002925 ETH × 3.200 = $9,36.", correct: true },
            { text: "$2,93", why: "Itu jika 1 gwei = 10⁻⁶ ETH — salah tiga orde magnitude." },
            { text: "$936", why: "Lupa konversi gwei→ETH (×10⁻⁹)." },
            { text: "$0,009", why: "Kebalik: ini hasil jika gasPrice dibaca sebagai ETH langsung." },
          ],
        },
        {
          q: "Dompet dengan gasUsed selalu 21.000 dan nonce berurutan rapat. Kesimpulan?",
          options: [
            { text: "Pasti manusia", why: "Manusia justru acak dan jarang bertransaksi." },
            { text: "Kemungkinan bot transfer: pola seragam + frekuensi tinggi = otomatisasi", why: "gasUsed 21.000 = transfer biasa; keseragaman + kerapatan = sidik jari bot.", correct: true },
            { text: "Pasti exchange", why: "Terlalu jauh — butuh label dan pola deposit untuk klaim itu." },
            { text: "Tidak bisa disimpulkan apa-apa", why: "Bisa: keseragaman ekstrem adalah sinyal perilaku yang valid." },
          ],
        },
        {
          q: "Mengapa 'rata-rata fee × N' berbahaya untuk audit total biaya?",
          options: [
            { text: "Karena rata-rata selalu salah", why: "Rata-rata tidak selalu salah — masalahnya distribusi fee heavy-tail." },
            { text: "Fee berdistribusi heavy-tail: sedikit transaksi saat gas spike menyumbang porsi besar total", why: "5% tx saat spike bisa = 40% total fee; rata-rata × N meratakan yang seharusnya tidak rata.", correct: true },
            { text: "Karena N sulit diketahui", why: "N justru mudah diketahui dari jumlah transaksi." },
            { text: "Karena fee tidak tercatat on-chain", why: "Fee tercatat lengkap di setiap receipt — datanya ada." },
          ],
        },
        {
          q: "Input diawali `0x095ea7b3`, jumlah = 10^24 (18 desimal). Interpretasi TEPAT?",
          options: [
            { text: "Transfer 1.000.000 token ke seseorang", why: "095ea7b3 = APPROVE, bukan transfer (a9059cbb). Dan 10^24 wei / 10^18 = 1.000.000 — tapi ini BATAS IZIN, bukan uang yang pindah." },
            { text: "Approve (izin) hingga 1.000.000 token — waspadai jika ke kontrak asing", why: "Tepat. Selector 095ea7b3 = approve; 10^24/10^18 = 1 juta token = batas izin. Approve besar ke kontrak tak dikenal = pola persiapan drain (bcd7). Uang BELUM pindah — tapi pintunya dibuka.", correct: true },
            { text: "Transfer 1 token (salah desimal tidak masalah)", why: "Salah desimal = salah 1.000.000x lipat. 10^24 wei = 1.000.000 token (18 desimal), bukan 1. Dan ini approve, bukan transfer." },
            { text: "Tidak bisa diinterpretasi tanpa tools khusus", why: "Bisa: 4 byte selector + 32 byte address + 32 byte jumlah = struktur tetap. Tiga selector utama cukup dihafal untuk 90% kasus." },
          ],
        },
      ],
    },
  ],
};

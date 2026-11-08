import type { V2Lesson } from "../lib/types";

// Pipeline query: raw transfers -> filter 7 hari -> group by token -> top.
const PIPE_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Pipeline query: tabel transfer mentah, disaring 7 hari terakhir, dikelompokkan per token, diurutkan menurun.">
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600" text-anchor="middle">
<text x="70" y="24">transfers</text><text x="200" y="24">WHERE 7 hari</text><text x="330" y="24">GROUP BY token</text><text x="440" y="24">ORDER BY</text></g>
<rect x="20" y="36" width="100" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle"><text x="70" y="58">1.200 baris</text><text x="70" y="76">token, from</text><text x="70" y="92">to, amount</text><text x="70" y="108">day</text><text x="70" y="128">30 hari</text></g>
<rect x="150" y="36" width="100" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle"><text x="200" y="58">280 baris</text><text x="200" y="76">day ≥ 23</text><text x="200" y="108">buang 920</text><text x="200" y="128">baris lama</text></g>
<rect x="280" y="36" width="100" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle"><text x="330" y="58">DAI 291.120</text><text x="330" y="76">WETH 217.259</text><text x="330" y="94">USDC 204.445</text><text x="330" y="128">3 baris</text></g>
<rect x="400" y="36" width="60" height="110" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<g font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="430" y="58">DAI</text><text x="430" y="76">WETH</text><text x="430" y="94">USDC</text></g>
<g stroke="var(--chart-text)" stroke-width="1.5"><line x1="120" y1="90" x2="150" y2="90"/><line x1="250" y1="90" x2="280" y2="90"/><line x1="380" y1="90" x2="400" y2="90"/></g>
<text x="240" y="176" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">1.200 baris → saring waktu → agregasi → 3 baris jawaban</text>
</svg>`;

const BCD9_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Biaya query: tanpa filter Rp32.000, dengan filter tanggal Rp136, dengan agregasi bertingkat Rp3."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Rp0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Rp16rb</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Rp32rb</text><rect x="72.5" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c4)"/><text x="115.7" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp32.000</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tanpa filter</text><rect x="211.8" y="179.3" width="86.4" height="0.7" rx="3" fill="var(--c3)"/><text x="255.0" y="173.3" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp136</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Filter tanggal</text><rect x="351.1" y="180.0" width="86.4" height="0.0" rx="3" fill="var(--c1)"/><text x="394.3" y="174.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp3</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">+ agregasi</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">rupiah / query</text></svg>`;

export const bcd9: V2Lesson = {
  slug: "bcd9-sql",
  track: "Blockchain Data Scientist",
  module: "Investigasi & Risiko",
  title: "BCD9 — SQL untuk Data Chain (Gaya Dune)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "20 baris SQL yang menjawab Rp10 miliar",
      prose: [
        "2023. Sebuah DAO akan menginvestasikan Rp10 miliar ke sebuah DEX. Sebelum voting, seorang analis komunitas mempublikasikan dashboard Dune 20 baris SQL: volume 7 hari per token, 10 penerima terbesar, dan — yang mematikan — 78% volume berasal dari 12 address yang saling bertransaksi (wash, bcd6). Voting dibatalkan. Rp10 miliar selamat.",
        "Twist-nya: analis itu tidak punya akses khusus, tidak kenal orang dalam, tidak menjalankan node. Ia hanya TAHU POLA query apa yang menjawab pertanyaan apa. Di dunia on-chain, keunggulan analis bukan data eksklusif — datanya sama untuk semua orang. Keunggulannya adalah kemampuan bertanya lewat query.",
        "Lesson ini: pola query analitik on-chain gaya Dune — ditulis dan dijalankan sebagai logika Python di lab (fokus pada POLA berpikir, bukan engine SQL). Kamu akan menulis ekuivalen Python dari SELECT–WHERE–GROUP BY–ORDER BY–LIMIT, lalu melihat SQL aslinya. Tujuan: (1) menerjemahkan pertanyaan bisnis ke pola query; (2) memakai agregasi + window function; (3) menghindari jebakan duplikasi. Peta: cerita → tabel inti → pola 1–3 → lab → window function → jebakan → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menulis query gaya Dune untuk volume, top holder, dan DAU dari data transfer; (2) menghindari jebakan klasik: double-counting, kardinalitas 1-ke-N, dan salah desimal; (3) memakai window function (LAG, RANK) untuk analisis deret waktu; (4) mengoptimasi query dengan partisi agar 100x lebih murah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Bisa SQL = bisa analisis on-chain.\" SQL hanyalah tata bahasa; yang sulit adalah SEMANTIK chain-nya: tahu bahwa 'volume USDC' = filter event Transfer pada contract USDC (bukan field value), tahu beda tx count vs event count (bcd2), tahu kapan agregasi menggandakan hitungan karena satu tx punya banyak event. Query benar + semantik salah = jawaban salah yang terlihat meyakinkan.",
      },
      reference: "Keunggulan analis on-chain = pola query + semantik chain, bukan akses data.",
    },
    {
      id: "tabel-inti",
      eyebrow: "Langkah 2 · Tabel inti",
      title: "Tiga tabel yang menjawab 80% pertanyaan",
      prose: [
        "Tabel 1 — transfers: (token, from, to, amount, day). Dibangun dari event Transfer. Menjawab: volume, aliran, konsentrasi. Tabel 2 — transactions: (hash, from, to, value, gas_used, gas_price, block). Menjawab: fee, aktivitas, urutan (bcd2, bcd8). Tabel 3 — balances/token_holders: (address, token, balance, day). Menjawab: distribusi, HHI (bcd1, bcd5).",
        "Kunci relasinya: transactions.hash ↔ transfers.tx_hash (satu tx → banyak event); token_holders.address ↔ transfers.from/to. Setiap JOIN harus tahu kardinalitasnya — di sinilah duplikasi menyelinap (lihat langkah 6).",
        "Cara membaca diagram: pipeline 4 kotak — 1.200 baris mentah (30 hari) → WHERE day ≥ 23 (280 baris, 7 hari) → GROUP BY token + SUM (3 baris: DAI 291.120, WETH 217.259, USDC 204.445) → ORDER BY menurun. Interpretasi: 99,75% baris DIBUANG sebelum menjawab — query analitik = seni membuang dengan benar. Salah filter = jawaban salah.",
      ],
      figure: {
        svg: PIPE_SVG,
        alt: "Pipeline query: tabel transfer mentah, disaring 7 hari terakhir, dikelompokkan per token, diurutkan menurun.",
        caption: "Pipeline 'volume 7 hari per token': saring waktu → agregasi → urutkan. 1.200 baris menjadi 3 baris jawaban.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: WHERE adalah keputusan analis, bukan detail teknis",
        body: "'7 hari terakhir' vs '30 hari' vs 'sejak peluncuran' bisa membalik kesimpulan: token yang 'banyak volume' dalam 7 hari bisa sepi dalam 30 hari (wash musiman). Setiap kali menulis WHERE waktu, tanyakan: 'apakah jendela ini mewakili fenomena yang saya klaim?' Jendela yang salah = cherry-picking yang tidak disengaja. Dokumentasikan alasan jendelamu di catatan query.",
      },
      reference: "3 tabel inti: transfers, transactions, token_holders. WHERE waktu = keputusan analis.",
    },
    {
      id: "pola",
      eyebrow: "Langkah 3 · Tiga pola",
      title: "Pola query yang paling sering dipakai",
      prose: [
        "Pola 1 — Agregasi per kategori: 'volume 7 hari per token'. SQL: SELECT token, SUM(amount) FROM transfers WHERE day >= 23 GROUP BY token ORDER BY 2 DESC. Ini 60% query Dune di dunia.",
        "Pola 2 — Top-N: '10 penerima terbesar'. Tambahkan LIMIT 10 pada agregasi per penerima. Selalu tampilkan juga % dari total — 'terima Rp279 juta' tanpa konteks ('= 4% total') = angka gantung.",
        "Pola 3 — Aktivitas unik: 'daily active addresses'. COUNT(DISTINCT from) + COUNT(DISTINCT to) per hari — metrik adopsi yang lebih jujur daripada tx count (satu bot bisa membuat 10.000 tx).",
        "Ketiga pola ini composable: filter → kelompokkan → agregasi → urutkan → batasi. Hampir semua dashboard Dune adalah variasi urutan ini dengan tabel berbeda.",
      ],
      formula: String.raw`\text{share}_N = \frac{\sum_{i=1}^{N} v_{(i)}}{\sum_{j} v_j}`,
      formulaNote: "v_(i) = volume penerima terbesar ke-i; penyebut = total volume periode. share_N menjawab 'berapa % dikuasai N terbesar' — angka yang wajib menyertai setiap klaim Top-N.",
      tasks: [],
      note: {
        title: "💡 Intuisi: DISTINCT adalah kejujuran",
        body: "COUNT(*) menghitung peristiwa; COUNT(DISTINCT address) menghitung PELAKU. '10.000 transaksi' bisa berarti 10.000 orang atau 1 bot. Setiap metrik 'aktivitas' yang tidak memakai DISTINCT sedang berbohong — atau minimal, sedang tidak jujur. Kebiasaan: tiap kali melihat angka aktivitas, tanya 'ini peristiwa atau pelaku?'",
      },
      reference: "Agregasi, Top-N, aktivitas unik (DISTINCT). Peristiwa ≠ pelaku.",
    },
    {
      id: "lab-query",
      eyebrow: "Langkah 4 · Lab",
      title: "Menulis pola query dalam Python",
      prose: [
        "Dataset sintetis: 1.200 transfer (token, from, to, amount, day) selama 30 hari, seed 21 — meniru tabel transfers Dune. Kamu akan mengimplementasikan tiga pola sebagai logika Python (di Dune ini adalah SQL; polanya identik).",
        "Tugasmu: (1) `vol` = total amount per token untuk 7 hari terakhir (day ≥ 23), sebagai dict; (2) `top3` = 3 penerima terbesar (address, total) di 7 hari terakhir; (3) `dau` = jumlah address unik yang aktif di hari ke-29.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `vol`: dict token → total amount (day ≥ 23)" },
        { id: "t2", text: "Hitung `top3`: list 3 (address, total) penerima terbesar" },
        { id: "t3", text: "Hitung `dau`: address unik aktif di day 29" },
        { id: "t4", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "vol={'DAI': 291120.11, 'WETH': 217258.65, 'USDC': 204445.45}\ntop1=0x47 (27926.01)  dau=56",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjumlahkan SEMUA 30 hari padahal pertanyaan minta 7 hari terakhir. Filter waktu (WHERE) harus diterapkan SEBELUM agregasi — kalau tidak, DAI 'menang' hanya karena datanya lebih tua. Urutan pipeline tidak bisa ditukar: saring → kelompokkan → jumlahkan. Ini bug paling umum di query Dune publik.",
      },
      hints: [
        "last7 = [r for r in rows if r[4] >= 23].",
        "Gunakan defaultdict(float) untuk menjumlahkan per token / per penerima.",
        "dau: set() dari from dan to pada baris day == 29.",
      ],
      code: {
        starter: `import random\nfrom collections import defaultdict\nrandom.seed(21)  # JANGAN DIUBAH\ntokens = ["USDC", "WETH", "DAI"]\nrows = []\nfor d in range(30):\n    for _ in range(40):\n        rows.append((random.choice(tokens), f"0x{random.randint(0,49):02x}",\n                     f"0x{random.randint(50,99):02x}", round(random.uniform(10, 5000), 2), d))\n# rows = (token, from, to, amount, day)\n\n# TULIS KODEMU\nlast7 = [r for r in rows if r[4] >= 23]\nvol = defaultdict(float)\nfor t, f, to, a, d in last7:\n    vol[t] += \nrecv = defaultdict(float)\nfor t, f, to, a, d in last7:\n    recv[to] += \ntop3 = sorted(recv.items(), key=lambda x: -x[1])[:3]\nactive = set()\nfor t, f, to, a, d in rows:\n    if d == 29:\n        active.add(f); active.add(to)\ndau = \n\nprint(f"vol={ {k: round(v, 2) for k, v in sorted(vol.items(), key=lambda x: -x[1])} }")\nprint(f"top1={top3[0][0]} ({top3[0][1]:.2f})  dau={dau}")`,
        lockLines: 8,
        solution: `import random\nfrom collections import defaultdict\nrandom.seed(21)  # JANGAN DIUBAH\ntokens = ["USDC", "WETH", "DAI"]\nrows = []\nfor d in range(30):\n    for _ in range(40):\n        rows.append((random.choice(tokens), f"0x{random.randint(0,49):02x}",\n                     f"0x{random.randint(50,99):02x}", round(random.uniform(10, 5000), 2), d))\n# rows = (token, from, to, amount, day)\n\n# TULIS KODEMU\nlast7 = [r for r in rows if r[4] >= 23]\nvol = defaultdict(float)\nfor t, f, to, a, d in last7:\n    vol[t] += a\nrecv = defaultdict(float)\nfor t, f, to, a, d in last7:\n    recv[to] += a\ntop3 = sorted(recv.items(), key=lambda x: -x[1])[:3]\nactive = set()\nfor t, f, to, a, d in rows:\n    if d == 29:\n        active.add(f); active.add(to)\ndau = len(active)\n\nprint(f"vol={ {k: round(v, 2) for k, v in sorted(vol.items(), key=lambda x: -x[1])} }")\nprint(f"top1={top3[0][0]} ({top3[0][1]:.2f})  dau={dau}")`,
        checks: [
          { kind: "defined", task: "t1", name: "vol", label: "`vol` terdefinisi", msg: "Buat dict vol: token → total amount." },
          { kind: "stdout_matches", task: "t1", pattern: "vol=\\{'DAI': 291120\\.11, 'WETH': 217258\\.65, 'USDC': 204445\\.45\\}", label: "Volume 7 hari per token benar", msg: "Filter day ≥ 23 dulu, baru jumlahkan per token. DAI 291120.11." },
          { kind: "stdout_matches", task: "t2", pattern: "top1=0x47 \\(27926\\.01\\)", label: "top1 = 0x47 (27926.01)", msg: "Penerima terbesar 7 hari terakhir." },
          { kind: "equal", task: "t3", name: "dau", value: 56, tol: 0, label: "`dau` = 56", msg: "Address unik (from ∪ to) di day 29." },
          { kind: "stdout_matches", task: "t4", pattern: "dau=56", label: "Output menampilkan dau=56", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Saring (WHERE) → kelompokkan (GROUP BY) → jumlahkan (SUM) → urutkan → batasi.",
    },
    {
      id: "window",
      eyebrow: "Langkah 5 · Window function",
      title: "Peringkat tanpa kehilangan baris",
      prose: [
        "Window function (ROW_NUMBER, RANK, LAG, SUM OVER) menghitung sesuatu 'sambil melihat sekeliling' tanpa meruntuhkan baris. Contoh klasik on-chain: 'untuk tiap address, berapa % ia menyumbang dari total volume hari itu?' — butuh total harian (agregat) DI SAMPING tiap baris (detail). GROUP BY tidak bisa (ia meruntuhkan baris); window bisa: SUM(amount) OVER (PARTITION BY day).",
        "Pola andalan kedua: LAG — 'bandingkan dengan hari kemarin'. Pertumbuhan DAU day-over-day, deteksi lonjakan: WHERE amount > 3 * LAG(amount) OVER (PARTITION BY token ORDER BY day) = 'volume hari ini 3× kemarin' — pemicu alert anomali.",
        "Pola ketiga: running total — SUM(amount) OVER (ORDER BY day ROWS UNBOUNDED PRECEDING) = kurva adopsi kumulatif. Kapan kurvanya mendatar? Di situlah pertumbuhan berhenti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Alert 'volume 3× kemarin' adalah fondasi monitoring real-time: lonjakan deposit ke mixer, penarikan massal dari lending, atau akumulasi sebelum pengumuman (insider). Aturan produksi: window function di scheduled query tiap jam + ambang yang dikalibrasi dari histori 90 hari (bukan angka tebakan). Ambang tanpa kalibrasi = alert fatigue.",
      },
      reference: "Window: agregat tanpa meruntuhkan baris. LAG = detektor lonjakan; running SUM = kurva adopsi.",
    },
    {
      id: "jebakan-duplikasi",
      eyebrow: "Langkah 6 · Jebakan",
      title: "Duplikasi: pembunuh senyap query",
      prose: [
        "Jebakan 1 — JOIN satu-ke-banyak: JOIN transactions ke transfers (1 tx → N event) lalu SUM(value) = value terhitung N kali. Solusi: agregasi DULU di level yang benar, baru JOIN — atau SUM(DISTINCT ...) bila aman.",
        "Jebakan 2 — Double counting token: menghitung 'total TVL' dengan menjumlahkan balance SEMUA token termasuk token LP (bcd4). Solusi: whitelist underlying.",
        "Jebakan 3 — Jendela waktu tak sinkron: membandingkan 'volume minggu ini' (7×24 jam penuh) vs 'minggu lalu' yang kepotong maintenance — apel vs jeruk. Solusi: samakan definisi jendela, dokumentasikan.",
        "Kebiasaan defensif: setiap query agregasi diakhiri tiga cek — (a) COUNT baris masuk akal? (b) total ≈ angka pembanding independen? (c) ulangi dengan jendela berbeda, apakah kesimpulan bertahan?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Query jalan tanpa error berarti benar.\" SQL tidak pernah protes saat kamu men-SUM kolom yang terduplikasi 5× — ia dengan senang hati mengembalikan angka yang salah dengan format yang rapi. Di data chain (satu tx → banyak event), JOIN yang ceroboh adalah sumber angka fantastis yang lolos review. Verifikasi dengan pembanding independen (mis. total dari explorer) sebelum mempublikasikan.",
      },
      reference: "Agregasi dulu, baru JOIN. Tiga cek: COUNT, pembanding independen, jendela alternatif.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Pertanyaan → pola query",
      prose: [
        "Skenario 1 — 'Berapa volume X?' → transfers + WHERE waktu + GROUP BY kategori + SUM. Cek duplikasi event.",
        "Skenario 2 — 'Siapa pemain terbesar?' → agregasi per address + ORDER BY DESC + LIMIT + tampilkan % dari total.",
        "Skenario 3 — 'Apakah aktivitas tumbuh?' → COUNT(DISTINCT address) per hari + LAG untuk day-over-day. Peristiwa ≠ pelaku.",
        "Skenario 4 — 'Ada anomali?' → window function (3× LAG) sebagai alert; kalibrasi ambang dari histori 90 hari.",
        "Skenario 5 — 'Berapa konsentrasi?' → agregasi per address + HHI/CR di luar SQL (atau subquery).",
        "Aturan praktis 10 detik: (1) tulis pertanyaan dalam satu kalimat; (2) pilih SATU tabel utama; (3) tentukan WHERE waktu + alasan; (4) agregasi di level yang benar; (5) cek dengan pembanding independen. Lima langkah, nol angka fantastis.",
      ],
      tasks: [],
      reference: "Satu kalimat → satu tabel → WHERE beralasan → agregasi level benar → cek independen.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dashboard 20 baris yang membatalkan Rp10 miliar",
      prose: [
        "Query analis DAO: (1) volume 30 hari per token → USDC 'Rp120 miliar'; (2) COUNT(DISTINCT) pembeli → hanya 214 address unik; (3) % volume dari 12 address teratas → 78%; (4) graf resiprokal antar 12 address (bcd6) → pola wash. Empat query, satu kesimpulan: volume direkayasa.",
        "Angka yang mematikan bukan 'Rp120 miliar' — melainkan RASIO: 78% dari 12 address + 214 pembeli unik untuk 'DEX populer'. Analis senior tidak melaporkan angka besar; ia melaporkan angka yang MEMBUNUH NARASI.",
        "Pembahasan: (a) query 1–3 semuanya pola standar (agregasi, DISTINCT, Top-N) — tidak ada yang eksotis; (b) yang membuatnya berharga = KOMBINASI + interpretasi ('78% dari 12 address' vs klaim 'DEX ramai'); (c) pelajaran: dashboard terbaik bukan yang paling banyak chart, melainkan yang menjawab 'apakah klaim ini benar?' dengan angka yang bisa diverifikasi siapa pun.",
      ],
      tasks: [],
      reference: "Laporkan angka yang menguji klaim, bukan angka terbesar.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Partisi & pruning: query 100x lebih murah",
      prose: [
        "Query lesson ini memindai 30 hari × 40 tx = 1.200 baris (kecil). Data nyata: Ethereum = 2+ miliar transaksi. Query `SELECT SUM(amount) FROM transfers` tanpa filter = SCAN PENUH = 2 miliar baris × $5/TB (BigQuery) = Rp400.000 per query. Analis yang menjalankan 20x sehari = Rp8 juta/hari = Rp240 juta/bulan. Untuk query yang SAMA yang bisa Rp2.400/bulan dengan partisi. Selisih 100x = Rp237 juta/bulan untuk satu analis ceroboh.",
        "Cara kerja partisi: data dibagi per HARI (atau per 1 juta blok). Query dengan `WHERE block_date BETWEEN '2026-09-01' AND '2026-09-07'` hanya membaca 7 partisi dari 3.000+ → 400x lebih sedikit data. Rumus biaya: biaya = baris_dibaca × Rp5/TB / 10^12. Contoh: 7 hari × 1,2 juta tx/hari = 8,4 juta baris (×200 byte) = 1,7GB → Rp136. Tanpa filter tanggal: 2 miliar baris = 400GB → Rp32.000. SATU baris WHERE = hemat Rp31.864 per query.",
        "Tiga aturan query hemat: (1) SELALU filter tanggal/blok DULU — sebelum JOIN, sebelum agregasi. (2) PILIH kolom secukupnya — `SELECT *` membaca 10x lebih banyak dari `SELECT token, amount`. (3) AGREGASI di level partisi — hitung per hari dulu (murah), baru agregasi 30 hari (dari 30 baris, bukan 36 juta). Contoh pola: WITH daily AS (SELECT date, SUM(amount) FROM t WHERE date BETWEEN ... GROUP BY date) SELECT AVG(...) FROM daily. Pola ini 50x lebih murah dari agregasi langsung.",
        "Jebakan `kardinalitas 1-ke-N` (lesson ini) juga soal biaya: JOIN transfers (36 juta) × token_info (3 baris) TANPA kondisi = 108 juta baris sementara — meledak 3x. Selalu JOIN dengan kunci yang tepat (token_address) DAN filter tanggal di KEDUA sisi. Dan `double-counting` bukan cuma soal kebenaran — data yang terhitung N kali = N kali lebih besar = N kali lebih mahal. Kebenaran dan biaya adalah DUA sisi koin yang sama.",
        "Untuk Dune/Flipside (bukan BigQuery): biayanya bukan uang tapi WAKTU dan LIMIT. Query tanpa filter tanggal = timeout 30 menit = slot komputasi gratis habis. Aturannya sama: filter tanggal dulu, agregasi bertingkat, dan SIMPAN hasil intermediate sebagai tabel (materialized) jika query dipakai berulang. Dashboard yang query-nya 5 menit × 100 viewer/hari = 500 menit compute/jam = antrean untuk semua orang. Materialisasi 1x per jam = 5 menit/jam total.",
        "Terakhir, ukur SEBELUM optimasi: `EXPLAIN` (BigQuery: dry run) menunjukkan baris_dibaca SEBELUM bayar. Kebiasaan: tulis query → dry run → lihat estimasi (Rp32.000?!) → tambah filter → dry run lagi (Rp136 ✓) → jalankan. 30 detik dry run menghemat Rp31.864. Analis yang tidak dry-run = supir yang tidak lihat bensin sebelum road trip lintas pulau.",
      ],
      formula: String.raw`\text{biaya} = \text{baris}_{dibaca} \times \text{byte/baris} \times \frac{Rp5}{10^{12}}`,
      formulaNote: "baris_dibaca = setelah pruning partisi (bukan total tabel!); byte/baris ≈ 200 untuk transfer. Satu WHERE tanggal yang baik memangkas 100–400x. Selalu dry-run dulu: 30 detik menghemat jutaan rupiah.",
      figure: {
        svg: BCD9_DEEP_SVG,
        alt: "Diagram batang biaya query: Rp32.000 tanpa filter vs Rp136 dengan filter tanggal vs Rp3 dengan agregasi bertingkat.",
        caption: "Cara membaca: tinggi batang = biaya SATU query yang sama (rupiah); tiga batang = tiga tingkat optimasi. Interpretasi: satu baris WHERE tanggal = hemat 235x; agregasi bertingkat = hemat 10.000x total. Query mahal hampir selalu = query yang lupa filter partisi.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: dry-run dulu, bayar kemudian",
        body: "30 detik dry-run menunjukkan estimasi biaya SEBELUM dieksekusi. Rp32.000 yang terlihat di estimasi = Rp32.000 yang tidak jadi terbuang. Jadikan dry-run kebiasaan seperti `lihat spion sebelum belok` — otomatis, tidak perlu dipikir.",
      },
      reference: "Pola hemat: filter tanggal → agregasi per partisi → agregasi final. Materialisasi untuk dashboard.",
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
        "3 tabel inti: transfers, transactions, token_holders — kenali kardinalitas JOIN-nya.",
        "Pola: agregasi, Top-N, aktivitas unik (DISTINCT). Saring dulu, baru agregasi.",
        "Window function: agregat tanpa meruntuhkan baris; LAG = detektor lonjakan.",
        "Jebakan: duplikasi JOIN 1-ke-N, double counting token, jendela tak sinkron.",
        "WHERE waktu = keputusan analis — dokumentasikan alasannya.",
      ],
      next: { label: "BCD10 — Graph Analysis Aliran Dana", href: "/v2/learn/bcd10-graph" },
      quiz: [
        {
          q: "Menghitung 'volume USDC minggu ini'. Query yang benar memakai…",
          options: [
            { text: "Field value di tabel transactions", why: "Field value = ETH, bukan USDC." },
            { text: "Event Transfer pada contract USDC (tabel transfers) + filter waktu", why: "Transfer token hanya tercatat di event log.", correct: true },
            { text: "Tabel token_holders", why: "Itu saldo snapshot, bukan volume perpindahan." },
            { text: "COUNT(*) tabel transactions", why: "Menghitung transaksi, bukan volume USDC." },
          ],
        },
        {
          q: "JOIN transactions → transfers lalu SUM(value). Bahayanya?",
          options: [
            { text: "Tidak ada — SQL menanganinya", why: "SQL tidak protes; value terhitung N kali." },
            { text: "Satu tx punya N event → value terduplikasi N kali. Agregasi dulu di level benar, baru JOIN", why: "Kardinalitas 1-ke-N adalah pembunuh senyap query.", correct: true },
            { text: "Query menjadi lambat", why: "Masalahnya kebenaran, bukan kecepatan." },
            { text: "Hasilnya selalu nol", why: "Justru membengkak, bukan nol." },
          ],
        },
        {
          q: "'10.000 transaksi kemarin' vs '214 address unik'. Mana metrik adopsi yang jujur dan mengapa?",
          options: [
            { text: "10.000 transaksi — lebih besar", why: "Besar ≠ jujur; 1 bot bisa membuat 10.000 tx." },
            { text: "214 address unik — COUNT(DISTINCT) menghitung pelaku, bukan peristiwa", why: "Adopsi = orang, bukan klik.", correct: true },
            { text: "Keduanya sama", why: "Bisa beda 50× lipat seperti contoh ini." },
            { text: "Tidak ada yang valid", why: "DISTINCT address adalah standar industri yang valid." },
          ],
        },
        {
          q: "Kapan memakai LAG(amount) OVER (PARTITION BY token ORDER BY day)?",
          options: [
            { text: "Untuk menjumlahkan total volume", why: "Itu SUM (agregasi), bukan LAG — LAG menggeser satu baris ke belakang DALAM partisi untuk membandingkan dengan periode sebelumnya, sedangkan SUM menjumlahkan. Untuk tren mingguan, butuh LAG; SUM hanya memberi total." },
            { text: "Untuk membandingkan hari ini vs kemarin — detektor lonjakan (mis. 3× kemarin = alert)", why: "LAG menggeser satu baris ke belakang dalam partisi.", correct: true },
            { text: "Untuk mengurutkan token", why: "Itu ORDER BY biasa (mengurutkan hasil akhir), bukan window ORDER BY di dalam OVER() — window function butuh PARTITION BY + ORDER BY di dalam OVER() untuk mendefinisikan `jendela` perhitungannya." },
            { text: "Untuk menghapus duplikat", why: "Itu DISTINCT (menghilangkan duplikat hasil), bukan window function — DISTINCT bekerja pada baris output, sedangkan LAG/RANK bekerja pada URUTAN baris di dalam partisi. Beda mekanisme, beda guna." },
          ],
        },
        {
          q: "Query volume '7 hari terakhir' vs '30 hari' memberi kesimpulan berlawanan. Sikap yang benar?",
          options: [
            { text: "Pilih yang mendukung hipotesismu", why: "Itu cherry-picking — memilih jendela waktu yang `kebetulan` mendukung kesimpulan. Jendela analisis harus ditentukan SEBELUM melihat data (atau pakai beberapa jendela sebagai uji sensitivitas), bukan dipilih setelah." },
            { text: "Pertanyakan apakah jendela mewakili fenomena; dokumentasikan alasan jendela; uji keduanya", why: "Jendela waktu = keputusan analis yang harus dipertahankan.", correct: true },
            { text: "Selalu pakai 30 hari — lebih banyak data lebih baik", why: "Lebih banyak ≠ lebih relevan; wash musiman bisa tersembunyi di 30 hari." },
            { text: "Rata-ratakan keduanya", why: "Merata-ratakan dua jendela tidak menjawab pertanyaan mana yang tepat." },
          ],
        },
        {
          q: "Query agregasi 1 tahun (2 miliar baris) tanpa filter tanggal: estimasi Rp32.000/query, dijalankan 20x/hari. Solusi TEPAT?",
          options: [
            { text: "Jalankan saja — Rp32.000 masih murah", why: "20x × 24 jam × Rp32.000 = Rp15,4 juta/HARI = Rp460 juta/bulan. `Masih murah` untuk 1 query ≠ murah untuk 480 query/hari." },
            { text: "Filter tanggal + agregasi bertingkat + dry-run; biaya turun ke ~Rp3/query", why: "Tepat. Pruning partisi (7 hari, bukan 365) + agregasi per hari dulu = 10.000x lebih murah. Rp460jt/bulan → Rp43rb/bulan.", correct: true },
            { text: "Minta naik limit budget query ke Rp500 juta/bulan", why: "Menambah budget untuk query boros = mempekerjakan orang untuk membakar uang. Perbaiki query-nya, bukan budgetnya." },
            { text: "Pindah ke database yang lebih murah", why: "Database murah dengan query tanpa filter = tetap scan 2 miliar baris = tetap lambat + tetap mahal (relatif). Masalahnya pola query, bukan vendor." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

const BCD14_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Garis pertumbuhan data indeks dari 30 ke 600 GB dalam 7 hari."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">300</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">600</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">2</text><text x="185.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">4</text><text x="324.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">5</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">6</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">7</text><polyline points="46.0,180.0 115.7,175.8 185.3,166.0 255.0,146.3 324.7,115.4 394.3,70.5 464.0,20.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">GB / hari</text></svg>`;

export const bcd14: V2Lesson = {
  slug: "bcd14-indexing-skala-besar",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD14 — Indexing Skala Besar (Subgraph/BigQuery)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query yang memakan 6 jam",
      prose: [
        "Rabu 10:00. Analis Nara (BCD12!) butuh jawaban: `total volume DEX per token per hari, 90 hari terakhir`. Ia menulis query ke node RPC langsung: ambil semua Transfer event... 90 hari × 86.400 blok × ~200 tx = 1,5 MILIAR tx untuk di-scan. Query jalan... 11:00 (belum selesai). 14:00 (belum). 16:00: TIMEOUT. Ia coba lagi dengan `rentang dipersempit` — jawaban parsial, tidak bisa dipertanggungjawabkan. Kamis pagi ia menemukan kata ajaib: INDEXING.",
        "Twist-nya: tim sebelah menjawab pertanyaan SAMA dalam 4 DETIK. Bukan karena mereka lebih pintar — karena mereka tidak query blockchain; mereka query INDEKS yang sudah dibangun (subgraph + BigQuery). Nara memindai 1,5 miliar tx SETIAP query; tim sebelah memindai 1,5 miliar tx SEKALI (saat indexing), lalu query tabel kecil. Perbedaannya bukan skill — melainkan arsitektur. Lesson ini: arsitektur itu.",
        "Indexing = ETL untuk blockchain: ekstrak event dari chain → transform (decode, agregat) → load ke database yang bisa di-query (Postgres, BigQuery). Dua jalur utama: (1) SUBGRAPH (The Graph): definisikan schema + mapping (apa yang diindeks), network desentralisasi yang menjalankannya, query via GraphQL; (2) BIGQUERY (Google public datasets): SEMUA data Ethereum/BSC/Polygon sudah diindeks Google, query via SQL — gratis sampai 1TB/bulan!",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa query langsung ke RPC tidak skala dan kapan harus indexing; (2) membandingkan subgraph vs BigQuery vs self-indexed untuk kebutuhan konkret; (3) merancang schema indexing (apa diindeks, agregasi apa) untuk pertanyaan analitis; (4) menulis query agregat multi-hari dari tabel indeks; (5) menghitung biaya dan waktu indexing untuk dataset baru.",
        "Daftar isi: 1) Cerita query 6 jam · 2) Mengapa RPC tidak skala · 3) Subgraph vs BigQuery vs self-host · 4) Lab: agregat dari tabel indeks · 5) Merancang schema: seni memilih · 6) Peta keputusan: jalur indexing apa · 7) Mini-case: 1,5 miliar tx · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Query blockchain = query database biasa`",
        type: "pitfall",
        body: "Blockchain BUKAN database yang bisa di-query (`SELECT * WHERE ...`) — ia append-only log yang hanya bisa dibaca per blok. Query analitis (`volume per hari 90 hari`) = scan 1,5 miliar tx. Indexing mengubah log menjadi database BETULAN. Jangan lawan arsitekturnya; bangun di atasnya.",
      },
      reference: "Query RPC = scan tiap kali. Indexing = scan sekali, query selamanya.",
    },
    {
      id: "mengapa-rpc",
      eyebrow: "Langkah 2 · Konsep",
      title: "Mengapa RPC tidak skala: aritmetika 1,5 miliar",
      prose: [
        "RPC (eth_getLogs) dirancang untuk OPERASIONAL (cek 1 tx, baca 1 blok), bukan ANALITIS. Batasan keras: (1) max 10.000 blok per request (banyak provider!); (2) rate limit 10–30 req/detik; (3) timeout 30–60 detik. Untuk 90 hari (~648.000 blok): 65 request berantai (10.000 blok/request) × 3 detik = 3 menit HANYA untuk daftar log — lalu DECODE tiap log (1,5 miliar × 0,1ms = 42 jam!). Total: 6 jam untuk query Nara yang gagal, 42 jam jika diteruskan. Dan ini untuk SATU pertanyaan!",
        "Matematika yang jujur: T_query = (blok / 10.000) × t_req + N_log × t_decode. Dengan blok=648.000, t_req=3s, N_log=1,5M (setelah filter!), t_decode=0,1ms: 195 detik + 150 detik = ~6 menit?? Tunggu — itu jika SUDAH TAHU log mana yang relevan. Tanpa indeks, kamu tidak tahu: harus scan SEMUA 1,5 MILIAR tx dulu (42 jam) untuk menemukan 1,5 juta yang relevan. Indeks = yang tahu di mana yang relevan.",
        "Analogi yang tepat: RPC = perpustakaan TANPA katalog (cari buku = buka tiap rak!). Indexing = MEMBUAT katalog (sekali), lalu cari via katalog (detik). Nara membuka 648.000 `rak` (blok) tiap query; tim sebelah membuka katalog. Jangan salahkan Nara — salahkan yang menyuruhnya tanpa katalog.",
        "Tiga pola yang GAGAL di RPC tapi TRIVIAL di indeks: (1) AGREGASI WAKTU (`volume per hari`) — butuh scan penuh; (2) JOIN (`transfer DARI address yang pernah terima DARI mixer`) — RPC tidak bisa join!; (3) FULL HISTORY (`semua tx address ini sejak 2020`) — 6 tahun scan. Jika pertanyaanmu mengandung `per hari`, `rata-rata`, `semua`, atau `yang pernah` — itu sinyal BUTUH INDEKS, bukan RPC yang lebih sabar.",
        "Biaya tersembunyi RPC: provider mengenakan $50–$200/bulan untuk 100 juta request — dan query Nara = ribuan request BERAT (compute units 10x!). Satu analis `rajin` bisa menghabiskan kuota tim seminggu dalam sehari. Indeks: bayar SEKALI (indexing), query ringan selamanya. Ekonominya sama dengan lesson MLOps13: pindai sekali, bukan tiap kali.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: katalog vs rak",
        body: "RPC tanpa indeks = cari buku dengan membuka tiap rak perpustakaan (648.000 rak!). Indexing = buat katalog sekali (mahal, 42 jam), lalu tiap pencarian 4 detik (murah). Pertanyaan analitis ke-2 dan seterusnya = katalog MENANG telak. Jangan buka rak dua kali.",
      },
      reference: "Sinyal butuh indeks: `per hari`, `rata-rata`, `semua`, `yang pernah`. RPC = operasional, bukan analitis.",
    },
    {
      id: "tiga-jalur",
      eyebrow: "Langkah 3 · Konsep",
      title: "Subgraph vs BigQuery vs self-host",
      prose: [
        "JALUR 1 — BIGQUERY public datasets: Google sudah mengindeks SEMUA blok Ethereum/BSC/Polygon ke tabel (transactions, logs, token_transfers). Kamu tinggal SQL! Contoh Nara: `SELECT DATE(block_timestamp), token_address, SUM(value) FROM bigquery-public-data.crypto_ethereum.token_transfers WHERE ... GROUP BY 1,2` — 4 detik, GRATIS (di bawah 1TB/bulan!). Keterbatasan: (1) delay 10–60 menit (bukan real-time!); (2) hanya chain populer; (3) schema generik (tidak ada logika bisnis custom!). Untuk 80% analisis historis: INI JAWABANNYA.",
        "JALUR 2 — SUBGRAPH (The Graph): kamu DEFINISIKAN apa yang diindeks (schema.graphql: entitas apa; mapping.ts: event apa → entitas bagaimana). Network desentralisasi menjalankan indexing; kamu query via GraphQL. Contoh: indeks `Swap` per pool per jam untuk DEX custom (BigQuery tidak punya logika `pool`!). Kelebihan: real-time (~1 menit), logika custom, desentralisasi. Kekurangan: butuh MENULIS mapping (skill!), indexing awal 1–7 hari untuk chain penuh, biaya query (GRT) untuk volume besar.",
        "JALUR 3 — SELF-HOSTED (custom indexer): bangun sendiri (Python + Postgres + websocket). Kelebihan: kontrol PENUH (schema apa pun, real-time detik, tanpa biaya pihak ketiga). Kekurangan: kamu yang OPERASIKAN (reorg! node down! disk penuh! — ingat MLOps6?). Cocok untuk: data proprietary (label internal!), kebutuhan real-time kritis (deteksi fraud!), atau chain yang tidak didukung siapa pun. Jangan mulai dari sini kecuali ada alasan kuat.",
        "Perbandingan 30 detik: BigQuery = tercepat dimulai (5 menit!), termurah (gratis 1TB), tapi generik + delay. Subgraph = custom + real-time, tapi butuh coding + indexing awal. Self-host = kontrol penuh, tapi kamu tim ops-nya. Nara: BigQuery (pertanyaannya generik + historis!). Tim fraud real-time: self-host. DEX custom butuh agregat pool: subgraph.",
        "Jebakan BigQuery: (1) 1TB gratis = ~30 query BERAT/bulan — query `SELECT *` tanpa filter tanggal = 500GB SEKALI query! Selalu filter `block_timestamp` DULU. (2) Schema BERUBAH antar chain (kolom beda nama!). (3) Delay 10–60 menit = JANGAN untuk alerting real-time (gunakan self-host!). Gratis bukan berarti tanpa aturan.",
        "Jebakan subgraph: (1) mapping yang SALAH = indeks yang salah SELAMANYA (re-index 1–7 hari!). Test di subgraph lokal DULU. (2) `BigInt` vs `BigDecimal`: salah tipe = presisi hilang (nilai $ jadi 0!). (3) Jangan indeks SEMUA event `untuk jaga-jaga` — tiap field = biaya indexing + query. Indeks yang DIBUTUHKAN, bukan yang MUNGKIN dibutuhkan (pelajaran langkah 5!).",
      ],
      formula: String.raw`T_{q} = \frac{N_{scan}}{r} \quad ; \quad N_{indeks} \ll N_{scan}`,
      formulaNote: "T_q = waktu query; N_scan = baris yang dipindai; r = kecepatan pindai. Tanpa indeks: N_scan = 1,5 miliar (42 jam). Dengan indeks: N_indeks = 90 baris agregat (4 detik). Indeks mengubah N, bukan r — itu sebabnya selalu menang untuk query berulang.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `BigQuery gratis = query seenaknya`",
        type: "pitfall",
        body: "1TB/bulan gratis = ~30 query berat. Satu `SELECT * FROM token_transfers` tanpa filter tanggal = 500GB = SETENGAH kuota sebulan dalam 1 query! Aturan: filter block_timestamp SELALU pertama, SELECT kolom yang dibutuhkan SAJA, LIMIT saat eksplorasi. Gratis yang boros = mahal di akhir bulan.",
      },
      reference: "80% analisis historis = BigQuery. Custom + real-time = subgraph. Kontrol penuh = self-host.",
    },
    {
      id: "lab-agregat",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: agregat dari tabel indeks",
      prose: [
        "Bayangkan `token_transfers` SUDAH terindeks (kolom: hari, token, jumlah, n_tx). Tugasmu: (1) bangun tabel harian per token (agregat!); (2) jawab `total volume USDC hari 1–2`; (3) jawab `jumlah tx WETH hari 1–3`.",
        "Cara membaca: tabel harian = 6 baris (bukan 15 transfer!) — INI keajaiban agregasi. Interpretasi: query analitis membaca 6 baris, bukan 1,5 miliar. Itulah mengapa 4 detik, bukan 6 jam.",
        "Coba eksplorasi: tambah token baru (mis. DAI, 2 transfer) — tabel harian bertambah 1 baris, query tetap instan. Skala data mentah 10x = tabel agregat tetap kecil. Itulah `N_indeks << N_scan`.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `daily` — agregat per (hari, token): jumlah + n_tx" },
        { id: "t2", text: "Jawab volume USDC hari 1–2 dan tx WETH hari 1–3" },
        { id: "t3", text: "Jalankan; bandingkan ukuran tabel mentah vs agregat" },
      ],
      expected: "9 baris harian dari 15 transfer · USDC day1-2: (560.0, 5) · WETH day1-3: 3 tx",
      note: {
        title: "💡 Intuisi: agregat = katalog",
        body: "15 transfer mentah → 6 baris harian. Setiap query `per hari` membaca 6 baris, bukan 15 (dan bukan 1,5 miliar!). Agregasi saat indexing = membayar sekali (42 jam) agar tiap query murah (4 detik). Inilah ekonomi indexing.",
      },
      hints: [
        "Gunakan dict dengan kunci (hari, token): [total_jumlah, count].",
        "USDC day1-2: jumlahkan jumlah untuk hari in (1,2) dan token USDC.",
        "WETH day1-3: jumlahkan n_tx untuk hari in (1,2,3) dan token WETH.",
      ],
      code: {
        starter: `transfers = [\n    (1, \"USDC\", 100.0), (1, \"USDC\", 150.0), (1, \"WETH\", 2.0),\n    (1, \"USDC\", 50.0), (2, \"USDC\", 160.0), (2, \"WETH\", 1.5),\n    (2, \"USDC\", 100.0), (2, \"DAI\", 300.0), (3, \"USDC\", 200.0),\n    (3, \"WETH\", 3.0), (3, \"USDC\", 120.0), (3, \"DAI\", 150.0),\n    (3, \"USDC\", 80.0), (1, \"DAI\", 500.0), (2, \"DAI\", 250.0),\n]\n\n# TULIS KODEMU: bangun daily[(hari, token)] = [total_jumlah, n_tx]\ndaily = {}\n\nfor (hari, token), (jml, n) in sorted(daily.items()):\n    print(f\"hari {hari} {token}: jumlah={jml} n_tx={n}\")\nprint(\"n_baris_harian:\", len(daily), \"dari\", len(transfers), \"transfer\")\n\n# TULIS KODEMU: jawab dua pertanyaan\nusdc_12 = 0.0\nn_usdc_12 = 0\nweth_13 = 0\nprint(f\"USDC vol day1-2: ({usdc_12}, {n_usdc_12})\")\nprint(f\"WETH tx day1-3: {weth_13}\")`,
        lockLines: 9,
        solution: `transfers = [\n    (1, \"USDC\", 100.0), (1, \"USDC\", 150.0), (1, \"WETH\", 2.0),\n    (1, \"USDC\", 50.0), (2, \"USDC\", 160.0), (2, \"WETH\", 1.5),\n    (2, \"USDC\", 100.0), (2, \"DAI\", 300.0), (3, \"USDC\", 200.0),\n    (3, \"WETH\", 3.0), (3, \"USDC\", 120.0), (3, \"DAI\", 150.0),\n    (3, \"USDC\", 80.0), (1, \"DAI\", 500.0), (2, \"DAI\", 250.0),\n]\n\n# TULIS KODEMU: bangun daily[(hari, token)] = [total_jumlah, n_tx]\ndaily = {}\nfor hari, token, jml in transfers:\n    k = (hari, token)\n    if k not in daily:\n        daily[k] = [0.0, 0]\n    daily[k][0] += jml\n    daily[k][1] += 1\n\nfor (hari, token), (jml, n) in sorted(daily.items()):\n    print(f\"hari {hari} {token}: jumlah={jml} n_tx={n}\")\nprint(\"n_baris_harian:\", len(daily), \"dari\", len(transfers), \"transfer\")\n\n# TULIS KODEMU: jawab dua pertanyaan\nusdc_12 = sum(j for (h, t), (j, n) in daily.items() if t == \"USDC\" and h in (1, 2))\nn_usdc_12 = sum(n for (h, t), (j, n) in daily.items() if t == \"USDC\" and h in (1, 2))\nweth_13 = sum(n for (h, t), (j, n) in daily.items() if t == \"WETH\" and h in (1, 2, 3))\nprint(f\"USDC vol day1-2: ({usdc_12}, {n_usdc_12})\")\nprint(f\"WETH tx day1-3: {weth_13}\")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "9 baris agregat", msg: "Tabel harian harus 9 baris dari 15 transfer.", pattern: "n_baris_harian: 9 dari 15 transfer" },
          { kind: "stdout_matches", task: "t3", label: "USDC 560.0, 5", msg: "Volume USDC hari 1-2 = (560.0, 5).", pattern: "USDC vol day1-2: \\(560\\.0, 5\\)" },
          { kind: "stdout_matches", task: "t3", label: "WETH 3 tx", msg: "Tx WETH hari 1-3 = 3.", pattern: "WETH tx day1-3: 3" },
        ],
      },
      reference: "Indeks = agregat sekali, query selamanya. N_indeks << N_scan.",
    },
    {
      id: "schema",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Merancang schema: seni memilih apa yang diindeks",
      prose: [
        "Kesalahan termahal indexing: mengindeks SEMUA `untuk jaga-jaga`. Tiap field = biaya indexing (waktu + storage) + kompleksitas mapping. Contoh nyata: tim mengindeks 40 field per Swap `karena mungkin butuh` — indexing 7 hari (bukan 2!), storage 600GB (bukan 150GB!), dan 35 field TIDAK PERNAH di-query. Biaya `jaga-jaga`: 5 hari + 450GB sia-sia. Schema yang baik = MINIMAL untuk pertanyaan yang NYATA.",
        "Metode 3 langkah: (1) TULIS 5–10 pertanyaan konkret DULU (`volume USDC per hari`, `top 10 pool by fee`) — bukan `mungkin nanti`; (2) EKSTRAK field yang dibutuhkan (token, jumlah, timestamp → agregat harian); (3) TAMBAH 20% buffer (2–3 field yang `hampir pasti` butuh, mis. tx_hash untuk drill-down). Yang tidak masuk daftar = TIDAK diindeks. Jika nanti butuh = re-index parsial (lebih murah dari 450GB sia-sia!).",
        "Granularitas: per BLOCK? per JAM? per HARI? Aturan: indeks pada granularitas PERTANYAAN TERKECIL. Butuh `per jam`? Indeks per jam (bukan per blok! 7.200x lebih kecil!). Butuh drill-down sesekali? Simpan tx_hash di agregat harian → drill-down via RPC untuk 1 tx (murah!) bukan semua (mahal!). Granularitas yang tepat = 90% penghematan storage.",
        "Contoh schema Nara (diperbaiki): entitas `DailyVolume { hari, token, total_jumlah, n_tx, tx_hash_sample }`. 90 hari × 50 token = 4.500 baris (bukan 1,5 miliar!). Query `volume USDC per hari` = baca 90 baris = 0,1 detik. tx_hash_sample = 1 contoh per hari untuk drill-down (`tunjukkan 1 tx contoh`). Minimal, cepat, cukup.",
        "Reorg: blockchain bisa `menulis ulang` 1–2 blok terakhir (reorg!). Indeks yang tidak handle reorg = data SALAH untuk blok terbaru. Solusi: (1) delay indexing 12 blok (~3 menit di Ethereum) untuk finality; (2) atau handle `revert` di mapping (kompleks!). Untuk analisis harian: delay 12 blok = tidak masalah. Untuk alerting real-time: JANGAN pakai indeks agregat — pakai stream langsung (self-host!). Pilih by kebutuhan, bukan kemalasan.",
        "Pertumbuhan (chart): data indeks tumbuh 30GB → 600GB dalam 7 hari pertama (backfill!), lalu ~5GB/hari (steady). Rencanakan storage 2x proyeksi (600GB → sediakan 1,2TB!). Backfill = maraton (7 hari); steady = joging (5GB/hari). Jangan kaget di hari ke-3 backfill (260GB!) — itu NORMAL. Yang tidak normal: tidak merencanakan.",
      ],
      formula: String.raw`S = N_{entitas} \cdot f_{hari} \cdot b \quad ; \quad \text{indeks} \iff Q \ge 3`,
      formulaNote: "S = storage; N_entitas = jumlah entitas (token/pool); f_hari = frekuensi (1 untuk harian); b = byte per baris. Indeks BERNILAI jika pertanyaan diajukan Q >= 3x (bayar sekali, pakai berkali-kali). Q = 1 (sekali saja)? RPC langsung mungkin cukup!",
      figure: {
        svg: BCD14_SVG,
        alt: "Garis pertumbuhan data indeks: 30GB hari ke-1 naik ke 600GB hari ke-7.",
        caption: "Cara membaca: sumbu-x = hari backfill, sumbu-y = GB; garis naik curam lalu melandai. Interpretasi: 7 hari pertama = backfill historis (30→600GB, NORMAL!); setelahnya ~5GB/hari (steady). Rencanakan storage 2x proyeksi. Jangan panik hari ke-3 (260GB) — paniklah jika TIDAK merencanakan.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: indeks untuk pertanyaan, bukan untuk data",
        body: "Jangan tanya `data apa yang bisa diindeks?` (jawabannya: semua — dan itu jebakan!). Tanya `pertanyaan apa yang akan ditanyakan 3x+?` — lalu indeks MINIMAL untuk itu. Indeks yang baik menjawab 10 pertanyaan dengan 5 field; indeks yang buruk menyimpan 40 field untuk 0 pertanyaan.",
      },
      reference: "5–10 pertanyaan dulu, baru schema. Granularitas = pertanyaan terkecil. Delay 12 blok untuk reorg.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Jalur indexing apa untuk siapa",
      prose: [
        "**Skenario 1 — Analisis historis generik (`volume DEX 90 hari`).** → BigQuery. 5 menit setup, gratis, 4 detik/query. Jangan bangun apa pun!",
        "**Skenario 2 — Agregat custom untuk DEX sendiri (per pool per jam).** → Subgraph. Definisikan schema + mapping, real-time ~1 menit. BigQuery tidak punya logika `pool`-mu.",
        "**Skenario 3 — Deteksi fraud real-time (< 10 detik).** → Self-hosted stream. BigQuery delay 10–60 menit = TERLAMBAT. Subgraph ~1 menit = masih lambat. Stream langsung satu-satunya.",
        "**Skenario 4 — Chain baru/tidak populer.** → Self-hosted (atau subgraph jika didukung). BigQuery hanya chain populer. Cek dukungan DULU sebelum janji ke user.",
        "**Skenario 5 — Pertanyaan sekali saja (`berapa total... kemarin?`).** → RPC langsung! Q < 3 = indexing tidak bernilai (rumus langkah 5). Jangan bangun katedral untuk 1 doa.",
        "Aturan praktis 10 detik: `historis + generik?` → BigQuery. `custom + ~real-time?` → subgraph. `detik + kritis?` → self-host. `sekali saja?` → RPC. Empat pertanyaan, satu jawaban.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: jangan bangun yang sudah ada",
        body: "80% kebutuhan = BigQuery (sudah dibangun Google, gratis!). 15% = subgraph (custom). 5% = self-host (kritis). Urutan mencoba: BigQuery DULU, subgraph KEDUA, self-host TERAKHIR. Membangun indexer saat BigQuery cukup = membeli sapi untuk segelas susu.",
      },
      reference: "BigQuery dulu, subgraph kedua, self-host terakhir. Q < 3 = RPC saja.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "1,5 miliar tx, 3 pertanyaan, 1 keputusan",
      prose: [
        "Tim Nara: 3 pertanyaan rutin (tiap hari!): (1) volume per token per hari (90 hari); (2) top 20 address by volume (7 hari); (3) alert jika address baru terima > $1 juta (real-time!). Data: Ethereum, 1,5 miliar tx/90 hari.",
        "**Pertanyaan:** (a) Jalur indexing apa untuk masing-masing? (b) Schema minimal untuk (1)+(2)? (c) Estimasi storage. (d) Bagaimana (3) diimplementasikan?",
        "**Pembahasan:** (a) (1)+(2): BigQuery (historis + generik + tiap hari = Q >> 3!). (3): self-hosted stream (real-time < 10 detik — BigQuery delay 60 menit = TERLAMBAT!). DUA jalur (bukan satu!) — kebutuhan beda = arsitektur beda. (b) DailyVolume{hari, token, jumlah, n_tx} + AddressVolume{minggu, address, jumlah}. (c) 90×50 + 1×10.000 ≈ 15.000 baris × 100 byte = 1,5MB (!!) vs 1,5 miliar tx mentah. (d) Stream: subscribe Transfer event via websocket → filter jumlah > $1jt → cek umur address (first-seen) → alert. Tanpa indeks sama sekali — stream, bukan query!",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Alert real-time (3) = kontrol DETEKTIF untuk fraud; agregat harian (1)+(2) = kontrol untuk PELAPORAN. Dua kontrol, dua arsitektur. Jangan pakai arsitektur pelaporan untuk deteksi (terlambat 60 menit = dana sudah di mixer!) atau sebaliknya (stream untuk laporan = boros).",
      },
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
          q: "Query `volume per token per hari, 90 hari` ke RPC langsung. Masalah UTAMA?",
          options: [
            { text: "RPC timeout 30 detik", why: "Timeout hanya gejala. Masalah utama = ARSITEKTUR: RPC tidak dirancang untuk agregasi 1,5 miliar tx." },
            { text: "Harus scan 1,5 miliar tx untuk menemukan yang relevan — butuh indeks, bukan kesabaran", why: "Tepat. Tanpa katalog (indeks), tiap query = buka 648.000 rak. Solusinya arsitektur (indexing), bukan `coba lagi`.", correct: true },
            { text: "Query-nya salah tulis", why: "Query benar; yang salah = ekspektasi bahwa RPC bisa analitis. Query sempurna tetap 42 jam." },
            { text: "Provider-nya jelek — ganti provider", why: "Semua provider punya batas 10.000 blok + rate limit yang sama. Ganti provider = masalah yang sama." },
          ],
        },
        {
          q: "Pilih jalur untuk: `alert jika address BARU terima > $1 juta` (real-time).",
          options: [
            { text: "BigQuery — gratis dan mudah", why: "Delay 10–60 menit = dana sudah di mixer saat alert bunyi. Gratis tapi TERLAMBAT." },
            { text: "Self-hosted stream via websocket — filter langsung, tanpa indeks", why: "Tepat. Real-time < 10 detik hanya via stream. Ini pola DETEKSI, bukan query — tanpa indeks sama sekali.", correct: true },
            { text: "Subgraph — real-time ~1 menit", why: "~1 menit masih lambat untuk $1 juta yang bergerak. Dan butuh mapping custom untuk `address baru`. Stream lebih tepat." },
            { text: "RPC polling tiap jam", why: "Polling tiap jam = delay 60 menit + boros request. Stream (websocket) = event-driven, instan." },
          ],
        },
        {
          q: "Tim mengindeks 40 field per Swap `untuk jaga-jaga`. Masalahnya?",
          options: [
            { text: "Tidak ada — makin lengkap makin baik", why: "`Lengkap` = 7 hari indexing + 600GB untuk 35 field yang tak pernah di-query. Lengkap yang tak dipakai = sampah mahal." },
            { text: "Tiap field = biaya (waktu + storage); indeks MINIMAL untuk pertanyaan nyata (5–10 dulu + 20% buffer)", why: "Tepat. 5 hari + 450GB sia-sia = harga `jaga-jaga`. Schema = seni memilih, bukan menimbun.", correct: true },
            { text: "Harusnya 80 field", why: "Menggandakan masalah, bukan solusi." },
            { text: "Field tidak penting dalam indexing", why: "Field = inti schema! Salah pilih = indeks tak berguna atau boros. Sangat penting — makanya harus dipilih." },
          ],
        },
        {
          q: "Query BigQuery `SELECT * FROM token_transfers` tanpa filter tanggal. Akibat?",
          options: [
            { text: "Hasil instan — BigQuery cepat", why: "Cepat YA, tapi memindai ~500GB = setengah kuota gratis SEBULAN dalam 1 query!" },
            { text: "~500GB terpindai = setengah kuota 1TB/bulan habis sekali query", why: "Tepat. Selalu filter block_timestamp DULU + SELECT kolom yang perlu SAJA. Gratis yang boros = mahal.", correct: true },
            { text: "Error — tabel terlalu besar", why: "Tidak error — BigQuery kuat. Justru itu bahayanya: berhasil tapi mahal." },
            { text: "Tidak apa-apa — gratis unlimited", why: "Gratis 1TB/bulan, bukan unlimited. Di atasnya bayar $5/TB." },
          ],
        },
        {
          q: "Indeks agregat harian untuk alerting real-time. Tepat?",
          options: [
            { text: "Tepat — agregat selalu cukup", why: "Agregat harian + delay reorg 12 blok + delay indexing = TERLAMBAT untuk alerting. Pola salah." },
            { text: "Tidak — butuh stream langsung; indeks agregat untuk pelaporan", why: "Tepat. Deteksi = stream (detik); pelaporan = indeks (jam/hari). Jangan tertukar arsitekturnya.", correct: true },
            { text: "Tepat jika agregatnya per menit", why: "Per menit masih + delay indexing + tidak ada konsep `address baru terima` tanpa state custom. Stream tetap lebih tepat." },
            { text: "Tidak — alerting tidak butuh data", why: "Alerting butuh data REAL-TIME. `Tidak butuh data` = tidak ada alert." },
          ],
        },
        {
          q: "Kapan indexing TIDAK bernilai (lebih baik RPC langsung)?",
          options: [
            { text: "Pertanyaan diajukan 1x saja (Q < 3)", why: "Tepat (rumus langkah 5). Bayar 42 jam indexing untuk 1 query = rugi. RPC langsung cukup.", correct: true },
            { text: "Data 1,5 miliar tx", why: "Data BESAR = indexing MAKIN bernilai (penghematan makin besar)." },
            { text: "Butuh jawaban 4 detik", why: "4 detik = BUTUH indeks! RPC tidak bisa 4 detik untuk agregat besar." },
            { text: "Selalu bernilai — indeks segalanya", why: "`Segalanya` = 40 field jaga-jaga = 600GB sia-sia. Tidak selalu." },
          ],
        },
      ],
      summary: [
        "RPC = operasional (per blok), bukan analitis — 1,5 miliar tx = 42 jam scan.",
        "Indexing = pindai sekali (mahal), query selamanya (murah): N_indeks << N_scan.",
        "Tiga jalur: BigQuery (historis generik, gratis) → subgraph (custom, real-time) → self-host (kritis).",
        "Schema: 5–10 pertanyaan DULU, minimal + 20% buffer; granularitas = pertanyaan terkecil.",
        "Indeks bernilai jika Q >= 3; Q = 1 = RPC langsung saja.",
        "Delay 12 blok untuk reorg; BigQuery delay 10–60 mnt = bukan untuk alerting.",
      ],
      next: { label: "BCD15 — Oracle Literacy", href: "/learn/bcd15-oracle-literacy" },
    },
  ],
};

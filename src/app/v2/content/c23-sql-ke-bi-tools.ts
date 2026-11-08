import type { V2Lesson } from "../lib/types";

// ── Figure: rata-rata dari rata-rata (SALAH) vs rata-rata tertimbang (BENAR) ──
const AVG_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang: rata-rata dari rata-rata vs rata-rata tertimbang per kategori">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">40</text><text x="54" y="139">80</text>
<text x="54" y="99">120</text><text x="54" y="59">160 rb</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="104" y="100" width="26" height="116" fill="var(--c2)" opacity="0.85"/>
<text x="117" y="94" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">116</text>
<rect x="134" y="107" width="26" height="109" fill="var(--c1)" opacity="0.9"/>
<text x="147" y="101" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">109</text>
<text x="132" y="232" text-anchor="middle" fill="var(--text)">Kopi</text>
<rect x="236" y="74" width="26" height="142" fill="var(--c2)" opacity="0.85"/>
<text x="249" y="68" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">142</text>
<rect x="266" y="65" width="26" height="151" fill="var(--c1)" opacity="0.9"/>
<text x="279" y="59" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">151</text>
<text x="264" y="232" text-anchor="middle" fill="var(--text)">Roti</text>
<rect x="368" y="118" width="26" height="98" fill="var(--c2)" opacity="0.85"/>
<text x="381" y="112" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">98</text>
<rect x="398" y="122" width="26" height="94" fill="var(--c1)" opacity="0.9"/>
<text x="411" y="116" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">94</text>
<text x="396" y="232" text-anchor="middle" fill="var(--text)">Teh</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="110" y="244" width="12" height="12" fill="var(--c2)" opacity="0.85"/>
<text x="128" y="254" fill="var(--text)">Rata-rata dari rata-rata (SALAH)</text>
<rect x="320" y="244" width="12" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="338" y="254" fill="var(--text)">Rata-rata tertimbang (BENAR)</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">rata-rata omzet per transaksi, ribu Rp (ilustrasi)</text>
</g>
</svg>`;

export const c23: V2Lesson = {
  slug: "c23-sql-ke-bi-tools",
  track: "SQL",
  module: "Lanjutan",
  title: "Dari SQL ke Power BI/Tableau: Query yang Siap Jadi Dashboard",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Proyeksi 330 juta yang salah karena satu klik AVERAGE",
      prose: [
        "Rani, analis di perusahaan ritel, membangun dashboard Power BI “Omzet per Kategori”. Query SQL-nya benar: tabel agregat per bulan per kategori berisi omzet dan jumlah transaksi. Direksi lalu meminta satu angka: rata-rata omzet per transaksi Kopi untuk proyeksi insentif cabang — target 50.000 transaksi tahun depan.",
        "Rani membuat measure di Power BI: AVERAGE atas kolom “rata-rata bulanan”. Januari: 2 transaksi, omzet 254.000 → rata-rata 127.000. Februari: 8 transaksi, omzet 840.000 → rata-rata 105.000. AVERAGE(127.000, 105.000) = 116.000. Angka yang benar: total omzet 1.094.000 / 10 transaksi = 109.400. Selisih 6.600 per transaksi × 50.000 transaksi proyeksi = 330 juta rupiah meleset — dari query yang benar, visual yang benar, dan satu klik AVERAGE yang “masuk akal”.",
        "Twist-nya: tidak ada yang salah ketik. Query benar, dashboard benar, rumusnya pun benar secara matematika (rata-rata dari dua angka memang 116.000). Yang salah adalah GRAIN-nya: merata-ratakan rata-rata tanpa menimbang jumlah transaksi tiap bulan sama dengan memberi suara yang sama kepada bulan ber-2-transaksi dan bulan ber-8-transaksi. Inilah pelajaran paling mahal di persimpangan SQL dan BI: dashboard tidak pernah lebih jujur dari grain dan definisi measure-nya. Lesson ini tentang menulis query yang SIAP jadi dashboard — grain yang benar, agregat yang tak ambigu, dan hubungan tabel yang tidak menggandakan angka. Kejujuran untuk tool: Power BI/Tableau tidak berjalan di browser lesson ini — yang kamu latih adalah fondasinya: query + model data yang membuat measure BI-mu mustahil salah tafsir.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini gap pasar #1",
        type: "risk",
        body: "Riset lowongan Oktober 2026: Power BI/Tableau diminta 9 dari 10 listing analis data — dan hampir semuanya BI-tool-centric untuk pasar Indonesia. Track SQL-mu sudah kuat di query; yang membedakan kandidat adalah kemampuan menjembatani query ke dashboard yang angkanya bisa dipertanggungjawabkan. “Bisa SQL” + “dashboard-nya menyesatkan” = nilai nol di mata hiring manager.",
      },
      reference: "Dashboard tidak lebih jujur dari grain-nya. Rata-rata dari rata-rata = jebakan klasik.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita proyeksi 330 juta. (2) Peta ini. (3) Konsep: grain — Si Penentu Makna. (4) Konsep: semantic layer — Kamus Bersama. (5) Konsep: cardinality & fan-out — Si Pengganda. (6) Lab 1: tabel agregat siap-dashboard + cek duplikat grain. (7) Lab 2: refresh incremental dengan watermark. (8) Chart: rata-rata dari rata-rata vs tertimbang. (9) Peta keputusan: empat skenario SQL-ke-BI. (10) Mini-case: dashboard retensi cabang. (11) Checkpoint: kuis + rangkuman.",
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menentukan grain yang benar untuk sebuah KPI dan menjelaskannya dalam satu kalimat; (2) menulis query agregat yang siap dikonsumsi BI tool (satu baris = satu fakta); (3) membedakan measure vs dimension dan menulis definisi measure yang tak ambigu (SUM(omzet)/SUM(n), bukan AVERAGE atas rata-rata); (4) mendeteksi dan memperbaiki fan-out akibat join 1-ke-banyak; (5) merancang refresh incremental dengan watermark.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: GROUP BY mengelompokkan baris lalu agregasi (SUM/COUNT/AVG) merangkum tiap kelompok; JOIN menggabungkan tabel lewat kunci; satu baris tabel idealnya mewakili satu fakta (satu transaksi, satu hari, satu pelanggan).",
        "Rutenya: cerita → peta → tiga konsep → dua lab → chart → peta keputusan → mini-case → kuis. Estimasi 65 menit; tiap lab ±12 menit. Bingkai jujur: semua lab memakai sqlite3 di browser (Pyodide) — Power BI/Tableau-nya sendiri tidak ada di sini, tetapi query yang kamu tulis adalah query yang SAMA yang akan kamu tempel ke Power Query / Custom SQL Tableau.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: setiap kali melihat angka di dashboard, tanyakan dua hal — “satu baris datanya mewakili apa?” (grain) dan “apakah angka ini dijumlahkan, dirata-ratakan, atau dihitung?” (measure). Dua pertanyaan itu menyelesaikan 80% misteri dashboard.",
      ],
      reference: "Tujuan: grain benar + agregat siap-BI + tak ada fan-out + refresh incremental.",
    },
    {
      id: "konsep-grain",
      eyebrow: "Langkah 3 · Konsep",
      title: "Grain — Si Penentu Makna",
      prose: [
        "Definisi: grain adalah tingkat detail terkecil yang diwakili SATU BARIS data — “satu baris = satu ___”. Tabel transaksi: satu baris = satu transaksi. Tabel agregat siap-dashboard: satu baris = satu bulan × satu kategori. Semua measure yang benar diturunkan dari grain yang eksplisit; semua measure yang menyesatkan lahir dari grain yang kabur.",
        "Kepribadiannya: Grain adalah notaris makna — ia yang menulis di akta: “baris ini bersaksi tentang satu transaksi, bukan tentang satu bulan”. Tanpa notaris ini, analis bebas menafsirkan: baris yang sama dipakai untuk menghitung “rata-rata per transaksi” (butuh grain transaksi) dan “total per bulan” (butuh grain bulan) — dan ketika grain campur aduk, lahirlah cerita Rani: merata-ratakan kolom “rata-rata bulanan” seolah tiap bulan bobotnya sama.",
        "Contoh langkah-demi-langkah (angka cerita): Januari Kopi — 2 transaksi, omzet 254.000 → rata-rata 127.000. Februari Kopi — 8 transaksi, omzet 840.000 → rata-rata 105.000. Cara SALAH: (127.000 + 105.000) / 2 = 116.000 — Januari (2 trx) diberi suara sama dengan Februari (8 trx). Cara BENAR: (254.000 + 840.000) / (2 + 8) = 1.094.000 / 10 = 109.400. Selisih 6.600. Aturan: jangan pernah merata-ratakan kolom yang SUDAH rata-rata — kembalilah ke pembilang dan penyebut aslinya (SUM(omzet) / SUM(n_trx)).",
        "Kapan memakai grain halus (transaksi): drill-down, audit, perhitungan ulang. Kapan memakai grain kasar (bulan × kategori): dashboard KPI, performa query, tabel agregat untuk BI. Tes 10 detik: “bisakah dua baris di tabel ini mewakili fakta yang sama?” — bila ya, grain-mu duplikat (lab 1 mengajarkan cara memeriksanya).",
      ],
      formula: String.raw`\bar{x}_{salah} = \frac{1}{k}\sum_{i=1}^{k}\bar{x}_i \quad\text{vs}\quad \bar{x}_{benar} = \frac{\sum x}{N}`,
      formulaNote: "Simbol: k = jumlah kelompok (bulan), x̄_i = rata-rata kelompok ke-i, Σx = total semua nilai, N = total semua observasi. Interpretasi: rumus kiri memberi bobot SAMA ke tiap kelompok tanpa peduli ukurannya — benar hanya bila semua kelompok berukuran sama. Rumus kanan menimbang otomatis lewat N. Contoh angka: kiri = (127.000+105.000)/2 = 116.000 (salah); kanan = 1.094.000/10 = 109.400 (benar). Di DAX Power BI, rumus kanan ditulis DIVIDE(SUM(omzet), SUM(n_trx)) — bukan AVERAGE atas kolom rata-rata.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Rata-rata dari rata-rata kan tetap rata-rata”",
        type: "pitfall",
        body: "Yang benar: hanya bila tiap kelompok berukuran SAMA. Begitu ukuran kelompok beda (2 vs 8 transaksi), rata-rata dari rata-rata menjadi angka fantasi — ia menjawab pertanyaan yang tidak ditanyakan siapa pun (“bagaimana jika tiap bulan bobotnya sama?”). Di BI tool, jebakan ini punya nama: measure yang dihitung di grain yang salah.",
      },
      hints: [
        "💡 Intuisi grain: sebelum menulis GROUP BY, tulis satu kalimat: “satu baris hasil = satu ___”. Jika kalimatnya butuh kata “kira-kira”, grain-mu belum jelas. Grain yang jelas membuat measure yang jelas.",
      ],
      reference: "Satu baris = satu fakta. Jangan rata-ratakan kolom rata-rata — kembali ke SUM/SUM.",
    },
    {
      id: "konsep-semantic",
      eyebrow: "Langkah 4 · Konsep",
      title: "Semantic Layer — Kamus Bersama Perusahaan",
      prose: [
        "Definisi: semantic layer adalah lapisan definisi BERSAMA antara data mentah dan dashboard: apa itu “omzet” (gross? net? recognized?), apa itu “pelanggan aktif”, dan bagaimana tiap KPI dihitung — ditulis sekali, dipakai semua dashboard. Tanpa ini, tiga analis = tiga definisi “pendapatan” = tiga angka berbeda di tiga dashboard (cerita ini berlanjut di lesson dbt berikutnya).",
        "Dua penghuni kamus ini: DIMENSION (atribut untuk memotong: kategori, bulan, cabang — “berdasarkan apa?”) dan MEASURE (angka yang dihitung: omzet, jumlah transaksi — “berapa?”). Aturan mainnya: dimension memotong, measure dihitung — jangan pernah memotong dengan measure atau menghitung dengan dimension. Di Power BI, dimension = kolom, measure = rumus DAX; di Tableau, dimension = biru (diskrit), measure = hijau (kontinu) — beda istilah, satu logika.",
        "DAX konseptual (tanpa menjalankan tool-nya): tiga pola measure yang wajib dikuasai analis. (1) SUM atas kolom fakta: Total Omzet = SUM(penjualan[omzet]) — aman. (2) Rasio dari SUM: Rata2 per Transaksi = DIVIDE(SUM(penjualan[omzet]), SUM(penjualan[n_trx])) — aman, ini rumus kanan Langkah 3. (3) AVERAGE atas kolom yang sudah agregat: AVERAGE(agregat[rata2_bulanan]) — BERBAHAYA, ini rumus kiri Langkah 3. Pola (3) terlihat profesional dan salah secara senyap — ia lolos review karena “kan cuma average”.",
        "Power Query konseptual: langkah transformasi yang TEREKAM (bukan klik sekali lalu lupa) — filter, merge (join), group. Prinsipnya sama dengan SQL: tiap langkah harus bisa dijelaskan dan diulang. Analis senior memperlakukan langkah Power Query seperti kode: bernama jelas, berurutan logis, tanpa langkah “misterius” yang tak bisa dijelaskan saat ditanya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Yang penting visualnya bagus, definisinya belakangan”",
        type: "pitfall",
        body: "Yang benar: visual yang bagus atas definisi yang kabur = kebohongan yang rapi. Direksi tidak memutuskan berdasarkan keindahan chart, melainkan berdasarkan ANGKA di dalamnya — dan angka tanpa definisi bersama adalah opini berpakaian data. Tulis definisi measure SEBELUM memilih jenis chart.",
      },
      hints: [
        "💡 Intuisi kamus: jika dua analis ditanya “berapa omzet bulan lalu?” dan menjawab beda, masalahnya bukan di SQL mereka — melainkan tidak adanya kamus bersama. Pekerjaan analis senior: bukan hanya menjawab, melainkan memastikan semua orang menjawab SAMA.",
      ],
      reference: "Dimension memotong, measure dihitung. DIVIDE(SUM,SUM) aman; AVERAGE atas rata-rata berbahaya.",
    },
    {
      id: "konsep-cardinality",
      eyebrow: "Langkah 5 · Konsep",
      title: "Cardinality & Fan-out — Si Pengganda Senyap",
      prose: [
        "Definisi: cardinality adalah “berapa berbanding berapa” dalam relasi — 1-ke-1, 1-ke-banyak, banyak-ke-banyak. Fan-out adalah bencananya: saat tabel sisi-1 (pesanan: 1 baris per order, dengan ongkir) di-JOIN ke tabel sisi-banyak (item: 3 baris per order), setiap kolom sisi-1 TERDUPLIKASI sebanyak pasangannya — dan SUM atas kolom itu ikut terganda.",
        "Kepribadiannya: Si Pengganda adalah fotokopi yang bekerja diam-diam — JOIN tidak pernah memberitahumu bahwa ia baru saja menggandakan ongkir 3×. Query tetap jalan, tidak error, angkanya “masuk akal” (60.000 vs 25.000 — siapa yang curiga?). Ia pengganda yang sopan: tidak merusak apa pun kecuali kebenaran.",
        "Contoh langkah-demi-langkah (angka konkret): tabel pesanan — O-1 ongkir 10.000, O-2 ongkir 15.000. Tabel item — O-1 punya 3 item, O-2 punya 2 item. JOIN keduanya → 5 baris; kolom ongkir kini muncul 3× untuk O-1 dan 2× untuk O-2. SUM(ongkir) = 10.000×3 + 15.000×2 = 60.000. Yang benar: 25.000. Selisih 2,4× — dari JOIN yang “biasa saja”.",
        "Tiga obatnya (pilih sesuai kasus): (1) Agregasi DULU di sisi-banyak, JOIN kemudian — hitung total item per order dulu, baru gabung ongkir. (2) Pisahkan measure ke tabel fakta yang grain-nya benar — ongkir tinggal di tabel pesanan, jangan dibawa ke tabel item. (3) Di BI: pastikan relasi 1-ke-banyak terdaftar dengan benar dan measure memakai fungsi agregat yang sadar grain. Tes 10 detik: setelah JOIN, COUNT(*) vs COUNT(DISTINCT kunci_sisi_1) — bila beda jauh, kamu sedang melihat fan-out.",
      ],
      formula: String.raw`\text{total}_{salah} = \text{total}_{benar} \times k`,
      formulaNote: "Simbol: k = rata-rata jumlah pasangan di sisi-banyak per kunci sisi-1. Interpretasi: kesalahan fan-out bersifat PERKALIAN — bukan selisih kecil. Contoh angka: total ongkir benar 25.000, k = 2,4 (rata-rata 2,4 item per order) → total salah 60.000. Makin “ramai” relasinya, makin besar kebohongannya — dan makin tidak terlihat, karena angkanya tetap “masuk akal”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Filter di dashboard akan memperbaiki angka yang mengganda”",
        type: "pitfall",
        body: "Yang benar: filter memangkas BARIS, bukan memperbaiki perkalian. Filter “hanya O-1” atas hasil fan-out memberi 30.000 — tetap 3× dari 10.000 yang benar. Penggandaan terjadi di JOIN (di model data), dan hanya bisa diperbaiki di sana: agregasi dulu, atau perbaiki grain tabelnya.",
      },
      hints: [
        "💡 Intuisi pengganda: SUM adalah fungsi yang buta — ia menjumlahkan apa pun yang diberikan, termasuk fotokopi. Sebelum SUM atas kolom hasil JOIN, tanyakan: “apakah kolom ini terduplikasi oleh join ini?” COUNT(DISTINCT kunci) adalah senternya.",
      ],
      reference: "JOIN 1-ke-banyak → kolom sisi-1 terganda → SUM salah ×k. Obat: agregasi dulu, JOIN kemudian.",
    },
    {
      id: "lab-agregat",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Bangun tabel agregat siap-dashboard",
      prose: [
        "Waktunya praktik. Tabel transaksi (12 baris, Jan–Feb 2026) sudah tersedia. Tugasmu — persis pekerjaan analis sebelum dashboard dibangun: (1) buat tabel agregat `agg_bulanan` dengan grain (bulan, kategori): kolom bulan, kategori, omzet, n_trx; (2) buktikan grain-nya bersih — tidak ada duplikat (bulan, kategori); (3) buktikan angkanya utuh — total omzet agregat SAMA dengan total omzet detail.",
        "Tiga tugas, tiga baris cetak. Starter hanya berisi kerangka — lengkapi query-nya, jalankan, pastikan pemeriksa hijau semua.",
        "Coba: setelah lolos, jalankan SELECT * FROM agg_bulanan dan hitung manual rata-rata omzet/n_trx per bulan untuk Kopi, lalu rata-ratakan keduanya — bandingkan dengan SUM(omzet)/SUM(n_trx). Itulah selisih cerita Rani, di tanganmu sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Buat `agg_bulanan`: SELECT substr(tanggal,1,7) AS bulan, kategori, SUM(qty*harga) AS omzet, COUNT(*) AS n_trx ... GROUP BY bulan, kategori" },
        { id: "t2", text: "Hitung `dup`: jumlah (bulan, kategori) yang muncul > 1× di `agg_bulanan` — harus 0" },
        { id: "t3", text: "Hitung `om_ag` (SUM omzet agregat) dan `om_det` (SUM qty*harga detail) — keduanya harus 1534000" },
      ],
      expected: "baris agregat: 6 | duplikat grain: 0 | omzet agregat: 1534000 | omzet detail: 1534000",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE transaksi(id INTEGER PRIMARY KEY, tanggal TEXT, kategori TEXT, produk TEXT, qty INTEGER, harga INTEGER)\")\ndata = [(1,\"2026-01-05\",\"Kopi\",\"Kopi A\",10,18000),(2,\"2026-01-06\",\"Kopi\",\"Kopi B\",5,15000),(3,\"2026-01-07\",\"Teh\",\"Teh C\",8,12000),(4,\"2026-01-08\",\"Kopi\",\"Kopi A\",7,18000),(5,\"2026-01-09\",\"Roti\",\"Roti D\",12,10000),(6,\"2026-01-10\",\"Teh\",\"Teh C\",6,12000),(7,\"2026-02-03\",\"Kopi\",\"Kopi B\",9,15000),(8,\"2026-02-04\",\"Kopi\",\"Kopi A\",4,18000),(9,\"2026-02-05\",\"Roti\",\"Roti E\",15,22000),(10,\"2026-02-06\",\"Teh\",\"Teh D\",10,14000),(11,\"2026-02-07\",\"Roti\",\"Roti D\",8,10000),(12,\"2026-02-08\",\"Kopi\",\"Kopi A\",6,18000)]\ncur.executemany(\"INSERT INTO transaksi VALUES (?,?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 tabel agregat grain (bulan, kategori)\ncur.execute(\"CREATE TABLE agg_bulanan AS SELECT ...\")\n\n# t2: duplikat grain (harus 0)\ndup =\n\n# t3: total omzet agregat vs detail\nom_ag =\nom_det =\nn_agg = cur.execute(\"SELECT COUNT(*) FROM agg_bulanan\").fetchone()[0]\n\nprint(f\"baris agregat: {n_agg} | duplikat grain: {dup} | omzet agregat: {om_ag} | omzet detail: {om_det}\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE transaksi(id INTEGER PRIMARY KEY, tanggal TEXT, kategori TEXT, produk TEXT, qty INTEGER, harga INTEGER)\")\ndata = [(1,\"2026-01-05\",\"Kopi\",\"Kopi A\",10,18000),(2,\"2026-01-06\",\"Kopi\",\"Kopi B\",5,15000),(3,\"2026-01-07\",\"Teh\",\"Teh C\",8,12000),(4,\"2026-01-08\",\"Kopi\",\"Kopi A\",7,18000),(5,\"2026-01-09\",\"Roti\",\"Roti D\",12,10000),(6,\"2026-01-10\",\"Teh\",\"Teh C\",6,12000),(7,\"2026-02-03\",\"Kopi\",\"Kopi B\",9,15000),(8,\"2026-02-04\",\"Kopi\",\"Kopi A\",4,18000),(9,\"2026-02-05\",\"Roti\",\"Roti E\",15,22000),(10,\"2026-02-06\",\"Teh\",\"Teh D\",10,14000),(11,\"2026-02-07\",\"Roti\",\"Roti D\",8,10000),(12,\"2026-02-08\",\"Kopi\",\"Kopi A\",6,18000)]\ncur.executemany(\"INSERT INTO transaksi VALUES (?,?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 tabel agregat grain (bulan, kategori)\ncur.execute(\"CREATE TABLE agg_bulanan AS SELECT substr(tanggal,1,7) AS bulan, kategori, SUM(qty*harga) AS omzet, COUNT(*) AS n_trx FROM transaksi GROUP BY bulan, kategori\")\n\n# t2: duplikat grain (harus 0)\ndup = cur.execute(\"SELECT COUNT(*) FROM (SELECT bulan, kategori FROM agg_bulanan GROUP BY bulan, kategori HAVING COUNT(*)>1)\").fetchone()[0]\n\n# t3: total omzet agregat vs detail\nom_ag = cur.execute(\"SELECT SUM(omzet) FROM agg_bulanan\").fetchone()[0]\nom_det = cur.execute(\"SELECT SUM(qty*harga) FROM transaksi\").fetchone()[0]\nn_agg = cur.execute(\"SELECT COUNT(*) FROM agg_bulanan\").fetchone()[0]\n\nprint(f\"baris agregat: {n_agg} | duplikat grain: {dup} | omzet agregat: {om_ag} | omzet detail: {om_det}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "6 baris agregat", msg: "Grain (bulan, kategori): 2 bulan × 3 kategori = 6 baris.", name: "n_agg", value: 6, tol: 0 },
          { kind: "equal", task: "t2", label: "duplikat grain = 0", msg: "Satu (bulan, kategori) = satu baris. Duplikat = grain rusak.", name: "dup", value: 0, tol: 0 },
          { kind: "equal", task: "t3", label: "omzet agregat = 1534000", msg: "Total dari tabel agregat.", name: "om_ag", value: 1534000, tol: 0 },
          { kind: "equal", task: "t3", label: "omzet detail = 1534000", msg: "Total dari tabel detail — harus SAMA (rekonsiliasi).", name: "om_det", value: 1534000, tol: 0 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Empat angka: baris, duplikat, dua omzet.", pattern: "omzet agregat: 1534000 \\| omzet detail: 1534000" },
        ],
      },
      reference: "Agregat siap-BI: grain eksplisit + duplikat 0 + rekonsiliasi total sama dengan detail.",
    },
    {
      id: "lab-refresh",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Refresh incremental dengan watermark",
      prose: [
        "Dashboard yang datanya di-refresh FULL setiap jam adalah bom biaya (lesson berikutnya tentang dbt dan lesson C25 tentang biaya warehouse akan mengkuantifikasinya). Pola profesional: INCREMENTAL — hanya baris baru yang dimuat, dilacak dengan WATERMARK (tanggal terakhir yang sudah dimuat).",
        "Setup: tabel penjualan berisi 6 baris Januari; tabel watermark menyimpan '2026-01-31'. Batch baru datang: 3 baris Februari. Tugasmu: (1) muat HANYA baris dengan tanggal > watermark; (2) majukan watermark ke tanggal maksimum baru; (3) verifikasi total 9 baris.",
        "Coba: setelah lolos, jalankan ulang logika insert-mu TANPA filter tanggal — apa yang terjadi? (Duplikat.) Itulah kenapa watermark + filter adalah pasangan yang tak terpisahkan.",
      ],
      tasks: [
        { id: "t1", text: "Muat hanya baris `batch_baru` dengan tanggal > watermark ke `n_baru`" },
        { id: "t2", text: "Update watermark ke tanggal maksimum baru (`wm_baru`)" },
        { id: "t3", text: "Hitung `n_total` baris penjualan — harus 9" },
      ],
      expected: "baris baru dimuat: 3 | total baris: 9 | watermark: 2026-02-03",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE penjualan(id INTEGER PRIMARY KEY, tanggal TEXT, omzet INTEGER)\")\ndata = [(1,\"2026-01-26\",410000),(2,\"2026-01-27\",520000),(3,\"2026-01-28\",390000),(4,\"2026-01-29\",610000),(5,\"2026-01-30\",580000),(6,\"2026-01-31\",440000)]\ncur.executemany(\"INSERT INTO penjualan VALUES (?,?,?)\", data)\ncur.execute(\"CREATE TABLE watermark(wm TEXT)\")\ncur.execute(\"INSERT INTO watermark VALUES ('2026-01-31')\")\nbatch_baru = [(7,\"2026-02-01\",500000),(8,\"2026-02-02\",620000),(9,\"2026-02-03\",480000)]\n\n# TULIS KODEMU: t1 muat hanya baris baru (tanggal > watermark)\nwm_lama =\nbaru =\ncur.executemany(\"INSERT INTO penjualan VALUES (?,?,?)\", baru)\nn_baru =\n\n# t2: majukan watermark\nwm_baru =\ncur.execute(\"UPDATE watermark SET wm = ?\", (wm_baru,))\n\n# t3: verifikasi total\nn_total =\n\nprint(f\"baris baru dimuat: {n_baru} | total baris: {n_total} | watermark: {wm_baru}\")\n",
        lockLines: 10,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE penjualan(id INTEGER PRIMARY KEY, tanggal TEXT, omzet INTEGER)\")\ndata = [(1,\"2026-01-26\",410000),(2,\"2026-01-27\",520000),(3,\"2026-01-28\",390000),(4,\"2026-01-29\",610000),(5,\"2026-01-30\",580000),(6,\"2026-01-31\",440000)]\ncur.executemany(\"INSERT INTO penjualan VALUES (?,?,?)\", data)\ncur.execute(\"CREATE TABLE watermark(wm TEXT)\")\ncur.execute(\"INSERT INTO watermark VALUES ('2026-01-31')\")\nbatch_baru = [(7,\"2026-02-01\",500000),(8,\"2026-02-02\",620000),(9,\"2026-02-03\",480000)]\n\n# TULIS KODEMU: t1 muat hanya baris baru (tanggal > watermark)\nwm_lama = cur.execute(\"SELECT wm FROM watermark\").fetchone()[0]\nbaru = [r for r in batch_baru if r[1] > wm_lama]\ncur.executemany(\"INSERT INTO penjualan VALUES (?,?,?)\", baru)\nn_baru = len(baru)\n\n# t2: majukan watermark\nwm_baru = max(r[1] for r in baru)\ncur.execute(\"UPDATE watermark SET wm = ?\", (wm_baru,))\n\n# t3: verifikasi total\nn_total = cur.execute(\"SELECT COUNT(*) FROM penjualan\").fetchone()[0]\n\nprint(f\"baris baru dimuat: {n_baru} | total baris: {n_total} | watermark: {wm_baru}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "n_baru = 3", msg: "Hanya 3 baris Februari yang lebih baru dari watermark.", name: "n_baru", value: 3, tol: 0 },
          { kind: "equal", task: "t2", label: "wm_baru = 2026-02-03", msg: "Watermark maju ke tanggal maksimum batch baru.", name: "wm_baru", value: "2026-02-03", tol: 0 },
          { kind: "equal", task: "t3", label: "n_total = 9", msg: "6 lama + 3 baru, tanpa duplikat.", name: "n_total", value: 9, tol: 0 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Tiga angka: dimuat, total, watermark.", pattern: "total baris: 9 \\| watermark: 2026-02-03" },
        ],
      },
      reference: "Incremental = watermark + filter tanggal. Tanpa filter, re-run = duplikat.",
    },
    {
      id: "chart-avg",
      eyebrow: "Langkah 8 · Chart",
      title: "Melihat jebakan: dua cara merata-rata, dua nasib",
      prose: [
        "Chart di bawah memakai angka ilustratif tiga kategori: batang gelap = rata-rata DARI rata-rata bulanan (cara Rani yang salah); batang terang = rata-rata tertimbang yang benar (total omzet / total transaksi).",
        "Cara membaca: sumbu Y = ribu rupiah per transaksi; tiap kelompok = satu kategori; dua batang per kelompok.",
        "Interpretasi: pada Kopi, cara salah memberi 116 rb vs 109 rb yang benar — selisih 6,4% yang “kecil” tetapi menjadi 330 juta saat dikali proyeksi. Pada Roti arahnya TERBALIK: cara salah MERENDAHKAN (142 vs 151) — jebakan ini tidak selalu melebihkan, ia ACAK tergantung komposisi ukuran kelompok tiap bulan. Itulah yang membuatnya berbahaya: tidak ada “koreksi mental” yang bisa dihafal; satu-satunya obat adalah rumus yang benar (DIVIDE(SUM,SUM)).",
      ],
      figure: {
        svg: AVG_SVG,
        alt: "Diagram batang: Kopi 116 vs 109, Roti 142 vs 151, Teh 98 vs 94 ribu rupiah — rata-rata dari rata-rata vs rata-rata tertimbang.",
        caption: "Rata-rata dari rata-rata (gelap) vs rata-rata tertimbang (terang), ribu Rp. Selisihnya acak arah — tak bisa dikoreksi dengan firasat.",
      },
      tasks: [],
      reference: "Jebakan rata-rata: selisih kecil per unit × volume besar = bencana. Obat: DIVIDE(SUM,SUM).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Empat skenario SQL-ke-BI",
      prose: [
        "Skenario 1 — Direksi minta KPI “rata-rata nilai transaksi per cabang per bulan” yang stabil tiap hari. → Buat tabel agregat di SQL dengan grain (bulan, cabang): kolom omzet, n_trx. Di BI, measure = DIVIDE(SUM(omzet), SUM(n_trx)). Alasan: grain eksplisit + definisi tunggal — mustahil salah tafsir.",
        "Skenario 2 — Analis eksplorasi ad-hoc: “coba potong omzet per 5 kategori baru”. → Agregasi di BI tool (drag-and-drop), bukan bikin tabel SQL baru. Alasan: eksplorasi butuh kecepatan iterasi; tabel SQL dibuat setelah pola analisisnya stabil.",
        "Skenario 3 — Setelah JOIN tabel pesanan–item, total ongkir terlihat 2,4× lipat dari laporan keuangan. → Fan-out: agregasikan item per order DULU, baru JOIN ongkir — atau pisahkan measure ongkir di grain pesanan. Alasan: perkalian terjadi di JOIN; filter dashboard tidak bisa memperbaikinya.",
        "Skenario 4 — Dashboard di-refresh tiap jam atas tabel 50 juta baris; query makin lambat. → Refresh incremental dengan watermark (pola lab 2) + tabel agregat. Alasan: memuat ulang 50 juta baris tiap jam = membayar 24× untuk data yang 23×-nya tidak berubah.",
        "Aturan praktis 10 detik: grain ditulis satu kalimat; measure = DIVIDE(SUM,SUM) bukan AVERAGE atas rata-rata; JOIN lalu SUM → cek COUNT(DISTINCT kunci); refresh besar → incremental + watermark.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membuat tabel agregat TANPA kolom penyebut (hanya menyimpan rata-rata, membuang n_trx dan omzet). Tabel seperti itu tidak bisa dihitung ulang dengan benar — ia fosil dari satu perhitungan. Selalu simpan pembilang dan penyebut (atau grain paling halusnya), jangan hanya hasilnya.",
      },
      reference: "KPI stabil → agregat di SQL. Eksplorasi → di BI. Fan-out → agregasi dulu. Refresh besar → incremental.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Dashboard insentif cabang: siapa dapat bonus?",
      prose: [
        "Skenario (sintetis, angka konkret): direksi akan memberi bonus ke cabang dengan “rata-rata nilai transaksi” tertinggi. Data: Cabang A Januari — 2 transaksi @150.000 (total 300.000, rata-rata 150.000); Februari — 10 transaksi @100.000 (total 1.000.000, rata-rata 100.000). Cabang B Januari — 6 transaksi @120.000 (total 720.000); Februari — 6 transaksi @120.000 (total 720.000). Analis junior membuat measure AVERAGE atas kolom “rata-rata bulanan”.",
        "Pertanyaan analisis: (1) Berapa angka junior untuk tiap cabang, dan siapa “menang”? (2) Berapa angka yang benar (tertimbang), dan siapa seharusnya menang? (3) Tulis query agregat + definisi measure DAX yang benar.",
        "Pembahasan: (1) Junior: A = (150.000+100.000)/2 = 125.000; B = (120.000+120.000)/2 = 120.000 → A menang. (2) Benar: A = 1.300.000/12 = 108.333; B = 1.440.000/12 = 120.000 → B menang — HASIL TERBALIK. Bonus jatuh ke cabang yang salah karena Januari-nya A (2 transaksi) diberi suara sama dengan Februari-nya (10 transaksi). (3) Query: SELECT cabang, SUM(nilai) AS omzet, COUNT(*) AS n_trx FROM transaksi GROUP BY cabang (grain: cabang — atau (bulan, cabang) bila tren bulanan dibutuhkan, dengan kolom omzet & n_trx tetap disimpan). Measure: Rata2 = DIVIDE(SUM(transaksi[omzet]), SUM(transaksi[n_trx])).",
        "Kaitan ke karier: “pernah membalikkan keputusan bonus yang salah karena measure yang salah” adalah cerita interview yang menunjukkan kamu berpikir dalam grain, bukan dalam klik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan insentif atas angka yang salah bukan sekadar “salah hitung” — ia mengubah PERILAKU: cabang belajar mengoptimalkan metrik yang salah (sedikit transaksi besar di bulan sepi) alih-alih kinerja yang benar. Metrik yang salah = insentif yang salah = risiko perilaku.",
      },
      reference: "Junior: A 125rb menang. Benar: B 120rb menang. Selalu timbang dengan penyebut.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Grain = satu baris mewakili satu fakta; tulis dalam satu kalimat sebelum GROUP BY — grain kabur = measure kabur.",
        "Jangan merata-ratakan kolom rata-rata: measure yang benar = DIVIDE(SUM(omzet), SUM(n_trx)).",
        "Semantic layer: dimension memotong, measure dihitung; definisi KPI ditulis sekali, dipakai semua dashboard.",
        "Fan-out: JOIN 1-ke-banyak menggandakan kolom sisi-1 sebesar ×k — obatnya agregasi dulu, JOIN kemudian.",
        "Refresh besar = incremental + watermark: hanya baris baru yang dimuat; re-run tanpa filter = duplikat.",
      ],
      next: { label: "C24 — dbt Hands-On: Model, Test, dan Dokumentasi", href: "/v2/learn/c24-dbt-hands-on" },
      quiz: [
        {
          q: "KPI “omzet harian per kategori”. Grain tabel agregat yang benar?",
          options: [
            { text: "(tanggal, kategori) — satu baris = satu hari × satu kategori", why: "Benar: grain menjawab KPI secara langsung — satu baris, satu fakta. Semua measure (total, rata-rata) bisa diturunkan.", correct: true },
            { text: "(kategori) saja — satu baris = satu kategori", why: "Salah: grain ini kehilangan dimensi waktu — “harian”-nya KPI tidak bisa dijawab." },
            { text: "(tanggal) saja — satu baris = satu hari", why: "Salah: kehilangan dimensi kategori — tidak bisa memotong per kategori." },
            { text: "Tidak perlu grain — biarkan BI tool yang mengelompokkan", why: "Salah: tanpa grain eksplisit, tiap analis menebak sendiri — lahirlah tiga definisi berbeda." },
          ],
        },
        {
          q: "Tabel agregat punya kolom omzet dan n_trx per bulan. Measure DAX “rata-rata per transaksi” yang benar?",
          options: [
            { text: "DIVIDE(SUM(omzet), SUM(n_trx))", why: "Benar: kembali ke pembilang dan penyebut asli — rata-rata tertimbang yang benar di semua potongan.", correct: true },
            { text: "AVERAGE atas kolom rata-rata bulanan", why: "Salah: inilah jebakan Rani — rata-rata dari rata-rata, salah 330 juta di cerita pembuka." },
            { text: "SUM(omzet) / COUNT(bulan)", why: "Salah: membagi total dengan jumlah bulan = “rata-rata per bulan”, bukan per transaksi." },
            { text: "MEDIAN atas kolom rata-rata bulanan", why: "Salah: median tidak memperbaiki masalah bobot — ia hanya mengganti cara salah merata-ratakan." },
          ],
        },
        {
          q: "Setelah JOIN pesanan (1 baris/order, ada kolom ongkir) dengan item (N baris/order), SUM(ongkir) menjadi 2,4× lipat. Diagnosis dan obat?",
          options: [
            { text: "Fan-out: ongkir terduplikasi per item — agregasikan item per order dulu, baru JOIN ongkir", why: "Benar: perkalian terjadi di JOIN; obatnya di model data — agregasi dulu atau pisahkan grain.", correct: true },
            { text: "Tambahkan filter di dashboard untuk order yang bermasalah", why: "Salah: filter memangkas baris, bukan memperbaiki perkalian — 3× tetap 3× setelah difilter." },
            { text: "Ganti SUM menjadi AVG", why: "Salah: AVG atas data terduplikasi juga salah (tertimbang oleh jumlah item, bukan order)." },
            { text: "Itu normal — ongkir memang dihitung per item", why: "Salah: ongkir dibayar per order, bukan per item. “Normal” di sini artinya salah yang konsisten." },
          ],
        },
        {
          q: "Kapan agregasi dilakukan di SQL (tabel agregat) vs di BI tool (drag-and-drop)?",
          options: [
            { text: "KPI stabil & data besar → tabel agregat di SQL; eksplorasi ad-hoc → di BI tool", why: "Benar: stabilitas + volume = invest di SQL; ketidakpastian = iterasi cepat di BI. Skenario 1 vs 2 peta keputusan.", correct: true },
            { text: "Selalu di BI tool — SQL hanya untuk mengambil data mentah", why: "Salah: BI tool menghitung di memori/refresh — atas 50 juta baris itu lambat dan tidak versioned." },
            { text: "Selalu di SQL — BI tool hanya untuk visual", why: "Salah: membuat tabel SQL untuk tiap pertanyaan ad-hoc = antrean kerja tanpa akhir; eksplorasi butuh kecepatan." },
            { text: "Tergantung tool-nya: Power BI di SQL, Tableau di BI", why: "Salah: keputusannya berdasarkan stabilitas dan volume, bukan merek tool." },
          ],
        },
        {
          q: "Cara memeriksa duplikat grain (bulan, kategori) di tabel agregat?",
          options: [
            { text: "SELECT bulan, kategori FROM agg GROUP BY bulan, kategori HAVING COUNT(*) > 1 — harus 0 baris", why: "Benar: persis lab 1 — grain bersih berarti tiap kombinasi muncul tepat sekali.", correct: true },
            { text: "SELECT COUNT(*) FROM agg — selama > 0 berarti aman", why: "Salah: menghitung baris tidak mendeteksi duplikat — 7 baris bisa berarti 6 grain + 1 duplikat." },
            { text: "SELECT DISTINCT * FROM agg", why: "Salah: DISTINCT menyembunyikan duplikat dari HASIL, bukan memeriksanya — masalahnya tetap ada di tabel." },
            { text: "Tidak perlu — GROUP BY tidak mungkin menghasilkan duplikat", why: "Salah: GROUP BY atas query yang benar memang unik; tetapi tabel agregat bisa diisi dari banyak sumber/append — verifikasi tetap wajib." },
          ],
        },
        {
          q: "Dashboard di-refresh tiap jam atas 50 juta baris. Strategi refresh yang profesional?",
          options: [
            { text: "Incremental dengan watermark: hanya baris baru yang dimuat", why: "Benar: lab 2 — membayar 1× untuk data baru, bukan 24× untuk data yang tidak berubah.", correct: true },
            { text: "Full refresh tiap jam — data selalu segar", why: "Salah: “segar” yang dibayar 24× lipat; pada 50 juta baris ini bom biaya dan waktu." },
            { text: "Refresh manual saat direksi meminta", why: "Salah: dashboard yang kadaluarsa di antara permintaan = keputusan atas angka basi." },
            { text: "Kecilkan tabel dengan menghapus data lama", why: "Salah: menghapus histori merusak tren dan audit — mengorbankan kebenaran demi kecepatan." },
          ],
        },
      ],
    },
  ],
};

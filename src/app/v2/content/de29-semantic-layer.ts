import type { V2Lesson } from "../lib/types";

// Arsitektur: sumber → semantic layer (satu definisi) → banyak konsumen yang konsisten.
const SEMANTIC_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Semantic layer: satu definisi, banyak konsumen.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="30" y="60" width="110" height="40" rx="6" fill="var(--c2)" fill-opacity="0.5"/>
<rect x="30" y="120" width="110" height="40" rx="6" fill="var(--c2)" fill-opacity="0.5"/>
<rect x="30" y="180" width="110" height="40" rx="6" fill="var(--c2)" fill-opacity="0.5"/>
<text x="85" y="84" fill="var(--text)">orders</text>
<text x="85" y="144" fill="var(--text)">payments</text>
<text x="85" y="204" fill="var(--text)">refunds</text>
<rect x="210" y="100" width="140" height="80" rx="8" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="280" y="128" fill="var(--text)" font-size="12">semantic layer</text>
<text x="280" y="148" fill="var(--chart-text)" font-size="10">revenue_net = definisi</text>
<text x="280" y="164" fill="var(--chart-text)" font-size="10">satu pintu, berversi</text>
<line x1="140" y1="80" x2="210" y2="120" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="140" y1="140" x2="210" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="140" y1="200" x2="210" y2="160" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="420" y="40" width="110" height="40" rx="6" fill="var(--c3)" fill-opacity="0.5"/>
<rect x="420" y="100" width="110" height="40" rx="6" fill="var(--c3)" fill-opacity="0.5"/>
<rect x="420" y="160" width="110" height="40" rx="6" fill="var(--c3)" fill-opacity="0.5"/>
<rect x="420" y="220" width="110" height="40" rx="6" fill="var(--c3)" fill-opacity="0.5"/>
<text x="475" y="64" fill="var(--text)">dashboard</text>
<text x="475" y="124" fill="var(--text)">API / app</text>
<text x="475" y="184" fill="var(--text)">notebook</text>
<text x="475" y="244" fill="var(--text)">AI agent</text>
<line x1="350" y1="120" x2="420" y2="60" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="350" y1="135" x2="420" y2="120" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="350" y1="150" x2="420" y2="180" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="350" y1="160" x2="420" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
</g>
<text x="280" y="28" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">tiga sumber, SATU definisi, empat konsumen — semua membaca angka yang sama</text>
</svg>`;

export const de29: V2Lesson = {
  slug: "de29-semantic-layer",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE29 — Semantic Layer & Metrics Store",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Revenue Rp4,2 M atau Rp3,7 M?",
      prose: [
        "Kamis pagi, rapat direksi SinarPay. Slide finance: revenue kuartal Rp4,2 miliar. Slide product: revenue kuartal Rp3,7 miliar. Direksi menatap bergantian — selisih Rp500 juta, 12%. 'Yang mana yang benar?' Keheningan. Kedua tim membuka query masing-masing — dan keduanya BENAR terhadap definisinya sendiri.",
        "Finance memakai view `v_revenue_a`: SUM(amount) dari semua order — termasuk yang di-refund dan yang dibatalkan ('kan uangnya sempat masuk'). Product memakai `v_revenue_b`: SUM(amount) WHERE status = 'paid' — hanya yang benar-benar jadi uang. Tidak ada yang salah hitung; yang tidak ada adalah KESEPAKATAN: perusahaan dengan 200 orang tidak punya satu definisi tertulis untuk kata 'revenue'.",
        "Twist-nya: masalah ini tidak bisa diselesaikan dengan 'rapat penyelarasan'. Tiga bulan kemudian, analis baru menulis view KETIGA dengan definisi sedikit berbeda — karena view hanyalah query tersimpan, tanpa pemilik, tanpa versi, tanpa test. Setiap view baru = satu definisi baru yang lahir diam-diam. Lesson ini tentang semantic layer: satu pintu definisi metrik yang berversi, tertest, dan dipakai semua konsumen — dari dashboard sampai AI agent.",
      ],
      tasks: [],
      reference: "Konflik metrik = tidak ada definisi tunggal yang berversi. Solusinya: semantic layer.",
    },
    {
      id: "semantic-layer",
      eyebrow: "Langkah 2 · Konsep",
      title: "Semantic Layer: Si Penerjemah Resmi",
      prose: [
        "Semantic layer adalah SATU definisi resmi untuk tiap metrik bisnis — ditulis sekali, dipakai semua orang. `revenue_net` didefinisikan di satu tempat: SUM(amount) WHERE status = 'paid', dengan pemilik, versi, dan test. Dashboard finance, API aplikasi, notebook analis, dan AI agent semuanya membaca definisi yang SAMA. Tidak ada lagi 'revenue versi finance' vs 'revenue versi product' — yang ada hanya `revenue_net` v3.",
        "Implementasi modern: dbt Semantic Layer / MetricFlow (definisi metrik sebagai YAML di samping model dbt, di-query via API), Cube (semantic layer headless dengan caching), atau LookML (Looker). Polanya sama: logika metrik = KODE yang di-version-control, di-review, dan di-test — bukan query yang ditempel di 14 dashboard.",
        "Tiga properti yang membuatnya 'layer', bukan sekadar view. BERVERSI: perubahan definisi = pull request yang bisa di-review ('mengapa refund dikeluarkan dari revenue_net mulai Q3?'). TERTEST: test otomatis memastikan metrik tidak null, tidak negatif, konsisten dengan definisi lama dalam batas toleransi. TERDOKUMENTASI: tiap metrik punya deskripsi, pemilik, dan contoh query — analis baru tidak perlu menebak.",
        "💡 Intuisi: semantic layer = kamus resmi perusahaan. Tanpa kamus, tiap orang memakai 'revenue' dengan arti versinya sendiri dan semua percakapan menjadi debat definisi. Dengan kamus, debatnya pindah ke tempat yang benar: pull request definisi, bukan rapat direksi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: semantic layer = view yang diberi nama keren",
        type: "pitfall",
        body: "View adalah query tersimpan — tanpa pemilik, tanpa versi, tanpa test, tanpa dokumentasi. Siapa pun bisa membuat v_revenue_c besok pagi. Semantic layer adalah INFRASTRUKTUR GOVERNANCE: perubahan definisi melewati review, test berjalan otomatis, konsumen mendapat peringatan saat definisi berubah. View menjawab 'bagaimana'; semantic layer menjawab 'bagaimana, oleh siapa, sejak kapan, dan apakah masih benar'.",
      },
      reference: "Satu definisi, berversi, tertest, terdokumentasi — dipakai semua konsumen.",
    },
    {
      id: "headless-bi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Headless BI: Si Dapur Tanpa Restoran",
      prose: [
        "BI tradisional = restoran lengkap: dapur (definisi) dan ruang makan (dashboard) jadi satu paket. Ganti dari Tableau ke Looker = tulis ulang semua definisi. Headless BI memisahkan keduanya: semantic layer adalah DAPUR yang menyajikan metrik via API; dashboard apa pun (Tableau, Power BI, Metabase, aplikasi web, bahkan AI agent) tinggal memesan.",
        "Kenapa ini penting untuk data engineer: konsumen metrik kini BUKAN hanya manusia. AI agent yang menjawab 'berapa revenue bulan lalu?' di Slack memanggil API yang sama dengan dashboard direksi — dan mendapat angka yang SAMA. Tanpa semantic layer, tiap agent mengarang query-nya sendiri (kembali ke cerita: view ketiga, keempat, kelima...).",
        "Pola konsumsi tipikal: dashboard membaca via SQL yang di-generate dari definisi; aplikasi membaca via REST/GraphQL (`GET /metrics/revenue_net?grain=month`); notebook memakai client library. Satu definisi, tiga cara akses — konsistensi tanpa memaksa semua orang memakai tool yang sama.",
        "Cara membaca diagram: tiga sumber (orders, payments, refunds) mengalir ke SATU kotak semantic layer, lalu bercabang ke empat konsumen. Garisnya satu arah dan tidak ada jalan pintas: tidak ada konsumen yang boleh query sumber langsung untuk metrik yang sudah terdefinisi.",
        "Interpretasi: kotak tengah adalah satu-satunya tempat logika bisnis tinggal. Bila definisi berubah, yang berubah hanya satu kotak — bukan 14 dashboard + 3 notebook + 2 agent.",
      ],
      figure: {
        svg: SEMANTIC_SVG,
        alt: "Arsitektur semantic layer: tiga sumber, satu definisi, empat konsumen.",
        caption: "Satu pintu definisi: orders/payments/refunds → revenue_net (berversi) → dashboard, API, notebook, AI agent — semua konsisten.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: headless BI membuat analis lebih lambat",
        type: "pitfall",
        body: "Ketakutannya: 'tiap metrik baru harus lewat tim data'. Kenyataannya: analis tetap bisa eksplorasi bebas di sandbox; yang melewati governance HANYA metrik yang dipromosikan menjadi 'resmi' (masuk dashboard direksi, laporan regulator). Eksplorasi tetap liar; kebenaran resmi tetap terjaga. Dua kecepatan, bukan satu kemacetan.",
      },
      reference: "Dapur (definisi) terpisah dari restoran (dashboard). Konsumen: dashboard, API, notebook, agent.",
    },
    {
      id: "governance",
      eyebrow: "Langkah 4 · Konsep",
      title: "Governance metrik: siapa boleh mengubah kebenaran",
      prose: [
        "Definisi metrik adalah KEKUASAAN: siapa yang bisa mengubah `revenue_net` bisa mengubah cerita perusahaan. Governance menjawab tiga pertanyaan: SIAPA pemilik tiap metrik (nama orang, bukan 'tim data'), BAGAIMANA perubahan dilakukan (pull request + review pemilik + test hijau), dan APA yang terjadi pada konsumen saat definisi berubah (changelog + masa tenggang, bukan kejutan).",
        "Pola yang bekerja: metrik inti (revenue, active user, NPL) = 'terkunci' — perubahan butuh persetujuan pemilik + pemberitahuan 2 minggu ke konsumen. Metrik eksperimental = 'bebas' — analis boleh membuat di namespace sandbox tanpa review. Di antaranya ada tangga promosi yang jelas: sandbox → proposed → certified.",
        "Dua metrik bernama mirip boleh hidup berdampingan ASAL namanya jujur: `revenue_gross` (termasuk refund) dan `revenue_net` (tidak termasuk) — bukan dua-duanya bernama 'revenue'. Konflik SinarPay bukan karena ada dua definisi, melainkan karena keduanya mengklaim nama yang sama.",
        "Rumusnya sederhana: selisih dua definisi = ukuran kebingunganmu. Bila |A − B| besar dan keduanya bernama 'revenue', masalahmu bukan matematika — melainkan governance.",
      ],
      formula: String.raw`\text{gap} = |R_A - R_B|`,
      formulaNote: "gap = selisih dua definisi 'revenue' (rupiah); R_A = angka definisi A (mis. 4,2 M); R_B = angka definisi B (mis. 3,7 M). Contoh cerita: |4,2 − 3,7| = 0,5 M = 12% — cukup besar untuk membuat direksi bertanya, cukup kecil untuk lolos tanpa disadari berbulan-bulan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: satu metrik untuk semua konteks itu ideal",
        type: "pitfall",
        body: "Finance BUTUH revenue gross (untuk rekonsiliasi bank) dan product BUTUH revenue net (untuk mengukur bisnis). Memaksa satu definisi = salah satu tim bekerja dengan angka yang salah untuk kebutuhannya. Solusi bukan satu metrik, melainkan SEMUA metrik bernama jujur dan terdefinisi resmi: revenue_gross DAN revenue_net, keduanya di semantic layer.",
      },
      reference: "Pemilik bernama + PR + test + changelog. Nama jujur > satu nama.",
    },
    {
      id: "memilih-platform",
      eyebrow: "Langkah 5 · Memilih platform",
      title: "Memilih platform: dbt, Cube, atau LookML",
      prose: [
        "Tiga nama mendominasi pasar 2026, dengan filosofi berbeda. dbt Semantic Layer / MetricFlow: definisi metrik sebagai YAML di samping model dbt-mu — 'infrastruktur sebagai kode' untuk metrik. Pilih ini bila tim SUDAH hidup di dbt: definisi tinggal satu repo dengan transformasi, PR yang sama me-review keduanya.",
        "Cube: semantic layer headless murni dengan lapisan caching agresif — dirancang untuk melayani ribuan query konsumen (dashboard + API + AI agent) dengan cepat. Pilih ini bila konsumenmu BANYAK dan POLYGLOT (5 tool BI + 3 aplikasi + agent) dan kamu butuh satu API konsisten untuk semuanya.",
        "LookML (Looker): definisi terikat ke ekosistem Looker — kuat bila perusahaan SUDAH standar di Looker, lemah bila ingin headless (konsumen di luar Looker = warga kelas dua). Pilih ini bila Looker adalah rumahmu dan tidak berencana pindah.",
        "Aturan pemilihnya: (1) Sudah di dbt? → MetricFlow, tanpa debat. (2) Butuh API untuk banyak konsumen non-dashboard? → Cube. (3) Standar Looker dan tidak akan berubah? → LookML. (4) Belum punya warehouse yang rapi? → JANGAN pilih apa pun dulu — rapikan modelnya (kembali ke pelajaran: layer di atas model berantakan = kamus untuk bahasa yang belum ada).",
        "💡 Intuisi: memilih platform semantic layer seperti memilih sistem pembukuan — yang penting BUKAN fiturnya yang paling canggih, melainkan yang dipakai konsisten oleh semua orang. Platform terbaik adalah yang timmu mau menulis definisinya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: platform mahal = definisi otomatis benar",
        type: "pitfall",
        body: "Cube atau dbt tidak menulis definisi untukmu — mereka hanya MENYIMPAN dan MELAYANI definisi yang kamu tulis. Definisi revenue_net yang salah tetap salah di platform termahal. Platform menyelesaikan masalah DISTRIBUSI kebenaran, bukan masalah MENEMUKAN kebenaran. Yang kedua tetap pekerjaan manusia.",
      },
      reference: "Pilih dari posisimu: sudah dbt → MetricFlow; banyak konsumen → Cube; standar Looker → LookML.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: dua definisi, satu kebenaran",
      prose: [
        "Waktunya merekonstruksi insiden SinarPay dalam skala lab. Database punya tabel `orders` dengan 6 baris (ada yang refunded, ada yang cancelled). Dua view mewakili dua tim: `v_revenue_a` (SUM semua — definisi finance) dan `v_revenue_b` (hanya 'paid' — definisi product).",
        "Tugasmu: ambil angka dari kedua view, hitung selisihnya, lalu bangun SATU view kanonis `m_revenue` (definisi resmi: hanya status 'paid') dan buktikan kedua 'tim' kini membaca angka yang sama. Inilah semantic layer dalam bentuk paling minimal: satu definisi bernama, dipakai semua.",
        "Cara membaca output: dua baris pertama = konfliknya (1075.0 vs 950.0); baris ketiga = besar masalahnya (125.0); baris keempat = resolusinya (keduanya 950.0).",
        "Interpretasi: lab ini kecil, tetapi polanya persis yang dipakai dbt Semantic Layer — bedanya, di produksi definisinya berversi (YAML + PR) dan tertest otomatis, bukan CREATE VIEW manual.",
      ],
      formula: String.raw`R_{net} = \sum amount_i \cdot \mathbf{1}(status_i = \text{'paid'})`,
      formulaNote: "R_net = revenue bersih; amount_i = nominal order ke-i; 1(...) = fungsi indikator (1 bila status 'paid', 0 bila tidak). Contoh lab: hanya 4 dari 6 order berstatus 'paid' (100 + 250 + 400 + 200) → R_net = 950.0.",
      tasks: [
        { id: "t1", text: "Lengkapi `revenue_dari` — ambil satu angka revenue dari view yang namanya diberikan" },
        { id: "t2", text: "Lengkapi `selisih` — besar konflik = |a − b|" },
        { id: "t3", text: "Lengkapi `buat_kanonis` — CREATE VIEW m_revenue dengan definisi resmi (hanya 'paid')" },
      ],
      expected: "finance (view A): 1075.0\nproduct (view B): 950.0\nselisih: 125.0\nkanonis — finance: 950.0 | product: 950.0",
      note: {
        title: "Sering salah",
        body: "Menulis definisi kanonis sebagai WHERE status != 'refunded' — lupa bahwa 'cancelled' juga bukan revenue. Definisi resmi harus POSITIF (hanya yang termasuk: 'paid'), bukan negatif (semua kecuali X) — karena status baru yang muncul besok ('disputed'?) otomatis tertangani dengan benar.",
      },
      hints: [
        "revenue_dari: cur.execute(f\"SELECT revenue FROM {view}\").fetchone()[0].",
        "selisih: abs(a - b).",
        "buat_kanonis: cur.execute(\"CREATE VIEW m_revenue AS SELECT SUM(amount) AS revenue FROM orders WHERE status = 'paid'\").",
      ],
      code: {
        starter: `import sqlite3\n` +
`\n` +
`db = sqlite3.connect(":memory:")\n` +
`cur = db.cursor()\n` +
`cur.execute("CREATE TABLE orders (order_id INTEGER, amount REAL, status TEXT)")\n` +
`cur.executemany("INSERT INTO orders VALUES (?, ?, ?)", [(1, 100.0, "paid"), (2, 250.0, "paid"), (3, 50.0, "refunded"), (4, 400.0, "paid"), (5, 75.0, "cancelled"), (6, 200.0, "paid")])\n` +
`# Dua definisi "revenue" yang berbeda — sumber konflik finance vs product\n` +
`cur.execute("CREATE VIEW v_revenue_a AS SELECT SUM(amount) AS revenue FROM orders")\n` +
`cur.execute("CREATE VIEW v_revenue_b AS SELECT SUM(amount) AS revenue FROM orders WHERE status = 'paid'")\n` +
`\n` +
`# TUGAS 1: ambil revenue dari sebuah view\n` +
`def revenue_dari(view):\n` +
`    return\n` +
`\n` +
`# TUGAS 2: besar konflik dua definisi\n` +
`def selisih(a, b):\n` +
`    return\n` +
`\n` +
`# TUGAS 3: definisi resmi — SATU pintu untuk semua konsumen\n` +
`def buat_kanonis():\n` +
`    return\n` +
`\n` +
`rev_a = revenue_dari("v_revenue_a")\n` +
`rev_b = revenue_dari("v_revenue_b")\n` +
`gap = selisih(rev_a, rev_b)\n` +
`buat_kanonis()\n` +
`fin = revenue_dari("m_revenue")\n` +
`prod = revenue_dari("m_revenue")\n` +
`print(f"finance (view A): {rev_a}")\n` +
`print(f"product (view B): {rev_b}")\n` +
`print(f"selisih: {gap}")\n` +
`print(f"kanonis \\u2014 finance: {fin} | product: {prod}")\n`,
        lockLines: 9,
        solution: `import sqlite3\n` +
`\n` +
`db = sqlite3.connect(":memory:")\n` +
`cur = db.cursor()\n` +
`cur.execute("CREATE TABLE orders (order_id INTEGER, amount REAL, status TEXT)")\n` +
`cur.executemany("INSERT INTO orders VALUES (?, ?, ?)", [(1, 100.0, "paid"), (2, 250.0, "paid"), (3, 50.0, "refunded"), (4, 400.0, "paid"), (5, 75.0, "cancelled"), (6, 200.0, "paid")])\n` +
`# Dua definisi "revenue" yang berbeda — sumber konflik finance vs product\n` +
`cur.execute("CREATE VIEW v_revenue_a AS SELECT SUM(amount) AS revenue FROM orders")\n` +
`cur.execute("CREATE VIEW v_revenue_b AS SELECT SUM(amount) AS revenue FROM orders WHERE status = 'paid'")\n` +
`\n` +
`# TUGAS 1: ambil revenue dari sebuah view\n` +
`def revenue_dari(view):\n` +
`    return cur.execute(f"SELECT revenue FROM {view}").fetchone()[0]\n` +
`\n` +
`# TUGAS 2: besar konflik dua definisi\n` +
`def selisih(a, b):\n` +
`    return abs(a - b)\n` +
`\n` +
`# TUGAS 3: definisi resmi — SATU pintu untuk semua konsumen\n` +
`def buat_kanonis():\n` +
`    cur.execute("CREATE VIEW m_revenue AS SELECT SUM(amount) AS revenue FROM orders WHERE status = 'paid'")\n` +
`\n` +
`rev_a = revenue_dari("v_revenue_a")\n` +
`rev_b = revenue_dari("v_revenue_b")\n` +
`gap = selisih(rev_a, rev_b)\n` +
`buat_kanonis()\n` +
`fin = revenue_dari("m_revenue")\n` +
`prod = revenue_dari("m_revenue")\n` +
`print(f"finance (view A): {rev_a}")\n` +
`print(f"product (view B): {rev_b}")\n` +
`print(f"selisih: {gap}")\n` +
`print(f"kanonis \\u2014 finance: {fin} | product: {prod}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "revenue_dari", label: "fungsi `revenue_dari` terdefinisi", msg: "Definisikan revenue_dari(view) yang mengembalikan angka revenue." },
          { kind: "equal", task: "t1", name: "rev_a", value: 1075.0, tol: 0.01, label: "`rev_a` = 1075.0", msg: "SUM semua 6 order = 1075.0 (termasuk refunded & cancelled)." },
          { kind: "equal", task: "t1", name: "rev_b", value: 950.0, tol: 0.01, label: "`rev_b` = 950.0", msg: "Hanya 4 order 'paid' = 950.0." },
          { kind: "equal", task: "t2", name: "gap", value: 125.0, tol: 0.01, label: "`gap` = 125.0", msg: "|1075 − 950| = 125 — inilah Rp500 juta versi lab." },
          { kind: "stdout_matches", task: "t3", pattern: "kanonis — finance: 950\\.0", label: "`print` kanonis konsisten", msg: "Baris terakhir harus menunjukkan kedua tim membaca 950.0." },
        ],
      },
      reference: "Konflik metrik diukur, bukan dirasakan. Satu definisi resmi mengakhiri debat.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan semantic layer",
      prose: [
        "Skenario 1 — 3 orang, 1 dashboard, 20 metrik. → Cukup view + dokumentasi. Alasan: governance untuk 20 metrik = birokrasi; semantic layer terbayar saat konsumennya banyak.",
        "Skenario 2 — 200 orang, 5 tool BI, AI agent ikut query. → Semantic layer (dbt/Cube). Alasan: tiap konsumen baru = satu definisi baru yang lahir diam-diam tanpa pintu tunggal.",
        "Skenario 3 — Metrik masuk laporan regulator / direksi. → Semantic layer dengan test + pemilik bernama. Alasan: angka resmi butuh jejak audit, bukan 'query-nya Andi'.",
        "Skenario 4 — Dua tim butuh definisi berbeda yang SAH (gross vs net). → Dua metrik bernama jujur di layer yang sama. Alasan: masalahnya bukan jumlah definisi, melainkan nama yang menipu.",
        "Skenario 5 — Startup 10 orang yang baru punya warehouse. → Tunda; fokus ke pemodelan yang benar dulu. Alasan: semantic layer di atas model berantakan = kamus untuk bahasa yang belum ada.",
        "Aturan praktis 10 detik: konsumen > 3 ATAU metrik resmi ATAU agent ikut query = bangun layer. Selain itu = view + docs cukup.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membangun semantic layer SEBELUM model data rapi. Layer tidak memperbaiki definisi yang buruk — ia hanya menyebarkan definisi buruk itu lebih efisien ke lebih banyak konsumen. Urutan: model benar → definisi disepakati → layer.",
      },
      reference: "Layer = jawaban atas 'banyak konsumen + angka resmi'. Bukan jawaban atas segalanya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: tiga definisi 'active user'",
      prose: [
        "SinarMart punya tiga angka 'active user' bulanan: marketing 1,8 juta (pernah login), product 1,2 juta (buka >3 halaman), data 0,9 juta (transaksi). Board deck memakai 1,8 juta; OKR product memakai 1,2 juta; capacity planning memakai 0,9 juta. Tidak ada yang salah hitung — ketiganya 'active' versi masing-masing.",
        "Hitung dampaknya: bila board mengira basis pengguna 2x lipat dari yang bertransaksi, proyeksi revenue = 1,8 jt × Rp50 ribu = Rp90 M — padahal basis yang membayar = 0,9 jt × Rp50 ribu = Rp45 M. Selisih Rp45 M ekspektasi dibangun di atas NAMA yang sama dengan tiga arti.",
        "Pertanyaan analisis: (1) Rancang tiga nama metrik yang jujur + definisinya. (2) Mana yang jadi 'certified' untuk board deck, dan siapa pemiliknya? (3) Bagaimana mencegah analis keempat membuat definisi keempat?",
        "Pembahasan: (1) `active_login_mau` (≥1 login), `active_engaged_mau` (>3 halaman), `active_transacting_mau` (≥1 transaksi) — nama mengandung definisinya. (2) `active_transacting_mau` untuk proyeksi revenue (pemilik: head of data + CFO sebagai co-owner); board deck boleh menampilkan ketiganya asal berlabel. (3) Definisi baru di luar layer = tidak bisa masuk dashboard resmi — insentifnya: mau angkamu dipakai direksi? Lewat pintu resmi.",
      ],
      tasks: [],
      reference: "Nama yang jujur + pintu resmi = akhir dari perang definisi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam soal. Semua jawaban ada di lesson ini — yang diuji adalah pemahaman, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "Konflik metrik = tidak ada definisi tunggal berversi; view hanyalah query tersimpan tanpa pemilik.",
        "Semantic layer: satu definisi, berversi (PR), tertest, terdokumentasi — dipakai semua konsumen.",
        "Headless BI: dapur (definisi) terpisah dari restoran (dashboard); konsumen termasuk AI agent.",
        "Governance: pemilik bernama, tangga sandbox → certified, nama metrik yang jujur (gross vs net).",
        "Bangun layer saat: konsumen > 3, angka resmi/regulator, atau agent ikut query.",
      ],
      next: { label: "DE30 — AI Coding Tools untuk Data Engineer", href: "/learn/de30-ai-coding-tools" },
      quiz: [
        {
          q: "Finance: Rp4,2 M. Product: Rp3,7 M. Keduanya benar menurut definisinya. Akar masalahnya?",
          options: [
            { text: "Salah satu tim salah hitung", why: "Keduanya benar secara matematis — tidak ada yang salah hitung.", },
            { text: "Tidak ada definisi tunggal 'revenue' yang resmi, berversi, dan dipakai bersama", why: "Tepat: dua view dengan dua definisi dan satu nama = konflik yang tak terhindarkan.", correct: true },
            { text: "Datanya corrupt", why: "Datanya baik-baik saja; yang berbeda adalah definisinya.", },
            { text: "Kurang rapat penyelarasan", why: "Rapat tidak mencegah analis baru membuat view ketiga besok.", },
          ],
        },
        {
          q: "Apa beda UTAMA semantic layer dengan view biasa?",
          options: [
            { text: "Semantic layer lebih cepat di-query", why: "Kecepatan bukan pembedanya — governance-lah.", },
            { text: "View = query tersimpan tanpa pemilik/versi/test; semantic layer = definisi berversi + tertest + terdokumentasi + ada pemilik", why: "Tepat: bedanya infrastruktur governance, bukan sintaks SQL.", correct: true },
            { text: "Semantic layer hanya untuk dashboard", why: "Justru sebaliknya: ia melayani dashboard, API, notebook, DAN agent.", },
            { text: "Tidak ada beda, hanya nama keren", why: "Inilah mitos yang dibantah lesson ini — bedanya ada di versioning, testing, dan ownership.", },
          ],
        },
        {
          q: "AI agent di Slack menjawab 'berapa revenue bulan lalu?'. Kenapa ia butuh semantic layer?",
          options: [
            { text: "Tidak butuh — agent bisa query langsung", why: "Query langsung = agent mengarang definisinya sendiri = view ke-N yang lahir diam-diam.", },
            { text: "Agar agent memakai definisi resmi yang sama dengan dashboard direksi via API", why: "Tepat: satu pintu definisi untuk manusia DAN mesin.", correct: true },
            { text: "Agar agent lebih cepat", why: "Bukan soal kecepatan — soal kebenaran yang konsisten.", },
            { text: "Karena agent tidak bisa SQL", why: "Agent modern bisa SQL; masalahnya bukan kemampuan, melainkan definisi.", },
          ],
        },
        {
          q: "Finance butuh gross, product butuh net. Keduanya sah. Solusi yang benar?",
          options: [
            { text: "Paksa satu definisi untuk semua", why: "Memaksa = satu tim bekerja dengan angka yang salah untuk kebutuhannya.", },
            { text: "Dua metrik bernama jujur (revenue_gross, revenue_net) di layer yang sama, keduanya resmi", why: "Tepat: masalahnya bukan jumlah definisi, melainkan nama yang menipu.", correct: true },
            { text: "Biarkan tiap tim punya view sendiri", why: "Itulah status quo yang menyebabkan Rp500 juta selisih.", },
            { text: "Hapus salah satunya", why: "Menghapus kebutuhan bisnis yang sah = solusi administratif, bukan solusi data.", },
          ],
        },
        {
          q: "Startup 10 orang, 1 dashboard, 20 metrik. Bangun semantic layer sekarang?",
          options: [
            { text: "Ya, semakin dini semakin baik", why: "Prematur: governance untuk 20 metrik = birokrasi tanpa konsumen yang cukup.", },
            { text: "Tunda — view + dokumentasi cukup; bangun saat konsumen > 3 atau ada angka resmi", why: "Tepat: layer terbayar saat masalahnya nyata (banyak konsumen/angka resmi).", correct: true },
            { text: "Ya, karena investor suka dengar 'semantic layer'", why: "Arsitektur untuk pitch deck, bukan untuk masalah nyata.", },
            { text: "Tidak pernah — view selalu cukup", why: "View cukup sampai konsumennya banyak; lalu ia menjadi pabrik definisi liar.", },
          ],
        },
        {
          q: "Perubahan definisi revenue_net disetujui. Apa yang HARUS terjadi selanjutnya?",
          options: [
            { text: "Langsung deploy diam-diam", why: "Kejutan definisi = dashboard berubah tanpa ada yang tahu kenapa.", },
            { text: "Changelog + masa tenggang + notifikasi ke semua konsumen sebelum berlaku", why: "Tepat: definisi adalah kontrak — perubahannya butuh protokol seperti perubahan API.", correct: true },
            { text: "Beri tahu hanya tim finance", why: "Semua konsumen (dashboard, API, notebook, agent) terdampak — bukan hanya satu tim.", },
            { text: "Buat view baru dengan nama sama", why: "Menimpa definisi lama tanpa jejak = menghapus sejarah kebenaran.", },
          ],
        },
      ],
    },
  ],
};

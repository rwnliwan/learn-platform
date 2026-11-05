import type { V2Lesson } from "../lib/types";

// Chaos vs governed: dua tim, dua angka → satu layer, satu angka.
const SEMANTIC_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Kiri: dua tim menghitung berbeda dari data mentah. Kanan: satu semantic layer memberi angka sama.">
<g font-size="12" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">
<text x="130" y="22" text-anchor="middle">Tanpa semantic layer</text>
<text x="390" y="22" text-anchor="middle">Dengan semantic layer</text>
</g>
<g font-family="var(--font-ui)" font-size="11">
<rect x="30" y="40" width="200" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="130" y="58" text-anchor="middle" fill="var(--text-muted)">data mentah (orders)</text>
<text x="130" y="74" text-anchor="middle" fill="var(--text-muted)">15 baris</text>
<rect x="30" y="120" width="92" height="60" rx="8" fill="var(--bg-app)" stroke="var(--c2)" stroke-width="1.5"/>
<text x="76" y="142" text-anchor="middle" fill="var(--text)" font-weight="600">Tim A</text>
<text x="76" y="162" text-anchor="middle" fill="var(--c2)" font-weight="700">rev 2.760</text>
<rect x="138" y="120" width="92" height="60" rx="8" fill="var(--bg-app)" stroke="var(--c4)" stroke-width="1.5"/>
<text x="184" y="142" text-anchor="middle" fill="var(--text)" font-weight="600">Tim B</text>
<text x="184" y="162" text-anchor="middle" fill="var(--c4)" font-weight="700">rev 1.740</text>
<rect x="55" y="200" width="150" height="52" rx="8" fill="var(--error-soft)" stroke="var(--error)"/>
<text x="130" y="222" text-anchor="middle" fill="var(--error)" font-weight="600">rapat 2 jam:</text>
<text x="130" y="240" text-anchor="middle" fill="var(--error)">yang benar yang mana?</text>
<rect x="290" y="40" width="200" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="390" y="58" text-anchor="middle" fill="var(--text-muted)">data mentah (orders)</text>
<text x="390" y="74" text-anchor="middle" fill="var(--text-muted)">15 baris</text>
<rect x="315" y="104" width="150" height="44" rx="8" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="1.5"/>
<text x="390" y="122" text-anchor="middle" fill="var(--text)" font-weight="600">semantic layer</text>
<text x="390" y="140" text-anchor="middle" fill="var(--text-muted)">revenue = paid only</text>
<rect x="298" y="168" width="92" height="60" rx="8" fill="var(--bg-app)" stroke="var(--c1)" stroke-width="1.5"/>
<text x="344" y="190" text-anchor="middle" fill="var(--text)" font-weight="600">Tim A</text>
<text x="344" y="210" text-anchor="middle" fill="var(--c1)" font-weight="700">1.740</text>
<rect x="406" y="168" width="92" height="60" rx="8" fill="var(--bg-app)" stroke="var(--c1)" stroke-width="1.5"/>
<text x="452" y="190" text-anchor="middle" fill="var(--text)" font-weight="600">Tim B</text>
<text x="452" y="210" text-anchor="middle" fill="var(--c1)" font-weight="700">1.740</text>
<rect x="315" y="200" width="150" height="52" rx="8" fill="var(--success-soft)" stroke="var(--success)"/>
<text x="390" y="222" text-anchor="middle" fill="var(--success)" font-weight="600">rapat 10 menit:</text>
<text x="390" y="240" text-anchor="middle" fill="var(--success)">keputusan diambil</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5">
<line x1="100" y1="84" x2="76" y2="118"/><line x1="160" y1="84" x2="184" y2="118"/>
<line x1="390" y1="84" x2="390" y2="102"/><line x1="350" y1="148" x2="344" y2="166"/><line x1="430" y1="148" x2="452" y2="166"/>
</g>
</svg>`;

export const biz6: V2Lesson = {
  slug: "biz6-self-service",
  track: "Business Intelligence",
  module: "Insight & Komunikasi",
  title: "BI6 — Self-Service BI",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rapat 2 jam tentang definisi",
      prose: [
        "Tim Marketing melaporkan revenue Rp2.760 (juta). Tim Finance melaporkan Rp1.740 untuk periode yang sama. Keduanya benar menurut definisinya: Marketing menghitung semua order, Finance hanya yang sudah dibayar. Rapat 2 jam habis untuk debat \u201Cyang benar yang mana\u201D — bukan untuk keputusan bisnis.",
        "Solusinya bukan melarang self-service, melainkan memasang semantic layer: satu definisi kanonis \u201Crevenue = order berstatus paid\u201D yang dipakai semua tim. Minggu depannya, kedua tim membuka dashboard masing-masing dan angkanya sama: 1.740. Rapat 10 menit, keputusan diambil.",
        "Twist-nya: masalahnya bukan orangnya (keduanya kompeten) dan bukan datanya (sama persis). Masalahnya adalah tidak adanya kontrak makna bersama. Self-service tanpa semantic layer bukan demokratisasi data — itu anarki definisi.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan peran semantic layer; (2) membangun definisi metrik kanonis sebagai kode; (3) menilai kapan self-service membantu vs menjadi chaos; (4) merancang guardrail ringan untuk self-service.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun semantic layer yang mengakhiri perang definisi antar tim.",
        "(1) Menjelaskan kenapa tiga tim bisa punya tiga 'revenue' yang semuanya benar menurut definisinya masing-masing;",
        "(2) Menulis definisi kanonis sebagai (dataset, filter, agregasi) yang bisa diuji oleh mesin;",
        "(3) Menjalankan uji konformansi: memetakan definisi tiap tim ke definisi baku dan menandai yang liar;",
        "(4) Menjelaskan kapan self-service aman dibuka (definisi terkunci) dan kapan harus ditutup.",
      ],
      tasks: [],
    },

    {
      id: "semantic-layer",
      eyebrow: "Langkah 3 · Semantic layer",
      title: "Semantic layer: kamus yang bisa dieksekusi",
      prose: [
        "Semantic layer adalah lapisan definisi antara data mentah dan konsumen: setiap metrik didefinisikan SEKALI sebagai kode (fungsi/query), lalu semua dashboard, laporan, dan analis memanggil definisi yang sama. Definisi bukan dokumen Word yang dibaca manusia — ia adalah kode yang dijalankan mesin.",
        "Anatominya tiga lapis: (1) model — tabel/fact yang sudah bersih; (2) metrik — fungsi bernama (revenue, active_users) dengan filter dan agregasi eksplisit; (3) akses — siapa boleh pakai metrik mana (certified vs experimental).",
        "Kepribadian: semantic layer adalah \u201Csi notaris\u201D — ia tidak memutuskan angka, ia menjamin semua orang memakai perjanjian yang sama.",
        "💡 Intuisi kunci: definisi yang baik bisa diuji. \u201Crevenue = SUM(amount) WHERE status='paid'\u201D bisa dijalankan dan diverifikasi. \u201Crevenue = penjualan yang valid\u201D tidak bisa. Kalau definisimu tidak bisa ditulis sebagai kode, ia belum definisi — masih opini.",
      ],
      formula: String.raw`M_{kanonis} = f_{disepakati}(D) \qquad \text{selisih} = \frac{|a - b|}{\max(a, b)}`,
      formulaNote:
        "M_kanonis = metrik kanonis: fungsi f yang disepakati, diaplikasikan ke data D. Siapa pun yang memanggil f(D) mendapat angka sama. Selisih = ukuran inkonsistensi dua definisi a dan b — di kasus kita (2760 vs 1740), selisihnya 37%.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: self-service = semua orang query langsung ke data mentah",
        body: "Itu bukan self-service, itu bunuh diri data. Self-service yang sehat = semua orang bebas eksplorasi DI ATAS dataset dan definisi yang sudah tersertifikasi. Kebebasan di lapisan konsumsi, disiplin di lapisan definisi. Tanpa disiplin itu, tiap analis adalah \u201Ctim A vs tim B\u201D yang menunggu terjadi.",
      },
    },
    {
      id: "kapan-chaos",
      eyebrow: "Langkah 4 · Kapan membantu vs chaos",
      title: "Kapan self-service membantu, kapan jadi chaos",
      prose: [
        "Cara membaca diagram: kiri — dua tim membaca data mentah yang sama, menghasilkan 2.760 vs 1.740, rapat 2 jam habis untuk definisi. Kanan — satu semantic layer di tengah, kedua tim memanggil definisi sama, angka sama (1.740), rapat 10 menit untuk keputusan.",
        "Interpretasi: biaya inkonsistensi bukan sekadar angka beda — ia adalah jam rapat yang terbakar dan kepercayaan yang terkikis. Setiap kali dua angka berbeda muncul di ruangan, kepercayaan pada data turun selangkah.",
        "Self-service MEMBANTU ketika: pertanyaan bisnis beragam dan tak terduga; tim data kecil (bottleneck); pengguna paham domainnya; ada dataset certified. Self-service menjadi CHAOS ketika: tidak ada definisi kanonis; data mentah kotor; pengguna buta domain; tidak ada yang me-review query penting.",
        "💡 Intuisi kunci: ukur kematangan self-service dengan \u201Crasio pertanyaan terjawab tanpa tim data\u201D. Di bawah 30% = tim data masih bottleneck (tambah dataset certified). Di atas 80% TANPA semantic layer = anarki (tambah governance). Target sehat: 60-80% dengan definisi terkontrol.",
      ],
      figure: {
        svg: SEMANTIC_SVG,
        alt: "Perbandingan tanpa dan dengan semantic layer: dua angka berbeda vs satu angka sama.",
        caption: "Tanpa semantic layer: 2.760 vs 1.740, rapat 2 jam debat definisi. Dengan: satu angka, rapat 10 menit.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: governance mematikan kecepatan",
        body: "Governance yang benar MEMPERCEPAT: analis tidak perlu menebak definisi, tidak perlu validasi silang ke Finance, tidak perlu menunggu tim data. Yang mematikan kecepatan adalah governance birokratis (formulir 3 lapis untuk satu query). Bedakan: guardrail (otomatis, cepat) vs gerbang (manual, lambat).",
      },
    },
    {
      id: "lab-semantic",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: satu definisi, nol debat",
      prose: [
        "Data 15 order (user, status, amount) tersedia. Tugasmu: (1) hitung `a_rev` (definisi Tim A: semua status) dan `b_rev` (Tim B: paid saja) serta `selisih` relatifnya; (2) daftarkan definisi kanonis di dict `SEMANTIC`, lalu hitung `rev_a2` dan `rev_b2` lewat layer — buktikan keduanya sama; (3) cetak semuanya.",
        "Coba juga: tambah definisi \u201Cactive_users\u201D (distinct user berstatus paid) ke SEMANTIC. Berapa nilainya? Bandingkan dengan definisi Tim A (semua status): 12 vs 7 — selisih 42% untuk metrik yang namanya sama persis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `a_rev`, `b_rev`, `selisih` (relatif thd max)" },
        { id: "t2", text: "Definisikan `SEMANTIC['revenue']`, hitung `rev_a2`, `rev_b2`" },
        { id: "t3", text: "Cetak dan verifikasi `sama = (rev_a2 == rev_b2)`" },
      ],
      expected: "a_rev=2760  b_rev=1740  selisih=0.3696  sama=True",
      note: {
        title: "Sering salah",
        body: "Mendefinisikan SEMANTIC sebagai angka (1740) bukan fungsi. Definisi kanonis harus FUNGSI dari data — supaya saat datanya bertambah besok, definisinya tetap benar tanpa dihitung ulang manual.",
      },
      hints: [
        "a_rev = sum(amount untuk semua order); b_rev = sum(amount where status == 'paid').",
        "selisih = abs(a_rev - b_rev) / max(a_rev, b_rev).",
        "SEMANTIC = {'revenue': lambda orders: sum(a for _, s, a in orders if s == 'paid')}.",
      ],
      code: {
        starter: `# (user, status, amount_rb)\norders = [\n    ("U01","paid",150),("U02","paid",200),("U03","cancelled",150),\n    ("U01","paid",100),("U04","pending",300),("U05","paid",250),\n    ("U06","cancelled",100),("U02","paid",150),("U07","paid",400),\n    ("U08","pending",120),("U09","paid",180),("U10","cancelled",200),\n    ("U03","paid",90),("U11","paid",220),("U12","pending",150),\n]\n\n# TULIS KODEMU\na_rev = 0      # Tim A: semua status\nb_rev = 0      # Tim B: paid saja\nselisih = 0.0\nSEMANTIC = {}\nrev_a2 = 0\nrev_b2 = 0\nsama = False\n\nprint(f"a_rev={a_rev}  b_rev={b_rev}  selisih={selisih:.4f}  sama={sama}")`,
        lockLines: 8,
        solution: `# (user, status, amount_rb)\norders = [\n    ("U01","paid",150),("U02","paid",200),("U03","cancelled",150),\n    ("U01","paid",100),("U04","pending",300),("U05","paid",250),\n    ("U06","cancelled",100),("U02","paid",150),("U07","paid",400),\n    ("U08","pending",120),("U09","paid",180),("U10","cancelled",200),\n    ("U03","paid",90),("U11","paid",220),("U12","pending",150),\n]\n\n# TULIS KODEMU\na_rev = sum(a for _, _, a in orders)                     # Tim A: semua status\nb_rev = sum(a for _, s, a in orders if s == "paid")      # Tim B: paid saja\nselisih = abs(a_rev - b_rev) / max(a_rev, b_rev)\nSEMANTIC = {"revenue": lambda od: sum(a for _, s, a in od if s == "paid")}\nrev_a2 = SEMANTIC["revenue"](orders)\nrev_b2 = SEMANTIC["revenue"](orders)\nsama = (rev_a2 == rev_b2)\n\nprint(f"a_rev={a_rev}  b_rev={b_rev}  selisih={selisih:.4f}  sama={sama}")`,
        checks: [
          { kind: "equal", task: "t1", name: "a_rev", value: 2760, tol: 1e-9, label: "`a_rev` = 2760", msg: "Jumlahkan semua amount tanpa filter status." },
          { kind: "equal", task: "t1", name: "b_rev", value: 1740, tol: 1e-9, label: "`b_rev` = 1740", msg: "Hanya status 'paid'." },
          { kind: "equal", task: "t1", name: "selisih", value: 0.3696, tol: 0.0001, label: "`selisih` = 0.3696", msg: "|2760-1740|/2760." },
          { kind: "equal", task: "t3", name: "sama", value: true, label: "Layer memberi angka sama", msg: "rev_a2 dan rev_b2 harus identik." },
          { kind: "stdout_matches", task: "t3", pattern: "a_rev=2760\\s+b_rev=1740\\s+selisih=0\\.3696\\s+sama=True", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Definisi kanonis = fungsi dari data, bukan angka. lambda untuk definisi satu baris.",
    },    {
      id: "lab2-konformansi-semantik",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: uji konformansi semantic layer",
      prose: [
        "Tiga tim, tiga definisi 'revenue'. Semantic layer menjanjikan satu definisi kanonis — tapi janji harus diuji. Tugasmu: tulis fungsi resolve() yang memetakan definisi tiap tim ke nama kanonis (atau None jika tidak cocok), lalu hitung berapa tim yang patuh.",
        "Marketing ternyata memakai status IN ('paid','refunded') — termasuk refund! Itulah 150 juta selisih yang selama ini diperdebatkan di grup chat.",
        "Coba juga: tambahkan tim 'cs' dengan definisi ('fact_orders', \"status='paid'\", 'SUM(amount)') — ia langsung patuh tanpa diubah. Definisi baku yang baik menular.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `resolve(team)`: kembalikan nama kanonis atau None" },
        { id: "t2", text: "Hitung `patuh`: tim yang resolve ke 'revenue_bersih'" },
        { id: "t3", text: "Isi `liar`: list tim yang tidak cocok definisi baku" },
      ],
      expected: "hasil={'finance': 'revenue_bersih', 'marketing': None, 'ops': 'revenue_bersih'}",
      note: {
        title: "Sering salah",
        body: "Membandingkan string nama tim, bukan tuple definisinya. Yang dibandingkan adalah (dataset, filter, agregasi) — tiga elemennya, persis sama.",
      },
      hints: [
        "Loop SEMANTIC.items(); cocokkan tuple definisi tim dengan tuple baku.",
        "Kembalikan None jika tidak ada yang cocok.",
        "patuh = hitung hasil yang == 'revenue_bersih'.",
      ],
      code: {
        starter: `# Definisi tiap tim: (dataset, filter, agregasi)\nDEFINISI = {\n    "finance":   ("fact_orders", "status='paid'", "SUM(amount)"),\n    "marketing": ("fact_orders", "status IN ('paid','refunded')", "SUM(amount)"),\n    "ops":       ("fact_orders", "status='paid'", "SUM(amount)"),\n}\n# Canonical semantic layer: nama -> definisi baku\nSEMANTIC = {\n    "revenue_bersih": ("fact_orders", "status='paid'", "SUM(amount)"),\n}\n# TULIS KODEMU: patuh, liar\npatuh = 0\nliar = []\n`,
        lockLines: 10,
        solution: `# Definisi tiap tim: (dataset, filter, agregasi)\nDEFINISI = {\n    "finance":   ("fact_orders", "status='paid'", "SUM(amount)"),\n    "marketing": ("fact_orders", "status IN ('paid','refunded')", "SUM(amount)"),\n    "ops":       ("fact_orders", "status='paid'", "SUM(amount)"),\n}\n# Canonical semantic layer: nama -> definisi baku\nSEMANTIC = {\n    "revenue_bersih": ("fact_orders", "status='paid'", "SUM(amount)"),\n}\n\n# TULIS KODEMU: resolve, patuh, liar\ndef resolve(team):\n    d = DEFINISI[team]\n    for nama, baku in SEMANTIC.items():\n        if d == baku:\n            return nama\n    return None\n\nhasil = {t: resolve(t) for t in DEFINISI}\npatuh = sum(1 for v in hasil.values() if v == "revenue_bersih")\nliar = [t for t, v in hasil.items() if v is None]\n\nprint(f"hasil={hasil}")\nprint(f"patuh={patuh}  liar={liar}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "patuh", value: 2, label: "`patuh` = 2", msg: "finance dan ops cocok definisi baku." },
          { kind: "equal", task: "t3", name: "liar", value: ["marketing"], label: "`liar` = [marketing]", msg: "Marketing memakai filter refund." },
        ],
      },
      reference: "Pencocokan tuple definisi: inti cara kerja metric layer (dbt Semantic Layer, LookML).",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Definisi yang tidak bisa dieksekusi oleh mesin bukan definisi — itu puisi. 'Revenue = penjualan bersih' tidak bisa diuji; (fact_orders, status='paid', SUM(amount)) bisa.",
        "💡 Uji termurah semantic layer: minta dua tim menghitung metrik yang sama dari layer yang sama tanpa bicara dulu. Sama = layer bekerja. Beda = ada yang bypass.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: self-service butuh dua zona — taman bermain dan jalan tol",
        body: "Self-service BI yang berhasil selalu punya dua zona dengan aturan main berbeda — dan kegagalan terbesar adalah mencampuradukkan keduanya. Zona pertama: taman bermain. Di sini analis bebas mengutak-atik data mentah, mencoba definisi sendiri, membuat eksperimen berantakan. Tidak ada yang boleh mempublikasikan dari sini ke manajemen. Zona kedua: jalan tol. Dataset tersertifikasi, definisi terkunci di semantic layer, angka yang keluar dari sini boleh dipakai di rapat direksi. Aturan sakralnya satu kalimat: analisis boleh dimulai di mana saja, tetapi yang ditampilkan ke pengambil keputusan harus berasal dari jalan tol. Heuristik operasionalnya: dari 200 pengguna, biasanya hanya 15–25 yang butuh akses publish ke zona tersertifikasi; sisanya cukup taman bermain plus konsumsi. Memberi semua orang kunci jalan tol = kembali ke 200 definisi revenue yang berbeda. Jebakan yang sering terjadi ada dua arah: tim data terlalu protektif sehingga jalan tol-nya kosong (analis frustrasi, kembali ke spreadsheet liar), atau terlalu longgar sehingga jalan tol-nya penuh sampah (kepercayaan runtuh). Uji kesehatannya sederhana: hitung berapa keputusan manajemen bulan ini yang memakai angka dari zona tersertifikasi. Nol = jalan tol-mu tidak dipakai; semua = taman bermain-mu mati. Keduanya adalah kegagalan — yang pertama kegagalan adopsi, yang kedua kegagalan kebebasan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: seberapa bebas self-service-nya",
      prose: [
        "Skenario 1 — Startup 20 orang, satu tim data, pertanyaan tak terduga tiap hari. → Self-service penuh di atas SATU dataset certified. Definisi ditulis di Notion + sebagai kode.",
        "Skenario 2 — Korporasi 2000 orang, data sensitif (gaji, kesehatan). → Self-service bertingkat: dataset public (bebas), restricted (approval), raw (tim data saja). Row-level security wajib.",
        "Skenario 3 — Metrik keuangan yang masuk laporan resmi. → Certified only: hanya definisi tersertifikasi yang boleh dipakai; perubahan definisi lewat review. Eksperimen bebas di sandbox, bukan di angka resmi.",
        "Skenario 4 — Pengguna non-teknis (operasional lapangan). → Guided self-service: template + parameter (pilih kota, pilih bulan), bukan query bebas. Kebebasan secukupnya.",
        "Skenario 5 — Tidak ada tim data sama sekali. → Mulai dari semantic layer minimal: 10 metrik inti terdefinisi sebagai kode. Jangan beli tools mahal dulu — definisi dulu, tools kemudian.",
        "Aturan praktis 10 detik: tanya \u201Ckalau dua orang menghitung metrik yang sama, apakah hasilnya pasti sama?\u201D Tidak → bangun semantic layer dulu, baru buka keran self-service.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: rollout 200 orang tanpa chaos",
      prose: [
        "PT SinarJaya (200 karyawan) ingin self-service. Kondisi awal: 47 spreadsheet beredar, 3 definisi \u201Cactive user\u201D, tim data (4 orang) menghabiskan 15 jam/minggu menjawab \u201Ctolong hitungkan X\u201D dan 6 jam/minggu rekonsiliasi angka beda.",
        "Rollout 3 fase: (1) Bekukan 12 metrik inti ke semantic layer (2 minggu, pemilik tiap metrik ditunjuk). (2) Buka dataset certified untuk 40 power user + training 2 jam. (3) Perluas ke 200 orang dengan template guided; query bebas hanya untuk yang lulus sertifikasi internal.",
        "Hasil setelah 3 bulan: request ad-hoc ke tim data turun 15 → 4 jam/minggu; insiden \u201Cangka beda\u201D turun 6 → 1 per bulan; 62% pertanyaan terjawab mandiri. Kuncinya bukan tools mahal — melainkan 12 definisi yang disepakati SEBELUM keran dibuka.",
        "💡 Intuisi kunci: self-service adalah tentang kepercayaan, bukan tools. Kepercayaan dibangun oleh konsistensi (angka selalu sama), bukan oleh banyaknya fitur drag-and-drop.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang self-service BI dan semantic layer.",
      ],
      tasks: [],
      summary: [
        "Semantic layer = definisi metrik sebagai kode, ditulis sekali, dipakai semua orang.",
        "Self-service sehat: bebas di konsumsi, disiplin di definisi.",
        "Definisi yang baik bisa dieksekusi dan diuji — bukan paragraf opini.",
        "Ukur kematangan dengan rasio pertanyaan terjawab mandiri (target 60-80%).",
        "Governance yang benar mempercepat (guardrail otomatis), bukan birokrasi.",
      ],
      next: { label: "BI7 — Data Storytelling untuk Eksekutif", href: "/v2/learn/biz7-storytelling" },
      quiz: [
        {
          q: "Marketing: 2.760, Finance: 1.740, data sama. Akar masalahnya?",
          options: [
            { text: "Datanya kotor", why: "Datanya identik — 15 baris yang sama." },
            { text: "Tidak ada definisi kanonis yang dieksekusi bersama", why: "Tepat: dua definisi implisit berbeda tanpa kontrak bersama.", correct: true },
            { text: "Tim Marketing tidak bisa SQL", why: "Keduanya menghitung dengan benar menurut definisinya." },
            { text: "Kurang dashboard", why: "Menambah dashboard menambah definisi liar baru." },
          ],
        },
        {
          q: "Kenapa definisi kanonis harus berupa fungsi/kode, bukan dokumen?",
          options: [
            { text: "Supaya terlihat canggih", why: "Bukan soal gengsi." },
            { text: "Kode bisa dieksekusi dan diuji — dokumen hanya dibaca (dan dilupakan)", why: "Tepat: definisi sebagai kode menjamin semua pemanggil mendapat hasil identik.", correct: true },
            { text: "Dokumen tidak bisa dibagikan", why: "Dokumen mudah dibagikan; masalahnya ia tidak mengikat eksekusi." },
            { text: "Kode lebih pendek", why: "Panjang bukan kriterianya." },
          ],
        },
        {
          q: "Rasio pertanyaan terjawab mandiri 85% TANPA semantic layer. Artinya?",
          options: [
            { text: "Sukses besar", why: "Tanpa definisi bersama, 85% itu kemungkinan besar 85% angka yang tidak konsisten." },
            { text: "Anarki — segera bangun definisi kanonis", why: "Tepat: kemandirian tanpa kontrak makna = tiap orang punya kebenarannya sendiri.", correct: true },
            { text: "Tim data bisa dibubarkan", why: "Justru tim data dibutuhkan untuk membangun layer-nya." },
            { text: "Tidak ada masalah", why: "Ada: inkonsistensi yang belum terdeteksi." },
          ],
        },
        {
          q: "Metrik keuangan untuk laporan resmi. Kebijakan akses yang tepat?",
          options: [
            { text: "Bebas untuk semua orang", why: "Angka resmi yang bisa dihitung siapa saja dengan definisi bebas = risiko pelaporan." },
            { text: "Certified only + perubahan lewat review", why: "Tepat: angka resmi butuh kontrol perubahan.", correct: true },
            { text: "Hanya tim data yang boleh lihat", why: "Terlalu ketat — menghambat keputusan yang butuh angka itu." },
            { text: "Dilarang dihitung ulang", why: "Tidak realistis dan tidak sehat." },
          ],
        },
        {
          q: "Guardrail vs gerbang birokrasi. Contoh guardrail yang baik?",
          options: [
            { text: "Formulir persetujuan 3 lapis untuk tiap query", why: "Itu gerbang — lambat dan mematikan." },
            { text: "Dataset certified + definisi terkunci otomatis + template guided", why: "Tepat: otomatis, cepat, tetap terkontrol.", correct: true },
            { text: "Larangan total query ad-hoc", why: "Membunuh nilai self-service." },
            { text: "Semua query harus lewat tim data", why: "Itu bottleneck, bukan self-service." },
          ],
        },
        {
          q: "Dua tim menghitung 'revenue' dari semantic layer yang sama tapi hasilnya beda. Kemungkinan terbesar?",
          options: [
            { text: "Salah satu tim bypass layer dan query tabel mentah", why: "Tepat dan paling sering: layer-nya benar, tapi seseorang 'cepat-cepat' query langsung. Uji konformansi (lab 2) menangkap ini — definisi liar tidak resolve ke kanonis.", correct: true },
            { text: "Semantic layer-nya pasti bug", why: "Mungkin, tapi jarang: layer yang sama memberi hasil sama untuk definisi sama. Beda hasil + definisi sama = ada yang tidak lewat layer." },
            { text: "Database corrupt", why: "Corrupt tidak memilih-milih tim. Gejalanya acak, bukan sistematis per tim." },
            { text: "Wajar — revenue memang relatif", why: "Relatif antar definisi, ya; tapi dari layer yang SAMA harus identik. 'Wajar' adalah cara menyerah." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Lineage: 3 definisi -> 1 kanonis -> konsumen.
const LINEAGE_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Tiga definisi revenue disatukan menjadi satu definisi kanonis.">
<g font-family="var(--font-ui)" font-size="11">
<rect x="20" y="40" width="130" height="56" rx="8" fill="var(--bg-app)" stroke="var(--c2)" stroke-width="1.5"/>
<text x="85" y="62" text-anchor="middle" fill="var(--text)" font-weight="600">Sales</text>
<text x="85" y="80" text-anchor="middle" fill="var(--c2)" font-weight="700">2.550</text>
<text x="85" y="92" text-anchor="middle" fill="var(--text-muted)">semua order</text>
<rect x="20" y="112" width="130" height="56" rx="8" fill="var(--bg-app)" stroke="var(--c3)" stroke-width="1.5"/>
<text x="85" y="134" text-anchor="middle" fill="var(--text)" font-weight="600">Finance</text>
<text x="85" y="152" text-anchor="middle" fill="var(--c3)" font-weight="700">1.300</text>
<text x="85" y="164" text-anchor="middle" fill="var(--text-muted)">paid − refund</text>
<rect x="20" y="184" width="130" height="56" rx="8" fill="var(--bg-app)" stroke="var(--c4)" stroke-width="1.5"/>
<text x="85" y="206" text-anchor="middle" fill="var(--text)" font-weight="600">Product</text>
<text x="85" y="224" text-anchor="middle" fill="var(--c4)" font-weight="700">2.350</text>
<text x="85" y="236" text-anchor="middle" fill="var(--text-muted)">paid + pending</text>
<rect x="210" y="100" width="140" height="80" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="280" y="126" text-anchor="middle" fill="var(--text)" font-weight="700" font-size="12">METRIC LAYER</text>
<text x="280" y="146" text-anchor="middle" fill="var(--text-muted)">revenue_net v2</text>
<text x="280" y="164" text-anchor="middle" fill="var(--c1)" font-weight="700" font-size="13">1.300 kanonis</text>
<rect x="400" y="60" width="100" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="450" y="78" text-anchor="middle" fill="var(--text)">Board</text>
<text x="450" y="94" text-anchor="middle" fill="var(--text-muted)">laporan</text>
<rect x="400" y="118" width="100" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="450" y="136" text-anchor="middle" fill="var(--text)">Dashboard</text>
<text x="450" y="152" text-anchor="middle" fill="var(--text-muted)">semua tim</text>
<rect x="400" y="176" width="100" height="44" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="450" y="194" text-anchor="middle" fill="var(--text)">Bonus</text>
<text x="450" y="210" text-anchor="middle" fill="var(--text-muted)">SDM</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5">
<line x1="150" y1="68" x2="208" y2="115"/><line x1="150" y1="140" x2="208" y2="140"/><line x1="150" y1="212" x2="208" y2="165"/>
<line x1="350" y1="115" x2="398" y2="82"/><line x1="350" y1="140" x2="398" y2="140"/><line x1="350" y1="165" x2="398" y2="198"/>
</g>
<text x="260" y="262" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Tiga definisi masuk, satu definisi kanonis keluar — dipakai semua konsumen.</text>
</svg>`;

export const biz11: V2Lesson = {
  slug: "biz11-governance",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI11 — Governance: Satu Definisi Metrik",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Perang definisi \u201Crevenue\u201D",
      prose: [
        "Rapat board PT SinarJaya. Slide CEO: revenue 2.550. Slide CFO: 1.300. Slide CPO: 2.350. Tiga angka untuk kata yang sama, selisih 96% dari angka terkecil. 45 menit rapat habis untuk debat definisi — 0 menit untuk strategi.",
        "Ketiganya benar: Sales menghitung semua order (gross bookings), Finance menghitung paid minus refund (net revenue), Product menghitung paid + pending (expected revenue). Masalahnya bukan angka — melainkan tidak ada yang memutuskan mana yang resmi untuk apa.",
        "Twist-nya: solusinya bukan \u201Cpilih satu, buang dua\u201D. Ketiga definisi LEGITIM untuk kegunaannya masing-masing. Yang dibutuhkan adalah registrasi: tiap definisi bernama, berversi, berpemilik — dan SATU ditandai kanonis untuk pelaporan resmi.",
        "Di lesson ini kamu akan bisa: (1) menulis definisi metrik formal; (2) membangun metric layer dengan versioning; (3) menetapkan tier governance per metrik; (4) mengelola perubahan definisi tanpa memecah kepercayaan.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menegakkan governance metrik tanpa menjadi birokrasi.",
        "(1) Menulis definisi metrik sebagai (dataset, filter, agregasi, versi) yang bisa dieksekusi;",
        "(2) Meresolusi versi definisi yang berlaku pada tanggal laporan — dan mendeteksi tren yang patah diam-diam;",
        "(3) Menerapkan tier governance: Tier 1 untuk angka yang menentukan uang orang, Tier 3 untuk eksplorasi;",
        "(4) Menjelaskan kenapa menyimpan definisi sebagai fungsi (bukan angka snapshot) adalah fondasi.",
      ],
      tasks: [],
    },

    {
      id: "definisi-formal",
      eyebrow: "Langkah 3 · Definisi formal",
      title: "Definisi metrik = dataset + filter + agregasi + versi",
      prose: [
        "Definisi yang bisa dieksekusi punya 5 komponen: NAMA (revenue_net), DATASET (orders), FILTER (status='paid'), AGREGASI (SUM(amount - refund)), VERSI + PEMILIK (v2, Finance, disetujui 2026-09-01). Hilang satu = definisi belum lengkap.",
        "Contoh formal: revenue_net v2 = SUM(amount − refund) WHERE status='paid' ON orders, pemilik Finance. Siapa pun, kapan pun, menjalankan definisi ini pada DATA YANG SAMA mendapat 1.300 — tidak ada ruang interpretasi soal DEFINISI. Tapi reproduksi tidak dijamin fungsi saja: bila data bertambah atau terkoreksi (retur masuk belakangan, order baru), angkanya berubah; yang dijamin fungsi adalah definisinya, bukan angkanya. Untuk reproduksi penuh, simpan juga snapshot data + versi data.",
        "Versioning: definisi BERUBAH (v1 memasukkan pending → v2 tidak). Tanpa versi, tren historis patah diam-diam: \u201Crevenue turun 20%\u201D padahal yang berubah definisinya. Aturan: perubahan definisi = versi baru + changelog + tanggal efektif + restatement opsional.",
        "Kepribadian: metric layer adalah \u201Csi konstitusi\u201D — ia tidak melarang definisi lain, ia mencatat semuanya dan menetapkan mana yang resmi. Amandemen boleh, tapi tercatat dan diumumkan.",
        "💡 Intuisi kunci: setiap metrik yang masuk slide board WAJIB punya kartu definisi 5 komponen. Tidak ada kartu = tidak naik ke board. Aturan sederhana ini membunuh 90% perang definisi.",
      ],
      formula: String.raw`M = (D, F, A, V, O) \qquad \text{revenue\_net}_{v2} = \sum_{\text{paid}} (\text{amount} - \text{refund})`,
      formulaNote:
        "M = metrik: D = dataset, F = filter, A = agregasi, V = versi, O = owner. Contoh: revenue_net v2 = jumlah (amount − refund) untuk order paid = 1.300. Ganti satu komponen (mis. F memasukkan pending) = definisi berbeda = versi berbeda.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: satu metrik = satu definisi untuk semua keperluan",
        body: "Gross bookings (sales), net revenue (finance), expected revenue (product) semuanya sah — untuk keputusan berbeda. Governance bukan menyeragamkan menjadi satu definisi, melainkan MENCATAT semuanya dan menandai mana yang kanonis untuk pelaporan resmi. Penyeragaman paksa justru mematikan analisis yang sah.",
      },
    },
    {
      id: "metric-layer",
      eyebrow: "Langkah 4 · Metric layer",
      title: "Metric layer: dari tiga kebenaran ke satu kanonis",
      prose: [
        "Cara membaca: tiga kotak kiri = tiga definisi yang hidup di tiga tim (2.550 / 1.300 / 2.350). Kotak tengah = metric layer: ketiganya terdaftar berversi, dan revenue_net v2 (1.300) ditandai kanonis. Tiga kotak kanan = konsumen (board, dashboard, bonus) — semuanya membaca dari kanonis.",
        "Interpretasi: tanpa layer, tiap konsumen memilih definisinya sendiri → tiga angka di satu rapat. Dengan layer, perbedaan definisi tetap ada (dan terdokumentasi), tapi angka resmi cuma satu. Perang definisi berubah menjadi diskusi versi yang tercatat.",
        "Siklus hidup definisi: usulkan → review (pemilik + konsumen) → uji dampak historis (berapa tren berubah?) → umumkan + tanggal efektif → versi lama di-deprecate (bukan dihapus — histori butuh dia).",
        "💡 Intuisi kunci: uji dampak historis adalah langkah yang paling sering dilewatkan. Hitung ulang 12 bulan terakhir dengan definisi baru SEBELUM meluncurkan — jika tren berubah > 5%, siapkan narasi penjelasan untuk board.",
      ],
      figure: {
        svg: LINEAGE_SVG,
        alt: "Diagram lineage: tiga definisi revenue masuk metric layer, satu kanonis keluar ke konsumen.",
        caption: "Metric layer: tiga definisi terdaftar berversi; satu ditandai kanonis dan dipakai semua konsumen.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: governance = komite yang melambatkan",
        body: "Governance metrik yang baik 90%-nya otomatis: registrasi sebagai kode, CI yang menolak definisi tanpa versi/pemilik, changelog otomatis. Komite manusia hanya untuk sengketa definisi — yang justru jarang terjadi kalau registrasinya disiplin.",
      },
    },
    {
      id: "lab-metric",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: daftarkan, versikan, kanonisasi",
      prose: [
        "Data 8 order (dengan refund dan pending) tersedia. Tugasmu: (1) hitung `rev_a` (semua), `rev_b` (paid − refund), `rev_c` (paid + pending); (2) daftarkan ketiganya ke `METRICS` dengan versi dan pemilik, tandai `kanonis = 'revenue_net_v2'`; (3) hitung `rev_official` dari definisi kanonis dan cetak.",
        "Coba juga: simulasikan perubahan definisi — buat v3 yang mengeluarkan juga order < Rp100rb (de minimis). Berapa dampaknya ke tren? Itulah uji dampak historis dalam bentuk mini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rev_a`, `rev_b`, `rev_c`" },
        { id: "t2", text: "Bangun `METRICS` berversi + `kanonis`" },
        { id: "t3", text: "Hitung `rev_official`, cetak" },
      ],
      expected: "rev_a=2550 rev_b=1300 rev_c=2350 official=1300 (revenue_net_v2)",
      note: {
        title: "Sering salah",
        body: "Menyimpan definisi sebagai ANGKA (1300) bukan fungsi. Metric layer menyimpan FUNGSI + metadata — supaya saat data bertambah, definisi tetap dieksekusi ulang dengan benar, bukan angka basi yang di-copy-paste.",
      },
      hints: [
        "rev_a = sum semua amount; rev_b = sum(amount - refund) where paid; rev_c = sum(amount) where paid/pending.",
        "METRICS = {'revenue_gross_v1': {'fn': ..., 'owner': 'Sales'}, ...}.",
        "rev_official = METRICS[kanonis]['fn'](orders).",
      ],
      code: {
        starter: `# (order_id, amount_rb, status, refund_rb)\norders = [("O1",500,"paid",0),("O2",300,"paid",0),("O3",200,"cancelled",0),\n          ("O4",450,"paid",450),("O5",150,"paid",0),("O6",600,"pending",0),\n          ("O7",250,"paid",0),("O8",100,"paid",0)]\n\n# TULIS KODEMU\nrev_a = 0  # Sales: gross bookings (semua)\nrev_b = 0  # Finance: net (paid - refund)\nrev_c = 0  # Product: expected (paid + pending)\nMETRICS = {}\nkanonis = ""\nrev_official = 0\n\nprint(f"rev_a={rev_a} rev_b={rev_b} rev_c={rev_c} official={rev_official} ({kanonis})")`,
        lockLines: 4,
        solution: `# (order_id, amount_rb, status, refund_rb)\norders = [("O1",500,"paid",0),("O2",300,"paid",0),("O3",200,"cancelled",0),\n          ("O4",450,"paid",450),("O5",150,"paid",0),("O6",600,"pending",0),\n          ("O7",250,"paid",0),("O8",100,"paid",0)]\n\n# TULIS KODEMU\nrev_a = sum(a for _, a, _, _ in orders)\nrev_b = sum(a - r for _, a, s, r in orders if s == "paid")\nrev_c = sum(a for _, a, s, _ in orders if s in ("paid", "pending"))\nMETRICS = {\n    "revenue_gross_v1": {"fn": lambda od: sum(a for _, a, _, _ in od), "owner": "Sales"},\n    "revenue_net_v2": {"fn": lambda od: sum(a - r for _, a, s, r in od if s == "paid"), "owner": "Finance"},\n    "revenue_expected_v1": {"fn": lambda od: sum(a for _, a, s, _ in od if s in ("paid", "pending")), "owner": "Product"},\n}\nkanonis = "revenue_net_v2"\nrev_official = METRICS[kanonis]["fn"](orders)\n\nprint(f"rev_a={rev_a} rev_b={rev_b} rev_c={rev_c} official={rev_official} ({kanonis})")`,
        checks: [
          { kind: "equal", task: "t1", name: "rev_a", value: 2550, tol: 1e-9, label: "`rev_a` = 2550", msg: "Semua order termasuk cancelled dan pending." },
          { kind: "equal", task: "t1", name: "rev_b", value: 1300, tol: 1e-9, label: "`rev_b` = 1300", msg: "Paid minus refund (O4: 450-450=0)." },
          { kind: "equal", task: "t1", name: "rev_c", value: 2350, tol: 1e-9, label: "`rev_c` = 2350", msg: "Paid + pending." },
          { kind: "equal", task: "t3", name: "rev_official", value: 1300, tol: 1e-9, label: "`rev_official` = 1300", msg: "Dari definisi kanonis revenue_net_v2." },
          { kind: "equal", task: "t2", name: "kanonis", value: "revenue_net_v2", label: "Kanonis = revenue_net_v2", msg: "Tandai definisi resmi untuk pelaporan." },
          { kind: "stdout_matches", task: "t3", pattern: "official=1300 \\(revenue_net_v2\\)", label: "`print` menampilkan official", msg: "Samakan format." },
        ],
      },
      reference: "Definisi = fungsi + metadata (versi, owner). Kanonis = penanda, bukan penghapus.",
    },    {
      id: "lab2-definisi-per-tanggal",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: definisi mana yang berlaku kapan",
      prose: [
        "Definisi 'revenue' berubah v1 → v2 pada 1 Juni 2025. Tiga laporan terbit Januari 2025, Juli 2025, dan November 2025 — versi mana yang dipakai tiap laporan? Tugasmu: tulis fungsi resolusi versi-berdasar-tanggal dan audit konsistensinya.",
        "Hasilnya: laporan Januari pakai v1, laporan Juli dan November pakai v2. Tren yang membandingkan ketiganya patah diam-diam di Juni — persis jebakan yang dibahas di lesson ini. (Catatan: draf lama menulis tanggal November sebagai 2024-11-30 — sebelum Januari 2025 — sehingga “Nov pakai v1” itu artefak tanggal yang salah, bukan isi lesson; tanggal yang benar 2025-11-30.)",
        "Coba juga: apa yang harus dilakukan agar tren tidak patah? Restatement: hitung ulang histori dengan v2 (atau bekukan v1 untuk tren lama). Keduanya butuh registry — tanpa registry, restatement mustahil.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `definisi_pada(nama, tgl)`: versi terbaru dengan berlaku_dari ≤ tgl" },
        { id: "t2", text: "Isi `versi_terpakai` untuk tiap tanggal laporan" },
        { id: "t3", text: "Tentukan `konsisten`: True jika semua versi sama" },
      ],
      expected: "versi_terpakai=['v1', 'v2', 'v2']",
      note: {
        title: "Sering salah",
        body: "Memakai versi terbaru untuk SEMUA tanggal ('kan v2 yang paling benar'). Definisi berlaku sesuai tanggal berlakunya — laporan lama memakai definisi lama, kecuali di-restatement eksplisit.",
      },
      hints: [
        "Filter REGISTRY: nama cocok dan berlaku_dari <= tgl; ambil max berlaku_dari.",
        "versi_terpakai = [definisi_pada('revenue', t)[1] for t in TANGGAL_LAPORAN].",
        "konsisten = len(set(versi_terpakai)) == 1.",
      ],
      code: {
        starter: `# Registry metrik berversi: (nama, versi, berlaku_dari, definisi)\nREGISTRY = [\n    ("revenue", "v1", "2024-01-01", "gross"),\n    ("revenue", "v2", "2025-06-01", "net of refund"),\n]\n# Tiga laporan memakai angka revenue pada tanggal berikut:\nTANGGAL_LAPORAN = ["2025-01-15", "2025-07-20", "2025-11-30"]\n# TULIS KODEMU: versi_terpakai, konsisten\nversi_terpakai = []\nkonsisten = True\n`,
        lockLines: 7,
        solution: `# Registry metrik berversi: (nama, versi, berlaku_dari, definisi)\nREGISTRY = [\n    ("revenue", "v1", "2024-01-01", "gross"),\n    ("revenue", "v2", "2025-06-01", "net of refund"),\n]\n# Tiga laporan memakai angka revenue pada tanggal berikut:\nTANGGAL_LAPORAN = ["2025-01-15", "2025-07-20", "2025-11-30"]\n\n# TULIS KODEMU: definisi_pada, versi_terpakai, konsisten\ndef definisi_pada(nama, tgl):\n    cocok = [r for r in REGISTRY if r[0] == nama and r[2] <= tgl]\n    return max(cocok, key=lambda r: r[2])\n\nversi_terpakai = [definisi_pada("revenue", t)[1] for t in TANGGAL_LAPORAN]\nkonsisten = len(set(versi_terpakai)) == 1\n\nprint(f"versi_terpakai={versi_terpakai}")\nprint(f"konsisten={konsisten}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "versi_terpakai", value: ["v1", "v2", "v2"], label: "`versi_terpakai` benar", msg: "Jan→v1, Jul→v2, Nov→v2." },
          { kind: "equal", task: "t3", name: "konsisten", value: false, label: "`konsisten` = False", msg: "Tren patah di Juni." },
        ],
      },
      reference: "Versioned metric registry: resolusi definisi = f(nama, tanggal).",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Governance yang baik tidak terasa seperti rem — ia terasa seperti jalan tol: definisi jelas, rambu lengkap, kamu justru melaju lebih cepat karena tidak perlu berhenti bertanya 'revenue yang mana?'",
        "💡 Versioning definisi adalah asuransi termurah. Tanpa versi, satu perubahan definisi menghapus kemampuanmu membandingkan hari ini dengan tahun lalu — dan tidak ada yang sadar sampai rapat direksi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: metrik tanpa pemilik adalah metrik tanpa masa depan",
        body: "Definisi metrik tanpa nama manusia di belakangnya adalah definisi yang akan mati — biasanya dalam 6 bulan. Ia akan diubah diam-diam oleh seseorang untuk kebutuhan sesaat, tidak ada yang mengumumkan, dan tiga bulan kemudian dua tim bertengkar soal \"revenue\" lagi dari nol. Heuristik praktisinya: setiap metrik kanonis di registry wajib punya tiga hal — nama pemilik (satu orang, bukan tim), tanggal review berikutnya, dan changelog. Pemilik bukan penulis SQL-nya; pemilik adalah orang yang berhak menyetujui perubahan definisi dan wajib mengumumkannya. Tanpa pemilik, versioning definisi hanyalah arsip perubahan tanpa akuntabilitas. Aturan operasionalnya: metrik tanpa pemilik dan tanpa tanggal review = status DRAFT, tidak boleh dipakai di laporan direksi, seberapa pun \"resminya\" kelihatannya. Jebakan yang sering terjadi: ownership diberikan ke \"tim data\" — ketika semua orang pemilik, tidak ada yang merasa perlu mengumumkan perubahan. Satu nama. Selalu satu nama. Uji termurahnya: tunjuk metrik apa pun di dashboard direksi dan tanya \"kalau definisinya mau diubah, siapa yang menandatangani?\" Jawaban \"tidak tahu\" atau \"tim data\" = metrik yatim piatu. Perang definisi tidak pernah dimenangkan oleh dokumentasi yang bagus; ia dimenangkan oleh manusia yang bertanggung jawab atas definisinya. Governance adalah soal orang dulu, sistem kemudian — urutan ini tidak bisa dibalik.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: tier governance per metrik",
      prose: [
        "Skenario 1 — Tier 1 (board, bonus, laporan resmi). → Kartu definisi 5 komponen wajib + review perubahan + uji dampak historis + pemilik bernama. Tidak ada pengecualian.",
        "Skenario 2 — Tier 2 (dashboard operasional, keputusan manajer). → Terdaftar di metric layer, pemilik jelas, perubahan diumumkan. Review ringan.",
        "Skenario 3 — Tier 3 (eksplorasi analis, sandbox). → Bebas — tapi DILARANG naik ke Tier 1/2 tanpa registrasi. Beri label \u201Cexperimental\u201D yang jelas.",
        "Skenario 4 — Metrik baru diusulkan. → Mulai di Tier 3, naik tier setelah 1 kuartal pemakaian stabil + ada pemilik. Jangan langsung Tier 1.",
        "Skenario 5 — Sengketa definisi antar tim. → Bawa ke pemilik metrik + data 12 bulan per definisi; keputusan berbasis dampak, bukan senioritas. Catat sebagai versi, bukan pemenang-kalah.",
        "Aturan praktis 10 detik: tanya \u201Cmetrik ini dipakai untuk keputusan apa?\u201D Bonus/board → Tier 1. Operasional → Tier 2. Eksplorasi → Tier 3. Tier menentukan berat governance-nya.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: perang \u201Cactive user\u201D",
      prose: [
        "Tiga definisi \u201Cactive user\u201D di satu perusahaan: Marketing: login dalam 30 hari (850 ribu). Product: aksi inti dalam 30 hari (420 ribu). Finance: transaksi dalam 30 hari (180 ribu). Board bingung: user kita 850rb atau 180rb?",
        "Resolusi via tier: (1) Daftarkan ketiganya: active_login_v1 (Marketing), active_core_v1 (Product), active_transacting_v1 (Finance). (2) Kanonis untuk board = active_core_v1 — paling dekat dengan value delivery. (3) Bonus tim growth memakai active_transacting (paling dekat dengan revenue). (4) Semua dashboard lama diberi label versi — tidak ada yang diam-diam berubah.",
        "Hasil: board berhenti debat definisi; tiap tim tetap memakai definisi yang relevan untuk kerjanya; tren historis direstatement sekali dengan changelog. Biaya: 2 minggu kerja. Penghematan: 45 menit × 12 rapat/tahun yang kembali menjadi strategi.",
        "💡 Intuisi kunci: \u201Cactive user\u201D adalah metrik paling sering diperangi di industri. Jika perusahaanmu belum punya kartu definisinya, itu PR minggu ini — bukan kuartal depan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang governance metrik. Ingat: catat semua, kanonisasi satu.",
      ],
      tasks: [],
      summary: [
        "Definisi formal = (dataset, filter, agregasi, versi, owner) — hilang satu = belum definisi.",
        "Metric layer: daftarkan semua definisi berversi; tandai satu sebagai kanonis.",
        "Perubahan definisi = versi baru + changelog + uji dampak historis.",
        "Tier governance mengikuti bobot keputusan: board → Tier 1, eksplorasi → Tier 3.",
        "Governance yang baik otomatis (kode + CI), bukan komite lambat.",
      ],
      next: { label: "BI12 — Embedded Analytics", href: "/v2/learn/biz12-embedded" },
      quiz: [
        {
          q: "Tiga angka revenue (2.550 / 1.300 / 2.350) semuanya benar. Solusi governance-nya?",
          options: [
            { text: "Pilih satu, hapus dua lainnya", why: "Tiga angka revenue (2.550/1.300/2.350) lahir dari tiga definisi yang masing-masing sah untuk keperluannya: gross untuk sales, net untuk finance, expected (paid + pending) untuk product. Menghapus dua di antaranya = mematikan analisis yang bergantung padanya. Solusi governance bukan 'satu definisi untuk semua', melainkan 'semua definisi tercatat, satu dikanonisasi'. (Catatan: angka ketiga BUKAN recognized revenue akuntansi — recognized butuh kriteria pengakuan pendapatan, bukan sekadar paid + pending.)" },
            { text: "Daftarkan ketiganya berversi + tandai satu kanonis untuk pelaporan resmi", why: "Tepat: daftarkan ketiga definisi di registry (dataset + filter + agregasi + versi), lalu tetapkan SATU sebagai kanonis untuk pelaporan resmi. Yang lain tetap hidup untuk keperluan spesifiknya — terdokumentasi, berversi, tidak liar. Inilah beda governance vs penyeragaman buta.", correct: true },
            { text: "Rata-ratakan ketiganya", why: "Merata-ratakan gross, net, dan expected menghasilkan angka yang bukan apa-apa: bukan gross, bukan net, bukan expected. Ini kesalahan kategori — seperti merata-ratakan suhu Celsius dan Fahrenheit. Angka 'kompromi' menenangkan rapat tetapi meracuni keputusan." },
            { text: "Serahkan ke tim dengan jabatan tertinggi", why: "Memilih definisi 'punya direktur' = governance berdasarkan kekuasaan, bukan kegunaan. Enam bulan kemudian direktur pindah, definisinya ikut pindah, dan histori menjadi tidak bisa dibandingkan. Kriteria yang benar: definisi mana yang paling tepat untuk keputusan ini — tercatat dan bisa diaudit." },
          ],
        },
        {
          q: "Definisi berubah (v1 → v2). Langkah yang TIDAK boleh dilewatkan?",
          options: [
            { text: "Ganti nama filenya", why: "Mengganti nama metrik di dashboard ('Revenue' → 'Revenue (new)') tanpa mencatat perubahan definisinya = kosmetik. Pengguna mengira trennya kontinu, padahal definisinya patah. Yang substansial: versi baru + tanggal berlaku + restatement histori + pengumuman ke konsumen." },
            { text: "Uji dampak: hitung ulang 12 bulan historis dengan definisi baru", why: "Tepat: langkah yang tidak boleh dilewatkan adalah mencatat versi baru dengan tanggal berlakunya dan me-restatement (atau membekukan) histori — persis lab 2 lesson ini. Tanpa itu, tren Jan–Des membandingkan apel (v1) dengan jeruk (v2) dan tidak ada yang sadar sampai rapat direksi menanyakan 'kenapa Juni anjlok?'.", correct: true },
            { text: "Hapus versi lama", why: "Untuk menghitung ulang histori dengan definisi baru (restatement), kamu butuh definisi lama tercatat rapi: dataset apa, filter apa, agregasi apa. Tanpa registry berversi, restatement mustahil — dan tren historis mati bersama definisi lamanya." },
            { text: "Rahasiakan perubahannya", why: "Mengubah definisi diam-diam lalu berharap tidak ada yang sadar = kebalikan dari governance. Governance = perubahan tercatat, berversi, diumumkan, dengan masa transisi. Diam-diam = setiap konsumen metrik membuat asumsi sendiri-sendiri." },
          ],
        },
        {
          q: "Metrik untuk bonus tahunan. Tier yang tepat?",
          options: [
            { text: "Tier 3 (eksperimental)", why: "Bonus tahunan = uang orang dipertaruhkan = sengketa pasti terjadi. Tier 1 (definisi kanonis, terkunci, berversi, ada pemilik) adalah satu-satunya tier yang tahan sengketa: rumusnya bisa ditunjukkan, historinya bisa diaudit, perubahannya tercatat." },
            { text: "Tier 1: kartu 5 komponen + review + pemilik", why: "Tepat: Tier 1 untuk metrik kompensasi. Alasannya bukan 'penting', melainkan konsekuensi sengketa: dengan Tier 2/3 (definisi longgar), perselisihan bonus menjadi 'katamu vs kataku' tanpa wasit. Tier 1 menyediakan wasitnya: definisi tertulis yang disepakati sebelum periode berjalan.", correct: true },
            { text: "Tanpa tier, asal disepakati lisan", why: "Definisi yang 'sudah disepakati di rapat' tetapi tidak tertulis = tidak ada definisi. Saat bonus dipersoalkan, tiap pihak mengingat versi yang menguntungkannya. Governance Tier 1 menuntut: tertulis, berversi, ditandatangani (secara sistem) sebelum periode." },
            { text: "Tier 2 cukup", why: "Tier 2 (terdokumentasi tapi fleksibel) cukup untuk monitoring operasional harian. Tetapi untuk bonus, fleksibilitas = celah sengketa. Aturannya: semakin besar konsekuensi finansial/hukum metrik, semakin tinggi tier-nya — bonus selalu Tier 1." },
          ],
        },
        {
          q: "Kenapa definisi disimpan sebagai fungsi, bukan angka?",
          options: [
            { text: "Supaya keren", why: "Bukan soal benar/salah moral — ini soal sifat definisi. Angka snapshot ('revenue Jan = 2,5M') membeku; definisi sebagai fungsi ('SUM(amount) WHERE status=paid') hidup: ia bisa dihitung ulang saat data terkoreksi dan diuji kapan pun. Governance butuh yang hidup." },
            { text: "Fungsi dieksekusi ulang di data baru — angka basi saat data bertambah", why: "Tepat: menyimpan definisi sebagai fungsi (dataset + filter + agregasi) berarti angka bisa direproduksi kapan pun dari data mentah — bisa diaudit, bisa di-restatement, bisa diuji konformansinya (lab 2). Angka snapshot tidak bisa diverifikasi ulang; ia hanya bisa dipercaya atau tidak.", correct: true },
            { text: "Angka tidak bisa dibagikan", why: "Angka memang mudah dikirim via chat — tetapi saat data sumber terkoreksi (retur masuk belakangan), angka snapshot basi tanpa pemberitahuan. Definisi sebagai fungsi menghitung ulang otomatis. Kemudahan berbagi bukan alasan menyimpan kebenaran dalam format yang tidak bisa diperbarui." },
            { text: "Fungsi lebih pendek", why: "Kriterianya bukan 'mudah' atau 'biasa dilakukan', melainkan: bisakah definisi ini direproduksi, diaudit, dan dihitung ulang saat data berubah? Fungsi lolos ketiga uji itu; angka snapshot gagal ketiganya." },
          ],
        },
        {
          q: "Sengketa definisi antar tim sebaiknya diselesaikan dengan…",
          options: [
            { text: "Voting", why: "Sengketa definisi bukan pemilihan ketua kelas: suara terbanyak tidak membuat definisi lebih benar — ia hanya membuat pihak kalah diam sementara. Yang menyelesaikan sengketa: bukti (definisi mana yang paling tepat untuk keputusan ini?) + pencatatan (hasilnya di-registry, bukan di ingatan peserta rapat)." },
            { text: "Data dampak 12 bulan per definisi + keputusan pemilik metrik, dicatat sebagai versi", why: "Tepat: adu definisi dengan data — hitung ketiga versi pada dataset yang sama, tunjukkan dampaknya pada keputusan, pilih yang paling selaras dengan tujuan bisnis, lalu catat di registry berversi. 'Berbasis bukti' tanpa 'tercatat' = mengulang debat yang sama tahun depan.", correct: true },
            { text: "Atasan memutuskan sepihak", why: "Memaksakan definisi tim sendiri tanpa menunjukkan perhitungannya = keputusan yang runtuh saat ditantang direksi. Bahkan definisi yang benar pun butuh bukti tertulis agar bertahan — apalagi yang diperdebatkan." },
            { text: "Biarkan masing-masing pakai definisinya", why: "Membiarkan tiap tim memakai definisinya sendiri diam-diam = status quo yang sedang diperdebatkan. Governance tidak menambah masalah; ia memberi nama, versi, dan pemilik pada masalah yang sudah ada — agar bisa diselesaikan, bukan diwariskan." },
          ],
        },
        {
          q: "Definisi revenue v1→v2 berubah 1 Juni. Laporan tren Jan–Des yang benar harus...",
          options: [
            { text: "Pakai v2 untuk semua bulan agar konsisten", why: "Konsisten semu: angka Jan–Mei dihitung ulang dengan definisi yang belum ada saat itu. Itu restatement — sah HANYA jika dihitung ulang eksplisit dan diberi label." },
            { text: "Pakai versi yang berlaku pada tiap bulan, atau restatement eksplisit berlabel", why: "Tepat: tiap titik memakai definisinya pada masanya. Kalau mau satu versi untuk semua, lakukan restatement resmi (hitung ulang + catat), bukan diam-diam.", correct: true },
            { text: "Pakai v1 terus — yang lama lebih aman", why: "'Aman' = menolak perbaikan definisi selamanya. Definisi boleh berevolusi; yang tidak boleh adalah evolusi diam-diam." },
            { text: "Hapus bulan Juni (masa transisi)", why: "Menghapus data = memalsukan tren. Bulan Juni nyata terjadi." },
          ],
        },
      ],
    },
  ],
};

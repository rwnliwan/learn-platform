import type { V2Lesson } from "../lib/types";

const DBTLINE_SVG = `<svg viewBox="0 0 520 274" role="img" aria-label="Lineage dari ref(): lima model membentuk DAG dari staging ke mart.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/><line x1="150" y1="96" x2="500" y2="96"/><line x1="150" y1="136" x2="500" y2="136"/><line x1="150" y1="176" x2="500" y2="176"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">stg_orders</text><rect x="150" y="20" width="116.7" height="18" fill="var(--c1)"/><text x="273" y="35">lapis 1</text>
<text x="140" y="75" text-anchor="end">stg_customers</text><rect x="150" y="60" width="116.7" height="18" fill="var(--c1)"/><text x="273" y="75">lapis 1</text>
<text x="140" y="115" text-anchor="end">int_orders_customers</text><rect x="150" y="100" width="233.3" height="18" fill="var(--c1)"/><text x="389" y="115">lapis 2</text>
<text x="140" y="155" text-anchor="end">mart_revenue</text><rect x="150" y="140" width="350.0" height="18" fill="var(--c1)"/><text x="506" y="155">lapis 3</text>
<text x="140" y="195" text-anchor="end">mart_cohort</text><rect x="150" y="180" width="350.0" height="18" fill="var(--c1)"/><text x="506" y="195">lapis 3</text>
</g>
<text x="150" y="268" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="268" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">lapisan DAG</text>
</svg>`;
export const de16: V2Lesson = {
  slug: "de16-dbt",
  track: "Data Engineer",
  module: "Software Engineering untuk Data",
  title: "DE16 — dbt: Transformasi sebagai Kode",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query 200 baris yang tidak berani disentuh",
      prose: [
        "Di sebuah bank, ada query 200 baris di dalam BI tool — 'query_revenue_final_v2_FINAL'. Ia menghitung revenue. Tidak ada yang tahu persis logikanya; tidak ada yang berani mengubahnya; setiap bulan seseorang meng-copy-paste hasilnya ke Excel. Query itu berusia 4 tahun dan sudah 3 kali 'diperbaiki' oleh orang yang sudah resign.",
        "Suatu hari kolom 'discount' berubah arti di sumber. Query itu tetap jalan — dan salah diam-diam selama 6 minggu. Kerugian: laporan ke direksi salah Rp800 juta. Tidak ada test, tidak ada dokumentasi, tidak ada yang tahu ia bergantung pada kolom apa.",
        "Twist-nya: masalahnya bukan orangnya malas — melainkan tidak ada TEMPAT yang benar untuk logika transformasi. Di BI tool = tidak berversi. Di Excel = tidak teraudit. dbt memberi rumah: transformasi sebagai KODE — berversi (git), teruji (tests), terdokumentasi (docs), dengan dependensi eksplisit (ref()).",
        "Di lesson ini kamu akan bisa: (1) menjelaskan model dbt dan ref() sebagai DAG; (2) menulis test generik (unique, not_null, relationships); (3) membaca lineage dari kode; (4) memakai docs + exposures; (5) memutuskan kapan dbt tepat (dan kapan tidak).",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Menjelaskan filosofi dbt: SQL + software engineering (versioning, testing, docs);",
        "(2) Menulis model dengan ref() dan menjelaskan kenapa ref() > nama tabel mentah;",
        "(3) Menjalankan topological sort: urutan build dari DAG dependensi;",
        "(4) Menulis dan menjalankan generic tests (unique, not_null, relationships, accepted_values);",
        "(5) Menghasilkan dokumentasi dan lineage dari kode — bukan dari wiki terpisah.",
      ],
      tasks: [],
    },
    {
      id: "model-ref",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Model + ref(): DAG yang jujur",
      prose: [
        "Model dbt = satu file SQL = satu tabel/view. ref('stg_orders') = 'tabel hasil model stg_orders' — BUKAN nama tabel fisik. Bedanya fundamental: ref() membangun DAG DEPENDENSI yang dbt pahami (untuk urutan build + lineage), sedangkan nama tabel mentah = string buta.",
        "Contoh langkah-demi-langkah (dari lab 1): mart_revenue me-ref int_orders_customers; int me-ref stg_orders + stg_customers. Topological sort menghasilkan: stg_* dulu (lapis 1), int (lapis 2), mart_* (lapis 3). dbt build MENJALANKAN sesuai urutan ini — otomatis. Tidak ada lagi 'jalankan query ini dulu, baru itu'.",
        "Materialization: table (fisik, cepat dibaca), view (selalu segar, lambat), incremental (hanya baris baru — untuk tabel besar). Pilih per model: mart kecil → table; staging → view; fact 100 juta baris → incremental.",
        "💡 Intuisi kunci: ref() adalah kontrak. Mengganti nama tabel fisik tidak merusak apa pun — karena tidak ada yang me-ref nama fisik. Inilah kenapa refactor di dbt aman dan di query 200-baris menakutkan.",
        "Kapan memakai: transformasi SQL yang dipakai >1 orang, berubah >1x setahun, atau menjadi sumber keputusan. Query sekali pakai? Tidak perlu dbt. Query yang hidup? Wajib.",
      ],
      formula: String.raw`\text{Build} = \text{toposort}(G) \quad G = (V=\text{model}, E=\text{ref})`,
      formulaNote:
        "Urutan build = topological sort dari graf dependensi G: vertex = model, edge = ref(). Model dibangun SETELAH semua ref-nya. Siklus (A ref B, B ref A) = error — dan itu BAGUS: siklus = desain yang salah, ditolak mesin.",
      note: {
        title: "🚨 Miskonsepsi: dbt = alat ETL",
        body: "dbt hanya melakukan T (transform) — ia TIDAK mengekstrak atau me-load (itu Airflow/Fivetran). Filosofinya 'ELT': load dulu (mentah ke warehouse), transform kemudian (di warehouse, dengan SQL). dbt = 'T' yang diperlakukan sebagai software: git, test, docs, CI. Menyebutnya ETL = salah memahami posisinya di stack.",
      },
      tasks: [],
    },
    {
      id: "tests",
      eyebrow: "Langkah 4 · Tests",
      title: "Test generik: kontrak untuk tiap model",
      prose: [
        "dbt punya 4 generic test bawaan: unique (tidak ada duplikat — untuk primary key), not_null (wajib isi), relationships (foreign key valid → ada di tabel referensi), accepted_values (hanya nilai yang diizinkan). Ditulis di schema.yml, dijalankan dengan dbt test.",
        "Contoh (dari lab 2): mart_revenue dengan order_id duplikat (id=2 dua kali) + amount null → unique_order_id GAGAL, not_null_amount GAGAL, relationships_customer LOLOS. Dua gagal = pipeline BERHENTI sebelum data kotor mencapai dashboard. Inilah 'quality gate' (DE8/DE14) yang terintegrasi.",
        "Test di dbt = KONTRAK antar model: stg_orders berjanji 'order_id unik' kepada semua yang me-ref-nya. Kontrak dilanggar = bangunannya berhenti. Tanpa test, pelanggaran kontrak ditemukan direksi — 6 minggu kemudian (cerita pembuka).",
        "💡 Intuisi kunci: mulai dari 4 test generik pada SETIAP model (unique + not_null pada key). 10 menit kerja, 80% manfaat. Singular test (SQL custom) hanya untuk logika bisnis spesifik. Jangan menunggu 'test sempurna' — test sederhana yang jalan > test canggih yang tidak ada.",
        "Kapan memakai: unique/not_null untuk SEMUA primary key; relationships untuk SEMUA foreign key; accepted_values untuk kolom status/tipe. Aturannya: jika kolom dipakai untuk JOIN atau filter kritis → ia butuh test.",
      ],
      note: {
        title: "🚨 Miskonsepsi: test dbt memperlambat development",
        body: "Test generik jalan dalam DETIK (query sederhana ke warehouse). Yang memperlambat = (a) tidak ada test → debug 6 minggu seperti cerita pembuka, atau (b) test yang salah tempat (test berat di tiap PR — solusinya test selection, DE15). 'Memperlambat' adalah mitos; yang benar: test memindahkan waktu debug dari produksi (mahal) ke development (murah).",
      },
      tasks: [],
    },
    {
      id: "lineage",
      eyebrow: "Langkah 5 · Visual",
      title: "Lineage yang lahir dari kode",
      prose: [
        "Cara membaca: batang = lapisan DAG. Lapis 1: stg_orders, stg_customers (staging). Lapis 2: int_orders_customers (intermediate). Lapis 3: mart_revenue, mart_cohort (mart). Dependensi mengalir ke kanan via ref().",
        "Interpretasi: lineage ini TIDAK digambar manual — ia DIHASILKAN dari ref() di kode (dbt docs generate). Ubah ref di SQL → lineage ikut berubah otomatis. Inilah beda 'dokumentasi sebagai artefak' vs 'dokumentasi sebagai efek samping kode' (pelajaran DE12).",
        "💡 Intuisi kunci: jika lineage-mu digambar di slide, ia sudah basi. Lineage yang benar = dibangkitkan dari kode (dbt docs, OpenLineage). Satu-satunya dokumentasi yang tidak basi = yang tidak perlu ditulis manual.",
      ],
      figure: {
        svg: DBTLINE_SVG,
        alt: "DAG model dbt: staging (lapis 1) ke intermediate (lapis 2) ke mart (lapis 3).",
        caption:
          "Lineage dari ref(): lima model, tiga lapisan — dihasilkan dari kode, bukan digambar.",
      },
      tasks: [],
    },
    {
      id: "lab-toposort",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: urutan build dari ref()",
      prose: [
        "dbt build harus menjalankan model sesuai dependensi. Diberi MODELS (nama -> daftar ref).",
        "Tugasmu: implementasikan topological sort lapis-per-lapis (Kahn): tiap lapis = model yang semua ref-nya sudah dibangun, diurutkan alfabetis.",
        "Coba juga: tambahkan 'mart_revenue' me-ref 'mart_cohort' dan sebaliknya (siklus). Apa yang terjadi? ValueError 'siklus!' — dan itu BAGUS: dbt menolak desain sirkular.",
        "Hasil: ['stg_customers', 'stg_orders', 'int_orders_customers', 'mart_cohort', 'mart_revenue'] — staging dulu, mart terakhir.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `urutan`: topological sort dari MODELS (lapis per lapis, alfabetis)" },
      ],
      expected: "urutan=['stg_customers', 'stg_orders', 'int_orders_customers', 'mart_cohort', 'mart_revenue']",
      note: {
        title: "Sering salah",
        body: "Mengurutkan alfabetis SEMUA model sekaligus (int_orders_customers sebelum stg_orders!). Alfabetis hanya DALAM lapis yang sama; antar lapis = dependensi dulu.",
      },
      hints: [
        "Loop: siap = model yang semua ref-nya di 'dibangun'.",
        "sorted() tiap lapis untuk deterministik.",
        "Hapus yang sudah dibangun dari sisa; ulangi.",
      ],
      code: {
        starter: `# Model dbt: (nama, [ref yang dipakai])\nMODELS = {\n    "stg_orders": [],\n    "stg_customers": [],\n    "int_orders_customers": ["stg_orders", "stg_customers"],\n    "mart_revenue": ["int_orders_customers"],\n    "mart_cohort": ["int_orders_customers"],\n}\n# TULIS KODEMU: urutan\nurutan = []\n\nprint(f"urutan={urutan}")\n`,
        lockLines: 8,
        solution: `# Model dbt: (nama, [ref yang dipakai])\nMODELS = {\n    "stg_orders": [],\n    "stg_customers": [],\n    "int_orders_customers": ["stg_orders", "stg_customers"],\n    "mart_revenue": ["int_orders_customers"],\n    "mart_cohort": ["int_orders_customers"],\n}\n\n# TULIS KODEMU: urutan (topological sort)\ndibangun = set()\nurutan = []\nsisa = dict(MODELS)\nwhile sisa:\n    siap = sorted(n for n, refs in sisa.items() if all(r in dibangun for r in refs))\n    if not siap:\n        raise ValueError("siklus!")\n    for n in siap:\n        urutan.append(n)\n        dibangun.add(n)\n        del sisa[n]\n\nprint(f"urutan={urutan}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "urutan", value: ["stg_customers", "stg_orders", "int_orders_customers", "mart_cohort", "mart_revenue"], label: "`urutan` benar", msg: "Lapis 1: stg_* (alfabetis); lapis 2: int; lapis 3: mart_*." },
        ],
      },
      reference: "Topological sort (Kahn): urutan build = lapis dependensi.",
    },
    {
      id: "lab-tests",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: test runner mini",
      prose: [
        "Data mart_revenue (sampel 5 baris) mengandung duplikat order_id=2 dan amount null.",
        "Tugasmu: implementasikan 3 generic test dbt (unique, not_null, relationships) dan daftarkan yang gagal.",
        "Hasil: 2 gagal, 1 lolos. Di dbt nyata: dbt test MERAH → pipeline berhenti → data kotor tidak mencapai dashboard. Inilah kontrak yang ditegakkan mesin.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan 3 generic test → `hasil` (dict test -> bool)" },
        { id: "t2", text: "Isi `gagal`: test yang tidak lolos (urutkan)" },
      ],
      expected: "gagal=['not_null_amount', 'unique_order_id']",
      note: {
        title: "Sering salah",
        body: "Menghitung unique dari SEMUA kolom: baris 2 dan 5 memang identik penuh — (2,102,300) muncul 2× — tetapi itu kebetulan data sampel ini. Test unique yang benar tetap pada KOLOM KEY (order_id): dua baris boleh identik total tanpa melanggar unique jika key-nya berbeda, dan dua baris yang berbeda total tetap melanggar unique jika key-nya sama.",
      },
      hints: [
        "unique: len(ids) == len(set(ids)).",
        "not_null: all(r[2] is not None).",
        "relationships: all(r[1] in CUSTOMERS).",
      ],
      code: {
        starter: `# Data mart_revenue (sampel): (order_id, customer_id, amount)\nMART = [\n    (1, 101, 500), (2, 102, 300), (3, 101, 200),\n    (4, 103, None), (2, 102, 300),  # duplikat order_id=2, null amount\n]\nCUSTOMERS = [101, 102, 103]\n# TULIS KODEMU: hasil, gagal\nhasil = {}\ngagal = []\n\nprint(f"hasil={hasil}")\nprint(f"gagal={gagal}")\n`,
        lockLines: 6,
        solution: `# Data mart_revenue (sampel): (order_id, customer_id, amount)\nMART = [\n    (1, 101, 500), (2, 102, 300), (3, 101, 200),\n    (4, 103, None), (2, 102, 300),  # duplikat order_id=2, null amount\n]\nCUSTOMERS = [101, 102, 103]\n\n# TULIS KODEMU: hasil (dict test -> lolos?)\nids = [r[0] for r in MART]\nhasil = {\n    "unique_order_id": len(ids) == len(set(ids)),\n    "not_null_amount": all(r[2] is not None for r in MART),\n    "relationships_customer": all(r[1] in CUSTOMERS for r in MART),\n}\ngagal = sorted(k for k, v in hasil.items() if not v)\n\nprint(f"hasil={hasil}")\nprint(f"gagal={gagal}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "gagal", value: ["not_null_amount", "unique_order_id"], label: "`gagal` benar", msg: "Duplikat id=2 + amount null." },
          { kind: "stdout_matches", task: "t1", pattern: "'relationships_customer': True", label: "relationships lolos", msg: "Semua customer_id ada di CUSTOMERS." },
        ],
      },
      reference: "Generic tests: unique, not_null, relationships — kontrak antar model.",
    },
    {
      id: "docs",
      eyebrow: "Langkah 8 · Dokumentasi",
      title: "Docs & exposures: dokumentasi yang tidak basi",
      prose: [
        "dbt docs generate = website dokumentasi + lineage graph DARI KODEMU: deskripsi model (dari schema.yml), definisi kolom, test, dependensi. Tidak ada wiki terpisah yang basi — karena sumbernya = kode yang sama dengan yang di-build.",
        "Exposures = 'model ini dipakai oleh ...' (dashboard X, laporan Y). Gunanya: saat mengubah mart_revenue, dbt tahu 3 dashboard terdampak — dan CI bisa memberi tahu pemiliknya. Lineage tidak berhenti di warehouse; ia sampai ke konsumen.",
        "Contoh schema.yml minimal: model mart_revenue + columns: order_id (tests: [unique, not_null], description: '...') + description model. 20 baris YAML = dokumentasi + test + kontrak sekaligus.",
        "Aturan: deskripsi ditulis untuk model MART (yang dibaca analis) dan kolom kunci. Staging? Cukup test-nya. Dokumentasi mengikuti pembaca — bukan perfeksionisme.",
        "💡 Intuisi kunci: dokumentasi yang ditulis terpisah dari kode = dokumentasi yang basi. dbt memaksa keduanya di tempat yang sama (schema.yml di samping model SQL). Kedekatan fisik = kedekatan temporal.",
      ],
      tasks: [],
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 ref() > nama tabel. Selalu. Nama tabel mentah di model = string buta: tidak ada lineage, tidak ada urutan build, refactor menakutkan. ref() = kontrak yang dipahami mesin.",
        "💡 Test generik dulu (unique, not_null), singular test kemudian. 4 test bawaan pada tiap key = 80% manfaat dengan 10 menit kerja. Jangan menunggu test 'sempurna'.",
        "💡 Satu model = satu tanggung jawab. Model 500 baris yang 'melakukan semuanya' = query 200-baris dengan baju baru. Pecah: staging (bersihkan) → intermediate (gabung) → mart (sajikan).",
      ],
      tasks: [],
      note: {
        title: "Intuisi: incremental tanpa unique key adalah mesin duplikat",
        body: "Model incremental adalah tempat kepercayaan dbt paling sering mati diam-diam. Kedengarannya efisien — \"hanya proses data baru\" — tetapi tanpa unique key yang benar, ia adalah mesin duplikat yang rajin: setiap run menumpuk baris yang sama, angka mengembang pelan-pelan, dan tidak ada error apa pun. Heuristik praktisi: setiap model incremental wajib menjawab tiga pertanyaan sebelum merge — apa unique key-nya, apa logika idempotennya (run dua kali sama dengan hasil sama), dan bagaimana strateginya menangani data yang datang terlambat. Jebakan keduanya: strategi merge yang salah untuk pola data — delete plus insert untuk snapshot harian boleh, tetapi untuk event stream butuh merge by key. Aturan test-nya bertingkat: 4 generic test bawaan — unique, not_null, accepted_values, relationships — pada setiap key memberi sekitar 80 persen manfaat dengan 10 menit kerja; pasang dulu, baru pikirkan singular test yang canggih. Dan soal materialization: view untuk eksplorasi, table untuk yang dibaca sering, incremental hanya untuk yang besar DAN bertambah — incremental untuk tabel 50 ribu baris adalah kompleksitas tanpa manfaat. Satu model, satu tanggung jawab: staging membersihkan, intermediate menggabungkan, mart menyajikan — model 500 baris yang \"melakukan semuanya\" hanyalah query 200-baris dengan baju baru.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: dbt atau bukan?",
      prose: [
        "Skenario 1 — Transformasi SQL dipakai >1 orang / >1x setahun. → dbt. Alasan: versioning + test + docs membayar untuk logika yang hidup.",
        "Skenario 2 — Query sekali pakai (analisis ad-hoc). → SQL biasa, tidak perlu dbt. Alasan: overhead model/test/docs tidak sebanding untuk sekali pakai.",
        "Skenario 3 — Tabel fact 100 juta baris, refresh harian. → dbt INCREMENTAL. Alasan: full refresh tiap hari = mahal; incremental hanya baris baru.",
        "Skenario 4 — Butuh Python (ML feature, API). → dbt + Python model (atau orchestrator). Alasan: dbt inti = SQL; Python untuk yang tidak bisa SQL.",
        "Skenario 5 — Tim 1 orang, pipeline 3 tabel. → dbt TETAP (atau minimal pola dbt: ref + test). Alasan: 'kecil' hari ini = 'query 200-baris' 4 tahun lagi. Kebiasaan baik murah di awal.",
        "Aturan praktis 10 detik: tanya 'apakah query ini akan dibaca orang lain 6 bulan lagi?' Ya → dbt (model + test + docs). Tidak → SQL biasa cukup.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: Rp800 juta dari kolom yang berubah arti",
      prose: [
        "Bank MajuJaya, 2026. Query 200-baris 'revenue_final_v2_FINAL' di BI tool. Kolom 'discount' di sumber berubah arti (dari 'potongan' menjadi 'potongan SETELAH pajak'). Query tetap jalan — dan salah diam-diam 6 minggu. Laporan direksi salah Rp800 juta. Tidak ada test, tidak ada yang tahu query bergantung pada kolom apa.",
        "Dengan dbt, skenarionya berbeda: (a) contract test pada stg (accepted_values/skema) menangkap perubahan arti di hari PERTAMA; (b) lineage menunjukkan query mana yang memakai kolom discount; (c) exposures memberi tahu 3 dashboard terdampak. 6 minggu → 1 hari.",
        "Angka konkretnya: 200 baris SQL tanpa test = Rp800 juta salah lapor + 6 minggu. Investasi dbt: 2 minggu setup (Rp30 juta) + test generik 10 menit/model. Payback: insiden pertama yang dicegah.",
        "Pembahasan: masalahnya bukan 'orang malas' — melainkan tidak ada RUMAH untuk transformasi. dbt = rumah: berversi, teruji, terdokumentasi. Query yang hidup tanpa rumah = query yang akan menghantuimu.",
        "💡 Intuisi kunci: setiap 'query_final_v2_FINAL' adalah dbt yang belum lahir. Jika kamu melihatnya, jangan diejek — beri rumah.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "dbt = transformasi (T) sebagai kode: SQL + git + test + docs; ref() membangun DAG.",
        "Urutan build = topological sort; siklus = error (desain salah).",
        "Generic tests (unique, not_null, relationships) = kontrak antar model, 10 menit kerja.",
        "Materialization: table/view/incremental — pilih berdasar ukuran dan frekuensi.",
        "Docs + exposures: lineage dari kode sampai ke konsumen — tidak ada wiki yang basi.",
      ],
      next: { label: "DE17 — Backfill & Replay yang Aman", href: "/v2/learn/de17-backfill" },
      quiz: [
        {
          q: "Kenapa ref('stg_orders') lebih baik dari menulis 'db.raw_orders' langsung di model?",
          options: [
            { text: "Lebih pendek diketik", why: "Bukan soal ketikan — soal makna. ref() membangun DAG yang dipahami mesin." },
            { text: "ref() membangun dependensi eksplisit: urutan build + lineage otomatis", why: "Tepat: dbt TAHU mart_revenue bergantung pada stg_orders → build berurutan (lab 1) + lineage di docs. Nama tabel mentah = string buta: tidak ada urutan, tidak ada lineage, refactor menakutkan.", correct: true },
            { text: "Lebih cepat di warehouse", why: "Kecepatan query tidak berubah — yang berubah = keandalan pipeline." },
            { text: "Requirement dbt", why: "'Requirement' bukan argumen. Argumennya = dependensi eksplisit vs implisit." },
          ],
        },
        {
          q: "Model dengan order_id duplikat + amount null. Test generik yang menangkap?",
          options: [
            { text: "accepted_values", why: "Untuk nilai kategorikal (status). Bukan untuk duplikat/null." },
            { text: "unique pada order_id + not_null pada amount", why: "Tepat (lab 2): unique menangkap duplikat id=2; not_null menangkap amount null. Dua test, 10 detik runtime, menghentikan data kotor sebelum dashboard.", correct: true },
            { text: "relationships", why: "Untuk foreign key (customer_id → customers). Tidak menangkap duplikat/null di tabel ini." },
            { text: "Tidak ada — butuh singular test", why: "Generic test cukup untuk kasus ini. Singular test untuk logika bisnis spesifik." },
          ],
        },
        {
          q: "Kapan memakai materialization incremental?",
          options: [
            { text: "Selalu — paling canggih", why: "'Selalu' salah: incremental menambah kompleksitas (unique_key, strategi merge). Untuk tabel kecil, table biasa lebih sederhana dan cukup." },
            { text: "Tabel besar yang di-refresh berkala — hanya proses baris baru", why: "Tepat: fact 100 juta baris + refresh harian = full refresh mahal tiap hari. Incremental: hanya baris baru/berubah. Syarat: unique_key + filter waktu yang benar.", correct: true },
            { text: "Tidak pernah — terlalu rumit", why: "Untuk tabel besar, full refresh tiap hari = tagihan raksasa. 'Rumit' < 'mahal'." },
            { text: "Hanya untuk staging", why: "Staging biasanya view (selalu segar) atau table kecil. Incremental untuk fact besar." },
          ],
        },
        {
          q: "Dua model saling me-ref (A ref B, B ref A). Respons dbt?",
          options: [
            { text: "Jalan dengan urutan alfabetis", why: "Alfabetis mengabaikan dependensi — bukan cara dbt bekerja." },
            { text: "Error: siklus terdeteksi — dan itu benar", why: "Tepat: siklus = desain salah (tidak ada urutan build yang valid). dbt MENOLAK — mesin yang menolak desain buruk adalah fitur, bukan bug. Perbaiki: pecah menjadi 3 model atau gabungkan.", correct: true },
            { text: "Jalan dua-duanya paralel", why: "Paralel tidak menyelesaikan siklus: A butuh B yang butuh A. Mustahil." },
            { text: "Ambil yang pertama saja", why: "Mengabaikan dependensi = hasil salah. Jangan." },
          ],
        },
        {
          q: "Apa itu exposures dan kenapa penting?",
          options: [
            { text: "Iklan untuk model", why: "Bukan iklan — 'exposure' = keterpaparan/ketergantungan." },
            { text: "Catatan 'model ini dipakai oleh dashboard X' — lineage sampai ke konsumen", why: "Tepat: exposures menutup loop lineage: dari sumber → model → KONSUMEN (dashboard/laporan). Saat mengubah mart_revenue, kamu tahu 3 dashboard terdampak + siapa pemiliknya. Tanpa exposures, lineage berhenti di warehouse.", correct: true },
            { text: "Test tambahan", why: "Bukan test — ini metadata ketergantungan hilir." },
            { text: "Backup model", why: "Bukan backup. Ini peta dampak." },
          ],
        },
      ],
    },
  ],
};

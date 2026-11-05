import type { V2Lesson } from "../lib/types";


const SETUP_SCD = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE dim_nasabah_scd (
  sk_id INTEGER PRIMARY KEY,
  id_alami INTEGER,
  nama TEXT,
  segmen TEXT,
  berlaku_dari TEXT,
  berlaku_sampai TEXT,
  is_current INTEGER
)""")
data_scd = [
    (1, 1, 'Andi', 'retail', '2024-01-01', '2025-06-30', 0),
    (2, 1, 'Andi', 'prioritas', '2025-07-01', '9999-12-31', 1),
    (3, 2, 'Budi', 'retail', '2024-01-01', '9999-12-31', 1),
    (4, 3, 'Citra', 'mikro', '2024-01-01', '2024-12-31', 0),
    (5, 3, 'Citra', 'retail', '2025-01-01', '9999-12-31', 1),
]
cur.executemany("INSERT INTO dim_nasabah_scd VALUES (?,?,?,?,?,?,?)", data_scd)
db.commit()`;

const TAIL_SCD = `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`;

export const c16: V2Lesson = {
  slug: "c16-data-modeling",
  track: "SQL",
  module: "Engineering",
  title: "C16 Data Modeling: Star Schema & Analitik Modern",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-12join",
      eyebrow: "Langkah 1 · Star schema",
      title: "Query yang butuh 12 JOIN",
      prose: [
        "Analis baru menulis laporan “NPL per segmen” — query-nya butuh 12 JOIN melintasi database transaksional yang dinormalisasi. Query lambat, sulit dibaca, dan tiap analis menulis versinya sendiri — angka beda-beda! Solusinya: data warehouse dengan star schema — data dimodelkan untuk analisis (bukan untuk transaksi), ditambah dbt (transformasi sebagai kode + test).",
        "12 JOIN bukan salah — ia gejala: data dimodelkan untuk transaksi (cepat tulis), bukan untuk analisis (cepat baca). Star schema terlihat “redundan” bagi insinyur database — tapi redundansi yang disengaja inilah yang membuat analis 10× produktif. Normalisasi sempurna = transaksi bahagia, analis tersiksa. Desain yang benar tergantung siapa yang bertanya.",
        "Dua dunia: OLTP = transaksi (kecil, banyak, cepat; skema ternormalisasi 3NF; contoh core banking). OLAP = analisis (besar, sedikit, kompleks; star schema; contoh data warehouse, dashboard). Aturan praktis: jangan analisis langsung di database produksi! Query beratmu bisa memperlambat transaksi nasabah — analisis di warehouse/replika, selalu.",
      ],
      tasks: [],
      reference: "OLTP (3NF, transaksi) vs OLAP (star, analisis). Analisis di warehouse, bukan produksi.",
    },
    {
      id: "fact-dimensi",
      eyebrow: "Langkah 2 · Fact & dimension",
      title: "Grain, measures, dimensi",
      prose: [
        "Fact table = kejadian terukur (transaksi, pencairan kredit): kunci asing + measures (jumlah, plafon). Dimension = konteks (nasabah, waktu, produk): atribut deskriptif. Contoh: `fact_transaksi(transaksi_id, nasabah_key, waktu_key, jumlah, kategori)` + `dim_nasabah(nasabah_key, nama, kota, segmen)` + `dim_waktu`. Query NPL per segmen per bulan: 1 fact + 2 dim = 2 JOIN — bukan 12!",
        "Grain = “1 baris = apa?” — keputusan desain terpenting! (1 baris = 1 transaksi.) Salah grain = salah segalanya. Star vs snowflake: star = dimensi langsung (denormalisasi, JOIN sedikit — untuk analis); snowflake = dimensi dinormalisasi lagi (hemat, JOIN banyak). Star untuk analis. Dan `dim_waktu` (tabel kalender: tanggal → hari/bulan/kuartal/libur) = wajib di setiap warehouse!",
        "Tiga pertanyaan sebelum modeling: (1) grain-nya apa? (2) measures-nya apa? (3) dipotong (slice) berdasar dimensi apa? Jawab tiga ini = 80% desain selesai.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Denormalisasi = desain buruk.” Di OLTP ya; di OLAP justru desain yang benar! Tujuan beda: OLTP hemat update, OLAP hemat JOIN. Menilai star schema dengan kacamata normalisasi = salah alamat.",
      },
      quiz: [
        {
          q: "Grain = ?",
          options: [
            { text: "Jumlah baris", why: "Salah." },
            { text: "“1 baris = apa?” — keputusan desain terpenting", why: "Benar. Salah grain = salah segalanya.", correct: true },
            { text: "Ukuran storage", why: "Salah." },
          ],
        },
        {
          q: "Star vs snowflake?",
          options: [
            { text: "Sama", why: "Salah." },
            { text: "Star = dimensi langsung (untuk analis); snowflake = dinormalisasi (hemat, JOIN banyak)", why: "Benar. Star = kemudahan analis.", correct: true },
            { text: "Star lebih hemat storage", why: "Salah — star justru redundan (denormalisasi). Hemat bukan tujuannya." },
          ],
        },
      ],
      reference: "Fact = measures + FK; dim = konteks; grain dulu; star untuk analis.",
    },
    {
      id: "scd",
      eyebrow: "Langkah 3 · SCD",
      title: "Dimensi yang berubah",
      prose: [
        "Nasabah pindah Jakarta → Bandung. Bagaimana catatnya? SCD-1: timpa (overwrite) — untuk koreksi salah input; histori tak penting. SCD-2: baris baru + tanggal berlaku — histori penting! (kota saat transaksi). SCD-3: kolom 'nilai_lama' — jarang, hanya butuh 1 versi lama.",
        "SCD-2: `dim_nasabah(key, id_alami, kota, berlaku_dari, berlaku_sampai, is_current)` — Andi: (1, 1, 'Jakarta', 2020-01-01, 2026-05-31, 0), (2, 1, 'Bandung', 2026-06-01, 9999-12-31, 1). “Transaksi 2025 per kota” — kota saat transaksi atau kini? SCD-2 menjawab benar. Tanpa SCD, histori tertimpa = analisis historis salah! Fact menunjuk surrogate key (bukan id alami) — agar versi histori tepat; key = identitas stabil, nama = label yang bisa berubah.",
      ],
      tasks: [],
      quiz: [
        {
          q: "SCD-2 dipakai saat?",
          options: [
            { text: "Koreksi typo", why: "Salah — itu SCD-1 (timpa saja)." },
            { text: "Histori perubahan penting (kota saat transaksi)", why: "Benar. Versi + tanggal berlaku + surrogate key.", correct: true },
            { text: "Selalu", why: "Salah — SCD-2 ada harganya (dimensi membesar)." },
          ],
        },
        {
          q: "Mengapa fact table menyimpan key (surrogate), bukan nama kota langsung?",
          options: [
            { text: "Agar hemat ketikan", why: "Salah — bukan itu alasannya." },
            { text: "Nama bisa berubah; key stabil dan membedakan versi SCD-2; join integer lebih cepat", why: "Benar. Key = identitas stabil; nama = label yang bisa berubah.", correct: true },
            { text: "Tidak ada alasan", why: "Salah — tiga alasan di opsi benar." },
          ],
        },
      ],
      reference: "SCD-1 timpa (koreksi); SCD-2 versi baru (histori penting); surrogate key di fact.",
    },
    {
      id: "elt-dbt",
      eyebrow: "Langkah 4 · ELT + dbt",
      title: "Analitik modern",
      prose: [
        "ELT (Extract-Load-Transform): muat data mentah dulu (murah, cloud), transformasi di dalam warehouse — kebalikan ETL lama (transform sebelum load). dbt (data build tool) = standar industri: transformasi sebagai kode SQL + test + dokumentasi. Model dbt = SELECT biasa dengan `{{ ref('fact_kredit') }}` — ref = dependency graph otomatis (dbt tahu urutan jalan + lineage!).",
        "Test (C15!) = bagian dari model — pipeline gagal jika test gagal. Dokumentasi = dari kode — definisi NPL satu tempat, konsisten! Alur modern: sumber → (Fivetran/Airbyte) → warehouse (BigQuery/Snowflake) → dbt (staging → mart) → BI (dashboard). Hafalkan 5 langkah ini — ia menjawab “jelaskan modern data stack” di interview. “Analytics engineer” = role terpanas; dbt di hampir semua lowongan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "dbt {{ ref() }} berguna untuk?",
          options: [
            { text: "Styling", why: "Salah." },
            { text: "Dependency graph otomatis + lineage", why: "Benar. dbt tahu urutan & asal-usul data.", correct: true },
            { text: "Enkripsi", why: "Salah." },
          ],
        },
        {
          q: "Model dbt mart_npl tidak boleh punya kota NULL dan NPL negatif. Di mana test-nya ditulis?",
          options: [
            { text: "Diingat di kepala analis", why: "Salah — itu cara lama yang gagal." },
            { text: "Di file YAML model — dijalankan setiap dbt build/test", why: "Benar. Test sebagai kode: pipeline menolak lanjut jika gagal.", correct: true },
            { text: "Di dashboard", why: "Salah — dashboard menampilkan, bukan memvalidasi." },
          ],
        },
      ],
      reference: "ELT + dbt: SQL + test + lineage sebagai kode = standar modern.",
    },
    {
      id: "minicase-12join",
      eyebrow: "Langkah 5 · Mini-case",
      title: "12 JOIN menjadi star",
      prose: [
        "Situasi: laporan “NPL per kota per segmen” butuh 12 JOIN di OLTP; 3 analis menulis 3 versi; angka beda 5%. Tugas: (1) rancang star schema-nya (fact, dims, grain); (2) tulis query versi star; (3) jelaskan ke CTO 3 kalimat: kenapa investasi modeling worth it?",
        "Pembahasan: (1) `fact_kredit` (grain: 1 baris/fasilitas; measures: plafon, dpd, kolektibilitas) + `dim_nasabah` (kota, segmen) + `dim_waktu`. (2) `SELECT n.kota, n.segmen, SUM(CASE WHEN f.kolektibilitas>=3 THEN f.plafon END)/SUM(f.plafon) FROM fact_kredit f JOIN dim_nasabah n ... GROUP BY 1,2;` — 1 JOIN! (3) “Satu definisi NPL, satu tempat — 3 analis dapat angka sama. Query 12 JOIN jadi 1; laporan yang tadinya 2 hari jadi 2 jam. Investasi 2 minggu modeling menghemat ratusan jam analis per tahun.”",
        "Pelajaran: modeling = konsistensi + kecepatan. “Single source of truth” bukan jargon — ia selisih 5% yang hilang.",
      ],
      tasks: [],
      reference: "Modeling memindahkan kompleksitas dari query-time ke design-time.",
    },
    {
      id: "intuisi-modeling",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Model yang bagus membuat query yang benar menjadi query yang mudah",
      prose: [
        "Ujian sesungguhnya sebuah model data bukan diagramnya — melainkan query tersulit yang harus ditulis di atasnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: rancang dari query tersulit, bukan dari entitasnya",
        body: "Kesalahan klasik modeling dimulai dari pertanyaan “entitas apa saja yang ada?” — hasilnya skema yang rapi di diagram tetapi membutuhkan 12 JOIN untuk satu laporan. Praktisi senior membaliknya: tulis dulu 3 query tersulit yang harus dijawab model ini (“NPL per kota per segmen per bulan, bisa di-drill ke fasilitas”), lalu rancang skema yang membuat ketiganya SEDERHANA. Bila query tersulitmu butuh 12 JOIN, modelmu salah — bukan querynya. Heuristik kedua: grain adalah kontrak — “1 baris = 1 apa?” harus bisa dijawab dalam satu kalimat oleh semua orang; bila dua analis menjawab berbeda, modelmu ambigu dan angka mereka akan berbeda. Dan heuristik ketiga: dimensi yang berubah (kota, segmen nasabah) harus dirancang untuk berubah SEJAK HARI PERTAMA — SCD bukan fitur tambahan, melainkan asumsi dasar; tabel dimensi tanpa riwayat adalah janji bahwa bisnis tidak akan pernah berubah, janji yang pasti diingkari.",
      },
      reference: "Rancang dari query tersulit; grain satu kalimat; dimensi dirancang untuk berubah.",
    },
    {
      id: "scd-pit",
      eyebrow: "Langkah 7 · SCD lanjut",
      title: "SCD-2 yang benar: overlap, gap, dan kebenaran point-in-time",
      prose: [
        "SCD-2 terlihat sederhana — tambah baris baru tiap ada perubahan — sampai tiga penyakit muncul di data nyata. Pertama, OVERLAP: dua baris versi untuk nasabah yang sama dengan rentang yang tumpang tindih (berlaku_sampai versi lama tidak di-update saat versi baru masuk). Akibatnya query as-of mengembalikan DUA baris untuk satu nasabah pada tanggal yang sama — dan COUNT DISTINCT nasabah-mu tiba-tiba lebih besar dari kenyataan. Pencegahannya adalah constraint/validasi saat load: untuk tiap id_alami, rentang [berlaku_dari, berlaku_sampai) antar versi tidak boleh tumpang tindih — cek dengan self-join anti-overlap di pipeline, gagalkan load bila melanggar.",
        "Kedua, GAP: ada tanggal di mana TIDAK ADA versi yang berlaku (versi lama berakhir 30 Juni, versi baru mulai 5 Juli). As-of join pada 2 Juli mengembalikan NULL — nasabah “hilang” dari laporan 3 hari tanpa jejak. Konvensi yang benar: versi baru selalu mulai tepat saat versi lama berakhir (rantai kontinu), dan versi aktif memakai sentinel jauh (9999-12-31), bukan NULL — karena perbandingan dengan NULL butuh logika khusus yang mudah salah. Validasi load: untuk tiap id_alami, berlaku_dari versi N+1 harus SAMA dengan berlaku_sampai versi N.",
        "Ketiga, anakronisme di fact table: fact menyimpan sk_id (surrogate key) — dan kunci inilah yang menentukan “versi dimensi mana yang dipakai”. Dua pola: fact menunjuk ke versi yang berlaku SAAT EVENT (transaksi 2024-03 memakai sk versi retail Andi) — benar untuk analisis “kondisi saat itu”; vs fact selalu menunjuk versi TERKINI — benar untuk “bagaimana portofolio terlihat hari ini”. Keduanya valid, menjawab pertanyaan berbeda — bencana terjadi bila satu fact table mencampur keduanya tanpa dokumentasi. Aturan: pilih satu semantik per fact table, tulis di dokumentasi model, dan jangan pernah biarkan analis menebak.",
        "Dua konsep dimensi yang memisahkan junior dari senior: degenerate dimension — atribut seperti nomor invoice yang tidak punya tabel dimensi sendiri (tidak ada atribut tambahan) sehingga disimpan langsung di fact; memaksakannya jadi dimensi adalah over-engineering. Dan conformed dimension — dim_waktu / dim_nasabah yang SAMA dipakai oleh SEMUA fact table; inilah yang membuat “NPL per segmen” dari fact_kredit cocok dengan “penyaluran per segmen” dari fact_pencairan. Tanpa conformed dimension, tiap fact punya definisi segmen sendiri dan angka tidak pernah cocok — masalah “selisih 5%” yang terkenal itu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“is_current = 1 berarti data hari ini.” Hanya bila pipeline berjalan sempurna. Setelah load gagal semalam, is_current menunjuk ke versi basi — dan laporan “posisi terkini” diam-diam memakai data kemarin. Jangan percaya flag; percaya pada MAX(berlaku_dari) per id_alami, atau lebih baik: monitor pipeline-nya. Flag adalah cache, bukan kebenaran.",
      },
      reference: "SCD-2 sehat = tanpa overlap, tanpa gap, sentinel 9999-12-31; fact pilih satu semantik versi.",
    },
    {
      id: "lab-scd-asof",
      eyebrow: "Langkah 8 · Lab SCD",
      title: "Lab: query as-of atas dimensi yang berubah",
      prose: [
        "Tabel dim_nasabah_scd sudah dimuat: tiap nasabah punya beberapa VERSI baris dengan rentang berlaku (berlaku_dari, berlaku_sampai). Andi pernah berpindah segmen (retail → prioritas), Citra juga (mikro → retail). Tugasmu: pada tanggal 2024-06-01, segmen apa masing-masing nasabah? Tulis query as-of yang benar — versi yang berlaku pada tanggal itu untuk tiap nasabah.",
        "Coba: setelah lolos, ubah tanggal menjadi 2025-03-15 dan jalankan ulang — segmen siapa yang berubah? Lalu coba query TANPA filter tanggal (hanya WHERE is_current = 1): apa bedanya dengan as-of historis, dan kapan masing-masing benar?",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di variabel `sql`: tampilkan `nama` dan `segmen` yang berlaku pada '2024-06-01', urut nama menaik" },
        { id: "t2", text: "Jalankan dan pastikan 3 baris kembali, dan segmen Citra adalah 'mikro' (bukan 'retail' — itu segmennya SEKARANG)" },
      ],
      expected: "baris: 3\n('Andi', 'retail')\n('Budi', 'retail')\n('Citra', 'mikro')",
      note: {
        title: "Sering salah",
        body: "Query yang hanya memakai is_current = 1 menjawab “segmen hari ini”, bukan “segmen pada 2024-06-01”. Untuk tanggal historis, filter rentang berlaku_dari <= tanggal AND berlaku_sampai > tanggal adalah satu-satunya cara yang benar.",
      },
      hints: [
        "Filter rentang: berlaku_dari <= '2024-06-01' AND berlaku_sampai > '2024-06-01'.",
        "Jangan lupa ORDER BY nama agar urutannya deterministik.",
        "Query-nya: SELECT nama, segmen FROM dim_nasabah_scd WHERE berlaku_dari <= '2024-06-01' AND berlaku_sampai > '2024-06-01' ORDER BY nama",
      ],
      code: {
        starter: SETUP_SCD + TAIL_SCD,
        lockLines: 21,
        solution:
          SETUP_SCD +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama, segmen FROM dim_nasabah_scd
WHERE berlaku_dari <= '2024-06-01' AND berlaku_sampai > '2024-06-01'
ORDER BY nama
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql pada bagian editable." },
          { kind: "contains", task: "t1", name: "sql", value: "berlaku_dari", label: "Query memakai filter as-of", msg: "Query as-of wajib memfilter rentang berlaku_dari/berlaku_sampai — bukan hanya is_current." },
          { kind: "equal", task: "t1", name: "n", value: 3, tol: 1e-9, label: "3 baris kembali", msg: "Satu baris per nasabah yang versinya berlaku pada 2024-06-01." },
          { kind: "stdout_matches", task: "t2", pattern: "\\('Citra', 'mikro'\\)", label: "Citra = 'mikro' (historis)", msg: "Pada 2024-06-01 Citra masih 'mikro' — 'retail' adalah segmennya SEKARANG (is_current). Query historis harus memakai rentang tanggal." },
        ],
      },
      reference: "As-of = berlaku_dari <= t AND berlaku_sampai > t; is_current hanya untuk posisi terkini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "OLTP (transaksi, 3NF) vs OLAP (analisis, star).",
        "Star: fact (measures) + dimensions; grain = keputusan terpenting.",
        "SCD-2: histori perubahan via versi + surrogate key.",
        "ELT + dbt: SQL + test + lineage = standar modern.",
        "Analisis di warehouse, bukan produksi!",
      ],
      next: { label: "C17 — Index & EXPLAIN", href: "/learn/c17-index-explain" },
      quiz: [
        {
          q: "OLTP vs OLAP — yang benar?",
          options: [
            { text: "Sama", why: "Salah — tujuan beda, desain beda." },
            { text: "OLTP = transaksi (normalisasi); OLAP = analisis (star schema)", why: "Benar. Tujuan beda → desain beda.", correct: true },
            { text: "OLTP untuk dashboard", why: "Salah — dashboard baca dari OLAP/warehouse." },
          ],
        },
        {
          q: "Satu fact & tiga dim untuk mart “transaksi fraud per kota per jam”?",
          options: [
            { text: "Fact: dim_kota; dim: transaksi, jam, fraud", why: "Salah — tertukar fact dan dim." },
            { text: "Fact: fact_fraud (nominal, is_fraud, skor); dim: dim_waktu (jam), dim_kota, dim_kartu/segmen", why: "Benar. Fact = kejadian terukur; dim = konteks.", correct: true },
            { text: "Satu tabel cukup", why: "Salah — itu menghilangkan keuntungan star schema." },
          ],
        },
        {
          q: "Kapan SCD-1 (UPDATE langsung) boleh dipakai?",
          options: [
            { text: "Tidak pernah", why: "Salah — ada kasusnya." },
            { text: "Untuk koreksi kesalahan (bukan perubahan dunia nyata)", why: "Benar. Mis. kota salah input “Jakrta” → UPDATE jadi “Jakarta”. Salah ketik = SCD-1; pindah beneran = SCD-2.", correct: true },
            { text: "Selalu", why: "Salah — menghancurkan histori." },
          ],
        },
        {
          q: "Kenapa tidak analisis langsung di database produksi?",
          options: [
            { text: "Tidak bisa", why: "Salah — bisa, tapi berbahaya." },
            { text: "Query berat memperlambat transaksi nasabah", why: "Benar. Analisis di warehouse/replika — selalu.", correct: true },
            { text: "Lebih mahal", why: "Bukan alasan utamanya." },
          ],
        },
        {
          q: "Tiga pertanyaan sebelum modeling?",
          options: [
            { text: "Warna, font, layout", why: "Salah — itu desain visual." },
            { text: "Grain apa? Measures apa? Dipotong berdasar dimensi apa?", why: "Benar. Jawab tiga ini = 80% desain selesai.", correct: true },
            { text: "Server apa? Budget berapa? Deadline kapan?", why: "Salah — itu perencanaan proyek." },
          ],
        },
      ],
    },
  ],
};

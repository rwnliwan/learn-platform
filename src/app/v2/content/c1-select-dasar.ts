import type { V2Lesson } from "../lib/types";

const SETUP = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE nasabah (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kota TEXT,
  penghasilan REAL,
  dpd INTEGER,
  status TEXT
)""")
data_nasabah = [
    (1, 'Andi', 'Jakarta', 8500000, 0, 'lancar'),
    (2, 'Budi', 'Bandung', 12000000, 15, 'lancar'),
    (3, 'Citra', 'Jakarta', 6700000, 45, 'telat'),
    (4, 'Dewi', 'Surabaya', 15000000, 0, 'lancar'),
    (5, 'Eko', 'Jakarta', None, 90, 'macet'),
    (6, 'Fitri', 'Bandung', 9200000, 5, 'lancar'),
    (7, 'Gilang', 'Medan', 7800000, 30, 'telat'),
    (8, 'Hesti', 'Jakarta', 11000000, 0, 'lancar'),
    (9, 'Irfan', 'Surabaya', 5400000, 120, 'macet'),
    (10, 'Joko', 'Medan', 8900000, 0, 'lancar')
]
cur.executemany("INSERT INTO nasabah VALUES (?,?,?,?,?,?)", data_nasabah)
db.commit()`;

const TAIL = `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`;

export const c1: V2Lesson = {
  slug: "c1-select-dasar",
  track: "SQL",
  module: "Fondasi",
  title: "C1 SELECT: Bertanya ke Database dengan Bahasa Manusia",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-select",
      eyebrow: "Langkah 1 · SELECT–FROM–WHERE",
      title: "Satu query mengalahkan 20 menit kerja manual",
      prose: [
        "Manajer cabang memintamu: “Kasih saya data nasabah Jakarta yang penghasilannya di atas 8 juta, urut dari yang terbesar. Saya butuh 5 menit lagi untuk rapat.” Tanpa SQL, kamu membuka Excel 100.000 baris dan memfilter manual — 20 menit dan rawan salah. Dengan SQL, satu query 4 baris menjawab dalam 1 detik, dan bisa dipakai ulang selamanya.",
        "Tapi kecepatan ini pedang bermata dua: query yang salah juga dieksekusi dalam 1 detik ke 100.000 baris, tanpa ada yang sadar. Kecepatan tanpa verifikasi = cara tercepat menyebarkan kesalahan ke seluruh rapat direksi.",
        "Anatomi query dasar: `SELECT` (kolom apa) → `FROM` (dari tabel mana) → `WHERE` (baris mana) → `ORDER BY` (urut bagaimana) → `LIMIT` (berapa baris). Lima kata ini menutupi 80% query sehari-hari. Tabel `nasabah` (10 baris) sudah dimuat di lab — kolomnya `id, nama, kota, penghasilan, dpd, status`.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di variabel `sql`: tampilkan `nama` dan `penghasilan` nasabah Jakarta berpenghasilan > 8000000, urut menurun" },
        { id: "t2", text: "Jalankan dan pastikan 2 baris kembali, baris pertama Hesti" },
      ],
      expected: "baris: 2\n('Hesti', 11000000)\n('Andi', 8500000)",
      note: {
        title: "Sering salah",
        body: "`SELECT *` untuk eksplorasi cepat boleh, tapi di query produksi sebutkan kolom eksplisit — `*` boros, pecah jika skema berubah, dan menyembunyikan maksud query.",
      },
      hints: [
        "Saring kota dengan WHERE kota = 'Jakarta' — string pakai kutip satu.",
        "Urutkan menurun dengan ORDER BY penghasilan DESC.",
        "SELECT nama, penghasilan FROM nasabah WHERE kota = 'Jakarta' AND penghasilan > 8000000 ORDER BY penghasilan DESC",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama, penghasilan FROM nasabah
WHERE kota = 'Jakarta' AND penghasilan > 8000000
ORDER BY penghasilan DESC
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql pada bagian editable." },
          { kind: "equal", task: "t1", name: "n", value: 2, tol: 1e-9, label: "2 baris kembali", msg: "Jakarta dengan penghasilan > 8 juta: Hesti (11jt) dan Andi (8,5jt). Eko tidak lolos karena penghasilannya NULL." },
          { kind: "stdout_matches", task: "t2", pattern: "\\('Hesti', 11000000(\\.0)?\\)", label: "Baris pertama Hesti", msg: "Urutkan menurun dengan ORDER BY penghasilan DESC — Hesti 11 juta harus di atas." },
        ],
      },
      reference: "SELECT kolom FROM tabel WHERE syarat ORDER BY kolom DESC LIMIT n.",
    },
    {
      id: "distinct-alias",
      eyebrow: "Langkah 2 · DISTINCT & alias",
      title: "Merapikan output: unik dan terbaca",
      prose: [
        "`SELECT DISTINCT kota FROM nasabah` membuang duplikat: hasilnya 4 baris (Jakarta, Bandung, Surabaya, Medan), bukan 10. `DISTINCT` untuk pertanyaan “nilai unik apa saja?” — kota apa saja, kategori apa saja.",
        "Alias memberi nama baru ke kolom: `SELECT nama AS nama_nasabah, penghasilan / 1000000 AS gaji_jt FROM nasabah`. Output `gaji_jt` jauh lebih terbaca daripada `penghasilan / 1000000` di laporan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan daftar kota unik dari tabel nasabah" },
        { id: "t2", text: "Jalankan dan pastikan 4 baris kembali" },
      ],
      expected: "baris: 4 (Jakarta, Bandung, Surabaya, Medan)",
      note: {
        title: "Sering salah",
        body: "`DISTINCT` tidak mempercepat query — justru butuh sorting/dedup tambahan. Jangan pakai “untuk jaga-jaga”. Jika hasilmu berduplikat padahal seharusnya tidak, akar masalahnya biasanya JOIN yang fan-out (C5) — `DISTINCT` hanya menutupi gejala.",
      },
      hints: [
        "Satu kata kunci ditambahkan setelah SELECT.",
        "Query-nya: SELECT DISTINCT kota FROM nasabah",
        "Hasilnya 4 baris: Jakarta, Bandung, Surabaya, Medan.",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT DISTINCT kota FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "DISTINCT", label: "Query memakai DISTINCT", msg: "Tambahkan kata kunci DISTINCT setelah SELECT." },
          { kind: "equal", task: "t2", name: "n", value: 4, tol: 1e-9, label: "4 kota unik", msg: "Kota di data: Jakarta, Bandung, Surabaya, Medan — 4 nilai unik." },
        ],
      },
      reference: "DISTINCT untuk nilai unik; AS untuk alias kolom agar terbaca.",
    },
    {
      id: "urutan-eksekusi",
      eyebrow: "Langkah 3 · Urutan eksekusi",
      title: "Ditulis beda, dijalankan beda",
      prose: [
        "Kamu menulis `SELECT` → `FROM` → `WHERE` → `ORDER BY`. Database menjalankan `FROM` → `WHERE` → `SELECT` → `ORDER BY`. Karena alias didefinisikan di `SELECT`, ia tidak bisa dipakai di `WHERE` (WHERE jalan duluan!) — tapi bisa dipakai di `ORDER BY`. Error klasik pemula: `SELECT penghasilan/1000000 AS gaji_jt ... WHERE gaji_jt > 8` → error, karena `gaji_jt` belum ada saat WHERE dieksekusi. Solusinya: ulangi ekspresinya, atau pakai subquery (C6).",
        "Urutan eksekusi ini menjelaskan separuh error “aneh” SQL: kenapa alias tak bisa di WHERE, kenapa agregasi tak bisa di WHERE (butuh `HAVING` — C3), kenapa window function tak bisa di WHERE (C9).",
      ],
      tasks: [],
      quiz: [
        {
          q: "Query: SELECT nama FROM nasabah WHERE gaji_jt > 8 — dengan gaji_jt adalah alias yang didefinisikan di SELECT. Hasilnya?",
          options: [
            { text: "Berhasil", why: "Salah — WHERE dieksekusi sebelum SELECT, jadi alias belum ada saat itu." },
            { text: "Error — alias belum ada saat WHERE dieksekusi", why: "Benar. Urutan eksekusi: FROM → WHERE → SELECT. Ulangi ekspresi aslinya di WHERE, atau pakai subquery (C6).", correct: true },
            { text: "Hasil kosong", why: "Salah — ini error, bukan hasil kosong." },
          ],
        },
        {
          q: "`SELECT nama FROM nasabah WHERE kota = 'Jakarta' LIMIT 5` tanpa ORDER BY. Hasilnya?",
          options: [
            { text: "5 nasabah Jakarta teratas (terbesar)", why: "Salah — tanpa ORDER BY tidak ada konsep “teratas”. Tabel SQL = himpunan, bukan daftar." },
            { text: "5 baris sembarang — tidak dijamin sama tiap dijalankan", why: "Benar. LIMIT tanpa ORDER BY = undian. Untuk laporan konsisten (apalagi pagination), ORDER BY wajib mendampingi LIMIT.", correct: true },
            { text: "Error", why: "Salah — query-nya valid, hanya hasilnya tidak deterministik." },
          ],
        },
        {
          q: "`WHERE kota = 'Jakarta' OR kota = 'Surabaya' AND dpd > 0` — tanpa kurung, artinya?",
          options: [
            { text: "Sama dengan (Jakarta OR Surabaya) AND dpd > 0", why: "Salah — AND diikat lebih dulu, seperti × dalam matematika." },
            { text: "kota = 'Jakarta' OR (kota = 'Surabaya' AND dpd > 0)", why: "Benar. Urutan evaluasi: kurung → AND → OR. Tanpa kurung, semua nasabah Jakarta (dpd berapapun!) ikut lolos. Kurungkan agar maksud eksplisit.", correct: true },
            { text: "Error sintaks", why: "Salah — query valid, hanya maknanya mungkin bukan yang kamu maksud." },
          ],
        },
      ],
      reference: "Eksekusi: FROM → WHERE → SELECT → ORDER BY. Kurung: AND diikat sebelum OR.",
    },
    {
      id: "minicase-collection",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Daftar prioritas collection pagi ini",
      prose: [
        "Tim collection butuh daftar pagi ini: `nama, kota, dpd` nasabah dengan status 'telat' atau 'macet', urut dpd terbesar, 5 teratas saja — untuk ditelepon pertama. Tulis query-nya di kepalamu sebelum membaca pembahasan.",
        "Pembahasan: `SELECT nama, kota, dpd FROM nasabah WHERE status IN ('telat','macet') ORDER BY dpd DESC LIMIT 5;` — hasilnya Irfan (120), Eko (90), Citra (45), Gilang (30).",
        "Sekarang pertanyaan risikonya: apa yang terjadi jika kamu lupa `ORDER BY`? LIMIT 5 tanpa ORDER BY mengambil 5 baris acak (urutan storage) — tim menelepon nasabah yang salah sementara yang macet 120 hari tidak dihubungi. LIMIT tanpa ORDER BY bukan “top” — ia undian.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di collection, urutan daftar = urutan prioritas penagihan. Daftar acak berarti debitur paling bermasalah tidak diprioritaskan — kerugian operasional yang tidak terlihat di query, tapi nyata di angka collection.",
      },
      reference: "WHERE status IN (...) + ORDER BY dpd DESC + LIMIT 5.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Klausa mana untuk apa",
      prose: [
        "Satu kebutuhan, satu klausa. “Saring baris” → `WHERE`. “Saring grup hasil agregat” → `HAVING` (C3). “Daftar nilai unik” → `DISTINCT`. “Kolom terbaca” → alias `AS`. “Urut + batasi” → `ORDER BY` + `LIMIT`, selalu berpasangan agar deterministik. “Filter campuran AND/OR” → kurungkan OR-nya: `WHERE (a OR b) AND c`.",
        "Tiga larangan: jangan `SELECT *` di query produksi; jangan `LIMIT` tanpa `ORDER BY`; jangan `DISTINCT` untuk jaga-jaga — duplikat tak terduga biasanya gejala JOIN fan-out (C5). Dan ingat operator `WHERE`: `<>` (tidak sama), `AND`, `OR`, `NOT`.",
      ],
      tasks: [],
      reference: "WHERE saring baris; DISTINCT unik; alias terbaca; ORDER BY + LIMIT berpasangan.",
    },
    {
      id: "intuisi-select",
      eyebrow: "Langkah 6 · Intuisi",
      title: "SELECT * adalah utang yang jatuh tempo saat skala tiba",
      prose: [
        "Di lab 10 baris, SELECT * tidak pernah menyakitimu — dan justru di situlah bahayanya: ia melatih kebiasaan yang baru menagih saat tabel punya 80 kolom dan 10 juta baris.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: SELECT * hanya untuk jarimu, tidak untuk repomu",
        body: "Begitu query meninggalkan jarimu dan hidup di repo, view, atau ETL, SELECT * menjadi tiga tagihan yang datang belakangan. Pertama, transfer: setiap kolom yang tidak kamu butuhkan tetap menyeberangi jaringan — dan kolom BLOB yang ditambahkan orang lain enam bulan kemudian ikut terbawa tanpa kamu tahu, membuat query lama tiba-tiba 100× lebih berat. Kedua, kerapuhan skema: INSERT tanpa daftar kolom pecah diam-diam saat urutan kolom berubah, dan view yang dibuat dengan SELECT * menyimpan daftar kolom versi lama sehingga kolom baru tidak pernah muncul. Ketiga, kaburnya maksud: SELECT nama, penghasilan mendokumentasikan kebutuhanmu kepada pembaca berikutnya, sedangkan SELECT * tidak berkata apa-apa tentang data apa yang sebenarnya dibutuhkan. Heuristik senior: SELECT * hanya untuk eksplorasi interaktif — intip 5 baris pertama untuk melihat struktur tabel. Untuk segala sesuatu yang disimpan dan dijalankan ulang, tulis kolomnya eksplisit: itu kontrak, bukan gaya penulisan.",
      },
      reference: "Eksplorasi → SELECT * LIMIT 5 boleh. Produksi → kolom eksplisit, selalu.",
    },
    {
      id: "produksi-select",
      eyebrow: "Langkah 7 · Produksi",
      title: "Column pruning dan LIMIT yang jujur",
      prose: [
        "Database modern melakukan column pruning: ia hanya membaca kolom yang kamu minta — tetapi hanya bisa memangkas bila kamu menyebutkannya. Di format kolomnar (Parquet/DuckDB), tabel 50 kolom yang kamu query 3 kolomnya berarti hanya 3 kolom dibaca dari disk; SELECT * memaksa 50 kolom dibaca. Di tabel transaksi 80 kolom tempat dashboard hanya butuh 6, selisihnya 13× lipat data yang menyeberangi jaringan — setiap refresh, setiap hari.",
        "Bahaya kedua lebih licik: kerapuhan terhadap perubahan skema. Tim produk menambahkan kolom foto_produk (BLOB 2 MB) ke tabel transaksi — query SELECT *-mu yang tadinya ringan tiba-tiba menarik 2 MB × N baris tanpa satu baris kode pun berubah. INSERT INTO arsip SELECT * FROM transaksi pecah atau bergeser diam-diam saat urutan kolom berubah. Di Postgres, view yang dibuat dari SELECT * menyimpan daftar kolom pada saat dibuat — kolom baru tidak otomatis muncul, dan kamu baru sadar saat laporan kehilangan data.",
        "Bahaya ketiga: LIMIT tanpa ORDER BY tidak deterministik. LIMIT 10 tanpa ORDER BY artinya “10 baris mana saja” — database bebas mengembalikan 10 baris yang paling murah dibaca, dan jawabannya boleh berbeda setiap eksekusi. Pagination manual (“halaman 1, halaman 2”) di atasnya bisa menampilkan baris yang sama dua kali atau melewatkan baris tanpa peringatan. Ini bukan bug database; ini kontrak yang memang tidak pernah dijanjikan.",
        "Aturan senior: LIMIT selalu ditemani ORDER BY atas kunci yang unik — ORDER BY id LIMIT 10 — baru hasilnya deterministik dan pagination-nya jujur. Dan ingat, ORDER BY atas kolom non-unik (mis. ORDER BY tanggal) masih menyisakan urutan acak di dalam tanggal yang sama; tambahkan tie-breaker (ORDER BY tanggal, id) bila urutan total dibutuhkan. Eksplorasi boleh cepat dan ceroboh; produksi harus eksplisit dan deterministik.",
        "Satu jebakan terakhir yang spesifik untuk analis: UNION dan INSERT bergantung pada POSISI kolom, bukan nama. INSERT INTO arsip SELECT * FROM transaksi hari ini berhasil — enam bulan kemudian kolom baru membuat posisinya bergeser dan query yang sama memasukkan nominal ke kolom tanggal tanpa error. Daftar kolom eksplisit di kedua sisi (INSERT INTO arsip (id, tanggal, nominal) SELECT id, tanggal, nominal ...) adalah kontrak yang melindungi dari pergeseran skema. Prinsip umumnya satu: di produksi, jangan pernah biarkan database menebak maksudmu — sebutkan kolomnya, sebutkan urutannya, sebutkan batasnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“ORDER BY id LIMIT 10 OFFSET 100000 lambat, jadi hapus saja ORDER BY-nya.” Salah arah — yang lambat adalah OFFSET besar (database tetap membaca dan membuang 100.000 baris), bukan ORDER BY-nya. Solusi senior adalah keyset pagination (WHERE id > ? ORDER BY id LIMIT 10), bukan membuang determinisme.",
      },
      reference: "Prune kolom dengan menyebutnya eksplisit; LIMIT tanpa ORDER BY kunci unik = undian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya, termasuk yang salah."],
      tasks: [],
      summary: [
        "Model relasional: tabel = baris × kolom; primary key unik per baris.",
        "Lima kata: SELECT (kolom) → FROM (tabel) → WHERE (baris) → ORDER BY → LIMIT.",
        "Eksekusi: FROM → WHERE → SELECT — alias tak bisa dipakai di WHERE.",
        "DISTINCT untuk unik; alias untuk keterbacaan; jangan keduanya untuk jaga-jaga.",
        "Jangan: SELECT * di produksi; LIMIT tanpa ORDER BY; AND/OR campuran tanpa kurung.",
      ],
      next: { label: "C2 — NULL & Logika", href: "/learn/c2-null-logika" },
      quiz: [
        {
          q: "Urutan EKSEKUSI query yang benar?",
          options: [
            { text: "SELECT → FROM → WHERE", why: "Itu urutan tulis, bukan urutan eksekusi." },
            { text: "FROM → WHERE → SELECT → ORDER BY → LIMIT", why: "Benar. Ini menjelaskan kenapa alias tak bisa dipakai di WHERE.", correct: true },
            { text: "WHERE → SELECT → FROM", why: "Salah — FROM selalu pertama: database harus tahu tabelnya dulu." },
          ],
        },
        {
          q: "Kapan DISTINCT tepat dipakai?",
          options: [
            { text: "Untuk mempercepat query", why: "Salah — DISTINCT butuh sort/dedup, justru menambah kerja." },
            { text: "Untuk jaga-jaga", why: "Salah — duplikat tak terduga biasanya gejala JOIN fan-out (C5); DISTINCT menutupi gejalanya." },
            { text: "Untuk daftar nilai unik (kota/kategori apa saja)", why: "Benar. Itu satu-satunya alasan yang sah.", correct: true },
          ],
        },
        {
          q: "LIMIT 5 tanpa ORDER BY menghasilkan?",
          options: [
            { text: "5 baris acak (urutan storage)", why: "Benar. Tabel = himpunan tanpa urutan alami. Selalu pasangkan dengan ORDER BY.", correct: true },
            { text: "5 terbesar", why: "Salah — “terbesar” butuh ORDER BY DESC yang eksplisit." },
            { text: "Error", why: "Salah — query valid, hasilnya saja tidak deterministik." },
          ],
        },
        {
          q: "`WHERE (a OR b) AND c` vs `WHERE a OR b AND c` — bedanya?",
          options: [
            { text: "Sama saja", why: "Salah — hasilnya bisa beda jauh." },
            { text: "AND dihitung dulu — tanpa kurung artinya a OR (b AND c)", why: "Benar. AND seperti ×, OR seperti +. Kurungkan agar maksud eksplisit.", correct: true },
            { text: "OR dihitung dulu", why: "Salah — yang diikat dulu adalah AND." },
          ],
        },
        {
          q: "Kenapa `SELECT *` berbahaya di query produksi/pipeline?",
          options: [
            { text: "Mengambil kolom tak perlu, pecah jika skema berubah, menyembunyikan maksud query", why: "Benar. Untuk eksplorasi cepat boleh; di kode yang disimpan, sebutkan kolom eksplisit.", correct: true },
            { text: "Selalu error", why: "Salah — ia valid, hanya berisiko." },
            { text: "Tidak ada masalah sama sekali", why: "Salah — tiga risiko di opsi pertama nyata di produksi." },
          ],
        },
      ],
    },
  ],
};

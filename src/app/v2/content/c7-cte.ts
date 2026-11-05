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
cur.executescript("""CREATE TABLE transaksi (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  tanggal TEXT,
  jumlah REAL,
  kategori TEXT,
  channel TEXT
)""")
data_transaksi = [
    (1, 1, '2026-09-01', 500000, 'belanja', 'mobile'),
    (2, 1, '2026-09-03', 250000, 'makan', 'mobile'),
    (3, 2, '2026-09-01', 1000000, 'belanja', 'web'),
    (4, 3, '2026-09-05', 75000, 'makan', 'mobile'),
    (5, 2, '2026-09-10', 2000000, 'travel', 'web'),
    (6, 4, '2026-09-02', 300000, 'belanja', 'mobile'),
    (7, 5, '2026-09-08', 150000, 'makan', 'atm'),
    (8, 3, '2026-09-12', 500000, 'belanja', 'mobile'),
    (9, 1, '2026-09-15', 1200000, 'travel', 'web'),
    (10, 6, '2026-09-20', 80000, 'makan', 'mobile'),
    (11, 7, '2026-09-21', 950000, 'belanja', 'mobile'),
    (12, 2, '2026-09-25', 400000, 'makan', 'web'),
    (13, 8, '2026-09-26', 600000, 'belanja', 'mobile'),
    (14, 9, '2026-09-27', 200000, 'makan', 'atm'),
    (15, 10, '2026-09-28', 350000, 'belanja', 'web')
]
cur.executemany("INSERT INTO transaksi VALUES (?,?,?,?,?,?)", data_transaksi)
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

export const c7: V2Lesson = {
  slug: "c7-cte",
  track: "SQL",
  module: "Fondasi",
  title: "C7 CTE: Beri Nama pada Langkah Berpikirmu",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-query40",
      eyebrow: "Langkah 1 · WITH",
      title: "Query 40 baris yang tak bisa dibaca",
      prose: [
        "Kamu mewarisi query 40 baris: subquery di dalam subquery di dalam subquery — seperti boneka Rusia. Ada bug di tengahnya. Kamu butuh 2 jam hanya untuk paham alurnya. CTE (Common Table Expression) memecahnya menjadi langkah bernama yang berurutan — langkah 1: hitung total per nasabah; langkah 2: tandai yang aktif; langkah 3: gabung dengan kredit. Query yang sama, terbaca dalam 5 menit.",
        "CTE tidak membuat query lebih cepat — seringnya optimizer menghasilkan rencana eksekusi yang sama persis. Yang ia percepat adalah manusia: bottleneck di tim data bukan CPU, melainkan otak analis berikutnya yang membaca query-mu jam 2 pagi sebelum laporan direksi. Keterbacaan = maintainability = uang.",
        "Struktur: `WITH total_trx AS (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id) SELECT n.nama, COALESCE(t.total, 0) FROM nasabah n LEFT JOIN total_trx t ON t.nasabah_id = n.id;` — bisa banyak CTE dipisah koma, berurutan dan bisa saling merujuk. Namai CTE dengan isinya (`total_trx`, bukan `cte1`): nama baik = dokumentasi gratis.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: semua nasabah + total transaksinya memakai CTE bernama `total_trx`" },
        { id: "t2", text: "Jalankan dan pastikan 10 baris kembali, total Budi = 3400000" },
      ],
      expected: "baris: 10; Budi = 3400000 (1jt + 2jt + 400rb)",
      note: {
        title: "Sering salah",
        body: "“CTE selalu lebih lambat dari subquery.” Di database modern, CTE biasanya di-inline seperti subquery (sama cepatnya). Jangan anti-CTE karena mitos performa; ukur dengan EXPLAIN (C17).",
      },
      hints: [
        "WITH total_trx AS (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id).",
        "Lalu SELECT n.nama, COALESCE(t.total, 0) FROM nasabah n LEFT JOIN total_trx t ...",
        "Query utama di akhir memakai semua CTE — alur baca atas ke bawah.",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH total_trx AS (
  SELECT nasabah_id, SUM(jumlah) AS total
  FROM transaksi
  GROUP BY nasabah_id
)
SELECT n.nama, COALESCE(t.total, 0) AS total_trx
FROM nasabah n
LEFT JOIN total_trx t ON t.nasabah_id = n.id
ORDER BY n.id
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "WITH", label: "Query memakai WITH (CTE)", msg: "Definisikan CTE dengan WITH total_trx AS (...)." },
          { kind: "equal", task: "t2", name: "n", value: 10, tol: 1e-9, label: "10 baris kembali", msg: "LEFT JOIN mempertahankan seluruh 10 nasabah." },
          { kind: "stdout_matches", task: "t2", pattern: "\\('Budi', 3400000", label: "Total Budi = 3400000", msg: "Transaksi Budi: 1jt + 2jt + 400rb = 3,4jt." },
        ],
      },
      reference: "WITH nama AS (query) — langkah bernama, berurutan; namai dengan isi, bukan cte1.",
    },
    {
      id: "multistep",
      eyebrow: "Langkah 2 · Multi-step analysis",
      title: "Kekuatan sebenarnya CTE",
      prose: [
        "Contoh NPL ratio per kota ditulis ulang sebagai 3 langkah bernama: `kredit_kota` (join nasabah–kredit) → `ringkas` (agregat per kota) → SELECT final (hitung ratio, urut). Mengapa lebih baik dari subquery bersarang? Tiap langkah bisa di-debug terpisah (`SELECT * FROM ringkas`), CTE bisa dipakai berulang di query utama, dan alur logisnya jelas.",
        "CTE yang dipakai dua kali = DRY: definisi “telat” (`CASE WHEN dpd > 0`) ditulis satu kali di CTE, dipakai di SELECT + GROUP BY. Dengan subquery, kamu mengulang CASE di dua tempat — ubah definisi = ubah dua tempat = lupa satu = bug. Tiap CTE bisa di-SELECT sendiri untuk debug — langkah bernama = unit test untuk SQL.",
      ],
      tasks: [],
      reference: "Pecah analisis kompleks jadi langkah bernama; debug per langkah dengan SELECT * FROM nama_cte.",
    },
    {
      id: "recursive",
      eyebrow: "Langkah 3 · Recursive CTE",
      title: "Deret tanggal tanpa tabel",
      prose: [
        "`WITH RECURSIVE d(tgl) AS (SELECT date('2026-09-01') UNION ALL SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07') SELECT * FROM d;` — tiga bagian wajib: anchor (titik awal), rekursi (UNION ALL + perluasan), terminasi (kondisi berhenti). Tanpa kondisi berhenti = rekursi tak berujung!",
        "Kegunaan klasik: date spine — deret tanggal lengkap yang di-LEFT JOIN-kan ke data, agar hari tanpa transaksi tetap muncul (dengan 0) dan chart tidak berlubang (C4). Di lab ini kamu bangun spine 1–7 Sep 2026 lalu gabungkan total transaksi harian.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: recursive CTE `d(tgl)` untuk 2026-09-01 s.d. 2026-09-07, LEFT JOIN total transaksi harian (0 jika tidak ada)" },
        { id: "t2", text: "Hitung `s1` = total tanggal 2026-09-01 dan pastikan = 1500000" },
      ],
      expected: "baris: 7; 2026-09-01 = 1500000 (500rb + 1jt); 2026-09-04/06/07 = 0",
      note: {
        title: "Sering salah",
        body: "Lupa kondisi berhenti di bagian rekursif — query tidak selesai. Selalu pasang batas (WHERE tgl < ...) bahkan jika yakin aman; query yang hang di produksi = insiden.",
      },
      hints: [
        "Anchor: SELECT date('2026-09-01'); rekursi: SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07'.",
        "LEFT JOIN transaksi t ON t.tanggal = d.tgl, lalu GROUP BY d.tgl dengan COALESCE(SUM(t.jumlah), 0).",
        "s1 = [r[1] for r in rows if r[0] == '2026-09-01'][0]  →  1500000.",
      ],
      code: {
        starter:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: total tanggal 2026-09-01
s1 =

print("baris:", n)
for r in rows:
    print(r)
print("s1:", s1)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH RECURSIVE d(tgl) AS (
  SELECT date('2026-09-01')
  UNION ALL
  SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07'
)
SELECT d.tgl, COALESCE(SUM(t.jumlah), 0) AS total
FROM d LEFT JOIN transaksi t ON t.tanggal = d.tgl
GROUP BY d.tgl
ORDER BY d.tgl
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: total tanggal 2026-09-01
s1 = [r[1] for r in rows if r[0] == '2026-09-01'][0]

print("baris:", n)
for r in rows:
    print(r)
print("s1:", s1)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "RECURSIVE", label: "Query memakai WITH RECURSIVE", msg: "Deret tanggal butuh WITH RECURSIVE." },
          { kind: "equal", task: "t1", name: "n", value: 7, tol: 1e-9, label: "7 baris (7 tanggal)", msg: "Deret 1–7 Sep 2026 = 7 baris." },
          { kind: "equal", task: "t2", name: "s1", value: 1500000, tol: 1e-9, label: "`s1` seharusnya 1500000", msg: "1 Sep: 500rb (Andi) + 1jt (Budi) = 1,5jt." },
        ],
      },
      reference: "Recursive = anchor + UNION ALL + kondisi berhenti. Date spine = obat chart berlubang.",
    },
    {
      id: "pilih-struktur",
      eyebrow: "Langkah 4 · Memilih struktur",
      title: "CTE vs subquery vs temp table",
      prose: [
        "Satu langkah kecil → subquery inline (tidak perlu CTE untuk 1 langkah). Dua langkah atau lebih, atau dipakai 2× → CTE (bernama, berurutan, bisa di-debug per langkah). Dipakai di banyak query / data besar → temp table (CTE hanya hidup 1 query). Di kebanyakan database, CTE hanya untuk SELECT (read-only) — untuk ubah data pakai statement DML biasa atau temp table.",
        "Aturan praktis: namai CTE dengan isinya. Debug per langkah: `SELECT * FROM nama_cte`. Recursive: selalu ada kondisi berhenti. Keterbacaan > keringkasan — selalu.",
      ],
      tasks: [],
      reference: "1 langkah → subquery; 2+ langkah → CTE; lintas query → temp table.",
    },
    {
      id: "minicase-refactor",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Refactor warisan 40 baris",
      prose: [
        "Kamu mewarisi query: subquery 3 level untuk “top 3 kota by NPL ratio”. Ada bug: satu kota NPL-nya 300% (mustahil!). Bagaimana CTE membantumu menemukan bug dalam 5 menit?",
        "Pembahasan: pecah jadi CTE `kredit_kota` → `ringkas` → SELECT final. Lalu `SELECT * FROM kredit_kota WHERE kota = 'X'` — ketahuan: duplikat baris kredit (join ganda!) menggandakan plafon_npl tapi tidak total_plafon, atau sebaliknya. Bug fan-out (C5) yang tersembunyi di sarang subquery.",
        "Pelajaran: CTE bukan cuma gaya — ia alat debug. Tiap langkah bisa diinspeksi. Hal pertama pada query warisan: refactor ke CTE, baru cari bug.",
      ],
      tasks: [],
      reference: "Refactor ke CTE dulu, debug per langkah — bug fan-out tersembunyi jadi terlihat.",
    },
    {
      id: "intuisi-cte",
      eyebrow: "Langkah 6 · Intuisi",
      title: "CTE mempercepat manusia, bukan CPU — dan itu justru nilainya",
      prose: [
        "Godaan terbesar CTE adalah menganggapnya alat performa. Bukan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: optimasi untuk pembaca, bukan untuk mesin — kecuali kamu tahu persis kapan mesinnya ikut untung",
        body: "Nilai utama CTE bukan kecepatan — optimizer modern biasanya menghasilkan rencana eksekusi yang sama untuk CTE dan subquery setara. Nilai CTE adalah: tiap langkah bernama bisa diinspeksi (SELECT * FROM langkah_dua), dibaca berurutan dari atas ke bawah, dan diubah tanpa menyentuh langkah lain. Dalam pekerjaan nyata, query ditulis sekali tetapi dibaca puluhan kali — olehmu 3 bulan kemudian, oleh penggantimu, oleh auditor. Heuristiknya: bila query punya ≥2 langkah logis atau dipakai untuk debugging, CTE hampir selalu menang atas subquery bersarang, BUKAN karena lebih cepat, melainkan karena bug-nya lebih cepat ketemu. Satu-satunya saat CTE memengaruhi performa secara sistematis adalah soal materialisasi (Langkah 7) — dan di sanalah intuisi “CTE = gratis” berubah menjadi keharusan untuk memahami mesin. Aturan praktis: default ke CTE untuk keterbacaan; sentuh perilaku materialisasinya hanya bila EXPLAIN menunjukkan masalah nyata.",
      },
      reference: "CTE = keterbacaan + debuggability; performa = urusan materialisasi.",
    },
    {
      id: "materialisasi-cte",
      eyebrow: "Langkah 7 · Materialisasi",
      title: "Kapan CTE dihitung sekali, kapan disisipkan — dan kapan ia menyakitimu",
      prose: [
        "Pertanyaan yang jarang ditanyakan tentang CTE: apakah database menjalankan isi CTE sekali lalu menyimpan hasilnya (materialisasi), atau menempelkan definisinya ke tiap tempat ia dipakai (inlining)? Jawabannya menentukan performa — dan jawabannya BERBEDA antar database dan antar versi. Di Postgres ≤ 11, CTE SELALU dimaterialisasi: ia menjadi “pagar optimasi” (optimization fence) yang tidak bisa ditembus — filter dari query luar tidak bisa didorong masuk ke dalam CTE. Sejak Postgres 12, CTE di-inline bila hanya dipakai sekali (seperti subquery biasa), dan kamu bisa memaksa materialisasi dengan kata kunci MATERIALIZED — atau memaksa inlining dengan NOT MATERIALIZED.",
        "Kapan materialisasi MENYAKITI — kasus klasik: WITH jakarta AS (SELECT * FROM transaksi) SELECT * FROM jakarta WHERE kota = 'Jakarta' AND tanggal >= '2026-01-01'. Bila CTE dimaterialisasi, database menghitung SELURUH tabel transaksi dulu (10 juta baris ke disk/memori sementara), baru menyaring. Bila di-inline, filter tanggal dan kota didorong ke dalam (predicate pushdown) dan hanya baris yang cocok yang dibaca — bisa 100× lebih cepat. Inilah “pagar optimasi”: CTE yang ditulis untuk keterbacaan diam-diam memblokir optimasi terpenting. Di Postgres ≤ 11 ini adalah perilaku bawaan yang menjebak banyak migrasi; di SQLite, CTE umumnya di-inline seperti subquery sehingga masalah ini jarang muncul — tetapi jangan mengandalkan ingatan tentang versi: EXPLAIN adalah kebenarannya.",
        "Kapan materialisasi MEMBANTU — kasus sebaliknya: CTE mahal yang dipakai BERKALI-KALI. WITH mahal AS (SELECT ... agregasi berat ...) SELECT ... FROM mahal a JOIN mahal b ON ... — bila di-inline, agregasi berat dihitung dua kali; bila dimaterialisasi (MATERIALIZED di Postgres 12+), dihitung sekali lalu dipakai ulang. Kasus kedua: CTE dengan fungsi non-deterministik atau volatile (random(), now(), pemanggilan fungsi mahal per baris) — materialisasi menjamin ia dievaluasi sekali dengan hasil konsisten, sedangkan inlining bisa mengevaluasinya berulang dengan hasil berbeda. Inilah satu-satunya “knob” performa CTE yang eksplisit dan portabel antar versi Postgres.",
        "Teknik pagar optimasi yang disengaja: kadang kamu SENGAJA ingin memblokir optimizer. Contoh: CTE yang memanggil fungsi mahal atau dblink ke database remote — kamu ingin ia dieksekusi persis sekali dalam urutan yang kamu tulis, bukan diatur ulang oleh planner. MATERIALIZED adalah caranya — pagar yang tadinya jebakan menjadi alat. Senior memakai ini hemat: hanya ketika ada bukti (EXPLAIN + waktu ukur) bahwa planner membuat keputusan buruk, bukan sebagai kebiasaan.",
        "SQLite — dialek lab lesson ini — bersikap sederhana: CTE diperlakukan seperti subquery/view dan umumnya di-inline ke query luar, sehingga predicate pushdown biasanya terjadi. Artinya untuk SQLite/DuckDB, intuisi “CTE = subquery yang diberi nama” akurat secara performa. Tetapi ada pengecualian: recursive CTE selalu dievaluasi secara iteratif (tidak bisa di-inline), dan CTE yang dipakai berkali-kali di SQLite dievaluasi ulang per pemakaian — tidak ada memoization otomatis. Bila CTE mahalnya dipakai 3× di SQLite, pertimbangkan temp table: CREATE TEMP TABLE hasil AS SELECT ... — dihitung sekali, bisa diindeks, hidup selama sesi.",
        "Aturan keputusan — kapan memakai apa: (1) CTE untuk keterbacaan dan multi-langkah dalam SATU query — default, tanpa mikir performa dulu. (2) CTE dipakai 1× dan ada filter selektif di luar → pastikan inlining terjadi (Postgres 12+ default; cek EXPLAIN bila curiga). (3) CTE mahal dipakai ≥2× → MATERIALIZED (Postgres) atau temp table (SQLite/lintas query). (4) Hasil dipakai lintas BANYAK query atau butuh index sendiri → temp table, bukan CTE. (5) Butuh urutan eksekusi dijamin / fungsi volatile sekali → MATERIALIZED sebagai pagar disengaja.",
        "Cara mendiagnosis dengan EXPLAIN: cari node “CTE Scan” vs hilangnya nama CTE dari plan. Bila plan menunjukkan “CTE Scan on nama_cte” dengan “CTE nama_cte” yang memindai tabel besar tanpa filter — itu materialisasi penuh; bandingkan dengan versi query tanpa CTE (subquery inline) dan lihat apakah filternya kini menempel di scan tabel. Selisih waktu ukur (EXPLAIN ANALYZE, bukan tebakan) adalah vonisnya. Jangan mengoptimasi tanpa bukti — tetapi untuk CTE, “bukti” yang dicari spesifik: apakah filter luar berhasil didorong masuk ke dalam CTE?",
        "Satu jebakan terakhir lintas-dialek: di SQL Server, CTE juga di-inline (seperti derived table), sedangkan di Oracle, hint MATERIALIZE/INLINE mengontrolnya eksplisit. Artinya “apakah CTE-ku dimaterialisasi?” tidak punya jawaban universal — ia properti mesin + versi + kata kunci. Praktisi yang pindah dari Postgres 11 ke 14 (atau sebaliknya) dan query-nya tiba-tiba berubah perilaku biasanya sedang melihat efek ini. Dokumentasikan asumsi materialisasi di komentar query bila query-nya kritis — pembaca berikutnya (dan dirimu 6 bulan lagi) berterima kasih.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“CTE memperlambat query, jadi hindari.” Salah dua arah: di Postgres 12+ CTE sekali-pakai di-inline (tidak ada biaya), dan di semua database CTE tidak pernah lebih lambat dari subquery setara secara sistematis. Yang benar: CTE yang dimaterialisasi memblokir predicate pushdown — masalah spesifik dengan diagnosis spesifik (EXPLAIN), bukan larangan umum.",
      },
      reference: "Sekali-pakai + filter selektif → ingin inlining; mahal + dipakai ulang → MATERIALIZED/temp table.",
    },
    {
      id: "cte-vs-temp",
      eyebrow: "Langkah 8 · Temp table",
      title: "CTE vs temp table: kapan “dihitung sekali” harus eksplisit",
      prose: [
        "Ada batas yang tidak bisa dilewati CTE sebaik apa pun: ia hidup hanya dalam SATU statement. Begitu hasil antara dibutuhkan oleh DUA query terpisah (laporan pagi + dashboard siang memakai agregat yang sama), atau oleh langkah ETL berikutnya, CTE tidak bisa dipakai — kamu butuh temp table: CREATE TEMP TABLE ringkas AS SELECT ... — dihitung sekali, bisa di-query berkali-kali dalam sesi, lalu hilang saat sesi berakhir (TEMP = otomatis bersih-bersih, tidak mengotori katalog).",
        "Tiga keunggulan temp table yang tidak dimiliki CTE. Pertama, INDEX SENDIRI: CREATE INDEX idx_tmp ON ringkas(kota) — untuk hasil antara 5 juta baris yang di-join 3×, index ini mengubah tiap join berikutnya dari scan menjadi seek. CTE tidak bisa diindeks. Kedua, STATISTIK: optimizer melihat ukuran aktual temp table (5 juta baris, bukan estimasi), sehingga rencana query berikutnya akurat; CTE yang di-inline sering membuat optimizer menebak kardinalitas dengan buruk. Ketiga, DEBUGGING PERSISTEN: isi temp table bisa diinspeksi kapan saja dalam sesi (SELECT * FROM ringkas WHERE ...), bahkan setelah query utama selesai — CTE lenyap bersama statement-nya.",
        "Kasus kanonis “CTE dipakai 3×” layak dihitung biayanya: WITH mahal AS (agregasi 2 menit) SELECT ... FROM mahal a JOIN mahal b ... — di SQLite/Postgres-inlined, agregasi 2 menit dieksekusi TIGA KALI (6 menit); sebagai temp table, SEKALI (2 menit + join murah). Aturan kuantitatifnya: bila (biaya CTE × jumlah pemakaian) > (biaya CTE + biaya tulis temp + biaya baca ulang), pindahkan ke temp table. Untuk CTE murah (filter sederhana), jangan repot — overhead tulis temp table tidak terbayar. Untuk CTE mahal yang dipakai ulang, temp table hampir selalu menang.",
        "Disiplin temp table di produksi: (1) beri nama yang jelas BUKAN tmp/tmp1 — tmp_npl_per_kota_2026_09; (2) buat index yang dibutuhkan SEGERA setelah CREATE (sebelum query berikutnya); (3) ANALYZE bila database membutuhkannya untuk statistik (Postgres: ANALYZE tmp_...); (4) sadari visibilitasnya: TEMP table hanya terlihat di SESI yang membuatnya — job ETL dengan connection pool yang berganti koneksi bisa “kehilangan” temp table di tengah pipeline; untuk lintas-sesi pakai tabel fisik biasa (atau UNLOGGED di Postgres untuk kecepatan tanpa WAL). Dan satu peringatan: temp table di dalam TRANSAKSI yang di-rollback ikut hilang — buat di luar transaksi panjang, atau pakai ON COMMIT PRESERVE ROWS bila memang dibutuhkan.",
        "Alternatif modern yang patut diketahui: di Postgres 12+, MATERIALIZED CTE adalah “temp table mini” tanpa DDL — dihitung sekali, dipakai ulang dalam query itu. Di BigQuery/Snowflake, ada RESULT CACHE dan materialized view otomatis. Pilihannya berjenjang: dipakai 1 query 1× → CTE biasa; dipakai 1 query berkali-kali → MATERIALIZED CTE / temp table; dipakai banyak query 1 sesi → temp table; dipakai banyak sesi/hari → tabel fisik atau materialized view. Tiap jenjang menambah persistensi — dan persistensi yang tidak dibutuhkan adalah utang (data basi, katalog kotor). Naik jenjang hanya bila ada kebutuhan nyata, bukan “untuk jaga-jaga”.",
        "Pola “CTE chain sebagai pipeline” — teknik senior untuk query analitik kompleks: WITH mentah AS (...), bersih AS (SELECT ... FROM mentah WHERE ...), validasi AS (SELECT ..., COUNT(*) AS n FROM bersih ...), final AS (...) — tiap tahap adalah CTE bernama yang BISA diinspeksi independen (SELECT * FROM bersih LIMIT 5). Keunggulannya bukan performa, melainkan debuggability berlapis: saat angka final aneh, kamu memeriksa tiap tahap seperti memeriksa pipa — “air keruh mulai di tahap bersih”. Tambahkan CTE validasi yang melempar anomali (SELECT 'PERINGATAN: duplikat!' WHERE (SELECT COUNT(*) FROM bersih) <> (SELECT COUNT(DISTINCT id) FROM bersih)) — pipeline yang memeriksa dirinya sendiri. Ini gaya penulisan yang membuat query 80 baris tetap bisa dirawat.",
        "Kombinasi yang jarang dibahas: recursive CTE yang hasilnya DITAMPUNG ke temp table. Rantai fraud 8 level yang dihitung tiap ada alert baru — recursive-nya mahal (menit), tetapi hasilnya (daftar rekening + path) dipakai oleh 5 query investigasi berikutnya. Polanya: CREATE TEMP TABLE rantai AS WITH RECURSIVE r AS (...) SELECT * FROM r; CREATE INDEX idx_rantai ON rantai(rekening); — hitung sekali, investigasi berkali-kali dengan seek cepat. Tanpa ini, tiap analis yang membuka kasus mengulang rekursi yang sama. Aturan umumnya: hasil antara yang MAHAL + dipakai ULANG + butuh INDEX = temp table; tidak peduli apakah ia berasal dari CTE biasa, recursive, atau window.",
        "Menutup dengan matriks keputusan lengkap — tempel di dinding: (1) 1 langkah sederhana → subquery inline. (2) 2+ langkah, 1 query, dibaca manusia → CTE (default). (3) CTE mahal dipakai ≥2× dalam 1 query → MATERIALIZED (Postgres) atau temp table. (4) Hasil dipakai ≥2 query dalam 1 sesi → temp table + index. (5) Hasil dipakai lintas sesi / butuh dibaca cepat tiap hari → tabel fisik / materialized view + jadwal refresh. (6) Fungsi volatile / urutan eksekusi dijamin → MATERIALIZED sebagai pagar disengaja. Enam baris ini menjawab 95% pertanyaan “pakai apa?” — sisanya adalah kasus khusus yang memang layak didiskusikan, bukan dihafal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Temp table selalu lebih cepat dari CTE.” Tidak — untuk hasil antara KECIL yang dipakai sekali, temp table menambah overhead tulis + baca disk tanpa manfaat; CTE yang di-inline (atau pipeline streaming) lebih cepat. Temp table menang pada: hasil BESAR, dipakai BERKALI-KALI, atau butuh INDEX. Ukur, jangan menghafal.",
      },
      reference: "1 query 1× → CTE; mahal + dipakai ulang → MATERIALIZED/temp; lintas query 1 sesi → temp table; lintas sesi → tabel fisik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "CTE: WITH nama AS (...) — langkah bernama, berurutan, reusable dalam 1 query.",
        "Multi-step: pecah analisis kompleks; debug per langkah.",
        "Recursive: anchor + kondisi berhenti — hierarki & date spine.",
        "Pilih: 1 langkah → subquery; 2+ → CTE; lintas query → temp table.",
        "Keterbacaan = maintainability = uang.",
      ],
      next: { label: "C8 — UNION & Operasi Himpunan", href: "/learn/c8-union-set" },
      quiz: [
        {
          q: "Keunggulan utama CTE dibanding subquery bersarang?",
          options: [
            { text: "Lebih cepat selalu", why: "Salah — performa umumnya setara; optimizer sering menghasilkan rencana yang sama." },
            { text: "Terbaca: langkah bernama berurutan, bisa di-debug per langkah", why: "Benar. Yang dipercepat adalah manusia, bukan CPU.", correct: true },
            { text: "Tidak butuh alias", why: "Salah — CTE justru wajib punya nama." },
          ],
        },
        {
          q: "CTE didefinisikan?",
          options: [
            { text: "Setelah query utama", why: "Salah — query utama selalu di akhir." },
            { text: "Di awal dengan WITH, sebelum query utama", why: "Benar. Alur baca atas ke bawah.", correct: true },
            { text: "Di dalam WHERE", why: "Salah — itu subquery, bukan CTE." },
          ],
        },
        {
          q: "Recursive CTE wajib punya?",
          options: [
            { text: "ORDER BY", why: "Salah — tidak wajib." },
            { text: "Anchor + kondisi berhenti", why: "Benar. Tanpa kondisi berhenti = rekursi tak berujung.", correct: true },
            { text: "GROUP BY", why: "Salah — tidak wajib." },
          ],
        },
        {
          q: "Kapan temp table lebih tepat dari CTE?",
          options: [
            { text: "Query 1 langkah", why: "Salah — untuk itu subquery inline cukup." },
            { text: "Data dipakai banyak query / data besar", why: "Benar. CTE hidup 1 query; temp table lintas query/sesi.", correct: true },
            { text: "Selalu", why: "Salah — untuk analisis multi-langkah dalam 1 query, CTE lebih ringan." },
          ],
        },
        {
          q: "`SELECT * FROM total_trx` (nama CTE) berguna untuk?",
          options: [
            { text: "Menambah kecepatan", why: "Salah." },
            { text: "Debug: inspeksi hasil per langkah", why: "Benar. Tiap langkah CTE bisa diinspeksi — alat debug utama.", correct: true },
            { text: "Mengubah data", why: "Salah — CTE read-only di kebanyakan database." },
          ],
        },
      ],
    },
  ],
};

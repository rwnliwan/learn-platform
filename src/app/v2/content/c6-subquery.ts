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

export const c6: V2Lesson = {
  slug: "c6-subquery",
  track: "SQL",
  module: "Fondasi",
  title: "C6 Subquery: Query di Dalam Query",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-ratarata",
      eyebrow: "Langkah 1 · Subquery skalar",
      title: "Nasabah di atas rata-rata",
      prose: [
        "Manajer: “Siapa nasabah dengan penghasilan di atas rata-rata?” Kamu butuh dua langkah: (1) hitung rata-rata, (2) bandingkan tiap nasabah. Tanpa subquery: jalankan query 1, catat angkanya, tulis query 2 manual — tidak reusable, tidak otomatis. Subquery menggabungkan keduanya dalam satu query, dan “rata-rata” dihitung fresh setiap query dijalankan.",
        "`SELECT nama, penghasilan FROM nasabah WHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah)` — subquery skalar (satu baris, satu kolom) bisa dibandingkan dengan `=`, `>`, `<`. Aturan: subquery skalar harus mengembalikan tepat 1 baris — jika lebih, error!",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: nama & penghasilan nasabah yang penghasilannya di atas rata-rata (subquery skalar)" },
        { id: "t2", text: "Jalankan dan pastikan 3 baris kembali" },
      ],
      expected: "baris: 3 — Dewi (15000000), Budi (12000000), Hesti (11000000); rata-rata = 9388888.89",
      note: {
        title: "Sering salah",
        body: "Meng-hardcode angka rata-rata (“WHERE penghasilan > 9500000”) — angkanya basi saat data berubah. Subquery menghitung fresh tiap eksekusi: itulah gunanya.",
      },
      hints: [
        "Subquery di WHERE: WHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah).",
        "Rata-rata = 84,5jt / 9 = 9.388.888,89.",
        "Yang di atas: Dewi (15jt), Budi (12jt), Hesti (11jt) — 3 baris.",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama, penghasilan FROM nasabah
WHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah)
ORDER BY penghasilan DESC
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "n", value: 3, tol: 1e-9, label: "3 baris kembali", msg: "Di atas rata-rata (9.388.888,89): Dewi, Budi, Hesti." },
          { kind: "stdout_matches", task: "t2", pattern: "\\('Dewi', 15000000", label: "Dewi teratas", msg: "Urutkan menurun — Dewi (15jt) harus pertama." },
        ],
      },
      reference: "Subquery skalar = 1 baris 1 kolom; dihitung fresh tiap query dijalankan.",
    },
    {
      id: "in-exists",
      eyebrow: "Langkah 2 · IN & EXISTS",
      title: "Keanggotaan dan “tidak ada”",
      prose: [
        "`WHERE id IN (SELECT nasabah_id FROM kredit WHERE kolektibilitas >= 3)` — keanggotaan dalam himpunan hasil subquery. `WHERE EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id)` — “punya minimal satu”; EXISTS berhenti di kecocokan pertama (sering lebih cepat) dan aman dari NULL. Isi SELECT-nya tidak penting — yang dicek hanya keberadaan baris.",
        "Jebakan: jika subquery mengandung NULL, `NOT IN` mengembalikan kosong — diam-diam (C2)! Untuk “tidak ada”, `NOT EXISTS` selalu aman karena tidak terpengaruh NULL. Jadikan NOT EXISTS default untuk anti-join.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Subquery skalar mengembalikan 5 baris. Akibatnya?",
          options: [
            { text: "Dipakai baris pertama", why: "Salah — tidak ada aturan “ambil yang pertama”." },
            { text: "Error", why: "Benar. Skalar harus tepat 1 baris 1 kolom.", correct: true },
            { text: "Dikalikan 5", why: "Salah — itu bukan cara kerja subquery skalar." },
          ],
        },
        {
          q: "`NOT IN` vs `NOT EXISTS` saat subquery mengandung NULL?",
          options: [
            { text: "Sama", why: "Salah — perilakunya beda total saat ada NULL." },
            { text: "NOT IN kosong diam-diam; NOT EXISTS aman", why: "Benar. NOT EXISTS adalah default aman untuk anti-join.", correct: true },
            { text: "NOT EXISTS error", why: "Salah — NOT EXISTS justru yang aman." },
          ],
        },
        {
          q: "Nasabah yang tidak punya kredit macet — pola yang aman?",
          options: [
            { text: "WHERE id NOT IN (SELECT nasabah_id FROM kredit WHERE kolektibilitas = 5)", why: "Berisiko — jika subquery mengandung NULL, hasilnya kosong diam-diam." },
            { text: "WHERE NOT EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id AND k.kolektibilitas = 5)", why: "Benar. Kebal NULL, dan berhenti di kecocokan pertama.", correct: true },
            { text: "WHERE id <> (SELECT nasabah_id FROM kredit)", why: "Salah — subquery mengembalikan banyak baris, bukan skalar." },
          ],
        },
      ],
      reference: "IN untuk keanggotaan; EXISTS untuk “ada”; NOT EXISTS (bukan NOT IN) untuk “tidak ada”.",
    },
    {
      id: "derived-table",
      eyebrow: "Langkah 3 · Derived table",
      title: "Agregasi dulu, join kemudian",
      prose: [
        "Obat fan-out (C5): agregasi dulu per nasabah, baru join. `SELECT n.nama, t.total_trx, t.n_trx FROM nasabah n JOIN (SELECT nasabah_id, SUM(jumlah) AS total_trx, COUNT(*) AS n_trx FROM transaksi GROUP BY nasabah_id) t ON t.nasabah_id = n.id` — subquery di FROM wajib punya alias. Granularitasnya 1 baris per nasabah → JOIN aman, tidak fan-out.",
        "Kapan derived table? Setiap kali kamu tergoda agregat setelah JOIN 1-ke-banyak. Tulis agregatnya sebagai subquery di FROM dulu — query jadi lebih panjang tapi benar. Benar > pendek.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: semua nasabah + total transaksinya — derived table per nasabah + `LEFT JOIN` + `COALESCE(..., 0)`" },
        { id: "t2", text: "Hitung `total_budi` (baris nama 'Budi') dan pastikan tidak ada total NULL" },
      ],
      expected: "baris: 10; total Budi = 3400000; tidak ada NULL (COALESCE bekerja)",
      note: {
        title: "Sering salah",
        body: "Lupa alias untuk subquery di FROM — derived table wajib punya nama, atau query error.",
      },
      hints: [
        "Derived table: (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id) t.",
        "LEFT JOIN agar nasabah tanpa transaksi tetap muncul; COALESCE(t.total, 0).",
        "total_budi = [r[1] for r in rows if r[0] == 'Budi'][0]; cek any(r[1] is None for r in rows).",
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
# TULIS KODEMU: total Budi + cek NULL
total_budi =
ada_null =

print("baris:", n)
print("total_budi:", total_budi)
print("ada_null:", ada_null)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT n.nama, COALESCE(t.total, 0) AS total_trx
FROM nasabah n
LEFT JOIN (
  SELECT nasabah_id, SUM(jumlah) AS total
  FROM transaksi
  GROUP BY nasabah_id
) t ON t.nasabah_id = n.id
ORDER BY n.id
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: total Budi + cek NULL
total_budi = [r[1] for r in rows if r[0] == 'Budi'][0]
ada_null = any(r[1] is None for r in rows)

print("baris:", n)
print("total_budi:", total_budi)
print("ada_null:", ada_null)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t1", name: "n", value: 10, tol: 1e-9, label: "10 baris (semua nasabah)", msg: "LEFT JOIN mempertahankan seluruh 10 nasabah." },
          { kind: "equal", task: "t2", name: "total_budi", value: 3400000, tol: 1e-9, label: "`total_budi` seharusnya 3400000", msg: "Transaksi Budi: 1jt + 2jt + 400rb = 3,4jt." },
          { kind: "equal", task: "t2", name: "ada_null", value: false, label: "Tidak ada total NULL", msg: "COALESCE(t.total, 0) mengubah NULL jadi 0." },
        ],
      },
      reference: "Derived table: agregasi dulu (wajib alias), baru JOIN — obat fan-out.",
    },
    {
      id: "correlated",
      eyebrow: "Langkah 4 · Correlated subquery",
      title: "Query yang “melihat keluar”",
      prose: [
        "`SELECT n.nama, (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) AS n_trx FROM nasabah n` — subquery merujuk `n.id` dari luar: dieksekusi sekali per baris luar (10 nasabah = 10 eksekusi). Untuk data kecil OK; untuk jutaan baris = lambat (N+1 problem-nya SQL). Solusi: tulis ulang sebagai JOIN + GROUP BY (derived table di atas) — satu scan, bukan N scan.",
        "Tapi correlated tidak selalu buruk — untuk top-N per grup atau exists-check, ia justru idiomatis dan sering dioptimasi baik oleh planner. Ukur dengan EXPLAIN (C17), jangan menghakimi buta. Peta subquery: banding dengan hasil hitungan → skalar; keanggotaan → IN/EXISTS; “tidak ada” → NOT EXISTS; agregat lalu join → derived table; correlated untuk agregat massal → tulis ulang JOIN+GROUP BY.",
      ],
      tasks: [],
      reference: "Correlated = per baris — waspadai di data besar; tulis ulang sebagai JOIN+GROUP BY.",
    },
    {
      id: "minicase-crosssell",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Nasabah aktif tapi tak punya kredit",
      prose: [
        "Marketing mau kampanye: nasabah dengan total transaksi > 1 juta tapi belum punya kredit — prospek cross-sell. Tulis 1 query (petunjuk: derived table + NOT EXISTS).",
        "Pembahasan: `SELECT n.nama, t.total FROM nasabah n JOIN (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id HAVING SUM(jumlah) > 1000000) t ON t.nasabah_id = n.id WHERE NOT EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id);` — di data lab, semua nasabah punya kredit, jadi hasilnya kosong; tapi polanya yang penting. Tiga teknik satu query: derived table (agregat), HAVING (saring grup), NOT EXISTS (anti-join).",
        "Pelajaran: query kompleks = komposisi pola sederhana. Kuasai pola, rangkai sesukamu.",
      ],
      tasks: [],
      reference: "Komposisi: derived table + HAVING + NOT EXISTS.",
    },
    {
      id: "intuisi-subquery",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Subquery adalah cara berpikir bertahap — biayanya tergantung di mana ia dievaluasi",
      prose: [
        "Subquery yang sama bisa murah atau mahal tergantung satu hal: apakah ia dievaluasi sekali atau sekali per baris.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tanyakan “berapa kali subquery ini dijalankan?”",
        body: "Setiap kali kamu menulis subquery, ajukan satu pertanyaan: berapa kali database akan mengeksekusinya? Subquery skalar yang tidak merujuk tabel luar (SELECT AVG(...) FROM ...) dijalankan SEKALI — murah, tidak peduli tabelnya besar. Correlated subquery yang merujuk tabel luar (WHERE t.nasabah_id = n.id) berpotensi dijalankan SEKALI PER BARIS luar — 2 juta baris luar berarti 2 juta eksekusi, kecuali optimizer berhasil mengubahnya menjadi join (decorrelation). Heuristiknya: subquery mandiri = pikirkan sekali, correlated = curigai dulu, buktikan dengan EXPLAIN. Dan ada asimetri yang menguntungkan: EXISTS berhenti di baris pertama yang cocok (tidak menghitung semuanya), sehingga untuk uji “apakah ada”, ia hampir selalu lebih murah daripada COUNT(*) > 0 yang menghitung sampai habis. Membaca query seperti menelusuri biaya berarti membaca “di mana loop-nya” — dan correlated subquery adalah loop yang menyamar sebagai satu baris.",
      },
      reference: "Mandiri = sekali; correlated = curigai per-baris; EXISTS berhenti di pertama.",
    },
    {
      id: "correlated-lateral",
      eyebrow: "Langkah 7 · Correlated & LATERAL",
      title: "Biaya correlated subquery, LATERAL, dan unnesting",
      prose: [
        "Correlated subquery mahal karena semantiknya: untuk tiap baris luar, evaluasi subquery dengan nilai baris itu. SELECT n.nama, (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) AS n_trx FROM nasabah n — bila nasabah 2 juta baris, ini 2 juta eksekusi subquery. Optimizer modern sering melakukan decorrelation (mengubahnya menjadi GROUP BY + JOIN di balik layar), tetapi tidak selalu bisa — terutama bila subquery memakai LIMIT, agregasi bertingkat, atau fungsi non-deterministik. Jangan bertaruh pada keberuntungan optimizer untuk query yang berjalan tiap jam di data besar.",
        "Rewrite kanonisnya adalah unnesting manual: hitung agregatnya SEKALI per kunci, lalu join. SELECT n.nama, t.n_trx FROM nasabah n LEFT JOIN (SELECT nasabah_id, COUNT(*) AS n_trx FROM transaksi GROUP BY nasabah_id) t ON t.nasabah_id = n.id — satu scan transaksi, satu join. Pola ini juga memperbaiki masalah kedua dari correlated skalar: bila nasabah tidak punya transaksi, subquery mengembalikan NULL (bukan 0) — sedangkan LEFT JOIN + COALESCE(t.n_trx, 0) memberi angka yang benar untuk laporan. Aturan: agregasi per kunci milik derived table di FROM, bukan subquery skalar di SELECT.",
        "LATERAL (Postgres; di SQL Server disebut CROSS APPLY) adalah correlated subquery yang naik kelas menjadi join: SELECT n.nama, t.* FROM nasabah n, LATERAL (SELECT * FROM transaksi t WHERE t.nasabah_id = n.id ORDER BY tanggal DESC LIMIT 3) t — “3 transaksi terakhir per nasabah”, top-N per grup yang tidak bisa ditulis sebagai join biasa. Tanpa LATERAL, kamu butuh window function + filter (ROW_NUMBER lalu saring) yang menghitung peringkat SEMUA baris sebelum membuangnya; LATERAL + LIMIT + index pada (nasabah_id, tanggal) hanya menyentuh 3 baris per nasabah. Di SQLite tidak ada LATERAL — padanannya adalah pola window function — tetapi memahami LATERAL membuatmu membaca query Postgres orang lain tanpa tersesat.",
        "Kapan correlated TETAP idiomatis dan aman? Tiga kasus: EXISTS / NOT EXISTS (berhenti di pertama, decorrelation-friendly), top-N per grup via LATERAL (lebih murah dari window), dan subquery yang sangat selektif di sisi dalam dengan index tepat. Aturan keputusan senior: tulis versi yang paling terbaca dulu (seringnya correlated/EXISTS), ukur di data representatif, dan hanya rewrite ke bentuk unnested bila EXPLAIN menunjukkan eksekusi per-baris yang mahal. Optimasi tanpa pengukuran adalah spekulasi — tetapi pola “agregat per kunci di FROM” adalah default yang benar untuk 90% kasus.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Correlated subquery selalu lambat.” Tidak — EXISTS yang correlated biasanya dioptimasi menjadi semi-join yang sangat cepat, dan untuk tabel luar yang kecil (100 baris) correlated tidak pernah jadi masalah. Yang mahal adalah correlated AGREGASI/SKALAR di atas tabel luar yang besar tanpa decorrelation. Ukur, jangan menghafal larangan.",
      },
      reference: "Agregat per kunci → derived table di FROM; top-N per grup → LATERAL (atau window).",
    },
    {
      id: "exists-vs-in",
      eyebrow: "Langkah 8 · Semi-join",
      title: "EXISTS vs IN vs JOIN: tiga cara “punya pasangan” yang tidak setara",
      prose: [
        "Tiga konstruksi yang terlihat setara untuk pertanyaan “nasabah yang punya kredit macet” ternyata berbeda dalam dua hal: duplikasi dan NULL. Versi JOIN — SELECT DISTINCT n.nama FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id WHERE k.status = 'macet' — menggandakan baris nasabah bila ia punya 3 kredit macet, sehingga DISTINCT menjadi wajib (dan mahal). Versi IN — WHERE n.id IN (SELECT nasabah_id FROM kredit WHERE status = 'macet') — tidak menggandakan, tetapi runtuh diam-diam bila subquery mengandung NULL — satu nilai NULL di sisi kanan membuat x NOT IN (...) menjadi UNKNOWN untuk semua x, sehingga hasilnya kosong tanpa peringatan. Versi EXISTS — WHERE EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id AND k.status = 'macet') — tidak menggandakan DAN kebal NULL.",
        "Perbedaan performanya juga nyata: EXISTS berhenti pada pasangan pertama yang ditemukan (short-circuit), sedangkan IN secara konseptual membangun himpunan lengkap dulu. Untuk tabel dalam yang besar, ini bisa berarti perbedaan memindai 3 baris vs 3 juta baris. Optimizer modern sering menyamakan ketiganya menjadi semi-join yang sama — tetapi “sering” bukan “selalu”, dan perilakunya pada NULL tidak pernah disamakan: hanya EXISTS yang konsisten benar.",
        "Aturan keputusan final: butuh kolom dari tabel dalam → JOIN (tambah DISTINCT hanya bila fan-out memang terjadi, dan pertimbangkan agregat-dulu). Hanya uji keberadaan → EXISTS (default senior). IN hanya untuk daftar literal kecil (IN (1, 2, 3)) atau subquery atas kolom yang dijamin NOT NULL oleh constraint. NOT IN atas subquery? Hampir tidak pernah — pakai NOT EXISTS. Tiga baris aturan ini mencegah dua kategori bug paling memalukan dalam karier analis: angka mengganda dan hasil kosong misterius.",
      ],
      tasks: [],
      reference: "Butuh kolom → JOIN; uji ada → EXISTS; daftar kecil pasti-non-null → IN.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Skalar/IN: banding & keanggotaan di WHERE; skalar = tepat 1 baris 1 kolom.",
        "NOT EXISTS (bukan NOT IN) untuk “tidak ada” — aman dari NULL.",
        "Derived table: agregat dulu (wajib alias), baru join — obat fan-out.",
        "Correlated: kuat tapi per-baris — waspadai di data besar.",
        "Query kompleks = komposisi pola sederhana.",
      ],
      next: { label: "C7 — CTE", href: "/learn/c7-cte" },
      quiz: [
        {
          q: "Derived table (subquery di FROM) wajib?",
          options: [
            { text: "ORDER BY", why: "Salah — tidak wajib." },
            { text: "Alias", why: "Benar. Subquery di FROM harus punya nama.", correct: true },
            { text: "LIMIT", why: "Salah — tidak wajib." },
          ],
        },
        {
          q: "Obat fan-out (agregat setelah JOIN 1-ke-banyak)?",
          options: [
            { text: "DISTINCT", why: "Salah — menutupi gejala, merusak SUM yang sah." },
            { text: "Agregasi dulu di derived table, baru JOIN", why: "Benar. Perbaiki granularitas sebelum join.", correct: true },
            { text: "UNION", why: "Salah — UNION menumpuk baris, tidak memperbaiki granularitas." },
          ],
        },
        {
          q: "Correlated subquery di SELECT untuk 10 juta baris?",
          options: [
            { text: "Ideal", why: "Salah — dieksekusi sekali per baris." },
            { text: "Berisiko lambat — tulis ulang JOIN+GROUP BY", why: "Benar. N+1 problem. Kecuali pola EXISTS/top-N yang idiomatis.", correct: true },
            { text: "Error", why: "Salah — tidak error, hanya lambat." },
          ],
        },
        {
          q: "Kenapa subquery skalar tidak boleh mengembalikan 2 baris?",
          options: [
            { text: "Akan dipakai baris pertama", why: "Salah — tidak ada aturan seperti itu." },
            { text: "Error — skalar harus tepat 1 nilai", why: "Benar. Perbandingan >/< /= butuh satu nilai.", correct: true },
            { text: "Hasilnya digandakan", why: "Salah." },
          ],
        },
        {
          q: "`WHERE EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id)` — arti “SELECT 1”?",
          options: [
            { text: "Menghitung 1 baris saja", why: "Salah." },
            { text: "Isi SELECT tidak penting — yang dicek hanya keberadaan baris", why: "Benar. EXISTS berhenti di kecocokan pertama.", correct: true },
            { text: "Mengambil kolom pertama", why: "Salah — angka 1 bukan nama kolom." },
          ],
        },
      ],
    },
  ],
};

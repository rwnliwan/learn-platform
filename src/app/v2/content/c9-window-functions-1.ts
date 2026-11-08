import type { V2Lesson, V2Step } from "../lib/types";

const SETUP_NASABAH = `import sqlite3
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

const SETUP_TRX = `import sqlite3
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


const SETUP_WF = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE trx2 (
  id INTEGER PRIMARY KEY,
  tanggal TEXT,
  nominal REAL
)""")
data_trx2 = [
    (1, '2026-09-01', 100000),
    (2, '2026-09-01', 200000),
    (3, '2026-09-02', 150000),
    (4, '2026-09-03', 300000),
    (5, '2026-09-03', 100000),
    (6, '2026-09-03', 200000),
]
cur.executemany("INSERT INTO trx2 VALUES (?,?,?)", data_trx2)
db.commit()`;

const TAIL_WF = `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`;

const SETUP_TF = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE q_sales (
  sales_id INTEGER PRIMARY KEY,
  nama TEXT,
  quarter TEXT,
  revenue REAL
)""")
data_q = [
    (1, 'Sinta', 'Q1', 12000000),
    (2, 'Sinta', 'Q2', 15000000),
    (3, 'Bima', 'Q1', 15000000),
    (4, 'Bima', 'Q2', 15000000),
    (5, 'Raka', 'Q1', 9000000),
    (6, 'Raka', 'Q2', 11000000),
    (7, 'Dina', 'Q1', 15000000),
    (8, 'Dina', 'Q2', 13000000),
]
cur.executemany("INSERT INTO q_sales VALUES (?,?,?,?)", data_q)
db.commit()`;

const TAIL_TF = `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: hitung dari rows
# (indeks kolom: 0=nama, 1=quarter, 2=revenue, 3=rn, 4=rnk, 5=drnk, 6=tumbuh)
n = len(rows)
n_juara =

tumbuh_sinta =

print("baris:", n)
print("juara:", n_juara)
print("tumbuh_sinta:", tumbuh_sinta)
for r in rows:
    print(r)`;

// Transfer check: interface lokal (tanpa mengubah lib/types.ts) agar metadata
// kind/noLiteral ikut ter-typecheck dan check `kind` tidak melebar ke string.
interface TransferStep extends V2Step {
  kind: "transfer";
  noLiteral: string[];
}
const transferStep: TransferStep = {
  id: "transfer-leaderboard",
  kind: "transfer",
  eyebrow: "Transfer check · tanpa petunjuk",
  title: "Papan peringkat penjualan: siapa juara saat ada seri?",
  prose: [
    "Skenario BARU — tidak ada hubungannya dengan tabel nasabah. Kamu analis di perusahaan retail: tabel q_sales berisi revenue tiap penjual per quarter. Manajemen mau daftar juara tiap quarter — dan aturannya adil: bila dua penjual seri di puncak, KEDUANYA juara (tidak ada yang terpotong).",
    "Langkah ini TANPA petunjuk dan TANPA 'hasil yang diharapkan'. Checker hanya memberitahu cek mana yang gagal dan kenapa — angkanya tidak ditampilkan. Kerjakan dari pemahamanmu tentang ROW_NUMBER vs RANK vs DENSE_RANK dan LAG.",
  ],
  tasks: [
    { id: "t1", text: "Tulis query di `sql`: papan peringkat per quarter — kolom BERURUTAN: nama, quarter, revenue, rn (ROW_NUMBER), rnk (RANK), drnk (DENSE_RANK), tumbuh (revenue − LAG(revenue) per penjual). Ranking: PARTITION BY quarter ORDER BY revenue DESC. LAG: PARTITION BY nama ORDER BY quarter." },
    { id: "t2", text: "Dari rows, hitung `n_juara` = banyak baris dengan rnk = 1 — semua juara tiap quarter harus ikut; yang seri tidak boleh terpotong" },
    { id: "t3", text: "Dari rows, hitung `tumbuh_sinta` = nilai tumbuh untuk Sinta di Q2" },
  ],
  code: {
    starter: SETUP_TF + TAIL_TF,
    lockLines: 21,
    solution:
      SETUP_TF +
      `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH r AS (
  SELECT nama, quarter, revenue,
    ROW_NUMBER() OVER (PARTITION BY quarter ORDER BY revenue DESC) AS rn,
    RANK() OVER (PARTITION BY quarter ORDER BY revenue DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY quarter ORDER BY revenue DESC) AS drnk,
    revenue - LAG(revenue) OVER (PARTITION BY nama ORDER BY quarter) AS tumbuh
  FROM q_sales
)
SELECT nama, quarter, revenue, rn, rnk, drnk, tumbuh FROM r ORDER BY quarter, rnk
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: hitung dari rows
# (indeks kolom: 0=nama, 1=quarter, 2=revenue, 3=rn, 4=rnk, 5=drnk, 6=tumbuh)
n = len(rows)
n_juara = sum(1 for r in rows if r[4] == 1)

tumbuh_sinta = next(r[6] for r in rows if r[0] == 'Sinta' and r[1] == 'Q2')

print("baris:", n)
print("juara:", n_juara)
print("tumbuh_sinta:", tumbuh_sinta)
for r in rows:
    print(r)`,
    checks: [
      { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql pada bagian editable." },
      { kind: "contains", task: "t1", name: "sql", value: "RANK", label: "Query memakai fungsi ranking", msg: "Papan peringkat memakai RANK/DENSE_RANK/ROW_NUMBER dengan OVER (PARTITION BY quarter ORDER BY revenue DESC)." },
      { kind: "contains", task: "t3", name: "sql", value: "LAG", label: "Query memakai LAG", msg: "Pertumbuhan antar quarter memakai LAG(revenue) OVER (PARTITION BY nama ORDER BY quarter)." },
      { kind: "equal", task: "t1", name: "n", value: 8, tol: 1e-9, label: "Semua baris tetap tampil", msg: "Window tidak melipat baris — semua baris penjualan harus tetap muncul di output." },
      { kind: "equal", task: "t2", name: "n_juara", value: 4, tol: 1e-9, label: "Semua juara tiap quarter ikut", msg: "RANK yang benar mengikutkan SEMUA yang seri di peringkat 1 — bila ada juara yang hilang, kamu memakai ROW_NUMBER yang memotong seri." },
      { kind: "equal", task: "t3", name: "tumbuh_sinta", value: 3000000, tol: 1e-9, label: "Pertumbuhan antar quarter benar", msg: "LAG harus dipartisi per penjual dan diurutkan per quarter; baris quarter pertama tiap penjual wajar NULL." },
    ],
  },
  noLiteral: ["sql", "n_juara", "tumbuh_sinta"],
  reference: "Transfer: seri di puncak ikut semua → RANK; pertumbuhan antar periode → LAG per penjual.",
};

export const c9_1: V2Lesson = {
  slug: "c9-window-functions-1",
  track: "SQL",
  module: "Lanjutan",
  title: "C9.1 Window Functions: Ranking & Akses Baris Tetangga",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-top3",
      eyebrow: "Langkah 1 · Konsep window",
      title: "“Top 3 per kota” yang tak bisa dijawab GROUP BY",
      prose: [
        "Manajer: “Siapa 3 nasabah berpenghasilan tertinggi di tiap kota?” `GROUP BY kota` melipat 10 baris jadi 4 — nama-namanya hilang! Window function menjawab dalam satu query elegan: beri peringkat di dalam tiap kota, saring peringkat ≤ 3.",
        "Window function melakukan perhitungan melintasi sekumpulan baris terkait (window) — tapi tidak melipat baris seperti GROUP BY. Tiap baris tetap ada, plus kolom hasil perhitungan. Anatomi: `FUNGSI(...) OVER (PARTITION BY ... ORDER BY ...)` — PARTITION BY = “kelompok window”, ORDER BY di dalam OVER = “urutan dalam window”.",
        "Urutan eksekusi penting: window dihitung setelah WHERE/GROUP BY/HAVING tapi sebelum ORDER BY final. Karena itu kamu tidak bisa pakai hasil window di WHERE — butuh subquery/CTE pembungkus. Ini pola yang paling sering ditulis salah di interview — hafalkan bentuknya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“PARTITION BY harus selalu dipakai.” Tidak! `OVER ()` kosong = seluruh hasil sebagai satu window (untuk % of total — Part 2). PARTITION hanya saat butuh grup terpisah.",
      },
      reference: "Window = hitung tanpa melipat baris; hasil window tak bisa di WHERE langsung.",
    },
    {
      id: "ranking",
      eyebrow: "Langkah 2 · ROW_NUMBER, RANK, DENSE_RANK",
      title: "Tiga peringkat, tiga makna",
      prose: [
        "Untuk nilai 100, 90, 90, 80: `ROW_NUMBER` memberi 1,2,3,4 (nomor unik, seri diputus sembarang); `RANK` memberi 1,2,2,4 (lompat setelah seri — peringkat kompetisi nyata); `DENSE_RANK` memberi 1,2,2,3 (rapat tanpa lompat — “top-N nilai unik”).",
        "Pola “top-N per grup” (interview klasik): `WITH peringkat AS (SELECT nama, kota, penghasilan, ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn FROM nasabah) SELECT * FROM peringkat WHERE rn <= 2;` — CTE dulu, saring kemudian. Bonus: `ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC)` lalu saring rn=1 = pola dedup nomor satu (“baris terbaru per id”).",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: 2 nasabah berpenghasilan tertinggi di tiap kota — CTE + `ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC)`" },
        { id: "t2", text: "Jalankan dan pastikan 8 baris kembali (2 × 4 kota)" },
      ],
      expected: "baris: 8 — tiap kota 2 teratas (Jakarta: Hesti, Andi; Bandung: Budi, Fitri; Surabaya: Dewi, Irfan; Medan: Joko, Gilang)",
      note: {
        title: "Sering salah",
        body: "Menulis `WHERE ROW_NUMBER() OVER (...) <= 2` langsung — error! Window dievaluasi setelah WHERE. Pola wajib: CTE/subquery dulu, saring di query luar.",
      },
      hints: [
        "KONSEP — Kamu butuh peringkat di dalam tiap kelompok kota, bukan satu peringkat global. Dan peringkat itu tidak bisa disaring di query yang sama: window dihitung SETELAH WHERE, jadi polanya selalu dua lapis — hitung dulu, saring kemudian.",
        "CLUE — Fungsi ranking: ROW_NUMBER. Di dalam OVER: PARTITION BY kota, ORDER BY penghasilan DESC. Bungkus sebagai CTE (atau subquery), lalu saring rn <= 2 di query luar.",
        "SKELETON — WITH p AS (SELECT nama, kota, penghasilan, ... OVER (PARTITION BY ... ORDER BY ... DESC) AS rn FROM nasabah) SELECT * FROM ... WHERE ... <= 2",
      ],
      code: {
        starter: SETUP_NASABAH + TAIL,
        lockLines: 25,
        solution:
          SETUP_NASABAH +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH p AS (
  SELECT nama, kota, penghasilan,
  ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn
  FROM nasabah
)
SELECT * FROM p WHERE rn <= 2
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "ROW_NUMBER", label: "Query memakai ROW_NUMBER", msg: "Peringkat per kota memakai ROW_NUMBER() OVER (PARTITION BY kota ...)." },
          { kind: "equal", task: "t2", name: "n", value: 8, tol: 1e-9, label: "8 baris kembali", msg: "2 teratas × 4 kota = 8 baris." },
          { kind: "stdout_matches", task: "t2", pattern: "Dewi", label: "Dewi termasuk (teratas Surabaya)", msg: "Dewi (15jt) = peringkat 1 Surabaya, harus muncul." },
        ],
      },
      reference: "ROW_NUMBER unik; RANK lompat; DENSE_RANK rapat. Pola top-N: CTE + saring rn <= N.",
    },
    {
      id: "lag-lead",
      eyebrow: "Langkah 3 · LAG / LEAD",
      title: "Mengintip baris tetangga",
      prose: [
        "`LAG(jumlah) OVER (ORDER BY tanggal)` = nilai di baris sebelumnya; `LEAD` = sesudahnya. Kapan: pertumbuhan harian (selisih vs kemarin), deteksi anomali (lonjakan), time-to-event. `LAG(x, 7)` = 7 baris sebelumnya; argumen ke-3 = default jika NULL (`LAG(x, 1, 0)`). Wajib ORDER BY di dalam OVER — tanpa itu “sebelum” tidak bermakna! Baris pertama LAG-nya NULL (tidak ada “kemarin”).",
        "Pola MoM/YoY: `jumlah / LAG(jumlah, 12) OVER (PARTITION BY kategori ORDER BY bulan) - 1` = pertumbuhan YoY per kategori. Satu baris = laporan tahunan! LAG mengubah deret level menjadi deret perubahan — dan perubahan yang biasanya ditanya (“naik berapa?”).",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: untuk nasabah 1 tampilkan tanggal, jumlah, dan `selisih` vs transaksi sebelumnya (CTE + LAG)" },
        { id: "t2", text: "Hitung `maks` = selisih terbesar dan pastikan = 950000" },
      ],
      expected: "selisih: -250000, 950000 — kenaikan terbesar 950rb pada 2026-09-15 (250rb → 1,2jt)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pola “bandingkan dengan periode lalu” = 80% analisis tren — termasuk deteksi anomali transaksi (C14). LAG yang sama dipakai untuk velocity check dan impossible travel.",
      },
      hints: [
        "KONSEP — Kamu butuh 'nilai transaksi sebelumnya' dalam urutan waktu — itu perbandingan antar baris tetangga, bukan agregat. Kata 'sebelumnya' hanya bermakna bila urutannya eksplisit. Dan seperti ranking: hasil fungsi window tidak bisa dipakai di WHERE yang sama.",
        "CLUE — Fungsi: LAG(jumlah) dengan OVER (ORDER BY tanggal). Saring dulu transaksi nasabah 1 (WHERE nasabah_id = 1), bungkus dalam CTE, hitung selisih di SELECT luar.",
        "SKELETON — WITH s AS (SELECT tanggal, jumlah, jumlah - ...(jumlah) OVER (ORDER BY ...) AS selisih FROM transaksi WHERE nasabah_id = ...) SELECT * FROM ...",
      ],
      code: {
        starter:
          SETUP_TRX +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """

"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: selisih terbesar (abaikan NULL)
maks =

print("maks:", maks)
for r in rows:
    print(r)`,
        lockLines: 51,
        solution:
          SETUP_TRX +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH s AS (
  SELECT tanggal, jumlah,
  jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih
  FROM transaksi WHERE nasabah_id = 1
)
SELECT * FROM s ORDER BY tanggal
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: selisih terbesar (abaikan NULL)
maks = max(r[2] for r in rows if r[2] is not None)

print("maks:", maks)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "LAG", label: "Query memakai LAG", msg: "Selisih vs transaksi sebelumnya memakai LAG(jumlah) OVER (ORDER BY tanggal)." },
          { kind: "equal", task: "t2", name: "maks", value: 950000, tol: 1e-9, label: "`maks` seharusnya 950000", msg: "Transaksi nasabah 1: 500rb → 250rb → 1,2jt. Selisih terbesar = 1,2jt − 250rb = 950rb." },
        ],
      },
      reference: "LAG/LEAD butuh ORDER BY di OVER; NULL di tepi — pakai default jika perlu.",
    },
    {
      id: "minicase-kompetisi",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Nasabah terbaik tiap kota, versi kompetisi",
      prose: [
        "Marketing mau memberi reward ke peringkat 1–3 tiap kota berdasar total transaksi — tapi jika ada nilai kembar, semua yang seri harus dapat (adil!). ROW_NUMBER, RANK, atau DENSE_RANK?",
        "Pembahasan: `DENSE_RANK` — “3 nilai tertinggi” (semua yang seri ikut), tanpa lompat. RANK juga adil untuk seri tapi melompat (peringkat 4 hilang jika 2 orang seri di peringkat 3). ROW_NUMBER tidak adil (memotong seri secara acak). Query: `WITH t AS (...total per nasabah...), p AS (SELECT ..., DENSE_RANK() OVER (PARTITION BY kota ORDER BY total DESC) dr FROM ...) SELECT * FROM p WHERE dr <= 3;`",
        "Pelajaran: pilihan fungsi ranking = keputusan keadilan, bukan sekadar teknis. Tanyakan “bagaimana jika seri?” sebelum memilih.",
      ],
      tasks: [],
      reference: "Seri harus ikut semua → DENSE_RANK; tepat N orang → ROW_NUMBER; kompetisi nyata → RANK.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Window Part 1: alat mana untuk apa",
      prose: [
        "Peringkat per grup → ROW_NUMBER/RANK + PARTITION BY (CTE + saring rn ≤ N). Dedup ambil terbaru → ROW_NUMBER rn=1 (`PARTITION BY id ORDER BY updated_at DESC`). Banding vs periode lalu → LAG/LEAD (wajib ORDER BY di OVER; NULL di tepi). Rata-rata per grup tanpa melipat → `AVG(...) OVER (PARTITION BY ...)` (baris utuh + kolom konteks grup).",
        "Aturan praktis: window ≠ GROUP BY — baris tidak melipat. Hasil window tidak bisa di WHERE — bungkus CTE. PARTITION BY = kelompok; ORDER BY di OVER = urutan. ROW_NUMBER unik; RANK lompat; DENSE_RANK rapat.",
      ],
      tasks: [],
      reference: "Top-N per grup, dedup rn=1, LAG untuk tren — semua via CTE + filter luar.",
    },
    {
      id: "intuisi-window",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Window function menjawab “dibandingkan dengan tetangganya”, bukan “berapa totalnya”",
      prose: [
        "Kapan memakai window vs GROUP BY adalah keputusan arsitektural, bukan preferensi gaya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: GROUP BY meruntuhkan baris, window function mempertahankan baris",
        body: "Inilah pembeda yang menentukan segalanya: GROUP BY meruntuhkan banyak baris menjadi satu (kamu kehilangan detail), window function menghitung di atas “jendela” tetangga TANPA meruntuhkan (setiap baris tetap ada, kini ditemani konteksnya). Butuh “total per kota” sebagai SATU angka per kota → GROUP BY. Butuh “selisih tiap transaksi dari rata-rata kotanya” → window, karena kamu butuh tiap transaksi tetap tampil. Heuristik pemilihannya: bila pertanyaan mengandung kata “dibandingkan”, “peringkat”, “selisih dari”, “berjalan” (running), atau “sebelum/sesudah” — itu sinyal window. Bila pertanyaannya “berapa total/rata-rata per kelompok” dan detail baris tidak dibutuhkan lagi — itu GROUP BY. Kesalahan klasik adalah memakai window lalu membungkusnya dengan DISTINCT untuk “merapikan” — itu GROUP BY yang menyamar dan membayar biaya window tanpa manfaatnya. Pilih berdasarkan bentuk OUTPUT yang kamu butuhkan: baris detail + konteks → window; ringkasan per grup → GROUP BY.",
      },
      reference: "Butuh baris detail + konteks → window; butuh ringkasan → GROUP BY.",
    },
    {
      id: "frame-mendalam",
      eyebrow: "Langkah 7 · Frame",
      title: "Frame clause: ROWS vs RANGE, dan kapan jendelamu berbohong",
      prose: [
        "Kebanyakan tutorial berhenti di PARTITION BY + ORDER BY — padahal perilaku window function ditentukan oleh komponen ketiga yang tak terlihat: frame. Frame adalah “bingkai” yang menentukan baris mana yang ikut dihitung untuk tiap baris saat ini. Default-nya (bila ORDER BY ada tapi frame tidak ditulis): RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — dan kata RANGE di situlah jebakan terbesar lesson ini.",
        "ROWS vs RANGE — perbedaan yang mengubah angka: ROWS menghitung BARIS FISIK (1 baris = 1 baris), sedangkan RANGE menghitung NILAI LOGIS (semua baris dengan nilai ORDER BY yang sama = “satu”). Contoh konkret: running total dengan ORDER BY tanggal atas data yang punya DUA transaksi di tanggal yang sama. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW memberi tiap baris total kumulatif yang berbeda (baris kedua mencakup baris pertama). RANGE memberi KEDUA baris total yang SAMA — karena keduanya “se-tanggal”, keduanya melihat frame yang identik. Untuk laporan “running total per hari”, RANGE benar; untuk “running total per transaksi”, RANGE salah dan ROWS yang benar. Analis yang tidak tahu bedanya melaporkan angka kumulatif yang “anehnya” berulang — dan tidak ada error yang memberi tahu.",
        "Tiga pola frame yang wajib dikuasai: (1) UNBOUNDED PRECEDING AND CURRENT ROW — kumulatif dari awal (“running total”); (2) ROWS BETWEEN 6 PRECEDING AND CURRENT ROW — rata-rata 7-hari berjalan (moving average) yang hanya melihat 7 baris fisik terakhir; (3) ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING — seluruh partisi (“berapa persen dari total partisi”, penyebut untuk share). Catatan penting: begitu kamu menulis frame eksplisit, default RANGE yang licik itu hilang — inilah alasan senior SELALU menulis frame eksplisit pada agregat window: bukan karena wajib, melainkan untuk membunuh ambiguitas.",
        "Kapan RANGE justru berbahaya di data nyata: kolom ORDER BY yang tidak unik (tanggal tanpa jam, kategori). RANGE menggabungkan semua “kembaran nilai” ke frame yang sama — running total-mu berhenti bertambah di tengah jalan padahal baris terus mengalir. Aturan: bila memakai RANGE, pastikan kamu MEMANG menginginkan semantik “per nilai”, bukan “per baris”. Bila ragu, ROWS + ORDER BY atas kunci unik (tanggal, id) adalah kombinasi yang perilakunya paling mudah diprediksi — deterministik penuh, tidak ada kembaran yang diam-diam digabung.",
        "Skew partisi — masalah performa window yang jarang dibahas: window dieksekusi PER PARTISI, dan partisi raksasa menjadi bottleneck. PARTITION BY kota dengan 60% data di “Jakarta” berarti satu partisi memproses 6 juta baris sementara partisi lain selesai dalam sekejap — paralelisme-mu lumpuh di satu titik. Gejalanya: query window yang lambat padahal total datanya “tidak terlalu besar”. Obatnya bertingkat: (1) saring dulu (WHERE) sebelum window — semakin kecil input, semakin kecil partisi terbesar; (2) bila hanya butuh agregat per partisi (bukan per baris), GROUP BY biasa + JOIN kembali sering jauh lebih murah daripada window; (3) untuk ranking global tanpa partisi (satu partisi raksasa = seluruh tabel), pastikan memang dibutuhkan — ORDER BY global + LIMIT N tanpa PARTITION memaksa satu sort raksasa.",
        "Dua aturan keputusan untuk menutup: pertama, ranking (ROW_NUMBER/RANK) tanpa ORDER BY yang deterministik di dalam OVER adalah undian — ties (nilai sama) boleh diurutkan acak antar eksekusi, sehingga “top 10” bisa berubah-ubah; tambahkan tie-breaker (ORDER BY nilai DESC, id) bila hasilnya dipakai untuk keputusan (pemenang, cutoff). Kedua, window function dievaluasi SETELAH WHERE/GROUP BY tetapi SEBELUM ORDER BY final — artinya kamu tidak bisa memfilter hasil window di WHERE yang sama (pakai subquery/CTE pembungkus), dan window melihat baris pasca-filter. Memahami urutan evaluasi ini menjelaskan 90% “kenapa query window-ku error/tidak seperti harapan”.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“ROWS dan RANGE sama saja.” Sama hanya bila nilai ORDER BY unik per baris. Begitu ada kembaran (dua transaksi tanggal sama, dua skor sama), RANGE menggabungkan mereka ke frame identik sedangkan ROWS memperlakukan tiap baris terpisah — running total, moving average, dan ranking bisa berbeda total. Selalu tulis frame eksplisit; jangan biarkan default RANGE memutuskan untukmu.",
      },
      reference: "Tulis frame eksplisit; ROWS = per baris fisik, RANGE = per nilai; tie-breaker untuk ranking keputusan.",
    },
    {
      id: "window-performa",
      eyebrow: "Langkah 8 · Window performa",
      title: "Kapan window boros, klausa WINDOW, dan chaining",
      prose: [
        "Window function yang paling boros adalah yang tidak perlu menjadi window. Pola klasik: SELECT DISTINCT kota, AVG(penghasilan) OVER (PARTITION BY kota) FROM nasabah — window menghitung rata-rata per kota untuk SETIAP baris (10 juta baris!), lalu DISTINCT meruntuhkannya menjadi 4 baris. Ini GROUP BY yang menyamar dan membayar biaya 10 juta komputasi untuk 4 angka. Aturan: bila output akhirnya RINGKASAN per grup (tanpa detail baris), pakai GROUP BY — window hanya bila tiap baris detail harus TETAP TAMPIL ditemani konteksnya. “Lihat dulu pakai window lalu DISTINCT” adalah kebiasaan yang harus dibunuh sejak dini.",
        "Sebaliknya, ada kasus window JAUH lebih murah dari alternatifnya: “selisih tiap transaksi dari rata-rata kotanya”. Versi GROUP BY + JOIN: agregat per kota (satu pass), lalu JOIN kembali ke 10 juta baris transaksi (satu join besar). Versi window: AVG(nominal) OVER (PARTITION BY kota) — satu pass, tanpa join. Di sini window menang karena ia menghindari join 10-juta-baris. Intuisi biayanya: window = satu sort per PARTITION key + satu pass; GROUP BY + self-join = satu agregasi + satu join besar. Bila tabelnya besar dan join key-nya tidak terindeks, window biasanya menang; bila tabel kecil, bedanya tidak penting — pilih yang terbaca.",
        "Klausa WINDOW bernama — fitur yang jarang dipakai tetapi merapikan query multi-window: SELECT ..., SUM(x) OVER w, AVG(x) OVER w, RANK() OVER w2 FROM t WINDOW w AS (PARTITION BY kota ORDER BY tanggal ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), w2 AS (PARTITION BY kota ORDER BY x DESC). Dua keuntungan: (1) definisi ditulis sekali — mengubah frame berarti mengubah satu tempat, bukan lima; (2) optimizer MELIHAT bahwa kelima window berbagi partisi/sort yang sama dan dapat berbagi SATU sort — tanpa klausa bernama, tiap OVER (...) yang teksnya sama “kebetulan” sama belum tentu dikenali sebagai satu. Untuk query dengan 3+ window sejenis, WINDOW bernama adalah dokumentasi + optimasi sekaligus.",
        "Chaining window — window di atas hasil window — membutuhkan subquery/CTE karena window dievaluasi dalam satu tahap logis: kamu tidak bisa menulis RANK() OVER (ORDER BY SUM(x) OVER (...)) langsung. Polanya: WITH base AS (SELECT ..., SUM(x) OVER (PARTITION BY kota) AS total_kota FROM t) SELECT ..., RANK() OVER (ORDER BY total_kota DESC) FROM base. Kasus nyatanya: “peringkat kota berdasarkan totalnya, tampilkan di tiap baris transaksi” — agregat dulu (level kota), ranking kemudian (level antar-kota). Tiap tingkat = satu CTE; mencampur dua level agregasi dalam satu SELECT adalah sumber bug “kenapa ranking-ku aneh”.",
        "Tiga aturan performa window untuk produksi: (1) saring SEBELUM window — WHERE di luar CTE/subquery pembungkus; window atas 1 juta baris (pasca-filter) vs 100 juta (pra-filter) adalah beda 100×; (2) partisi selektif — PARTITION BY atas kolom kardinalitas tinggi (user_id, 10 juta partisi kecil) umumnya lebih ramah memori daripada satu partisi raksasa; bila butuh agregat global tanpa partisi, pertimbangkan apakah GROUP BY + CROSS JOIN satu baris agregat lebih murah; (3) hindari ORDER BY di dalam OVER yang tidak dibutuhkan — ROW_NUMBER() OVER (ORDER BY x) memaksa sort; bila urutannya tidak penting (mis. hanya butuh penomoran arbitrer untuk sampling), OVER () tanpa ORDER BY menghindari sort — tetapi ingat: tanpa ORDER BY, penomorannya non-deterministik (kembali ke intuisi Langkah 6: untuk keputusan, selalu deterministik).",
        "Menutup dengan pola “filter hasil window” yang benar — karena window tidak bisa difilter di WHERE yang sama (urutan evaluasi!), tiga bentuknya: (a) butuh top-N per grup → subquery + WHERE rn <= N (pola Langkah 7); (b) butuh “kota dengan rata-rata di atas X” → GROUP BY + HAVING (bukan window!); (c) butuh keduanya (detail baris + saring grup) → CTE: hitung agregat window di CTE dalam, filter di SELECT luar atas kolom hasil window. Mencampur (b) dan (c) adalah sumber kebingungan paling umum: tanyakan “apakah outputku per BARIS atau per GRUP?” — jawabannya menentukan WHERE vs HAVING vs subquery.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Window function selalu lebih cepat dari self-join.” Kadang justru sebaliknya: untuk agregat sederhana per grup kecil yang hasilnya di-join kembali ke tabel KECIL, GROUP BY + join bisa menang — terutama bila ada index pada kunci join. Tidak ada “selalu”; ada EXPLAIN dan ada ukuran data. Klaim performa tanpa keduanya adalah opini.",
      },
      reference: "Ringkasan per grup → GROUP BY; detail + konteks → window; saring sebelum window; WINDOW bernama untuk multi-window.",
    },
    {
      id: "ranking-ties",
      eyebrow: "Langkah 9 · Ranking & ties",
      title: "RANK vs DENSE_RANK vs ROW_NUMBER: siapa menang saat seri",
      prose: [
        "Tiga fungsi ranking menjawab tiga pertanyaan berbeda tentang ties (nilai seri). Data: skor [100, 90, 90, 80]. ROW_NUMBER memberi [1, 2, 3, 4] — seri dipecah paksa (dengan tie-breaker, atau acak bila tidak ada). RANK memberi [1, 2, 2, 4] — seri berbagi peringkat, peringkat berikutnya MELOMPAT (tidak ada peringkat 3). DENSE_RANK memberi [1, 2, 2, 3] — seri berbagi, tanpa lompatan. Pilihannya bukan gaya — ia mengubah SIAPA yang lolos cutoff.",
        "Kasus keputusan “top 3 dapat bonus”: dengan RANK, WHERE rank <= 3 atas data di atas meloloskan 3 orang (peringkat 1, 2, 2) — benar 3 orang. Dengan ROW_NUMBER, 3 orang juga — tetapi SIAPA di antara dua yang seri 90 ditentukan tie-breaker (atau acak!). Dengan DENSE_RANK <= 3, lolos 4 orang (1, 2, 2, 3). Tiga fungsi, tiga daftar penerima bonus. Aturan: (1) “N orang” eksak → ROW_NUMBER + tie-breaker deterministik (adil prosedural, kejam pada yang seri); (2) “semua yang memenuhi standar” → RANK/DENSE_RANK dengan cutoff NILAI (skor >= 90), bukan cutoff peringkat — yang seri diperlakukan sama (adil substantif); (3) jangan pernah memakai ROW_NUMBER tanpa tie-breaker untuk keputusan — “acak” bukan prosedur yang bisa dipertahankan di depan komite.",
        "NTILE(n) — membagi urutan menjadi n keranjang — punya jebakan distribusi: NTILE(4) atas 10 baris memberi keranjang [3, 3, 2, 2] — tidak sama besar! Dan yang lebih licik: NTILE atas data dengan ties BESAR (1.000 baris bernilai sama dari 10.000) memecah ties secara arbitrer ke keranjang berbeda — dua nasabah dengan skor IDENTIK masuk decile berbeda. Untuk segmentasi (“decile risiko”), ini tidak adil dan tidak stabil. Alternatif yang benar: WIDTH_BUCKET / CASE atas NILAI (bukan urutan) — keranjang berdasarkan rentang skor, sehingga yang sama skornya selalu sekeranjang; atau CUME_DIST (proporsi kumulatif) untuk cutoff persen yang menghormati ties.",
        "PERCENT_RANK dan CUME_DIST untuk cutoff yang jujur: “masuk 10% teratas” seharusnya berarti CUME_DIST <= 0.10 — proporsi nilai ≤ nilai ini — yang otomatis mengikutkan SEMUA ties di batas (bila 12% berbagi nilai batas, 12% lolos; itu benar secara definisi “10% teratas” yang adil). Memakai ROW_NUMBER <= 10% × N justru memenggal ties secara arbitrer. Aturan keputusan: cutoff berbasis NILAI/PROPORSIties-aware (CUME_DIST, RANK atas nilai) untuk keadilan; ROW_NUMBER hanya untuk kuota eksak yang prosedurnya didokumentasikan dan tie-breaker-nya eksplisit.",
      ],
      tasks: [],
      reference: "Kuota eksak → ROW_NUMBER + tie-breaker; keadilan ties → RANK/CUME_DIST; NTILE memecah ties arbitrer.",
    },
    {
      id: "lab-frame",
      eyebrow: "Langkah 10 · Lab frame",
      title: "Lab: lihat sendiri ROWS vs RANGE berbohong",
      prose: [
        "Tabel trx2 sudah dimuat: 6 transaksi, tetapi tanggalnya hanya 3 hari — ada tanggal kembar (dua transaksi di 1 Sep, tiga di 3 Sep). Tugasmu: hitung running total dengan DUA frame sekaligus — rt_rows (ROWS) dan rt_range (RANGE) — lalu temukan di baris mana keduanya BERBEDA, dan jelaskan kenapa.",
        "Coba: setelah lolos, hapus ORDER BY tanggal, id di akhir dan jalankan ulang — apa yang terjadi pada urutan baris? Lalu ganti ORDER BY di dalam OVER menjadi ORDER BY tanggal, id (kunci unik): apakah rt_range masih “menggabungkan” tanggal kembar? Apa maknanya?",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan id, tanggal, nominal, rt_rows (frame ROWS), rt_range (frame RANGE), urut tanggal, id" },
        { id: "t2", text: "Jalankan: pastikan 6 baris, dan pada baris id=1 nilai rt_rows (100000) BERBEDA dari rt_range (300000)" },
      ],
      expected: "baris: 6 — id=1: rt_rows=100000 (satu baris fisik) vs rt_range=300000 (dua baris se-tanggal)",
      note: {
        title: "Sering salah",
        body: "Menulis frame hanya di satu kolom lalu menyimpulkan “sama saja”. Perbedaan ROWS vs RANGE HANYA muncul saat ada nilai kembar di ORDER BY — data lab yang “rapi” (tanggal unik semua) menyembunyikan perbedaan ini. Selalu uji frame dengan data yang mengandung kembaran.",
      },
      hints: [
        "KONSEP — Satu agregat yang sama (running total) dengan dua 'bingkai' berbeda di atas urutan tanggal yang sama. Bingkai pertama menghitung baris fisik satu per satu; bingkai kedua mengelompokkan berdasarkan NILAI tanggal — dan tanggal kembar di data ini membuat keduanya berbeda.",
        "CLUE — SUM(nominal) OVER (ORDER BY tanggal ...) ditulis dua kali: sekali dengan frame ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, sekali dengan RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.",
        "SKELETON — SELECT id, tanggal, nominal, SUM(nominal) OVER (ORDER BY tanggal ... BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rt_rows, SUM(nominal) OVER (ORDER BY tanggal ... BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rt_range FROM trx2 ORDER BY ...",
      ],
      code: {
        starter: SETUP_WF + TAIL_WF,
        lockLines: 18,
        solution:
          SETUP_WF +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT id, tanggal, nominal,
  SUM(nominal) OVER (ORDER BY tanggal ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rt_rows,
  SUM(nominal) OVER (ORDER BY tanggal RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rt_range
FROM trx2
ORDER BY tanggal, id
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql pada bagian editable." },
          { kind: "contains", task: "t1", name: "sql", value: "ROWS BETWEEN", label: "Ada frame ROWS", msg: "Satu window harus memakai frame ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW." },
          { kind: "contains", task: "t1", name: "sql", value: "RANGE BETWEEN", label: "Ada frame RANGE", msg: "Satu window harus memakai frame RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW." },
          { kind: "equal", task: "t1", name: "n", value: 6, tol: 1e-9, label: "6 baris kembali", msg: "Semua 6 transaksi harus tampil — window tidak meruntuhkan baris." },
          { kind: "stdout_matches", task: "t2", pattern: "\\(1, '2026-09-01', 100000(\\.0)?, 100000(\\.0)?, 300000(\\.0)?\\)", label: "id=1: ROWS ≠ RANGE", msg: "Baris id=1 adalah buktinya: rt_rows = 100000 (satu baris fisik) sedangkan rt_range = 300000 (semua yang se-tanggal). Inilah jebakan RANGE." },
        ],
      },
      reference: "Uji frame dengan data berkembar; ROWS = fisik, RANGE = nilai.",
    },
    transferStep,
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Window: hitung melintasi baris terkait tanpa melipat.",
        "Ranking: ROW_NUMBER (unik) / RANK (lompat) / DENSE_RANK (rapat).",
        "Pola top-N: CTE + PARTITION BY + saring rn ≤ N.",
        "LAG/LEAD: intip tetangga — butuh ORDER BY di OVER.",
        "Jangan: hasil window di WHERE langsung.",
      ],
      next: { label: "C9-2 — Window Functions (Agregat Berjalan)", href: "/v2/learn/c9-window-functions-2" },
      quiz: [
        {
          q: "Window function vs GROUP BY — bedanya?",
          options: [
            { text: "Sama saja — window function hanyalah GROUP BY dengan sintaks berbeda", why: "Salah — nasib barisnya berlawanan: GROUP BY melipat, window mempertahankan tiap baris." },
            { text: "Window tidak melipat baris; GROUP BY melipat", why: "Benar. Window menambah kolom konteks, tiap baris tetap ada.", correct: true },
            { text: "GROUP BY selalu lebih cepat, jadi window function tidak pernah dibutuhkan", why: "Salah — untuk 'detail + konteks' (mis. selisih tiap baris dari rata-rata grupnya), window menghindari self-join yang mahal." },
          ],
        },
        {
          q: "`WHERE rn <= 2` langsung pada query ber-ROW_NUMBER?",
          options: [
            { text: "Berhasil — window dihitung sebelum WHERE seperti fungsi agregat", why: "Salah — justru sebaliknya: window dihitung SETELAH WHERE, jadi rn belum ada saat WHERE berjalan." },
            { text: "Error — window tak bisa di WHERE; bungkus CTE dulu", why: "Benar. Urutan eksekusi: WHERE dulu, window kemudian.", correct: true },
            { text: "Berhasil di SQLite tapi error di database lain", why: "Salah — ini aturan urutan evaluasi SQL standar, bukan perbedaan dialek." },
          ],
        },
        {
          q: "Nilai: 100, 90, 90, 80. RANK menghasilkan?",
          options: [
            { text: "1,2,3,4", why: "Salah — itu ROW_NUMBER." },
            { text: "1,2,2,4", why: "Benar. RANK melompat setelah seri.", correct: true },
            { text: "1,2,2,3", why: "Salah — itu DENSE_RANK." },
          ],
        },
        {
          q: "Dedup “ambil baris terbaru per id”?",
          options: [
            { text: "DISTINCT", why: "Salah — DISTINCT tak cukup untuk duplikat tak-identik (beda timestamp)." },
            { text: "ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), saring rn=1", why: "Benar. Pola dedup nomor satu.", correct: true },
            { text: "GROUP BY id", why: "Salah — kolom lain jadi tidak tentu." },
          ],
        },
        {
          q: "LAG butuh?",
          options: [
            { text: "GROUP BY tanggal", why: "Salah — GROUP BY melipat baris; kamu butuh tiap transaksi tetap tampil ditemani nilai 'kemarin'-nya." },
            { text: "ORDER BY di dalam OVER", why: "Benar. Tanpa ORDER BY, “baris sebelumnya” tidak punya makna.", correct: true },
            { text: "ORDER BY di SELECT luar saja", why: "Salah — ORDER BY luar hanya mengatur tampilan akhir; LAG butuh urutannya sendiri di dalam OVER." },
          ],
        },
      ],
    },
  ],
};

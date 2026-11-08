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
cur.executescript("""CREATE TABLE kredit (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  plafon REAL,
  tenor INTEGER,
  dpd INTEGER,
  kolektibilitas INTEGER
)""")
data_kredit = [
    (1, 1, 50000000, 12, 0, 1),
    (2, 2, 100000000, 24, 15, 2),
    (3, 3, 30000000, 12, 45, 3),
    (4, 4, 200000000, 36, 0, 1),
    (5, 5, 75000000, 24, 90, 4),
    (6, 6, 40000000, 12, 5, 1),
    (7, 7, 60000000, 18, 30, 2),
    (8, 8, 90000000, 24, 0, 1),
    (9, 9, 25000000, 12, 120, 5),
    (10, 10, 55000000, 18, 0, 1),
    (11, 2, 30000000, 12, 60, 3),
    (12, 5, 20000000, 6, 150, 5)
]
cur.executemany("INSERT INTO kredit VALUES (?,?,?,?,?,?)", data_kredit)
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

export const c5: V2Lesson = {
  slug: "c5-join",
  track: "SQL",
  module: "Fondasi",
  title: "C5 JOIN: Menyambung Tabel tanpa Menggandakan Fakta",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-fanout",
      eyebrow: "Langkah 1 · Fan-out",
      title: "Total plafon yang tiba-tiba 2× lipat",
      prose: [
        "Analis menggabungkan `nasabah` dan `kredit` untuk menghitung total plafon per kota. Hasilnya: Rp 1,4 miliar — padahal kemarin Rp 800 juta. Tidak ada kredit baru. Apa yang terjadi? Budi punya 2 kredit. JOIN menduplikasi baris Budi — dan kolom penghasilannya ikut terganda. Setiap SUM/AVG setelah JOIN fan-out salah diam-diam.",
        "Budi tidak menambah kredit — tapi total naik Rp 600 juta. Tidak ada data baru, tidak ada error sintaks; query-nya “jalan sempurna” dan hasilnya salah. JOIN tidak merusak data — ia melipatgandakannya diam-diam, dan SUM yang polos tidak bisa membedakan “2 kredit Budi” dari “2 Budi”. Bug paling mahal di SQL bukan yang error — melainkan yang terlihat benar.",
        "Aturan: agregat kolom dari tabel “satu” (nasabah) setelah join ke tabel “banyak” (kredit) = salah, kecuali di-COUNT DISTINCT / di-pre-agregasi. Pola aman: agregasi dulu di level yang benar (subquery/CTE — C6/C7), baru join. Validasi: `COUNT(*)` sebelum vs sesudah JOIN — jika membengkak, ada fan-out.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Duplikat setelah JOIN bisa dibersihkan dengan DISTINCT.” Salah — DISTINCT menyembunyikan gejala tapi merusak SUM (dua kredit Budi yang sah jadi satu!). Obati penyebab: agregasi di level granularitas yang benar.",
      },
      reference: "Fan-out: 1-ke-banyak menggandakan baris. Agregasi dulu, baru join.",
    },
    {
      id: "inner-join",
      eyebrow: "Langkah 2 · INNER JOIN",
      title: "Irisan: hanya yang cocok di kedua sisi",
      prose: [
        "`SELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id` — hanya baris yang cocok di kedua tabel. `ON` = syarat pencocokan (biasanya PK = FK: `kredit.nasabah_id` menunjuk ke `nasabah.id`). Alias tabel wajib untuk keterbacaan — tulis `INNER JOIN` eksplisit, jangan cuma `JOIN`.",
        "Di lab ini kamu filter kredit macet (`kolektibilitas = 5`) langsung di ON. Kredit dengan kolektibilitas 5: milik Irfan (plafon 25jt) dan Eko (plafon 20jt).",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: nama nasabah + plafon untuk kredit macet — `INNER JOIN` dengan kondisi `k.kolektibilitas = 5` di ON" },
        { id: "t2", text: "Jalankan dan pastikan 2 baris kembali: Eko dan Irfan" },
      ],
      expected: "baris: 2 — Eko (20000000), Irfan (25000000)",
      hints: [
        "Saring tabel kanan di ON, bukan di WHERE: ON k.nasabah_id = n.id AND k.kolektibilitas = 5.",
        "Hanya nasabah yang punya kredit macet yang muncul di INNER JOIN.",
        "SELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id AND k.kolektibilitas = 5",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 48,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT n.nama, k.plafon FROM nasabah n
INNER JOIN kredit k ON k.nasabah_id = n.id AND k.kolektibilitas = 5
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "n", value: 2, tol: 1e-9, label: "2 baris kembali", msg: "Kredit kolektibilitas 5 hanya milik Eko dan Irfan." },
          { kind: "stdout_matches", task: "t2", pattern: "Irfan[\\s\\S]*25000000", label: "Irfan dengan plafon 25jt muncul", msg: "Cek JOIN + kondisi kolektibilitas di ON." },
        ],
      },
      reference: "INNER JOIN = irisan; ON = syarat pencocokan; alias tabel selalu.",
    },
    {
      id: "left-join",
      eyebrow: "Langkah 3 · LEFT JOIN",
      title: "Jangan hilangkan baris",
      prose: [
        "`LEFT JOIN` mempertahankan semua baris kiri; yang tidak cocok → NULL di kolom kanan. “Semua nasabah + total transaksinya (0 jika tidak ada)” → `LEFT JOIN` + `COALESCE(SUM(...), 0)`. Dengan INNER, nasabah tanpa transaksi hilang — laporan “nasabah tidak aktif” mustahil dibuat. Pilihan JOIN adalah keputusan bisnis, bukan gaya: tanyakan dulu “bolehkah baris hilang?”",
        "Jebakan lanjutan: `WHERE k.plafon > 1000000` setelah `LEFT JOIN` membunuh baris NULL — mengubahnya jadi INNER diam-diam! Filter tabel kanan harus di ON, bukan WHERE.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: semua nasabah + plafon kredit macetnya (`LEFT JOIN`, kondisi kol=5 di ON), urut id" },
        { id: "t2", text: "Hitung `punya` = jumlah baris dengan plafon tidak NULL, lalu cetak" },
      ],
      expected: "baris: 10 (semua nasabah); punya = 2 (Eko, Irfan); sisanya NULL",
      note: {
        title: "Sering salah",
        body: "“LEFT JOIN dan INNER JOIN hasilnya sama kalau datanya bersih.” Salah — INNER membuang yang tidak cocok diam-diam, bahkan di data bersih. Aturan: tidak boleh ada baris hilang → LEFT.",
      },
      hints: [
        "Ganti INNER menjadi LEFT, kondisi tetap di ON.",
        "Hitung yang tidak NULL: sum(1 for r in rows if r[1] is not None).",
        "punya = sum(1 for r in rows if r[1] is not None)  →  print(punya)",
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
# TULIS KODEMU: hitung baris dengan plafon tidak NULL
punya =

print("baris:", n)
print("punya kredit macet:", punya)`,
        lockLines: 48,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT n.nama, k.plafon FROM nasabah n
LEFT JOIN kredit k ON k.nasabah_id = n.id AND k.kolektibilitas = 5
ORDER BY n.id
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: hitung baris dengan plafon tidak NULL
punya = sum(1 for r in rows if r[1] is not None)

print("baris:", n)
print("punya kredit macet:", punya)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "LEFT", label: "Query memakai LEFT JOIN", msg: "Ganti INNER menjadi LEFT JOIN agar semua nasabah dipertahankan." },
          { kind: "equal", task: "t1", name: "n", value: 10, tol: 1e-9, label: "10 baris (semua nasabah)", msg: "LEFT JOIN mempertahankan seluruh 10 nasabah." },
          { kind: "equal", task: "t2", name: "punya", value: 2, tol: 1e-9, label: "`punya` seharusnya 2", msg: "Hanya Eko dan Irfan yang punya kredit kolektibilitas 5." },
        ],
      },
      reference: "LEFT = pertahankan kiri; filter tabel kanan di ON, bukan WHERE.",
    },
    {
      id: "lab-fanout",
      eyebrow: "Langkah 4 · Lab fan-out",
      title: "Menangkap penggandaan",
      prose: [
        "Sekarang buktikan fan-out dengan angka. Total penghasilan semua nasabah tanpa JOIN = Rp 84.500.000 (Eko NULL tidak ikut). Hitung `SUM(n.penghasilan)` setelah JOIN ke kredit — Budi terhitung 2× karena punya 2 kredit.",
        "Selisihnya = Rp 12.000.000, tepat sebesar penghasilan Budi yang terganda. Inilah tes fan-out tercepat: bandingkan agregat sebelum vs sesudah JOIN.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: `SUM(n.penghasilan)` dari `nasabah n JOIN kredit k ON k.nasabah_id = n.id`" },
        { id: "t2", text: "Hitung `total` dari hasil dan `selisih = total - 84500000`, lalu cetak keduanya" },
      ],
      expected: "total=96500000, selisih=12000000 (penghasilan Budi terganda)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risk reporting, fan-out menggandakan exposure diam-diam — total plafon atau total gaji debitur bisa 2× lipat tanpa ada data baru. Selalu validasi COUNT(*) sebelum vs sesudah JOIN sebelum mengirim laporan.",
      },
      hints: [
        "Query: SELECT SUM(n.penghasilan) FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id",
        "total = rows[0][0]; selisih = total - 84500000.",
        "Selisih 12.000.000 = penghasilan Budi (12jt) yang terhitung dua kali.",
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
# TULIS KODEMU: total dan selisih vs 84500000 (tanpa join)
total =
selisih =

print(f"total: {total}")
print(f"selisih: {selisih}")`,
        lockLines: 48,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT SUM(n.penghasilan) FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: total dan selisih vs 84500000 (tanpa join)
total = rows[0][0]
selisih = total - 84500000

print(f"total: {total}")
print(f"selisih: {selisih}")`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "total", value: 96500000, tol: 1e-9, label: "`total` seharusnya 96500000", msg: "84,5jt + 12jt (Budi terganda) = 96,5jt." },
          { kind: "equal", task: "t2", name: "selisih", value: 12000000, tol: 1e-9, label: "`selisih` seharusnya 12000000", msg: "Selisih = penghasilan Budi (12jt) yang terhitung 2×." },
        ],
      },
      reference: "Tes fan-out: agregat sebelum vs sesudah JOIN. Beda = baris terganda.",
    },
    {
      id: "minicase-plafon",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Total plafon 2× lipat",
      prose: [
        "Analis melaporkan total plafon Rp 1,4 M (harusnya ~Rp 800 jt). Setelah diperiksa, analis menjumlah `k.plafon` dengan benar — tapi juga menampilkan `SUM(n.penghasilan)` sebagai “total gaji debitur”: angka gaji yang 2× lipat.",
        "Pembahasan: (a) Budi & Eko punya 2 kredit → barisnya ganda → penghasilan ikut terjumlah 2×. Plafon benar karena granularitasnya memang per kredit. (b) Query benar untuk “total gaji unik debitur per kota”: dedup dulu, agregat kemudian — `SELECT n.kota, SUM(n.penghasilan) FROM (SELECT DISTINCT id, kota, penghasilan FROM nasabah WHERE id IN (SELECT nasabah_id FROM kredit)) n GROUP BY n.kota;` — atau agregasi per nasabah di CTE (C7).",
        "Pelajaran: agregat mengikuti granularitas baris — bukan keinginanmu.",
      ],
      tasks: [],
      reference: "Dedup dulu (atau agregasi per kunci di CTE), agregat kemudian.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "JOIN: alat mana untuk apa",
      prose: [
        "Kedua sisi wajib ada → INNER (default; baris tak cocok hilang — pastikan itu yang kamu mau). Pertahankan satu sisi → LEFT (default aman untuk laporan lengkap). Rekonsiliasi dua sisi → FULL OUTER (“apa yang hilang di mana?”). Agregat setelah JOIN → cek fan-out dulu (agregasi dulu di subquery, atau COUNT DISTINCT). Hasil meledak → berhenti, cek COUNT(*) — lupa ON = CROSS JOIN tak disengaja (10 × 12 = 120 baris; di produksi: jutaan²).",
        "Aturan praktis: alias tabel selalu, ON selalu eksplisit. Tanya “bolehkah baris hilang?” — tidak → LEFT. Self-join (tabel join dirinya sendiri, mis. karyawan–atasan) butuh dua alias berbeda.",
      ],
      tasks: [],
      reference: "INNER irisan; LEFT pertahankan; FULL rekonsiliasi; ON selalu eksplisit.",
    },
    {
      id: "intuisi-join",
      eyebrow: "Langkah 7 · Intuisi",
      title: "JOIN tidak menggabungkan tabel — ia mengalikan baris",
      prose: [
        "Model mental yang menyelamatkan: JOIN adalah perkalian baris yang dikendalikan kondisi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: sebelum JOIN, tanyakan “berapa baris per kunci di tiap sisi?”",
        body: "Setiap bug JOIN yang mahal berakar pada satu pertanyaan yang tidak ditanyakan: untuk satu nilai kunci, ada berapa baris di tabel kiri dan berapa di tabel kanan? 1-ke-1 aman; 1-ke-banyak menggandakan baris sisi “satu” (inilah fan-out yang menggelembungkan SUM); banyak-ke-banyak meledak kuadratis. Heuristik praktisi: sebelum menulis JOIN, jalankan COUNT(*) GROUP BY kunci di kedua tabel untuk kunci yang kamu pakai — 30 detik yang menghemat 3 jam debugging angka yang “tiba-tiba” membengkak. Dan bila total agregatmu berubah hanya karena menambah satu JOIN, berhentilah: itu bukan data baru, itu perkalian baris. Agregasi dulu per kunci, baru join — urutan ini bukan gaya, melainkan aritmetika.",
      },
      reference: "JOIN = perkalian baris; cek kardinalitas kunci dulu, agregat dulu baru join.",
    },
    {
      id: "algoritma-join",
      eyebrow: "Langkah 8 · Mesin JOIN",
      title: "Di balik layar: nested loop, merge, hash — dan skew",
      prose: [
        "Database tidak “menggabungkan” secara ajaib; ia memilih salah satu dari tiga algoritma. Nested loop: untuk tiap baris kiri, cari pasangan di kanan (memakai index bila ada) — cocok untuk tabel kecil atau sisi luar yang sangat selektif. Merge join: kedua sisi diurutkan dulu lalu digabungkan sekali jalan — tercepat bila input sudah terurut (atau terindeks) dan ukurannya seimbang. Hash join: sisi kecil dibangun menjadi tabel hash di memori, sisi besar dipindai sekali — juara untuk join dua tabel besar tanpa index. Kamu tidak memilih algoritmanya secara langsung, tetapi kamu memengaruhinya: index pada kunci join membuka nested loop/merge, statistik tabel yang segar membantu optimizer memilih dengan benar.",
        "Musuh ketiganya adalah skew: satu nilai kunci yang mendominasi. JOIN transaksi ke tabel nasabah biasanya aman — tetapi JOIN ke tabel kota tempat 60% transaksi berkode “Jakarta” membuat satu partisi hash raksasa: satu worker mengerjakan 60% data sementara yang lain menganggur. Gejalanya: query yang “seharusnya” paralel tetap lambat di satu tahap. Obat praktis: filter atau pisahkan kunci dominan dulu (proses Jakarta terpisah), atau agregasi parsial sebelum join sehingga volume yang di-join menyusut drastis.",
        "Dua pola rewrite yang wajib dikuasai. Semi-join (“yang punya pasangan”): WHERE EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id) — berhenti di pasangan pertama, tidak menggandakan baris, dan tidak butuh DISTINCT. Anti-join (“yang tidak punya pasangan”): WHERE NOT EXISTS (...) — aman dari jebakan NULL yang menghantui NOT IN. Aturan keputusan: butuh kolom dari tabel kanan? → JOIN (dan waspadai fan-out). Hanya butuh uji keberadaan? → EXISTS / NOT EXISTS — lebih murah dan lebih aman. IN dengan daftar kecil dan kolom NOT NULL boleh; IN dengan subquery yang mungkin mengandung NULL — jangan.",
      ],
      tasks: [],
      reference: "Kecil+selektif → nested loop; besar+terurut → merge; besar tanpa index → hash; skew → pisahkan kunci dominan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "INNER = irisan; LEFT = pertahankan kiri; FULL = rekonsiliasi dua sisi.",
        "Pilih JOIN = pilih siapa boleh hilang — keputusan bisnis, bukan gaya.",
        "Fan-out: 1-ke-banyak menggandakan baris → agregat tabel-satu salah.",
        "Pola aman: agregasi dulu (subquery/CTE), baru join; COUNT(*) sebelum vs sesudah.",
        "Jangan: lupa ON (CROSS JOIN meledak); DISTINCT untuk menutupi fan-out.",
      ],
      next: { label: "C6 — Subquery", href: "/v2/learn/c6-subquery" },
      quiz: [
        {
          q: "Nasabah tanpa kredit pada INNER JOIN nasabah–kredit?",
          options: [
            { text: "Tetap muncul (NULL)", why: "Salah — itu perilaku LEFT JOIN." },
            { text: "Hilang", why: "Benar. INNER hanya yang cocok. Butuh mereka? Pakai LEFT.", correct: true },
            { text: "Error", why: "Salah — tidak error, hanya hilang diam-diam." },
          ],
        },
        {
          q: "“Semua nasabah + total transaksinya (0 jika tidak ada)” butuh?",
          options: [
            { text: "INNER JOIN", why: "Salah — nasabah tanpa transaksi hilang." },
            { text: "LEFT JOIN + COALESCE", why: "Benar. LEFT pertahankan nasabah; COALESCE ubah NULL jadi 0.", correct: true },
            { text: "CROSS JOIN", why: "Salah — itu perkalian semua pasangan, bukan yang diminta." },
          ],
        },
        {
          q: "Fan-out: Budi punya 2 kredit. `SUM(n.penghasilan)` setelah JOIN?",
          options: [
            { text: "Benar", why: "Salah — Budi terhitung 2×." },
            { text: "Terhitung 2× — salah", why: "Benar. Baris ganda → agregat kolom tabel-satu salah.", correct: true },
            { text: "NULL", why: "Salah — tidak ada yang jadi NULL karenanya." },
          ],
        },
        {
          q: "Cara aman agregat setelah JOIN 1-ke-banyak?",
          options: [
            { text: "DISTINCT", why: "Salah — menutupi gejala dan merusak SUM yang sah." },
            { text: "Agregasi dulu di subquery/CTE, atau COUNT DISTINCT", why: "Benar. Perbaiki granularitas dulu.", correct: true },
            { text: "ORDER BY", why: "Salah — urutan tidak memperbaiki penggandaan." },
          ],
        },
        {
          q: "Lupa ON pada JOIN 10 × 12 baris?",
          options: [
            { text: "10 baris", why: "Salah." },
            { text: "120 baris (CROSS)", why: "Benar. CROSS JOIN = perkalian. Di produksi bisa jutaan² — selalu cek COUNT(*).", correct: true },
            { text: "Error", why: "Salah — tidak error, hanya meledak." },
          ],
        },
      ],
    },
  ],
};

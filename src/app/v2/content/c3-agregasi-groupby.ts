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

export const c3: V2Lesson = {
  slug: "c3-agregasi-groupby",
  track: "SQL",
  module: "Fondasi",
  title: "C3 GROUP BY: Dari Jutaan Baris ke Satu Insight",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-npl",
      eyebrow: "Langkah 1 · Fungsi agregasi",
      title: "“Berapa NPL kita?” dalam satu query",
      prose: [
        "Direksi bertanya saat rapat: “Berapa NPL (kredit macet) kita per kota?” Datamu: 2 juta baris kredit. Tanpa agregasi, kamu tidak bisa menjawab — tidak ada manusia yang membaca 2 juta baris. Dengan `GROUP BY`: 1 query, 4 baris hasil — NPL per kota.",
        "Tapi agregasi juga jebakan: ia menyembunyikan distribusi. “Rata-rata NPL 3%” bisa berarti semua kota 3%, ATAU satu kota 30% dan sisanya 0%. Analis senior selalu bertanya: “distribusi di balik rata-rata ini seperti apa?”",
        "Lima serangkai: `COUNT(*)` (termasuk NULL), `COUNT(kolom)` (melewatkan NULL!), `SUM`, `AVG` (pembagi = non-NULL saja!), `MIN`/`MAX`. Hasil di data lab: `COUNT(*)` = 10, `COUNT(penghasilan)` = 9 (Eko NULL!), dan rata-rata gaji dihitung dari 9 saja.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan `COUNT(*)` sebagai `n`, `COUNT(penghasilan)` sebagai `ada_gaji`, `MAX(dpd)` sebagai `dpd_terburuk`" },
        { id: "t2", text: "Hitung `selisih = n - ada_gaji` dari hasil, lalu cetak" },
      ],
      expected: "n=10, ada_gaji=9, dpd_terburuk=120, selisih=1",
      note: {
        title: "Sering salah",
        body: "`AVG(kolom)` bukan `SUM / COUNT(*)`! `AVG` = SUM / COUNT(kolom) — NULL tidak dihitung sebagai 0. Jika 1 dari 10 gaji NULL, AVG membagi 9, bukan 10. Untuk “rata-rata dengan NULL sebagai 0”, tulis eksplisit: `SUM(COALESCE(gaji,0)) / COUNT(*)`.",
      },
      hints: [
        "Satu SELECT dengan tiga fungsi agregat, tanpa GROUP BY.",
        "Ambil baris pertama: rows[0] = (n, ada_gaji, dpd_terburuk).",
        "selisih = rows[0][0] - rows[0][1]  →  print(f\"selisih: {selisih}\")",
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
# TULIS KODEMU: selisih = n - ada_gaji
selisih =

print(f"selisih: {selisih}")
print("dpd_terburuk:", rows[0][2])`,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT COUNT(*) AS n, COUNT(penghasilan) AS ada_gaji, MAX(dpd) AS dpd_terburuk FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: selisih = n - ada_gaji
selisih = rows[0][0] - rows[0][1]

print(f"selisih: {selisih}")
print("dpd_terburuk:", rows[0][2])`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "selisih", value: 1, tol: 1e-9, label: "`selisih` seharusnya 1", msg: "COUNT(*) = 10, COUNT(penghasilan) = 9. Selisihnya = 1 NULL." },
          { kind: "stdout_matches", task: "t2", pattern: "dpd_terburuk:\\s*120", label: "dpd_terburuk = 120", msg: "MAX(dpd) = 120 (Irfan). Cek fungsi agregat ketigamu." },
        ],
      },
      reference: "COUNT(*)/COUNT(kolom)/SUM/AVG/MIN/MAX — waspadai NULL di setiap fungsi.",
    },
    {
      id: "groupby-having",
      eyebrow: "Langkah 2 · GROUP BY & HAVING",
      title: "Meringkas per kelompok, menyaring per grup",
      prose: [
        "`SELECT kota, COUNT(*) AS n, AVG(penghasilan) AS rata_gaji, MAX(dpd) AS max_dpd FROM nasabah GROUP BY kota` — baris dikelompokkan per kota, agregasi dihitung per grup. Aturan keras: setiap kolom di SELECT harus agregat atau ada di GROUP BY. Satu grup punya banyak nama, jadi `SELECT nama ... GROUP BY kota` tidak bermakna — nama yang mana?",
        "`WHERE` menyaring baris (sebelum grup). `HAVING` menyaring grup (sesudah agregasi): `... GROUP BY kota HAVING COUNT(*) >= 3`. Ingat urutan eksekusi: WHERE jalan sebelum GROUP BY, jadi agregat belum ada saat WHERE bekerja — itulah kenapa `WHERE COUNT(*) >= 3` salah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: per kota tampilkan `COUNT(*)` sebagai `n` dan `AVG(penghasilan)` sebagai `rata`, urut `rata` menurun" },
        { id: "t2", text: "Jalankan dan pastikan 4 baris kembali, baris pertama Bandung" },
      ],
      expected: "baris: 4 — Bandung (10600000), Surabaya (10200000), Jakarta (8733333), Medan (8350000)",
      note: {
        title: "Sering salah",
        body: "`GROUP BY` tidak menjamin urutan hasil! Di beberapa database hasilnya terlihat urut (efek samping implementasi) — tapi standar SQL tidak menjanjikan. Butuh urutan? Tambahkan ORDER BY eksplisit.",
      },
      hints: [
        "GROUP BY kota, lalu ORDER BY rata DESC.",
        "Rata-rata Jakarta dihitung dari 3 (Eko NULL tidak ikut).",
        "SELECT kota, COUNT(*) AS n, AVG(penghasilan) AS rata FROM nasabah GROUP BY kota ORDER BY rata DESC",
      ],
      code: {
        starter: SETUP + TAIL,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT kota, COUNT(*) AS n, AVG(penghasilan) AS rata
FROM nasabah GROUP BY kota ORDER BY rata DESC
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "GROUP BY", label: "Query memakai GROUP BY", msg: "Kelompokkan dengan GROUP BY kota." },
          { kind: "equal", task: "t2", name: "n", value: 4, tol: 1e-9, label: "4 baris (4 kota)", msg: "Ada 4 kota: Jakarta, Bandung, Surabaya, Medan." },
          { kind: "stdout_matches", task: "t2", pattern: "\\('Bandung', 2, 10600000", label: "Baris pertama Bandung", msg: "Rata-rata Bandung = (12jt + 9,2jt)/2 = 10,6jt — tertinggi. Cek ORDER BY rata DESC." },
        ],
      },
      reference: "GROUP BY = agregat per grup; HAVING = WHERE-nya grup; kolom SELECT harus agregat atau di GROUP BY.",
    },
    {
      id: "conditional-agg",
      eyebrow: "Langkah 3 · Conditional aggregation",
      title: "Pola nomor satu interview SQL",
      prose: [
        "Menghitung agregat bersyarat dalam satu query — tanpa GROUP BY tambahan: `SELECT COUNT(*) AS total, COUNT(CASE WHEN dpd > 30 THEN 1 END) AS n_bermasalah, COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*) AS pct_bermasalah FROM nasabah`. `CASE WHEN` menghasilkan 1 hanya untuk baris yang cocok (else NULL), lalu COUNT menghitung yang non-NULL. Satu scan tabel → banyak metrik.",
        "Rumus NPL satu query: `SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) / SUM(plafon)`. Hafalkan pola ini — ia menjawab “berapa % ...” untuk semua varian pertanyaan bisnis. Catatan: `100.0 *` (bukan `100`) agar pembagian jadi desimal, bukan integer.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: dalam SATU query hitung `total` nasabah, `pct_bermasalah` (% dengan dpd > 30), dan `rata_jakarta` (rata-rata penghasilan khusus Jakarta)" },
        { id: "t2", text: "Hitung `pct` = pct_bermasalah dari hasil dan pastikan = 0.3" },
      ],
      expected: "total=10, pct_bermasalah=0.3 (Citra, Eko, Irfan), rata_jakarta=8733333.33",
      note: {
        title: "Sering salah",
        body: "“Untuk tiap metrik butuh query terpisah” — justru conditional aggregation menggabungkan puluhan metrik dalam SATU scan: lebih cepat dan konsisten (satu definisi populasi).",
      },
      hints: [
        "COUNT(CASE WHEN dpd > 30 THEN 1 END) menghitung yang cocok saja.",
        "Rata-rata bersyarat: AVG(CASE WHEN kota = 'Jakarta' THEN penghasilan END).",
        "pct = rows[0][1]  →  pastikan 0.3 (3 dari 10 nasabah ber-dpd > 30).",
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
# TULIS KODEMU: ambil pct_bermasalah dari hasil
pct =

print(f"pct: {pct}")`,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT COUNT(*) AS total,
COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*) AS pct_bermasalah,
AVG(CASE WHEN kota = 'Jakarta' THEN penghasilan END) AS rata_jakarta
FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: ambil pct_bermasalah dari hasil
pct = rows[0][1]

print(f"pct: {pct}")`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "CASE WHEN", label: "Query memakai CASE WHEN", msg: "Pola conditional aggregation memakai CASE WHEN di dalam fungsi agregat." },
          { kind: "equal", task: "t2", name: "pct", value: 0.3, tol: 1e-9, label: "`pct` seharusnya 0.3", msg: "dpd > 30: Citra (45), Eko (90), Irfan (120) = 3 dari 10." },
        ],
      },
      reference: "COUNT(CASE WHEN syarat THEN 1 END) * 1.0 / COUNT(*) = % yang memenuhi syarat.",
    },
    {
      id: "minicase-npl",
      eyebrow: "Langkah 4 · Mini-case",
      title: "NPL ratio per kota untuk direksi",
      prose: [
        "Definisi: NPL = kolektibilitas ≥ 3 (kurang lancar/diragukan/macet). Direksi minta NPL ratio (berdasar plafon) per kota + jumlah debitur, pagi ini. Query-nya: `SELECT n.kota, COUNT(DISTINCT n.id) AS debitur, SUM(CASE WHEN k.kolektibilitas >= 3 THEN k.plafon ELSE 0 END) / SUM(k.plafon) AS npl_ratio FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id GROUP BY n.kota;`",
        "Sebelum kirim, cek empat hal: (1) duplikat nasabah — satu nasabah bisa punya 2 kredit, pakai COUNT DISTINCT; (2) NULL di plafon/kolektibilitas; (3) definisi NPL disepakati (≥3?); (4) n per kota — kota dengan 2 debitur tidak bisa dibandingkan dengan 2.000. Query benar + validasi = laporan dipercaya; query benar tanpa validasi = bom waktu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "NPL regulator dihitung berdasar baki debet (nominal), bukan jumlah debitur — satu debitur besar mengubah segalanya. Selalu tampilkan nominal + ratio berdampingan.",
      },
      reference: "NPL ratio = SUM(CASE WHEN kol >= 3 THEN plafon ELSE 0 END) / SUM(plafon).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Agregasi: alat mana untuk apa",
      prose: [
        "Satu angka ringkas → agregasi tanpa GROUP BY (total nasabah, total plafon). Perbandingan antar kelompok → GROUP BY (NPL per kota). Saring grup → HAVING (“kota dengan n ≥ 100”). Banyak metrik bersyarat sekaligus → conditional aggregation (“berapa % yang ...” dalam satu query). Curiga duplikat → `COUNT(*) vs COUNT(DISTINCT id)` sebelum agregat — duplikat menggandakan SUM/COUNT diam-diam.",
        "Aturan praktis: kolom SELECT = agregat atau di GROUP BY, tidak ada pilihan ketiga. Saring baris → WHERE; saring grup → HAVING. Selalu tampilkan n per grup, dan waspadai NULL di agregat. Dan jangan pernah menghitung “rata-rata dari rata-rata” — agregat selalu dari baris mentah, bukan dari hasil agregat.",
      ],
      tasks: [],
      reference: "WHERE saring baris; HAVING saring grup; CASE dalam agregat untuk % bersyarat.",
    },
    {
      id: "intuisi-agregasi",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Agregasi menjawab “berapa”, tapi menyembunyikan “bagaimana tersebar”",
      prose: [
        "Satu angka agregat selalu berbohong dengan cara yang sama: ia meratakan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: setiap angka agregat wajib ditemani pertanyaan “distribusinya seperti apa?”",
        body: "“Rata-rata NPL 3%” bisa berarti semua kota 3% (masalah sistemik, obatnya kebijakan), atau satu kota 30% dan sisanya 0% (masalah lokal, obatnya intervensi cabang). Kedua dunia menghasilkan angka yang sama tetapi menuntut tindakan yang berlawanan — dan agregasi tidak bisa membedakannya. Heuristik praktisi: jangan pernah melaporkan satu angka sendirian; temani dengan minimal satu ukuran sebaran (min–max, atau COUNT per kelompok) dan waspadai kelompok kecil — rata-rata dari 3 debitur bukanlah statistik, melainkan anekdot berpakaian angka. Aturan yang lebih tajam: bila satu kelompok menyumbang >50% dari total agregat, laporkan kelompok itu secara terpisah, karena keputusanmu sebenarnya tentang dia, bukan tentang rata-rata. Agregasi adalah alat meringkas untuk pengambil keputusan, bukan alat menyembunyikan untuk analis yang malas melihat distribusi.",
      },
      reference: "Satu angka agregat = satu kebohongan potensial; selalu cek sebarannya.",
    },
    {
      id: "filter-rollup",
      eyebrow: "Langkah 7 · Agregasi lanjut",
      title: "FILTER, ROLLUP, dan biaya DISTINCT",
      prose: [
        "Tiga alat agregasi yang membedakan analis senior. Pertama, klausa FILTER: SELECT COUNT(*) FILTER (WHERE status = 'macet') AS n_macet, COUNT(*) AS n_total FROM kredit — menghitung subset tanpa GROUP BY tambahan dan tanpa self-join. Di Postgres didukung penuh; di SQLite, padanannya adalah SUM(CASE WHEN status = 'macet' THEN 1 ELSE 0 END). Pola ini jauh lebih murah daripada join tabel ke dirinya sendiri hanya untuk membandingkan dua kelompok.",
        "Kedua, ROLLUP dan GROUPING SETS untuk subtotal berjenjang: GROUP BY ROLLUP(kota, segmen) menghasilkan total per (kota, segmen), subtotal per kota, dan grand total dalam satu eksekusi — satu scan, bukan tiga query. GROUPING SETS memberi kontrol penuh atas kombinasi mana yang dihitung. Kapan gagal: ROLLUP atas 5 dimensi menghasilkan 32 kombinasi — ledakan yang tidak pernah dibaca siapa pun; batasi pada hierarki yang memang ditanyakan (waktu: hari → bulan → tahun).",
        "Ketiga, biaya DISTINCT yang sering diremehkan: COUNT(DISTINCT nasabah_id) memaksa database mengurutkan atau meng-hash seluruh himpunan nilai sebelum menghitung — pada 100 juta baris ini bisa menjadi operator termahal di query. Aturan keputusan: bila kamu hanya butuh “ada berapa nilai unik” sebagai cek kewajaran, pertimbangkan HyperLogLog/approx di warehouse (error ~1% dengan biaya jauh lebih kecil); bila butuh tepat untuk angka laporan resmi, bayar biaya DISTINCT dengan sadar dan pastikan kolomnya terindeks atau datanya sudah terpartisi. Dan jangan pernah memakai DISTINCT “untuk jaga-jaga” — duplikat yang muncul padahal seharusnya tidak ada adalah gejala (biasanya fan-out dari JOIN), dan DISTINCT hanya menutupi gejalanya sambil menambah biaya.",
      ],
      tasks: [],
      reference: "FILTER untuk subset; ROLLUP untuk subtotal; DISTINCT itu mahal — bayar dengan sadar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Agregat: COUNT(*)/COUNT(kolom)/SUM/AVG/MIN/MAX — waspadai NULL di tiap fungsi.",
        "GROUP BY: agregat per grup; kolom SELECT harus agregat atau di GROUP BY.",
        "HAVING = WHERE untuk grup (setelah agregat); WHERE jalan sebelum GROUP BY.",
        "Conditional aggregation (CASE dalam agregat) = pola nomor satu interview.",
        "Jangan: andalkan urutan GROUP BY; lupakan cek duplikat & NULL; rata-rata dari rata-rata.",
      ],
      next: { label: "C4 — Fungsi Tanggal & String", href: "/learn/c4-fungsi-tanggal-string" },
      quiz: [
        {
          q: "AVG(penghasilan) dengan 1 NULL dari 10 baris = ?",
          options: [
            { text: "SUM / 10", why: "Salah — itu baru benar jika NULL dihitung sebagai 0." },
            { text: "SUM / 9 (NULL tidak dihitung)", why: "Benar. AVG = SUM / COUNT(kolom). Definisikan yang kamu mau: jika maunya NULL = 0, tulis SUM(COALESCE(gaji,0)) / COUNT(*) eksplisit.", correct: true },
            { text: "Error", why: "Salah — tidak error, hanya pembaginya 9." },
          ],
        },
        {
          q: "WHERE vs HAVING — yang benar?",
          options: [
            { text: "Sama saja", why: "Salah — waktu eksekusinya beda." },
            { text: "WHERE saring baris (sebelum agregat), HAVING saring grup (sesudah)", why: "Benar. Urutan eksekusi: WHERE → GROUP BY → HAVING. Agregat tak ada saat WHERE jalan.", correct: true },
            { text: "WHERE bisa pakai fungsi agregat", why: "Salah — agregat belum ada saat WHERE dieksekusi." },
          ],
        },
        {
          q: "`SELECT kota, nama FROM nasabah GROUP BY kota` — masalahnya?",
          options: [
            { text: "Tidak ada", why: "Salah — satu grup punya banyak nama." },
            { text: "nama bukan agregat dan tidak di GROUP BY — tidak valid", why: "Benar. Database tidak tahu nama siapa yang ditampilkan dari tiap grup kota.", correct: true },
            { text: "Harus pakai HAVING", why: "Salah — HAVING untuk saring grup, bukan memperbaiki kolom." },
          ],
        },
        {
          q: "Pola conditional aggregation untuk “% dpd > 30”?",
          options: [
            { text: "WHERE dpd > 30", why: "Salah — itu menyaring baris, bukan menghitung persentase." },
            { text: "COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*)", why: "Benar. Satu query, satu scan. Pola nomor satu interview SQL.", correct: true },
            { text: "GROUP BY dpd", why: "Salah — itu mengelompokkan per nilai dpd, bukan menghitung %." },
          ],
        },
        {
          q: "Satu nasabah punya 2 kredit. COUNT(nasabah) setelah JOIN nasabah–kredit?",
          options: [
            { text: "Tetap benar", why: "Salah — baris nasabah terganda mengikuti jumlah kreditnya." },
            { text: "Menggandakan — pakai COUNT(DISTINCT n.id)", why: "Benar. Fan-out JOIN menggandakan baris. COUNT DISTINCT, atau agregasi di level yang benar (C5/C6).", correct: true },
            { text: "Menjadi NULL", why: "Salah — tidak ada yang jadi NULL karenanya." },
          ],
        },
      ],
    },
  ],
};

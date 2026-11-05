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

export const c10: V2Lesson = {
  slug: "c10-dedupe-pivot-yoy",
  track: "SQL",
  module: "Lanjutan",
  title: "C10 Dedupe, Pivot & YoY: Pola Analisis Sehari-hari",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-senin",
      eyebrow: "Langkah 1 · Tiga pola",
      title: "Tiga pertanyaan setiap Senin pagi",
      prose: [
        "Setiap Senin pagi, atasanmu bertanya tiga hal: (1) “Datanya sudah bersih dari duplikat?” (2) “Bagaimana tren per kategori bulan ini vs bulan lalu?” (3) “Pertumbuhan YoY-nya berapa?” Tiga pola SQL di lesson ini — dedupe, pivot, YoY — menjawab ketiganya. Ini bukan teori eksotis; ini pekerjaan Senin pagi seorang data analyst.",
        "Tiga pertanyaan itu terlihat sepele — tapi masing-masing menyembunyikan jebakan: duplikat yang “terlihat beda” (spasi, kapital), pivot yang menyembunyikan kategori baru, YoY yang membandingkan Januari (31 hari) vs Februari (28 hari). Pekerjaan rutin = tempat bug paling mahal bersembunyi, karena tidak ada yang memeriksa ulang.",
      ],
      tasks: [],
      reference: "Dedupe → pivot → YoY = 80% query laporan rutin.",
    },
    {
      id: "dedupe",
      eyebrow: "Langkah 2 · Dedupe",
      title: "Ambil satu per grup",
      prose: [
        "Data nyata berduplikat: double-submit, retry, SCD. Pola standar: `WITH bersih AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) AS rn FROM nasabah_raw) SELECT * FROM bersih WHERE rn = 1;` — PARTITION BY = definisi “duplikat” (id sama), ORDER BY = aturan “menang” (terbaru, terbesar).",
        "Sebelum dedup, ukur dulu: `SELECT id, COUNT(*) c FROM t GROUP BY id HAVING c > 1` — berapa % duplikat? Dari mana? Dedupe tanpa memahami sumber duplikat = mengobati gejala. Di lab ini duplikat dibuat via UNION ALL (penghasilan +1jt untuk id 1–5), lalu ambil penghasilan terbesar per id.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: dedup dengan `ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC)`, saring rn = 1" },
        { id: "t2", text: "Ambil `gaji_budi` (id 2) dan pastikan = 13000000, serta total 10 baris" },
      ],
      expected: "baris: 10; gaji Budi = 13000000 (12jt + 1jt duplikat, yang terbesar menang)",
      note: {
        title: "Sering salah",
        body: "“Duplikat cukup dihapus dengan DISTINCT.” Salah — DISTINCT menghapus baris identik penuh, tapi duplikat nyata hampir selalu beda di timestamp/status. Butuh aturan menang (ROW_NUMBER), bukan DISTINCT buta.",
      },
      hints: [
        "Sumber duplikat: SELECT * FROM nasabah UNION ALL SELECT id, nama, kota, penghasilan + 1000000, dpd, status FROM nasabah WHERE id <= 5.",
        "Bungkus itu sebagai subquery, beri ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC) AS rn.",
        "gaji_budi = [r[3] for r in rows if r[0] == 2][0]  →  13000000.",
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
# TULIS KODEMU: penghasilan Budi (id=2) setelah dedup
# kolom: id, nama, kota, penghasilan, dpd, status, rn
gaji_budi =

print("baris:", n)
print("gaji_budi:", gaji_budi)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
WITH d AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC) AS rn
  FROM (
    SELECT * FROM nasabah
    UNION ALL
    SELECT id, nama, kota, penghasilan + 1000000, dpd, status
    FROM nasabah WHERE id <= 5
  )
)
SELECT * FROM d WHERE rn = 1
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
# TULIS KODEMU: penghasilan Budi (id=2) setelah dedup
# kolom: id, nama, kota, penghasilan, dpd, status, rn
gaji_budi = [r[3] for r in rows if r[0] == 2][0]

print("baris:", n)
print("gaji_budi:", gaji_budi)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "ROW_NUMBER", label: "Query memakai ROW_NUMBER", msg: "Dedup kanonis memakai ROW_NUMBER() OVER (PARTITION BY id ...)." },
          { kind: "equal", task: "t2", name: "n", value: 10, tol: 1e-9, label: "10 baris setelah dedup", msg: "Satu baris per id = 10 baris." },
          { kind: "equal", task: "t2", name: "gaji_budi", value: 13000000, tol: 1e-9, label: "`gaji_budi` seharusnya 13000000", msg: "Duplikat Budi = 13jt; yang terbesar menang." },
        ],
      },
      reference: "Dedup: ukur dulu, lalu ROW_NUMBER (PARTITION BY id, ORDER BY aturan menang) → rn=1.",
    },
    {
      id: "pivot",
      eyebrow: "Langkah 3 · Pivot manual",
      title: "Baris jadi kolom",
      prose: [
        "Laporan ingin kategori sebagai kolom (bukan baris). Conditional aggregation (C3) = pivot manual: `SELECT kategori, SUM(CASE WHEN channel = 'mobile' THEN jumlah ELSE 0 END) AS mobile, SUM(CASE WHEN channel = 'web' THEN jumlah ELSE 0 END) AS web, SUM(CASE WHEN channel = 'atm' THEN jumlah ELSE 0 END) AS atm, SUM(jumlah) AS total FROM transaksi GROUP BY kategori;`",
        "Tiap kategori → satu kolom. Kebalikannya (unpivot, kolom → baris): UNION ALL per kolom (C8). Jebakan: kategori baru bulan depan tidak otomatis jadi kolom — pivot manual butuh daftar kategori eksplisit. Untuk dashboard dinamis, pivot di aplikasi/BI tool, bukan SQL.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: pivot — baris = kategori, kolom = channel (mobile/web/atm) berisi SUM(jumlah), plus kolom total" },
        { id: "t2", text: "Ambil `total_belanja` dan pastikan = 4200000" },
      ],
      expected: "3 baris kategori; total belanja = 4200000 (mobile 2850000 + web 1350000 + atm 0)",
      hints: [
        "SUM(CASE WHEN channel = 'mobile' THEN jumlah ELSE 0 END) AS mobile — ulangi untuk web, atm.",
        "GROUP BY kategori.",
        "total_belanja = [r[4] for r in rows if r[0] == 'belanja'][0]  →  4200000.",
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
# TULIS KODEMU: total kolom 'belanja' (kolom: kategori, mobile, web, atm, total)
total_belanja =

print("total_belanja:", total_belanja)
for r in rows:
    print(r)`,
        lockLines: 51,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT kategori,
SUM(CASE WHEN channel = 'mobile' THEN jumlah ELSE 0 END) AS mobile,
SUM(CASE WHEN channel = 'web' THEN jumlah ELSE 0 END) AS web,
SUM(CASE WHEN channel = 'atm' THEN jumlah ELSE 0 END) AS atm,
SUM(jumlah) AS total
FROM transaksi
GROUP BY kategori
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: total kolom 'belanja' (kolom: kategori, mobile, web, atm, total)
total_belanja = [r[4] for r in rows if r[0] == 'belanja'][0]

print("total_belanja:", total_belanja)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "CASE WHEN", label: "Query memakai CASE WHEN", msg: "Pivot manual = SUM(CASE WHEN ...) per kolom." },
          { kind: "equal", task: "t2", name: "total_belanja", value: 4200000, tol: 1e-9, label: "`total_belanja` seharusnya 4200000", msg: "Transaksi belanja: 500rb+1jt+300rb+500rb+950rb+600rb+350rb = 4,2jt." },
        ],
      },
      reference: "Pivot = SUM(CASE WHEN ...) per kategori; unpivot = UNION ALL per kolom.",
    },
    {
      id: "yoy-mom",
      eyebrow: "Langkah 4 · YoY / MoM",
      title: "Pertumbuhan dengan LAG",
      prose: [
        "`WITH bulanan AS (SELECT strftime('%Y-%m', tanggal) AS bulan, SUM(jumlah) AS total FROM transaksi GROUP BY 1) SELECT bulan, total, LAG(total, 1) OVER (ORDER BY bulan) AS bulan_lalu, (total - LAG(total, 1) OVER (ORDER BY bulan)) * 1.0 / LAG(total, 1) OVER (ORDER BY bulan) AS mom_growth FROM bulanan;` — MoM: LAG(..., 1); YoY: LAG(..., 12) pada data bulanan. Rumus growth: (baru − lama) / lama. Waspadai lama = 0/NULL!",
        "Dua jebakan: (1) Bulan hilang — LAG(...,1) pada data berlubang = “bulan data sebelumnya”, bukan “bulan kalender lalu”! Butuh date spine (C7) untuk kalender benar. (2) Growth tanpa basis menipu — turun 5% dari 100M = 5M hilang; naik 50% dari 1jt = 500rb. Selalu tampilkan angka absolut + % berdampingan. MoM menyesatkan saat musiman kuat (Desember selalu tinggi → Januari “turun” padahal normal) — di situlah YoY lebih jujur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risk, YoY per segmen membedakan masalah struktural dari musiman. Penurunan MoM 10% di Januari belum tentu masalah — bandingkan YoY dulu sebelum menaikkan provisi.",
      },
      quiz: [
        {
          q: "`LAG(total, 1)` pada data bulan berlubang menghasilkan?",
          options: [
            { text: "Bulan kalender lalu", why: "Salah — LAG menghitung baris data, bukan kalender." },
            { text: "“Bulan data sebelumnya” — bisa 2 bulan lalu!", why: "Benar. Butuh date spine (C7) untuk kalender yang benar.", correct: true },
            { text: "NULL", why: "Salah — ia mengembalikan baris data sebelumnya yang ada." },
          ],
        },
        {
          q: "MoM vs YoY — kapan MoM menyesatkan?",
          options: [
            { text: "Tidak pernah", why: "Salah." },
            { text: "Saat musiman kuat (mis. Desember selalu tinggi)", why: "Benar. Januari “turun” padahal normal — YoY lebih jujur di situ.", correct: true },
            { text: "Saat datanya bulanan", why: "Salah — MoM memang dirancang untuk data bulanan." },
          ],
        },
      ],
      reference: "Growth = (baru-lama)/lama; tampilkan absolut + %; waspadai basis 0 & lubang kalender.",
    },
    {
      id: "minicase-senin",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Laporan Senin pagi",
      prose: [
        "Tulis satu query untuk laporan Senin: per kategori, tampilkan total bulan ini, total bulan lalu, MoM %, dan pangsa dari total. Struktur CTE-nya: `WITH b AS (SELECT kategori, strftime('%Y-%m',tanggal) bl, SUM(jumlah) s FROM transaksi GROUP BY 1,2), c AS (SELECT *, LAG(s) OVER (PARTITION BY kategori ORDER BY bl) AS lalu FROM b) SELECT kategori, s AS total, lalu, (s-lalu)/lalu AS mom, s/SUM(s) OVER () AS pangsa FROM c WHERE bl = '2026-09';`",
        "Pelajaran: laporan kompleks = komposisi pola (pivot + LAG + % of total). Tiap pola sudah kamu kuasai — merangkai tinggal latihan.",
      ],
      tasks: [],
      reference: "Laporan = komposisi pola: pivot per bulan-kategori, LAG per kategori, % of total.",
    },
    {
      id: "intuisi-dedupe",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Data bersih bukan kondisi — ia keputusan yang didokumentasikan",
      prose: [
        "Tidak ada dataset yang “sudah bersih”; yang ada hanyalah keputusan pembersihan yang eksplisit atau implisit.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: setiap langkah dedup/pivot adalah klaim bisnis — tulis klaimnya",
        body: "“Hapus duplikat” terdengar teknis, tetapi ia selalu menyembunyikan tiga klaim bisnis: (1) definisi sama — baris mana yang kamu anggap mewakili entitas yang sama; (2) aturan menang — bila dua baris “sama”, data siapa yang dipercaya; (3) yang dibuang ke mana — dihapus permanen, ditandai, atau diarsipkan. Analis junior menulis query dedup; analis senior menulis query dedup + satu paragraf yang menjawab ketiganya, karena 6 bulan kemudian seseorang akan bertanya “kenapa angka pelanggan kita turun 2% bulan itu” dan jawabannya ada di paragraf itu, bukan di query. Heuristik yang sama untuk pivot: memilih kolom pivot adalah klaim bahwa kategori-kategori itu stabil dan saling lepas — bila kategori baru muncul tiap bulan, pivot manual-mu pecah tiap bulan. Aturan: dedup/pivot yang tidak didokumentasikan asumsinya adalah bom waktu; yang didokumentasikan adalah aset.",
      },
      reference: "Dedup/pivot = 3 klaim (definisi sama, aturan menang, nasib yang dibuang); tulis ketiganya.",
    },
    {
      id: "dedup-pivot-skala",
      eyebrow: "Langkah 7 · Skala",
      title: "Dedup deterministik dan pivot di skala besar",
      prose: [
        "Dedup deterministik dimulai jauh sebelum ROW_NUMBER: ia dimulai dari pertanyaan “apa kunci identitasnya?”. Di data hasil merger dua sistem, nasabah yang sama bisa punya id berbeda, nama beda ejaan (“Budi Santoso” vs “Budi Santoso ”), dan telepon beda format. PARTITION BY id mentah tidak menemukan mereka sebagai duplikat — kamu butuh kunci kanonis: normalisasi dulu (TRIM, UPPER, format telepon seragam), baru partisi. Urutannya tidak bisa dibalik: normalisasi → kunci dedup → ROW_NUMBER dengan tie-breaker. Melewatkan langkah pertama menghasilkan dedup yang “berhasil” secara teknis tetapi salah secara bisnis — duplikat tetap ada, hanya tidak terlihat.",
        "Tie-breaker ORDER BY adalah tempat determinisme diputuskan — dan tempat bias menyelinap. ORDER BY updated_at DESC, id ASC (“data terbaru menang, seri → id terkecil”) adalah default yang masuk akal; tetapi tanyakan: apakah “terbaru” selalu “terbenar”? Di data koreksi manual, baris terbaru bisa jadi hasil salah ketik yang belum diverifikasi, sementara baris lama berasal dari sistem terverifikasi. Aturan senior: tie-breaker mencerminkan KEPERCAYAAN SUMBER, bukan sekadar waktu — ORDER BY sumber_tepercaya DESC, updated_at DESC, id ASC. Dan untuk audit, jangan pernah DELETE langsung: tambahkan kolom is_duplikat / rn, laporkan distribusinya (berapa % duplikat per sumber?), baru hapus setelah pemilik data setuju. Angka “2% duplikat dari sistem B” sering lebih berharga daripada dedup-nya sendiri — ia bukti untuk memperbaiki hulu.",
        "Pivot via conditional aggregation — SUM(CASE WHEN bulan = '2026-01' THEN nominal END) AS jan — adalah pola yang benar di semua dialek, tetapi punya dua batas skala. Pertama, kolom pivot harus ditulis manual: 12 bulan masih oke, 1.000 SKU tidak — di titik itu pivot adalah pekerjaan presentasi (spreadsheet/BI tool), bukan query. Kedua, tiap kolom pivot memindai data sekali secara logis; 50 kolom CASE atas 100 juta baris tetap satu scan (database modern menanganinya baik), tetapi ingat bahwa pivot melebarkan baris — 1.000 kolom hasil bisa menabrak batas kolom database atau memori klien. Aturan: pivot di SQL untuk kategori yang STABIL dan SEDIKIT (< 50); selebihnya, kirim data long-format ke tool visualisasi dan pivot di sana.",
        "YoY yang benar di skala besar punya dua jebakan: pembanding yang tidak sebanding dan basis yang nol. “Jan 2026 vs Jan 2025” hanya valid bila kedua periode tertutup penuh — membandingkan Januari berjalan (tanggal 16) dengan Januari penuh tahun lalu menghasilkan “penurunan” palsu; normalisasi ke hari-ke-N yang sama atau tandai eksplisit “data berjalan”. Basis nol/kecil membuat persen perubahan meledak (dari 1 ke 100 = +9900%) — untuk segmen kecil, laporkan SELISIH ABSOLUT berdampingan dengan persen, atau agregat ke level yang lebih tinggi dulu. Dan satu aturan konsistensi: definisi “tahun lalu” harus sama di semua laporan — pakai dim_waktu/kalender tunggal, jangan biarkan tiap analis menghitung offset tanggalnya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Pivot dinamis dengan SQL string yang dirakit aplikasi.” Bisa, tetapi hasilnya rapuh: skema output berubah tiap ada kategori baru, menghancurkan semua konsumen hilir (dashboard, Excel, API). Kolom output query produksi adalah KONTRAK — ia tidak boleh berubah karena data berubah. Butuh kolom dinamis? Itu pekerjaan lapisan presentasi, bukan SQL.",
      },
      reference: "Normalisasi → kunci kanonis → ROW_NUMBER + tie-breaker kepercayaan; pivot SQL hanya untuk kategori stabil & sedikit.",
    },
    {
      id: "yoy-robust",
      eyebrow: "Langkah 8 · YoY robust",
      title: "YoY yang tidak berbohong: periode tak-lengkap, weekday, dan tahun 53-minggu",
      prose: [
        "YoY paling sering berbohong lewat tiga cara. Pertama, periode TAK LENGKAP: membandingkan Januari 2026 (data s.d. tanggal 16) dengan Januari 2025 (penuh) menghasilkan “penurunan 48%” yang murni artefak kalender. Obatnya: bandingkan periode yang SEBANDING — year-to-date vs year-to-date (16 Jan vs 16 Jan), atau tandai eksplisit “data berjalan” dan jangan hitung persennya. Aturan keras: kedua sisi perbandingan harus mencakup jumlah hari yang sama; bila tidak, yang dilaporkan adalah selisih absolut dengan label, bukan persen.",
        "Kedua, efek WEEKDAY: “Senin–Minggu minggu ini vs Senin–Minggu minggu lalu” valid; “1–7 Januari vs 1–7 Januari tahun lalu” tidak — komposisi harinya beda (5 hari kerja vs 4). Untuk bisnis dengan pola mingguan kuat (ritel, logistik), YoY tanggal-kalender berosilasi liar tanpa makna. Obatnya: samakan weekday — bandingkan minggu kalender yang sama (ISO week), atau geser pembanding ke “7 hari yang weekday-nya sama”. Dan waspadai tahun 53-minggu (ISO): setiap ~5 tahun ada 53 minggu; LAG 52 minggu di tahun itu membandingkan minggu yang salah — pakai week-year ISO, bukan asumsi 52.",
        "Ketiga, basis KECIL: segmen dengan 2 transaksi tahun lalu naik menjadi 20 → “+900%” yang secara statistik adalah noise. Aturan: untuk penyebut kecil, laporkan SELISIH ABSOLUT sebagai angka utama dan persen sebagai konteks — atau agregat ke level yang lebih tinggi hingga penyebutnya stabil. Dan satu disiplin LAG: LAG(nominal, 12) atas data bulanan mengasumsikan tidak ada bulan yang HILANG — satu bulan tanpa data (sistem down) menggeser seluruh perbandingan setahun ke depan. Untuk data yang bisa berlubang, join ke date spine + offset tanggal eksplisit (b.tanggal = a.tanggal - interval '1 year') lebih robust daripada LAG posisional.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“YoY cukup LAG 12 bulan.” Cukup hanya bila: (1) tidak ada bulan berlubang, (2) periode berjalan sudah dinormalisasi, (3) efek weekday tidak material, (4) penyebut cukup besar. Empat syarat yang jarang dicek — dan masing-masing pernah menjadi insiden “angka direksi salah” yang saya lihat.",
      },
      reference: "Samakan hari & weekday; normalisasi periode berjalan; penyebut kecil → absolut; data berlubang → join tanggal, bukan LAG.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Dedupe: ukur → ROW_NUMBER (PARTITION BY id, ORDER BY aturan menang) → rn=1.",
        "Pivot: SUM(CASE WHEN ...) — baris jadi kolom; unpivot = UNION ALL.",
        "YoY/MoM: LAG + (baru-lama)/lama; waspadai basis 0 & lubang kalender.",
        "YTD: running total PARTITION BY tahun.",
        "Tiga pola = Senin pagi yang tenang.",
      ],
      next: { label: "C11 — Cohort, Retention & Funnel", href: "/learn/c11-cohort-retention-funnel" },
      quiz: [
        {
          q: "Dedup “ambil terbaru per id”?",
          options: [
            { text: "DISTINCT", why: "Salah — tak cukup untuk duplikat tak-identik." },
            { text: "ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), saring rn=1", why: "Benar. Butuh aturan menang — DISTINCT tak cukup.", correct: true },
            { text: "GROUP BY id", why: "Salah — kolom lain jadi tidak tentu." },
          ],
        },
        {
          q: "Sebelum dedup, yang wajib dilakukan?",
          options: [
            { text: "Langsung hapus", why: "Salah — berbahaya tanpa memahami sumbernya." },
            { text: "Ukur: berapa % duplikat & dari mana sumbernya", why: "Benar. Mengobati gejala tanpa sebab = sia-sia.", correct: true },
            { text: "Minta izin", why: "Salah — bukan itu langkah teknisnya." },
          ],
        },
        {
          q: "Pivot manual memakai?",
          options: [
            { text: "JOIN", why: "Salah." },
            { text: "SUM(CASE WHEN kategori=... THEN ... END) per kolom", why: "Benar. Conditional aggregation = pivot manual.", correct: true },
            { text: "UNION", why: "Salah — itu menumpuk baris, bukan memutar kolom." },
          ],
        },
        {
          q: "Unpivot (kolom → baris) memakai?",
          options: [
            { text: "PIVOT", why: "Salah — itu kebalikannya." },
            { text: "UNION ALL per kolom", why: "Benar. Kebalikan pivot.", correct: true },
            { text: "CASE", why: "Salah — CASE untuk pivot, bukan unpivot." },
          ],
        },
        {
          q: "Jika `updated_at` kembar saat dedupe, apa yang harus ditambahkan?",
          options: [
            { text: "Tidak perlu apa-apa", why: "Salah — “yang terbaru” jadi acak di antara kembaran." },
            { text: "Tie-break eksplisit di ORDER BY (mis. ..., id DESC)", why: "Benar. Tie-break deterministik = hasil dapat direproduksi.", correct: true },
            { text: "DISTINCT", why: "Salah — tidak menyelesaikan tie-break." },
          ],
        },
      ],
    },
  ],
};

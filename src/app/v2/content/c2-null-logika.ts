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

export const c2: V2Lesson = {
  slug: "c2-null-logika",
  track: "SQL",
  module: "Fondasi",
  title: "C2 NULL: Ketidakhadiran yang Punya Aturan Sendiri",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-eko",
      eyebrow: "Langkah 1 · NULL",
      title: "Nasabah yang hilang dari dua laporan",
      prose: [
        "Analis membuat laporan “nasabah dengan penghasilan di bawah 10 juta” — query `WHERE penghasilan < 10000000`. Laporan rapi: 6 nasabah. Tapi Eko (penghasilan `NULL` — belum diinput) tidak muncul. Ia juga tidak muncul di laporan “di atas 10 juta”. Eko hilang dari kedua laporan yang saling melengkapi!",
        "`NULL` bukan nol, bukan kosong — ia “tidak tahu”. Dan “tidak tahu < 10 juta” hasilnya bukan TRUE/FALSE melainkan `UNKNOWN` — yang disaring keluar oleh WHERE. Setiap “laporan lengkap” yang kamu buat sebelum lesson ini mungkin punya lubang yang sama.",
        "Aturan emas: apapun dibandingkan dengan NULL → `UNKNOWN`. `WHERE` hanya meloloskan TRUE. Cara benar mencari yang hilang: `IS NULL` / `IS NOT NULL` — `= NULL` selalu salah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan `COUNT(*)` sebagai `semua` dan `COUNT(penghasilan)` sebagai `ada_gaji`" },
        { id: "t2", text: "Hitung `selisih = semua - ada_gaji` dari hasil query, lalu cetak" },
      ],
      expected: "selisih: 1 (satu NULL = penghasilan Eko belum diinput)",
      note: {
        title: "Sering salah",
        body: "`NULL = 0` itu keliru total. `WHERE penghasilan = 0` tidak menemukan NULL. `COUNT(penghasilan)` melewatkan NULL tapi `COUNT(*)` tidak. Rata-rata mengabaikan NULL — yang bisa bias jika NULL-nya tidak acak.",
      },
      hints: [
        "Selisih COUNT(*) dan COUNT(kolom) = jumlah NULL di kolom itu.",
        "Ambil baris pertama hasil: rows[0][0] dan rows[0][1].",
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
# TULIS KODEMU: hitung selisih = semua - ada_gaji
selisih =

print(f"selisih: {selisih}")`,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT COUNT(*) AS semua, COUNT(penghasilan) AS ada_gaji FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
# TULIS KODEMU: hitung selisih = semua - ada_gaji
selisih = rows[0][0] - rows[0][1]

print(f"selisih: {selisih}")`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "selisih", value: 1, tol: 1e-9, label: "`selisih` seharusnya 1", msg: "10 baris total, 9 berpenghasilan. Selisihnya = 1 NULL (Eko)." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih:\\s*1", label: "`print` menampilkan selisih", msg: "Cetak dengan format selisih: ... ." },
        ],
      },
      reference: "COUNT(*) hitung baris; COUNT(kolom) lewatkan NULL. Selisihnya = jumlah NULL.",
    },
    {
      id: "isnull-coalesce",
      eyebrow: "Langkah 2 · IS NULL & COALESCE",
      title: "Menemukan yang hilang, mengganti yang aman",
      prose: [
        "Logika 3-nilai: `TRUE`, `FALSE`, `UNKNOWN`. `WHERE NOT (penghasilan > 10000000)` — untuk Eko (NULL): `NOT UNKNOWN = UNKNOWN` → tersaring! “Tidak (di atas 10jt)” tidak sama dengan “di bawah 10jt” saat ada NULL.",
        "`COALESCE(penghasilan, 0)` mengambil argumen non-NULL pertama — nilai pengganti yang aman untuk perhitungan. Tapi dokumentasikan: mengganti NULL dengan 0 mengubah makna (0 adalah nilai, bukan “tidak tahu”). Pola aman: `COALESCE` untuk perhitungan agar NULL tidak merambat, pertahankan kolom asli untuk analisis, dan tambahkan flag `(penghasilan IS NULL) AS penghasilan_missing`.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan `nama` nasabah yang penghasilannya NULL (`IS NULL`)" },
        { id: "t2", text: "Jalankan dan pastikan 1 baris kembali: Eko" },
      ],
      expected: "baris: 1\n('Eko',)",
      note: {
        title: "Sering salah",
        body: "`WHERE penghasilan = NULL` menghasilkan UNKNOWN untuk semua baris — hasilnya selalu kosong. Satu-satunya cara benar: `IS NULL` / `IS NOT NULL`.",
      },
      hints: [
        "Kondisi yang benar memakai dua kata, bukan tanda =.",
        "SELECT nama FROM nasabah WHERE penghasilan IS NULL",
        "Hasilnya 1 baris: Eko.",
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
print("baris:", n)
for r in rows:
    print(r)`,
        lockLines: 25,
        solution:
          SETUP +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT nama FROM nasabah WHERE penghasilan IS NULL
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "contains", task: "t1", name: "sql", value: "IS NULL", label: "Query memakai IS NULL", msg: "= NULL selalu salah — pakai IS NULL." },
          { kind: "equal", task: "t2", name: "n", value: 1, tol: 1e-9, label: "1 baris kembali", msg: "Hanya Eko yang penghasilannya NULL." },
          { kind: "stdout_matches", task: "t2", pattern: "Eko", label: "Barisnya Eko", msg: "Cek kondisi WHERE-mu — yang NULL hanya Eko." },
        ],
      },
      reference: "IS NULL / IS NOT NULL untuk mencari NULL; COALESCE(kolom, pengganti) untuk perhitungan aman.",
    },
    {
      id: "like-in-case",
      eyebrow: "Langkah 3 · LIKE, IN, CASE",
      title: "Filter ekspresif dan kategorisasi",
      prose: [
        "`LIKE 'A%'` (diawali A; `%` = sembarang, `_` = satu karakter), `IN ('Jakarta','Surabaya')` (lebih rapi dari OR beruntun), `BETWEEN 30 AND 90` (inklusif kedua ujung). Jebakan NULL: `x NOT IN (1, 2, NULL)` selalu UNKNOWN — tidak ada baris yang lolos, diam-diam! Jika daftar mengandung NULL, pakai `NOT EXISTS` (C6).",
        "`CASE` adalah IF-nya SQL — dievaluasi berurutan, WHEN pertama yang cocok menang: `CASE WHEN dpd = 0 THEN 'lancar' WHEN dpd BETWEEN 1 AND 30 THEN 'ringan' WHEN dpd BETWEEN 31 AND 90 THEN 'sedang' ELSE 'berat' END`. Ia mengubah angka jadi kategori bisnis (bucket DPD!) dan menjadi fondasi conditional aggregation (C3) — pola `COUNT(CASE WHEN ... THEN 1 END)` yang paling sering keluar di interview.",
      ],
      tasks: [],
      quiz: [
        {
          q: "`SELECT * FROM nasabah WHERE penghasilan = NULL` menghasilkan?",
          options: [
            { text: "Baris Eko", why: "Salah — = NULL tidak pernah TRUE untuk siapapun." },
            { text: "Kosong — harus pakai IS NULL", why: "Benar. = NULL → UNKNOWN → tersaring semua.", correct: true },
            { text: "Error sintaks", why: "Salah — sintaksnya valid, hanya logikanya salah." },
          ],
        },
        {
          q: "Daftar hitam berisi (1, 2, NULL). `SELECT * FROM nasabah WHERE id NOT IN (1, 2, NULL)` — berapa baris kembali?",
          options: [
            { text: "Semua kecuali 1 dan 2", why: "Salah — itulah yang kamu harapkan, bukan yang terjadi." },
            { text: "Kosong — NULL meracuni seluruh query", why: "Benar. Untuk tiap id: NOT(FALSE OR FALSE OR UNKNOWN) = UNKNOWN → tersaring. Bug klasik yang tidak error — hanya hening. Pakai NOT EXISTS.", correct: true },
            { text: "Error", why: "Salah — tidak error, hanya kosong diam-diam." },
          ],
        },
        {
          q: "`CASE WHEN` dievaluasi bagaimana?",
          options: [
            { text: "Berurutan — WHEN pertama yang cocok menang", why: "Benar. Seperti IF-ELSE: urutan WHEN menentukan hasil untuk kondisi yang tumpang tindih.", correct: true },
            { text: "Acak", why: "Salah — urutannya deterministik dan penting." },
            { text: "Dari bawah ke atas", why: "Salah — dari atas ke bawah." },
          ],
        },
      ],
      reference: "LIKE (%, _); IN (awas NULL di NOT IN); BETWEEN inklusif; CASE berurutan.",
    },
    {
      id: "minicase-eko",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Laporan yang kehilangan Eko",
      prose: [
        "Manajemen menerima dua laporan: “penghasilan < 10jt: 6 nasabah” dan “penghasilan ≥ 10jt: 3 nasabah”. Total 9 — padahal nasabah ada 10. Manajemen bertanya: “Kenapa totalnya tidak 10?”",
        "Pembahasan: (a) Perbandingan dengan NULL menghasilkan UNKNOWN, dan WHERE menyaring UNKNOWN — Eko tidak lolos ke laporan manapun. 6 + 3 = 9 ≠ 10; selisihnya = baris NULL. (b) Laporan yang benar-benar mencakup semua: `SELECT CASE WHEN penghasilan IS NULL THEN 'belum diisi' WHEN penghasilan < 10000000 THEN '<10jt' ELSE '≥10jt' END AS kategori, COUNT(*) FROM nasabah GROUP BY 1;` (GROUP BY = C3).",
        "Pelajaran: setiap laporan dengan filter harus punya kategori “tidak diketahui” — atau datamu bocor diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risk reporting, nasabah yang “hilang” dari laporan bisa berarti exposure yang tidak termonitor. Aturan audit: selalu cek COUNT(*) vs COUNT(kolom) — selisihnya = NULL yang mungkin hilang dari laporanmu.",
      },
      reference: "Laporan lengkap = filter OR IS NULL, atau kategori 'belum diisi' via CASE.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Menangani nilai spesial",
      prose: [
        "Cek NULL → `IS NULL` / `IS NOT NULL` (`= NULL` selalu UNKNOWN). Hitung dengan NULL → `COALESCE` untuk perhitungan, tapi pertahankan kolom asli + flag untuk analisis. Filter pola teks → `LIKE` (`%`, `_`; ingat `'%x%'` tak bisa pakai index — C17). Daftar nilai → `IN` (rapi), tapi `NOT IN` + NULL = hasil kosong diam-diam → pakai `NOT EXISTS`. Kategorisasi → `CASE` berurutan.",
        "Aturan praktis 10 detik: `IS NULL`, bukan `= NULL`. WHERE hanya meloloskan TRUE. Saat eksplorasi tabel baru, query pertamamu: `SELECT COUNT(*), COUNT(kolom) FROM t` — selisihnya = jumlah NULL. Kebiasaan 30 detik yang menyelamatkan jam debugging.",
      ],
      tasks: [],
      reference: "IS NULL; COALESCE + flag; LIKE/IN (awas NOT IN + NULL); CASE berurutan.",
    },
    {
      id: "intuisi-null",
      eyebrow: "Langkah 6 · Intuisi",
      title: "NULL menular: satu nilai tak-dikenal meracuni seluruh baris logika",
      prose: [
        "Praktisi senior tidak menghafal tabel kebenaran three-valued logic — mereka memakai satu model mental: NULL itu menular.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: anggap NULL sebagai “tidak tahu”, lalu jalankan logikanya di kepala",
        body: "Setiap kali query berperilaku aneh di sekitar NULL, berhentilah dan ganti NULL dengan frasa “tidak tahu”, lalu baca ulang kondisinya seperti kalimat biasa. WHERE penghasilan < 10000000 dengan penghasilan “tidak tahu” menjadi “apakah ‘tidak tahu’ kurang dari 10 juta?” — jawabannya bukan ya atau tidak, melainkan “tidak tahu”, dan baris dengan jawaban “tidak tahu” tidak ditampilkan. NOT IN (1, 2, NULL) menjadi “apakah x bukan 1, bukan 2, dan bukan ‘tidak tahu’?” — bagian terakhir selalu “tidak tahu”, seluruh AND menjadi “tidak tahu”, hasil kosong diam-diam. Kebiasaan ini menyelamatkanmu di tiga tempat paling berbahaya: filter WHERE yang diam-diam membuang baris, JOIN yang kehilangan pasangan karena kunci NULL tidak pernah sama dengan apa pun (bahkan NULL lain), dan agregasi COUNT(*) vs COUNT(kolom) yang menghitung hal berbeda. Heuristiknya: bila kolom boleh NULL dan ikut dalam perbandingan, tulis eksplisit penanganannya (IS NULL / COALESCE / NOT EXISTS) — jangan biarkan “tidak tahu” memutuskan nasib barismu secara diam-diam.",
      },
      reference: "NULL = “tidak tahu”; uji setiap kondisi dengan membaca kalimatnya.",
    },
    {
      id: "jebakan-tvl",
      eyebrow: "Langkah 7 · Three-valued logic",
      title: "Jebakan three-valued logic di JOIN, WHERE, dan NOT IN",
      prose: [
        "Three-valued logic (TRUE / FALSE / UNKNOWN) menggigit paling dalam di tiga tempat. Pertama, WHERE: hanya baris yang kondisinya TRUE yang lolos — FALSE dan UNKNOWN sama-sama gugur. WHERE status <> 'macet' membuang baris berstatus NULL, bukan karena mereka “macet”, melainkan karena “tidak tahu <> 'macet'” = UNKNOWN. Laporan “nasabah tidak macet” yang kehilangan 300 baris NULL adalah bug klasik yang lolos semua test kecuali test yang datanya mengandung NULL.",
        "Kedua, JOIN: NULL tidak pernah sama dengan NULL — ON a.nik = b.nik tidak memasangkan dua baris yang NIK-nya sama-sama NULL. Di data hasil merger dua sistem, kunci yang kosong di kedua sisi membuat baris “hilang” dari hasil INNER JOIN tanpa pesan apa pun. Solusi praktis: bersihkan/normalisasi kunci sebelum join, atau tangani eksplisit dengan kondisi OR (a.nik = b.nik OR (a.nik IS NULL AND b.nik IS NULL)) bila memang itu maknanya — dan dokumentasikan kenapa.",
        "Ketiga, jebakan paling terkenal: NOT IN vs NOT EXISTS. WHERE id NOT IN (SELECT id FROM blacklist) mengembalikan KOSONG bila subquery mengandung satu saja NULL — karena x NOT IN (1, NULL) dievaluasi sebagai x <> 1 AND x <> NULL, dan x <> NULL = UNKNOWN meracuni seluruh AND menjadi UNKNOWN. NOT EXISTS tidak punya masalah ini: ia menguji keberadaan baris, bukan perbandingan nilai. Aturan senior: untuk “yang tidak ada di himpunan”, selalu pakai NOT EXISTS; NOT IN hanya aman bila kamu bisa menjamin kolom subquery NOT NULL (mis. ada constraint di skema).",
        "Kapan setiap pola dipakai — aturan keputusan: butuh nilai pengganti untuk komputasi (rata-rata tanpa NULL, label default)? → COALESCE di SELECT. Butuh memisahkan “tidak tahu” sebagai kategori laporan? → CASE WHEN x IS NULL. Butuh keanggotaan himpunan dengan kemungkinan NULL? → EXISTS / NOT EXISTS. Dan untuk agregasi: COUNT(*) menghitung baris, COUNT(kolom) menghitung nilai non-NULL — bedakan dengan sadar, karena “rata-rata penghasilan” yang dihitung dari 6 baris terisi vs 8 baris total adalah dua angka berbeda dengan dua makna berbeda.",
        "Satu wilayah NULL yang sering luput: ORDER BY. Di SQLite dan Postgres, NULL diurutkan paling akhir untuk ASC (dianggap “terbesar”); di Oracle/MySQL perilakunya berbeda — jangan mengandalkan default dialek bila laporanmu lintas database. Untuk laporan “10 nasabah berpenghasilan terendah”, NULL yang nangkring di puncak ASC akan dibaca sebagai “termiskin” padahal artinya “tidak tahu”. Pakai NULLS LAST / NULLS FIRST eksplisit (atau CASE di ORDER BY untuk SQLite lama) dan putuskan: apakah “tidak tahu” boleh tampil di peringkat teratas laporan direksi? Biasanya tidak — saring atau labeli dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Tambahkan saja OR kolom IS NULL di WHERE.” Kadang benar, kadang mengubah makna: WHERE penghasilan < 10000000 OR penghasilan IS NULL mencampur “miskin” dengan “tidak tahu” dalam satu angka — untuk laporan kemiskinan itu sesat. Tanyakan dulu: apakah NULL berarti nol, berarti belum diisi, atau berarti tidak berlaku? Jawabannya menentukan query-nya.",
      },
      reference: "WHERE hanya meloloskan TRUE; NOT IN + NULL = kosong diam-diam → pakai NOT EXISTS.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "NULL = tidak tahu: perbandingan → UNKNOWN → tersaring WHERE. Pakai IS NULL.",
        "Logika 3-nilai: TRUE/FALSE/UNKNOWN — NOT(x) ≠ kebalikan x saat ada NULL.",
        "COALESCE untuk perhitungan aman; dokumentasikan imputasi; tambah flag.",
        "LIKE (%, _), IN (awas NULL di NOT IN), BETWEEN inklusif.",
        "CASE berurutan — lem super kategorisasi dan conditional aggregation.",
      ],
      next: { label: "C3 — Agregasi & GROUP BY", href: "/learn/c3-agregasi-groupby" },
      quiz: [
        {
          q: "`COUNT(*)` vs `COUNT(penghasilan)` pada data dengan 1 NULL — bedanya?",
          options: [
            { text: "Sama", why: "Salah — COUNT(kolom) melewatkan NULL." },
            { text: "COUNT(*) lebih besar 1", why: "Benar. COUNT(*) hitung baris, COUNT(kolom) lewatkan NULL. Selisihnya = jumlah NULL.", correct: true },
            { text: "COUNT(penghasilan) lebih besar", why: "Salah — kebalikannya." },
          ],
        },
        {
          q: "`WHERE NOT (penghasilan > 10000000)` untuk Eko (NULL) — lolos atau tersaring?",
          options: [
            { text: "Lolos (TRUE)", why: "Salah — NOT UNKNOWN = UNKNOWN, bukan TRUE." },
            { text: "Tersaring (UNKNOWN)", why: "Benar. “Tidak (di atas 10jt)” ≠ “di bawah 10jt” saat ada NULL.", correct: true },
            { text: "Jadi 0", why: "Salah — NULL tidak berubah jadi 0 dengan sendirinya." },
          ],
        },
        {
          q: "`x NOT IN (1, 2, NULL)` — hasilnya?",
          options: [
            { text: "Semua kecuali 1, 2", why: "Salah — itu harapanmu, bukan kenyataannya." },
            { text: "Kosong — NULL meracuni", why: "Benar. NOT IN + NULL = tidak ada yang lolos. Bug klasik diam-diam.", correct: true },
            { text: "Hanya NULL", why: "Salah — tidak ada baris yang lolos sama sekali." },
          ],
        },
        {
          q: "`SELECT 'A' || NULL` menghasilkan?",
          options: [
            { text: "'A'", why: "Salah — NULL menular ke seluruh ekspresi." },
            { text: "NULL", why: "Benar. NULL merambat di ||. Bungkus dengan COALESCE jika perlu.", correct: true },
            { text: "Error", why: "Salah — tidak error, hasilnya NULL." },
          ],
        },
        {
          q: "Cara melaporkan temuan NULL ke laporan manajemen yang benar?",
          options: [
            { text: "Diam saja — angkanya sudah rapi", why: "Salah — itu menyembunyikan lubang data." },
            { text: "Tambahkan kategori 'belum diisi' agar total mencakup semua baris", why: "Benar. Setiap laporan berfilter harus punya kategori “tidak diketahui” — atau datamu bocor diam-diam.", correct: true },
            { text: "UPDATE NULL jadi 0 di tabel", why: "Salah — 0 = “tidak berpenghasilan” (fakta), NULL = “belum tahu”. Mencampur keduanya merusak analisis." },
          ],
        },
      ],
    },
  ],
};

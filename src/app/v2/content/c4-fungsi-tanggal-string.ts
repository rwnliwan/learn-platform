import type { V2Lesson } from "../lib/types";

const SETUP_TRX = `import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
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

export const c4: V2Lesson = {
  slug: "c4-fungsi-tanggal-string",
  track: "SQL",
  module: "Fondasi",
  title: "C4 Tanggal & Teks: Fungsi yang Menyelamatkan Sehari-hari",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-september",
      eyebrow: "Langkah 1 · Filter tanggal",
      title: "Laporan bulanan yang salah sebulan",
      prose: [
        "Analis menulis laporan “transaksi September”: `WHERE tanggal LIKE '2026-09%'`. Hasilnya benar — sampai database migrasi dan format tanggal berubah. Di database lain ia menulis `WHERE MONTH(tanggal) = 9` — benar juga, tapi query 2 juta baris yang tadinya 2 detik jadi 40 detik karena index tidak terpakai.",
        "Filter tanggal yang benar memakai pola setengah-terbuka: `WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'` — mencakup 1 Sep 00:00:00 s.d. 30 Sep 23:59:59 termasuk pecahan detik. `BETWEEN '2026-09-01' AND '2026-09-30'` justru kehilangan transaksi tanggal 30 September jam 15:00, karena batas atasnya = 30 Sep 00:00:00.",
        "Fungsi tanggal lain yang sering dipakai: `date(tanggal)` dan `strftime('%Y-%m', tanggal)` untuk ekstraksi, `julianday('2026-09-30') - julianday(tanggal)` untuk selisih hari, dan `date('now', '-7 days')` untuk “7 hari terakhir” tanpa hardcode tanggal.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan `id, tanggal, jumlah` transaksi September 2026 dengan pola setengah-terbuka, urut tanggal" },
        { id: "t2", text: "Jalankan dan pastikan 15 baris kembali" },
      ],
      expected: "baris: 15 (semua transaksi di data lab adalah September 2026)",
      note: {
        title: "Sering salah",
        body: "`BETWEEN` untuk kolom tanggal ber-jam = jebakan: batas atas '2026-09-30' berarti 30 Sep jam 00:00:00 — transaksi siangnya hilang. Pola setengah-terbuka `[awal, akhir)` selalu aman.",
      },
      hints: [
        "Batas bawah: tanggal >= '2026-09-01'. Batas atas: tanggal < '2026-10-01'.",
        "Jangan bungkus kolom tanggal dengan fungsi di WHERE.",
        "SELECT id, tanggal, jumlah FROM transaksi WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01' ORDER BY tanggal",
      ],
      code: {
        starter: SETUP_TRX + TAIL,
        lockLines: 30,
        solution:
          SETUP_TRX +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT id, tanggal, jumlah FROM transaksi
WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'
ORDER BY tanggal
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t2", name: "n", value: 15, tol: 1e-9, label: "15 baris kembali", msg: "Semua 15 transaksi di data lab bertanggal September 2026." },
          { kind: "stdout_matches", task: "t2", pattern: "\\(1, '2026-09-01', 500000", label: "Baris pertama 1 Sep", msg: "Urutkan dengan ORDER BY tanggal — transaksi id 1 (2026-09-01) harus pertama." },
        ],
      },
      reference: "Filter tanggal: WHERE tanggal >= 'awal' AND tanggal < 'akhir' (setengah-terbuka).",
    },
    {
      id: "sargable",
      eyebrow: "Langkah 2 · Sargable",
      title: "Tulis agar index terpakai",
      prose: [
        "`SELECT * FROM transaksi WHERE strftime('%Y-%m', tanggal) = '2026-09'` — lambat: fungsi di kolom membuat index tidak terpakai (full scan). `SELECT * FROM transaksi WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'` — cepat: kolom polos di satu sisi, index hidup. Aturannya: jangan bungkus kolom ter-index dengan fungsi di WHERE.",
        "“Fungsi di WHERE tidak masalah untuk data kecil” — benar untuk 10 baris lab, tapi kebiasaan ini terbawa ke tabel 100 juta baris dan membuat query timeout di produksi. Latih pola sargable dari sekarang: gratis untuk data kecil, menyelamatkan untuk data besar. Ini satu-satunya optimasi yang perlu dihafal pemula — sisanya topik C17.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan risk harian yang memakai fungsi di kolom tanggal memindai seluruh histori tiap pagi — lambat dan membebani database produksi. Query sargable = laporan tepat waktu tanpa mengganggu transaksi nasabah.",
      },
      quiz: [
        {
          q: "Filter “September 2026” yang benar untuk kolom timestamp ber-index?",
          options: [
            { text: "WHERE tanggal LIKE '2026-09%'", why: "Salah — rapuh terhadap perubahan format, dan tidak memakai index." },
            { text: "WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'", why: "Benar. Setengah-terbuka: menangkap semua jam di 30 Sep, dan sargable (index terpakai).", correct: true },
            { text: "WHERE tanggal BETWEEN '2026-09-01' AND '2026-09-30'", why: "Salah — kehilangan transaksi 30 Sep setelah jam 00:00." },
          ],
        },
        {
          q: "`WHERE strftime('%Y-%m', tanggal) = '2026-09'` pada tabel besar ber-index?",
          options: [
            { text: "Cepat (pakai index)", why: "Salah — fungsi di kolom mematikan index." },
            { text: "Lambat — full scan karena tidak sargable", why: "Benar. Tulis ulang dengan kolom polos: rentang tanggal.", correct: true },
            { text: "Error", why: "Salah — query valid, hanya lambat." },
          ],
        },
      ],
      reference: "Sargable = kolom polos di WHERE; jangan bungkus kolom ter-index dengan fungsi.",
    },
    {
      id: "fungsi-string",
      eyebrow: "Langkah 3 · Fungsi string",
      title: "Membersihkan dan membentuk teks",
      prose: [
        "`UPPER(kota)` / `LOWER(nama)` untuk standardisasi, `SUBSTR(nama, 1, 3)` untuk 3 huruf pertama (SQLite 1-based!), `nama || ' (' || kota || ')'` untuk label, `TRIM(' Andi ')` untuk membuang spasi liar, `LENGTH(nama)` untuk panjang teks. Awas: `NULL || 'x'` = NULL — NULL merambat di operator `||`.",
        "String kotor = musuh JOIN: '0812…' ≠ '+62…' padahal orang yang sama. Pola “normalisasi dulu, aturan kemudian”: bersihkan dulu (mis. buang semua non-digit), baru terapkan aturan format. Dan untuk perbandingan case-insensitive yang aman: `WHERE UPPER(kota) = 'JAKARTA'` — tapi ingat sargable; untuk kolom besar, standardisasi permanen sebaiknya saat ingest (C15/C16), bukan di setiap query.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query di `sql`: tampilkan `label` = NAMA (KOTA) huruf kapital, dan `kode` = 3 huruf pertama nama + id" },
        { id: "t2", text: "Jalankan dan pastikan label Andi = 'ANDI (JAKARTA)'" },
      ],
      expected: "baris: 10 — contoh: ('ANDI (JAKARTA)', 'And1')",
      note: {
        title: "Sering salah",
        body: "`SUBSTR('Jakarta', 1, 3)` di SQLite = 'Jak' (1-based, 3 karakter pertama) — bukan 'aka'. Dan tanggal sebagai string 'YYYY-MM-DD' memang urut alfabetis = kronologis, tapi kamu kehilangan validasi ('2026-13-99' lolos!), aritmetika tanggal, dan timezone. Pakai tipe DATE/TIMESTAMP.",
      },
      hints: [
        "Gabungkan dulu, lalu kapitalkan: UPPER(nama || ' (' || kota || ')').",
        "Kode: SUBSTR(nama, 1, 3) || id.",
        "SELECT UPPER(nama || ' (' || kota || ')') AS label, SUBSTR(nama, 1, 3) || id AS kode FROM nasabah",
      ],
      code: {
        starter: SETUP_NASABAH + TAIL,
        lockLines: 25,
        solution:
          SETUP_NASABAH +
          `
# TULIS QUERY-MU sebagai string sql, lalu jalankan.
sql = """
SELECT UPPER(nama || ' (' || kota || ')') AS label,
SUBSTR(nama, 1, 3) || id AS kode
FROM nasabah
"""
cur.execute(sql)
rows = cur.fetchall()
n = len(rows)
print("baris:", n)
for r in rows:
    print(r)`,
        checks: [
          { kind: "defined", task: "t1", name: "sql", label: "`sql` terdefinisi", msg: "Tulis query-mu sebagai string di variabel sql." },
          { kind: "equal", task: "t1", name: "n", value: 10, tol: 1e-9, label: "10 baris kembali", msg: "Satu baris label per nasabah = 10 baris." },
          { kind: "stdout_matches", task: "t2", pattern: "\\('ANDI \\(JAKARTA\\)', 'And1'\\)", label: "Label Andi benar", msg: "Label = UPPER(nama || ' (' || kota || ')'), kode = SUBSTR(nama,1,3) || id." },
        ],
      },
      reference: "UPPER/LOWER, SUBSTR(x,1,n) 1-based, || (awas NULL), TRIM, LENGTH.",
    },
    {
      id: "minicase-september",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Kenapa laporan September beda?",
      prose: [
        "Dua analis melaporkan “total transaksi September”: Analis A (`WHERE tanggal LIKE '2026-09%'`) = 8,2 juta; Analis B (`WHERE tanggal BETWEEN '2026-09-01' AND '2026-09-30'`) = 8,2 juta; tapi dashboard (filter `>= 09-01 AND < 10-01`) = 8,6 juta. Selisih 400 ribu — transaksi tanggal 2026-09-30 jam 15:00.",
        "Penyebab: `BETWEEN '2026-09-01' AND '2026-09-30'` = hingga '2026-09-30 00:00:00' — transaksi jam 15:00 di tanggal 30 lebih besar dari batas! LIKE lolos karena perbandingan string, tapi rapuh terhadap format. Yang benar: `WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'` — pola setengah-terbuka menangkap semua jam di tanggal 30.",
        "Pelajaran: di SQL, “query-nya jalan” tidak sama dengan “query-nya benar”. Ada dimensi kedua — “tetap benar setelah migrasi” — dan dimensi ketiga — “tetap cepat di 2 juta baris”.",
      ],
      tasks: [],
      reference: "BETWEEN untuk tanggal ber-jam = jebakan; setengah-terbuka selalu aman.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Fungsi: alat mana untuk apa",
      prose: [
        "Filter tanggal → kolom polos + rentang `[awal, akhir)` (sargable; BETWEEN berisiko di batas waktu). Kelompokkan per bulan → `strftime`/`TO_CHAR` di SELECT (bukan WHERE) + GROUP BY. Umur/selisih → aritmetika tanggal (`julianday` — jangan hitung manual). Standardisasi teks → `UPPER`/`LOWER`/`TRIM` (permanen saat ingest untuk kolom besar). Bentuk label → `||` dan `SUBSTR` (awas NULL merambat).",
        "Zona waktu: simpan sebagai TIMESTAMP WITH TIME ZONE (atau UTC) — jangan sebagai string 'DD/MM/YYYY' yang tidak bisa diurut/di-filter benar, dan jangan asumsikan zona server = zona bisnis. Format tampil ≠ format simpan: `strftime`/`TO_CHAR` hanya saat SELECT untuk laporan.",
      ],
      tasks: [],
      reference: "Tanggal: tipe DATE, filter setengah-terbuka, kolom polos di WHERE. String: ||, SUBSTR, TRIM.",
    },
    {
      id: "intuisi-waktu-string",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Waktu adalah data; string hanyalah kostumnya",
      prose: [
        "Dua sumber bug waktu-string yang paling mahal punya akar yang sama: memperlakukan representasi sebagai kebenaran.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: normalisasi dulu, aturannya belakangan",
        body: "String kotor dan waktu ambigu adalah masalah yang sama: data yang belum dinormalisasi. “0812…” vs “+62812…” terlihat beda bagi JOIN padahal orangnya sama; “2026-09-30 15:00” tanpa zona waktu terlihat pasti padahal bisa berarti dua momen berbeda di Jakarta vs UTC. Heuristik praktisi: normalisasi adalah LANGKAH PERTAMA pipeline, bukan polesan terakhir — buang spasi dan prefix telepon di hulu, simpan waktu dalam UTC di hulu, dan dokumentasikan format kanonisnya (satu format tanggal, satu format telepon, satu zona simpan). Setiap aturan bisnis yang ditulis di atas data yang belum dinormalisasi adalah rumah di atas pasir: ia runtuh bukan karena aturannya salah, melainkan karena fondasinya bergeser. Dan bila kamu menemukan dirimu menulis fungsi pembersih yang sama di lima query berbeda, berhentilah — itu tanda normalisasinya harus naik satu level: ke tabel staging, ke view, atau ke kontrak dengan tim yang mengirim datanya.",
      },
      reference: "Normalisasi di hulu; satu format kanonis; fungsi bersih berulang = naikkan level.",
    },
    {
      id: "waktu-produksi",
      eyebrow: "Langkah 7 · Waktu produksi",
      title: "Kebenaran timezone dan LIKE yang membunuh index",
      prose: [
        "Aturan emas yang memisahkan amatir dari profesional: SIMPAN dalam UTC, KONVERSI di tepi (edge). Database menyimpan 2026-09-30 08:00:00+00; aplikasi menampilkan 15:00 WIB kepada pengguna Jakarta. Kenapa? Karena zona waktu adalah aturan politik, bukan fisika — pemerintah bisa menggeser DST atau zona kapan saja, dan bila data tersimpanmu sudah “dikonversi” ke waktu lokal, sejarahnya rusak permanen saat aturan berubah. UTC tidak pernah punya DST; ia satu-satunya fondasi yang stabil. Di SQLite, kolom TEXT 'YYYY-MM-DD HH:MM:SS' dalam UTC plus konversi tampilan di aplikasi adalah pola yang aman dan portabel.",
        "Jebakan DST yang konkret: pada hari peralihan DST, jam 02:30 terjadi DUA kali (fall back) — string “02:30” tanpa offset ambigu, dan agregasi per jam hari itu menggandakan satu jam tanpa peringatan. Sebaliknya saat spring forward, jam 02:30 tidak pernah ada — bucket-nya kosong dan grafik berlubang. Bila sumber datamu mencatat waktu lokal tanpa offset, kamu tidak bisa merekonstruksi kebenaran setelahnya; tuntut offset dari hulu (format ISO dengan +07:00) atau terima bahwa analisismu punya selisih satu jam dua kali setahun. Laporan “transaksi per jam” yang angkanya aneh tiap Maret/Oktober hampir pasti korban DST.",
        "Aritmetika waktu yang aman memakai interval, bukan string: di SQLite, datetime(tanggal, '+7 hours') menggeser zona, julianday(a) - julianday(b) memberi selisih hari desimal, dan strftime('%Y-%m-%d', tanggal) memotong ke tanggal. Aturan: jangan pernah mengurai string tanggal dengan SUBSTR untuk komputasi — pakai fungsi tanggal bawaannya, karena “tambah 1 bulan” pada 31 Januari bukan operasi string. Dan untuk perbandingan rentang, pola setengah-terbuka [awal, akhir) tetap rajanya: ia benar untuk DATETIME berpresisi apa pun, tidak seperti BETWEEN yang bocor di batas.",
        "Sisi string yang mematikan performa: LIKE dengan wildcard di DEPAN. WHERE nama LIKE 'kopi%' (awalan) masih bisa memakai index B-tree — database mencari rentang “kopi” sampai “kopj”. WHERE nama LIKE '%kopi' (akhiran/berisi) memaksa full scan: index tidak bisa membantu karena pola tidak berjangkar. Pada 10 juta baris, bedanya detik vs menit. Bila kebutuhan bisnisnya memang “cari di mana saja” (search-as-you-type), solusinya bukan LIKE '%x%' — melainkan trigram index (Postgres pg_trgm) atau mesin pencari teks (full-text search) — dan itu keputusan arsitektur, bukan trik query.",
        "Aturan keputusan senior untuk string: cari awalan → LIKE 'x%' + index biasa (sargable). Cari di mana saja sesekali di data kecil → LIKE '%x%' boleh, sadar biayanya. Cari di mana saja di data besar dan sering → full-text/trigram index, jangan paksakan LIKE. Dan satu detail yang menjebak: LIKE '%100%%' — persen di dalam pola harus di-escape (LIKE '%100\\%%' ESCAPE '\\'), kalau tidak “100%” cocok dengan “1000” juga. Karakter spesial (_ dan %) di input pengguna selalu di-escape — ini bukan optimasi, ini kebenaran hasil.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Simpan waktu lokal saja, toh semua pengguna kita di Indonesia.” Sampai perusahaan ekspansi ke Singapura, atau server pindah ke UTC, atau analis membandingkan log server (UTC) dengan transaksi (WIB) dan selisihnya 7 jam tanpa penjelasan. Waktu lokal adalah tampilan; UTC adalah penyimpanan. Mencampurnya adalah utang yang menagih saat kamu paling tidak siap.",
      },
      reference: "Simpan UTC, tampilkan lokal; LIKE berjangkar di depan = index, wildcard di depan = scan.",
    },
    {
      id: "sargable-lanjut",
      eyebrow: "Langkah 8 · Sargable lanjut",
      title: "Menulis kondisi yang membiarkan index bekerja",
      prose: [
        "Prinsip sargable dalam satu kalimat: fungsi boleh di sisi KONSTANTA, tidak boleh di sisi KOLOM. WHERE tanggal >= date('now', '-30 days') — fungsi di sisi kanan (dihitung sekali), kolom tanggal telanjang di kiri → index dipakai. WHERE date(tanggal) >= date('now', '-30 days') — fungsi membungkus kolom → database harus menghitung date() untuk SETIAP baris sebelum membandingkan → full scan. Keduanya “terlihat” mencari 30 hari terakhir; hanya satu yang selesai dalam detik di 10 juta baris.",
        "Tiga pola non-sargable yang paling sering lolos code review: (1) aritmetika di kolom — WHERE harga * 1.1 > 100000 harus ditulis WHERE harga > 100000 / 1.1 (pindahkan operasi ke sisi konstanta); (2) konversi tipe implisit — WHERE id = '123' saat id INTEGER: di Postgres, perbandingan integer-vs-text memaksa cast di sisi kolom dan membunuh index, di samping berisiko salah; samakan tipe literal dengan tipe kolom; (3) fungsi tanggal di kolom — WHERE strftime('%Y-%m', tanggal) = '2026-09' harus menjadi rentang setengah-terbuka atas kolom telanjang.",
        "Kapan aturan ini TIDAK penting? Tabel kecil (< 100 ribu baris) — full scan atas data kecil lebih murah daripada seek index, dan optimizer tahu itu; menulis sargable di sana adalah kebiasaan baik, bukan kebutuhan. Tabel besar dengan filter sangat selektif — di sinilah sargable mengubah menit menjadi detik. Dan satu pengecualian modern: expression index (CREATE INDEX idx ON t (date(tanggal))) membuat fungsi-tertentu menjadi sargable — tetapi itu index khusus untuk SATU ekspresi, bukan alasan untuk menulis fungsi di kolom secara umum.",
        "Aturan keputusan: tulis kondisi dengan kolom telanjang di satu sisi dan nilai/ekspresi-konstan di sisi lain — jadikan ini refleks, bukan optimasi. Bila query lambat, EXPLAIN QUERY PLAN adalah pemeriksanya: cari SCAN pada tabel besar, lalu tanyakan “fungsi apa yang membungkus kolomku?”. Sembilan dari sepuluh “query lambat misterius” yang saya temui berakhir di jawaban ini.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Biar gampang dibaca, pakai fungsi di kolom saja.” Keterbacaan tidak harus dikorbankan: WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01' sama terbacanya dengan versi strftime, dan 100× lebih cepat di data besar. Yang benar-benar mengorbankan keterbacaan adalah komentar “kenapa dashboard lambat” enam bulan kemudian.",
      },
      reference: "Fungsi di sisi konstanta (sekali), kolom telanjang di sisi kiri (sargable).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran. Setiap opsi punya alasan — baca semuanya."],
      tasks: [],
      summary: [
        "Tanggal: ekstrak (strftime), selisih (julianday), relatif (date('now')).",
        "Filter: pola setengah-terbuka [awal, akhir) — sargable, aman di batas jam.",
        "String: UPPER/LOWER, SUBSTR (1-based), || (awas NULL), TRIM, REPLACE.",
        "Jangan: fungsi di kolom ter-index (WHERE); tanggal sebagai string; abaikan timezone.",
        "“Query jalan” ≠ “query benar” ≠ “query cepat” — tiga dimensi yang berbeda.",
      ],
      next: { label: "C5 — JOIN", href: "/learn/c5-join" },
      quiz: [
        {
          q: "`SELECT 'A' || NULL` menghasilkan?",
          options: [
            { text: "'A'", why: "Salah — NULL menular ke seluruh ekspresi." },
            { text: "NULL", why: "Benar. Bungkus dengan COALESCE jika perlu.", correct: true },
            { text: "Error", why: "Salah — tidak error, hasilnya NULL." },
          ],
        },
        {
          q: "`SUBSTR('Jakarta', 1, 3)` di SQLite?",
          options: [
            { text: "'Jak'", why: "Benar. SQLite 1-based: 3 karakter pertama.", correct: true },
            { text: "'aka'", why: "Salah — itu jika 0-based seperti Python." },
            { text: "Error", why: "Salah — query valid." },
          ],
        },
        {
          q: "`BETWEEN '2026-09-01' AND '2026-09-30'` untuk kolom timestamp?",
          options: [
            { text: "Aman", why: "Salah — batas atas = 30 Sep 00:00:00." },
            { text: "Kehilangan data 30 Sep setelah jam 00:00", why: "Benar. Pakai pola setengah-terbuka: >= 09-01 AND < 10-01.", correct: true },
            { text: "Melebihi ke Oktober", why: "Salah — masalahnya kekurangan, bukan kelebihan." },
          ],
        },
        {
          q: "Menyimpan tanggal sebagai string 'DD/MM/YYYY' — masalahnya?",
          options: [
            { text: "Tidak bisa diurut/di-filter dengan benar dan kehilangan validasi", why: "Benar. '2026-13-99' lolos sebagai string! Pakai tipe DATE/TIMESTAMP; format hanya saat tampil.", correct: true },
            { text: "Tidak ada masalah", why: "Salah — tiga masalah di opsi pertama." },
            { text: "Hanya masalah tampilan", why: "Salah — masalahnya di validasi, aritmetika, dan timezone." },
          ],
        },
        {
          q: "Query 2 detik jadi 40 detik setelah mengganti filter tanggal menjadi `WHERE MONTH(tanggal) = 9`. Diagnosis?",
          options: [
            { text: "Datanya bertambah", why: "Salah — datanya sama." },
            { text: "Fungsi di kolom mematikan index → full scan", why: "Benar. Tulis ulang sargable: kolom polos + rentang.", correct: true },
            { text: "Server rusak", why: "Salah — penyebabnya pola query, bukan server." },
          ],
        },
      ],
    },
  ],
};

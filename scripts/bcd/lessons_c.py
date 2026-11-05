#!/usr/bin/env python3
"""Track C: SQL — 19 lessons. Lab = sqlite3 runnable di Pyodide."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from render import Lesson, T, TI, myth, tip, callout, worked, codebox, sql_answer, sql_lab_code, qa_lesson

LESSONS = []

# ---------------------------------------------------------------- dataset
NASABAH_DDL = """CREATE TABLE nasabah (
  id INTEGER PRIMARY KEY,
  nama TEXT,
  kota TEXT,
  penghasilan REAL,
  dpd INTEGER,
  status TEXT
)"""
NASABAH_ROWS = [
    (1, "Andi", "Jakarta", 8500000, 0, "lancar"),
    (2, "Budi", "Bandung", 12000000, 15, "lancar"),
    (3, "Citra", "Jakarta", 6700000, 45, "telat"),
    (4, "Dewi", "Surabaya", 15000000, 0, "lancar"),
    (5, "Eko", "Jakarta", None, 90, "macet"),
    (6, "Fitri", "Bandung", 9200000, 5, "lancar"),
    (7, "Gilang", "Medan", 7800000, 30, "telat"),
    (8, "Hesti", "Jakarta", 11000000, 0, "lancar"),
    (9, "Irfan", "Surabaya", 5400000, 120, "macet"),
    (10, "Joko", "Medan", 8900000, 0, "lancar"),
]

TRANSAKSI_DDL = """CREATE TABLE transaksi (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  tanggal TEXT,
  jumlah REAL,
  kategori TEXT,
  channel TEXT
)"""
TRANSAKSI_ROWS = [
    (1, 1, "2026-09-01", 500000, "belanja", "mobile"),
    (2, 1, "2026-09-03", 250000, "makan", "mobile"),
    (3, 2, "2026-09-01", 1000000, "belanja", "web"),
    (4, 3, "2026-09-05", 75000, "makan", "mobile"),
    (5, 2, "2026-09-10", 2000000, "travel", "web"),
    (6, 4, "2026-09-02", 300000, "belanja", "mobile"),
    (7, 5, "2026-09-08", 150000, "makan", "atm"),
    (8, 3, "2026-09-12", 500000, "belanja", "mobile"),
    (9, 1, "2026-09-15", 1200000, "travel", "web"),
    (10, 6, "2026-09-20", 80000, "makan", "mobile"),
    (11, 7, "2026-09-21", 950000, "belanja", "mobile"),
    (12, 2, "2026-09-25", 400000, "makan", "web"),
    (13, 8, "2026-09-26", 600000, "belanja", "mobile"),
    (14, 9, "2026-09-27", 200000, "makan", "atm"),
    (15, 10, "2026-09-28", 350000, "belanja", "web"),
]

KREDIT_DDL = """CREATE TABLE kredit (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  plafon REAL,
  tenor INTEGER,
  dpd INTEGER,
  kolektibilitas INTEGER
)"""
KREDIT_ROWS = [
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
    (12, 5, 20000000, 6, 150, 5),
]


def lab_sql(tables, task, starter):
    return sql_lab_code(tables, task, starter)

# ================================================================== C1
def c1():
    L = Lesson("c1-select-dasar", "C1 — SQL",
        "SELECT: Bertanya ke Database<br/>dengan Bahasa Manusia",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("b17-bayesian-praktis", "← B17"), ("c2-null-logika", "Next: C2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>model relasional</strong>: tabel, baris, kolom, primary key.</li>"
        "<li>Menulis query <strong>SELECT–FROM–WHERE–ORDER BY–LIMIT</strong> yang benar.</li>"
        "<li>Memakai <strong>DISTINCT</strong> dan alias kolom.</li>"
        "<li>Membedakan <strong>urutan tulis</strong> vs <strong>urutan eksekusi</strong> query.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Kasih Saya Data Nasabah Jakarta&rdquo;")
    L.raw('<div className="story"><p>Manajer cabang memintamu: <em>&ldquo;Kasih saya data nasabah Jakarta yang penghasilannya di atas 8 juta, urut dari yang terbesar. Saya butuh 5 menit lagi untuk rapat.&rdquo;</em></p>'
        "<p>Tanpa SQL, kamu buka Excel 100.000 baris, filter manual, copy-paste — 20 menit dan rawan salah. Dengan SQL, satu query 4 baris menjawab dalam <strong>1 detik</strong> — dan bisa dipakai ulang selamanya.</p>"
        "<p>SQL adalah <strong>skill #1 data analyst</strong> (semua riset job 2026 menaruhnya di puncak — di atas Python!). Lesson ini fondasinya: cara &ldquo;bertanya&rdquo; ke database.</p></div>")

    L.sec("relasional", "Model Relasional — Dunianya Tabel")
    L.p("<strong>Definisi.</strong> Database relasional menyimpan data sebagai <strong>tabel</strong>: <strong>baris</strong> (record) × <strong>kolom</strong> (field). Tiap tabel punya <strong>primary key</strong> — kolom yang unik per baris (misal <code className=\"inline\">nasabah.id</code>).")
    L.p("<strong>Contoh</strong> tabel <code className=\"inline\">nasabah</code> (10 baris, dipakai di semua lab lesson ini):")
    L.table(["id", "nama", "kota", "penghasilan", "dpd", "status"],
        [["1", "Andi", "Jakarta", "8.500.000", "0", "lancar"],
         ["2", "Budi", "Bandung", "12.000.000", "15", "lancar"],
         ["...", "...", "...", "...", "...", "..."]])
    L.p("<strong>Kepribadian SQL:</strong> SQL itu <strong>deklaratif</strong> — kamu bilang <em>apa</em> yang kamu mau (&ldquo;nasabah Jakarta&rdquo;), bukan <em>bagaimana</em> mencarinya (database yang optimasi). Beda dengan Python yang imperatif (langkah per langkah).")
    L.raw(tip("Hafalkan anatomi query dasar: " + "<code className=\"inline\">SELECT</code> (kolom apa) → <code className=\"inline\">FROM</code> (dari tabel mana) → <code className=\"inline\">WHERE</code> (baris mana) → <code className=\"inline\">ORDER BY</code> (urut bagaimana) → <code className=\"inline\">LIMIT</code> (berapa baris). Lima kata ini = 80% query sehari-hari."))

    L.sec("select", "SELECT–FROM–WHERE — Tiga Kata Ajaib")
    L.p("Query manajer cabang:")
    L.raw(codebox("SELECT nama, kota, penghasilan\nFROM nasabah\nWHERE kota = 'Jakarta' AND penghasilan > 8000000\nORDER BY penghasilan DESC\nLIMIT 5;", "sql"))
    L.ul([
        "<code className=\"inline\">SELECT nama, kota, penghasilan</code> — kolom yang ditampilkan (pakai <code className=\"inline\">*</code> untuk semua, tapi hindari di produksi!).",
        "<code className=\"inline\">FROM nasabah</code> — tabel sumber.",
        "<code className=\"inline\">WHERE kota = 'Jakarta' AND penghasilan > 8000000</code> — saring baris. String pakai <strong>kutip satu</strong>!",
        "<code className=\"inline\">ORDER BY penghasilan DESC</code> — urut menurun (ASC = menaik, default).",
        "<code className=\"inline\">LIMIT 5</code> — 5 baris teratas.",
    ])
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: nama &amp; dpd nasabah yang telat (dpd &gt; 0), urut dpd terbesar.</p>"
        "<p><strong>Langkah 1</strong> — kolom: <code className=\"inline\">SELECT nama, dpd</code></p>"
        "<p><strong>Langkah 2</strong> — tabel: <code className=\"inline\">FROM nasabah</code></p>"
        "<p><strong>Langkah 3</strong> — saring: <code className=\"inline\">WHERE dpd &gt; 0</code></p>"
        "<p><strong>Langkah 4</strong> — urut: <code className=\"inline\">ORDER BY dpd DESC</code></p>"
        "<p>Hasil: Irfan 120, Eko 90, Citra 45, Gilang 30, Budi 15, Fitri 5.</p>"))
    L.raw(myth("SELECT * tidak apa-apa untuk dipakai.",
        "Untuk eksplorasi cepat OK — tapi di query produksi/pipeline, <code className=\"inline\">*</code> berbahaya: (1) mengambil kolom tak perlu (boros), (2) pecah jika skema berubah (kolom baru tiba-tiba ikut), (3) menyembunyikan maksud query. <strong>Selalu sebutkan kolom eksplisit</strong> di kode yang disimpan."))
    L.raw(tip("Operator WHERE: <code className=\"inline\">=</code>, <code className=\"inline\">&lt;&gt;</code> (tidak sama), <code className=\"inline\">&gt;</code>, <code className=\"inline\">&gt;=</code>, <code className=\"inline\">AND</code>, <code className=\"inline\">OR</code>, <code className=\"inline\">NOT</code>. Kurungkan OR campuran: <code className=\"inline\">WHERE (a OR b) AND c</code> — AND dihitung dulu seperti × dalam matematika!"))

    L.sec("distinct", "DISTINCT &amp; Alias — Merapikan Output")
    L.p("<code className=\"inline\">DISTINCT</code> membuang duplikat:")
    L.raw(codebox("SELECT DISTINCT kota FROM nasabah;", "sql"))
    L.p("Hasil: Jakarta, Bandung, Surabaya, Medan (4 baris, bukan 10). <strong>Alias</strong> memberi nama baru ke kolom:")
    L.raw(codebox("SELECT nama AS nama_nasabah,\n       penghasilan / 1000000 AS gaji_jt\nFROM nasabah;", "sql"))
    L.p("<strong>Kapan dipakai:</strong> DISTINCT untuk &ldquo;daftar unik&rdquo; (kota apa saja? kategori apa saja?); alias agar output terbaca (<code className=\"inline\">gaji_jt</code> lebih jelas dari <code className=\"inline\">penghasilan / 1000000</code>).")
    L.raw(myth("DISTINCT mempercepat query.",
        "Justru sebaliknya — DISTINCT butuh sorting/dedup tambahan. Jangan pakai &ldquo;untuk jaga-jaga&rdquo;. Jika hasilmu berduplikat padahal seharusnya tidak, <strong>akar masalahnya biasanya JOIN yang fan-out</strong> (C5!) — DISTINCT hanya menutupi gejala."))

    L.sec("eksekusi", "Urutan Eksekusi — Ditulis Beda, Dijalankan Beda")
    L.p("Kamu menulis: SELECT → FROM → WHERE → ORDER BY. Database menjalankan:")
    L.p(T(r"\\text{FROM} \\;\\to\\; \\text{WHERE} \\;\\to\\; \\text{SELECT} \\;\\to\\; \\text{ORDER BY} \\;\\to\\; \\text{LIMIT}"))
    L.p("<strong>Mengapa penting?</strong> Karena alias yang didefinisikan di SELECT <strong>tidak bisa</strong> dipakai di WHERE (WHERE jalan duluan!) — tapi <strong>bisa</strong> dipakai di ORDER BY. Error klasik pemula:")
    L.raw(codebox("-- SALAH: gaji_jt belum ada saat WHERE dieksekusi\nSELECT penghasilan/1000000 AS gaji_jt\nFROM nasabah\nWHERE gaji_jt > 8;  -- ERROR!\n\n-- BENAR: ulangi ekspresi, atau pakai subquery (C6)\nSELECT penghasilan/1000000 AS gaji_jt\nFROM nasabah\nWHERE penghasilan/1000000 > 8;", "sql"))
    L.raw(tip("Hafalkan urutan eksekusi — ia menjelaskan 50% error &ldquo;aneh&rdquo; SQL: kenapa alias tak bisa di WHERE, kenapa agregasi tak bisa di WHERE (butuh HAVING — C3), kenapa window function tak bisa di WHERE (C9)."))

    L.chart(
        data=[{"x": ["Jakarta", "Bandung", "Surabaya", "Medan"], "y": [4, 2, 2, 2],
               "type": "bar", "marker": {"color": "#2a7de1"},
               "text": ["4", "2", "2", "2"], "textposition": "outside"}],
        title="Nasabah per Kota (SELECT kota, COUNT(*) ... GROUP BY)",
        layout={"xaxis": {"title": "Kota"}, "yaxis": {"title": "Jumlah nasabah"}, "showlegend": False},
        cara="Sumbu X = kota (hasil DISTINCT), tinggi batang = jumlah nasabah. (Query agregasi = topik C3 — ini bocoran!)",
        interpretasi="Jakarta dominan (40%). Chart seperti ini = jawaban visual dari &ldquo;sebaran nasabah bagaimana?&rdquo; — query 2 baris + chart menjawab pertanyaan bisnis dalam 1 menit.")

    L.sec("lab1", "🔬 Lab 1: Query Pertama — Nasabah Jakarta")
    L.lab("Lab 1 — SELECT/WHERE/ORDER BY (Live SQL)",
        "Database <code className=\"inline\">nasabah</code> sudah dimuat (10 baris). Tulis query untuk: nama &amp; penghasilan nasabah Jakarta dengan penghasilan &gt; 8 juta, urut terbesar.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "Tampilkan nama & penghasilan nasabah Jakarta berpenghasilan > 8000000, urut menurun.",
                "SELECT nama, penghasilan FROM nasabah WHERE kota = 'Jakarta'"),
        "Ubah jadi: semua kota, tapi hanya yang dpd = 0. Lalu coba ORDER BY nama ASC.")
    L.raw(sql_answer("Jawaban Lab 1",
        "SELECT nama, penghasilan\nFROM nasabah\nWHERE kota = 'Jakarta' AND penghasilan > 8000000\nORDER BY penghasilan DESC;"))

    L.sec("lab2", "🔬 Lab 2: DISTINCT &amp; Batasan WHERE")
    L.lab("Lab 2 — Kota Unik & Status",
        "Tampilkan daftar kota unik, lalu: nasabah yang statusnya 'telat' ATAU 'macet', urut berdasarkan dpd terbesar.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "1) SELECT DISTINCT kota FROM nasabah  2) nama, status, dpd WHERE status = 'telat' OR status = 'macet' ORDER BY dpd DESC",
                "SELECT DISTINCT kota FROM nasabah"),
        "Coba: WHERE NOT status = 'lancar'. Sama hasilnya? (Hati-hati NULL — topik C2!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- 1)\nSELECT DISTINCT kota FROM nasabah;\n\n-- 2)\nSELECT nama, status, dpd\nFROM nasabah\nWHERE status = 'telat' OR status = 'macet'\nORDER BY dpd DESC;"))

    L.sec("peta", "🗺️ Peta Keputusan: Klausa Mana?")
    L.decision("1", "Mau kolom tertentu → <strong>SELECT kolom</strong>",
        "Tidak butuh semua kolom.",
        kenapa="Eksplisit, hemat, anti-pecah saat skema berubah.",
        contoh="SELECT nama, penghasilan (bukan *).")
    L.decision("2", "Mau baris tertentu → <strong>WHERE</strong>",
        "Filter berdasar nilai kolom.",
        kenapa="Dieksekusi sebelum SELECT — alias belum tersedia.",
        contoh="WHERE kota = 'Jakarta' AND dpd > 0.")
    L.decision("3", "Mau daftar unik → <strong>DISTINCT</strong>",
        "Hilangkan duplikat.",
        kenapa="Satu kata, tapi ada biaya sorting — jangan untuk jaga-jaga.",
        contoh="SELECT DISTINCT kota.")
    L.decision("4", "Mau urutan / batasi → <strong>ORDER BY + LIMIT</strong>",
        "Top-N, sampel cepat.",
        kenapa="ORDER BY tanpa LIMIT mengurut semua (mahal); LIMIT tanpa ORDER BY = acak!",
        contoh="ORDER BY penghasilan DESC LIMIT 5.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Tulis: SELECT → FROM → WHERE → ORDER BY → LIMIT. Ingat eksekusi: FROM → WHERE → SELECT.</li>"
        "<li>String = kutip satu. AND sebelum OR (kurungkan!).</li>"
        "<li>LIMIT tanpa ORDER BY = sampel acak — jangan untuk &ldquo;top&rdquo; apapun.</li>"
        "<li>Sebutkan kolom eksplisit, jangan *.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Daftar Prioritas Collection Pagi Ini")
    L.raw(callout("<p>Tim collection butuh daftar pagi ini: <em>nama, kota, dpd</em> nasabah dengan status 'telat' atau 'macet', urut dpd terbesar, 5 teratas saja — untuk ditelepon pertama.</p>"
        "<p><strong>Pertanyaan:</strong> tulis query-nya. Lalu: apa risiko jika lupa ORDER BY?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">SELECT nama, kota, dpd FROM nasabah WHERE status IN ('telat','macet') ORDER BY dpd DESC LIMIT 5;</code></p>"
        "<p>Hasil: Irfan 120, Eko 90, Citra 45, Gilang 30, Budi 15.</p>"
        "<p><strong>Risiko lupa ORDER BY:</strong> LIMIT 5 tanpa ORDER BY mengambil 5 baris <em>acak</em> (urutan storage) — tim menelepon nasabah yang salah sementara yang macet 120 hari tidak dihubungi. <strong>Pelajaran:</strong> LIMIT tanpa ORDER BY bukan &ldquo;top&rdquo; — ia undian.</p>")))

    L.quiz("Urutan EKSEKUSI query yang benar…",
        ["SELECT → FROM → WHERE", "FROM → WHERE → SELECT → ORDER BY → LIMIT", "WHERE → SELECT → FROM", "LIMIT → SELECT → FROM"],
        1, "Benar: FROM dulu (ambil tabel), WHERE (saring), baru SELECT (pilih kolom). Ini menjelaskan kenapa alias tak bisa di WHERE.")
    L.quiz("Query: SELECT nama FROM nasabah WHERE gaji_jt > 8 (gaji_jt alias di SELECT). Hasilnya…",
        ["Berhasil", "Error — alias belum ada saat WHERE dieksekusi", "Hasil kosong", "Semua baris"],
        1, "Benar: WHERE jalan sebelum SELECT. Ulangi ekspresi atau pakai subquery (C6).")
    L.quiz("LIMIT 5 tanpa ORDER BY menghasilkan…",
        ["5 terbesar", "5 baris acak (urutan storage)", "Error", "5 pertama alfabetis"],
        1, "Benar: tanpa ORDER BY, &ldquo;top 5&rdquo; = undian. Selalu pasangkan dengan ORDER BY.")
    L.quiz("Kapan DISTINCT tepat dipakai?",
        ["Untuk mempercepat query", "Untuk jaga-jaga", "Untuk daftar nilai unik (kota/kategori apa saja)", "Tidak pernah"],
        2, "Benar: daftar unik. Bukan untuk jaga-jaga — duplikat tak terduga biasanya gejala JOIN fan-out (C5).")
    L.quiz("WHERE (a OR b) AND c vs WHERE a OR b AND c — bedanya…",
        ["Sama saja", "AND dihitung dulu — tanpa kurung artinya a OR (b AND c)", "OR dihitung dulu", "Keduanya error"],
        1, "Benar: AND seperti ×, OR seperti +. Kurungkan agar maksud eksplisit.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Model relasional:</strong> tabel = baris × kolom; primary key unik per baris.</li>"
        "<li><strong>Lima kata:</strong> SELECT (kolom) → FROM (tabel) → WHERE (baris) → ORDER BY → LIMIT.</li>"
        "<li><strong>Eksekusi:</strong> FROM → WHERE → SELECT — alias tak bisa di WHERE.</li>"
        "<li><strong>DISTINCT</strong> untuk unik; <strong>alias</strong> untuk keterbacaan.</li>"
        "<li><strong>Jangan:</strong> SELECT * di produksi; LIMIT tanpa ORDER BY; DISTINCT untuk jaga-jaga.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C2
def c2():
    L = Lesson("c2-null-logika", "C2 — SQL",
        "NULL: Ketidakhadiran yang<br/>Punya Aturan Sendiri",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c1-select-dasar", "← C1"), ("c3-agregasi-groupby", "Next: C3"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>NULL</strong> (unknown) vs 0 vs string kosong — dan mengapa <code className=\"inline\">= NULL</code> selalu salah.</li>"
        "<li>Menerapkan <strong>logika 3-nilai</strong> (TRUE/FALSE/UNKNOWN) pada WHERE.</li>"
        "<li>Memakai <strong>COALESCE</strong> untuk nilai pengganti yang aman.</li>"
        "<li>Memakai <strong>LIKE, IN, BETWEEN, CASE</strong> untuk filter &amp; kategorisasi.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Nasabah &ldquo;Hilang&rdquo; dari Laporan")
    L.raw('<div className="story"><p>Analis membuat laporan: <em>&ldquo;nasabah dengan penghasilan di bawah 10 juta&rdquo;</em> — query <code className="inline">WHERE penghasilan &lt; 10000000</code>. Laporan rapi: 6 nasabah. Tapi Eko (penghasilan <strong>NULL</strong> — belum diinput) tidak muncul. Juga tidak muncul di laporan &ldquo;di atas 10 juta&rdquo;. <strong>Eko hilang dari kedua laporan!</strong></p>'
        "<p>NULL bukan nol, bukan kosong — ia &ldquo;tidak tahu&rdquo;. Dan &ldquo;tidak tahu &lt; 10 juta&rdquo; hasilnya bukan TRUE/FALSE melainkan <strong>UNKNOWN</strong> — yang disaring keluar oleh WHERE. Setiap analis pasti pernah kehilangan data karena NULL. Lesson ini memastikan kamu tidak mengulanginya.</p></div>")

    L.sec("null", "NULL — &ldquo;Tidak Tahu&rdquo;, Bukan Nol")
    L.table(["Nilai", "Artinya", "Contoh"],
        [["NULL", "Tidak tahu / belum diisi", "Penghasilan Eko belum diinput"],
         ["0", "Tahu: nilainya nol", "DPD 0 = tidak menunggak"],
         ["'' (string kosong)", "Tahu: teks kosong", "Nama panggilan dikosongkan"]])
    L.p("<strong>Aturan emas:</strong> apapun dibandingkan dengan NULL → <strong>UNKNOWN</strong>:")
    L.raw(codebox("SELECT NULL = NULL;      -- UNKNOWN (bukan TRUE!)\nSELECT NULL + 5;         -- NULL\nSELECT NULL > 10000000;  -- UNKNOWN", "sql"))
    L.p("WHERE hanya meloloskan <strong>TRUE</strong> — UNKNOWN disaring! Inilah mengapa Eko hilang dari kedua laporan.")
    L.p("<strong>Cara benar:</strong> <code className=\"inline\">IS NULL</code> / <code className=\"inline\">IS NOT NULL</code>:")
    L.raw(codebox("SELECT nama FROM nasabah WHERE penghasilan IS NULL;  -- Eko", "sql"))
    L.raw(myth("NULL = 0, jadi bisa dibandingkan biasa.",
        "Beda total! <code className=\"inline\">WHERE penghasilan = 0</code> tidak menemukan NULL. <code className=\"inline\">COUNT(penghasilan)</code> melewatkan NULL tapi <code className=\"inline\">COUNT(*)</code> tidak (C3!). Rata-rata mengabaikan NULL — yang bisa bias jika NULL-nya tidak acak (MNAR, A1.7). NULL menuntut perlakuan khusus di setiap klausa."))
    L.raw(tip("Saat eksplorasi tabel baru, query pertamamu harus: <code className=\"inline\">SELECT COUNT(*), COUNT(kolom) FROM t</code> — selisihnya = jumlah NULL. Ditambah <code className=\"inline\">SELECT ... WHERE kolom IS NULL LIMIT 5</code> untuk melihat polanya. Kebiasaan 30 detik yang menyelamatkan jam debugging."))

    L.sec("logika3", "Logika 3-Nilai — TRUE / FALSE / UNKNOWN")
    L.table(["A", "B", "A AND B", "A OR B", "NOT A"],
        [["TRUE", "UNKNOWN", "UNKNOWN", "TRUE", "FALSE"],
         ["FALSE", "UNKNOWN", "FALSE", "UNKNOWN", "TRUE"],
         ["UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN"]])
    L.p("<strong>Implikasi praktis:</strong> <code className=\"inline\">WHERE NOT (penghasilan > 10000000)</code> — untuk Eko (NULL): NOT UNKNOWN = UNKNOWN → <strong>tersaring!</strong> &ldquo;Tidak (di atas 10jt)&rdquo; ≠ &ldquo;di bawah 10jt&rdquo; saat ada NULL.")
    L.p("<strong>COALESCE</strong> — beri nilai pengganti yang aman:")
    L.raw(codebox("SELECT nama,\n       COALESCE(penghasilan, 0) AS penghasilan_aman\nFROM nasabah;", "sql"))
    L.p("COALESCE mengambil argumen non-NULL pertama. <strong>Kapan:</strong> sebelum agregasi/aritmetika — tapi dokumentasikan! Mengganti NULL dengan 0 mengubah makna (ingat A1.7: 0 adalah nilai, bukan &ldquo;tidak tahu&rdquo;).")
    L.raw(tip("Pola aman: <code className=\"inline\">COALESCE</code> untuk <em>perhitungan</em> (agar tidak NULL-merambat), tapi pertahankan kolom asli untuk <em>analisis</em> (agar tahu mana yang imputasi). Tambahkan flag: <code className=\"inline\">(penghasilan IS NULL) AS penghasilan_missing</code>."))

    L.sec("like", "LIKE, IN, BETWEEN — Filter Ekspresif")
    L.raw(codebox("-- LIKE: pola teks (% = sembarang, _ = satu karakter)\nSELECT nama FROM nasabah WHERE nama LIKE 'A%';   -- diawali A\nSELECT nama FROM nasabah WHERE nama LIKE '%i';   -- diakhiri i\n\n-- IN: daftar nilai\nSELECT nama FROM nasabah\nWHERE kota IN ('Jakarta', 'Surabaya');\n\n-- BETWEEN: rentang inklusif\nSELECT nama, dpd FROM nasabah\nWHERE dpd BETWEEN 30 AND 90;  -- termasuk 30 dan 90!", "sql"))
    L.ul([
        "<code className=\"inline\">LIKE</code>: <code className=\"inline\">%</code> = nol/lebih karakter, <code className=\"inline\">_</code> = tepat satu. Hati-hati: LIKE '%x%' tidak bisa pakai index (C17!).",
        "<code className=\"inline\">IN</code>: lebih rapi dari OR beruntun. <strong>Jebakan NULL:</strong> <code className=\"inline\">x NOT IN (1, 2, NULL)</code> → selalu UNKNOWN/false! (C6 bahas.)",
        "<code className=\"inline\">BETWEEN</code>: <strong>inklusif</strong> kedua ujung. Untuk tanggal, lebih aman pakai <code className=\"inline\">&gt;=</code> dan <code className=\"inline\">&lt;</code> (C4).",
    ])
    L.raw(myth("NOT IN aman dipakai.",
        "Jika daftar mengandung NULL, <code className=\"inline\">NOT IN</code> tidak mengembalikan apapun — diam-diam! Ini bug klasik yang lolos review. Aturan: pastikan daftar bersih dari NULL, atau pakai <code className=\"inline\">NOT EXISTS</code> (C6)."))

    L.sec("case", "CASE — IF-nya SQL")
    L.raw(codebox("SELECT nama, dpd,\n  CASE\n    WHEN dpd = 0 THEN 'lancar'\n    WHEN dpd BETWEEN 1 AND 30 THEN 'ringan'\n    WHEN dpd BETWEEN 31 AND 90 THEN 'sedang'\n    ELSE 'berat'\n  END AS bucket_risiko\nFROM nasabah;", "sql"))
    L.p("<strong>Kapan dipakai:</strong> kategorisasi (bucket DPD!), label, pivot manual (C10), conditional aggregation (C3). CASE dievaluasi <strong>berurutan</strong> — WHEN pertama yang cocok menang (seperti IF-ELSE).")
    L.p("<strong>CASE sederhana</strong> untuk kesetaraan:")
    L.raw(codebox("SELECT nama,\n  CASE status\n    WHEN 'lancar' THEN 'OK'\n    WHEN 'telat' THEN 'Waspada'\n    ELSE 'Bahaya'\n  END AS label\nFROM nasabah;", "sql"))
    L.raw(tip("CASE adalah &ldquo;lem super&rdquo; SQL: ia mengubah angka jadi kategori bisnis, membuat kolom flag, dan menjadi fondasi <strong>conditional aggregation</strong> (C3) — pola paling sering di interview: <code className=\"inline\">COUNT(CASE WHEN ... THEN 1 END)</code>."))

    L.chart(
        data=[{"x": ["lancar", "ringan (1-30)", "sedang (31-90)", "berat (>90)", "NULL dpd"],
               "y": [4, 2, 2, 2, 0], "type": "bar",
               "marker": {"color": ["#34a853", "#e8a838", "#f97316", "#ef4444", "#94a3b8"]},
               "text": ["4", "2", "2", "2", "0"], "textposition": "outside"}],
        title="Bucket Risiko via CASE (distribusi nasabah)",
        layout={"xaxis": {"title": "Bucket"}, "yaxis": {"title": "Jumlah"}, "showlegend": False},
        cara="Sumbu X = bucket hasil CASE WHEN atas dpd; tinggi = jumlah nasabah.",
        interpretasi="CASE mengubah angka mentah (dpd) menjadi bahasa bisnis (bucket). <strong>Perhatikan:</strong> bucket &ldquo;berat&rdquo; hanya 2 nasabah tapi menampung dpd 90 &amp; 120 — risiko terkonsentrasi. Inilah mengapa bucketing (bukan rata-rata dpd) dipakai di collection.")

    L.sec("lab1", "🔬 Lab 1: Berburu NULL")
    L.lab("Lab 1 — NULL Tidak Tertangkap WHERE Biasa",
        "Buktikan: Eko (penghasilan NULL) hilang dari <code className=\"inline\">&lt; 10000000</code> maupun <code className=\"inline\">&gt;= 10000000</code>. Temukan dia dengan IS NULL + perbaiki dengan COALESCE.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "1) COUNT(*) vs COUNT(penghasilan). 2) Tampilkan Eko via IS NULL. 3) Tampilkan semua dengan COALESCE(penghasilan,0).",
                "SELECT COUNT(*) AS semua, COUNT(penghasilan) AS ada_gaji FROM nasabah"),
        "Hitung: berapa % penghasilan NULL? Jika >5%, laporkan sebagai isu kualitas data (C15).")
    L.raw(sql_answer("Jawaban Lab 1",
        "-- 1) selisih = jumlah NULL\nSELECT COUNT(*) AS semua, COUNT(penghasilan) AS ada_gaji FROM nasabah;\n-- 2)\nSELECT nama FROM nasabah WHERE penghasilan IS NULL;\n-- 3)\nSELECT nama, COALESCE(penghasilan, 0) AS gaji_aman FROM nasabah;"))

    L.sec("lab2", "🔬 Lab 2: CASE Bucket DPD")
    L.lab("Lab 2 — Kategorisasi dengan CASE",
        "Buat kolom <code className=\"inline\">bucket</code>: 0→'lancar', 1–30→'ringan', 31–90→'sedang', else→'berat'. Tampilkan nama, dpd, bucket, urut dpd menurun.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT nama, dpd, CASE ... END AS bucket FROM nasabah ORDER BY dpd DESC",
                "SELECT nama, dpd FROM nasabah ORDER BY dpd DESC"),
        "Tambahkan ELSE 'tidak diketahui' untuk dpd NULL (jika ada). Urutan WHEN penting!")
    L.raw(sql_answer("Jawaban Lab 2",
        "SELECT nama, dpd,\n  CASE\n    WHEN dpd = 0 THEN 'lancar'\n    WHEN dpd BETWEEN 1 AND 30 THEN 'ringan'\n    WHEN dpd BETWEEN 31 AND 90 THEN 'sedang'\n    ELSE 'berat'\n  END AS bucket\nFROM nasabah\nORDER BY dpd DESC;"))

    L.sec("peta", "🗺️ Peta Keputusan: Menangani Nilai Spesial")
    L.decision("1", "Cek NULL → <strong>IS NULL / IS NOT NULL</strong>",
        "Kolom boleh kosong.",
        kenapa="= NULL selalu UNKNOWN — satu-satunya cara benar.",
        contoh="WHERE penghasilan IS NULL.")
    L.decision("2", "Hitung dengan NULL → <strong>COALESCE</strong>",
        "Aritmetika/agregasi tidak boleh merambat NULL.",
        kenapa="Ambil nilai non-NULL pertama; dokumentasikan imputasi.",
        contoh="COALESCE(penghasilan, 0).")
    L.decision("3", "Filter pola teks → <strong>LIKE</strong>",
        "Awalan/akhiran/mengandung.",
        kenapa="%, _ — tapi '%x%' tak pakai index.",
        contoh="WHERE nama LIKE 'A%'.")
    L.decision("4", "Daftar nilai → <strong>IN</strong> (awas NULL!)",
        "Beberapa nilai diskret.",
        kenapa="Rapi; tapi NOT IN + NULL = hasil kosong diam-diam.",
        contoh="WHERE kota IN ('Jakarta','Surabaya').")
    L.decision("5", "Kategorisasi → <strong>CASE</strong>",
        "Angka → label bisnis.",
        kenapa="Dievaluasi berurutan (IF-ELSE); fondasi conditional aggregation.",
        contoh="Bucket DPD di atas.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>NULL: <strong>IS NULL</strong>, bukan = NULL. WHERE hanya loloskan TRUE.</li>"
        "<li>Eksplorasi baru → <code className=\"inline\">COUNT(*)</code> vs <code className=\"inline\">COUNT(kolom)</code> dulu.</li>"
        "<li>NOT IN: pastikan tak ada NULL, atau pakai NOT EXISTS.</li>"
        "<li>CASE berurutan — WHEN pertama yang cocok menang.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Laporan yang Kehilangan Eko")
    L.raw(callout("<p>Manajemen menerima dua laporan: &ldquo;penghasilan &lt; 10jt: 6 nasabah&rdquo; dan &ldquo;penghasilan ≥ 10jt: 3 nasabah&rdquo;. Total 9 — padahal nasabah ada 10. Eko (NULL) hilang dari keduanya. Manajemen bertanya: <em>&ldquo;Kenapa totalnya tidak 10?&rdquo;</em></p>"
        "<p><strong>Pertanyaan:</strong> (a) Jelaskan penyebabnya dalam 2 kalimat. (b) Tulis query laporan yang benar (3 kategori: di bawah, di atas, belum diisi).</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) <strong>Penyebab:</strong> perbandingan dengan NULL menghasilkan UNKNOWN, dan WHERE menyaring UNKNOWN — Eko tidak lolos ke laporan manapun.</p>"
        "<p>(b) <code className=\"inline\">SELECT CASE WHEN penghasilan IS NULL THEN 'belum diisi' WHEN penghasilan &lt; 10000000 THEN '&lt;10jt' ELSE '≥10jt' END AS kategori, COUNT(*) FROM nasabah GROUP BY 1;</code> (GROUP BY = C3 — bocoran!). <strong>Pelajaran:</strong> setiap laporan dengan filter harus punya kategori &ldquo;tidak diketahui&rdquo; — atau datamu bocor diam-diam.</p>")))

    L.quiz("SELECT * FROM nasabah WHERE penghasilan = NULL menghasilkan…",
        ["Baris Eko", "Semua baris", "Kosong — harus IS NULL", "Error sintaks"],
        2, "Benar: = NULL → UNKNOWN → tersaring semua. Pakai IS NULL.")
    L.quiz("COUNT(*) vs COUNT(penghasilan) pada data ada 1 NULL…",
        ["Sama", "COUNT(*) lebih besar 1", "COUNT(penghasilan) lebih besar", "Keduanya error"],
        1, "Benar: COUNT(*) hitung baris, COUNT(kolom) lewatkan NULL. Selisihnya = jumlah NULL.")
    L.quiz("WHERE NOT (penghasilan > 10000000) untuk Eko (NULL)…",
        ["Lolos (TRUE)", "Tersaring (UNKNOWN)", "Error", "Jadi 0"],
        1, "Benar: NOT UNKNOWN = UNKNOWN → tersaring. &ldquo;Tidak (di atas)&rdquo; ≠ &ldquo;di bawah&rdquo; saat ada NULL.")
    L.quiz("x NOT IN (1, 2, NULL). Hasilnya…",
        ["Semua kecuali 1,2", "Kosong — NULL meracuni", "Hanya NULL", "Error"],
        1, "Benar: NOT IN + NULL = tidak ada yang lolos. Bug klasik diam-diam.")
    L.quiz("CASE WHEN dievaluasi…",
        ["Acak", "Berurutan — WHEN pertama yang cocok menang", "Dari bawah", "Paralel"],
        1, "Benar: seperti IF-ELSE. Urutan WHEN menentukan hasil untuk kondisi tumpang tindih.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>NULL = tidak tahu:</strong> perbandingan → UNKNOWN → tersaring WHERE. Pakai IS NULL.</li>"
        "<li><strong>Logika 3-nilai:</strong> TRUE/FALSE/UNKNOWN — NOT (x) ≠ kebalikan x saat ada NULL.</li>"
        "<li><strong>COALESCE</strong> untuk perhitungan aman; dokumentasikan imputasi.</li>"
        "<li><strong>LIKE</strong> (%, _), <strong>IN</strong> (awas NULL!), <strong>BETWEEN</strong> (inklusif).</li>"
        "<li><strong>CASE</strong> berurutan — lem super kategorisasi &amp; conditional aggregation.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C3
def c3():
    L = Lesson("c3-agregasi-groupby", "C3 — SQL",
        "GROUP BY: Dari Jutaan Baris<br/>ke Satu Insight",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c2-null-logika", "← C2"), ("c4-fungsi-tanggal-string", "Next: C4"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Memakai fungsi agregasi <strong>COUNT, SUM, AVG, MIN, MAX</strong> dengan benar (termasuk jebakan NULL).</li>"
        "<li>Mengelompokkan dengan <strong>GROUP BY</strong> dan menyaring grup dengan <strong>HAVING</strong>.</li>"
        "<li>Menulis <strong>conditional aggregation</strong> (COUNT/SUM + CASE) — pola #1 interview data analyst.</li>"
        "<li>Menjelaskan mengapa kolom non-agregat harus ada di GROUP BY.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Berapa NPL Kita?&rdquo; dalam 1 Query")
    L.raw('<div className="story"><p>Direksi bertanya saat rapat: <em>&ldquo;Berapa NPL (kredit macet) kita per kota?&rdquo;</em> Datamu: 2 juta baris kredit. Tanpa agregasi, kamu tidak bisa menjawab — tidak ada manusia membaca 2 juta baris.</p>'
        "<p>Dengan GROUP BY: <strong>1 query, 4 baris hasil</strong> — NPL per kota. Inilah agregasi: <em>meringkas jutaan baris menjadi insight</em>. Dan pola <strong>conditional aggregation</strong> (menghitung &ldquo;berapa yang memenuhi syarat X&rdquo; dalam satu query) adalah pola yang paling sering ditanyakan di interview data analyst 2026 — kuasai lesson ini = kuasai separuh interview SQL.</p></div>")

    L.sec("agregasi", "Fungsi Agregasi — Lima Serangkai")
    L.table(["Fungsi", "Arti", "Jebakan NULL"],
        [["COUNT(*)", "Hitung baris", "Termasuk NULL"],
         ["COUNT(kolom)", "Hitung non-NULL", "Melewatkan NULL!"],
         ["SUM(kolom)", "Jumlah", "Mengabaikan NULL"],
         ["AVG(kolom)", "Rata-rata", "Pembagi = non-NULL saja!"],
         ["MIN/MAX(kolom)", "Terkecil/terbesar", "Mengabaikan NULL"]])
    L.raw(codebox("SELECT COUNT(*) AS n_nasabah,\n       COUNT(penghasilan) AS n_ada_gaji,\n       AVG(penghasilan) AS rata_gaji,\n       MAX(dpd) AS dpd_terburuk\nFROM nasabah;", "sql"))
    L.p("Hasil: n_nasabah=10, n_ada_gaji=9 (Eko NULL!), rata_gaji dihitung dari 9 saja.")
    L.raw(myth("AVG = SUM / COUNT(*).",
        "Tidak! <code className=\"inline\">AVG(kolom)</code> = SUM / COUNT(kolom) — NULL tidak dihitung sebagai 0. Jika 1 dari 10 gaji NULL, AVG membagi 9, bukan 10. Untuk &ldquo;rata-rata dengan NULL sebagai 0&rdquo;, tulis eksplisit: <code className=\"inline\">SUM(COALESCE(gaji,0)) / COUNT(*)</code>. Beda definisi = beda angka = beda keputusan."))
    L.raw(tip("Tiga query audit agregasi yang wajib hafal: <code className=\"inline\">COUNT(*)</code> (berapa baris?), <code className=\"inline\">COUNT(DISTINCT id)</code> (berapa unik? — deteksi duplikat!), <code className=\"inline\">MIN/MAX(tanggal)</code> (rentang data?). Tiga ini menjawab &ldquo;data ini apa?&rdquo; dalam 10 detik."))

    L.sec("groupby", "GROUP BY — Meringkas per Kelompok")
    L.raw(codebox("SELECT kota,\n       COUNT(*) AS n,\n       AVG(penghasilan) AS rata_gaji,\n       MAX(dpd) AS max_dpd\nFROM nasabah\nGROUP BY kota;", "sql"))
    L.p("<strong>Cara kerja:</strong> baris dikelompokkan berdasar <code className=\"inline\">kota</code>, lalu agregasi dihitung <em>per grup</em>. Hasil: 4 baris (satu per kota).")
    L.p("<strong>Aturan keras:</strong> setiap kolom di SELECT harus <strong>agregat</strong> atau ada di <strong>GROUP BY</strong>. Ini bukan gaya — ini logika: satu grup punya banyak nama, jadi <code className=\"inline\">SELECT nama ... GROUP BY kota</code> tidak bermakna (nama yang mana?).")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: rata-rata dpd per status.</p>"
        "<p><strong>Langkah 1</strong> — grup: <code className=\"inline\">GROUP BY status</code> (lancar/telat/macet).</p>"
        "<p><strong>Langkah 2</strong> — agregat: <code className=\"inline\">SELECT status, AVG(dpd)</code>.</p>"
        "<p><strong>Langkah 3</strong> — gabung + urut: <code className=\"inline\">... ORDER BY 2 DESC</code> (2 = kolom kedua).</p>"
        "<p>Hasil: macet 105, telat 37,5, lancar 4. Satu query menjawab &ldquo;dpd tipikal per status&rdquo;.</p>"))
    L.raw(myth("GROUP BY mengurutkan hasil.",
        "Tidak dijamin! Di beberapa database hasilnya <em>terlihat</em> urut (efek samping implementasi) — tapi standar SQL tidak menjanjikan. Butuh urutan? <strong>Tambahkan ORDER BY eksplisit.</strong> Mengandalkan urutan implisit = bug yang menunggu waktu."))
    L.raw(tip("Grouping bertingkat: <code className=\"inline\">GROUP BY kota, status</code> = grup per kombinasi (Jakarta-lancar, Jakarta-telat, ...). Makin banyak kolom grup, makin rinci — tapi waspadai grup kecil (n=1) yang tidak bermakna statistik."))

    L.sec("having", "HAVING — WHERE-nya Grup")
    L.p("WHERE menyaring <strong>baris</strong> (sebelum grup). HAVING menyaring <strong>grup</strong> (sesudah agregasi):")
    L.raw(codebox("SELECT kota, COUNT(*) AS n\nFROM nasabah\nGROUP BY kota\nHAVING COUNT(*) >= 3;  -- hanya kota dengan >=3 nasabah", "sql"))
    L.p("<strong>Mengapa tidak WHERE COUNT(*) >= 3?</strong> Ingat urutan eksekusi (C1): WHERE jalan <em>sebelum</em> GROUP BY — agregat belum ada! Urutan lengkap:")
    L.p(T(r"\\text{FROM} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{SELECT} \\to \\text{ORDER BY}"))
    L.raw(tip("Refleks: &ldquo;saring baris&rdquo; → WHERE; &ldquo;saring grup/hasil agregat&rdquo; → HAVING. Contoh interview klasik: &ldquo;kota dengan rata-rata gaji &gt; 10jt&rdquo; → HAVING AVG(...) > 10000000."))

    L.sec("cond", "Conditional Aggregation — Pola #1 Interview ⭐")
    L.p("Menghitung agregat <strong>bersyarat dalam satu query</strong> — tanpa GROUP BY tambahan:")
    L.raw(codebox("SELECT COUNT(*) AS total,\n       COUNT(CASE WHEN dpd > 30 THEN 1 END) AS n_bermasalah,\n       COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*) AS pct_bermasalah,\n       SUM(CASE WHEN status = 'macet' THEN plafon ELSE 0 END) AS exposure_macet\nFROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;", "sql"))
    L.p("<strong>Cara kerja:</strong> <code className=\"inline\">CASE WHEN</code> menghasilkan 1 hanya untuk baris yang cocok (else NULL), lalu COUNT menghitung yang non-NULL. Satu scan tabel → banyak metrik!")
    L.p("<strong>Pola yang wajib dikuasai</strong> (keluar di hampir semua interview SQL):")
    L.raw(codebox("-- % per kategori (pivot manual)\nSELECT\n  SUM(CASE WHEN status = 'lancar' THEN 1 ELSE 0 END) AS lancar,\n  SUM(CASE WHEN status = 'telat' THEN 1 ELSE 0 END) AS telat,\n  SUM(CASE WHEN status = 'macet' THEN 1 ELSE 0 END) AS macet\nFROM nasabah;\n\n-- rata-rata bersyarat\nSELECT AVG(CASE WHEN kota = 'Jakarta' THEN penghasilan END) AS rata_jakarta\nFROM nasabah;", "sql"))
    L.raw(tip("Rumus NPL satu query: <code className=\"inline\">SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) / SUM(plafon)</code>. Hafalkan pola ini — ia menjawab &ldquo;berapa % ...&rdquo; untuk semua varian pertanyaan bisnis."))
    L.raw(myth("Untuk tiap metrik butuh query terpisah.",
        "Justru conditional aggregation menggabungkan puluhan metrik dalam SATU scan — jauh lebih cepat dan konsisten (satu definisi populasi!). Dashboard yang baik = sedikit query dengan banyak CASE, bukan banyak query."))

    L.chart(
        data=[{"x": ["Jakarta", "Bandung", "Surabaya", "Medan"],
               "y": [9250000, 10600000, 10200000, 8350000], "type": "bar",
               "marker": {"color": "#2a7de1"}, "text": ["9,25jt", "10,6jt", "10,2jt", "8,35jt"], "textposition": "outside"}],
        title="Rata-rata Penghasilan per Kota (GROUP BY)",
        layout={"xaxis": {"title": "Kota"}, "yaxis": {"title": "Rupiah"}, "showlegend": False},
        cara="Sumbu X = grup (kota), tinggi = AVG(penghasilan) per grup.",
        interpretasi="Agregasi mengubah 10 baris menjadi 4 insight. <strong>Tapi waspada:</strong> rata-rata Jakarta dari 4 nasabah (satu NULL!) — grup kecil = tidak stabil. Selalu tampilkan <strong>n per grup</strong> (COUNT(*)) di samping rata-rata.")

    L.chart(
        data=[{"x": ["lancar", "telat", "macet"], "y": [5, 2, 3], "type": "bar", "name": "COUNT(*)",
               "marker": {"color": "#94a3b8"}},
              {"x": ["lancar", "telat", "macet"], "y": [5, 2, 2], "type": "bar", "name": "COUNT(penghasilan)",
               "marker": {"color": "#2a7de1"}}],
        title="COUNT(*) vs COUNT(kolom): NULL Menghilang",
        layout={"barmode": "group", "yaxis": {"title": "Jumlah"}, "showlegend": True},
        cara="Abu-abu = COUNT(*) (semua baris); biru = COUNT(penghasilan) (non-NULL saja).",
        interpretasi="Status &ldquo;macet&rdquo;: COUNT(*) = 3 tapi COUNT(penghasilan) = 2 — <strong>satu NULL hilang diam-diam</strong>. Jika kamu hitung &ldquo;rata-rata gaji nasabah macet&rdquo; tanpa sadar, pembaginya 2 bukan 3. Visual ini = alasan audit NULL (C2) sebelum agregasi.")

    L.sec("lab1", "🔬 Lab 1: Agregasi per Kota")
    L.lab("Lab 1 — GROUP BY Langsung",
        "Hitung per kota: jumlah nasabah, rata-rata penghasilan, dpd maksimum. Urut dari rata-rata tertinggi.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT kota, COUNT(*), AVG(penghasilan), MAX(dpd) FROM nasabah GROUP BY kota ORDER BY 3 DESC",
                "SELECT kota, COUNT(*) AS n FROM nasabah GROUP BY kota"),
        "Tambahkan HAVING COUNT(*) >= 3. Kota mana yang hilang?")
    L.raw(sql_answer("Jawaban Lab 1",
        "SELECT kota,\n       COUNT(*) AS n,\n       AVG(penghasilan) AS rata_gaji,\n       MAX(dpd) AS max_dpd\nFROM nasabah\nGROUP BY kota\nORDER BY rata_gaji DESC;"))

    L.sec("lab2", "🔬 Lab 2: Conditional Aggregation — NPL")
    L.lab("Lab 2 — Satu Query, Banyak Metrik",
        "Dalam SATU query hitung: total nasabah, % dengan dpd > 30, dan rata-rata penghasilan khusus Jakarta. (Pola interview!)",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT COUNT(*), COUNT(CASE WHEN dpd>30 THEN 1 END)*1.0/COUNT(*), AVG(CASE WHEN kota='Jakarta' THEN penghasilan END) FROM nasabah",
                "SELECT COUNT(*) AS total FROM nasabah"),
        "Ubah jadi: % nasabah 'macet' + total plafon macet (butuh JOIN — intip C5, atau pakai tabel kredit di lab C5).")
    L.raw(sql_answer("Jawaban Lab 2",
        "SELECT COUNT(*) AS total,\n       COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*) AS pct_bermasalah,\n       AVG(CASE WHEN kota = 'Jakarta' THEN penghasilan END) AS rata_jakarta\nFROM nasabah;"))

    L.sec("peta", "🗺️ Peta Keputusan: Agregasi")
    L.decision("1", "Satu angka ringkas → <strong>agregasi tanpa GROUP BY</strong>",
        "Total/keseluruhan.",
        kenapa="COUNT/SUM/AVG atas seluruh tabel.",
        contoh="Total nasabah, total plafon.")
    L.decision("2", "Perbandingan antar kelompok → <strong>GROUP BY</strong>",
        "Per kota/status/kategori.",
        kenapa="Agregat per grup; kolom SELECT harus agregat atau di GROUP BY.",
        contoh="NPL per kota.")
    L.decision("3", "Saring grup (hasil agregat) → <strong>HAVING</strong>",
        "&ldquo;Kota dengan n ≥ ...&rdquo;, &ldquo;rata-rata di atas ...&rdquo;.",
        kenapa="WHERE tak bisa (jalan sebelum agregat).",
        contoh="HAVING COUNT(*) >= 100.")
    L.decision("4", "Banyak metrik bersyarat sekaligus → <strong>conditional aggregation</strong>",
        "&ldquo;Berapa % yang ...&rdquo; dalam satu query.",
        kenapa="Satu scan, konsisten, pola interview #1.",
        contoh="NPL ratio, % per bucket.")
    L.decision("5", "Curiga duplikat → <strong>COUNT(*) vs COUNT(DISTINCT id)</strong>",
        "Validasi sebelum agregat.",
        kenapa="Duplikat menggandakan SUM/COUNT diam-diam.",
        contoh="Cek duplikat id sebelum lapor total.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Kolom SELECT: <strong>agregat atau di GROUP BY</strong> — tidak ada pilihan ketiga.</li>"
        "<li>Saring baris → WHERE; saring grup → HAVING.</li>"
        "<li>&ldquo;Berapa % yang ...&rdquo; → COUNT(CASE WHEN ...).</li>"
        "<li>Selalu tampilkan <strong>n per grup</strong> + waspadai NULL di agregat.</li></ol>"))

    L.sec("case", "📋 Mini-Case: NPL Ratio per Kota untuk Direksi")
    L.raw(callout("<p>Definisi: NPL = kolektibilitas ≥ 3 (kurang lancar/diragukan/macet). Direksi minta NPL ratio (berdasar plafon) per kota + jumlah debitur, pagi ini.</p>"
        "<p><strong>Pertanyaan:</strong> tulis 1 query (JOIN nasabah–kredit). Apa yang harus dicek sebelum kirim?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">SELECT n.kota, COUNT(DISTINCT n.id) AS debitur, SUM(CASE WHEN k.kolektibilitas &gt;= 3 THEN k.plafon ELSE 0 END) / SUM(k.plafon) AS npl_ratio FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id GROUP BY n.kota;</code></p>"
        "<p><strong>Cek sebelum kirim:</strong> (1) duplikat nasabah (satu nasabah bisa 2 kredit — pakai COUNT DISTINCT!), (2) NULL di plafon/kolektibilitas, (3) definisi NPL disepakati (≥3?), (4) n per kota — kota dengan 2 debitur tidak bisa dibandingkan dengan 2.000. <strong>Pelajaran:</strong> query benar + validasi = laporan dipercaya; query benar tanpa validasi = bom waktu.</p>")))

    L.quiz("AVG(penghasilan) dengan 1 NULL dari 10 baris…",
        ["SUM/10", "SUM/9 (NULL tidak dihitung)", "Error", "SUM/10 dengan NULL=0"],
        1, "Benar: AVG = SUM/COUNT(kolom). Beda dengan SUM/COUNT(*) — definisikan yang kamu mau.")
    L.quiz("WHERE vs HAVING: yang benar…",
        ["Sama saja", "WHERE saring baris (sebelum agregat), HAVING saring grup (sesudah)", "HAVING lebih cepat", "WHERE bisa pakai agregat"],
        1, "Benar: urutan eksekusi — WHERE → GROUP BY → HAVING. Agregat tak ada saat WHERE jalan.")
    L.quiz("SELECT kota, nama FROM nasabah GROUP BY kota. Masalahnya…",
        ["Tidak ada", "nama bukan agregat & tidak di GROUP BY — tidak valid", "Harus pakai HAVING", "Kota harus di WHERE"],
        1, "Benar: satu grup punya banyak nama — query tidak bermakna. Aturan keras GROUP BY.")
    L.quiz("Pola conditional aggregation untuk &ldquo;% dpd > 30&rdquo;…",
        ["WHERE dpd > 30", "COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*)", "GROUP BY dpd", "HAVING dpd > 30"],
        1, "Benar: satu query, satu scan. Pola #1 interview SQL.")
    L.quiz("GROUP BY tanpa ORDER BY…",
        ["Selalu urut", "Urutan tidak dijamin — tambahkan ORDER BY eksplisit", "Error", "Otomatis DESC"],
        1, "Benar: jangan andalkan urutan implisit.")
    L.quiz("Satu nasabah punya 2 kredit. COUNT(nasabah) setelah JOIN…",
        ["Tetap benar", "Menggandakan — pakai COUNT(DISTINCT n.id)", "Error", "Menjadi NULL"],
        1, "Benar: fan-out JOIN menggandakan baris. COUNT DISTINCT atau agregasi di level yang benar.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Agregat:</strong> COUNT(*)/COUNT(kolom)/SUM/AVG/MIN/MAX — waspadai NULL.</li>"
        "<li><strong>GROUP BY:</strong> agregat per grup; kolom SELECT harus agregat atau di GROUP BY.</li>"
        "<li><strong>HAVING</strong> = WHERE untuk grup (setelah agregat).</li>"
        "<li><strong>Conditional aggregation</strong> (CASE dalam agregat) = pola #1 interview.</li>"
        "<li><strong>Jangan:</strong> andalkan urutan GROUP BY; lupakan cek duplikat &amp; NULL.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C4
def c4():
    L = Lesson("c4-fungsi-tanggal-string", "C4 — SQL",
        "Tanggal &amp; Teks: Fungsi yang<br/>Menyelamatkan Sehari-hari",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c3-agregasi-groupby", "← C3"), ("c5-join", "Next: C5"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Memanipulasi <strong>tanggal</strong>: ekstraksi, selisih, pembulatan ke bulan.</li>"
        "<li>Menulis filter tanggal yang <strong>sargable</strong> (bisa pakai index).</li>"
        "<li>Memanipulasi <strong>string</strong>: UPPER/LOWER, SUBSTR, ||, TRIM, REPLACE.</li>"
        "<li>Menghindari jebakan <strong>zona waktu</strong> dan format tanggal.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Laporan Bulanan yang Salah Sebulan")
    L.raw('<div className="story"><p>Analis menulis laporan &ldquo;transaksi September&rdquo;: <code className="inline">WHERE tanggal LIKE \'2026-09%\'</code>. Hasilnya benar... sampai database migrasi dan format tanggal berubah. Di database lain, ia menulis <code className="inline">WHERE MONTH(tanggal) = 9</code> — benar juga, tapi query 2 juta baris yang tadinya 2 detik jadi <strong>40 detik</strong> karena index tidak terpakai.</p>'
        "<p>Fungsi tanggal/string dipakai di <strong>setiap</strong> query analisis — dan cara pakainya menentukan benar/salah + cepat/lambat. Lesson ini: cara yang benar.</p></div>")

    L.sec("tanggal", "Fungsi Tanggal — Ekstrak, Selisih, Bulatkan")
    L.p("SQLite (lab) memakai fungsi sederhana; konsepnya sama di semua database:")
    L.raw(codebox("-- ekstraksi\nSELECT date(tanggal) AS tgl,\n       strftime('%Y-%m', tanggal) AS bulan,\n       strftime('%w', tanggal) AS hari_ke\nFROM transaksi;\n\n-- selisih hari\nSELECT julianday('2026-09-30') - julianday(tanggal) AS umur_hari\nFROM transaksi;\n\n-- transaksi 7 hari terakhir (relatif terhadap hari ini)\nSELECT * FROM transaksi\nWHERE tanggal >= date('now', '-7 days');", "sql"))
    L.ul([
        "<strong>Ekstraksi:</strong> tahun/bulan/hari untuk GROUP BY per bulan (laporan!).",
        "<strong>Selisih:</strong> umur transaksi, DPD dihitung dari tanggal jatuh tempo.",
        "<strong>Relatif:</strong> <code className=\"inline\">date('now', '-7 days')</code> — laporan &ldquo;7 hari terakhir&rdquo; tanpa hardcode tanggal.",
    ])
    L.raw(tip("Filter tanggal yang benar: <code className=\"inline\">WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'</code> — pola <strong>setengah-terbuka</strong> [awal, akhir). Menangani jam/menit/detik dengan benar, tidak seperti BETWEEN yang bisa kehilangan/kelebihan di batas."))

    L.sec("sargable", "Sargable — Tulis agar Index Terpakai")
    L.raw(codebox("-- LAMBAT: fungsi di kolom = index tidak terpakai (full scan)\nSELECT * FROM transaksi WHERE strftime('%Y-%m', tanggal) = '2026-09';\n\n-- CEPAT: kolom polos di satu sisi\nSELECT * FROM transaksi\nWHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01';", "sql"))
    L.p("<strong>Aturan:</strong> jangan bungkus kolom ter-index dengan fungsi di WHERE. Tulis ulang agar <strong>kolom polos</strong> dibandingkan dengan nilai. Ini satu-satunya optimasi yang perlu dihafal pemula — sisanya topik C17.")
    L.raw(myth("Fungsi di WHERE tidak masalah untuk data kecil.",
        "Benar untuk 10 baris lab — tapi kebiasaan ini terbawa ke tabel 100 juta baris dan bikin query timeout di produksi. Latih pola sargable dari sekarang; gratis untuk data kecil, menyelamatkan untuk data besar."))

    L.sec("string", "Fungsi String — Bersihkan &amp; Bentuk Teks")
    L.raw(codebox("SELECT UPPER(kota) AS kota_besar,          -- JAKARTA\n       LOWER(nama) AS nama_kecil,          -- andi\n       SUBSTR(nama, 1, 3) AS inisial,       -- And\n       nama || ' (' || kota || ')' AS label,-- Andi (Jakarta)\n       LENGTH(nama) AS pjg,\n       TRIM('  Andi  ') AS rapi\nFROM nasabah;", "sql"))
    L.ul([
        "<code className=\"inline\">||</code> = sambung string (concat). <strong>Awas:</strong> NULL || 'x' = NULL!",
        "<code className=\"inline\">SUBSTR(x, 1, 3)</code> = 3 karakter pertama (SQLite 1-based!).",
        "<code className=\"inline\">TRIM/LTRIM/RTRIM</code> = buang spasi — data kotor sering punya spasi liar.",
        "<code className=\"inline\">REPLACE(kota, 'Jakarta', 'JKT')</code> = ganti teks.",
    ])
    L.p("<strong>Kapan dipakai:</strong> standardisasi (UPPER untuk perbandingan case-insensitive), parsing kode (SUBSTR kode produk), label chart (||).")
    L.raw(tip("Perbandingan case-insensitive yang aman: <code className=\"inline\">WHERE UPPER(kota) = 'JAKARTA'</code> — tapi ingat sargable! Untuk kolom besar, lebih baik standardisasi <em>saat ingest</em> (C15/C16), bukan di setiap query."))

    L.sec("zona", "Zona Waktu &amp; Format — Jebakan Klasik")
    L.ul([
        "<strong>Simpan sebagai TIMESTAMP WITH TIME ZONE</strong> (atau UTC). Jangan simpan sebagai string 'DD/MM/YYYY' — tidak bisa diurut/di-filter benar.",
        "<strong>Jangan asumsikan zona:</strong> '2026-09-01 00:00' di Jakarta ≠ di server UTC. Konversi eksplisit saat tampil.",
        "<strong>Format tampil ≠ format simpan:</strong> simpan sebagai tipe date/timestamp, format (strftime/TO_CHAR) hanya saat SELECT untuk laporan.",
    ])
    L.raw(myth("Tanggal sebagai string 'YYYY-MM-DD' cukup aman.",
        "Untuk <em>sort/filter</em> memang urut alfabetis = urut kronologis — tapi kamu kehilangan validasi ('2026-13-99' lolos!), aritmetika tanggal, dan timezone. Pakai tipe DATE/TIMESTAMP; string hanya untuk tampil."))

    L.chart(
        data=[{"x": ["2026-09-01", "2026-09-05", "2026-09-10", "2026-09-15", "2026-09-20", "2026-09-25"],
               "y": [1750000, 575000, 2000000, 1200000, 1030000, 400000], "type": "bar",
               "marker": {"color": "#2a7de1"}, "text": ["1,75jt", "0,58jt", "2jt", "1,2jt", "1,03jt", "0,4jt"], "textposition": "outside"}],
        title="Total Transaksi per 5 Hari (GROUP BY tanggal)",
        layout={"xaxis": {"title": "Tanggal"}, "yaxis": {"title": "Rupiah"}, "showlegend": False},
        cara="Sumbu X = tanggal (hasil date(tanggal)), tinggi = SUM(jumlah).",
        interpretasi="Agregasi waktu = fondasi semua time-series (B14!). <strong>Perhatikan</strong> tanggal tanpa transaksi (02–04 Sep) tidak muncul — GROUP BY hanya menampilkan yang ada. Untuk chart kontinu, butuh <em>date spine</em> (C9/C16).")

    L.sec("lab1", "🔬 Lab 1: Transaksi September")
    L.lab("Lab 1 — Filter Tanggal Sargable",
        "Tampilkan transaksi September 2026 (id, tanggal, jumlah) dengan pola setengah-terbuka. Urut tanggal.",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "SELECT id, tanggal, jumlah FROM transaksi WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01' ORDER BY tanggal",
                "SELECT id, tanggal, jumlah FROM transaksi"),
        "Hitung total per hari: SELECT date(tanggal), SUM(jumlah) ... GROUP BY 1.")
    L.raw(sql_answer("Jawaban Lab 1",
        "SELECT id, tanggal, jumlah\nFROM transaksi\nWHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'\nORDER BY tanggal;"))

    L.sec("lab2", "🔬 Lab 2: Label Nasabah")
    L.lab("Lab 2 — String untuk Laporan",
        "Buat kolom <code className=\"inline\">label</code> = 'NAMA (KOTA)' huruf kapital, dan <code className=\"inline\">kode</code> = 3 huruf pertama nama + id.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT UPPER(nama || ' (' || kota || ')') AS label, SUBSTR(nama,1,3) || id AS kode FROM nasabah",
                "SELECT nama, kota FROM nasabah"),
        "Kenapa UPPER(nama || ...) bukan UPPER(nama) || ...? (Pikirkan NULL!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "SELECT UPPER(nama || ' (' || kota || ')') AS label,\n       SUBSTR(nama, 1, 3) || id AS kode\nFROM nasabah;"))

    L.sec("peta", "🗺️ Peta Keputusan: Fungsi")
    L.decision("1", "Filter tanggal → <strong>kolom polos + rentang [awal, akhir)</strong>",
        "Laporan periode.",
        kenapa="Sargable (index terpakai); BETWEEN berisiko di batas waktu.",
        contoh="WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'.")
    L.decision("2", "Kelompokkan per bulan → <strong>strftime/TO_CHAR di SELECT</strong>",
        "Tren bulanan.",
        kenapa="Fungsi di SELECT (bukan WHERE) = aman.",
        contoh="SELECT strftime('%Y-%m', tanggal) AS bulan, ... GROUP BY 1.")
    L.decision("3", "Umur/selisih → <strong>aritmetika tanggal</strong>",
        "DPD, umur transaksi.",
        kenapa="Jangan hitung manual — pakai fungsi date.",
        contoh="julianday(...) - julianday(...).")
    L.decision("4", "Standardisasi teks → <strong>UPPER/LOWER/TRIM</strong>",
        "Perbandingan case-insensitive, data kotor.",
        kenapa="Tapi standardisasi permanen sebaiknya saat ingest.",
        contoh="WHERE UPPER(kota) = 'JAKARTA'.")
    L.decision("5", "Bentuk label → <strong>|| dan SUBSTR</strong>",
        "Label chart/laporan.",
        kenapa="Awas NULL merambat di ||.",
        contoh="nama || ' (' || kota || ')'.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Tanggal: <strong>tipe DATE</strong>, filter <strong>setengah-terbuka</strong>, kolom polos di WHERE.</li>"
        "<li>Jangan bungkus kolom ter-index dengan fungsi di WHERE.</li>"
        "<li>String: || untuk gabung (awas NULL), SUBSTR 1-based di SQLite.</li>"
        "<li>Zona waktu: simpan UTC, konversi saat tampil.</li></ol>"))

    L.sec("case", "📋 Mini-Case: &ldquo;Kenapa Laporan September Beda?&rdquo;")
    L.raw(callout("<p>Dua analis melaporkan &ldquo;total transaksi September&rdquo;: Analis A (WHERE LIKE '2026-09%') = 8,2jt; Analis B (WHERE tanggal BETWEEN '2026-09-01' AND '2026-09-30') = 8,2jt; tapi dashboard (filter >= 09-01 AND < 10-01) = 8,6jt. Selisih 400rb — transaksi tanggal 2026-09-30 <strong>jam 15:00</strong>.</p>"
        "<p><strong>Pertanyaan:</strong> kenapa BETWEEN kehilangan transaksi itu? Tulis filter yang benar.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Penyebab:</strong> <code className=\"inline\">BETWEEN '2026-09-01' AND '2026-09-30'</code> = hingga '2026-09-30 00:00:00' — transaksi jam 15:00 di tanggal 30 <strong>lebih besar</strong> dari batas! LIKE lolos karena perbandingan string, tapi rapuh terhadap format.</p>"
        "<p><strong>Benar:</strong> <code className=\"inline\">WHERE tanggal &gt;= '2026-09-01' AND tanggal &lt; '2026-10-01'</code> — pola setengah-terbuka menangkap semua jam di tanggal 30. <strong>Pelajaran:</strong> BETWEEN untuk tanggal ber-jam = jebakan; setengah-terbuka selalu aman.</p>")))

    L.quiz("Filter &ldquo;September 2026&rdquo; yang benar untuk kolom timestamp…",
        ["WHERE tanggal LIKE '2026-09%'", "WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'", "WHERE MONTH(tanggal)=9", "WHERE tanggal BETWEEN '2026-09-01' AND '2026-09-30'"],
        1, "Benar: setengah-terbuka — menangkap semua jam di 30 Sep, sargable.")
    L.quiz("WHERE strftime('%Y-%m', tanggal) = '2026-09' pada tabel besar…",
        ["Cepat (pakai index)", "Lambat — fungsi di kolom mematikan index", "Error", "Sama saja"],
        1, "Benar: tidak sargable → full scan. Tulis ulang dengan kolom polos.")
    L.quiz("SELECT 'A' || NULL menghasilkan…",
        ["'A'", "NULL", "''", "Error"],
        1, "Benar: NULL merambat di ||. Bungkus dengan COALESCE jika perlu.")
    L.quiz("SUBSTR('Jakarta', 1, 3) di SQLite…",
        ["'aka'", "'Jak'", "'Jakar'", "Error"],
        1, "Benar: 1-based — 3 karakter pertama.")
    L.quiz("BETWEEN '2026-09-01' AND '2026-09-30' untuk timestamp…",
        ["Aman", "Kehilangan data 30 Sep setelah jam 00:00", "Melebihi ke Oktober", "Error"],
        1, "Benar: batas atas = 30 Sep 00:00:00. Pakai pola setengah-terbuka.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Tanggal:</strong> ekstrak (strftime), selisih (julianday), relatif (date('now')).</li>"
        "<li><strong>Filter:</strong> pola setengah-terbuka [awal, akhir) — sargable, aman di batas jam.</li>"
        "<li><strong>String:</strong> UPPER/LOWER, SUBSTR, ||, TRIM, REPLACE.</li>"
        "<li><strong>Jangan:</strong> fungsi di kolom ter-index (WHERE); tanggal sebagai string; abaikan timezone.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C5
def c5():
    L = Lesson("c5-join", "C5 — SQL",
        "JOIN: Menyambung Tabel<br/>tanpa Menggandakan Fakta",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c4-fungsi-tanggal-string", "← C4"), ("c6-subquery", "Next: C6"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Membedakan <strong>INNER, LEFT, RIGHT, FULL OUTER JOIN</strong> — dan kapan tiap dipakai.</li>"
        "<li>Menjelaskan <strong>fan-out</strong> (penggandaan baris) dan cara mencegahnya.</li>"
        "<li>Menulis JOIN dengan <strong>alias tabel</strong> yang rapi.</li>"
        "<li>Menghindari <strong>CROSS JOIN</strong> tak disengaja.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Total Plafon yang Tiba-tiba 2× Lipat")
    L.raw('<div className="story"><p>Analis menggabungkan <code className="inline">nasabah</code> dan <code className="inline">kredit</code> untuk menghitung total plafon per kota. Hasilnya: <strong>Rp 1,4 miliar</strong> — padahal kemarin Rp 800 juta. Tidak ada kredit baru. Apa yang terjadi?</p>'
        "<p>Budi punya <strong>2 kredit</strong>. JOIN menduplikasi baris Budi — dan kolom <code className=\"inline\">penghasilan</code>-nya ikut terganda. Setiap SUM/AVG setelah JOIN fan-out <strong>salah diam-diam</strong>. JOIN adalah operasi SQL paling kuat sekaligus paling berbahaya — lesson ini mengajarkan cara menjinakkannya.</p></div>")

    L.sec("inner", "INNER JOIN — Irisan")
    L.raw(codebox("SELECT n.nama, k.plafon, k.tenor\nFROM nasabah n\nINNER JOIN kredit k ON k.nasabah_id = n.id;", "sql"))
    L.ul([
        "Hanya baris yang <strong>cocok di kedua tabel</strong> (nasabah yang punya kredit).",
        "<code className=\"inline\">ON</code> = syarat pencocokan (biasanya PK = FK).",
        "Alias <code className=\"inline\">n</code>/<code className=\"inline\">k</code> = wajib untuk keterbacaan.",
    ])
    L.p("<strong>Kunci asing (FK):</strong> <code className=\"inline\">kredit.nasabah_id</code> menunjuk ke <code className=\"inline\">nasabah.id</code> (PK). JOIN menyambung lewat relasi ini.")
    L.raw(tip("Selalu tulis <code className=\"inline\">INNER JOIN</code> eksplisit (jangan cuma JOIN) dan kondisi ON — kejelasan mengalahkan keringkasan saat query dibaca 6 bulan kemudian."))

    L.sec("outer", "LEFT / RIGHT / FULL — Jangan Hilangkan Baris")
    L.raw(codebox("-- LEFT: semua nasabah, kredit jika ada (NULL jika tidak)\nSELECT n.nama, k.plafon\nFROM nasabah n\nLEFT JOIN kredit k ON k.nasabah_id = n.id;\n\n-- RIGHT: semua kredit (di SQLite: tukar posisi + LEFT)\n-- FULL OUTER: semua dari kedua sisi (SQLite: UNION dua LEFT)", "sql"))
    L.table(["Jenis", "Baris kiri", "Baris kanan", "Kapan"],
        [["INNER", "Hanya yang cocok", "Hanya yang cocok", "Default; kedua sisi wajib ada"],
         ["LEFT", "Semua", "Jika cocok (NULL jika tidak)", "Pertahankan kiri: semua nasabah + opsional kredit"],
         ["RIGHT", "Jika cocok", "Semua", "Jarang — tukar posisi, pakai LEFT"],
         ["FULL OUTER", "Semua", "Semua", "Rekonsiliasi: apa yang hilang di tiap sisi"]])
    L.p("<strong>Contoh nyata:</strong> &ldquo;semua nasabah + total transaksinya (0 jika tidak ada)&rdquo; → LEFT JOIN + <code className=\"inline\">COALESCE(SUM(...), 0)</code>. Dengan INNER, nasabah tanpa transaksi <strong>hilang</strong> — laporan &ldquo;nasabah tidak aktif&rdquo; mustahil dibuat!")
    L.raw(myth("LEFT JOIN dan INNER JOIN hasilnya sama kalau datanya bersih.",
        "Justru di data &ldquo;bersih&rdquo; pun beda: INNER membuang yang tidak cocok <em>diam-diam</em>. Aturan: tanyakan dulu &ldquo;bolehkah baris hilang?&rdquo; — jika tidak (laporan lengkap!), pakai LEFT. Pilihan JOIN adalah keputusan bisnis, bukan gaya."))

    L.sec("fanout", "Fan-out — Penggandaan yang Mematikan ⚠️")
    L.p("Satu nasabah → 2 kredit. JOIN menghasilkan <strong>2 baris Budi</strong>. Sekarang:")
    L.raw(codebox("-- SALAH: penghasilan Budi terhitung 2x!\nSELECT SUM(n.penghasilan) FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;\n\n-- BENAR: agregasi di level yang tepat\nSELECT SUM(penghasilan) FROM nasabah;  -- tanpa join, atau:\nSELECT n.kota, SUM(k.plafon)           -- plafon memang per kredit: OK\nFROM nasabah n JOIN kredit k ON k.nasabah_id = n.id\nGROUP BY n.kota;", "sql"))
    L.ul([
        "<strong>Aturan:</strong> agregat kolom dari tabel &ldquo;satu&rdquo; (nasabah) setelah join ke tabel &ldquo;banyak&rdquo; (kredit) = <strong>salah</strong> kecuali di-COUNT DISTINCT / di-pre-agregasi.",
        "<strong>Pola aman:</strong> agregasi <em>dulu</em> di level benar (subquery/CTE — C6/C7), <em>baru</em> join.",
        "<strong>Validasi:</strong> <code className=\"inline\">COUNT(*)</code> sebelum vs sesudah JOIN — jika membengkak, ada fan-out.",
    ])
    L.raw(tip("Refleks sebelum agregat setelah JOIN: &ldquo;apakah relasinya 1-ke-banyak?&rdquo; Jika ya → agregasi dulu di subquery, atau COUNT(DISTINCT id). Kebiasaan ini menyelamatkan setiap laporan keuangan."))
    L.raw(myth("Duplikat setelah JOIN bisa dibersihkan dengan DISTINCT.",
        "DISTINCT menyembunyikan gejala tapi <strong>merusak SUM</strong> (dua kredit Budi yang sah jadi satu!). Obati penyebab: agregasi di level granularitas yang benar, bukan tempel DISTINCT."))

    L.sec("cross", "CROSS JOIN &amp; Self-Join")
    L.raw(codebox("-- CROSS: semua pasangan (10 x 12 = 120 baris!) — jarang dipakai langsung\nSELECT n.nama, k.id FROM nasabah n CROSS JOIN kredit k;\n\n-- Self-join: bandingkan dalam tabel yang sama\nSELECT a.nama AS n1, b.nama AS n2, a.kota\nFROM nasabah a JOIN nasabah b\n  ON a.kota = b.kota AND a.id < b.id;  -- pasangan sekota", "sql"))
    L.p("<strong>Bahaya:</strong> lupa ON → CROSS JOIN tak disengaja → 10 × 12 = 120 baris (di produksi: jutaan × jutaan = <strong>query meledak</strong>). Selalu cek COUNT(*) setelah JOIN!")
    L.p("<strong>Self-join:</strong> tabel join dirinya sendiri (butuh 2 alias!) — untuk pasangan, hierarki (karyawan–manajer), perbandingan antar baris.")

    L.chart(
        data=[{"x": ["INNER", "LEFT (nasabah)", "FULL"], "y": [10, 10, 10], "type": "bar", "name": "Baris hasil",
               "marker": {"color": "#2a7de1"}},
              {"x": ["INNER", "LEFT (nasabah)", "FULL"], "y": [10, 12, 12], "type": "bar", "name": "Baris kredit tercakup",
               "marker": {"color": "#e8a838"}}],
        title="Jenis JOIN: Berapa Baris yang Dipertahankan?",
        layout={"barmode": "group", "yaxis": {"title": "Jumlah"}, "showlegend": True},
        cara="Bandingkan tinggi batang per jenis JOIN pada data lab (10 nasabah, 12 kredit).",
        interpretasi="LEFT mempertahankan semua 10 nasabah (2 tanpa kredit → NULL plafon) — INNER membuang mereka. <strong>Pilih JOIN = pilih siapa yang boleh hilang.</strong> Untuk laporan lengkap, LEFT adalah default yang aman.")

    L.sec("lab1", "🔬 Lab 1: INNER vs LEFT")
    L.lab("Lab 1 — Siapa yang Hilang?",
        "Bandingkan: INNER JOIN nasabah–kredit vs LEFT JOIN. Berapa baris tiap hasil? Nasabah mana yang hilang di INNER?",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS), ("kredit", KREDIT_DDL, KREDIT_ROWS)],
                "-- INNER dulu, lalu LEFT. Bandingkan jumlah baris.\nSELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id",
                "SELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id"),
        "Coba: nasabah tanpa kredit + COALESCE(k.plafon, 0).")
    L.raw(sql_answer("Jawaban Lab 1",
        "-- INNER: 12 baris (hanya yg punya kredit)\nSELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id;\n-- LEFT: 10 baris (semua nasabah; tanpa kredit -> NULL)\nSELECT n.nama, k.plafon FROM nasabah n LEFT JOIN kredit k ON k.nasabah_id = n.id;"))

    L.sec("lab2", "🔬 Lab 2: Menangkap Fan-out")
    L.lab("Lab 2 — Bukti Penggandaan",
        "Hitung SUM(penghasilan) dari nasabah saja vs setelah JOIN ke kredit. Jelaskan selisihnya!",
        lab_sql([("kredit", KREDIT_DDL, KREDIT_ROWS), ("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT SUM(n.penghasilan) FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id  -- vs tanpa join",
                "SELECT SUM(penghasilan) FROM nasabah"),
        "Perbaiki: hitung total plafon per kota dengan benar (plafon memang per kredit — kapan fan-out masalah vs tidak?).")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- tanpa join (benar):\nSELECT SUM(penghasilan) FROM nasabah;\n-- setelah join (salah: Budi & Eko terhitung 2x):\nSELECT SUM(n.penghasilan)\nFROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;\n-- plafon per kota (benar: plafon granularitas kredit):\nSELECT n.kota, SUM(k.plafon)\nFROM nasabah n JOIN kredit k ON k.nasabah_id = n.id\nGROUP BY n.kota;"))

    L.sec("peta", "🗺️ Peta Keputusan: JOIN")
    L.decision("1", "Kedua sisi wajib ada → <strong>INNER</strong>",
        "Default.",
        kenapa="Hanya yang cocok. Baris tak cocok hilang — pastikan itu yang kamu mau.",
        contoh="Nasabah yang punya kredit.")
    L.decision("2", "Pertahankan satu sisi → <strong>LEFT</strong>",
        "Laporan lengkap.",
        kenapa="Sisi kiri utuh; kanan NULL jika tak ada. Default aman untuk laporan.",
        contoh="Semua nasabah + transaksinya (0 jika tak ada).")
    L.decision("3", "Rekonsiliasi dua sisi → <strong>FULL OUTER</strong>",
        "&ldquo;Apa yang hilang di mana?&rdquo;.",
        kenapa="Semua baris kedua sisi; NULL menandai yang hilang.",
        contoh="Bandingkan data core vs data warehouse.")
    L.decision("4", "Agregat setelah JOIN → <strong>cek fan-out dulu</strong>",
        "Relasi 1-ke-banyak.",
        kenapa="Agregasi dulu di subquery, atau COUNT DISTINCT.",
        contoh="COUNT(*) sebelum vs sesudah JOIN.")
    L.decision("5", "Lupa ON → <strong>berhenti, cek COUNT(*)</strong>",
        "Hasil meledak.",
        kenapa="CROSS JOIN tak disengaja = jutaan² baris.",
        contoh="10 × 12 = 120 baris tak terduga.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Alias tabel selalu. ON selalu eksplisit.</li>"
        "<li>Tanya: &ldquo;bolehkah baris hilang?&rdquo; — tidak → LEFT.</li>"
        "<li>COUNT(*) sebelum vs sesudah JOIN — bengkak = fan-out.</li>"
        "<li>Agregat kolom tabel-&ldquo;satu&rdquo; setelah join ke-&ldquo;banyak&rdquo; = salah.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Total Plafon 2× Lipat")
    L.raw(callout("<p>Analis melaporkan total plafon Rp 1,4 M (harusnya ~Rp 800 jt). Query: <code className=\"inline\">SELECT SUM(n.plafon) ... FROM nasabah n JOIN kredit k ...</code> — eh, plafon ada di tabel kredit. Setelah diperiksa, analis menjumlah <code className=\"inline\">k.plafon</code> tapi <em>juga</em> menampilkan <code className=\"inline\">SUM(n.penghasilan)</code> sebagai &ldquo;total gaji debitur&rdquo; — angka gaji yang 2× lipat.</p>"
        "<p><strong>Pertanyaan:</strong> (a) kenapa gaji 2×? (b) tulis query &ldquo;total gaji unik debitur per kota&rdquo; yang benar.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) Budi &amp; Eko punya 2 kredit → barisnya ganda → penghasilan ikut terjumlah 2×. Plafon benar karena granularitasnya memang per kredit.</p>"
        "<p>(b) <code className=\"inline\">SELECT n.kota, SUM(n.penghasilan) FROM (SELECT DISTINCT id, kota, penghasilan FROM nasabah WHERE id IN (SELECT nasabah_id FROM kredit)) n GROUP BY n.kota;</code> — dedup <em>dulu</em>, agregat <em>kemudian</em>. Atau agregasi per nasabah di CTE (C7). <strong>Pelajaran:</strong> agregat mengikuti granularitas baris — bukan keinginanmu.</p>")))

    L.quiz("Nasabah tanpa kredit pada INNER JOIN nasabah–kredit…",
        ["Tetap muncul (NULL)", "Hilang", "Error", "Muncul 2x"],
        1, "Benar: INNER hanya yang cocok. Butuh mereka? Pakai LEFT.")
    L.quiz("&ldquo;Semua nasabah + total transaksinya&rdquo; butuh…",
        ["INNER JOIN", "LEFT JOIN + COALESCE", "CROSS JOIN", "FULL JOIN"],
        1, "Benar: LEFT pertahankan nasabah; COALESCE ubah NULL jadi 0.")
    L.quiz("Fan-out: Budi punya 2 kredit. SUM(n.penghasilan) setelah JOIN…",
        ["Benar", "Terhitung 2× — salah", "NULL", "Error"],
        1, "Benar: baris ganda → agregat kolom tabel-satu salah.")
    L.quiz("Cara aman agregat setelah JOIN 1-ke-banyak…",
        ["DISTINCT", "Agregasi dulu di subquery/CTE, atau COUNT DISTINCT", "ORDER BY", "LIMIT"],
        1, "Benar: perbaiki granularitas dulu. DISTINCT menutupi gejala & merusak SUM yang sah.")
    L.quiz("Lupa ON pada JOIN 10 × 12 baris…",
        ["10 baris", "22 baris", "120 baris (CROSS)", "Error"],
        2, "Benar: CROSS JOIN = perkalian. Di produksi bisa jutaan² — selalu cek COUNT(*).")
    L.quiz("Self-join butuh…",
        ["Tidak bisa dilakukan", "Dua alias berbeda untuk tabel yang sama", "UNION", "Subquery saja"],
        1, "Benar: a dan b — tanpa alias, database tak tahu mana yang mana.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>INNER</strong> = irisan; <strong>LEFT</strong> = pertahankan kiri; <strong>FULL</strong> = rekonsiliasi.</li>"
        "<li>Pilih JOIN = pilih <strong>siapa boleh hilang</strong> — keputusan bisnis.</li>"
        "<li><strong>Fan-out:</strong> 1-ke-banyak menggandakan baris → agregat tabel-satu salah.</li>"
        "<li><strong>Pola aman:</strong> agregasi dulu (subquery/CTE), baru join; COUNT(*) sebelum vs sesudah.</li>"
        "<li><strong>Jangan:</strong> lupa ON; DISTINCT untuk menutupi fan-out.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C6
def c6():
    L = Lesson("c6-subquery", "C6 — SQL",
        "Subquery: Query di Dalam<br/>Query",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c5-join", "← C5"), ("c7-cte", "Next: C7"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menulis subquery di <strong>WHERE</strong> (IN, EXISTS, perbandingan skalar).</li>"
        "<li>Memakai subquery di <strong>FROM</strong> (derived table) untuk agregasi-then-join.</li>"
        "<li>Membedakan <strong>EXISTS vs IN</strong> (dan jebakan NULL di NOT IN).</li>"
        "<li>Menjelaskan <strong>correlated subquery</strong> dan kapan menghindarinya.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Nasabah di Atas Rata-rata&rdquo;")
    L.raw('<div className="story"><p>Manajer: <em>&ldquo;Siapa nasabah dengan penghasilan di atas rata-rata?&rdquo;</em> Kamu butuh dua langkah: (1) hitung rata-rata, (2) bandingkan tiap nasabah. Tanpa subquery: jalankan query 1, catat angkanya, tulis query 2 manual — tidak reusable, tidak otomatis.</p>'
        "<p>Subquery menggabungkan keduanya dalam <strong>satu query</strong>: <em>&ldquo;rata-rata&rdquo; dihitung fresh setiap query dijalankan</em>. Ini fondasi pola &ldquo;agregasi dulu, baru join&rdquo; (obat fan-out C5!) dan &ldquo;filter berdasar hasil query lain&rdquo;.</p></div>")

    L.sec("skalar", "Subquery Skalar &amp; IN — di WHERE")
    L.raw(codebox("-- skalar: satu nilai\nSELECT nama, penghasilan\nFROM nasabah\nWHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah);\n\n-- IN: daftar nilai dari query lain\nSELECT nama FROM nasabah\nWHERE id IN (SELECT nasabah_id FROM kredit WHERE kolektibilitas >= 3);", "sql"))
    L.ul([
        "<strong>Skalar</strong> (satu baris, satu kolom): bisa dibandingkan dengan =, >, <.",
        "<strong>IN</strong>: keanggotaan dalam himpunan hasil subquery.",
        "<strong>Aturan:</strong> subquery skalar harus mengembalikan tepat 1 baris — jika lebih, error!",
    ])
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: nasabah yang <em>tidak punya</em> kredit macet.</p>"
        "<p><strong>Langkah 1</strong> — siapa yang macet: <code className=\"inline\">SELECT nasabah_id FROM kredit WHERE kolektibilitas = 5</code>.</p>"
        "<p><strong>Langkah 2</strong> — negasikan: <code className=\"inline\">SELECT nama FROM nasabah WHERE id NOT IN ( ... )</code>.</p>"
        "<p><strong>Langkah 3</strong> — cek NULL di daftar! (lihat jebakan di bawah).</p>"))
    L.raw(myth("NOT IN selalu benar untuk &ldquo;tidak ada&rdquo;.",
        "Jika subquery mengandung NULL, <code className=\"inline\">NOT IN</code> mengembalikan <strong>kosong</strong> — diam-diam! (C2). Untuk &ldquo;tidak ada&rdquo;, <strong>NOT EXISTS</strong> selalu aman karena tidak terpengaruh NULL. Jadikan NOT EXISTS default untuk anti-join."))
    L.raw(tip("IN vs EXISTS untuk &ldquo;ada&rdquo;: hasil sama jika tak ada NULL; EXISTS berhenti di kecocokan pertama (sering lebih cepat) dan aman dari NULL. <code className=\"inline\">WHERE EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id)</code>."))

    L.sec("derived", "Derived Table — Subquery di FROM")
    L.p("Obat fan-out (C5): agregasi <em>dulu</em> per nasabah, <em>baru</em> join:")
    L.raw(codebox("SELECT n.nama, t.total_trx, t.n_trx\nFROM nasabah n\nJOIN (\n  SELECT nasabah_id,\n         SUM(jumlah) AS total_trx,\n         COUNT(*) AS n_trx\n  FROM transaksi\n  GROUP BY nasabah_id\n) t ON t.nasabah_id = n.id;", "sql"))
    L.ul([
        "Subquery di FROM <strong>wajib punya alias</strong> (<code className=\"inline\">t</code>).",
        "Granularitas <code className=\"inline\">t</code> = 1 baris per nasabah → JOIN aman, tidak fan-out.",
        "Pola ini = &ldquo;agregasi dulu, join kemudian&rdquo; — hafalkan!",
    ])
    L.raw(tip("Kapan derived table? Setiap kali kamu tergoda agregat <em>setelah</em> JOIN 1-ke-banyak. Tulis agregatnya sebagai subquery di FROM dulu — query jadi lebih panjang tapi <strong>benar</strong>. Benar > pendek."))

    L.sec("correlated", "Correlated Subquery — Query yang &ldquo;Melihat Keluar&rdquo;")
    L.raw(codebox("-- untuk TIAP nasabah, hitung transaksinya: subquery merujuk n.id dari luar!\nSELECT n.nama,\n  (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) AS n_trx\nFROM nasabah n;", "sql"))
    L.p("Subquery <strong>berkorelasi</strong>: dieksekusi sekali <em>per baris luar</em> (10 nasabah = 10 eksekusi). Untuk data kecil OK; untuk jutaan baris = <strong>lambat</strong> (N+1 problem-nya SQL).")
    L.p("<strong>Solusi:</strong> tulis ulang sebagai JOIN + GROUP BY (derived table di atas) — satu scan, bukan N scan.")
    L.raw(myth("Correlated subquery selalu buruk.",
        "Tidak — untuk <em>top-N per grup</em> atau <em>exists-check</em>, correlated subquery/EXISTS justru idiomatis dan sering dioptimasi baik oleh planner. Buruk hanya jika dipakai sebagai pengganti agregasi massal. Ukur dengan EXPLAIN (C17), jangan menghakimi buta."))

    L.chart(
        data=[{"x": ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gilang", "Hesti", "Irfan", "Joko"],
               "y": [1950000, 3400000, 575000, 300000, 150000, 80000, 950000, 600000, 200000, 350000],
               "type": "bar", "marker": {"color": "#2a7de1"},
               "text": ["1,95jt", "3,4jt", "0,58jt", "0,3jt", "0,15jt", "0,08jt", "0,95jt", "0,6jt", "0,2jt", "0,35jt"], "textposition": "outside"}],
        title="Total Transaksi per Nasabah (derived table: agregat dulu, baru tampil)",
        layout={"xaxis": {"title": "Nasabah"}, "yaxis": {"title": "Rupiah"}, "showlegend": False},
        cara="Tinggi = SUM(jumlah) per nasabah — dihitung di subquery, baru digabung.",
        interpretasi="Budi tertinggi (3,4jt) — tapi ingat: ini <em>total</em>, bukan <em>rata-rata</em>. Selalu tanyakan &ldquo;total atau rata-rata?&rdquo; sebelum menyimpulkan &ldquo;terbaik&rdquo;. (Rata-rata per transaksi = pola HAVING/conditional aggregation.)")

    L.sec("lab1", "🔬 Lab 1: Di Atas Rata-rata")
    L.lab("Lab 1 — Subquery Skalar",
        "Tampilkan nama &amp; penghasilan nasabah yang penghasilannya di atas rata-rata. Lalu: yang dpd-nya di atas rata-rata dpd.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT nama, penghasilan FROM nasabah WHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah)",
                "SELECT AVG(penghasilan) FROM nasabah"),
        "Bandingkan: apa bedanya dengan WHERE penghasilan > 9500000 (angka hardcode)?")
    L.raw(sql_answer("Jawaban Lab 1",
        "SELECT nama, penghasilan\nFROM nasabah\nWHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah);"))

    L.sec("lab2", "🔬 Lab 2: Agregat Dulu, Join Kemudian")
    L.lab("Lab 2 — Derived Table Anti Fan-out",
        "Tampilkan semua nasabah + total transaksinya (0 jika tidak ada). Pakai derived table + LEFT JOIN + COALESCE.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS), ("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "SELECT n.nama, COALESCE(t.total,0) FROM nasabah n LEFT JOIN (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id) t ON t.nasabah_id=n.id",
                "SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id"),
        "Nasabah tanpa transaksi muncul dengan total berapa? Kenapa COALESCE penting?")
    L.raw(sql_answer("Jawaban Lab 2",
        "SELECT n.nama, COALESCE(t.total, 0) AS total_trx\nFROM nasabah n\nLEFT JOIN (\n  SELECT nasabah_id, SUM(jumlah) AS total\n  FROM transaksi\n  GROUP BY nasabah_id\n) t ON t.nasabah_id = n.id;"))

    L.sec("peta", "🗺️ Peta Keputusan: Subquery")
    L.decision("1", "Banding dengan hasil hitungan → <strong>subquery skalar</strong>",
        "&ldquo;Di atas rata-rata&rdquo;.",
        kenapa="Satu nilai; dihitung fresh tiap eksekusi.",
        contoh="WHERE penghasilan > (SELECT AVG(...)).")
    L.decision("2", "Keanggotaan → <strong>IN / EXISTS</strong>",
        "&ldquo;Yang punya ...&rdquo;.",
        kenapa="EXISTS aman NULL & berhenti cepat; IN rapi untuk daftar kecil.",
        contoh="WHERE id IN (SELECT ...).")
    L.decision("3", "&ldquo;Tidak ada&rdquo; → <strong>NOT EXISTS</strong> (bukan NOT IN!)",
        "Anti-join.",
        kenapa="NOT IN + NULL = kosong diam-diam.",
        contoh="Nasabah tanpa kredit macet.")
    L.decision("4", "Agregat lalu join → <strong>derived table</strong>",
        "Obat fan-out.",
        kenapa="Granularitas 1 baris per kunci → JOIN aman. Wajib alias.",
        contoh="Total transaksi per nasabah, baru JOIN.")
    L.decision("5", "Correlated untuk agregat massal → <strong>tulis ulang JOIN+GROUP BY</strong>",
        "N+1 problem.",
        kenapa="Sekali per baris = lambat di data besar.",
        contoh="COUNT per nasabah via derived table.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Skalar = 1 baris 1 kolom, atau error.</li>"
        "<li>&ldquo;Tidak ada&rdquo; → NOT EXISTS (default aman).</li>"
        "<li>Derived table wajib alias; agregat dulu, join kemudian.</li>"
        "<li>Correlated = per baris — waspadai di data besar.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Nasabah Aktif Tapi Tak Punya Kredit")
    L.raw(callout("<p>Marketing mau kampanye: nasabah dengan <strong>total transaksi &gt; 1 juta</strong> tapi <strong>belum punya kredit</strong> — prospek cross-sell.</p>"
        "<p><strong>Pertanyaan:</strong> tulis 1 query. (Petunjuk: derived table + NOT EXISTS.)</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">SELECT n.nama, t.total FROM nasabah n JOIN (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id HAVING SUM(jumlah) &gt; 1000000) t ON t.nasabah_id = n.id WHERE NOT EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id);</code></p>"
        "<p>Tiga teknik satu query: derived table (agregat), HAVING (saring grup), NOT EXISTS (anti-join). <strong>Pelajaran:</strong> query kompleks = komposisi pola sederhana. Kuasai pola, rangkai sesukamu.</p>")))

    L.quiz("Subquery skalar mengembalikan 5 baris. Akibatnya…",
        ["Dipakai baris pertama", "Error", "Dikalikan 5", "NULL"],
        1, "Benar: skalar harus tepat 1 baris 1 kolom.")
    L.quiz("NOT IN vs NOT EXISTS saat subquery mengandung NULL…",
        ["Sama", "NOT IN kosong diam-diam; NOT EXISTS aman", "NOT EXISTS error", "Keduanya kosong"],
        1, "Benar: NOT EXISTS default aman untuk anti-join.")
    L.quiz("Derived table wajib…",
        ["ORDER BY", "Alias", "LIMIT", "DISTINCT"],
        1, "Benar: subquery di FROM harus punya nama alias.")
    L.quiz("Obat fan-out (agregat setelah JOIN 1-ke-banyak)…",
        ["DISTINCT", "Agregasi dulu di derived table, baru JOIN", "GROUP BY lebih banyak", "UNION"],
        1, "Benar: perbaiki granularitas sebelum join.")
    L.quiz("Correlated subquery di SELECT untuk 10 juta baris…",
        ["Ideal", "Berisiko lambat (sekali per baris) — tulis ulang JOIN+GROUP BY", "Error", "Selalu dioptimasi sempurna"],
        1, "Benar: N+1 problem. Kecuali pola EXISTS/top-N yang idiomatis.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Skalar/IN:</strong> banding &amp; keanggotaan di WHERE.</li>"
        "<li><strong>NOT EXISTS</strong> (bukan NOT IN) untuk &ldquo;tidak ada&rdquo; — aman NULL.</li>"
        "<li><strong>Derived table:</strong> agregat dulu (wajib alias), baru join — obat fan-out.</li>"
        "<li><strong>Correlated:</strong> kuat tapi per-baris — waspadai di data besar.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C7
def c7():
    L = Lesson("c7-cte", "C7 — SQL",
        "CTE: Beri Nama pada<br/>Langkah Berpikirmu",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c6-subquery", "← C6"), ("c8-union-set", "Next: C8"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menulis <strong>WITH ... AS</strong> (CTE) sebagai pengganti subquery bersarang.</li>"
        "<li>Merangkai <strong>multi-step analysis</strong> yang terbaca.</li>"
        "<li>Menjelaskan kapan CTE vs subquery vs temp table.</li>"
        "<li>Menulis <strong>recursive CTE</strong> sederhana.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Query 40 Baris yang Tak Bisa Dibaca")
    L.raw('<div className="story"><p>Kamu mewarisi query 40 baris: subquery di dalam subquery di dalam subquery — seperti boneka Rusia. Ada bug di tengahnya. Kamu butuh <strong>2 jam</strong> hanya untuk paham alurnya.</p>'
        "<p>CTE (Common Table Expression) memecahnya menjadi <strong>langkah bernama yang berurutan</strong>: <em>langkah 1: hitung total per nasabah; langkah 2: tandai yang aktif; langkah 3: gabung dengan kredit</em>. Query yang sama, terbaca dalam <strong>5 menit</strong>. Di tim data, keterbacaan = maintainability = uang.</p></div>")

    L.sec("dasar", "WITH — Struktur Dasar")
    L.raw(codebox("WITH total_trx AS (\n  SELECT nasabah_id, SUM(jumlah) AS total\n  FROM transaksi\n  GROUP BY nasabah_id\n),\naktif AS (\n  SELECT nasabah_id FROM total_trx WHERE total > 1000000\n)\nSELECT n.nama\nFROM nasabah n\nJOIN aktif a ON a.nasabah_id = n.id;", "sql"))
    L.ul([
        "<code className=\"inline\">WITH nama AS (query)</code> — definisikan &ldquo;tabel sementara bernama&rdquo;.",
        "Bisa banyak CTE, dipisah koma — <strong>berurutan &amp; bisa saling merujuk</strong>.",
        "Query utama di akhir memakai semuanya — alur baca <strong>atas ke bawah</strong>.",
    ])
    L.raw(tip("Aturan penamaan CTE: pakai kata kerja/benda yang menjelaskan <em>isi</em> (<code className=\"inline\">total_trx</code>, <code className=\"inline\">nasabah_aktif</code>), bukan <code className=\"inline\">cte1</code>/<code className=\"inline\">temp</code>. Nama baik = dokumentasi gratis."))

    L.sec("multistep", "Multi-Step Analysis — Kekuatan Sebenarnya")
    L.p("Contoh: NPL ratio per kota (mini-case C3) ditulis ulang dengan CTE — tiap langkah bernama:")
    L.raw(codebox("WITH kredit_kota AS (\n  SELECT n.kota, k.plafon, k.kolektibilitas\n  FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id\n),\nringkas AS (\n  SELECT kota,\n         SUM(plafon) AS total_plafon,\n         SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) AS plafon_npl\n  FROM kredit_kota\n  GROUP BY kota\n)\nSELECT kota,\n       plafon_npl * 1.0 / total_plafon AS npl_ratio\nFROM ringkas\nORDER BY npl_ratio DESC;", "sql"))
    L.p("<strong>Mengapa lebih baik dari subquery bersarang?</strong> (1) tiap langkah bisa di-debug terpisah (SELECT * FROM ringkas), (2) CTE bisa dipakai <strong>berulang</strong> di query utama, (3) alur logis jelas.")
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: kota dengan rata-rata total transaksi per nasabah tertinggi.</p>"
        "<p><strong>Langkah 1</strong> — total per nasabah: <code className=\"inline\">WITH t AS (SELECT nasabah_id, SUM(jumlah) s FROM transaksi GROUP BY 1)</code>.</p>"
        "<p><strong>Langkah 2</strong> — gabung kota + rata-rata per kota: <code className=\"inline\">, k AS (SELECT n.kota, AVG(t.s) r FROM nasabah n JOIN t ON ... GROUP BY 1)</code>.</p>"
        "<p><strong>Langkah 3</strong> — <code className=\"inline\">SELECT * FROM k ORDER BY r DESC LIMIT 1</code>.</p>"))
    L.raw(myth("CTE selalu lebih lambat dari subquery.",
        "Di database modern, CTE biasanya di-inline seperti subquery (sama cepatnya). Pengecualian: PostgreSQL lama mematerialisasi CTE (dihitung sekali, disimpan) — kadang justru <em>lebih cepat</em> jika CTE dipakai berulang. Jangan anti-CTE karena mitos performa; ukur dengan EXPLAIN."))
    L.raw(myth("CTE bisa dipakai untuk UPDATE/DELETE.",
        "Di kebanyakan database, CTE hanya untuk SELECT (read-only)! Untuk ubah data pakai statement DML biasa atau temp table. Pengecualian: PostgreSQL mendukung <code className=\"inline\">data-modifying CTE</code> (WITH ... INSERT/UPDATE) — tapi itu fitur khusus, bukan standar."))

    L.sec("cte-vs", "CTE vs Subquery vs Temp Table")
    L.table(["", "CTE", "Subquery", "Temp Table"],
        [["Keterbacaan", "Tinggi (bernama, berurutan)", "Rendah jika bersarang", "Tinggi"],
         ["Pakai ulang", "Berkali-kali dalam 1 query", "Harus ditulis ulang", "Antar query/sesi"],
         ["Umur", "Satu query", "Satu query", "Sesi/transaksi"],
         ["Kapan", "Analisis multi-langkah", "Satu langkah kecil", "Data besar dipakai berulang"]])
    L.raw(tip("Pedoman: 1 langkah → subquery inline; 2+ langkah atau dipakai 2× → CTE; dipakai di banyak query / data besar → temp table (C16)."))

    L.sec("rekursif", "Recursive CTE — Untuk Hierarki &amp; Deret")
    L.raw(codebox("-- deret tanggal 7 hari (date spine mini!)\nWITH RECURSIVE d(tgl) AS (\n  SELECT date('2026-09-01')\n  UNION ALL\n  SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07'\n)\nSELECT * FROM d;", "sql"))
    L.ul([
        "<strong>Anchor</strong> (SELECT pertama) + <strong>rekursi</strong> (UNION ALL + kondisi berhenti).",
        "<strong>Kapan:</strong> hierarki (karyawan–manajer–direktur), deret tanggal (date spine!), BOM.",
        "<strong>Wajib:</strong> kondisi berhenti — tanpa itu rekursi tak berujung!",
    ])
    L.raw(tip("Date spine via recursive CTE = obat chart berlubang (C4): LEFT JOIN-kan data ke deret tanggal lengkap agar hari tanpa transaksi tetap muncul (dengan 0)."))

    L.chart(
        data=[{"x": ["Subquery bersarang", "CTE"], "y": [120, 5], "type": "bar",
               "marker": {"color": ["#ef4444", "#34a853"]},
               "text": ["120 mnt", "5 mnt"], "textposition": "outside"}],
        title="Waktu Memahami Query 40 Baris (ilustrasi)",
        layout={"yaxis": {"title": "Menit"}, "showlegend": False},
        cara="Perbandingan ilustratif waktu yang dibutuhkan analis baru memahami query yang sama.",
        interpretasi="Angka ilustratif — tapi intinya nyata: <strong>keterbacaan = biaya maintenance</strong>. Query ditulis sekali, dibaca puluhan kali. CTE membayar dirinya sendiri.")

    L.sec("lab1", "🔬 Lab 1: Subquery → CTE")
    L.lab("Lab 1 — Tulis Ulang dengan CTE",
        "Tulis ulang query lab C6-lab2 (nasabah + total transaksi) memakai CTE bernama <code className=\"inline\">total_trx</code>.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS), ("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "WITH total_trx AS (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id) SELECT n.nama, COALESCE(t.total,0) FROM nasabah n LEFT JOIN total_trx t ON t.nasabah_id=n.id",
                "SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id"),
        "Debug: SELECT * FROM total_trx; — CTE bisa diinspeksi per langkah!")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH total_trx AS (\n  SELECT nasabah_id, SUM(jumlah) AS total\n  FROM transaksi\n  GROUP BY nasabah_id\n)\nSELECT n.nama, COALESCE(t.total, 0) AS total_trx\nFROM nasabah n\nLEFT JOIN total_trx t ON t.nasabah_id = n.id;"))

    L.sec("lab2", "🔬 Lab 2: Recursive CTE")
    L.lab("Lab 2 — Deret Tanggal",
        "Buat deret 2026-09-01 s.d. 2026-09-07 dengan recursive CTE, lalu LEFT JOIN-kan jumlah transaksi per tanggal (date spine!).",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "WITH RECURSIVE d(tgl) AS (SELECT date('2026-09-01') UNION ALL SELECT date(tgl,'+1 day') FROM d WHERE tgl<'2026-09-07') SELECT d.tgl, COALESCE(SUM(t.jumlah),0) FROM d LEFT JOIN transaksi t ON t.tanggal=d.tgl GROUP BY d.tgl",
                "WITH RECURSIVE d(tgl) AS (SELECT date('2026-09-01') UNION ALL SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07') SELECT * FROM d"),
        "Hari tanpa transaksi sekarang muncul dengan 0 — chart jadi kontinu!")
    L.raw(sql_answer("Jawaban Lab 2",
        "WITH RECURSIVE d(tgl) AS (\n  SELECT date('2026-09-01')\n  UNION ALL\n  SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07'\n)\nSELECT d.tgl, COALESCE(SUM(t.jumlah), 0) AS total\nFROM d LEFT JOIN transaksi t ON t.tanggal = d.tgl\nGROUP BY d.tgl;"))

    L.sec("peta", "🗺️ Peta Keputusan: Struktur Query")
    L.decision("1", "Satu langkah kecil → <strong>subquery inline</strong>",
        "Sederhana.",
        kenapa="Tidak perlu CTE untuk 1 langkah.",
        contoh="WHERE x > (SELECT AVG(x) ...).")
    L.decision("2", "2+ langkah / dipakai 2× → <strong>CTE</strong>",
        "Multi-step.",
        kenapa="Bernama, berurutan, bisa di-debug per langkah.",
        contoh="NPL per kota 3 langkah.")
    L.decision("3", "Hierarki / deret → <strong>recursive CTE</strong>",
        "Rekursif.",
        kenapa="Anchor + kondisi berhenti wajib.",
        contoh="Date spine, org chart.")
    L.decision("4", "Dipakai banyak query / besar → <strong>temp table</strong>",
        "Lintas query.",
        kenapa="CTE hanya hidup 1 query.",
        contoh="Staging harian (C16).")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Namai CTE dengan <em>isi</em>-nya, bukan cte1.</li>"
        "<li>Debug per langkah: SELECT * FROM nama_cte.</li>"
        "<li>Recursive: selalu ada kondisi berhenti.</li>"
        "<li>Keterbacaan > keringkasan — selalu.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Refactor Warisan 40 Baris")
    L.raw(callout("<p>Kamu mewarisi query: subquery 3 level untuk &ldquo;top 3 kota by NPL ratio&rdquo;. Ada bug: satu kota NPL-nya 300% (mustahil!).</p>"
        "<p><strong>Pertanyaan:</strong> bagaimana CTE membantumu menemukan bug dalam 5 menit?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Langkah:</strong> pecah jadi CTE: <code className=\"inline\">kredit_kota</code> → <code className=\"inline\">ringkas</code> → SELECT final. Lalu <code className=\"inline\">SELECT * FROM kredit_kota WHERE kota = 'X'</code> — ketahuan: <strong>duplikat baris kredit</strong> (join ganda!) menggandakan plafon_npl tapi tidak total_plafon (atau sebaliknya). Bug fan-out (C5) yang tersembunyi di sarang subquery.</p>"
        "<p><strong>Pelajaran:</strong> CTE bukan cuma gaya — ia <em>alat debug</em>. Tiap langkah bisa diinspeksi. Query warisan pertama yang harus dilakukan: refactor ke CTE, baru cari bug.</p>")))

    L.quiz("Keunggulan utama CTE dibanding subquery bersarang…",
        ["Lebih cepat selalu", "Terbaca: langkah bernama berurutan, bisa di-debug per langkah", "Bisa lintas database", "Tidak butuh alias"],
        1, "Benar: keterbacaan + debuggability. Performa umumnya setara.")
    L.quiz("CTE didefinisikan…",
        ["Setelah query utama", "Di awal dengan WITH, sebelum query utama", "Di dalam WHERE", "Bebas di mana saja"],
        1, "Benar: WITH di awal, query utama di akhir.")
    L.quiz("Recursive CTE wajib punya…",
        ["ORDER BY", "Anchor + kondisi berhenti", "GROUP BY", "LIMIT"],
        1, "Benar: tanpa kondisi berhenti = rekursi tak berujung.")
    L.quiz("Kapan temp table lebih tepat dari CTE?",
        ["Query 1 langkah", "Data dipakai banyak query / besar", "Tidak pernah", "Selalu"],
        1, "Benar: CTE hidup 1 query; temp table lintas query/sesi.")
    L.quiz("SELECT * FROM total_trx (nama CTE) berguna untuk…",
        ["Menambah kecepatan", "Debug: inspeksi hasil per langkah", "Mengubah data", "Membuat index"],
        1, "Benar: tiap langkah CTE bisa diinspeksi — alat debug utama.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>CTE:</strong> WITH nama AS (...) — langkah bernama, berurutan, reusable dalam 1 query.</li>"
        "<li><strong>Multi-step:</strong> pecah analisis kompleks; debug per langkah.</li>"
        "<li><strong>Recursive:</strong> anchor + kondisi berhenti — hierarki &amp; date spine.</li>"
        "<li><strong>Pilih:</strong> 1 langkah → subquery; 2+ → CTE; lintas query → temp table.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C8
def c8():
    L = Lesson("c8-union-set", "C8 — SQL",
        "UNION &amp; Operasi Himpunan:<br/>Menumpuk, Bukan Menyambung",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c7-cte", "← C7"), ("c9-window-functions-1", "Next: C9-1"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Membedakan <strong>UNION vs UNION ALL</strong> — dan kapan dedup diinginkan.</li>"
        "<li>Memakai <strong>INTERSECT</strong> dan <strong>EXCEPT</strong> untuk irisan &amp; selisih.</li>"
        "<li>Menjelaskan syarat <strong>kolom sejajar</strong> (jumlah &amp; tipe).</li>"
        "<li>Memilih <strong>UNION vs JOIN</strong> dengan benar.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Dua Sistem, Satu Laporan")
    L.raw('<div className="story"><p>Bank hasil merger: data nasabah ada di <strong>dua sistem</strong> (core banking lama + sistem baru) dengan struktur tabel sama. Direksi minta &ldquo;satu daftar nasabah&rdquo;. JOIN? Salah — tidak ada relasi antar baris; yang dibutuhkan adalah <strong>menumpuk</strong> dua daftar menjadi satu.</p>'
        "<p>UNION menumpuk baris; JOIN menyambung kolom. Tertukar = hasil kacau. Lesson pendek tapi penting ini memastikan kamu tidak tertukar.</p></div>")

    L.sec("union", "UNION vs UNION ALL")
    L.raw(codebox("-- tumpuk + buang duplikat\nSELECT nama, kota FROM nasabah_lama\nUNION\nSELECT nama, kota FROM nasabah_baru;\n\n-- tumpuk apa adanya (lebih cepat!)\nSELECT nama, kota FROM nasabah_lama\nUNION ALL\nSELECT nama, kota FROM nasabah_baru;", "sql"))
    L.table(["", "UNION", "UNION ALL"],
        [["Duplikat", "Dibuang", "Dipertahankan"],
         ["Kecepatan", "Lebih lambat (sort/dedup)", "Lebih cepat"],
         ["Kapan", "Daftar unik gabungan", "Gabung log/partisi; hitung total"]])
    L.p("<strong>Syarat:</strong> jumlah kolom <strong>sama</strong>, tipe <strong>kompatibel</strong>, urutan <strong>sejajar</strong>. Nama kolom hasil = dari SELECT pertama.")
    L.raw(myth("UNION dan UNION ALL sama saja.",
        "Beda hasil DAN beda cepat! UNION menduplikat-buang (butuh sort) — jika datamu memang tak berduplikat (misal partisi bulanan), UNION ALL jauh lebih cepat. <strong>Default: UNION ALL</strong> kecuali kamu butuh dedup. Kebanyakan bug &ldquo;kok jumlahnya kurang&rdquo; berasal dari UNION yang membuang duplikat sah!"))
    L.raw(tip("ORDER BY/LIMIT hanya di AKHIR (berlaku untuk gabungan): <code className=\"inline\">... UNION ALL ... ORDER BY nama LIMIT 10</code>. Bungkus tiap SELECT dengan tanda kurung jika perlu ORDER BY sendiri."))

    L.sec("intersect", "INTERSECT &amp; EXCEPT — Irisan dan Selisih")
    L.raw(codebox("-- nasabah yang ADA di kedua sistem (irisan)\nSELECT id FROM nasabah_lama\nINTERSECT\nSELECT id FROM nasabah_baru;\n\n-- nasabah yang HANYA di sistem lama (selisih)\nSELECT id FROM nasabah_lama\nEXCEPT\nSELECT id FROM nasabah_baru;", "sql"))
    L.ul([
        "<strong>INTERSECT:</strong> &ldquo;yang ada di keduanya&rdquo; — untuk rekonsiliasi/cocok.",
        "<strong>EXCEPT:</strong> &ldquo;yang ada di A tapi tidak di B&rdquo; — untuk temukan yang hilang/migrasi belum selesai.",
        "<strong>Catatan SQLite:</strong> EXCEPT (bukan MINUS seperti Oracle).",
    ])
    L.p("<strong>Kasus nyata:</strong> setelah migrasi, <code className=\"inline\">EXCEPT</code> menemukan 37 nasabah yang belum pindah sistem — tanpa ini, mereka hilang dari layanan!")
    L.raw(tip("Pola audit migrasi: <code className=\"inline\">(A EXCEPT B)</code> = hilang; <code className=\"inline\">(B EXCEPT A)</code> = baru tak terduga; <code className=\"inline\">(A UNION B) vs (A INTERSECT B)</code> = cakupan. Tiga query = audit migrasi lengkap."))

    L.sec("union-vs-join", "UNION vs JOIN — Jangan Tertukar")
    L.table(["", "UNION", "JOIN"],
        [["Arah", "Vertikal (tumpuk baris)", "Horizontal (sambung kolom)"],
         ["Syarat", "Kolom sejajar", "Kunci relasi (ON)"],
         ["Baris hasil", "Jumlah dijumlah", "Dikalikan (fan-out!)"],
         ["Contoh", "Gabung 2 sistem", "Nasabah + kreditnya"]])
    L.raw(codebox("-- SALAH: mau menumpuk malah join (hasil kacau)\n-- BENAR: menumpuk daftar kota dari dua tabel\nSELECT kota FROM nasabah\nUNION\nSELECT kota FROM kantor_cabang;", "sql"))
    L.raw(myth("UNION bisa menggantikan JOIN.",
        "Tidak — mereka ortogonal. Butuh kolom dari dua tabel yang berelasi? JOIN. Butuh baris dari dua tabel sejenis? UNION. Jika ragumu &ldquo;pakai yang mana&rdquo;, tanyakan: &ldquo;apakah baris-baris ini entitas yang sama?&rdquo; Ya → UNION; tidak → JOIN."))

    L.chart(
        data=[{"x": ["UNION", "UNION ALL"], "y": [18, 20], "type": "bar",
               "marker": {"color": ["#e8a838", "#2a7de1"]},
               "text": ["18 (2 duplikat dibuang)", "20 (apa adanya)"], "textposition": "outside"}],
        title="UNION vs UNION ALL: 2 Baris Hilang?",
        layout={"yaxis": {"title": "Baris hasil"}, "showlegend": False},
        cara="Dua sistem masing-masing 10 nasabah, 2 orang ada di keduanya.",
        interpretasi="UNION = 18 (dedup), UNION ALL = 20 (apa adanya). <strong>Mana yang benar?</strong> Tergantung pertanyaan! &ldquo;Berapa nasabah unik?&rdquo; → 18. &ldquo;Berapa total record untuk rekonsiliasi?&rdquo; → 20. Pilih berdasar <em>pertanyaan</em>, bukan kebiasaan.")

    L.sec("lab1", "🔬 Lab 1: Menumpuk Dua Daftar")
    L.lab("Lab 1 — UNION vs UNION ALL",
        "Buat dua &ldquo;sistem&rdquo;: nasabah Jakarta vs nasabah non-Jakarta. Tumpuk dengan UNION ALL, hitung baris. Lalu UNION — ada beda?",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT nama, kota FROM nasabah WHERE kota='Jakarta' UNION ALL SELECT nama, kota FROM nasabah WHERE kota<>'Jakarta'",
                "SELECT nama, kota FROM nasabah WHERE kota = 'Jakarta'"),
        "Ganti jadi UNION. Kenapa hasilnya sama di sini? (Kapan beda?)")
    L.raw(sql_answer("Jawaban Lab 1",
        "-- UNION ALL: 10 baris (4 + 6)\nSELECT nama, kota FROM nasabah WHERE kota = 'Jakarta'\nUNION ALL\nSELECT nama, kota FROM nasabah WHERE kota <> 'Jakarta';\n-- UNION: sama (tak ada duplikat antar partisi yang saling lepas)"))

    L.sec("lab2", "🔬 Lab 2: Temukan yang Hilang")
    L.lab("Lab 2 — EXCEPT untuk Audit",
        "Nasabah dengan dpd > 0 vs nasabah yang punya kredit: siapa yang ber-dpd tapi <strong>tidak punya</strong> kredit? (Pakai EXCEPT.)",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS), ("kredit", KREDIT_DDL, KREDIT_ROWS)],
                "SELECT id FROM nasabah WHERE dpd > 0 EXCEPT SELECT DISTINCT nasabah_id FROM kredit",
                "SELECT id, nama, dpd FROM nasabah WHERE dpd > 0"),
        "Balik: kredit yang nasabah_id-nya tidak ada di nasabah (orphan!) — temukan dengan EXCEPT.")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- ber-dpd tapi tanpa kredit:\nSELECT id, nama FROM nasabah WHERE dpd > 0\nEXCEPT\nSELECT n.id, n.nama FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;\n-- catatan: EXCEPT membandingkan semua kolom SELECT; samakan kolomnya!"))

    L.sec("peta", "🗺️ Peta Keputusan: Operasi Himpunan")
    L.decision("1", "Tumpuk daftar sejenis → <strong>UNION ALL</strong> (default)",
        "Gabung partisi/sistem.",
        kenapa="Cepat, apa adanya. Syarat: kolom sejajar.",
        contoh="Nasabah sistem lama + baru.")
    L.decision("2", "Butuh unik → <strong>UNION</strong>",
        "Dedup diinginkan.",
        kenapa="Buang duplikat (ada biaya sort).",
        contoh="Daftar kota unik dari 2 tabel.")
    L.decision("3", "Ada di keduanya → <strong>INTERSECT</strong>",
        "Irisan.",
        kenapa="Rekonsiliasi kecocokan.",
        contoh="Nasabah di kedua sistem.")
    L.decision("4", "Hilang di satu sisi → <strong>EXCEPT</strong>",
        "Selisih.",
        kenapa="Audit migrasi; temukan yang hilang.",
        contoh="Belum pindah sistem.")
    L.decision("5", "Ragu UNION vs JOIN → <strong>tanya entitasnya</strong>",
        "Beda arah.",
        kenapa="Entitas sama → UNION; berelasi → JOIN.",
        contoh="Lihat tabel di atas.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Default UNION ALL; UNION hanya jika butuh dedup.</li>"
        "<li>Kolom harus sejajar (jumlah, tipe, urutan).</li>"
        "<li>ORDER BY/LIMIT di akhir gabungan.</li>"
        "<li>EXCEPT = alat audit &ldquo;yang hilang&rdquo;.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Audit Migrasi Sistem")
    L.raw(callout("<p>Bank migrasi 10.000 nasabah ke sistem baru. Tes: <code className=\"inline\">SELECT COUNT(*) FROM lama EXCEPT ...</code> — salah, EXCEPT tidak untuk COUNT! Bagaimana audit yang benar?</p>"
        "<p><strong>Pertanyaan:</strong> tulis 3 query audit: (a) yang hilang, (b) yang baru tak terduga, (c) total unik.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p>(a) <code className=\"inline\">SELECT id FROM lama EXCEPT SELECT id FROM baru;</code> (b) <code className=\"inline\">SELECT id FROM baru EXCEPT SELECT id FROM lama;</code> (c) <code className=\"inline\">SELECT COUNT(*) FROM (SELECT id FROM lama UNION SELECT id FROM baru);</code></p>"
        "<p><strong>Pelajaran:</strong> EXCEPT bekerja pada <em>himpunan baris</em>, bukan angka. Tiga query ini = template audit setiap migrasi/ELT. Simpan sebagai snippet!</p>")))

    L.quiz("UNION vs UNION ALL: bedanya…",
        ["Tidak ada", "UNION buang duplikat (lebih lambat); UNION ALL apa adanya (cepat)", "UNION ALL buang duplikat", "UNION hanya untuk angka"],
        1, "Benar. Default UNION ALL kecuali butuh dedup.")
    L.quiz("Syarat UNION: kolom harus…",
        ["Sama nama", "Sejajar: jumlah sama, tipe kompatibel, urutan sama", "Bebas", "Harus primary key"],
        1, "Benar: sejajar. Nama hasil ikut SELECT pertama.")
    L.quiz("Nasabah yang ada di sistem lama tapi belum di baru…",
        ["UNION", "INTERSECT", "EXCEPT (lama EXCEPT baru)", "JOIN"],
        2, "Benar: selisih = EXCEPT. Pola audit migrasi.")
    L.quiz("ORDER BY pada query UNION…",
        ["Di tiap SELECT", "Hanya di akhir (untuk gabungan)", "Tidak boleh", "Otomatis"],
        1, "Benar: di akhir. Bungkus kurung jika perlu ORDER BY per SELECT.")
    L.quiz("Mau &ldquo;daftar kota dari 2 tabel&rdquo; (entitas sama)…",
        ["JOIN", "UNION", "EXISTS", "CASE"],
        1, "Benar: menumpuk = UNION. Menyambung kolom = JOIN.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>UNION ALL</strong> (default, cepat) vs <strong>UNION</strong> (dedup, lambat).</li>"
        "<li><strong>INTERSECT</strong> = irisan; <strong>EXCEPT</strong> = selisih (alat audit).</li>"
        "<li><strong>Syarat:</strong> kolom sejajar; ORDER BY/LIMIT di akhir.</li>"
        "<li><strong>UNION</strong> = tumpuk baris (vertikal); <strong>JOIN</strong> = sambung kolom (horizontal).</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C9-1
def c91():
    L = Lesson("c9-window-functions-1", "C9 — SQL (Part 1)",
        "Window Functions:<br/>Ranking &amp; Akses Baris Tetangga",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c8-union-set", "← C8"), ("c9-window-functions-2", "Next: C9-2"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan konsep <strong>window function</strong>: hitung tanpa melipat baris (vs GROUP BY).</li>"
        "<li>Memakai <strong>ROW_NUMBER, RANK, DENSE_RANK</strong> untuk peringkat.</li>"
        "<li>Memakai <strong>PARTITION BY</strong> untuk &ldquo;GROUP BY tanpa melipat&rdquo;.</li>"
        "<li>Memakai <strong>LAG/LEAD</strong> untuk mengakses baris sebelum/sesudah.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Top 3 per Kota&rdquo; yang Tak Bisa Dijawab GROUP BY")
    L.raw('<div className="story"><p>Manajer: <em>&ldquo;Siapa 3 nasabah berpenghasilan tertinggi <strong>di tiap kota</strong>?&rdquo;</em> GROUP BY kota melipat 10 baris jadi 4 — nama-namanya hilang! Subquery per kota? Bisa, tapi kaku dan lambat.</p>'
        "<p>Window function menjawab dalam <strong>satu query elegan</strong>: beri peringkat <em>di dalam tiap kota</em>, saring peringkat ≤ 3. Skill ini (window functions) adalah <strong>#1 yang diuji di interview data analyst 2026</strong> — dan topik yang paling sering &ldquo;ditakuti&rdquo; padahal polanya sedikit. Part 1: ranking &amp; tetangga. Part 2: agregat berjalan.</p></div>")

    L.sec("konsep", "Konsep: Hitung Tanpa Melipat")
    L.p("<strong>Definisi.</strong> Window function melakukan perhitungan <em>melintasi sekumpulan baris terkait</em> (<strong>window</strong>) — tapi <strong>tidak melipat baris</strong> seperti GROUP BY. Tiap baris tetap ada, plus kolom hasil perhitungan.")
    L.raw(codebox("-- GROUP BY: 10 baris -> 4 baris (nama hilang!)\nSELECT kota, AVG(penghasilan) FROM nasabah GROUP BY kota;\n\n-- Window: 10 baris TETAP 10 baris + kolom baru\nSELECT nama, kota, penghasilan,\n       AVG(penghasilan) OVER (PARTITION BY kota) AS rata_kota\nFROM nasabah;", "sql"))
    L.p("<strong>Anatomi:</strong> <code className=\"inline\">FUNGSI(...) OVER (PARTITION BY ... ORDER BY ...)</code> — PARTITION BY = &ldquo;kelompok window&rdquo;, ORDER BY di dalam OVER = &ldquo;urutan dalam window&rdquo;.")
    L.raw(tip("Ingat: window function dieksekusi <strong>setelah</strong> WHERE/GROUP BY/HAVING tapi <strong>sebelum</strong> ORDER BY final (urutan: ... HAVING → window → SELECT → ORDER BY). Karena itu kamu <strong>tidak bisa</strong> pakai hasil window di WHERE — butuh subquery/CTE pembungkus (pola di bawah!)."))

    L.sec("ranking", "ROW_NUMBER, RANK, DENSE_RANK — Tiga Peringkat")
    L.raw(codebox("SELECT nama, kota, penghasilan,\n  ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn,\n  RANK()       OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rnk,\n  DENSE_RANK() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS drnk\nFROM nasabah;", "sql"))
    L.table(["Fungsi", "Seri (tie)", "Contoh: 1,2,2,3", "Kapan"],
        [["ROW_NUMBER", "Nomor unik acak", "1, 2, 3, 4", "Dedup: ambil 1 per grup"],
         ["RANK", "Lompat setelah seri", "1, 2, 2, 4", "Peringkat kompetisi nyata"],
         ["DENSE_RANK", "Rapat tanpa lompat", "1, 2, 2, 3", "&ldquo;Top-N nilai unik&rdquo;"]])
    L.p("<strong>Pola &ldquo;top-N per grup&rdquo;</strong> (interview klasik!):")
    L.raw(codebox("WITH peringkat AS (\n  SELECT nama, kota, penghasilan,\n         ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn\n  FROM nasabah\n)\nSELECT * FROM peringkat WHERE rn <= 2;  -- 2 teratas tiap kota", "sql"))
    L.raw(myth("Hasil window function bisa langsung di-WHERE.",
        "Tidak bisa! Window dihitung setelah WHERE. Pola wajib: <strong>CTE/subquery dulu, saring kemudian</strong> (seperti di atas). Ini pola yang paling sering ditulis salah di interview — hafalkan bentuknya."))
    L.raw(myth("PARTITION BY harus selalu dipakai.",
        "Tidak! <code className=\"inline\">OVER ()</code> kosong = seluruh hasil sebagai satu window (untuk % of total — C9-2). Dan <code className=\"inline\">OVER (ORDER BY x)</code> tanpa PARTITION = window berjalan atas semua baris. PARTITION hanya saat butuh grup terpisah."))
    L.raw(tip("ROW_NUMBER untuk dedup: <code className=\"inline\">ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC)</code> lalu saring rn=1 → &ldquo;baris terbaru per id&rdquo;. Pola #1 data cleaning di SQL!"))

    L.sec("laglead", "LAG / LEAD — Mengintip Tetangga")
    L.raw(codebox("SELECT tanggal, jumlah,\n  LAG(jumlah) OVER (ORDER BY tanggal) AS kemarin,\n  jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih,\n  LEAD(tanggal) OVER (ORDER BY tanggal) AS besok\nFROM transaksi\nWHERE nasabah_id = 1;", "sql"))
    L.ul([
        "<code className=\"inline\">LAG(x)</code> = nilai x di baris <strong>sebelumnya</strong>; <code className=\"inline\">LEAD(x)</code> = <strong>sesudahnya</strong>.",
        "<strong>Kapan:</strong> pertumbuhan harian (selisih vs kemarin), deteksi anomali (lonjakan), time-to-event.",
        "<code className=\"inline\">LAG(x, 7)</code> = 7 baris sebelumnya; argumen ke-3 = default jika NULL (<code className=\"inline\">LAG(x, 1, 0)</code>).",
        "<strong>Wajib ORDER BY</strong> di dalam OVER — tanpa itu &ldquo;sebelum&rdquo; tidak bermakna!",
    ])
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: hari dengan kenaikan transaksi terbesar (nasabah 1).</p>"
        "<p><strong>Langkah 1</strong> — ambil kemarin: <code className=\"inline\">LAG(jumlah) OVER (ORDER BY tanggal) AS kemarin</code>.</p>"
        "<p><strong>Langkah 2</strong> — selisih: <code className=\"inline\">jumlah - kemarin AS naik</code> (di CTE!).</p>"
        "<p><strong>Langkah 3</strong> — <code className=\"inline\">SELECT * FROM cte ORDER BY naik DESC LIMIT 1</code>.</p>"
        "<p>Hasil: 2026-09-15 naik 950rb (dari 250rb ke 1,2jt). Pola &ldquo;bandingkan dengan periode lalu&rdquo; = 80% analisis tren.</p>"))
    L.raw(tip("Pola MoM/YoY: <code className=\"inline\">jumlah / LAG(jumlah, 12) OVER (PARTITION BY kategori ORDER BY bulan) - 1</code> = pertumbuhan YoY per kategori. Satu baris = laporan tahunan!"))

    L.chart(
        data=[{"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [500000, 250000, 1200000],
               "type": "bar", "name": "Transaksi", "marker": {"color": "#2a7de1"}},
              {"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [0, -250000, 950000],
               "type": "bar", "name": "Selisih vs transaksi lalu (LAG)", "marker": {"color": "#e8a838"}}],
        title="Transaksi vs Selisih (LAG) — Nasabah 1",
        layout={"barmode": "group", "yaxis": {"title": "Rupiah"}, "showlegend": True},
        cara="Biru = nilai transaksi; oranye = selisih vs transaksi sebelumnya (LAG).",
        interpretasi="LAG mengubah deret <em>level</em> menjadi deret <em>perubahan</em> — dan perubahan yang biasanya ditanya (&ldquo;naik berapa?&rdquo;). <strong>Catatan:</strong> bar pertama selisihnya NULL (tidak ada &ldquo;kemarin&rdquo;) — tangani dengan default LAG(x,1,0) atau biarkan NULL eksplisit.")

    L.sec("lab1", "🔬 Lab 1: Top-2 per Kota")
    L.lab("Lab 1 — ROW_NUMBER + PARTITION BY",
        "Tampilkan 2 nasabah berpenghasilan tertinggi di <strong>tiap kota</strong>. (Ingat: CTE dulu, saring kemudian!)",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "WITH p AS (SELECT nama, kota, penghasilan, ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn FROM nasabah) SELECT * FROM p WHERE rn <= 2",
                "SELECT nama, kota, penghasilan, ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn FROM nasabah"),
        "Ganti jadi RANK: apa bedanya jika ada penghasilan kembar?")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH p AS (\n  SELECT nama, kota, penghasilan,\n         ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn\n  FROM nasabah\n)\nSELECT * FROM p WHERE rn <= 2;"))

    L.sec("lab2", "🔬 Lab 2: Kenaikan Terbesar")
    L.lab("Lab 2 — LAG untuk Pertumbuhan",
        "Untuk nasabah 1: tampilkan tanggal, jumlah, dan selisih vs transaksi sebelumnya. Urut selisih terbesar.",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "WITH s AS (SELECT tanggal, jumlah, jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih FROM transaksi WHERE nasabah_id=1) SELECT * FROM s ORDER BY selisih DESC",
                "SELECT tanggal, jumlah, LAG(jumlah) OVER (ORDER BY tanggal) AS kemarin FROM transaksi WHERE nasabah_id = 1"),
        "Tambahkan kolom pct: selisih / kemarin. Waspadai pembagian NULL!")
    L.raw(sql_answer("Jawaban Lab 2",
        "WITH s AS (\n  SELECT tanggal, jumlah,\n         jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih\n  FROM transaksi WHERE nasabah_id = 1\n)\nSELECT * FROM s ORDER BY selisih DESC;"))

    L.sec("peta", "🗺️ Peta Keputusan: Window Part 1")
    L.decision("1", "Peringkat per grup → <strong>ROW_NUMBER/RANK</strong> + PARTITION BY",
        "&ldquo;Top-N per ...&rdquo;.",
        kenapa="CTE + saring rn <= N (tak bisa di WHERE langsung).",
        contoh="Top-2 per kota.")
    L.decision("2", "Dedup ambil terbaru → <strong>ROW_NUMBER rn=1</strong>",
        "Duplikat.",
        kenapa="PARTITION BY id ORDER BY updated_at DESC.",
        contoh="Baris terbaru per id.")
    L.decision("3", "Banding vs periode lalu → <strong>LAG/LEAD</strong>",
        "Pertumbuhan, anomali.",
        kenapa="Wajib ORDER BY di OVER; NULL di tepi.",
        contoh="Selisih harian, YoY.")
    L.decision("4", "Rata-rata per grup tanpa melipat → <strong>AVG OVER (PARTITION BY)</strong>",
        "Konteks per baris.",
        kenapa="Baris utuh + kolom konteks grup.",
        contoh="Gaji vs rata-rata kotanya.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Window ≠ GROUP BY: baris tidak melipat.</li>"
        "<li>Hasil window <strong>tidak bisa</strong> di WHERE — bungkus CTE.</li>"
        "<li>PARTITION BY = kelompok; ORDER BY di OVER = urutan.</li>"
        "<li>ROW_NUMBER unik; RANK lompat; DENSE_RANK rapat.</li></ol>"))

    L.sec("case", "📋 Mini-Case: &ldquo;Nasabah Terbaik Tiap Kota&rdquo; versi Kompetisi")
    L.raw(callout("<p>Marketing mau memberi reward ke <strong>peringkat 1–3 tiap kota</strong> berdasar total transaksi — tapi jika ada nilai kembar, semua yang seri harus dapat (adil!).</p>"
        "<p><strong>Pertanyaan:</strong> ROW_NUMBER, RANK, atau DENSE_RANK? Tulis query-nya.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>DENSE_RANK</strong> — &ldquo;3 nilai tertinggi&rdquo; (semua yang seri ikut), tanpa lompat. RANK juga adil untuk seri tapi melompat (peringkat 4 hilang jika 2 orang seri di 3). ROW_NUMBER <strong>tidak adil</strong> (memotong seri secara acak).</p>"
        "<p>Query: <code className=\"inline\">WITH t AS (...total per nasabah...), p AS (SELECT ..., DENSE_RANK() OVER (PARTITION BY kota ORDER BY total DESC) dr FROM ...) SELECT * FROM p WHERE dr &lt;= 3;</code></p>"
        "<p><strong>Pelajaran:</strong> pilihan fungsi ranking = keputusan keadilan, bukan sekadar teknis. Tanyakan &ldquo;bagaimana jika seri?&rdquo; sebelum memilih.</p>")))

    L.quiz("Window function vs GROUP BY: bedanya…",
        ["Sama", "Window tidak melipat baris; GROUP BY melipat", "Window lebih lambat selalu", "GROUP BY bisa ranking"],
        1, "Benar: window menambah kolom, baris tetap.")
    L.quiz("WHERE rn <= 2 langsung pada query ber-ROW_NUMBER…",
        ["Berhasil", "Error — window tak bisa di WHERE; bungkus CTE dulu", "Hasil kosong", "Mengabaikan filter"],
        1, "Benar: urutan eksekusi — window setelah WHERE.")
    L.quiz("Nilai: 100, 90, 90, 80. RANK menghasilkan…",
        ["1,2,3,4", "1,2,2,4", "1,2,2,3", "1,1,2,3"],
        1, "Benar: RANK melompat setelah seri.")
    L.quiz("Dedup &ldquo;ambil baris terbaru per id&rdquo;…",
        ["RANK", "ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), saring rn=1", "LAG", "COUNT"],
        1, "Benar: pola dedup #1.")
    L.quiz("LAG butuh…",
        ["GROUP BY", "ORDER BY di dalam OVER", "HAVING", "UNION"],
        1, "Benar: tanpa ORDER BY, &ldquo;sebelum&rdquo; tak bermakna.")
    L.quiz("Baris pertama LAG(x) menghasilkan…",
        ["0", "NULL (tidak ada sebelumnya)", "Error", "x itu sendiri"],
        1, "Benar: NULL di tepi — pakai default LAG(x,1,0) jika perlu.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Window:</strong> hitung melintasi baris terkait <strong>tanpa melipat</strong>.</li>"
        "<li><strong>Ranking:</strong> ROW_NUMBER (unik) / RANK (lompat) / DENSE_RANK (rapat).</li>"
        "<li><strong>Pola top-N:</strong> CTE + PARTITION BY + saring rn ≤ N.</li>"
        "<li><strong>LAG/LEAD:</strong> intip tetangga — butuh ORDER BY di OVER.</li>"
        "<li><strong>Jangan:</strong> hasil window di WHERE langsung.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C9-2
def c92():
    L = Lesson("c9-window-functions-2", "C9 — SQL (Part 2)",
        "Window Functions:<br/>Agregat Berjalan &amp; Bingkai",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c9-window-functions-1", "← C9-1"), ("c10-pivot-kasus", "Next: C10"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menulis <strong>running total</strong> dan <strong>moving average</strong> dengan frame clause.</li>"
        "<li>Menjelaskan <strong>ROWS vs RANGE</strong> dan frame default.</li>"
        "<li>Memakai <strong>NTILE</strong> dan <strong>FIRST_VALUE/LAST_VALUE</strong>.</li>"
        "<li>Menghitung <strong>% of total</strong> dan pangsa kumulatif (kurva Lorenz mini).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Kapan Kita Tembus 10 Juta?&rdquo;")
    L.raw('<div className="story"><p>Direksi: <em>&ldquo;Kapan akumulasi transaksi kita tembus 10 juta bulan ini? Dan bagaimana tren rata-rata 7 hariannya?&rdquo;</em> Running total + moving average = dua jawaban dalam satu query.</p>'
        "<p>Part 1 mengajarkan ranking &amp; tetangga. Part 2: <strong>agregat yang &ldquo;berjalan&rdquo;</strong> — fondasi semua dashboard tren, deteksi anomali time-series, dan analisis konsentrasi. Setelah ini, window function-mu lengkap.</p></div>")

    L.sec("running", "Running Total — Frame Clause")
    L.raw(codebox("SELECT tanggal, jumlah,\n  SUM(jumlah) OVER (\n    ORDER BY tanggal\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS akumulasi\nFROM transaksi\nWHERE nasabah_id = 1;", "sql"))
    L.ul([
        "<strong>Frame</strong> = &ldquo;baris mana yang ikut dihitung untuk baris ini&rdquo;.",
        "<code className=\"inline\">UNBOUNDED PRECEDING</code> → awal; <code className=\"inline\">CURRENT ROW</code> → baris ini = running total.",
        "<strong>Default</strong> saat ada ORDER BY: <code className=\"inline\">RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — RANGE memperlakukan nilai <strong>kembar</strong> sebagai satu (peer)!",
    ])
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: running total transaksi nasabah 1.</p>"
        "<p><strong>Langkah 1</strong> — urut: <code className=\"inline\">OVER (ORDER BY tanggal)</code>.</p>"
        "<p><strong>Langkah 2</strong> — frame: <code className=\"inline\">ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>.</p>"
        "<p><strong>Langkah 3</strong> — agregat: <code className=\"inline\">SUM(jumlah) OVER (...)</code>.</p>"
        "<p>Hasil: 500rb → 750rb → 1,95jt. Kumulatif menjawab &ldquo;kapan tembus X?&rdquo;.</p>"))
    L.raw(myth("ROWS dan RANGE sama saja.",
        "Beda saat ada nilai ORDER BY kembar! ROWS = baris fisik (1,2,3...); RANGE = nilai logis (semua yang <em>sama nilainya</em> dihitung bersama). Untuk tanggal kembar, RANGE memberi running total yang &ldquo;melompat&rdquo; sama untuk kedua baris — kadang diinginkan, kadang tidak. <strong>Eksplisit selalu lebih aman</strong> daripada mengandalkan default."))
    L.raw(tip("Pola &ldquo;kapan tembus X&rdquo;: <code className=\"inline\">WITH r AS (...running total...) SELECT MIN(tanggal) FROM r WHERE akumulasi >= 10000000</code> — CTE + saring (lagi-lagi pola Part 1!)."))

    L.sec("moving", "Moving Average — Rata-rata Bergerak")
    L.raw(codebox("SELECT tanggal, jumlah,\n  AVG(jumlah) OVER (\n    ORDER BY tanggal\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS ma_3\nFROM transaksi\nWHERE nasabah_id = 2;", "sql"))
    L.ul([
        "<code className=\"inline\">2 PRECEDING AND CURRENT ROW</code> = jendela 3 baris (ini + 2 sebelumnya) = MA-3.",
        "<strong>Kapan:</strong> menghaluskan noise harian (B13!), tren 7-hari, deteksi anomali (aktual vs MA).",
        "<strong>Tepi:</strong> 2 baris pertama rata-rata dari < 3 baris — tandai atau abaikan periode pemanasan.",
    ])
    L.p("<strong>Moving average terpusat</strong> (1 sebelum + 1 sesudah): <code className=\"inline\">ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING</code> — tapi baris terakhir tak punya &ldquo;sesudah&rdquo; (NULL/terpotong).")
    L.raw(tip("MA di SQL vs di Python (D): SQL cocok untuk MA sederhana di query laporan; untuk analisis berat (banyak jendela, statistik), pindahkan ke pandas (D4). Pilih alat sesuai beban."))

    L.sec("ntile", "NTILE, FIRST_VALUE, % of Total")
    L.raw(codebox("-- kuartil penghasilan\nSELECT nama, penghasilan,\n  NTILE(4) OVER (ORDER BY penghasilan) AS kuartil\nFROM nasabah;\n\n-- % of total + pangsa kumulatif (konsentrasi!)\nWITH t AS (\n  SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY 1\n)\nSELECT nasabah_id, total,\n  total * 1.0 / SUM(total) OVER () AS pangsa,\n  SUM(total) OVER (ORDER BY total DESC\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\n    * 1.0 / SUM(total) OVER () AS pangsa_kumulatif\nFROM t;", "sql"))
    L.ul([
        "<code className=\"inline\">NTILE(4)</code> = bagi urutan jadi 4 grup sama besar (kuartil); NTILE(10) = desil.",
        "<code className=\"inline\">SUM(x) OVER ()</code> = total keseluruhan (window kosong = semua baris!) → % of total.",
        "<strong>Pangsa kumulatif</strong> = kurva konsentrasi: berapa % transaksi dikuasai top-N nasabah (Pareto!).",
        "<code className=\"inline\">FIRST_VALUE(x) OVER (...)</code> = nilai pertama di window (vs LAG yang hanya 1 baris).",
    ])
    L.raw(myth("NTILE(4) = kuartil statistik.",
        "Hampir — NTILE membagi <em>jumlah baris</em> sama besar, bukan <em>nilai</em> sama lebar. Beda dengan binning nilai (WIDTH_BUCKET). Untuk &ldquo;20% nasabah teratas&rdquo; NTILE tepat; untuk &ldquo;penghasilan 0–5jt, 5–10jt&rdquo; pakai CASE (C2)."))

    L.chart(
        data=[{"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [500000, 250000, 1200000],
               "type": "bar", "name": "Transaksi", "marker": {"color": "#94a3b8"}},
              {"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [500000, 750000, 1950000],
               "type": "scatter", "mode": "lines+markers", "name": "Running total",
               "line": {"color": "#2a7de1", "width": 3}}],
        title="Running Total: Kapan Tembus 1,5 Juta?",
        layout={"yaxis": {"title": "Rupiah"}, "showlegend": True},
        cara="Batang = transaksi harian; garis = akumulasi (running total).",
        interpretasi="Garis monoton naik menembus 1,5jt pada 15 Sep. <strong>Running total menjawab pertanyaan &ldquo;kapan&rdquo;</strong> — yang tidak bisa dijawab bar chart biasa. Inilah mengapa finance (arus kas kumulatif, target penjualan) hidup dari running total.")

    L.chart(
        data=[{"x": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], "y": [41, 58, 68, 76, 83, 88, 92, 95, 98, 100],
               "type": "scatter", "mode": "lines+markers", "name": "Pangsa kumulatif",
               "line": {"color": "#e8a838", "width": 3}},
              {"x": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], "y": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
               "type": "scatter", "mode": "lines", "name": "Merata (referensi)",
               "line": {"color": "#94a3b8", "dash": "dash"}}],
        title="Kurva Konsentrasi: % Nasabah vs % Transaksi (ilustrasi)",
        layout={"xaxis": {"title": "% nasabah (diurut transaksi terbesar)"}, "yaxis": {"title": "% kumulatif transaksi"}, "showlegend": True},
        cara="Sumbu X = % nasabah teratas; Y = pangsa kumulatif transaksi. Garis putus = jika merata sempurna.",
        interpretasi="Kurva jauh di atas garis merata = <strong>terkonsentrasi</strong> (Pareto): sedikit nasabah mendominasi. Dihitung murni dengan window function (% of total + running total). <strong>Pertanyaan bisnis:</strong> apakah konsentrasi ini risiko (ketergantungan) atau peluang (VIP treatment)?")

    L.sec("lab1", "🔬 Lab 1: Running Total")
    L.lab("Lab 1 — Akumulasi Transaksi",
        "Untuk nasabah 2: tampilkan tanggal, jumlah, dan running total. Kapan akumulasi tembus 3 juta?",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "SELECT tanggal, jumlah, SUM(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS akumulasi FROM transaksi WHERE nasabah_id=2",
                "SELECT tanggal, jumlah FROM transaksi WHERE nasabah_id = 2 ORDER BY tanggal"),
        "Bungkus CTE: SELECT MIN(tanggal) FROM (...) WHERE akumulasi >= 3000000.")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH r AS (\n  SELECT tanggal,\n         SUM(jumlah) OVER (ORDER BY tanggal\n           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS akumulasi\n  FROM transaksi WHERE nasabah_id = 2\n)\nSELECT MIN(tanggal) FROM r WHERE akumulasi >= 3000000;"))

    L.sec("lab2", "🔬 Lab 2: Kuartil &amp; Pangsa")
    L.lab("Lab 2 — NTILE + % of Total",
        "Bagi nasabah jadi 4 kuartil berdasar penghasilan (NTILE). Lalu: hitung pangsa tiap kota dari total penghasilan (% of total).",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT nama, penghasilan, NTILE(4) OVER (ORDER BY penghasilan) AS kuartil FROM nasabah",
                "SELECT nama, penghasilan FROM nasabah ORDER BY penghasilan"),
        "Eko (NULL) jatuh di kuartil berapa? Kenapa? (NULLS FIRST/LAST!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- kuartil\nSELECT nama, penghasilan, NTILE(4) OVER (ORDER BY penghasilan) AS kuartil\nFROM nasabah;\n-- % of total per kota\nSELECT kota, SUM(penghasilan) AS total,\n       SUM(penghasilan) * 1.0 / SUM(SUM(penghasilan)) OVER () AS pangsa\nFROM nasabah GROUP BY kota;"))

    L.sec("peta", "🗺️ Peta Keputusan: Window Part 2")
    L.decision("1", "&ldquo;Kapan tembus X&rdquo; → <strong>running total</strong>",
        "Kumulatif.",
        kenapa="SUM OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING → CURRENT ROW).",
        contoh="Kapan tembus 10 juta.")
    L.decision("2", "Haluskan noise → <strong>moving average</strong>",
        "Tren.",
        kenapa="AVG OVER (... ROWS n PRECEDING → CURRENT ROW). Waspadai tepi.",
        contoh="MA-7 harian.")
    L.decision("3", "Bagi grup sama besar → <strong>NTILE</strong>",
        "Kuartil/desil.",
        kenapa="Bagi baris, bukan nilai. NULLS FIRST/LAST eksplisit.",
        contoh="Kuartil penghasilan.")
    L.decision("4", "Konsentrasi / pangsa → <strong>% of total + kumulatif</strong>",
        "Pareto.",
        kenapa="SUM(x) OVER () = total; kumulatif diurut DESC.",
        contoh="Top 20% nasabah kuasai berapa %?")
    L.decision("5", "Nilai pertama/terakhir grup → <strong>FIRST_VALUE/LAST_VALUE</strong>",
        "Tepi window.",
        kenapa="LAG hanya 1 baris; FIRST_VALUE seluruh window.",
        contoh="Transaksi pertama tiap nasabah.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Frame <strong>eksplisit</strong> (ROWS ...) — jangan andalkan default RANGE.</li>"
        "<li>Hasil window → CTE → saring. Selalu.</li>"
        "<li>NULL di ORDER BY: tentukan NULLS FIRST/LAST eksplisit.</li>"
        "<li>Tepi jendela (awal/akhir) = data tidak lengkap — tandai.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Anomali vs Moving Average")
    L.raw(callout("<p>Risk meminta: <em>&ldquo;Tandai transaksi harian yang &gt; 2× moving average 3-hari-nya sebagai anomali untuk direview.&rdquo;</em></p>"
        "<p><strong>Pertanyaan:</strong> tulis query-nya. Apa kelemahan aturan &ldquo;2×&rdquo; ini?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><code className=\"inline\">WITH m AS (SELECT tanggal, jumlah, AVG(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING) AS ma3 FROM transaksi) SELECT * FROM m WHERE jumlah &gt; 2 * ma3;</code> (MA dari 3 hari <em>sebelumnya</em> — tidak termasuk hari ini, agar tidak &ldquo;bocor&rdquo;.)</p>"
        "<p><strong>Kelemahan:</strong> (1) 2× arbitrer — tidak berbasis distribusi (harusnya z-score, B3!); (2) MA-3 sensitif outlier; (3) pola musiman (weekend) tidak tertangkap. <strong>Pelajaran:</strong> SQL bagus untuk <em>screening</em> anomali; <em>validasi</em> statistiknya di Python (D). Tahu batas alatmu!</p>")))

    L.quiz("Frame default saat OVER (ORDER BY x)…",
        ["ROWS UNBOUNDED PRECEDING → CURRENT ROW", "RANGE UNBOUNDED PRECEDING → CURRENT ROW", "Seluruh tabel", "Hanya baris ini"],
        1, "Benar: RANGE — perlakukan nilai kembar sebagai peer. Tulis eksplisit agar aman.")
    L.quiz("ROWS vs RANGE beda saat…",
        ["Selalu sama", "Ada nilai ORDER BY kembar", "Tidak ada ORDER BY", "Hanya 1 baris"],
        1, "Benar: ROWS = fisik, RANGE = logis (peer).")
    L.quiz("SUM(x) OVER () (OVER kosong) menghasilkan…",
        ["Error", "Total keseluruhan di setiap baris", "NULL", "x itu sendiri"],
        1, "Benar: window kosong = semua baris → % of total.")
    L.quiz("NTILE(4) membagi berdasar…",
        ["Nilai sama lebar", "Jumlah baris sama besar", "Acak", "Nilai unik"],
        1, "Benar: bagi baris. Untuk bin nilai pakai CASE/WIDTH_BUCKET.")
    L.quiz("Moving average 3 hari: frame yang benar…",
        ["ROWS BETWEEN 3 PRECEDING AND CURRENT ROW", "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW", "RANGE UNBOUNDED PRECEDING", "Tanpa frame"],
        1, "Benar: 2 sebelum + ini = 3 baris.")
    L.quiz("Kelemahan aturan &ldquo;anomali = > 2× MA&rdquo;…",
        ["Tidak ada", "Ambang arbitrer, sensitif outlier, abaikan musiman — screening saja", "Terlalu lambat", "Tidak bisa di SQL"],
        1, "Benar: SQL untuk screening; validasi statistik di Python.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Running total:</strong> SUM OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING → CURRENT ROW).</li>"
        "<li><strong>Moving average:</strong> AVG OVER (... ROWS n PRECEDING → CURRENT ROW).</li>"
        "<li><strong>Frame eksplisit;</strong> waspadai default RANGE &amp; tepi jendela.</li>"
        "<li><strong>NTILE</strong> (bagi baris), <strong>% of total</strong> (OVER kosong), <strong>pangsa kumulatif</strong> (konsentrasi).</li>"
        "<li>Window lengkap — kamu kuasai skill SQL #1 interview!</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C10
def c10():
    L = Lesson("c10-dedupe-pivot-yoy", "C10 — SQL",
        "Dedupe, Pivot &amp; YoY:<br/>Pola Analisis Sehari-hari",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c9-window-functions-2", "← C9-2"), ("c11-cohort-retention-funnel", "Next: C11"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Mendeduplikasi dengan <strong>ROW_NUMBER</strong> (pola &ldquo;ambil terbaru per id&rdquo;).</li>"
        "<li>Membuat <strong>pivot manual</strong> dengan conditional aggregation.</li>"
        "<li>Menghitung <strong>YoY/MoM growth</strong> dengan LAG.</li>"
        "<li>Menjelaskan kapan memakai tiap pola.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Tiga Pertanyaan Setiap Senin Pagi")
    L.raw('<div className="story"><p>Setiap Senin pagi, atasanmu bertanya tiga hal: <em>(1) &ldquo;Datanya sudah bersih dari duplikat?&rdquo; (2) &ldquo;Bagaimana tren per kategori bulan ini vs bulan lalu?&rdquo; (3) &ldquo;Pertumbuhan YoY-nya berapa?&rdquo;</em></p>'
        "<p>Tiga pola SQL di lesson ini — <strong>dedupe, pivot, YoY</strong> — menjawab ketiganya. Ini bukan teori eksotis; ini <em>pekerjaan Senin pagi</em> seorang data analyst. Kuasai, dan Senin pagimu tenang.</p></div>")

    L.sec("dedupe", "Dedupe — &ldquo;Ambil Satu per Grup&rdquo;")
    L.p("Data nyata berduplikat: double-submit, retry, SCD. Pola standar:")
    L.raw(codebox("WITH bersih AS (\n  SELECT *,\n    ROW_NUMBER() OVER (\n      PARTITION BY id\n      ORDER BY updated_at DESC\n    ) AS rn\n  FROM nasabah_raw\n)\nSELECT * FROM bersih WHERE rn = 1;  -- hanya baris terbaru per id", "sql"))
    L.ul([
        "<strong>PARTITION BY</strong> = definisi &ldquo;duplikat&rdquo; (id sama).",
        "<strong>ORDER BY</strong> = aturan &ldquo;menang&rdquo; (terbaru, terbesar, dsb).",
        "<strong>Varian:</strong> <code className=\"inline\">ORDER BY updated_at DESC, sumber_prioritas</code> — tie-breaker eksplisit!",
    ])
    L.raw(myth("Duplikat cukup dihapus dengan DISTINCT.",
        "DISTINCT menghapus baris <em>identik penuh</em> — tapi duplikat nyata hampir selalu beda di timestamp/status! &ldquo;Duplikat&rdquo; = id sama dengan atribut beda. Butuh aturan menang (ROW_NUMBER), bukan DISTINCT buta."))
    L.raw(tip("Sebelum dedup, <strong>ukur dulu</strong>: <code className=\"inline\">SELECT id, COUNT(*) c FROM t GROUP BY id HAVING c > 1</code> — berapa % duplikat? Dari mana? Dedupe tanpa memahami sumber duplikat = mengobati gejala."))

    L.sec("pivot", "Pivot Manual — Baris jadi Kolom")
    L.p("Laporan ingin kategori sebagai kolom (bukan baris). Conditional aggregation (C3) = pivot manual:")
    L.raw(codebox("SELECT strftime('%Y-%m', tanggal) AS bulan,\n  SUM(CASE WHEN kategori = 'belanja' THEN jumlah ELSE 0 END) AS belanja,\n  SUM(CASE WHEN kategori = 'makan' THEN jumlah ELSE 0 END) AS makan,\n  SUM(CASE WHEN kategori = 'travel' THEN jumlah ELSE 0 END) AS travel,\n  SUM(jumlah) AS total\nFROM transaksi\nGROUP BY 1\nORDER BY 1;", "sql"))
    L.ul([
        "Tiap kategori → satu kolom. Skala ke puluhan kategori dengan generate CASE (atau PIVOT syntax di BigQuery/Snowflake).",
        "<strong>Unpivot</strong> (kolom → baris): UNION ALL per kolom (C8) — untuk normalisasi data wide.",
        "<strong>Kapan:</strong> tabel laporan, perbandingan kategori, input chart.",
    ])
    L.raw(tip("Pivot dinamis (kategori tak diketahui)? Di SQLite/Postgres: generate query via string aggregation, atau pivot di aplikasi/Python (pandas D6). Jangan hardcode 50 CASE jika kategori berubah tiap bulan."))

    L.sec("yoy", "YoY / MoM — Pertumbuhan dengan LAG")
    L.raw(codebox("WITH bulanan AS (\n  SELECT strftime('%Y-%m', tanggal) AS bulan,\n         SUM(jumlah) AS total\n  FROM transaksi\n  GROUP BY 1\n)\nSELECT bulan, total,\n  LAG(total, 1) OVER (ORDER BY bulan) AS bulan_lalu,\n  (total - LAG(total, 1) OVER (ORDER BY bulan))\n    * 1.0 / LAG(total, 1) OVER (ORDER BY bulan) AS mom_growth\nFROM bulanan;", "sql"))
    L.ul([
        "<strong>MoM:</strong> LAG(..., 1); <strong>YoY:</strong> LAG(..., 12) pada data bulanan.",
        "<strong>Rumus growth:</strong> (baru - lama) / lama. Waspadai lama = 0/NULL!",
        "<strong>Bulan hilang:</strong> LAG(...,1) pada data berlubang = &ldquo;bulan data sebelumnya&rdquo;, bukan &ldquo;bulan kalender lalu&rdquo;! Butuh date spine (C7) untuk kalender benar.",
    ])
    L.raw(myth("Growth negatif kecil = tidak masalah.",
        "Tergantung basis! Turun 5% dari 100M = 5M hilang; naik 50% dari 1jt = 500rb. Selalu tampilkan <strong>angka absolut + %</strong> berdampingan. % tanpa basis = manipulasi (disengaja atau tidak)."))
    L.raw(tip("YTD (year-to-date): <code className=\"inline\">SUM(total) OVER (PARTITION BY strftime('%Y', bulan) ORDER BY bulan ROWS UNBOUNDED PRECEDING AND CURRENT ROW)</code> — running total yang reset tiap tahun (PARTITION BY tahun!). Pola laporan keuangan."))

    L.chart(
        data=[{"x": ["2026-09"], "y": [5050000], "type": "bar", "name": "Belanja", "marker": {"color": "#2a7de1"}},
              {"x": ["2026-09"], "y": [805000], "type": "bar", "name": "Makan", "marker": {"color": "#e8a838"}},
              {"x": ["2026-09"], "y": [3200000], "type": "bar", "name": "Travel", "marker": {"color": "#34a853"}}],
        title="Pivot: Total per Kategori, Sep 2026",
        layout={"barmode": "stack", "yaxis": {"title": "Rupiah"}, "showlegend": True},
        cara="Batang stack = hasil pivot: tiap kategori jadi segmen.",
        interpretasi="Pivot mengubah &ldquo;3 baris kategori&rdquo; menjadi &ldquo;1 baris, 3 kolom&rdquo; — format yang diinginkan chart &amp; laporan. <strong>Belanja dominan</strong> — tapi apakah itu sehat (bisnis retail) atau risiko (konsumtif)? Konteks bisnis menentukan.")

    L.sec("lab1", "🔬 Lab 1: Dedupe")
    L.lab("Lab 1 — Satu Baris per Nasabah",
        "Buat duplikat buatan: UNION ALL-kan nasabah dengan dirinya (ubah penghasilan). Lalu dedup: ambil penghasilan <strong>terbesar</strong> per id.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "WITH d AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC) AS rn FROM (SELECT * FROM nasabah UNION ALL SELECT id, nama, kota, penghasilan+1000000, dpd, status FROM nasabah WHERE id<=3)) SELECT * FROM d WHERE rn=1",
                "SELECT id, COUNT(*) FROM nasabah GROUP BY id HAVING COUNT(*) > 1"),
        "Ukur: berapa % duplikat? Aturan menang apa yang paling masuk akal di sini?")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH d AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC) AS rn\n  FROM (...data berduplikat...)\n)\nSELECT * FROM d WHERE rn = 1;"))

    L.sec("lab2", "🔬 Lab 2: Pivot + MoM")
    L.lab("Lab 2 — Pivot Kategori per Channel",
        "Pivot: baris = kategori, kolom = channel (mobile/web/atm) berisi SUM(jumlah). Tambahkan kolom total.",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "SELECT kategori, SUM(CASE WHEN channel='mobile' THEN jumlah ELSE 0 END) AS mobile, SUM(CASE WHEN channel='web' THEN jumlah ELSE 0 END) AS web, SUM(CASE WHEN channel='atm' THEN jumlah ELSE 0 END) AS atm, SUM(jumlah) AS total FROM transaksi GROUP BY kategori",
                "SELECT kategori, channel, SUM(jumlah) FROM transaksi GROUP BY kategori, channel"),
        "Channel mana dominan per kategori? Apa implikasi bisnisnya?")
    L.raw(sql_answer("Jawaban Lab 2",
        "SELECT kategori,\n  SUM(CASE WHEN channel = 'mobile' THEN jumlah ELSE 0 END) AS mobile,\n  SUM(CASE WHEN channel = 'web' THEN jumlah ELSE 0 END) AS web,\n  SUM(CASE WHEN channel = 'atm' THEN jumlah ELSE 0 END) AS atm,\n  SUM(jumlah) AS total\nFROM transaksi\nGROUP BY kategori;"))

    L.sec("peta", "🗺️ Peta Keputusan: Pola Analisis")
    L.decision("1", "Duplikat → <strong>ukur, lalu ROW_NUMBER</strong>",
        "Satu per grup.",
        kenapa="Definisikan duplikat (PARTITION BY) + aturan menang (ORDER BY).",
        contoh="Terbaru per id.")
    L.decision("2", "Kategori jadi kolom → <strong>pivot (CASE)</strong>",
        "Laporan/chart.",
        kenapa="SUM(CASE WHEN ...) per kategori.",
        contoh="Omzet per kategori per bulan.")
    L.decision("3", "Pertumbuhan → <strong>LAG + rumus</strong>",
        "MoM/YoY.",
        kenapa="(baru-lama)/lama; waspadai basis 0 & bulan hilang.",
        contoh="YoY per kategori.")
    L.decision("4", "Akumulasi tahun berjalan → <strong>YTD</strong>",
        "Target tahunan.",
        kenapa="Running total PARTITION BY tahun.",
        contoh="Realisasi vs target.")
    L.decision("5", "Kolom jadi baris → <strong>unpivot (UNION ALL)</strong>",
        "Normalisasi.",
        kenapa="Kebalikan pivot.",
        contoh="Wide → long untuk analisis.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Dedup: ukur dulu, aturan menang eksplisit.</li>"
        "<li>Pivot = CASE dalam agregat; unpivot = UNION ALL.</li>"
        "<li>Growth: tampilkan absolut + %; waspadai basis &amp; lubang kalender.</li>"
        "<li>Tiga pola ini = 80% query laporan rutin.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Laporan Senin Pagi")
    L.raw(callout("<p>Tulis <strong>satu query</strong> untuk laporan Senin: per kategori, tampilkan total bulan ini, total bulan lalu, MoM %, dan pangsa dari total. Data: tabel transaksi.</p>"
        "<p><strong>Pertanyaan:</strong> struktur CTE apa yang kamu pakai? (Tidak perlu sempurna — rancang alurnya.)</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Struktur:</strong> <code className=\"inline\">WITH bulanan AS (pivot per bulan-kategori), dibanding AS (tambah LAG per kategori)</code> → SELECT kategori, total, bulan_lalu, mom, pangsa.</p>"
        "<p><code className=\"inline\">WITH b AS (SELECT kategori, strftime('%Y-%m',tanggal) bl, SUM(jumlah) s FROM transaksi GROUP BY 1,2), c AS (SELECT *, LAG(s) OVER (PARTITION BY kategori ORDER BY bl) AS lalu FROM b) SELECT kategori, s AS total, lalu, (s-lalu)/lalu AS mom, s/SUM(s) OVER () AS pangsa FROM c WHERE bl = '2026-09';</code></p>"
        "<p><strong>Pelajaran:</strong> laporan kompleks = <strong>komposisi pola</strong> (pivot + LAG + % of total). Tiap pola sudah kamu kuasai — merangkai tinggal latihan.</p>")))

    L.quiz("Dedup &ldquo;ambil terbaru per id&rdquo;…",
        ["DISTINCT", "ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), saring rn=1", "GROUP BY id", "UNION"],
        1, "Benar: butuh aturan menang — DISTINCT tak cukup untuk duplikat tak-identik.")
    L.quiz("Sebelum dedup, yang wajib dilakukan…",
        ["Langsung hapus", "Ukur: berapa % duplikat & dari mana sumbernya", "Backup", "Minta izin"],
        1, "Benar: pahami sumber duplikat dulu — mengobati gejala tanpa sebab = sia-sia.")
    L.quiz("Pivot manual memakai…",
        ["JOIN", "SUM(CASE WHEN kategori=... THEN ... END) per kolom", "UNION", "LAG"],
        1, "Benar: conditional aggregation = pivot manual.")
    L.quiz("Unpivot (kolom → baris) memakai…",
        ["PIVOT", "UNION ALL per kolom", "JOIN", "CASE"],
        1, "Benar: kebalikan pivot.")
    L.quiz("LAG(...,1) pada data bulan berlubang menghasilkan…",
        ["Bulan kalender lalu", "&ldquo;Bulan data sebelumnya&rdquo; — bisa 2 bulan lalu!", "NULL", "Error"],
        1, "Benar: butuh date spine untuk kalender benar.")
    L.quiz("YTD (year-to-date) memakai…",
        ["SUM OVER ()", "Running total PARTITION BY tahun", "LAG 12", "NTILE"],
        1, "Benar: akumulasi yang reset tiap tahun.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Dedupe:</strong> ukur → ROW_NUMBER (PARTITION BY id, ORDER BY aturan menang) → rn=1.</li>"
        "<li><strong>Pivot:</strong> SUM(CASE WHEN ...) — baris jadi kolom; unpivot = UNION ALL.</li>"
        "<li><strong>YoY/MoM:</strong> LAG + (baru-lama)/lama; waspadai basis 0 &amp; lubang kalender.</li>"
        "<li><strong>YTD:</strong> running total PARTITION BY tahun.</li>"
        "<li>Tiga pola = Senin pagi yang tenang.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C11
def c11():
    L = Lesson("c11-cohort-retention-funnel", "C11 — SQL",
        "Cohort, Retention &amp; Funnel:<br/>Analisis Perilaku",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c10-dedupe-pivot-yoy", "← C10"), ("c12-recursive-cte", "Next: C12"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Membangun <strong>cohort retention</strong> (nasabah per bulan akuisisi × aktivitas).</li>"
        "<li>Menghitung <strong>funnel conversion</strong> antar tahap.</li>"
        "<li>Melakukan <strong>sessionization</strong> dan <strong>gaps &amp; islands</strong>.</li>"
        "<li>Menjelaskan kapan analisis perilaku ini dipakai di risk &amp; produk.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;Kenapa Nasabah Pergi?&rdquo;")
    L.raw('<div className="story"><p>CMO: <em>&ldquo;Akuisisi naik 30%, tapi transaksi total stagnan. Ke mana perginya nasabah baru?&rdquo;</em> Jawabannya ada di <strong>cohort retention</strong>: nasabah Januari — berapa % yang masih transaksi di Februari? Maret?</p>'
        "<p>Ternyata: 70% nasabah baru tidak pernah transaksi lagi setelah bulan pertama. Masalahnya bukan akuisisi — tapi <strong>aktivasi</strong>. Satu analisis cohort mengubah strategi marketing Rp 2 miliar. Lesson ini (60+ menit, case-heavy) mengajarkan analisis perilaku paling berdampak di industri.</p></div>")

    L.sec("cohort", "Cohort Retention — Kelompok per Akuisisi")
    L.p("<strong>Definisi.</strong> <strong>Cohort</strong> = kelompok berdasar <em>waktu akuisisi</em> (bulan daftar). <strong>Retention</strong> = % cohort yang masih aktif di periode ke-n.")
    L.raw(codebox("WITH cohort AS (\n  -- bulan transaksi pertama tiap nasabah = 'akuisisi'\n  SELECT nasabah_id, MIN(strftime('%Y-%m', tanggal)) AS bl_akuisisi\n  FROM transaksi GROUP BY 1\n),\naktif AS (\n  SELECT DISTINCT nasabah_id, strftime('%Y-%m', tanggal) AS bl\n  FROM transaksi\n)\nSELECT c.bl_akuisisi AS cohort,\n  COUNT(DISTINCT c.nasabah_id) AS n,\n  COUNT(DISTINCT CASE WHEN a.bl = c.bl_akuisisi THEN a.nasabah_id END) AS m0,\n  COUNT(DISTINCT CASE WHEN a.bl > c.bl_akuisisi THEN a.nasabah_id END) AS m_lanjut\nFROM cohort c LEFT JOIN aktif a ON a.nasabah_id = c.nasabah_id\nGROUP BY 1;", "sql"))
    L.ul([
        "<strong>Langkah:</strong> tentukan akuisisi (MIN tanggal) → gabung aktivitas → pivot per periode.",
        "<strong>Retention rate:</strong> aktif_periode_n / n_cohort.",
        "<strong>Di risk:</strong> cohort = vintage kredit! (C13) — perilaku bayar per angkatan.",
    ])
    L.raw(tip("Cohort table klasik: baris = cohort (2026-01, 2026-02...), kolom = M0, M1, M2... (% retained). Diagonal = waktu kalender sama — baca pola: apakah cohort baru lebih baik (produk membaik) atau lebih buruk?"))
    L.raw(myth("Retention = 1 - churn, jadi sama saja.",
        "Berhubungan tapi beda lensa: retention per cohort menjawab &ldquo;apakah produk makin baik untuk pengguna baru?&rdquo;; churn agregat tercemar komposisi (banyak pengguna baru = churn terlihat rendah!). Cohort = lensa yang jujur."))

    L.sec("funnel", "Funnel — Konversi Bertahap")
    L.p("Funnel = tahap berurutan (daftar → verifikasi → transaksi pertama → repeat). Tiap tahap menyaring:")
    L.raw(codebox("WITH tahap AS (\n  SELECT n.id,\n    1 AS daftar,\n    CASE WHEN n.status IS NOT NULL THEN 1 ELSE 0 END AS verifikasi,\n    CASE WHEN EXISTS (SELECT 1 FROM transaksi t WHERE t.nasabah_id = n.id) THEN 1 ELSE 0 END AS trx_1,\n    CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) >= 3 THEN 1 ELSE 0 END AS repeat\n  FROM nasabah n\n)\nSELECT\n  SUM(daftar) AS daftar,\n  SUM(verifikasi) AS verifikasi,\n  SUM(trx_1) AS trx_pertama,\n  SUM(repeat) AS repeat_3x,\n  SUM(trx_1) * 1.0 / SUM(daftar) AS conv_daftar_ke_trx\nFROM tahap;", "sql"))
    L.ul([
        "<strong>Conversion rate</strong> antar tahap = n_tahap_berikut / n_tahap_ini.",
        "<strong>Drop-off terbesar</strong> = prioritas perbaikan produk.",
        "<strong>Di fraud:</strong> funnel = pola serangan (C14) — tahap mana yang dieksploitasi?",
    ])
    L.raw(tip("Funnel + cohort = ampuh: &ldquo;apakah funnel membaik per cohort?&rdquo; Jika konversi daftar→trx naik tiap bulan, produk membaik. Satu query, dua dimensi insight."))

    L.sec("session", "Sessionization &amp; Gaps-and-Islands")
    L.p("<strong>Sessionization:</strong> kelompokkan event berurutan menjadi &ldquo;sesi&rdquo; jika jeda < X:")
    L.raw(codebox("-- tandai awal sesi: jeda > 30 menit dari event sebelumnya\nWITH e AS (\n  SELECT *,\n    CASE WHEN julianday(tanggal) - julianday(LAG(tanggal) OVER (\n      PARTITION BY nasabah_id ORDER BY tanggal)) > 30.0/1440\n      THEN 1 ELSE 0 END AS sesi_baru\n  FROM transaksi)\nSELECT *, SUM(sesi_baru) OVER (\n  PARTITION BY nasabah_id ORDER BY tanggal) AS id_sesi\nFROM e;", "sql"))
    L.p("<strong>Gaps-and-islands:</strong> temukan <em>rentang berurutan</em> (islands) vs <em>lubang</em> (gaps) — pola klasik:")
    L.raw(codebox("-- trik: tanggal - row_number = konstan untuk deret berurutan!\nWITH r AS (\n  SELECT tanggal,\n    date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days') AS grp\n  FROM (SELECT DISTINCT tanggal FROM transaksi))\nSELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari\nFROM r GROUP BY grp;", "sql"))
    L.ul([
        "<strong>Trik:</strong> untuk deret harian berurutan, <code className=\"inline\">tanggal - row_number</code> konstan → GROUP BY nilai itu = islands!",
        "<strong>Kapan:</strong> streak transaksi, hari aktif berurutan, deteksi pola velocity (C14).",
    ])
    L.raw(myth("Gaps-and-islands hanya teka-teki interview.",
        "Justru pola produksi: streak login (gamifikasi), <em>consecutive DPD</em> (kolektibilitas!), pola transaksi fraud beruntun. Interview menanyakannya <em>karena</em> dipakai di produksi."))

    L.chart(
        data=[{"x": ["M0", "M1", "M2"], "y": [100, 45, 30], "type": "bar", "name": "Cohort Jan",
               "marker": {"color": "#2a7de1"}},
              {"x": ["M0", "M1", "M2"], "y": [100, 60, 48], "type": "bar", "name": "Cohort Feb",
               "marker": {"color": "#34a853"}}],
        title="Cohort Retention (ilustrasi): % Aktif per Bulan",
        layout={"barmode": "group", "yaxis": {"title": "% retained"}, "showlegend": True},
        cara="Batang per cohort; sumbu X = bulan sejak akuisisi (M0 = bulan akuisisi).",
        interpretasi="Cohort Feb (hijau) retensi M1/M2 <strong>lebih baik</strong> dari Jan — produk/aktivasi membaik! Inilah kekuatan cohort: <em>tren kualitas</em>, bukan sekadar angka agregat. (Angka ilustrasi.)")

    L.chart(
        data=[{"x": ["Daftar", "Verifikasi", "Trx pertama", "Repeat 3×"], "y": [10, 8, 5, 2],
               "type": "bar", "marker": {"color": "#e8a838"},
               "text": ["10", "8 (80%)", "5 (63%)", "2 (40%)"], "textposition": "outside"}],
        title="Funnel: Daftar → Repeat (data lab)",
        layout={"xaxis": {"title": "Tahap"}, "yaxis": {"title": "Nasabah"}, "showlegend": False},
        cara="Tinggi batang = jumlah lolos tiap tahap; label = konversi dari tahap sebelumnya.",
        interpretasi="Drop-off terbesar: <strong>verifikasi → transaksi pertama</strong> (80% → 63%... tepatnya 5/8). Di sinilah intervensi (onboarding, promo) paling berdampak. Funnel mengubah &ldquo;konversi rendah&rdquo; menjadi <em>lokasi pasti</em> masalahnya.")

    L.sec("lab1", "🔬 Lab 1: Funnel Sederhana")
    L.lab("Lab 1 — Konversi Nasabah → Transaksi",
        "Hitung funnel: total nasabah → punya ≥1 transaksi → punya ≥3 transaksi. Tampilkan n &amp; % konversi tiap tahap.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS), ("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "WITH f AS (SELECT n.id, CASE WHEN EXISTS(SELECT 1 FROM transaksi t WHERE t.nasabah_id=n.id) THEN 1 ELSE 0 END AS t1, CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id=n.id)>=3 THEN 1 ELSE 0 END AS t3 FROM nasabah n) SELECT COUNT(*) AS daftar, SUM(t1) AS trx1, SUM(t3) AS trx3, SUM(t1)*1.0/COUNT(*) AS conv FROM f",
                "SELECT COUNT(DISTINCT nasabah_id) FROM transaksi"),
        "Tahap mana drop-off terbesar? Apa hipotesis penyebabnya?")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH f AS (\n  SELECT n.id,\n    CASE WHEN EXISTS (SELECT 1 FROM transaksi t WHERE t.nasabah_id = n.id) THEN 1 ELSE 0 END AS t1,\n    CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) >= 3 THEN 1 ELSE 0 END AS t3\n  FROM nasabah n\n)\nSELECT COUNT(*) AS daftar, SUM(t1) AS trx1, SUM(t3) AS trx3,\n       SUM(t1) * 1.0 / COUNT(*) AS conv_ke_trx\nFROM f;"))

    L.sec("lab2", "🔬 Lab 2: Gaps &amp; Islands")
    L.lab("Lab 2 — Rentang Tanggal Berurutan",
        "Temukan &ldquo;island&rdquo; tanggal transaksi berurutan (streak hari aktif) dengan trik tanggal − row_number.",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "WITH r AS (SELECT tanggal, date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days') AS grp FROM (SELECT DISTINCT tanggal FROM transaksi)) SELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari FROM r GROUP BY grp",
                "SELECT DISTINCT tanggal FROM transaksi ORDER BY tanggal"),
        "Streak terpanjang berapa hari? Di mana gap-nya?")
    L.raw(sql_answer("Jawaban Lab 2",
        "WITH r AS (\n  SELECT tanggal,\n    date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days') AS grp\n  FROM (SELECT DISTINCT tanggal FROM transaksi)\n)\nSELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari\nFROM r GROUP BY grp;"))

    L.sec("peta", "🗺️ Peta Keputusan: Analisis Perilaku")
    L.decision("1", "&ldquo;Apakah produk makin baik?&rdquo; → <strong>cohort retention</strong>",
        "Kualitas per angkatan.",
        kenapa="Bebas dari distorsi komposisi; diagonal = tren waktu.",
        contoh="Retensi M1 per cohort bulanan.")
    L.decision("2", "&ldquo;Di mana bocornya?&rdquo; → <strong>funnel</strong>",
        "Konversi bertahap.",
        kenapa="Drop-off terbesar = prioritas.",
        contoh="Daftar → verifikasi → trx.")
    L.decision("3", "&ldquo;Kelompokkan event berdekatan&rdquo; → <strong>sessionization</strong>",
        "Sesi.",
        kenapa="LAG + ambang jeda + running SUM.",
        contoh="Sesi transaksi 30 menit.")
    L.decision("4", "&ldquo;Streak/gap berurutan&rdquo; → <strong>gaps-and-islands</strong>",
        "Rentang.",
        kenapa="Trik tanggal − row_number.",
        contoh="Streak hari aktif, DPD beruntun.")
    L.decision("5", "Kombinasi → <strong>cohort × funnel</strong>",
        "Dua dimensi.",
        kenapa="Apakah funnel membaik per cohort?",
        contoh="Konversi per bulan akuisisi.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Cohort = kelompok berdasar <em>waktu akuisisi</em>, bukan waktu kalender.</li>"
        "<li>Funnel: ukur tiap tahap + konversi antar tahap.</li>"
        "<li>Gaps-and-islands: tanggal − row_number = konstan.</li>"
        "<li>Selalu gabung cohort × funnel untuk cerita lengkap.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Misteri Akuisisi Naik, Transaksi Stagnan (60+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Akuisisi +30% (dari kampanye), tapi total transaksi stagnan. CMO curiga &ldquo;nasabah baru tidak aktif&rdquo;.</p>"
        "<p><strong>Tugas (kerjakan!):</strong> (1) Buat cohort berdasar bulan transaksi pertama. (2) Hitung % yang transaksi lagi di bulan berikutnya (retensi M1). (3) Buat funnel daftar → trx pertama. (4) Tulis <strong>rekomendasi 3 kalimat</strong> untuk CMO: lanjutkan kampanye atau perbaiki aktivasi?</p>"
        "<p><strong>Data:</strong> tabel nasabah + transaksi lab (asumsikan tanggal daftar = transaksi pertama).</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Temuan (data lab):</strong> hanya 8 dari 10 nasabah pernah transaksi (funnel daftar→trx = 80%); dari yang transaksi, pola berulang rendah. Dengan data 1 bulan, cohort M1 tak terhitung — <strong>dan itu pelajarannya</strong>: analisis cohort butuh <em>rentang waktu</em> cukup!</p>"
        "<p><strong>Rekomendasi contoh:</strong> &ldquo;Kampanye berhasil di akuisisi (+30%) tapi funnel daftar→trx pertama hanya 80% dan repeat rendah. Alihkan 50% budget kampanye ke program aktivasi 7-hari pertama — akuisisi tanpa aktivasi = ember bocor.&rdquo;</p>"
        "<p><strong>Pelajaran:</strong> analisis perilaku mengubah debat opini (&ldquo;marketing gagal!&rdquo;) menjadi diagnosis presisi (&ldquo;bocor di aktivasi&rdquo;). Inilah nilai analyst.</p>")))

    L.quiz("Cohort didefinisikan berdasar…",
        ["Waktu kalender", "Waktu akuisisi (masuk)", "Nilai transaksi", "Kota"],
        1, "Benar: kelompok per angkatan masuk — untuk melihat kualitas per generasi.")
    L.quiz("Keunggulan cohort vs churn agregat…",
        ["Sama", "Cohort bebas distorsi komposisi — menunjukkan tren kualitas", "Cohort lebih cepat", "Churn tidak berguna"],
        1, "Benar: banyak pengguna baru menutupi churn buruk di angka agregat.")
    L.quiz("Funnel menjawab pertanyaan…",
        ["Siapa terbaik?", "&ldquo;Di tahap mana bocornya?&rdquo;", "Berapa total?", "Kapan puncak?"],
        1, "Benar: drop-off terbesar = prioritas perbaikan.")
    L.quiz("Trik gaps-and-islands untuk deret harian…",
        ["tanggal + row_number", "tanggal − row_number = konstan per island", "LAG 7 hari", "NTILE"],
        1, "Benar: deret berurutan → selisih konstan → GROUP BY.")
    L.quiz("Sessionization memakai…",
        ["GROUP BY saja", "LAG untuk jeda + ambang + running SUM sebagai id sesi", "UNION", "PIVOT"],
        1, "Benar: deteksi awal sesi dari jeda, lalu nomor sesi kumulatif.")
    L.quiz("Cohort di credit risk setara dengan…",
        ["DPD", "Vintage (angkatan kredit) — C13!", "NPL", "LGD"],
        1, "Benar: vintage = cohort-nya kredit. Analisis yang sama, domain berbeda.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Cohort retention:</strong> % aktif per periode sejak akuisisi — lensa kualitas yang jujur.</li>"
        "<li><strong>Funnel:</strong> konversi bertahap — temukan di mana bocornya.</li>"
        "<li><strong>Sessionization:</strong> LAG + ambang jeda + running SUM.</li>"
        "<li><strong>Gaps-and-islands:</strong> tanggal − row_number = konstan.</li>"
        "<li><strong>Kombinasi</strong> cohort × funnel = diagnosis perilaku lengkap.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C12
def c12():
    L = Lesson("c12-recursive-cte", "C12 — SQL",
        "Recursive CTE Mendalam:<br/>Hierarki, Graf &amp; Jalan",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c11-cohort-retention-funnel", "← C11"), ("c13-risiko-dpd-rollrate", "Next: C13"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menulis <strong>recursive CTE</strong> lengkap: anchor, rekursi, terminasi.</li>"
        "<li>Menjelajahi <strong>hierarki</strong> (org chart, kategori) dengan level &amp; path.</li>"
        "<li>Menelusuri <strong>graf</strong> (jaringan transfer = pola fraud/AML!).</li>"
        "<li>Menghindari <strong>rekursi tak berujung</strong> (cycle).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Jaringan Rekening Mencurigakan")
    L.raw('<div className="story"><p>Tim fraud menemukan: rekening A transfer ke B, B ke C, C ke D... <strong>rantai 8 rekening</strong> yang semuanya baru dibuka minggu ini — pola <em>money mule</em> klasik. Query biasa tidak bisa &ldquo;mengikuti rantai&rdquo; — panjangnya tidak diketahui!</p>'
        "<p>Recursive CTE mengikuti rantai <strong>sepanjang apapun</strong>: dari A, temukan semua yang terjangkau. Ini jembatan ke analisis jaringan (C14, fraud) — dan satu-satunya cara SQL murni menelusuri hierarki/graf.</p></div>")

    L.sec("anatomi", "Anatomi Recursive CTE")
    L.raw(codebox("WITH RECURSIVE rantai AS (\n  -- ANCHOR: titik awal\n  SELECT pengirim AS node, penerima AS next, 1 AS kedalaman\n  FROM transfer WHERE pengirim = 'A'\n  UNION ALL\n  -- REKURSI: perluas dari hasil sebelumnya\n  SELECT r.next, t.penerima, r.kedalaman + 1\n  FROM rantai r\n  JOIN transfer t ON t.pengirim = r.next\n  WHERE r.kedalaman < 10  -- TERMINASI: batas!\n)\nSELECT * FROM rantai;", "sql"))
    L.ul([
        "<strong>Anchor:</strong> SELECT awal (tanpa merujuk CTE).",
        "<strong>Rekursi:</strong> SELECT yang merujuk CTE + <code className=\"inline\">UNION ALL</code>.",
        "<strong>Terminasi:</strong> kondisi berhenti (kedalaman max / tidak ada baris baru).",
        "Eksekusi: anchor → hasilnya diumpankan ke rekursi → berulang hingga kosong.",
    ])
    L.raw(myth("UNION vs UNION ALL sama saja di recursive CTE.",
        "Beda penting! UNION (dedup) mencegah <strong>cycle tak berujung</strong> (A→B→A→B...) tapi lebih lambat; UNION ALL cepat tapi butuh guard kedalaman. Untuk graf yang mungkin ber-cycle, <strong>UNION atau path-tracking</strong> wajib."))
    L.raw(tip("Selalu tambahkan <strong>batas kedalaman</strong> (<code className=\"inline\">WHERE kedalaman < N</code>) bahkan jika yakin tak ada cycle — pertahanan berlapis. Query yang hang di produksi = insiden."))

    L.sec("hierarki", "Hierarki — Level &amp; Path")
    L.raw(codebox("-- tabel: karyawan(id, nama, atasan_id)\nWITH RECURSIVE hier AS (\n  SELECT id, nama, atasan_id, 0 AS level,\n         nama AS path\n  FROM karyawan WHERE atasan_id IS NULL  -- puncak\n  UNION ALL\n  SELECT k.id, k.nama, k.atasan_id, h.level + 1,\n         h.path || ' > ' || k.nama\n  FROM hier h JOIN karyawan k ON k.atasan_id = h.id\n)\nSELECT id, nama, level, path FROM hier;", "sql"))
    L.ul([
        "<strong>level:</strong> kedalaman (0 = puncak) — untuk indentasi/laporan.",
        "<strong>path:</strong> rantai nama (materialized path) — untuk tampil &amp; filter subtree.",
        "<strong>Kapan:</strong> org chart, kategori produk bertingkat, bill of materials.",
    ])
    L.raw(tip("Butuh &ldquo;semua bawahan X&rdquo;? Anchor = X, bukan puncak. Butuh &ldquo;semua atasan Y&rdquo;? Balik arah JOIN (naik, bukan turun). Recursive CTE dua arah."))

    L.sec("graf", "Graf — Jaringan Transfer (Jembatan ke Fraud)")
    L.raw(codebox("-- semua rekening terjangkau dari 'A' (komponen terhubung)\nWITH RECURSIVE jangkau(node, kedalaman, path) AS (\n  SELECT 'A', 0, 'A'\n  UNION\n  SELECT t.penerima, j.kedalaman + 1, j.path || '->' || t.penerima\n  FROM jangkau j JOIN transfer t ON t.pengirim = j.node\n  WHERE j.kedalaman < 6\n    AND instr(j.path, t.penerima) = 0  -- hindari cycle!\n)\nSELECT * FROM jangkau;", "sql"))
    L.ul([
        "<strong>Path tracking:</strong> <code className=\"inline\">instr(path, node) = 0</code> mencegah kunjungan ulang (cycle).",
        "<strong>UNION</strong> (bukan ALL) sebagai pengaman kedua.",
        "<strong>Di fraud (C14):</strong> pola ini menemukan jaringan mule, fan-in/fan-out, cycle transfer.",
    ])
    L.raw(myth("Analisis jaringan harus pakai Python/Neo4j.",
        "Untuk eksplorasi awal dan pola sederhana, recursive CTE cukup — dan datanya tidak perlu keluar database. Pindah ke graph DB/Python saat butuh algoritma berat (PageRank, community detection)."))

    L.chart(
        data=[{"x": ["A", "B", "C", "D", "E"], "y": [0, 1, 2, 3, 4], "type": "bar",
               "marker": {"color": "#ef4444"},
               "text": ["anchor", "depth 1", "depth 2", "depth 3", "depth 4"], "textposition": "outside"}],
        title="Penelusuran Rantai: Kedalaman per Node (ilustrasi)",
        layout={"xaxis": {"title": "Rekening"}, "yaxis": {"title": "Kedalaman dari A"}, "showlegend": False},
        cara="Tinggi = langkah dari anchor A mengikuti arah transfer.",
        interpretasi="Rantai lurus 4 langkah, semua rekening baru — <strong>skor kecurigaan tinggi</strong>. Recursive CTE mengubah &ldquo;ikuti uangnya&rdquo; dari intuisi menjadi query. (C14 mendalami pola fraud-nya.)")

    L.sec("lab1", "🔬 Lab 1: Hierarki Karyawan")
    L.lab("Lab 1 — Org Chart dengan Level &amp; Path",
        "Tabel karyawan (id, nama, atasan_id) tersedia. Tampilkan hierarki lengkap dengan level &amp; path.",
        lab_sql([("karyawan", "CREATE TABLE karyawan (id INTEGER PRIMARY KEY, nama TEXT, atasan_id INTEGER)", [(1, "Rina", None), (2, "Budi", 1), (3, "Sari", 1), (4, "Agus", 2), (5, "Dewi", 2), (6, "Joko", 3)])],
                                "WITH RECURSIVE hier AS (SELECT id, nama, 0 AS level, nama AS path FROM karyawan WHERE atasan_id IS NULL UNION ALL SELECT k.id, k.nama, h.level+1, h.path||' > '||k.nama FROM hier h JOIN karyawan k ON k.atasan_id=h.id) SELECT * FROM hier",
                "SELECT * FROM karyawan"),
        "Ubah anchor: tampilkan hanya subtree Budi (id=2).")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH RECURSIVE hier AS (\n  SELECT id, nama, 0 AS level, nama AS path\n  FROM karyawan WHERE atasan_id IS NULL\n  UNION ALL\n  SELECT k.id, k.nama, h.level + 1, h.path || ' > ' || k.nama\n  FROM hier h JOIN karyawan k ON k.atasan_id = h.id\n)\nSELECT * FROM hier;\n-- subtree Budi: ganti anchor WHERE id = 2"))

    L.sec("lab2", "🔬 Lab 2: Ikuti Rantai Transfer")
    L.lab("Lab 2 — Jangkauan dari Rekening A",
        "Tabel transfer(pengirim, penerima, jumlah). Dari 'A', temukan semua rekening terjangkau + kedalamannya. Waspadai cycle!",
        lab_sql([("transfer", "CREATE TABLE transfer (pengirim TEXT, penerima TEXT, jumlah REAL)", [("A", "B", 5000000), ("B", "C", 4900000), ("C", "D", 4800000), ("D", "B", 100000), ("A", "E", 2000000)])],
                                "WITH RECURSIVE j(node, d, path) AS (SELECT 'A', 0, 'A' UNION SELECT t.penerima, j.d+1, j.path||'->'||t.penerima FROM j JOIN transfer t ON t.pengirim=j.node WHERE j.d<6 AND instr(j.path, t.penerima)=0) SELECT * FROM j",
                "SELECT * FROM transfer"),
        "Perhatikan: D→B adalah cycle. Apa yang terjadi tanpa guard instr()?")
    L.raw(sql_answer("Jawaban Lab 2",
        "WITH RECURSIVE j(node, d, path) AS (\n  SELECT 'A', 0, 'A'\n  UNION\n  SELECT t.penerima, j.d + 1, j.path || '->' || t.penerima\n  FROM j JOIN transfer t ON t.pengirim = j.node\n  WHERE j.d < 6 AND instr(j.path, t.penerima) = 0\n)\nSELECT * FROM j;\n-- tanpa guard: B->C->D->B->C... tak berujung (UNION saja tidak cukup jika path beda)!"))

    L.sec("peta", "🗺️ Peta Keputusan: Rekursi")
    L.decision("1", "Hierarki turun (bawahan) → <strong>anchor puncak, JOIN anak</strong>",
        "Org chart.",
        kenapa="Level + path untuk tampil.",
        contoh="Semua bawahan direktur.")
    L.decision("2", "Hierarki naik (atasan) → <strong>anchor node, JOIN induk</strong>",
        "Rantai komando.",
        kenapa="Balik arah JOIN.",
        contoh="Atasan-atasan Budi.")
    L.decision("3", "Jaringan/graf → <strong>path tracking + batas</strong>",
        "Fraud/AML.",
        kenapa="Cegah cycle; UNION sebagai pengaman.",
        contoh="Jangkauan dari rekening A.")
    L.decision("4", "Deret (tanggal/angka) → <strong>anchor + increment</strong>",
        "Spine.",
        kenapa="Kondisi berhenti eksplisit.",
        contoh="Date spine (C7).")
    L.decision("5", "Ragu ada cycle → <strong>UNION + guard kedalaman</strong>",
        "Aman.",
        kenapa="Pertahanan berlapis.",
        contoh="Selalu, di produksi.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Anchor + rekursi + <strong>terminasi</strong> — tiga wajib.</li>"
        "<li>Batas kedalaman selalu, bahkan jika yakin aman.</li>"
        "<li>Graf: path tracking anti-cycle.</li>"
        "<li>Untuk algoritma graf berat → pindah ke Python/graph DB.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Skor Kecurigaan Rantai")
    L.raw(callout("<p>Tim fraud ingin <strong>skor</strong> tiap rantai dari A: +1 per langkah, +2 jika penerima < 30 hari (rekening baru — butuh JOIN ke nasabah!), −1 jika jumlah menyusut &gt; 50% (biaya normal?).</p>"
        "<p><strong>Pertanyaan:</strong> rancang query-nya (boleh pseudo-SQL). Komponen apa saja yang digabung?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Komponen:</strong> (1) recursive CTE untuk rantai + kedalaman + path; (2) JOIN ke nasabah untuk umur rekening; (3) CASE untuk skor per langkah; (4) agregat SUM skor per rantai; (5) ambang (HAVING skor &gt; X) untuk alert.</p>"
        "<p><strong>Pelajaran:</strong> recursive CTE = <em>mesin penjelajah</em>; logika bisnis (skor) = CASE + agregat di atasnya. Pisahkan &ldquo;jelajah&rdquo; dari &ldquo;nilai&rdquo; — query tetap terbaca. Pola lengkapnya di C14.</p>")))

    L.quiz("Tiga bagian recursive CTE…",
        ["SELECT, WHERE, ORDER BY", "Anchor, rekursi (UNION ALL), terminasi", "JOIN, GROUP BY, HAVING", "WITH, CASE, LIMIT"],
        1, "Benar: titik awal, perluasan, kondisi berhenti.")
    L.quiz("Tanpa kondisi berhenti…",
        ["Error langsung", "Berisiko rekursi tak berujung / hang", "Hasil kosong", "Otomatis berhenti di 100"],
        1, "Benar: selalu pasang batas kedalaman.")
    L.quiz("Mencegah cycle A→B→A→B…",
        ["ORDER BY", "Path tracking (instr) + UNION", "LIMIT", "DISTINCT"],
        1, "Benar: lacak path yang dikunjungi, tolak yang sudah ada.")
    L.quiz("Semua bawahan Budi (id=2)…",
        ["Anchor = puncak", "Anchor = Budi (id=2), JOIN ke bawah", "Tidak bisa", "Pakai LAG"],
        1, "Benar: anchor menentukan subtree.")
    L.quiz("UNION vs UNION ALL di recursive CTE graf…",
        ["Sama", "UNION dedup (cegah cycle, lambat); ALL cepat tapi butuh guard", "ALL cegah cycle", "UNION error"],
        1, "Benar: pilih berdasar butuh kecepatan vs keamanan.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Anatomi:</strong> anchor + rekursi + terminasi.</li>"
        "<li><strong>Hierarki:</strong> level &amp; path; anchor bisa puncak/node (dua arah).</li>"
        "<li><strong>Graf:</strong> path tracking anti-cycle — fondasi analisis jaringan fraud.</li>"
        "<li><strong>Aman:</strong> batas kedalaman selalu; UNION untuk graf ber-cycle.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C13
def c13():
    L = Lesson("c13-risiko-dpd-rollrate", "C13 — SQL Risk",
        "DPD, Roll Rate &amp; Vintage:<br/>Bahasa Risiko Kredit",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c12-recursive-cte", "← C12"), ("c14-fraud-velocity", "Next: C14"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menghitung <strong>DPD bucket</strong> dan <strong>roll rate</strong> antar bucket.</li>"
        "<li>Membangun <strong>vintage analysis</strong> (cohort-nya kredit!).</li>"
        "<li>Menghitung <strong>NPL ratio</strong> sesuai definisi regulator.</li>"
        "<li>Menjelaskan bagaimana metrik ini dipakai di <strong>credit risk</strong> (track CR).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: &ldquo;NPL Naik 0,5% — Kenapa?&rdquo;")
    L.raw('<div className="story"><p>Laporan bulanan: NPL naik dari 2,1% ke 2,6%. Direksi bertanya <em>kenapa</em> — dan angka agregat tidak bisa menjawab. Apakah vintage 2025 yang buruk? Apakah kolektibilitas 2 bergeser ke 3 (roll rate memburuk)? Atau satu debitur besar macet?</p>'
        "<p>Tiga alat diagnosis — <strong>DPD bucket, roll rate, vintage</strong> — membedah NPL menjadi <em>di mana</em> masalahnya. Ini SQL yang langsung dipakai di credit risk (track CR1/CR2). Lesson case-heavy (60+ menit).</p></div>")

    L.sec("dpd", "DPD Bucket — Bahasa Kolektibilitas")
    L.p("<strong>DPD</strong> (Days Past Due) = hari keterlambatan bayar. <strong>Bucket</strong> standar Indonesia:")
    L.table(["Bucket", "DPD", "Kolektibilitas", "Arti"],
        [["Current", "0", "1 (Lancar)", "Bayar tepat"],
         ["1–30", "1–30", "2 (DPK)", "Terlambat ringan"],
         ["31–60", "31–60", "3 (Kurang lancar)", "Mulai bermasalah"],
         ["61–90", "61–90", "4 (Diragukan)", "Serius"],
         ["90+", "> 90", "5 (Macet)", "NPL!"]])
    L.raw(codebox("SELECT\n  CASE WHEN dpd = 0 THEN 'current'\n       WHEN dpd BETWEEN 1 AND 30 THEN '1-30'\n       WHEN dpd BETWEEN 31 AND 60 THEN '31-60'\n       WHEN dpd BETWEEN 61 AND 90 THEN '61-90'\n       ELSE '90+' END AS bucket,\n  COUNT(*) AS n,\n  SUM(plafon) AS exposure\nFROM kredit\nGROUP BY 1;", "sql"))
    L.p("<strong>NPL</strong> = kolektibilitas 3–5 (atau DPD > 90, tergantung definisi — <strong>samakan definisi dulu!</strong>):")
    L.raw(codebox("SELECT SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END)\n         * 1.0 / SUM(plafon) AS npl_ratio\nFROM kredit;", "sql"))
    L.raw(tip("Selalu dokumentasikan definisi NPL di query (komentar!): &ldquo;-- NPL = kol 3-5 per SE OJK&rdquo;. Definisi beda = angka beda = rapat yang panas."))
    L.raw(myth("NPL naik = penyaluran buruk.",
        "Belum tentu! NPL ratio = pembilang/pernyebut — bisa naik karena <em>penyebut menyusut</em> (penyaluran turun) sementara pembilang tetap. Selalu tampilkan <strong>nominal + ratio</strong> berdampingan (pelajaran C10: % tanpa basis = manipulasi)."))

    L.sec("rollrate", "Roll Rate — Probabilitas Memburuk")
    L.p("<strong>Definisi.</strong> <strong>Roll rate</strong> = % saldo di bucket X bulan ini yang <em>pindah ke bucket lebih buruk</em> bulan depan. Ini <strong>PD empiris</strong> antar bucket!")
    L.raw(codebox("WITH b AS (\n  SELECT nasabah_id,\n    CASE WHEN dpd BETWEEN 1 AND 30 THEN '1-30'\n         WHEN dpd BETWEEN 31 AND 60 THEN '31-60' ELSE 'lain' END AS bucket_ini,\n    -- simulasi bulan depan: dpd + 30 (asumsi tak bayar)\n    CASE WHEN dpd + 30 BETWEEN 31 AND 60 THEN '31-60'\n         WHEN dpd + 30 BETWEEN 61 AND 90 THEN '61-90' ELSE 'lain' END AS bucket_depan\n  FROM kredit)\nSELECT bucket_ini,\n  COUNT(*) AS n,\n  SUM(CASE WHEN bucket_depan <> bucket_ini THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS roll_rate\nFROM b WHERE bucket_ini <> 'lain'\nGROUP BY 1;", "sql"))
    L.ul([
        "<strong>Roll rate matrix</strong> (bucket_ini × bucket_depan) = <strong>matriks transisi Markov</strong> (B14!) — jembatan ke modeling.",
        "<strong>Kapan:</strong> provisioning (CKPN!), stress test, prediksi NPL.",
        "<strong>Asumsi lab disederhanakan;</strong> produksi: butuh snapshot bulanan (SCD-2!).",
    ])
    L.raw(tip("Roll rate adalah <strong>jembatan SQL → modeling</strong>: angka yang kamu hitung di sini menjadi input matriks transisi di B14 dan PD di track CR. SQL bukan sekadar &ldquo;ambil data&rdquo; — ia menghitung parameter model!"))

    L.sec("vintage", "Vintage — Cohort-nya Kredit")
    L.p("<strong>Vintage</strong> = cohort berdasar <em>bulan pencairan</em> (origination). Analisis: bagaimana kualitas tiap angkatan seiring umur (MOB = month on book)?")
    L.raw(codebox("-- NPL per vintage (angkatan)\nSELECT strftime('%Y-%m', '2026-01-01') AS vintage,  -- bulan cair (simulasi)\n  COUNT(*) AS n,\n  AVG(CASE WHEN kolektibilitas >= 3 THEN 1.0 ELSE 0 END) AS npl_rate\nFROM kredit\nGROUP BY 1;", "sql"))
    L.ul([
        "<strong>Kurva vintage:</strong> X = MOB (umur), Y = NPL%, garis per vintage — pola &ldquo;naik lalu stabil&rdquo; normal; yang <em>lebih tinggi dari kakaknya</em> = underwriting memburuk!",
        "<strong>Diagnosis NPL naik:</strong> vintage baru buruk? → masalah underwriting. Vintage lama memburuk? → masalah collection/ekonomi.",
        "<strong>Butuh:</strong> tanggal pencairan + snapshot DPD per bulan (data historis!).",
    ])
    L.raw(myth("Vintage buruk = langsung ketahuan.",
        "Tidak — kredit butuh <em>seasoning</em> (12–24 bulan) sebelum pola default terlihat. Vintage 6 bulan yang &ldquo;bersih&rdquo; belum tentu baik; ia belum matang. Jangan nilai bayi dari ujian akhir!"))

    L.chart(
        data=[{"x": ["current", "1-30", "31-60", "61-90", "90+"], "y": [5, 2, 2, 1, 2], "type": "bar",
               "marker": {"color": ["#34a853", "#e8a838", "#f59e0b", "#f97316", "#ef4444"]},
               "text": ["5", "2", "2", "1", "2"], "textposition": "outside"}],
        title="Distribusi Bucket DPD (data lab kredit)",
        layout={"xaxis": {"title": "Bucket"}, "yaxis": {"title": "Jumlah kredit"}, "showlegend": False},
        cara="Tinggi = jumlah kredit per bucket DPD.",
        interpretasi="Bentuk &ldquo;menurun&rdquo; normal (makin parah makin sedikit). <strong>Waspada pola &ldquo;menumpuk di 1–30&rdquo;</strong> = evergreening (bayar minimum agar tak roll)? Atau &ldquo;lubang di 31–60&rdquo; = write-off agresif? Bentuk distribusi bercerita.")

    L.chart(
        data=[{"x": ["MOB 3", "MOB 6", "MOB 12", "MOB 18"], "y": [0.5, 1.2, 2.1, 2.3], "type": "scatter",
               "mode": "lines+markers", "name": "Vintage Jan-25", "line": {"color": "#2a7de1", "width": 3}},
              {"x": ["MOB 3", "MOB 6", "MOB 12", "MOB 18"], "y": [0.8, 2.0, 3.5, 4.1], "type": "scatter",
               "mode": "lines+markers", "name": "Vintage Jul-25", "line": {"color": "#ef4444", "width": 3}}],
        title="Kurva Vintage: NPL% per MOB (ilustrasi)",
        layout={"xaxis": {"title": "Month on Book"}, "yaxis": {"title": "NPL %"}, "showlegend": True},
        cara="X = umur kredit; Y = NPL%; garis = angkatan pencairan.",
        interpretasi="Vintage Jul-25 (merah) <strong>konsisten di atas</strong> Jan-25 — underwriting memburuk di tengah tahun! Diagnosis presisi: bukan ekonomi (semua vintage kena?) tapi <em>angkatan</em> tertentu. (Angka ilustrasi.)")

    L.sec("lab1", "🔬 Lab 1: Bucket &amp; NPL")
    L.lab("Lab 1 — NPL Ratio",
        "Hitung: distribusi bucket (n + exposure) dan NPL ratio (kolektibilitas ≥ 3, berdasar plafon). Tampilkan nominal + ratio!",
        lab_sql([("kredit", KREDIT_DDL, KREDIT_ROWS)],
                "SELECT SUM(CASE WHEN kolektibilitas>=3 THEN plafon ELSE 0 END)*1.0/SUM(plafon) AS npl_ratio, SUM(CASE WHEN kolektibilitas>=3 THEN plafon ELSE 0 END) AS npl_nominal, SUM(plafon) AS total FROM kredit",
                "SELECT kolektibilitas, COUNT(*), SUM(plafon) FROM kredit GROUP BY kolektibilitas"),
        "Bandingkan NPL berdasar plafon vs berdasar count. Kenapa beda? Mana yang dipakai regulator?")
    L.raw(sql_answer("Jawaban Lab 1",
        "SELECT\n  SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) AS npl_nominal,\n  SUM(plafon) AS total_plafon,\n  SUM(CASE WHEN kolektibilitas >= 3 THEN plafon ELSE 0 END) * 1.0 / SUM(plafon) AS npl_ratio\nFROM kredit;\n-- regulator: berdasar baki debet (nominal), bukan count!"))

    L.sec("lab2", "🔬 Lab 2: Roll Rate Sederhana")
    L.lab("Lab 2 — Simulasi Roll Rate",
        "Asumsikan bulan depan tiap dpd +30 (tak ada yang bayar). Hitung roll rate dari bucket '1-30' ke '31-60'.",
        lab_sql([("kredit", KREDIT_DDL, KREDIT_ROWS)],
                "WITH b AS (SELECT CASE WHEN dpd BETWEEN 1 AND 30 THEN '1-30' WHEN dpd BETWEEN 31 AND 60 THEN '31-60' ELSE 'lain' END AS ini, CASE WHEN dpd+30 BETWEEN 31 AND 60 THEN '31-60' WHEN dpd+30 BETWEEN 61 AND 90 THEN '61-90' ELSE 'lain' END AS depan FROM kredit) SELECT ini, COUNT(*), SUM(CASE WHEN depan<>ini THEN 1 ELSE 0 END)*1.0/COUNT(*) FROM b WHERE ini<>'lain' GROUP BY ini",
                "SELECT dpd, dpd+30 AS dpd_depan FROM kredit"),
        "Ini simulasi kasar. Data apa yang dibutuhkan untuk roll rate BENAR? (Snapshot bulanan!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- roll rate butuh snapshot 2 bulan; ini simulasi dengan asumsi:\nWITH b AS (\n  SELECT\n    CASE WHEN dpd BETWEEN 1 AND 30 THEN '1-30'\n         WHEN dpd BETWEEN 31 AND 60 THEN '31-60' ELSE 'lain' END AS ini,\n    CASE WHEN dpd+30 BETWEEN 31 AND 60 THEN '31-60'\n         WHEN dpd+30 BETWEEN 61 AND 90 THEN '61-90' ELSE 'lain' END AS depan\n  FROM kredit)\nSELECT ini, COUNT(*) AS n,\n  SUM(CASE WHEN depan <> ini THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS roll_rate\nFROM b WHERE ini <> 'lain' GROUP BY ini;"))

    L.sec("peta", "🗺️ Peta Keputusan: Metrik Risiko")
    L.decision("1", "&ldquo;Seberapa parah tunggakan?&rdquo; → <strong>DPD bucket</strong>",
        "Distribusi.",
        kenapa="CASE bucket + COUNT/SUM. Bahasa kolektibilitas.",
        contoh="Exposure per bucket.")
    L.decision("2", "&ldquo;Berapa NPL?&rdquo; → <strong>NPL ratio</strong>",
        "Rasio.",
        kenapa="Definisi disepakati + nominal berdampingan.",
        contoh="NPL = kol 3–5 / total baki debet.")
    L.decision("3", "&ldquo;Seberapa cepat memburuk?&rdquo; → <strong>roll rate</strong>",
        "Transisi.",
        kenapa="Butuh snapshot 2 periode; = PD empiris.",
        contoh="1-30 → 31-60 = 25%.")
    L.decision("4", "&ldquo;Angkatan mana bermasalah?&rdquo; → <strong>vintage</strong>",
        "Cohort kredit.",
        kenapa="NPL% per MOB per angkatan cair.",
        contoh="Vintage Jul-25 lebih buruk.")
    L.decision("5", "Diagnosis NPL naik → <strong>bedah tiga dimensi</strong>",
        "Diagnosis.",
        kenapa="Bucket (di mana) + roll (seberapa cepat) + vintage (angkatan mana).",
        contoh="Laporan direksi.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Samakan <strong>definisi</strong> NPL dulu (komentar di query!).</li>"
        "<li>Selalu <strong>nominal + ratio</strong> berdampingan.</li>"
        "<li>Roll rate butuh <strong>snapshot historis</strong> — tanpa itu hanya simulasi.</li>"
        "<li>Vintage butuh <strong>seasoning</strong> — jangan nilai terlalu dini.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Diagnosis NPL Naik (60+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> NPL 2,1% → 2,6% dalam 3 bulan. Kamu punya tabel kredit (snapshot bulan ini) + tabel histori vintage (ilustrasi).</p>"
        "<p><strong>Tugas:</strong> (1) Hitung NPL nominal + ratio. (2) Distribusi bucket — di mana penumpukan? (3) Jika vintage Jul-25 NPL-nya 2× vintage Jan-25, apa diagnosis &amp; rekomendasi? (4) Tulis <strong>memo 5 kalimat</strong> untuk direksi.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>Diagnosis contoh:</strong> &ldquo;Kenaikan NPL terkonsentrasi di bucket 31–60 vintage Jul–Sep 25 (roll rate 1–30→31–60 naik 18%→27%). Vintage lama stabil — masalah <strong>underwriting</strong>, bukan collection/ekonomi. Satu debitur besar (plafon 200jt) menyumbang 0,2pp — sisanya granular.&rdquo;</p>"
        "<p><strong>Rekomendasi:</strong> (1) hold penyaluran segmen vintage bermasalah sambil review scoring; (2) intensifkan collection bucket 1–30 (cagah roll); (3) monitor vintage baru mingguan.</p>"
        "<p><strong>Pelajaran:</strong> angka agregat bertanya &ldquo;berapa&rdquo;; bedah bucket/roll/vintage menjawab &ldquo;kenapa&rdquo; dan &ldquo;apa yang dilakukan&rdquo;. Itulah analyst → advisor.</p>")))

    L.quiz("NPL ratio naik. Yang harus dicek dulu…",
        ["Langsung salahkan marketing", "Nominal + definisi + komponen (bucket/vintage)", "Hapus data lama", "Ganti definisi"],
        1, "Benar: ratio = pembilang/pernyebut — bedah dulu sebelum simpulkan.")
    L.quiz("Roll rate 1–30 → 31–60 = 25% artinya…",
        ["25% sudah bayar", "25% saldo bucket 1–30 memburuk ke 31–60", "NPL 25%", "DPD rata-rata 25"],
        1, "Benar: probabilitas transisi = PD empiris antar bucket.")
    L.quiz("Vintage Jul-25 konsisten lebih buruk dari Jan-25. Diagnosis…",
        ["Ekonomi memburuk", "Underwriting angkatan Jul-25 bermasalah", "Collection malas", "Data salah"],
        1, "Benar: pola per angkatan = masalah origination, bukan sistemik.")
    L.quiz("Roll rate yang BENAR butuh…",
        ["Satu snapshot", "Snapshot 2 periode (bulan ini vs bulan lalu)", "Rata-rata", "Estimasi"],
        1, "Benar: transisi butuh dua titik waktu (SCD-2).")
    L.quiz("Vintage 3 bulan yang &ldquo;bersih&rdquo;…",
        ["Pasti baik", "Belum tentu — butuh seasoning 12–24 bulan", "Harus di-write-off", "Tidak bisa dianalisis"],
        1, "Benar: pola default butuh waktu matang.")
    L.quiz("NPL regulator dihitung berdasar…",
        ["Jumlah debitur", "Baki debet (nominal)", "Jumlah kredit", "Rata-rata"],
        1, "Benar: nominal — satu debitur besar mengubah segalanya.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>DPD bucket:</strong> bahasa kolektibilitas; CASE + agregat.</li>"
        "<li><strong>NPL ratio:</strong> samakan definisi; nominal + ratio berdampingan.</li>"
        "<li><strong>Roll rate:</strong> % memburuk antar bucket = PD empiris = matriks transisi (B14).</li>"
        "<li><strong>Vintage:</strong> cohort kredit — diagnosis underwriting vs collection vs ekonomi.</li>"
        "<li>Bedah tiga dimensi = dari &ldquo;berapa&rdquo; ke &ldquo;kenapa&rdquo; ke &ldquo;apa yang dilakukan&rdquo;.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C14
def c14():
    L = Lesson("c14-fraud-velocity", "C14 — SQL Fraud",
        "Velocity &amp; Impossible Travel:<br/>Menangkap Fraud dengan SQL",
        "60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c13-risiko-dpd-rollrate", "← C13"), ("c15-data-quality", "Next: C15"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menghitung <strong>velocity checks</strong> (count/amount per jendela waktu).</li>"
        "<li>Mendeteksi <strong>impossible travel</strong> (jarak vs waktu).</li>"
        "<li>Menulis <strong>rule-based alert</strong> dengan CASE + ambang.</li>"
        "<li>Menjelaskan <strong>trade-off false positive</strong> dalam rule fraud.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Rp 47 Juta dalam 11 Menit")
    L.raw('<div className="story"><p>Senin pagi, tim fraud melihat alert: satu kartu melakukan <strong>14 transaksi dalam 11 menit</strong> di 3 kota berbeda — total Rp 47 juta. Pemilik kartu sedang tidur di Jakarta. Kartu dikloning.</p>'
        "<p>Velocity check (banyak transaksi dalam waktu singkat) + impossible travel (3 kota dalam 11 menit) = dua pola yang menangkapnya — <strong>keduanya murni SQL</strong>. Lesson case-heavy ini mengajarkan pola deteksi fraud paling fundamental, jembatan ke track Fraud/AML.</p></div>")

    L.sec("velocity", "Velocity Checks — Kecepatan Transaksi")
    L.p("<strong>Definisi.</strong> <strong>Velocity</strong> = jumlah/nilai transaksi dalam <strong>jendela waktu</strong> (10 menit, 1 jam, 24 jam). Fraud = velocity abnormal.")
    L.raw(codebox("-- transaksi per 1 jam terakhir per kartu (self-join jendela)\nSELECT t1.id, t1.nasabah_id, t1.tanggal,\n  COUNT(t2.id) AS n_1jam,\n  SUM(t2.jumlah) AS amt_1jam\nFROM transaksi t1\nJOIN transaksi t2\n  ON t2.nasabah_id = t1.nasabah_id\n AND t2.tanggal BETWEEN datetime(t1.tanggal, '-1 hour') AND t1.tanggal\nGROUP BY t1.id\nHAVING COUNT(t2.id) >= 3;  -- ambang: >=3 trx/jam", "sql"))
    L.ul([
        "<strong>Self-join jendela:</strong> tiap transaksi dibandingkan dengan &ldquo;saudara&rdquo;-nya dalam 1 jam.",
        "<strong>Ambang (threshold):</strong> rule-nya — ditentukan dari data historis (percentile!) bukan tebakan.",
        "<strong>Varian:</strong> velocity amount (total Rp), velocity count, velocity channel-berbeda.",
    ])
    L.raw(tip("Tentukan ambang dari data: <code className=\"inline\">PERCENTILE_CONT(0.99)</code> dari distribusi velocity normal — &ldquo;1% teratas&rdquo;. Ambang arbitrer (&ldquo;3 transaksi&rdquo;) tanpa data = false positive membabi buta."))
    L.raw(myth("Makin banyak rule = makin aman.",
        "Setiap rule menambah <strong>false positive</strong> — nasabah sah diblokir = komplain + churn. Fraud detection = <strong>trade-off presisi vs cakupan</strong>. Rule bagus = menangkap banyak fraud dengan sedikit gangguan. Ukur keduanya!"))

    L.sec("travel", "Impossible Travel — Fisika Sederhana")
    L.p("Transaksi di Jakarta jam 10:00, lalu di Surabaya jam 10:30 — <strong>mustahil</strong> ditempuh (700 km dalam 30 menit). Pola:")
    L.raw(codebox("-- butuh kolom kota/lokasi; bandingkan transaksi berurutan\nWITH s AS (\n  SELECT nasabah_id, tanggal, kota,\n    LAG(kota) OVER (PARTITION BY nasabah_id ORDER BY tanggal) AS kota_lalu,\n    LAG(tanggal) OVER (PARTITION BY nasabah_id ORDER BY tanggal) AS waktu_lalu\n  FROM transaksi)\nSELECT *,\n  (julianday(tanggal) - julianday(waktu_lalu)) * 24 AS jeda_jam\nFROM s\nWHERE kota_lalu IS NOT NULL AND kota <> kota_lalu\n  AND (julianday(tanggal) - julianday(waktu_lalu)) * 24 < 2;  -- beda kota < 2 jam", "sql"))
    L.ul([
        "<strong>LAG</strong> (C9!) untuk pasangan berurutan per nasabah.",
        "<strong>Aturan:</strong> kota beda + jeda < ambang (2 jam) = mustahil.",
        "<strong>Pengembangan:</strong> jarak_km / jeda_jam = kecepatan implisit; > 800 km/jam = flag.",
    ])
    L.raw(myth("Impossible travel = pasti fraud.",
        "Tidak — VPN, perjalanan dinas (pesawat!), transaksi online dengan lokasi merchant aneh. Rule ini = <strong>screening</strong>, bukan vonis. Selalu ada langkah verifikasi (hubungi nasabah) sebelum blokir."))
    L.raw(tip("Gabungkan sinyal: velocity TINGGI + impossible travel + nominal BULAT (5.000.000) + jam ANEH (03:00) = skor komposit. Satu sinyal lemah; empat sinyal = kuat. Inilah cikal-bakal <strong>feature engineering</strong> (D10)!"))

    L.sec("rule", "Rule-Based Alert — CASE + Ambang")
    L.raw(codebox("WITH v AS (\n  -- velocity per nasabah per hari\n  SELECT nasabah_id, date(tanggal) AS tgl,\n         COUNT(*) AS n, SUM(jumlah) AS amt\n  FROM transaksi GROUP BY 1, 2\n)\nSELECT nasabah_id, tgl, n, amt,\n  CASE\n    WHEN n >= 5 AND amt >= 10000000 THEN 'kritis'\n    WHEN n >= 3 OR amt >= 5000000 THEN 'waspada'\n    ELSE 'normal'\n  END AS alert\nFROM v\nWHERE n >= 3 OR amt >= 5000000;", "sql"))
    L.ul([
        "<strong>Struktur alert:</strong> agregat jendela → CASE skor → saring yang relevan.",
        "<strong>Level:</strong> kritis (auto-block?), waspada (review manual), normal (abaikan).",
        "<strong>Operasional:</strong> alert harus <strong>actionable</strong> — tiap alert = ada tindakan jelas. Alert tanpa tindakan = noise.",
    ])
    L.raw(tip("Ukur rule seperti model ML: <strong>precision</strong> (% alert yang benar fraud) & <strong>recall</strong> (% fraud tertangkap). Rule tanpa metrik = tak bisa diperbaiki. Simpan histori alert + label untuk tuning (D12!)."))

    L.chart(
        data=[{"x": ["00", "03", "06", "09", "12", "15", "18", "21"], "y": [2, 8, 1, 1, 2, 3, 2, 1],
               "type": "bar", "marker": {"color": "#2a7de1"},
               "text": ["2", "8!", "1", "1", "2", "3", "2", "1"], "textposition": "outside"}],
        title="Transaksi per Jam: Anomali Jam 03:00 (ilustrasi)",
        layout={"xaxis": {"title": "Jam"}, "yaxis": {"title": "Jumlah transaksi"}, "showlegend": False},
        cara="Tinggi = jumlah transaksi per jam dalam sehari.",
        interpretasi="Jam 03:00 melonjak 8× — <strong>velocity temporal</strong>. Pola klasik: fraud dieksekusi saat korban tidur &amp; tim fraud tipis. Aturan &ldquo;jam aneh + velocity tinggi&rdquo; menangkap ini.")

    L.sec("lab1", "🔬 Lab 1: Velocity Harian")
    L.lab("Lab 1 — Siapa Tercepat?",
        "Hitung per nasabah per hari: jumlah transaksi + total amount. Tandai 'waspada' jika ≥3 transaksi atau ≥ Rp 2 juta.",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "WITH v AS (SELECT nasabah_id, date(tanggal) AS tgl, COUNT(*) AS n, SUM(jumlah) AS amt FROM transaksi GROUP BY 1,2) SELECT *, CASE WHEN n>=3 OR amt>=2000000 THEN 'waspada' ELSE 'normal' END AS alert FROM v",
                "SELECT nasabah_id, date(tanggal) AS tgl, COUNT(*) AS n FROM transaksi GROUP BY 1, 2"),
        "Nasabah mana yang 'waspada'? Apakah benar mencurigakan, atau normal? (Pikirkan false positive!)")
    L.raw(sql_answer("Jawaban Lab 1",
        "WITH v AS (\n  SELECT nasabah_id, date(tanggal) AS tgl,\n         COUNT(*) AS n, SUM(jumlah) AS amt\n  FROM transaksi GROUP BY 1, 2\n)\nSELECT *, CASE WHEN n >= 3 OR amt >= 2000000 THEN 'waspada' ELSE 'normal' END AS alert\nFROM v;"))

    L.sec("lab2", "🔬 Lab 2: Deteksi Kota Berbeda Cepat")
    L.lab("Lab 2 — LAG untuk Impossible Travel (Mini)",
        "Tabel transaksi tidak punya kota per transaksi — simulasikan: gabung dengan kota nasabah, lalu cari nasabah dengan transaksi di <strong>hari yang sama</strong> tapi kota nasabah... (pikirkan keterbatasannya!)",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS), ("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT t.nasabah_id, t.tanggal, n.kota, LAG(n.kota) OVER (PARTITION BY t.nasabah_id ORDER BY t.tanggal) AS kota_lalu FROM transaksi t JOIN nasabah n ON n.id=t.nasabah_id",
                "SELECT nasabah_id, tanggal FROM transaksi ORDER BY nasabah_id, tanggal"),
        "Kenapa simulasi ini lemah? Data apa yang dibutuhkan untuk impossible travel BENAR? (lokasi merchant + timestamp presisi!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- konsep (data lab terbatas: kota = kota nasabah, bukan lokasi trx):\nWITH s AS (\n  SELECT t.nasabah_id, t.tanggal, n.kota,\n    LAG(t.tanggal) OVER (PARTITION BY t.nasabah_id ORDER BY t.tanggal) AS lalu\n  FROM transaksi t JOIN nasabah n ON n.id = t.nasabah_id\n)\nSELECT * FROM s\nWHERE (julianday(tanggal) - julianday(lalu)) * 24 < 1;\n-- produksi: butuh koordinat merchant + timestamp detik!"))

    L.sec("peta", "🗺️ Peta Keputusan: Deteksi Fraud")
    L.decision("1", "Banyak trx waktu singkat → <strong>velocity check</strong>",
        "Kecepatan.",
        kenapa="Self-join jendela + ambang dari percentile data.",
        contoh="≥5 trx/jam.")
    L.decision("2", "Lokasi mustahil → <strong>impossible travel</strong>",
        "Fisika.",
        kenapa="LAG pasangan berurutan; jarak/waktu > mungkin.",
        contoh="Jakarta→Surabaya 30 menit.")
    L.decision("3", "Gabung sinyal → <strong>rule komposit (CASE)</strong>",
        "Skor.",
        kenapa="Satu sinyal lemah; banyak sinyal kuat.",
        contoh="Velocity + jam aneh + nominal bulat.")
    L.decision("4", "Jaringan → <strong>recursive CTE</strong> (C12)",
        "Graf.",
        kenapa="Rantai/fan-in/fan-out mule.",
        contoh="Jangkauan dari rekening A.")
    L.decision("5", "Tuning → <strong>ukur precision/recall</strong>",
        "Trade-off.",
        kenapa="Rule tanpa metrik tak bisa diperbaiki.",
        contoh="% alert benar fraud.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Ambang dari <strong>data</strong> (percentile), bukan tebakan.</li>"
        "<li>Rule = <strong>screening</strong>, bukan vonis — verifikasi sebelum blokir.</li>"
        "<li>Ukur <strong>false positive</strong> — nasabah sah diblokir = churn.</li>"
        "<li>Alert harus <strong>actionable</strong> — tanpa tindakan = noise.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Rp 47 Juta dalam 11 Menit (60+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Alert: kartu X — 14 transaksi, 11 menit, 3 kota, Rp 47 juta. Pemilik tidur di Jakarta.</p>"
        "<p><strong>Tugas:</strong> (1) Tulis query velocity yang <em>akan</em> menangkap ini (jendela 15 menit, ambang?). (2) Tulis query impossible travel-nya. (3) Rancang <strong>aturan komposit</strong> (skor 0–10) + <strong>tindakan</strong> per level. (4) Estimasi: jika ambang terlalu rendah, apa yang terjadi pada 1 juta nasabah?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> Self-join jendela 15 menit, <code className=\"inline\">HAVING COUNT(*) &gt;= 5</code> (ambang dari p99 historis). <strong>(2)</strong> LAG kota + jeda &lt; 2 jam antar kota beda. <strong>(3)</strong> Skor: velocity≥5 (+4), kota beda &lt;2jam (+3), nominal bulat &gt;1jt (+2), jam 00–05 (+1). ≥7 = auto-block + SMS; 4–6 = review 15 menit; &lt;4 = log.</p>"
        "<p><strong>(4)</strong> False positive 0,1% × 1 juta = <strong>1.000 nasabah sah diblokir/hari</strong> = bencana call center! Inilah mengapa tuning ambang = pekerjaan terpenting, bukan menambah rule.</p>"
        "<p><strong>Pelajaran:</strong> fraud detection = <strong>statistik + operasional</strong>. Query menangkap pola; ambang menentukan bisnis. Dan pola ini menjadi <strong>fitur</strong> untuk model ML (D10/D12) — rule-based hari ini, machine learning besok.</p>")))

    L.quiz("Velocity check memakai…",
        ["GROUP BY biasa", "Self-join jendela waktu + ambang", "UNION", "LAG saja"],
        1, "Benar: tiap transaksi vs &ldquo;saudara&rdquo;-nya dalam jendela.")
    L.quiz("Ambang velocity sebaiknya dari…",
        ["Tebakan", "Percentile distribusi historis (mis. p99)", "Angka bulat", "Copy bank lain"],
        1, "Benar: berbasis data — ambang arbitrer = false positive membabi buta.")
    L.quiz("Impossible travel memakai…",
        ["COUNT", "LAG untuk pasangan berurutan + aturan jarak/waktu", "AVG", "UNION"],
        1, "Benar: bandingkan lokasi & waktu transaksi berurutan.")
    L.quiz("Impossible travel terdeteksi = …",
        ["Pasti fraud, langsung blokir permanen", "Screening — verifikasi dulu sebelum tindakan", "Abaikan", "Hapus transaksi"],
        1, "Benar: VPN, dinas, merchant aneh = penjelasan sah. Verifikasi dulu.")
    L.quiz("False positive 0,1% pada 1 juta nasabah…",
        ["Tidak masalah", "= 1.000 nasabah sah terganggu — bencana operasional", "Bagus", "Tidak mungkin"],
        1, "Benar: skala mengubah segalanya. Tuning ambang = pekerjaan terpenting.")
    L.quiz("Rule fraud yang baik diukur dengan…",
        ["Jumlah rule", "Precision & recall", "Panjang query", "Kecepatan"],
        1, "Benar: seperti model ML — tanpa metrik tak bisa diperbaiki.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Velocity:</strong> count/amount per jendela — self-join + ambang dari data.</li>"
        "<li><strong>Impossible travel:</strong> LAG pasangan + aturan jarak/waktu.</li>"
        "<li><strong>Rule komposit:</strong> gabung sinyal lemah jadi skor kuat (cikal feature engineering).</li>"
        "<li><strong>Trade-off:</strong> rule = screening; ukur false positive; alert harus actionable.</li>"
        "<li>Rule-based hari ini → fitur ML (D10/D12) besok.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C15
def c15():
    L = Lesson("c15-data-quality", "C15 — SQL Engineering",
        "Data Quality: Percaya<br/>tapi Verifikasi",
        "45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case",
        ("c14-fraud-velocity", "← C14"), ("c16-data-modeling", "Next: C16"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjalankan <strong>6 dimensi cek kualitas</strong>: completeness, uniqueness, validity, consistency, timeliness, accuracy.</li>"
        "<li>Menulis <strong>reconciliation query</strong> (cocokkan sumber vs target).</li>"
        "<li>Merancang <strong>test suite</strong> untuk pipeline (konsep dbt test).</li>"
        "<li>Menjelaskan biaya <strong>data buruk</strong> dalam bahasa bisnis.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Laporan Direksi yang Salah Rp 2 Miliar")
    L.raw('<div className="story"><p>Laporan keuangan kuartalan: total penyaluran Rp 48 miliar. Audit menemukan: <strong>Rp 2 miliar double-count</strong> dari duplikat + <strong>300 debitur hilang</strong> dari filter NULL yang salah. Laporan ditarik, direksi malu, analis dimutasi.</p>'
        "<p>Akar masalah: <strong>tidak ada quality check</strong> di pipeline. Data quality bukan &ldquo;nice to have&rdquo; — ia <em>asuransi karir</em>. Lesson ini: cek standar yang memisahkan analis amatir dari profesional.</p></div>")

    L.sec("dimensi", "6 Dimensi Quality Check")
    L.raw(codebox("-- 1. COMPLETENESS: ada yang hilang?\nSELECT COUNT(*) AS total, COUNT(penghasilan) AS isi,\n  COUNT(*) - COUNT(penghasilan) AS hilang\nFROM nasabah;\n\n-- 2. UNIQUENESS: ada duplikat?\nSELECT id, COUNT(*) FROM nasabah GROUP BY id HAVING COUNT(*) > 1;\n\n-- 3. VALIDITY: nilai di luar domain?\nSELECT * FROM nasabah WHERE dpd < 0 OR dpd > 3650;\nSELECT * FROM nasabah WHERE kota NOT IN ('Jakarta','Bandung','Surabaya','Medan');", "sql"))
    L.raw(codebox("-- 4. CONSISTENCY: aturan bisnis dilanggar?\n-- status 'lancar' tapi dpd > 0 = inkonsisten!\nSELECT * FROM nasabah WHERE status = 'lancar' AND dpd > 0;\n\n-- 5. TIMELINESS: data terbaru kapan? (staleness)\nSELECT MAX(tanggal) AS terakhir, julianday('now') - julianday(MAX(tanggal)) AS umur_hari\nFROM transaksi;\n\n-- 6. ACCURACY: cocokkan dengan sumber kebenaran\n-- (reconciliation di bawah)", "sql"))
    L.raw(tip("Jadikan 6 cek ini <strong>template</strong> untuk setiap tabel baru yang kamu terima. 15 menit menjalankan template ini menghemat berhari-hari debugging &ldquo;kok angkanya aneh&rdquo;."))
    L.raw(myth("Data quality = tanggung jawab data engineer.",
        "Semua orang yang menyentuh data bertanggung jawab! Analis yang memakai data tanpa cek = ikut salah saat laporan salah. Pepatah: &ldquo;garbage in, garbage out&rdquo; — tapi yang disalahkan tetap yang presentasi."))

    L.sec("recon", "Reconciliation — Cocokkan Sumber vs Target")
    L.p("Setelah ETL/pipeline: apakah target = sumber? Tiga level:")
    L.raw(codebox("-- Level 1: row count\nSELECT 'sumber' AS s, COUNT(*) FROM transaksi_src\nUNION ALL\nSELECT 'target', COUNT(*) FROM transaksi;\n\n-- Level 2: agregat kunci (checksum sederhana)\nSELECT SUM(jumlah), COUNT(DISTINCT nasabah_id) FROM transaksi_src\nUNION ALL\nSELECT SUM(jumlah), COUNT(DISTINCT nasabah_id) FROM transaksi;\n\n-- Level 3: baris yang hilang/berbeda (EXCEPT dua arah!)\n(SELECT id FROM transaksi_src EXCEPT SELECT id FROM transaksi)\nUNION ALL\n(SELECT id FROM transaksi EXCEPT SELECT id FROM transaksi_src);", "sql"))
    L.ul([
        "<strong>Level 1</strong> (count): cepat, menangkap kehilangan besar.",
        "<strong>Level 2</strong> (sum/distinct): menangkap duplikat & nilai berubah.",
        "<strong>Level 3</strong> (EXCEPT): tepat baris mana — untuk investigasi.",
    ])
    L.raw(tip("Aturan pipeline: <strong>tidak ada data yang pindah tanpa reconciliation</strong>. Jadikan recon sebagai gerbang (gate): jika selisih > toleransi → pipeline FAIL, jangan lanjut. Ini praktik dbt test (C16)."))

    L.sec("test", "Test Suite untuk Pipeline")
    L.p("Konsep dari dbt (data build tool) — test sebagai kode, jalan otomatis tiap pipeline:")
    L.table(["Test", "Contoh", "Menangkap"],
        [["unique", "id unik", "Duplikat"],
         ["not_null", "nama tidak null", "Hilang"],
         ["accepted_values", "status in (...)", "Nilai liar"],
         ["relationships", "nasabah_id ada di nasabah", "Orphan FK"],
         ["custom SQL", "SUM(src) = SUM(tgt)", "Recon gagal"]])
    L.raw(codebox("-- relationships: kredit yatim (nasabah_id tak ada di nasabah)\nSELECT k.* FROM kredit k\nLEFT JOIN nasabah n ON n.id = k.nasabah_id\nWHERE n.id IS NULL;\n\n-- custom: total harian tidak boleh turun (monotonik append-only)\nWITH h AS (SELECT date(tanggal) d, SUM(jumlah) s FROM transaksi GROUP BY 1)\nSELECT * FROM h WHERE s < 0;  -- negatif = anomali", "sql"))
    L.raw(tip("Mulai dari 5 test generik (unique, not_null, accepted_values, relationships, row count) — mencakup 80% masalah. Tambah custom test untuk aturan bisnis spesifik."))
    L.raw(myth("Test memperlambat delivery.",
        "Test memperlambat <em>sekarang</em> 10 menit, menghemat <em>nanti</em> berhari-hari + reputasi. Tim yang tidak test = tim yang debugging di produksi — dengan direksi menonton."))

    L.chart(
        data=[{"x": ["Completeness", "Uniqueness", "Validity", "Consistency", "Timeliness"],
               "y": [90, 100, 95, 80, 100], "type": "bar",
               "marker": {"color": ["#e8a838", "#34a853", "#e8a838", "#ef4444", "#34a853"]},
               "text": ["90%", "100%", "95%", "80%!", "100%"], "textposition": "outside"}],
        title="Skor Quality per Dimensi (ilustrasi audit)",
        layout={"yaxis": {"title": "Skor %", "range": [0, 105]}, "showlegend": False},
        cara="Tinggi = skor tiap dimensi quality check.",
        interpretasi="<strong>Consistency 80%</strong> = lampu merah: aturan bisnis dilanggar (status vs dpd tak cocok). Quality dashboard seperti ini = <em>bahasa bersama</em> analis–engineer–bisnis. Tanpa skor, &ldquo;data bermasalah&rdquo; hanya keluhan; dengan skor, ia <em>tugas terukur</em>.")

    L.sec("lab1", "🔬 Lab 1: Audit 6 Dimensi")
    L.lab("Lab 1 — Template Quality Check",
        "Jalankan 6 cek pada tabel nasabah: completeness (penghasilan), uniqueness (id), validity (dpd 0–3650), consistency (status vs dpd).",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi FROM nasabah",
                "SELECT * FROM nasabah WHERE status = 'lancar' AND dpd > 0"),
        "Temukan: inkonsistensi apa di data lab? (Petunjuk: Budi dpd 15 tapi status 'lancar'!)")
    L.raw(sql_answer("Jawaban Lab 1",
        "-- completeness\nSELECT COUNT(*) AS total, COUNT(penghasilan) AS isi FROM nasabah;\n-- uniqueness\nSELECT id, COUNT(*) c FROM nasabah GROUP BY id HAVING c > 1;\n-- validity\nSELECT * FROM nasabah WHERE dpd < 0;\n-- consistency: Budi & Fitri dpd>0 tapi 'lancar' = INKONSISTEN!\nSELECT * FROM nasabah WHERE status = 'lancar' AND dpd > 0;"))

    L.sec("lab2", "🔬 Lab 2: Reconciliation")
    L.lab("Lab 2 — Cocokkan Dua Tabel",
        "Simulasikan sumber vs target: buat 'target' = nasabah tanpa Eko (hilang!). Buktikan dengan 3 level recon.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "SELECT 'sumber' AS s, COUNT(*) FROM nasabah UNION ALL SELECT 'target', COUNT(*) FROM (SELECT * FROM nasabah WHERE id <> 5)",
                "SELECT COUNT(*) FROM nasabah"),
        "Level 3: baris mana yang hilang? (EXCEPT!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- L1: count\nSELECT 'sumber', COUNT(*) FROM nasabah\nUNION ALL\nSELECT 'target', COUNT(*) FROM (SELECT * FROM nasabah WHERE id <> 5);\n-- L3: siapa hilang\nSELECT id FROM nasabah\nEXCEPT\nSELECT id FROM (SELECT * FROM nasabah WHERE id <> 5);\n-- hasil: id 5 (Eko) hilang!"))

    L.sec("peta", "🗺️ Peta Keputusan: Quality")
    L.decision("1", "Tabel baru diterima → <strong>6 cek template</strong>",
        "Audit awal.",
        kenapa="15 menit mencegah berhari-hari debug.",
        contoh="Completeness → timeliness.")
    L.decision("2", "Setelah pipeline → <strong>reconciliation 3 level</strong>",
        "Gate.",
        kenapa="Count → agregat → EXCEPT. Gagal = jangan lanjut.",
        contoh="Sumber vs target.")
    L.decision("3", "Aturan berulang → <strong>test otomatis</strong>",
        "Kontinu.",
        kenapa="unique/not_null/values/relationships.",
        contoh="dbt test tiap run.")
    L.decision("4", "Temuan → <strong>skor + bahasa bisnis</strong>",
        "Komunikasi.",
        kenapa="&ldquo;Consistency 80%&rdquo; > &ldquo;data bermasalah&rdquo;.",
        contoh="Quality dashboard.")
    L.decision("5", "Biaya → <strong>kuantifikasi</strong>",
        "Advokasi.",
        kenapa="Rp salah hitung = budget quality.",
        contoh="Rp 2M double-count.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Tabel baru → 6 cek. Pipeline → recon 3 level.</li>"
        "<li>Tidak ada data pindah tanpa recon yang lolos.</li>"
        "<li>Test generik dulu (80%), custom untuk aturan bisnis.</li>"
        "<li>Laporkan temuan sebagai <strong>skor + dampak Rp</strong>.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Laporan Rp 2 Miliar (45+ mnt)")
    L.raw(callout("<p><strong>Situasi:</strong> Total penyaluran dilaporkan Rp 48M. Audit: Rp 2M double-count (duplikat) + 300 debitur hilang (filter NULL salah).</p>"
        "<p><strong>Tugas:</strong> (1) Test apa yang <em>akan</em> menangkap double-count? (2) Test apa yang menangkap debitur hilang? (3) Rancang <strong>gate pipeline</strong>: urutan cek + ambang FAIL. (4) Tulis <strong>permintaan maaf + rencana perbaikan</strong> 4 kalimat untuk direksi.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> Test uniqueness id + recon Level 2 (SUM sumber vs target). <strong>(2)</strong> Recon Level 1 (count) + not_null test di kolom filter + review query filter NULL (C2!).</p>"
        "<p><strong>(3) Gate:</strong> ① row count ±0 → ② SUM ±0,01% → ③ unique/not_null → ④ custom bisnis. FAIL di langkah manapun = pipeline berhenti + alert.</p>"
        "<p><strong>(4) Contoh:</strong> &ldquo;Kami menemukan kelebihan catat Rp 2M dari duplikat dan 300 debitur terlewat filter. Angka terkoreksi: Rp 46M. Kami memasang 4 lapis automated check agar tidak terulang; laporan audit menyusul Jumat.&rdquo;</p>"
        "<p><strong>Pelajaran:</strong> krisis data = krisis kepercayaan. Respons profesional = <strong>akui + koreksi + sistem cegah</strong>. Inilah yang membedakan senior.</p>")))

    L.quiz("Cek pertama untuk tabel baru…",
        ["Langsung analisis", "Template 6 dimensi (completeness → timeliness)", "Visualisasi", "Minta dokumentasi"],
        1, "Benar: 15 menit audit menghemat berhari-hari debug.")
    L.quiz("status='lancar' tapi dpd>0 melanggar dimensi…",
        ["Completeness", "Consistency", "Timeliness", "Uniqueness"],
        1, "Benar: aturan bisnis dilanggar = inkonsisten.")
    L.quiz("Recon Level 2 (agregat) menangkap yang tidak ditangkap Level 1…",
        ["Tidak ada", "Duplikat & nilai berubah (count sama, isi beda)", "Baris hilang", "Skema berubah"],
        1, "Benar: count sama tapi SUM beda = ada yang berubah/digandakan.")
    L.quiz("EXCEPT dua arah untuk…",
        ["Dedup", "Temukan tepat baris mana yang hilang/berbeda", "Pivot", "Ranking"],
        1, "Benar: Level 3 recon = investigasi presisi.")
    L.quiz("Test 'relationships' memeriksa…",
        ["Tipe data", "FK tidak yatim (ada di tabel induk)", "Kecepatan", "Jumlah kolom"],
        1, "Benar: referential integrity.")
    L.quiz("Cara melaporkan temuan quality ke bisnis…",
        ["&ldquo;Data bermasalah&rdquo;", "Skor per dimensi + dampak Rp", "Diam saja", "Salahkan engineer"],
        1, "Benar: skor + dampak = bahasa yang menggerakkan anggaran.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>6 dimensi:</strong> completeness, uniqueness, validity, consistency, timeliness, accuracy.</li>"
        "<li><strong>Recon 3 level:</strong> count → agregat → EXCEPT. Gate pipeline.</li>"
        "<li><strong>Test:</strong> generik (80%) + custom bisnis; jalan otomatis.</li>"
        "<li><strong>Komunikasi:</strong> skor + dampak Rp — bukan keluhan.</li>"
        "<li>Quality = asuransi karir.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C16
def c16():
    L = Lesson("c16-data-modeling", "C16 — SQL Engineering",
        "Data Modeling: Star Schema<br/>&amp; Analitik Modern",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c15-data-quality", "← C15"), ("c17-index-explain", "Next: C17"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Membedakan <strong>OLTP vs OLAP</strong> dan <strong>star vs snowflake schema</strong>.</li>"
        "<li>Merancang <strong>fact + dimension</strong> untuk kasus kredit/transaksi.</li>"
        "<li>Menjelaskan <strong>SCD</strong> (slowly changing dimensions).</li>"
        "<li>Menjelaskan alur <strong>ELT + dbt</strong> modern (job relevance!).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Query yang Butuh 12 JOIN")
    L.raw('<div className="story"><p>Analis baru menulis laporan &ldquo;NPL per segmen&rdquo; — query-nya butuh <strong>12 JOIN</strong> melintasi database transaksional yang dinormalisasi. Query lambat, sulit dibaca, dan tiap analis menulis versinya sendiri — angka beda-beda!</p>'
        "<p>Solusi industri: <strong>data warehouse</strong> dengan <strong>star schema</strong> — data dimodelkan <em>untuk analisis</em> (bukan untuk transaksi). Ditambah <strong>dbt</strong> (transformasi sebagai kode + test). Ini skill engineering yang dicari 2026 — dan membuat analis 10× lebih produktif.</p></div>")

    L.sec("oltp", "OLTP vs OLAP — Dua Dunia")
    L.table(["", "OLTP (transaksional)", "OLAP (analitik)"],
        [["Tujuan", "Proses transaksi cepat", "Analisis & laporan"],
         ["Query", "Kecil, banyak, cepat", "Besar, sedikit, kompleks"],
         ["Skema", "Ternormalisasi (3NF)", "Star schema (denormalisasi)"],
         ["Contoh", "Core banking, aplikasi", "Data warehouse, dashboard"]])
    L.p("<strong>Normalisasi</strong> (3NF) = hindari redundansi — bagus untuk transaksi (update 1 tempat). <strong>Tapi</strong> untuk analisis, normalisasi = JOIN banyak = lambat + rumit. Maka: <strong>ELT</strong> — salin ke warehouse, lalu model ulang untuk analisis.")
    L.raw(tip("Aturan praktis: <strong>jangan analisis langsung di database produksi!</strong> Query beratmu bisa memperlambat transaksi nasabah. Analisis di warehouse/replika — selalu."))

    L.sec("star", "Star Schema — Fact &amp; Dimension")
    L.p("<strong>Fact table</strong> = kejadian terukur (transaksi, pencairan kredit): kunci asing + <strong>measures</strong> (jumlah, plafon). <strong>Dimension</strong> = konteks (nasabah, waktu, produk): atribut deskriptif.")
    L.raw(codebox("-- fact_transaksi: grain = 1 baris per transaksi\nCREATE TABLE fact_transaksi (\n  transaksi_id INTEGER PRIMARY KEY,\n  nasabah_key INTEGER,   -- FK ke dim_nasabah\n  waktu_key INTEGER,     -- FK ke dim_waktu\n  jumlah REAL,           -- measure\n  kategori TEXT         -- degenerate dimension\n);\n\n-- dim_nasabah: atribut nasabah\nCREATE TABLE dim_nasabah (\n  nasabah_key INTEGER PRIMARY KEY,\n  nama TEXT, kota TEXT, segmen TEXT\n);\n\n-- query: JOIN sedikit, mudah dibaca!\nSELECT d.kota, SUM(f.jumlah)\nFROM fact_transaksi f\nJOIN dim_nasabah d ON d.nasabah_key = f.nasabah_key\nGROUP BY 1;", "sql"))
    L.ul([
        "<strong>Grain:</strong> &ldquo;1 baris = apa?&rdquo; — keputusan desain terpenting! (1 baris = 1 transaksi.)",
        "<strong>Star vs snowflake:</strong> star = dimensi langsung (denormalisasi, JOIN sedikit); snowflake = dimensi dinormalisasi lagi (hemat, JOIN banyak). <strong>Star untuk analis.</strong>",
        "<strong>dim_waktu:</strong> tabel kalender (tanggal → hari/bulan/kuartal/libur) — <em>wajib</em> di setiap warehouse!",
    ])
    L.raw(myth("Denormalisasi = desain buruk.",
        "Di OLTP ya; di OLAP justru <em>desain yang benar</em>! Tujuan beda: OLTP hemat update, OLAP hemat JOIN. Menilai star schema dengan kacamata normalisasi = salah alamat."))
    L.raw(myth("Satu warehouse cocok untuk semua kebutuhan.",
        "Warehouse (OLAP) untuk analisis batch; <strong>data lake</strong> untuk data mentah tak terstruktur; <strong>OLTP</strong> untuk transaksi. Memaksa semua ke satu sistem = tidak ada yang optimal. Arsitektur modern = <em>tiap beban ke sistem yang tepat</em> (lakehouse menggabungkan beberapa)."))
    L.raw(tip("Tiga pertanyaan sebelum modeling: (1) <strong>grain</strong>-nya apa? (2) <strong>measures</strong>-nya apa? (3) <strong>dipotong</strong> (slice) berdasar dimensi apa? Jawab tiga ini = 80% desain selesai."))

    L.sec("scd", "SCD — Dimensi yang Berubah")
    L.p("Nasabah pindah Jakarta → Bandung. Bagaimana catatnya? <strong>Slowly Changing Dimensions:</strong>")
    L.table(["Tipe", "Cara", "Kapan"],
        [["SCD-1", "Timpa (overwrite)", "Koreksi salah input; histori tak penting"],
         ["SCD-2", "Baris baru + tanggal berlaku", "Histori penting! (alamat saat transaksi)"],
         ["SCD-3", "Kolom 'nilai_lama'", "Jarang — hanya butuh 1 versi lama"]])
    L.raw(codebox("-- SCD-2: dim_nasabah dengan versi\n-- (nasabah_key surrogate, id_natural, kota, berlaku_dari, berlaku_sampai, is_current)\nSELECT * FROM dim_nasabah WHERE id_natural = 1 AND is_current = 1;  -- kini\nSELECT * FROM dim_nasabah WHERE id_natural = 1;  -- semua versi (histori)", "sql"))
    L.p("<strong>Mengapa penting:</strong> &ldquo;transaksi 2025 per kota&rdquo; — kota <em>saat transaksi</em> atau <em>kini</em>? SCD-2 menjawab benar. Tanpa SCD, histori tertimpa = analisis historis salah!")
    L.raw(tip("Surrogate key (nasabah_key) vs natural key (id): fact menunjuk surrogate — agar versi histori tepat. Ini alasan &ldquo;key&rdquo; bukan &ldquo;id&rdquo; di fact table."))

    L.sec("dbt", "ELT + dbt — Analitik Modern ⭐")
    L.p("<strong>ELT</strong> (Extract-Load-Transform): muat data mentah dulu (murah, cloud), transformasi <em>di dalam</em> warehouse. Kebalikan ETL lama (transform sebelum load).")
    L.p("<strong>dbt</strong> (data build tool) = standar industri 2026: transformasi sebagai <strong>kode SQL + test + dokumentasi</strong>:")
    L.raw(codebox("-- models/mart/npl_per_kota.sql (dbt model = SELECT biasa!)\nSELECT kota, SUM(...) AS npl_ratio\nFROM {{ ref('fact_kredit') }}  -- ref = dependency otomatis!\nGROUP BY 1\n\n-- models/mart/npl_per_kota.yml (test + dokumen)\ntests:\n  - unique: [kota]\n  - not_null: [npl_ratio]", "sql"))
    L.ul([
        "<code className=\"inline\">{{ ref() }}</code> = dependency graph otomatis (dbt tahu urutan jalan + lineage!).",
        "<strong>Test</strong> (C15!) = bagian dari model — pipeline gagal jika test gagal.",
        "<strong>Dokumentasi</strong> = dari kode — definisi NPL satu tempat, konsisten!",
        "<strong>Kenapa dicari:</strong> &ldquo;analytics engineer&rdquo; = role terpanas 2024–2026; dbt di hampir semua lowongan.",
    ])
    L.raw(tip("Alur modern: sumber → (Fivetran/Airbyte) → warehouse (BigQuery/Snowflake) → <strong>dbt</strong> (staging → mart) → BI (dashboard). Hafalkan 5 langkah ini — ia menjawab &ldquo;jelaskan modern data stack&rdquo; di interview."))

    L.chart(
        data=[{"x": ["OLTP\n(12 JOIN)", "Star schema\n(2 JOIN)"], "y": [12, 2], "type": "bar",
               "marker": {"color": ["#ef4444", "#34a853"]},
               "text": ["12 JOIN", "2 JOIN"], "textposition": "outside"}],
        title="Kompleksitas Query: OLTP vs Star (ilustrasi)",
        layout={"yaxis": {"title": "Jumlah JOIN"}, "showlegend": False},
        cara="Jumlah JOIN untuk laporan &ldquo;NPL per kota per segmen&rdquo;.",
        interpretasi="Star schema memangkas 12 JOIN jadi 2 — query <strong>lebih cepat ditulis, dibaca, dan dieksekusi</strong>. Inilah ROI data modeling: bayar sekali (desain), hemat selamanya.")

    L.sec("lab1", "🔬 Lab 1: Rancang Star Schema")
    L.lab("Lab 1 — Fact &amp; Dimension (Desain)",
        "Rancang star schema untuk analisis <strong>kredit</strong>: tentukan grain, fact (+measures), dimensions (+atribut). Tulis DDL-nya!",
        lab_sql([("kredit", KREDIT_DDL, KREDIT_ROWS)],
                "-- latihan desain: tulis DDL fact_kredit & dim_nasabah di sini\nSELECT 'tulis DDL star schema-mu, lalu query: total plafon per kota' AS instruksi",
                "SELECT * FROM kredit LIMIT 3"),
        "Pertanyaan desain: grain = 1 baris per...? Measures? Dimensions?")
    L.raw(sql_answer("Jawaban Lab 1",
        "-- grain: 1 baris per fasilitas kredit\nCREATE TABLE fact_kredit (\n  kredit_key INTEGER PRIMARY KEY,\n  nasabah_key INTEGER,\n  waktu_key INTEGER,      -- tgl pencairan\n  plafon REAL,            -- measure\n  dpd INTEGER,            -- measure (snapshot)\n  kolektibilitas INTEGER\n);\nCREATE TABLE dim_nasabah (nasabah_key INTEGER PRIMARY KEY, nama TEXT, kota TEXT, segmen TEXT);\nCREATE TABLE dim_waktu (waktu_key INTEGER PRIMARY KEY, tanggal TEXT, bulan TEXT, kuartal TEXT);"))

    L.sec("lab2", "🔬 Lab 2: SCD-2 Mini")
    L.lab("Lab 2 — Histori Kota",
        "Buat dim_nasabah SCD-2 untuk Andi (pindah Jkt→Bdg 2026-06-01). Query: kota Andi <strong>saat ini</strong> vs <strong>semua versi</strong>.",
        lab_sql([("dim_nasabah", "CREATE TABLE dim_nasabah (sk INTEGER PRIMARY KEY, id_natural INTEGER, nama TEXT, kota TEXT, berlaku_dari TEXT, berlaku_sampai TEXT, is_current INTEGER)", [(1, 1, "Andi", "Jakarta", "2020-01-01", "2026-05-31", 0),
                 (2, 1, "Andi", "Bandung", "2026-06-01", "9999-12-31", 1)])],
                                "SELECT kota FROM dim_nasabah WHERE id_natural=1 AND is_current=1",
                "SELECT * FROM dim_nasabah WHERE id_natural = 1"),
        "Kenapa fact harus menunjuk sk (surrogate), bukan id_natural?")
    L.raw(sql_answer("Jawaban Lab 2",
        "-- kini:\nSELECT kota FROM dim_nasabah WHERE id_natural = 1 AND is_current = 1;\n-- histori:\nSELECT kota, berlaku_dari, berlaku_sampai FROM dim_nasabah WHERE id_natural = 1;\n-- surrogate: fact menunjuk versi tepat saat kejadian!"))

    L.sec("peta", "🗺️ Peta Keputusan: Modeling")
    L.decision("1", "Desain baru → <strong>tanya grain-measures-dimensi</strong>",
        "Fondasi.",
        kenapa="3 pertanyaan = 80% desain.",
        contoh="1 baris = 1 transaksi.")
    L.decision("2", "Untuk analis → <strong>star</strong> (bukan snowflake)",
        "Kemudahan.",
        kenapa="JOIN sedikit; analis mandiri.",
        contoh="fact + dim langsung.")
    L.decision("3", "Atribut berubah + histori penting → <strong>SCD-2</strong>",
        "Histori.",
        kenapa="Baris versi + surrogate key.",
        contoh="Kota saat transaksi.")
    L.decision("4", "Koreksi saja → <strong>SCD-1</strong>",
        "Simpel.",
        kenapa="Timpa; histori tak penting.",
        contoh="Typo nama.")
    L.decision("5", "Transformasi modern → <strong>ELT + dbt</strong>",
        "Standar 2026.",
        kenapa="SQL + test + lineage sebagai kode.",
        contoh="Staging → mart.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Analisis di <strong>warehouse</strong>, bukan produksi.</li>"
        "<li>Grain dulu — salah grain = salah segalanya.</li>"
        "<li>Star untuk analis; snowflake untuk hemat storage.</li>"
        "<li>dbt: <code className=\"inline\">ref()</code> + test + dokumen = pipeline profesional.</li></ol>"))

    L.sec("case", "📋 Mini-Case: 12 JOIN → Star")
    L.raw(callout("<p><strong>Situasi:</strong> Laporan &ldquo;NPL per kota per segmen&rdquo; butuh 12 JOIN di OLTP; 3 analis menulis 3 versi; angka beda 5%.</p>"
        "<p><strong>Tugas:</strong> (1) Rancang star schema-nya (fact, dims, grain). (2) Tulis query versi star. (3) Jelaskan ke CTO <strong>3 kalimat</strong>: kenapa investasi modeling worth it?</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> fact_kredit (grain: 1 baris/fasilitas; measures: plafon, dpd, kol) + dim_nasabah (kota, segmen) + dim_waktu. <strong>(2)</strong> <code className=\"inline\">SELECT n.kota, n.segmen, SUM(CASE WHEN f.kolektibilitas&gt;=3 THEN f.plafon END)/SUM(f.plafon) FROM fact_kredit f JOIN dim_nasabah n ... GROUP BY 1,2;</code> — 1 JOIN!</p>"
        "<p><strong>(3)</strong> &ldquo;Satu definisi NPL, satu tempat — 3 analis dapat angka sama. Query 12 JOIN jadi 1; laporan yang tadinya 2 hari jadi 2 jam. Investasi 2 minggu modeling menghemat ratusan jam analis per tahun.&rdquo;</p>"
        "<p><strong>Pelajaran:</strong> modeling = <strong>konsistensi + kecepatan</strong>. &ldquo;Single source of truth&rdquo; bukan jargon — ia selisih 5% yang hilang.</p>")))

    L.quiz("OLTP vs OLAP: yang benar…",
        ["Sama", "OLTP = transaksi (normalisasi); OLAP = analisis (star schema)", "OLAP lebih kecil", "OLTP untuk dashboard"],
        1, "Benar: tujuan beda → desain beda.")
    L.quiz("Grain = …",
        ["Jumlah baris", "&ldquo;1 baris = apa?&rdquo; — keputusan desain terpenting", "Ukuran storage", "Jumlah kolom"],
        1, "Benar: salah grain = salah segalanya.")
    L.quiz("Star vs snowflake…",
        ["Sama", "Star = dimensi langsung (untuk analis); snowflake = dinormalisasi (hemat, JOIN banyak)", "Snowflake untuk analis", "Star lebih hemat"],
        1, "Benar: star = kemudahan analis.")
    L.quiz("SCD-2 dipakai saat…",
        ["Koreksi typo", "Histori perubahan penting (kota saat transaksi)", "Tidak pernah", "Selalu"],
        1, "Benar: versi + tanggal berlaku + surrogate key.")
    L.quiz("dbt {{ ref() }} berguna untuk…",
        ["Styling", "Dependency graph otomatis + lineage", "Kecepatan query", "Enkripsi"],
        1, "Benar: dbt tahu urutan & asal-usul data.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>OLTP</strong> (transaksi, 3NF) vs <strong>OLAP</strong> (analisis, star).</li>"
        "<li><strong>Star:</strong> fact (measures) + dimensions; grain = keputusan terpenting.</li>"
        "<li><strong>SCD-2:</strong> histori perubahan via versi + surrogate key.</li>"
        "<li><strong>ELT + dbt:</strong> SQL + test + lineage = standar 2026; analytics engineer role terpanas.</li>"
        "<li>Analisis di warehouse, bukan produksi!</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C17
def c17():
    L = Lesson("c17-index-explain", "C17 — SQL Engineering",
        "Index &amp; EXPLAIN:<br/>Membuat Query Terbang",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c16-data-modeling", "← C16"), ("c18-transaksi-acid", "Next: C18"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan cara kerja <strong>index</strong> (B-tree) dan kapan ia membantu.</li>"
        "<li>Membaca <strong>EXPLAIN QUERY PLAN</strong> untuk diagnosis.</li>"
        "<li>Menerapkan 5 aturan <strong>optimasi praktis</strong>.</li>"
        "<li>Menghindari <strong>jebakan index</strong> (terlalu banyak, fungsi di kolom).</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Query 40 Detik → 0,2 Detik")
    L.raw('<div className="story"><p>Dashboard direksi loading <strong>40 detik</strong> — tiap refresh, direksi menunggu sambil menatap analis. Satu baris <code className="inline">CREATE INDEX</code> mengubahnya jadi <strong>0,2 detik</strong>. Bukan sihir — hanya memahami cara database mencari data.</p>'
        "<p>Lesson ini bukan untuk jadi DBA — tapi agar query analismu <em>tidak menjadi masalah</em>. 80% masalah performa diselesaikan 5 aturan di sini.</p></div>")

    L.sec("index", "Index — Daftar Isi Database")
    L.p("<strong>Analogi:</strong> tanpa index = baca buku halaman per halaman (full scan); dengan index (B-tree) = lihat daftar isi → lompat ke halaman (seek).")
    L.raw(codebox("-- buat index di kolom yang sering difilter/join\nCREATE INDEX idx_transaksi_nasabah ON transaksi(nasabah_id);\nCREATE INDEX idx_transaksi_tanggal ON transaksi(tanggal);\n\n-- composite: untuk filter multi-kolom (urutan penting!)\nCREATE INDEX idx_kredit_kol_dpd ON kredit(kolektibilitas, dpd);", "sql"))
    L.ul([
        "<strong>Kapan membantu:</strong> WHERE selektif, JOIN key, ORDER BY.",
        "<strong>Kapan tidak:</strong> tabel kecil (< 10rb baris — full scan lebih cepat!), kolom low-cardinality (status 3 nilai), LIKE '%x%' (tak bisa pakai B-tree).",
        "<strong>Biaya:</strong> index memperlambat INSERT/UPDATE + makan storage — jangan index semua kolom!",
        "<strong>Composite:</strong> (a, b) membantu WHERE a=.. AND b=..; urutan = kolom paling selektif/difilter dulu.",
    ])
    L.raw(myth("Makin banyak index makin cepat.",
        "Salah! Tiap index = beban saat tulis + storage + pilihan planner membingungkan. Aturan: <strong>index untuk pola query nyata</strong> (yang lambat & sering), bukan &ldquo;jaga-jaga&rdquo;. 3–5 index tepat > 20 index acak."))
    L.raw(tip("Pola query → index: &ldquo;filter tanggal + join nasabah&rdquo; → composite (tanggal, nasabah_id) atau dua single — ukur dengan EXPLAIN!"))

    L.sec("explain", "EXPLAIN — Membaca Pikiran Database")
    L.raw(codebox("EXPLAIN QUERY PLAN\nSELECT * FROM transaksi WHERE nasabah_id = 1;", "sql"))
    L.p("Output menunjukkan strategi: <code className=\"inline\">SEARCH transaksi USING INDEX idx_...</code> (bagus!) vs <code className=\"inline\">SCAN transaksi</code> (full scan — waspadai di tabel besar!).")
    L.table(["Tanda", "Artinya", "Tindakan"],
        [["SCAN tabel besar", "Full scan", "Butuh index? Atau memang agregat penuh"],
         ["SEARCH USING INDEX", "Index terpakai", "Bagus"],
         ["USE TEMP B-TREE", "Sort sementara", "Wajar untuk ORDER BY/GROUP BY besar"],
         ["Nested loop besar", "JOIN mahal", "Cek index di kedua sisi JOIN"]])
    L.raw(worked("📐 Contoh langkah-demi-langkah",
        "<p>Soal: query lambat <code className=\"inline\">SELECT * FROM transaksi WHERE tanggal >= '2026-09-01'</code>.</p>"
        "<p><strong>Langkah 1</strong> — EXPLAIN: <code className=\"inline\">SCAN transaksi</code> (full scan!).</p>"
        "<p><strong>Langkah 2</strong> — buat index: <code className=\"inline\">CREATE INDEX idx_tgl ON transaksi(tanggal)</code>.</p>"
        "<p><strong>Langkah 3</strong> — EXPLAIN lagi: <code className=\"inline\">SEARCH USING INDEX</code> ✅.</p>"
        "<p><strong>Langkah 4</strong> — ukur waktu sebelum/sesudah. Klaim tanpa angka = opini.</p>"))
    L.raw(tip("Alur diagnosis standar: <strong>EXPLAIN → hipotesis → perbaiki → EXPLAIN lagi → ukur waktu</strong>. Jangan tebak-tebak index; baca rencananya!"))

    L.sec("aturan", "5 Aturan Optimasi Praktis")
    L.raw(codebox("-- 1. Sargable: kolom polos di WHERE (C4)\nWHERE tanggal >= '2026-09-01'  -- bukan strftime(...)=...\n\n-- 2. Pilih kolom eksplisit (C1)\nSELECT id, jumlah  -- bukan SELECT *\n\n-- 3. Filter dulu, join kemudian (kecilkan sebelum gabung)\nWITH f AS (SELECT * FROM transaksi WHERE tanggal >= '2026-09-01')\nSELECT ... FROM f JOIN nasabah n ...\n\n-- 4. Hindari SELECT DISTINCT untuk menutupi join salah (C5)\n-- 5. Batasi: LIMIT untuk eksplorasi; agregat di DB bukan di aplikasi", "sql"))
    L.ul([
        "<strong>1. Sargable</strong> — fungsi di kolom mematikan index.",
        "<strong>2. Kolom eksplisit</strong> — kurangi I/O.",
        "<strong>3. Filter dulu</strong> — kecilkan dataset sebelum JOIN/agregat mahal.",
        "<strong>4. Jangan tutupi</strong> masalah dengan DISTINCT.",
        "<strong>5. Agregat di database</strong> — jangan tarik 1 juta baris lalu groupby di Python!",
    ])
    L.raw(myth("Optimasi = tugas DBA.",
        "Analis menulis 90% query yang berjalan — analis yang buta performa = pembuat insiden. Kamu tidak perlu jadi DBA, tapi <strong>5 aturan ini</strong> = tanggung jawab profesional."))
    L.raw(tip("Kapan berhenti optimasi? Saat &ldquo;cukup cepat&rdquo; untuk kebutuhan (dashboard < 3 detik, laporan batch < SLA). Optimasi prematur = buang waktu. Ukur dulu, optimasi yang terbukti lambat."))

    L.chart(
        data=[{"x": ["Full scan", "+ Index"], "y": [40, 0.2], "type": "bar",
               "marker": {"color": ["#ef4444", "#34a853"]},
               "text": ["40 dtk", "0,2 dtk"], "textposition": "outside"}],
        title="Dampak Index: 40 dtk → 0,2 dtk (ilustrasi)",
        layout={"yaxis": {"title": "Detik", "type": "log"}, "showlegend": False},
        cara="Skala log: beda 200× lipat.",
        interpretasi="Satu index tepat = 200× lebih cepat. Tapi ingat: <strong>ukur di datamu</strong> — angka ilustrasi. Dan index yang salah tempat = 0× (malah memperlambat write).")

    L.sec("lab1", "🔬 Lab 1: SCAN vs SEARCH")
    L.lab("Lab 1 — Baca EXPLAIN",
        "Jalankan EXPLAIN QUERY PLAN untuk filter nasabah_id. SCAN atau SEARCH? Buat index, ulangi — apa berubah?",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id = 2",
                "SELECT * FROM transaksi WHERE nasabah_id = 2"),
        "Buat index: CREATE INDEX idx_t ON transaksi(nasabah_id); lalu EXPLAIN lagi.")
    L.raw(sql_answer("Jawaban Lab 1",
        "-- sebelum: SCAN transaksi (tabel kecil → wajar)\nEXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id = 2;\n-- buat index:\nCREATE INDEX idx_t ON transaksi(nasabah_id);\n-- sesudah: SEARCH transaksi USING INDEX idx_t"))

    L.sec("lab2", "🔬 Lab 2: Sargable Showdown")
    L.lab("Lab 2 — Fungsi Mematikan Index",
        "Bandingkan EXPLAIN: WHERE tanggal >= '2026-09-01' vs WHERE strftime('%Y-%m',tanggal)='2026-09'. Buat index tanggal dulu!",
        lab_sql([("transaksi", TRANSAKSI_DDL, TRANSAKSI_ROWS)],
                "CREATE INDEX idx_tgl ON transaksi(tanggal)",
                "EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE tanggal >= '2026-09-01'"),
        "Mana yang SEARCH? Mana yang SCAN? Ini bukti aturan sargable (C4)!")
    L.raw(sql_answer("Jawaban Lab 2",
        "CREATE INDEX idx_tgl ON transaksi(tanggal);\nEXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE tanggal >= '2026-09-01';\n-- SEARCH (index terpakai)\nEXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE strftime('%Y-%m', tanggal) = '2026-09';\n-- SCAN (fungsi mematikan index!)"))

    L.sec("peta", "🗺️ Peta Keputusan: Performa")
    L.decision("1", "Query lambat → <strong>EXPLAIN dulu</strong>",
        "Diagnosis.",
        kenapa="Jangan tebak; baca rencananya.",
        contoh="SCAN vs SEARCH.")
    L.decision("2", "SCAN di tabel besar → <strong>index kolom filter/join</strong>",
        "Perbaiki.",
        kenapa="B-tree seek vs full scan.",
        contoh="CREATE INDEX ...")
    L.decision("3", "Index tak terpakai → <strong>cek sargable</strong>",
        "Fungsi?",
        kenapa="Fungsi di kolom mematikan index.",
        contoh="Kolom polos di WHERE.")
    L.decision("4", "JOIN lambat → <strong>index kedua sisi</strong>",
        "Nested loop.",
        kenapa="JOIN tanpa index = mahal.",
        contoh="FK ter-index.")
    L.decision("5", "Cukup cepat → <strong>berhenti</strong>",
        "Prioritas.",
        kenapa="Optimasi prematur = buang waktu.",
        contoh="Ukur vs SLA.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>EXPLAIN → hipotesis → perbaiki → ukur.</li>"
        "<li>Index untuk pola query nyata, bukan jaga-jaga.</li>"
        "<li>Sargable, kolom eksplisit, filter dulu.</li>"
        "<li>Agregat di DB; LIMIT untuk eksplorasi.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Dashboard 40 Detik")
    L.raw(callout("<p><strong>Situasi:</strong> Dashboard &ldquo;transaksi hari ini per kategori&rdquo; loading 40 detik. Query: <code className=\"inline\">SELECT kategori, SUM(jumlah) FROM transaksi WHERE date(tanggal) = date('now') GROUP BY kategori</code>.</p>"
        "<p><strong>Tugas:</strong> (1) Diagnosis via EXPLAIN (apa yang salah?). (2) Perbaiki (2 perubahan!). (3) Estimasi dampak.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1) Diagnosis:</strong> <code className=\"inline\">date(tanggal)</code> di WHERE = <strong>tidak sargable</strong> → SCAN 1 tahun data padahal butuh 1 hari! + tidak ada index tanggal.</p>"
        "<p><strong>(2) Perbaiki:</strong> ① <code className=\"inline\">WHERE tanggal &gt;= date('now') AND tanggal &lt; date('now','+1 day')</code> (sargable); ② <code className=\"inline\">CREATE INDEX idx_tgl ON transaksi(tanggal)</code>.</p>"
        "<p><strong>(3)</strong> SCAN 365 hari → SEEK 1 hari = ~300× lebih sedikit dibaca. 40 dtk → &lt;1 dtk.</p>"
        "<p><strong>Pelajaran:</strong> 90% &ldquo;query lambat&rdquo; = sargable + index. Dua baris perubahan, direksi tersenyum.</p>")))

    L.quiz("Index paling membantu untuk…",
        ["SELECT * tabel kecil", "WHERE selektif di tabel besar", "LIKE '%x%'", "Kolom 3 nilai unik"],
        1, "Benar: selektif + besar. Tabel kecil/low-cardinality = full scan lebih cepat.")
    L.quiz("EXPLAIN menunjukkan SCAN pada tabel 100 juta baris. Artinya…",
        ["Normal", "Full scan — pertimbangkan index / memang butuh semua", "Error", "Index rusak"],
        1, "Benar: waspadai; tapi agregat penuh memang butuh scan.")
    L.quiz("WHERE strftime('%Y', tanggal) = '2026' dengan index tanggal…",
        ["Index terpakai", "Index TIDAK terpakai (tidak sargable)", "Error", "Lebih cepat"],
        1, "Benar: fungsi di kolom mematikan index.")
    L.quiz("Composite index (a, b) membantu…",
        ["WHERE b saja optimal", "WHERE a AND b (a dulu)", "ORDER BY c", "Tidak pernah"],
        1, "Benar: urutan penting — kolom pertama yang difilter.")
    L.quiz("Terlalu banyak index berakibat…",
        ["Selalu lebih cepat", "Write lambat + storage + planner bingung", "Tidak ada efek", "Error"],
        1, "Benar: index ada biayanya. Untuk pola query nyata saja.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>Index</strong> (B-tree) = daftar isi; untuk WHERE selektif/JOIN/ORDER BY.</li>"
        "<li><strong>EXPLAIN</strong>: SCAN vs SEARCH — diagnosis sebelum tebak.</li>"
        "<li><strong>5 aturan:</strong> sargable, kolom eksplisit, filter dulu, jangan tutupi, agregat di DB.</li>"
        "<li><strong>Jangan:</strong> index jaga-jaga; fungsi di kolom; optimasi prematur.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# ================================================================== C18
def c18():
    L = Lesson("c18-transaksi-acid", "C18 — SQL Engineering",
        "Transaksi &amp; ACID:<br/>Ketika Data Tidak Boleh Salah",
        "45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case",
        ("c17-index-explain", "← C17"), ("d1-python-dasar", "Next: D1 →"))
    L.sec("tujuan", "🎯 Tujuan Pembelajaran")
    L.raw('<div className="callout"><ul>'
        "<li>Menjelaskan <strong>ACID</strong>: Atomicity, Consistency, Isolation, Durability.</li>"
        "<li>Menulis <strong>BEGIN/COMMIT/ROLLBACK</strong> dengan benar.</li>"
        "<li>Membedakan <strong>isolation level</strong> dan anomali (dirty read, dsb).</li>"
        "<li>Menjelaskan implikasi untuk <strong>pipeline &amp; laporan</strong>.</li>"
        "</ul></div>")

    L.sec("cerita", "Cerita Pembuka: Transfer yang Setengah Jalan")
    L.raw('<div className="story"><p>Transfer Rp 10 juta: sistem mengurangi saldo A <strong>berhasil</strong>, menambah saldo B <strong>gagal</strong> (koneksi putus). Hasil: Rp 10 juta <em>hilang</em> — tidak di A, tidak di B. Tanpa transaksi, ini bisa terjadi setiap hari.</p>'
        "<p><strong>Transaksi database</strong> menjamin: <em>semua berhasil, atau semua batal</em> — tidak ada &ldquo;setengah jalan&rdquo;. Lesson penutup track SQL ini = fondasi keandalan data. Setelah ini: Track D (Python)!</p></div>")

    L.sec("acid", "ACID — Empat Jaminan")
    L.table(["Huruf", "Arti", "Contoh"],
        [["A — Atomicity", "Semua atau tidak sama sekali", "Transfer: debit+credit satu paket"],
         ["C — Consistency", "Aturan selalu terjaga", "Saldo tidak negatif; FK valid"],
         ["I — Isolation", "Transaksi konkuren tak saling ganggu", "Dua tarik tunai bersamaan"],
         ["D — Durability", "Yang di-commit tak hilang", "Mati lampu setelah commit = aman"]])
    L.raw(codebox("BEGIN;  -- mulai transaksi\n  UPDATE rekening SET saldo = saldo - 10000000 WHERE id = 'A';\n  UPDATE rekening SET saldo = saldo + 10000000 WHERE id = 'B';\nCOMMIT;  -- sukses: simpan permanen\n-- jika ada error di tengah: ROLLBACK;  -- batal semua", "sql"))
    L.ul([
        "<strong>BEGIN</strong> = mulai; <strong>COMMIT</strong> = sukses permanen; <strong>ROLLBACK</strong> = batal total.",
        "<strong>Di SQLite:</strong> tiap statement = transaksi sendiri (autocommit) kecuali BEGIN eksplisit.",
        "<strong>Di aplikasi:</strong> gunakan transaksi untuk operasi multi-statement yang harus atomik.",
    ])
    L.raw(myth("COMMIT membuat data langsung aman dari segala bencana.",
        "Durability = tahan crash (write-ahead log), bukan tahan <em>bencana</em> (kebakaran data center!). Butuh backup + replikasi untuk itu (C16). ACID ≠ disaster recovery."))
    L.raw(tip("Aturan praktis: <strong>satu unit bisnis = satu transaksi</strong>. Transfer = 1 transaksi. Pipeline load harian = 1 transaksi (gagal di tengah = rollback, bukan data setengah!)."))

    L.sec("isolation", "Isolation Level — Seberapa Terpisah?")
    L.p("Dua transaksi jalan bersamaan → anomali. Level menentukan proteksi (vs performa):")
    L.table(["Anomali", "Contoh", "Dicegah oleh"],
        [["Dirty read", "Baca data yang belum di-commit (lalu di-rollback!)", "READ COMMITTED+"],
         ["Non-repeatable read", "Baca 2× hasil beda (di-update orang)", "REPEATABLE READ+"],
         ["Phantom read", "Baris baru muncul di tengah hitung", "SERIALIZABLE"]])
    L.table(["Level", "Proteksi", "Kapan"],
        [["READ COMMITTED", "Anti dirty read", "Default umum; laporan biasa"],
         ["REPEATABLE READ", "+ baca konsisten", "Laporan yang hitung berulang"],
         ["SERIALIZABLE", "Maksimal (seolah serial)", "Transfer dana; kritis"]])
    L.p("<strong>Untuk analis:</strong> laporan yang angkanya &ldquo;berubah-ubah&rdquo; saat di-refresh = kemungkinan isolation rendah + data ditulis bersamaan. Solusi: baca dari <strong>snapshot</strong> (warehouse!) bukan tabel live.")
    L.raw(tip("Deadlock: dua transaksi saling tunggu (A kunci X tunggu Y; B kunci Y tunggu X). Database membunuh salah satu (error!) — aplikasi harus <strong>retry</strong>. Kenali error-nya agar tidak panik."))

    L.sec("pipeline", "Implikasi untuk Pipeline &amp; Laporan")
    L.ul([
        "<strong>Load atomik:</strong> ETL harian dalam 1 transaksi — gagal = tabel tetap kemarin (konsisten!), bukan setengah hari ini.",
        "<strong>Swap pola:</strong> tulis ke tabel_temp → dalam transaksi: DROP/Rename — pembaca tak pernah lihat tabel setengah jadi.",
        "<strong>Laporan konsisten:</strong> baca multi-tabel dalam 1 transaksi REPEATABLE READ — angka antar tabel cocok.",
        "<strong>Idempotensi:</strong> pipeline bisa di-rerun aman (C16 dbt: <code className=\"inline\">unique_key</code> merge!).",
    ])
    L.raw(codebox("-- pola swap atomik (pembaca tak pernah lihat setengah jadi)\nBEGIN;\n  DROP TABLE IF EXISTS mart_npl_old;\n  ALTER TABLE mart_npl RENAME TO mart_npl_old;\n  ALTER TABLE mart_npl_new RENAME TO mart_npl;\nCOMMIT;", "sql"))
    L.raw(myth("Transaksi membuat segalanya lambat.",
        "Transaksi <em>pendek</em> (detik) = murah. Yang mahal = transaksi <em>panjang</em> (menit, menahan lock). Aturan: <strong>transaksi sependek mungkin</strong> — jangan taruh sleep/API call di dalamnya!"))

    L.chart(
        data=[{"x": ["Tanpa transaksi", "Dengan transaksi"], "y": [50, 0], "type": "bar",
               "marker": {"color": ["#ef4444", "#34a853"]},
               "text": ["50 kasus/hari", "0"], "textposition": "outside"}],
        title="Insiden 'Setengah Jalan' per Hari (ilustrasi)",
        layout={"yaxis": {"title": "Kasus"}, "showlegend": False},
        cara="Kasus transfer gagal sebagian sebelum vs sesudah transaksi.",
        interpretasi="Transaksi menghilangkan <em>seluruh kelas</em> bug — bukan mengurangi, tapi <strong>menghilangkan</strong>. Inilah kekuatan jaminan (guarantee) vs usaha (best-effort). Pilih jaminan untuk uang orang.")

    L.sec("lab1", "🔬 Lab 1: ROLLBACK Menyelamatkan")
    L.lab("Lab 1 — Batalkan Transaksi",
        "BEGIN → INSERT nasabah baru → ROLLBACK. Buktikan barisnya hilang! Lalu ulangi dengan COMMIT.",
        lab_sql([("nasabah", NASABAH_DDL, NASABAH_ROWS)],
                "BEGIN",
                "SELECT COUNT(*) FROM nasabah"),
        "Cek COUNT(*) sebelum & sesudah. Ke mana perginya INSERT yang di-rollback?")
    L.raw(sql_answer("Jawaban Lab 1",
        "BEGIN;\nINSERT INTO nasabah VALUES (99, 'Zara', 'Jakarta', 10000000, 0, 'lancar');\nSELECT COUNT(*) FROM nasabah;  -- 11\nROLLBACK;\nSELECT COUNT(*) FROM nasabah;  -- 10 (hilang!)"))

    L.sec("lab2", "🔬 Lab 2: Transfer Atomik")
    L.lab("Lab 2 — Simulasi Transfer",
        "Tabel rekening(A: 50jt, B: 20jt). Transfer 10jt A→B dalam transaksi. Lalu simulasikan gagal di tengah + ROLLBACK.",
        lab_sql([("rekening", "CREATE TABLE rekening (id TEXT PRIMARY KEY, saldo REAL)", [("A", 50000000), ("B", 20000000)])],
                                "BEGIN",
                "SELECT * FROM rekening"),
        "Apa yang terjadi jika COMMIT setelah update pertama tapi sebelum kedua? (Jangan lakukan di produksi!)")
    L.raw(sql_answer("Jawaban Lab 2",
        "BEGIN;\nUPDATE rekening SET saldo = saldo - 10000000 WHERE id = 'A';\nUPDATE rekening SET saldo = saldo + 10000000 WHERE id = 'B';\nCOMMIT;\nSELECT * FROM rekening;  -- A:40jt, B:30jt (konsisten)"))

    L.sec("peta", "🗺️ Peta Keputusan: Transaksi")
    L.decision("1", "Multi-statement satu unit bisnis → <strong>transaksi</strong>",
        "Atomik.",
        kenapa="Semua atau tidak sama sekali.",
        contoh="Transfer dana.")
    L.decision("2", "Error di tengah → <strong>ROLLBACK</strong>",
        "Batal.",
        kenapa="Jangan biarkan setengah jalan.",
        contoh="Validasi gagal.")
    L.decision("3", "Load pipeline → <strong>1 transaksi / swap</strong>",
        "Konsisten.",
        kenapa="Gagal = data kemarin utuh.",
        contoh="ETL harian.")
    L.decision("4", "Laporan multi-tabel → <strong>REPEATABLE READ / snapshot</strong>",
        "Konsisten baca.",
        kenapa="Angka antar tabel cocok.",
        contoh="Laporan keuangan.")
    L.decision("5", "Transaksi panjang → <strong>pendekkan!</strong>",
        "Lock.",
        kenapa="Tahan lock = blokir orang lain.",
        contoh="Jangan sleep/API di dalam.")
    L.raw(callout("<h3>🧭 Aturan praktis 10 detik</h3><ol>"
        "<li>Satu unit bisnis = satu transaksi.</li>"
        "<li>Error → ROLLBACK, bukan &ldquo;lanjutkan&rdquo;.</li>"
        "<li>Transaksi sependek mungkin.</li>"
        "<li>Pipeline: idempoten + atomik.</li></ol>"))

    L.sec("case", "📋 Mini-Case: Pipeline Setengah Jalan")
    L.raw(callout("<p><strong>Situasi:</strong> ETL harian gagal di langkah 7 dari 10 (disk penuh). Tabel mart terisi <strong>setengah</strong> — dashboard menampilkan angka campur kemarin + hari ini. Direksi sudah screenshot.</p>"
        "<p><strong>Tugas:</strong> (1) Apa yang salah dari desain pipeline? (2) Rancang ulang dengan transaksi/swap. (3) Bagaimana mencegah &ldquo;sudah screenshot&rdquo; terulang? (4) Tulis penjelasan 3 kalimat untuk direksi.</p>"
        + worked("💡 Pembahasan (klik untuk buka)",
        "<p><strong>(1)</strong> Load langsung ke tabel live tanpa transaksi — gagal = setengah jadi terlihat.</p>"
        "<p><strong>(2)</strong> Tulis ke <code className=\"inline\">mart_new</code> → validasi (recon!) → <strong>swap atomik</strong> dalam transaksi. Gagal kapanpun = tabel live tetap kemarin.</p>"
        "<p><strong>(3)</strong> Dashboard baca dari tabel live saja + <strong>data freshness indicator</strong> (&ldquo;data per 06:00&rdquo;) — screenshot pun berlabel waktu.</p>"
        "<p><strong>(4)</strong> &ldquo;Pipeline gagal di tengah menyebabkan data tercampur. Kami beralih ke pola swap atomik: dashboard hanya melihat data yang lolos validasi penuh. Angka terkoreksi terlampir.&rdquo;</p>"
        "<p><strong>Pelajaran:</strong> keandalan = <strong>desain</strong>, bukan harapan. Transaksi + swap + recon = pipeline yang tidur nyenyak.</p>")))
    L.raw(callout("<h3>🎓 Track C Selesai!</h3><p>Kamu menempuh 19 lesson: SELECT → NULL → agregasi → fungsi → JOIN → subquery → CTE → himpunan → window (2 part) → pola analisis → cohort → rekursi → risk (DPD/fraud) → quality → modeling → index → ACID. <strong>Selanjutnya: Track D — Python for Data Analysis</strong>, di mana SQL bertemu Python (D15).</p>"))

    L.quiz("ACID: A = …",
        ["Akurat", "Atomicity — semua atau tidak sama sekali", "Asinkron", "Agregat"],
        1, "Benar: tidak ada &ldquo;setengah jalan&rdquo;.")
    L.quiz("Transfer: debit A sukses, kredit B gagal, tanpa transaksi…",
        ["Otomatis rollback", "Uang hilang (tidak di A, tidak di B)", "Otomatis retry", "Tidak mungkin"],
        1, "Benar: inilah yang dicegah transaksi.")
    L.quiz("Dirty read dicegah oleh…",
        ["READ UNCOMMITTED", "READ COMMITTED ke atas", "Tidak bisa", "ROLLBACK"],
        1, "Benar: jangan baca yang belum di-commit.")
    L.quiz("Isolation tertinggi…",
        ["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE", "READ UNCOMMITTED"],
        2, "Benar: seolah serial — maksimal proteksi, maksimal biaya.")
    L.quiz("Pola load pipeline yang aman…",
        ["Langsung ke tabel live", "Tulis ke tabel baru → validasi → swap atomik", "Hapus dulu baru isi", "Tanpa transaksi lebih cepat"],
        1, "Benar: pembaca tak pernah lihat setengah jadi.")
    L.quiz_section()

    L.sec("rangkum", "📝 Rangkuman")
    L.raw('<div className="callout"><ul>'
        "<li><strong>ACID:</strong> Atomicity, Consistency, Isolation, Durability.</li>"
        "<li><strong>BEGIN/COMMIT/ROLLBACK:</strong> satu unit bisnis = satu transaksi.</li>"
        "<li><strong>Isolation:</strong> dirty/non-repeatable/phantom read; level = trade-off proteksi vs performa.</li>"
        "<li><strong>Pipeline:</strong> atomik + swap + idempoten; laporan dari snapshot.</li>"
        "<li><strong>Track C selesai — 19 lesson!</strong> Lanjut D: Python.</li>"
        "</ul></div>")
    errs = qa_lesson(L)
    assert not errs, errs
    LESSONS.append(L)

# alias untuk gen_all ORDER
c9_1 = c91
c9_2 = c92

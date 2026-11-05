import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C4FungsiTanggalStringPage() {
  const chart1 = [{"x": ["2026-09-01", "2026-09-05", "2026-09-10", "2026-09-15", "2026-09-20", "2026-09-25"], "y": [1750000, 575000, 2000000, 1200000, 1030000, 400000], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["1,75jt", "0,58jt", "2jt", "1,2jt", "1,03jt", "0,4jt"], "textposition": "outside"}];
  const lab1Code = String.raw`import sqlite3
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
db.commit()

def q(sql):
    """Jalankan query SQL, cetak hasilnya."""
    cur.execute(sql)
    rows = cur.fetchall()
    if cur.description:
        cols = [d[0] for d in cur.description]
        header = " | ".join(cols)
        print(header)
        print("-" * len(header))
        for r in rows:
            print(" | ".join("NULL" if v is None else str(v) for v in r))
        print(f"({len(rows)} baris)")
    else:
        print("OK")
# --- TUGAS ---
# SELECT id, tanggal, jumlah FROM transaksi WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01' ORDER BY tanggal
q("""SELECT id, tanggal, jumlah FROM transaksi""")`;
  const lab2Code = String.raw`import sqlite3
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
db.commit()

def q(sql):
    """Jalankan query SQL, cetak hasilnya."""
    cur.execute(sql)
    rows = cur.fetchall()
    if cur.description:
        cols = [d[0] for d in cur.description]
        header = " | ".join(cols)
        print(header)
        print("-" * len(header))
        for r in rows:
            print(" | ".join("NULL" if v is None else str(v) for v in r))
        print(f"({len(rows)} baris)")
    else:
        print("OK")
# --- TUGAS ---
# SELECT UPPER(nama || ' (' || kota || ')') AS label, SUBSTR(nama,1,3) || id AS kode FROM nasabah
q("""SELECT nama, kota FROM nasabah""")`;
  const quizData = [{"question": "Filter &ldquo;September 2026&rdquo; yang benar untuk kolom timestamp…", "options": ["WHERE tanggal LIKE '2026-09%'", "WHERE tanggal >= '2026-09-01' AND tanggal < '2026-10-01'", "WHERE MONTH(tanggal)=9", "WHERE tanggal BETWEEN '2026-09-01' AND '2026-09-30'"], "correct": 1, "explanation": "Benar: setengah-terbuka — menangkap semua jam di 30 Sep, sargable."}, {"question": "WHERE strftime('%Y-%m', tanggal) = '2026-09' pada tabel besar…", "options": ["Cepat (pakai index)", "Lambat — fungsi di kolom mematikan index", "Error", "Sama saja"], "correct": 1, "explanation": "Benar: tidak sargable → full scan. Tulis ulang dengan kolom polos."}, {"question": "SELECT 'A' || NULL menghasilkan…", "options": ["'A'", "NULL", "''", "Error"], "correct": 1, "explanation": "Benar: NULL merambat di ||. Bungkus dengan COALESCE jika perlu."}, {"question": "SUBSTR('Jakarta', 1, 3) di SQLite…", "options": ["'aka'", "'Jak'", "'Jakar'", "Error"], "correct": 1, "explanation": "Benar: 1-based — 3 karakter pertama."}, {"question": "BETWEEN '2026-09-01' AND '2026-09-30' untuk timestamp…", "options": ["Aman", "Kehilangan data 30 Sep setelah jam 00:00", "Melebihi ke Oktober", "Error"], "correct": 1, "explanation": "Benar: batas atas = 30 Sep 00:00:00. Pakai pola setengah-terbuka."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C4 — SQL</span>
        <h1 className="display-title">Tanggal &amp; Teks: Fungsi yang<br/>Menyelamatkan Sehari-hari</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laporan Bulanan yang Salah Sebulan</a></li>
          <li><a href="#tanggal">Fungsi Tanggal — Ekstrak, Selisih, Bulatkan</a></li>
          <li><a href="#sargable">Sargable — Tulis agar Index Terpakai</a></li>
          <li><a href="#string">Fungsi String — Bersihkan &amp; Bentuk Teks</a></li>
          <li><a href="#zona">Zona Waktu &amp; Format — Jebakan Klasik</a></li>
          <li><a href="#lab1">🔬 Lab 1: Transaksi September</a></li>
          <li><a href="#lab2">🔬 Lab 2: Label Nasabah</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Fungsi</a></li>
          <li><a href="#case">📋 Mini-Case: &ldquo;Kenapa Laporan September Beda?&rdquo;</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Memanipulasi <strong>tanggal</strong>: ekstraksi, selisih, pembulatan ke bulan.</li><li>Menulis filter tanggal yang <strong>sargable</strong> (bisa pakai index).</li><li>Memanipulasi <strong>string</strong>: UPPER/LOWER, SUBSTR, ||, TRIM, REPLACE.</li><li>Menghindari jebakan <strong>zona waktu</strong> dan format tanggal.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Laporan Bulanan yang Salah Sebulan</h2>

      <div className="story"><p>Analis menulis laporan &ldquo;transaksi September&rdquo;: <code className="inline">WHERE tanggal LIKE '2026-09%'</code>. Hasilnya benar... sampai database migrasi dan format tanggal berubah. Di database lain, ia menulis <code className="inline">WHERE MONTH(tanggal) = 9</code> — benar juga, tapi query 2 juta baris yang tadinya 2 detik jadi <strong>40 detik</strong> karena index tidak terpakai.</p><p>Fungsi tanggal/string dipakai di <strong>setiap</strong> query analisis — dan cara pakainya menentukan benar/salah + cepat/lambat. Lesson ini: cara yang benar.</p><p><strong>Twist-nya:</strong> LIKE &lsquo;2026-09%&rsquo; &ldquo;berhasil&rdquo; — sampai database migrasi dan ia diam-diam salah. MONTH() &ldquo;berhasil&rdquo; — tapi 20× lebih lambat. Dua-duanya benar secara <em>hasil</em>, salah secara <em>engineering</em>. Di SQL, &ldquo;query-nya jalan&rdquo; ≠ &ldquo;query-nya benar&rdquo;: ada dimensi kedua bernama &ldquo;tetap benar setelah migrasi&rdquo; dan dimensi ketiga bernama &ldquo;tetap cepat di 2 juta baris&rdquo;.</p></div>

      <h2 id="tanggal">Fungsi Tanggal — Ekstrak, Selisih, Bulatkan</h2>

      <p>SQLite (lab) memakai fungsi sederhana; konsepnya sama di semua database:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- ekstraksi
SELECT date(tanggal) AS tgl,
       strftime(&#x27;%Y-%m&#x27;, tanggal) AS bulan,
       strftime(&#x27;%w&#x27;, tanggal) AS hari_ke
FROM transaksi;

-- selisih hari
SELECT julianday(&#x27;2026-09-30&#x27;) - julianday(tanggal) AS umur_hari
FROM transaksi;

-- transaksi 7 hari terakhir (relatif terhadap hari ini)
SELECT * FROM transaksi
WHERE tanggal &gt;= date(&#x27;now&#x27;, &#x27;-7 days&#x27;);</pre>

      <ul>
<li><strong>Ekstraksi:</strong> tahun/bulan/hari untuk GROUP BY per bulan (laporan!).</li>
<li><strong>Selisih:</strong> umur transaksi, DPD dihitung dari tanggal jatuh tempo.</li>
<li><strong>Relatif:</strong> <code className="inline">date('now', '-7 days')</code> — laporan &ldquo;7 hari terakhir&rdquo; tanpa hardcode tanggal.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Filter tanggal yang benar: <code className="inline">WHERE tanggal &gt;= '2026-09-01' AND tanggal &lt; '2026-10-01'</code> — pola <strong>setengah-terbuka</strong> [awal, akhir). Menangani jam/menit/detik dengan benar, tidak seperti BETWEEN yang bisa kehilangan/kelebihan di batas.</p>
</div>

      <h2 id="sargable">Sargable — Tulis agar Index Terpakai</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- LAMBAT: fungsi di kolom = index tidak terpakai (full scan)
SELECT * FROM transaksi WHERE strftime(&#x27;%Y-%m&#x27;, tanggal) = &#x27;2026-09&#x27;;

-- CEPAT: kolom polos di satu sisi
SELECT * FROM transaksi
WHERE tanggal &gt;= &#x27;2026-09-01&#x27; AND tanggal &lt; &#x27;2026-10-01&#x27;;</pre>

      <p><strong>Aturan:</strong> jangan bungkus kolom ter-index dengan fungsi di WHERE. Tulis ulang agar <strong>kolom polos</strong> dibandingkan dengan nilai. Ini satu-satunya optimasi yang perlu dihafal pemula — sisanya topik C17.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Fungsi di WHERE tidak masalah untuk data kecil.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Benar untuk 10 baris lab — tapi kebiasaan ini terbawa ke tabel 100 juta baris dan bikin query timeout di produksi. Latih pola sargable dari sekarang; gratis untuk data kecil, menyelamatkan untuk data besar.</p>
</div>

      <h2 id="string">Fungsi String — Bersihkan &amp; Bentuk Teks</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT UPPER(kota) AS kota_besar,          -- JAKARTA
       LOWER(nama) AS nama_kecil,          -- andi
       SUBSTR(nama, 1, 3) AS inisial,       -- And
       nama || &#x27; (&#x27; || kota || &#x27;)&#x27; AS label,-- Andi (Jakarta)
       LENGTH(nama) AS pjg,
       TRIM(&#x27;  Andi  &#x27;) AS rapi
FROM nasabah;</pre>

      <ul>
<li><code className="inline">||</code> = sambung string (concat). <strong>Awas:</strong> NULL || 'x' = NULL!</li>
<li><code className="inline">SUBSTR(x, 1, 3)</code> = 3 karakter pertama (SQLite 1-based!).</li>
<li><code className="inline">TRIM/LTRIM/RTRIM</code> = buang spasi — data kotor sering punya spasi liar.</li>
<li><code className="inline">REPLACE(kota, 'Jakarta', 'JKT')</code> = ganti teks.</li>
</ul>

      <p><strong>Kapan dipakai:</strong> standardisasi (UPPER untuk perbandingan case-insensitive), parsing kode (SUBSTR kode produk), label chart (||).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Perbandingan case-insensitive yang aman: <code className="inline">WHERE UPPER(kota) = 'JAKARTA'</code> — tapi ingat sargable! Untuk kolom besar, lebih baik standardisasi <em>saat ingest</em> (C15/C16), bukan di setiap query.</p>
</div>

      <h2 id="zona">Zona Waktu &amp; Format — Jebakan Klasik</h2>

      <ul>
<li><strong>Simpan sebagai TIMESTAMP WITH TIME ZONE</strong> (atau UTC). Jangan simpan sebagai string 'DD/MM/YYYY' — tidak bisa diurut/di-filter benar.</li>
<li><strong>Jangan asumsikan zona:</strong> '2026-09-01 00:00' di Jakarta ≠ di server UTC. Konversi eksplisit saat tampil.</li>
<li><strong>Format tampil ≠ format simpan:</strong> simpan sebagai tipe date/timestamp, format (strftime/TO_CHAR) hanya saat SELECT untuk laporan.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Tanggal sebagai string 'YYYY-MM-DD' cukup aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Untuk <em>sort/filter</em> memang urut alfabetis = urut kronologis — tapi kamu kehilangan validasi ('2026-13-99' lolos!), aritmetika tanggal, dan timezone. Pakai tipe DATE/TIMESTAMP; string hanya untuk tampil.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Total Transaksi per 5 Hari (GROUP BY tanggal)"
  layout={{"xaxis": {"title": "Tanggal"}, "yaxis": {"title": "Rupiah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = tanggal (hasil date(tanggal)), tinggi = SUM(jumlah).</p>
<p><strong>Interpretasi:</strong> Agregasi waktu = fondasi semua time-series (B14!). <strong>Perhatikan</strong> tanggal tanpa transaksi (02–04 Sep) tidak muncul — GROUP BY hanya menampilkan yang ada. Untuk chart kontinu, butuh <em>date spine</em> (C9/C16).</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Fungsi tanggal = benar + cepat; salah tulis = salah atau lambat.</p>

            <details className="worked">
              <summary>📐 Kasus 1: &ldquo;Transaksi September&rdquo; — tiga cara, satu yang benar</summary>
              <p>Tabel <code className="inline">transaksi(id, tanggal DATE, nominal)</code>, 2 juta baris, index di <code className="inline">tanggal</code>. Ambil transaksi September 2026.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- CARA 1 (rapuh): pecah jika format berubah
      WHERE tanggal LIKE &#x27;2026-09%&#x27;;
      -- CARA 2 (lambat): fungsi di kolom = index mati -&gt; 40 detik
      WHERE MONTH(tanggal) = 9 AND YEAR(tanggal) = 2026;
      -- CARA 3 (benar &amp; cepat): rentang tanggal -&gt; index hidup -&gt; 2 detik
      WHERE tanggal &gt;= &#x27;2026-09-01&#x27; AND tanggal &lt; &#x27;2026-10-01&#x27;;</pre>
              <p><strong>Bedah:</strong> Cara 3 = pola &ldquo;setengah terbuka&rdquo; [awal, akhir): mencakup 1 Sep 00:00:00 s.d. 30 Sep 23:59:59 <em>termasuk</em> pecahan detik. Sargable (C17): jangan bungkus kolom ber-index dengan fungsi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Umur piutang — selisih tanggal</summary>
              <p>Hitung &ldquo;hari sejak jatuh tempo&rdquo; per kredit, dan tandai yang &gt; 30 hari.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT id,
             CURRENT_DATE - jatuh_tempo AS hari_terlambat,
             CASE WHEN CURRENT_DATE - jatuh_tempo &gt; 30 THEN &#x27;kolek-2+&#x27;
                  WHEN CURRENT_DATE - jatuh_tempo &gt; 0  THEN &#x27;kolek-1&#x27;
                  ELSE &#x27;lancar&#x27; END AS bucket
      FROM kredit;</pre>
              <p><strong>Bedah:</strong> selisih DATE − DATE = integer hari (Postgres). <code className="inline">CURRENT_DATE</code> (bukan NOW()) agar tidak ada komponen jam yang menggeser hitungan. Bucketing tanggal = fondasi DPD (C13!).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Bersihkan nomor HP berantakan</summary>
              <p>Kolom <code className="inline">hp</code> berisi: &#x27;0812-3456-7890&#x27;, &#x27;+62 812 3456 7890&#x27;, &#x27;81234567890&#x27;. Seragamkan jadi &#x27;0812…&#x27; — dengan pola &ldquo;normalisasi dulu, aturan kemudian&rdquo;:</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH bersih AS (
        SELECT hp, REGEXP_REPLACE(hp, &#x27;[^0-9]&#x27;, &#x27;&#x27;, &#x27;g&#x27;) AS digit
        FROM nasabah
      )
      SELECT hp,
             CASE WHEN digit LIKE &#x27;62%&#x27; THEN &#x27;0&#x27; || SUBSTRING(digit, 3)
                  WHEN digit LIKE &#x27;0%&#x27;  THEN digit
                  ELSE &#x27;0&#x27; || digit END AS hp_bersih
      FROM bersih;</pre>
              <p><strong>Bedah:</strong> pola &ldquo;normalisasi dulu, aturan kemudian&rdquo;: satu REGEXP_REPLACE menaklukkan semua varian format. String kotor = musuh JOIN (&#x27;0812…&#x27; ≠ &#x27;+62…&#x27; padahal orang yang sama!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Transaksi September</h2>

      <p>Tampilkan transaksi September 2026 (id, tanggal, jumlah) dengan pola setengah-terbuka. Urut tanggal.</p>

      <PyodideLab
  title="Lab 1 — Filter Tanggal Sargable"
  hint="Hitung total per hari: SELECT date(tanggal), SUM(jumlah) ... GROUP BY 1."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT id, tanggal, jumlah
FROM transaksi
WHERE tanggal &gt;= &#x27;2026-09-01&#x27; AND tanggal &lt; &#x27;2026-10-01&#x27;
ORDER BY tanggal;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Label Nasabah</h2>

      <p>Buat kolom <code className="inline">label</code> = 'NAMA (KOTA)' huruf kapital, dan <code className="inline">kode</code> = 3 huruf pertama nama + id.</p>

      <PyodideLab
  title="Lab 2 — String untuk Laporan"
  hint="Kenapa UPPER(nama || ...) bukan UPPER(nama) || ...? (Pikirkan NULL!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT UPPER(nama || &#x27; (&#x27; || kota || &#x27;)&#x27;) AS label,
       SUBSTR(nama, 1, 3) || id AS kode
FROM nasabah;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Fungsi</h2>

      <div className="decision-card">
<h3>1. Filter tanggal → <strong>kolom polos + rentang [awal, akhir)</strong></h3>
<p><strong>Kondisi data:</strong> Laporan periode.</p>
<p><strong>Kenapa:</strong> Sargable (index terpakai); BETWEEN berisiko di batas waktu.</p>
<p><strong>Contoh nyata:</strong> WHERE tanggal &gt;= '2026-09-01' AND tanggal &lt; '2026-10-01'.</p>
</div>

      <div className="decision-card">
<h3>2. Kelompokkan per bulan → <strong>strftime/TO_CHAR di SELECT</strong></h3>
<p><strong>Kondisi data:</strong> Tren bulanan.</p>
<p><strong>Kenapa:</strong> Fungsi di SELECT (bukan WHERE) = aman.</p>
<p><strong>Contoh nyata:</strong> SELECT strftime('%Y-%m', tanggal) AS bulan, ... GROUP BY 1.</p>
</div>

      <div className="decision-card">
<h3>3. Umur/selisih → <strong>aritmetika tanggal</strong></h3>
<p><strong>Kondisi data:</strong> DPD, umur transaksi.</p>
<p><strong>Kenapa:</strong> Jangan hitung manual — pakai fungsi date.</p>
<p><strong>Contoh nyata:</strong> julianday(...) - julianday(...).</p>
</div>

      <div className="decision-card">
<h3>4. Standardisasi teks → <strong>UPPER/LOWER/TRIM</strong></h3>
<p><strong>Kondisi data:</strong> Perbandingan case-insensitive, data kotor.</p>
<p><strong>Kenapa:</strong> Tapi standardisasi permanen sebaiknya saat ingest.</p>
<p><strong>Contoh nyata:</strong> WHERE UPPER(kota) = 'JAKARTA'.</p>
</div>

      <div className="decision-card">
<h3>5. Bentuk label → <strong>|| dan SUBSTR</strong></h3>
<p><strong>Kondisi data:</strong> Label chart/laporan.</p>
<p><strong>Kenapa:</strong> Awas NULL merambat di ||.</p>
<p><strong>Contoh nyata:</strong> nama || ' (' || kota || ')'.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Tanggal: <strong>tipe DATE</strong>, filter <strong>setengah-terbuka</strong>, kolom polos di WHERE.</li><li>Jangan bungkus kolom ter-index dengan fungsi di WHERE.</li><li>String: || untuk gabung (awas NULL), SUBSTR 1-based di SQLite.</li><li>Zona waktu: simpan UTC, konversi saat tampil.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: &ldquo;Kenapa Laporan September Beda?&rdquo;</h2>

      <div className="callout">
<p>Dua analis melaporkan &ldquo;total transaksi September&rdquo;: Analis A (WHERE LIKE '2026-09%') = 8,2jt; Analis B (WHERE tanggal BETWEEN '2026-09-01' AND '2026-09-30') = 8,2jt; tapi dashboard (filter &gt;= 09-01 AND &lt; 10-01) = 8,6jt. Selisih 400rb — transaksi tanggal 2026-09-30 <strong>jam 15:00</strong>.</p><p><strong>Pertanyaan:</strong> kenapa BETWEEN kehilangan transaksi itu? Tulis filter yang benar.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Penyebab:</strong> <code className="inline">BETWEEN '2026-09-01' AND '2026-09-30'</code> = hingga '2026-09-30 00:00:00' — transaksi jam 15:00 di tanggal 30 <strong>lebih besar</strong> dari batas! LIKE lolos karena perbandingan string, tapi rapuh terhadap format.</p><p><strong>Benar:</strong> <code className="inline">WHERE tanggal &gt;= '2026-09-01' AND tanggal &lt; '2026-10-01'</code> — pola setengah-terbuka menangkap semua jam di tanggal 30. <strong>Pelajaran:</strong> BETWEEN untuk tanggal ber-jam = jebakan; setengah-terbuka selalu aman.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Tulis query sargable untuk transaksi Q1 2026 (Jan–Mar) dari tabel ber-index <code className="inline">tanggal</code>.</li>
              <li>Hitung &ldquo;umur nasabah&rdquo; dalam tahun dari <code className="inline">tgl_lahir</code> (hati-hati: yang ulang tahunnya belum lewat tahun ini!).</li>
              <li>Kolom <code className="inline">nama</code> ada yang &#x27;  BUDI  &#x27; (spasi + kapital). Tulis ekspresi untuk &#x27;Budi&#x27; rapi.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1. Sargable: rentang setengah terbuka, tanpa fungsi di kolom
      SELECT * FROM transaksi
      WHERE tanggal &gt;= &#x27;2026-01-01&#x27; AND tanggal &lt; &#x27;2026-04-01&#x27;;
      -- 2. Umur tepat (Postgres):
      SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, tgl_lahir))::int AS umur
      FROM nasabah;  -- AGE menangani &quot;ulang tahun belum lewat&quot; dengan benar
      -- 3.
      SELECT INITCAP(TRIM(nama)) AS nama_rapi FROM nasabah;
      -- TRIM buang spasi tepi; INITCAP: Budi (kapital di tiap kata)</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Tanggal:</strong> ekstrak (strftime), selisih (julianday), relatif (date('now')).</li><li><strong>Filter:</strong> pola setengah-terbuka [awal, akhir) — sargable, aman di batas jam.</li><li><strong>String:</strong> UPPER/LOWER, SUBSTR, ||, TRIM, REPLACE.</li><li><strong>Jangan:</strong> fungsi di kolom ter-index (WHERE); tanggal sebagai string; abaikan timezone.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c3-agregasi-groupby" className="btn btn-secondary btn-sm">← ← C3</Link>
        <Link href="/learn/c5-join" className="btn btn-primary btn-sm">Next: C5 →</Link>
      </div>
    </div>
  );
}

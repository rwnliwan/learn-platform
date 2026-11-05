import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C15DataQualityPage() {
  const chart1 = [{"x": ["Completeness", "Uniqueness", "Validity", "Consistency", "Timeliness"], "y": [90, 100, 95, 80, 100], "type": "bar", "marker": {"color": ["#e8a838", "#34a853", "#e8a838", "#ef4444", "#34a853"]}, "text": ["90%", "100%", "95%", "80%!", "100%"], "textposition": "outside"}];
  const lab1Code = String.raw`import sqlite3
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
# SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi FROM nasabah
q("""SELECT * FROM nasabah WHERE status = 'lancar' AND dpd > 0""")`;
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
# SELECT 'sumber' AS s, COUNT(*) FROM nasabah UNION ALL SELECT 'target', COUNT(*) FROM (SELECT * FROM nasabah WHERE id <> 5)
q("""SELECT COUNT(*) FROM nasabah""")`;
  const quizData = [{"question": "Cek pertama untuk tabel baru…", "options": ["Langsung analisis", "Template 6 dimensi (completeness → timeliness)", "Visualisasi", "Minta dokumentasi"], "correct": 1, "explanation": "Benar: 15 menit audit menghemat berhari-hari debug."}, {"question": "status='lancar' tapi dpd>0 melanggar dimensi…", "options": ["Completeness", "Consistency", "Timeliness", "Uniqueness"], "correct": 1, "explanation": "Benar: aturan bisnis dilanggar = inkonsisten."}, {"question": "Recon Level 2 (agregat) menangkap yang tidak ditangkap Level 1…", "options": ["Tidak ada", "Duplikat & nilai berubah (count sama, isi beda)", "Baris hilang", "Skema berubah"], "correct": 1, "explanation": "Benar: count sama tapi SUM beda = ada yang berubah/digandakan."}, {"question": "EXCEPT dua arah untuk…", "options": ["Dedup", "Temukan tepat baris mana yang hilang/berbeda", "Pivot", "Ranking"], "correct": 1, "explanation": "Benar: Level 3 recon = investigasi presisi."}, {"question": "Test 'relationships' memeriksa…", "options": ["Tipe data", "FK tidak yatim (ada di tabel induk)", "Kecepatan", "Jumlah kolom"], "correct": 1, "explanation": "Benar: referential integrity."}, {"question": "Cara melaporkan temuan quality ke bisnis…", "options": ["&ldquo;Data bermasalah&rdquo;", "Skor per dimensi + dampak Rp", "Diam saja", "Salahkan engineer"], "correct": 1, "explanation": "Benar: skor + dampak = bahasa yang menggerakkan anggaran."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C15 — SQL Engineering</span>
        <h1 className="display-title">Data Quality: Percaya<br/>tapi Verifikasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laporan Direksi yang Salah Rp 2 Miliar</a></li>
          <li><a href="#dimensi">6 Dimensi Quality Check</a></li>
          <li><a href="#recon">Reconciliation — Cocokkan Sumber vs Target</a></li>
          <li><a href="#test">Test Suite untuk Pipeline</a></li>
          <li><a href="#lab1">🔬 Lab 1: Audit 6 Dimensi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Reconciliation</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Quality</a></li>
          <li><a href="#case">📋 Mini-Case: Laporan Rp 2 Miliar (45+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjalankan <strong>6 dimensi cek kualitas</strong>: completeness, uniqueness, validity, consistency, timeliness, accuracy.</li><li>Menulis <strong>reconciliation query</strong> (cocokkan sumber vs target).</li><li>Merancang <strong>test suite</strong> untuk pipeline (konsep dbt test).</li><li>Menjelaskan biaya <strong>data buruk</strong> dalam bahasa bisnis.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Laporan Direksi yang Salah Rp 2 Miliar</h2>

      <div className="story"><p>Laporan keuangan kuartalan: total penyaluran Rp 48 miliar. Audit menemukan: <strong>Rp 2 miliar double-count</strong> dari duplikat + <strong>300 debitur hilang</strong> dari filter NULL yang salah. Laporan ditarik, direksi malu, analis dimutasi.</p><p>Akar masalah: <strong>tidak ada quality check</strong> di pipeline. Data quality bukan &ldquo;nice to have&rdquo; — ia <em>asuransi karir</em>. Lesson ini: cek standar yang memisahkan analis amatir dari profesional.</p><p><strong>Twist-nya:</strong> Rp2 miliar double-count + 300 debitur hilang — bukan karena analisnya bodoh, melainkan karena tidak ada yang <em>mengecek</em>. Quality check memakan 10 menit; tanpanya, laporan Rp48 miliar ditarik, direksi malu, karir melayang. Asuransi termurah di industri data bukanlah tools mahal — melainkan query validasi yang dijalankan <em>sebelum</em> laporan dikirim. Profesional = paranoid yang sistematis.</p></div>

      <h2 id="dimensi">6 Dimensi Quality Check</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1. COMPLETENESS: ada yang hilang?
SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi,
  COUNT(*) - COUNT(penghasilan) AS hilang
FROM nasabah;

-- 2. UNIQUENESS: ada duplikat?
SELECT id, COUNT(*) FROM nasabah GROUP BY id HAVING COUNT(*) &gt; 1;

-- 3. VALIDITY: nilai di luar domain?
SELECT * FROM nasabah WHERE dpd &lt; 0 OR dpd &gt; 3650;
SELECT * FROM nasabah WHERE kota NOT IN (&#x27;Jakarta&#x27;,&#x27;Bandung&#x27;,&#x27;Surabaya&#x27;,&#x27;Medan&#x27;);</pre>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 4. CONSISTENCY: aturan bisnis dilanggar?
-- status &#x27;lancar&#x27; tapi dpd &gt; 0 = inkonsisten!
SELECT * FROM nasabah WHERE status = &#x27;lancar&#x27; AND dpd &gt; 0;

-- 5. TIMELINESS: data terbaru kapan? (staleness)
SELECT MAX(tanggal) AS terakhir, julianday(&#x27;now&#x27;) - julianday(MAX(tanggal)) AS umur_hari
FROM transaksi;

-- 6. ACCURACY: cocokkan dengan sumber kebenaran
-- (reconciliation di bawah)</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Jadikan 6 cek ini <strong>template</strong> untuk setiap tabel baru yang kamu terima. 15 menit menjalankan template ini menghemat berhari-hari debugging &ldquo;kok angkanya aneh&rdquo;.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Data quality = tanggung jawab data engineer.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Semua orang yang menyentuh data bertanggung jawab! Analis yang memakai data tanpa cek = ikut salah saat laporan salah. Pepatah: &ldquo;garbage in, garbage out&rdquo; — tapi yang disalahkan tetap yang presentasi.</p>
</div>

      <h2 id="recon">Reconciliation — Cocokkan Sumber vs Target</h2>

      <p>Setelah ETL/pipeline: apakah target = sumber? Tiga level:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Level 1: row count
SELECT &#x27;sumber&#x27; AS s, COUNT(*) FROM transaksi_src
UNION ALL
SELECT &#x27;target&#x27;, COUNT(*) FROM transaksi;

-- Level 2: agregat kunci (checksum sederhana)
SELECT SUM(jumlah), COUNT(DISTINCT nasabah_id) FROM transaksi_src
UNION ALL
SELECT SUM(jumlah), COUNT(DISTINCT nasabah_id) FROM transaksi;

-- Level 3: baris yang hilang/berbeda (EXCEPT dua arah!)
(SELECT id FROM transaksi_src EXCEPT SELECT id FROM transaksi)
UNION ALL
(SELECT id FROM transaksi EXCEPT SELECT id FROM transaksi_src);</pre>

      <ul>
<li><strong>Level 1</strong> (count): cepat, menangkap kehilangan besar.</li>
<li><strong>Level 2</strong> (sum/distinct): menangkap duplikat & nilai berubah.</li>
<li><strong>Level 3</strong> (EXCEPT): tepat baris mana — untuk investigasi.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan pipeline: <strong>tidak ada data yang pindah tanpa reconciliation</strong>. Jadikan recon sebagai gerbang (gate): jika selisih &gt; toleransi → pipeline FAIL, jangan lanjut. Ini praktik dbt test (C16).</p>
</div>

      <h2 id="test">Test Suite untuk Pipeline</h2>

      <p>Konsep dari dbt (data build tool) — test sebagai kode, jalan otomatis tiap pipeline:</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Test</th><th>Contoh</th><th>Menangkap</th></tr></thead>
<tbody>
<tr><td>unique</td><td>id unik</td><td>Duplikat</td></tr>
<tr><td>not_null</td><td>nama tidak null</td><td>Hilang</td></tr>
<tr><td>accepted_values</td><td>status in (...)</td><td>Nilai liar</td></tr>
<tr><td>relationships</td><td>nasabah_id ada di nasabah</td><td>Orphan FK</td></tr>
<tr><td>custom SQL</td><td>SUM(src) = SUM(tgt)</td><td>Recon gagal</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- relationships: kredit yatim (nasabah_id tak ada di nasabah)
SELECT k.* FROM kredit k
LEFT JOIN nasabah n ON n.id = k.nasabah_id
WHERE n.id IS NULL;

-- custom: total harian tidak boleh turun (monotonik append-only)
WITH h AS (SELECT date(tanggal) d, SUM(jumlah) s FROM transaksi GROUP BY 1)
SELECT * FROM h WHERE s &lt; 0;  -- negatif = anomali</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Mulai dari 5 test generik (unique, not_null, accepted_values, relationships, row count) — mencakup 80% masalah. Tambah custom test untuk aturan bisnis spesifik.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Test memperlambat delivery.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Test memperlambat <em>sekarang</em> 10 menit, menghemat <em>nanti</em> berhari-hari + reputasi. Tim yang tidak test = tim yang debugging di produksi — dengan direksi menonton.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Skor Quality per Dimensi (ilustrasi audit)"
  layout={{"yaxis": {"title": "Skor %", "range": [0, 105]}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi = skor tiap dimensi quality check.</p>
<p><strong>Interpretasi:</strong> <strong>Consistency 80%</strong> = lampu merah: aturan bisnis dilanggar (status vs dpd tak cocok). Quality dashboard seperti ini = <em>bahasa bersama</em> analis–engineer–bisnis. Tanpa skor, &ldquo;data bermasalah&rdquo; hanya keluhan; dengan skor, ia <em>tugas terukur</em>.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Quality check = 10 menit yang menyelamatkan karir.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Rekonsiliasi — Rp48M vs Rp46M</summary>
              <p>Laporan: total penyaluran Rp48M. Tabel sumber: SUM = Rp46M. Selisih Rp2M. Di mana?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Cek 1: duplikat?
      SELECT id, COUNT(*) FROM penyaluran GROUP BY id HAVING COUNT(*) &gt; 1;
      -- &gt; 200 id ganda! (Rp2M double-count)
      -- Cek 2: NULL yang hilang?
      SELECT COUNT(*), COUNT(tanggal) FROM penyaluran;
      -- Cek 3: filter tanggal bocor?
      SELECT MIN(tanggal), MAX(tanggal) FROM penyaluran;</pre>
              <p><strong>Bedah:</strong> urutan diagnosis: (1) duplikat via GROUP BY+HAVING, (2) NULL via COUNT(*) vs COUNT(kolom), (3) rentang via MIN/MAX. Tiga query 30 detik menemukan Rp2M yang hilang. <strong>Aturan:</strong> setiap angka laporan harus bisa di-rekon ke sumber — selisih &gt; 0 = investigasi, bukan &ldquo;pembulatan&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Distribusi aneh — detektor otomatis</summary>
              <p>Kolom <code className="inline">dpd</code>: min −5?? max 9999?? Tulis quality check generik yang menangkap ini.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT
        COUNT(*) AS n,
        COUNT(*) - COUNT(dpd) AS nulls,
        MIN(dpd) AS min_dpd,          -- &lt; 0 = aneh!
        MAX(dpd) AS max_dpd,          -- 9999 = sentinel &quot;tak terhingga&quot;?
        AVG(dpd) AS avg_dpd,
        SUM(CASE WHEN dpd &lt; 0 THEN 1 ELSE 0 END) AS negatif
      FROM kredit;
      -- min=-5: data entry salah / logika bisnis bocor
      -- max=9999: kode sentinel (bukan 9999 hari!) -&gt; dokumentasikan &amp; tangani</pre>
              <p><strong>Bedah:</strong> MIN/MAX/AVG per kolom numerik = &ldquo;bau&rdquo; data tercepat. Sentinel (9999, 1900-01-01, &ldquo;N/A&rdquo;) = nilai yang <em>terlihat</em> valid tapi artinya &ldquo;tidak tahu&rdquo; — lebih berbahaya dari NULL karena tidak terdeteksi COUNT. Daftarkan semua sentinel di kamus data.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Test suite — kontrak pipeline</summary>
              <p>Pipeline harian memuat <code className="inline">kredit_harian</code>. Tulis 3 test yang gagal jika data rusak.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Test 1: tidak boleh ada duplikat id
      SELECT COUNT(*) FROM (
        SELECT id FROM kredit_harian GROUP BY id HAVING COUNT(*) &gt; 1) d;
      -- ekspektasi: 0
      -- Test 2: total baris wajar (tidak drop 90% / meledak 10x)
      SELECT COUNT(*) AS n FROM kredit_harian;
      -- ekspektasi: 0,9 * kemarin &lt; n &lt; 1,1 * kemarin
      -- Test 3: tidak ada tanggal masa depan
      SELECT COUNT(*) FROM kredit_harian WHERE tanggal &gt; CURRENT_DATE;
      -- ekspektasi: 0</pre>
              <p><strong>Bedah:</strong> test = query + <em>ekspektasi</em>. Tanpa ekspektasi, query hanya &ldquo;angka&rdquo;. Tiga test ini (uniqueness, volume, freshness) menangkap 80% insiden pipeline. Jalankan <em>setiap</em> load — otomatis, bukan manual.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Audit 6 Dimensi</h2>

      <p>Jalankan 6 cek pada tabel nasabah: completeness (penghasilan), uniqueness (id), validity (dpd 0–3650), consistency (status vs dpd).</p>

      <PyodideLab
  title="Lab 1 — Template Quality Check"
  hint="Temukan: inkonsistensi apa di data lab? (Petunjuk: Budi dpd 15 tapi status 'lancar'!)"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- completeness
SELECT COUNT(*) AS total, COUNT(penghasilan) AS isi FROM nasabah;
-- uniqueness
SELECT id, COUNT(*) c FROM nasabah GROUP BY id HAVING c &gt; 1;
-- validity
SELECT * FROM nasabah WHERE dpd &lt; 0;
-- consistency: Budi &amp; Fitri dpd&gt;0 tapi &#x27;lancar&#x27; = INKONSISTEN!
SELECT * FROM nasabah WHERE status = &#x27;lancar&#x27; AND dpd &gt; 0;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Reconciliation</h2>

      <p>Simulasikan sumber vs target: buat 'target' = nasabah tanpa Eko (hilang!). Buktikan dengan 3 level recon.</p>

      <PyodideLab
  title="Lab 2 — Cocokkan Dua Tabel"
  hint="Level 3: baris mana yang hilang? (EXCEPT!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- L1: count
SELECT &#x27;sumber&#x27;, COUNT(*) FROM nasabah
UNION ALL
SELECT &#x27;target&#x27;, COUNT(*) FROM (SELECT * FROM nasabah WHERE id &lt;&gt; 5);
-- L3: siapa hilang
SELECT id FROM nasabah
EXCEPT
SELECT id FROM (SELECT * FROM nasabah WHERE id &lt;&gt; 5);
-- hasil: id 5 (Eko) hilang!</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Quality</h2>

      <div className="decision-card">
<h3>1. Tabel baru diterima → <strong>6 cek template</strong></h3>
<p><strong>Kondisi data:</strong> Audit awal.</p>
<p><strong>Kenapa:</strong> 15 menit mencegah berhari-hari debug.</p>
<p><strong>Contoh nyata:</strong> Completeness → timeliness.</p>
</div>

      <div className="decision-card">
<h3>2. Setelah pipeline → <strong>reconciliation 3 level</strong></h3>
<p><strong>Kondisi data:</strong> Gate.</p>
<p><strong>Kenapa:</strong> Count → agregat → EXCEPT. Gagal = jangan lanjut.</p>
<p><strong>Contoh nyata:</strong> Sumber vs target.</p>
</div>

      <div className="decision-card">
<h3>3. Aturan berulang → <strong>test otomatis</strong></h3>
<p><strong>Kondisi data:</strong> Kontinu.</p>
<p><strong>Kenapa:</strong> unique/not_null/values/relationships.</p>
<p><strong>Contoh nyata:</strong> dbt test tiap run.</p>
</div>

      <div className="decision-card">
<h3>4. Temuan → <strong>skor + bahasa bisnis</strong></h3>
<p><strong>Kondisi data:</strong> Komunikasi.</p>
<p><strong>Kenapa:</strong> &ldquo;Consistency 80%&rdquo; &gt; &ldquo;data bermasalah&rdquo;.</p>
<p><strong>Contoh nyata:</strong> Quality dashboard.</p>
</div>

      <div className="decision-card">
<h3>5. Biaya → <strong>kuantifikasi</strong></h3>
<p><strong>Kondisi data:</strong> Advokasi.</p>
<p><strong>Kenapa:</strong> Rp salah hitung = budget quality.</p>
<p><strong>Contoh nyata:</strong> Rp 2M double-count.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Tabel baru → 6 cek. Pipeline → recon 3 level.</li><li>Tidak ada data pindah tanpa recon yang lolos.</li><li>Test generik dulu (80%), custom untuk aturan bisnis.</li><li>Laporkan temuan sebagai <strong>skor + dampak Rp</strong>.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Laporan Rp 2 Miliar (45+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Total penyaluran dilaporkan Rp 48M. Audit: Rp 2M double-count (duplikat) + 300 debitur hilang (filter NULL salah).</p><p><strong>Tugas:</strong> (1) Test apa yang <em>akan</em> menangkap double-count? (2) Test apa yang menangkap debitur hilang? (3) Rancang <strong>gate pipeline</strong>: urutan cek + ambang FAIL. (4) Tulis <strong>permintaan maaf + rencana perbaikan</strong> 4 kalimat untuk direksi.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> Test uniqueness id + recon Level 2 (SUM sumber vs target). <strong>(2)</strong> Recon Level 1 (count) + not_null test di kolom filter + review query filter NULL (C2!).</p><p><strong>(3) Gate:</strong> ① row count ±0 → ② SUM ±0,01% → ③ unique/not_null → ④ custom bisnis. FAIL di langkah manapun = pipeline berhenti + alert.</p><p><strong>(4) Contoh:</strong> &ldquo;Kami menemukan kelebihan catat Rp 2M dari duplikat dan 300 debitur terlewat filter. Angka terkoreksi: Rp 46M. Kami memasang 4 lapis automated check agar tidak terulang; laporan audit menyusul Jumat.&rdquo;</p><p><strong>Pelajaran:</strong> krisis data = krisis kepercayaan. Respons profesional = <strong>akui + koreksi + sistem cegah</strong>. Inilah yang membedakan senior.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Laporan A (dari mart) = Rp100M; sumber (ODS) = Rp100M; tapi rincian per kota di A berjumlah Rp97M. Apa yang dicurigai pertama?</li>
              <li>Tulis check: &ldquo;tidak ada nasabah dengan penghasilan &gt; Rp10M &times; 100 (= Rp1T, pasti salah input)&rdquo;.</li>
              <li>Mengapa test &ldquo;COUNT(*) &gt; 0&rdquo; saja tidak cukup untuk pipeline harian?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Total cocok tapi rincian tidak = <strong>kota NULL/kosong</strong> (Rp3M tidak teralokasi ke kota manapun — ingat C2!). Cek: <code className="inline">SUM(CASE WHEN kota IS NULL THEN nominal END)</code>. Atau kategori baru yang tidak terpetakan di dimensi.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2.
      SELECT COUNT(*) FROM nasabah WHERE penghasilan &gt; 1000000000000;
      -- ekspektasi: 0. (Angka &quot;tidak mungkin&quot; = definisi bisnis, bukan statistik!)</pre>
              <p><strong>3.</strong> COUNT &gt; 0 lolos jika pipeline memuat <em>1 baris</em> dari 2 juta (drop 99,99%!) atau memuat <em>duplikat 10×</em>. Butuh <strong>rentang wajar</strong> (band vs kemarin) + check distribusi, bukan sekadar &ldquo;ada&rdquo;.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>6 dimensi:</strong> completeness, uniqueness, validity, consistency, timeliness, accuracy.</li><li><strong>Recon 3 level:</strong> count → agregat → EXCEPT. Gate pipeline.</li><li><strong>Test:</strong> generik (80%) + custom bisnis; jalan otomatis.</li><li><strong>Komunikasi:</strong> skor + dampak Rp — bukan keluhan.</li><li>Quality = asuransi karir.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c14-fraud-velocity" className="btn btn-secondary btn-sm">← ← C14</Link>
        <Link href="/learn/c16-data-modeling" className="btn btn-primary btn-sm">Next: C16 →</Link>
      </div>
    </div>
  );
}

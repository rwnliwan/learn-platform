import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C17IndexExplainPage() {
  const chart1 = [{"x": ["Full scan", "+ Index"], "y": [40, 0.2], "type": "bar", "marker": {"color": ["#ef4444", "#34a853"]}, "text": ["40 dtk", "0,2 dtk"], "textposition": "outside"}];
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
# EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id = 2
q("""SELECT * FROM transaksi WHERE nasabah_id = 2""")`;
  const lab2Code = String.raw`import sqlite3
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
# CREATE INDEX idx_tgl ON transaksi(tanggal)
q("""EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE tanggal >= '2026-09-01'""")`;
  const quizData = [{"question": "Index paling membantu untuk…", "options": ["SELECT * tabel kecil", "WHERE selektif di tabel besar", "LIKE '%x%'", "Kolom 3 nilai unik"], "correct": 1, "explanation": "Benar: selektif + besar. Tabel kecil/low-cardinality = full scan lebih cepat."}, {"question": "EXPLAIN menunjukkan SCAN pada tabel 100 juta baris. Artinya…", "options": ["Normal", "Full scan — pertimbangkan index / memang butuh semua", "Error", "Index rusak"], "correct": 1, "explanation": "Benar: waspadai; tapi agregat penuh memang butuh scan."}, {"question": "WHERE strftime('%Y', tanggal) = '2026' dengan index tanggal…", "options": ["Index terpakai", "Index TIDAK terpakai (tidak sargable)", "Error", "Lebih cepat"], "correct": 1, "explanation": "Benar: fungsi di kolom mematikan index."}, {"question": "Composite index (a, b) membantu…", "options": ["WHERE b saja optimal", "WHERE a AND b (a dulu)", "ORDER BY c", "Tidak pernah"], "correct": 1, "explanation": "Benar: urutan penting — kolom pertama yang difilter."}, {"question": "Terlalu banyak index berakibat…", "options": ["Selalu lebih cepat", "Write lambat + storage + planner bingung", "Tidak ada efek", "Error"], "correct": 1, "explanation": "Benar: index ada biayanya. Untuk pola query nyata saja."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C17 — SQL Engineering</span>
        <h1 className="display-title">Index &amp; EXPLAIN:<br/>Membuat Query Terbang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Query 40 Detik → 0,2 Detik</a></li>
          <li><a href="#index">Index — Daftar Isi Database</a></li>
          <li><a href="#explain">EXPLAIN — Membaca Pikiran Database</a></li>
          <li><a href="#aturan">5 Aturan Optimasi Praktis</a></li>
          <li><a href="#lab1">🔬 Lab 1: SCAN vs SEARCH</a></li>
          <li><a href="#lab2">🔬 Lab 2: Sargable Showdown</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Performa</a></li>
          <li><a href="#case">📋 Mini-Case: Dashboard 40 Detik</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan cara kerja <strong>index</strong> (B-tree) dan kapan ia membantu.</li><li>Membaca <strong>EXPLAIN QUERY PLAN</strong> untuk diagnosis.</li><li>Menerapkan 5 aturan <strong>optimasi praktis</strong>.</li><li>Menghindari <strong>jebakan index</strong> (terlalu banyak, fungsi di kolom).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Query 40 Detik → 0,2 Detik</h2>

      <div className="story"><p>Dashboard direksi loading <strong>40 detik</strong> — tiap refresh, direksi menunggu sambil menatap analis. Satu baris <code className="inline">CREATE INDEX</code> mengubahnya jadi <strong>0,2 detik</strong>. Bukan sihir — hanya memahami cara database mencari data.</p><p>Lesson ini bukan untuk jadi DBA — tapi agar query analismu <em>tidak menjadi masalah</em>. 80% masalah performa diselesaikan 5 aturan di sini.</p><p><strong>Twist-nya:</strong> satu baris CREATE INDEX: 40 detik → 0,2 detik (200×!) — bukan karena datanya berubah, melainkan karena database berhenti membaca 2 juta baris satu per satu dan mulai memakai &ldquo;daftar isi&rdquo;. Ironinya: index mempercepat baca tapi <em>memperlambat tulis</em> — tidak ada makan siang gratis, hanya tradeoff yang tepat. Memahami EXPLAIN = tahu kapan membayar harga itu dan kapan tidak.</p></div>

      <h2 id="index">Index — Daftar Isi Database</h2>

      <p><strong>Analogi:</strong> tanpa index = baca buku halaman per halaman (full scan); dengan index (B-tree) = lihat daftar isi → lompat ke halaman (seek).</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- buat index di kolom yang sering difilter/join
CREATE INDEX idx_transaksi_nasabah ON transaksi(nasabah_id);
CREATE INDEX idx_transaksi_tanggal ON transaksi(tanggal);

-- composite: untuk filter multi-kolom (urutan penting!)
CREATE INDEX idx_kredit_kol_dpd ON kredit(kolektibilitas, dpd);</pre>

      <ul>
<li><strong>Kapan membantu:</strong> WHERE selektif, JOIN key, ORDER BY.</li>
<li><strong>Kapan tidak:</strong> tabel kecil (&lt; 10rb baris — full scan lebih cepat!), kolom low-cardinality (status 3 nilai), LIKE '%x%' (tak bisa pakai B-tree).</li>
<li><strong>Biaya:</strong> index memperlambat INSERT/UPDATE + makan storage — jangan index semua kolom!</li>
<li><strong>Composite:</strong> (a, b) membantu WHERE a=.. AND b=..; urutan = kolom paling selektif/difilter dulu.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak index makin cepat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Salah! Tiap index = beban saat tulis + storage + pilihan planner membingungkan. Aturan: <strong>index untuk pola query nyata</strong> (yang lambat & sering), bukan &ldquo;jaga-jaga&rdquo;. 3–5 index tepat &gt; 20 index acak.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola query → index: &ldquo;filter tanggal + join nasabah&rdquo; → composite (tanggal, nasabah_id) atau dua single — ukur dengan EXPLAIN!</p>
</div>

      <h2 id="explain">EXPLAIN — Membaca Pikiran Database</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">EXPLAIN QUERY PLAN
SELECT * FROM transaksi WHERE nasabah_id = 1;</pre>

      <p>Output menunjukkan strategi: <code className="inline">SEARCH transaksi USING INDEX idx_...</code> (bagus!) vs <code className="inline">SCAN transaksi</code> (full scan — waspadai di tabel besar!).</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Tanda</th><th>Artinya</th><th>Tindakan</th></tr></thead>
<tbody>
<tr><td>SCAN tabel besar</td><td>Full scan</td><td>Butuh index? Atau memang agregat penuh</td></tr>
<tr><td>SEARCH USING INDEX</td><td>Index terpakai</td><td>Bagus</td></tr>
<tr><td>USE TEMP B-TREE</td><td>Sort sementara</td><td>Wajar untuk ORDER BY/GROUP BY besar</td></tr>
<tr><td>Nested loop besar</td><td>JOIN mahal</td><td>Cek index di kedua sisi JOIN</td></tr>
</tbody>
</table>
</div>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: query lambat <code className="inline">SELECT * FROM transaksi WHERE tanggal &gt;= '2026-09-01'</code>.</p><p><strong>Langkah 1</strong> — EXPLAIN: <code className="inline">SCAN transaksi</code> (full scan!).</p><p><strong>Langkah 2</strong> — buat index: <code className="inline">CREATE INDEX idx_tgl ON transaksi(tanggal)</code>.</p><p><strong>Langkah 3</strong> — EXPLAIN lagi: <code className="inline">SEARCH USING INDEX</code> ✅.</p><p><strong>Langkah 4</strong> — ukur waktu sebelum/sesudah. Klaim tanpa angka = opini.</p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Alur diagnosis standar: <strong>EXPLAIN → hipotesis → perbaiki → EXPLAIN lagi → ukur waktu</strong>. Jangan tebak-tebak index; baca rencananya!</p>
</div>

      <h2 id="aturan">5 Aturan Optimasi Praktis</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1. Sargable: kolom polos di WHERE (C4)
WHERE tanggal &gt;= &#x27;2026-09-01&#x27;  -- bukan strftime(...)=...

-- 2. Pilih kolom eksplisit (C1)
SELECT id, jumlah  -- bukan SELECT *

-- 3. Filter dulu, join kemudian (kecilkan sebelum gabung)
WITH f AS (SELECT * FROM transaksi WHERE tanggal &gt;= &#x27;2026-09-01&#x27;)
SELECT ... FROM f JOIN nasabah n ...

-- 4. Hindari SELECT DISTINCT untuk menutupi join salah (C5)
-- 5. Batasi: LIMIT untuk eksplorasi; agregat di DB bukan di aplikasi</pre>

      <ul>
<li><strong>1. Sargable</strong> — fungsi di kolom mematikan index.</li>
<li><strong>2. Kolom eksplisit</strong> — kurangi I/O.</li>
<li><strong>3. Filter dulu</strong> — kecilkan dataset sebelum JOIN/agregat mahal.</li>
<li><strong>4. Jangan tutupi</strong> masalah dengan DISTINCT.</li>
<li><strong>5. Agregat di database</strong> — jangan tarik 1 juta baris lalu groupby di Python!</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Optimasi = tugas DBA.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Analis menulis 90% query yang berjalan — analis yang buta performa = pembuat insiden. Kamu tidak perlu jadi DBA, tapi <strong>5 aturan ini</strong> = tanggung jawab profesional.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Kapan berhenti optimasi? Saat &ldquo;cukup cepat&rdquo; untuk kebutuhan (dashboard &lt; 3 detik, laporan batch &lt; SLA). Optimasi prematur = buang waktu. Ukur dulu, optimasi yang terbukti lambat.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Dampak Index: 40 dtk → 0,2 dtk (ilustrasi)"
  layout={{"yaxis": {"title": "Detik", "type": "log"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Skala log: beda 200× lipat.</p>
<p><strong>Interpretasi:</strong> Satu index tepat = 200× lebih cepat. Tapi ingat: <strong>ukur di datamu</strong> — angka ilustrasi. Dan index yang salah tempat = 0× (malah memperlambat write).</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Index = &ldquo;daftar isi&rdquo;; EXPLAIN = &ldquo;baca pikiran database&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: 40 detik → 0,2 detik — baca EXPLAIN-nya</summary>
              <p><code className="inline">SELECT * FROM transaksi WHERE kota = &#x27;Jakarta&#x27;</code> di 2 juta baris: 40 detik. EXPLAIN menunjukkan <code className="inline">Seq Scan</code>.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">EXPLAIN SELECT * FROM transaksi WHERE kota = &#x27;Jakarta&#x27;;
      -- Seq Scan on transaksi  (cost=0.00..58412.00 rows=200000)
      --   Filter: kota = &#x27;Jakarta&#x27;
      -- -&gt; baca SEMUA 2 juta baris, buang 1,8 juta. Inilah 40 detik.
      CREATE INDEX idx_transaksi_kota ON transaksi(kota);
      -- Index Scan using idx_transaksi_kota (cost=0.43..8120.00 rows=200000)
      -- -&gt; 0,2 detik. 200x lipat.</pre>
              <p><strong>Bedah:</strong> Seq Scan = baca cover-to-cover; Index Scan = lompat via daftar isi. <code className="inline">cost=</code> = estimasi kerja (bukan detik!). Aturan: WHERE/JOIN di kolom tanpa index di tabel besar = Seq Scan = lambat. Jangan tebak — EXPLAIN dulu.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Index yang tidak terpakai — fungsi membunuh</summary>
              <p>Index ada di <code className="inline">tanggal</code>, tapi query tetap Seq Scan. Mengapa?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Index MATI (fungsi di kolom):
      SELECT * FROM transaksi WHERE EXTRACT(YEAR FROM tanggal) = 2026;
      -- Index HIDUP (rentang):
      SELECT * FROM transaksi
      WHERE tanggal &gt;= &#x27;2026-01-01&#x27; AND tanggal &lt; &#x27;2027-01-01&#x27;;
      -- Index juga MATI jika: LIKE &#x27;%tengah&#x27; (wildcard kiri!),
      --   OR antar kolom beda index, implisit cast (tanggal = &#x27;2026&#x27;::text).</pre>
              <p><strong>Bedah:</strong> index = struktur terurut atas <em>nilai kolom</em>; fungsi mengubah nilai → database harus hitung per baris → scan penuh. Sargable (C4!) = syarat index bekerja. Punya index tapi query tidak sargable = punya daftar isi tapi bukunya diacak.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Composite index — urutan kolom penting</summary>
              <p>Query: <code className="inline">WHERE kota = &#x27;Jakarta&#x27; AND tanggal &gt;= &#x27;2026-01-01&#x27;</code>. Index (kota, tanggal) vs (tanggal, kota) — mana?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">CREATE INDEX idx1 ON transaksi(kota, tanggal);    -- (A)
      CREATE INDEX idx2 ON transaksi(tanggal, kota);    -- (B)
      -- Query: kota = &#x27;Jakarta&#x27; (equality) AND tanggal &gt;= ... (range)
      -- Pilih (A)! Aturan: kolom EQUALITY dulu, RANGE belakangan.
      -- (B) hanya memakai prefix &#x27;tanggal&#x27; untuk range -&gt; kota difilter manual.</pre>
              <p><strong>Bedah:</strong> composite index = daftar isi bertingkat: urutan kolom menentukan &ldquo;cabang&rdquo; mana yang bisa dilompati. Equality (=) mempersempit ke satu cabang; range (&gt;=) memotong sisanya. Salah urut = index setengah mati. Desain index = desain untuk query terseringmu.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: SCAN vs SEARCH</h2>

      <p>Jalankan EXPLAIN QUERY PLAN untuk filter nasabah_id. SCAN atau SEARCH? Buat index, ulangi — apa berubah?</p>

      <PyodideLab
  title="Lab 1 — Baca EXPLAIN"
  hint="Buat index: CREATE INDEX idx_t ON transaksi(nasabah_id); lalu EXPLAIN lagi."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- sebelum: SCAN transaksi (tabel kecil → wajar)
EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id = 2;
-- buat index:
CREATE INDEX idx_t ON transaksi(nasabah_id);
-- sesudah: SEARCH transaksi USING INDEX idx_t</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Sargable Showdown</h2>

      <p>Bandingkan EXPLAIN: WHERE tanggal &gt;= '2026-09-01' vs WHERE strftime('%Y-%m',tanggal)='2026-09'. Buat index tanggal dulu!</p>

      <PyodideLab
  title="Lab 2 — Fungsi Mematikan Index"
  hint="Mana yang SEARCH? Mana yang SCAN? Ini bukti aturan sargable (C4)!"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">CREATE INDEX idx_tgl ON transaksi(tanggal);
EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE tanggal &gt;= &#x27;2026-09-01&#x27;;
-- SEARCH (index terpakai)
EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE strftime(&#x27;%Y-%m&#x27;, tanggal) = &#x27;2026-09&#x27;;
-- SCAN (fungsi mematikan index!)</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Performa</h2>

      <div className="decision-card">
<h3>1. Query lambat → <strong>EXPLAIN dulu</strong></h3>
<p><strong>Kondisi data:</strong> Diagnosis.</p>
<p><strong>Kenapa:</strong> Jangan tebak; baca rencananya.</p>
<p><strong>Contoh nyata:</strong> SCAN vs SEARCH.</p>
</div>

      <div className="decision-card">
<h3>2. SCAN di tabel besar → <strong>index kolom filter/join</strong></h3>
<p><strong>Kondisi data:</strong> Perbaiki.</p>
<p><strong>Kenapa:</strong> B-tree seek vs full scan.</p>
<p><strong>Contoh nyata:</strong> CREATE INDEX ...</p>
</div>

      <div className="decision-card">
<h3>3. Index tak terpakai → <strong>cek sargable</strong></h3>
<p><strong>Kondisi data:</strong> Fungsi?</p>
<p><strong>Kenapa:</strong> Fungsi di kolom mematikan index.</p>
<p><strong>Contoh nyata:</strong> Kolom polos di WHERE.</p>
</div>

      <div className="decision-card">
<h3>4. JOIN lambat → <strong>index kedua sisi</strong></h3>
<p><strong>Kondisi data:</strong> Nested loop.</p>
<p><strong>Kenapa:</strong> JOIN tanpa index = mahal.</p>
<p><strong>Contoh nyata:</strong> FK ter-index.</p>
</div>

      <div className="decision-card">
<h3>5. Cukup cepat → <strong>berhenti</strong></h3>
<p><strong>Kondisi data:</strong> Prioritas.</p>
<p><strong>Kenapa:</strong> Optimasi prematur = buang waktu.</p>
<p><strong>Contoh nyata:</strong> Ukur vs SLA.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>EXPLAIN → hipotesis → perbaiki → ukur.</li><li>Index untuk pola query nyata, bukan jaga-jaga.</li><li>Sargable, kolom eksplisit, filter dulu.</li><li>Agregat di DB; LIMIT untuk eksplorasi.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Dashboard 40 Detik</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Dashboard &ldquo;transaksi hari ini per kategori&rdquo; loading 40 detik. Query: <code className="inline">SELECT kategori, SUM(jumlah) FROM transaksi WHERE date(tanggal) = date('now') GROUP BY kategori</code>.</p><p><strong>Tugas:</strong> (1) Diagnosis via EXPLAIN (apa yang salah?). (2) Perbaiki (2 perubahan!). (3) Estimasi dampak.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1) Diagnosis:</strong> <code className="inline">date(tanggal)</code> di WHERE = <strong>tidak sargable</strong> → SCAN 1 tahun data padahal butuh 1 hari! + tidak ada index tanggal.</p><p><strong>(2) Perbaiki:</strong> ① <code className="inline">WHERE tanggal &gt;= date('now') AND tanggal &lt; date('now','+1 day')</code> (sargable); ② <code className="inline">CREATE INDEX idx_tgl ON transaksi(tanggal)</code>.</p><p><strong>(3)</strong> SCAN 365 hari → SEEK 1 hari = ~300× lebih sedikit dibaca. 40 dtk → &lt;1 dtk.</p><p><strong>Pelajaran:</strong> 90% &ldquo;query lambat&rdquo; = sargable + index. Dua baris perubahan, direksi tersenyum.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>EXPLAIN menunjukkan <code className="inline">Nested Loop</code> + <code className="inline">Seq Scan</code> di tabel kecil (100 baris) yang di-join ke tabel besar. Apakah ini masalah? Mengapa?</li>
              <li>Tulis index untuk query: <code className="inline">WHERE status = &#x27;macet&#x27; AND dpd &gt; 90 ORDER BY baki_debet DESC</code>.</li>
              <li>Mengapa &ldquo;index semua kolom&rdquo; adalah ide buruk? Sebutkan 2 harganya.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Bukan masalah</strong> — Seq Scan di 100 baris murah (mungkin lebih cepat dari index!). Optimizer memilih Nested Loop karena sisi luar kecil. Jangan &ldquo;perbaiki&rdquo; yang sudah optimal — baca cost &amp; actual time dulu.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2. Equality dulu (status), lalu kolom ORDER/range:
      CREATE INDEX idx_kredit_status_dpd_baki
        ON kredit(status, baki_debet DESC) WHERE dpd &gt; 90;
      -- Bonus: partial index (WHERE dpd &gt; 90) -&gt; kecil &amp; fokus!</pre>
              <p><strong>3.</strong> (a) <strong>Write melambat</strong>: tiap INSERT/UPDATE harus update semua index. (b) <strong>Ruang &amp; maintenance</strong>: index = duplikat data yang harus di-vacuum. Index = investasi: bayar di tulis, panen di baca — hanya untuk query yang sering.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Index</strong> (B-tree) = daftar isi; untuk WHERE selektif/JOIN/ORDER BY.</li><li><strong>EXPLAIN</strong>: SCAN vs SEARCH — diagnosis sebelum tebak.</li><li><strong>5 aturan:</strong> sargable, kolom eksplisit, filter dulu, jangan tutupi, agregat di DB.</li><li><strong>Jangan:</strong> index jaga-jaga; fungsi di kolom; optimasi prematur.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c16-data-modeling" className="btn btn-secondary btn-sm">← ← C16</Link>
        <Link href="/learn/c18-transaksi-acid" className="btn btn-primary btn-sm">Next: C18 →</Link>
      </div>
    </div>
  );
}

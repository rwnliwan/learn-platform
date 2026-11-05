import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C9WindowFunctions1Page() {
  const chart1 = [{"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [500000, 250000, 1200000], "type": "bar", "name": "Transaksi", "marker": {"color": "#2a7de1"}}, {"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [0, -250000, 950000], "type": "bar", "name": "Selisih vs transaksi lalu (LAG)", "marker": {"color": "#e8a838"}}];
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
# WITH p AS (SELECT nama, kota, penghasilan, ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn FROM nasabah) SELECT * FROM p WHERE rn <= 2
q("""SELECT nama, kota, penghasilan, ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn FROM nasabah""")`;
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
# WITH s AS (SELECT tanggal, jumlah, jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih FROM transaksi WHERE nasabah_id=1) SELECT * FROM s ORDER BY selisih DESC
q("""SELECT tanggal, jumlah, LAG(jumlah) OVER (ORDER BY tanggal) AS kemarin FROM transaksi WHERE nasabah_id = 1""")`;
  const quizData = [{"question": "Window function vs GROUP BY: bedanya…", "options": ["Sama", "Window tidak melipat baris; GROUP BY melipat", "Window lebih lambat selalu", "GROUP BY bisa ranking"], "correct": 1, "explanation": "Benar: window menambah kolom, baris tetap."}, {"question": "WHERE rn <= 2 langsung pada query ber-ROW_NUMBER…", "options": ["Berhasil", "Error — window tak bisa di WHERE; bungkus CTE dulu", "Hasil kosong", "Mengabaikan filter"], "correct": 1, "explanation": "Benar: urutan eksekusi — window setelah WHERE."}, {"question": "Nilai: 100, 90, 90, 80. RANK menghasilkan…", "options": ["1,2,3,4", "1,2,2,4", "1,2,2,3", "1,1,2,3"], "correct": 1, "explanation": "Benar: RANK melompat setelah seri."}, {"question": "Dedup &ldquo;ambil baris terbaru per id&rdquo;…", "options": ["RANK", "ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), saring rn=1", "LAG", "COUNT"], "correct": 1, "explanation": "Benar: pola dedup #1."}, {"question": "LAG butuh…", "options": ["GROUP BY", "ORDER BY di dalam OVER", "HAVING", "UNION"], "correct": 1, "explanation": "Benar: tanpa ORDER BY, &ldquo;sebelum&rdquo; tak bermakna."}, {"question": "Baris pertama LAG(x) menghasilkan…", "options": ["0", "NULL (tidak ada sebelumnya)", "Error", "x itu sendiri"], "correct": 1, "explanation": "Benar: NULL di tepi — pakai default LAG(x,1,0) jika perlu."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C9 — SQL (Part 1)</span>
        <h1 className="display-title">Window Functions:<br/>Ranking &amp; Akses Baris Tetangga</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Top 3 per Kota&rdquo; yang Tak Bisa Dijawab GROUP BY</a></li>
          <li><a href="#konsep">Konsep: Hitung Tanpa Melipat</a></li>
          <li><a href="#ranking">ROW_NUMBER, RANK, DENSE_RANK — Tiga Peringkat</a></li>
          <li><a href="#laglead">LAG / LEAD — Mengintip Tetangga</a></li>
          <li><a href="#lab1">🔬 Lab 1: Top-2 per Kota</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kenaikan Terbesar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Window Part 1</a></li>
          <li><a href="#case">📋 Mini-Case: &ldquo;Nasabah Terbaik Tiap Kota&rdquo; versi Kompetisi</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan konsep <strong>window function</strong>: hitung tanpa melipat baris (vs GROUP BY).</li><li>Memakai <strong>ROW_NUMBER, RANK, DENSE_RANK</strong> untuk peringkat.</li><li>Memakai <strong>PARTITION BY</strong> untuk &ldquo;GROUP BY tanpa melipat&rdquo;.</li><li>Memakai <strong>LAG/LEAD</strong> untuk mengakses baris sebelum/sesudah.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Top 3 per Kota&rdquo; yang Tak Bisa Dijawab GROUP BY</h2>

      <div className="story"><p>Manajer: <em>&ldquo;Siapa 3 nasabah berpenghasilan tertinggi <strong>di tiap kota</strong>?&rdquo;</em> GROUP BY kota melipat 10 baris jadi 4 — nama-namanya hilang! Subquery per kota? Bisa, tapi kaku dan lambat.</p><p>Window function menjawab dalam <strong>satu query elegan</strong>: beri peringkat <em>di dalam tiap kota</em>, saring peringkat ≤ 3. Skill ini (window functions) adalah <strong>#1 yang diuji di interview data analyst 2026</strong> — dan topik yang paling sering &ldquo;ditakuti&rdquo; padahal polanya sedikit. Part 1: ranking &amp; tetangga. Part 2: agregat berjalan.</p><p><strong>Twist-nya:</strong> window function menghitung peringkat <em>tanpa melipat baris</em> — &ldquo;agregasi yang tidak mengagregasi&rdquo;. Inilah yang membuatnya terasa ajaib sekaligus membingungkan: GROUP BY menghilangkan baris, window function menambah kolom. Dua operasi yang terlihat mirip, nasib barisnya berlawanan — dan justru di situlah kekuatannya.</p></div>

      <h2 id="konsep">Konsep: Hitung Tanpa Melipat</h2>

      <p><strong>Definisi.</strong> Window function melakukan perhitungan <em>melintasi sekumpulan baris terkait</em> (<strong>window</strong>) — tapi <strong>tidak melipat baris</strong> seperti GROUP BY. Tiap baris tetap ada, plus kolom hasil perhitungan.</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- GROUP BY: 10 baris -&gt; 4 baris (nama hilang!)
SELECT kota, AVG(penghasilan) FROM nasabah GROUP BY kota;

-- Window: 10 baris TETAP 10 baris + kolom baru
SELECT nama, kota, penghasilan,
       AVG(penghasilan) OVER (PARTITION BY kota) AS rata_kota
FROM nasabah;</pre>

      <p><strong>Anatomi:</strong> <code className="inline">FUNGSI(...) OVER (PARTITION BY ... ORDER BY ...)</code> — PARTITION BY = &ldquo;kelompok window&rdquo;, ORDER BY di dalam OVER = &ldquo;urutan dalam window&rdquo;.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Ingat: window function dieksekusi <strong>setelah</strong> WHERE/GROUP BY/HAVING tapi <strong>sebelum</strong> ORDER BY final (urutan: ... HAVING → window → SELECT → ORDER BY). Karena itu kamu <strong>tidak bisa</strong> pakai hasil window di WHERE — butuh subquery/CTE pembungkus (pola di bawah!).</p>
</div>

      <h2 id="ranking">ROW_NUMBER, RANK, DENSE_RANK — Tiga Peringkat</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, kota, penghasilan,
  ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn,
  RANK()       OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS drnk
FROM nasabah;</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Fungsi</th><th>Seri (tie)</th><th>Contoh: 1,2,2,3</th><th>Kapan</th></tr></thead>
<tbody>
<tr><td>ROW_NUMBER</td><td>Nomor unik acak</td><td>1, 2, 3, 4</td><td>Dedup: ambil 1 per grup</td></tr>
<tr><td>RANK</td><td>Lompat setelah seri</td><td>1, 2, 2, 4</td><td>Peringkat kompetisi nyata</td></tr>
<tr><td>DENSE_RANK</td><td>Rapat tanpa lompat</td><td>1, 2, 2, 3</td><td>&ldquo;Top-N nilai unik&rdquo;</td></tr>
</tbody>
</table>
</div>

      <p><strong>Pola &ldquo;top-N per grup&rdquo;</strong> (interview klasik!):</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH peringkat AS (
  SELECT nama, kota, penghasilan,
         ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn
  FROM nasabah
)
SELECT * FROM peringkat WHERE rn &lt;= 2;  -- 2 teratas tiap kota</pre>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Hasil window function bisa langsung di-WHERE.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak bisa! Window dihitung setelah WHERE. Pola wajib: <strong>CTE/subquery dulu, saring kemudian</strong> (seperti di atas). Ini pola yang paling sering ditulis salah di interview — hafalkan bentuknya.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;PARTITION BY harus selalu dipakai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak! <code className="inline">OVER ()</code> kosong = seluruh hasil sebagai satu window (untuk % of total — C9-2). Dan <code className="inline">OVER (ORDER BY x)</code> tanpa PARTITION = window berjalan atas semua baris. PARTITION hanya saat butuh grup terpisah.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> ROW_NUMBER untuk dedup: <code className="inline">ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC)</code> lalu saring rn=1 → &ldquo;baris terbaru per id&rdquo;. Pola #1 data cleaning di SQL!</p>
</div>

      <h2 id="laglead">LAG / LEAD — Mengintip Tetangga</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT tanggal, jumlah,
  LAG(jumlah) OVER (ORDER BY tanggal) AS kemarin,
  jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih,
  LEAD(tanggal) OVER (ORDER BY tanggal) AS besok
FROM transaksi
WHERE nasabah_id = 1;</pre>

      <ul>
<li><code className="inline">LAG(x)</code> = nilai x di baris <strong>sebelumnya</strong>; <code className="inline">LEAD(x)</code> = <strong>sesudahnya</strong>.</li>
<li><strong>Kapan:</strong> pertumbuhan harian (selisih vs kemarin), deteksi anomali (lonjakan), time-to-event.</li>
<li><code className="inline">LAG(x, 7)</code> = 7 baris sebelumnya; argumen ke-3 = default jika NULL (<code className="inline">LAG(x, 1, 0)</code>).</li>
<li><strong>Wajib ORDER BY</strong> di dalam OVER — tanpa itu &ldquo;sebelum&rdquo; tidak bermakna!</li>
</ul>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: hari dengan kenaikan transaksi terbesar (nasabah 1).</p><p><strong>Langkah 1</strong> — ambil kemarin: <code className="inline">LAG(jumlah) OVER (ORDER BY tanggal) AS kemarin</code>.</p><p><strong>Langkah 2</strong> — selisih: <code className="inline">jumlah - kemarin AS naik</code> (di CTE!).</p><p><strong>Langkah 3</strong> — <code className="inline">SELECT * FROM cte ORDER BY naik DESC LIMIT 1</code>.</p><p>Hasil: 2026-09-15 naik 950rb (dari 250rb ke 1,2jt). Pola &ldquo;bandingkan dengan periode lalu&rdquo; = 80% analisis tren.</p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola MoM/YoY: <code className="inline">jumlah / LAG(jumlah, 12) OVER (PARTITION BY kategori ORDER BY bulan) - 1</code> = pertumbuhan YoY per kategori. Satu baris = laporan tahunan!</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Transaksi vs Selisih (LAG) — Nasabah 1"
  layout={{"barmode": "group", "yaxis": {"title": "Rupiah"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = nilai transaksi; oranye = selisih vs transaksi sebelumnya (LAG).</p>
<p><strong>Interpretasi:</strong> LAG mengubah deret <em>level</em> menjadi deret <em>perubahan</em> — dan perubahan yang biasanya ditanya (&ldquo;naik berapa?&rdquo;). <strong>Catatan:</strong> bar pertama selisihnya NULL (tidak ada &ldquo;kemarin&rdquo;) — tangani dengan default LAG(x,1,0) atau biarkan NULL eksplisit.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Window = &ldquo;hitung per grup tanpa melipat baris&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: ROW_NUMBER vs RANK vs DENSE_RANK — seri</summary>
              <p>Penghasilan: Dewi 25jt, Andi 18jt, Sari 18jt, Budi 10jt. Beri peringkat 1–4 dengan ketiganya. Apa bedanya?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, penghasilan,
        ROW_NUMBER() OVER (ORDER BY penghasilan DESC) AS rn,
        RANK()       OVER (ORDER BY penghasilan DESC) AS rnk,
        DENSE_RANK() OVER (ORDER BY penghasilan DESC) AS drnk
      FROM nasabah;</pre>
              <p><strong>Hasil:</strong> Dewi (1,1,1); Andi (2,2,2); Sari (3,2,2); Budi (4,4,3).</p>
              <p><strong>Bedah:</strong> ROW_NUMBER: selalu unik (1,2,3,4) — seri diputus sembarang! RANK: seri berbagi peringkat, lalu <em>lompat</em> (1,2,2,4). DENSE_RANK: seri berbagi, <em>tanpa lompat</em> (1,2,2,3). &ldquo;Top 3&rdquo; dengan RANK bisa = 4 orang; dengan ROW_NUMBER = tepat 3.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: PARTITION BY — peringkat per kota</summary>
              <p>3 berpenghasilan tertinggi <em>per kota</em> (kasus cerita pembuka!).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH peringkat AS (
        SELECT nama, kota, penghasilan,
               ROW_NUMBER() OVER (
                 PARTITION BY kota ORDER BY penghasilan DESC) AS rn
        FROM nasabah
      )
      SELECT * FROM peringkat WHERE rn &lt;= 3;</pre>
              <p><strong>Bedah:</strong> PARTITION BY = &ldquo;GROUP BY yang tidak melipat&rdquo;: peringkat dihitung <em>di dalam</em> tiap kota. Window function <strong>tidak bisa</strong> di WHERE langsung (ia dihitung <em>setelah</em> WHERE!) → bungkus CTE/subquery dulu. Urutan logis: WHERE → window → SELECT → filter luar.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: LAG — bandingkan dengan bulan lalu per nasabah</summary>
              <p>Untuk tiap transaksi, tampilkan nominal &amp; nominal transaksi <em>sebelumnya</em> dari nasabah yang sama.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nasabah_id, tanggal, nominal,
             LAG(nominal) OVER (
               PARTITION BY nasabah_id ORDER BY tanggal) AS nominal_sebelumnya,
             nominal - LAG(nominal) OVER (
               PARTITION BY nasabah_id ORDER BY tanggal) AS selisih
      FROM transaksi;</pre>
              <p><strong>Bedah:</strong> LAG = &ldquo;baris sebelumnya dalam partisi terurut&rdquo;. Tanpa PARTITION BY, &ldquo;sebelumnya&rdquo; = transaksi orang lain yang kebetulan bersebelahan — sampah! ORDER BY di dalam OVER <strong>wajib</strong> untuk LAG/LEAD yang bermakna.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Top-2 per Kota</h2>

      <p>Tampilkan 2 nasabah berpenghasilan tertinggi di <strong>tiap kota</strong>. (Ingat: CTE dulu, saring kemudian!)</p>

      <PyodideLab
  title="Lab 1 — ROW_NUMBER + PARTITION BY"
  hint="Ganti jadi RANK: apa bedanya jika ada penghasilan kembar?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH p AS (
  SELECT nama, kota, penghasilan,
         ROW_NUMBER() OVER (PARTITION BY kota ORDER BY penghasilan DESC) AS rn
  FROM nasabah
)
SELECT * FROM p WHERE rn &lt;= 2;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Kenaikan Terbesar</h2>

      <p>Untuk nasabah 1: tampilkan tanggal, jumlah, dan selisih vs transaksi sebelumnya. Urut selisih terbesar.</p>

      <PyodideLab
  title="Lab 2 — LAG untuk Pertumbuhan"
  hint="Tambahkan kolom pct: selisih / kemarin. Waspadai pembagian NULL!"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH s AS (
  SELECT tanggal, jumlah,
         jumlah - LAG(jumlah) OVER (ORDER BY tanggal) AS selisih
  FROM transaksi WHERE nasabah_id = 1
)
SELECT * FROM s ORDER BY selisih DESC;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Window Part 1</h2>

      <div className="decision-card">
<h3>1. Peringkat per grup → <strong>ROW_NUMBER/RANK</strong> + PARTITION BY</h3>
<p><strong>Kondisi data:</strong> &ldquo;Top-N per ...&rdquo;.</p>
<p><strong>Kenapa:</strong> CTE + saring rn &lt;= N (tak bisa di WHERE langsung).</p>
<p><strong>Contoh nyata:</strong> Top-2 per kota.</p>
</div>

      <div className="decision-card">
<h3>2. Dedup ambil terbaru → <strong>ROW_NUMBER rn=1</strong></h3>
<p><strong>Kondisi data:</strong> Duplikat.</p>
<p><strong>Kenapa:</strong> PARTITION BY id ORDER BY updated_at DESC.</p>
<p><strong>Contoh nyata:</strong> Baris terbaru per id.</p>
</div>

      <div className="decision-card">
<h3>3. Banding vs periode lalu → <strong>LAG/LEAD</strong></h3>
<p><strong>Kondisi data:</strong> Pertumbuhan, anomali.</p>
<p><strong>Kenapa:</strong> Wajib ORDER BY di OVER; NULL di tepi.</p>
<p><strong>Contoh nyata:</strong> Selisih harian, YoY.</p>
</div>

      <div className="decision-card">
<h3>4. Rata-rata per grup tanpa melipat → <strong>AVG OVER (PARTITION BY)</strong></h3>
<p><strong>Kondisi data:</strong> Konteks per baris.</p>
<p><strong>Kenapa:</strong> Baris utuh + kolom konteks grup.</p>
<p><strong>Contoh nyata:</strong> Gaji vs rata-rata kotanya.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Window ≠ GROUP BY: baris tidak melipat.</li><li>Hasil window <strong>tidak bisa</strong> di WHERE — bungkus CTE.</li><li>PARTITION BY = kelompok; ORDER BY di OVER = urutan.</li><li>ROW_NUMBER unik; RANK lompat; DENSE_RANK rapat.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: &ldquo;Nasabah Terbaik Tiap Kota&rdquo; versi Kompetisi</h2>

      <div className="callout">
<p>Marketing mau memberi reward ke <strong>peringkat 1–3 tiap kota</strong> berdasar total transaksi — tapi jika ada nilai kembar, semua yang seri harus dapat (adil!).</p><p><strong>Pertanyaan:</strong> ROW_NUMBER, RANK, atau DENSE_RANK? Tulis query-nya.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>DENSE_RANK</strong> — &ldquo;3 nilai tertinggi&rdquo; (semua yang seri ikut), tanpa lompat. RANK juga adil untuk seri tapi melompat (peringkat 4 hilang jika 2 orang seri di 3). ROW_NUMBER <strong>tidak adil</strong> (memotong seri secara acak).</p><p>Query: <code className="inline">WITH t AS (...total per nasabah...), p AS (SELECT ..., DENSE_RANK() OVER (PARTITION BY kota ORDER BY total DESC) dr FROM ...) SELECT * FROM p WHERE dr &lt;= 3;</code></p><p><strong>Pelajaran:</strong> pilihan fungsi ranking = keputusan keadilan, bukan sekadar teknis. Tanyakan &ldquo;bagaimana jika seri?&rdquo; sebelum memilih.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Dengan data kasus 1, siapa yang masuk &ldquo;top 2&rdquo; memakai RANK? Memakai ROW_NUMBER? Jelaskan bedanya.</li>
              <li>Tampilkan transaksi + &ldquo;apakah nominal naik vs transaksi sebelumnya&rdquo; (ya/tidak) per nasabah.</li>
              <li>Mengapa <code className="inline">SELECT nama FROM nasabah WHERE ROW_NUMBER() OVER (ORDER BY penghasilan DESC) &lt;= 3</code> error?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> RANK top 2: Dewi, Andi, Sari (3 orang — seri di peringkat 2!). ROW_NUMBER top 2: Dewi, Andi (tepat 2 — Sari tersingkir <em>sembarang</em>). Pilih sesuai kebutuhan bisnis: &ldquo;tepat 3 pemenang&rdquo; vs &ldquo;semua yang layak&rdquo;.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2.
      SELECT nasabah_id, tanggal, nominal,
             CASE WHEN nominal &gt; LAG(nominal) OVER w THEN &#x27;ya&#x27;
                  WHEN LAG(nominal) OVER w IS NULL THEN &#x27;transaksi pertama&#x27;
                  ELSE &#x27;tidak&#x27; END AS naik
      FROM transaksi
      WINDOW w AS (PARTITION BY nasabah_id ORDER BY tanggal);
      -- WINDOW: definisikan sekali, pakai berkali-kali (lebih rapi!)</pre>
              <p><strong>3.</strong> Window function dievaluasi <em>setelah</em> WHERE (urutan logis SQL!) — di WHERE ia belum ada. Solusi: CTE/subquery dulu, filter di query luar (pola kasus 2).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Window:</strong> hitung melintasi baris terkait <strong>tanpa melipat</strong>.</li><li><strong>Ranking:</strong> ROW_NUMBER (unik) / RANK (lompat) / DENSE_RANK (rapat).</li><li><strong>Pola top-N:</strong> CTE + PARTITION BY + saring rn ≤ N.</li><li><strong>LAG/LEAD:</strong> intip tetangga — butuh ORDER BY di OVER.</li><li><strong>Jangan:</strong> hasil window di WHERE langsung.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c8-union-set" className="btn btn-secondary btn-sm">← ← C8</Link>
        <Link href="/learn/c9-window-functions-2" className="btn btn-primary btn-sm">Next: C9-2 →</Link>
      </div>
    </div>
  );
}

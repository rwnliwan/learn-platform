import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C9WindowFunctions2Page() {
  const chart1 = [{"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [500000, 250000, 1200000], "type": "bar", "name": "Transaksi", "marker": {"color": "#94a3b8"}}, {"x": ["2026-09-01", "2026-09-03", "2026-09-15"], "y": [500000, 750000, 1950000], "type": "scatter", "mode": "lines+markers", "name": "Running total", "line": {"color": "#2a7de1", "width": 3}}];
  const chart2 = [{"x": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], "y": [41, 58, 68, 76, 83, 88, 92, 95, 98, 100], "type": "scatter", "mode": "lines+markers", "name": "Pangsa kumulatif", "line": {"color": "#e8a838", "width": 3}}, {"x": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], "y": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], "type": "scatter", "mode": "lines", "name": "Merata (referensi)", "line": {"color": "#94a3b8", "dash": "dash"}}];
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
# SELECT tanggal, jumlah, SUM(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS akumulasi FROM transaksi WHERE nasabah_id=2
q("""SELECT tanggal, jumlah FROM transaksi WHERE nasabah_id = 2 ORDER BY tanggal""")`;
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
# SELECT nama, penghasilan, NTILE(4) OVER (ORDER BY penghasilan) AS kuartil FROM nasabah
q("""SELECT nama, penghasilan FROM nasabah ORDER BY penghasilan""")`;
  const quizData = [{"question": "Frame default saat OVER (ORDER BY x)…", "options": ["ROWS UNBOUNDED PRECEDING → CURRENT ROW", "RANGE UNBOUNDED PRECEDING → CURRENT ROW", "Seluruh tabel", "Hanya baris ini"], "correct": 1, "explanation": "Benar: RANGE — perlakukan nilai kembar sebagai peer. Tulis eksplisit agar aman."}, {"question": "ROWS vs RANGE beda saat…", "options": ["Selalu sama", "Ada nilai ORDER BY kembar", "Tidak ada ORDER BY", "Hanya 1 baris"], "correct": 1, "explanation": "Benar: ROWS = fisik, RANGE = logis (peer)."}, {"question": "SUM(x) OVER () (OVER kosong) menghasilkan…", "options": ["Error", "Total keseluruhan di setiap baris", "NULL", "x itu sendiri"], "correct": 1, "explanation": "Benar: window kosong = semua baris → % of total."}, {"question": "NTILE(4) membagi berdasar…", "options": ["Nilai sama lebar", "Jumlah baris sama besar", "Acak", "Nilai unik"], "correct": 1, "explanation": "Benar: bagi baris. Untuk bin nilai pakai CASE/WIDTH_BUCKET."}, {"question": "Moving average 3 hari: frame yang benar…", "options": ["ROWS BETWEEN 3 PRECEDING AND CURRENT ROW", "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW", "RANGE UNBOUNDED PRECEDING", "Tanpa frame"], "correct": 1, "explanation": "Benar: 2 sebelum + ini = 3 baris."}, {"question": "Kelemahan aturan &ldquo;anomali = > 2× MA&rdquo;…", "options": ["Tidak ada", "Ambang arbitrer, sensitif outlier, abaikan musiman — screening saja", "Terlalu lambat", "Tidak bisa di SQL"], "correct": 1, "explanation": "Benar: SQL untuk screening; validasi statistik di Python."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C9 — SQL (Part 2)</span>
        <h1 className="display-title">Window Functions:<br/>Agregat Berjalan &amp; Bingkai</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Kapan Kita Tembus 10 Juta?&rdquo;</a></li>
          <li><a href="#running">Running Total — Frame Clause</a></li>
          <li><a href="#moving">Moving Average — Rata-rata Bergerak</a></li>
          <li><a href="#ntile">NTILE, FIRST_VALUE, % of Total</a></li>
          <li><a href="#lab1">🔬 Lab 1: Running Total</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kuartil &amp; Pangsa</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Window Part 2</a></li>
          <li><a href="#case">📋 Mini-Case: Anomali vs Moving Average</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menulis <strong>running total</strong> dan <strong>moving average</strong> dengan frame clause.</li><li>Menjelaskan <strong>ROWS vs RANGE</strong> dan frame default.</li><li>Memakai <strong>NTILE</strong> dan <strong>FIRST_VALUE/LAST_VALUE</strong>.</li><li>Menghitung <strong>% of total</strong> dan pangsa kumulatif (kurva Lorenz mini).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Kapan Kita Tembus 10 Juta?&rdquo;</h2>

      <div className="story"><p>Direksi: <em>&ldquo;Kapan akumulasi transaksi kita tembus 10 juta bulan ini? Dan bagaimana tren rata-rata 7 hariannya?&rdquo;</em> Running total + moving average = dua jawaban dalam satu query.</p><p>Part 1 mengajarkan ranking &amp; tetangga. Part 2: <strong>agregat yang &ldquo;berjalan&rdquo;</strong> — fondasi semua dashboard tren, deteksi anomali time-series, dan analisis konsentrasi. Setelah ini, window function-mu lengkap.</p><p><strong>Twist-nya:</strong> running total menjawab &ldquo;kapan tembus 10 juta&rdquo; — pertanyaan yang <em>tidak bisa</em> dijawab GROUP BY, karena ia butuh urutan (&ldquo;sebelum/sesudah&rdquo;)! Agregasi klasik tidak kenal waktu; window function membawa dimensi waktu ke dalam SQL. Tanpa ini, semua analisis tren = kerja manual di Excel. Dengan ini, satu query = seluruh dashboard tren.</p></div>

      <h2 id="running">Running Total — Frame Clause</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT tanggal, jumlah,
  SUM(jumlah) OVER (
    ORDER BY tanggal
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS akumulasi
FROM transaksi
WHERE nasabah_id = 1;</pre>

      <ul>
<li><strong>Frame</strong> = &ldquo;baris mana yang ikut dihitung untuk baris ini&rdquo;.</li>
<li><code className="inline">UNBOUNDED PRECEDING</code> → awal; <code className="inline">CURRENT ROW</code> → baris ini = running total.</li>
<li><strong>Default</strong> saat ada ORDER BY: <code className="inline">RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — RANGE memperlakukan nilai <strong>kembar</strong> sebagai satu (peer)!</li>
</ul>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: running total transaksi nasabah 1.</p><p><strong>Langkah 1</strong> — urut: <code className="inline">OVER (ORDER BY tanggal)</code>.</p><p><strong>Langkah 2</strong> — frame: <code className="inline">ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>.</p><p><strong>Langkah 3</strong> — agregat: <code className="inline">SUM(jumlah) OVER (...)</code>.</p><p>Hasil: 500rb → 750rb → 1,95jt. Kumulatif menjawab &ldquo;kapan tembus X?&rdquo;.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;ROWS dan RANGE sama saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda saat ada nilai ORDER BY kembar! ROWS = baris fisik (1,2,3...); RANGE = nilai logis (semua yang <em>sama nilainya</em> dihitung bersama). Untuk tanggal kembar, RANGE memberi running total yang &ldquo;melompat&rdquo; sama untuk kedua baris — kadang diinginkan, kadang tidak. <strong>Eksplisit selalu lebih aman</strong> daripada mengandalkan default.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola &ldquo;kapan tembus X&rdquo;: <code className="inline">WITH r AS (...running total...) SELECT MIN(tanggal) FROM r WHERE akumulasi &gt;= 10000000</code> — CTE + saring (lagi-lagi pola Part 1!).</p>
</div>

      <h2 id="moving">Moving Average — Rata-rata Bergerak</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT tanggal, jumlah,
  AVG(jumlah) OVER (
    ORDER BY tanggal
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS ma_3
FROM transaksi
WHERE nasabah_id = 2;</pre>

      <ul>
<li><code className="inline">2 PRECEDING AND CURRENT ROW</code> = jendela 3 baris (ini + 2 sebelumnya) = MA-3.</li>
<li><strong>Kapan:</strong> menghaluskan noise harian (B13!), tren 7-hari, deteksi anomali (aktual vs MA).</li>
<li><strong>Tepi:</strong> 2 baris pertama rata-rata dari &lt; 3 baris — tandai atau abaikan periode pemanasan.</li>
</ul>

      <p><strong>Moving average terpusat</strong> (1 sebelum + 1 sesudah): <code className="inline">ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING</code> — tapi baris terakhir tak punya &ldquo;sesudah&rdquo; (NULL/terpotong).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> MA di SQL vs di Python (D): SQL cocok untuk MA sederhana di query laporan; untuk analisis berat (banyak jendela, statistik), pindahkan ke pandas (D4). Pilih alat sesuai beban.</p>
</div>

      <h2 id="ntile">NTILE, FIRST_VALUE, % of Total</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- kuartil penghasilan
SELECT nama, penghasilan,
  NTILE(4) OVER (ORDER BY penghasilan) AS kuartil
FROM nasabah;

-- % of total + pangsa kumulatif (konsentrasi!)
WITH t AS (
  SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY 1
)
SELECT nasabah_id, total,
  total * 1.0 / SUM(total) OVER () AS pangsa,
  SUM(total) OVER (ORDER BY total DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
    * 1.0 / SUM(total) OVER () AS pangsa_kumulatif
FROM t;</pre>

      <ul>
<li><code className="inline">NTILE(4)</code> = bagi urutan jadi 4 grup sama besar (kuartil); NTILE(10) = desil.</li>
<li><code className="inline">SUM(x) OVER ()</code> = total keseluruhan (window kosong = semua baris!) → % of total.</li>
<li><strong>Pangsa kumulatif</strong> = kurva konsentrasi: berapa % transaksi dikuasai top-N nasabah (Pareto!).</li>
<li><code className="inline">FIRST_VALUE(x) OVER (...)</code> = nilai pertama di window (vs LAG yang hanya 1 baris).</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;NTILE(4) = kuartil statistik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hampir — NTILE membagi <em>jumlah baris</em> sama besar, bukan <em>nilai</em> sama lebar. Beda dengan binning nilai (WIDTH_BUCKET). Untuk &ldquo;20% nasabah teratas&rdquo; NTILE tepat; untuk &ldquo;penghasilan 0–5jt, 5–10jt&rdquo; pakai CASE (C2).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Running Total: Kapan Tembus 1,5 Juta?"
  layout={{"yaxis": {"title": "Rupiah"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = transaksi harian; garis = akumulasi (running total).</p>
<p><strong>Interpretasi:</strong> Garis monoton naik menembus 1,5jt pada 15 Sep. <strong>Running total menjawab pertanyaan &ldquo;kapan&rdquo;</strong> — yang tidak bisa dijawab bar chart biasa. Inilah mengapa finance (arus kas kumulatif, target penjualan) hidup dari running total.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Kurva Konsentrasi: % Nasabah vs % Transaksi (ilustrasi)"
  layout={{"xaxis": {"title": "% nasabah (diurut transaksi terbesar)"}, "yaxis": {"title": "% kumulatif transaksi"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = % nasabah teratas; Y = pangsa kumulatif transaksi. Garis putus = jika merata sempurna.</p>
<p><strong>Interpretasi:</strong> Kurva jauh di atas garis merata = <strong>terkonsentrasi</strong> (Pareto): sedikit nasabah mendominasi. Dihitung murni dengan window function (% of total + running total). <strong>Pertanyaan bisnis:</strong> apakah konsentrasi ini risiko (ketergantungan) atau peluang (VIP treatment)?</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Frame = &ldquo;jendela baris mana yang dihitung&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Running total — kapan tembus 10 juta?</summary>
              <p>Transaksi harian Januari (jt): 1, 2, 1.5, 3, 2.5, … — pada tanggal berapa akumulasi tembus Rp10 juta?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH harian AS (
        SELECT tanggal, SUM(nominal) AS total_harian
        FROM transaksi
        WHERE tanggal &gt;= &#x27;2026-01-01&#x27; AND tanggal &lt; &#x27;2026-02-01&#x27;
        GROUP BY tanggal
      )
      SELECT tanggal, total_harian,
             SUM(total_harian) OVER (ORDER BY tanggal) AS akumulasi
      FROM harian ORDER BY tanggal;</pre>
              <p><strong>Bedah:</strong> <code className="inline">SUM(x) OVER (ORDER BY tanggal)</code> tanpa frame eksplisit = frame default <code className="inline">RANGE UNBOUNDED PRECEDING</code> → &ldquo;dari awal sampai baris ini&rdquo; = running total. Cari baris pertama akumulasi ≥ 10jt → itulah tanggalnya. Pola: agregasi <em>dulu</em> (GROUP BY tanggal), window <em>kemudian</em>.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Moving average 7 hari — tren vs noise</summary>
              <p>Rata-rata bergerak 7 hari untuk menghaluskan fluktuasi harian.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT tanggal, total_harian,
             AVG(total_harian) OVER (
               ORDER BY tanggal
               ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
             ) AS ma7
      FROM harian ORDER BY tanggal;</pre>
              <p><strong>Bedah:</strong> <code className="inline">ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> = &ldquo;7 baris terakhir termasuk hari ini&rdquo;. <strong>ROWS vs RANGE:</strong> ROWS = hitung baris fisik; RANGE = hitung nilai (tanggal kembar digabung!). Untuk deret harian unik, keduanya sama; untuk data ber-duplikat tanggal, beda — pilih ROWS jika maksudmu &ldquo;7 observasi terakhir&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: % of total — kontribusi per kota</summary>
              <p>Berapa % total transaksi nasional yang disumbang tiap kota — tanpa GROUP BY melipat?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kota, tanggal, nominal,
             ROUND(100.0 * nominal
               / SUM(nominal) OVER (), 2) AS pct_nasional,
             ROUND(100.0 * nominal
               / SUM(nominal) OVER (PARTITION BY kota), 2) AS pct_kota
      FROM transaksi;</pre>
              <p><strong>Bedah:</strong> <code className="inline">OVER ()</code> kosong = seluruh tabel = &ldquo;total nasional&rdquo; sebagai pembagi tiap baris. Dua window berbeda dalam satu SELECT — tidak perlu dua query, tidak perlu join ke total. Inilah keanggunan window: agregat multi-level dalam satu pass.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Running Total</h2>

      <p>Untuk nasabah 2: tampilkan tanggal, jumlah, dan running total. Kapan akumulasi tembus 3 juta?</p>

      <PyodideLab
  title="Lab 1 — Akumulasi Transaksi"
  hint="Bungkus CTE: SELECT MIN(tanggal) FROM (...) WHERE akumulasi >= 3000000."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH r AS (
  SELECT tanggal,
         SUM(jumlah) OVER (ORDER BY tanggal
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS akumulasi
  FROM transaksi WHERE nasabah_id = 2
)
SELECT MIN(tanggal) FROM r WHERE akumulasi &gt;= 3000000;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Kuartil &amp; Pangsa</h2>

      <p>Bagi nasabah jadi 4 kuartil berdasar penghasilan (NTILE). Lalu: hitung pangsa tiap kota dari total penghasilan (% of total).</p>

      <PyodideLab
  title="Lab 2 — NTILE + % of Total"
  hint="Eko (NULL) jatuh di kuartil berapa? Kenapa? (NULLS FIRST/LAST!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- kuartil
SELECT nama, penghasilan, NTILE(4) OVER (ORDER BY penghasilan) AS kuartil
FROM nasabah;
-- % of total per kota
SELECT kota, SUM(penghasilan) AS total,
       SUM(penghasilan) * 1.0 / SUM(SUM(penghasilan)) OVER () AS pangsa
FROM nasabah GROUP BY kota;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Window Part 2</h2>

      <div className="decision-card">
<h3>1. &ldquo;Kapan tembus X&rdquo; → <strong>running total</strong></h3>
<p><strong>Kondisi data:</strong> Kumulatif.</p>
<p><strong>Kenapa:</strong> SUM OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING → CURRENT ROW).</p>
<p><strong>Contoh nyata:</strong> Kapan tembus 10 juta.</p>
</div>

      <div className="decision-card">
<h3>2. Haluskan noise → <strong>moving average</strong></h3>
<p><strong>Kondisi data:</strong> Tren.</p>
<p><strong>Kenapa:</strong> AVG OVER (... ROWS n PRECEDING → CURRENT ROW). Waspadai tepi.</p>
<p><strong>Contoh nyata:</strong> MA-7 harian.</p>
</div>

      <div className="decision-card">
<h3>3. Bagi grup sama besar → <strong>NTILE</strong></h3>
<p><strong>Kondisi data:</strong> Kuartil/desil.</p>
<p><strong>Kenapa:</strong> Bagi baris, bukan nilai. NULLS FIRST/LAST eksplisit.</p>
<p><strong>Contoh nyata:</strong> Kuartil penghasilan.</p>
</div>

      <div className="decision-card">
<h3>4. Konsentrasi / pangsa → <strong>% of total + kumulatif</strong></h3>
<p><strong>Kondisi data:</strong> Pareto.</p>
<p><strong>Kenapa:</strong> SUM(x) OVER () = total; kumulatif diurut DESC.</p>
<p><strong>Contoh nyata:</strong> Top 20% nasabah kuasai berapa %?</p>
</div>

      <div className="decision-card">
<h3>5. Nilai pertama/terakhir grup → <strong>FIRST_VALUE/LAST_VALUE</strong></h3>
<p><strong>Kondisi data:</strong> Tepi window.</p>
<p><strong>Kenapa:</strong> LAG hanya 1 baris; FIRST_VALUE seluruh window.</p>
<p><strong>Contoh nyata:</strong> Transaksi pertama tiap nasabah.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Frame <strong>eksplisit</strong> (ROWS ...) — jangan andalkan default RANGE.</li><li>Hasil window → CTE → saring. Selalu.</li><li>NULL di ORDER BY: tentukan NULLS FIRST/LAST eksplisit.</li><li>Tepi jendela (awal/akhir) = data tidak lengkap — tandai.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Anomali vs Moving Average</h2>

      <div className="callout">
<p>Risk meminta: <em>&ldquo;Tandai transaksi harian yang &gt; 2× moving average 3-hari-nya sebagai anomali untuk direview.&rdquo;</em></p><p><strong>Pertanyaan:</strong> tulis query-nya. Apa kelemahan aturan &ldquo;2×&rdquo; ini?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">WITH m AS (SELECT tanggal, jumlah, AVG(jumlah) OVER (ORDER BY tanggal ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING) AS ma3 FROM transaksi) SELECT * FROM m WHERE jumlah &gt; 2 * ma3;</code> (MA dari 3 hari <em>sebelumnya</em> — tidak termasuk hari ini, agar tidak &ldquo;bocor&rdquo;.)</p><p><strong>Kelemahan:</strong> (1) 2× arbitrer — tidak berbasis distribusi (harusnya z-score, B3!); (2) MA-3 sensitif outlier; (3) pola musiman (weekend) tidak tertangkap. <strong>Pelajaran:</strong> SQL bagus untuk <em>screening</em> anomali; <em>validasi</em> statistiknya di Python (D). Tahu batas alatmu!</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Apa beda <code className="inline">SUM(x) OVER (ORDER BY t)</code> vs <code className="inline">SUM(x) OVER ()</code>? Kapan masing-masing dipakai?</li>
              <li>Hitung &ldquo;rata-rata 30 hari&rdquo; tapi hanya dari transaksi <em>sebelum</em> hari ini (tidak termasuk hari ini).</li>
              <li>NTILE(4) membagi nasabah jadi 4 kuartil penghasilan. Apa bedanya dengan &ldquo;4 grup sama lebar&rdquo; (mis. 0–10jt, 10–20jt)?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Dengan ORDER BY: running total (frame meluas per baris). Tanpa: total keseluruhan, sama di semua baris (satu angka pembagi). Pakai yang pertama untuk &ldquo;akumulasi sampai saat ini&rdquo;; yang kedua untuk &ldquo;% terhadap total&rdquo;.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2. Frame mundur, tidak termasuk hari ini:
      AVG(total_harian) OVER (
        ORDER BY tanggal ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING
      ) AS ma30_sebelumnya</pre>
              <p><strong>3.</strong> NTILE(4) = 4 grup <em>sama banyak orang</em> (kuartil); grup sama lebar = rentang penghasilan dibagi 4 (bisa timpang isinya: 90% orang di grup 1!). Untuk segmentasi &ldquo;25% terkaya&rdquo;, NTILE yang benar.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Running total:</strong> SUM OVER (ORDER BY ... ROWS UNBOUNDED PRECEDING → CURRENT ROW).</li><li><strong>Moving average:</strong> AVG OVER (... ROWS n PRECEDING → CURRENT ROW).</li><li><strong>Frame eksplisit;</strong> waspadai default RANGE &amp; tepi jendela.</li><li><strong>NTILE</strong> (bagi baris), <strong>% of total</strong> (OVER kosong), <strong>pangsa kumulatif</strong> (konsentrasi).</li><li>Window lengkap — kamu kuasai skill SQL #1 interview!</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c9-window-functions-1" className="btn btn-secondary btn-sm">← ← C9-1</Link>
        <Link href="/learn/c10-pivot-kasus" className="btn btn-primary btn-sm">Next: C10 →</Link>
      </div>
    </div>
  );
}

import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C10DedupePivotYoyPage() {
  const chart1 = [{"x": ["2026-09"], "y": [5050000], "type": "bar", "name": "Belanja", "marker": {"color": "#2a7de1"}}, {"x": ["2026-09"], "y": [805000], "type": "bar", "name": "Makan", "marker": {"color": "#e8a838"}}, {"x": ["2026-09"], "y": [3200000], "type": "bar", "name": "Travel", "marker": {"color": "#34a853"}}];
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
# WITH d AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC) AS rn FROM (SELECT * FROM nasabah UNION ALL SELECT id, nama, kota, penghasilan+1000000, dpd, status FROM nasabah WHERE id<=3)) SELECT * FROM d WHERE rn=1
q("""SELECT id, COUNT(*) FROM nasabah GROUP BY id HAVING COUNT(*) > 1""")`;
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
# SELECT kategori, SUM(CASE WHEN channel='mobile' THEN jumlah ELSE 0 END) AS mobile, SUM(CASE WHEN channel='web' THEN jumlah ELSE 0 END) AS web, SUM(CASE WHEN channel='atm' THEN jumlah ELSE 0 END) AS atm, SUM(jumlah) AS total FROM transaksi GROUP BY kategori
q("""SELECT kategori, channel, SUM(jumlah) FROM transaksi GROUP BY kategori, channel""")`;
  const quizData = [{"question": "Dedup &ldquo;ambil terbaru per id&rdquo;…", "options": ["DISTINCT", "ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), saring rn=1", "GROUP BY id", "UNION"], "correct": 1, "explanation": "Benar: butuh aturan menang — DISTINCT tak cukup untuk duplikat tak-identik."}, {"question": "Sebelum dedup, yang wajib dilakukan…", "options": ["Langsung hapus", "Ukur: berapa % duplikat & dari mana sumbernya", "Backup", "Minta izin"], "correct": 1, "explanation": "Benar: pahami sumber duplikat dulu — mengobati gejala tanpa sebab = sia-sia."}, {"question": "Pivot manual memakai…", "options": ["JOIN", "SUM(CASE WHEN kategori=... THEN ... END) per kolom", "UNION", "LAG"], "correct": 1, "explanation": "Benar: conditional aggregation = pivot manual."}, {"question": "Unpivot (kolom → baris) memakai…", "options": ["PIVOT", "UNION ALL per kolom", "JOIN", "CASE"], "correct": 1, "explanation": "Benar: kebalikan pivot."}, {"question": "LAG(...,1) pada data bulan berlubang menghasilkan…", "options": ["Bulan kalender lalu", "&ldquo;Bulan data sebelumnya&rdquo; — bisa 2 bulan lalu!", "NULL", "Error"], "correct": 1, "explanation": "Benar: butuh date spine untuk kalender benar."}, {"question": "YTD (year-to-date) memakai…", "options": ["SUM OVER ()", "Running total PARTITION BY tahun", "LAG 12", "NTILE"], "correct": 1, "explanation": "Benar: akumulasi yang reset tiap tahun."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C10 — SQL</span>
        <h1 className="display-title">Dedupe, Pivot &amp; YoY:<br/>Pola Analisis Sehari-hari</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tiga Pertanyaan Setiap Senin Pagi</a></li>
          <li><a href="#dedupe">Dedupe — &ldquo;Ambil Satu per Grup&rdquo;</a></li>
          <li><a href="#pivot">Pivot Manual — Baris jadi Kolom</a></li>
          <li><a href="#yoy">YoY / MoM — Pertumbuhan dengan LAG</a></li>
          <li><a href="#lab1">🔬 Lab 1: Dedupe</a></li>
          <li><a href="#lab2">🔬 Lab 2: Pivot + MoM</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Pola Analisis</a></li>
          <li><a href="#case">📋 Mini-Case: Laporan Senin Pagi</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Mendeduplikasi dengan <strong>ROW_NUMBER</strong> (pola &ldquo;ambil terbaru per id&rdquo;).</li><li>Membuat <strong>pivot manual</strong> dengan conditional aggregation.</li><li>Menghitung <strong>YoY/MoM growth</strong> dengan LAG.</li><li>Menjelaskan kapan memakai tiap pola.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Tiga Pertanyaan Setiap Senin Pagi</h2>

      <div className="story"><p>Setiap Senin pagi, atasanmu bertanya tiga hal: <em>(1) &ldquo;Datanya sudah bersih dari duplikat?&rdquo; (2) &ldquo;Bagaimana tren per kategori bulan ini vs bulan lalu?&rdquo; (3) &ldquo;Pertumbuhan YoY-nya berapa?&rdquo;</em></p><p>Tiga pola SQL di lesson ini — <strong>dedupe, pivot, YoY</strong> — menjawab ketiganya. Ini bukan teori eksotis; ini <em>pekerjaan Senin pagi</em> seorang data analyst. Kuasai, dan Senin pagimu tenang.</p><p><strong>Twist-nya:</strong> tiga pertanyaan Senin pagi terlihat sepele — tapi masing-masing menyembunyikan jebakan: duplikat yang &ldquo;terlihat beda&rdquo; (spasi, kapital), pivot yang menyembunyikan kategori baru, YoY yang membandingkan Januari (31 hari) vs Februari (28 hari). Pekerjaan rutin = tempat bug paling mahal bersembunyi, <em>karena tidak ada yang memeriksa ulang</em>. Yang membosankan justru yang paling butuh ketelitian.</p></div>

      <h2 id="dedupe">Dedupe — &ldquo;Ambil Satu per Grup&rdquo;</h2>

      <p>Data nyata berduplikat: double-submit, retry, SCD. Pola standar:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH bersih AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY id
      ORDER BY updated_at DESC
    ) AS rn
  FROM nasabah_raw
)
SELECT * FROM bersih WHERE rn = 1;  -- hanya baris terbaru per id</pre>

      <ul>
<li><strong>PARTITION BY</strong> = definisi &ldquo;duplikat&rdquo; (id sama).</li>
<li><strong>ORDER BY</strong> = aturan &ldquo;menang&rdquo; (terbaru, terbesar, dsb).</li>
<li><strong>Varian:</strong> <code className="inline">ORDER BY updated_at DESC, sumber_prioritas</code> — tie-breaker eksplisit!</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Duplikat cukup dihapus dengan DISTINCT.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> DISTINCT menghapus baris <em>identik penuh</em> — tapi duplikat nyata hampir selalu beda di timestamp/status! &ldquo;Duplikat&rdquo; = id sama dengan atribut beda. Butuh aturan menang (ROW_NUMBER), bukan DISTINCT buta.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Sebelum dedup, <strong>ukur dulu</strong>: <code className="inline">SELECT id, COUNT(*) c FROM t GROUP BY id HAVING c &gt; 1</code> — berapa % duplikat? Dari mana? Dedupe tanpa memahami sumber duplikat = mengobati gejala.</p>
</div>

      <h2 id="pivot">Pivot Manual — Baris jadi Kolom</h2>

      <p>Laporan ingin kategori sebagai kolom (bukan baris). Conditional aggregation (C3) = pivot manual:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT strftime(&#x27;%Y-%m&#x27;, tanggal) AS bulan,
  SUM(CASE WHEN kategori = &#x27;belanja&#x27; THEN jumlah ELSE 0 END) AS belanja,
  SUM(CASE WHEN kategori = &#x27;makan&#x27; THEN jumlah ELSE 0 END) AS makan,
  SUM(CASE WHEN kategori = &#x27;travel&#x27; THEN jumlah ELSE 0 END) AS travel,
  SUM(jumlah) AS total
FROM transaksi
GROUP BY 1
ORDER BY 1;</pre>

      <ul>
<li>Tiap kategori → satu kolom. Skala ke puluhan kategori dengan generate CASE (atau PIVOT syntax di BigQuery/Snowflake).</li>
<li><strong>Unpivot</strong> (kolom → baris): UNION ALL per kolom (C8) — untuk normalisasi data wide.</li>
<li><strong>Kapan:</strong> tabel laporan, perbandingan kategori, input chart.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pivot dinamis (kategori tak diketahui)? Di SQLite/Postgres: generate query via string aggregation, atau pivot di aplikasi/Python (pandas D6). Jangan hardcode 50 CASE jika kategori berubah tiap bulan.</p>
</div>

      <h2 id="yoy">YoY / MoM — Pertumbuhan dengan LAG</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH bulanan AS (
  SELECT strftime(&#x27;%Y-%m&#x27;, tanggal) AS bulan,
         SUM(jumlah) AS total
  FROM transaksi
  GROUP BY 1
)
SELECT bulan, total,
  LAG(total, 1) OVER (ORDER BY bulan) AS bulan_lalu,
  (total - LAG(total, 1) OVER (ORDER BY bulan))
    * 1.0 / LAG(total, 1) OVER (ORDER BY bulan) AS mom_growth
FROM bulanan;</pre>

      <ul>
<li><strong>MoM:</strong> LAG(..., 1); <strong>YoY:</strong> LAG(..., 12) pada data bulanan.</li>
<li><strong>Rumus growth:</strong> (baru - lama) / lama. Waspadai lama = 0/NULL!</li>
<li><strong>Bulan hilang:</strong> LAG(...,1) pada data berlubang = &ldquo;bulan data sebelumnya&rdquo;, bukan &ldquo;bulan kalender lalu&rdquo;! Butuh date spine (C7) untuk kalender benar.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Growth negatif kecil = tidak masalah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tergantung basis! Turun 5% dari 100M = 5M hilang; naik 50% dari 1jt = 500rb. Selalu tampilkan <strong>angka absolut + %</strong> berdampingan. % tanpa basis = manipulasi (disengaja atau tidak).</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> YTD (year-to-date): <code className="inline">SUM(total) OVER (PARTITION BY strftime('%Y', bulan) ORDER BY bulan ROWS UNBOUNDED PRECEDING AND CURRENT ROW)</code> — running total yang reset tiap tahun (PARTITION BY tahun!). Pola laporan keuangan.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Pivot: Total per Kategori, Sep 2026"
  layout={{"barmode": "stack", "yaxis": {"title": "Rupiah"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang stack = hasil pivot: tiap kategori jadi segmen.</p>
<p><strong>Interpretasi:</strong> Pivot mengubah &ldquo;3 baris kategori&rdquo; menjadi &ldquo;1 baris, 3 kolom&rdquo; — format yang diinginkan chart &amp; laporan. <strong>Belanja dominan</strong> — tapi apakah itu sehat (bisnis retail) atau risiko (konsumtif)? Konteks bisnis menentukan.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Dedupe, pivot, YoY = tiga pertanyaan Senin pagi.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Dedupe — satu baris per nasabah (yang terbaru)</summary>
              <p>Tabel <code className="inline">nasabah_hist</code> punya duplikat: tiap update menambah baris. Ambil <em>satu</em> baris terbaru per nasabah.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH ranked AS (
        SELECT *, ROW_NUMBER() OVER (
                 PARTITION BY id ORDER BY updated_at DESC) AS rn
        FROM nasabah_hist
      )
      SELECT * FROM ranked WHERE rn = 1;</pre>
              <p><strong>Bedah:</strong> pola dedupe kanonis: ROW_NUMBER per grup + filter rn=1. &ldquo;Terbaru&rdquo; ditentukan ORDER BY di OVER — ganti jadi <code className="inline">ORDER BY updated_at DESC, id DESC</code> jika updated_at bisa kembar (tie-break deterministik!). Tanpa tie-break, &ldquo;yang terbaru&rdquo; bisa acak di antara kembaran.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Pivot — transaksi per kategori jadi kolom</summary>
              <p>Ubah baris kategori menjadi kolom: total per bulan untuk &#x27;gaji&#x27;, &#x27;belanja&#x27;, &#x27;transfer&#x27;.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT DATE_TRUNC(&#x27;month&#x27;, tanggal) AS bulan,
        SUM(CASE WHEN kategori=&#x27;gaji&#x27;     THEN nominal ELSE 0 END) AS gaji,
        SUM(CASE WHEN kategori=&#x27;belanja&#x27;  THEN nominal ELSE 0 END) AS belanja,
        SUM(CASE WHEN kategori=&#x27;transfer&#x27; THEN nominal ELSE 0 END) AS transfer
      FROM transaksi GROUP BY 1 ORDER BY 1;</pre>
              <p><strong>Bedah:</strong> pivot manual = conditional aggregation (C3!) per kategori. <strong>Jebakan:</strong> kategori baru bulan depan (&#x27;investasi&#x27;) <em>tidak otomatis</em> jadi kolom — pivot manual butuh daftar kategori eksplisit. Untuk dashboard dinamis, pivot di aplikasi/BI tool, bukan SQL.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: YoY — Januari tahun ini vs Januari tahun lalu</summary>
              <p>Pertumbuhan YoY per bulan 2026 vs bulan yang sama 2025.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH bulanan AS (
        SELECT DATE_TRUNC(&#x27;month&#x27;, tanggal) AS bulan,
               SUM(nominal) AS total
        FROM transaksi GROUP BY 1
      )
      SELECT bulan, total,
             LAG(total, 12) OVER (ORDER BY bulan) AS total_thn_lalu,
             ROUND(100.0 * (total - LAG(total, 12) OVER (ORDER BY bulan))
                   / LAG(total, 12) OVER (ORDER BY bulan), 1) AS yoy_pct
      FROM bulanan ORDER BY bulan;</pre>
              <p><strong>Bedah:</strong> <code className="inline">LAG(total, 12)</code> = &ldquo;12 baris sebelumnya&rdquo; = bulan yang sama tahun lalu (data bulanan!). <strong>Jebakan Februari:</strong> bandingkan 2026-02 (28 hari) vs 2024-02 (29 hari, kabisat!) — normalisasi per hari jika presisi penting: <code className="inline">total / EXTRACT(DAY FROM ...)</code>.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Dedupe</h2>

      <p>Buat duplikat buatan: UNION ALL-kan nasabah dengan dirinya (ubah penghasilan). Lalu dedup: ambil penghasilan <strong>terbesar</strong> per id.</p>

      <PyodideLab
  title="Lab 1 — Satu Baris per Nasabah"
  hint="Ukur: berapa % duplikat? Aturan menang apa yang paling masuk akal di sini?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH d AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY penghasilan DESC) AS rn
  FROM (...data berduplikat...)
)
SELECT * FROM d WHERE rn = 1;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Pivot + MoM</h2>

      <p>Pivot: baris = kategori, kolom = channel (mobile/web/atm) berisi SUM(jumlah). Tambahkan kolom total.</p>

      <PyodideLab
  title="Lab 2 — Pivot Kategori per Channel"
  hint="Channel mana dominan per kategori? Apa implikasi bisnisnya?"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kategori,
  SUM(CASE WHEN channel = &#x27;mobile&#x27; THEN jumlah ELSE 0 END) AS mobile,
  SUM(CASE WHEN channel = &#x27;web&#x27; THEN jumlah ELSE 0 END) AS web,
  SUM(CASE WHEN channel = &#x27;atm&#x27; THEN jumlah ELSE 0 END) AS atm,
  SUM(jumlah) AS total
FROM transaksi
GROUP BY kategori;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Pola Analisis</h2>

      <div className="decision-card">
<h3>1. Duplikat → <strong>ukur, lalu ROW_NUMBER</strong></h3>
<p><strong>Kondisi data:</strong> Satu per grup.</p>
<p><strong>Kenapa:</strong> Definisikan duplikat (PARTITION BY) + aturan menang (ORDER BY).</p>
<p><strong>Contoh nyata:</strong> Terbaru per id.</p>
</div>

      <div className="decision-card">
<h3>2. Kategori jadi kolom → <strong>pivot (CASE)</strong></h3>
<p><strong>Kondisi data:</strong> Laporan/chart.</p>
<p><strong>Kenapa:</strong> SUM(CASE WHEN ...) per kategori.</p>
<p><strong>Contoh nyata:</strong> Omzet per kategori per bulan.</p>
</div>

      <div className="decision-card">
<h3>3. Pertumbuhan → <strong>LAG + rumus</strong></h3>
<p><strong>Kondisi data:</strong> MoM/YoY.</p>
<p><strong>Kenapa:</strong> (baru-lama)/lama; waspadai basis 0 & bulan hilang.</p>
<p><strong>Contoh nyata:</strong> YoY per kategori.</p>
</div>

      <div className="decision-card">
<h3>4. Akumulasi tahun berjalan → <strong>YTD</strong></h3>
<p><strong>Kondisi data:</strong> Target tahunan.</p>
<p><strong>Kenapa:</strong> Running total PARTITION BY tahun.</p>
<p><strong>Contoh nyata:</strong> Realisasi vs target.</p>
</div>

      <div className="decision-card">
<h3>5. Kolom jadi baris → <strong>unpivot (UNION ALL)</strong></h3>
<p><strong>Kondisi data:</strong> Normalisasi.</p>
<p><strong>Kenapa:</strong> Kebalikan pivot.</p>
<p><strong>Contoh nyata:</strong> Wide → long untuk analisis.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Dedup: ukur dulu, aturan menang eksplisit.</li><li>Pivot = CASE dalam agregat; unpivot = UNION ALL.</li><li>Growth: tampilkan absolut + %; waspadai basis &amp; lubang kalender.</li><li>Tiga pola ini = 80% query laporan rutin.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Laporan Senin Pagi</h2>

      <div className="callout">
<p>Tulis <strong>satu query</strong> untuk laporan Senin: per kategori, tampilkan total bulan ini, total bulan lalu, MoM %, dan pangsa dari total. Data: tabel transaksi.</p><p><strong>Pertanyaan:</strong> struktur CTE apa yang kamu pakai? (Tidak perlu sempurna — rancang alurnya.)</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Struktur:</strong> <code className="inline">WITH bulanan AS (pivot per bulan-kategori), dibanding AS (tambah LAG per kategori)</code> → SELECT kategori, total, bulan_lalu, mom, pangsa.</p><p><code className="inline">WITH b AS (SELECT kategori, strftime('%Y-%m',tanggal) bl, SUM(jumlah) s FROM transaksi GROUP BY 1,2), c AS (SELECT *, LAG(s) OVER (PARTITION BY kategori ORDER BY bl) AS lalu FROM b) SELECT kategori, s AS total, lalu, (s-lalu)/lalu AS mom, s/SUM(s) OVER () AS pangsa FROM c WHERE bl = '2026-09';</code></p><p><strong>Pelajaran:</strong> laporan kompleks = <strong>komposisi pola</strong> (pivot + LAG + % of total). Tiap pola sudah kamu kuasai — merangkai tinggal latihan.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Modifikasi dedupe kasus 1: jika <code className="inline">updated_at</code> kembar, pilih <code className="inline">id</code> terbesar. Tulis ORDER BY-nya.</li>
              <li>Pivot: hitung <em>jumlah transaksi</em> (bukan total nominal) per kategori per bulan.</li>
              <li>Hitung MoM (month-over-month) — apa yang berubah dari query YoY di atas? Kapan MoM menyesatkan?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <code className="inline">ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC, id DESC)</code> — tie-break eksplisit = deterministik.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2. COUNT(CASE...) bukan SUM:
      SELECT DATE_TRUNC(&#x27;month&#x27;, tanggal) AS bulan,
        COUNT(CASE WHEN kategori=&#x27;gaji&#x27; THEN 1 END) AS n_gaji,
        COUNT(CASE WHEN kategori=&#x27;belanja&#x27; THEN 1 END) AS n_belanja
      FROM transaksi GROUP BY 1;
      -- COUNT mengabaikan NULL -&gt; tanpa ELSE sudah benar!</pre>
              <p><strong>3.</strong> <code className="inline">LAG(total, 1)</code> bukan 12. MoM menyesatkan saat musiman kuat (mis. Desember selalu tinggi → Januari &ldquo;turun&rdquo; padahal normal) — di situlah YoY lebih jujur.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Dedupe:</strong> ukur → ROW_NUMBER (PARTITION BY id, ORDER BY aturan menang) → rn=1.</li><li><strong>Pivot:</strong> SUM(CASE WHEN ...) — baris jadi kolom; unpivot = UNION ALL.</li><li><strong>YoY/MoM:</strong> LAG + (baru-lama)/lama; waspadai basis 0 &amp; lubang kalender.</li><li><strong>YTD:</strong> running total PARTITION BY tahun.</li><li>Tiga pola = Senin pagi yang tenang.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c9-window-functions-2" className="btn btn-secondary btn-sm">← ← C9-2</Link>
        <Link href="/learn/c11-cohort-retention-funnel" className="btn btn-primary btn-sm">Next: C11 →</Link>
      </div>
    </div>
  );
}

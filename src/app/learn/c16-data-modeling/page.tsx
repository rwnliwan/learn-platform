import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C16DataModelingPage() {
  const chart1 = [{"x": ["OLTP\n(12 JOIN)", "Star schema\n(2 JOIN)"], "y": [12, 2], "type": "bar", "marker": {"color": ["#ef4444", "#34a853"]}, "text": ["12 JOIN", "2 JOIN"], "textposition": "outside"}];
  const lab1Code = String.raw`import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE kredit (
  id INTEGER PRIMARY KEY,
  nasabah_id INTEGER,
  plafon REAL,
  tenor INTEGER,
  dpd INTEGER,
  kolektibilitas INTEGER
)""")
data_kredit = [
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
    (12, 5, 20000000, 6, 150, 5)
]
cur.executemany("INSERT INTO kredit VALUES (?,?,?,?,?,?)", data_kredit)
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
# -- latihan desain: tulis DDL fact_kredit & dim_nasabah di sini
# SELECT 'tulis DDL star schema-mu, lalu query: total plafon per kota' AS instruksi
q("""SELECT * FROM kredit LIMIT 3""")`;
  const lab2Code = String.raw`import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE dim_nasabah (sk INTEGER PRIMARY KEY, id_natural INTEGER, nama TEXT, kota TEXT, berlaku_dari TEXT, berlaku_sampai TEXT, is_current INTEGER)""")
data_dim_nasabah = [
    (1, 1, 'Andi', 'Jakarta', '2020-01-01', '2026-05-31', 0),
    (2, 1, 'Andi', 'Bandung', '2026-06-01', '9999-12-31', 1)
]
cur.executemany("INSERT INTO dim_nasabah VALUES (?,?,?,?,?,?,?)", data_dim_nasabah)
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
# SELECT kota FROM dim_nasabah WHERE id_natural=1 AND is_current=1
q("""SELECT * FROM dim_nasabah WHERE id_natural = 1""")`;
  const quizData = [{"question": "OLTP vs OLAP: yang benar…", "options": ["Sama", "OLTP = transaksi (normalisasi); OLAP = analisis (star schema)", "OLAP lebih kecil", "OLTP untuk dashboard"], "correct": 1, "explanation": "Benar: tujuan beda → desain beda."}, {"question": "Grain = …", "options": ["Jumlah baris", "&ldquo;1 baris = apa?&rdquo; — keputusan desain terpenting", "Ukuran storage", "Jumlah kolom"], "correct": 1, "explanation": "Benar: salah grain = salah segalanya."}, {"question": "Star vs snowflake…", "options": ["Sama", "Star = dimensi langsung (untuk analis); snowflake = dinormalisasi (hemat, JOIN banyak)", "Snowflake untuk analis", "Star lebih hemat"], "correct": 1, "explanation": "Benar: star = kemudahan analis."}, {"question": "SCD-2 dipakai saat…", "options": ["Koreksi typo", "Histori perubahan penting (kota saat transaksi)", "Tidak pernah", "Selalu"], "correct": 1, "explanation": "Benar: versi + tanggal berlaku + surrogate key."}, {"question": "dbt {{ ref() }} berguna untuk…", "options": ["Styling", "Dependency graph otomatis + lineage", "Kecepatan query", "Enkripsi"], "correct": 1, "explanation": "Benar: dbt tahu urutan & asal-usul data."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C16 — SQL Engineering</span>
        <h1 className="display-title">Data Modeling: Star Schema<br/>&amp; Analitik Modern</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Query yang Butuh 12 JOIN</a></li>
          <li><a href="#oltp">OLTP vs OLAP — Dua Dunia</a></li>
          <li><a href="#star">Star Schema — Fact &amp; Dimension</a></li>
          <li><a href="#scd">SCD — Dimensi yang Berubah</a></li>
          <li><a href="#dbt">ELT + dbt — Analitik Modern ⭐</a></li>
          <li><a href="#lab1">🔬 Lab 1: Rancang Star Schema</a></li>
          <li><a href="#lab2">🔬 Lab 2: SCD-2 Mini</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Modeling</a></li>
          <li><a href="#case">📋 Mini-Case: 12 JOIN → Star</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Membedakan <strong>OLTP vs OLAP</strong> dan <strong>star vs snowflake schema</strong>.</li><li>Merancang <strong>fact + dimension</strong> untuk kasus kredit/transaksi.</li><li>Menjelaskan <strong>SCD</strong> (slowly changing dimensions).</li><li>Menjelaskan alur <strong>ELT + dbt</strong> modern (job relevance!).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Query yang Butuh 12 JOIN</h2>

      <div className="story"><p>Analis baru menulis laporan &ldquo;NPL per segmen&rdquo; — query-nya butuh <strong>12 JOIN</strong> melintasi database transaksional yang dinormalisasi. Query lambat, sulit dibaca, dan tiap analis menulis versinya sendiri — angka beda-beda!</p><p>Solusi industri: <strong>data warehouse</strong> dengan <strong>star schema</strong> — data dimodelkan <em>untuk analisis</em> (bukan untuk transaksi). Ditambah <strong>dbt</strong> (transformasi sebagai kode + test). Ini skill engineering yang dicari 2026 — dan membuat analis 10× lebih produktif.</p><p><strong>Twist-nya:</strong> 12 JOIN bukan salah — ia <em>gejala</em>: data dimodelkan untuk transaksi (cepat tulis), bukan untuk analisis (cepat baca). Star schema terlihat &ldquo;redundan&rdquo; (data diduplikasi!) bagi insinyur database — tapi redundansi yang <em>disengaja</em> inilah yang membuat analis 10× produktif. Normalisasi sempurna = transaksi bahagia, analis tersiksa. Desain yang benar tergantung siapa yang bertanya.</p></div>

      <h2 id="oltp">OLTP vs OLAP — Dua Dunia</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>OLTP (transaksional)</th><th>OLAP (analitik)</th></tr></thead>
<tbody>
<tr><td>Tujuan</td><td>Proses transaksi cepat</td><td>Analisis & laporan</td></tr>
<tr><td>Query</td><td>Kecil, banyak, cepat</td><td>Besar, sedikit, kompleks</td></tr>
<tr><td>Skema</td><td>Ternormalisasi (3NF)</td><td>Star schema (denormalisasi)</td></tr>
<tr><td>Contoh</td><td>Core banking, aplikasi</td><td>Data warehouse, dashboard</td></tr>
</tbody>
</table>
</div>

      <p><strong>Normalisasi</strong> (3NF) = hindari redundansi — bagus untuk transaksi (update 1 tempat). <strong>Tapi</strong> untuk analisis, normalisasi = JOIN banyak = lambat + rumit. Maka: <strong>ELT</strong> — salin ke warehouse, lalu model ulang untuk analisis.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan praktis: <strong>jangan analisis langsung di database produksi!</strong> Query beratmu bisa memperlambat transaksi nasabah. Analisis di warehouse/replika — selalu.</p>
</div>

      <h2 id="star">Star Schema — Fact &amp; Dimension</h2>

      <p><strong>Fact table</strong> = kejadian terukur (transaksi, pencairan kredit): kunci asing + <strong>measures</strong> (jumlah, plafon). <strong>Dimension</strong> = konteks (nasabah, waktu, produk): atribut deskriptif.</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- fact_transaksi: grain = 1 baris per transaksi
CREATE TABLE fact_transaksi (
  transaksi_id INTEGER PRIMARY KEY,
  nasabah_key INTEGER,   -- FK ke dim_nasabah
  waktu_key INTEGER,     -- FK ke dim_waktu
  jumlah REAL,           -- measure
  kategori TEXT         -- degenerate dimension
);

-- dim_nasabah: atribut nasabah
CREATE TABLE dim_nasabah (
  nasabah_key INTEGER PRIMARY KEY,
  nama TEXT, kota TEXT, segmen TEXT
);

-- query: JOIN sedikit, mudah dibaca!
SELECT d.kota, SUM(f.jumlah)
FROM fact_transaksi f
JOIN dim_nasabah d ON d.nasabah_key = f.nasabah_key
GROUP BY 1;</pre>

      <ul>
<li><strong>Grain:</strong> &ldquo;1 baris = apa?&rdquo; — keputusan desain terpenting! (1 baris = 1 transaksi.)</li>
<li><strong>Star vs snowflake:</strong> star = dimensi langsung (denormalisasi, JOIN sedikit); snowflake = dimensi dinormalisasi lagi (hemat, JOIN banyak). <strong>Star untuk analis.</strong></li>
<li><strong>dim_waktu:</strong> tabel kalender (tanggal → hari/bulan/kuartal/libur) — <em>wajib</em> di setiap warehouse!</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Denormalisasi = desain buruk.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Di OLTP ya; di OLAP justru <em>desain yang benar</em>! Tujuan beda: OLTP hemat update, OLAP hemat JOIN. Menilai star schema dengan kacamata normalisasi = salah alamat.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Satu warehouse cocok untuk semua kebutuhan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Warehouse (OLAP) untuk analisis batch; <strong>data lake</strong> untuk data mentah tak terstruktur; <strong>OLTP</strong> untuk transaksi. Memaksa semua ke satu sistem = tidak ada yang optimal. Arsitektur modern = <em>tiap beban ke sistem yang tepat</em> (lakehouse menggabungkan beberapa).</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tiga pertanyaan sebelum modeling: (1) <strong>grain</strong>-nya apa? (2) <strong>measures</strong>-nya apa? (3) <strong>dipotong</strong> (slice) berdasar dimensi apa? Jawab tiga ini = 80% desain selesai.</p>
</div>

      <h2 id="scd">SCD — Dimensi yang Berubah</h2>

      <p>Nasabah pindah Jakarta → Bandung. Bagaimana catatnya? <strong>Slowly Changing Dimensions:</strong></p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Tipe</th><th>Cara</th><th>Kapan</th></tr></thead>
<tbody>
<tr><td>SCD-1</td><td>Timpa (overwrite)</td><td>Koreksi salah input; histori tak penting</td></tr>
<tr><td>SCD-2</td><td>Baris baru + tanggal berlaku</td><td>Histori penting! (alamat saat transaksi)</td></tr>
<tr><td>SCD-3</td><td>Kolom 'nilai_lama'</td><td>Jarang — hanya butuh 1 versi lama</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SCD-2: dim_nasabah dengan versi
-- (nasabah_key surrogate, id_natural, kota, berlaku_dari, berlaku_sampai, is_current)
SELECT * FROM dim_nasabah WHERE id_natural = 1 AND is_current = 1;  -- kini
SELECT * FROM dim_nasabah WHERE id_natural = 1;  -- semua versi (histori)</pre>

      <p><strong>Mengapa penting:</strong> &ldquo;transaksi 2025 per kota&rdquo; — kota <em>saat transaksi</em> atau <em>kini</em>? SCD-2 menjawab benar. Tanpa SCD, histori tertimpa = analisis historis salah!</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Surrogate key (nasabah_key) vs natural key (id): fact menunjuk surrogate — agar versi histori tepat. Ini alasan &ldquo;key&rdquo; bukan &ldquo;id&rdquo; di fact table.</p>
</div>

      <h2 id="dbt">ELT + dbt — Analitik Modern ⭐</h2>

      <p><strong>ELT</strong> (Extract-Load-Transform): muat data mentah dulu (murah, cloud), transformasi <em>di dalam</em> warehouse. Kebalikan ETL lama (transform sebelum load).</p>

      <p><strong>dbt</strong> (data build tool) = standar industri 2026: transformasi sebagai <strong>kode SQL + test + dokumentasi</strong>:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- models/mart/npl_per_kota.sql (dbt model = SELECT biasa!)
SELECT kota, SUM(...) AS npl_ratio
FROM &#123;&#123; ref(&#x27;fact_kredit&#x27;) &#125;&#125;  -- ref = dependency otomatis!
GROUP BY 1

-- models/mart/npl_per_kota.yml (test + dokumen)
tests:
  - unique: [kota]
  - not_null: [npl_ratio]</pre>

      <ul>
<li><code className="inline">&#123;&#123; ref() &#125;&#125;</code> = dependency graph otomatis (dbt tahu urutan jalan + lineage!).</li>
<li><strong>Test</strong> (C15!) = bagian dari model — pipeline gagal jika test gagal.</li>
<li><strong>Dokumentasi</strong> = dari kode — definisi NPL satu tempat, konsisten!</li>
<li><strong>Kenapa dicari:</strong> &ldquo;analytics engineer&rdquo; = role terpanas 2024–2026; dbt di hampir semua lowongan.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Alur modern: sumber → (Fivetran/Airbyte) → warehouse (BigQuery/Snowflake) → <strong>dbt</strong> (staging → mart) → BI (dashboard). Hafalkan 5 langkah ini — ia menjawab &ldquo;jelaskan modern data stack&rdquo; di interview.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Kompleksitas Query: OLTP vs Star (ilustrasi)"
  layout={{"yaxis": {"title": "Jumlah JOIN"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Jumlah JOIN untuk laporan &ldquo;NPL per kota per segmen&rdquo;.</p>
<p><strong>Interpretasi:</strong> Star schema memangkas 12 JOIN jadi 2 — query <strong>lebih cepat ditulis, dibaca, dan dieksekusi</strong>. Inilah ROI data modeling: bayar sekali (desain), hemat selamanya.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Modeling = &ldquo;desain tabel untuk pertanyaan, bukan untuk transaksi&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: 12 JOIN → 2 JOIN</summary>
              <p>Laporan &ldquo;NPL per segmen per bulan&rdquo; dari database OLTP butuh 12 JOIN (nasabah→alamat→kota→provinsi→…→kredit→angsuran→…). Desain star schema-nya?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- FACT: fact_kredit (nasabah_key, waktu_key, kota_key, segmen_key,
      --                   baki_debet, dpd, status)
      -- DIM:  dim_nasabah, dim_waktu, dim_kota, dim_segmen
      -- Query NPL per segmen per bulan: 1 fact + 2 dim = 2 JOIN!
      SELECT s.segmen, w.bulan,
             100.0*SUM(CASE WHEN f.status=&#x27;macet&#x27; THEN f.baki_debet END)
               /SUM(f.baki_debet) AS npl_pct
      FROM fact_kredit f
      JOIN dim_segmen s ON s.key = f.segmen_key
      JOIN dim_waktu w  ON w.key = f.waktu_key
      GROUP BY s.segmen, w.bulan;</pre>
              <p><strong>Bedah:</strong> fact = angka yang dihitung (additive!); dim = &ldquo;potongan&rdquo; analisis. 12 JOIN → 2 JOIN bukan sulap — ia hasil <em>memindahkan kompleksitas</em> dari query-time (tiap analis, tiap hari) ke design-time (sekali, oleh engineer). Itulah gunanya modeling.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: SCD-2 — nasabah pindah kota</summary>
              <p>Budi pindah Jakarta → Surabaya 15 Jun 2026. Laporan &ldquo;NPL per kota Juni&rdquo; harus konsisten sebelum &amp; sesudah pindah. Bagaimana?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SCD Type 2: baris baru per perubahan, bukan UPDATE!
      -- dim_nasabah: (key, id_alami, kota, valid_from, valid_to, is_current)
      -- (101, &#x27;B001&#x27;, &#x27;Jakarta&#x27;,  2020-01-01, 2026-06-14, false)
      -- (102, &#x27;B001&#x27;, &#x27;Surabaya&#x27;, 2026-06-15, 9999-12-31, true)
      -- Fact 10 Jun -&gt; key 101 (Jakarta); fact 20 Jun -&gt; key 102 (Surabaya).</pre>
              <p><strong>Bedah:</strong> UPDATE kota = menghancurkan sejarah (laporan lama berubah!). SCD-2 = &ldquo;jangan update, tambah baris&rdquo;. Harga: dimensi membesar; bayaran: <em>semua</em> laporan historis tetap konsisten. Untuk atribut analitis, sejarah &gt; kekinian.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: dbt test — kontrak di kode</summary>
              <p>Model dbt <code className="inline">mart_npl</code> tidak boleh punya kota NULL dan NPL tidak boleh negatif. Tulis test-nya.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- models/mart_npl.yml
      models:
        - name: mart_npl
          columns:
            - name: kota
              tests: [not_null, unique]
            - name: npl_pct
              tests:
                - dbt_expectations.expect_column_values_to_be_between:
                    min_value: 0
                    max_value: 100</pre>
              <p><strong>Bedah:</strong> test ditulis <em>sekali</em> di YAML, dijalankan <em>setiap</em> build (<code className="inline">dbt test</code>). Inilah C15 (quality) sebagai kode: bukan &ldquo;ingat cek&rdquo;, melainkan &ldquo;pipeline menolak lanjut jika gagal&rdquo;. Transformasi sebagai kode + test = analis yang tidur nyenyak.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Rancang Star Schema</h2>

      <p>Rancang star schema untuk analisis <strong>kredit</strong>: tentukan grain, fact (+measures), dimensions (+atribut). Tulis DDL-nya!</p>

      <PyodideLab
  title="Lab 1 — Fact &amp;amp; Dimension (Desain)"
  hint="Pertanyaan desain: grain = 1 baris per...? Measures? Dimensions?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- grain: 1 baris per fasilitas kredit
CREATE TABLE fact_kredit (
  kredit_key INTEGER PRIMARY KEY,
  nasabah_key INTEGER,
  waktu_key INTEGER,      -- tgl pencairan
  plafon REAL,            -- measure
  dpd INTEGER,            -- measure (snapshot)
  kolektibilitas INTEGER
);
CREATE TABLE dim_nasabah (nasabah_key INTEGER PRIMARY KEY, nama TEXT, kota TEXT, segmen TEXT);
CREATE TABLE dim_waktu (waktu_key INTEGER PRIMARY KEY, tanggal TEXT, bulan TEXT, kuartal TEXT);</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: SCD-2 Mini</h2>

      <p>Buat dim_nasabah SCD-2 untuk Andi (pindah Jkt→Bdg 2026-06-01). Query: kota Andi <strong>saat ini</strong> vs <strong>semua versi</strong>.</p>

      <PyodideLab
  title="Lab 2 — Histori Kota"
  hint="Kenapa fact harus menunjuk sk (surrogate), bukan id_natural?"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- kini:
SELECT kota FROM dim_nasabah WHERE id_natural = 1 AND is_current = 1;
-- histori:
SELECT kota, berlaku_dari, berlaku_sampai FROM dim_nasabah WHERE id_natural = 1;
-- surrogate: fact menunjuk versi tepat saat kejadian!</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Modeling</h2>

      <div className="decision-card">
<h3>1. Desain baru → <strong>tanya grain-measures-dimensi</strong></h3>
<p><strong>Kondisi data:</strong> Fondasi.</p>
<p><strong>Kenapa:</strong> 3 pertanyaan = 80% desain.</p>
<p><strong>Contoh nyata:</strong> 1 baris = 1 transaksi.</p>
</div>

      <div className="decision-card">
<h3>2. Untuk analis → <strong>star</strong> (bukan snowflake)</h3>
<p><strong>Kondisi data:</strong> Kemudahan.</p>
<p><strong>Kenapa:</strong> JOIN sedikit; analis mandiri.</p>
<p><strong>Contoh nyata:</strong> fact + dim langsung.</p>
</div>

      <div className="decision-card">
<h3>3. Atribut berubah + histori penting → <strong>SCD-2</strong></h3>
<p><strong>Kondisi data:</strong> Histori.</p>
<p><strong>Kenapa:</strong> Baris versi + surrogate key.</p>
<p><strong>Contoh nyata:</strong> Kota saat transaksi.</p>
</div>

      <div className="decision-card">
<h3>4. Koreksi saja → <strong>SCD-1</strong></h3>
<p><strong>Kondisi data:</strong> Simpel.</p>
<p><strong>Kenapa:</strong> Timpa; histori tak penting.</p>
<p><strong>Contoh nyata:</strong> Typo nama.</p>
</div>

      <div className="decision-card">
<h3>5. Transformasi modern → <strong>ELT + dbt</strong></h3>
<p><strong>Kondisi data:</strong> Standar 2026.</p>
<p><strong>Kenapa:</strong> SQL + test + lineage sebagai kode.</p>
<p><strong>Contoh nyata:</strong> Staging → mart.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Analisis di <strong>warehouse</strong>, bukan produksi.</li><li>Grain dulu — salah grain = salah segalanya.</li><li>Star untuk analis; snowflake untuk hemat storage.</li><li>dbt: <code className="inline">ref()</code> + test + dokumen = pipeline profesional.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: 12 JOIN → Star</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Laporan &ldquo;NPL per kota per segmen&rdquo; butuh 12 JOIN di OLTP; 3 analis menulis 3 versi; angka beda 5%.</p><p><strong>Tugas:</strong> (1) Rancang star schema-nya (fact, dims, grain). (2) Tulis query versi star. (3) Jelaskan ke CTO <strong>3 kalimat</strong>: kenapa investasi modeling worth it?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> fact_kredit (grain: 1 baris/fasilitas; measures: plafon, dpd, kol) + dim_nasabah (kota, segmen) + dim_waktu. <strong>(2)</strong> <code className="inline">SELECT n.kota, n.segmen, SUM(CASE WHEN f.kolektibilitas&gt;=3 THEN f.plafon END)/SUM(f.plafon) FROM fact_kredit f JOIN dim_nasabah n ... GROUP BY 1,2;</code> — 1 JOIN!</p><p><strong>(3)</strong> &ldquo;Satu definisi NPL, satu tempat — 3 analis dapat angka sama. Query 12 JOIN jadi 1; laporan yang tadinya 2 hari jadi 2 jam. Investasi 2 minggu modeling menghemat ratusan jam analis per tahun.&rdquo;</p><p><strong>Pelajaran:</strong> modeling = <strong>konsistensi + kecepatan</strong>. &ldquo;Single source of truth&rdquo; bukan jargon — ia selisih 5% yang hilang.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Sebutkan 1 fact &amp; 3 dim untuk mart &ldquo;transaksi fraud per kota per jam&rdquo;.</li>
              <li>Mengapa fact table menyimpan <em>key</em> (surrogate), bukan nama kota langsung (&#x27;Jakarta&#x27;)?</li>
              <li>Kapan SCD-1 (UPDATE langsung) boleh dipakai? Beri contoh.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Fact: <code className="inline">fact_fraud</code> (nominal, is_fraud, skor). Dim: <code className="inline">dim_waktu</code> (jam), <code className="inline">dim_kota</code>, <code className="inline">dim_kartu/segmen</code>.</p>
              <p><strong>2.</strong> (a) Nama berubah (&#x27;Jakarta&#x27; → &#x27;DKI Jakarta&lsquo;) — key stabil. (b) SCD-2 butuh banyak baris per kota — key membedakan versi. (c) Join integer lebih cepat dari string. Key = identitas stabil; nama = label yang bisa berubah.</p>
              <p><strong>3.</strong> Untuk <strong>koreksi kesalahan</strong> (bukan perubahan dunia nyata): mis. kota salah input &ldquo;Jakrta&rdquo; → UPDATE jadi &ldquo;Jakarta&rdquo; (SCD-1). Aturan: salah ketik = SCD-1; pindah beneran = SCD-2.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>OLTP</strong> (transaksi, 3NF) vs <strong>OLAP</strong> (analisis, star).</li><li><strong>Star:</strong> fact (measures) + dimensions; grain = keputusan terpenting.</li><li><strong>SCD-2:</strong> histori perubahan via versi + surrogate key.</li><li><strong>ELT + dbt:</strong> SQL + test + lineage = standar 2026; analytics engineer role terpanas.</li><li>Analisis di warehouse, bukan produksi!</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c15-data-quality" className="btn btn-secondary btn-sm">← ← C15</Link>
        <Link href="/learn/c17-index-explain" className="btn btn-primary btn-sm">Next: C17 →</Link>
      </div>
    </div>
  );
}

import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C11CohortRetentionFunnelPage() {
  const chart1 = [{"x": ["M0", "M1", "M2"], "y": [100, 45, 30], "type": "bar", "name": "Cohort Jan", "marker": {"color": "#2a7de1"}}, {"x": ["M0", "M1", "M2"], "y": [100, 60, 48], "type": "bar", "name": "Cohort Feb", "marker": {"color": "#34a853"}}];
  const chart2 = [{"x": ["Daftar", "Verifikasi", "Trx pertama", "Repeat 3×"], "y": [10, 8, 5, 2], "type": "bar", "marker": {"color": "#e8a838"}, "text": ["10", "8 (80%)", "5 (63%)", "2 (40%)"], "textposition": "outside"}];
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
# WITH f AS (SELECT n.id, CASE WHEN EXISTS(SELECT 1 FROM transaksi t WHERE t.nasabah_id=n.id) THEN 1 ELSE 0 END AS t1, CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id=n.id)>=3 THEN 1 ELSE 0 END AS t3 FROM nasabah n) SELECT COUNT(*) AS daftar, SUM(t1) AS trx1, SUM(t3) AS trx3, SUM(t1)*1.0/COUNT(*) AS conv FROM f
q("""SELECT COUNT(DISTINCT nasabah_id) FROM transaksi""")`;
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
# WITH r AS (SELECT tanggal, date(tanggal, '-' || ROW_NUMBER() OVER (ORDER BY tanggal) || ' days') AS grp FROM (SELECT DISTINCT tanggal FROM transaksi)) SELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari FROM r GROUP BY grp
q("""SELECT DISTINCT tanggal FROM transaksi ORDER BY tanggal""")`;
  const quizData = [{"question": "Cohort didefinisikan berdasar…", "options": ["Waktu kalender", "Waktu akuisisi (masuk)", "Nilai transaksi", "Kota"], "correct": 1, "explanation": "Benar: kelompok per angkatan masuk — untuk melihat kualitas per generasi."}, {"question": "Keunggulan cohort vs churn agregat…", "options": ["Sama", "Cohort bebas distorsi komposisi — menunjukkan tren kualitas", "Cohort lebih cepat", "Churn tidak berguna"], "correct": 1, "explanation": "Benar: banyak pengguna baru menutupi churn buruk di angka agregat."}, {"question": "Funnel menjawab pertanyaan…", "options": ["Siapa terbaik?", "&ldquo;Di tahap mana bocornya?&rdquo;", "Berapa total?", "Kapan puncak?"], "correct": 1, "explanation": "Benar: drop-off terbesar = prioritas perbaikan."}, {"question": "Trik gaps-and-islands untuk deret harian…", "options": ["tanggal + row_number", "tanggal − row_number = konstan per island", "LAG 7 hari", "NTILE"], "correct": 1, "explanation": "Benar: deret berurutan → selisih konstan → GROUP BY."}, {"question": "Sessionization memakai…", "options": ["GROUP BY saja", "LAG untuk jeda + ambang + running SUM sebagai id sesi", "UNION", "PIVOT"], "correct": 1, "explanation": "Benar: deteksi awal sesi dari jeda, lalu nomor sesi kumulatif."}, {"question": "Cohort di credit risk setara dengan…", "options": ["DPD", "Vintage (angkatan kredit) — C13!", "NPL", "LGD"], "correct": 1, "explanation": "Benar: vintage = cohort-nya kredit. Analisis yang sama, domain berbeda."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C11 — SQL</span>
        <h1 className="display-title">Cohort, Retention &amp; Funnel:<br/>Analisis Perilaku</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Kenapa Nasabah Pergi?&rdquo;</a></li>
          <li><a href="#cohort">Cohort Retention — Kelompok per Akuisisi</a></li>
          <li><a href="#funnel">Funnel — Konversi Bertahap</a></li>
          <li><a href="#session">Sessionization &amp; Gaps-and-Islands</a></li>
          <li><a href="#lab1">🔬 Lab 1: Funnel Sederhana</a></li>
          <li><a href="#lab2">🔬 Lab 2: Gaps &amp; Islands</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Analisis Perilaku</a></li>
          <li><a href="#case">📋 Mini-Case: Misteri Akuisisi Naik, Transaksi Stagnan (60+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Membangun <strong>cohort retention</strong> (nasabah per bulan akuisisi × aktivitas).</li><li>Menghitung <strong>funnel conversion</strong> antar tahap.</li><li>Melakukan <strong>sessionization</strong> dan <strong>gaps &amp; islands</strong>.</li><li>Menjelaskan kapan analisis perilaku ini dipakai di risk &amp; produk.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Kenapa Nasabah Pergi?&rdquo;</h2>

      <div className="story"><p>CMO: <em>&ldquo;Akuisisi naik 30%, tapi transaksi total stagnan. Ke mana perginya nasabah baru?&rdquo;</em> Jawabannya ada di <strong>cohort retention</strong>: nasabah Januari — berapa % yang masih transaksi di Februari? Maret?</p><p>Ternyata: 70% nasabah baru tidak pernah transaksi lagi setelah bulan pertama. Masalahnya bukan akuisisi — tapi <strong>aktivasi</strong>. Satu analisis cohort mengubah strategi marketing Rp 2 miliar. Lesson ini (60+ menit, case-heavy) mengajarkan analisis perilaku paling berdampak di industri.</p><p><strong>Twist-nya:</strong> akuisisi naik 30% — kabar baik yang ternyata kabar buruk: 70% nasabah baru tidak pernah kembali. Metrik agregat (&ldquo;total transaksi stagnan&rdquo;) menyembunyikan dua cerita berlawanan: akuisisi yang bagus dan aktivasi yang buruk. Cohort tidak menambah satu byte data pun — ia hanya memotong data dengan cara yang <em>jujur</em>. Kadang insight terbesar datang bukan dari data baru, melainkan dari potongan yang benar.</p></div>

      <h2 id="cohort">Cohort Retention — Kelompok per Akuisisi</h2>

      <p><strong>Definisi.</strong> <strong>Cohort</strong> = kelompok berdasar <em>waktu akuisisi</em> (bulan daftar). <strong>Retention</strong> = % cohort yang masih aktif di periode ke-n.</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH cohort AS (
  -- bulan transaksi pertama tiap nasabah = &#x27;akuisisi&#x27;
  SELECT nasabah_id, MIN(strftime(&#x27;%Y-%m&#x27;, tanggal)) AS bl_akuisisi
  FROM transaksi GROUP BY 1
),
aktif AS (
  SELECT DISTINCT nasabah_id, strftime(&#x27;%Y-%m&#x27;, tanggal) AS bl
  FROM transaksi
)
SELECT c.bl_akuisisi AS cohort,
  COUNT(DISTINCT c.nasabah_id) AS n,
  COUNT(DISTINCT CASE WHEN a.bl = c.bl_akuisisi THEN a.nasabah_id END) AS m0,
  COUNT(DISTINCT CASE WHEN a.bl &gt; c.bl_akuisisi THEN a.nasabah_id END) AS m_lanjut
FROM cohort c LEFT JOIN aktif a ON a.nasabah_id = c.nasabah_id
GROUP BY 1;</pre>

      <ul>
<li><strong>Langkah:</strong> tentukan akuisisi (MIN tanggal) → gabung aktivitas → pivot per periode.</li>
<li><strong>Retention rate:</strong> aktif_periode_n / n_cohort.</li>
<li><strong>Di risk:</strong> cohort = vintage kredit! (C13) — perilaku bayar per angkatan.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Cohort table klasik: baris = cohort (2026-01, 2026-02...), kolom = M0, M1, M2... (% retained). Diagonal = waktu kalender sama — baca pola: apakah cohort baru lebih baik (produk membaik) atau lebih buruk?</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Retention = 1 - churn, jadi sama saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Berhubungan tapi beda lensa: retention per cohort menjawab &ldquo;apakah produk makin baik untuk pengguna baru?&rdquo;; churn agregat tercemar komposisi (banyak pengguna baru = churn terlihat rendah!). Cohort = lensa yang jujur.</p>
</div>

      <h2 id="funnel">Funnel — Konversi Bertahap</h2>

      <p>Funnel = tahap berurutan (daftar → verifikasi → transaksi pertama → repeat). Tiap tahap menyaring:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH tahap AS (
  SELECT n.id,
    1 AS daftar,
    CASE WHEN n.status IS NOT NULL THEN 1 ELSE 0 END AS verifikasi,
    CASE WHEN EXISTS (SELECT 1 FROM transaksi t WHERE t.nasabah_id = n.id) THEN 1 ELSE 0 END AS trx_1,
    CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) &gt;= 3 THEN 1 ELSE 0 END AS repeat
  FROM nasabah n
)
SELECT
  SUM(daftar) AS daftar,
  SUM(verifikasi) AS verifikasi,
  SUM(trx_1) AS trx_pertama,
  SUM(repeat) AS repeat_3x,
  SUM(trx_1) * 1.0 / SUM(daftar) AS conv_daftar_ke_trx
FROM tahap;</pre>

      <ul>
<li><strong>Conversion rate</strong> antar tahap = n_tahap_berikut / n_tahap_ini.</li>
<li><strong>Drop-off terbesar</strong> = prioritas perbaikan produk.</li>
<li><strong>Di fraud:</strong> funnel = pola serangan (C14) — tahap mana yang dieksploitasi?</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Funnel + cohort = ampuh: &ldquo;apakah funnel membaik per cohort?&rdquo; Jika konversi daftar→trx naik tiap bulan, produk membaik. Satu query, dua dimensi insight.</p>
</div>

      <h2 id="session">Sessionization &amp; Gaps-and-Islands</h2>

      <p><strong>Sessionization:</strong> kelompokkan event berurutan menjadi &ldquo;sesi&rdquo; jika jeda &lt; X:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- tandai awal sesi: jeda &gt; 30 menit dari event sebelumnya
WITH e AS (
  SELECT *,
    CASE WHEN julianday(tanggal) - julianday(LAG(tanggal) OVER (
      PARTITION BY nasabah_id ORDER BY tanggal)) &gt; 30.0/1440
      THEN 1 ELSE 0 END AS sesi_baru
  FROM transaksi)
SELECT *, SUM(sesi_baru) OVER (
  PARTITION BY nasabah_id ORDER BY tanggal) AS id_sesi
FROM e;</pre>

      <p><strong>Gaps-and-islands:</strong> temukan <em>rentang berurutan</em> (islands) vs <em>lubang</em> (gaps) — pola klasik:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- trik: tanggal - row_number = konstan untuk deret berurutan!
WITH r AS (
  SELECT tanggal,
    date(tanggal, &#x27;-&#x27; || ROW_NUMBER() OVER (ORDER BY tanggal) || &#x27; days&#x27;) AS grp
  FROM (SELECT DISTINCT tanggal FROM transaksi))
SELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari
FROM r GROUP BY grp;</pre>

      <ul>
<li><strong>Trik:</strong> untuk deret harian berurutan, <code className="inline">tanggal - row_number</code> konstan → GROUP BY nilai itu = islands!</li>
<li><strong>Kapan:</strong> streak transaksi, hari aktif berurutan, deteksi pola velocity (C14).</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Gaps-and-islands hanya teka-teki interview.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Justru pola produksi: streak login (gamifikasi), <em>consecutive DPD</em> (kolektibilitas!), pola transaksi fraud beruntun. Interview menanyakannya <em>karena</em> dipakai di produksi.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Cohort Retention (ilustrasi): % Aktif per Bulan"
  layout={{"barmode": "group", "yaxis": {"title": "% retained"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang per cohort; sumbu X = bulan sejak akuisisi (M0 = bulan akuisisi).</p>
<p><strong>Interpretasi:</strong> Cohort Feb (hijau) retensi M1/M2 <strong>lebih baik</strong> dari Jan — produk/aktivasi membaik! Inilah kekuatan cohort: <em>tren kualitas</em>, bukan sekadar angka agregat. (Angka ilustrasi.)</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Funnel: Daftar → Repeat (data lab)"
  layout={{"xaxis": {"title": "Tahap"}, "yaxis": {"title": "Nasabah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = jumlah lolos tiap tahap; label = konversi dari tahap sebelumnya.</p>
<p><strong>Interpretasi:</strong> Drop-off terbesar: <strong>verifikasi → transaksi pertama</strong> (80% → 63%... tepatnya 5/8). Di sinilah intervensi (onboarding, promo) paling berdampak. Funnel mengubah &ldquo;konversi rendah&rdquo; menjadi <em>lokasi pasti</em> masalahnya.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Cohort = &ldquo;kelompokkan per awal, ukur per umur&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Retention matrix — baca tabelnya</summary>
              <p>Kohor Jan 2026: 1.000 nasabah. Aktif di Feb: 400; Mar: 250; Apr: 200. Kohor Feb: 1.200 nasabah; aktif Mar: 360. Hitung retention %.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Retention = aktif_bulan_N / ukuran_kohor
      -- Kohor Jan: M0=100%, M1=40%, M2=25%, M3=20%
      -- Kohor Feb: M0=100%, M1=30%  -&gt; Feb LEBIH BURUK dari Jan!</pre>
              <p><strong>Bedah:</strong> baca <em>diagonal</em>: M1 Jan (40%) vs M1 Feb (30%) = perbandingan apel-ke-apel (umur sama!). Jangan bandingkan M3 Jan (20%) vs M1 Feb (30%) — umur beda. Pola &ldquo;M1 turun tiap kohor&rdquo; = aktivasi memburuk — alarm lebih awal dari &ldquo;total transaksi stagnan&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Funnel — di mana bocornya?</summary>
              <p>10.000 daftar → 6.000 verifikasi → 3.000 aktif → 1.500 transaksi. Di tahap mana intervensi paling berdampak?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Konversi per tahap: 60%, 50%, 50%. Overall: 15%.
      -- Jika tahap 2 naik 50%-&gt;60%: +600 transaksi (+40%!).
      -- Jika tahap 1 naik 60%-&gt;70%: +500 transaksi.
      -- -&gt; tahap 2 (verifikasi-&gt;aktif) = leverage terbesar.</pre>
              <p><strong>Bedah:</strong> leverage = tahap dengan (volume besar × konversi rendah). Jangan asal perbaiki &ldquo;tahap pertama&rdquo; — hitung dampak marginal tiap tahap. Funnel mengubah &ldquo;konversi rendah&rdquo; (gejala) menjadi &ldquo;tahap X bocor sebesar Y&rdquo; (diagnosis).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Sessionization — dari event ke sesi</summary>
              <p>Log klik per menit. Kelompokkan jadi &ldquo;sesi&rdquo;: gap &gt; 30 menit = sesi baru. Berapa sesi per user?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH gaps AS (
        SELECT user_id, ts,
               CASE WHEN ts - LAG(ts) OVER (
                        PARTITION BY user_id ORDER BY ts)
                         &gt; INTERVAL &#x27;30 minutes&#x27;
                    THEN 1 ELSE 0 END AS sesi_baru
        FROM klik
      ),
      sesi AS (
        SELECT *, SUM(sesi_baru) OVER (
                 PARTITION BY user_id ORDER BY ts) AS sesi_id
        FROM gaps
      )
      SELECT user_id, sesi_id, COUNT(*) AS n_klik,
             MIN(ts) AS mulai, MAX(ts) AS selesai
      FROM sesi GROUP BY user_id, sesi_id;</pre>
              <p><strong>Bedah:</strong> pola gaps-and-islands: tandai awal pulau (gap &gt; 30 mnt) → running SUM memberi ID sesi. Dua window function berantai — inilah &ldquo;SQL level lanjut&rdquo; yang sesungguhnya: bukan sintaks sulit, melainkan komposisi pola sederhana.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Funnel Sederhana</h2>

      <p>Hitung funnel: total nasabah → punya ≥1 transaksi → punya ≥3 transaksi. Tampilkan n &amp; % konversi tiap tahap.</p>

      <PyodideLab
  title="Lab 1 — Konversi Nasabah → Transaksi"
  hint="Tahap mana drop-off terbesar? Apa hipotesis penyebabnya?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH f AS (
  SELECT n.id,
    CASE WHEN EXISTS (SELECT 1 FROM transaksi t WHERE t.nasabah_id = n.id) THEN 1 ELSE 0 END AS t1,
    CASE WHEN (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) &gt;= 3 THEN 1 ELSE 0 END AS t3
  FROM nasabah n
)
SELECT COUNT(*) AS daftar, SUM(t1) AS trx1, SUM(t3) AS trx3,
       SUM(t1) * 1.0 / COUNT(*) AS conv_ke_trx
FROM f;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Gaps &amp; Islands</h2>

      <p>Temukan &ldquo;island&rdquo; tanggal transaksi berurutan (streak hari aktif) dengan trik tanggal − row_number.</p>

      <PyodideLab
  title="Lab 2 — Rentang Tanggal Berurutan"
  hint="Streak terpanjang berapa hari? Di mana gap-nya?"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH r AS (
  SELECT tanggal,
    date(tanggal, &#x27;-&#x27; || ROW_NUMBER() OVER (ORDER BY tanggal) || &#x27; days&#x27;) AS grp
  FROM (SELECT DISTINCT tanggal FROM transaksi)
)
SELECT MIN(tanggal) AS mulai, MAX(tanggal) AS selesai, COUNT(*) AS hari
FROM r GROUP BY grp;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Analisis Perilaku</h2>

      <div className="decision-card">
<h3>1. &ldquo;Apakah produk makin baik?&rdquo; → <strong>cohort retention</strong></h3>
<p><strong>Kondisi data:</strong> Kualitas per angkatan.</p>
<p><strong>Kenapa:</strong> Bebas dari distorsi komposisi; diagonal = tren waktu.</p>
<p><strong>Contoh nyata:</strong> Retensi M1 per cohort bulanan.</p>
</div>

      <div className="decision-card">
<h3>2. &ldquo;Di mana bocornya?&rdquo; → <strong>funnel</strong></h3>
<p><strong>Kondisi data:</strong> Konversi bertahap.</p>
<p><strong>Kenapa:</strong> Drop-off terbesar = prioritas.</p>
<p><strong>Contoh nyata:</strong> Daftar → verifikasi → trx.</p>
</div>

      <div className="decision-card">
<h3>3. &ldquo;Kelompokkan event berdekatan&rdquo; → <strong>sessionization</strong></h3>
<p><strong>Kondisi data:</strong> Sesi.</p>
<p><strong>Kenapa:</strong> LAG + ambang jeda + running SUM.</p>
<p><strong>Contoh nyata:</strong> Sesi transaksi 30 menit.</p>
</div>

      <div className="decision-card">
<h3>4. &ldquo;Streak/gap berurutan&rdquo; → <strong>gaps-and-islands</strong></h3>
<p><strong>Kondisi data:</strong> Rentang.</p>
<p><strong>Kenapa:</strong> Trik tanggal − row_number.</p>
<p><strong>Contoh nyata:</strong> Streak hari aktif, DPD beruntun.</p>
</div>

      <div className="decision-card">
<h3>5. Kombinasi → <strong>cohort × funnel</strong></h3>
<p><strong>Kondisi data:</strong> Dua dimensi.</p>
<p><strong>Kenapa:</strong> Apakah funnel membaik per cohort?</p>
<p><strong>Contoh nyata:</strong> Konversi per bulan akuisisi.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Cohort = kelompok berdasar <em>waktu akuisisi</em>, bukan waktu kalender.</li><li>Funnel: ukur tiap tahap + konversi antar tahap.</li><li>Gaps-and-islands: tanggal − row_number = konstan.</li><li>Selalu gabung cohort × funnel untuk cerita lengkap.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Misteri Akuisisi Naik, Transaksi Stagnan (60+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Akuisisi +30% (dari kampanye), tapi total transaksi stagnan. CMO curiga &ldquo;nasabah baru tidak aktif&rdquo;.</p><p><strong>Tugas (kerjakan!):</strong> (1) Buat cohort berdasar bulan transaksi pertama. (2) Hitung % yang transaksi lagi di bulan berikutnya (retensi M1). (3) Buat funnel daftar → trx pertama. (4) Tulis <strong>rekomendasi 3 kalimat</strong> untuk CMO: lanjutkan kampanye atau perbaiki aktivasi?</p><p><strong>Data:</strong> tabel nasabah + transaksi lab (asumsikan tanggal daftar = transaksi pertama).</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Temuan (data lab):</strong> hanya 8 dari 10 nasabah pernah transaksi (funnel daftar→trx = 80%); dari yang transaksi, pola berulang rendah. Dengan data 1 bulan, cohort M1 tak terhitung — <strong>dan itu pelajarannya</strong>: analisis cohort butuh <em>rentang waktu</em> cukup!</p><p><strong>Rekomendasi contoh:</strong> &ldquo;Kampanye berhasil di akuisisi (+30%) tapi funnel daftar→trx pertama hanya 80% dan repeat rendah. Alihkan 50% budget kampanye ke program aktivasi 7-hari pertama — akuisisi tanpa aktivasi = ember bocor.&rdquo;</p><p><strong>Pelajaran:</strong> analisis perilaku mengubah debat opini (&ldquo;marketing gagal!&rdquo;) menjadi diagnosis presisi (&ldquo;bocor di aktivasi&rdquo;). Inilah nilai analyst.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Kohor Mar: 800 nasabah, M1 = 320, M2 = 160. Kohor Apr: 900 nasabah, M1 = 270. Kohor mana yang retensinya lebih baik di M1? Apa artinya?</li>
              <li>Funnel: 5.000 → 4.000 → 1.000 → 800. Tahap mana yang paling bocor (konversi terendah)?</li>
              <li>Pada sessionization di atas, apa yang terjadi jika <code className="inline">LAG(ts)</code> NULL (klik pertama user)? Mengapa query tetap benar?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Mar M1 = 40%; Apr M1 = 30%. <strong>Mar lebih baik</strong> — retensi memburuk di Apr (investigasi: apa yang berubah di proses aktivasi April?).</p>
              <p><strong>2.</strong> 80%, 25%, 80% — tahap 2→3 (<strong>25%</strong>) paling bocor. Fokus intervensi ke sana.</p>
              <p><strong>3.</strong> <code className="inline">ts - NULL = NULL</code>; <code className="inline">NULL &gt; interval = UNKNOWN</code> → CASE ke ELSE = 0 → <strong>bukan</strong> sesi baru. Benar! Klik pertama = lanjutan &ldquo;sesi 0&rdquo; (SUM mulai dari 0). Logika NULL (C2!) bekerja sesuai harapan di sini — tapi verifikasi selalu.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Cohort retention:</strong> % aktif per periode sejak akuisisi — lensa kualitas yang jujur.</li><li><strong>Funnel:</strong> konversi bertahap — temukan di mana bocornya.</li><li><strong>Sessionization:</strong> LAG + ambang jeda + running SUM.</li><li><strong>Gaps-and-islands:</strong> tanggal − row_number = konstan.</li><li><strong>Kombinasi</strong> cohort × funnel = diagnosis perilaku lengkap.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c10-dedupe-pivot-yoy" className="btn btn-secondary btn-sm">← ← C10</Link>
        <Link href="/learn/c12-recursive-cte" className="btn btn-primary btn-sm">Next: C12 →</Link>
      </div>
    </div>
  );
}

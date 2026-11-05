import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C14FraudVelocityPage() {
  const chart1 = [{"x": ["00", "03", "06", "09", "12", "15", "18", "21"], "y": [2, 8, 1, 1, 2, 3, 2, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["2", "8!", "1", "1", "2", "3", "2", "1"], "textposition": "outside"}];
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
# WITH v AS (SELECT nasabah_id, date(tanggal) AS tgl, COUNT(*) AS n, SUM(jumlah) AS amt FROM transaksi GROUP BY 1,2) SELECT *, CASE WHEN n>=3 OR amt>=2000000 THEN 'waspada' ELSE 'normal' END AS alert FROM v
q("""SELECT nasabah_id, date(tanggal) AS tgl, COUNT(*) AS n FROM transaksi GROUP BY 1, 2""")`;
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
# SELECT t.nasabah_id, t.tanggal, n.kota, LAG(n.kota) OVER (PARTITION BY t.nasabah_id ORDER BY t.tanggal) AS kota_lalu FROM transaksi t JOIN nasabah n ON n.id=t.nasabah_id
q("""SELECT nasabah_id, tanggal FROM transaksi ORDER BY nasabah_id, tanggal""")`;
  const quizData = [{"question": "Velocity check memakai…", "options": ["GROUP BY biasa", "Self-join jendela waktu + ambang", "UNION", "LAG saja"], "correct": 1, "explanation": "Benar: tiap transaksi vs &ldquo;saudara&rdquo;-nya dalam jendela."}, {"question": "Ambang velocity sebaiknya dari…", "options": ["Tebakan", "Percentile distribusi historis (mis. p99)", "Angka bulat", "Copy bank lain"], "correct": 1, "explanation": "Benar: berbasis data — ambang arbitrer = false positive membabi buta."}, {"question": "Impossible travel memakai…", "options": ["COUNT", "LAG untuk pasangan berurutan + aturan jarak/waktu", "AVG", "UNION"], "correct": 1, "explanation": "Benar: bandingkan lokasi & waktu transaksi berurutan."}, {"question": "Impossible travel terdeteksi = …", "options": ["Pasti fraud, langsung blokir permanen", "Screening — verifikasi dulu sebelum tindakan", "Abaikan", "Hapus transaksi"], "correct": 1, "explanation": "Benar: VPN, dinas, merchant aneh = penjelasan sah. Verifikasi dulu."}, {"question": "False positive 0,1% pada 1 juta nasabah…", "options": ["Tidak masalah", "= 1.000 nasabah sah terganggu — bencana operasional", "Bagus", "Tidak mungkin"], "correct": 1, "explanation": "Benar: skala mengubah segalanya. Tuning ambang = pekerjaan terpenting."}, {"question": "Rule fraud yang baik diukur dengan…", "options": ["Jumlah rule", "Precision & recall", "Panjang query", "Kecepatan"], "correct": 1, "explanation": "Benar: seperti model ML — tanpa metrik tak bisa diperbaiki."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C14 — SQL Fraud</span>
        <h1 className="display-title">Velocity &amp; Impossible Travel:<br/>Menangkap Fraud dengan SQL</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp 47 Juta dalam 11 Menit</a></li>
          <li><a href="#velocity">Velocity Checks — Kecepatan Transaksi</a></li>
          <li><a href="#travel">Impossible Travel — Fisika Sederhana</a></li>
          <li><a href="#rule">Rule-Based Alert — CASE + Ambang</a></li>
          <li><a href="#lab1">🔬 Lab 1: Velocity Harian</a></li>
          <li><a href="#lab2">🔬 Lab 2: Deteksi Kota Berbeda Cepat</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Deteksi Fraud</a></li>
          <li><a href="#case">📋 Mini-Case: Rp 47 Juta dalam 11 Menit (60+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menghitung <strong>velocity checks</strong> (count/amount per jendela waktu).</li><li>Mendeteksi <strong>impossible travel</strong> (jarak vs waktu).</li><li>Menulis <strong>rule-based alert</strong> dengan CASE + ambang.</li><li>Menjelaskan <strong>trade-off false positive</strong> dalam rule fraud.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Rp 47 Juta dalam 11 Menit</h2>

      <div className="story"><p>Senin pagi, tim fraud melihat alert: satu kartu melakukan <strong>14 transaksi dalam 11 menit</strong> di 3 kota berbeda — total Rp 47 juta. Pemilik kartu sedang tidur di Jakarta. Kartu dikloning.</p><p>Velocity check (banyak transaksi dalam waktu singkat) + impossible travel (3 kota dalam 11 menit) = dua pola yang menangkapnya — <strong>keduanya murni SQL</strong>. Lesson case-heavy ini mengajarkan pola deteksi fraud paling fundamental, jembatan ke track Fraud/AML.</p><p><strong>Twist-nya:</strong> 14 transaksi dalam 11 menit di 3 kota — manusia tidak mungkin melakukannya, tapi sistem tidak &ldquo;tahu&rdquo; itu mustahil kecuali kamu mengajarkannya. Fraud detection jarang tentang pola jahat yang canggih; ia tentang <em>menuliskan akal sehat sebagai query</em>: manusia tidak bisa di 3 kota sekaligus, kartu tidak bisa dipakai saat pemiliknya tidur. Penjahat dikalahkan bukan oleh AI mahal — melainkan oleh logika yang ditulis eksplisit.</p></div>

      <h2 id="velocity">Velocity Checks — Kecepatan Transaksi</h2>

      <p><strong>Definisi.</strong> <strong>Velocity</strong> = jumlah/nilai transaksi dalam <strong>jendela waktu</strong> (10 menit, 1 jam, 24 jam). Fraud = velocity abnormal.</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- transaksi per 1 jam terakhir per kartu (self-join jendela)
SELECT t1.id, t1.nasabah_id, t1.tanggal,
  COUNT(t2.id) AS n_1jam,
  SUM(t2.jumlah) AS amt_1jam
FROM transaksi t1
JOIN transaksi t2
  ON t2.nasabah_id = t1.nasabah_id
 AND t2.tanggal BETWEEN datetime(t1.tanggal, &#x27;-1 hour&#x27;) AND t1.tanggal
GROUP BY t1.id
HAVING COUNT(t2.id) &gt;= 3;  -- ambang: &gt;=3 trx/jam</pre>

      <ul>
<li><strong>Self-join jendela:</strong> tiap transaksi dibandingkan dengan &ldquo;saudara&rdquo;-nya dalam 1 jam.</li>
<li><strong>Ambang (threshold):</strong> rule-nya — ditentukan dari data historis (percentile!) bukan tebakan.</li>
<li><strong>Varian:</strong> velocity amount (total Rp), velocity count, velocity channel-berbeda.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tentukan ambang dari data: <code className="inline">PERCENTILE_CONT(0.99)</code> dari distribusi velocity normal — &ldquo;1% teratas&rdquo;. Ambang arbitrer (&ldquo;3 transaksi&rdquo;) tanpa data = false positive membabi buta.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak rule = makin aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Setiap rule menambah <strong>false positive</strong> — nasabah sah diblokir = komplain + churn. Fraud detection = <strong>trade-off presisi vs cakupan</strong>. Rule bagus = menangkap banyak fraud dengan sedikit gangguan. Ukur keduanya!</p>
</div>

      <h2 id="travel">Impossible Travel — Fisika Sederhana</h2>

      <p>Transaksi di Jakarta jam 10:00, lalu di Surabaya jam 10:30 — <strong>mustahil</strong> ditempuh (700 km dalam 30 menit). Pola:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- butuh kolom kota/lokasi; bandingkan transaksi berurutan
WITH s AS (
  SELECT nasabah_id, tanggal, kota,
    LAG(kota) OVER (PARTITION BY nasabah_id ORDER BY tanggal) AS kota_lalu,
    LAG(tanggal) OVER (PARTITION BY nasabah_id ORDER BY tanggal) AS waktu_lalu
  FROM transaksi)
SELECT *,
  (julianday(tanggal) - julianday(waktu_lalu)) * 24 AS jeda_jam
FROM s
WHERE kota_lalu IS NOT NULL AND kota &lt;&gt; kota_lalu
  AND (julianday(tanggal) - julianday(waktu_lalu)) * 24 &lt; 2;  -- beda kota &lt; 2 jam</pre>

      <ul>
<li><strong>LAG</strong> (C9!) untuk pasangan berurutan per nasabah.</li>
<li><strong>Aturan:</strong> kota beda + jeda &lt; ambang (2 jam) = mustahil.</li>
<li><strong>Pengembangan:</strong> jarak_km / jeda_jam = kecepatan implisit; &gt; 800 km/jam = flag.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Impossible travel = pasti fraud.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak — VPN, perjalanan dinas (pesawat!), transaksi online dengan lokasi merchant aneh. Rule ini = <strong>screening</strong>, bukan vonis. Selalu ada langkah verifikasi (hubungi nasabah) sebelum blokir.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Gabungkan sinyal: velocity TINGGI + impossible travel + nominal BULAT (5.000.000) + jam ANEH (03:00) = skor komposit. Satu sinyal lemah; empat sinyal = kuat. Inilah cikal-bakal <strong>feature engineering</strong> (D10)!</p>
</div>

      <h2 id="rule">Rule-Based Alert — CASE + Ambang</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH v AS (
  -- velocity per nasabah per hari
  SELECT nasabah_id, date(tanggal) AS tgl,
         COUNT(*) AS n, SUM(jumlah) AS amt
  FROM transaksi GROUP BY 1, 2
)
SELECT nasabah_id, tgl, n, amt,
  CASE
    WHEN n &gt;= 5 AND amt &gt;= 10000000 THEN &#x27;kritis&#x27;
    WHEN n &gt;= 3 OR amt &gt;= 5000000 THEN &#x27;waspada&#x27;
    ELSE &#x27;normal&#x27;
  END AS alert
FROM v
WHERE n &gt;= 3 OR amt &gt;= 5000000;</pre>

      <ul>
<li><strong>Struktur alert:</strong> agregat jendela → CASE skor → saring yang relevan.</li>
<li><strong>Level:</strong> kritis (auto-block?), waspada (review manual), normal (abaikan).</li>
<li><strong>Operasional:</strong> alert harus <strong>actionable</strong> — tiap alert = ada tindakan jelas. Alert tanpa tindakan = noise.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Ukur rule seperti model ML: <strong>precision</strong> (% alert yang benar fraud) & <strong>recall</strong> (% fraud tertangkap). Rule tanpa metrik = tak bisa diperbaiki. Simpan histori alert + label untuk tuning (D12!).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Transaksi per Jam: Anomali Jam 03:00 (ilustrasi)"
  layout={{"xaxis": {"title": "Jam"}, "yaxis": {"title": "Jumlah transaksi"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi = jumlah transaksi per jam dalam sehari.</p>
<p><strong>Interpretasi:</strong> Jam 03:00 melonjak 8× — <strong>velocity temporal</strong>. Pola klasik: fraud dieksekusi saat korban tidur &amp; tim fraud tipis. Aturan &ldquo;jam aneh + velocity tinggi&rdquo; menangkap ini.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Fraud = &ldquo;perilaku yang melanggar fisika/akal sehat&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Velocity — 14 transaksi 11 menit</summary>
              <p>Kartu X: 14 transaksi dalam 11 menit, total Rp47 juta. Rata-rata historis kartu ini: 3 transaksi/hari. Tulis velocity check-nya.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH v AS (
        SELECT kartu_id,
               COUNT(*) AS n_10mnt,
               SUM(nominal) AS total_10mnt
        FROM transaksi
        WHERE ts &gt;= NOW() - INTERVAL &#x27;10 minutes&#x27;
        GROUP BY kartu_id
      )
      SELECT * FROM v
      WHERE n_10mnt &gt;= 5 OR total_10mnt &gt; 20000000;  -- ambang awal</pre>
              <p><strong>Bedah:</strong> 14 transaksi/11 mnt vs rata-rata 3/hari = ~250× perilaku normal. Ambang (5 transaksi / Rp20jt per 10 mnt) = awal — di-tuning dari distribusi historis (persentil 99,9%), bukan angka karangan. Velocity = z-score perilaku (B11!) dalam bahasa SQL.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Impossible travel — Jakarta → Surabaya 11 menit</summary>
              <p>Transaksi 1: Jakarta 10:00. Transaksi 2: Surabaya (±700 km) 10:11. Mustahil fisik — kecuali?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH t AS (
        SELECT kartu_id, ts, kota,
               LAG(ts)   OVER (PARTITION BY kartu_id ORDER BY ts) AS ts_prev,
               LAG(kota) OVER (PARTITION BY kartu_id ORDER BY ts) AS kota_prev
        FROM transaksi
      )
      SELECT * FROM t
      WHERE kota &lt;&gt; kota_prev
        AND EXTRACT(EPOCH FROM (ts - ts_prev))/60 &lt; 120;  -- beda kota &lt; 2 jam</pre>
              <p><strong>Bedah:</strong> LAG (C9!) memberi &ldquo;transaksi sebelumnya&rdquo;; selisih waktu &lt; 120 menit + kota beda = mustahil. <strong>Pengecualian jujur:</strong> transaksi online (kota = kota merchant, bukan lokasi kartu!) — filter <code className="inline">channel = &#x27;offline&#x27;</code> dulu, atau false positive membanjiri tim.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Rule tuning — presisi vs recall</summary>
              <p>Rule &ldquo;≥5 transaksi/10 mnt&rdquo;: menangkap 90% fraud (recall), tapi 98% alert adalah false positive (presisi 2%). Tim 5 orang, tiap alert 15 menit investigasi. Layak?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1000 alert/hari * 98% FP = 980 FP/hari * 15 mnt = 245 jam/hari
      -- Kapasitas tim: 5 * 8 = 40 jam/hari -&gt; BUTUH 6x lipat tim!
      -- Solusi: naikkan ambang -&gt; presisi naik, recall turun. Atau: skor
      -- gabungan (velocity + travel + nominal) -&gt; prioritaskan.</pre>
              <p><strong>Bedah:</strong> rule yang &ldquo;menangkap banyak fraud&rdquo; bisa tidak <em>operasional</em> — alert yang tidak diinvestigasi = tidak ada. Desain rule = optimasi presisi×recall <em>dalam batas kapasitas tim</em>. Inilah mengapa fraud memakai <em>skor</em>, bukan sekadar ya/tidak.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Velocity Harian</h2>

      <p>Hitung per nasabah per hari: jumlah transaksi + total amount. Tandai 'waspada' jika ≥3 transaksi atau ≥ Rp 2 juta.</p>

      <PyodideLab
  title="Lab 1 — Siapa Tercepat?"
  hint="Nasabah mana yang 'waspada'? Apakah benar mencurigakan, atau normal? (Pikirkan false positive!)"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH v AS (
  SELECT nasabah_id, date(tanggal) AS tgl,
         COUNT(*) AS n, SUM(jumlah) AS amt
  FROM transaksi GROUP BY 1, 2
)
SELECT *, CASE WHEN n &gt;= 3 OR amt &gt;= 2000000 THEN &#x27;waspada&#x27; ELSE &#x27;normal&#x27; END AS alert
FROM v;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Deteksi Kota Berbeda Cepat</h2>

      <p>Tabel transaksi tidak punya kota per transaksi — simulasikan: gabung dengan kota nasabah, lalu cari nasabah dengan transaksi di <strong>hari yang sama</strong> tapi kota nasabah... (pikirkan keterbatasannya!)</p>

      <PyodideLab
  title="Lab 2 — LAG untuk Impossible Travel (Mini)"
  hint="Kenapa simulasi ini lemah? Data apa yang dibutuhkan untuk impossible travel BENAR? (lokasi merchant + timestamp presisi!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- konsep (data lab terbatas: kota = kota nasabah, bukan lokasi trx):
WITH s AS (
  SELECT t.nasabah_id, t.tanggal, n.kota,
    LAG(t.tanggal) OVER (PARTITION BY t.nasabah_id ORDER BY t.tanggal) AS lalu
  FROM transaksi t JOIN nasabah n ON n.id = t.nasabah_id
)
SELECT * FROM s
WHERE (julianday(tanggal) - julianday(lalu)) * 24 &lt; 1;
-- produksi: butuh koordinat merchant + timestamp detik!</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Deteksi Fraud</h2>

      <div className="decision-card">
<h3>1. Banyak trx waktu singkat → <strong>velocity check</strong></h3>
<p><strong>Kondisi data:</strong> Kecepatan.</p>
<p><strong>Kenapa:</strong> Self-join jendela + ambang dari percentile data.</p>
<p><strong>Contoh nyata:</strong> ≥5 trx/jam.</p>
</div>

      <div className="decision-card">
<h3>2. Lokasi mustahil → <strong>impossible travel</strong></h3>
<p><strong>Kondisi data:</strong> Fisika.</p>
<p><strong>Kenapa:</strong> LAG pasangan berurutan; jarak/waktu &gt; mungkin.</p>
<p><strong>Contoh nyata:</strong> Jakarta→Surabaya 30 menit.</p>
</div>

      <div className="decision-card">
<h3>3. Gabung sinyal → <strong>rule komposit (CASE)</strong></h3>
<p><strong>Kondisi data:</strong> Skor.</p>
<p><strong>Kenapa:</strong> Satu sinyal lemah; banyak sinyal kuat.</p>
<p><strong>Contoh nyata:</strong> Velocity + jam aneh + nominal bulat.</p>
</div>

      <div className="decision-card">
<h3>4. Jaringan → <strong>recursive CTE</strong> (C12)</h3>
<p><strong>Kondisi data:</strong> Graf.</p>
<p><strong>Kenapa:</strong> Rantai/fan-in/fan-out mule.</p>
<p><strong>Contoh nyata:</strong> Jangkauan dari rekening A.</p>
</div>

      <div className="decision-card">
<h3>5. Tuning → <strong>ukur precision/recall</strong></h3>
<p><strong>Kondisi data:</strong> Trade-off.</p>
<p><strong>Kenapa:</strong> Rule tanpa metrik tak bisa diperbaiki.</p>
<p><strong>Contoh nyata:</strong> % alert benar fraud.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Ambang dari <strong>data</strong> (percentile), bukan tebakan.</li><li>Rule = <strong>screening</strong>, bukan vonis — verifikasi sebelum blokir.</li><li>Ukur <strong>false positive</strong> — nasabah sah diblokir = churn.</li><li>Alert harus <strong>actionable</strong> — tanpa tindakan = noise.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Rp 47 Juta dalam 11 Menit (60+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Alert: kartu X — 14 transaksi, 11 menit, 3 kota, Rp 47 juta. Pemilik tidur di Jakarta.</p><p><strong>Tugas:</strong> (1) Tulis query velocity yang <em>akan</em> menangkap ini (jendela 15 menit, ambang?). (2) Tulis query impossible travel-nya. (3) Rancang <strong>aturan komposit</strong> (skor 0–10) + <strong>tindakan</strong> per level. (4) Estimasi: jika ambang terlalu rendah, apa yang terjadi pada 1 juta nasabah?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> Self-join jendela 15 menit, <code className="inline">HAVING COUNT(*) &gt;= 5</code> (ambang dari p99 historis). <strong>(2)</strong> LAG kota + jeda &lt; 2 jam antar kota beda. <strong>(3)</strong> Skor: velocity≥5 (+4), kota beda &lt;2jam (+3), nominal bulat &gt;1jt (+2), jam 00–05 (+1). ≥7 = auto-block + SMS; 4–6 = review 15 menit; &lt;4 = log.</p><p><strong>(4)</strong> False positive 0,1% × 1 juta = <strong>1.000 nasabah sah diblokir/hari</strong> = bencana call center! Inilah mengapa tuning ambang = pekerjaan terpenting, bukan menambah rule.</p><p><strong>Pelajaran:</strong> fraud detection = <strong>statistik + operasional</strong>. Query menangkap pola; ambang menentukan bisnis. Dan pola ini menjadi <strong>fitur</strong> untuk model ML (D10/D12) — rule-based hari ini, machine learning besok.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Modifikasi velocity check: jendela 1 jam, ambang &ldquo;10× rata-rata harian kartu&rdquo;. Tulis kerangka query-nya.</li>
              <li>Sebutkan 2 sumber false positive untuk impossible travel selain transaksi online.</li>
              <li>Jika menaikkan ambang velocity dari 5→10 transaksi/10mnt, apa yang terjadi pada presisi &amp; recall? (Arah saja.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1. Kerangka: bandingkan vs baseline per kartu
      WITH base AS (
        SELECT kartu_id, COUNT(*)/30.0 AS avg_harian  -- 30 hari terakhir
        FROM transaksi WHERE ts &gt;= NOW() - INTERVAL &#x27;30 days&#x27;
        GROUP BY kartu_id
      ),
      v AS (
        SELECT kartu_id, COUNT(*) AS n_1jam FROM transaksi
        WHERE ts &gt;= NOW() - INTERVAL &#x27;1 hour&#x27; GROUP BY kartu_id
      )
      SELECT v.kartu_id FROM v JOIN base USING (kartu_id)
      WHERE v.n_1jam &gt; 10 * base.avg_harian;</pre>
              <p><strong>2.</strong> (a) Kartu tambahan/keluarga: dipakai 2 orang di 2 kota — sah tapi terlihat mustahil. (b) Data kota kotor (merchant terdaftar di kota pusat padahal transaksi di cabang). Keduanya = butuh whitelist/pembersihan, bukan ambang lebih ketat.</p>
              <p><strong>3.</strong> Ambang naik → <strong>presisi naik</strong> (yang lolos makin &ldquo;yakin&rdquo; fraud), <strong>recall turun</strong> (fraud kecil lolos). Tradeoff abadi — tidak ada ambang yang memaksimalkan keduanya.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Velocity:</strong> count/amount per jendela — self-join + ambang dari data.</li><li><strong>Impossible travel:</strong> LAG pasangan + aturan jarak/waktu.</li><li><strong>Rule komposit:</strong> gabung sinyal lemah jadi skor kuat (cikal feature engineering).</li><li><strong>Trade-off:</strong> rule = screening; ukur false positive; alert harus actionable.</li><li>Rule-based hari ini → fitur ML (D10/D12) besok.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c13-risiko-dpd-rollrate" className="btn btn-secondary btn-sm">← ← C13</Link>
        <Link href="/learn/c15-data-quality" className="btn btn-primary btn-sm">Next: C15 →</Link>
      </div>
    </div>
  );
}

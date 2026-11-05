import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C6SubqueryPage() {
  const chart1 = [{"x": ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gilang", "Hesti", "Irfan", "Joko"], "y": [1950000, 3400000, 575000, 300000, 150000, 80000, 950000, 600000, 200000, 350000], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["1,95jt", "3,4jt", "0,58jt", "0,3jt", "0,15jt", "0,08jt", "0,95jt", "0,6jt", "0,2jt", "0,35jt"], "textposition": "outside"}];
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
# SELECT nama, penghasilan FROM nasabah WHERE penghasilan > (SELECT AVG(penghasilan) FROM nasabah)
q("""SELECT AVG(penghasilan) FROM nasabah""")`;
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
# SELECT n.nama, COALESCE(t.total,0) FROM nasabah n LEFT JOIN (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id) t ON t.nasabah_id=n.id
q("""SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id""")`;
  const quizData = [{"question": "Subquery skalar mengembalikan 5 baris. Akibatnya…", "options": ["Dipakai baris pertama", "Error", "Dikalikan 5", "NULL"], "correct": 1, "explanation": "Benar: skalar harus tepat 1 baris 1 kolom."}, {"question": "NOT IN vs NOT EXISTS saat subquery mengandung NULL…", "options": ["Sama", "NOT IN kosong diam-diam; NOT EXISTS aman", "NOT EXISTS error", "Keduanya kosong"], "correct": 1, "explanation": "Benar: NOT EXISTS default aman untuk anti-join."}, {"question": "Derived table wajib…", "options": ["ORDER BY", "Alias", "LIMIT", "DISTINCT"], "correct": 1, "explanation": "Benar: subquery di FROM harus punya nama alias."}, {"question": "Obat fan-out (agregat setelah JOIN 1-ke-banyak)…", "options": ["DISTINCT", "Agregasi dulu di derived table, baru JOIN", "GROUP BY lebih banyak", "UNION"], "correct": 1, "explanation": "Benar: perbaiki granularitas sebelum join."}, {"question": "Correlated subquery di SELECT untuk 10 juta baris…", "options": ["Ideal", "Berisiko lambat (sekali per baris) — tulis ulang JOIN+GROUP BY", "Error", "Selalu dioptimasi sempurna"], "correct": 1, "explanation": "Benar: N+1 problem. Kecuali pola EXISTS/top-N yang idiomatis."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C6 — SQL</span>
        <h1 className="display-title">Subquery: Query di Dalam<br/>Query</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Nasabah di Atas Rata-rata&rdquo;</a></li>
          <li><a href="#skalar">Subquery Skalar &amp; IN — di WHERE</a></li>
          <li><a href="#derived">Derived Table — Subquery di FROM</a></li>
          <li><a href="#correlated">Correlated Subquery — Query yang &ldquo;Melihat Keluar&rdquo;</a></li>
          <li><a href="#lab1">🔬 Lab 1: Di Atas Rata-rata</a></li>
          <li><a href="#lab2">🔬 Lab 2: Agregat Dulu, Join Kemudian</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Subquery</a></li>
          <li><a href="#case">📋 Mini-Case: Nasabah Aktif Tapi Tak Punya Kredit</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menulis subquery di <strong>WHERE</strong> (IN, EXISTS, perbandingan skalar).</li><li>Memakai subquery di <strong>FROM</strong> (derived table) untuk agregasi-then-join.</li><li>Membedakan <strong>EXISTS vs IN</strong> (dan jebakan NULL di NOT IN).</li><li>Menjelaskan <strong>correlated subquery</strong> dan kapan menghindarinya.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Nasabah di Atas Rata-rata&rdquo;</h2>

      <div className="story"><p>Manajer: <em>&ldquo;Siapa nasabah dengan penghasilan di atas rata-rata?&rdquo;</em> Kamu butuh dua langkah: (1) hitung rata-rata, (2) bandingkan tiap nasabah. Tanpa subquery: jalankan query 1, catat angkanya, tulis query 2 manual — tidak reusable, tidak otomatis.</p><p>Subquery menggabungkan keduanya dalam <strong>satu query</strong>: <em>&ldquo;rata-rata&rdquo; dihitung fresh setiap query dijalankan</em>. Ini fondasi pola &ldquo;agregasi dulu, baru join&rdquo; (obat fan-out C5!) dan &ldquo;filter berdasar hasil query lain&rdquo;.</p><p><strong>Twist-nya:</strong> subquery terlihat seperti &ldquo;query di dalam query&rdquo; yang bikin lambat — tapi justru pola inilah yang <em>menyelamatkan</em> dari fan-out C5: agregasi dulu (di subquery), baru join. Senjata yang sama bisa jadi sumber kebingungan atau obatnya — tergantung ditaruh di mana. Lesson ini mengubah subquery dari &ldquo;sintaks menakutkan&rdquo; menjadi &ldquo;pola penyelamat&rdquo;.</p></div>

      <h2 id="skalar">Subquery Skalar &amp; IN — di WHERE</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- skalar: satu nilai
SELECT nama, penghasilan
FROM nasabah
WHERE penghasilan &gt; (SELECT AVG(penghasilan) FROM nasabah);

-- IN: daftar nilai dari query lain
SELECT nama FROM nasabah
WHERE id IN (SELECT nasabah_id FROM kredit WHERE kolektibilitas &gt;= 3);</pre>

      <ul>
<li><strong>Skalar</strong> (satu baris, satu kolom): bisa dibandingkan dengan =, &gt;, &lt;.</li>
<li><strong>IN</strong>: keanggotaan dalam himpunan hasil subquery.</li>
<li><strong>Aturan:</strong> subquery skalar harus mengembalikan tepat 1 baris — jika lebih, error!</li>
</ul>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: nasabah yang <em>tidak punya</em> kredit macet.</p><p><strong>Langkah 1</strong> — siapa yang macet: <code className="inline">SELECT nasabah_id FROM kredit WHERE kolektibilitas = 5</code>.</p><p><strong>Langkah 2</strong> — negasikan: <code className="inline">SELECT nama FROM nasabah WHERE id NOT IN ( ... )</code>.</p><p><strong>Langkah 3</strong> — cek NULL di daftar! (lihat jebakan di bawah).</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;NOT IN selalu benar untuk &ldquo;tidak ada&rdquo;.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Jika subquery mengandung NULL, <code className="inline">NOT IN</code> mengembalikan <strong>kosong</strong> — diam-diam! (C2). Untuk &ldquo;tidak ada&rdquo;, <strong>NOT EXISTS</strong> selalu aman karena tidak terpengaruh NULL. Jadikan NOT EXISTS default untuk anti-join.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> IN vs EXISTS untuk &ldquo;ada&rdquo;: hasil sama jika tak ada NULL; EXISTS berhenti di kecocokan pertama (sering lebih cepat) dan aman dari NULL. <code className="inline">WHERE EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id)</code>.</p>
</div>

      <h2 id="derived">Derived Table — Subquery di FROM</h2>

      <p>Obat fan-out (C5): agregasi <em>dulu</em> per nasabah, <em>baru</em> join:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT n.nama, t.total_trx, t.n_trx
FROM nasabah n
JOIN (
  SELECT nasabah_id,
         SUM(jumlah) AS total_trx,
         COUNT(*) AS n_trx
  FROM transaksi
  GROUP BY nasabah_id
) t ON t.nasabah_id = n.id;</pre>

      <ul>
<li>Subquery di FROM <strong>wajib punya alias</strong> (<code className="inline">t</code>).</li>
<li>Granularitas <code className="inline">t</code> = 1 baris per nasabah → JOIN aman, tidak fan-out.</li>
<li>Pola ini = &ldquo;agregasi dulu, join kemudian&rdquo; — hafalkan!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Kapan derived table? Setiap kali kamu tergoda agregat <em>setelah</em> JOIN 1-ke-banyak. Tulis agregatnya sebagai subquery di FROM dulu — query jadi lebih panjang tapi <strong>benar</strong>. Benar &gt; pendek.</p>
</div>

      <h2 id="correlated">Correlated Subquery — Query yang &ldquo;Melihat Keluar&rdquo;</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- untuk TIAP nasabah, hitung transaksinya: subquery merujuk n.id dari luar!
SELECT n.nama,
  (SELECT COUNT(*) FROM transaksi t WHERE t.nasabah_id = n.id) AS n_trx
FROM nasabah n;</pre>

      <p>Subquery <strong>berkorelasi</strong>: dieksekusi sekali <em>per baris luar</em> (10 nasabah = 10 eksekusi). Untuk data kecil OK; untuk jutaan baris = <strong>lambat</strong> (N+1 problem-nya SQL).</p>

      <p><strong>Solusi:</strong> tulis ulang sebagai JOIN + GROUP BY (derived table di atas) — satu scan, bukan N scan.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Correlated subquery selalu buruk.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak — untuk <em>top-N per grup</em> atau <em>exists-check</em>, correlated subquery/EXISTS justru idiomatis dan sering dioptimasi baik oleh planner. Buruk hanya jika dipakai sebagai pengganti agregasi massal. Ukur dengan EXPLAIN (C17), jangan menghakimi buta.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Total Transaksi per Nasabah (derived table: agregat dulu, baru tampil)"
  layout={{"xaxis": {"title": "Nasabah"}, "yaxis": {"title": "Rupiah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi = SUM(jumlah) per nasabah — dihitung di subquery, baru digabung.</p>
<p><strong>Interpretasi:</strong> Budi tertinggi (3,4jt) — tapi ingat: ini <em>total</em>, bukan <em>rata-rata</em>. Selalu tanyakan &ldquo;total atau rata-rata?&rdquo; sebelum menyimpulkan &ldquo;terbaik&rdquo;. (Rata-rata per transaksi = pola HAVING/conditional aggregation.)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Subquery = &ldquo;query yang hasilnya dipakai query lain&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Di atas rata-rata — tanpa catat angka manual</summary>
              <p>Nasabah dengan penghasilan di atas rata-rata <em>kotanya masing-masing</em> (correlated!).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, kota, penghasilan
      FROM nasabah n
      WHERE penghasilan &gt; (
        SELECT AVG(penghasilan) FROM nasabah
        WHERE kota = n.kota   -- correlated: dihitung PER BARIS luar!
      );</pre>
              <p><strong>Bedah:</strong> subquery merujuk <code className="inline">n.kota</code> dari query luar → dieksekusi ulang per baris (correlated). Hasil: &ldquo;di atas rata-rata kotanya&rdquo;, bukan &ldquo;di atas rata-rata nasional&rdquo; — beda pertanyaan, beda jawaban! Untuk performa di data besar, pola ini biasanya ditulis ulang sebagai JOIN + GROUP BY (C7).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: EXISTS — &ldquo;punya minimal satu&rdquo;</summary>
              <p>Nasabah yang punya <em>minimal satu</em> kredit macet.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama FROM nasabah n
      WHERE EXISTS (
        SELECT 1 FROM kredit k
        WHERE k.nasabah_id = n.id AND k.status = &#x27;macet&#x27;
      );</pre>
              <p><strong>Bedah:</strong> EXISTS berhenti di <em>kecocokan pertama</em> (tidak menghitung semua!) → lebih cepat dari COUNT &gt; 0 untuk &ldquo;ada/tidak&rdquo;. <code className="inline">SELECT 1</code>: isi SELECT tidak penting — yang dicek hanya <em>keberadaan</em> baris. Anti-pola: <code className="inline">IN (SELECT ...)</code> dengan NULL di hasil = jebakan C2; EXISTS kebal NULL.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Derived table — agregasi dulu, baru join (obat fan-out!)</summary>
              <p>Total plafon per kota — versi subquery di FROM (bukan CTE):</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT n.kota, SUM(p.total_plafon) AS total_plafon_kota
      FROM nasabah n
      JOIN (
        SELECT nasabah_id, SUM(plafon) AS total_plafon
        FROM kredit GROUP BY nasabah_id
      ) p ON p.nasabah_id = n.id
      GROUP BY n.kota;</pre>
              <p><strong>Bedah:</strong> derived table = subquery bernama di FROM — <em>wajib</em> punya alias (<code className="inline">p</code>). Isinya: agregasi di sisi &ldquo;banyak&rdquo; <strong>sebelum</strong> join → fan-out mati sebelum lahir. Ini pola yang sama dengan CTE C7 — pilih CTE untuk keterbacaan, derived table jika tim-mu lebih familiar.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Di Atas Rata-rata</h2>

      <p>Tampilkan nama &amp; penghasilan nasabah yang penghasilannya di atas rata-rata. Lalu: yang dpd-nya di atas rata-rata dpd.</p>

      <PyodideLab
  title="Lab 1 — Subquery Skalar"
  hint="Bandingkan: apa bedanya dengan WHERE penghasilan > 9500000 (angka hardcode)?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, penghasilan
FROM nasabah
WHERE penghasilan &gt; (SELECT AVG(penghasilan) FROM nasabah);</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Agregat Dulu, Join Kemudian</h2>

      <p>Tampilkan semua nasabah + total transaksinya (0 jika tidak ada). Pakai derived table + LEFT JOIN + COALESCE.</p>

      <PyodideLab
  title="Lab 2 — Derived Table Anti Fan-out"
  hint="Nasabah tanpa transaksi muncul dengan total berapa? Kenapa COALESCE penting?"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT n.nama, COALESCE(t.total, 0) AS total_trx
FROM nasabah n
LEFT JOIN (
  SELECT nasabah_id, SUM(jumlah) AS total
  FROM transaksi
  GROUP BY nasabah_id
) t ON t.nasabah_id = n.id;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Subquery</h2>

      <div className="decision-card">
<h3>1. Banding dengan hasil hitungan → <strong>subquery skalar</strong></h3>
<p><strong>Kondisi data:</strong> &ldquo;Di atas rata-rata&rdquo;.</p>
<p><strong>Kenapa:</strong> Satu nilai; dihitung fresh tiap eksekusi.</p>
<p><strong>Contoh nyata:</strong> WHERE penghasilan &gt; (SELECT AVG(...)).</p>
</div>

      <div className="decision-card">
<h3>2. Keanggotaan → <strong>IN / EXISTS</strong></h3>
<p><strong>Kondisi data:</strong> &ldquo;Yang punya ...&rdquo;.</p>
<p><strong>Kenapa:</strong> EXISTS aman NULL & berhenti cepat; IN rapi untuk daftar kecil.</p>
<p><strong>Contoh nyata:</strong> WHERE id IN (SELECT ...).</p>
</div>

      <div className="decision-card">
<h3>3. &ldquo;Tidak ada&rdquo; → <strong>NOT EXISTS</strong> (bukan NOT IN!)</h3>
<p><strong>Kondisi data:</strong> Anti-join.</p>
<p><strong>Kenapa:</strong> NOT IN + NULL = kosong diam-diam.</p>
<p><strong>Contoh nyata:</strong> Nasabah tanpa kredit macet.</p>
</div>

      <div className="decision-card">
<h3>4. Agregat lalu join → <strong>derived table</strong></h3>
<p><strong>Kondisi data:</strong> Obat fan-out.</p>
<p><strong>Kenapa:</strong> Granularitas 1 baris per kunci → JOIN aman. Wajib alias.</p>
<p><strong>Contoh nyata:</strong> Total transaksi per nasabah, baru JOIN.</p>
</div>

      <div className="decision-card">
<h3>5. Correlated untuk agregat massal → <strong>tulis ulang JOIN+GROUP BY</strong></h3>
<p><strong>Kondisi data:</strong> N+1 problem.</p>
<p><strong>Kenapa:</strong> Sekali per baris = lambat di data besar.</p>
<p><strong>Contoh nyata:</strong> COUNT per nasabah via derived table.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Skalar = 1 baris 1 kolom, atau error.</li><li>&ldquo;Tidak ada&rdquo; → NOT EXISTS (default aman).</li><li>Derived table wajib alias; agregat dulu, join kemudian.</li><li>Correlated = per baris — waspadai di data besar.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Nasabah Aktif Tapi Tak Punya Kredit</h2>

      <div className="callout">
<p>Marketing mau kampanye: nasabah dengan <strong>total transaksi &gt; 1 juta</strong> tapi <strong>belum punya kredit</strong> — prospek cross-sell.</p><p><strong>Pertanyaan:</strong> tulis 1 query. (Petunjuk: derived table + NOT EXISTS.)</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">SELECT n.nama, t.total FROM nasabah n JOIN (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id HAVING SUM(jumlah) &gt; 1000000) t ON t.nasabah_id = n.id WHERE NOT EXISTS (SELECT 1 FROM kredit k WHERE k.nasabah_id = n.id);</code></p><p>Tiga teknik satu query: derived table (agregat), HAVING (saring grup), NOT EXISTS (anti-join). <strong>Pelajaran:</strong> query kompleks = komposisi pola sederhana. Kuasai pola, rangkai sesukamu.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Nasabah yang penghasilannya di atas rata-rata <em>nasional</em> (bukan per kota). Tulis dengan subquery skalar.</li>
              <li>Nasabah yang punya kredit dengan plafon &gt; 500jt (pakai EXISTS).</li>
              <li>Kapan subquery di SELECT (skalar) berbahaya untuk performa? Beri contoh.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1. Skalar: satu nilai untuk semua baris
      SELECT nama, penghasilan FROM nasabah
      WHERE penghasilan &gt; (SELECT AVG(penghasilan) FROM nasabah);
      -- 2.
      SELECT nama FROM nasabah n
      WHERE EXISTS (SELECT 1 FROM kredit k
                    WHERE k.nasabah_id = n.id AND k.plafon &gt; 500000000);</pre>
              <p><strong>3.</strong> Subquery skalar di SELECT dieksekusi <em>per baris output</em>: <code className="inline">SELECT nama, (SELECT COUNT(*) FROM kredit k WHERE k.nasabah_id = n.id) FROM nasabah n</code> → 100 ribu eksekusi untuk 100 ribu nasabah! Solusi: derived table + JOIN sekali jalan.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Skalar/IN:</strong> banding &amp; keanggotaan di WHERE.</li><li><strong>NOT EXISTS</strong> (bukan NOT IN) untuk &ldquo;tidak ada&rdquo; — aman NULL.</li><li><strong>Derived table:</strong> agregat dulu (wajib alias), baru join — obat fan-out.</li><li><strong>Correlated:</strong> kuat tapi per-baris — waspadai di data besar.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c5-join" className="btn btn-secondary btn-sm">← ← C5</Link>
        <Link href="/learn/c7-cte" className="btn btn-primary btn-sm">Next: C7 →</Link>
      </div>
    </div>
  );
}

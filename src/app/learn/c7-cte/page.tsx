import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C7CtePage() {
  const chart1 = [{"x": ["Subquery bersarang", "CTE"], "y": [120, 5], "type": "bar", "marker": {"color": ["#ef4444", "#34a853"]}, "text": ["120 mnt", "5 mnt"], "textposition": "outside"}];
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
# WITH total_trx AS (SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id) SELECT n.nama, COALESCE(t.total,0) FROM nasabah n LEFT JOIN total_trx t ON t.nasabah_id=n.id
q("""SELECT nasabah_id, SUM(jumlah) AS total FROM transaksi GROUP BY nasabah_id""")`;
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
# WITH RECURSIVE d(tgl) AS (SELECT date('2026-09-01') UNION ALL SELECT date(tgl,'+1 day') FROM d WHERE tgl<'2026-09-07') SELECT d.tgl, COALESCE(SUM(t.jumlah),0) FROM d LEFT JOIN transaksi t ON t.tanggal=d.tgl GROUP BY d.tgl
q("""WITH RECURSIVE d(tgl) AS (SELECT date('2026-09-01') UNION ALL SELECT date(tgl, '+1 day') FROM d WHERE tgl < '2026-09-07') SELECT * FROM d""")`;
  const quizData = [{"question": "Keunggulan utama CTE dibanding subquery bersarang…", "options": ["Lebih cepat selalu", "Terbaca: langkah bernama berurutan, bisa di-debug per langkah", "Bisa lintas database", "Tidak butuh alias"], "correct": 1, "explanation": "Benar: keterbacaan + debuggability. Performa umumnya setara."}, {"question": "CTE didefinisikan…", "options": ["Setelah query utama", "Di awal dengan WITH, sebelum query utama", "Di dalam WHERE", "Bebas di mana saja"], "correct": 1, "explanation": "Benar: WITH di awal, query utama di akhir."}, {"question": "Recursive CTE wajib punya…", "options": ["ORDER BY", "Anchor + kondisi berhenti", "GROUP BY", "LIMIT"], "correct": 1, "explanation": "Benar: tanpa kondisi berhenti = rekursi tak berujung."}, {"question": "Kapan temp table lebih tepat dari CTE?", "options": ["Query 1 langkah", "Data dipakai banyak query / besar", "Tidak pernah", "Selalu"], "correct": 1, "explanation": "Benar: CTE hidup 1 query; temp table lintas query/sesi."}, {"question": "SELECT * FROM total_trx (nama CTE) berguna untuk…", "options": ["Menambah kecepatan", "Debug: inspeksi hasil per langkah", "Mengubah data", "Membuat index"], "correct": 1, "explanation": "Benar: tiap langkah CTE bisa diinspeksi — alat debug utama."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C7 — SQL</span>
        <h1 className="display-title">CTE: Beri Nama pada<br/>Langkah Berpikirmu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Query 40 Baris yang Tak Bisa Dibaca</a></li>
          <li><a href="#dasar">WITH — Struktur Dasar</a></li>
          <li><a href="#multistep">Multi-Step Analysis — Kekuatan Sebenarnya</a></li>
          <li><a href="#cte-vs">CTE vs Subquery vs Temp Table</a></li>
          <li><a href="#rekursif">Recursive CTE — Untuk Hierarki &amp; Deret</a></li>
          <li><a href="#lab1">🔬 Lab 1: Subquery → CTE</a></li>
          <li><a href="#lab2">🔬 Lab 2: Recursive CTE</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Struktur Query</a></li>
          <li><a href="#case">📋 Mini-Case: Refactor Warisan 40 Baris</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menulis <strong>WITH ... AS</strong> (CTE) sebagai pengganti subquery bersarang.</li><li>Merangkai <strong>multi-step analysis</strong> yang terbaca.</li><li>Menjelaskan kapan CTE vs subquery vs temp table.</li><li>Menulis <strong>recursive CTE</strong> sederhana.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Query 40 Baris yang Tak Bisa Dibaca</h2>

      <div className="story"><p>Kamu mewarisi query 40 baris: subquery di dalam subquery di dalam subquery — seperti boneka Rusia. Ada bug di tengahnya. Kamu butuh <strong>2 jam</strong> hanya untuk paham alurnya.</p><p>CTE (Common Table Expression) memecahnya menjadi <strong>langkah bernama yang berurutan</strong>: <em>langkah 1: hitung total per nasabah; langkah 2: tandai yang aktif; langkah 3: gabung dengan kredit</em>. Query yang sama, terbaca dalam <strong>5 menit</strong>. Di tim data, keterbacaan = maintainability = uang.</p><p><strong>Twist-nya:</strong> CTE tidak membuat query lebih cepat — seringnya optimizer menghasilkan rencana eksekusi yang sama persis. Yang ia percepat adalah <em>manusia</em>: 2 jam → 5 menit memahami. Di tim data, bottleneck bukan CPU — melainkan otak analis berikutnya yang membaca query-mu jam 2 pagi sebelum laporan direksi. Keterbacaan = maintainability = uang.</p></div>

      <h2 id="dasar">WITH — Struktur Dasar</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH total_trx AS (
  SELECT nasabah_id, SUM(jumlah) AS total
  FROM transaksi
  GROUP BY nasabah_id
),
aktif AS (
  SELECT nasabah_id FROM total_trx WHERE total &gt; 1000000
)
SELECT n.nama
FROM nasabah n
JOIN aktif a ON a.nasabah_id = n.id;</pre>

      <ul>
<li><code className="inline">WITH nama AS (query)</code> — definisikan &ldquo;tabel sementara bernama&rdquo;.</li>
<li>Bisa banyak CTE, dipisah koma — <strong>berurutan &amp; bisa saling merujuk</strong>.</li>
<li>Query utama di akhir memakai semuanya — alur baca <strong>atas ke bawah</strong>.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan penamaan CTE: pakai kata kerja/benda yang menjelaskan <em>isi</em> (<code className="inline">total_trx</code>, <code className="inline">nasabah_aktif</code>), bukan <code className="inline">cte1</code>/<code className="inline">temp</code>. Nama baik = dokumentasi gratis.</p>
</div>

      <h2 id="multistep">Multi-Step Analysis — Kekuatan Sebenarnya</h2>

      <p>Contoh: NPL ratio per kota (mini-case C3) ditulis ulang dengan CTE — tiap langkah bernama:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH kredit_kota AS (
  SELECT n.kota, k.plafon, k.kolektibilitas
  FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id
),
ringkas AS (
  SELECT kota,
         SUM(plafon) AS total_plafon,
         SUM(CASE WHEN kolektibilitas &gt;= 3 THEN plafon ELSE 0 END) AS plafon_npl
  FROM kredit_kota
  GROUP BY kota
)
SELECT kota,
       plafon_npl * 1.0 / total_plafon AS npl_ratio
FROM ringkas
ORDER BY npl_ratio DESC;</pre>

      <p><strong>Mengapa lebih baik dari subquery bersarang?</strong> (1) tiap langkah bisa di-debug terpisah (SELECT * FROM ringkas), (2) CTE bisa dipakai <strong>berulang</strong> di query utama, (3) alur logis jelas.</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: kota dengan rata-rata total transaksi per nasabah tertinggi.</p><p><strong>Langkah 1</strong> — total per nasabah: <code className="inline">WITH t AS (SELECT nasabah_id, SUM(jumlah) s FROM transaksi GROUP BY 1)</code>.</p><p><strong>Langkah 2</strong> — gabung kota + rata-rata per kota: <code className="inline">, k AS (SELECT n.kota, AVG(t.s) r FROM nasabah n JOIN t ON ... GROUP BY 1)</code>.</p><p><strong>Langkah 3</strong> — <code className="inline">SELECT * FROM k ORDER BY r DESC LIMIT 1</code>.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CTE selalu lebih lambat dari subquery.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Di database modern, CTE biasanya di-inline seperti subquery (sama cepatnya). Pengecualian: PostgreSQL lama mematerialisasi CTE (dihitung sekali, disimpan) — kadang justru <em>lebih cepat</em> jika CTE dipakai berulang. Jangan anti-CTE karena mitos performa; ukur dengan EXPLAIN.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CTE bisa dipakai untuk UPDATE/DELETE.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Di kebanyakan database, CTE hanya untuk SELECT (read-only)! Untuk ubah data pakai statement DML biasa atau temp table. Pengecualian: PostgreSQL mendukung <code className="inline">data-modifying CTE</code> (WITH ... INSERT/UPDATE) — tapi itu fitur khusus, bukan standar.</p>
</div>

      <h2 id="cte-vs">CTE vs Subquery vs Temp Table</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>CTE</th><th>Subquery</th><th>Temp Table</th></tr></thead>
<tbody>
<tr><td>Keterbacaan</td><td>Tinggi (bernama, berurutan)</td><td>Rendah jika bersarang</td><td>Tinggi</td></tr>
<tr><td>Pakai ulang</td><td>Berkali-kali dalam 1 query</td><td>Harus ditulis ulang</td><td>Antar query/sesi</td></tr>
<tr><td>Umur</td><td>Satu query</td><td>Satu query</td><td>Sesi/transaksi</td></tr>
<tr><td>Kapan</td><td>Analisis multi-langkah</td><td>Satu langkah kecil</td><td>Data besar dipakai berulang</td></tr>
</tbody>
</table>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pedoman: 1 langkah → subquery inline; 2+ langkah atau dipakai 2× → CTE; dipakai di banyak query / data besar → temp table (C16).</p>
</div>

      <h2 id="rekursif">Recursive CTE — Untuk Hierarki &amp; Deret</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- deret tanggal 7 hari (date spine mini!)
WITH RECURSIVE d(tgl) AS (
  SELECT date(&#x27;2026-09-01&#x27;)
  UNION ALL
  SELECT date(tgl, &#x27;+1 day&#x27;) FROM d WHERE tgl &lt; &#x27;2026-09-07&#x27;
)
SELECT * FROM d;</pre>

      <ul>
<li><strong>Anchor</strong> (SELECT pertama) + <strong>rekursi</strong> (UNION ALL + kondisi berhenti).</li>
<li><strong>Kapan:</strong> hierarki (karyawan–manajer–direktur), deret tanggal (date spine!), BOM.</li>
<li><strong>Wajib:</strong> kondisi berhenti — tanpa itu rekursi tak berujung!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Date spine via recursive CTE = obat chart berlubang (C4): LEFT JOIN-kan data ke deret tanggal lengkap agar hari tanpa transaksi tetap muncul (dengan 0).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Waktu Memahami Query 40 Baris (ilustrasi)"
  layout={{"yaxis": {"title": "Menit"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Perbandingan ilustratif waktu yang dibutuhkan analis baru memahami query yang sama.</p>
<p><strong>Interpretasi:</strong> Angka ilustratif — tapi intinya nyata: <strong>keterbacaan = biaya maintenance</strong>. Query ditulis sekali, dibaca puluhan kali. CTE membayar dirinya sendiri.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. CTE = &ldquo;beri nama tiap langkah&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: NPL per kota — dari subquery ke CTE</summary>
              <p>Query C3 (NPL per kota) ditulis ulang sebagai 3 langkah bernama. Mana yang lebih mudah di-debug?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH per_kredit AS (
        SELECT kota,
               CASE WHEN status = &#x27;macet&#x27; THEN 1 ELSE 0 END AS is_macet
        FROM kredit
      ),
      per_kota AS (
        SELECT kota, COUNT(*) AS total, SUM(is_macet) AS macet
        FROM per_kredit GROUP BY kota
      )
      SELECT kota, total, macet,
             ROUND(100.0 * macet / total, 2) AS npl_pct
      FROM per_kota
      ORDER BY npl_pct DESC;</pre>
              <p><strong>Bedah:</strong> tiap CTE bisa di-SELECT sendiri untuk debug (<code className="inline">SELECT * FROM per_kredit LIMIT 5</code>) — tidak bisa dilakukan dengan subquery bersarang tanpa membongkarnya. Langkah bernama = unit test untuk SQL.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Rantai 3 langkah — funnel sederhana</summary>
              <p>Hitung konversi: daftar → aktif → transaksi, per bulan akuisisi.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH daftar AS (
        SELECT id, DATE_TRUNC(&#x27;month&#x27;, tgl_daftar) AS kohor
        FROM nasabah
      ),
      aktif AS (
        SELECT DISTINCT nasabah_id FROM transaksi
        WHERE tanggal &gt;= &#x27;2026-01-01&#x27;
      )
      SELECT d.kohor,
             COUNT(*) AS daftar,
             COUNT(a.nasabah_id) AS aktif,
             ROUND(100.0 * COUNT(a.nasabah_id) / COUNT(*), 1) AS konversi_pct
      FROM daftar d LEFT JOIN aktif a ON a.nasabah_id = d.id
      GROUP BY d.kohor ORDER BY d.kohor;</pre>
              <p><strong>Bedah:</strong> baca dari bawah ke atas: hasil akhir butuh daftar + aktif; masing-masing didefinisikan sekali di atas. Menambah tahap funnel ke-3 = tambah satu CTE + satu JOIN — tanpa menyentuh langkah lain. Inilah &ldquo;multi-step analysis&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: CTE yang dipakai dua kali — DRY</summary>
              <p>Bandingkan rata-rata penghasilan &ldquo;telat&rdquo; vs &ldquo;lancar&rdquo; — tanpa mengulang definisi &ldquo;telat&rdquo;.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH segmen AS (
        SELECT CASE WHEN dpd &gt; 0 THEN &#x27;telat&#x27; ELSE &#x27;lancar&#x27; END AS seg,
               penghasilan
        FROM nasabah
      )
      SELECT seg, COUNT(*) AS n, ROUND(AVG(penghasilan)) AS avg_gaji
      FROM segmen GROUP BY seg;</pre>
              <p><strong>Bedah:</strong> definisi &ldquo;telat&rdquo; ditulis <em>satu kali</em> di CTE, dipakai di SELECT + GROUP BY. Dengan subquery, kamu mengulang CASE WHEN di dua tempat — ubah definisi = ubah dua tempat = lupa satu = bug. DRY (Don&apos;t Repeat Yourself) berlaku untuk SQL juga.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Subquery → CTE</h2>

      <p>Tulis ulang query lab C6-lab2 (nasabah + total transaksi) memakai CTE bernama <code className="inline">total_trx</code>.</p>

      <PyodideLab
  title="Lab 1 — Tulis Ulang dengan CTE"
  hint="Debug: SELECT * FROM total_trx; — CTE bisa diinspeksi per langkah!"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH total_trx AS (
  SELECT nasabah_id, SUM(jumlah) AS total
  FROM transaksi
  GROUP BY nasabah_id
)
SELECT n.nama, COALESCE(t.total, 0) AS total_trx
FROM nasabah n
LEFT JOIN total_trx t ON t.nasabah_id = n.id;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Recursive CTE</h2>

      <p>Buat deret 2026-09-01 s.d. 2026-09-07 dengan recursive CTE, lalu LEFT JOIN-kan jumlah transaksi per tanggal (date spine!).</p>

      <PyodideLab
  title="Lab 2 — Deret Tanggal"
  hint="Hari tanpa transaksi sekarang muncul dengan 0 — chart jadi kontinu!"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE d(tgl) AS (
  SELECT date(&#x27;2026-09-01&#x27;)
  UNION ALL
  SELECT date(tgl, &#x27;+1 day&#x27;) FROM d WHERE tgl &lt; &#x27;2026-09-07&#x27;
)
SELECT d.tgl, COALESCE(SUM(t.jumlah), 0) AS total
FROM d LEFT JOIN transaksi t ON t.tanggal = d.tgl
GROUP BY d.tgl;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Struktur Query</h2>

      <div className="decision-card">
<h3>1. Satu langkah kecil → <strong>subquery inline</strong></h3>
<p><strong>Kondisi data:</strong> Sederhana.</p>
<p><strong>Kenapa:</strong> Tidak perlu CTE untuk 1 langkah.</p>
<p><strong>Contoh nyata:</strong> WHERE x &gt; (SELECT AVG(x) ...).</p>
</div>

      <div className="decision-card">
<h3>2. 2+ langkah / dipakai 2× → <strong>CTE</strong></h3>
<p><strong>Kondisi data:</strong> Multi-step.</p>
<p><strong>Kenapa:</strong> Bernama, berurutan, bisa di-debug per langkah.</p>
<p><strong>Contoh nyata:</strong> NPL per kota 3 langkah.</p>
</div>

      <div className="decision-card">
<h3>3. Hierarki / deret → <strong>recursive CTE</strong></h3>
<p><strong>Kondisi data:</strong> Rekursif.</p>
<p><strong>Kenapa:</strong> Anchor + kondisi berhenti wajib.</p>
<p><strong>Contoh nyata:</strong> Date spine, org chart.</p>
</div>

      <div className="decision-card">
<h3>4. Dipakai banyak query / besar → <strong>temp table</strong></h3>
<p><strong>Kondisi data:</strong> Lintas query.</p>
<p><strong>Kenapa:</strong> CTE hanya hidup 1 query.</p>
<p><strong>Contoh nyata:</strong> Staging harian (C16).</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Namai CTE dengan <em>isi</em>-nya, bukan cte1.</li><li>Debug per langkah: SELECT * FROM nama_cte.</li><li>Recursive: selalu ada kondisi berhenti.</li><li>Keterbacaan &gt; keringkasan — selalu.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Refactor Warisan 40 Baris</h2>

      <div className="callout">
<p>Kamu mewarisi query: subquery 3 level untuk &ldquo;top 3 kota by NPL ratio&rdquo;. Ada bug: satu kota NPL-nya 300% (mustahil!).</p><p><strong>Pertanyaan:</strong> bagaimana CTE membantumu menemukan bug dalam 5 menit?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Langkah:</strong> pecah jadi CTE: <code className="inline">kredit_kota</code> → <code className="inline">ringkas</code> → SELECT final. Lalu <code className="inline">SELECT * FROM kredit_kota WHERE kota = 'X'</code> — ketahuan: <strong>duplikat baris kredit</strong> (join ganda!) menggandakan plafon_npl tapi tidak total_plafon (atau sebaliknya). Bug fan-out (C5) yang tersembunyi di sarang subquery.</p><p><strong>Pelajaran:</strong> CTE bukan cuma gaya — ia <em>alat debug</em>. Tiap langkah bisa diinspeksi. Query warisan pertama yang harus dilakukan: refactor ke CTE, baru cari bug.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Tulis ulang query C3 Kasus 2 (HAVING) memakai CTE: satu CTE agregasi, SELECT final dengan WHERE di NPL.</li>
              <li>Dengan CTE <code className="inline">aktif</code> di atas, bagaimana menambah kolom &ldquo;transaksi pertama&rdquo; (tanggal min) per nasabah?</li>
              <li>Kapan CTE <em>lebih lambat</em> dari subquery? (Petunjuk: materialization.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1.
      WITH agg AS (
        SELECT kota, COUNT(*) AS total,
               SUM(CASE WHEN status=&#x27;macet&#x27; THEN 1 ELSE 0 END) AS macet
        FROM kredit GROUP BY kota
      )
      SELECT kota, total, macet, ROUND(100.0*macet/total,2) AS npl_pct
      FROM agg WHERE 100.0*macet/total &gt; 3 AND total &gt; 1000;
      -- 2. Tambah agregasi di CTE aktif:
      -- aktif AS (SELECT nasabah_id, MIN(tanggal) AS pertama
      --           FROM transaksi WHERE tanggal &gt;= &#x27;2026-01-01&#x27;
      --           GROUP BY nasabah_id)</pre>
              <p><strong>3.</strong> Di Postgres &lt; 12 (dan kadang masih), CTE di-<em>materialize</em>: dihitung penuh &amp; disimpan dulu walau final query hanya butuh sedikit baris — optimizer tidak bisa &ldquo;mendorong&rdquo; filter ke dalam. Jika CTE 10 juta baris tapi final butuh 10 baris, subquery/derived table bisa jauh lebih cepat. Aturan: CTE untuk keterbacaan; jika lambat, cek EXPLAIN (C17).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>CTE:</strong> WITH nama AS (...) — langkah bernama, berurutan, reusable dalam 1 query.</li><li><strong>Multi-step:</strong> pecah analisis kompleks; debug per langkah.</li><li><strong>Recursive:</strong> anchor + kondisi berhenti — hierarki &amp; date spine.</li><li><strong>Pilih:</strong> 1 langkah → subquery; 2+ → CTE; lintas query → temp table.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c6-subquery" className="btn btn-secondary btn-sm">← ← C6</Link>
        <Link href="/learn/c8-union-set" className="btn btn-primary btn-sm">Next: C8 →</Link>
      </div>
    </div>
  );
}

import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C5JoinPage() {
  const chart1 = [{"x": ["INNER", "LEFT (nasabah)", "FULL"], "y": [10, 10, 10], "type": "bar", "name": "Baris hasil", "marker": {"color": "#2a7de1"}}, {"x": ["INNER", "LEFT (nasabah)", "FULL"], "y": [10, 12, 12], "type": "bar", "name": "Baris kredit tercakup", "marker": {"color": "#e8a838"}}];
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
# -- INNER dulu, lalu LEFT. Bandingkan jumlah baris.
# SELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id
q("""SELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id""")`;
  const lab2Code = String.raw`import sqlite3
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
# SELECT SUM(n.penghasilan) FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id  -- vs tanpa join
q("""SELECT SUM(penghasilan) FROM nasabah""")`;
  const quizData = [{"question": "Nasabah tanpa kredit pada INNER JOIN nasabah–kredit…", "options": ["Tetap muncul (NULL)", "Hilang", "Error", "Muncul 2x"], "correct": 1, "explanation": "Benar: INNER hanya yang cocok. Butuh mereka? Pakai LEFT."}, {"question": "&ldquo;Semua nasabah + total transaksinya&rdquo; butuh…", "options": ["INNER JOIN", "LEFT JOIN + COALESCE", "CROSS JOIN", "FULL JOIN"], "correct": 1, "explanation": "Benar: LEFT pertahankan nasabah; COALESCE ubah NULL jadi 0."}, {"question": "Fan-out: Budi punya 2 kredit. SUM(n.penghasilan) setelah JOIN…", "options": ["Benar", "Terhitung 2× — salah", "NULL", "Error"], "correct": 1, "explanation": "Benar: baris ganda → agregat kolom tabel-satu salah."}, {"question": "Cara aman agregat setelah JOIN 1-ke-banyak…", "options": ["DISTINCT", "Agregasi dulu di subquery/CTE, atau COUNT DISTINCT", "ORDER BY", "LIMIT"], "correct": 1, "explanation": "Benar: perbaiki granularitas dulu. DISTINCT menutupi gejala & merusak SUM yang sah."}, {"question": "Lupa ON pada JOIN 10 × 12 baris…", "options": ["10 baris", "22 baris", "120 baris (CROSS)", "Error"], "correct": 2, "explanation": "Benar: CROSS JOIN = perkalian. Di produksi bisa jutaan² — selalu cek COUNT(*)."}, {"question": "Self-join butuh…", "options": ["Tidak bisa dilakukan", "Dua alias berbeda untuk tabel yang sama", "UNION", "Subquery saja"], "correct": 1, "explanation": "Benar: a dan b — tanpa alias, database tak tahu mana yang mana."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C5 — SQL</span>
        <h1 className="display-title">JOIN: Menyambung Tabel<br/>tanpa Menggandakan Fakta</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Total Plafon yang Tiba-tiba 2× Lipat</a></li>
          <li><a href="#inner">INNER JOIN — Irisan</a></li>
          <li><a href="#outer">LEFT / RIGHT / FULL — Jangan Hilangkan Baris</a></li>
          <li><a href="#fanout">Fan-out — Penggandaan yang Mematikan ⚠️</a></li>
          <li><a href="#cross">CROSS JOIN &amp; Self-Join</a></li>
          <li><a href="#lab1">🔬 Lab 1: INNER vs LEFT</a></li>
          <li><a href="#lab2">🔬 Lab 2: Menangkap Fan-out</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: JOIN</a></li>
          <li><a href="#case">📋 Mini-Case: Total Plafon 2× Lipat</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Membedakan <strong>INNER, LEFT, RIGHT, FULL OUTER JOIN</strong> — dan kapan tiap dipakai.</li><li>Menjelaskan <strong>fan-out</strong> (penggandaan baris) dan cara mencegahnya.</li><li>Menulis JOIN dengan <strong>alias tabel</strong> yang rapi.</li><li>Menghindari <strong>CROSS JOIN</strong> tak disengaja.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Total Plafon yang Tiba-tiba 2× Lipat</h2>

      <div className="story"><p>Analis menggabungkan <code className="inline">nasabah</code> dan <code className="inline">kredit</code> untuk menghitung total plafon per kota. Hasilnya: <strong>Rp 1,4 miliar</strong> — padahal kemarin Rp 800 juta. Tidak ada kredit baru. Apa yang terjadi?</p><p>Budi punya <strong>2 kredit</strong>. JOIN menduplikasi baris Budi — dan kolom <code className="inline">penghasilan</code>-nya ikut terganda. Setiap SUM/AVG setelah JOIN fan-out <strong>salah diam-diam</strong>. JOIN adalah operasi SQL paling kuat sekaligus paling berbahaya — lesson ini mengajarkan cara menjinakkannya.</p><p><strong>Twist-nya:</strong> Budi tidak menambah kredit — tapi total plafon naik Rp600 juta. Tidak ada data baru, tidak ada error sintaks; query-nya &ldquo;jalan sempurna&rdquo; dan hasilnya salah. JOIN tidak merusak data — ia <em>melipatgandakannya diam-diam</em>, dan SUM yang polos tidak bisa membedakan &ldquo;2 kredit Budi&rdquo; dari &ldquo;2 Budi&rdquo;. Bug paling mahal di SQL bukan yang error — melainkan yang terlihat benar.</p></div>

      <h2 id="inner">INNER JOIN — Irisan</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT n.nama, k.plafon, k.tenor
FROM nasabah n
INNER JOIN kredit k ON k.nasabah_id = n.id;</pre>

      <ul>
<li>Hanya baris yang <strong>cocok di kedua tabel</strong> (nasabah yang punya kredit).</li>
<li><code className="inline">ON</code> = syarat pencocokan (biasanya PK = FK).</li>
<li>Alias <code className="inline">n</code>/<code className="inline">k</code> = wajib untuk keterbacaan.</li>
</ul>

      <p><strong>Kunci asing (FK):</strong> <code className="inline">kredit.nasabah_id</code> menunjuk ke <code className="inline">nasabah.id</code> (PK). JOIN menyambung lewat relasi ini.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Selalu tulis <code className="inline">INNER JOIN</code> eksplisit (jangan cuma JOIN) dan kondisi ON — kejelasan mengalahkan keringkasan saat query dibaca 6 bulan kemudian.</p>
</div>

      <h2 id="outer">LEFT / RIGHT / FULL — Jangan Hilangkan Baris</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- LEFT: semua nasabah, kredit jika ada (NULL jika tidak)
SELECT n.nama, k.plafon
FROM nasabah n
LEFT JOIN kredit k ON k.nasabah_id = n.id;

-- RIGHT: semua kredit (di SQLite: tukar posisi + LEFT)
-- FULL OUTER: semua dari kedua sisi (SQLite: UNION dua LEFT)</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Jenis</th><th>Baris kiri</th><th>Baris kanan</th><th>Kapan</th></tr></thead>
<tbody>
<tr><td>INNER</td><td>Hanya yang cocok</td><td>Hanya yang cocok</td><td>Default; kedua sisi wajib ada</td></tr>
<tr><td>LEFT</td><td>Semua</td><td>Jika cocok (NULL jika tidak)</td><td>Pertahankan kiri: semua nasabah + opsional kredit</td></tr>
<tr><td>RIGHT</td><td>Jika cocok</td><td>Semua</td><td>Jarang — tukar posisi, pakai LEFT</td></tr>
<tr><td>FULL OUTER</td><td>Semua</td><td>Semua</td><td>Rekonsiliasi: apa yang hilang di tiap sisi</td></tr>
</tbody>
</table>
</div>

      <p><strong>Contoh nyata:</strong> &ldquo;semua nasabah + total transaksinya (0 jika tidak ada)&rdquo; → LEFT JOIN + <code className="inline">COALESCE(SUM(...), 0)</code>. Dengan INNER, nasabah tanpa transaksi <strong>hilang</strong> — laporan &ldquo;nasabah tidak aktif&rdquo; mustahil dibuat!</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;LEFT JOIN dan INNER JOIN hasilnya sama kalau datanya bersih.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Justru di data &ldquo;bersih&rdquo; pun beda: INNER membuang yang tidak cocok <em>diam-diam</em>. Aturan: tanyakan dulu &ldquo;bolehkah baris hilang?&rdquo; — jika tidak (laporan lengkap!), pakai LEFT. Pilihan JOIN adalah keputusan bisnis, bukan gaya.</p>
</div>

      <h2 id="fanout">Fan-out — Penggandaan yang Mematikan ⚠️</h2>

      <p>Satu nasabah → 2 kredit. JOIN menghasilkan <strong>2 baris Budi</strong>. Sekarang:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SALAH: penghasilan Budi terhitung 2x!
SELECT SUM(n.penghasilan) FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;

-- BENAR: agregasi di level yang tepat
SELECT SUM(penghasilan) FROM nasabah;  -- tanpa join, atau:
SELECT n.kota, SUM(k.plafon)           -- plafon memang per kredit: OK
FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id
GROUP BY n.kota;</pre>

      <ul>
<li><strong>Aturan:</strong> agregat kolom dari tabel &ldquo;satu&rdquo; (nasabah) setelah join ke tabel &ldquo;banyak&rdquo; (kredit) = <strong>salah</strong> kecuali di-COUNT DISTINCT / di-pre-agregasi.</li>
<li><strong>Pola aman:</strong> agregasi <em>dulu</em> di level benar (subquery/CTE — C6/C7), <em>baru</em> join.</li>
<li><strong>Validasi:</strong> <code className="inline">COUNT(*)</code> sebelum vs sesudah JOIN — jika membengkak, ada fan-out.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Refleks sebelum agregat setelah JOIN: &ldquo;apakah relasinya 1-ke-banyak?&rdquo; Jika ya → agregasi dulu di subquery, atau COUNT(DISTINCT id). Kebiasaan ini menyelamatkan setiap laporan keuangan.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Duplikat setelah JOIN bisa dibersihkan dengan DISTINCT.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> DISTINCT menyembunyikan gejala tapi <strong>merusak SUM</strong> (dua kredit Budi yang sah jadi satu!). Obati penyebab: agregasi di level granularitas yang benar, bukan tempel DISTINCT.</p>
</div>

      <h2 id="cross">CROSS JOIN &amp; Self-Join</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- CROSS: semua pasangan (10 x 12 = 120 baris!) — jarang dipakai langsung
SELECT n.nama, k.id FROM nasabah n CROSS JOIN kredit k;

-- Self-join: bandingkan dalam tabel yang sama
SELECT a.nama AS n1, b.nama AS n2, a.kota
FROM nasabah a JOIN nasabah b
  ON a.kota = b.kota AND a.id &lt; b.id;  -- pasangan sekota</pre>

      <p><strong>Bahaya:</strong> lupa ON → CROSS JOIN tak disengaja → 10 × 12 = 120 baris (di produksi: jutaan × jutaan = <strong>query meledak</strong>). Selalu cek COUNT(*) setelah JOIN!</p>

      <p><strong>Self-join:</strong> tabel join dirinya sendiri (butuh 2 alias!) — untuk pasangan, hierarki (karyawan–manajer), perbandingan antar baris.</p>

      <PlotlyChart
  data={chart1}
  title="Jenis JOIN: Berapa Baris yang Dipertahankan?"
  layout={{"barmode": "group", "yaxis": {"title": "Jumlah"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Bandingkan tinggi batang per jenis JOIN pada data lab (10 nasabah, 12 kredit).</p>
<p><strong>Interpretasi:</strong> LEFT mempertahankan semua 10 nasabah (2 tanpa kredit → NULL plafon) — INNER membuang mereka. <strong>Pilih JOIN = pilih siapa yang boleh hilang.</strong> Untuk laporan lengkap, LEFT adalah default yang aman.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. JOIN = pencocokan baris; salah kunci = salah hasil.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Total plafon per kota — jebakan fan-out</summary>
              <p><code className="inline">nasabah(id, kota, penghasilan)</code>, <code className="inline">kredit(id, nasabah_id, plafon)</code>. Budi (Jakarta) punya 2 kredit @50jt. Query naif:</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SALAH: Budi terhitung 2x -&gt; total plafon Jakarta membengkak
      SELECT k.kota, SUM(k.plafon) ... -- (ilustrasi; lihat bawah)
      -- Pola benar: agregasi DULU per nasabah, baru join/analisis
      WITH plafon_nasabah AS (
        SELECT nasabah_id, SUM(plafon) AS total_plafon
        FROM kredit GROUP BY nasabah_id
      )
      SELECT n.kota, SUM(p.total_plafon) AS total_plafon_kota
      FROM nasabah n JOIN plafon_nasabah p ON p.nasabah_id = n.id
      GROUP BY n.kota;</pre>
              <p><strong>Bedah:</strong> fan-out terjadi saat 1 baris kiri cocok &gt;1 baris kanan — kolom kiri (kota, penghasilan) ikut terganda. Obat: <strong>agregasi dulu di sisi &ldquo;banyak&rdquo;, baru join</strong> (pola C6!). Aturan audit: bandingkan COUNT sebelum/sesudah JOIN.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: LEFT JOIN — jangan hilangkan yang tidak punya kredit</summary>
              <p>Daftar semua nasabah + total plafonnya (0 jika tidak punya kredit).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT n.nama,
             COALESCE(SUM(k.plafon), 0) AS total_plafon
      FROM nasabah n
      LEFT JOIN kredit k ON k.nasabah_id = n.id
      GROUP BY n.nama;</pre>
              <p><strong>Bedah:</strong> INNER JOIN membuang nasabah tanpa kredit (bias seleksi!). LEFT JOIN mempertahankan semua baris kiri; yang tidak cocok → NULL → COALESCE jadi 0. <strong>Jebakan lanjutan:</strong> <code className="inline">WHERE k.plafon &gt; 1000000</code> <em>setelah</em> LEFT JOIN membunuh baris NULL (= mengubahnya jadi INNER!). Filter tabel kanan harus di ON, bukan WHERE.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Self-join — atasan tiap karyawan</summary>
              <p><code className="inline">karyawan(id, nama, atasan_id)</code>. Tampilkan nama karyawan + nama atasannya.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT k.nama AS karyawan, a.nama AS atasan
      FROM karyawan k
      LEFT JOIN karyawan a ON a.id = k.atasan_id;  -- tabel yang sama, 2 peran!</pre>
              <p><strong>Bedah:</strong> self-join = tabel dipakai dua kali dengan alias berbeda (k = bawahan, a = atasan). LEFT JOIN agar direktur (atasan NULL) tetap muncul. Pola ini dipakai untuk hierarki, rantai referral, dan perbandingan &ldquo;vs rata-rata kelompoknya&rdquo;.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: INNER vs LEFT</h2>

      <p>Bandingkan: INNER JOIN nasabah–kredit vs LEFT JOIN. Berapa baris tiap hasil? Nasabah mana yang hilang di INNER?</p>

      <PyodideLab
  title="Lab 1 — Siapa yang Hilang?"
  hint="Coba: nasabah tanpa kredit + COALESCE(k.plafon, 0)."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- INNER: 12 baris (hanya yg punya kredit)
SELECT n.nama, k.plafon FROM nasabah n INNER JOIN kredit k ON k.nasabah_id = n.id;
-- LEFT: 10 baris (semua nasabah; tanpa kredit -&gt; NULL)
SELECT n.nama, k.plafon FROM nasabah n LEFT JOIN kredit k ON k.nasabah_id = n.id;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Menangkap Fan-out</h2>

      <p>Hitung SUM(penghasilan) dari nasabah saja vs setelah JOIN ke kredit. Jelaskan selisihnya!</p>

      <PyodideLab
  title="Lab 2 — Bukti Penggandaan"
  hint="Perbaiki: hitung total plafon per kota dengan benar (plafon memang per kredit — kapan fan-out masalah vs tidak?)."
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- tanpa join (benar):
SELECT SUM(penghasilan) FROM nasabah;
-- setelah join (salah: Budi &amp; Eko terhitung 2x):
SELECT SUM(n.penghasilan)
FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;
-- plafon per kota (benar: plafon granularitas kredit):
SELECT n.kota, SUM(k.plafon)
FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id
GROUP BY n.kota;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: JOIN</h2>

      <div className="decision-card">
<h3>1. Kedua sisi wajib ada → <strong>INNER</strong></h3>
<p><strong>Kondisi data:</strong> Default.</p>
<p><strong>Kenapa:</strong> Hanya yang cocok. Baris tak cocok hilang — pastikan itu yang kamu mau.</p>
<p><strong>Contoh nyata:</strong> Nasabah yang punya kredit.</p>
</div>

      <div className="decision-card">
<h3>2. Pertahankan satu sisi → <strong>LEFT</strong></h3>
<p><strong>Kondisi data:</strong> Laporan lengkap.</p>
<p><strong>Kenapa:</strong> Sisi kiri utuh; kanan NULL jika tak ada. Default aman untuk laporan.</p>
<p><strong>Contoh nyata:</strong> Semua nasabah + transaksinya (0 jika tak ada).</p>
</div>

      <div className="decision-card">
<h3>3. Rekonsiliasi dua sisi → <strong>FULL OUTER</strong></h3>
<p><strong>Kondisi data:</strong> &ldquo;Apa yang hilang di mana?&rdquo;.</p>
<p><strong>Kenapa:</strong> Semua baris kedua sisi; NULL menandai yang hilang.</p>
<p><strong>Contoh nyata:</strong> Bandingkan data core vs data warehouse.</p>
</div>

      <div className="decision-card">
<h3>4. Agregat setelah JOIN → <strong>cek fan-out dulu</strong></h3>
<p><strong>Kondisi data:</strong> Relasi 1-ke-banyak.</p>
<p><strong>Kenapa:</strong> Agregasi dulu di subquery, atau COUNT DISTINCT.</p>
<p><strong>Contoh nyata:</strong> COUNT(*) sebelum vs sesudah JOIN.</p>
</div>

      <div className="decision-card">
<h3>5. Lupa ON → <strong>berhenti, cek COUNT(*)</strong></h3>
<p><strong>Kondisi data:</strong> Hasil meledak.</p>
<p><strong>Kenapa:</strong> CROSS JOIN tak disengaja = jutaan² baris.</p>
<p><strong>Contoh nyata:</strong> 10 × 12 = 120 baris tak terduga.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Alias tabel selalu. ON selalu eksplisit.</li><li>Tanya: &ldquo;bolehkah baris hilang?&rdquo; — tidak → LEFT.</li><li>COUNT(*) sebelum vs sesudah JOIN — bengkak = fan-out.</li><li>Agregat kolom tabel-&ldquo;satu&rdquo; setelah join ke-&ldquo;banyak&rdquo; = salah.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Total Plafon 2× Lipat</h2>

      <div className="callout">
<p>Analis melaporkan total plafon Rp 1,4 M (harusnya ~Rp 800 jt). Query: <code className="inline">SELECT SUM(n.plafon) ... FROM nasabah n JOIN kredit k ...</code> — eh, plafon ada di tabel kredit. Setelah diperiksa, analis menjumlah <code className="inline">k.plafon</code> tapi <em>juga</em> menampilkan <code className="inline">SUM(n.penghasilan)</code> sebagai &ldquo;total gaji debitur&rdquo; — angka gaji yang 2× lipat.</p><p><strong>Pertanyaan:</strong> (a) kenapa gaji 2×? (b) tulis query &ldquo;total gaji unik debitur per kota&rdquo; yang benar.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Budi &amp; Eko punya 2 kredit → barisnya ganda → penghasilan ikut terjumlah 2×. Plafon benar karena granularitasnya memang per kredit.</p><p>(b) <code className="inline">SELECT n.kota, SUM(n.penghasilan) FROM (SELECT DISTINCT id, kota, penghasilan FROM nasabah WHERE id IN (SELECT nasabah_id FROM kredit)) n GROUP BY n.kota;</code> — dedup <em>dulu</em>, agregat <em>kemudian</em>. Atau agregasi per nasabah di CTE (C7). <strong>Pelajaran:</strong> agregat mengikuti granularitas baris — bukan keinginanmu.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Tampilkan nama nasabah + jumlah kreditnya (termasuk yang 0 kredit).</li>
              <li>Mengapa <code className="inline">SELECT COUNT(*) FROM nasabah n LEFT JOIN kredit k ON k.nasabah_id=n.id</code> bisa &gt; jumlah nasabah? Kapan tepat sama?</li>
              <li>Tulis query: nasabah yang <em>tidak punya</em> kredit sama sekali (anti-join).</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1.
      SELECT n.nama, COUNT(k.id) AS jml_kredit
      FROM nasabah n LEFT JOIN kredit k ON k.nasabah_id = n.id
      GROUP BY n.nama;
      -- COUNT(k.id): NULL tidak dihitung -&gt; yang 0 kredit = 0. (COUNT(*) akan memberi 1!)
      -- 3. Anti-join:
      SELECT n.nama FROM nasabah n
      LEFT JOIN kredit k ON k.nasabah_id = n.id
      WHERE k.id IS NULL;</pre>
              <p><strong>2.</strong> Lebih besar jika ada nasabah dengan &gt;1 kredit (fan-out). Tepat sama hanya jika tiap nasabah punya <em>maksimal</em> 1 kredit (relasi 1-ke-0/1). Inilah tes fan-out tercepat: COUNT(*) setelah JOIN vs COUNT tabel kiri.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>INNER</strong> = irisan; <strong>LEFT</strong> = pertahankan kiri; <strong>FULL</strong> = rekonsiliasi.</li><li>Pilih JOIN = pilih <strong>siapa boleh hilang</strong> — keputusan bisnis.</li><li><strong>Fan-out:</strong> 1-ke-banyak menggandakan baris → agregat tabel-satu salah.</li><li><strong>Pola aman:</strong> agregasi dulu (subquery/CTE), baru join; COUNT(*) sebelum vs sesudah.</li><li><strong>Jangan:</strong> lupa ON; DISTINCT untuk menutupi fan-out.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c4-fungsi-tanggal-string" className="btn btn-secondary btn-sm">← ← C4</Link>
        <Link href="/learn/c6-subquery" className="btn btn-primary btn-sm">Next: C6 →</Link>
      </div>
    </div>
  );
}

import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C1SelectDasarPage() {
  const chart1 = [{"x": ["Jakarta", "Bandung", "Surabaya", "Medan"], "y": [4, 2, 2, 2], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["4", "2", "2", "2"], "textposition": "outside"}];
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
# Tampilkan nama & penghasilan nasabah Jakarta berpenghasilan > 8000000, urut menurun.
q("""SELECT nama, penghasilan FROM nasabah WHERE kota = 'Jakarta'""")`;
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
# 1) SELECT DISTINCT kota FROM nasabah  2) nama, status, dpd WHERE status = 'telat' OR status = 'macet' ORDER BY dpd DESC
q("""SELECT DISTINCT kota FROM nasabah""")`;
  const quizData = [{"question": "Urutan EKSEKUSI query yang benar…", "options": ["SELECT → FROM → WHERE", "FROM → WHERE → SELECT → ORDER BY → LIMIT", "WHERE → SELECT → FROM", "LIMIT → SELECT → FROM"], "correct": 1, "explanation": "Benar: FROM dulu (ambil tabel), WHERE (saring), baru SELECT (pilih kolom). Ini menjelaskan kenapa alias tak bisa di WHERE."}, {"question": "Query: SELECT nama FROM nasabah WHERE gaji_jt > 8 (gaji_jt alias di SELECT). Hasilnya…", "options": ["Berhasil", "Error — alias belum ada saat WHERE dieksekusi", "Hasil kosong", "Semua baris"], "correct": 1, "explanation": "Benar: WHERE jalan sebelum SELECT. Ulangi ekspresi atau pakai subquery (C6)."}, {"question": "LIMIT 5 tanpa ORDER BY menghasilkan…", "options": ["5 terbesar", "5 baris acak (urutan storage)", "Error", "5 pertama alfabetis"], "correct": 1, "explanation": "Benar: tanpa ORDER BY, &ldquo;top 5&rdquo; = undian. Selalu pasangkan dengan ORDER BY."}, {"question": "Kapan DISTINCT tepat dipakai?", "options": ["Untuk mempercepat query", "Untuk jaga-jaga", "Untuk daftar nilai unik (kota/kategori apa saja)", "Tidak pernah"], "correct": 2, "explanation": "Benar: daftar unik. Bukan untuk jaga-jaga — duplikat tak terduga biasanya gejala JOIN fan-out (C5)."}, {"question": "WHERE (a OR b) AND c vs WHERE a OR b AND c — bedanya…", "options": ["Sama saja", "AND dihitung dulu — tanpa kurung artinya a OR (b AND c)", "OR dihitung dulu", "Keduanya error"], "correct": 1, "explanation": "Benar: AND seperti ×, OR seperti +. Kurungkan agar maksud eksplisit."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C1 — SQL</span>
        <h1 className="display-title">SELECT: Bertanya ke Database<br/>dengan Bahasa Manusia</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Kasih Saya Data Nasabah Jakarta&rdquo;</a></li>
          <li><a href="#relasional">Model Relasional — Dunianya Tabel</a></li>
          <li><a href="#select">SELECT–FROM–WHERE — Tiga Kata Ajaib</a></li>
          <li><a href="#distinct">DISTINCT &amp; Alias — Merapikan Output</a></li>
          <li><a href="#eksekusi">Urutan Eksekusi — Ditulis Beda, Dijalankan Beda</a></li>
          <li><a href="#lab1">🔬 Lab 1: Query Pertama — Nasabah Jakarta</a></li>
          <li><a href="#lab2">🔬 Lab 2: DISTINCT &amp; Batasan WHERE</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Klausa Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: Daftar Prioritas Collection Pagi Ini</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>model relasional</strong>: tabel, baris, kolom, primary key.</li><li>Menulis query <strong>SELECT–FROM–WHERE–ORDER BY–LIMIT</strong> yang benar.</li><li>Memakai <strong>DISTINCT</strong> dan alias kolom.</li><li>Membedakan <strong>urutan tulis</strong> vs <strong>urutan eksekusi</strong> query.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Kasih Saya Data Nasabah Jakarta&rdquo;</h2>

      <div className="story"><p>Manajer cabang memintamu: <em>&ldquo;Kasih saya data nasabah Jakarta yang penghasilannya di atas 8 juta, urut dari yang terbesar. Saya butuh 5 menit lagi untuk rapat.&rdquo;</em></p><p>Tanpa SQL, kamu buka Excel 100.000 baris, filter manual, copy-paste — 20 menit dan rawan salah. Dengan SQL, satu query 4 baris menjawab dalam <strong>1 detik</strong> — dan bisa dipakai ulang selamanya.</p><p>SQL adalah <strong>skill #1 data analyst</strong> (semua riset job 2026 menaruhnya di puncak — di atas Python!). Lesson ini fondasinya: cara &ldquo;bertanya&rdquo; ke database.</p><p><strong>Twist-nya:</strong> query 4 baris mengalahkan 20 menit kerja manual — tapi kecepatan ini pedang bermata dua: query yang <em>salah</em> juga dieksekusi dalam 1 detik, ke 100.000 baris, tanpa ada yang sadar. SQL mempercepat jawaban benar <em>dan</em> jawaban salah dengan faktor yang sama. Kecepatan tanpa verifikasi = cara tercepat menyebarkan kesalahan ke seluruh rapat direksi.</p></div>

      <h2 id="relasional">Model Relasional — Dunianya Tabel</h2>

      <p><strong>Definisi.</strong> Database relasional menyimpan data sebagai <strong>tabel</strong>: <strong>baris</strong> (record) × <strong>kolom</strong> (field). Tiap tabel punya <strong>primary key</strong> — kolom yang unik per baris (misal <code className="inline">nasabah.id</code>).</p>

      <p><strong>Contoh</strong> tabel <code className="inline">nasabah</code> (10 baris, dipakai di semua lab lesson ini):</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>id</th><th>nama</th><th>kota</th><th>penghasilan</th><th>dpd</th><th>status</th></tr></thead>
<tbody>
<tr><td>1</td><td>Andi</td><td>Jakarta</td><td>8.500.000</td><td>0</td><td>lancar</td></tr>
<tr><td>2</td><td>Budi</td><td>Bandung</td><td>12.000.000</td><td>15</td><td>lancar</td></tr>
<tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
</tbody>
</table>
</div>

      <p><strong>Kepribadian SQL:</strong> SQL itu <strong>deklaratif</strong> — kamu bilang <em>apa</em> yang kamu mau (&ldquo;nasabah Jakarta&rdquo;), bukan <em>bagaimana</em> mencarinya (database yang optimasi). Beda dengan Python yang imperatif (langkah per langkah).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Hafalkan anatomi query dasar: <code className="inline">SELECT</code> (kolom apa) → <code className="inline">FROM</code> (dari tabel mana) → <code className="inline">WHERE</code> (baris mana) → <code className="inline">ORDER BY</code> (urut bagaimana) → <code className="inline">LIMIT</code> (berapa baris). Lima kata ini = 80% query sehari-hari.</p>
</div>

      <h2 id="select">SELECT–FROM–WHERE — Tiga Kata Ajaib</h2>

      <p>Query manajer cabang:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, kota, penghasilan
FROM nasabah
WHERE kota = &#x27;Jakarta&#x27; AND penghasilan &gt; 8000000
ORDER BY penghasilan DESC
LIMIT 5;</pre>

      <ul>
<li><code className="inline">SELECT nama, kota, penghasilan</code> — kolom yang ditampilkan (pakai <code className="inline">*</code> untuk semua, tapi hindari di produksi!).</li>
<li><code className="inline">FROM nasabah</code> — tabel sumber.</li>
<li><code className="inline">WHERE kota = 'Jakarta' AND penghasilan &gt; 8000000</code> — saring baris. String pakai <strong>kutip satu</strong>!</li>
<li><code className="inline">ORDER BY penghasilan DESC</code> — urut menurun (ASC = menaik, default).</li>
<li><code className="inline">LIMIT 5</code> — 5 baris teratas.</li>
</ul>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: nama &amp; dpd nasabah yang telat (dpd &gt; 0), urut dpd terbesar.</p><p><strong>Langkah 1</strong> — kolom: <code className="inline">SELECT nama, dpd</code></p><p><strong>Langkah 2</strong> — tabel: <code className="inline">FROM nasabah</code></p><p><strong>Langkah 3</strong> — saring: <code className="inline">WHERE dpd &gt; 0</code></p><p><strong>Langkah 4</strong> — urut: <code className="inline">ORDER BY dpd DESC</code></p><p>Hasil: Irfan 120, Eko 90, Citra 45, Gilang 30, Budi 15, Fitri 5.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;SELECT * tidak apa-apa untuk dipakai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Untuk eksplorasi cepat OK — tapi di query produksi/pipeline, <code className="inline">*</code> berbahaya: (1) mengambil kolom tak perlu (boros), (2) pecah jika skema berubah (kolom baru tiba-tiba ikut), (3) menyembunyikan maksud query. <strong>Selalu sebutkan kolom eksplisit</strong> di kode yang disimpan.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Operator WHERE: <code className="inline">=</code>, <code className="inline">&lt;&gt;</code> (tidak sama), <code className="inline">&gt;</code>, <code className="inline">&gt;=</code>, <code className="inline">AND</code>, <code className="inline">OR</code>, <code className="inline">NOT</code>. Kurungkan OR campuran: <code className="inline">WHERE (a OR b) AND c</code> — AND dihitung dulu seperti × dalam matematika!</p>
</div>

      <h2 id="distinct">DISTINCT &amp; Alias — Merapikan Output</h2>

      <p><code className="inline">DISTINCT</code> membuang duplikat:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT DISTINCT kota FROM nasabah;</pre>

      <p>Hasil: Jakarta, Bandung, Surabaya, Medan (4 baris, bukan 10). <strong>Alias</strong> memberi nama baru ke kolom:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama AS nama_nasabah,
       penghasilan / 1000000 AS gaji_jt
FROM nasabah;</pre>

      <p><strong>Kapan dipakai:</strong> DISTINCT untuk &ldquo;daftar unik&rdquo; (kota apa saja? kategori apa saja?); alias agar output terbaca (<code className="inline">gaji_jt</code> lebih jelas dari <code className="inline">penghasilan / 1000000</code>).</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;DISTINCT mempercepat query.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Justru sebaliknya — DISTINCT butuh sorting/dedup tambahan. Jangan pakai &ldquo;untuk jaga-jaga&rdquo;. Jika hasilmu berduplikat padahal seharusnya tidak, <strong>akar masalahnya biasanya JOIN yang fan-out</strong> (C5!) — DISTINCT hanya menutupi gejala.</p>
</div>

      <h2 id="eksekusi">Urutan Eksekusi — Ditulis Beda, Dijalankan Beda</h2>

      <p>Kamu menulis: SELECT → FROM → WHERE → ORDER BY. Database menjalankan:</p>

      <p><Tex math={String.raw`\text{FROM} \;\to\; \text{WHERE} \;\to\; \text{SELECT} \;\to\; \text{ORDER BY} \;\to\; \text{LIMIT}`} block /></p>

      <p><strong>Mengapa penting?</strong> Karena alias yang didefinisikan di SELECT <strong>tidak bisa</strong> dipakai di WHERE (WHERE jalan duluan!) — tapi <strong>bisa</strong> dipakai di ORDER BY. Error klasik pemula:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SALAH: gaji_jt belum ada saat WHERE dieksekusi
SELECT penghasilan/1000000 AS gaji_jt
FROM nasabah
WHERE gaji_jt &gt; 8;  -- ERROR!

-- BENAR: ulangi ekspresi, atau pakai subquery (C6)
SELECT penghasilan/1000000 AS gaji_jt
FROM nasabah
WHERE penghasilan/1000000 &gt; 8;</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Hafalkan urutan eksekusi — ia menjelaskan 50% error &ldquo;aneh&rdquo; SQL: kenapa alias tak bisa di WHERE, kenapa agregasi tak bisa di WHERE (butuh HAVING — C3), kenapa window function tak bisa di WHERE (C9).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Nasabah per Kota (SELECT kota, COUNT(*) ... GROUP BY)"
  layout={{"xaxis": {"title": "Kota"}, "yaxis": {"title": "Jumlah nasabah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = kota (hasil DISTINCT), tinggi batang = jumlah nasabah. (Query agregasi = topik C3 — ini bocoran!)</p>
<p><strong>Interpretasi:</strong> Jakarta dominan (40%). Chart seperti ini = jawaban visual dari &ldquo;sebaran nasabah bagaimana?&rdquo; — query 2 baris + chart menjawab pertanyaan bisnis dalam 1 menit.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Untuk tiap kasus: baca soalnya, <em>tebak outputnya</em>, baru buka pembahasan.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Filter bertingkat — siapa yang lolos?</summary>
              <p>Tabel <code className="inline">nasabah</code>. Tampilkan nama &amp; kota nasabah yang (kotanya Jakarta ATAU Surabaya) DAN penghasilannya &gt; 10 juta, urut dari penghasilan terbesar, 3 teratas.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, kota, penghasilan
      FROM nasabah
      WHERE (kota = &#x27;Jakarta&#x27; OR kota = &#x27;Surabaya&#x27;)
        AND penghasilan &gt; 10000000
      ORDER BY penghasilan DESC
      LIMIT 3;</pre>
              <p><strong>Bedah:</strong> kurung di OR <strong>wajib</strong> — tanpa kurung, AND diikat lebih dulu (<code className="inline">kota=&#x27;Jakarta&#x27; OR (kota=&#x27;Surabaya&#x27; AND penghasilan&gt;10jt)</code>) dan hasilnya beda! Urutan evaluasi: kurung → AND → OR.</p>
              <p><strong>Output (contoh):</strong> Dewi–Jakarta–25jt, Andi–Surabaya–18jt, Sari–Jakarta–15jt.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: ORDER BY dua kolom — peringkat yang benar</summary>
              <p>Urutkan nasabah: dpd terbesar dulu; jika dpd sama, penghasilan terkecil dulu (prioritas collection: yang paling telat &amp; paling tidak mampu).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, dpd, penghasilan
      FROM nasabah
      WHERE dpd &gt; 0
      ORDER BY dpd DESC, penghasilan ASC;</pre>
              <p><strong>Bedah:</strong> kolom kedua hanya memutus seri di kolom pertama. Irfan (dpd 120) tetap di atas Eko (dpd 90) apapun penghasilannya — <code className="inline">penghasilan ASC</code> hanya mengurutkan di dalam dpd yang sama.</p>
              <p><strong>Jebakan:</strong> <code className="inline">ORDER BY dpd, penghasilan DESC</code> tanpa DESC/ASC eksplisit = dpd ASC (menaik) — prioritas collection terbalik! Selalu tulis arahnya eksplisit.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: LIMIT tanpa ORDER BY — undian</summary>
              <p><code className="inline">SELECT nama FROM nasabah WHERE kota = &#x27;Jakarta&#x27; LIMIT 5;</code> — apakah hasilnya selalu sama tiap dijalankan?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- TIDAK dijamin sama! Tanpa ORDER BY, database bebas
      -- mengembalikan 5 baris mana saja (tergantung index, cache, dll).
      SELECT nama FROM nasabah
      WHERE kota = &#x27;Jakarta&#x27;
      ORDER BY nama   -- baru deterministik
      LIMIT 5;</pre>
              <p><strong>Bedah:</strong> tabel SQL = <em>himpunan</em>, bukan daftar — tidak ada &ldquo;urutan alami&rdquo;. LIMIT tanpa ORDER BY = &ldquo;5 baris sembarang&rdquo;. Untuk laporan yang konsisten (apalagi pagination!), ORDER BY wajib mendampingi LIMIT.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Query Pertama — Nasabah Jakarta</h2>

      <p>Database <code className="inline">nasabah</code> sudah dimuat (10 baris). Tulis query untuk: nama &amp; penghasilan nasabah Jakarta dengan penghasilan &gt; 8 juta, urut terbesar.</p>

      <PyodideLab
  title="Lab 1 — SELECT/WHERE/ORDER BY (Live SQL)"
  hint="Ubah jadi: semua kota, tapi hanya yang dpd = 0. Lalu coba ORDER BY nama ASC."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, penghasilan
FROM nasabah
WHERE kota = &#x27;Jakarta&#x27; AND penghasilan &gt; 8000000
ORDER BY penghasilan DESC;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: DISTINCT &amp; Batasan WHERE</h2>

      <p>Tampilkan daftar kota unik, lalu: nasabah yang statusnya 'telat' ATAU 'macet', urut berdasarkan dpd terbesar.</p>

      <PyodideLab
  title="Lab 2 — Kota Unik &amp; Status"
  hint="Coba: WHERE NOT status = 'lancar'. Sama hasilnya? (Hati-hati NULL — topik C2!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1)
SELECT DISTINCT kota FROM nasabah;

-- 2)
SELECT nama, status, dpd
FROM nasabah
WHERE status = &#x27;telat&#x27; OR status = &#x27;macet&#x27;
ORDER BY dpd DESC;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Klausa Mana?</h2>

      <div className="decision-card">
<h3>1. Mau kolom tertentu → <strong>SELECT kolom</strong></h3>
<p><strong>Kondisi data:</strong> Tidak butuh semua kolom.</p>
<p><strong>Kenapa:</strong> Eksplisit, hemat, anti-pecah saat skema berubah.</p>
<p><strong>Contoh nyata:</strong> SELECT nama, penghasilan (bukan *).</p>
</div>

      <div className="decision-card">
<h3>2. Mau baris tertentu → <strong>WHERE</strong></h3>
<p><strong>Kondisi data:</strong> Filter berdasar nilai kolom.</p>
<p><strong>Kenapa:</strong> Dieksekusi sebelum SELECT — alias belum tersedia.</p>
<p><strong>Contoh nyata:</strong> WHERE kota = 'Jakarta' AND dpd &gt; 0.</p>
</div>

      <div className="decision-card">
<h3>3. Mau daftar unik → <strong>DISTINCT</strong></h3>
<p><strong>Kondisi data:</strong> Hilangkan duplikat.</p>
<p><strong>Kenapa:</strong> Satu kata, tapi ada biaya sorting — jangan untuk jaga-jaga.</p>
<p><strong>Contoh nyata:</strong> SELECT DISTINCT kota.</p>
</div>

      <div className="decision-card">
<h3>4. Mau urutan / batasi → <strong>ORDER BY + LIMIT</strong></h3>
<p><strong>Kondisi data:</strong> Top-N, sampel cepat.</p>
<p><strong>Kenapa:</strong> ORDER BY tanpa LIMIT mengurut semua (mahal); LIMIT tanpa ORDER BY = acak!</p>
<p><strong>Contoh nyata:</strong> ORDER BY penghasilan DESC LIMIT 5.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Tulis: SELECT → FROM → WHERE → ORDER BY → LIMIT. Ingat eksekusi: FROM → WHERE → SELECT.</li><li>String = kutip satu. AND sebelum OR (kurungkan!).</li><li>LIMIT tanpa ORDER BY = sampel acak — jangan untuk &ldquo;top&rdquo; apapun.</li><li>Sebutkan kolom eksplisit, jangan *.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Daftar Prioritas Collection Pagi Ini</h2>

      <div className="callout">
<p>Tim collection butuh daftar pagi ini: <em>nama, kota, dpd</em> nasabah dengan status 'telat' atau 'macet', urut dpd terbesar, 5 teratas saja — untuk ditelepon pertama.</p><p><strong>Pertanyaan:</strong> tulis query-nya. Lalu: apa risiko jika lupa ORDER BY?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">SELECT nama, kota, dpd FROM nasabah WHERE status IN ('telat','macet') ORDER BY dpd DESC LIMIT 5;</code></p><p>Hasil: Irfan 120, Eko 90, Citra 45, Gilang 30, Budi 15.</p><p><strong>Risiko lupa ORDER BY:</strong> LIMIT 5 tanpa ORDER BY mengambil 5 baris <em>acak</em> (urutan storage) — tim menelepon nasabah yang salah sementara yang macet 120 hari tidak dihubungi. <strong>Pelajaran:</strong> LIMIT tanpa ORDER BY bukan &ldquo;top&rdquo; — ia undian.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Tulis query-nya dulu, baru cek. Target: 10–12 menit.</p>
            <ol>
              <li>Tampilkan <code className="inline">nama, penghasilan</code> nasabah kota Bandung dengan penghasilan antara 5–15 juta (inklusif), urut penghasilan menaik.</li>
              <li>Tampilkan 10 nasabah dengan dpd terbesar, tapi hanya kolom <code className="inline">nama, dpd</code>.</li>
              <li>Apa output <code className="inline">WHERE kota = &#x27;Jakarta&#x27; OR kota = &#x27;Surabaya&#x27; AND dpd &gt; 0</code>? Tuliskan dengan kurung eksplisit sesuai urutan evaluasi SQL.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1.
      SELECT nama, penghasilan FROM nasabah
      WHERE kota = &#x27;Bandung&#x27; AND penghasilan BETWEEN 5000000 AND 15000000
      ORDER BY penghasilan ASC;
      -- 2.
      SELECT nama, dpd FROM nasabah
      ORDER BY dpd DESC LIMIT 10;</pre>
              <p><strong>3.</strong> AND diikat dulu: <code className="inline">kota = &#x27;Jakarta&#x27; OR (kota = &#x27;Surabaya&#x27; AND dpd &gt; 0)</code> — semua nasabah Jakarta (dpd berapapun!) + nasabah Surabaya yang telat. Jika maksudmu &ldquo;(Jakarta atau Surabaya) yang telat&rdquo;, kurungnya wajib di OR.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Model relasional:</strong> tabel = baris × kolom; primary key unik per baris.</li><li><strong>Lima kata:</strong> SELECT (kolom) → FROM (tabel) → WHERE (baris) → ORDER BY → LIMIT.</li><li><strong>Eksekusi:</strong> FROM → WHERE → SELECT — alias tak bisa di WHERE.</li><li><strong>DISTINCT</strong> untuk unik; <strong>alias</strong> untuk keterbacaan.</li><li><strong>Jangan:</strong> SELECT * di produksi; LIMIT tanpa ORDER BY; DISTINCT untuk jaga-jaga.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b17-bayesian-praktis" className="btn btn-secondary btn-sm">← ← B17</Link>
        <Link href="/learn/c2-null-logika" className="btn btn-primary btn-sm">Next: C2 →</Link>
      </div>
    </div>
  );
}

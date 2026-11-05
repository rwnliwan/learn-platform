import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C8UnionSetPage() {
  const chart1 = [{"x": ["UNION", "UNION ALL"], "y": [18, 20], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "text": ["18 (2 duplikat dibuang)", "20 (apa adanya)"], "textposition": "outside"}];
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
# SELECT nama, kota FROM nasabah WHERE kota='Jakarta' UNION ALL SELECT nama, kota FROM nasabah WHERE kota<>'Jakarta'
q("""SELECT nama, kota FROM nasabah WHERE kota = 'Jakarta'""")`;
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
# SELECT id FROM nasabah WHERE dpd > 0 EXCEPT SELECT DISTINCT nasabah_id FROM kredit
q("""SELECT id, nama, dpd FROM nasabah WHERE dpd > 0""")`;
  const quizData = [{"question": "UNION vs UNION ALL: bedanya…", "options": ["Tidak ada", "UNION buang duplikat (lebih lambat); UNION ALL apa adanya (cepat)", "UNION ALL buang duplikat", "UNION hanya untuk angka"], "correct": 1, "explanation": "Benar. Default UNION ALL kecuali butuh dedup."}, {"question": "Syarat UNION: kolom harus…", "options": ["Sama nama", "Sejajar: jumlah sama, tipe kompatibel, urutan sama", "Bebas", "Harus primary key"], "correct": 1, "explanation": "Benar: sejajar. Nama hasil ikut SELECT pertama."}, {"question": "Nasabah yang ada di sistem lama tapi belum di baru…", "options": ["UNION", "INTERSECT", "EXCEPT (lama EXCEPT baru)", "JOIN"], "correct": 2, "explanation": "Benar: selisih = EXCEPT. Pola audit migrasi."}, {"question": "ORDER BY pada query UNION…", "options": ["Di tiap SELECT", "Hanya di akhir (untuk gabungan)", "Tidak boleh", "Otomatis"], "correct": 1, "explanation": "Benar: di akhir. Bungkus kurung jika perlu ORDER BY per SELECT."}, {"question": "Mau &ldquo;daftar kota dari 2 tabel&rdquo; (entitas sama)…", "options": ["JOIN", "UNION", "EXISTS", "CASE"], "correct": 1, "explanation": "Benar: menumpuk = UNION. Menyambung kolom = JOIN."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C8 — SQL</span>
        <h1 className="display-title">UNION &amp; Operasi Himpunan:<br/>Menumpuk, Bukan Menyambung</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Sistem, Satu Laporan</a></li>
          <li><a href="#union">UNION vs UNION ALL</a></li>
          <li><a href="#intersect">INTERSECT &amp; EXCEPT — Irisan dan Selisih</a></li>
          <li><a href="#union-vs-join">UNION vs JOIN — Jangan Tertukar</a></li>
          <li><a href="#lab1">🔬 Lab 1: Menumpuk Dua Daftar</a></li>
          <li><a href="#lab2">🔬 Lab 2: Temukan yang Hilang</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Operasi Himpunan</a></li>
          <li><a href="#case">📋 Mini-Case: Audit Migrasi Sistem</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Membedakan <strong>UNION vs UNION ALL</strong> — dan kapan dedup diinginkan.</li><li>Memakai <strong>INTERSECT</strong> dan <strong>EXCEPT</strong> untuk irisan &amp; selisih.</li><li>Menjelaskan syarat <strong>kolom sejajar</strong> (jumlah &amp; tipe).</li><li>Memilih <strong>UNION vs JOIN</strong> dengan benar.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Dua Sistem, Satu Laporan</h2>

      <div className="story"><p>Bank hasil merger: data nasabah ada di <strong>dua sistem</strong> (core banking lama + sistem baru) dengan struktur tabel sama. Direksi minta &ldquo;satu daftar nasabah&rdquo;. JOIN? Salah — tidak ada relasi antar baris; yang dibutuhkan adalah <strong>menumpuk</strong> dua daftar menjadi satu.</p><p>UNION menumpuk baris; JOIN menyambung kolom. Tertukar = hasil kacau. Lesson pendek tapi penting ini memastikan kamu tidak tertukar.</p><p><strong>Twist-nya:</strong> UNION dan JOIN keduanya &ldquo;menggabungkan&rdquo; — tapi satu menumpuk <em>baris</em>, satu menyambung <em>kolom</em>. Tertukar = bukan error, melainkan hasil yang terlihat masuk akal tapi salah total. SQL jarang berteriak saat kamu salah; ia patuh mengerjakan perintah yang salah. Lesson &ldquo;pendek&rdquo; ini mencegah kesalahan yang masa berlakunya panjang.</p></div>

      <h2 id="union">UNION vs UNION ALL</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- tumpuk + buang duplikat
SELECT nama, kota FROM nasabah_lama
UNION
SELECT nama, kota FROM nasabah_baru;

-- tumpuk apa adanya (lebih cepat!)
SELECT nama, kota FROM nasabah_lama
UNION ALL
SELECT nama, kota FROM nasabah_baru;</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>UNION</th><th>UNION ALL</th></tr></thead>
<tbody>
<tr><td>Duplikat</td><td>Dibuang</td><td>Dipertahankan</td></tr>
<tr><td>Kecepatan</td><td>Lebih lambat (sort/dedup)</td><td>Lebih cepat</td></tr>
<tr><td>Kapan</td><td>Daftar unik gabungan</td><td>Gabung log/partisi; hitung total</td></tr>
</tbody>
</table>
</div>

      <p><strong>Syarat:</strong> jumlah kolom <strong>sama</strong>, tipe <strong>kompatibel</strong>, urutan <strong>sejajar</strong>. Nama kolom hasil = dari SELECT pertama.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;UNION dan UNION ALL sama saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda hasil DAN beda cepat! UNION menduplikat-buang (butuh sort) — jika datamu memang tak berduplikat (misal partisi bulanan), UNION ALL jauh lebih cepat. <strong>Default: UNION ALL</strong> kecuali kamu butuh dedup. Kebanyakan bug &ldquo;kok jumlahnya kurang&rdquo; berasal dari UNION yang membuang duplikat sah!</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> ORDER BY/LIMIT hanya di AKHIR (berlaku untuk gabungan): <code className="inline">... UNION ALL ... ORDER BY nama LIMIT 10</code>. Bungkus tiap SELECT dengan tanda kurung jika perlu ORDER BY sendiri.</p>
</div>

      <h2 id="intersect">INTERSECT &amp; EXCEPT — Irisan dan Selisih</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- nasabah yang ADA di kedua sistem (irisan)
SELECT id FROM nasabah_lama
INTERSECT
SELECT id FROM nasabah_baru;

-- nasabah yang HANYA di sistem lama (selisih)
SELECT id FROM nasabah_lama
EXCEPT
SELECT id FROM nasabah_baru;</pre>

      <ul>
<li><strong>INTERSECT:</strong> &ldquo;yang ada di keduanya&rdquo; — untuk rekonsiliasi/cocok.</li>
<li><strong>EXCEPT:</strong> &ldquo;yang ada di A tapi tidak di B&rdquo; — untuk temukan yang hilang/migrasi belum selesai.</li>
<li><strong>Catatan SQLite:</strong> EXCEPT (bukan MINUS seperti Oracle).</li>
</ul>

      <p><strong>Kasus nyata:</strong> setelah migrasi, <code className="inline">EXCEPT</code> menemukan 37 nasabah yang belum pindah sistem — tanpa ini, mereka hilang dari layanan!</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola audit migrasi: <code className="inline">(A EXCEPT B)</code> = hilang; <code className="inline">(B EXCEPT A)</code> = baru tak terduga; <code className="inline">(A UNION B) vs (A INTERSECT B)</code> = cakupan. Tiga query = audit migrasi lengkap.</p>
</div>

      <h2 id="union-vs-join">UNION vs JOIN — Jangan Tertukar</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>UNION</th><th>JOIN</th></tr></thead>
<tbody>
<tr><td>Arah</td><td>Vertikal (tumpuk baris)</td><td>Horizontal (sambung kolom)</td></tr>
<tr><td>Syarat</td><td>Kolom sejajar</td><td>Kunci relasi (ON)</td></tr>
<tr><td>Baris hasil</td><td>Jumlah dijumlah</td><td>Dikalikan (fan-out!)</td></tr>
<tr><td>Contoh</td><td>Gabung 2 sistem</td><td>Nasabah + kreditnya</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SALAH: mau menumpuk malah join (hasil kacau)
-- BENAR: menumpuk daftar kota dari dua tabel
SELECT kota FROM nasabah
UNION
SELECT kota FROM kantor_cabang;</pre>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;UNION bisa menggantikan JOIN.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak — mereka ortogonal. Butuh kolom dari dua tabel yang berelasi? JOIN. Butuh baris dari dua tabel sejenis? UNION. Jika ragumu &ldquo;pakai yang mana&rdquo;, tanyakan: &ldquo;apakah baris-baris ini entitas yang sama?&rdquo; Ya → UNION; tidak → JOIN.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="UNION vs UNION ALL: 2 Baris Hilang?"
  layout={{"yaxis": {"title": "Baris hasil"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua sistem masing-masing 10 nasabah, 2 orang ada di keduanya.</p>
<p><strong>Interpretasi:</strong> UNION = 18 (dedup), UNION ALL = 20 (apa adanya). <strong>Mana yang benar?</strong> Tergantung pertanyaan! &ldquo;Berapa nasabah unik?&rdquo; → 18. &ldquo;Berapa total record untuk rekonsiliasi?&rdquo; → 20. Pilih berdasar <em>pertanyaan</em>, bukan kebiasaan.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. UNION menumpuk <em>baris</em>; JOIN menyambung <em>kolom</em>.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Merger — satu daftar nasabah</summary>
              <p><code className="inline">nasabah_lama(id, nama, kota)</code> 60rb baris; <code className="inline">nasabah_baru(id, nama, kota)</code> 40rb baris. Buat daftar gabungan tanpa duplikat.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT id, nama, kota FROM nasabah_lama
      UNION          -- bukan UNION ALL: buang duplikat antar sistem!
      SELECT id, nama, kota FROM nasabah_baru;</pre>
              <p><strong>Bedah:</strong> UNION (implisit DISTINCT) = 100rb − duplikat. UNION ALL = tepat 100rb (lebih cepat — tanpa sort-dedupe). Pilih: butuh dedupe? UNION. Sudah pasti unik / butuh semua baris? UNION ALL. <strong>Syarat:</strong> jumlah kolom sama &amp; tipe kompatibel — nama kolom diambil dari SELECT pertama.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: INTERSECT — &ldquo;yang ada di kedua daftar&rdquo;</summary>
              <p>Siapa nasabah yang telat (dpd &gt; 0) DAN punya kredit macet?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nasabah_id FROM nasabah WHERE dpd &gt; 0
      INTERSECT
      SELECT nasabah_id FROM kredit WHERE status = &#x27;macet&#x27;;</pre>
              <p><strong>Bedah:</strong> INTERSECT = irisan dua himpunan hasil query. Alternatif: INNER JOIN atau EXISTS — sering lebih cepat (INTERSECT butuh sort-dedupe dua sisi). Pakai INTERSECT saat logikanya memang &ldquo;irisan dua daftar&rdquo; agar terbaca jelas.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: EXCEPT — &ldquo;yang belum pernah&rdquo;</summary>
              <p>Nasabah yang <em>belum pernah</em> transaksi tahun ini (target kampanye aktivasi).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT id FROM nasabah
      EXCEPT
      SELECT DISTINCT nasabah_id FROM transaksi
      WHERE tanggal &gt;= &#x27;2026-01-01&#x27;;</pre>
              <p><strong>Bedah:</strong> EXCEPT = selisih himpunan. <strong>Awas NULL:</strong> EXCEPT memperlakukan NULL = NULL (sama!) — beda dengan = yang UNKNOWN. Alternatif anti-join (NOT EXISTS) ekuivalen &amp; biasanya lebih cepat di data besar.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Menumpuk Dua Daftar</h2>

      <p>Buat dua &ldquo;sistem&rdquo;: nasabah Jakarta vs nasabah non-Jakarta. Tumpuk dengan UNION ALL, hitung baris. Lalu UNION — ada beda?</p>

      <PyodideLab
  title="Lab 1 — UNION vs UNION ALL"
  hint="Ganti jadi UNION. Kenapa hasilnya sama di sini? (Kapan beda?)"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- UNION ALL: 10 baris (4 + 6)
SELECT nama, kota FROM nasabah WHERE kota = &#x27;Jakarta&#x27;
UNION ALL
SELECT nama, kota FROM nasabah WHERE kota &lt;&gt; &#x27;Jakarta&#x27;;
-- UNION: sama (tak ada duplikat antar partisi yang saling lepas)</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Temukan yang Hilang</h2>

      <p>Nasabah dengan dpd &gt; 0 vs nasabah yang punya kredit: siapa yang ber-dpd tapi <strong>tidak punya</strong> kredit? (Pakai EXCEPT.)</p>

      <PyodideLab
  title="Lab 2 — EXCEPT untuk Audit"
  hint="Balik: kredit yang nasabah_id-nya tidak ada di nasabah (orphan!) — temukan dengan EXCEPT."
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- ber-dpd tapi tanpa kredit:
SELECT id, nama FROM nasabah WHERE dpd &gt; 0
EXCEPT
SELECT n.id, n.nama FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;
-- catatan: EXCEPT membandingkan semua kolom SELECT; samakan kolomnya!</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Operasi Himpunan</h2>

      <div className="decision-card">
<h3>1. Tumpuk daftar sejenis → <strong>UNION ALL</strong> (default)</h3>
<p><strong>Kondisi data:</strong> Gabung partisi/sistem.</p>
<p><strong>Kenapa:</strong> Cepat, apa adanya. Syarat: kolom sejajar.</p>
<p><strong>Contoh nyata:</strong> Nasabah sistem lama + baru.</p>
</div>

      <div className="decision-card">
<h3>2. Butuh unik → <strong>UNION</strong></h3>
<p><strong>Kondisi data:</strong> Dedup diinginkan.</p>
<p><strong>Kenapa:</strong> Buang duplikat (ada biaya sort).</p>
<p><strong>Contoh nyata:</strong> Daftar kota unik dari 2 tabel.</p>
</div>

      <div className="decision-card">
<h3>3. Ada di keduanya → <strong>INTERSECT</strong></h3>
<p><strong>Kondisi data:</strong> Irisan.</p>
<p><strong>Kenapa:</strong> Rekonsiliasi kecocokan.</p>
<p><strong>Contoh nyata:</strong> Nasabah di kedua sistem.</p>
</div>

      <div className="decision-card">
<h3>4. Hilang di satu sisi → <strong>EXCEPT</strong></h3>
<p><strong>Kondisi data:</strong> Selisih.</p>
<p><strong>Kenapa:</strong> Audit migrasi; temukan yang hilang.</p>
<p><strong>Contoh nyata:</strong> Belum pindah sistem.</p>
</div>

      <div className="decision-card">
<h3>5. Ragu UNION vs JOIN → <strong>tanya entitasnya</strong></h3>
<p><strong>Kondisi data:</strong> Beda arah.</p>
<p><strong>Kenapa:</strong> Entitas sama → UNION; berelasi → JOIN.</p>
<p><strong>Contoh nyata:</strong> Lihat tabel di atas.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Default UNION ALL; UNION hanya jika butuh dedup.</li><li>Kolom harus sejajar (jumlah, tipe, urutan).</li><li>ORDER BY/LIMIT di akhir gabungan.</li><li>EXCEPT = alat audit &ldquo;yang hilang&rdquo;.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Audit Migrasi Sistem</h2>

      <div className="callout">
<p>Bank migrasi 10.000 nasabah ke sistem baru. Tes: <code className="inline">SELECT COUNT(*) FROM lama EXCEPT ...</code> — salah, EXCEPT tidak untuk COUNT! Bagaimana audit yang benar?</p><p><strong>Pertanyaan:</strong> tulis 3 query audit: (a) yang hilang, (b) yang baru tak terduga, (c) total unik.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <code className="inline">SELECT id FROM lama EXCEPT SELECT id FROM baru;</code> (b) <code className="inline">SELECT id FROM baru EXCEPT SELECT id FROM lama;</code> (c) <code className="inline">SELECT COUNT(*) FROM (SELECT id FROM lama UNION SELECT id FROM baru);</code></p><p><strong>Pelajaran:</strong> EXCEPT bekerja pada <em>himpunan baris</em>, bukan angka. Tiga query ini = template audit setiap migrasi/ELT. Simpan sebagai snippet!</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Gabungkan email dari <code className="inline">nasabah_lama</code> dan <code className="inline">nasabah_baru</code> — satu daftar unik.</li>
              <li>Mengapa <code className="inline">SELECT nama FROM a UNION SELECT kota FROM b</code> &ldquo;jalan&rdquo; tapi hasilnya sampah?</li>
              <li>Kapan UNION ALL <em>wajib</em> dipakai meski ada duplikat? (Petunjuk: hitung total.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1.
      SELECT email FROM nasabah_lama
      UNION
      SELECT email FROM nasabah_baru;  -- kolom: 1 &amp; 1, tipe sama -&gt; OK</pre>
              <p><strong>2.</strong> Syarat UNION hanya &ldquo;jumlah kolom &amp; tipe kompatibel&rdquo; — <em>makna</em> kolom tidak dicek! Nama orang tercampur nama kota dalam satu kolom &ldquo;nama&rdquo;. SQL patuh pada sintaks, bukan pada maksudmu.</p>
              <p><strong>3.</strong> Saat menghitung <em>total</em> (mis. total transaksi dua sistem): UNION membuang duplikat &ldquo;sejati&rdquo; (dua transaksi identik yang memang terjadi 2×!) → total salah. UNION ALL mempertahankan semua baris. Aturan: agregasi setelah gabung → UNION ALL dulu, dedupe belakangan jika perlu.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>UNION ALL</strong> (default, cepat) vs <strong>UNION</strong> (dedup, lambat).</li><li><strong>INTERSECT</strong> = irisan; <strong>EXCEPT</strong> = selisih (alat audit).</li><li><strong>Syarat:</strong> kolom sejajar; ORDER BY/LIMIT di akhir.</li><li><strong>UNION</strong> = tumpuk baris (vertikal); <strong>JOIN</strong> = sambung kolom (horizontal).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c7-cte" className="btn btn-secondary btn-sm">← ← C7</Link>
        <Link href="/learn/c9-window-functions-1" className="btn btn-primary btn-sm">Next: C9-1 →</Link>
      </div>
    </div>
  );
}

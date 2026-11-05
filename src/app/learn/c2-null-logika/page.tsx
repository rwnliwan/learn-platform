import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C2NullLogikaPage() {
  const chart1 = [{"x": ["lancar", "ringan (1-30)", "sedang (31-90)", "berat (>90)", "NULL dpd"], "y": [4, 2, 2, 2, 0], "type": "bar", "marker": {"color": ["#34a853", "#e8a838", "#f97316", "#ef4444", "#94a3b8"]}, "text": ["4", "2", "2", "2", "0"], "textposition": "outside"}];
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
# 1) COUNT(*) vs COUNT(penghasilan). 2) Tampilkan Eko via IS NULL. 3) Tampilkan semua dengan COALESCE(penghasilan,0).
q("""SELECT COUNT(*) AS semua, COUNT(penghasilan) AS ada_gaji FROM nasabah""")`;
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
# SELECT nama, dpd, CASE ... END AS bucket FROM nasabah ORDER BY dpd DESC
q("""SELECT nama, dpd FROM nasabah ORDER BY dpd DESC""")`;
  const quizData = [{"question": "SELECT * FROM nasabah WHERE penghasilan = NULL menghasilkan…", "options": ["Baris Eko", "Semua baris", "Kosong — harus IS NULL", "Error sintaks"], "correct": 2, "explanation": "Benar: = NULL → UNKNOWN → tersaring semua. Pakai IS NULL."}, {"question": "COUNT(*) vs COUNT(penghasilan) pada data ada 1 NULL…", "options": ["Sama", "COUNT(*) lebih besar 1", "COUNT(penghasilan) lebih besar", "Keduanya error"], "correct": 1, "explanation": "Benar: COUNT(*) hitung baris, COUNT(kolom) lewatkan NULL. Selisihnya = jumlah NULL."}, {"question": "WHERE NOT (penghasilan > 10000000) untuk Eko (NULL)…", "options": ["Lolos (TRUE)", "Tersaring (UNKNOWN)", "Error", "Jadi 0"], "correct": 1, "explanation": "Benar: NOT UNKNOWN = UNKNOWN → tersaring. &ldquo;Tidak (di atas)&rdquo; ≠ &ldquo;di bawah&rdquo; saat ada NULL."}, {"question": "x NOT IN (1, 2, NULL). Hasilnya…", "options": ["Semua kecuali 1,2", "Kosong — NULL meracuni", "Hanya NULL", "Error"], "correct": 1, "explanation": "Benar: NOT IN + NULL = tidak ada yang lolos. Bug klasik diam-diam."}, {"question": "CASE WHEN dievaluasi…", "options": ["Acak", "Berurutan — WHEN pertama yang cocok menang", "Dari bawah", "Paralel"], "correct": 1, "explanation": "Benar: seperti IF-ELSE. Urutan WHEN menentukan hasil untuk kondisi tumpang tindih."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C2 — SQL</span>
        <h1 className="display-title">NULL: Ketidakhadiran yang<br/>Punya Aturan Sendiri</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Nasabah &ldquo;Hilang&rdquo; dari Laporan</a></li>
          <li><a href="#null">NULL — &ldquo;Tidak Tahu&rdquo;, Bukan Nol</a></li>
          <li><a href="#logika3">Logika 3-Nilai — TRUE / FALSE / UNKNOWN</a></li>
          <li><a href="#like">LIKE, IN, BETWEEN — Filter Ekspresif</a></li>
          <li><a href="#case">CASE — IF-nya SQL</a></li>
          <li><a href="#lab1">🔬 Lab 1: Berburu NULL</a></li>
          <li><a href="#lab2">🔬 Lab 2: CASE Bucket DPD</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Menangani Nilai Spesial</a></li>
          <li><a href="#case">📋 Mini-Case: Laporan yang Kehilangan Eko</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>NULL</strong> (unknown) vs 0 vs string kosong — dan mengapa <code className="inline">= NULL</code> selalu salah.</li><li>Menerapkan <strong>logika 3-nilai</strong> (TRUE/FALSE/UNKNOWN) pada WHERE.</li><li>Memakai <strong>COALESCE</strong> untuk nilai pengganti yang aman.</li><li>Memakai <strong>LIKE, IN, BETWEEN, CASE</strong> untuk filter &amp; kategorisasi.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Nasabah &ldquo;Hilang&rdquo; dari Laporan</h2>

      <div className="story"><p>Analis membuat laporan: <em>&ldquo;nasabah dengan penghasilan di bawah 10 juta&rdquo;</em> — query <code className="inline">WHERE penghasilan &lt; 10000000</code>. Laporan rapi: 6 nasabah. Tapi Eko (penghasilan <strong>NULL</strong> — belum diinput) tidak muncul. Juga tidak muncul di laporan &ldquo;di atas 10 juta&rdquo;. <strong>Eko hilang dari kedua laporan!</strong></p><p>NULL bukan nol, bukan kosong — ia &ldquo;tidak tahu&rdquo;. Dan &ldquo;tidak tahu &lt; 10 juta&rdquo; hasilnya bukan TRUE/FALSE melainkan <strong>UNKNOWN</strong> — yang disaring keluar oleh WHERE. Setiap analis pasti pernah kehilangan data karena NULL. Lesson ini memastikan kamu tidak mengulanginya.</p><p><strong>Twist-nya:</strong> Eko hilang dari <em>dua</em> laporan yang saling melengkapi (&ldquo;di bawah 10 juta&rdquo; + &ldquo;di atas 10 juta&rdquo;) — dua laporan yang &ldquo;mencakup semua&rdquo; ternyata tidak mencakup semua. NULL adalah lubang di logika ya/tidak: ada wilayah ketiga bernama &ldquo;tidak tahu&rdquo;, dan WHERE diam-diam membuangnya. Setiap &ldquo;laporan lengkap&rdquo; yang kamu buat sebelum lesson ini mungkin punya lubang yang sama.</p></div>

      <h2 id="null">NULL — &ldquo;Tidak Tahu&rdquo;, Bukan Nol</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Nilai</th><th>Artinya</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td>NULL</td><td>Tidak tahu / belum diisi</td><td>Penghasilan Eko belum diinput</td></tr>
<tr><td>0</td><td>Tahu: nilainya nol</td><td>DPD 0 = tidak menunggak</td></tr>
<tr><td>'' (string kosong)</td><td>Tahu: teks kosong</td><td>Nama panggilan dikosongkan</td></tr>
</tbody>
</table>
</div>

      <p><strong>Aturan emas:</strong> apapun dibandingkan dengan NULL → <strong>UNKNOWN</strong>:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT NULL = NULL;      -- UNKNOWN (bukan TRUE!)
SELECT NULL + 5;         -- NULL
SELECT NULL &gt; 10000000;  -- UNKNOWN</pre>

      <p>WHERE hanya meloloskan <strong>TRUE</strong> — UNKNOWN disaring! Inilah mengapa Eko hilang dari kedua laporan.</p>

      <p><strong>Cara benar:</strong> <code className="inline">IS NULL</code> / <code className="inline">IS NOT NULL</code>:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama FROM nasabah WHERE penghasilan IS NULL;  -- Eko</pre>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;NULL = 0, jadi bisa dibandingkan biasa.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda total! <code className="inline">WHERE penghasilan = 0</code> tidak menemukan NULL. <code className="inline">COUNT(penghasilan)</code> melewatkan NULL tapi <code className="inline">COUNT(*)</code> tidak (C3!). Rata-rata mengabaikan NULL — yang bisa bias jika NULL-nya tidak acak (MNAR, A1.7). NULL menuntut perlakuan khusus di setiap klausa.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Saat eksplorasi tabel baru, query pertamamu harus: <code className="inline">SELECT COUNT(*), COUNT(kolom) FROM t</code> — selisihnya = jumlah NULL. Ditambah <code className="inline">SELECT ... WHERE kolom IS NULL LIMIT 5</code> untuk melihat polanya. Kebiasaan 30 detik yang menyelamatkan jam debugging.</p>
</div>

      <h2 id="logika3">Logika 3-Nilai — TRUE / FALSE / UNKNOWN</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th><th>NOT A</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>UNKNOWN</td><td>UNKNOWN</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>FALSE</td><td>UNKNOWN</td><td>FALSE</td><td>UNKNOWN</td><td>TRUE</td></tr>
<tr><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
</tbody>
</table>
</div>

      <p><strong>Implikasi praktis:</strong> <code className="inline">WHERE NOT (penghasilan &gt; 10000000)</code> — untuk Eko (NULL): NOT UNKNOWN = UNKNOWN → <strong>tersaring!</strong> &ldquo;Tidak (di atas 10jt)&rdquo; ≠ &ldquo;di bawah 10jt&rdquo; saat ada NULL.</p>

      <p><strong>COALESCE</strong> — beri nilai pengganti yang aman:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama,
       COALESCE(penghasilan, 0) AS penghasilan_aman
FROM nasabah;</pre>

      <p>COALESCE mengambil argumen non-NULL pertama. <strong>Kapan:</strong> sebelum agregasi/aritmetika — tapi dokumentasikan! Mengganti NULL dengan 0 mengubah makna (ingat A1.7: 0 adalah nilai, bukan &ldquo;tidak tahu&rdquo;).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola aman: <code className="inline">COALESCE</code> untuk <em>perhitungan</em> (agar tidak NULL-merambat), tapi pertahankan kolom asli untuk <em>analisis</em> (agar tahu mana yang imputasi). Tambahkan flag: <code className="inline">(penghasilan IS NULL) AS penghasilan_missing</code>.</p>
</div>

      <h2 id="like">LIKE, IN, BETWEEN — Filter Ekspresif</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- LIKE: pola teks (% = sembarang, _ = satu karakter)
SELECT nama FROM nasabah WHERE nama LIKE &#x27;A%&#x27;;   -- diawali A
SELECT nama FROM nasabah WHERE nama LIKE &#x27;%i&#x27;;   -- diakhiri i

-- IN: daftar nilai
SELECT nama FROM nasabah
WHERE kota IN (&#x27;Jakarta&#x27;, &#x27;Surabaya&#x27;);

-- BETWEEN: rentang inklusif
SELECT nama, dpd FROM nasabah
WHERE dpd BETWEEN 30 AND 90;  -- termasuk 30 dan 90!</pre>

      <ul>
<li><code className="inline">LIKE</code>: <code className="inline">%</code> = nol/lebih karakter, <code className="inline">_</code> = tepat satu. Hati-hati: LIKE '%x%' tidak bisa pakai index (C17!).</li>
<li><code className="inline">IN</code>: lebih rapi dari OR beruntun. <strong>Jebakan NULL:</strong> <code className="inline">x NOT IN (1, 2, NULL)</code> → selalu UNKNOWN/false! (C6 bahas.)</li>
<li><code className="inline">BETWEEN</code>: <strong>inklusif</strong> kedua ujung. Untuk tanggal, lebih aman pakai <code className="inline">&gt;=</code> dan <code className="inline">&lt;</code> (C4).</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;NOT IN aman dipakai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Jika daftar mengandung NULL, <code className="inline">NOT IN</code> tidak mengembalikan apapun — diam-diam! Ini bug klasik yang lolos review. Aturan: pastikan daftar bersih dari NULL, atau pakai <code className="inline">NOT EXISTS</code> (C6).</p>
</div>

      <h2 id="case">CASE — IF-nya SQL</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, dpd,
  CASE
    WHEN dpd = 0 THEN &#x27;lancar&#x27;
    WHEN dpd BETWEEN 1 AND 30 THEN &#x27;ringan&#x27;
    WHEN dpd BETWEEN 31 AND 90 THEN &#x27;sedang&#x27;
    ELSE &#x27;berat&#x27;
  END AS bucket_risiko
FROM nasabah;</pre>

      <p><strong>Kapan dipakai:</strong> kategorisasi (bucket DPD!), label, pivot manual (C10), conditional aggregation (C3). CASE dievaluasi <strong>berurutan</strong> — WHEN pertama yang cocok menang (seperti IF-ELSE).</p>

      <p><strong>CASE sederhana</strong> untuk kesetaraan:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama,
  CASE status
    WHEN &#x27;lancar&#x27; THEN &#x27;OK&#x27;
    WHEN &#x27;telat&#x27; THEN &#x27;Waspada&#x27;
    ELSE &#x27;Bahaya&#x27;
  END AS label
FROM nasabah;</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> CASE adalah &ldquo;lem super&rdquo; SQL: ia mengubah angka jadi kategori bisnis, membuat kolom flag, dan menjadi fondasi <strong>conditional aggregation</strong> (C3) — pola paling sering di interview: <code className="inline">COUNT(CASE WHEN ... THEN 1 END)</code>.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Bucket Risiko via CASE (distribusi nasabah)"
  layout={{"xaxis": {"title": "Bucket"}, "yaxis": {"title": "Jumlah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = bucket hasil CASE WHEN atas dpd; tinggi = jumlah nasabah.</p>
<p><strong>Interpretasi:</strong> CASE mengubah angka mentah (dpd) menjadi bahasa bisnis (bucket). <strong>Perhatikan:</strong> bucket &ldquo;berat&rdquo; hanya 2 nasabah tapi menampung dpd 90 &amp; 120 — risiko terkonsentrasi. Inilah mengapa bucketing (bukan rata-rata dpd) dipakai di collection.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. NULL = &ldquo;tidak tahu&rdquo; — dan &ldquo;tidak tahu&rdquo; menular ke seluruh ekspresi.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Audit — siapa yang hilang dari laporan?</summary>
              <p>10 nasabah: 6 berpenghasilan &lt; 10jt, 3 berpenghasilan &gt; 10jt, 1 NULL (Eko). Laporan A: <code className="inline">WHERE penghasilan &lt; 10000000</code> → 6 baris. Laporan B: <code className="inline">WHERE penghasilan &gt;= 10000000</code> → 3 baris. Ke mana Eko?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Eko tidak di A maupun B! NULL &lt; 10000000 = UNKNOWN (disaring).
      -- Audit lengkap: cari yang hilang
      SELECT nama FROM nasabah WHERE penghasilan IS NULL;
      -- Laporan yang benar-benar mencakup semua:
      SELECT nama FROM nasabah
      WHERE penghasilan &lt; 10000000 OR penghasilan IS NULL;</pre>
              <p><strong>Bedah:</strong> 6 + 3 = 9 ≠ 10 — selisihnya = baris NULL. Aturan audit: <em>selalu</em> cek <code className="inline">COUNT(*) vs COUNT(kolom)</code>; selisihnya = NULL yang mungkin hilang dari laporanmu.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: NOT IN dengan NULL — query yang diam-diam kosong</summary>
              <p>Daftar hitam: <code className="inline">(1, 2, NULL)</code>. Query: <code className="inline">SELECT * FROM nasabah WHERE id NOT IN (1, 2, NULL)</code>. Berapa baris kembali?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Jawaban: NOL baris! Mengapa:
      -- id=5: 5 NOT IN (1,2,NULL) = NOT(5=1 OR 5=2 OR 5=NULL)
      --       = NOT(FALSE OR FALSE OR UNKNOWN) = NOT(UNKNOWN) = UNKNOWN -&gt; disaring!
      -- Perbaikan: buang NULL dari daftar, atau pakai NOT EXISTS
      SELECT * FROM nasabah n
      WHERE NOT EXISTS (SELECT 1 FROM blacklist b WHERE b.id = n.id);</pre>
              <p><strong>Bedah:</strong> satu NULL di daftar NOT IN meracuni <em>seluruh</em> query menjadi kosong. Ini bug klasik yang tidak error — hanya hening. Aturan: NOT IN + daftar ber-NULL = larangan; pakai NOT EXISTS.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: COALESCE — nilai pengganti yang jujur</summary>
              <p>Hitung &ldquo;total penghasilan&rdquo; dengan Eko (NULL). <code className="inline">SUM(penghasilan)</code> mengabaikan NULL — tapi untuk <em>laporan per nasabah</em>, tampilkan 0 dengan label.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama,
             COALESCE(penghasilan, 0) AS penghasilan_lapor,
             CASE WHEN penghasilan IS NULL THEN &#x27;belum diinput&#x27;
                  ELSE &#x27;terisi&#x27; END AS status_data
      FROM nasabah;</pre>
              <p><strong>Bedah:</strong> COALESCE mengganti NULL <em>saat tampil</em> — data aslinya tetap NULL (jujur!). Jangan UPDATE NULL jadi 0 di tabel: 0 = &ldquo;tidak berpenghasilan&rdquo; (fakta), NULL = &ldquo;belum tahu&rdquo; (ketidaktahuan). Mencampur keduanya merusak analisis selamanya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Berburu NULL</h2>

      <p>Buktikan: Eko (penghasilan NULL) hilang dari <code className="inline">&lt; 10000000</code> maupun <code className="inline">&gt;= 10000000</code>. Temukan dia dengan IS NULL + perbaiki dengan COALESCE.</p>

      <PyodideLab
  title="Lab 1 — NULL Tidak Tertangkap WHERE Biasa"
  hint="Hitung: berapa % penghasilan NULL? Jika >5%, laporkan sebagai isu kualitas data (C15)."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1) selisih = jumlah NULL
SELECT COUNT(*) AS semua, COUNT(penghasilan) AS ada_gaji FROM nasabah;
-- 2)
SELECT nama FROM nasabah WHERE penghasilan IS NULL;
-- 3)
SELECT nama, COALESCE(penghasilan, 0) AS gaji_aman FROM nasabah;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: CASE Bucket DPD</h2>

      <p>Buat kolom <code className="inline">bucket</code>: 0→'lancar', 1–30→'ringan', 31–90→'sedang', else→'berat'. Tampilkan nama, dpd, bucket, urut dpd menurun.</p>

      <PyodideLab
  title="Lab 2 — Kategorisasi dengan CASE"
  hint="Tambahkan ELSE 'tidak diketahui' untuk dpd NULL (jika ada). Urutan WHEN penting!"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT nama, dpd,
  CASE
    WHEN dpd = 0 THEN &#x27;lancar&#x27;
    WHEN dpd BETWEEN 1 AND 30 THEN &#x27;ringan&#x27;
    WHEN dpd BETWEEN 31 AND 90 THEN &#x27;sedang&#x27;
    ELSE &#x27;berat&#x27;
  END AS bucket
FROM nasabah
ORDER BY dpd DESC;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Menangani Nilai Spesial</h2>

      <div className="decision-card">
<h3>1. Cek NULL → <strong>IS NULL / IS NOT NULL</strong></h3>
<p><strong>Kondisi data:</strong> Kolom boleh kosong.</p>
<p><strong>Kenapa:</strong> = NULL selalu UNKNOWN — satu-satunya cara benar.</p>
<p><strong>Contoh nyata:</strong> WHERE penghasilan IS NULL.</p>
</div>

      <div className="decision-card">
<h3>2. Hitung dengan NULL → <strong>COALESCE</strong></h3>
<p><strong>Kondisi data:</strong> Aritmetika/agregasi tidak boleh merambat NULL.</p>
<p><strong>Kenapa:</strong> Ambil nilai non-NULL pertama; dokumentasikan imputasi.</p>
<p><strong>Contoh nyata:</strong> COALESCE(penghasilan, 0).</p>
</div>

      <div className="decision-card">
<h3>3. Filter pola teks → <strong>LIKE</strong></h3>
<p><strong>Kondisi data:</strong> Awalan/akhiran/mengandung.</p>
<p><strong>Kenapa:</strong> %, _ — tapi '%x%' tak pakai index.</p>
<p><strong>Contoh nyata:</strong> WHERE nama LIKE 'A%'.</p>
</div>

      <div className="decision-card">
<h3>4. Daftar nilai → <strong>IN</strong> (awas NULL!)</h3>
<p><strong>Kondisi data:</strong> Beberapa nilai diskret.</p>
<p><strong>Kenapa:</strong> Rapi; tapi NOT IN + NULL = hasil kosong diam-diam.</p>
<p><strong>Contoh nyata:</strong> WHERE kota IN ('Jakarta','Surabaya').</p>
</div>

      <div className="decision-card">
<h3>5. Kategorisasi → <strong>CASE</strong></h3>
<p><strong>Kondisi data:</strong> Angka → label bisnis.</p>
<p><strong>Kenapa:</strong> Dievaluasi berurutan (IF-ELSE); fondasi conditional aggregation.</p>
<p><strong>Contoh nyata:</strong> Bucket DPD di atas.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>NULL: <strong>IS NULL</strong>, bukan = NULL. WHERE hanya loloskan TRUE.</li><li>Eksplorasi baru → <code className="inline">COUNT(*)</code> vs <code className="inline">COUNT(kolom)</code> dulu.</li><li>NOT IN: pastikan tak ada NULL, atau pakai NOT EXISTS.</li><li>CASE berurutan — WHEN pertama yang cocok menang.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Laporan yang Kehilangan Eko</h2>

      <div className="callout">
<p>Manajemen menerima dua laporan: &ldquo;penghasilan &lt; 10jt: 6 nasabah&rdquo; dan &ldquo;penghasilan ≥ 10jt: 3 nasabah&rdquo;. Total 9 — padahal nasabah ada 10. Eko (NULL) hilang dari keduanya. Manajemen bertanya: <em>&ldquo;Kenapa totalnya tidak 10?&rdquo;</em></p><p><strong>Pertanyaan:</strong> (a) Jelaskan penyebabnya dalam 2 kalimat. (b) Tulis query laporan yang benar (3 kategori: di bawah, di atas, belum diisi).</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Penyebab:</strong> perbandingan dengan NULL menghasilkan UNKNOWN, dan WHERE menyaring UNKNOWN — Eko tidak lolos ke laporan manapun.</p><p>(b) <code className="inline">SELECT CASE WHEN penghasilan IS NULL THEN 'belum diisi' WHEN penghasilan &lt; 10000000 THEN '&lt;10jt' ELSE '≥10jt' END AS kategori, COUNT(*) FROM nasabah GROUP BY 1;</code> (GROUP BY = C3 — bocoran!). <strong>Pelajaran:</strong> setiap laporan dengan filter harus punya kategori &ldquo;tidak diketahui&rdquo; — atau datamu bocor diam-diam.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Berapa hasil <code className="inline">NULL + 5</code>, <code className="inline">NULL = NULL</code>, <code className="inline">NULL &lt;&gt; 5</code>? (TRUE/FALSE/UNKNOWN)</li>
              <li>Tulis query: nasabah yang penghasilannya &gt; 10jt ATAU belum diinput (NULL).</li>
              <li><code className="inline">SELECT COUNT(*), COUNT(penghasilan), COUNT(DISTINCT kota) FROM nasabah</code> — apa beda ketiganya terkait NULL?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <code className="inline">NULL + 5</code> = <strong>NULL</strong> (menular). <code className="inline">NULL = NULL</code> = <strong>UNKNOWN</strong> (bukan TRUE!). <code className="inline">NULL &lt;&gt; 5</code> = <strong>UNKNOWN</strong>.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2.
      SELECT nama FROM nasabah
      WHERE penghasilan &gt; 10000000 OR penghasilan IS NULL;</pre>
              <p><strong>3.</strong> <code className="inline">COUNT(*)</code> = semua baris (termasuk NULL). <code className="inline">COUNT(penghasilan)</code> = hanya yang NOT NULL. <code className="inline">COUNT(DISTINCT kota)</code> = kota unik, NULL tidak dihitung. Selisih COUNT(*) − COUNT(penghasilan) = jumlah NULL — trik audit tercepat.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>NULL = tidak tahu:</strong> perbandingan → UNKNOWN → tersaring WHERE. Pakai IS NULL.</li><li><strong>Logika 3-nilai:</strong> TRUE/FALSE/UNKNOWN — NOT (x) ≠ kebalikan x saat ada NULL.</li><li><strong>COALESCE</strong> untuk perhitungan aman; dokumentasikan imputasi.</li><li><strong>LIKE</strong> (%, _), <strong>IN</strong> (awas NULL!), <strong>BETWEEN</strong> (inklusif).</li><li><strong>CASE</strong> berurutan — lem super kategorisasi &amp; conditional aggregation.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c1-select-dasar" className="btn btn-secondary btn-sm">← ← C1</Link>
        <Link href="/learn/c3-agregasi-groupby" className="btn btn-primary btn-sm">Next: C3 →</Link>
      </div>
    </div>
  );
}

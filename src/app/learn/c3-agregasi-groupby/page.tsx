import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C3AgregasiGroupbyPage() {
  const chart1 = [{"x": ["Jakarta", "Bandung", "Surabaya", "Medan"], "y": [9250000, 10600000, 10200000, 8350000], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["9,25jt", "10,6jt", "10,2jt", "8,35jt"], "textposition": "outside"}];
  const chart2 = [{"x": ["lancar", "telat", "macet"], "y": [5, 2, 3], "type": "bar", "name": "COUNT(*)", "marker": {"color": "#94a3b8"}}, {"x": ["lancar", "telat", "macet"], "y": [5, 2, 2], "type": "bar", "name": "COUNT(penghasilan)", "marker": {"color": "#2a7de1"}}];
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
# SELECT kota, COUNT(*), AVG(penghasilan), MAX(dpd) FROM nasabah GROUP BY kota ORDER BY 3 DESC
q("""SELECT kota, COUNT(*) AS n FROM nasabah GROUP BY kota""")`;
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
# SELECT COUNT(*), COUNT(CASE WHEN dpd>30 THEN 1 END)*1.0/COUNT(*), AVG(CASE WHEN kota='Jakarta' THEN penghasilan END) FROM nasabah
q("""SELECT COUNT(*) AS total FROM nasabah""")`;
  const quizData = [{"question": "AVG(penghasilan) dengan 1 NULL dari 10 baris…", "options": ["SUM/10", "SUM/9 (NULL tidak dihitung)", "Error", "SUM/10 dengan NULL=0"], "correct": 1, "explanation": "Benar: AVG = SUM/COUNT(kolom). Beda dengan SUM/COUNT(*) — definisikan yang kamu mau."}, {"question": "WHERE vs HAVING: yang benar…", "options": ["Sama saja", "WHERE saring baris (sebelum agregat), HAVING saring grup (sesudah)", "HAVING lebih cepat", "WHERE bisa pakai agregat"], "correct": 1, "explanation": "Benar: urutan eksekusi — WHERE → GROUP BY → HAVING. Agregat tak ada saat WHERE jalan."}, {"question": "SELECT kota, nama FROM nasabah GROUP BY kota. Masalahnya…", "options": ["Tidak ada", "nama bukan agregat & tidak di GROUP BY — tidak valid", "Harus pakai HAVING", "Kota harus di WHERE"], "correct": 1, "explanation": "Benar: satu grup punya banyak nama — query tidak bermakna. Aturan keras GROUP BY."}, {"question": "Pola conditional aggregation untuk &ldquo;% dpd > 30&rdquo;…", "options": ["WHERE dpd > 30", "COUNT(CASE WHEN dpd > 30 THEN 1 END) * 1.0 / COUNT(*)", "GROUP BY dpd", "HAVING dpd > 30"], "correct": 1, "explanation": "Benar: satu query, satu scan. Pola #1 interview SQL."}, {"question": "GROUP BY tanpa ORDER BY…", "options": ["Selalu urut", "Urutan tidak dijamin — tambahkan ORDER BY eksplisit", "Error", "Otomatis DESC"], "correct": 1, "explanation": "Benar: jangan andalkan urutan implisit."}, {"question": "Satu nasabah punya 2 kredit. COUNT(nasabah) setelah JOIN…", "options": ["Tetap benar", "Menggandakan — pakai COUNT(DISTINCT n.id)", "Error", "Menjadi NULL"], "correct": 1, "explanation": "Benar: fan-out JOIN menggandakan baris. COUNT DISTINCT atau agregasi di level yang benar."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C3 — SQL</span>
        <h1 className="display-title">GROUP BY: Dari Jutaan Baris<br/>ke Satu Insight</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Berapa NPL Kita?&rdquo; dalam 1 Query</a></li>
          <li><a href="#agregasi">Fungsi Agregasi — Lima Serangkai</a></li>
          <li><a href="#groupby">GROUP BY — Meringkas per Kelompok</a></li>
          <li><a href="#having">HAVING — WHERE-nya Grup</a></li>
          <li><a href="#cond">Conditional Aggregation — Pola #1 Interview ⭐</a></li>
          <li><a href="#lab1">🔬 Lab 1: Agregasi per Kota</a></li>
          <li><a href="#lab2">🔬 Lab 2: Conditional Aggregation — NPL</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Agregasi</a></li>
          <li><a href="#case">📋 Mini-Case: NPL Ratio per Kota untuk Direksi</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Memakai fungsi agregasi <strong>COUNT, SUM, AVG, MIN, MAX</strong> dengan benar (termasuk jebakan NULL).</li><li>Mengelompokkan dengan <strong>GROUP BY</strong> dan menyaring grup dengan <strong>HAVING</strong>.</li><li>Menulis <strong>conditional aggregation</strong> (COUNT/SUM + CASE) — pola #1 interview data analyst.</li><li>Menjelaskan mengapa kolom non-agregat harus ada di GROUP BY.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Berapa NPL Kita?&rdquo; dalam 1 Query</h2>

      <div className="story"><p>Direksi bertanya saat rapat: <em>&ldquo;Berapa NPL (kredit macet) kita per kota?&rdquo;</em> Datamu: 2 juta baris kredit. Tanpa agregasi, kamu tidak bisa menjawab — tidak ada manusia membaca 2 juta baris.</p><p>Dengan GROUP BY: <strong>1 query, 4 baris hasil</strong> — NPL per kota. Inilah agregasi: <em>meringkas jutaan baris menjadi insight</em>. Dan pola <strong>conditional aggregation</strong> (menghitung &ldquo;berapa yang memenuhi syarat X&rdquo; dalam satu query) adalah pola yang paling sering ditanyakan di interview data analyst 2026 — kuasai lesson ini = kuasai separuh interview SQL.</p><p><strong>Twist-nya:</strong> GROUP BY merangkum 2 juta baris jadi 4 — keajaiban yang juga jebakan: agregasi <em>menyembunyikan distribusi</em>. &ldquo;Rata-rata NPL 3%&rdquo; bisa berarti semua kota 3%, ATAU satu kota 30% dan sisanya 0%. Angka ringkas = informasi yang dibuang; pastikan yang dibuang bukan justru yang penting. Analis senior selalu bertanya: &ldquo;distribusi di balik rata-rata ini seperti apa?&rdquo;</p></div>

      <h2 id="agregasi">Fungsi Agregasi — Lima Serangkai</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Fungsi</th><th>Arti</th><th>Jebakan NULL</th></tr></thead>
<tbody>
<tr><td>COUNT(*)</td><td>Hitung baris</td><td>Termasuk NULL</td></tr>
<tr><td>COUNT(kolom)</td><td>Hitung non-NULL</td><td>Melewatkan NULL!</td></tr>
<tr><td>SUM(kolom)</td><td>Jumlah</td><td>Mengabaikan NULL</td></tr>
<tr><td>AVG(kolom)</td><td>Rata-rata</td><td>Pembagi = non-NULL saja!</td></tr>
<tr><td>MIN/MAX(kolom)</td><td>Terkecil/terbesar</td><td>Mengabaikan NULL</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT COUNT(*) AS n_nasabah,
       COUNT(penghasilan) AS n_ada_gaji,
       AVG(penghasilan) AS rata_gaji,
       MAX(dpd) AS dpd_terburuk
FROM nasabah;</pre>

      <p>Hasil: n_nasabah=10, n_ada_gaji=9 (Eko NULL!), rata_gaji dihitung dari 9 saja.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;AVG = SUM / COUNT(*).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak! <code className="inline">AVG(kolom)</code> = SUM / COUNT(kolom) — NULL tidak dihitung sebagai 0. Jika 1 dari 10 gaji NULL, AVG membagi 9, bukan 10. Untuk &ldquo;rata-rata dengan NULL sebagai 0&rdquo;, tulis eksplisit: <code className="inline">SUM(COALESCE(gaji,0)) / COUNT(*)</code>. Beda definisi = beda angka = beda keputusan.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tiga query audit agregasi yang wajib hafal: <code className="inline">COUNT(*)</code> (berapa baris?), <code className="inline">COUNT(DISTINCT id)</code> (berapa unik? — deteksi duplikat!), <code className="inline">MIN/MAX(tanggal)</code> (rentang data?). Tiga ini menjawab &ldquo;data ini apa?&rdquo; dalam 10 detik.</p>
</div>

      <h2 id="groupby">GROUP BY — Meringkas per Kelompok</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kota,
       COUNT(*) AS n,
       AVG(penghasilan) AS rata_gaji,
       MAX(dpd) AS max_dpd
FROM nasabah
GROUP BY kota;</pre>

      <p><strong>Cara kerja:</strong> baris dikelompokkan berdasar <code className="inline">kota</code>, lalu agregasi dihitung <em>per grup</em>. Hasil: 4 baris (satu per kota).</p>

      <p><strong>Aturan keras:</strong> setiap kolom di SELECT harus <strong>agregat</strong> atau ada di <strong>GROUP BY</strong>. Ini bukan gaya — ini logika: satu grup punya banyak nama, jadi <code className="inline">SELECT nama ... GROUP BY kota</code> tidak bermakna (nama yang mana?).</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Soal: rata-rata dpd per status.</p><p><strong>Langkah 1</strong> — grup: <code className="inline">GROUP BY status</code> (lancar/telat/macet).</p><p><strong>Langkah 2</strong> — agregat: <code className="inline">SELECT status, AVG(dpd)</code>.</p><p><strong>Langkah 3</strong> — gabung + urut: <code className="inline">... ORDER BY 2 DESC</code> (2 = kolom kedua).</p><p>Hasil: macet 105, telat 37,5, lancar 4. Satu query menjawab &ldquo;dpd tipikal per status&rdquo;.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;GROUP BY mengurutkan hasil.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak dijamin! Di beberapa database hasilnya <em>terlihat</em> urut (efek samping implementasi) — tapi standar SQL tidak menjanjikan. Butuh urutan? <strong>Tambahkan ORDER BY eksplisit.</strong> Mengandalkan urutan implisit = bug yang menunggu waktu.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Grouping bertingkat: <code className="inline">GROUP BY kota, status</code> = grup per kombinasi (Jakarta-lancar, Jakarta-telat, ...). Makin banyak kolom grup, makin rinci — tapi waspadai grup kecil (n=1) yang tidak bermakna statistik.</p>
</div>

      <h2 id="having">HAVING — WHERE-nya Grup</h2>

      <p>WHERE menyaring <strong>baris</strong> (sebelum grup). HAVING menyaring <strong>grup</strong> (sesudah agregasi):</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kota, COUNT(*) AS n
FROM nasabah
GROUP BY kota
HAVING COUNT(*) &gt;= 3;  -- hanya kota dengan &gt;=3 nasabah</pre>

      <p><strong>Mengapa tidak WHERE COUNT(*) &gt;= 3?</strong> Ingat urutan eksekusi (C1): WHERE jalan <em>sebelum</em> GROUP BY — agregat belum ada! Urutan lengkap:</p>

      <p><Tex math={String.raw`\text{FROM} \to \text{WHERE} \to \text{GROUP BY} \to \text{HAVING} \to \text{SELECT} \to \text{ORDER BY}`} block /></p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Refleks: &ldquo;saring baris&rdquo; → WHERE; &ldquo;saring grup/hasil agregat&rdquo; → HAVING. Contoh interview klasik: &ldquo;kota dengan rata-rata gaji &gt; 10jt&rdquo; → HAVING AVG(...) &gt; 10000000.</p>
</div>

      <h2 id="cond">Conditional Aggregation — Pola #1 Interview ⭐</h2>

      <p>Menghitung agregat <strong>bersyarat dalam satu query</strong> — tanpa GROUP BY tambahan:</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT COUNT(*) AS total,
       COUNT(CASE WHEN dpd &gt; 30 THEN 1 END) AS n_bermasalah,
       COUNT(CASE WHEN dpd &gt; 30 THEN 1 END) * 1.0 / COUNT(*) AS pct_bermasalah,
       SUM(CASE WHEN status = &#x27;macet&#x27; THEN plafon ELSE 0 END) AS exposure_macet
FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id;</pre>

      <p><strong>Cara kerja:</strong> <code className="inline">CASE WHEN</code> menghasilkan 1 hanya untuk baris yang cocok (else NULL), lalu COUNT menghitung yang non-NULL. Satu scan tabel → banyak metrik!</p>

      <p><strong>Pola yang wajib dikuasai</strong> (keluar di hampir semua interview SQL):</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- % per kategori (pivot manual)
SELECT
  SUM(CASE WHEN status = &#x27;lancar&#x27; THEN 1 ELSE 0 END) AS lancar,
  SUM(CASE WHEN status = &#x27;telat&#x27; THEN 1 ELSE 0 END) AS telat,
  SUM(CASE WHEN status = &#x27;macet&#x27; THEN 1 ELSE 0 END) AS macet
FROM nasabah;

-- rata-rata bersyarat
SELECT AVG(CASE WHEN kota = &#x27;Jakarta&#x27; THEN penghasilan END) AS rata_jakarta
FROM nasabah;</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Rumus NPL satu query: <code className="inline">SUM(CASE WHEN kolektibilitas &gt;= 3 THEN plafon ELSE 0 END) / SUM(plafon)</code>. Hafalkan pola ini — ia menjawab &ldquo;berapa % ...&rdquo; untuk semua varian pertanyaan bisnis.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Untuk tiap metrik butuh query terpisah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Justru conditional aggregation menggabungkan puluhan metrik dalam SATU scan — jauh lebih cepat dan konsisten (satu definisi populasi!). Dashboard yang baik = sedikit query dengan banyak CASE, bukan banyak query.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Rata-rata Penghasilan per Kota (GROUP BY)"
  layout={{"xaxis": {"title": "Kota"}, "yaxis": {"title": "Rupiah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = grup (kota), tinggi = AVG(penghasilan) per grup.</p>
<p><strong>Interpretasi:</strong> Agregasi mengubah 10 baris menjadi 4 insight. <strong>Tapi waspada:</strong> rata-rata Jakarta dari 4 nasabah (satu NULL!) — grup kecil = tidak stabil. Selalu tampilkan <strong>n per grup</strong> (COUNT(*)) di samping rata-rata.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="COUNT(*) vs COUNT(kolom): NULL Menghilang"
  layout={{"barmode": "group", "yaxis": {"title": "Jumlah"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Abu-abu = COUNT(*) (semua baris); biru = COUNT(penghasilan) (non-NULL saja).</p>
<p><strong>Interpretasi:</strong> Status &ldquo;macet&rdquo;: COUNT(*) = 3 tapi COUNT(penghasilan) = 2 — <strong>satu NULL hilang diam-diam</strong>. Jika kamu hitung &ldquo;rata-rata gaji nasabah macet&rdquo; tanpa sadar, pembaginya 2 bukan 3. Visual ini = alasan audit NULL (C2) sebelum agregasi.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Agregasi = meringkas; GROUP BY = meringkas <em>per kelompok</em>.</p>

            <details className="worked">
              <summary>📐 Kasus 1: NPL per kota — lengkap dengan pembagi</summary>
              <p>Tabel <code className="inline">kredit(id, kota, status)</code>, status ∈ &#123;&#x27;lancar&#x27;, &#x27;macet&#x27;&#125;. Hitung NPL % per kota = macet/total.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kota,
             COUNT(*) AS total,
             SUM(CASE WHEN status = &#x27;macet&#x27; THEN 1 ELSE 0 END) AS macet,
             ROUND(100.0 * SUM(CASE WHEN status = &#x27;macet&#x27; THEN 1 ELSE 0 END)
                   / COUNT(*), 2) AS npl_pct
      FROM kredit
      GROUP BY kota
      ORDER BY npl_pct DESC;</pre>
              <p><strong>Bedah:</strong> <code className="inline">100.0 *</code> (bukan 100) — agar pembagian jadi desimal, bukan integer! <code className="inline">SUM(CASE...)</code> = conditional aggregation: menghitung &ldquo;yang memenuhi syarat&rdquo; dalam satu query.</p>
              <p><strong>Output (contoh):</strong> Surabaya 4,20% (840/20.000); Jakarta 2,10% (2.100/100.000) — Jakarta macetnya lebih banyak nominal, tapi <em>rasio</em> Surabaya lebih buruk. Inilah mengapa NPL = rasio, bukan nominal.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: HAVING — saring grup, bukan baris</summary>
              <p>Tampilkan kota dengan total kredit &gt; 1.000 DAN NPL &gt; 3%.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kota, COUNT(*) AS total,
             100.0 * SUM(CASE WHEN status = &#x27;macet&#x27; THEN 1 ELSE 0 END)
               / COUNT(*) AS npl_pct
      FROM kredit
      GROUP BY kota
      HAVING COUNT(*) &gt; 1000
         AND 100.0 * SUM(CASE WHEN status = &#x27;macet&#x27; THEN 1 ELSE 0 END)
             / COUNT(*) &gt; 3;</pre>
              <p><strong>Bedah:</strong> WHERE tidak bisa dipakai (ia jalan <em>sebelum</em> GROUP BY; NPL belum ada). HAVING = &ldquo;WHERE-nya grup&rdquo;, jalan <em>setelah</em> agregasi. Urutan logis: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Rata-rata dari rata-rata — jebakan</summary>
              <p>Kota A: 10 kredit, rata-rata plafon 100jt. Kota B: 1.000 kredit, rata-rata 10jt. Berapa rata-rata plafon <em>keseluruhan</em>?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- SALAH: (100 + 10) / 2 = 55 jt  (rata-rata dari rata-rata!)
      -- BENAR: (10*100 + 1000*10) / 1010 = 11000/1010 = 10,89 jt
      SELECT SUM(plafon) / COUNT(*) FROM kredit;  -- langsung dari baris!</pre>
              <p><strong>Bedah:</strong> rata-rata dari rata-rata grup <em>salah</em> kecuali grup sama besar. Aturan: agregat selalu dari baris mentah, bukan dari hasil agregat. (Ini versi SQL dari &ldquo;Simpson&apos;s paradox&rdquo; — A2!)</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Agregasi per Kota</h2>

      <p>Hitung per kota: jumlah nasabah, rata-rata penghasilan, dpd maksimum. Urut dari rata-rata tertinggi.</p>

      <PyodideLab
  title="Lab 1 — GROUP BY Langsung"
  hint="Tambahkan HAVING COUNT(*) >= 3. Kota mana yang hilang?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT kota,
       COUNT(*) AS n,
       AVG(penghasilan) AS rata_gaji,
       MAX(dpd) AS max_dpd
FROM nasabah
GROUP BY kota
ORDER BY rata_gaji DESC;</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Conditional Aggregation — NPL</h2>

      <p>Dalam SATU query hitung: total nasabah, % dengan dpd &gt; 30, dan rata-rata penghasilan khusus Jakarta. (Pola interview!)</p>

      <PyodideLab
  title="Lab 2 — Satu Query, Banyak Metrik"
  hint="Ubah jadi: % nasabah 'macet' + total plafon macet (butuh JOIN — intip C5, atau pakai tabel kredit di lab C5)."
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT COUNT(*) AS total,
       COUNT(CASE WHEN dpd &gt; 30 THEN 1 END) * 1.0 / COUNT(*) AS pct_bermasalah,
       AVG(CASE WHEN kota = &#x27;Jakarta&#x27; THEN penghasilan END) AS rata_jakarta
FROM nasabah;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Agregasi</h2>

      <div className="decision-card">
<h3>1. Satu angka ringkas → <strong>agregasi tanpa GROUP BY</strong></h3>
<p><strong>Kondisi data:</strong> Total/keseluruhan.</p>
<p><strong>Kenapa:</strong> COUNT/SUM/AVG atas seluruh tabel.</p>
<p><strong>Contoh nyata:</strong> Total nasabah, total plafon.</p>
</div>

      <div className="decision-card">
<h3>2. Perbandingan antar kelompok → <strong>GROUP BY</strong></h3>
<p><strong>Kondisi data:</strong> Per kota/status/kategori.</p>
<p><strong>Kenapa:</strong> Agregat per grup; kolom SELECT harus agregat atau di GROUP BY.</p>
<p><strong>Contoh nyata:</strong> NPL per kota.</p>
</div>

      <div className="decision-card">
<h3>3. Saring grup (hasil agregat) → <strong>HAVING</strong></h3>
<p><strong>Kondisi data:</strong> &ldquo;Kota dengan n ≥ ...&rdquo;, &ldquo;rata-rata di atas ...&rdquo;.</p>
<p><strong>Kenapa:</strong> WHERE tak bisa (jalan sebelum agregat).</p>
<p><strong>Contoh nyata:</strong> HAVING COUNT(*) &gt;= 100.</p>
</div>

      <div className="decision-card">
<h3>4. Banyak metrik bersyarat sekaligus → <strong>conditional aggregation</strong></h3>
<p><strong>Kondisi data:</strong> &ldquo;Berapa % yang ...&rdquo; dalam satu query.</p>
<p><strong>Kenapa:</strong> Satu scan, konsisten, pola interview #1.</p>
<p><strong>Contoh nyata:</strong> NPL ratio, % per bucket.</p>
</div>

      <div className="decision-card">
<h3>5. Curiga duplikat → <strong>COUNT(*) vs COUNT(DISTINCT id)</strong></h3>
<p><strong>Kondisi data:</strong> Validasi sebelum agregat.</p>
<p><strong>Kenapa:</strong> Duplikat menggandakan SUM/COUNT diam-diam.</p>
<p><strong>Contoh nyata:</strong> Cek duplikat id sebelum lapor total.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Kolom SELECT: <strong>agregat atau di GROUP BY</strong> — tidak ada pilihan ketiga.</li><li>Saring baris → WHERE; saring grup → HAVING.</li><li>&ldquo;Berapa % yang ...&rdquo; → COUNT(CASE WHEN ...).</li><li>Selalu tampilkan <strong>n per grup</strong> + waspadai NULL di agregat.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: NPL Ratio per Kota untuk Direksi</h2>

      <div className="callout">
<p>Definisi: NPL = kolektibilitas ≥ 3 (kurang lancar/diragukan/macet). Direksi minta NPL ratio (berdasar plafon) per kota + jumlah debitur, pagi ini.</p><p><strong>Pertanyaan:</strong> tulis 1 query (JOIN nasabah–kredit). Apa yang harus dicek sebelum kirim?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">SELECT n.kota, COUNT(DISTINCT n.id) AS debitur, SUM(CASE WHEN k.kolektibilitas &gt;= 3 THEN k.plafon ELSE 0 END) / SUM(k.plafon) AS npl_ratio FROM nasabah n JOIN kredit k ON k.nasabah_id = n.id GROUP BY n.kota;</code></p><p><strong>Cek sebelum kirim:</strong> (1) duplikat nasabah (satu nasabah bisa 2 kredit — pakai COUNT DISTINCT!), (2) NULL di plafon/kolektibilitas, (3) definisi NPL disepakati (≥3?), (4) n per kota — kota dengan 2 debitur tidak bisa dibandingkan dengan 2.000. <strong>Pelajaran:</strong> query benar + validasi = laporan dipercaya; query benar tanpa validasi = bom waktu.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Hitung per kota: jumlah nasabah, rata-rata penghasilan, penghasilan max. Urut dari rata-rata tertinggi.</li>
              <li>Tampilkan kota yang rata-rata penghasilannya &gt; 12 juta DAN jumlah nasabahnya &gt; 50.</li>
              <li>Mengapa <code className="inline">SELECT kota, penghasilan FROM nasabah GROUP BY kota</code> error (atau hasilnya aneh)?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 1.
      SELECT kota, COUNT(*) AS n, ROUND(AVG(penghasilan)) AS avg_gaji,
             MAX(penghasilan) AS max_gaji
      FROM nasabah GROUP BY kota ORDER BY avg_gaji DESC;
      -- 2.
      SELECT kota, AVG(penghasilan) AS avg_gaji, COUNT(*) AS n
      FROM nasabah GROUP BY kota
      HAVING AVG(penghasilan) &gt; 12000000 AND COUNT(*) &gt; 50;</pre>
              <p><strong>3.</strong> <code className="inline">penghasilan</code> tidak di GROUP BY dan tidak diagregasi — database tidak tahu <em>penghasilan siapa</em> yang ditampilkan dari tiap grup kota. Aturan: kolom di SELECT harus (a) ada di GROUP BY, atau (b) dibungkus fungsi agregasi.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Agregat:</strong> COUNT(*)/COUNT(kolom)/SUM/AVG/MIN/MAX — waspadai NULL.</li><li><strong>GROUP BY:</strong> agregat per grup; kolom SELECT harus agregat atau di GROUP BY.</li><li><strong>HAVING</strong> = WHERE untuk grup (setelah agregat).</li><li><strong>Conditional aggregation</strong> (CASE dalam agregat) = pola #1 interview.</li><li><strong>Jangan:</strong> andalkan urutan GROUP BY; lupakan cek duplikat &amp; NULL.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c2-null-logika" className="btn btn-secondary btn-sm">← ← C2</Link>
        <Link href="/learn/c4-fungsi-tanggal-string" className="btn btn-primary btn-sm">Next: C4 →</Link>
      </div>
    </div>
  );
}

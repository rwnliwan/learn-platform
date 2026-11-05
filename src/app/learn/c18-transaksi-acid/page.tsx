import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C18TransaksiAcidPage() {
  const chart1 = [{"x": ["Tanpa transaksi", "Dengan transaksi"], "y": [50, 0], "type": "bar", "marker": {"color": ["#ef4444", "#34a853"]}, "text": ["50 kasus/hari", "0"], "textposition": "outside"}];
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
# BEGIN
q("""SELECT COUNT(*) FROM nasabah""")`;
  const lab2Code = String.raw`import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE rekening (id TEXT PRIMARY KEY, saldo REAL)""")
data_rekening = [
    ('A', 50000000),
    ('B', 20000000)
]
cur.executemany("INSERT INTO rekening VALUES (?,?)", data_rekening)
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
# BEGIN
q("""SELECT * FROM rekening""")`;
  const quizData = [{"question": "ACID: A = …", "options": ["Akurat", "Atomicity — semua atau tidak sama sekali", "Asinkron", "Agregat"], "correct": 1, "explanation": "Benar: tidak ada &ldquo;setengah jalan&rdquo;."}, {"question": "Transfer: debit A sukses, kredit B gagal, tanpa transaksi…", "options": ["Otomatis rollback", "Uang hilang (tidak di A, tidak di B)", "Otomatis retry", "Tidak mungkin"], "correct": 1, "explanation": "Benar: inilah yang dicegah transaksi."}, {"question": "Dirty read dicegah oleh…", "options": ["READ UNCOMMITTED", "READ COMMITTED ke atas", "Tidak bisa", "ROLLBACK"], "correct": 1, "explanation": "Benar: jangan baca yang belum di-commit."}, {"question": "Isolation tertinggi…", "options": ["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE", "READ UNCOMMITTED"], "correct": 2, "explanation": "Benar: seolah serial — maksimal proteksi, maksimal biaya."}, {"question": "Pola load pipeline yang aman…", "options": ["Langsung ke tabel live", "Tulis ke tabel baru → validasi → swap atomik", "Hapus dulu baru isi", "Tanpa transaksi lebih cepat"], "correct": 1, "explanation": "Benar: pembaca tak pernah lihat setengah jadi."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C18 — SQL Engineering</span>
        <h1 className="display-title">Transaksi &amp; ACID:<br/>Ketika Data Tidak Boleh Salah</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Transfer yang Setengah Jalan</a></li>
          <li><a href="#acid">ACID — Empat Jaminan</a></li>
          <li><a href="#isolation">Isolation Level — Seberapa Terpisah?</a></li>
          <li><a href="#pipeline">Implikasi untuk Pipeline &amp; Laporan</a></li>
          <li><a href="#lab1">🔬 Lab 1: ROLLBACK Menyelamatkan</a></li>
          <li><a href="#lab2">🔬 Lab 2: Transfer Atomik</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Transaksi</a></li>
          <li><a href="#case">📋 Mini-Case: Pipeline Setengah Jalan</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>ACID</strong>: Atomicity, Consistency, Isolation, Durability.</li><li>Menulis <strong>BEGIN/COMMIT/ROLLBACK</strong> dengan benar.</li><li>Membedakan <strong>isolation level</strong> dan anomali (dirty read, dsb).</li><li>Menjelaskan implikasi untuk <strong>pipeline &amp; laporan</strong>.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Transfer yang Setengah Jalan</h2>

      <div className="story"><p>Transfer Rp 10 juta: sistem mengurangi saldo A <strong>berhasil</strong>, menambah saldo B <strong>gagal</strong> (koneksi putus). Hasil: Rp 10 juta <em>hilang</em> — tidak di A, tidak di B. Tanpa transaksi, ini bisa terjadi setiap hari.</p><p><strong>Transaksi database</strong> menjamin: <em>semua berhasil, atau semua batal</em> — tidak ada &ldquo;setengah jalan&rdquo;. Lesson penutup track SQL ini = fondasi keandalan data. Setelah ini: Track D (Python)!</p><p><strong>Twist-nya:</strong> Rp10 juta &ldquo;hilang&rdquo; — tidak di A, tidak di B. Uang tidak bisa musnah di dunia nyata, tapi di database tanpa transaksi, ia bisa. ACID terdengar seperti teori database membosankan — sampai kamu sadar ia satu-satunya yang berdiri antara &ldquo;transfer berhasil&rdquo; dan &ldquo;uang hilang&rdquo;. Lesson penutup ini bukan teori; ia alasan nasabah berani menaruh uangnya di sistem yang kamu query.</p></div>

      <h2 id="acid">ACID — Empat Jaminan</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Huruf</th><th>Arti</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td>A — Atomicity</td><td>Semua atau tidak sama sekali</td><td>Transfer: debit+credit satu paket</td></tr>
<tr><td>C — Consistency</td><td>Aturan selalu terjaga</td><td>Saldo tidak negatif; FK valid</td></tr>
<tr><td>I — Isolation</td><td>Transaksi konkuren tak saling ganggu</td><td>Dua tarik tunai bersamaan</td></tr>
<tr><td>D — Durability</td><td>Yang di-commit tak hilang</td><td>Mati lampu setelah commit = aman</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">BEGIN;  -- mulai transaksi
  UPDATE rekening SET saldo = saldo - 10000000 WHERE id = &#x27;A&#x27;;
  UPDATE rekening SET saldo = saldo + 10000000 WHERE id = &#x27;B&#x27;;
COMMIT;  -- sukses: simpan permanen
-- jika ada error di tengah: ROLLBACK;  -- batal semua</pre>

      <ul>
<li><strong>BEGIN</strong> = mulai; <strong>COMMIT</strong> = sukses permanen; <strong>ROLLBACK</strong> = batal total.</li>
<li><strong>Di SQLite:</strong> tiap statement = transaksi sendiri (autocommit) kecuali BEGIN eksplisit.</li>
<li><strong>Di aplikasi:</strong> gunakan transaksi untuk operasi multi-statement yang harus atomik.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;COMMIT membuat data langsung aman dari segala bencana.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Durability = tahan crash (write-ahead log), bukan tahan <em>bencana</em> (kebakaran data center!). Butuh backup + replikasi untuk itu (C16). ACID ≠ disaster recovery.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan praktis: <strong>satu unit bisnis = satu transaksi</strong>. Transfer = 1 transaksi. Pipeline load harian = 1 transaksi (gagal di tengah = rollback, bukan data setengah!).</p>
</div>

      <h2 id="isolation">Isolation Level — Seberapa Terpisah?</h2>

      <p>Dua transaksi jalan bersamaan → anomali. Level menentukan proteksi (vs performa):</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Anomali</th><th>Contoh</th><th>Dicegah oleh</th></tr></thead>
<tbody>
<tr><td>Dirty read</td><td>Baca data yang belum di-commit (lalu di-rollback!)</td><td>READ COMMITTED+</td></tr>
<tr><td>Non-repeatable read</td><td>Baca 2× hasil beda (di-update orang)</td><td>REPEATABLE READ+</td></tr>
<tr><td>Phantom read</td><td>Baris baru muncul di tengah hitung</td><td>SERIALIZABLE</td></tr>
</tbody>
</table>
</div>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Level</th><th>Proteksi</th><th>Kapan</th></tr></thead>
<tbody>
<tr><td>READ COMMITTED</td><td>Anti dirty read</td><td>Default umum; laporan biasa</td></tr>
<tr><td>REPEATABLE READ</td><td>+ baca konsisten</td><td>Laporan yang hitung berulang</td></tr>
<tr><td>SERIALIZABLE</td><td>Maksimal (seolah serial)</td><td>Transfer dana; kritis</td></tr>
</tbody>
</table>
</div>

      <p><strong>Untuk analis:</strong> laporan yang angkanya &ldquo;berubah-ubah&rdquo; saat di-refresh = kemungkinan isolation rendah + data ditulis bersamaan. Solusi: baca dari <strong>snapshot</strong> (warehouse!) bukan tabel live.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Deadlock: dua transaksi saling tunggu (A kunci X tunggu Y; B kunci Y tunggu X). Database membunuh salah satu (error!) — aplikasi harus <strong>retry</strong>. Kenali error-nya agar tidak panik.</p>
</div>

      <h2 id="pipeline">Implikasi untuk Pipeline &amp; Laporan</h2>

      <ul>
<li><strong>Load atomik:</strong> ETL harian dalam 1 transaksi — gagal = tabel tetap kemarin (konsisten!), bukan setengah hari ini.</li>
<li><strong>Swap pola:</strong> tulis ke tabel_temp → dalam transaksi: DROP/Rename — pembaca tak pernah lihat tabel setengah jadi.</li>
<li><strong>Laporan konsisten:</strong> baca multi-tabel dalam 1 transaksi REPEATABLE READ — angka antar tabel cocok.</li>
<li><strong>Idempotensi:</strong> pipeline bisa di-rerun aman (C16 dbt: <code className="inline">unique_key</code> merge!).</li>
</ul>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- pola swap atomik (pembaca tak pernah lihat setengah jadi)
BEGIN;
  DROP TABLE IF EXISTS mart_npl_old;
  ALTER TABLE mart_npl RENAME TO mart_npl_old;
  ALTER TABLE mart_npl_new RENAME TO mart_npl;
COMMIT;</pre>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Transaksi membuat segalanya lambat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Transaksi <em>pendek</em> (detik) = murah. Yang mahal = transaksi <em>panjang</em> (menit, menahan lock). Aturan: <strong>transaksi sependek mungkin</strong> — jangan taruh sleep/API call di dalamnya!</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Insiden 'Setengah Jalan' per Hari (ilustrasi)"
  layout={{"yaxis": {"title": "Kasus"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kasus transfer gagal sebagian sebelum vs sesudah transaksi.</p>
<p><strong>Interpretasi:</strong> Transaksi menghilangkan <em>seluruh kelas</em> bug — bukan mengurangi, tapi <strong>menghilangkan</strong>. Inilah kekuatan jaminan (guarantee) vs usaha (best-effort). Pilih jaminan untuk uang orang.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Transaksi = &ldquo;semua atau tidak sama sekali&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Transfer Rp10 juta — tulis transaksinya</summary>
              <p>Kurangi A, tambah B. Jika langkah 2 gagal, langkah 1 harus batal.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">BEGIN;
        UPDATE rekening SET saldo = saldo - 10000000 WHERE id = &#x27;A&#x27;;
        -- cek: saldo tidak boleh negatif!
        -- (jika aplikasi mendeteksi gagal -&gt; ROLLBACK)
        UPDATE rekening SET saldo = saldo + 10000000 WHERE id = &#x27;B&#x27;;
      COMMIT;  -- baru sekarang permanen
      -- Jika koneksi putus di tengah: otomatis ROLLBACK -&gt; A utuh.</pre>
              <p><strong>Bedah:</strong> sebelum COMMIT, semua perubahan <em>sementara</em> (hanya terlihat di transaksimu). Atomicity = &ldquo;Rp10 juta tidak bisa hilang di tengah jalan&rdquo;. Tanpa BEGIN/COMMIT, tiap statement auto-commit sendiri — dan &ldquo;setengah jalan&rdquo; menjadi mungkin.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Dua teller, satu rekening — lost update</summary>
              <p>Saldo Rp5 juta. Teller 1 tarik Rp3 juta; teller 2 tarik Rp4 juta — bersamaan. Tanpa transaksi yang benar?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Keduanya baca 5jt -&gt; T1 tulis 2jt; T2 tulis 1jt (menimpa!)
      -- Hasil: 1jt. Seharusnya: 5-3-4 = -2jt -&gt; salah satu DITOLAK.
      -- Solusi: UPDATE atomik + constraint!
      BEGIN;
        UPDATE rekening SET saldo = saldo - 3000000 WHERE id = &#x27;X&#x27;;
        -- baris dikunci (row lock) sampai COMMIT -&gt; T2 menunggu
      COMMIT;
      ALTER TABLE rekening ADD CONSTRAINT saldo_ok CHECK (saldo &gt;= 0);</pre>
              <p><strong>Bedah:</strong> <code className="inline">saldo = saldo - X</code> (bukan baca-lalu-tulis di aplikasi!) + row lock = tidak ada lost update. CHECK constraint = aturan bisnis di database — lapisan pertahanan terakhir yang tidak bisa di-bypass aplikasi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: ETL harian — idempotent, bukan sekadar transaksional</summary>
              <p>Job ETL memuat 2 juta baris tiap malam. Job crash di 90% lalu dijalankan ulang. Tanpa desain benar: duplikat 1,8 juta baris!</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">BEGIN;
        -- 1. Hapus partisi hari ini dulu (jika ada sisa crash kemarin)
        DELETE FROM mart_harian WHERE tanggal = CURRENT_DATE - 1;
        -- 2. Muat ulang penuh untuk tanggal itu
        INSERT INTO mart_harian SELECT ... WHERE tanggal = CURRENT_DATE - 1;
      COMMIT;
      -- Dijalankan 1x atau 5x -&gt; hasil SAMA. = idempotent.</pre>
              <p><strong>Bedah:</strong> transaksi (ACID) melindungi <em>satu</em> eksekusi; idempotensi melindungi <em>eksekusi berulang</em> (retry!). &ldquo;DELETE lalu INSERT per partisi dalam satu transaksi&rdquo; = pola ETL kanonis. Tanpa ini, setiap retry = duplikat = laporan salah = C15 menangis.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: ROLLBACK Menyelamatkan</h2>

      <p>BEGIN → INSERT nasabah baru → ROLLBACK. Buktikan barisnya hilang! Lalu ulangi dengan COMMIT.</p>

      <PyodideLab
  title="Lab 1 — Batalkan Transaksi"
  hint="Cek COUNT(*) sebelum &amp; sesudah. Ke mana perginya INSERT yang di-rollback?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">BEGIN;
INSERT INTO nasabah VALUES (99, &#x27;Zara&#x27;, &#x27;Jakarta&#x27;, 10000000, 0, &#x27;lancar&#x27;);
SELECT COUNT(*) FROM nasabah;  -- 11
ROLLBACK;
SELECT COUNT(*) FROM nasabah;  -- 10 (hilang!)</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Transfer Atomik</h2>

      <p>Tabel rekening(A: 50jt, B: 20jt). Transfer 10jt A→B dalam transaksi. Lalu simulasikan gagal di tengah + ROLLBACK.</p>

      <PyodideLab
  title="Lab 2 — Simulasi Transfer"
  hint="Apa yang terjadi jika COMMIT setelah update pertama tapi sebelum kedua? (Jangan lakukan di produksi!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">BEGIN;
UPDATE rekening SET saldo = saldo - 10000000 WHERE id = &#x27;A&#x27;;
UPDATE rekening SET saldo = saldo + 10000000 WHERE id = &#x27;B&#x27;;
COMMIT;
SELECT * FROM rekening;  -- A:40jt, B:30jt (konsisten)</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Transaksi</h2>

      <div className="decision-card">
<h3>1. Multi-statement satu unit bisnis → <strong>transaksi</strong></h3>
<p><strong>Kondisi data:</strong> Atomik.</p>
<p><strong>Kenapa:</strong> Semua atau tidak sama sekali.</p>
<p><strong>Contoh nyata:</strong> Transfer dana.</p>
</div>

      <div className="decision-card">
<h3>2. Error di tengah → <strong>ROLLBACK</strong></h3>
<p><strong>Kondisi data:</strong> Batal.</p>
<p><strong>Kenapa:</strong> Jangan biarkan setengah jalan.</p>
<p><strong>Contoh nyata:</strong> Validasi gagal.</p>
</div>

      <div className="decision-card">
<h3>3. Load pipeline → <strong>1 transaksi / swap</strong></h3>
<p><strong>Kondisi data:</strong> Konsisten.</p>
<p><strong>Kenapa:</strong> Gagal = data kemarin utuh.</p>
<p><strong>Contoh nyata:</strong> ETL harian.</p>
</div>

      <div className="decision-card">
<h3>4. Laporan multi-tabel → <strong>REPEATABLE READ / snapshot</strong></h3>
<p><strong>Kondisi data:</strong> Konsisten baca.</p>
<p><strong>Kenapa:</strong> Angka antar tabel cocok.</p>
<p><strong>Contoh nyata:</strong> Laporan keuangan.</p>
</div>

      <div className="decision-card">
<h3>5. Transaksi panjang → <strong>pendekkan!</strong></h3>
<p><strong>Kondisi data:</strong> Lock.</p>
<p><strong>Kenapa:</strong> Tahan lock = blokir orang lain.</p>
<p><strong>Contoh nyata:</strong> Jangan sleep/API di dalam.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Satu unit bisnis = satu transaksi.</li><li>Error → ROLLBACK, bukan &ldquo;lanjutkan&rdquo;.</li><li>Transaksi sependek mungkin.</li><li>Pipeline: idempoten + atomik.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Pipeline Setengah Jalan</h2>

      <div className="callout">
<p><strong>Situasi:</strong> ETL harian gagal di langkah 7 dari 10 (disk penuh). Tabel mart terisi <strong>setengah</strong> — dashboard menampilkan angka campur kemarin + hari ini. Direksi sudah screenshot.</p><p><strong>Tugas:</strong> (1) Apa yang salah dari desain pipeline? (2) Rancang ulang dengan transaksi/swap. (3) Bagaimana mencegah &ldquo;sudah screenshot&rdquo; terulang? (4) Tulis penjelasan 3 kalimat untuk direksi.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> Load langsung ke tabel live tanpa transaksi — gagal = setengah jadi terlihat.</p><p><strong>(2)</strong> Tulis ke <code className="inline">mart_new</code> → validasi (recon!) → <strong>swap atomik</strong> dalam transaksi. Gagal kapanpun = tabel live tetap kemarin.</p><p><strong>(3)</strong> Dashboard baca dari tabel live saja + <strong>data freshness indicator</strong> (&ldquo;data per 06:00&rdquo;) — screenshot pun berlabel waktu.</p><p><strong>(4)</strong> &ldquo;Pipeline gagal di tengah menyebabkan data tercampur. Kami beralih ke pola swap atomik: dashboard hanya melihat data yang lolos validasi penuh. Angka terkoreksi terlampir.&rdquo;</p><p><strong>Pelajaran:</strong> keandalan = <strong>desain</strong>, bukan harapan. Transaksi + swap + recon = pipeline yang tidur nyenyak.</p>
</details>
</div>

      <div className="callout">
<h3>🎓 Track C Selesai!</h3><p>Kamu menempuh 19 lesson: SELECT → NULL → agregasi → fungsi → JOIN → subquery → CTE → himpunan → window (2 part) → pola analisis → cohort → rekursi → risk (DPD/fraud) → quality → modeling → index → ACID. <strong>Selanjutnya: Track D — Python for Data Analysis</strong>, di mana SQL bertemu Python (D15).</p>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Apa beda ROLLBACK manual vs crash otomatis? Kapan kamu pakai SAVEPOINT?</li>
              <li>Dua transaksi: T1 membaca A lalu B; T2 membaca B lalu A (deadlock klasik). Apa yang dilakukan database? Bagaimana mencegahnya di aplikasi?</li>
              <li>Mengapa laporan keuangan memakai isolation level lebih ketat saat <em>closing</em>? Apa harganya?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> ROLLBACK manual = keputusan aplikasi (&ldquo;validasi gagal, batalkan&rdquo;); crash = database otomatis rollback transaksi yang belum COMMIT. SAVEPOINT = &ldquo;pos simpanan&rdquo; di tengah transaksi: <code className="inline">SAVEPOINT s1; ... ROLLBACK TO s1;</code> — batalkan <em>sebagian</em> tanpa mengulang dari awal. Berguna untuk batch: 1 baris gagal tidak menggagalkan 999 lainnya.</p>
              <p><strong>2.</strong> Database memilih satu sebagai <strong>korban deadlock</strong> (error &ldquo;deadlock detected&rdquo;, otomatis rollback) — aplikasi harus <em>retry</em>. Pencegahan: akses tabel/baris dalam <strong>urutan yang sama</strong> di semua transaksi (selalu A lalu B) — deadlock butuh siklus; tanpa siklus, tidak ada deadlock.</p>
              <p><strong>3.</strong> Saat closing, angka harus <em>stabil</em> (repeatable read/serializable): dua baca harus sama — jika tidak, laporan berubah-ubah saat dihitung. Harganya: <strong>locking/waiting</strong> — transaksi lain antre, throughput turun. Di luar closing, baca biasa (read committed) cukup.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>ACID:</strong> Atomicity, Consistency, Isolation, Durability.</li><li><strong>BEGIN/COMMIT/ROLLBACK:</strong> satu unit bisnis = satu transaksi.</li><li><strong>Isolation:</strong> dirty/non-repeatable/phantom read; level = trade-off proteksi vs performa.</li><li><strong>Pipeline:</strong> atomik + swap + idempoten; laporan dari snapshot.</li><li><strong>Track C selesai — 19 lesson!</strong> Lanjut D: Python.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c17-index-explain" className="btn btn-secondary btn-sm">← ← C17</Link>
        <Link href="/learn/d1-python-dasar" className="btn btn-primary btn-sm">Next: D1 → →</Link>
      </div>
    </div>
  );
}

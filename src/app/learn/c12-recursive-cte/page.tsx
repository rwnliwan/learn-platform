import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C12RecursiveCtePage() {
  const chart1 = [{"x": ["A", "B", "C", "D", "E"], "y": [0, 1, 2, 3, 4], "type": "bar", "marker": {"color": "#ef4444"}, "text": ["anchor", "depth 1", "depth 2", "depth 3", "depth 4"], "textposition": "outside"}];
  const lab1Code = String.raw`import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE karyawan (id INTEGER PRIMARY KEY, nama TEXT, atasan_id INTEGER)""")
data_karyawan = [
    (1, 'Rina', None),
    (2, 'Budi', 1),
    (3, 'Sari', 1),
    (4, 'Agus', 2),
    (5, 'Dewi', 2),
    (6, 'Joko', 3)
]
cur.executemany("INSERT INTO karyawan VALUES (?,?,?)", data_karyawan)
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
# WITH RECURSIVE hier AS (SELECT id, nama, 0 AS level, nama AS path FROM karyawan WHERE atasan_id IS NULL UNION ALL SELECT k.id, k.nama, h.level+1, h.path||' > '||k.nama FROM hier h JOIN karyawan k ON k.atasan_id=h.id) SELECT * FROM hier
q("""SELECT * FROM karyawan""")`;
  const lab2Code = String.raw`import sqlite3
db = sqlite3.connect(":memory:")
cur = db.cursor()
cur.executescript("""CREATE TABLE transfer (pengirim TEXT, penerima TEXT, jumlah REAL)""")
data_transfer = [
    ('A', 'B', 5000000),
    ('B', 'C', 4900000),
    ('C', 'D', 4800000),
    ('D', 'B', 100000),
    ('A', 'E', 2000000)
]
cur.executemany("INSERT INTO transfer VALUES (?,?,?)", data_transfer)
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
# WITH RECURSIVE j(node, d, path) AS (SELECT 'A', 0, 'A' UNION SELECT t.penerima, j.d+1, j.path||'->'||t.penerima FROM j JOIN transfer t ON t.pengirim=j.node WHERE j.d<6 AND instr(j.path, t.penerima)=0) SELECT * FROM j
q("""SELECT * FROM transfer""")`;
  const quizData = [{"question": "Tiga bagian recursive CTE…", "options": ["SELECT, WHERE, ORDER BY", "Anchor, rekursi (UNION ALL), terminasi", "JOIN, GROUP BY, HAVING", "WITH, CASE, LIMIT"], "correct": 1, "explanation": "Benar: titik awal, perluasan, kondisi berhenti."}, {"question": "Tanpa kondisi berhenti…", "options": ["Error langsung", "Berisiko rekursi tak berujung / hang", "Hasil kosong", "Otomatis berhenti di 100"], "correct": 1, "explanation": "Benar: selalu pasang batas kedalaman."}, {"question": "Mencegah cycle A→B→A→B…", "options": ["ORDER BY", "Path tracking (instr) + UNION", "LIMIT", "DISTINCT"], "correct": 1, "explanation": "Benar: lacak path yang dikunjungi, tolak yang sudah ada."}, {"question": "Semua bawahan Budi (id=2)…", "options": ["Anchor = puncak", "Anchor = Budi (id=2), JOIN ke bawah", "Tidak bisa", "Pakai LAG"], "correct": 1, "explanation": "Benar: anchor menentukan subtree."}, {"question": "UNION vs UNION ALL di recursive CTE graf…", "options": ["Sama", "UNION dedup (cegah cycle, lambat); ALL cepat tapi butuh guard", "ALL cegah cycle", "UNION error"], "correct": 1, "explanation": "Benar: pilih berdasar butuh kecepatan vs keamanan."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C12 — SQL</span>
        <h1 className="display-title">Recursive CTE Mendalam:<br/>Hierarki, Graf &amp; Jalan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Jaringan Rekening Mencurigakan</a></li>
          <li><a href="#anatomi">Anatomi Recursive CTE</a></li>
          <li><a href="#hierarki">Hierarki — Level &amp; Path</a></li>
          <li><a href="#graf">Graf — Jaringan Transfer (Jembatan ke Fraud)</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hierarki Karyawan</a></li>
          <li><a href="#lab2">🔬 Lab 2: Ikuti Rantai Transfer</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Rekursi</a></li>
          <li><a href="#case">📋 Mini-Case: Skor Kecurigaan Rantai</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menulis <strong>recursive CTE</strong> lengkap: anchor, rekursi, terminasi.</li><li>Menjelajahi <strong>hierarki</strong> (org chart, kategori) dengan level &amp; path.</li><li>Menelusuri <strong>graf</strong> (jaringan transfer = pola fraud/AML!).</li><li>Menghindari <strong>rekursi tak berujung</strong> (cycle).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Jaringan Rekening Mencurigakan</h2>

      <div className="story"><p>Tim fraud menemukan: rekening A transfer ke B, B ke C, C ke D... <strong>rantai 8 rekening</strong> yang semuanya baru dibuka minggu ini — pola <em>money mule</em> klasik. Query biasa tidak bisa &ldquo;mengikuti rantai&rdquo; — panjangnya tidak diketahui!</p><p>Recursive CTE mengikuti rantai <strong>sepanjang apapun</strong>: dari A, temukan semua yang terjangkau. Ini jembatan ke analisis jaringan (C14, fraud) — dan satu-satunya cara SQL murni menelusuri hierarki/graf.</p><p><strong>Twist-nya:</strong> SQL — bahasa yang &ldquo;tidak bisa loop&rdquo; — ternyata bisa mengikuti rantai 8 rekening money mule. Recursive CTE adalah <em>loop yang menyamar sebagai query</em>. Dan ironinya: pola jahat yang mencoba bersembunyi lewat rantai panjang justru paling mudah ditangkap oleh satu query rekursif. Semakin panjang mereka bersembunyi, semakin jelas jejaknya bagi yang tahu cara mengikuti.</p></div>

      <h2 id="anatomi">Anatomi Recursive CTE</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE rantai AS (
  -- ANCHOR: titik awal
  SELECT pengirim AS node, penerima AS next, 1 AS kedalaman
  FROM transfer WHERE pengirim = &#x27;A&#x27;
  UNION ALL
  -- REKURSI: perluas dari hasil sebelumnya
  SELECT r.next, t.penerima, r.kedalaman + 1
  FROM rantai r
  JOIN transfer t ON t.pengirim = r.next
  WHERE r.kedalaman &lt; 10  -- TERMINASI: batas!
)
SELECT * FROM rantai;</pre>

      <ul>
<li><strong>Anchor:</strong> SELECT awal (tanpa merujuk CTE).</li>
<li><strong>Rekursi:</strong> SELECT yang merujuk CTE + <code className="inline">UNION ALL</code>.</li>
<li><strong>Terminasi:</strong> kondisi berhenti (kedalaman max / tidak ada baris baru).</li>
<li>Eksekusi: anchor → hasilnya diumpankan ke rekursi → berulang hingga kosong.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;UNION vs UNION ALL sama saja di recursive CTE.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda penting! UNION (dedup) mencegah <strong>cycle tak berujung</strong> (A→B→A→B...) tapi lebih lambat; UNION ALL cepat tapi butuh guard kedalaman. Untuk graf yang mungkin ber-cycle, <strong>UNION atau path-tracking</strong> wajib.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Selalu tambahkan <strong>batas kedalaman</strong> (<code className="inline">WHERE kedalaman &lt; N</code>) bahkan jika yakin tak ada cycle — pertahanan berlapis. Query yang hang di produksi = insiden.</p>
</div>

      <h2 id="hierarki">Hierarki — Level &amp; Path</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- tabel: karyawan(id, nama, atasan_id)
WITH RECURSIVE hier AS (
  SELECT id, nama, atasan_id, 0 AS level,
         nama AS path
  FROM karyawan WHERE atasan_id IS NULL  -- puncak
  UNION ALL
  SELECT k.id, k.nama, k.atasan_id, h.level + 1,
         h.path || &#x27; &gt; &#x27; || k.nama
  FROM hier h JOIN karyawan k ON k.atasan_id = h.id
)
SELECT id, nama, level, path FROM hier;</pre>

      <ul>
<li><strong>level:</strong> kedalaman (0 = puncak) — untuk indentasi/laporan.</li>
<li><strong>path:</strong> rantai nama (materialized path) — untuk tampil &amp; filter subtree.</li>
<li><strong>Kapan:</strong> org chart, kategori produk bertingkat, bill of materials.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Butuh &ldquo;semua bawahan X&rdquo;? Anchor = X, bukan puncak. Butuh &ldquo;semua atasan Y&rdquo;? Balik arah JOIN (naik, bukan turun). Recursive CTE dua arah.</p>
</div>

      <h2 id="graf">Graf — Jaringan Transfer (Jembatan ke Fraud)</h2>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- semua rekening terjangkau dari &#x27;A&#x27; (komponen terhubung)
WITH RECURSIVE jangkau(node, kedalaman, path) AS (
  SELECT &#x27;A&#x27;, 0, &#x27;A&#x27;
  UNION
  SELECT t.penerima, j.kedalaman + 1, j.path || &#x27;-&gt;&#x27; || t.penerima
  FROM jangkau j JOIN transfer t ON t.pengirim = j.node
  WHERE j.kedalaman &lt; 6
    AND instr(j.path, t.penerima) = 0  -- hindari cycle!
)
SELECT * FROM jangkau;</pre>

      <ul>
<li><strong>Path tracking:</strong> <code className="inline">instr(path, node) = 0</code> mencegah kunjungan ulang (cycle).</li>
<li><strong>UNION</strong> (bukan ALL) sebagai pengaman kedua.</li>
<li><strong>Di fraud (C14):</strong> pola ini menemukan jaringan mule, fan-in/fan-out, cycle transfer.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Analisis jaringan harus pakai Python/Neo4j.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Untuk eksplorasi awal dan pola sederhana, recursive CTE cukup — dan datanya tidak perlu keluar database. Pindah ke graph DB/Python saat butuh algoritma berat (PageRank, community detection).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Penelusuran Rantai: Kedalaman per Node (ilustrasi)"
  layout={{"xaxis": {"title": "Rekening"}, "yaxis": {"title": "Kedalaman dari A"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi = langkah dari anchor A mengikuti arah transfer.</p>
<p><strong>Interpretasi:</strong> Rantai lurus 4 langkah, semua rekening baru — <strong>skor kecurigaan tinggi</strong>. Recursive CTE mengubah &ldquo;ikuti uangnya&rdquo; dari intuisi menjadi query. (C14 mendalami pola fraud-nya.)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Rekursi = &ldquo;anchor + langkah yang mengulang&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Rantai transfer — 3 hop dari A</summary>
              <p><code className="inline">transfer(dari, ke, nominal)</code>. Temukan semua rekening yang terjangkau dari &#x27;A&#x27; dalam ≤ 3 hop + total hop-nya.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE rantai AS (
        -- anchor: hop 0
        SELECT ke AS node, 1 AS hop FROM transfer WHERE dari = &#x27;A&#x27;
        UNION
        -- langkah rekursif: perluas 1 hop
        SELECT t.ke, r.hop + 1
        FROM rantai r JOIN transfer t ON t.dari = r.node
        WHERE r.hop &lt; 3
      )
      SELECT node, MIN(hop) AS hop_terdekat FROM rantai GROUP BY node;</pre>
              <p><strong>Bedah:</strong> anchor = titik mulai; bagian rekursif join ke hasil <em>sebelumnya</em> (r). <code className="inline">WHERE r.hop &lt; 3</code> = rem (tanpa ini: loop tak berhingga jika ada cycle A→B→A!). <code className="inline">MIN(hop)</code>: satu node bisa dicapai via banyak rute — ambil terdekat.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Hierarki karyawan — level &amp; path</summary>
              <p><code className="inline">karyawan(id, nama, atasan_id)</code>. Tampilkan tiap karyawan + levelnya + path dari direktur.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE hier AS (
        SELECT id, nama, 0 AS level, nama AS path
        FROM karyawan WHERE atasan_id IS NULL   -- direktur
        UNION ALL
        SELECT k.id, k.nama, h.level + 1, h.path || &#x27; &gt; &#x27; || k.nama
        FROM hier h JOIN karyawan k ON k.atasan_id = h.id
      )
      SELECT nama, level, path FROM hier ORDER BY path;</pre>
              <p><strong>Bedah:</strong> path diakumulasi sebagai string (<code className="inline">h.path || &#x27; &gt; &#x27; || k.nama</code>) — &ldquo;Direktur &gt; VP &gt; Manager&rdquo;. UNION ALL (bukan UNION): baris unik pasti, hemat sort-dedupe. ORDER BY path = urutan hierarki yang terbaca.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Deret — Fibonacci tanpa tabel</summary>
              <p>Bangkitkan 10 bilangan Fibonacci murni dari SQL (tanpa tabel sumber!).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE fib(a, b, n) AS (
        SELECT 0, 1, 1
        UNION ALL
        SELECT b, a + b, n + 1 FROM fib WHERE n &lt; 10
      )
      SELECT a FROM fib;  -- 0,1,1,2,3,5,8,13,21,34</pre>
              <p><strong>Bedah:</strong> rekursi tidak butuh tabel — anchor = baris literal! Kolom <code className="inline">n</code> = counter + rem. Pola ini dipakai untuk generate deret tanggal (kalender!), angka urut, dan testing. &ldquo;SQL tidak bisa loop&rdquo; = mitos yang baru saja kamu patahkan.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Hierarki Karyawan</h2>

      <p>Tabel karyawan (id, nama, atasan_id) tersedia. Tampilkan hierarki lengkap dengan level &amp; path.</p>

      <PyodideLab
  title="Lab 1 — Org Chart dengan Level &amp;amp; Path"
  hint="Ubah anchor: tampilkan hanya subtree Budi (id=2)."
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE hier AS (
  SELECT id, nama, 0 AS level, nama AS path
  FROM karyawan WHERE atasan_id IS NULL
  UNION ALL
  SELECT k.id, k.nama, h.level + 1, h.path || &#x27; &gt; &#x27; || k.nama
  FROM hier h JOIN karyawan k ON k.atasan_id = h.id
)
SELECT * FROM hier;
-- subtree Budi: ganti anchor WHERE id = 2</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Ikuti Rantai Transfer</h2>

      <p>Tabel transfer(pengirim, penerima, jumlah). Dari 'A', temukan semua rekening terjangkau + kedalamannya. Waspadai cycle!</p>

      <PyodideLab
  title="Lab 2 — Jangkauan dari Rekening A"
  hint="Perhatikan: D→B adalah cycle. Apa yang terjadi tanpa guard instr()?"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH RECURSIVE j(node, d, path) AS (
  SELECT &#x27;A&#x27;, 0, &#x27;A&#x27;
  UNION
  SELECT t.penerima, j.d + 1, j.path || &#x27;-&gt;&#x27; || t.penerima
  FROM j JOIN transfer t ON t.pengirim = j.node
  WHERE j.d &lt; 6 AND instr(j.path, t.penerima) = 0
)
SELECT * FROM j;
-- tanpa guard: B-&gt;C-&gt;D-&gt;B-&gt;C... tak berujung (UNION saja tidak cukup jika path beda)!</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Rekursi</h2>

      <div className="decision-card">
<h3>1. Hierarki turun (bawahan) → <strong>anchor puncak, JOIN anak</strong></h3>
<p><strong>Kondisi data:</strong> Org chart.</p>
<p><strong>Kenapa:</strong> Level + path untuk tampil.</p>
<p><strong>Contoh nyata:</strong> Semua bawahan direktur.</p>
</div>

      <div className="decision-card">
<h3>2. Hierarki naik (atasan) → <strong>anchor node, JOIN induk</strong></h3>
<p><strong>Kondisi data:</strong> Rantai komando.</p>
<p><strong>Kenapa:</strong> Balik arah JOIN.</p>
<p><strong>Contoh nyata:</strong> Atasan-atasan Budi.</p>
</div>

      <div className="decision-card">
<h3>3. Jaringan/graf → <strong>path tracking + batas</strong></h3>
<p><strong>Kondisi data:</strong> Fraud/AML.</p>
<p><strong>Kenapa:</strong> Cegah cycle; UNION sebagai pengaman.</p>
<p><strong>Contoh nyata:</strong> Jangkauan dari rekening A.</p>
</div>

      <div className="decision-card">
<h3>4. Deret (tanggal/angka) → <strong>anchor + increment</strong></h3>
<p><strong>Kondisi data:</strong> Spine.</p>
<p><strong>Kenapa:</strong> Kondisi berhenti eksplisit.</p>
<p><strong>Contoh nyata:</strong> Date spine (C7).</p>
</div>

      <div className="decision-card">
<h3>5. Ragu ada cycle → <strong>UNION + guard kedalaman</strong></h3>
<p><strong>Kondisi data:</strong> Aman.</p>
<p><strong>Kenapa:</strong> Pertahanan berlapis.</p>
<p><strong>Contoh nyata:</strong> Selalu, di produksi.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Anchor + rekursi + <strong>terminasi</strong> — tiga wajib.</li><li>Batas kedalaman selalu, bahkan jika yakin aman.</li><li>Graf: path tracking anti-cycle.</li><li>Untuk algoritma graf berat → pindah ke Python/graph DB.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Skor Kecurigaan Rantai</h2>

      <div className="callout">
<p>Tim fraud ingin <strong>skor</strong> tiap rantai dari A: +1 per langkah, +2 jika penerima &lt; 30 hari (rekening baru — butuh JOIN ke nasabah!), −1 jika jumlah menyusut &gt; 50% (biaya normal?).</p><p><strong>Pertanyaan:</strong> rancang query-nya (boleh pseudo-SQL). Komponen apa saja yang digabung?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Komponen:</strong> (1) recursive CTE untuk rantai + kedalaman + path; (2) JOIN ke nasabah untuk umur rekening; (3) CASE untuk skor per langkah; (4) agregat SUM skor per rantai; (5) ambang (HAVING skor &gt; X) untuk alert.</p><p><strong>Pelajaran:</strong> recursive CTE = <em>mesin penjelajah</em>; logika bisnis (skor) = CASE + agregat di atasnya. Pisahkan &ldquo;jelajah&rdquo; dari &ldquo;nilai&rdquo; — query tetap terbaca. Pola lengkapnya di C14.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Apa yang terjadi jika <code className="inline">WHERE r.hop &lt; 3</code> dihapus dari kasus 1 dan ada cycle A→B→A? Bagaimana mencegahnya <em>tanpa</em> batas hop?</li>
              <li>Modifikasi kasus 2: tampilkan juga <em>jumlah bawahan langsung</em> tiap karyawan.</li>
              <li>Tulis recursive CTE yang membangkitkan semua tanggal Januari 2026.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Rekursi tak berhingga → query tidak selesai (atau error depth limit). Tanpa batas hop: lacak path yang sudah dikunjungi (<code className="inline">path NOT LIKE &#x27;%&#x27; || t.ke || &#x27;%&#x27;</code>) — berhenti saat node sudah ada di path (cycle detection).</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 2. Bawahan langsung = COUNT dari sisi anak:
      SELECT h.nama, h.level, COUNT(k.id) AS bawahan_langsung
      FROM hier h LEFT JOIN karyawan k ON k.atasan_id = h.id
      GROUP BY h.nama, h.level;
      -- 3. Deret tanggal:
      WITH RECURSIVE kal AS (
        SELECT DATE &#x27;2026-01-01&#x27; AS t
        UNION ALL
        SELECT t + 1 FROM kal WHERE t &lt; DATE &#x27;2026-01-31&#x27;
      )
      SELECT t FROM kal;</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Anatomi:</strong> anchor + rekursi + terminasi.</li><li><strong>Hierarki:</strong> level &amp; path; anchor bisa puncak/node (dua arah).</li><li><strong>Graf:</strong> path tracking anti-cycle — fondasi analisis jaringan fraud.</li><li><strong>Aman:</strong> batas kedalaman selalu; UNION untuk graf ber-cycle.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c11-cohort-retention-funnel" className="btn btn-secondary btn-sm">← ← C11</Link>
        <Link href="/learn/c13-risiko-dpd-rollrate" className="btn btn-primary btn-sm">Next: C13 →</Link>
      </div>
    </div>
  );
}

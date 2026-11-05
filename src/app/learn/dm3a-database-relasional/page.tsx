"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM3APage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const indexData = [
    {
      x: ["Full scan (tanpa index)", "B-tree index"],
      y: [1000000, 20],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["1.000.000 baris dicek", "~20 langkah"],
      textposition: "outside",
    },
  ];

  const isolationData = [
    {
      x: ["Read Committed", "Repeatable Read", "Serializable"],
      y: [3, 2, 1],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#ef4444"] },
      text: ["cepat, anomali mungkin", "seimbang", "paling aman, paling lambat"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: ACID dalam aksi — transfer Rp1 juta, lalu SIMULASIKAN gagal di tengah
import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE rekening (id TEXT PRIMARY KEY, saldo INTEGER)")
db.execute("INSERT INTO rekening VALUES ('A', 5000000), ('B', 1000000)")

def transfer(db, dari, ke, nominal, gagal_di_tengah=False):
    try:
        db.execute("BEGIN")
        db.execute("UPDATE rekening SET saldo = saldo - ? WHERE id = ?", (nominal, dari))
        if gagal_di_tengah:
            raise RuntimeError("Koneksi putus setelah debit!")
        db.execute("UPDATE rekening SET saldo = saldo + ? WHERE id = ?", (nominal, ke))
        db.execute("COMMIT")
        print("Transfer BERHASIL.")
    except Exception as e:
        db.execute("ROLLBACK")
        print(f"GAGAL ({e}) -> ROLLBACK: semua dibatalkan.")

def cek():
    rows = db.execute("SELECT * FROM rekening").fetchall()
    total = sum(r[1] for r in rows)
    print("  Saldo:", rows, "| TOTAL:", total, "(harus tetap 6.000.000)")

print("== Skenario 1: transfer normal ==")
transfer(db, "A", "B", 1000000); cek()
print()
print("== Skenario 2: gagal SETELAH debit, SEBELUM kredit ==")
transfer(db, "A", "B", 1000000, gagal_di_tengah=True); cek()
print()
print("Tanpa ACID (tanpa BEGIN/ROLLBACK), skenario 2 menghilangkan Rp1 juta dari total.")
print("Coba: ubah nominal jadi 9000000 (saldo A tidak cukup) — apa yang terjadi?")`;

  const lab2Code = `# Lab 2: Index — dari 1 juta baris dicek jadi ~20 langkah
import sqlite3, time, random
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE transaksi (id INTEGER PRIMARY KEY, nasabah_id TEXT, nominal INTEGER)")
random.seed(42)
db.executemany("INSERT INTO transaksi (nasabah_id, nominal) VALUES (?, ?)",
               [(f"N{random.randint(1,50000):05d}", random.randint(10000, 5000000)) for _ in range(200000)])
db.commit()

def timed(sql):
    t0 = time.time(); n = db.execute(sql).fetchall(); dt = time.time() - t0
    return len(n), dt

print("Rencana tanpa index:", db.execute(
    "EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id='N01234'").fetchall())
n, dt = timed("SELECT * FROM transaksi WHERE nasabah_id='N01234'")
print(f"Tanpa index: {n} baris dalam {dt*1000:.1f} ms (full scan)")
print()
db.execute("CREATE INDEX idx_nasabah ON transaksi(nasabah_id)")
print("Rencana dengan index:", db.execute(
    "EXPLAIN QUERY PLAN SELECT * FROM transaksi WHERE nasabah_id='N01234'").fetchall())
n, dt = timed("SELECT * FROM transaksi WHERE nasabah_id='N01234'")
print(f"Dengan index: {n} baris dalam {dt*1000:.1f} ms")
print()
print("Coba: cari nominal = 123456 (tanpa index di kolom nominal) — kembali lambat?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM3A — Data Management</span>
        <h1 className="display-title">Database Relasional & ACID:<br />Penjaga Uang yang Tidak Pernah Tidur</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp1 Juta yang Menguap</a></li>
          <li><a href="#relasional">Model Relasional — Si Akuntan Tua yang Teliti</a></li>
          <li><a href="#acid">ACID — Empat Sumpah Transaksi</a></li>
          <li><a href="#isolasi">Level Isolasi — Seberapa Paranoid Kamu?</a></li>
          <li><a href="#index">Index — Daftar Isi Buku Setebal 1 Juta Halaman</a></li>
          <li><a href="#lab1">🔬 Lab 1: Transfer Gagal di Tengah (ACID vs Tanpa ACID)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Index — Full Scan vs B-Tree</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Relasional + ACID Wajib</a></li>
          <li><a href="#worked">🔢 Worked Example: Bedah ACID per Huruf</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Level Isolasi = Menu Harga</a></li>
          <li><a href="#lab3">🔬 Lab 3: Race Condition Tanpa Lock</a></li>
          <li><a href="#case">📋 Mini-Case: Tiket Konser yang Terjual 2 Kali</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan komponen model relasional (tabel, primary/foreign key, constraint) dan kenapa ia jadi standar sistem finansial.</li>
          <li>Mendemonstrasikan 4 properti ACID lewat skenario kegagalan transfer — termasuk apa yang rusak jika satu properti hilang.</li>
          <li>Memilih level isolasi yang tepat (read committed / repeatable read / serializable) berdasarkan toleransi anomali vs kebutuhan kecepatan.</li>
          <li>Membuktikan dengan eksperimen kapan index mempercepat query dan kapan ia merugikan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp1 Juta yang Menguap</h2>
      <div className="story">
        <p>Bayangkan kode transfer bank ditulis naif: (1) kurangi saldo A Rp1 juta, (2) tambah saldo B Rp1 juta. Suatu malam, persis setelah langkah 1, server mati lampu. Langkah 2 tidak pernah jalan. Hasil: <strong>saldo A berkurang, saldo B tidak bertambah</strong> — Rp1 juta menguap dari sistem. Tidak ada yang mencuri; sistemnya saja tidak <em>atomik</em>.</p>
        <p>Twist-nya: bug seperti ini <strong>tidak bisa ditemukan dengan testing biasa</strong> — ia hanya muncul saat kegagalan terjadi di jeda antar-langkah, yang mungkin sekali setahun. Solusinya bukan "kode lebih hati-hati", melainkan <strong>transaksi ACID</strong>: database menjamin langkah 1+2 terjadi <em>semua atau tidak sama sekali</em>, bahkan jika listrik padam di tengah. Inilah alasan database relasional masih menjadi jantung setiap bank, 50 tahun setelah ditemukan.</p>
      </div>

      <h2 id="relasional">Model Relasional — Si Akuntan Tua yang Teliti</h2>
      <p><strong>Definisi.</strong> Model relasional (E.F. Codd, 1970) menyimpan data sebagai <strong>tabel</strong> (relasi): baris = fakta, kolom = atribut. Tiga pilar integritasnya:</p>
      <ul>
        <li><strong>Primary key:</strong> identitas unik tiap baris (<code className="inline">nasabah_id</code>). Tidak boleh kembar, tidak boleh kosong.</li>
        <li><strong>Foreign key:</strong> rujukan ke tabel lain (<code className="inline">transaksi.nasabah_id → nasabah.nasabah_id</code>). Menjamin tidak ada transaksi "yatim" milik nasabah yang tidak ada.</li>
        <li><strong>Constraint:</strong> aturan bisnis di level database — <code className="inline">CHECK (saldo &gt;= 0)</code>, <code className="inline">UNIQUE(email)</code>, <code className="inline">NOT NULL</code>. Database <em>menolak</em> data yang melanggar, bukan sekadar berharap aplikasi benar.</li>
      </ul>
      <p><strong>Kepribadian:</strong> database relasional itu seperti <em>akuntan tua yang teliti</em>: lambat menerima hal baru (skema kaku), cerewet soal aturan (constraint), tapi <strong>tidak pernah salah hitung uang</strong>. Untuk data yang salah sedikit saja berakibat fatal (uang, stok, tiket), tidak ada penggantinya.</p>
      <p><strong>SQL itu deklaratif:</strong> kamu bilang <em>apa</em> yang diinginkan (<code className="inline">SELECT SUM(nominal) FROM transaksi WHERE ...</code>), bukan <em>bagaimana</em> caranya. Optimizer database yang memilih strategi eksekusi. Inilah kenapa SQL jadi bahasa wajib data engineer (muncul di ~90% lowongan).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> constraint di database adalah <strong>pertahanan terakhir</strong>, bukan pertama. Validasi tetap di aplikasi — tapi constraint memastikan bug aplikasi tidak merusak data. Aturan praktis: foreign key + NOT NULL + CHECK untuk aturan bisnis yang "tidak boleh dilanggar apapun yang terjadi".</p>
      </div>

      <h2 id="acid">ACID — Empat Sumpah Transaksi</h2>
      <p><strong>Definisi.</strong> Transaksi = sekumpulan operasi yang diperlakukan sebagai <strong>satu unit tak terpisahkan</strong>. ACID adalah jaminannya:</p>
      <ul>
        <li><strong>Atomicity (atomik):</strong> semua berhasil, atau semua batal (rollback). Transfer = debit + kredit; tidak ada "setengah transfer".</li>
        <li><strong>Consistency (konsisten):</strong> transaksi membawa database dari satu kondisi valid ke kondisi valid lain. Constraint tidak pernah dilanggar di akhir transaksi.</li>
        <li><strong>Isolation (terisolasi):</strong> transaksi berjalan bersamaan seolah-olah sendirian — tidak saling mengintip pekerjaan yang belum selesai.</li>
        <li><strong>Durability (durable):</strong> setelah COMMIT, data selamat walau listrik padam sedetik kemudian (ditulis ke storage permanen / WAL).</li>
      </ul>
      <p><strong>Cara mengingat:</strong> <strong>A</strong>tau semua batal, <strong>C</strong> selalu valid, <strong>I</strong>solasi dari tetangga, <strong>D</strong>iselamatkan selamanya. Hilangkan satu huruf: tanpa A → uang menguap (cerita pembuka); tanpa I → dua orang tarik uang bersamaan dan saldo minus; tanpa D → data kemarin hilang saat restart.</p>
      <p><strong>WAL (Write-Ahead Log):</strong> rahasia durability — database menulis <em>niat</em> perubahan ke log permanen <em>sebelum</em> mengubah data. Listrik padam? Saat nyala, database membaca log dan menyelesaikan/membatalkan yang tertunda. Sederhana, brilian, dan alasan Postgres jarang korup.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "ACID itu lambat dan kuno — sistem modern tidak butuh."</strong></p>
        <p><strong>Yang benar:</strong> ACID memang ada harganya (locking, log), tapi "modern" ≠ "tanpa ACID". Justru tren terbaru adalah <strong>ACID kembali</strong>: Delta Lake/Iceberg membawa transaksi ACID ke data lake (DM4), dan database NewSQL (CockroachDB, Spanner) membuktikan ACID bisa skala global. Yang berubah bukan kebutuhan akan kebenaran — hanya <em>di mana</em> ia diimplementasikan.</p>
      </div>

      <h2 id="isolasi">Level Isolasi — Seberapa Paranoid Kamu?</h2>
      <p>Isolasi sempurna (serializable) itu mahal — database harus mengunci banyak hal. Maka SQL menyediakan <strong>level isolasi</strong>: spektrum keamanan vs kecepatan.</p>
      <ul>
        <li><strong>Read Committed:</strong> hanya baca data yang sudah di-commit. Cepat. Tapi: <em>non-repeatable read</em> (baca 2×, hasil beda karena orang lain update di antaranya) dan <em>phantom read</em> (baris baru muncul di tengah).</li>
        <li><strong>Repeatable Read:</strong> snapshot konsisten selama transaksi — baca berulang hasilnya sama. Phantom masih mungkin (tergantung implementasi).</li>
        <li><strong>Serializable:</strong> seolah transaksi berjalan satu-per-satu. Tidak ada anomali. Paling lambat, bisa deadlock.</li>
      </ul>
      <p><strong>Default Postgres = Read Committed</strong> — cukup untuk kebanyakan aplikasi. Naikkan ke Serializable hanya untuk operasi kritis (transfer, alokasi stok terbatas).</p>

      <PlotlyChart
        data={isolationData}
        title="Spektrum Level Isolasi: Keamanan vs Kelonggaran"
        layout={{ xaxis: { title: "Level isolasi" }, yaxis: { title: "Risiko anomali (relatif)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = level isolasi dari longgar ke ketat; tinggi batang = seberapa besar risiko anomali konkruensi.</p>
        <p><strong>Interpretasi:</strong> trade-off-nya linear dan jujur: makin ketat, makin aman, makin lambat. <strong>Kesalahan umum:</strong> memakai Serializable untuk semua query "biar aman" — throughput anjlok. Atau Read Committed untuk transfer uang — saldo bisa minus. Pilih sesuai <em>kritikalitas operasi</em>, bukan satu level untuk semua.</p>
      </div>

      <h2 id="index">Index — Daftar Isi Buku Setebal 1 Juta Halaman</h2>
      <p><strong>Definisi.</strong> Index = struktur data tambahan (umumnya <strong>B-tree</strong>) yang memetakan nilai kolom → lokasi baris, seperti daftar isi buku.</p>
      <p><strong>Matematikanya:</strong> full scan memeriksa <Tex math={String.raw`O(n)`} /> baris; B-tree menemukan dalam <Tex math={String.raw`O(\log n)`} /> langkah. Untuk <Tex math={String.raw`n = 1.000.000`} />: 1 juta pemeriksaan vs ~20 langkah. Itulah yang kamu ukur di Lab 2.</p>
      <ul>
        <li><Tex math={String.raw`O(n)`} />: waktu tumbuh <em>linear</em> dengan jumlah baris — 2× data = 2× waktu.</li>
        <li><Tex math={String.raw`O(\log n)`} />: waktu tumbuh <em>logaritmik</em> — 2× data ≈ tambah 1 langkah saja.</li>
      </ul>
      <p><strong>Harga index:</strong> tiap INSERT/UPDATE/DELETE harus update index juga + makan storage. Tabel yang ditulis ribuan kali per detik dengan 10 index = bunuh diri performa. <strong>Aturan:</strong> index untuk kolom yang sering di-WHERE/JOIN/ORDER BY pada tabel yang <em>lebih sering dibaca daripada ditulis</em>.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <code className="inline">EXPLAIN QUERY PLAN</code> (Lab 2) adalah skill interview data engineer. Sebelum menuduh "database lambat", baca rencananya: apakah <code className="inline">SCAN</code> (jahat, full table) atau <code className="inline">SEARCH USING INDEX</code> (baik)? 80% "query lambat" selesai di sini, tanpa ganti infrastruktur.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Index selalu mempercepat — kasih index ke semua kolom."</strong></p>
        <p><strong>Yang benar:</strong> index mempercepat <em>baca</em> tapi memperlambat <em>tulis</em> dan memakan ruang. Pada tabel OLTP yang di-update ribuan kali/detik, tiap index tambahan adalah pajak. Index juga <em>tidak dipakai</em> jika query tidak selektif (misal kolom boolean 50/50 — optimizer memilih full scan).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Transfer Gagal di Tengah (ACID vs Tanpa ACID)</h2>
      <p>Simulasikan server mati setelah debit — lihat ROLLBACK menyelamatkan total saldo.</p>
      <PyodideLab
        title="Lab 1 — Atomicity: Semua atau Tidak Sama Sekali"
        hint="Coba: ubah nominal jadi 9.000.000 (melebihi saldo A). Total harus tetap 6.000.000 — itulah atomicity."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Index — Full Scan vs B-Tree</h2>
      <p>Ukur sendiri perbedaan O(n) vs O(log n) pada 200.000 baris, plus baca EXPLAIN QUERY PLAN.</p>
      <PyodideLab
        title="Lab 2 — Bukti Index dengan Stopwatch"
        hint="Coba: cari kolom TANPA index (nominal = 123456). Rasakan bedanya — itulah kenapa pilihan kolom index penting."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Relasional + ACID Wajib</h2>

      <div className="decision-card">
        <h3>1. Uang / stok / tiket berpindah tangan → <strong>Relasional + transaksi ACID</strong></h3>
        <p><strong>Kondisi:</strong> operasi multi-langkah yang harus atomik; salah sedikit = rugi nyata.</p>
        <p><strong>Kenapa:</strong> hanya ACID yang menjamin "semua atau batal" saat kegagalan di tengah. Tidak ada teknologi yang menggantikan jaminan ini untuk uang.</p>
        <p><strong>Contoh nyata:</strong> transfer bank, checkout e-commerce, booking kursi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Query filter 1 juta baris lambat → <strong>cek EXPLAIN, tambah index</strong></h3>
        <p><strong>Kondisi:</strong> WHERE/JOIN pada kolom tanpa index; tabel lebih sering dibaca daripada ditulis.</p>
        <p><strong>Kenapa:</strong> O(n) → O(log n). Tapi ukur dulu, dan ingat pajak tulis-nya.</p>
      </div>

      <div className="decision-card">
        <h3>3. Dua user update saldo bersamaan, saldo tidak boleh minus → <strong>naikkan isolasi / pakai SELECT FOR UPDATE</strong></h3>
        <p><strong>Kondisi:</strong> race condition pada operasi kritis.</p>
        <p><strong>Kenapa:</strong> Read Committed default tidak cukup untuk "cek lalu update" konkuren — butuh lock eksplisit atau Serializable.</p>
      </div>

      <div className="decision-card">
        <h3>4. Laporan agregat jutaan baris tiap pagi → <strong>JANGAN di OLTP — pindah ke warehouse (DM4)</strong></h3>
        <p><strong>Kondisi:</strong> query analitik berat di database transaksional.</p>
        <p><strong>Kenapa:</strong> index tidak menyelamatkan full agregat masif; pola OLAP butuh rumah sendiri (DM1).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Ada uang/stok?</strong> → transaksi ACID, tidak bisa ditawar.</li>
          <li><strong>Query lambat?</strong> → EXPLAIN dulu, baru index. Jangan tebak.</li>
          <li><strong>Index:</strong> untuk kolom WHERE/JOIN yang sering; hitung pajak tulis-nya.</li>
          <li><strong>Isolasi:</strong> default Read Committed; naikkan hanya untuk operasi kritis.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Transfer Rp1 Juta, Bedah per Huruf ACID</h2>
      <p>Rekening A (saldo Rp5.000.000) transfer Rp1.000.000 ke rekening B (saldo Rp2.000.000). Sistem crash tepat setelah debit A tapi sebelum kredit B. Ikuti apa yang terjadi <em>dengan</em> dan <em>tanpa</em> ACID — dalam angka.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Tanpa transaksi: Rp1 juta menguap (klik untuk buka)</summary>
        <p>Urutan operasi tanpa transaksi: (1) <code className="inline">UPDATE A SET saldo = 4.000.000</code> ✔, (2) crash 💥, (3) <code className="inline">UPDATE B SET saldo = 3.000.000</code> ✘ tidak pernah jalan.</p>
        <p><Tex math={String.raw`\text{total sebelum} = 5.000.000 + 2.000.000 = 7.000.000`} block /></p>
        <p><Tex math={String.raw`\text{total sesudah crash} = 4.000.000 + 2.000.000 = 6.000.000`} block /></p>
        <p><Tex math={String.raw`\text{selisih} = 7.000.000 - 6.000.000 = 1.000.000 \text{ (HILANG)}`} block /></p>
        <p>Uang tidak "pindah ke siapa-siapa" — ia <strong>lenyap dari pembukuan</strong>. Inilah huruf <strong>A (Atomicity)</strong>: semua operasi dalam transaksi = satu unit tak terpisahkan. Dengan atomicity, crash di tengah = <em>rollback</em> total kembali ke 7.000.000. Tidak ada keadaan "setengah transfer".</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — C (Consistency): aturan bisnis sebagai tembok</summary>
        <p>Aturan: <code className="inline">CHECK (saldo &gt;= 0)</code>. Seseorang mencoba transfer Rp10.000.000 dari A (saldo 5.000.000).</p>
        <p>Tanpa consistency: saldo A = <Tex math={String.raw`5.000.000 - 10.000.000 = -5.000.000`} /> → bank "menciptakan" utang fiktif Rp5 juta yang tidak tercatat di mana pun. Dengan constraint, transaksi <strong>ditolak sebelum menyentuh disk</strong> — database berubah dari "penyimpan angka" menjadi <strong>penjaga aturan bisnis</strong>. Biaya: cek constraint ≈ mikrodetik; biaya tanpanya = rekonsiliasi manual (DM13) yang memakan hari.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — I (Isolation): dua transfer bersamaan, satu saldo</summary>
        <p>A (saldo Rp5.000.000) ditransfer Rp4.000.000 ke B <em>dan</em> Rp4.000.000 ke C <strong>dalam milidetik yang sama</strong>. Tanpa isolasi (read committed rendah / race):</p>
        <p>Transfer 1 baca saldo A = 5.000.000 ✔ → Transfer 2 baca saldo A = 5.000.000 ✔ (belum ada yang commit!) → keduanya lolos cek → A = 5.000.000 − 8.000.000 = <strong>−3.000.000</strong>.</p>
        <p><Tex math={String.raw`P(\text{race}) \approx \frac{\text{durasi jendela balapan}}{\text{interval antar transaksi}`} /></p>
        <p>Pada 1.000 transaksi/detik dengan jendela 2 ms: <Tex math={String.raw`P \approx \frac{0{,}002}{0{,}001} > 1`} /> → praktis <strong>pasti</strong> terjadi tiap detik pada beban tinggi. Solusi: level isolasi <strong>Serializable</strong> atau <code className="inline">SELECT ... FOR UPDATE</code> (kunci baris A selama transaksi). Harga: throughput turun — tidak ada isolasi gratis.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — D (Durability) + Index: angka kecepatannya</summary>
        <p>Durability = setelah <code className="inline">COMMIT</code> kembali, data selamat walau listrik padam 1 detik kemudian (WAL/write-ahead log). Tanpa WAL yang di-flush: jendela kehilangan = <strong>seluruh transaksi sejak checkpoint terakhir</strong> (bisa menit!). Dengan <code className="inline">synchronous_commit</code>: 0 transaksi hilang, harga = latency tulis +0,5–2 ms.</p>
        <p>Index: tabel <code className="inline">transaksi</code> 10 juta baris. Cari 1 transaksi by ID tanpa index: full scan ≈ <Tex math={String.raw`10^7`} /> baris ≈ <strong>8–15 detik</strong>. Dengan B-Tree index (fanout ~100): kedalaman = <Tex math={String.raw`\log_{100}(10^7) \approx 3{,}5 \to 4`} /> level → <strong>4 page read ≈ 0,04 ms</strong>. Percepatan ≈ <strong>200.000×</strong>. Inilah kenapa Lab 2 lesson ini terasa "ajaib" — bukan sihir, logaritma.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> ACID dibayar dengan <strong>latency dan throughput</strong>. Setiap huruf punya harga: Atomicity = tulis WAL ganda; Consistency = cek tiap tulis; Isolation = lock/antrean; Durability = flush ke disk. Database relasional = "saya bayar mahal untuk kebenaran". NoSQL (DM3b) = "saya bayar murah, kebenaran menyusul". Tidak ada yang gratis — hanya pilihan siapa yang membayar.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Harga durability: berapa besar WAL-nya?</summary>
        <p>Database 10.000 TPS, tiap transaksi menulis rata-rata 500 byte ke WAL (write-ahead log).</p>
        <p><Tex math={String.raw`10.000 \times 500 \text{ B} = 5 \text{ MB/detik} = 432 \text{ GB/hari}`} block /></p>
        <p>Checkpoint tiap 5 menit → WAL yang harus diputar ulang saat crash ≈ <Tex math={String.raw`5 \times 60 \times 5 \text{ MB} = 1{,}5 \text{ GB}`} /> → recovery ~1–3 menit. <strong>Durability bukan gratis:</strong> 432 GB/hari tulis ekstra + I/O flush tiap commit. Inilah yang dibayar untuk huruf D — dan kenapa <code className="inline">synchronous_commit=off</code> menggoda (tapi mempertaruhkan detik terakhir transaksimu).</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Level Isolasi = Seberapa Paranoid Kamu Berani</h2>
      <p>Empat level isolasi ANSI adalah <strong>menu harga</strong>, bukan peringkat kualitas:</p>
      <ul>
        <li><strong>Read Uncommitted:</strong> baca data yang <em>belum di-commit</em> orang lain (dirty read). Murah, tapi kamu bisa membaca transfer yang 1 detik kemudian di-rollback — angka hantu. Praktis tidak dipakai kecuali statistik kasar yang toleran salah.</li>
        <li><strong>Read Committed</strong> (default Postgres): tiap <em>statement</em> melihat snapshot baru. Aman dari dirty read, tapi <strong>non-repeatable read</strong>: baca saldo 2× dalam 1 transaksi bisa beda karena orang lain commit di antaranya. Untuk laporan 1 query = cukup.</li>
        <li><strong>Repeatable Read:</strong> snapshot dikunci per <em>transaksi</em>. Baca 10× hasilnya sama. Tapi <strong>phantom read</strong>: baris <em>baru</em> yang memenuhi WHERE bisa muncul di tengah (orang lain insert).</li>
        <li><strong>Serializable:</strong> seolah transaksi jalan satu per satu. Nol anomali. Harga: deadlock dan retry — pada 5.000 TPS, 2–5% transaksi mungkin harus di-retry aplikasi. <strong>Wajib</strong> untuk uang (transfer, saldo), <strong>mubazir</strong> untuk like counter.</li>
      </ul>
      <p><strong>Konteks dunia nyata (konflik dengan DM3b):</strong> bank memakai Serializable untuk core banking <em>dan</em> Read Committed untuk dashboard internal — <strong>satu perusahaan, dua level isolasi</strong>, dipilih per query. Aturan praktis: uang &amp; stok → Serializable; laporan &amp; analitik → Read Committed; cache/counter → toleran. Paranoia itu mahal — belanjakan hanya untuk yang nilainya sepadan.</p>
      <p><strong>Intuisi index yang jarang diajarkan:</strong> index mempercepat <em>baca</em> tapi memperlambat <em>tulis</em> — tiap INSERT harus update semua index (tulis 1 baris + N index = N+1 tulis). Tabel transaksi dengan 8 index: throughput insert turun <strong>30–50%</strong>. Makanya tabel OLTP "panas" (DM1) punya sedikit index, dan index analitik dibangun di <em>replica/warehouse</em>, bukan di database produksi.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Primary key otomatis membuat query cepat."</strong></p>
        <p><strong>Yang benar:</strong> primary key membuat <em>lookup by key itu</em> cepat (index B-Tree di belakangnya). Query <code className="inline">WHERE kota = 'Jakarta'</code> tetap full scan 10 juta baris kalau tidak ada index di <code className="inline">kota</code>. Dan index di kolom yang salah (mis. <code className="inline">jenis_kelamin</code> dengan 2 nilai) hampir tidak membantu — selektivitas rendah = database tetap scan setengah tabel. Index = jawaban untuk pertanyaan spesifik, bukan vitamin umum.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Race Condition — Lihat Uang "Bocor" Tanpa Lock</h2>
      <p>Simulasikan dua transfer bersamaan tanpa isolasi vs dengan lock baris. Angka tidak berbohong.</p>
      <PyodideLab
        title="Lab 3 — Balapan Tanpa Wasit"
        hint="Coba: naikkan N_TRANSFER dari 50 ke 500. Apakah kebocoran membesar? Lalu bayangkan ini saldo nasabah betulan."
        defaultCode={`# Lab 3: dua thread transfer bersamaan, tanpa lock vs dengan lock
import threading, time

SALDO_AWAL = 5_000_000
NOMINAL = 100_000
N_TRANSFER = 50  # tiap thread transfer 50x

def tanpa_lock():
    saldo = {"A": SALDO_AWAL}
    def transfer():
        for _ in range(N_TRANSFER):
            baca = saldo["A"]          # baca
            time.sleep(0.0005)         # perlebar jendela balapan -> thread lain menyela
            saldo["A"] = baca - NOMINAL  # tulis (menimpa hasil thread lain)
    t1 = threading.Thread(target=transfer); t2 = threading.Thread(target=transfer)
    t1.start(); t2.start(); t1.join(); t2.join()
    return saldo["A"]

def dengan_lock():
    saldo = {"A": SALDO_AWAL}
    kunci = threading.Lock()
    def transfer():
        for _ in range(N_TRANSFER):
            with kunci:               # SELECT ... FOR UPDATE
                saldo["A"] -= NOMINAL
    t1 = threading.Thread(target=transfer); t2 = threading.Thread(target=transfer)
    t1.start(); t2.start(); t1.join(); t2.join()
    return saldo["A"]

harusnya = SALDO_AWAL - 2 * N_TRANSFER * NOMINAL
hasil_bebas = tanpa_lock()
hasil_kunci = dengan_lock()
print(f"Seharusnya : Rp{harusnya:,}")
print(f"Tanpa lock : Rp{hasil_bebas:,}  -> bocor Rp{hasil_bebas-harusnya:,}")
print(f"Dengan lock: Rp{hasil_kunci:,}")
print()
print("Tanpa isolasi, sebagian debit 'tertimpa' dan hilang.")
print("Di bank nyata: itulah Rp1 juta yang menguap di cerita pembuka.")`}
      />

      <h2 id="case">📋 Mini-Case: Tiket Konser yang Terjual 2 Kali</h2>
      <div className="callout">
        <p>Platform tiket menjual 1.000 kursi konser. Saat war tiket, 2 pembeli klik kursi A12 <em>bersamaan</em>. Kode: cek "apakah kursi tersedia?" → jika ya, tandai terjual. Kedua request membaca "tersedia" sebelum salah satunya menulis. Hasil: <strong>kursi A12 terjual 2 kali</strong>, 1 pembeli kecewa, viral di media sosial.</p>
        <p><strong>Pertanyaan:</strong> (a) properti ACID/fenomena apa yang gagal di sini? (b) Perbaikan minimal apa? (c) Kenapa "cek dulu di aplikasi" tidak cukup?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Isolation</strong> gagal — race condition klasik "check-then-act". Dua transaksi saling mengintip state yang belum final.</p>
          <p>(b) <strong>SELECT ... FOR UPDATE</strong> (kunci baris saat dibaca) atau constraint <code className="inline">UNIQUE(kursi_id)</code> + tangani error duplikat. Kunci harus di <em>database</em>, bukan aplikasi.</p>
          <p>(c) Karena jeda antara "cek" dan "tulis" selalu ada — di skala ribuan request/detik, tabrakan <em>pasti</em> terjadi. Hanya mekanisme konkruensi database (lock/isolasi) yang menutup jeda itu.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: kedalaman index, peluang race condition, dan atomicity dalam rupiah.</p>

      <details className="worked">
        <summary>Soal 1 — Index: tabel 100 juta baris, B-Tree fanout 200. Berapa kedalaman index? Bandingkan dengan full scan 20 detik.</summary>
        <p><Tex math={String.raw`\text{depth} = \log_{200}(10^8) = \frac{8}{\log_{10} 200} \approx \frac{8}{2{,}30} \approx 3{,}5 \to 4 \text{ level}`} block /></p>
        <p>4 page read ≈ <strong>0,04 ms</strong> vs 20 detik full scan → percepatan <strong>~500.000×</strong>. Inilah kenapa "tambah index yang tepat" adalah optimasi termurah di database relasional.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Race: 2.000 transaksi/detik, jendela balapan 3 ms. Berapa peluang race per detik?</summary>
        <p><Tex math={String.raw`P \approx \frac{0{,}003}{1/2000} = \frac{0{,}003}{0{,}0005} = 6 > 1`} block /></p>
        <p>Artinya race <strong>praktis pasti terjadi</strong> — bukan "kemungkinan kecil". Pada beban tinggi, tanpa lock yang benar, anomali bukan <em>if</em> tapi <em>when</em>. Inilah kenapa level isolasi bukan paranoia.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Atomicity: A (Rp2.000.000) transfer Rp750.000 ke B. Crash setelah debit A, sebelum kredit B. Berapa total uang tercatat sebelum vs sesudah — tanpa transaksi?</summary>
        <p><Tex math={String.raw`\text{sebelum} = 2.000.000 + B; \quad \text{sesudah} = 1.250.000 + B`} block /></p>
        <p>Selisih = <strong>Rp750.000 hilang</strong> dari pembukuan. Dengan atomicity: rollback → kembali ke total semula. <strong>Satu huruf A = Rp750.000 yang tidak menguap.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Server mati setelah debit tapi sebelum kredit. Properti ACID apa yang mencegah uang menguap?"
        options={[
          "Consistency — karena constraint saldo >= 0",
          "Atomicity — transaksi dibatalkan total (rollback), seolah tidak pernah terjadi",
          "Isolation — karena transaksi lain tidak mengganggu",
          "Durability — karena data tersimpan permanen",
        ]}
        correct={1}
        explanation="Benar: Atomicity — semua-atau-tidak-sama-sama. Rollback mengembalikan debit yang sudah jalan, sehingga total uang sistem utuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Query filter 1 juta baris tanpa index vs dengan B-tree index. Perbedaan kompleksitasnya?"
        options={[
          "Sama saja, O(n)",
          "O(n) vs O(log n) — 1 juta pemeriksaan vs ~20 langkah",
          "O(n²) vs O(n)",
          "Index tidak mengubah kompleksitas",
        ]}
        correct={1}
        explanation="Benar: B-tree memangkas pencarian jadi logaritmik. Itulah yang kamu ukur di Lab 2."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan kamu TIDAK boleh menambah index ke sebuah kolom?"
        options={[
          "Kolom sering di-WHERE pada tabel yang jarang ditulis",
          "Tabel OLTP yang di-INSERT/UPDATE ribuan kali per detik — tiap index adalah pajak tulis",
          "Kolom primary key",
          "Tidak pernah ada larangan",
        ]}
        correct={1}
        explanation="Benar: index memperlambat tulis. Pada tabel tulis-berat, tiap index tambahan menurunkan throughput INSERT/UPDATE."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dua pembeli bersamaan membeli kursi terakhir — keduanya lolos 'cek ketersediaan'. Ini kegagalan…"
        options={[
          "Atomicity",
          "Durability",
          "Isolation — race condition check-then-act",
          "Consistency",
        ]}
        correct={2}
        explanation="Benar: Isolation. Solusinya mekanisme konkruensi di database (SELECT FOR UPDATE / constraint unik), bukan cek di aplikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Operasi apa yang PALING tepat memakai level isolasi Serializable?"
        options={[
          "Menampilkan daftar produk di katalog",
          "Transfer uang antar rekening — operasi kritis multi-langkah",
          "Menghitung total pengunjung kemarin untuk dashboard",
          "Semua query, biar aman",
        ]}
        correct={1}
        explanation="Benar: Serializable untuk operasi kritis saja. Memakainya untuk semua query membunuh throughput tanpa alasan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Setelah COMMIT, listrik padam. Data tetap ada. Ini jaminan…"
        options={[
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability — via write-ahead log (WAL)",
        ]}
        correct={3}
        explanation="Benar: Durability. Rahasianya WAL: niat perubahan ditulis ke log permanen sebelum data diubah, sehingga bisa dipulihkan setelah crash."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Relasional:</strong> tabel + primary/foreign key + constraint — standar untuk data yang tidak boleh salah (uang, stok).</li>
          <li><strong>ACID:</strong> Atomicity (semua/batal), Consistency (selalu valid), Isolation (tidak saling intip), Durability (selamat dari crash).</li>
          <li><strong>Isolasi:</strong> spektrum Read Committed → Serializable; default cukup, naikkan hanya untuk operasi kritis.</li>
          <li><strong>Index:</strong> O(n) → O(log n) untuk baca; pajak untuk tulis. EXPLAIN dulu sebelum menuduh.</li>
          <li><strong>SQL deklaratif:</strong> bilang "apa", bukan "bagaimana" — skill wajib di ~90% lowongan data engineer.</li>
          <li><strong>Jangan:</strong> campur OLAP berat di OLTP; index semua kolom; andalkan cek-di-aplikasi untuk konkruensi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm2-pemodelan-data" className="btn btn-secondary btn-sm">← DM2</Link>
        <Link href="/learn/dm3b-database-nosql" className="btn btn-primary btn-sm">Next: DM3B →</Link>
      </div>
    </div>
  );
}

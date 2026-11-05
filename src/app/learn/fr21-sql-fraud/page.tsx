"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR21Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const skillData = [
    {
      x: ["SQL", "Python", "Investigasi kasus", "Chargeback/dispute", "Statistik/ML", "Regulasi AML", "Komunikasi"],
      y: [92, 68, 85, 55, 60, 50, 78],
      type: "bar",
      marker: { color: ["#e05252", "#2a7de1", "#e8a838", "#2a7de1", "#2a7de1", "#2a7de1", "#e8a838"] },
      text: ["92%", "68%", "85%", "55%", "60%", "50%", "78%"],
      textposition: "outside",
    },
  ];

  const queryData = [
    {
      x: ["GROUP BY + HAVING", "Window function", "Self-join", "CTE bertingkat", "SELECT *"],
      y: [0.55, 0.72, 0.68, 0.61, 0.05],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["0,55", "0,72", "0,68", "0,61", "0,05"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# SQL ASLI di browser! (sqlite3 via Pyodide)
# Kasus: temukan 'velocity attack' — user dengan >5 trx/jam
import sqlite3
db = sqlite3.connect(":memory:")
db.execute("""CREATE TABLE transaksi (
  id INTEGER, user_id TEXT, nominal INTEGER, waktu TEXT)""")
import random
random.seed(71)
rows = []
for i in range(500):
    u = f"U{i % 80:03d}"
    # U007 = penyerang: 30 transaksi dalam 1 jam!
    if u == "U007":
        rows.append((i, u, random.randint(100, 500)*1000, f"2026-10-12 03:{i%60:02d}:00"))
    else:
        rows.append((i, u, random.randint(50, 2000)*1000, f"2026-10-12 {random.randint(0,23):02d}:{random.randint(0,59):02d}:00"))
db.executemany("INSERT INTO transaksi VALUES (?,?,?,?)", rows)

# Pola 1: GROUP BY + HAVING — agregat per user per jam
q = """
SELECT user_id, substr(waktu, 1, 13) AS jam, COUNT(*) AS n_trx,
       SUM(nominal)/1000000.0 AS total_jt
FROM transaksi
GROUP BY user_id, jam
HAVING COUNT(*) > 5
ORDER BY n_trx DESC
LIMIT 5;
"""
print("=== Velocity attack (>5 trx/jam) ===")
for r in db.execute(q):
    print(f"  {r[0]}  jam {r[1]}: {r[2]} trx, Rp{r[3]:.1f} jt  🚨")
print()
print("COBA UBAH: HAVING COUNT(*) > 5 -> > 10.")
print("U007 tetap tertangkap? Itulah tuning ambang dalam SQL (FR5!).")`;

  const lab2Code = `# Window function + self-join: entity resolution & 'akun kembar'
import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE akun (id TEXT, nama TEXT, no_hp TEXT, device TEXT)")
db.executemany("INSERT INTO akun VALUES (?,?,?,?)", [
    ("A1", "Budi S.",   "0811", "fp_X"),
    ("A2", "B. Santoso","0811", "fp_Y"),
    ("A3", "Budi S.",   "0822", "fp_X"),
    ("A4", "Andi",      "0833", "fp_Z"),
    ("A5", "B. S.",     "0811", "fp_X"),
])

print("=== Pola 2: window function — hitung akun per device ===")
for r in db.execute("""
  SELECT device, COUNT(*) OVER (PARTITION BY device) AS akun_per_device, id, nama
  FROM akun ORDER BY akun_per_device DESC, device;"""):
    flag = "🚨" if r[1] > 1 else "✅"
    print(f"  device {r[0]}: {r[1]} akun <- {r[2]} ({r[3]}) {flag}")

print()
print("=== Pola 3: self-join — pasangan akun berbagi >=2 atribut ===")
for r in db.execute("""
  SELECT a.id, b.id,
         (a.no_hp = b.no_hp) + (a.device = b.device) AS atribut_sama
  FROM akun a JOIN akun b ON a.id < b.id
  WHERE (a.no_hp = b.no_hp) + (a.device = b.device) >= 1
  ORDER BY atribut_sama DESC;"""):
    print(f"  {r[0]} <-> {r[1]}: {r[2]} atribut sama" + (" 🚨" if r[2] >= 2 else ""))
print()
print("COBA UBAH: WHERE >= 1 -> >= 2 (butuh 2 atribut).")
print("Pasangan mana yang hilang? Itulah trade-off false merge (FR12).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR21 — Fraud / ML Analytics • JOB SKILL</span>
        <h1 className="display-title">SQL Investigasi Fraud:<br />Skill #1 yang Dicari Perekrut</h1>
        <div className="meta">45–60 menit &bull; 2 lab SQL asli &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 1 Query, Rp200 Juta Terselamatkan</a></li>
          <li><a href="#mengapa">Mengapa SQL = Skill #1 (Bukti Lowongan)</a></li>
          <li><a href="#pola1">Pola 1: GROUP BY + HAVING — Berburu Agregat Aneh</a></li>
          <li><a href="#pola2">Pola 2: Window Function — Konteks Tanpa Kehilangan Baris</a></li>
          <li><a href="#pola3">Pola 3: Self-Join — Entity Resolution dalam SQL</a></li>
          <li><a href="#pola4">Pola 4: CTE — Investigasi Bertingkat yang Terbaca</a></li>
          <li><a href="#lab1">🔬 Lab 1: SQL Velocity Attack (sqlite Asli!)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Window Function + Self-Join</a></li>
          <li><a href="#worked">📐 Worked Example: Query Velocity &amp; Device Sharing</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: SQL adalah Mikroskop</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Pola SQL untuk Kasus Apa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Teknik SQL</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Memburu Mule Ring dengan 3 Query</a></li>

          <li><a href="#case">📋 Mini-Case: 48 Jam Menemukan Ring Mule</a></li>
          <li><a href="#faq">❓ Tanya Jawab: SQL untuk Fraud</a></li>

          <li><a href="#latihan">Latihan Mandiri: Query Forensik</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menulis <strong>GROUP BY + HAVING</strong> untuk deteksi velocity &amp; agregat anomali.</li>
          <li>Menggunakan <strong>window function</strong> (COUNT OVER, ROW_NUMBER, LAG) untuk konteks per baris.</li>
          <li>Melakukan <strong>self-join</strong> untuk entity resolution &amp; pasangan mencurigakan.</li>
          <li>Menyusun <strong>CTE bertingkat</strong> agar investigasi kompleks tetap terbaca &amp; teraudit.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 1 Query, Rp200 Juta Terselamatkan</h2>
      <div className="story">
        <p>Jumat 16:55, 5 menit sebelum pulang. Analis junior &ldquo;DanaKita&rdquo; iseng menjalankan query yang ia tulis pagi itu:</p>
        <p><code className="inline">SELECT user_id, COUNT(*) FROM transaksi WHERE waktu &gt; now() - interval '1 hour' GROUP BY user_id HAVING COUNT(*) &gt; 20</code></p>
        <p>Hasil: <strong>12 user, masing-masing 40–80 transaksi/jam</strong> — semuanya ke merchant yang sama, semuanya dibuat minggu ini. Ia menahan disbursement merchant itu. Senin pagi: <strong>merchant fiktif</strong> terbongkar — Rp200 juta dana talangan selamat. Total waktu investigasi: <strong>1 query, 10 menit</strong>.</p>
        <p>Twist-nya: tim data science butuh 3 minggu membangun &ldquo;model deteksi merchant fraud&rdquo; untuk kasus yang sama — dan modelnya <em>belum selesai</em> saat serangan terjadi. Lesson ini: <strong>sebelum ML, ada SQL — dan SQL sering lebih cepat menemukan musuh yang sudah dikenal polanya</strong>. Itulah kenapa 92% lowongan fraud analyst mencantumkan SQL.</p>
      </div>

      <h2 id="mengapa">Mengapa SQL = Skill #1 (Bukti Lowongan)</h2>
      <p>Riset lowongan Fraud Analyst / AML (Jakarta &amp; global, 2026) menunjukkan:</p>

      <PlotlyChart
        data={skillData}
        title="Skill yang Dicantumkan di Lowongan Fraud/AML (%, riset 2026)"
        layout={{ xaxis: { title: "Skill" }, yaxis: { title: "% lowongan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % lowongan Fraud Analyst/AML yang mencantumkan skill itu sebagai syarat.</p>
        <p><strong>Interpretasi:</strong> <strong>SQL 92%</strong> — mengalahkan Python (68%)! &ldquo;Investigasi kasus&rdquo; (85%) dan &ldquo;komunikasi&rdquo; (78%) melengkapi. <strong>Pelajaran karir:</strong> Python + ML itu <em>nilai tambah</em>; SQL + investigasi + komunikasi itu <em>syarat masuk</em>. Kuasai syarat masuk dulu.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> SQL adalah <strong>bahasa investigasi</strong> — bukan sekadar &ldquo;ambil data&rdquo;. Investigator senior &ldquo;berpikir dalam query&rdquo;: tiap hipotesis (&ldquo;mungkin ini mule ring&rdquo;) langsung diterjemahkan jadi query yang bisa membuktikan/membantahnya dalam menit. Kecepatan hipotesis→bukti inilah yang membedakan analis hebat.</p>
      </div>

      <h2 id="pola1">Pola 1: GROUP BY + HAVING — Berburu Agregat Aneh</h2>
      <p><strong>Ide:</strong> kelompokkan transaksi, saring kelompok yang aneh. 80% investigasi fraud dimulai di sini:</p>
      <pre style={{ background: "var(--bg-subtle)", padding: "var(--sp-4)", borderRadius: "8px", overflowX: "auto" }}><code>{`-- Velocity: user dengan >20 trx/jam
SELECT user_id,
       date_trunc('hour', waktu) AS jam,
       COUNT(*) AS n_trx,
       SUM(nominal) AS total
FROM transaksi
WHERE waktu >= now() - interval '24 hours'
GROUP BY user_id, jam
HAVING COUNT(*) > 20
ORDER BY n_trx DESC;

-- Fan-out mule: rekening dengan >10 tujuan berbeda/jam
SELECT pengirim, COUNT(DISTINCT penerima) AS n_tujuan
FROM transfer
GROUP BY pengirim
HAVING COUNT(DISTINCT penerima) > 10;`}</code></pre>
      <p><strong>Kenapa HAVING, bukan WHERE:</strong> WHERE menyaring <em>baris</em> (sebelum agregat); HAVING menyaring <em>kelompok</em> (sesudah agregat). &ldquo;User dengan &gt;20 trx&rdquo; = sifat kelompok → HAVING.</p>

      <h2 id="pola2">Pola 2: Window Function — Konteks Tanpa Kehilangan Baris</h2>
      <p><strong>Ide:</strong> hitung agregat <em>tanpa</em> meruntuhkan baris — tiap transaksi tetap terlihat, tapi membawa &ldquo;konteksnya&rdquo;:</p>
      <pre style={{ background: "var(--bg-subtle)", padding: "var(--sp-4)", borderRadius: "8px", overflowX: "auto" }}><code>{`-- Tiap transaksi + 'berapa trx user ini 1 jam terakhir'
SELECT id, user_id, nominal, waktu,
       COUNT(*) OVER (
         PARTITION BY user_id
         ORDER BY waktu
         RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
       ) AS trx_1h
FROM transaksi;

-- Transaksi pertama vs berikutnya per user (deteksi 'warming')
SELECT id, user_id, waktu,
       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY waktu) AS urutan,
       LAG(waktu) OVER (PARTITION BY user_id ORDER BY waktu) AS trx_sebelumnya
FROM transaksi;`}</code></pre>
      <p><strong>Tiga fungsi wajib hafal:</strong> <code className="inline">COUNT(*) OVER (PARTITION BY ...)</code> (konteks agregat), <code className="inline">ROW_NUMBER()</code> (urutan — &ldquo;transaksi ke berapa?&rdquo;), <code className="inline">LAG/LEAD</code> (&ldquo;transaksi sebelumnya berapa?&rdquo; — untuk hitung selisih waktu/jarak!).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> GROUP BY menjawab &ldquo;<em>siapa</em> yang aneh?&rdquo;; window function menjawab &ldquo;<em>transaksi mana</em> yang aneh, <em>dengan konteksnya</em>?&rdquo;. Investigator butuh keduanya: GROUP BY untuk menemukan tersangka, window untuk membuktikan kasus per transaksi.</p>
      </div>

      <h2 id="pola3">Pola 3: Self-Join — Entity Resolution dalam SQL</h2>
      <p><strong>Ide:</strong> gabungkan tabel dengan <em>dirinya sendiri</em> untuk menemukan pasangan yang berbagi atribut (FR12, versi SQL):</p>
      <pre style={{ background: "var(--bg-subtle)", padding: "var(--sp-4)", borderRadius: "8px", overflowX: "auto" }}><code>{`-- Pasangan akun berbagi >=2 atribut (no_hp, device, alamat)
SELECT a.id AS akun1, b.id AS akun2,
       (a.no_hp = b.no_hp)::int +
       (a.device_fp = b.device_fp)::int +
       (a.alamat = b.alamat)::int AS atribut_sama
FROM akun a
JOIN akun b ON a.id < b.id   -- hindari pasangan ganda & diri sendiri
WHERE (a.no_hp = b.no_hp)::int +
      (a.device_fp = b.device_fp)::int +
      (a.alamat = b.alamat)::int >= 2;`}</code></pre>
      <p><strong>Trik <code className="inline">a.id &lt; b.id</code>:</strong> tanpa ini, tiap pasangan muncul 2× (A-B dan B-A) plus pasangan diri sendiri (A-A). Klasik jebakan self-join.</p>

      <h2 id="pola4">Pola 4: CTE — Investigasi Bertingkat yang Terbaca</h2>
      <p><strong>Ide:</strong> CTE (WITH ...) memecah investigasi kompleks jadi <strong>langkah bernama</strong> — terbaca, teraudit, bisa dipakai ulang:</p>
      <pre style={{ background: "var(--bg-subtle)", padding: "var(--sp-4)", borderRadius: "8px", overflowX: "auto" }}><code>{`WITH velocity AS (
  SELECT user_id, COUNT(*) AS n_trx
  FROM transaksi
  WHERE waktu >= now() - interval '1 hour'
  GROUP BY user_id HAVING COUNT(*) > 20
),
perangkat AS (
  SELECT user_id, COUNT(DISTINCT device_fp) AS n_device
  FROM sesi GROUP BY user_id
),
kandidat AS (
  SELECT v.user_id, v.n_trx, p.n_device
  FROM velocity v JOIN perangkat p USING (user_id)
  WHERE p.n_device >= 3   -- 1 user, 3+ device bergantian = aneh
)
SELECT * FROM kandidat ORDER BY n_trx DESC;
-- Tiap CTE = 1 hipotesis. Gabungan = kesimpulan. Audit trail alami!`}</code></pre>

      <PlotlyChart
        data={queryData}
        title="Efektivitas Pola Query (proporsi investigasi yang membuahkan temuan, ilustrasi)"
        layout={{ xaxis: { title: "Pola query" }, yaxis: { title: "Hit rate investigasi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = seberapa sering pola query itu menghasilkan temuan saat dipakai investigasi.</p>
        <p><strong>Interpretasi:</strong> <strong>window function (0,72)</strong> dan <strong>self-join (0,68)</strong> mengalahkan GROUP BY sederhana (0,55) — karena mereka menangkap <em>konteks</em> dan <em>relasi</em>, bukan sekadar agregat. Dan <code className="inline">SELECT *</code> (0,05) = &ldquo;scrolling berharap menemukan&rdquo; — bukan investigasi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;SQL cuma untuk ambil data — analisisnya di Python.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> untuk investigasi, <strong>SQL <em>adalah</em> analisisnya</strong>. Memindahkan 10 juta baris ke Python untuk dihitung &ldquo;count per user&rdquo; = bodoh — database melakukannya 100× lebih cepat. Aturan: <strong>agregat &amp; filter di SQL, modeling &amp; visualisasi di Python</strong>.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: SQL Velocity Attack (sqlite Asli!)</h2>
      <p>Jalankan SQL sungguhan di browser — temukan penyerangnya.</p>
      <PyodideLab
        title="Lab 1 — GROUP BY + HAVING: Berburu Velocity"
        hint="Ubah HAVING > 5 → > 10 → > 20. Pada ambang berapa U007 masih tertangkap tapi 'noise' hilang? Itulah tuning dalam SQL."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Window Function + Self-Join</h2>
      <PyodideLab
        title="Lab 2 — Window + Self-Join: Entity Resolution"
        hint="Ubah ambang atribut_sama ≥1 → ≥2. Pasangan mana yang hilang? Rasakan trade-off false merge vs missed link dalam SQL."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Dua Query yang Menangkap 80% Pola</h2>
      <p>SQL fraud = <strong>menerjemahkan intuisi menjadi agregasi</strong>. Dua contoh dengan penjelasan baris per baris.</p>

      <details className="worked">
        <summary>📐 Contoh 1: velocity per kartu per jam (dengan penjelasan)</summary>
        <p>Pertanyaan: &ldquo;kartu mana yang transaksi &gt; 8× dalam 1 jam terakhir?&rdquo;</p>
        <p><strong>Query:</strong></p>
        <pre>{`SELECT card_id,
       COUNT(*) AS trx_1h,
       SUM(amount) AS amt_1h
FROM transactions
WHERE trx_time >= NOW() - INTERVAL '1 hour'
GROUP BY card_id
HAVING COUNT(*) > 8
ORDER BY amt_1h DESC;`}</pre>
        <p><strong>Bedah baris:</strong> <em>WHERE trx_time &gt;= ...</em> — batasi jendela dulu (filter sebelum agregasi = cepat). <em>GROUP BY card_id</em> — entitas agregasi (FR6: pilih entitas yang tepat!). <em>HAVING COUNT(*) &gt; 8</em> — filter <em>setelah</em> agregasi (WHERE tidak bisa pakai hasil COUNT). <em>ORDER BY amt_1h DESC</em> — urutkan by expected value: investigator mulai dari yang paling mahal.</p>
        <p><strong>Variasi analis senior:</strong> tambahkan <em>perbandingan baseline</em> — join ke tabel rata-rata historis kartu, flag hanya jika &gt; 10× baseline-nya. Tanpa ini, kartu korporat yang memang 50 trx/jam ikut ke-flag (false positive abadi).</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: device sharing via self-join</summary>
        <p>Pertanyaan: &ldquo;device apa yang dipakai oleh ≥ 5 KTP berbeda dalam 7 hari?&rdquo; (pola pabrik pengajuan FR6/FR12).</p>
        <p><strong>Query:</strong></p>
        <pre>{`SELECT device_id,
       COUNT(DISTINCT ktp_no) AS ktp_count,
       COUNT(*) AS total_pengajuan
FROM loan_applications
WHERE apply_time >= NOW() - INTERVAL '7 days'
GROUP BY device_id
HAVING COUNT(DISTINCT ktp_no) >= 5;`}</pre>
        <p><strong>Bedah:</strong> <em>COUNT(DISTINCT ktp_no)</em> — kuncinya: bukan jumlah pengajuan, tapi jumlah <em>identitas unik</em>. Satu orang mengajukan 10× = 1 (wajar, mungkin gagal upload). 10 KTP dari 1 device = 10 (pabrik!).</p>
        <p><strong>Langkah lanjut (investigasi):</strong> untuk tiap device yang kena, tarik daftar KTP-nya + join ke tabel pencairan — berapa yang <em>cair</em>? Itulah eksposur rupiahnya. Lalu: apakah KTP-KTP itu juga muncul di device lain? (2-hop — cikal bakal graph FR12). <strong>SQL yang baik tidak berhenti di &ldquo;ketemu&rdquo; — ia membuka pintu investigasi berikutnya.</strong></p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: SQL adalah Mikroskop</h2>
      <p>Saat insiden fraud pecah, <strong>pertanyaan pertama bukan &ldquo;model apa yang dipakai?&rdquo; tapi &ldquo;berapa besar? ke mana? siapa lagi?&rdquo;</strong> — dan ketiga pertanyaan itu dijawab SQL dalam hitungan menit. SQL adalah <strong>mikroskop analis</strong>: ia tidak sepintar model, tapi ia <em>jujur</em> (menampilkan data apa adanya), <em>cepat</em> (menit, bukan minggu), dan <em>bisa diaudit</em> (query-nya dibaca siapa pun).</p>
      <p>Intuisi kedua: <strong>query yang baik = berpikir dalam <em>himpunan</em>, bukan baris</strong>. Pemula menulis query yang &ldquo;melihat&rdquo; transaksi satu per satu; profesional menulis agregasi yang &ldquo;melihat&rdquo; pola populasi. Perbedaannya: &ldquo;tampilkan transaksi mencurigakan&rdquo; (10.000 baris, tidak ada yang membaca) vs &ldquo;kelompokkan per device, urutkan by KTP unik&rdquo; (41 baris = 41 keputusan). <strong>Agregasi adalah kompresi keputusan.</strong></p>
      <p><strong>Kapan SQL TIDAK cukup:</strong> (1) <strong>pola sekuensial kompleks</strong> — &ldquo;urutan 5 event dalam 2 menit dengan jeda spesifik&rdquo; menyiksa di SQL; (2) <strong>multi-hop graph dalam</strong> — recursive CTE bisa, tapi lambat &amp; sulit dibaca; (3) <strong>teks/gambar</strong> — bukan ranah relasional; (4) <strong>prediksi probabilistik</strong> — itu tugas model. <strong>Kenali batas mikroskopmu — lalu pinjam teleskop (Python/ML) untuk yang di luar jangkauannya.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> simpan setiap query investigasi penting sebagai <strong>view/query tersimpan dengan nama jelas</strong> — &ldquo;v_mule_fanout_7d&rdquo;, &ldquo;v_device_sharing&rdquo;. Investigasi berikutnya dimulai dari sana, bukan dari kanvas kosong. <strong>Koleksi query = memori institusional tim.</strong></p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Pola SQL untuk Kasus Apa</h2>

      <div className="decision-card">
        <h3>1. &ldquo;Siapa yang aneh?&rdquo; (velocity, fan-out) → <strong>GROUP BY + HAVING</strong></h3>
        <p><strong>Kenapa:</strong> tercepat, paling mudah dibaca. Selalu mulai di sini.</p>
      </div>

      <div className="decision-card">
        <h3>2. &ldquo;Transaksi mana yang aneh + konteksnya?&rdquo; → <strong>window function</strong></h3>
        <p><strong>Kenapa:</strong> tiap baris membawa agregatnya — bukti per transaksi.</p>
      </div>

      <div className="decision-card">
        <h3>3. &ldquo;Siapa berbagi identitas/device?&rdquo; → <strong>self-join</strong></h3>
        <p><strong>Kenapa:</strong> entity resolution versi SQL; ingat trik <code className="inline">a.id &lt; b.id</code>.</p>
      </div>

      <div className="decision-card">
        <h3>4. Investigasi multi-langkah → <strong>CTE bertingkat</strong></h3>
        <p><strong>Kenapa:</strong> tiap langkah = hipotesis bernama; audit trail alami untuk laporan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Agregat &amp; filter di <strong>SQL</strong>; modeling di Python.</li>
          <li>Mulai dari GROUP BY + HAVING — naik ke window/self-join bila perlu.</li>
          <li>Self-join selalu pakai <code className="inline">a.id &lt; b.id</code>.</li>
          <li>Investigasi kompleks = CTE bertingkat (terbaca = teraudit).</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Teknik Apa</h2>
      <p>Tiga pilihan teknik yang menentukan query-mu cepat atau lemot, tepat atau ngawur:</p>
      <p><strong>Skenario A — window function vs self-join.</strong> Untuk &ldquo;transaksi sebelumnya dari kartu yang sama&rdquo;: <strong>window function</strong> (LAG/LEAD, ROW_NUMBER) — 1 scan, jauh lebih cepat. Self-join hanya untuk relasi <em>antar entitas berbeda</em> (device–KTP). Aturan: <em>satu tabel, urutan waktu → window function; dua entitas → join</em>.</p>
      <p><strong>Skenario B — kapan materialized view.</strong> Query velocity dijalankan tiap 5 menit oleh dashboard + tiap ada investigasi. Hitung ulang dari 100 juta baris tiap kali = bunuh database. Solusi: <strong>materialized view per jam</strong> yang di-refresh terjadwal — query menjadi baca tabel kecil. Harga: data basi ≤ 1 jam (untuk monitoring cukup; untuk blokir realtime tidak — itu ranah feature store FR13).</p>
      <p><strong>Skenario C — kapan SQL cukup vs butuh Python.</strong> SQL cukup untuk: agregasi, filter pola, join investigasi (80% pekerjaan!). Butuh Python ketika: model ML, graph multi-hop kompleks, atau teks/NLP. Aturan jujur: <strong>jika bisa SQL, jangan Python</strong> — SQL lebih cepat, lebih mudah diaudit, dan bisa dijalankan siapa pun di tim.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> 80% pola fraud bisa ditangkap dengan <strong>SQL yang rapi</strong> — sebelum menyentuh ML apa pun. Analis yang menguasai window function + agregasi cerdas lebih berharga daripada yang bisa memanggil 10 algoritma tapi tidak bisa menulis query investigasi.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Forensik Mule Ring dalam 1 Jam</h2>
      <p>Skenario forensik (pola umum investigasi bank): satu rekening mule <strong>tertangkap</strong> (dilaporkan korban). Tugasmu: temukan seluruh jaringannya — dengan SQL, dalam 1 jam.</p>
      <p><strong>Query 1 — ke mana uangnya pergi (fan-out):</strong> semua rekening tujuan transfer dari mule tertangkap dalam 7 hari terakhir, dengan total nominal. Hasil: 14 rekening, total Rp840jt — 80% dalam 2 jam setelah dana masuk (pola <em>pass-through</em>, bukan tabungan).</p>
      <p><strong>Query 2 — siapa saudara-saudaranya (shared attributes):</strong> rekening lain yang (a) menerima dari pengirim yang sama, ATAU (b) login dari device yang sama, ATAU (c) dibuka di cabang &amp; tanggal yang sama. Hasil: 23 rekening kandidat — <strong>jaringan 24 rekening</strong> (termasuk yang tertangkap).</p>
      <p><strong>Query 3 — berapa eksposurnya:</strong> total dana masuk ke 24 rekening dalam 30 hari − yang sudah dibekukan. Hasil: <strong>Rp2,1 miliar</strong> perputaran, Rp1,4 miliar masih bisa diselamatkan dengan pembekuan serentak <em>hari ini</em>.</p>
      <p><strong>Pelajaran:</strong> tiga query sederhana — <strong>tanpa ML, tanpa graph database</strong> — memetakan jaringan Rp2,1 miliar dalam 1 jam. Inilah kenapa SQL adalah <em>senjata forensik utama</em>: saat insiden, kamu butuh jawaban dalam jam, bukan model yang butuh 2 minggu training. Kuasai dulu yang cepat, baru yang canggih.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;SQL itu kuno, sekarang zamannya Python/ML.&rdquo;<br /><strong>Yang benar:</strong> dalam investigasi fraud, <strong>kecepatan menjawab &gt; kecanggihan metode</strong>. Query yang menjawab dalam 10 menit mengalahkan model yang menjawab dalam 10 hari — karena uangnya sudah pergi dalam 10 jam. SQL bukan kuno; ia <em>senjata tercepat</em> di gudangmu.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 48 Jam Menemukan Ring Mule</h2>
      <div className="callout">
        <p>PPATK: 1.000 rekening terindikasi, 8.000 transfer (30 hari). Kamu punya <strong>akses SQL read-only</strong> dan 48 jam. Tidak ada tools graph, tidak ada Python — hanya SQL.</p>
        <p><strong>Pertanyaan:</strong> tulis urutan 4 query (tujuan + SQL inti tiap query) yang memetakan jaringan. Query 4 harus menghasilkan daftar &ldquo;hub&rdquo; terurut.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Q1 — peta aliran:</strong> <code className="inline">SELECT pengirim, COUNT(*), SUM(nominal) FROM transfer GROUP BY pengirim ORDER BY SUM(nominal) DESC LIMIT 20</code> — siapa penggerak dana terbesar.</p>
          <p><strong>Q2 — fan-out:</strong> <code className="inline">SELECT pengirim, COUNT(DISTINCT penerima) AS n FROM transfer GROUP BY pengirim HAVING COUNT(DISTINCT penerima) &gt; 10</code> — kandidat distributor.</p>
          <p><strong>Q3 — pasangan berbagi:</strong> self-join rekening pada atribut bersama (no_hp/device/alamat) — apakah 1.000 &ldquo;orang&rdquo; = 200 orang?</p>
          <p><strong>Q4 — hub terurut:</strong> CTE gabungan: <code className="inline">WITH fanout AS (...), terima AS (SELECT penerima, SUM(nominal) AS masuk ...)</code> → skor hub = fan-out × total aliran, urut menurun. <strong>Output untuk penyidik:</strong> 20 hub teratas + pola masing-masing.</p>
          <p><strong>Pelajaran:</strong> 4 query SQL yang tepat = 80% nilai graph analytics (FR12) — tanpa tools canggih. <strong>SQL adalah senjata darurat terbaik.</strong></p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: SQL untuk Fraud</h2>
      <details className="worked">
        <summary>Q1: Query lambat di 100 juta baris — optimasi pertama apa?</summary>
        <p><strong>Tiga jurus 80/20:</strong> (1) <em>filter waktu dulu</em> — WHERE trx_time sebelum JOIN/GROUP (partisi!); (2) <em>agregasi sebelum join</em> — kecilkan dulu, baru gabungkan; (3) <em>indeks di kolom filter</em> (waktu, entitas). Jika masih lambat: <em>materialized view</em> untuk pola yang dihitung berulang. <strong>Jangan SELECT * — jangan pernah.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: Window function vs GROUP BY — kapan mana?</summary>
        <p><strong>GROUP BY</strong> = &ldquo;ringkas per entitas&rdquo; (1 baris per kartu). <strong>Window function</strong> = &ldquo;hitung sesuatu <em>tanpa</em> menghilangkan baris&rdquo; (tambahkan kolom &ldquo;transaksi ke-N kartu ini&rdquo;). Untuk deteksi pola: window function untuk <em>urutan &amp; perbandingan antar baris</em> (LAG = transaksi sebelumnya), GROUP BY untuk <em>agregat</em> (velocity). <strong>Kuasai keduanya — mereka pasangan, bukan pesaing.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Kapan pindah dari SQL ke Python?</summary>
        <p><strong>Empat sinyal:</strong> (1) butuh <em>model statistik/ML</em>; (2) logika <em>iteratif/rekursif dalam</em> yang menyiksa di SQL; (3) <em>data non-relasional</em> (teks, JSON nested dalam); (4) <em>visualisasi eksplorasi</em> cepat. Tapi: <strong>ekstrak dengan SQL, analisis dengan Python</strong> — jangan tarik 100 juta baris ke pandas. <em>Database untuk menyaring, Python untuk berpikir.</em></p>
      </details>
      <details className="worked">
        <summary>Q4: Bagaimana memastikan query investigasi bisa dipercaya di pengadilan/audit?</summary>
        <p><strong>Empat syarat:</strong> (1) <em>versioned</em> — query tersimpan dengan tanggal &amp; penulis; (2) <em>reproducible</em> — dijalankan ulang memberi hasil sama (hati-hati NOW() — catat timestamp eksekusi!); (3) <em>terdokumentasi</em> — apa yang dihitung &amp; kenapa; (4) <em>chain of custody data</em> — dari tabel mana, kapan diambil. <strong>Query forensik = barang bukti</strong> — perlakukan dengan standar itu.</p>
      </details>

      <details className="worked">
        <summary>Q5: Recursive CTE — kapan berguna di investigasi fraud?</summary>
        <p>Untuk <strong>rantai dengan panjang tak diketahui</strong>: &ldquo;telusuri aliran dana dari rekening X sampai mentok (atau 10 hop)&rdquo;. Recursive CTE mengikuti rantai selangkah demi selangkah — yang tidak bisa dilakukan JOIN biasa (butuh N join untuk N hop). <strong>Batas kedalaman wajib</strong> (misal 10) agar tidak infinite loop di graph bersiklus. Untuk analisis rutin → graph DB; untuk <strong>forensik ad-hoc</strong> → recursive CTE cukup.</p>
      </details>
      <details className="worked">
        <summary>Q6: Bagaimana me-versioning query investigasi?</summary>
        <p><strong>Perlakukan query seperti kode:</strong> simpan di Git (atau minimal folder berversion), beri nama deskriptif + tanggal + penulis di header comment, catat <em>parameter</em> (rentang waktu!) setiap eksekusi. Query forensik tanpa version = <strong>barang bukti tanpa label</strong> — tidak bisa direproduksi, tidak bisa dipertahankan. <em>Reproducibility = kredibilitas.</em></p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Query Forensik</h2>
      <p><strong>1.</strong> Tulis query: kartu dengan &gt; 6 transaksi dalam 30 menit terakhir, tampilkan juga total nominal, urutkan dari yang terbesar. Tabel: transactions(card_id, trx_time, amount).</p>
      <p><strong>2.</strong> Satu rekening mule tertangkap (id 'M-001'). Tulis query untuk menemukan rekening <em>tujuan</em> transfernya dalam 7 hari terakhir + total nominal per tujuan.</p>
      <p><strong>3.</strong> Query-mu di 200 juta baris lambat (90 detik). Sebutkan 2 optimasi pertama + kapan kamu memakai materialized view.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> <em>SELECT card_id, COUNT(*) AS n, SUM(amount) AS total FROM transactions WHERE trx_time &gt;= NOW() - INTERVAL '30 minutes' GROUP BY card_id HAVING COUNT(*) &gt; 6 ORDER BY total DESC;</em> — filter waktu dulu, agregat, HAVING untuk hasil agregasi.</p>
        <p><strong>2.</strong> <em>SELECT dst_account, SUM(amount) AS total FROM transfers WHERE src_account = 'M-001' AND trx_time &gt;= NOW() - INTERVAL '7 days' GROUP BY dst_account ORDER BY total DESC;</em> — ini <strong>fan-out</strong>: langkah pertama memetakan jaringan.</p>
        <p><strong>3.</strong> (1) Pastikan <strong>partisi/index di trx_time</strong>; (2) <strong>agregasi sebelum join</strong>. Materialized view saat query <strong>dijalankan berulang</strong> (dashboard tiap 5 menit) dan <strong>basi 1 jam masih bisa diterima</strong>.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 'User dengan >20 transaksi/jam' — klausa yang tepat?"
        options={[
          "WHERE COUNT(*) > 20",
          "GROUP BY user_id HAVING COUNT(*) > 20 — HAVING menyaring KELOMPOK (sesudah agregat)",
          "ORDER BY COUNT(*)",
          "LIMIT 20",
        ]}
        correct={1}
        explanation="Benar: HAVING. WHERE menyaring baris sebelum agregat — 'COUNT(*) > 20' adalah sifat kelompok, jadi harus HAVING (sesudah GROUP BY)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kamu butuh tiap transaksi + 'berapa trx user ini 1 jam terakhir' TANPA meruntuhkan baris. Pakai?"
        options={[
          "GROUP BY",
          "Window function: COUNT(*) OVER (PARTITION BY user_id ...) — agregat sebagai konteks per baris",
          "Self-join",
          "DELETE",
        ]}
        correct={1}
        explanation="Benar: window function. GROUP BY meruntuhkan baris jadi 1 per grup; OVER() menempelkan agregat ke tiap baris — bukti per transaksi dengan konteksnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam self-join akun a JOIN akun b, mengapa syarat a.id < b.id?"
        options={[
          "Agar cepat",
          "Menghindari pasangan ganda (A-B dan B-A) + pasangan diri sendiri (A-A) — jebakan klasik self-join",
          "Tidak perlu",
          "Agar urut abjad",
        ]}
        correct={1}
        explanation="Benar: tanpa itu tiap pasangan muncul 2× plus self-pair — hasil 2× lipat + noise. Satu baris syarat menghemat kebingungan berjam-jam."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Investigasi 4 langkah (velocity → device → pasangan → hub). Struktur SQL terbaik?"
        options={[
          "1 query raksasa nested",
          "CTE bertingkat (WITH ...) — tiap langkah = hipotesis bernama; terbaca, teraudit, bisa dipakai ulang",
          "4 file terpisah tanpa hubungan",
          "Copy-paste hasil manual",
        ]}
        correct={1}
        explanation="Benar: CTE. Investigasi = narasi logis; CTE membuatnya eksplisit. Query raksasa nested = tidak ada yang berani menyentuh 6 bulan kemudian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 10 juta baris, butuh 'count per user'. Di mana hitung?"
        options={[
          "Tarik semua ke Python lalu hitung",
          "Di SQL (database) — 100× lebih cepat; agregat & filter di SQL, modeling di Python",
          "Di Excel",
          "Tidak perlu dihitung",
        ]}
        correct={1}
        explanation="Benar: di database. Memindahkan 10 juta baris untuk operasi yang DB lakukan dalam detik = pemborosan fundamental. Aturan: komputasi sedekat mungkin dengan data."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>SQL = skill #1</strong> lowongan fraud/AML (92%) — bahasa investigasi, bukan sekadar &ldquo;ambil data&rdquo;.</li>
          <li><strong>GROUP BY + HAVING:</strong> &ldquo;siapa yang aneh?&rdquo; — mulai investigasi di sini.</li>
          <li><strong>Window function:</strong> konteks per baris tanpa meruntuhkan — <code className="inline">OVER (PARTITION BY ...)</code>.</li>
          <li><strong>Self-join:</strong> entity resolution; selalu <code className="inline">a.id &lt; b.id</code>.</li>
          <li><strong>CTE:</strong> investigasi bertingkat yang terbaca = teraudit.</li>
          <li>Agregat &amp; filter di <strong>SQL</strong>; modeling di Python.</li>
          <li>Kapan TIDAK pakai SQL: modeling ML &amp; visualisasi kompleks — serahkan ke Python.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr20-capstone" className="btn btn-secondary btn-sm">← FR20</Link>
        <Link href="/learn/fr22-chargeback" className="btn btn-primary btn-sm">Next: FR22 →</Link>
      </div>
    </div>
  );
}

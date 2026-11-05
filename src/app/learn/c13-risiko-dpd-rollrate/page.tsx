import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function C13RisikoDpdRollratePage() {
  const chart1 = [{"x": ["current", "1-30", "31-60", "61-90", "90+"], "y": [5, 2, 2, 1, 2], "type": "bar", "marker": {"color": ["#34a853", "#e8a838", "#f59e0b", "#f97316", "#ef4444"]}, "text": ["5", "2", "2", "1", "2"], "textposition": "outside"}];
  const chart2 = [{"x": ["MOB 3", "MOB 6", "MOB 12", "MOB 18"], "y": [0.5, 1.2, 2.1, 2.3], "type": "scatter", "mode": "lines+markers", "name": "Vintage Jan-25", "line": {"color": "#2a7de1", "width": 3}}, {"x": ["MOB 3", "MOB 6", "MOB 12", "MOB 18"], "y": [0.8, 2.0, 3.5, 4.1], "type": "scatter", "mode": "lines+markers", "name": "Vintage Jul-25", "line": {"color": "#ef4444", "width": 3}}];
  const lab1Code = String.raw`import sqlite3
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
# SELECT SUM(CASE WHEN kolektibilitas>=3 THEN plafon ELSE 0 END)*1.0/SUM(plafon) AS npl_ratio, SUM(CASE WHEN kolektibilitas>=3 THEN plafon ELSE 0 END) AS npl_nominal, SUM(plafon) AS total FROM kredit
q("""SELECT kolektibilitas, COUNT(*), SUM(plafon) FROM kredit GROUP BY kolektibilitas""")`;
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
# WITH b AS (SELECT CASE WHEN dpd BETWEEN 1 AND 30 THEN '1-30' WHEN dpd BETWEEN 31 AND 60 THEN '31-60' ELSE 'lain' END AS ini, CASE WHEN dpd+30 BETWEEN 31 AND 60 THEN '31-60' WHEN dpd+30 BETWEEN 61 AND 90 THEN '61-90' ELSE 'lain' END AS depan FROM kredit) SELECT ini, COUNT(*), SUM(CASE WHEN depan<>ini THEN 1 ELSE 0 END)*1.0/COUNT(*) FROM b WHERE ini<>'lain' GROUP BY ini
q("""SELECT dpd, dpd+30 AS dpd_depan FROM kredit""")`;
  const quizData = [{"question": "NPL ratio naik. Yang harus dicek dulu…", "options": ["Langsung salahkan marketing", "Nominal + definisi + komponen (bucket/vintage)", "Hapus data lama", "Ganti definisi"], "correct": 1, "explanation": "Benar: ratio = pembilang/pernyebut — bedah dulu sebelum simpulkan."}, {"question": "Roll rate 1–30 → 31–60 = 25% artinya…", "options": ["25% sudah bayar", "25% saldo bucket 1–30 memburuk ke 31–60", "NPL 25%", "DPD rata-rata 25"], "correct": 1, "explanation": "Benar: probabilitas transisi = PD empiris antar bucket."}, {"question": "Vintage Jul-25 konsisten lebih buruk dari Jan-25. Diagnosis…", "options": ["Ekonomi memburuk", "Underwriting angkatan Jul-25 bermasalah", "Collection malas", "Data salah"], "correct": 1, "explanation": "Benar: pola per angkatan = masalah origination, bukan sistemik."}, {"question": "Roll rate yang BENAR butuh…", "options": ["Satu snapshot", "Snapshot 2 periode (bulan ini vs bulan lalu)", "Rata-rata", "Estimasi"], "correct": 1, "explanation": "Benar: transisi butuh dua titik waktu (SCD-2)."}, {"question": "Vintage 3 bulan yang &ldquo;bersih&rdquo;…", "options": ["Pasti baik", "Belum tentu — butuh seasoning 12–24 bulan", "Harus di-write-off", "Tidak bisa dianalisis"], "correct": 1, "explanation": "Benar: pola default butuh waktu matang."}, {"question": "NPL regulator dihitung berdasar…", "options": ["Jumlah debitur", "Baki debet (nominal)", "Jumlah kredit", "Rata-rata"], "correct": 1, "explanation": "Benar: nominal — satu debitur besar mengubah segalanya."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">C13 — SQL Risk</span>
        <h1 className="display-title">DPD, Roll Rate &amp; Vintage:<br/>Bahasa Risiko Kredit</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;NPL Naik 0,5% — Kenapa?&rdquo;</a></li>
          <li><a href="#dpd">DPD Bucket — Bahasa Kolektibilitas</a></li>
          <li><a href="#rollrate">Roll Rate — Probabilitas Memburuk</a></li>
          <li><a href="#vintage">Vintage — Cohort-nya Kredit</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bucket &amp; NPL</a></li>
          <li><a href="#lab2">🔬 Lab 2: Roll Rate Sederhana</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metrik Risiko</a></li>
          <li><a href="#case">📋 Mini-Case: Diagnosis NPL Naik (60+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menghitung <strong>DPD bucket</strong> dan <strong>roll rate</strong> antar bucket.</li><li>Membangun <strong>vintage analysis</strong> (cohort-nya kredit!).</li><li>Menghitung <strong>NPL ratio</strong> sesuai definisi regulator.</li><li>Menjelaskan bagaimana metrik ini dipakai di <strong>credit risk</strong> (track CR).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;NPL Naik 0,5% — Kenapa?&rdquo;</h2>

      <div className="story"><p>Laporan bulanan: NPL naik dari 2,1% ke 2,6%. Direksi bertanya <em>kenapa</em> — dan angka agregat tidak bisa menjawab. Apakah vintage 2025 yang buruk? Apakah kolektibilitas 2 bergeser ke 3 (roll rate memburuk)? Atau satu debitur besar macet?</p><p>Tiga alat diagnosis — <strong>DPD bucket, roll rate, vintage</strong> — membedah NPL menjadi <em>di mana</em> masalahnya. Ini SQL yang langsung dipakai di credit risk (track CR1/CR2). Lesson case-heavy (60+ menit).</p><p><strong>Twist-nya:</strong> NPL naik 2,1% → 2,6% — satu angka, tiga penyakit yang sama sekali berbeda (vintage buruk? roll rate memburuk? satu debitur besar macet?). Dan obatnya beda total untuk tiap penyakit. Angka agregat seperti demam: ia bilang &ldquo;ada yang salah&rdquo; tapi tidak bilang <em>di mana</em> — dan mengobati demam tanpa diagnosis = mengobati gejala sambil penyakitnya berjalan.</p></div>

      <h2 id="dpd">DPD Bucket — Bahasa Kolektibilitas</h2>

      <p><strong>DPD</strong> (Days Past Due) = hari keterlambatan bayar. <strong>Bucket</strong> standar Indonesia:</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Bucket</th><th>DPD</th><th>Kolektibilitas</th><th>Arti</th></tr></thead>
<tbody>
<tr><td>Current</td><td>0</td><td>1 (Lancar)</td><td>Bayar tepat</td></tr>
<tr><td>1–30</td><td>1–30</td><td>2 (DPK)</td><td>Terlambat ringan</td></tr>
<tr><td>31–60</td><td>31–60</td><td>3 (Kurang lancar)</td><td>Mulai bermasalah</td></tr>
<tr><td>61–90</td><td>61–90</td><td>4 (Diragukan)</td><td>Serius</td></tr>
<tr><td>90+</td><td>&gt; 90</td><td>5 (Macet)</td><td>NPL!</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT
  CASE WHEN dpd = 0 THEN &#x27;current&#x27;
       WHEN dpd BETWEEN 1 AND 30 THEN &#x27;1-30&#x27;
       WHEN dpd BETWEEN 31 AND 60 THEN &#x27;31-60&#x27;
       WHEN dpd BETWEEN 61 AND 90 THEN &#x27;61-90&#x27;
       ELSE &#x27;90+&#x27; END AS bucket,
  COUNT(*) AS n,
  SUM(plafon) AS exposure
FROM kredit
GROUP BY 1;</pre>

      <p><strong>NPL</strong> = kolektibilitas 3–5 (atau DPD &gt; 90, tergantung definisi — <strong>samakan definisi dulu!</strong>):</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT SUM(CASE WHEN kolektibilitas &gt;= 3 THEN plafon ELSE 0 END)
         * 1.0 / SUM(plafon) AS npl_ratio
FROM kredit;</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Selalu dokumentasikan definisi NPL di query (komentar!): &ldquo;-- NPL = kol 3-5 per SE OJK&rdquo;. Definisi beda = angka beda = rapat yang panas.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;NPL naik = penyaluran buruk.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Belum tentu! NPL ratio = pembilang/pernyebut — bisa naik karena <em>penyebut menyusut</em> (penyaluran turun) sementara pembilang tetap. Selalu tampilkan <strong>nominal + ratio</strong> berdampingan (pelajaran C10: % tanpa basis = manipulasi).</p>
</div>

      <h2 id="rollrate">Roll Rate — Probabilitas Memburuk</h2>

      <p><strong>Definisi.</strong> <strong>Roll rate</strong> = % saldo di bucket X bulan ini yang <em>pindah ke bucket lebih buruk</em> bulan depan. Ini <strong>PD empiris</strong> antar bucket!</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">WITH b AS (
  SELECT nasabah_id,
    CASE WHEN dpd BETWEEN 1 AND 30 THEN &#x27;1-30&#x27;
         WHEN dpd BETWEEN 31 AND 60 THEN &#x27;31-60&#x27; ELSE &#x27;lain&#x27; END AS bucket_ini,
    -- simulasi bulan depan: dpd + 30 (asumsi tak bayar)
    CASE WHEN dpd + 30 BETWEEN 31 AND 60 THEN &#x27;31-60&#x27;
         WHEN dpd + 30 BETWEEN 61 AND 90 THEN &#x27;61-90&#x27; ELSE &#x27;lain&#x27; END AS bucket_depan
  FROM kredit)
SELECT bucket_ini,
  COUNT(*) AS n,
  SUM(CASE WHEN bucket_depan &lt;&gt; bucket_ini THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS roll_rate
FROM b WHERE bucket_ini &lt;&gt; &#x27;lain&#x27;
GROUP BY 1;</pre>

      <ul>
<li><strong>Roll rate matrix</strong> (bucket_ini × bucket_depan) = <strong>matriks transisi Markov</strong> (B14!) — jembatan ke modeling.</li>
<li><strong>Kapan:</strong> provisioning (CKPN!), stress test, prediksi NPL.</li>
<li><strong>Asumsi lab disederhanakan;</strong> produksi: butuh snapshot bulanan (SCD-2!).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Roll rate adalah <strong>jembatan SQL → modeling</strong>: angka yang kamu hitung di sini menjadi input matriks transisi di B14 dan PD di track CR. SQL bukan sekadar &ldquo;ambil data&rdquo; — ia menghitung parameter model!</p>
</div>

      <h2 id="vintage">Vintage — Cohort-nya Kredit</h2>

      <p><strong>Vintage</strong> = cohort berdasar <em>bulan pencairan</em> (origination). Analisis: bagaimana kualitas tiap angkatan seiring umur (MOB = month on book)?</p>

      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- NPL per vintage (angkatan)
SELECT strftime(&#x27;%Y-%m&#x27;, &#x27;2026-01-01&#x27;) AS vintage,  -- bulan cair (simulasi)
  COUNT(*) AS n,
  AVG(CASE WHEN kolektibilitas &gt;= 3 THEN 1.0 ELSE 0 END) AS npl_rate
FROM kredit
GROUP BY 1;</pre>

      <ul>
<li><strong>Kurva vintage:</strong> X = MOB (umur), Y = NPL%, garis per vintage — pola &ldquo;naik lalu stabil&rdquo; normal; yang <em>lebih tinggi dari kakaknya</em> = underwriting memburuk!</li>
<li><strong>Diagnosis NPL naik:</strong> vintage baru buruk? → masalah underwriting. Vintage lama memburuk? → masalah collection/ekonomi.</li>
<li><strong>Butuh:</strong> tanggal pencairan + snapshot DPD per bulan (data historis!).</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Vintage buruk = langsung ketahuan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak — kredit butuh <em>seasoning</em> (12–24 bulan) sebelum pola default terlihat. Vintage 6 bulan yang &ldquo;bersih&rdquo; belum tentu baik; ia belum matang. Jangan nilai bayi dari ujian akhir!</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Distribusi Bucket DPD (data lab kredit)"
  layout={{"xaxis": {"title": "Bucket"}, "yaxis": {"title": "Jumlah kredit"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi = jumlah kredit per bucket DPD.</p>
<p><strong>Interpretasi:</strong> Bentuk &ldquo;menurun&rdquo; normal (makin parah makin sedikit). <strong>Waspada pola &ldquo;menumpuk di 1–30&rdquo;</strong> = evergreening (bayar minimum agar tak roll)? Atau &ldquo;lubang di 31–60&rdquo; = write-off agresif? Bentuk distribusi bercerita.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Kurva Vintage: NPL% per MOB (ilustrasi)"
  layout={{"xaxis": {"title": "Month on Book"}, "yaxis": {"title": "NPL %"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> X = umur kredit; Y = NPL%; garis = angkatan pencairan.</p>
<p><strong>Interpretasi:</strong> Vintage Jul-25 (merah) <strong>konsisten di atas</strong> Jan-25 — underwriting memburuk di tengah tahun! Diagnosis presisi: bukan ekonomi (semua vintage kena?) tapi <em>angkatan</em> tertentu. (Angka ilustrasi.)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. NPL naik = gejala; DPD/roll/vintage = diagnosis.</p>

            <details className="worked">
              <summary>📐 Kasus 1: DPD bucket — potret 30 detik</summary>
              <p>Portofolio Rp10 T. Bucket: lancar 9,4T; DPD 1–30: 300M; DPD 31–60: 150M; DPD 61–90: 80M; &gt;90: 70M. Apa yang dibaca risk manager?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT
        CASE WHEN dpd = 0 THEN &#x27;lancar&#x27;
             WHEN dpd &lt;= 30 THEN &#x27;DPD 1-30&#x27;
             WHEN dpd &lt;= 60 THEN &#x27;DPD 31-60&#x27;
             WHEN dpd &lt;= 90 THEN &#x27;DPD 61-90&#x27;
             ELSE &#x27;DPD 90+&#x27; END AS bucket,
        SUM(baki_debet)/1e9 AS rp_miliar
      FROM kredit GROUP BY 1;</pre>
              <p><strong>Bedah:</strong> total &ldquo;tidak lancar&rdquo; = 600M (6%). Yang kritis: <strong>bentuk</strong> bucket — 300M menumpuk di DPD 1–30 (baru!) vs merata. Penumpukan di bucket awal = masalah <em>baru</em> (vintage? ekonomi?) — penumpukan di 90+ = masalah <em>lama</em> yang tidak terselesaikan (collection!). Satu tabel, dua diagnosis berbeda.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Roll rate — Rp300M di DPD 1–30, berapa yang jadi macet?</summary>
              <p>Roll rate historis: 1–30 → 31–60: 35%; 31–60 → 61–90: 45%; 61–90 → 90+: 55%; 90+ → macet: 70%. Estimasi kerugian dari Rp300M?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- P(DPD1-30 -&gt; macet) = 0,35 * 0,45 * 0,55 * 0,70 = 0,0606
      -- Ekspektasi macet = 300M * 6,06% = Rp18,2 M
      SELECT 0.35*0.45*0.55*0.70 AS prob_macet;  -- 0.0606</pre>
              <p><strong>Bedah:</strong> rantai perkalian roll rate = PD implisit per bucket. Rp300M yang &ldquo;telat ringan&rdquo; menyimpan ekspektasi macet Rp18,2M — inilah dasar provisioning (CKPN/ECL stage 2!). Roll rate naik 5 poin di satu link = provisi naik jutaan — sensitivitas yang harus dimonitor.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Vintage — siapa yang merusak NPL?</summary>
              <p>NPL total naik 2,1% → 2,6%. Vintage 2024: NPL 1,8% (stabil). Vintage 2025: NPL 5,2% (baru 1 tahun!). Vintage 2023: 2,0%. Diagnosis?</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT vintage, COUNT(*) AS n,
             100.0*SUM(CASE WHEN status=&#x27;macet&#x27; THEN 1 ELSE 0 END)
               /COUNT(*) AS npl_pct
      FROM kredit GROUP BY vintage ORDER BY vintage;
      -- 2023: 2,0% | 2024: 1,8% | 2025: 5,2% &lt;-- biang kerok!</pre>
              <p><strong>Bedah:</strong> kenaikan NPL agregat <em>bukan</em> masalah portofolio lama — melainkan <strong>underwriting 2025</strong> (standar longgar? segmen baru? fraud?). Obatnya bukan &ldquo;collection lebih keras&rdquo; (untuk vintage lama) melainkan &ldquo;perketat akuisisi&rdquo; (untuk vintage baru). Salah diagnosis = salah obat = Rp miliaran melayang.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Bucket &amp; NPL</h2>

      <p>Hitung: distribusi bucket (n + exposure) dan NPL ratio (kolektibilitas ≥ 3, berdasar plafon). Tampilkan nominal + ratio!</p>

      <PyodideLab
  title="Lab 1 — NPL Ratio"
  hint="Bandingkan NPL berdasar plafon vs berdasar count. Kenapa beda? Mana yang dipakai regulator?"
  defaultCode={lab1Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 1 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">SELECT
  SUM(CASE WHEN kolektibilitas &gt;= 3 THEN plafon ELSE 0 END) AS npl_nominal,
  SUM(plafon) AS total_plafon,
  SUM(CASE WHEN kolektibilitas &gt;= 3 THEN plafon ELSE 0 END) * 1.0 / SUM(plafon) AS npl_ratio
FROM kredit;
-- regulator: berdasar baki debet (nominal), bukan count!</pre>
</details>

      <h2 id="lab2">🔬 Lab 2: Roll Rate Sederhana</h2>

      <p>Asumsikan bulan depan tiap dpd +30 (tak ada yang bayar). Hitung roll rate dari bucket '1-30' ke '31-60'.</p>

      <PyodideLab
  title="Lab 2 — Simulasi Roll Rate"
  hint="Ini simulasi kasar. Data apa yang dibutuhkan untuk roll rate BENAR? (Snapshot bulanan!)"
  defaultCode={lab2Code}
/>

      <details className="worked">
<summary>🔑 Jawaban Lab 2 (klik untuk lihat jawaban)</summary>
<p>Jawaban yang benar:</p>
<div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- roll rate butuh snapshot 2 bulan; ini simulasi dengan asumsi:
WITH b AS (
  SELECT
    CASE WHEN dpd BETWEEN 1 AND 30 THEN &#x27;1-30&#x27;
         WHEN dpd BETWEEN 31 AND 60 THEN &#x27;31-60&#x27; ELSE &#x27;lain&#x27; END AS ini,
    CASE WHEN dpd+30 BETWEEN 31 AND 60 THEN &#x27;31-60&#x27;
         WHEN dpd+30 BETWEEN 61 AND 90 THEN &#x27;61-90&#x27; ELSE &#x27;lain&#x27; END AS depan
  FROM kredit)
SELECT ini, COUNT(*) AS n,
  SUM(CASE WHEN depan &lt;&gt; ini THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS roll_rate
FROM b WHERE ini &lt;&gt; &#x27;lain&#x27; GROUP BY ini;</pre>
</details>

      <h2 id="peta">🗺️ Peta Keputusan: Metrik Risiko</h2>

      <div className="decision-card">
<h3>1. &ldquo;Seberapa parah tunggakan?&rdquo; → <strong>DPD bucket</strong></h3>
<p><strong>Kondisi data:</strong> Distribusi.</p>
<p><strong>Kenapa:</strong> CASE bucket + COUNT/SUM. Bahasa kolektibilitas.</p>
<p><strong>Contoh nyata:</strong> Exposure per bucket.</p>
</div>

      <div className="decision-card">
<h3>2. &ldquo;Berapa NPL?&rdquo; → <strong>NPL ratio</strong></h3>
<p><strong>Kondisi data:</strong> Rasio.</p>
<p><strong>Kenapa:</strong> Definisi disepakati + nominal berdampingan.</p>
<p><strong>Contoh nyata:</strong> NPL = kol 3–5 / total baki debet.</p>
</div>

      <div className="decision-card">
<h3>3. &ldquo;Seberapa cepat memburuk?&rdquo; → <strong>roll rate</strong></h3>
<p><strong>Kondisi data:</strong> Transisi.</p>
<p><strong>Kenapa:</strong> Butuh snapshot 2 periode; = PD empiris.</p>
<p><strong>Contoh nyata:</strong> 1-30 → 31-60 = 25%.</p>
</div>

      <div className="decision-card">
<h3>4. &ldquo;Angkatan mana bermasalah?&rdquo; → <strong>vintage</strong></h3>
<p><strong>Kondisi data:</strong> Cohort kredit.</p>
<p><strong>Kenapa:</strong> NPL% per MOB per angkatan cair.</p>
<p><strong>Contoh nyata:</strong> Vintage Jul-25 lebih buruk.</p>
</div>

      <div className="decision-card">
<h3>5. Diagnosis NPL naik → <strong>bedah tiga dimensi</strong></h3>
<p><strong>Kondisi data:</strong> Diagnosis.</p>
<p><strong>Kenapa:</strong> Bucket (di mana) + roll (seberapa cepat) + vintage (angkatan mana).</p>
<p><strong>Contoh nyata:</strong> Laporan direksi.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Samakan <strong>definisi</strong> NPL dulu (komentar di query!).</li><li>Selalu <strong>nominal + ratio</strong> berdampingan.</li><li>Roll rate butuh <strong>snapshot historis</strong> — tanpa itu hanya simulasi.</li><li>Vintage butuh <strong>seasoning</strong> — jangan nilai terlalu dini.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Diagnosis NPL Naik (60+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> NPL 2,1% → 2,6% dalam 3 bulan. Kamu punya tabel kredit (snapshot bulan ini) + tabel histori vintage (ilustrasi).</p><p><strong>Tugas:</strong> (1) Hitung NPL nominal + ratio. (2) Distribusi bucket — di mana penumpukan? (3) Jika vintage Jul-25 NPL-nya 2× vintage Jan-25, apa diagnosis &amp; rekomendasi? (4) Tulis <strong>memo 5 kalimat</strong> untuk direksi.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Diagnosis contoh:</strong> &ldquo;Kenaikan NPL terkonsentrasi di bucket 31–60 vintage Jul–Sep 25 (roll rate 1–30→31–60 naik 18%→27%). Vintage lama stabil — masalah <strong>underwriting</strong>, bukan collection/ekonomi. Satu debitur besar (plafon 200jt) menyumbang 0,2pp — sisanya granular.&rdquo;</p><p><strong>Rekomendasi:</strong> (1) hold penyaluran segmen vintage bermasalah sambil review scoring; (2) intensifkan collection bucket 1–30 (cagah roll); (3) monitor vintage baru mingguan.</p><p><strong>Pelajaran:</strong> angka agregat bertanya &ldquo;berapa&rdquo;; bedah bucket/roll/vintage menjawab &ldquo;kenapa&rdquo; dan &ldquo;apa yang dilakukan&rdquo;. Itulah analyst → advisor.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Roll rate: 1–30→31–60: 40%; 31–60→61–90: 50%; 61–90→macet: 60%. Rp500M di DPD 1–30: berapa ekspektasi macet?</li>
              <li>NPL naik tapi vintage <em>semua</em> stabil. Apa kemungkinan penyebabnya? (Petunjuk: komposisi.)</li>
              <li>Tulis query: NPL per vintage per DPD bucket (dua dimensi sekaligus).</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> 0,4×0,5×0,6 = 0,12 → 500M × 12% = <strong>Rp60M</strong>.</p>
              <p><strong>2.</strong> <strong>Mix effect</strong> (Simpson!): porsi vintage berisiko (2025) membesar dalam portofolio — tiap vintage sehat, tapi komposisi bergeser ke yang berisiko. Agregat naik tanpa ada vintage yang memburuk. Diagnosis butuh vintage <em>dan</em> komposisi.</p>
              <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- 3.
      SELECT vintage,
        CASE WHEN dpd=0 THEN &#x27;lancar&#x27; WHEN dpd&lt;=30 THEN &#x27;1-30&#x27;
             WHEN dpd&lt;=60 THEN &#x27;31-60&#x27; ELSE &#x27;60+&#x27; END AS bucket,
        COUNT(*) AS n,
        ROUND(100.0*SUM(CASE WHEN status=&#x27;macet&#x27; THEN 1 ELSE 0 END)/COUNT(*),2) AS npl_pct
      FROM kredit GROUP BY vintage, 2 ORDER BY vintage, 2;</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>DPD bucket:</strong> bahasa kolektibilitas; CASE + agregat.</li><li><strong>NPL ratio:</strong> samakan definisi; nominal + ratio berdampingan.</li><li><strong>Roll rate:</strong> % memburuk antar bucket = PD empiris = matriks transisi (B14).</li><li><strong>Vintage:</strong> cohort kredit — diagnosis underwriting vs collection vs ekonomi.</li><li>Bedah tiga dimensi = dari &ldquo;berapa&rdquo; ke &ldquo;kenapa&rdquo; ke &ldquo;apa yang dilakukan&rdquo;.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c12-recursive-cte" className="btn btn-secondary btn-sm">← ← C12</Link>
        <Link href="/learn/c14-fraud-velocity" className="btn btn-primary btn-sm">Next: C14 →</Link>
      </div>
    </div>
  );
}

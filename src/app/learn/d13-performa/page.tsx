import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D13PerformaPage() {
  const chart1 = [{"x": ["CSV", "Parquet"], "y": [800, 80], "type": "bar", "name": "Ukuran (MB)", "marker": {"color": "#2a7de1"}}, {"x": ["CSV", "Parquet"], "y": [60, 5], "type": "bar", "name": "Waktu baca (dtk)", "marker": {"color": "#e8a838"}}];
  const lab1Code = String.raw`
import pandas as pd, numpy as np

rng = np.random.default_rng(42)
n = 100_000
df = pd.DataFrame({
    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya", "Medan"], n),
    "status": rng.choice(["lancar", "telat", "macet"], n),
    "dpd": rng.integers(0, 200, n),
    "flag": rng.choice([True, False], n),
})
# simulasi boros: object & int64
df["kota"] = df["kota"].astype(object)

sebelum = df.memory_usage(deep=True).sum() / 1e6
print(f"Sebelum: {sebelum:.1f} MB")

df["kota"] = df["kota"].astype("category")
df["status"] = df["status"].astype("category")
df["dpd"] = df["dpd"].astype("int32")

sesudah = df.memory_usage(deep=True).sum() / 1e6
print(f"Sesudah: {sesudah:.1f} MB")
print(f"Hemat: {(1 - sesudah/sebelum):.0%}!")

# Coba: groupby di category vs object — ada beda kecepatan? (%%time di Colab)
`;
  const lab2Code = String.raw`
import pandas as pd, numpy as np

# simulasi: generator chunk (seperti read_csv chunksize)
def gen_chunks(n_total=1_000_000, chunk_n=100_000, seed=42):
    rng = np.random.default_rng(seed)
    for _ in range(n_total // chunk_n):
        yield pd.DataFrame({"jumlah": rng.normal(500_000, 100_000, chunk_n)})

total, n = 0.0, 0
for i, chunk in enumerate(gen_chunks()):
    total += chunk["jumlah"].sum()
    n += len(chunk)
    # print(f"chunk {i}: memori kecil, progres {n:,}")

print(f"Total: Rp {total:,.0f}")
print(f"Rata-rata: Rp {total/n:,.0f}")
print(f"Baris diproses: {n:,} (peak RAM: 1 chunk saja!)")

# Coba: hitung juga MAX per chunk lalu max global — benar? (ya, max agregabel!)
# Coba: median — bisa? (TIDAK langsung! butuh pendekatan)
`;
  const quizData = [{"question": "category menghemat karena…", "options": ["Kompresi ajaib", "Simpan kode int + tabel nilai unik (bukan string berulang)", "Hapus data", "Tidak hemat"], "correct": 1, "explanation": "Benar: string 'Jakarta' 1jt× → 1× + kode int."}, {"question": "Uang Rp 123.456.789 sebagai float32…", "options": ["Aman", "Kehilangan presisi! Pakai int/float64", "Lebih akurat", "Error"], "correct": 1, "explanation": "Benar: 7 digit presisi tak cukup."}, {"question": "Chunking TIDAK bisa untuk…", "options": ["Sum", "Median global / ranking / dedup lintas chunk", "Count", "Filter"], "correct": 1, "explanation": "Benar: butuh seluruh data sekaligus."}, {"question": "DuckDB unggul untuk…", "options": ["Training deep learning", "SQL langsung ke file (parquet/CSV) tanpa load RAM", "Plotting", "Web app"], "correct": 1, "explanation": "Benar: analitik out-of-core."}, {"question": "Parquet vs CSV…", "options": ["Sama", "Parquet 10× kecil/cepat + baca kolom parsial", "CSV lebih cepat", "Parquet hanya untuk gambar"], "correct": 1, "explanation": "Benar: standar 2026 untuk data analitik."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D13 — Python</span>
        <h1 className="display-title">Performa: Data Besar<br/>tanpa Drama</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laptop Ngadat di 8GB</a></li>
          <li><a href="#dtype">dtype Hemat — 10× Lebih Kecil</a></li>
          <li><a href="#chunk">Chunking — Makan Gajah Seiris</a></li>
          <li><a href="#alat">Polars &amp; DuckDB — Naik Kelas</a></li>
          <li><a href="#lab1">🔬 Lab 1: Diet Memori</a></li>
          <li><a href="#lab2">🔬 Lab 2: Chunking Manual</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Performa</a></li>
          <li><a href="#case">📋 Mini-Case: 8GB, 2 Jam</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menghemat memori dengan <strong>dtype tepat</strong> (category, int32, dll).</li><li>Memproses file besar dengan <strong>chunking</strong>.</li><li>Mengenal <strong>Polars &amp; DuckDB</strong> untuk data besar.</li><li>Menerapkan <strong>aturan kapan optimasi</strong>.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Laptop Ngadat di 8GB</h2>

      <div className="story"><p>File 8GB, laptop 16GB RAM. <code className="inline">pd.read_csv()</code> → memory error. Analis panik — deadline 2 jam. Solusi: <strong>chunking</strong> (baca 100rb baris sekaligus) + <strong>dtype hemat</strong> — selesai 20 menit tanpa upgrade hardware.</p><p>Data tumbuh; RAM tidak. Lesson ini: teknik bertahan hidup data besar — dan kapan <em>pindah alat</em> (Polars/DuckDB).</p><p><strong>Twist-nya:</strong> file 8GB, RAM 16GB, memory error — solusinya bukan beli RAM (analis tidak punya budget itu), melainkan berpikir seperti database: proses per chunk, bukan load semuanya. Data besar tidak butuh komputer besar — ia butuh pola pikir <em>streaming</em>, bukan <em>loading</em>. Keterbatasan hardware adalah guru desain terbaik.</p></div>

      <h2 id="dtype">dtype Hemat — 10× Lebih Kecil</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">print(df.memory_usage(deep=True).sum() / 1e6, &#x27;MB&#x27;)

# hemat:
df[&#x27;kota&#x27;] = df[&#x27;kota&#x27;].astype(&#x27;category&#x27;)       # object -&gt; category
# df[&#x27;id&#x27;] = df[&#x27;id&#x27;].astype(&#x27;int32&#x27;)            # jika cukup
df[&#x27;flag&#x27;] = df[&#x27;flag&#x27;].astype(&#x27;bool&#x27;)
# df[&#x27;nilai&#x27;] = df[&#x27;nilai&#x27;].astype(&#x27;float32&#x27;)    # jika presisi cukup

print(df.memory_usage(deep=True).sum() / 1e6, &#x27;MB&#x27;)</pre>

      <ul>
<li><strong>category:</strong> string berulang (kota, status) — hemat 10×+.</li>
<li><strong>int32/float32:</strong> jika range/presisi cukup — hemat 2×.</li>
<li><strong>bool:</strong> untuk flag — 8× lebih hemat dari object!</li>
<li><strong>Ukur:</strong> <code className="inline">memory_usage(deep=True)</code> sebelum/sesudah.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Saat baca CSV besar: <code className="inline">pd.read_csv(..., dtype=&#123;'kota': 'category'&#125;, usecols=[...])</code> — hemat dari <em>awal</em> (usecols = baca yang perlu saja!).</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;float32 selalu aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> float32 presisi ~7 digit — untuk uang (Rp 123.456.789) = <strong>kehilangan presisi</strong>! Uang = int (rupiah) atau float64. Hemat memori <em>jangan</em> korbankan kebenaran.</p>
</div>

      <h2 id="chunk">Chunking — Makan Gajah Seiris</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">total = 0
n = 0
for chunk in pd.read_csv(&#x27;besar.csv&#x27;, chunksize=100_000):
    # proses per chunk (agregat parsial!)
    total += (chunk[&#x27;jumlah&#x27;] * chunk[&#x27;kurs&#x27;]).sum()
    n += len(chunk)
print(&#x27;total:&#x27;, total, &#x27;n:&#x27;, n)

# atau: filter saat baca, simpan yang lolos saja
# for chunk in pd.read_csv(&#x27;besar.csv&#x27;, chunksize=100_000):
#     chunk[chunk[&#x27;tahun&#x27;] == 2026].to_csv(&#x27;kecil.csv&#x27;, mode=&#x27;a&#x27;)</pre>

      <ul>
<li><strong>chunksize:</strong> iterator per N baris — memori tetap kecil.</li>
<li><strong>Syarat:</strong> operasi harus <em>agregabel</em> (sum/count/mean via sum+count) — bukan median global!</li>
<li><strong>Pola:</strong> filter-dulu-simpan (kecilkan), atau agregat-parsial-gabung.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Chunking selalu bisa.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak untuk operasi <em>global</em>: median, ranking, dedup lintas chunk, sort penuh. Untuk itu: <strong>sampel</strong> dulu, atau pindah ke alat yang tepat (DuckDB!).</p>
</div>

      <h2 id="alat">Polars &amp; DuckDB — Naik Kelas</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>pandas</th><th>Polars</th><th>DuckDB</th></tr></thead>
<tbody>
<tr><td>Gaya</td><td>Eager</td><td>Eager + Lazy</td><td>SQL di Python!</td></tr>
<tr><td>Kecepatan</td><td>Baik</td><td>Sangat (multithread, Rust)</td><td>Sangat (kolom, C++)</td></tr>
<tr><td>Data besar</td><td>RAM</td><td>RAM (efisien) / streaming</td><td>Disk! (out-of-core)</td></tr>
<tr><td>Kapan</td><td>Default</td><td>Transformasi berat</td><td>Query file langsung</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># DuckDB: SQL langsung ke file (tanpa load ke RAM!)
# import duckdb
# duckdb.sql(&quot;SELECT kota, SUM(jumlah) FROM &#x27;besar.parquet&#x27; GROUP BY 1&quot;).df()
print(&#x27;DuckDB: query parquet/csv langsung dari disk!&#x27;)

# Polars: seperti pandas tapi multithread + lazy
# import polars as pl
# (pl.scan_csv(&#x27;besar.csv&#x27;).filter(pl.col(&#x27;tahun&#x27;)==2026)
#    .group_by(&#x27;kota&#x27;).agg(pl.col(&#x27;jumlah&#x27;).sum()).collect())
print(&#x27;Polars: lazy query, dieksekusi optimal saat .collect()&#x27;)</pre>

      <ul>
<li><strong>DuckDB:</strong> 'SQLite untuk analitik' — SQL ke parquet/CSV tanpa server, dari disk!</li>
<li><strong>Polars:</strong> DataFrame multithread + lazy evaluation (optimasi query otomatis).</li>
<li><strong>Parquet:</strong> format kolom biner — 10× lebih kecil & cepat dari CSV. <strong>Standar 2026!</strong></li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan migrasi: pandas lambat tapi <em>cukup</em> → tetap pandas. Terasa lambat (&gt;menit) → dtype/chunk dulu. Masih lambat → Polars/DuckDB. <strong>Jangan pindah alat sebelum optimasi dasar!</strong></p>
</div>

      <PlotlyChart
  data={chart1}
  title="CSV vs Parquet: 10 Juta Baris (ilustrasi)"
  layout={{"barmode": "group", "yaxis": {"title": "MB / detik"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Perbandingan ukuran file & waktu baca.</p>
<p><strong>Interpretasi:</strong> Parquet 10× lebih kecil & 12× lebih cepat baca — <em>plus</em> bisa baca kolom tertentu saja! <strong>Standar 2026:</strong> simpan data analitik sebagai parquet, bukan CSV.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Data besar = teknik, bukan hardware.</p>

            <details className="worked">
              <summary>📐 Kasus 1: dtype hemat — 8GB → 800MB</summary>
              <p>DataFrame 10 juta baris × 20 kolom int64/float64 = ~1,6GB. Kecilkan 10×.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      print(df.memory_usage(deep=True).sum() / 1e9)  # -&gt; ~1.6 GB
      # int64 -&gt; int32/int16 jika cukup; float64 -&gt; float32
      for c in df.select_dtypes(&#x27;int64&#x27;):
          df[c] = pd.to_numeric(df[c], downcast=&#x27;integer&#x27;)
      for c in df.select_dtypes(&#x27;float64&#x27;):
          df[c] = pd.to_numeric(df[c], downcast=&#x27;float&#x27;)
      # object -&gt; category untuk kardinalitas rendah (kota, status!)
      df[&#x27;kota&#x27;] = df[&#x27;kota&#x27;].astype(&#x27;category&#x27;)
      print(df.memory_usage(deep=True).sum() / 1e9)  # -&gt; ~0.3 GB</pre>
              <p><strong>Bedah:</strong> <code className="inline">downcast</code> otomatis pilih tipe terkecil yang muat. <code className="inline">category</code> untuk kolom berulang (kota: 10 nilai unik × 10jt baris → hemat ~90%!). Aturan: cek <code className="inline">memory_usage</code> dulu, optimasi yang terbesar dulu.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Chunking — 8GB di RAM 16GB</summary>
              <p>File 8GB, RAM 16GB (tidak muat + overhead). Hitung total per kota tanpa load penuh.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      hasil = &#123;&#125;
      for chunk in pd.read_csv(&#x27;besar.csv&#x27;, chunksize=100_000,
                               usecols=[&#x27;kota&#x27;, &#x27;nominal&#x27;],
                               dtype=&#123;&#x27;kota&#x27;: &#x27;category&#x27;&#125;):
          agg = chunk.groupby(&#x27;kota&#x27;, observed=True)[&#x27;nominal&#x27;].sum()
          for kota, v in agg.items():
              hasil[kota] = hasil.get(kota, 0) + v
      print(sorted(hasil.items(), key=lambda x: x[1], reverse=True)[:5])</pre>
              <p><strong>Bedah:</strong> pola &ldquo;agregasi parsial + gabung&rdquo;: tiap chunk 100rb baris (muat!), agregatnya kecil (per kota). <code className="inline">usecols</code> = baca yang perlu saja. Syarat: agregasi harus <em>asosiatif</em> (sum/count/min/max bisa; median tidak langsung bisa!).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: DuckDB — SQL di atas file</summary>
              <p>Query agregasi 8GB CSV tanpa load ke pandas sama sekali.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import duckdb
      q = &quot;&quot;&quot;SELECT kota, COUNT(*) AS n, SUM(nominal) AS total
           FROM read_csv(&#x27;besar.csv&#x27;) GROUP BY kota ORDER BY total DESC&quot;&quot;&quot;
      print(duckdb.sql(q).df().head())
      # DuckDB: streaming + paralel + columnar -&gt; sering 10-100x pandas
      # untuk agregasi file besar. Kapan pindah: &quot;pandas terasa lambat&quot;
      # dan query-mu = agregasi/filter (bukan ML iteratif).</pre>
              <p><strong>Bedah:</strong> DuckDB membaca CSV langsung (tanpa load penuh) + eksekusi paralel. Untuk &ldquo;SQL atas file&rdquo;, ia mengalahkan pandas. Mental model: pandas = &ldquo;data di RAM, fleksibel&rdquo;; DuckDB = &ldquo;data di disk, analitik cepat&rdquo;. Kuasai keduanya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Diet Memori</h2>

      <p>DataFrame 100rb baris. Ukur memori, terapkan category/int32/bool, ukur lagi. Berapa % hemat?</p>

      <PyodideLab
  title="Lab 1 — Ukur &amp; Hemat"
  hint="Jebakan: astype('int32') pada kolom dengan NaN — apa yang terjadi? (Int32 nullable!)"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Chunking Manual</h2>

      <p>Simulasikan file besar: proses 1 juta baris dalam chunk 100rb. Hitung total + rata-rata tanpa load sekaligus!</p>

      <PyodideLab
  title="Lab 2 — Agregat Tanpa Load Penuh"
  hint="Renungkan: operasi apa yang TIDAK bisa di-chunk? (median, rank, dedup global)"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Performa</h2>

      <div className="decision-card">
<h3>1. Lambat → <strong>ukur dulu</strong></h3>
<p><strong>Kondisi data:</strong> Profil.</p>
<p><strong>Kenapa:</strong> Jangan tebak; %%time/memory_usage.</p>
<p><strong>Contoh nyata:</strong> Mana yang lambat?</p>
</div>

      <div className="decision-card">
<h3>2. Memori bengkak → <strong>dtype + usecols</strong></h3>
<p><strong>Kondisi data:</strong> Diet.</p>
<p><strong>Kenapa:</strong> category, int32, baca yang perlu.</p>
<p><strong>Contoh nyata:</strong> 10× hemat.</p>
</div>

      <div className="decision-card">
<h3>3. File &gt; RAM → <strong>chunking</strong></h3>
<p><strong>Kondisi data:</strong> Seiris.</p>
<p><strong>Kenapa:</strong> Agregat parsial; filter-simpan.</p>
<p><strong>Contoh nyata:</strong> chunksize=100rb.</p>
</div>

      <div className="decision-card">
<h3>4. Butuh SQL ke file → <strong>DuckDB</strong></h3>
<p><strong>Kondisi data:</strong> Query disk.</p>
<p><strong>Kenapa:</strong> Tanpa load RAM; parquet.</p>
<p><strong>Contoh nyata:</strong> SELECT dari parquet.</p>
</div>

      <div className="decision-card">
<h3>5. Transformasi berat → <strong>Polars</strong></h3>
<p><strong>Kondisi data:</strong> Multithread.</p>
<p><strong>Kenapa:</strong> Lazy + Rust.</p>
<p><strong>Contoh nyata:</strong> ETL besar.</p>
</div>

      <div className="decision-card">
<h3>6. Simetri → <strong>parquet</strong></h3>
<p><strong>Kondisi data:</strong> Format.</p>
<p><strong>Kenapa:</strong> 10× kecil/cepat; standar.</p>
<p><strong>Contoh nyata:</strong> Simpan antar-tahap.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Ukur dulu, optimasi kemudian.</li><li>dtype + usecols sebelum alat baru.</li><li>Uang = int/float64, bukan float32!</li><li>Simpan parquet, bukan CSV.</li><li>Cukup cepat = berhenti.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: 8GB, 2 Jam</h2>

      <div className="callout">
<p><strong>Situasi:</strong> File transaksi 8GB CSV, laptop 16GB. Butuh: total per kategori per bulan. Deadline 2 jam.</p><p><strong>Tugas:</strong> tulis rencana + kode. (Petunjuk: gabungkan teknik!)</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Rencana:</strong> ① <code className="inline">usecols=['tanggal','kategori','jumlah']</code> + <code className="inline">dtype=&#123;'kategori':'category'&#125;</code> + <code className="inline">parse_dates</code> ② chunk 500rb ③ agregat parsial per chunk (groupby bulan+kategori) ④ gabung + agregat final.</p><p><code className="inline">parsial = []<br/>for c in pd.read_csv('f.csv', chunksize=500_000, usecols=[...]):<br/>&nbsp;&nbsp;c['bulan'] = pd.to_datetime(c['tanggal']).dt.to_period('M')<br/>&nbsp;&nbsp;parsial.append(c.groupby(['bulan','kategori'])['jumlah'].sum())<br/>hasil = pd.concat(parsial).groupby(level=[0,1]).sum()</code></p><p><strong>Alternatif modern:</strong> <code className="inline">duckdb.sql("SELECT strftime(tanggal,'%Y-%m'), kategori, SUM(jumlah) FROM 'f.csv' GROUP BY 1,2")</code> — 3 baris! <strong>Pelajaran:</strong> alat tepat &gt; kerja keras.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Kolom <code className="inline">dpd</code> int64, nilai 0–365. Tipe terkecil yang muat? Berapa hematnya vs int64?</li>
              <li>Mengapa median tidak bisa di-chunk seperti sum? Bagaimana solusinya?</li>
              <li><code className="inline">df.groupby(&#x27;kota&#x27;)</code> lambat di 10jt baris padahal kota cuma 10. Satu baris optimasi?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <code className="inline">uint16</code> (0–65.535) atau int16 — 2 byte vs 8 byte = <strong>hemat 75%</strong>. (<code className="inline">downcast</code> otomatis memilihnya.)</p>
              <p><strong>2.</strong> Median butuh <em>seluruh</em> distribusi (tidak asosiatif: median dari median ≠ median). Solusi: aproksimasi (t-digest/HyperLogLog-like), atau kumpulkan histogram per chunk lalu gabung, atau sampling.</p>
              <p><strong>3.</strong> <code className="inline">df[&#x27;kota&#x27;] = df[&#x27;kota&#x27;].astype(&#x27;category&#x27;)</code> — groupby kategorikal memakai kode integer, jauh lebih cepat + hemat RAM.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>dtype:</strong> category/int32/bool — ukur dengan memory_usage.</li><li><strong>Chunking:</strong> agregat parsial untuk file &gt; RAM.</li><li><strong>DuckDB:</strong> SQL ke file; <strong>Polars:</strong> transformasi cepat.</li><li><strong>Parquet:</strong> format standar analitik.</li><li>Ukur dulu; cukup cepat = berhenti.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d12-sklearn" className="btn btn-secondary btn-sm">← ← D12</Link>
        <Link href="/learn/d14-rekayasa" className="btn btn-primary btn-sm">Next: D14 →</Link>
      </div>
    </div>
  );
}

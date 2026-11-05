import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D15SqlPythonApiPage() {
  const chart1 = [{"x": ["Extract\n(SQL/API)", "Transform\n(Python)", "Validate", "Load\n(SQL)"], "y": [1, 1, 1, 1], "type": "bar", "marker": {"color": ["#2a7de1", "#e8a838", "#ef4444", "#34a853"]}, "text": ["Ambil", "Olah", "Cek", "Simpan"], "textposition": "inside"}];
  const lab1Code = String.raw`
import sqlite3
import pandas as pd

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE trx (id INTEGER, kota TEXT, jumlah REAL)")
cur.executemany("INSERT INTO trx VALUES (?, ?, ?)", [
    (1, "Jakarta", 500000), (2, "Jakarta", 300000),
    (3, "Bandung", 700000), (4, "Surabaya", 200000),
])
con.commit()

# 1. SQL untuk agregat (dekat data!)
ringkas = pd.read_sql("SELECT kota, SUM(jumlah) AS total, COUNT(*) AS n FROM trx GROUP BY kota", con)
print("Dari SQL:"); print(ringkas)

# 2. Python untuk analisis lanjut
ringkas["pangsa"] = ringkas["total"] / ringkas["total"].sum()
ringkas["rata"] = ringkas["total"] / ringkas["n"]
print("\nAnalisis Python:"); print(ringkas)

# 3. Simpan kembali
ringkas.to_sql("laporan", con, index=False, if_exists="replace")
print("\nTersimpan:", pd.read_sql("SELECT COUNT(*) AS baris FROM laporan", con).iloc[0, 0], "baris")

# Coba: apa beda read_sql vs to_sql? (arah berlawanan!)
`;
  const lab2Code = String.raw`
import pandas as pd

# Simulasi respons API kurs (seperti requests.get(...).json())
respons_api = {
    "base": "USD",
    "rates": {"IDR": 15800, "EUR": 0.92, "JPY": 149.5},
    "date": "2026-10-13",
}

# API -> DataFrame
kurs = pd.DataFrame(respons_api["rates"].items(), columns=["curr", "rate_usd"])
print(kurs)

# Gabung dengan data lokal
trx = pd.DataFrame({"id": [1, 2], "curr": ["IDR", "EUR"], "jumlah": [1_580_000, 92]})
gabung = trx.merge(kurs, on="curr")
gabung["usd"] = gabung["jumlah"] / gabung["rate_usd"]
print("\nDalam USD:"); print(gabung[["id", "curr", "jumlah", "usd"]])

# Pola asli (butuh internet — coba di Colab!):
kode_asli = "\n".join([
    "import requests",
    'r = requests.get("https://api.exchangerate.host/latest", params={"base": "USD"}, timeout=10)',
    "r.raise_for_status()",
    'kurs = pd.DataFrame(r.json()["rates"].items(), columns=["curr", "rate"])',
])
print("\n=== KODE ASLI (Colab) ==="); print(kode_asli)

# Coba: tambahkan error handling (try/except + timeout). Kenapa penting?
`;
  const quizData = [{"question": "Aturan emas SQL × Python…", "options": ["Python untuk semua", "Agregat di SQL (dekat data), analisis di Python", "SQL untuk semua", "Acak"], "correct": 1, "explanation": "Benar: tiap alat ke keunggulannya."}, {"question": "pd.read_sql vs df.to_sql…", "options": ["Sama", "read_sql: DB→Python; to_sql: Python→DB", "Keduanya hapus data", "Tidak ada bedanya"], "correct": 1, "explanation": "Benar: dua arah jembatan."}, {"question": "requests.get yang aman…", "options": ["Tanpa timeout", "timeout + raise_for_status()", "Tanpa cek", "POST selalu"], "correct": 1, "explanation": "Benar: gagal = error jelas, bukan diam."}, {"question": "Scraping vs API…", "options": ["Sama", "API dulu (resmi, stabil); scraping terakhir + cek legalitas", "Scraping selalu", "API lambat"], "correct": 1, "explanation": "Benar: pintu resmi dulu."}, {"question": "Pipeline 4 tahap…", "options": ["Ambil, buang, ulangi", "Extract → transform → validate → load", "Kode, run, harap", "Tidak ada pola"], "correct": 1, "explanation": "Benar: pola universal data."}, {"question": "Idempoten artinya…", "options": ["Cepat", "Bisa di-run ulang dengan aman (hasil sama)", "Mahal", "Otomatis"], "correct": 1, "explanation": "Benar: syarat pipeline terjadwal."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D15 — Python</span>
        <h1 className="display-title">SQL × Python × API:<br/>Orkestrasi Seorang Analis</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Hari Pertama Kerja</a></li>
          <li><a href="#sqlpy">Python ↔ SQL — Dua Arah</a></li>
          <li><a href="#api">REST API — Data dari Langit</a></li>
          <li><a href="#pipeline">Pipeline Mini — Merangkai Semua</a></li>
          <li><a href="#lab1">🔬 Lab 1: SQL × Python</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi API</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Integrasi</a></li>
          <li><a href="#case">📋 Mini-Case: Tugas Hari Pertama (60+ mnt, CAPSTONE MINI)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menghubungkan <strong>Python ↔ database</strong> (sqlite3, pola umum).</li><li>Menerapkan pola <strong>SQL untuk ambil, Python untuk olah</strong>.</li><li>Mengambil data dari <strong>REST API</strong> (requests).</li><li>Merancang <strong>pipeline mini</strong> end-to-end (capstone mini!).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Hari Pertama Kerja</h2>

      <div className="story"><p>Hari pertama sebagai data analyst. Tugas: <em>&ldquo;Ambil data transaksi bulan ini dari database, gabungkan dengan kurs dari API, hitung NPL per kota, kirim ringkasannya.&rdquo;</em></p><p>Ini <strong>pekerjaan nyata</strong> — dan membutuhkan <em>semua</em> yang kamu pelajari: SQL (C) + Python (D) + API. Lesson penutup track D ini (60+ menit, capstone mini) merangkai semuanya menjadi <strong>pipeline end-to-end</strong>. Setelah ini: kamu siap kerja.</p><p><strong>Twist-nya:</strong> tugas hari pertama (&ldquo;ambil, gabung, hitung, kirim&rdquo;) memakai <em>semua</em> track C+D sekaligus — tidak ada yang bertanya &ldquo;tulis query window function&rdquo; secara terisolasi di dunia kerja. Capstone ini bukan &ldquo;ujian akhir&rdquo;; ia simulasi Senin pagi pertamamu sebagai data analyst. Semua lesson sebelumnya adalah latihan; ini pertandingannya.</p></div>

      <h2 id="sqlpy">Python ↔ SQL — Dua Arah</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import sqlite3
import pandas as pd

# Python -&gt; SQL: query dari Python
con = sqlite3.connect(&#x27;:memory:&#x27;)
df.to_sql(&#x27;transaksi&#x27;, con, index=False)

# SQL -&gt; Python: hasil query jadi DataFrame!
hasil = pd.read_sql(&#x27;&#x27;&#x27;
  SELECT kota, SUM(jumlah) AS total
  FROM transaksi GROUP BY kota
&#x27;&#x27;&#x27;, con)
print(hasil)</pre>

      <ul>
<li><strong>pd.read_sql:</strong> query → DataFrame (jembatan utama!).</li>
<li><strong>df.to_sql:</strong> DataFrame → tabel (simpan hasil!).</li>
<li><strong>Pola:</strong> agregat berat di SQL (dekat data!), olah lanjut di Python.</li>
<li><strong>Produksi:</strong> SQLAlchemy untuk Postgres/MySQL/BigQuery (pola sama!).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan emas integrasi: <strong>filter & agregat di SQL</strong> (database dioptimasi!), <strong>analisis & model di Python</strong>. Jangan tarik 10 juta baris untuk di-sum di pandas!</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Harus pilih: SQL atau Python.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Profesional memakai <em>keduanya</em> — tiap tugas ke alat terbaiknya. 'SQL vs Python' = pertanyaan pemula; 'SQL + Python' = jawaban senior.</p>
</div>

      <h2 id="api">REST API — Data dari Langit</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import requests

# GET: ambil data
r = requests.get(&#x27;https://api.exchangerate.host/latest&#x27;,
                   params=&#123;&#x27;base&#x27;: &#x27;USD&#x27;&#125;, timeout=10)
r.raise_for_status()  # error jika gagal!
data = r.json()
print(&#x27;EUR/USD:&#x27;, data[&#x27;rates&#x27;][&#x27;EUR&#x27;])

# pola: API -&gt; DataFrame
# kurs = pd.DataFrame(data[&#x27;rates&#x27;].items(), columns=[&#x27;curr&#x27;, &#x27;rate&#x27;])</pre>

      <ul>
<li><strong>requests.get/post:</strong> ambil/kirim; <strong>params:</strong> query string.</li>
<li><strong>raise_for_status():</strong> gagal = error jelas (jangan diam!).</li>
<li><strong>.json():</strong> respons → dict (lalu ke DataFrame!).</li>
<li><strong>Etika:</strong> hormati rate limit! (sleep antar request; baca ToS).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola API→analisis: <code className="inline">requests.get → .json() → pd.DataFrame → analisis</code>. 4 langkah dari 'data di langit' ke 'insight di meja'.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Scraping = API.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> API = pintu resmi (stabil, legal). Scraping = memanjat jendela (rapuh, mungkin melanggar ToS). <strong>Selalu cari API dulu</strong>; scraping = terakhir + cek legalitas.</p>
</div>

      <h2 id="pipeline">Pipeline Mini — Merangkai Semua</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># ALUR: SQL -&gt; Python -&gt; API -&gt; lapor
# 1. Ambil ringkas dari DB (agregat di SQL!)
ringkas = pd.read_sql(&#x27;SELECT kota, SUM(jumlah) total FROM trx GROUP BY 1&#x27;, con)
# 2. Perkaya dari API
kurs = requests.get(API_KURS, timeout=10).json()[&#x27;rates&#x27;][&#x27;IDR&#x27;]
ringkas[&#x27;total_usd&#x27;] = ringkas[&#x27;total&#x27;] / kurs
# 3. Analisis di Python
ringkas[&#x27;pangsa&#x27;] = ringkas[&#x27;total&#x27;] / ringkas[&#x27;total&#x27;].sum()
# 4. Validasi + simpan
assert (ringkas[&#x27;total&#x27;] &gt;= 0).all()
ringkas.to_sql(&#x27;laporan_harian&#x27;, con, if_exists=&#x27;replace&#x27;)
print(ringkas)</pre>

      <ul>
<li><strong>4 tahap:</strong> extract (SQL/API) → transform (Python) → validate → load (SQL).</li>
<li><strong>Idempoten:</strong> bisa di-run ulang aman (if_exists='replace' / kunci unik).</li>
<li><strong>Log:</strong> catat waktu, baris, error — untuk debugging.</li>
<li><strong>Jadwal:</strong> cron (Linux) / Task Scheduler — 'tiap pagi jam 6'.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pipeline mini ini = <strong>miniatur data engineer</strong>. Skala besar: Airflow/dbt (C16). Prinsipnya sama: extract → transform → validate → load.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Pipeline 4 Tahap (konseptual)"
  layout={{"xaxis": {"title": "Tahap"}, "yaxis": {"visible": false}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Alur kiri ke kanan.</p>
<p><strong>Interpretasi:</strong> Setiap pipeline data = 4 tahap ini. <strong>Hafalkan:</strong> extract → transform → validate → load. Dari script pagi ini hingga platform big tech — polanya sama.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. SQL + Python + API = pekerjaan nyata.</p>

            <details className="worked">
              <summary>📐 Kasus 1: SQL → pandas — dua arah</summary>
              <p>Ambil agregat dari database, lanjutkan di pandas. Kapan agregasi di SQL vs di pandas?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd, sqlite3
      con = sqlite3.connect(&#x27;bank.db&#x27;)
      # Agregasi BERAT di SQL (database yang kerja, data kecil yang pindah):
      df = pd.read_sql(&quot;&quot;&quot;SELECT kota, COUNT(*) AS n, AVG(penghasilan) AS avg_gaji
                        FROM nasabah GROUP BY kota&quot;&quot;&quot;, con)
      # Analisis RINGAN di pandas (fleksibel):
      print(df[df.avg_gaji &gt; df.avg_gaji.mean()])
      # Aturan: filter/agregasi -&gt; SQL; eksplorasi/model -&gt; pandas.</pre>
              <p><strong>Bedah:</strong> <code className="inline">read_sql</code> = jembatan. Prinsip pembagian kerja: database = &ldquo;mesin agregasi&rdquo; (dekat data, paralel); pandas = &ldquo;meja kerja&rdquo; (fleksibel). Menarik 2 juta baris mentah ke pandas lalu groupby = boros bandwidth + RAM.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: API kurs — dengan retry &amp; cache</summary>
              <p>Ambil kurs USD/IDR dari API. API kadang timeout — buat tahan banting.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import requests, time
      def ambil_kurs(coba=3):
          for i in range(coba):
              try:
                  r = requests.get(&#x27;https://api.kurs/contoh&#x27;, timeout=10)
                  r.raise_for_status()
                  return r.json()[&#x27;usd_idr&#x27;]
              except requests.RequestException as e:
                  print(f&#x27;coba &#123;i+1&#125; gagal: &#123;e&#125;&#125;, tunggu...&#x27;)
                  time.sleep(2 ** i)  # backoff eksponensial
          raise RuntimeError(&#x27;API mati setelah 3x&#x27;)
      # + cache: simpan ke file/DB agar tidak hit API tiap run</pre>
              <p><strong>Bedah:</strong> tiga kebiasaan API produksi: <strong>timeout</strong> (jangan gantung selamanya!), <strong>retry + backoff</strong> (2^i detik), <strong>cache</strong> (kurs hari ini tidak berubah tiap menit). Tanpa ini, pipeline-mu serapuh API orang lain.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Pipeline mini — dari 3 sumber ke 1 laporan</summary>
              <p>Rangkai: SQL (transaksi) + API (kurs) → NPL per kota dalam USD → cetak ringkasan.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">def laporan_harian():
          df = pd.read_sql(&quot;SELECT kota, SUM(nominal) AS total FROM transaksi &quot;
                           &quot;WHERE tanggal = CURRENT_DATE GROUP BY kota&quot;, con)
          kurs = ambil_kurs()  # dari kasus 2 (dengan cache!)
          df[&#x27;total_usd&#x27;] = df[&#x27;total&#x27;] / kurs
          # validasi (D14!) sebelum kirim:
          assert not df.empty and (df[&#x27;total&#x27;] &gt;= 0).all()
          ringkas = df.sort_values(&#x27;total&#x27;, ascending=False).head(10)
          return ringkas.to_string()
      # Dijadwalkan cron 07:00 -&gt; &quot;laporan otomatis tiap pagi&quot; (cerita pembuka!).</pre>
              <p><strong>Bedah:</strong> pipeline = fungsi yang dirangkai: ambil → gabung → validasi → ringkas. Tiap langkah = pelajaran track C/D yang sudah kamu kuasai. Capstone ini bukan &ldquo;materi baru&rdquo; — ia <em>komposisi</em> dari semuanya. Itulah skill analis senior: merangkai, bukan menghafal.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: SQL × Python</h2>

      <p>Buat DB sqlite di Python, isi data, query agregat via SQL → DataFrame → analisis di Python → simpan kembali!</p>

      <PyodideLab
  title="Lab 1 — read_sql &amp; to_sql"
  hint="Eksperimen: pindahkan agregat ke Python (tarik semua lalu groupby) — kapan ini buruk? (data besar!)"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Simulasi API</h2>

      <p>Simulasikan respons API (dict JSON) → parsing → DataFrame → gabung dengan data lokal. (Tanpa internet pun jalan!)</p>

      <PyodideLab
  title="Lab 2 — Pola API → DataFrame"
  hint="Tantangan: cache respons API ke file (jangan panggil tiap run — hemat rate limit!)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Integrasi</h2>

      <div className="decision-card">
<h3>1. Ambil dari DB → <strong>pd.read_sql</strong></h3>
<p><strong>Kondisi data:</strong> Jembatan.</p>
<p><strong>Kenapa:</strong> Query → DataFrame.</p>
<p><strong>Contoh nyata:</strong> Agregat per kota.</p>
</div>

      <div className="decision-card">
<h3>2. Agregat berat → <strong>di SQL</strong></h3>
<p><strong>Kondisi data:</strong> Dekat data.</p>
<p><strong>Kenapa:</strong> Jangan tarik mentah.</p>
<p><strong>Contoh nyata:</strong> SUM di DB, bukan pandas.</p>
</div>

      <div className="decision-card">
<h3>3. Simpan hasil → <strong>to_sql</strong></h3>
<p><strong>Kondisi data:</strong> Kembali.</p>
<p><strong>Kenapa:</strong> DataFrame → tabel.</p>
<p><strong>Contoh nyata:</strong> laporan_harian.</p>
</div>

      <div className="decision-card">
<h3>4. Data luar → <strong>requests API</strong></h3>
<p><strong>Kondisi data:</strong> Langit.</p>
<p><strong>Kenapa:</strong> Cari API dulu; hormati limit.</p>
<p><strong>Contoh nyata:</strong> Kurs, cuaca.</p>
</div>

      <div className="decision-card">
<h3>5. Rutin → <strong>pipeline + jadwal</strong></h3>
<p><strong>Kondisi data:</strong> Otomatis.</p>
<p><strong>Kenapa:</strong> ETL mini + cron.</p>
<p><strong>Contoh nyata:</strong> Laporan pagi.</p>
</div>

      <div className="decision-card">
<h3>6. Selalu → <strong>validate + log</strong></h3>
<p><strong>Kondisi data:</strong> Aman.</p>
<p><strong>Kenapa:</strong> D14 di setiap pipeline.</p>
<p><strong>Contoh nyata:</strong> Assert + catat.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>SQL ambil (agregat!), Python olah.</li><li>API: raise_for_status + timeout + hormati limit.</li><li>Pipeline: extract → transform → validate → load.</li><li>Idempoten + log + jadwal.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Tugas Hari Pertama (60+ mnt, CAPSTONE MINI)</h2>

      <div className="callout">
<p><strong>Tugas:</strong> 'Ambil transaksi bulan ini dari DB, gabungkan kurs USD dari API, hitung total USD + NPL per kota, simpan laporan.'</p><p><strong>Kerjakan:</strong> tulis script lengkap (boleh pseudo untuk API) dengan: (1) read_sql agregat, (2) API kurs, (3) hitung USD + pangsa, (4) validasi, (5) to_sql, (6) <strong>log + komentar</strong>. Lalu tulis <strong>README 5 baris</strong> cara menjalankan.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">import sqlite3, pandas as pd, requests, logging<br/>logging.basicConfig(level=logging.INFO)<br/>con = sqlite3.connect('bank.db')<br/>df = pd.read_sql("SELECT kota, SUM(jumlah) t, SUM(CASE WHEN kol&gt;=3 THEN jumlah ELSE 0 END) npl FROM trx GROUP BY 1", con)<br/>kurs = requests.get(API, timeout=10).json()['rates']['IDR']<br/>df['usd'] = df['t'] / kurs; df['npl_ratio'] = df['npl']/df['t']<br/>assert (df['t'] &gt;= 0).all(), 'total negatif!'<br/>df.to_sql('laporan', con, if_exists='replace', index=False)<br/>logging.info(f'selesai: &#123;len(df)&#125; kota')</code></p><p><strong>README:</strong> '1. pip install -r requirements.txt 2. python laporan.py 3. output: tabel laporan di bank.db 4. jadwal: cron 0 6 * * * 5. log: laporan.log'</p><p><strong>Pelajaran:</strong> ini <strong>pekerjaan analis sesungguhnya</strong> — bukan teori. Kamu baru saja merangkai C + D menjadi <em>sistem</em>. 🎓 <strong>Track D selesai — 16 lesson!</strong></p>
</details>
</div>

      <div className="callout">
<h3>🎓 Track 10 Foundation SELESAI!</h3><p><strong>B (Probabilitas):</strong> 19 lesson &bull; <strong>C (SQL):</strong> 19 lesson &bull; <strong>D (Python):</strong> 16 lesson. Total <strong>54 lesson</strong>. Kamu kini punya fondasi: peluang → data → analisis → model. Lanjut: track risiko (CR), pasar (E), dan capstone portofolio. Terus berlatih — fondasi yang kokoh = karir yang kokoh. 💪</p>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li><code className="inline">pd.read_sql(&quot;SELECT * FROM transaksi&quot;, con)</code> di tabel 50 juta baris. Apa masalahnya? Tulis alternatifnya.</li>
              <li>API mengembalikan paginasi (<code className="inline">page=1..N</code>). Tulis loop yang berhenti saat halaman kosong.</li>
              <li>Mengapa menyimpan <em>raw response</em> API (JSON mentah) sebelum parsing adalah kebiasaan bagus?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1. Masalah: 50jt baris -&gt; RAM meledak + lambat.
      # Alternatif: agregasi di SQL, atau chunksize:
      pd.read_sql(&quot;SELECT kota, SUM(nominal) AS total FROM transaksi &quot;
                  &quot;GROUP BY kota&quot;, con)  # kecil!
      # atau: pd.read_sql(q, con, chunksize=100_000) -&gt; iterasi chunk.
      # 2.
      hal, semua = 1, []
      while True:
          r = requests.get(f&#x27;https://api/data?page=&#123;hal&#125;&#x27;, timeout=10).json()
          if not r[&#x27;data&#x27;]: break
          semua.extend(r[&#x27;data&#x27;]); hal += 1</pre>
              <p><strong>3.</strong> (a) Debug: saat parsing gagal, kamu bisa lihat mentahnya. (b) Re-parse: jika kebutuhan berubah, tidak perlu hit API lagi (rate limit!). (c) Audit: bukti &ldquo;data asli&rdquo; jika ada sengketa. Raw = asuransi murah.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>read_sql / to_sql:</strong> jembatan dua arah Python ↔ DB.</li><li><strong>Aturan:</strong> agregat di SQL, analisis di Python.</li><li><strong>API:</strong> requests + timeout + raise_for_status; hormati limit.</li><li><strong>Pipeline:</strong> extract → transform → validate → load; idempoten + log.</li><li><strong>🎓 Track 10 selesai: 54 lesson!</strong> Fondasi kokoh = karir kokoh.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d14-rekayasa" className="btn btn-secondary btn-sm">← ← D14</Link>
        <span></span>
      </div>
    </div>
  );
}

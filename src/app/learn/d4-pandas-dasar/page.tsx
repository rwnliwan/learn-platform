import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D4PandasDasarPage() {
  const chart1 = [{"x": ["Excel", "pandas"], "y": [300, 2], "type": "bar", "marker": {"color": ["#ef4444", "#34a853"]}, "text": ["5 mnt + crash", "2 dtk"], "textposition": "outside"}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, io

csv = """id,nama,kota,penghasilan,dpd
1,Andi,Jakarta,8500000,0
2,Budi,Bandung,12000000,15
3,Citra,Jakarta,6700000,45
4,Dewi,Surabaya,15000000,0
5,Eko,Jakarta,,90
6,Fitri,Bandung,9200000,5"""
df = pd.read_csv(io.StringIO(csv))

print("=== HEAD ==="); print(df.head(3))
print("\n=== INFO ==="); df.info()
print("\n=== DESCRIBE ==="); print(df.describe())
print("\n=== dtypes ==="); print(df.dtypes)

print("\n=== iloc[0:2] (posisi, eksklusif) ==="); print(df.iloc[0:2])
print("\n=== loc: dpd > 30 ==="); print(df.loc[df["dpd"] > 30, ["nama", "dpd"]])

# Coba: kenapa penghasilan Eko jadi NaN? (D5!)
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, numpy as np, io

csv = """nama,kota,penghasilan,dpd
Andi,Jakarta,8500000,0
Budi,Bandung,12000000,15
Citra,Jakarta,6700000,45
Dewi,Surabaya,15000000,0
Eko,Jakarta,,90"""
df = pd.read_csv(io.StringIO(csv))

# kolom baru vectorized
df["gaji_jt"] = df["penghasilan"] / 1_000_000
df["bermasalah"] = df["dpd"] > 30
df["bucket"] = pd.cut(df["dpd"], bins=[-1, 0, 30, 90, 9999],
                       labels=["lancar", "ringan", "sedang", "berat"])
print(df[["nama", "dpd", "bucket", "gaji_jt", "bermasalah"]])

# agregat cepat
print("\nRata-rata gaji per bucket:")
print(df.groupby("bucket", observed=True)["gaji_jt"].mean())

# Coba: pd.cut vs fungsi manual — kapan pakai mana?
`;
  const quizData = [{"question": "df.loc[0:1] vs df.iloc[0:1]…", "options": ["Sama (1 baris)", "loc=2 baris (inklusif), iloc=1 baris (eksklusif)", "loc=1, iloc=2", "Keduanya error"], "correct": 1, "explanation": "Benar: perangkap off-by-one klasik!"}, {"question": "Kolom angka terbaca 'object'. Artinya…", "options": ["Normal", "Ada nilai non-angka — konversi dengan pd.to_numeric(errors='coerce')", "Hapus kolom", "Tidak bisa dihitung selamanya"], "correct": 1, "explanation": "Benar: cek dtypes selalu setelah baca data."}, {"question": "Filter 'Jakarta dan dpd=0'…", "options": ["df[df.kota=='Jakarta' and df.dpd==0]", "df[(df.kota=='Jakarta') & (df.dpd==0)]", "df.query tanpa tanda", "Tidak bisa"], "correct": 1, "explanation": "Benar: & dengan kurung (and Python tak bisa untuk Series)."}, {"question": "Tiga perintah pertama untuk DataFrame baru…", "options": ["plot, merge, pivot", "head, info, describe", "drop, fillna, astype", "save, load, exit"], "correct": 1, "explanation": "Benar: refleks 30 detik."}, {"question": "id '001' terbaca int → …", "options": ["Baik", "Nol hilang! Paksa dtype={'id': str} saat baca", "Tidak masalah", "Error"], "correct": 1, "explanation": "Benar: ID/kode = string, bukan angka."}, {"question": "Kolom baru sebaiknya…", "options": ["Loop per baris", "Vectorized assign", "Apply selalu", "Manual di Excel"], "correct": 1, "explanation": "Benar: df['x'] = ... — jangan loop."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D4 — Python</span>
        <h1 className="display-title">pandas: DataFrame &amp;<br/>Berpikir Tabel</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Excel 1 Juta Baris yang Crash</a></li>
          <li><a href="#df">DataFrame &amp; Series — Anatomi</a></li>
          <li><a href="#lociloc">loc vs iloc — Label vs Posisi</a></li>
          <li><a href="#filter">Boolean Mask — WHERE-nya pandas</a></li>
          <li><a href="#csv">read_csv — Pintu Masuk Data</a></li>
          <li><a href="#lab1">🔬 Lab 1: Eksplorasi DataFrame</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kolom Baru Vectorized</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: pandas Dasar</a></li>
          <li><a href="#case">📋 Mini-Case: Filter Excel yang Crash</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>Series vs DataFrame</strong> (kolom vs tabel).</li><li>Memakai <strong>loc/iloc</strong> dengan benar (label vs posisi).</li><li>Memfilter dengan <strong>boolean mask</strong>.</li><li>Membaca data dari <strong>CSV</strong>.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Excel 1 Juta Baris yang Crash</h2>

      <div className="story"><p>File Excel 1 juta baris: dibuka 5 menit, filter 1 menit, crash saat sort. Analis menyerah — padahal tugasnya sederhana: <em>&ldquo;rata-rata gaji per kota untuk yang dpd=0&rdquo;</em>.</p><p><strong>pandas</strong> = 'Excel terprogram': DataFrame (tabel) + operasi vectorized. Tugas di atas = <strong>3 baris kode, 2 detik</strong>. Ini library #1 data analyst Python — kuasai D4–D7 dan kamu produktif.</p><p><strong>Twist-nya:</strong> 3 baris kode menggantikan Excel yang crash — tapi kekuatan pandas juga bahayanya: satu baris <code>df.dropna()</code> bisa menghapus 90% data <em>diam-diam</em>. Excel menunjukkan apa yang ia hapus; pandas tidak. Kekuatan tanpa visibilitas = footgun. Lesson ini mengajarkan kekuatan <em>dan</em> kewaspadaannya sekaligus.</p></div>

      <h2 id="df">DataFrame &amp; Series — Anatomi</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd

df = pd.DataFrame(&#123;
    &#x27;nama&#x27;: [&#x27;Andi&#x27;, &#x27;Budi&#x27;, &#x27;Citra&#x27;],
    &#x27;kota&#x27;: [&#x27;Jakarta&#x27;, &#x27;Bandung&#x27;, &#x27;Jakarta&#x27;],
    &#x27;dpd&#x27;: [0, 15, 45],
&#125;)
print(df)
print(df.dtypes)   # tipe tiap kolom!
print(df.shape)    # (baris, kolom)</pre>

      <ul>
<li><strong>DataFrame</strong> = tabel (2D); <strong>Series</strong> = 1 kolom (1D).</li>
<li><code className="inline">df['dpd']</code> = Series; <code className="inline">df[['nama','dpd']]</code> = DataFrame.</li>
<li><strong>Index:</strong> label baris (default 0,1,2...) — bisa jadi id/tanggal.</li>
<li><strong>dtypes:</strong> int64, float64, object (string!), bool, datetime64 — <strong>cek selalu!</strong></li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tiga perintah eksplorasi pertama untuk DataFrame baru: <code className="inline">df.head()</code>, <code className="inline">df.info()</code>, <code className="inline">df.describe()</code>. 30 detik = peta data. Jadikan refleks!</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kolom string = tipe 'string'.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Di pandas, string = <strong>object</strong> (campuran)! Angka tersimpan sebagai object = <em>tidak bisa dihitung</em> (error/diam salah). Cek dtypes — jika angka terbaca object, konversi: <code className="inline">pd.to_numeric(df['x'], errors='coerce')</code>.</p>
</div>

      <h2 id="lociloc">loc vs iloc — Label vs Posisi</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># loc: berdasar LABEL
print(df.loc[0])              # baris label 0
print(df.loc[0:1, &#x27;nama&#x27;:&#x27;dpd&#x27;])  # label 0 s.d. 1 (INKLUSIF!)

# iloc: berdasar POSISI
print(df.iloc[0])             # baris posisi 0
print(df.iloc[0:2, 0:2])     # posisi 0-1 (EKSKLUSIF akhir!)</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>loc</th><th>iloc</th></tr></thead>
<tbody>
<tr><td>Berdasar</td><td>Label</td><td>Posisi (0-based)</td></tr>
<tr><td>Slice</td><td>Inklusif ujung!</td><td>Eksklusif ujung</td></tr>
<tr><td>Kapan</td><td>Index bermakna (id/tanggal)</td><td>Posisi murni</td></tr>
</tbody>
</table>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;loc dan iloc sama saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda kritis: <code className="inline">df.loc[0:1]</code> = 2 baris (inklusif!); <code className="inline">df.iloc[0:1]</code> = 1 baris! Bug off-by-one klasik. Dan jika index bukan 0..n (misal id), loc pakai id — iloc tetap posisi.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan: butuh baris ke-n? iloc. Butuh id/tanggal tertentu? loc. Ragu? iloc untuk posisi selalu aman.</p>
</div>

      <h2 id="filter">Boolean Mask — WHERE-nya pandas</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># filter: mask boolean
mask = (df[&#x27;kota&#x27;] == &#x27;Jakarta&#x27;) &amp; (df[&#x27;dpd&#x27;] == 0)
print(df[mask])

# query(): lebih terbaca untuk kompleks
print(df.query(&quot;kota == &#x27;Jakarta&#x27; and dpd == 0&quot;))

# kolom baru (vectorized!)
df[&#x27;bermasalah&#x27;] = df[&#x27;dpd&#x27;] &gt; 30
df[&#x27;gaji_jt&#x27;] = df[&#x27;gaji&#x27;] / 1_000_000</pre>

      <ul>
<li><strong>Mask:</strong> <code className="inline">df[kondisi]</code> — seperti boolean indexing NumPy (D3!).</li>
<li><strong>Operator:</strong> <code className="inline">&amp; | ~</code> dengan kurung (bukan and/or!).</li>
<li><strong>Kolom baru:</strong> assign vectorized — <em>jangan loop</em>!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola analis harian: <code className="inline">df[(df.a &gt; x) & (df.b == y)]</code>. Jika kondisi 3+, pertimbangkan <code className="inline">.query()</code> agar terbaca.</p>
</div>

      <h2 id="csv">read_csv — Pintu Masuk Data</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">df = pd.read_csv(&#x27;nasabah.csv&#x27;)
# opsi penting:
df = pd.read_csv(&#x27;nasabah.csv&#x27;,
    parse_dates=[&#x27;tanggal&#x27;],      # kolom jadi datetime!
    dtype=&#123;&#x27;id&#x27;: str&#125;,            # paksa tipe (id jangan int!)
    na_values=[&#x27;&#x27;, &#x27;NA&#x27;, &#x27;-&#x27;])    # anggap ini sebagai NaN</pre>

      <ul>
<li><strong>parse_dates:</strong> tanggal langsung jadi datetime64 (D7!).</li>
<li><strong>dtype:</strong> cegah tebakan salah (id '001' → int = '1' hilang nol!).</li>
<li><strong>na_values:</strong> samakan definisi 'kosong' (C2!).</li>
<li><strong>Ingat SQL:</strong> filter di database dulu (D15!) — jangan read_csv 10GB lalu filter!</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;read_csv selalu benar menebak tipe.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tebakan berdasarkan 100 baris pertama! Kolom campur ('123', 'ABC') → object; tanggal format aneh → object. <strong>Selalu cek dtypes setelah baca</strong> — 5 detik mencegah 5 jam.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Filter 1 Juta Baris: Excel vs pandas (ilustrasi)"
  layout={{"yaxis": {"title": "Detik", "type": "log"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Skala log.</p>
<p><strong>Interpretasi:</strong> Bukan cuma cepat — tapi <strong>reproduksibel</strong> (kode!), <strong>skalabel</strong>, dan <strong>terdokumentasi</strong>. Excel = kerja manual; pandas = kerja terprogram.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. DataFrame = &ldquo;Excel terprogram&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: loc vs iloc — label vs posisi</summary>
              <p>DataFrame dengan index custom. Ambil baris &ldquo;Budi&rdquo; vs baris ke-1.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      df = pd.DataFrame(
        &#123;&#x27;gaji&#x27;: [10_000_000, 8_000_000, 12_000_000]&#125;,
        index=[&#x27;Andi&#x27;, &#x27;Budi&#x27;, &#x27;Citra&#x27;])
      print(df.loc[&#x27;Budi&#x27;, &#x27;gaji&#x27;])   # -&gt; 8000000  (label!)
      print(df.iloc[1, 0])             # -&gt; 8000000  (posisi!)
      # df.loc[1] -&gt; KeyError! (tidak ada label 1)</pre>
              <p><strong>Bedah:</strong> <code className="inline">loc</code> = berdasarkan <em>label</em> index; <code className="inline">iloc</code> = berdasarkan <em>posisi</em> (0-based). Jebakan klasik: setelah filter/sort, posisi berubah tapi label ikut barisnya! Aturan: butuh label → loc; butuh &ldquo;baris ke-n&rdquo; → iloc. Jangan campur.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Boolean mask — WHERE-nya pandas</summary>
              <p>Rata-rata gaji per kota untuk yang dpd = 0 — tugas cerita pembuka!</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      df = pd.DataFrame(&#123;
        &#x27;kota&#x27;: [&#x27;JKT&#x27;, &#x27;SBY&#x27;, &#x27;JKT&#x27;, &#x27;BDG&#x27;],
        &#x27;gaji&#x27;: [10_000_000, 8_000_000, 12_000_000, 9_000_000],
        &#x27;dpd&#x27;:  [0, 45, 0, 0]&#125;)
      mask = (df[&#x27;dpd&#x27;] == 0)
      print(df[mask].groupby(&#x27;kota&#x27;)[&#x27;gaji&#x27;].mean())
      # JKT 11000000.0, BDG 9000000.0  (SBY tersaring: dpd 45!)</pre>
              <p><strong>Bedah:</strong> <code className="inline">df[mask]</code> = WHERE; <code className="inline">.groupby().mean()</code> = GROUP BY + AVG. 3 baris = tugas yang bikin Excel crash. Kurung di <code className="inline">(df[&#x27;dpd&#x27;]==0)</code> wajib saat digabung <code className="inline">&amp;</code>/<code className="inline">|</code> (prioritas operator!).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: read_csv — jebakan separator &amp; dtype</summary>
              <p>File <code className="inline">nasabah.csv</code> memakai <code className="inline">;</code> dan kolom id ber-nol depan (&#x27;00123&#x27;).</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      # SALAH: df = pd.read_csv(&#x27;nasabah.csv&#x27;)
      # -&gt; 1 kolom berantakan! (default separator koma)
      df = pd.read_csv(&#x27;nasabah.csv&#x27;, sep=&#x27;;&#x27;,
                       dtype=&#123;&#x27;id&#x27;: str&#125;)  # id = string!
      print(df[&#x27;id&#x27;].iloc[0])  # -&gt; &#x27;00123&#x27; (nol depan selamat!)</pre>
              <p><strong>Bedah:</strong> dua jebakan klasik: (1) separator non-koma (Eropa: <code className="inline">;</code>!) → cek 5 baris pertama file mentah; (2) id numerik dibaca int → nol depan hilang → JOIN gagal (&#x27;123&#x27; ≠ &#x27;00123&#x27;). Aturan: id/kode = <code className="inline">dtype=str</code> <em>selalu</em>.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Eksplorasi DataFrame</h2>

      <p>Data CSV inline 6 nasabah. Eksplorasi: head, info, describe. Lalu ambil: baris posisi 0–2 (iloc) vs label tertentu (loc).</p>

      <PyodideLab
  title="Lab 1 — head/info/describe + loc/iloc"
  hint="Ubah: filter kota Jakarta DAN penghasilan > 8jt. Pakai &amp; dengan kurung!"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Kolom Baru Vectorized</h2>

      <p>Tambahkan kolom: bucket (dari dpd), gaji_jt, flag_bermasalah. Semua vectorized — dilarang loop!</p>

      <PyodideLab
  title="Lab 2 — Bucket + Flag tanpa Loop"
  hint="Agregat: hitung n &amp; rata-rata gaji per kota (groupby — intip D6!)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: pandas Dasar</h2>

      <div className="decision-card">
<h3>1. Lihat data → <strong>head/info/describe</strong></h3>
<p><strong>Kondisi data:</strong> Eksplorasi.</p>
<p><strong>Kenapa:</strong> 30 detik = peta data.</p>
<p><strong>Contoh nyata:</strong> DataFrame baru.</p>
</div>

      <div className="decision-card">
<h3>2. Baris by posisi → <strong>iloc</strong></h3>
<p><strong>Kondisi data:</strong> Posisi.</p>
<p><strong>Kenapa:</strong> Eksklusif ujung; aman.</p>
<p><strong>Contoh nyata:</strong> df.iloc[0:5].</p>
</div>

      <div className="decision-card">
<h3>3. Baris by label → <strong>loc</strong></h3>
<p><strong>Kondisi data:</strong> Label.</p>
<p><strong>Kenapa:</strong> Inklusif ujung! Index bermakna.</p>
<p><strong>Contoh nyata:</strong> df.loc['2026-01'].</p>
</div>

      <div className="decision-card">
<h3>4. Filter → <strong>boolean mask</strong></h3>
<p><strong>Kondisi data:</strong> WHERE.</p>
<p><strong>Kenapa:</strong> & | ~ dengan kurung.</p>
<p><strong>Contoh nyata:</strong> df[df.dpd &gt; 30].</p>
</div>

      <div className="decision-card">
<h3>5. Kolom baru → <strong>vectorized assign</strong></h3>
<p><strong>Kondisi data:</strong> Transformasi.</p>
<p><strong>Kenapa:</strong> Jangan loop!</p>
<p><strong>Contoh nyata:</strong> df['x'] = df.a * 2.</p>
</div>

      <div className="decision-card">
<h3>6. Baca file → <strong>read_csv + cek dtypes</strong></h3>
<p><strong>Kondisi data:</strong> Input.</p>
<p><strong>Kenapa:</strong> Tebakan tipe sering salah.</p>
<p><strong>Contoh nyata:</strong> parse_dates, dtype, na_values.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Baru: head/info/describe/dtypes.</li><li>iloc = posisi (eksklusif); loc = label (inklusif!).</li><li>Filter: mask + &amp; | ~ berkunjung... berkonsultasi dengan kurung.</li><li>Kolom baru: vectorized, bukan loop.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Filter Excel yang Crash</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Excel 1 juta baris crash saat filter 'dpd=0 per kota, rata-rata gaji'. Tulis solusi pandas 5 baris.</p><p><strong>Tugas:</strong> tulis kodenya + jelaskan kenapa tidak crash.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">df = pd.read_csv('data.csv', usecols=['kota','penghasilan','dpd'])</code><br/><code className="inline">hasil = df[df.dpd == 0].groupby('kota')['penghasilan'].mean()</code><br/><code className="inline">print(hasil)</code></p><p><strong>Kenapa tidak crash:</strong> (1) usecols = baca yang perlu saja; (2) vectorized di C; (3) tidak render 1 juta baris ke layar. <strong>Pelajaran:</strong> 'tugas sederhana' tidak butuh 'alat berat' — butuh alat <em>tepat</em>.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li><code className="inline">df[df.gaji &gt; 10_000_000]</code> vs <code className="inline">df.query(&#x27;gaji &gt; 10000000&#x27;)</code> — apa bedanya? Kapan query lebih enak?</li>
              <li>Tulis 1 baris: jumlah nasabah per kota yang gajinya di atas rata-rata <em>nasional</em>.</li>
              <li>Mengapa <code className="inline">df[&#x27;gaji&#x27;][mask] = 0</code> berbahaya (SettingWithCopyWarning)? Tulis yang benar.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Hasil sama; <code className="inline">query()</code> = sintaks string (enak untuk filter panjang/kompleks, tanpa kurung berlapis). Mask boolean = lebih cepat &amp; fleksibel untuk mask reuse. Pilih sesuai keterbacaan.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 2.
      df[df.gaji &gt; df.gaji.mean()].groupby(&#x27;kota&#x27;).size()
      # 3. Chained indexing: df[&#x27;gaji&#x27;][mask] bisa jadi KOPI -&gt; assignment hilang!
      df.loc[mask, &#x27;gaji&#x27;] = 0  # SATU operasi loc -&gt; pasti ke df asli</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>DataFrame</strong> (tabel) / <strong>Series</strong> (kolom); cek dtypes selalu!</li><li><strong>iloc</strong> (posisi, eksklusif) vs <strong>loc</strong> (label, inklusif!).</li><li><strong>Boolean mask</strong> = WHERE; <strong>kolom baru</strong> = vectorized.</li><li><strong>read_csv:</strong> parse_dates, dtype, na_values — lalu cek dtypes.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d3-numpy" className="btn btn-secondary btn-sm">← ← D3</Link>
        <Link href="/learn/d5-data-cleaning" className="btn btn-primary btn-sm">Next: D5 →</Link>
      </div>
    </div>
  );
}

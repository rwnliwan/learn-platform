import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D5DataCleaningPage() {
  const chart1 = [{"x": ["dtype", "missing", "duplikat", "outlier", "teks"], "y": [15, 35, 10, 15, 25], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["15%", "35%", "10%", "15%", "25%"], "textposition": "outside"}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, numpy as np, io

csv = """id,nama,kota,penghasilan,dpd,updated_at
1,Andi,Jakarta,8500000,0,2026-09-01
2,Budi,Bandung,12000000,15,2026-09-01
3,Citra,Jakarta,6700000,45,2026-09-01
4,Dewi,Surabaya,15000000,0,2026-09-01
5,Eko,Jakarta,,90,2026-09-01
2,Budi,Bandung,12500000,15,2026-09-05
6,Fahri,Medan,500000000,5,2026-09-01
7,Gita,Jakarta,abc,10,2026-09-01"""
df = pd.read_csv(io.StringIO(csv))
print(f"Baris awal: {len(df)}")

# 1. dtype
df["penghasilan"] = pd.to_numeric(df["penghasilan"], errors="coerce")
print(f"Gagal konversi: {df['penghasilan'].isna().sum()}")

# 2. missing: tandai + imputasi median
df["gaji_imputed"] = df["penghasilan"].isna()
med = df["penghasilan"].median()
df["penghasilan"] = df["penghasilan"].fillna(med)
print(f"Median imputasi: {med:,.0f}")

# 3. duplikat: terbaru menang
n_dup = df.duplicated("id").sum()
df = df.sort_values("updated_at").drop_duplicates("id", keep="last")
print(f"Duplikat dihapus: {n_dup}")

# 4. outlier (IQR) — investigasi, jangan hapus buta!
q1, q3 = df["penghasilan"].quantile([0.25, 0.75])
batas = q3 + 1.5 * (q3 - q1)
print(f"Batas atas IQR: {batas:,.0f}")
print("Outlier:"); print(df[df["penghasilan"] > batas][["nama", "penghasilan"]])

print(f"\nBaris akhir: {len(df)}")
# Coba: winsorize Fahri dengan clip(upper=batas). Kapan cap vs hapus?
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd

df = pd.DataFrame({
    "nama": ["Andi", "Budi", "Citra", "Dewi"],
    "hp": ["0812-3456-789", "+62 812 3456 789", "08123456789", "tidak punya"],
    "kode_trx": ["JKT-001", "BDG-023", "JKT-045", "SBY-007"],
})

df["hp_bersih"] = df["hp"].str.replace(r"\D", "", regex=True)
df["hp_valid"] = df["hp_bersih"].str.len().between(10, 14)
df["kota_kode"] = df["kode_trx"].str.extract(r"([A-Z]+)-\d+")[0]
print(df[["nama", "hp", "hp_bersih", "hp_valid", "kota_kode"]])

# Coba: normalisasi +62 -> 0 di depan. (str.replace dengan regex!)
`;
  const quizData = [{"question": "errors='coerce' pada to_numeric…", "options": ["Error jika gagal", "Gagal → NaN (tidak crash)", "Hapus baris", "Abaikan kolom"], "correct": 1, "explanation": "Benar: toleran — lalu ukur berapa yang jadi NaN."}, {"question": "Imputasi sebelum split train-test…", "options": ["Baik", "Data leakage! Pakai statistik train saja", "Tidak masalah", "Wajib"], "correct": 1, "explanation": "Benar: statistik full data 'membocorkan' info test."}, {"question": "Outlier valid tapi ekstrem sebaiknya…", "options": ["Selalu hapus", "Investigasi → cap/pertahankan + catat", "Abaikan", "Ganti 0"], "correct": 1, "explanation": "Benar: outlier mungkin fraud/peluang — jangan hapus buta."}, {"question": "drop_duplicates tanpa subset…", "options": ["Aman", "Berisiko: hanya hapus baris identik penuh — pikirkan definisi duplikat", "Error", "Hapus semua"], "correct": 1, "explanation": "Benar: definisikan duplikat (subset id) + aturan menang."}, {"question": "Kolom 'kota' 4 nilai unik sebaiknya…", "options": ["object", "category (hemat memori)", "int", "dihapus"], "correct": 1, "explanation": "Benar: category untuk kardinalitas rendah."}, {"question": "Fungsi cleaning ideal mengembalikan…", "options": ["Nilai saja", "(nilai, status) — untuk laporan kualitas", "Error", "Tidak mengembalikan"], "correct": 1, "explanation": "Benar: status memungkinkan audit trail + metrik."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D5 — Python</span>
        <h1 className="display-title">Data Cleaning: dtype, Missing,<br/>Duplikat, Outlier</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 80% Waktu untuk 20% Kemuliaan</a></li>
          <li><a href="#dtype">dtype — Perbaiki Tipe Dulu</a></li>
          <li><a href="#missing">Missing — Deteksi, Pahami, Tindakan</a></li>
          <li><a href="#duplikat">Duplikat — Aturan Menang</a></li>
          <li><a href="#outlier">Outlier — IQR &amp; z-score</a></li>
          <li><a href="#regex">Regex — Bedah Teks Kotor</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pipeline Cleaning Lengkap</a></li>
          <li><a href="#lab2">🔬 Lab 2: Regex untuk Teks Kotor</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Cleaning</a></li>
          <li><a href="#case">📋 Mini-Case: Audit Cleaning (60+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Memperbaiki <strong>dtype</strong> (to_numeric, to_datetime, astype).</li><li>Menangani <strong>missing</strong>: deteksi, hapus, imputasi (dengan benar!).</li><li>Menghapus <strong>duplikat</strong> dengan aturan menang.</li><li>Mendeteksi <strong>outlier</strong> (IQR, z-score) &amp; membersihkan teks (regex).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 80% Waktu untuk 20% Kemuliaan</h2>

      <div className="story"><p>Survei industri konsisten: data scientist menghabiskan <strong>80% waktu untuk cleaning</strong>. Bukan karena mereka lambat — karena data nyata = kotor: tipe salah, hilang, duplikat, outlier, teks berantakan.</p><p>Kabar baik: 90% cleaning = <strong>pola berulang</strong> yang bisa dihafal. Lesson case-heavy ini (60+ menit) = pola lengkap + <em>kapan</em> tiap teknik tepat (dan kapan berbahaya!). Cleaning yang salah = analisis yang salah — ini skill dengan ROI tertinggi.</p><p><strong>Twist-nya:</strong> 80% waktu untuk cleaning — terdengar seperti pekerjaan rendahan, tapi justru 80% inilah yang menentukan 100% hasil. Model canggih di atas data kotor = kesimpulan salah yang <em>meyakinkan</em>. Ironi industri: skill yang &ldquo;paling membosankan&rdquo; (cleaning) punya ROI tertinggi. Yang menguasai cleaning menguasai kebenaran analisisnya.</p></div>

      <h2 id="dtype">dtype — Perbaiki Tipe Dulu</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">df[&#x27;penghasilan&#x27;] = pd.to_numeric(df[&#x27;penghasilan&#x27;], errors=&#x27;coerce&#x27;)
df[&#x27;tanggal&#x27;] = pd.to_datetime(df[&#x27;tanggal&#x27;], errors=&#x27;coerce&#x27;)
df[&#x27;kota&#x27;] = df[&#x27;kota&#x27;].astype(&#x27;category&#x27;)  # hemat memori!
# errors=&#x27;coerce&#x27;: yang gagal -&gt; NaT/NaN (bukan crash)</pre>

      <ul>
<li><strong>to_numeric:</strong> object → angka; <code className="inline">errors='coerce'</code> = gagal → NaN.</li>
<li><strong>to_datetime:</strong> string → datetime64 (D7!). Format aneh? <code className="inline">format='%d/%m/%Y'</code>.</li>
<li><strong>category:</strong> untuk kolom sedikit nilai unik (kota, status) — hemat memori 10×+.</li>
<li><strong>Urutan:</strong> perbaiki dtype <em>dulu</em> — banyak 'error' hilang setelah tipe benar!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Cek setelah konversi: <code className="inline">df['x'].isna().sum()</code> — berapa yang gagal jadi NaN? Jika banyak, format datamu tak seperti dugaan — investigasi, jangan abaikan!</p>
</div>

      <h2 id="missing">Missing — Deteksi, Pahami, Tindakan</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># deteksi
print(df.isna().sum())           # per kolom
print(df.isna().mean())          # proporsi

# hapus
bersih = df.dropna()                    # hapus baris ada NaN
bersih = df.dropna(subset=[&#x27;penghasilan&#x27;])  # hanya kolom penting

# imputasi
median = df[&#x27;penghasilan&#x27;].median()
df[&#x27;penghasilan&#x27;] = df[&#x27;penghasilan&#x27;].fillna(median)</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Strategi</th><th>Kapan</th><th>Bahaya</th></tr></thead>
<tbody>
<tr><td>dropna</td><td>&lt; 5% & MCAR</td><td>Bias jika tidak acak!</td></tr>
<tr><td>fillna median</td><td>Numerik skew</td><td>Menekan varians</td></tr>
<tr><td>fillna mean</td><td>Numerik simetris</td><td>Sensitif outlier</td></tr>
<tr><td>fillna modus/ffill</td><td>Kategorikal/time-series</td><td>Asumsi kuat</td></tr>
<tr><td>model-based</td><td>Penting & kompleks</td><td>Overkill untuk eksplorasi</td></tr>
</tbody>
</table>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Missing selalu diisi rata-rata.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Imputasi buta = bias buta! Tanya dulu <em>mengapa</em> hilang (A1.7: MCAR/MAR/MNAR). Eko (gaji NULL) — jika gaji hilang karena <em>pengangguran</em>, imputasi median = salah total! <strong>Aturan:</strong> pahami mekanisme → pilih strategi → <strong>tandai yang diimputasi</strong> (<code className="inline">df['gaji_imputed'] = df['gaji'].isna()</code>).</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Jangan imputasi sebelum split train-test (D12)! Imputasi pakai statistik <em>train</em> saja — pakai statistik full data = <strong>data leakage</strong>.</p>
</div>

      <h2 id="duplikat">Duplikat — Aturan Menang</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># deteksi
print(df.duplicated().sum())
print(df[df.duplicated(&#x27;id&#x27;, keep=False)])  # lihat semua duplikat

# hapus dengan aturan menang (terbaru menang)
bersih = (df.sort_values(&#x27;updated_at&#x27;)
              .drop_duplicates(&#x27;id&#x27;, keep=&#x27;last&#x27;))</pre>

      <ul>
<li><code className="inline">duplicated()</code> = deteksi; <code className="inline">drop_duplicates(subset, keep)</code> = hapus.</li>
<li><strong>keep:</strong> 'first'/'last'/False — aturan menang eksplisit!</li>
<li><strong>Sort dulu</strong> jika 'terbaru menang' (butuh updated_at!).</li>
<li><strong>Ukur dulu</strong> (C10!): berapa % duplikat? Sumbernya?</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Duplikat 'sempurna' (semua kolom sama) vs 'parsial' (id sama, atribut beda) — yang kedua butuh aturan menang. Jangan drop_duplicates buta tanpa subset yang dipikirkan!</p>
</div>

      <h2 id="outlier">Outlier — IQR &amp; z-score</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># IQR method (A1.5!)
q1, q3 = df[&#x27;penghasilan&#x27;].quantile([0.25, 0.75])
iqr = q3 - q1
batas_bawah, batas_atas = q1 - 1.5*iqr, q3 + 1.5*iqr
outlier = df[(df[&#x27;penghasilan&#x27;] &lt; batas_bawah) | (df[&#x27;penghasilan&#x27;] &gt; batas_atas)]

# z-score
z = (df[&#x27;penghasilan&#x27;] - df[&#x27;penghasilan&#x27;].mean()) / df[&#x27;penghasilan&#x27;].std()
outlier_z = df[z.abs() &gt; 3]</pre>

      <ul>
<li><strong>Tindakan:</strong> investigasi → (a) salah input? perbaiki/hapus; (b) valid tapi ekstrem? <strong>winsorize/cap</strong> atau biarkan + catat; (c) untuk model robust? biarkan.</li>
<li><strong>Jangan</strong> hapus outlier diam-diam — ia mungkin <em>fraud</em> (C14!) atau <em>peluang</em>.</li>
<li><strong>Cap:</strong> <code className="inline">df['x'].clip(upper=batas_atas)</code> — batasi, bukan hapus.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Outlier harus selalu dibuang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Outlier = data yang <em>tidak biasa</em>, bukan <em>salah</em>. Gaji Rp 500jt/bulan = outlier statistik tapi mungkin direktur (valid!). Hapus tanpa investigasi = hapus informasi. <strong>Aturan:</strong> investigasi → keputusan tercatat → tindakan.</p>
</div>

      <h2 id="regex">Regex — Bedah Teks Kotor</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># bersihkan no HP: ambil digit saja
df[&#x27;hp_bersih&#x27;] = df[&#x27;hp&#x27;].str.replace(r&#x27;\D&#x27;, &#x27;&#x27;, regex=True)

# ekstrak kode dari &#x27;JKT-00123&#x27;
df[&#x27;kode&#x27;] = df[&#x27;id_transaksi&#x27;].str.extract(r&#x27;([A-Z]+)-(\d+)&#x27;)[0]

# validasi email sederhana
valid = df[&#x27;email&#x27;].str.match(r&#x27;^[^@]+@[^@]+\.[^@]+$&#x27;)</pre>

      <ul>
<li><code className="inline">.str</code> accessor = operasi string vectorized!</li>
<li><strong>Pola wajib:</strong> <code className="inline">\D</code> (non-digit), <code className="inline">\d+</code> (angka), <code className="inline">^...$</code> (full match).</li>
<li><strong>Kapan:</strong> standardisasi telepon, ekstrak kode, validasi format.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tiga regex menyelamatkan 80% kasus teks: <code className="inline">\D</code> (buang non-digit), <code className="inline">\s+</code> (spasi berlebih), <code className="inline">^...$</code> (validasi penuh). Sisanya: Stack Overflow.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Alokasi Waktu Cleaning (ilustrasi survei)"
  layout={{"xaxis": {"title": "Jenis masalah"}, "yaxis": {"title": "% waktu"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Distribusi ilustratif waktu cleaning.</p>
<p><strong>Interpretasi:</strong> Missing + teks = 60% waktu. <strong>Investasi:</strong> validasi di <em>sumber</em> (form, API) 10× lebih murah dari cleaning di <em>hilir</em>. Analis senior = yang memperbaiki hulu, bukan cuma membersihkan hilir.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Cleaning = keputusan, bukan sekadar kode.</p>

            <details className="worked">
              <summary>📐 Kasus 1: dtype — kolom angka yang dibaca string</summary>
              <p>Kolom <code className="inline">penghasilan</code> terbaca <code className="inline">object</code> karena ada &#x27;1.000.000&#x27; (titik ribuan!) dan &#x27;-&#x27;. Perbaiki.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      s = pd.Series([&#x27;1.000.000&#x27;, &#x27;8500000&#x27;, &#x27;-&#x27;, &#x27;12.500.000&#x27;])
      # Langkah 1: sentinel -&gt; NA
      s = s.replace(&#x27;-&#x27;, pd.NA)
      # Langkah 2: buang titik ribuan (Indonesia!) lalu ke numerik
      s = pd.to_numeric(s.str.replace(&#x27;.&#x27;, &#x27;&#x27;, regex=False), errors=&#x27;coerce&#x27;)
      print(s.tolist())  # -&gt; [1000000.0, 8500000.0, nan, 12500000.0]</pre>
              <p><strong>Bedah:</strong> urutan = sentinel dulu, format lokal kemudian, <code className="inline">errors=&#x27;coerce&#x27;</code> terakhir (yang tak terparse → NaN, tidak crash). <code className="inline">&#x27;.&#x27;</code> di Indonesia = pemisah ribuan — <code className="inline">to_numeric</code> langsung akan gagal total. Kenali format lokal datamu!</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Missing — hapus, isi, atau biarkan?</summary>
              <p>1.000 baris; <code className="inline">penghasilan</code> 5% NaN (MCAR — hilang acak), <code className="inline">alasan_telat</code> 60% NaN (hanya diisi jika telat).</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      # penghasilan: 5% MCAR -&gt; imputasi median aman
      df[&#x27;penghasilan&#x27;] = df[&#x27;penghasilan&#x27;].fillna(df[&#x27;penghasilan&#x27;].median())
      # alasan_telat: 60% NaN = &quot;bukan missing&quot; -&gt; JANGAN diisi!
      # Ia informatif: NaN = lancar. Buat flag:
      df[&#x27;pernah_telat&#x27;] = df[&#x27;alasan_telat&#x27;].notna()</pre>
              <p><strong>Bedah:</strong> dua missing, dua nasib berlawanan. MCAR 5% → imputasi median (distorsi minimal). 60% &ldquo;missing&rdquo; struktural → <em>bukan missing</em>, melainkan informasi (lancar!) — mengisinya justru menghancurkan sinyal. <strong>Aturan:</strong> pahami <em>mekanisme</em> hilangnya sebelum memilih teknik.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Outlier — IQR vs z-score pada gaji</summary>
              <p>Gaji: [8, 9, 10, 11, 200] (juta). Terdeteksi outlier oleh IQR? z-score? Mana yang benar?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      s = pd.Series([8, 9, 10, 11, 200])
      q1, q3 = s.quantile(0.25), s.quantile(0.75)
      iqr = q3 - q1
      print(q3 + 1.5*iqr)          # -&gt; 14.0 -&gt; 200 = outlier (IQR)
      z = (s - s.mean()) / s.std()
      print(z.round(2).tolist())   # -&gt; 200 punya z=1.79 &lt; 3 -&gt; BUKAN outlier?!
      print(s.mean())              # -&gt; 47.6 (mean ikut tertarik!)</pre>
              <p><strong>Bedah:</strong> z-score <em>gagal</em> di sini — outlier 200 menarik mean &amp; SD sehingga z-nya &ldquo;normal&rdquo; (masking!). IQR (berbasis median/kuartil, robust) menangkapnya. <strong>Pelajaran:</strong> detektor outlier yang memakai mean/SD bisa dibutakan oleh outlier itu sendiri — pakai metode robust (IQR/MAD) untuk skrining pertama.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Pipeline Cleaning Lengkap</h2>

      <p>Data sengaja dikotori: tipe salah, missing, duplikat, outlier. Bersihkan dengan pipeline lengkap + <strong>lapor % tiap masalah</strong>!</p>

      <PyodideLab
  title="Lab 1 — Kotor → Bersih"
  hint="Tambahkan: kolom status_cleaning yang mencatat tindakan per baris (audit trail!)."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Regex untuk Teks Kotor</h2>

      <p>Bersihkan no HP berantakan → digit saja, validasi panjang 10–14. Ekstrak kode kota dari format 'JKT-001'.</p>

      <PyodideLab
  title="Lab 2 — Standardisasi Telepon"
  hint="Validasi email: tulis regex sederhana + uji 3 contoh (2 valid, 1 tidak)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Cleaning</h2>

      <div className="decision-card">
<h3>1. Tipe salah → <strong>to_numeric/to_datetime (coerce)</strong></h3>
<p><strong>Kondisi data:</strong> dtype dulu.</p>
<p><strong>Kenapa:</strong> Banyak error hilang setelah tipe benar.</p>
<p><strong>Contoh nyata:</strong> Angka object → numeric.</p>
</div>

      <div className="decision-card">
<h3>2. Missing → <strong>pahami → pilih → tandai</strong></h3>
<p><strong>Kondisi data:</strong> Mekanisme.</p>
<p><strong>Kenapa:</strong> MCAR/MAR/MNAR menentukan strategi; tandai imputasi.</p>
<p><strong>Contoh nyata:</strong> Median + flag.</p>
</div>

      <div className="decision-card">
<h3>3. Duplikat → <strong>ukur → aturan menang</strong></h3>
<p><strong>Kondisi data:</strong> Dedup.</p>
<p><strong>Kenapa:</strong> Sort + drop_duplicates(subset, keep).</p>
<p><strong>Contoh nyata:</strong> Terbaru menang.</p>
</div>

      <div className="decision-card">
<h3>4. Outlier → <strong>investigasi → keputusan tercatat</strong></h3>
<p><strong>Kondisi data:</strong> Ekstrem.</p>
<p><strong>Kenapa:</strong> IQR/z-score deteksi; jangan hapus buta.</p>
<p><strong>Contoh nyata:</strong> Cap vs hapus vs biarkan.</p>
</div>

      <div className="decision-card">
<h3>5. Teks kotor → <strong>.str + regex</strong></h3>
<p><strong>Kondisi data:</strong> Standardisasi.</p>
<p><strong>Kenapa:</strong> Vectorized; 3 pola cukup.</p>
<p><strong>Contoh nyata:</strong> \D, \s+, validasi.</p>
</div>

      <div className="decision-card">
<h3>6. Semua → <strong>lapor % + audit trail</strong></h3>
<p><strong>Kondisi data:</strong> Akuntabilitas.</p>
<p><strong>Kenapa:</strong> Cleaning tanpa metrik = tak terukur.</p>
<p><strong>Contoh nyata:</strong> '5% diimputasi'.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>dtype dulu, baru lainnya.</li><li>Missing: pahami mekanisme, tandai imputasi.</li><li>Outlier: investigasi, jangan hapus buta.</li><li>Catat semua tindakan + laporkan %.</li><li>Jangan imputasi sebelum split (leakage!).</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Audit Cleaning (60+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Kamu menerima CSV 50.000 baris dari tim lain. Atasan minta 'analisis siap' besok pagi.</p><p><strong>Tugas:</strong> (1) Rancang <strong>checklist cleaning</strong> 10 langkah. (2) Untuk tiap langkah: kode + metrik yang dilaporkan. (3) Tulis <strong>laporan kualitas 5 kalimat</strong> (template untuk atasan).</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Checklist:</strong> ① dtypes ② missing per kolom ③ duplikat ④ validitas range ⑤ konsistensi bisnis ⑥ outlier ⑦ teks ⑧ tanggal ⑨ relasi antar tabel ⑩ snapshot sebelum/sesudah.</p><p><strong>Laporan contoh:</strong> 'Dari 50.000 baris: 3% missing penghasilan (diimputasi median, ditandai), 1,2% duplikat (terbaru menang), 7 outlier (&gt;batas IQR, 2 dikoreksi typo, 5 valid dipertahankan), 0 inkonsistensi status. Data siap analisis dengan catatan terlampir.'</p><p><strong>Pelajaran:</strong> laporan cleaning = <strong>kepercayaan</strong>. Analis yang melampirkan 'catatan data' 1 paragraf = analis yang dipercaya angkanya.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Kolom tanggal campur: &#x27;2026-01-05&#x27;, &#x27;05/01/2026&#x27;, &#x27;Jan 5 2026&#x27;. Tulis 1 baris untuk jadi datetime (petunjuk: <code className="inline">dayfirst</code>).</li>
              <li>Duplikat: 2 baris nasabah sama persis kecuali <code className="inline">updated_at</code> beda. Aturan menang mana yang dipakai? Tulis kodenya.</li>
              <li>Mengapa <code className="inline">df.dropna()</code> polos berbahaya? Beri skenario angka.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1.
      pd.to_datetime(s, dayfirst=True, errors=&#x27;coerce&#x27;)
      # dayfirst: &#x27;05/01/2026&#x27; -&gt; 5 Jan (bukan 1 Mei!). errors=coerce: yang gagal -&gt; NaT.
      # 2. Menang = yang terbaru:
      df.sort_values(&#x27;updated_at&#x27;).drop_duplicates(&#x27;id&#x27;, keep=&#x27;last&#x27;)</pre>
              <p><strong>3.</strong> Jika 30% baris punya ≥1 NaN di kolom manapun, <code className="inline">dropna()</code> menghapus 30% data — mungkin justru segmen termiskin (penghasilan NaN!) → bias sistematis. Selalu cek <em>berapa %</em> yang terhapus &amp; <em>siapa</em> mereka sebelum drop.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>dtype</strong> dulu: to_numeric/to_datetime (coerce) + category.</li><li><strong>Missing:</strong> pahami mekanisme → pilih strategi → tandai imputasi.</li><li><strong>Duplikat:</strong> ukur → aturan menang eksplisit.</li><li><strong>Outlier:</strong> IQR/z-score deteksi; investigasi sebelum tindakan.</li><li><strong>Regex:</strong> \D, \s+, validasi — via .str.</li><li><strong>Lapor:</strong> % + audit trail. Jangan imputasi sebelum split!</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d4-pandas-dasar" className="btn btn-secondary btn-sm">← ← D4</Link>
        <Link href="/learn/d6-wrangling" className="btn btn-primary btn-sm">Next: D6 →</Link>
      </div>
    </div>
  );
}

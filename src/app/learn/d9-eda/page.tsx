import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D9EdaPage() {
  const chart1 = [{"x": ["Gambaran", "Kualitas", "Univariat", "Bivariat", "Waktu", "Sintesis"], "y": [10, 25, 20, 20, 15, 10], "type": "bar", "marker": {"color": ["#2a7de1", "#ef4444", "#e8a838", "#e8a838", "#34a853", "#2a7de1"]}, "text": ["10%", "25%", "20%", "20%", "15%", "10%"], "textposition": "outside"}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, numpy as np, io

csv = """id,kota,plafon,tenor,dpd,kolektibilitas
1,Jakarta,50000000,12,0,1
2,Bandung,100000000,24,15,2
3,Jakarta,30000000,12,45,3
4,Surabaya,200000000,36,0,1
5,Jakarta,75000000,24,90,4
6,Bandung,40000000,12,5,1
7,Medan,60000000,18,30,2
8,Jakarta,90000000,24,0,1
9,Surabaya,25000000,12,120,5
10,Medan,55000000,18,0,1
11,Bandung,30000000,12,60,3
12,Jakarta,,6,150,5"""
df = pd.read_csv(io.StringIO(csv))

# LANGKAH 1: gambaran
print("Shape:", df.shape)
print(df.dtypes)

# LANGKAH 2: kualitas
print("\nMissing %:"); print((df.isna().mean()*100).round(1))
print("Duplikat:", df.duplicated().sum())

# LANGKAH 3: univariat numerik
print("\nDeskriptif:"); print(df.describe().round(0))
print("\nKolektibilitas:"); print(df["kolektibilitas"].value_counts().sort_index())

# TEMUAN (tulis!):
# 1. ...
# 2. ...
# ISU KUALITAS:
# 1. ...

# Coba: plafon skew? (bandingkan mean vs median!)
print("\nMean plafon:", df["plafon"].mean(), "| Median:", df["plafon"].median())
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, numpy as np, io

csv = """id,kota,plafon,dpd,kolektibilitas
1,Jakarta,50000000,0,1
2,Bandung,100000000,15,2
3,Jakarta,30000000,45,3
4,Surabaya,200000000,0,1
5,Jakarta,75000000,90,4
6,Bandung,40000000,5,1
7,Medan,60000000,30,2
8,Jakarta,90000000,0,1
9,Surabaya,25000000,120,5
10,Medan,55000000,0,1"""
df = pd.read_csv(io.StringIO(csv))

# LANGKAH 4: bivariat
kor = df["plafon"].corr(df["dpd"])
print(f"Korelasi plafon-dpd: {kor:.2f}")

npl = df.assign(npl=df["kolektibilitas"] >= 3).groupby("kota")["npl"].mean()
print("\nNPL rate per kota:"); print((npl*100).round(1))

# Q BERLAPIS: kenapa Surabaya NPL 50%? -> cek n (kecil!) -> cek barisnya
print("\nDetail Surabaya:"); print(df[df["kota"] == "Surabaya"])

# Coba: hitung ulang NPL per kota BERDASAR PLAFON (bukan count). Beda?
npl_p = df.assign(np=df["plafon"].where(df["kolektibilitas"]>=3, 0)).groupby("kota").apply(
    lambda g: g["np"].sum()/g["plafon"].sum())
print("\nNPL plafon per kota:"); print((npl_p*100).round(1))
`;
  const quizData = [{"question": "Langkah pertama EDA…", "options": ["Bivariat", "Gambaran + kualitas (jangan lompat!)", "Modeling", "Presentasi"], "correct": 1, "explanation": "Benar: urut! Insight dari data kotor = sampah."}, {"question": "Insight pertama sebaiknya…", "options": ["Langsung presentasi", "Dicurigai & divalidasi berlapis", "Diabaikan", "Disebar"], "correct": 1, "explanation": "Benar: hipotesis, bukan kesimpulan."}, {"question": "Kolom 'kategori' dengan 5.000 unik dari 10.000 baris…", "options": ["Normal", "Red flag: kotor atau sebenarnya ID", "Bagus", "Hapus"], "correct": 1, "explanation": "Benar: kardinalitas aneh = investigasi."}, {"question": "Korelasi 0.8 artinya…", "options": ["Kausalitas", "Hubungan kuat, bukan kausalitas", "Tidak ada hubungan", "Error"], "correct": 1, "explanation": "Benar: korelasi ≠ kausalitas (A1.6!)."}, {"question": "Laporan EDA untuk eksekutif…", "options": ["50 chart", "1 halaman: 3 temuan + rekomendasi + batasan", "Kode mentah", "Tanpa batasan"], "correct": 1, "explanation": "Benar: ringkas + jujur tentang kelemahan."}, {"question": "Mean >> median menandakan…", "options": ["Data normal", "Skew (outlier kanan) — pakai median/log", "Error", "Data bersih"], "correct": 1, "explanation": "Benar: skew = sinyal dari profil."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D9 — Python</span>
        <h1 className="display-title">EDA: Workflow &amp; Profiling<br/>Data</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: EDA Acak vs Sistematis</a></li>
          <li><a href="#workflow">Workflow 6 Langkah</a></li>
          <li><a href="#profil">Profil Otomatis — Mesin 5 Menit</a></li>
          <li><a href="#tanya">Bertanya Berlapis — Dari Apa ke Kenapa</a></li>
          <li><a href="#dokumentasi">Dokumentasi — EDA yang Hilang = Tak Pernah Ada</a></li>
          <li><a href="#lab1">🔬 Lab 1: Profil Lengkap</a></li>
          <li><a href="#lab2">🔬 Lab 2: Bivariat + Waktu</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: EDA</a></li>
          <li><a href="#case">📋 Mini-Case: EDA 90 Menit (60+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjalankan <strong>workflow EDA</strong> sistematis (bukan acak!).</li><li>Membuat <strong>profil data</strong> otomatis (pandas-profiling manual).</li><li>Mengajukan &amp; menjawab <strong>pertanyaan analitis</strong> berlapis.</li><li>Mendokumentasikan <strong>temuan + batasan</strong>.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: EDA Acak vs Sistematis</h2>

      <div className="story"><p>Dua analis dapat dataset sama. Analis A: plot acak 2 jam, temukan &ldquo;gaji vs kota menarik&rdquo; — tapi lupa cek missing, dan insight-nya ternyata artefak duplikat. Analis B: ikut <strong>workflow 6 langkah</strong> 90 menit — temukan 3 insight valid + 2 isu kualitas + daftar pertanyaan lanjutan.</p><p>EDA (Exploratory Data Analysis) = <em>wawancara</em> dengan data. Tanpa struktur, wawancara ngalor-ngidul. Lesson case-heavy ini (60+ menit): workflow yang dipakai analis senior.</p><p><strong>Twist-nya:</strong> Analis A (2 jam, plot acak) vs Analis B (90 menit, workflow) — yang lebih <em>cepat</em> justru menemukan lebih <em>banyak</em>: 3 insight valid + 2 isu kualitas. Struktur tidak memperlambat eksplorasi; ia mempercepatnya, karena mencegah 2 jam mengejar artefak duplikat. Disiplin adalah jalan pintas yang menyamar sebagai jalan memutar.</p></div>

      <h2 id="workflow">Workflow 6 Langkah</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>#</th><th>Langkah</th><th>Pertanyaan</th><th>Alat</th></tr></thead>
<tbody>
<tr><td>1</td><td>Gambaran</td><td>'Data ini apa?'</td><td>head/info/describe/shape</td></tr>
<tr><td>2</td><td>Kualitas</td><td>'Apa yang kotor?'</td><td>isna/duplicated/dtypes (D5!)</td></tr>
<tr><td>3</td><td>Univariat</td><td>'Bagaimana tiap kolom?'</td><td>hist/box/value_counts</td></tr>
<tr><td>4</td><td>Bivariat</td><td>'Apa hubungannya?'</td><td>groupby/scatter/corr</td></tr>
<tr><td>5</td><td>Waktu</td><td>'Bagaimana trennya?'</td><td>resample/rolling (D7!)</td></tr>
<tr><td>6</td><td>Sintesis</td><td>'Jadi apa?'</td><td>Catatan temuan + batasan</td></tr>
</tbody>
</table>
</div>

      <p><strong>Aturan:</strong> urut! Jangan lompat ke bivariat sebelum kualitas (insight dari data kotor = sampah). Tiap langkah: <strong>catat</strong> (bukan di kepala!).</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># template profil univariat cepat
for col in df.select_dtypes(&#x27;number&#x27;).columns:
    print(col, &#x27;| mean:&#x27;, round(df[col].mean(), 1),
          &#x27;| missing:&#x27;, df[col].isna().mean().round(2),
          &#x27;| skew:&#x27;, round(df[col].skew(), 2))</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Skewness (B4!) di profil = sinyal: skew tinggi → log-transform atau median (bukan mean!). EDA yang baik <em>menghubungkan</em> ke track B — statistik bukan teori, tapi alat baca data.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;EDA = bikin chart sebanyak-banyaknya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> EDA = <em>menjawab pertanyaan</em>. Chart tanpa pertanyaan = dekorasi. Mulai tiap EDA dengan <strong>3–5 pertanyaan bisnis</strong> tertulis — chart melayani pertanyaan, bukan sebaliknya.</p>
</div>

      <h2 id="profil">Profil Otomatis — Mesin 5 Menit</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">def profil(df):
    print(f&#x27;Shape: &#123;df.shape&#125;&#x27;)
    print(f&quot;\nDuplikat: &#123;df.duplicated().sum()&#125;&quot;)
    print(&#x27;\nMissing (%):&#x27;)
    print((df.isna().mean() * 100).round(1).sort_values(ascending=False).head())
    print(&#x27;\nKardinalitas (unik):&#x27;)
    for c in df.select_dtypes(&#x27;object&#x27;):
        print(f&#x27;  &#123;c&#125;: &#123;df[c].nunique()&#125; unik&#x27;)
    print(&#x27;\nKorelasi numerik:&#x27;)
    print(df.select_dtypes(&#x27;number&#x27;).corr().round(2))</pre>

      <ul>
<li><strong>Kardinalitas:</strong> kolom 10.000 nilai unik dari 10.000 baris = ID (bukan kategori!).</li>
<li><strong>Korelasi:</strong> |r| &gt; 0.7 = hubungan kuat (tapi bukan kausal!).</li>
<li><strong>Di produksi:</strong> ydata-profiling / Sweetviz otomatisasi ini — tapi pahami manualnya dulu!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Red flag kardinalitas: kolom 'kategori' dengan 5.000 unik = data kotor (typo, case beda) atau sebenarnya ID. Normalisasi dulu (D5: lower/strip)!</p>
</div>

      <h2 id="tanya">Bertanya Berlapis — Dari Apa ke Kenapa</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Level</th><th>Pertanyaan</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td>Apa</td><td>Deskriptif</td><td>'Berapa NPL per kota?'</td></tr>
<tr><td>Kenapa</td><td>Diagnostik</td><td>'Kenapa kota X NPL-nya tinggi?'</td></tr>
<tr><td>Bagaimana jika</td><td>Prediktif (intip)</td><td>'Jika tren lanjut, NPL bulan depan?'</td></tr>
<tr><td>Apa yang dilakukan</td><td>Preskriptif</td><td>'Intervensi apa paling efektif?'</td></tr>
</tbody>
</table>
</div>

      <p><strong>Teknik '5 Whys' untuk data:</strong> NPL tinggi → kenapa? (bucket 31-60 menumpuk) → kenapa? (vintage Jul-25) → kenapa? (underwriting longgar) → ... Setiap 'kenapa' = 1 analisis lanjutan.</p>

      <details className="worked">
<summary>📐 Contoh berlapis</summary>
<p><strong>Q1 (apa):</strong> rata-rata DPD per kota → Bandung tertinggi (25).</p><p><strong>Q2 (kenapa):</strong> sebaran DPD Bandung → 1 outlier (120 hari) menaikkan rata-rata!</p><p><strong>Q3 (validasi):</strong> median DPD Bandung = 5 (normal) — Q1 tadi <em>menyesatkan</em>.</p><p><strong>Pelajaran:</strong> EDA berlapis <em>mengkoreksi diri</em>. Q1 tanpa Q2–Q3 = kesimpulan salah.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Insight pertama biasanya benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Justru <strong>curigai insight pertama</strong>! Cek: outlier? duplikat? definisi? Insight EDA = hipotesis, bukan kesimpulan — butuh validasi berlapis (inilah '5 Whys' data).</p>
</div>

      <h2 id="dokumentasi">Dokumentasi — EDA yang Hilang = Tak Pernah Ada</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># pola catatan temuan (di notebook/script)
temuan = []
temuan.append(&#123;&#x27;q&#x27;: &#x27;NPL per kota?&#x27;, &#x27;a&#x27;: &#x27;Medan 8% tertinggi&#x27;,
                 &#x27;validasi&#x27;: &#x27;n=2, kecil - tidak signifikan&#x27;,
                 &#x27;tindak&#x27;: &#x27;kumpulkan data 6 bulan&#x27;&#125;)</pre>

      <ul>
<li><strong>Catat:</strong> pertanyaan → jawaban → <strong>validasi</strong> → tindak lanjut.</li>
<li><strong>Batasan:</strong> 'data hanya 1 bulan', 'n kecil', 'definisi X' — jujur tentang kelemahan!</li>
<li><strong>Untuk atasan:</strong> 1 halaman: 3 temuan + 1 rekomendasi + batasan. Bukan 50 chart.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Struktur laporan EDA: <strong>Konteks → Temuan (3) → Batasan → Rekomendasi</strong>. Maks 1 halaman + lampiran. Eksekutif membaca kesimpulan; analis membaca lampiran.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Alokasi Waktu EDA 6 Langkah (ilustrasi)"
  layout={{"xaxis": {"title": "Langkah"}, "yaxis": {"title": "% waktu"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Distribusi ilustratif waktu per langkah.</p>
<p><strong>Interpretasi:</strong> <strong>Kualitas = 25%</strong> — langkah terbesar kedua! EDA yang melompatinya = istana di atas pasir. Dan 'sintesis' 10% = yang paling sering <em>dilewatkan</em>, padahal yang paling dibaca atasan.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. EDA = wawancara terstruktur dengan data.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Profil 5 menit — sebelum plot apapun</summary>
              <p>Dataset baru 50rb baris. Apa 5 hal pertama yang dicek?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      print(df.shape)            # (50000, 12) -&gt; skala
      print(df.dtypes)           # tipe benar? (tanggal jadi object?)
      print(df.isna().mean().sort_values(ascending=False).head())
                                 # missing per kolom, %
      print(df.duplicated().sum())          # duplikat?
      print(df.describe(include=&#x27;all&#x27;).T)  # sebaran + anomali (min/max aneh?)</pre>
              <p><strong>Bedah:</strong> 5 baris = &ldquo;vital sign&rdquo; dataset. <code className="inline">describe(include=&#x27;all&#x27;)</code> untuk kolom kategorikal juga. <strong>Jangan</strong> plot dulu sebelum ini — plot dari data yang tipenya salah = sampah visual. Analis B (cerita pembuka) memulai dari sini; Analis A langsung plot.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Korelasi palsu — &ldquo;menarik&rdquo; yang artefak</summary>
              <p>Scatter gaji vs kota-kode menunjukkan &ldquo;pola menarik&rdquo;. Mengapa harus curiga?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># Cek 1: apakah kota-kode numerik sembarang? (1=JKT, 2=SBY...)
      # -&gt; sumbu x BUKAN kontinu! Scatter-nya sampah.
      # Cek 2: duplikat?
      print(df.duplicated().sum())  # -&gt; 2000! Plot ulang tanpa duplikat:
      df2 = df.drop_duplicates()
      # -&gt; &quot;pola menarik&quot; HILANG. Itu artefak duplikat.
      # Cek 3: stratifikasi
      print(df2.groupby(&#x27;kota&#x27;)[&#x27;gaji&#x27;].mean())  # bandingkan antar grup</pre>
              <p><strong>Bedah:</strong> tiga pembunuh insight: (1) sumbu kategorikal diperlakukan kontinu, (2) duplikat menciptakan kluster palsu, (3) agregat menyembunyikan perbedaan grup (Simpson!). <strong>Aturan:</strong> setiap &ldquo;temuan menarik&rdquo; wajib lolos 3 cek ini sebelum dirayakan.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Pertanyaan berlapis — dari &ldquo;apa&rdquo; ke &ldquo;kenapa&rdquo;</summary>
              <p>NPL naik. Tulis 3 lapis pertanyaan EDA + query tiap lapis.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># Lapis 1 (APA): di mana naiknya?
      df.groupby(&#x27;kota&#x27;)[&#x27;is_macet&#x27;].mean().sort_values(ascending=False)
      # -&gt; Surabaya 4,2% vs lainnya ~2%
      # Lapis 2 (SIAPA/KAPAN): segmen/vintage apa di Surabaya?
      df[df.kota==&#x27;Surabaya&#x27;].groupby(&#x27;vintage&#x27;)[&#x27;is_macet&#x27;].mean()
      # -&gt; vintage 2025: 8%!
      # Lapis 3 (KENAPA): apa beda vintage 2025 Surabaya?
      df.groupby([&#x27;vintage&#x27;, &#x27;kota&#x27;])[&#x27;penghasilan&#x27;].median()
      # -&gt; median penghasilan 30% lebih rendah -&gt; underwriting longgar?</pre>
              <p><strong>Bedah:</strong> EDA yang baik = corong: luas (apa) → sempit (siapa) → mekanisme (kenapa). Tiap lapis = 1 groupby. Berhenti saat sampai pada <em>keputusan</em> (&ldquo;perketat underwriting Surabaya&rdquo;), bukan saat kehabisan pertanyaan.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Profil Lengkap</h2>

      <p>Dataset kredit inline. Jalankan: gambaran → kualitas → univariat. Catat 3 temuan + 1 isu kualitas!</p>

      <PyodideLab
  title="Lab 1 — EDA Langkah 1–3"
  hint="Lanjut Q berlapis: kenapa mean >> median? (outlier 200jt!) — validasi!"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Bivariat + Waktu</h2>

      <p>Hubungan: plafon vs dpd (scatter + korelasi). Per kota: NPL rate (groupby). Ajukan 1 'kenapa' + jawab!</p>

      <PyodideLab
  title="Lab 2 — EDA Langkah 4–5"
  hint="Renungkan: NPL count vs plafon beda — mana yang 'benar'? (Tergantung pertanyaan!)"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: EDA</h2>

      <div className="decision-card">
<h3>1. Mulai → <strong>3–5 pertanyaan tertulis</strong></h3>
<p><strong>Kondisi data:</strong> Fokus.</p>
<p><strong>Kenapa:</strong> Chart melayani pertanyaan.</p>
<p><strong>Contoh nyata:</strong> NPL per kota? Kenapa?</p>
</div>

      <div className="decision-card">
<h3>2. Selalu → <strong>kualitas dulu</strong></h3>
<p><strong>Kondisi data:</strong> Fondasi.</p>
<p><strong>Kenapa:</strong> Insight dari data kotor = sampah.</p>
<p><strong>Contoh nyata:</strong> D5 sebelum analisis.</p>
</div>

      <div className="decision-card">
<h3>3. Variabel tunggal → <strong>univariat</strong></h3>
<p><strong>Kondisi data:</strong> Pahami.</p>
<p><strong>Kenapa:</strong> hist/box + skew + missing.</p>
<p><strong>Contoh nyata:</strong> Sebaran gaji.</p>
</div>

      <div className="decision-card">
<h3>4. Hubungan → <strong>bivariat</strong></h3>
<p><strong>Kondisi data:</strong> Kaitkan.</p>
<p><strong>Kenapa:</strong> groupby/scatter/corr.</p>
<p><strong>Contoh nyata:</strong> Gaji vs DPD.</p>
</div>

      <div className="decision-card">
<h3>5. Insight pertama → <strong>curigai & validasi</strong></h3>
<p><strong>Kondisi data:</strong> Koreksi.</p>
<p><strong>Kenapa:</strong> Outlier? n kecil? definisi?</p>
<p><strong>Contoh nyata:</strong> 5 Whys.</p>
</div>

      <div className="decision-card">
<h3>6. Selesai → <strong>dokumentasi 1 halaman</strong></h3>
<p><strong>Kondisi data:</strong> Komunikasi.</p>
<p><strong>Kenapa:</strong> Temuan + batasan + rekomendasi.</p>
<p><strong>Contoh nyata:</strong> 3-1-1.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Pertanyaan tertulis dulu.</li><li>Kualitas sebelum insight.</li><li>Curigai insight pertama; validasi berlapis.</li><li>Catat: Q → A → validasi → tindak lanjut.</li><li>Lapor: 3 temuan + 1 rekomendasi + batasan.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: EDA 90 Menit (60+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Dataset kredit 12 baris (lab 1) + pertanyaan bisnis: 'Apakah kita harus khawatir tentang portofolio ini?'</p><p><strong>Tugas:</strong> jalankan 6 langkah penuh. Tulis: (1) 3 temuan, (2) 2 isu kualitas, (3) 2 pertanyaan lanjutan, (4) <strong>rekomendasi 3 kalimat</strong> + batasan.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Temuan:</strong> ① NPL 33% (4/12, kolektibilitas ≥3) — <em>sangat tinggi</em> vs benchmark ~3%! ② Terkonsentrasi: 2 dari 4 NPL di Jakarta. ③ Mean plafon &gt;&gt; median (skew, outlier 200jt).</p><p><strong>Isu:</strong> ① 1 missing plafon (8%!). ② n=12 <em>terlalu kecil</em> untuk kesimpulan.</p><p><strong>Lanjutan:</strong> ① Data berapa bulan? (vintage?) ② Definisi kolektibilitas konsisten?</p><p><strong>Rekomendasi:</strong> 'NPL 33% jauh di atas benchmark — tapi n=12 tidak konklusif. Minta data 6 bulan + definisi kolektibilitas sebelum eskalasi. Sementara: review 4 debitur NPL manual.'</p><p><strong>Pelajaran:</strong> EDA hebat = <strong>temuan + kerendahan hati</strong> (batasan). Rekomendasi tanpa batasan = kecerobohan.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li><code className="inline">df.describe()</code> menunjukkan <code className="inline">count</code> beda antar kolom. Apa artinya? Tindakanmu?</li>
              <li>Korelasi gaji–dpd = −0,4. Tulis 2 kalimat interpretasi yang <em>benar</em> (tanpa klaim kausal!).</li>
              <li>Mengapa EDA harus didokumentasikan (bukan &ldquo;di kepala&rdquo;)? Sebutkan 2 risikonya.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Ada missing (count = non-NaN). Tindakan: <code className="inline">df.isna().mean()</code> untuk % per kolom → putuskan: biarkan (analisis robust), imputasi, atau investigasi mekanismenya (D5!). Jangan abaikan — missing berpola = bias.</p>
              <p><strong>2.</strong> &ldquo;Gaji lebih tinggi cenderung berpasangan dengan dpd lebih rendah (korelasi −0,4, sedang).&rdquo; + &ldquo;Ini <em>asosiasi</em>, bukan bukti gaji <em>menyebabkan</em> dpd turun — bisa ada faktor ketiga (mis. pendidikan).&rdquo; Korelasi ≠ kausasi (A2.13!).</p>
              <p><strong>3.</strong> (a) Insight hilang saat ditanya &ldquo;kok bisa begitu?&rdquo; 2 minggu kemudian. (b) Orang lain tidak bisa memverifikasi/meneruskan. EDA tanpa catatan = mimpi: terasa jelas saat itu, hilang saat dibutuhkan.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Workflow:</strong> gambaran → kualitas → univariat → bivariat → waktu → sintesis.</li><li><strong>Mulai</strong> dengan pertanyaan tertulis; <strong>akhiri</strong> dengan dokumentasi.</li><li><strong>Curigai</strong> insight pertama; validasi berlapis (5 Whys).</li><li><strong>Lapor:</strong> 3 temuan + 1 rekomendasi + batasan (jujur!).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d8-visualisasi-2" className="btn btn-secondary btn-sm">← ← D8-2</Link>
        <Link href="/learn/d10-feature-engineering" className="btn btn-primary btn-sm">Next: D10 →</Link>
      </div>
    </div>
  );
}

import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D8Visualisasi1Page() {
  const chart1 = [{"x": ["A", "B"], "y": [100, 115], "type": "bar", "name": "Jujur (Y dari 0)", "marker": {"color": "#34a853"}}, {"x": ["A", "B"], "y": [100, 115], "type": "bar", "name": "Menipu (Y dari 90)", "marker": {"color": "#ef4444"}, "xaxis": "x2", "yaxis": "y2"}];
  const lab1Code = String.raw`
import matplotlib
matplotlib.use("Agg")  # backend non-interaktif (browser)
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(7)
gaji = rng.normal(9_000_000, 2_500_000, 200).clip(3_000_000)
kota = rng.choice(["Jakarta", "Bandung", "Surabaya"], 200)

# 1. BAR: rata-rata per kota
rata = {k: gaji[kota == k].mean() for k in ["Jakarta", "Bandung", "Surabaya"]}
fig, ax = plt.subplots()
ax.bar(rata.keys(), rata.values(), color="#2a7de1")
ax.set_ylabel("Rata-rata gaji"); ax.set_title("Rata-rata Gaji per Kota")
ax.set_ylim(0, max(rata.values()) * 1.2)  # JUJUR: dari 0!
print(f"Bar chart: {len(ax.patches)} batang, ylim dari 0 = jujur")

# 2. HISTOGRAM: sebaran
fig2, ax2 = plt.subplots()
ax2.hist(gaji / 1e6, bins=20, color="#e8a838", edgecolor="white")
ax2.set_xlabel("Gaji (juta)"); ax2.set_title("Sebaran Gaji")
print(f"Histogram: n={len(gaji)}, mean={gaji.mean()/1e6:.1f}jt")

# Coba: ganti bins=5 vs bins=50. Bagaimana bentuk berubah? (D9!)
`;
  const lab2Code = String.raw`
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(11)
n = 150
gaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)
dpd = rng.poisson(12, n) + (gaji < 7_000_000).astype(int) * rng.poisson(20, n)
kota = rng.choice(["Jakarta", "Bandung", "Surabaya"], n)

# SCATTER
fig, ax = plt.subplots()
ax.scatter(gaji / 1e6, dpd, alpha=0.5, c="#2a7de1")
ax.set_xlabel("Gaji (juta)"); ax.set_ylabel("DPD")
ax.set_title("Gaji vs DPD")
kor = np.corrcoef(gaji, dpd)[0, 1]
print(f"Korelasi gaji-dpd: {kor:.2f}")

# BOXPLOT per kota
fig2, ax2 = plt.subplots()
data_kota = [gaji[kota == k] / 1e6 for k in ["Jakarta", "Bandung", "Surabaya"]]
ax2.boxplot(data_kota, labels=["Jakarta", "Bandung", "Surabaya"])
ax2.set_ylabel("Gaji (juta)"); ax2.set_title("Sebaran Gaji per Kota")
print("Boxplot: median/garis tengah, box=IQR, titik=outlier")

# Coba: korelasi negatif — apa artinya bisnis? (hati-hati korelasi vs kausal!)
`;
  const quizData = [{"question": "Bar chart yang jujur…", "options": ["Sumbu Y dari nilai min", "Sumbu Y dari 0", "3D", "Tanpa label"], "correct": 1, "explanation": "Benar: panjang batang ∝ nilai — hanya benar jika dari 0."}, {"question": "Pie chart sebaiknya…", "options": ["10+ slice", "Maks 3–4 slice, atau pakai bar", "3D", "Tanpa label %"], "correct": 1, "explanation": "Benar: manusia buruk membandingkan sudut."}, {"question": "Untuk tren waktu…", "options": ["Bar", "Line", "Pie", "Scatter"], "correct": 1, "explanation": "Benar: kontinu = line."}, {"question": "hue di seaborn untuk…", "options": ["Ukuran titik", "Dimensi ke-3 via warna", "Judul", "Sumbu Y"], "correct": 1, "explanation": "Benar: warna per grup."}, {"question": "Melihat chart orang: cek pertama…", "options": ["Warna", "Sumbu (skala, dari mana)", "Judul", "Font"], "correct": 1, "explanation": "Benar: 5 detik cek sumbu menyelamatkan dari manipulasi."}, {"question": "Maks dimensi per chart…", "options": ["10", "3–4 (lebih = pecah)", "1", "Tidak terbatas"], "correct": 1, "explanation": "Benar: lebih = pecah jadi beberapa chart."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D8 — Python (Part 1)</span>
        <h1 className="display-title">Visualisasi: Memilih Chart<br/>yang Jujur (matplotlib)</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Chart yang 'Membuktikan' Kenaikan 300%</a></li>
          <li><a href="#pilih">Memilih Chart — Pertanyaan Dulu, Chart Kemudian</a></li>
          <li><a href="#jujur">Kejujuran Visual — 4 Dosa</a></li>
          <li><a href="#grammar">Grammar of Graphics — Struktur Berpikir</a></li>
          <li><a href="#lab1">🔬 Lab 1: Chart yang Tepat</a></li>
          <li><a href="#lab2">🔬 Lab 2: Scatter + Boxplot</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Chart</a></li>
          <li><a href="#case">📋 Mini-Case: Slide yang Menipu</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Memilih <strong>chart yang tepat</strong> untuk tiap pertanyaan (bar/line/hist/scatter/box).</li><li>Membuat plot dasar dengan <strong>matplotlib</strong>.</li><li>Menghindari <strong>chart yang menipu</strong> (sumbu terpotong, 3D, pie berlebihan).</li><li>Menerapkan <strong>grammar of graphics</strong> (data → aesthetic → geometri).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Chart yang 'Membuktikan' Kenaikan 300%</h2>

      <div className="story"><p>Slide presentasi: bar chart menunjukkan penjualan &ldquo;naik 300%&rdquo; — batang kedua 4× lebih tinggi. Faktanya: dari 100 ke 115 (<strong>naik 15%</strong>). Triknya? Sumbu Y dimulai dari 90, bukan 0.</p><p>Visualisasi = <em>bahasa</em> analis — dan seperti bahasa, bisa jujur atau menipu. Part 1: memilih chart + matplotlib + kejujuran visual. (Catatan: lab di browser mencetak data &amp; info figure — render grafik penuh di Colab/lokal dengan <code className="inline">plt.show()</code>.)</p><p><strong>Twist-nya:</strong> &ldquo;naik 300%&rdquo; dari chart vs &ldquo;naik 15%&rdquo; dari angka — keduanya &ldquo;benar&rdquo; secara data, tapi chart-nya berbohong lewat sumbu Y yang dimulai dari 90. Visualisasi menipu bukan dengan data palsu — melainkan dengan framing yang jujur-secara-teknis. Yang perlu dilatih bukan matamu — melainkan <em>kecurigaanmu pada sumbu</em>.</p></div>

      <h2 id="pilih">Memilih Chart — Pertanyaan Dulu, Chart Kemudian</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Pertanyaan</th><th>Chart</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td>Perbandingan kategori</td><td>Bar</td><td>Nasabah per kota</td></tr>
<tr><td>Tren waktu</td><td>Line</td><td>Transaksi harian</td></tr>
<tr><td>Distribusi</td><td>Histogram</td><td>Sebaran gaji</td></tr>
<tr><td>Hubungan 2 variabel</td><td>Scatter</td><td>Gaji vs DPD</td></tr>
<tr><td>Sebaran per grup</td><td>Boxplot</td><td>Gaji per kota</td></tr>
<tr><td>Komposisi</td><td>Stacked bar (bukan pie!)</td><td>Pangsa kategori</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import matplotlib.pyplot as plt

# bar: perbandingan
plt.bar(kota, jumlah)
plt.xlabel(&#x27;Kota&#x27;); plt.ylabel(&#x27;Nasabah&#x27;)
plt.title(&#x27;Nasabah per Kota&#x27;)
# plt.show()  # di Colab/lokal
print(&#x27;figure dibuat:&#x27;, plt.gcf().number)</pre>

      <ul>
<li><strong>Aturan emas:</strong> 1 pertanyaan = 1 chart. Chart yang mencoba jawab 3 hal = menjawab 0.</li>
<li><strong>Pie chart:</strong> manusia buruk membandingkan sudut — maksimal 3–4 slice, atau pakai bar!</li>
<li><strong>Line untuk waktu</strong> (kontinu); <strong>bar untuk kategori</strong> (diskret) — tertukar = menyesatkan.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Sebelum plot, tulis 1 kalimat: 'chart ini menjawab ___'. Jika tak bisa — jangan plot dulu, pikirkan dulu.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Chart bagus = chart indah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Chart bagus = <strong>jujur + jelas</strong>. Gradien 3D, animasi, warna-warni = <em>chartjunk</em> (Tufte) yang mengaburkan. Analis senior: chart sederhana yang tak bisa disalahartikan.</p>
</div>

      <h2 id="jujur">Kejujuran Visual — 4 Dosa</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Dosa</th><th>Contoh</th><th>Obat</th></tr></thead>
<tbody>
<tr><td>Sumbu terpotong</td><td>Y dari 90 → 'naik 300%'</td><td>Bar chart: Y dari 0!</td></tr>
<tr><td>Skala ganda menyesatkan</td><td>2 sumbu tak sebanding</td><td>Satu sumbu / panel terpisah</td></tr>
<tr><td>3D</td><td>Batang 3D = volume menipu</td><td>2D selalu</td></tr>
<tr><td>Cherry-picking</td><td>Hanya tampil periode bagus</td><td>Tampil penuh + konteks</td></tr>
</tbody>
</table>
</div>

      <p><strong>Pengecualian sumbu-0:</strong> line chart <em>boleh</em> tidak dari 0 (tren, bukan perbandingan absolut) — tapi <strong>nyatakan eksplisit</strong>. Bar chart: selalu dari 0 (panjang batang = nilai!).</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># JUJUR: bar dari 0
plt.bar([&#x27;A&#x27;, &#x27;B&#x27;], [100, 115])
plt.ylim(0, 130)  # eksplisit dari 0
# bandingkan: plt.ylim(90, 120) -&gt; MENIPU (dosa!)</pre>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Memotong sumbu selalu menipu.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tergantung chart! <strong>Bar</strong>: ya, menipu (panjang ∝ nilai). <strong>Line</strong>: tidak selalu (yang penting <em>perubahan</em>) — tapi harus jelas & bukan untuk membesar-besarkan. Konteks menentukan.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Uji kejujuran: 'jika saya tunjukkan ke orang awam 5 detik, kesimpulan apa yang diambil?' Jika beda dari data → perbaiki chart.</p>
</div>

      <h2 id="grammar">Grammar of Graphics — Struktur Berpikir</h2>

      <p><strong>Konsep</strong> (dari ggplot2/seaborn): plot = <strong>data</strong> + <strong>aesthetic</strong> (x, y, warna) + <strong>geometri</strong> (bar/line/titik):</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import seaborn as sns
# data + aesthetic + geometri dalam 1 baris!
# sns.barplot(data=df, x=&#x27;kota&#x27;, y=&#x27;penghasilan&#x27;, hue=&#x27;status&#x27;)
# hue = warna per grup (dimensi ke-3!)
print(&#x27;pola: sns.&lt;geometri&gt;(data=df, x=..., y=..., hue=...)&#x27;)</pre>

      <ul>
<li><strong>hue</strong> (warna) = dimensi ke-3 — 'per kota, per status'.</li>
<li><strong>facet</strong> (subplot per grup) = dimensi ke-4 — untuk banyak grup.</li>
<li><strong>Aturan:</strong> maksimal 3–4 dimensi per chart. Lebih = pecah jadi beberapa chart.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> seaborn = matplotlib yang 'pintar' (statistik built-in: CI, regresi). Untuk eksplorasi cepat: seaborn. Untuk kustom penuh: matplotlib.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Dosa #1: Sumbu Terpotong (data sama!)"
  layout={{"grid": {"rows": 1, "columns": 2}, "yaxis": {"title": "Y dari 0", "range": [0, 130]}, "yaxis2": {"title": "Y dari 90", "range": [90, 120]}, "showlegend": false, "annotations": [{"x": 0.22, "y": 1.05, "xref": "paper", "yref": "paper", "text": "Naik 15% (jujur)", "showarrow": false}, {"x": 0.78, "y": 1.05, "xref": "paper", "yref": "paper", "text": "Terlihat 4× lipat! (menipu)", "showarrow": false}]}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kiri: sumbu dari 0. Kanan: sumbu dari 90 — data IDENTIK.</p>
<p><strong>Interpretasi:</strong> Data sama, kesan beda total. <strong>Bar chart wajib dari 0.</strong> Saat baca chart orang lain: <em>selalu cek sumbu dulu</em> — 5 detik yang menyelamatkan dari manipulasi.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Chart = argumen visual; buat yang jujur.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Sumbu Y — 300% vs 15%</summary>
              <p>Penjualan: 100 → 115. Buat versi &ldquo;menipu&rdquo; dan versi &ldquo;jujur&rdquo;. Apa bedanya secara kode?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import matplotlib.pyplot as plt
      x = [&#x27;2025&#x27;, &#x27;2026&#x27;]; y = [100, 115]
      # MENIPU: batang kedua terlihat 4x (padahal +15%!)
      plt.bar(x, y); plt.ylim(90, 120); plt.title(&#x27;Naik 300%!!&#x27;)
      # JUJUR: proporsi terlihat benar
      plt.bar(x, y); plt.ylim(0, 130); plt.title(&#x27;Naik 15% (100 -&gt; 115)&#x27;)</pre>
              <p><strong>Bedah:</strong> satu baris <code className="inline">ylim(90, 120)</code> mengubah +15% jadi terlihat +300%. Bar chart <em>wajib</em> mulai dari 0 (panjang batang = nilai!). Line chart boleh tidak dari 0 (yang penting <em>perubahan</em>), tapi harus dinyatakan eksplisit. Selalu curigai sumbu sebelum percaya chart.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Pilih chart — distribusi gaji</summary>
              <p>1.000 gaji, miring kanan. Bar chart rata-rata per kota vs histogram — mana yang menjawab &ldquo;berapa % di bawah 10jt&rdquo;?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import matplotlib.pyplot as plt
      # Bar chart rata-rata: MENYEMBUNYIKAN distribusi (twist C3!)
      # Histogram: menunjukkan bentuk
      plt.hist(gaji, bins=30)
      plt.axvline(10_000_000, color=&#x27;red&#x27;, linestyle=&#x27;--&#x27;)
      plt.text(10_000_000, 50, &#x27;batas 10jt&#x27;)
      # Jawaban = luas kiri garis merah / total = (gaji &lt; 10_000_000).mean()</pre>
              <p><strong>Bedah:</strong> pertanyaan &ldquo;berapa %&rdquo; = pertanyaan <em>distribusi</em> → histogram, bukan bar rata-rata. Aturan pilih chart: 1 variabel kontinu → histogram; 2 kontinu → scatter; kategori vs angka → bar; waktu → line. Pertanyaan dulu, chart kemudian.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Dual axis — jebakan klasik</summary>
              <p>Plot &ldquo;transaksi (jt) vs NPL (%)&rdquo; dua sumbu. Mengapa berbahaya? Apa alternatifnya?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># BERBAHAYA: dua skala bebas -&gt; korelasi bisa &quot;dibuat&quot;
      # dengan menggeser salah satu sumbu!
      # ALTERNATIF 1: dua panel bertumpuk (share x)
      fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True)
      ax1.plot(t, transaksi); ax2.plot(t, npl)
      # ALTERNATIF 2: standarisasi dulu (z-score), satu sumbu</pre>
              <p><strong>Bedah:</strong> dual axis = dua penggaris berbeda di satu gambar — pembaca tidak bisa tahu mana yang &ldquo;sebanding&rdquo;. Alternatif jujur: panel bertumpuk (pola sama terlihat tanpa skala menipu) atau normalisasi ke %/z-score. Jika terpaksa dual axis: beri warna sumbu sesuai garisnya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Chart yang Tepat</h2>

      <p>Data: gaji per kota. Buat <strong>bar chart</strong> (rata-rata gaji per kota) + <strong>histogram</strong> (sebaran gaji). Di browser: cetak info figure; di Colab: plt.show().</p>

      <PyodideLab
  title="Lab 1 — Pilih &amp; Buat"
  hint="Uji dosa: buat versi menipu (ylim dari 8jt) — rasakan bedanya!"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Scatter + Boxplot</h2>

      <p>Scatter: gaji vs dpd (apakah berhubungan?). Boxplot: gaji per kota (bandingkan sebaran!).</p>

      <PyodideLab
  title="Lab 2 — Hubungan &amp; Sebaran per Grup"
  hint="Tambahkan garis tren: np.polyfit untuk regresi linear sederhana (intip D11!)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Chart</h2>

      <div className="decision-card">
<h3>1. Banding kategori → <strong>bar</strong> (Y dari 0!)</h3>
<p><strong>Kondisi data:</strong> Diskret.</p>
<p><strong>Kenapa:</strong> Panjang ∝ nilai.</p>
<p><strong>Contoh nyata:</strong> Nasabah per kota.</p>
</div>

      <div className="decision-card">
<h3>2. Tren waktu → <strong>line</strong></h3>
<p><strong>Kondisi data:</strong> Kontinu.</p>
<p><strong>Kenapa:</strong> Perubahan, bukan absolut.</p>
<p><strong>Contoh nyata:</strong> Transaksi harian.</p>
</div>

      <div className="decision-card">
<h3>3. Distribusi → <strong>histogram/boxplot</strong></h3>
<p><strong>Kondisi data:</strong> Sebaran.</p>
<p><strong>Kenapa:</strong> Bentuk, skew, outlier.</p>
<p><strong>Contoh nyata:</strong> Sebaran gaji.</p>
</div>

      <div className="decision-card">
<h3>4. Hubungan → <strong>scatter</strong></h3>
<p><strong>Kondisi data:</strong> Korelasi.</p>
<p><strong>Kenapa:</strong> Pola + outlier bivariat.</p>
<p><strong>Contoh nyata:</strong> Gaji vs DPD.</p>
</div>

      <div className="decision-card">
<h3>5. Komposisi → <strong>stacked bar</strong></h3>
<p><strong>Kondisi data:</strong> Pangsa.</p>
<p><strong>Kenapa:</strong> Pie maks 3–4 slice.</p>
<p><strong>Contoh nyata:</strong> Pangsa kategori.</p>
</div>

      <div className="decision-card">
<h3>6. Ragu → <strong>tulis kalimat pertanyaan</strong></h3>
<p><strong>Kondisi data:</strong> Klarifikasi.</p>
<p><strong>Kenapa:</strong> 1 pertanyaan = 1 chart.</p>
<p><strong>Contoh nyata:</strong> 'Chart ini menjawab ___.'</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Pertanyaan dulu, chart kemudian.</li><li>Bar: Y dari 0. Line: boleh tidak (nyatakan!).</li><li>Maks 3–4 dimensi; pie maks 3–4 slice.</li><li>Cek sumbu dulu saat baca chart orang.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Slide yang Menipu</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Tim marketing presentasi: bar chart 'konversi naik 300%' (2% → 8%). Kamu curiga.</p><p><strong>Tugas:</strong> (1) Apa yang (mungkin) salah dari chart? (2) Buat versi jujur. (3) Tulis <strong>komentar diplomatik</strong> 2 kalimat untuk presenter.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> Kemungkinan: sumbu Y dari 1.5% (bukan 0) → batang 8% terlihat 13× batang 2%. Padahal naik 6pp (poin persentase), bukan 300% secara visual proporsional.</p><p><strong>(2)</strong> Bar dari 0 + label 'naik 6pp (4× lipat)' — <em>jujur tapi tetap positif</em>.</p><p><strong>(3)</strong> 'Kenaikannya memang signifikan — 4× lipat! Saran kecil: mulai sumbu dari 0 agar audiens langsung percaya tanpa perlu cek ulang. Angkanya sudah cukup kuat.'</p><p><strong>Pelajaran:</strong> koreksi chart = <strong>diplomasi</strong>. Jangan tuduh menipu; tawarkan versi yang <em>lebih meyakinkan</em>. Kejujuran + taktik.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Pie chart 12 kategori — apa masalahnya? Apa alternatifnya?</li>
              <li>Kapan <em>boleh</em> sumbu Y tidak dari 0? Beri 1 contoh + syaratnya.</li>
              <li>Tulis 2 baris: scatter gaji vs dpd + garis tren sederhana.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> 12 slice tidak terbaca (mata tidak akurat membandingkan sudut!). Alternatif: <strong>bar horizontal terurut</strong> — perbandingan panjang jauh lebih akurat. Pie maksimal 3–4 kategori, itupun bar biasanya lebih baik.</p>
              <p><strong>2.</strong> <strong>Line chart</strong> untuk perubahan kecil yang penting (mis. suhu 36,5→37,2°C — mulai dari 0 menyembunyikan variasinya). Syarat: <em>nyatakan eksplisit</em> (&ldquo;sumbu tidak dari 0&rdquo;) dan jangan dipakai untuk bar chart.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 3.
      plt.scatter(df.gaji, df.dpd, alpha=0.3)
      plt.plot(df.gaji, np.poly1d(np.polyfit(df.gaji, df.dpd, 1))(df.gaji),
               color=&#x27;red&#x27;)  # tren linear; alpha=0.3 atasi overplotting</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Pilih:</strong> bar (kategori), line (waktu), hist/box (distribusi), scatter (hubungan).</li><li><strong>Jujur:</strong> bar dari 0; 2D; konteks penuh; nyatakan pengecualian.</li><li><strong>Grammar:</strong> data + aesthetic (x/y/hue) + geometri.</li><li><strong>seaborn</strong> untuk cepat; <strong>matplotlib</strong> untuk kustom.</li><li>1 pertanyaan = 1 chart.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d7-datetime-timeseries" className="btn btn-secondary btn-sm">← ← D7</Link>
        <Link href="/learn/d8-visualisasi-2" className="btn btn-primary btn-sm">Next: D8-2 →</Link>
      </div>
    </div>
  );
}

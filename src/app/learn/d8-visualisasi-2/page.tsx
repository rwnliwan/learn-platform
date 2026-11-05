import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D8Visualisasi2Page() {
  const chart1 = [{"x": ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"], "y": [100, 105, 180, 110, 108, 112], "type": "scatter", "mode": "lines+markers", "name": "Transaksi", "line": {"color": "#2a7de1", "width": 3}}];
  const lab1Code = String.raw`
import json
# plotly mungkin belum ada di env ini — siapkan data dulu, plot di Colab
# (di browser Pyodide: await micropip.install("plotly"))

data = {
    "kota": ["Jakarta", "Bandung", "Surabaya", "Medan"],
    "n": [4, 2, 2, 2],
    "npl": [0.02, 0.05, 0.03, 0.08],
}

# Struktur figure plotly (bisa dicek tanpa render!)
fig_dict = {
    "data": [{"type": "bar", "x": data["kota"], "y": data["n"], "name": "Nasabah"}],
    "layout": {"title": "Nasabah per Kota"},
}
print(json.dumps(fig_dict, indent=1)[:300])

# Kode untuk Colab (copy-paste!):
kode_colab = "\n".join([
    "import plotly.express as px",
    "import pandas as pd",
    "df = pd.DataFrame(" + repr(data) + ")",
    'fig = px.bar(df, x="kota", y="n", color="npl",',
    '             title="Nasabah per Kota (warna=NPL)",',
    '             color_continuous_scale="RdYlGn_r")',
    "fig.show()",
])
print("\n=== KODE COLAB (copy-paste) ===")
print(kode_colab)

# Coba: apa beda px.bar vs go.Bar? (kapan pindah ke go?)
`;
  const lab2Code = String.raw`
# RANCANGAN (tulis kode px-nya di Colab!):

dashboard = [
    {"chart": "line", "judul": "NPL naik 0.5pp dalam 3 bulan",
     "kode": "px.line(df, x='bulan', y='npl', title='NPL naik 0.5pp dalam 3 bulan')"},
    {"chart": "bar", "judul": "Bucket 31-60 menumpuk: collection kurang agresif",
     "kode": "px.bar(bucket, x='bucket', y='exposure', title='...')"},
    {"chart": "scatter", "judul": "Vintage Jul-25 konsisten terburuk",
     "kode": "px.scatter(vintage, x='mob', y='npl', color='vintage', title='...')"},
]

for i, d in enumerate(dashboard, 1):
    print(f"{i}. [{d['chart']}] {d['judul']}")
    print(f"   {d['kode']}\n")

print("Narasi: masalah (1) -> lokasi (2) -> penyebab (3) = cerita lengkap")
# Coba: susun ulang urutan — apakah cerita tetap masuk akal?
`;
  const quizData = [{"question": "Plotly express vs graph_objects…", "options": ["Sama", "px = cepat 1 baris; go = kustom penuh", "go lebih cepat", "px hanya bar"], "correct": 1, "explanation": "Benar: mulai px, pindah go saat kurang."}, {"question": "Untuk laporan PDF…", "options": ["Plotly interaktif", "Statis (matplotlib/PNG)", "Tidak pakai chart", "GIF"], "correct": 1, "explanation": "Benar: medium menentukan — interaktif tak tercetak."}, {"question": "1 juta titik di scatter…", "options": ["Plot semua", "Agregat/binning dulu", "Tidak bisa", "Pakai pie"], "correct": 1, "explanation": "Benar: lambat + tak terbaca. Chart = ringkasan."}, {"question": "Judul chart yang baik…", "options": ["'Grafik 1'", "'NPL naik 0.5pp dalam 3 bulan' (kesimpulan)", "'NPL per kuartal'", "Tanpa judul"], "correct": 1, "explanation": "Benar: judul = insight, bukan deskripsi."}, {"question": "Hover/zoom berguna untuk…", "options": ["Keindahan", "Drill-down: jawab 'angka aneh' di tempat", "Kecepatan", "Tidak ada"], "correct": 1, "explanation": "Benar: investigasi langsung."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D8 — Python (Part 2)</span>
        <h1 className="display-title">Plotly: Chart Interaktif<br/>untuk Dashboard</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 'Angka Aneh di Bulan Maret'</a></li>
          <li><a href="#express">Plotly Express — 1 Baris, Interaktif</a></li>
          <li><a href="#go">Graph Objects — Kontrol Penuh</a></li>
          <li><a href="#kapan">Statis vs Interaktif — Pilih Medan</a></li>
          <li><a href="#dashboard">Dashboard Mini — Multi-Chart</a></li>
          <li><a href="#lab1">🔬 Lab 1: Express dalam 1 Baris</a></li>
          <li><a href="#lab2">🔬 Lab 2: Dashboard Narasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Interaktif</a></li>
          <li><a href="#case">📋 Mini-Case: 'Angka Aneh di Maret'</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Membuat chart <strong>interaktif</strong> dengan plotly (hover, zoom).</li><li>Membedakan <strong>plotly express</strong> vs <strong>graph_objects</strong>.</li><li>Memilih kapan <strong>statis vs interaktif</strong>.</li><li>Menyusun <strong>dashboard mini</strong> multi-chart.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 'Angka Aneh di Bulan Maret'</h2>

      <div className="story"><p>Direksi menunjuk chart statis: <em>&ldquo;Ada lonjakan di Maret — transaksi apa itu?&rdquo;</em> Kamu tidak bisa jawab — chart statis tidak bisa di-zoom, tidak ada detail per titik.</p><p><strong>Plotly</strong> = chart interaktif: hover untuk detail, zoom untuk investigasi, filter untuk eksplorasi. Untuk dashboard &amp; presentasi ke direksi, interaktif = <em>jawaban langsung</em>, bukan 'saya cek dulu'. Part 2: plotly.</p><p><strong>Twist-nya:</strong> chart statis yang &ldquo;bagus&rdquo; ternyata tidak bisa menjawab pertanyaan direksi (&ldquo;lonjakan Maret itu transaksi apa?&rdquo;). Chart yang indah tapi tidak bisa diinterogasi = poster, bukan alat analisis. Interaktivitas bukan pemanis — ia perbedaan antara &ldquo;melihat&rdquo; dan &ldquo;menyelidiki&rdquo;. Pertanyaan terbaik selalu datang <em>setelah</em> chart ditampilkan.</p></div>

      <h2 id="express">Plotly Express — 1 Baris, Interaktif</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import plotly.express as px

# 1 baris = chart interaktif!
fig = px.bar(df, x=&#x27;kota&#x27;, y=&#x27;n&#x27;, color=&#x27;status&#x27;,
              title=&#x27;Nasabah per Kota per Status&#x27;)
# fig.show()  # di Colab/lokal
print(&#x27;chart interaktif: hover, zoom, pan aktif&#x27;)</pre>

      <ul>
<li><strong>px.bar/line/scatter/histogram/box</strong> = 1 baris per chart.</li>
<li><strong>color=</strong> = hue (dimensi ke-3); <strong>facet_col=</strong> = subplot per grup.</li>
<li><strong>Interaktif otomatis:</strong> hover detail, zoom, pan, toggle legend.</li>
<li><strong>Export:</strong> <code className="inline">fig.write_html('chart.html')</code> — kirim ke siapa saja!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola tercepat: <code className="inline">px.histogram(df, x='gaji')</code> untuk eksplorasi — 5 detik dari data ke chart interaktif. Untuk EDA (D9), ini senjata utama.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Plotly hanya untuk web.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Plotly juga untuk <em>analisis</em>: di Jupyter, chart interaktif mempercepat EDA (hover outlier langsung tahu nilainya!). Dan <code className="inline">write_html</code> = laporan mandiri tanpa server.</p>
</div>

      <h2 id="go">Graph Objects — Kontrol Penuh</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Bar(x=kota, y=n, name=&#x27;Nasabah&#x27;))
fig.add_trace(go.Scatter(x=kota, y=rata, name=&#x27;Rata2&#x27;, yaxis=&#x27;y2&#x27;))
fig.update_layout(title=&#x27;Dua Metrik&#x27;, yaxis2=dict(overlaying=&#x27;y&#x27;, side=&#x27;right&#x27;))
print(&#x27;go = rakit manual: tiap trace + layout dikontrol&#x27;)</pre>

      <ul>
<li><strong>Express</strong> = cepat (90% kasus); <strong>Graph Objects</strong> = kustom (dual-axis, annotasi kompleks).</li>
<li><strong>Aturan:</strong> mulai dengan px; pindah ke go saat px tak cukup.</li>
<li><strong>update_layout:</strong> judul, sumbu, tema, ukuran — finalisasi.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Dual-axis (2 sumbu Y) = berguna tapi berbahaya (skala ganda menipu — D8-1!). Pakai hanya jika hubungan kedua metrik yang penting, dan <strong>nyatakan jelas</strong>.</p>
</div>

      <h2 id="kapan">Statis vs Interaktif — Pilih Medan</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>Statis (matplotlib)</th><th>Interaktif (plotly)</th></tr></thead>
<tbody>
<tr><td>Kapan</td><td>Laporan PDF, paper, slide cetak</td><td>Dashboard, Jupyter, HTML</td></tr>
<tr><td>Kelebihan</td><td>Ringan, presisi piksel</td><td>Eksplorasi, hover, zoom</td></tr>
<tr><td>Kekurangan</td><td>Tak bisa drill-down</td><td>Berat untuk 1jt+ titik</td></tr>
<tr><td>Aturan</td><td>Final & cetak</td><td>Eksplorasi & presentasi live</td></tr>
</tbody>
</table>
</div>

      <p><strong>Untuk 1jt+ titik:</strong> agregat dulu! (resample/binning) — plot 1 juta titik = lambat <em>dan</em> tak terbaca. Chart = ringkasan, bukan dump data.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Interaktif selalu lebih baik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Untuk laporan PDF/paper yang dicetak = statis. Untuk email = PNG statis (tak semua email render HTML). <strong>Medium menentukan</strong>: tanya 'di mana ini dibaca?' sebelum pilih.</p>
</div>

      <h2 id="dashboard">Dashboard Mini — Multi-Chart</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from plotly.subplots import make_subplots

fig = make_subplots(rows=2, cols=1, subplot_titles=(&#x27;Tren&#x27;, &#x27;Sebaran&#x27;))
fig.add_trace(go.Scatter(x=tgl, y=nilai, name=&#x27;Tren&#x27;), row=1, col=1)
fig.add_trace(go.Histogram(x=gaji, name=&#x27;Sebaran&#x27;), row=2, col=1)
fig.update_layout(height=600, title=&#x27;Dashboard Mini&#x27;)
print(&#x27;2 chart, 1 figure: narasi vertikal&#x27;)</pre>

      <ul>
<li><strong>Narasi:</strong> susun chart sebagai <em>cerita</em> (konteks → detail → aksi), bukan tumpukan acak.</li>
<li><strong>Aturan dashboard:</strong> 4–6 chart maks per layar; tiap chart 1 pesan; judul = kesimpulan (<em>'NPL naik di Q3'</em> bukan <em>'NPL per kuartal'</em>).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Judul sebagai kesimpulan = teknik presentasi ampuh. Bandingkan: 'Transaksi per bulan' vs 'Transaksi turun 20% sejak Juni' — yang kedua <em>langsung</em> memberi insight.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Lonjakan Maret: Hover untuk Detail (coba!)"
  layout={{"xaxis": {"title": "Bulan"}, "yaxis": {"title": "Indeks"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Arahkan kursor ke titik Maret — nilai detail muncul (hover).</p>
<p><strong>Interpretasi:</strong> Inilah keunggulan interaktif: <strong>pertanyaan direksi terjawab di tempat</strong> (hover = nilai + konteks). Chart di lesson ini memakai Plotly — <em>itulah</em> yang kamu pelajari!</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Interaktif = bisa diinterogasi.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Hover — jawab &ldquo;lonjakan Maret itu apa?&rdquo;</summary>
              <p>Direksi menunjuk lonjakan Maret. Dengan plotly, hover langsung menunjukkan rinciannya.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import plotly.express as px
      fig = px.line(df, x=&#x27;tanggal&#x27;, y=&#x27;total&#x27;, color=&#x27;kota&#x27;,
                    hover_data=&#123;&#x27;total&#x27;: &#x27;:,.0f&#x27;, &#x27;n_transaksi&#x27;: True&#125;,
                    title=&#x27;Transaksi harian per kota&#x27;)
      fig.show()  # hover tiap titik: tanggal, kota, total, n_transaksi</pre>
              <p><strong>Bedah:</strong> <code className="inline">hover_data</code> = kolom tambahan saat hover; <code className="inline">&#x27;:,.0f&#x27;</code> = format ribuan. Satu baris <code className="inline">px.line</code> = interaktif penuh (zoom, pan, toggle kota via legenda). Pertanyaan direksi terjawab <em>saat itu juga</em> — bukan &ldquo;saya cek dulu&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Zoom — dari tren tahunan ke anomali harian</summary>
              <p>Tren 2026 terlihat mulus. Zoom ke Maret: ada 1 hari 10× normal. Bagaimana menemukannya?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import plotly.express as px
      fig = px.line(harian, x=&#x27;tanggal&#x27;, y=&#x27;total&#x27;)
      fig.update_layout(xaxis=&#123;&#x27;rangeslider&#x27;: &#123;&#x27;visible&#x27;: True&#125;&#125;)
      fig.show()
      # Drag rangeslider ke Maret -&gt; 15 Mar melonjak: cek barisnya:
      print(harian.nlargest(3, &#x27;total&#x27;))</pre>
              <p><strong>Bedah:</strong> rangeslider = &ldquo;zoom waktu&rdquo; bawaan. Pola investigasi: lihat tren → zoom ke anomali → <code className="inline">nlargest</code> untuk barisnya → drill ke transaksi. Chart interaktif = <em>alat investigasi</em>, bukan sekadar gambar.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Facet — bandingkan 10 kota sekaligus</summary>
              <p>10 kota, 1 chart = spaghetti. Solusi: small multiples.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import plotly.express as px
      fig = px.line(df, x=&#x27;tanggal&#x27;, y=&#x27;total&#x27;,
                    facet_col=&#x27;kota&#x27;, facet_col_wrap=5,
                    title=&#x27;Tren per kota&#x27;)
      fig.show()  # 10 panel kecil: pola tiap kota langsung terbaca</pre>
              <p><strong>Bedah:</strong> <code className="inline">facet_col_wrap=5</code> = 2 baris × 5 kolom. Otak membandingkan panel sejajar jauh lebih akurat daripada 10 garis bertumpuk. Aturan: &gt; 5 seri dalam 1 chart → facet. &ldquo;Spaghetti chart&rdquo; = chart yang menyerah.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Express dalam 1 Baris</h2>

      <p>Buat px.bar + px.line dari data inline. Di browser: verifikasi struktur figure (data, layout); di Colab: fig.show().</p>

      <PyodideLab
  title="Lab 1 — Chart Interaktif Pertama"
  hint="Eksperimen di Colab: tambahkan hover_data=['npl'] — apa yang berubah saat hover?"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Dashboard Narasi</h2>

      <p>Rancang dashboard 3-chart untuk 'kesehatan kredit': pilih chart + tulis judul-sebagai-kesimpulan untuk tiap chart.</p>

      <PyodideLab
  title="Lab 2 — Rancang Dashboard"
  hint="Tantangan: tambahkan chart ke-4 'rekomendasi' — chart apa yang menunjukkan aksi?"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Interaktif</h2>

      <div className="decision-card">
<h3>1. Eksplorasi cepat → <strong>px 1 baris</strong></h3>
<p><strong>Kondisi data:</strong> EDA.</p>
<p><strong>Kenapa:</strong> 5 detik ke chart interaktif.</p>
<p><strong>Contoh nyata:</strong> px.histogram(df, x='gaji').</p>
</div>

      <div className="decision-card">
<h3>2. Butuh kustom → <strong>graph_objects</strong></h3>
<p><strong>Kondisi data:</strong> Kontrol.</p>
<p><strong>Kenapa:</strong> Trace + layout manual.</p>
<p><strong>Contoh nyata:</strong> Dual-axis, annotasi.</p>
</div>

      <div className="decision-card">
<h3>3. Dashboard → <strong>subplots + narasi</strong></h3>
<p><strong>Kondisi data:</strong> Cerita.</p>
<p><strong>Kenapa:</strong> 4–6 chart; judul = kesimpulan.</p>
<p><strong>Contoh nyata:</strong> Kesehatan kredit.</p>
</div>

      <div className="decision-card">
<h3>4. Kirim/share → <strong>write_html</strong></h3>
<p><strong>Kondisi data:</strong> Mandiri.</p>
<p><strong>Kenapa:</strong> HTML tanpa server.</p>
<p><strong>Contoh nyata:</strong> Laporan interaktif.</p>
</div>

      <div className="decision-card">
<h3>5. Medium cetak/PDF → <strong>statis</strong></h3>
<p><strong>Kondisi data:</strong> Tepat medium.</p>
<p><strong>Kenapa:</strong> Interaktif tak tercetak.</p>
<p><strong>Contoh nyata:</strong> Paper, slide cetak.</p>
</div>

      <div className="decision-card">
<h3>6. Data besar → <strong>agregat dulu</strong></h3>
<p><strong>Kondisi data:</strong> Performa.</p>
<p><strong>Kenapa:</strong> 1jt titik = lambat + tak terbaca.</p>
<p><strong>Contoh nyata:</strong> Resample/binning.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Mulai px; pindah go saat kurang.</li><li>Judul = kesimpulan, bukan deskripsi.</li><li>Medium menentukan: interaktif untuk live, statis untuk cetak.</li><li>Agregat sebelum plot data besar.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: 'Angka Aneh di Maret'</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Direksi tunjuk lonjakan Maret di chart statis. Kamu buka versi plotly, hover: ternyata <strong>1 transaksi korporat Rp 80M</strong> (bukan tren!).</p><p><strong>Tugas:</strong> (1) Chart apa yang membedakan 'lonjakan 1 transaksi' vs 'tren naik'? (2) Tulis kode px-nya. (3) Apa tindak lanjutnya?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> Bar per transaksi di Maret (bukan agregat!) — atau boxplot/scatter: 1 titik jauh di atas = outlier tunggal vs semua naik = tren.</p><p><strong>(2)</strong> <code className="inline">px.bar(df_maret, x='id', y='jumlah', hover_data=['nasabah'])</code> — hover langsung tahu siapa.</p><p><strong>(3)</strong> Keluarkan outlier dari analisis tren (catat!), investigasi terpisah. <strong>Pelajaran:</strong> agregat menyembunyikan; drill-down mengungkap. Interaktif = <em>kecepatan</em> dari curiga ke paham.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Kapan memakai <code className="inline">px.bar</code> vs <code className="inline">go.Figure</code> + <code className="inline">add_trace</code>? (Cepat vs kontrol.)</li>
              <li>Chart interaktif dengan 2 juta titik menjadi lambat. Sebutkan 2 solusi.</li>
              <li>Tulis 1 baris: histogram interaktif penghasilan berwarna per kota.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <code className="inline">px</code> (express): 1 baris untuk 90% kebutuhan — cepat. <code className="inline">go</code> (graph objects): kontrol penuh (dual axis, anotasi kustom, subplot campuran) — untuk 10% yang rumit. Mulai dari px, turun ke go saat mentok.</p>
              <p><strong>2.</strong> (a) <strong>Agregasi dulu</strong>: plot rata-rata per hari (365 titik), bukan 2 juta titik — mata tidak bisa bedakan juga. (b) <strong>Sampling</strong>: 50rb titik acak untuk scatter. Prinsip: plot = komunikasi, bukan dump data.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 3.
      px.histogram(df, x=&#x27;penghasilan&#x27;, color=&#x27;kota&#x27;, nbins=30,
                   barmode=&#x27;overlay&#x27;)</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>px</strong> = 1 baris interaktif; <strong>go</strong> = kustom penuh.</li><li><strong>Interaktif:</strong> hover/zoom = drill-down cepat; write_html untuk share.</li><li><strong>Medium menentukan:</strong> live → interaktif; cetak → statis.</li><li><strong>Dashboard:</strong> 4–6 chart, narasi, judul = kesimpulan.</li><li><strong>Agregat</strong> sebelum plot data besar.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d8-visualisasi-1" className="btn btn-secondary btn-sm">← ← D8-1</Link>
        <Link href="/learn/d9-eda" className="btn btn-primary btn-sm">Next: D9 →</Link>
      </div>
    </div>
  );
}

import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D7DatetimeTimeseriesPage() {
  const chart1 = [{"x": ["2026-09-01", "2026-09-05", "2026-09-10", "2026-09-15", "2026-09-20", "2026-09-25"], "y": [500000, 75000, 2000000, 1200000, 80000, 400000], "type": "bar", "name": "Harian", "marker": {"color": "#94a3b8"}}, {"x": ["2026-09-01", "2026-09-05", "2026-09-10", "2026-09-15", "2026-09-20", "2026-09-25"], "y": [500000, 287500, 858333, 1091666, 828000, 736000], "type": "scatter", "mode": "lines+markers", "name": "MA-3", "line": {"color": "#2a7de1", "width": 3}}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, io

csv = """tanggal,jumlah
2026-09-01,500000
2026-09-02,300000
2026-09-03,250000
2026-09-05,75000
2026-09-08,150000
2026-09-10,2000000
2026-09-12,500000
2026-09-15,1200000"""
df = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])
ts = df.set_index("tanggal").sort_index()["jumlah"]

print("=== Per minggu ==="); print(ts.resample("W").sum())
print("\n=== MA-3 ==="); print(ts.rolling(3).mean().round(0))
print("\n=== Pertumbuhan ==="); print((ts.pct_change() * 100).round(1))

# Coba: tanggal 04, 06, 07 hilang — resample mengisi 0? (asfreq!)
print("\n=== Harian kontinu ==="); print(ts.resample("D").sum().head(8))
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, io

csv = """tanggal,jumlah
2026-09-01,500000
2026-09-02,300000
2026-09-03,250000
2026-09-05,75000
2026-09-10,2000000
2026-09-12,500000
2026-09-15,1200000"""
df = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])
df = df.sort_values("tanggal")

# BOCOR: MA termasuk hari ini
df["ma_bocor"] = df["jumlah"].rolling(3).mean()
df["sinyal_bocor"] = df["jumlah"] > df["ma_bocor"]

# AMAN: hanya data masa lalu
df["ma_aman"] = df["jumlah"].shift(1).rolling(3).mean()
df["sinyal_aman"] = df["jumlah"] > df["ma_aman"]

print(df[["tanggal", "jumlah", "sinyal_bocor", "sinyal_aman"]])
beda = (df["sinyal_bocor"] != df["sinyal_aman"]).sum()
print(f"\nBeda sinyal: {beda} dari {len(df)} hari")

# Coba: di hari 2026-09-10 (lonjakan 2jt), sinyal_bocor vs aman?
`;
  const quizData = [{"question": "df[df.tanggal.dt.month == 8]…", "options": ["Benar untuk Agustus 2026", "Salah: campur semua Agustus semua tahun!", "Error", "Kosong"], "correct": 1, "explanation": "Benar: pakai period YYYY-MM atau rentang eksplisit."}, {"question": "resample butuh…", "options": ["Tidak ada syarat", "DatetimeIndex (set_index + sort)", "Kolom string", "GroupBy dulu"], "correct": 1, "explanation": "Benar: index harus datetime terurut."}, {"question": "Sinyal 'di atas MA-7' yang benar (anti lookahead)…", "options": ["rolling(7).mean()", "shift(1).rolling(7).mean()", "expanding().mean()", "rolling(7, center=True).mean()"], "correct": 1, "explanation": "Benar: hanya masa lalu. center=True justru bocor!"}, {"question": "tz_localize vs tz_convert…", "options": ["Sama", "localize=pasang zona (naive), convert=ubah zona", "convert lebih cepat", "localize menghapus zona"], "correct": 1, "explanation": "Benar: pasang dulu, baru ubah."}, {"question": "pct_change() = …", "options": ["Selisih absolut", "(baru-lama)/lama — pertumbuhan", "Rata-rata", "Akumulasi"], "correct": 1, "explanation": "Benar: growth rate 1 baris."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D7 — Python</span>
        <h1 className="display-title">Datetime &amp; Time Series:<br/>Waktu sebagai Data</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 'Bulan Lalu' yang Salah</a></li>
          <li><a href="#dt">.dt Accessor — Bedah Waktu</a></li>
          <li><a href="#resample">resample — GROUP BY Waktu</a></li>
          <li><a href="#tz">Timezone — Simpan UTC, Tampil Lokal</a></li>
          <li><a href="#lookahead">Lookahead — Dosa Time Series</a></li>
          <li><a href="#lab1">🔬 Lab 1: Resample & Rolling</a></li>
          <li><a href="#lab2">🔬 Lab 2: Sinyal Tanpa Lookahead</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Waktu</a></li>
          <li><a href="#case">📋 Mini-Case: Laporan 'Bulan Lalu' yang Salah</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Memakai <strong>datetime64</strong>: akses komponen (.dt), aritmetika, resample.</li><li>Menangani <strong>timezone</strong> dengan benar.</li><li>Menghitung <strong>rolling</strong> (moving average) &amp; <strong>shift</strong> (lag).</li><li>Menjelaskan jebakan <strong>lookahead</strong> di time series.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 'Bulan Lalu' yang Salah</h2>

      <div className="story"><p>Analis menghitung &ldquo;transaksi bulan lalu&rdquo; dengan <code className="inline">df[df.tanggal.dt.month == 8]</code> — hasilnya <strong>mencampur Agustus 2025 dan 2026</strong>! Laporan salah, tidak ada yang sadar 2 minggu.</p><p>Waktu = dimensi paling menipu: zona, format, bulan-tanpa-tahun, hari libur. pandas punya alat lengkap — lesson ini memastikan kamu memakainya dengan benar.</p><p><strong>Twist-nya:</strong> <code>df.tanggal.dt.month == 8</code> terlihat benar — dan selama 2 minggu tidak ada yang sadar ia salah. Bug waktu adalah bug yang paling lama bersembunyi, <em>karena hasilnya masuk akal</em> (angka-angka Agustus — hanya tahunnya campur). Waktu tidak memaafkan asumsi; ia hanya menunggu momen paling memalukan untuk terbongkar.</p></div>

      <h2 id="dt">.dt Accessor — Bedah Waktu</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">df[&#x27;tanggal&#x27;] = pd.to_datetime(df[&#x27;tanggal&#x27;])

df[&#x27;tahun&#x27;] = df[&#x27;tanggal&#x27;].dt.year
df[&#x27;bulan&#x27;] = df[&#x27;tanggal&#x27;].dt.to_period(&#x27;M&#x27;)  # 2026-09 (tahun+bulan!)
df[&#x27;hari&#x27;] = df[&#x27;tanggal&#x27;].dt.day_name()
df[&#x27;is_weekend&#x27;] = df[&#x27;tanggal&#x27;].dt.dayofweek &gt;= 5

# aritmetika: selisih -&gt; Timedelta
df[&#x27;umur_hari&#x27;] = (pd.Timestamp(&#x27;2026-10-01&#x27;) - df[&#x27;tanggal&#x27;]).dt.days</pre>

      <ul>
<li><strong>.dt</strong> = accessor komponen (year/month/day/hour/dayofweek...).</li>
<li><strong>to_period('M')</strong> = tahun-bulan (hindari jebakan 'bulan saja'!).</li>
<li><strong>Timedelta:</strong> selisih waktu; <code className="inline">.dt.days</code> untuk angka.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Filter bulan cukup dengan .dt.month.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Jebakan di cerita! <code className="inline">.dt.month == 8</code> = semua Agustus <em>semua tahun</em>. Pakai <strong>period</strong> (<code className="inline">dt.to_period('M')</code>) atau rentang tanggal eksplisit.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Untuk 'bulan ini vs bulan lalu': <code className="inline">df[df['tanggal'].dt.to_period('M') == '2026-09']</code> — period bisa dibandingkan dengan string 'YYYY-MM'!</p>
</div>

      <h2 id="resample">resample — GROUP BY Waktu</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">ts = df.set_index(&#x27;tanggal&#x27;).sort_index()

# agregat per hari / minggu / bulan
print(ts[&#x27;jumlah&#x27;].resample(&#x27;D&#x27;).sum())   # D=hari
print(ts[&#x27;jumlah&#x27;].resample(&#x27;W&#x27;).sum())   # W=minggu
print(ts[&#x27;jumlah&#x27;].resample(&#x27;ME&#x27;).sum()) # ME=akhir bulan

# rolling 7 hari (moving average!)
print(ts[&#x27;jumlah&#x27;].rolling(7).mean())

# lag 1 hari (LAG-nya pandas!)
print(ts[&#x27;jumlah&#x27;].shift(1))</pre>

      <ul>
<li><strong>resample:</strong> butuh DatetimeIndex! 'D'/'W'/'ME'/'QE'/'YE'.</li>
<li><strong>rolling(n):</strong> jendela bergerak (MA-n) — seperti window frame SQL (C9!).</li>
<li><strong>shift(n):</strong> geser (lag/lead) — untuk pertumbuhan.</li>
<li><strong>Pertumbuhan:</strong> <code className="inline">ts['jumlah'].pct_change()</code> = (baru-lama)/lama!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola laporan: <code className="inline">resample('ME').sum()</code> → <code className="inline">pct_change(12)</code> = YoY bulanan. 2 baris = analisis tahunan!</p>
</div>

      <h2 id="tz">Timezone — Simpan UTC, Tampil Lokal</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># buat sadar-zona
jakarta = df[&#x27;tanggal&#x27;].dt.tz_localize(&#x27;Asia/Jakarta&#x27;)
# konversi
utc = jakarta.dt.tz_convert(&#x27;UTC&#x27;)

# jika sudah ada zona tapi campur: normalisasi dulu!</pre>

      <ul>
<li><strong>tz_localize:</strong> pasang zona (untuk naive); <strong>tz_convert:</strong> ubah zona.</li>
<li><strong>Aturan:</strong> simpan UTC, konversi saat tampil (C4!).</li>
<li><strong>Bahaya:</strong> campur naive + aware = error! Samakan dulu.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Timezone tidak penting untuk data domestik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Server UTC + user WIB = selisih 7 jam! 'Transaksi hari ini' bisa salah hari. Bahkan domestik: <em>selalu</em> eksplisit tentang zona.</p>
</div>

      <h2 id="lookahead">Lookahead — Dosa Time Series</h2>

      <p><strong>Lookahead bias:</strong> memakai info <em>masa depan</em> untuk keputusan <em>masa lalu</em> — hasil backtest fantastis, live hancur.</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># SALAH: rolling mencakup hari ini (bocor!)
df[&#x27;ma7&#x27;] = df[&#x27;jumlah&#x27;].rolling(7).mean()

# BENAR: hanya masa lalu
signal = df[&#x27;jumlah&#x27;].shift(1).rolling(7).mean()

# BENAR: expanding (hanya yang sudah diketahui)
df[&#x27;rata_sd_ini&#x27;] = df[&#x27;jumlah&#x27;].expanding().mean()</pre>

      <ul>
<li><strong>Aturan:</strong> fitur untuk prediksi hari-T <em>hanya</em> boleh dari data &lt; T.</li>
<li><strong>shift(1)</strong> sebelum rolling = pola aman standar.</li>
<li><strong>expanding:</strong> semua histori hingga kini (tanpa bocor).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tanya selalu: 'apakah nilai ini sudah diketahui <em>saat keputusan dibuat</em>?' Jika tidak → lookahead → hasil menipu. (E16: jebakan backtest!)</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Lookahead hanya masalah trading.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Kredit juga! 'DPD 90 hari' sebagai fitur untuk prediksi <em>saat pencairan</em> = lookahead (belum terjadi!). Fitur harus <strong>point-in-time</strong>: yang diketahui saat observasi.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Harian vs Moving Average 3 (data lab)"
  layout={{"yaxis": {"title": "Rupiah"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Abu-abu = harian (berisik); biru = rata-rata 3 transaksi terakhir.</p>
<p><strong>Interpretasi:</strong> MA menghaluskan noise — tren terlihat. <strong>Tapi:</strong> MA-3 di titik awal hanya dari 1–2 data (tak stabil); dan MA 'terpusat' akan bocor (lookahead!). Pilih jendela sesuai tujuan.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Waktu = dimensi paling menipu.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Bug Agustus — bulan tanpa tahun</summary>
              <p><code className="inline">df[df.tanggal.dt.month == 8]</code> mencampur Agu 2025 &amp; 2026. Tulis yang benar + buktinya.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      # SALAH: df[df.tanggal.dt.month == 8]  -&gt; 2 tahun tercampur!
      # BENAR: periode eksplisit
      mask = (df.tanggal &gt;= &#x27;2026-08-01&#x27;) &amp; (df.tanggal &lt; &#x27;2026-09-01&#x27;)
      print(df[mask].tanggal.dt.year.unique())  # -&gt; [2026] saja. Terbukti.
      # Alternatif: pakai period
      df[df.tanggal.dt.to_period(&#x27;M&#x27;) == &#x27;2026-08&#x27;]</pre>
              <p><strong>Bedah:</strong> <code className="inline">.dt.month</code> membuang tahun — seperti GROUP BY bulan tanpa tahun (C3!). Aturan: filter waktu = rentang eksplisit (setengah terbuka, pola C4!) atau period <code className="inline">YYYY-MM</code>. Tidak pernah komponen tunggal.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: resample — transaksi per minggu</summary>
              <p>Dari transaksi harian (tidak beraturan), hitung total mingguan + jumlah hari aktif per minggu.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">df = df.set_index(&#x27;tanggal&#x27;).sort_index()
      mingguan = df.resample(&#x27;W&#x27;).agg(
          total=( &#x27;nominal&#x27;, &#x27;sum&#x27;),
          hari_aktif=(&#x27;nominal&#x27;, &#x27;count&#x27;))
      print(mingguan.head(3))
      # Catatan: minggu tanpa transaksi -&gt; total 0 (bukan NaN!) jika pakai sum;
      # hari_aktif = 0 menandainya. Bedakan &quot;tidak ada transaksi&quot; (0)
      # dari &quot;data hilang&quot; (NaN)!</pre>
              <p><strong>Bedah:</strong> <code className="inline">resample(&#x27;W&#x27;)</code> = GROUP BY minggu versi waktu. Butuh DatetimeIndex (<code className="inline">set_index</code> dulu!). Label minggu = hari terakhir (default). Untuk &ldquo;minggu kalender Sen–Min&rdquo;, pakai <code className="inline">&#x27;W-MON&#x27;</code>.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Lookahead — dosa yang terlihat menguntungkan</summary>
              <p>Fitur &ldquo;rata-rata 7 hari&rdquo; untuk prediksi besok. Tulis yang <em>salah</em> (bocor) dan yang benar.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># SALAH (lookahead): memakai hari ini &amp; masa depan relatif terhadap target
      df[&#x27;ma7_bocor&#x27;] = df[&#x27;nominal&#x27;].rolling(7, center=True).mean()
      # BENAR: hanya masa lalu (shift!)
      df[&#x27;ma7_benar&#x27;] = df[&#x27;nominal&#x27;].rolling(7).mean().shift(1)
      # Validasi: untuk prediksi t+1, fitur di t hanya boleh pakai data &lt;= t.</pre>
              <p><strong>Bedah:</strong> <code className="inline">center=True</code> memakai 3 hari <em>ke depan</em> — di backtest terlihat akurat, di live hancur (data masa depan belum ada!). <code className="inline">.shift(1)</code> = &ldquo;fitur kemarin untuk prediksi hari ini&rdquo;. Aturan emas time series: <strong>tidak ada informasi dari masa depan</strong> — pernah.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Resample & Rolling</h2>

      <p>Data transaksi harian. Resample per minggu (sum), hitung MA-3, dan pertumbuhan harian (pct_change).</p>

      <PyodideLab
  title="Lab 1 — Agregat Waktu"
  hint="Perhatikan: resample('D') mengisi tanggal hilang dengan 0 (sum) — beda dengan forward-fill. Kapan pakai mana?"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Sinyal Tanpa Lookahead</h2>

      <p>Bangun sinyal 'di atas MA-3': versi BOCOR (tanpa shift) vs AMAN (shift 1). Bandingkan — kapan mereka beda?</p>

      <PyodideLab
  title="Lab 2 — MA Aman vs Bocor"
  hint="Renungkan: backtest dengan sinyal_bocor akan terlihat 'akurat' — kenapa menipu?"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Waktu</h2>

      <div className="decision-card">
<h3>1. Komponen waktu → <strong>.dt</strong></h3>
<p><strong>Kondisi data:</strong> Bedah.</p>
<p><strong>Kenapa:</strong> year/month/dayofweek; period untuk YYYY-MM.</p>
<p><strong>Contoh nyata:</strong> df.tanggal.dt.to_period('M').</p>
</div>

      <div className="decision-card">
<h3>2. Agregat per periode → <strong>resample</strong></h3>
<p><strong>Kondisi data:</strong> GROUP BY waktu.</p>
<p><strong>Kenapa:</strong> Butuh DatetimeIndex; D/W/ME/QE.</p>
<p><strong>Contoh nyata:</strong> Penjualan bulanan.</p>
</div>

      <div className="decision-card">
<h3>3. Rata-rata bergerak → <strong>rolling</strong></h3>
<p><strong>Kondisi data:</strong> Haluskan.</p>
<p><strong>Kenapa:</strong> Jendela n; waspadai tepi.</p>
<p><strong>Contoh nyata:</strong> MA-7.</p>
</div>

      <div className="decision-card">
<h3>4. Banding periode lalu → <strong>shift / pct_change</strong></h3>
<p><strong>Kondisi data:</strong> Lag.</p>
<p><strong>Kenapa:</strong> shift(1) = kemarin; pct_change = growth.</p>
<p><strong>Contoh nyata:</strong> MoM.</p>
</div>

      <div className="decision-card">
<h3>5. Zona → <strong>localize/convert</strong></h3>
<p><strong>Kondisi data:</strong> Eksplisit.</p>
<p><strong>Kenapa:</strong> Simpan UTC; tampil lokal.</p>
<p><strong>Contoh nyata:</strong> Asia/Jakarta.</p>
</div>

      <div className="decision-card">
<h3>6. Fitur prediksi → <strong>cek lookahead</strong></h3>
<p><strong>Kondisi data:</strong> Jujur.</p>
<p><strong>Kenapa:</strong> Hanya data &lt; T; shift(1) pola aman.</p>
<p><strong>Contoh nyata:</strong> Sinyal MA.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Bulan = <strong>period</strong>, bukan .dt.month saja.</li><li>resample butuh DatetimeIndex + sort.</li><li>Fitur prediksi: shift(1) dulu — anti lookahead.</li><li>Zona: eksplisit selalu.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Laporan 'Bulan Lalu' yang Salah</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Laporan 'Agustus' ternyata mencampur 2025+2026. Atasan minta perbaikan + jaminan tak terulang.</p><p><strong>Tugas:</strong> (1) Tulis filter yang benar (3 cara!). (2) Rancang <strong>assert</strong> otomatis: 'data hanya 1 bulan'. (3) Tulis penjelasan 3 kalimat untuk atasan.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> <code className="inline">df[df.tanggal.dt.to_period('M')=='2026-08']</code>; atau <code className="inline">(df.tanggal&gt;='2026-08-01')&(df.tanggal&lt;'2026-09-01')</code>; atau <code className="inline">df.set_index('tanggal').loc['2026-08']</code> (slice string parsial!).</p><p><strong>(2)</strong> <code className="inline">assert df['tanggal'].dt.to_period('M').nunique() == 1</code> — gagalkan pipeline jika campur!</p><p><strong>(3)</strong> 'Filter bulan tanpa tahun mencampur dua tahun. Sudah diperbaiki dengan filter tahun-bulan eksplisit + automated check. Angka terkoreksi terlampir.'</p><p><strong>Pelajaran:</strong> bug waktu = bug diam-diam. <strong>Assert</strong> = vaksinnya.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Data UTC, tampilkan dalam WIB untuk laporan. Tulis 2 baris (<code className="inline">tz_localize</code> vs <code className="inline">tz_convert</code> — kapan masing-masing?).</li>
              <li><code className="inline">df.resample(&#x27;M&#x27;)</code> vs <code className="inline">df.resample(&#x27;MS&#x27;)</code> — apa beda labelnya? Kapan penting?</li>
              <li>Jelaskan mengapa <code className="inline">train_test_split</code> acak <em>berbahaya</em> untuk time series. Apa penggantinya?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1.
      s_utc = pd.to_datetime(s).dt.tz_localize(&#x27;UTC&#x27;)   # naive -&gt; sadar (diberi label)
      s_wib = s_utc.dt.tz_convert(&#x27;Asia/Jakarta&#x27;)       # sadar -&gt; zona lain
      # localize: &quot;angka ini SEBENARNYA UTC&quot;; convert: &quot;tampilkan di zona lain&quot;.
      # 2. &#x27;M&#x27; = akhir bulan (31 Jan); &#x27;MS&#x27; = awal bulan (1 Jan).
      # Penting saat join dengan data bulanan lain -&gt; label harus sama!</pre>
              <p><strong>3.</strong> Split acak mencampur masa depan ke train &amp; masa lalu ke test → model &ldquo;belajar dari masa depan&rdquo; (lookahead!) → performa palsu. Pengganti: <strong>time-based split</strong> (train = periode awal, test = periode akhir) atau <code className="inline">TimeSeriesSplit</code>.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>.dt:</strong> komponen waktu; <strong>period</strong> untuk YYYY-MM.</li><li><strong>resample</strong> (agregat waktu), <strong>rolling</strong> (MA), <strong>shift/pct_change</strong> (lag/growth).</li><li><strong>Timezone:</strong> localize → convert; simpan UTC.</li><li><strong>Lookahead:</strong> fitur hanya dari masa lalu — shift(1) pola aman.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d6-wrangling" className="btn btn-secondary btn-sm">← ← D6</Link>
        <Link href="/learn/d8-visualisasi-1" className="btn btn-primary btn-sm">Next: D8-1 →</Link>
      </div>
    </div>
  );
}

"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk15ForecastingPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK15 — Marketing Data Analytics</span>
        <h1 className="display-title">Forecasting:<br/>Meramal Penjualan Tanpa Kristal Ajaib</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Lebaran yang Kehabisan Stok (Lagi)</a></li>
<li><a href="#dekomposisi">Trend, Musiman, Holiday</a></li>
<li><a href="#metode">Metode Forecasting</a></li>
<li><a href="#evaluasi">Evaluasi & Hierarki</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Melihat Masa Depan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Lebaran SegarMart</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#panduan">📚 Panduan Lengkap Forecasting: Dari Nol ke Produksi</a></li>
<li><a href="#kisahforecast">📖 Kisah Nyata: Forecast yang Menyelamatkan Lebaran</a></li>
<li><a href="#kisahgagal">📖 Kisah Nyata: Ketika Forecast Gagal Total</a></li>
<li><a href="#tambahan-hw">📐 Worked Example: Holt-Winters Manual</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Distributor LancJaya</a></li>
<li><a href="#tambahan-faq">❓ FAQ Forecasting</a></li>
<li><a href="#tambahan-newsvendor">📈 Pendalaman: Forecast → Keputusan Stok</a></li>
<li><a href="#tambahan-target">🔬 Pendalaman: Forecast vs Target</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menguraikan time series menjadi trend, musiman, dan holiday effect.</li>
<li>Menjelaskan dan menerapkan seasonal naive, moving average, dan Holt-Winters.</li>
<li>Menghitung WAPE & bias dan menjelaskan kenapa MAPE bisa menipu.</li>
<li>Menjelaskan forecasting hierarki dan kenapa rekonsiliasi dibutuhkan.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Lebaran yang Kehabisan Stok (Lagi)</h2>
      <div className="story">
        <p>Retailer <em>&ldquo;SegarMart&rdquo;</em> setiap Lebaran kehabisan stok sirup &mdash; dan setiap tahun setelahnya <strong>kelebihan</strong> stok (dibeli panik berlebihan). Model forecasting mereka: <strong>rata-rata 12 bulan terakhir</strong>. Kedengarannya masuk akal.</p>
<p>Twist-nya: rata-rata 12 bulan <strong>menghancurkan musiman</strong> — puncak Lebaran (5x normal) dirata-ratakan dengan bulan sepi, menghasilkan angka yang salah untuk <em>semua</em> bulan (kekurangan saat Lebaran, kelebihan saat sepi). Ditambah Lebaran <strong>bergeser</strong> tiap tahun (kalender Hijriah!) — model yang tidak tahu 'holiday effect' selalu salah 2–4 minggu. Lesson ini: meramal dengan menghormati pola waktu.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="dekomposisi">Dekomposisi — Tiga Penari dalam Satu Grafik</h2>
<p><strong>Definisi.</strong> Time series penjualan = <strong>trend</strong> (arah jangka panjang: naik/turun/datar) + <strong>musiman</strong> (pola berulang: mingguan/bulanan/tahunan) + <strong>holiday/event effect</strong> (Lebaran, Natal, 11.11 — <em>tidak</em> periodik tetap!) + <strong>noise</strong> (sisa). <strong>Dekomposisi</strong> memisahkan ketiganya — langkah pertama sebelum memilih model.</p>
<p>Jebakan Indonesia: <strong>Lebaran/Natal bergeser</strong> (Hijriah/Masehi) — musiman 'bulanan' murni gagal; butuh <strong>regressor holiday</strong> (variabel dummy/event). Juga <strong>efek kalender</strong>: jumlah hari kerja, weekend dalam bulan.</p>
<Tex math={String.raw`y_t = T_t + S_t + H_t + e_t`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`T_t`} />: trend — arah jangka panjang</li>
<li><Tex math={String.raw`S_t`} />: musiman — pola berulang (periode tetap)</li>
<li><Tex math={String.raw`H_t`} />: holiday/event — efek kalender bergeser (Lebaran, 11.11)</li>
<li><Tex math={String.raw`e_t`} />: noise — yang tidak bisa dijelaskan (target: kecil &amp; acak)</li>
<li>Model aditif (untuk musiman stabil) vs multiplikatif (musiman membesar seiring trend)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Dekomposisi seperti <strong>mengurai orkestra</strong>: biola (trend) main nada naik pelan, drum (musiman) memukul tiap 4 ketuk, simbal (holiday) menghantam sesekali tapi keras. Meramal tanpa mengurai = menebak lagu dari suara campur aduk.</p>
<p><strong>Kapan dipakai:</strong> Selalu langkah pertama. Plot data + dekomposisi sebelum memilih model apa pun.</p>
<details className="worked">
<summary>📐 Contoh: Kenapa rata-rata 12 bulan gagal (klik untuk buka)</summary>
<p>Sirup: 11 bulan @100, Lebaran @500. Rata-rata 12 bulan = (11×100 + 500)/12 = <strong>133</strong>.</p>
<p><strong>Ramalan rata-rata:</strong> tiap bulan 133 → Lebaran kurang 367 (kehabisan!), bulan biasa lebih 33 (menumpuk).</p>
<p><strong>Dekomposisi:</strong> baseline 100 + efek Lebaran +400 (hanya di bulan Lebaran, dengan dummy bergeser). Ramalan: 100 biasa, 500 saat Lebaran. <strong>Error turun 80%.</strong> Pelajaran: satu angka untuk pola musiman = salah untuk semua.</p>
</details>
<PlotlyChart
  data={[{x: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"], y: [100,95,105,500,110,100,95,105,100,110,120,150], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "aktual"}, {x: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"], y: [133,133,133,133,133,133,133,133,133,133,133,133], type: "scatter", mode: "lines", line: {dash: "dash", color: "#ef4444"}, name: "rata-rata 12 bln"}]}
  title={"Sirup: aktual vs ramalan rata-rata"}
  layout={{xaxis: {title: "Bulan"}, yaxis: {title: "Penjualan"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = aktual (dengan puncak Lebaran April), merah putus = ramalan rata-rata 133.</p>
<p><strong>Interpretasi:</strong> Garis merah salah di <strong>semua</strong> titik: terlalu tinggi 11 bulan (overstock), terlalu rendah saat Lebaran (stockout). Inilah 'rata-rata yang adil tapi salah total'. Solusi: model yang menghormati musiman + holiday bergeser.</p>
</div>
<h2 id="metode">Metode — Dari Naive hingga Holt-Winters</h2>
<p><strong>Definisi.</strong> <strong>Seasonal naive</strong>: ramalan = nilai periode yang sama tahun lalu (baseline yang kuat!). <strong>Moving average</strong>: rata-rata k periode terakhir (menghaluskan noise, tapi lag saat trend). <strong>Exponential smoothing (SES)</strong>: rata-rata berbobot eksponensial (data baru lebih berat). <strong>Holt-Winters</strong>: SES + trend + musiman — kuda kerja forecasting ritel.</p>
<p>Aturan: <strong>kalahkan seasonal naive dulu</strong> sebelum bangga dengan model canggih. Banyak model ML kalah dari seasonal naive di data musiman kuat.</p>
<Tex math={String.raw`\hat{y}_{t+1} = \alpha y_t + (1-\alpha)\hat{y}_t \quad;\quad 0 < \alpha < 1`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\hat{y}_{t+1}`} />: ramalan periode depan</li>
<li><Tex math={String.raw`\alpha`} />: bobot data terbaru (α besar = responsif tapi berisik; α kecil = halus tapi lag)</li>
<li><Tex math={String.raw`y_t`} />: aktual terakhir</li>
<li>Holt-Winters menambah komponen trend &amp; musiman dengan α, β, γ masing-masing</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Exponential smoothing seperti <strong>kemudi kapal</strong>: α besar = kemudi sensitif (bereaksi tiap ombak — mabuk), α kecil = kemudi berat (stabil tapi telat belok). Holt-Winters = kemudi + kompas (trend) + peta arus musiman.</p>
<p><strong>Kapan dipakai:</strong> Holt-Winters: data musiman jelas + trend. Seasonal naive: baseline wajib. ARIMA/ML: pola kompleks + data panjang (dengan validasi ketat).</p>
<details className="worked">
<summary>📐 Contoh: SES manual 3 langkah (klik untuk buka)</summary>
<p>Data: 100, 110, 105. α = 0,5. Ramalan awal ŷ1 = 100.</p>
<p><strong>Langkah 1:</strong> ŷ2 = 0,5×100 + 0,5×100 = 100. <strong>Langkah 2:</strong> ŷ3 = 0,5×110 + 0,5×100 = 105. <strong>Langkah 3:</strong> ŷ4 = 0,5×105 + 0,5×105 = 105.</p>
<p>Ramalan periode 4 = <strong>105</strong>. Perhatikan: SES 'belajar' — ramalan bergerak mengikuti data, dengan lag yang ditentukan α.</p>
</details>
<h2 id="evaluasi">Evaluasi & Hierarki — Salah yang Jujur, Angka yang Akur</h2>
<p><strong>Definisi.</strong> <strong>WAPE</strong> = Σ|aktual − ramalan| / Σ|aktual| (lebih stabil dari MAPE yang meledak saat aktual ≈ 0). <strong>Bias</strong> = rata-rata (ramalan − aktual): positif = over-forecast sistematis (overstock!), negatif = under (stockout). <strong>Hierarki</strong>: ramal di banyak level (SKU → kategori → total); <strong>rekonsiliasi</strong> memastikan jumlah SKU = total kategori (bottom-up, top-down, atau optimal).</p>
<p>Tanpa rekonsiliasi: total 100 SKU diramal 1.000, tapi kategori diramal 1.200 — gudang bingung pakai angka mana.</p>
<Tex math={String.raw`\text{WAPE} = \frac{\sum |y_t - \hat{y}_t|}{\sum |y_t|} \quad;\quad \text{Bias} = \frac{1}{n}\sum(\hat{y}_t - y_t)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>WAPE 10% = rata-rata error 10% dari total volume — bahasa yang dimengerti operasional</li>
<li>Bias +5% = ramalan sistematis ketinggian 5% (overstock kronis); bias −5% = stockout kronis</li>
<li>Target: WAPE kecil DAN bias ≈ 0 (akurat tapi bias = tetap salah arah)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> WAPE seperti <strong>nilai rapor</strong>, bias seperti <strong>kecenderungan</strong>: murid dengan nilai 70 tapi selalu melebih-lebihkan (bias +) = percaya diri palsu. Rekonsiliasi hierarki seperti <strong>anggaran keluarga</strong>: total belanja anak-anak harus sama dengan total anggaran — tidak bisa masing-masing mengarang.</p>
<p><strong>Kapan dipakai:</strong> Evaluasi: selalu WAPE + bias (bukan cuma satu). Hierarki: operasional multi-level (gudang butuh SKU, direksi butuh total).</p>
<details className="worked">
<summary>📐 Contoh: Bias yang mahal (klik untuk buka)</summary>
<p>Dua model, WAPE sama 12%. Model A bias +8% (selalu ketinggian), model B bias −1%.</p>
<p><strong>Biaya:</strong> over-forecast 8% × Rp10M stok = Rp800jt modal menganggur + risiko kadaluarsa. Under-forecast 1% = Rp100jt lost sales.</p>
<p><strong>Pilih B</strong> — WAPE sama, bias beda jauh. Pelajaran: jangan lapor akurasi tanpa bias. Dan bias bisa dikoreksi (kurangi 8%) — gratis!</p>
</details>
<PlotlyChart
  data={[{x: ["M1","M2","M3","M4","M5","M6"], y: [100,110,105,500,115,108], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "aktual"}, {x: ["M7","M8","M9"], y: [112,108,115], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "ramalan"}, {x: ["M7","M8","M9","M7","M8","M9"], y: [125,121,128,99,95,102], type: "scatter", mode: "lines", fill: "tonexty", fillcolor: "rgba(232,168,56,0.2)", line: {width: 0}, showlegend: false}]}
  title={"Ramalan + interval (contoh)"}
  layout={{xaxis: {title: "Bulan"}, yaxis: {title: "Penjualan"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = histori (dengan puncak), kuning = ramalan 3 bulan, pita = interval ketidakpastian.</p>
<p><strong>Interpretasi:</strong> Ramalan tanpa interval = janji palsu. Pita melebar seiring horizon — ketidakpastian tumbuh. Keputusan stok: pakai <strong>batas atas</strong> interval untuk item kritis (stockout mahal), <strong>tengah</strong> untuk biasa. Interval = bahasa kejujuran forecaster.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Melihat Masa Depan</h2>
<p><strong>Forecasting</strong> = &ldquo;berapa <strong>penjualan</strong> bulan depan?&rdquo; <strong>Bukan</strong> ramalan <strong>mistik</strong> — <strong>pola</strong> masa lalu + <strong>struktur</strong> (tren! musim!) + <strong>ketidakpastian</strong> (interval!). Tiga pendalaman: (1) dekomposisi; (2) Holt-Winters; (3) WAPE &amp; hierarki.</p>
<h3>1. Dekomposisi — Tiga Komponen Waktu</h3>
<p><strong>Setiap</strong> deret waktu = <strong>Tren</strong> (naik/turun <strong>jangka panjang</strong>!) + <strong>Musiman</strong> (pola <strong>berulang</strong>! Lebaran! akhir tahun!) + <strong>Residual</strong> (noise! <strong>tidak</strong> dijelaskan!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>mengurai</strong> benang kusut jadi <strong>tiga</strong> helai: <strong>tren</strong> = &ldquo;ke <strong>mana</strong> arahnya?&rdquo;, <strong>musiman</strong> = &ldquo;<strong>kapan</strong> naik-turunnya?&rdquo;, <strong>residual</strong> = &ldquo;yang <strong>tidak</strong> bisa dijelaskan&rdquo;. <strong>Pisahkan</strong> dulu, <strong>baru</strong> ramal!</p>
<p><strong>Aditif</strong> vs <strong>multiplikatif:</strong> <strong>aditif</strong> (Y = T + S + R!) jika <strong>musiman</strong> konstan (naik <strong>Rp1jt</strong> tiap Lebaran!). <strong>Multiplikatif</strong> (Y = T × S × R!) jika <strong>musiman</strong> proporsional (naik <strong>20%</strong> tiap Lebaran!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Langkah pertama</strong> setiap forecasting! <strong>Plot</strong> dekomposisi (<strong>lihat</strong> pola!). <strong>Pilih</strong> model sesuai <strong>komponen</strong>.</p>
<Tex math={String.raw`Y_t = T_t + S_t + R_t \quad \text{atau} \quad Y_t = T_t \times S_t \times R_t`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`Y_t`} /> = aktual; <Tex math={String.raw`T_t`} /> = tren; <Tex math={String.raw`S_t`} /> = musiman; <Tex math={String.raw`R_t`} /> = residual. <strong>Aditif</strong> (+) atau <strong>multiplikatif</strong> (×)!</p>
<details className="worked">
<summary>📐 Contoh 1: Dekomposisi penjualan (klik untuk buka)</summary>
<p><strong>Data:</strong> Jan Rp10jt, Feb Rp11jt, Mar Rp15jt (Lebaran!), Apr Rp11jt, Mei Rp12jt, Jun Rp16jt (Lebaran!).</p>
<p><strong>Tren:</strong> naik <strong>~Rp1jt/bulan</strong> (10→12!). <strong>Musiman:</strong> <strong>+Rp4jt</strong> saat Lebaran (Mar! Jun!). <strong>Residual:</strong> kecil (±Rp500rb!).</p>
<p><strong>Forecast Jul:</strong> tren (Rp13jt!) + musiman (Rp0! — <strong>bukan</strong> Lebaran!) = <strong>Rp13jt</strong>.</p>
<p><strong>Forecast</strong> Lebaran depan: tren (Rp16jt!) + musiman (+Rp4jt!) = <strong>Rp20jt</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>tanpa</strong> dekomposisi = &ldquo;rata-rata Rp12,5jt&rdquo; (<strong>salah</strong> untuk <strong>keduanya</strong>!). <strong>Dengan</strong> dekomposisi = <strong>tepat</strong>!</p>
</details>
<h3>2. Holt-Winters — Tiga Smoothing</h3>
<p><strong>Definisi.</strong> <strong>Exponential smoothing</strong> dengan <strong>tiga</strong> komponen: <strong>level</strong> (nilai <strong>saat ini</strong>!), <strong>tren</strong> (arah!), <strong>musiman</strong> (pola!). <strong>Setiap</strong> komponen = <strong>rata-rata tertimbang</strong> (data <strong>baru</strong> lebih <strong>berat</strong>!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>mengemudi</strong> dengan <strong>tiga</strong> kaca: <strong>level</strong> = &ldquo;di <strong>mana</strong> saya?&rdquo;, <strong>tren</strong> = &ldquo;ke <strong>mana</strong> arah saya?&rdquo;, <strong>musiman</strong> = &ldquo;<strong>kapan</strong> beloknya?&rdquo;. <strong>Tiga</strong> info = <strong>navigasi</strong> lengkap!</p>
<p><strong>Tiga parameter:</strong> <strong>α</strong> (level! — <strong>tinggi</strong> = <strong>responsif</strong>!), <strong>β</strong> (tren!), <strong>γ</strong> (musiman!). <strong>Optimasi:</strong> cari yang <strong>minim</strong> error (<strong>grid search</strong>!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Baseline</strong> yang <strong>kuat</strong>! <strong>Kalahkan</strong> dulu Holt-Winters sebelum <strong>klaim</strong> model canggih! (<strong>Banyak</strong> ML <strong>kalah</strong> dari Holt-Winters!).</p>
<Tex math={String.raw`L_t = \alpha Y_t + (1-\alpha)(L_{t-1} + T_{t-1})`} block />
<p><strong>Level:</strong> <Tex math={String.raw`L_t`} /> = level; <Tex math={String.raw`\alpha`} /> = bobot data <strong>baru</strong>; <Tex math={String.raw`Y_t`} /> = aktual. <strong>α=0,8</strong> = <strong>percaya</strong> data baru (<strong>responsif</strong>!). <strong>α=0,2</strong> = <strong>percaya</strong> histori (<strong>stabil</strong>!).</p>
<details className="worked">
<summary>📐 Contoh 2: Holt-Winters manual (klik untuk buka)</summary>
<p><strong>Data:</strong> Y1=100, Y2=110, Y3=105. α=0,5. L0=100, T0=5.</p>
<p><strong>t=1:</strong> L1 = 0,5×100 + 0,5×(100+5) = 50 + 52,5 = <strong>102,5</strong>. T1 = 0,3×(102,5−100) + 0,7×5 = 0,75 + 3,5 = <strong>4,25</strong> (β=0,3!).</p>
<p><strong>t=2:</strong> L2 = 0,5×110 + 0,5×(102,5+4,25) = 55 + 53,375 = <strong>108,375</strong>.</p>
<p><strong>Forecast t=4:</strong> L3 + T3 = <strong>~112</strong> (level + tren!).</p>
<p><strong>Pelajaran:</strong> <strong>manual</strong> = <strong>ribet</strong>. <strong>Praktik:</strong> pakai <strong>library</strong> (statsmodels!). <strong>Pahami</strong> intuisi, <strong>otomatisasi</strong> hitungan.</p>
</details>
<h3>3. WAPE &amp; Hierarki — Ukur dengan Benar</h3>
<p><strong>WAPE</strong> (Weighted Absolute Percentage Error) = Σ|aktual − forecast| / Σ|aktual|. <strong>Mengapa</strong> bukan MAPE? <strong>MAPE</strong> = <strong>rata-rata</strong> % error (dihukum <strong>berat</strong> jika aktual <strong>kecil</strong>! — <strong>bagi</strong> dengan <strong>nol</strong> = <strong>bencana</strong>!). <strong>WAPE</strong> = <strong>total</strong> error / <strong>total</strong> aktual (<strong>stabil</strong>!).</p>
<p><strong>Hierarki:</strong> forecast <strong>nasional</strong> = <strong>jumlah</strong> forecast <strong>regional</strong>? <strong>Harus</strong> konsisten! (<strong>Top-down:</strong> nasional → bagi ke regional!. <strong>Bottom-up:</strong> regional → jumlah ke nasional!. <strong>Rekonsiliasi:</strong> <strong>optimal</strong> keduanya!).</p>
<p><strong>Kepribadian:</strong> <strong>WAPE</strong> = &ldquo;dari <strong>Rp100M</strong> penjualan, <strong>berapa</strong> yang <strong>salah</strong> ramal?&rdquo; (<strong>langsung</strong> ke <strong>uang</strong>!). <strong>Hierarki</strong> = &ldquo;<strong>puzzle</strong> harus <strong>pas</strong>&rdquo; (nasional = <strong>jumlah</strong> daerah!).</p>
<p><strong>Kapan dipakai:</strong> <strong>WAPE</strong> untuk <strong>semua</strong> evaluasi! <strong>Hierarki</strong> untuk <strong>multi-level</strong> (nasional! regional! toko!).</p>
<Tex math={String.raw`\text{WAPE} = \frac{\sum |Y_t - \hat{Y}_t|}{\sum |Y_t|}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`Y_t`} /> = aktual; <Tex math={String.raw`\hat{Y}_t`} /> = forecast. <strong>WAPE 10%</strong> = &ldquo;salah <strong>Rp10jt</strong> dari <strong>Rp100jt</strong>&rdquo;. <strong>Intuitif</strong>!</p>
<details className="worked">
<summary>📐 Contoh 3: WAPE vs MAPE (klik untuk buka)</summary>
<p><strong>Data:</strong> aktual [100, 10, 1000], forecast [110, 15, 900].</p>
<p><strong>MAPE:</strong> (|10|/100 + |5|/10 + |100|/1000)/3 = (10% + 50% + 10%)/3 = <strong>23,3%</strong> (<strong>dihukum</strong> oleh <strong>kecil</strong> 10!).</p>
<p><strong>WAPE:</strong> (10+5+100)/(100+10+1000) = 115/1110 = <strong>10,4%</strong> (<strong>adil</strong>! — error <strong>kecil</strong> = <strong>bobot</strong> kecil!).</p>
<p><strong>Pelajaran:</strong> <strong>MAPE</strong> = <strong>tertipu</strong> oleh <strong>kecil</strong>. <strong>WAPE</strong> = <strong>jujur</strong>. <strong>Selalu</strong> WAPE!</p>
</details>
<PlotlyChart
  data={[{x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul (F)", "Agu (F)"], y: [10, 11, 15, 11, 12, 16, 13, 14], type: "scatter", mode: "lines+markers", name: "Aktual", line: {color: "#2a7de1", width: 3}}, {x: ["Jul (F)", "Agu (F)", "Sep (F)"], y: [13, 14, 18], type: "scatter", mode: "lines+markers", name: "Forecast", line: {dash: "dash", color: "#22c55e", width: 3}}]}
  title={"Dekomposisi: tren + musiman = forecast"}
  layout={{yaxis: {title: "Penjualan (Rp juta)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = <strong>aktual</strong> (naik! + <strong>lonjakan</strong> Lebaran!). Hijau putus-putus = <strong>forecast</strong>.</p>
<p><strong>Interpretasi:</strong> <strong>Tren</strong> naik (10→12!). <strong>Musiman</strong> +Rp4jt (Lebaran!). <strong>Forecast</strong> Sep (Lebaran!) = <strong>Rp18jt</strong> (tren 14 + musiman 4!). <strong>Tanpa</strong> musiman = <strong>Rp14jt</strong> (<strong>salah</strong> Rp4jt!).</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Model forecasting tercanggih (deep learning) pasti paling akurat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Di data musiman kuat, <strong>seasonal naive & Holt-Winters sering menang</strong> lawan ML — dengan 1% usaha. ML menang saat banyak regressor eksternal (harga, promo, cuaca) + data panjang. Aturan: kalahkan seasonal naive dulu; kompleksitas harus dibayar dengan WAPE yang jauh lebih baik di <em>backtest out-of-time</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Forecast = target penjualan. Ramalan 1.000 berarti tim harus jual 1.000.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Forecast = <strong>tebakan terbaik dunia tanpa intervensi</strong>; target = <strong>ambisi dengan intervensi</strong>. Mencampur keduanya merusak keduanya: tim 'memasak' forecast agar target tercapai. Pisahkan: forecast (data) → gap ke target → rencana aksi (marketing) untuk menutup gap.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Backtest out-of-time, bukan cross-validation acak.</strong> Time series tidak boleh diacak (leakage masa depan!). Uji: latih s.d. 2024, ramal 2025, bandingkan. Model yang bagus di CV acak tapi jeblok di backtest = overfit pada masa depan.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Holiday bergeser = regressor, bukan musiman.</strong> Lebaran, Imlek, Natal orthodoks: buat dummy 'H-7 s.d. H+7 Lebaran' tiap tahun mengikuti kalender aslinya. Model musiman bulanan murni akan selalu salah 2–4 minggu untuk ini.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Holt-Winters Sederhana From-Scratch</h2>
<p>Implementasi SES + trend (Holt) manual. Lihat ramalan mengikuti data dengan lag.</p>
<PyodideLab
  title={"Lab 1 — Holt From-Scratch"}
  hint={"Ubah ALPHA 0.5 → 0.9. Ramalan jadi 'gugup' mengikuti noise. Itulah tradeoff α."}
  defaultCode={"# Holt's linear trend (SES + trend) from scratch\ndata = [100, 110, 105, 115, 125, 120, 130, 140, 135, 150, 160, 155]\nALPHA, BETA = 0.5, 0.3  # ubah sesukamu\n\nlevel, trend = data[0], data[1] - data[0]\nramal = []\nfor y in data[1:]:\n    ramal.append(level + trend)\n    l_baru = ALPHA * y + (1 - ALPHA) * (level + trend)\n    trend = BETA * (l_baru - level) + (1 - BETA) * trend\n    level = l_baru\n\nprint(f\"{'t':>4} {'aktual':>8} {'ramalan':>8}  error\")\nfor i, (y, r) in enumerate(zip(data[1:], ramal), 2):\n    print(f\"{i:>4} {y:>8} {r:>8.1f}  {y-r:+.1f}\")\nprint(f\"\\nRamalan t+1: {level + trend:.1f}\")\nwape = sum(abs(y-r) for y, r in zip(data[1:], ramal)) / sum(data[1:])\nprint(f\"WAPE in-sample: {wape:.1%}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: WAPE & Bias: Dua Sisi Akurasi</h2>
<p>Bandingkan dua model dengan WAPE sama tapi bias beda — pilih yang benar.</p>
<PyodideLab
  title={"Lab 2 — WAPE vs Bias"}
  hint={"Ubah err_a menjadi [-0.08]*8 (under-forecast). Untuk produk yang stockout-nya mahal (obat), mana yang lebih buruk?"}
  defaultCode={"# Bandingkan model: WAPE mirip, bias beda\naktual = [100, 110, 105, 115, 120, 118, 125, 130]\n# A: murni bias +8% (selalu ketinggian) | B: noise acak +/-7% (tanpa bias)\nerr_a = [0.08]*8      # ubah jadi [-0.08]*8 untuk melihat under-forecast\nerr_b = [0.07, -0.07]*4\nmodel_a = [y*(1+e) for y, e in zip(aktual, err_a)]\nmodel_b = [y*(1+e) for y, e in zip(aktual, err_b)]\n\ndef wape(a, f): return sum(abs(x-y) for x, y in zip(a, f))/sum(a)\ndef bias(a, f): return sum(y-x for x, y in zip(a, f))/len(a)/ (sum(a)/len(a))\n\nfor nama, f in [(\"A\", model_a), (\"B\", model_b)]:\n    print(f\"Model {nama}: WAPE={wape(aktual,f):.1%}, bias={bias(aktual,f):+.1%}\")\nprint(\"\\nWAPE mirip (8% vs 7%), tapi A over-forecast sistematis +8% = overstock kronis.\")\nprint(\"B tanpa bias: kadang lebih, kadang kurang - rata-rata tepat.\")\nprint(\"Selalu lapor WAPE + bias, bukan satu angka!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh baseline cepat → <strong>Seasonal naive</strong></h3>
<p><strong>Kenapa:</strong> Satu baris, sering mengalahkan model rumit; benchmark wajib.</p>
<p><strong>Contoh nyata:</strong> Ramalan awal tiap SKU baru.</p>
</div>
<div className="decision-card">
<h3>2. Trend + musiman jelas, data 2+ tahun → <strong>Holt-Winters</strong></h3>
<p><strong>Kenapa:</strong> Kuda kerja ritel; interpretable; cepat.</p>
<p><strong>Contoh nyata:</strong> Forecast penjualan SegarMart.</p>
</div>
<div className="decision-card">
<h3>3. Banyak driver eksternal (harga, promo, cuaca) → <strong>Regresi dinamis / ML + backtest ketat</strong></h3>
<p><strong>Kenapa:</strong> Menangkap efek yang tidak ada di histori murni.</p>
<p><strong>Contoh nyata:</strong> Es krim (cuaca), fashion (promo).</p>
</div>
<div className="decision-card">
<h3>4. Multi-level (SKU → kategori → total) → <strong>Hierarki + rekonsiliasi</strong></h3>
<p><strong>Kenapa:</strong> Angka harus akur antar level keputusan.</p>
<p><strong>Contoh nyata:</strong> Gudang (SKU) vs direksi (total).</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Dekomposisi dulu</strong> (plot!).</li><li><strong>Kalahkan seasonal naive</strong> sebelum bangga.</li><li><strong>Lapor WAPE + bias</strong>, bukan satu angka.</li><li><strong>Backtest out-of-time</strong> — jangan acak.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Stok Habis Saat Lebaran</h3>
<p>Retail &ldquo;MakmurJaya&rdquo;: forecast = <strong>rata-rata</strong> 12 bulan (Rp12jt/bulan!). <strong>Lebaran:</strong> butuh <strong>Rp20jt</strong>! <strong>Hasil:</strong> <strong>stok habis</strong> hari ke-3! <strong>Kehilangan</strong> Rp8jt!</p>
<p><strong>Solusi:</strong> <strong>dekomposisi</strong> (musiman +Rp8jt!). <strong>Forecast</strong> Lebaran = <strong>Rp20jt</strong>. <strong>Stok</strong> = <strong>cukup</strong>. <strong>Hasil:</strong> <strong>tidak</strong> kehabisan + <strong>tidak</strong> overstock!</p>
<p><strong>Pelajaran:</strong> <strong>rata-rata</strong> = <strong>musuh</strong> musiman. <strong>Dekomposisi</strong> = <strong>teman</strong>.</p>
<h3>Kisah 2: MAPE yang Menyesatkan</h3>
<p>Distributor &ldquo;LancarAbadi&rdquo;: MAPE <strong>5%</strong> (&ldquo;bagus!&rdquo;). <strong>Tapi:</strong> <strong>produk kecil</strong> (aktual Rp1jt!) error <strong>50%</strong> (<strong>dihukum</strong> MAPE!), <strong>produk besar</strong> (Rp100jt!) error <strong>2%</strong> (<strong>diabaikan</strong>!). <strong>Fokus</strong> ke <strong>kecil</strong> (tidak <strong>penting</strong>!), <strong>abaikan</strong> besar (<strong>penting</strong>!).</p>
<p><strong>Solusi:</strong> <strong>WAPE</strong> (10%!). <strong>Fokus</strong> ke <strong>besar</strong> (dampak <strong>uang</strong>!). <strong>Hasil:</strong> <strong>stok</strong> produk besar <strong>akurat</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>metrik</strong> menentukan <strong>fokus</strong>. <strong>MAPE</strong> = fokus <strong>kecil</strong>. <strong>WAPE</strong> = fokus <strong>uang</strong>. <strong>Pilih</strong> WAPE!</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Model canggih (ML!) selalu lebih baik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Holt-Winters</strong> sering <strong>mengalahkan</strong> ML! (<strong>M-competitions</strong>! — <strong>bukti</strong>!). <strong>ML</strong> menang jika <strong>banyak</strong> fitur eksternal. <strong>Untuk</strong> deret <strong>murni</strong>: <strong>Holt-Winters</strong> = <strong>baseline</strong> yang <strong>sulit</strong> dikalahkan. <strong>Kalahkan</strong> dulu, <strong>baru</strong> klaim!</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Lebaran yang (Tidak Lagi) Kehabisan Stok</h2>
<div className="callout">
<p>SegarMart: sirup kehabisan tiap Lebaran, kelebihan setelahnya. Model: rata-rata 12 bulan (=133). Data: 11 bulan @100, Lebaran @500 (bergeser tiap tahun).</p>
<p><strong>Pertanyaan:</strong> (a) Tiga cacat model rata-rata? (b) Rancang model yang benar (komponen + metode). (c) Kebijakan stok dengan interval?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Menghancurkan musiman</strong> (133 salah untuk semua bulan), <strong>buta holiday bergeser</strong> (Lebaran pindah tiap tahun), <strong>tanpa interval</strong> (tidak tahu risiko).</p>
<p>(b) <strong>Dekomposisi:</strong> baseline 100 + dummy Lebaran (H−14 s.d. H+7, ikut kalender Hijriah) + trend ringan. <strong>Metode:</strong> Holt-Winters + regressor holiday, atau regresi dinamis. <strong>Validasi:</strong> backtest 3 Lebaran terakhir.</p>
<p>(c) <strong>Stok = batas atas interval 80%</strong> untuk sirup (stockout mahal: pelanggan pindah), <strong>median</strong> untuk pelengkap. Review: tiap tahun sesuaikan dummy dengan tanggal Lebaran resmi.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Dekomposisi.</strong> Y: Q1=80, Q2=100, Q3=120, Q4=90. Q3 <strong>selalu</strong> tinggi (+30!). Hitung tren &amp; forecast Q1 tahun depan.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>Musiman Q3:</strong> +30 (diberi!). <strong>Deseasonalize:</strong> Q1=80, Q2=100, Q3=90 (120−30!), Q4=90. <strong>Tren:</strong> naik <strong>~3/kuartal</strong> (80→90!).</p>
<p><strong>Forecast Q1:</strong> tren (93!) + musiman (0!) = <strong>93</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>hilangkan</strong> musiman dulu, <strong>baru</strong> lihat tren!</p>
</details>
<p><strong>Soal 2 — WAPE.</strong> Aktual [200, 300, 500], forecast [180, 330, 480]. Hitung WAPE.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>Error:</strong> |20| + |30| + |20| = <strong>70</strong>. <strong>Total aktual:</strong> 200+300+500 = <strong>1000</strong>. <strong>WAPE</strong> = 70/1000 = <strong>7%</strong>.</p>
<p><strong>Interpretasi:</strong> &ldquo;salah <strong>7%</strong> dari <strong>total</strong>&rdquo;. <strong>Bagus</strong> (&lt; 10%!).</p>
</details>
<p><strong>Soal 3 — Hierarki.</strong> Nasional forecast Rp100jt. Regional A=60jt, B=50jt (jumlah <strong>110jt</strong>!). Tidak <strong>konsisten</strong>! Bagaimana <strong>rekonsiliasi</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Top-down:</strong> A = 100×(60/110) = <strong>54,5jt</strong>, B = <strong>45,5jt</strong>. <strong>Bottom-up:</strong> nasional = <strong>110jt</strong> (ikut <strong>jumlah</strong>!).</p>
<p><strong>Rekonsiliasi optimal:</strong> <strong>rata-rata tertimbang</strong> by <strong>presisi</strong>! (<strong>MinT</strong>! — <strong>library</strong>!). <strong>Jangan</strong> biarkan <strong>tidak</strong> konsisten!</p>
</details>
<p><strong>Soal 4 — Interval.</strong> Forecast Rp10jt, WAPE 10%. Berapa <strong>interval</strong> 80%? Mengapa <strong>penting</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Interval:</strong> 10jt ± (1,28×1jt!) = <strong>Rp8,7jt – Rp11,3jt</strong> (80%!).</p>
<p><strong>Penting:</strong> <strong>stok</strong> = <strong>batas atas</strong> (jangan <strong>kehabisan</strong>!). <strong>Budget</strong> = <strong>batas bawah</strong> (jangan <strong>over</strong>!). <strong>Titik</strong> = <strong>menipu</strong>. <strong>Interval</strong> = <strong>jujur</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga aturan forecasting: (1) <em>dekomposisi</em> dulu; (2) <em>Holt-Winters</em> sebagai baseline; (3) <em>WAPE</em> + <em>interval</em> (bukan titik!). Tiga aturan = forecast yang benar.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Data: 11 bulan @100, Lebaran @500. Ramalan rata-rata 12 bulan untuk bulan Lebaran?"}
  options={
    ["500 (tepat)",
    "133 (kurang 367 — stockout!)",
    "100",
    "600"]
  }
  correct={1}
  explanation={"Benar: (11×100+500)/12 = 133. Kurang 367 dari kebutuhan 500 = rak kosong saat puncak. Rata-rata menghancurkan musiman."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Dua model WAPE 12%. A bias +8%, B bias −1%. Pilih?"}
  options={
    ["A",
    "B — bias kecil; bias bisa dikoreksi",
    "Sama saja",
    "Tolak keduanya"]
  }
  correct={1}
  explanation={"Benar: WAPE sama, B tidak punya kecenderungan sistematis. Bias +8% = overstock kronis Rp800jt. Dan bias mudah dikoreksi (kurangi 8%) — gratis."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kenapa cross-validation acak dilarang untuk time series?"}
  options={
    ["Terlalu lambat",
    "Leakage: model 'melihat' masa depan saat training",
    "Tidak ada alasan",
    "Hanya untuk data kecil"]
  }
  correct={1}
  explanation={"Benar: CV acak melatih dengan data Desember untuk meramal Januari — di dunia nyata kamu tidak punya Desember. Backtest out-of-time satu-satunya yang jujur."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Lebaran bergeser tiap tahun. Perlakuan benar?"}
  options={
    ["Abaikan — musiman bulanan cukup",
    "Regressor/dummy holiday mengikuti kalender Hijriah",
    "Hapus data Lebaran",
    "Rata-ratakan saja"]
  }
  correct={1}
  explanation={"Benar: musiman 'April' gagal saat Lebaran jatuh di Maret. Dummy H−14 s.d. H+7 mengikuti tanggal aslinya — model belajar pola relatif terhadap Lebaran, bukan bulan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kapan seasonal naive lebih baik dari model kompleks?"}
  options={
    ["Tidak pernah",
    "Sering — di data musiman kuat ia benchmark yang sulit dikalahkan",
    "Hanya data kecil",
    "Hanya tanpa komputer"]
  }
  correct={1}
  explanation={"Benar: 'nilai tahun lalu periode ini' menangkap musiman sempurna. Banyak model ML gagal mengalahkannya. Kalahkan dulu sebelum klaim canggih."}
/>

      <h2 id="panduan">📚 Panduan Lengkap Forecasting: Dari Nol ke Produksi</h2>
<p><strong>Forecasting</strong> = <strong>skill</strong> yang <strong>dibutuhkan</strong> semua bisnis. <strong>Panduan</strong> lengkap: <strong>persiapan</strong>, <strong>model</strong>, <strong>evaluasi</strong>, <strong>produksi</strong>.</p>
<h3>Bagian 1: Persiapan Data</h3>
<p><strong>Kumpulkan:</strong> <strong>histori</strong> (minimal <strong>2</strong> siklus musiman!), <strong>frekuensi</strong> (harian! mingguan! bulanan!), <strong>kualitas</strong> (tidak ada <strong>gap</strong>!).</p>
<p><strong>Bersihkan:</strong> <strong>outlier</strong> (hapus? <strong>adjust</strong>?), <strong>missing</strong> (interpolasi!), <strong>perubahan</strong> definisi (dokumentasikan!).</p>
<p><strong>Eksplorasi:</strong> <strong>plot</strong>! (<strong>lihat</strong> tren! musiman! outlier!). <strong>Dekomposisi</strong>! (<strong>pisahkan</strong> komponen!). <strong>Korelasi</strong> (dengan <strong>variabel</strong> eksternal!).</p>
<details className="worked">
<summary>📐 Contoh persiapan (klik untuk buka)</summary>
<p><strong>Data:</strong> penjualan <strong>harian</strong> 2 tahun (730 titik!). <strong>Masalah:</strong> <strong>10</strong> hari <strong>missing</strong> (libur!), <strong>5</strong> outlier (promo <strong>besar</strong>!).</p>
<p><strong>Solusi:</strong> <strong>Missing:</strong> interpolasi <strong>linear</strong>. <strong>Outlier:</strong> <strong>cap</strong> di persentil 99 (<strong>jangan</strong> hapus! — <strong>info</strong>!).</p>
<p><strong>Eksplorasi:</strong> <strong>Tren</strong> naik! <strong>Musiman</strong> mingguan (weekend <strong>tinggi</strong>!) + tahunan (Lebaran!). <strong>Siap</strong> dimodelkan!</p>
</details>
<h3>Bagian 2: Pilih Model</h3>
<p><strong>Hierarki:</strong> <strong>(1)</strong> Naive (baseline!), <strong>(2)</strong> Holt-Winters (kuat!), <strong>(3)</strong> ARIMA (klasik!), <strong>(4)</strong> Prophet (mudah!), <strong>(5)</strong> ML (XGBoost! — dengan <strong>fitur</strong>!), <strong>(6)</strong> Ensemble (gabung!).</p>
<p><strong>Aturan:</strong> <strong>mulai</strong> dari (1)! <strong>Naik</strong> jika <strong>dibutuhkan</strong>. <strong>Jangan</strong> langsung (5)!</p>
<p><strong>Kapan</strong> ML? <strong>Banyak</strong> fitur eksternal (harga! cuaca! event!). <strong>Kapan</strong> Holt-Winters? <strong>Deret</strong> murni (hanya <strong>waktu</strong>!).</p>
<details className="worked">
<summary>📐 Contoh pemilihan (klik untuk buka)</summary>
<p><strong>Kasus A</strong> (penjualan <strong>toko</strong>!): <strong>Holt-Winters</strong> (musiman <strong>jelas</strong>! tidak ada <strong>fitur</strong>!). <strong>WAPE:</strong> 8%.</p>
<p><strong>Kasus B</strong> (penjualan <strong>online</strong>!): <strong>XGBoost</strong> (fitur: <strong>harga</strong>! promo! <strong>traffic</strong>!). <strong>WAPE:</strong> 6% (vs Holt-Winters <strong>10%</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>fitur</strong> = <strong>alasan</strong> ML. <strong>Tanpa</strong> fitur = <strong>Holt-Winters</strong>.</p>
</details>
<h3>Bagian 3: Evaluasi yang Benar</h3>
<p><strong>Backtest:</strong> <strong>train</strong> masa lalu, <strong>test</strong> masa depan (<strong>jangan</strong> acak! — <strong>waktu</strong>!). <strong>Rolling</strong> origin (<strong>multiple</strong> test!).</p>
<p><strong>Metrik:</strong> <strong>WAPE</strong> (utama!), <strong>bias</strong> (over/under?), <strong>interval</strong> (coverage!).</p>
<p><strong>Jebakan:</strong> <strong>overfit</strong> (bagus di <strong>train</strong>, jelek di <strong>test</strong>!). <strong>Solusi:</strong> <strong>validasi</strong> ketat!</p>
<details className="worked">
<summary>📐 Contoh backtest (klik untuk buka)</summary>
<p><strong>Data:</strong> 2 tahun. <strong>Backtest:</strong> train <strong>18</strong> bulan, test <strong>6</strong> bulan (<strong>rolling</strong> 3x!).</p>
<p><strong>Hasil:</strong> WAPE <strong>train</strong> 5%, <strong>test</strong> 9% (<strong>gap</strong> 4%! — <strong>sedikit</strong> overfit!). <strong>Bias:</strong> −2% (<strong>under</strong> forecast!).</p>
<p><strong>Aksi:</strong> <strong>sederhanakan</strong> model (<strong>kurangi</strong> overfit!). <strong>Adjust</strong> bias (+2%!).</p>
</details>
<h3>Bagian 4: Produksi</h3>
<p><strong>Otomatisasi:</strong> <strong>pipeline</strong> (data → model → forecast!). <strong>Jadwal:</strong> <strong>harian</strong>! mingguan! <strong>Monitor:</strong> <strong>WAPE</strong> live! (<strong>drift</strong>?).</p>
<p><strong>Retrain:</strong> <strong>mingguan</strong>! bulanan! (<strong>jangan</strong> sekali!). <strong>Alert:</strong> jika <strong>WAPE</strong> &gt; threshold!</p>
<p><strong>Dokumentasi:</strong> <strong>model</strong> apa? <strong>asumsi</strong> apa? <strong>keterbatasan</strong> apa?</p>
<div className="tip">
<p><strong>💡 <em>Empat bagian</em>: persiapan, model, evaluasi, produksi. <em>Jangan</em> skip <em>evaluasi</em>.</strong></p>
</div>

      <h2 id="kisahforecast">📖 Kisah Nyata: Forecast yang Menyelamatkan Lebaran</h2>
<p>Di sebuah perusahaan retail besar di Surabaya, manajer supply chain, Pak Harto, terlihat stres setiap menjelang Lebaran. Tahun lalu adalah bencana. &ldquo;Kita kehabisan stok di hari ketiga!&rdquo; katanya dengan nada frustrasi. &ldquo;Pelanggan marah-marah. Kita kehilangan Rp5 miliar penjualan! Tapi setelah Lebaran, kita malah overstock Rp3 miliar yang akhirnya harus diobral rugi!&rdquo;</p>
<p>Kamu, sang analis data yang baru bergabung, diminta untuk memperbaiki sistem forecasting. Kamu tahu bahwa masalahnya bukanlah &ldquo;tidak ada forecast&rdquo;, tetapi &ldquo;forecast yang salah&rdquo;.</p>
<p>Kamu mulai dengan mengaudit forecast tahun lalu. Kamu menemukan bahwa mereka menggunakan &ldquo;rata-rata 12 bulan&rdquo; — metode yang sangat naif! Rata-rata penjualan Rp10 miliar per bulan digunakan untuk memprediksi Lebaran. Padahal, penjualan saat Lebaran mencapai Rp25 miliar! Tidak heran mereka kehabisan stok.</p>
<p>&ldquo;Mengapa tidak menggunakan data Lebaran tahun lalu?&rdquo; tanyamu. Pak Harto menggeleng. &ldquo;Kita coba, tetapi Lebaran tahun lalu Rp22 miliar, tahun sebelumnya Rp18 miliar. Naik terus! Kita tidak tahu berapa tahun ini.&rdquo;</p>
<p>Kamu tersenyum. Ini adalah masalah dekomposisi klasik dari MK15. Kamu perlu memisahkan tren, musiman, dan residual.</p>
<p>Kamu menarik data tiga tahun. Kamu melakukan dekomposisi dan menemukan pola yang jelas. Tren: penjualan naik sekitar Rp1 miliar per tahun (karena ekspansi toko!). Musiman Lebaran: selalu sekitar 2,2 kali penjualan normal (bukan angka absolut, tetapi multiplier!). Residual: kecil, hanya sekitar lima persen.</p>
<p>Dengan temuan ini, kamu membuat forecast untuk Lebaran tahun ini. Penjualan normal saat ini adalah Rp12 miliar per bulan (naik dari Rp10 miliar tahun lalu karena tren!). Multiplier Lebaran adalah 2,2. Jadi forecast Lebaran = Rp12 miliar × 2,2 = Rp26,4 miliar!</p>
<p>Pak Harto terlihat ragu. &ldquo;Yakin? Tahun lalu kita hanya siapkan Rp15 miliar dan kehabisan. Sekarang kamu minta siapkan Rp26 miliar? Itu hampir dua kali lipat!&rdquo;</p>
<p>Kamu menunjukkan perhitungannya. &ldquo;Pak, tahun lalu penjualan normal Rp10 miliar, multiplier 2,2, seharusnya siapkan Rp22 miliar. Tapi kita hanya siapkan Rp15 miliar (karena pakai rata-rata!). Makanya kehabisan. Tahun ini penjualan normal sudah Rp12 miliar, jadi butuh Rp26,4 miliar.&rdquo;</p>
<p>Kamu juga memberikan interval kepercayaan. &ldquo;Dengan WAPE historis delapan persen, interval 80% adalah Rp24 miliar hingga Rp29 miliar. Saya sarankan siapkan Rp27 miliar (batas atas!) untuk aman, tetapi jangan lebih dari Rp29 miliar (untuk hindari overstock!).&rdquo;</p>
<p>Pak Harto masih ragu, tetapi ia tidak punya alternatif yang lebih baik. Ia menyetujui untuk menyiapkan Rp27 miliar.</p>
<p>Hasilnya? Penjualan aktual saat Lebaran mencapai Rp26,8 miliar! Hampir tepat dengan forecast Rp26,4 miliar! Tidak kehabisan stok! Dan setelah Lebaran, sisa stok hanya Rp500 juta (bukan Rp3 miliar seperti tahun lalu!).</p>
<p>Pak Harto memelukmu. &ldquo;Kamu menyelamatkan Lebaran kita!&rdquo; katanya. &ldquo;Berapa kerugian yang kita hindari? Kehabisan stok tahun lalu Rp5 miliar, overstock Rp3 miliar. Total Rp8 miliar! Tahun ini hampir nol!&rdquo;</p>
<p>Kamu tersenyum. &ldquo;Itu bukan keajaiban, Pak. Itu hanya dekomposisi yang benar.&rdquo;</p>
<p>Sejak itu, perusahaan mengadopsi sistem forecasting yang baru. Setiap kategori produk di-forecast dengan dekomposisi. Setiap forecast disertai interval. Setiap bulan dilakukan backtest untuk memastikan WAPE tetap di bawah sepuluh persen.</p>
<div className="callout">
<p><strong>What:</strong> Forecast Lebaran dengan dekomposisi (tren! multiplier 2,2!). Akurat 98%! Hindari kerugian Rp8 miliar.</p>
<p><strong>So what:</strong> <strong>Dekomposisi</strong> = <strong>kebenaran</strong>. <strong>Rata-rata</strong> = <strong>bencana</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Dekomposisi</strong> dulu! (2) <strong>Multiplier</strong>, bukan absolut! (3) <strong>Interval</strong>, bukan titik! (4) <strong>Backtest</strong>!</p>
</div>

      <h2 id="kisahgagal">📖 Kisah Nyata: Ketika Forecast Gagal Total</h2>
<p>Di sebuah perusahaan distribusi di Medan, manajer operasional, Pak Rahmat, sangat percaya diri dengan sistem forecasting-nya. &ldquo;Kita pakai AI terbaru!&rdquo; katanya dengan bangga. &ldquo;Machine learning! Deep learning! Pasti akurat!&rdquo;</p>
<p>Kamu, sang konsultan yang diminta untuk audit, merasa curiga. &ldquo;Boleh saya lihat backtest-nya?&rdquo; tanyamu. Pak Rahmat menunjukkan hasil: WAPE 3% di data training! &ldquo;Lihat! Hanya 3% error!&rdquo;</p>
<p>Kamu mengangguk, tetapi bertanya: &ldquo;Bagaimana dengan data test? Yang tidak dipakai untuk training?&rdquo; Pak Rahmat terdiam. &ldquo;Itu... tidak kami ukur. Tapi training-nya bagus, pasti test-nya juga bagus.&rdquo;</p>
<p>Kamu meminta data dan melakukan backtest yang benar. Hasilnya mengejutkan: WAPE di data test adalah 25%! Bukan 3%! Model tersebut overfit parah — ia menghafal data training tetapi tidak bisa memprediksi masa depan.</p>
<p>&ldquo;Bagaimana mungkin?&rdquo; tanya Pak Rahmat dengan panik. Kamu menjelaskan: &ldquo;Model Bapak terlalu kompleks. Ia memiliki 500 parameter untuk hanya 200 titik data. Ia seperti siswa yang menghafal soal ujian, bukan memahami pelajarannya. Saat soalnya diganti (data baru!), ia gagal total.&rdquo;</p>
<p>Kamu kemudian membangun model Holt-Winters yang sederhana. Hasilnya: WAPE 8% di training, 9% di test! Jauh lebih baik! &ldquo;Terkadang, sederhana lebih baik,&rdquo; katamu. &ldquo;Terutama jika data sedikit.&rdquo;</p>
<p>Pak Rahmat belajar pelajaran berharga: selalu validasi dengan data yang tidak dipakai training. Jangan terpukau dengan angka bagus di training. Dan jangan meremehkan metode klasik.</p>
<div className="callout">
<p><strong>What:</strong> ML canggih (WAPE 3% train!) → gagal total (25% test!). Holt-Winters sederhana → 9% test! Menang!</p>
<p><strong>So what:</strong> <strong>Validasi</strong> = <strong>wajib</strong>. <strong>Sederhana</strong> &gt; <strong>canggih</strong> (jika overfit!).</p>
<p><strong>Now what:</strong> (1) <strong>Backtest</strong>! (2) <strong>Jangan</strong> overfit! (3) <strong>Holt-Winters</strong> dulu!</p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-hw">📐 Worked Example: Holt-Winters Dihitung Tangan (6 Periode)</h2>
<p>Memahami <em>mekanik</em> exponential smoothing membuatmu tidak lagi memperlakukan forecast sebagai kotak hitam. Data: penjualan mingguan (unit): 100, 110, 105, 130, 125, 140. Pola: tren naik + sedikit noise. Parameter: α = 0,5 (level), β = 0,3 (tren). Tanpa musiman (demi kejelasan tangan).</p>
<details className="worked">
<summary>📐 Iterasi per periode (klik untuk buka)</summary>
<p><strong>Rumus:</strong> <Tex math={String.raw`L_t = \alpha Y_t + (1-\alpha)(L_{t-1} + T_{t-1})`} />, <Tex math={String.raw`T_t = \beta(L_t - L_{t-1}) + (1-\beta)T_{t-1}`} />, forecast <Tex math={String.raw`\hat{Y}_{t+1} = L_t + T_t`} />. Inisialisasi: L<sub>1</sub> = 100, T<sub>1</sub> = 0.</p>
<p><strong>t=2</strong> (Y=110): L<sub>2</sub> = 0,5×110 + 0,5×(100+0) = <strong>105</strong>. T<sub>2</sub> = 0,3×(105−100) + 0,7×0 = <strong>1,5</strong>. Forecast t=3: 105 + 1,5 = <strong>106,5</strong>.</p>
<p><strong>t=3</strong> (Y=105): L<sub>3</sub> = 0,5×105 + 0,5×(105+1,5) = <strong>105,75</strong>. T<sub>3</sub> = 0,3×(105,75−105) + 0,7×1,5 = <strong>1,275</strong>. Forecast t=4: 105,75 + 1,275 = <strong>107,0</strong>.</p>
<p><strong>t=4</strong> (Y=130): L<sub>4</sub> = 0,5×130 + 0,5×(105,75+1,275) = <strong>118,5</strong>. T<sub>4</sub> = 0,3×(118,5−105,75) + 0,7×1,275 = <strong>4,72</strong>. Forecast t=5: 118,5 + 4,72 = <strong>123,2</strong>.</p>
<p><strong>t=5</strong> (Y=125): L<sub>5</sub> = 0,5×125 + 0,5×(118,5+4,72) = <strong>124,1</strong>. T<sub>5</sub> = 0,3×(124,1−118,5) + 0,7×4,72 = <strong>4,98</strong>. Forecast t=6: 124,1 + 4,98 = <strong>129,1</strong>.</p>
<p><strong>t=6</strong> (Y=140): L<sub>6</sub> = 0,5×140 + 0,5×(124,1+4,98) = <strong>134,5</strong>. T<sub>6</sub> = 0,3×(134,5−124,1) + 0,7×4,98 = <strong>6,61</strong>. <strong>Forecast t=7: 134,5 + 6,61 = 141,1.</strong></p>
<p><strong>Evaluasi jujur:</strong> error per periode (Y − forecast): t=3: −1,5; t=4: +23,0; t=5: +1,8; t=6: +10,9. MAE = (1,5+23+1,8+10,9)/4 = <strong>9,3</strong> (±7% dari level ~130). Perhatikan: error terbesar di t=4 — <strong>model lambat menangkap lonjakan</strong> (smoothing = memori, dan memori = kelambanan). Itulah trade-off α: α besar → responsif tapi goyang; α kecil → halus tapi telat.</p>
<p><strong>Pelajaran:</strong> forecast 141,1 untuk minggu 7 <em>bukan</em> ramalan — ia ekstrapolasi &ldquo;jika tren &amp; pola terakhir berlanjut&rdquo;. Jika minggu 7 ada promo besar (intervensi!), angka ini salah — dan salahnya <em>bukan</em> salah model, melainkan salah ekspektasi terhadap model.</p>
</details>
<h3>Lima intuisi parameter</h3>
<ul>
<li><strong>α (level):</strong> seberapa cepat melupakan masa lalu. Data stabil → α kecil (0,1–0,3). Data berubah cepat → α besar (0,5–0,8).</li>
<li><strong>β (tren):</strong> tren yang baru 2 periode jangan dipercaya penuh — β kecil menahan &ldquo;euforia tren&rdquo;.</li>
<li><strong>γ (musiman):</strong> butuh minimal <strong>2 siklus penuh</strong> untuk mengestimasi dengan waras. Satu Lebaran = anekdot, bukan pola.</li>
<li><strong>Inisialisasi penting untuk data pendek.</strong> 6 periode seperti contoh ini — hasil sangat sensitif ke L<sub>1</sub>/T<sub>1</sub>. Data &lt; 20 periode: pakai metode sederhana (naive musiman) saja.</li>
<li><strong>Parameter optimal ≠ parameter bijak.</strong> Optimasi meminimalkan error <em>masa lalu</em>; overfit ke noise masa lalu = rapuh di masa depan. Kadang α = 0,3 &ldquo;manual&rdquo; mengalahkan α = 0,47 &ldquo;optimal&rdquo; di data baru.</li>
</ul>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: exponential smoothing = <em>kompromi antara ingatan dan kelupaan</em>. Terlalu ingat (α kecil) = telat menyadari perubahan; terlalu lupa (α besar) = panik oleh noise. Seni forecasting = memilih titik kompromi yang sesuai dengan <em>kecepatan duniamu berubah</em>.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Distributor &ldquo;LancJaya&rdquo; — Forecast 2.400 SKU Tanpa Gila</h2>
<p><em>LancJaya</em> (nama disamarkan): distributor FMCG di Sulawesi, 2.400 SKU × 8 gudang = <strong>19.200 deret waktu</strong>. Masalah: tiap gudang pesan &ldquo;pakai feeling kepala gudang&rdquo; → stockout 12% di SKU laris, overstock 25% di SKU slow-moving. Modal kerja Rp18 miliar terjebak di stok yang salah.</p>
<h3>Arsitektur: hierarki, bukan 19.200 model liar</h3>
<p><strong>Level 1 — Nasional per kategori</strong> (12 kategori): Holt-Winters + regresi promo. Akurat karena agregat = noise saling menghapus.</p>
<p><strong>Level 2 — Gudang per kategori</strong> (96 deret): proporsi historis dari level 1 + penyesuaian tren lokal.</p>
<p><strong>Level 3 — SKU per gudang</strong> (19.200 deret): <strong>jangan</strong> dimodelkan satu per satu! Dikelompokkan: 300 SKU &ldquo;A&rdquo; (80% revenue) dapat model individual; 2.100 SKU &ldquo;B/C&rdquo; pakai <strong>profil kategori</strong> (pola kategori × skala SKU). Prinsip: <strong>akurasi mahal hanya untuk yang berharga</strong>.</p>
<h3>Rekonsiliasi: angka harus akur</h3>
<p>Masalah klasik hierarki: jumlah forecast 8 gudang ≠ forecast nasional. Solusi: <strong>top-down terkunci</strong> — forecast nasional = kebenaran, gudang = proporsi (proporsi di-smoothing 13 minggu agar tidak goyang). Kepala gudang boleh mengajukan <strong>override</strong> (mis. &ldquo;ada hajatan besar minggu depan&rdquo;) — tapi override <strong>dicatat &amp; dievaluasi</strong>: override yang 3x berturut-turut memperburuk akurasi = hak override dicabut 1 kuartal. Manusia + model, dengan akuntabilitas.</p>
<h3>Hasil 1 tahun</h3>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Metrik</th><th>Sebelum</th><th>Sesudah</th></tr></thead>
<tbody>
<tr><td>Stockout SKU A</td><td>12%</td><td>4%</td></tr>
<tr><td>Overstock (hari persediaan SKU C)</td><td>95 hari</td><td>41 hari</td></tr>
<tr><td>WAPE nasional/kategori</td><td>— (tidak diukur!)</td><td>11%</td></tr>
<tr><td>Modal kerja di stok</td><td>Rp18,0 M</td><td>Rp12,4 M</td></tr>
<tr><td>Override manusia yang membantu</td><td>—</td><td>31% (sisanya netral/merugikan)</td></tr></tbody>
</table>
</div>
<p><strong>Pelajaran terbesar:</strong> hanya <strong>31%</strong> override manusia yang benar-benar membantu — dan tanpa pencatatan, 69% sisanya akan terus merasa &ldquo;feeling saya benar&rdquo;. <strong>Forecast yang baik bukan yang menggantikan manusia, melainkan yang membuat manusia jujur tentang kapan feelingnya salah.</strong></p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Forecast akurat = model canggih per SKU.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 19.200 model canggih = 19.200 cara overfit. Kemenangan LancJaya datang dari <strong>arsitektur</strong> (hierarki + fokus pada SKU A) dan <strong>governance</strong> (override tercatat), bukan dari algoritma eksotis. Di forecasting operasional, organisasi mengalahkan matematika.</p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Forecasting</h2>
<h3>1. &ldquo;MAPE, WAPE, RMSE — mana yang dipakai?&rdquo;</h3>
<p><strong>WAPE</strong> untuk bisnis (tertimbang volume — error di SKU laris lebih penting). <strong>MAPE</strong> menyesatkan saat aktual kecil (bagi nol!) — hindari untuk deret intermittent. <strong>RMSE</strong> untuk tuning model (menghukum error besar). Dan selalu laporkan <strong>bias</strong> (rata-rata error bertanda) terpisah: model bisa punya WAPE kecil tapi bias +8% (selalu over-forecast) — racun untuk inventory.</p>
<h3>2. &ldquo;Forecast selalu salah — buat apa?&rdquo;</h3>
<p><strong>Forecast bukan ramalan; ia alat keputusan.</strong> Nilainya bukan di &ldquo;benar&rdquo;, melainkan di: (a) <strong>konsistensi</strong> (semua gudang pesan dari angka yang sama, bukan feeling masing-masing), (b) <strong>kecepatan</strong> (revisi mingguan otomatis vs rapat 3 jam), (c) <strong>kejujuran error</strong> (tahu ±11% → set safety stock dengan benar, bukan tebak). Perusahaan tanpa forecast = 19.200 feeling yang tidak bisa diaudit.</p>
<h3>3. &ldquo;Bagaimana forecast produk baru tanpa histori?&rdquo;</h3>
<p><strong>Analog + judgment terstruktur.</strong> Cari 3–5 produk lama yang mirip (kategori, harga, channel) → pakai kurva adopsi mereka sebagai template → sesuaikan dengan pre-order/riset pasar. Teknik: <strong>Bass diffusion</strong> dengan parameter dari analog. Aturan: forecast produk baru <strong>selalu</strong> diberi interval lebar (±40%) dan direvisi tiap 2 minggu setelah launch — bulan pertama data nyata &gt; 2 tahun analog.</p>
<h3>4. &ldquo;Promo/iklan merusak pola — bagaimana memodelkannya?&rdquo;</h3>
<p><strong>Pisahkan baseline dari event.</strong> Modelkan baseline (tanpa promo) + <strong>uplift promo</strong> sebagai variabel terpisah (regresi dengan dummy promo / multiplier). Jangan biarkan model &ldquo;belajar&rdquo; promo sebagai pola musiman — ia akan memprediksi &ldquo;penjualan naik sendiri&rdquo; di minggu yang kebetulan promo tahun lalu. Kalender promo masa depan = <strong>input</strong> forecast, bukan rahasia.</p>
<h3>5. &ldquo;Machine learning (XGBoost/LSTM) vs klasik (Holt-Winters)?&rdquo;</h3>
<p><strong>Klasik menang di:</strong> data pendek (&lt; 2 tahun), butuh dijelaskan ke non-teknis, 19.200 deret (murah &amp; stabil). <strong>ML menang di:</strong> banyak fitur eksternal (cuaca, harga kompetitor, 50 variabel), deret panjang, pola nonlinier kompleks. Praktik terbaik: <strong>kombinasi</strong> — klasik sebagai baseline yang harus dikalahkan ML. Jika XGBoost tidak mengalahkan Holt-Winters di holdout, jangan pakai XGBoost (biaya kompleksitas tanpa manfaat).</p>
<h3>6. &ldquo;Seberapa jauh ke depan boleh forecast?&rdquo;</h3>
<p><strong>Horizon ∝ keputusan.</strong> Stok mingguan → forecast 4–8 minggu. Budget tahunan → 12 bulan (dengan interval melebar). Akurasi runtuh secara <strong>nonlinier</strong>: minggu 1–4 lumayan, bulan 6+ = tebakan berpendidikan. Aturan presentasi: <strong>selalu tampilkan interval</strong> yang melebar — forecast titik 12 bulan ke depan tanpa interval = kebohongan visual.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: forecasting adalah <em>manajemen ketidakpastian</em>, bukan penghapusnya. Analis forecast yang dewasa tidak menjanjikan angka tepat — ia menjanjikan <em>proses</em> yang konsisten, error yang terukur, dan keputusan yang lebih baik dari feeling.</strong></p>
</div>

            <h2 id="tambahan-newsvendor">📈 Pendalaman: Dari Forecast Titik ke Keputusan Stok — Model Newsvendor</h2>
<p>Forecast titik (&ldquo;minggu depan laku 141 unit&rdquo;) <strong>tidak bisa</strong> langsung jadi order pembelian. Kenapa? Karena <strong>biaya salah ke atas ≠ biaya salah ke bawah</strong>: kelebihan stok = modal mengendap; kekurangan stok = pelanggan kecewa + margin hilang. Model newsvendor mengubah distribusi forecast menjadi <strong>jumlah order optimal</strong> — jembatan yang paling sering hilang antara analis forecast dan tim operasional.</p>
<h3>Logika: timbang dua biaya kesalahan</h3>
<ul>
<li><strong>Cu</strong> (underage cost) = rugi per unit karena <em>kurang</em> stok = margin yang hilang (mis. Rp15.000/unit).</li>
<li><strong>Co</strong> (overage cost) = rugi per unit karena <em>kelebihan</em> stok = modal mengendap + risiko basi (mis. Rp5.000/unit).</li>
</ul>
<p>Aturan optimal (<strong>critical fractile</strong>): <Tex math={String.raw`P(\text{demand} \leq Q^*) = \frac{C_u}{C_u + C_o}`} />. Pesan Q* = kuantil ke-sekian dari distribusi demand — <strong>bukan</strong> rata-ratanya!</p>
<details className="worked">
<summary>📐 Contoh: Toko roti &ldquo;HangatPagi&rdquo; (klik untuk buka)</summary>
<p>Data: roti sobek, margin Rp15.000/unit (Cu), sisa tak terjual dibuang rugi Rp5.000/unit (Co, bahan + tenaga). Forecast demand besok: normal dengan rata-rata μ = 200, σ = 40.</p>
<p><strong>Langkah 1 — Hitung critical fractile:</strong> Cu/(Cu+Co) = 15.000/(15.000+5.000) = <strong>0,75</strong>.</p>
<p><strong>Langkah 2 — Cari kuantil 75% distribusi normal:</strong> z untuk 0,75 ≈ 0,674. Q* = μ + z·σ = 200 + 0,674×40 = 200 + 27 = <strong>227 unit</strong>.</p>
<p><strong>Langkah 3 — Bandingkan dengan &ldquo;pesan sesuai forecast&rdquo;:</strong> pesan 200 (rata-rata) → peluang stockout = <strong>50%</strong>! Pesan 227 → peluang stockout = 25%, dengan biaya kelebihan yang <em>rasional</em> (karena margin 3x lipat dari biaya buang).</p>
<p><strong>Langkah 4 — Uji sensitivitas:</strong> jika produknya <em>tidak bisa basi</em> (Co kecil, mis. Rp1.000 — bisa dijual besok): fractile = 15/16 = 0,9375 → z ≈ 1,53 → Q* = <strong>261</strong>. Makin murah kelebihan, makin berani stok. Jika margin tipis (Cu = Rp6.000, Co = Rp5.000): fractile = 0,545 → Q* = <strong>205</strong> — hampir sama dengan rata-rata. <strong>Keputusan stok = fungsi ekonomi, bukan fungsi statistik.</strong></p>
<p><strong>Langkah 5 — Kaitkan ke interval forecast:</strong> Q* = 227 tidak berarti &ldquo;yakin laku 227&rdquo; — ia berarti &ldquo;dengan ketidakpastian σ=40 dan struktur biaya ini, 227 memaksimalkan ekspektasi profit&rdquo;. Jika σ naik jadi 80 (demand makin tak pasti): Q* = 200 + 0,674×80 = <strong>254</strong> — ketidakpastian yang <em>lebih besar</em> → stok <em>lebih banyak</em> (asimetri biaya!). Inilah alasan safety stock ada.</p>
</details>
<h3>Empat pelajaran operasional</h3>
<ul>
<li><strong>Forecast tanpa distribusi = setengah cerita.</strong> Selalu sertakan σ/interval — tanpa itu, tim gudang tidak bisa menghitung safety stock dengan benar.</li>
<li><strong>&ldquo;Akurat&rdquo; tidak sama dengan &ldquo;optimal&rdquo;.</strong> Forecast sempurna (σ=0) pun tetap butuh newsvendor jika ada ketidakpastian sisa — dan selalu ada.</li>
<li><strong>Segmentasikan Co/Cu per kategori.</strong> Produk basi (roti) vs awet (mie instan) vs mahal-modal (elektronik) punya fractile berbeda — satu aturan &ldquo;stok = forecast + 10%&rdquo; untuk semua = salah untuk semua.</li>
<li><strong>Newsvendor satu periode; untuk multi-periode pakai (s,S) / base-stock.</strong> Tapi logikanya sama: keputusan stok = forecast + ekonomi ketidakpastian, bukan forecast saja.</li>
</ul>
<div className="callout">
<h3>🧭 Template 1 halaman: dari forecast ke order</h3>
<ol><li>Tulis forecast: μ = ___, σ = ___ (dari interval model).</li><li>Tulis ekonomi: Cu (margin hilang) = Rp___, Co (biaya kelebihan) = Rp___.</li><li>Hitung fractile = Cu/(Cu+Co) = ___.</li><li>Q* = μ + z·σ = ___ (z dari tabel normal).</li><li>Catat asumsi &amp; revisi minggu depan: apakah σ mengecil (model membaik)?</li></ol>
</div>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: forecast menjawab &ldquo;berapa yang <em>mungkin</em> terjadi?&rdquo;; newsvendor menjawab &ldquo;dengan ketidakpastian itu dan dompetku ini, berapa yang <em>seharusnya</em> kusiapkan?&rdquo;. Analis yang berhenti di forecast menyerahkan keputusan termahal ke feeling gudang.</strong></p>
</div>

            <h2 id="tambahan-target">🔬 Pendalaman: Forecast vs Target — Dua Angka yang Sering Dicampur (dan Merusak Keduanya)</h2>
<p>Kesalahan organisasi paling mahal dalam forecasting bukan model yang salah — melainkan <strong>mencampur forecast (prediksi jujur) dengan target (ambisi manajemen)</strong> dalam satu angka. Bagian ini membedah kenapa pencampuran itu merusak keduanya, dan bagaimana memisahkannya dengan benar.</p>
<h3>Anatomi kerusakan: satu angka, dua tuhan</h3>
<p>Skenario umum: direksi menetapkan &ldquo;target&rdquo; Rp100 miliar. Tim forecast — yang seharusnya menjawab &ldquo;menurut data akan terjadi apa?&rdquo; — malah menulis &ldquo;forecast Rp100 miliar&rdquo; agar terlihat sejalan. Akibatnya:</p>
<ul>
<li><strong>Gudang</strong> stok berdasarkan Rp100 miliar → overstock saat realisasi Rp82 miliar (modal Rp18 miliar mengendap).</li>
<li><strong>Finance</strong> proyeksi cashflow dari Rp100 miliar → kaget saat kas seret.</li>
<li><strong>Evaluasi model</strong> jadi mustahil — &ldquo;forecast&rdquo; Rp100 miliar vs aktual Rp82 miliar: apakah modelnya jelek, atau angkanya memang bukan forecast?</li>
<li><strong>Insentif rusak:</strong> tim sales yang tahu target = forecast akan <em>menahan</em> order (agar target tahun depan tidak naik) — fenomena <strong>ratchet effect</strong>.</li>
</ul>
<h3>Arsitektur yang benar: tiga angka, tiga pemilik</h3>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Angka</th><th>Pertanyaan yang dijawab</th><th>Pemilik</th><th>Boleh dioptimasi?</th></tr></thead>
<tbody>
<tr><td><strong>Forecast</strong></td><td>Menurut data &amp; model, apa yang <em>akan</em> terjadi?</td><td>Tim analis (independen)</td><td>Tidak — ia cermin, bukan kemudi</td></tr>
<tr><td><strong>Target</strong></td><td>Apa yang <em>ingin</em> kita capai?</td><td>Manajemen</td><td>Ya — ia ambisi</td></tr>
<tr><td><strong>Plan/commit</strong></td><td>Berapa yang <em>kita siapkan</em> (stok, budget)?</td><td>Operasional + analis</td><td>Ya — via newsvendor &amp; skenario</td></tr>
</tbody>
</table>
</div>
<p><strong>Aturan main:</strong> forecast <strong>tidak boleh</strong> diubah agar cocok dengan target — itu seperti memecahkan termometer agar demam terlihat turun. Gap antara forecast (Rp82M) dan target (Rp100M) <strong>bukan</strong> kegagalan analis — ia justru <strong>informasi paling berharga</strong>: &ldquo;kita butuh inisiatif senilai Rp18M&rdquo; (promo baru? channel baru? produk baru?). Gap yang disembunyikan = strategi yang tidak pernah dibuat.</p>
<h3>Studi mini: &ldquo;Forecast Rp82M, Target Rp100M&rdquo;</h3>
<p>Perusahaan FMCG &ldquo;SegarAbadi&rdquo;: forecast model Q4 = Rp82 miliar (WAPE historis 9%), target direksi = Rp100 miliar. Respons dewasa:</p>
<ul>
<li><strong>Langkah 1 — Akui gap secara terbuka:</strong> &ldquo;Model bilang 82 (±7). Target 100. Gap 18 harus diisi inisiatif, bukan doa.&rdquo;</li>
<li><strong>Langkah 2 — Kuantifikasi inisiatif:</strong> promo Harbolnas (estimasi +6M, dari histori), listing di 2 ritel baru (+5M), bundling akhir tahun (+4M). Total inisiatif = +15M → <strong>plan = 82 + 15 = 97M</strong> (masih di bawah target 100 — jujur!).</li>
<li><strong>Langkah 3 — Pisahkan evaluasi:</strong> analis dinilai dari akurasi forecast (82 vs aktual baseline); tim sales dinilai dari eksekusi inisiatif (+15M). Tidak ada yang dihukum karena &ldquo;forecast tidak mencapai target&rdquo; — itu kategori kesalahan.</li>
<li><strong>Hasil:</strong> aktual Q4 = Rp95 miliar. Forecast baseline akurat (82 vs 80 tanpa inisiatif = error 2,5%!). Inisiatif menghasilkan +15M. Target 100 tidak tercapai — tapi semua orang tahu <em>kenapa</em> (inisiatif listing tertunda 1 bulan), bukan menebak-nebak.</li>
</ul>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Forecast yang baik = forecast yang mencapai target.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Forecast yang baik = <strong>mendekati realita</strong>. Target yang baik = <strong>menantang tapi masuk akal</strong>. Keduanya diukur dengan meteran berbeda. Organisasi yang mengawinkan keduanya mendapatkan <strong>keduanya yang rusak</strong>: forecast yang tidak jujur dan target yang tidak dipercaya.</p>
</div>
<div className="tip">
<p><strong>💡 Uji 10 detik untuk organisasimu: tanya ke analis forecast-mu, &ldquo;kalau model bilang 82 tapi target 100, angka berapa yang kamu tulis di laporan?&rdquo;. Jika jawabannya ragu-ragu — organisasimu punya masalah ini. Perbaikannya bukan model baru, melainkan <em>keberanian memisahkan tiga angka</em>.</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Dekomposisi</strong>: trend + musiman + holiday (bergeser!) + noise; selalu plot dulu.</li>
<li><strong>Metode</strong>: seasonal naive (benchmark) → MA → SES/Holt-Winters (kuda kerja) → regresi/ML (banyak driver).</li>
<li><strong>Evaluasi</strong>: WAPE (stabil) + bias (arah salah); target keduanya kecil.</li>
<li><strong>Backtest out-of-time</strong> — CV acak = leakage.</li>
<li><strong>Hierarki + rekonsiliasi</strong>: angka SKU, kategori, total harus akur.</li>
<li><strong>Forecast ≠ target</strong>: forecast = tebakan tanpa intervensi; target = ambisi.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk14-pricing" className="btn btn-secondary btn-sm">← MK14</Link>
        <Link href="/learn/mk16-digital-ads" className="btn btn-primary btn-sm">MK16 →</Link>
      </div>
    </div>
  );
}

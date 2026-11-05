"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB3MlInvestasiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B3 — Portfolio Management</span>
        <h1 className="display-title">Machine Learning:<br/>untuk Investasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: AI 'Akurat 99%' yang Bangkrut</a></li>
<li><a href="#supervised">Supervised & Validasi</a></li>
<li><a href="#overfitting">Bias-Variance & Overfitting</a></li>
<li><a href="#unsupervised">Unsupervised: Cluster & PCA</a></li>
<li><a href="#sintesis">Sintesis: ML + Disiplin</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: AI 99%</a></li>
<li><a href="#quiz">Quiz (6 soal)</a></li>
<li><a href="#latihan">Latihan Mandiri</a></li>
<li><a href="#quiz">Quiz (6 soal)</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Membedakan supervised vs unsupervised dan contohnya di investasi.</li>
<li>Menjelaskan bias-variance tradeoff dan overfitting.</li>
<li>Menjelaskan walk-forward validation untuk time series.</li>
<li>Menjelaskan Ridge/Lasso dan kapan memakainya.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: AI 'Akurat 99%' yang Bangkrut</h2>
      <div className="story">
        <p><strong>Startup</strong> meluncurkan 'AI prediksi saham akurat <strong>99%</strong>'. Investor antre. Setahun kemudian: <strong>return −40%</strong>.</p>
<p>Twist-nya: 99% adalah <strong>akurasi training</strong> — model menghafal noise historis (<strong>overfitting</strong>). Validasi dilakukan dengan <strong>cross-validation acak</strong> pada time series (= <em>look-ahead bias</em>: 'melihat' masa depan!). Dua dosa fatal: <strong>tidak ada test set yang jujur</strong>. <strong>ML tanpa validasi benar = astrologi dengan GPU.</strong> Lesson ini: disiplin yang membedakan sains dari sulap.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="supervised">Supervised — Belajar dari Label</h2>
<p><strong>Definisi.</strong> <strong>Supervised</strong>: prediksi y dari X berlabel — <em>regresi</em> (return kontinu) &amp; <em>klasifikasi</em> (naik/turun, default/tidak). <strong>Train/test split</strong>: latih di masa lalu, uji di 'masa depan' yang belum dilihat. <strong>Untuk time series: walk-forward</strong> (train 2015–20 → test 2021; geser) — <strong>CV acak DILARANG</strong> (look-ahead!).</p>
<p><strong>Metrik</strong>: regresi → RMSE/MAE; klasifikasi → akurasi/precision/recall/AUC (untuk default: <strong>recall</strong> penting!).</p>
<p><strong>Kepribadian/intuisi:</strong> Validasi ML seperti <strong>ujian sekolah</strong>: train = latihan soal, test = ujian. CV acak di time series = <strong>ujian dengan kunci jawaban bocor</strong> (soal 'masa depan' dipakai latihan). Walk-forward = ujian kenaikan kelas yang jujur.</p>
<p><strong>Kapan dipakai:</strong> Setiap model prediktif: default (PM-A4 ratios → PD), return, churn.</p>
<p><strong>Pendalaman intuisi &mdash; supervised learning = meniru guru.</strong> Kamu memberi ribuan contoh &ldquo;fitur &rarr; label&rdquo; (laporan keuangan &rarr; return), model mencari pola. <strong>Kekuatan:</strong> menangkap <em>nonlinearitas</em> &amp; interaksi yang regresi linear lewatkan. <strong>Kelemahan fatal:</strong> ia meniru <em>termasuk noise</em> &mdash; dan di pasar, noise &gt; sinyal. <strong>ML di keuangan bukan soal algoritma tercanggih, melainkan <em>disiplin validasi</em> terketat.</strong></p><details className="worked">
<summary>📐 Contoh: Walk-forward (klik untuk buka)</summary>
<p>Data 2015–2024. <strong>Fold 1</strong>: train 2015–18, test 2019. <strong>Fold 2</strong>: train 2015–19, test 2020. … <strong>Fold 6</strong>: train 2015–23, test 2024.</p>
<p><strong>6 skor out-of-time</strong> → rata-rata &amp; stabilitas. Model yang bagus di 2019 tapi jeblok 2020 (COVID) = <strong>rapuh rezim</strong> — informasi berharga, bukan kegagalan.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Bias-variance tradeoff &mdash; angka</summary>
<p><strong>Soal:</strong> tiga model prediksi return. Training error: A 2%, B 5%, C 8%. Validation error: A 15%, B 7%, C 9%. Pilih?</p>
<p><strong>Analisis:</strong> A: <strong>overfit</strong> (2% &rarr; 15% = menghafal). C: <strong>underfit</strong> (8% &rarr; 9% = terlalu sederhana). B: <strong>seimbang</strong> (5% &rarr; 7%).</p>
<p><strong>Pilih B.</strong> <strong>Aturan:</strong> pilih model dengan <em>validation error</em> terkecil &mdash; <strong>bukan</strong> training error! Training error = &ldquo;nilai latihan&rdquo;; validation = &ldquo;nilai ujian sesungguhnya&rdquo;. Startup &ldquo;99% akurat&rdquo; (training) = Model A = bom waktu.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Walk-forward &mdash; protokol yang jujur</summary>
<p><strong>Soal:</strong> data 2015&ndash;2024. Rancang walk-forward dengan train 3 tahun, test 1 tahun.</p>
<p><strong>Langkah 1:</strong> train 2015&ndash;17 &rarr; test 2018. <strong>Langkah 2:</strong> train 2016&ndash;18 &rarr; test 2019. ... <strong>Langkah 7:</strong> train 2021&ndash;23 &rarr; test 2024.</p>
<p><strong>Hasil:</strong> 7 <em>out-of-sample</em> tahun &mdash; <strong>tidak ada <em>look-ahead bias</em></strong> (model tidak pernah &ldquo;melihat&rdquo; masa depan). <strong>Kenapa bukan CV acak:</strong> CV acak mencampur 2024 ke training &amp; 2016 ke test = <strong>mencontek masa depan</strong>. Di time series, <em>urutan waktu = sakral</em>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Data leakage.</strong> Fitur yang &ldquo;bocor&rdquo; dari masa depan: memakai <em>laba Q4</em> untuk prediksi return <em>Q4</em> (laporan keluar Q1 tahun depan!). Atau <em>normalisasi</em> memakai seluruh data (termasuk test!). <strong>Aturan:</strong> setiap transformasi di-fit <em>hanya</em> pada train. Leakage = <em>backtest</em> indah + live hancur.</p>
</div>
<PlotlyChart
  data={[{x: ["2019","2020","2021","2022","2023","2024"], y: [0.62,0.31,0.58,0.55,0.60,0.57], type: "bar", marker: {color: ["#2a7de1","#ef4444","#2a7de1","#2a7de1","#2a7de1","#2a7de1"]}, text: ["0,62","0,31","0,58","0,55","0,60","0,57"], textposition: "outside"}]}
  title={"Skor walk-forward per tahun (AUC, ilustrasi)"}
  layout={{xaxis: {title: "Tahun test"}, yaxis: {title: "AUC"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = AUC model di tahun test (walk-forward).</p>
<p><strong>Interpretasi:</strong> 2020 <strong>anjlok</strong> (COVID = rezim baru) — model rapuh. Rata-rata 0,54 = <strong>nyaris koin</strong>. Walk-forward jujur: ia menunjukkan <em>kapan</em> model gagal, bukan cuma rata-rata. Model '99% akurat' startup itu tidak pernah diuji begini.</p>
</div>

<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [20,12,8,6,5,4.5,4.2,4.0,3.9,3.8], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Training error"}, {x: [1,2,3,4,5,6,7,8,9,10], y: [18,12,9,7,6.5,7,8,9.5,11,13], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Validation error"}]}
  title={"Overfitting: training turun terus, validasi berbalik naik"}
  layout={{xaxis: {title: "Kompleksitas model →"}, yaxis: {title: "Error (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = kompleksitas (makin kanan makin kompleks). Merah = error training; biru = error validasi.</p>
<p><strong>Interpretasi:</strong> Training <strong>selalu turun</strong> (model makin &ldquo;pintar&rdquo; menghafal). Validasi turun lalu <strong>berbalik naik</strong> di titik 5 &mdash; <strong>di sinilah overfitting dimulai!</strong> Model optimal = titik minimum validasi (kompleksitas 5), <strong>bukan</strong> yang training error-nya terkecil (10). <strong>Startup &ldquo;99% akurat&rdquo; = titik 10 = zona overfit.</strong></p>
</div>
<h2 id="overfitting">Overfitting — Menghafal vs Memahami</h2>
<p><strong>Definisi.</strong> <strong>Bias</strong> = error karena model terlalu sederhana (underfit). <strong>Variance</strong> = error karena terlalu sensitif ke training (overfit). <strong>Tradeoff</strong>: kompleksitas ↑ → bias ↓ tapi variance ↑. <strong>Overfitting</strong> = variance dominan: bagus di training, jeblok di test.</p>
<p><strong>Regularisasi</strong>: <strong>Ridge (L2)</strong> = hukum koefisien besar (ciutkan); <strong>Lasso (L1)</strong> = hukum hingga <strong>nol</strong> (seleksi variabel otomatis!).</p>
<Tex math={String.raw`\text{Ridge:} \min \sum e^2 + \lambda\sum b_j^2 \quad;\quad \text{Lasso:} \min \sum e^2 + \lambda\sum |b_j|`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\lambda`} />: kekuatan hukuman — 0 = OLS biasa, besar = model kaku</li>
<li>Ridge: semua koefisien mengecil (tetap ada); Lasso: sebagian jadi NOL (seleksi!)</li>
<li>Pilih λ via validasi (walk-forward!)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Overfitting seperti <strong>siswa menghafal kunci jawaban</strong>: nilai latihan 100, ujian 40 (soal beda). Regularisasi = <strong>guru yang melarang hafalan</strong> (λ): 'pahami polanya, jangan hafal angkanya'. Lasso = guru galak (coret yang tidak penting).</p>
<p><strong>Kapan dipakai:</strong> Banyak fitur, sedikit data (khas finance!): selalu regularisasi.</p>
<p><strong>Pendalaman intuisi &mdash; overfitting = menghafal, bukan memahami.</strong> Model dengan 50 fitur &amp; 100 observasi <em>pasti</em> &ldquo;akurat&rdquo; di training &mdash; ia menghafal 100 jawaban. Seperti murid yang menghafal kunci jawaban tanpa paham konsep: nilai tryout 100, ujian asli 40. <strong>Gejala:</strong> training error &lt;&lt; validation error. <strong>Obat:</strong> lebih banyak data, fitur lebih sedikit, regularisasi, dan <em>walk-forward validation</em>. <strong>Di pasar, overfitting = bangkrut yang tertunda.</strong></p><details className="worked">
<summary>📐 Contoh: 50 fitur, 100 observasi (klik untuk buka)</summary>
<p>OLS: R² train 0,92, test <strong>0,15</strong> (overfit parah). <strong>Ridge</strong> (λ optimal): train 0,55, test <strong>0,48</strong>. <strong>Lasso</strong>: 12 dari 50 fitur tersisa, test 0,50.</p>
<p><strong>Pelajaran:</strong> R² train tinggi = <em>warning</em>, bukan prestasi. Finance = small-n-large-p → regularisasi <strong>wajib</strong>, bukan opsi.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): 50 fitur, 100 observasi &mdash; bencana matematis</summary>
<p><strong>Soal:</strong> mengapa 50 fitur dengan 100 observasi <em>pasti</em> overfit?</p>
<p><strong>Matematika:</strong> 50 parameter, 100 observasi = <strong>2 observasi per parameter</strong>. Model punya cukup &ldquo;kebebasan&rdquo; untuk <em>menghafal</em> &mdash; seperti 2 titik selalu bisa dilalui 1 garis (sempurna tapi tidak informatif).</p>
<p><strong>Aturan praktis:</strong> <strong>minimal 10&ndash;20 observasi per fitur</strong> (100 obs &rarr; maksimal 5&ndash;10 fitur!). Lebih dari itu &rarr; <em>regularisasi</em> (lasso/ridge) atau <em>reduksi dimensi</em> (PCA) <strong>wajib</strong>, bukan opsional.</p>
<p><strong>Versi industri:</strong> &ldquo;AI dengan 500 indikator teknikal&rdquo; pada 250 hari trading = <strong>guaranteed overfit</strong>. Tanyakan selalu: <em>berapa rasio observasi-fitur?</em></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Regularisasi &mdash; lasso menyeleksi</summary>
<p><strong>Soal:</strong> 30 fitur, lasso memilih 7 (sisanya koefisien NOL). Apa yang terjadi &amp; kenapa bagus?</p>
<p><strong>Mekanisme:</strong> lasso menambah penalti L1 (&lambda;&Sigma;|b|) &rarr; optimasi &ldquo;mematikan&rdquo; fitur lemah (koefisien &rarr; 0 persis).</p>
<p><strong>Kenapa bagus:</strong> (1) <strong>interpretabilitas</strong> &mdash; 7 fitur bisa dijelaskan ke klien; 30 tidak. (2) <strong>generalisasi</strong> &mdash; fitur yang bertahan adalah yang <em>robust</em>. (3) <strong>Biaya data</strong> &mdash; hanya perlu maintain 7 feed data.</p>
<p><strong>Catatan:</strong> &lambda; dipilih via <em>cross-validation</em> (walk-forward untuk time series!). &lambda; terlalu besar &rarr; <em>underfit</em>; terlalu kecil &rarr; tetap overfit. <strong>Regularisasi = <em>dial</em> kompleksitas, bukan tombol on/off.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Akurat&rdquo; ≠ profitabel.</strong> Akurasi 99% pada prediksi <em>arah</em> tidak berguna jika: (1) <em>win</em> kecil &amp; <em>loss</em> besar (asimetri!), (2) <strong>biaya transaksi</strong> &gt; edge, (3) prediksi benar tapi <em>terlambat</em> (sinyal basi). <strong>Metrik yang benar: return <em>net of cost</em>, Sharpe, max drawdown</strong> &mdash; bukan akurasi.</p>
</div>
<h2 id="unsupervised">Unsupervised — Menemukan Struktur</h2>
<p><strong>Definisi.</strong> <strong>Clustering</strong> (k-means): kelompokkan observasi mirip — <em>regime detection</em> (pasar risk-on/off), segmentasi saham. <strong>PCA</strong>: kompres banyak variabel jadi sedikit <strong>komponen utama</strong> (faktor statistik!) — 100 rasio → 5 faktor.</p>
<p><strong>Hierarchical clustering</strong> untuk <strong>HRP</strong> (Hierarchical Risk Parity, PM-D2): alokasi by struktur korelasi, bukan inverse-vol semata.</p>
<p><strong>Kepribadian/intuisi:</strong> Clustering seperti <strong>mengelompokkan siswa tanpa daftar kelas</strong>: yang duduk berdekatan &amp; mirip seragamnya = satu kelas (rezim). PCA seperti <strong>meringkas 100 kolom rapor jadi 5 nilai utama</strong> (akademik, olahraga, seni…) — informasi 90% tersimpan.</p>
<p><strong>Kapan dipakai:</strong> Regime detection, diversifikasi by cluster, reduksi fitur.</p>
<p><strong>Pendalaman intuisi &mdash; unsupervised = mencari struktur tanpa guru.</strong> Clustering mengelompokkan saham &ldquo;seperilaku&rdquo;; PCA mereduksi 100 faktor jadi 5 komponen. <strong>Kegunaan nyata:</strong> diversifikasi (pilih satu dari tiap cluster &mdash; bukan 10 saham satu cluster!), <em>regime detection</em> (pasar sedang &ldquo;mode&rdquo; apa?). <strong>Batas:</strong> cluster = korelasi historis, bukan <em>sebab</em> &mdash; dan korelasi berubah saat krisis. <strong>Unsupervised = peta; peta bukan wilayah.</strong></p><details className="worked">
<summary>📐 Contoh: 2 rezim pasar (klik untuk buka)</summary>
<p>K-means (k=2) pada (return, volatilitas) harian 10 tahun → <strong>Cluster A</strong>: return +, vol rendah (risk-on, 75% hari); <strong>Cluster B</strong>: return −, vol tinggi (risk-off, 25%).</p>
<p><strong>Strategi</strong>: alokasi agresif di A, defensif di B (regime-switching). Sederhana tapi mengalahkan buy-and-hold statis di backtest — karena <strong>risiko tidak konstan</strong> (ingat GARCH!).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Clustering untuk diversifikasi</summary>
<p><strong>Soal:</strong> 30 saham di-cluster jadi 5 grup berdasar korelasi return. Kamu punya dana untuk 10 saham. Bagaimana pilih?</p>
<p><strong>Salah:</strong> pilih 10 dengan <em>expected return</em> tertinggi &mdash; kemungkinan 8 dari 10 se-cluster (mis. semua teknologi) = <strong>konsentrasi terselubung</strong>.</p>
<p><strong>Benar:</strong> pilih <strong>2 dari tiap cluster</strong> (yang terbaik per cluster) &rarr; 10 saham tersebar di 5 perilaku berbeda = <strong>diversifikasi struktural</strong>.</p>
<p><strong>Nuansa:</strong> cluster dari <em>korelasi historis</em> &mdash; saat krisis, cluster bisa <em>bergabung</em> (korelasi &rarr; 1). <strong>Clustering = diversifikasi untuk cuaca normal; untuk badai, butuh <em>aset</em> berbeda (obligasi/kas).</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Anomaly detection &mdash; fraud</summary>
<p><strong>Soal:</strong> bank punya 1 juta transaksi/hari. Bagaimana ML menemukan <em>fraud</em> (0,01%)?</p>
<p><strong>Pendekatan:</strong> <em>unsupervised anomaly detection</em> (isolation forest/autoencoder): model &ldquo;transaksi normal&rdquo; &rarr; flag yang <em>menyimpang jauh</em>.</p>
<p><strong>Tantangan nyata:</strong> (1) <strong>imbalance ekstrem</strong> &rarr; akurasi 99,99% = tidak berguna (prediksi &ldquo;semua normal&rdquo;!); metrik = <em>precision/recall</em>. (2) <strong>adversarial</strong> &rarr; fraudster <em>beradaptasi</em> (concept drift!) &rarr; model harus di-<em>retrain</em> kontinu. (3) <strong>false positive cost</strong> &rarr; blokir pelanggan sah = marah.</p>
<p><strong>Pelajaran umum ML finansial:</strong> masalahnya bukan algoritma &mdash; melainkan <strong>data imbalance, drift, &amp; biaya kesalahan asimetris</strong>.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: ML = Statistik + Disiplin</h2>
      <p>Supervised, overfitting, unsupervised = <strong>satu alur kerja</strong>:</p>
      <ol>
        <li><strong>BANGUN (supervised):</strong> pilih model sesuai rasio sinyal-noise &mdash; mulai <em>sederhana</em>.</li>
        <li><strong>UJI (overfitting):</strong> walk-forward, net of cost, baseline comparison. <strong>Model yang tidak diuji dengan kejam = hipotesis.</strong></li>
        <li><strong>PERKAYA (unsupervised):</strong> clustering/PCA untuk struktur &amp; diversifikasi &mdash; <em>setelah</em> model supervised valid.</li>
      </ol>
      <p><strong>Kegagalan startup AI = melompat ke (1) dengan model kompleks, melewatkan (2), dan tidak paham (3).</strong> Urutan tidak bisa dibalik.</p>

      <h3>🎙️ Debat: &ldquo;AI akan menggantikan analis&rdquo;</h3>
      <p><strong>Techno-optimis:</strong> &ldquo;ML memproses 10.000 laporan dalam sedetik, menemukan pola yang manusia lewatkan. Analis manusia = usang.&rdquo;</p>
      <p><strong>Skeptis:</strong> &ldquo;ML = <em>pattern matching</em> masa lalu. Krisis = pola <em>baru</em>. 2008, 2020: semua model kuantitatif <em>gagal bersamaan</em> karena dilatih di &lsquo;masa tenang&rsquo;. Yang bertahan = <em>judgment</em> manusia tentang rezim.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>AI menggantikan analis yang <em>hanya</em> mengolah data; ia memperkuat analis yang <em>berpikir</em>.</strong> Masa depan = <em>centaur</em>: ML untuk skala &amp; disiplin, manusia untuk rezim &amp; makna. Belajarlah ML &mdash; agar kamu jadi penunggangnya, bukan yang ditunggangi.</p>
      <h3>📊 Data Corner: Membaca kurva validasi</h3>
      <p><strong>Data:</strong> kompleksitas 1&ndash;10, train err turun 20%&rarr;3,8%, valid err: 18%&rarr;6,5% (min di 5) &rarr;13%.</p>
      <p><strong>Keputusan:</strong> pilih <strong>kompleksitas 5</strong> (minimum validasi). <strong>Jangan</strong> pilih 10 (train terbaik!) &mdash; itu zona overfit. Jika diminta &ldquo;model terbaik&rdquo; &rarr; jawab dengan <em>validasi</em>, bukan training.</p>
      <h3>📰 Studi Kasus: &ldquo;AI Trading&rdquo; yang Meledak (2021)</h3>
      <p>Startup menggalang dana dengan pitch: &ldquo;AI kami 99% akurat memprediksi saham!&rdquo; <em>Backtest</em> 3 tahun: return 300%. Investor masuk Rp50 miliar.</p>
      <p><strong>Autopsi:</strong> (1) 99% = <strong>training accuracy</strong> (menghafal!); (2) validasi = <strong>CV acak</strong> &rarr; <em>look-ahead bias</em> (model &ldquo;melihat&rdquo; 2021 saat &ldquo;memprediksi&rdquo; 2019); (3) <strong>200 fitur, 500 observasi</strong> = guaranteed overfit; (4) <strong>tanpa biaya transaksi</strong> &mdash; sinyal kecil habis dimakan <em>spread</em>; (5) <strong>tidak ada paper trade</strong>.</p>
      <p><strong>Live:</strong> &minus;40% tahun pertama. Bukan karena &ldquo;AI tidak bekerja&rdquo;, melainkan karena <strong>tidak ada satu pun disiplin validasi yang dipatuhi</strong>. Setiap dosa di lesson ini mereka lakukan <em>semua</em>.</p>
      <p><strong>Tiga pertanyaan yang menyelamatkan Rp50 miliar:</strong> (1) &ldquo;Tunjukkan <em>walk-forward net of cost</em>&rdquo;; (2) &ldquo;Berapa <em>live track record</em>?&rdquo;; (3) &ldquo;Rasio observasi-fitur berapa?&rdquo; <strong>Jawaban &ldquo;99% akurat&rdquo; tanpa ketiganya = pemasaran, bukan sains.</strong></p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Detektor overfit 30 detik.</strong> Kamu diberi &ldquo;akurasi 95%&rdquo;. Tiga pertanyaan apa yang kamu ajukan <em>pertama</em>? (Jawab: <em>training atau test?</em> &mdash; <em>walk-forward atau CV acak?</em> &mdash; <em>net of cost?</em> Jika tak bisa jawab ketiganya &rarr; abaikan klaimnya.)</p>
      <p><strong>(2) Fitur ke-201.</strong> Modelmu punya 200 fitur &amp; 500 observasi. Seseorang mengusulkan &ldquo;tambah 50 fitur lagi biar pintar&rdquo;. Apa jawabanmu? (Jawab: <strong>TOLAK.</strong> Rasio sudah 2,5 &mdash; tambah fitur = tambah overfit. Yang benar: <em>kurangi</em> ke &lt; 25 via lasso.)</p>
      <p><strong>(3) Regime shift.</strong> Modelmu dilatih 2019&ndash;2023 (bull market). 2024 bear. Apa yang kamu lakukan <em>sebelum</em> deploy? (Jawab: <strong>stress test</strong> di periode bear historis (2020, 2022); jika hancur &rarr; jangan deploy, atau bangun <em>regime-aware</em> model. <strong>Model yang hanya diuji di satu rezim = model untuk rezim itu saja.</strong>)</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Model ML 99% akurat = pasti menghasilkan uang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 99% <strong>training</strong> = overfitting; 99% via <strong>CV acak</strong> di time series = look-ahead bias. Yang penting: <strong>out-of-time test + net of cost</strong>. Banyak model 'akurat' gagal karena <strong>biaya transaksi</strong> memakan sinyal kecil.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin kompleks (deep learning) makin bagus untuk finance.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Finance = <strong>data sedikit, noise besar, rezim berubah</strong> — kebalikan syarat DL. Model sederhana teregularisasi (Ridge, RF kecil) sering menang. Kompleksitas harus <em>dibayar</em> dengan validasi out-of-time yang jauh lebih baik.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Deep learning pasti lebih baik dari regresi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> di data keuangan (noise tinggi, sampel terbatas), <strong>model sederhana sering menang</strong> &mdash; regresi linear + validasi ketat mengalahkan LSTM overfit. Deep learning unggul saat <em>sinyal kuat &amp; data melimpah</em> (citra, bahasa). <strong>Pilih model sesuai <em>rasio sinyal-noise</em>, bukan sesuai tren.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;ML menghilangkan kebutuhan domain knowledge.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <em>feature engineering</em> (fitur apa yang masuk) = 80% keberhasilan &mdash; dan itu <strong>murni domain knowledge</strong>. &ldquo;AI 500 indikator&rdquo; tanpa pemahaman ekonomi = <em>garbage in, garbage out</em> yang mahal. <strong>ML memperkuat analis yang paham; ia tidak menggantikan pemahaman.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Aturan 3 split untuk time series.</strong> Train (fit) → validation (pilih λ/model) → test (sekali saja, di akhir). Test yang diintip berkali-kali = training set baru. Disiplin ini yang memisahkan quant dari penjudi.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Mulai dari baseline bodoh.</strong> 'Prediksi = rata-rata historis' atau 'return besok = 0'. Model ML harus <em>mengalahkan</em> ini secara signifikan — jika tidak, kompleksitasnya sampah.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Protokol ML finansial (tempel di dinding):</strong> (1) <strong>Walk-forward</strong> (bukan CV acak!); (2) <strong>Fitur &lt; observasi/10</strong>; (3) <strong>Lapor net of cost</strong>; (4) <strong>Baseline sederhana dulu</strong> (kalahkan regresi linear sebelum klaim hebat); (5) <strong>Paper trade 3 bulan</strong>. Lima langkah atau jangan percaya backtest-mu sendiri.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Demo Overfitting: Polinomial</h2>
<p>Fit polinomial derajat 1 vs 9 pada data noisy. Lihat train vs test.</p>
<PyodideLab
  title={"Lab 1 — Demo Overfitting"}
  hint={"Ubah DERAJAT 9 -> 2. Test error turun drastis — kompleksitas tepat!"}
  defaultCode={"# Demo overfitting: fit polinomial pada data noisy (from scratch)\nimport random, math\nrandom.seed(21)\nDERAJAT = 9   # ubah: 1 (underfit) | 2-3 (pas) | 9 (overfit!)\nN_TRAIN, N_TEST = 15, 100\n\ndef data(n):\n    xs = [random.uniform(0, 1) for _ in range(n)]\n    return xs, [math.sin(2*math.pi*x) + random.gauss(0, 0.25) for x in xs]\n\ndef solve(A, b):\n    n = len(A); M = [r[:] + [v] for r, v in zip(A, b)]\n    for c in range(n):\n        p = max(range(c, n), key=lambda r: abs(M[r][c])); M[c], M[p] = M[p], M[c]\n        for r in range(n):\n            if r != c:\n                f = M[r][c]/M[c][c]\n                for k in range(c, n+1): M[r][k] -= f*M[c][k]\n    return [M[i][n]/M[i][i] for i in range(n)]\n\ndef fit(xs, ys, d):\n    cols = [[x**p for x in xs] for p in range(d+1)]\n    XtX = [[sum(a*b for a, b in zip(cols[i], cols[j])) for j in range(d+1)] for i in range(d+1)]\n    XtY = [sum(a*b for a, b in zip(cols[i], ys)) for i in range(d+1)]\n    return solve(XtX, XtY)\n\ndef err(beta, xs, ys):\n    return math.sqrt(sum((y - sum(b*x**p for p, b in enumerate(beta)))**2 for x, y in zip(xs, ys))/len(xs))\n\nxtr, ytr = data(N_TRAIN); xte, yte = data(N_TEST)\nbeta = fit(xtr, ytr, DERAJAT)\nprint(f\"Derajat {DERAJAT}: train RMSE={err(beta,xtr,ytr):.3f}, test RMSE={err(beta,xte,yte):.3f}\")\nprint(\"OVERFIT!\" if err(beta,xte,yte) > 0.45 else \"Sehat.\" if err(beta,xte,yte) < 0.35 else \"Bias-variance seimbang.\")\nprint(\"\\nTrain bagus + test jeblok = menghafal noise.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: K-Means From-Scratch (Regime Detection)</h2>
<p>Cluster (return, vol) jadi 2 rezim pasar dengan k-means manual.</p>
<PyodideLab
  title={"Lab 2 — K-Means Rezim"}
  hint={"Ubah K 2 -> 3. Lihat cluster ketiga muncul — berapa K yang 'benar'? (elbow method!)"}
  defaultCode={"# K-means from scratch untuk deteksi rezim pasar\nimport random, math\nrandom.seed(33)\nK = 2   # ubah sesukamu\n# data sintetis: (return, vol) — 2 rezim\npts = [(random.gauss(0.08, 0.5), random.gauss(1.0, 0.3)) for _ in range(60)]\npts += [(random.gauss(-0.5, 1.0), random.gauss(3.0, 0.8)) for _ in range(30)]\n\ncent = random.sample(pts, K)\nfor _ in range(20):\n    cl = [[] for _ in range(K)]\n    for p in pts:\n        j = min(range(K), key=lambda k: (p[0]-cent[k][0])**2 + (p[1]-cent[k][1])**2)\n        cl[j].append(p)\n    cent = [(sum(x for x, _ in c)/len(c), sum(y for _, y in c)/len(c)) for c in cl]\n\nfor i, (c, pts_c) in enumerate(zip(cent, cl)):\n    print(f\"Cluster {i+1}: n={len(pts_c):3d}, pusat=(ret {c[0]:+.2f}, vol {c[1]:.2f})\")\nprint(\"\\nInterpretasi: cluster vol tinggi + return negatif = rezim RISK-OFF.\")\nprint(\"Strategi: kurangi risiko saat di cluster itu.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Model time series → <strong>Walk-forward validation</strong></h3>
<p><strong>Kenapa:</strong> CV acak = look-ahead bias.</p>
<p><strong>Contoh nyata:</strong> 6 fold tahunan.</p>
</div>
<div className="decision-card">
<h3>2. Banyak fitur, sedikit data → <strong>Ridge/Lasso + validasi</strong></h3>
<p><strong>Kenapa:</strong> Cegah overfitting; Lasso seleksi otomatis.</p>
<p><strong>Contoh nyata:</strong> 50 rasio, 100 observasi.</p>
</div>
<div className="decision-card">
<h3>3. Train bagus, test jeblok → <strong>Sederhanakan / regularisasi</strong></h3>
<p><strong>Kenapa:</strong> Overfit: menghafal noise.</p>
<p><strong>Contoh nyata:</strong> Turunkan derajat polinomial.</p>
</div>
<div className="decision-card">
<h3>4. Deteksi rezim pasar → <strong>Clustering (k-means)</strong></h3>
<p><strong>Kenapa:</strong> Unsupervised menemukan struktur.</p>
<p><strong>Contoh nyata:</strong> Risk-on/off untuk alokasi.</p>
</div>
<div className="decision-card">
<h3>5. Model &ldquo;akurat 99%&rdquo; → <strong>Tanya: training atau test? Walk-forward? Net of cost?</strong></h3>
<p><strong>Kenapa:</strong> 99% training = overfit sampai terbukti sebaliknya.</p>
<p><strong>Contoh nyata:</strong> Startup AI −40% live = training 99%, validasi abal-abal.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Walk-forward</strong> untuk time series.</li><li><strong>Baseline bodoh</strong> dulu.</li><li><strong>Test sekali</strong>, di akhir.</li><li><strong>Regularisasi</strong> saat fitur banyak.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: AI 'Akurat 99%' −40%</h2>
<div className="callout">
<p>Startup: klaim 99% akurat (training), validasi CV acak. Live: −40% setahun.</p>
<p><strong>Vignette lanjutan.</strong> Startup AI klaim &ldquo;99% akurat&rdquo; (training!), validasi pakai CV acak. Live trading: &minus;40% setahun. Investigasi: 200 fitur, 500 observasi, tanpa biaya transaksi di backtest, tidak ada <em>paper trade</em>.</p>
<p><strong>Pertanyaan:</strong> (a) Dua dosa validasi? (b) Protokol benar? (c) Kenapa &lsquo;akurat&rsquo; ≠ profit? (d) Hitung rasio observasi-fitur &amp; simpulkan. (e) Jika kamu investor, tiga pertanyaan <em>due diligence</em> sebelum tanam modal?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tidak ada test set jujur</strong> (99% = training = overfit) dan <strong>CV acak di time series</strong> = look-ahead bias.</p>
<p>(b) <strong>Walk-forward</strong>: train → validation (pilih model) → test sekali. Lapor <strong>net of cost</strong>.</p>
<p>(c) <strong>Akurasi ≠ edge</strong>: prediksi benar 60% tapi win kecil/loss besar = rugi; <strong>biaya transaksi</strong> memakan sinyal kecil.</p>
<p>(d) <strong>Rasio = 500/200 = 2,5 observasi per fitur</strong> &mdash; jauh di bawah minimal 10! <strong>Guaranteed overfit</strong> secara matematis. Model ini <em>tidak mungkin</em> generalisasi &mdash; 99% training adalah artefak, bukan prestasi.</p>
<p>(e) <strong>Tiga pertanyaan DD:</strong> (1) &ldquo;Tunjukkan <em>walk-forward</em> net of cost &mdash; bukan training accuracy&rdquo;; (2) &ldquo;Berapa <em>live/paper</em> track record?&rdquo; (nol = belum terbukti); (3) &ldquo;Apa yang terjadi saat <em>regime berubah</em>?&rdquo; (model 2021 bull mungkin hancur di 2022 bear). <strong>Tidak bisa jawab ketiganya = jangan invest.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Realitas ML Finansial</h2>
      <h3>1. Concept drift &mdash; pasar berubah, model basi</h3>
      <p>Model 2019 (pre-COVID) hancur di 2020 &mdash; <strong>distribusi data berubah</strong> (<em>concept drift</em>). Solusi: <em>monitoring</em> performa live vs validasi; <em>retrain</em> berkala dengan <em>rolling window</em>; <em>regime detection</em> untuk switch model. <strong>Model finansial = makhluk hidup yang butuh makan (data baru) rutin.</strong></p>
      <h3>2. Interpretability &mdash; SHAP untuk kepercayaan</h3>
      <p>Regulator &amp; klien menuntut &ldquo;kenapa model memutuskan ini?&rdquo; <strong>SHAP values</strong> mengurai kontribusi tiap fitur per prediksi. Praktis: jika fitur #1 = &ldquo;noise acak&rdquo;, modelmu <em>salah</em> meski akurat. <strong>Di keuangan, model yang tidak bisa dijelaskan = model yang tidak bisa dipercaya.</strong></p>
      <h3>3. Alternative data &mdash; emas atau jebakan?</h3>
      <p>Data satelit, sentimen, kartu kredit = <em>edge</em> potensial. Tapi: <strong>mahal</strong>, <strong>pendek historisnya</strong> (overfit!), dan <strong>alpha decay</strong> (saat semua pakai, edge hilang). Aturan: uji <em>incremental value</em> di atas model baseline &mdash; jika tidak menambah, jangan bayar.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Pilih model</h3>
      <p>Train err: A 3%, B 6%. Valid err: A 18%, B 8%. Pilih &amp; kenapa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong>B.</strong> A overfit (3%&rarr;18%); B generalisasi (6%&rarr;8%). Pilih <em>validation</em> terkecil, bukan training.</p>
      </details>
      <h3>Drill 2 &mdash; Rasio fitur</h3>
      <p>300 observasi, 40 fitur. Masalah? Solusi?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Rasio 7,5 &lt; 10 &rarr; <strong>rawan overfit</strong>. Solusi: lasso/PCA &rarr; &lt; 15 fitur, atau kumpulkan data lebih banyak.</p>
      </details>
      <h3>Drill 3 &mdash; Walk-forward</h3>
      <p>Data 2020&ndash;2024, train 2 thn, test 1 thn. Berapa fold &amp; sebutkan.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>3 fold:</strong> train 20&ndash;21&rarr;test 22; train 21&ndash;22&rarr;test 23; train 22&ndash;23&rarr;test 24.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette leakage</h3>
      <p>Model memakai &ldquo;return hari ini&rdquo; sebagai fitur untuk prediksi &ldquo;return hari ini&rdquo;. Masalah?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Data leakage total!</strong> Fitur = target = &ldquo;akurasi 100%&rdquo; yang tidak bermakna. Fitur harus <em>tersedia sebelum</em> periode prediksi.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Validasi benar untuk model time series?"}
  options={
    ["CV acak 5-fold",
    "Walk-forward (train masa lalu → test masa depan)",
    "Tidak perlu validasi",
    "Test = training"]
  }
  correct={1}
  explanation={"Benar: CV acak 'membocorkan' masa depan ke training (look-ahead). Walk-forward meniru live trading."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Train R² 0,92, test 0,15. Diagnosis?"}
  options={
    ["Model bagus",
    "Overfitting — sederhanakan/regularisasi",
    "Data salah",
    "Tambah fitur"]
  }
  correct={1}
  explanation={"Benar: gap train-test = menghafal noise. Solusi: Ridge/Lasso, kurangi kompleksitas, atau tambah data."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Lasso vs Ridge. Kelebihan Lasso?"}
  options={
    ["Tidak ada",
    "L1 membuat koefisien = 0 (seleksi variabel otomatis)",
    "Lebih cepat",
    "Tidak butuh λ"]
  }
  correct={1}
  explanation={"Benar: Lasso = seleksi + estimasi sekaligus. Ridge hanya menciutkan. Untuk 50 fitur → Lasso menemukan yang penting."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. K-means pada (return, vol) menemukan cluster vol-tinggi/return-negatif. Gunakan untuk?"}
  options={
    ["Diabaikan",
    "Regime detection — defensif saat risk-off",
    "Beli saat risk-off",
    "Tidak ada gunanya"]
  }
  correct={1}
  explanation={"Benar: unsupervised menemukan struktur. Rezim risk-off = kurangi eksposur (strategi regime-switching)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Model 'akurat 80%' tapi live rugi. Penjelasan paling mungkin?"}
  options={
    ["Akurasi salah hitung",
    "Biaya transaksi + win/loss asymmetry memakan edge",
    "Pasar jahat",
    "Komputer lambat"]
  }
  correct={1}
  explanation={"Benar: akurasi ≠ profit. Sinyal kecil habis di biaya; 80% win kecil vs 20% loss besar = rugi. Ukur net of cost."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Model: training error 2%, validation error 15%. Diagnosis & tindakan?"}
  options={
    ["Underfit — tambah kompleksitas",
    "Overfit — sederhanakan/regularisasi, validasi walk-forward",
    "Data kurang — kumpulkan 10x lipat",
    "Normal — lanjutkan ke live trading"]}
  correct={1}
  explanation={"Benar: gap 2%→15% = overfit klasik (menghafal). Tindakan: sederhanakan, regularisasi, fitur<obs/10, dan validasi walk-forward sebelum percaya."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Supervised</strong>: regresi &amp; klasifikasi; <strong>walk-forward</strong> untuk time series.</li>
<li><strong>Bias-variance</strong>: sederhana = bias, kompleks = variance; target = seimbang.</li>
<li><strong>Ridge (L2)</strong> menciutkan; <strong>Lasso (L1)</strong> menyeleksi (→ 0).</li>
<li><strong>Unsupervised</strong>: k-means (rezim), PCA (kompresi faktor).</li>
<li><strong>Metrik</strong>: RMSE, AUC; untuk default: recall.</li>
<li><strong>Aturan</strong>: baseline bodoh dulu; test sekali; lapor net of cost.</li>

<li><strong>Supervised:</strong> pilih model sesuai sinyal-noise; mulai sederhana.</li>
<li><strong>Overfitting:</strong> gap train-validasi; obat = data, regularisasi, walk-forward.</li>
<li><strong>Unsupervised:</strong> clustering/PCA untuk struktur &amp; diversifikasi.</li>
<li><strong>Kapan TIDAK pakai:</strong> ML tanpa walk-forward; fitur &gt; obs/10; akurasi sebagai metrik profit; model tanpa monitoring drift.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b2-timeseries" className="btn btn-secondary btn-sm">← PM-B2</Link>
        <Link href="/learn/pm-b4-valuasi-ekuitas" className="btn btn-primary btn-sm">PM-B4 →</Link>
      </div>
    </div>
  );
}

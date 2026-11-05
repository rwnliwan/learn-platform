"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB1RegresiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B1 — Portfolio Management</span>
        <h1 className="display-title">Regresi Berganda:<br/>Model & Misspesifikasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Model 'Sempurna' yang Hancur di 2008</a></li>
<li><a href="#berganda">Regresi Berganda</a></li>
<li><a href="#misspesifikasi">4 Misspesifikasi Klasik</a></li>
<li><a href="#aplikasi">Regresi untuk Investasi</a></li>
<li><a href="#sintesis">Sintesis: Alat Bedah</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Fund 2008</a></li>
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
<li>Menjelaskan interpretasi koefisien parsial dan dummy variable.</li>
<li>Membedakan R² vs adjusted R² dan kapan memakainya.</li>
<li>Mengidentifikasi 4 misspesifikasi: penyebab, deteksi, koreksi.</li>
<li>Menjelaskan aplikasi regresi untuk alpha & factor exposure.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Model 'Sempurna' yang Hancur di 2008</h2>
      <div className="story">
        <p><strong>Quant fund</strong> membangun model return saham: R² <strong>0,94</strong>, semua koefisien signifikan. <em>&ldquo;Model terbaik yang pernah kami buat.&rdquo;</em> 2008: model <strong>kolaps</strong> — prediksi meleset total.</p>
<p>Twist-nya: R² 0,94 adalah <strong>artefak</strong>. Model menderita <strong>autokorelasi residual</strong> (error berkorelasi antar-waktu → t-stat <em>palsu</em> signifikan) dan <strong>overfitting</strong> (12 variabel untuk 40 observasi). Ujian diagnostik tidak pernah dijalankan. <strong>Regresi tanpa diagnostik = ramalan cuaca tanpa melihat langit.</strong> Lesson ini: membangun model yang <em>jujur</em>.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="berganda">Regresi Berganda — Ceteris Paribus</h2>
<p><strong>Definisi.</strong> <strong>Regresi berganda</strong>: Y = b0 + b1X1 + b2X2 + … + ε. <strong>Interpretasi parsial</strong>: b1 = efek X1 <em>dengan X lain konstan</em> (ceteris paribus). <strong>Dummy variable</strong>: 0/1 untuk kategori (mis. krisis = 1). <strong>Adjusted R²</strong> = R² yang <strong>dihukum</strong> tiap tambah variabel — naikkan hanya jika variabel benar-benar membantu.</p>
<p>Aturan: <strong>R² selalu naik</strong> tambah variabel (bahkan sampah!). <strong>Adjusted R²</strong> yang jujur.</p>
<Tex math={String.raw`Y = b_0 + b_1 X_1 + b_2 X_2 + \epsilon \quad;\quad \bar{R}^2 = 1 - (1-R^2)\frac{n-1}{n-k-1}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`b_1`} />: efek X1 jika X2, X3, … ditahan konstan</li>
<li><Tex math={String.raw`\bar{R}^2`} />: adjusted R² — turun jika variabel baru tidak berguna</li>
<li><Tex math={String.raw`k`} />: jumlah variabel independen</li>
<li>Dummy: koefisien = selisih rata-rata Y antar-kategori</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Koefisien parsial seperti <strong>menimbang satu bahan kue sambil bahan lain ditahan</strong>: b1 = 'tambah 1 telur, kue mengembang berapa <em>jika tepung &amp; gula tetap</em>'. Tanpa 'ditahan', efek tercampur.</p>
<p><strong>Kapan dipakai:</strong> Model multifaktor return; kontrol variabel di riset.</p>
<p><strong>Pendalaman intuisi &mdash; regresi berganda = &ldquo;menahan yang lain&rdquo;.</strong> Koefisien b₁ = 1,5 artinya: <em>jika x₂, x₃, ... ditahan konstan</em>, naik 1 satuan x₁ &rarr; y naik 1,5. Frasa &ldquo;<em>ceteris paribus</em>&rdquo; ini yang membedakan regresi berganda dari korelasi sederhana &mdash; dan yang membuatnya powerful <em>dan</em> berbahaya: jika x₂ berkorelasi dengan x₁ tapi <em>tidak</em> dimasukkan (omitted), b₁ &ldquo;mencuri&rdquo; efek x₂. <strong>Koefisien hanya sejujur variabel yang kamu masukkan.</strong></p><details className="worked">
<summary>📐 Contoh: Return vs 2 faktor (klik untuk buka)</summary>
<p>R = 0,01 + 1,2×MKT − 0,3×SIZE. <strong>b_MKT = 1,2</strong>: pasar naik 1% → return naik 1,2% (X lain konstan). <strong>b_SIZE = −0,3</strong>: tilt ke big-cap.</p>
<p>R² = 0,72, adjusted = 0,70 (n=60, k=2) — sehat. Tambah 5 variabel sampah: R² → 0,75, <strong>adjusted → 0,68</strong> (turun!). <strong>Keputusan</strong>: tolak variabel sampah.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Membaca output regresi berganda</summary>
<p><strong>Soal:</strong> R = 0,5 + 1,2&times;MKT &minus; 0,8&times;SIZE + 0,4&times;VALUE. MKT naik 2%, SIZE naik 1%, VALUE turun 1%. Prediksi &Delta;R?</p>
<p><strong>Langkah 1:</strong> &Delta;R = 1,2(2%) &minus; 0,8(1%) + 0,4(&minus;1%) = 2,4% &minus; 0,8% &minus; 0,4% = <strong>+1,2%</strong>.</p>
<p><strong>Langkah 2 &mdash; baca koefisien:</strong> 1,2 = beta pasar (agresif); &minus;0,8 = <em>size tilt</em> negatif (cenderung <em>large-cap</em>); +0,4 = <em>value tilt</em>. <strong>Regresi ini = &ldquo;sidik jari&rdquo; gaya manajer.</strong></p>
<p><strong>Jebakan:</strong> koefisien &minus;0,8 <em>bukan</em> berarti &ldquo;size menyebabkan return turun&rdquo; &mdash; ia berarti <em>setelah mengontrol MKT &amp; VALUE</em>, eksposur size berhubungan negatif. <strong>Bahasa regresi = asosiasi terkontrol, bukan kausasi.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Dummy variable &mdash; mengkode kategori</summary>
<p><strong>Soal:</strong> model return dengan dummy krisis (1 = 2008/2020, 0 = lainnya): R = 0,8 + 1,1&times;MKT &minus; 15&times;KRISIS. Interpretasikan.</p>
<p><strong>Langkah 1:</strong> koefisien &minus;15 = <strong>pergeseran intercept</strong> saat krisis: return <em>rata-rata</em> 15pp lebih rendah, <em>setelah</em> mengontrol pasar.</p>
<p><strong>Langkah 2 &mdash; perluasan:</strong> tambah interaksi MKT&times;KRISIS: koefisiennya mengukur <strong>perubahan beta saat krisis</strong> (biasanya naik! &mdash; <em>correlation breakdown</em>).</p>
<p><strong>Pelajaran:</strong> dummy mengubah regresi menjadi <strong>mesin perbandingan rezim</strong>. Tanpa dummy, model &ldquo;rata-rata&rdquo; menutupi perbedaan krisis vs normal &mdash; dan rata-rata dari dua rezim = tidak mewakili keduanya.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Adjusted R&sup2; &mdash; penalti kejujuran</summary>
<p><strong>Soal:</strong> Model A: R&sup2; = 0,80, 3 variabel, n = 100. Model B: R&sup2; = 0,82, 10 variabel, n = 100. Mana lebih baik?</p>
<p><strong>Langkah 1:</strong> adj-R&sup2; = 1 &minus; (1&minus;R&sup2;)(n&minus;1)/(n&minus;k&minus;1). A: 1 &minus; 0,2&times;99/96 = <strong>0,794</strong>. B: 1 &minus; 0,18&times;99/89 = <strong>0,800</strong>.</p>
<p><strong>Langkah 2:</strong> B masih menang tipis &mdash; tapi <strong>selisihnya menyusut</strong> dari 2pp menjadi 0,6pp. Dengan 15 variabel, B bisa kalah.</p>
<p><strong>Intuisi:</strong> R&sup2; biasa <em>selalu</em> naik tambah variabel (bahkan variabel acak!). Adjusted R&sup2; mengenakan <strong>&ldquo;pajak kompleksitas&rdquo;</strong> &mdash; variabel baru harus <em>membayar</em> pajaknya dengan penjelasan yang nyata. <strong>Jangan pernah bandingkan model beda jumlah variabel dengan R&sup2; mentah.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Autokorelasi &amp; DW.</strong> Durbin-Watson &asymp; 2 = bersih; <strong>&lt; 1,5 = autokorelasi positif</strong> (kasus fund 2008: DW 0,7!). Dampak: SE <em>terlalu kecil</em> &rarr; t-stat <em>terlalu besar</em> &rarr; &ldquo;semua signifikan&rdquo; palsu. Solusi: <strong>Newey-West SE</strong> (praktis) atau modelkan dinamikanya (AR). Soal CFA <em>suka</em> memberi DW = 0,7 lalu bertanya &ldquo;apakah t-stat bisa dipercaya?&rdquo; &mdash; jawabannya <strong>tidak</strong>.</p>
</div>

<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [0.5,-0.3,0.8,-0.6,0.4,-0.5,0.7,-0.4,0.3,-0.6], type: "scatter", mode: "markers", marker: {color: "#2ca02c", size: 10}, name: "Sehat (acak)"}, {x: [11,12,13,14,15,16,17,18,19,20], y: [0.2,0.5,1.1,1.8,2.5,3.2,4.0,4.8,5.5,6.2], type: "scatter", mode: "markers", marker: {color: "#d62728", size: 10}, name: "Corong (heteroskedastis)"}]}
  title={"Residual plot: acak (sehat) vs corong (sakit)"}
  layout={{xaxis: {title: "Fitted value (kiri: model A, kanan: model B)"}, yaxis: {title: "Residual"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiap titik = residual satu observasi. Hijau (kiri) = model sehat; merah (kanan) = model bermasalah.</p>
<p><strong>Interpretasi:</strong> Hijau <strong>menyebar acak</strong> di sekitar nol &mdash; tidak ada pola = asumsi homoskedastisitas terpenuhi. Merah <strong>melebar seperti corong</strong> = varians residual tumbuh dengan fitted value = <strong>heteroskedastisitas</strong> &rarr; SE salah &rarr; t-stat palsu. <strong>Plot ini 10 detik; mengabaikannya bisa meruntuhkan seluruh inferensi.</strong></p>
</div>
<h2 id="misspesifikasi">4 Misspesifikasi — Penyakit Model</h2>
<p><strong>Definisi.</strong> <strong>(1) Omitted variable</strong>: variabel penting hilang → koefisien <em>bias</em>. <strong>(2) Heteroskedastisitas</strong>: varians residual tidak konstan → SE salah (t-stat tidak valid). <strong>(3) Multikolinearitas</strong>: X saling berkorelasi → koefisien tidak stabil (tanda bisa terbalik!). <strong>(4) Autokorelasi</strong>: residual berkorelasi antar-waktu → t-stat <em>terlalu optimis</em> (dosa fund 2008).</p>
<p><strong>Deteksi</strong>: plot residual vs fitted (corong = hetero), VIF &gt; 10 (multikol), Durbin-Watson ≈ 2 sehat / jauh dari 2 = autokorelasi. <strong>Koreksi</strong>: tambah variabel, White SE, drop/gabung variabel, Newey-West/model AR.</p>
<p><strong>Kepribadian/intuisi:</strong> Misspesifikasi seperti <strong>penyakit dengan gejala khas</strong>: omitted = <em>demam</em> (bias, model 'panas' salah arah); hetero = <em>tekanan darah tak stabil</em> (SE naik-turun); multikol = <em>kembar siam</em> (tak bisa dipisah); autokorelasi = <em>batuk menular</em> antar-periode. <strong>Diagnosis dulu, obat kemudian.</strong></p>
<p><strong>Kapan dipakai:</strong> Setiap regresi time series / cross-section: jalankan 4 cek.</p>
<p><strong>Pendalaman intuisi &mdash; misspecification = model buta.</strong> Lima dosa: (1) <em>omitted variable</em> (variabel penting tidak masuk &rarr; bias), (2) <em>irrelevant variable</em> (masuk tapi tidak perlu &rarr; varians membengkak), (3) <em>salah bentuk fungsi</em> (nonlinear dipaksa linear), (4) <em>heteroskedastisitas</em> (varians residual tidak konstan &rarr; SE salah), (5) <em>autokorelasi</em> (residual berkorelasi &rarr; t-stat palsu). <strong>R&sup2; 0,94 dengan 5 dosa = angka cantik yang berbohong.</strong> Diagnostik bukan opsional &mdash; ia <em>adalah</em> analisisnya.</p><details className="worked">
<summary>📐 Contoh: Autopsi fund 2008 (klik untuk buka)</summary>
<p><strong>Gejala:</strong> DW = 0,7 (jauh &lt; 2) → <strong>autokorelasi positif</strong>. t-stat 'signifikan' ternyata <em>inflated</em>.</p>
<p><strong>Koreksi:</strong> Newey-West SE → 3 dari 12 variabel jadi <strong>tidak signifikan</strong>. R² '0,94' runtuh jadi model jujur R² 0,55.</p>
<p><strong>Pelajaran:</strong> signifikansi tanpa SE yang benar = ilusi. Selalu uji DW untuk data time series.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Omitted variable bias &mdash; matematika pencurian</summary>
<p><strong>Soal:</strong> model benar: R = 1 + 2&times;SKILL + 3&times;LUCK. Kamu meregresi R hanya pada SKILL. Corr(SKILL, LUCK) = 0,5; Var proporsional sama. Berapa bias koefisien SKILL?</p>
<p><strong>Langkah 1 &mdash; rumus:</strong> bias = &beta;_omitted &times; Cov(SKILL,LUCK)/Var(SKILL) = 3 &times; 0,5 = <strong>+1,5</strong>.</p>
<p><strong>Langkah 2:</strong> koefisien terestimasi = 2 + 1,5 = <strong>3,5</strong> (vs benar 2,0) &mdash; <strong>75% lebih besar!</strong></p>
<p><strong>Versi pasar modal:</strong> meregresi return pada <em>ESG score</em> tanpa mengontrol <em>sektor &amp; size</em> &rarr; koefisien ESG &ldquo;mencuri&rdquo; efek sektor teknologi (yang kebetulan ESG-nya tinggi). <strong>Klaim &ldquo;ESG outperform&rdquo; tanpa kontrol = omitted variable bias yang dikemas sebagai <em>insight</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Heteroskedastisitas &mdash; corong residual</summary>
<p><strong>Soal:</strong> residual plot menyebar melebar saat fitted value besar (bentuk corong). Konsekuensi &amp; solusi?</p>
<p><strong>Konsekuensi:</strong> koefisien <strong>tetap unbiased</strong> &mdash; tapi <strong>standard error salah</strong> (biasanya <em>terlalu kecil</em>) &rarr; t-stat <em>terlalu besar</em> &rarr; &ldquo;signifikan&rdquo; palsu!</p>
<p><strong>Solusi:</strong> (1) <strong>White/robust SE</strong> &mdash; perbaiki SE tanpa ubah koefisien (praktis); (2) <strong>WLS</strong> &mdash; boboti observasi (efisien jika tahu bentuknya); (3) <strong>transformasi</strong> (log) jika varians ∝ level.</p>
<p><strong>Contoh pasar:</strong> regresi return vs ukuran perusahaan &mdash; saham kecil volatilitasnya jauh lebih besar &rarr; corong klasik. <strong>Selalu plot residual vs fitted</strong> &mdash; 10 detik yang menyelamatkan dari t-stat palsu.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: VIF &mdash; detektor multikolinearitas</summary>
<p><strong>Soal:</strong> regresi dengan MKT, SIZE, VALUE. VIF: MKT 1,2; SIZE 8,5; VALUE 9,1. Masalah?</p>
<p><strong>Langkah 1:</strong> VIF &gt; 5 = waspada, &gt; 10 = serius. SIZE &amp; VALUE &asymp; 9 &rarr; <strong>hampir kolinear</strong> (masuk akal: <em>value</em> dan <em>size</em> berkorelasi di banyak pasar).</p>
<p><strong>Langkah 2 &mdash; dampak:</strong> SE koefisien SIZE &amp; VALUE <strong>membengkak</strong> &rarr; keduanya bisa &ldquo;tidak signifikan&rdquo; padahal <em>bersama-sama</em> penting. <strong>Multikolinearitas tidak bias koefisien &mdash; ia membuat mereka <em>tidak presisi</em>.</strong></p>
<p><strong>Solusi:</strong> (1) buang salah satu (jika redundan); (2) gabung jadi faktor; (3) <em>ridge regression</em>; (4) tambah data. <strong>Jangan</strong>: menghapus keduanya &mdash; itu omitted variable bias!</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [0.5,-0.3,0.8,-1.2,2.1,-2.5,3.2,-3.8,4.5,-5.2], type: "scatter", mode: "markers", marker: {color: "#ef4444"}, name: "residual"}, {x: [1,2,3,4,5,6,7,8,9,10], y: [1,2,3,4,5,6,7,8,9,10], type: "scatter", mode: "markers", marker: {color: "#2a7de1", opacity: 0}, showlegend: false}]}
  title={"Residual vs fitted: pola corong (heteroskedastisitas)"}
  layout={{xaxis: {title: "Fitted value"}, yaxis: {title: "Residual"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Titik merah = residual. Perhatikan sebarannya melebar ke kanan (corong).</p>
<p><strong>Interpretasi:</strong> Corong = <strong>heteroskedastisitas</strong>: varians error membesar dengan fitted. Akibat: SE bias → uji-t tidak valid. Solusi: <strong>White robust SE</strong> atau transformasi (log). Residual yang sehat = awan acak tanpa pola.</p>
</div>
<h2 id="aplikasi">Aplikasi — Dari Alpha ke Factor</h2>
<p><strong>Definisi.</strong> <strong>Event study</strong>: regresi return vs pasar di <em>event window</em> → <strong>abnormal return</strong> = aktual − prediksi. <strong>Factor exposure</strong>: regresi return portofolio ke faktor (MKT, SMB, HML) → koefisien = <em>loading</em>, intersep = <strong>alpha</strong>.</p>
<p>Jembatan ke PM-B8/PM-D3: inilah mesin Fama-French &amp; evaluasi manajer.</p>
<Tex math={String.raw`AR_t = R_t - (\hat{\alpha} + \hat{\beta} R_{m,t})`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`AR_t`} />: abnormal return — 'kejutan' di luar gerakan pasar</li>
<li><Tex math={String.raw`\hat{\alpha}, \hat{\beta}`} />: dari estimation window (sebelum event)</li>
<li>CAR = Σ AR_t selama event window → uji signifikansi</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Event study seperti <strong>mengukur demam</strong>: suhu normal (prediksi pasar) vs suhu aktual — selisihnya = demam (abnormal) akibat 'infeksi' (event). Tanpa baseline, demam tak terukur.</p>
<p><strong>Kapan dipakai:</strong> Uji dampak merger/kebijakan; ukur alpha manajer.</p>
<p><strong>Pendalaman intuisi &mdash; event study = interogasi pasar.</strong> Harga saham &ldquo;seharusnya&rdquo; bergerak mengikuti model (mis. CAPM). Saat ada pengumuman merger, selisih aktual vs model = <strong><em>abnormal return</em></strong> &mdash; &ldquo;kesaksian&rdquo; pasar tentang berita itu. Akumulasi beberapa hari (CAR) = vonis pasar. <strong>Event study mengubah opini (&ldquo;pasar suka merger ini&rdquo;) menjadi angka yang bisa diuji.</strong></p><details className="worked">
<summary>📐 Contoh: Merger announcement (klik untuk buka)</summary>
<p>α̂ = 0,001, β̂ = 1,1. Hari pengumuman: R = 5%, R_m = 1%.</p>
<p><strong>AR</strong> = 5% − (0,1% + 1,1×1%) = 5% − 1,2% = <strong>+3,8%</strong>.</p>
<p>Uji: t = 3,8%/1,5% (SE) = 2,53 &gt; 1,96 → <strong>signifikan</strong>. Pasar menyukai merger ini — bukan sekadar ikut pasar naik.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Event study &mdash; CAR merger</summary>
<p><strong>Soal:</strong> pengumuman akuisisi hari 0. Abnormal return: &minus;1: +0,5%; 0: &minus;3%; +1: &minus;1%. Hitung CAR(&minus;1,+1) &amp; interpretasikan.</p>
<p><strong>Langkah 1:</strong> CAR = 0,5 &minus; 3 &minus; 1 = <strong>&minus;3,5%</strong>.</p>
<p><strong>Langkah 2:</strong> uji: SE CAR &asymp; &sigma;&times;&radic;3; jika &sigma; harian 2% &rarr; SE = 3,46% &rarr; t = &minus;1,01 &rarr; <strong>tidak signifikan</strong> (n=1 perusahaan!).</p>
<p><strong>Pelajaran ganda:</strong> (1) CAR negatif = pasar <em>tidak suka</em> akuisisi ini (mahal? sinergi diragukan?); (2) <strong>satu event ≠ bukti</strong> &mdash; event study butuh <em>sampel</em> banyak event untuk inferensi. Inilah kenapa riset memakai ratusan merger, bukan satu.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Chow test intuitif &mdash; apakah rezim berubah?</summary>
<p><strong>Soal:</strong> regresi beta saham 2015&ndash;2019 vs 2020&ndash;2024 terlihat beda. Bagaimana uji formal?</p>
<p><strong>Langkah 1 &mdash; Chow test:</strong> estimasi (a) pooled (semua data), (b) pisah dua periode. Bandingkan SSE: jika SSE_pooled <strong>jauh</strong> lebih besar dari jumlah SSE_pisah &rarr; <strong>struktural break</strong> (F-test).</p>
<p><strong>Langkah 2 &mdash; alternatif praktis:</strong> dummy KRISIS + interaksi (lihat Contoh 3 berganda) &mdash; <em>ekuivalen</em> Chow tapi memberi tahu <em>koefisien mana</em> yang berubah.</p>
<p><strong>Intuisi pasar:</strong> beta pra- vs pasca-COVID <em>sering</em> beda (model bisnis berubah, leverage berubah). <strong>Regresi 10 tahun tanpa cek break = rata-rata dua dunia.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Signifikan&rdquo; ≠ &ldquo;penting&rdquo;.</strong> Dengan n = 10.000, koefisien 0,001 bisa &ldquo;signifikan&rdquo; &mdash; tapi <strong>ekonomis nol</strong>. Selalu tanyakan <em>ukuran efek</em>: &ldquo;naik 1 SD x &rarr; y berubah berapa?&rdquo; Jika jawabannya &ldquo;0,01%&rdquo; &rarr; abaikan, betapa pun bintangnya.</p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Regresi = Alat Bedah, Bukan Palu</h2>
      <p>Tiga bagian lesson ini = <strong>tiga tahap memakai regresi dengan benar</strong>:</p>
      <ol>
        <li><strong>SPESIFIKASI (berganda):</strong> pilih variabel &amp; bentuk fungsi dengan <em>teori</em> &mdash; bukan <em>fishing</em>. Tanya: &ldquo;variabel apa yang <em>seharusnya</em> ada?&rdquo; sebelum &ldquo;variabel apa yang signifikan?&rdquo;</li>
        <li><strong>DIAGNOSIS (misspecification):</strong> uji 5 dosa &mdash; residual, DW, VIF, White. Model yang tidak didiagnosis = pasien yang tidak di-EKG.</li>
        <li><strong>APLIKASI (event study dkk):</strong> pakai untuk pertanyaan <em>spesifik</em> &mdash; &ldquo;apakah merger ini disukai pasar?&rdquo; &mdash; dengan inferensi yang jujur.</li>
      </ol>
      <p><strong>Mantra:</strong> <em>spesifikasi jujur &rarr; diagnosis ketat &rarr; aplikasi hati-hati</em>. Fund 2008 membalik semuanya: spesifikasi rakus, tanpa diagnosis, aplikasi buta.</p>

      <h3>🎙️ Debat: 12 Variabel vs 3 Variabel</h3>
      <p>Dua quant berdebat membangun model return:</p>
      <p><strong>Quant Kompleks:</strong> &ldquo;12 variabel menangkap <em>nuansa</em>: interaksi sektor-siklus, nonlinearitas, rezim. R&sup2; 0,94 vs 0,70 &mdash; jelas lebih baik. Pasar itu kompleks; model harus kompleks.&rdquo;</p>
      <p><strong>Quant Sederhana:</strong> &ldquo;12 variabel / 40 observasi = <strong>menghafal noise</strong>. Modelku 3 variabel, R&sup2; 0,70 <em>in-sample</em> tapi 0,65 <em>out-of-sample</em> &mdash; punyamu 0,94 jadi 0,30 di luar sampel. <strong>Kompleksitas tanpa validasi = overfitting yang mahal.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> kompleksitas <em>boleh</em> &mdash; jika <strong>dibayar</strong> dengan performa out-of-sample &amp; lolos diagnostik. Aturan: <strong>mulai sederhana, tambah kompleksitas satu per satu, dan setiap tambahan harus <em>membuktikan diri</em> di data yang belum dilihat.</strong></p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;R² tinggi = model bagus. Kejar R² setinggi mungkin.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> R² 0,94 fund 2008 = <strong>artefak autokorelasi + overfitting</strong>. R² naik otomatis tiap tambah variabel. Yang benar: <strong>adjusted R² + diagnostik residual + validasi out-of-sample</strong>. R² tinggi tanpa itu = make-up.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Koefisien tidak signifikan = variabel tidak penting. Buang saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Multikolinearitas</strong> bisa membuat variabel penting <em>tampak</em> tidak signifikan (SE menggembung). Cek VIF dulu — jika &gt; 10, masalahnya korelasi antar-X, bukan variabelnya. Buang membabi buta = omitted variable bias.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;R&sup2; tinggi = model bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> R&sup2; 0,94 dengan 12 variabel/40 observasi (kasus fund) = <strong>overfitting</strong>, bukan kebagusan. R&sup2; naik <em>otomatis</em> tiap tambah variabel. Yang penting: <strong>adjusted R&sup2;, signifikansi yang <em>robust</em> (Newey-West), &amp; performa <em>out-of-sample</em></strong>. Model &ldquo;sempurna&rdquo; di-sample = model yang menghafal, bukan memahami.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Tidak signifikan = tidak ada efek.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> bisa berarti (a) memang tidak ada efek, (b) <strong>sampel kurang</strong> (power rendah), atau (c) <strong>SE membengkak</strong> (multikolinearitas/heteroskedastisitas). &ldquo;Tidak signifikan&rdquo; = <em>belum terbukti</em>, bukan <em>terbukti tidak ada</em>. Bedakan ketiganya sebelum menyimpulkan.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Plot residual SELALU.</strong> 30 detik melihat residual vs fitted + Q-Q plot menangkap 80% masalah (corong, pola, outlier). Angka tanpa gambar = buta.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Untuk time series: DW dulu, interpretasi kemudian.</strong> DW jauh dari 2 → SE salah → semua uji-t diragukan. Perbaiki (Newey-West/lag) baru baca hasil.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist diagnostik 2 menit (wajib sebelum percaya output):</strong> (1) residual vs fitted &rarr; acak? (2) DW &asymp; 2? (3) VIF &lt; 5? (4) adjusted R&sup2; vs R&sup2; jauh? (5) <em>out-of-sample</em> masuk akal? <strong>Lima centang atau jangan presentasikan.</strong> Model yang lolos checklist ini jarang memalukanmu di depan klien.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Regresi Berganda From-Scratch</h2>
<p>Estimasi OLS 2 variabel via normal equations (eliminasi Gauss). Lihat koefisien parsial.</p>
<PyodideLab
  title={"Lab 1 — OLS From-Scratch"}
  hint={"Ubah korelasi X1-X2 (lihat kode). Koefisien jadi tidak stabil — multikolinearitas live!"}
  defaultCode={"# OLS 2 variabel from scratch (normal equations + eliminasi Gauss)\nimport random\nrandom.seed(7)\nn = 60\n# X1, X2 berkorelasi 0.85 -> multikolinearitas!\nX1 = [random.gauss(0, 1) for _ in range(n)]\nX2 = [0.85*x + random.gauss(0, 0.5) for x in X1]\nY = [1 + 2*x1 - 1*x2 + random.gauss(0, 1) for x1, x2 in zip(X1, X2)]\n\ndef solve(A, b):  # eliminasi Gauss\n    n = len(A); M = [r[:] + [v] for r, v in zip(A, b)]\n    for c in range(n):\n        p = max(range(c, n), key=lambda r: abs(M[r][c]))\n        M[c], M[p] = M[p], M[c]\n        for r in range(n):\n            if r != c:\n                f = M[r][c]/M[c][c]\n                for k in range(c, n+1): M[r][k] -= f*M[c][k]\n    return [M[i][n]/M[i][i] for i in range(n)]\n\ncols = [[1]*n, X1, X2]\nXtX = [[sum(a*b for a, b in zip(cols[i], cols[j])) for j in range(3)] for i in range(3)]\nXtY = [sum(a*b for a, b in zip(cols[i], Y)) for i in range(3)]\nb = solve(XtX, XtY)\nprint(f\"b0={b[0]:.2f} (true 1), b1={b[1]:.2f} (true 2), b2={b[2]:.2f} (true -1)\")\nyh = [b[0]+b[1]*x1+b[2]*x2 for x1, x2 in zip(X1, X2)]\nsse = sum((y-h)**2 for y, h in zip(Y, yh)); sst = sum((y-sum(Y)/n)**2 for y in Y)\nr2 = 1-sse/sst\nprint(f\"R2={r2:.3f}, adjR2={1-(1-r2)*(n-1)/(n-3):.3f}\")\nprint(\"\\nX1-X2 berkorelasi 0.85: SE menggembung (multikolinearitas).\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Detektor Heteroskedastisitas</h2>
<p>Uji pola corong: regresikan |residual| ke fitted (uji Breusch-Pagan sederhana).</p>
<PyodideLab
  title={"Lab 2 — Detektor Heteroskedastisitas"}
  hint={"Ubah HETERO 1 -> 0 (homoskedastis). Uji jadi tidak signifikan — sehat!"}
  defaultCode={"# Detektor heteroskedastisitas (Breusch-Pagan sederhana)\nimport random, math\nrandom.seed(11)\nn = 80\nHETERO = 1  # 1 = ada hetero, 0 = sehat (ubah!)\nX = [random.uniform(0, 10) for _ in range(n)]\nsd = [1 + HETERO*0.5*x for x in X]   # varians membesar dengan X\nY = [2 + 3*x + random.gauss(0, s) for x, s in zip(X, sd)]\n\n# OLS sederhana\nmx, my = sum(X)/n, sum(Y)/n\nb1 = sum((x-mx)*(y-my) for x, y in zip(X, Y))/sum((x-mx)**2 for x in X)\nb0 = my - b1*mx\nres = [y-(b0+b1*x) for x, y in zip(X, Y)]\nyh = [b0+b1*x for x in X]\n# regresi |res| ke yh\nmr, mh = sum(abs(r) for r in res)/n, sum(yh)/n\ng = sum((h-mh)*(abs(r)-mr) for h, r in zip(yh, res))/sum((h-mh)**2 for h in yh)\n# t-stat kasar\nprint(f\"slope |res| vs fitted: {g:.3f}\")\nprint(\"KESIMPULAN:\", \"HETEROSKEDASTISITAS terdeteksi (corong!) -> pakai White robust SE\" if abs(g) > 0.08 else \"Homoskedastis (sehat)\")\nprint(\"\\nPlot mental: residual melebar seperti corong ke kanan.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Tambah variabel, R² naik tapi adjR² turun → <strong>Tolak variabel</strong></h3>
<p><strong>Kenapa:</strong> Tidak menambah explanatory power.</p>
<p><strong>Contoh nyata:</strong> Variabel sampah.</p>
</div>
<div className="decision-card">
<h3>2. DW jauh dari 2 (time series) → <strong>Newey-West SE / tambah lag</strong></h3>
<p><strong>Kenapa:</strong> SE bias → uji-t invalid.</p>
<p><strong>Contoh nyata:</strong> Model return 2008.</p>
</div>
<div className="decision-card">
<h3>3. VIF &gt; 10 → <strong>Drop/gabung variabel berkorelasi</strong></h3>
<p><strong>Kenapa:</strong> Koefisien tidak stabil.</p>
<p><strong>Contoh nyata:</strong> X1-X2 korelasi 0,85.</p>
</div>
<div className="decision-card">
<h3>4. Residual corong → <strong>White robust SE / transformasi</strong></h3>
<p><strong>Kenapa:</strong> Heteroskedastisitas.</p>
<p><strong>Contoh nyata:</strong> Regresi cross-section.</p>
</div>
<div className="decision-card">
<h3>5. R² tinggi tapi curiga → <strong>Cek DW, VIF, dan out-of-sample SEBELUM percaya</strong></h3>
<p><strong>Kenapa:</strong> R² buta terhadap 5 dosa misspecification.</p>
<p><strong>Contoh nyata:</strong> Fund 2008: R² 0,94, DW 0,7 → t-stat palsu → kolaps.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Adjusted R²</strong>, bukan R².</li><li><strong>Plot residual</strong> selalu.</li><li><strong>DW ≈ 2</strong> untuk time series.</li><li><strong>VIF &lt; 10</strong>.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Model 'Sempurna' R² 0,94</h2>
<div className="callout">
<p>Quant fund: R² 0,94, 12 variabel, 40 observasi, semua 'signifikan'. 2008: kolaps. Autopsi: DW 0,7.</p>
<p><strong>Vignette lanjutan.</strong> Quant fund: R&sup2; 0,94, 12 variabel, 40 observasi, semua &lsquo;signifikan&rsquo;. 2008: kolaps. Autopsi: DW 0,7, VIF rata-rata 8, dan <em>backtest</em> hanya in-sample. Klien menuntut penjelasan.</p>
<p><strong>Pertanyaan:</strong> (a) Tiga dosa model? (b) Koreksi yang benar untuk tiap dosa? (c) Jika Newey-West membuat hanya 9 dari 12 variabel signifikan &mdash; apa artinya? (d) Rancang <em>checklist</em> pre-launch agar tidak terulang. (e) Bagaimana menjelaskan ke klien tanpa jargon?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Autokorelasi</strong> (DW 0,7 → t-stat inflated), <strong>overfitting</strong> (12 variabel/40 obs), <strong>tanpa diagnostik</strong> (percaya R²).</p>
<p>(b) <strong>Newey-West SE</strong> → hanya 9 variabel signifikan; <strong>validasi out-of-sample</strong>; sederhanakan model.</p>
<p>(c) <strong>Checklist wajib</strong>: residual plot, DW, VIF, adjusted R², backtest out-of-time.</p>
<p>(d) <strong>Arti 9/12:</strong> 3 variabel &ldquo;signifikan&rdquo; hanya karena SE yang <em>salah</em> (terlalu kecil akibat autokorelasi) &mdash; setelah dikoreksi, mereka tidak terbukti. <strong>Model sebenarnya lebih sederhana</strong> dari yang diklaim. Pelajaran: kompleksitas yang tidak robust = ilusi.</p>
<p>(e) <strong>Checklist pre-launch:</strong> (1) <em>train/test split</em> waktu (bukan acak!); (2) lapor <em>out-of-sample</em> R&sup2; (bukan in-sample); (3) Newey-West SE sebagai default; (4) <em>max</em> 1 variabel per 10 observasi; (5) <em>paper trade</em> 3 bulan sebelum modal riil.</p>
<p>(f) <strong>Ke klien:</strong> &ldquo;Model kami terlihat 94% akurat di data lama, tapi 3 dari 12 sinyalnya ternyata <em>noise</em> &mdash; seperti menemukan pola di awan. Kami menyederhanakan ke 9 sinyal yang terbukti, dan mulai sekarang semua model diuji di data yang <em>belum pernah dilihat</em> model. Kerugian Bapak/Ibu menjadi pelajaran termahal &mdash; dan terakhir &mdash; kami.&rdquo; <strong>Jujur + konkret + perbaikan sistem.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Melampaui OLS</h2>
      <h3>1. Endogenitas &mdash; dosa keenam yang paling licik</h3>
      <p><strong>Masalah:</strong> x berkorelasi dengan <em>error</em> &mdash; mis. meregresi <em>insentif manajer</em> (x) pada <em>kinerja</em> (y): perusahaan bagus memberi insentif besar <em>dan</em> berkinerja baik &rarr; kausalitas dua arah! OLS bias <em>ke mana pun</em>.</p>
      <p><strong>Solusi:</strong> <em>instrumental variable</em> (cari z yang memengaruhi x tapi tidak langsung y) atau <em>eksperimen alami</em>. <strong>Standar emas riset modern.</strong> Tanpa ini, klaim kausal dari data observasional = spekulasi berjas.</p>
      <h3>2. Regularisasi &mdash; ridge &amp; lasso</h3>
      <p>Saat variabel banyak &amp; kolinear: <strong>ridge</strong> (L2) <em>menyusutkan</em> koefisien &mdash; stabil tapi tidak menyeleksi. <strong>Lasso</strong> (L1) <em>menyeleksi</em> &mdash; koefisien kecil jadi NOL. <strong>Aturan:</strong> butuh semua variabel tapi stabil &rarr; ridge; butuh model ramping &rarr; lasso. Keduanya dipilih via <em>cross-validation</em> &mdash; bukan <em>feeling</em>.</p>
      <h3>3. Quantile regression &mdash; melampaui rata-rata</h3>
      <p>OLS memodelkan <em>rata-rata</em> bersyarat. Tapi investor sering peduli <em>ekor</em>: &ldquo;bagaimana return 5% terburuk?&rdquo; <strong>Quantile regression</strong> memodelkan kuantil (mis. median, persentil 5) &mdash; robust terhadap outlier &amp; mengungkap <em>asimetri</em> (faktor yang tidak penting untuk rata-rata bisa <em>penting</em> untuk ekor!). <strong>Untuk manajemen risiko, ekor &gt; rata-rata.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Baca koefisien</h3>
      <p>R = 1 + 0,8&times;MKT &minus; 0,5&times;SIZE. MKT +3%, SIZE +2%. &Delta;R?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>&Delta;R = 0,8(3%) &minus; 0,5(2%) = 2,4% &minus; 1% = <strong>+1,4%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Adjusted R&sup2;</h3>
      <p>R&sup2; = 0,75, n = 50, k = 5. Adjusted?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>1 &minus; 0,25&times;49/44 = 1 &minus; 0,278 = <strong>0,722</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; Diagnosis kilat</h3>
      <p>DW = 0,8; VIF max = 12; residual corong. Tiga masalah &amp; tiga solusi (satu baris tiap).</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>(1) <strong>Autokorelasi</strong> &rarr; Newey-West SE; (2) <strong>multikolinearitas</strong> &rarr; buang/gabung variabel; (3) <strong>heteroskedastisitas</strong> &rarr; White SE / transformasi log.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette omitted variable</h3>
      <p>Studi: &ldquo;CEO bergelar MBA &rarr; return 3% lebih tinggi (signifikan).&rdquo; Tanpa kontrol ukuran &amp; sektor. Kritikmu?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Omitted variable bias:</strong> perusahaan besar &amp; sektor teknologi lebih mungkin merekrut MBA <em>dan</em> berkinerja baik &mdash; koefisien MBA &ldquo;mencuri&rdquo; efek size/sektor. Tuntut: kontrol size, sektor, leverage &mdash; atau <em>matching</em>. Tanpa itu, klaim = korelasi berkedok kausasi.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Tambah variabel: R² 0,72→0,75, adjusted 0,70→0,68. Keputusan?"}
  options={
    ["Pertahankan (R² naik)",
    "Tolak — adjusted turun, variabel tidak membantu",
    "Tambah lagi",
    "Tidak bisa diputuskan"]
  }
  correct={1}
  explanation={"Benar: R² selalu naik tambah variabel. Adjusted yang jujur — turun = variabel sampah."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. DW = 0,7 pada regresi time series. Artinya?"}
  options={
    ["Sehat",
    "Autokorelasi positif — SE bias, uji-t terlalu optimis",
    "Heteroskedastisitas",
    "Multikolinearitas"]
  }
  correct={1}
  explanation={"Benar: DW ≈ 2 sehat; jauh di bawah 2 = autokorelasi positif. Dosa fund 2008."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. VIF = 15 untuk X1. Masalah & solusi?"}
  options={
    ["Tidak ada",
    "Multikolinearitas — drop/gabung variabel",
    "Omitted variable",
    "Tambah data"]
  }
  correct={1}
  explanation={"Benar: VIF &gt; 10 = X berkorelasi kuat → koefisien tidak stabil. Solusi: drop atau gabung."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Residual membentuk corong (melebar ke kanan). Ini?"}
  options={
    ["Normal",
    "Heteroskedastisitas — pakai White robust SE",
    "Autokorelasi",
    "Model sempurna"]
  }
  correct={1}
  explanation={"Benar: varians tidak konstan → SE salah. Koreksi: robust SE atau transformasi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Event study: AR = +3,8%, SE = 1,5%. Signifikan (5%)?"}
  options={
    ["Tidak",
    "Ya — t = 2,53 &gt; 1,96",
    "Butuh R²",
    "Tidak bisa diuji"]
  }
  correct={1}
  explanation={"Benar: 3,8/1,5 = 2,53 &gt; 1,96 → tolak H0. Pasar benar-benar bereaksi, bukan noise."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. DW = 0,7 pada regresi return saham. Kesimpulan?"}
  options={
    ["Model bagus — residual kecil",
    "Autokorelasi positif — SE terlalu kecil, t-stat tidak bisa dipercaya",
    "Heteroskedastisitas — transformasi log",
    "Tidak ada masalah — DW < 2 normal"]}
  correct={1}
  explanation={"Benar: DW ≈ 2 = bersih; 0,7 = autokorelasi positif kuat. Dampak: SE underestimate → t-stat inflated → 'signifikan' palsu. Solusi: Newey-West SE."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Parsial</strong>: b1 = efek X1 dengan X lain konstan; dummy = selisih kategori.</li>
<li><strong>Adjusted R²</strong> menghukum variabel sampah.</li>
<li><strong>4 penyakit</strong>: omitted (bias), hetero (SE salah), multikol (tidak stabil), autokorelasi (t inflated).</li>
<li><strong>Deteksi</strong>: residual plot, VIF, DW; <strong>koreksi</strong>: White/Newey-West/drop.</li>
<li><strong>Event study</strong>: AR = aktual − prediksi; CAR untuk window.</li>
<li><strong>Kapan TIDAK percaya regresi</strong>: tanpa diagnostik.</li>

<li><strong>Berganda:</strong> koefisien = efek ceteris paribus; dummy = mesin perbandingan rezim.</li>
<li><strong>Misspecification:</strong> 5 dosa — omitted, heteroskedastisitas, autokorelasi, multikolinearitas, salah fungsi.</li>
<li><strong>Diagnostik:</strong> residual plot, DW≈2, VIF&lt;5, Newey-West, out-of-sample.</li>
<li><strong>Kapan TIDAK pakai:</strong> OLS tanpa diagnostik; R² mentah untuk bandingkan model; inferensi kausal dari observasional tanpa IV.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a10-portfolio-mgmt" className="btn btn-secondary btn-sm">← PM-A10</Link>
        <Link href="/learn/pm-b2-timeseries" className="btn btn-primary btn-sm">PM-B2 →</Link>
      </div>
    </div>
  );
}

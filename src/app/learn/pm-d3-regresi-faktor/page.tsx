"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmD3RegresiFaktorPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-D3 — Portfolio Management</span>
        <h1 className="display-title">Regresi Faktor:<br/>Membedah Alpha</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Alpha 'Bintang' yang Ternyata Beta</a></li>
<li><a href="#capm">Regresi CAPM</a></li>
<li><a href="#ff">Fama-French</a></li>
<li><a href="#style">Style Analysis</a></li>
<li><a href="#sintesis">Sintesis: Alpha</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Bintang Palsu</a></li>
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
<li>Menjalankan regresi CAPM dan membaca outputnya.</li>
<li>Menjelaskan alpha, beta, R², t-statistik.</li>
<li>Menjelaskan faktor Fama-French.</li>
<li>Menguji klaim alpha dengan t-stat.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Alpha 'Bintang' yang Ternyata Beta</h2>
      <div className="story">
        <p><strong>Manajer 'Bintang'</strong>: 5 tahun <strong>alpha +4%/tahun</strong>! Fee 2%. Investor antre. <strong>Analis</strong> menjalankan regresi Fama-French: <em>alpha</em> → <strong>+0,5% (t-stat 0,8)</strong>; <em>loading</em>: <strong>small-cap + value</strong> tinggi.</p>
<p>Twist-nya: 'alpha' = <strong>beta tersamar</strong> (faktor small &amp; value yang sedang bagus!) — bisa direplikasi dengan <strong>ETF 0,2%</strong>. Investor membayar 2% untuk <strong>beta mahal</strong>. <strong>Regresi = kacamata X-ray</strong> klaim manajer. Lesson ini: membedah dengan angka.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="capm">Regresi CAPM — Bedah Pertama</h2>
<p><strong>Definisi.</strong> <strong>Regresi</strong>: R_p − R_f = α + β(R_m − R_f) + ε. <strong>Alpha</strong> (intersep): return <em>di luar</em> pasar — skill? <strong>Beta</strong> (slope): sensitivitas pasar. <strong>R²</strong>: % variasi dijelaskan pasar. <strong>t-stat</strong> = α/SE(α): <strong>|t| &gt; 2</strong> = signifikan!</p>
<p><strong>Aturan</strong>: alpha tanpa t-stat = <strong>anecdote</strong>.</p>
<Tex math={String.raw`R_p - R_f = \alpha + \beta(R_m - R_f) + \varepsilon`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\alpha`} />: alpha (skill? atau noise?)</li>
<li><Tex math={String.raw`\beta`} />: beta (eksposur pasar)</li>
<li><Tex math={String.raw`R^2`} />: 0,95 = closet indexer; 0,5 = aktif beneran</li>
<li><Tex math={String.raw`t = \alpha/SE`} />: |t|&gt;2 = signifikan (95%)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Regresi CAPM seperti <strong>tes DNA</strong>: klaim 'saya unik' (alpha) diuji lab. Hasil: 80% 'unik' = <strong>DNA pasar</strong> (beta) + sedikit <strong>noise</strong>. Tes DNA tidak berbohong — <strong>marketing bisa</strong>.</p>
<p><strong>Kapan dipakai:</strong> Due diligence manajer APAPUN: regresi dulu, kagum kemudian.</p>
<p><strong>Pendalaman intuisi &mdash; alpha = &ldquo;bayaran untuk skill&rdquo;.</strong> Manajer &ldquo;Bintang&rdquo;: return +12%! <em>Hebat</em>? <strong><em>Tunggu</em>!</strong> Pasar +10%! <strong><em>Alpha</em> = 12% &minus; 10% = 2%</strong>! (<em>Beta</em>!). <strong><em>Fee</em> 2%</strong> &rarr; <strong><em>net</em> 0%</strong>! <strong><em>Bayar mahal</em></strong> untuk <strong><em>beta</em></strong>! <strong>Pelajaran:</strong> <strong><em>selalu</em> regresi</strong>! <strong><em>Pisahkan</em> alpha &amp; beta!</strong> <strong><em>Bayar</em> hanya untuk <em>alpha</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Bedah 'Bintang' (klik untuk buka)</summary>
<p>Return 5 tahun: alpha +4%, beta 1,1, R² 0,85, <strong>t-stat 1,2</strong>.</p>
<p><strong>Verdict CAPM</strong>: t &lt; 2 → alpha <strong>tidak signifikan</strong> (bisa noise!). R² 0,85 → <strong>mirip pasar</strong>.</p>
<p><strong>Fama-French</strong>: loading SMB +0,8, HML +0,6 → alpha sisa <strong>+0,5% (t 0,8)</strong>.</p>
<p><strong>Kesimpulan</strong>: bayar 2% untuk <strong>beta small-value</strong> (ETF 0,2%!). <strong>Pecat atau nego.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): CAPM &mdash; alpha</summary>
<p><strong>Soal:</strong> R fund = 12%, Rf = 3%, Rm = 10%, &beta; = 1,2. <em>Alpha</em>?</p>
<p><strong>E(R)</strong> = 3% + 1,2&times;(10%&minus;3%) = <strong>11,4%</strong>.</p>
<p><strong>Alpha</strong> = 12% &minus; 11,4% = <strong>+0,6%</strong>! (<em>Kecil</em>!).</p>
<p><strong><em>Verdict</em>:</strong> <strong><em>hampir</em> semua</strong> = <em>beta</em>! <strong><em>Tidak</em></strong> layak <em>fee</em> mahal!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Beta tinggi &mdash; ilusi</summary>
<p><strong>Soal:</strong> <em>Bull market</em> +20%. Fund &beta; 1,5 &rarr; +30%. <em>Hebat</em>?</p>
<p><strong><em>Tidak</em></strong>! &mdash; <em>E(R)</em> = 3% + 1,5&times;17% = <strong>28,5%</strong>! <strong>Alpha = +1,5%</strong>!</p>
<p><strong><em>Bear</em></strong> &minus;20% &rarr; <strong>&minus;30%</strong>! <strong><em>Beta</em> = <em>pedang</em> bermata dua.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Alpha negatif</summary>
<p><strong>Soal:</strong> R = 8%, E(R) = 10%. <em>Alpha</em>?</p>
<p><strong>Alpha = &minus;2%</strong>! (<em>Merusak</em> nilai!).</p>
<p><strong><em>Tindakan</em>:</strong> <strong><em>pecat</em></strong>! <strong><em>Ganti</em></strong> ETF!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Return tinggi = skill&rdquo;.</strong> <strong>SALAH.</strong> <strong><em>Regresi</em></strong> dulu! <strong><em>Beta</em></strong> &ne; <em>alpha</em>!</p>
</div>
<PlotlyChart
  data={[{x: [-8,-5,-3,0,3,5,8,10], y: [-9,-5.5,-3,0.5,3.5,6,9,11.5], type: "scatter", mode: "markers", marker: {color: "#2a7de1"}, name: "return dana vs pasar"}, {x: [-8,10], y: [-8.8,11.6], type: "scatter", mode: "lines", line: {color: "#ef4444", width: 2}, name: "regresi (β=1,1, α=0,4)"}]}
  title={"Regresi CAPM: slope = beta, intersep = alpha"}
  layout={{xaxis: {title: "Excess return pasar (%)"}, yaxis: {title: "Excess return dana (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Titik = observasi bulanan; garis merah = regresi. Kemiringan = beta; perpotongan sumbu-y = alpha.</p>
<p><strong>Interpretasi:</strong> Garis <strong>curam</strong> (β=1,1) = agresif vs pasar. Intersep <strong>kecil</strong> (α=0,4%) = 'skill' tipis. Titik <strong>mepet garis</strong> (R² tinggi) = tidak banyak <em>unik</em>. <strong>Regresi jujur</strong>: gambar ini &gt; 100 slide marketing.</p>
</div>

<PlotlyChart
  data={[{x: ["Alpha klaim (+4%)", "Alpha regresi (+0,5%)", "Faktor (SMB/HML)", "Fee (2%)"], y: [4, 0.5, 3.5, -2], type: "bar", marker: {color: ["#d62728", "#e8a838", "#2a7de1", "#888"]}, name: "%"}]}
  title={"Alpha +4% yang ternyata beta"}
  layout={{xaxis: {title: ""}, yaxis: {title: "%"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = komponen return.</p>
<p><strong>Interpretasi:</strong> <strong><em>Klaim</em> 4%</strong> &rarr; <strong><em>nyata</em> 0,5%</strong>! <strong><em>Sisanya</em></strong> = <em>faktor</em>! <strong><em>Fee</em> 2%</strong> &rarr; <strong><em>net</em> negatif</strong>! <strong><em>Regresi</em> = <em>kebenaran</em>.</strong></p>
</div>
<h2 id="ff">Fama-French — DNA Lebih Detail</h2>
<p><strong>Definisi.</strong> <strong>FF3</strong>: pasar + <strong>SMB</strong> (small minus big) + <strong>HML</strong> (value minus growth). <strong>FF5</strong>: + <strong>RMW</strong> (profitabilitas) + <strong>CMA</strong> (investasi konservatif).</p>
<p><strong>Gunanya</strong>: bedakan <strong>alpha murni</strong> dari <strong>premi faktor</strong> (yang bisa dibeli murah!).</p>
<Tex math={String.raw`R_p - R_f = \alpha + \beta_m MKT + \beta_s SMB + \beta_v HML + \varepsilon`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>SMB, HML: premi faktor (PM-C8!) — bukan alpha</li>
<li>Alpha FF = setelah <em>semua</em> faktor dikontrol</li>
<li>Jika alpha hilang setelah FF → itu beta tersamar</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> FF seperti <strong>tes DNA lanjutan</strong>: CAPM = tes golongan darah (kasar); FF = <strong>sekuensing</strong> (detail). 'Unik' di tes kasar sering = <strong>keturunan umum</strong> di tes detail (small-value!).</p>
<p><strong>Kapan dipakai:</strong> Manajer 'alpha' — selalu uji FF sebelum bayar mahal.</p>
<p><strong>Pendalaman intuisi &mdash; faktor = &ldquo;rasa&rdquo; return.</strong> <strong>Fama-French:</strong> <em>market</em>! <em>size</em> (SMB!)! <em>value</em> (HML!)! <strong><em>Manajer</em></strong> &ldquo;Bintang&rdquo; = <strong><em>loading</em> SMB/HML tinggi</strong>! <strong><em>Artinya</em>:</strong> <em>beli</em> saham <em>kecil</em> &amp; <em>murah</em>! <strong><em>Bukan</em></strong> <em>skill</em>! <strong><em>Premi faktor</em></strong>! <strong>Pelajaran:</strong> <strong><em>replikasi</em> dengan <em>ETF</em></strong> (0,2%!)! <strong><em>Hemat</em> 1,8%</strong>!</p><details className="worked">
<summary>📐 Contoh: ETF vs manajer (klik untuk buka)</summary>
<p>Manajer: fee 2%, alpha-FF +0,5% (t 0,8). Loading: SMB 0,8, HML 0,6.</p>
<p><strong>Replikasi</strong>: 80% small-value ETF (0,2%) + 20% pasar → return <strong>sama</strong>, fee <strong>0,2%</strong>.</p>
<p><strong>Hemat</strong>: 1,8%/tahun = <strong>Rp180jt per Rp10M</strong>. Regresi 10 menit = <strong>gaji analis setahun</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Fama-French &mdash; dekomposisi</summary>
<p><strong>Soal:</strong> R = 14%. Regresi: &alpha; 0,5% (<em>t</em> 0,8), &beta;_mkt 1,0, &beta;_SMB 0,8, &beta;_HML 0,6. <em>Premi</em>: mkt 7%, SMB 3%, HML 4%. <em>Berapa</em> dari <em>faktor</em>?</p>
<p><strong><em>Faktor</em></strong> = 1,0&times;7% + 0,8&times;3% + 0,6&times;4% = 7% + 2,4% + 2,4% = <strong>11,8%</strong>!</p>
<p><strong>Alpha</strong> = 14% &minus; 3% &minus; 11,8% = <strong>&minus;0,8%</strong>! (<em>Negatif</em>!).</p>
<p><strong><em>Verdict</em>:</strong> <strong><em>beta</em> tersamar</strong>! <strong><em>Replikasi</em></strong> ETF!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Style drift</summary>
<p><strong>Soal:</strong> <em>Manajer</em> &ldquo;<em>value</em>&rdquo;. Regresi: HML <em>loading</em> turun 0,8 &rarr; 0,2. <em>Artinya</em>?</p>
<p><strong><em>Style drift</em></strong>! &mdash; <em>tidak</em> lagi <em>value</em>! <strong><em>Alasan</em>?</strong> <em>Mengejar</em> <em>growth</em>!</p>
<p><strong><em>Tindakan</em>:</strong> <strong><em>tanya</em></strong>! <strong><em>Monitor</em></strong> kuartalan!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Alpha tanpa <em>t-stat</em>.</strong> <strong><em>Cek</em></strong>! <strong><em>t</em> &lt; 2</strong> = <em>ragu</em>!</p>
</div>
<h2 id="style">Style Analysis — Cermin Gaya</h2>
<p><strong>Definisi.</strong> <strong>Style analysis</strong> (Sharpe): regresi return dana ke <em>indeks gaya</em> (large/small × value/growth) dengan <strong>bobot ≥ 0, jumlah = 1</strong> → peta gaya + <strong>selection return</strong> (sisa = skill!).</p>
<p><strong>Gunanya</strong>: 'manajer value' yang loading-nya <em>growth</em> = <strong>style drift</strong> (PM-C4!) — ketahuan!</p>
<p><strong>Kepribadian/intuisi:</strong> Style analysis seperti <strong>tes kepribadian</strong>: ngakunya 'value investor' (kata-kata), hasilnya 'growth chaser' (perbuatan). <strong>Perbuatan &gt; kata-kata</strong> — regresi membaca perbuatan.</p>
<p><strong>Kapan dipakai:</strong> Monitoring manajer: style konsisten dengan mandat?</p>
<p><strong>Pendalaman intuisi &mdash; t-stat = &ldquo;apakah nyata?&rdquo;.</strong> <strong>Alpha +0,5%</strong> (<em>t</em> 0,8!). <strong><em>Signifikan</em>?</strong> <strong><em>Tidak</em></strong>! (<em>t</em> &lt; 2!). <strong><em>Artinya</em>:</strong> <em>bisa</em> <strong><em>kebetulan</em></strong>! <strong><em>Jangan</em></strong> bayar untuk <em>kebetulan</em>! <strong>Pelajaran:</strong> <strong><em>t-stat</em> &gt; 2</strong> = <em>nyata</em>. <strong><em>t-stat</em> &lt; 2</strong> = <em>ragu</em>. <strong><em>Statistik</em></strong> = <em>pelindung</em> dompet.</p><details className="worked">
<summary>📐 Contoh: Drift ketahuan (klik untuk buka)</summary>
<p>Mandat: <em>large-value</em>. Style analysis: <strong>60% large-growth</strong>!</p>
<p><strong>Konfrontasi</strong>: 'FOMO tech 2020?' Manajer: <em>'taktis...'</em> → <strong>style drift</strong> tanpa persetujuan.</p>
<p><strong>Tindakan</strong>: peringatan tertulis / ganti. <strong>Mandat = kontrak</strong>; drift = pelanggaran. Regresi = <strong>polisi gaya</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Style analysis &mdash; holdings vs returns</summary>
<p><strong>Soal:</strong> <em>Holdings</em>: 80% <em>large-cap</em>. <em>Returns-based</em>: <em>loading</em> SMB 0,7. <em>Kontradiksi</em>?</p>
<p><strong><em>Ya</em></strong>! &mdash; <em>Holdings</em> = <em>large</em>, <em>returns</em> = <em>small</em>! <strong><em>Penjelasan</em>:</strong> <em>derivatif</em>? <em>Timing</em>?</p>
<p><strong><em>Investigasi</em></strong>! <strong><em>Jangan</em></strong> percaya <em>satu</em>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Rolling regression</summary>
<p><strong>Soal:</strong> <em>Alpha</em> 36 bulan: +2%, +1%, 0%, &minus;1%, &minus;2%. <em>Tren</em>?</p>
<p><strong><em>Menurun</em></strong>! &mdash; <em>skill</em> <em>memudar</em>? <em>Kapastias</em>?</p>
<p><strong><em>Tindakan</em>:</strong> <strong><em>waspada</em></strong>! <strong><em>Review</em></strong>!</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Bayar untuk Alpha</h2>
      <p>CAPM, FF, style = <strong>satu misi</strong>:</p>
      <ol>
        <li><strong>CAPM:</strong> <em>pisahkan</em> <strong><em>beta</em></strong>!</li>
        <li><strong>FF:</strong> <em>ungkap</em> <strong><em>faktor</em></strong>!</li>
        <li><strong>STYLE:</strong> <em>monitor</em> <strong><em>konsistensi</em></strong>!</li>
      </ol>
      <p><strong><em>Bayar</em> hanya untuk <em>alpha</em> nyata.</strong></p>

      <h3>📖 Panduan Lengkap: Membaca Output Regresi</h3>
      <p><strong><em>Output</em> regresi</strong> punya <strong><em>banyak</em> angka</strong>. <strong><em>Yang penting</em>:</strong> (1) <strong><em>Alpha</em></strong> (intersep!). (2) <strong><em>t-stat alpha</em></strong> (&gt; 2!). (3) <strong><em>Beta</em></strong> (loading!). (4) <strong><em>R&sup2;</em></strong> (<em>penjelasan</em>!). (5) <strong><em>p-value</em></strong> (&lt; 0,05!).</p>
      <p><strong><em>Contoh</em>:</strong> &alpha; = 0,5%, <em>t</em> = 0,8, <em>p</em> = 0,43. <strong><em>Artinya</em>:</strong> <em>tidak</em> signifikan! <strong><em>Jangan</em></strong> bayar!</p>
      <p><strong><em>R&sup2;</em> tinggi</strong> (0,95) = <em>return</em> <strong><em>dijelaskan</em></strong> faktor! <strong><em>R&sup2;</em> rendah</strong> (0,3) = <em>banyak</em> <strong><em>idiosinkratik</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>alpha</em> + <em>t</em> + <em>R&sup2;</em></strong> = <em>tiga</em> serangkai. <strong><em>Hafalkan</em></strong>.</p>
      <h3>📖 Kisah Nyata: Investor yang Hemat Miliaran</h3>
      <p>Tahun 2015, sebuah <em>pension fund</em> <strong><em>hampir</em></strong> hire manajer &ldquo;bintang&rdquo; (<em>fee</em> 2%!). <strong><em>Analis</em> junior</strong> menjalankan <strong><em>regresi</em></strong>. <strong><em>Hasil</em>:</strong> <em>alpha</em> <strong><em>tidak</em> signifikan</strong>! <em>Loading</em> faktor <strong>tinggi</strong>!</p>
      <p><strong><em>Keputusan</em>:</strong> <strong><em>batalkan</em></strong>! <strong><em>Replikasi</em></strong> dengan ETF (0,2%!). <strong><em>Hemat</em>:</strong> <strong>1,8% &times; Rp1T = Rp18M/tahun</strong>!</p>
      <p><strong><em>Junior</em></strong> dipromosikan. <strong><em>Regresi</em></strong> = <em>karier</em>.</p>
      <p><strong><em>Jadilah</em></strong> analis itu.</p>
      <h3>🌍 Faktor Indonesia</h3>
      <p><strong><em>SMB</em></strong> Indonesia = <em>kuat</em>! <strong><em>HML</em></strong> = <em>bervariasi</em>! <strong><em>Uji</em></strong> lokal! <strong><em>Jangan</em></strong> asal <em>impor</em> AS!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>faktor</em> lokal</strong> untuk <em>pasar</em> lokal.</p>
      <h3>🎙️ Debat: &ldquo;Alpha = mati&rdquo;</h3>
      <p><strong>Pasif:</strong> &ldquo;<em>Alpha</em> = <em>nol</em>! <em>Semua</em> = <em>beta</em>!&rdquo;</p>
      <p><strong>Aktif:</strong> &ldquo;<strong><em>Alpha</em> = <em>langka</em></strong>, <em>bukan</em> <em>mati</em>! <strong><em>Cari</em></strong> dengan <em>regresi</em>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>skeptis</em></strong> tapi <strong><em>terbuka</em></strong>.</p>
      <h3>📊 Data Corner: Berapa Alpha Nyata?</h3>
      <p><strong>Studi:</strong> <strong>80%</strong> <em>manajer</em> = <em>alpha</em> <strong><em>negatif</em></strong> (<em>net</em> fee)! <strong><em>Hanya</em> 20%</strong> = <em>positif</em>!</p>
      <p><strong><em>Regresi</em></strong> = <em>filter</em>.</p>
      <h3>🧪 Eksperimen: Regresi Portofoliomu</h3>
      <p><strong><em>Ambil</em></strong> return. <strong><em>Regresi</em></strong> ke IHSG. <strong><em>Alpha</em></strong>? <strong><em>t-stat</em></strong>? <strong><em>Kaget</em></strong>?</p>
      <h3>💡 Prinsip Abadi Faktor</h3>
      <p><strong>(1) <em>Regresi</em>.</strong> (2) <strong><em>t-stat</em>.</strong> (3) <strong><em>Net</em>.</strong> (4) <strong><em>Replikasi</em>.</strong> (5) <strong><em>Monitor</em>.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> <em>Alpha</em>? <strong>Q2:</strong> <em>t-stat</em>? <strong>Q3:</strong> <em>Replikasi</em>? <strong>Q4:</strong> <em>Style drift</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-B1:</strong> <em>regresi</em>! <strong>Ke PM-C5:</strong> <em>evaluasi</em>! <strong>Ke PM-D5:</strong> <em>metrik</em>!</p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> <em>Alpha</em> = ? <strong>A:</strong> <strong>R &minus; E(R)</strong>.</p>
      <p><strong>Q2:</strong> <em>t</em> signifikan? <strong>A:</strong> <strong>&gt; 2</strong>.</p>
      <p><strong>Q3:</strong> <em>Faktor</em> = ? <strong>A:</strong> <strong><em>Beta</em></strong>.</p>
      <p><strong>Q4:</strong> <em>Hemat</em> replikasi? <strong>A:</strong> <strong>1,8%</strong>.</p>
      <p><strong>Q5:</strong> <em>Style drift</em>? <strong>A:</strong> <strong><em>Loading</em> berubah</strong>.</p>
      <h3>💪 Latihan Praktik</h3>
      <p><strong><em>Regresi</em></strong> 3 manajer! <strong><em>Bandingkan</em></strong>! <strong><em>Pilih</em></strong>!</p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>L1:</strong> <em>Tahu</em>. <strong>L2:</strong> <em>Regresi</em>. <strong>L3:</strong> <em>Ajarkan</em>. <strong>L4:</strong> <em>Due diligence</em>.</p>
      <h3>📚 Bacaan Lanjutan</h3>
      <p><strong>Fama-French (1993)</strong>! <strong>Carhart (1997)</strong>!</p>
      <h3>❓ FAQ Faktor</h3>
      <p><strong>Q: <em>Berapa</em> faktor?</strong> A: <strong><em>Mulai</em> 3, <em>tambah</em> seperlunya.</strong></p>
      <p><strong>Q: <em>Alpha</em> <em>negatif</em>?</strong> A: <strong><em>Pecat</em></strong>!</p>
      <h3>🔮 Masa Depan Faktor</h3>
      <p><strong><em>ML</em></strong>! <em>Alternative</em>! <strong><em>Siap</em></strong>.</p>
      <h3>📝 Jurnal Faktor (Template)</h3>
      <p><strong>Manajer:</strong> ___ <strong><em>Alpha</em>:</strong> ___ <strong><em>t</em>:</strong> ___</p>
      <p><strong><em>Verdict</em>:</strong> ___</p>
      <h3>💬 Satu Nasihat</h3>
      <p><strong>&ldquo;<em>Bayar</em> untuk <em>alpha</em>, <em>bukan</em> <em>beta</em>.&rdquo;</strong></p>
      <h3>🌟 Penutup</h3>
      <p><strong><em>Regresi</em></strong> = <em>kebenaran</em>. <strong><em>Kebenaran</em></strong> = <em>uang</em>.</p>
      <p><strong><em>Carilah</em>.</strong></p>
      <h3>📖 Panduan Super Lengkap: Due Diligence Manajer (Checklist)</h3>
      <p><strong><em>Due diligence</em></strong> manajer = <strong><em>wajib</em></strong> sebelum <strong><em>investasi</em></strong>. <strong><em>Checklist</em> lengkap:</strong></p>
      <p><strong>1. REGRESI.</strong> <em>Jalankan</em> CAPM &amp; FF. <strong><em>Alpha</em></strong>? <strong><em>t-stat</em></strong>? <strong><em>R&sup2;</em></strong>? <strong><em>Jika</em></strong> <em>alpha</em> <strong><em>tidak</em></strong> signifikan &rarr; <strong><em>tolak</em></strong>.</p>
      <p><strong>2. FEE.</strong> <em>Bandingkan</em> dengan <em>replikasi</em>. <strong><em>Jika</em></strong> <em>fee</em> 2% &amp; <em>alpha</em> 0,5% &rarr; <strong><em>net</em> negatif</strong>! <strong><em>Tolak</em></strong>.</p>
      <p><strong>3. STYLE.</strong> <em>Cek</em> <em>konsistensi</em>. <strong><em>Jika</em></strong> <em>drift</em> &rarr; <strong><em>tanya</em></strong>. <strong><em>Jika</em></strong> <em>tidak</em> jelas &rarr; <strong><em>tolak</em></strong>.</p>
      <p><strong>4. TRACK RECORD.</strong> <em>Minimal</em> 36 bulan. <strong><em>Lebih</em></strong> baik 60+. <strong><em>Konsisten</em></strong>? <strong><em>Across</em></strong> <em>regime</em>?</p>
      <p><strong>5. KAPASITAS.</strong> <em>AUM</em> besar &rarr; <em>alpha</em> <strong><em>terkikis</em></strong>! <strong><em>Tanya</em>:</strong> <em>kapasitas</em> maksimal?</p>
      <p><strong>6. TIM.</strong> <em>Siapa</em> di balik? <strong><em>Turnover</em></strong> tim? <strong><em>Key person</em></strong> risk?</p>
      <p><strong>7. PROSES.</strong> <em>Apakah</em> <strong><em>repeatable</em></strong>? <strong><em>Atau</em></strong> <em>keberuntungan</em>?</p>
      <p><strong>7 cek</strong> = <em>aman</em>. <strong><em>Lewati</em></strong> satu = <em>risiko</em>.</p>
      <h3>📖 Panduan Super Lengkap: Membedakan Skill vs Luck</h3>
      <p><strong><em>Skill</em></strong> vs <strong><em>luck</em></strong> = <strong><em>pertanyaan</em></strong> tersulit. <strong><em>Statistik</em></strong> membantu:</p>
      <p><strong><em>t-stat</em> &gt; 2</strong> = <em>kemungkinan</em> <strong><em>skill</em></strong> (95%!). <strong><em>t-stat</em> &lt; 2</strong> = <em>bisa</em> <strong><em>luck</em></strong>.</p>
      <p><strong><em>Konsistensi</em></strong> = <em>kunci</em>. <strong><em>Alpha</em></strong> positif <strong>8 dari 10 tahun</strong> = <em>skill</em>. <strong><em>Alpha</em></strong> positif <strong>2 dari 10</strong> = <em>luck</em>.</p>
      <p><strong><em>Across regime</em></strong>: <em>bull</em> &amp; <em>bear</em>! <strong><em>Jika</em></strong> <em>hanya</em> <em>bull</em> &rarr; <strong><em>beta</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>skeptis</em></strong> dulu. <strong><em>Buktikan</em></strong> skill. <strong><em>Jangan</em></strong> bayar untuk <em>luck</em>.</p>
      <h3>📖 Panduan Super Lengkap: Faktor Investing untuk Pemula</h3>
      <p><strong><em>Factor investing</em></strong> = <em>investasi</em> berdasarkan <strong><em>karakteristik</em></strong> yang <strong><em>terbukti</em></strong> memberikan <em>premi</em>. <strong><em>Faktor</em> utama:</strong></p>
      <p><strong>VALUE (HML):</strong> <em>saham murah</em> (P/B rendah!) <strong><em>outperform</em></strong> <em>mahal</em>. <strong><em>Premi</em> historis:</strong> ~4%/tahun. <strong><em>Risiko</em>:</strong> <em>value trap</em>! <em> Periode</em> buruk <em>panjang</em>!</p>
      <p><strong>SIZE (SMB):</strong> <em>saham kecil</em> <strong><em>outperform</em></strong> <em>besar</em>. <strong><em>Premi</em>:</strong> ~3%/tahun. <strong><em>Risiko</em>:</strong> <em>illiquid</em>! <em>Volatil</em>!</p>
      <p><strong>MOMENTUM (UMD):</strong> <em>pemenang</em> <strong><em>lanjut</em></strong> menang. <strong><em>Premi</em>:</strong> ~8%/tahun. <strong><em>Risiko</em>:</strong> <em>crash</em> momentum!</p>
      <p><strong>QUALITY:</strong> <em>profitabel</em> <strong><em>outperform</em></strong>. <strong><em>Premi</em>:</strong> ~4%/tahun.</p>
      <p><strong>LOW VOL:</strong> <em>vol rendah</em> <strong><em>outperform</em></strong> (<em>anomali</em>!). <strong><em>Premi</em>:</strong> ~3%/tahun.</p>
      <p><strong><em>Strategi</em>:</strong> <strong><em>kombinasikan</em></strong>! <strong><em>Diversifikasi</em></strong> faktor! <strong><em>Biaya</em> rendah</strong> (ETF!).</p>
      <p><strong><em>Peringatan</em>:</strong> <strong><em>premi</em></strong> = <em>historis</em>! <strong><em>Tidak</em></strong> jaminan! <strong><em>Disiplin</em></strong>!</p>
      <h3>🎯 Vignette Ujian Lengkap (CFA-Style)</h3>
      <p><strong>Situasi:</strong> <em>Dana pensiun</em> <em>evaluasi</em> 3 manajer. <strong>Manajer A:</strong> <em>return</em> 15%, <em>fee</em> 1,5%. <strong>Manajer B:</strong> <em>return</em> 12%, <em>fee</em> 0,5%. <strong>Manajer C:</strong> <em>return</em> 13%, <em>fee</em> 2%.</p>
      <p><strong>Regresi:</strong> A: &alpha; 1% (<em>t</em> 1,2). B: &alpha; 0,5% (<em>t</em> 2,5). C: &alpha; 2% (<em>t</em> 0,9).</p>
      <p><strong>Pertanyaan:</strong> <em>Pilih</em> <strong>satu</strong>! <em>Jelaskan</em>!</p>
      <p><strong>Jawab:</strong> <strong>B</strong>! &mdash; <em>t</em> 2,5 = <strong><em>signifikan</em></strong>! <em>Fee</em> <strong><em>rendah</em></strong>! <em>Net</em> = <strong>positif</strong>! <strong>A</strong> &amp; <strong>C</strong> = <em>t</em> &lt; 2 = <strong><em>ragu</em></strong>!</p>
      <p><strong><em>Pelajaran</em>:</strong> <strong><em>return</em> tinggi &ne; <em>pilihan</em></strong>. <strong><em>t-stat</em> + <em>fee</em></strong> = <em>kunci</em>.</p>
      <h3>📋 Template Laporan Due Diligence (Siap Pakai)</h3>
      <p><strong>MANAJER:</strong> ___ <strong>PERIODE:</strong> ___</p>
      <p><strong>ALPHA:</strong> ___% <strong>t-stat:</strong> ___ <strong>R&sup2;:</strong> ___</p>
      <p><strong>LOADING:</strong> Mkt ___ SMB ___ HML ___</p>
      <p><strong>FEE:</strong> ___% <strong>NET ALPHA:</strong> ___%</p>
      <p><strong>STYLE:</strong> Konsisten? ___ <strong>DRIFT?</strong> ___</p>
      <p><strong>VERDICT:</strong> Hire / Tolak / Monitor</p>
      <p><strong><em>Salin</em>. <em>Isi</em>. <em>Putuskan</em>.</strong></p>
      <h3>📖 Studi Kasus Mendalam: Warren Buffett &amp; Faktor</h3>
      <p><strong><em>Buffett</em></strong> = <em>alpha</em>? <strong><em>Atau</em></strong> <em>faktor</em>? <strong><em>Penelitian</em></strong> (Frazzini et al.): <em>return</em> Buffett = <strong><em>dijelaskan</em></strong> oleh <em>value</em> + <em>quality</em> + <em>low-vol</em> + <em>leverage</em>!</p>
      <p><strong><em>Artinya</em>:</strong> <strong><em>sebagian</em></strong> &ldquo;<em>skill</em>&rdquo; Buffett = <strong><em>faktor</em></strong>! <strong><em>Tapi</em>:</strong> <strong><em>disiplin</em></strong> 50 tahun = <strong><em>skill</em></strong>!</p>
      <p><strong><em>Pelajaran</em>:</strong> <strong><em>bahkan</em></strong> <em>legenda</em> = <em>regresi</em>! <strong><em>Belajar</em></strong> faktor! <strong><em>Tiru</em></strong> disiplin!</p>
      <p><strong><em>Faktor</em></strong> + <strong><em>disiplin</em></strong> = <em>formula</em>.</p>
      <h3>🤖 AI &amp; Faktor</h3>
      <p><strong><em>ML</em></strong> <em>temukan</em> faktor <em>baru</em>! <strong><em>Tapi</em>:</strong> <strong><em>overfit</em></strong>! <strong><em>Validasi</em></strong>! <strong><em>Ekonomi</em></strong>!</p>
      <h3>💬 Wawancara: CIO Pension Fund</h3>
      <p><strong>Q: <em>Kriteria</em> hire?</strong> A: &ldquo;<strong><em>Alpha</em> signifikan</strong>. <strong><em>Fee</em> wajar</strong>. <strong><em>Style</em> konsisten</strong>. <strong><em>Tiga</em></strong> atau <strong><em>tidak</em></strong>.&rdquo;</p>
      <p><strong><em>Dengarkan</em></strong> pembeli.</p>
      <h3>🎓 Ujian Akhir (Final)</h3>
      <p><strong>Q1:</strong> <em>Alpha</em>? <strong>Q2:</strong> <em>t</em>? <strong>Q3:</strong> <em>Replikasi</em>? <strong>Q4:</strong> <em>Drift</em>? <strong>Q5:</strong> <em>Net</em>?</p>
      <p><strong>Lulus</strong> = 5/5.</p>
      <h3>🌟 Penutup Akhir</h3>
      <p><strong><em>Bayar</em></strong> untuk <em>alpha</em>. <strong><em>Bukan</em></strong> <em>beta</em>. <strong><em>Regresi</em></strong> = <em>alat</em>.</p>
      <p><strong><em>Gunakanlah</em>.</strong></p>
      <h3>📖 Esai: Skeptisisme yang Sehat</h3>
      <p><strong><em>Skeptis</em></strong> &ne; <strong><em>sinis</em></strong>. <strong><em>Skeptis</em></strong> = <strong><em>tanya</em></strong> <em>bukti</em>. <strong><em>Sinis</em></strong> = <strong><em>tolak</em></strong> <em>semua</em>. <strong><em>Investor</em></strong> <em>baik</em> = <strong><em>skeptis</em></strong>. <strong><em>Tanya</em></strong>: <em>alpha</em>? <em>t-stat</em>? <em>net</em>? <strong><em>Jika</em></strong> <em>lolos</em> &rarr; <strong><em>investasi</em></strong>. <strong><em>Jika</em></strong> <em>tidak</em> &rarr; <strong><em>tolak</em></strong>.</p>
      <p><strong><em>Skeptisisme</em></strong> = <strong><em>pelindung</em></strong> <em>modal</em>.</p>
      <h3>📖 Esai: Biaya adalah Kepastian</h3>
      <p><strong><em>Return</em></strong> = <strong><em>tidak pasti</em></strong>. <strong><em>Biaya</em></strong> = <strong><em>pasti</em></strong>. <strong><em>Matematika</em></strong> <em>sederhana</em>: <em>kurangi</em> <strong><em>biaya</em></strong> = <em>naikkan</em> <strong><em>return</em></strong>. <strong><em>Replikasi</em></strong> <em>ETF</em> = <strong><em>hemat</em></strong> <em>pasti</em>. <strong><em>Alpha</em></strong> = <strong><em>mungkin</em></strong>. <strong><em>Pilih</em></strong> <strong><em>pasti</em></strong>.</p>
      <h3>📖 Esai Final: Tanggung Jawab Fidusia</h3>
      <p><strong><em>Mengelola</em></strong> <em>uang</em> <strong><em>orang</em></strong> = <strong><em>amanah</em></strong>. <strong><em>Amanah</em></strong> = <strong><em>jujur</em></strong>. <strong><em>Jujur</em></strong> = <strong><em>regresi</em></strong>. <strong><em>Regresi</em></strong> = <strong><em>bukti</em></strong>. <strong><em>Jangan</em></strong> <em>khianati</em> <strong><em>amanah</em></strong>.</p>
      <p><strong><em>Fidusia</em></strong> = <strong><em>suci</em></strong>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Regresi</em></strong> = <strong><em>kebenaran</em></strong>. <strong><em>Kebenaran</em></strong> = <strong><em>keadilan</em></strong> untuk <em>investor</em>.</p>
      <p><strong><em>Tegakkanlah</em></strong>.</p>
      <h3>📖 Pendalaman Mendalam</h3>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Alpha +4% = manajer hebat. Bayar 2% layak.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>t-stat 1,2</strong> = tidak signifikan (noise!); setelah FF alpha <strong>+0,5%</strong> = beta small-value tersamar. <strong>Alpha tanpa t-stat = anecdote.</strong> Uji dulu: |t|&gt;2? FF? Jika tidak → <strong>ETF 0,2%</strong>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;R² tinggi = manajer bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>R² 0,95 = closet indexer</strong> — bayar fee aktif untuk hasil indeks! R² tinggi + alpha kecil = <strong>pecat</strong> (atau pindah ke pasif). R² <em>rendah</em> + alpha signifikan = <strong>aktif beneran</strong> (layak fee!).</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Alpha positif = hebat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>t-stat</em></strong>! <strong><em>Net</em></strong> fee! <strong><em>Konsisten</em></strong>!</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Faktor = alpha.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>Faktor</em></strong> = <em>beta</em>! <strong><em>Replikasi</em></strong> murah!</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu minta: alpha, t-stat, R², dan loadings FF.</strong> Empat angka ini = due diligence 80%. Manajer yang tidak bisa memberi = <strong>jawabannya</strong>.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Curigai alpha dari periode pendek.</strong> t-stat ∝ √T — 1 tahun alpha +10% (t~1) = noise; 10 tahun +2% (t~2,5) = skill. <strong>Waktu = bukti.</strong></strong></p>
</div>

<div className="tip">
<p><strong>💡 Ritual hire manajer:</strong> (1) <strong><em>Regresi</em></strong>! (2) <strong><em>t-stat</em></strong>! (3) <strong><em>Net</em></strong> fee! (4) <strong><em>Style</em></strong>! <strong><em>Empat</em></strong> atau <strong><em>tolak</em></strong>.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Regresi CAPM (OLS Manual)</h2>
<p>Hitung alpha, beta, R², t-stat dari data return — tanpa library.</p>
<PyodideLab
  title={"Lab 1 — Regresi CAPM"}
  hint={"Ubah ALPHA_TRUE 0.005 → 0.02 (skill beneran). t-stat naik > 2 — signifikan!"}
  defaultCode={"# OLS manual: R_p - R_f = alpha + beta*(R_m - R_f)\nimport math, random\nrandom.seed(11)\nALPHA_TRUE, BETA_TRUE = 0.005, 1.1  # per bulan (ubah ALPHA!)\nN = 60\nrm = [random.uniform(-0.08, 0.08) for _ in range(N)]\nrp = [ALPHA_TRUE + BETA_TRUE*x + random.gauss(0, 0.03) for x in rm]\n\nmx, my = sum(rm)/N, sum(rp)/N\nbeta = sum((a-mx)*(b-my) for a, b in zip(rm, rp))/sum((a-mx)**2 for a in rm)\nalpha = my - beta*mx\nres = [b - (alpha + beta*a) for a, b in zip(rm, rp)]\nse = math.sqrt(sum(r*r for r in res)/(N-2))\nse_alpha = se*math.sqrt(1/N + mx**2/sum((a-mx)**2 for a in rm))\nr2 = 1 - sum(r*r for r in res)/sum((b-my)**2 for b in rp)\n\nprint(f\"Alpha : {alpha:.3%} (t-stat {alpha/se_alpha:.1f})\")\nprint(f\"Beta  : {beta:.2f}\")\nprint(f\"R2    : {r2:.2f}\")\nprint(f\"|t|>2: {'SIGNIFIKAN' if abs(alpha/se_alpha) > 2 else 'tidak signifikan (noise?)'}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Penghitung t-stat Alpha</h2>
<p>Seberapa lama track record dibutuhkan agar alpha signifikan?</p>
<PyodideLab
  title={"Lab 2 — Kalkulator t-stat"}
  hint={"Ubah ALPHA 0.04 → 0.02. Butuh tahun LEBIH lama — alpha kecil butuh waktu!"}
  defaultCode={"# t-stat alpha vs panjang track record: t = alpha*sqrt(T)/vol_aktif\nimport math\nALPHA = 0.04      # alpha tahunan (ubah!)\nTE = 0.08         # tracking error tahunan\n\nprint(f\"{'tahun':>6}{'t-stat':>8}  signifikan?\")\nfor T in [1, 3, 5, 10, 15]:\n    t = ALPHA*math.sqrt(T)/TE\n    print(f\"{T:>6}{t:>8.1f}  {'YA' if t > 2 else 'belum'}\")\nprint()\nprint(\"t-stat tumbuh dengan AKAR waktu: butuh 4x lipat waktu\")\nprint(\"untuk 2x keyakinan. Alpha kecil = butuh dekade!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Due diligence manajer → <strong>Regresi CAPM + FF</strong></h3>
<p><strong>Kenapa:</strong> Bedah klaim.</p>
<p><strong>Contoh nyata:</strong> Alpha? t-stat?</p>
</div>
<div className="decision-card">
<h3>2. Alpha signifikan, R² rendah → <strong>Pertahankan (aktif beneran)</strong></h3>
<p><strong>Kenapa:</strong> Skill unik.</p>
<p><strong>Contoh nyata:</strong> Fee layak.</p>
</div>
<div className="decision-card">
<h3>3. Alpha tidak signifikan / beta tersamar → <strong>Ganti ETF / nego fee</strong></h3>
<p><strong>Kenapa:</strong> Beta mahal.</p>
<p><strong>Contoh nyata:</strong> Replikasi 0,2%.</p>
</div>
<div className="decision-card">
<h3>4. Monitoring gaya → <strong>Style analysis berkala</strong></h3>
<p><strong>Kenapa:</strong> Deteksi drift.</p>
<p><strong>Contoh nyata:</strong> Kuartalan.</p>
</div>
<div className="decision-card">
<h3>5. Regresi faktor → <strong>Alpha net & t-stat; bayar hanya untuk alpha</strong></h3>
<p><strong>Kenapa:</strong> Beta tersamar; fee mahal untuk faktor.</p>
<p><strong>Contoh nyata:</strong> &ldquo;Bintang&rdquo; +4% = beta; replikasi ETF hemat 1,8%.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Regresi dulu</strong>, kagum kemudian.</li><li><strong>|t| &gt; 2</strong> atau anecdote.</li><li><strong>FF</strong> untuk beta tersamar.</li><li><strong>R² tinggi</strong> = closet indexer.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Alpha +4% yang Ternyata Beta</h2>
<div className="callout">
<p>Manajer 'Bintang': alpha +4%, fee 2%. Regresi FF: alpha +0,5% (t 0,8), loading SMB/HML tinggi.</p>
<p><strong>Vignette lanjutan.</strong> Manajer &ldquo;Bintang&rdquo;: <em>klaim</em> alpha <strong>+4%</strong>, <em>fee</em> <strong>2%</strong>! <em>Investor</em> <strong><em>terpesona</em></strong>. Regresi FF: alpha <strong>+0,5%</strong> (<em>t</em> <strong>0,8</strong>!), <em>loading</em> SMB/HML <strong>tinggi</strong>! <em>Ternyata</em>: <strong><em>beta</em> tersamar</strong>! <em>Net</em>: <strong>0,5% &minus; 2% = &minus;1,5%</strong>! <strong><em>Merusak</em></strong> nilai!</p>
<p><strong>Pertanyaan:</strong> (a) Verdict? (b) Alternatif? (c) Sistem pencegahan? (d) Jika <em>fee</em> dinego ke 0,5% &mdash; <em>layak</em>? (e) <em>Berapa</em> tahun data untuk <em>t-stat</em> valid?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Beta tersamar</strong>: alpha tidak signifikan, premi faktor small-value. <strong>Tidak layak fee 2%.</strong></p>
<p>(d) <strong><em>Masih</em> tidak!</strong> &mdash; <em>t</em> 0,8 = <em>tidak</em> signifikan! <strong><em>Bayar</em> untuk <em>kebetulan</em></strong>? <strong><em>Tidak</em>.</strong></p>
<p>(e) <strong><em>Minimal</em> 36 bulan</strong>! <strong><em>Lebih</em> baik</strong> 60+! <strong><em>t-stat</em></strong> butuh <em>sampel</em>!</p>
<p>(b) <strong>Replikasi ETF</strong> (0,2%): hemat 1,8%/tahun. Atau <strong>nego fee</strong> ke 0,5%.</p>
<p>(c) <strong>Regresi wajib</strong> sebelum hire + <strong>style analysis kuartalan</strong> + <strong>aturan t-stat</strong> di IPS manajer.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Faktor Lanjut</h2>
      <h3>1. Momentum (Carhart)</h3>
      <p><strong><em>UMD</em></strong>! <em>Pemenang</em> lanjut! <strong><em>Anomali</em></strong> kuat!</p>
      <h3>2. Quality &amp; low-vol</h3>
      <p><strong><em>Profitabilitas</em></strong>! <em>Stabil</em>! <strong><em>Populer</em></strong>!</p>
      <h3>3. Multi-faktor</h3>
      <p><strong><em>Kombinasi</em></strong>! <strong><em>Diversifikasi</em></strong> faktor!</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Alpha kilat</h3>
      <p>R=12%, E(R)=11,4%. <em>Alpha</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong>+0,6%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; t-stat</h3>
      <p><em>t</em> 0,8. <em>Signifikan</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong><em>Tidak</em></strong> (<em>t</em> &lt; 2).</p>
      </details>
      <h3>Drill 3 &mdash; Replikasi</h3>
      <p><em>Fee</em> 2% vs ETF 0,2%. <em>Hemat</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>1,8%</strong>/tahun.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;+4% = hebat.&rdquo; <em>Benar</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Regresi</em> dulu!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Alpha +4%, t-stat 1,2. Kesimpulan?"}
  options={
    ["Hebat",
    "Tidak signifikan — bisa noise",
    "Lumayan",
    "Beli"]
  }
  correct={1}
  explanation={"Benar: |t|&lt;2 = tidak signifikan 95%. Alpha tanpa t-stat = anecdote."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. R² = 0,95, alpha kecil, fee 1,5%. Ini?"}
  options={
    ["Aktif beneran",
    "Closet indexer — pindah ke pasif",
    "Hebat",
    "Tahan"]
  }
  correct={1}
  explanation={"Benar: mirip indeks tapi fee aktif = bayar mahal untuk beta. Pecat/pasifkan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Setelah FF, alpha +4% → +0,5%. Artinya?"}
  options={
    ["Alpha murni",
    "Beta tersamar (premi faktor small-value)",
    "Error",
    "Beruntung"]
  }
  correct={1}
  explanation={"Benar: 'skill' = loading faktor yang bisa dibeli via ETF 0,2%."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. t-stat tumbuh dengan?"}
  options={
    ["Linear waktu",
    "Akar waktu (butuh 4x waktu untuk 2x keyakinan)",
    "Tidak tumbuh",
    "Kuadrat"]
  }
  correct={1}
  explanation={"Benar: t = α√T/TE. Alpha kecil butuh dekade untuk signifikan. Waktu = bukti."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Style analysis: mandat large-value, hasil 60% large-growth. Ini?"}
  options={
    ["OK",
    "Style drift — pelanggaran mandat",
    "Taktis",
    "Biarkan"]
  }
  correct={1}
  explanation={"Benar: perbuatan ≠ kata-kata. Drift tanpa persetujuan = pelanggaran kontrak."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Manajer klaim alpha +4% (fee 2%). Regresi: alpha +0,5% (t 0,8), loading SMB/HML tinggi. Keputusan?"}
  options={
    ["Hire — +4% hebat!",
    "Tolak — beta tersamar; replikasi ETF 0,2%",
    "Nego fee ke 1%",
    "Tunggu 1 tahun lagi"]}
  correct={1}
  explanation={"Benar: t 0,8 = tidak signifikan; return dari faktor (replikasi murah). Net = 0,5%−2% = −1,5%. Tolak."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>CAPM</strong>: alpha (intersep), beta (slope), R², t-stat.</li>
<li><strong>|t| &gt; 2</strong> = signifikan; tanpa itu = anecdote.</li>
<li><strong>FF3/5</strong>: bedakan alpha murni vs premi faktor.</li>
<li><strong>Style analysis</strong>: peta gaya + deteksi drift.</li>
<li><strong>Closet indexer</strong>: R² tinggi + fee aktif = pecat.</li>
<li><strong>Aturan</strong>: regresi dulu, kagum kemudian; waktu = bukti.</li>

<li><strong>CAPM:</strong> alpha = R &minus; E(R).</li>
<li><strong>FF:</strong> faktor = beta; replikasi murah.</li>
<li><strong>Style:</strong> monitor drift; t-stat.</li>
<li><strong>Kapan TIDAK pakai:</strong> tanpa t-stat; bayar untuk beta; abaikan drift.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-d2-optimisasi" className="btn btn-secondary btn-sm">← PM-D2</Link>
        <Link href="/learn/pm-d4-backtesting" className="btn btn-primary btn-sm">PM-D4 →</Link>
      </div>
    </div>
  );
}

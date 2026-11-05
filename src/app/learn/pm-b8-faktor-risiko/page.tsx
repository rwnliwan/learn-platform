"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB8FaktorRisikoPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B8 — Portfolio Management</span>
        <h1 className="display-title">Faktor & Risiko:<br/>VaR, ES & Greeks</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: VaR yang 'Aman' Saat Tsunami</a></li>
<li><a href="#faktor">Model Faktor</a></li>
<li><a href="#var">VaR & Expected Shortfall</a></li>
<li><a href="#greeks">Greeks & Hedging</a></li>
<li><a href="#sintesis">Sintesis: Tiga Lapis</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: VaR 2008</a></li>
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
<li>Membedakan 3 jenis model faktor dan kegunaannya.</li>
<li>Menghitung VaR 3 metode dan menjelaskan keterbatasannya.</li>
<li>Menjelaskan Expected Shortfall vs VaR.</li>
<li>Menjelaskan delta/gamma/theta/vega untuk hedging portofolio.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: VaR yang 'Aman' Saat Tsunami</h2>
      <div className="story">
        <p><strong>2008</strong>: bank-bank melaporkan <strong>VaR harian 'hanya' USD 100jt</strong> — <em>&ldquo;risiko terkendali.&rdquo;</em> Lalu Lehman jatuh: kerugian <strong>USD 600jt sehari</strong> — <strong>6x VaR</strong>, berhari-hari berturut-turut.</p>
<p>Twist-nya: VaR 99% <em>memang</em> berkata '1 hari dari 100, rugi <em>bisa</em> lebih dari ini' — <strong>bank lupa membaca kalimat keduanya</strong>: VaR <strong>tidak berkata <em>berapa</em> lebihnya</strong>. Ditambah VaR dihitung dari <strong>data tenang</strong> (2004–2006) untuk <strong>badai</strong> (2008). <strong>VaR = speedometer yang tidak menunjukkan jurang.</strong> Lesson ini: mengukur risiko dengan jujur.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="faktor">Model Faktor — DNA Return</h2>
<p><strong>Definisi.</strong> <strong>Model faktor</strong>: R_i = α + β1×F1 + β2×F2 + … + ε. <strong>Jenis</strong>: <em>makroekonomi</em> (GDP, inflasi, suku bunga), <em>fundamental</em> (<strong>Fama-French</strong>: MKT, SMB/size, HML/value; + momentum, quality), <em>statistik</em> (PCA — faktor tanpa nama).</p>
<p><strong>Active return</strong> = Σ (exposure aktif × return faktor) + <strong>alpha murni</strong> (stock selection). Attribution (PM-C5) memakai ini.</p>
<Tex math={String.raw`R_i = \alpha + \beta_{MKT}MKT + \beta_{SMB}SMB + \beta_{HML}HML + \epsilon`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`SMB`} />: small minus big (premi ukuran)</li>
<li><Tex math={String.raw`HML`} />: high minus low book-to-market (premi value)</li>
<li><Tex math={String.raw`\alpha`} />: return di luar faktor = skill (atau luck!)</li>
<li>Fama-French menjelaskan ~90% return terdiversifikasi — alpha tersisa sedikit</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Model faktor seperti <strong>tes DNA return</strong>: 'darah' portofoliomu terdiri dari gen pasar (MKT), gen kecil (SMB), gen murah (HML). Alpha = <strong>mutasi unik</strong> — langka &amp; berharga, tapi sering ternyata cuma <em>gen yang belum dites</em>.</p>
<p><strong>Kapan dipakai:</strong> Evaluasi manajer: alpha vs factor exposure (PM-C5); konstruksi smart beta (PM-C8).</p>
<p><strong>Pendalaman intuisi &mdash; VaR = &ldquo;pagar&rdquo;, bukan &ldquo;jurang&rdquo;.</strong> VaR 99% Rp100M artinya: &ldquo;99% hari, rugi &le; Rp100M&rdquo;. <strong>Yang TIDAK dikatakan:</strong> <em>seberapa dalam</em> jurang di 1% sisanya! Bisa Rp101M, bisa Rp600M (Lehman!). <strong>VaR = pagar di tepi jurang; ia tidak memberitahumu <em>sedalam apa</em> jurangnya.</strong> Itulah kenapa VaR <em>saja</em> = <em>buta ekor</em> (<em>tail-blind</em>).</p><p><strong>Pendalaman intuisi &mdash; VaR = &ldquo;pagar&rdquo;, bukan &ldquo;jurang&rdquo;.</strong> VaR 99% Rp100M artinya: &ldquo;99% hari, rugi &le; Rp100M&rdquo;. <strong>Yang TIDAK dikatakan:</strong> <em>seberapa dalam</em> jurang di 1% sisanya! Bisa Rp101M, bisa Rp600M (Lehman!). <strong>VaR = pagar di tepi jurang; ia tidak memberitahumu <em>sedalam apa</em> jurangnya.</strong> Itulah kenapa VaR <em>saja</em> = <em>buta ekor</em> (<em>tail-blind</em>).</p><details className="worked">
<summary>📐 Contoh: 'Alpha' yang ternyata value (klik untuk buka)</summary>
<p>Manajer klaim alpha 4%/thn. Regresi FF3: β_MKT=1,0, β_SMB=0,6, β_HML=0,8, <strong>α = 0,5%</strong> (tidak signifikan).</p>
<p><strong>3,5% dari 4%</strong> = exposure ke <strong>small-value</strong> — bisa dibeli via ETF <strong>murah</strong>! Alpha murni cuma 0,5%.</p>
<p><strong>Pelajaran:</strong> jangan bayar fee 2% untuk <em>factor exposure</em>. Bayar untuk alpha — jika ada.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): VaR parametrik &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> portofolio Rp10M, return harian &mu; = 0, &sigma; = 2%. VaR 99% 1-hari?</p>
<p><strong>Langkah 1:</strong> z_99% = <strong>2,33</strong>.</p>
<p><strong>Langkah 2:</strong> VaR = 10M &times; 2,33 &times; 0,02 = <strong>Rp466jt</strong>.</p>
<p><strong>Artinya:</strong> 99% hari, rugi &le; Rp466jt. <strong>Tidak artinya:</strong> &ldquo;maksimum rugi Rp466jt&rdquo;! (1% hari bisa <em>jauh</em> lebih besar.) <strong>Asumsi tersembunyi:</strong> return <em>normal</em> &mdash; jika <em>fat tails</em>, VaR ini <strong>kekecilan</strong>. Selalu tanya: <em>distribusinya normal betulan?</em></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: VaR historis vs parametrik</summary>
<p><strong>Soal:</strong> 500 hari data. Return terburuk ke-5 = &minus;4,2%. VaR 99% historis? Bandingkan parametrik (&sigma; = 2%).</p>
<p><strong>Historis:</strong> 1% &times; 500 = 5 &rarr; <strong>VaR = 4,2%</strong> (&asymp; Rp420jt).</p>
<p><strong>Parametrik:</strong> 2,33 &times; 2% = <strong>4,66%</strong> (&asymp; Rp466jt).</p>
<p><strong>Bedanya:</strong> historis &asymp; parametrik &rarr; distribusi <em>mendekati</em> normal. Jika historis <strong>&gt;&gt;</strong> parametrik &rarr; <strong>fat tails!</strong> &rarr; jangan percaya VaR parametrik. <strong>Perbandingan ini = <em>diagnostik ekor</em> 30 detik.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;VaR 99% = maksimum rugi&rdquo;.</strong> <strong>SALAH TOTAL.</strong> VaR = <em>ambang</em>: 1% kasus <em>melebihi</em>nya &mdash; bisa sedikit, bisa <em>jauh</em> (Lehman: 6&times;!). Soal yang bertanya &ldquo;berapa maksimum rugi?&rdquo; lalu memberi VaR sedang menjebak &mdash; <strong>jawab: tidak bisa disimpulkan dari VaR; gunakan ES/stress.</strong></p>
</div>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): VaR parametrik &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> portofolio Rp10M, return harian &mu; = 0, &sigma; = 2%. VaR 99% 1-hari?</p>
<p><strong>Langkah 1:</strong> z_99% = <strong>2,33</strong>.</p>
<p><strong>Langkah 2:</strong> VaR = 10M &times; 2,33 &times; 0,02 = <strong>Rp466jt</strong>.</p>
<p><strong>Artinya:</strong> 99% hari, rugi &le; Rp466jt. <strong>Tidak artinya:</strong> &ldquo;maksimum rugi Rp466jt&rdquo;! (1% hari bisa <em>jauh</em> lebih besar.) <strong>Asumsi tersembunyi:</strong> return <em>normal</em> &mdash; jika <em>fat tails</em>, VaR ini <strong>kekecilan</strong>. Selalu tanya: <em>distribusinya normal betulan?</em></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): ES &mdash; &ldquo;sedalam apa jurangnya&rdquo;</summary>
<p><strong>Soal:</strong> 1000 hari data. 10 hari terburuk rata-rata rugi 7%. VaR 99% = 4,66%. Hitung ES 99% &amp; interpretasikan.</p>
<p><strong>Langkah 1:</strong> ES = <strong>7%</strong> (&asymp; Rp700jt) &mdash; rata-rata 10 hari terburuk.</p>
<p><strong>Interpretasi:</strong> VaR bilang &ldquo;pagar di 4,66%&rdquo;; ES bilang &ldquo;<em>saat pagar jebol, rata-rata jatuh 7%</em>&rdquo;. <strong>Selisih 2,34% = <em>informasi ekor</em> yang VaR sembunyikan!</strong> Jika ES &gt;&gt; VaR &rarr; <strong>ekor tebal</strong> &rarr; tambah modal.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Subadditivity &mdash; kenapa ES &ldquo;lebih benar&rdquo;</summary>
<p><strong>Soal:</strong> dua aset masing-masing VaR 99% = 100. VaR portofolio gabungan = 210. Masalah?</p>
<p><strong>Masalah:</strong> 210 &gt; 100 + 100 = 200 &mdash; <strong>VaR bilang diversifikasi <em>menambah</em> risiko!</strong> (Tidak <em>subadditive</em>.) Ini <em>absurd</em> secara ekonomi.</p>
<p><strong>ES:</strong> selalu ES(A+B) &le; ES(A) + ES(B) &mdash; <strong>diversifikasi selalu (tidak pernah menambah) risiko</strong>. <strong>Inilah alasan matematis</strong> Basel III pakai ES. <strong>Ukuran risiko yang menghukum diversifikasi = ukuran yang rusak.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; VaR dari data tenang.</strong> VaR dikalibrasi 2004&ndash;06 (tenang) &rarr; <strong>kekecilan</strong> untuk 2008. <strong>Aturan Basel:</strong> <em>stressed VaR</em> (kalibrasi periode krisis!) = wajib. Soal yang memberi &ldquo;VaR dari 3 tahun terakhir yang tenang&rdquo; &amp; bertanya kecukupan modal &rarr; <strong>jawab: tidak cukup, butuh stressed VaR.</strong></p>
</div>
<details className="worked">
<summary>📐 Contoh 3: VaR historis vs parametrik</summary>
<p><strong>Soal:</strong> 500 hari data. Return terburuk ke-5 = &minus;4,2%. VaR 99% historis? Bandingkan parametrik (&sigma; = 2%).</p>
<p><strong>Historis:</strong> 1% &times; 500 = 5 &rarr; <strong>VaR = 4,2%</strong> (&asymp; Rp420jt).</p>
<p><strong>Parametrik:</strong> 2,33 &times; 2% = <strong>4,66%</strong> (&asymp; Rp466jt).</p>
<p><strong>Bedanya:</strong> historis &asymp; parametrik &rarr; distribusi <em>mendekati</em> normal. Jika historis <strong>&gt;&gt;</strong> parametrik &rarr; <strong>fat tails!</strong> &rarr; jangan percaya VaR parametrik. <strong>Perbandingan ini = <em>diagnostik ekor</em> 30 detik.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Stress test &mdash; skenario 2008</summary>
<p><strong>Soal:</strong> portofolio saham Rp10M. Skenario: pasar &minus;40%, korelasi &rarr; 1, likuiditas kering (<em>haircut</em> 10%). Estimasi rugi stres.</p>
<p><strong>Langkah 1 &mdash; pasar:</strong> 10M &times; 40% = <strong>Rp4M</strong>.</p>
<p><strong>Langkah 2 &mdash; korelasi:</strong> diversifikasi <em>menguap</em> (semua jatuh bersamaan!) &rarr; tidak ada pengurang.</p>
<p><strong>Langkah 3 &mdash; likuiditas:</strong> jika terpaksa jual &rarr; +10% <em>haircut</em> &rarr; <strong>Rp4,4M</strong>.</p>
<p><strong>Bandingkan VaR:</strong> VaR 99% &asymp; Rp466jt &mdash; <strong>stres 10&times; lipat!</strong> <strong>Pelajaran: VaR = cuaca harian; stres = badai abad.</strong> Keduanya dibutuhkan; yang satu tidak menggantikan yang lain.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Reverse stress test</summary>
<p><strong>Soal:</strong> modal Rp1M. Skenario apa yang membuat rugi = Rp1M (bangkrut)?</p>
<p><strong>Pendekatan:</strong> bukan &ldquo;skenario &rarr; rugi&rdquo;, melainkan <strong>&ldquo;rugi target &rarr; skenario apa?&rdquo;</strong> Mis.: butuh pasar &minus;50% + <em>gap</em> likuiditas 20%.</p>
<p><strong>Pertanyaan kunci:</strong> <em>seberapa masuk akal</em> skenario itu? Jika &ldquo;pernah terjadi&rdquo; (2008! 2020!) &rarr; <strong>modal kurang</strong> &rarr; kurangi risiko atau tambah modal. <strong>Reverse stress = mencari <em>titik mati</em>-mu <em>sebelum</em> pasar menemukannya.</strong></p>
</details>
<PlotlyChart
  data={[{x: ["MKT", "SMB", "HML", "Alpha murni"], y: [6.0, 1.8, 1.4, 0.5], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#2a7de1","#e8a838"]}, text: ["6,0%","1,8%","1,4%","0,5%"], textposition: "outside"}]}
  title={"Dekomposisi return manajer 9,7%"}
  layout={{xaxis: {title: "Sumber"}, yaxis: {title: "Kontribusi (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = return dari exposure faktor; kuning = alpha murni.</p>
<p><strong>Interpretasi:</strong> Dari 9,7%: <strong>9,2% = faktor</strong> (beta berbayar murah via ETF), <strong>0,5% = alpha</strong>. Fee 2% untuk 0,5% alpha = mahal. <strong>Factor lens</strong> mengubah cara menilai manajer: bayar alpha, beli beta murah.</p>
</div>
<h2 id="var">VaR — Speedometer Risiko</h2>
<p><strong>Definisi.</strong> <strong>VaR 99% harian RpX</strong>: '99% hari, rugi ≤ RpX' — ekuivalen: '1% hari, rugi <em>bisa</em> &gt; RpX'. <strong>Metode</strong>: <em>parametrik</em> (σ×z: cepat, asumsi normal), <em>historis</em> (persentil data lalu: tanpa asumsi distribusi, tapi <em>masa lalu ≠ masa depan</em>), <em>Monte Carlo</em> (simulasi ribuan skenario).</p>
<p><strong>Expected Shortfall (ES)</strong>: <em>rata-rata</em> rugi <strong>jika</strong> VaR terlampaui — menjawab 'seberapa dalam jurangnya'. <strong>Koheren</strong> (subadditive); VaR tidak!</p>
<Tex math={String.raw`VaR_{99\%} = z_{0,99} \times \sigma \times \sqrt{T} \times \text{Nilai} \quad;\quad ES = E[\text{Loss} | \text{Loss} > VaR]`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`z_{0,99}`} /> = 2,33 (normal)</li>
<li><Tex math={String.raw`\sqrt{T}`} />: scaling waktu (hanya jika i.i.d.!)</li>
<li>VaR bukan kerugian maksimum — itu miskonsepsi paling berbahaya</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> VaR seperti <strong>speedometer</strong>: '99% waktu kecepatan ≤ 100'. Tapi speedometer <strong>tidak menunjukkan jurang</strong> di depan (ES = 'jika jatuh, sedalam apa?'). Mengemudi hanya dengan speedometer saat badai = 2008.</p>
<p><strong>Kapan dipakai:</strong> Limit risiko harian; alokasi modal; reporting (PM-D6).</p>
<p><strong>Pendalaman intuisi &mdash; ES = &ldquo;rata-rata saat jatuh&rdquo;.</strong> Expected Shortfall = <em>rata-rata kerugian</em> di 1% terburuk. Jika VaR = &ldquo;pagar&rdquo;, ES = &ldquo;<em>rata-rata kedalaman jurang</em>&rdquo;. <strong>Keunggulan matematis:</strong> ES <em>subadditive</em> (diversifikasi selalu mengurangi!) &mdash; VaR <em>tidak</em> (portofolio bisa &ldquo;lebih berisiko&rdquo; dari jumlah bagian!). <strong>Basel III beralih ke ES</strong> justru karena ini. <strong>VaR = pertanyaan &ldquo;seberapa sering?&rdquo;; ES = &ldquo;seberapa parah?&rdquo;.</strong></p><p><strong>Pendalaman intuisi &mdash; ES = &ldquo;rata-rata saat jatuh&rdquo;.</strong> Expected Shortfall = <em>rata-rata kerugian</em> di 1% terburuk. Jika VaR = &ldquo;pagar&rdquo;, ES = &ldquo;<em>rata-rata kedalaman jurang</em>&rdquo;. <strong>Keunggulan matematis:</strong> ES <em>subadditive</em> (diversifikasi selalu mengurangi!) &mdash; VaR <em>tidak</em> (portofolio bisa &ldquo;lebih berisiko&rdquo; dari jumlah bagian!). <strong>Basel III beralih ke ES</strong> justru karena ini. <strong>VaR = pertanyaan &ldquo;seberapa sering?&rdquo;; ES = &ldquo;seberapa parah?&rdquo;.</strong></p><details className="worked">
<summary>📐 Contoh: VaR portofolio Rp10M (klik untuk buka)</summary>
<p>σ harian = 2%. <strong>VaR 99%</strong> = 2,33 × 2% × Rp10M = <strong>Rp466jt</strong>.</p>
<p><strong>Artinya</strong>: 1 hari dari 100, rugi <em>bisa lebih</em> dari Rp466jt — <strong>tanpa batas atas!</strong> <strong>ES</strong> (normal) ≈ 2,67×2%×10M = <strong>Rp534jt</strong> (rata-rata saat jebol).</p>
<p>2008: rugi 6x VaR = <strong>di luar model</strong> (fat tails!) → <strong>stress test</strong> wajib mendampingi VaR.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): ES &mdash; &ldquo;sedalam apa jurangnya&rdquo;</summary>
<p><strong>Soal:</strong> 1000 hari data. 10 hari terburuk rata-rata rugi 7%. VaR 99% = 4,66%. Hitung ES 99% &amp; interpretasikan.</p>
<p><strong>Langkah 1:</strong> ES = <strong>7%</strong> (&asymp; Rp700jt) &mdash; rata-rata 10 hari terburuk.</p>
<p><strong>Interpretasi:</strong> VaR bilang &ldquo;pagar di 4,66%&rdquo;; ES bilang &ldquo;<em>saat pagar jebol, rata-rata jatuh 7%</em>&rdquo;. <strong>Selisih 2,34% = <em>informasi ekor</em> yang VaR sembunyikan!</strong> Jika ES &gt;&gt; VaR &rarr; <strong>ekor tebal</strong> &rarr; tambah modal.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Subadditivity &mdash; kenapa ES &ldquo;lebih benar&rdquo;</summary>
<p><strong>Soal:</strong> dua aset masing-masing VaR 99% = 100. VaR portofolio gabungan = 210. Masalah?</p>
<p><strong>Masalah:</strong> 210 &gt; 100 + 100 = 200 &mdash; <strong>VaR bilang diversifikasi <em>menambah</em> risiko!</strong> (Tidak <em>subadditive</em>.) Ini <em>absurd</em> secara ekonomi.</p>
<p><strong>ES:</strong> selalu ES(A+B) &le; ES(A) + ES(B) &mdash; <strong>diversifikasi selalu (tidak pernah menambah) risiko</strong>. <strong>Inilah alasan matematis</strong> Basel III pakai ES. <strong>Ukuran risiko yang menghukum diversifikasi = ukuran yang rusak.</strong></p>
</details>

<PlotlyChart
  data={[{x: ["VaR 99% (pagar)", "ES 99% (rata-rata jurang)", "Stres 2008"], y: [4.66, 7.0, 44.0], type: "bar", marker: {color: ["#2a7de1", "#e8a838", "#d62728"]}, name: "Rugi (% dari portofolio)"}]}
  title={"VaR vs ES vs Stres: tiga kedalaman berbeda"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Rugi (% portofolio)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga batang = tiga ukuran risiko untuk portofolio yang sama.</p>
<p><strong>Interpretasi:</strong> VaR 4,66% = <strong>pagar</strong> (99% hari aman). ES 7% = <strong>rata-rata saat pagar jebol</strong> (50% lebih dalam!). Stres 44% = <strong>bencana</strong> (10&times; VaR!). <strong>Manajer yang hanya tahu VaR = tahu pagar, buta jurang, dan tidak pernah mendengar badai.</strong> Ketiganya = <em>paket</em>, bukan <em>pilihan</em>.</p>
</div>
<h2 id="greeks">Greeks — Panel Instrumen Opsi</h2>
<p><strong>Definisi.</strong> <strong>Delta</strong> (Δ): Δharga opsi / Δharga saham (hedge ratio). <strong>Gamma</strong> (Γ): Δdelta / Δsaham (delta <em>berubah</em> — butuh rebalance!). <strong>Theta</strong> (Θ): <em>time decay</em> per hari (opsi <em>membusuk</em>). <strong>Vega</strong>: sensitivitas ke volatilitas.</p>
<p><strong>Delta-neutral</strong>: saham − Δ×opsi → kebal gerakan <em>kecil</em>; gamma/theta tetap berisik (tidak ada hedge sempurna).</p>
<p><strong>Kepribadian/intuisi:</strong> Greeks seperti <strong>panel instrumen pesawat</strong>: delta = kemudi (arah), gamma = responsivitas kemudi (makin cepat makin liar), theta = bahan bakar bocor (waktu menggerogoti), vega = sensitivitas ke cuaca (vol). <strong>Terbang buta tanpa panel = trading opsi tanpa Greeks.</strong></p>
<p><strong>Kapan dipakai:</strong> Market-making & hedging buku opsi; overlay derivatif (PM-C9).</p>
<p><strong>Pendalaman intuisi &mdash; stress test = &ldquo;simulasi bencana&rdquo;.</strong> VaR/ES = <em>statistik</em> (dari data masa lalu). Stress test = <em>skenario</em> (&ldquo;bagaimana jika 2008 terulang? + suku bunga naik 3%?&rdquo;). <strong>Keduanya buta tanpa satu sama lain:</strong> statistik buta terhadap <em>yang belum terjadi</em>; skenario buta terhadap <em>probabilitas</em>. <strong>Framework lengkap = VaR/ES (sehari-hari) + stress (bencana) + limit (disiplin).</strong></p><p><strong>Pendalaman intuisi &mdash; stress test = &ldquo;simulasi bencana&rdquo;.</strong> VaR/ES = <em>statistik</em> (dari data masa lalu). Stress test = <em>skenario</em> (&ldquo;bagaimana jika 2008 terulang? + suku bunga naik 3%?&rdquo;). <strong>Keduanya buta tanpa satu sama lain:</strong> statistik buta terhadap <em>yang belum terjadi</em>; skenario buta terhadap <em>probabilitas</em>. <strong>Framework lengkap = VaR/ES (sehari-hari) + stress (bencana) + limit (disiplin).</strong></p><details className="worked">
<summary>📐 Contoh: Delta hedge (klik untuk buka)</summary>
<p>Jual 100 call, Δ = 0,5. <strong>Hedge</strong>: beli 50 saham → delta-netral.</p>
<p>Saham naik Rp1.000: call rugi 100×0,5×1.000 = Rp50jt; saham untung 50×1.000 = Rp50jt → <strong>net ≈ 0</strong> (gerakan kecil).</p>
<p>Tapi <strong>gamma</strong>: delta call naik jadi 0,6 → hedge kurang → <strong>rebalance</strong> (beli 10 lagi). <strong>Theta</strong>: tiap hari opsi <em>meleleh</em> — penjual call <em>menikmati</em> ini.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Stress test &mdash; skenario 2008</summary>
<p><strong>Soal:</strong> portofolio saham Rp10M. Skenario: pasar &minus;40%, korelasi &rarr; 1, likuiditas kering (<em>haircut</em> 10%). Estimasi rugi stres.</p>
<p><strong>Langkah 1 &mdash; pasar:</strong> 10M &times; 40% = <strong>Rp4M</strong>.</p>
<p><strong>Langkah 2 &mdash; korelasi:</strong> diversifikasi <em>menguap</em> (semua jatuh bersamaan!) &rarr; tidak ada pengurang.</p>
<p><strong>Langkah 3 &mdash; likuiditas:</strong> jika terpaksa jual &rarr; +10% <em>haircut</em> &rarr; <strong>Rp4,4M</strong>.</p>
<p><strong>Bandingkan VaR:</strong> VaR 99% &asymp; Rp466jt &mdash; <strong>stres 10&times; lipat!</strong> <strong>Pelajaran: VaR = cuaca harian; stres = badai abad.</strong> Keduanya dibutuhkan; yang satu tidak menggantikan yang lain.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Reverse stress test</summary>
<p><strong>Soal:</strong> modal Rp1M. Skenario apa yang membuat rugi = Rp1M (bangkrut)?</p>
<p><strong>Pendekatan:</strong> bukan &ldquo;skenario &rarr; rugi&rdquo;, melainkan <strong>&ldquo;rugi target &rarr; skenario apa?&rdquo;</strong> Mis.: butuh pasar &minus;50% + <em>gap</em> likuiditas 20%.</p>
<p><strong>Pertanyaan kunci:</strong> <em>seberapa masuk akal</em> skenario itu? Jika &ldquo;pernah terjadi&rdquo; (2008! 2020!) &rarr; <strong>modal kurang</strong> &rarr; kurangi risiko atau tambah modal. <strong>Reverse stress = mencari <em>titik mati</em>-mu <em>sebelum</em> pasar menemukannya.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Lapis Pertahanan</h2>
      <p>VaR, ES, stress = <strong>tiga lapis</strong>:</p>
      <ol>
        <li><strong>VaR = pagar harian</strong> &mdash; &ldquo;99% hari, rugi &le; X&rdquo;. Untuk <em>monitoring</em> &amp; <em>limit</em>.</li>
        <li><strong>ES = kedalaman jurang</strong> &mdash; &ldquo;saat jebol, rata-rata sedalam Y&rdquo;. Untuk <em>modal</em> &amp; <em>ekor</em>.</li>
        <li><strong>STRESS = simulasi bencana</strong> &mdash; &ldquo;jika 2008 + ... &rarr; rugi Z&rdquo;. Untuk <em>kelangsungan hidup</em>.</li>
      </ol>
      <p><strong>Ketiganya = paket.</strong> VaR saja = buta ekor. ES saja = buta skenario. Stres saja = buta probabilitas. <strong>Lehman = VaR saja.</strong></p>

      <h3>🎙️ Debat: &ldquo;VaR menyebabkan krisis&rdquo;</h3>
      <p><strong>Penuduh:</strong> &ldquo;VaR memberi <em>rasa aman palsu</em>. Bank merasa &lsquo;terkendali&rsquo; &mdash; lalu leverage gila-gilaan. Tanpa VaR, mereka lebih takut &amp; lebih hati-hati.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Termometer tidak menyebabkan demam. Yang salah = <strong>pemakaian</strong> (dibaca sebagai maksimum!, kalibrasi tenang!) &mdash; bukan <strong>alatnya</strong>. Tanpa VaR = buta total.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>VaR = termometer yang dibaca salah.</strong> Solusi bukan <em>buang termometer</em>, melainkan <strong>baca dengan benar</strong> (bukan maksimum!) + <strong>tambah alat</strong> (ES + stres). <strong>Alat + disiplin + governance = aman. Alat saja = ilusi.</strong></p>
      <h3>📊 Data Corner: Backtest VaR</h3>
      <p><strong>Data:</strong> 250 hari, VaR 99%. Ekspektasi jebol = 2,5 hari. Aktual jebol = 9 hari.</p>
      <p><strong>Cara membaca:</strong> 9 &gt;&gt; 2,5 &rarr; <strong>VaR <em>kekecilan</em></strong> (model meremehkan!) &rarr; <strong>zona merah Basel</strong> &rarr; <em>multiplier</em> modal naik! <strong>Tindakan:</strong> kalibrasi ulang (data lebih panjang/stress), cek <em>fat tails</em>, tambah ES. <strong>Backtest = <em>kalibrasi speedometer</em> &mdash; wajib berkala.</strong></p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR 99% Rp466jt berarti rugi maksimal Rp466jt.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>SALAH dan berbahaya.</strong> VaR = <em>ambang</em>: 1% hari rugi <em>melebihi</em> itu — <strong>tanpa batas</strong>. 2008: 6x VaR. Yang menjawab 'berapa parahnya' = <strong>Expected Shortfall + stress test</strong>. VaR tanpa ES = speedometer tanpa rem.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Alpha positif = manajer hebat. Bayar fee mahal tidak apa.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 'Alpha' dari regresi <strong>satu faktor</strong> sering = <strong>exposure faktor tersembunyi</strong> (small-value). Uji dengan <strong>multi-faktor</strong>: jika alpha lenyap, itu <em>beta mahal</em>, bukan skill. Bayar fee untuk alpha murni — beli beta via ETF murah.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Risiko = volatilitas.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> volatilitas = <em>simetris</em> (naik-turun); risiko = <em>asimetris</em> (rugi!). Strategi &ldquo;vol rendah&rdquo; bisa <em>sangat berisiko</em> (carry trade! menjual opsi!). <strong>Risiko = <em>probabilitas &times; keparahan</em> hasil buruk</strong> &mdash; bukan <em>standar deviasi</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Model risiko yang canggih = aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 2008 = model <em>tercanggih</em> + data <em>terbaik</em> + orang <em>terpintar</em> &mdash; gagal karena <strong>asumsi</strong> (data tenang, korelasi stabil). <strong>Kecanggihan &ne; kebenaran.</strong> Yang menyelamatkan = <em>asumsi konservatif</em> + <em>stress test</em> + <em>governance</em>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu pasangkan VaR + stress test.</strong> VaR = cuaca normal; stress = skenario badai (2008, COVID, +300bps). Komite risiko yang hanya lihat VaR = pilot yang hanya lihat speedometer.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Untuk evaluasi manajer: FF3 dulu, kagum kemudian.</strong> Regresikan return ke MKT/SMB/HML sebelum memuji alpha. 90% 'alpha' adalah beta yang belum diidentifikasi.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Ritual risiko harian (5 menit):</strong> (1) <strong>VaR</strong> &mdash; berapa pagar hari ini? (2) <strong>ES</strong> &mdash; sedalam apa jika jebol? (3) <strong>Konsentrasi</strong> &mdash; posisi terbesar berapa %? (4) <strong>Likuiditas</strong> &mdash; bisa keluar dalam sehari? <strong>Empat angka, lima menit, setiap pagi.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator VaR 3 Metode</h2>
<p>Hitung VaR parametrik, historis, dan Monte Carlo dari return sintetis berekor tebal.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator VaR"}
  hint={"Ubah TAIL 3 -> 6 (ekor makin tebal). VaR historis naik, parametrik tetap — model normal meremehkan!"}
  defaultCode={"# VaR: parametrik vs historis vs Monte Carlo\nimport random, math, statistics\nrandom.seed(9)\nNILAI, SIG = 10_000_000_000, 0.02\nTAIL = 3  # derajat kebebasan t-dist (kecil = ekor tebal; ubah!)\n\ndef rt():\n    # t-dist kasar via campuran normal\n    return random.gauss(0, SIG) * math.sqrt(TAIL/max(0.5, random.gauss(TAIL, math.sqrt(2*TAIL))))\n\nrets = [rt() for _ in range(5000)]\nrets_sorted = sorted(rets)\n\nvar_param = 2.33 * statistics.stdev(rets) * NILAI\nvar_hist = -rets_sorted[int(0.01*len(rets_sorted))] * NILAI\n# Monte Carlo: simulasi 20000 skenario dari distribusi empiris\nmc = sorted(random.choice(rets) for _ in range(20000))\nvar_mc = -mc[int(0.01*len(mc))] * NILAI\n# Expected Shortfall (historis)\nes = -sum(r for r in rets_sorted[:int(0.01*len(rets_sorted))])/int(0.01*len(rets_sorted)) * NILAI\n\nprint(f\"VaR 99% parametrik : Rp{var_param/1e9:.2f} M\")\nprint(f\"VaR 99% historis   : Rp{var_hist/1e9:.2f} M\")\nprint(f\"VaR 99% Monte Carlo: Rp{var_mc/1e9:.2f} M\")\nprint(f\"ES 99% (historis)  : Rp{es/1e9:.2f} M  <- rata-rata saat jebol!\")\nprint(\"\\nEkor tebal: historis > parametrik. Jangan percaya normal!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Regresi Fama-French 3 Faktor</h2>
<p>Regresi return manajer ke MKT/SMB/HML — pisahkan alpha dari beta.</p>
<PyodideLab
  title={"Lab 2 — Regresi FF3"}
  hint={"Ubah ALPHA_TRUE 0.005 -> 0.02 (manajer benar-benar skilled). Alpha terdeteksi!"}
  defaultCode={"# Fama-French 3 faktor from scratch (n kecil, ilustrasi)\nimport random\nrandom.seed(13)\nALPHA_TRUE = 0.005  # alpha bulanan sebenarnya (ubah!)\nN = 60\nmkt = [random.gauss(0.008, 0.04) for _ in range(N)]\nsmb = [random.gauss(0.002, 0.03) for _ in range(N)]\nhml = [random.gauss(0.003, 0.03) for _ in range(N)]\nret = [ALPHA_TRUE + 1.0*m + 0.6*s + 0.8*h + random.gauss(0, 0.015)\n       for m, s, h in zip(mkt, smb, hml)]\n\ndef solve(A, b):\n    n = len(A); M = [r[:] + [v] for r, v in zip(A, b)]\n    for c in range(n):\n        p = max(range(c, n), key=lambda r: abs(M[r][c])); M[c], M[p] = M[p], M[c]\n        for r in range(n):\n            if r != c:\n                f = M[r][c]/M[c][c]\n                for k in range(c, n+1): M[r][k] -= f*M[c][k]\n    return [M[i][n]/M[i][i] for i in range(n)]\n\ncols = [[1]*N, mkt, smb, hml]\nXtX = [[sum(a*b for a, b in zip(cols[i], cols[j])) for j in range(4)] for i in range(4)]\nXtY = [sum(a*b for a, b in zip(cols[i], ret)) for i in range(4)]\nb = solve(XtX, XtY)\nprint(f\"alpha={b[0]:.4f}/bln (true {ALPHA_TRUE:.4f}), bMKT={b[1]:.2f}, bSMB={b[2]:.2f}, bHML={b[3]:.2f}\")\nprint(f\"Alpha tahunan ~ {b[0]*12:.1%}. Signifikan? Butuh t-stat (SE) - di sini hanya estimasi.\")\nprint(\"\\nTanpa FF3, return 9.7% terlihat 'alpha'. Dengan FF3: mostly beta!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Set limit risiko harian → <strong>VaR + ES + stress test</strong></h3>
<p><strong>Kenapa:</strong> VaR sendiri buta ekor.</p>
<p><strong>Contoh nyata:</strong> VaR 99% + skenario 2008.</p>
</div>
<div className="decision-card">
<h3>2. Klaim alpha manajer → <strong>Regresi multi-faktor dulu</strong></h3>
<p><strong>Kenapa:</strong> Pisahkan beta dari skill.</p>
<p><strong>Contoh nyata:</strong> FF3 sebelum bayar fee 2%.</p>
</div>
<div className="decision-card">
<h3>3. Hedging buku opsi → <strong>Delta-neutral + monitor gamma/theta</strong></h3>
<p><strong>Kenapa:</strong> Delta bergerak; waktu menggerogoti.</p>
<p><strong>Contoh nyata:</strong> Rebalance berkala.</p>
</div>
<div className="decision-card">
<h3>4. Data tenang, pasar bergejolak → <strong>Naikkan VaR (GARCH) / pakai stressed VaR</strong></h3>
<p><strong>Kenapa:</strong> VaR historis basi.</p>
<p><strong>Contoh nyata:</strong> Setelah crash: kalibrasi ulang.</p>
</div>
<div className="decision-card">
<h3>5. Angka risiko → <strong>VaR + ES + stres; jangan baca VaR sebagai maksimum</strong></h3>
<p><strong>Kenapa:</strong> VaR = pagar; ES = jurang; stres = badai.</p>
<p><strong>Contoh nyata:</strong> Lehman = VaR &ldquo;aman&rdquo;, rugi 6× VaR berhari-hari.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>VaR = ambang</strong>, bukan maksimum.</li><li><strong>ES + stress</strong> selalu mendampingi.</li><li><strong>Alpha diuji multi-faktor.</strong></li><li><strong>Greeks</strong> = panel instrumen.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: VaR 'Aman' 6x Jebol</h2>
<div className="callout">
<p>Bank: VaR 99% USD 100jt ('terkendali'). Lehman: rugi USD 600jt/hari berhari-hari.</p>
<p><strong>Vignette lanjutan.</strong> Bank melaporkan VaR 99% USD 100jt (&ldquo;risiko terkendali&rdquo;). Krisis: rugi USD 600jt/hari <em>berhari-hari</em> (6&times; VaR!). Investigasi: VaR dikalibrasi dari data 2004&ndash;06 (tenang!), dibaca sebagai &ldquo;maksimum&rdquo;, tidak ada ES/stress test.</p>
<p><strong>Pertanyaan:</strong> (a) Apa yang salah dari pembacaan VaR? (b) Tiga perbaikan framework? (c) Kenapa ES lebih baik? (d) Jika ES 99% = USD 250jt, apa yang <em>seharusnya</em> dilakukan bank? (e) Rancang <em>risk dashboard</em> yang benar.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Membaca VaR sebagai maksimum</strong> + kalibrasi dari <strong>data tenang</strong> (2004–06) untuk badai. VaR memang berkata 'bisa lebih' — diabaikan.</p>
<p>(b) <strong>(1)</strong> ES + stress test; <strong>(2)</strong> stressed VaR (kalibrasi periode krisis); <strong>(3)</strong> limit + governance (bukan cuma angka).</p>
<p>(c) <strong>ES = rata-rata saat jebol</strong> (koheren, subadditive) &mdash; menjawab &lsquo;sedalam apa jurangnya&rsquo;, bukan cuma &lsquo;di mana pagarnya&rsquo;.</p>
<p>(d) <strong>ES USD 250jt = 2,5&times; VaR</strong> &rarr; <strong>ekor tebal terdeteksi!</strong> Tindakan: (1) <strong>tambah modal</strong> (<em>buffer</em> untuk ekor); (2) <strong>kurangi konsentrasi</strong> (posisi yang menyumbang ekor!); (3) <strong>stress test</strong> skenario 2008 &mdash; jika rugi stres &gt; modal &rarr; <strong>darurat</strong>. <strong>Angka ES bukan hiasan &mdash; ia <em>perintah</em>.</strong></p>
<p>(e) <strong>Dashboard:</strong> (1) <strong>VaR</strong> (harian, <em>tren</em> &mdash; naik = waspada); (2) <strong>ES</strong> (kedalaman ekor); (3) <strong>Stressed VaR</strong> (kalibrasi krisis); (4) <strong>Konsentrasi</strong> (top-5 posisi %); (5) <strong>Likuiditas</strong> (hari untuk keluar); (6) <strong>Limit usage</strong> (% dari limit). <strong>Enam angka, satu layar, <em>tren</em> lebih penting dari <em>level</em>.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Risiko yang Tak Terukur</h2>
      <h3>1. Model risk &mdash; risiko dari pengukur risiko</h3>
      <p>VaR = <em>model</em> &mdash; dan model bisa <em>salah</em> (asumsi normal!, data basi!, implementasi bug!). <strong>Solusi:</strong> <em>backtest</em> VaR (berapa kali jebol vs ekspektasi 1%?), <em>validasi independen</em>, <em>multiple measures</em>. <strong>Pengukur yang tidak dikalibrasi = <em>speedometer rusak</em>.</strong></p>
      <h3>2. Liquidity risk &mdash; &ldquo;bisa keluar?&rdquo;</h3>
      <p>VaR mengasumsikan <strong>bisa likuidasi <em>seketika</em> di harga pasar</strong>. Krisis = <em>tidak bisa</em> (gap! haircut!). <strong>LVaR</strong> (<em>liquidity-adjusted</em>) menambah <em>cost of liquidation</em>. Praktis: <strong>atur limit <em>ukuran posisi</em></strong> (maks % volume harian!) &mdash; bukan cuma limit VaR.</p>
      <h3>3. Operational risk &mdash; manusia &amp; sistem</h3>
      <p>Barings (1995): <em>rogue trader</em> Leeson &rarr; bangkrut. Bukan <em>model</em> yang gagal &mdash; melainkan <strong>kontrol</strong>. <strong>Three lines of defense:</strong> (1) bisnis, (2) risk independen, (3) audit. <strong>Risiko terbesar seringkali bukan di <em>spreadsheet</em> &mdash; melainkan di <em>ruang server</em> &amp; <em>ruang trading</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; VaR kilat</h3>
      <p>Portofolio Rp20M, &sigma; = 1,5%/hari. VaR 99%?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>20M &times; 2,33 &times; 0,015 = <strong>Rp699jt</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; ES kilat</h3>
      <p>10 hari terburuk (dari 1000): rata-rata &minus;6%. ES 99%?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>6%</strong> &mdash; rata-rata 1% terburuk.</p>
      </details>
      <h3>Drill 3 &mdash; Subadditivity</h3>
      <p>VaR(A) = 50, VaR(B) = 50, VaR(A+B) = 110. Masalah?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>VaR tidak subadditive</strong> &mdash; menghukum diversifikasi! Gunakan ES.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;VaR 99% Rp100jt &rarr; maksimum rugi Rp100jt.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> VaR = ambang, bukan maksimum. 1% kasus <em>melebihi</em> &mdash; gunakan ES/stress untuk &ldquo;seberapa parah&rdquo;.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. VaR 99% harian Rp466jt. Artinya?"}
  options={
    ["Rugi maks Rp466jt",
    "1% hari rugi bisa melebihi Rp466jt (tanpa batas)",
    "Rugi pasti Rp466jt",
    "Aman 100%"]
  }
  correct={1}
  explanation={"Benar: VaR = ambang kuantil, bukan maksimum. 2008: 6x VaR. Untuk 'seberapa parah' lihat ES."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Manajer return 9,7%: dekomposisi FF3 menunjukkan 9,2% faktor + 0,5% alpha. Kesimpulan?"}
  options={
    ["Hebat — bayar fee mahal",
    "Mostly beta — beli via ETF murah; alpha kecil",
    "Alpha 9,7%",
    "Tidak bisa dinilai"]
  }
  correct={1}
  explanation={"Benar: factor lens — 9,2% = exposure (murah), 0,5% = skill. Fee 2% untuk 0,5% = mahal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Jual 100 call Δ=0,5. Hedge delta-neutral?"}
  options={
    ["Beli 100 saham",
    "Beli 50 saham",
    "Jual 50 saham",
    "Tidak perlu hedge"]
  }
  correct={1}
  explanation={"Benar: butuh +50 delta (100×0,5). Tapi gamma → delta bergerak → rebalance dinamis."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Opsi dibiarkan mendekati expiry tanpa pergerakan. Yang terjadi?"}
  options={
    ["Tidak ada",
    "Theta: time value meleleh (penjual untung)",
    "Delta naik",
    "Vega naik"]
  }
  correct={1}
  explanation={"Benar: theta = time decay. Waktu = musuh pembeli, teman penjual opsi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Ekor tebal (krisis). Metode VaR terbaik?"}
  options={
    ["Parametrik normal",
    "Historis/MC yang menangkap ekor + stress test",
    "Abaikan",
    "VaR tidak berguna"]
  }
  correct={1}
  explanation={"Benar: normal meremehkan ekor (lihat lab: historis &gt; parametrik). Pasangkan dengan stress test."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Bank: VaR 99% Rp100M, ES 99% Rp250M. Apa tindakan yang TEPAT?"}
  options={
    ["Aman — VaR kecil, tidak perlu tindakan",
    "Tambah modal & kurangi konsentrasi — ES 2,5× VaR = ekor tebal terdeteksi",
    "Ganti VaR dengan volatilitas historis",
    "Naikkan limit trading karena VaR rendah"]}
  correct={1}
  explanation={"Benar: ES 2,5× VaR menandakan ekor tebal — VaR menyembunyikan risiko. Tindakan: tambah buffer modal, kurangi posisi penyumbang ekor, jalankan stress test. Angka ES adalah perintah, bukan hiasan."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Model faktor</strong>: makro, fundamental (FF3), statistik; alpha = residu.</li>
<li><strong>VaR</strong>: parametrik/historis/MC — ambang kuantil, <strong>bukan maksimum</strong>.</li>
<li><strong>ES</strong>: rata-rata rugi saat VaR jebol; koheren.</li>
<li><strong>Greeks</strong>: delta (arah), gamma (perubahan delta), theta (waktu), vega (vol).</li>
<li><strong>Aturan</strong>: VaR + ES + stress; FF3 sebelum kagum alpha.</li>
<li><strong>Pelajaran 2008</strong>: kalibrasi tenang untuk badai = bunuh diri.</li>

<li><strong>VaR:</strong> pagar (ambang 99%); bukan maksimum!</li>
<li><strong>ES:</strong> rata-rata saat jebol; subadditive; standar Basel III.</li>
<li><strong>Stress:</strong> skenario bencana; reverse stress = cari titik mati.</li>
<li><strong>Kapan TIDAK pakai:</strong> VaR saja tanpa ES/stres; kalibrasi tenang untuk badai; baca VaR sebagai &ldquo;aman&rdquo;.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b7-currency" className="btn btn-secondary btn-sm">← PM-B7</Link>
        <Link href="/learn/pm-b9-intercorporate" className="btn btn-primary btn-sm">PM-B9 →</Link>
      </div>
    </div>
  );
}

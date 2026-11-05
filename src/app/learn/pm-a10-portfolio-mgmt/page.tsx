"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA10PortfolioMgmtPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A10 — Portfolio Management</span>
        <h1 className="display-title">Portfolio Management:<br/>Diversifikasi, CAPM & IPS</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita Pembuka: Dua Sepupu, Satu Angka, Nasib Berbeda</a></li>
<li><a href="#diversifikasi">Diversifikasi</a></li>
<li><a href="#capm">CAPM & SML</a></li>
<li><a href="#ips">IPS, Behavioral & ESG</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#sintesis">Sintesis: Alur Kerja Manajer</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Rudi vs Sinta</a></li>
<li><a href="#quiz">Quiz (6 soal)</a></li>
<li><a href="#latihan">Latihan Mandiri</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan trade-off risk-return dan menghitung return portofolio.</li>
<li>Menjelaskan mengapa korelasi &lt; 1 menurunkan risiko (diversifikasi).</li>
<li>Menghitung expected return via CAPM dan membaca SML.</li>
<li>Menjelaskan komponen IPS dan bias behavioral dasar.</li>
<li>Menghitung bobot minimum-variance dan mengevaluasi keputusan beli/jual dari posisi relatif terhadap SML (vignette-style).</li>
</ul>
      </div>

            {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Sepupu, Satu Angka, Nasib Berbeda</h2>
      <div className="story">
        <p>Lebaran 2025. Di grup WhatsApp keluarga, dua sepupu pamer portofolio. <strong>Rudi</strong>: &ldquo;Gue <em>all-in</em> Rp100 juta di satu saham tambang. Expected return 15% — analis bilang prospek bagus.&rdquo; <strong>Sinta</strong>: &ldquo;Gue bagi dua: Rp50 juta saham tambang, Rp50 juta saham consumer goods. Expected return gue juga 15%.&rdquo;</p>
        <p>Setahun kemudian, krisis komoditas mengguncang pasar. Rudi: <strong>&minus;25%</strong> &mdash; Rp25 juta lenyap dalam dua belas bulan. Sinta: <strong>&minus;8%</strong>. Padahal <em>semua angka di atas kertas identik</em>: return harapan 15%, volatilitas masing-masing saham 30%.</p>
        <p>Twist-nya: Sinta <strong>tidak lebih pintar memilih saham</strong> &mdash; ia bahkan tidak tahu saham mana yang akan naik. Yang ia pegang hanya satu angka yang luput dari perhatian Rudi: <strong>korelasi 0,2</strong> antara tambang dan consumer goods. Saat tambang jatuh, consumer goods menahan; guncangannya <em>saling meniadakan</em>, bukan saling menguatkan.</p>
        <p>Rudi berasumsi &ldquo;dua saham = setengah risiko&rdquo;. Matematika berkata lain: <strong>risiko portofolio bukan rata-rata risiko &mdash; ia ditentukan oleh korelasi</strong>. Inilah satu-satunya &ldquo;makan siang gratis&rdquo; di keuangan. Lesson ini membedah <em>matematikanya</em> (diversifikasi), <em>harganya</em> (CAPM: berapa return yang wajar untuk tiap risiko), lalu <em>manusianya</em> (IPS &amp; behavioral &mdash; kenapa Rudi tetap <em>all-in</em> meski tahu teorinya).</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="diversifikasi">Diversifikasi — Satu-satunya Makan Siang Gratis</h2>
<p><strong>Definisi.</strong> <strong>Return portofolio</strong> = rata-rata tertimbang return. <strong>Risiko portofolio</strong>: σ_p² = w1²σ1² + w2²σ2² + <strong>2w1w2ρσ1σ2</strong> — suku terakhir = <strong>korelasi</strong>. Jika <strong>ρ &lt; 1</strong>, σ_p &lt; rata-rata σ → <strong>diversifikasi bekerja</strong>. Risiko terbagi: <strong>sistematis</strong> (pasar; tidak bisa didiversifikasi) vs <strong>idiosinkratis</strong> (spesifik; bisa).</p>
<p>Batas: ~30 saham menghilangkan hampir semua risiko idiosinkratis — sisanya risiko pasar.</p>
<Tex math={String.raw`\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`w`} />: bobot tiap aset</li>
<li><Tex math={String.raw`\sigma`} />: volatilitas (standar deviasi return)</li>
<li><Tex math={String.raw`\rho`} />: korelasi (−1 s.d. +1) — kunci diversifikasi</li>
<li>ρ = 1: tidak ada manfaat; ρ = 0,2 (Sinta): σ_p jauh di bawah 30%; ρ = −1: bisa nol! (teoretis)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Diversifikasi seperti <strong>tim dayung</strong>: jika semua mendayung seirama (ρ=1), perahu oleng bersama. Jika ritmenya beda (ρ rendah), guncangan saling meniadakan — perahu stabil. Korelasi = 'keseiramaan' dayung.</p>
<p><strong>Kapan dipakai:</strong> Konstruksi portofolio: cari aset return baik + korelasi rendah (bukan cuma return tinggi).</p>
<p><strong>Pendalaman intuisi &mdash; kenapa &ldquo;rata-rata&rdquo; gagal untuk risiko?</strong> Return portofolio itu <em>linear</em>: 50% &times; 15% + 50% &times; 15% = 15%, titik. Risiko itu <em>kuadratik</em>: rumusnya punya suku silang 2w₁w₂&rho;&sigma;₁&sigma;₂ yang mencatat <strong>apakah kedua aset jatuh <em>bersamaan</em></strong>. Analogi: dua pemanah. Skor rata-rata tim = rata-rata skor individu (linear). Tapi <em>varians</em> skor tim kecil jika saat satu meleset ke kiri, yang lain meleset ke kanan (saling meniadakan) &mdash; dan besar jika keduanya meleset ke arah yang sama. Korelasi = &ldquo;apakah melesetnya searah?&rdquo;. <strong>Investor dibayar untuk return (linear, gampang), tapi bertahan hidup karena mengelola risiko (nonlinear, licik).</strong></p>

<details className="worked">
<summary>📐 Contoh: Hitung Sinta (klik untuk buka)</summary>
<p>w1 = w2 = 0,5; σ1 = σ2 = 30%; ρ = 0,2.</p>
<p><strong>σ_p²</strong> = 0,25×0,09 + 0,25×0,09 + 2×0,25×0,2×0,09 = 0,0225 + 0,0225 + 0,009 = 0,054.</p>
<p><strong>σ_p = 23,2%</strong> — dari 30%! Return harapan tetap 15%. <strong>Risiko turun 23% tanpa mengorbankan return</strong> — inilah makan siang gratis.</p>
<p>Jika ρ = 0,9: σ_p = 29,2% (hampir tidak membantu). <strong>Korelasi menentukan segalanya.</strong></p>
</details>
<p><strong>Intuisi lanjutan &mdash; korelasi bukan sifat abadi.</strong> Angka korelasi 0,2 itu dihitung dari <em>data historis tenang</em>. Pelajaran pahit 2008 dan Maret 2020: saat krisis sistemik, korelasi antar-aset <strong>melonjak mendekati 1</strong> &mdash; semua jatuh bersama, justru saat diversifikasi paling dibutuhkan. Fenomena ini disebut <em>correlation breakdown</em>. Implikasinya dua: (1) diversifikasi antar-saham saja tidak cukup &mdash; butuh diversifikasi antar <strong>kelas aset dan faktor risiko</strong> (saham, obligasi, emas, kas); (2) uji portofoliomu dengan <em>stress test</em> &ldquo;bagaimana jika semua korelasi naik 0,3?&rdquo;, bukan cuma data historis manis.</p>
<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Bobot minimum-variance &mdash; berapa porsi ideal tiap aset?</summary>
<p>Soal: dua aset, σ₁ = 20%, σ₂ = 30%, ρ = 0,3. Berapa bobot <strong>w₁</strong> yang <em>meminimalkan</em> risiko portofolio? Rumus bobot minimum-variance:</p>
<Tex math={String.raw`w_1^* = \frac{\sigma_2^2 - \rho\sigma_1\sigma_2}{\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2}`} block />
<p><strong>Langkah 1 &mdash; hitung komponen:</strong> σ₁² = 0,04; σ₂² = 0,09; ρσ₁σ₂ = 0,3 &times; 0,2 &times; 0,3 = 0,018.</p>
<p><strong>Langkah 2 &mdash; pembilang:</strong> 0,09 &minus; 0,018 = 0,072. <strong>Penyebut:</strong> 0,04 + 0,09 &minus; 2 &times; 0,018 = 0,094.</p>
<p><strong>Langkah 3 &mdash; bobot:</strong> w₁* = 0,072 / 0,094 = <strong>76,6%</strong>, w₂* = 23,4%. Aset yang <em>lebih kalem</em> (σ kecil) dapat porsi lebih besar &mdash; intuitif.</p>
<p><strong>Langkah 4 &mdash; verifikasi risiko:</strong> σ_p² = 0,766²&times;0,04 + 0,234²&times;0,09 + 2&times;0,766&times;0,234&times;0,018 = 0,0349 &rarr; <strong>σ_p = 18,7%</strong>.</p>
<p>Bandingkan: 100% aset 1 = 20,0%; 50/50 = 20,4%. Bobot optimal 76,6/23,4 memberi <strong>18,7% &mdash; lebih rendah dari kedua aset individual!</strong> Inilah bukti numerik makan siang gratis. (Catatan CFA: rumus ini mengasumsikan tanpa <em>short-selling constraint</em>; di praktik ada batasan w &ge; 0.)</p>
</details>
<details className="worked">
<summary>📐 Contoh 3 (gaya CFA): Portofolio 3 aset &mdash; matriks korelasi beraksi</summary>
<p>Soal: tiga saham bobot sama (⅓ tiap): σ_A = 20%, σ_B = 25%, σ_C = 30%; ρ_AB = 0,3, ρ_AC = 0,1, ρ_BC = 0,4. Hitung σ_p.</p>
<p><strong>Langkah 1 &mdash; suku varians individual:</strong> &Sigma;wᵢ²σᵢ² = (0,04 + 0,0625 + 0,09)/9 = <strong>0,02139</strong>.</p>
<p><strong>Langkah 2 &mdash; suku korelasi silang:</strong> 2&Sigma;&Sigma;wᵢwⱼρᵢⱼσᵢσⱼ = (2/9) &times; [0,3&times;0,2&times;0,25 + 0,1&times;0,2&times;0,3 + 0,4&times;0,25&times;0,3] = (2/9) &times; [0,015 + 0,006 + 0,03] = (2/9) &times; 0,051 = <strong>0,01133</strong>.</p>
<p><strong>Langkah 3 &mdash; total:</strong> σ_p² = 0,02139 + 0,01133 = 0,03272 &rarr; <strong>σ_p = 18,1%</strong>.</p>
<p>Rata-rata volatilitas ketiga saham = 25%. Portofolio: <strong>18,1%</strong>. Perhatikan: pasangan A&ndash;C (ρ = 0,1, paling rendah) memberi kontribusi diversifikasi terbesar &mdash; <strong>moralnya: cari pasangan berkorelasi rendah, bukan sekadar aset &ldquo;bagus&rdquo;</strong>.</p>
</details>

<PlotlyChart
  data={[{x: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], y: [23.2,24.4,25.6,26.7,27.8,28.8,29.6,30.0,30.0], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "σ_p (ρ=0,2)"}, {x: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], y: [27.6,28.0,28.4,28.8,29.2,29.5,29.8,30.0,30.0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "σ_p (ρ=0,9)"}]}
  title={"Risiko portofolio vs korelasi (2 aset, σ=30%)"}
  layout={{xaxis: {title: "Bobot aset 1"}, yaxis: {title: "σ portofolio (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = bobot aset 1 (sisanya aset 2). Biru = korelasi rendah, kuning = tinggi.</p>
<p><strong>Interpretasi:</strong> Korelasi 0,2 (biru): lembah dalam di tengah (50/50) — <strong>diversifikasi maksimal</strong>. Korelasi 0,9 (kuning): hampir datar — dua saham 'kembar' = satu saham. <strong>Cek korelasi sebelum menambah saham ke-31.</strong></p>
</div>
<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian CFA &mdash; Diversifikasi:</strong> soal ujian <em>suka</em> memberi &ldquo;portofolio 40 saham&rdquo; lalu bertanya apakah terdiversifikasi baik. <strong>Jebakan:</strong> jika 40 saham itu semuanya dari <em>satu sektor &amp; satu negara</em>, jawabannya <strong>tidak</strong> &mdash; korelasi intra-sektor tinggi. CFA menguji apakah kamu memeriksa <em>korelasi</em>, bukan menghitung ticker. Kata kunci jawaban: &ldquo;<em>number of securities is irrelevant; what matters is correlation</em>&rdquo;.</p>
</div>

<PlotlyChart
  data={[{x: [1,2,5,10,20,30,50], y: [30,23,20.5,18.8,17.8,17.2,16.8], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "σ portofolio"}, {x: [1,50], y: [16,16], type: "scatter", mode: "lines", line: {dash: "dash", color: "#d62728"}, name: "Risiko sistematis (batas bawah)"}]}
  title={"Manfaat diversifikasi vs jumlah saham (ilustrasi)"}
  layout={{xaxis: {title: "Jumlah saham dalam portofolio"}, yaxis: {title: "σ portofolio (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = jumlah saham (skala tidak linear agar efek awal terlihat). Biru = risiko portofolio; garis merah putus-putus = risiko sistematis 16% (batas bawah yang tak bisa ditembus diversifikasi).</p>
<p><strong>Interpretasi:</strong> Penurunan <strong>paling curam di 1&rarr;10 saham</strong> (30% &rarr; 18,8%) &mdash; inilah &ldquo;80% manfaat dari 20% usaha&rdquo;. Setelah ~30 saham, kurva <em>mendatar</em> mendekati 16%: menambah saham ke-31+ hampir tidak mengurangi risiko. <strong>Implikasi praktis:</strong> untuk investor ritel, reksadana indeks berisi 30&ndash;50 saham sudah menangkap hampir seluruh manfaat diversifikasi &mdash; sisanya adalah <em>stock picking</em>, bukan diversifikasi.</p>
</div>

<h2 id="capm">CAPM — Harga Risiko</h2>
<p><strong>Definisi.</strong> <strong>CAPM</strong>: E(R_i) = R_f + β_i[E(R_m) − R_f]. <strong>Beta</strong> = risiko sistematis (sensitivitas ke pasar). <strong>SML</strong> (<em>security market line</em>): garis E(R) vs β — aset <em>di atas</em> SML = undervalued (return &gt; wajar untuk risikonya).</p>
<p><strong>CML</strong> vs SML: CML untuk portofolio <em>efisien</em> (risiko total), SML untuk <em>semua</em> aset (risiko sistematis).</p>
<Tex math={String.raw`E(R_i) = R_f + \beta_i [E(R_m) - R_f]`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`R_f`} />: risk-free rate</li>
<li><Tex math={String.raw`\beta_i`} />: beta = Cov(R_i,R_m)/Var(R_m) (dari regresi PM-A2!)</li>
<li><Tex math={String.raw`E(R_m)-R_f`} />: market risk premium (kompensasi risiko pasar)</li>
<li>β = 1: ikut pasar; β &gt; 1: agresif; β &lt; 1: defensif; β negatif: hedge (langka)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> CAPM seperti <strong>daftar harga risiko</strong>: pasar membayar 'upah' hanya untuk risiko yang <em>tidak bisa</em> didiversifikasi (sistematis). Risiko idiosinkratis = kerja bakti — tidak dibayar, jadi diversifikasikan saja.</p>
<p><strong>Kapan dipakai:</strong> Required return untuk DDM (PM-A6), WACC (PM-A5), evaluasi alpha (PM-C5).</p>
<p><strong>Pendalaman intuisi &mdash; beta sebagai &ldquo;ukuran keterpaparan badai&rdquo;.</strong> Bayangkan pasar sebagai lautan. Beta 1,5 = kapal yang oleng 1,5&times; lebih hebat tiap ada ombak (pasar naik 10% &rarr; kapal naik 15%; pasar turun 10% &rarr; kapal ambles 15%). Beta 0,5 = kapal stabilizer &mdash; ombak 10% hanya menggoyang 5%. CAPM berkata: <strong>penumpang (investor) hanya mau naik kapal oleng jika tiketnya didiskon</strong> (expected return lebih tinggi). Diskon itu = &beta; &times; premi pasar. Dan SML adalah <em>daftar harga diskon</em> yang disepakati seluruh pasar &mdash; inilah mengapa manajer aktif yang <em>konsisten</em> menghasilkan alpha positif sangat langka, dan jasanya sangat mahal &mdash; titik di atas garis = diskon kemurahan (undervalued), di bawah garis = kemahalan.</p>

<details className="worked">
<summary>📐 Contoh: Wajar tidak return 18%? (klik untuk buka)</summary>
<p>R_f = 6%, E(R_m) = 12%, β saham = 1,5. <strong>E(R) CAPM</strong> = 6% + 1,5×6% = <strong>15%</strong>.</p>
<p>Aktual/forecast 18% → <strong>di atas SML</strong> → undervalued (+3% alpha!). Forecast 12% → di bawah SML → overvalued.</p>
<p><strong>Alpha</strong> = aktual − CAPM. Inilah yang diburu manajer aktif (dan diuji di PM-C5).</p>
</details>
<p><strong>Intuisi lanjutan &mdash; kenapa pasar hanya membayar risiko sistematis?</strong> Bayangkan dua risiko: (1) pabrikmu kebakaran &mdash; risiko ini <em>spesifik</em>; (2) resesi global &mdash; risiko ini menimpa semua. Risiko (1) bisa dihilangkan <em>gratis</em> dengan memegang 30+ saham (contoh 3 di atas). Karena bisa dihilangkan gratis, <strong>pasar yang kompetitif tidak akan membayar premi untuknya</strong> &mdash; sama seperti tidak ada yang mau membayar mahal untuk &ldquo;jasa&rdquo; yang bisa didapat gratis. Yang tersisa dan <em>harus</em> ditanggung investor adalah risiko sistematis (&beta;) &mdash; dan untuk menanggungnya, pasar membayar upah: <em>market risk premium</em>. CAPM pada dasarnya adalah <strong>daftar upah risiko</strong>.</p>
<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Beta dari korelasi &mdash; dua jalan menuju angka yang sama</summary>
<p>Soal: saham PT Maju berkorelasi 0,86 dengan pasar; σ_saham = 28%, σ_pasar = 20%. Hitung beta.</p>
<Tex math={String.raw`\beta_i = \frac{Cov(R_i, R_m)}{Var(R_m)} = \rho_{i,m}\frac{\sigma_i}{\sigma_m}`} block />
<p><strong>Langkah 1:</strong> rasio volatilitas = 28/20 = 1,4 &mdash; saham ini 40% lebih &ldquo;goyang&rdquo; dari pasar.</p>
<p><strong>Langkah 2:</strong> &beta; = 0,86 &times; 1,4 = <strong>1,204 &asymp; 1,2</strong>.</p>
<p><strong>Interpretasi:</strong> beta 1,2 = jika pasar naik 1%, saham ini cenderung naik 1,2% (dan sebaliknya saat turun). Perhatikan dua komponen beta: <em>korelasi</em> (seberapa seirama dengan pasar) &times; <em>volatilitas relatif</em> (seberapa besar goyangannya). Saham bisa berbeta tinggi karena sangat seirama <em>atau</em> karena sangat volatil &mdash; dua &ldquo;kepribadian&rdquo; risiko yang berbeda!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3 (gaya CFA): Keputusan beli/jual dari SML &mdash; dua saham, satu garis</summary>
<p>Soal: R_f = 6%, market risk premium = 6%. Saham X: &beta; = 1,2, return ekspektasi analis 16%. Saham Y: &beta; = 0,8, return ekspektasi 9%. Mana yang dibeli?</p>
<p><strong>Langkah 1 &mdash; required return CAPM:</strong> X: 6% + 1,2&times;6% = <strong>13,2%</strong>. Y: 6% + 0,8&times;6% = <strong>10,8%</strong>.</p>
<p><strong>Langkah 2 &mdash; alpha:</strong> X: 16% &minus; 13,2% = <strong>+2,8%</strong> (di <em>atas</em> SML &rarr; <strong>undervalued &rarr; BELI</strong>). Y: 9% &minus; 10,8% = <strong>&minus;1,8%</strong> (di <em>bawah</em> SML &rarr; <strong>overvalued &rarr; JUAL/hindari</strong>).</p>
<p><strong>Jebakan klasik:</strong> &ldquo;Saham X return-nya 16%, lebih tinggi dari Y yang 9% &mdash; jelas X lebih bagus.&rdquo; <strong>Salah!</strong> Setelah disesuaikan risiko (beta), X memang masih menang &mdash; tapi bisa saja sebaliknya: return 16% dengan beta 2,5 (required 21%) = <em>overvalued</em> meski angkanya besar. <strong>Jangan pernah menilai return tanpa menormalkan risikonya.</strong></p>
</details>
<PlotlyChart
  data={[{x: [0,0.5,1,1.5,2], y: [6,9,12,15,18], type: "scatter", mode: "lines", marker: {color: "#2a7de1"}, name: "SML (Rf=6%, MRP=6%)"}, {x: [1.2], y: [16], type: "scatter", mode: "markers", marker: {color: "#2ca02c", size: 14}, name: "Saham X (β=1,2, ekspektasi 16%)"}, {x: [0.8], y: [9], type: "scatter", mode: "markers", marker: {color: "#d62728", size: 14}, name: "Saham Y (β=0,8, ekspektasi 9%)"}, {x: [1.0], y: [12], type: "scatter", mode: "markers", marker: {color: "#7f7f7f", size: 14}, name: "Saham Z (β=1,0, ekspektasi 12%)"}]}
  title={"Security Market Line: siapa di atas / di bawah garis?"}
  layout={{xaxis: {title: "Beta (risiko sistematis)"}, yaxis: {title: "Expected return (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = beta (risiko sistematis), sumbu Y = expected return. Garis biru = SML: return &ldquo;wajar&rdquo; untuk tiap level beta pada Rf 6% dan premi pasar 6%.</p>
<p><strong>Interpretasi:</strong> Saham X (hijau) di <strong>atas</strong> garis &rarr; ekspektasi 16% melebihi wajar 13,2% &rarr; <strong>undervalued</strong> (alpha +2,8%). Saham Y (merah) di <strong>bawah</strong> garis &rarr; overvalued. Saham Z tepat di garis &rarr; <em>fairly valued</em>. <strong>Keputusan beli/jual = posisi relatif terhadap SML, bukan besar return absolut.</strong> Inilah cara analis ekuitas memakai CAPM setiap hari.</p>
</div>
<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian CFA &mdash; CAPM:</strong> (1) <strong>Beta negatif</strong> bukan berarti &ldquo;lebih aman&rdquo; &mdash; artinya aset bergerak <em>berlawanan</em> arah pasar (langka; mis. beberapa instrumen <em>hedge</em>). Required return-nya bisa <em>di bawah</em> R_f! (2) <strong>Jangan tertukar sumbu:</strong> SML &rarr; sumbu-X = beta; CML &rarr; sumbu-X = &sigma; total. Soal yang menaruh &ldquo;saham individual&rdquo; pada grafik bersumbu-&sigma; sedang mengujimu: itu <strong>salah grafik</strong> (harusnya SML). (3) CAPM memberi <em>expected</em> return &mdash; bukan garansi. &ldquo;Beta 1,5 maka return pasti 15%&rdquo; = salah konsep.</p>
</div>


<h2 id="ips">IPS, Behavioral & ESG — Manusia di Balik Angka</h2>
<p><strong>Definisi.</strong> <strong>IPS</strong> (<em>Investment Policy Statement</em>): dokumen tujuan–kendala–kebijakan (return objective, risk tolerance, horizon, likuiditas, pajak, regulasi). <strong>Behavioral</strong>: <em>loss aversion</em> (rugi 2x lebih sakit dari untung), <em>overconfidence</em>, <em>herding</em>, <em>anchoring</em>. <strong>ESG integration</strong>: memasukkan faktor E/S/G ke analisis (bukan sekadar eksklusi).</p>
<p>Pratinjau Bagian C: IPS penuh (PM-C1), behavioral mendalam (PM-C6), ESG (PM-C11).</p>
<p><strong>Kepribadian/intuisi:</strong> IPS seperti <strong>resep dokter sebelum operasi</strong>: tanpa itu, 'operasi' portofolio mengikuti mood pasar. Behavioral bias = <strong>virus di software otak</strong> — antivirusnya = proses &amp; IPS tertulis.</p>
<p><strong>Kapan dipakai:</strong> Awal setiap relasi klien: IPS dulu, produk kemudian.</p>
<p><strong>Pendalaman intuisi &mdash; kenapa dokumen 1 halaman mengalahkan IQ 150?</strong> Studi klasik Barber &amp; Odean (2000): investor individual yang <em>paling sering trading</em> (percaya diri tinggi, tanpa proses tertulis) underperform pasar ~6&ndash;7% per tahun &mdash; mayoritas karena biaya transaksi dan <em>timing</em> yang buruk. IPS 1 halaman memaksa tiga hal yang otak enggan lakukan: (1) <strong>menetapkan target angka</strong> (bukan &ldquo;untung besar&rdquo;), (2) <strong>mendefinisikan batas nyeri</strong> (<em>drawdown</em> maksimal) <em>sebelum</em> nyeri datang, (3) <strong>aturan main saat panik</strong> (rebalancing mekanis). Kecerdasan tanpa proses = mobil balap tanpa rem.</p>

<details className="worked">
<summary>📐 Contoh: IPS 1 paragraf (klik untuk buka)</summary>
<p><em>'Ibu Lina, 45 thn, horizon 15 thn, toleransi moderat, butuh Rp50jt/thn mulai thn ke-10 (pendidikan anak), pajak progresif, tidak boleh derivatif spekulatif. Target: 9% p.a. dengan volatilitas &lt; 12%.'</em></p>
<p><strong>Semua keputusan</strong> (alokasi, produk, rebalancing) merujuk ke sini. Tanpa IPS = nasihat tanpa diagnosis.</p>
</details>
<p><strong>Intuisi lanjutan &mdash; IPS adalah &ldquo;pakta Ulysses&rdquo;.</strong> Dalam mitologi, Ulysses menyuruh awak kapal mengikatnya ke tiang agar tidak melompat ke laut saat mendengar nyanyian Siren &mdash; ia tahu dirinya di masa depan tidak bisa dipercaya. IPS bekerja persis begitu: <strong>keputusan dibuat saat pikiran tenang, untuk mengikat tanganmu saat pasar panik</strong>. Tanpa IPS tertulis, &ldquo;strategi&rdquo; hanyalah suasana hati yang berganti tiap kali IHSG merah. Manajer profesional yang mengelola triliunan rupiah pun memakai IPS &mdash; bukan karena mereka bodoh, tapi karena mereka tahu <em>otak manusia</em> (termasuk otak mereka) punya bug.</p>
<details className="worked">
<summary>📐 Vignette (gaya CFA): Kenali biasnya &mdash; 4 ucapan klien, 4 jebakan otak</summary>
<p>Soal vignette: identifikasi <em>behavioral bias</em> dominan dari tiap ucapan klien berikut.</p>
<p><strong>(a)</strong> &ldquo;Pokoknya saya <em>tidak akan jual</em> saham ini sebelum balik modal. Rugi 20% belum rugi kalau belum dijual.&rdquo;<br/><strong>Jawaban: <em>loss aversion</em> + <em>disposition effect</em>.</strong> Rugi terasa ~2&times; lebih sakit daripada untung (prospect theory), sehingga investor menahan saham rugi terlalu lama dan menjual saham untung terlalu cepat &mdash; persis kebalikan dari &ldquo;potong kerugian, biarkan keuntungan berlari&rdquo;.</p>
<p><strong>(b)</strong> &ldquo;Saya yakin bisa <em>timing the market</em> &mdash; 8 dari 10 prediksi saya benar tahun lalu.&rdquo;<br/><strong>Jawaban: <em>overconfidence</em> (+ <em>hindsight bias</em>).</strong> Delapan prediksi &ldquo;benar&rdquo; diingat, dua yang salah dilupakan; sampel 10 terlalu kecil untuk klaim skill. Overconfidence &rarr; <em>overtrading</em> &rarr; return tergerus biaya transaksi (PM-C10).</p>
<p><strong>(c)</strong> &ldquo;Semua orang lagi borong saham AI &mdash; masa saya ketinggalan kereta?&rdquo;<br/><strong>Jawaban: <em>herding</em>.</strong> Mengikuti kerumunan terasa aman secara sosial, tapi membeli setelah harga terbang = membeli di puncak. Herding adalah bahan bakar <em>bubble</em>.</p>
<p><strong>(d)</strong> &ldquo;Saham ini pernah Rp10.000, sekarang Rp6.000 &mdash; jelas <em>murah</em>!&rdquo;<br/><strong>Jawaban: <em>anchoring</em>.</strong> Angka Rp10.000 (harga historis, mungkin saat fundamental berbeda) dijadikan jangkar &ldquo;nilai wajar&rdquo; tanpa analisis. Jangkar yang benar = valuasi DDM/FCF (PM-B4), bukan memori harga.</p>
<p><strong>Antidot umum:</strong> tulis aturan keputusan di IPS <em>sebelum</em> bias menyerang &mdash; mis. &ldquo;jual jika turun 15% dari harga beli (<em>stop-loss</em> mekanis)&rdquo;, &ldquo;rebalancing tiap kuartal tanpa pandang sentimen&rdquo;. <strong>Proses mengalahkan insting.</strong></p>
</details>
<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian CFA &mdash; IPS:</strong> (1) <em>Return objective</em> dan <em>risk tolerance</em> harus dinyatakan <strong>konsisten</strong> (nominal vs riil &mdash; campur aduk = salah). (2) <strong>Urutan pengerjaan:</strong> <em>objectives</em> dulu (return, risk), baru <em>constraints</em> (horizon, likuiditas, pajak, regulasi, keunikan). Soal vignette yang meminta &ldquo;komponen IPS&rdquo; mengharapkan urutan ini. (3) <em>Behavioral bias</em>: hafalkan pasangan &ldquo;ucapan &rarr; bias&rdquo; &mdash; penolakan merealisasi rugi = <strong>loss aversion/disposition</strong>; &ldquo;semua orang beli&rdquo; = <strong>herding</strong>; &ldquo;saya pasti bisa prediksi&rdquo; = <strong>overconfidence</strong>; &ldquo;dulu harganya X&rdquo; = <strong>anchoring</strong>.</p>
</div>



      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Konsep, Satu Alur Kerja Manajer</h2>
      <p>Diversifikasi, CAPM, dan IPS bukan tiga topik lepas &mdash; mereka adalah <strong>tiga tahap satu alur kerja</strong> yang dipakai manajer portofolio profesional setiap hari:</p>
      <ol>
        <li><strong>KONSTRUKSI (diversifikasi):</strong> susun portofolio dari aset-aset berkorelasi rendah &rarr; dapatkan return target dengan risiko minimum (contoh Sinta: 15% return, risiko 23,2% bukan 30%).</li>
        <li><strong>PENILAIAN (CAPM/SML):</strong> tiap calon aset diuji &mdash; apakah return ekspektasinya <em>di atas</em> SML (alpha positif)? Hanya yang lolos yang masuk portofolio. CAPM juga memberi <em>required return</em> untuk valuasi (PM-B4) dan biaya modal (PM-A5).</li>
        <li><strong>PENGAWALAN (IPS + behavioral):</strong> tulis tujuan, batasan, dan aturan main <em>sebelum</em> pasar bergejolak; saat gejolak tiba, eksekusi mekanis &mdash; bukan emosi.</li>
      </ol>
      <details className="worked">
      <summary>📐 Contoh sintesis (gaya CFA): dari konstruksi sampai keputusan</summary>
      <p>Manajer dana mempertimbangkan menambah Saham X (&beta; = 1,2, ekspektasi 16%, &sigma; = 32%) ke portofolio yang kini berisi saham defensif (&beta;_p = 0,7). Data: R_f = 6%, premi pasar 6%, korelasi X dengan portofolio existing = 0,25.</p>
      <p><strong>Tahap 1 &mdash; diversifikasi:</strong> &rho; = 0,25 rendah &rarr; penambahan X <em>menurunkan</em> risiko relatif terhadap return yang dibawa (cek suku korelasi!). Lolos tahap konstruksi.</p>
      <p><strong>Tahap 2 &mdash; CAPM:</strong> required = 6% + 1,2&times;6% = 13,2%; ekspektasi 16% &rarr; alpha +2,8%, di atas SML &rarr; <strong>undervalued, layak masuk</strong>.</p>
      <p><strong>Tahap 3 &mdash; IPS:</strong> cek batasan &mdash; apakah beta portofolio gabungan tetap dalam toleransi risiko klien? Beta baru = rata-rata tertimbang (linear!) &rarr; mudah dihitung dan dikontrol. Jika masih dalam batas IPS &rarr; <strong>eksekusi</strong>. Jika tidak &rarr; tolak, <em>sebagus apa pun alpha-nya</em>. <strong>IPS adalah <em>veto</em> terakhir.</strong></p>
      <p>Inilah cara berpikir manajer profesional: <strong>angka (CAPM) mengusulkan, diversifikasi mengoptimalkan, IPS memutuskan</strong>.</p>
      </details>
      <div className="tip">
      <p><strong>💡 Cara mengingat urutan ini:</strong> <strong>D&ndash;C&ndash;I</strong> = &ldquo;<em>Diversifikasi</em> dulu, <em>CAPM</em> menilai, <em>IPS</em> mengawal&rdquo;. Setiap kali membaca soal vignette CFA tentang manajer portofolio, petakan dulu: soal ini menguji tahap yang mana?</p>
      </div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Diversifikasi = punya banyak saham. 50 saham pasti aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 50 saham <strong>bank semua</strong> (ρ ≈ 0,9) = 1 saham raksasa — diversifikasi <strong>semu</strong>. Yang penting <strong>korelasi rendah antar-kepemilikan</strong>, bukan jumlah. 10 saham tak berkorelasi mengalahkan 50 saham sekeranjang.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Beta tinggi = return pasti tinggi (CAPM kan bilang begitu).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> CAPM = <strong>expected</strong> return, bukan janji. Beta 1,5 bisa −30% setahun (risiko = varians!). Plus <strong>low-beta anomaly</strong> empiris: saham beta rendah sering outperform risk-adjusted. CAPM = benchmark, bukan ramalan.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;SML dan CML itu sama &mdash; dua-duanya garis risk-return.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>CML</strong> (<em>capital market line</em>) hanya untuk <strong>portofolio efisien</strong> &mdash; sumbu-X-nya risiko <strong>total</strong> (&sigma;_p). <strong>SML</strong> untuk <strong>semua aset/sekuritas individual</strong> &mdash; sumbu-X-nya risiko <strong>sistematis</strong> (&beta;). Menaruh <em>saham tunggal</em> di CML adalah kesalahan kategori: saham tunggal tidak efisien (masih punya risiko idiosinkratis), jadi ia hanya valid di SML. Ingat: <strong>CML = portofolio, SML = sekuritas</strong>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Korelasi dihitung, bukan diasumsikan.</strong> 'Saham beda' belum tentu tak berkorelasi (krisis 2008: semua ρ → 1). Hitung matriks korelasi portofoliomu tiap kuartal — kejutan korelasi = kejutan risiko.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Tulis IPS-mu sendiri.</strong> Bahkan untuk portofolio pribadi: 1 halaman tujuan, horizon, batas rugi. Ini 'vaksin' terhadap panic selling — keputusan dibuat saat tenang, dieksekusi saat panik.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Beta portofolio itu LINEAR, risiko tidak.</strong> Beta portofolio = rata-rata tertimbang beta komponen &mdash; gampang dihitung dan di-target (mis. &ldquo;saya mau beta portofolio 1,1&rdquo;). Tapi &sigma;_p <strong>tidak</strong> linear karena ada suku korelasi. Akibatnya: mengganti satu saham mengubah beta secara proporsional, tapi mengubah risiko secara <em>tak terduga</em> (tergantung korelasinya dengan sisa portofolio). <strong>Selalu hitung ulang matriks korelasi tiap kali komposisi berubah.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Simulator Diversifikasi</h2>
<p>Ubah korelasi & bobot dua aset — lihat risiko portofolio berubah.</p>
<PyodideLab
  title={"Lab 1 — Simulator Diversifikasi"}
  hint={"Ubah RHO 0.2 -> 0.9. Manfaat diversifikasi lenyap — dua saham 'kembar'!"}
  defaultCode={"import math\n# Simulator diversifikasi 2 aset\nS1, S2, RHO = 0.30, 0.30, 0.2  # vol aset 1, 2, korelasi (ubah RHO!)\nR1, R2 = 0.15, 0.15\n\nprint(f\"{'w1':>5} {'return':>8} {'risiko':>8}\")\nterbaik = (1, 1)\nfor i in range(11):\n    w1 = i/10; w2 = 1 - w1\n    ret = w1*R1 + w2*R2\n    var = w1**2*S1**2 + w2**2*S2**2 + 2*w1*w2*RHO*S1*S2\n    sig = math.sqrt(var)\n    print(f\"{w1:>5.1f} {ret:>7.1%} {sig:>7.1%}\")\n    if sig < terbaik[1]: terbaik = (w1, sig)\nprint(f\"\\nRisiko minimum di w1={terbaik[0]:.1f}: {terbaik[1]:.1%} (vs 30% single)\")\nprint(\"Makan siang gratis = risiko turun, return tetap!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator CAPM & SML</h2>
<p>Hitung expected return CAPM dan nilai alpha (di atas/di bawah SML).</p>
<PyodideLab
  title={"Lab 2 — Kalkulator CAPM"}
  hint={"Ubah BETA 1.5 -> 0.7 (defensif). Expected turun — risiko lebih kecil, 'upah' lebih kecil."}
  defaultCode={"# Kalkulator CAPM: E(R) = Rf + beta*(Rm - Rf)\nRF, RM = 0.06, 0.12\nBETA = 1.5          # ubah sesukamu\nFORECAST = 0.18     # return ekspektasi analis\n\ner = RF + BETA*(RM - RF)\nalpha = FORECAST - er\nprint(f\"CAPM expected : {er:.1%}\")\nprint(f\"Forecast analis: {FORECAST:.1%}\")\nprint(f\"Alpha          : {alpha:+.1%}\")\nprint(f\"Status: {'UNDERVALUED (di atas SML) - beli' if alpha > 0 else 'OVERVALUED (di bawah SML) - jual/hindari'}\")\nprint(\"\\nBeta dari regresi return saham vs pasar (PM-A2).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Menambah saham ke portofolio → <strong>Cek korelasi, bukan cuma return</strong></h3>
<p><strong>Kenapa:</strong> Manfaat diversifikasi = f(korelasi).</p>
<p><strong>Contoh nyata:</strong> Tolak saham ke-31 yang ρ=0,9 dengan existing.</p>
</div>
<div className="decision-card">
<h3>2. Menentukan required return → <strong>CAPM (Rf + β × MRP)</strong></h3>
<p><strong>Kenapa:</strong> Konsisten untuk DDM, WACC, evaluasi.</p>
<p><strong>Contoh nyata:</strong> r untuk valuasi PM-B4.</p>
</div>
<div className="decision-card">
<h3>3. Klien baru → <strong>IPS tertulis dulu</strong></h3>
<p><strong>Kenapa:</strong> Diagnosis sebelum resep.</p>
<p><strong>Contoh nyata:</strong> 1 halaman: tujuan, horizon, batasan.</p>
</div>
<div className="decision-card">
<h3>4. Pasar panik → <strong>Kembali ke IPS; waspadai loss aversion</strong></h3>
<p><strong>Kenapa:</strong> Bias behavioral merusak return.</p>
<p><strong>Contoh nyata:</strong> Rebalancing mekanis (PM-C4).</p>
</div>
<div className="decision-card">
<h3>5. Menilai manajer aktif / reksadana → <strong>Hitung alpha, bukan return mentah</strong></h3>
<p><strong>Kenapa:</strong> Return 20% dengan beta 2 saat pasar naik 15% = alpha negatif (seharusnya 24%!).</p>
<p><strong>Contoh nyata:</strong> Manajer return 18%, beta 1,3, Rf 6%, pasar 12% &rarr; required 13,8%, alpha +4,2% &rarr; ada skill (uji signifikansinya di PM-C5).</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>ρ &lt; 1</strong> = diversifikasi bekerja.</li><li><strong>Bayar hanya risiko sistematis</strong> (beta).</li><li><strong>Alpha</strong> = aktual − CAPM.</li><li><strong>IPS dulu</strong>, produk kemudian.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Dua Saham yang 'Sama'</h2>
<div className="callout">
<p>Rudi: 100% saham tambang (E(R) 15%, σ 30%). Sinta: 50/50 tambang + consumer (masing-masing 15%, σ 30%, ρ = 0,2). Setahun gejolak: Rudi −25%, Sinta −8%.</p>
<p><strong>Vignette.</strong> Rudi (35 thn) menaruh 100% dananya Rp100 juta di satu saham tambang: E(R) 15%, σ 30%. Sinta (35 thn) membagi Rp100 juta ke dua saham &mdash; tambang + consumer goods &mdash; masing-masing E(R) 15%, σ 30%, korelasi 0,2. Setahun gejolak: Rudi &minus;25%, Sinta &minus;8%. IPS Sinta: target 12% p.a., toleransi σ &lt; 25%, horizon 10 tahun, <em>stop-loss</em> mekanis &minus;15%. Rudi berkata: &ldquo;Pokoknya gue nggak jual sebelum balik modal.&rdquo;</p>
<p><strong>Pertanyaan:</strong> (a) Hitung σ portofolio Sinta. (b) Kenapa return harapan sama tapi risiko beda jauh? (c) Rudi kapok lalu membeli <em>tiga</em> saham tambang berbeda (&rho; antar-saham &asymp; 0,85). Apakah ini diversifikasi yang benar? (d) Apakah portofolio Sinta memenuhi IPS-nya sendiri? (e) Bias behavioral apa yang ditunjukkan ucapan Rudi, dan apa respons yang sesuai IPS?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>σ_p = 23,2%</strong> (vs 30%): σ_p² = 0,25&times;0,09 + 0,25&times;0,09 + 2&times;0,25&times;0,2&times;0,09 = 0,054 &rarr; &radic; = 23,2%.</p>
<p>(b) <strong>Return = rata-rata tertimbang</strong> (linear, tetap 15%); <strong>risiko punya suku korelasi</strong> (nonlinear) yang mengecilkan total saat &rho; &lt; 1. Beda rumus, beda hasil &mdash; inilah inti &ldquo;makan siang gratis&rdquo;.</p>
<p>(c) <strong>Bukan diversifikasi yang benar</strong> &mdash; ini <em>diversifikasi semu</em>. Tiga saham tambang dengan &rho; &asymp; 0,85 ≈ satu saham tambang raksasa: σ_p &asymp; 29%+ (hitung: mendekati 30%). Rudi menambah <em>jumlah</em> tanpa menambah <em>ketakberkorelasian</em>. Pelajaran: diversifikasi diukur dari matriks korelasi, bukan jumlah ticker.</p>
<p>(d) <strong>Ya, memenuhi.</strong> E(R) portofolio = 15% &ge; target 12% &check;; σ_p = 23,2% &lt; batas 25% &check;. Portofolio Sinta konsisten dengan IPS-nya &mdash; keputusan (alokasi 50/50) bisa dipertahankan secara tertulis, bukan sekadar &ldquo;feeling&rdquo;.</p>
<p>(e) <strong><em>Loss aversion</em> + <em>disposition effect</em>:</strong> menolak merealisasi rugi (&ldquo;belum rugi kalau belum dijual&rdquo;). Respons sesuai IPS: jika IPS-nya punya <em>stop-loss</em> &minus;15%, posisi <strong>wajib dipotong mekanis</strong> &mdash; tanpa negosiasi dengan emosi. Inilah gunanya IPS sebagai &ldquo;pakta Ulysses&rdquo;.</p>
</details>
</div>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Tiga soal drill. Kerjakan dulu di kertas/kalkulator, <em>lalu</em> buka pembahasan. Target: benar 3/3 tanpa mengintip.</p></div>
      <h3>Drill 1 &mdash; Risiko portofolio dua aset</h3>
      <p>Dua aset: w₁ = 60%, w₂ = 40%; σ₁ = 25%, σ₂ = 35%; &rho; = 0,1. Hitung σ_p. Apakah diversifikasi &ldquo;bekerja&rdquo; di sini?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>σ_p² = 0,6²&times;0,25² + 0,4²&times;0,35² + 2&times;0,6&times;0,4&times;0,1&times;0,25&times;0,35 = 0,0225 + 0,0196 + 0,0042 = 0,0463 &rarr; <strong>σ_p = 21,5%</strong>.</p>
      <p>Rata-rata tertimbang volatilitas = 0,6&times;25% + 0,4&times;35% = 29%. Portofolio 21,5% &lt; 29% &mdash; <strong>ya, diversifikasi bekerja</strong> (&rho; = 0,1 rendah). Bahkan di bawah σ₁ = 25%!</p>
      </details>
      <h3>Drill 2 &mdash; CAPM &amp; keputusan SML</h3>
      <p>R_f = 4%, market risk premium = 5%. Saham Q: &beta; = 1,4, return ekspektasi analis 12%. Hitung required return, alpha, dan keputusan (beli/jual/tahan).</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Required = 4% + 1,4&times;5% = <strong>11%</strong>. Alpha = 12% &minus; 11% = <strong>+1%</strong> &rarr; di <em>atas</em> SML &rarr; <strong>undervalued &rarr; BELI</strong>.</p>
      <p>Catatan: alpha +1% itu tipis &mdash; dalam praktik, analis mempertimbangkan <em>margin of safety</em> dan signifikansi statistik alpha sebelum bertindak (dibahas di PM-C5).</p>
      </details>
      <h3>Drill 3 &mdash; Vignette IPS &amp; behavioral</h3>
      <p>Klien, 50 tahun, berkata: (i) &ldquo;Saya butuh Rp80 juta/tahun mulai 5 tahun lagi untuk biaya kuliah anak&rdquo;; (ii) &ldquo;Saya tidak mau lihat portofolio turun lebih dari 10% dalam setahun&rdquo;; (iii) &ldquo;Tahun lalu saya untung 30% dari saham gorengan &mdash; tahun ini saya mau all-in lagi.&rdquo; Identifikasi: (a) komponen IPS dari (i) dan (ii); (b) bias pada (iii); (c) respons manajer yang tepat.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>(a) (i) = <strong>constraint likuiditas</strong> + <em>time horizon</em> (5 tahun); (ii) = <strong>risk tolerance</strong> (batas volatilitas/penurunan).</p>
      <p>(b) (iii) = <strong>overconfidence</strong> (kinerja 1 tahun dianggap skill) + <em>self-attribution</em>; &ldquo;all-in saham gorengan&rdquo; juga melanggar prinsip diversifikasi.</p>
      <p>(c) Manajer: <strong>tulis IPS dulu</strong> &mdash; tuangkan (i) dan (ii) sebagai jangkar tertulis, lalu tunjukkan bahwa (iii) <em>inkonsisten</em> dengan toleransi risikonya sendiri (&ldquo;all-in&rdquo; vs &ldquo;tidak mau turun &gt;10%&rdquo;). Edukasi, bukan konfrontasi &mdash; dan semua dalam dokumen, bukan lisan.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Dua aset σ=30%, w=50/50, ρ=0,2. σ portofolio?"}
  options={
    ["30%",
    "23,2%",
    "15%",
    "42,4%"]
  }
  correct={1}
  explanation={"Benar: √0,054 = 23,2%. Risiko turun 23% dengan return sama — makan siang gratis diversifikasi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Rf 6%, Rm 12%, β=1,5. E(R) CAPM?"}
  options={
    ["12%",
    "15%",
    "18%",
    "9%"]
  }
  correct={1}
  explanation={"Benar: 6% + 1,5×6% = 15%. Forecast 18% → alpha +3% (undervalued, di atas SML)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Risiko mana yang 'dibayar' pasar menurut CAPM?"}
  options={
    ["Risiko total",
    "Risiko sistematis (beta) saja",
    "Risiko idiosinkratis",
    "Semua risiko"]
  }
  correct={1}
  explanation={"Benar: idiosinkratis bisa didiversifikasi gratis → tidak dikompensasi. Hanya beta yang punya 'upah'."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. 50 saham semuanya bank (ρ≈0,9). Diversifikasi?"}
  options={
    ["Sempurna — 50 saham",
    "Semu — korelasi tinggi = 1 saham raksasa",
    "Cukup",
    "Tidak bisa dinilai"]
  }
  correct={1}
  explanation={"Benar: jumlah tidak penting; korelasi yang penting. 50 saham sekeranjang = konsentrasi terselubung."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Fungsi utama IPS?"}
  options={
    ["Memilih saham terbaik",
    "Dokumen tujuan–kendala–kebijakan sebagai jangkar keputusan",
    "Menjamin return",
    "Syarat legal semata"]
  }
  correct={1}
  explanation={"Benar: IPS = diagnosis sebelum resep; jangkar saat pasar panik (anti loss-aversion). Tanpa IPS = nasihat tanpa arah."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Vignette: Saham PT Maju berkorelasi 0,86 dengan pasar (σ_saham=28%, σ_pasar=20%). Rf=6%, E(Rm)=12%. Analis mem-forecast return 16%. Keputusan?"}
  options={
    ["Beli — β=1,2, required 13,2%, alpha +2,8% (di atas SML)",
    "Jual — overvalued, return di bawah SML",
    "Tahan — fairly valued, alpha nol",
    "Beta tidak bisa dihitung dari data korelasi"]}
  correct={0}
  explanation={"Benar: β = ρ·σi/σm = 0,86 × (28/20) = 1,2. CAPM required = 6% + 1,2×6% = 13,2%. Forecast 16% → alpha +2,8% → di atas SML → undervalued → BELI. Inilah alur analis: beta → required → alpha → keputusan."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Diversifikasi</strong>: σ_p² punya suku korelasi; ρ &lt; 1 → risiko turun tanpa korban return.</li>
<li><strong>Risiko sistematis</strong> (tidak bisa dihindari) vs <strong>idiosinkratis</strong> (bisa).</li>
<li><strong>CAPM</strong>: E(R) = R_f + β(E(R_m) − R_f); alpha = aktual − CAPM.</li>
<li><strong>SML</strong>: di atas = undervalued; CML untuk portofolio efisien.</li>
<li><strong>IPS</strong>: tujuan, toleransi, horizon, likuiditas, pajak, regulasi.</li>
<li><strong>Behavioral</strong>: loss aversion, overconfidence, herding — lawannya proses tertulis.</li>
<li><strong>Beta portofolio linear</strong> (rata-rata tertimbang); <strong>risiko tidak</strong> (ada suku korelasi) — hitung ulang tiap komposisi berubah.</li>
<li><strong>CML</strong> untuk portofolio efisien (risiko total); <strong>SML</strong> untuk semua sekuritas (beta).</li>
<li><strong>Kapan TIDAK pakai:</strong> diversifikasi tidak menghapus risiko sistematis (jangan &ldquo;diversifikasi&rdquo; untuk lindung dari resesi &mdash; pakai <em>hedging</em>/kas); CAPM tidak valid saat input (&beta;, premi pasar) tidak stabil &mdash; perlakukan sebagai <em>benchmark</em>, bukan ramalan; IPS yang tidak pernah direview = dokumen mati &mdash; review tiap ada perubahan hidup klien.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a9-alternatives" className="btn btn-secondary btn-sm">← PM-A9</Link>
        <Link href="/learn/pm-b1-regresi" className="btn btn-primary btn-sm">PM-B1 →</Link>
      </div>
    </div>
  );
}

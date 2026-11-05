"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC2CapitalMarketExpectationsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C2 — Portfolio Management</span>
        <h1 className="display-title">Capital Market Expectations:<br/>Membaca Masa Depan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Ramalan 'Pasti' 2020</a></li>
<li><a href="#framework">Framework CME</a></li>
<li><a href="#taylor">Taylor Rule & Sinyal</a></li>
<li><a href="#bias">Jebakan Forecasting</a></li>
<li><a href="#sintesis">Sintesis: Peta</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Ramalan 2020</a></li>
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
<li>Menjelaskan rantai GDP → earnings → return saham.</li>
<li>Menghitung expected return via dekomposisi Grinold-Kroner.</li>
<li>Menjelaskan Taylor rule dan sinyalnya.</li>
<li>Mengidentifikasi bias dalam forecasting.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Ramalan 'Pasti' 2020</h2>
      <div className="story">
        <p><strong>Desember 2019</strong>: konsensus analis — <em>&ldquo;2020: growth stabil, saham +8%.&rdquo;</em> <strong>Maret 2020</strong>: COVID — pasar <strong>−35%</strong> dalam sebulan. <strong>Desember 2020</strong>: pasar <strong>+16%</strong> setahun. <em>Semua</em> ramalan salah — dua kali.</p>
<p>Twist-nya: yang salah bukan <em>framework</em>-nya, melainkan <strong>ekspektasi presisi</strong>. CME yang benar = <strong>rentang skenario + probabilitas</strong>, bukan angka tunggal. Peramal 2019 yang berkata '+8% ± 25%' = <strong>jujur</strong>; yang berkata '+8%' = <strong>bohong presisi</strong>. Lesson ini: ekspektasi yang rendah hati.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="framework">Framework — Dari Ekonomi ke Return</h2>
<p><strong>Definisi.</strong> <strong>CME</strong> = ekspektasi return/risiko/korelasi <em>jangka panjang</em> (10+ tahun) per kelas aset. <strong>Rantai</strong>: GDP riil → <strong>earnings growth</strong> (≈ GDP + inflasi, jangka panjang) → <strong>return saham</strong> = yield dividen + growth + Δvaluasi. <strong>Obligasi</strong>: yield awal ≈ return ekspektasi (prediktor terbaik!).</p>
<p><strong>Aturan praktis</strong>: expected return obligasi ≈ <strong>YTM kini</strong>; saham via <strong>Grinold-Kroner</strong>.</p>
<Tex math={String.raw`E(R) \approx DY + g + \Delta PE`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`DY`} />: dividend yield kini</li>
<li><Tex math={String.raw`g`} />: growth earnings/dividen riil (≈ GDP riil jangka panjang)</li>
<li><Tex math={String.raw`\Delta PE`} />: perubahan valuasi (→ 0 jangka panjang; jangan andalkan!)</li>
<li>Grinold-Kroner: + inflasi &amp; −/+ repurchase yield untuk total</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> CME seperti <strong>prakiraan iklim, bukan cuaca</strong>: tidak menebak hujan besok (2020!), tapi tahu musim kemarau datang tiap tahun (siklus) &amp; suhu rata-rata naik (trend). Alokasi butuh <em>iklim</em>, bukan <em>cuaca</em>.</p>
<p><strong>Kapan dipakai:</strong> SAA (PM-C3): input expected return tiap kelas aset.</p>
<p><strong>Pendalaman intuisi &mdash; CME = &ldquo;ramalan yang jujur tentang ketidakpastian&rdquo;.</strong> <strong>Bukan</strong> &ldquo;saham akan +8%&rdquo; (bohong presisi!), melainkan <strong>&ldquo;ekspektasi +8%, &plusmn;25%, skenario bull/bear&rdquo;</strong>. <strong>Kegunaan CME:</strong> bukan untuk <em>tepat</em> (tidak ada yang tepat!), melainkan untuk <strong><em>sizing</em> &amp; <em>alokasi</em></strong> yang <em>robust</em>. CME yang baik = <em>rentang</em> + <em>probabilitas</em> + <em>asumsi eksplisit</em>. <strong>CME titik-tunggal = <em>ramalan cuaca</em> tanpa probabilitas hujan.</strong></p><p><strong>Pendalaman intuisi &mdash; CME = &ldquo;ramalan yang jujur tentang ketidakpastian&rdquo;.</strong> <strong>Bukan</strong> &ldquo;saham akan +8%&rdquo; (bohong presisi!), melainkan <strong>&ldquo;ekspektasi +8%, &plusmn;25%, skenario bull/bear&rdquo;</strong>. <strong>Kegunaan CME:</strong> bukan untuk <em>tepat</em> (tidak ada yang tepat!), melainkan untuk <strong><em>sizing</em> &amp; <em>alokasi</em></strong> yang <em>robust</em>. CME yang baik = <em>rentang</em> + <em>probabilitas</em> + <em>asumsi eksplisit</em>. <strong>CME titik-tunggal = <em>ramalan cuaca</em> tanpa probabilitas hujan.</strong></p><details className="worked">
<summary>📐 Contoh: Ekspektasi IHSG (klik untuk buka)</summary>
<p>DY = 2,5%, g riil = 5% (GDP), inflasi 3%, ΔPE = 0 (asumsi netral).</p>
<p><strong>E(R) nominal</strong> ≈ 2,5% + 5% + 3% = <strong>10,5%</strong>.</p>
<p>Jika pasar kini P/E 20 (mahal, mean-revert ke 15 dalam 10 thn): ΔPE ≈ −2,8%/thn → E(R) ≈ <strong>7,7%</strong>. <strong>Valuasi awal menentukan separuh ekspektasi!</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Grinold-Kroner &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> div yield 2%, pertumbuhan laba riil 2%, inflasi 3%, P/E kini 20, P/E wajar jangka panjang 18 (10 tahun). Ekspektasi return?</p>
<p><strong>Langkah 1 &mdash; income:</strong> 2% (dividen).</p>
<p><strong>Langkah 2 &mdash; growth nominal:</strong> 2% + 3% = 5%.</p>
<p><strong>Langkah 3 &mdash; repricing:</strong> (18/20)^(1/10) &minus; 1 &asymp; <strong>&minus;1,05%/tahun</strong> (P/E turun!).</p>
<p><strong>Total: 2% + 5% &minus; 1,05% = 5,95% &asymp; 6%.</strong></p>
<p><strong>Pelajaran:</strong> <strong>valuasi mahal kini = <em>pajak</em> atas return masa depan!</strong> P/E 20 &rarr; 18 = &minus;1%/tahun selama dekade. <strong>Inilah kenapa <em>titik masuk</em> penting untuk return jangka panjang.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Obligasi &mdash; CME sederhana</summary>
<p><strong>Soal:</strong> obligasi 10 tahun yield 5%, durasi 8. Ekspektasi return 1 tahun jika yield naik ke 6%?</p>
<p><strong>Langkah 1 &mdash; income:</strong> +5% (kupon).</p>
<p><strong>Langkah 2 &mdash; harga:</strong> &minus;8 &times; 1% = <strong>&minus;8%</strong>.</p>
<p><strong>Total: 5% &minus; 8% = &minus;3%.</strong></p>
<p><strong>Pelajaran:</strong> <strong>yield &ne; return!</strong> (jika suku bunga berubah). <strong>Yield = return <em>jika</em> ditahan hingga jatuh tempo &amp; kupon diinvestasikan pada yield sama.</strong> Untuk horizon &lt; durasi, <em>risiko suku bunga</em> mendominasi. <strong>CME obligasi = yield &plusmn; perubahan harga.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Konsensus = benar&rdquo;.</strong> Konsensus Des 2019: +8%. Realisasi Mar 2020: &minus;35%. <strong>Konsensus = <em>herding</em></strong> (semua baca data sama!). <strong>Aturan:</strong> konsensus = <em>titik awal</em>, bukan <em>kebenaran</em>. Selalu tanya: <em>apa yang tidak dilihat konsensus?</em> (pre-mortem!).</p>
</div>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Grinold-Kroner &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> div yield 2%, pertumbuhan laba riil 2%, inflasi 3%, P/E kini 20, P/E wajar jangka panjang 18 (10 tahun). Ekspektasi return?</p>
<p><strong>Langkah 1 &mdash; income:</strong> 2% (dividen).</p>
<p><strong>Langkah 2 &mdash; growth nominal:</strong> 2% + 3% = 5%.</p>
<p><strong>Langkah 3 &mdash; repricing:</strong> (18/20)^(1/10) &minus; 1 &asymp; <strong>&minus;1,05%/tahun</strong> (P/E turun!).</p>
<p><strong>Total: 2% + 5% &minus; 1,05% = 5,95% &asymp; 6%.</strong></p>
<p><strong>Pelajaran:</strong> <strong>valuasi mahal kini = <em>pajak</em> atas return masa depan!</strong> P/E 20 &rarr; 18 = &minus;1%/tahun selama dekade. <strong>Inilah kenapa <em>titik masuk</em> penting untuk return jangka panjang.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Volatilitas &amp; korelasi &mdash; dari data ke CME</summary>
<p><strong>Soal:</strong> saham vol 18%, obligasi 6%, korelasi 0,2. Portofolio 60/40: vol?</p>
<p><strong>Langkah 1:</strong> &sigma;&sup2; = 0,6&sup2;&times;0,18&sup2; + 0,4&sup2;&times;0,06&sup2; + 2&times;0,6&times;0,4&times;0,2&times;0,18&times;0,06.</p>
<p><strong>Langkah 2:</strong> = 0,0117 + 0,0006 + 0,0010 = 0,0133 &rarr; &sigma; = <strong>11,5%</strong>.</p>
<p><strong>Catatan CME:</strong> gunakan <strong>vol <em>forward-looking</em></strong> (tersirat? GARCH?) &mdash; bukan cuma historis! Dan <strong>korelasi krisis &gt; korelasi normal</strong> &rarr; stres dengan korelasi 0,6+ untuk skenario buruk.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Rentang, bukan titik</summary>
<p><strong>Soal:</strong> ekspektasi return 7%, vol 15%. Berapa rentang 68% &amp; 95% untuk 1 tahun?</p>
<p><strong>68%:</strong> 7% &plusmn; 15% = <strong>&minus;8% hingga +22%</strong>.</p>
<p><strong>95%:</strong> 7% &plusmn; 30% = <strong>&minus;23% hingga +37%</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>&ldquo;+7%&rdquo; tanpa rentang = menipu!</strong> Realisasi &minus;20% = <em>normal</em> (dalam 95%!), bukan &ldquo;gagal&rdquo;. <strong>CME yang jujur = titik + rentang.</strong> Klien yang paham rentang = tidak panik saat &minus;15%.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; CME historis tanpa penyesuaian.</strong> &ldquo;Return historis 10% &rarr; ekspektasi 10%&rdquo; = <strong>salah</strong> jika: valuasi kini <em>mahal</em> (P/E 25 vs 15 historis!), suku bunga <em>beda rezim</em>, atau ada <em>survivorship bias</em>! <strong>Penyesuaian wajib:</strong> repricing valuasi + rezim + bias. <strong>Historis = <em>bahan baku</em>, bukan <em>jawaban</em>.</strong></p>
</div>
<details className="worked">
<summary>📐 Contoh 3: Obligasi &mdash; CME sederhana</summary>
<p><strong>Soal:</strong> obligasi 10 tahun yield 5%, durasi 8. Ekspektasi return 1 tahun jika yield naik ke 6%?</p>
<p><strong>Langkah 1 &mdash; income:</strong> +5% (kupon).</p>
<p><strong>Langkah 2 &mdash; harga:</strong> &minus;8 &times; 1% = <strong>&minus;8%</strong>.</p>
<p><strong>Total: 5% &minus; 8% = &minus;3%.</strong></p>
<p><strong>Pelajaran:</strong> <strong>yield &ne; return!</strong> (jika suku bunga berubah). <strong>Yield = return <em>jika</em> ditahan hingga jatuh tempo &amp; kupon diinvestasikan pada yield sama.</strong> Untuk horizon &lt; durasi, <em>risiko suku bunga</em> mendominasi. <strong>CME obligasi = yield &plusmn; perubahan harga.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Skenario &mdash; probabilitas tertimbang</summary>
<p><strong>Soal:</strong> bull (+20%, prob 25%), base (+7%, 50%), bear (&minus;15%, 25%). Ekspektasi &amp; interpretasi?</p>
<p><strong>Ekspektasi:</strong> 0,25&times;20 + 0,5&times;7 + 0,25&times;(&minus;15) = 5 + 3,5 &minus; 3,75 = <strong>4,75%</strong>.</p>
<p><strong>Interpretasi:</strong> <strong>lebih rendah</strong> dari base (7%!) karena <em>asimetri</em> (bear lebih dalam dari bull!). <strong>Pelajaran:</strong> ekspektasi &ne; skenario base &mdash; <strong>probabilitas &amp; asimetri penting</strong>. Dan: <strong>probabilitas = <em>penilaian</em>, bukan <em>fakta</em></strong> &mdash; dokumentasikan asumsinya!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Pre-mortem &mdash; &ldquo;bayangkan sudah gagal&rdquo;</summary>
<p><strong>Soal:</strong> CME bilang +8%. Lakukan <em>pre-mortem</em>: &ldquo;setahun lagi return &minus;20%. Apa yang terjadi?&rdquo;</p>
<p><strong>Hasil pre-mortem:</strong> (1) COVID-2.0? (2) perang dagang? (3) inflasi meledak? (4) <em>valuasi</em> memang ketinggian?</p>
<p><strong>Aksi:</strong> untuk tiap penyebab &rarr; <strong>proteksi murah kini</strong> (put 5%? kas 10%? <em>stop-loss</em>?). <strong>Pre-mortem = <em>vaksin</em> untuk <em>overconfidence</em>.</strong> Tim yang tidak pre-mortem = tim yang <em>jatuh cinta</em> pada forecastnya sendiri.</p>
</details>

<PlotlyChart
  data={[{x: ["Bear (−15%)", "Base (+7%)", "Bull (+20%)"], y: [25, 50, 25], type: "bar", marker: {color: ["#d62728", "#2a7de1", "#2ca02c"]}, name: "Probabilitas (%)"}]}
  title={"CME: skenario + probabilitas, bukan titik"}
  layout={{xaxis: {title: "Skenario"}, yaxis: {title: "Probabilitas (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga batang = tiga skenario dengan probabilitasnya.</p>
<p><strong>Interpretasi:</strong> ekspektasi = <strong>4,75%</strong> (tertimbang!) &mdash; <em>bukan</em> 7% (base!). <strong>Perhatikan asimetri:</strong> bear (&minus;15%) lebih dalam dari bull (+20%) relatif ke base &mdash; inilah yang menekan ekspektasi. <strong>CME profesional = <em>distribusi</em>, bukan <em>titik</em>.</strong></p>
</div>
<h2 id="taylor">Taylor Rule — Membaca Bank Sentral</h2>
<p><strong>Definisi.</strong> <strong>Taylor rule</strong>: i = r* + π + 0,5(π − π*) + 0,5(y − y*) — suku bunga 'wajar' dari inflasi &amp; output gap. <strong>Sinyal pasar</strong>: kurva yield (PM-B5), credit spread, VIX.</p>
<p>Jika BI rate <em>di bawah</em> Taylor → <strong>longgar</strong> (mendukung aset risiko, waspada inflasi); <em>di atas</em> → <strong>ketat</strong>.</p>
<Tex math={String.raw`i = r^* + \pi + 0{,}5(\pi - \pi^*) + 0{,}5(y - y^*)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`r^*`} />: real rate netral (≈ 1–2%)</li>
<li><Tex math={String.raw`\pi^*`} />: target inflasi</li>
<li><Tex math={String.raw`y-y^*`} />: output gap (ekonomi di atas/di bawah potensial)</li>
<li>Rule of thumb, bukan autopilot — bank sentral punya judgment</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Taylor rule seperti <strong>resep masakan bank sentral</strong>: inflasi di atas target → tambah 'garam' (rate); ekonomi lesu → kurangi. Pasar menebak <em>masakan berikutnya</em> dari resep ini — surprise = volatilitas.</p>
<p><strong>Kapan dipakai:</strong> Antisipasi kebijakan moneter; positioning durasi.</p>
<p><strong>Pendalaman intuisi &mdash; tiga pendekatan, tiga filsafat.</strong> <strong>Historis:</strong> &ldquo;masa depan &asymp; masa lalu&rdquo; (mudah, tapi <em>regime</em> berubah!). <strong>Forward-looking (DDM/Grinold-Kroner):</strong> &ldquo;bangun dari komponen&rdquo; (dividen + growth + repricing!) &mdash; <strong>standar CFA</strong>. <strong>Survei/konsensus:</strong> &ldquo;tanya orang pintar&rdquo; (<em>herding</em>! bias!). <strong>Praktik pro:</strong> <em>triangulasi</em> ketiganya &mdash; jika ketiganya sepakat &rarr; keyakinan tinggi; jika bertentangan &rarr; <strong>rendahkan keyakinan, lebarkan rentang</strong>.</p><p><strong>Pendalaman intuisi &mdash; tiga pendekatan, tiga filsafat.</strong> <strong>Historis:</strong> &ldquo;masa depan &asymp; masa lalu&rdquo; (mudah, tapi <em>regime</em> berubah!). <strong>Forward-looking (DDM/Grinold-Kroner):</strong> &ldquo;bangun dari komponen&rdquo; (dividen + growth + repricing!) &mdash; <strong>standar CFA</strong>. <strong>Survei/konsensus:</strong> &ldquo;tanya orang pintar&rdquo; (<em>herding</em>! bias!). <strong>Praktik pro:</strong> <em>triangulasi</em> ketiganya &mdash; jika ketiganya sepakat &rarr; keyakinan tinggi; jika bertentangan &rarr; <strong>rendahkan keyakinan, lebarkan rentang</strong>.</p><details className="worked">
<summary>📐 Contoh: BI rate wajar? (klik untuk buka)</summary>
<p>r* = 2%, π = 4%, π* = 3%, output gap +1%.</p>
<p><strong>i</strong> = 2 + 4 + 0,5(1) + 0,5(1) = <strong>7%</strong>.</p>
<p>BI rate aktual 6% → <strong>longgar</strong> (1% di bawah rule) → dukung saham/properti, waspada rupiah. Jika inflasi → 6%: rule = 9% → <strong>ekspektasi kenaikan agresif</strong> → kurangi durasi!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Volatilitas &amp; korelasi &mdash; dari data ke CME</summary>
<p><strong>Soal:</strong> saham vol 18%, obligasi 6%, korelasi 0,2. Portofolio 60/40: vol?</p>
<p><strong>Langkah 1:</strong> &sigma;&sup2; = 0,6&sup2;&times;0,18&sup2; + 0,4&sup2;&times;0,06&sup2; + 2&times;0,6&times;0,4&times;0,2&times;0,18&times;0,06.</p>
<p><strong>Langkah 2:</strong> = 0,0117 + 0,0006 + 0,0010 = 0,0133 &rarr; &sigma; = <strong>11,5%</strong>.</p>
<p><strong>Catatan CME:</strong> gunakan <strong>vol <em>forward-looking</em></strong> (tersirat? GARCH?) &mdash; bukan cuma historis! Dan <strong>korelasi krisis &gt; korelasi normal</strong> &rarr; stres dengan korelasi 0,6+ untuk skenario buruk.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Rentang, bukan titik</summary>
<p><strong>Soal:</strong> ekspektasi return 7%, vol 15%. Berapa rentang 68% &amp; 95% untuk 1 tahun?</p>
<p><strong>68%:</strong> 7% &plusmn; 15% = <strong>&minus;8% hingga +22%</strong>.</p>
<p><strong>95%:</strong> 7% &plusmn; 30% = <strong>&minus;23% hingga +37%</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>&ldquo;+7%&rdquo; tanpa rentang = menipu!</strong> Realisasi &minus;20% = <em>normal</em> (dalam 95%!), bukan &ldquo;gagal&rdquo;. <strong>CME yang jujur = titik + rentang.</strong> Klien yang paham rentang = tidak panik saat &minus;15%.</p>
</details>
<PlotlyChart
  data={[{x: ["2020","2021","2022","2023","2024"], y: [3.75,3.5,5.5,6.0,6.0], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "BI rate aktual"}, {x: ["2020","2021","2022","2023","2024"], y: [4.0,4.5,7.0,6.5,6.0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "Taylor rule (ilustrasi)"}]}
  title={"BI rate vs Taylor rule (ilustrasi)"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "(%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = aktual, kuning = rule. Selisih = stance kebijakan.</p>
<p><strong>Interpretasi:</strong> 2022: rule <strong>di atas</strong> aktual → tekanan menaikkan (terjadi!). 2024: konvergen → <strong>netral</strong>. Taylor bukan ramalan sempurna — tapi <strong>jangkar ekspektasi</strong> yang jujur. (Ilustrasi edukasi, bukan data resmi.)</p>
</div>
<h2 id="bias">Jebakan — Mengapa Peramal Gagal</h2>
<p><strong>Definisi.</strong> <strong>Bias peramal</strong>: <em>overconfidence</em> (rentang terlalu sempit), <em>anchoring</em> (terpaku data kini), <em>availability</em> (krisis terakhir mendominasi), <em>herding</em> (ikut konsensus aman).</p>
<p><strong>Obat</strong>: <strong>skenario</strong> (base/bull/bear + probabilitas), <strong>pre-mortem</strong> ('bayangkan gagal — kenapa?'), <strong>base rate</strong> (sejarah kelas aset, bukan cerita).</p>
<p><strong>Kepribadian/intuisi:</strong> Forecasting tanpa disiplin seperti <strong>meramal dengan bola kristal retak</strong>: yang terlihat = biasmu sendiri. Skenario + base rate = <strong>mengganti bola kristal dengan peta &amp; kompas</strong> — tetap bisa tersesat, tapi tahu di mana.</p>
<p><strong>Kapan dipakai:</strong> Setiap CME: paksa 3 skenario + probabilitas eksplisit.</p>
<p><strong>Pendalaman intuisi &mdash; Grinold-Kroner = &ldquo;bongkar mesin return&rdquo;.</strong> Return saham = <strong>dividen + pertumbuhan laba + perubahan valuasi</strong>. Masing-masing bisa diestimasi <em>terpisah</em>! <strong>Contoh:</strong> div 2% + growth riil 2% + inflasi 3% + repricing 0% = <strong>7% nominal</strong>. <strong>Kekuatan:</strong> transparan (tahu <em>dari mana</em> angka datang!) &amp; <em>debug-able</em> (jika salah, tahu <em>komponen mana</em>!). <strong>Kelemahan:</strong> <em>repricing</em> (perubahan P/E) = paling sulit &amp; paling volatile &mdash; <strong>asumsikan NOL untuk jangka panjang</strong> (valuasi <em>mean-reverting</em>!).</p><p><strong>Pendalaman intuisi &mdash; Grinold-Kroner = &ldquo;bongkar mesin return&rdquo;.</strong> Return saham = <strong>dividen + pertumbuhan laba + perubahan valuasi</strong>. Masing-masing bisa diestimasi <em>terpisah</em>! <strong>Contoh:</strong> div 2% + growth riil 2% + inflasi 3% + repricing 0% = <strong>7% nominal</strong>. <strong>Kekuatan:</strong> transparan (tahu <em>dari mana</em> angka datang!) &amp; <em>debug-able</em> (jika salah, tahu <em>komponen mana</em>!). <strong>Kelemahan:</strong> <em>repricing</em> (perubahan P/E) = paling sulit &amp; paling volatile &mdash; <strong>asumsikan NOL untuk jangka panjang</strong> (valuasi <em>mean-reverting</em>!).</p><details className="worked">
<summary>📐 Contoh: Pre-mortem 2020 (klik untuk buka)</summary>
<p><strong>Des 2019, pre-mortem</strong>: 'Bayangkan Des 2020 portofolio −30%. Kenapa?' → <em>pandemi? perang? krisis finansial?</em></p>
<p><strong>Hasil</strong>: tim sadar <em>tidak ada</em> proteksi ekor → tambah <strong>5% protective put</strong> / kas. Maret 2020: −35% → portofolio −22% (put bekerja).</p>
<p><strong>Pre-mortem 1 jam</strong> &gt; model 100 halaman. Murah, jujur, menyelamatkan.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Skenario &mdash; probabilitas tertimbang</summary>
<p><strong>Soal:</strong> bull (+20%, prob 25%), base (+7%, 50%), bear (&minus;15%, 25%). Ekspektasi &amp; interpretasi?</p>
<p><strong>Ekspektasi:</strong> 0,25&times;20 + 0,5&times;7 + 0,25&times;(&minus;15) = 5 + 3,5 &minus; 3,75 = <strong>4,75%</strong>.</p>
<p><strong>Interpretasi:</strong> <strong>lebih rendah</strong> dari base (7%!) karena <em>asimetri</em> (bear lebih dalam dari bull!). <strong>Pelajaran:</strong> ekspektasi &ne; skenario base &mdash; <strong>probabilitas &amp; asimetri penting</strong>. Dan: <strong>probabilitas = <em>penilaian</em>, bukan <em>fakta</em></strong> &mdash; dokumentasikan asumsinya!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Pre-mortem &mdash; &ldquo;bayangkan sudah gagal&rdquo;</summary>
<p><strong>Soal:</strong> CME bilang +8%. Lakukan <em>pre-mortem</em>: &ldquo;setahun lagi return &minus;20%. Apa yang terjadi?&rdquo;</p>
<p><strong>Hasil pre-mortem:</strong> (1) COVID-2.0? (2) perang dagang? (3) inflasi meledak? (4) <em>valuasi</em> memang ketinggian?</p>
<p><strong>Aksi:</strong> untuk tiap penyebab &rarr; <strong>proteksi murah kini</strong> (put 5%? kas 10%? <em>stop-loss</em>?). <strong>Pre-mortem = <em>vaksin</em> untuk <em>overconfidence</em>.</strong> Tim yang tidak pre-mortem = tim yang <em>jatuh cinta</em> pada forecastnya sendiri.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: CME = Peta Ketidakpastian</h2>
      <p>Grinold-Kroner, volatilitas, skenario = <strong>satu peta</strong>:</p>
      <ol>
        <li><strong>TITIK (Grinold-Kroner):</strong> bongkar return jadi komponen &mdash; <em>transparan &amp; debug-able</em>.</li>
        <li><strong>RENTANG (vol):</strong> titik &plusmn; &sigma; &mdash; <em>kejujuran tentang ketidakpastian</em>.</li>
        <li><strong>DISTRIBUSI (skenario):</strong> base/bull/bear + prob &mdash; <em>keputusan robust</em>.</li>
      </ol>
      <p><strong>CME tanpa ketiganya = <em>ramalan</em>; CME dengan ketiganya = <em>alat keputusan</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Ahli ekonomi = peramal cuaca&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;Ekonom memprediksi 9 dari 5 resesi terakhir. CME = <em>pseudosains</em> berbayar mahal.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;CME bukan <em>ramalan</em> &mdash; melainkan <strong><em>disiplin berpikir</em></strong>. Tanpa CME, alokasi = <em>tebakan</em> atau <em>ikut-ikutan</em>. <strong>CME yang buruk &gt; tidak ada CME</strong> &mdash; asal <em>rentang</em> jujur &amp; <em>asumsi</em> eksplisit.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>nilai CME = <em>proses</em>, bukan <em>angka</em>.</strong> Tim yang berdebat tentang <em>asumsi</em> (growth? valuasi? rezim?) = tim yang <em>berpikir</em>. Tim yang menelan angka = tim yang <em>berdoa</em>.</p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Bongkar 7%.</strong> &ldquo;Ekspektasi return saham 7%.&rdquo; Bongkar via Grinold-Kroner: komponen apa saja? (Jawab: mis. div 2% + growth nominal 5% + repricing 0% = 7%. <strong>Tantangan:</strong> jika P/E kini 25 (mahal!), repricing = <em>negatif</em> &rarr; ekspektasi <em>lebih rendah</em>!)</p>
      <p><strong>(2) Rentang jujur.</strong> Ekspektasi 7%, vol 16%. Berapa probabilitas return negatif tahun depan? (Jawab: z = (0&minus;7)/16 = &minus;0,44 &rarr; &asymp; <strong>33%</strong>! <strong>Sepertiga kemungkinan rugi</strong> &mdash; apakah klienmu tahu ini?)</p>
      <p><strong>(3) Pre-mortem kilat.</strong> &ldquo;2027: return &minus;25%.&rdquo; Tulis 3 penyebab paling mungkin <em>sekarang</em>. (Jawab: mis. (1) AI bubble pecah, (2) perang dagang eskalasi, (3) inflasi kembali. <strong>Untuk tiap penyebab: apa <em>tanda awal</em>-nya?</strong>)</p>
      <h3>📰 Studi Kasus: &ldquo;New Era&rdquo; 1999 &mdash; CME yang Terbunuh Euforia</h3>
      <p>1999: P/E S&amp;P 30+ (&ldquo;<em>new economy</em>&rdquo;!). Konsensus: &ldquo;return 10%+ selamanya&rdquo;. Grinold-Kroner saat itu: div 1% + growth 5% + <strong>repricing &minus;3%/tahun</strong> (P/E 30 &rarr; 20!) = <strong>3%</strong> &mdash; <em>bukan</em> 10%!</p>
      <p><strong>2000&ndash;02:</strong> &minus;45%. Yang percaya &ldquo;10%&rdquo; hancur; yang menghitung &ldquo;3%&rdquo; <em>bertahan</em>. <strong>Pelajaran:</strong> <strong>valuasi = <em>pajak</em> atas return masa depan.</strong> CME yang mengabaikan repricing = <em>fantasi</em>.</p>
      <h3>📊 Data Corner: Shiller CAPE &amp; return 10-tahun</h3>
      <p><strong>Data:</strong> CAPE &gt; 30 &rarr; return 10-tahun rata-rata &asymp; 0&ndash;3%; CAPE &lt; 15 &rarr; &asymp; 8&ndash;10%.</p>
      <p><strong>Cara membaca:</strong> <strong>korelasi kuat &amp; negatif</strong> antara valuasi kini &amp; return masa depan. <strong>Bukan</strong> untuk <em>market timing</em> (bisa mahal 5 tahun!), melainkan untuk <strong>CME jangka panjang</strong> &amp; <strong>ekspektasi yang <em>rendah hati</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Konsensus analis (+8%) = ekspektasi terbaik. Ikuti saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 2020: konsensus salah <strong>dua kali</strong> (±35%). Konsensus = <strong>herding</strong>, bukan kebijaksanaan. CME yang benar = <strong>distribusi</strong> (base/bull/bear + probabilitas), bukan titik. Titik tanpa rentang = bohong presisi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;YTM obligasi tidak relevan untuk ekspektasi return — yang penting 'view'.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>YTM kini adalah prediktor return obligasi 10-tahunan terbaik</strong> (R² ~90%!). Mengabaikannya demi 'view' = mengabaikan matematika. Untuk saham pakai Grinold-Kroner; untuk obligasi, <em>percaya YTM</em>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CME = ramalan yang harus tepat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>semua CME salah</strong> &mdash; pertanyaannya <em>seberapa berguna</em> ketidaktepatannya. CME berguna jika: <em>rentang</em> jujur (sizing benar!), <em>asumsi</em> eksplisit (bisa di-debug!), <em>skenario</em> lengkap (siap untuk buruk!). <strong>Nilai CME = <em>keputusan</em> yang dihasilkan, bukan <em>akurasi</em> titiknya.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas rendah = aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 2019: vol <em>rendah</em> &rarr; 2020: crash! <strong>Vol rendah = <em>ketenangan</em>, bukan <em>keamanan</em></strong> &mdash; bahkan bisa = <em>komplasensi</em> (risiko menumpuk diam-diam!). <strong>CME harus memasukkan <em>regime</em></strong> &mdash; bukan ekstrapolasi ketenangan.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Tulis ekspektasi sebagai rentang.</strong> 'Saham 8% ± 15%' jauh lebih berguna dari '8%'. Rentang memaksa sizing yang jujur (berapa rugi jika −1σ?).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Pre-mortem tiap keputusan besar.</strong> 1 jam membayangkan kegagalan &gt; 1 minggu model optimis. Jadikan ritual komite investasi.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Template CME 1 halaman:</strong> (1) <strong>Base/bull/bear</strong> + probabilitas; (2) <strong>Komponen</strong> (Grinold-Kroner!); (3) <strong>Rentang</strong> (&plusmn;&sigma;); (4) <strong>Asumsi kunci</strong> (3 teratas!); (5) <strong>Pre-mortem</strong> (apa yang membunuh forecast ini?). <strong>Lima bagian, satu halaman, direview tiap kuartal.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Grinold-Kroner</h2>
<p>Dekomposisi expected return saham: yield + growth + repricing.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Grinold-Kroner"}
  hint={"Ubah REPRICING 0.0 → -0.028 (P/E mean-revert). Ekspektasi anjlok — valuasi awal menentukan!"}
  defaultCode={"# Grinold-Kroner: E(R) = DY + g_riil + inflasi + repricing\nDY = 0.025        # dividend yield\nG_RIIL = 0.05     # growth riil (GDP)\nINFLASI = 0.03\nREPRICING = 0.0   # ubah! (-0.028 jika P/E mahal -> mean revert)\n\ner = DY + G_RIIL + INFLASI + REPRICING\nprint(f\"E(R) nominal = {DY:.1%} + {G_RIIL:.0%} + {INFLASI:.0%} + ({REPRICING:.1%})\")\nprint(f\"           = {er:.1%}\")\nprint()\nprint(\"Repricing -> 0 jangka panjang, tapi DOMINAN dalam 3-5 tahun.\")\nprint(\"Jangan andalkan multiple expansion untuk ekspektasi!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Taylor Rule</h2>
<p>Hitung suku bunga 'wajar' dan baca stance kebijakan.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Taylor"}
  hint={"Ubah INFLASI 0.04 → 0.06. Rule melonjak — ekspektasi pengetatan agresif!"}
  defaultCode={"# Taylor rule: i = r* + pi + 0.5*(pi - pi*) + 0.5*(gap)\nR_STAR, PI_STAR = 0.02, 0.03\nINFLASI, GAP = 0.04, 0.01   # ubah INFLASI!\nAKTUAL = 0.06               # BI rate kini\n\nrule = R_STAR + INFLASI + 0.5*(INFLASI - PI_STAR) + 0.5*GAP\nselisih = AKTUAL - rule\nprint(f\"Taylor rule: {rule:.2%}\")\nprint(f\"Aktual     : {AKTUAL:.2%}\")\nprint(f\"Stance     : {'KETAT' if selisih > 0.005 else 'LONGGAR' if selisih < -0.005 else 'NETRAL'} ({selisih:+.2%})\")\nprint()\nprint(\"Longgar -> dukung aset risiko; Ketat -> kurangi durasi.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Menentukan E(R) obligasi → <strong>YTM kini</strong></h3>
<p><strong>Kenapa:</strong> Prediktor 10-tahunan terbaik.</p>
<p><strong>Contoh nyata:</strong> YTM 7% → E(R) ≈ 7%.</p>
</div>
<div className="decision-card">
<h3>2. Menentukan E(R) saham → <strong>Grinold-Kroner</strong></h3>
<p><strong>Kenapa:</strong> Dekomposisi jujur.</p>
<p><strong>Contoh nyata:</strong> DY+g+inflasi ± repricing.</p>
</div>
<div className="decision-card">
<h3>3. BI rate vs Taylor → <strong>Baca stance; antisipasi</strong></h3>
<p><strong>Kenapa:</strong> Rule = jangkar ekspektasi.</p>
<p><strong>Contoh nyata:</strong> Rule &gt; aktual → siaga naik.</p>
</div>
<div className="decision-card">
<h3>4. Keputusan alokasi besar → <strong>Pre-mortem + 3 skenario</strong></h3>
<p><strong>Kenapa:</strong> Lawan overconfidence.</p>
<p><strong>Contoh nyata:</strong> Ritual komite.</p>
</div>
<div className="decision-card">
<h3>5. Membuat ekspektasi pasar → <strong>Skenario + rentang + pre-mortem</strong></h3>
<p><strong>Kenapa:</strong> Titik tanpa rentang = bohong presisi; konsensus = herding.</p>
<p><strong>Contoh nyata:</strong> Konsensus +8% (2019) → −35% (Mar 2020) → +16%.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Iklim, bukan cuaca</strong> (10+ tahun).</li><li><strong>YTM</strong> untuk obligasi; <strong>GK</strong> untuk saham.</li><li><strong>Rentang + probabilitas</strong>, bukan titik.</li><li><strong>Pre-mortem</strong> selalu.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Konsensus yang Salah Dua Kali</h2>
<div className="callout">
<p>Des 2019: konsensus '+8%'. Mar 2020: −35%. Des 2020: +16% setahun.</p>
<p><strong>Vignette lanjutan.</strong> Des 2019: konsensus &ldquo;+8%&rdquo; (titik, tanpa rentang!). Mar 2020: &minus;35% (COVID). Des 2020: +16% setahun. Manajer yang &ldquo;percaya&rdquo; +8% panik jual di dasar.</p>
<p><strong>Pertanyaan:</strong> (a) Apa yang salah dari &lsquo;+8%&rsquo;? (b) Format CME yang benar? (c) Aksi dari <em>pre-mortem</em>? (d) Jika CME jujur adalah &ldquo;+8% &plusmn; 25%&rdquo;, apakah &minus;35% = &ldquo;gagal&rdquo;? (e) Rancang <em>proses</em> CME untuk tim investasi.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Titik tanpa rentang</strong> = bohong presisi; herding konsensus. Realisasi ±35% = di luar 'model' siapa pun.</p>
<p>(b) <strong>Base/bull/bear + probabilitas</strong> + rentang (±σ). '+8% ± 25%' = jujur &amp; berguna untuk sizing.</p>
<p>(c) <strong>Proteksi ekor</strong> (put/kas 5%) dari pre-mortem &mdash; murah saat tenang, mahal saat dibutuhkan.</p>
<p>(d) <strong>TIDAK.</strong> &minus;35% = dalam rentang &plusmn;25% &times; 1,7&sigma; &mdash; <em>ekstrem tapi bukan &ldquo;di luar model&rdquo;</em>. <strong>Inilah nilai rentang:</strong> mengubah &ldquo;kegagalan memalukan&rdquo; menjadi &ldquo;skenario yang sudah dipikirkan&rdquo;. Manajer dengan CME &ldquo;+8% &plusmn; 25%&rdquo; = <strong>tenang</strong> (sudah siap!); manajer dengan &ldquo;+8%&rdquo; = <strong>panik</strong> (dikhianati!). <strong>Rentang = <em>ketenangan yang dibeli di muka</em>.</strong></p>
<p>(e) <strong>Proses:</strong> (1) <strong>kumpulkan</strong> (historis + forward + survei); (2) <strong>triangulasi</strong> (sepakat? bertentangan?); (3) <strong>skenario</strong> (base/bull/bear + prob); (4) <strong>pre-mortem</strong> (tim <em>devil's advocate</em>!); (5) <strong>dokumentasi</strong> (asumsi tertulis!); (6) <strong>review</strong> kuartalan (<em>bukan</em> harian!). <strong>Proses &gt; angka.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Batas Pengetahuan</h2>
      <h3>1. Regime switching &mdash; &ldquo;rata-rata&rdquo; dari dua dunia</h3>
      <p>Return 2000&ndash;2020 = rata-rata dari <em>bull</em> (2003&ndash;07), <em>krisis</em> (2008), <em>bull</em> (2009&ndash;19), <em>crash</em> (2020). <strong>Rata-rata = fiksi!</strong> &mdash; tidak ada tahun yang &ldquo;rata-rata&rdquo;. <strong>CME regime-aware:</strong> estimasi <em>per rezim</em> + probabilitas rezim. <strong>Lebih jujur, lebih sulit</strong> &mdash; tapi lebih berguna.</p>
      <h3>2. Black swan &mdash; yang tidak ada di data</h3>
      <p>COVID tidak ada di data 2019. <strong>Data historis = <em>sampel</em> dari kemungkinan, bukan <em>populasi</em>.</strong> Solusi: <strong><em>teori</em></strong> (mekanisme!) + <strong>skenario <em>imajinatif</em></strong> (bukan cuma ekstrapolasi!). <strong>Taleb:</strong> siapkan untuk <em>fragility</em> (rapuh!), bukan untuk <em>prediksi</em>.</p>
      <h3>3. Feedback loop &mdash; ramalan mengubah dunia</h3>
      <p>Jika <em>semua</em> percaya &ldquo;+8%&rdquo; &rarr; semua beli &rarr; harga naik &rarr; &ldquo;+8%&rdquo; <em>terpenuhi</em> (<em>self-fulfilling</em>!) &mdash; atau <em>tidak</em> (<em>crowded</em> &rarr; <em>reversal</em>!). <strong>CME = <em>partisipan</em> pasar, bukan <em>pengamat</em>.</strong> Rendahkan keyakinan saat konsensus <em>terlalu</em> bulat.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Grinold-Kroner kilat</h3>
      <p>Div 3%, growth riil 1,5%, inflasi 2,5%, repricing 0. Return?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>3 + 1,5 + 2,5 + 0 = <strong>7%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Rentang kilat</h3>
      <p>Ekspektasi 6%, vol 12%. Rentang 68%?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>&minus;6% hingga +18%</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; Skenario kilat</h3>
      <p>Bull +15% (30%), base +6% (50%), bear &minus;10% (20%). Ekspektasi?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>4,5 + 3 &minus; 2 = <strong>5,5%</strong>.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Historis 10% &rarr; ekspektasi 10%.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Belum tentu!</strong> Sesuaikan: valuasi kini, rezim, <em>survivorship bias</em>. Historis = bahan baku, bukan jawaban.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. DY 2,5%, g riil 5%, inflasi 3%, repricing 0. E(R)?"}
  options={
    ["7,5%",
    "10,5%",
    "5%",
    "13,5%"]
  }
  correct={1}
  explanation={"Benar: 2,5+5+3 = 10,5%. Jika P/E mahal (mean-revert −2,8%) → 7,7%. Valuasi awal menentukan!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. r*=2%, π=4%, π*=3%, gap=+1%. Taylor rule?"}
  options={
    ["6%",
    "7%",
    "8%",
    "5%"]
  }
  correct={1}
  explanation={"Benar: 2+4+0,5+0,5 = 7%. Aktual 6% → longgar → dukung risiko, waspada inflasi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Prediktor return obligasi 10-tahunan terbaik?"}
  options={
    ["View analis",
    "YTM kini",
    "Rating",
    "Kupon"]
  }
  correct={1}
  explanation={"Benar: YTM kini (R² ~90%). Matematika &gt; opini untuk obligasi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Obat overconfidence dalam forecasting?"}
  options={
    ["Model lebih kompleks",
    "Skenario + pre-mortem + base rate",
    "Ikut konsensus",
    "Abaikan"]
  }
  correct={1}
  explanation={"Benar: 3 skenario + probabilitas + pre-mortem 1 jam &gt; model 100 halaman."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Inversi kurva 2s10s sinyal?"}
  options={
    ["Growth kuat",
    "Risiko resesi (ekspektasi pemotongan rate)",
    "Inflasi",
    "Tidak ada"]
  }
  correct={1}
  explanation={"Benar: pasar bertaruh rate turun = resesi datang. Timing 6–24 bulan."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. CME: '+8% ± 25%'. Realisasi −35%. Apakah CME 'gagal'?"}
  options={
    ["Ya — meleset 43 poin",
    "Tidak — dalam rentang (±1,7σ); inilah gunanya rentang",
    "Ya — seharusnya tepat",
    "Tidak — karena konsensus juga salah"]}
  correct={1}
  explanation={"Benar: −35% masih dalam rentang ±25% (1,7σ) — ekstrem tapi bukan 'di luar model'. CME dengan rentang mengubah 'kegagalan' menjadi 'skenario yang sudah dipikirkan'. Nilai CME = keputusan, bukan akurasi titik."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>CME</strong>: ekspektasi 10+ tahun per kelas aset; rantai GDP → earnings → return.</li>
<li><strong>Grinold-Kroner</strong>: DY + g + inflasi ± repricing.</li>
<li><strong>Obligasi</strong>: YTM kini = prediktor terbaik.</li>
<li><strong>Taylor rule</strong>: jangkar ekspektasi kebijakan moneter.</li>
<li><strong>Format</strong>: skenario + probabilitas + rentang; pre-mortem ritual.</li>
<li><strong>Aturan</strong>: iklim bukan cuaca; titik tanpa rentang = bohong.</li>

<li><strong>Grinold-Kroner:</strong> div + growth + repricing; transparan.</li>
<li><strong>Rentang:</strong> titik &plusmn; &sigma;; kejujuran ketidakpastian.</li>
<li><strong>Skenario:</strong> base/bull/bear + prob + pre-mortem.</li>
<li><strong>Kapan TIDAK pakai:</strong> titik tanpa rentang; konsensus buta; historis tanpa penyesuaian.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c1-ips" className="btn btn-secondary btn-sm">← PM-C1</Link>
        <Link href="/learn/pm-c3-asset-allocation" className="btn btn-primary btn-sm">PM-C3 →</Link>
      </div>
    </div>
  );
}

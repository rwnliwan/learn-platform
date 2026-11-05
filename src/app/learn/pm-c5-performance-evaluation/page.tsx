"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC5PerformanceEvaluationPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C5 — Portfolio Management</span>
        <h1 className="display-title">Performance Evaluation:<br/>Atribusi & GIPS</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Manajer 'Hebat' yang Menipu Waktu</a></li>
<li><a href="#twrmwr">TWR vs MWR</a></li>
<li><a href="#brinson">Atribusi Brinson</a></li>
<li><a href="#gips">Benchmark & GIPS</a></li>
<li><a href="#sintesis">Sintesis: Ukur Benar</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Manajer Growth</a></li>
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
<li>Membedakan TWR vs MWR dan kapan masing-masing dipakai.</li>
<li>Menghitung atribusi Brinson 3 komponen.</li>
<li>Menjelaskan properti benchmark yang baik.</li>
<li>Menjelaskan prinsip GIPS dan praktik pelaporan.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Manajer 'Hebat' yang Menipu Waktu</h2>
      <div className="story">
        <p><strong>2021</strong>: manajer <em>growth</em> pamer return <strong>+40%</strong>. Investor berbondong-bondong masuk <strong>di puncak</strong>. <strong>2022</strong>: −30%. Investor <em>rata-rata</em> justru <strong>rugi</strong> — masuk besar saat mahal, keluar saat murah.</p>
<p>Twist-nya: return <strong>dana</strong> (+40% lalu −30%) ≠ return <strong>investor</strong> (rugi!). Dua angka, dua cerita — dan manajer hanya memamerkan yang bagus. <strong>TWR vs MWR</strong> = dua lensa kebenaran. Lesson ini: membaca return tanpa dibohongi.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="twrmwr">TWR vs MWR — Dua Kebenaran</h2>
<p><strong>Definisi.</strong> <strong>TWR</strong> (<em>time-weighted</em>): return <em>manajer</em> — hilangkan efek timing arus kas (geometric linking sub-periode). <strong>MWR/IRR</strong> (<em>money-weighted</em>): return <em>investor</em> — bobotkan oleh kapan uang masuk/keluar. <strong>MOIC</strong>: multiple kas (2,0x = uang dobel).</p>
<p><strong>Aturan</strong>: evaluasi <em>manajer</em> → TWR; evaluasi <em>pengalaman investor</em> → MWR. Beda besar = <strong>timing buruk investor</strong> (behavior gap!).</p>
<Tex math={String.raw`TWR = \prod (1 + r_t) - 1 \quad;\quad 0 = \sum \frac{CF_t}{(1 + IRR)^t}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`r_t`} />: return sub-periode (antar arus kas)</li>
<li>TWR: potong di tiap arus kas, lalu kalikan</li>
<li>IRR: tingkat yang membuat NPV arus kas = 0</li>
<li>MOIC = total distribusi / total setoran</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> TWR seperti <strong>nilai ujian murni</strong> (kemampuan siswa); MWR seperti <strong>nilai rapor dengan kehadiran</strong> (pengalaman nyata: bolos saat materi mudah, hadir saat susah = nilai jeblok). Keduanya benar — <em>jawab pertanyaan berbeda</em>.</p>
<p><strong>Kapan dipakai:</strong> Fund factsheet → TWR; laporan ke investor individu → MWR juga.</p>
<p><strong>Pendalaman intuisi &mdash; TWR vs MWR = &ldquo;siapa yang diukur?&rdquo;.</strong> <strong>TWR</strong> (<em>time-weighted</em>): return <em>manajer</em> (menghilangkan efek <em>timing</em> setoran!). <strong>MWR/IRR</strong> (<em>money-weighted</em>): return <em>investor</em> (termasuk <em>dosa</em> FOMO di puncak!). <strong>Dana +40% lalu &minus;30%:</strong> TWR = &minus;2% (manajer <em>biasa</em>); IRR investor = &minus;20% (investor <em>menghancurkan</em> dirinya via FOMO!). <strong>Perbedaan keduanya = <em>behavior gap</em></strong> &mdash; ukuran <em>kerusakan</em> yang dilakukan investor ke dirinya sendiri.</p><details className="worked">
<summary>📐 Contoh: Cerita manajer growth (klik untuk buka)</summary>
<p>Dana: 2021 +40%, 2022 −30%. <strong>TWR</strong> = 1,4 × 0,7 − 1 = <strong>−2%</strong>.</p>
<p>Investor: setor 100 (→140), tambah 400 = 540, lalu ×0,7 = <strong>378</strong>. <strong>IRR</strong> ≈ <strong>−21%</strong>! <strong>MOIC</strong> = 378/500 = <strong>0,76x</strong>.</p>
<p>Manajer: '−2% (pasar sulit)'. Investor: '−20%!'. <strong>Selisih 18 poin = behavior gap</strong> — investor membeli di puncak. Evaluasi jujur = tampilkan <em>keduanya</em>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): TWR &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> dana: awal 100, +40% (tahun 1), &minus;30% (tahun 2). Hitung TWR 2-tahun.</p>
<p><strong>Langkah 1:</strong> TWR = (1,40 &times; 0,70) &minus; 1 = 0,98 &minus; 1 = <strong>&minus;2%</strong>.</p>
<p><strong>Interpretasi:</strong> manajer &ldquo;+40%!&rdquo; lalu &ldquo;&minus;30%&rdquo; = <strong>net &minus;2%</strong>. <strong>Urutan penting:</strong> +40% lalu &minus;30% &ne; &minus;30% lalu +40%? <strong>Untuk TWR: SAMA</strong> (perkalian komutatif!). <strong>Untuk MWR: BEDA</strong> (tergantung <em>kapan</em> setor!).</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: MWR &mdash; dosa FOMO</summary>
<p><strong>Soal:</strong> setor 100 (awal), setor 400 (setelah +40%, di puncak!). Dana lalu &minus;30%. Hitung IRR (MWR).</p>
<p><strong>Langkah 1 &mdash; arus:</strong> t0: &minus;100; t1: &minus;400; t2: +(140+400)&times;0,7 = +378.</p>
<p><strong>Langkah 2:</strong> IRR: &minus;100 &minus; 400/(1+r) + 378/(1+r)&sup2; = 0 &rarr; r &asymp; <strong>&minus;20%</strong>.</p>
<p><strong>Bandingkan:</strong> TWR &minus;2% vs MWR &minus;20% &mdash; <strong>selisih 18 poin = <em>behavior gap</em>!</strong> (FOMO 400 di puncak!). <strong>Pelajaran:</strong> <em>investor</em> menghancurkan <em>dirinya sendiri</em> &mdash; manajer &ldquo;hanya&rdquo; &minus;2%.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Return +40% = hebat&rdquo;.</strong> <strong>Tanya:</strong> TWR atau MWR? <em>Neto</em> atau <em>bruto</em>? Vs <em>benchmark</em>? <em>Risiko</em>-nya? +40% dengan vol 50% &ne; +40% dengan vol 15%! <strong>Angka tanpa konteks = <em>pemasaran</em>.</strong></p>
</div>

<PlotlyChart
  data={[{x: ["TWR (manajer)", "MWR (investor)"], y: [-2, -20], type: "bar", marker: {color: ["#2a7de1", "#d62728"]}, name: "Return (%)"}]}
  title={"Behavior gap: −2% vs −20% — FOMO menghancurkan"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Return (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang = return manajer (TWR) vs investor (MWR).</p>
<p><strong>Interpretasi:</strong> <strong>selisih 18 poin!</strong> &mdash; <em>murni</em> dari <em>timing</em> setoran (FOMO 400 di puncak!). <strong>Manajer &ldquo;biasa&rdquo; (&minus;2%); investor &ldquo;menghancurkan diri&rdquo; (&minus;20%).</strong> Inilah <em>behavior gap</em> (Dalbar: &asymp; 2&ndash;4%/tahun!). <strong>Solusi:</strong> DCA otomatis + IPS + <em>jangan lihat portofolio tiap hari</em>.</p>
</div>
<h2 id="brinson">Atribusi Brinson — Bedah Nilai Tambah</h2>
<p><strong>Definisi.</strong> <strong>Excess return</strong> = <strong>allocation</strong> (bobot beda × return benchmark sektor) + <strong>selection</strong> (bobot benchmark × return beda) + <strong>interaction</strong> (bobot beda × return beda).</p>
<p><strong>Gunanya</strong>: jawab 'manajer hebat <em>di apa</em>?' — pilih sektor (allocation) atau pilih saham (selection)?</p>
<Tex math={String.raw`R_p - R_b = \sum (w_p - w_b)R_b + \sum w_b(R_p - R_b) + \sum (w_p - w_b)(R_p - R_b)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Allocation: <Tex math={String.raw`(w_p - w_b) R_b`} /> — bobot menyimpang × return sektor</li>
<li>Selection: <Tex math={String.raw`w_b (R_p - R_b)`} /> — saham mengalahkan sektornya?</li>
<li>Interaction: <Tex math={String.raw`(w_p - w_b)(R_p - R_b)`} /> — keduanya sekaligus</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Atribusi seperti <strong>bedah nilai rapor</strong>: allocation = 'pilih jurusan yang tepat' (sektor); selection = 'ranking di jurusan' (saham); interaction = 'keduanya'. Tanpa bedah, 'nilai bagus' tidak bisa direplikasi.</p>
<p><strong>Kapan dipakai:</strong> Review manajer kuartalan; keputusan retain/fire.</p>
<p><strong>Pendalaman intuisi &mdash; Brinson = &ldquo;otopsi return&rdquo;.</strong> Return vs benchmark diurai: <strong>alokasi</strong> (pilih 70% saham vs 60%?) + <strong>seleksi</strong> (pilih saham A vs B?) + <strong>interaksi</strong>. <strong>Kegunaan:</strong> <em>akuntabilitas</em> (manajer <em>dibayar</em> untuk apa? alokasi atau seleksi?) &amp; <em>diagnosis</em> (yang <em>gagal</em> = alokasi atau seleksi?). <strong>Tanpa atribusi, evaluasi = <em>tebak-tebakan</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Bedah manajer (klik untuk buka)</summary>
<p>Sektor teknologi: w_p 30% vs w_b 20%; R_p 25% vs R_b 15%.</p>
<p><strong>Allocation</strong> = (30%−20%)×15% = <strong>+1,5%</strong> (overweight sektor bagus ✓).</p>
<p><strong>Selection</strong> = 20%×(25%−15%) = <strong>+2,0%</strong> (sahamnya mengalahkan ✓).</p>
<p><strong>Interaction</strong> = 10%×10% = <strong>+1,0%</strong>.</p>
<p><strong>Total +4,5%</strong>: manajer hebat di <em>keduanya</em> — layak dipertahankan (dan layak fee!).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Atribusi Brinson &mdash; angka</summary>
<p><strong>Soal:</strong> benchmark 60/40. Portofolio 70/30. Return: saham P 12% vs B 10%; obligasi P 4% vs B 5%. Atribusi?</p>
<p><strong>Alokasi:</strong> (0,7&minus;0,6)&times;(10%&minus;R_B) + (0,3&minus;0,4)&times;(5%&minus;R_B). R_B = 0,6&times;10+0,4&times;5 = 8%. Alokasi = 0,1&times;2% + (&minus;0,1)&times;(&minus;3%) = 0,2% + 0,3% = <strong>+0,5%</strong> (<em>overweight</em> saham yang outperform!).</p>
<p><strong>Seleksi:</strong> 0,6&times;(12%&minus;10%) + 0,4&times;(4%&minus;5%) = 1,2% &minus; 0,4% = <strong>+0,8%</strong>.</p>
<p><strong>Total value-add:</strong> 0,5% + 0,8% + interaksi = <strong>+1,4%</strong>. <strong>Manajer hebat di <em>keduanya</em>!</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Atribusi untuk keputusan</summary>
<p><strong>Soal:</strong> manajer <em>underperform</em> 2%. Atribusi: alokasi +1%, seleksi &minus;3%. Keputusan?</p>
<p><strong>Diagnosis:</strong> <strong>alokasi bagus</strong> (timing tepat!), <strong>seleksi buruk</strong> (pilih saham salah!).</p>
<p><strong>Aksi:</strong> <strong>jangan pecat</strong> (alokasi = skill!), tapi <strong>ganti proses seleksi</strong> (analis? model? <em>universe</em>?). <strong>Tanpa atribusi:</strong> &ldquo;pecat saja&rdquo; &rarr; <strong>membuang skill alokasi yang langka!</strong> <strong>Atribusi = <em>bedah</em>, bukan <em>eksekusi</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; IRR vs TWR untuk manajer.</strong> <strong>Manajer = TWR!</strong> (MWR <em>terkontaminasi</em> timing investor yang <em>di luar kendali</em> manajer!). Soal yang menilai manajer dengan IRR &rarr; <strong>salah metrik</strong>. <strong>TWR = <em>skill</em>; MWR = <em>pengalaman investor</em>.</strong></p>
</div>
<PlotlyChart
  data={[{x: ["Allocation", "Selection", "Interaction"], y: [1.5, 2.0, 1.0], type: "bar", marker: {color: ["#2a7de1","#16a34a","#e8a838"]}, text: ["+1,5%","+2,0%","+1,0%"], textposition: "outside"}]}
  title={"Atribusi Brinson: sumber excess return +4,5%"}
  layout={{xaxis: {title: "Komponen"}, yaxis: {title: "Kontribusi (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = kontribusi tiap komponen ke excess return.</p>
<p><strong>Interpretasi:</strong> Manajer unggul <strong>di kedua</strong> dimensi: pilih sektor tepat (+1,5%) <em>dan</em> pilih saham tepat (+2,0%). Jika hanya allocation positif tapi selection negatif = <strong>tukang tebak sektor</strong>, bukan stock picker — fee aktif tidak layak.</p>
</div>
<h2 id="gips">Benchmark & GIPS — Standar Kejujuran</h2>
<p><strong>Definisi.</strong> <strong>Benchmark baik</strong>: <em>specified in advance</em>, <em>measurable</em>, <em>unambiguous</em>, <em>reflective of views</em>, <em>owned</em>, <em>investable</em>. <strong>GIPS</strong>: standar global presentasi kinerja — <em>composite</em> (semua portofolio discretionary!), <em>gross &amp; net</em>, <em>fee disclosure</em>, <strong>verifikasi independen</strong>.</p>
<p><strong>Dosa klasik</strong>: <em>survivorship bias</em> (tampilkan hanya dana hidup), <em>cherry-picking</em> periode, benchmark yang <strong>diganti</strong> saat kalah.</p>
<p><strong>Kepribadian/intuisi:</strong> GIPS seperti <strong>label nutrisi makanan</strong>: sebelum ada, produsen klaim 'sehat!' seenaknya. GIPS memaksa <strong>semua produk</strong> (termasuk yang gagal!) + <strong>cara ukur standar</strong> + <strong>auditor</strong>. Klaim 'return 20%' tanpa GIPS = iklan, bukan fakta.</p>
<p><strong>Kapan dipakai:</strong> Factsheet, marketing manajer, due diligence — tuntut GIPS-compliant.</p>
<p><strong>Pendalaman intuisi &mdash; GIPS = &ldquo;aturan main iklan&rdquo;.</strong> Manajer <em>curang</em>: pamer <em>portofolio terbaik</em> (<em>cherry-picking</em>!), <em>survivorship</em> (tutup yang gagal!), <em>backfill</em>. <strong>GIPS</strong> (<em>Global Investment Performance Standards</em>): <em>komposit</em> (semua portofolio se-mandat!), <em>pengungkapan</em> penuh, <em>verifikasi</em> independen. <strong>Aturan:</strong> klaim &ldquo;sesuai GIPS&rdquo; tanpa verifikasi = <em>pelanggaran</em>. <strong>Investor cerdas: <em>tanya GIPS</em> sebelum percaya angka.</strong></p><details className="worked">
<summary>📐 Contoh: Audit factsheet (klik untuk buka)</summary>
<p>Factsheet: 'Return 5 tahun 15%/thn!' Cek GIPS:</p>
<p><strong>(1)</strong> Composite? Hanya 'strategi unggulan' (2 dari 10 dana) → <strong>survivorship!</strong> <strong>(2)</strong> Gross/net? Gross (fee 2%!) → net = <strong>13%</strong>. <strong>(3)</strong> Benchmark? Diganti 2x.</p>
<p><strong>Verdict</strong>: klaim 15% → realita ~10% vs benchmark. <strong>Tolak.</strong> GIPS = kacamata X-ray factsheet.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Pelanggaran GIPS &mdash; kenali</summary>
<p><strong>Soal:</strong> manajer mengiklankan &ldquo;return 25%!&rdquo; dari <em>satu</em> portofolio terbaik (dari 20). Pelanggaran?</p>
<p><strong>Ya!</strong> GIPS mewajibkan <strong><em>komposit</em></strong> (semua 20 portofolio se-mandat, <em>asset-weighted</em>!). <strong><em>Cherry-picking</em></strong> = pelanggaran. <strong>Juga:</strong> harus ungkap <em>fee</em> (bruto/neto!), <em>benchmark</em>, <em>dispersi</em>.</p>
<p><strong>Aturan investor:</strong> <strong>tanya:</strong> (1) &ldquo;komposit atau portofolio?&rdquo; (2) &ldquo;bruto atau neto?&rdquo; (3) &ldquo;terverifikasi?&rdquo; <strong>Tidak bisa jawab = <em>jangan percaya</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Survivorship bias</summary>
<p><strong>Soal:</strong> 10 dana diluncurkan 2020. 2024: 7 bertahan (rata-rata +8%), 3 ditutup (&minus;20%). Berapa &ldquo;rata-rata industri&rdquo; yang <em>dilaporkan</em> vs <em>sebenarnya</em>?</p>
<p><strong>Dilaporkan:</strong> <strong>+8%</strong> (hanya yang bertahan!).</p>
<p><strong>Sebenarnya:</strong> (7&times;8 + 3&times;(&minus;20))/10 = (56&minus;60)/10 = <strong>&minus;0,4%</strong>!</p>
<p><strong>Selisih: 8,4 poin!</strong> &mdash; <em>survivorship bias</em>. <strong>GIPS:</strong> komposit harus mencakup <em>yang ditutup</em> (hingga penutupan!). <strong>Pelajaran:</strong> &ldquo;rata-rata manajer&rdquo; = <em>lebih buruk</em> dari yang dilaporkan. <strong>Selalu tanya: <em>yang mati di mana?</em></strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Ukur dengan Benar</h2>
      <p>TWR/MWR, atribusi, GIPS = <strong>satu disiplin</strong>:</p>
      <ol>
        <li><strong>UKUR (TWR/MWR):</strong> <em>pisahkan</em> skill manajer dari perilaku investor.</li>
        <li><strong>URAI (atribusi):</strong> <em>diagnosis</em> dari mana return datang.</li>
        <li><strong>JUJUR (GIPS):</strong> <em>standar</em> agar angka bisa dipercaya.</li>
      </ol>
      <p><strong>Tanpa ketiganya, &ldquo;evaluasi&rdquo; = <em>opini</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Iklan return = penipuan&rdquo;</h3>
      <p><strong>Kritis:</strong> &ldquo;Iklan &lsquo;+40%!&rsquo; tanpa TWR/MWR/risiko/benchmark = <strong><em>penipuan legal</em></strong>. Investor ritel tidak tahu bedanya &mdash; dan <em>dimanfaatkan</em>.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Angka = <em>fakta</em>. Investor <em>dewasa</em> harus <em>belajar</em> membaca. GIPS = <em>standar</em> yang tersedia &mdash; yang tidak bertanya = <em>salah sendiri</em>.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>keduanya benar.</strong> Industri <em>wajib</em> jujur (GIPS!); investor <em>wajib</em> cerdas (tanya 5!). <strong>Lesson ini = <em>vaksin</em> untukmu.</strong></p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Iklan vs realita.</strong> Iklan: &ldquo;+50% tahun lalu!&rdquo; Lima tanyamu? (Jawab: TWR/MWR? Bruto/neto? Benchmark? Risiko? GIPS? <strong>Tidak bisa jawab = jangan percaya.</strong>)</p>
      <p><strong>(2) Gap-mu.</strong> Hitung TWR vs MWR portofoliomu sendiri. Selisihnya? (Jawab: jika MWR &lt; TWR &rarr; <strong>kamu FOMO/panik!</strong> &mdash; <em>behavior gap</em> pribadimu.)</p>
      <p><strong>(3) Atribusi cepat.</strong> Portofoliomu vs IHSG tahun lalu: dari <em>alokasi</em> atau <em>seleksi</em>? (Jawab: jika tidak tahu &rarr; <strong>kamu tidak mengevaluasi &mdash; kamu <em>menebak</em>.</strong>)</p>
      <h3>📰 Studi Kasus: Madoff &mdash; &ldquo;Return&rdquo; Tanpa Verifikasi</h3>
      <p>Bernie Madoff: return <em>konsisten</em> 10&ndash;12%/tahun, <em>vol rendah</em>, <em>tidak pernah</em> rugi besar. <strong>Terlalu bagus untuk benar.</strong> <em>Red flags</em>: (1) <strong>auditor <em>tidak dikenal</em></strong>; (2) <strong>strategi <em>tidak jelas</em></strong> (<em>split-strike</em> misterius!); (3) <strong><em>tidak</em> GIPS</strong>; (4) return <em>terlalu mulus</em> (<em>vol</em> tidak wajar!).</p>
      <p><strong>2008:</strong> <em>Ponzi</em> USD 65M terbongkar. <strong>Pelajaran:</strong> <strong>return <em>mulus</em> + <em>tidak transparan</em> = <em>lari</em>.</strong> Verifikasi <em>independen</em> (kustodian! auditor Big Four! GIPS!) = <strong>wajib</strong>. <strong>Kepercayaan = <em>verifikasi</em>.</strong></p>
      <h3>📊 Data Corner: Dalbar &mdash; behavior gap</h3>
      <p><strong>Data (Dalbar):</strong> 20 tahun: S&amp;P 500 &asymp; 9%/tahun; <strong>investor rata-rata &asymp; 5&ndash;6%</strong> (reksadana saham!).</p>
      <p><strong>Gap: 3&ndash;4%/tahun!</strong> &mdash; dari <em>jual panik</em> &amp; <em>beli FOMO</em>. <strong>20 tahun: selisih &asymp; 50% kekayaan!</strong> <strong>Musuh terbesar investor = <em>cermin</em>.</strong> Solusi: DCA + IPS + <em>jangan sering cek</em>.</p>
      <h3>📊 Data Corner: Sharpe vs Return</h3>
      <p><strong>Data:</strong> Manajer X: +25%, vol 30% (Sharpe 0,7). Manajer Y: +12%, vol 10% (Sharpe 1,0).</p>
      <p><strong>Siapa &ldquo;lebih baik&rdquo;?</strong> <strong>Y!</strong> (Sharpe lebih tinggi = <em>efisiensi</em> lebih baik!). X = <em>leverage</em> terselubung (return tinggi dari <em>risiko</em> tinggi, bukan <em>skill</em>!). <strong>Uji:</strong> <em>de-leverage</em> X ke vol 10% &rarr; return &asymp; 8% &lt; 12% Y. <strong>Return tanpa risiko = <em>ilusi skill</em>.</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;Peringkat kuartil&rdquo;</h3>
      <p><strong>Bangga:</strong> &ldquo;Kami kuartil 1!&rdquo;</p>
      <p><strong>Sinis:</strong> &ldquo;Dari <em>universe</em> apa? Yang <em>gagal</em> sudah dikeluarkan (<em>survivorship</em>!)? <em>Style</em>-nya sama? <strong>Peringkat tanpa konteks = <em>kosmetik</em>.</strong> Tanya: <em>benchmark</em>-nya apa? <em>Risk-adjusted</em>?&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>benchmark &gt; peer.</strong> Peer = <em>hiburan</em>; benchmark = <em>evaluasi</em>. Jika manajer hanya pamer peringkat &rarr; <strong>minta atribusi &amp; GIPS</strong>.</p>
      <h3>📋 Template Laporan 1 Halaman</h3>
      <p><strong>KINERJA:</strong> TWR ___%, MWR ___%, Benchmark ___%, <em>Excess</em> ___%.</p>
      <p><strong>RISIKO:</strong> Vol ___%, Max DD ___%, Sharpe ___, IR ___.</p>
      <p><strong>ATRIBUSI:</strong> Alokasi ___%, Seleksi ___%.</p>
      <p><strong>BIAYA:</strong> Total ___%/tahun.</p>
      <p><strong>VERIFIKASI:</strong> GIPS? Ya/Tidak. <strong>Satu halaman, lima bagian, <em>jujur</em>.</strong></p>
      <h3>🔬 Deep Dive Tambahan: Mengurai &ldquo;Alpha&rdquo;</h3>
      <p><strong>Pertanyaan:</strong> manajer &ldquo;alpha 3%&rdquo; &mdash; dari mana? <strong>Kemungkinan:</strong> (1) <strong><em>skill</em> sejati</strong> (seleksi/alokasi!); (2) <strong><em>faktor</em></strong> (<em>value/momentum</em> &mdash; bukan skill, melainkan <em>premi risiko</em>!); (3) <strong><em>leverage</em></strong> (beta terselubung!); (4) <strong><em>luck</em></strong> (noise!).</p>
      <p><strong>Urai via regresi faktor:</strong> R = &alpha; + &beta;1&times;Market + &beta;2&times;Value + &beta;3&times;Momentum + &epsilon;. <strong>Jika &ldquo;alpha&rdquo; hilang</strong> setelah kontrol faktor &rarr; <strong>bukan skill!</strong> &mdash; melainkan <em>faktor tilt</em> (yang bisa didapat <em>murah</em> via ETF!). <strong>Bayar <em>fee</em> aktif untuk <em>faktor</em> = <em>tertipu</em>.</strong></p>
      <p><strong>Uji <em>signifikansi</em>:</strong> alpha 3% dengan <em>t-stat</em> 1,2 = <strong><em>tidak signifikan</em></strong> (bisa <em>luck</em>!). Butuh <em>t</em> &gt; 2 &amp; <em>konsisten</em> multi-periode. <strong>Aturan:</strong> <strong>jangan bayar untuk <em>noise</em>.</strong></p>
      <p><strong><em>Style analysis</em> (Sharpe):</strong> regresi return ke <em>style index</em> &rarr; ungkap <em>eksposur sebenarnya</em>. <strong>Contoh:</strong> &ldquo;manajer saham&rdquo; ternyata 40% <em>obligasi</em>! &mdash; <strong><em>style drift</em></strong>! <strong>Evaluasi vs <em>style benchmark</em></strong>, bukan vs klaim.</p>
      <p><strong>Kesimpulan:</strong> &ldquo;alpha&rdquo; = <strong><em>klaim</em></strong>; <em>faktor + signifikansi + style</em> = <strong><em>verifikasi</em></strong>. <strong>Bayar hanya untuk yang <em>terverifikasi</em>.</strong></p>
      <h3>✅ Final Checklist: Membaca Laporan Kinerja</h3>
      <p><strong>ANGKA:</strong> (1) TWR <em>atau</em> MWR? (2) Bruto <em>atau</em> neto? (3) Periode <em>berapa lama</em>?</p>
      <p><strong>KONTEKS:</strong> (4) Benchmark <em>sesuai</em>? (5) Risiko (<em>vol/DD/Sharpe</em>)? (6) Atribusi (dari mana?)</p>
      <p><strong>KEPERCAYAAN:</strong> (7) GIPS <em>terverifikasi</em>? (8) <em>Survivorship</em> diperhitungkan? (9) <em>Fee</em> diungkap penuh?</p>
      <p><strong>KEPUTUSAN:</strong> (10) Apakah <em>alpha</em> signifikan? (11) Apakah <em>faktor</em> atau <em>skill</em>? (12) Apakah <em>layak</em> dipertahankan?</p>
      <p><strong>12 tanya. Jika manajer tidak bisa jawab &rarr; <em>jangan percaya</em>.</strong> Evaluasi = <em>skeptisisme terstruktur</em>.</p>
      <h3>🎓 Ujian Akhir Lesson (Refleksi)</h3>
      <p><strong>Pertanyaan 1:</strong> Dana +40% lalu &minus;30%. Berapa TWR? MWR investor yang FOMO? <em>Behavior gap</em>?</p>
      <p><strong>Pertanyaan 2:</strong> Manajer <em>underperform</em> 2%: alokasi +1%, seleksi &minus;3%. <em>Pecat</em> atau <em>pertahankan</em>?</p>
      <p><strong>Pertanyaan 3:</strong> Iklan &ldquo;return 25%!&rdquo; &mdash; 5 tanyamu sebelum percaya?</p>
      <p><strong>Jika bisa jawab ketiganya tanpa melihat catatan &rarr; <em>lulus</em>.</strong></p>
      <h3>💡 Prinsip Abadi Evaluasi</h3>
      <p><strong>(1) Pisahkan <em>skill</em> vs <em>luck</em> vs <em>perilaku</em>.</strong> (2) <strong>Angka tanpa konteks = <em>pemasaran</em>.</strong> (3) <strong>Verifikasi &gt; kepercayaan.</strong> (4) <strong>Musuh terbesar = <em>cermin</em>.</strong> (5) <strong>Evaluasi = <em>keputusan</em>, bukan <em>penilaian</em>.</strong></p>
      <p><strong>Lima prinsip. Tempel di dinding. Baca sebelum percaya angka return.</strong></p>
      <h3>🔗 Menghubungkan ke Lesson Lain</h3>
      <p><strong>Ke PM-C3 (Alokasi):</strong> atribusi <em>memvalidasi</em> SAA &mdash; alokasi +1% = SAA benar!</p>
      <p><strong>Ke PM-C1 (IPS):</strong> evaluasi vs <em>IPS</em>, bukan vs <em>tetangga</em>!</p>
      <p><strong>Ke PM-C6 (Behavioral):</strong> <em>behavior gap</em> = <em>biaya psikologi</em> &mdash; diukur di sini, dijelaskan di sana.</p>
      <p><strong>Evaluasi = <em>jembatan</em></strong> antara <em>teori</em> (C1&ndash;C4) &amp; <em>realita</em> (C6+).</p>
      <h3>📖 Esai: Evaluasi yang Adil</h3>
      <p><strong><em>Evaluasi</em></strong> = <strong><em>cermin</em></strong>. <strong><em>Cermin</em></strong> = <strong><em>jujur</em></strong>. <strong><em>Jujur</em></strong> = <strong><em>perbaiki</em></strong>.</p>
      <p><strong><em>Jangan</em></strong> <em>pecahkan</em> <strong><em>cermin</em></strong>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      <p><strong><em>Teruslah</em></strong> <strong><em>belajar</em></strong> dan <strong><em>berkembang</em></strong>.</p>
      <p><strong><em>Maju</em></strong> <strong><em>terus</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Return dana = return yang saya terima. Manajer +40%/-30% artinya saya -2%.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Investor cerita ini: <strong>IRR −20%, MOIC 0,7x</strong> (FOMO di puncak!). TWR = skill manajer; MWR = pengalamanmu. <strong>Behavior gap</strong> rata-rata investor = 2–4%/tahun (Dalbar). Ukur keduanya — dan <strong>jangan FOMO</strong>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Factsheet 15%/tahun = bukti manajer hebat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tanpa GIPS: mungkin <strong>survivorship</strong> (8 dana gagal disembunyikan!), <strong>gross</strong> (net 13%), <strong>benchmark diganti</strong>. Tuntut: composite lengkap, gross &amp; net, benchmark konsisten, verifikasi. <strong>Iklan ≠ bukti.</strong></p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Return tinggi = manajer hebat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>tanya <em>risiko</em>!</strong> +40% dengan <em>leverage</em> 3&times; = <em>biasa</em> (+13% <em>unlevered</em>!). <strong>Ukuran benar:</strong> <em>risk-adjusted</em> (Sharpe! Information Ratio!) + <em>atribusi</em> (dari mana?). <strong>Return tanpa risiko = <em>setengah cerita</em>.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Benchmark = IHSG.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> benchmark harus <strong><em>sesuai mandat</em></strong>! Dana <em>konservatif</em> vs IHSG = <em>tidak adil</em> (dan <em>tidak informatif</em>!). <strong>Benchmark valid:</strong> <em>investable</em>, <em>terukur</em>, <em>sesuai gaya</em>. <strong>Salah benchmark = salah kesimpulan.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu minta dua angka: TWR dan MWR.</strong> Jika manajer hanya memberi TWR — tanyakan pengalaman investor rata-rata. Selisih besar = red flag perilaku (atau marketing).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Bangun template pelaporan standar.</strong> TWR/MWR, atribusi Brinson, benchmark konsisten, gross vs net — tiap kuartal, format sama. Konsistensi format = <strong>kejujuran yang bisa diaudit</strong> (job relevance: Power BI reporting!).</strong></p>
</div>

<div className="tip">
<p><strong>💡 Sebelum percaya angka return, tanya 5:</strong> (1) <strong>TWR atau MWR?</strong> (2) <strong>Bruto atau neto?</strong> (3) <strong>Vs benchmark apa?</strong> (4) <strong>Risiko berapa?</strong> (5) <strong>GIPS?</strong> <strong>Lima tanya, atau jangan percaya.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator TWR vs MWR</h2>
<p>Hitung return manajer (TWR) vs pengalaman investor (MWR/IRR).</p>
<PyodideLab
  title={"Lab 1 — Kalkulator TWR vs MWR"}
  hint={"Ubah TAMBAH 400 → 100 (tidak FOMO). IRR mendekati TWR — timing menentukan!"}
  defaultCode={"# TWR vs MWR (IRR sederhana: 2 periode)\nR1, R2 = 0.40, -0.30      # return dana per tahun\nSETOR1 = 100              # awal tahun 1\nTAMBAH = 400              # awal tahun 2 (ubah!)\n\ntwr = (1+R1)*(1+R2) - 1\nnilai = (SETOR1*(1+R1) + TAMBAH)*(1+R2)\ntotal_setor = SETOR1 + TAMBAH\n# IRR: -S1 - T/(1+r) + N/(1+r)^2 = 0 -> selesaikan kuadrat\nimport math\na, b, c = nilai, -(SETOR1 + TAMBAH) - SETOR1, 0  # bentuk: a x^2 + b x, x=1/(1+r)\n# -S1 - T*x + N*x^2 = 0\nA, B, C = nilai, -TAMBAH, -SETOR1\nD = B*B - 4*A*C\nx = (-B + math.sqrt(D))/(2*A)\nirr = 1/x - 1\n\nprint(f\"TWR (manajer) : {twr:.1%}\")\nprint(f\"IRR (investor): {irr:.1%}\")\nprint(f\"MOIC          : {nilai/total_setor:.2f}x\")\nprint(f\"Behavior gap  : {twr-irr:+.1%}\")\nprint(\"\\nFOMO di puncak = IRR jauh di bawah TWR.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Atribusi Brinson</h2>
<p>Bedah excess return jadi allocation + selection + interaction.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Brinson"}
  hint={"Ubah RP 0.25 → 0.10 (saham kalah dari sektor). Selection negatif — manajer bukan stock picker!"}
  defaultCode={"# Atribusi Brinson 1 sektor\nW_P, W_B = 0.30, 0.20   # bobot portofolio vs benchmark\nR_P, R_B = 0.25, 0.15   # return portofolio vs benchmark sektor (ubah R_P!)\n\nalloc = (W_P - W_B) * R_B\nselec = W_B * (R_P - R_B)\ninter = (W_P - W_B) * (R_P - R_B)\ntotal = alloc + selec + inter\n\nprint(f\"Allocation : {alloc:+.2%}\")\nprint(f\"Selection  : {selec:+.2%}\")\nprint(f\"Interaction: {inter:+.2%}\")\nprint(f\"Total      : {total:+.2%}  (cek: {(W_P*R_P - W_B*R_B):+.2%})\")\nprint()\nprint(\"Selection negatif + allocation positif = tukang tebak sektor.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Evaluasi skill manajer → <strong>TWR vs benchmark</strong></h3>
<p><strong>Kenapa:</strong> Bersih dari timing investor.</p>
<p><strong>Contoh nyata:</strong> Factsheet GIPS.</p>
</div>
<div className="decision-card">
<h3>2. Laporan ke investor → <strong>MWR/IRR + MOIC juga</strong></h3>
<p><strong>Kenapa:</strong> Pengalaman nyata.</p>
<p><strong>Contoh nyata:</strong> Private banking.</p>
</div>
<div className="decision-card">
<h3>3. Putuskan retain/fire manajer → <strong>Atribusi Brinson multi-periode</strong></h3>
<p><strong>Kenapa:</strong> Skill apa? Konsisten?</p>
<p><strong>Contoh nyata:</strong> Selection + 3 tahun.</p>
</div>
<div className="decision-card">
<h3>4. Terima marketing manajer → <strong>Cek GIPS: composite, gross/net, benchmark</strong></h3>
<p><strong>Kenapa:</strong> Saring iklan.</p>
<p><strong>Contoh nyata:</strong> Audit factsheet.</p>
</div>
<div className="decision-card">
<h3>5. Evaluasi kinerja → <strong>TWR untuk manajer; atribusi; verifikasi GIPS</strong></h3>
<p><strong>Kenapa:</strong> MWR = behavior gap; atribusi = diagnosis; GIPS = anti-curang.</p>
<p><strong>Contoh nyata:</strong> TWR −2% vs IRR −20% — FOMO 18 poin!</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>TWR</strong> = manajer; <strong>MWR</strong> = investor.</li><li><strong>Bedah</strong> dengan Brinson.</li><li><strong>Benchmark</strong>: konsisten &amp; investable.</li><li><strong>Tuntut GIPS</strong>.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Halo +40%, Selamat Tinggal −30%</h2>
<div className="callout">
<p>Dana: +40% (2021), −30% (2022). Investor setor 100 lalu FOMO 400 di puncak.</p>
<p><strong>Vignette lanjutan.</strong> Dana: +40% (2021), &minus;30% (2022). Investor setor 100 (awal), lalu FOMO setor 400 di <em>puncak</em> 2021. Manajer mengiklankan &ldquo;+40%!&rdquo; (2021) tanpa konteks.</p>
<p><strong>Pertanyaan:</strong> (a) TWR, IRR, MOIC? (b) Siapa salah? (c) Sistem pencegah? (d) Hitung <em>behavior gap</em> &amp; jelaskan ke investor. (e) Rancang <em>laporan</em> yang jujur.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>TWR &minus;2%</strong> (1,4&times;0,7&minus;1); <strong>IRR &asymp; &minus;20%</strong>; <strong>MOIC 0,7&times;</strong> (378/500).</p>
<p>(d) <strong>Behavior gap = &minus;2% &minus; (&minus;20%) = 18 poin!</strong> &mdash; <em>murni</em> dari FOMO. <strong>Jelaskan:</strong> &ldquo;Dana &minus;2% (biasa); Bapak/Ibu &minus;20% karena setor 400 di puncak. <strong>Jika DCA rutin, hasil &asymp; TWR.</strong> Musuh terbesar = <em>diri sendiri</em>.&rdquo; <strong>Data Dalbar:</strong> investor rata-rata <em>kehilangan</em> 2&ndash;4%/tahun dari <em>behavior gap</em>!</p>
<p>(e) <strong>Laporan jujur:</strong> (1) <strong>TWR &amp; MWR</strong> <em>berdampingan</em> (jelaskan bedanya!); (2) <strong>vs benchmark</strong> (<em>risk-adjusted</em>!); (3) <strong>atribusi</strong> (dari mana?); (4) <strong>neto</strong> (setelah <em>semua</em> biaya!); (5) <strong>GIPS</strong> (terverifikasi?). <strong>Laporan 1 halaman yang <em>bertanya</em>, bukan <em>pamer</em>.</strong></p>
<p>(b) <strong>Behavior gap investor</strong> (FOMO di puncak) — tapi manajer ikut 'bersalah' jika marketing hanya pamer +40% tanpa konteks risiko.</p>
<p>(c) <strong>IPS + rebalancing</strong> (cuan 2021 → rebalance, bukan tambah!); <strong>edukasi MWR</strong>; <strong>aturan kontribusi otomatis</strong> (DCA) bukan FOMO.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Ukuran Lanjut</h2>
      <h3>1. Information Ratio &mdash; <em>alpha</em> per <em>tracking error</em></h3>
      <p><strong>IR = <em>active return</em> / <em>tracking error</em>.</strong> IR 0,5 = <em>bagus</em>; 1,0 = <em>hebat</em>. <strong>Beda dengan Sharpe:</strong> Sharpe vs <em>kas</em>; IR vs <em>benchmark</em>. <strong>Untuk manajer aktif = IR</strong> yang relevan!</p>
      <h3>2. Drawdown &amp; Calmar &mdash; &ldquo;rasa sakit&rdquo;</h3>
      <p><strong>Max drawdown</strong> = kejatuhan puncak-ke-lembah <em>terburuk</em>. <strong>Calmar</strong> = return / max DD. <strong>Kenapa penting:</strong> klien <em>pergi</em> karena <em>drawdown</em>, bukan karena <em>volatilitas</em>! <strong>Lapor selalu:</strong> return + vol + <em>max DD</em>.</p>
      <h3>3. Peer universe &mdash; bahaya &ldquo;peringkat&rdquo;</h3>
      <p>&ldquo;Kuartil 1!&rdquo; &mdash; <strong>tanya:</strong> <em>universe</em>-nya siapa? (<em>survivorship</em>! <em>style</em> beda!). <strong>Universe <em>tidak</em> investable</strong> &rarr; peringkat = <em>hiburan</em>. <strong>Benchmark &gt; peer</strong> untuk evaluasi serius.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; TWR kilat</h3>
      <p>+40% lalu &minus;30%. TWR?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>1,4&times;0,7&minus;1 = <strong>&minus;2%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Behavior gap</h3>
      <p>TWR &minus;2%, MWR &minus;20%. Gap &amp; penyebab?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>18 poin</strong> &mdash; FOMO setor di puncak.</p>
      </details>
      <h3>Drill 3 &mdash; Atribusi kilat</h3>
      <p>Alokasi +1%, seleksi &minus;3%. Keputusan?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Pertahankan</strong> (alokasi bagus!); <strong>perbaiki</strong> seleksi.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Manajer return 25% (satu portofolio terbaik).&rdquo; Percaya?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>TIDAK.</strong> <em>Cherry-picking</em>! Tanya <em>komposit</em> GIPS.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Dana +40% lalu −30%. TWR?"}
  options={
    ["+10%",
    "−2%",
    "+5%",
    "−30%"]
  }
  correct={1}
  explanation={"Benar: 1,4×0,7−1 = −2%. Volatilitas = 'pajak' return (volatility drag!)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Investor setor 100, tambah 400 di puncak. IRR ≈ ?"}
  options={
    ["−2%",
    "−20%",
    "+10%",
    "0%"]
  }
  correct={1}
  explanation={"Benar: ≈ −20%, MOIC 0,7x. Timing buruk = behavior gap 18 poin!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Allocation positif, selection negatif konsisten. Artinya?"}
  options={
    ["Stock picker hebat",
    "Tukang tebak sektor — fee aktif tidak layak",
    "Manajer pasif",
    "Beruntung"]
  }
  correct={1}
  explanation={"Benar: skill-nya di bobot sektor, bukan pilih saham. Bayar murah atau ganti."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Factsheet '15%' tapi hanya 2 dari 10 dana ditampilkan. Ini?"}
  options={
    ["GIPS compliant",
    "Survivorship bias",
    "Net return",
    "Benchmark baik"]
  }
  correct={1}
  explanation={"Benar: dana gagal disembunyikan. Tuntut composite SEMUA portofolio discretionary."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Untuk evaluasi skill manajer murni, pakai?"}
  options={
    ["MWR",
    "TWR vs benchmark konsisten",
    "MOIC",
    "Return 1 bulan"]
  }
  correct={1}
  explanation={"Benar: TWR menghilangkan efek timing arus kas investor. MWR untuk pengalaman investor."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. TWR −2%, MWR −20%. Apa 'behavior gap' & tindakan untuk investor?"}
  options={
    ["18 poin — manajer buruk, ganti manajer",
    "18 poin — investor FOMO; solusi: DCA otomatis + IPS + jangan sering cek",
    "Tidak ada gap — keduanya sama",
    "Manajer hebat — pertahankan"]}
  correct={1}
  explanation={"Benar: gap 18 poin murni dari timing setoran (FOMO 400 di puncak). Manajer 'hanya' −2%. Solusi: DCA otomatis, IPS, dan disiplin perilaku — musuh terbesar adalah diri sendiri."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>TWR</strong> (manajer) vs <strong>MWR/IRR</strong> (investor) vs <strong>MOIC</strong>.</li>
<li><strong>Behavior gap</strong>: timing investor bisa −2–4%/tahun.</li>
<li><strong>Brinson</strong>: allocation + selection + interaction.</li>
<li><strong>Benchmark</strong>: ditetapkan di muka, investable, konsisten.</li>
<li><strong>GIPS</strong>: composite penuh, gross &amp; net, verifikasi.</li>
<li><strong>Aturan</strong>: iklan ≠ bukti; tampilkan dua angka.</li>

<li><strong>TWR/MWR:</strong> pisahkan skill vs perilaku; gap = FOMO.</li>
<li><strong>Atribusi:</strong> alokasi + seleksi; diagnosis sebelum keputusan.</li>
<li><strong>GIPS:</strong> komposit, pengungkapan, verifikasi; anti cherry-picking.</li>
<li><strong>Kapan TIDAK pakai:</strong> angka tanpa konteks; MWR untuk manajer; percaya iklan buta.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c4-portfolio-construction" className="btn btn-secondary btn-sm">← PM-C4</Link>
        <Link href="/learn/pm-c6-behavioral" className="btn btn-primary btn-sm">PM-C6 →</Link>
      </div>
    </div>
  );
}

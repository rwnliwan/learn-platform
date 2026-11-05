"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC4PortfolioConstructionPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C4 — Portfolio Management</span>
        <h1 className="display-title">Portfolio Construction:<br/>Optimisasi & Rebalancing</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Portofolio yang 'Berjalan Sendiri'</a></li>
<li><a href="#optimisasi">Optimisasi + Constraints</a></li>
<li><a href="#riskbudget">Risk Budgeting</a></li>
<li><a href="#rebalancing">Rebalancing & Drift</a></li>
<li><a href="#sintesis">Sintesis: Angka ke Disiplin</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Yayasan 78/22</a></li>
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
<li>Menjelaskan optimisasi mean-variance dengan constraints realistis.</li>
<li>Menghitung risk contribution dan menjelaskan risk parity.</li>
<li>Membedakan calendar vs tolerance-band rebalancing.</li>
<li>Menjelaskan trade-off rebalancing: disiplin vs biaya.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Portofolio yang 'Berjalan Sendiri'</h2>
      <div className="story">
        <p><strong>Yayasan</strong> menetapkan SAA <strong>60/40</strong> (2020). Tidak pernah rebalance. <strong>2024</strong>: saham bull run → portofolio jadi <strong>78/22</strong>. Lalu koreksi <strong>−15%</strong> — kerugian <strong>Rp2,7M lebih besar</strong> dari jika tetap 60/40.</p>
<p>Twist-nya: <strong>tidak ada yang 'salah beli'</strong> — portofolio <em>berjalan sendiri</em> (drift) keluar dari IPS. <strong>Drift = keputusan pasif</strong> untuk mengambil risiko lebih. Rebalancing bukan 'trading' — melainkan <strong>kembali ke janji</strong>. Lesson ini: disiplin konstruksi.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="optimisasi">Optimisasi — Matematika Bertemu Realita</h2>
<p><strong>Definisi.</strong> <strong>Mean-variance</strong>: max return per risiko (PM-C3). <strong>Constraints praktis</strong>: <em>long-only</em> (w ≥ 0), <em>max position</em> (w ≤ 10%), <em>turnover</em> (≤ 20%/thn), <em>tracking error</em> (≤ 3%), <em>sektor</em>, <em>ESG</em>. <strong>Black-Litterman</strong> (pratinjau PM-D2): campur <em>market equilibrium</em> + <em>view</em> analis.</p>
<p><strong>Masalah</strong>: optimisasi <strong>sensitif ke input</strong> (error maximization!) → constraints = <strong>penjinak</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Optimisasi tanpa constraints seperti <strong>GPS tanpa rambu</strong>: rute 'tercepat' bisa lewat gang sempit &amp; jembatan rusak (portofolio ekstrem 95% satu aset). Constraints = <strong>rambu &amp; batas kecepatan</strong> — sedikit lebih lambat, jauh lebih selamat.</p>
<p><strong>Kapan dipakai:</strong> Konstruksi: selalu dengan constraints; waspadai error maximization.</p>
<p><strong>Pendalaman intuisi &mdash; optimisasi = &ldquo;mesin pengubah asumsi jadi alokasi&rdquo;.</strong> Masukkan <em>expected return</em>, <em>vol</em>, <em>korelasi</em> &rarr; keluar alokasi &ldquo;optimal&rdquo;. <strong>Masalah:</strong> <em>garbage in, gospel out</em> &mdash; optimisasi <strong>memperbesar <em>kesalahan estimasi</em></strong>! (<em>Error maximization</em>: ia memberi bobot <em>terbesar</em> ke aset dengan return <em>overestimate</em>!). <strong>Solusi:</strong> <em>shrinkage</em>, <em>Black-Litterman</em> (campur <em>market equilibrium</em> + pandangan!), <em>constraint</em> (batas bobot!). <strong>Optimisasi tanpa kerendahan hati = <em>presisi palsu</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Error maximization (klik untuk buka)</summary>
<p>Input: saham A E(R) 10,1%, B 10,0% (estimasi ±2%!). Optimisasi unconstrained → <strong>95% A, 5% B</strong> (kejar 0,1%!).</p>
<p><strong>Realita</strong>: 0,1% = noise. Dengan <strong>max 60%</strong>: 60/40 — robust.</p>
<p><strong>Pelajaran</strong>: optimisasi = <strong>error maximizer</strong> (Michaud). Constraints + <strong>resampling</strong> = obat. Jangan percaya bobot 2 desimal!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Error maximization &mdash; jebakan optimisasi</summary>
<p><strong>Soal:</strong> dua aset. Estimasi: A return 8%, B 7%. <em>Sebenarnya</em>: A 6%, B 7% (A <em>overestimate</em>!). Apa yang dilakukan optimizer?</p>
<p><strong>Optimizer:</strong> memberi bobot <strong>besar ke A</strong> (return &ldquo;lebih tinggi&rdquo;!) &rarr; portofolio <strong>terkonsentrasi di aset yang <em>salah estimasi</em></strong>!</p>
<p><strong>Hasil:</strong> return aktual <strong>lebih buruk</strong> dari <em>equal-weight</em> sederhana! <strong>Pelajaran:</strong> optimisasi = <strong><em>error maximizer</em></strong> &mdash; ia <em>mengeksploitasi</em> kesalahan estimasimu. <strong>Solusi:</strong> <em>shrinkage</em> (tarik estimasi ke rata-rata!), <em>constraint</em> (bobot maks 30%!), <em>Black-Litterman</em>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Black-Litterman &mdash; intuisi</summary>
<p><strong>Soal:</strong> pasar (equilibrium) bilang saham 6%. Kamu yakin 8% (keyakinan 70%). Berapa <em>input</em> optimisasi?</p>
<p><strong>BL:</strong> campur &rarr; &asymp; 6% + 0,7&times;(8%&minus;6%) = <strong>7,4%</strong> (bukan 8% penuh!).</p>
<p><strong>Intuisi:</strong> BL = <strong><em>Bayesian</em></strong>: mulai dari <em>pasar</em> (prior!), sesuaikan dengan <em>pandanganmu</em> (proporsional keyakinan!). <strong>Keunggulan:</strong> (1) <em>stabil</em> (tidak ekstrem!); (2) <em>intuitif</em> (pandangan kuat = pengaruh besar); (3) <em>konsisten</em> (tanpa pandangan = pasar!). <strong>BL = <em>kerendahan hati</em> yang diformalkan.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Optimizer bilang...&rdquo;.</strong> Optimizer = <strong><em>error maximizer</em></strong>! Hasil &ldquo;optimal&rdquo; dari input mentah = <strong>terkonsentrasi di kesalahan estimasi</strong>. Soal yang memberi output optimizer tanpa <em>constraint/shrinkage</em> &amp; bertanya apakah &ldquo;optimal&rdquo; &rarr; <strong>jawab: tidak robust; butuh BL/constraint.</strong></p>
</div>

<PlotlyChart
  data={[{x: ["Saham (60% modal)", "Obligasi (40% modal)"], y: [60, 40], type: "bar", marker: {color: "#2a7de1"}, name: "Alokasi modal (%)"}, {x: ["Saham", "Obligasi"], y: [92, 8], type: "bar", marker: {color: "#d62728"}, name: "Kontribusi risiko (%)"}]}
  title={"60/40: modal vs risiko — 92% risiko dari saham!"}
  layout={{xaxis: {title: ""}, yaxis: {title: "%"}, showlegend: true, barmode: "group"}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua grup = alokasi <em>modal</em> (biru) vs <em>kontribusi risiko</em> (merah).</p>
<p><strong>Interpretasi:</strong> <strong>92% risiko dari saham!</strong> &mdash; padahal &ldquo;hanya&rdquo; 60% modal. Inilah <em>inti</em> risk budgeting: <strong>yang kamu alokasikan (modal) &ne; yang kamu dapatkan (risiko)</strong>. Jika ini mengagetkanmu &rarr; <strong>hitung untuk portofoliomu <em>sekarang</em></strong>.</p>
</div>
<h2 id="riskbudget">Risk Budgeting — Anggaran Risiko</h2>
<p><strong>Definisi.</strong> <strong>Risk contribution</strong>: RC_i = w_i × ∂σ_p/∂w_i (marginal × bobot). <strong>Risk budgeting</strong>: alokasikan <em>risiko</em> (mis. ekuitas 70%, kredit 20%, rates 10%). <strong>Risk parity</strong>: RC sama semua → bobot ∝ 1/σ (kasus khusus).</p>
<p><strong>Keunggulan</strong>: stabil (risiko lebih persisten dari return!), diversifikasi sejati.</p>
<Tex math={String.raw`RC_i = w_i \frac{\partial \sigma_p}{\partial w_i} \quad;\quad \sum RC_i = \sigma_p`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`RC_i`} />: kontribusi risiko aset i</li>
<li>Risk parity: <Tex math={String.raw`RC_1 = RC_2 = ...`} /></li>
<li>Untuk 2 aset tak berkorelasi: <Tex math={String.raw`w_i \propto 1/\sigma_i`} /></li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Risk budgeting seperti <strong>anggaran belanja</strong>: bukan 'beli apa' (bobot), tapi 'risiko apa' yang dibeli. Risk parity = <strong>semua anak dapat uang jajan sama</strong> (risiko), bukan barang sama (bobot).</p>
<p><strong>Kapan dipakai:</strong> Alokasi institusi; saat return forecast tidak dipercaya.</p>
<p><strong>Pendalaman intuisi &mdash; risk budgeting = &ldquo;alokasi risiko, bukan modal&rdquo;.</strong> 60/40 = <strong>90% risiko dari saham!</strong> <em>Risk budgeting</em>: alokasikan <em>kontribusi risiko</em> (mis. saham 60% risiko, obligasi 40%) &rarr; bobot modal <em>mengikuti</em>. <strong>Risk parity</strong> = kasus khusus (risiko <em>sama rata</em>). <strong>Kegunaan:</strong> memastikan <em>tidak ada</em> aset yang <em>diam-diam</em> mendominasi risiko. <strong>Uji 30 detik:</strong> hitung <em>kontribusi risiko</em> tiap aset &mdash; kaget? &rarr; <em>rebalance risiko</em>!</p><details className="worked">
<summary>📐 Contoh: RC 60/40 (klik untuk buka)</summary>
<p>Saham σ 18%, obligasi σ 6%, ρ 0,2, 60/40. σ_p = 11,5%.</p>
<p><strong>RC saham</strong> ≈ 10,1% (88%), <strong>RC obligasi</strong> ≈ 1,4% (12%).</p>
<p><strong>Risk parity</strong>: w_saham = (1/18)/(1/18+1/6) = <strong>25%</strong> → RC 50/50. Untuk <em>risiko</em> yang sama, return lebih rendah — <strong>tukar return dengan ketahanan</strong> (atau leverage <em>sehat</em>!).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Kontribusi risiko &mdash; hitung</summary>
<p><strong>Soal:</strong> 60/40, vol saham 18%, obligasi 6%, korelasi 0,2, vol portofolio 11,5%. Kontribusi risiko saham?</p>
<p><strong>Langkah 1:</strong> kontribusi = w &times; (&Sigma;w)&sigma; / &sigma;_p. Kovarians saham-portofolio = 0,6&times;0,18&sup2; + 0,4&times;0,2&times;0,18&times;0,06 = 0,0194 + 0,0009 = 0,0203.</p>
<p><strong>Langkah 2:</strong> kontribusi saham = 0,6 &times; 0,0203 / 0,115 = <strong>10,6%</strong> (dari 11,5%!).</p>
<p><strong>Hasil: 92% risiko dari saham!</strong> &mdash; padahal &ldquo;hanya&rdquo; 60% modal. <strong>Untuk risk parity</strong> (50/50 risiko) &rarr; butuh saham &asymp; 25&ndash;30% saja! <strong>Angka ini = <em>wake-up call</em> untuk semua 60/40.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Risk parity &mdash; pro &amp; kontra</summary>
<p><strong>Soal:</strong> bandingkan 60/40 vs risk parity (risiko 50/50) untuk klien konservatif.</p>
<p><strong>Pro RP:</strong> (1) <strong>diversifikasi sejati</strong> (tidak didominasi saham!); (2) <strong><em>drawdown</em> lebih kecil</strong> (2008: RP &minus;15% vs 60/40 &minus;25%!); (3) <strong>konsisten</strong> di berbagai rezim.</p>
<p><strong>Kontra RP:</strong> (1) <strong>butuh <em>leverage</em></strong> untuk return target (risiko! biaya!); (2) <strong><em>bond-heavy</em></strong> &rarr; menderita saat suku bunga <em>naik</em> (2022!); (3) <strong>kompleks</strong> (bukan untuk pemula!).</p>
<p><strong>Putusan:</strong> <strong>konsep wajib dipahami</strong> (risiko &ne; modal!); <strong>implementasi = opsional</strong> (tergantung klien!).</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;60/40 = seimbang&rdquo;.</strong> <strong>SALAH.</strong> 60/40 = <strong>92% risiko dari saham</strong> = <em>tidak seimbang</em> dari sisi risiko! &ldquo;Seimbang&rdquo; modal &ne; &ldquo;seimbang&rdquo; risiko. Soal yang bertanya &ldquo;apakah 60/40 terdiversifikasi baik?&rdquo; &rarr; <strong>jawab: dari modal ya, dari risiko tidak.</strong></p>
</div>
<PlotlyChart
  data={[{x: ["Saham", "Obligasi"], y: [88, 12], type: "bar", marker: {color: "#2a7de1"}, name: "60/40"}, {x: ["Saham", "Obligasi"], y: [50, 50], type: "bar", marker: {color: "#16a34a"}, name: "risk parity"}]}
  title={"Kontribusi risiko: 60/40 vs risk parity (%)"}
  layout={{xaxis: {title: "Aset"}, yaxis: {title: "Kontribusi risiko (%)"}, barmode: "group", showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = 60/40 nominal; hijau = risk parity. Tinggi = % risiko total.</p>
<p><strong>Interpretasi:</strong> 60/40 <strong>terlihat</strong> seimbang, <strong>risikonya</strong> 88% saham. Risk parity menyamakan 50/50 — <strong>diversifikasi yang sebenarnya</strong>. Pilih: return maksimal (60/40) atau ketahanan maksimal (RP)?</p>
</div>
<h2 id="rebalancing">Rebalancing — Kembali ke Janji</h2>
<p><strong>Definisi.</strong> <strong>Drift</strong>: bobot menyimpang dari SAA karena return beda. <strong>Calendar</strong>: rebalance periodik (kuartalan/tahunan) — sederhana, bisa <em>terlambat</em>. <strong>Tolerance band</strong>: rebalance jika |w − target| &gt; band (mis. ±5%) — responsif, <em>trading lebih sering</em>.</p>
<p><strong>Trade-off</strong>: disiplin (tracking IPS) vs <strong>biaya</strong> (komisi, spread, pajak!). <strong>Monitoring</strong>: dashboard drift per kelas aset (job analis!).</p>
<p><strong>Kepribadian/intuisi:</strong> Rebalancing seperti <strong>spooring mobil</strong>: calendar = spooring tiap 10.000 km (terjadwal); tolerance band = spooring saat setir <em>menarik</em> (responsif). Tidak spooring = ban habis sebelah (risiko tak disadari).</p>
<p><strong>Kapan dipakai:</strong> Ongoing: monitor drift bulanan; rebalance by band + kalender.</p>
<p><strong>Pendalaman intuisi &mdash; konstruksi = &ldquo;dari teori ke rekening&rdquo;.</strong> SAA bilang 60/40 &mdash; tapi <em>implementasi</em>: ETF atau aktif? <em>Rebalance</em> kapan? <em>Pajak</em> di akun mana? <em>Biaya</em> berapa? <strong>Jurang teori-praktik</strong> = di sinilah return <em>hilang</em> (biaya! pajak! drift!). <strong>Portofolio terbaik = yang <em>diimplementasikan dengan disiplin</em></strong> &mdash; bukan yang <em>teorinya</em> paling canggih.</p><details className="worked">
<summary>📐 Contoh: Drift yayasan (klik untuk buka)</summary>
<p>60/40 → saham +40%, obligasi +5% setahun. Bobot baru: saham = 60×1,4/(60×1,4+40×1,05) = 84/126 = <strong>66,7%</strong>.</p>
<p><strong>Band ±5%</strong>: 66,7% &gt; 65% → <strong>rebalance</strong> (jual saham, beli obligasi).</p>
<p><strong>2024</strong>: tanpa rebalance 4 tahun → 78% → koreksi −15% = <strong>Rp2,7M ekstra rugi</strong>. Rebalancing = <strong>asuransi disiplin</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Implementasi &mdash; ETF vs aktif</summary>
<p><strong>Soal:</strong> SAA butuh eksposur saham AS. Pilihan: ETF (fee 0,03%) vs reksadana aktif (fee 1,2%, <em>alpha</em> historis 0,5%). Pilih?</p>
<p><strong>Matematika:</strong> aktif neto = 0,5% &minus; 1,2% = <strong>&minus;0,7%</strong> vs ETF &minus;0,03%. <strong>ETF menang 0,67%/tahun!</strong></p>
<p><strong>Aturan:</strong> pilih aktif <strong>hanya jika</strong> <em>alpha neto</em> (setelah fee!) <em>terbukti konsisten</em> (bukan 1 tahun!). <strong>Default = pasif murah.</strong> <strong>Biaya = <em>kepastian</em>; alpha = <em>harapan</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Total cost &mdash; yang tak terlihat</summary>
<p><strong>Soal:</strong> hitung <em>total cost</em>: fee 1%, turnover 100%/tahun, <em>spread</em> 0,2%, pajak 0,3%.</p>
<p><strong>Total:</strong> 1% + (100% &times; 0,2%) + 0,3% = <strong>1,5%/tahun!</strong></p>
<p><strong>Dampak 20 tahun:</strong> (1,015)^20 = <strong>1,35&times;</strong> &mdash; <strong>26% kekayaan hilang</strong> untuk biaya! <strong>Pelajaran:</strong> <em>total cost</em> (bukan cuma <em>fee</em>!) = yang dibandingkan. <strong>Tanya selalu: <em>berapa total</em> yang hilang per tahun?</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Dari Angka ke Disiplin</h2>
      <p>Optimisasi, risk budgeting, implementasi = <strong>satu alur</strong>:</p>
      <ol>
        <li><strong>HITUNG (optimisasi):</strong> dengan <em>kerendahan hati</em> (shrinkage! BL! constraint!).</li>
        <li><strong>SEIMBANGKAN (risk budget):</strong> alokasi <em>risiko</em>, bukan cuma modal.</li>
        <li><strong>JALANKAN (implementasi):</strong> murah, hemat pajak, <em>rebalance</em> disiplin.</li>
      </ol>
      <p><strong>Teori tanpa disiplin = <em>akademis</em>; disiplin tanpa teori = <em>acakan</em>.</strong> Keduanya.</p>

      <h3>🎙️ Debat: &ldquo;Optimisasi = sains&rdquo;</h3>
      <p><strong>Percaya:</strong> &ldquo;Markowitz = <em>Nobel</em>. Optimisasi = <em>sains</em> alokasi. Yang tidak optimisasi = <em>tebakan</em>.&rdquo;</p>
      <p><strong>Skeptis:</strong> &ldquo;<em>Error maximization</em>! Optimisasi = <strong><em>mesin presisi palsu</em></strong> yang mengubah <em>tebakan input</em> menjadi <em>keyakinan output</em>. 1/N (<em>equal weight</em>) sering <em>mengalahkan</em> optimisasi canggih (DeMiguel et al. 2009!).&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>optimisasi = <em>alat</em>, bukan <em>orakel</em>.</strong> Gunakan dengan <em>kerendahan hati</em> (shrinkage! BL! constraint!) &mdash; atau gunakan <em>heuristik robust</em> (1/N! risk parity!). <strong>Yang penting = <em>keputusan</em>, bukan <em>metode</em>.</strong></p>
      <h3>📊 Data Corner: 1/N vs optimisasi</h3>
      <p><strong>Data (DeMiguel et al.):</strong> 14 model optimisasi vs <em>naive</em> 1/N &mdash; <strong>tidak ada</strong> yang konsisten mengalahkan 1/N <em>out-of-sample</em>!</p>
      <p><strong>Cara membaca:</strong> <strong>bukan</strong> karena 1/N &ldquo;pintar&rdquo; &mdash; melainkan karena <em>kesalahan estimasi</em> membunuh optimisasi. <strong>Implikasi:</strong> <strong>sederhana &amp; robust &gt; canggih &amp; rapuh.</strong> Optimisasi = <em>hanya</em> jika input <em>berkualitas</em>.</p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Optimizer gila.</strong> Optimizer memberi: A 70%, B 20%, C 10%. Apa reaksi pertamamu? (Jawab: <strong>curiga!</strong> &mdash; <em>error maximization</em>? Cek: apakah A <em>overestimate</em>? Terapkan <em>constraint</em> maks 40% &amp; lihat perubahannya.)</p>
      <p><strong>(2) Risiko tersembunyi.</strong> Portofoliomu 70/30. Hitung <em>kontribusi risiko</em> saham. (Jawab: &asymp; <strong>93&ndash;95%</strong>! &mdash; <em>lebih parah</em> dari 60/40. <strong>Apakah ini yang kamu <em>maksud</em>?</strong>)</p>
      <p><strong>(3) Biaya total.</strong> Hitung <em>total cost</em> portofoliomu: fee + turnover&times;spread + pajak. (Jawab: kaget? <strong>1,5&ndash;2%/tahun = 30&ndash;40% kekayaan 20 tahun!</strong>)</p>
      <h3>📰 Studi Kasus: &ldquo;Portofolio Optimal&rdquo; yang Hancur (2007)</h3>
      <p>Fund kuantitatif: optimizer &ldquo;optimal&rdquo; dari data 2003&ndash;06 (tenang!). Alokasi: <em>terkonsentrasi</em> di <em>mortgage-backed</em> (&ldquo;return tinggi, vol rendah&rdquo;!). 2007: <em>quant meltdown</em> &mdash; semua model <em>seragam</em> &rarr; <em>crowded unwind</em> &rarr; <strong>&minus;30% sebulan</strong>.</p>
      <p><strong>Pelajaran:</strong> (1) <strong>optimisasi dari data tenang = <em>rapuh</em></strong>; (2) <strong>konsentrasi = <em>bom</em></strong> (<em>constraint</em>!); (3) <strong><em>crowded</em> = risiko sistemik</strong> (semua &ldquo;optimal&rdquo; = semua sama!). <strong>Robust &gt; optimal.</strong></p>
      <h3>📊 Data Corner: Biaya vs alpha</h3>
      <p><strong>Data:</strong> rata-rata <em>alpha</em> manajer aktif: +0,3%/tahun. Rata-rata <em>fee</em>: 1,1%/tahun.</p>
      <p><strong>Matematika:</strong> 0,3 &minus; 1,1 = <strong>&minus;0,8%/tahun</strong> (neto!). <strong>Kesimpulan:</strong> <em>rata-rata</em> manajer aktif <strong>menghancurkan nilai</strong> <em>setelah biaya</em>. <strong>Pengecualian:</strong> <em>top quartile</em> konsisten (sulit diidentifikasi <em>ex-ante</em>!). <strong>Default = pasif.</strong></p>
      <h3>🏗️ Merancang Portofolio dari Nol (Studi Kasus Lengkap)</h3>
      <p><strong>Klien:</strong> 40 tahun, pensiun 60, dana Rp2M, toleransi moderat, <em>taxable account</em>.</p>
      <p><strong>Langkah 1 &mdash; IPS:</strong> return 7% neto, vol &lt; 13%, horizon 20 tahun.</p>
      <p><strong>Langkah 2 &mdash; CME:</strong> saham 8% (&sigma;18%), obligasi 4% (&sigma;6%), korel 0,2.</p>
      <p><strong>Langkah 3 &mdash; SAA:</strong> 65/35 &rarr; return 6,6%, vol 12,3% (&check;).</p>
      <p><strong>Langkah 4 &mdash; Risk check:</strong> kontribusi risiko saham &asymp; 90% &rarr; <strong>disadari &amp; diterima</strong> (didokumentasikan!).</p>
      <p><strong>Langkah 5 &mdash; Implementasi:</strong> ETF saham (0,05%) + ETF obligasi (0,07%) &rarr; <em>total cost</em> &asymp; 0,1%.</p>
      <p><strong>Langkah 6 &mdash; Rebalance:</strong> band &plusmn;5%, via <em>arus kas baru</em> (hemat pajak!).</p>
      <p><strong>Hasil:</strong> portofolio <strong>sederhana, murah, disiplin</strong> &mdash; mengalahkan 80% &ldquo;canggih&rdquo; yang mahal &amp; tidak disiplin. <strong>Konstruksi terbaik = yang <em>dijalankan</em>.</strong></p>
      <h3>📊 Data Corner: Korelasi Krisis</h3>
      <p><strong>Data:</strong> korelasi saham-obligasi: normal &asymp; 0,2; 2008 &asymp; &minus;0,3 (obligasi <em>naik</em> saat saham jatuh!); 2022 &asymp; +0,5 (<em>keduanya</em> jatuh!).</p>
      <p><strong>Cara membaca:</strong> <strong>korelasi <em>tidak stabil</em>!</strong> 2008: obligasi = <em>pelindung</em>. 2022: obligasi = <em>korban</em> juga (inflasi!). <strong>Implikasi konstruksi:</strong> <strong>jangan andalkan <em>satu</em> korelasi</strong> &mdash; stres dengan korelasi <em>berbeda</em>! Dan: <strong>diversifikasi <em>sejati</em></strong> butuh aset yang <em>struktural</em> berbeda (kas! emas? <em>trend-following</em>?).</p>
      <p><strong>Aturan:</strong> uji portofolio di <strong>3 rezim</strong>: (1) <em>deflasi</em> (2008!), (2) <em>inflasi</em> (2022!), (3) <em>normal</em>. <strong>Jika hanya selamat di (3) &rarr; belum selesai.</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;Kompleksitas = kecanggihan&rdquo;</h3>
      <p><strong>Kompleks:</strong> &ldquo;Portofolio 15 aset + <em>overlay</em> derivatif + <em>faktor tilt</em> = <em>canggih</em> &amp; optimal.&rdquo;</p>
      <p><strong>Sederhana:</strong> &ldquo;15 aset = 15 <em>estimasi</em> = 15 <em>kesalahan</em>! <strong>3 ETF + rebalance &gt; 15 aset + <em>overfit</em>.</strong> Buffett: &lsquo;<em>wide diversification is only required when investors do not understand what they are doing</em>.&rsquo;&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>kompleksitas = <em>biaya</em></strong> (estimasi! monitoring! pajak!). <strong>Tambah kompleksitas <em>hanya</em> jika manfaat <em>terbukti</em> &gt; biaya.</strong> <em>Default</em> = sederhana.</p>
      <h3>🔬 Deep Dive Tambahan: Estimasi yang Jujur</h3>
      <p><strong>Masalah inti optimisasi:</strong> <em>expected return</em> = <strong>estimasi tersulit</strong> (noise &gt; sinyal!). <strong>Vol &amp; korelasi</strong> = lebih stabil (tapi <em>berubah</em> saat krisis!). <strong>Hierarki keyakinan:</strong> vol &gt; korelasi &gt;&gt; return.</p>
      <p><strong>Teknik <em>shrinkage</em>:</strong> tarik estimasi ekstrem ke <em>rata-rata</em> (mis. return 15% &rarr; 9%!). <strong>Intuisi:</strong> estimasi ekstrem = <em>kemungkinan besar</em> salah (noise!). <strong>James-Stein:</strong> <em>shrinkage</em> <strong>terbukti</strong> mengurangi <em>error</em> (teori statistik!). Praktis: <strong>jangan percaya angka &ldquo;15%&rdquo;</strong> &mdash; <em>shrink</em> ke 8&ndash;10%.</p>
      <p><strong><em>Black-Litterman</em> mendalam:</strong> <em>prior</em> = <em>equilibrium pasar</em> (<em>reverse optimization</em>: bobot pasar &rarr; return <em>tersirat</em>!). <strong>Contoh:</strong> pasar 60/40 &rarr; return tersirat saham &asymp; 6&ndash;7% (bukan 10%!). <strong>Pandangan:</strong> &ldquo;saham 8%&rdquo; (keyakinan 60%) &rarr; BL &asymp; 6,8%. <strong>Hasil:</strong> alokasi <em>stabil</em> &amp; <em>intuitif</em> &mdash; <strong>tidak ada</strong> lompatan ekstrem!</p>
      <p><strong><em>Constraint</em> praktis:</strong> bobot maks 30% per aset; <em>turnover</em> maks 50%/tahun; <em>tracking error</em> maks 3%. <strong>Kenapa:</strong> <em>mencegah</em> optimizer &ldquo;gila&rdquo;. <strong>Constraint = <em>kebijaksanaan</em> yang dikodekan.</strong></p>
      <p><strong>Kesimpulan:</strong> optimisasi <strong>tanpa</strong> <em>shrinkage</em>/BL/<em>constraint</em> = <strong><em>mainan berbahaya</em></strong>. Dengan ketiganya = <strong><em>alat berguna</em></strong>. <strong>Bedanya = <em>kerendahan hati</em>.</strong></p>
      <h3>✅ Final Checklist: Sebelum Eksekusi</h3>
      <p><strong>INPUT:</strong> (1) CME <em>terdokumentasi</em>? (2) <em>Shrinkage</em>/BL diterapkan? (3) <em>Stress</em> 3 rezim?</p>
      <p><strong>ALOKASI:</strong> (4) <em>Constraint</em> bobot? (5) Kontribusi risiko <em>disadari</em>? (6) <em>Sesuai</em> IPS?</p>
      <p><strong>IMPLEMENTASI:</strong> (7) <em>Total cost</em> &lt; 1%? (8) <em>Tax-efficient</em>? (9) <em>Rebalance rule</em> tertulis?</p>
      <p><strong>GOVERNANCE:</strong> (10) <em>Dashboard drift</em>? (11) Review <em>terjadwal</em>? (12) <em>Audit</em> tahunan?</p>
      <p><strong>12 cek. Jika ada yang &ldquo;tidak&rdquo; &rarr; <em>jangan eksekusi</em>.</strong> Konstruksi = <em>disiplin</em>, bukan <em>kecerdasan</em>.</p>
      <h3>🎓 Ujian Akhir Lesson (Refleksi)</h3>
      <p><strong>Pertanyaan 1:</strong> Optimizer memberi 80% ke satu aset. <em>Tindakanmu</em>?</p>
      <p><strong>Pertanyaan 2:</strong> 60/40: berapa % <em>risiko</em> dari saham? <em>Implikasinya</em>?</p>
      <p><strong>Pertanyaan 3:</strong> Yayasan drift 60/40 &rarr; 78/22. <em>Rugi ekstra</em> saat &minus;15%? <em>Sistem</em> pencegah?</p>
      <p><strong>Jika bisa jawab ketiganya tanpa melihat catatan &rarr; <em>lulus</em>.</strong></p>
      <h3>💡 Prinsip Abadi Konstruksi</h3>
      <p><strong>(1) <em>Robust</em> &gt; optimal.</strong> (2) <strong>Risiko &ne; modal.</strong> (3) <strong>Biaya = kepastian.</strong> (4) <strong>Disiplin &gt; kecerdasan.</strong> (5) <strong>Sederhana &gt; kompleks</strong> (kecuali terbukti).</p>
      <p><strong>Lima prinsip. Tempel di dinding. Baca sebelum setiap keputusan alokasi.</strong></p>
      <h3>📖 Esai: Konstruksi yang Disiplin</h3>
      <p><strong><em>Konstruksi</em></strong> = <strong><em>implementasi</em></strong>. <strong><em>Implementasi</em></strong> = <strong><em>disiplin</em></strong>. <strong><em>Disiplin</em></strong> = <strong><em>hasil</em></strong>.</p>
      <p><strong><em>Ikuti</em></strong> <em>proses</em>.</p>
      <p><strong><em>Konstruksi</em></strong> <strong><em>disiplin</em></strong> = <strong><em>hasil</em></strong>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Optimisasi memberi bobot 'optimal' — ikuti persis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Error maximization</strong>: input ±2% → output 95/5 yang absurd. Bobot 2 desimal = <strong>presisi palsu</strong>. Pakai constraints + resampling + <strong>common sense</strong> (round ke 5%). Optimisasi = <em>alat berpikir</em>, bukan mesin jawaban.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Rebalancing = market timing yang merugikan (biaya + pajak).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Tidak rebalance = keputusan pasif</strong> untuk drift (risiko naik diam-diam). Biaya rebalance <em>terukur</em>; biaya drift <em>tersembunyi</em> (Yayasan: Rp2,7M!). <strong>Optimalkan frekuensi</strong> (band + pajak-aware), bukan meniadakan.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Optimisasi = jawaban.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> optimisasi = <strong><em>kalkulator</em></strong> &mdash; kualitas = kualitas <em>input</em>. <em>Garbage in, gospel out</em>. <strong>80% pekerjaan = <em>estimasi input</em> yang jujur</strong> (CME! shrinkage!); 20% = optimisasi. Yang terbalik = <em>presisi palsu</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Konstruksi sekali, selesai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> portofolio = <strong><em>makhluk hidup</em></strong> (drift! biaya! pajak! life event!). <strong>Tanpa <em>monitoring</em> &amp; <em>rebalance</em> = fondasi yang dibiarkan lapuk.</strong> Konstruksi = <em>awal</em>, bukan <em>akhir</em>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Monitor drift seperti monitor kesehatan.</strong> Dashboard bulanan: bobot aktual vs target per kelas aset + flag breach. Ini <strong>pekerjaan analis portofolio</strong> sehari-hari (job relevance!).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Rebalance dengan arus kas.</strong> Kontribusi baru → ke aset <em>underweight</em>; penarikan → dari <em>overweight</em>. Rebalancing <strong>tanpa biaya transaksi</strong>!</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist konstruksi (10 menit):</strong> (1) <strong>Input jujur?</strong> (CME + shrinkage!); (2) <strong>Constraint?</strong> (bobot maks!); (3) <strong>Risiko seimbang?</strong> (kontribusi risiko!); (4) <strong>Biaya total?</strong> (&lt; 1%!); (5) <strong>Rebalance rule?</strong> (tertulis!). <strong>Lima cek sebelum <em>eksekusi</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Risk Contribution</h2>
<p>Hitung kontribusi risiko tiap aset dan bandingkan dengan risk parity.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Risk Contribution"}
  hint={"Ubah bobot saham 0.6 → 0.25. RC jadi 50/50 — risk parity!"}
  defaultCode={"# Risk contribution 2 aset\nimport math\nW_S = 0.6   # bobot saham (ubah!)\nSIG_S, SIG_B, RHO = 0.18, 0.06, 0.2\nw_b = 1 - W_S\n\nvar_p = W_S**2*SIG_S**2 + w_b**2*SIG_B**2 + 2*W_S*w_b*RHO*SIG_S*SIG_B\nsig_p = math.sqrt(var_p)\n# marginal contribution\nmrc_s = (W_S*SIG_S**2 + w_b*RHO*SIG_S*SIG_B)/sig_p\nmrc_b = (w_b*SIG_B**2 + W_S*RHO*SIG_S*SIG_B)/sig_p\nrc_s, rc_b = W_S*mrc_s, w_b*mrc_b\n\nprint(f\"Vol portofolio: {sig_p:.1%}\")\nprint(f\"RC saham   : {rc_s/sig_p:.0%} (bobot {W_S:.0%})\")\nprint(f\"RC obligasi: {rc_b/sig_p:.0%} (bobot {w_b:.0%})\")\nprint()\nprint(\"60/40 nominal -> ~88% risiko dari saham!\")\nprint(\"Risk parity: bobot saham ~25% -> RC 50/50.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator Rebalancing & Drift</h2>
<p>Simulasikan drift 5 tahun dengan & tanpa rebalancing (tolerance band).</p>
<PyodideLab
  title={"Lab 2 — Simulator Rebalancing"}
  hint={"Ubah BAND 0.05 → 0.10 (longgar). Rebalance lebih jarang — hemat biaya, toleransi drift lebih!"}
  defaultCode={"# Simulator drift & rebalancing (tolerance band)\nimport random\nrandom.seed(44)\nW_TARGET, BAND = 0.60, 0.05  # target & band (ubah BAND!)\nrets_s = [0.40, 0.15, -0.10, 0.25, 0.10]   # return saham 5 thn\nrets_b = [0.05, 0.04, 0.06, 0.03, 0.04]    # obligasi\n\ndef simulasi(pakai_band):\n    w, nilai, n_reb = W_TARGET, 100.0, 0\n    for rs, rb in zip(rets_s, rets_b):\n        w = w*(1+rs)/(w*(1+rs) + (1-w)*(1+rb))\n        nilai *= w*(1+rs) + (1-w)*(1+rb)\n        if pakai_band and abs(w - W_TARGET) > BAND:\n            w, n_reb = W_TARGET, n_reb + 1\n    return nilai, w, n_reb\n\nn1, w1, _ = simulasi(False)\nn2, w2, r2 = simulasi(True)\nprint(f\"Tanpa rebalance : nilai {n1:.1f}, bobot saham {w1:.0%} (DRIFT!)\")\nprint(f\"Dengan band {BAND:.0%}  : nilai {n2:.1f}, bobot {w2:.0%}, {r2}x rebalance\")\nprint(\"\\nDrift = keputusan pasif ambil risiko lebih.\")\nprint(\"Catatan: di bull market ini tanpa-rebalance MENANG nilai,\")\nprint(\"tapi dengan RISIKO 71% saham (langgar IPS!). Rebalancing\")\nprint(\"bukan untuk return maksimal, tapi risiko SESUAI JANJI.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Bobot optimisasi ekstrem (95/5) → <strong>Tambah constraints / curigai input</strong></h3>
<p><strong>Kenapa:</strong> Error maximization.</p>
<p><strong>Contoh nyata:</strong> Max 60% per aset.</p>
</div>
<div className="decision-card">
<h3>2. Return forecast tidak dipercaya → <strong>Risk parity / risk budgeting</strong></h3>
<p><strong>Kenapa:</strong> Risiko lebih persisten.</p>
<p><strong>Contoh nyata:</strong> Alokasi by 1/σ.</p>
</div>
<div className="decision-card">
<h3>3. Drift &gt; band → <strong>Rebalance</strong></h3>
<p><strong>Kenapa:</strong> Kembali ke IPS.</p>
<p><strong>Contoh nyata:</strong> 66,7% &gt; 65% → jual.</p>
</div>
<div className="decision-card">
<h3>4. Ada arus kas masuk/keluar → <strong>Rebalance via arus kas</strong></h3>
<p><strong>Kenapa:</strong> Tanpa biaya transaksi.</p>
<p><strong>Contoh nyata:</strong> Kontribusi ke underweight.</p>
</div>
<div className="decision-card">
<h3>5. Membangun portofolio → <strong>Input jujur + risiko seimbang + disiplin rebalance</strong></h3>
<p><strong>Kenapa:</strong> Optimizer = error maximizer; 92% risiko 60/40 = saham.</p>
<p><strong>Contoh nyata:</strong> Yayasan drift 60/40→78/22 = rugi ekstra Rp2,7M.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Constraints</strong> selalu di optimisasi.</li><li><strong>Round</strong> bobot (jangan 2 desimal).</li><li><strong>Monitor drift</strong> bulanan.</li><li><strong>Rebalance by band</strong> + arus kas.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Portofolio yang Berjalan Sendiri</h2>
<div className="callout">
<p>Yayasan: SAA 60/40 (2020), tanpa rebalance → 78/22 (2024) → koreksi −15% → rugi ekstra Rp2,7M.</p>
<p><strong>Vignette lanjutan.</strong> Yayasan: SAA 60/40 (2020), <em>tanpa rebalance</em> &rarr; 78/22 (2024) &rarr; koreksi &minus;15% &rarr; rugi ekstra Rp2,7M vs jika di-rebalance. Tidak ada <em>monitoring drift</em>, tidak ada <em>aturan rebalance</em> di IPS.</p>
<p><strong>Pertanyaan:</strong> (a) Hitung drift setelah tahun 1 (saham +40%, obligasi +5%). (b) Siapa &lsquo;bersalah&rsquo;? (c) Sistem agar tidak terulang? (d) Hitung <em>rugi ekstra</em> dari drift saat koreksi &minus;15%. (e) Rancang <em>governance</em> konstruksi portofolio.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>66,7%</strong> saham (60&times;1,4=84; 40&times;1,05=42; total 126; 84/126=66,7% &rarr; <em>breach</em> band &plusmn;5% &rarr; seharusnya rebalance tahun 1!).</p>
<p>(d) <strong>Dengan drift (78/22):</strong> rugi = 0,78&times;15% = <strong>11,7%</strong>. <strong>Tanpa drift (60/40):</strong> 0,6&times;15% = <strong>9%</strong>. <strong>Selisih: 2,7 poin = Rp2,7M</strong> (dari Rp100M!). <strong>Drift = <em>risiko gratis</em> yang tidak dibayar.</strong></p>
<p>(e) <strong>Governance:</strong> (1) <strong>IPS</strong> memuat <em>band</em> &amp; <em>aturan rebalance</em>; (2) <strong>dashboard drift</strong> bulanan (flag otomatis!); (3) <strong>komite investasi</strong> review kuartalan; (4) <strong><em>pre-trade check</em></strong> (apakah dalam SAA?); (5) <strong>audit tahunan</strong> (biaya! pajak! <em>tracking error</em>!). <strong>Tertulis, terpantau, terdisiplin.</strong></p>
<p>(b) <strong>Governance</strong>: tidak ada monitoring drift + tidak ada aturan rebalance. Drift = keputusan pasif.</p>
<p>(c) <strong>Dashboard drift bulanan</strong> (flag breach) + <strong>tolerance band ±5%</strong> tertulis di IPS + <strong>rebalance via arus kas</strong>. Analis portofolio = penjaga disiplin.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Optimisasi Lanjut</h2>
      <h3>1. Resampled efficiency &mdash; &ldquo;rata-rata dari banyak dunia&rdquo;</h3>
      <p>Michaud: <em>resample</em> return (Monte Carlo!) &rarr; optimisasi tiap sampel &rarr; <strong>rata-rata bobot</strong>. <strong>Hasil:</strong> lebih <em>stabil</em> &amp; <em>terdiversifikasi</em> dari optimisasi tunggal. <strong>Intuisi:</strong> mengakui <em>ketidakpastian estimasi</em> secara eksplisit. <strong>Kritik:</strong> masih butuh <em>asumsi distribusi</em> &mdash; bukan <em>obat mujarab</em>.</p>
      <h3>2. Liability-relative &mdash; optimisasi vs kewajiban</h3>
      <p>Dana pensiun: optimisasi <strong>bukan</strong> return-vs-vol, melainkan <strong><em>surplus</em>-vs-vol</strong> (aset <em>minus</em> kewajiban!). <strong>Aset &ldquo;aman&rdquo;</strong> = yang <em>berkorelasi</em> dengan kewajiban (obligasi panjang!), bukan kas! <strong>Paradigma beda = jawaban beda.</strong></p>
      <h3>3. Goals-based &mdash; &ldquo;bucket&rdquo; per tujuan</h3>
      <p>Bukan <em>satu</em> portofolio, melainkan <strong><em>bucket</em> per tujuan</strong> (dana darurat: konservatif; pensiun: agresif!). <strong>Pro:</strong> <em>intuitif</em> untuk klien; <em>behavioral</em> (tidak panik karena &ldquo;bucket pensiun&rdquo; masih 20 tahun!). <strong>Kontra:</strong> bisa <em>tidak efisien</em> secara total. <strong>Untuk klien ritel = <em>sangat</em> efektif.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Drift kilat</h3>
      <p>60/40. Saham +40%, obligasi +5%. % saham baru?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>84/126 = <strong>66,7%</strong> &rarr; <em>breach</em> band!</p>
      </details>
      <h3>Drill 2 &mdash; Kontribusi risiko</h3>
      <p>60/40: berapa % risiko dari saham (perkiraan)?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>&asymp; 90&ndash;92%</strong> &mdash; jauh dari 60%!</p>
      </details>
      <h3>Drill 3 &mdash; Error maximization</h3>
      <p>Optimizer memberi 80% ke satu aset. Masalah?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Error maximization!</strong> Butuh <em>constraint</em>/shrinkage/BL.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;60/40 = seimbang &amp; terdiversifikasi.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Separuh benar.</strong> Modal seimbang; <strong>risiko tidak</strong> (92% dari saham!).</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Optimisasi memberi 95% saham A (E(R) beda 0,1%). Sikap?"}
  options={
    ["Ikuti persis",
    "Curigai error maximization — tambah constraints",
    "Tambah lagi",
    "Abaikan"]
  }
  correct={1}
  explanation={"Benar: 0,1% = noise. Optimisasi memaksimalkan error input. Constraints + round ke 5%."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. 60/40, saham σ18%, obligasi σ6%, ρ0,2. RC saham?"}
  options={
    ["60%",
    "≈ 88%",
    "50%",
    "40%"]
  }
  correct={1}
  explanation={"Benar: risiko terkonsentrasi di saham. 'Seimbang' nominal ≠ seimbang risiko."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Risk parity 2 aset tak berkorelasi. Bobot?"}
  options={
    ["50/50",
    "∝ 1/σ (samakan RC)",
    "∝ σ",
    "100% saham"]
  }
  correct={1}
  explanation={"Benar: bobot berbanding terbalik volatilitas → RC sama. Untuk σ 18/6 → 25/75."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Drift ke 66,7%, band ±5% dari 60%. Tindakan?"}
  options={
    ["Biarkan",
    "Rebalance ke 60% (breach band)",
    "Tunggu 70%",
    "Jual semua"]
  }
  correct={1}
  explanation={"Benar: 66,7% &gt; 65% = breach. Rebalancing = kembali ke janji IPS."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Cara rebalance tanpa biaya transaksi?"}
  options={
    ["Tidak ada",
    "Via arus kas (kontribusi ke underweight)",
    "Pinjam dana",
    "Tunggu"]
  }
  correct={1}
  explanation={"Benar: arahkan kas masuk/keluar untuk mengoreksi bobot — rebalance gratis."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Yayasan 60/40 drift ke 78/22, lalu koreksi −15%. Rugi ekstra vs tetap 60/40?"}
  options={
    ["Tidak ada — pasar yang menentukan",
    "2,7 poin (Rp2,7M dari Rp100M) — drift = risiko diam-diam tanpa kompensasi",
    "Untung — drift meningkatkan return",
    "Tidak bisa dihitung"]}
  correct={1}
  explanation={"Benar: 78%×15%=11,7% vs 60%×15%=9%, selisih 2,7 poin. Drift mengambil risiko ekstra tanpa keputusan sadar dan tanpa kompensasi return. Rebalancing = manajemen risiko."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Optimisasi</strong>: powerful tapi error-maximizing; constraints wajib.</li>
<li><strong>Risk budgeting</strong>: alokasikan risiko (RC); risk parity = RC sama.</li>
<li><strong>Drift</strong>: bobot berjalan sendiri = keputusan pasif.</li>
<li><strong>Rebalancing</strong>: calendar vs tolerance band; via arus kas = gratis.</li>
<li><strong>Monitoring</strong>: dashboard drift = kerja analis.</li>
<li><strong>Aturan</strong>: jangan percaya bobot 2 desimal; disiplin &gt; presisi.</li>

<li><strong>Optimisasi:</strong> error maximizer; butuh shrinkage/BL/constraint.</li>
<li><strong>Risk budget:</strong> alokasi risiko &ne; modal; 60/40 = 92% saham.</li>
<li><strong>Implementasi:</strong> murah, hemat pajak, rebalance disiplin.</li>
<li><strong>Kapan TIDAK pakai:</strong> optimizer mentah; abaikan kontribusi risiko; biarkan drift.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c3-asset-allocation" className="btn btn-secondary btn-sm">← PM-C3</Link>
        <Link href="/learn/pm-c5-performance-evaluation" className="btn btn-primary btn-sm">PM-C5 →</Link>
      </div>
    </div>
  );
}

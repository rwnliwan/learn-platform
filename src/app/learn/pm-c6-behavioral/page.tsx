"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC6BehavioralPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C6 — Portfolio Management</span>
        <h1 className="display-title">Behavioral Finance:<br/>Musuh di Cermin</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Rp100 Juta yang 'Tidak Terasa'</a></li>
<li><a href="#kognitif">Bias Kognitif</a></li>
<li><a href="#emosional">Bias Emosional</a></li>
<li><a href="#mitigasi">Mitigasi</a></li>
<li><a href="#sintesis">Sintesis: Kelola Diri</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Bu Rina</a></li>
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
<li>Membedakan bias kognitif vs emosional dan contohnya.</li>
<li>Menjelaskan prospect theory dan loss aversion.</li>
<li>Mengidentifikasi bias dalam keputusan nyata.</li>
<li>Merancang mitigasi: proses, checklist, IPS.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Rp100 Juta yang 'Tidak Terasa'</h2>
      <div className="story">
        <p><strong>Bu Rina</strong> rugi <strong>Rp100jt</strong> di saham gorengan — <em>tetap pegang</em> ('nanti balik'). Di sisi lain, saham bagus untung <strong>Rp20jt</strong> — <em>langsung jual</em> ('amankan!'). Setahun kemudian: gorengan <strong>−80%</strong>, yang bagus <strong>+200%</strong>.</p>
<p>Twist-nya: <strong>keduanya keputusan emosional yang sama</strong> — <strong>disposition effect</strong>: jual pemenang terlalu cepat (takut rugi balik), pegang pecundang terlalu lama (takut akui salah). <strong>Otaknya bekerja persis terbalik</strong> dari yang menguntungkan. Lesson ini: mengenali musuh di cermin.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="kognitif">Bias Kognitif — Bug Perangkat Lunak</h2>
<p><strong>Definisi.</strong> <strong>Bias kognitif</strong> = error <em>penalaran</em> (bisa diperbaiki dengan informasi/proses): <em>anchoring</em> (terpaku angka pertama — 'dulu Rp10rb!'), <em>confirmation</em> (cari info yang setuju), <em>hindsight</em> ('sudah kuduga!'), <em>framing</em> (90% selamat vs 10% mati), <em>availability</em> (krisis terakhir = 'pasti terulang'), <em>representativeness</em> (saham bagus = perusahaan bagus).</p>
<p><strong>Obat</strong>: data, checklist, <em>devil's advocate</em>.</p>
<p><strong>Kepribadian/intuisi:</strong> Bias kognitif seperti <strong>bug software</strong>: bisa di-patch (data, proses). Anchoring = <strong>harga coret</strong> di mal (Rp1jt → Rp500rb terasa murah, padahal HPP Rp200rb!). Sadar = kebal separuh.</p>
<p><strong>Kapan dipakai:</strong> Analisis investasi: paksa cari <em>3 alasan tesis ini salah</em>.</p>
<p><strong>Pendalaman intuisi &mdash; prospect theory = &ldquo;rasa sakit &gt; rasa senang&rdquo;.</strong> Rugi Rp100jt <strong>terasa 2,25&times;</strong> lebih menyakitkan dari senangnya untung Rp100jt (&lambda; = 2,25!). <strong>Fungsi nilai:</strong> <em>cekung</em> saat untung (risk-averse &rarr; jual cepat!) &amp; <em>cembung</em> saat rugi (risk-seeking &rarr; pegang pecundang!). <strong>Hasil:</strong> <em>disposition effect</em> &mdash; jual pemenang terlalu cepat, pegang pecundang terlalu lama. <strong>Persis <em>kebalikan</em> dari &ldquo;potong rugi, biarkan untung&rdquo;!</strong></p><details className="worked">
<summary>📐 Contoh: Anchoring IHSG (klik untuk buka)</summary>
<p>IHSG 7.300 → turun ke 6.800. Investor: <em>'murah! dulu 7.300'</em> — <strong>anchor</strong> ke puncak.</p>
<p><strong>Cek valuasi</strong>: P/E 18 (masih di atas rata-rata 15!) → <strong>tidak murah</strong>, hanya 'lebih murah dari puncak'.</p>
<p><strong>Obat</strong>: ganti anchor → <strong>valuasi historis</strong> (P/E 10-tahunan), bukan harga terakhir. Harga = opini; valuasi = fakta.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Disposition effect &mdash; angka</summary>
<p><strong>Soal:</strong> beli A &amp; B @100. Setahun: A=150 (+50%), B=60 (&minus;40%). Investor jual A (&ldquo;amankan&rdquo;), pegang B (&ldquo;nanti balik&rdquo;). Tahun 2: A=300, B=20. Hitung &ldquo;biaya&rdquo; bias.</p>
<p><strong>Aktual:</strong> untung 50 (A) + rugi 40 (B, <em>unrealized</em>) = <strong>+10</strong>.</p>
<p><strong>Rasional</strong> (pegang A, jual B tahun 1): untung 200 (A) &minus; 40 (B) = <strong>+160</strong>.</p>
<p><strong>Biaya bias: 150!</strong> &mdash; dari <em>prospect theory</em> (cembung saat rugi! cekung saat untung!). <strong>Pelajaran:</strong> <strong>keputusan harus <em>forward-looking</em></strong> (prospek ke depan!), bukan <em>backward</em> (harga beli! <em>sunk cost</em>!).</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Anchoring &mdash; &ldquo;jangkar&rdquo; harga beli</summary>
<p><strong>Soal:</strong> beli @1000, kini 600. Analis bilang &ldquo;fundamental berubah, wajar 400&rdquo;. Investor: &ldquo;tunggu balik 1000&rdquo;. Bias apa &amp; biaya?</p>
<p><strong>Bias: <em>anchoring</em></strong> (jangkar = 1000!) + <em>loss aversion</em>.</p>
<p><strong>Biaya:</strong> jika benar ke 400 &rarr; rugi tambahan 200 dari <em>menunggu jangkar</em>! <strong>Harga beli = <em>sunk cost</em></strong> &mdash; <em>irrelevan</em> untuk keputusan kini! <strong>Pertanyaan benar:</strong> &ldquo;apakah akan beli di 600 <em>kini</em>?&rdquo; Jika <strong>tidak</strong> &rarr; <strong>jual</strong>! (<em>Tes cermin</em>!)</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Confirmation bias &mdash; &ldquo;riset&rdquo; yang membohongi</summary>
<p><strong>Soal:</strong> yakin saham X bagus. &ldquo;Riset&rdquo; 10 jam: 9 sumber <em>mendukung</em>, 1 <em>mengkritik</em> (diabaikan!). Apa yang terjadi?</p>
<p><strong><em>Confirmation bias</em>:</strong> mencari <em>mendukung</em>, mengabaikan <em>menentang</em> &rarr; keyakinan <em>naik</em> (padahal <em>bukti</em> campur!).</p>
<p><strong>Obat:</strong> <strong><em>devil's advocate</em></strong> (tulis <em>3 alasan</em> kamu <em>salah</em>!); <strong><em>pre-mortem</em></strong>; <strong>cari <em>kritikus</em></strong> (bukan <em>penggemar</em>!). <strong>Riset yang hanya <em>mengkonfirmasi</em> = <em>bukan riset</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Bias = bodoh&rdquo;.</strong> <strong>SALAH.</strong> Bias = <em>heuristik</em> yang <em>berguna</em> di savana, <em>berbahaya</em> di pasar. <strong>Semua orang</strong> punya bias (termasuk <em>profesor</em>!). Soal yang bertanya &ldquo;siapa yang bebas bias?&rdquo; &rarr; <strong>jawab: tidak ada; yang ada = yang <em>mengelola</em>.</strong></p>
</div>

<PlotlyChart
  data={[{x: [-100,-50,0,50,100], y: [-225,-75,0,50,75], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Prospect theory"}, {x: [-100,-50,0,50,100], y: [-100,-50,0,50,100], type: "scatter", mode: "lines", line: {dash: "dash", color: "#888"}, name: "Rasional"}]}
  title={"Prospect theory: rugi 2,25× lebih menyakitkan"}
  layout={{xaxis: {title: "Untung/Rugi (jt)"}, yaxis: {title: "Nilai psikologis"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = untung/rugi; sumbu Y = &ldquo;nilai&rdquo; psikologis. Merah = manusia; putus-putus = rasional.</p>
<p><strong>Interpretasi:</strong> <strong>Rugi 100 = &minus;225</strong> (2,25&times;!); untung 100 = +75. <strong>Asimetri brutal!</strong> Kurva <em>cekung</em> di kanan (jual cepat!) &amp; <em>cembung</em> di kiri (pegang rugi!). <strong>Inilah <em>mesin</em> di balik <em>disposition effect</em>.</strong> Sadari &rarr; <em>lawan</em> dengan sistem.</p>
</div>
<h2 id="emosional">Bias Emosional — Bug Perangkat Keras</h2>
<p><strong>Definisi.</strong> <strong>Bias emosional</strong> = dari <em>perasaan</em> (sulit 'diedukasi', harus <em>dikelola</em>): <em>loss aversion</em> (rugi 2x lebih sakit dari untung), <em>overconfidence</em> (90% supir merasa di atas rata-rata!), <em>regret aversion</em> (takut salah → tidak bertindak), <em>herding</em> (ikut kerumunan aman), <em>status quo</em>, <em>endowment</em> (barang sendiri terasa lebih mahal).</p>
<p><strong>Prospect theory</strong>: nilai = fungsi <strong>perubahan</strong> (bukan level), <strong>cembung untuk untung, cekung untuk rugi</strong> → risk-averse saat untung, <strong>risk-seeking saat rugi</strong> (pegang gorengan!).</p>
<Tex math={String.raw`v(x) = x^{\alpha}, \quad x \geq 0`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Untung: cekung (diminishing sensitivity) → cepat puas → jual</li>
</ul>
<Tex math={String.raw`v(x) = -\lambda(-x)^{\beta}, \quad x < 0`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Rugi: cembung → risk-seeking → pegang/tambah</li>
<li><Tex math={String.raw`\lambda \approx 2{,}25`} />: rugi 2,25x lebih sakit (loss aversion)</li>
<li><Tex math={String.raw`\alpha, \beta \approx 0{,}88`} />: diminishing sensitivity</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Loss aversion seperti <strong>lidah yang 2x lebih peka pahit</strong>: sesendok gula (untung Rp1jt) vs sesendok empedu (rugi Rp1jt) — pahitnya <em>jauh</em> lebih terasa. Evolusi: menghindari racun &gt; mengejar madu. Di pasar, 'racun' = volatilitas normal.</p>
<p><strong>Kapan dipakai:</strong> Keputusan jual/tahan: tanya 'beli baru di harga ini?' — jika tidak, jual.</p>
<p><strong>Pendalaman intuisi &mdash; overconfidence = &ldquo;90% yakin, 50% benar&rdquo;.</strong> Studi: analis 90% yakin &rarr; benar &asymp; 50%! (<em>miscalibration</em>!). <strong>Dampak:</strong> <em>overtrading</em> (biaya!), <em>under-diversification</em> (&ldquo;saya tahu yang terbaik&rdquo;!), <em>mengabaikan risiko</em>. <strong>Gender:</strong> pria <em>lebih</em> overconfident &rarr; trading 45% lebih sering &rarr; return <em>lebih rendah</em> 1%/tahun (Barber-Odean!). <strong>Obat:</strong> <em>track record</em> tertulis (bukti!), <em>base rate</em> (statistik, bukan feeling!), <em>devil's advocate</em>.</p><details className="worked">
<summary>📐 Contoh: Bu Rina di-cermin (klik untuk buka)</summary>
<p><strong>Pemenang +Rp20jt</strong> (cekung → cepat puas → <strong>jual</strong> ✓ emosional, ✗ finansial).</p>
<p><strong>Pecundang −Rp100jt</strong> (cembung → risk-seeking → <strong>pegang/tambah</strong> ✗✗).</p>
<p><strong>Tes cermin</strong>: 'Jika kas hari ini, beli gorengan ini di harga sekarang?' → <strong>Tidak</strong> → jual. <strong>Endowment effect</strong> membuatnya terasa 'milikku, spesial' — padahal pasar tidak peduli.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Loss aversion &mdash; &ldquo;asuransi&rdquo; yang mahal</summary>
<p><strong>Soal:</strong> portofolio 1M. Tawaran: (A) pasti rugi 50jt; (B) 50% rugi 120jt, 50% rugi 0. Pilih? <em>Rasional</em>?</p>
<p><strong>Kebanyakan pilih B</strong> (<em>risk-seeking</em> saat rugi! &mdash; <em>cembung</em>!).</p>
<p><strong>Rasional:</strong> ekspektasi B = &minus;60jt &lt; A = &minus;50jt &rarr; <strong>A lebih baik!</strong> Tapi <em>loss aversion</em> membuat B &ldquo;terasa&rdquo; lebih baik (ada <em>harapan</em> 0!). <strong>Pelajaran:</strong> <strong>jangan &ldquo;berjudi&rdquo; untuk menghindari <em>realisasi</em> rugi</strong> &mdash; <em>cut loss</em> = <em>rasional</em>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Regret &mdash; &ldquo;takut salah&rdquo;</summary>
<p><strong>Soal:</strong> tidak beli saham yang lalu naik 200%. Kini ada peluang mirip. Investor ragu (&ldquo;takut salah lagi&rdquo;). Bias?</p>
<p><strong><em>Regret aversion</em>:</strong> takut <em>menyesal</em> &rarr; <strong><em>inaction</em></strong> (tidak bertindak!) atau <strong><em>herding</em></strong> (ikut agar &ldquo;salah bersama&rdquo;!).</p>
<p><strong>Obat:</strong> <strong><em>aturan</em> tertulis</strong> (jika kriteria X terpenuhi &rarr; beli, <em>tanpa</em> diskusi!); <strong><em>evaluasi proses</em></strong> (bukan hasil!); <strong>ingat:</strong> <em>tidak bertindak</em> = <em>keputusan</em> (dengan <em>biaya opportunity</em>!).</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Overconfidence &mdash; kalibrasi</summary>
<p><strong>Soal:</strong> analis &ldquo;90% yakin&rdquo; untuk 20 prediksi. Berapa yang <em>seharusnya</em> benar? Jika hanya 12 benar, apa artinya?</p>
<p><strong>Seharusnya:</strong> 18 (90% &times; 20).</p>
<p><strong>12 benar = 60%</strong> &rarr; <strong><em>miskalibrasi parah</em></strong>! (&ldquo;90%&rdquo; = sebenarnya 60%!). <strong>Tindakan:</strong> <strong><em>kalibrasi ulang</em></strong> (&ldquo;90%&rdquo;-mu = 60%!); <strong>catat <em>semua</em> prediksi</strong> (bukti!); <strong>gunakan <em>base rate</em></strong>. <strong>Keyakinan tanpa kalibrasi = <em>delusi</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Kognitif vs emosional.</strong> <strong>Kognitif</strong> (<em>anchoring</em>! <em>confirmation</em>!) = <em>kesalahan berpikir</em> &rarr; <strong>bisa <em>diedukasi</em></strong>. <strong>Emosional</strong> (<em>loss aversion</em>! <em>regret</em>!) = <em>perasaan</em> &rarr; <strong>sulit diedukasi</strong> &rarr; butuh <em>sistem/adaptasi</em>! Soal CFA <em>suka</em> menanyakan <em>penanganan</em> yang tepat.</p>
</div>
<PlotlyChart
  data={[{x: [-100,-80,-60,-40,-20,0,20,40,60,80,100], y: [-2.8,-2.3,-1.8,-1.3,-0.8,0,0.6,0.8,0.9,1.0,1.05], type: "scatter", mode: "lines", marker: {color: "#2a7de1"}, line: {width: 3}}]}
  title={"Fungsi nilai prospect theory (λ = 2,25)"}
  layout={{xaxis: {title: "Perubahan (Rp jt)"}, yaxis: {title: "Nilai psikologis"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu-x = untung/rugi; sumbu-y = 'rasanya'. Kiri bawah vs kanan atas.</p>
<p><strong>Interpretasi:</strong> Kurva <strong>lebih curam di kiri</strong> (rugi Rp50jt terasa −1,6 vs untung +Rp50jt hanya +0,85). <strong>Cembung saat rugi</strong> = nekat tambah risiko (pegang gorengan); <strong>cekung saat untung</strong> = cepat puas (jual pemenang). Inilah <strong>mesin disposition effect</strong> — kenali bentuknya di dirimu.</p>
</div>
<h2 id="mitigasi">Mitigasi — Sistem Melawan Diri Sendiri</h2>
<p><strong>Definisi.</strong> <strong>Kognitif</strong> → perbaiki (data, checklist, devil's advocate). <strong>Emosional</strong> → <em>kelola</em> (tidak bisa diedukasi!): <strong>IPS</strong> (aturan tertulis saat tenang), <strong>automasi</strong> (DCA, rebalance), <strong>cooling-off</strong> (tunda 72 jam), <strong>pre-commitment</strong> (stop-loss otomatis).</p>
<p><strong>Prinsip</strong>: jangan andalkan <em>willpower</em> — bangun <strong>sistem</strong> yang benar bahkan saat emosi salah.</p>
<p><strong>Kepribadian/intuisi:</strong> Mitigasi seperti <strong>Odysseus &amp; siren</strong>: tahu akan tergoda (emosi) → <strong>ikat diri ke tiang</strong> (IPS, automasi) <em>sebelum</em> mendengar nyanyian. Mengandalkan 'tekad' saat siren bernyanyi = kapal karam.</p>
<p><strong>Kapan dipakai:</strong> Desain proses investasi: aturan ditulis saat tenang, dijalankan saat panik.</p>
<p><strong>Pendalaman intuisi &mdash; herding = &ldquo;aman dalam kerumunan&rdquo;.</strong> Ikut-ikutan = <em>rasional</em> secara evolusioner (menyimpang = dimakan!). Tapi di pasar: <strong>herding = <em>bubble</em> &amp; <em>crash</em></strong>. <strong>Mekanisme:</strong> <em>informational cascade</em> (ikut karena &ldquo;mereka tahu&rdquo;!) + <em>reputational</em> (manajer ikut agar tidak <em>dipecat sendirian</em>!). <strong>Keynes:</strong> &ldquo;pasar bisa <em>irrasional</em> lebih lama dari kamu <em>solven</em>.&rdquo; <strong>Obat:</strong> <em>IPS</em> (jangkar!), <em>pre-mortem</em>, <em>contrarian checklist</em>.</p><details className="worked">
<summary>📐 Contoh: Sistem anti-Bu Rina (klik untuk buka)</summary>
<p><strong>Aturan tertulis</strong> (saat tenang): (1) <strong>Stop-loss −15%</strong> otomatis (lawan disposition); (2) <strong>Ambil untung bertahap</strong> +25/+50% (lawan cepat puas); (3) <strong>Tes cermin</strong> tiap posisi merah; (4) <strong>Cooling-off 72 jam</strong> sebelum beli 'panas'.</p>
<p><strong>Hasil</strong>: gorengan terjual di −15% (rugi Rp15jt, bukan Rp80jt); pemenang dipegang bertahap (+120%). <strong>Sistem &gt; emosi.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Sistem anti-bias &mdash; desain lengkap</summary>
<p><strong>Soal:</strong> rancang <em>sistem</em> untuk investor dengan <em>disposition effect</em> + <em>overconfidence</em>.</p>
<p><strong>Sistem:</strong> (1) <strong><em>Stop-loss</em> &minus;15% <em>otomatis</em></strong> (eksekusi tanpa emosi!); (2) <strong><em>Tes cermin</em></strong> tiap kuartal (&ldquo;akan beli kini?&rdquo;); (3) <strong><em>Jurnal</em></strong> (tulis <em>alasan</em> tiap transaksi!); (4) <strong><em>Aturan</em> ambil untung</strong> (<em>bertahap</em> 25% per target!); (5) <strong><em>Review</em> tahunan</strong> dengan <em>penasihat</em> (pihak ketiga!).</p>
<p><strong>Prinsip:</strong> <strong><em>sistem</em> &gt; <em>tekad</em>.</strong> Tekad <em>habis</em> saat emosi; sistem <em>jalan</em> otomatis. <strong>Tulis saat tenang; eksekusi saat badai.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Nudge &mdash; &ldquo;dorongan lembut&rdquo;</summary>
<p><strong>Soal:</strong> karyawan tidak ikut pensiun (<em>inertia</em>!). Bagaimana <em>nudge</em>?</p>
<p><strong><em>Nudge</em>:</strong> (1) <strong><em>Auto-enrollment</em></strong> (ikut <em>otomatis</em>, <em>opt-out</em>!); (2) <strong><em>Default</em> bijak</strong> (<em>target-date fund</em>!); (3) <strong><em>Auto-escalation</em></strong> (kontribusi naik 1%/tahun otomatis!).</p>
<p><strong>Hasil (Thaler!):</strong> partisipasi 60% &rarr; <strong>95%!</strong> <strong>Pelajaran:</strong> <strong>desain <em>default</em> = <em>kekuatan super</em>.</strong> Terapkan ke diri: <em>auto-debit</em> investasi! <em>auto-rebalance</em>! <strong>Jadikan yang <em>benar</em> = yang <em>mudah</em>.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Kenali, Kelola, Sistem</h2>
      <p>Kognitif, emosional, mitigasi = <strong>satu perjuangan</strong>:</p>
      <ol>
        <li><strong>KENALI (kognitif):</strong> <em>anchoring</em>, <em>confirmation</em>, <em>overconfidence</em> &mdash; <strong>bisa <em>diedukasi</em></strong>.</li>
        <li><strong>AKUI (emosional):</strong> <em>loss aversion</em>, <em>regret</em>, <em>herding</em> &mdash; <strong><em>tetap</em> meski tahu</strong> &rarr; butuh <em>sistem</em>.</li>
        <li><strong>SISTEM (mitigasi):</strong> IPS + jurnal + otomatisasi + <em>nudge</em> &mdash; <strong><em>sistem</em> &gt; <em>tekad</em></strong>.</li>
      </ol>
      <p><strong>Musuh di cermin = <em>diri sendiri</em>. Senjata = <em>sistem</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Behavioral = alasan untuk fee aktif&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;Behavioral finance = <em>pembenaran</em> manajer aktif (&lsquo;pasar irrasional &rarr; kami bisa <em>eksploitasi</em>!&rsquo;). Padahal 90% <em>gagal</em>.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Behavioral = <strong><em>cermin</em></strong>, bukan <em>pedang</em>. Nilainya = <em>memahami diri</em> (agar tidak FOMO/panik!), bukan <em>mengalahkan pasar</em>. <strong>Investor yang kenal biasnya = <em>lebih kaya</em></strong> (behavior gap &minus;3%/tahun!).&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>behavioral untuk <em>pertahanan</em>, bukan <em>penyerangan</em>.</strong> Gunakan untuk <em>tidak merugikan diri</em> &mdash; bukan untuk <em>sok pintar</em>.</p>
      <h3>🧪 Eksperimen: Kalibrasi dirimu</h3>
      <p><strong>Tulis 10 prediksi</strong> (&ldquo;90% yakin&rdquo;!) &mdash; cek 3 bulan lagi. Berapa benar? <strong>Jika &lt; 9 &rarr; <em>miskalibrasi</em>!</strong> &mdash; &ldquo;90%&rdquo;-mu = sebenarnya ___%. <strong>Ulangi tiap kuartal.</strong> <strong>Kalibrasi = <em>kejujuran</em> yang terukur.</strong></p>
      <h3>📰 Studi Kasus: Dot-com &mdash; &ldquo;Kali Ini Beda&rdquo;</h3>
      <p>1999: &ldquo;<em>eyeballs</em> &gt; laba!&rdquo; &mdash; <em>herding</em> + <em>overconfidence</em> + <em>FOMO</em>. Nasdaq +85%! 2000&ndash;02: <strong>&minus;78%</strong>.</p>
      <p><strong>Bias <em>berjamaah</em>:</strong> (1) <strong><em>herding</em></strong> (&ldquo;semua beli&rdquo;!); (2) <strong><em>confirmation</em></strong> (hanya baca <em>bullish</em>!); (3) <strong><em>overconfidence</em></strong> (&ldquo;saya <em>keluar</em> sebelum pecah&rdquo; &mdash; <em>tidak</em>!). <strong>Pelajaran:</strong> <strong>&ldquo;kali ini beda&rdquo; = <em>4 kata termahal</em>.</strong></p>
      <h3>📖 Kamus Bias (Referensi Cepat)</h3>
      <p><strong>KOGNITIF:</strong> <em>Anchoring</em> (jangkar angka!), <em>confirmation</em> (cari pendukung!), <em>availability</em> (yang <em>ingat</em> = yang <em>penting</em>!), <em>hindsight</em> (&ldquo;sudah kuduga&rdquo;!), <em>framing</em> (kemasan mengubah pilihan!), <em>mental accounting</em> (kantong-kantong!), <em>representativeness</em> (stereotip!).</p>
      <p><strong>EMOSIONAL:</strong> <em>Loss aversion</em> (2,25&times;!), <em>overconfidence</em> (90/50!), <em>regret</em> (takut salah!), <em>endowment</em> (milikku <em>lebih</em>!), <em>self-control</em> (boros kini!), <em>status quo</em> (malas ubah!).</p>
      <p><strong>Cara pakai:</strong> saat keputusan <em>terasa</em> aneh &rarr; <strong>cek kamus</strong> &mdash; bias mana yang <em>bekerja</em>? <strong>Namai = <em>jinakkan</em>.</strong></p>
      <h3>🏢 Behavioral untuk Penasihat (Praktik)</h3>
      <p><strong>Profiling:</strong> <em>kuesioner</em> risk tolerance <strong>+</strong> <em>observasi</em> perilaku (panik 2020? FOMO 2021?). <strong><em>Nyatakan</em> bias klien</strong> di IPS behavioral!</p>
      <p><strong>Komunikasi:</strong> <strong><em>framing</em> positif</strong> (&ldquo;95% <em>bertahan</em>&rdquo; bukan &ldquo;5% <em>gagal</em>&rdquo;!); <strong><em>edukasi</em> saat tenang</strong> (bukan saat panik!); <strong><em>cerita</em></strong> &gt; <em>angka</em> (otak <em>suka</em> narasi!).</p>
      <p><strong>Intervensi:</strong> <strong><em>circuit breaker</em></strong> (&ldquo;jual &gt; 20% = <em>telepon saya dulu</em>!&rdquo;); <strong><em>autopilot</em></strong> (DCA! <em>rebalance</em>!); <strong><em>cooling-off</em></strong> (keputusan besar = <em>tunggu 72 jam</em>!).</p>
      <p><strong>Nilai penasihat = <em>behavioral alpha</em></strong> (1,5%/tahun! &mdash; Vanguard!). <strong><em>Coaching</em> &gt; <em>picking</em>.</strong></p>
      <h3>🔬 Studi Terkenal (Wajib Tahu)</h3>
      <p><strong>Kahneman-Tversky (1979):</strong> <em>prospect theory</em> &mdash; <strong>Nobel 2002</strong>! Fondasi <em>semua</em> behavioral.</p>
      <p><strong>Barber-Odean (2001):</strong> &ldquo;<em>Boys will be boys</em>&rdquo; &mdash; pria trading 45% lebih sering &rarr; return <em>lebih rendah</em>! <strong><em>Overconfidence</em> = <em>mahal</em>.</strong></p>
      <p><strong>Dalbar (tahunan):</strong> <em>behavior gap</em> 3&ndash;4%/tahun &mdash; <strong>investor = <em>musuh</em> terbesarnya</strong>.</p>
      <p><strong>Thaler (2017 Nobel):</strong> <em>nudge</em> &mdash; <strong>desain <em>default</em> mengubah dunia</strong>.</p>
      <p><strong>Hafalkan keempatnya</strong> &mdash; ini <em>kanon</em> behavioral finance.</p>
      <h3>💡 Prinsip Abadi Behavioral</h3>
      <p><strong>(1) Kenali <em>dirimu</em></strong> (bias apa yang <em>paling</em> kuat padamu?). <strong>(2) Sistem &gt; tekad</strong> (otomatisasi!). <strong>(3) Tulis saat tenang</strong> (IPS! jurnal!). <strong>(4) Kalibrasi</strong> (track record!). <strong>(5) <em>Nudge</em> dirimu</strong> (default bijak!).</p>
      <p><strong>Lima prinsip. Praktikkan <em>setiap hari</em>.</strong></p>
      <h3>🎓 Ujian Akhir Lesson (Refleksi)</h3>
      <p><strong>Pertanyaan 1:</strong> Jual pemenang cepat, pegang pecundang lama. Bias apa? <em>Mekanisme</em> prospect theory?</p>
      <p><strong>Pertanyaan 2:</strong> &ldquo;90% yakin&rdquo; tapi benar 60%. <em>Masalah</em>? <em>Solusi</em>?</p>
      <p><strong>Pertanyaan 3:</strong> Rancang <em>sistem</em> anti-<em>disposition effect</em> (3 komponen!).</p>
      <p><strong>Jika bisa jawab ketiganya &rarr; <em>lulus</em>.</strong></p>
      <h3>🔗 Menghubungkan ke Lesson Lain</h3>
      <p><strong>Ke PM-C5 (Evaluasi):</strong> <em>behavior gap</em> = <em>biaya</em> bias &mdash; <em>diukur</em> di sana!</p>
      <p><strong>Ke PM-C1 (IPS):</strong> IPS = <em>senjata</em> anti-bias &mdash; <em>ditulis</em> di sana!</p>
      <p><strong>Ke PM-C3 (Alokasi):</strong> <em>rebalancing</em> = <em>contrarian</em> otomatis &mdash; <em>melawan</em> bias!</p>
      <p><strong>Behavioral = <em>benang merah</em></strong> semua lesson portfolio.</p>
      <h3>📊 Data Corner: Barber-Odean</h3>
      <p><strong>Data:</strong> 35.000 akun: pria <em>turnover</em> 77%/tahun vs wanita 53%. Return pria <em>lebih rendah</em> 1%/tahun.</p>
      <p><strong>Penjelasan:</strong> <strong><em>overconfidence</em></strong> &rarr; <em>overtrading</em> &rarr; <em>biaya</em>! <strong>Single pria</strong> = <em>terburuk</em> (testosteron? <em>status</em>?).</p>
      <p><strong>Implikasi:</strong> <strong><em>kurangi</em> trading</strong> = <em>tambah</em> return! <strong>Aturan:</strong> <em>maks</em> 4 transaksi/tahun? <em>Cooling-off</em> 72 jam? <strong>Diam = <em>emas</em>.</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;Nudge = manipulasi&rdquo;</h3>
      <p><strong>Kritik:</strong> &ldquo;<em>Auto-enrollment</em> = <em>memaksa</em>! <em>Paternalisme</em>! Orang <em>dewasa</em> harus <em>bebas</em> memilih!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;<em>Default</em> <strong><em>selalu ada</em></strong> &mdash; pertanyaannya <em>dirancang</em> atau <em>kebetulan</em>? <em>Auto-enrollment</em> = <em>opt-out</em> (tetap <em>bebas</em>!). <strong>Hasil: 60% &rarr; 95% partisipasi!</strong> &mdash; <em>jutaan</em> pensiun <em>terselamatkan</em>.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>libertarian paternalism</em></strong> &mdash; <em>dorong</em>, jangan <em>paksa</em>. <strong>Desain <em>default</em> = <em>tanggung jawab</em>.</strong></p>
      <h3>📖 Esai: Kenali Dirimu</h3>
      <p><strong><em>Bias</em></strong> = <strong><em>musuh</em></strong> <em>dalam</em>. <strong><em>Kenali</em></strong>! <strong><em>Kelola</em></strong>! <strong><em>Kalahkan</em></strong>!</p>
      <p><strong><em>Disiplin</em></strong> = <strong><em>senjata</em></strong>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Saya rasional — behavioral finance untuk orang lain.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>90% supir merasa di atas rata-rata</strong> — termasuk kamu. Overconfidence = bias yang <em>menyembunyikan</em> bias lain. Tes: catat <em>semua</em> prediksi + hasilnya 1 tahun. <strong>Jurnal = cermin</strong> yang tidak bisa dibohongi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Bias emosional bisa dihilangkan dengan belajar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Tidak.</strong> Kognitif bisa di-patch (data); emosional hanya bisa <strong>dikelola</strong> (sistem). Ahli behavioral pun FOMO — bedanya mereka punya <strong>IPS + automasi</strong>. Jangan lawan ombak; <strong>bangun kapal</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Edukasi menghilangkan bias.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>hanya untuk <em>kognitif</em>!</strong> <em>Emosional</em> (loss aversion!) = <em>tetap</em> meski tahu! (Kahneman: &ldquo;saya <em>tahu</em> &mdash; tapi <em>tetap</em> merasakannya!&rdquo;). <strong>Solusi emosional = <em>sistem</em></strong> (otomatisasi!), bukan <em>pengetahuan</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Profesional bebas bias.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>manajer profesional = <em>bias berbeda</em></strong> (<em>herding</em>! <em>overconfidence</em>! <em>career risk</em>!), bukan <em>bebas</em>. <strong>80&ndash;90% kalah dari benchmark</strong> = bukti! <strong>Profesional butuh <em>sistem</em> sama seperti ritel.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Tulis jurnal keputusan.</strong> Tiap beli/jual: tesis + harga + tanggal + 'apa yang membuatku salah?'. Review tahunan = <strong>obat overconfidence & hindsight</strong> paling murah.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Pasang 'tiang Odysseus' sebelum badai.</strong> Stop-loss otomatis, DCA otomatis, cooling-off 72 jam — <em>sekarang</em>, saat tenang. Aturan yang dibuat saat panik = tidak ada aturan.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Kit anti-bias (5 alat):</strong> (1) <strong>IPS tertulis</strong> (jangkar!); (2) <strong>Jurnal</strong> (alasan tiap transaksi!); (3) <strong>Stop-loss otomatis</strong>; (4) <strong>Tes cermin</strong> (kuartalan!); (5) <strong>Devil's advocate</strong> (3 alasan salah!). <strong>Lima alat, <em>setiap</em> investor.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Simulator Prospect Theory</h2>
<p>Rasakan fungsi nilai: pilih antara pasti vs gamble di wilayah untung & rugi.</p>
<PyodideLab
  title={"Lab 1 — Simulator Prospect Theory"}
  hint={"Ubah LAMBDA 2.25 → 1.0 (tanpa loss aversion). Pilihan berubah — rasakan bedanya!"}
  defaultCode={"# Prospect theory: v(x) untung vs rugi (EV sama, pilihan beda!)\nLAMBDA = 2.25   # loss aversion (ubah ke 1.0!)\nALPHA = 0.88\n\ndef v(x):\n    return x**ALPHA if x >= 0 else -LAMBDA*(-x)**ALPHA\n\n# Skenario UNTUNG: pasti +90 vs 90% dapat +100 (EV sama = 90)\npasti_u, gamble_u = v(90), 0.9*v(100)\n# Skenario RUGI: pasti -90 vs 90% rugi -100 (EV sama = -90)\npasti_r, gamble_r = v(-90), 0.9*v(-100)\n\nprint(f\"UNTUNG: pasti {pasti_u:.1f} vs gamble {gamble_u:.1f} -> pilih {'PASTI' if pasti_u>gamble_u else 'GAMBLE'} (risk-averse: amankan)\")\nprint(f\"RUGI  : pasti {pasti_r:.1f} vs gamble {gamble_r:.1f} -> pilih {'PASTI' if pasti_r>gamble_r else 'GAMBLE'} (risk-seeking: nekat)\")\nprint()\nprint(\"EV SAMA, pilihan BEDA: untung -> amankan; rugi -> nekat.\")\nprint(\"Itulah disposition effect. Ubah LAMBDA=1.0: asimetri hilang.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Pengklasifikasi Bias</h2>
<p>Klasifikasikan skenario ke bias yang tepat — latihan deteksi.</p>
<PyodideLab
  title={"Lab 2 — Detektor Bias"}
  hint={"Ubah SKENARIO 1 → 4. Tiap nomor = bias berbeda. Tebak dulu sebelum lihat jawaban!"}
  defaultCode={"# Detektor bias: tebak dulu, lalu cek\nSKENARIO = 1  # 1..4 (ubah!)\n\nbank = {\n 1: (\"'Saham ini dulu Rp10rb, sekarang Rp6rb = murah!'\",\n     \"ANCHORING (kognitif) - terpaku harga masa lalu, bukan valuasi.\"),\n 2: (\"'Semua analis bilang beli, ikut saja.'\",\n     \"HERDING (emosional) - aman di kerumunan, salah bersama.\"),\n 3: (\"'Rugi Rp100jt, tahan... nanti balik. Jual yang untung Rp20jt.'\",\n     \"DISPOSITION EFFECT (prospect theory) - cembung saat rugi, cekung saat untung.\"),\n 4: (\"'Saya sudah baca 10 laporan yang SETUJU dengan saya.'\",\n     \"CONFIRMATION BIAS (kognitif) - cari yang mengiyakan, bukan menguji.\"),\n}\nteks, jawab = bank[SKENARIO]\nprint(\"Skenario:\", teks)\nprint()\ninput(\"Tebak biasnya... (Enter untuk jawaban)\")\nprint(\"Jawaban:\", jawab)\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Analisis investasi → <strong>Paksa 3 alasan tesis salah</strong></h3>
<p><strong>Kenapa:</strong> Lawan confirmation.</p>
<p><strong>Contoh nyata:</strong> Devil's advocate.</p>
</div>
<div className="decision-card">
<h3>2. Posisi merah dalam → <strong>Tes cermin: beli baru di harga ini?</strong></h3>
<p><strong>Kenapa:</strong> Lawan endowment + disposition.</p>
<p><strong>Contoh nyata:</strong> Tidak → jual.</p>
</div>
<div className="decision-card">
<h3>3. Ingin beli 'panas' (FOMO) → <strong>Cooling-off 72 jam</strong></h3>
<p><strong>Kenapa:</strong> Emosi memudar, data tinggal.</p>
<p><strong>Contoh nyata:</strong> Aturan tertulis.</p>
</div>
<div className="decision-card">
<h3>4. Desain proses → <strong>Automasi + IPS (tiang Odysseus)</strong></h3>
<p><strong>Kenapa:</strong> Sistem &gt; willpower.</p>
<p><strong>Contoh nyata:</strong> DCA + stop otomatis.</p>
</div>
<div className="decision-card">
<h3>5. Keputusan investasi emosional &rarr; <strong>Sistem &gt; tekad; tulis saat tenang</strong></h3>
<p><strong>Kenapa:</strong> Rugi 2,25&times; &gt; untung; bias emosional tidak hilang dengan edukasi.</p>
<p><strong>Contoh nyata:</strong> Bu Rina: pegang −Rp100jt, jual +Rp20jt — disposition effect.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Kognitif</strong> = patch; <strong>emosional</strong> = kelola.</li><li><strong>Jurnal</strong> semua keputusan.</li><li><strong>Tes cermin</strong> untuk posisi merah.</li><li><strong>Sistem</strong> &gt; tekad.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Rp100 Jt yang Tidak Terasa</h2>
<div className="callout">
<p>Bu Rina: pegang gorengan −Rp100jt ('nanti balik'), jual pemenang +Rp20jt ('amankan'). Setahun: −80% vs +200%.</p>
<p><strong>Vignette lanjutan.</strong> Bu Rina: pegang saham gorengan &minus;Rp100jt (&ldquo;nanti balik&rdquo; &mdash; 2 tahun!), jual pemenang +Rp20jt (&ldquo;amankan&rdquo; &mdash; 2 bulan!). Setahun: pecundang &minus;80%, pemenang +200%. Total &ldquo;biaya&rdquo; bias: ratusan juta.</p>
<p><strong>Pertanyaan:</strong> (a) Nama biasnya? (b) Mekanisme <em>prospect theory</em>? (c) Sistem pencegah? (d) Jika <em>tes cermin</em> (&ldquo;akan beli kini?&rdquo;) jawabannya <em>tidak</em> untuk keduanya &mdash; apa tindakan? (e) Bagaimana menjelaskan ke Bu Rina <em>tanpa</em> menyinggung?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Disposition effect</strong> (+ endowment effect di pecundang).</p>
<p>(b) <strong>Cembung saat rugi</strong> → risk-seeking (pegang/tambah); <strong>cekung saat untung</strong> → risk-averse (jual cepat). λ=2,25 memperkuat.</p>
<p>(c) <strong>Stop-loss &minus;15% otomatis</strong> + <strong>tes cermin</strong> + <strong>ambil untung bertahap</strong> + <strong>jurnal</strong>. Ditulis saat tenang, dieksekusi saat emosi.</p>
<p>(d) <strong>Jual keduanya!</strong> &mdash; <em>tes cermin</em> = keputusan <em>forward-looking</em>. Pecundang: &ldquo;tidak akan beli&rdquo; &rarr; <strong>jual</strong> (<em>sunk cost</em>!). Pemenang: &ldquo;tidak akan beli&rdquo; (terlalu mahal?) &rarr; <strong>jual <em>bertahap</em></strong> (kunci untung!). <strong>Harga beli = <em>irrelevan</em>.</strong></p>
<p>(e) <strong>Tiga prinsip:</strong> (1) <strong><em>normalisasi</em></strong> (&ldquo;semua orang begitu &mdash; <em>termasuk saya</em>&rdquo;); (2) <strong><em>sistem</em>, bukan <em>salah</em></strong> (&ldquo;bukan Ibu yang salah &mdash; <em>otaknya</em> yang begitu; kita <em>akali</em> dengan sistem&rdquo;); (3) <strong><em>angka</em></strong> (tunjukkan &ldquo;biaya&rdquo; ratusan juta &mdash; <em>fakta</em> lebih kuat dari <em>nasihat</em>). <strong>Empati + sistem = perubahan.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Pikiran Pasar</h2>
      <h3>1. Neurofinance &mdash; otak saat trading</h3>
      <p><em>fMRI</em>: <strong>untung</strong> = <em>nucleus accumbens</em> (dopamin! <em>candu</em>!); <strong>rugi</strong> = <em>amygdala</em> (takut! <em>panik</em>!). <strong>Trader <em>berpengalaman</em></strong> = <em>prefrontal cortex</em> lebih aktif (<em>kontrol</em>!). <strong>Implikasi:</strong> <em>pengalaman</em> = <em>otak</em> yang terlatih &mdash; <strong>bukan</strong> <em>pengetahuan</em> yang bertambah. <strong>Latih <em>kortex</em>, bukan <em>amygdala</em>.</strong></p>
      <h3>2. Cultural finance &mdash; bias lintas budaya</h3>
      <p><strong>Kolektivis</strong> (Asia!) = <em>herding</em> lebih kuat; <strong>individualis</strong> = <em>overconfidence</em> lebih kuat. <strong>Implikasi:</strong> <em>kenalilah</em> bias <em>budayamu</em>! Indonesia: <strong>waspadai <em>ikut-ikutan</em></strong> (grup WA! <em>influencer</em>!). <strong>Obat:</strong> <em>IPS pribadi</em> + <em>verifikasi mandiri</em>.</p>
      <h3>3. Adaptive markets &mdash; Lo vs Fama</h3>
      <p><strong>Lo:</strong> pasar = <em>ekosistem</em> (bukan <em>fisika</em>!); <em>rasionalitas</em> = <em>adaptasi</em>. <strong>Implikasi:</strong> strategi <em>berhasil</em> lalu <em>gagal</em> (<em>lingkungan berubah</em>!); <em>inovasi</em> = <em>bertahan</em>. <strong>Bukan</strong> &ldquo;pasar efisien&rdquo; vs &ldquo;orang irrasional&rdquo; &mdash; melainkan <strong><em>adaptasi</em></strong>. <strong>Belajar <em>terus</em> atau <em>punah</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Identifikasi bias</h3>
      <p>&ldquo;Tunggu balik modal.&rdquo; Bias apa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong><em>Disposition effect</em></strong> (<em>loss aversion</em> + <em>anchoring</em>).</p>
      </details>
      <h3>Drill 2 &mdash; Kognitif vs emosional</h3>
      <p><em>Anchoring</em>: kognitif atau emosional? Penanganan?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>Kognitif</strong> &rarr; <em>edukasi</em> bisa. (Emosional &rarr; butuh <em>sistem</em>!)</p>
      </details>
      <h3>Drill 3 &mdash; Tes cermin</h3>
      <p>Beli @1000, kini 600. &ldquo;Akan beli kini?&rdquo; = tidak. Tindakan?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Jual.</strong> Harga beli = <em>sunk cost</em>.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Saya profesional &mdash; bebas bias.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> Profesional = <em>bias berbeda</em>, bukan <em>bebas</em>.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. 'Dulu Rp10rb, sekarang Rp6rb = murah!' Bias?"}
  options={
    ["Herding",
    "Anchoring (kognitif)",
    "Loss aversion",
    "Overconfidence"]
  }
  correct={1}
  explanation={"Benar: terpaku angka masa lalu. Obat: ganti anchor ke valuasi historis (P/E), bukan harga."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. λ = 2,25 artinya?"}
  options={
    ["Untung 2,25x lebih nikmat",
    "Rugi 2,25x lebih sakit dari untung setara",
    "Risiko 2,25x",
    "Tidak ada arti"]
  }
  correct={1}
  explanation={"Benar: loss aversion. Rugi Rp1jt ≈ sakitnya untung Rp2,25jt."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Saat rugi, orang cenderung?"}
  options={
    ["Risk-averse",
    "Risk-seeking (pegang/tambah pecundang)",
    "Netral",
    "Jual semua"]
  }
  correct={1}
  explanation={"Benar: fungsi nilai cembung di wilayah rugi → nekat. Inilah mesin disposition effect."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Bias emosional paling tepat diatasi dengan?"}
  options={
    ["Belajar lebih giat",
    "Sistem: IPS + automasi + pre-commitment",
    "Willpower",
    "Abaikan"]
  }
  correct={1}
  explanation={"Benar: emosional tidak bisa 'diedukasi hilang' — hanya dikelola via sistem (tiang Odysseus)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. 'Semua analis bilang beli, ikut saja.' Bias?"}
  options={
    ["Confirmation",
    "Herding (emosional)",
    "Framing",
    "Hindsight"]
  }
  correct={1}
  explanation={"Benar: ikut kerumunan terasa aman. Obat: tesis independen tertulis SEBELUM lihat konsensus."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Bu Rina pegang −Rp100jt ('nanti balik'), jual +Rp20jt ('amankan'). Tes cermin = 'tidak akan beli' untuk keduanya. Tindakan?"}
  options={
    ["Pegang keduanya — nanti balik",
    "Jual keduanya — harga beli = sunk cost; keputusan forward-looking",
    "Pegang pemenang, jual pecundang",
    "Tambah pecundang — averaging down"]}
  correct={1}
  explanation={"Benar: tes cermin = 'akan beli kini?' Jika tidak untuk keduanya → jual keduanya. Harga beli irrelevan (sunk cost). Disposition effect = kebalikan dari 'potong rugi, biarkan untung'."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Kognitif</strong> (anchoring, confirmation, hindsight, framing, availability): patch dengan data &amp; proses.</li>
<li><strong>Emosional</strong> (loss aversion, overconfidence, herding, regret): kelola dengan sistem.</li>
<li><strong>Prospect theory</strong>: λ≈2,25; cembung-rugi, cekung-untung → disposition effect.</li>
<li><strong>Tes cermin</strong>: 'beli baru di harga ini?'</li>
<li><strong>Mitigasi</strong>: IPS, automasi, cooling-off, jurnal, pre-commitment.</li>
<li><strong>Aturan</strong>: sistem &gt; tekad; jurnal = cermin.</li>

<li><strong>Kognitif:</strong> anchoring, confirmation, overconfidence &mdash; bisa diedukasi.</li>
<li><strong>Emosional:</strong> loss aversion, regret, herding &mdash; butuh sistem.</li>
<li><strong>Mitigasi:</strong> IPS, jurnal, otomatisasi, nudge &mdash; sistem &gt; tekad.</li>
<li><strong>Kapan TIDAK pakai:</strong> andalkan tekad; anggap kebal; riset yang hanya konfirmasi.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c5-performance-evaluation" className="btn btn-secondary btn-sm">← PM-C5</Link>
        <Link href="/learn/pm-c7-fixed-income-portfolio" className="btn btn-primary btn-sm">PM-C7 →</Link>
      </div>
    </div>
  );
}

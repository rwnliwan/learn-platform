"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA9AlternativesPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A9 — Portfolio Management</span>
        <h1 className="display-title">Alternative Investments:<br/>di Luar Saham-Obligasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Private Equity yang 'Untung 3x' Tapi Kalah dari Saham</a></li>
<li><a href="#karakter">Karakteristik Alternatif</a></li>
<li><a href="#repe">RE & Private Equity</a></li>
<li><a href="#hfkom">Hedge Fund & Komoditas</a></li>
<li><a href="#sintesis">Sintesis: Harga Keunikan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Bu Lina</a></li>
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
<li>Menjelaskan karakteristik khas alternatif vs tradisional.</li>
<li>Menghitung TVPI, DPI, RVPI dan menjelaskan J-curve.</li>
<li>Menghitung fee drag struktur 2-and-20.</li>
<li>Membedakan contango vs backwardation dan implikasinya.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Private Equity yang 'Untung 3x' Tapi Kalah dari Saham</h2>
      <div className="story">
        <p><strong>Bu Lina</strong> berinvestasi di private equity: <strong>&ldquo;modal kembali 3x lipat!&rdquo;</strong> dalam 10 tahun. Ia pamer ke teman-temannya yang cuma dapat 2x dari reksadana saham.</p>
<p>Twist-nya: <strong>3x dalam 10 tahun = IRR ~11,6%</strong> — sementara reksadana saham temannya 2x dalam <strong>6 tahun</strong> = IRR ~12,2%! Ditambah PE <strong>tidak likuid 10 tahun</strong> (tidak bisa jual saat butuh) dan <strong>fee 2-and-20</strong>. &ldquo;3x&rdquo; terdengar hebat sampai dihitung <strong>per tahun</strong> dan <strong>disesuaikan likuiditas</strong>. Lesson ini: matematika alternatif yang jujur.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="karakter">Karakteristik — Beda Dunia</h2>
<p><strong>Definisi.</strong> <strong>Alternatif</strong> = di luar saham/obligasi/kas: real estate, PE, hedge fund, komoditas, infrastruktur, aset digital. Ciri: <strong>illikuid</strong> (lockup tahunan), <strong>fee tinggi</strong> (2-and-20: 2% management + 20% performance di atas hurdle), <strong>valuasi appraisal</strong> (tidak mark-to-market harian → volatilitas <em>tampak</em> rendah = <strong>smoothing!</strong>), <strong>J-curve</strong> (rugi di awal: fee + investasi, untung belakangan).</p>
<p><strong>Illiquidity premium</strong>: return ekstra sebagai kompensasi tidak bisa jual — harus &gt; 0 untuk worth it.</p>
<p><strong>Kepribadian/intuisi:</strong> Alternatif seperti <strong>deposito berjangka 10 tahun</strong>: bunganya harus lebih tinggi dari tabungan (illiquidity premium), tidak bisa diambil mendadak, dan 'bunga' awal negatif (fee dulu). Jika return-nya sama dengan saham likuid — <strong>ngapain dikunci?</strong></p>
<p><strong>Kapan dipakai:</strong> Alokasi alternatif: hanya jika premium &gt; biaya illikuiditas + fee.</p>
<p><strong>Pendalaman intuisi &mdash; PE menjual <em>waktu</em>, bukan cuma saham.</strong> Private equity mengunci modalmu 10 tahun. Kompensasinya harus <strong>illiquidity premium</strong>: 3&ndash;4% <em>di atas</em> return saham publik, <em>setelah</em> fee. Jika PE memberi 11,6% sementara saham memberi 12,2% (kasus Bu Lina), kamu <strong>membayar</strong> untuk dikunci &mdash; bukan dibayar. <strong>Uji selalu: IRR <em>net</em> vs alternatif likuid.</strong> &ldquo;3x&rdquo; tanpa annualized = angka pemasaran.</p><details className="worked">
<summary>📐 Contoh: Hitung Bu Lina (klik untuk buka)</summary>
<p>PE: 3x dalam 10 thn → IRR = 3^(1/10) − 1 = <strong>11,6%</strong>. Saham: 2x dalam 6 thn → 2^(1/6) − 1 = <strong>12,2%</strong>.</p>
<p><strong>Saham menang</strong> — dengan likuiditas penuh! PE harusnya memberi <strong>illiquidity premium</strong> ~3–4% di atas saham. Di sini malah <em>diskon</em>.</p>
<p>Pelajaran: <strong>multiple tanpa waktu = menipu</strong>. Selalu annualize (IRR) dan bandingkan dengan alternatif likuid.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): DPI vs TVPI &mdash; kas vs kertas</summary>
<p><strong>Soal:</strong> fund memanggil Rp100M. Sudah distribusikan Rp80M. NAV tersisa Rp90M. Hitung DPI, RVPI, TVPI.</p>
<p><strong>Langkah 1:</strong> DPI = 80/100 = <strong>0,8&times;</strong> (kas <em>kembali</em>). RVPI = 90/100 = <strong>0,9&times;</strong> (kertas). TVPI = 0,8 + 0,9 = <strong>1,7&times;</strong>.</p>
<p><strong>Interpretasi:</strong> TVPI 1,7&times; terlihat bagus &mdash; tapi <strong>DPI &lt; 1,0&times;</strong> artinya kamu <em>belum balik modal kas</em>! NAV Rp90M adalah <em>appraisal</em> manajer sendiri (bisa optimis). <strong>Aturan LP berpengalaman: percaya DPI, curigai RVPI.</strong> Fund yang TVPI-nya tinggi tapi DPI-nya macet = &ldquo;kaya di atas kertas&rdquo;.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Fee drag 2-and-20 &mdash; berapa yang sampai ke kamu?</summary>
<p><strong>Soal:</strong> gross return 15%, fee 2% + 20% carry di atas hurdle 8%. Hitung net.</p>
<p><strong>Langkah 1:</strong> setelah management fee: 15 &minus; 2 = 13%. <strong>Langkah 2:</strong> carry = 20% &times; (13 &minus; 8) = <strong>1%</strong>. <strong>Net = 12%</strong>.</p>
<p><strong>Fee drag = 3pp</strong> (20% dari return!). Dalam 10 tahun: Rp100M &rarr; gross Rp405M vs net Rp311M &mdash; <strong>selisih Rp94M untuk manajer</strong>. Pelajaran: negosiasi fee (1,5-and-15 untuk tiket besar) atau pilih <em>co-invest</em> (tanpa fee). <strong>Fee adalah return yang pasti &mdash; alpha tidak.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: J-curve &mdash; sakit dulu, panen kemudian</summary>
<p><strong>Soal:</strong> jelaskan kenapa IRR PE tahun 1&ndash;3 hampir selalu negatif.</p>
<p><strong>Mekanisme:</strong> tahun 1&ndash;3: <em>capital calls</em> (uang keluar) + <em>management fee</em> (2% dari komitmen!) + investasi <em>belum</em> matang &rarr; arus kas negatif dalam. Tahun 4+: <em>exits</em> (IPO/akuisisi) &rarr; distribusi masuk.</p>
<p><strong>Implikasi praktis:</strong> (1) jangan nilai fund umur &lt; 4 tahun dari IRR-nya &mdash; <em>belum</em> informatif; (2) siapkan <em>likuiditas</em> untuk calls (bukan cuma komitmen); (3) <strong>vintage diversification</strong>: komitmen tiap tahun (bukan sekaligus) &mdash; agar J-curve-mu tidak sinkron.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Volatilitas rendah = risiko rendah&rdquo; (PE).</strong> NAV PE di-<em>appraisal</em> kuartalan (bukan harga pasar harian) &rarr; volatilitas <em>tampak</em> rendah &rarr; Sharpe <em>tampak</em> tinggi. Ini <strong>smoothing</strong>, bukan risiko rendah! Saat krisis likuiditas (2008), &ldquo;vol rendah&rdquo; ini menguap &mdash; NAV di-markdown 30&ndash;40% sekaligus. <strong>Selalu curigai return yang <em>terlalu</em> mulus.</strong></p>
</div>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [-8,-12,-5,2,10,25,45,70,100,200], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "net cash flow kumulatif (%)"}]}
  title={"J-curve private equity (ilustrasi)"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Net cash flow kumulatif (% modal)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = tahun, Y = kas kumulatif (negatif = setor modal + fee).</p>
<p><strong>Interpretasi:</strong> Tahun 1–3 <strong>negatif</strong> (capital call + fee, belum ada exit) — inilah J-curve. Investor yang tidak paham panik di tahun 2 ('kok rugi?!'). <strong>Uji kesabaran</strong>: hanya untuk modal yang benar-benar tidak dibutuhkan 10 tahun.</p>
</div>

<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [-20,-35,-40,-30,-10,20,55,90,115,135], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Arus kas kumulatif (RpM)"}, {x: [1,10], y: [0,0], type: "scatter", mode: "lines", line: {dash: "dash", color: "#7f7f7f"}, name: "BEP"}]}
  title={"J-curve: sakit di awal, panen di akhir"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Kumulatif (RpM)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = tahun fund, sumbu Y = arus kas kumulatif investor. Garis putus = titik impas.</p>
<p><strong>Interpretasi:</strong> Tahun 1&ndash;3 <strong>negatif dalam</strong> (&minus;40M): capital calls + fee, belum ada exit. Titik balik tahun 5&ndash;6; panen tahun 7+. <strong>Dua pelajaran:</strong> (1) IRR tahun 3 = sampah statistik &mdash; jangan dihakimi; (2) pastikan kamu <em>bisa</em> bertahan hingga tahun 6 (likuiditas!) &mdash; jika terpaksa jual di tahun 3, kamu jual di lembah J.</p>
</div>
<h2 id="repe">Real Estate & PE — Aset Nyata, Uang Terkunci</h2>
<p><strong>Definisi.</strong> <strong>Cap rate</strong> = NOI/harga properti (yield properti). <strong>NAV</strong> = nilai aset − utang (REIT diperdagangkan di diskon/premium ke NAV). <strong>PE multiples</strong>: <strong>TVPI</strong> = (distribusi + NAV sisa)/paid-in; <strong>DPI</strong> = distribusi/paid-in (kas <em>nyata</em> kembali); <strong>RVPI</strong> = NAV sisa/paid-in. TVPI = DPI + RVPI.</p>
<p><strong>DPI &gt; 1</strong> = sudah balik modal tunai. RVPI = 'janji' (belum cair).</p>
<Tex math={String.raw`TVPI = DPI + RVPI = \frac{\text{Distribusi} + \text{NAV}_{sisa}}{\text{Paid-in}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`DPI`} />: distributed — kas yang SUDAH kembali (fakta)</li>
<li><Tex math={String.raw`RVPI`} />: residual — nilai sisa di kertas (opini/appraisal)</li>
<li>TVPI 3,0x dengan DPI 0,2x = 'untung di kertas, kas belum kembali'</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> PE multiples seperti <strong>rapor proyek kost</strong>: DPI = uang sewa yang sudah masuk kantong; RVPI = 'harga kost naik' menurut makelar; TVPI = totalnya. <strong>Kantong tidak bisa dibohongi</strong> — kejar DPI, bukan TVPI.</p>
<p><strong>Kapan dipakai:</strong> Evaluasi fund PE/VC: DPI + IRR, bukan TVPI saja.</p>
<p><strong>Pendalaman intuisi &mdash; properti = obligasi + lotre tanah.</strong> Sewa tahunan = kupon (arus kas stabil); apresiasi tanah = opsi (tidak pasti). REIT menggabungkan keduanya dalam kendaraan likuid. Tapi ingat: <strong>leverage properti</strong> mengubah obligasi jadi saham &mdash; LTV 80% membuat penurunan harga 20% = ekuitas <em>nol</em>. Properti &ldquo;aman&rdquo; hanya jika leverage-nya waras.</p><details className="worked">
<summary>📐 Contoh: Fund X (klik untuk buka)</summary>
<p>Paid-in Rp100M. Distribusi Rp40M. NAV sisa Rp160M (appraisal).</p>
<p><strong>DPI</strong> = 0,4x (baru 40% kembali tunai). <strong>RVPI</strong> = 1,6x. <strong>TVPI</strong> = 2,0x.</p>
<p>Marketing fund: 'TVPI 2,0x!' Realita: <strong>kas kembali cuma 40%</strong>, sisanya opini penilai. Tanya: kapan NAV sisa jadi distribusi? (vintage + exit pipeline).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Cap rate &mdash; P/E-nya properti</summary>
<p><strong>Soal:</strong> ruko NOI Rp100jt/thn, harga Rp1,5M. Cap rate? Bandingkan dengan obligasi 6,5%.</p>
<p><strong>Langkah 1:</strong> cap rate = 100jt/1,5M = <strong>6,67%</strong>.</p>
<p><strong>Langkah 2:</strong> 6,67% vs obligasi 6,5% &rarr; <strong>spread cuma 17bp</strong> &mdash; terlalu tipis untuk risiko properti (illikuid + konsentrasi + capex)! <strong>Cap rate wajar</strong> = obligasi + 200&ndash;400bp premi &rarr; target 8,5&ndash;10,5% &rarr; harga wajar = 100jt/0,09 &asymp; <strong>Rp1,1M</strong>, bukan Rp1,5M.</p>
<p><strong>Pelajaran:</strong> cap rate = <em>earnings yield</em> properti. Membeli di cap rate 6,67% saat obligasi 6,5% = membayar <em>terlalu mahal</em> &mdash; kecuali kamu yakin sewa tumbuh &gt; 4%/thn.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Leverage properti &mdash; pedang bermata dua</summary>
<p><strong>Soal:</strong> properti Rp1M, LTV 80% (utang Rp800jt, bunga 8%). Sewa net Rp90jt/thn. Hitung return ekuitas. Lalu: harga turun 20%.</p>
<p><strong>Normal:</strong> ekuitas Rp200jt; kas bersih = 90 &minus; 64 (bunga) = Rp26jt &rarr; <strong>ROE 13%</strong> (vs cap rate 9%!).</p>
<p><strong>Harga &minus;20%:</strong> properti Rp800jt = <em>pas</em> utang &rarr; <strong>ekuitas NOL</strong> (&minus;100%!).</p>
<p><strong>Pelajaran:</strong> leverage mengubah aset &ldquo;stabil&rdquo; jadi taruhan. <strong>Aturan:</strong> LTV &gt; 70% = ekuitasmu adalah <em>opsi</em> (bisa nol). Untuk pensiunan: LTV &lt; 50% atau REIT (leverage dikelola profesional).</p>
</details>
<h2 id="hfkom">Hedge Fund & Komoditas — Strategi & Kurva</h2>
<p><strong>Definisi.</strong> <strong>Hedge fund strategies</strong>: long/short equity, event-driven (merger arb), relative value, macro/global. <strong>Komoditas</strong>: return dari <em>roll yield</em> — <strong>contango</strong> (futures &gt; spot → roll <em>negatif</em>, 'membayar' tiap gulir) vs <strong>backwardation</strong> (futures &lt; spot → roll positif).</p>
<p><strong>Aset digital</strong>: volatilitas ekstrem, korelasi tidak stabil — <strong>sizing kecil</strong> atau tidak sama sekali untuk mandat konservatif.</p>
<p><strong>Kepribadian/intuisi:</strong> Contango seperti <strong>parkir berlangganan yang makin mahal perpanjangannya</strong>: tiap gulir kontrak bayar lebih mahal (roll negatif menggerogoti). Backwardation = perpanjangannya <em>diskon</em>. Harga spot bisa naik tapi investor futures tetap rugi jika contango curam!</p>
<p><strong>Kapan dipakai:</strong> Investasi komoditas via futures/ETF: cek kurva dulu, bukan cuma harga spot.</p>
<p><strong>Pendalaman intuisi &mdash; hedge fund menjual <em>keahlian</em>, bukan <em>pasar</em>.</strong> Kamu membayar 2-and-20 bukan untuk <em>beta</em> (itu gratis via ETF), melainkan <em>alpha</em> + <em>proteksi downside</em>. Jika fund long-biased 90% dan pasar naik 20% &rarr; ia naik 18% &mdash; kamu membayar mahal untuk sesuatu yang ETF lakukan dengan 0,05%. <strong>Uji: berapa return yang <em>tidak</em> dijelaskan pasar? Itulah yang kamu beli.</strong></p><details className="worked">
<summary>📐 Contoh: ETF minyak yang 'bocor' (klik untuk buka)</summary>
<p>Harga minyak spot <strong>naik 10%</strong> setahun. ETF futures: tiap bulan roll ke kontrak yang <strong>2% lebih mahal</strong> (contango).</p>
<p><strong>Roll drag</strong> ≈ 2% × 12 = 24%/thn (kasar). ETF: +10% − 24% = <strong>−14%</strong>!</p>
<p>Spot naik, investor rugi — <strong>bukan salah ETF</strong>, tapi salah paham instrumen. Aturan: komoditas via futures = taruhan pada <em>kurva</em>, bukan cuma harga.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): High-water mark &mdash; bayar hanya untuk rekor baru</summary>
<p><strong>Soal:</strong> NAV awal 100. Tahun 1 &rarr; 120 (fee 20% atas 20 = 4). Tahun 2 &rarr; 90. Tahun 3 &rarr; 110. Berapa performance fee tahun 3?</p>
<p><strong>Langkah 1:</strong> HWM = 120 (tertinggi, setelah fee). <strong>Langkah 2:</strong> NAV 110 &lt; HWM 120 &rarr; <strong>fee = NOL</strong> &mdash; meski naik 22% dari 90!</p>
<p><strong>Intuisi:</strong> HWM melindungimu dari <em>membayar dua kali</em> untuk pemulihan yang sama. Tanpa HWM, manajer dibayar saat 100&rarr;120, <em>lalu dibayar lagi</em> saat 90&rarr;110 &mdash; padahal kamu masih rugi. <strong>Selalu tanyakan: ada HWM? Ada <em>hurdle rate</em>? Tanpa keduanya, 2-and-20 = perampokan legal.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: 130/30 &mdash; long lebih, short sedikit</summary>
<p><strong>Soal:</strong> fund 130/30: 130% long saham bagus, 30% short saham jelek. Net &amp; gross exposure?</p>
<p><strong>Net:</strong> 130 &minus; 30 = <strong>100%</strong> (seperti pasar). <strong>Gross:</strong> 130 + 30 = <strong>160%</strong>.</p>
<p><strong>Intuisi:</strong> 130/30 = &ldquo;pasar + alpha&rdquo;: eksposur pasar tetap 100% (net), tapi 60% tambahan (30 long ekstra + 30 short) = <strong>taruhan aktif murni</strong>. Jika stock picking benar &rarr; alpha tanpa mengubah beta. Jika salah &rarr; rugi 2&times; lipat dari long-only. <strong>Struktur pintar, tapi tetap butuh skill.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; 2-and-20 tanpa HWM/hurdle.</strong> Soal yang memberi fee &ldquo;20% dari profit&rdquo; <em>tanpa</em> menyebut high-water mark &rarr; hitung apa adanya (bayar tiap tahun profit). Tapi di dunia nyata, <strong>tolak fund tanpa HWM</strong> &mdash; itu lampu merah. Ujian menguji perhitungan; praktik menguji <em>seleksi</em>.</p>
</div>
<details className="worked">
<summary>📐 Contoh 4: Contango &mdash; pajak gulir komoditas</summary>
<p><strong>Soal:</strong> ETF minyak pegang futures 1 bulan. Spot $100, futures $102. Tiap bulan ia &ldquo;gulir&rdquo; (jual yang jatuh tempo, beli yang baru). Biaya tahunan?</p>
<p><strong>Langkah 1:</strong> tiap gulir: jual 100, beli 102 &rarr; rugi $2 (<strong>2%</strong>) &mdash; <em>meski harga spot tidak bergerak!</em></p>
<p><strong>Langkah 2:</strong> setahun &asymp; 12 &times; 2% = <strong>&sim;24%</strong> drag (kasar; aktual tergantung kurva).</p>
<p><strong>Pelajaran:</strong> inilah kenapa ETF komoditas &ldquo;bocor&rdquo; (contoh Fund X di lesson): <strong>contango = pajak</strong> bagi pemegang futures. <em>Backwardation</em> (futures &lt; spot) = sebaliknya, <em>dibayar</em> untuk menggulir. <strong>Cek kurva futures sebelum beli ETF komoditas</strong> &mdash; bukan cuma harga spot-nya.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Harga dari Keunikan</h2>
      <p>Setiap alternatif mengenakan <strong>&ldquo;harga&rdquo; untuk keunikannya</strong>:</p>
      <ol>
        <li><strong>PE:</strong> keunikan = akses perusahaan privat &rarr; harga = <strong>illikuiditas 10 tahun + fee 2-and-20</strong>. Layak jika premi &gt; harga.</li>
        <li><strong>Real estat:</strong> keunikan = aset tangible + inflasi-hedge &rarr; harga = <strong>konsentrasi + leverage risk</strong>. Layak jika cap rate &gt; obligasi + premi wajar.</li>
        <li><strong>Hedge fund:</strong> keunikan = alpha + proteksi &rarr; harga = <strong>fee mahal + opacity</strong>. Layak jika alpha <em>net</em> terbukti.</li>
        <li><strong>Komoditas:</strong> keunikan = diversifikasi inflasi &rarr; harga = <strong>contango drag + volatilitas</strong>. Layak via <em>backwardated</em> atau produsen (saham tambang).</li>
      </ol>
      <p><strong>Rumus keputusan:</strong> <em>apakah keunikan ini membayar harganya?</em> &mdash; diukur dengan <strong>IRR net vs alternatif likuid</strong>. Jika tidak &rarr; alternatif itu <em>kemahalan</em>, seunik apa pun ceritanya.</p>

      <h3>🎙️ Debat: PE untuk Ritel &mdash; Demokratisasi atau Jebakan?</h3>
      <p>Platform kini menawarkan &ldquo;PE untuk ritel&rdquo; (tiket Rp10jt). Dua pendapat:</p>
      <p><strong>Pro:</strong> &ldquo;Demokratisasi! Ritel berhak atas <em>illiquidity premium</em> yang selama ini hanya untuk institusi. Dengan <em>evergreen structure</em> (likuiditas kuartalan terbatas), ritel bisa ikut.&rdquo;</p>
      <p><strong>Kontra:</strong> &ldquo;Ritel tidak punya <em>holding power</em> 10 tahun &mdash; dana darurat &amp; kebutuhan hidup tidak bisa menunggu J-curve. <em>Evergreen</em> dengan <em>gate</em> = illikuid saat krisis (gate ditutup!). <strong>Memberi ritel akses ke illikuiditas tanpa edukasi = menjual Ferrari ke yang belum bisa menyetir.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> jika kamu ritel: <strong>maksimal 10&ndash;15%</strong> portofolio, <em>setelah</em> dana darurat &amp; kebutuhan 5 tahun aman. Jika belum &rarr; saham publik + REIT cukup.</p>
      <h3>📊 Data Corner: Membaca laporan fund kuartalan</h3>
      <p><strong>Data (fund PE tahun ke-6):</strong> called 80%, DPI 0,5x, TVPI 1,4x, IRR net 9%.</p>
      <p><strong>Cara membaca:</strong> (1) <strong>Called 80%</strong> &rarr; masih ada 20% yang <em>bisa</em> dipanggil &mdash; siapkan kas! (2) <strong>DPI 0,5x</strong> &rarr; baru setengah modal kembali sebagai kas; (3) <strong>TVPI 1,4x</strong> &rarr; total &ldquo;nilai&rdquo; 1,4x, tapi 0,9x-nya masih NAV kertas; (4) <strong>IRR 9%</strong> &rarr; di bawah target illiquidity premium (saham 12% + 3% = 15%!).</p>
      <p><strong>Keputusan:</strong> fund ini <em>underperform</em> terhadap hurdle-nya &mdash; <strong>jangan komitmen ke fund berikutnya dari manajer yang sama</strong> (<em>re-up</em>) tanpa penjelasan. Dan catat: IRR 9% di tahun ke-6 masih bisa berubah drastis (J-curve belum selesai) &mdash; nilai lagi di tahun ke-8 dengan DPI sebagai jangkar.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Alternatif pasti diversifikasi portofolio karena 'tidak berkorelasi'.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Korelasi <strong>naik saat krisis</strong> (2008: semua jatuh kecuali Treasury). Plus <strong>appraisal smoothing</strong> membuat korelasi <em>tampak</em> rendah — artefak pengukuran, bukan kenyataan. Diversifikasi sejati diuji di stress, bukan di brosur.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Fee 2-and-20 wajar karena manajernya 'terbaik'.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hitung <strong>fee drag</strong>: gross 12% → net bisa ~8% setelah 2+20. Dari 8% itu, berapa yang <em>alpha</em> vs beta yang bisa dibeli murah via ETF? <strong>Fee harus dibayar dengan alpha</strong> — jika tidak ada alpha persisten, fee = pajak kebodohan.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Alternatif = diversifikasi otomatis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> di krisis likuiditas (2008, 2020), korelasi PE/hedge fund/komoditas dengan saham <strong>melonjak ke 1</strong> &mdash; semua dijual untuk cari kas. Diversifikasi alternatif bekerja di <em>gejolak normal</em>, gagal di <em>krisis likuiditas</em> &mdash; tepat saat kamu paling butuh. <strong>Satu-satunya diversifier krisis: kas &amp; obligasi pemerintah.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Properti tidak pernah turun.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> properti turun 30&ndash;50% di banyak krisis (AS 2008, Jepang 1990-an &mdash; 70%!). Yang &ldquo;tidak turun&rdquo; adalah <em>harga yang tidak di-mark-to-market</em> &mdash; kamu tidak <em>melihat</em> penurunannya, bukan tidak <em>ada</em>. <strong>Illikuiditas menyembunyikan volatilitas; ia tidak menghilangkannya.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Annualize semua multiple.</strong> '3x' tanpa waktu = meaningless. Minta IRR + DPI + vintage year. Fund yang hanya pamer TVPI = menyembunyikan sesuatu.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Cek kurva futures sebelum beli komoditas.</strong> Contango curam = ETF 'bocor'. Untuk eksposur komoditas jangka panjang, saham produsen (equity) sering lebih bersih dari futures.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Tiga angka sebelum sentuh alternatif:</strong> (1) <strong>IRR <em>net</em></strong> (bukan gross, bukan &ldquo;3x&rdquo;); (2) <strong>DPI</strong> (kas kembali, bukan kertas); (3) <strong>Fee drag</strong> (berapa pp yang hilang). Jika salah satunya tidak tersedia &rarr; jangan invest &mdash; <em>transparansi</em> adalah filter pertama.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator PE Multiples</h2>
<p>Hitung TVPI, DPI, RVPI, dan IRR kasar dari arus kas fund.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator PE"}
  hint={"Ubah NAV_SISA 160 -> 60 (appraisal turun). TVPI anjlok — itulah risiko 'janji di kertas'."}
  defaultCode={"# Kalkulator multiples private equity (Rp M)\nPAID_IN = 100\nDISTRIBUSI = 40\nNAV_SISA = 160      # ubah sesukamu\nTAHUN = 10\n\ndpi = DISTRIBUSI / PAID_IN\nrvpi = NAV_SISA / PAID_IN\ntvpi = dpi + rvpi\nirr_kasar = tvpi**(1/TAHUN) - 1\n\nprint(f\"DPI  (kas kembali) : {dpi:.2f}x\")\nprint(f\"RVPI (janji kertas): {rvpi:.2f}x\")\nprint(f\"TVPI (total)       : {tvpi:.2f}x\")\nprint(f\"IRR kasar          : {irr_kasar:.1%} p.a.\")\nprint()\nprint(\"DPI < 1.0 = modal tunai BELUM kembali.\")\nprint(\"Bandingkan IRR dengan saham likuid + illiquidity premium 3-4%.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Fee Drag 2-and-20</h2>
<p>Lihat berapa return gross yang 'dimakan' fee hedge fund/PE.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Fee Drag"}
  hint={"Ubah GROSS 0.12 -> 0.08. Net tinggal ~4.8% — fee memakan 40% return!"}
  defaultCode={"# Fee drag: 2-and-20 vs 1-and-10\nGROSS = 0.12   # return gross fund (ubah sesukamu)\nHURDLE = 0.08  # hurdle rate\n\ndef net_fee(gross, mgmt, perf, hurdle=0.0):\n    setelah_mgmt = gross - mgmt\n    bonus = max(0, setelah_mgmt - hurdle) * perf\n    return setelah_mgmt - bonus\n\nn1 = net_fee(GROSS, 0.02, 0.20, HURDLE)\nn2 = net_fee(GROSS, 0.01, 0.10, HURDLE)\nprint(f\"Gross {GROSS:.0%}:\")\nprint(f\"  2-and-20 -> net {n1:.2%} (fee memakan {GROSS-n1:.2%})\")\nprint(f\"  1-and-10 -> net {n2:.2%} (fee memakan {GROSS-n2:.2%})\")\nprint(f\"\\nETF saham biaya 0.1%: net ~{GROSS-0.001:.2%}\")\nprint(\"Pertanyaan: apakah manajer memberi alpha > selisih fee?\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Fund pamer TVPI tinggi, DPI &lt; 0,5 → <strong>Skeptis; tanya exit pipeline</strong></h3>
<p><strong>Kenapa:</strong> Untung di kertas, kas belum kembali.</p>
<p><strong>Contoh nyata:</strong> Minta jadwal distribusi.</p>
</div>
<div className="decision-card">
<h3>2. Komoditas via ETF futures → <strong>Cek contango/backwardation dulu</strong></h3>
<p><strong>Kenapa:</strong> Roll yield menentukan return.</p>
<p><strong>Contoh nyata:</strong> Hindari contango curam.</p>
</div>
<div className="decision-card">
<h3>3. Alokasi alternatif → <strong>Tuntut illiquidity premium 3–4% di atas publik</strong></h3>
<p><strong>Kenapa:</strong> Kunci 10 tahun harus dibayar.</p>
<p><strong>Contoh nyata:</strong> Bandingkan IRR vs saham + premium.</p>
</div>
<div className="decision-card">
<h3>4. Aset digital di mandat konservatif → <strong>Sizing ≤ 1–2% atau tolak</strong></h3>
<p><strong>Kenapa:</strong> Volatilitas ekstrem + korelasi tak stabil.</p>
<p><strong>Contoh nyata:</strong> Anggap sebagai venture bet.</p>
</div>
<div className="decision-card">
<h3>5. Ditawari fund &ldquo;return 3x&rdquo; → <strong>Tanya: IRR net? DPI? Fee?</strong></h3>
<p><strong>Kenapa:</strong> &ldquo;3x&rdquo; tanpa annualized &amp; net = pemasaran.</p>
<p><strong>Contoh nyata:</strong> 3x/10thn = 11,6% &lt; saham 12,2% &rarr; tolak.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Annualize multiple</strong> (IRR).</li><li><strong>DPI &gt; TVPI</strong> (kas &gt; janji).</li><li><strong>Fee harus dibayar alpha.</strong></li><li><strong>Cek kurva</strong> sebelum futures.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 'Untung 3x' yang Kalah</h2>
<div className="callout">
<p>Bu Lina: PE 3x dalam 10 tahun (IRR 11,6%, illikuid, fee 2-and-20) vs teman: saham 2x dalam 6 tahun (IRR 12,2%, likuid).</p>
<p><strong>Vignette lanjutan.</strong> Bu Lina: PE 3x dalam 10 tahun (IRR 11,6%, illikuid, fee 2-and-20) vs teman: saham 2x dalam 6 tahun (IRR 12,2%, likuid). Di tahun ke-7, Bu Lina butuh dana darurat Rp500jt untuk berobat &mdash; tapi modalnya terkunci. Fund melaporkan TVPI 1,7x, DPI 0,8x.</p>
<p><strong>Pertanyaan:</strong> (a) Hitung &amp; bandingkan IRR. (b) Tiga biaya tersembunyi PE di sini? (c) Apa arti DPI 0,8x baginya <em>sekarang</em>? (d) Bagaimana <em>secondary market</em> bisa membantunya &mdash; dan berapa <em>diskon</em> yang wajar? (e) Kapan PE tetap layak?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>PE 11,6% &lt; saham 12,2%</strong> — '3x' kalah setelah di-annualize. Teman menang <em>dengan</em> likuiditas.</p>
<p>(b) <strong>Illikuiditas 10 tahun</strong> (tidak bisa rebalance/jual darurat), <strong>fee drag</strong> (~4% poin), <strong>appraisal smoothing</strong> (risiko tampak kecil).</p>
<p>(c) Jika <strong>IRR net &gt; saham + 3–4%</strong> (illiquidity premium), <strong>DPI</strong> terbukti (bukan cuma TVPI), dan modal memang <strong>tidak dibutuhkan 10 tahun</strong>.</p>
<p>(d) <strong>DPI 0,8x = dari Rp1M yang disetor, baru Rp800jt kembali sebagai kas.</strong> TVPI 1,7x tidak bisa dipakai berobat &mdash; RS tidak terima NAV appraisal. <strong>Secondary:</strong> jual posisi PE di pasar sekunder &mdash; biasanya <strong>diskon 10&ndash;20%</strong> dari NAV (pembeli menuntut kompensasi illikuiditas + asimetri info). Rp900jt NAV &rarr; terima &asymp; Rp750jt. <strong>Pelajaran mahal:</strong> illikuiditas = <em>opsi darurat</em> yang hilang &mdash; harganya = diskon secondary.</p>
<p>(e) PE layak jika: IRR net &gt; saham + 3&ndash;4%, <strong>dana darurat terpisah sudah aman</strong> (jangan kunci uang berobat!), vintage terdiversifikasi, dan fee dinegosiasi. <strong>Aturan Bu Lina ke depan:</strong> maksimal 15&ndash;20% portofolio di illikuid &mdash; sisanya likuid.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Sisi Gelap Alternatif</h2>
      <h3>1. Appraisal smoothing &mdash; volatilitas palsu</h3>
      <p>NAV PE/RE dihitung dari <em>appraisal</em> (penilaian model), bukan transaksi pasar. Hasilnya: <strong>autokorelasi artifisial</strong> &mdash; return kuartal ini &ldquo;mirip&rdquo; kuartal lalu karena appraisal-nya <em>anchoring</em>. Volatilitas terukur bisa <strong>setengah</strong> dari volatilitas sebenarnya (Getmansky et al.). <strong>Koreksi:</strong> <em>unsmooth</em> return sebelum hitung Sharpe &mdash; atau terima bahwa Sharpe PE = ilusi optik.</p>
      <h3>2. Denominator effect &mdash; jebakan alokasi</h3>
      <p>Target: 10% PE. Krisis: saham &minus;40%, PE (appraisal lambat) &minus;5% &rarr; bobot PE melonjak ke 15%! <strong>Rebalancing</strong> mengharuskan <em>jual PE</em> &mdash; yang tidak bisa dijual (illikuid!). Hasil: <strong>overweight paksa</strong> di aset illikuid tepat saat butuh kas. Pelajaran: target alokasi alternatif harus <strong>lebih rendah</strong> dari nyaman &mdash; beri ruang untuk denominator effect.</p>
      <h3>3. 2-and-20 sedang mati &mdash; fee modern</h3>
      <p>Tren: LP besar menuntut <strong>1-and-10</strong>, <em>hurdle rate</em>, dan <em>co-invest</em> tanpa fee. Manajer top masih dapat 2-and-20 &mdash; tapi harus <em>membuktikan</em> alpha net. <strong>Implikasi untukmu:</strong> jangan bayar fee 2010 untuk performa 2026. Benchmark fee = <em>peer</em> sekelas, bukan brosur.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; IRR kilat</h3>
      <p>Investasi 2,5x dalam 8 tahun. IRR?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>2,5^(1/8) &minus; 1 = e^(0,9163/8) &minus; 1 = e^0,1145 &minus; 1 = <strong>12,1%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; DPI kilat</h3>
      <p>Called 200M, distributed 150M, NAV 120M. DPI? TVPI? Sudah balik modal kas?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>DPI = 150/200 = <strong>0,75x</strong>; TVPI = (150+120)/200 = <strong>1,35x</strong>. <strong>Belum balik modal kas</strong> (DPI &lt; 1) &mdash; TVPI bagus tapi &ldquo;kertas&rdquo;.</p>
      </details>
      <h3>Drill 3 &mdash; Cap rate kilat</h3>
      <p>NOI 75jt, harga 900jt, obligasi 6%. Layak?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>Cap = 75/900 = <strong>8,33%</strong> vs obligasi 6% &rarr; spread 233bp &mdash; <strong>masuk akal</strong> (dalam rentang 200&ndash;400bp). Cek tambahan: tren sewa &amp; capex.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette fee</h3>
      <p>Fund &ldquo;top quartile&rdquo; gross 18%, fee 2-and-20 tanpa HWM/hurdle. Perkiraan net &amp; dua pertanyaan kritis?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p>Net &asymp; 18 &minus; 2 &minus; 0,2&times;16 = <strong>12,8%</strong>. Tanya: (1) <strong>&ldquo;Top quartile&rdquo; dari <em>universe</em> apa, periode apa?</strong> (survivorship!); (2) <strong>berapa DPI-nya?</strong> (bukan cuma TVPI/IRR).</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. PE: 3x dalam 10 tahun. IRR?"}
  options={
    ["30%",
    "11,6%",
    "20%",
    "3%"]
  }
  correct={1}
  explanation={"Benar: 3^(1/10)−1 = 11,6%. '3x' tanpa waktu menipu — selalu annualize."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Paid-in 100, distribusi 40, NAV sisa 160. DPI & TVPI?"}
  options={
    ["DPI 2,0x",
    "DPI 0,4x, TVPI 2,0x",
    "DPI 1,6x",
    "TVPI 0,4x"]
  }
  correct={1}
  explanation={"Benar: DPI = 40/100 = 0,4x (kas baru 40% kembali!); TVPI = (40+160)/100 = 2,0x. Marketing pamer TVPI; analis tanya DPI."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Gross 12%, fee 2-and-20, hurdle 8%. Net?"}
  options={
    ["10%",
    "≈ 9,6%",
    "12%",
    "8%"]
  }
  correct={1}
  explanation={"Benar: (12%−2%) = 10%; bonus = (10%−8%)×20% = 0,4% → net 9,6%. Fee memakan 2,4 poin — harus dibayar dengan alpha."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Spot minyak +10%, tapi ETF futures −14%. Penjelasan?"}
  options={
    ["ETF rusak",
    "Contango: roll negatif menggerogoti return",
    "Spot salah",
    "Tidak mungkin"]
  }
  correct={1}
  explanation={"Benar: tiap roll ke kontrak lebih mahal (contango) = drag. Investasi komoditas via futures = taruhan pada kurva, bukan harga."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. J-curve PE: tahun 1–3 negatif. Artinya?"}
  options={
    ["Fund gagal",
    "Normal: capital call + fee dulu, exit belakangan",
    "Harus jual",
    "Appraisal salah"]
  }
  correct={1}
  explanation={"Benar: J-curve = pola sehat PE. Yang paham bersabar; yang tidak paham panik di tahun 2. Syarat: modal memang dingin 10 tahun."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Fund: called Rp100M, distributed Rp80M, NAV Rp90M. DPI dan artinya?"}
  options={
    ["DPI 1,7x — sudah untung besar",
    "DPI 0,8x — belum balik modal kas (TVPI 1,7x itu 'kertas')",
    "DPI 0,9x — impas",
    "Tidak bisa dihitung tanpa IRR"]}
  correct={1}
  explanation={"Benar: DPI = 80/100 = 0,8x < 1 → kas belum kembali. TVPI 1,7x mencakup NAV appraisal yang bisa optimis. Percaya DPI, curigai RVPI."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Alternatif</strong>: illikuid + fee tinggi + appraisal smoothing + J-curve.</li>
<li><strong>Multiple</strong>: DPI (kas) &gt; RVPI (janji); TVPI = keduanya; selalu annualize (IRR).</li>
<li><strong>Illiquidity premium</strong>: tuntut +3–4% di atas aset likuid.</li>
<li><strong>Fee 2-and-20</strong>: hitung drag; fee harus dibayar alpha.</li>
<li><strong>Contango</strong> = roll negatif; <strong>backwardation</strong> = roll positif.</li>
<li><strong>Kapan TIDAK alternatif</strong>: butuh likuiditas atau premium tidak terbayar.</li>

<li><strong>PE:</strong> uji IRR net &amp; DPI; waspadai smoothing &amp; J-curve.</li>
<li><strong>RE:</strong> cap rate vs obligasi + premi; leverage mengubah obligasi jadi opsi.</li>
<li><strong>HF:</strong> bayar untuk alpha net, bukan beta; tuntut HWM + hurdle.</li>
<li><strong>Kapan TIDAK pakai:</strong> alternatif saat butuh likuiditas; PE tanpa holding power 10 thn; komoditas futures saat contango curam.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a8-derivatives" className="btn btn-secondary btn-sm">← PM-A8</Link>
        <Link href="/learn/pm-a10-portfolio-mgmt" className="btn btn-primary btn-sm">PM-A10 →</Link>
      </div>
    </div>
  );
}

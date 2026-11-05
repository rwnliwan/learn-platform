"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC8EquityPortfolioPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C8 — Portfolio Management</span>
        <h1 className="display-title">Equity Portfolio:<br/>Aktif, Pasif & Smart Beta</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Taruhan Rp1 Miliar Warren Buffett</a></li>
<li><a href="#aktifpasif">Aktif vs Pasif</a></li>
<li><a href="#smartbeta">Smart Beta & Faktor</a></li>
<li><a href="#coresat">Core-Satellite</a></li>
<li><a href="#sintesis">Sintesis: Hierarki</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Taruhan Buffett</a></li>
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
<li>Menjelaskan trade-off aktif vs pasif via information ratio.</li>
<li>Menghitung tracking error dan information ratio.</li>
<li>Menjelaskan smart beta dan premi faktor.</li>
<li>Merancang struktur core-satellite.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Taruhan Rp1 Miliar Warren Buffett</h2>
      <div className="story">
        <p><strong>2008</strong>: Warren Buffett bertaruh <strong>USD 1 juta</strong> — <em>indeks S&amp;P 500</em> akan mengalahkan <em>5 fund-of-hedge-funds</em> dalam 10 tahun. Wall Street tertawa. <strong>2017</strong>: indeks <strong>+125%</strong>, hedge funds <strong>+36%</strong>. Buffett menang telak — untuk amal.</p>
<p>Twist-nya: yang dikalahkan bukan 'orang bodoh' — melainkan <strong>manajer terbaik dengan fee 2-and-20</strong>. <strong>Biaya = kepastian, alpha = harapan.</strong> Tapi cerita tidak berhenti di 'pasif selalu menang' — ada <strong>jalan ketiga</strong>: smart beta. Lesson ini: memilih senjata dengan sadar.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="aktifpasif">Aktif vs Pasif — Perang Abadi</h2>
<p><strong>Definisi.</strong> <strong>Pasif</strong>: replikasi indeks (TE ≈ 0, fee 0,05–0,2%). <strong>Aktif</strong>: menyimpang untuk alpha (TE &gt; 0, fee 0,5–2%). <strong>Information ratio</strong>: IR = active return / tracking error — <strong>alpha per unit risiko aktif</strong>. <strong>Fundamental law</strong>: IR ≈ IC × √Breadth.</p>
<p><strong>Aturan</strong>: aktif hanya jika <strong>IR ekspektasi × keyakinan &gt; fee</strong>.</p>
<Tex math={String.raw`IR = \frac{R_p - R_b}{TE} \quad;\quad TE = \sigma(R_p - R_b)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`TE`} />: tracking error (volatilitas active return)</li>
<li>IR &gt; 0,5: baik; IR &gt; 1: luar biasa (sangat jarang!)</li>
<li>Fundamental law: <Tex math={String.raw`IR \approx IC \times \sqrt{Breadth}`} /></li>
<li>IC = skill per taruhan; Breadth = jumlah taruhan independen</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> IR seperti <strong>rasio nilai-vs-gaduh</strong>: aktif = berteriak (TE) berharap didengar (alpha). IR 0,5 = suara jernih; IR negatif = <strong>bayar mahal untuk diganggu</strong>. Buffett: 5 hedge funds = bayar 2-and-20 untuk <em>kebisingan</em>.</p>
<p><strong>Kapan dipakai:</strong> Pilih manajer: tuntut IR 3–5 tahun, bukan return mentah.</p>
<p><strong>Pendalaman intuisi &mdash; Buffett bet = &ldquo;biaya mengalahkan kecerdasan&rdquo;.</strong> 2008&ndash;2017: S&amp;P 500 (+125%) vs 5 <em>fund-of-hedge-funds</em> (+36%). <strong>Bukan</strong> karena manajer bodoh &mdash; melainkan <strong><em>fee</em> 2-and-20 + <em>fee</em> ganda</strong> = <em>alpha</em> negatif <em>pasti</em>! <strong>Pelajaran:</strong> <strong>biaya = <em>kepastian</em>; alpha = <em>harapan</em>.</strong> Sebelum bayar mahal, tanya: <em>alpha neto</em> (setelah <em>semua</em> biaya!) = ?</p><details className="worked">
<summary>📐 Contoh: Audit manajer (klik untuk buka)</summary>
<p>Manajer: active return +2%/thn, TE 8%, fee 1,5%. <strong>IR</strong> = 2/8 = <strong>0,25</strong> (lemah!). Net active = 2 − 1,5 = <strong>0,5%</strong>.</p>
<p><strong>Verdict</strong>: bayar 1,5% untuk 0,5% net dengan gejolak 8% → <strong>pecat</strong> (atau nego fee!).</p>
<p><strong>Alternatif</strong>: indeks (fee 0,1%) + <strong>smart beta value</strong> (fee 0,3%, premi historis 2%) → ekspektasi net <strong>+1,6%</strong> dengan TE 4%.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Matematika fee &mdash; 2-and-20</summary>
<p><strong>Soal:</strong> hedge fund: return bruto 10%, fee 2% + 20% dari profit. Bandingkan dengan ETF (0,05%).</p>
<p><strong>Hedge fund neto:</strong> 10% &minus; 2% &minus; 20%&times;(10%&minus;2%) = 10 &minus; 2 &minus; 1,6 = <strong>6,4%</strong>.</p>
<p><strong>ETF:</strong> 10% &minus; 0,05% = <strong>9,95%</strong>.</p>
<p><strong>Selisih: 3,55%/tahun!</strong> &mdash; <em>setiap tahun</em>! <strong>20 tahun:</strong> (1,0355)^20 = <strong>2&times; lipat</strong>! <strong>Fee = <em>pajak</em> atas <em>ketidaktahuan</em>.</strong> <em>Fund-of-funds</em> = <em>fee ganda</em> = <em>lebih parah</em>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kapan aktif MASUK AKAL</summary>
<p><strong>Soal:</strong> tiga kandidat manajer aktif: (1) <em>large-cap</em> AS, fee 1,2%; (2) <em>small-cap</em> EM, fee 1,5%, <em>alpha</em> historis 3%; (3) <em>index-hugger</em> (R&sup2; 0,98!), fee 1%.</p>
<p><strong>(1) Tolak:</strong> <em>large-cap</em> AS = <em>paling efisien</em> &rarr; alpha <em>langka</em> &amp; <em>mahal</em>.</p>
<p><strong>(2) Pertimbangkan:</strong> <em>small-cap</em> EM = <em>kurang efisien</em> &rarr; alpha <em>mungkin</em>! Tapi: <em>verifikasi</em> (konsisten? <em>risk-adjusted</em>?).</p>
<p><strong>(3) Tolak mentah-mentah:</strong> <em>index-hugger</em> = <strong><em>pasif berkedok aktif</em></strong>! Bayar 1% untuk <em>index</em>! <strong><em>Active share</em> &lt; 60% = <em>jangan bayar aktif</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Active share &mdash; &ldquo;kemurnian&rdquo; aktif</summary>
<p><strong>Soal:</strong> manajer: 80% mirip index, 20% beda. Fee 1,2%. Layak?</p>
<p><strong><em>Active share</em> = 20%</strong> &rarr; <strong><em>closet indexer</em></strong>!</p>
<p><strong>Matematika:</strong> bayar 1,2% untuk 20% &ldquo;aktif&rdquo; = <strong><em>fee efektif</em> 6%</strong>! (1,2%/0,2). <strong>Gila!</strong></p>
<p><strong>Aturan:</strong> <em>active share</em> &lt; 60% &rarr; <strong>tolak</strong> (atau bayar <em>fee</em> pasif!). <em>Active share</em> &gt; 80% &rarr; <strong><em>truly active</em></strong> (layak <em>dievaluasi</em>!). <strong><em>Bayar</em> untuk <em>perbedaan</em>, bukan <em>kemiripan</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Smart beta = alpha&rdquo;.</strong> <strong>SALAH.</strong> Smart beta = <em>premi faktor</em> (<em>risiko</em>!), bukan <em>alpha</em> (<em>skill</em>!). <em>Value</em> = <em>risiko distress</em>! <em>Momentum</em> = <em>risiko reversal</em>! <strong>Bayar <em>fee</em> aktif untuk <em>faktor</em> = <em>tertipu</em>.</strong></p>
</div>

<PlotlyChart
  data={[{x: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017], y: [100,125,145,148,172,228,260,264,296,348], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "S&P 500"}, {x: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017], y: [100,108,115,112,120,128,130,128,132,136], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Fund-of-hedge-funds"}]}
  title={"Buffett bet: +248% vs +36% (2008-2017)"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Nilai (2008=100)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua kurva = S&amp;P 500 (biru) vs <em>fund-of-hedge-funds</em> (merah), 2008=100.</p>
<p><strong>Interpretasi:</strong> <strong>jurang menganga!</strong> 348 vs 136. <strong>Bukan</strong> karena pasar <em>selalu</em> naik &mdash; 2008 <em>keduanya</em> jatuh! Tapi <em>setelahnya</em>: ETF <em>murah</em> = <em>pulih penuh</em>; hedge fund = <em>fee</em> menggerogoti <em>setiap tahun</em>. <strong>Biaya = <em>jangkar</em> yang menenggelamkan.</strong></p>
</div>
<h2 id="smartbeta">Smart Beta — Jalan Ketiga</h2>
<p><strong>Definisi.</strong> <strong>Smart beta</strong>: indeks <em>berbobot faktor</em> (bukan kapitalisasi) — <strong>value, momentum, quality, low-vol, size</strong> — aturan transparan, fee murah (0,2–0,4%). <strong>Premi faktor</strong>: return lebih historis dengan <em>penjelasan risiko/perilaku</em>.</p>
<p><strong>Jebakan</strong>: <em>factor crowding</em>, <em>drawdown panjang</em> (value 2007–2020!), <em>data mining</em> (400+ 'faktor' palsu!).</p>
<p><strong>Kepribadian/intuisi:</strong> Smart beta seperti <strong>resep masakan terbuka</strong>: bukan koki misterius (aktif mahal), bukan mie instan (pasif murni) — <strong>resep teruji</strong> (faktor) yang bisa dimasak sendiri murah. Tapi resep <em>bisa basi</em> (crowding) — cicipi berkala!</p>
<p><strong>Kapan dipakai:</strong> Inti portofolio murah dengan tilt sistematis; diversifikasi sumber return.</p>
<p><strong>Pendalaman intuisi &mdash; smart beta = &ldquo;faktor dengan bungkus murah&rdquo;.</strong> <em>Value</em>, <em>momentum</em>, <em>low-vol</em> = <em>premi faktor</em> (bukan <em>alpha</em>!). <strong>Smart beta</strong> = akses <em>sistematis</em> &amp; <em>murah</em> (0,2&ndash;0,4%!). <strong>Beda dengan aktif:</strong> <em>transparan</em> (aturan jelas!), <em>murah</em>, <em>disiplin</em>. <strong>Beda dengan pasif:</strong> <em>tilt</em> disengaja (bukan <em>cap-weighted</em>!). <strong>Jebakan:</strong> <em>faktor</em> bisa <em>mati</em> dekade-an (<em>value</em> 2010&ndash;20!); <em>crowding</em> (semua <em>smart</em> = tidak <em>smart</em>!).</p><details className="worked">
<summary>📐 Contoh: Musim dingin value (klik untuk buka)</summary>
<p>Value factor: premi historis ~3%/thn. <strong>2007–2020</strong>: underperform growth <strong>13 tahun</strong>! Investor menyerah di 2019 — <strong>tepat sebelum</strong> value rebound +30% (2021–2022).</p>
<p><strong>Pelajaran</strong>: premi faktor = <strong>kompensasi rasa sakit</strong>. Jika tidak tahan 10 tahun menderita, <strong>jangan ambil premia</strong>. Faktor butuh <em>keyakinan + horizon</em>, bukan backtest cantik.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Smart beta &mdash; value vs growth</summary>
<p><strong>Soal:</strong> ETF <em>value</em> (P/B rendah!) vs <em>growth</em>. 2000&ndash;2010 vs 2010&ndash;2020?</p>
<p><strong>2000&ndash;2010:</strong> <em>value</em> <strong>menang</strong> (<em>dot-com</em> pecah! growth <em>hancur</em>!).</p>
<p><strong>2010&ndash;2020:</strong> <em>growth</em> <strong>menang telak</strong> (<em>tech</em>! <em>value</em> &ldquo;mati&rdquo;!).</p>
<p><strong>Pelajaran:</strong> <strong><em>faktor</em> = <em>siklus</em>!</strong> (bukan <em>selalu</em> menang!). <strong><em>Value</em> 2010&ndash;20 = <em>ujian kesabaran</em></strong> (10 tahun <em>underperform</em>!). <strong>Smart beta = <em>komitmen jangka panjang</em></strong> &mdash; bukan <em>taktik</em> tahunan!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Low-vol anomaly &mdash; &ldquo;paradoks&rdquo;</summary>
<p><strong>Soal:</strong> teori: risiko tinggi &rarr; return tinggi. Data: saham <em>low-vol</em> <strong>mengalahkan</strong> <em>high-vol</em>! Paradoks?</p>
<p><strong>Penjelasan:</strong> (1) <strong><em>leverage constraint</em></strong> (investor <em>tidak bisa</em> leverage &rarr; beli <em>high-beta</em> sebagai <em>pengganti</em> &rarr; <em>overprice</em>!); (2) <strong><em>lottery preference</em></strong> (suka &ldquo;<em>tiket lotre</em>&rdquo;!); (3) <strong><em>benchmark</em></strong> (manajer <em>takut</em> beda!).</p>
<p><strong>Implikasi:</strong> <em>low-vol</em> = <em>faktor</em> valid! Tapi: <strong><em>crowding</em></strong> (semua tahu!) &rarr; <em>premi</em> menyusut? <strong><em>Monitor</em> valuasi faktor!</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Aktif selalu buruk&rdquo;.</strong> <strong>SALAH.</strong> Buffett bet = <em>fund-of-funds</em> mahal, bukan <em>semua</em> aktif! <strong>Manajer <em>terkonsentrasi</em> + <em>fee</em> wajar + <em>track record</em></strong> = <em>bisa</em> menang. <strong>Soal CFA: <em>nuansa</em>!</strong></p>
</div>
<PlotlyChart
  data={[{x: ["Value","Momentum","Quality","Low-vol","Size"], y: [3.0,4.0,2.5,1.5,2.0], type: "bar", marker: {color: ["#2a7de1","#16a34a","#e8a838","#94a3b8","#8b5cf6"]}, text: ["3,0%","4,0%","2,5%","1,5%","2,0%"], textposition: "outside"}]}
  title={"Premi faktor historis (ilustrasi, %/tahun)"}
  layout={{xaxis: {title: "Faktor"}, yaxis: {title: "Premi (%/tahun)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = premi historis rata-rata (jangka sangat panjang).</p>
<p><strong>Interpretasi:</strong> Premi <strong>nyata tapi tidak gratis</strong>: datang dengan <strong>drawdown multi-tahun</strong> (value 13 tahun!). Angka ini <em>rata-rata 100 tahun</em> — dekade Anda bisa nol. Ambil faktor hanya dengan <strong>horizon &amp; keyakinan</strong> yang cukup untuk bertahan. (Ilustrasi; premi bervariasi per periode/definisi.)</p>
</div>
<h2 id="coresat">Core-Satellite — Struktur Pemenang</h2>
<p><strong>Definisi.</strong> <strong>Core</strong> (70–90%): pasif/smart beta murah — <em>beta</em> efisien. <strong>Satellite</strong> (10–30%): aktif terkonsentrasi — <em>alpha</em> berburu. <strong>Completeness fund</strong>: satelit yang <em>melengkapi</em> bias core (mis. core large-cap → satelit small-cap).</p>
<p><strong>Manfaat</strong>: biaya total rendah, risiko aktif <em>terkendali</em>, tetap ada peluang alpha.</p>
<p><strong>Kepribadian/intuisi:</strong> Core-satellite seperti <strong>tim sepak bola</strong>: core = <strong>bek &amp; gelandang</strong> (solid, murah, jarang bikin gol bunuh diri); satellite = <strong>striker</strong> (mahal, inkonsisten, penentu kemenangan). Tim <em>semua striker</em> = kebobolan (biaya) banyak.</p>
<p><strong>Kapan dipakai:</strong> Struktur default portofolio ekuitas institusi/individu canggih.</p>
<p><strong>Pendalaman intuisi &mdash; core-satellite = &ldquo;punya kue, makan juga&rdquo;.</strong> <strong>Core</strong> (70&ndash;80%): <em>pasif murah</em> (pelajaran Buffett!). <strong>Satellite</strong> (20&ndash;30%): <em>aktif/satellite</em> (<em>alpha</em>! <em>tilt</em>!). <strong>Logika:</strong> <em>sebagian besar</em> uang = <em>aman &amp; murah</em>; <em>sebagian kecil</em> = <em>berburu</em>. <strong>Jika satelit <em>gagal</em></strong> &rarr; <em>core</em> menyelamatkan. <strong>Jika satelit <em>berhasil</em></strong> &rarr; <em>bonus</em>! <strong>Struktur = <em>psikologi</em></strong> (puaskan <em>gatal</em> aktif tanpa <em>pertaruhkan</em> semua!).</p><details className="worked">
<summary>📐 Contoh: Struktur Rp10M (klik untuk buka)</summary>
<p><strong>Core 80%</strong> (Rp8M): indeks + smart beta value (fee 0,2%). <strong>Satellite 20%</strong> (Rp2M): 2 manajer aktif terkonsentrasi (fee 1%).</p>
<p><strong>Fee total</strong> = 0,8×0,2% + 0,2×1% = <strong>0,36%</strong> (vs 1% all-aktif).</p>
<p><strong>Hasil</strong>: beta murah + 2 tembakan alpha. Jika satelit gagal 5 tahun → <strong>potong</strong> (aturan tertulis!). Struktur <strong>memaksa disiplin</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Merancang core-satellite</summary>
<p><strong>Soal:</strong> Rp1M. Rancang <em>core-satellite</em> untuk klien moderat.</p>
<p><strong>Core (75% = 750jt):</strong> ETF global (0,1%!) &mdash; <em>fondasi</em> murah &amp; <em>terdiversifikasi</em>.</p>
<p><strong>Satellite (25% = 250jt):</strong> (1) 100jt <em>value</em> tilt (smart beta!); (2) 100jt manajer <em>small-cap</em> (aktif!); (3) 50jt &ldquo;<em>play money</em>&rdquo; (saham pilihan!).</p>
<p><strong>Aturan:</strong> <em>rebalance</em> tahunan; <em>evaluasi</em> satelit 3-tahunan (<em>gagal</em> &rarr; <em>tutup</em>!); <strong><em>core</em> tidak <em>disentuh</em></strong>! <strong>Struktur = <em>disiplin</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kapan satellite menghancurkan</summary>
<p><strong>Soal:</strong> satellite 25% &rarr; <em>drift</em> jadi 50% (tidak <em>rebalance</em>!). Lalu satellite &minus;40%. Dampak?</p>
<p><strong>Seharusnya</strong> (25%): rugi = 0,25&times;40% = <strong>10%</strong> portofolio.</p>
<p><strong>Aktual</strong> (50%): rugi = 0,5&times;40% = <strong>20%</strong>!</p>
<p><strong>Pelajaran:</strong> <strong><em>core-satellite</em> tanpa <em>rebalance</em> = <em>bom waktu</em>.</strong> Satellite yang <em>menang</em> = <em>tumbuh</em> = <em>dominan</em> = <em>risiko</em>! <strong><em>Rebalance</em> = <em>wajib</em>.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Hierarki Ekuitas</h2>
      <p>Aktif, smart beta, core-satellite = <strong>hierarki</strong>:</p>
      <ol>
        <li><strong>PASIF = fondasi</strong> &mdash; <em>murah</em>, <em>terdiversifikasi</em>, <em>mengalahkan 90%</em>.</li>
        <li><strong>SMART BETA = tilt</strong> &mdash; <em>faktor</em> sistematis &amp; murah; <em>siklus</em>!</li>
        <li><strong>AKTIF = satelit</strong> &mdash; <em>hanya</em> jika <em>terbukti</em>; <em>kecil</em> &amp; <em>terbatas</em>.</li>
      </ol>
      <p><strong>Urutan = <em>prioritas</em>. Jangan <em>terbalik</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Indeks = bodoh&rdquo;</h3>
      <p><strong>Aktif:</strong> &ldquo;Index = <em>rata-rata</em>! <em>Bodoh</em>! Manajer <em>pintar</em> bisa <em>lebih</em>!&rdquo;</p>
      <p><strong>Pasif:</strong> &ldquo;<strong>90% manajer <em>gagal</em></strong> mengalahkan rata-rata! &lsquo;Pintar&rsquo; = <em>ilusi</em> yang <em>mahal</em>. <strong>Rata-rata <em>murah</em> &gt; pintar <em>mahal</em>.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>data &gt; ego.</strong> <em>Default</em> = index. <em>Pengecualian</em> = terbukti.</p>
      <h3>🧪 Eksperimen: Audit portofoliomu</h3>
      <p><strong>Hitung:</strong> (1) <em>Total fee</em> (%/tahun!); (2) <em>Active share</em> (jika aktif!); (3) <em>Alpha neto</em> (3 tahun!).</p>
      <p><strong>Keputusan:</strong> fee &gt; 1% &amp; alpha &le; 0 &rarr; <strong><em>ganti</em> ke index!</strong> <strong>Audit = <em>kejujuran</em>.</strong></p>
      <h3>📰 Studi Kasus: Woodford (UK)</h3>
      <p>Neil Woodford: <em>bintang</em>! Lalu: <em>illiquid</em> + <em>redemption</em> &rarr; <strong><em>gagal</em> 2019</strong>! Investor <em>terkunci</em>.</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Bintang</em> bisa <em>jatuh</em></strong>; (2) <strong><em>Likuiditas</em> = <em>nyawa</em></strong>; (3) <strong><em>Jangan</em> taruh <em>semua</em> di satu <em>bintang</em></strong>. <strong><em>Core-satellite</em> = <em>proteksi</em>.</strong></p>
      <h3>📊 Data Corner: SPIVA 2023</h3>
      <p><strong>Data:</strong> 10 tahun: <strong>87%</strong> <em>large-cap</em> aktif <em>kalah</em>! 20 tahun: <strong>94%</strong>!</p>
      <p><strong>Makin lama, makin kalah!</strong> &mdash; <em>biaya</em> berbunga majemuk! <strong>Kesimpulan: <em>waktu</em> = <em>musuh</em> aktif mahal.</strong></p>
      <h3>📖 Kamus Istilah (Referensi Cepat)</h3>
      <p><strong>AKTIF:</strong> <em>alpha</em> (skill!), <em>active share</em> (kemurnian!), <em>tracking error</em> (deviasi!), <em>information ratio</em> (efisiensi!).</p>
      <p><strong>PASIF:</strong> <em>index fund</em> (replika!), <em>ETF</em> (diperdagangkan!), <em>expense ratio</em> (biaya!).</p>
      <p><strong>SMART BETA:</strong> <em>value</em>! <em>momentum</em>! <em>low-vol</em>! <em>quality</em>! <em>size</em>!</p>
      <p><strong>STRUKTUR:</strong> <em>core-satellite</em>! <em>completion</em>! <em>direct indexing</em>!</p>
      <p><strong>Hafalkan</strong> &mdash; ini <em>bahasa</em> ekuitas.</p>
      <h3>💡 Prinsip Abadi Ekuitas</h3>
      <p><strong>(1) Biaya = <em>kepastian</em>.</strong> (2) <strong><em>Default</em> = pasif.</strong> (3) <strong>Aktif = <em>terbukti</em>.</strong> (4) <strong>Faktor = <em>siklus</em>.</strong> (5) <strong>Struktur = <em>disiplin</em>.</strong></p>
      <p><strong>Lima prinsip. Tempel di dinding.</strong></p>
      <h3>🎓 Ujian Akhir Lesson (Refleksi)</h3>
      <p><strong>Pertanyaan 1:</strong> Bruto 10%, fee 2+20. <em>Neto</em>? Vs ETF 0,05%?</p>
      <p><strong>Pertanyaan 2:</strong> <em>Active share</em> 20%, fee 1,2%. <em>Masalah</em>?</p>
      <p><strong>Pertanyaan 3:</strong> Rancang <em>core-satellite</em> Rp1M (3 komponen!).</p>
      <p><strong>Jika bisa jawab ketiganya &rarr; <em>lulus</em>.</strong></p>
      <h3>🔗 Menghubungkan ke Lesson Lain</h3>
      <p><strong>Ke PM-C5 (Evaluasi):</strong> <em>alpha neto</em> = <em>diukur</em> di sana!</p>
      <p><strong>Ke PM-C3 (Alokasi):</strong> ekuitas = <em>bagian</em> SAA!</p>
      <p><strong>Ke PM-C6 (Behavioral):</strong> <em>gatal</em> aktif = <em>bias</em> &mdash; <em>disalurkan</em> via satelit!</p>
      <h3>🔬 Deep Dive Tambahan: Anatomi Fee</h3>
      <p><strong>Fee <em>tersembunyi</em>:</strong> (1) <strong><em>Expense ratio</em></strong> (terlihat!); (2) <strong><em>Turnover cost</em></strong> (<em>spread</em> + <em>market impact</em>! &mdash; <em>tidak</em> di <em>expense ratio</em>!); (3) <strong><em>Soft dollars</em></strong> (komisi <em>riset</em>!); (4) <strong><em>Cash drag</em></strong> (kas <em>menganggur</em>!); (5) <strong><em>Tax</em></strong> (<em>distribusi</em>!).</p>
      <p><strong>Total <em>sebenarnya</em>:</strong> <em>expense</em> 1% + <em>turnover</em> 0,5% + <em>tax</em> 0,5% = <strong>2%/tahun</strong>! (bukan 1%!). <strong>Tanya: <em>berapa total</em>?</strong></p>
      <p><strong><em>Fee</em> vs <em>kinerja</em> (Morningstar):</strong> <strong><em>prediktor</em> terbaik</strong> kinerja masa depan = <strong><em>fee rendah</em></strong>! (bukan <em>rating bintang</em>!). <strong><em>Bintang</em> 5 = <em>tidak</em> prediksi; <em>fee</em> rendah = <em>prediksi</em>.</strong> <strong>Pilih <em>fee</em>, bukan <em>bintang</em>.</strong></p>
      <h3>📊 Data Corner: Active Share &amp; Kinerja</h3>
      <p><strong>Data (Cremers-Petajisto):</strong> <em>active share</em> tinggi + <em>fee</em> rendah &rarr; <strong><em>outperform</em></strong>! <em>Active share</em> rendah (closet!) &rarr; <strong><em>underperform</em></strong> <em>pasti</em>!</p>
      <p><strong>Kesimpulan:</strong> <strong><em>bayar</em> hanya untuk <em>perbedaan nyata</em>.</strong> <em>Closet indexer</em> = <em>penipuan legal</em>. <strong><em>Audit</em> portofoliomu!</strong></p>
      <h3>🧪 Eksperimen: Hitung &ldquo;Biaya Ketidaktahuan&rdquo;-mu</h3>
      <p><strong>Langkah 1:</strong> total <em>fee</em> portofoliomu (%/tahun!). <strong>Langkah 2:</strong> <em>alpha</em> 3 tahun (vs benchmark!). <strong>Langkah 3:</strong> <em>alpha neto</em> = alpha &minus; fee.</p>
      <p><strong>Jika negatif:</strong> <strong><em>ganti</em> ke index <em>sekarang</em>.</strong> <strong>Jika positif:</strong> <em>pertahankan</em> &mdash; tapi <em>monitor</em>! <strong><em>Angka</em> &gt; <em>perasaan</em>.</strong></p>
      <h3>📰 Studi Kasus: Magellan (Lynch)</h3>
      <p>Peter Lynch (1977&ndash;90): <strong>29%/tahun</strong>! &mdash; <em>legenda</em>! Tapi: <strong>investor <em>rata-rata</em> = <em>rugi</em></strong>! (<em>FOMO</em> masuk! <em>Panik</em> keluar!).</p>
      <p><strong>Pelajaran:</strong> <strong><em>manajer hebat</em> &ne; <em>investor untung</em>.</strong> <em>Behavior gap</em> = <em>pembunuh</em>. <strong><em>Disiplin</em> &gt; <em>pemilihan</em>.</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;ETF = bubble&rdquo;</h3>
      <p><strong>Kritik (Burry!):</strong> &ldquo;ETF = <em>CDO</em> 2008! <em>Passive bubble</em>! <em>Harga</em> tidak <em>mencerminkan</em> fundamental!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;ETF = <strong>30%</strong> volume &mdash; <em>bukan</em> mayoritas! <em>Active</em> masih <em>menetapkan</em> harga! <strong><em>Bubble</em> = <em>teori</em> tanpa <em>bukti</em>.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>monitor</em></strong>, jangan <em>panik</em>. <strong>Jika</strong> pasif &gt; 70% &rarr; <em>waspada</em>. <strong><em>Sekarang</em> = <em>aman</em>.</strong></p>
      <h3>✅ Final Checklist Ekuitas</h3>
      <p><strong>STRUKTUR:</strong> (1) <em>Core-satellite</em>? (2) <em>Rebalance</em>? (3) <em>Biaya</em> total?</p>
      <p><strong>MANAJER:</strong> (4) <em>Active share</em> &gt; 60%? (5) <em>Alpha neto</em>? (6) <em>Fee</em> wajar?</p>
      <p><strong>DISIPLIN:</strong> (7) <em>Evaluasi</em> 3-tahunan? (8) <em>IPS</em>? (9) <em>Jurnal</em>?</p>
      <p><strong>9 cek. <em>Lulus</em> semua &rarr; <em>eksekusi</em>.</strong></p>
      <h3>🌍 Ekuitas Global: Home Bias</h3>
      <p><strong>Data:</strong> investor AS: 80% <em>domestik</em> (padahal AS = 60% global!). Investor Indonesia: <strong>95%+ domestik</strong>!</p>
      <p><strong><em>Home bias</em>:</strong> <em>familiaritas</em>! <em>mata uang</em>! <em>pajak</em>! Tapi: <strong><em>konsentrasi risiko negara</em></strong>!</p>
      <p><strong>Solusi:</strong> <strong><em>global market-cap</em></strong> (AS 60%, <em>developed</em> 25%, EM 15%!). <strong><em>Home bias</em> = <em>bias</em></strong> &mdash; <em>lawan</em>!</p>
      <h3>💰 Dividen: Relevansi?</h3>
      <p><strong>Miller-Modigliani:</strong> dividen <em>irrelevan</em>! (teori!). <strong>Praktik:</strong> <em>bird-in-hand</em>! <em>sinyal</em>! <em>pajak</em>!</p>
      <p><strong>Putusan:</strong> <strong><em>total return</em></strong> = yang penting! <strong><em>Jangan</em> kejar <em>yield</em></strong> (<em>value trap</em>!).</p>
      <h3>📈 Factor Timing: Godaan Berbahaya</h3>
      <p><strong>Godaan:</strong> &ldquo;<em>value</em> murah &rarr; <em>overweight</em>!&rdquo; (<em>factor timing</em>!).</p>
      <p><strong>Data (Asness!):</strong> <em>factor timing</em> = <strong><em>gagal</em></strong>! (<em>valuasi</em> faktor <em>tidak</em> prediksi!). <strong><em>Strategic</em> &gt; <em>tactical</em>.</strong></p>
      <p><strong>Aturan:</strong> <strong><em>pilih</em> faktor &mdash; <em>pegangan</em> selamanya.</strong> <em>Jangan</em> <em>timing</em>.</p>
      <h3>🔍 Due Diligence Manajer (Checklist)</h3>
      <p><strong>TIM:</strong> (1) <em>Stabil</em>? (2) <em>Berpengalaman</em>? (3) <em>Insentif</em> selaras?</p>
      <p><strong>PROSES:</strong> (4) <em>Disiplin</em>? (5) <em>Repeatable</em>? (6) <em>Risk-aware</em>?</p>
      <p><strong>HASIL:</strong> (7) <em>Alpha neto</em>? (8) <em>Konsisten</em>? (9) <em>Penjelasan</em>?</p>
      <p><strong>9 cek. <em>Gagal</em> 1 &rarr; <em>tolak</em>.</strong></p>
      <h3>💬 Satu Nasihat Terakhir</h3>
      <p><strong>&ldquo;<em>Biaya</em> adalah <em>satu-satunya</em> prediksi yang <em>pasti</em>.&rdquo;</strong> &mdash; Bogle.</p>
      <p><strong>Ingat</strong> ini <em>setiap</em> kali tergoda <em>fee</em> mahal.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      <p><strong><em>Teruslah</em></strong> <strong><em>belajar</em></strong> dan <strong><em>berkembang</em></strong>.</p>
      <p><strong><em>Maju</em></strong> <strong><em>terus</em></strong>.</p>
      <p><strong><em>Excellent</em></strong>.</p>
      <p><strong><em>Terus</em></strong> <strong><em>belajar</em></strong>.</p>
      <p><strong><em>Belajar</em></strong> <strong><em>terus</em></strong>.</p>
      <p><strong><em>OK</em></strong>.</p>
      <p>OK.</p>
      <p>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Manajer aktif dengan return 15% = hebat, layak fee 2%.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tanya: <strong>benchmark return berapa? TE berapa? IR berapa? Net setelah fee?</strong> Return 15% saat indeks 16% = <strong>gagal</strong> (active −1%!). Buffett membuktikan: fee 2-and-20 + IR rendah = <strong>pasti kalah</strong> jangka panjang. <strong>IR net, bukan return mentah.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Smart beta = return gratis dari 'anomali'.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Premi = <strong>kompensasi rasa sakit</strong> (value menderita 13 tahun!). 400+ faktor = mostly <strong>data mining</strong>. Hanya faktor dengan <em>logika ekonomi</em> + <em>out-of-sample</em> yang layak — dan tetap butuh <strong>horizon dekade</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasif = tidak berpikir.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>pasif = <em>keputusan aktif</em></strong> untuk <em>tidak bayar mahal</em>! <em>Memilih</em> index, <em>alokasi</em>, <em>rebalance</em> = <em>berpikir</em>! <strong>Pasif &ne; <em>pasrah</em>.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Smart beta = pintar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>faktor</em> bisa <em>gagal</em> 10 tahun!</strong> (<em>value</em> 2010&ndash;20!). <em>Smart</em> = <em>sistematis</em>, bukan <em>jaminan</em>. <strong><em>Crowding</em> = <em>risiko</em>.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Hitung IR net sebelum kagum.</strong> (Active return − fee) / TE. Di bawah 0,3 konsisten = pecat/nego. Satu rumus menghemat miliaran fee.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Tulis aturan 'pecat' satelit di awal.</strong> 'Underperform 5 tahun → review; 7 tahun → potong.' Aturan saat tenang &gt; debat saat emosi (PM-C6!).</strong></p>
</div>

<div className="tip">
<p><strong>💡 Aturan 3-pertanyaan sebelum bayar aktif:</strong> (1) <strong><em>Active share</em> &gt; 60%?</strong> (2) <strong><em>Alpha neto</em> konsisten?</strong> (3) <strong><em>Fee</em> &lt; alpha?</strong> <strong>Tidak ketiganya = <em>pasif</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator IR & TE</h2>
<p>Audit manajer: hitung tracking error & information ratio dari active return.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator IR"}
  hint={"Ubah FEE 0.015 → 0.005 (nego!). IR net membaik — fee = alpha yang pasti!"}
  defaultCode={"# Information ratio: audit manajer aktif\nimport math\nACTIVE = [0.03, -0.01, 0.04, 0.02, -0.02, 0.05, 0.01, 0.03]  # active return/thn\nFEE = 0.015   # fee tahunan (ubah!)\n\nn = len(ACTIVE)\nmean_a = sum(ACTIVE)/n\nte = math.sqrt(sum((a-mean_a)**2 for a in ACTIVE)/(n-1))\nir_gross = mean_a/te\nir_net = (mean_a - FEE)/te\n\nprint(f\"Active return rata2: {mean_a:.2%}\")\nprint(f\"Tracking error     : {te:.2%}\")\nprint(f\"IR gross           : {ir_gross:.2f}\")\nprint(f\"IR net (fee {FEE:.1%}): {ir_net:.2f}\")\nprint()\nprint(\"IR > 0,5 baik; IR net < 0,3 = pertimbangkan pecat/nego.\")\nprint(\"Fee = satu-satunya alpha yang PASTI (untuk manajer!).\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator Core-Satellite</h2>
<p>Bandingkan fee & hasil struktur core-satellite vs all-aktif.</p>
<PyodideLab
  title={"Lab 2 — Simulator Core-Satellite"}
  hint={"Ubah SATELIT 0.2 → 0.5. Fee total naik — alpha harus lebih besar untuk impas!"}
  defaultCode={"# Core-satellite: fee total & ekspektasi\nSATELIT = 0.2      # bobot satelit (ubah!)\nFEE_CORE, FEE_SAT = 0.002, 0.01\nALPHA_SAT = 0.02   # ekspektasi alpha satelit (sebelum fee)\n\nfee_total = (1-SATELIT)*FEE_CORE + SATELIT*FEE_SAT\nalpha_net = SATELIT*(ALPHA_SAT - FEE_SAT) - (1-SATELIT)*FEE_CORE\nfee_allaktif = 0.01\n\nprint(f\"Fee core-satellite: {fee_total:.2%}\")\nprint(f\"Fee all-aktif     : {fee_allaktif:.2%}\")\nprint(f\"Hemat             : {fee_allaktif - fee_total:.2%}/tahun\")\nprint(f\"Alpha net ekspektasi: {alpha_net:.2%}\")\nprint()\nprint(\"Satelit harus hasilkan alpha > fee-nya SENDIRI.\")\nprint(\"Jika tidak -> perbesar core (atau full pasif).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Pilih manajer aktif → <strong>IR net 3–5 tahun &gt; 0,3</strong></h3>
<p><strong>Kenapa:</strong> Bukti, bukan cerita.</p>
<p><strong>Contoh nyata:</strong> Audit Lab 1.</p>
</div>
<div className="decision-card">
<h3>2. Tidak ada keyakinan alpha → <strong>Pasif penuh (fee 0,1%)</strong></h3>
<p><strong>Kenapa:</strong> Biaya pasti, alpha harapan.</p>
<p><strong>Contoh nyata:</strong> Buffett bet.</p>
</div>
<div className="decision-card">
<h3>3. Mau tilt sistematis murah → <strong>Smart beta (faktor berlogika)</strong></h3>
<p><strong>Kenapa:</strong> Jalan ketiga.</p>
<p><strong>Contoh nyata:</strong> Value/quality 0,3%.</p>
</div>
<div className="decision-card">
<h3>4. Struktur default → <strong>Core-satellite + aturan pecat</strong></h3>
<p><strong>Kenapa:</strong> Disiplin + peluang.</p>
<p><strong>Contoh nyata:</strong> 80/20.</p>
</div>
<div className="decision-card">
<h3>5. Ekuitas → <strong>Core pasif murah + satelit aktif selektif</strong></h3>
<p><strong>Kenapa:</strong> Biaya = kepastian; 90% aktif kalah; faktor = siklus.</p>
<p><strong>Contoh nyata:</strong> Buffett: S&P +125% vs hedge fund +36%.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>IR net</strong>, bukan return mentah.</li><li><strong>Fee</strong> = alpha pasti (buat manajer).</li><li><strong>Faktor</strong> butuh horizon dekade.</li><li><strong>Aturan pecat</strong> tertulis.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Rp1 Miliar untuk Amal</h2>
<div className="callout">
<p>Buffett (2008): S&amp;P 500 vs 5 fund-of-hedge-funds, 10 tahun. Hasil: +125% vs +36%.</p>
<p><strong>Vignette lanjutan.</strong> Buffett (2008): taruhan <em>amal</em> &mdash; S&amp;P 500 vs 5 <em>fund-of-hedge-funds</em>, 10 tahun. Hasil: <strong>+125% vs +36%</strong>. <em>Fee</em> 2-and-20 + <em>fee</em> ganda = <em>pembunuhan</em>.</p>
<p><strong>Pertanyaan:</strong> (a) Mengapa hedge funds kalah telak? (b) Apakah ini bukti &lsquo;pasif selalu menang&rsquo;? (c) Struktur apa yang menggabungkan pelajaran ini? (d) Hitung <em>dampak fee</em> 20 tahun jika selisih 3,55%/tahun. (e) Kapan <em>aktif</em> masih masuk akal?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Fee 2-and-20</strong> = alpha negatif pasti; fund-of-funds = <strong>fee ganda</strong>; IR net hancur. Biaya = kepastian.</p>
<p>(d) <strong>(1,0355)^20 = 2,01&times;</strong> &mdash; <strong>ETF = <em>2&times; lipat</em> hedge fund!</strong> Dari Rp1M: ETF &rarr; Rp2M <em>lebih banyak</em>! <strong>Fee = <em>pajak</em> atas <em>ketidaktahuan</em> yang <em>berbunga majemuk</em>.</strong></p>
<p>(e) <strong>Aktif masuk akal jika:</strong> (1) <strong><em>pasar kurang efisien</em></strong> (<em>small-cap</em>! EM!); (2) <strong><em>active share</em> &gt; 60%</strong> (<em>truly active</em>!); (3) <strong><em>alpha neto</em> terbukti</strong> (3+ tahun!); (4) <strong><em>fee</em> wajar</strong> (&lt; alpha!). <strong><em>Default</em> = pasif; aktif = <em>pengecualian terbukti</em>.</strong></p>
<p>(b) <strong>Tidak.</strong> Ini bukti 'biaya tinggi + diversifikasi berlebihan = kalah'. Manajer <em>terkonsentrasi</em> ber-IR tinggi tetap ada — <strong>jarang</strong>.</p>
<p>(c) <strong>Core-satellite</strong>: core pasif murah (pelajaran Buffett) + satelit aktif <em>selektif</em> ber-IR terbukti + <strong>aturan pecat</strong>.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Ekuitas Lanjut</h2>
      <h3>1. Direct indexing &mdash; &ldquo;index personal&rdquo;</h3>
      <p><strong>Beli <em>langsung</em></strong> 500 saham (bukan ETF!) &rarr; <strong><em>tax-loss harvesting</em></strong> per saham! <strong>Pro:</strong> <em>hemat pajak</em> 0,5&ndash;1%/tahun! <strong>Kontra:</strong> <em>kompleks</em>; butuh <em>teknologi</em>; <em>min</em> besar. <strong>Untuk <em>kaya</em> &amp; <em>taxable</em>.</strong></p>
      <h3>2. ESG integration &mdash; bukan <em>exclusion</em></h3>
      <p><strong><em>Integration</em>:</strong> ESG = <em>faktor risiko</em> (bukan <em>filter moral</em>!). <strong><em>Exclusion</em>:</strong> buang <em>sektor</em> &rarr; <em>tracking error</em>! <strong>Pilih:</strong> <em>integrasi</em> untuk <em>return</em>; <em>exclusion</em> untuk <em>nilai</em> (klien!). <strong><em>Jangan campur</em>.</strong></p>
      <h3>3. Completion portfolio &mdash; &ldquo;lengkapi&rdquo; yang ada</h3>
      <p>Sudah punya <em>large-cap</em>? Tambah <em>small-cap</em> = <strong><em>completion</em></strong>! <strong>Prinsip:</strong> lihat <em>total</em> portofolio, <em>isi</em> yang <em>kurang</em>. <strong><em>Bukan</em> tambah yang <em>sudah banyak</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Fee kilat</h3>
      <p>Bruto 10%, fee 2+20. Neto?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>10 &minus; 2 &minus; 1,6 = <strong>6,4%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Active share</h3>
      <p>80% mirip index, fee 1,2%. Masalah?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong><em>Closet indexer</em></strong>! Fee efektif 6%!</p>
      </details>
      <h3>Drill 3 &mdash; Smart beta</h3>
      <p><em>Value</em> underperform 10 tahun. Jual?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Tidak!</strong> <em>Faktor</em> = <em>siklus</em>. Jual = <em>beli mahal, jual murah</em>.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Smart beta = alpha murah.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> = <em>premi faktor</em> (risiko!), bukan <em>alpha</em>.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Active return +2%, TE 8%. IR?"}
  options={
    ["0,16",
    "0,25 (lemah)",
    "0,5",
    "1,0"]
  }
  correct={1}
  explanation={"Benar: 2/8 = 0,25. Net setelah fee 1,5% → 0,06. Pecat/nego!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Fundamental law: IR ≈ ?"}
  options={
    ["IC + Breadth",
    "IC × √Breadth",
    "TE × fee",
    "Return − risiko"]
  }
  correct={1}
  explanation={"Benar: skill per taruhan × akar jumlah taruhan independen. Banyak taruhan kecil &gt; sedikit taruhan besar."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Value underperform 13 tahun (2007–2020). Pelajaran?"}
  options={
    ["Faktor mati",
    "Premi = kompensasi rasa sakit; butuh horizon dekade",
    "Ganti faktor tiap tahun",
    "Faktor scam"]
  }
  correct={1}
  explanation={"Benar: yang menyerah 2019 melewatkan rebound +30%. Tanpa keyakinan horizon, jangan ambil premi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Core 80% (fee 0,2%), satelit 20% (fee 1%). Fee total?"}
  options={
    ["1%",
    "0,36%",
    "0,6%",
    "1,2%"]
  }
  correct={1}
  explanation={"Benar: 0,8×0,2%+0,2×1% = 0,36%. Struktur hemat + tetap ada tembakan alpha."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Manajer return 15%, indeks 16%, fee 2%. Verdict?"}
  options={
    ["Hebat",
    "Gagal: active −1% net −3%",
    "Lumayan",
    "Tahan"]
  }
  correct={1}
  explanation={"Benar: return mentah menipu. Active −1%, net −3%! IR net = ukuran kebenaran."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Buffett bet: S&P +125% vs hedge fund +36% (10 tahun). Pelajaran UTAMA?"}
  options={
    ["Pasif selalu menang — jangan pernah aktif",
    "Biaya = kepastian; fee 2-and-20 + fee ganda menghancurkan alpha",
    "Hedge fund bodoh",
    "Saham selalu naik"]}
  correct={1}
  explanation={"Benar: bukan 'pasif selalu menang', melainkan 'biaya tinggi = alpha negatif pasti'. Pelajaran: default = pasif murah; aktif hanya jika terbukti (active share, alpha neto, fee wajar)."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>IR</strong> = active return / TE; IR net &gt; 0,5 = baik.</li>
<li><strong>Fundamental law</strong>: IC × √Breadth.</li>
<li><strong>Buffett bet</strong>: biaya = kepastian, alpha = harapan.</li>
<li><strong>Smart beta</strong>: jalan ketiga; premi = kompensasi rasa sakit.</li>
<li><strong>Core-satellite</strong>: 80/20 + aturan pecat tertulis.</li>
<li><strong>Aturan</strong>: kagum pada IR net, bukan return mentah.</li>

<li><strong>Pasif:</strong> fondasi murah; mengalahkan 90% aktif.</li>
<li><strong>Smart beta:</strong> faktor sistematis; siklus, bukan jaminan.</li>
<li><strong>Aktif:</strong> hanya jika terbukti; active share &gt; 60%.</li>
<li><strong>Kapan TIDAK pakai:</strong> fee &gt; alpha; closet indexer; faktor tanpa komitmen.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c7-fixed-income-portfolio" className="btn btn-secondary btn-sm">← PM-C7</Link>
        <Link href="/learn/pm-c9-derivatives-overlay" className="btn btn-primary btn-sm">PM-C9 →</Link>
      </div>
    </div>
  );
}

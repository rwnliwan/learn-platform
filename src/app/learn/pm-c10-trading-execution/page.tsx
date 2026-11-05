"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC10TradingExecutionPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C10 — Portfolio Management</span>
        <h1 className="display-title">Trading & Execution:<br/>Biaya Tersembunyi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Rp2 Miliar yang Menguap di Meja Trading</a></li>
<li><a href="#biaya">Biaya Eksplisit vs Implisit</a></li>
<li><a href="#shortfall">Implementation Shortfall</a></li>
<li><a href="#strategi">Strategi Eksekusi</a></li>
<li><a href="#sintesis">Sintesis: Rantai Eksekusi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Rp420 Jt</a></li>
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
<li>Membedakan biaya eksplisit vs implisit.</li>
<li>Menghitung implementation shortfall dan komponennya.</li>
<li>Menjelaskan trade-off strategi eksekusi.</li>
<li>Memilih strategi sesuai urgensi & likuiditas.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Rp2 Miliar yang Menguap di Meja Trading</h2>
      <div className="story">
        <p><strong>Manajer</strong> putuskan beli saham <strong>Rp10 miliar</strong> di Rp1.000. Trader eksekusi <strong>seminggu</strong> (takut 'menggerakkan pasar'). Harga rata-rata dapat: <strong>Rp1.040</strong>. Komisi tercatat: <strong>Rp20 juta</strong> (0,2%). Bos puas: 'biaya kecil!'</p>
<p>Twist-nya: <strong>biaya sebenarnya = Rp420 juta</strong> (4,2%!) — Rp400jt dari <strong>harga bergerak</strong> selama seminggu (delay + market impact), hanya Rp20jt komisi. <strong>Biaya yang terlihat = 5% dari biaya total.</strong> Lesson ini: mengukur yang tak terlihat.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="biaya">Biaya — Gunung Es</h2>
<p><strong>Definisi.</strong> <strong>Eksplisit</strong>: komisi, pajak, fee — <em>terlihat</em>. <strong>Implisit</strong>: <em>bid-ask spread</em>, <em>market impact</em> (order sendiri menggerakkan harga), <em>delay</em> (harga bergerak sebelum eksekusi), <em>missed trade</em> (gagal eksekusi = opportunity cost!).</p>
<p><strong>Aturan</strong>: biaya implisit sering <strong>5–20x</strong> eksplisit untuk order besar!</p>
<p><strong>Kepribadian/intuisi:</strong> Biaya trading seperti <strong>gunung es</strong>: komisi = <strong>puncak</strong> (terlihat, kecil); spread + impact + delay = <strong>badan es</strong> (tak terlihat, raksasa). Kapal (portofolio) karam oleh <em>yang di bawah</em>, bukan puncaknya.</p>
<p><strong>Kapan dipakai:</strong> Evaluasi trader/broker: ukur total, bukan komisi.</p>
<p><strong>Pendalaman intuisi &mdash; implementation shortfall = &ldquo;selisih mimpi dan nyata&rdquo;.</strong> Keputusan: beli @1.000. Realita: @1.040 (seminggu!). <strong>Selisih 4% = <em>implementation shortfall</em></strong> = <em>delay</em> + <em>market impact</em> + <em>komisi</em> + <em>opportunity</em>! <strong>Pelajaran brutal:</strong> <strong><em>alpha</em> 5% &minus; <em>biaya eksekusi</em> 4% = <em>1%</em>!</strong> Manajer &ldquo;hebat&rdquo; bisa <em>net negatif</em> karena <em>eksekusi buruk</em>! <strong>Eksekusi = <em>bagian</em> dari alpha, bukan <em>afterthought</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Bedah Rp420jt (klik untuk buka)</summary>
<p>Beli Rp10M @ Rp1.000 → eksekusi seminggu @ rata-rata Rp1.040.</p>
<p><strong>Eksplisit</strong>: komisi Rp20jt (0,2%). <strong>Implisit</strong>: delay (Rp1.000→1.020 sebelum mulai: Rp200jt) + market impact (1.020→1.040: Rp200jt).</p>
<p><strong>Total Rp420jt (4,2%)</strong> — 21x komisi! <strong>Keputusan 'hati-hati'</strong> (seminggu) justru <em>termahal</em>. Eksekusi cepat 1 hari mungkin hanya Rp150jt total.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Dekomposisi IS &mdash; lengkap</summary>
<p><strong>Soal:</strong> keputusan beli 10.000 saham @1.000 (Rp10M). Eksekusi: 5.000 @1.020 (hari 1), 5.000 @1.060 (hari 3). Komisi 20jt. Harga penutupan hari keputusan: 1.010. Hitung IS.</p>
<p><strong>Total biaya:</strong> (5.000&times;20 + 5.000&times;60) + 20jt = 100jt + 300jt + 20jt = <strong>420jt</strong>.</p>
<p><strong>Dekomposisi:</strong> <em>delay</em> (1.010&minus;1.000)&times;10.000 = <strong>100jt</strong>; <em>impact</em> = <strong>300jt</strong>; <em>komisi</em> = <strong>20jt</strong>.</p>
<p><strong>IS = 4,2%!</strong> &mdash; <strong><em>lebih besar</em> dari <em>alpha</em> kebanyakan manajer!</strong> <strong>Eksekusi = <em>medan perang</em> alpha.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Opportunity cost &mdash; yang tidak tereksekusi</summary>
<p><strong>Soal:</strong> limit beli @1.000 untuk 10.000 saham. Tereksekusi 6.000 @1.000. Harga naik ke 1.100. Hitung <em>opportunity cost</em>.</p>
<p><strong>OC:</strong> 4.000 &times; (1.100&minus;1.000) = <strong>400jt</strong>!</p>
<p><strong>Pelajaran:</strong> <strong><em>limit</em> = <em>hemat</em> tapi <em>risiko tidak dapat</em>!</strong> <em>OC</em> = <em>biaya</em> dari <em>tidak tereksekusi</em>. <strong><em>Tradeoff</em>:</strong> <em>market</em> = <em>pasti mahal</em>; <em>limit</em> = <em>murah tapi mungkin gagal</em>. <strong>Pilih sesuai <em>urgensi alpha</em>!</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Explicit vs implicit</summary>
<p><strong>Soal:</strong> komisi 0,1%, <em>spread</em> 0,2%, <em>impact</em> 0,5%, <em>delay</em> 0,3%. Mana <em>explicit</em>? Total?</p>
<p><strong><em>Explicit</em>:</strong> komisi 0,1% (<em>terlihat</em>!). <strong><em>Implicit</em>:</strong> 0,2+0,5+0,3 = <strong>1,0%</strong> (<em>tersembunyi</em>!).</p>
<p><strong>Total: 1,1%</strong> &mdash; <strong><em>implicit</em> = 10&times; <em>explicit</em>!</strong> <strong>Fokus ke komisi = <em>salah fokus</em>.</strong> <strong><em>Ukur</em> total!</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Komisi = biaya utama&rdquo;.</strong> <strong>SALAH.</strong> <em>Implicit</em> (impact! spread! delay!) = <strong>10&times;</strong> komisi! Soal yang bertanya &ldquo;biaya trading&rdquo; &amp; hanya memberi komisi &rarr; <strong><em>tidak lengkap</em></strong>. <strong><em>Total</em> = <em>explicit</em> + <em>implicit</em>.</strong></p>
</div>

<PlotlyChart
  data={[{x: ["Delay", "Market impact", "Komisi", "Spread"], y: [100, 300, 20, 50], type: "bar", marker: {color: ["#e8a838", "#d62728", "#2a7de1", "#888"]}, name: "Rp jt"}]}
  title={"Dekomposisi IS Rp470jt: impact = pembunuh terbesar"}
  layout={{xaxis: {title: "Komponen biaya"}, yaxis: {title: "Rp juta"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = komponen <em>implementation shortfall</em>.</p>
<p><strong>Interpretasi:</strong> <strong><em>Impact</em> = 64%!</strong> &mdash; <em>terbesar</em> &amp; <em>tersembunyi</em>! <em>Komisi</em> (yang <em>dinegosiasi</em>!) = <em>terkecil</em>! <strong><em>Fokus</em> ke komisi = <em>salah alamat</em>.</strong> <strong><em>Kelola</em> impact: <em>pecah</em> order! <em>batasi</em> partisipasi! <em>pilih</em> strategi!</strong></p>
</div>
<h2 id="shortfall">Implementation Shortfall — Kebenaran Pahit</h2>
<p><strong>Definisi.</strong> <strong>Implementation shortfall</strong> = return <em>paper portfolio</em> (keputusan) − return <em>real portfolio</em> (eksekusi). <strong>Komponen</strong>: delay + market impact + missed trade − <em>penghematan</em> (jika harga bergerak menguntungkan).</p>
<p><strong>Gunanya</strong>: ukur <strong>kualitas eksekusi</strong> trader &amp; broker — KPI meja trading.</p>
<Tex math={String.raw`IS = (P_{exec} - P_{dec}) \times Q + \text{komisi} + OC_{missed}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`P_{dec}`} />: harga saat keputusan</li>
<li><Tex math={String.raw`P_{exec}`} />: harga eksekusi rata-rata</li>
<li><Tex math={String.raw`OC_{missed}`} />: opportunity cost order tak tereksekusi</li>
<li>IS &gt; 0 untuk beli = biaya; benchmark = 'paper'</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Shortfall seperti <strong>selisih resep vs masakan</strong>: resep (keputusan) bilang 'butuh 1kg daging Rp100rb'; pulang dari pasar (eksekusi) bayar Rp104rb + parkir + yang kehabisan. <strong>Koki</strong> (manajer) vs <strong>belanja</strong> (trader) = skill berbeda!</p>
<p><strong>Kapan dipakai:</strong> TCA (transaction cost analysis): evaluasi broker/trader kuartalan.</p>
<p><strong>Pendalaman intuisi &mdash; market impact = &ldquo;jejak kakimu&rdquo;.</strong> Beli besar &rarr; <em>harga naik</em> (penjual <em>mundur</em>!). Jual besar &rarr; <em>harga turun</em>! <strong><em>Impact</em> &asymp; &sigma; &times; &radic;(partisipasi)</strong> &mdash; <em>akar kuadrat</em>! (gandakan ukuran &rarr; impact &times;1,4, bukan &times;2!). <strong>Implikasi:</strong> <strong><em>pecah</em> order besar</strong>! <strong><em>Batasi</em> partisipasi</strong> (&lt;15% volume!). <strong><em>Percepat</em></strong> jika <em>urgent</em>; <strong><em>perlambat</em></strong> jika <em>sabar</em> (tapi <em>delay risk</em>!). <strong><em>Tradeoff</em> abadi.</strong></p><details className="worked">
<summary>📐 Contoh: IS Rp420jt (klik untuk buka)</summary>
<p>Keputusan: beli 10jt lembar @ Rp1.000 (Rp10M). Eksekusi @ Rp1.040 + komisi Rp20jt.</p>
<p><strong>IS</strong> = (1.040 − 1.000) × 10jt + 20jt = <strong>Rp420jt</strong>.</p>
<p><strong>Benchmark manajer</strong>: dinilai vs Rp1.000 (paper!). Jika trader 'hemat' komisi tapi IS besar → <strong>trader buruk</strong>. KPI = <strong>IS</strong>, bukan komisi!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): VWAP vs IS algo</summary>
<p><strong>Soal:</strong> jual 1jt saham. <em>Alpha</em>: <em>memudar</em> cepat (berita buruk!). Pilih VWAP atau IS algo?</p>
<p><strong>VWAP:</strong> <em>ikuti</em> volume pasar &mdash; <em>lambat</em> &amp; <em>pasif</em>. <strong>Cocok:</strong> <em>tidak urgent</em>!</p>
<p><strong>IS algo:</strong> <em>front-loaded</em> (<em>agresif</em> di awal!) &mdash; <em>kejar</em> harga keputusan! <strong>Cocok:</strong> <em>alpha memudar</em>!</p>
<p><strong>Pilih: IS algo.</strong> <strong>Aturan:</strong> <em>urgensi</em> tinggi &rarr; <strong><em>agresif</em></strong>; <em>urgensi</em> rendah &rarr; <strong><em>pasif</em></strong>. <strong><em>Salah</em> pilih = <em>bayar mahal</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Dark pool &mdash; &ldquo;kolam gelap&rdquo;</summary>
<p><strong>Soal:</strong> jual 500jt saham <em>illiquid</em>. <em>Lit market</em> vs <em>dark pool</em>?</p>
<p><strong><em>Lit</em>:</strong> <em>terlihat</em> &rarr; <em>front-running</em>! <em>impact</em> besar!</p>
<p><strong><em>Dark</em>:</strong> <em>tersembunyi</em> &rarr; <em>impact</em> kecil! Tapi: <em>tidak pasti</em> tereksekusi! <em>adverse selection</em>!</p>
<p><strong>Pilih: <em>kombinasi</em></strong> &mdash; <em>dark</em> dulu (<em>murah</em>!), <em>lit</em> untuk sisa (<em>pasti</em>!). <strong><em>Smart order router</em>!</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Pelan = murah&rdquo;.</strong> <strong>SALAH.</strong> <em>Pelan</em> = <em>delay risk</em>! (harga <em>bergerak</em>!). <strong><em>Tradeoff</em>:</strong> <em>cepat</em> = <em>impact</em>; <em>lambat</em> = <em>delay</em>. <strong><em>Optimal</em> = <em>seimbang</em></strong> (Almgren-Chriss!). <strong><em>Urgensi</em> menentukan.</strong></p>
</div>
<PlotlyChart
  data={[{x: ["Komisi", "Delay", "Market impact", "Missed"], y: [20, 200, 200, 0], type: "bar", marker: {color: ["#94a3b8","#e8a838","#ef4444","#2a7de1"]}, text: ["Rp20jt","Rp200jt","Rp200jt","Rp0"], textposition: "outside"}]}
  title={"Dekomposisi implementation shortfall Rp420jt"}
  layout={{xaxis: {title: "Komponen"}, yaxis: {title: "Rp juta"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = biaya tiap komponen (Rp juta).</p>
<p><strong>Interpretasi:</strong> Komisi (<strong>5%</strong>) = yang diributkan; delay + impact (<strong>95%</strong>) = yang menggerogoti. <strong>TCA yang hanya lihat komisi = buta.</strong> Trader 'murah' (komisi kecil, eksekusi lambat) bisa 10x lebih mahal dari trader 'mahal' yang cepat.</p>
</div>
<h2 id="strategi">Strategi Eksekusi — Seimbang Cepat vs Murah</h2>
<p><strong>Definisi.</strong> <strong>Arrival price</strong>: eksekusi <em>cepat</em> (minim delay, impact besar). <strong>VWAP</strong>: ikuti volume pasar (seimbang). <strong>TWAP</strong>: bagi rata waktu (sederhana). <strong>Implementation shortfall algo</strong>: optimalkan trade-off <em>impact vs timing risk</em>.</p>
<p><strong>Pilih</strong>: urgensi tinggi / info cepat basi → <strong>agresif</strong>; order besar / likuiditas tipis → <strong>pasif</strong> (VWAP).</p>
<p><strong>Kepribadian/intuisi:</strong> Strategi eksekusi seperti <strong>menyeberang sungai</strong>: arrival = <strong>lompat langsung</strong> (cepat, basah/impact); VWAP = <strong>batu pijakan</strong> (seimbang); TWAP = <strong>jalan memutar</strong> (lambat, aman). Pilih sesuai <em>derasnya arus</em> (urgensi) &amp; <em>lebarnya sungai</em> (ukuran).</p>
<p><strong>Kapan dipakai:</strong> Instruksi ke trader: bukan 'beli 10M' tapi 'beli 10M via VWAP 3 hari, limit...'.</p>
<p><strong>Pendalaman intuisi &mdash; strategi eksekusi = &ldquo;pilih racunmu&rdquo;.</strong> <strong><em>Market order</em>:</strong> <em>cepat</em> + <em>pasti</em>, tapi <em>mahal</em> (<em>spread</em>!). <strong><em>Limit</em>:</strong> <em>murah</em>, tapi <em>tidak pasti</em> (<em>tidak tereksekusi</em>!). <strong>VWAP:</strong> <em>rata-rata</em> pasar &mdash; <em>aman</em> untuk <em>tidak urgent</em>. <strong><em>Implementation shortfall</em> algo:</strong> <em>agresif</em> di awal &mdash; untuk <em>alpha</em> yang <em>memudar</em>! <strong>Tidak ada <em>gratis</em></strong> &mdash; pilih <em>sesuai urgensi</em>!</p><details className="worked">
<summary>📐 Contoh: Instruksi benar (klik untuk buka)</summary>
<p><strong>Buruk</strong>: 'Beli Rp10M saham X.' → trader bingung → seminggu → IS Rp420jt.</p>
<p><strong>Benar</strong>: 'Beli Rp10M via <strong>VWAP 2 hari</strong>, partisipasi maks <strong>15% volume</strong>, limit Rp1.030.'</p>
<p><strong>Hasil</strong>: IS Rp180jt (terukur!). Manajer <strong>bertanggung jawab</strong> atas instruksi; trader atas <strong>eksekusi vs benchmark</strong>. Jelas = bisa dievaluasi.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Evaluasi trader &mdash; vs apa?</summary>
<p><strong>Soal:</strong> trader beli @1.040 (keputusan @1.000). <em>Bagus</em> atau <em>buruk</em>?</p>
<p><strong>Vs <em>keputusan</em>:</strong> IS 4% &rarr; <strong><em>buruk</em></strong>!</p>
<p><strong>Vs <em>VWAP</em>:</strong> VWAP 1.050 &rarr; trader <em>lebih baik</em>! &rarr; <strong><em>bagus</em></strong>?</p>
<p><strong>Benar: vs <em>keputusan</em>!</strong> &mdash; VWAP = <em>benchmark</em> yang <em>bisa dimanipulasi</em> (<em>trader</em> pengaruhi VWAP!). <strong><em>Arrival price</em></strong> (harga keputusan!) = <em>standar</em>. <strong><em>Ukur</em> yang <em>benar</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: TCA &mdash; <em>transaction cost analysis</em></summary>
<p><strong>Soal:</strong> rancang <em>TCA</em> untuk desk trading.</p>
<p><strong>Komponen:</strong> (1) <strong><em>Pre-trade</em></strong> (<em>estimasi</em> biaya!); (2) <strong><em>Real-time</em></strong> (<em>monitor</em>!); (3) <strong><em>Post-trade</em></strong> (<em>evaluasi</em> vs <em>arrival</em>!).</p>
<p><strong>Gunanya:</strong> <strong><em>akuntabilitas</em></strong> (trader <em>dievaluasi</em>!) + <strong><em>optimasi</em></strong> (strategi <em>diperbaiki</em>!) + <strong><em>kepatuhan</em></strong> (<em>best execution</em>!). <strong><em>TCA</em> = <em>cermin</em> eksekusi.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Dari Keputusan ke Kas</h2>
      <p>Biaya, strategi, evaluasi = <strong>satu rantai</strong>:</p>
      <ol>
        <li><strong>UKUR (biaya):</strong> <em>total</em> IS &mdash; <strong><em>explicit</em> + <em>implicit</em></strong>.</li>
        <li><strong>PILIH (strategi):</strong> <em>sesuai urgensi</em> &mdash; <strong><em>tidak ada gratis</em></strong>.</li>
        <li><strong>NILAI (evaluasi):</strong> vs <em>arrival price</em> &mdash; <strong><em>akuntabilitas</em></strong>.</li>
      </ol>
      <p><strong><em>Alpha</em> tanpa <em>eksekusi</em> = <em>ilusi</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Trader = biaya&rdquo;</h3>
      <p><strong>Manajer:</strong> &ldquo;Trader = <em>eksekutor</em>! <em>Biaya</em>! <em>Otomatisasi</em> saja!&rdquo;</p>
      <p><strong>Trader:</strong> &ldquo;<strong>IS 4% &gt; <em>gajiku</em> 0,1%!</strong> Trader <em>hebat</em> = <em>hemat</em> 1%! <strong><em>Investasi</em>, bukan <em>biaya</em>.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>hargai</em> eksekusi.</strong> <em>KPI</em> = IS, bukan komisi.</p>
      <h3>🧪 Eksperimen: Hitung IS-mu</h3>
      <p><strong>Transaksi terakhir:</strong> harga <em>keputusan</em> vs <em>eksekusi</em>. <strong>Selisih?</strong> <strong><em>Kaget</em>?</strong> &mdash; <em>itulah</em> IS-mu.</p>
      <h3>📰 Studi Kasus: Flash Crash (2010)</h3>
      <p>1.000 poin <em>dalam menit</em>! <strong>Penyebab:</strong> <em>algo</em> + <em>penarikan likuiditas</em>!</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Limit order</em></strong>! (2) <strong><em>Jangan</em> trading saat <em>panik</em></strong>! (3) <strong><em>Circuit breaker</em></strong>!</p>
      <h3>📊 Data Corner: Biaya vs ukuran</h3>
      <p><strong>Data:</strong> <em>impact</em> &asymp; &sigma;&radic;(partisipasi). Partisipasi 5% &rarr; <em>impact</em> X. 20% &rarr; <strong>2X</strong>!</p>
      <p><strong>Aturan:</strong> <strong><em>partisipasi</em> &lt; 15%</strong>! <strong><em>Pecah</em> order besar!</strong></p>
      <h3>📖 Kamus Istilah</h3>
      <p><strong><em>IS</em></strong>! <em>VWAP</em>! <em>TWAP</em>! <em>POV</em>! <em>Dark pool</em>! <em>TCA</em>! <strong>Hafalkan!</strong></p>
      <h3>💡 Prinsip Abadi Eksekusi</h3>
      <p><strong>(1) <em>Ukur</em> total.</strong> (2) <strong><em>Pilih</em> sesuai urgensi.</strong> (3) <strong><em>Instruksi</em> jelas.</strong> (4) <strong><em>Evaluasi</em> vs arrival.</strong> (5) <strong><em>Hargai</em> trader.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> Dekomposisi IS 420jt? <strong>Q2:</strong> VWAP atau IS algo untuk <em>alpha memudar</em>? <strong>Q3:</strong> <em>Alpha</em> 5%, IS 4,2% &rarr; <em>net</em>?</p>
      <p><strong>Lulus</strong> = jawab ketiganya.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-C5:</strong> <em>net alpha</em> = <em>diukur</em> di sana! <strong>Ke PM-C4:</strong> <em>biaya</em> = <em>input</em> konstruksi!</p>
      <h3>🔬 Deep Dive Tambahan: Market Impact Model</h3>
      <p><strong>Model <em>akar kuadrat</em>:</strong> <em>impact</em> &asymp; &sigma; &times; &radic;(Q/V) &mdash; Q = <em>ukuranmu</em>, V = <em>volume</em>!</p>
      <p><strong>Contoh:</strong> &sigma; = 2%/hari, Q/V = 10% &rarr; <em>impact</em> &asymp; 2% &times; 0,32 = <strong>0,63%</strong>!</p>
      <p><strong>Implikasi:</strong> <strong><em>gandakan</em> ukuran &rarr; <em>impact</em> &times;1,4</strong> (bukan &times;2!). <strong><em>Pecah</em> 4&times; &rarr; <em>impact</em> /2!</strong> <strong><em>Matematika</em> = <em>alasan</em> pecah order.</strong></p>
      <p><strong><em>Permanen</em> vs <em>temporer</em>:</strong> <em>temporer</em> (<em>likuiditas</em>!) = <em>pulih</em>! <em>Permanen</em> (<em>informasi</em>!) = <em>tetap</em>! <strong><em>Informed</em> = <em>mahal</em>.</strong></p>
      <h3>📊 Data Corner: Biaya Institusional</h3>
      <p><strong>Data (ITG):</strong> <em>rata-rata</em> IS institusi = <strong>0,5&ndash;1%</strong>! <em>Small-cap</em> = <strong>2%+</strong>!</p>
      <p><strong>Artinya:</strong> <strong><em>setiap</em> transaksi = <em>pajak</em> 1%</strong>! <em>Turnover</em> 100% = <strong><em>buang</em> 1%/tahun</strong>! <strong><em>Kurangi</em> turnover!</strong></p>
      <h3>🧪 Eksperimen: <em>Slippage</em>-mu</h3>
      <p><strong>Catat</strong> 10 transaksimu: <em>keputusan</em> vs <em>eksekusi</em>. <strong><em>Rata-rata</em> slippage?</strong></p>
      <p><strong>Jika</strong> &gt; 0,5% &rarr; <strong><em>perbaiki</em></strong> (limit! pecah! waktu!). <strong><em>Ukur</em> = <em>kelola</em>.</strong></p>
      <h3>💡 Prinsip Abadi Eksekusi (Lengkap)</h3>
      <p><strong>(1) <em>Ukur</em> total</strong> (<em>explicit</em> + <em>implicit</em>!). <strong>(2) <em>Pilih</em> sesuai urgensi</strong> (<em>cepat</em> vs <em>murah</em>!). <strong>(3) <em>Instruksi</em> jelas</strong> (strategi! limit! partisipasi!). <strong>(4) <em>Evaluasi</em> vs <em>arrival</em></strong> (bukan VWAP!). <strong>(5) <em>Hargai</em> trader</strong> (KPI = IS!).</p>
      <p><strong>(6) <em>Pecah</em> order besar</strong> (<em>impact</em> &radic;!). <strong>(7) <em>Kelola</em> timing</strong> (<em>delay</em> vs <em>impact</em>!). <strong>(8) <em>Manfaatkan</em> teknologi</strong> (<em>algo</em>! <em>dark</em>!).</p>
      <p><strong>8 prinsip. <em>Praktikkan</em>.</strong></p>
      <h3>🎓 Ujian Akhir (Lengkap)</h3>
      <p><strong>Q1:</strong> Dekomposisi IS: delay 100, impact 300, komisi 20. <em>Total</em>? <em>Terbesar</em>?</p>
      <p><strong>Q2:</strong> <em>Alpha memudar</em>. <em>Strategi</em>? <em>Kenapa</em>?</p>
      <p><strong>Q3:</strong> <em>Alpha</em> 5%, IS 4,2%. <em>Net</em>? <em>Pelajaran</em>?</p>
      <p><strong>Q4:</strong> <em>Partisipasi</em> 20% vs 5%. <em>Impact</em> berapa &times;?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>🔗 Menghubungkan (Lengkap)</h3>
      <p><strong>Ke PM-C5:</strong> <em>net alpha</em> = <em>diukur</em> di sana! <strong>Ke PM-C4:</strong> <em>biaya</em> = <em>input</em> optimisasi! <strong>Ke PM-B8:</strong> <em>risiko</em> eksekusi!</p>
      <p><strong>Eksekusi = <em>benang merah</em>.</strong></p>
      <h3>📰 Studi Kasus Lengkap: Knight Capital (2012)</h3>
      <p><strong><em>Algo</em> error</strong>: <em>deploy</em> salah &rarr; <strong>beli <em>tinggi</em>, jual <em>rendah</em></strong> 45 menit!</p>
      <p><strong>Rugi: USD 440jt</strong>! <strong><em>Bangkrut</em></strong> (diakusisi!).</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Testing</em></strong>! (2) <strong><em>Kill switch</em></strong>! (3) <strong><em>Monitor</em></strong>! <strong><em>Teknologi</em> = <em>pedang bermata dua</em>.</strong></p>
      <h3>🌍 Eksekusi Global: Perbedaan Pasar</h3>
      <p><strong>AS:</strong> <em>likuid</em>! <em>murah</em>! <strong>EM:</strong> <em>illiquid</em>! <em>mahal</em>! <strong>Indonesia:</strong> <em>spread</em> lebar! <em>partisipasi</em> kecil!</p>
      <p><strong>Implikasi:</strong> <strong><em>sesuaikan</em> strategi</strong>! <em>EM</em> = <em>lebih sabar</em>! <em>lebih pecah</em>!</p>
      <h3>⚖️ Regulasi Eksekusi: MiFID II</h3>
      <p><strong>EU:</strong> <em>wajib</em> lapor <em>biaya</em>! <em>Unbundling</em> (riset vs eksekusi!)! <strong><em>Transparansi</em>!</strong></p>
      <p><strong>Dampak:</strong> <em>komisi</em> turun! <em>Riset</em> dibayar terpisah! <strong><em>Ikuti</em> tren global.</strong></p>
      <h3>🤖 AI dalam Eksekusi</h3>
      <p><strong><em>ML</em>:</strong> <em>prediksi</em> impact! <em>optimalkan</em> jadwal! <strong><em>Manfaat</em>:</strong> <em>hemat</em> 10&ndash;20%!</p>
      <p><strong><em>Risiko</em>:</strong> <em>overfit</em>! <em>black box</em>! <strong><em>Validasi</em>!</strong></p>
      <h3>📋 Template Instruksi Trading (Siap Pakai)</h3>
      <p><strong>INSTRUMEN:</strong> ___ <strong>ARAH:</strong> Beli/Jual <strong>JUMLAH:</strong> ___</p>
      <p><strong>STRATEGI:</strong> VWAP/IS/POV <strong>DURASI:</strong> ___ hari <strong>PARTISIPASI:</strong> &le; ___%</p>
      <p><strong>LIMIT:</strong> Rp ___ <strong>URGENSI:</strong> Rendah/Sedang/Tinggi</p>
      <p><strong>CATATAN:</strong> ___ <strong>EVALUASI:</strong> vs <em>arrival price</em></p>
      <p><strong><em>Salin</em>. <em>Isi</em>. <em>Kirim</em>.</strong></p>
      <h3>💬 Satu Nasihat Terakhir</h3>
      <p><strong>&ldquo;<em>Amateur</em> fokus ke <em>return</em>; <em>profesional</em> fokus ke <em>biaya</em>.&rdquo;</strong></p>
      <p><strong><em>Ingat</em></strong> ini.</p>
      <h3>🎯 Studi Kasus Mini (Latihan)</h3>
      <p><strong>KASUS 1:</strong> Jual 2jt saham <em>likuid</em>, <em>urgensi</em> rendah. <em>Strategi</em>?</p>
      <p><strong>Jawab:</strong> <strong>VWAP 3 hari, partisipasi 10%</strong> (<em>pasif</em>! <em>murah</em>!).</p>
      <p><strong>KASUS 2:</strong> Beli 500rb saham <em>illiquid</em>, <em>alpha memudar</em>. <em>Strategi</em>?</p>
      <p><strong>Jawab:</strong> <strong>IS algo agresif + <em>dark pool</em></strong> (<em>cepat</em>! <em>sembunyi</em>!).</p>
      <p><strong>KASUS 3:</strong> <em>Rebalance</em> rutin bulanan. <em>Strategi</em>?</p>
      <p><strong>Jawab:</strong> <strong>TWAP</strong> (<em>sederhana</em>! <em>otomatis</em>!).</p>
      <p><strong><em>Latihan</em> = <em>penguasaan</em>.</strong></p>
      <h3>📚 Bacaan Lanjutan (Pilihan)</h3>
      <p><strong>Almgren-Chriss (2001):</strong> <em>optimal execution</em> &mdash; <em>fondasi</em> teori!</p>
      <p><strong>Kissell (2013):</strong> <em>Science of Algorithmic Trading</em> &mdash; <em>praktis</em>!</p>
      <p><strong>Harris (2003):</strong> <em>Trading and Exchanges</em> &mdash; <em>mikrostruktur</em>!</p>
      <p><strong><em>Baca</em> = <em>mendalam</em>.</strong></p>
      <h3>❓ FAQ Eksekusi</h3>
      <p><strong>Q: <em>Berapa</em> biaya wajar?</strong> A: <strong>&lt; 1%</strong> (<em>large-cap</em>!); <strong>&lt; 2%</strong> (<em>small-cap</em>!).</p>
      <p><strong>Q: <em>Kapan</em> pakai <em>algo</em>?</strong> A: <strong><em>Selalu</em></strong> untuk &gt; 1% volume!</p>
      <p><strong>Q: <em>Dark pool</em> aman?</strong> A: <strong><em>Relatif</em></strong> &mdash; <em>waspadai</em> <em>adverse selection</em>!</p>
      <h3>🔮 Masa Depan Eksekusi</h3>
      <p><strong><em>AI</em>:</strong> <em>prediksi</em> lebih akurat! <strong><em>Blockchain</em>:</strong> <em>settlement</em> instan! <strong><em>Fragmentasi</em>:</strong> <em>lebih</em> venue!</p>
      <p><strong><em>Siap</em></strong> = <em>belajar</em> terus. <strong><em>Statis</em> = <em>tertinggal</em>.</strong></p>
      <h3>🏆 Trader Terbaik: Ciri-ciri</h3>
      <p><strong>(1) <em>Sabar</em></strong> (tunggu <em>likuiditas</em>!). <strong>(2) <em>Disiplin</em></strong> (ikuti <em>rencana</em>!). <strong>(3) <em>Analitis</em></strong> (<em>TCA</em>!). <strong>(4) <em>Tenang</em></strong> (tidak <em>panik</em>!).</p>
      <p><strong><em>Kembangkan</em></strong>!</p>
      <h3>📝 Jurnal Trading (Template)</h3>
      <p><strong>TANGGAL:</strong> ___ <strong>INSTRUMEN:</strong> ___ <strong>ARAH:</strong> ___</p>
      <p><strong>KEPUTUSAN:</strong> Rp ___ <strong>EKSEKUSI:</strong> Rp ___ <strong>IS:</strong> ___%</p>
      <p><strong>STRATEGI:</strong> ___ <strong>EVALUASI:</strong> ___</p>
      <p><strong>PELAJARAN:</strong> ___</p>
      <p><strong><em>Catat</em> = <em>belajar</em>.</strong></p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> IS 420jt dari 10M = ___%? <strong>A:</strong> <strong>4,2%</strong>.</p>
      <p><strong>Q2:</strong> <em>Implicit</em> vs <em>explicit</em> &mdash; mana <em>lebih besar</em>? <strong>A:</strong> <strong><em>Implicit</em> (10&times;!)</strong>.</p>
      <p><strong>Q3:</strong> <em>Alpha memudar</em> &rarr; strategi? <strong>A:</strong> <strong>IS algo</strong>.</p>
      <p><strong>Q4:</strong> <em>Benchmark</em> evaluasi trader? <strong>A:</strong> <strong><em>Arrival price</em></strong>.</p>
      <p><strong>Q5:</strong> <em>Partisipasi</em> aman? <strong>A:</strong> <strong>&lt; 15%</strong>.</p>
      <h3>🔗 Rantai Nilai Eksekusi (Ringkas)</h3>
      <p><strong>KEPUTUSAN</strong> (manajer!) &rarr; <strong>INSTRUKSI</strong> (jelas!) &rarr; <strong>EKSEKUSI</strong> (trader/algo!) &rarr; <strong>EVALUASI</strong> (TCA!) &rarr; <strong>PERBAIKAN</strong> (sistem!).</p>
      <p><strong><em>Rantai</em> kuat</strong> = <em>alpha</em> terjaga. <strong><em>Rantai</em> lemah</strong> = <em>alpha</em> bocor.</p>
      <p><strong><em>Perkuat</em> setiap mata rantai.</strong></p>
      <h3>💪 Latihan Praktik (3 Skenario)</h3>
      <p><strong>SKENARIO A:</strong> Kamu manajer. <em>Instruksikan</em> pembelian Rp5M saham likuid. <em>Tulis</em> instruksi lengkap!</p>
      <p><strong>SKENARIO B:</strong> Kamu trader. Terima instruksi <em>vague</em> &ldquo;beli Rp5M&rdquo;. <em>Apa</em> yang ditanyakan balik?</p>
      <p><strong>SKENARIO C:</strong> <em>Evaluasi</em> eksekusi: keputusan @1000, eksekusi @1025, 20.000 saham. <em>Hitung</em> IS!</p>
      <p><strong><em>Praktik</em> = <em>mahir</em>.</strong></p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>LEVEL 1:</strong> <em>Tahu</em> IS. <strong>LEVEL 2:</strong> <em>Hitung</em> IS. <strong>LEVEL 3:</strong> <em>Kelola</em> IS. <strong>LEVEL 4:</strong> <em>Ajarkan</em> IS.</p>
      <p><strong><em>Kamu</em> di level berapa?</strong> <strong><em>Naik</em>!</strong></p>
      <h3>📖 Esai: Eksekusi adalah Alpha</h3>
      <p><strong><em>Alpha</em></strong> <em>bukan</em> <strong><em>hanya</em></strong> <em>ide</em>. <strong><em>Alpha</em></strong> = <strong><em>ide</em></strong> <em>minus</em> <strong><em>biaya</em></strong>. <strong><em>Eksekusi</em></strong> <em>buruk</em> = <strong><em>alpha</em></strong> <em>hilang</em>. <strong><em>Eksekusi</em></strong> <em>baik</em> = <strong><em>alpha</em></strong> <em>terjaga</em>.</p>
      <p><strong><em>Profesional</em></strong> = <strong><em>obsesi</em></strong> <em>biaya</em>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Eksekusi</em></strong> = <strong><em>alpha</em></strong> <em>yang</em> <strong><em>terjaga</em></strong>. <strong><em>Jagalah</em></strong>.</p>
      <h3>💎 Eksekusi Sempurna</h3>
      <p><strong><em>Sempurna</em></strong> = <strong><em>tidak</em></strong> <em>ada</em>. <strong><em>Baik</em></strong> = <strong><em>cukup</em></strong>. <strong><em>Usahakan</em></strong> <em>baik</em>.</p>
      <h3>💎 Disiplin Eksekusi</h3>
      <p><strong><em>Disiplin</em></strong> = <strong><em>konsisten</em></strong>. <strong><em>Konsisten</em></strong> = <strong><em>hasil</em></strong>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Biaya trading = komisi. Pilih broker termurah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Komisi = <strong>5%</strong> dari total (contoh: Rp20jt dari Rp420jt!). Broker 'murah' dengan eksekusi lambat = <strong>21x lebih mahal</strong>. Ukur <strong>implementation shortfall</strong> — itulah harga sebenarnya. <strong>TCA &gt; tarif komisi.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Eksekusi pelan = hati-hati = murah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Seminggu 'hati-hati' = Rp420jt; 1 hari agresif mungkin Rp150jt.</strong> Lambat = delay cost + timing risk. 'Hati-hati' tanpa ukuran = <em>mahal yang tersembunyi</em>. Optimal = <strong>seimbang</strong> (VWAP), bukan selambat mungkin.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Eksekusi = operasional.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>eksekusi = <em>alpha</em></strong>! IS 4% &gt; <em>alpha</em> kebanyakan manajer! <strong><em>Manajer</em> hebat + <em>eksekusi</em> buruk = <em>net negatif</em>.</strong> <strong><em>Hargai</em> trader!</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;VWAP = bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>VWAP = <em>rata-rata</em></strong> &mdash; <em>bukan</em> <em>optimal</em>! Untuk <em>alpha memudar</em> = <em>terlalu lambat</em>! <strong><em>Benchmark</em> = <em>arrival price</em></strong>, bukan VWAP!</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu beri benchmark eksekusi.</strong> 'Beli via VWAP' tanpa benchmark = tidak bisa dinilai. Arrival price / VWAP = penggaris trader. Tanpa penggaris, semua klaim 'eksekusi baik' = omong kosong.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Pisahkan alpha manajer dari skill trader.</strong> Manajer dinilai vs harga keputusan (paper); trader dinilai vs IS. Campur = tidak ada yang bertanggung jawab.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Instruksi trading yang benar (template):</strong> &ldquo;<strong>VWAP 2 hari, partisipasi &le;15%, limit RpX, <em>urgensi</em> sedang</strong>&rdquo; + <strong><em>evaluasi</em> vs <em>arrival</em></strong>. <strong><em>Jelas</em> &gt; <em>vague</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Implementation Shortfall</h2>
<p>Hitung IS dan dekomposisinya dari data eksekusi.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Shortfall"}
  hint={"Ubah P_EXEC 1040 → 1010 (eksekusi cepat). IS anjlok — kecepatan menghemat!"}
  defaultCode={"# Implementation shortfall\nP_DEC = 1000      # harga saat keputusan\nP_EXEC = 1040     # harga eksekusi rata2 (ubah!)\nQ = 10_000_000    # lembar\nKOMISI = 20_000_000\n\nbiaya_harga = (P_EXEC - P_DEC) * Q\nIS = biaya_harga + KOMISI\n\nprint(f\"Biaya harga (delay+impact): Rp{biaya_harga/1e9:.2f} M\")\nprint(f\"Komisi                    : Rp{KOMISI/1e9:.2f} M\")\nprint(f\"IS total                  : Rp{IS/1e9:.2f} M ({IS/(P_DEC*Q):.1%})\")\nprint(f\"Porsi komisi              : {KOMISI/IS:.0%}\")\nprint()\nprint(\"Porsi komisi kecil = TCA harus ukur implisit!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator VWAP</h2>
<p>Simulasikan eksekusi VWAP vs agresif: trade-off impact vs delay.</p>
<PyodideLab
  title={"Lab 2 — Simulator VWAP"}
  hint={"Ubah HARI 3 → 1 (agresif). Impact naik, delay turun — cari titik optimal!"}
  defaultCode={"# VWAP vs agresif: impact vs delay\nimport random\nrandom.seed(7)\nQ_TOTAL = 10_000_000\nP0 = 1000\nHARI = 3          # lama eksekusi (ubah!)\nVOL_HARIAN = 50_000_000\n\ndef eksekusi(hari):\n    sisa, biaya, harga = Q_TOTAL, 0, P0\n    for h in range(hari):\n        q = sisa/(hari-h)\n        partisipasi = q/VOL_HARIAN\n        impact = 20 * partisipasi       # Rp per lembar\n        drift = random.uniform(-5, 15)  # pergerakan pasar\n        harga += drift\n        biaya += q*(impact) + q*drift\n        sisa -= q\n    return biaya\n\nb = eksekusi(HARI)\nprint(f\"Eksekusi {HARI} hari: biaya implisit Rp{b/1e6:.0f}jt ({b/(P0*Q_TOTAL):.2%})\")\nprint()\nprint(\"Lambat: delay/drift besar. Cepat: impact besar.\")\nprint(\"VWAP = titik seimbang. Ukur, jangan kira-kira!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Info cepat basi / urgensi tinggi → <strong>Arrival price (agresif)</strong></h3>
<p><strong>Kenapa:</strong> Delay &gt; impact.</p>
<p><strong>Contoh nyata:</strong> Earnings surprise.</p>
</div>
<div className="decision-card">
<h3>2. Order besar, likuiditas tipis → <strong>VWAP multi-hari + limit</strong></h3>
<p><strong>Kenapa:</strong> Impact terkendali.</p>
<p><strong>Contoh nyata:</strong> Rp10M small-cap.</p>
</div>
<div className="decision-card">
<h3>3. Evaluasi broker/trader → <strong>TCA: IS vs benchmark</strong></h3>
<p><strong>Kenapa:</strong> Ukur total.</p>
<p><strong>Contoh nyata:</strong> Review kuartalan.</p>
</div>
<div className="decision-card">
<h3>4. Instruksi ke trader → <strong>Spesifik: algo + horizon + limit</strong></h3>
<p><strong>Kenapa:</strong> Bisa dievaluasi.</p>
<p><strong>Contoh nyata:</strong> 'VWAP 2 hari, maks 15% vol'.</p>
</div>
<div className="decision-card">
<h3>5. Trading besar → <strong>Instruksi jelas; ukur IS total; kelola impact</strong></h3>
<p><strong>Kenapa:</strong> IS 4% &gt; alpha; implicit = 10× komisi.</p>
<p><strong>Contoh nyata:</strong> Beli Rp10M: IS Rp420jt (4,2%) — delay + impact + komisi.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Ukur IS</strong>, bukan komisi.</li><li><strong>Pisahkan</strong> manajer vs trader.</li><li><strong>Instruksi spesifik</strong> + benchmark.</li><li><strong>Seimbang</strong>: cepat vs murah.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Seminggu yang Mahal</h2>
<div className="callout">
<p>Beli Rp10M @ Rp1.000, eksekusi seminggu @ Rp1.040. Komisi Rp20jt. IS = Rp420jt.</p>
<p><strong>Vignette lanjutan.</strong> Manajer: &ldquo;beli Rp10M&rdquo; (<em>vague</em>!). Trader eksekusi <em>seminggu</em> @1.040 (keputusan @1.000). Komisi Rp20jt. <strong>IS = Rp420jt (4,2%)!</strong> &mdash; <em>menghapus</em> alpha setahun!</p>
<p><strong>Pertanyaan:</strong> (a) Dekomposisi IS? (b) Apa kesalahan keputusan? (c) Instruksi yang benar? (d) Jika <em>alpha</em> manajer 5%, berapa <em>net</em> setelah IS? (e) Rancang <em>kebijakan</em> eksekusi.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Delay Rp200jt + impact Rp200jt + komisi Rp20jt</strong> = Rp420jt (4,2%).</p>
<p>(b) <strong>Instruksi vague</strong> ('beli Rp10M') + <strong>asumsi 'pelan = murah'</strong> + <strong>KPI komisi</strong> (bukan IS).</p>
<p>(c) <strong>&lsquo;VWAP 2 hari, partisipasi &le;15%, limit Rp1.030&rsquo;</strong> + evaluasi trader vs IS. Manajer vs harga keputusan.</p>
<p>(d) <strong>5% &minus; 4,2% = 0,8%!</strong> &mdash; <em>nyaris NOL</em>! <strong>Manajer &ldquo;hebat&rdquo; (5% alpha!) = <em>biasa</em> setelah eksekusi!</strong> <strong><em>Net alpha</em></strong> = yang penting. <strong><em>Eksekusi</em> = <em>pajak</em> atas <em>alpha</em>.</strong></p>
<p>(e) <strong>Kebijakan:</strong> (1) <strong><em>Instruksi</em> standar</strong> (strategi! partisipasi! limit! urgensi!); (2) <strong><em>Pre-trade</em> estimasi</strong>; (3) <strong><em>TCA</em></strong> (vs <em>arrival</em>!); (4) <strong><em>Review</em></strong> kuartalan; (5) <strong><em>Insentif</em></strong> trader = <em>IS</em> (bukan <em>komisi</em>!). <strong><em>Sistem</em>, bukan <em>harapan</em>.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Mikrostruktur</h2>
      <h3>1. Almgren-Chriss &mdash; &ldquo;jalur optimal&rdquo;</h3>
      <p><strong><em>Tradeoff</em>:</strong> <em>cepat</em> = <em>impact</em>; <em>lambat</em> = <em>risiko</em>. <strong><em>Optimal</em>:</strong> <em>seimbang</em> via <em>aversi risiko</em>! <strong><em>Front-loaded</em></strong> jika <em>risk-averse</em>! <strong>Matematika <em>elegan</em></strong> &mdash; <em>praktik</em> = <em>algo</em>!</p>
      <h3>2. HFT &mdash; &ldquo;teman atau musuh&rdquo;?</h3>
      <p><strong>Pro:</strong> <em>spread</em> menyempit! <em>Likuiditas</em>! <strong>Kontra:</strong> <em>flash crash</em>! <em>adverse selection</em>! <strong>Putusan:</strong> <strong><em>campuran</em></strong> &mdash; <em>manfaatkan</em> (limit!), <em>waspadai</em> (<em>dark pool</em>!).</p>
      <h3>3. Best execution &mdash; &ldquo;kewajiban&rdquo;</h3>
      <p><strong>Regulasi:</strong> <em>wajib</em> <em>best execution</em>! (<em>harga</em>! <em>kecepatan</em>! <em>probabilitas</em>!). <strong>Bukti:</strong> <em>TCA</em>! <strong><em>Pelanggaran</em></strong> = <em>denda</em>! <strong><em>Kepatuhan</em> = <em>sistem</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; IS kilat</h3>
      <p>Keputusan @1000, eksekusi @1040, 10.000 saham. IS?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>40 &times; 10.000 = <strong>Rp400jt</strong> (4%!).</p>
      </details>
      <h3>Drill 2 &mdash; Dekomposisi</h3>
      <p>Delay 100jt, impact 300jt, komisi 20jt. Total &amp; % terbesar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>420jt</strong>; <em>impact</em> (71%!).</p>
      </details>
      <h3>Drill 3 &mdash; Strategi</h3>
      <p>Alpha <em>memudar</em> cepat. VWAP atau IS algo?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>IS algo</strong> (<em>agresif</em> di awal!).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Komisi rendah = eksekusi bagus.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Implicit</em> = 10&times;! Ukur <em>total</em> IS.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. IS = Rp420jt, komisi Rp20jt. Porsi komisi?"}
  options={
    ["100%",
    "≈ 5% — gunung es",
    "50%",
    "21%"]
  }
  correct={1}
  explanation={"Benar: 20/420 ≈ 5%. 95% = delay + impact (tak terlihat). TCA wajib ukur implisit."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Eksekusi seminggu 'hati-hati' vs 1 hari agresif. Mana bisa lebih murah?"}
  options={
    ["Seminggu selalu",
    "1 hari bisa (delay lebih kecil dari impact)",
    "Sama",
    "Tidak terkait"]
  }
  correct={1}
  explanation={"Benar: lambat = delay cost besar. Optimal = seimbang, bukan selambat mungkin."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. KPI trader yang benar?"}
  options={
    ["Komisi terendah",
    "Implementation shortfall vs benchmark",
    "Kecepatan",
    "Volume"]
  }
  correct={1}
  explanation={"Benar: IS mengukur kualitas total. Komisi rendah + IS besar = trader buruk."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Order besar di saham tidak likuid. Strategi?"}
  options={
    ["Arrival price agresif",
    "VWAP multi-hari + limit partisipasi",
    "Market order langsung",
    "Tunda"]
  }
  correct={1}
  explanation={"Benar: pasif & terkendali untuk likuiditas tipis; agresif = impact meledak."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Manajer dinilai vs apa?"}
  options={
    ["Harga eksekusi",
    "Harga keputusan (paper portfolio)",
    "Komisi",
    "IHSG"]
  }
  correct={1}
  explanation={"Benar: pisahkan skill manajer (vs paper) dari skill trader (IS). Campur = kabur tanggung jawab."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Manajer alpha 5%, tapi IS 4,2%. Berapa net alpha & pelajaran?"}
  options={
    ["5% — alpha tetap",
    "0,8% — eksekusi menghapus hampir semua alpha; ukur net!",
    "9,2% — ditambahkan",
    "Tidak berhubungan"]}
  correct={1}
  explanation={"Benar: 5% − 4,2% = 0,8%. Pelajaran: alpha bruto tanpa biaya eksekusi = ilusi. Eksekusi adalah bagian dari alpha."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Biaya</strong>: eksplisit (komisi) vs implisit (spread, impact, delay, missed) — gunung es.</li>
<li><strong>IS</strong> = paper − real; KPI meja trading.</li>
<li><strong>Strategi</strong>: arrival (cepat), VWAP (seimbang), TWAP (rata), IS-algo (optimal).</li>
<li><strong>Instruksi</strong>: spesifik (algo + horizon + limit) + benchmark.</li>
<li><strong>Aturan</strong>: ukur total; pisahkan manajer vs trader; seimbang cepat vs murah.</li>
<li><strong>Pelajaran</strong>: 'hati-hati' tanpa ukuran = mahal tersembunyi.</li>

<li><strong>IS:</strong> total = delay + impact + komisi + spread; implicit dominan.</li>
<li><strong>Strategi:</strong> sesuai urgensi; tidak ada gratis.</li>
<li><strong>Evaluasi:</strong> vs arrival price; TCA.</li>
<li><strong>Kapan TIDAK pakai:</strong> instruksi vague; KPI komisi; abaikan implicit.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c9-derivatives-overlay" className="btn btn-secondary btn-sm">← PM-C9</Link>
        <Link href="/learn/pm-c11-ethics-esg" className="btn btn-primary btn-sm">PM-C11 →</Link>
      </div>
    </div>
  );
}

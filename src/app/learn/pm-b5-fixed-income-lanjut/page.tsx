"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB5FixedIncomeLanjutPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B5 — Portfolio Management</span>
        <h1 className="display-title">Fixed Income Lanjut:<br/>Kurva, Kredit & MBS</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: 'Aman' AAA yang Gagal Bayar</a></li>
<li><a href="#kurva">Term Structure</a></li>
<li><a href="#kredit">Analisis Kredit</a></li>
<li><a href="#mbs">MBS & Prepayment</a></li>
<li><a href="#sintesis">Sintesis: Tiga Risiko</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: AAA 2008</a></li>
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
<li>Menjelaskan hubungan spot vs forward rate dan bootstrapping.</li>
<li>Membedakan teori term structure (expectations, liquidity).</li>
<li>Membandingkan model kredit struktural vs reduced-form.</li>
<li>Menjelaskan prepayment risk MBS dan PSA.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: 'Aman' AAA yang Gagal Bayar</h2>
      <div className="story">
        <p><strong>2007</strong>: obligasi <strong>AAA</strong> berbasis KPR AS dianggap 'seaman Treasury'. Dana pensiun memborong. <strong>2008</strong>: sebagian <strong>gagal bayar</strong>. Rating AAA ternyata <strong>salah memodelkan korelasi default</strong>.</p>
<p>Twist-nya: bukan <em>probabilitas default</em> tiap KPR yang salah — melainkan <strong>korelasi</strong>-nya (saat harga rumah jatuh <em>nasional</em>, default bergerombol). Model Gaussian copula mengasumsikan korelasi rendah &amp; stabil. <strong>Risiko kredit = risiko korelasi.</strong> Lesson ini: memodelkan kredit dengan benar — dan rendah hati.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="kurva">Term Structure — Harga Waktu per Tenor</h2>
<p><strong>Definisi.</strong> <strong>Spot rate</strong>: yield untuk <em>satu</em> arus kas di tenor t. <strong>Forward rate</strong>: rate masa depan yang <em>tersirat</em> dari spot kini. <strong>Bootstrapping</strong>: turunkan spot dari harga obligasi par secara berurutan. <strong>Teori</strong>: <em>expectations</em> (forward = ekspektasi spot), <em>liquidity preference</em> (premi untuk tenor panjang → kurva normal naik).</p>
<p>Kurva <strong>normal</strong> (naik), <strong>inverted</strong> (turun → prediktor resesi!), <strong>flat</strong>, <strong>humped</strong>.</p>
<Tex math={String.raw`(1+S_n)^n = (1+S_{n-1})^{n-1}(1+F_{n-1,n})`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`S_n`} />: spot rate tenor n</li>
<li><Tex math={String.raw`F_{n-1,n}`} />: forward rate tahun ke-(n−1) ke-n</li>
<li>No-arbitrage: investasi n tahun = (n−1) tahun + forward 1 tahun</li>
<li>Inverted curve: pasar ekspektasi rate TURUN (resesi → pemotongan)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Spot vs forward seperti <strong>harga tiket sekali jalan vs transit</strong>: spot = tiket langsung JKT-SBY; forward = harga tersirat segmen SBY-MLG dari tiket JKT-MLG vs JKT-SBY. Bootstrapping = menyusun harga segmen dari tiket-tiket terusan.</p>
<p><strong>Kapan dipakai:</strong> Pricing derivatif suku bunga; baca ekspektasi pasar dari kurva.</p>
<p><strong>Pendalaman intuisi &mdash; kurva yield = &ldquo;harga waktu&rdquo;.</strong> Setiap titik kurva = suku bunga untuk meminjam selama tenor itu. Kurva <em>normal</em> (naik) = masa depan lebih tidak pasti &rarr; premi lebih tinggi. Kurva <em>inverted</em> = pasar bertaruh suku bunga <em>turun</em> (resesi!) &mdash; <strong>prediktor resesi paling legendaris</strong> (8 dari 8 resesi AS pasca-1970 didahului inversi!). <strong>Kurva bukan ramalan dewa &mdash; ia cermin ekspektasi kolektif, yang bisa salah tapi jarang diabaikan.</strong></p><details className="worked">
<summary>📐 Contoh: Forward tersirat (klik untuk buka)</summary>
<p>S1 = 5%, S2 = 6%. <strong>F_1,2</strong> = (1,06²/1,05) − 1 = (1,1236/1,05) − 1 = <strong>7,01%</strong>.</p>
<p>Pasar 'berkata': rate 1-tahunan, setahun dari kini = 7,01%. Jika kamu yakin rate hanya 6% → <strong>pasang taruhan</strong> via forward/FRA — atau diam jika tidak yakin (ekspektasi ≠ ramalan!).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Forward rate dari kurva</summary>
<p><strong>Soal:</strong> yield 1-tahun 4%, 2-tahun 5%. Berapa forward 1-tahun, 1 tahun dari sekarang?</p>
<p><strong>Langkah 1:</strong> (1,05)&sup2; = (1,04)&times;(1+f) &rarr; f = 1,1025/1,04 &minus; 1 = <strong>6,01%</strong>.</p>
<p><strong>Interpretasi:</strong> pasar &ldquo;mengunci&rdquo; 6,01% untuk tahun ke-2 &mdash; <strong>lebih tinggi</strong> dari spot kini karena kurva <em>naik</em>. <strong>Bukan ramalan!</strong> Forward = <em>breakeven</em> matematis + <em>term premium</em>. Jika ekspektasi murni, forward = ekspektasi suku bunga; jika ada premi, forward &gt; ekspektasi.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Inversi &mdash; membaca sinyal resesi</summary>
<p><strong>Soal:</strong> yield 2-tahun 5,2%, 10-tahun 4,8%. Apa sinyal &amp; mekanismenya?</p>
<p><strong>Sinyal: kurva INVERTED</strong> (jangka pendek &gt; jangka panjang) &mdash; <strong>prediktor resesi klasik</strong>.</p>
<p><strong>Mekanisme:</strong> investor <em>berebut</em> obligasi panjang (mengunci yield sebelum turun) &rarr; harga naik &rarr; yield turun. Artinya pasar bertaruh: <strong>The Fed akan <em>memotong</em> suku bunga</strong> (karena resesi!). <strong>Catatan:</strong> <em>leading</em> 12&ndash;18 bulan, dan ada <em>false positive</em> (1998). Sinyal &ne; kepastian &mdash; tapi <strong>abaikan dengan risikomu sendiri</strong>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Yield tinggi = return tinggi&rdquo;.</strong> Yield MBS 8% vs Treasury 5% &ne; &ldquo;MBS lebih bagus 3%&rdquo;. Selisih 3% = <strong>kompensasi</strong> untuk <em>negative convexity</em> + <em>risiko kredit</em> + <em>likuiditas</em>. <strong>Yield = cermin risiko.</strong> Selalu tanya: <em>risiko apa</em> yang dibayar yield ini?</p>
</div>
<PlotlyChart
  data={[{x: [1,2,3,5,7,10,20,30], y: [4.5,4.8,5.0,5.3,5.5,5.7,6.0,6.1], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "normal"}, {x: [1,2,3,5,7,10,20,30], y: [6.2,5.9,5.6,5.2,5.0,4.8,4.7,4.6], type: "scatter", mode: "lines+markers", marker: {color: "#ef4444"}, name: "inverted"}]}
  title={"Kurva yield: normal vs inverted"}
  layout={{xaxis: {title: "Tenor (tahun)"}, yaxis: {title: "Yield (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = normal (naik), merah = inverted (turun).</p>
<p><strong>Interpretasi:</strong> <strong>Inverted</strong> = pasar bertaruh resesi (rate akan dipotong). Rekam jejak: hampir semua resesi AS didahului inversi — tapi <em>timing</em>-nya 6–24 bulan (jangan trading buta!). Kurva = <strong>bahasa ekspektasi pasar</strong>.</p>
</div>

<PlotlyChart
  data={[{x: [1,2,3,5,7,10,20,30], y: [4.0,4.3,4.5,4.7,4.9,5.1,5.4,5.6], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Normal"}, {x: [1,2,3,5,7,10,20,30], y: [5.2,5.0,4.8,4.6,4.5,4.4,4.3,4.2], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Inverted"}]}
  title={"Kurva yield: normal vs inverted"}
  layout={{xaxis: {title: "Tenor (tahun)"}, yaxis: {title: "Yield (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = tenor, sumbu Y = yield. Biru = kurva normal; merah = inverted.</p>
<p><strong>Interpretasi:</strong> Normal = <strong>naik</strong> (kompensasi waktu). Inverted = <strong>turun</strong> (pendek &gt; panjang) &mdash; pasar bertaruh suku bunga <em>turun</em> = <strong>sinyal resesi</strong>. <strong>Perhatikan:</strong> inversi 2s10s mendahului 8 dari 8 resesi AS pasca-1970 &mdash; tapi <em>timing</em>-nya 12&ndash;18 bulan &amp; tidak sempurna. Gunakan sebagai <em>peringatan</em>, bukan <em>jadwal</em>.</p>
</div>
<h2 id="kredit">Kredit — Dua Cara Memodelkan Default</h2>
<p><strong>Definisi.</strong> <strong>Model struktural (Merton)</strong>: ekuitas = <em>call option</em> atas aset perusahaan (strike = nilai utang); default jika <strong>aset &lt; utang</strong> saat jatuh tempo. <strong>Distance-to-default</strong> = berapa σ aset di atas titik default. <strong>Reduced-form</strong>: default = <em>kejadian acak</em> dengan <strong>hazard rate</strong> λ (statistik, tanpa 'mengapa').</p>
<p><strong>CDS</strong>: asuransi default — spread CDS = harga pasar risiko kredit <em>murni</em> (tanpa noise suku bunga).</p>
<Tex math={String.raw`DD = \frac{\ln(V/D) + (\mu - \sigma^2/2)T}{\sigma\sqrt{T}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`DD`} />: distance-to-default (dalam σ)</li>
<li><Tex math={String.raw`V`} />: nilai aset; <Tex math={String.raw`D`} />: nilai utang (default point)</li>
<li><Tex math={String.raw`\sigma`} />: volatilitas aset</li>
<li>DD = 3 → default hanya jika aset jatuh 3σ (≈ 0,13% peluang)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Merton seperti <strong>mengukur jarak mobil ke jurang</strong>: DD = berapa 'standar deviasi' lagi sebelum jatuh. Reduced-form seperti <strong>statistik kecelakaan</strong>: tidak peduli <em>mengapa</em> jatuh, yang penting <em>seberapa sering</em>. CDS = <strong>premi asuransi mobil</strong> itu.</p>
<p><strong>Kapan dipakai:</strong> Analisis obligasi korporasi; monitor kesehatan emiten via DD pasar.</p>
<p><strong>Pendalaman intuisi &mdash; credit spread = &ldquo;harga ketakutan&rdquo;.</strong> Spread obligasi korporat di atas government = kompensasi untuk <em>default</em> + <em>likuiditas</em> + <em>ketakutan</em>. Spread melebar = pasar <em>takut</em> (2008: 600bps+!). <strong>Aturan:</strong> spread = cermin <em>sentimen</em> sebanyak <em>fundamental</em> &mdash; spread yang sangat lebar bisa = <em>kesempatan</em> (jika fundamental kuat) atau = <em>peringatan</em> (jika benar-benar sekarat). Membedakannya = pekerjaan analis kredit.</p><details className="worked">
<summary>📐 Contoh: DD emiten (klik untuk buka)</summary>
<p>V = Rp10T, D = Rp6T, σ = 25%, T = 1, μ = 8%.</p>
<p><strong>DD</strong> = [ln(10/6) + (0,08−0,03125)]/0,25 = (0,5108+0,0488)/0,25 = <strong>2,24σ</strong>.</p>
<p>Probabilitas default ≈ N(−2,24) ≈ <strong>1,25%</strong>. Monitor: jika V turun ke 7T → DD ≈ 0,9σ → PD ≈ 18% → <strong>jual!</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Dari spread ke probabilitas default</summary>
<p><strong>Soal:</strong> spread kredit 300bps, recovery 40%. Estimasi PD tahunan?</p>
<p><strong>Langkah 1:</strong> spread &asymp; PD &times; LGD &rarr; PD &asymp; 0,03/(1&minus;0,40) = 0,03/0,60 = <strong>5%</strong>.</p>
<p><strong>Nuansa:</strong> ini <strong>PD <em>risk-neutral</em></strong> (tersirat pasar) &mdash; mencakup <em>risk premium</em>, jadi <strong>lebih tinggi</strong> dari PD aktual historis. Jika PD historis rating ini = 2%, selisih 3% = <em>harga ketakutan</em> + likuiditas. <strong>Analis kredit membandingkan keduanya:</strong> spread tersirat &gt;&gt; historis = <em>peluang</em> (jika fundamental OK) atau <em>jebakan</em>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Downgrade &mdash; fallen angel</summary>
<p><strong>Soal:</strong> obligasi BBB di-downgrade ke BB. Apa yang terjadi ke harga &amp; kenapa?</p>
<p><strong>Mekanisme:</strong> banyak institusi <strong>dilarang</strong> pegang <em>high yield</em> (mandat <em>investment grade</em>!) &rarr; <strong>jual paksa</strong> &rarr; harga jatuh <em>lebih</em> dari fundamental &rarr; spread meledak.</p>
<p><strong>Peluang:</strong> <em>fallen angel</em> yang fundamentalnya masih kuat = <strong>mispricing struktural</strong> (bukan karena pasar bodoh, tapi karena <em>aturan</em> memaksa jual!). <strong>Strategi:</strong> beli <em>setelah</em> forced selling mereda &mdash; tapi pastikan bukan <em>value trap</em> (cek arus kas!).</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Rating = opini masa lalu.</strong> Rating <em>lagging</em> (bereaksi <em>setelah</em> masalah!) + <em>issuer-pay conflict</em>. 2008: MBS AAA gagal <em>sebelum</em> di-downgrade. <strong>Aturan:</strong> rating = <em>titik awal</em>, bukan <em>kesimpulan</em>. Analisis kredit sendiri = wajib.</p>
</div>

<PlotlyChart
  data={[{x: ["AAA", "BBB", "BB", "B"], y: [0.5, 2.0, 5.0, 12.0], type: "bar", marker: {color: ["#2ca02c", "#2a7de1", "#e8a838", "#d62728"]}, name: "Spread (bps/100)"}]}
  title={"Credit spread per rating: risiko = harga"}
  layout={{xaxis: {title: "Rating"}, yaxis: {title: "Spread di atas government (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = spread kredit tipikal per rating.</p>
<p><strong>Interpretasi:</strong> AAA 0,5% &rarr; B 12% &mdash; <strong>risiko 24&times; lipat!</strong> Spread = <em>harga ketakutan</em> + <em>kompensasi default</em>. <strong>Perhatikan:</strong> loncatan BBB&rarr;BB (<em>investment grade</em> &rarr; <em>high yield</em>) = <strong>cliff</strong> &mdash; di sinilah <em>fallen angel</em> &amp; forced selling terjadi. <strong>Jangan pernah</strong> membandingkan yield antar rating tanpa menyesuaikan risiko.</p>
</div>
<h2 id="mbs">MBS — Risiko Pelunasan Dipercepat</h2>
<p><strong>Definisi.</strong> <strong>MBS</strong>: sekuritisasi KPR. <strong>Prepayment risk</strong>: debitur <em>refinance</em> saat rate turun → investor <strong>menerima kas lebih cepat</strong> (reinvestasi di yield rendah!) — <strong>kebalikan</strong> dari yang diinginkan. <strong>PSA</strong>: benchmark kecepatan prepayment (100 PSA = standar). <strong>Tranche IO/PO</strong>: IO (interest-only) <em>untung</em> jika prepayment <em>lambat</em>; PO sebaliknya.</p>
<p><strong>Negative convexity</strong>: harga MBS naik <em>melambat</em> saat yield turun (prepayment!) — kebalikan obligasi biasa.</p>
<p><strong>Kepribadian/intuisi:</strong> MBS seperti <strong>menyewakan rumah ke penyewa yang boleh pergi kapan saja</strong>: saat sewa pasar turun (rate turun), penyewa <em>refinance</em> (pindah) — kamu dapat rumah kembali tepat saat sulit cari penyewa baru (reinvestasi rendah). <strong>Heads kamu kalah, tails kamu juga kalah.</strong></p>
<p><strong>Kapan dipakai:</strong> Investasi MBS/covered bond: model prepayment, bukan cuma yield.</p>
<p><strong>Pendalaman intuisi &mdash; MBS = obligasi dengan &ldquo;tombol prepayment&rdquo;.</strong> Pemegang KPR boleh melunasi lebih awal &mdash; dan mereka melakukannya <em>tepat saat merugikan investor</em>: suku bunga turun &rarr; <em>refinancing</em> massal (uang kembali saat reinvestasi murah!); suku bunga naik &rarr; <em>tidak ada</em> yang prepay (uang terkunci di kupon rendah!). <strong><em>Negative convexity</em></strong> = kepala kamu kalah, ekor kamu kalah. Inilah kenapa MBS memberi <em>yield lebih tinggi</em> &mdash; itu <em>kompensasi</em>, bukan <em>bonus</em>.</p><details className="worked">
<summary>📐 Contoh: Rate turun 2% (klik untuk buka)</summary>
<p>MBS yield 7%, PSA 100. Rate → 5%: prepayment melonjak ke <strong>PSA 400</strong> (refinance massal).</p>
<p><strong>Durasi</strong> MBS <em>memendek</em> (kas datang cepat) → harga naik <strong>jauh lebih sedikit</strong> dari obligasi biasa (negative convexity).</p>
<p><strong>IO tranche</strong>: bunga berhenti cepat → <strong>rugi besar</strong>. PO: dapat principal cepat → untung (tapi reinvestasi rendah). Pahami tranche-mu!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Negative convexity &mdash; angka</summary>
<p><strong>Soal:</strong> MBS duration 5. Suku bunga turun 1%: harga naik berapa? Bandingkan obligasi biasa.</p>
<p><strong>Obligasi biasa:</strong> &asymp; +5% (duration &times; &Delta;y).</p>
<p><strong>MBS:</strong> hanya <strong>+3%</strong> &mdash; karena <em>prepayment</em> melonjak (pinjaman dilunasi, durasi <em>memendek</em>!). Suku bunga naik 1%: obligasi &minus;5%, MBS <strong>&minus;6%</strong> (prepayment berhenti, durasi <em>memanjang</em>!).</p>
<p><strong>Pola:</strong> naik <em>lebih sedikit</em>, turun <em>lebih banyak</em> = <strong>negative convexity</strong>. <strong>Kompensasi:</strong> yield MBS &gt; Treasury &mdash; <em>spread</em> itu = harga opsi prepayment yang <em>dijual</em> investor ke peminjam. <strong>Jangan pernah bilang &ldquo;MBS yield-nya lebih tinggi, lebih bagus&rdquo; tanpa menyebut negative convexity.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Korelasi default &mdash; pelajaran 2008</summary>
<p><strong>Soal:</strong> 100 KPR, masing-masing PD 5%, korelasi default 0 vs 0,8. Bedanya?</p>
<p><strong>Korelasi 0:</strong> default <em>independen</em> &rarr; ~5 gagal (hukum bilangan besar) &rarr; <strong>tranche senior AAA aman</strong>.</p>
<p><strong>Korelasi 0,8:</strong> default <strong>bergerombol</strong> &rarr; skenario &ldquo;semua baik&rdquo; atau &ldquo;semua gagal&rdquo; &rarr; <strong>tranche senior bisa tersapu</strong>!</p>
<p><strong>Kesalahan 2008:</strong> model memakai korelasi dari <em>masa tenang</em> (rendah!) &rarr; saat harga rumah jatuh <em>nasional</em>, korelasi &rarr; 1 &rarr; <strong>AAA menjadi sampah</strong>. <strong>Pelajaran: bukan PD yang membunuh &mdash; melainkan <em>korelasi</em> yang diremehkan.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Risiko Obligasi</h2>
      <p>Kurva, kredit, MBS = <strong>tiga wajah risiko obligasi</strong>:</p>
      <ol>
        <li><strong>SUKU BUNGA (kurva):</strong> <em>kapan</em> arus kas datang &rarr; duration. Kurva inverted = <em>peringatan resesi</em>.</li>
        <li><strong>KREDIT (spread):</strong> <em>apakah</em> arus kas datang &rarr; PD &times; LGD. Spread = <em>harga ketakutan</em>.</li>
        <li><strong>OPSI (MBS):</strong> <em>bagaimana</em> arus kas bisa berubah &rarr; prepayment. Negative convexity = <em>kepala kalah, ekor kalah</em>.</li>
      </ol>
      <p><strong>Obligasi &ldquo;aman&rdquo; = mengelola ketiganya.</strong> 2008 = gagal di (2) &amp; (3) sekaligus &mdash; korelasi diremehkan + prepayment/struktur disalahpahami.</p>

      <h3>🎙️ Debat: &ldquo;Rating AAA = aman&rdquo;</h3>
      <p><strong>Pembela rating:</strong> &ldquo;Agensi punya data &amp; model terbaik. AAA = probabilitas gagal &lt; 0,1%. Mempertanyakan rating = arogan.&rdquo;</p>
      <p><strong>Kritikus:</strong> &ldquo;2008: <strong>ribuan</strong> AAA gagal. <em>Issuer-pay</em> = dibayar oleh yang di-rating. <em>Lagging</em> = downgrade setelah mayat tercium. Rating = <em>opini yang dibeli</em>.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>rating = titik awal, bukan kesimpulan.</strong> Gunakan sebagai <em>filter</em> (mis. universe investment grade), tapi <strong>analisis kredit sendiri</strong> untuk keputusan. Yang mengandalkan rating buta = mendelegasikan <em>due diligence</em> ke pihak yang dibayar emiten.</p>
      <h3>📊 Data Corner: Spread sebagai barometer takut</h3>
      <p><strong>Data:</strong> spread IG: normal 100&ndash;150bps; 2008: 600bps+; 2020 (COVID): 400bps; kini: 120bps.</p>
      <p><strong>Cara membaca:</strong> spread &gt; 300bps = <strong>stres serius</strong>; &gt; 500bps = <strong>krisis</strong>. <strong>Kontrarian:</strong> spread 500bps + fundamental kuat = <em>peluang beli</em> (pasar panik). Spread 500bps + fundamental hancur = <em>peringatan</em>. <strong>Angka sama, makna beda &mdash; konteks = segalanya.</strong></p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Kurva terbalik di dompetmu.</strong> Bank menawarkan deposito 1 tahun 6% &amp; obligasi 10 tahun 5%. Mana yang kamu pilih &amp; apa sinyalnya? (Jawab: <strong>inversi</strong> &mdash; pasar bertaruh suku bunga <em>turun</em> (resesi!). Jika kamu butuh uang 2 tahun lagi &rarr; kunci 6% setahun lalu <em>reinvest</em>; jika horizon 10 tahun &rarr; 5% kini mungkin <em>lebih baik</em> dari reinvestasi di masa resesi.)</p>
      <p><strong>(2) Spread melebar 400bps.</strong> Obligasi favoritmu spread-nya dari 150bps &rarr; 550bps seminggu. Beli, jual, atau tahan? (Jawab: <strong>jangan refleks!</strong> Cek: <em>fundamental</em> berubah atau <em>sentimen</em>? Jika arus kas masih kuat &rarr; <em>peluang kontrarian</em>. Jika ada <em>downgrade</em>/isu likuiditas &rarr; <em>peringatan</em>. <strong>Angka sama, makna beda &mdash; konteks = segalanya.</strong>)</p>
      <p><strong>(3) MBS di portofoliomu.</strong> Reksa dana &ldquo;pendapatan tetap&rdquo; milikmu ternyata 40% MBS. Suku bunga turun 2% &mdash; apa yang terjadi ke NAV? (Jawab: <strong>naik <em>lebih sedikit</em></strong> dari ekspektasi duration &mdash; <em>negative convexity</em>! Prepayment melonjak, durasi memendek. Jika manajer tidak menjelaskan ini &rarr; tanyakan.)</p>
      <h3>📰 Studi Kasus: &ldquo;Whale&rdquo; London (2012)</h3>
      <p>Trader JPMorgan (&ldquo;London Whale&rdquo;) membangun posisi <em>credit derivative</em> raksasa (CDX). Model internal: <em>VaR</em> rendah, korelasi stabil. Saat pasar berbalik, <strong>likuiditas kering</strong> &mdash; posisi terlalu besar untuk keluar tanpa menggerakkan harga (<em>gap risk</em>!).</p>
      <p><strong>Kerugian: USD 6,2 miliar.</strong> Bukan karena model <em>salah hitung</em>, melainkan karena model <strong>tidak memasukkan <em>ukuran posisi sendiri</em></strong> sebagai faktor risiko. <strong>Pelajaran:</strong> (1) <strong>likuiditas = risiko</strong> (posisi besar = tidak bisa keluar); (2) <strong>VaR tanpa <em>liquidity adjustment</em> = ilusi</strong>; (3) <strong>model yang tidak tahu kamu ada di dalamnya = model yang buta</strong>.</p>
      <h3>📊 Data Corner: Membaca pergerakan kurva</h3>
      <p><strong>Data:</strong> Senin: 2y 5,0%, 10y 4,8%. Jumat: 2y 4,6%, 10y 4,7%.</p>
      <p><strong>Cara membaca:</strong> (1) Senin = <strong>inverted</strong> (5,0 &gt; 4,8); (2) Jumat = <strong>normal</strong> (4,6 &lt; 4,7) &mdash; kurva <em>bull steepening</em> (pendek turun lebih cepat = pasar <em>yakin</em> pemotongan suku bunga!); (3) <strong>Aksi:</strong> <em>duration</em> panjang diuntungkan; <em>floating rate</em> dirugikan.</p>
      <p><strong>Istilah pro:</strong> <em>bull steepening</em> (suku bunga turun, pendek turun lebih) vs <em>bear flattening</em> (suku bunga naik, pendek naik lebih). <strong>Hafalkan: <em>bull</em> = harga obligasi naik = yield turun.</strong></p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Rating AAA = aman. Rating sudah memperhitungkan semuanya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 2008: AAA MBS gagal — model <strong>korelasi default</strong> salah, bukan probabilitas individual. Rating = <strong>opini berbayar</strong> (issuer-pay conflict!) dengan asumsi yang bisa usang. <strong>Selalu lakukan analisis sendiri</strong>; rating = titik awal, bukan kesimpulan.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Yield MBS 8% vs Treasury 5% = 'diskon 3%'. Beli MBS saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 3% = <strong>kompensasi prepayment + credit + likuiditas</strong>, bukan makan siang gratis. <em>Option-adjusted spread</em> (OAS) yang adil membandingkan setelah <em>mengeluarkan</em> nilai opsi prepayment. Bandingkan <strong>OAS</strong>, bukan yield nominal.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi = aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> obligasi punya <strong>risiko suku bunga</strong> (harga jatuh saat yield naik!), <strong>risiko kredit</strong> (gagal bayar!), <strong>risiko reinvestasi</strong>, &amp; <strong>risiko inflasi</strong>. &ldquo;Aman&rdquo; hanya relatif vs saham &mdash; dan 2008 membuktikan AAA pun bisa gagal. <strong>Obligasi = <em>risiko berbeda</em>, bukan <em>tanpa risiko</em>.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Diversifikasi obligasi selalu melindungi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> jika diversifikasi bergantung pada <em>korelasi rendah</em> &mdash; dan korelasi <em>melonjak</em> saat krisis &mdash; itu <strong>diversifikasi semu</strong>. MBS 2008: ratusan KPR &ldquo;terdiversifikasi&rdquo; yang gagal <em>bersamaan</em>. <strong>Uji diversifikasi di <em>skenario stres</em>, bukan di masa tenang.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Baca kurva, jangan cuma level.</strong> Inversi 2s10s = sinyal resesi; curam = ekspektasi growth. Shape kurva mengandung lebih banyak informasi daripada level BI rate.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Untuk kredit: ikuti DD pasar, bukan cuma rating.</strong> Distance-to-default dari harga saham (Merton) bergerak <em>real-time</em>; rating bergerak <em>kuartalan</em>. Kombinasikan keduanya.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist obligasi 5 menit:</strong> (1) <strong>Kurva</strong> &mdash; normal/inverted/flat? (2) <strong>Spread</strong> &mdash; wajar vs historis? (3) <strong>Durasi</strong> &mdash; cocok dengan horizon? (4) <strong>Kredit</strong> &mdash; analisis sendiri, jangan cuma rating. (5) <strong>Stres</strong> &mdash; bagaimana jika korelasi &rarr; 1? <strong>Lima cek sebelum membeli &ldquo;aman&rdquo;.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Bootstrapping Spot Rates</h2>
<p>Turunkan spot rate dari harga obligasi par secara berurutan.</p>
<PyodideLab
  title={"Lab 1 — Bootstrapping"}
  hint={"Ubah harga obligasi 2-thn 100 -> 98 (discount). Spot 2-thn naik — pasar menuntut lebih!"}
  defaultCode={"# Bootstrapping: par yields -> spot rates\n# Obligasi par 1-thn kupon 5%, 2-thn kupon 6% (harga 100)\nS1 = 0.05\nP2, C2 = 100, 6  # harga & kupon obligasi 2-thn (ubah P2!)\n\n# S1 dari obligasi 1-thn: 105/1.05 = 100 -> S1 = 5%\n# Obligasi 2-thn: 6/(1+S1) + 106/(1+S2)^2 = P2\nS2 = ((106)/(P2 - C2/(1+S1)))**0.5 - 1\nF12 = (1+S2)**2/(1+S1) - 1\n\nprint(f\"Spot 1-thn: {S1:.2%}\")\nprint(f\"Spot 2-thn: {S2:.2%}\")\nprint(f\"Forward 1y1y tersirat: {F12:.2%}\")\nprint(\"\\nBootstrapping = mengupas kurva lapis demi lapis.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Merton Distance-to-Default</h2>
<p>Hitung DD dan probabilitas default implisit dari nilai pasar.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Merton"}
  hint={"Ubah V 10 -> 7 (aset turun). DD anjlok, PD meledak — monitor ini!"}
  defaultCode={"# Merton distance-to-default (pendekatan, tanpa N(.))\nimport math\nV, D = 10e12, 6e12   # nilai aset & utang (Rp; ubah V!)\nSIG, T, MU = 0.25, 1.0, 0.08\n\ndd = (math.log(V/D) + (MU - SIG**2/2)*T)/(SIG*math.sqrt(T))\npd = 0.5*(1+math.erf(-dd/math.sqrt(2)))  # N(-dd)\n\nprint(f\"Distance-to-default: {dd:.2f} sigma\")\nprint(f\"Probabilitas default implisit: {pd:.2%}\")\nprint()\nprint(\"Aturan: DD < 1.5 = zona bahaya; DD > 3 = aman.\")\nprint(\"Ekuitas = call option atas aset (strike = utang).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Kurva inverted → <strong>Defensif; siapkan likuiditas</strong></h3>
<p><strong>Kenapa:</strong> Prediktor resesi (6–24 bulan).</p>
<p><strong>Contoh nyata:</strong> Kurangi durasi kredit.</p>
</div>
<div className="decision-card">
<h3>2. DD &lt; 1,5 → <strong>Kurangi/jual eksposur kredit</strong></h3>
<p><strong>Kenapa:</strong> Probabilitas default naik tajam.</p>
<p><strong>Contoh nyata:</strong> Monitor emiten bulanan.</p>
</div>
<div className="decision-card">
<h3>3. Banding MBS vs Treasury → <strong>Bandingkan OAS, bukan yield</strong></h3>
<p><strong>Kenapa:</strong> Opsi prepayment harus dikeluarkan.</p>
<p><strong>Contoh nyata:</strong> OAS 50bps = murah/mahal?</p>
</div>
<div className="decision-card">
<h3>4. Butuh lindung nilai rate → <strong>FRA/swap dari forward tersirat</strong></h3>
<p><strong>Kenapa:</strong> Kurva memberi harga pasar.</p>
<p><strong>Contoh nyata:</strong> Kunci F_1,2 = 7,01%.</p>
</div>
<div className="decision-card">
<h3>5. Obligasi &ldquo;aman&rdquo; yield tinggi → <strong>Tanya: risiko apa yang dibayar? Stres korelasi?</strong></h3>
<p><strong>Kenapa:</strong> Yield = cermin risiko; diversifikasi semu = korelasi krisis.</p>
<p><strong>Contoh nyata:</strong> MBS AAA 2008 = korelasi diremehkan → gagal massal.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Baca shape kurva</strong>, bukan cuma level.</li><li><strong>Forward = ekspektasi</strong> (bukan janji).</li><li><strong>DD pasar</strong> &gt; rating untuk timing.</li><li><strong>OAS</strong> untuk MBS.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 'Aman' AAA yang Gagal</h2>
<div className="callout">
<p>2007: MBS AAA diborong dana pensiun. 2008: gagal bayar massal. Model korelasi salah.</p>
<p><strong>Vignette lanjutan.</strong> 2007: MBS ber-rating AAA diborong dana pensiun global (&ldquo;aman seperti Treasury, yield lebih tinggi&rdquo;). Model bank memakai korelasi default dari data 2000&ndash;2006 (masa tenang). 2008: harga rumah jatuh <em>nasional</em> &mdash; default <strong>bergerombol</strong>, tranche AAA tersapu. Kerugian triliunan dolar.</p>
<p><strong>Pertanyaan:</strong> (a) Apa yang salah dari model? (b) Kenapa rating tidak menyelamatkan? (c) Pelajaran abadi? (d) Jika korelasi 0, berapa ekspektasi gagal dari 100 KPR (PD 5%)? Jika korelasi &rarr; 1, apa skenarionya? (e) Rancang <em>stress test</em> untuk portofolio sekuritisasi.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Korelasi default</strong> diasumsikan rendah &amp; stabil; saat harga rumah jatuh <em>nasional</em>, default <strong>bergerombol</strong>. Bukan PD individual yang salah — <strong>dependensinya</strong>.</p>
<p>(b) <strong>Issuer-pay conflict</strong> + asumsi usang + lag. Rating = opini, bukan jaminan.</p>
<p>(c) <strong>Model adalah peta, bukan wilayah.</strong> Stress-test asumsi korelasi; diversifikasi yang bergantung pada korelasi rendah = <strong>diversifikasi semu</strong>.</p>
<p>(d) <strong>Korelasi 0:</strong> ekspektasi = 100 &times; 5% = <strong>5 gagal</strong> (tersebar, senior aman). <strong>Korelasi &rarr; 1:</strong> skenario <strong>biner</strong> &mdash; 95% &ldquo;semua baik&rdquo; (0 gagal) vs 5% &ldquo;semua gagal&rdquo; (100 gagal!) &mdash; <strong>tranche senior hancur</strong> di skenario buruk. <strong>PD sama (5%), hasil SANGAT beda</strong> &mdash; inilah kenapa korelasi = parameter paling berbahaya.</p>
<p>(e) <strong>Stress test:</strong> (1) <strong>korelasi &rarr; 1</strong> (skenario &ldquo;semua gagal bersamaan&rdquo;); (2) <strong>harga agunan &minus;30%</strong> (recovery jatuh); (3) <strong>likuiditas kering</strong> (tidak bisa jual); (4) <strong>rating <em>lag</em></strong> (asumsikan downgrade 3 notch). <strong>Jika portofolio tidak selamat dari (1)&ndash;(3) &rarr; jangan sebut &ldquo;aman&rdquo;.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Struktur & Krisis</h2>
      <h3>1. Tranching &mdash; &ldquo;air terjun&rdquo; kerugian</h3>
      <p>MBS dibagi <em>tranche</em>: kerugian <em>mengalir</em> dari bawah (equity) ke atas (senior). Senior &ldquo;aman&rdquo; <strong>hanya jika</strong> kerugian &lt; buffer. 2008: kerugian <em>melewati</em> buffer karena korelasi. <strong>Pelajaran:</strong> tranching = <em>konsentrasi</em> risiko (bukan eliminasi!) &mdash; equity menyerap pertama, tapi jika badai cukup besar, <strong>air terjun meluap ke atas</strong>.</p>
      <h3>2. Copula Gauss &mdash; rumus yang &ldquo;membunuh&rdquo; Wall Street</h3>
      <p>Formula Li (2000) memodelkan korelasi default via <em>copula</em> &mdash; elegan &amp; mudah. Masalah: <strong>korelasi diasumsikan konstan</strong> (dari data tenang!) &amp; <strong>ekor tipis</strong> (Gauss!). Krisis = korelasi &rarr; 1 + ekor tebal = <strong>model buta terhadap skenario yang justru terjadi</strong>. <strong>Pelajaran abadi: model = asumsi; uji <em>asumsi</em>, bukan cuma <em>output</em>.</strong></p>
      <h3>3. Sovereign vs korporat &mdash; &ldquo;risk-free&rdquo; yang tidak ada</h3>
      <p>Bahkan <em>government bond</em> punya risiko (inflasi, <em>downgrade</em>, <em>restructuring</em> &mdash; tanya Yunani 2012!). <strong>Tidak ada aset benar-benar <em>risk-free</em></strong> &mdash; hanya <em>risiko berbeda</em>. Praktis: <em>risk-free rate</em> = konvensi kerja, bukan kebenaran metafisik.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Forward kilat</h3>
      <p>1y = 3%, 2y = 4%. Forward 1y1y?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>(1,04)&sup2;/1,03 &minus; 1 = 1,0816/1,03 &minus; 1 = <strong>5,01%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; PD tersirat</h3>
      <p>Spread 200bps, recovery 40%. PD?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>0,02/0,60 = <strong>3,33%</strong> (risk-neutral).</p>
      </details>
      <h3>Drill 3 &mdash; Inversi</h3>
      <p>2y = 5%, 10y = 4,5%. Sinyal?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Inverted</strong> &rarr; sinyal resesi (pasar bertaruh suku bunga turun).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette MBS</h3>
      <p>Suku bunga turun 2%. Investor MBS senang atau sedih? Kenapa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Sedih (relatif)!</strong> Prepayment melonjak &rarr; uang kembali saat reinvestasi <em>murah</em> &rarr; <em>negative convexity</em>. Harga naik <em>lebih sedikit</em> dari obligasi biasa.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. S1=5%, S2=6%. Forward 1y1y?"}
  options={
    ["6%",
    "7,01%",
    "5,5%",
    "11%"]
  }
  correct={1}
  explanation={"Benar: (1,06²/1,05)−1 = 7,01%. Pasar 'berkata' rate tahun depan 7,01% — ekspektasi, bukan janji."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Kurva inverted artinya?"}
  options={
    ["Ekonomi kuat",
    "Pasar ekspektasi rate turun (risiko resesi)",
    "Inflasi tinggi",
    "Tidak ada artinya"]
  }
  correct={1}
  explanation={"Benar: investor menerima yield rendah di tenor panjang karena yakin rate akan dipotong (resesi). Prediktor andal, timing 6–24 bulan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. V=10T, D=6T, σ=25%, T=1, μ=8%. DD?"}
  options={
    ["1,0σ",
    "2,24σ (PD ≈ 1,25%)",
    "3,0σ",
    "0,5σ"]
  }
  correct={1}
  explanation={"Benar: [ln(10/6)+(0,08−0,03125)]/0,25 = 2,24. Monitor: V turun → DD anjlok → PD meledak."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Rate turun 2%, MBS PSA 100→400. Efek ke investor MBS?"}
  options={
    ["Untung besar seperti obligasi biasa",
    "Harga naik terbatas (negative convexity); reinvestasi rendah",
    "Tidak ada efek",
    "Rugi pasti"]
  }
  correct={1}
  explanation={"Benar: prepayment massal → kas datang cepat → durasi memendek → upside terbatas. Heads kalah, tails kalah."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Banding MBS (yield 8%) vs Treasury (5%). Metrik adil?"}
  options={
    ["Selisih yield 3%",
    "OAS (keluarkan nilai opsi prepayment)",
    "Kupon",
    "Rating"]
  }
  correct={1}
  explanation={"Benar: 3% = kompensasi prepayment/kredit/likuiditas. OAS membandingkan apel-dengan-apel setelah mengeluarkan opsi."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. 100 KPR, PD 5% tiap kredit. Jika korelasi default → 1 (sempurna), apa risikonya bagi tranche senior?"}
  options={
    ["Aman — ekspektasi gagal tetap 5",
    "Bencana — skenario 'semua gagal bersamaan' bisa menyapu senior",
    "Tidak berubah — tranching melindungi selalu",
    "Membaik — korelasi tinggi = diversifikasi"]}
  correct={1}
  explanation={"Benar: korelasi →1 membuat default bergerombol — skenario biner 'semua baik' vs 'semua gagal'. Tranche senior yang 'aman' di korelasi rendah bisa tersapu. Inilah pelajaran 2008: bukan PD yang membunuh, melainkan korelasi."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Spot/forward</strong>: hubungan no-arbitrage antar-tenor (lihat rumus); bootstrapping mengupas kurva.</li>
<li><strong>Teori kurva</strong>: expectations vs liquidity preference; inverted = sinyal resesi.</li>
<li><strong>Merton</strong>: ekuitas = call atas aset; DD = jarak ke default (σ).</li>
<li><strong>Reduced-form</strong>: default = kejadian acak (hazard rate); CDS = harga pasarnya.</li>
<li><strong>MBS</strong>: prepayment risk, PSA, negative convexity; bandingkan via OAS.</li>
<li><strong>Pelajaran 2008</strong>: risiko kredit = risiko korelasi; model ≠ wilayah.</li>

<li><strong>Kurva:</strong> forward = breakeven; inverted = sinyal resesi.</li>
<li><strong>Kredit:</strong> spread &asymp; PD &times; LGD; rating = opini, bukan jaminan.</li>
<li><strong>MBS:</strong> negative convexity; korelasi &gt; PD sebagai risiko.</li>
<li><strong>Kapan TIDAK pakai:</strong> percaya rating buta; korelasi dari masa tenang; sebut &ldquo;aman&rdquo; tanpa stress test.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b4-valuasi-ekuitas" className="btn btn-secondary btn-sm">← PM-B4</Link>
        <Link href="/learn/pm-b6-valuasi-derivatif" className="btn btn-primary btn-sm">PM-B6 →</Link>
      </div>
    </div>
  );
}

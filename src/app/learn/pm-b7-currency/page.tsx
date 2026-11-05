"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB7CurrencyPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B7 — Portfolio Management</span>
        <h1 className="display-title">Currency:<br/>Paritas & Carry Trade</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: 'Uang Gratis' Carry Trade Yen</a></li>
<li><a href="#paritas">Paritas Suku Bunga & PPP</a></li>
<li><a href="#carry">Carry Trade</a></li>
<li><a href="#em">FX Emerging Market</a></li>
<li><a href="#sintesis">Sintesis: Tiga Paritas</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Yen 2008</a></li>
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
<li>Menjelaskan covered interest rate parity dan menghitung forward wajar.</li>
<li>Membedakan PPP absolut vs relatif dan international Fisher.</li>
<li>Menjelaskan carry trade dan mengapa ia runtuh berkala.</li>
<li>Menghitung return carry trade dengan skenario.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: 'Uang Gratis' Carry Trade Yen</h2>
      <div className="story">
        <p><strong>2005–2007</strong>: hedge fund meminjam <strong>yen 0,5%</strong>, membeli <strong>AUD 6%</strong> — selisih <strong>5,5% 'gratis'</strong> per tahun. Triliunan dolar mengalir. <em>&ldquo;Uang gratis!&rdquo;</em></p>
<p><strong>Agustus 2007 &amp; 2008</strong>: yen <strong>menguat 20%</strong> dalam minggu — carry trader rugi <strong>4 tahun profit dalam sebulan</strong>. <em>&ldquo;Naik tangga, turun lift.&rdquo;</em> Twist-nya: <strong>uncovered IRP</strong> berkata selisih bunga <em>harusnya</em> dihapus depresiasi — tapi <strong>empiris gagal</strong> (forward premium puzzle): carry <em>profitable</em>… sampai <strong>crash</strong>. Profit kecil stabil + rugi besar jarang = <strong>distribusi miring</strong>. Lesson ini: harga 'uang gratis'.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="paritas">Paritas — Hukum Satu Harga Global</h2>
<p><strong>Definisi.</strong> <strong>Covered IRP</strong>: F = S×(1+r_d)/(1+r_f) — <em>pasti</em> berlaku (arbitrase jika tidak). <strong>Uncovered IRP</strong>: E(%ΔS) ≈ r_d − r_f — <em>sering gagal</em> empiris. <strong>PPP relatif</strong>: %ΔS ≈ π_d − π_f (kurs mengikuti inflasi). <strong>International Fisher</strong>: r_d − r_f ≈ E(π_d) − E(π_f).</p>
<p>Rantai: Fisher → PPP → IRP. Semua tentang <strong>ekspektasi</strong>, bukan jaminan.</p>
<Tex math={String.raw`F = S\frac{1+r_d}{1+r_f} \quad;\quad \%\Delta S \approx \pi_d - \pi_f \ \text{(PPP relatif)}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`r_d, r_f`} />: suku bunga domestik &amp; asing</li>
<li><Tex math={String.raw`\pi_d, \pi_f`} />: inflasi domestik &amp; asing</li>
<li>Covered IRP = arbitrase (pasti); uncovered = ekspektasi (sering salah)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Covered IRP seperti <strong>timbangan digital</strong>: jika miring, arbitrager langsung menyeimbangkan (pasti). Uncovered IRP seperti <strong>ramalan cuaca</strong>: 'harusnya' hujan, tapi sering cerah — berguna sebagai <em>baseline</em>, bukan kebenaran.</p>
<p><strong>Kapan dipakai:</strong> Pricing forward FX; benchmark ekspektasi kurs.</p>
<p><strong>Pendalaman intuisi &mdash; paritas = &ldquo;tidak ada makan siang gratis&rdquo; versi valas.</strong> Covered IRP: pinjam yen 0,5%, konversi, invest AUD 6%, <em>lock</em> forward &mdash; return = <strong>NOL</strong> (arbitrase!). Uncovered IRP: <em>tanpa</em> lock &mdash; return = <strong>selisih bunga &minus; pergerakan kurs</strong>. <strong>Teori bilang</strong> kurs <em>rata-rata</em> melemah sebesar selisih bunga. <strong>Realita bilang</strong> tidak &mdash; dan itulah <em>forward premium puzzle</em> = <em>peluang</em> (carry trade) sekaligus <em>jebakan</em> (crash!).</p><details className="worked">
<summary>📐 Contoh: Forward wajar (klik untuk buka)</summary>
<p>S = Rp16.000/USD, r_IDR = 6%, r_USD = 5%, T = 1 thn.</p>
<p><strong>F</strong> = 16.000 × 1,06/1,05 = <strong>Rp16.152</strong>. Forward <em>wajar</em> = rupiah <strong>depresiasi 0,95%</strong> (selisih bunga).</p>
<p>Jika pasar quote 16.500 → <strong>arbitrase covered</strong>: pinjam USD, konversi, deposito IDR, jual forward. Mesin uang — sampai quote terkoreksi.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Covered IRP &mdash; arbitrase</summary>
<p><strong>Soal:</strong> S = 150 JPY/USD, r_JPY = 0,5%, r_USD = 5%, T = 1 tahun. Berapa forward? Buktikan tidak ada arbitrase.</p>
<p><strong>Langkah 1:</strong> F = 150 &times; (1,005/1,05) = 150 &times; 0,9571 = <strong>143,57</strong>.</p>
<p><strong>Langkah 2 &mdash; bukti:</strong> pinjam 150 JPY (bayar 150,75), konversi &rarr; USD 1, invest &rarr; USD 1,05, konversi forward &rarr; 1,05 &times; 143,57 = <strong>150,75</strong> = bayar pinjaman = <strong>NOL</strong> &check;.</p>
<p><strong>Jika F &ne; 143,57</strong> &rarr; arbitrase! (Pinjam murah, invest mahal, lock.) <strong>Covered IRP = <em>hukum</em></strong> (arbitrase) &mdash; hampir tidak pernah dilanggar. <strong>Uncovered IRP = <em>teori</em></strong> (ekspektasi) &mdash; sering dilanggar = <em>peluang carry</em>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Uncovered &mdash; ekspektasi vs realita</summary>
<p><strong>Soal:</strong> r_AUD = 6%, r_JPY = 0,5%. Menurut uncovered IRP, apa ekspektasi pergerakan AUD/JPY? Apa yang <em>sebenarnya</em> terjadi 2005&ndash;07?</p>
<p><strong>Teori:</strong> AUD seharusnya <strong>melemah &asymp; 5,5%/tahun</strong> (menghapus selisih bunga).</p>
<p><strong>Realita 2005&ndash;07:</strong> AUD justru <strong>menguat</strong>! &rarr; carry trader dapat <strong>bunga + apresiasi</strong> = <em>double profit</em> &asymp; 10%+/tahun.</p>
<p><strong>2008:</strong> yen menguat 20% &rarr; <strong>&minus;14,5%</strong> &mdash; menghapus 3 tahun profit. <strong>Pola:</strong> <em>naik tangga, turun lift</em> (<em>up by stairs, down by elevator</em>). <strong>Forward premium puzzle = premi risiko crash</strong> yang <em>jarang</em> terealisasi &mdash; tapi saat terealisasi, <em>brutal</em>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Bunga tinggi = mata uang menguat&rdquo;.</strong> Uncovered IRP memprediksi <em>sebaliknya</em>: bunga tinggi &rarr; <strong>depresiasi ekspektasian</strong> (menghapus selisih!). Jika soal memberi r_A = 8%, r_B = 2% &amp; bertanya ekspektasi kurs &rarr; <strong>A melemah 6%</strong>. Yang menjawab &ldquo;A menguat karena menarik modal&rdquo; = mencampur <em>jangka pendek</em> (aliran modal) dengan <em>teori paritas</em>.</p>
</div>

<PlotlyChart
  data={[{x: [2005,2006,2007,2008], y: [8,10,12,-14.5], type: "bar", marker: {color: ["#2ca02c","#2ca02c","#2ca02c","#d62728"]}, name: "Return carry (%)"}]}
  title={"Carry trade: naik tangga, turun lift"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Return (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = return tahunan carry JPY&rarr;AUD.</p>
<p><strong>Interpretasi:</strong> 2005&ndash;07: <strong>+8&ndash;12%/tahun</strong> (<em>naik tangga</em> &mdash; stabil, menenangkan). 2008: <strong>&minus;14,5%</strong> (<em>turun lift</em> &mdash; menghapus 3 tahun!). <strong>Pola khas <em>negatively skewed</em>:</strong> untung kecil-sering, rugi besar-jaran<em>g</em>. <strong>Jika return strategimu terlihat seperti ini &rarr; kamu <em>menjual asuransi</em>, bukan <em>berinvestasi</em> &mdash; ukur &amp; kelola sebagai penjual asuransi.</strong></p>
</div>

<PlotlyChart
  data={[{x: ["IDR", "USD"], y: [6.0, 4.5], type: "bar", marker: {color: ["#d62728", "#2a7de1"]}, name: "Suku bunga (%)"}]}
  title={"Selisih bunga = ekspektasi depresiasi (IRP)"}
  layout={{xaxis: {title: "Mata uang"}, yaxis: {title: "Suku bunga (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang = suku bunga IDR vs USD.</p>
<p><strong>Interpretasi:</strong> selisih 1,5% = <strong>pasar mengharapkan rupiah melemah &asymp; 1,5%/tahun</strong> (uncovered IRP). <strong>Bukan ramalan pasti!</strong> &mdash; melainkan <em>harga keseimbangan</em>. Jika kamu yakin rupiah <em>tidak</em> melemah &rarr; itu <em>pandangan</em> (carry!) &mdash; <strong>ukur sebagai risiko, bukan kepastian</strong>.</p>
</div>
<h2 id="carry">Carry Trade — Memungut Koin di Rel Kereta</h2>
<p><strong>Definisi.</strong> <strong>Carry trade</strong>: pinjam mata uang <em>bunga rendah</em> (funding: JPY, CHF), beli <em>bunga tinggi</em> (target: AUD, EM) — kantongi selisih. <strong>Return</strong> = selisih bunga + apresiasi target. <strong>Crash risk</strong>: saat risk-off, funding currency <strong>menguat tajam</strong> (unwind massal) → rugi besar mendadak.</p>
<p><strong>Skew negatif</strong>: menang kecil sering, kalah besar jarang — <strong>seperti jual asuransi</strong> (premi rutin, klaim bencana).</p>
<p><strong>Kepribadian/intuisi:</strong> Carry trade seperti <strong>memungut koin di rel kereta</strong>: koinnya nyata (selisih bunga), keretanya jarang (crash) — tapi saat datang, <em>kamu masih di rel</em>. Atau: seperti <strong>menjual payung saat kemarau</strong> — laku terus… sampai hujan badai.</p>
<p><strong>Kapan dipakai:</strong> FX overlay (PM-C9): sizing kecil + stop; jangan core strategy.</p>
<p><strong>Pendalaman intuisi &mdash; carry trade = &ldquo;memungut receh di depan buldoser&rdquo;.</strong> Pinjam murah (JPY/CHF), invest mahal (AUD/EM) &mdash; untung <em>kecil &amp; stabil</em> (5%/tahun), rugi <em>besar &amp; tiba-tiba</em> (&minus;20% sebulan!). <strong>Distribusi return = <em>negatively skewed</em>:</strong> seperti menjual asuransi &mdash; premi tiap bulan, klaim raksasa sesekali. <strong>Aturan:</strong> carry = <em>strategi pendapatan</em> (sizing kecil!), bukan <em>core portfolio</em>. Yang menjadikannya core = yang tertabrak buldoser.</p><details className="worked">
<summary>📐 Contoh: Matematika 2008 (klik untuk buka)</summary>
<p>Pinjam JPY 0,5%, beli AUD 6%: <strong>carry +5,5%/thn</strong>. 2005–2007: total +16,5%.</p>
<p><strong>2008</strong>: JPY menguat 20% vs AUD dalam 3 bulan. Return = +5,5% − 20% = <strong>−14,5%</strong> — menghapus <strong>hampir semua</strong> profit 3 tahun.</p>
<p><strong>Pelajaran:</strong> expected return carry = selisih bunga − <strong>expected crash</strong>. Tanpa memodelkan ekor, carry = bom waktu.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Big Mac Index</summary>
<p><strong>Soal:</strong> Big Mac AS USD 5, Indonesia Rp35.000, kurs 15.000 Rp/USD. Rupiah over/undervalued?</p>
<p><strong>Langkah 1 &mdash; PPP tersirat:</strong> 35.000/5 = <strong>7.000</strong> Rp/USD.</p>
<p><strong>Langkah 2:</strong> aktual 15.000 &gt; 7.000 &rarr; rupiah <strong>undervalued &asymp; 53%</strong> (menurut burger!).</p>
<p><strong>Catatan:</strong> jangan trading berdasarkan ini! PPP butuh <strong>dekade</strong> untuk bekerja &mdash; dan burger &ne; <em>tradable</em> sempurna (sewa, upah!). <strong>Kegunaan:</strong> <em>penilaian jangka panjang</em> &amp; <em>keputusan struktural</em> &mdash; bukan sinyal trading.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: PPP vs suku bunga &mdash; dua kompas</summary>
<p><strong>Soal:</strong> negara X: inflasi 10%, suku bunga 12%. Negara Y: inflasi 2%, suku bunga 3%. Apa prediksi PPP &amp; IRP untuk kurs X/Y?</p>
<p><strong>PPP:</strong> mata uang X seharusnya <strong>terdepresiasi &asymp; 8%/tahun</strong> (selisih inflasi).</p>
<p><strong>IRP:</strong> mata uang X seharusnya <strong>terdepresiasi &asymp; 9%/tahun</strong> (selisih bunga).</p>
<p><strong>Konsisten!</strong> (Fisher: bunga &asymp; inflasi + riil.) <strong>Tapi:</strong> jangka pendek, <em>aliran modal</em> &amp; <em>sentimen</em> mendominasi &mdash; X bisa <em>menguat</em> bertahun-tahun sebelum &ldquo;kebenaran&rdquo; menang. <strong>Paritas = kompas jangka panjang; pasar jangka pendek = cuaca.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Carry = &ldquo;arbitrase&rdquo;.</strong> <strong>BUKAN.</strong> Covered IRP = arbitrase (risk-free). Carry (uncovered) = <strong>risiko kurs penuh</strong>! Soal yang menyebut carry &ldquo;arbitrase&rdquo; sedang mengujimu &mdash; <strong>jawab: carry = spekulasi terstruktur, bukan arbitrase.</strong></p>
</div>
<PlotlyChart
  data={[{x: ["2005","2006","2007","2008"], y: [5.5,5.5,5.5,-14.5], type: "bar", marker: {color: ["#16a34a","#16a34a","#16a34a","#ef4444"]}, text: ["+5,5%","+5,5%","+5,5%","−14,5%"], textposition: "outside"}]}
  title={"Carry JPY→AUD: 3 tahun panen, 1 tahun bencana"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Return (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Hijau = tahun panen carry; merah = unwind 2008.</p>
<p><strong>Interpretasi:</strong> <strong>Naik tangga, turun lift.</strong> Tiga tahun +16,5% lenyap dalam satu kuartal. Distribusi carry = <strong>skew negatif</strong>: inilah 'harga' uang gratis. Sizing carry seperti sizing <em>jual opsi</em> — kecil &amp; sadar ekor.</p>
</div>
<h2 id="em">FX EM — Intervensi & Kontrol</h2>
<p><strong>Definisi.</strong> <strong>Managed float</strong> (Indonesia): BI <em>intervensi</em> untuk meredam volatilitas — bukan mematok level. <strong>Cadangan devisa</strong> = amunisi intervensi. <strong>Kontrol modal</strong>: batasi arus keluar/masuk (darurat).</p>
<p><strong>Segitiga mustahil</strong> (trilemma): tidak bisa punya <em>sekaligus</em>: (1) kurs tetap, (2) kebijakan moneter independen, (3) modal bebas — <strong>pilih dua</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Trilemma seperti <strong>pilih 2 dari 3 menu</strong>: kurs stabil + modal bebas = ikut suku bunga AS (korbankan independen); independen + modal bebas = kurs mengambang (Indonesia); kurs tetap + independen = kunci pintu modal (kontrol).</p>
<p><strong>Kapan dipakai:</strong> Analisis risiko negara; hedging EM (biaya carry tinggi!).</p>
<p><strong>Pendalaman intuisi &mdash; PPP = &ldquo;jangka sangat panjang&rdquo;.</strong> Big Mac Index: burger seharusnya sama harganya di mana-mana (setelah kurs!). <strong>Realita:</strong> PPP <em>gagal</em> jangka pendek-menengah (5&ndash;10 tahun!) karena <em>hambatan dagang</em>, <em>barang non-tradable</em>, &amp; <em>spekulasi</em>. Tapi <strong>jangka sangat panjang</strong> (dekade!), kurs <em>cenderung</em> menuju PPP. <strong>Kegunaan:</strong> bukan untuk <em>trading</em> (terlalu lambat!), melainkan untuk <em>penilaian wajar jangka panjang</em> &amp; <em>keputusan struktural</em> (lokasi pabrik!).</p><details className="worked">
<summary>📐 Contoh: Pilihan Indonesia (klik untuk buka)</summary>
<p>Indonesia: <strong>managed float + modal relatif bebas + BI independen</strong> → pilih (2) &amp; (3), kurs <strong>mengambang terkendali</strong>.</p>
<p>Saat rupiah tertekan: BI <strong>intervensi</strong> (jual USD dari cadangan) + <strong>naikkan rate</strong> — dua alat, satu tujuan: stabilitas. Cadangan menipis = amunisi habis → pasar menguji.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Carry return &mdash; hitung lengkap</summary>
<p><strong>Soal:</strong> pinjam JPY 0,5%, invest AUD 6%, kurs awal 100 JPY/AUD, akhir 95 (yen menguat). Return?</p>
<p><strong>Langkah 1 &mdash; bunga:</strong> +6% &minus; 0,5% = <strong>+5,5%</strong>.</p>
<p><strong>Langkah 2 &mdash; kurs:</strong> (95&minus;100)/100 = <strong>&minus;5%</strong> (AUD melemah!).</p>
<p><strong>Total: +5,5% &minus; 5% = +0,5%</strong> &mdash; nyaris NOL! <strong>Pelajaran:</strong> pergerakan kurs <em>kecil</em> (5%) sudah menghapus <em>seluruh</em> selisih bunga. Carry = <strong>taruhan kurs diam-diam</strong> &mdash; yang tidak sadar ini = yang kaget saat &minus;14,5%.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Carry yang bertanggung jawab</summary>
<p><strong>Soal:</strong> rancang carry trade dengan modal Rp1M yang <em>bertanggung jawab</em>.</p>
<p><strong>Desain:</strong> (1) <strong>sizing &le; 2%</strong> portofolio (Rp20jt!) &mdash; carry = <em>pendapatan sampingan</em>; (2) <strong>stop-loss</strong> di &minus;10% (unwind otomatis &mdash; <em>disiplin</em> mengalahkan <em>keyakinan</em>); (3) <strong>diversifikasi</strong> 3 pasang (bukan satu!); (4) <strong>cadangan kas</strong> 50% untuk <em>margin call</em>.</p>
<p><strong>Ekspektasi jujur:</strong> +4&ndash;6%/tahun di masa tenang, <strong>&minus;10% (stop)</strong> saat crash. <strong>Bukan &ldquo;uang gratis&rdquo; &mdash; melainkan <em>premi risiko crash</em> yang dikelola.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Paritas, Satu Pesan</h2>
      <p>IRP, PPP, carry = <strong>satu pesan</strong>:</p>
      <ol>
        <li><strong>COVERED IRP = hukum</strong> &mdash; arbitrase memastikan. Tidak ada uang gratis yang di-lock.</li>
        <li><strong>UNCOVERED IRP/PPP = teori</strong> &mdash; bekerja <em>rata-rata &amp; jangka panjang</em>. Deviasi = <em>peluang</em> + <em>risiko</em>.</li>
        <li><strong>CARRY = monetisasi deviasi</strong> &mdash; memungut premi risiko crash. <em>Ukur sebagai penjual asuransi</em>: sizing kecil, stop-loss, diversifikasi.</li>
      </ol>
      <p><strong>Valas = paritas jangka panjang + sentimen jangka pendek.</strong> Trader yang hanya tahu satu sisi = setengah buta.</p>

      <h3>🎙️ Debat: &ldquo;Spekulasi valas = judi&rdquo;</h3>
      <p><strong>Kritikus:</strong> &ldquo;Valas = <em>zero-sum</em>. Tidak ada nilai diciptakan &mdash; yang satu untung = yang lain rugi. Ini judi institusional.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Valas = <strong>asuransi global</strong>: eksportir <em>hedge</em>, investor <em>diversifikasi</em>, bank sentral <em>stabilkan</em>. Spekulan = <em>penyedia likuiditas</em> yang dibayar. Tanpa mereka, <em>spread</em> melebar &amp; hedging mahal.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>fungsi (hedging) &ne; motif (spekulasi).</strong> Pasar butuh keduanya. Yang penting: <strong>ketahui peranmu</strong> &mdash; hedger yang berspekulasi = bencana; spekulan yang merasa hedger = ilusi.</p>
      <h3>📊 Data Corner: Forward premium puzzle</h3>
      <p><strong>Data:</strong> 1975&ndash;2020: mata uang bunga tinggi <em>rata-rata</em> terapresiasi 1&ndash;2%/tahun (bukan depresiasi 3&ndash;4% seperti teori!).</p>
      <p><strong>Cara membaca:</strong> anomali <em>persisten</em> 45 tahun = <strong>bukan kesalahan</strong>, melainkan <strong>premi risiko</strong> (<em>crash risk</em>). Carry = <em>dibayar</em> untuk menanggung risiko yang <em>jarang</em> terjadi. <strong>Saat risiko terealisasi (2008) &rarr; &ldquo;anomali&rdquo; terkoreksi brutal.</strong></p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Arbitrase atau bukan?</strong> Kamu lihat: pinjam JPY 0,5%, invest AUD 6%, <em>tanpa</em> forward lock. &ldquo;Arbitrase 5,5%!&rdquo; &mdash; benar? (Jawab: <strong>BUKAN arbitrase!</strong> Tanpa lock = <em>risiko kurs penuh</em>. Arbitrase = <em>covered</em> (return NOL). Yang &ldquo;5,5%&rdquo; = <em>ekspektasi</em>, bukan <em>jaminan</em>.)</p>
      <p><strong>(2) Kapan hedging merugikan?</strong> Eksportir dengan <em>natural hedge</em> (biaya &amp; pendapatan USD) membeli <em>forward</em> penuh. Apa yang salah? (Jawab: <strong>membayar biaya hedging untuk risiko yang <em>tidak ada</em>!</strong> Natural hedge = sudah netral. Over-hedge = <em>spekulasi</em> berkedok kehati-hatian.)</p>
      <p><strong>(3) Franc Swiss 2015.</strong> SNB melepas peg &rarr; CHF +30% sehari. Kamu carry-trader dengan CHF sebagai <em>funding</em>. Apa yang terjadi? (Jawab: <strong>bencana</strong> &mdash; pinjaman CHF-mu melonjak 30% dalam sehari! <strong>Pelajaran: <em>funding currency</em> dari bank sentral intervensionis = <em>risiko ekor politik</em>.</strong>)</p>
      <h3>📰 Studi Kasus: Krisis Asia 1997 &mdash; Peg yang Jebol</h3>
      <p>Thailand mematok baht ke USD. Carry trader global: pinjam USD murah, invest baht bunga tinggi &mdash; &ldquo;peg = tanpa risiko kurs&rdquo;. Ketika <em>spekulan</em> menyerang &amp; cadangan devisa habis, Thailand <strong>melepas peg</strong> &rarr; baht <strong>&minus;50%</strong> semalam.</p>
      <p><strong>Pelajaran:</strong> (1) <strong>Peg &ne; jaminan</strong> &mdash; peg = <em>janji politik</em>, bukan <em>hukum fisika</em>; (2) <strong><em>crowded trade</em></strong> &mdash; saat semua carry arah sama, <em>unwind</em> = berdesakan di pintu keluar; (3) <strong>cadangan devisa</strong> = amunisi bank sentral &mdash; pantau sebelum percaya peg.</p>
      <p><strong>Relevansi kini:</strong> setiap <em>peg</em>/band (Hong Kong, Timur Tengah, managed float) = <em>carry implisit</em>. Tanyakan selalu: <em>berapa cadangan? berapa lama bertahan?</em></p>
      <h3>📊 Data Corner: Membaca forward point</h3>
      <p><strong>Data:</strong> spot USD/IDR 15.000, forward 1-tahun 15.600.</p>
      <p><strong>Cara membaca:</strong> forward premium = (15.600&minus;15.000)/15.000 = <strong>4%</strong> &asymp; selisih bunga IDR&minus;USD. <strong>Biaya hedging:</strong> eksportir yang <em>lock</em> forward <strong>membayar &asymp; 4%/tahun</strong> (implisit!). <strong>Keputusan:</strong> hedge penuh = bayar 4% untuk kepastian. <strong>Tanya:</strong> apakah ketenangan itu <em>senilai</em> 4%? Jika volatilitas arus kas &lt; 4% &rarr; <strong>jangan hedge penuh</strong>.</p>
      <h3>🎙️ Debat Lanjutan: &ldquo;Bank sentral bisa mengendalikan kurs&rdquo;</h3>
      <p><strong>Percaya:</strong> &ldquo;Cadangan devisa triliunan = bisa intervensi kapan saja. Peg = kredibel.&rdquo;</p>
      <p><strong>Skeptis:</strong> &ldquo;1997: Thailand punya cadangan &lsquo;besar&rsquo; &mdash; habis dalam <em>minggu</em> melawan spekulan. <strong>Cadangan = amunisi terbatas; pasar = amunisi tak terbatas.</strong> Peg bertahan hanya jika <em>fundamental</em> mendukung.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>intervensi = <em>menunda</em>, bukan <em>mencegah</em>.</strong> Berhasil jika hanya <em>volatilitas</em> (bukan <em>tren</em>) yang dilawan &amp; fundamental sehat. Gagal jika melawan <em>arus fundamental</em>. <strong>Sebelum percaya peg: cek cadangan <em>vs</em> aliran modal harian.</strong></p>
      <h3>💱 Hedging Praktis: Forward vs Opsi vs Natural</h3>
      <p><strong>Eksportir menerima USD 1jt dalam 6 bulan.</strong> Tiga pilihan:</p>
      <p><strong>(1) Forward:</strong> lock kurs kini. <strong>Pro:</strong> kepastian total. <strong>Kontra:</strong> bayar <em>forward point</em> (&asymp; selisih bunga!); <strong>kehilangan upside</strong> jika rupiah melemah (USD menguat!). <strong>Cocok:</strong> margin tipis, butuh kepastian.</p>
      <p><strong>(2) Opsi (put USD):</strong> bayar premi, lindungi dari penguatan rupiah, <strong>tetap dapat upside</strong>. <strong>Kontra:</strong> premi = <em>biaya pasti</em> untuk proteksi <em>mungkin</em>. <strong>Cocok:</strong> ketidakpastian tinggi + ingin fleksibilitas.</p>
      <p><strong>(3) Natural hedge:</strong> jika juga <em>impor</em> bahan baku USD &rarr; <strong>biarkan netting alami</strong>. <strong>Kontra:</strong> jarang sempurna. <strong>Cocok:</strong> arus dua arah seimbang.</p>
      <p><strong>Aturan keputusan:</strong> (1) hitung <em>eksposur bersih</em> dulu (natural!); (2) bandingkan <em>biaya hedge</em> vs <em>volatilitas arus kas</em>; (3) <strong>hedge untuk <em>kelangsungan</em>, bukan untuk <em>ramalan</em></strong> (jangan hedge karena &ldquo;yakin kurs akan...&rdquo; &mdash; itu spekulasi!).</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Selisih bunga = profit pasti carry trade. Arbitrase bebas risiko.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Covered (dengan forward) = <strong>arbitrase, profit nol</strong> (IRP). Uncovered = <strong>spekulasi</strong>: selisih bunga <em>bisa</em> dihapus depresiasi mendadak (2008: −14,5%). 'Uang gratis' = premi risiko crash yang belum ditagih.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Bank sentral bisa mempertahankan kurs berapa pun dengan intervensi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Cadangan terbatas</strong> + trilemma: melawan pasar dengan cadangan menipis = <strong>undang spekulan</strong> (Soros vs BoE 1992). Intervensi meredam volatilitas, bukan melawan fundamental selamanya.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Negara bunga tinggi = investasi bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> bunga tinggi = <strong>inflasi/risiko tinggi</strong> (Fisher!). Return <em>riil</em> bisa NOL atau negatif setelah kurs. <strong>Investasi lintas negara = analisis <em>riil</em> + <em>kurs</em>, bukan <em>nominal</em> saja.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Hedging valas selalu benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> hedging = <strong>biaya</strong> (forward point!). Jika eksposur <em>jangka panjang</em> &amp; <em>natural hedge</em> (pendapatan &amp; biaya satu mata uang), hedging penuh = <strong>membayar mahal untuk ketenangan semu</strong>. <strong>Hedge <em>risiko</em>, bukan <em>volatilitas</em>.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Untuk carry: ukur skew, bukan cuma mean.</strong> Lihat distribusi historis: jika ekor kiri tebal, sizing ≤ 2% portofolio + stop-loss. Carry tanpa manajemen ekor = bom waktu.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>PPP untuk jangka panjang, IRP untuk jangka pendek.</strong> PPP butuh tahunan untuk bekerja (harga kaku); IRP harian via arbitrase. Jangan pakai PPP untuk trading bulanan.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Sebelum eksposur valas, jawab 3:</strong> (1) <strong>Paritas</strong> &mdash; apa kata IRP/PPP? (2) <strong>Sizing</strong> &mdash; berapa % jika skenario terburuk? (3) <strong>Hedge atau tidak</strong> &mdash; biaya vs manfaat? <strong>Tiga jawab, atau jangan sentuh.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator IRP & Carry</h2>
<p>Hitung forward wajar (covered IRP) dan simulasikan return carry trade.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Carry"}
  hint={"Ubah DEPRESIASI 0.0 -> 0.20 (yen menguat 20%). Carry +5,5% jadi −14,5% — crash!"}
  defaultCode={"# Covered IRP & simulasi carry trade\nS, R_D, R_F = 16000, 0.06, 0.005  # IDR/USD, r_IDR, r_JPY\nDEPRESIASI = 0.00   # yen menguat berapa? (ubah! 0.20 = crash)\n\nF = S * (1+R_D)/(1+R_F)\ncarry_bunga = R_D - R_F\nret_total = carry_bunga - DEPRESIASI  # depresiasi IDR vs JPY\n\nprint(f\"Forward wajar (covered IRP): Rp{F:,.0f}\")\nprint(f\"Carry bunga: {carry_bunga:+.2%}\")\nprint(f\"Depresiasi IDR: {DEPRESIASI:.0%}\")\nprint(f\"Return carry (uncovered): {ret_total:+.2%}\")\nprint()\nprint(\"2008:\" if DEPRESIASI > 0.1 else \"Tenang:\", \"tangga naik, lift turun.\" if DEPRESIASI > 0.1 else \"koin terkumpul.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator PPP</h2>
<p>Hitung kurs 'wajar' PPP dari level harga dua negara (ala Big Mac).</p>
<PyodideLab
  title={"Lab 2 — Kalkulator PPP"}
  hint={"Ubah INFLASI_ID 0.04 -> 0.10. Rupiah 'wajar' melemah — PPP jangka panjang!"}
  defaultCode={"# PPP: kurs wajar dari rasio harga\nHARGA_ID, HARGA_US = 35000, 5.99  # harga burger (Rp, USD)\nS_AKTUAL = 16000\nINFLASI_ID, INFLASI_US = 0.04, 0.025  # ubah!\n\nppp = HARGA_ID / HARGA_US\nmis = (S_AKTUAL - ppp)/ppp\nprint(f\"Kurs PPP: Rp{ppp:,.0f}/USD vs aktual Rp{S_AKTUAL:,.0f}\")\nprint(f\"Rupiah {'undervalued' if mis > 0 else 'overvalued'} {abs(mis):.1%} vs PPP\")\nprint()\n# PPP relatif 5 tahun\ns_fwd = S_AKTUAL * ((1+INFLASI_ID)/(1+INFLASI_US))**5\nprint(f\"Proyeksi 5 thn (PPP relatif): Rp{s_fwd:,.0f}\")\nprint(\"\\nPPP = jangkar jangka panjang, BUKAN sinyal trading bulanan.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh forward FX → <strong>Covered IRP (harga pasar)</strong></h3>
<p><strong>Kenapa:</strong> Arbitrase memastikan kewajaran.</p>
<p><strong>Contoh nyata:</strong> Hedging eksportir.</p>
</div>
<div className="decision-card">
<h3>2. Tertarik carry trade → <strong>Sizing kecil + stop; sadar skew</strong></h3>
<p><strong>Kenapa:</strong> Naik tangga, turun lift.</p>
<p><strong>Contoh nyata:</strong> Maks 2% portofolio.</p>
</div>
<div className="decision-card">
<h3>3. Analisis kurs jangka panjang → <strong>PPP relatif</strong></h3>
<p><strong>Kenapa:</strong> Harga kaku jangka pendek.</p>
<p><strong>Contoh nyata:</strong> Valuasi IDR 5-tahunan.</p>
</div>
<div className="decision-card">
<h3>4. Krisis EM, cadangan menipis → <strong>Kurangi eksposur / hedge</strong></h3>
<p><strong>Kenapa:</strong> Amunisi intervensi habis.</p>
<p><strong>Contoh nyata:</strong> 1998, 2013 taper tantrum.</p>
</div>
<div className="decision-card">
<h3>5. Carry trade → <strong>Sizing ≤ 2%, stop-loss, sadar ini jual asuransi</strong></h3>
<p><strong>Kenapa:</strong> Naik tangga, turun lift; −14,5% menghapus 3 tahun.</p>
<p><strong>Contoh nyata:</strong> JPY→AUD 2008 = +5,5% bunga −20% kurs = bencana.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Covered = pasti</strong>, uncovered = ekspektasi.</li><li><strong>Carry = jual asuransi</strong> (skew negatif).</li><li><strong>PPP jangka panjang</strong> saja.</li><li><strong>Trilemma</strong>: pilih 2 dari 3.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 'Uang Gratis' −14,5%</h2>
<div className="callout">
<p>Carry JPY (0,5%) → AUD (6%): +5,5%/thn 2005–2007. 2008: yen +20% → −14,5%.</p>
<p><strong>Vignette lanjutan.</strong> Carry JPY (0,5%) &rarr; AUD (6%): profit +5,5%/tahun 2005&ndash;2007 (&ldquo;uang gratis&rdquo;!). 2008: yen menguat 20% &rarr; return <strong>&minus;14,5%</strong> &mdash; menghapus 3 tahun profit sebulan. Manajer yang me-leverage 5&times; &rarr; <strong>margin call &amp; likuidasi</strong>.</p>
<p><strong>Pertanyaan:</strong> (a) Kenapa uncovered IRP &lsquo;gagal&rsquo;? (b) Hitung return 2008. (c) Desain carry yang bertanggung jawab? (d) Jika leverage 5&times;, berapa return 2008 &amp; apa yang terjadi? (e) Kapan <em>tidak</em> carry?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Forward premium puzzle</strong>: bunga tinggi <em>tidak</em> diimbangi depresiasi rata-rata — karena ada <strong>premi risiko crash</strong> yang jarang terealisasi. Gagal rata-rata, benar saat bencana.</p>
<p>(b) <strong>+5,5% − 20% = −14,5%</strong> — menghapus 3 tahun profit.</p>
<p>(c) <strong>Sizing ≤ 2%</strong>, <strong>stop-loss</strong> (unwind otomatis), <strong>diversifikasi funding/target</strong>, dan <strong>cadangan kas</strong> untuk margin. Carry = strategi <em>pendapatan</em>, bukan core.</p>
<p>(d) <strong>Leverage 5&times;:</strong> &minus;14,5% &times; 5 = <strong>&minus;72,5%</strong> &mdash; praktis <strong>margin call total</strong> (broker melikuidasi sebelum &minus;100%!). <strong>Pelajaran: leverage mengubah &ldquo;kerugian buruk&rdquo; menjadi &ldquo;kematian&rdquo;.</strong> Carry + leverage = menjual asuransi <em>tanpa cadangan klaim</em>.</p>
<p>(e) <strong>Jangan carry saat:</strong> (1) <strong>volatilitas <em>tersirat</em> tinggi</strong> (pasar sudah takut &rarr; crash <em>priced in</em>); (2) <strong>bank sentral <em>intervensi</em></strong> (funding currency bisa menguat tiba-tiba!); (3) <strong>krisis likuiditas global</strong> (<em>unwind</em> massal = <em>crowded trade</em>). <strong>Carry terbaik = saat semua tenang &amp; tidak ada yang membicarakannya.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Struktur Pasar Valas</h2>
      <h3>1. Segitiga paritas &mdash; Fisher + IRP + PPP</h3>
      <p><strong>International Fisher:</strong> selisih bunga &asymp; selisih inflasi ekspektasian. <strong>Gabungkan:</strong> bunga &rarr; inflasi (Fisher) &rarr; kurs (PPP) &rarr; forward (IRP) &mdash; <strong>satu sistem konsisten</strong>. Jika satu dilanggar, yang lain <em>menyesuaikan</em> (atau ada peluang!). Praktis: gunakan ketiganya untuk <em>cek konsistensi</em> pandangan makro.</p>
      <h3>2. Intervensi bank sentral &mdash; &ldquo;tangan tak terlihat&rdquo;</h3>
      <p>SNB (2015): melepas <em>peg</em> EUR/CHF &rarr; franc <strong>+30% sehari</strong>! Carry trader CHF-funded hancur. <strong>Pelajaran:</strong> <em>funding currency</em> dari bank sentral <em>intervensionis</em> = <strong>risiko ekor politik</strong>. Selalu cek: <em>rezim kurs</em> &amp; <em>sejarah intervensi</em>.</p>
      <h3>3. Hedging korporat &mdash; kapan &amp; berapa</h3>
      <p>Eksportir: <em>natural hedge</em> (biaya USD, pendapatan USD) &rarr; <strong>jangan over-hedge</strong>. <em>Exposure</em> bersih + horizon &lt; 1 tahun &rarr; <strong>forward</strong>. Ketidakpastian volume &rarr; <strong>opsi</strong> (bayar premi untuk fleksibilitas). <strong>Aturan:</strong> hedge <em>arus kas</em>, bukan <em>laporan akuntansi</em> (volatilitas akuntansi &ne; risiko ekonomi!).</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Forward kilat</h3>
      <p>S = 150, r_d = 0,5%, r_f = 5%. Forward 1 tahun?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>F = 150 &times; 1,005/1,05 = <strong>143,57</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Carry return</h3>
      <p>Bunga +5,5%, kurs &minus;5%. Return?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>+0,5%</strong> &mdash; kurs menghapus hampir semua bunga!</p>
      </details>
      <h3>Drill 3 &mdash; Big Mac</h3>
      <p>Burger AS $5, RI Rp35rb, kurs 15rb. PPP &amp; valuasi?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>PPP = 7.000; rupiah <strong>undervalued &asymp; 53%</strong> (menurut burger).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Carry trade adalah arbitrase bebas risiko.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> Carry = <em>uncovered</em> = risiko kurs penuh. Yang bebas risiko = <em>covered</em> IRP (return NOL!).</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. S=16.000, r_IDR=6%, r_USD=5%. Forward wajar 1 thn?"}
  options={
    ["16.000",
    "16.152",
    "15.850",
    "16.500"]
  }
  correct={1}
  explanation={"Benar: 16.000×1,06/1,05 = 16.152. Covered IRP = arbitrase, pasti berlaku."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Carry +5,5%/thn, lalu funding currency menguat 20%. Return tahun itu?"}
  options={
    ["+5,5%",
    "−14,5%",
    "+25,5%",
    "0%"]
  }
  correct={1}
  explanation={"Benar: 5,5% − 20% = −14,5%. Naik tangga, turun lift — skew negatif carry."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Bedakan covered vs uncovered IRP."}
  options={
    ["Sama",
    "Covered = arbitrase pasti; uncovered = ekspektasi, sering gagal",
    "Uncovered pasti",
    "Covered untuk saham"]
  }
  correct={1}
  explanation={"Benar: covered dijamin arbitrase; uncovered = hipotesis yang empiris gagal (forward premium puzzle)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Trilemma: pilih 2 dari 3. Indonesia memilih?"}
  options={
    ["Kurs tetap + modal bebas",
    "Moneter independen + modal bebas (managed float)",
    "Kurs tetap + independen",
    "Ketiganya"]
  }
  correct={1}
  explanation={"Benar: BI independen + modal relatif bebas → kurs mengambang terkendali. Tidak bisa ketiganya."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. PPP paling berguna untuk?"}
  options={
    ["Trading harian",
    "Jangkar kurs jangka panjang (tahunan)",
    "Opsi mingguan",
    "Tidak berguna"]
  }
  correct={1}
  explanation={"Benar: harga kaku jangka pendek — PPP butuh waktu bekerja. Untuk trading, pakai IRP/aliran modal."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Carry JPY→AUD: bunga +5,5%, yen menguat 20% (2008). Dengan leverage 3×, return & nasib?"}
  options={
    ["+16,5% — leverage memperbesar untung",
    "−43,5% — margin call; leverage mengubah rugi jadi kematian",
    "−14,5% — leverage tidak berpengaruh",
    "+5,5% — bunga tidak terpengaruh kurs"]}
  correct={1}
  explanation={"Benar: −14,5%×3 = −43,5%, praktis margin call. Pelajaran: carry + leverage = menjual asuransi tanpa cadangan — kerugian buruk menjadi kematian."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Covered IRP</strong>: F = S(1+r_d)/(1+r_f) — arbitrase, pasti.</li>
<li><strong>Uncovered IRP & PPP</strong>: ekspektasi; empiris sering gagal jangka pendek.</li>
<li><strong>Carry trade</strong>: selisih bunga − crash = skew negatif; sizing kecil.</li>
<li><strong>Trilemma</strong>: kurs tetap / moneter independen / modal bebas — pilih 2.</li>
<li><strong>Intervensi</strong> meredam volatilitas, tidak melawan fundamental.</li>
<li><strong>Aturan</strong>: IRP untuk pricing, PPP untuk jangkar panjang.</li>

<li><strong>Covered IRP:</strong> hukum arbitrase; forward = S &times; rasio bunga.</li>
<li><strong>Uncovered/PPP:</strong> teori jangka panjang; deviasi = peluang + risiko.</li>
<li><strong>Carry:</strong> jual asuransi; sizing kecil, stop-loss, tanpa leverage besar.</li>
<li><strong>Kapan TIDAK pakai:</strong> carry saat vol tinggi/intervensi; hedge tanpa hitung biaya; trading PPP jangka pendek.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b6-valuasi-derivatif" className="btn btn-secondary btn-sm">← PM-B6</Link>
        <Link href="/learn/pm-b8-faktor-risiko" className="btn btn-primary btn-sm">PM-B8 →</Link>
      </div>
    </div>
  );
}

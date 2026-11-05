"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA7FixedIncomePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A7 — Portfolio Management</span>
        <h1 className="display-title">Fixed Income:<br/>Pricing, Duration & Kredit</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Obligasi 'Aman' yang Turun 20%</a></li>
<li><a href="#pricing">Pricing & Yield</a></li>
<li><a href="#duration">Duration & Konveksitas</a></li>
<li><a href="#kredit">Risiko Kredit & Sekuritisasi</a></li>
<li><a href="#sintesis">Sintesis: Tiga Risiko, Satu Obligasi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Pak Hendra</a></li>
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
<li>Menghitung harga obligasi sebagai PV dan menjelaskan par/premium/discount.</li>
<li>Membedakan YTM, current yield, dan spread kredit.</li>
<li>Menghitung Macaulay & modified duration dan mengestimasi perubahan harga.</li>
<li>Menjelaskan waterfall sekuritisasi dan risiko tiap tranche.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Obligasi 'Aman' yang Turun 20%</h2>
      <div className="story">
        <p><strong>Pak Hendra</strong> membeli obligasi pemerintah 20 tahun karena &ldquo;aman &mdash; pasti dibayar&rdquo;. Kupon 6%. Setahun kemudian BI menaikkan suku bunga 2% — harga obligasinya <strong>anjlok 20%</strong>. Ia panik: <em>&ldquo;katanya aman?!&rdquo;</em></p>
<p>Twist-nya: obligasi <strong>aman dari gagal bayar</strong> ≠ <strong>aman dari risiko harga</strong>. Risiko suku bunga (duration 14 tahun!) menghantam duluan. &ldquo;Aman&rdquo; punya banyak arti — dan investor obligasi yang tidak paham duration sedang memegang <strong>bom waktu berbunga</strong>. Lesson ini: dua risiko obligasi yang berbeda.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="pricing">Pricing — Obligasi = Mesin PV</h2>
<p><strong>Definisi.</strong> <strong>Harga obligasi</strong> = PV kupon + PV principal, didiskon pada <strong>YTM</strong>. <strong>Par</strong> (kupon = YTM), <strong>premium</strong> (kupon &gt; YTM → harga &gt; 100), <strong>discount</strong> (kupon &lt; YTM → harga &lt; 100). <strong>Current yield</strong> = kupon/harga (abaikan capital gain/loss!). <strong>Spread</strong> = YTM − yield pemerintah setenor (harga risiko kredit).</p>
<p>Aturan: <strong>yield naik → harga turun</strong> (selalu, mekanis). Tidak ada pengecualian.</p>
<Tex math={String.raw`P = \sum_{t=1}^{N}\frac{C}{(1+y)^t} + \frac{F}{(1+y)^N}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`C`} />: kupon per periode</li>
<li><Tex math={String.raw`F`} />: nilai nominal (principal)</li>
<li><Tex math={String.raw`y`} />: YTM per periode (discount rate pasar)</li>
<li><Tex math={String.raw`N`} />: jumlah periode hingga jatuh tempo</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Harga obligasi seperti <strong>harga mesin penghasil uang</strong>: pembeli membayar PV dari semua 'cetak uang' masa depan. Suku bunga pasar = 'harga sewa mesin waktu' (PM-A2) — sewa naik → mesin yang sama jadi lebih murah.</p>
<p><strong>Kapan dipakai:</strong> Setiap beli obligasi: hitung YTM (bukan cuma kupon!).</p>

<p><strong>Pendalaman intuisi &mdash; obligasi = jungkat-jungkit yield-harga.</strong> Harga dan yield bergerak <strong>berlawanan arah, selalu</strong>: yield naik 1% &rarr; harga turun (besarnya tergantung duration). Kenapa? Karena kuponnya <em>tetap</em> &mdash; jika pasar kini menuntut 8% tapi obligasimu cuma membayar 6%, tidak ada yang mau bayar 100 untuk itu; harga harus <em>turun</em> hingga yield-nya menyamai 8%. <strong>Obligasi bukan &ldquo;aman&rdquo; &mdash; ia janji <em>nominal tetap</em> di dunia yang bunganya berubah-ubah.</strong></p>
<details className="worked">
<summary>📐 Contoh: Obligasi Pak Hendra (klik untuk buka)</summary>
<p>Nominal Rp100jt, kupon 6%/thn, tenor 20 thn. Saat dibeli YTM 6% → <strong>harga 100 (par)</strong>.</p>
<p>YTM naik ke 8%: P = 6 × [1−1,08^−20]/0,08 + 100/1,08^20 = 6 × 9,818 + 21,45 = 58,9 + 21,45 = <strong>Rp80,36jt</strong>.</p>
<p><strong>Turun 19,6%!</strong> — dari obligasi 'aman'. Kupon tetap Rp6jt/thn, tapi harga pasar ambruk. Inilah duration risk.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Mencari YTM dari harga pasar</summary>
<p><strong>Soal:</strong> obligasi 5 tahun, kupon 8%, par Rp100, harga pasar Rp95. Berapa YTM?</p>
<p><strong>Langkah 1 &mdash; coba 9%:</strong> 8&times;3,8897 + 100/1,5386 = 31,12 + 64,99 = <strong>96,11</strong> (terlalu tinggi &rarr; coba yield lebih besar).</p>
<p><strong>Langkah 2 &mdash; coba 9,5%:</strong> 8&times;3,8397 + 100/1,5742 = 30,72 + 63,52 = <strong>94,24</strong> (terlalu rendah).</p>
<p><strong>Langkah 3 &mdash; interpolasi:</strong> target 95 di antara 96,11 dan 94,24 &rarr; YTM &asymp; 9% + 0,5%&times;(96,11&minus;95)/(96,11&minus;94,24) = 9% + 0,5%&times;0,594 = <strong>&asymp;9,3%</strong>.</p>
<p><strong>Pelajaran:</strong> YTM tidak ada rumus langsung &mdash; ia <strong>dicari</strong> (trial/interpolasi/kalkulator). Tapi intuisinya sederhana: harga &lt; par &rarr; YTM &gt; kupon (diskon); harga &gt; par &rarr; YTM &lt; kupon (premi). <strong>Harga vs par langsung memberi tahu posisi YTM relatif terhadap kupon.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Clean vs dirty price &mdash; bunga berjalan</summary>
<p><strong>Soal:</strong> obligasi kupon 8% tahunan, <em>clean price</em> Rp98. Terakhir bayar kupon 90 hari lalu. Berapa <em>dirty price</em> (yang benar-benar dibayar)?</p>
<p><strong>Langkah 1:</strong> <em>accrued interest</em> = 8 &times; 90/365 = <strong>Rp1,97</strong>.</p>
<p><strong>Langkah 2:</strong> dirty = 98 + 1,97 = <strong>Rp99,97</strong>.</p>
<p><strong>Kenapa penting:</strong> penjual berhak atas bunga 90 hari itu &mdash; jika kamu membayar <em>clean price</em> saja, kamu &ldquo;mencuri&rdquo; bunganya. <strong>Semua transaksi memakai dirty price;</strong> clean price hanya untuk kuotasi. Lupa accrued = salah hitung yield &mdash; kesalahan Rp2 per Rp100 = 200bp untuk tenor pendek!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; YTM ≠ return yang pasti didapat.</strong> YTM = return <em>jika</em>: (1) pegang hingga jatuh tempo, (2) <strong>tidak default</strong>, (3) kupon di-<em>reinvest</em> pada tingkat YTM. Kondisi (3) nyaris tak pernah terpenuhi persis &rarr; <em>realized return</em> ≠ YTM (<em>reinvestment risk</em>). Untuk zero-coupon, (3) tidak relevan &rarr; YTM = realized (jika hold &amp; tidak default). <strong>YTM = janji bersyarat, bukan garansi.</strong></p>
</div>
<PlotlyChart
  data={[{x: [2,4,6,8,10,12], y: [163,132,107,80,62,49], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "harga"}]}
  title={"Harga obligasi 20 thn vs YTM (kupon 6%)"}
  layout={{xaxis: {title: "YTM (%)"}, yaxis: {title: "Harga (Rp jt)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = yield pasar, Y = harga. Kurva melengkung (konveks).</p>
<p><strong>Interpretasi:</strong> Hubungan <strong>non-linear &amp; cembung</strong>: yield 6%→8% harga −20; tapi 8%→10% 'hanya' −18. <strong>Konveksitas</strong> = kabar baik: penurunan melambat. Duration mengukur kemiringan; konveksitas mengukur kelengkungannya.</p>
</div>

<PlotlyChart
  data={[{x: [4,5,6,7,8,9,10], y: [127.18,112.46,100,89.40,80.36,72.61,65.94], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Harga obligasi 20thn kupon 6%"}]}
  title={"Hubungan harga-yield: melengkung (convex), tidak lurus"}
  layout={{xaxis: {title: "YTM (%)"}, yaxis: {title: "Harga (par = 100)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = yield, sumbu Y = harga. Titik tengah (6%, 100) = par.</p>
<p><strong>Interpretasi:</strong> Kurva <strong>cembung ke atas</strong> &mdash; inilah <em>convexity</em>. Akibatnya: yield turun 2% (6&rarr;4) &rarr; harga naik <strong>+27%</strong>; yield naik 2% (6&rarr;8) &rarr; harga turun <strong>&minus;20%</strong>. <strong>Tidak simetris!</strong> Pemegang obligasi untung dari asimetri ini &mdash; dan obligasi berdurasi panjang + kupon kecil punya convexity <em>terbesar</em> (pedang bermata dua: sensitif tapi cembung).</p>
</div>
<h2 id="duration">Duration — Pengukur Nyeri Suku Bunga</h2>
<p><strong>Definisi.</strong> <strong>Macaulay duration</strong> = rata-rata tertimbang waktu arus kas (tahun). <strong>Modified duration</strong> = MacDur/(1+y) → <strong>ΔP/P ≈ −D_mod × Δy</strong>. <strong>Konveksitas</strong> = koreksi orde-2 (kurva, bukan garis).</p>
<p>Aturan praktis: <strong>duration ≈ % perubahan harga per 1% perubahan yield</strong> (tanda negatif). D_mod 14 → yield +1% ≈ harga −14%.</p>
<Tex math={String.raw`\frac{\Delta P}{P} \approx -D_{mod} \times \Delta y`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`D_{mod}`} />: modified duration (tahun)</li>
<li><Tex math={String.raw`\Delta y`} />: perubahan yield (desimal: 1% = 0,01)</li>
<li>Tanda negatif: yield naik → harga turun (selalu!)</li>
<li>Obligasi Pak Hendra: D_mod ≈ 14 → Δy +2% ≈ −28% (aktual −19,6%; sisanya koreksi konveksitas)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Duration seperti <strong>panjang jungkat-jungkit</strong>: makin panjang tenor/kupon kecil → jungkat-jungkit makin panjang → goyangan suku bunga sedikit membuat ujung (harga) terlempar jauh. Konveksitas = peredam kejutnya.</p>
<p><strong>Kapan dipakai:</strong> Kelola risiko suku bunga: samakan duration dengan horizon (PM-C7 immunization).</p>

<p><strong>Pendalaman intuisi &mdash; duration punya dua wajah.</strong> Wajah 1: <strong>&ldquo;umur rata-rata&rdquo;</strong> uangmu kembali (tertimbang PV tiap arus kas) &mdash; duration 7 tahun = rata-rata kas kembali dalam 7 tahun. Wajah 2: <strong>sensitivitas harga</strong> &mdash; modified duration 7 = harga turun &asymp;7% tiap yield naik 1%. Dua wajah, satu angka. <strong>Aturan praktis:</strong> duration &asymp; horizon kebutuhan kasmu. Butuh uang 3 tahun lagi? Jangan pegang duration 14 &mdash; kamu berspekulasi arah suku bunga tanpa disadari.</p>
<details className="worked">
<summary>📐 Contoh: Bandingkan 3 obligasi (klik untuk buka)</summary>
<p>YTM naik 1%. <strong>A</strong> (2 thn, D_mod 1,9): −1,9%. <strong>B</strong> (10 thn, D_mod 7,5): −7,5%. <strong>C</strong> (20 thn, D_mod 14): <strong>−14%</strong>.</p>
<p>Untuk <strong>dana pensiun</strong> (horizon panjang): C cocok (match liabilities). Untuk <strong>dana darurat</strong>: A saja. <strong>Duration = alat, bukan musuh</strong> — cocokkan dengan horizon.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Macaulay &amp; modified &mdash; dari nol</summary>
<p><strong>Soal:</strong> obligasi 3 tahun, kupon 5%, YTM 6%, par 100. Hitung Macaulay &amp; modified duration.</p>
<p><strong>Langkah 1 &mdash; PV tiap arus kas:</strong> thn1: 5/1,06 = 4,72; thn2: 5/1,1236 = 4,45; thn3: 105/1,191 = 88,16. Harga = <strong>97,33</strong>.</p>
<p><strong>Langkah 2 &mdash; Macaulay:</strong> (1&times;4,72 + 2&times;4,45 + 3&times;88,16)/97,33 = 278,1/97,33 = <strong>2,86 tahun</strong>.</p>
<p><strong>Langkah 3 &mdash; Modified:</strong> 2,86/1,06 = <strong>2,70</strong>.</p>
<p><strong>Pakai:</strong> yield naik 1% &rarr; harga turun &asymp; 2,70% &rarr; harga baru &asymp; 97,33 &times; 0,973 = <strong>94,70</strong>. <strong>Catatan:</strong> ini aproksimasi linear &mdash; untuk perubahan besar, tambahkan <em>convexity</em> (koreksi lengkung).</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: DV01 &mdash; bahasa trader</summary>
<p><strong>Soal:</strong> lanjutkan contoh 2. Berapa DV01 (perubahan harga per 1bp)?</p>
<p><strong>Langkah 1:</strong> DV01 = modified &times; harga &times; 0,0001 = 2,70 &times; 97,33 &times; 0,0001 = <strong>Rp0,026</strong> per Rp100 nominal.</p>
<p><strong>Langkah 2 &mdash; skala:</strong> untuk posisi Rp10M &rarr; DV01 = Rp2.600 per bp. Yield naik 50bp &rarr; rugi &asymp; Rp130.000.</p>
<p><strong>Kenapa trader suka DV01:</strong> ia menjawab &ldquo;<em>berapa rupiah</em> saya rugi jika yield naik 1bp?&rdquo; &mdash; langsung ke P/L, tanpa % yang membingungkan. <strong>Manajemen risiko obligasi = manajemen DV01 agregat.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Duration ≠ jatuh tempo.</strong> Obligasi 20 tahun kupon 6% punya duration &asymp; 12&ndash;14 tahun, <strong>bukan</strong> 20! Hanya <em>zero-coupon</em> yang duration = maturity. Soal yang bertanya &ldquo;obligasi mana lebih sensitif suku bunga&rdquo; lalu memberi tenor saja sedang menjebak &mdash; <strong>kupon tinggi = duration lebih pendek</strong> (kas kembali lebih cepat).</p>
</div>
<details className="worked">
<summary>📐 Contoh 4: Convexity &mdash; koreksi lengkung</summary>
<p><strong>Soal:</strong> obligasi 20 tahun Pak Hendra (mod duration &asymp; 14). Yield naik 2%. Estimasi linear vs aktual?</p>
<p><strong>Linear:</strong> &Delta;P &asymp; &minus;14 &times; 2% = <strong>&minus;28%</strong>.</p>
<p><strong>Aktual (dengan convexity):</strong> harga di 8% = 80,36; di 10% = 72,61 &rarr; dari par 100: &minus;27,4%. <strong>Selisih 0,6pp</strong> = efek convexity (lengkung menguntungkan pemegang: turun <em>lebih sedikit</em> dari linear).</p>
<p><strong>Aturan:</strong> untuk &Delta;yield kecil (&lt; 1%), duration cukup. Untuk besar, convexity wajib. <strong>Convexity selalu menguntungkan pemegang obligasi</strong> (naik lebih banyak, turun lebih sedikit) &mdash; dan pasar mengenakan &ldquo;harga&rdquo; untuknya (yield sedikit lebih rendah).</p>
</details>
<h2 id="kredit">Kredit & Sekuritisasi — Siapa Dibayar Duluan</h2>
<p><strong>Definisi.</strong> <strong>Risiko kredit</strong>: default, downgrade, spread widening. <strong>Rating</strong> (AAA → D): opini kemampuan bayar. <strong>Sekuritisasi</strong>: kumpulkan pinjaman → jual sebagai <strong>tranches</strong>: <em>senior</em> (dibayar pertama, rating tinggi), <em>mezzanine</em>, <em>equity/first-loss</em> (dibayar terakhir, return tertinggi).</p>
<p><strong>Waterfall</strong>: kerugian dimakan dari bawah (equity) ke atas. Senior 'aman' <em>selama</em> kerugian &lt; buffer di bawahnya — 2008 membuktikan buffer bisa jebol.</p>
<p><strong>Kepribadian/intuisi:</strong> Sekuritisasi seperti <strong>menara gelas sampanye</strong>: dituang dari atas (arus kas masuk), diminum dari... sebenarnya dibayar dari atas (senior) dulu. Kerugian = retakan: mulai dari gelas paling bawah (equity). Retakan besar = merambat ke atas.</p>
<p><strong>Kapan dipakai:</strong> Analisis obligasi korporasi & structured products: selalu tanya 'di tranche mana saya?'</p>

<p><strong>Pendalaman intuisi &mdash; credit spread = harga ketakutan.</strong> Obligasi korporasi yield 9% vs pemerintah 6% &rarr; spread 3% = <strong>kompensasi</strong> untuk risiko default + likuiditas. Spread <em>melebar</em> = pasar ketakutan (2008: spread IG 2%&rarr;6%); <em>menyempit</em> = pasar berani. <strong>Spread adalah <em>barometer fear</em> pasar kredit</strong> &mdash; analis kredit membaca spread seperti dokter membaca tekanan darah.</p>
<details className="worked">
<summary>📐 Contoh: Waterfall Rp100M (klik untuk buka)</summary>
<p>Pool KPR Rp100M: senior Rp80M, mezz Rp15M, equity Rp5M. Gagal bayar Rp12M.</p>
<p><strong>Equity</strong> (Rp5M) habis total. <strong>Mezz</strong> menanggung Rp7M → sisa Rp8M. <strong>Senior</strong> utuh Rp80M.</p>
<p>Gagal bayar Rp25M → equity habis, mezz habis, <strong>senior rugi Rp5M</strong>. 'Aman' senior = relatif terhadap buffer. <strong>Selalu hitung break-even loss</strong> tiap tranche.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Expected loss = PD × LGD</summary>
<p><strong>Soal:</strong> obligasi korporasi: PD (1 tahun) = 2%, LGD = 60%. Spread pasar 300bp. Apakah spread &ldquo;cukup&rdquo;?</p>
<p><strong>Langkah 1:</strong> expected loss = 2% &times; 60% = <strong>1,2%</strong> = 120bp.</p>
<p><strong>Langkah 2:</strong> spread 300bp = 120bp (kompensasi expected loss) + <strong>180bp</strong> (premi risiko + likuiditas).</p>
<p><strong>Interpretasi:</strong> pasar menuntut 180bp <em>di atas</em> kerugian ekspektasian &mdash; untuk ketidakpastian PD itu sendiri + susah jual. <strong>Jika kamu yakin PD sebenarnya hanya 1%</strong> (EL 60bp), maka 240bp premi = <em>berlebihan</em> &rarr; obligasi <strong>murah</strong> (beli!). Inilah inti <em>credit picking</em>: berbeda pendapat tentang PD dengan pasar.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Z-spread intuitif</summary>
<p><strong>Soal:</strong> obligasi 3 tahun korporasi, YTM 8%. Kurva spot pemerintah: 1Y 5%, 2Y 5,5%, 3Y 6%. Estimasi Z-spread.</p>
<p><strong>Langkah 1 &mdash; konsep:</strong> Z-spread = tambahan <em>konstan</em> pada <em>setiap</em> spot rate agar PV arus kas = harga pasar.</p>
<p><strong>Langkah 2 &mdash; coba z = 1,8%:</strong> PV = CF1/1,068 + CF2/1,073&sup2; + CF3/1,078&sup3;... (dengan kupon mis. 7%: 7/1,068 + 7/1,151 + 107/1,253 = 6,55 + 6,08 + 85,39 = 98,02).</p>
<p><strong>Kenapa Z-spread &gt; YTM-spread biasa:</strong> YTM spread membandingkan <em>satu</em> angka (YTM) yang mengasumsikan kurva flat &mdash; Z-spread memakai <em>seluruh kurva</em>. Untuk kurva menanjak curam, bedanya material. <strong>Profesional memakai Z-spread; amatir memakai YTM spread.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Risiko, Satu Obligasi</h2>
      <p>Setiap obligasi membawa <strong>tiga risiko</strong> &mdash; dan tiga perangkat lesson ini memetakan masing-masing:</p>
      <ol>
        <li><strong>RISIKO HARGA (suku bunga)</strong> &rarr; diukur <strong>duration/DV01</strong>, dijinakkan dengan <em>matching horizon</em>. Musuh: yield naik.</li>
        <li><strong>RISIKO REINVESTASI</strong> &rarr; kupon harus diinvestasikan kembali entah di berapa. Solusi: <em>zero-coupon</em> / <em>laddering</em> untuk kebutuhan pasti.</li>
        <li><strong>RISIKO KREDIT</strong> &rarr; diukur <strong>PD &times; LGD &amp; spread</strong>, dijinakkan dengan diversifikasi &amp; analisis fundamental.</li>
      </ol>
      <p><strong>Kesalahan Pak Hendra = hanya melihat risiko #3</strong> (&ldquo;aman default&rdquo;) sambil buta terhadap #1. <strong>Analis obligasi profesional menilai ketiganya <em>sebelum</em> membeli &mdash; bukan setelah harga jatuh 20%.</strong></p>

      <h3>🎙️ Debat: Obligasi Panjang vs Pendek di Era Suku Bunga Tinggi</h3>
      <p>Yield 10Y di 8% &mdash; tertinggi 15 tahun. Dua manajer obligasi berdebat:</p>
      <p><strong>Manajer Durasi Panjang:</strong> &ldquo;8% = <em>once in a decade</em>. Kunci yield 8% selama 20 tahun &mdash; jika BI <em>cut</em> ke 5%, harga obligasiku terbang +40% (duration 14!). <em>Reinvestment risk</em> tenor pendek justru lebih menakutkan: kupon 8% hari ini jadi 5% saat roll-over.&rdquo;</p>
      <p><strong>Manajer Durasi Pendek:</strong> &ldquo;8% bisa jadi 10% &mdash; inflasi belum jinak. Obligasi 20 tahun turun 20% lagi = <em>career risk</em>. Tenor 2 tahun: dapat 7,5%, <em>fleksibel</em> roll ke yield lebih tinggi jika naik, dan <em>drawdown</em> maksimal 2%. <strong>Di ketidakpastian, opsionalitas &gt; yield.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> keduanya benar untuk <em>mandat berbeda</em>. Dana pensiun (horizon 20 thn) &rarr; panjang (match!). Dana darurat &rarr; pendek. <strong>Kesalahan = bukan pilihannya, melainkan <em>mismatch</em>-nya.</strong> Tanyakan selalu: <em>berapa horizon liabilitasmu?</em> &mdash; itu yang menentukan, bukan ramalan suku bunga.</p>
      <h3>📊 Data Corner: Membaca tabel obligasi</h3>
      <p><strong>Data (kuotasi):</strong> FR0087, kupon 6,5%, jatuh tempo 2034, harga 98,5, YTM 6,72%.</p>
      <p><strong>Cara membaca:</strong> (1) <strong>Harga &lt; 100</strong> &rarr; YTM (6,72%) &gt; kupon (6,5%) &mdash; obligasi di <em>diskon</em>. (2) <strong>Tenor ~8 tahun</strong> &rarr; duration &asymp; 6,5 &mdash; sensitif moderat. (3) <strong>YTM 6,72%</strong> = return <em>jika</em> hold hingga 2034 + kupon reinvest di 6,72%.</p>
      <p><strong>Pertanyaan analis:</strong> apakah 6,72% cukup untuk risiko 8 tahun? Bandingkan dengan <em>ekspektasi inflasi</em> (riil &asymp; 6,72% &minus; 3% = 3,7%) dan dengan <em>spread</em> korporasi sepadan. <strong>Satu baris kuotasi = tiga keputusan.</strong></p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi pemerintah = investasi aman, tidak bisa rugi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Aman dari <strong>default</strong> ≠ aman dari <strong>risiko harga &amp; inflasi</strong>. Pak Hendra: −20% karena duration. Plus <strong>risiko reinvestasi</strong> (kupon diinvestasikan di yield lebih rendah) dan <strong>inflasi</strong> (kupon 6% − inflasi 5% = riil 1%). 'Aman' = spesifikasikan dari apa.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kupon tinggi = return tinggi. Beli saja kupon terbesar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Return = <strong>YTM</strong>, bukan kupon. Obligasi kupon 12% di harga 130 (premium) bisa YTM-nya 6% — sama dengan kupon 6% di harga 100. Kupon tinggi + harga premium = ilusi. Selalu bandingkan YTM setara tenor &amp; risiko.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi = investasi aman, tidak bisa rugi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> obligasi punya <strong>tiga risiko</strong>: (1) <em>harga</em> (suku bunga naik &rarr; harga turun &mdash; Pak Hendra &minus;20%!), (2) <em>kredit</em> (default &rarr; bisa hilang 60%+), (3) <em>inflasi</em> (kupon 6% &minus; inflasi 8% = return riil negatif). &ldquo;Aman&rdquo; hanya berarti <em>prioritas klaim</em> lebih tinggi dari saham &mdash; bukan berarti tidak bisa rugi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kupon 12% pasti lebih baik dari kupon 6%.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> kupon tinggi biasanya = <strong>kompensasi risiko</strong> (kredit buruk) atau harga <em>premi</em> (bayar &gt; par). Yang dibandingkan adalah <strong>YTM <em>risk-adjusted</em></strong>, bukan kupon nominal. Obligasi &ldquo;kupon 12%&rdquo; dari emiten CCC bisa jadi <em>lebih buruk</em> dari &ldquo;kupon 6%&rdquo; pemerintah &mdash; setelah dikurangi expected loss.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Duration dulu, kupon kemudian.</strong> Sebelum beli obligasi, tanya: 'berapa D_mod-nya dan cocok tidak dengan horizon saya?' Investor yang hanya lihat kupon = Pak Hendra berikutnya.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Spread adalah harga ketakutan.</strong> Spread melebar 200bps = pasar menuntut kompensasi default lebih besar. Bandingkan spread historis: beli saat spread lebar (takut berlebihan) = strategi credit value.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Aturan duration pensiunan:</strong> <strong>duration portofolio ≤ horizon kebutuhan kas.</strong> Butuh dana 3 tahun lagi untuk haji? Duration 3 (bukan 14!). Jika yield naik, harga turun &mdash; tapi kamu <em>pegang hingga kas dibutuhkan</em>, dan kupon yang di-reinvest justru kini berbunga lebih tinggi (<em>reinvestment</em> mengkompensasi). <strong>Mismatch duration-horizon = spekulasi suku bunga yang tidak disadari.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Pricer Obligasi + Solver YTM</h2>
<p>Hitung harga dari YTM, atau cari YTM dari harga (biseksi).</p>
<PyodideLab
  title={"Lab 1 — Pricer Obligasi"}
  hint={"Ubah YTM 0.06 -> 0.08. Harga jatuh ~20% — rasakan duration 20 tahun!"}
  defaultCode={"# Pricer obligasi + solver YTM (biseksi)\nF, KUPON, N = 100, 6, 20   # nominal Rp jt, kupon/thn, tenor\nYTM = 0.06                  # ubah sesukamu\n\ndef harga(ytm):\n    return sum(KUPON/(1+ytm)**t for t in range(1, N+1)) + F/(1+ytm)**N\n\np = harga(YTM)\nstatus = \"PAR\" if abs(p-F) < 0.01 else (\"PREMIUM\" if p > F else \"DISCOUNT\")\nprint(f\"YTM {YTM:.0%}: harga Rp{p:.2f}jt [{status}]\")\n\n# solver: harga pasar 80.36 -> YTM berapa?\ntarget = 80.36\nlo, hi = 0.0, 0.30\nfor _ in range(60):\n    mid = (lo+hi)/2\n    lo, hi = (mid, hi) if harga(mid) > target else (lo, mid)\nprint(f\"Harga Rp{target}jt -> YTM {(lo+hi)/2:.2%} (cek: Rp{harga((lo+hi)/2):.2f}jt)\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Duration</h2>
<p>Hitung Macaulay & modified duration, estimasi perubahan harga.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Duration"}
  hint={"Ubah N 20 -> 5. D_mod anjlok — itulah kenapa dana pendek pilih tenor pendek."}
  defaultCode={"# Duration: Macaulay & modified\nF, KUPON, N, YTM = 100, 6, 20, 0.06  # ubah N sesukamu\n\ncf = [(t, KUPON if t < N else KUPON+F) for t in range(1, N+1)]\npv = [(t, c/(1+YTM)**t) for t, c in cf]\nP = sum(v for _, v in pv)\nmac = sum(t*v for t, v in pv)/P\ndmod = mac/(1+YTM)\n\nprint(f\"Harga: Rp{P:.2f}jt | Macaulay: {mac:.2f} thn | Modified: {dmod:.2f}\")\nfor dy in [0.01, 0.02, -0.01]:\n    est = -dmod*dy\n    aktual = (sum(c/(1+YTM+dy)**t for t, c in cf)-P)/P\n    print(f\"Yield {dy:+.0%}: estimasi {est:+.1%}, aktual {aktual:+.1%} (selisih=konveksitas)\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Horizon panjang (pensiun) → <strong>Duration panjang (match liabilities)</strong></h3>
<p><strong>Kenapa:</strong> Perubahan harga obligasi mengimbangi perubahan nilai liabilities.</p>
<p><strong>Contoh nyata:</strong> Immunization (PM-C7).</p>
</div>
<div className="decision-card">
<h3>2. Butuh likuiditas / takut rate naik → <strong>Duration pendek / floating-rate</strong></h3>
<p><strong>Kenapa:</strong> Harga stabil saat yield bergerak.</p>
<p><strong>Contoh nyata:</strong> Dana darurat di obligasi 1–2 thn.</p>
</div>
<div className="decision-card">
<h3>3. Spread melebar historis → <strong>Tambah eksposur kredit berkualitas</strong></h3>
<p><strong>Kenapa:</strong> Kompensasi ketakutan berlebihan.</p>
<p><strong>Contoh nyata:</strong> IG bonds saat krisis.</p>
</div>
<div className="decision-card">
<h3>4. Beli structured product → <strong>Tanya tranche & break-even loss</strong></h3>
<p><strong>Kenapa:</strong> 'Aman' senior = relatif terhadap buffer.</p>
<p><strong>Contoh nyata:</strong> Hitung waterfall sendiri.</p>
</div>
<div className="decision-card">
<h3>5. Memilih obligasi untuk dana 3 tahun lagi → <strong>Duration ≤ 3 tahun</strong></h3>
<p><strong>Kenapa:</strong> Match horizon = imunisasi terhadap risiko suku bunga.</p>
<p><strong>Contoh nyata:</strong> Ladder 1–3 tahun, bukan obligasi 20 tahun.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Yield naik → harga turun.</strong> Selalu.</li><li><strong>Bandingkan YTM</strong>, bukan kupon.</li><li><strong>Duration ≈ sensitivitas</strong> — cocokkan horizon.</li><li><strong>Tanya tranche</strong> di sekuritisasi.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Obligasi 'Aman' −20%</h2>
<div className="callout">
<p>Pak Hendra: obligasi 20 thn kupon 6%, beli di par (YTM 6%). Yield naik ke 8% → harga −20%.</p>
<p><strong>Vignette lanjutan.</strong> Pak Hendra (65 thn, pensiunan): obligasi 20 thn kupon 6%, beli di par (YTM 6%). Yield naik ke 8% &rarr; harga &minus;20% (Rp80,36jt). Ia panik ingin jual. Padahal ia <em>tidak butuh</em> dana besar hingga 10 tahun lagi (dana darurat sudah ada di deposito).</p>
<p><strong>Pertanyaan:</strong> (a) Hitung harga baru. (b) Dua risiko yang ia abaikan? (c) Jika ia <em>pegang hingga jatuh tempo</em> (dan tidak default), apakah ia &ldquo;rugi 20%&rdquo;? (d) Hitung DV01 posisinya (D_mod &asymp; 14). (e) Obligasi apa yang <em>seharusnya</em> ia pegang sejak awal?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Rp80,36jt</strong> (−19,6%): 6×9,818 + 21,45.</p>
<p>(b) <strong>Duration risk</strong> (D_mod ~14) dan <strong>inflation risk</strong> (riil return tipis). 'Aman default' ≠ 'aman harga'.</p>
<p>(c) <strong>Laddering tenor pendek-menengah</strong> (1–5 thn, D_mod ~3) atau <strong>reksadana pendapatan tetap</strong> durasi pendek. Prinsip: <strong>duration ≤ horizon kebutuhan kas</strong>.</p>
<p>(d) <strong>Tidak &mdash; &ldquo;rugi 20%&rdquo; hanya di atas kertas</strong> (<em>mark-to-market</em>). Jika dipegang hingga jatuh tempo &amp; tidak default: ia terima kupon 6% &times; 20 thn + par 100 = <strong>realized return 6% p.a.</strong> sesuai YTM beli. Yang hilang adalah <em>opportunity</em> (bisa dapat 8% di obligasi baru) &mdash; bukan pokok. <strong>Jual sekarang = mengubah rugi kertas jadi rugi permanen.</strong></p>
<p>(e) <strong>DV01</strong> = 14 &times; 80,36 &times; 0,0001 = <strong>Rp0,1125 per Rp100</strong> &rarr; untuk posisi Rp1M = <strong>Rp1,125 juta per 1bp</strong>. Yield naik 200bp (6%&rarr;8%) &rarr; rugi &asymp; Rp225jt &mdash; cocok dengan &minus;20% aktual (sedikit overestimasi karena convexity diabaikan).</p>
<p>(f) <strong>Sejak awal:</strong> obligasi 10 tahun (D_mod &asymp; 7,5 &le; horizon 10 thn) atau ladder 5&ndash;10 thn. Duration 14 untuk horizon 10 thn = <strong>mismatch</strong> &mdash; ia berspekulasi suku bunga tanpa sadar. <strong>Pensiunan butuh <em>kepastian kas</em>, bukan <em>maksimalisasi yield</em>.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Di Balik Kurva</h2>
      <h3>1. Spot vs YTM vs forward &mdash; tiga &ldquo;suku bunga&rdquo;</h3>
      <p><strong>YTM</strong> = rata-rata tertimbang (satu angka untuk seluruh umur). <strong>Spot rate</strong> = rate untuk <em>satu</em> titik waktu (diskonto tiap arus kas dengan spot-nya masing-masing &rarr; <em>arbitrage-free valuation</em>). <strong>Forward rate</strong> = rate <em>tersirat</em> antar dua titik masa depan (dari spot: (1+s₂)&sup2;/(1+s₁) &minus; 1).</p>
      <p><strong>Kenapa peduli:</strong> valuasi yang benar memakai <strong>spot</strong>, bukan YTM &mdash; bedanya kecil untuk kurva datar, besar untuk kurva curam. Dan forward rate = <em>ekspektasi pasar</em> tentang suku bunga masa depan &mdash; dibaca analis untuk prediksi BI rate.</p>
      <h3>2. Rating agencies: konflik yang dilembagakan</h3>
      <p><strong>Model issuer-pays:</strong> emiten <em>membayar</em> lembaga pemeringkat untuk diperingkat &mdash; seperti murid membayar penguji. Hasilnya: <em>rating inflation</em> (2008: ribuan MBS beracun berlabel AAA). <strong>Respons analis:</strong> perlakukan rating sebagai <strong>opini kedua</strong>, bukan kebenaran &mdash; dan selalu hitung <em>market-implied rating</em> dari spread (pasar sering &ldquo;menurunkan rating&rdquo; berbulan-bulan sebelum agensi).</p>
      <h3>3. Obligasi link-inflasi &mdash; asuransi daya beli</h3>
      <p><strong>Mekanisme:</strong> pokok &amp; kupon <em>diindeks</em> ke inflasi (mis. CPI). Inflasi 8% &rarr; pokok naik 8% &rarr; kupon (atas pokok baru) ikut naik. <strong>Breakeven inflation</strong> = yield nominal &minus; yield riil = ekspektasi inflasi pasar. Jika breakeven 4% tapi kamu yakin inflasi 6% &rarr; <strong>beli link-inflasi</strong> &mdash; kamu &ldquo;lebih pintar&rdquo; dari pasar tentang inflasi.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Harga kilat</h3>
      <p>Obligasi 5 thn, kupon 8%, par 100, YTM 10%. Harga?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>8&times;3,7908 + 100/1,6105 = 30,33 + 62,09 = <strong>92,42</strong> (diskon, karena YTM &gt; kupon &mdash; cek intuisi!).</p>
      </details>
      <h3>Drill 2 &mdash; Duration kilat</h3>
      <p>Zero-coupon 5 tahun. Macaulay duration? Modified (YTM 6%)?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Macaulay = <strong>5 tahun</strong> (zero-coupon: seluruh kas di akhir &rarr; duration = maturity). Modified = 5/1,06 = <strong>4,72</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; Expected loss kilat</h3>
      <p>PD 5%, LGD 40%, spread 500bp. Apakah kompensasi cukup?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>EL = 5%&times;40% = <strong>2%</strong> (200bp). Spread 500bp = 200bp EL + <strong>300bp premi</strong> &mdash; cukup <em>kecuali</em> kamu yakin PD sebenarnya &gt; 5%.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette yield trap</h3>
      <p>Obligasi emiten tambang &ldquo;yield 14%&rdquo;, rating CCC, pemerintah 6%. Temanmu bilang &ldquo;lumayan, 8% di atas pemerintah&rdquo;. Tiga kalimat responsmu.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p>&ldquo;Yield 14% = 800bp spread = pasar memprediksi <strong>default signifikan</strong> &mdash; itu bukan bonus, itu <em>kompensasi ketakutan</em>. Hitung dulu expected loss (PD&times;LGD): jika PD 10% &amp; LGD 70% &rarr; EL 7% &rarr; premi bersih cuma 100bp. <strong>Jangan beli yield; belilah <em>keyakinan bahwa PD pasar terlalu tinggi</em>.</strong>&rdquo;</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Obligasi 20 thn kupon 6%, YTM naik 6%→8%. Harga?"}
  options={
    ["Tetap 100",
    "≈ Rp80,4jt (−20%)",
    "Rp120jt",
    "Rp90jt"]
  }
  correct={1}
  explanation={"Benar: 6×9,818+21,45 = 80,36. Duration panjang = sensitivitas brutal. Inilah pelajaran Pak Hendra."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. D_mod = 7,5. Yield naik 1%. Estimasi perubahan harga?"}
  options={
    ["+7,5%",
    "−7,5%",
    "−1%",
    "Tidak berubah"]
  }
  correct={1}
  explanation={"Benar: ΔP/P ≈ −D_mod × Δy = −7,5%. Tanda negatif selalu — yield naik, harga turun."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kupon 12% harga 130 vs kupon 6% harga 100, tenor & risiko sama. Mana return lebih tinggi?"}
  options={
    ["Kupon 12%",
    "Sama (YTM yang menentukan, bukan kupon)",
    "Kupon 6%",
    "Tidak bisa tahu"]
  }
  correct={1}
  explanation={"Benar: harga premium 130 'memakan' kupon besarnya. Bandingkan YTM — kupon tanpa harga = ilusi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Pool Rp100M: senior 80, mezz 15, equity 5. Loss Rp12M. Yang rugi?"}
  options={
    ["Senior rugi 12",
    "Equity habis (5) + mezz rugi 7; senior utuh",
    "Dibagi rata",
    "Tidak ada yang rugi"]
  }
  correct={1}
  explanation={"Benar: waterfall — kerugian dimakan dari bawah. Senior aman selama loss &lt; Rp20M (buffer equity+mezz)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Investor pensiun butuh pembayaran 20 tahun lagi. Strategi duration?"}
  options={
    ["Duration sependek mungkin",
    "Match: duration panjang ≈ horizon (immunization)",
    "Tidak peduli duration",
    "Hanya deposito"]
  }
  correct={1}
  explanation={"Benar: duration panjang mengimbangi liabilities panjang — kenaikan yield menurunkan harga obligasi TAPI juga menurunkan PV kewajiban. Match = kebal."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Obligasi 3thn kupon 5%, harga 97,33, modified duration 2,70. Yield naik 1%. Estimasi harga baru?"}
  options={
    ["97,33 (tidak berubah)",
    "94,70",
    "99,96",
    "90,00"]}
  correct={1}
  explanation={"Benar: ΔP ≈ −2,70 × 1% × 97,33 = −2,63 → harga ≈ 94,70. Ini aproksimasi duration (linear) — untuk perubahan besar tambahkan koreksi convexity."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Harga</strong> = PV kupon + principal; par/premium/discount vs YTM.</li>
<li><strong>YTM</strong> = return sebenarnya; current yield menipu; spread = harga risiko kredit.</li>
<li><strong>Duration</strong>: ΔP/P ≈ −D_mod × Δy; konveksitas = koreksi lengkung.</li>
<li><strong>Risiko obligasi</strong>: suku bunga, kredit, inflasi, reinvestasi, likuiditas.</li>
<li><strong>Sekuritisasi</strong>: waterfall — kerugian dari bawah (equity) ke atas.</li>
<li><strong>Aturan</strong>: duration ≤ horizon; tanya tranche; bandingkan YTM.</li>

<li><strong>Harga-yield:</strong> berlawanan arah &amp; convex — duration untuk Δ kecil, +convexity untuk Δ besar.</li>
<li><strong>DV01:</strong> bahasa P/L trader — rupiah per 1bp.</li>
<li><strong>Kredit:</strong> EL = PD × LGD; spread = EL + premi risiko &amp; likuiditas.</li>
<li><strong>Kapan TIDAK pakai:</strong> YTM sebagai realized return (butuh 3 syarat); duration = maturity (hanya zero-coupon); rating sebagai kebenaran mutlak.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a6-equity" className="btn btn-secondary btn-sm">← PM-A6</Link>
        <Link href="/learn/pm-a8-derivatives" className="btn btn-primary btn-sm">PM-A8 →</Link>
      </div>
    </div>
  );
}

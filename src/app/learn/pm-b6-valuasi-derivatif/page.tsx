"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB6ValuasiDerivatifPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B6 — Portfolio Management</span>
        <h1 className="display-title">Valuasi Derivatif:<br/>Binomial & Black-Scholes</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Formula Rp Nobelis</a></li>
<li><a href="#binomial">Binomial 1-Periode</a></li>
<li><a href="#bs">Black-Scholes</a></li>
<li><a href="#swapval">Valuasi Swap</a></li>
<li><a href="#sintesis">Sintesis: Replikasi + Asumsi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: LTCM</a></li>
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
<li>Menjelaskan risk-neutral pricing pada binomial 1-periode.</li>
<li>Menghitung harga opsi Eropa via Black-Scholes.</li>
<li>Menjelaskan intuisi N(d1) dan N(d2).</li>
<li>Menilai interest rate swap sebagai selisih dua obligasi.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Formula Rp Nobelis</h2>
      <div className="story">
        <p><strong>1973</strong>: Black, Scholes &amp; Merton menerbitkan formula harga opsi. <strong>1997</strong>: Nobel Ekonomi. Di antaranya: <strong>LTCM</strong> (didirikan Scholes &amp; Merton!) kolaps 1998 — rugi <strong>USD 4,6 miliar</strong>.</p>
<p>Twist-nya: formula <strong>benar secara matematis</strong> — tapi <strong>asumsinya</strong> (volatilitas konstan, likuiditas selalu ada, return normal) <strong>salah di dunia nyata</strong>. LTCM bertaruh dengan leverage 25:1 pada asumsi itu. <strong>Model hebat + asumsi rapuh + leverage = bencana.</strong> Lesson ini: memakai formula dengan hormat pada batasnya.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="binomial">Binomial — Harga Opsi dari Replikasi</h2>
<p><strong>Definisi.</strong> <strong>Binomial 1-periode</strong>: saham naik ke S_u atau turun ke S_d. <strong>Replikasi</strong>: Δ saham + pinjaman = payoff opsi di <em>kedua</em> state → harga opsi = biaya replikasi. <strong>Risk-neutral probability</strong>: π = [(1+r) − d]/(u − d); harga = [π×C_u + (1−π)×C_d]/(1+r).</p>
<p><strong>Hedge ratio</strong> Δ = (C_u − C_d)/(S_u − S_d) — inilah <strong>delta</strong>!</p>
<Tex math={String.raw`C = \frac{\pi C_u + (1-\pi) C_d}{1+r} \quad;\quad \pi = \frac{(1+r)-d}{u-d}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\pi`} />: probabilitas risk-neutral (BUKAN probabilitas sebenarnya!)</li>
<li><Tex math={String.raw`u, d`} />: faktor naik/turun (S_u = u×S)</li>
<li>Harga = ekspektasi risk-neutral yang didiskon — probabilitas aktual tidak dipakai!</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Binomial seperti <strong>menyalin kunci</strong>: buat portofolio (Δ saham + kas) yang <em>persis</em> meniru payoff opsi di semua skenario. Harga kunci asli = biaya fotokopinya. <strong>Probabilitas aktual tidak penting</strong> — yang penting replikasinya.</p>
<p><strong>Kapan dipakai:</strong> Opsi Amerika/eksotis (pohon multi-periode); fondasi Black-Scholes.</p>
<p><strong>Pendalaman intuisi &mdash; binomial = &ldquo;mesin waktu&rdquo; valuasi.</strong> Mundur dari masa depan: di tiap titik, nilai opsi = <em>diskon</em> dari ekspektasi <em>risk-neutral</em>. <strong>Kenapa <em>risk-neutral</em>?</strong> Karena kita bisa <em>replikasi</em> opsi dengan saham + kas &mdash; dan replikasi tidak peduli kamu <em>risk-averse</em> atau <em>risk-lover</em>. <strong>Harga = biaya replikasi.</strong> Inilah ide terdalam derivatif: <em>harga bukan opini tentang masa depan &mdash; melainkan biaya membuat tiruannya hari ini</em>.</p><p><strong>Pendalaman intuisi &mdash; binomial = &ldquo;mesin waktu&rdquo; valuasi.</strong> Mundur dari masa depan: di tiap titik, nilai opsi = <em>diskon</em> dari ekspektasi <em>risk-neutral</em>. <strong>Kenapa <em>risk-neutral</em>?</strong> Karena kita bisa <em>replikasi</em> opsi dengan saham + kas &mdash; dan replikasi tidak peduli kamu <em>risk-averse</em> atau <em>risk-lover</em>. <strong>Harga = biaya replikasi.</strong> Inilah ide terdalam derivatif: <em>harga bukan opini tentang masa depan &mdash; melainkan biaya membuat tiruannya hari ini</em>.</p><details className="worked">
<summary>📐 Contoh: Call 1-periode (klik untuk buka)</summary>
<p>S = 100, u = 1,2, d = 0,9, r = 5%, X = 105.</p>
<p><strong>C_u</strong> = max(120−105,0) = 15. <strong>C_d</strong> = max(90−105,0) = 0.</p>
<p><strong>π</strong> = (1,05−0,9)/(1,2−0,9) = 0,5. <strong>C</strong> = (0,5×15 + 0,5×0)/1,05 = <strong>7,14</strong>.</p>
<p><strong>Δ</strong> = (15−0)/(120−90) = 0,5 → replikasi: 0,5 saham + pinjam 42,86. Cek: naik → 60−42,86×1,05 = 15 ✓.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Binomial 1-langkah &mdash; call</summary>
<p><strong>Soal:</strong> S0 = 100, u = 1,2, d = 0,8, r = 5%, K = 100 (call Eropa, 1 periode).</p>
<p><strong>Langkah 1 &mdash; payoff:</strong> Su = 120 &rarr; Cu = 20; Sd = 80 &rarr; Cd = 0.</p>
<p><strong>Langkah 2 &mdash; prob risk-neutral:</strong> p = (1,05 &minus; 0,8)/(1,2 &minus; 0,8) = 0,25/0,40 = <strong>0,625</strong>.</p>
<p><strong>Langkah 3:</strong> C0 = [0,625&times;20 + 0,375&times;0]/1,05 = 12,5/1,05 = <strong>11,90</strong>.</p>
<p><strong>Catatan:</strong> p = 62,5% <strong>bukan</strong> probabilitas &ldquo;nyata&rdquo; naik &mdash; ia <em>probabilitas tiruan</em> yang membuat harga = biaya replikasi. <strong>Jangan pernah</strong> menginterpretasikan p sebagai ramalan!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Put via put-call parity &mdash; jalan pintas</summary>
<p><strong>Soal:</strong> lanjutkan contoh 2. Berapa put K = 100?</p>
<p><strong>Langkah 1 &mdash; parity:</strong> C &minus; P = S0 &minus; K/(1+r) &rarr; P = C &minus; S0 + K/(1+r).</p>
<p><strong>Langkah 2:</strong> P = 11,90 &minus; 100 + 100/1,05 = 11,90 &minus; 100 + 95,24 = <strong>7,14</strong>.</p>
<p><strong>Verifikasi binomial:</strong> Pu = 0, Pd = 20 &rarr; P0 = [0,625&times;0 + 0,375&times;20]/1,05 = 7,5/1,05 = <strong>7,14</strong> &check;. <strong>Parity = <em>no-arbitrage</em></strong> &mdash; jika paritas dilanggar, ada <em>arbitrage</em> (uang gratis!). Selalu gunakan untuk <em>cek konsistensi</em>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Probabilitas risk-neutral ≠ probabilitas nyata.</strong> p = 62,5% di binomial <strong>bukan</strong> &ldquo;peluang naik&rdquo; &mdash; ia alat hitung agar harga = biaya replikasi. Soal yang bertanya &ldquo;probabilitas saham naik?&rdquo; lalu memberi p risk-neutral sedang menjebak &mdash; <strong>jawab: tidak bisa disimpulkan dari p</strong>.</p>
</div>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Binomial 1-langkah &mdash; call</summary>
<p><strong>Soal:</strong> S0 = 100, u = 1,2, d = 0,8, r = 5%, K = 100 (call Eropa, 1 periode).</p>
<p><strong>Langkah 1 &mdash; payoff:</strong> Su = 120 &rarr; Cu = 20; Sd = 80 &rarr; Cd = 0.</p>
<p><strong>Langkah 2 &mdash; prob risk-neutral:</strong> p = (1,05 &minus; 0,8)/(1,2 &minus; 0,8) = 0,25/0,40 = <strong>0,625</strong>.</p>
<p><strong>Langkah 3:</strong> C0 = [0,625&times;20 + 0,375&times;0]/1,05 = 12,5/1,05 = <strong>11,90</strong>.</p>
<p><strong>Catatan:</strong> p = 62,5% <strong>bukan</strong> probabilitas &ldquo;nyata&rdquo; naik &mdash; ia <em>probabilitas tiruan</em> yang membuat harga = biaya replikasi. <strong>Jangan pernah</strong> menginterpretasikan p sebagai ramalan!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Black-Scholes &mdash; anatomi rumus</summary>
<p><strong>Soal:</strong> S = 100, K = 100, r = 5%, T = 1, &sigma; = 20%. Hitung call (diberi N(d1) = 0,64, N(d2) = 0,56).</p>
<p><strong>Langkah 1:</strong> C = S&times;N(d1) &minus; K&times;e^( &minus;rT)&times;N(d2) = 100&times;0,64 &minus; 100&times;0,951&times;0,56.</p>
<p><strong>Langkah 2:</strong> C = 64 &minus; 53,26 = <strong>10,74</strong>.</p>
<p><strong>Anatomi:</strong> S&times;N(d1) = <strong>nilai kini saham yang &ldquo;didapat&rdquo;</strong> (delta-hedge); K&times;e^( &minus;rT)&times;N(d2) = <strong>nilai kini strike yang &ldquo;dibayar&rdquo;</strong>. N(d2) &asymp; <strong>probabilitas <em>risk-neutral</em> opsi <em>in-the-money</em></strong> (56%!). <strong>BS = selisih dua nilai kini tertimbang probabilitas.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Implied vol &mdash; membaca ketakutan</summary>
<p><strong>Soal:</strong> call diperdagangkan 15 (model dengan &sigma; = 20% memberi 10,74). Apa artinya?</p>
<p><strong>Langkah 1:</strong> harga pasar &gt; model &rarr; <strong>implied vol &gt; 20%</strong> (mis. 28% &mdash; via <em>trial &amp; error</em>/solver).</p>
<p><strong>Interpretasi:</strong> pasar mengharapkan <strong>volatilitas LEBIH TINGGI</strong> dari 20% &mdash; pasar <em>takut</em> (atau ada <em>event</em>!). <strong>Vol smile:</strong> implied vol <em>berbeda</em> per strike &mdash; <strong>bukti</strong> asumsi BS (vol konstan, return normal) <em>dilanggar</em> pasar. <em>Out-of-the-money put</em> vol tinggi = pasar membayar mahal untuk <strong>proteksi crash</strong>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;BS memberi harga benar&rdquo;.</strong> BS memberi harga <em>konsisten-dengan-asumsi</em> &mdash; dan asumsinya (vol konstan, return normal, likuiditas sempurna) <strong>selalu dilanggar</strong> di dunia nyata. <strong>BS = bahasa pasar</strong> (untuk quote implied vol), bukan <strong>ramalan</strong>. LTCM = bukti paling mahal.</p>
</div>
<details className="worked">
<summary>📐 Contoh 3: Put via put-call parity &mdash; jalan pintas</summary>
<p><strong>Soal:</strong> lanjutkan contoh 2. Berapa put K = 100?</p>
<p><strong>Langkah 1 &mdash; parity:</strong> C &minus; P = S0 &minus; K/(1+r) &rarr; P = C &minus; S0 + K/(1+r).</p>
<p><strong>Langkah 2:</strong> P = 11,90 &minus; 100 + 100/1,05 = 11,90 &minus; 100 + 95,24 = <strong>7,14</strong>.</p>
<p><strong>Verifikasi binomial:</strong> Pu = 0, Pd = 20 &rarr; P0 = [0,625&times;0 + 0,375&times;20]/1,05 = 7,5/1,05 = <strong>7,14</strong> &check;. <strong>Parity = <em>no-arbitrage</em></strong> &mdash; jika paritas dilanggar, ada <em>arbitrage</em> (uang gratis!). Selalu gunakan untuk <em>cek konsistensi</em>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Delta hedging &mdash; angka</summary>
<p><strong>Soal:</strong> kamu jual 100 call, delta 0,6 tiap opsi. Bagaimana hedge? Apa yang terjadi jika S naik 1?</p>
<p><strong>Langkah 1 &mdash; hedge:</strong> posisi = &minus;100 call &rarr; beli <strong>60 saham</strong> (100 &times; 0,6).</p>
<p><strong>Langkah 2:</strong> S naik Rp1 &rarr; call naik &asymp; 0,6 &times; 100 = Rp60 (rugi!); saham naik 60 &times; 1 = Rp60 (untung!) &rarr; <strong>net &asymp; 0</strong> (delta-neutral!).</p>
<p><strong>Tapi:</strong> delta <em>berubah</em> (gamma!) &rarr; hedge harus <strong>di-rebalance</strong> kontinu. <strong>Biaya rebalancing</strong> (bid-ask!) = realitas yang diabaikan BS. <strong>1987:</strong> <em>portfolio insurance</em> (delta-hedge mekanis) justru <strong>memperparah crash</strong> &mdash; semua menjual bersamaan!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Theta &mdash; &ldquo;opsi meleleh&rdquo;</summary>
<p><strong>Soal:</strong> call theta = &minus;0,05/hari, harga opsi 2,00. S tidak bergerak seminggu. Berapa nilai?</p>
<p><strong>Langkah 1:</strong> 2,00 &minus; 7 &times; 0,05 = 2,00 &minus; 0,35 = <strong>1,65</strong> (&minus;17,5% seminggu!).</p>
<p><strong>Pelajaran:</strong> <strong>membeli opsi = membayar sewa waktu.</strong> Jika arah benar tapi <em>lambat</em>, theta memakan profit. <strong>Penjual opsi</strong> (<em>covered call</em>!) = <em>menerima</em> theta &mdash; &ldquo;panen&rdquo; dari pembeli yang tidak sabar. <strong>80% opsi kedaluwarsa tak berharga</strong> &mdash; theta adalah alasannya.</p>
</details>
<PlotlyChart
  data={[{x: [0,1,1], y: [100,120,90], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "saham"}, {x: [0,1,1], y: [7.14,15,0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "call"}]}
  title={"Pohon binomial 1-periode (S=100, C=7,14)"}
  layout={{xaxis: {title: "Waktu"}, yaxis: {title: "Nilai"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Kiri = hari ini, kanan = dua skenario (naik/turun). Biru = saham, kuning = opsi.</p>
<p><strong>Interpretasi:</strong> Opsi = <strong>turunan</strong> saham: 100→7,14 hari ini; 120→15 atau 90→0. Replikasi (Δ=0,5 saham + pinjaman) meniru persis — <strong>harga opsi = biaya tiruannya</strong>. Inilah logika semua model opsi.</p>
</div>

<PlotlyChart
  data={[{x: [80,90,100,110,120], y: [0.5,3,10.7,20,31], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Call"}, {x: [80,90,100,110,120], y: [19,11,5,1.5,0.3], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Put"}]}
  title={"Payoff opsi: call naik, put turun (K=100)"}
  layout={{xaxis: {title: "Harga saham (S)"}, yaxis: {title: "Nilai opsi"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = harga saham saat jatuh tempo; sumbu Y = nilai opsi. Biru = call, merah = put (K = 100).</p>
<p><strong>Interpretasi:</strong> Call = <strong>NOL</strong> di bawah 100, lalu naik <strong>linear</strong> (asimetri!). Put = <strong>cermin</strong>. <strong>Perhatikan:</strong> harga opsi <em>sebelum</em> jatuh tempo &gt; payoff ini (ada <em>time value</em>!) &mdash; grafik ini = <em>intrinsic</em> saja. <strong>Asimetri = alasan opsi ada:</strong> <em>upside</em> tak terbatas, <em>downside</em> terbatas (premi).</p>
</div>
<h2 id="bs">Black-Scholes — Formula Nobel</h2>
<p><strong>Definisi.</strong> <strong>Black-Scholes</strong> (Eropa, non-dividen): C = S×N(d1) − PV(X)×N(d2). <strong>N(d2)</strong> ≈ probabilitas risk-neutral opsi <em>in-the-money</em> saat expiry. <strong>N(d1)</strong> = delta (hedge ratio). <strong>d1, d2</strong> memuat S/X, r, σ, T.</p>
<p><strong>Asumsi</strong>: volatilitas konstan, trading kontinu, tanpa biaya, return lognormal. <strong>Realita</strong>: vol smile (pasar tidak percaya!), crash (LTCM). Pakai dengan sadar.</p>
<Tex math={String.raw`C = S N(d_1) - \frac{X}{(1+r)^T} N(d_2)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`N(d_2)`} />: peluang risk-neutral S_T &gt; X (opsi berakhir ITM)</li>
<li><Tex math={String.raw`N(d_1)`} />: delta — jumlah saham untuk hedge</li>
<li><Tex math={String.raw`\sigma`} />: volatilitas — SATU-SATUNYA input yang tidak observable (diimplikasikan pasar!)</li>
<li>Naik σ → naik harga opsi (call &amp; put): ketidakpastian = mahal</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Black-Scholes seperti <strong>harga asuransi dari tabel aktuaria</strong>: S×N(d1) = 'nilai harapan terima', PV(X)×N(d2) = 'nilai harapan bayar'. Selisihnya = premi wajar. <strong>σ</strong> = 'seberapa ugal-ugalan pengemudinya' — tak terlihat, jadi ditaksir (implied).</p>
<p><strong>Kapan dipakai:</strong> Harga wajar opsi Eropa; implied vol; delta hedging.</p>
<p><strong>Pendalaman intuisi &mdash; Black-Scholes = binomial dengan langkah tak hingga.</strong> Saat &Delta;t &rarr; 0, pohon binomial &rarr; rumus BS. <strong>Lima input, satu misteri:</strong> S, K, r, T <em>teramati</em>; hanya <strong>&sigma; (volatilitas)</strong> yang harus <em>diestimasi</em>. Artinya: <strong>seluruh &ldquo;seni&rdquo; option pricing = menebak &sigma; dengan benar</strong>. <em>Implied vol</em> = &sigma; yang membuat harga model = harga pasar &mdash; <strong>cermin ekspektasi ketakutan kolektif</strong>.</p><p><strong>Pendalaman intuisi &mdash; Black-Scholes = binomial dengan langkah tak hingga.</strong> Saat &Delta;t &rarr; 0, pohon binomial &rarr; rumus BS. <strong>Lima input, satu misteri:</strong> S, K, r, T <em>teramati</em>; hanya <strong>&sigma; (volatilitas)</strong> yang harus <em>diestimasi</em>. Artinya: <strong>seluruh &ldquo;seni&rdquo; option pricing = menebak &sigma; dengan benar</strong>. <em>Implied vol</em> = &sigma; yang membuat harga model = harga pasar &mdash; <strong>cermin ekspektasi ketakutan kolektif</strong>.</p><details className="worked">
<summary>📐 Contoh: Hitung call (klik untuk buka)</summary>
<p>S=100, X=105, r=5%, σ=30%, T=1. <strong>d1</strong> = [ln(100/105)+(0,05+0,045)]/0,30 = 0,154. <strong>d2</strong> = 0,154−0,30 = −0,146.</p>
<p>N(d1) = 0,561, N(d2) = 0,442. <strong>C</strong> = 100×0,561 − 105×e^(−0,05)×0,442 = 56,1 − 44,1 = <strong>12,0</strong>.</p>
<p><strong>Uji</strong>: σ → 50% → C ≈ 21 (naik!). T → 0 → C → max(S−X,0) = 0 (time value habis).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Black-Scholes &mdash; anatomi rumus</summary>
<p><strong>Soal:</strong> S = 100, K = 100, r = 5%, T = 1, &sigma; = 20%. Hitung call (diberi N(d1) = 0,64, N(d2) = 0,56).</p>
<p><strong>Langkah 1:</strong> C = S&times;N(d1) &minus; K&times;e^( &minus;rT)&times;N(d2) = 100&times;0,64 &minus; 100&times;0,951&times;0,56.</p>
<p><strong>Langkah 2:</strong> C = 64 &minus; 53,26 = <strong>10,74</strong>.</p>
<p><strong>Anatomi:</strong> S&times;N(d1) = <strong>nilai kini saham yang &ldquo;didapat&rdquo;</strong> (delta-hedge); K&times;e^( &minus;rT)&times;N(d2) = <strong>nilai kini strike yang &ldquo;dibayar&rdquo;</strong>. N(d2) &asymp; <strong>probabilitas <em>risk-neutral</em> opsi <em>in-the-money</em></strong> (56%!). <strong>BS = selisih dua nilai kini tertimbang probabilitas.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Implied vol &mdash; membaca ketakutan</summary>
<p><strong>Soal:</strong> call diperdagangkan 15 (model dengan &sigma; = 20% memberi 10,74). Apa artinya?</p>
<p><strong>Langkah 1:</strong> harga pasar &gt; model &rarr; <strong>implied vol &gt; 20%</strong> (mis. 28% &mdash; via <em>trial &amp; error</em>/solver).</p>
<p><strong>Interpretasi:</strong> pasar mengharapkan <strong>volatilitas LEBIH TINGGI</strong> dari 20% &mdash; pasar <em>takut</em> (atau ada <em>event</em>!). <strong>Vol smile:</strong> implied vol <em>berbeda</em> per strike &mdash; <strong>bukti</strong> asumsi BS (vol konstan, return normal) <em>dilanggar</em> pasar. <em>Out-of-the-money put</em> vol tinggi = pasar membayar mahal untuk <strong>proteksi crash</strong>.</p>
</details>
<h2 id="swapval">Swap — Dua Obligasi dalam Satu</h2>
<p><strong>Definisi.</strong> <strong>Valuasi IRS</strong> (bayar fixed): V = PV(floating leg) − PV(fixed leg). Floating leg ≈ <strong>par</strong> (reset tiap periode!) → V = Notional − PV(fixed). <strong>Swap rate</strong> = fixed rate yang membuat V = 0 saat inisiasi.</p>
<p>Intuisi: bayar-fixed = <strong>short obligasi fixed-rate</strong> + <strong>long FRN</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Swap seperti <strong>dua langganan berlawanan</strong>: kamu terima 'koran harian' (floating, selalu harga kini = par) dan bayar 'majalah tahunan' (fixed). Nilai tukaran = selisih PV keduanya.</p>
<p><strong>Kapan dipakai:</strong> Unwind/novasi swap; hitung MTM untuk collateral.</p>
<p><strong>Pendalaman intuisi &mdash; Greeks = &ldquo;panel instrumen&rdquo;.</strong> Delta = <em>kecepatan</em> (sensitivitas ke harga); Gamma = <em>akselerasi</em> (perubahan delta); Vega = <em>sensitivitas ke ketakutan</em> (&sigma;); Theta = <em>biaya waktu</em> (opsi meleleh tiap hari!). <strong>Trader opsi tidak trading &ldquo;arah&rdquo; &mdash; mereka trading <em>Greeks</em>.</strong> Membeli opsi = membeli <em>gamma</em> + <em>vega</em>, membayar <em>theta</em>. Jika tidak paham tradeoff ini &rarr; jangan sentuh opsi.</p><p><strong>Pendalaman intuisi &mdash; Greeks = &ldquo;panel instrumen&rdquo;.</strong> Delta = <em>kecepatan</em> (sensitivitas ke harga); Gamma = <em>akselerasi</em> (perubahan delta); Vega = <em>sensitivitas ke ketakutan</em> (&sigma;); Theta = <em>biaya waktu</em> (opsi meleleh tiap hari!). <strong>Trader opsi tidak trading &ldquo;arah&rdquo; &mdash; mereka trading <em>Greeks</em>.</strong> Membeli opsi = membeli <em>gamma</em> + <em>vega</em>, membayar <em>theta</em>. Jika tidak paham tradeoff ini &rarr; jangan sentuh opsi.</p><details className="worked">
<summary>📐 Contoh: MTM swap (klik untuk buka)</summary>
<p>Notional Rp100M, bayar fixed 8%, sisa 3 thn. Rate kini: fixed 3-thn = 6%.</p>
<p><strong>PV fixed leg</strong> = 8×2,673 + 100/1,06³ = 21,38 + 83,96 = 105,34. <strong>V</strong> (bayar fixed) = 100 − 105,34 = <strong>−Rp5,34M</strong>.</p>
<p>Rate turun → yang bayar fixed <strong>rugi</strong> (terkunci mahal). MTM negatif = liabilitas → <strong>posting collateral!</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Delta hedging &mdash; angka</summary>
<p><strong>Soal:</strong> kamu jual 100 call, delta 0,6 tiap opsi. Bagaimana hedge? Apa yang terjadi jika S naik 1?</p>
<p><strong>Langkah 1 &mdash; hedge:</strong> posisi = &minus;100 call &rarr; beli <strong>60 saham</strong> (100 &times; 0,6).</p>
<p><strong>Langkah 2:</strong> S naik Rp1 &rarr; call naik &asymp; 0,6 &times; 100 = Rp60 (rugi!); saham naik 60 &times; 1 = Rp60 (untung!) &rarr; <strong>net &asymp; 0</strong> (delta-neutral!).</p>
<p><strong>Tapi:</strong> delta <em>berubah</em> (gamma!) &rarr; hedge harus <strong>di-rebalance</strong> kontinu. <strong>Biaya rebalancing</strong> (bid-ask!) = realitas yang diabaikan BS. <strong>1987:</strong> <em>portfolio insurance</em> (delta-hedge mekanis) justru <strong>memperparah crash</strong> &mdash; semua menjual bersamaan!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Theta &mdash; &ldquo;opsi meleleh&rdquo;</summary>
<p><strong>Soal:</strong> call theta = &minus;0,05/hari, harga opsi 2,00. S tidak bergerak seminggu. Berapa nilai?</p>
<p><strong>Langkah 1:</strong> 2,00 &minus; 7 &times; 0,05 = 2,00 &minus; 0,35 = <strong>1,65</strong> (&minus;17,5% seminggu!).</p>
<p><strong>Pelajaran:</strong> <strong>membeli opsi = membayar sewa waktu.</strong> Jika arah benar tapi <em>lambat</em>, theta memakan profit. <strong>Penjual opsi</strong> (<em>covered call</em>!) = <em>menerima</em> theta &mdash; &ldquo;panen&rdquo; dari pembeli yang tidak sabar. <strong>80% opsi kedaluwarsa tak berharga</strong> &mdash; theta adalah alasannya.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Harga = Replikasi + Asumsi</h2>
      <p>Binomial, Black-Scholes, Greeks = <strong>satu cerita</strong>:</p>
      <ol>
        <li><strong>HARGA (binomial/BS):</strong> harga = <strong>biaya replikasi</strong> &mdash; bukan ramalan. Probabilitas <em>risk-neutral</em> = alat hitung.</li>
        <li><strong>BAHASA (implied vol):</strong> BS = <strong>bahasa pasar</strong> untuk meng-quote ketakutan. <em>Vol smile</em> = bukti asumsi dilanggar.</li>
        <li><strong>KENDALI (Greeks):</strong> delta/gamma/vega/theta = <strong>panel instrumen</strong> &mdash; trader opsi trading Greeks, bukan arah.</li>
      </ol>
      <p><strong>Dan peringatan LTCM:</strong> model secanggih apa pun <strong>mati</strong> oleh leverage &amp; asumsi yang jebol bersamaan. <strong>Uji asumsi, batasi leverage, hormati ekor.</strong></p>

      <h3>🎙️ Debat: &ldquo;Derivatif = senjata pemusnah massal&rdquo; (Buffett)</h3>
      <p><strong>Buffett:</strong> &ldquo;Derivatif = <em>senjata pemusnah massal finansial</em>. Tidak transparan, <em>counterparty risk</em>, meledak saat krisis.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Pisau = alat atau senjata, tergantung tangan. Derivatif = <strong>transfer risiko</strong> yang efisien: petani lindungi harga, maskapai lindungi BBM. Yang berbahaya = <strong>spekulasi + leverage</strong>, bukan instrumennya.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>keduanya benar.</strong> Derivatif untuk <em>hedging</em> = manajemen risiko terbaik; untuk <em>spekulasi leverage</em> = tercepat menuju bangkrut. <strong>Tanya selalu: <em>hedge</em> atau <em>taruhan</em>?</strong> Jika taruhan &rarr; batasi ukuran hingga &ldquo;kalah total pun masih tidur nyenyak&rdquo;.</p>
      <h3>📊 Data Corner: Vol smile</h3>
      <p><strong>Data:</strong> S = 100. Implied vol: K=80 put = 35%; K=100 = 20%; K=120 call = 22%.</p>
      <p><strong>Cara membaca:</strong> put OTM (proteksi crash) vol <strong>35%</strong> &gt;&gt; ATM 20% = <strong>skew</strong>. Pasar membayar <strong>mahal</strong> untuk proteksi jatuh. <strong>Implikasi:</strong> jangan pakai vol 20% untuk menilai put OTM &mdash; kamu akan <em>underprice</em> proteksi. Gunakan <em>vol surface</em>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Black-Scholes memberi 'harga benar' opsi. Ikuti saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> BS = <strong>model</strong>, bukan kebenaran. Asumsi vol konstan &amp; return normal <strong>salah</strong> (vol smile, fat tails — 1987, 2008, LTCM). Gunakan untuk <strong>quote &amp; hedge</strong> (implied vol sebagai bahasa), bukan sebagai ramalan. <strong>Hormati batas model.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Delta hedge sekali = aman sampai expiry.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Delta berubah</strong> (gamma!) seiring harga &amp; waktu — hedge harus <strong>rebalancing dinamis</strong>. Plus biaya transaksi tiap rebalance. 'Hedge sempurna' hanya ada di textbook (trading kontinu tanpa biaya).</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi = leverage murah untuk spekulasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> opsi = <strong>asuransi + sewa waktu</strong>. 80% kedaluwarsa tak berharga (theta!). Spekulasi opsi tanpa paham Greeks = <strong>lotre dengan komisi</strong>. <strong>Kegunaan pro:</strong> <em>hedging</em> (protective put), <em>income</em> (covered call), <em>ekspresi pandangan vol</em> (straddle) &mdash; bukan &ldquo;tebak arah murah&rdquo;.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Model canggih = aman.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> LTCM punya <strong>peraih Nobel</strong> &amp; model tercanggih &mdash; kolaps karena <strong>leverage 25:1</strong> + asumsi jebol. <strong>Kecanggihan model tidak mengkompensasi leverage sembrono.</strong> Aturan: <em>leverage &le; toleransi error model</em>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Implikasikan, jangan asumsikan, volatilitas.</strong> Ambil σ dari harga pasar (implied), bukan historis. Vol smile/skew memberi tahu <em>apa yang ditakuti pasar</em> — informasi gratis.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Untuk opsi Amerika: binomial, bukan BS.</strong> BS hanya Eropa. Early exercise (dividen besar, put deep ITM) butuh pohon. Pilih alat sesuai jenis opsi.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Sebelum trading opsi, jawab 4:</strong> (1) <strong>Delta</strong> &mdash; seberapa sensitif ke arah? (2) <strong>Theta</strong> &mdash; berapa &ldquo;sewa&rdquo; per hari? (3) <strong>Vega</strong> &mdash; bagaimana jika vol meledak? (4) <strong>Max loss</strong> &mdash; berapa jika 100% salah? <strong>Tidak bisa jawab keempatnya = jangan trading.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Pricer Binomial 1-Periode</h2>
<p>Hitung harga call via replikasi & probabilitas risk-neutral.</p>
<PyodideLab
  title={"Lab 1 — Pricer Binomial"}
  hint={"Ubah U 1.2 -> 1.5 (volatilitas naik). Harga opsi naik — ketidakpastian = mahal!"}
  defaultCode={"# Binomial 1-periode: risk-neutral pricing\nS, U, D, R, X = 100, 1.2, 0.9, 0.05, 105  # ubah U sesukamu\n\nSu, Sd = S*U, S*D\nCu, Cd = max(Su-X, 0), max(Sd-X, 0)\npi = ((1+R)-D)/(U-D)\nC = (pi*Cu + (1-pi)*Cd)/(1+R)\ndelta = (Cu-Cd)/(Su-Sd)\n\nprint(f\"S naik -> {Su:.0f} (call {Cu:.0f}); turun -> {Sd:.0f} (call {Cd:.0f})\")\nprint(f\"Prob risk-neutral: {pi:.2f} (bukan probabilitas sebenarnya!)\")\nprint(f\"Harga call: {C:.2f}\")\nprint(f\"Delta (hedge ratio): {delta:.2f} saham per opsi\")\nprint(\"\\nReplikasi: beli delta saham + pinjam kas = payoff opsi.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Black-Scholes</h2>
<p>Harga call Eropa + delta via formula BS (N(x) dari erf).</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Black-Scholes"}
  hint={"Ubah SIG 0.30 -> 0.50. Harga naik — dan delta berubah. Itulah vega & gamma!"}
  defaultCode={"# Black-Scholes call Eropa (N(x) via erf)\nimport math\nS, X, R, SIG, T = 100, 105, 0.05, 0.30, 1.0  # ubah SIG!\n\ndef N(x): return 0.5*(1+math.erf(x/math.sqrt(2)))\n\nd1 = (math.log(S/X) + (R + SIG**2/2)*T)/(SIG*math.sqrt(T))\nd2 = d1 - SIG*math.sqrt(T)\nC = S*N(d1) - X*math.exp(-R*T)*N(d2)\n\nprint(f\"d1={d1:.3f}, d2={d2:.3f}\")\nprint(f\"N(d1) [delta] = {N(d1):.3f}, N(d2) [P(ITM)] = {N(d2):.3f}\")\nprint(f\"Harga call: {C:.2f}\")\nprint(f\"\\nNaikkan SIG -> harga naik (vega). Dekati expiry -> time value habis.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Opsi Amerika / eksotis → <strong>Binomial (pohon)</strong></h3>
<p><strong>Kenapa:</strong> BS hanya Eropa.</p>
<p><strong>Contoh nyata:</strong> Put Amerika deep ITM.</p>
</div>
<div className="decision-card">
<h3>2. Butuh harga wajar cepat → <strong>Black-Scholes + implied vol</strong></h3>
<p><strong>Kenapa:</strong> Standar quote pasar.</p>
<p><strong>Contoh nyata:</strong> Market-making opsi likuid.</p>
</div>
<div className="decision-card">
<h3>3. Unwind swap → <strong>Valuasi dua kaki (floating = par)</strong></h3>
<p><strong>Kenapa:</strong> MTM untuk settlement/collateral.</p>
<p><strong>Contoh nyata:</strong> Novasi ke bank lain.</p>
</div>
<div className="decision-card">
<h3>4. Hedging opsi → <strong>Delta hedge dinamis</strong></h3>
<p><strong>Kenapa:</strong> Delta bergerak (gamma).</p>
<p><strong>Contoh nyata:</strong> Rebalance berkala + biaya.</p>
</div>
<div className="decision-card">
<h3>5. Valuasi opsi → <strong>Harga = biaya replikasi; uji asumsi, batasi leverage</strong></h3>
<p><strong>Kenapa:</strong> BS = bahasa, bukan ramalan; leverage × error model = bencana.</p>
<p><strong>Contoh nyata:</strong> LTCM = model benar, asumsi jebol, leverage 25:1 → kolaps.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Replikasi</strong> = logika harga opsi.</li><li><strong>π risk-neutral</strong> ≠ probabilitas aktual.</li><li><strong>σ</strong> = satu-satunya input tak terlihat.</li><li><strong>Hormati asumsi</strong> (LTCM!).</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Nobelis yang Kolaps</h2>
<div className="callout">
<p>LTCM (Scholes & Merton): model canggih, leverage 25:1, 1998 rugi USD 4,6M (miliar).</p>
<p><strong>Vignette lanjutan.</strong> LTCM: didirikan peraih Nobel (Scholes &amp; Merton), model arbitrase tercanggih, return 40%+/tahun 1994&ndash;97. Leverage <strong>25:1</strong>. Agustus 1998 (krisis Rusia): likuiditas kering, korelasi &rarr; 1, vol meledak &mdash; asumsi BS jebol <em>serentak</em>. Rugi USD 4,6 miliar; The Fed memediasi bailout.</p>
<p><strong>Pertanyaan:</strong> (a) Apa yang salah &mdash; model atau pemakaian? (b) Tiga asumsi BS yang jebol 1998? (c) Aturan leverage dari kasus ini? (d) Jika model &ldquo;benar&rdquo; 99% waktu tapi salah 1% dengan leverage 25&times; &mdash; hitung ekspektasi kasarnya. (e) Rancang <em>risk framework</em> untuk desk derivatif.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Pemakaian</strong>: model benar dalam asumsinya; dunia melanggar asumsi (likuiditas kering, korelasi → 1, fat tails).</p>
<p>(b) <strong>Vol konstan</strong> (meledak), <strong>likuiditas selalu ada</strong> (pasar bekU), <strong>return normal</strong> (ekor tebal). Plus <strong>leverage 25:1</strong> = tidak ada ruang salah.</p>
<p>(c) <strong>Leverage ≤ model error.</strong> Jika model bisa salah 10%, leverage 25x = bunuh diri. <strong>Stress-test asumsi, bukan cuma output.</strong></p>
<p>(d) <strong>Matematika kasar:</strong> 99% &times; (+5%) + 1% &times; (&minus;100%) &mdash; dengan leverage 25&times;, skenario &ldquo;salah 1%&rdquo; = <strong>kebangkrutan total</strong> (&minus;25 &times; <em>loss</em> &gt; modal!). <strong>Ekspektasi &ldquo;positif&rdquo; tidak relevan jika satu skenario = mati.</strong> Inilah <em>ergodicity problem</em>: yang penting bukan rata-rata, melainkan <strong>kelangsungan hidup</strong>. <strong>Aturan Kelly:</strong> ukuran taruhan &le; edge/varians &mdash; LTCM melanggarnya 25&times; lipat.</p>
<p>(e) <strong>Framework:</strong> (1) <strong>leverage cap</strong> (mis. &le; 5&times; untuk strategi konvergensi); (2) <strong>stress test asumsi</strong> (vol 3&times;, likuiditas NOL, korelasi &rarr; 1); (3) <strong>stop-loss modal</strong> (<em>drawdown</em> 20% = potong posisi); (4) <strong>likuiditas buffer</strong> (<em>margin call</em> survival); (5) <strong>komite risiko independen</strong> (bukan trader yang menilai risikonya sendiri!). <strong>LTCM gagal di kelimanya.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Batas Model</h2>
      <h3>1. Vol smile &mdash; pasar tidak percaya BS</h3>
      <p>Implied vol <em>berbeda</em> per strike (senyum/condong) = <strong>pasar menolak</strong> asumsi vol konstan + return normal. <em>Skew</em> (put OTM vol tinggi) = pasar membayar mahal untuk <strong>proteksi crash</strong> (<em>crash-o-phobia</em> pasca-1987!). Praktis: <strong>jangan pakai satu vol untuk semua strike</strong> &mdash; gunakan <em>vol surface</em>.</p>
      <h3>2. American vs Eropa &mdash; hak <em>early exercise</em></h3>
      <p>Opsi Amerika bisa dieksekusi kapan saja = <strong>lebih berharga</strong> (atau sama). Kapan <em>early exercise</em> optimal? <strong>Put dalam</strong> (<em>deep ITM</em>) saat suku bunga tinggi, atau <strong>call sebelum dividen besar</strong>. Binomial menangani ini alami (<em>max</em> di tiap node); BS standar tidak. <strong>Untuk opsi Amerika, binomial/lattice = wajib.</strong></p>
      <h3>3. Model risk &mdash; risiko dari model itu sendiri</h3>
      <p><strong>Model risk</strong> = kerugian karena model <em>salah</em> (asumsi, implementasi, data!). Regulator (SR 11-7) mewajibkan <em>model validation</em> independen. Praktis: <strong>dua model independen</strong> untuk posisi besar; <em>backtest</em> harga model vs pasar; <strong>cadangan <em>model risk</em></strong> di modal. <strong>LTCM = model risk yang tidak dikelola.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Binomial kilat</h3>
      <p>S0 = 50, u = 1,1, d = 0,9, r = 5%, K = 50 call. Harga?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>p = (1,05&minus;0,9)/(1,1&minus;0,9) = <strong>0,75</strong>. Cu = 5, Cd = 0. C = (0,75&times;5)/1,05 = <strong>3,57</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Put-call parity</h3>
      <p>C = 11,90, S0 = 100, K = 100, r = 5%. P?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>P = 11,90 &minus; 100 + 95,24 = <strong>7,14</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; Delta hedge</h3>
      <p>Jual 200 call, delta 0,5. Hedge?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>Beli <strong>100 saham</strong> (200 &times; 0,5). Rebalance saat delta berubah.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Probabilitas risk-neutral 70% &rarr; saham 70% akan naik.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> p risk-neutral = alat hitung replikasi, <strong>bukan</strong> ramalan. Tidak ada informasi probabilitas nyata.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Binomial: S=100, u=1,2, d=0,9, r=5%, X=105. Harga call?"}
  options={
    ["15",
    "7,14",
    "10",
    "5"]
  }
  correct={1}
  explanation={"Benar: π=0,5, C=(0,5×15)/1,05=7,14. Probabilitas aktual tidak dipakai — hanya replikasi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. N(d2) dalam Black-Scholes ≈ ?"}
  options={
    ["Delta",
    "Probabilitas risk-neutral opsi ITM saat expiry",
    "Volatilitas",
    "Bunga"]
  }
  correct={1}
  explanation={"Benar: N(d2) = P(S_T &gt; X) risk-neutral. N(d1) = delta (hedge ratio)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. σ naik 30%→50%. Harga call?"}
  options={
    ["Turun",
    "Naik (vega positif)",
    "Tetap",
    "Nol"]
  }
  correct={1}
  explanation={"Benar: ketidakpastian = mahal (call & put). Inilah kenapa krisis = opsi mahal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Swap bayar-fixed, rate pasar turun. MTM?"}
  options={
    ["Untung",
    "Rugi (terkunci bayar mahal) — MTM negatif",
    "Nol",
    "Tidak terpengaruh"]
  }
  correct={1}
  explanation={"Benar: V = PV(floating) − PV(fixed); fixed leg makin mahal relatif → MTM negatif = liabilitas + collateral."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Pelajaran utama LTCM?"}
  options={
    ["Model tidak berguna",
    "Model benar + asumsi rapuh + leverage = bencana",
    "Hindari derivatif",
    "Nobel tidak penting"]
  }
  correct={1}
  explanation={"Benar: hormati batas model; stress-test asumsi; leverage ≤ toleransi error model."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. LTCM: model 'benar' tapi kolaps 1998. Pelajaran UTAMA untuk manajemen risiko derivatif?"}
  options={
    ["Model Black-Scholes salah secara matematis",
    "Leverage harus ≤ toleransi error model; stress-test asumsi, bukan cuma output",
    "Derivatif harus dilarang sepenuhnya",
    "Nobelis tidak boleh mengelola dana"]}
  correct={1}
  explanation={"Benar: masalahnya bukan model (matematikanya valid dalam asumsinya), melainkan leverage 25:1 + asumsi yang jebol serentak (likuiditas, korelasi, fat tails). Aturan: leverage ≤ error model, stress-test asumsi, hormati ekor."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Binomial</strong>: C = [πC_u + (1−π)C_d]/(1+r); π = [(1+r)−d]/(u−d); Δ = hedge ratio.</li>
<li><strong>Black-Scholes</strong>: C = S×N(d1) − PV(X)×N(d2); σ = input tak terlihat.</li>
<li><strong>Asumsi BS</strong>: vol konstan, kontinu, tanpa biaya — <strong>salah di dunia nyata</strong>.</li>
<li><strong>Swap</strong>: V = PV(floating) − PV(fixed); floating ≈ par.</li>
<li><strong>Delta hedge</strong> dinamis (gamma); opsi Amerika → binomial.</li>
<li><strong>LTCM</strong>: hormati asumsi; leverage ≤ error model.</li>

<li><strong>Binomial:</strong> harga = PV ekspektasi risk-neutral; p &ne; ramalan.</li>
<li><strong>BS:</strong> bahasa pasar (implied vol); asumsi selalu dilanggar.</li>
<li><strong>Greeks:</strong> delta/gamma/vega/theta = panel instrumen trader.</li>
<li><strong>Kapan TIDAK pakai:</strong> opsi tanpa paham Greeks; leverage &gt; error model; percaya model buta saat asumsi jebol.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b5-fixed-income-lanjut" className="btn btn-secondary btn-sm">← PM-B5</Link>
        <Link href="/learn/pm-b7-currency" className="btn btn-primary btn-sm">PM-B7 →</Link>
      </div>
    </div>
  );
}

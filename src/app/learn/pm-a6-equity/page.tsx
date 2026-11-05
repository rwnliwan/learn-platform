"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA6EquityPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A6 — Portfolio Management</span>
        <h1 className="display-title">Equity:<br/>Struktur Pasar, Indeks & Efisiensi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Margin Call di Hari Merah</a></li>
<li><a href="#mekanisme">Order, Short & Margin</a></li>
<li><a href="#indeks">Indeks & Efisiensi</a></li>
<li><a href="#analisis">Analisis Top-Down vs Bottom-Up</a></li>
<li><a href="#sintesis">Sintesis: Tiga Mekanisme, Satu Pasar</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Andi & Margin Call</a></li>
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
<li>Menjelaskan order market/limit/stop dan mekanisme long/short/margin.</li>
<li>Menghitung indeks price-weighted, cap-weighted, dan equal-weighted.</li>
<li>Membedakan efisiensi lemah, semi-kuat, dan kuat + implikasinya.</li>
<li>Membedakan analisis top-down vs bottom-up.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Margin Call di Hari Merah</h2>
      <div className="story">
        <p><strong>Andi</strong> beli saham Rp100jt dengan <strong>margin 50%</strong> (Rp50jt dana sendiri + Rp50jt pinjaman broker). Saham naik 20% → untung Rp20jt dari modal Rp50jt = <strong>+40%</strong>. <em>&ldquo;Leverage itu indah!&rdquo;</em> Ia tambah posisi. Lalu IHSG <strong>anjlok 15%</strong> sehari.</p>
<p>Twist-nya: broker menelepon — <strong>margin call</strong>. Andi harus setor dana <em>atau</em> posisinya <strong>dijual paksa di harga terendah</strong>. Leverage simetris: +40% kemarin = <strong>−60% + forced selling</strong> hari ini. Ia menjual di bottom — lalu pasar rebound minggu depannya. <strong>Margin tidak memaafkan timing yang salah.</strong> Lesson ini: mekanisme pasar yang harus dipahami sebelum dipakai.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="mekanisme">Mekanisme — Aturan Main Lantai Bursa</h2>
<p><strong>Definisi.</strong> <strong>Market order</strong>: eksekusi segera di harga pasar (bayar spread). <strong>Limit order</strong>: eksekusi hanya di harga/better (mungkin tidak tereksekusi). <strong>Stop order</strong>: jadi market order saat harga sentuh level (cut loss otomatis). <strong>Long</strong> = beli dulu (untung saat naik); <strong>short</strong> = pinjam &amp; jual dulu (untung saat turun; risiko <strong>tidak terbatas</strong>).</p>
<p><strong>Margin</strong>: beli dengan pinjaman broker. <strong>Margin call</strong> saat ekuitas &lt; maintenance margin → setor atau <strong>dilikuidasi paksa</strong>.</p>
<Tex math={String.raw`\text{Margin}_{aktual} = \frac{\text{Nilai posisi} - \text{Pinjaman}}{\text{Nilai posisi}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Initial margin (mis. 50%): dana sendiri minimum saat buka</li>
<li>Maintenance margin (mis. 25–30%): batas minimum; di bawah ini = margin call</li>
<li>Contoh Andi: posisi 100, pinjam 50 → margin 50%. Turun 15% → posisi 85 → margin (85−50)/85 = 41% (masih aman); turun 40% → margin 16,7% → call!</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Margin seperti <strong>bermain dengan uang pinjaman rentenir yang jujur</strong>: ia melipatgandakan untung DAN rugi, dan saat kamu kalah ia <strong>menjual barangmu paksa</strong> (tidak menunggu kamu 'sabar'). Short seperti <strong>menjual payung pinjaman saat kemarau</strong> — untung jika hujan, buntung tak terbatas jika kemarau panjang.</p>
<p><strong>Kapan dipakai:</strong> Sebelum pakai leverage: hitung titik margin call-mu.</p>

<p><strong>Pendalaman intuisi &mdash; margin = menyewa keberanian.</strong> Membeli saham dengan margin 50% berarti setiap Rp1 modalmu mengendalikan Rp2 saham. Naik 10% &rarr; untung 20% (dikurangi bunga). Turun 10% &rarr; rugi 20%. <strong>Leverage tidak mengubah <em>ekspektasi</em> return (tetap), ia mengubah <em>distribusi</em></strong> &mdash; melebarkan kedua ekor. Dan ekor kiri punya fitur kejam: <em>margin call</em> memaksamu jual di titik terburuk. <strong>Leverage = akselerator menuju kaya <em>atau</em> bangkrut, tanpa jalur tengah.</strong></p>
<details className="worked">
<summary>📐 Contoh: Titik call Andi (klik untuk buka)</summary>
<p>Posisi Rp100jt, pinjam Rp50jt, maintenance 30%.</p>
<p><strong>Titik call:</strong> (P − 50)/P = 0,30 → P − 50 = 0,3P → 0,7P = 50 → <strong>P = Rp71,4jt</strong> (−28,6%).</p>
<p>Saham turun 30% → ekuitas tinggal Rp20jt dari modal Rp50jt = <strong>−60%</strong>, plus risiko dilikuidasi di bottom. <strong>Hitung ini SEBELUM buka posisi</strong>, bukan saat broker menelepon.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Short selling &mdash; untung saat turun</summary>
<p><strong>Soal:</strong> kamu short 1.000 lembar @Rp100.000 (nilai Rp100M). Harga naik ke Rp130.000. Berapa P/L? Berapa jika turun ke Rp70.000?</p>
<p><strong>Langkah 1:</strong> short = pinjam &amp; jual dulu, beli kembali nanti. P/L = (jual &minus; beli) &times; lembar.</p>
<p><strong>Langkah 2:</strong> naik ke 130rb: (100rb &minus; 130rb) &times; 1.000 = <strong>&minus;Rp30M</strong> (rugi 30%!). Turun ke 70rb: (100rb &minus; 70rb) &times; 1.000 = <strong>+Rp30M</strong>.</p>
<p><strong>Asimetri kejam:</strong> long maksimal rugi 100% (harga ke nol); <strong>short rugi <em>tak terbatas</em></strong> (harga bisa naik tanpa batas). Ditambah: <em>short squeeze</em> (ramai-ramai beli kembali &rarr; harga meledak) &amp; biaya pinjam saham. <strong>Short bukan &ldquo;kebalikan beli&rdquo;</strong> &mdash; profil risikonya fundamentally berbeda.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Biaya bid-ask &mdash; pajak tersembunyi trading</summary>
<p><strong>Soal:</strong> saham XYZ bid Rp9.950, ask Rp10.050. Kamu beli 10.000 lembar di ask, langsung jual di bid. Berapa &ldquo;pajak&rdquo; spread?</p>
<p><strong>Langkah 1:</strong> spread = 10.050 &minus; 9.950 = Rp100 (1% dari mid Rp10.000).</p>
<p><strong>Langkah 2:</strong> rugi langsung = 100 &times; 10.000 = <strong>Rp1M</strong> &mdash; 1% modal lenyap <em>seketika</em>, sebelum harga bergerak!</p>
<p><strong>Implikasi:</strong> trader harian yang &ldquo;untung Rp500rb&rdquo; per trade tapi membayar spread 1% = sebenarnya <strong>rugi bersih</strong>. <strong>Spread adalah <em>hurdle rate</em> tiap transaksi</strong> &mdash; makin sering trading, makin besar pajaknya. Inilah keunggulan investor jangka panjang: ia membayar spread sekali per tahun, bukan 200&times;.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Short squeeze.</strong> Short terlihat &ldquo;murah&rdquo; saat saham <em>overvalued</em> &mdash; tapi <strong>overvalued bisa bertahan lebih lama dari solvabilitasmu</strong> (Keynes). Jika banyak yang short, kabar baik kecil memicu <em>short covering</em> massal &rarr; harga meledak naik &rarr; short dipaksa beli di puncak. Aturan: <strong>jangan short tanpa <em>stop-loss</em> &amp; batas ukuran posisi</strong> &mdash; atau lebih baik: pakai opsi put (rugi terbatas).</p>
</div>

<PlotlyChart
  data={[{x: [-30,-20,-15,-10,-5,0,5,10,15,20,30], y: [-60,-40,-30,-20,-10,0,10,20,30,40,60], type: "scatter", mode: "lines", marker: {color: "#d62728"}, name: "Margin 50% (2x)"}, {x: [-30,-20,-15,-10,-5,0,5,10,15,20,30], y: [-30,-20,-15,-10,-5,0,5,10,15,20,30], type: "scatter", mode: "lines", marker: {color: "#2a7de1"}, name: "Tunai (1x)"}, {x: [-28.6,-28.6], y: [-60,60], type: "scatter", mode: "lines", line: {dash: "dash", color: "#7f7f7f"}, name: "Margin call (-28,6%)"}]}
  title={"Leverage: pengganda untung DAN buntung"}
  layout={{xaxis: {title: "Return saham (%)"}, yaxis: {title: "Return modal (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = return saham, sumbu Y = return atas modal sendiri. Biru = beli tunai; merah = margin 50% (2&times; leverage); garis putus = titik margin call.</p>
<p><strong>Interpretasi:</strong> Garis merah <strong>dua kali lebih curam</strong> &mdash; naik 15% saham = +30% modal; turun 15% = &minus;30%. Tapi di &minus;28,6% saham, garis merah <strong>berhenti</strong> (forced sell!) &mdash; kamu <em>dikeluarkan paksa</em> dan tidak ikut rebound. <strong>Leverage memberi dua kali lipat <em>dan</em> memotong ekor kananmu saat paling dibutuhkan.</strong></p>
</div>
<h2 id="indeks">Indeks — Cara Menimbang Pasar</h2>
<p><strong>Definisi.</strong> <strong>Price-weighted</strong> (Dow): bobot = harga saham (saham Rp1jt 'lebih penting' — aneh tapi nyata). <strong>Cap-weighted</strong> (S&amp;P 500, IHSG): bobot = market cap (standar industri). <strong>Equal-weighted</strong>: semua sama (tilt ke small-cap).</p>
<p><strong>Efisiensi pasar</strong>: <em>lemah</em> (harga lampau tidak berguna → analisis teknikal mati), <em>semi-kuat</em> (semua info publik tercermin → analisis fundamental pun sulit), <em>kuat</em> (bahkan info privat tercermin — hampir tak ada yang percaya penuh).</p>
<p><strong>Kepribadian/intuisi:</strong> Indeks seperti <strong>rata-rata nilai kelas</strong>: price-weighted = rata-rata nilai <em>tanpa</em> memperhatikan bobot SKS (aneh); cap-weighted = rata-rata berbobot SKS (wajar); equal = semua pelajaran dianggap sama. Efisiensi pasar = klaim 'soal ujian sudah bocor ke semua orang' — makin efisien, makin sulit dapat nilai di atas rata-rata.</p>
<p><strong>Kapan dipakai:</strong> Pilih benchmark (PM-C5): samakan metode dengan mandatmu.</p>

<p><strong>Pendalaman intuisi &mdash; indeks = cermin yang (sedikit) retak.</strong> Indeks diklaim mewakili &ldquo;pasar&rdquo;, tapi ia punya <em>bias konstruksi</em>: cap-weighted = didominasi segelintir raksasa (5 saham bisa 40% bobot!); price-weighted = saham harga nominal tinggi mendominasi (tidak masuk akal ekonomi). <strong>Saat kamu beli ETF indeks, kamu tidak beli &ldquo;pasar&rdquo; &mdash; kamu beli <em>aturan pembobotan</em>.</strong> Pahami aturannya sebelum percaya cerminnya.</p>
<details className="worked">
<summary>📐 Contoh: 3 saham, 3 indeks (klik untuk buka)</summary>
<p>A: harga 100, cap 10T. B: harga 50, cap 30T. C: harga 200, cap 5T.</p>
<p><strong>Price-weighted</strong>: bobot by harga → C dominan (200/350 = 57%!). <strong>Cap-weighted</strong>: B dominan (30/45 = 67%). <strong>Equal</strong>: 33% masing-masing.</p>
<p>Jika C naik 10% sendirian: price-weighted melonjak (+5,7%), cap-weighted diam (+1,1%). <strong>Indeks yang sama, cerita beda</strong> — pahami metodologi benchmark-mu.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Price-weighted vs cap-weighted</summary>
<p><strong>Soal:</strong> indeks 2 saham. A: harga Rp100.000, kapitalisasi Rp10T. B: harga Rp10.000, kapitalisasi Rp90T. Keduanya naik 10%. Berapa return indeks price-weighted vs cap-weighted?</p>
<p><strong>Price-weighted:</strong> bobot = harga &rarr; A: 100/110 = 90,9%, B: 9,1%. Return = 0,909&times;10% + 0,091&times;10% = <strong>10%</strong> (kebetulan sama karena keduanya naik 10%).</p>
<p><strong>Cap-weighted:</strong> bobot = kap &rarr; A: 10%, B: 90%. Return = <strong>10%</strong> juga. <em>Tapi</em>: jika A naik 20% dan B naik 5%: PW = 0,909&times;20% + 0,091&times;5% = <strong>18,6%</strong>; CW = 0,1&times;20% + 0,9&times;5% = <strong>6,5%</strong>. <strong>Selisih 12pp dari metode yang sama-sama &ldquo;indeks&rdquo;!</strong></p>
<p><strong>Pelajaran:</strong> price-weighted memberi bobot raksasa ke saham <em>harga nominal tinggi</em> (A, yang kapitalisasinya kecil!) &mdash; tidak masuk akal ekonomi. Itulah kenapa dunia beralih ke cap-weighted. <strong>Selalu cek metodologi indeks sebelum pakai sebagai benchmark.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Free float &mdash; kenapa bobot BUMN kecil?</summary>
<p><strong>Soal:</strong> emiten kapitalisasi Rp100T, tapi pemerintah pegang 70% (tidak diperdagangkan). Berapa bobot di indeks free-float-adjusted?</p>
<p><strong>Langkah 1:</strong> free float = 100T &times; 30% = <strong>Rp30T</strong> &mdash; bobot indeks memakai Rp30T, bukan Rp100T.</p>
<p><strong>Implikasi ganda:</strong> (1) indeks <em>underweight</em> BUMN vs ekonomi riil &mdash; &ldquo;pasar&rdquo; versi indeks ≠ ekonomi versi BPS; (2) saham free float kecil = <strong>likuiditas tipis</strong> &rarr; rentan digoreng &rarr; bobot kecil melindungimu dari jebakan likuiditas. <strong>Free float adjustment = filter kualitas tersembunyi.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Indeks naik X%&rdquo; ≠ &ldquo;portofolioku naik X%&rdquo;.</strong> Indeks cap-weighted didominasi raksasa + <em>survivorship bias</em> (saham mati dikeluarkan!) + <em>rebalancing</em> berkala. Return indeks <strong>melebih-lebihkan</strong> pengalaman investor rata-rata. Jangan pakai return indeks mentah sebagai ekspektasi portofoliomu &mdash; kurangi 1&ndash;2% untuk biaya, pajak, &amp; <em>timing</em>.</p>
</div>
<PlotlyChart
  data={[{x: ["A", "B", "C"], y: [28.6, 14.3, 57.1], type: "bar", marker: {color: "#2a7de1"}, name: "price-wtd"}, {x: ["A", "B", "C"], y: [22.2, 66.7, 11.1], type: "bar", marker: {color: "#e8a838"}, name: "cap-wtd"}, {x: ["A", "B", "C"], y: [33.3, 33.3, 33.3], type: "bar", marker: {color: "#16a34a"}, name: "equal"}]}
  title={"Bobot 3 saham di 3 metode indeks (%)"}
  layout={{xaxis: {title: "Saham"}, yaxis: {title: "Bobot (%)"}, barmode: "group", showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga kelompok batang = tiga metode pembobotan untuk saham yang sama.</p>
<p><strong>Interpretasi:</strong> C (harga termahal, cap terkecil) <strong>dominan di price-weighted (57%)</strong> tapi mungil di cap-weighted (11%). Pilih benchmark buta metodologi = mengukur dengan penggaris yang salah.</p>
</div>
<h2 id="analisis">Analisis — Dari Langit atau Dari Tanah</h2>
<p><strong>Definisi.</strong> <strong>Top-down</strong>: ekonomi → industri → perusahaan (PM-A3 → PM-A4 → pilih saham). <strong>Bottom-up</strong>: cari perusahaan bagus dulu, makro belakangan. Keduanya sah; top-down unggul saat <strong>rezim makro</strong> dominan (krisis, rate shock), bottom-up saat <strong>stock-picking</strong> idiosinkratis.</p>
<p><strong>DDM</strong> (pratinjau PM-B4): P0 = D1/(r−g) — nilai = dividen didiskon. Jembatan ke valuasi.</p>
<Tex math={String.raw`P_0 = \frac{D_1}{r-g}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`D_1`} />: dividen tahun depan</li>
<li><Tex math={String.raw`r`} />: required return (CAPM, PM-A10)</li>
<li><Tex math={String.raw`g`} />: growth dividen (harus &lt; r!)</li>
<li>Naik g 1% ≈ naikkan nilai besar — sensitif; hanya untuk perusahaan dividen stabil</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Top-down seperti <strong>memilih kota dulu baru cari rumah</strong>; bottom-up = <strong>jatuh cinta pada rumah lalu cek kotanya</strong>. DDM seperti <strong>menilai pohon dari buahnya</strong>: buah tahunan (dividen) didiskon = harga pohon.</p>
<p><strong>Kapan dipakai:</strong> Framework analisis: top-down untuk alokasi sektor, bottom-up untuk stock picking.</p>

<p><strong>Pendalaman intuisi &mdash; DDM: saham = mesin dividen.</strong> Model dividen bilang nilai saham = PV seluruh dividen masa depan. Terdengar sempit &mdash; tapi intuisinya dalam: <strong>harga saham hari ini adalah klaim atas kas masa depan</strong>, bukan atas &ldquo;cerita&rdquo;. Jika model DDM memberi Rp5.000 tapi pasar Rp15.000, pertanyaannya bukan &ldquo;model salah?&rdquo; melainkan &ldquo;<em>asumsi pertumbuhan apa</em> yang diyakini pasar?&rdquo; &mdash; dan apakah kamu berani bertaruh asumsi itu salah.</p>
<details className="worked">
<summary>📐 Contoh: DDM 10 detik (klik untuk buka)</summary>
<p>D1 = Rp500, r = 12%, g = 5%. <strong>P0 = 500/(0,12−0,05) = Rp7.143.</strong></p>
<p>Harga pasar Rp9.000 → <strong>overvalued</strong> (asumsi benar). Sensitivitas: g = 6% → P0 = Rp8.333 (+17%!). <strong>1% growth = 17% nilai</strong> — inilah kenapa asumsi g adalah medan perang analis.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): DDM 2-stage &mdash; growth lalu stabil</summary>
<p><strong>Soal:</strong> dividen tahun ini Rp500. Tumbuh 20%/thn selama 3 thn (fase growth), lalu 5% selamanya. r = 12%. Nilai wajar?</p>
<p><strong>Langkah 1 &mdash; dividen fase growth:</strong> D1 = 600, D2 = 720, D3 = 864.</p>
<p><strong>Langkah 2 &mdash; PV fase growth:</strong> 600/1,12 + 720/1,12&sup2; + 864/1,12&sup3; = 535,7 + 573,9 + 614,6 = <strong>Rp1.724</strong>.</p>
<p><strong>Langkah 3 &mdash; terminal (Gordon):</strong> D4 = 864&times;1,05 = 907,2. P3 = 907,2/(0,12&minus;0,05) = Rp12.960. PV = 12.960/1,12&sup3; = <strong>Rp9.221</strong>.</p>
<p><strong>Total: Rp10.945.</strong> Perhatikan: <strong>84% nilai</strong> berasal dari terminal value! Valuasi growth = taruhan pada <em>asumsi abadi</em> (g = 5% selamanya). Ubah g ke 4%: terminal = 907,2&times;(1,04/1,05)/0,08... &asymp; Rp11.200 &rarr; PV Rp7.970 &rarr; total Rp9.694 (&minus;11%!). <strong>Sensitivitas brutal = alasan analis growth rendah hati.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Earnings yield vs bond yield (Fed model)</summary>
<p><strong>Soal:</strong> IHSG P/E 15&times;, yield obligasi 10Y 7%. Saham &ldquo;murah&rdquo; atau &ldquo;mahal&rdquo; relatif terhadap obligasi?</p>
<p><strong>Langkah 1:</strong> earnings yield = 1/15 = <strong>6,67%</strong>. <strong>Langkah 2:</strong> bandingkan: 6,67% vs 7% &rarr; <strong>obligasi sedikit lebih menarik</strong> (risk-free 7% &gt; earnings 6,67% yang berisiko!).</p>
<p><strong>Nuansa:</strong> Fed model kontroversial (membandingkan nominal vs riil, mengabaikan growth), tapi ia menangkap intuisi benar: <strong>saham bersaing dengan obligasi untuk tiap rupiah modal</strong>. Saat yield obligasi 3% (2020), earnings yield 6,67% = saham <em>sangat</em> murah relatif &mdash; dan itulah yang terjadi: pasar reli.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Mekanisme, Satu Pasar</h2>
      <p>Mekanisme trading, indeks, dan analisis = <strong>tiga cara &ldquo;melihat&rdquo; pasar yang sama</strong>:</p>
      <ol>
        <li><strong>MEKANISME:</strong> <em>bagaimana</em> kamu bertransaksi (tunai/margin/short) &mdash; menentukan <em>profil risiko</em> posisimu, bukan arah pasar.</li>
        <li><strong>INDEKS:</strong> <em>apa</em> yang kamu ukur &mdash; benchmark &amp; kendaraan (ETF). Pahami bias konstruksinya.</li>
        <li><strong>ANALISIS:</strong> <em>berapa</em> nilai wajarnya &mdash; DDM &amp; multiples memberi jangkar harga di tengah hiruk-pikuk mekanisme.</li>
      </ol>
      <p><strong>Kesalahan fatal:</strong> memakai mekanisme agresif (margin) untuk ide analisis yang lemah (&ldquo;katanya mau naik&rdquo;). <strong>Urutannya: analisis dulu (apa yang dibeli) &rarr; indeks (kendaraan) &rarr; mekanisme (seberapa agresif).</strong> Andi membaliknya &mdash; dan membayar Rp47,5jt untuk pelajaran itu.</p>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasar efisien berarti tidak ada yang bisa mengalahkan pasar. Jadi analisis percuma.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Efisiensi <strong>derajat, bukan biner</strong> — dan ironisnya butuh analis aktif untuk <em>menjaga</em> efisiensi (paradoks Grossman-Stiglitz). Bentuk lemah ditolak di banyak pasar (momentum ada); semi-kuat ~berlaku untuk large-cap US, <strong>kurang untuk small-cap/EM</strong> — di situlah analis dibayar.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Short selling = judi; risikonya sama dengan long.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Long: rugi maksimal 100% (ke nol). <strong>Short: rugi tidak terbatas</strong> (harga bisa naik berkali-kali) + <strong>short squeeze</strong> (dipaksa beli saat spike). Berbeda kelas risiko — butuh disiplin &amp; position sizing ketat.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Beli saham = judi, sama saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> judi = <em>zero-sum</em> dengan ekspektasi negatif (bandar mengambil). Saham = <strong>klaim atas arus kas produktif</strong> ekonomi &mdash; ekspektasi jangka panjang positif (premi risiko ekuitas &asymp; 4&ndash;6%). Yang membuatnya <em>terasa</em> seperti judi: <strong>leverage, jangka pendek, &amp; tanpa analisis</strong>. Hilangkan ketiganya &rarr; investasi. Pertahankan &rarr; ya, itu judi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;P/E rendah = murah, pasti bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> P/E rendah bisa berarti <strong><em>value trap</em></strong>: E (laba) akan <em>turun</em> &mdash; pasar sudah mendiskonnya. P/E 3&times; pada emiten yang labanya akan &minus;50% = <strong>mahal</strong>. Selalu tanya: <em>apakah E-nya sustainable?</em> (Lihat PM-B4 untuk bedah lengkap.)</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Hitung titik margin call sebelum buka posisi.</strong> Tulis di jurnal: 'call di −X%'. Jika X membuatmu tidak bisa tidur, kecilkan leverage. Margin call selalu datang di momen terburuk (likuiditas kering).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Samakan metodologi benchmark.</strong> Portofolio small-cap dibanding IHSG (cap-weighted, didominasi big banks) = salah penggaris. Pilih/buat benchmark yang mencerminkan mandatmu (PM-C5).</strong></p>
</div>

<div className="tip">
<p><strong>💡 Aturan leverage 3 lapis:</strong> (1) <strong>Hitung titik call <em>sebelum</em> buka posisi</strong> &mdash; jika tidak tahan penurunan ke titik itu, kecilkan posisi. (2) <strong>Jangan averaging down berleverage</strong> &mdash; menambah posisi rugi berleverage = mempercepat margin call. (3) <strong>Batasi leverage pada <em>aset likuid &amp; fundamental kuat</em></strong> &mdash; jangan pernah leverage saham gorengan.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Indeks 3 Metode</h2>
<p>Hitung bobot price-weighted, cap-weighted, equal-weighted dari 3 saham.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Indeks"}
  hint={"Ubah harga C 200 -> 2000 (stock split tidak disesuaikan). Lihat price-weighted kacau — itulah kelemahannya!"}
  defaultCode={"# Kalkulator indeks: 3 metode pembobotan (ubah harga/cap sesukamu)\nsaham = {\"A\": (100, 10), \"B\": (50, 30), \"C\": (200, 5)}  # (harga, market cap Rp T)\n\ntot_harga = sum(h for h, _ in saham.values())\ntot_cap = sum(c for _, c in saham.values())\nprint(f\"{'saham':<6}{'price-wtd':>10}{'cap-wtd':>10}{'equal':>10}\")\nfor s, (h, c) in saham.items():\n    print(f\"{s:<6}{h/tot_harga:>9.1%}{c/tot_cap:>10.1%}{1/3:>10.1%}\")\nprint(\"\\nC (harga termahal) dominan di price-weighted walau cap terkecil.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator Margin Call</h2>
<p>Simulasikan posisi margin: turunkan harga, lihat kapan broker menelepon.</p>
<PyodideLab
  title={"Lab 2 — Simulator Margin Call"}
  hint={"Ubah TURUN 0.30 -> 0.50. Ekuitas negatif = bukan cuma margin call, tapi UTANG ke broker!"}
  defaultCode={"# Simulator margin call ala Andi\nPOSISI, PINJAM = 100_000_000, 50_000_000\nMAINT = 0.30\nTURUN = 0.30  # ubah sesukamu (0.30 = -30%)\n\nnilai = POSISI * (1 - TURUN)\nekuitas = nilai - PINJAM\nmargin = ekuitas / nilai\nmodal_awal = POSISI - PINJAM\n\nprint(f\"Harga turun {TURUN:.0%}: posisi Rp{nilai/1e6:.0f}jt, ekuitas Rp{ekuitas/1e6:.0f}jt\")\nprint(f\"Margin aktual: {margin:.1%} (maintenance {MAINT:.0%})\")\nprint(f\"Return thd modal: {(ekuitas-modal_awal)/modal_awal:+.0%}\")\nif margin < MAINT:\n    print(\">>> MARGIN CALL! Setor dana atau dilikuidasi paksa di bottom.\")\nelse:\n    call_di = 1 - PINJAM/(POSISI*(1-MAINT))\n    print(f\"Aman. Margin call baru di penurunan {call_di:.1%}.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Eksekusi cepat, tidak sensitif harga → <strong>Market order</strong></h3>
<p><strong>Kenapa:</strong> Kepastian eksekusi &gt; harga.</p>
<p><strong>Contoh nyata:</strong> Keluar darurat.</p>
</div>
<div className="decision-card">
<h3>2. Sensitif harga, bisa menunggu → <strong>Limit order</strong></h3>
<p><strong>Kenapa:</strong> Kontrol harga; risiko tidak tereksekusi.</p>
<p><strong>Contoh nyata:</strong> Akumulasi bertahap.</p>
</div>
<div className="decision-card">
<h3>3. Batasi rugi otomatis → <strong>Stop order</strong></h3>
<p><strong>Kenapa:</strong> Disiplin mekanis anti-serakah.</p>
<p><strong>Contoh nyata:</strong> Cut loss −8%.</p>
</div>
<div className="decision-card">
<h3>4. Mau leverage → <strong>Hitung titik call + sizing kecil</strong></h3>
<p><strong>Kenapa:</strong> Forced selling di bottom = mimpi buruk.</p>
<p><strong>Contoh nyata:</strong> Maks 20% portofolio di margin.</p>
</div>
<div className="decision-card">
<h3>5. Ingin short saham overvalued → <strong>Pertimbangkan put options, bukan short langsung</strong></h3>
<p><strong>Kenapa:</strong> Rugi short tak terbatas + short squeeze; put = rugi terbatas.</p>
<p><strong>Contoh nyata:</strong> Beli put 3 bulan sebagai &ldquo;asuransi pandangan bearish&rdquo;.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Short = risiko tak terbatas.</strong></li><li><strong>Hitung titik call</strong> sebelum leverage.</li><li><strong>Samakan metodologi</strong> benchmark.</li><li><strong>Efisiensi = derajat</strong>, bukan biner.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Margin Call di Hari Merah</h2>
<div className="callout">
<p>Andi: posisi Rp100jt, margin 50% (pinjam Rp50jt), maintenance 30%. IHSG anjlok 15% sehari; ia tambah posisi. Lalu turun total 30%.</p>
<p><strong>Vignette lanjutan.</strong> Andi: posisi Rp100jt, margin 50% (pinjam Rp50jt), maintenance 30%. IHSG anjlok 15% sehari; ia <em>tambah</em> posisi Rp25jt (margin lagi). Lalu turun total 30% dari awal. Suku bunga margin 12%/tahun (abaikan untuk hitungan kasar).</p>
<p><strong>Pertanyaan:</strong> (a) Kapan margin call pertama? (b) Return modal setelah tambah posisi &amp; turun 30%? (c) Tiga aturan leverage yang dilanggar? (d) Jika ia <em>cut loss</em> di &minus;15% (tanpa tambah posisi), berapa kerugiannya vs skenario aktual? (e) Rancang <em>position sizing</em> yang benar untuk Andi.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Call di P = Rp71,4jt (−28,6%)</strong>: (P−50)/P = 30%. Turun 30% → margin 28,6% &lt; 30% → <strong>call</strong>.</p>
<p>(b) <strong>Ekuitas Rp20jt dari modal Rp50jt = −60%</strong>, plus forced selling di bottom sebelum rebound.</p>
<p>(c) <strong>(1)</strong> Tidak hitung titik call; <strong>(2)</strong> menambah posisi saat rugi (averaging down berleverage); <strong>(3)</strong> sizing terlalu besar untuk volatilitas IHSG. Leverage = akselerator, bukan strategi.</p>
<p>(d) <strong>Cut loss di &minus;15%:</strong> posisi Rp100jt &rarr; Rp85jt; ekuitas = 85 &minus; 50 = Rp35jt; rugi = (50&minus;35)/50 = <strong>&minus;30%</strong> (Rp15jt). <strong>Skenario aktual:</strong> tambah Rp25jt (total posisi Rp125jt, pinjam Rp75jt... estimasi) &rarr; turun 30% &rarr; ekuitas &asymp; Rp12,5jt dari modal Rp75jt = <strong>&minus;83%</strong> + forced sell di bottom. <strong>Cut loss &ldquo;mahal&rdquo; Rp15jt menghemat Rp47,5jt.</strong> Disiplin = murah.</p>
<p>(e) <strong>Position sizing benar:</strong> (1) tentukan <em>max loss</em> per posisi (mis. 2% portofolio); (2) hitung jarak ke <em>stop-loss</em> &amp; ke titik margin call; (3) ukuran posisi = max_loss / jarak_risiko. Untuk IHSG (vol &asymp; 20%), posisi margin 50% dengan modal 100% portofolio = <strong>gila</strong>; maksimal 20&ndash;30% portofolio untuk posisi berleverage.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Sisi Gelap Mekanisme Pasar</h2>
      <h3>1. Short squeeze &mdash; anatomi pembantaian</h3>
      <p><strong>Mekanisme:</strong> saham X 40% <em>short interest</em>. Kabar baik kecil &rarr; harga naik 10% &rarr; short mulai rugi &rarr; sebagian <em>cover</em> (beli kembali) &rarr; tekanan beli &rarr; harga naik 25% &rarr; <em>margin call</em> untuk short &rarr; beli paksa &rarr; harga +60%. <strong>Spiral yang memberi makan dirinya sendiri.</strong></p>
      <p><strong>Pelajaran:</strong> <em>crowded short</em> = bom waktu dua arah. Cek <em>short interest ratio</em> sebelum short &mdash; di atas 20% = zona berbahaya. Dan ingat: <strong>harga bisa tetap &ldquo;salah&rdquo; lebih lama dari kamu bisa tetap solven.</strong></p>
      <h3>2. Indeks = taruhan aktif yang tersamar</h3>
      <p>Cap-weighted index fund terlihat &ldquo;pasif&rdquo;, tapi ia membuat <strong>taruhan aktif implisit</strong>: <em>momentum</em> (saham naik &rarr; bobot naik &rarr; beli lebih banyak = <em>buy high</em>!) dan <em>konsentrasi</em> (5 saham 40%). <strong>Smart beta</strong> (equal-weight, value, low-vol) lahir untuk melawan bias ini &mdash; dengan biaya: <em>tracking error</em> vs indeks acuan. Tidak ada makan siang gratis, bahkan di dunia indeks.</p>
      <h3>3. DDM vs buyback &mdash; kas kembali dua jalan</h3>
      <p>Perusahaan mengembalikan kas via <strong>dividen</strong> (kena pajak saat diterima) atau <strong><em>buyback</em></strong> (harga naik, pajak ditunda hingga jual). DDM klasik hanya menangkap dividen &mdash; untuk emiten <em>buyback-heavy</em> (teknologi AS), valuasi harus memakai <strong>total payout yield</strong> (dividen + buyback). <strong>Analis yang memakai DDM murni pada emiten buyback = sistematis <em>undervalue</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Titik call kilat</h3>
      <p>Posisi Rp200jt, margin 50% (pinjam Rp100jt), maintenance 25%. Di harga berapa (%, dari awal) terjadi margin call?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>(P &minus; 100)/P = 0,25 &rarr; P = 100/0,75 = Rp133,3jt &rarr; turun <strong>33,3%</strong> dari Rp200jt. Catat: maintenance lebih rendah (25% vs 30%) = titik call lebih dalam &mdash; tapi <em>bukan</em> berarti lebih aman (ekuitasmu sudah &minus;66,7% saat itu!).</p>
      </details>
      <h3>Drill 2 &mdash; Short P/L</h3>
      <p>Short 500 lembar @Rp50.000. Harga ke Rp62.000 lalu kamu cover. P/L? Pelajaran?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>(50.000 &minus; 62.000) &times; 500 = <strong>&minus;Rp6M</strong> (rugi 24% dari nilai posisi Rp25M). Pelajaran: short butuh <em>timing</em> &amp; <em>stop-loss</em> ketat &mdash; &ldquo;fundamental benar&rdquo; tidak cukup.</p>
      </details>
      <h3>Drill 3 &mdash; DDM Gordon kilat</h3>
      <p>D1 = Rp800, g = 6%, r = 14%. Nilai wajar? Jika r naik ke 16%?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>P = 800/(0,14&minus;0,06) = <strong>Rp10.000</strong>. r = 16%: P = 800/0,10 = <strong>Rp8.000</strong> (&minus;20%!). Sensitivitas terhadap r = alasan harga saham growth jungkir balik saat suku bunga naik.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette indeks</h3>
      <p>ETF &ldquo;Indeks Saham Indonesia&rdquo; ternyata price-weighted dari 30 saham termahal nominalnya. Dua masalahnya?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p>(1) <strong>Price-weighted = bobot tidak ekonomis</strong> (saham Rp100rb mendominasi vs Rp1rb, tanpa kaitan dengan ukuran perusahaan); (2) <strong>30 saham termahal ≠ representatif</strong> (&ldquo;Indonesia&rdquo; di nama = <em>misleading</em>). Benchmark yang benar: cap-weighted, free-float-adjusted, aturan jelas.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Posisi Rp100jt, pinjam Rp50jt, maintenance 30%. Margin call di penurunan?"}
  options={
    ["15%",
    "28,6%",
    "50%",
    "30%"]
  }
  correct={1}
  explanation={"Benar: (P−50)/P = 0,30 → P = 71,4 → turun 28,6%. Hitung SEBELUM buka posisi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Risiko short selling vs long?"}
  options={
    ["Sama",
    "Short: rugi tak terbatas + short squeeze",
    "Short lebih aman",
    "Short tidak bisa rugi"]
  }
  correct={1}
  explanation={"Benar: long rugi maks 100%; short rugi tak terbatas (harga naik tanpa batas) + risiko dipaksa tutup saat spike."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Saham C: harga tertinggi tapi cap terkecil. Dominan di indeks?"}
  options={
    ["Cap-weighted",
    "Price-weighted (bobot by harga)",
    "Equal-weighted",
    "Tidak ada"]
  }
  correct={1}
  explanation={"Benar: price-weighted menimbang by harga — anomali Dow. Itulah kenapa standar industri = cap-weighted."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Bentuk efisiensi: 'harga lampau tidak berguna'. Ini?"}
  options={
    ["Kuat",
    "Lemah (teknikal mati)",
    "Semi-kuat",
    "Tidak ada"]
  }
  correct={1}
  explanation={"Benar: lemah = info historis tercermin. Semi-kuat = + info publik (fundamental sulit). Kuat = + privat (hampir tak dipercaya)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. D1 Rp500, r 12%, g 5%. Nilai DDM?"}
  options={
    ["Rp4.167",
    "Rp7.143",
    "Rp10.000",
    "Rp5.000"]
  }
  correct={1}
  explanation={"Benar: 500/(0,12−0,05) = 7.143. Sensitif: g 6% → 8.333 (+17%). Asumsi growth = medan perang."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Short 1.000 lembar @Rp100.000. Harga naik ke Rp130.000. P/L dan pelajaran utama?"}
  options={
    ["+Rp30M — short selalu profit saat volatil",
    "−Rp30M — rugi short tak terbatas, butuh stop-loss",
    "Rp0 — short tidak ada P/L sampai cover",
    "−Rp15M — rugi dibatasi margin awal"]}
  correct={1}
  explanation={"Benar: (100rb−130rb)×1.000 = −Rp30M. Pelajaran: rugi short TAK TERBATAS (harga bisa naik tanpa batas) — short tanpa stop-loss & batas posisi = bunuh diri finansial."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Order</strong>: market (cepat), limit (harga), stop (disiplin).</li>
<li><strong>Short</strong> = untung saat turun, risiko tak terbatas. <strong>Margin</strong> = leverage + margin call.</li>
<li><strong>Indeks</strong>: price-weighted (aneh), cap-weighted (standar), equal-weighted (tilt small).</li>
<li><strong>Efisiensi</strong>: lemah → semi-kuat → kuat; derajat, bukan biner.</li>
<li><strong>DDM</strong>: P0 = D1/(r−g) — untuk dividen stabil.</li>
<li><strong>Kapan TIDAK leverage</strong>: tanpa hitung titik call &amp; tanpa sizing.</li>

<li><strong>Margin:</strong> leverage = pengganda dua arah; hitung titik call sebelum buka posisi.</li>
<li><strong>Short:</strong> rugi tak terbatas + short squeeze — pertimbangkan put options.</li>
<li><strong>Indeks:</strong> pahami metodologi (cap vs price, free float) sebelum percaya.</li>
<li><strong>DDM:</strong> P = D1/(r−g); 80%+ nilai dari terminal — rendah hati pada asumsi.</li>
<li><strong>Kapan TIDAK pakai:</strong> leverage untuk saham gorengan; short tanpa stop-loss; DDM murni untuk emiten buyback-heavy.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a5-corporate-issuers" className="btn btn-secondary btn-sm">← PM-A5</Link>
        <Link href="/learn/pm-a7-fixed-income" className="btn btn-primary btn-sm">PM-A7 →</Link>
      </div>
    </div>
  );
}

"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA8DerivativesPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A8 — Portfolio Management</span>
        <h1 className="display-title">Derivatives:<br/>Forward, Swap & Opsi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Eksportir yang 'Bermain Aman' Malah Spekulasi</a></li>
<li><a href="#forward">Forward & Futures</a></li>
<li><a href="#swap">Swap</a></li>
<li><a href="#opsi">Opsi: Call & Put</a></li>
<li><a href="#sintesis">Sintesis: Transfer Risiko</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: KopiNusa</a></li>
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
<li>Menjelaskan prinsip no-arbitrage dan menghitung harga forward.</li>
<li>Membedakan forward vs futures (marking to market).</li>
<li>Menjelaskan mekanisme interest rate swap.</li>
<li>Menghitung payoff opsi dan memverifikasi put-call parity.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Eksportir yang 'Bermain Aman' Malah Spekulasi</h2>
      <div className="story">
        <p><strong>PT KopiNusa</strong> mengekspor kopi senilai <strong>USD 1 juta</strong>, dibayar 3 bulan lagi. Direktur keuangan <em>&ldquo;bermain aman&rdquo;</em>: tidak hedging — <em>&ldquo;kan rupiah biasanya melemah, malah untung.&rdquo;</em> Tiga bulan kemudian rupiah <strong>menguat 8%</strong> — pendapatan susut Rp1,3 miliar.</p>
<p>Twist-nya: <strong>tidak hedging = keputusan spekulasi</strong>. Ia bertaruh rupiah melemah — tanpa premi, tanpa analisis, tanpa mandat. 'Bermain aman' yang sebenarnya = <strong>mengunci kurs via forward</strong> (biaya diketahui, tidur nyenyak). Derivatif bukan alat judi; <strong>tidak memakainya pun adalah posisi</strong>. Lesson ini: instrumen pengunci risiko.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="forward">Forward — Janji Harga Hari Ini</h2>
<p><strong>Definisi.</strong> <strong>Forward</strong>: kontrak <em>custom</em> (OTC) beli/jual aset di masa depan pada harga yang disepakati kini. <strong>No-arbitrage</strong>: F = S(1+r)^T — jika tidak, arbitrase (pinjam, beli spot, jual forward). <strong>Futures</strong>: forward yang <em>terstandar</em> di bursa + <strong>marking to market harian</strong> (untung/rugi disettle tiap hari → risiko kredit kecil).</p>
<p>KopiNusa: jual USD 1jt forward 3 bulan → kurs terkunci, tidur nyenyak.</p>
<Tex math={String.raw`F = S(1+r)^T`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`F`} />: harga forward</li>
<li><Tex math={String.raw`S`} />: harga spot kini</li>
<li><Tex math={String.raw`r`} />: risk-free rate per periode</li>
<li><Tex math={String.raw`T`} />: tenor (tahun)</li>
<li>Logika: biaya 'membawa' aset ke masa depan (cost of carry); jika F menyimpang → arbitrase</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Forward seperti <strong>memesan tiket dengan harga dikunci</strong>: bayar nanti, harga kini. No-arbitrage = 'tidak ada makan siang gratis': jika tiket forward terlalu murah, calo (arbitrager) borong sampai harganya wajar.</p>
<p><strong>Kapan dipakai:</strong> Hedging FX/komoditas (PM-C9); dasar semua pricing derivatif.</p>
<p><strong>Pendalaman intuisi &mdash; forward = janji, futures = janji yang diawasi.</strong> Forward: dua pihak berjanji privat &mdash; murah &amp; fleksibel, tapi <em>counterparty risk</em> (lawan janji bisa ingkar). Futures: janji yang sama, tapi lewat <em>clearing house</em> + <em>margin harian</em> &mdash; setiap hari untung/rugi diselesaikan (<em>mark-to-market</em>), jadi tidak ada utang menumpuk. <strong>Standarisasi = harga dari keamanan.</strong> KopiNusa butuh tanggal &amp; jumlah pas &rarr; forward; spekulan butuh likuiditas &rarr; futures.</p><details className="worked">
<summary>📐 Contoh: Forward KopiNusa (klik untuk buka)</summary>
<p>S = Rp16.000/USD, r_IDD = 6% p.a., r_USD = 5% p.a., T = 0,25 thn. (FX forward memakai selisih suku bunga.)</p>
<p><strong>F</strong> = 16.000 × (1,06/1,05)^0,25 ≈ 16.000 × 1,00237 = <strong>Rp16.038</strong>.</p>
<p>KopiNusa mengunci Rp16,038M untuk USD 1jt. Rupiah menguat ke 15.000? <strong>Tidak peduli</strong> — Rp16,038M pasti. Melemah ke 17.000? Juga Rp16,038M — <strong>hedging = melepas upside demi kepastian</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Forward rate agreement (FRA) &mdash; kunci bunga masa depan</summary>
<p><strong>Soal:</strong> bendahara butuh pinjam Rp10M 6 bulan lagi untuk 3 bulan. FRA 6×9 di 7%. Saat itu JIBOR 3-bulan 8%. Berapa settlement?</p>
<p><strong>Langkah 1:</strong> FRA mengunci <em>pinjam</em> di 7%; pasar 8% &rarr; FRA <em>untung</em> (dapat pinjam lebih murah).</p>
<p><strong>Langkah 2:</strong> selisih = (8%&minus;7%) &times; 90/360 &times; 10M = <strong>Rp25jt</strong>, didiskon ke awal periode &asymp; Rp24,5jt <strong>diterima</strong> bendahara.</p>
<p><strong>Intuisi:</strong> FRA = asuransi suku bunga. Bayar &ldquo;premi&rdquo; berupa melepas upside (jika JIBOR turun ke 6%, ia tetap bayar 7% &mdash; rugi opportunity). <strong>Hedging = menukar ketidakpastian dengan kepastian, bukan dengan keuntungan.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Basis risk &mdash; hedge yang tidak sempurna</summary>
<p><strong>Soal:</strong> petani kopi hedge dengan futures kopi robusta, tapi ia menanam <em>arabika</em>. Saat panen: robusta &minus;5%, arabika &minus;12%. Efektivitas hedge?</p>
<p><strong>Analisis:</strong> futures melindungi dari &ldquo;harga kopi <em>umum</em>&rdquo; (&minus;5% tertutup), tapi <strong>selisih arabika-vs-robusta</strong> (&minus;7%) = <em>basis risk</em> &mdash; tetap ditanggung petani.</p>
<p><strong>Pelajaran:</strong> tidak ada hedge sempurna jika <em>underlying</em> ≠ eksposur persis. <strong>Ukur basis historis</strong> sebelum hedge: jika korelasi arabika-robusta 0,9, hedge 90% efektif; jika 0,5 &rarr; pertimbangkan <em>cross-hedge ratio</em> atau terima risikonya. <strong>Hedge yang tidak diukur = spekulasi dengan label.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Hedging menghilangkan risiko&rdquo;.</strong> <strong>Salah.</strong> Hedging <em>menukar</em> satu risiko dengan lainnya: forward menghilangkan risiko harga tapi menciptakan <em>opportunity cost</em> (melepas upside) + <em>counterparty risk</em>. Opsi menghilangkan downside tapi memakan premi. <strong>Tidak ada makan siang gratis</strong> &mdash; yang ada hanya <em>memilih risiko mana yang mau ditanggung</em>.</p>
</div>
<h2 id="swap">Swap — Tukar Arus Kas</h2>
<p><strong>Definisi.</strong> <strong>Interest rate swap</strong> (plain vanilla): tukar <strong>bunga tetap ↔ mengambang</strong> atas <em>notional</em> yang sama (notional tidak dipertukarkan!). Pihak bayar-fixed = 'membeli kepastian'; bayar-floating = 'berjudi rate turun'.</p>
<p>Kegunaan: perusahaan berutang floating → swap ke fixed = <strong>kunci biaya bunga</strong> (seperti forward untuk suku bunga).</p>
<p><strong>Kepribadian/intuisi:</strong> Swap seperti <strong>tukar langganan</strong>: kamu langganan 'harga pasar' (floating, naik-turun), temanmu langganan 'harga tetap' (fixed). Kalian tukar tagihan — masing-masing dapat yang diinginkan. Notional = 'nilai langganan' yang tidak berpindah tangan.</p>
<p><strong>Kapan dipakai:</strong> Kelola risiko suku bunga korporasi; dasar credit default swap (PM-B5).</p>
<p><strong>Pendalaman intuisi &mdash; swap = tukar nasib.</strong> Pihak A punya utang bunga <em>mengambang</em> (cemas naik), pihak B punya <em>tetap</em> (ingin mengambang). Swap: A bayar tetap ke B, B bayar mengambang ke A &mdash; <strong>keduanya dapat yang diinginkan tanpa melunasi &amp; menerbitkan utang baru</strong>. Swap tidak menciptakan nilai dari nol &mdash; ia <em>mendistribusikan ulang</em> risiko ke yang paling mampu menanggungnya. <strong>Derivatif = teknologi transfer risiko.</strong></p><details className="worked">
<summary>📐 Contoh: Swap SinarAbadi (klik untuk buka)</summary>
<p>SinarAbadi utang Rp400M floating (JIBOR+2%). Takut rate naik → swap: <strong>bayar fixed 8%</strong>, terima floating.</p>
<p><strong>Net:</strong> bayar ke bank (JIBOR+2%), terima dari swap (JIBOR), bayar ke swap (8%) → <strong>net = 10% fixed</strong>. Biaya bunga terkunci Rp40M/thn.</p>
<p>JIBOR naik ke 9%? Tetap bayar 10%. Turun ke 3%? Tetap 10% — <strong>kepastian ada harganya</strong> (upside dilepas).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Valuasi swap &mdash; selisih dua kaki</summary>
<p><strong>Soal:</strong> swap 1 tahun tersisa: bayar tetap 6%, terima mengambang. Notional Rp10M. Kurva spot: 6-bln 5%, 1-thn 5,5%. Berapa nilai swap bagi <em>penerima tetap</em>?</p>
<p><strong>Langkah 1 &mdash; kaki tetap:</strong> PV = 600rb/1,025 + 10,6M/1,055 = 585.366 + 10.047.393 = <strong>Rp10.632.759</strong>.</p>
<p><strong>Langkah 2 &mdash; kaki mengambang:</strong> = notional &times; (1 &minus; discount terakhir)... trik: PV floating = Rp10M &times; (1,0275/1,0275)... sederhananya &asymp; <strong>Rp10.000.000</strong> (kaki floating selalu &asymp; par saat reset!).</p>
<p><strong>Nilai swap (terima tetap):</strong> 10.632.759 &minus; 10.000.000 = <strong>+Rp632.759</strong>.</p>
<p><strong>Intuisi:</strong> swap = <strong>obligasi tetap minus obligasi mengambang</strong>. Naiknya suku bunga &rarr; kaki tetap turun nilainya &rarr; penerima tetap <em>rugi</em>. Inilah kenapa valuasi swap sensitif terhadap kurva &mdash; dan kenapa <em>swap dealer</em> mengelola <em>net DV01</em> bukannya tiap swap.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Comparative advantage &mdash; kenapa swap ada?</summary>
<p><strong>Soal:</strong> PT A bisa pinjam tetap 8% / mengambang JIBOR+1%. PT B: tetap 10% / mengambang JIBOR+2%. A ingin mengambang, B ingin tetap. Keuntungan swap?</p>
<p><strong>Langkah 1:</strong> selisih tetap: 10&minus;8 = 2%; selisih mengambang: 1%. <strong>Total gain</strong> = 2% &minus; 1% = <strong>1%</strong> untuk dibagi.</p>
<p><strong>Langkah 2:</strong> A pinjam tetap 8%, B pinjam mengambang JIBOR+2%, lalu swap: A bayar JIBOR ke B, B bayar 9% tetap ke A. Hasil: A dapat mengambang JIBOR+... A bayar: 8% + JIBOR &minus; 9% = <strong>JIBOR&minus;1%</strong> (hemat 2%!). B bayar: JIBOR+2% + 9% &minus; JIBOR = <strong>11%</strong>... tunggu, itu lebih mahal. Bagi ulang: B bayar 9,5% tetap: A &rarr; JIBOR&minus;0,5% (hemat 1,5%), B &rarr; 11,5%? Mari hitung bersih: total gain 1% dibagi rata &rarr; A: JIBOR+0,5% (hemat 0,5%), B: 9,5% tetap (hemat 0,5%).</p>
<p><strong>Intuisi:</strong> swap mengeksploitasi <strong>perbedaan keunggulan komparatif</strong> di pasar tetap vs mengambang &mdash; seperti perdagangan internasional, tapi untuk suku bunga.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Nilai wajar derivatif saat inisiasi = NOL.</strong> Forward/swap yang <em>fair</em> dirancang agar PV = 0 saat dibuat (tidak ada yang &ldquo;untung duluan&rdquo;). Soal yang memberi forward rate lalu bertanya &ldquo;nilainya?&rdquo; &mdash; jika rate = fair &rarr; jawabannya <strong>nol</strong>. Nilai menjadi non-nol <em>setelah</em> pasar bergerak. Ini konsep yang paling sering menjebak di ujian derivatif.</p>
</div>

<PlotlyChart
  data={[{x: [70,80,90,95,100,110,120,130], y: [-8,-8,-8,-8,-3,7,17,27], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Saham + put (strike 95, premi 3)"}, {x: [70,80,90,95,100,110,120,130], y: [-30,-20,-10,-5,0,10,20,30], type: "scatter", mode: "lines", line: {dash: "dash", color: "#7f7f7f"}, name: "Saham saja"}]}
  title={"Protective put: lantai di bawah, langit terbuka"}
  layout={{xaxis: {title: "Harga saham saat jatuh tempo (Rp ribu)"}, yaxis: {title: "P/L (Rp ribu)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = harga saham, sumbu Y = untung/rugi. Biru = saham + put; abu-abu = saham saja.</p>
<p><strong>Interpretasi:</strong> Di bawah strike 95, garis biru <strong>datar</strong> di &minus;8 (floor!) &mdash; bencana &minus;30 menjadi &minus;8. Di atas 95, biru sejajar abu-abu minus premi 3. <strong>Bentuk &ldquo;hoki&rdquo; ini = esensi opsi: potong ekor kiri, biarkan ekor kanan.</strong> Harga hoki itu = Rp3.000.</p>
</div>
<h2 id="opsi">Opsi — Hak, Bukan Kewajiban</h2>
<p><strong>Definisi.</strong> <strong>Call</strong> = hak beli di strike X (untung jika S &gt; X). <strong>Put</strong> = hak jual di X (untung jika S &lt; X). <strong>Payoff call</strong> = max(S−X, 0); <strong>put</strong> = max(X−S, 0). <strong>Nilai opsi</strong> = <em>intrinsic</em> (payoff kini) + <em>time value</em> (peluang masa depan; → 0 saat expiry).</p>
<p><strong>Put-call parity</strong>: C + PV(X) = P + S — hubungan arbitrase call &amp; put Eropa. Jika dilanggar → arbitrase.</p>
<Tex math={String.raw`C + \frac{X}{(1+r)^T} = P + S`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`C, P`} />: harga call &amp; put Eropa (strike &amp; expiry sama)</li>
<li><Tex math={String.raw`X`} />: strike price</li>
<li><Tex math={String.raw`S`} />: harga spot underlying</li>
<li>Parity = 'dua jalan menuju Roma': call + kas = put + saham (portofolio ekuivalen)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Opsi seperti <strong>uang muka (DP) rumah</strong>: bayar premi kecil untuk <em>hak</em> beli di harga X. Harga naik → eksekusi (untung besar dari modal kecil). Harga turun → tinggalkan (rugi cuma DP). <strong>Rugi terbatas, untung tidak</strong> — kebalikan short selling.</p>
<p><strong>Kapan dipakai:</strong> Proteksi portofolio (protective put, PM-C9); spekulasi terukur; income (covered call).</p>
<p><strong>Pendalaman intuisi &mdash; opsi = asuransi, bukan taruhan.</strong> Membeli put = membeli <em>hak</em> (bukan kewajiban) menjual di harga X &mdash; seperti premi asuransi: rugi maksimal = premi, untung saat bencana. <strong>Penjual opsi = perusahaan asuransi</strong>: untung kecil &amp; sering (premi), rugi besar &amp; jarang (bencana). Sebelum trading opsi, tanyakan: <em>saya jadi nasabah asuransi atau perusahaan asuransinya?</em> &mdash; profil risikonya terbalik total.</p><details className="worked">
<summary>📐 Contoh: Protective put (klik untuk buka)</summary>
<p>Pegang saham Rp10.000. Beli put X=9.000 premi Rp300.</p>
<p><strong>Saham jatuh ke 7.000:</strong> put payoff = 2.000 − premi 300 = +1.700 → net −1.300 (bukan −3.000!). <strong>Asuransi bekerja.</strong></p>
<p><strong>Saham naik ke 12.000:</strong> put hangus (−300), saham +2.000 → net +1.700. <strong>Premi = harga tidur nyenyak.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Protective put &mdash; matematika asuransi</summary>
<p><strong>Soal:</strong> pegang saham Rp100.000, beli put strike Rp95.000 premi Rp3.000. Gambarkan P/L saat jatuh tempo jika saham ke Rp70.000 vs Rp120.000.</p>
<p><strong>Saham 70rb:</strong> rugi saham &minus;30rb + put payoff (95&minus;70)=+25rb &minus; premi 3rb = <strong>&minus;Rp8.000</strong> (vs &minus;30rb tanpa put!).</p>
<p><strong>Saham 120rb:</strong> untung +20rb &minus; premi 3rb = <strong>+Rp17.000</strong> (put hangus).</p>
<p><strong>Profil:</strong> downside <em>dibatasi</em> di &minus;8rb (floor = strike &minus; premi), upside <em>hampir penuh</em>. <strong>Harga kepastian ini = Rp3.000.</strong> Tanya: apakah tidur nyenyakmu seharga 3%? Jika ya &rarr; beli. Jika tidak &rarr; jangan &mdash; <em>over-hedging</em> menggerus return jangka panjang.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Put-call parity &mdash; segitiga arbitrase</summary>
<p><strong>Soal:</strong> call (K=100) = Rp12, put (K=100) = Rp8, S = Rp105, r = 5%, 1 tahun. Ada arbitrase?</p>
<p><strong>Langkah 1 &mdash; paritas:</strong> C &minus; P = S &minus; K/(1+r) &rarr; 12 &minus; 8 = 4 vs 105 &minus; 95,24 = 9,76. <strong>Tidak sama!</strong></p>
<p><strong>Langkah 2:</strong> kiri (4) &lt; kanan (9,76) &rarr; <strong>beli call + jual put</strong> (= synthetic long) lebih murah dari beli saham langsung. Arbitrase: beli C, jual P, jual S (short), investasikan.</p>
<p><strong>Realita:</strong> di pasar likuid, paritas dijaga <em>market maker</em> dalam milidetik &mdash; kamu tidak akan menemukannya di layar. Tapi <strong>memahami paritas = memahami bahwa call, put, forward, dan saham adalah <em>satu</em> instrumen dengan empat wajah</strong> &mdash; dan posisi kompleks bisa disederhanakan.</p>
</details>
<PlotlyChart
  data={[{x: [7000,8000,9000,10000,11000,12000], y: [0,0,0,1000,2000,3000], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "call X=9000"}, {x: [7000,8000,9000,10000,11000,12000], y: [2000,1000,0,0,0,0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "put X=9000"}]}
  title={"Payoff call & put (strike 9.000)"}
  layout={{xaxis: {title: "Harga saham saat expiry"}, yaxis: {title: "Payoff"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = harga saham saat jatuh tempo. Biru = call, kuning = put.</p>
<p><strong>Interpretasi:</strong> Hockey stick: call <strong>datar di bawah strike</strong> (rugi maks = premi) lalu naik 1:1. Put kebalikannya. <strong>Asimetri</strong> inilah yang dibayar via premi — dan kenapa opsi = asuransi, bukan lotre (jika dipakai benar).</p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Derivatif = Transfer Risiko</h2>
      <p>Forward, swap, dan opsi = <strong>tiga teknologi transfer risiko</strong>:</p>
      <ol>
        <li><strong>FORWARD/FUTURES:</strong> transfer <em>harga</em> &mdash; mengunci hari ini. Cocok: eksposur <em>pasti</em> (piutang, utang).</li>
        <li><strong>SWAP:</strong> transfer <em>jenis arus kas</em> &mdash; tetap&harr;mengambang. Cocok: mismatch struktur utang.</li>
        <li><strong>OPSI:</strong> transfer <em>asimetris</em> &mdash; potong downside, simpan upside. Cocok: eksposur <em>tidak pasti</em> (tender, rencana).</li>
      </ol>
      <p><strong>Aturan pemilihan:</strong> eksposur pasti &rarr; forward; tidak pasti &rarr; opsi; struktural &rarr; swap. <strong>Dan selalu: ukur <em>basis risk</em> &amp; biaya sebelum klaim &ldquo;ter-hedge&rdquo;.</strong></p>

      <h3>🎙️ Debat: Hedging 100% vs Hedging 0%</h3>
      <p>Dua CFO berdebat tentang piutang USD 10jt:</p>
      <p><strong>CFO Konservatif:</strong> &ldquo;Hedge 100% via forward. Tugas treasury = <em>menghilangkan</em> volatilitas, bukan menebak kurs. Rugi Rp1,3M seperti KopiNusa = <em>maladministrasi</em> yang bisa dihindari dengan telepon 5 menit ke bank.&rdquo;</p>
      <p><strong>CFO Agresif:</strong> &ldquo;Hedge 100% = bayar <em>asuransi</em> yang rata-rata merugi (forward points + upside hilang). Dalam 10 tahun, IDR melemah 8 dari 10 &mdash; <em>expected value</em> tidak hedging = positif! Treasury yang baik = <em>mengelola</em> risiko, bukan menghilangkannya.&rdquo;</p>
      <p><strong>Putusan:</strong> keduanya setengah benar. <strong>Hedge 100% optimal jika:</strong> margin tipis &amp; volatilitas bisa membunuh (KopiNusa). <strong>Hedge 0% bisa dibenarkan jika:</strong> <em>natural hedge</em> ada, atau kebijakan tertulis menyatakan toleransi. <strong>Yang tidak bisa dibenarkan: tidak hedging <em>tanpa</em> kebijakan &amp; tanpa analisis</strong> &mdash; itu kelalaian, bukan strategi.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Derivatif = judi / spekulasi. Perusahaan sehat tidak memakainya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> KopiNusa <em>tidak</em> hedging = <strong>spekulasi</strong> (bertaruh pada arah rupiah). Derivatif adalah <strong>alat</strong>: pisau bisa untuk masak atau melukai. Maskapai hedging avtur, eksportir hedging FX — itu <strong>manajemen risiko</strong>, bukan judi. Yang berjudi = yang membiarkan eksposur terbuka.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Beli opsi = rugi pasti sebesar premi jika harga tidak bergerak.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Premi = <strong>harga asuransi + time value</strong>. Protective put yang 'hangus' saat pasar naik = premi asuransi rumah yang tidak kebakaran — <strong>bukan kerugian, melainkan biaya tidur nyenyak</strong>. Nilai opsi dinilai dari <em>proteksi yang diberikan</em>, bukan dari payoff-nya saja.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Derivatif = spekulasi berbahaya (lihat 2008!).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> derivatif = <strong>alat</strong>; 2008 = <em>penyalahgunaan</em> alat (leverage 30&times; + aset beracun + tanpa margin). Pisau bisa untuk masak atau melukai. KopiNusa hedging forward = derivatif yang <em>mengurangi</em> risiko. <strong>Nilai dari tujuan &amp; ukuran posisi, bukan dari instrumennya.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi selalu lebih berisiko dari saham.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <em>membeli</em> opsi = risiko <strong>terbatas</strong> (premi) &mdash; bisa <em>lebih aman</em> dari saham! Yang berbahaya adalah <em>menjual naked</em> opsi (rugi tak terbatas). <strong>Posisi menentukan risiko, bukan nama instrumen.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu tanya: 'eksposur apa yang saya kunci, dan upside apa yang saya lepas?'</strong> Hedging sempurna = tidak ada kejutan dua arah. Jika masih bisa 'kejutan enak', itu bukan hedge penuh.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Bedakan American vs European.</strong> American = bisa eksekusi kapan saja (lebih mahal); European = hanya saat expiry (put-call parity hanya untuk European!). Salah jenis = salah harga.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Sebelum pakai derivatif, jawab 4 pertanyaan:</strong> (1) <em>Risiko apa</em> yang di-hedge? (2) <em>Berapa</em> notional &amp; tenor yang pas? (3) <em>Biaya</em>-nya apa (premi/spread/opportunity)? (4) <em>Bagaimana</em> diukur efektivitasnya? Tidak bisa jawab keempatnya &rarr; jangan sentuh derivatifnya.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Pricer Forward + Detektor Arbitrase</h2>
<p>Hitung harga forward no-arbitrage dan cek apakah quote pasar bisa diarbitrase.</p>
<PyodideLab
  title={"Lab 1 — Pricer Forward"}
  hint={"Ubah QUOTE 16500 -> 16038 (sesuai hitungan). Arbitrase hilang — harga wajar!"}
  defaultCode={"# Forward pricing & deteksi arbitrase\nS, R, T = 16000, 0.06, 0.25   # spot, risk-free, tenor (tahun)\nQUOTE = 16500                  # quote pasar (ubah sesukamu)\n\nF = S * (1 + R)**T\nprint(f\"Harga forward wajar: Rp{F:,.0f}\")\nprint(f\"Quote pasar         : Rp{QUOTE:,.0f}\")\nif QUOTE > F * 1.001:\n    print(\"-> Quote KEMAHALAN: jual forward, beli spot (pinjam dana). Arbitrase!\")\nelif QUOTE < F * 0.999:\n    print(\"-> Quote KEMURAHAN: beli forward, jual spot. Arbitrase!\")\nelse:\n    print(\"-> Wajar (dalam 0.1%). Tidak ada arbitrase.\")\nprint(\"\\nPrinsip: harga derivatif = harga 'membawa' aset (cost of carry).\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Payoff Opsi & Put-Call Parity</h2>
<p>Hitung payoff call/put di berbagai harga dan verifikasi put-call parity.</p>
<PyodideLab
  title={"Lab 2 — Payoff Opsi"}
  hint={"Ubah PUT 83 -> 700 (parity dilanggar). Lihat arbitrase muncul — pasar akan mengoreksinya!"}
  defaultCode={"# Payoff opsi & put-call parity\nS, X, R, T = 10000, 9000, 0.05, 0.5\nCALL, PUT = 1300, 83  # harga pasar (paritas OK; ubah PUT untuk melanggar!)\n\nprint(\"Payoff saat expiry:\")\nfor st in [7000, 9000, 10000, 12000]:\n    c = max(st - X, 0); p = max(X - st, 0)\n    print(f\"  S={st}: call={c}, put={p}\")\n\npvx = X / (1 + R)**T\nkiri, kanan = CALL + pvx, PUT + S\nprint(f\"\\nParity: C+PV(X)={kiri:.0f} vs P+S={kanan:.0f}\")\nprint(\"PARITY OK (tidak ada arbitrase)\" if abs(kiri-kanan) < 1 else \"PARITY DILANGGAR -> arbitrase!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Eksposur FX/komoditas pasti (piutang/utang) → <strong>Forward (lock)</strong></h3>
<p><strong>Kenapa:</strong> Kepastian arus kas &gt; spekulasi arah.</p>
<p><strong>Contoh nyata:</strong> KopiNusa kunci kurs.</p>
</div>
<div className="decision-card">
<h3>2. Takut rugi besar tapi mau upside → <strong>Beli put (proteksi)</strong></h3>
<p><strong>Kenapa:</strong> Asimetri: rugi terbatas premi.</p>
<p><strong>Contoh nyata:</strong> Protective put portofolio.</p>
</div>
<div className="decision-card">
<h3>3. Utang floating, takut rate naik → <strong>IRS: bayar fixed</strong></h3>
<p><strong>Kenapa:</strong> Kunci biaya bunga.</p>
<p><strong>Contoh nyata:</strong> SinarAbadi swap ke 10% fixed.</p>
</div>
<div className="decision-card">
<h3>4. Mau income dari saham yang dimiliki → <strong>Covered call (jual call)</strong></h3>
<p><strong>Kenapa:</strong> Premi = income; upside dibatasi.</p>
<p><strong>Contoh nyata:</strong> Saham sideways.</p>
</div>
<div className="decision-card">
<h3>5. Butuh lindung nilai tapi takut biaya → <strong>Bandingkan forward (murah, kaku) vs opsi (mahal, fleksibel)</strong></h3>
<p><strong>Kenapa:</strong> Forward = gratis tapi melepas upside; opsi = bayar premi tapi simpan upside.</p>
<p><strong>Contoh nyata:</strong> Eksportir yakin IDR melemah → forward; ragu-ragu → beli put USD.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Tidak hedge = spekulasi.</strong></li><li><strong>F = S(1+r)^T</strong> — no free lunch.</li><li><strong>Opsi = hak</strong>; rugi maks = premi.</li><li><strong>Parity</strong> hanya European.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Eksportir yang 'Bermain Aman'</h2>
<div className="callout">
<p>KopiNusa: piutang USD 1jt/3 bulan, tidak hedging ('rupiah biasanya melemah'). Rupiah menguat 8% → rugi Rp1,3M.</p>
<p><strong>Vignette lanjutan.</strong> KopiNusa: piutang USD 1jt/3 bulan, tidak hedging (&lsquo;rupiah biasanya melemah&rsquo;). Rupiah <em>menguat</em> 8% &rarr; rugi Rp1,3M. Dewas direksi terbelah: kubu A &ldquo;hedging itu mahal &amp; ribet&rdquo;, kubu B &ldquo;wajib hedge 100%&rdquo;.</p>
<p><strong>Pertanyaan:</strong> (a) Kenapa &lsquo;tidak hedging&rsquo; = spekulasi? (b) Rancang hedge forward (S=16.000, r_IDR 6%, r_USD 5%, 3 bulan). (c) Bandingkan biaya forward vs opsi put. (d) Kapan <em>tidak</em> hedging dibenarkan? (e) Rancang kebijakan treasury yang mendamaikan kubu A &amp; B.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Eksposur terbuka = taruhan arah.</strong> 'Biasanya melemah' = view tanpa mandat/analisis. Keputusan pasif tetap keputusan.</p>
<p>(b) <strong>Jual USD 1jt forward @ ~Rp16.038</strong> → terima Rp16,038M pasti. Biaya = forward points (selisih bunga) + melepas upside.</p>
<p>(c) Jika <strong>kebijakan treasury</strong> menyatakan toleransi (mis. eksposur &lt; Rp5M tidak di-hedge karena biaya &gt; manfaat) — <strong>keputusan sadar by policy</strong>, bukan kelalaian.</p>
<p>(d) <strong>Forward 3 bulan:</strong> F = 16.000 &times; (1,06/1,05)^(0,25) &asymp; <strong>Rp16.038</strong> &rarr; terima Rp16,038M pasti. <strong>Put USD/IDR:</strong> bayar premi &asymp; 1,5&ndash;2% (Rp240&ndash;320jt) &rarr; lindungi downside tapi <em>simpan upside</em> jika IDR melemah. <strong>Perbandingan:</strong> forward &ldquo;gratis&rdquo; tapi kaku; put fleksibel tapi mahal. Untuk piutang <em>pasti</em> (sudah terjadi) &rarr; <strong>forward lebih tepat</strong> (tidak butuh upside &mdash; piutangnya fixed!).</p>
<p>(e) <strong>Kebijakan treasury ideal:</strong> (1) eksposur &gt; Rp5M &amp; &gt; 1 bulan &rarr; <strong>wajib hedge minimal 50%</strong> via forward; (2) <em>hedge ratio</em> ditentukan komite, bukan individu; (3) <em>review</em> kuartalan: biaya hedge vs volatilitas yang dihindari. <strong>Kubu A puas</strong> (eksposur kecil tidak di-hedge), <strong>kubu B puas</strong> (eksposur besar terlindungi) &mdash; dan tidak ada lagi &ldquo;keputusan&rdquo; dadakan.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Yang Tidak Diajarkan di Brosur</h2>
      <h3>1. Margin &amp; clearing &mdash; kenapa futures tidak gagal bayar (biasanya)</h3>
      <p><strong>Mekanisme:</strong> <em>initial margin</em> (deposit awal) + <em>variation margin</em> (settle harian) + <em>clearing house</em> sebagai lawan tiap transaksi. Rugi hari ini &rarr; bayar <em>hari ini juga</em> &mdash; tidak ada utang menumpuk. <strong>Tapi:</strong> saat <em>gap</em> ekstrem (2020: minyak negatif!), margin tidak cukup &rarr; clearing house pakai <em>default fund</em>. Sistem ini memindahkan risiko dari <em>counterparty</em> ke <em>sistem</em> &mdash; lebih aman, tapi menciptakan <em>too-big-to-fail</em> baru.</p>
      <h3>2. Volatility smile &mdash; pasar takut ekor kiri</h3>
      <p>Black-Scholes mengasumsikan vol <em>konstan</em> &mdash; tapi pasar memberi <em>implied vol</em> lebih tinggi untuk put OTM (ekor kiri) dibanding call OTM. <strong>Smile/skew</strong> = bukti pasar membayar <em>premi ketakutan crash</em>. Praktis: jangan pakai <em>satu</em> vol untuk semua strike &mdash; pakai <em>vol surface</em>. Dan sadari: <strong>put OTM yang &ldquo;murah&rdquo; menurut BS bisa jadi <em>wajar</em> menurut pasar yang takut.</strong></p>
      <h3>3. Hedging vs spekulasi &mdash; garis tipis</h3>
      <p>Maskapai hedge BBM 80% kebutuhan = <strong>hedging</strong>. Hedge 200% = <strong>spekulasi</strong> (kelebihan 100% = taruhan arah!). Aturan akuntansi (<em>hedge accounting</em>) pun mensyaratkan efektivitas 80&ndash;125%. <strong>Uji:</strong> jika harga bergerak <em>menguntungkanmu</em>, apakah posisi derivatifmu <em>rugi</em>? Jika ya &rarr; hedge (seimbang). Jika ikut untung &rarr; kamu <em>doubling down</em>, bukan hedging.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Forward wajar kilat</h3>
      <p>S = 15.500, r_IDR = 6%, r_USD = 5%, 6 bulan. Forward wajar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>F = 15.500 &times; (1,06/1,05)^0,5 = 15.500 &times; 1,00475 = <strong>15.574</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Put payoff</h3>
      <p>Beli put strike 100, premi 5. Harga jatuh tempo 80. P/L per lembar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Payoff = 100&minus;80 = 20; P/L = 20 &minus; 5 = <strong>+15</strong>. (Tanpa put, pemegang saham rugi 20.)</p>
      </details>
      <h3>Drill 3 &mdash; Nilai swap</h3>
      <p>Swap terima-tetap 6% notional 10M, sisa 1 thn. PV kaki tetap 10,63M, kaki floating &asymp; 10M. Nilai bagi penerima tetap?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>+Rp630rb</strong> (10,63 &minus; 10,00). Positif = menguntungkan penerima tetap &mdash; karena suku bunga <em>turun</em> sejak swap dibuat (kaki tetap makin berharga).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette hedge atau spekulasi?</h3>
      <p>Importir butuh USD 500rb/bulan. Ia <em>membeli</em> USD 2jt forward (4 bulan kebutuhan) karena &ldquo;yakin rupiah akan melemah&rdquo;. Analisis.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>75% spekulasi.</strong> Kebutuhan 500rb &rarr; hedge wajar 500rb&ndash;600rb. Kelebihan 1,4jt = taruhan arah (&ldquo;yakin&rdquo; = view, bukan hedge). Jika IDR <em>menguat</em>, kelebihan itu rugi &mdash; dan tidak ada eksposur yang dilindungi. <strong>Hedge = sebesar eksposur; lebih = spekulasi.</strong></p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. S=16.000, r=6%, T=0,25. Harga forward wajar?"}
  options={
    ["16.000",
    "≈ 16.238",
    "15.800",
    "17.000"]
  }
  correct={1}
  explanation={"Benar: 16.000×1,06^0,25 = 16.238. (Untuk FX pakai selisih dua suku bunga — di sini disederhanakan satu rate.)"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Bedakan forward vs futures."}
  options={
    ["Sama saja",
    "Futures: terstandar di bursa + marking to market harian",
    "Forward diperdagangkan di bursa",
    "Futures tidak ada risiko"]
  }
  correct={1}
  explanation={"Benar: futures = forward versi bursa: standar + settlement harian → risiko kredit kecil. Forward = custom OTC, risiko counterparty."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Beli put X=9.000 premi 300, saham jatuh ke 7.000. Net (pegang saham)?"}
  options={
    ["−3.000",
    "−1.300 (asuransi bekerja)",
    "+1.700",
    "−300"]
  }
  correct={1}
  explanation={"Benar: saham −3.000, put payoff +2.000, premi −300 → net −1.300. Bukan +1.700 (itu jika tidak pegang saham)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Put-call parity dilanggar (C+PV(X) &gt; P+S). Tindakan?"}
  options={
    ["Diam",
    "Arbitrase: jual sisi mahal, beli sisi murah",
    "Beli keduanya",
    "Jual keduanya"]
  }
  correct={1}
  explanation={"Benar: parity = hubungan no-arbitrage. Pelanggaran = makan siang gratis sesaat — jual call+kas (mahal), beli put+saham (murah)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Perusahaan utang floating takut suku bunga naik. Solusi?"}
  options={
    ["Biarkan",
    "IRS: bayar fixed, terima floating",
    "Beli call",
    "Jual saham"]
  }
  correct={1}
  explanation={"Benar: swap mengubah floating → fixed, mengunci biaya bunga. Seperti forward, tapi untuk suku bunga."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Forward USD/IDR 1 tahun yang FAIR baru dibuat. Nilainya saat ini?"}
  options={
    ["Positif — pembeli selalu untung",
    "Nol — forward fair dirancang PV=0 saat inisiasi",
    "Negatif — penjual selalu untung",
    "Tidak bisa ditentukan"]}
  correct={1}
  explanation={"Benar: forward/swap yang fair dirancang agar PV = 0 saat dibuat — tidak ada pihak 'untung duluan'. Nilai menjadi non-nol SETELAH pasar bergerak."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Forward</strong>: F = S(1+r)^T; custom OTC. <strong>Futures</strong>: standar + marking to market.</li>
<li><strong>Swap</strong>: tukar fixed ↔ floating; notional tidak berpindah.</li>
<li><strong>Opsi</strong>: call = hak beli, put = hak jual; payoff hockey stick; nilai = intrinsic + time.</li>
<li><strong>Put-call parity</strong> (Eropa): C + PV(X) = P + S.</li>
<li><strong>Tidak hedging = spekulasi</strong> — keputusan pasif tetap keputusan.</li>
<li><strong>Kapan TIDAK derivatif</strong>: eksposur kecil &lt; biaya transaksi (by policy).</li>

<li><strong>Forward/futures:</strong> kunci harga; futures + margin harian = tanpa counterparty risk.</li>
<li><strong>Swap:</strong> obligasi tetap − obligasi mengambang; nilai awal fair = 0.</li>
<li><strong>Opsi:</strong> beli = rugi terbatas; put-call parity menghubungkan semuanya.</li>
<li><strong>Kapan TIDAK pakai:</strong> hedge melebihi eksposur (= spekulasi); derivatif tanpa 4 pertanyaan terjawab; forward untuk eksposur tidak pasti.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a7-fixed-income" className="btn btn-secondary btn-sm">← PM-A7</Link>
        <Link href="/learn/pm-a9-alternatives" className="btn btn-primary btn-sm">PM-A9 →</Link>
      </div>
    </div>
  );
}

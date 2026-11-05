"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC9DerivativesOverlayPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C9 — Portfolio Management</span>
        <h1 className="display-title">Derivatives Overlay:<br/>Hedging & Portable Alpha</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Rp50 Miliar yang 'Diasuransikan' Rp500 Juta</a></li>
<li><a href="#equityoverlay">Equity Overlay</a></li>
<li><a href="#currency">Currency Overlay</a></li>
<li><a href="#portable">Portable Alpha</a></li>
<li><a href="#sintesis">Sintesis: Lapisan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Put Rp500 Jt</a></li>
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
<li>Menjelaskan 3 equity overlay dan trade-off-nya.</li>
<li>Menghitung hedge ratio optimal untuk eksposur valas.</li>
<li>Menjelaskan portable alpha dan completion.</li>
<li>Memilih overlay sesuai objective.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Rp50 Miliar yang 'Diasuransikan' Rp500 Juta</h2>
      <div className="story">
        <p><strong>Dana pensiun</strong> kelola <strong>Rp50 miliar</strong> saham. <strong>Januari 2020</strong>: CIO gelisah (valuasi tinggi, virus misterius). Beli <strong>protective put 3 bulan</strong>: premi <strong>Rp500 juta</strong> (1%). <strong>Maret</strong>: pasar <strong>−35%</strong> → put meledak → kerugian terpotong <strong>Rp12 miliar</strong>.</p>
<p>Twist-nya: dewan <em>protes</em> — 'Rp500jt hangus jika pasar naik!' CIO: <strong>'Asuransi rumah juga hangus jika tidak kebakaran.'</strong> Tahun itu put <em>tidak</em> hangus — ia <strong>menyelamatkan</strong> funded ratio. Lesson ini: derivatif sebagai <em>asuransi</em>, bukan <em>spekulasi</em>.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="equityoverlay">Equity Overlay — Asuransi Portofolio</h2>
<p><strong>Definisi.</strong> <strong>Protective put</strong>: beli put → batasi downside, <em>bayar premi</em>. <strong>Covered call</strong>: jual call → <em>terima premi</em>, korbankan upside. <strong>Collar</strong>: beli put + jual call → <strong>koridor</strong> (downside lindung, upside dibatasi) — sering <strong>zero-cost</strong>!</p>
<p><strong>Trade-off</strong>: tidak ada makan siang — proteksi <em>selalu</em> dibayar (premi atau upside).</p>
<Tex math={String.raw`\text{Collar: } S + P(K_1) - C(K_2), \quad K_1 < S < K_2`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`P(K_1)`} />: long put strike bawah (lantai)</li>
<li><Tex math={String.raw`C(K_2)`} />: short call strike atas (plafon)</li>
<li>Zero-cost: premi put ≈ premi call</li>
<li>Payoff terkunci di <Tex math={String.raw`[K_1, K_2]`} /></li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Collar seperti <strong>koridor hotel</strong>: put = <strong>dinding bawah</strong> (tidak jatuh), call yang dijual = <strong>plafon</strong> (tidak bisa terbang). Tinggal di koridor = <strong>tenang</strong>. Harganya: tidak bisa lihat bintang (upside besar).</p>
<p><strong>Kapan dipakai:</strong> Lindungi funded ratio / lock-in gain; zero-cost collar untuk institusi.</p>
<p><strong>Pendalaman intuisi &mdash; overlay = &ldquo;asuransi tanpa jual rumah&rdquo;.</strong> Punya portofolio Rp50M, takut crash 3 bulan? <strong><em>Jual</em></strong> = ubah SAA + biaya + pajak + <em>timing risk</em>! <strong><em>Overlay put</em></strong> = bayar premi 1% &rarr; <strong><em>pertahankan</em> SAA + <em>proteksi</em> sementara</strong>! <strong>Analogi:</strong> asuransi rumah &ldquo;hangus&rdquo; jika tidak kebakaran &mdash; <strong><em>ekspektasi</em> hangus; <em>nilainya</em> di skenario buruk</strong>. <strong>Overlay &ne; <em>alokasi</em></strong> &mdash; ia <em>lapisan</em> di atasnya.</p><details className="worked">
<summary>📐 Contoh: Collar dana pensiun (klik untuk buka)</summary>
<p>Saham Rp50M (harga 100). Beli put K=90 (premi 3), jual call K=110 (premi 3) → <strong>zero-cost</strong>.</p>
<p><strong>Skenario</strong>: jatuh ke 70 → put bayar 20 → nilai <strong>90 − 0 = 90%</strong> (rugi maks 10%). Naik ke 130 → call dieksekusi → nilai <strong>110%</strong> (cuan maks 10%).</p>
<p><strong>Hasil Maret 2020</strong>: pasar −35% → portofolio <strong>−10%</strong> (bukan −35%!). Funded ratio <strong>selamat</strong>. Dewan yang protes kini diam.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Protective put &mdash; angka lengkap</summary>
<p><strong>Soal:</strong> portofolio Rp50M (beta 1). Beli put 3 bulan, <em>strike</em> 95%, premi 1% (Rp500jt). Skenario: (a) &minus;35%; (b) +10%.</p>
<p><strong>(a) Crash &minus;35%:</strong> tanpa put: &minus;17,5M. Dengan put: rugi <em>terbatas</em> &asymp; &minus;5% &minus; 1% = <strong>&minus;3M</strong> (hemat <strong>14,5M</strong>!).</p>
<p><strong>(b) Naik +10%:</strong> tanpa put: +5M. Dengan put: +5M &minus; 0,5M = <strong>+4,5M</strong> (&ldquo;hangus&rdquo; 0,5M!).</p>
<p><strong>Keputusan:</strong> <strong><em>layak</em> jika</strong> <em>takut</em> crash &gt; <em>sayang</em> premi! <strong>Asuransi = <em>bayar</em> untuk <em>tenang</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Collar &mdash; &ldquo;asuransi gratis&rdquo;?</summary>
<p><strong>Soal:</strong> beli put 95% (bayar 1%) + jual call 110% (terima 1%). <em>Net</em> premi = 0! &ldquo;Gratis&rdquo;?</p>
<p><strong>Tidak gratis!</strong> &mdash; <strong><em>bayar</em> dengan <em>upside</em>!</strong> Jika naik 20% &rarr; <em>terbatas</em> di 10%! (<em>call</em> dieksekusi!).</p>
<p><strong>Cocok:</strong> butuh <em>proteksi</em> + <em>rela</em> korbankan <em>upside</em> ekstrem + <em>tidak mau</em> bayar premi. <strong><em>Collar</em> = <em>kompromi</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Kapan TIDAK overlay</summary>
<p><strong>Soal:</strong> tiga situasi: (1) horizon 30 tahun; (2) <em>funded ratio</em> 60% + pensiunan <em>menunggu</em>; (3) <em>vol</em> rendah + <em>tenang</em>.</p>
<p><strong>(1) Tidak perlu:</strong> 30 tahun = <em>pulih</em> dari crash! <em>Overlay</em> = <em>buang premi</em>.</p>
<p><strong>(2) Perlu!</strong> <em>funded</em> rendah + <em>kewajiban dekat</em> = <em>tidak bisa</em> rugi besar!</p>
<p><strong>(3) <em>Justru</em> perlu:</strong> premi <em>murah</em> saat tenang! (<em>Beli</em> asuransi <em>sebelum</em> kebakaran!). <strong><em>Timing</em> overlay = <em>kontra-intuitif</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Overlay = market timing&rdquo;.</strong> <strong>SALAH.</strong> <em>Overlay</em> = <em>pertahankan</em> SAA + <em>proteksi</em> sementara. <em>Timing</em> = <em>ubah</em> SAA karena <em>ramalan</em>. <strong><em>Overlay</em> = <em>disiplin</em>; <em>timing</em> = <em>spekulasi</em>.</strong></p>
</div>
<PlotlyChart
  data={[{x: [70,80,90,100,110,120,130], y: [90,90,90,100,110,110,110], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, line: {width: 3}, name: "collar"}, {x: [70,80,90,100,110,120,130], y: [70,80,90,100,110,120,130], type: "scatter", mode: "lines", line: {dash: "dash", color: "#94a3b8"}, name: "tanpa lindung"}]}
  title={"Payoff collar (K1=90, K2=110) vs tanpa lindung"}
  layout={{xaxis: {title: "Harga saham saat expiry"}, yaxis: {title: "Nilai portofolio"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = collar; abu putus-putus = tanpa lindung. Sumbu-x = harga akhir.</p>
<p><strong>Interpretasi:</strong> Collar <strong>memotong kedua ekor</strong>: rugi maks 10% (lantai 90), cuan maks 10% (plafon 110). Tanpa lindung = garis 45° (bebas, berisiko). Pilih collar saat <strong>ketenangan &gt; lotere</strong> — mis. lindungi funded ratio institusi.</p>
</div>

<PlotlyChart
  data={[{x: [-35,-20,-10,0,10,20], y: [-6,-6,-6,-1,9,19], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Dengan put"}, {x: [-35,-20,-10,0,10,20], y: [-35,-20,-10,0,10,20], type: "scatter", mode: "lines", line: {dash: "dash", color: "#888"}, name: "Tanpa put"}]}
  title={"Protective put: rugi terbatas, upside hampir penuh"}
  layout={{xaxis: {title: "Return pasar (%)"}, yaxis: {title: "Return portofolio (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = return pasar; sumbu Y = return portofolio. Biru = dengan put; putus-putus = tanpa.</p>
<p><strong>Interpretasi:</strong> <strong>Kiri</strong> (crash!): biru <em>datar</em> di &minus;6% (<em>terproteksi</em>!) vs abu-abu <em>jatuh</em>! <strong>Kanan</strong> (naik!): biru <em>hampir</em> ikut (minus premi 1%!). <strong><em>Asimetri</em> = <em>nilai</em> asuransi.</strong> <em>Bayar</em> 1% untuk <em>pangkas</em> ekor kiri!</p>
</div>
<h2 id="currency">Currency Overlay — Menjinakkan Valas</h2>
<p><strong>Definisi.</strong> Aset global = <strong>return aset + return valas</strong>. <strong>Hedge ratio</strong>: % eksposur valas yang dilindungi (0–100%). <strong>Hedge optimal</strong>: h* = ρ × (σ_aset/σ_fx) — dari regresi! <strong>Cross-hedge</strong>: lindungi dengan <em>proxy</em> saat forward tidak tersedia.</p>
<p><strong>Keputusan</strong>: hedge jika valas = <strong>risiko tanpa premi</strong> (jangka pendek); biarkan jika <strong>diversifikasi</strong> (jangka panjang) atau <strong>biaya carry mahal</strong>.</p>
<Tex math={String.raw`h^* = \rho_{A,FX} \frac{\sigma_A}{\sigma_{FX}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`h^*`} />: hedge ratio optimal (regresi return aset thd FX)</li>
<li>Jika <Tex math={String.raw`h^*`} /> = 0,6 → hedge 60% eksposur</li>
<li>Biaya hedge ≈ selisih suku bunga (covered interest parity!)</li>
<li>Review: korelasi berubah → hedge ratio berubah</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Currency overlay seperti <strong>sabuk pengaman</strong>: perjalanan (investasi global) tetap jalan; sabuk (hedge) hanya mengurangi <em>cedera</em> (volatilitas FX). Tidak pakai sabuk karena 'mahal' = berhemat di tempat salah.</p>
<p><strong>Kapan dipakai:</strong> Eksposur global material; putuskan hedge ratio per mata uang.</p>
<p><strong>Pendalaman intuisi &mdash; currency overlay = &ldquo;pisahkan keputusan&rdquo;.</strong> Manajer saham <em>hebat</em> tapi <em>buta</em> valas? <strong><em>Overlay</em></strong>: biarkan manajer pilih saham; <em>tim terpisah</em> kelola <em>risiko mata uang</em>! <strong>Keunggulan:</strong> <em>spesialisasi</em> (ahli saham &ne; ahli valas!) + <em>akuntabilitas</em> (siapa <em>salah</em> = jelas!). <strong><em>Hedge ratio</em>:</strong> 0% (biarkan!) / 50% (tengah!) / 100% (penuh!) &mdash; <strong><em>keputusan strategis</em></strong>, bukan <em>teknis</em>.</p><details className="worked">
<summary>📐 Contoh: Hedge USD/IDR (klik untuk buka)</summary>
<p>Reksadana USD Rp10M. ρ(aset, USDIDR) = 0,3; σ_aset = 15%, σ_fx = 8%.</p>
<p><strong>h*</strong> = 0,3 × 15/8 = <strong>0,56</strong> → hedge <strong>56%</strong> via forward USDIDR.</p>
<p><strong>Biaya</strong>: (BI rate − Fed rate) ≈ 2%/tahun → <strong>Rp112jt</strong> untuk proteksi Rp5,6M. <strong>Worth it?</strong> Jika volatilitas IDR mengganggu IPS → ya.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Hedge ratio &mdash; keputusan</summary>
<p><strong>Soal:</strong> portofolio saham global Rp10M (50% USD!). <em>Hedge ratio</em> optimal?</p>
<p><strong>Pertimbangkan:</strong> (1) <strong><em>Biaya</em></strong> (<em>forward point</em> &asymp; selisih bunga!); (2) <strong><em>Diversifikasi</em></strong> (USD = <em>hedge alami</em> saat krisis!); (3) <strong><em>Vol</em></strong> (FX 8% vs saham 16% &rarr; <em>relatif kecil</em>!).</p>
<p><strong>Keputusan umum:</strong> <strong><em>parsial</em> (25&ndash;50%)</strong> &mdash; <em>tidak</em> 0% (<em>risiko</em>!), <em>tidak</em> 100% (<em>biaya</em> + <em>buang diversifier</em>!). <strong><em>Hedge ratio</em> = <em>keputusan strategis</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Overlay vs manajer hedging sendiri</summary>
<p><strong>Soal:</strong> manajer saham <em>hedge</em> valas sendiri vs <em>overlay</em> terpusat. Mana lebih baik?</p>
<p><strong>Manajer sendiri:</strong> <em>tidak spesialis</em>! <em>tidak konsisten</em> (tiap manajer beda!)! <em>tidak transparan</em>!</p>
<p><strong><em>Overlay</em> terpusat:</strong> <strong><em>spesialis</em></strong>! <strong><em>konsisten</em></strong>! <strong><em>efisien</em></strong> (<em>netting</em>! <em>skala</em>!). <strong><em>Akuntabilitas</em></strong> jelas!</p>
<p><strong>Putusan:</strong> <strong><em>overlay</em> untuk <em>institusi besar</em></strong> (multi-manajer!). <strong><em>Pisahkan</em> yang <em>bisa dipisahkan</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Hedging selalu benar&rdquo;.</strong> <strong>SALAH.</strong> <em>Hedging</em> = <em>biaya</em>! (premi! <em>forward point</em>!). <strong><em>Hedge</em> jika:</strong> <em>risiko</em> &gt; <em>biaya</em>! <strong><em>Jangan</em> jika:</strong> horizon <em>panjang</em>! <em>natural hedge</em>! <em>biaya</em> &gt; <em>manfaat</em>! <strong><em>Hedging</em> = <em>keputusan ekonomi</em>.</strong></p>
</div>
<h2 id="portable">Portable Alpha — Memindahkan Keahlian</h2>
<p><strong>Definisi.</strong> <strong>Portable alpha</strong>: pisahkan <em>alpha</em> (skill manajer A) dari <em>beta</em> (eksposur pasar B) via derivatif — 'pindahkan' alpha ke mana pun. <strong>Completion portfolio</strong>: overlay yang <em>melengkapi</em> bias tidak disengaja (mis. semua manajer large-cap → tambah small-cap futures).</p>
<p><strong>Syarat</strong>: alpha <em>benar-benar portable</em> (tidak terikat beta asal!) + pasar futures <em>likuid</em>.</p>
<p><strong>Kepribadian/intuisi:</strong> Portable alpha seperti <strong>koki bintang yang bisa masak di dapur mana pun</strong>: skill (alpha) dibawa; dapur (beta pasar) disewa via futures. Completion = <strong>bumbu pelengkap</strong> agar hidangan (portofolio total) seimbang.</p>
<p><strong>Kapan dipakai:</strong> Manajer alpha terbaik ada di kelas aset yang tidak dibutuhkan.</p>
<p><strong>Pendalaman intuisi &mdash; portable alpha = &ldquo;pinjam beta, bawa alpha&rdquo;.</strong> Punya <em>alpha</em> di saham tapi butuh <em>eksposur</em> obligasi? <strong><em>Portable alpha</em>:</strong> (1) beli <em>alpha</em> (manajer saham!) + (2) <em>swap</em> beta saham &rarr; obligasi via <em>futures</em>! <strong>Hasil:</strong> <em>return obligasi</em> + <em>alpha saham</em>! <strong>Risiko:</strong> <em>basis</em>! <em>leverage</em>! <em>kompleksitas</em>! <strong>Untuk <em>institusi canggih</em></strong> &mdash; bukan <em>pemula</em>.</p><details className="worked">
<summary>📐 Contoh: Alpha obligasi → ekuitas (klik untuk buka)</summary>
<p>Manajer obligasi hebat (alpha +3%) tapi SAA butuh <em>ekuitas</em>. <strong>Portable</strong>: beli manajer obligasi + <strong>jual bond futures + beli equity futures</strong> (swap beta).</p>
<p><strong>Hasil</strong>: eksposur ekuitas (beta) + alpha obligasi = <strong>keduanya</strong>! Tanpa portable: pilih salah satu.</p>
<p><strong>Risiko</strong>: basis risk futures + alpha ternyata <em>tidak</em> portable (terikat pasar obligasi!). Uji dulu.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Portable alpha &mdash; mekanik</summary>
<p><strong>Soal:</strong> butuh <em>eksposur</em> obligasi 100jt + punya manajer saham <em>alpha</em> 3%. Rancang <em>portable alpha</em>.</p>
<p><strong>Langkah 1:</strong> 100jt ke manajer saham (<em>alpha</em>!).</p>
<p><strong>Langkah 2:</strong> <em>short</em> futures saham 100jt + <em>long</em> futures obligasi 100jt (<em>swap beta</em>!).</p>
<p><strong>Hasil:</strong> <em>return obligasi</em> + <em>alpha 3%</em>! (<em>Beta</em> saham <em>netral</em>!).</p>
<p><strong>Risiko:</strong> <strong><em>basis</em></strong> (futures &ne; spot!)! <strong><em>Margin</em></strong>! <strong><em>Manajer</em></strong> (alpha <em>gagal</em>?). <strong><em>Canggih</em> = <em>rapuh</em> jika <em>salah</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kapan portable alpha GAGAL</summary>
<p><strong>Soal:</strong> 2008: <em>portable alpha</em> (saham alpha + obligasi beta). Apa yang terjadi?</p>
<p><strong>Bencana:</strong> (1) <em>Alpha</em> saham &rarr; <strong><em>negatif</em></strong> (semua jatuh!); (2) <em>futures</em> = <strong><em>margin call</em></strong>!; (3) <em>likuiditas</em> kering!</p>
<p><strong>Pelajaran:</strong> <strong><em>portable alpha</em> = <em>leverage terselubung</em></strong>! Saat krisis: <em>alpha</em> hilang + <em>margin</em> menuntut! <strong><em>Kompleksitas</em> = <em>risiko</em>.</strong> <strong>Hanya untuk yang <em>sangat paham</em>.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Lapisan Proteksi</h2>
      <p>Equity overlay, currency, portable alpha = <strong>satu prinsip</strong>:</p>
      <ol>
        <li><strong>PISAHKAN:</strong> <em>keputusan</em> alokasi vs <em>risiko</em> &mdash; <strong><em>spesialisasi</em></strong>!</li>
        <li><strong>LINDUNGI:</strong> <em>derivatif</em> untuk <em>sementara</em> &mdash; <strong><em>pertahankan</em> SAA</strong>!</li>
        <li><strong>KOMBINASIKAN:</strong> <em>portable alpha</em> &mdash; <strong><em>hanya</em> jika <em>paham</em></strong>!</li>
      </ol>
      <p><strong><em>Overlay</em> = <em>alat presisi</em>. Gunakan <em>presisi</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Hedging = pesimis&rdquo;</h3>
      <p><strong>Optimis:</strong> &ldquo;<em>Hedging</em> = <em>tidak percaya</em> diri! <em>Buang</em> premi! <em>Berani</em> = <em>untung</em>!&rdquo;</p>
      <p><strong>Hedger:</strong> &ldquo;<strong><em>Kelangsungan</em> &gt; <em>keberanian</em>.</strong> 2008: yang <em>hedge</em> = <em>selamat</em>; yang <em>berani</em> = <em>mati</em>. <strong><em>Hedging</em> = <em>bayar</em> untuk <em>tetap main</em>.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>hedge</em> yang <em>tidak bisa</em> rugi besar.</strong> <em>Kewajiban</em> dekat + <em>funded</em> rendah = <em>wajib</em> hedge. <em>Horizon</em> panjang = <em>opsional</em>.</p>
      <h3>🧪 Eksperimen: Kapan kamu hedge?</h3>
      <p><strong>Tulis:</strong> (1) <em>Risiko</em> apa yang <em>ditakuti</em>? (2) <em>Biaya</em> hedge? (3) <em>Alternatif</em>?</p>
      <p><strong>Jika</strong> risiko &gt; biaya &rarr; <strong><em>hedge</em></strong>! Jika <em>tidak</em> &rarr; <strong><em>terima</em></strong>! <strong><em>Keputusan sadar</em> &gt; <em>default</em>.</strong></p>
      <h3>📰 Studi Kasus: Harvard Put (1987)</h3>
      <p>1987: <em>portfolio insurance</em> (<em>dynamic hedging</em>!) &rarr; <strong><em>memperparah</em> crash</strong> (semua <em>jual</em> bersamaan!).</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Dynamic</em> &ne; <em>aman</em></strong> (<em>gap risk</em>!); (2) <strong><em>Crowded</em> = <em>bahaya</em></strong>; (3) <strong><em>Put</em> asli &gt; <em>sintetis</em></strong> (bayar premi, <em>dapat</em> jaminan!). <strong><em>Sederhana</em> &gt; <em>pintar</em>.</strong></p>
      <h3>📊 Data Corner: Biaya hedging FX</h3>
      <p><strong>Data:</strong> <em>forward point</em> USD/IDR &asymp; 4%/tahun (= selisih bunga!).</p>
      <p><strong>Artinya:</strong> <em>hedge penuh</em> = <strong><em>bayar</em> 4%/tahun</strong>! <strong>10 tahun = 34%</strong>! <strong><em>Hedge</em> = <em>mahal</em>.</strong> <em>Pertimbangkan</em>: <em>parsial</em>! <em>natural</em>! <em>opsionalitas</em>!</p>
      <h3>📖 Kamus Istilah (Referensi Cepat)</h3>
      <p><strong>OVERLAY:</strong> <em>protective put</em>! <em>collar</em>! <em>CPPI</em>! <em>vol targeting</em>!</p>
      <p><strong>VALAS:</strong> <em>hedge ratio</em>! <em>forward point</em>! <em>natural hedge</em>!</p>
      <p><strong>ALPHA:</strong> <em>portable</em>! <em>beta</em>! <em>basis</em>! <em>margin</em>!</p>
      <p><strong>Hafalkan</strong> &mdash; ini <em>bahasa</em> overlay.</p>
      <h3>💡 Prinsip Abadi Overlay</h3>
      <p><strong>(1) <em>Pertahankan</em> SAA.</strong> (2) <strong><em>Bayar</em> untuk <em>tenang</em>.</strong> (3) <strong><em>Pisahkan</em> keputusan.</strong> (4) <strong><em>Pahami</em> sebelum pakai.</strong> (5) <strong><em>Komunikasikan</em> sebelum beli.</strong></p>
      <p><strong>Lima prinsip. Tempel di dinding.</strong></p>
      <h3>🎓 Ujian Akhir Lesson (Refleksi)</h3>
      <p><strong>Pertanyaan 1:</strong> Put 95%, premi 1%. Crash &minus;35%. <em>Hemat</em> berapa?</p>
      <p><strong>Pertanyaan 2:</strong> <em>Collar</em> &ldquo;gratis&rdquo;? <em>Bayar</em> dengan apa?</p>
      <p><strong>Pertanyaan 3:</strong> Kapan <em>TIDAK</em> perlu overlay? (2 kondisi!)</p>
      <p><strong>Jika bisa jawab ketiganya &rarr; <em>lulus</em>.</strong></p>
      <h3>🔗 Menghubungkan ke Lesson Lain</h3>
      <p><strong>Ke PM-B6 (Derivatif):</strong> <em>put/call</em> = <em>dipelajari</em> di sana!</p>
      <p><strong>Ke PM-B7 (Valas):</strong> <em>currency</em> = <em>konteks</em> di sana!</p>
      <p><strong>Ke PM-C1 (IPS):</strong> overlay = <em>ditulis</em> di IPS!</p>
      <h3>🔬 Deep Dive Tambahan: Greeks untuk Overlay</h3>
      <p><strong><em>Delta</em>:</strong> put 95% = delta &asymp; &minus;0,3 &rarr; <strong><em>lindungi</em> 30%</strong> portofolio! <strong><em>Gamma</em>:</strong> delta <em>bertambah</em> saat jatuh &rarr; <strong><em>proteksi</em> <em>akselerasi</em></strong>! <strong><em>Theta</em>:</strong> &ldquo;<em>sewa</em>&rdquo; harian &rarr; <strong><em>jangan</em> pegang <em>terlalu lama</em></strong>! <strong><em>Vega</em>:</strong> vol <em>naik</em> &rarr; put <em>mahal</em> &rarr; <strong><em>untung ganda</em></strong> saat crash!</p>
      <p><strong>Implikasi:</strong> <strong><em>put</em> = <em>asuransi</em> yang <em>makin kuat</em> saat <em>dibutuhkan</em></strong> (<em>gamma</em>! <em>vega</em>!). <strong><em>Theta</em> = <em>harga</em>.</strong> <strong><em>Pahami</em> Greeks <em>sebelum</em> beli!</strong></p>
      <h3>📊 Data Corner: Kapan Vol Murah?</h3>
      <p><strong>Data:</strong> VIX &lt; 15 (<em>tenang</em>!) &rarr; premi put <em>murah</em>! VIX &gt; 30 (<em>panik</em>!) &rarr; premi <em>mahal</em> 3&times;!</p>
      <p><strong>Aturan:</strong> <strong><em>beli</em> proteksi saat <em>tenang</em></strong> (VIX rendah!), <strong><em>jangan</em> saat <em>panik</em></strong> (mahal!). <strong><em>Kontra-intuitif</em></strong> = <em>benar</em>. <strong><em>Asuransi</em> dibeli <em>sebelum</em> kebakaran!</strong></p>
      <h3>🧪 Eksperimen: Simulasi Crash</h3>
      <p><strong>Bayangkan:</strong> portofoliomu 1M. <em>Tanpa</em> hedge: crash &minus;35% &rarr; <strong>650jt</strong> (<em>panik</em>!). <em>Dengan</em> put (1%): <strong>940jt</strong> (<em>tenang</em>!).</p>
      <p><strong>Pertanyaan:</strong> <em>berapa</em> nilai <em>ketenangan</em>? <strong>Jika</strong> 290jt &gt; 10jt (premi!) &rarr; <strong><em>hedge</em></strong>! <strong><em>Tidur nyenyak</em> = <em>return</em>.</strong></p>
      <h3>📰 Studi Kasus: Universa (Taleb)</h3>
      <p>Mark Spitznagel: <em>tail hedge</em> &mdash; <strong><em>rugi kecil</em> tiap tahun</strong> (premi!), <strong><em>untung besar</em></strong> saat crash! 2008: <strong>+100%+</strong>! 2020: <strong>+4000%</strong>!</p>
      <p><strong>Pelajaran:</strong> <strong><em>asuransi</em> = <em>strategi</em></strong> (bukan <em>biaya</em>!). <strong><em>Ekor</em> = <em>peluang</em></strong> bagi yang <em>siap</em>. <strong><em>Antifragile</em>!</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;Derivatif = kasino&rdquo;</h3>
      <p><strong>Kritik:</strong> &ldquo;Derivatif = <em>taruhan</em>! <em>Nol-sum</em>! <em>Merusak</em>!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;<strong><em>Asuransi</em> = <em>nol-sum</em></strong> juga! Tapi <em>berguna</em>! Derivatif = <em>transfer risiko</em> ke yang <em>mau</em>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>alat</em> &ne; <em>penggunaan</em>.</strong> <em>Hedging</em> = <em>bijak</em>; <em>spekulasi</em> = <em>risiko</em>. <strong><em>Kenali</em> dirimu.</strong></p>
      <h3>✅ Final Checklist Overlay</h3>
      <p><strong>KEBUTUHAN:</strong> (1) <em>Risiko</em> apa? (2) <em>Horizon</em>? (3) <em>Alternatif</em>?</p>
      <p><strong>BIAYA:</strong> (4) <em>Premi</em>? (5) <em>Layak</em>? (6) <em>Breakeven</em>?</p>
      <p><strong>EKSEKUSI:</strong> (7) <em>Pahami</em>? (8) <em>Komunikasikan</em>? (9) <em>Kapan lepas</em>?</p>
      <p><strong>9 cek. <em>Lulus</em> semua &rarr; <em>eksekusi</em>.</strong></p>
      <h3>🌍 Overlay Global: Studi Kasus Nyata</h3>
      <p><strong>Norwegia (SWF):</strong> <em>tidak</em> hedge FX (<em>jangka panjang</em>!). <strong>Jepang (GPIF):</strong> <em>parsial</em> hedge. <strong>Belanda (APG):</strong> <em>dinamis</em>!</p>
      <p><strong>Pelajaran:</strong> <strong><em>tidak ada</em> satu jawaban</strong> &mdash; <em>konteks</em>! <strong><em>Pelajari</em> yang <em>besar</em>.</strong></p>
      <h3>💰 Biaya Overlay: Hitung Total</h3>
      <p><strong>Put 1%:</strong> <em>murah</em>? <strong>10 tahun</strong> = 10%! <strong><em>Futures</em>:</strong> <em>margin</em>! <em>roll cost</em>!</p>
      <p><strong>Aturan:</strong> <strong><em>total cost</em> &lt; <em>manfaat</em></strong>. <strong><em>Hitung</em>!</strong></p>
      <h3>📈 Overlay vs Rebalancing: Sinergi</h3>
      <p><strong><em>Rebalancing</em>:</strong> <em>jangka panjang</em>, <em>otomatis</em>. <strong><em>Overlay</em>:</strong> <em>jangka pendek</em>, <em>diskresioner</em>.</p>
      <p><strong>Sinergi:</strong> <em>rebalance</em> rutin + <em>overlay</em> saat <em>takut</em>! <strong><em>Keduanya</em></strong>, bukan <em>salah satu</em>.</p>
      <h3>🔍 Due Diligence Overlay (Checklist)</h3>
      <p><strong>KEBUTUHAN:</strong> (1) <em>Risiko</em> teridentifikasi? (2) <em>Urgensi</em>? (3) <em>Alternatif</em>?</p>
      <p><strong>DESAIN:</strong> (4) <em>Instrumen</em> tepat? (5) <em>Biaya</em> wajar? (6) <em>Counterparty</em> kuat?</p>
      <p><strong>GOVERNANCE:</strong> (7) <em>Disetujui</em>? (8) <em>Dimonitor</em>? (9) <em>Exit plan</em>?</p>
      <p><strong>9 cek. <em>Gagal</em> 1 &rarr; <em>jangan</em>.</strong></p>
      <h3>💬 Satu Nasihat Terakhir</h3>
      <p><strong>&ldquo;<em>Hedging</em> yang <em>terbaik</em> adalah yang <em>tidak pernah</em> dibutuhkan &mdash; tapi <em>selalu</em> siap.&rdquo;</strong></p>
      <p><strong>Siap</strong> &gt; <em>sesal</em>.</p>
      <h3>📖 Esai: Overlay yang Bijak</h3>
      <p><strong><em>Derivatif</em></strong> = <strong><em>alat</em></strong>. <strong><em>Alat</em></strong> = <strong><em>netral</em></strong>. <strong><em>Pengguna</em></strong> = <strong><em>penentu</em></strong>.</p>
      <p><strong><em>Gunakan</em></strong> <em>bijak</em>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      <p><strong><em>Teruslah</em></strong> <strong><em>belajar</em></strong> dan <strong><em>berkembang</em></strong>.</p>
      <p><strong><em>Maju</em></strong> <strong><em>terus</em></strong>.</p>
      <p><strong><em>Excellent</em></strong>.</p>
      <p><strong><em>Maju</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Derivatif = spekulasi berbahaya. Institusi konservatif harus hindari.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Derivatif = <strong>alat</strong>; bahaya di <em>tangan</em> &amp; <em>tujuan</em>. Dana pensiun: put <strong>menyelamatkan Rp12M</strong> (2020). <strong>Spekulasi</strong> = naked, leverage liar. <strong>Hedging</strong> = proteksi terukur. Bedakan <em>penggunaan</em>, bukan <em>instrumennya</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Hedge 100% selalu terbaik — hilangkan semua risiko valas.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>h* jarang 100%</strong> (contoh: 56%!). Full hedge = <strong>biaya carry penuh</strong> + hilangkan <em>diversifikasi</em> valas jangka panjang. Hedge ratio = <strong>optimisasi</strong>, bukan tombol on/off.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Derivatif = spekulasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>derivatif = <em>alat</em></strong> (<em>hedging</em>! <em>overlay</em>!). <strong><em>Spekulasi</em> = <em>penggunaan</em></strong>, bukan <em>instrumen</em>. <strong><em>Pisau</em> = <em>dapur</em> atau <em>kriminal</em>?</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Asuransi hangus = rugi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>ekspektasi</em> hangus!</strong> <em>Nilai</em> = <em>ketenangan</em> + <em>proteksi</em> skenario buruk. <strong>Asuransi rumah &ldquo;hangus&rdquo; tiap tahun &mdash; <em>tetap</em> dibeli!</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Harga proteksi saat tenang.</strong> Premi put murah saat VIX rendah (2020 Januari!). Asuransi dibeli <em>sebelum</em> kebakaran — sesudahnya premi 5x lipat. Jadwalkan review overlay tiap kuartal.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Zero-cost collar untuk lock-in gain.</strong> Setelah rally besar: collar gratis mengunci keuntungan. 'Biaya'-nya upside — yang <em>sudah</em> dinikmati sebagian. Psikologi: mudah disetujui dewan.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Sebelum overlay, jawab 4:</strong> (1) <strong><em>Risiko</em> apa?</strong> (2) <strong><em>Biaya</em> berapa?</strong> (3) <strong><em>Alternatif</em></strong> (jual? <em>rebalance</em>?)? (4) <strong><em>Kapan</em> lepas?</strong> <strong>Empat jawab, atau <em>jangan</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Collar</h2>
<p>Hitung lantai, plafon, dan biaya bersih collar.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Collar"}
  hint={"Ubah STRIKE_CALL 110 → 105 (plafon lebih rendah). Premi call naik — bisa zero-cost dengan put lebih jauh!"}
  defaultCode={"# Kalkulator collar: S + P(K1) - C(K2)\nS = 100\nSTRIKE_PUT, PREMI_PUT = 90, 3\nSTRIKE_CALL, PREMI_CALL = 110, 3   # ubah!\n\nlantai = STRIKE_PUT - (PREMI_PUT - PREMI_CALL)\nplafon = STRIKE_CALL - (PREMI_PUT - PREMI_CALL)\nbiaya_bersih = PREMI_PUT - PREMI_CALL\n\nprint(f\"Rugi maksimal : {(1 - lantai/S):.0%} (lantai {lantai})\")\nprint(f\"Cuan maksimal : {(plafon/S - 1):.0%} (plafon {plafon})\")\nprint(f\"Biaya bersih  : {biaya_bersih} ({'ZERO-COST' if biaya_bersih==0 else 'bayar' if biaya_bersih>0 else 'terima premi'})\")\nprint()\nprint(\"Collar = koridor ketenangan. Harga: upside dibatasi.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Hedge Ratio</h2>
<p>Hitung hedge ratio optimal dari korelasi & volatilitas.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Hedge Ratio"}
  hint={"Ubah RHO 0.3 → 0.8 (korelasi kuat). h* naik — hedge lebih besar!"}
  defaultCode={"# Hedge ratio optimal: h* = rho * sigma_aset / sigma_fx\nRHO = 0.3          # korelasi aset vs FX (ubah!)\nSIG_ASET = 0.15\nSIG_FX = 0.08\nEKSPOSUR = 10_000  # Rp jt\nCARRY = 0.02       # biaya hedge/tahun\n\nh = RHO * SIG_ASET / SIG_FX\nh = max(0, min(1, h))\nnilai_hedge = EKSPOSUR * h\nbiaya = nilai_hedge * CARRY\n\nprint(f\"h* = {h:.0%} -> hedge Rp{nilai_hedge:,.0f}jt\")\nprint(f\"Biaya carry: Rp{biaya:,.0f}jt/tahun\")\nprint()\nprint(\"h* jarang 100%: optimisasi, bukan on/off.\")\nprint(\"Review berkala: korelasi berubah!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Lindungi downside, pertahankan upside → <strong>Protective put</strong></h3>
<p><strong>Kenapa:</strong> Asuransi murni.</p>
<p><strong>Contoh nyata:</strong> Pre-krisis, funded ratio.</p>
</div>
<div className="decision-card">
<h3>2. Lock-in gain setelah rally → <strong>Zero-cost collar</strong></h3>
<p><strong>Kenapa:</strong> Gratis, koridor tenang.</p>
<p><strong>Contoh nyata:</strong> Dana pensiun 2020.</p>
</div>
<div className="decision-card">
<h3>3. Butuh income, pasar sideways → <strong>Covered call</strong></h3>
<p><strong>Kenapa:</strong> Premi = income.</p>
<p><strong>Contoh nyata:</strong> Overlay rutin.</p>
</div>
<div className="decision-card">
<h3>4. Eksposur valas material → <strong>Currency overlay (h* optimal)</strong></h3>
<p><strong>Kenapa:</strong> Jinakkan tanpa bunuh diversifikasi.</p>
<p><strong>Contoh nyata:</strong> h* = 56%.</p>
</div>
<div className="decision-card">
<h3>5. Butuh proteksi sementara → <strong>Overlay derivatif; pertahankan SAA</strong></h3>
<p><strong>Kenapa:</strong> Jual = ubah SAA + pajak; overlay = proteksi tanpa ubah.</p>
<p><strong>Contoh nyata:</strong> Put Rp500jt selamatkan Rp12M (2020).</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Derivatif</strong> = alat; <strong>tujuan</strong> menentukan.</li><li><strong>Proteksi</strong> selalu ada harganya.</li><li><strong>h*</strong> = optimisasi, bukan 100%.</li><li><strong>Beli asuransi</strong> saat tenang.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Asuransi yang Menyelamatkan Rp12 M</h2>
<div className="callout">
<p>Dana pensiun Rp50M: beli put 3 bulan premi Rp500jt (Jan 2020). Maret: −35% → rugi terpotong Rp12M. Dewan protes 'hangus jika naik'.</p>
<p><strong>Vignette lanjutan.</strong> Dana pensiun Rp50M: beli <em>put</em> 3 bulan premi Rp500jt (Jan 2020 &mdash; &ldquo;<em>murah</em>&rdquo; saat tenang!). Maret: &minus;35% &rarr; rugi <em>terpotong</em> Rp12M. Dewan protes: &ldquo;Rp500jt <em>hangus</em> jika naik!&rdquo;</p>
<p><strong>Pertanyaan:</strong> (a) Jawab protes dewan. (b) Mengapa <em>put</em>, bukan jual saham? (c) Kapan TIDAK perlu <em>overlay</em>? (d) Hitung <em>breakeven</em>: seberapa sering crash harus terjadi agar premi <em>layak</em>? (e) Bagaimana <em>komunikasi</em> ke dewan <em>sebelum</em> beli?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>&lsquo;Asuransi rumah juga hangus jika tidak kebakaran.&rsquo;</strong> Rp500jt = 1% untuk proteksi <em>funded ratio</em>. <em>Ekspektasi</em> premi hangus; <em>nilainya</em> di skenario buruk.</p>
<p>(d) <strong>Breakeven kasar:</strong> hemat 12M saat crash (1 dari 10 tahun?) vs bayar 0,5M &times; 10 = 5M. <strong>12M &gt; 5M &rarr; <em>layak</em>!</strong> Tapi: <em>probabilitas</em> = <em>penilaian</em> (bukan <em>fakta</em>!). <strong><em>Stress</em>: jika crash 1 dari 20 tahun &rarr; 12M vs 10M &rarr; <em>masih layak</em>!</strong> <strong>Asuransi = <em>bayar</em> untuk <em>skenario</em>, bukan <em>rata-rata</em>.</strong></p>
<p>(e) <strong><em>Komunikasi</em>:</strong> (1) <strong><em>sebelum</em></strong> beli (&ldquo;premi <em>akan</em> hangus jika naik &mdash; <em>itu rencana</em>&rdquo;!); (2) <strong><em>analogi</em></strong> (asuransi rumah!); (3) <strong><em>tertulis</em></strong> (IPS!); (4) <strong><em>evaluasi</em></strong> setelah (<em>proses</em>, bukan <em>hasil</em>!). <strong><em>Edukasi</em> = <em>vaksin</em> protes.</strong></p>
<p>(b) <strong>Jual saham = ubah SAA</strong> (timing!) + biaya + pajak. Put = <strong>pertahankan SAA + proteksi sementara</strong>. Overlay ≠ alokasi.</p>
<p>(c) <strong>Horizon sangat panjang + funded surplus besar</strong> → volatilitas = noise. Atau <strong>premi mahal</strong> (VIX tinggi) → collar/parsial.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Overlay Lanjut</h2>
      <h3>1. Dynamic hedging &mdash; &ldquo;asuransi otomatis&rdquo;</h3>
      <p><strong><em>CPPI</em></strong> (<em>constant proportion</em>): <em>floor</em> + <em>multiplier</em> &times; <em>cushion</em> &rarr; <strong><em>otomatis</em></strong> kurangi risiko saat jatuh! <strong>Pro:</strong> <em>disiplin</em>! <strong>Kontra:</strong> <em>whipsaw</em>! (<em>jual</em> rendah, <em>beli</em> tinggi!). <strong><em>Gap risk</em></strong> (loncat <em>melewati</em> floor!).</p>
      <h3>2. Volatility targeting &mdash; &ldquo;risiko konstan&rdquo;</h3>
      <p><strong>Target</strong> vol 10%: vol <em>naik</em> &rarr; <em>kurangi</em> eksposur! <strong>Pro:</strong> <em>risiko stabil</em>! <strong>Kontra:</strong> <em>trading</em> banyak! <em>telat</em> (vol <em>backward</em>!).</p>
      <h3>3. Counterparty risk &mdash; &ldquo;asuransi bangkrut&rdquo;</h3>
      <p><strong>AIG 2008:</strong> jual <em>proteksi</em> (CDS!) &rarr; <strong><em>gagal bayar</em></strong>! <strong>Pelajaran:</strong> <strong><em>cek</em> penjual asuransi!</strong> (<em>collateral</em>! <em>clearing</em>!). <strong><em>Hedging</em> dengan <em>counterparty</em> lemah = <em>ilusi</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Put kilat</h3>
      <p>50M, put 95%, premi 1%. Crash &minus;35%. Hemat berapa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>Rugi &asymp; 3M vs 17,5M &rarr; <strong>hemat 14,5M</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Collar</h3>
      <p>Beli put 95% (1%) + jual call 110% (1%). &ldquo;Gratis&rdquo;?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>Tidak!</strong> Bayar dengan <em>upside</em> (terbatas 10%!).</p>
      </details>
      <h3>Drill 3 &mdash; Hedge ratio</h3>
      <p>Saham global 50% USD. <em>Hedge ratio</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>25&ndash;50%</strong> (<em>parsial</em>! biaya vs diversifier!).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Overlay = market timing.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> Overlay = <em>pertahankan</em> SAA + proteksi.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Collar: beli put K=90 (premi 3), jual call K=110 (premi 3), S=100. Lantai & plafon?"}
  options={
    ["90 & 110 (zero-cost)",
    "87 & 113",
    "90 & 107",
    "93 & 110"]
  }
  correct={1}
  explanation={"Benar: biaya bersih 0 → lantai 90, plafon 110. Koridor ketenangan gratis (bayar dengan upside)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. ρ=0,3, σ_aset=15%, σ_fx=8%. h*?"}
  options={
    ["100%",
    "56%",
    "30%",
    "0%"]
  }
  correct={1}
  explanation={"Benar: 0,3×15/8 = 0,56. Hedge parsial optimal — bukan on/off."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Portable alpha memindahkan?"}
  options={
    ["Beta ke pasar lain",
    "Alpha manajer A ke eksposur pasar B via derivatif",
    "Risiko ke investor",
    "Fee ke manajer"]
  }
  correct={1}
  explanation={"Benar: pisahkan alpha dari beta asal, 'tempel' ke beta yang dibutuhkan. Syarat: alpha benar-benar portable!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Kapan beli protective put paling murah?"}
  options={
    ["Saat krisis",
    "Saat tenang (VIX rendah)",
    "Tidak pernah",
    "Saat panik"]
  }
  correct={1}
  explanation={"Benar: premi murah saat tenang. Asuransi dibeli sebelum kebakaran — sesudahnya 5x lipat."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Covered call cocok saat?"}
  options={
    ["Pasar bullish kuat",
    "Sideways + butuh income",
    "Krisis",
    "Selalu"]
  }
  correct={1}
  explanation={"Benar: jual call = terima premi, korbankan upside. Optimal saat pasar mendatar."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Dana Rp50M beli put 3 bulan (premi Rp500jt). Crash −35% → hemat Rp12M. Dewan protes 'hangus'. Jawaban TEPAT?"}
  options={
    ["Setuju — jangan beli lagi",
    "'Asuransi rumah juga hangus jika tidak kebakaran' — ekspektasi hangus; nilai di skenario buruk; komunikasikan sebelum beli",
    "Jual saham saja lain kali",
    "Beli put lebih banyak"]}
  correct={1}
  explanation={"Benar: overlay = asuransi. Premi 'hangus' adalah rencana (ekspektasi), nilainya di skenario buruk (hemat Rp12M). Kunci: komunikasikan sebelum beli + tertulis di IPS."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Equity overlay</strong>: put (asuransi), call (income), collar (koridor, zero-cost).</li>
<li><strong>Currency overlay</strong>: h* = ρ×σ_A/σ_FX; hedge parsial optimal.</li>
<li><strong>Portable alpha</strong>: pindahkan skill via futures; completion melengkapi bias.</li>
<li><strong>Prinsip</strong>: derivatif = alat; proteksi ada harganya; beli saat tenang.</li>
<li><strong>Overlay ≠ alokasi</strong>: lindungi sementara tanpa ubah SAA.</li>
<li><strong>Aturan</strong>: 'asuransi rumah juga hangus jika tidak kebakaran'.</li>

<li><strong>Equity overlay:</strong> proteksi sementara; pertahankan SAA.</li>
<li><strong>Currency:</strong> pisahkan keputusan; hedge parsial.</li>
<li><strong>Portable alpha:</strong> pinjam beta; hanya jika paham.</li>
<li><strong>Kapan TIDAK pakai:</strong> horizon panjang; biaya &gt; manfaat; tidak paham.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c8-equity-portfolio" className="btn btn-secondary btn-sm">← PM-C8</Link>
        <Link href="/learn/pm-c10-trading-execution" className="btn btn-primary btn-sm">PM-C10 →</Link>
      </div>
    </div>
  );
}

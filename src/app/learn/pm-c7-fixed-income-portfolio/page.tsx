"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC7FixedIncomePortfolioPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C7 — Portfolio Management</span>
        <h1 className="display-title">Fixed Income Portfolio:<br/>Imunisasi & Strategi Aktif</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Janji Rp1 Miliar 10 Tahun Lagi</a></li>
<li><a href="#imunisasi">Imunisasi</a></li>
<li><a href="#struktur">Ladder/Barbell/Bullet</a></li>
<li><a href="#aktif">Strategi Aktif</a></li>
<li><a href="#sintesis">Sintesis: Kompas Kewajiban</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Beasiswa Rp1M</a></li>
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
<li>Menjelaskan 3 teknik imunisasi dan syaratnya.</li>
<li>Membedakan ladder, barbell, bullet.</li>
<li>Menjelaskan strategi aktif obligasi.</li>
<li>Menghitung risiko reinvestment vs price.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Janji Rp1 Miliar 10 Tahun Lagi</h2>
      <div className="story">
        <p><strong>Yayasan beasiswa</strong> harus membayar <strong>Rp1 miliar</strong> dalam <strong>10 tahun</strong>. Bendahara membeli obligasi <strong>10 tahun</strong> — 'kan jatuh temponya pas?' <strong>2022</strong>: rate naik 3% → harga obligasi <strong>anjlok 25%</strong>. Panik? Tidak perlu — jika <em>dipegang sampai jatuh tempo</em>, Rp1M tetap terbayar (kupon reinvestasi bahkan <em>lebih tinggi</em>!).</p>
<p>Twist-nya: <strong>risiko harga</strong> (rate naik → harga turun) dan <strong>risiko reinvestasi</strong> (rate turun → kupon reinvest rendah) <strong>saling meniadakan</strong> <em>tepat di duration</em>! Inilah <strong>imunisasi</strong> — keajaiban matematika obligasi. Lesson ini: janji yang terkunci.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="imunisasi">Imunisasi — Kunci Matematika</h2>
<p><strong>Definisi.</strong> <strong>Imunisasi</strong>: strukturkan aset agar <strong>kewajiban terpenuhi apapun pergerakan rate</strong> (paralel). <strong>3 teknik</strong>: (1) <strong>Cash-flow matching</strong> (dedikasi): arus kas aset = kewajiban — <em>paling aman, paling mahal</em>; (2) <strong>Duration matching</strong>: Macaulay duration aset = horizon kewajiban; (3) <strong>Horizon matching</strong>: kombinasi (dekat: cash-flow, jauh: duration).</p>
<p><strong>Syarat</strong>: <em>rebalancing</em> berkala (duration meleset seiring waktu!); hanya lindungi <strong>parallel shift</strong>.</p>
<Tex math={String.raw`D_{Mac} = \frac{\sum t \cdot PV(CF_t)}{P} \quad;\quad \text{Imunisasi: } D_{aset} = H_{kewajiban}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`D_{Mac}`} />: Macaulay duration (rata-rata tertimbang waktu arus kas)</li>
<li>Price risk vs reinvestment risk <strong>saling hapus</strong> tepat di <Tex math={String.raw`D_{Mac}`} /></li>
<li>Setelah rate berubah: <strong>rebalance</strong> (duration bergeser!)</li>
<li>Critical: hanya untuk <strong>parallel shift</strong>; twist butuh key-rate duration</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Imunisasi seperti <strong>jungkat-jungkit seimbang</strong>: price risk (kiri) vs reinvestment risk (kanan). Tepat di titik tumpu (duration) = <strong>seimbang apapun guncangan</strong> (rate). Tapi jungkat-jungkit <em>bergeser</em> seiring waktu → <strong>sesuaikan tumpu</strong> (rebalance!).</p>
<p><strong>Kapan dipakai:</strong> Kewajiban tunggal/majemuk yang pasti: pensiun, yayasan, asuransi.</p>
<p><strong>Pendalaman intuisi &mdash; imunisasi = &ldquo;kunci&rdquo; kewajiban.</strong> Punya kewajiban Rp1M 10 tahun lagi? <strong>Cocokkan <em>duration</em> aset = 10</strong> &rarr; jika suku bunga naik, <em>harga</em> obligasi turun TAPI <em>reinvestasi</em> kupon naik &mdash; <strong>keduanya <em>impas</em>!</strong> (&ldquo;Rp1M tetap terpenuhi!&rdquo;). <strong>Syarat:</strong> <em>parallel shift</em> (seluruh kurva geser sama!) + <em>rebalance</em> (duration <em>berubah</em> dengan waktu!). <strong>Bukan <em>sihir</em></strong> &mdash; melainkan <em>matematika</em> yang butuh <em>disiplin</em>.</p><details className="worked">
<summary>📐 Contoh: Beasiswa Rp1M (klik untuk buka)</summary>
<p>Kewajiban Rp1M dalam 10 tahun. Beli obligasi 10 tahun <strong>par, kupon = yield</strong> → D_Mac ≈ <strong>8,5 tahun</strong> (bukan 10! kupon mempercepat).</p>
<p><strong>Rate +3%</strong>: harga −25% (price risk!), tapi kupon reinvest <strong>+3%</strong> → di tahun ke-8,5 keduanya <strong>impas</strong>; di tahun 10: <strong>Rp1M terpenuhi</strong> ✓.</p>
<p><strong>Kesalahan bendahara</strong>: pikir 'jatuh tempo = aman' — benar <em>kebetulan</em> (kupon kecil). Imunisasi <em>presisi</em> = match <strong>duration</strong>, bukan maturity!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Imunisasi &mdash; angka lengkap</summary>
<p><strong>Soal:</strong> kewajiban Rp1M 10 tahun. Obligasi A: 5 tahun, B: 15 tahun, yield 5%. Bagaimana imunisasi?</p>
<p><strong>Langkah 1 &mdash; PV kewajiban:</strong> 1M / 1,05^10 = <strong>Rp614jt</strong>.</p>
<p><strong>Langkah 2 &mdash; bobot:</strong> D_target = 10 = w&times;5 + (1&minus;w)&times;15 &rarr; w = <strong>0,5</strong> (50% A, 50% B!).</p>
<p><strong>Langkah 3 &mdash; nilai:</strong> 307jt A + 307jt B = 614jt (&check;).</p>
<p><strong>Jika yield &rarr; 8%:</strong> harga turun, tapi <em>reinvestasi</em> naik &rarr; <strong>Rp1M tetap!</strong> (&plusmn; kecil!). <strong>Tapi:</strong> duration <em>berubah</em> &rarr; <strong><em>rebalance</em> tahunan wajib!</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kapan imunisasi GAGAL</summary>
<p><strong>Soal:</strong> tiga skenario: (1) <em>parallel shift</em> +3%; (2) <em>twist</em> (pendek +1%, panjang +5%); (3) tidak <em>rebalance</em> 5 tahun. Mana yang gagal?</p>
<p><strong>(1) Berhasil</strong> (&asymp;! &mdash; <em>price</em> vs <em>reinvestment</em> impas!).</p>
<p><strong>(2) GAGAL</strong> &mdash; imunisasi <em>hanya</em> lindungi <em>parallel</em>! <em>Twist</em> = <em>bentuk</em> berubah &rarr; <em>mismatch</em>!</p>
<p><strong>(3) GAGAL</strong> &mdash; duration <em>drift</em> (10 &rarr; 7!) &rarr; <em>tidak cocok</em> lagi!</p>
<p><strong>Pelajaran:</strong> imunisasi = <strong><em>kondisional</em></strong> (parallel! rebalance!). <strong>Komunikasikan <em>batasnya</em></strong> &mdash; jangan janji &ldquo;aman total&rdquo;!</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Cash flow matching vs imunisasi</summary>
<p><strong>Soal:</strong> kewajiban Rp100jt/tahun 10 tahun. Bandingkan <em>cash flow matching</em> vs <em>imunisasi duration</em>.</p>
<p><strong>Matching:</strong> beli obligasi yang <em>jatuh tempo</em> tiap tahun 100jt &rarr; <strong><em>persis</em></strong> (tidak peduli suku bunga!). <strong>Biaya:</strong> <em>mahal</em> (butuh banyak obligasi! <em>tidak fleksibel</em>!).</p>
<p><strong>Imunisasi:</strong> cocokkan <em>duration</em> &rarr; <strong><em>murah</em></strong> (sedikit obligasi!) tapi <strong><em>risiko</em></strong> (<em>non-parallel</em>! <em>rebalance</em>!).</p>
<p><strong>Pilih:</strong> kewajiban <em>pasti</em> &amp; <em>kaku</em> &rarr; <strong>matching</strong>; <em>fleksibel</em> &amp; <em>hemat</em> &rarr; <strong>imunisasi</strong>. <strong><em>Tradeoff</em> biaya vs risiko.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Match maturity&rdquo;.</strong> <strong>SALAH.</strong> Imunisasi = <em>duration</em>, bukan <em>maturity</em>! (Obligasi 10 tahun kupon = duration &asymp; 8,5!). Soal yang memberi &ldquo;obligasi 10 tahun untuk kewajiban 10 tahun&rdquo; &rarr; <strong>belum tentu</strong> terimunisasi &mdash; <strong>hitung <em>duration</em>!</strong></p>
</div>

<PlotlyChart
  data={[{x: [0,1,2,3,4,5], y: [614,500,400,320,250,200], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Harga obligasi (rate naik)"}, {x: [0,1,2,3,4,5], y: [614,700,800,900,950,1000], type: "scatter", mode: "lines+markers", marker: {color: "#2ca02c"}, name: "Nilai reinvestasi"}]}
  title={"Imunisasi: harga turun, reinvestasi naik — impas di duration"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Rp jt"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Merah = harga obligasi (jatuh saat rate naik!); hijau = nilai <em>reinvestasi</em> kupon (naik!).</p>
<p><strong>Interpretasi:</strong> keduanya <strong><em>bertemu</em> di tahun ke&minus;10</strong> (&asymp; Rp1M!) &mdash; <strong><em>impas</em></strong>! Inilah <em>sihir</em> imunisasi: <em>price risk</em> vs <em>reinvestment risk</em> <strong><em>saling meniadakan</em></strong> di <em>horizon duration</em>. <strong>Sebelum/sesudah</strong> itu = <em>tidak impas</em>! &mdash; makanya <em>duration</em> harus <em>persis</em>.</p>
</div>
<h2 id="struktur">Ladder, Barbell, Bullet — Arsitektur</h2>
<p><strong>Definisi.</strong> <strong>Ladder</strong>: jatuh tempo <em>merata</em> (1,2,3...10 thn) — reinvestasi rutin, <em>risiko reinvestment rendah</em>. <strong>Bullet</strong>: fokus di <em>satu</em> titik (10 thn) — untuk kewajiban tunggal. <strong>Barbell</strong>: ujung <em>pendek + panjang</em> — likuiditas + yield; <em>convexity tinggi</em> (untung saat volatilitas!).</p>
<p><strong>Pilih</strong>: kewajiban tunggal → bullet/imunisasi; arus kas rutin → ladder; view volatilitas → barbell.</p>
<p><strong>Kepribadian/intuisi:</strong> Ladder seperti <strong>tangga</strong>: tiap anak tangga (jatuh tempo) memberi pijakan kas rutin. Barbell seperti <strong>barbel</strong>: berat di dua ujung — stabil di tengah? Tidak — <em>fleksibel</em>: ujung pendek = kas cepat, ujung panjang = yield.</p>
<p><strong>Kapan dipakai:</strong> Ladder: dana darurat institusi, arus kas rutin. Barbell: antisipasi volatilitas rate.</p>
<p><strong>Pendalaman intuisi &mdash; tiga struktur, tiga filsafat.</strong> <strong><em>Bullet</em></strong> (tengah!): <em>konsentrasi</em> di satu tenor &mdash; <em>sederhana</em>, tapi <em>terekspos</em> ke <em>bentuk</em> kurva. <strong><em>Barbell</em></strong> (ujung!): pendek + panjang &mdash; <em>fleksibel</em> (<em>likuiditas</em>! <em>oportunistik</em>!), tapi <em>convexity</em> beda. <strong><em>Ladder</em></strong> (tangga!): merata &mdash; <em>diversifikasi jatuh tempo</em> + <em>arus kas rutin</em>. <strong>Pilih sesuai <em>tujuan</em>:</strong> imunisasi &rarr; <em>bullet</em>; likuiditas &rarr; <em>barbell/ladder</em>; <em>tidak tahu</em> &rarr; <em>ladder</em> (<em>default</em> bijak!).</p><details className="worked">
<summary>📐 Contoh: Ladder Rp500jt (klik untuk buka)</summary>
<p>Rp500jt dibagi 5: Rp100jt × (1,2,3,4,5 tahun). Tiap tahun <strong>Rp100jt jatuh tempo</strong> → belanjakan atau <strong>reinvestasi ke 5 tahun</strong> (ladder berjalan).</p>
<p><strong>Rate naik</strong>: reinvestasi di yield <em>lebih tinggi</em> ✓ (lawan reinvestment risk). <strong>Rate turun</strong>: 4 rung masih terkunci yield lama ✓.</p>
<p><strong>Ladder = dollar-cost averaging-nya obligasi.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Bullet vs barbell &mdash; kapan menang</summary>
<p><strong>Soal:</strong> ekspektasi: kurva <em>steepen</em> (pendek turun, panjang naik). Pilih <em>bullet</em> (10 tahun) atau <em>barbell</em> (2 + 20 tahun)?</p>
<p><strong>Analisis:</strong> <em>steepen</em> = tengah <em>relatif</em> stabil, ujung <em>bergerak</em>. <strong><em>Bullet</em> (tengah)</strong> = <em>terlindungi</em> dari <em>steepen</em>! <strong><em>Barbell</em></strong> = <em>terekspos</em> (panjang <em>jatuh</em>!).</p>
<p><strong>Pilih: <em>bullet</em>.</strong> <strong>Aturan umum:</strong> <em>steepen</em> &rarr; <strong>bullet</strong>; <em>flatten</em> &rarr; <strong>barbell</strong>; <em>tidak tahu</em> &rarr; <strong>ladder</strong>. <strong>Struktur = <em>taruhan</em> pada <em>bentuk</em> kurva.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Ladder &mdash; &ldquo;autopilot&rdquo; obligasi</summary>
<p><strong>Soal:</strong> Rp500jt, <em>ladder</em> 5 tahun (100jt tiap jatuh tempo 1&ndash;5 tahun). Apa yang terjadi tiap tahun?</p>
<p><strong>Tiap tahun:</strong> 100jt <em>jatuh tempo</em> &rarr; <strong><em>reinvest</em></strong> ke 5 tahun! &rarr; <em>ladder</em> <em>berjalan</em> terus.</p>
<p><strong>Keunggulan:</strong> (1) <strong><em>arus kas rutin</em></strong> (100jt/tahun!); (2) <strong><em>diversifikasi</em></strong> suku bunga (<em>rata-rata</em>!); (3) <strong><em>otomatis</em></strong> (tidak perlu <em>ramal</em>!). <strong>Cocok:</strong> pensiunan butuh <em>income</em>! <strong><em>Ladder</em> = <em>autopilot</em> yang bijak.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Imunisasi = &ldquo;aman total&rdquo;.</strong> <strong>SALAH.</strong> Hanya untuk <em>parallel shift</em>! <em>Twist</em>/<em>butterfly</em> = <em>tidak terlindungi</em>. Dan butuh <em>rebalance</em>! Soal yang bertanya &ldquo;risiko imunisasi&rdquo; &rarr; <strong>jawab: <em>non-parallel</em> + <em>drift</em>.</strong></p>
</div>
<PlotlyChart
  data={[{x: ["1thn","2thn","3thn","4thn","5thn"], y: [100,100,100,100,100], type: "bar", marker: {color: "#2a7de1"}, name: "ladder"}, {x: ["1thn","2thn","3thn","4thn","5thn"], y: [250,0,0,0,250], type: "bar", marker: {color: "#e8a838"}, name: "barbell"}]}
  title={"Ladder vs barbell: distribusi jatuh tempo (Rp jt)"}
  layout={{xaxis: {title: "Jatuh tempo"}, yaxis: {title: "Rp jt"}, barmode: "group", showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = ladder (merata); kuning = barbell (ujung-ujung).</p>
<p><strong>Interpretasi:</strong> Ladder: <strong>arus kas tiap tahun</strong> — reinvestasi disiplin. Barbell: <strong>likuiditas</strong> (1 thn) + <strong>yield</strong> (5 thn) + <strong>convexity</strong> lebih tinggi (menang saat rate bergejolak). Pilih sesuai <em>kebutuhan kas</em>, bukan tebakan rate.</p>
</div>
<h2 id="aktif">Strategi Aktif — Berburu di Pasar Obligasi</h2>
<p><strong>Definisi.</strong> <strong>Rate anticipation</strong>: ubah duration (panjang saat rate turun). <strong>Spread strategies</strong>: rotasi <em>sektor/kualitas</em> (IG ↔ HY) saat spread murah/mahal. <strong>Credit rotation</strong>: naik-turun kualitas mengikuti siklus.</p>
<p><strong>Kunci</strong>: aktif = <strong>tracking error</strong> vs benchmark (PM-B5!) — ukur dengan <strong>information ratio</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Strategi aktif obligasi seperti <strong>berselancar</strong>: rate anticipation = membaca ombak (siklus); spread = memilih papan (sektor murah). Peselancar hebat <em>jatuh juga</em> — ukurannya <strong>konsistensi</strong> (IR), bukan satu ombak besar.</p>
<p><strong>Kapan dipakai:</strong> Mandat aktif dengan benchmark jelas; disiplin tracking error.</p>
<p><strong>Pendalaman intuisi &mdash; manajemen aktif obligasi = &ldquo;bertaruh pada kurva&rdquo;.</strong> <strong><em>Rate anticipation</em>:</strong> &ldquo;suku bunga turun&rdquo; &rarr; <em>panjangkan duration</em>! <strong><em>Spread</em>:</strong> &ldquo;spread menyempit&rdquo; &rarr; <em>overweight</em> kredit! <strong><em>Kurva</em>:</strong> &ldquo;curam menanjak&rdquo; &rarr; <em>bullet vs barbell</em>! <strong>Kebenaran pahit:</strong> <em>sebagian besar</em> manajer aktif obligasi <strong><em>gagal</em></strong> mengalahkan <em>benchmark</em> setelah biaya! <strong>Aktif = <em>hanya</em> jika <em>keunggulan terbukti</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Rotasi kredit (klik untuk buka)</summary>
<p>Spread HY 800bps (krisis, historis 500) → <strong>murah</strong> → overweight HY.</p>
<p>Pemulihan: spread → 450bps → capital gain + kupon tinggi = <strong>outperform 5%</strong>.</p>
<p><strong>Disiplin</strong>: kembali netral saat spread &lt; 400 (mahal). Tanpa aturan jual = <strong>serakah</strong> (PM-C6!).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Rate anticipation &mdash; hitung taruhan</summary>
<p><strong>Soal:</strong> &ldquo;yakin&rdquo; suku bunga turun 1%. Portofolio 100jt, duration 5. Berapa <em>keuntungan</em> jika benar? <em>Rugi</em> jika salah (+1%)?</p>
<p><strong>Benar (&minus;1%):</strong> +5 &times; 1% = <strong>+5jt</strong>.</p>
<p><strong>Salah (+1%):</strong> &minus;5 &times; 1% = <strong>&minus;5jt</strong>.</p>
<p><strong>Pertanyaan:</strong> <em>seberapa yakin</em>? Jika 60% &rarr; ekspektasi = 0,6&times;5 &minus; 0,4&times;5 = <strong>+1jt</strong> (<em>kecil</em>!). <strong>Pelajaran:</strong> <em>taruhan suku bunga</em> = <em>simetris</em> &mdash; butuh <em>keyakinan tinggi</em> untuk <em>berarti</em>. <strong>Kebanyakan &ldquo;yakin&rdquo; = 55% &rarr; <em>tidak layak</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Spread trade &mdash; &ldquo;panen&rdquo; ketakutan</summary>
<p><strong>Soal:</strong> spread IG 250bps (vs rata-rata 150bps). <em>Overweight</em> kredit? Analisis.</p>
<p><strong>Pro:</strong> spread <em>lebar</em> = <em>kompensasi</em> tinggi! Jika <em>mean-revert</em> ke 150bps &rarr; <strong><em>capital gain</em></strong> + kupon tinggi!</p>
<p><strong>Kontra:</strong> spread lebar = <strong><em>pasar takut</em></strong> (resesi? <em>default</em>?). Jika <em>melebar</em> ke 400bps &rarr; <strong><em>rugi besar</em></strong>!</p>
<p><strong>Keputusan:</strong> <strong><em>hanya</em> jika</strong> fundamental <em>kuat</em> (analisis kredit!) &amp; <em>horizon</em> panjang. <strong><em>Spread</em> = <em>pedang bermata dua</em>.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Kewajiban sebagai Kompas</h2>
      <p>Imunisasi, struktur, aktif = <strong>satu kompas</strong>:</p>
      <ol>
        <li><strong>KUNCI (imunisasi):</strong> cocokkan <em>duration</em> &mdash; <strong><em>kewajiban</em> = <em>benchmark</em></strong>.</li>
        <li><strong>BENTUK (struktur):</strong> <em>bullet/barbell/ladder</em> &mdash; sesuai <em>tujuan</em>.</li>
        <li><strong>TARUHAN (aktif):</strong> <em>hanya</em> jika <em>keunggulan terbukti</em>.</li>
      </ol>
      <p><strong>Obligasi = <em>janji</em>. Kelola <em>janji</em> dengan <em>janji</em> yang <em>cocok</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Aktif vs pasif obligasi&rdquo;</h3>
      <p><strong>Aktif:</strong> &ldquo;Obligasi = <em>tidak efisien</em> (OTC! <em>illiquid</em>!) &rarr; <em>peluang</em> untuk aktif!&rdquo;</p>
      <p><strong>Pasif:</strong> &ldquo;Data: <strong>70&ndash;80% manajer obligasi <em>kalah</em></strong> setelah biaya! <em>Inefisiensi</em> &ne; <em>eksploitasi</em> (biaya transaksi <em>memakan</em>!).&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>default</em> = pasif</strong> (index!). Aktif = <em>hanya</em> untuk <em>niche</em> (<em>high yield</em>! <em>EM</em>!) dengan <em>keunggulan terbukti</em>. <strong>Biaya = <em>kepastian</em>.</strong></p>
      <h3>🧪 Eksperimen: Duration-mu</h3>
      <p><strong>Hitung <em>duration</em></strong> portofolio obligasimu. <strong>Bandingkan</strong> dengan <em>horizon</em> kebutuhanmu. <strong><em>Mismatch</em>?</strong> &rarr; <em>kamu</em> bertaruh pada suku bunga <em>tanpa sadar</em>! <strong><em>Sadar</em> atau <em>sesuaikan</em>.</strong></p>
      <h3>📰 Studi Kasus: Orange County (1994)</h3>
      <p>Bendahara Citron: <em>leverage</em> + <em>derivatif</em> untuk &ldquo;return lebih&rdquo;. Suku bunga naik &rarr; <strong><em>bangkrut</em> USD 1,7M</strong>!</p>
      <p><strong>Pelajaran:</strong> <strong>dana publik &ne; <em>hedge fund</em>.</strong> <em>Leverage</em> + <em>suku bunga</em> = <em>bom</em>. <strong><em>Kewajiban</em> = <em>konservatif</em>.</strong> Jangan <em>berjudi</em> dengan <em>uang rakyat</em> (atau <em>pensiunmu</em>!).</p>
      <h3>📖 Kamus Istilah (Referensi Cepat)</h3>
      <p><strong>DURASI:</strong> <em>Macaulay</em> (rata-rata <em>waktu</em>!), <em>modified</em> (sensitivitas <em>harga</em>!), <em>effective</em> (untuk <em>opsi</em>!), <em>key rate</em> (per <em>titik</em>!), <em>spread duration</em> (ke <em>spread</em>!).</p>
      <p><strong>STRUKTUR:</strong> <em>bullet</em> (tengah!), <em>barbell</em> (ujung!), <em>ladder</em> (tangga!).</p>
      <p><strong>STRATEGI:</strong> <em>imunisasi</em> (kunci!), <em>cash flow matching</em> (persis!), <em>contingent</em> (jaring!), <em>aktif</em> (taruhan!).</p>
      <p><strong>Hafalkan</strong> &mdash; ini <em>bahasa</em> manajer obligasi.</p>
      <h3>🏢 LDI untuk Dana Pensiun (Praktik)</h3>
      <p><strong>Langkah 1 &mdash; ukur kewajiban:</strong> <em>projected benefit obligation</em> (PBO!) + <em>duration</em> (15 tahun!). <strong>Ini = <em>benchmark</em> sejati.</strong></p>
      <p><strong>Langkah 2 &mdash; <em>hedging portfolio</em>:</strong> obligasi <em>duration</em> 15 &rarr; <em>netralkan</em> risiko suku bunga kewajiban. <strong>Tujuan: <em>jangan</em> rugi saat rate berubah.</strong></p>
      <p><strong>Langkah 3 &mdash; <em>return-seeking</em>:</strong> sisa aset &rarr; <em>kejar</em> return untuk <em>tutup defisit</em>. <strong>Tujuan: <em>tumbuh</em>.</strong></p>
      <p><strong>Langkah 4 &mdash; <em>glide path</em>:</strong> saat <em>funded ratio</em> naik &rarr; <strong><em>geser</em> ke hedging</strong> (<em>derisk</em>!). <strong>Menang = <em>amankan</em>, bukan <em>tambah</em>.</strong></p>
      <p><strong>Kesalahan fatal:</strong> &ldquo;kejar return&rdquo; dengan 80% saham saat <em>defisit</em> &rarr; <strong>2008 = <em>bencana</em></strong>. <strong>Kewajiban dulu, <em>baru</em> return.</strong></p>
      <h3>🔬 Studi Kasus: UK Pension Crisis (2022)</h3>
      <p>2022: gilt yield <em>meledak</em> &rarr; dana pensiun UK dengan <em>LDI leverage</em> &rarr; <strong><em>margin call</em> massal</strong> &rarr; jual paksa gilt &rarr; yield <em>makin</em> naik &rarr; <strong><em>spiral</em></strong>! Bank of England <em>intervensi</em>.</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Leverage</em> + LDI = <em>bom</em></strong>; (2) <strong><em>likuiditas</em> = <em>nyawa</em></strong> (<em>collateral</em>!); (3) <strong><em>hedge</em> sempurna <em>teori</em> &ne; <em>praktik</em></strong>. <strong>LDI = <em>benar</em>, <em>leverage</em> = <em>salah</em>.</strong></p>
      <h3>💡 Prinsip Abadi Fixed Income</h3>
      <p><strong>(1) Kewajiban = <em>kompas</em>.</strong> (2) <strong>Duration = <em>substansi</em>.</strong> (3) <strong>Imunisasi = <em>proses</em>.</strong> (4) <strong>Struktur = <em>tujuan</em>.</strong> (5) <strong>Aktif = <em>terbukti</em>.</strong></p>
      <p><strong>Lima prinsip. Tempel di dinding.</strong></p>
      <h3>🎓 Ujian Akhir Lesson (Refleksi)</h3>
      <p><strong>Pertanyaan 1:</strong> Kewajiban 10 tahun. Obligasi 10 tahun (duration 8,5). <em>Terimunisasi</em>?</p>
      <p><strong>Pertanyaan 2:</strong> Ekspektasi <em>steepen</em>. Pilih <em>bullet</em> atau <em>barbell</em>?</p>
      <p><strong>Pertanyaan 3:</strong> Imunisasi <em>gagal</em> saat apa? (2 kondisi!)</p>
      <p><strong>Jika bisa jawab ketiganya &rarr; <em>lulus</em>.</strong></p>
      <h3>🔗 Menghubungkan ke Lesson Lain</h3>
      <p><strong>Ke PM-B5 (Fixed Income):</strong> <em>duration/convexity</em> = <em>fondasi</em> &mdash; <em>dipelajari</em> di sana!</p>
      <p><strong>Ke PM-C3 (Alokasi):</strong> LDI = <em>alokasi berbasis kewajiban</em> &mdash; <em>konteks</em> di sana!</p>
      <p><strong>Ke PM-C1 (IPS):</strong> <em>kewajiban</em> = <em>input</em> IPS institusi!</p>
      <p><strong>Obligasi = <em>janji</em>. Pahami <em>janjimu</em>.</strong></p>
      <h3>📊 Data Corner: 2022 &mdash; Tahun Obligasi Terburuk</h3>
      <p><strong>Data:</strong> 2022: US Aggregate Bond <strong>&minus;13%</strong> (<em>terburuk</em> sepanjang sejarah!). 60/40: <strong>&minus;16%</strong>.</p>
      <p><strong>Penyebab:</strong> inflasi &rarr; Fed <em>hiking</em> agresif &rarr; <em>keduanya</em> jatuh (korelasi +0,5!). <strong>&ldquo;Obligasi = <em>pelindung</em>&rdquo; = <em>gagal</em>.</strong></p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Inflasi</em> = musuh <em>keduanya</em></strong>; (2) <strong>diversifikasi <em>butuh</em> aset <em>ketiga</em></strong> (kas! komoditas!); (3) <strong><em>duration</em> panjang = <em>risiko</em></strong> saat inflasi. <strong>2022 = <em>wake-up call</em>.</strong></p>
      <h3>🧪 Eksperimen: Stres Portofoliomu</h3>
      <p><strong>Uji 3 skenario:</strong> (1) Rate +3% (<em>parallel</em>!); (2) Inflasi 8% (2022!); (3) Resesi (2008!).</p>
      <p><strong>Hitung</strong> dampak ke portofoliomu. <strong><em>Selamat</em> di ketiganya?</strong> Jika <em>tidak</em> &rarr; <strong><em>sesuaikan</em></strong> (duration! diversifikasi! kas!). <strong>Stres = <em>vaksin</em>.</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;Obligasi = membosankan&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;Obligasi = <em>kupon</em> + <em>tidur</em>. <em>Membosankan</em>! Saham = <em>seru</em>!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;2008: saham &minus;37%, obligasi <strong>+5%</strong>! 2020: <em>rebalance</em> dari obligasi ke saham = <strong><em>cuan</em></strong>! <strong><em>Membosankan</em> = <em>bertahan</em>.</strong> Portofolio <em>seru</em> = portofolio yang <em>dijual panik</em>.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>Bosan</em> = <em>fitur</em>, bukan <em>bug</em>.</strong> Obligasi = <em>jangkar</em> + <em>amunisi</em> (<em>rebalance</em>!). <strong>Hargai <em>kebosanan</em>.</strong></p>
      <h3>📖 Pendalaman Mendalam</h3>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi jatuh tempo 10 tahun = imunisasi kewajiban 10 tahun.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Yang harus match = <strong>Macaulay duration</strong> (≈ 8,5 thn untuk kupon bond!), bukan maturity. 'Kebetulan aman' ≠ imunisasi. Dan duration <strong>bergeser</strong> → butuh <strong>rebalancing berkala</strong>. Imunisasi = proses, bukan sekali beli.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi = aman, tidak perlu strategi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 2022: obligasi global <strong>−16%</strong> (terburuk sepanjang sejarah!). Risiko rate, kredit, likuiditas = nyata. 'Aman' hanya jika <strong>dipegang sampai maturity</strong> (dan penerbit tidak default!). Portofolio obligasi butuh <em>strategi</em> sama seriusnya dengan saham.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi panjang = untuk kewajiban panjang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>duration</em> = yang dicocokkan</strong>, bukan <em>maturity</em>! Obligasi 10 tahun kupon 8% = duration &asymp; 7! <strong>Butuh <em>kombinasi</em></strong> untuk duration tepat. <strong><em>Maturity</em> = <em>label</em>; <em>duration</em> = <em>substansi</em>.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Imunisasi sekali, selesai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> duration <em>berubah</em> (waktu! yield!) &rarr; <strong><em>rebalance</em> rutin wajib!</strong> Tanpa rebalance = <em>mismatch</em> diam-diam. <strong>Imunisasi = <em>proses</em>, bukan <em>kejadian</em>.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Match duration, bukan maturity.</strong> Tiap kewajiban: hitung horizon → cari D_Mac aset yang sama → rebalance tahunan. Satu baris di IPS menghemat bencana.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Ladder untuk kas rutin, bullet untuk janji tunggal.</strong> Jangan pakai barbell jika butuh kas tiap tahun — arsitektur mengikuti <em>kebutuhan</em>, bukan <em>ramalan</em>.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist imunisasi (5 menit):</strong> (1) <strong>Duration = horizon?</strong> (2) <strong>PV aset = PV kewajiban?</strong> (3) <strong>Jadwal <em>rebalance</em>?</strong> (4) <strong><em>Batas</em> dikomunikasikan?</strong> (parallel saja!). <strong>Empat cek sebelum janji &ldquo;aman&rdquo;.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Pemeriksa Imunisasi</h2>
<p>Cek apakah portofolio obligasi terimunisasi terhadap kewajiban.</p>
<PyodideLab
  title={"Lab 1 — Pemeriksa Imunisasi"}
  hint={"Ubah DUR_ASET 8.5 → 5.0 (terlalu pendek). Status berubah — rebalance dibutuhkan!"}
  defaultCode={"# Pemeriksa imunisasi: D_aset vs horizon kewajiban\nDUR_ASET = 8.5    # Macaulay duration portofolio (ubah!)\nHORIZON = 10      # tahun kewajiban\nTOL = 0.5\n\nselisih = abs(DUR_ASET - HORIZON)\nprint(f\"Duration aset : {DUR_ASET} thn\")\nprint(f\"Horizon       : {HORIZON} thn\")\nprint(f\"Selisih       : {selisih:.1f} thn\")\nif selisih <= TOL:\n    print(\"TERIMUNISASI: price risk ~ reinvestment risk.\")\nelse:\n    arah = \"terlalu PENDEK (reinvestment risk dominan)\" if DUR_ASET < HORIZON else \"terlalu PANJANG (price risk dominan)\"\n    print(f\"BELUM: duration {arah}. Rebalance!\")\nprint(\"\\nImunisasi melindungi dari PARALLEL shift saja.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Pembangun Ladder</h2>
<p>Bangun ladder dan simulasikan arus kas tahunannya.</p>
<PyodideLab
  title={"Lab 2 — Pembangun Ladder"}
  hint={"Ubah N_RUNG 5 → 10. Arus kas makin halus — ladder berjalan!"}
  defaultCode={"# Pembangun ladder obligasi\nTOTAL = 500  # Rp jt\nN_RUNG = 5   # jumlah rung (ubah!)\nYIELD = 0.07\n\nper_rung = TOTAL / N_RUNG\nprint(f\"Ladder {N_RUNG} rung x Rp{per_rung:.0f}jt @ {YIELD:.0%}\")\nprint()\nkas_tahunan = 0\nfor t in range(1, N_RUNG+1):\n    jatuh = per_rung\n    kupon = per_rung * YIELD\n    kas_tahunan += kupon\n    print(f\"  Tahun {t}: jatuh tempo Rp{jatuh:.0f}jt + kupon Rp{kupon:.0f}jt\")\nprint()\nprint(f\"Arus kas kupon/tahun: Rp{kas_tahunan:.0f}jt\")\nprint(\"Tiap jatuh tempo: belanjakan ATAU reinvestasi ke rung terjauh.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Kewajiban pasti tunggal → <strong>Imunisasi (duration match) / bullet</strong></h3>
<p><strong>Kenapa:</strong> Kunci pembayaran.</p>
<p><strong>Contoh nyata:</strong> Beasiswa 10 thn.</p>
</div>
<div className="decision-card">
<h3>2. Butuh kas rutin → <strong>Ladder</strong></h3>
<p><strong>Kenapa:</strong> Arus kas + reinvestasi disiplin.</p>
<p><strong>Contoh nyata:</strong> Dana operasional yayasan.</p>
</div>
<div className="decision-card">
<h3>3. Antisipasi volatilitas rate → <strong>Barbell (convexity)</strong></h3>
<p><strong>Kenapa:</strong> Menang saat gejolak.</p>
<p><strong>Contoh nyata:</strong> Mandat aktif.</p>
</div>
<div className="decision-card">
<h3>4. Spread HY murah (krisis) → <strong>Rotasi kredit overweight HY + aturan jual</strong></h3>
<p><strong>Kenapa:</strong> Mean-reversion spread.</p>
<p><strong>Contoh nyata:</strong> 800bps → 450bps.</p>
</div>
<div className="decision-card">
<h3>5. Kewajiban masa depan → <strong>Imunisasi duration + rebalance; komunikasikan batas</strong></h3>
<p><strong>Kenapa:</strong> Price vs reinvestment impas; hanya untuk parallel shift.</p>
<p><strong>Contoh nyata:</strong> Yayasan: match maturity (salah!) vs duration (benar).</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Match duration</strong>, bukan maturity.</li><li><strong>Rebalance</strong> imunisasi berkala.</li><li><strong>Arsitektur</strong> ikut kebutuhan kas.</li><li><strong>Disiplin jual</strong> di strategi aktif.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Janji 10 Tahun, Rate Naik 3%</h2>
<div className="callout">
<p>Yayasan: kewajiban Rp1M 10 tahun. Obligasi 10 tahun, rate +3% → harga −25%.</p>
<p><strong>Vignette lanjutan.</strong> Yayasan: kewajiban Rp1M 10 tahun. Bendahara beli obligasi 10 tahun (&ldquo;<em>match maturity</em>!&rdquo;). Rate naik 3% &rarr; harga &minus;25% &rarr; <em>panik</em>! Padahal: jika dipegang, Rp1M <em>tetap terpenuhi</em> (imunisasi!). Tapi: duration &asymp; 8,5 &ne; 10 &rarr; <em>tidak persis</em>!</p>
<p><strong>Pertanyaan:</strong> (a) Apakah Rp1M terancam? (b) Apa kesalahan konsep bendahara? (c) Desain imunisasi yang benar? (d) Hitung <em>mismatch</em> jika duration 8,5 vs 10 &mdash; berapa <em>eksposur</em>? (e) Bagaimana menjelaskan ke pengurus yang <em>panik</em>?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tidak</strong> (jika dipegang): price risk vs reinvestment risk impas di duration; kupon reinvest lebih tinggi → Rp1M <strong>terpenuhi</strong>.</p>
<p>(b) <strong>Match maturity, bukan duration</strong> (D_Mac ≈ 8,5 thn ≠ 10 thn) + tidak ada rencana rebalance.</p>
<p>(c) <strong>D_aset = 10</strong> (kombinasi obligasi), <strong>rebalance tahunan</strong>, lindungi hanya parallel shift (komunikasikan batasnya!).</p>
<p>(d) <strong>Mismatch 1,5 tahun:</strong> jika rate +3% &rarr; <em>eksposur</em> &asymp; 1,5 &times; 3% = <strong>4,5%</strong> dari PV (&asymp; Rp28jt dari 614jt!). <strong>Kecil, tapi <em>bukan NOL</em>.</strong> &mdash; inilah <em>harga</em> &ldquo;match maturity&rdquo; vs &ldquo;match duration&rdquo;. <strong>Presisi = <em>uang</em>.</strong></p>
<p>(e) <strong>Tiga kalimat:</strong> (1) &ldquo;Harga turun <em>di kertas</em> &mdash; tapi kupon <em>reinvest</em> lebih tinggi.&rdquo; (2) &ldquo;Di tahun ke&minus;10, keduanya <em>impas</em> &mdash; Rp1M <em>tetap</em>.&rdquo; (3) &ldquo;Yang penting = <em>jangan jual panik</em> &mdash; <em>jual</em> = mengubah <em>kertas</em> jadi <em>nyata</em>.&rdquo; <strong>Edukasi <em>sebelum</em> krisis, bukan <em>saat</em>.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Risiko Lanjut</h2>
      <h3>1. Key rate duration &mdash; &ldquo;bedah&rdquo; kurva</h3>
      <p><em>Duration</em> biasa = <em>parallel shift</em>. <strong><em>Key rate</em>:</strong> sensitivitas ke <em>tiap titik</em> kurva (2y! 10y! 30y!). <strong>Gunanya:</strong> <em>hedge</em> <em>non-parallel</em>! <strong>Contoh:</strong> kewajiban 10y &rarr; <em>key rate</em> 10y = 10, lainnya 0 &rarr; <strong><em>persis</em></strong>. <strong>Untuk <em>pro</em>:</strong> wajib!</p>
      <h3>2. Convexity &mdash; &ldquo;asuransi&rdquo; gratis?</h3>
      <p><strong><em>Convexity</em> positif</strong> = untung <em>lebih</em> saat rate turun, rugi <em>kurang</em> saat naik! <strong>&ldquo;Gratis&rdquo;?</strong> <em>Tidak</em> &mdash; <em>dihargai</em> (yield <em>lebih rendah</em>!). <strong>Untuk imunisasi:</strong> <em>convexity</em> aset &gt; kewajiban = <em>buffer</em> untuk <em>non-parallel</em>! <strong><em>Barbell</em> = <em>convexity</em> tinggi!</strong></p>
      <h3>3. Contingent immunization &mdash; &ldquo;aktif dengan jaring&rdquo;</h3>
      <p><strong>Kombinasi:</strong> aktif <em>selama</em> di atas <em>floor</em> (nilai imunisasi!); jika <em>menyentuh</em> floor &rarr; <strong><em>kunci</em> ke imunisasi</strong>! <strong>Pro:</strong> <em>upside</em> aktif + <em>proteksi</em>. <strong>Kontra:</strong> <em>kompleks</em>; <em>floor</em> bisa <em>tersentuh</em> di waktu <em>terburuk</em>. <strong>Untuk <em>yayasan</em> pemberani.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Imunisasi kilat</h3>
      <p>Kewajiban 10 tahun. Obligasi A (5y), B (15y). Bobot?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>10 = w&times;5 + (1&minus;w)&times;15 &rarr; w = <strong>50/50</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Struktur kilat</h3>
      <p>Ekspektasi <em>steepen</em>. <em>Bullet</em> atau <em>barbell</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong><em>Bullet</em></strong> (tengah terlindungi dari <em>steepen</em>!).</p>
      </details>
      <h3>Drill 3 &mdash; Kegagalan kilat</h3>
      <p>Imunisasi gagal saat <em>twist</em>. Kenapa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>Hanya lindungi <em>parallel shift</em>! <em>Twist</em> = bentuk berubah.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Obligasi 10 tahun untuk kewajiban 10 tahun = imun.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Belum tentu!</strong> <em>Duration</em> &asymp; 8,5 &ne; 10. Hitung <em>duration</em>!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Imunisasi yang benar: match apa?"}
  options={
    ["Maturity = horizon",
    "Macaulay duration = horizon",
    "Kupon = yield",
    "Harga = PV"]
  }
  correct={1}
  explanation={"Benar: D_Mac = titik impas price vs reinvestment risk. Maturity ≠ duration untuk coupon bond."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Rate naik 3%, obligasi 10 tahun. Bagi pemegang sampai maturity?"}
  options={
    ["Rugi 25%",
    "Kewajiban tetap terpenuhi (kupon reinvest lebih tinggi)",
    "Default",
    "Tidak ada efek"]
  }
  correct={1}
  explanation={"Benar: jika tidak dijual, arus kas kontraktual tetap. Panik jual = wujudkan rugi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Butuh kas tiap tahun. Arsitektur?"}
  options={
    ["Bullet",
    "Ladder",
    "Barbell",
    "Kas saja"]
  }
  correct={1}
  explanation={"Benar: ladder = jatuh tempo merata → arus kas rutin + reinvestasi disiplin."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Imunisasi melindungi dari?"}
  options={
    ["Semua risiko",
    "Parallel shift yield curve",
    "Default",
    "Inflasi"]
  }
  correct={1}
  explanation={"Benar: hanya parallel shift. Twist butuh key-rate duration; default butuh kredit analysis."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Duration imunisasi setelah 1 tahun?"}
  options={
    ["Tetap",
    "Bergeser — butuh rebalance",
    "Nol",
    "Naik 1"]
  }
  correct={1}
  explanation={"Benar: duration meleset seiring waktu & pergerakan rate. Imunisasi = proses, bukan sekali beli."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Kewajiban Rp1M 10 tahun. Bendahara beli obligasi 10 tahun (duration 8,5). Rate +3%. Apa masalah & solusi?"}
  options={
    ["Tidak masalah — maturity cocok",
    "Mismatch 1,5 tahun ≈ 4,5% eksposur; solusi: kombinasikan obligasi agar duration = 10 + rebalance",
    "Jual semua — harga turun 25%",
    "Beli lebih banyak obligasi 10 tahun"]}
  correct={1}
  explanation={"Benar: imunisasi = duration, bukan maturity. Mismatch 1,5 tahun × 3% ≈ 4,5% eksposur. Solusi: kombinasikan obligasi (5y + 15y) agar duration persis 10, lalu rebalance tahunan."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Imunisasi</strong>: D_aset = horizon; price vs reinvestment risk impas.</li>
<li><strong>3 teknik</strong>: cash-flow matching, duration matching, horizon matching.</li>
<li><strong>Arsitektur</strong>: ladder (kas rutin), bullet (janji tunggal), barbell (convexity).</li>
<li><strong>Aktif</strong>: rate anticipation, rotasi spread/kredit + disiplin.</li>
<li><strong>Batas</strong>: parallel shift saja; rebalance berkala.</li>
<li><strong>Aturan</strong>: match duration bukan maturity; 2022 bukti obligasi bisa −16%.</li>

<li><strong>Imunisasi:</strong> duration = horizon; rebalance; hanya parallel.</li>
<li><strong>Struktur:</strong> bullet/barbell/ladder &mdash; sesuai tujuan.</li>
<li><strong>Aktif:</strong> taruhan kurva/spread; hanya jika keunggulan terbukti.</li>
<li><strong>Kapan TIDAK pakai:</strong> match maturity; janji &ldquo;aman total&rdquo;; aktif tanpa edge.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c6-behavioral" className="btn btn-secondary btn-sm">← PM-C6</Link>
        <Link href="/learn/pm-c8-equity-portfolio" className="btn btn-primary btn-sm">PM-C8 →</Link>
      </div>
    </div>
  );
}

"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC3AssetAllocationPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C3 — Portfolio Management</span>
        <h1 className="display-title">Asset Allocation:<br/>SAA, TAA & LDI</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: 90% Return dari Satu Keputusan</a></li>
<li><a href="#saa">SAA: Strategic</a></li>
<li><a href="#ldi">LDI</a></li>
<li><a href="#faktor">Berbasis Faktor</a></li>
<li><a href="#sintesis">Sintesis: Hierarki</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Brinson</a></li>
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
<li>Menjelaskan SAA sebagai keputusan terpenting (Brinson).</li>
<li>Membedakan SAA vs TAA dan disiplin rebalancing.</li>
<li>Menjelaskan LDI: surplus optimization & funding ratio.</li>
<li>Menjelaskan alokasi berbasis faktor risiko.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: 90% Return dari Satu Keputusan</h2>
      <div className="story">
        <p><strong>Brinson, Hood &amp; Beebower (1986)</strong>: studi legendaris — <strong>&gt;90% variasi return</strong> dana pensiun dijelaskan oleh <strong>alokasi aset</strong>, bukan stock picking atau market timing!</p>
<p>Twist-nya: industri reksadana menghabiskan miliaran untuk <em>stock picking</em> (yang menjelaskan &lt;10%), sementara <strong>keputusan alokasi</strong> — saham vs obligasi vs kas — dibuat <em>asal-asalan</em> di banyak institusi. <strong>80% energi untuk 10% hasil.</strong> Lesson ini: memfokuskan energi ke yang paling menentukan.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="saa">SAA — Keputusan 90%</h2>
<p><strong>Definisi.</strong> <strong>SAA</strong> (<em>strategic asset allocation</em>): policy portfolio jangka panjang dari <strong>mean-variance optimization</strong> + constraints IPS. <strong>Efficient frontier</strong>: set portofolio return maksimal per risiko. <strong>TAA</strong>: tilt <em>taktis</em> jangka pendek menyimpang dari SAA (mis. overweight saham 5% saat murah) — dengan <strong>disiplin kembali</strong>.</p>
<p><strong>Rebalancing</strong>: kembalikan ke SAA (calendar atau tolerance band) — <strong>jual mahal, beli murah</strong> otomatis.</p>
<Tex math={String.raw`\max_w \ w^T\mu - \frac{\lambda}{2}w^T\Sigma w`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`w`} />: bobot aset</li>
<li><Tex math={String.raw`\mu, \Sigma`} />: expected return &amp; kovarians (dari CME, PM-C2!)</li>
<li><Tex math={String.raw`\lambda`} />: risk aversion (dari IPS, PM-C1!)</li>
<li>Rantai: IPS → CME → optimisasi → SAA. Putus satu = asal-asalan.</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> SAA seperti <strong>resep diet jangka panjang</strong>: komposisi makronutrien (saham/obligasi) menentukan 90% kesehatan. TAA = <strong>cheat meal terencana</strong> sesekali — boleh, asal kembali ke resep. Tanpa resep = diet yo-yo.</p>
<p><strong>Kapan dipakai:</strong> Setiap penetapan kebijakan investasi; review 3–5 tahunan.</p>
<p><strong>Pendalaman intuisi &mdash; Brinson: 90% = alokasi, bukan seleksi.</strong> Studi Brinson-Hood-Beebower: <strong>&gt; 90% variasi return</strong> dijelaskan oleh <em>asset allocation</em> &mdash; bukan <em>stock picking</em>! <strong>Implikasi brutal:</strong> tim yang menghabiskan 80% waktu untuk <em>stock picking</em> = <strong>mengoptimalkan yang 10%</strong>. <strong>Prioritas:</strong> (1) SAA yang benar, (2) <em>rebalancing</em> disiplin, (3) biaya rendah &mdash; <em>baru</em> (4) seleksi. <strong>Alokasi = fondasi; seleksi = cat dinding.</strong></p><details className="worked">
<summary>📐 Contoh: SAA pensiun (klik untuk buka)</summary>
<p>IPS: return 8%, vol &lt; 12%. CME: saham E(R) 10,5% σ 18%; obligasi 7% σ 6%; ρ = 0,2.</p>
<p><strong>60/40</strong>: E(R) = 9,1%, σ = √(0,36×0,0324 + 0,16×0,0036 + 2×0,6×0,4×0,2×0,18×0,06) = √(0,0117+0,0006+0,0010) = <strong>11,5%</strong> ✓.</p>
<p><strong>TAA</strong>: saham murah (P/E −1σ) → tilt 65/35 sementara; <strong>rebalance</strong> saat kembali normal. Disiplin = kunci.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Membangun SAA &mdash; dari IPS ke angka</summary>
<p><strong>Soal:</strong> klien: return 7% neto, vol &lt; 12%, horizon 20 tahun. CME: saham 8% (&sigma; 18%), obligasi 4% (&sigma; 6%), korelasi 0,2. Cari alokasi.</p>
<p><strong>Langkah 1 &mdash; coba 70/30:</strong> return = 0,7&times;8 + 0,3&times;4 = <strong>6,8%</strong> (&asymp; target!). Vol = &radic;(0,7&sup2;&times;0,18&sup2; + 0,3&sup2;&times;0,06&sup2; + 2&times;0,7&times;0,3&times;0,2&times;0,18&times;0,06) = &radic;(0,0159+0,0003+0,0009) = <strong>13,1%</strong> (&gt; 12%! <em>gagal</em>).</p>
<p><strong>Langkah 2 &mdash; coba 60/40:</strong> return = <strong>6,4%</strong>; vol = <strong>11,5%</strong> (&check;!).</p>
<p><strong>Keputusan:</strong> <strong>60/40</strong> &mdash; memenuhi <em>risiko</em> (11,5% &lt; 12%!), return 6,4% <em>mendekati</em> 7% (diskusikan dengan klien: terima 6,4% atau tambah risiko?). <strong>SAA = <em>kompromi</em> antara return &amp; risiko &mdash; bukan <em>maksimasi</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Efficient frontier &mdash; membaca peta</summary>
<p><strong>Soal:</strong> tiga portofolio: A (6%, 10%), B (7%, 13%), C (6,5%, 10%). Mana efisien?</p>
<p><strong>Analisis:</strong> C <strong>mendominasi</strong> A (return lebih tinggi, risiko <em>sama</em>!). A = <strong>tidak efisien</strong> (buang!). B vs C = <strong>tradeoff</strong> (B: +0,5% return, +3% risiko).</p>
<p><strong>Pilihan:</strong> tergantung <em>toleransi</em> klien. <strong>Aturan:</strong> pilih <strong>hanya</strong> dari <em>frontier</em> (C atau B) &mdash; <strong>jangan pernah</strong> pilih portofolio <em>di dalam</em> frontier (seperti A!). <strong>SAA optimal = titik di frontier yang <em>sesuai IPS</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Stock picking = kunci&rdquo;.</strong> Brinson: <strong>alokasi &gt; 90%</strong>. Soal yang memuji &ldquo;stock picker hebat&rdquo; &amp; bertanya kunci return &rarr; <strong>jawab: alokasi!</strong> Stock picker hebat dengan alokasi buruk = <strong>kalah</strong> dari alokasi benar dengan stock picker biasa.</p>
</div>
<PlotlyChart
  data={[{x: [6,8,11.5,14,18], y: [7,8.2,9.1,9.8,10.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "frontier"}, {x: [11.5], y: [9.1], type: "scatter", mode: "markers", marker: {color: "#ef4444", size: 12}, name: "SAA 60/40"}]}
  title={"Efficient frontier (ilustrasi): risiko vs return"}
  layout={{xaxis: {title: "Volatilitas (%)"}, yaxis: {title: "Expected return (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Kurva biru = frontier; titik merah = SAA 60/40 terpilih.</p>
<p><strong>Interpretasi:</strong> Titik <strong>di bawah</strong> kurva = tidak efisien (risiko sama, return kurang). SAA dipilih <strong>di</strong> kurva sesuai batas IPS (vol &lt; 12%). Optimisasi tanpa constraints IPS = <strong>jawaban matematis untuk pertanyaan yang salah</strong>.</p>
</div>

<PlotlyChart
  data={[{x: [60,70,80,90,100], y: [6.4,6.8,7.2,7.6,8.0], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Return (%)"}, {x: [60,70,80,90,100], y: [11.5,13.1,14.8,16.6,18.0], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Vol (%)", yaxis: "y2"}]}
  title={"Tradeoff alokasi: return naik, risiko naik lebih cepat"}
  layout={{xaxis: {title: "% Saham"}, yaxis: {title: "Return (%)"}, yaxis2: {title: "Vol (%)", overlaying: "y", side: "right"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = % saham. Biru = return ekspektasian; merah = volatilitas.</p>
<p><strong>Interpretasi:</strong> return naik <strong>linear</strong> (6,4% &rarr; 8%), tapi vol naik <strong>lebih cepat</strong> (11,5% &rarr; 18%!). <strong>Titik 60%</strong> = memenuhi batas vol 12% &mdash; <strong>sweet spot</strong> untuk klien ini. <strong>Pelajaran:</strong> setiap tambahan return = <em>harga</em> risiko yang <em>meningkat</em>. <strong>SAA = memilih <em>titik</em> di kurva ini yang <em>sesuai IPS</em>.</strong></p>
</div>

<PlotlyChart
  data={[{x: ["Alokasi", "Seleksi", "Timing", "Biaya"], y: [90, 5, 2, 3], type: "bar", marker: {color: ["#2a7de1", "#e8a838", "#d62728", "#2ca02c"]}, name: "Kontribusi (%)"}]}
  title={"Brinson: 90% return = alokasi"}
  layout={{xaxis: {title: "Sumber return"}, yaxis: {title: "% variasi dijelaskan"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = kontribusi tiap keputusan ke variasi return (studi Brinson).</p>
<p><strong>Interpretasi:</strong> <strong>Alokasi = 90%!</strong> Seleksi + timing = 7%. <strong>Implikasi brutal:</strong> tim yang 80% waktunya untuk seleksi = <strong>mengoptimalkan yang 7%</strong>. <strong>Realokasi:</strong> 60% energi ke SAA/IPS/rebalance, 30% ke manajer &amp; biaya, 10% ke seleksi.</p>
</div>
<h2 id="ldi">LDI — Investasi untuk Membayar Janji</h2>
<p><strong>Definisi.</strong> <strong>LDI</strong> (<em>liability-driven investing</em>): tujuan = <strong>funded ratio stabil/naik</strong>, bukan return absolut. <strong>Surplus optimization</strong>: optimasi <em>surplus</em> (aset − liabilitas). <strong>Hedge portfolio</strong> (obligasi long-duration, match liabilitas) + <strong>growth portfolio</strong> (tutup defisit).</p>
<p><strong>Glide path</strong>: makin funded → makin hedge (de-risking otomatis).</p>
<p><strong>Kepribadian/intuisi:</strong> LDI seperti <strong>menabung untuk cicilan rumah</strong>: bukan 'return maksimal', tapi 'pasti bisa bayar tiap bulan'. Hedge portfolio = <strong>autodebet</strong> (pasti cocok); growth = <strong>lembur</strong> (tutup kekurangan).</p>
<p><strong>Kapan dipakai:</strong> DB pension, asuransi — semua yang punya liabilitas pasti.</p>
<p><strong>Pendalaman intuisi &mdash; SAA vs TAA = &ldquo;kompas&rdquo; vs &ldquo;kemudi&rdquo;.</strong> <strong>SAA</strong> (<em>strategic</em>): alokasi <em>jangka panjang</em> dari IPS &amp; CME (mis. 60/40) &mdash; <strong>kompas</strong> (tidak berubah tiap berita!). <strong>TAA</strong> (<em>tactical</em>): deviasi <em>sementara &amp; terbatas</em> (mis. 65/35 saat saham murah) &mdash; <strong>kemudi</strong> (koreksi kecil!). <strong>Aturan:</strong> TAA &le; &plusmn;5&ndash;10% dari SAA + <em>kembali</em> ke SAA. <strong>TAA tanpa SAA = <em>market timing</em> berkedok.</strong></p><details className="worked">
<summary>📐 Contoh: Dua portfolio (klik untuk buka)</summary>
<p>Dana defisit 80%: <strong>hedge 50%</strong> (D=15) + <strong>growth 50%</strong> (D≈2) → D_aset = <strong>8,5</strong>.</p>
<p>Rate turun 1%: liabilitas <strong>+15%</strong>, aset +8,5% → funded <strong>75%</strong> (vs <strong>71%</strong> tanpa hedge!). Hedge <em>penuh</em> (D_aset=15) → funded <strong>tetap 80%</strong> ✓.</p>
<p><strong>LDI = asuransi funded ratio</strong>: makin besar hedge, makin stabil — tapi makin kecil growth untuk tutup defisit. <strong>Trade-off!</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): TAA disiplin &mdash; kapan &amp; berapa</summary>
<p><strong>Soal:</strong> SAA 60/40. P/E pasar 25 (vs rata-rata 16) &rarr; saham &ldquo;mahal&rdquo;. TAA?</p>
<p><strong>Keputusan:</strong> geser ke <strong>55/45</strong> (&minus;5% saham).</p>
<p><strong>Disiplin:</strong> (1) <strong>terbatas</strong> (&plusmn;5%! bukan 30/70!); (2) <strong>sementara</strong> (kembali ke 60/40 dalam 12&ndash;18 bulan atau saat valuasi normal); (3) <strong>terdokumentasi</strong> (alasan tertulis!); (4) <strong>dievaluasi</strong> (apakah TAA menambah nilai?). <strong>TAA tanpa disiplin = <em>market timing</em> emosional.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kapan TIDAK TAA</summary>
<p><strong>Soal:</strong> tiga situasi: (1) &ldquo;feeling&rdquo; pasar akan jatuh; (2) P/E 2&sigma; di atas rata-rata + <em>recession signal</em>; (3) berita kemarin. Mana yang membenarkan TAA?</p>
<p><strong>Hanya (2)!</strong> (1) = <em>emosi</em> (bukan sinyal!); (3) = <em>noise</em> (sudah di harga!). (2) = <strong>sinyal <em>valuasi</em> + <em>makro</em></strong> yang <em>terukur</em>.</p>
<p><strong>Aturan TAA:</strong> butuh <strong>(a)</strong> sinyal <em>terukur</em>, <strong>(b)</strong> <em>keyakinan</em> tinggi, <strong>(c)</strong> <em>ekspektasi</em> return &gt; biaya. <strong>Jika tidak ketiganya &rarr; tetap di SAA.</strong> <strong>Keputusan terbaik seringkali = <em>tidak melakukan apa-apa</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; TAA = &ldquo;bebas&rdquo;.</strong> TAA <strong>terbatas</strong> (&plusmn;5&ndash;10%!), <strong>sementara</strong>, <strong>terdokumentasi</strong>. Soal yang menggambarkan manajer &ldquo;geser 60/40 ke 20/80 karena feeling&rdquo; &rarr; <strong>pelanggaran disiplin</strong> (bukan TAA!). <strong>TAA = <em>kemudi</em>, bukan <em>putar balik</em>.</strong></p>
</div>
<h2 id="faktor">Factor-Based — Alokasi DNA</h2>
<p><strong>Definisi.</strong> <strong>Alokasi faktor</strong>: alokasikan ke <em>risiko premi</em> (equity, duration, credit, commodity) bukan ke <em>label aset</em>. <strong>60/40 saham/obligasi</strong> = <strong>90% risiko dari ekuitas</strong>! (saham jauh lebih volatile). <strong>Risk parity</strong> (pratinjau PM-D2): samakan kontribusi risiko.</p>
<p><strong>Manfaat</strong>: diversifikasi <em>risiko</em> sejati, bukan diversifikasi <em>label</em>.</p>
<p><strong>Kepribadian/intuisi:</strong> Alokasi tradisional seperti <strong>diet by warna makanan</strong> (60% merah, 40% hijau) — warnanya beda, nutrisinya bisa sama! Alokasi faktor = <strong>diet by nutrisi</strong> (protein, serat, vitamin) — yang benar-benar dibutuhkan tubuh (portofolio).</p>
<p><strong>Kapan dipakai:</strong> Institusi canggih; saat 'diversifikasi' tradisional gagal (2008).</p>
<p><strong>Pendalaman intuisi &mdash; rebalancing = &ldquo;jual mahal, beli murah&rdquo; otomatis.</strong> Saham naik &rarr; porsi &gt; target &rarr; <strong>jual sebagian</strong> (panen!); saham turun &rarr; <strong>beli</strong> (diskon!). <strong>Rebalancing = <em>contrarian</em> sistematis</strong> &mdash; tanpa emosi, tanpa ramalan. <strong>Bonus:</strong> <em>rebalancing premium</em> (0,3&ndash;0,5%/tahun!) dari &ldquo;beli rendah, jual tinggi&rdquo; mekanis. <strong>Biaya:</strong> pajak &amp; transaksi &mdash; jadi <em>rebalance</em> dengan <em>band</em> (mis. &plusmn;5%), bukan harian!</p><details className="worked">
<summary>📐 Contoh: Bedah 60/40 (klik untuk buka)</summary>
<p>Saham σ 18%, obligasi σ 6%, ρ 0,2. <strong>Kontribusi risiko</strong> saham ≈ <strong>88%</strong>!</p>
<p>'Seimbang' 60/40 = <strong>taruhan ekuitas berkedok diversifikasi</strong>. 2008: −22%.</p>
<p><strong>Risk parity</strong>: bobot by 1/σ → ~25/75 → kontribusi 50/50 → 2008: <strong>−8%</strong>. Bukan return lebih tinggi — <strong>risiko lebih jujur</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Rebalancing &mdash; angka</summary>
<p><strong>Soal:</strong> SAA 60/40, Rp100jt. Setahun: saham +30%, obligasi +5%. Rebalance?</p>
<p><strong>Langkah 1 &mdash; kini:</strong> saham 78jt, obligasi 42jt &rarr; total 120jt &rarr; <strong>65/35</strong> (menyimpang 5%!).</p>
<p><strong>Langkah 2 &mdash; rebalance:</strong> jual 6jt saham, beli 6jt obligasi &rarr; <strong>72/48 = 60/40</strong> &check;.</p>
<p><strong>Efek:</strong> <strong>mengunci</strong> keuntungan saham (+30%!) &amp; <strong>membeli</strong> obligasi yang tertinggal. <strong>Psikologi:</strong> terasa <em>salah</em> (jual pemenang!) &mdash; tapi <strong>disiplin &gt; perasaan</strong>. <strong>Tanpa rebalance:</strong> drift ke 80/20 &rarr; <strong>risiko meledak</strong> diam-diam!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Band vs kalender</summary>
<p><strong>Soal:</strong> band &plusmn;5% vs rebalance tahunan. Mana lebih baik?</p>
<p><strong>Band:</strong> rebalance <em>hanya</em> jika menyimpang &gt; 5% &rarr; <strong>hemat biaya &amp; pajak</strong> (jarang!). Tapi: bisa <em>terlambat</em> di pasar trending.</p>
<p><strong>Kalender:</strong> tiap 12 bulan &rarr; <strong>disiplin &amp; sederhana</strong>. Tapi: bisa <em>rebalance</em> saat tidak perlu (biaya!).</p>
<p><strong>Praktik:</strong> <strong>kombinasi</strong> &mdash; cek kuartalan, rebalance jika &gt; band. <strong>Untuk akun kena pajak:</strong> gunakan <em>arus kas baru</em> (top-up ke aset yang kurang!) &mdash; <strong>rebalance tanpa jual = tanpa pajak!</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Hierarki Keputusan</h2>
      <p>SAA, TAA, rebalancing = <strong>hierarki</strong>:</p>
      <ol>
        <li><strong>SAA = fondasi (90%)</strong> &mdash; dari IPS &amp; CME. <strong>Jarang berubah</strong> (3&ndash;5 tahun!).</li>
        <li><strong>TAA = penyesuaian (5%)</strong> &mdash; deviasi <em>terbatas &amp; sementara</em>. <strong>Butuh sinyal kuat.</strong></li>
        <li><strong>REBALANCING = disiplin (5%)</strong> &mdash; kembali ke SAA. <strong>Otomatis &amp; tanpa emosi.</strong></li>
      </ol>
      <p><strong>Urutan energi:</strong> SAA &gt;&gt; rebalancing &gt; TAA &gt;&gt; stock picking. <strong>Tim yang terbalik = tim yang kalah.</strong></p>

      <h3>🎙️ Debat: &ldquo;Alokasi pasif = menyerah&rdquo;</h3>
      <p><strong>Aktif:</strong> &ldquo;SAA statis = <em>menyerah</em> pada pasar. Manajer hebat <em>menambah nilai</em> via TAA &amp; seleksi.&rdquo;</p>
      <p><strong>Pasif:</strong> &ldquo;Data: <strong>80&ndash;90% manajer aktif <em>kalah</em></strong> dari benchmark setelah biaya (SPIVA!). &lsquo;Nilai tambah&rsquo; = <em>ilusi</em> yang mahal. SAA + index + rebalance = <strong>mengalahkan hampir semua pro</strong>.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>data memenangkan debat.</strong> <em>Default</em> = pasif (SAA + index). Aktif = <em>hanya</em> jika punya <em>keunggulan terbukti</em> (track record! bukan keyakinan!). <strong>Biaya = <em>kepastian</em>; <em>alpha</em> = <em>harapan</em>.</strong></p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Audit 80/20.</strong> Catat waktumu minggu lalu: berapa % untuk <em>stock picking</em> vs <em>alokasi</em>? (Jawab jujur: jika 80% picking &rarr; <strong>terbalik!</strong> Brinson bilang 90% = alokasi. <strong>Realokasi waktumu.</strong>)</p>
      <p><strong>(2) Drift detector.</strong> Cek portofoliomu kini vs target 1 tahun lalu. Menyimpang &gt; 5%? (Jawab: jika ya &amp; tidak rebalance &rarr; <strong>kamu mengambil risiko diam-diam!</strong>)</p>
      <p><strong>(3) TAA atau emosi?</strong> Terakhir kali mengubah alokasi: apa <em>sinyal terukur</em>-nya? Ditulis di mana? (Jawab: jika &ldquo;feeling&rdquo; &amp; tidak tertulis &rarr; <strong>itu bukan TAA &mdash; itu impuls.</strong>)</p>
      <h3>📰 Studi Kasus: Yale Endowment &mdash; Alokasi yang Legendaris</h3>
      <p>David Swensen (Yale): alokasi <em>radikal</em> &mdash; hanya 25% saham/tradisional, sisanya <em>alternatif</em> (PE, VC, <em>real asset</em>!). Return 20 tahun: <strong>12%+/tahun</strong> &mdash; mengalahkan hampir semua.</p>
      <p><strong>Kunci:</strong> (1) <strong>SAA <em>jangka sangat panjang</em></strong> (tidak goyang tiap krisis!); (2) <strong><em>illiquidity premium</em></strong> (dibayar untuk mengunci uang!); (3) <strong>manajer <em>top-quartile</em></strong> (akses!). <strong>Pelajaran:</strong> <strong>bukan</strong> &ldquo;tiru alokasi Yale&rdquo; (kamu tidak punya akses/timnya!), melainkan <strong>&ldquo;SAA disiplin + keunggulan strukturalmu&rdquo;</strong>.</p>
      <p><strong>Untuk individu:</strong> keunggulanmu = <strong>horizon panjang + biaya rendah + pajak</strong> &mdash; bukan akses PE. <strong>SAA 80/20 index + rebalance &gt; meniru Yale setengah-setengah.</strong></p>
      <h3>📊 Data Corner: SPIVA &mdash; 90% kalah</h3>
      <p><strong>Data (SPIVA):</strong> 10 tahun: <strong>85&ndash;90% manajer aktif kalah</strong> dari benchmark <em>setelah biaya</em>.</p>
      <p><strong>Cara membaca:</strong> <strong>bukan</strong> karena manajer bodoh &mdash; melainkan <strong>biaya</strong> (1&ndash;2%/tahun!) + <strong>zero-sum</strong> (sebelum biaya!). <strong>Implikasi SAA:</strong> <em>default</em> = index murah; aktif = <em>hanya</em> jika keunggulan <em>terbukti</em>. <strong>Biaya = <em>kepastian</em>; alpha = <em>harapan</em>.</strong></p>
      <h3>💱 Devisa dalam SAA &mdash; Hedging Mata Uang</h3>
      <p><strong>Pertanyaan:</strong> portofolio global: <em>hedge</em> mata uang atau tidak?</p>
      <p><strong>Saham asing:</strong> <strong>jangan hedge penuh</strong> &mdash; mata uang = <em>diversifier</em> (saat krisis, USD <em>menguat</em> = <em>hedge alami</em>!). Biaya hedge &asymp; selisih bunga (<em>mahal</em>!).</p>
      <p><strong>Obligasi asing:</strong> <strong>hedge!</strong> &mdash; vol mata uang (8&ndash;10%) &gt;&gt; vol obligasi (4&ndash;6%) &rarr; tanpa hedge, &ldquo;obligasi&rdquo; = <em>spekulasi valas</em>!</p>
      <p><strong>Aturan:</strong> hedge jika <strong>vol FX &gt; vol aset</strong>; biarkan jika <strong>FX = diversifier</strong>. <strong>Bukan satu aturan untuk semua!</strong></p>
      <h3>🎙️ Debat Lanjutan: &ldquo;100% Saham untuk Muda&rdquo;</h3>
      <p><strong>Pendukung:</strong> &ldquo;Muda = horizon 30 tahun = <em>waktu</em> memulihkan crash. 100% saham = return maksimal. Obligasi = <em>menyerah</em>.&rdquo;</p>
      <p><strong>Kritikus:</strong> &ldquo;2020: &minus;35% dalam sebulan. <strong>Berapa banyak &lsquo;muda&rsquo; yang <em>bertahan</em>?</strong> 100% saham = <em>ujian psikologi</em> yang kebanyakan <em>gagal</em>. 80/20 = return 90% dari 100/0 dengan <em>drawdown</em> jauh lebih kecil &mdash; <strong>dan yang bertahan = yang menang</strong>.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>alokasi <em>optimal</em> &ne; alokasi <em>maksimal</em>.</strong> Yang terbaik = yang <strong>bisa dipertahankan saat &minus;35%</strong>. Jika 100/0 membuatmu jual di dasar &rarr; 80/20 <em>lebih baik</em>. <strong>Kenali dirimu &mdash; bukan teorimu.</strong></p>
      <h3>📋 Checklist Review SAA 3-Tahunan</h3>
      <p><strong>Kapan review SAA?</strong> Tiap 3 tahun <strong>atau</strong> saat: (1) <em>life event</em> (nikah/pensiun/warisan!); (2) CME berubah <em>material</em> (suku bunga &plusmn;2%!); (3) <em>regulasi</em> berubah.</p>
      <p><strong>Yang ditanya:</strong> (1) Apakah <strong>tujuan</strong> masih sama? (2) Apakah <strong>toleransi risiko</strong> berubah? (3) Apakah <strong>CME</strong> masih valid? (4) Apakah <strong>biaya</strong> masih kompetitif?</p>
      <p><strong>Yang TIDAK dilakukan:</strong> mengubah SAA karena <strong>berita</strong> (itu TAA/emosi!), karena <strong>kinerja 1 tahun</strong> (<em>recency bias</em>!), atau karena <strong>tetangga untung</strong> (<em>FOMO</em>!). <strong>SAA = <em>konstitusi</em>; amandemen = <em>langka &amp; disengaja</em>.</strong></p>
      <h3>🔄 Rebalancing di Dunia Nyata: Pajak &amp; Biaya</h3>
      <p><strong>Masalah:</strong> rebalance = jual = <strong>pajak + biaya</strong>! Rebalance bulanan = <em>bunuh diri pajak</em>.</p>
      <p><strong>Solusi berlapis:</strong> (1) <strong>Arus kas baru</strong> &rarr; top-up ke aset yang <em>kurang</em> (rebalance <em>tanpa jual</em>!); (2) <strong>Dividen/kupon</strong> &rarr; arahkan ke yang kurang; (3) <strong>Akun pajak-tunda</strong> &rarr; rebalance di sini dulu (bebas pajak!); (4) <strong>Band lebar</strong> (&plusmn;5&ndash;10%) &rarr; jarang jual.</p>
      <p><strong>Urutkan:</strong> (1) &rarr; (2) &rarr; (3) &rarr; (4) &rarr; <em>baru</em> jual kena pajak. <strong>Rebalancing cerdas = <em>tanpa</em> pajak sebisa mungkin.</strong></p>
      <h3>🎯 Satu Kalimat per Konsep</h3>
      <p><strong>SAA:</strong> &ldquo;Alokasi <em>jangka panjang</em> dari IPS &mdash; kompas yang jarang berubah.&rdquo;</p>
      <p><strong>TAA:</strong> &ldquo;Deviasi <em>kecil &amp; sementara</em> dari SAA &mdash; kemudi, bukan putar balik.&rdquo;</p>
      <p><strong>Rebalancing:</strong> &ldquo;Kembali ke target <em>otomatis</em> &mdash; jual mahal, beli murah, tanpa emosi.&rdquo;</p>
      <p><strong>Brinson:</strong> &ldquo;90% = alokasi &mdash; <em>di sinilah</em> waktumu seharusnya.&rdquo;</p>
      <p><strong>Hafalkan keempatnya</strong> &mdash; ini <em>inti</em> lesson ini dalam 4 kalimat.</p>
      <h3>📖 Esai: Alokasi adalah Keputusan Terbesar</h3>
      <p><strong><em>Alokasi</em></strong> = <strong><em>90%</em></strong> <em>return</em>. <strong><em>Seleksi</em></strong> = <strong><em>10%</em></strong>. <strong><em>Fokus</em></strong> pada <strong><em>yang</em></strong> <em>besar</em>.</p>
      <p><strong><em>Alokasi</em></strong> <em>dulu</em>, <strong><em>seleksi</em></strong> <em>kemudian</em>.</p>
      <h3>💎 Alokasi Disiplin</h3>
      <p><strong><em>Rebalance</em></strong> = <strong><em>disiplin</em></strong>. <strong><em>Disiplin</em></strong> = <strong><em>jual</em></strong> <em>mahal</em>, <strong><em>beli</em></strong> <em>murah</em>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Stock picking menentukan hasil. Fokus cari saham terbaik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Brinson: <strong>&gt;90% variasi return</strong> = alokasi aset. Energi industri terbalik: 80% untuk stock picking (10% hasil). <strong>Alokasi dulu, seleksi kemudian.</strong> Manajer hebat di alokasi salah = sia-sia.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;60/40 = portofolio seimbang dan terdiversifikasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>88% risikonya dari saham!</strong> 'Seimbang' hanya di label, tidak di risiko. 2008 membuktikan: diversifikasi label ≠ diversifikasi risiko. Ukur <strong>kontribusi risiko</strong>, bukan bobot nominal.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Diversifikasi = banyak saham.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 50 saham <em>teknologi</em> = <strong>konsentrasi</strong>! Diversifikasi = <strong>aset <em>berbeda perilaku</em></strong> (saham + obligasi + ...). <strong>Uji:</strong> saat krisis, apakah semuanya jatuh bersamaan? Jika ya &rarr; <strong>diversifikasi semu</strong>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Rebalancing = market timing.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>kebalikannya!</strong> Rebalancing = <em>kembali</em> ke target (anti-timing!); market timing = <em>meninggalkan</em> target karena ramalan. <strong>Rebalancing = <em>disiplin</em>; timing = <em>spekulasi</em>.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Tulis policy portfolio dengan rentang, bukan titik.</strong> 'Saham 55–65%' + tolerance band = disiplin rebalancing otomatis. Titik kaku = trading emosional.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Rebalancing = satu-satunya 'market timing' yang terbukti.</strong> Jual yang naik (mahal), beli yang turun (murah) — mekanis, tanpa prediksi. Jadwalkan, jangan rasakan.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Audit alokasimu (10 menit):</strong> (1) <strong>Berapa %</strong> per aset kini? (2) <strong>Berapa target</strong> (IPS)? (3) <strong>Menyimpang &gt; 5%?</strong> &rarr; rebalance! (4) <strong>Kapan terakhir review SAA?</strong> (&gt; 3 tahun &rarr; jadwalkan!). <strong>Empat pertanyaan, sepuluh menit, tiap kuartal.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Frontier 2 Aset</h2>
<p>Hitung E(R) & risiko portofolio untuk berbagai bobot — temukan SAA.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Frontier"}
  hint={"Ubah RHO 0.2 → 0.8. Frontier 'menggembung' — diversifikasi berkurang!"}
  defaultCode={"# Frontier 2 aset: cari SAA yang memenuhi IPS\nimport math\nER_S, SIG_S = 0.105, 0.18\nER_B, SIG_B = 0.07, 0.06\nRHO = 0.2   # ubah!\nTARGET_VOL = 0.12  # batas IPS\n\nprint(f\"{'saham':>6} {'E(R)':>7} {'vol':>7}  IPS?\")\nterbaik = None\nfor i in range(0, 101, 10):\n    w = i/100\n    er = w*ER_S + (1-w)*ER_B\n    var = w**2*SIG_S**2 + (1-w)**2*SIG_B**2 + 2*w*(1-w)*RHO*SIG_S*SIG_B\n    vol = math.sqrt(var)\n    ok = vol <= TARGET_VOL\n    print(f\"{w:>6.0%} {er:>6.1%} {vol:>6.1%}  {'OK' if ok else ''}\")\n    if ok and (terbaik is None or er > terbaik[1]): terbaik = (w, er)\nprint(f\"\\nSAA terbaik (vol<={TARGET_VOL:.0%}): saham {terbaik[0]:.0%}, E(R) {terbaik[1]:.1%}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator Funding Ratio LDI</h2>
<p>Simulasikan funded ratio dengan & tanpa hedge saat rate berubah.</p>
<PyodideLab
  title={"Lab 2 — Simulator LDI"}
  hint={"Ubah D_RATE -0.01 → +0.01 (rate naik). Lihat efek ke funded ratio!"}
  defaultCode={"# LDI: funded ratio dengan vs tanpa hedge\nASET, LIAB = 800, 1000  # Rp M\nD_LIAB = 15             # duration liabilitas\nD_HEDGE, W_HEDGE = 15, 0.5   # duration & bobot hedge portfolio\nD_RATE = -0.01          # perubahan yield (ubah!)\n\ndef funded(d_hedge_w):\n    d_aset = d_hedge_w*D_HEDGE + (1-d_hedge_w)*2  # growth durasi ~2\n    aset2 = ASET*(1 - d_aset*D_RATE)\n    liab2 = LIAB*(1 - D_LIAB*D_RATE)\n    return aset2/liab2\n\nprint(f\"Funded awal: {ASET/LIAB:.0%}\")\nprint(f\"Tanpa hedge (w=0) : {funded(0):.0%}\")\nprint(f\"Dengan hedge (w=0.5): {funded(W_HEDGE):.0%}\")\nprint(\"\\nRate turun: liabilitas meledak. Hedge = penyeimbang.\")\nprint(\"LDI = stabilkan funded ratio, bukan kejar return.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Menetapkan kebijakan investasi → <strong>SAA via optimisasi + constraints IPS</strong></h3>
<p><strong>Kenapa:</strong> 90% penentu hasil.</p>
<p><strong>Contoh nyata:</strong> 60/40 by IPS, bukan ikut-ikutan.</p>
</div>
<div className="decision-card">
<h3>2. Valuasi ekstrem (P/E ±1σ) → <strong>TAA tilt ±5% + disiplin kembali</strong></h3>
<p><strong>Kenapa:</strong> Tilt terukur, bukan timing liar.</p>
<p><strong>Contoh nyata:</strong> Overweight saham saat murah.</p>
</div>
<div className="decision-card">
<h3>3. Ada liabilitas pasti (pensiun) → <strong>LDI: hedge + growth</strong></h3>
<p><strong>Kenapa:</strong> Funded ratio = objective.</p>
<p><strong>Contoh nyata:</strong> Duration match.</p>
</div>
<div className="decision-card">
<h3>4. 'Diversifikasi' tapi 2008 hancur → <strong>Cek kontribusi risiko / factor-based</strong></h3>
<p><strong>Kenapa:</strong> Label ≠ risiko.</p>
<p><strong>Contoh nyata:</strong> Risk parity.</p>
</div>
<div className="decision-card">
<h3>5. Alokasi portofolio → <strong>SAA dari IPS; TAA terbatas; rebalance disiplin</strong></h3>
<p><strong>Kenapa:</strong> 90% return = alokasi; rebalancing = contrarian otomatis.</p>
<p><strong>Contoh nyata:</strong> Dana pensiun 8%/thn, 92% dari alokasi — bukan stock picking.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Alokasi = 90%</strong> penentu.</li><li><strong>SAA + disiplin TAA</strong>.</li><li><strong>Rebalancing mekanis</strong>.</li><li><strong>Ukur risiko</strong>, bukan bobot.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 90% dari Satu Keputusan</h2>
<div className="callout">
<p>Dana pensiun: return 8%/thn. Atribusi Brinson: alokasi menjelaskan 92% variasi. Tim habiskan 80% waktu untuk stock picking.</p>
<p><strong>Vignette lanjutan.</strong> Dana pensiun return 8%/tahun. Atribusi Brinson: <strong>alokasi menjelaskan 92%</strong> variasi return. Tapi tim menghabiskan 80% waktu untuk <em>stock picking</em> &mdash; dan tidak pernah me-<em>rebalance</em> (drift ke 75/25!).</p>
<p><strong>Pertanyaan:</strong> (a) Implikasi Brinson? (b) Realokasi energi tim? (c) Desain <em>governance</em>-nya? (d) Jika drift ke 75/25 dari 60/40, berapa <em>risiko berlebih</em> yang diambil diam-diam? (e) Rancang <em>policy</em> rebalancing.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Alokasi &gt;&gt; seleksi.</strong> Stock picking hebat tidak menyelamatkan alokasi buruk.</p>
<p>(b) <strong>60% energi</strong>: SAA/IPS/CME + rebalancing disiplin; <strong>30%</strong>: manajer &amp; biaya; <strong>10%</strong>: stock picking.</p>
<p>(c) <strong>Komite alokasi</strong> terpisah dari komite seleksi; <strong>policy band</strong> tertulis; review SAA 3-tahunan. Struktur mengikuti <em>di mana nilai diciptakan</em>.</p>
<p>(d) <strong>Drift 60/40 &rarr; 75/25:</strong> vol naik dari &asymp;11,5% ke &asymp;14,8% &mdash; <strong>+30% risiko!</strong> &mdash; <em>tanpa</em> keputusan sadar, <em>tanpa</em> persetujuan, <em>tanpa</em> kompensasi return yang sepadan. <strong>Drift = <em>risiko diam-diam</em>.</strong> Inilah kenapa rebalancing = <em>manajemen risiko</em>, bukan <em>optimasi</em>.</p>
<p>(e) <strong>Policy:</strong> (1) <strong>band &plusmn;5%</strong> (cek kuartalan); (2) <strong>rebalance dengan <em>arus kas baru</em></strong> dulu (hemat pajak!); (3) <strong>lapor drift</strong> ke komite tiap kuartal; (4) <strong>review SAA 3-tahunan</strong> (atau saat <em>life event</em>/perubahan CME besar). <strong>Tertulis, terukur, terjadwal.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Alokasi Lanjut</h2>
      <h3>1. Risk parity &mdash; alokasi <em>risiko</em>, bukan <em>modal</em></h3>
      <p>60/40 = 90% <em>risiko</em> dari saham! <strong>Risk parity:</strong> samakan <em>kontribusi risiko</em> (mis. saham 30%, obligasi 70% + <em>leverage</em>). <strong>Pro:</strong> diversifikasi <em>sejati</em>. <strong>Kontra:</strong> butuh <em>leverage</em> (risiko!); <em>bond-heavy</em> saat suku bunga naik = <em>sakit</em>. <strong>Bukan untuk semua orang</strong> &mdash; tapi <em>konsepnya</em> wajib dipahami.</p>
      <h3>2. Faktor investing &mdash; di balik label aset</h3>
      <p>&ldquo;Saham&rdquo; = <em>bundel faktor</em> (<em>value</em>, <em>momentum</em>, <em>size</em>...). <strong>Alokasi faktor:</strong> target <em>premi faktor</em> langsung, bukan via label aset. <strong>Pro:</strong> lebih <em>presisi</em>. <strong>Kontra:</strong> kompleks; faktor bisa <em>mati</em> dekade-an (<em>value</em> 2010&ndash;20!). <strong>Untuk institusi canggih</strong>; individu = <em>index fund</em> cukup.</p>
      <h3>3. Glide path &mdash; alokasi sepanjang hidup</h3>
      <p><em>Target-date fund</em>: saham 90% (muda) &rarr; 40% (pensiun). <strong>Logika:</strong> <em>human capital</em> (gaji!) = &ldquo;obligasi&rdquo; saat muda &rarr; bisa ambil risiko finansial. <strong>Kritik:</strong> <em>satu ukuran untuk semua</em> (abaikan toleransi individu!). <strong>Gunakan sebagai <em>titik awal</em>, sesuaikan dengan IPS.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; SAA kilat</h3>
      <p>Saham 8% (&sigma;18%), obligasi 4% (&sigma;6%), korel 0,2. Return &amp; vol 60/40?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>Return <strong>6,4%</strong>; vol <strong>11,5%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Rebalance kilat</h3>
      <p>60/40 Rp100jt. Saham +30%, obligasi +5%. Rebalance berapa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Jadi 65/35 (120jt). <strong>Jual 6jt saham, beli 6jt obligasi.</strong></p>
      </details>
      <h3>Drill 3 &mdash; Brinson</h3>
      <p>Alokasi menjelaskan 92% variasi. Implikasi untuk waktu tim?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Fokus ke SAA &amp; rebalancing</strong> (bukan stock picking!). 80% waktu untuk 10% = salah prioritas.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Geser 60/40 ke 20/80 karena feeling.&rdquo; TAA valid?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>TIDAK.</strong> TAA = terbatas (&plusmn;5%), sementara, terdokumentasi. Ini <em>market timing</em> emosional.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Studi Brinson: alokasi menjelaskan?"}
  options={
    ["Kurang dari 10%",
    "Lebih dari 90% variasi return",
    "50%",
    "Tidak ada"]
  }
  correct={1}
  explanation={"Benar: &gt;90%. Implikasi: fokus energi ke SAA/IPS/CME, bukan stock picking."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. 60/40 saham/obligasi. Kontribusi risiko saham?"}
  options={
    ["60%",
    "≈ 88% — taruhan ekuitas berkedok",
    "40%",
    "50%"]
  }
  correct={1}
  explanation={"Benar: saham jauh lebih volatile. 'Seimbang' di label ≠ seimbang di risiko."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Rate turun 1%, liabilitas duration 15. Tanpa hedge, funded 80% jadi?"}
  options={
    ["80%",
    "≈ 72% (liabilitas +15%, aset +5%)",
    "90%",
    "100%"]
  }
  correct={1}
  explanation={"Benar: mismatch durasi = funded ratio ambruk saat rate turun. LDI hedge mencegah ini."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. TAA yang disiplin?"}
  options={
    ["Timing liar",
    "Tilt ±5% saat valuasi ekstrem + kembali ke SAA",
    "Tidak pernah menyimpang",
    "Ikut tren"]
  }
  correct={1}
  explanation={"Benar: TAA = deviasi terukur & sementara dari SAA. Tanpa disiplin kembali = drift."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Rebalancing otomatis = ?"}
  options={
    ["Market timing",
    "Jual mahal-beli murah mekanis",
    "Tidak ada gunanya",
    "Biaya sia-sia"]
  }
  correct={1}
  explanation={"Benar: tolerance band menjual outperformer (mahal) & membeli underperformer (murah) — contrarian otomatis."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. SAA 60/40 drift ke 75/25 (tidak di-rebalance). Apa masalah UTAMA?"}
  options={
    ["Return lebih tinggi — bagus",
    "Risiko naik ~30% diam-diam tanpa keputusan sadar — drift = risiko tanpa kompensasi",
    "Pajak lebih rendah",
    "Tidak ada masalah — pasar yang memutuskan"]}
  correct={1}
  explanation={"Benar: vol naik dari ~11,5% ke ~14,8% (+30%) tanpa persetujuan dan tanpa kompensasi return sepadan. Rebalancing = manajemen risiko, bukan optimasi."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>SAA</strong>: policy portfolio dari IPS+CME+optimisasi; <strong>90% penentu</strong>.</li>
<li><strong>TAA</strong>: tilt taktis ±5% + disiplin kembali.</li>
<li><strong>LDI</strong>: funded ratio = objective; hedge + growth; glide path.</li>
<li><strong>Factor-based</strong>: alokasi risiko premi, bukan label; 60/40 = 88% risiko ekuitas.</li>
<li><strong>Rebalancing</strong>: mekanis, contrarian otomatis.</li>
<li><strong>Aturan</strong>: ukur kontribusi risiko; review SAA 3–5 tahun.</li>

<li><strong>SAA:</strong> fondasi dari IPS &amp; CME; 90% variasi return.</li>
<li><strong>TAA:</strong> deviasi terbatas &amp; sementara; butuh sinyal kuat.</li>
<li><strong>Rebalancing:</strong> contrarian otomatis; kelola drift &amp; pajak.</li>
<li><strong>Kapan TIDAK pakai:</strong> stock picking sebelum SAA; TAA tanpa disiplin; biarkan drift.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c2-capital-market-expectations" className="btn btn-secondary btn-sm">← PM-C2</Link>
        <Link href="/learn/pm-c4-portfolio-construction" className="btn btn-primary btn-sm">PM-C4 →</Link>
      </div>
    </div>
  );
}

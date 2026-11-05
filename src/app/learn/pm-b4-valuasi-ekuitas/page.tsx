"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB4ValuasiEkuitasPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B4 — Portfolio Management</span>
        <h1 className="display-title">Valuasi Ekuitas:<br/>DDM, FCFF & Multiples</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Saham 'Murah' P/E 3x yang Mahal</a></li>
<li><a href="#ddm">DDM Multi-Stage</a></li>
<li><a href="#fcff">FCFF/FCFE</a></li>
<li><a href="#ri">Residual Income & Multiples</a></li>
<li><a href="#sintesis">Sintesis: Tiga Lensa</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: P/E 3x Tono</a></li>
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
<li>Menghitung nilai saham via DDM Gordon growth & 2-stage.</li>
<li>Membangun FCFF/FCFE dari laporan keuangan dan menilai ekuitas.</li>
<li>Menjelaskan residual income dan kapan memakainya.</li>
<li>Membandingkan multiples dan menjelaskan jebakan P/E rendah.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Saham 'Murah' P/E 3x yang Mahal</h2>
      <div className="story">
        <p><strong>Tono</strong> screening saham: menemukan <strong>P/E 3x</strong> — <em>&ldquo;termurah di bursa!&rdquo;</em> Ia borong. Setahun kemudian: saham <strong>turun 50%</strong>, dividen dipotong, laba anjlok.</p>
<p>Twist-nya: P/E 3x = <strong>value trap</strong>. E (earnings) <em>sementara tinggi</em> (puncak siklus komoditas); E <em>forward</em> kolaps. P/E rendah bukan murah — melainkan <strong>pasar sudah tahu</strong> labanya akan turun. <strong>Multiples tanpa memahami E = membaca harga tanpa membaca barang.</strong> Lesson ini: valuasi absolut sebagai jangkar.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="ddm">DDM — Dividen yang Didiskon</h2>
<p><strong>Definisi.</strong> <strong>Gordon growth</strong>: P0 = D1/(r−g) — untuk growth <em>konstan selamanya</em>. <strong>2-stage</strong>: growth tinggi N tahun → lalu stabil: P0 = PV dividen tahap 1 + PV terminal value (lihat rumus di bawah).</p>
<p>Syarat: perusahaan <strong>bagi dividen</strong> (atau bisa). Tidak cocok untuk startup nir-dividen → pakai FCFE.</p>
<Tex math={String.raw`P_0 = \sum_{t=1}^{N}\frac{D_t}{(1+r)^t} + \frac{1}{(1+r)^N}\frac{D_{N+1}}{r-g}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`D_t`} />: dividen tahun t (tumbuh g_tinggi selama N tahun)</li>
<li><Tex math={String.raw`P_N`} />: terminal value — sering 70–80% total nilai!</li>
<li><Tex math={String.raw`g`} />: growth stabil &lt; r (biasanya ≈ GDP nominal)</li>
<li>Peringatan: mayoritas nilai di terminal → sensitif ke g &amp; r</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> 2-stage DDM seperti <strong>menilai pohon buah</strong>: 5 tahun pertama berbuah lebat (hitung satu-satu), setelahnya berbuah 'normal' selamanya (pakai rumus). <strong>Sebagian besar harga = 'selamanya'-nya</strong> — ironis tapi benar.</p>
<p><strong>Kapan dipakai:</strong> Bank/utilitas berdividen stabil; tidak untuk growth nir-dividen.</p>
<p><strong>Pendalaman intuisi &mdash; valuasi = menerjemahkan masa depan ke harga hari ini.</strong> Setiap model (DDM, FCFF, RI) menjawab: &ldquo;berapa <em>kas masa depan</em> yang akan mengalir ke saya, didiskon ke hari ini?&rdquo; <strong>Tiga model, satu jiwa:</strong> bedanya hanya <em>definisi kas</em> (dividen? kas bebas? laba abnormal?) &amp; <em>kepada siapa</em> (pemegang saham? semua investor?). <strong>Jika tiga model memberi jawaban sangat berbeda &rarr; asumsimu tidak konsisten &mdash; bukan pasar yang salah.</strong></p><p><strong>Pendalaman intuisi &mdash; valuasi = menerjemahkan masa depan ke harga hari ini.</strong> Setiap model (DDM, FCFF, RI) menjawab: &ldquo;berapa <em>kas masa depan</em> yang akan mengalir ke saya, didiskon ke hari ini?&rdquo; <strong>Tiga model, satu jiwa:</strong> bedanya hanya <em>definisi kas</em> (dividen? kas bebas? laba abnormal?) &amp; <em>kepada siapa</em> (pemegang saham? semua investor?). <strong>Jika tiga model memberi jawaban sangat berbeda &rarr; asumsimu tidak konsisten &mdash; bukan pasar yang salah.</strong></p><details className="worked">
<summary>📐 Contoh: Bank Dividen (klik untuk buka)</summary>
<p>D0 = Rp400, g_tinggi = 12% (5 thn), g_stabil = 5%, r = 11%.</p>
<p><strong>Dividen thn 1–5</strong>: 448, 502, 562, 629, 705. PV = 404+413+417+421+418 = <strong>Rp2.073</strong>.</p>
<p><strong>Terminal</strong>: D6 = 705×1,05 = 740; P5 = 740/(0,11−0,05) = Rp12.333; PV = 12.333/1,11^5 = <strong>Rp7.318</strong>.</p>
<p><strong>P0 = Rp9.391</strong> — terminal 78% nilai! Harga pasar Rp11.000 → overvalued (asumsi benar).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Gordon Growth &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> dividen tahun depan Rp120, g = 6%, r = 11%. Nilai wajar?</p>
<p><strong>Langkah 1:</strong> V0 = D1/(r&minus;g) = 120/(0,11&minus;0,06) = 120/0,05 = <strong>Rp2.400</strong>.</p>
<p><strong>Langkah 2 &mdash; sensitivitas:</strong> jika g = 7% &rarr; 120/0,04 = <strong>Rp3.000</strong> (+25%!). Jika r = 12% &rarr; 120/0,06 = <strong>Rp2.000</strong> (&minus;17%!).</p>
<p><strong>Pelajaran:</strong> <strong>r &minus; g kecil = nilai meledak.</strong> Saat r &asymp; g, model menjadi <em>sangat tidak stabil</em> &mdash; dan asumsi &ldquo;g selamanya&rdquo; hampir pasti salah (tidak ada perusahaan tumbuh 6% selamanya!). <strong>Gordon = untuk perusahaan <em>mature</em> &amp; stabil saja.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Multistage DDM &mdash; dua fase</summary>
<p><strong>Soal:</strong> D0 = Rp100, tumbuh 20% selama 3 tahun, lalu g = 5% selamanya. r = 12%.</p>
<p><strong>Langkah 1 &mdash; dividen fase 1:</strong> D1 = 120, D2 = 144, D3 = 172,8.</p>
<p><strong>Langkah 2 &mdash; PV fase 1:</strong> 120/1,12 + 144/1,12&sup2; + 172,8/1,12&sup3; = 107,1 + 114,8 + 123,0 = <strong>344,9</strong>.</p>
<p><strong>Langkah 3 &mdash; terminal di tahun 3:</strong> D4 = 172,8&times;1,05 = 181,4; V3 = 181,4/(0,12&minus;0,05) = <strong>2.591</strong>; PV = 2.591/1,12&sup3; = <strong>1.844</strong>.</p>
<p><strong>Total: 344,9 + 1.844 = Rp2.189.</strong> Perhatikan: <strong>84% nilai dari terminal!</strong> &mdash; forecast 3 tahun &ldquo;detail&rdquo; hanya menyumbang 16%. <strong>Fokuskan energimu ke asumsi terminal.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Gordon dengan g &ge; r.</strong> Jika g &ge; r, rumus D1/(r&minus;g) memberi <strong>negatif atau tak hingga</strong> &mdash; model <em>rusak</em>. Tidak ada perusahaan tumbuh &ge; cost of capital <em>selamanya</em>. <strong>Solusi:</strong> multistage (fase tumbuh tinggi &rarr; fase mature dengan g &lt; r). Soal yang memberi g = 15%, r = 10% untuk Gordon sedang mengujimu &mdash; <strong>jawab: model tidak valid</strong>.</p>
</div>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Gordon Growth &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> dividen tahun depan Rp120, g = 6%, r = 11%. Nilai wajar?</p>
<p><strong>Langkah 1:</strong> V0 = D1/(r&minus;g) = 120/(0,11&minus;0,06) = 120/0,05 = <strong>Rp2.400</strong>.</p>
<p><strong>Langkah 2 &mdash; sensitivitas:</strong> jika g = 7% &rarr; 120/0,04 = <strong>Rp3.000</strong> (+25%!). Jika r = 12% &rarr; 120/0,06 = <strong>Rp2.000</strong> (&minus;17%!).</p>
<p><strong>Pelajaran:</strong> <strong>r &minus; g kecil = nilai meledak.</strong> Saat r &asymp; g, model menjadi <em>sangat tidak stabil</em> &mdash; dan asumsi &ldquo;g selamanya&rdquo; hampir pasti salah (tidak ada perusahaan tumbuh 6% selamanya!). <strong>Gordon = untuk perusahaan <em>mature</em> &amp; stabil saja.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): FCFF dari laporan keuangan</summary>
<p><strong>Soal:</strong> EBIT Rp500M, pajak 25%, depresiasi Rp80M, capex Rp120M, &Delta;WC Rp30M. Hitung FCFF.</p>
<p><strong>Langkah 1:</strong> NOPAT = 500&times;(1&minus;0,25) = <strong>375</strong>.</p>
<p><strong>Langkah 2:</strong> FCFF = 375 + 80 &minus; 120 &minus; 30 = <strong>Rp305M</strong>.</p>
<p><strong>Cek intuisi:</strong> laba akuntansi (375) &ne; kas (305) &mdash; selisih 70 = <em>investasi</em> (capex + WC) dikurangi <em>non-kas</em> (depresiasi). <strong>Perusahaan bisa &ldquo;laba&rdquo; tapi <em>kehabisan kas</em></strong> jika capex &gt; depresiasi + laba. Inilah kenapa FCFF &gt; laba untuk valuasi.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: FCFF vs FCFE &mdash; siapa dapat apa</summary>
<p><strong>Soal:</strong> FCFF Rp305M, bunga (1&minus;pajak) Rp45M, net borrowing Rp60M. FCFE? Kapan pakai mana?</p>
<p><strong>Langkah 1:</strong> FCFE = 305 &minus; 45 + 60 = <strong>Rp320M</strong>.</p>
<p><strong>Pilih model:</strong> <strong>FCFF + WACC</strong> &rarr; nilai <em>perusahaan</em> (lalu kurangi utang = nilai ekuitas). <strong>FCFE + cost of equity</strong> &rarr; langsung nilai <em>ekuitas</em>. <strong>Hasil harus sama</strong> jika konsisten &mdash; jika beda jauh, ada asumsi yang bocor (biasanya <em>leverage</em> berubah!).</p>
<p><strong>Aturan:</strong> leverage <em>stabil</em> &rarr; FCFE lebih simpel. Leverage <em>berubah</em> (LBO, restrukturisasi) &rarr; <strong>FCFF wajib</strong> (WACC ikut berubah tiap tahun!).</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Nilai perusahaan vs nilai ekuitas.</strong> FCFF + WACC = nilai <strong>perusahaan</strong> (enterprise value). Untuk nilai <em>per saham</em>: <strong>kurangi utang bersih, bagi saham beredar!</strong> Lupa langkah ini = menjawab &ldquo;Rp500M&rdquo; saat yang ditanya &ldquo;per saham&rdquo; &mdash; kesalahan 1 langkah yang menghapus semua perhitungan benar sebelumnya.</p>
</div>
<details className="worked">
<summary>📐 Contoh 3: Multistage DDM &mdash; dua fase</summary>
<p><strong>Soal:</strong> D0 = Rp100, tumbuh 20% selama 3 tahun, lalu g = 5% selamanya. r = 12%.</p>
<p><strong>Langkah 1 &mdash; dividen fase 1:</strong> D1 = 120, D2 = 144, D3 = 172,8.</p>
<p><strong>Langkah 2 &mdash; PV fase 1:</strong> 120/1,12 + 144/1,12&sup2; + 172,8/1,12&sup3; = 107,1 + 114,8 + 123,0 = <strong>344,9</strong>.</p>
<p><strong>Langkah 3 &mdash; terminal di tahun 3:</strong> D4 = 172,8&times;1,05 = 181,4; V3 = 181,4/(0,12&minus;0,05) = <strong>2.591</strong>; PV = 2.591/1,12&sup3; = <strong>1.844</strong>.</p>
<p><strong>Total: 344,9 + 1.844 = Rp2.189.</strong> Perhatikan: <strong>84% nilai dari terminal!</strong> &mdash; forecast 3 tahun &ldquo;detail&rdquo; hanya menyumbang 16%. <strong>Fokuskan energimu ke asumsi terminal.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Residual Income &mdash; kapan berguna</summary>
<p><strong>Soal:</strong> book value Rp1.000M, ROE 15%, r = 10%, book tumbuh 5%/tahun. Nilai via RI (2 tahun + terminal)?</p>
<p><strong>Langkah 1 &mdash; RI per tahun:</strong> RI1 = (0,15&minus;0,10)&times;1.000 = <strong>50</strong>; B1 = 1.050; RI2 = 0,05&times;1.050 = <strong>52,5</strong>.</p>
<p><strong>Langkah 2 &mdash; terminal:</strong> RI3 = 0,05&times;1.102,5 = 55,1; asumsi RI <em>flat</em> setelahnya &rarr; V2 = 55,1/0,10 = 551.</p>
<p><strong>Langkah 3:</strong> V0 = 1.000 + 50/1,1 + (52,5+551)/1,1&sup2; = 1.000 + 45,5 + 498,8 = <strong>Rp1.544M</strong>.</p>
<p><strong>Kapan RI unggul:</strong> perusahaan <strong>tidak bayar dividen</strong> (DDM gagal!) &amp; <strong>FCF negatif</strong> (FCFF bermasalah!) &mdash; tapi punya <em>book value</em> bermakna. <strong>RI = senjata untuk perusahaan <em>growth</em> yang belum menghasilkan kas.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Ketiga model harus konsisten</summary>
<p><strong>Soal:</strong> DDM memberi Rp2.400, FCFF Rp2.100, RI Rp2.800. Apa yang salah?</p>
<p><strong>Diagnosis:</strong> <strong>asumsi tidak konsisten.</strong> Kemungkinan: (1) <em>payout ratio</em> DDM &ne; tersirat FCFE; (2) <em>growth</em> terminal beda antar model; (3) <em>clean surplus</em> dilanggar (RI butuh B_t = B_&#123;t&minus;1&#125; + NI &minus; Div!).</p>
<p><strong>Tindakan:</strong> <strong>jangan rata-rata!</strong> Cari <em>sumber</em> perbedaan &mdash; ia mengungkap asumsi mana yang paling lemah. Model yang &ldquo;berbeda&rdquo; = <em>alarm</em>, bukan <em>vote</em>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Gordon dengan g &ge; r.</strong> Jika g &ge; r, rumus D1/(r&minus;g) memberi <strong>negatif atau tak hingga</strong> &mdash; model <em>rusak</em>. Tidak ada perusahaan tumbuh &ge; cost of capital <em>selamanya</em>. <strong>Solusi:</strong> multistage (fase tumbuh tinggi &rarr; fase mature dengan g &lt; r). Soal yang memberi g = 15%, r = 10% untuk Gordon sedang mengujimu &mdash; <strong>jawab: model tidak valid</strong>.</p>
</div>

<PlotlyChart
  data={[{x: ["Tahun 1-5 (forecast)", "Terminal"], y: [16, 84], type: "bar", marker: {color: ["#2a7de1", "#e8a838"]}, name: "Kontribusi nilai"}]}
  title={"Dari mana datangnya nilai? (tipikal perusahaan growth)"}
  layout={{xaxis: {title: ""}, yaxis: {title: "% dari total nilai"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang = kontribusi forecast detail (5 tahun) vs terminal terhadap total nilai DCF.</p>
<p><strong>Interpretasi:</strong> <strong>84% nilai dari terminal!</strong> Artinya analis yang menghabiskan 90% waktu memodelkan tahun 1&ndash;5 &amp; 10% untuk asumsi terminal telah <strong>terbalik prioritasnya</strong>. <strong>Ketidakpastian terbesar = di terminal</strong> &mdash; di sanalah <em>margin of safety</em> &amp; <em>scenario analysis</em> paling dibutuhkan.</p>
</div>

<PlotlyChart
  data={[{x: ["Tahun 1-5 (forecast)", "Terminal"], y: [16, 84], type: "bar", marker: {color: ["#2a7de1", "#e8a838"]}, name: "Kontribusi nilai"}]}
  title={"Dari mana datangnya nilai? (tipikal perusahaan growth)"}
  layout={{xaxis: {title: ""}, yaxis: {title: "% dari total nilai"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang = kontribusi forecast detail (5 tahun) vs terminal terhadap total nilai DCF.</p>
<p><strong>Interpretasi:</strong> <strong>84% nilai dari terminal!</strong> Artinya analis yang menghabiskan 90% waktu memodelkan tahun 1&ndash;5 &amp; 10% untuk asumsi terminal telah <strong>terbalik prioritasnya</strong>. <strong>Ketidakpastian terbesar = di terminal</strong> &mdash; di sanalah <em>margin of safety</em> &amp; <em>scenario analysis</em> paling dibutuhkan.</p>
</div>
<h2 id="fcff">FCFF/FCFE — Kas untuk Semua vs Pemilik</h2>
<p><strong>Definisi.</strong> <strong>FCFF</strong> = kas untuk <em>semua</em> investor (utang + ekuitas): NI + NCC + Int(1−T) − FCInv − WCInv. <strong>FCFE</strong> = untuk <em>pemegang saham</em>: FCFF − Int(1−T) + Net Borrowing. <strong>Nilai perusahaan</strong> = PV(FCFF) @ WACC; <strong>nilai ekuitas</strong> = PV(FCFE) @ r_e = Firm value − utang + kas.</p>
<p>Pilih: <strong>FCFF</strong> jika leverage berubah-ubah; <strong>FCFE</strong> jika struktur modal stabil.</p>
<Tex math={String.raw`FCFF = NI + NCC + Int(1-T) - FCInv - WCInv`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`NI`} />: laba bersih</li>
<li><Tex math={String.raw`NCC`} />: beban non-kas (depresiasi, amortisasi)</li>
<li><Tex math={String.raw`Int(1-T)`} />: bunga setelah pajak (kembali ditambahkan — milik semua investor)</li>
<li><Tex math={String.raw`FCInv, WCInv`} />: investasi aset tetap &amp; modal kerja</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> FCFF seperti <strong>air bersih dari mata air</strong> (untuk semua penduduk desa = semua investor); FCFE = air yang sampai ke <em>rumahmu</em> setelah pipa desa (utang) mengambil bagiannya. Nilai rumahmu = PV air yang sampai.</p>
<p><strong>Kapan dipakai:</strong> Valuasi absolut utama; DCF = standar industri.</p>
<p><strong>Pendalaman intuisi &mdash; terminal value = 70&ndash;80% nilai.</strong> Mengejutkan tapi benar: untuk perusahaan tumbuh, <strong>sebagian besar &ldquo;nilai&rdquo; datang dari periode terminal</strong> (tahun 6 &rarr; selamanya). Artinya: valuasimu <em>sangat sensitif</em> ke <strong>g</strong> (growth terminal) &amp; <strong>r</strong> (discount rate). <strong>Perubahan g 1% bisa mengubah nilai 15&ndash;20%!</strong> Inilah kenapa analis senior menghabiskan 80% waktu untuk <em>asumsi terminal</em> &mdash; bukan untuk forecast tahun 1&ndash;5.</p><p><strong>Pendalaman intuisi &mdash; terminal value = 70&ndash;80% nilai.</strong> Mengejutkan tapi benar: untuk perusahaan tumbuh, <strong>sebagian besar &ldquo;nilai&rdquo; datang dari periode terminal</strong> (tahun 6 &rarr; selamanya). Artinya: valuasimu <em>sangat sensitif</em> ke <strong>g</strong> (growth terminal) &amp; <strong>r</strong> (discount rate). <strong>Perubahan g 1% bisa mengubah nilai 15&ndash;20%!</strong> Inilah kenapa analis senior menghabiskan 80% waktu untuk <em>asumsi terminal</em> &mdash; bukan untuk forecast tahun 1&ndash;5.</p><details className="worked">
<summary>📐 Contoh: FCFF 1 tahun (klik untuk buka)</summary>
<p>NI Rp200M, depresiasi Rp80M, bunga Rp50M (T=22%), capex Rp150M, ΔWC Rp40M.</p>
<p><strong>FCFF</strong> = 200 + 80 + 50×0,78 − 150 − 40 = 200+80+39−150−40 = <strong>Rp129M</strong>.</p>
<p>Jika FCFF tumbuh 8% 5 thn lalu 4%, WACC 12%: firm value ≈ Rp1,9T. Kurangi utang Rp600M + kas Rp100M → <strong>ekuitas Rp1,4T</strong> → /saham beredar = harga wajar.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): FCFF dari laporan keuangan</summary>
<p><strong>Soal:</strong> EBIT Rp500M, pajak 25%, depresiasi Rp80M, capex Rp120M, &Delta;WC Rp30M. Hitung FCFF.</p>
<p><strong>Langkah 1:</strong> NOPAT = 500&times;(1&minus;0,25) = <strong>375</strong>.</p>
<p><strong>Langkah 2:</strong> FCFF = 375 + 80 &minus; 120 &minus; 30 = <strong>Rp305M</strong>.</p>
<p><strong>Cek intuisi:</strong> laba akuntansi (375) &ne; kas (305) &mdash; selisih 70 = <em>investasi</em> (capex + WC) dikurangi <em>non-kas</em> (depresiasi). <strong>Perusahaan bisa &ldquo;laba&rdquo; tapi <em>kehabisan kas</em></strong> jika capex &gt; depresiasi + laba. Inilah kenapa FCFF &gt; laba untuk valuasi.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: FCFF vs FCFE &mdash; siapa dapat apa</summary>
<p><strong>Soal:</strong> FCFF Rp305M, bunga (1&minus;pajak) Rp45M, net borrowing Rp60M. FCFE? Kapan pakai mana?</p>
<p><strong>Langkah 1:</strong> FCFE = 305 &minus; 45 + 60 = <strong>Rp320M</strong>.</p>
<p><strong>Pilih model:</strong> <strong>FCFF + WACC</strong> &rarr; nilai <em>perusahaan</em> (lalu kurangi utang = nilai ekuitas). <strong>FCFE + cost of equity</strong> &rarr; langsung nilai <em>ekuitas</em>. <strong>Hasil harus sama</strong> jika konsisten &mdash; jika beda jauh, ada asumsi yang bocor (biasanya <em>leverage</em> berubah!).</p>
<p><strong>Aturan:</strong> leverage <em>stabil</em> &rarr; FCFE lebih simpel. Leverage <em>berubah</em> (LBO, restrukturisasi) &rarr; <strong>FCFF wajib</strong> (WACC ikut berubah tiap tahun!).</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Nilai perusahaan vs nilai ekuitas.</strong> FCFF + WACC = nilai <strong>perusahaan</strong> (enterprise value). Untuk nilai <em>per saham</em>: <strong>kurangi utang bersih, bagi saham beredar!</strong> Lupa langkah ini = menjawab &ldquo;Rp500M&rdquo; saat yang ditanya &ldquo;per saham&rdquo; &mdash; kesalahan 1 langkah yang menghapus semua perhitungan benar sebelumnya.</p>
</div>
<PlotlyChart
  data={[{x: ["Firm value<br>(PV FCFF)", "Kurang: utang", "Tambah: kas", "Equity value"], y: [1900, -600, 100, 1400], type: "bar", marker: {color: ["#2a7de1","#ef4444","#16a34a","#2a7de1"]}, text: ["1900","−600","+100","1400"], textposition: "outside"}]}
  title={"Bridge: firm value → equity value (Rp M)"}
  layout={{yaxis: {title: "Rp M"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Mulai dari firm value, kurangi utang, tambah kas = equity value.</p>
<p><strong>Interpretasi:</strong> Equity = <strong>residu</strong> setelah kreditor. Perusahaan 'bernilai' Rp1,9T tapi ekuitas cuma Rp1,4T — <strong>leverage memakan nilai</strong>. Inilah kenapa valuasi ekuitas wajib lewat bridge ini, bukan langsung.</p>
</div>
<h2 id="ri">Residual Income & Multiples — Dua Lensa</h2>
<p><strong>Definisi.</strong> <strong>Residual income</strong>: V0 = book value + PV 'laba sisa' (laba <em>di atas</em> biaya ekuitas; lihat rumus di bawah). Cocok saat <strong>FCF negatif</strong> (growth capex besar) tapi <strong>book value</strong> andal. <strong>Multiples</strong>: P/E, EV/EBITDA, P/B, P/S — bandingkan <em>relatif</em> ke peers.</p>
<p><strong>Jebakan multiples</strong>: P/E rendah bisa = value trap (E sementara); EV/EBITDA lebih bersih (netral struktur modal); pastikan <strong>peers sebanding</strong> (growth, risiko, akuntansi!).</p>
<Tex math={String.raw`V_0 = B_0 + \sum_{t=1}^{\infty}\frac{RI_t}{(1+r)^t} \quad;\quad RI_t = NI_t - r \times B_{t-1}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`B_0`} />: book value ekuitas kini (jangkar!)</li>
<li><Tex math={String.raw`RI_t`} />: 'laba sisa' — yang melebihi required return</li>
<li>RRI positif persisten = moat (return &gt; biaya modal)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Residual income seperti <strong>menilai kos dari uang muka + 'lebihnya'</strong>: B0 = harga tanah (pasti), RI = sewa di atas bunga deposito (nilai tambah). Multiples seperti <strong>harga pasaran tanah tetangga</strong> — cepat, tapi bisa sekampung salah harga (bubble sektor!).</p>
<p><strong>Kapan dipakai:</strong> RI: bank (book andal), FCF negatif. Multiples: screening & cross-check DCF.</p>
<p><strong>Pendalaman intuisi &mdash; relative valuation = cermin, bukan timbangan.</strong> PER 15&times; &ldquo;murah&rdquo; vs industri 20&times; &mdash; tapi jika <em>seluruh industri</em> overvalued, &ldquo;murah relatif&rdquo; = masih mahal! <strong>Multiple = cermin pasar</strong> (apa kata orang lain), <strong>DCF = timbangan intrinsik</strong> (apa kata arus kas). Pakai keduanya: DCF untuk <em>keyakinan</em>, multiple untuk <em>sanity check</em>. Jika DCF bilang 100 dan pasar bilang 50 &rarr; <em>tantang asumsimu</em> sebelum menantang pasar.</p><p><strong>Pendalaman intuisi &mdash; relative valuation = cermin, bukan timbangan.</strong> PER 15&times; &ldquo;murah&rdquo; vs industri 20&times; &mdash; tapi jika <em>seluruh industri</em> overvalued, &ldquo;murah relatif&rdquo; = masih mahal! <strong>Multiple = cermin pasar</strong> (apa kata orang lain), <strong>DCF = timbangan intrinsik</strong> (apa kata arus kas). Pakai keduanya: DCF untuk <em>keyakinan</em>, multiple untuk <em>sanity check</em>. Jika DCF bilang 100 dan pasar bilang 50 &rarr; <em>tantang asumsimu</em> sebelum menantang pasar.</p><details className="worked">
<summary>📐 Contoh: Bedah P/E 3x Tono (klik untuk buka)</summary>
<p>Saham tambang: P/E 3x (trailing). <strong>EV/EBITDA</strong> 2,5x vs peers 6x — 'murah' juga?</p>
<p><strong>Cek E</strong>: EBITDA trailing Rp800M (puncak siklus); <strong>forward</strong> Rp300M (harga komoditas turun 40%). EV/EBITDA <em>forward</em> = 6,7x — <strong>MAHAL</strong>!</p>
<p><strong>Pelajaran:</strong> multiples trailing = spion. Selalu pakai <strong>forward/normalized earnings</strong>. DCF dengan asumsi siklus = jangkar.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Residual Income &mdash; kapan berguna</summary>
<p><strong>Soal:</strong> book value Rp1.000M, ROE 15%, r = 10%, book tumbuh 5%/tahun. Nilai via RI (2 tahun + terminal)?</p>
<p><strong>Langkah 1 &mdash; RI per tahun:</strong> RI1 = (0,15&minus;0,10)&times;1.000 = <strong>50</strong>; B1 = 1.050; RI2 = 0,05&times;1.050 = <strong>52,5</strong>.</p>
<p><strong>Langkah 2 &mdash; terminal:</strong> RI3 = 0,05&times;1.102,5 = 55,1; asumsi RI <em>flat</em> setelahnya &rarr; V2 = 55,1/0,10 = 551.</p>
<p><strong>Langkah 3:</strong> V0 = 1.000 + 50/1,1 + (52,5+551)/1,1&sup2; = 1.000 + 45,5 + 498,8 = <strong>Rp1.544M</strong>.</p>
<p><strong>Kapan RI unggul:</strong> perusahaan <strong>tidak bayar dividen</strong> (DDM gagal!) &amp; <strong>FCF negatif</strong> (FCFF bermasalah!) &mdash; tapi punya <em>book value</em> bermakna. <strong>RI = senjata untuk perusahaan <em>growth</em> yang belum menghasilkan kas.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Ketiga model harus konsisten</summary>
<p><strong>Soal:</strong> DDM memberi Rp2.400, FCFF Rp2.100, RI Rp2.800. Apa yang salah?</p>
<p><strong>Diagnosis:</strong> <strong>asumsi tidak konsisten.</strong> Kemungkinan: (1) <em>payout ratio</em> DDM &ne; tersirat FCFE; (2) <em>growth</em> terminal beda antar model; (3) <em>clean surplus</em> dilanggar (RI butuh B_t = B_&#123;t&minus;1&#125; + NI &minus; Div!).</p>
<p><strong>Tindakan:</strong> <strong>jangan rata-rata!</strong> Cari <em>sumber</em> perbedaan &mdash; ia mengungkap asumsi mana yang paling lemah. Model yang &ldquo;berbeda&rdquo; = <em>alarm</em>, bukan <em>vote</em>.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Satu Arus Kas, Tiga Lensa</h2>
      <p>DDM, FCFF, RI = <strong>tiga lensa untuk arus kas yang sama</strong>:</p>
      <ol>
        <li><strong>DDM:</strong> lensa <em>pemegang saham</em> &mdash; &ldquo;dividen apa yang sampai ke saya?&rdquo; (perusahaan mature).</li>
        <li><strong>FCFF/FCFE:</strong> lensa <em>perusahaan</em> &mdash; &ldquo;berapa kas yang dihasilkan bisnis?&rdquo; (umum, paling fleksibel).</li>
        <li><strong>RI:</strong> lensa <em>akuntansi</em> &mdash; &ldquo;berapa laba di atas biaya modal?&rdquo; (growth, belum bayar dividen).</li>
      </ol>
      <p><strong>Ketiganya harus konvergen.</strong> Jika tidak &rarr; <em>debug asumsimu</em>, jangan <em>rata-rata hasilnya</em>. Dan ingat: <strong>terminal = 80% nilai = 80% perhatianmu.</strong></p>

      <h3>🎙️ Debat: &ldquo;DCF itu pseudosains&rdquo;</h3>
      <p><strong>Kritikus:</strong> &ldquo;DCF = <em>garbage in, gospel out</em>. Asumsi g &amp; r bisa diutak-atik untuk membenarkan <em>harga berapa pun</em>. Ini numerologi, bukan sains.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Justru itu <em>kekuatannya</em>: DCF <strong>memaksa</strong> asumsi eksplisit &amp; konsisten. Tanpa DCF, &lsquo;menurutku murah&rsquo; = opini tanpa akuntabilitas. DCF yang jujur = <em>rentang skenario</em> + <em>sensitivitas</em>, bukan angka tunggal.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>keduanya benar sebagian.</strong> DCF titik-tunggal = pseudosains; DCF sebagai <em>kerangka berpikir</em> (skenario + sensitivitas + margin of safety) = disiplin terbaik yang ada. <strong>Nilaimu = kualitas asumsimu. DCF hanya kalkulator yang jujur.</strong></p>
      <h3>📊 Data Corner: Sensitivitas dua arah</h3>
      <p><strong>Data:</strong> base V = 2.400 (r = 11%, g = 6%). Tabel: r=10% &rarr; 3.000; r=12% &rarr; 2.000; g=5% &rarr; 2.000; g=7% &rarr; 3.000.</p>
      <p><strong>Keputusan:</strong> rentang <strong>2.000&ndash;3.000</strong> (&plusmn;25%) hanya dari &plusmn;1% asumsi! <strong>Margin of safety 25%</strong> dari base (beli &lt; 1.800) = proteksi terhadap <em>ketidakpastian asumsi</em>, bukan terhadap &ldquo;pasar salah&rdquo;.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;P/E rendah = murah. Screening P/E terendah = strategi value.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Kasus Tono: P/E 3x = <strong>value trap</strong> (E puncak siklus). P/E rendah sering = <strong>pasar benar</strong> (E akan turun / risiko tinggi). Value investing = beli <em>di bawah nilai intrinsik</em> (butuh DCF), bukan beli P/E rendah.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;DCF terlalu sensitif asumsi — tidak berguna. Pakai multiples saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Sensitivitas = <strong>fitur, bukan bug</strong>: DCF memaksa eksplisit tentang growth & risiko (di mana keyakinanmu?). Multiples <em>menyembunyikan</em> asumsi yang sama (P/E 15x = implisit growth X%). <strong>Pakai keduanya</strong>: DCF jangkar, multiples cross-check.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;PER rendah = murah = beli.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> PER rendah bisa berarti <strong>risiko tinggi</strong> (r besar), <strong>growth rendah</strong> (g kecil), atau <strong>jebakan nilai</strong> (<em>value trap</em> &mdash; laba akan turun!). PER = (1&minus;b)/(r&minus;g) &mdash; ia <em>seharusnya</em> rendah jika r tinggi/g rendah. <strong>Murah relatif ≠ murah intrinsik.</strong> Selalu tanya: <em>kenapa</em> PER-nya rendah?</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;DCF presisi = DCF akurat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> DCF dengan 5 desimal dari asumsi ngawur = <strong>presisi palsu</strong>. Ketidakpastian terminal (&plusmn;20%) mendominasi. <strong>Praktik pro:</strong> valuasi = <em>rentang</em> (bear/base/bull), bukan titik. Analis yang memberi &ldquo;target Rp2.347,50&rdquo; sedang menjual <em>kepastian palsu</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;PER rendah = murah = beli.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> PER rendah bisa berarti <strong>risiko tinggi</strong> (r besar), <strong>growth rendah</strong> (g kecil), atau <strong>jebakan nilai</strong> (<em>value trap</em> &mdash; laba akan turun!). PER = (1&minus;b)/(r&minus;g) &mdash; ia <em>seharusnya</em> rendah jika r tinggi/g rendah. <strong>Murah relatif ≠ murah intrinsik.</strong> Selalu tanya: <em>kenapa</em> PER-nya rendah?</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;DCF presisi = DCF akurat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> DCF dengan 5 desimal dari asumsi ngawur = <strong>presisi palsu</strong>. Ketidakpastian terminal (&plusmn;20%) mendominasi. <strong>Praktik pro:</strong> valuasi = <em>rentang</em> (bear/base/bull), bukan titik. Analis yang memberi &ldquo;target Rp2.347,50&rdquo; sedang menjual <em>kepastian palsu</em>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Terminal value ≤ 80% dari nilai.</strong> Jika 95%, valuasimu = tebakan growth abadi, bukan analisis. Perpanjang explicit period atau akui ketidakpastian (scenario analysis).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Normalisasi earnings siklikal.</strong> Untuk komoditas/siklus: pakai rata-rata 5–10 tahun (atau mid-cycle), bukan trailing peak. Ini satu-satunya obat value trap.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist valuasi 5 menit:</strong> (1) <strong>Konsisten?</strong> &mdash; DDM/FCFF/RI searah? (2) <strong>Terminal waras?</strong> &mdash; g &lt; r, g &le; GDP+inflasi. (3) <strong>Sensitivitas?</strong> &mdash; &plusmn;1% r/g mengubah nilai berapa? (4) <strong>Margin of safety?</strong> &mdash; beli hanya jika harga &lt; 70&ndash;80% nilai. <strong>Empat cek, lima menit, sebelum satu rupiah dipertaruhkan.</strong></p>
</div>
<div className="tip">
<p><strong>💡 Checklist valuasi 5 menit:</strong> (1) <strong>Konsisten?</strong> &mdash; DDM/FCFF/RI searah? (2) <strong>Terminal waras?</strong> &mdash; g &lt; r, g &le; GDP+inflasi. (3) <strong>Sensitivitas?</strong> &mdash; &plusmn;1% r/g mengubah nilai berapa? (4) <strong>Margin of safety?</strong> &mdash; beli hanya jika harga &lt; 70&ndash;80% nilai. <strong>Empat cek, lima menit, sebelum satu rupiah dipertaruhkan.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator DDM 2-Stage</h2>
<p>Hitung nilai wajar saham dividen dengan growth 2 tahap.</p>
<PyodideLab
  title={"Lab 1 — DDM 2-Stage"}
  hint={"Ubah G_STABIL 0.05 -> 0.07. Nilai meledak — terminal value sangat sensitif!"}
  defaultCode={"# DDM 2-stage\nD0, G_TINGGI, N, G_STABIL, R = 400, 0.12, 5, 0.05, 0.11  # ubah sesukamu\n\npv_div = 0\nd = D0\nfor t in range(1, N+1):\n    d *= (1+G_TINGGI)\n    pv_div += d/(1+R)**t\nd_next = d*(1+G_STABIL)\npN = d_next/(R-G_STABIL)\npv_term = pN/(1+R)**N\np0 = pv_div + pv_term\n\nprint(f\"PV dividen 5 thn : Rp{pv_div:,.0f}\")\nprint(f\"PV terminal      : Rp{pv_term:,.0f} ({pv_term/p0:.0%} dari nilai!)\")\nprint(f\"Nilai wajar P0   : Rp{p0:,.0f}\")\nprint(\"\\nTerminal mendominasi -> uji sensitivitas g & r selalu!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Builder FCFF & Cek Multiples</h2>
<p>Bangun FCFF dari komponennya dan bandingkan multiples trailing vs forward.</p>
<PyodideLab
  title={"Lab 2 — Builder FCFF"}
  hint={"Ubah WC 40 -> 120 (modal kerja membengkak). FCFF anjlok — kas 'dimakan' operasional!"}
  defaultCode={"# Builder FCFF + jebakan multiples\nNI, NCC, BUNGA, TAX = 200, 80, 50, 0.22\nCAPEX, WC = 150, 40   # ubah WC sesukamu (Rp M)\n\nfcff = NI + NCC + BUNGA*(1-TAX) - CAPEX - WC\nprint(f\"FCFF = {NI}+{NCC}+{BUNGA*(1-TAX):.0f}-{CAPEX}-{WC} = Rp{fcff:.0f}M\")\nprint()\n# Jebakan multiples: trailing vs forward\nEV = 2000\nEBITDA_TRAIL, EBITDA_FWD = 800, 300\nprint(f\"EV/EBITDA trailing: {EV/EBITDA_TRAIL:.1f}x  <- 'murah'?\")\nprint(f\"EV/EBITDA forward : {EV/EBITDA_FWD:.1f}x  <- MAHAL! (value trap)\")\nprint(\"\\nSelalu pakai earnings ternormalisasi/forward untuk siklikal.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Dividen stabil & predictible → <strong>DDM</strong></h3>
<p><strong>Kenapa:</strong> Dividen = kas ke pemegang saham.</p>
<p><strong>Contoh nyata:</strong> Bank, utilitas.</p>
</div>
<div className="decision-card">
<h3>2. FCF negatif (growth) tapi book andal → <strong>Residual income</strong></h3>
<p><strong>Kenapa:</strong> Berjangkar B0; tidak butuh FCF positif.</p>
<p><strong>Contoh nyata:</strong> Bank ekspansi, asuransi.</p>
</div>
<div className="decision-card">
<h3>3. Leverage berubah-ubah → <strong>FCFF (lalu bridge)</strong></h3>
<p><strong>Kenapa:</strong> FCFE tidak stabil jika utang fluktuatif.</p>
<p><strong>Contoh nyata:</strong> LBO, restrukturisasi.</p>
</div>
<div className="decision-card">
<h3>4. Screening cepat → <strong>Multiples FORWARD + cross-check DCF</strong></h3>
<p><strong>Kenapa:</strong> Cepat tapi rawan trap.</p>
<p><strong>Contoh nyata:</strong> EV/EBITDA forward vs peers.</p>
</div>
<div className="decision-card">
<h3>5. Valuasi saham → <strong>Tiga model + sensitivitas + margin of safety</strong></h3>
<p><strong>Kenapa:</strong> Satu model = satu sudut pandang; terminal = 80% nilai.</p>
<p><strong>Contoh nyata:</strong> Gordon g 7% vs 6% = nilai +25% — asumsi terminal menentukan segalanya.</p>
</div>
<div className="decision-card">
<h3>5. Valuasi saham → <strong>Tiga model + sensitivitas + margin of safety</strong></h3>
<p><strong>Kenapa:</strong> Satu model = satu sudut pandang; terminal = 80% nilai.</p>
<p><strong>Contoh nyata:</strong> Gordon g 7% vs 6% = nilai +25% — asumsi terminal menentukan segalanya.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Absolut dulu</strong> (DCF), relatif kemudian.</li><li><strong>Forward/normalized</strong> untuk siklikal.</li><li><strong>Bridge</strong>: firm → equity.</li><li><strong>Uji sensitivitas</strong> g &amp; r.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Saham 'Termurah' P/E 3x</h2>
<div className="callout">
<p>Tono: beli saham tambang P/E 3x (trailing). Setahun: −50%, dividen dipotong.</p>
<p><strong>Vignette lanjutan.</strong> Tono membeli saham tambang P/E 3&times; (trailing) &mdash; &ldquo;termurah di bursa&rdquo;. Setahun: &minus;50%, dividen dipotong. Ternyata ia membeli di <em>puncak siklus</em> komoditas: E trailing = laba puncak (tidak berkelanjutan), dan pasar <em>sudah</em> mendiskon penurunan.</p>
<p><strong>Pertanyaan:</strong> (a) Mekanisme value trap? (b) Tiga cek sebelum beli &lsquo;murah&rsquo;? (c) Valuasi yang benar? (d) Jika analis memakai Gordon dengan g = 7% &rarr; Rp2.400, tapi g wajar = 4% &rarr; Rp1.714 &mdash; apa pelajaran sensitivitas? (e) Rancang kerangka valuasi anti-value-trap.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>E puncak siklus</strong> → P/E trailing rendah semu; forward E kolaps → P/E forward tinggi. Pasar <em>sudah</em> mendiskon.</p>
<p>(b) <strong>(1)</strong> EV/EBITDA forward vs peers; <strong>(2)</strong> posisi siklus komoditas (harga vs mid-cycle); <strong>(3)</strong> DCF dengan asumsi siklus.</p>
<p>(c) <strong>DCF dengan normalized earnings</strong> (rata-rata siklus) + scenario (bull/base/bear komoditas). 'Murah' = di bawah nilai, bukan P/E rendah.</p>
<p>(d) <strong>Sensitivitas brutal:</strong> g 7% &rarr; Rp2.400; g 4% &rarr; Rp1.714 &mdash; <strong>selisih 29% dari 3 poin persen asumsi!</strong> Analis yang &ldquo;yakin&rdquo; dengan Rp2.400 sebenarnya bertaruh pada asumsi yang ia tidak uji. <strong>Pelajaran: setiap valuasi wajib tabel sensitivitas &plusmn;1&ndash;2% untuk r &amp; g.</strong> Tanpa itu, angka target = dekorasi.</p>
<p>(e) <strong>Kerangka anti-trap:</strong> (1) <strong>posisi siklus</strong> &mdash; di mana kita dalam siklus? (harga komoditas vs mid-cycle); (2) <strong>normalized earnings</strong> &mdash; DCF pakai rata-rata siklus, bukan puncak; (3) <strong>tiga model</strong> (DDM/FCFF/RI) + rekonsiliasi; (4) <strong>skenario</strong> bear/base/bull; (5) <strong>margin of safety 25%+</strong> dari base. <strong>P/E rendah tanpa konteks siklus = undangan ke value trap.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Melampaui DCF Standar</h2>
      <h3>1. APV &mdash; saat leverage berubah</h3>
      <p>LBO: utang besar &rarr; dilunasi &rarr; WACC <em>berubah tiap tahun</em>. Solusi: <strong>APV</strong> = nilai <em>unlevered</em> + PV <em>tax shield</em>. Lebih transparan dari WACC tahunan yang berubah-ubah. <strong>Aturan:</strong> struktur modal <em>dinamis</em> &rarr; APV; <em>stabil</em> &rarr; WACC cukup.</p>
      <h3>2. Real options &mdash; nilai fleksibilitas</h3>
      <p>Perusahaan tambang dengan opsi ekspansi = <strong>opsi call</strong> pada harga komoditas! DCF standar (arus kas <em>statis</em>) <em>meremehkan</em> nilai fleksibilitas. <strong>Kapan material:</strong> volatilitas tinggi + keputusan <em>irreversible</em> + manajemen <em>fleksibel</em>. Untuk perusahaan <em>growth</em> dengan banyak &ldquo;opsi&rdquo;, DCF saja = <em>undervalue</em>.</p>
      <h3>3. ESG &amp; valuasi &mdash; r atau g?</h3>
      <p>ESG masuk via dua jalur: <strong>r</strong> (risiko regulasi/reputasi &rarr; <em>discount rate</em> lebih tinggi untuk emiten kotor) atau <strong>g</strong> (transisi energi &rarr; <em>growth</em> lebih rendah). Praktis: <em>adjust</em> eksplisit &amp; transparan &mdash; jangan &ldquo;sembunyikan&rdquo; di angka. <strong>Yang tidak diukur eksplisit = tidak bisa didebat.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Gordon kilat</h3>
      <p>D1 = Rp200, g = 5%, r = 12%. Nilai?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>200/(0,12&minus;0,05) = 200/0,07 = <strong>Rp2.857</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; FCFF kilat</h3>
      <p>NOPAT 400, dep 50, capex 100, &Delta;WC 20. FCFF?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>400 + 50 &minus; 100 &minus; 20 = <strong>Rp330</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; Sensitivitas</h3>
      <p>V = 120/(0,11&minus;0,06) = 2.400. Jika r naik ke 12%, nilai baru &amp; % perubahan?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>120/0,06 = <strong>2.000</strong> &rarr; <strong>&minus;16,7%</strong>. Pelajaran: 1% r = &minus;17% nilai!</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>Gordon: D1 = 100, g = 12%, r = 10%. Nilai?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Model tidak valid!</strong> g &gt; r &rarr; penyebut negatif. Jawaban: pakai <em>multistage</em>, bukan Gordon.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. D0=400, g=12% 5thn, g_stabil=5%, r=11%. P0?"}
  options={
    ["Rp2.073",
    "≈ Rp9.391 (terminal 78%!)",
    "Rp12.333",
    "Rp7.318"]
  }
  correct={1}
  explanation={"Benar: PV dividen 2.073 + PV terminal 7.318 = 9.391. Terminal mendominasi — uji sensitivitas wajib."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. NI 200, dep 80, bunga 50 (T=22%), capex 150, ΔWC 40. FCFF?"}
  options={
    ["Rp129M",
    "Rp200M",
    "Rp90M",
    "Rp280M"]
  }
  correct={0}
  explanation={"Benar: 200+80+39−150−40 = 129. Bunga kembali ditambah setelah pajak (milik semua investor)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Firm value Rp1,9T, utang Rp600M, kas Rp100M. Equity value?"}
  options={
    ["Rp1,9T",
    "Rp1,4T",
    "Rp2,5T",
    "Rp1,2T"]
  }
  correct={1}
  explanation={"Benar: 1.900 − 600 + 100 = 1.400. Equity = residu setelah kreditor — bridge wajib."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Kapan residual income lebih baik dari DCF?"}
  options={
    ["Selalu",
    "FCF negatif tapi book value andal (bank ekspansi)",
    "Tidak pernah",
    "Hanya startup"]
  }
  correct={1}
  explanation={"Benar: RI berjangkar B0 — tidak butuh FCF positif. Cocok untuk bank/asuransi dengan book bermakna."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. EV/EBITDA trailing 2,5x vs forward 6,7x. Kesimpulan?"}
  options={
    ["Murah — beli",
    "Value trap: E trailing puncak siklus; forward mahal",
    "Peers salah",
    "EV salah hitung"]
  }
  correct={1}
  explanation={"Benar: trailing = spion. Untuk siklikal selalu pakai forward/normalized. 'Murah' semu = jebakan Tono."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Gordon: D1=Rp120, g=6%, r=11% → Rp2.400. Jika g direvisi ke 4%, nilai baru?"}
  options={
    ["Rp3.000 (naik 25%)",
    "Rp1.714 (turun 29%)",
    "Rp2.000 (turun 17%)",
    "Tetap Rp2.400"]}
  correct={1}
  explanation={"Benar: 120/(0,11−0,04)=120/0,07=Rp1.714, turun 29%. Pelajaran: asumsi g terminal mendominasi valuasi — harus ≤ pertumbuhan ekonomi jangka panjang."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>DDM</strong>: Gordon untuk stabil; 2-stage untuk transisi; terminal dominan.</li>
<li><strong>FCFF</strong> (semua investor) vs <strong>FCFE</strong> (pemegang saham); bridge ke equity.</li>
<li><strong>Residual income</strong>: V0 = B0 + PV(RI); untuk book andal &amp; FCF negatif.</li>
<li><strong>Multiples</strong>: cepat tapi relatif; waspada value trap (pakai forward!).</li>
<li><strong>Aturan</strong>: DCF jangkar, multiples cross-check; sensitivitas selalu.</li>
<li><strong>Kapan TIDAK multiples saja</strong>: siklikal, one-off, peers tak sebanding.</li>

<li><strong>DDM:</strong> untuk dividen stabil; Gordon butuh g &lt; r.</li>
<li><strong>FCFF/FCFE:</strong> paling umum; FCFF + WACC = enterprise value.</li>
<li><strong>RI:</strong> untuk growth tanpa dividen/kas; butuh clean surplus.</li>
<li><strong>Kapan TIDAK pakai:</strong> satu model tanpa rekonsiliasi; g terminal &gt; ekonomi; tanpa sensitivitas &amp; margin of safety.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b3-ml-investasi" className="btn btn-secondary btn-sm">← PM-B3</Link>
        <Link href="/learn/pm-b5-fixed-income-lanjut" className="btn btn-primary btn-sm">PM-B5 →</Link>
      </div>
    </div>
  );
}

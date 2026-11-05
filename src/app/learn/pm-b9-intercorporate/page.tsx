"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB9IntercorporatePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B9 — Portfolio Management</span>
        <h1 className="display-title">Intercorporate:<br/>Investasi Antar-Perusahaan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Laba yang Bukan Laba</a></li>
<li><a href="#klasifikasi">Klasifikasi Investasi</a></li>
<li><a href="#ekuitas">Equity Method & Goodwill</a></li>
<li><a href="#translasi">Operasi Multinasional</a></li>
<li><a href="#sintesis">Sintesis: Akuntansi vs Ekonomi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: PT Induk</a></li>
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
<li>Membedakan metode cost, ekuitas, dan konsolidasi by kepemilikan.</li>
<li>Menjelaskan mekanisme equity method & goodwill akuisisi.</li>
<li>Membedakan current rate vs temporal method.</li>
<li>Menjelaskan dampak translasi ke laporan.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Laba yang Bukan Laba</h2>
      <div className="story">
        <p><strong>PT Induk</strong> memiliki <strong>40%</strong> PT Anak. PT Anak untung Rp100M tapi <strong>tidak bagi dividen</strong>. PT Induk melaporkan laba <strong>+Rp40M</strong> dari 'bagian laba asosiasi'. Investor bersorak.</p>
<p>Twist-nya: <strong>Rp40M itu bukan kas</strong> — tidak ada dividen! Itu <strong>equity method</strong>: mengakui bagian laba tanpa menerima sepeser pun. Saat PT Anak butuh kas dan <em>tidak bisa</em> bagi dividen, 'laba' Induk = <strong>angka di kertas</strong>. Investor yang tidak paham metode ini mengira Induk makin kaya tunai. <strong>Metode akuntansi mengubah cerita — tanpa mengubah kas.</strong> Lesson ini: membaca investasi antar-perusahaan.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="klasifikasi">Spektrum Kepemilikan — 0% ke 100%</h2>
<p><strong>Definisi.</strong> <strong>&lt; 20%</strong> (tidak berpengaruh signifikan): <em>fair value</em> (dividen = pendapatan; perubahan nilai ke OCI/laba). <strong>20–50%</strong> (<em>significant influence</em>): <strong>equity method</strong>. <strong>&gt; 50%</strong> (<em>control</em>): <strong>konsolidasi penuh</strong> (gabung 100% laporan + <em>minority interest</em>).</p>
<p>Ambang = <em>pengaruh</em>, bukan sekadar % (dewan direksi, teknologi kunci bisa = significant influence di bawah 20%).</p>
<p><strong>Kepribadian/intuisi:</strong> Spektrum seperti <strong>hubungan</strong>: &lt;20% = kenalan (sapa = dividen); 20–50% = pacar serius (ikut merasakan untung-rugi = equity method); &gt;50% = menikah (harta digabung = konsolidasi, dengan 'anak tiri' = minority interest).</p>
<p><strong>Kapan dipakai:</strong> Baca laporan konglomerat: metode menentukan angka yang kamu lihat.</p>
<p><strong>Pendalaman intuisi &mdash; tiga metode = tiga &ldquo;lensa kepemilikan&rdquo;.</strong> &lt; 20% = <strong>pasif</strong> (fair value; seperti pegang saham biasa). 20&ndash;50% = <strong>pengaruh signifikan</strong> (<em>equity method</em>; &ldquo;satu baris&rdquo; laba proporsional). &gt; 50% = <strong>kendali</strong> (<em>konsolidasi penuh</em>; gabung semua, lalu keluarkan <em>minority interest</em>). <strong>Logika:</strong> makin besar kendali &rarr; makin &ldquo;menyatu&rdquo; laporannya. <strong>Tapi ingat:</strong> akuntansi &ne; kas! &mdash; equity method mengakui laba <em>tanpa</em> menerima kas.</p><p><strong>Pendalaman intuisi &mdash; tiga metode = tiga &ldquo;lensa kepemilikan&rdquo;.</strong> &lt; 20% = <strong>pasif</strong> (fair value; seperti pegang saham biasa). 20&ndash;50% = <strong>pengaruh signifikan</strong> (<em>equity method</em>; &ldquo;satu baris&rdquo; laba proporsional). &gt; 50% = <strong>kendali</strong> (<em>konsolidasi penuh</em>; gabung semua, lalu keluarkan <em>minority interest</em>). <strong>Logika:</strong> makin besar kendali &rarr; makin &ldquo;menyatu&rdquo; laporannya. <strong>Tapi ingat:</strong> akuntansi &ne; kas! &mdash; equity method mengakui laba <em>tanpa</em> menerima kas.</p><details className="worked">
<summary>📐 Contoh: Tiga investasi (klik untuk buka)</summary>
<p>Induk pegang: <strong>10%</strong> di A (dividen Rp5M) → pendapatan <strong>Rp5M</strong> (fair value). <strong>40%</strong> di B (laba Rp100M, dividen Rp20M) → equity method: <strong>+Rp40M</strong> laba (bukan Rp8M dividen!). <strong>80%</strong> di C → <strong>konsolidasi</strong>: gabung 100% revenue/aset C, kurangi 20% minority.</p>
<p><strong>Laba Induk</strong> mencakup Rp40M 'kertas' dari B — analis kas <strong>mengeluarkannya</strong> dari CFO proxy.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Equity method &mdash; jurnal &amp; dampak</summary>
<p><strong>Soal:</strong> beli 30% PT Anak Rp300M (nilai wajar aset bersih = Rp1M). Anak laba Rp200M, dividen Rp60M. Jurnal induk?</p>
<p><strong>Langkah 1 &mdash; akuisisi:</strong> investasi Rp300M (30% &times; 1M = 300 &rarr; <strong>tidak ada goodwill</strong>).</p>
<p><strong>Langkah 2 &mdash; laba:</strong> Dr Investasi 60 / Cr <em>Equity income</em> 60 (30% &times; 200M).</p>
<p><strong>Langkah 3 &mdash; dividen:</strong> Dr Kas 18 / Cr Investasi 18 (30% &times; 60M).</p>
<p><strong>Saldo investasi:</strong> 300 + 60 &minus; 18 = <strong>Rp342M</strong>. <strong>Laba diakui 60, kas diterima 18!</strong> &mdash; selisih 42 = &ldquo;laba kertas&rdquo;. <strong>Analis:</strong> keluarkan 42 dari proksi arus kas.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kapan equity method menyesatkan</summary>
<p><strong>Soal:</strong> 5 tahun: equity income kumulatif Rp500M, dividen kumulatif Rp50M. Diagnosis?</p>
<p><strong>Rasio:</strong> 50/500 = <strong>10%</strong> &mdash; 90% &ldquo;laba&rdquo; tidak pernah jadi kas!</p>
<p><strong>Kemungkinan:</strong> (1) anak <em>benar-benar</em> reinvestasi (OK jika ROE tinggi!); (2) anak <strong>diatur</strong> untuk tidak bagi dividen (induk memakai kas anak!); (3) laba anak <strong>tidak berkualitas</strong> (akrual!). <strong>Uji:</strong> bandingkan ROE anak vs induk; cek <em>related-party transaction</em>; lihat <em>arus kas operasi</em> anak. <strong>Equity income tanpa dividen 5 tahun = <em>wajib investigasi</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Laba naik karena equity income&rdquo;.</strong> Laba induk naik 30% &mdash; ternyata dari <em>equity income</em> (non-kas!). <strong>Analis:</strong> pisahkan <em>operating</em> vs <em>equity income</em>; hitung <strong>FCF tanpa equity income</strong>. Soal yang memberi &ldquo;laba tumbuh&rdquo; tanpa rincian sedang mengujimu &mdash; <strong>tanya: berapa yang <em>kas</em>?</strong></p>
</div>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Equity method &mdash; jurnal &amp; dampak</summary>
<p><strong>Soal:</strong> beli 30% PT Anak Rp300M (nilai wajar aset bersih = Rp1M). Anak laba Rp200M, dividen Rp60M. Jurnal induk?</p>
<p><strong>Langkah 1 &mdash; akuisisi:</strong> investasi Rp300M (30% &times; 1M = 300 &rarr; <strong>tidak ada goodwill</strong>).</p>
<p><strong>Langkah 2 &mdash; laba:</strong> Dr Investasi 60 / Cr <em>Equity income</em> 60 (30% &times; 200M).</p>
<p><strong>Langkah 3 &mdash; dividen:</strong> Dr Kas 18 / Cr Investasi 18 (30% &times; 60M).</p>
<p><strong>Saldo investasi:</strong> 300 + 60 &minus; 18 = <strong>Rp342M</strong>. <strong>Laba diakui 60, kas diterima 18!</strong> &mdash; selisih 42 = &ldquo;laba kertas&rdquo;. <strong>Analis:</strong> keluarkan 42 dari proksi arus kas.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Konsolidasi &mdash; minority interest</summary>
<p><strong>Soal:</strong> induk punya 80% anak. Anak: aset 1M, utang 400jt, laba 100jt. Bagaimana laporan konsolidasian?</p>
<p><strong>Langkah 1:</strong> gabung <strong>100%</strong>: aset +1M, utang +400jt, pendapatan/beban penuh.</p>
<p><strong>Langkah 2 &mdash; NCI:</strong> <em>non-controlling interest</em> = 20% &times; (1M&minus;400jt) = <strong>120jt</strong> di ekuitas; 20% &times; 100jt = <strong>20jt</strong> dikurangkan dari laba konsolidasian.</p>
<p><strong>Laba untuk induk:</strong> (laba induk sendiri) + 80jt (80% &times; 100jt). <strong>Analis:</strong> untuk <em>valuasi induk</em>, gunakan <strong>laba untuk pemegang saham induk</strong> (setelah NCI!) &mdash; bukan laba konsolidasian penuh.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Utang anak &mdash; siapa menanggung?</summary>
<p><strong>Soal:</strong> anak (80% milik induk) utang Rp400jt. Apakah induk wajib bayar jika anak gagal?</p>
<p><strong>Hukum:</strong> <strong>TIDAK</strong> (kecuali ada <em>garansi</em>!) &mdash; anak = entitas terpisah; kreditur anak <em>tidak bisa</em> menagih induk.</p>
<p><strong>Tapi analis:</strong> (1) <strong>reputasi</strong> &mdash; induk sering <em>menyelamatkan</em> anak (implisit!); (2) <strong>struktur</strong> &mdash; cek <em>cross-default</em> &amp; garansi di catatan kaki; (3) <strong>arus kas</strong> &mdash; jika anak gagal, dividen berhenti. <strong>Laporan konsolidasian <em>menggabungkan</em> utang; analis <em>memisahkan</em> siapa menanggung apa.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Rasio dengan laba konsolidasian penuh.</strong> ROE = laba konsolidasian / ekuitas induk &rarr; <strong>salah!</strong> (pembilang termasuk bagian NCI!). <strong>Benar:</strong> laba <em>untuk pemegang saham induk</em> (setelah NCI) / ekuitas induk. <strong>Selalu kurangkan NCI</strong> sebelum rasio untuk induk.</p>
</div>
<details className="worked">
<summary>📐 Contoh 3: Kapan equity method menyesatkan</summary>
<p><strong>Soal:</strong> 5 tahun: equity income kumulatif Rp500M, dividen kumulatif Rp50M. Diagnosis?</p>
<p><strong>Rasio:</strong> 50/500 = <strong>10%</strong> &mdash; 90% &ldquo;laba&rdquo; tidak pernah jadi kas!</p>
<p><strong>Kemungkinan:</strong> (1) anak <em>benar-benar</em> reinvestasi (OK jika ROE tinggi!); (2) anak <strong>diatur</strong> untuk tidak bagi dividen (induk memakai kas anak!); (3) laba anak <strong>tidak berkualitas</strong> (akrual!). <strong>Uji:</strong> bandingkan ROE anak vs induk; cek <em>related-party transaction</em>; lihat <em>arus kas operasi</em> anak. <strong>Equity income tanpa dividen 5 tahun = <em>wajib investigasi</em>.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Joint venture &mdash; proporsional vs ekuitas</summary>
<p><strong>Soal:</strong> JV 50:50, utang Rp200M. Dampak ke <em>leverage ratio</em> induk di bawah IFRS (equity method) vs proporsional?</p>
<p><strong>Equity method (IFRS):</strong> utang JV <strong>tidak muncul</strong> di neraca induk &mdash; hanya &ldquo;investasi&rdquo; satu baris. <strong>Leverage terlihat RENDAH.</strong></p>
<p><strong>Proporsional:</strong> +Rp100M utang &rarr; <strong>leverage terlihat TINGGI.</strong></p>
<p><strong>Analis:</strong> <strong>tambahkan kembali</strong> bagian proporsional utang JV untuk rasio yang jujur! (Cek <em>commitment &amp; contingency</em> di catatan.) <strong>Perusahaan dengan banyak JV = leverage <em>tersembunyi</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Goodwill &mdash; &ldquo;premi harapan&rdquo;</summary>
<p><strong>Soal:</strong> beli 100% anak Rp1,2M; nilai wajar aset bersih Rp1M. Goodwill? Kapan jadi masalah?</p>
<p><strong>Goodwill:</strong> 1,2M &minus; 1M = <strong>Rp200M</strong> (premi di atas nilai wajar = &ldquo;harapan sinergi&rdquo;).</p>
<p><strong>Masalah:</strong> jika sinergi <em>gagal</em> &rarr; <strong><em>impairment</em></strong> (tulis-turun!) &rarr; laba anjlok tiba-tiba. <strong>Bendera merah:</strong> goodwill &gt; 50% ekuitas + akuisisi agresif + <em>impairment</em> berulang = <strong>manajemen membayar kemahalan &amp; menunda pengakuan</strong>. <strong>Uji:</strong> bandingkan <em>carrying value</em> vs <em>recoverable amount</em> tiap tahun.</p>
</details>
<PlotlyChart
  data={[{x: ["<20%", "20-50%", ">50%"], y: [1, 2, 3], type: "bar", marker: {color: ["#94a3b8","#e8a838","#2a7de1"]}, text: ["Fair value", "Equity method", "Konsolidasi"], textposition: "outside"}]}
  title={"Spektrum metode akuntansi investasi"}
  layout={{xaxis: {title: "Kepemilikan"}, yaxis: {title: "", showticklabels: false}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Kiri ke kanan = pengaruh membesar; warna = metode berbeda.</p>
<p><strong>Interpretasi:</strong> Metode <strong>melompat</strong> di ambang 20% &amp; 50% — bukan bertahap. Akuisisi 19%→21% = perubahan <em>drastis</em> tampilan laporan (dari dividen ke equity income). <strong>Waspadai transaksi di sekitar ambang!</strong></p>
</div>
<h2 id="ekuitas">Equity Method — Laba Tanpa Kas</h2>
<p><strong>Definisi.</strong> <strong>Equity method</strong>: investasi awal at cost; <strong>+ bagian laba</strong>, <strong>− dividen diterima</strong> (dividen = <em>pengembalian modal</em>, bukan pendapatan!). <strong>Akuisisi</strong>: bayar &gt; fair value aset neto → <strong>goodwill</strong> (tidak diamortisasi; <strong>uji impairment</strong> tahunan).</p>
<p><strong>Goodwill impairment</strong> = pengakuan 'bayar kemahalan' — sering raksasa &amp; tiba-tiba.</p>
<Tex math={String.raw`\text{Investasi}_{t} = \text{Investasi}_{t-1} + \% \times NI - \text{Dividen}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Bagian laba MENAMBAH investasi (bukan kas!)</li>
<li>Dividen MENGURANGI investasi (konversi ke kas)</li>
<li>Goodwill = harga bayar − fair value aset neto teridentifikasi</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Equity method seperti <strong>saham gabungan warung</strong>: warung untung Rp100M (kamu 40%) → 'jatahmu' Rp40M <em>dicatat</em> — tapi kasnya tetap di laci warung sampai dibagi. Dividen = saat laci dibuka.</p>
<p><strong>Kapan dipakai:</strong> Analisis konglomerat: pisahkan 'laba kertas' asosiasi dari kas.</p>
<p><strong>Pendalaman intuisi &mdash; equity method = &ldquo;laba di atas kertas&rdquo;.</strong> Punya 40% perusahaan untung Rp100M &rarr; akui Rp40M &ldquo;laba&rdquo; &mdash; tapi <strong>kas yang diterima = dividen</strong> (mis. Rp8M!). Selisih Rp32M = <em>klaim</em> atas laba ditahan anak &mdash; <strong>berguna <em>jika</em> anak akhirnya membagikan; ilusi <em>jika</em> tidak pernah</strong>. <strong>Analis wajib memisahkan:</strong> &ldquo;laba akuntansi&rdquo; vs &ldquo;laba kas&rdquo;. Perusahaan dengan equity income besar + dividen kecil = <strong>bendera merah</strong>.</p><p><strong>Pendalaman intuisi &mdash; equity method = &ldquo;laba di atas kertas&rdquo;.</strong> Punya 40% perusahaan untung Rp100M &rarr; akui Rp40M &ldquo;laba&rdquo; &mdash; tapi <strong>kas yang diterima = dividen</strong> (mis. Rp8M!). Selisih Rp32M = <em>klaim</em> atas laba ditahan anak &mdash; <strong>berguna <em>jika</em> anak akhirnya membagikan; ilusi <em>jika</em> tidak pernah</strong>. <strong>Analis wajib memisahkan:</strong> &ldquo;laba akuntansi&rdquo; vs &ldquo;laba kas&rdquo;. Perusahaan dengan equity income besar + dividen kecil = <strong>bendera merah</strong>.</p><details className="worked">
<summary>📐 Contoh: Investasi PT Induk (klik untuk buka)</summary>
<p>Beli 40% PT Anak Rp300M. Tahun 1: Anak laba Rp100M, dividen Rp20M.</p>
<p><strong>Investasi akhir</strong> = 300 + 40%×100 − 40%×20 = 300 + 40 − 8 = <strong>Rp332M</strong>. <strong>Laba Induk</strong> +Rp40M (kertas!), <strong>kas masuk</strong> cuma Rp8M.</p>
<p>Akuisisi: bayar Rp500M untuk 80%, FV aset neto Rp400M → <strong>goodwill Rp180M</strong> (500 − 80%×400). Impairment test tiap tahun!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Konsolidasi &mdash; minority interest</summary>
<p><strong>Soal:</strong> induk punya 80% anak. Anak: aset 1M, utang 400jt, laba 100jt. Bagaimana laporan konsolidasian?</p>
<p><strong>Langkah 1:</strong> gabung <strong>100%</strong>: aset +1M, utang +400jt, pendapatan/beban penuh.</p>
<p><strong>Langkah 2 &mdash; NCI:</strong> <em>non-controlling interest</em> = 20% &times; (1M&minus;400jt) = <strong>120jt</strong> di ekuitas; 20% &times; 100jt = <strong>20jt</strong> dikurangkan dari laba konsolidasian.</p>
<p><strong>Laba untuk induk:</strong> (laba induk sendiri) + 80jt (80% &times; 100jt). <strong>Analis:</strong> untuk <em>valuasi induk</em>, gunakan <strong>laba untuk pemegang saham induk</strong> (setelah NCI!) &mdash; bukan laba konsolidasian penuh.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Utang anak &mdash; siapa menanggung?</summary>
<p><strong>Soal:</strong> anak (80% milik induk) utang Rp400jt. Apakah induk wajib bayar jika anak gagal?</p>
<p><strong>Hukum:</strong> <strong>TIDAK</strong> (kecuali ada <em>garansi</em>!) &mdash; anak = entitas terpisah; kreditur anak <em>tidak bisa</em> menagih induk.</p>
<p><strong>Tapi analis:</strong> (1) <strong>reputasi</strong> &mdash; induk sering <em>menyelamatkan</em> anak (implisit!); (2) <strong>struktur</strong> &mdash; cek <em>cross-default</em> &amp; garansi di catatan kaki; (3) <strong>arus kas</strong> &mdash; jika anak gagal, dividen berhenti. <strong>Laporan konsolidasian <em>menggabungkan</em> utang; analis <em>memisahkan</em> siapa menanggung apa.</strong></p>
</details>

<PlotlyChart
  data={[{x: ["Laba diakui (equity)", "Kas diterima (dividen)", "Selisih (kertas)"], y: [40, 8, 32], type: "bar", marker: {color: ["#2a7de1", "#2ca02c", "#d62728"]}, name: "Rp juta"}]}
  title={"Equity method: laba 40, kas 8 — selisih 32 'kertas'"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Rp juta"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga batang = laba yang diakui vs kas yang diterima vs selisihnya.</p>
<p><strong>Interpretasi:</strong> <strong>80% &ldquo;laba&rdquo; tidak jadi kas!</strong> (32 dari 40). Inilah <em>inti</em> penyesuaian analis: <strong>keluarkan equity income non-kas</strong> dari proksi arus kas; nilai investasi via <strong>dividen sustainable</strong>. Perusahaan yang &ldquo;laba&rdquo;-nya didominasi batang merah = <strong>kualitas laba rendah</strong>.</p>
</div>
<h2 id="translasi">Translasi — Dua Mata Uang, Satu Laporan</h2>
<p><strong>Definisi.</strong> <strong>Current rate method</strong> (mata uang fungsional ≠ presentasi): semua aset/liabilitas @ <strong>kurs kini</strong>, ekuitas @ historis, IS @ rata-rata → selisih ke <strong>CTA</strong> (OCI, bukan laba!). <strong>Temporal method</strong>: moneter @ kini, non-moneter @ historis → selisih ke <strong>laba rugi</strong> (volatile!).</p>
<p>Pilih by <strong>mata uang fungsional</strong> (lingkungan ekonomi utama), bukan pilihan bebas.</p>
<p><strong>Kepribadian/intuisi:</strong> Translasi seperti <strong>menerjemahkan novel</strong>: current rate = terjemahan <em>bebas</em> yang mengalir (selisih rasa ke catatan kaki/OCI); temporal = terjemahan <em>harfiah</em> (kaku, selisihnya mengganggu cerita/laba). Pilih sesuai 'bahasa asli' (fungsional).</p>
<p><strong>Kapan dipakai:</strong> Emiten multinasional: pahami dari mana volatilitas kurs muncul di laporan.</p>
<p><strong>Pendalaman intuisi &mdash; konsolidasi = &ldquo;keluarga besar&rdquo;.</strong> Induk + anak digabung 100% (aset, utang, pendapatan!) &mdash; lalu <em>minority interest</em> memisahkan bagian non-pengendali. <strong>Manfaat:</strong> gambaran <em>ekonomi</em> grup. <strong>Jebakan:</strong> (1) <strong>utang anak</strong> = utang grup (padahal kreditur anak <em>tidak bisa</em> menagih induk!); (2) <strong>kas anak</strong> &ne; kas induk (bisa <em>terjebak</em> di yurisdiksi lain!); (3) <strong>transaksi intra-grup</strong> harus dieliminasi (jual-beli ke diri sendiri &ne; pendapatan!). <strong>Konsolidasi = peta grup; analis = pembaca peta yang curiga.</strong></p><p><strong>Pendalaman intuisi &mdash; konsolidasi = &ldquo;keluarga besar&rdquo;.</strong> Induk + anak digabung 100% (aset, utang, pendapatan!) &mdash; lalu <em>minority interest</em> memisahkan bagian non-pengendali. <strong>Manfaat:</strong> gambaran <em>ekonomi</em> grup. <strong>Jebakan:</strong> (1) <strong>utang anak</strong> = utang grup (padahal kreditur anak <em>tidak bisa</em> menagih induk!); (2) <strong>kas anak</strong> &ne; kas induk (bisa <em>terjebak</em> di yurisdiksi lain!); (3) <strong>transaksi intra-grup</strong> harus dieliminasi (jual-beli ke diri sendiri &ne; pendapatan!). <strong>Konsolidasi = peta grup; analis = pembaca peta yang curiga.</strong></p><details className="worked">
<summary>📐 Contoh: Anak usaha di Malaysia (klik untuk buka)</summary>
<p>Anak: aset MYR 100jt, kurs awal 3.500, kini 3.200 (MYR melemah).</p>
<p><strong>Current rate</strong>: aset Rp320M (vs 350M) → <strong>CTA −Rp30M</strong> di OCI (tidak sentuh laba!).</p>
<p><strong>Temporal</strong> (jika fungsional = IDR): non-moneter @ historis → <strong>selisih ke laba</strong> → laba Induk volatile tiap kuartal. <strong>Metode mengubah volatilitas laba!</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Joint venture &mdash; proporsional vs ekuitas</summary>
<p><strong>Soal:</strong> JV 50:50, utang Rp200M. Dampak ke <em>leverage ratio</em> induk di bawah IFRS (equity method) vs proporsional?</p>
<p><strong>Equity method (IFRS):</strong> utang JV <strong>tidak muncul</strong> di neraca induk &mdash; hanya &ldquo;investasi&rdquo; satu baris. <strong>Leverage terlihat RENDAH.</strong></p>
<p><strong>Proporsional:</strong> +Rp100M utang &rarr; <strong>leverage terlihat TINGGI.</strong></p>
<p><strong>Analis:</strong> <strong>tambahkan kembali</strong> bagian proporsional utang JV untuk rasio yang jujur! (Cek <em>commitment &amp; contingency</em> di catatan.) <strong>Perusahaan dengan banyak JV = leverage <em>tersembunyi</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Goodwill &mdash; &ldquo;premi harapan&rdquo;</summary>
<p><strong>Soal:</strong> beli 100% anak Rp1,2M; nilai wajar aset bersih Rp1M. Goodwill? Kapan jadi masalah?</p>
<p><strong>Goodwill:</strong> 1,2M &minus; 1M = <strong>Rp200M</strong> (premi di atas nilai wajar = &ldquo;harapan sinergi&rdquo;).</p>
<p><strong>Masalah:</strong> jika sinergi <em>gagal</em> &rarr; <strong><em>impairment</em></strong> (tulis-turun!) &rarr; laba anjlok tiba-tiba. <strong>Bendera merah:</strong> goodwill &gt; 50% ekuitas + akuisisi agresif + <em>impairment</em> berulang = <strong>manajemen membayar kemahalan &amp; menunda pengakuan</strong>. <strong>Uji:</strong> bandingkan <em>carrying value</em> vs <em>recoverable amount</em> tiap tahun.</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Akuntansi vs Ekonomi</h2>
      <p>Equity method, konsolidasi, JV = <strong>satu ketegangan</strong>:</p>
      <ol>
        <li><strong>AKUNTANSI</strong> menggabungkan/mengakui berdasarkan <em>kendali</em> &mdash; logis &amp; konsisten.</li>
        <li><strong>EKONOMI</strong> bertanya: <em>berapa kas? siapa menanggung? bisa diakses?</em> &mdash; sering <em>berbeda</em> dari akuntansi.</li>
      </ol>
      <p><strong>Pekerjaan analis = menerjemahkan (1) menjadi (2).</strong> Keluarkan non-kas, kurangkan NCI, tambahkan utang tersembunyi, uji goodwill. <strong>Laporan = titik awal; analisis = titik akhir.</strong></p>

      <h3>🎙️ Debat: &ldquo;Konsolidasi = transparansi&rdquo;</h3>
      <p><strong>Pendukung:</strong> &ldquo;Konsolidasi memberi <em>gambaran ekonomi grup</em> &mdash; lebih transparan dari sekadar &lsquo;investasi satu baris&rsquo;.&rdquo;</p>
      <p><strong>Kritikus:</strong> &ldquo;Konsolidasi <strong>menyembunyikan</strong>: utang anak terlihat seperti utang induk (padahal bukan!); kas anak terlihat bisa dipakai (padahal terjebak!); <em>intra-grup</em> dieliminasi (padahal itu <em>bisnis nyata</em> antar entitas!). <strong>Agregasi = informasi hilang.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>keduanya dibutuhkan.</strong> Konsolidasian untuk <em>ekonomi grup</em>; <em>segment/entitas</em> untuk <em>risiko &amp; likuiditas</em>. <strong>Analis yang hanya baca satu = setengah buta.</strong></p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;'Bagian laba asosiasi' = kas masuk. Laba naik = makin kaya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Equity method: <strong>laba diakui tanpa kas</strong> (kas = dividen, sering jauh lebih kecil). PT Induk: +Rp40M laba, kas +Rp8M. Analis <strong>mengeluarkan</strong> equity income saat hitung kualitas laba (PM-A4) — 'laba kertas' ≠ CFO.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Goodwill = aset seperti gedung. Aman di neraca.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Goodwill = <strong>premi bayar</strong> (harapan sinergi) — tidak berwujud, <strong>tidak diamortisasi</strong>, tapi <strong>diuji impairment</strong>. Saat sinergi gagal: impairment <strong>miliaran sekaligus</strong> (contoh: akuisisi media/teknologi). Goodwill besar = <strong>risiko write-down</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Aset konsolidasian = aset induk.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> kas anak bisa <strong>terjebak</strong> (yurisdiksi, perjanjian utang!); aset anak <strong>tidak bisa</strong> dipakai bayar utang induk (kreditur anak prioritas!). <strong>Konsolidasi = <em>ekonomi grup</em>; likuiditas &amp; klaim = <em>per entitas</em>.</strong> Analis kredit memisahkan; analis ekuitas menggabungkan &mdash; dengan sadar.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Goodwill = aset.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> goodwill = <strong>premi harapan</strong> (selisih bayar vs nilai wajar). Tidak bisa dijual terpisah; <em>wajib</em> diuji impairment. <strong>Untuk analisis konservatif:</strong> banyak analis <strong>mengeluarkan goodwill</strong> dari ekuitas (<em>tangible book</em>!). Perusahaan dengan goodwill raksasa = <strong>neraca rapuh</strong>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Untuk konglomerat: baca 'segment' + pisahkan asosiasi.</strong> Laba konsolidasian campur aduk — segment note memberi tahu unit mana yang benar-benar menghasilkan kas.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Waspadai goodwill &gt; 30% ekuitas.</strong> Akuisisi agresif menumpuk goodwill = bom impairment. Cek track record akuisisi manajemen (serial acquirer = red flag).</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist intercorporate (5 menit):</strong> (1) <strong>Metode apa?</strong> (&lt;20/20&ndash;50/&gt;50); (2) <strong>Berapa kas?</strong> (dividen vs equity income); (3) <strong>NCI</strong> sudah dikurangkan? (4) <strong>Goodwill</strong> berapa % ekuitas? (5) <strong>Transaksi intra-grup</strong> dieliminasi? <strong>Lima cek sebelum percaya &ldquo;laba&rdquo; grup.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Equity Method vs Dividen</h2>
<p>Bandingkan laba & kas di bawah equity method vs fair value.</p>
<PyodideLab
  title={"Lab 1 — Equity Method"}
  hint={"Ubah DIVIDEN 20 -> 0 (tidak bagi dividen). Laba tetap +40, kas 0 — 'laba kertas' murni!"}
  defaultCode={"# Equity method: laba vs kas\nINVESTASI_AWAL, KEPEMILIKAN = 300, 0.40\nLABA_ANAK, DIVIDEN = 100, 20  # Rp M (ubah DIVIDEN!)\n\nbagian_laba = KEPEMILIKAN * LABA_ANAK\ndiv_diterima = KEPEMILIKAN * DIVIDEN\ninvestasi_akhir = INVESTASI_AWAL + bagian_laba - div_diterima\n\nprint(f\"Bagian laba (diakui di IS): +Rp{bagian_laba:.0f}M\")\nprint(f\"Dividen kas diterima      :  Rp{div_diterima:.0f}M\")\nprint(f\"Investasi akhir           : Rp{investasi_akhir:.0f}M\")\nprint()\nprint(f\"GAP laba vs kas: Rp{bagian_laba - div_diterima:.0f}M <- 'laba kertas'\")\nprint(\"Analis kas MENGELUARKAN ini dari proksi CFO.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Translasi Current-Rate</h2>
<p>Translasikan neraca anak usaha asing dan hitung CTA.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Translasi"}
  hint={"Ubah KURS_KINI 3200 -> 3800 (MYR menguat). CTA jadi positif — OCI, bukan laba!"}
  defaultCode={"# Translasi current rate method (Rp M)\nASET_MYR, KURS_AWAL, KURS_KINI = 100, 3500, 3200  # ubah KURS_KINI!\n\naset_awal = ASET_MYR * KURS_AWAL / 1e6 * 1e3  # sederhanakan: *kurs\n# hitung langsung dalam Rp jt\naset_awal_jt = ASET_MYR * KURS_AWAL / 1000\naset_kini_jt = ASET_MYR * KURS_KINI / 1000\ncta = aset_kini_jt - aset_awal_jt\n\nprint(f\"Aset @kurs awal: Rp{aset_awal_jt:,.0f} jt\")\nprint(f\"Aset @kurs kini : Rp{aset_kini_jt:,.0f} jt\")\nprint(f\"CTA (ke OCI)    : Rp{cta:,.0f} jt\")\nprint()\nprint(\"CTA masuk OCI (ekuitas), TIDAK mengganggu laba bersih.\")\nprint(\"Temporal method: selisih serupa masuk LABA -> volatile!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Kepemilikan 20–50% → <strong>Equity method</strong></h3>
<p><strong>Kenapa:</strong> Significant influence.</p>
<p><strong>Contoh nyata:</strong> Asosiasi 40%.</p>
</div>
<div className="decision-card">
<h3>2. Akuisisi &gt; 50% → <strong>Konsolidasi + goodwill</strong></h3>
<p><strong>Kenapa:</strong> Control.</p>
<p><strong>Contoh nyata:</strong> Anak usaha 80%.</p>
</div>
<div className="decision-card">
<h3>3. Goodwill &gt; 30% ekuitas → <strong>Waspada impairment</strong></h3>
<p><strong>Kenapa:</strong> Risiko write-down besar.</p>
<p><strong>Contoh nyata:</strong> Serial acquirer.</p>
</div>
<div className="decision-card">
<h3>4. Analisis kas konglomerat → <strong>Keluarkan equity income</strong></h3>
<p><strong>Kenapa:</strong> 'Laba kertas' bukan kas.</p>
<p><strong>Contoh nyata:</strong> Proksi CFO bersih.</p>
</div>
<div className="decision-card">
<h3>5. Laba dari investasi antar-perusahaan → <strong>Pisahkan kas vs kertas; kurangkan NCI</strong></h3>
<p><strong>Kenapa:</strong> Equity income ≠ kas; laba konsolidasian ≠ milik induk penuh.</p>
<p><strong>Contoh nyata:</strong> Laba Rp40M, kas Rp8M — 80% &ldquo;kertas&rdquo;.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Metode by pengaruh</strong>: &lt;20 / 20–50 / &gt;50.</li><li><strong>Equity income ≠ kas.</strong></li><li><strong>Goodwill</strong> = risiko impairment.</li><li><strong>Translasi</strong>: pahami ke mana selisih pergi.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Laba Rp40M Tanpa Kas</h2>
<div className="callout">
<p>PT Induk (40% PT Anak): Anak laba Rp100M, dividen Rp20M. Induk akui +Rp40M laba.</p>
<p><strong>Vignette lanjutan.</strong> PT Induk (40% PT Anak): Anak laba Rp100M, dividen Rp20M. Induk mengakui +Rp40M &ldquo;laba&rdquo; &mdash; analis junior menghitung P/E berdasarkan itu. Faktanya kas yang diterima hanya Rp8M. Lima tahun: equity income kumulatif Rp500M, dividen Rp50M.</p>
<p><strong>Pertanyaan:</strong> (a) Berapa kas yang diterima Induk? (b) Penyesuaian analis? (c) Kapan equity method menyesatkan? (d) Hitung P/E yang <em>benar</em> jika harga Rp1M &amp; &ldquo;laba&rdquo; Rp40M vs laba kas Rp8M. (e) Rancang <em>due diligence</em> untuk investasi antar-perusahaan.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Rp8M</strong> (40% × 20M) — bukan Rp40M!</p>
<p>(b) <strong>Keluarkan Rp32M</strong> (40−8) dari proksi laba kas; nilai Anak via <strong>dividen sustainable</strong>, bukan laba akuntansi.</p>
<p>(c) Saat Anak <strong>tidak pernah bagi dividen</strong> (tumbuh terus / diatur Induk) &mdash; &lsquo;laba&rsquo; abadi tanpa kas. <strong>Uji</strong>: bandingkan kumulatif equity income vs dividen 5 tahun.</p>
<p>(d) <strong>P/E &ldquo;laporan&rdquo;:</strong> 1.000/40 = <strong>25&times;</strong>. <strong>P/E kas:</strong> 1.000/8 = <strong>125&times;</strong>! &mdash; <strong>5&times; lebih mahal</strong> dari yang terlihat! <strong>Pelajaran: P/E berbasis equity income non-kas = <em>ilusi murah</em>.</strong> Selalu hitung <em>cash-adjusted</em>.</p>
<p>(e) <strong>DD:</strong> (1) <strong>dividen historis</strong> (5 tahun: berapa % equity income jadi kas?); (2) <strong>arus kas anak</strong> (laba berkualitas?); (3) <strong>related party</strong> (apakah induk &ldquo;mengatur&rdquo; dividen?); (4) <strong>goodwill &amp; NCI</strong>; (5) <strong>yurisdiksi &amp; restriksi</strong> (bisakah kas keluar?). <strong>Lima cek atau jangan percaya &ldquo;laba&rdquo;.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Struktur Grup</h2>
      <h3>1. Variable interest entity &mdash; &ldquo;anak&rdquo; tanpa saham</h3>
      <p>Enron: <em>SPV</em> yang dikendalikan via kontrak (bukan saham!) &mdash; <strong>tidak dikonsolidasi</strong> &rarr; utang tersembunyi! Aturan kini (<em>VIE</em>): konsolidasi jika <strong>kendali ekonomi</strong> (<em>power</em> + <em>exposure</em>), bukan cuma saham. <strong>Pelajaran:</strong> <em>substansi &gt; bentuk</em> &mdash; baca <em>struktur</em>, bukan cuma <em>kepemilikan</em>.</p>
      <h3>2. Transfer pricing &mdash; laba &ldquo;berpindah&rdquo;</h3>
      <p>Multinasional: anak di Irlandia (pajak rendah) &ldquo;menagih&rdquo; royalti ke anak di Indonesia &mdash; <strong>laba berpindah</strong> ke pajak rendah! <strong>Analis:</strong> laba per entitas <em>terdistorsi</em>; lihat <em>konsolidasian</em> untuk ekonomi grup, tapi <em>risiko pajak</em> (sengketa transfer pricing!) = nyata. <strong>OECD BEPS</strong> memperketat &mdash; pantau.</p>
      <h3>3. Spin-off &amp; carve-out &mdash; &ldquo;anak dilepas&rdquo;</h3>
      <p>Induk melepas anak (IPO sebagian/penuh). <strong>Dampak:</strong> dekonsolidasi &rarr; <em>gain/loss</em> diakui; struktur grup <em>berubah</em>. <strong>Analis:</strong> <em>restate</em> historis (<em>pro forma</em>!) untuk perbandingan; nilai <em>masing-masing</em> entitas pasca-pemisahan. <strong>Spin-off sering <em>membuka nilai</em></strong> (konglomerat discount hilang!) &mdash; tapi cek <em>alasan</em> (fokus? atau buang masalah?).</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Metode kilat</h3>
      <p>Kepemilikan 35%. Metode? 55%? 10%?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>35% = <strong>equity method</strong>; 55% = <strong>konsolidasi</strong>; 10% = <strong>fair value</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Equity income vs kas</h3>
      <p>40% anak, laba 100M, dividen 20M. Laba diakui &amp; kas?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Laba <strong>40M</strong>, kas <strong>8M</strong>. Selisih 32M = kertas.</p>
      </details>
      <h3>Drill 3 &mdash; NCI</h3>
      <p>80% anak, laba anak 100jt. Laba untuk induk dari anak?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>80jt</strong> (kurangkan NCI 20jt).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Laba naik 30% (dari equity income). P/E 25&times; = murah.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> Equity income = non-kas. P/E kas bisa 125&times;! Hitung <em>cash-adjusted</em>.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Kepemilikan 40%, laba anak Rp100M, dividen Rp20M. Diakui Induk?"}
  options={
    ["Rp8M (dividen)",
    "Rp40M laba (equity method); kas Rp8M",
    "Rp100M",
    "Rp0"]
  }
  correct={1}
  explanation={"Benar: equity method akui 40%×100M = Rp40M di IS; kas = 40%×20M = Rp8M. Selisih Rp32M = 'laba kertas'."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Bayar Rp500M untuk 80%, FV aset neto Rp400M. Goodwill?"}
  options={
    ["Rp100M",
    "Rp180M",
    "Rp500M",
    "Rp0"]
  }
  correct={1}
  explanation={"Benar: 500 − 80%×400 = 500−320 = 180. Goodwill = premi; uji impairment tahunan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Current rate vs temporal: selisih kurs ke mana?"}
  options={
    ["Keduanya ke laba",
    "Current → CTA (OCI); temporal → laba rugi",
    "Keduanya ke OCI",
    "Tidak ada selisih"]
  }
  correct={1}
  explanation={"Benar: current rate 'menampung' di OCI (laba stabil); temporal menghantam laba (volatile). Metode mengubah profil laba!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Goodwill 50% dari ekuitas. Sikap?"}
  options={
    ["Abaikan",
    "Waspada impairment — cek track record akuisisi",
    "Bagus — aset besar",
    "Jual segera"]
  }
  correct={1}
  explanation={"Benar: goodwill jumbo = premi besar = risiko write-down. Serial acquirer = red flag governance (PM-A5)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Investasi 10% dengan dividen Rp5M. Metode & pendapatan?"}
  options={
    ["Equity method Rp5M",
    "Fair value: pendapatan = dividen Rp5M",
    "Konsolidasi",
    "Rp0"]
  }
  correct={1}
  explanation={"Benar: &lt;20% tanpa pengaruh signifikan = fair value; pendapatan = dividen diterima (+ perubahan FV)."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Induk (40% anak): laba anak Rp100M, dividen Rp20M, harga saham induk Rp1M. P/E 'laporan' 25×. P/E kas yang benar?"}
  options={
    ["25× — sama, equity method sudah benar",
    "125× — 5× lebih mahal; equity income non-kas harus dikeluarkan",
    "20× — lebih murah karena dividen",
    "Tidak bisa dihitung"]}
  correct={1}
  explanation={"Benar: laba kas = 40%×20M = Rp8M → P/E = 1000/8 = 125×. P/E 25× adalah ilusi dari laba kertas Rp40M. Pelajaran: selalu hitung cash-adjusted."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Spektrum</strong>: &lt;20% fair value; 20–50% equity method; &gt;50% konsolidasi.</li>
<li><strong>Equity method</strong>: +bagian laba −dividen; laba ≠ kas.</li>
<li><strong>Goodwill</strong> = premi akuisisi; impairment, bukan amortisasi.</li>
<li><strong>Translasi</strong>: current rate → CTA (OCI); temporal → laba (volatile).</li>
<li><strong>Aturan</strong>: pisahkan 'laba kertas' asosiasi; waspadai goodwill jumbo.</li>
<li><strong>Kapan TIDAK percaya</strong>: equity income tanpa dividen bertahun-tahun.</li>

<li><strong>Equity method:</strong> akui proporsional; pisahkan kas vs kertas.</li>
<li><strong>Konsolidasi:</strong> gabung 100%; kurangkan NCI; waspadai utang/kas anak.</li>
<li><strong>JV/Goodwill:</strong> utang tersembunyi; goodwill = premi harapan.</li>
<li><strong>Kapan TIDAK pakai:</strong> percaya laba tanpa cek kas; rasio tanpa kurangi NCI; abaikan struktur grup.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b8-faktor-risiko" className="btn btn-secondary btn-sm">← PM-B8</Link>
        <Link href="/learn/pm-c1-ips" className="btn btn-primary btn-sm">PM-C1 →</Link>
      </div>
    </div>
  );
}

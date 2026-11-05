"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC11EthicsEsgPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C11 — Portfolio Management</span>
        <h1 className="display-title">Ethics Lanjutan & ESG:<br/>Uang yang Bersih</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Dana 'Hijau' yang Berisi Batubara</a></li>
<li><a href="#etikapraktik">Etika Praktik</a></li>
<li><a href="#esg">Integrasi ESG</a></li>
<li><a href="#greenwash">Greenwashing</a></li>
<li><a href="#sintesis">Sintesis: Uang Bersih</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Green Future</a></li>
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
<li>Menjelaskan isu etika praktik: soft dollars, directed brokerage, IPO.</li>
<li>Menjelaskan integrasi ESG vs exclusion vs engagement.</li>
<li>Mengidentifikasi greenwashing dan rating divergence.</li>
<li>Merancang kebijakan ESG yang kredibel.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Dana 'Hijau' yang Berisi Batubara</h2>
      <div className="story">
        <p><strong>2023</strong>: reksadana <strong>'Green Future'</strong> meraup <strong>Rp2 triliun</strong> — marketing: <em>'100% ESG!'</em> <strong>Jurnalis</strong> bedah portofolio: <strong>15% batubara &amp; sawit bermasalah</strong>! Manajer berkilah: <em>'rating ESG kami... dari provider X'</em> (yang memberi skor tinggi ke semua kliennya!).</p>
<p>Twist-nya: <strong>regulator</strong> denda + investor <strong>redeem massal</strong>. 'Hijau' di brosur = <strong>greenwashing</strong> — dan pasar kini menghukumnya <em>lebih keras</em> dari sekadar 'tidak hijau'. <strong>Klaim ESG palsu &gt; tidak klaim sama sekali.</strong> Lesson ini: integritas sebagai strategi.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="etikapraktik">Etika Praktik — Ujian Sehari-hari</h2>
<p><strong>Definisi.</strong> <strong>Soft dollars</strong>: komisi trading dipakai bayar <em>riset</em> — boleh jika <em>manfaat klien</em> &amp; <em>disclose</em>; haram jika untuk <em>sewa kantor</em>! <strong>Directed brokerage</strong>: klien arahkan broker tertentu — <em>waspadai</em> eksekusi buruk. <strong>Fair dealing IPO</strong>: alokasi <em>proporsional</em>, tidak untuk 'klien favorit'.</p>
<p><strong>Prinsip</strong>: <strong>loyalty + disclosure</strong> — jika ragu, <em>ungkapkan &amp; minta persetujuan</em>.</p>
<p><strong>Kepribadian/intuisi:</strong> Soft dollars seperti <strong>uang belanja titipan</strong>: dititipi Rp100rb beli sayur (trading); kembalian dipakai beli <em>bumbu</em> (riset, untuk masakan klien ✓) vs <em>pulsa pribadi</em> (✗!). Bedanya = <strong>untuk siapa manfaatnya</strong> + <strong>bilang ke yang nitip</strong>.</p>
<p><strong>Kapan dipakai:</strong> Setiap penggunaan komisi klien; alokasi produk terbatas.</p>
<p><strong>Pendalaman intuisi &mdash; etika = &ldquo;kepercayaan adalah mata uang&rdquo;.</strong> Keuangan = <strong><em>kepercayaan</em></strong> (uang <em>titipan</em>!). <strong><em>Pelanggaran</em></strong> = <em>kepercayaan hancur</em> = <em>bisnis mati</em> (Madoff! Enron!). <strong>Standar CFA:</strong> <em>utamakan klien</em>! <em>ungkap konflik</em>! <em>jangan menipu</em>! <strong>Bukan <em>moral</em> abstrak</strong> &mdash; melainkan <em>aturan main</em> agar <em>pasar berfungsi</em>. <strong><em>Short-term</em> curang = <em>long-term</em> bunuh diri.</strong></p><details className="worked">
<summary>📐 Contoh: Riset vs sewa (klik untuk buka)</summary>
<p>Manajer pakai soft dollars Rp500jt/thn: <strong>Rp300jt riset</strong> (data, analis) + <strong>Rp200jt 'terminal &amp; sewa'</strong>.</p>
<p><strong>Audit</strong>: riset ✓ (manfaat klien, disclose). Sewa ✗ — <strong>pelanggaran</strong> (manfaat manajer!).</p>
<p><strong>Solusi</strong>: bayar sewa dari <strong>fee manajemen</strong> (uang sendiri!), disclose riset ke klien. <strong>Aturan praktis</strong>: 'berani tulis di factsheet?' — jika tidak, jangan lakukan.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Konflik kepentingan &mdash; kenali</summary>
<p><strong>Soal:</strong> manajer: <em>rekomendasikan</em> saham X ke klien; <em>pribadi</em> jual X. Pelanggaran?</p>
<p><strong>Ya!</strong> <strong><em>Konflik</em></strong> (<em>pribadi</em> vs <em>klien</em>!) + <strong><em>tidak diungkap</em></strong>! <strong>Standar:</strong> <em>utamakan klien</em>! <em>ungkap</em> konflik! <strong><em>Personal trading</em></strong> = <em>pre-clearance</em>! <strong><em>Pelanggaran</em> = <em>sanksi</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Insider trading &mdash; &ldquo;info teman&rdquo;</summary>
<p><strong>Soal:</strong> teman direksi bisik &ldquo;akuisisi besok!&rdquo;. Beli? <em>Bagi</em> ke klien?</p>
<p><strong><em>Jangan</em>!</strong> <strong><em>Material nonpublic</em></strong> = <em>tidak boleh</em> trading! <strong><em>Mosaic</em></strong> = <em>boleh</em> (publik + <em>analisis</em>!). <strong><em>Tip</em></strong> = <em>tidak boleh</em> bagi! <strong>Aturan:</strong> <strong><em>jika ragu</em> = <em>jangan</em>.</strong> <strong><em>Penjara</em> &gt; <em>cuan</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Soft dollars &mdash; &ldquo;gratis&rdquo;?</summary>
<p><strong>Soal:</strong> broker &ldquo;gratis&rdquo; riset jika trading via mereka. <em>Etis</em>?</p>
<p><strong><em>Boleh</em></strong>, <strong><em>jika</em></strong>: (1) <em>manfaat klien</em>! (2) <em>diungkap</em>! (3) <em>best execution</em> <em>tidak</em> dikorbankan! <strong><em>Tidak boleh</em></strong>: untuk <em>pribadi</em>! <em>melebihi</em> manfaat! <strong><em>Soft dollars</em> = <em>uang klien</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;ESG = return lebih tinggi&rdquo;.</strong> <strong><em>Belum terbukti</em></strong> konsisten! ESG = <em>risiko</em>, bukan <em>alpha</em>! Soal yang klaim &ldquo;ESG <em>pasti</em> outperform&rdquo; &rarr; <strong><em>salah</em></strong>. <strong><em>Nuansa</em>!</strong></p>
</div>

<PlotlyChart
  data={[{x: ["Klaim '100% ESG'", "Realita (batubara 15%)", "Voting ESG", "Audit independen"], y: [100, 15, 0, 0], type: "bar", marker: {color: ["#2ca02c", "#d62728", "#d62728", "#d62728"]}, name: "%"}]}
  title={"Greenwashing: klaim vs realita"}
  layout={{xaxis: {title: ""}, yaxis: {title: "%"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = klaim vs realita dana &ldquo;hijau&rdquo;.</p>
<p><strong>Interpretasi:</strong> <strong><em>jurang</em>!</strong> Klaim 100% vs batubara 15%! Voting 0%! Audit 0%! <strong><em>Label</em> &ne; <em>isi</em>.</strong> <strong><em>Verifikasi</em> &gt; <em>percaya</em>.</strong></p>
</div>
<h2 id="esg">Integrasi ESG — Faktor, Bukan Filter</h2>
<p><strong>Definisi.</strong> <strong>Integrasi</strong>: faktor ESG <em>material</em> masuk <strong>analisis valuasi</strong> (risiko iklim → arus kas!). <strong>Exclusion</strong>: coret sektor (senjata tumpul). <strong>Engagement</strong>: <em>aktif</em> perbaiki perusahaan (voting, dialog) — bukti dampak <strong>terkuat</strong>.</p>
<p><strong>Materialitas</strong>: ESG yang <em>relevan finansial</em> per sektor (SASB): emisi untuk tambang, privasi data untuk tech.</p>
<p><strong>Kepribadian/intuisi:</strong> Integrasi ESG seperti <strong>cek kesehatan</strong>: bukan 'tolak pasien perokok' (exclusion), tapi <strong>masukkan riwayat merokok ke diagnosis</strong> (integrasi) + <strong>ajak berhenti</strong> (engagement). Dokter yang mengabaikan riwayat = malpraktik; yang menolak pasien = bukan dokter.</p>
<p><strong>Kapan dipakai:</strong> Analisis fundamental: matriks materialitas per sektor wajib.</p>
<p><strong>Pendalaman intuisi &mdash; ESG = &ldquo;risiko yang tidak di harga&rdquo;.</strong> <strong>E</strong> (<em>iklim</em>!): <em>stranded assets</em>! <em>karbon tax</em>! <strong>S</strong> (<em>tenaga kerja</em>!): <em>mogok</em>! <em>boikot</em>! <strong>G</strong> (<em>tata kelola</em>!): <em>fraud</em>! <em>nepotisme</em>! <strong>ESG = <em>faktor risiko</em></strong> (bukan <em>amal</em>!). <strong><em>Integrasi</em></strong> = masukkan ke <em>analisis</em>; <strong><em>exclusion</em></strong> = <em>nilai</em> klien. <strong><em>Jangan campur</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Tambang vs ESG (klik untuk buka)</summary>
<p>Tambang batubara: <strong>risiko transisi</strong> (pajak karbon!) → arus kas −20% skenario 2030 → <strong>valuasi −25%</strong> (integrasi!).</p>
<p><strong>Exclusion</strong>: coret → lewatkan <em>turnaround</em> (diversifikasi ke nikel!). <strong>Engagement</strong>: voting paksa <em>capex hijau</em> + target emisi.</p>
<p><strong>Hasil</strong>: valuasi jujur + perusahaan membaik = <strong>return + dampak</strong>. Itulah ESG yang <em>bekerja</em>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): ESG integration &mdash; praktik</summary>
<p><strong>Soal:</strong> analisis batubara: <em>karbon tax</em> Rp50rb/ton diusulkan. Dampak valuasi?</p>
<p><strong>Langkah 1:</strong> emisi 10jt ton &rarr; <em>biaya</em> 500M/tahun!</p>
<p><strong>Langkah 2:</strong> <em>adjust</em> DCF (<em>cash flow</em> &minus;500M!) &rarr; <strong><em>turun</em> 20%</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>ESG = <em>angka</em></strong>, bukan <em>narasi</em>. <strong><em>Kuantifikasi</em>!</strong> <strong><em>Integrasi</em> = <em>analisis</em>, bukan <em>filter</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Engagement vs divestment</summary>
<p><strong>Soal:</strong> pegang saham <em>polutan</em>. <em>Jual</em> atau <em>engagement</em>?</p>
<p><strong><em>Divestment</em>:</strong> <em>bersih</em> tangan! Tapi: <em>saham</em> dibeli <em>orang lain</em> (<em>tidak berubah</em>!).</p>
<p><strong><em>Engagement</em>:</strong> <em>voting</em>! <em>dialog</em>! <strong><em>Ubah</em> perusahaan!</strong> Tapi: <em>lambat</em>! <em>tidak pasti</em>!</p>
<p><strong>Pilih:</strong> <strong><em>keduanya</em></strong> &mdash; <em>engagement</em> dulu (<em>beri kesempatan</em>!); <em>divest</em> jika <em>gagal</em>! <strong><em>Aktif</em> &gt; <em>pasif</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Etika = legal&rdquo;.</strong> <strong>SALAH.</strong> <strong><em>Etika</em> &gt; <em>legal</em></strong>! (Legal = <em>minimum</em>!). <strong>Standar CFA</strong> = <em>lebih tinggi</em> dari hukum! Soal etika: <strong><em>pilih</em> yang <em>paling etis</em></strong>, bukan <em>paling legal</em>.</p>
</div>
<PlotlyChart
  data={[{x: ["Provider A","Provider B","Provider C","Provider D"], y: [85,62,78,45], type: "bar", marker: {color: ["#2a7de1","#e8a838","#16a34a","#ef4444"]}, text: ["85","62","78","45"], textposition: "outside"}]}
  title={"Skor ESG satu perusahaan dari 4 provider (ilustrasi)"}
  layout={{xaxis: {title: "Provider"}, yaxis: {title: "Skor ESG (0-100)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = skor ESG perusahaan <em>sama</em> dari provider berbeda.</p>
<p><strong>Interpretasi:</strong> <strong>45–85 untuk perusahaan yang sama!</strong> Rating ESG <strong>divergen</strong> (korelasi antar-provider ~0,5 vs rating kredit ~0,99). <strong>Jangan beli skor mentah</strong> — pahami <em>metodologi</em>, pakai untuk <em>riset</em> bukan <em>label</em>. 'Green Future' memakai provider termurah hati = greenwashing by proxy.</p>
</div>
<h2 id="greenwash">Greenwashing — Dosa & Deteksi</h2>
<p><strong>Definisi.</strong> <strong>Greenwashing</strong>: klaim ESG <em>melebihi</em> realita. <strong>Deteksi</strong>: (1) <em>vague</em> ('komitmen hijau' tanpa angka); (2) <em>cherry-pick</em> (1 proyek hijau, 99% kotor); (3) <em>provider shopping</em> (pilih rating tertinggi); (4) <em>tidak ada voting record</em> (ngaku engagement, tidak pernah voting!).</p>
<p><strong>Pertahanan</strong>: <em>kebijakan tertulis</em> + <em>metrik terukur</em> + <em>audit independen</em> + <em>transparansi penuh</em>.</p>
<p><strong>Kepribadian/intuisi:</strong> Greenwashing seperti <strong>kosmetik tebal</strong>: dari jauh glowing (brosur), dekat retak (portofolio). Regulator &amp; jurnalis = <strong>cahaya terang</strong> — makin terang, makin terlihat retaknya. Solusi: <strong>skincare</strong> (perbaiki beneran), bukan <strong>makeup</strong> (klaim).</p>
<p><strong>Kapan dipakai:</strong> Due diligence produk 'ESG'; desain kebijakan sendiri.</p>
<p><strong>Pendalaman intuisi &mdash; greenwashing = &ldquo;kebohongan hijau&rdquo;.</strong> Klaim &ldquo;100% ESG&rdquo; tapi isi <em>batubara</em>! <strong><em>Red flags</em>:</strong> <em>vague</em> (tanpa definisi!)! <em>holdings vs klaim</em>! <em>provider shopping</em>! <em>voting nol</em>! <strong>Dampak:</strong> <em>denda</em>! <em>redeem</em> massal! <em>reputasi</em> hancur! <strong>Aturan:</strong> <strong><em>klaim</em> = <em>bukti</em></strong>. <strong><em>Tidak bisa buktikan</em> = <em>jangan klaim</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Audit 'Green Future' (klik untuk buka)</summary>
<p><strong>Red flags</strong>: (1) '100% ESG' tanpa definisi; (2) 15% batubara; (3) provider X (skor murah hati); (4) <strong>voting record: nol</strong> (tidak pernah engagement!).</p>
<p><strong>Kebijakan kredibel</strong>: definisi tertulis + <em>ambang batas</em> (batubara &lt; 5% &amp; turun tiap tahun) + <em>2 provider</em> + <em>voting dipublikasi</em> + <em>audit tahunan</em>.</p>
<p><strong>Hasil</strong>: AUM turun 40% (jangka pendek) → <strong>kepercayaan pulih</strong> (jangka panjang). Integritas = <strong>strategi bisnis</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Deteksi greenwashing &mdash; audit</summary>
<p><strong>Soal:</strong> dana &ldquo;hijau&rdquo;: <em>prospektus</em> vague, <em>holdings</em> 15% batubara, <em>voting</em> nol. <em>Audit</em>!</p>
<p><strong><em>Red flags</em>:</strong> (1) <strong><em>Vague</em></strong> (apa itu &ldquo;hijau&rdquo;?); (2) <strong><em>Holdings</em></strong> (batubara!); (3) <strong><em>Voting</em></strong> (nol = <em>palsu</em>!); (4) <strong><em>Provider</em></strong> (<em>shopping</em>?).</p>
<p><strong>Kesimpulan:</strong> <strong><em>greenwashing</em></strong>! <strong><em>Lapor</em></strong>! <strong><em>Redeem</em></strong>! <strong><em>Jangan</em> percaya <em>label</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Membangun yang kredibel</summary>
<p><strong>Soal:</strong> rancang dana ESG <em>kredibel</em>.</p>
<p><strong>Desain:</strong> (1) <strong><em>Definisi</em> tertulis</strong> (&ldquo;batubara &lt;5%, <em>menurun</em>&rdquo;!); (2) <strong><em>2 provider</em></strong> (<em>cross-check</em>!); (3) <strong><em>Voting</em> publikasi</strong>!; (4) <strong><em>Audit</em> independen</strong>!; (5) <strong><em>Lapor</em> dampak</strong> (<em>metrik</em>!).</p>
<p><strong>Prinsip:</strong> <strong><em>transparansi</em> = <em>kepercayaan</em>.</strong> <strong><em>Buktikan</em>, jangan <em>klaim</em>.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Uang Bersih</h2>
      <p>Etika, ESG, greenwashing = <strong>satu fondasi</strong>:</p>
      <ol>
        <li><strong>ETIKA = <em>kepercayaan</em></strong> &mdash; <strong><em>utamakan</em> klien</strong>!</li>
        <li><strong>ESG = <em>risiko</em></strong> &mdash; <strong><em>integrasikan</em></strong>, jangan <em>hiasan</em>!</li>
        <li><strong>ANTI-GREENWASHING = <em>bukti</em></strong> &mdash; <strong><em>klaim</em> = <em>verifikasi</em></strong>!</li>
      </ol>
      <p><strong><em>Bersih</em> = <em>bertahan</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Etika = biaya&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;<em>Compliance</em> = <em>biaya</em>! <em>Kompetitor</em> curang = <em>menang</em>!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;<strong><em>Kepercayaan</em> = <em>aset</em>.</strong> <em>Curang</em> = <em>mati</em> (Enron!). <strong><em>Jangka panjang</em> &gt; <em>jangka pendek</em>.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>etika</em> = <em>strategi</em>.</strong></p>
      <h3>🧪 Eksperimen: Tes &ldquo;koran&rdquo;</h3>
      <p><strong>Bayangkan</strong> keputusanmu <em>headline</em> besok. <strong><em>Nyaman</em>?</strong> Jika <em>tidak</em> &rarr; <strong><em>jangan</em></strong>! <strong><em>Tes koran</em> = <em>kompas</em>.</strong></p>
      <h3>📰 Studi Kasus: Enron</h3>
      <p><strong><em>SPV</em></strong>! <em>Mark-to-model</em>! <strong><em>Bangkrut</em> 2001</strong>! <em>Andersen</em> (auditor!) = <em>mati</em> juga!</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Akuntansi</em> kreatif = <em>bom</em></strong>; (2) <strong><em>Auditor</em> <em>komplis</em> = <em>mati</em></strong>; (3) <strong><em>Budaya</em> &gt; <em>aturan</em></strong>.</p>
      <h3>📊 Data Corner: Denda ESG</h3>
      <p><strong>Data:</strong> <em>greenwashing</em> = <em>denda</em> jutaan USD! <em>Redeem</em> = <em>miliaran</em>!</p>
      <p><strong><em>Klaim palsu</em> = <em>mahal</em>.</strong> <strong><em>Jujur</em> = <em>murah</em>.</strong></p>
      <h3>📖 Kamus Istilah</h3>
      <p><strong><em>Fiduciary</em></strong>! <em>Material nonpublic</em>! <em>Soft dollars</em>! <em>Greenwashing</em>! <em>Engagement</em>! <strong>Hafalkan!</strong></p>
      <h3>💡 Prinsip Abadi Etika</h3>
      <p><strong>(1) <em>Klien</em> dulu.</strong> (2) <strong><em>Ungkap</em> konflik.</strong> (3) <strong><em>Jangan</em> menipu.</strong> (4) <strong><em>Buktikan</em> klaim.</strong> (5) <strong><em>Lapor</em> pelanggaran.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> 4 <em>red flags</em> greenwashing? <strong>Q2:</strong> Teman bisik info &rarr; <em>tindakan</em>? <strong>Q3:</strong> <em>Etika</em> vs <em>legal</em>?</p>
      <p><strong>Lulus</strong> = jawab ketiganya.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-C1:</strong> <em>fidusia</em> = <em>dibahas</em> di sana! <strong>Ke PM-A1:</strong> <em>etika dasar</em>!</p>
      <h3>🔬 Deep Dive Tambahan: CFA Standards (Ringkas)</h3>
      <p><strong>I. <em>Profesionalisme</em>:</strong> <em>hukum</em>! <em>independensi</em>! <em>tidak menipu</em>! <em>misconduct</em>!</p>
      <p><strong>II. <em>Integritas pasar</em>:</strong> <em>material nonpublic</em>! <em>manipulasi</em>!</p>
      <p><strong>III. <em>Kewajiban ke klien</em>:</strong> <em>loyalty</em>! <em>fair dealing</em>! <em>suitability</em>! <em>kinerja</em>! <em>confidentiality</em>!</p>
      <p><strong>IV. <em>Kewajiban ke pemberi kerja</em>:</strong> <em>loyalty</em>! <em>kompensasi</em>! <em>supervisor</em>!</p>
      <p><strong>V. <em>Analisis</em>:</strong> <em>diligence</em>! <em>komunikasi</em>! <em>record retention</em>!</p>
      <p><strong>VI. <em>Konflik</em>:</strong> <em>ungkap</em>! <em>prioritas transaksi</em>! <em>referral fee</em>!</p>
      <p><strong>VII. <em>Tanggung jawab</em>:</strong> <em>sebagai anggota</em>! <strong><em>Hafalkan</em> 7 standar!</strong></p>
      <h3>📊 Data Corner: Pelanggaran Terbanyak</h3>
      <p><strong>Data (CFA Institute):</strong> <em>pelanggaran</em> terbanyak = <strong><em>misrepresentasi</em></strong>! (kinerja! kredensial!).</p>
      <p><strong>Pelajaran:</strong> <strong><em>jujur</em></strong> tentang <em>apa</em> yang kamu <em>tahu</em> &amp; <em>tidak tahu</em>. <strong><em>Integritas</em> = <em>karier</em>.</strong></p>
      <h3>🧪 Eksperimen: Audit Etikamu</h3>
      <p><strong>Tanya:</strong> (1) <em>Konflik</em> apa yang <em>kumiliki</em>? (2) <em>Diungkap</em>? (3) <em>Klien</em> diutamakan?</p>
      <p><strong><em>Jujur</em></strong> = <em>langkah pertama</em>.</p>
      <h3>💡 Prinsip Abadi Etika (Lengkap)</h3>
      <p><strong>(1) <em>Klien</em> dulu</strong> (<em>loyalty</em>!). <strong>(2) <em>Ungkap</em> konflik</strong> (<em>transparansi</em>!). <strong>(3) <em>Jangan</em> menipu</strong> (<em>integritas</em>!). <strong>(4) <em>Buktikan</em> klaim</strong> (<em>verifikasi</em>!). <strong>(5) <em>Lapor</em> pelanggaran</strong> (<em>keberanian</em>!).</p>
      <p><strong>(6) <em>Etika</em> &gt; <em>legal</em></strong> (<em>standar tertinggi</em>!). <strong>(7) <em>Budaya</em> &gt; <em>aturan</em></strong> (<em>tone at top</em>!). <strong>(8) <em>Jangka panjang</em> &gt; <em>jangka pendek</em></strong> (<em>kepercayaan</em>!).</p>
      <p><strong>8 prinsip. <em>Hiduplah</em>.</strong></p>
      <h3>🎓 Ujian Akhir (Lengkap)</h3>
      <p><strong>Q1:</strong> 4 <em>red flags</em> greenwashing?</p>
      <p><strong>Q2:</strong> Teman bisik info material. <em>Tindakan</em>?</p>
      <p><strong>Q3:</strong> <em>Etika</em> vs <em>legal</em> &mdash; mana <em>lebih tinggi</em>?</p>
      <p><strong>Q4:</strong> Temukan <em>pelanggaran</em>. <em>Langkah</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>🔗 Menghubungkan (Lengkap)</h3>
      <p><strong>Ke PM-C1:</strong> <em>fidusia</em>! <strong>Ke PM-A1:</strong> <em>etika dasar</em>! <strong>Ke PM-C5:</strong> <em>GIPS</em>!</p>
      <p><strong>Etika = <em>fondasi</em> semua.</strong></p>
      <h3>📰 Studi Kasus Lengkap: Theranos</h3>
      <p><strong>Klaim:</strong> <em>revolusi</em> tes darah! <strong>Realita:</strong> <em>bohong</em>! <strong><em>Penjara</em> 11 tahun</strong> (Holmes!).</p>
      <p><strong>Pelajaran:</strong> (1) <strong><em>Verifikasi</em></strong>! (2) <strong><em>Whistleblower</em></strong> = <em>pahlawan</em>! (3) <strong><em>Hype</em> &ne; <em>kebenaran</em></strong>.</p>
      <h3>🌍 Etika Global: Perbedaan Budaya</h3>
      <p><strong><em>Hadiah</em>:</strong> Jepang = <em>normal</em>! AS = <em>suap</em>! <strong><em>Standar</em> CFA</strong> = <em>global</em>!</p>
      <p><strong>Aturan:</strong> <strong><em>ikuti</em> yang <em>lebih ketat</em></strong>! <strong><em>Ragu</em> = <em>jangan</em>.</strong></p>
      <h3>⚖️ Regulasi ESG: Tren Global</h3>
      <p><strong>EU:</strong> <em>SFDR</em>! <em>Taxonomy</em>! <strong>AS:</strong> <em>SEC climate</em>! <strong><em>Global</em>:</strong> <em>ISSB</em>!</p>
      <p><strong>Dampak:</strong> <em>wajib</em> ungkap! <em>Standar</em> naik! <strong><em>Siapkan</em>!</strong></p>
      <h3>🤖 AI &amp; Etika</h3>
      <p><strong><em>Bias</em> algoritma</strong>! <em>Transparansi</em>! <em>Akuntabilitas</em>! <strong><em>Etika</em> AI</strong> = <em>frontier</em>!</p>
      <p><strong>Prinsip:</strong> <strong><em>manusia</em> bertanggung jawab</strong>! <strong><em>Jangan</em> delegasikan <em>etika</em>.</strong></p>
      <h3>📋 Template Kebijakan ESG (Siap Pakai)</h3>
      <p><strong>DEFINISI:</strong> &ldquo;ESG berarti ___&rdquo; <strong>AMBANG:</strong> Batubara &lt; ___%</p>
      <p><strong>PROVIDER:</strong> ___ + ___ (<em>cross-check</em>!) <strong>VOTING:</strong> Dipublikasi di ___</p>
      <p><strong>AUDIT:</strong> ___ (independen, tahunan) <strong>LAPOR:</strong> Metrik ___</p>
      <p><strong><em>Salin</em>. <em>Isi</em>. <em>Patuhi</em>.</strong></p>
      <h3>💬 Satu Nasihat Terakhir</h3>
      <p><strong>&ldquo;<em>Integritas</em> adalah <em>satu-satunya</em> aset yang <em>tidak bisa</em> dibeli &mdash; hanya <em>bisa</em> hilang.&rdquo;</strong></p>
      <p><strong><em>Jagalah</em>.</strong></p>
      <h3>🎯 Studi Kasus Mini (Latihan)</h3>
      <p><strong>KASUS 1:</strong> Atasan suruh <em>manipulasi</em> laporan. <em>Tindakan</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Tolak</em> + <em>dokumentasikan</em> + <em>lapor</em></strong> (<em>whistleblowing</em>!).</p>
      <p><strong>KASUS 2:</strong> Klien mau <em>produk</em> yang <em>tidak cocok</em>. <em>Tindakan</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Edukasi</em> + <em>tawarkan</em> alternatif</strong> (<em>suitability</em>!). <em>Jangan</em> jual!</p>
      <p><strong>KASUS 3:</strong> Temukan <em>fee</em> tersembunyi. <em>Tindakan</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Ungkap</em> ke klien</strong> (<em>transparansi</em>!).</p>
      <p><strong><em>Latihan</em> = <em>kesiapan</em>.</strong></p>
      <h3>📚 Bacaan Lanjutan (Pilihan)</h3>
      <p><strong>CFA <em>Standards</em>:</strong> <em>wajib</em> baca! <strong>Eccles:</strong> <em>ESG</em>!</p>
      <p><strong>Taleb:</strong> <em>Skin in the Game</em> &mdash; <em>etika</em>!</p>
      <p><strong><em>Baca</em> = <em>bijak</em>.</strong></p>
      <h3>❓ FAQ Etika</h3>
      <p><strong>Q: <em>Hadiah</em> dari klien?</strong> A: <strong><em>Kecil</em></strong> &amp; <em>diungkap</em> = <em>boleh</em>. <strong><em>Besar</em></strong> = <em>tolak</em>!</p>
      <p><strong>Q: <em>Side job</em>?</strong> A: <strong><em>Ungkap</em></strong> ke pemberi kerja! <em>Konflik</em>? <em>Jangan</em>!</p>
      <p><strong>Q: <em>Media sosial</em>?</strong> A: <strong><em>Hati-hati</em></strong>! <em>Rekomendasi</em> = <em>tanggung jawab</em>!</p>
      <h3>🔮 Masa Depan Etika &amp; ESG</h3>
      <p><strong><em>Regulasi</em>:</strong> <em>lebih ketat</em>! <strong><em>Teknologi</em>:</strong> <em>AI</em> &amp; <em>etika</em>! <strong><em>Generasi</em>:</strong> <em>millennial</em> peduli ESG!</p>
      <p><strong><em>Siap</em></strong> = <em>unggul</em>. <strong><em>Abaikan</em></strong> = <em>tertinggal</em>.</p>
      <h3>🏆 Profesional Berintegritas: Ciri-ciri</h3>
      <p><strong>(1) <em>Jujur</em></strong>! <strong>(2) <em>Berani</em></strong> (<em>lapor</em>!). <strong>(3) <em>Kompeten</em></strong>! <strong>(4) <em>Peduli</em></strong> (klien!).</p>
      <p><strong><em>Jadilah</em></strong>!</p>
      <h3>📝 Jurnal Etika (Template)</h3>
      <p><strong>TANGGAL:</strong> ___ <strong>SITUASI:</strong> ___</p>
      <p><strong>DILEMA:</strong> ___ <strong>KEPUTUSAN:</strong> ___</p>
      <p><strong>ALASAN:</strong> ___ <strong>HASIL:</strong> ___</p>
      <p><strong><em>Refleksi</em> = <em>pertumbuhan</em>.</strong></p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> 7 standar CFA &mdash; sebutkan 3! <strong>A:</strong> <strong>Profesionalisme! Integritas! Klien!</strong></p>
      <p><strong>Q2:</strong> <em>Material nonpublic</em> &rarr; <em>boleh</em> trading? <strong>A:</strong> <strong><em>Tidak</em>!</strong></p>
      <p><strong>Q3:</strong> <em>Red flag</em> greenwashing? <strong>A:</strong> <strong><em>Vague</em>! <em>Holdings</em>! <em>Voting</em> nol!</strong></p>
      <p><strong>Q4:</strong> <em>Etika</em> vs <em>legal</em>? <strong>A:</strong> <strong><em>Etika</em> &gt; <em>legal</em></strong>!</p>
      <p><strong>Q5:</strong> Temukan <em>pelanggaran</em> &rarr; ? <strong>A:</strong> <strong><em>Whistleblowing</em></strong>!</p>
      <h3>🔗 Rantai Kepercayaan (Ringkas)</h3>
      <p><strong>INTEGRITAS</strong> (pribadi!) &rarr; <strong>KEPERCAYAAN</strong> (klien!) &rarr; <strong>BISNIS</strong> (bertahan!) &rarr; <strong>DAMPAK</strong> (positif!).</p>
      <p><strong><em>Rantai</em> putus</strong> = <em>semua</em> hancur. <strong><em>Jaga</em> mata pertama.</strong></p>
      <h3>💪 Latihan Praktik (3 Skenario)</h3>
      <p><strong>SKENARIO A:</strong> Kamu analis. Temukan <em>greenwashing</em>. <em>Tulis</em> laporan <em>whistleblowing</em>!</p>
      <p><strong>SKENARIO B:</strong> Klien <em>desak</em> produk tidak cocok. <em>Role-play</em> penolakan <em>etis</em>!</p>
      <p><strong>SKENARIO C:</strong> <em>Audit</em> dana &ldquo;ESG&rdquo;. <em>Daftar</em> 5 yang diperiksa!</p>
      <p><strong><em>Praktik</em> = <em>siap</em>.</strong></p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>LEVEL 1:</strong> <em>Tahu</em> standar. <strong>LEVEL 2:</strong> <em>Terapkan</em>. <strong>LEVEL 3:</strong> <em>Ajarkan</em>. <strong>LEVEL 4:</strong> <em>Hiduplah</em>.</p>
      <p><strong><em>Etika</em> = <em>perjalanan</em>.</strong></p>
      <h3>🌟 Penutup: Warisanmu</h3>
      <p><strong><em>Karier</em></strong> = 40 tahun. <strong><em>Reputasi</em></strong> = selamanya.</p>
      <p><strong><em>Bangun</em></strong> dengan <em>integritas</em>. <strong><em>Jaga</em></strong> dengan <em>keberanian</em>.</p>
      <p><strong><em>Warisan</em> terbaik</strong> = <em>kepercayaan</em>.</p>
      <h3>📜 Sumpah Profesional (Renungkan)</h3>
      <p>&ldquo;Saya <em>berjanji</em>: <em>klien</em> dulu. <em>Jujur</em> selalu. <em>Kompeten</em> terus. <em>Berani</em> saat sulit.&rdquo;</p>
      <p><strong><em>Ucapkan</em></strong>. <strong><em>Hiduplah</em></strong>.</p>
      <h3>🤝 Komunitas CFA: Bergabunglah</h3>
      <p><strong><em>Society</em> Indonesia</strong>! <em>Networking</em>! <em>Belajar</em>! <em>Standar</em>!</p>
      <p><strong><em>Bersama</em></strong> = <em>lebih kuat</em>.</p>
      <h3>📖 Esai: Integritas adalah Strategi</h3>
      <p><strong><em>Integritas</em></strong> <em>bukan</em> <strong><em>bebas</em></strong>. <strong><em>Integritas</em></strong> = <strong><em>strategi</em></strong> <em>jangka panjang</em>. <strong><em>Klien</em></strong> <em>percaya</em> = <strong><em>bisnis</em></strong> <em>bertahan</em>. <strong><em>Reputasi</em></strong> = <strong><em>aset</em></strong> <em>tak ternilai</em>.</p>
      <p><strong><em>Curang</em></strong> = <strong><em>untung</em></strong> <em>sebentar</em>, <strong><em>rugi</em></strong> <em>selamanya</em>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Integritas</em></strong> = <strong><em>warisan</em></strong>. <strong><em>Bangunlah</em></strong>.</p>
      <h3>💎 Warisan Sejati</h3>
      <p><strong><em>Uang</em></strong> = <strong><em>sementara</em></strong>. <strong><em>Reputasi</em></strong> = <strong><em>abadi</em></strong>. <strong><em>Pilihlah</em></strong> <em>abadi</em>.</p>
      <p><strong><em>Integritas</em></strong> = <strong><em>abadi</em></strong>.</p>
      <h3>💎 Integritas Abadi</h3>
      <p><strong><em>Integritas</em></strong> = <strong><em>abadi</em></strong>. <strong><em>Uang</em></strong> = <strong><em>fana</em></strong>. <strong><em>Pilih</em></strong> <em>abadi</em>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      <p><strong><em>Teruslah</em></strong> <strong><em>belajar</em></strong> dan <strong><em>berkembang</em></strong>.</p>
      <p><strong><em>Maju</em></strong> <strong><em>terus</em></strong>.</p>
      <p><strong><em>Excellent</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;ESG = return lebih rendah (biaya moral).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Meta-studi: integrasi ESG <strong>netral hingga positif</strong> untuk return — karena ESG material = <strong>risiko yang diukur</strong> (bukan amal!). Yang menurunkan return = <em>exclusion membabi buta</em> (semesta menyempit). <strong>Integrasi ≠ donasi.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Skor ESG tinggi = perusahaan baik. Beli yang skor 90+.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Skor <strong>45–85 untuk perusahaan sama</strong> (divergence!) + bisa <strong>dibeli</strong> (provider shopping). Skor = <em>opini bermetodologi</em>, bukan fakta. Pakai sebagai <strong>starting point riset</strong>, bukan keputusan. 'Green Future' = korban skor mentah.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Etika = menghambat cuan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>etika</em> = <em>jangka panjang</em></strong>! <em>Curang</em> = <em>untung</em> sesaat, <em>mati</em> selamanya. <strong><em>Kepercayaan</em> = <em>aset</em> termahal.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;ESG = amal.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>ESG = <em>risiko</em></strong>! (<em>Stranded</em>! <em>Regulasi</em>! <em>Reputasi</em>!). <strong><em>Integrasi</em> = <em>analisis</em>.</strong> <strong><em>Bukan</em> donasi.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Tulis kebijakan ESG 1 halaman.</strong> Definisi + ambang batas + provider + voting policy + audit. Tanpa tulisan = klaim = calon greenwashing. Satu halaman melindungi dari denda & redeem.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Uji 'berani diumumkan?'</strong> Untuk tiap keputusan etika abu-abu (soft dollars, alokasi IPO): 'berani tulis di factsheet?' Jika tidak — jangan lakukan. <strong>Transparansi = kompas.</strong></strong></p>
</div>

<div className="tip">
<p><strong>💡 Tes etika 3-pertanyaan:</strong> (1) <strong><em>Legal</em>?</strong> (2) <strong><em>Adil</em> untuk klien?</strong> (3) <strong><em>Nyaman</em> jika dipublikasi?</strong> <strong><em>Gagal</em> 1 = <em>jangan</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Pemeriksa Soft-Dollar</h2>
<p>Audit penggunaan komisi: mana yang boleh, mana pelanggaran.</p>
<PyodideLab
  title={"Lab 1 — Pemeriksa Soft-Dollar"}
  hint={"Ubah SEWA 200 → 0 dan FEE_BAYAR True. Status berubah BERSIH — struktur yang benar!"}
  defaultCode={"# Pemeriksa soft-dollar: manfaat klien vs manajer?\nRISET = 300   # Rp jt (data, analis)\nSEWA = 200    # Rp jt ('terminal & sewa') - ubah!\nDISCLOSE = True\nFEE_BAYAR = False  # sewa dibayar dari fee manajemen? (ubah!)\n\nprint(f\"Riset Rp{RISET}jt: {'OK' if True else ''} (manfaat klien)\" + (\" + disclose\" if DISCLOSE else \" TANPA DISCLOSE!\"))\nmasalah = []\nif SEWA > 0 and not FEE_BAYAR:\n    masalah.append(f\"Sewa Rp{SEWA}jt dari soft-dollar = PELANGGARAN (manfaat manajer!)\")\nif not DISCLOSE:\n    masalah.append(\"Tanpa disclosure = pelanggaran\")\nif masalah:\n    print(\"HASIL: BERMASALAH\")\n    for m in masalah: print(\" -\", m)\nelse:\n    print(\"HASIL: BERSIH (riset disclose + operasional dari fee sendiri)\")\nprint(\"\\nAturan: 'berani tulis di factsheet?'\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Agregator Skor ESG</h2>
<p>Lihat rating divergence: satu perusahaan, banyak skor.</p>
<PyodideLab
  title={"Lab 2 — Agregator ESG"}
  hint={"Ubah skor PROVIDER_D 45 → 80 (provider murah hati). Rata-rata naik — manipulasi semudah itu!"}
  defaultCode={"# Rating divergence: jangan telan skor mentah\nskor = {\"Provider A\": 85, \"Provider B\": 62, \"Provider C\": 78, \"Provider D\": 45}  # ubah D!\nvals = list(skor.values())\nimport statistics\nprint(\"Skor perusahaan X:\")\nfor k, v in skor.items(): print(f\"  {k}: {v}\")\nprint(f\"\\nRentang: {min(vals)}-{max(vals)} (selisih {max(vals)-min(vals)}!)\")\nprint(f\"Rata2: {statistics.mean(vals):.0f}, Std: {statistics.pstdev(vals):.0f}\")\nprint()\nprint(\"Korelasi antar-provider ~0,5 (kredit: ~0,99).\")\nprint(\"Pakai skor untuk RISET (kenapa beda?), bukan LABEL.\")\nprint(\"Provider shopping = greenwashing by proxy.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Pakai komisi klien → <strong>Hanya untuk manfaat klien + disclose</strong></h3>
<p><strong>Kenapa:</strong> Loyalty.</p>
<p><strong>Contoh nyata:</strong> Riset OK; sewa TIDAK.</p>
</div>
<div className="decision-card">
<h3>2. Alokasi IPO terbatas → <strong>Proporsional, terdokumentasi</strong></h3>
<p><strong>Kenapa:</strong> Fair dealing.</p>
<p><strong>Contoh nyata:</strong> Tidak untuk favorit.</p>
</div>
<div className="decision-card">
<h3>3. Analisis fundamental → <strong>Integrasi ESG material per sektor</strong></h3>
<p><strong>Kenapa:</strong> Risiko = valuasi.</p>
<p><strong>Contoh nyata:</strong> Pajak karbon → arus kas.</p>
</div>
<div className="decision-card">
<h3>4. Klaim 'ESG' produk → <strong>Kebijakan tertulis + metrik + audit</strong></h3>
<p><strong>Kenapa:</strong> Anti-greenwashing.</p>
<p><strong>Contoh nyata:</strong> 1 halaman + voting record.</p>
</div>
<div className="decision-card">
<h3>5. Klaim ESG → <strong>Verifikasi: definisi, holdings, voting, audit</strong></h3>
<p><strong>Kenapa:</strong> Label ≠ isi; greenwashing = denda + redeem.</p>
<p><strong>Contoh nyata:</strong> 'Green Future': klaim 100%, isi batubara 15%.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Loyalty + disclosure</strong> selalu.</li><li><strong>Integrasi</strong>, bukan sekadar exclusion.</li><li><strong>Engagement</strong> &gt; label.</li><li><strong>Skor</strong> = riset, bukan keputusan.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Dana 'Hijau' Berisi Batubara</h2>
<div className="callout">
<p>'Green Future' Rp2T: klaim '100% ESG', isi 15% batubara, provider X murah hati, voting record nol. Denda + redeem massal.</p>
<p><strong>Vignette lanjutan.</strong> Dana &ldquo;Green Future&rdquo; Rp2T: klaim &ldquo;100% ESG&rdquo;, ternyata isi <strong>15% batubara</strong>! <em>Provider</em> X &ldquo;murah hati&rdquo; (<em>shopping</em>!). <em>Voting record</em> = <strong>nol</strong>. Hasil: <em>denda</em> + <em>redeem</em> massal.</p>
<p><strong>Pertanyaan:</strong> (a) Identifikasi 4 <em>red flags</em>. (b) Rancang kebijakan kredibel. (c) Pelajaran etika umum? (d) Jika kamu <em>analis</em> yang <em>menemukan</em> ini &mdash; <em>apa</em> yang dilakukan? (e) Bagaimana <em>mencegah</em> di organisasimu?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Vague</strong> (tanpa definisi) + <strong>holdings vs klaim</strong> + <strong>provider shopping</strong> + <strong>voting nol</strong> (engagement palsu).</p>
<p>(d) <strong><em>Whistleblowing</em>!</strong> (1) <strong><em>Dokumentasikan</em></strong> (bukti!); (2) <strong><em>Lapor</em> internal</strong> (<em>compliance</em>!); (3) <strong><em>Jika diabaikan</em></strong> &rarr; <em>regulator</em>! <strong>Standar CFA:</strong> <em>wajib</em> lapor <em>pelanggaran</em>! <strong><em>Diam</em> = <em>komplis</em>.</strong></p>
<p>(e) <strong><em>Sistem</em>:</strong> (1) <strong><em>Kode etik</em></strong> tertulis! (2) <strong><em>Training</em></strong> tahunan! (3) <strong><em>Whistleblower</em> protection</strong>! (4) <strong><em>Audit</em></strong> independen! (5) <strong><em>Tone at the top</em></strong>! <strong><em>Budaya</em> &gt; <em>aturan</em>.</strong></p>
<p>(b) <strong>Definisi tertulis</strong> + ambang (batubara &lt;5% menurun) + <strong>2 provider</strong> + <strong>voting dipublikasi</strong> + <strong>audit independen tahunan</strong>.</p>
<p>(c) <strong>Klaim palsu &gt; tidak klaim.</strong> Integritas = strategi bisnis jangka panjang. Uji 'berani diumumkan?' untuk semua area abu-abu.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Etika Lanjut</h2>
      <h3>1. Fiduciary duty &mdash; &ldquo;amanah suci&rdquo;</h3>
      <p><strong><em>Loyalty</em></strong>! <strong><em>Care</em></strong>! <strong><em>Obedience</em></strong>! <strong><em>Standar tertinggi</em></strong> hukum! <strong><em>Pelanggaran</em></strong> = <em>dituntut</em>! <strong><em>Pahami</em>!</strong></p>
      <h3>2. Impact investing &mdash; &ldquo;cuan + manfaat&rdquo;</h3>
      <p><strong><em>Return</em> + <em>dampak</em></strong>! <strong><em>Ukur</em></strong> keduanya! (<em>IRIS</em>!). <strong><em>Tradeoff</em></strong>? <strong><em>Transparan</em></strong>!</p>
      <h3>3. Regulasi ESG &mdash; &ldquo;hutan aturan&rdquo;</h3>
      <p><strong>EU <em>taxonomy</em></strong>! <strong>SEC <em>climate</em></strong>! <strong>ISSB</strong>! <strong><em>Ikuti</em></strong>! <strong><em>Patuhi</em></strong>!</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Konflik kilat</h3>
      <p>Rekomendasikan X, pribadi jual X. Pelanggaran?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong>Ya!</strong> <em>Konflik</em> + <em>tidak diungkap</em>!</p>
      </details>
      <h3>Drill 2 &mdash; Insider kilat</h3>
      <p>Teman bisik &ldquo;akuisisi!&rdquo;. Beli?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>Jangan!</strong> <em>Material nonpublic</em>!</p>
      </details>
      <h3>Drill 3 &mdash; Greenwash kilat</h3>
      <p>Klaim &ldquo;hijau&rdquo;, isi batubara. <em>Red flag</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong><em>Holdings vs klaim</em></strong>! <em>Audit</em>!</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Legal = etis.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Etika</em> &gt; <em>legal</em>!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Soft dollars Rp500jt: Rp300jt riset + Rp200jt sewa. Penilaian?"}
  options={
    ["Semua OK",
    "Riset OK (disclose); sewa = pelanggaran",
    "Semua pelanggaran",
    "Terserah"]
  }
  correct={1}
  explanation={"Benar: uji = untuk siapa manfaatnya? Riset → klien ✓. Sewa → manajer ✗ (bayar dari fee sendiri!)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Skor ESG 45–85 untuk perusahaan sama. Implikasi?"}
  options={
    ["Pilih tertinggi",
    "Divergence: pahami metodologi, pakai untuk riset",
    "Rata-ratakan",
    "Abaikan ESG"]
  }
  correct={1}
  explanation={"Benar: korelasi antar-provider ~0,5. Skor mentah = opini. 'Green Future' hancur karena provider shopping."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Bukti dampak ESG terkuat?"}
  options={
    ["Exclusion",
    "Engagement (voting, dialog)",
    "Marketing hijau",
    "Skor tinggi"]
  }
  correct={1}
  explanation={"Benar: engagement aktif memperbaiki perusahaan. Exclusion = cuci tangan; voting record nol = engagement palsu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Alokasi IPO terbatas ke 'klien favorit'. Ini?"}
  options={
    ["OK",
    "Pelanggaran fair dealing",
    "Strategi",
    "Rahasia dapur"]
  }
  correct={1}
  explanation={"Benar: alokasi harus proporsional & terdokumentasi. Favoritisme = melanggar loyalty ke klien lain."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Pertahanan greenwashing terbaik?"}
  options={
    ["Brosur lebih bagus",
    "Kebijakan tertulis + metrik + audit + transparansi",
    "Ganti provider",
    "Diam"]
  }
  correct={1}
  explanation={"Benar: klaim tanpa bukti = calon denda. Satu halaman kebijakan + voting record + audit = kredibel."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Dana '100% ESG' ternyata isi 15% batubara, voting nol. Tindakan TEPAT?"}
  options={
    ["Diam — bukan urusan saya",
    "Dokumentasikan, lapor internal, jika diabaikan → regulator (whistleblowing)",
    "Jual diam-diam",
    "Percaya label"]}
  correct={1}
  explanation={"Benar: Standar CFA mewajibkan lapor pelanggaran. Diam = komplis. Greenwashing = klaim palsu = pelanggaran etika."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Soft dollars</strong>: hanya manfaat klien + disclose; operasional dari fee.</li>
<li><strong>Fair dealing</strong>: IPO proporsional; directed brokerage waspadai eksekusi.</li>
<li><strong>ESG</strong>: integrasi (material) &gt; exclusion; engagement (voting) = dampak.</li>
<li><strong>Divergence</strong>: skor 45–85; pahami metodologi; anti provider-shopping.</li>
<li><strong>Greenwashing</strong>: klaim &gt; realita; deteksi via vagueness, holdings, voting.</li>
<li><strong>Aturan</strong>: 'berani diumumkan?'; integritas = strategi.</li>

<li><strong>Etika:</strong> utamakan klien; ungkap konflik; standar &gt; legal.</li>
<li><strong>ESG:</strong> faktor risiko; integrasi vs exclusion.</li>
<li><strong>Greenwashing:</strong> verifikasi klaim; red flags; whistleblowing.</li>
<li><strong>Kapan TIDAK pakai:</strong> klaim tanpa bukti; diam saat pelanggaran; etika = legal.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c10-trading-execution" className="btn btn-secondary btn-sm">← PM-C10</Link>
        <Link href="/learn/pm-d1-data-harga" className="btn btn-primary btn-sm">PM-D1 →</Link>
      </div>
    </div>
  );
}

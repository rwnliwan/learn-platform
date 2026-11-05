"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA4FinancialStatementsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A4 — Portfolio Management</span>
        <h1 className="display-title">Financial Statements:<br/>Membaca 3 Laporan & Rasio</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Laba Naik 40%, Kas Malah Minus</a></li>
<li><a href="#tiga">Tiga Laporan</a></li>
<li><a href="#pilihan">Pilihan Akuntansi</a></li>
<li><a href="#rasio">Rasio & DuPont</a></li>
<li><a href="#sintesis">Sintesis: Alur Analis Forensik</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: MajuJaya</a></li>
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
<li>Menjelaskan keterkaitan tiga laporan keuangan.</li>
<li>Membedakan dampak FIFO vs LIFO dan depresiasi terhadap laba.</li>
<li>Menghitung rasio likuiditas, solvabilitas, dan profitabilitas + DuPont.</li>
<li>Mengidentifikasi red flag kualitas laba (accruals, receivables).</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Laba Naik 40%, Kas Malah Minus</h2>
      <div className="story">
        <p><strong>PT MajuJaya</strong> melaporkan laba bersih <strong>naik 40%</strong>. Sahamnya melonjak. Sebulan kemudian: <strong>gagal bayar utang</strong>. Kok bisa?</p>
<p>Twist-nya ada di arus kas: <strong>kas operasi negatif</strong>. Laba 40% itu datang dari <strong>piutang yang membengkak</strong> (penjualan ke distributor 'titip' akhir tahun — channel stuffing) dan <strong>penyusutan diperpanjang</strong> (beban turun, laba naik, kas tidak berubah). Laba = opini; <strong>kas = fakta</strong>. Lesson ini: membaca yang tidak ditulis di headline — kualitas laba.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="tiga">Tiga Laporan — Satu Cerita</h2>
<p><strong>Definisi.</strong> <strong>Income statement</strong>: kinerja <em>periode</em> (revenue → laba). <strong>Balance sheet</strong>: posisi <em>saat</em> itu (Aset = Liabilitas + Ekuitas). <strong>Cash flow</strong>: kas <em>bergerak</em> (operasi, investasi, pendanaan). Keterkaitan: laba bersih → menambah <strong>retained earnings</strong> di ekuitas; arus kas operasi = laba ± non-kas ± modal kerja.</p>
<p><strong>Aturan emas</strong>: laba tanpa kas = curiga. <strong>Cash flow operasi</strong> adalah laporan yang paling sulit dimanipulasi.</p>
<Tex math={String.raw`\text{Aset} = \text{Liabilitas} + \text{Ekuitas} \quad;\quad CFO = \text{Laba} \pm \text{Non-kas} \pm \Delta\text{Modal Kerja}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Persamaan dasar akuntansi — selalu seimbang (double-entry)</li>
<li>CFO: laba + depresiasi (non-kas) − kenaikan piutang/persediaan + kenaikan utang usaha</li>
<li>Laba naik + CFO turun = pola MajuJaya → investigasi</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Tiga laporan seperti <strong>rapor, foto, dan rekening</strong>: income statement = rapor semester (nilai), balance sheet = foto dompet hari ini (isi), cash flow = mutasi rekening (uang beneran masuk-keluar). Rapor bisa 'dipercantik'; mutasi sulit bohong.</p>
<p><strong>Kapan dipakai:</strong> Screening awal setiap emiten: bandingkan laba vs CFO 5 tahun.</p>

<p><strong>Pendalaman intuisi &mdash; tiga laporan, tiga sudut pandang, satu kebenaran.</strong> <strong>Neraca</strong> = <em>foto</em> sesaat (apa yang dimiliki &amp; dari mana dananya <em>pada tanggal itu</em>). <strong>Laba rugi</strong> = <em>film</em> setahun (cerita kinerja, penuh estimasi &amp; akrual). <strong>Arus kas</strong> = <em>kenyataan</em> (kas benar-benar masuk/keluar &mdash; sulit dimanipulasi). Analis forensik membaca dengan urutan terbalik dari orang awam: <strong>kas dulu, laba kemudian, neraca untuk verifikasi</strong>. Jika filmnya (laba) indah tapi kenyataannya (kas) berdarah &mdash; percayalah pada kenyataan.</p>
<details className="worked">
<summary>📐 Contoh: Bedah MajuJaya (klik untuk buka)</summary>
<p><strong>IS:</strong> laba +40% (Rp140M). <strong>BS:</strong> piutang +120% (Rp200M). <strong>CF:</strong> CFO <strong>−Rp30M</strong>.</p>
<p><strong>Rekonsiliasi:</strong> CFO = 140 + depresiasi 50 − Δpiutang 200 − Δpersediaan 20 = −30. Laba 'dimakan' piutang.</p>
<p><strong>Kesimpulan 1 menit:</strong> pertumbuhan tidak berkualitas (channel stuffing). Hindari — atau short jika sudah pegang. Inilah kenapa analis membaca CF <em>dulu</em>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Rekonsiliasi laba → CFO (metode tidak langsung)</summary>
<p><strong>Soal:</strong> laba bersih Rp140M, depresiasi Rp50M, piutang <em>naik</em> Rp80M, inventori <em>naik</em> Rp30M, utang usaha <em>naik</em> Rp20M. Hitung CFO.</p>
<p><strong>Langkah 1 &mdash; mulai dari laba:</strong> 140. <strong>Langkah 2 &mdash; tambah beban non-kas:</strong> +50 (depresiasi tidak mengeluarkan kas) &rarr; 190. <strong>Langkah 3 &mdash; modal kerja:</strong> piutang naik = kas <em>terjebak</em> &rarr; &minus;80; inventori naik &rarr; &minus;30; utang naik = kas <em>ditahan</em> &rarr; +20.</p>
<p><strong>Hasil: CFO = 140 + 50 &minus; 80 &minus; 30 + 20 = Rp100M.</strong></p>
<p><strong>Aturan jempol:</strong> aset lancar <em>naik</em> = kas <em>keluar</em> (&minus;); liabilitas lancar <em>naik</em> = kas <em>masuk</em> (+). Kebalikannya untuk penurunan. Hafalkan: &ldquo;<strong>aset naik = dompet tipis</strong>&rdquo;.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Dari CFO ke Free Cash Flow</summary>
<p><strong>Soal:</strong> lanjutkan contoh 2. Capex Rp60M. Hitung FCFF (arus kas bebas untuk firma).</p>
<p><strong>Langkah 1:</strong> FCFF = CFO &minus; capex (investasi modal yang <em>wajib</em> untuk mempertahankan operasi).</p>
<p><strong>Langkah 2:</strong> FCFF = 100 &minus; 60 = <strong>Rp40M</strong>.</p>
<p><strong>Interpretasi berlapis:</strong> laba Rp140M &rarr; CFO Rp100M &rarr; FCFF Rp40M. Tiga angka, tiga cerita: <em>akuntansi</em> bilang 140, <em>kas operasi</em> bilang 100, <em>kas yang benar-benar bebas</em> bilang 40. <strong>Valuasi DCF memakai yang 40, bukan yang 140</strong> &mdash; inilah kenapa analis yang hanya membaca laba rugi membayar kemahalan.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Common-size &mdash; siapa lebih efisien?</summary>
<p><strong>Soal:</strong> Emiten X: revenue Rp1T, COGS Rp600M, opex Rp250M. Emiten Y: revenue Rp500M, COGS Rp350M, opex Rp100M. Siapa lebih efisien?</p>
<p><strong>Langkah 1 &mdash; jadikan % revenue:</strong> X: gross margin 40%, opex 25%, net 15%. Y: gross margin 30%, opex 20%, net 10%.</p>
<p><strong>Langkah 2 &mdash; baca:</strong> X unggul di <em>gross margin</em> (pricing power / skala produksi), tapi opex-nya lebih boros (25% vs 20%). <strong>Kesimpulan bernuansa:</strong> X punya produk lebih kuat, Y dikelola lebih ramping. Jika X bisa menekan opex ke 20% &rarr; net margin 20% &mdash; <em>itulah</em> tesis investasinya (margin expansion story).</p>
<p><strong>Pelajaran:</strong> common-size mengubah &ldquo;Rp600M vs Rp350M&rdquo; (tidak comparable) menjadi &ldquo;40% vs 30%&rdquo; (langsung bicara). <strong>Selalu normalisasi sebelum membandingkan.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; CFO negatif ≠ bangkrut.</strong> Startup / emiten ekspansi agresif <em>wajar</em> punya CFO negatif (modal kerja membengkak untuk tumbuh). Yang berbahaya adalah <strong>pola</strong>: CFO negatif <em>sementara laba positif &amp; tumbuh</em> selama 3+ tahun = kas tidak pernah mengikuti laba. Satu tahun negatif = siklus; lima tahun divergen = masalah.</p>
</div>
<PlotlyChart
  data={[{x: ["2021","2022","2023","2024","2025"], y: [80,95,100,110,140], type: "bar", marker: {color: "#2a7de1"}, name: "laba bersih"}, {x: ["2021","2022","2023","2024","2025"], y: [70,80,60,20,-30], type: "bar", marker: {color: "#e8a838"}, name: "CFO"}]}
  title={"MajuJaya: laba vs kas operasi"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Rp M"}, barmode: "group", showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = laba bersih, kuning = kas operasi. Seharusnya bergerak searah.</p>
<p><strong>Interpretasi:</strong> 2023–2025: <strong>divergensi melebar</strong> — laba naik, kas anjlok ke negatif. Pola klasik manipulasi akrual. Aturan screening: jika (laba − CFO)/aset &gt; 10% bertahun-tahun → <strong>buang dari watchlist</strong>.</p>
</div>

<PlotlyChart
  data={[{x: ["2019","2020","2021","2022","2023"], y: [100,115,130,140,155], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Laba bersih (RpM)"}, {x: ["2019","2020","2021","2022","2023"], y: [95,80,60,20,-30], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "CFO (RpM)"}]}
  title={"Pola klasik manipulasi: laba naik, kas ambruk"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Rp miliar"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = laba bersih (akuntansi), merah = arus kas operasi (kenyataan), 5 tahun.</p>
<p><strong>Interpretasi:</strong> Laba <em>naik konsisten</em> (100&rarr;155) &mdash; terlihat indah. Tapi CFO <em>runtuh</em> (95&rarr;&minus;30): <strong>divergensi melebar tiap tahun</strong>. Ini pola <em>channel stuffing</em> / penjualan kredit agresif: revenue diakui, kas tidak masuk-masuk. <strong>Aturan:</strong> divergensi laba-vs-CFO yang melebar 2+ tahun = <em>red flag</em> level 1 &mdash; jangan beli sebelum tahu ke mana kasnya pergi.</p>
</div>
<h2 id="pilihan">Pilihan Akuntansi — Laba yang 'Dimasak' Legal</h2>
<p><strong>Definisi.</strong> <strong>FIFO vs LIFO</strong> (saat harga naik): FIFO → COGS rendah → laba tinggi, pajak tinggi; LIFO → sebaliknya (dilarang IFRS!). <strong>Depresiasi</strong>: garis lurus (beban rata) vs dipercepat (beban besar di awal → laba awal kecil, pajak kecil). <strong>Pajak tangguhan</strong>: beda laba akuntansi vs fiskal → aset/liabilitas pajak tangguhan.</p>
<p>Prinsip: <strong>bandingkan apel dengan apel</strong> — dua emiten beda metode depresiasi = laba tidak comparable. Normalisasi dulu.</p>
<p><strong>Kepribadian/intuisi:</strong> Pilihan akuntansi seperti <strong>filter foto</strong>: objeknya sama, tampilannya beda. FIFO = filter cerah (laba kinclong, pajak mahal); depresiasi dipercepat = filter gelap di awal (pajak hemat). Tugas analis: lihat foto aslinya (kas).</p>
<p><strong>Kapan dipakai:</strong> Bandingkan emiten se-industri: samakan asumsi dulu.</p>

<p><strong>Pendalaman intuisi &mdash; spektrum manajemen laba: dari legal hingga kriminal.</strong> Bayangkan garis lurus: di ujung kiri <strong>pilihan akuntansi wajar</strong> (metode depresiasi, estimasi piutang tak tertagih &mdash; diizinkan standar). Di tengah <strong>manajemen laba agresif</strong> (<em>channel stuffing</em>, menunda pengakuan biaya &mdash; legal tapi kualitas laba nol). Di ujung kanan <strong>fraud</strong> (fiktif revenue &mdash; kriminal). Tugas analis bukan menghakimi motif, melainkan <strong>mengukur kualitas</strong>: seberapa banyak laba yang didukung kas? Makin ke kanan spektrum, makin besar <em>diskon</em> yang harus kamu terapkan pada valuasi.</p>
<details className="worked">
<summary>📐 Contoh: FIFO vs LIFO (klik untuk buka)</summary>
<p>Beli 100 unit @Rp10, lalu 100 unit @Rp14. Jual 100 unit @Rp20.</p>
<p><strong>FIFO</strong> (jual yang lama): COGS = 100×10 = Rp1.000 → laba kotor Rp1.000.</p>
<p><strong>LIFO</strong> (jual yang baru): COGS = 100×14 = Rp1.400 → laba kotor Rp600.</p>
<p><strong>Selisih laba 67%!</strong> — dari transaksi yang <em>identik</em>. IFRS melarang LIFO justru karena ini. Saat baca emiten US (boleh LIFO) vs Indonesia (IFRS): adjust.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): R&amp;D &mdash; dibebankan vs dikapitalisasi</summary>
<p><strong>Soal:</strong> emiten teknologi belanja R&amp;D Rp100M/tahun (manfaat 5 tahun). Bandingkan laba tahun 1 jika (a) dibebankan langsung vs (b) dikapitalisasi &amp; diamortisasi 5 tahun.</p>
<p><strong>(a) Expense:</strong> laba tahun 1 terpukul <strong>Rp100M</strong> penuh. <strong>(b) Kapitalisasi:</strong> amortisasi = 100/5 = <strong>Rp20M/tahun</strong> &mdash; laba tahun 1 hanya terpukul Rp20M, tapi 4 tahun berikutnya ikut terpukul Rp20M.</p>
<p><strong>Dampak rasio:</strong> di bawah (b), ROA tahun 1 terlihat <em>jauh</em> lebih bagus (laba lebih tinggi + aset lebih besar karena ada &ldquo;aset R&amp;D&rdquo;). <strong>Dua emiten identik bisa punya ROE beda 5pp hanya karena pilihan ini.</strong> Standar (PSAK/IFRS): riset &rarr; expense; <em>pengembangan</em> yang memenuhi kriteria &rarr; boleh kapitalisasi &mdash; area abu-abu yang rawan disalahgunakan untuk &ldquo;mempercantik&rdquo; laba.</p>
<p><strong>Aksi analis:</strong> normalisasi &mdash; perlakukan R&amp;D konsisten antar-peer sebelum membandingkan. Jangan bandingkan apel (expense) dengan jeruk (kapitalisasi).</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Depresiasi &mdash; garis lurus vs saldo menurun</summary>
<p><strong>Soal:</strong> mesin Rp100M, umur 5 tahun, tanpa nilai sisa. Bandingkan beban depresiasi tahun 1&ndash;2.</p>
<p><strong>Garis lurus:</strong> 100/5 = <strong>Rp20M/tahun</strong> (flat). <strong>Saldo menurun 2&times; (DDB):</strong> tahun 1 = 40% &times; 100 = <strong>Rp40M</strong>; tahun 2 = 40% &times; 60 = <strong>Rp24M</strong>.</p>
<p><strong>Implikasi:</strong> DDB menekan laba <em>awal</em> lebih dalam (laba tahun 1 selisih Rp20M!) tapi total 5 tahun <em>sama</em> (Rp100M). Emiten yang baru ganti ke DDB akan terlihat &ldquo;kinerjanya memburuk&rdquo; padahal cuma akuntansi. <strong>Arus kas tidak berubah sepeser pun</strong> &mdash; depresiasi bukan kas. Inilah bukti ke-1001 kenapa analis membaca arus kas.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Pengakuan pendapatan &mdash; kontrak jangka panjang</summary>
<p><strong>Soal:</strong> kontrak konstruksi Rp1T, total biaya estimasi Rp600M, biaya tahun 1 Rp300M. Berapa revenue &amp; laba tahun 1 (metode % penyelesaian)?</p>
<p><strong>Langkah 1 &mdash; % selesai:</strong> 300/600 = <strong>50%</strong>. <strong>Langkah 2 &mdash; revenue:</strong> 50% &times; 1T = <strong>Rp500M</strong>. <strong>Langkah 3 &mdash; laba:</strong> 500 &minus; 300 = <strong>Rp200M</strong>.</p>
<p><strong>Risiko manipulasi:</strong> semua bergantung pada <em>estimasi total biaya</em> (Rp600M). Jika manajemen &ldquo;optimis&rdquo; (estimasi Rp500M) &rarr; % selesai = 60% &rarr; revenue Rp600M &rarr; laba Rp300M (+50%!). <strong>Satu asumsi, laba naik 50%.</strong> Area inilah yang paling sering dimainkan pada kasus fraud konstruksi &mdash; analis wajib membandingkan estimasi vs realisasi historis.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Bandingkan apel dengan apel.</strong> Sebelum membandingkan rasio dua emiten: samakan <strong>kebijakan akuntansi</strong> (FIFO vs average? kapitalisasi vs expense?), <strong>akhir tahun fiskal</strong>, dan <strong>definisi</strong> (gross debt vs net debt?). Soal CFA <em>suka</em> memberi dua emiten beda metode depresiasi lalu bertanya &ldquo;mana lebih efisien&rdquo; &mdash; jawaban benar sering kali &ldquo;<strong>tidak bisa dibandingkan tanpa penyesuaian</strong>&rdquo;.</p>
</div>

<PlotlyChart
  data={[{x: ["Net margin","Asset turnover","Leverage"], y: [12,1.2,1.4], type: "bar", marker: {color: "#2a7de1"}, name: "Emiten A (ROE 20%)", text: ["12%","1,2×","1,4×"], textposition: "outside"}, {x: ["Net margin","Asset turnover","Leverage"], y: [4,1.0,5.0], type: "bar", marker: {color: "#e8a838"}, name: "Emiten B (ROE 20%)", text: ["4%","1,0×","5,0×"], textposition: "outside"}]}
  title={"Dua ROE 20%: kualitas bumi-langit (DuPont)"}
  layout={{xaxis: {title: "Komponen DuPont"}, yaxis: {title: "Nilai"}, showlegend: true, barmode: "group"}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga komponen DuPont per emiten. Keduanya ROE = 20% (12%&times;1,2&times;1,4 &asymp; 20%; 4%&times;1,0&times;5,0 = 20%).</p>
<p><strong>Interpretasi:</strong> Emiten A: ROE dari <strong>operasi</strong> (margin 12%, leverage jinak 1,4&times;). Emiten B: ROE dari <strong>utang</strong> (leverage 5&times;!). Saat suku bunga naik 2%, beban bunga B meledak &rarr; ROE-nya kolaps; A santai. <strong>Jangan pernah membeli ROE &mdash; belilah <em>komposisinya</em>.</strong></p>
</div>
<h2 id="rasio">Rasio & DuPont — X-Ray Perusahaan</h2>
<p><strong>Definisi.</strong> <strong>Likuiditas</strong>: current ratio (aset lancar/liabilitas lancar), quick ratio. <strong>Solvabilitas</strong>: DER (utang/ekuitas), interest coverage (EBIT/bunga). <strong>Profitabilitas</strong>: margin (laba/revenue), ROA, ROE. <strong>DuPont 3-langkah</strong>: ROE = margin × asset turnover × leverage.</p>
<p>DuPont membedah <em>dari mana</em> ROE datang: margin tinggi (pricing power), turnover tinggi (efisiensi), atau leverage tinggi (<strong>rapuh!</strong>).</p>
<Tex math={String.raw`ROE = \frac{\text{Laba}}{\text{Rev}} \times \frac{\text{Rev}}{\text{Aset}} \times \frac{\text{Aset}}{\text{Ekuitas}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\frac{\text{Laba}}{\text{Rev}}`} />: net margin — pricing power</li>
<li><Tex math={String.raw`\frac{\text{Rev}}{\text{Aset}}`} />: asset turnover — efisiensi operasional</li>
<li><Tex math={String.raw`\frac{\text{Aset}}{\text{Ekuitas}}`} />: leverage — pengali yang juga pengali risiko</li>
<li>ROE 25% dari leverage 5x ≠ ROE 25% dari margin 20% (yang kedua jauh lebih aman)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> DuPont seperti <strong>tes darah</strong>: ROE = 'sehat' saja tidak cukup — dokter melihat kolesterol (leverage), gula (margin), tekanan darah (turnover). ROE tinggi karena leverage = atlet doping.</p>
<p><strong>Kapan dipakai:</strong> Bandingkan ROE antar-emiten: tolak yang ROE-nya dari utang.</p>

<p><strong>Pendalaman intuisi &mdash; rasio adalah EKG, bukan vonis.</strong> Satu angka rasio tanpa pembanding = detak jantung tanpa tahu umur pasien. Rasio menjadi bermakna lewat <strong>tiga pembanding</strong>: (1) <strong>tren</strong> (membaik/memburuk 5 tahun?), (2) <strong>peer</strong> (vs rata-rata industri?), (3) <strong>ekonomi</strong> (masuk akal secara bisnis?). ROE 30% bisa berarti <em>moat</em> luar biasa &mdash; atau leverage 10&times; yang siap meledak. <strong>Angka tidak berdusta; analis yang malas membaca konteks yang tertipu.</strong></p>
<details className="worked">
<summary>📐 Contoh: Dua ROE 20% (klik untuk buka)</summary>
<p><strong>Emiten A:</strong> margin 15% × turnover 1,0 × leverage 1,33 = <strong>20%</strong>. <strong>Emiten B:</strong> margin 4% × turnover 1,0 × leverage 5,0 = <strong>20%</strong>.</p>
<p><strong>A</strong>: ROE dari pricing power (aman). <strong>B</strong>: ROE dari utang 5x (DER 4!) — naikkan suku bunga sedikit → coverage jebol.</p>
<p>Pilih A walau ROE sama. <strong>Kualitas ROE &gt; angka ROE.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): DuPont 3-langkah &mdash; bedah ROE 30%</summary>
<p><strong>Soal:</strong> NPM 10%, perputaran aset 1,5&times;, <em>leverage</em> (aset/ekuitas) 2&times;. Hitung ROE dan bedah kualitasnya.</p>
<p><strong>Langkah 1:</strong> ROE = 10% &times; 1,5 &times; 2 = <strong>30%</strong>.</p>
<p><strong>Langkah 2 &mdash; bedah:</strong> margin 10% (lumayan), perputaran 1,5&times; (efisien), leverage 2&times; (moderat). <strong>ROE 30% ini &ldquo;sehat&rdquo;</strong> &mdash; didorong operasi, bukan utang.</p>
<p><strong>Bandingkan:</strong> emiten Z: NPM 5%, ATO 1&times;, leverage 6&times; &rarr; ROE = 30% juga! Tapi Z = <strong>bom waktu</strong> (leverage 6&times;). <strong>Dua ROE 30% yang kualitasnya bumi-langit.</strong> DuPont memaksa kita bertanya: <em>dari mana</em> ROE itu berasal?</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Cash Conversion Cycle &mdash; seberapa cepat jadi kas?</summary>
<p><strong>Soal:</strong> DSO 90 hari, DIO 60 hari, DPO 45 hari. Hitung CCC dan interpretasikan.</p>
<p><strong>Langkah 1:</strong> CCC = DSO + DIO &minus; DPO = 90 + 60 &minus; 45 = <strong>105 hari</strong>.</p>
<p><strong>Interpretasi:</strong> kas <em>terjebak</em> 105 hari dari bayar supplier hingga terima dari pelanggan. Tiap Rp1M penjualan harian &rarr; Rp105M kas menganggur di modal kerja! <strong>Tuas perbaikan:</strong> tekan DSO (tagih lebih cepat), tekan DIO (inventori ramping), <em>ulur</em> DPO (bayar supplier lebih lambat &mdash; tanpa merusak relasi). Supermarket (DPO &gt; DSO+DIO) bisa punya <strong>CCC negatif</strong> &mdash; dibayar pelanggan <em>sebelum</em> membayar supplier = mesin kas gratis.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Altman Z-score &mdash; alarm kebangkrutan kilat</summary>
<p><strong>Soal:</strong> WC/TA 0,2; RE/TA 0,3; EBIT/TA 0,15; MVE/TL 1,5; Sales/TA 1,2. Hitung Z.</p>
<p><strong>Langkah 1:</strong> Z = 1,2(0,2) + 1,4(0,3) + 3,3(0,15) + 0,6(1,5) + 1,0(1,2) = 0,24 + 0,42 + 0,495 + 0,9 + 1,2 = <strong>3,26</strong>.</p>
<p><strong>Langkah 2 &mdash; zona:</strong> &gt; 2,6 = aman; 1,1&ndash;2,6 = abu-abu; &lt; 1,1 = bahaya. <strong>3,26 = zona aman.</strong></p>

<details className="worked">
<summary>📐 Contoh 5 (gaya CFA): Beneish M-score &mdash; radar manipulasi</summary>
<p><strong>Soal:</strong> emiten menunjukkan: DSRI 1,3 (piutang tumbuh abnormal), GMI 0,9 (margin memburuk), AQI 1,2 (aset melunak), SGI 1,4 (penjualan tumbuh cepat), TATA 0,08 (akrual tinggi). Hitung M-score pendekatan &amp; interpretasikan.</p>
<p><strong>Langkah 1 &mdash; rumus ringkas:</strong> M &asymp; &minus;4,84 + 0,92(DSRI) + 0,528(GMI) + 0,404(AQI) + 0,892(SGI) + 4,679(TATA).</p>
<p><strong>Langkah 2:</strong> M = &minus;4,84 + 0,92(1,3) + 0,528(0,9) + 0,404(1,2) + 0,892(1,4) + 4,679(0,08) = &minus;4,84 + 1,196 + 0,475 + 0,485 + 1,249 + 0,374 = <strong>&minus;1,06</strong>.</p>
<p><strong>Langkah 3 &mdash; ambang:</strong> M &gt; &minus;1,78 = <em>red flag</em> (probabilitas manipulasi tinggi). <strong>&minus;1,06 &gt; &minus;1,78 &rarr; MERAH.</strong></p>
<p><strong>Intuisi tiap variabel:</strong> DSRI tinggi = revenue tanpa kas; GMI &lt; 1 = margin memburuk (insentif memanipulasi naik); SGI tinggi = tekanan &ldquo;tumbuh terus&rdquo;; TATA tinggi = akrual mendominasi laba. <strong>Beneish bukan bukti fraud</strong> &mdash; ia <em>skrining</em>: M merah &rarr; baca footnotes 3&times; lebih teliti.</p>
</details>
<details className="worked">
<summary>📐 Contoh 6: Kualitas laba &mdash; Sloan accruals</summary>
<p><strong>Soal:</strong> laba Rp140M, CFO Rp100M, total aset Rp1T. Hitung <em>accruals</em> ala Sloan &amp; interpretasikan.</p>
<p><strong>Langkah 1:</strong> accruals = (laba &minus; CFO) / aset = (140 &minus; 100)/1000 = <strong>4%</strong>.</p>
<p><strong>Langkah 2 &mdash; riset Sloan (1996):</strong> portofolio <em>accruals tertinggi</em> underperform terendah ~10%/tahun &mdash; karena akrual <em>mean-reverting</em> (piutang hari ini = write-off esok hari). Accruals &gt; 10% = zona berbahaya.</p>
<p><strong>Langkah 3:</strong> 4% = <strong>wajar</strong> (di bawah 10%). Tapi <em>tren</em>-nya yang penting: 4% &rarr; 8% &rarr; 12% dalam 3 tahun = perusahaan &ldquo;meminjam&rdquo; laba dari masa depan &mdash; dan masa depan menagih.</p>
<p><strong>Aturan praktis analis:</strong> sortir universe-mu by accruals; investigasi kuintil teratas. Sederhana, tapi mengalahkan banyak model kompleks.</p>
</details>

<p><strong>Catatan analis:</strong> Z-score adalah <em>skrining</em>, bukan vonis &mdash; ia gagal untuk bank (struktur neraca beda) dan untuk startup (RE negatif wajar). Pakai sebagai <strong>filter pertama</strong>: Z &lt; 1,8 &rarr; investigasi mendalam sebelum sentuh sahamnya.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; ROE &amp; leverage.</strong> Rumus DuPont menunjukkan ROE <em>naik</em> dengan leverage &mdash; tapi itu <strong>bukan</strong> &ldquo;leverage bagus&rdquo;. Leverage menaikkan <em>expected</em> ROE sekaligus <em>risiko</em> (volatilitas) ROE. Pemegang saham rasional menuntut return lebih tinggi untuk risiko itu &mdash; <em>net</em>-nya bisa nol (Modigliani-Miller!). Jangan pernah memuji ROE tinggi tanpa mengecek kolom leverage-nya.</p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Alur Analis Forensik (7 Langkah)</h2>
      <p>Tiga laporan + pilihan akuntansi + rasio = <strong>satu alur kerja forensik</strong>:</p>
      <ol>
        <li><strong>Kas dulu:</strong> CFO vs laba &mdash; divergen? (tiga)</li>
        <li><strong>Kualitas:</strong> CFO &rarr; FCFF &mdash; berapa kas yang benar-benar bebas? (tiga)</li>
        <li><strong>Normalisasi:</strong> samakan kebijakan akuntansi antar-peer (pilihan)</li>
        <li><strong>Efisiensi:</strong> common-size &mdash; siapa ramping, siapa boros? (tiga)</li>
        <li><strong>Bedah ROE:</strong> DuPont &mdash; dari operasi atau utang? (rasio)</li>
        <li><strong>Likuiditas:</strong> CCC &amp; DSO &mdash; di mana kas terjebak? (rasio)</li>
        <li><strong>Alarm:</strong> Altman Z + tren 5 tahun &mdash; aman, abu-abu, atau bahaya? (rasio)</li>
      </ol>
      <p><strong>Prinsip:</strong> tidak ada satu pun langkah yang memberi vonis &mdash; tapi <strong>tujuh langkah yang semuanya merah tidak pernah bohong</strong>. Inilah cara analis profesional menghindari MajuJaya berikutnya.</p>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Laba bersih naik = perusahaan sehat. Itu kan intinya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> MajuJaya: laba +40%, <strong>gagal bayar</strong>. Laba = akrual (opini manajemen); CFO = kas (fakta). Selalu bandingkan keduanya — divergensi &gt; 10% dari aset bertahun-tahun = red flag. 'Laba naik' tanpa kas = rapor bagus dari sekolah yang ujian bocor.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;ROE tinggi selalu bagus — cari saja ROE terbesar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> ROE = margin × turnover × <strong>leverage</strong>. ROE 20% dari utang 5x = bom waktu (lihat Emiten B). ROE tinggi + DER rendah + CFO sehat = baru berkualitas. Screening buta ROE = membeli doping.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Diaudit Big Four, pasti beres.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> audit memberi <strong><em>reasonable assurance</em></strong> (keyakinan wajar), <strong>bukan garansi</strong>. Auditor menguji <em>sampel</em>, mengandalkan <em>representasi manajemen</em>, dan bisa dikelabui kolusi. Enron diaudit Arthur Andersen (dulu Big Five). <strong>Audit mengurangi risiko salah saji material &mdash; tidak menghilangkannya.</strong> Analis tetap wajib skeptis: audit = satu lapis pertahanan, bukan pengganti analisismu.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Laba naik 40% = perusahaan makin sehat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> tanyakan <em>kualitasnya</em>: didukung kas? (CFO ikut naik?), berulang? (bukan sekali jual aset?), dari operasi? (bukan <em>one-off</em> pajak?). Laba +40% dengan CFO &minus;Rp30M (kasus MajuJaya) = <strong>laba kertas</strong>. <strong>Pertumbuhan laba tanpa pertumbuhan kas = cerita, bukan kinerja.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Baca arus kas dulu, income statement kemudian.</strong> CFO 5 tahun memberi tahu kualitas; IS memberi tahu cerita. Analis yang mulai dari IS = membaca brosur; yang mulai dari CF = memeriksa dapur.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Normalisasi sebelum bandingkan.</strong> Beda metode depresiasi/inventori = beda laba. Buat kolom 'adjusted' di model Excel-mu — ini yang membedakan analis serius dari screener gratisan.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Urutan baca analis forensik: KAS → LABA → CATATAN KAKI.</strong> (1) Arus kas operasi: apakah laba didukung kas? (2) Laba rugi: dari mana pertumbuhan berasal (operasi vs non-rutin)? (3) <strong>Catatan kaki (footnotes):</strong> di sinilah &ldquo;rahasia&rdquo; disembunyikan &mdash; kebijakan akuntansi, transaksi pihak berelasi, kontinjensi. Analis malas berhenti di halaman 1; analis forensik <em>mulai</em> dari catatan kaki.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Rasio Keuangan</h2>
<p>Masukkan angka 3 laporan — dapatkan 8 rasio kunci + lampu merah otomatis.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Rasio"}
  hint={"Ubah UTANG 400 -> 1200 (DER naik). Lihat coverage jebol — itulah Emiten B."}
  defaultCode={"# Kalkulator rasio dari 3 laporan (Rp miliar)\nREV, LABA, EBIT, BEBAN_BUNGA = 1000, 120, 180, 40\nASET_LANCAR, LIAB_LANCAR = 400, 250\nPERSEDIAAN = 120\nTOTAL_UTANG, EKUITAS, TOTAL_ASET = 400, 600, 1000  # ubah UTANG sesukamu\nCFO = 90\n\ndef cek(nama, v, batas, arah=\">=\"):\n    ok = (v >= batas) if arah == \">=\" else (v <= batas)\n    print(f\"  {nama:<22}: {v:>7.2f}  [{'OK' if ok else 'WASPADA'}] (syarat {arah} {batas})\")\n\nprint(\"Likuiditas & solvabilitas:\")\ncek(\"Current ratio\", ASET_LANCAR/LIAB_LANCAR, 1.2)\ncek(\"Quick ratio\", (ASET_LANCAR-PERSEDIAAN)/LIAB_LANCAR, 1.0)\ncek(\"DER\", TOTAL_UTANG/EKUITAS, 1.0, \"<=\")\ncek(\"Interest coverage\", EBIT/BEBAN_BUNGA, 3.0)\nprint(\"Profitabilitas:\")\ncek(\"Net margin\", LABA/REV, 0.10)\ncek(\"ROE\", LABA/EKUITAS, 0.15)\ncek(\"ROA\", LABA/TOTAL_ASET, 0.08)\nprint(f\"Kualitas laba (CFO/laba): {CFO/LABA:.0%} {'OK' if CFO/LABA>0.8 else 'WASPADA - pola MajuJaya!'}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Dekomposisi DuPont</h2>
<p>Bedah ROE jadi margin × turnover × leverage. Lihat dari mana ROE berasal.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator DuPont"}
  hint={"Ubah LEVERAGE_B 5.0 -> 1.5. ROE B anjlok — bukti ROE-nya 'palsu' (dari utang)."}
  defaultCode={"# DuPont 3-langkah: ROE = margin x turnover x leverage\ndef dupont(nama, margin, turnover, leverage):\n    roe = margin * turnover * leverage\n    print(f\"{nama}: {margin:.0%} x {turnover:.1f} x {leverage:.2f} = ROE {roe:.1%}\")\n    sumber = \"PRICING POWER (aman)\" if margin >= 0.12 else (\"LEVERAGE (rapuh!)\" if leverage >= 3 else \"efisiensi\")\n    print(f\"   Sumber ROE: {sumber}\\n\")\n    return roe\n\nprint(\"Dua emiten, ROE 'sama':\\n\")\nra = dupont(\"Emiten A\", 0.15, 1.0, 1.33)\nLEVERAGE_B = 5.0   # ubah sesukamu\nrb = dupont(\"Emiten B\", 0.04, 1.0, LEVERAGE_B)\nprint(f\"Kesimpulan: pilih A (ROE dari margin), waspadai B (ROE dari utang {LEVERAGE_B}x).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Laba naik tapi CFO turun/divergen → <strong>Investigasi / hindari</strong></h3>
<p><strong>Kenapa:</strong> Pola MajuJaya: akrual agresif atau channel stuffing.</p>
<p><strong>Contoh nyata:</strong> Cek Δpiutang vs Δrevenue.</p>
</div>
<div className="decision-card">
<h3>2. ROE tinggi + DER &gt; 2 → <strong>Tolak / diskon valuasi</strong></h3>
<p><strong>Kenapa:</strong> ROE dari leverage = rapuh terhadap rate shock.</p>
<p><strong>Contoh nyata:</strong> Cek interest coverage &lt; 3.</p>
</div>
<div className="decision-card">
<h3>3. Bandingkan 2 emiten beda metode akuntansi → <strong>Normalisasi dulu</strong></h3>
<p><strong>Kenapa:</strong> Laba tidak comparable (FIFO vs LIFO, depresiasi).</p>
<p><strong>Contoh nyata:</strong> Samakan ke FIFO + SL.</p>
</div>
<div className="decision-card">
<h3>4. Piutang tumbuh &gt; revenue 2 tahun → <strong>Red flag kolektibilitas</strong></h3>
<p><strong>Kenapa:</strong> Penjualan tidak tertagih = laba semu.</p>
<p><strong>Contoh nyata:</strong> Cek DSO & aging.</p>
</div>
<div className="decision-card">
<h3>5. Screening saham cepat → <strong>Piotroski F-Score (9 kriteria, lolos ≥ 7)</strong></h3>
<p><strong>Kenapa:</strong> Menggabungkan profitabilitas, leverage, likuiditas &amp; efisiensi operasi dalam 1 skor.</p>
<p><strong>Contoh nyata:</strong> F ≤ 3 = hindari; F ≥ 7 = kandidat value berkualitas.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Kas = fakta</strong>, laba = opini.</li><li><strong>DuPont</strong> setiap ROE.</li><li><strong>Normalisasi</strong> sebelum bandingkan.</li><li><strong>CFO/laba &gt; 80%</strong> = sehat.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Laba +40%, Gagal Bayar</h2>
<div className="callout">
<p>PT MajuJaya: laba +40% (Rp140M), piutang +120%, CFO −Rp30M, saham sempat melonjak lalu kolaps saat gagal bayar.</p>
<p><strong>Vignette lanjutan.</strong> PT MajuJaya: laba +40% (Rp140M), piutang +120% (Rp420M, revenue Rp1,4T), CFO &minus;Rp30M. Saham sempat melonjak 60% lalu kolaps saat gagal bayar kupon obligasi. Kamu analis kredit yang diminta mereview <em>setelah</em> kejadian &mdash; untuk mencegah terulang.</p>
<p><strong>Pertanyaan:</strong> (a) Tiga red flag dari angka? (b) Mekanisme &lsquo;channel stuffing&rsquo;? (c) Hitung DSO dan bandingkan dengan normal 45 hari. (d) Jika kamu analis kredit <em>sebelum</em> kolaps, tiga tindakan pencegahan? (e) Screening rule agar tidak kena lagi?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Divergensi laba vs CFO</strong> (−Rp30M vs +Rp140M); <strong>piutang +120%</strong> jauh di atas revenue; implisit <strong>DSO meledak</strong>.</p>
<p>(b) <strong>Channel stuffing</strong>: paksa distributor ambil barang akhir tahun (revenue diakui, kas belum masuk, retur mengintai). Legal di batas tertentu, tapi kualitas nol.</p>
<p>(c) <strong>Rule:</strong> (laba − CFO)/aset &gt; 10% dua tahun → buang; Δpiutang &gt; Δrevenue → investigasi; selalu baca CF sebelum IS.</p>
<p>(d) <strong>DSO = 420/1400 &times; 365 = 109,5 hari</strong> vs normal 45 hari &mdash; <strong>2,4&times; lebih lambat!</strong> Artinya kas terjebak 3,5 bulan di piutang. DSO &gt; 90 hari pada emiten non-proyek = <em>red flag</em> kuantitatif yang bisa dihitung siapa pun &mdash; tidak butuh &ldquo;feeling&rdquo;.</p>
<p>(e) <strong>Tiga tindakan analis kredit:</strong> (1) <strong>Bekukan plafon</strong> saat DSO &gt; 90 hari dua kuartal beruntun (<em>covenant</em> berbasis rasio, bukan janji); (2) <strong>Audit piutang</strong> &mdash; konfirmasi saldo ke distributor (channel stuffing ketahuan saat distributor &ldquo;tidak merasa memesan sebanyak itu&rdquo;); (3) <strong>Skenario likuiditas</strong>: jika 30% piutang tak tertagih, apakah <em>debt service</em> masih aman? Jika tidak &rarr; restrukturisasi <em>sebelum</em> gagal bayar.</p>
</details>
</div>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; CFO kilat</h3>
      <p>Laba Rp200M, depresiasi Rp60M, piutang <em>naik</em> Rp50M, inventori <em>turun</em> Rp20M, utang usaha <em>naik</em> Rp30M. CFO?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>CFO = 200 + 60 &minus; 50 <strong>+ 20</strong> (inventori turun = kas masuk!) + 30 = <strong>Rp260M</strong>. Jebakan: inventori <em>turun</em> &rarr; tanda <strong>plus</strong>. &ldquo;Aset naik = dompet tipis&rdquo; &rarr; aset <em>turun</em> = dompet tebal.</p>
      </details>
      <h3>Drill 2 &mdash; DuPont kilat</h3>
      <p>NPM 15%, ATO 0,8&times;, leverage 1,5&times;. ROE? Berkualitas?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>ROE = 15% &times; 0,8 &times; 1,5 = <strong>18%</strong>. Berkualitas: margin tinggi (15%), leverage jinak (1,5&times;) &mdash; ROE dari operasi, bukan utang.</p>
      </details>
      <h3>Drill 3 &mdash; CCC kilat</h3>
      <p>DSO 60, DIO 45, DPO 30. CCC? Butuh berapa kas untuk Rp2M penjualan harian?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>CCC = 60 + 45 &minus; 30 = <strong>75 hari</strong>. Kas terjebak = 75 &times; Rp2M = <strong>Rp150M</strong>. Jika DPO dinegosiasi ke 60 hari &rarr; CCC 45 &rarr; kas bebas Rp60M!</p>
      </details>
      <h3>Drill 4 &mdash; Vignette pengakuan pendapatan</h3>
      <p>Emiten mengakui revenue saat barang <em>dikirim ke distributor</em> (belum ke konsumen akhir), dengan hak retur 100% tanpa batas waktu. Masalahnya?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Premature recognition + channel stuffing.</strong> Risiko &amp; manfaat belum berpindah (retur 100% = distributor tidak menanggung risiko). Revenue seharusnya diakui saat <em>jual ke konsumen akhir</em> (atau dicadangkan retur yang besar). Pola ini = MajuJaya jilid 2 &mdash; cek DSO &amp; retur historis.</p>
      </details>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Tiga Area Abu-abu</h2>
      <h3>1. Pajak tangguhan &mdash; aset yang bukan aset?</h3>
      <p><strong>Konsep:</strong> laba akuntansi &ne; laba fiskal. Beda temporer (mis. depresiasi fiskal lebih cepat) menciptakan <strong>pajak tangguhan</strong>: <em>deferred tax liability</em> (bayar nanti) atau <em>asset</em> (bayar di muka).</p>
      <p><strong>Contoh:</strong> laba akuntansi Rp100M, depresiasi akuntansi Rp20M vs fiskal Rp50M &rarr; laba fiskal = 100 &minus; 30 = Rp70M. Pajak kini (25%) = Rp17,5M; beban pajak akuntansi = 25% &times; 100 = Rp25M. Selisih Rp7,5M = <strong>DTL</strong> (utang pajak masa depan).</p>
      <p><strong>Jebakan analis:</strong> DTA (aset pajak tangguhan) hanya bernilai jika perusahaan <em>yakin</em> akan laba di masa depan &mdash; untuk perusahaan merugi kronis, DTA = &ldquo;aset&rdquo; yang mungkin tidak pernah terealisasi. <strong>Analis konservatif mencoret DTA dari ekuitas</strong> saat menghitung <em>tangible book value</em>.</p>
      <h3>2. Sewa (PSAK 73/IFRS 16) &mdash; utang yang dulu sembunyi</h3>
      <p><strong>Dulu:</strong> <em>operating lease</em> (sewa kantor 10 tahun) <em>off-balance-sheet</em> &mdash; tidak muncul sebagai utang! Dua perusahaan identik bisa punya DER beda jauh hanya karena satu menyewa, satu membeli.</p>
      <p><strong>Kini (PSAK 73):</strong> hampir semua sewa &gt; 12 bulan <strong>wajib</strong> diakui: aset <em>right-of-use</em> + liabilitas sewa. DER &ldquo;melonjak&rdquo; bukan karena perusahaan memburuk &mdash; melainkan karena <strong>utang yang dulu tak terlihat kini terlihat</strong>.</p>
      <p><strong>Aksi analis:</strong> untuk data historis pra-PSAK 73, <strong>kapitalisasi operating lease manual</strong> (PV pembayaran sewa masa depan) agar tren DER comparable. Jangan memuji &ldquo;DER membaik&rdquo; yang ternyata cuma perubahan standar.</p>
      <h3>3. Pihak berelasi &mdash; kapan waspada, kapan wajar?</h3>
      <p><strong>Wajar:</strong> grup usaha saling jual-beli (efisiensi). <strong>Waspada:</strong> (1) porsi revenue dari pihak berelasi &gt; 30% &mdash; seberapa &ldquo;nyata&rdquo; pasarnya? (2) harga tidak wajar (jual murah ke perusahaan afiliasi pemilik &rarr; <em>tunneling</em>); (3) piutang berelasi menumpuk tanpa penagihan.</p>
      <p><strong>Contoh klasik:</strong> emiten &ldquo;menjual&rdquo; Rp200M ke anak perusahaan pemilik di luar negeri &mdash; revenue naik, kas tidak pernah kembali (piutang abadi). <strong>Uji:</strong> bandingkan margin penjualan berelasi vs pihak ketiga; selisih besar = bendera merah. Footnote &ldquo;transaksi pihak berelasi&rdquo; adalah bacaan wajib &mdash; di sanalah <em>tunneling</em> bersembunyi.</p>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Laba Rp140M, depresiasi Rp50M, piutang naik Rp200M, persediaan naik Rp20M. CFO?"}
  options={
    ["Rp140M",
    "−Rp30M",
    "Rp190M",
    "Rp410M"]
  }
  correct={1}
  explanation={"Benar: 140 + 50 − 200 − 20 = −30. Laba 'dimakan' modal kerja — pola MajuJaya klasik."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Harga naik. FIFO vs LIFO: mana laba lebih tinggi?"}
  options={
    ["LIFO",
    "FIFO (COGS dari barang lama yang murah)",
    "Sama",
    "Tergantung pajak"]
  }
  correct={1}
  explanation={"Benar: FIFO memakai COGS lama (murah) → laba tinggi → pajak tinggi. IFRS melarang LIFO karena distorsi ini."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. ROE 20% dari margin 4% × leverage 5x. Penilaian?"}
  options={
    ["Bagus — ROE tinggi",
    "Rapuh — ROE dari utang; sensitif rate shock",
    "Tidak bisa dinilai",
    "Lebih baik dari margin tinggi"]
  }
  correct={1}
  explanation={"Benar: DuPont membedah sumber. Leverage 5x = DER 4 — kenaikan bunga sedikit bisa menjebol coverage. Kualitas ROE &gt; angka ROE."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Red flag kualitas laba terkuat?"}
  options={
    ["Revenue naik",
    "CFO/laba &lt; 50% bertahun-tahun",
    "DER turun",
    "Dividen naik"]
  }
  correct={1}
  explanation={"Benar: laba tanpa kas = akrual agresif. Divergensi persisten adalah prediktor masalah paling andal di laporan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Interest coverage 1,5x. Artinya?"}
  options={
    ["Aman",
    "Berbahaya — EBIT hanya 1,5x beban bunga; guncangan kecil = gagal bayar",
    "Tidak relevan",
    "Bagus untuk growth"]
  }
  correct={1}
  explanation={"Benar: &lt; 3x = waspada, &lt; 1,5x = kritis. Coverage tipis + utang besar = kombinasi mematikan saat resesi."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. NPM 8%, perputaran aset 1,25x, leverage (aset/ekuitas) 2,5x. ROE?"}
  options={
    ["25%",
    "11,75%",
    "16%",
    "20%"]}
  correct={0}
  explanation={"Benar: ROE = 8% × 1,25 × 2,5 = 25%. Tapi waspada: leverage 2,5x cukup tinggi — cek apakah ROE ini 'sehat' (dari operasi) atau 'rapuh' (dari utang)."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>3 laporan</strong>: IS (kinerja), BS (posisi), CF (kas) — saling terkait via retained earnings &amp; rekonsiliasi.</li>
<li><strong>Kas = fakta</strong>: divergensi laba vs CFO = red flag utama.</li>
<li><strong>Pilihan akuntansi</strong> (FIFO/LIFO, depresiasi, pajak tangguhan) mengubah laba — normalisasi dulu.</li>
<li><strong>DuPont</strong>: ROE = margin × turnover × leverage — bedah sumbernya.</li>
<li><strong>Rasio kunci</strong>: current, quick, DER, coverage, margin, ROE, DSO.</li>
<li><strong>Kapan TIDAK percaya laba</strong>: accruals tinggi + CFO lemah + piutang meledak.</li>

<li><strong>Urutan baca:</strong> kas → laba → catatan kaki. Divergensi laba-vs-CFO 2+ tahun = red flag.</li>
<li><strong>DuPont:</strong> ROE = NPM × ATO × Leverage — beli komposisinya, bukan angkanya.</li>
<li><strong>CCC = DSO + DIO &minus; DPO;</strong> Altman Z &gt; 2,6 aman, &lt; 1,1 bahaya.</li>
<li><strong>Kapan TIDAK pakai:</strong> jangan bandingkan rasio beda kebijakan akuntansi; Z-score tidak valid untuk bank/startup; CFO negatif sekali ≠ vonis.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a3-economics" className="btn btn-secondary btn-sm">← PM-A3</Link>
        <Link href="/learn/pm-a5-corporate-issuers" className="btn btn-primary btn-sm">PM-A5 →</Link>
      </div>
    </div>
  );
}

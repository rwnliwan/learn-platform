"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA1EthicsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A1 — Portfolio Management</span>
        <h1 className="display-title">Ethics:<br/>Code, 7 Standards & GIPS</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Seminar di Bali</a></li>
<li><a href="#code">Code of Ethics</a></li>
<li><a href="#standards">Peta 7 Standards</a></li>
<li><a href="#gips">GIPS (Pengantar)</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#sintesis">Sintesis: Satu Hari Manajer Patuh</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Jam Tangan Sari</a></li>
<li><a href="#quiz">Quiz (6 soal)</a></li>
<li><a href="#latihan">Latihan Mandiri</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan 6 komponen Code of Ethics dan struktur 7 Standards.</li>
<li>Mengidentifikasi standar yang dilanggar pada skenario vignette umum.</li>
<li>Menjelaskan kewajiban dasar GIPS dan bedanya verification vs compliance.</li>
<li>Menerapkan framework pengambilan keputusan etis (identifikasi–evaluasi–konsultasi–dokumentasi).</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Seminar di Bali</h2>
      <div className="story">
        <p>Tahun 2019, seorang <em>fund manager</em> ternama di Asia menerima <strong>jam tangan mewah</strong> dari broker langganannya &mdash; &ldquo;terima kasih atas order selama ini&rdquo;. Tidak ada kontrak, tidak ada janji tertulis. Hanya jam tangan, senyum, dan pemahaman tak terucap: <em>order berikutnya lewat saya ya</em>.</p>
        <p>Dua tahun kemudian, audit internal menemukan pola: eksekusi order klien <strong>konsisten 0,3% lebih mahal</strong> dibanding broker alternatif &mdash; bukan karena broker itu jahat, melainkan karena sang manajer <em>tidak pernah membandingkan</em>. Ia &ldquo;lupa&rdquo; menawar, &ldquo;lupa&rdquo; mengecek alternatif. Loyalitasnya telah terbeli &mdash; bukan dengan suap terang-terangan, melainkan dengan <strong>kenyamanan</strong>.</p>
        <p>Twist-nya: tidak ada satu pun pihak yang <em>merasa</em> melakukan kejahatan. Broker merasa &ldquo;berterima kasih&rdquo;, manajer merasa &ldquo;masih profesional&rdquo;. Tapi klien &mdash; yang membayar 0,3% ekstra di setiap transaksi selama dua tahun &mdash; tidak pernah ditanya. <strong>Pelanggaran etika terbesar jarang berbentuk amplop cokelat; ia berbentuk kenyamanan yang tidak diungkapkan.</strong></p>
        <p>Lesson ini: 6 janji (Code), 7 rambu (Standards), dan 1 timbangan (GIPS) &mdash; perangkat agar &ldquo;kenyamanan&rdquo; semacam itu tertangkap <em>sebelum</em> merugikan klien.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="code">Code of Ethics — 6 Janji Profesional</h2>
<p><strong>Definisi.</strong> <strong>Code of Ethics</strong> = 6 prinsip aspirasional yang dijanjikan setiap CFA charterholder: (1) bertindak dengan integritas, kompetensi, ketekunan, hormat &amp; etis; (2) menempatkan <strong>integritas profesi dan kepentingan klien di atas kepentingan pribadi</strong>; (3) memakai pertimbangan independen &amp; reasonable care; (4) berpraktik profesional &amp; mendorong orang lain juga; (5) mempromosikan <strong>integritas pasar</strong>; (6) <strong>menjaga &amp; meningkatkan kompetensi</strong> diri.</p>
<p>Bedakan: <strong>Code</strong> = aspirasi (&ldquo;jadilah begini&rdquo;); <strong>Standards</strong> = aturan yang bisa ditegakkan (&ldquo;jangan lakukan ini&rdquo;). Ujian CFA menguji Standards, tapi Code adalah kompasnya.</p>
<p><strong>Kepribadian/intuisi:</strong> Code seperti <strong>sumpah dokter</strong> versi keuangan: bukan daftar larangan teknis, melainkan identitas — 'orang seperti kita tidak melakukan itu'. Standards adalah pasal-pasalnya.</p>
<p><strong>Kapan dipakai:</strong> Setiap dilema: kembali ke 6 janji sebelum mencari pasal.</p>
<details className="worked">
<summary>📐 Contoh: Uji 6 janji pada kasus Sari (klik untuk buka)</summary>
<p><strong>Janji 2</strong> (kepentingan klien di atas pribadi): jam tangan = kepentingan pribadi Sari vs klien (order diarahkan bukan demi eksekusi terbaik). <strong>Gagal.</strong></p>
<p><strong>Janji 3</strong> (independen): hadiah mengancam objektivitas. <strong>Gagal.</strong></p>
<p><strong>Janji 5</strong> (integritas pasar): mengarahkan order demi hadiah merusak fair market. <strong>Gagal.</strong></p>
<p>Kesimpulan 30 detik: 3 dari 6 janji gagal → tolak hadiah, atau terima lalu <strong>ungkapkan tertulis</strong> ke employer &amp; klien dan pastikan tidak memengaruhi keputusan.</p>
</details>
<p><strong>Pendalaman intuisi &mdash; kenapa Code dibuat aspirasional, bukan teknis?</strong> Karena <strong>aturan teknis selalu punya celah</strong>. Pelaku cerdas bisa mematuhi huruf peraturan sambil mengkhianati semangatnya (&ldquo;kan tidak ada pasal yang melarang <em>tepat seperti ini</em>&rdquo;). Code menutup celah itu: ia bertanya bukan &ldquo;pasal berapa yang dilanggar?&rdquo; melainkan &ldquo;<strong>apakah orang berintegritas melakukan ini?</strong>&rdquo;. Dalam vignette CFA, jika suatu perilaku <em>terasa</em> licik tapi kamu tidak menemukan pasalnya &mdash; jawabannya hampir selalu tetap <strong>melanggar</strong> (biasanya I(A), I(B), atau VII(A) sebagai &ldquo;pasal keranjang&rdquo;).</p>
<details className="worked">
<summary>📐 Vignette 2 (gaya CFA): Jamuan mewah &amp; tiket konser</summary>
<p><strong>Situasi:</strong> Budi, analis, diundang emiten untuk <em>site visit</em>. Emiten menanggung tiket pesawat + hotel wajar, <em>lalu</em> menambahinya: jamuan makan malam mewah Rp15 juta/orang + tiket konser VIP untuk istri Budi. Seminggu kemudian Budi menaikkan rating emiten itu dari HOLD ke BUY. Ia tidak mengungkapkan apa pun.</p>
<p><strong>Analisis per janji Code:</strong></p>
<p><strong>Janji 2</strong> (kepentingan klien &gt; pribadi): tiket konser untuk istri = manfaat <em>pribadi murni</em>, tidak ada nilai edukasi. <strong>Gagal.</strong></p>
<p><strong>Janji 3</strong> (independensi &amp; reasonable care): jamuan Rp15 juta + timing kenaikan rating seminggu setelahnya = objektivitas patut dipertanyakan <em>oleh reasonable person</em>. <strong>Gagal</strong> &mdash; standar memakai uji orang wajar, bukan pengakuan Budi (&ldquo;saya tetap objektif&rdquo; tidak relevan).</p>
<p><strong>Janji 5</strong> (integritas pasar): rating yang mungkin &ldquo;dibeli&rdquo; merusak kepercayaan pasar terhadap riset independen. <strong>Gagal.</strong></p>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Sudah jadi rumor&rdquo; ≠ informasi publik.</strong> II(A) melarang trading atas info material <em>nonpublik</em>. &ldquo;Tapi kan sudah banyak yang tahu / sudah rumor di grup WhatsApp&rdquo; <strong>bukan</strong> pembelaan &mdash; publik = disebarluaskan via kanal resmi (keterbukaan informasi BEI, siaran pers) sehingga <em>semua</em> investor punya akses setara. Rumor ≠ disclosure.</p>
</div>

<p><strong>Remediasi yang benar:</strong> (1) tolak/kembalikan bagian mewah (konser + jamuan di luar kewajaran); (2) <em>site visit</em> yang wajar (transport + akomodasi standar) <strong>boleh</strong> diterima <em>asal</em> <strong>diungkapkan tertulis</strong> ke employer dan ke klien/pembaca riset; (3) dokumentasikan basis analisis BUY (V(A)) agar rating bisa dipertahankan tanpa hadiah.</p>
<p><strong>Pelajaran ujian:</strong> CFA membedakan <em>modest &amp; disclosed</em> (boleh) vs <em>lavish or hidden</em> (langgar). Kata kunci soal: &ldquo;tidak mengungkapkan&rdquo; &rarr; hampir pasti ada pelanggaran disclosure.</p>
</details>

<h2 id="standards">7 Standards — Peta yang Wajib Hafal</h2>
<p><strong>Definisi.</strong> <strong>Standards of Professional Conduct</strong> = 7 kelompok aturan: <strong>I. Profesionalisme</strong> (A: Knowledge of Law, B: Independence &amp; Objectivity, C: Misrepresentation, D: Misconduct); <strong>II. Integritas Pasar Modal</strong> (A: Material Nonpublic Information, B: Market Manipulation); <strong>III. Kewajiban ke Klien</strong> (A: Loyalty/Prudence/Care, B: Fair Dealing, C: Suitability, D: Performance Presentation, E: Confidentiality); <strong>IV. Kewajiban ke Employer</strong> (A: Loyalty, B: Additional Compensation, C: Supervisors); <strong>V. Analisis Investasi</strong> (A: Diligence &amp; Reasonable Basis, B: Communication, C: Record Retention); <strong>VI. Conflicts of Interest</strong> (A: Disclosure, B: Priority of Transactions, C: Referral Fees); <strong>VII. Tanggung Jawab sebagai Anggota CFA</strong> (A: Conduct, B: Reference to CFA).</p>
<p><strong>Hierarki loyalitas</strong>: klien &gt; employer &gt; diri sendiri. Konflik klien vs employer → <strong>klien menang</strong> (III(A) mengalahkan IV(A)).</p>
<p><strong>Kepribadian/intuisi:</strong> 7 Standards seperti <strong>rambu lalu lintas profesi</strong>: I = SIM &amp; etika berkendara, II = jangan ugal-ugalan di jalan umum, III = utamakan penumpang, IV = hormati perusahaan taksi, V = pastikan mobil layak jalan, VI = jangan pasang tarif siluman, VII = jaga nama korps sopir.</p>
<p><strong>Kapan dipakai:</strong> Vignette CFA: identifikasi dulu 'siapa dirugikan?' → petakan ke nomor standar.</p>
<details className="worked">
<summary>📐 Contoh: 3 vignette kilat (klik untuk buka)</summary>
<p><strong>(1)</strong> Analis tahu klien akan jual besar, ia jual duluan untuk akun pribadi → <strong>VI(B)</strong> Priority of Transactions (klien didahulukan!) + II(A) jika infonya material nonpublic.</p>
<p><strong>(2)</strong> Manajer mengklaim 'return 5 tahun 15% p.a.' padahal itu backtest hipotetis → <strong>I(C)</strong> Misrepresentation + III(D) Performance Presentation.</p>
<p><strong>(3)</strong> Supervisor tahu bawahannya melanggar tapi diam → <strong>IV(C)</strong> Responsibilities of Supervisors.</p>
<p>Pola: tanya <em>'informasi siapa?'</em> (II/III(E)), <em>'siapa didahulukan?'</em> (III/VI), <em>'jujur tidak klaimnya?'</em> (I(C)/V).</p>
</details>
<p><strong>Pendalaman intuisi &mdash; cara membaca vignette seperti pemeriksa CFA.</strong> Soal ethics CFA bukan tes hafalan pasal &mdash; ia tes <strong>penalaran berlapis</strong>: (1) <em>siapa aktornya, apa relasinya?</em> (analis? manajer? supervisor?); (2) <em>informasi/uang mengalir ke mana?</em>; (3) <em>siapa yang dirugikan atau bisa dirugikan?</em>; (4) <em>apakah ada disclosure tertulis?</em> Kebanyakan vignette runtuh di langkah (4): <strong>tidak diungkapkan = hampir pasti melanggar</strong> salah satu standar. Latih refleks: setiap kali membaca &ldquo;tanpa memberitahu&rdquo; / &ldquo;tanpa mengungkapkan&rdquo;, lingkari &mdash; itu sinyal jawaban.</p>
<details className="worked">
<summary>📐 Contoh: 4 vignette kilat tambahan (klik untuk buka)</summary>
<p><strong>(1) Selective disclosure.</strong> Manajer menceritakan perubahan strategi portofolio ke <em>satu</em> klien besar dua hari sebelum surat ke semua klien dikirim &rarr; <strong>III(B) Fair Dealing</strong>. Semua klien berhak atas informasi material secara adil &mdash; &ldquo;klien besar didahulukan&rdquo; bukan pembelaan.</p>
<p><strong>(2) Suitability.</strong> Agen menjual reksadana saham agresif ke pensiunan 70 tahun yang butuh dana pensiun stabil, tanpa menggali profil risiko &rarr; <strong>III(C) Suitability</strong>. Produk <em>harus</em> cocok dengan tujuan, horizon, dan toleransi risiko klien &mdash; &ldquo;produknya bagus&rdquo; tidak cukup.</p>
<p><strong>(3) Record retention.</strong> Analis mengubah rekomendasi via telepon ke klien, tanpa catatan tertulis tentang basis dan alasan perubahan &rarr; <strong>V(C) Record Retention</strong>. &ldquo;Ingatan saya kuat&rdquo; bukan arsip.</p>
<p><strong>(4) Referral fee.</strong> Perencana keuangan menerima komisi dari notaris yang ia rekomendasikan ke klien, tanpa memberi tahu klien &rarr; <strong>VI(C) Referral Fees</strong> &mdash; wajib diungkapkan <em>nilai/estimasi</em> fee-nya, bukan sekadar &ldquo;ada fee&rdquo;.</p>
<p><strong>Pola kilat:</strong> &ldquo;duluan untuk sebagian&rdquo; &rarr; III(B); &ldquo;tidak cocok profil&rdquo; &rarr; III(C); &ldquo;tidak tercatat&rdquo; &rarr; V(C); &ldquo;fee siluman&rdquo; &rarr; VI(C).</p>
</details>
<details className="worked">
<summary>📐 Contoh: 4 vignette kilat set 2 &mdash; jebakan yang lebih halus (klik untuk buka)</summary>
<p><strong>(1) Whistleblowing vs loyalty.</strong> Junior analis menemukan manajernya memalsukan track record. Ia takut melapor karena &ldquo;tidak loyal ke tim&rdquo; &rarr; <strong>Tetap wajib bertindak</strong>: I(A) <em>Knowledge of Law</em> + VII(A) <em>Conduct</em>. Loyalitas ke employer (IV(A)) <strong>tidak mencakup</strong> menutupi pelanggaran &mdash; hierarki: integritas pasar &gt; loyalitas tim.</p>
<p><strong>(2) Soft dollars.</strong> Manajer memakai komisi broker klien untuk membayar riset pihak ketiga yang dipakai untuk <em>semua</em> klien termasuk yang tidak menghasilkan komisi &rarr; <strong>III(A)</strong> + <strong>III(B)</strong>: <em>soft dollars</em> adalah aset klien &mdash; manfaatnya harus kembali ke klien yang membayar, tidak boleh disubsidi silang tanpa disclosure.</p>
<p><strong>(3) Personal trading pre-clearance.</strong> Karyawan membeli saham yang <em>akan</em> direkomendasikan firm-nya minggu depan, tanpa <em>pre-clearance</em> &rarr; <strong>VI(B)</strong> <em>Priority of Transactions</em> &mdash; bahkan jika belum ada klien yang order, mengantisipasi rekomendasi firma untuk akun pribadi = mendahului klien.</p>
<p><strong>(4) Social media.</strong> Analis me-retweet rumor &ldquo;emiten X akan diakuisisi&rdquo; dari akun anonim, lalu klien bertanya &mdash; ia menjawab &ldquo;ada info begitu&rdquo; &rarr; <strong>V(A)</strong> (tanpa <em>reasonable basis</em>) + <strong>I(C)</strong> jika ia menyajikannya seolah terverifikasi. <em>Retweet</em> analis = komunikasi profesional.</p>
<p><strong>Pola kilat set 2:</strong> &ldquo;menutupi&rdquo; &rarr; I(A)/VII(A); &ldquo;komisi dipakai untuk&rdquo; &rarr; III(A); &ldquo;beli sebelum rekomendasi&rdquo; &rarr; VI(B); &ldquo;share rumor&rdquo; &rarr; V(A)/I(C).</p>
</details>


<PlotlyChart
  data={[{x: ["I", "II", "III", "IV", "V", "VI", "VII"], y: [4, 2, 5, 3, 3, 3, 2], type: "bar", marker: {color: "#2a7de1"}, text: ["4","2","5","3","3","3","2"], textposition: "outside"}]}
  title={"Jumlah sub-standard per Standard (I–VII)"}
  layout={{xaxis: {title: "Standard"}, yaxis: {title: "Sub-standard"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = jumlah sub-standard (mis. III(A)–III(E) = 5).</p>
<p><strong>Interpretasi:</strong> Standard III (klien) paling gemuk — 5 sub-standard: loyalitas, fair dealing, suitability, presentasi kinerja, kerahasiaan. Wajar: <strong>klien adalah pusat semesta CFA</strong>. Saat ragu di vignette, condongkan jawaban ke perlindungan klien.</p>
</div>
<h2 id="gips">GIPS — Iklan Kinerja yang Jujur</h2>
<p><strong>Definisi.</strong> <strong>GIPS</strong> (<em>Global Investment Performance Standards</em>) = standar sukarela agar klaim kinerja antar-manajer <strong>fair, comparable &amp; fully disclosed</strong>. Kunci: <strong>composites</strong> (semua portofolio diskresioner dengan mandat serupa WAJIB masuk — tidak boleh cherry-pick pemenang), histori <strong>5 tahun → 10 tahun</strong>, total return, <strong>fees diungkapkan</strong> (gross vs net).</p>
<p><strong>Compliance vs verification</strong>: <em>compliance</em> = klaim manajer (&ldquo;kami patuh GIPS&rdquo;); <em>verification</em> = pihak ketiga memverifikasi <strong>proses</strong> klaim itu — <strong>bukan audit angka</strong> per portofolio. &ldquo;Terverifikasi&rdquo; ≠ &ldquo;angkanya benar&rdquo;.</p>
<p><strong>Kepribadian/intuisi:</strong> GIPS seperti <strong>aturan timbangan di pasar</strong>: semua pedagang wajib pakai timbangan yang sama &amp; menunjukkan semua dagangannya (composite), bukan cuma yang segar. Verifikasi = petugas memeriksa timbangannya, bukan mencicipi buahnya.</p>
<p><strong>Kapan dipakai:</strong> Setiap presentasi kinerja ke prospek: cek composite, periode, fees.</p>
<details className="worked">
<summary>📐 Contoh: Presentasi yang melanggar (klik untuk buka)</summary>
<p>Manajer mengklaim 'compliant GIPS' dengan brosur: hanya 3 tahun return, hanya portofolio terbaik, 'net of fees' tanpa definisi.</p>
<p><strong>Pelanggaran:</strong> (1) histori &lt; 5 tahun; (2) cherry-pick = bukan composite; (3) fee tidak dijelaskan. Klaim 'compliant' padahal tidak = juga melanggar <strong>III(D)</strong> &amp; <strong>I(C)</strong>.</p>
<p><strong>Perbaikan:</strong> sertakan SEMUA portofolio mandat-seupa 5 tahun, tampilkan gross &amp; net dengan definisi fee, beri benchmark yang sesuai.</p>
</details>
<p><strong>Pendalaman intuisi &mdash; kenapa standar <em>sukarela</em> bisa powerful?</strong> Karena GIPS memecahkan <em>adverse selection</em>: tanpa standar, manajer jujur (lapor semua portofolio, termasuk yang jeblok) terlihat <em>lebih buruk</em> dari manajer licik (pamer yang menang saja) &mdash; pasar menghukum kejujuran. GIPS membalik insentif: klaim &ldquo;compliant&rdquo; menjadi <strong>sinyal kredibel</strong> yang bisa diverifikasi, sehingga manajer serius <em>ingin</em> patuh untuk membedakan diri. Pelajaran umum: <strong>standar sukarela bekerja ketika kepatuhan bisa diobservasi dan diverifikasi pihak ketiga</strong>.</p>
<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): 5 pelanggaran tersembunyi dalam satu brosur</summary>
<p><strong>Situasi:</strong> brosur manajer &ldquo;XYZ Capital &mdash; GIPS Compliant&rdquo; menampilkan: return 3 tahun strategi &ldquo;Growth&rdquo; 18% p.a., tanpa benchmark, tanpa penjelasan fee, dari 2 dari 9 portofolio growth (7 lainnya &ldquo;masih baru&rdquo;), plus testimoni &ldquo;manajer terbaik versi majalah&rdquo;.</p>
<p><strong>Pelanggaran:</strong> (1) histori &lt; 5 tahun; (2) <strong>cherry-pick</strong> 2 dari 9 = bukan composite (alasan &ldquo;masih baru&rdquo; tidak valid &mdash; portofolio diskresioner mandat-seupa <em>wajib</em> masuk); (3) fee tidak dijelaskan (gross vs net?); (4) <strong>tanpa benchmark</strong> yang sesuai &mdash; angka 18% tanpa pembanding = tidak informatif (III(D)); (5) testimoni &ldquo;terbaik&rdquo; tanpa konteks = <strong>I(C) misrepresentation</strong>.</p>
<p><strong>Perbaikan:</strong> composite 9 portofolio penuh, 5 tahun (bangun ke 10), tampilkan gross &amp; net + definisi fee, sertakan benchmark strategi growth, hapus klaim superlatif tanpa bukti.</p>
<p><strong>Triks ujian:</strong> soal GIPS sering menyembunyikan pelanggaran di kalimat &ldquo;7 portofolio lainnya masih baru&rdquo; &mdash; itu <em>justru</em> bendera merahnya.</p>
</details>
<PlotlyChart
  data={[{x: ["Composite lengkap (8 portofolio)", "Cherry-pick (3 terbaik)"], y: [8.0, 12.7], type: "bar", marker: {color: ["#2a7de1", "#d62728"]}, text: ["8,0%", "12,7%"], textposition: "outside"}]}
  title={"Cherry-pick menggelembungkan return: 8,0% → 12,7%"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Rata-rata return (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang biru = rata-rata return <em>seluruh</em> 8 portofolio bermandat sama (12, 8, 15, &minus;2, 10, 6, 11, 4 &rarr; 8,0%). Batang merah = rata-rata 3 portofolio <em>terbaik</em> saja (15, 12, 11 &rarr; 12,7%).</p>
<p><strong>Interpretasi:</strong> Dengan memilih yang menang saja, manajer menggelembungkan return <strong>+59%</strong> tanpa berbohong satu angka pun &mdash; semua angka &ldquo;asli&rdquo;. Inilah kenapa GIPS mewajibkan <strong>composite lengkap</strong>: kejujuran bukan soal angka individual, melainkan <em>kelengkapan sampel</em>. Saat membaca brosur kinerja, pertanyaan pertamamu harus: &ldquo;<strong>mana yang tidak ditampilkan?</strong>&rdquo;</p>
</div>


      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Satu Hari Manajer yang Patuh</h2>
      <p>Code, Standards, dan GIPS bukan tiga hafalan lepas &mdash; mereka adalah <strong>tiga lapis pertahanan</strong> dalam satu hari kerja manajer:</p>
      <ol>
        <li><strong>Pagi &mdash; Code (kompas):</strong> sebelum rapat investasi, tanyakan 6 janji. &ldquo;Apakah rekomendasi ini menempatkan klien di atas bonus saya?&rdquo; Jika ragu di level kompas, jangan lanjut ke pasal.</li>
        <li><strong>Siang &mdash; Standards (rambu):</strong> setiap tindakan dicocokkan ke 7 rambu. Menerima info? &rarr; II(A). Menulis riset? &rarr; V(A)&ndash;(C). Ada konflik? &rarr; VI(A) ungkapkan tertulis. Rambu memberi <em>prosedur</em> untuk niat baik dari Code.</li>
        <li><strong>Sore &mdash; GIPS (timbangan):</strong> saat mempresentasikan kinerja ke prospek, timbangan harus sama untuk semua: composite lengkap, 5 tahun, fee jelas. GIPS memastikan <em>hasil kerjamu</em> dilaporkan sejujur <em>proses kerjamu</em>.</li>
      </ol>
      <p><strong>Cara mengingat:</strong> <strong>K&ndash;S&ndash;G</strong> = &ldquo;<em>Kompas</em> di pagi hari, <em>Standar</em> rambu di siang hari, <em>GIPS</em> timbangan di sore hari&rdquo;. Soal vignette CFA hampir selalu menguji <em>satu</em> lapis &mdash; tugasmu mengidentifikasi lapis yang mana sebelum memilih pasal.</p>


      <h3>📰 Galeri Kasus Nyata (pola yang berulang di enforcement)</h3>
      <p>Standards CFA lahir dari kasus nyata. Tiga pola yang <em>berulang kali</em> muncul di enforcement action regulator global:</p>
      <p><strong>(1) Tipping rantai panjang (II(A)).</strong> Pola klasik: eksekutif tahu hasil kuartalan buruk &rarr; cerita ke teman &ldquo;jangan bilang siapa-siapa&rdquo; &rarr; teman cerita ke saudaranya &rarr; saudara jual saham. Setiap mata rantai merasa &ldquo;saya kan cuma cerita&rdquo;. Regulator: <strong>semua mata rantai melanggar</strong> &mdash; tipping tidak butuh profit pribadi si pemberi info. Pelajaran: <em>informasi material nonpublik itu seperti api &mdash; yang meneruskannya ikut terbakar</em>.</p>
      <p><strong>(2) Composite fiktif (GIPS + I(C)).</strong> Pola: manajer membuat &ldquo;composite&rdquo; berisi portofolio model hipotetis + 2 portofolio terbaik, mengklaim &ldquo;track record strategi 10 tahun&rdquo;. Saat diperiksa: 7 portofolio lain dengan strategi sama <em>tidak dimasukkan</em> karena &ldquo;beda sedikit&rdquo;. Regulator: <strong>cherry-pick = misrepresentation</strong>, klaim GIPS dicabut, denda. Pelajaran: definisi composite harus <em>tertulis sebelum</em> hasilnya diketahui &mdash; mendefinisikan composite <em>setelah</em> melihat return = curang.</p>
      <p><strong>(3) Produk kompleks ke pensiunan (III(C)).</strong> Pola: agen menjual <em>structured product</em> dengan <em>capital protection</em> &ldquo;95%&rdquo; ke pensiunan &mdash; tanpa menjelaskan bahwa proteksi hanya berlaku jika dipegang 7 tahun <em>dan</em> emiten tidak default. Saat pasar jatuh tahun ke-2 dan klien butuh dana berobat: proteksi tidak berlaku, rugi 30%. Regulator: <strong>suitability dilanggar</strong> meski brosur &ldquo;secara teknis benar&rdquo;. Pelajaran: <strong>kecocokan diukur dari pemahaman klien, bukan kecanggihan produk</strong>.</p>
      <p>Tiga kasus, satu benang merah: <strong>pelanggaran etika hampir selalu dimulai dari sesuatu yang &ldquo;kelihatannya wajar&rdquo;</strong> &mdash; cerita ke teman, definisi yang longgar, produk yang &ldquo;bagus&rdquo;. Standar CFA ada untuk menangkapnya di tahap &ldquo;kelihatannya wajar&rdquo; itu.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Etika = patuhi hukum. Kalau legal, pasti etis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Standar CFA <strong>lebih tinggi dari hukum</strong>. Contoh: menerima hadiah kecil dari broker mungkin legal, tapi melanggar I(B) jika mengancam objektivitas. Di vignette, 'tapi kan tidak melanggar hukum' adalah <strong>jawaban pengecoh klasik</strong> — yang diuji adalah standar, bukan KUHP.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;'Terverifikasi GIPS' berarti angka kinerjanya sudah diaudit dan dijamin benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Verification hanya menguji <strong>proses &amp; klaim compliance</strong> di level perusahaan — bukan audit angka tiap portofolio. Manajer tetap bisa salah hitung. Jangan pakai 'verified' sebagai garansi return; pakai sebagai sinyal <strong>prosesnya serius</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Atasan menyuruh, jadi saya wajib patuh &mdash; tanggung jawab ada di dia.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Tidak.</strong> Hierarki CFA: klien &gt; employer &gt; diri sendiri &mdash; perintah atasan <em>tidak pernah</em> membenarkan pelanggaran terhadap klien atau standar (IV(A) loyalitas ke employer <em>terbatas</em> oleh kewajiban ke klien di III(A)). Jika disuruh melanggar: <strong>tolak, dokumentasikan, dan laporkan</strong> via jalur compliance. &ldquo;Disuruh atasan&rdquo; adalah pembelaan yang <em>selalu</em> ditolak pemeriksa.</p>
</div>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Tahu tapi diam&rdquo;.</strong> Dua aktor, dua pelanggaran: bawahan yang melanggar (mis. I(B)) <em>dan</em> supervisor yang mengetahui tapi tidak bertindak (<strong>IV(C)</strong>). Soal CFA <em>suka</em> menambahkan kalimat &ldquo;supervisornya mengetahui hal ini&rdquo; di akhir vignette &mdash; itu bukan detail pemanis, itu <strong>satu poin soal tambahan</strong>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Uji headline.</strong> Sebelum bertindak, tanya: 'nyaman tidak jika ini jadi headline berita besok?' Itu versi praktis dari <em>reasonable person test</em>. Jika perlu dirahasiakan, biasanya memang bermasalah.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Dokumentasikan dilema.</strong> Catat: fakta, standar yang relevan, siapa dikonsultasi, keputusan &amp; alasan. Dokumentasi = tameng saat keputusanmu dipertanyakan 2 tahun kemudian (dan memenuhi V(C) Record Retention).</strong></p>
</div>

<div className="tip">
<p><strong>💡 Jembatan keledai 7 Standards:</strong> &ldquo;<strong>P</strong>rofesional <strong>I</strong>ntegritas <strong>K</strong>lien <strong>E</strong>mployer <strong>A</strong>nalisis <strong>K</strong>onflik <strong>A</strong>nggota&rdquo; &rarr; <strong>PIKEAKA</strong>. Atau versi Inggris: &ldquo;<em>Professionals In Capital markets Keep Employers, Analysts, Conflicts, Associates</em>&rdquo;. Tuliskan PIKEAKA di kertas coretan <em>sebelum</em> mengerjakan soal ethics &mdash; gratis 7 poin peta.</p>
</div>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Suitability vs &ldquo;produk bagus&rdquo;.</strong> III(C) tidak peduli produknya bagus atau return-nya tinggi &mdash; yang ditanya: <strong>cocok tidak dengan profil klien</strong> (tujuan, horizon, toleransi risiko, kebutuhan likuiditas)? Menjual reksadana saham agresif ke pensiunan konservatif = melanggar <em>meski</em> reksadananya naik 30%. Hafalkan: <strong>suitability = kecocokan, bukan kualitas</strong>.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Klasifier Standar dari Skenario</h2>
<p>Pilih skenario vignette — program memetakan ke standar yang dilanggar berdasar kata kunci.</p>
<PyodideLab
  title={"Lab 1 — Klasifier Standar"}
  hint={"Tambahkan skenario sendiri ke dict SKENARIO (mis. 'menerima fee rahasia dari broker'). Kata kunci apa yang menangkapnya?"}
  defaultCode={"# Klasifier sederhana: skenario -> standar yang (mungkin) dilanggar\nSTANDARDS = {\n    \"I(B)\": [\"hadiah\", \"hiburan\", \"objektivitas\", \"independen\", \"jam tangan\", \"mewah\", \"gratifikasi\"],\n    \"II(A)\": [\"nonpublik\", \"orang dalam\", \"belum diumumkan\", \"tipping\"],\n    \"III(A)\": [\"klien\", \"loyalitas\", \"kepentingan klien\", \"prudent\"],\n    \"III(C)\": [\"suitability\", \"cocok\", \"profil risiko\", \"tujuan klien\"],\n    \"VI(A)\": [\"konflik\", \"ungkapkan\", \"kepentingan pribadi\"],\n    \"VI(B)\": [\"duluan\", \"pribadi\", \"front-running\", \"akun sendiri\"],\n    \"I(C)\": [\"klaim\", \"melebih-lebihkan\", \"backtest\", \"menyesatkan\"],\n}\nSKENARIO = {\n    1: \"Analis menerima jam tangan mewah dari broker lalu menaikkan rating sahamnya\",\n    2: \"Manajer menjual saham untuk akun pribadi sebelum menjual untuk klien\",\n    3: \"Brosur menampilkan return backtest seolah-olah return aktual\",\n    4: \"Karyawan mendapat info merger yang belum diumumkan lalu membeli sahamnya\",\n}\ndef klasifikasi(teks):\n    t = teks.lower()\n    kena = [s for s, kws in STANDARDS.items() if any(k in t for k in kws)]\n    return kena or [\"(tidak terdeteksi - analisis manual)\"]\n\nfor i, s in SKENARIO.items():\n    print(f\"{i}. {s[:60]}...\")\n    print(f\"   -> Standar: {', '.join(klasifikasi(s))}\\n\")\nprint(\"Catatan: alat bantu belajar, bukan nasihat hukum.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Checker Kepatuhan GIPS</h2>
<p>Periksa presentasi kinerja terhadap 5 syarat GIPS dasar.</p>
<PyodideLab
  title={"Lab 2 — Checker GIPS"}
  hint={"Ubah 'tahun_histori' 3 -> 7 dan 'cherry_pick' True -> False. Lihat status berubah COMPLIANT."}
  defaultCode={"# Checker GIPS sederhana (5 syarat dasar)\npresentasi = {\n    \"tahun_histori\": 3,      # ubah sesukamu\n    \"cherry_pick\": True,     # hanya portofolio terbaik?\n    \"total_return\": True,    # pakai total return?\n    \"fee_diungkap\": False,   # gross/net dijelaskan?\n    \"benchmark_sesuai\": True,\n}\nsyarat = [\n    (\"tahun_histori >= 5\", presentasi[\"tahun_histori\"] >= 5, \"Histori min 5 thn (target 10)\"),\n    (\"composite lengkap\", not presentasi[\"cherry_pick\"], \"Semua portofolio mandat-seupa masuk\"),\n    (\"total return\", presentasi[\"total_return\"], \"Return harus total (dividen reinvested)\"),\n    (\"fee disclosure\", presentasi[\"fee_diungkap\"], \"Gross vs net harus dijelaskan\"),\n    (\"benchmark sesuai\", presentasi[\"benchmark_sesuai\"], \"Benchmark mencerminkan mandat\"),\n]\nprint(\"Hasil cek GIPS:\")\nlolos = True\nfor nama, ok, arti in syarat:\n    print(f\"  [{'OK' if ok else 'FAIL'}] {nama:<18} ({arti})\")\n    lolos = lolos and ok\nprint(f\"\\nStatus: {'COMPLIANT' if lolos else 'TIDAK COMPLIANT - perbaiki yang FAIL'}\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Menerima info material nonpublik → <strong>Jangan trading, jangan tipping; dorong disclosure publik</strong></h3>
<p><strong>Kenapa:</strong> II(A) — info milik publik, bukan milikmu.</p>
<p><strong>Contoh nyata:</strong> Tahu merger belum diumumkan: diam & tidak trading.</p>
</div>
<div className="decision-card">
<h3>2. Hadiah/hiburan dari pihak terkait → <strong>Tolak jika melebihi batas nominal; jika diterima, ungkapkan tertulis</strong></h3>
<p><strong>Kenapa:</strong> I(B) + VI(A) — objektivitas tidak boleh dibeli.</p>
<p><strong>Contoh nyata:</strong> Seminar Bali Sari: tolak jam tangan.</p>
</div>
<div className="decision-card">
<h3>3. Konflik klien vs employer → <strong>Dahulukan klien</strong></h3>
<p><strong>Kenapa:</strong> III(A) di atas IV(A) — hierarki loyalitas.</p>
<p><strong>Contoh nyata:</strong> Employer minta push produk sendiri yang tidak cocok: tolak.</p>
</div>
<div className="decision-card">
<h3>4. Kompensasi tambahan dari klien → <strong>Boleh, dengan persetujuan tertulis employer</strong></h3>
<p><strong>Kenapa:</strong> IV(B) — transparan, tidak mengganggu loyalitas.</p>
<p><strong>Contoh nyata:</strong> Fee konsultasi dari klien: lapor & minta izin.</p>
</div>
<div className="decision-card">
<h3>5. Menulis riset dengan basis lemah / tebakan → <strong>Jangan terbitkan; lengkapi diligence dulu (V(A))</strong></h3>
<p><strong>Kenapa:</strong> Rekomendasi harus punya <em>reasonable basis</em> — tebakan berlabel 'analisis' = misrepresentation.</p>
<p><strong>Contoh nyata:</strong> Data kurang: tulis 'data tidak cukup' — lebih etis dari target harga karangan.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Klien &gt; employer &gt; diri sendiri.</strong></li><li><strong>Uji headline</strong> sebelum bertindak.</li><li><strong>Ungkapkan konflik</strong> — tertulis.</li><li><strong>GIPS</strong>: composite, 5→10 thn, fee jelas.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Jam Tangan Sari</h2>
<div className="callout">
<p>Sari (fund manager) menerima jam tangan mewah + seminar Bali dari broker, lalu mengarahkan order ke broker itu. Tidak ada kerugian terukur ke klien.</p>
<p><strong>Vignette lanjutan.</strong> Sari (fund manager) menerima jam tangan mewah + seminar Bali dari broker, lalu mengarahkan order ke broker itu. Tidak ada kerugian terukur ke klien. Ternyata <strong>supervisor Sari mengetahui</strong> hadiah itu dan diam saja. Setahun kemudian Sari mengklaim di brosur: &ldquo;XYZ Fund &mdash; GIPS compliant, return 3 tahun 18%&rdquo; (hanya dari 2 portofolio terbaik).</p>
<p><strong>Pertanyaan:</strong> (a) Standar apa yang dilanggar Sari? (b) &lsquo;Tidak ada yang dirugikan&rsquo; &mdash; relevan? (c) Bagaimana dengan supervisornya? (d) Analisis klaim brosur GIPS-nya. (e) Tindakan benar sejak awal?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>I(B)</strong> Independence &amp; Objectivity (hadiah mengancam objektivitas), <strong>VI(A)</strong> Disclosure of Conflicts (tidak diungkapkan), potensial <strong>III(A)</strong> jika order bukan demi best execution klien.</p>
<p>(b) <strong>Tidak relevan.</strong> Standar menilai <em>ancaman</em> &amp; <em>proses</em>, bukan menunggu korban. 'Belum ada yang rugi' = pembelaan yang ditolak.</p>
<p>(c) <strong>Supervisor melanggar IV(C)</strong> <em>Responsibilities of Supervisors</em> &mdash; mengetahui pelanggaran bawahan dan diam = pelanggaran tersendiri. Supervisor wajib menegakkan prosedur kepatuhan, bukan sekadar tidak ikut melanggar.</p>
<p>(d) <strong>Klaim GIPS gugur total:</strong> histori 3 tahun (&lt; 5), cherry-pick 2 portofolio (bukan composite), tanpa penjelasan fee &mdash; plus klaim &ldquo;compliant&rdquo; yang salah = <strong>I(C) misrepresentation</strong> berlapis.</p>
<p>(e) <strong>Tolak/kembalikan</strong> hadiah mewah; seminar wajar boleh <em>jika</em> <strong>diungkapkan tertulis</strong> ke employer &amp; klien; order tetap by <em>best execution</em> terdokumentasi; supervisor <strong>wajib menegur &amp; mencatat</strong>. Satu vignette, <strong>lima standar</strong> &mdash; inilah cara CFA merangkai soal.</p>
</details>
</div>

<div className="callout">
<h3>📋 Checklist Kepatuhan 60 Detik (tempel di mejamu)</h3>
<ol>
<li><strong>Info:</strong> material &amp; nonpublik? &rarr; jangan trading, jangan cerita (II(A)).</li>
<li><strong>Hadiah:</strong> mewah atau tersembunyi? &rarr; tolak / ungkapkan tertulis (I(B), VI(A)).</li>
<li><strong>Urutan:</strong> klien didahulukan dari diri sendiri &amp; employer (VI(B), III(A)).</li>
<li><strong>Konflik:</strong> ada kepentingan pribadi? &rarr; ungkapkan <em>sebelum</em> bertindak (VI(A)).</li>
<li><strong>Klaim:</strong> angka kinerja ada tanggal + fee + benchmark + composite? (III(D), GIPS).</li>
<li><strong>Perintah atasan:</strong> bertentangan dengan standar? &rarr; tolak &amp; dokumentasikan.</li>
</ol>
<p>Enam baris ini menangkap <strong>&gt;80% vignette ethics CFA</strong>. Sisanya adalah variasi &amp; kombinasi.</p>
</div>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Tiga drill. Kerjakan dulu, <em>lalu</em> buka solusi. Target 3/3.</p></div>
      <h3>Drill 1 &mdash; Klasifikasi kilat</h3>
      <p>Tentukan standar yang dilanggar: (i) analis mengubah target harga <em>setelah</em> membaca laporan kompetitor, tanpa verifikasi independen; (ii) manajer memprioritaskan eksekusi order akun pribadinya di pagi hari sebelum order klien; (iii) firma mengklaim &ldquo;properti CFA charterholder&rdquo; untuk analis yang <em>baru lulus level II</em>.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>(i) <strong>V(A)</strong> <em>Diligence &amp; Reasonable Basis</em> &mdash; rekomendasi harus berbasis analisis independen, bukan menjiplak.</p>
      <p>(ii) <strong>VI(B)</strong> <em>Priority of Transactions</em> &mdash; klien didahulukan, selalu.</p>
      <p>(iii) <strong>VII(B)</strong> <em>Reference to CFA</em> &mdash; hanya charterholder yang boleh memakai gelar CFA; lulus level II ≠ CFA.</p>
      </details>
      <h3>Drill 2 &mdash; Audit brosur GIPS</h3>
      <p>Brosur: &ldquo;Compliant GIPS. Strategi Balanced: return 5 tahun 12% p.a. (gross), benchmark IHSG.&rdquo; Portofolio: 6 dari 6 portofolio balanced masuk composite. Apa yang <em>kurang</em> agar klaimnya kokoh?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>Sudah bagus (5 tahun, composite lengkap, gross). Yang kurang: (1) tampilkan juga <strong>net of fees</strong> + definisi fee; (2) pastikan <strong>benchmark sesuai mandat</strong> &mdash; strategi <em>balanced</em> (saham+obligasi) vs IHSG (saham murni) = <strong>benchmark tidak sesuai</strong>, harus blended; (3) bangun histori menuju 10 tahun.</p>
      </details>
      <h3>Drill 3 &mdash; Tulis respons konflik</h3>
      <p>Employer memintamu &ldquo;push&rdquo; produk reksadana in-house ke semua klien (fee besar untuk firma), termasuk klien konservatif. Tulis responsmu dalam 3 kalimat memakai hierarki CFA.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>Contoh respons: &ldquo;Saya tidak bisa merekomendasikan produk ini ke klien konservatif karena melanggar <strong>III(C) suitability</strong> dan <strong>III(A)</strong> loyalitas ke klien. Hierarki CFA menempatkan kepentingan klien <strong>di atas</strong> employer (IV(A) terbatas oleh III(A)). Saya akan mendokumentasikan penolakan ini dan melaporkannya ke compliance.&rdquo; &mdash; 3 kalimat, 3 standar, 1 hierarki.</p>
      </details>      <h3>Drill 4 &mdash; Analisis brosur kilat</h3>
      <p>Brosur: &ldquo;Return 1 tahun 45%! (S&amp;P 500 cuma 12%.)&rdquo; Tanpa periode tanggal, tanpa penjelasan fee, tanpa menyebut 1 tahun yang mana. Sebutkan <em>minimal 3</em> masalah.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p>(1) <strong>Periode tidak jelas</strong> &mdash; 1 tahun yang mana? <em>Cherry-picked period</em> (III(D)); (2) <strong>tanpa fee disclosure</strong> &mdash; 45% gross atau net?; (3) <strong>benchmark menyesatkan</strong> &mdash; S&amp;P 500 mungkin tidak sesuai mandat (III(D)); (4) <strong>klaim tanpa konteks risiko</strong> &mdash; I(C) <em>misrepresentation by omission</em>. Aturan praktis: <strong>setiap angka kinerja tanpa tanggal, fee, dan benchmark = bendera merah</strong>.</p>
      </details>



      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Manajer menjual untuk akun pribadi sebelum order klien dieksekusi. Standar?"}
  options={
    ["I(B) Independence",
    "VI(B) Priority of Transactions",
    "VII(A) Conduct",
    "V(A) Diligence"]
  }
  correct={1}
  explanation={"Benar: VI(B) — transaksi klien harus didahulukan dari transaksi pribadi/employer. 'Duluan' untuk diri sendiri = pelanggaran klasik."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Konflik antara kepentingan klien dan employer. Siapa menang?"}
  options={
    ["Employer — yang menggaji",
    "Klien — hierarki III(A) di atas IV(A)",
    "Diri sendiri",
    "Siapa yang lebih besar"]
  }
  correct={1}
  explanation={"Benar: hierarki loyalitas CFA: klien &gt; employer &gt; diri sendiri. Employer tidak boleh memerintahkan hal yang merugikan klien."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Brosur 'compliant GIPS' menampilkan 3 tahun return portofolio terbaik saja. Masalah?"}
  options={
    ["Tidak ada — kan return asli",
    "Cherry-pick (bukan composite) + histori &lt; 5 tahun",
    "Hanya masalah desain",
    "GIPS tidak mengatur brosur"]
  }
  correct={1}
  explanation={"Benar: GIPS mewajibkan composite lengkap (semua portofolio mandat-seupa) dan histori 5 tahun. Klaim 'compliant' padahal tidak = juga I(C) misrepresentation."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. 'Terverifikasi GIPS' berarti?"}
  options={
    ["Angka return diaudit & dijamin",
    "Pihak ketiga memverifikasi proses klaim compliance (bukan audit angka)",
    "Dijamin tidak rugi",
    "Sertifikasi pemerintah"]
  }
  correct={1}
  explanation={"Benar: verification = uji proses di level perusahaan, bukan audit angka per portofolio. Sinyal proses serius, bukan garansi return."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Karyawan tahu merger belum diumumkan, lalu memberi tahu temannya agar membeli. Ini?"}
  options={
    ["Boleh — kan bukan dia yang trading",
    "Pelanggaran II(A) — tipping info material nonpublik",
    "Boleh jika teman bukan klien",
    "Hanya pelanggaran jika profit"]
  }
  correct={1}
  explanation={"Benar: II(A) melarang trading DAN tipping atas info material nonpublik. 'Cuma cerita' = tipping. Motif & profit tidak relevan."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Analis menerbitkan rekomendasi BUY untuk emiten X tanpa mengungkapkan fee konsultasi Rp200jt yang ia terima dari emiten X bulan lalu. Ini?"}
  options={
    ["I(B) + VI(A) — objektivitas terancam & konflik tak diungkap",
    "Hanya VII(B) Reference to CFA",
    "Tidak melanggar jika analisisnya benar",
    "Hanya III(E) kerahasiaan"]}
  correct={0}
  explanation={"Benar: fee dari emiten mengancam objektivitas (I(B)) dan merupakan konflik yang wajib diungkapkan (VI(A)). 'Analisisnya benar' tidak menyembuhkan — standar menilai proses & disclosure, bukan hasil akhir."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Code</strong> = 6 janji aspirasional; <strong>Standards</strong> = 7 kelompok aturan yang ditegakkan.</li>
<li><strong>Hierarki</strong>: klien &gt; employer &gt; diri sendiri.</li>
<li><strong>Standar lebih tinggi dari hukum</strong> — 'legal' belum tentu 'patuh'.</li>
<li><strong>GIPS</strong>: composite lengkap, histori 5→10 tahun, total return, fee diungkapkan; verification ≠ audit angka.</li>
<li><strong>Refleks vignette</strong>: 'tanpa mengungkapkan' → cari pelanggaran disclosure; 'supervisor tahu' → tambah IV(C); 'legal' ≠ 'patuh'.</li>
<li><strong>Dokumentasi adalah tameng</strong>: catat fakta, standar relevan, konsultasi, keputusan &amp; alasan &mdash; memenuhi V(C) sekaligus melindungimu saat keputusan dipertanyakan bertahun kemudian.</li>
<li><strong>Kapan TIDAK pakai</strong>: Code/Standards tidak menggantikan hukum (kewajiban hukum tetap jalan); GIPS tidak wajib untuk semua (sukarela) — tapi klaim 'compliant' tanpa patuh = misrepresentation.</li>
<li><strong>Framework dilema</strong>: identifikasi → evaluasi (uji headline) → konsultasi → dokumentasi.</li>
<li><strong>Kapan TIDAK cukup 'niat baik'</strong>: tanpa disclosure tertulis &amp; dokumentasi.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk19-capstone" className="btn btn-secondary btn-sm">← MK19</Link>
        <Link href="/learn/pm-a2-quant-methods" className="btn btn-primary btn-sm">PM-A2 →</Link>
      </div>
    </div>
  );
}

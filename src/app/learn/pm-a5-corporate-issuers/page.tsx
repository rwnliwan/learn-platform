"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA5CorporateIssuersPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A5 — Portfolio Management</span>
        <h1 className="display-title">Corporate Issuers:<br/>Governance, WACC & Modal Kerja</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Pabrik yang 'Menguntungkan' Tapi Membunuh Kas</a></li>
<li><a href="#governance">Governance & ESG</a></li>
<li><a href="#budgeting">Capital Budgeting</a></li>
<li><a href="#wacc">WACC & Modal Kerja</a></li>
<li><a href="#sintesis">Sintesis: Tiga Pertanyaan Board</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Pabrik SinarAbadi</a></li>
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
<li>Menjelaskan prinsip governance yang baik dan integrasi ESG.</li>
<li>Menerapkan NPV, IRR, payback, dan PI untuk keputusan proyek.</li>
<li>Menghitung WACC dan menjelaskan trade-off utang vs ekuitas.</li>
<li>Menghitung cash conversion cycle dan implikasinya ke kas.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Pabrik yang 'Menguntungkan' Tapi Membunuh Kas</h2>
      <div className="story">
        <p><strong>PT SinarAbadi</strong> membangun pabrik baru: proyeksi akuntansi <strong>untung Rp50M/tahun</strong>. Direksi setuju. Dua tahun kemudian: <strong>krisis likuiditas</strong> — pabrik 'untung' tapi perusahaan kehabisan kas.</p>
<p>Twist-nya berlapis: <strong>(1)</strong> 'untung' itu setelah depresiasi (non-kas) tapi <em>sebelum</em> memperhitungkan <strong>modal kerja</strong> yang membengkak (stok + piutang pabrik baru); <strong>(2)</strong> didanai utang jangka pendek berbunga tinggi — <strong>mismatch tenor</strong>; <strong>(3)</strong> tidak pernah dihitung <strong>NPV</strong>-nya (mungkin negatif sejak awal!). <strong>Keputusan modal tanpa TVM (PM-A2) = judi berdasi.</strong> Lesson ini: disiplin capital budgeting.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="governance">Governance — Siapa Mengawasi Siapa</h2>
<p><strong>Definisi.</strong> <strong>Corporate governance</strong>: sistem pengarahan &amp; pengendalian perusahaan — dewan komisaris/direksi, hak pemegang saham, transparansi, remunerasi. <strong>Prinsip</strong>: board independen, komite audit, one-share-one-vote, related-party transaction diungkapkan. <strong>ESG</strong>: Environmental, Social, Governance — faktor non-finansial yang memengaruhi risiko &amp; return jangka panjang.</p>
<p>Red flag governance: komisaris rangkap berlebihan, transaksi afiliasi jumbo, auditor gonta-ganti, dual-class shares yang mengebiri minoritas.</p>
<p><strong>Kepribadian/intuisi:</strong> Governance seperti <strong>wasit + aturan main</strong>: tanpa wasit independen, pemain (manajemen) bisa mengutak-atik skor (laba) dan mencuri bola (tunneling ke afiliasi). Investor minoritas = penonton yang bayar tiket — butuh wasit.</p>
<p><strong>Kapan dipakai:</strong> Due diligence: cek governance SEBELUM valuasi. Governance buruk = diskon valuasi atau tolak.</p>

<p><strong>Pendalaman intuisi &mdash; governance = sistem rem, bukan mesin.</strong> Investor amatir bertanya &ldquo;seberapa cepat mobil ini?&rdquo; (growth, margin). Investor profesional bertanya dulu &ldquo;<strong>bagaimana remnya?</strong>&rdquo; (board independen? audit komite? proteksi minoritas?). Mobil tercepat tanpa rem = alat bunuh diri &mdash; seperti emiten bertumbuh 40% yang kasnya &ldquo;dipinjam&rdquo; pemilik. <strong>Aturan:</strong> diskon valuasi 20&ndash;30% untuk governance buruk <em>atau</em> jangan sentuh sama sekali. Tidak ada <em>growth story</em> yang mengkompensasi <em>tunneling</em>.</p>
<details className="worked">
<summary>📐 Contoh: Skor governance 5 menit (klik untuk buka)</summary>
<p>Cek cepat emiten X: (1) Komisaris independen ≥ 30%? Ya. (2) Transaksi afiliasi &gt; 10% revenue? <strong>Ya — Rp800M ke perusahaan milik direksi.</strong> (3) Auditor 3 tahun sama? Tidak — ganti 2x. (4) Dividen konsisten? Tidak.</p>
<p><strong>2 red flag</strong> (afiliasi + auditor) → <strong>diskon valuasi 20–30%</strong> atau lewati. Governance buruk = laba bisa 'bocor' kapan saja.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Dual-class shares &mdash; 10% modal, 51% suara</summary>
<p><strong>Soal:</strong> founder memegang saham kelas B (10 suara/lembar) = 10% modal ekonomi tapi 51% hak suara. Apa risikonya untuk minoritas?</p>
<p><strong>Analisis:</strong> <em>wedge</em> = 51% &minus; 10% = <strong>41pp</strong>. Founder mengendalikan perusahaan dengan <em>sepersepuluh</em> modal &mdash; ia menikmati 100% kontrol tapi hanya menanggung 10% konsekuensi ekonomi dari keputusan buruk. <strong>Insentif terdistorsi:</strong> proyek berisiko yang menguntungkan pribadi (mis. akuisisi perusahaan milik keluarga dengan harga kemahalan) menjadi rasional baginya.</p>
<p><strong>Aksi investor:</strong> terapkan <strong>governance discount</strong> 15&ndash;25% pada valuasi, atau hindari. Cek juga: apakah ada <em>sunset provision</em> (dual-class berakhir setelah X tahun)? Tanpa itu, wedge = permanen.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Tunneling via transfer pricing</summary>
<p><strong>Soal:</strong> emiten tambang menjual nikel ke perusahaan afiliasi pemilik (di luar negeri) seharga $12.000/ton, padahal harga pasar $18.000/ton. Volume 100.000 ton/tahun. Berapa nilai yang &ldquo;bocor&rdquo;?</p>
<p><strong>Langkah 1:</strong> selisih = 18.000 &minus; 12.000 = $6.000/ton. <strong>Langkah 2:</strong> 6.000 &times; 100.000 = <strong>$600 juta/tahun</strong> &mdash; ditransfer dari emiten (milik publik) ke kantong afiliasi.</p>
<p><strong>Deteksi:</strong> bandingkan <em>realized price</em> emiten vs benchmark LME; selisih persisten &gt; 10% = bendera merah. Cek footnote pihak berelasi: porsi penjualan afiliasi &gt; 30% = waspada. <strong>Inilah kenapa analis komoditas selalu merekonsiliasi harga jual vs harga pasar</strong> &mdash; selisihnya adalah tempat tunneling bersembunyi.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Sunk cost fallacy.</strong> &ldquo;Kita sudah belanja Rp80M studi, sayang kalau proyek dibatalkan&rdquo; &mdash; <strong>salah total</strong>. Rp80M tidak kembali apa pun keputusannya; satu-satunya pertanyaan: <em>apakah arus kas masa depan (inkremental) positif NPV-nya?</em> Soal CFA menandai jebakan ini dengan frasa &ldquo;<em>already spent</em>&rdquo; / &ldquo;<em>non-refundable</em>&rdquo; &mdash; itu sinyal untuk <strong>mencoret</strong> angka itu dari perhitungan.</p>
</div>
<h2 id="budgeting">Capital Budgeting — Proyek Layak atau Tidak</h2>
<p><strong>Definisi.</strong> <strong>NPV</strong> = PV arus kas − investasi awal; terima jika &gt; 0. <strong>IRR</strong> = discount rate saat NPV = 0; terima jika &gt; <strong>hurdle rate (WACC)</strong>. <strong>Payback</strong> = waktu balik modal (abaikan TVM — kelemahan!). <strong>PI</strong> = PV/investasi; terima jika &gt; 1.</p>
<p><strong>Aturan konflik</strong>: NPV vs IRR bisa beda untuk proyek mutually exclusive (beda skala/timing) → <strong>NPV menang</strong> (mengukur nilai absolut, bukan %). SinarAbadi: tidak hitung NPV = dosa asal.</p>
<Tex math={String.raw`NPV = \sum_{t=1}^{N}\frac{CF_t}{(1+r)^t} - I_0 \quad;\quad IRR: NPV = 0`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`CF_t`} />: arus kas <strong>inkremental</strong> (hanya yang berubah karena proyek!)</li>
<li><Tex math={String.raw`r`} />: hurdle rate = WACC (biaya modal perusahaan)</li>
<li><Tex math={String.raw`I_0`} />: investasi awal</li>
<li>Pakai arus kas, BUKAN laba akuntansi (depresiasi kembali ditambahkan; modal kerja diperhitungkan)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> NPV seperti <strong>timbangan nilai</strong>: taruh semua kas masa depan (didiskon) di kiri, investasi di kanan. Kiri lebih berat = proyek menambah nilai. IRR = 'bunga implisit' proyek — bandingkan dengan 'bunga pinjamanmu' (WACC).</p>
<p><strong>Kapan dipakai:</strong> Setiap capex: pabrik, akuisisi, ekspansi. Tanpa NPV = spekulasi.</p>

<p><strong>Pendalaman intuisi &mdash; NPV adalah wasit, laba akuntansi wasit gadungan.</strong> &ldquo;Pabrik untung Rp50M/tahun&rdquo; terdengar meyakinkan &mdash; sampai kamu tanya: <em>kapan</em> kasnya masuk? (TVM), <em>berapa</em> modal kerja yang terjebak? (likuiditas), <em>dari mana</em> dananya? (biaya modal). Laba akuntansi menjawab <strong>tidak satu pun</strong> dengan benar: ia mengabaikan waktu (tanpa diskonto), mengabaikan modal kerja (akrual), dan mengabaikan biaya ekuitas (bukan beban akuntansi). <strong>Keputusan capex yang memakai laba akuntansi = mengemudi dengan spion yang retak.</strong></p>
<details className="worked">
<summary>📐 Contoh: Pabrik SinarAbadi (klik untuk buka)</summary>
<p>Investasi Rp500M. Arus kas (inkremental, setelah modal kerja!): thn 1–5 = Rp120M/thn. WACC 12%.</p>
<p><strong>NPV</strong> = 120 × [1−1,12^−5]/0,12 − 500 = 120 × 3,6048 − 500 = 432,6 − 500 = <strong>−Rp67,4M</strong>.</p>
<p><strong>TOLAK!</strong> 'Untung akuntansi Rp50M/thn' menipu — setelah TVM + modal kerja, proyek <strong>menghancurkan Rp67M nilai</strong>. Inilah yang tidak dihitung direksi.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): EAA &mdash; mesin umur beda</summary>
<p><strong>Soal:</strong> Mesin A: umur 3 thn, NPV Rp100M. Mesin B: umur 5 thn, NPV Rp140M. r = 10%. Pilih mana? (NPV langsung <em>tidak comparable</em> &mdash; umur beda!)</p>
<p><strong>Langkah 1 &mdash; EAA (Equivalent Annual Annuity):</strong> EAA = NPV / PVIFA(r, umur).</p>
<p><strong>Langkah 2:</strong> EAA_A = 100 / 2,4869 = <strong>Rp40,2M/thn</strong>. EAA_B = 140 / 3,7908 = <strong>Rp36,9M/thn</strong>.</p>
<p><strong>Keputusan: pilih A</strong> &mdash; meski NPV-nya lebih kecil, ia menghasilkan Rp40,2M <em>per tahun</em> vs Rp36,9M. <strong>Moral:</strong> membandingkan NPV proyek beda umur tanpa EAA = membandingkan apel 3 tahun dengan jeruk 5 tahun. (Asumsi: proyek dapat diulang &mdash; jika tidak, pakai NPV biasa.)</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Sunk cost vs opportunity cost</summary>
<p><strong>Soal:</strong> perusahaan sudah belanja Rp80M untuk studi kelayakan pabrik (sunk). Kini NPV proyek (tanpa sunk) = +Rp30M. Lahan yang akan dipakai bisa disewakan Rp15M/tahun (opportunity). Keputusan?</p>
<p><strong>Langkah 1:</strong> Rp80M <strong>abaikan</strong> &mdash; <em>sunk cost</em> tidak kembali apa pun keputusannya. Menolak proyek &ldquo;agar Rp80M tidak sia-sia&rdquo; = <em>sunk cost fallacy</em>.</p>
<p><strong>Langkah 2:</strong> opportunity cost lahan Rp15M/tahun <strong>wajib masuk</strong> sebagai arus kas keluar tahunan &mdash; memakai lahan &ldquo;gratis&rdquo; bukan gratis.</p>
<p><strong>Langkah 3:</strong> NPV +30M (setelah opportunity cost) &rarr; <strong>terima</strong>. <strong>Aturan:</strong> <em>sunk</em> = lupakan; <em>opportunity</em> = hitung. Kebalikannya adalah dua kesalahan paling mahal di capital budgeting.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Real option &mdash; nilai dari fleksibilitas</summary>
<p><strong>Soal:</strong> proyek NPV = &minus;Rp10M (negatif tipis!). Tapi ada opsi <em>abandon</em>: jika tahun 1 buruk, aset bisa dijual Rp200M (investasi awal Rp500M, skenario buruk PV = Rp150M). Berapa nilai proyek <em>dengan</em> opsi?</p>
<p><strong>Langkah 1 &mdash; tanpa opsi:</strong> &minus;10M &rarr; tolak. <strong>Langkah 2 &mdash; dengan opsi abandon:</strong> skenario buruk: max(150M lanjut, 200M jual) = 200M. Kenaikan nilai = prob_buruk &times; (200&minus;150)M.</p>
<p><strong>Langkah 3:</strong> jika prob buruk 40%: nilai opsi = 0,4 &times; 50M = Rp20M &rarr; NPV_total = &minus;10 + 20 = <strong>+Rp10M &rarr; terima!</strong></p>
<p><strong>Pelajaran:</strong> NPV statis <em>meremehkan</em> proyek fleksibel (tambang, R&amp;D, startup). <strong>Ketidakpastian + fleksibilitas = nilai.</strong> Manajer yang hanya memakai NPV kaku akan menolak terlalu banyak proyek bagus &mdash; dan tidak pernah tahu.</p>
</details>
<PlotlyChart
  data={[{x: [0,5,10,15,20,25,30], y: [-67,-32,0,28,54,76,96], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "NPV (Rp M)"}]}
  title={"NPV profile pabrik SinarAbadi"}
  layout={{xaxis: {title: "Discount rate (%)"}, yaxis: {title: "NPV (Rp M)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = discount rate, Y = NPV. Titik potong nol = IRR.</p>
<p><strong>Interpretasi:</strong> NPV positif hanya jika r &lt; ~8% (IRR ≈ 8%). WACC perusahaan 12% → NPV negatif → <strong>tolak</strong>. NPV profile menunjukkan <em>margin of safety</em>: makin jauh WACC dari IRR, makin yakin keputusannya.</p>
</div>

<PlotlyChart
  data={[{x: [0,20,40,60,80], y: [12,10.8,10.2,10.8,13], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "WACC"}]}
  title={"WACC berbentuk U: ada struktur modal optimal"}
  layout={{xaxis: {title: "Rasio utang (%)"}, yaxis: {title: "WACC (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = proporsi utang, sumbu Y = WACC. Kurva turun lalu naik (ilustrasi).</p>
<p><strong>Interpretasi:</strong> Dari 0% ke 40% utang, WACC <strong>turun</strong> (12%&rarr;10,2%) &mdash; utang murah + <em>tax shield</em>. Di atas 40%, WACC <strong>naik</strong> (10,2%&rarr;13%) &mdash; risiko kebangkrutan &amp; <em>financial distress</em> menaikkan biaya ekuitas &amp; utang lebih cepat dari manfaat tax shield. <strong>Titik minimum &asymp; struktur modal optimal.</strong> Pelajaran: utang itu seperti garam &mdash; sedikit menyedapkan, kebanyakan meracuni.</p>
</div>
<h2 id="wacc">WACC & Modal Kerja — Harga Uang & Putarannya</h2>
<p><strong>Definisi.</strong> <strong>WACC</strong> = w_d×r_d(1−T) + w_e×r_e — rata-rata biaya modal. <strong>Trade-off utang</strong>: bunga <em>tax-deductible</em> (murah) vs risiko financial distress (mahal). <strong>Pecking order</strong>: internal → utang → ekuitas (terakhir karena paling mahal &amp; sinyal negatif).</p>
<p><strong>CCC</strong> (<em>cash conversion cycle</em>) = DIO + DSO − DPO: berapa hari kas 'terikat' di operasional. CCC panjang = butuh modal kerja besar = 'pabrik untung tapi kas kering'.</p>
<Tex math={String.raw`WACC = w_d r_d(1-T) + w_e r_e \quad;\quad CCC = DIO + DSO - DPO`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`w_d, w_e`} />: bobot utang &amp; ekuitas (nilai pasar!)</li>
<li><Tex math={String.raw`r_d(1-T)`} />: biaya utang setelah pajak (tax shield)</li>
<li><Tex math={String.raw`r_e`} />: biaya ekuitas (via CAPM, PM-A10)</li>
<li>DIO: hari persediaan; DSO: hari piutang; DPO: hari utang usaha (makin besar makin bagus)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> WACC seperti <strong>harga pokok 'pinjaman' perusahaan</strong> — proyek harus menghasilkan di atas ini atau menghancurkan nilai. CCC seperti <strong>panjang selang air</strong>: makin panjang, makin banyak air (kas) yang 'nyangkut' di selang sebelum sampai ke ember.</p>
<p><strong>Kapan dipakai:</strong> WACC = hurdle rate semua keputusan; CCC = diagnosis likuiditas.</p>

<p><strong>Pendalaman intuisi &mdash; WACC = &ldquo;harga sewa&rdquo; rata-rata modal.</strong> Setiap rupiah modal ada pemiliknya yang menuntut kompensasi: kreditur menuntut bunga (setelah pajak), pemegang saham menuntut return (CAPM). WACC = rata-rata tertimbang keduanya &mdash; <strong>hurdle rate</strong>: proyek harus menghasilkan <em>di atas</em> ini untuk menciptakan nilai. Jika ROIC &lt; WACC, perusahaan <strong>menghancurkan nilai</strong> meski labanya positif &mdash; seperti restoran ramai yang setiap piringnya rugi Rp5.000.</p>
<details className="worked">
<summary>📐 Contoh: WACC & CCC SinarAbadi (klik untuk buka)</summary>
<p>Utang Rp400M @10%, ekuitas Rp600M @16% (CAPM), pajak 22%. <strong>WACC</strong> = 0,4×10%×0,78 + 0,6×16% = 3,12% + 9,6% = <strong>12,72%</strong>.</p>
<p><strong>CCC</strong>: DIO 90 + DSO 75 − DPO 40 = <strong>125 hari</strong> — kas terikat 4 bulan! Tiap Rp1M penjualan harian butuh Rp125M modal kerja.</p>
<p>Dua pembunuh: WACC 12,7% (hurdle tinggi) + CCC 125 hari (kas tersedot). Pabrik 'untung' akuntansi = ilusi.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): WACC lengkap &mdash; dari data pasar</summary>
<p><strong>Soal:</strong> nilai pasar ekuitas Rp600M, utang Rp400M. Re (CAPM) = 14%, Rd = 8%, pajak 25%. Hitung WACC.</p>
<p><strong>Langkah 1 &mdash; bobot <em>pasar</em>:</strong> w_e = 600/1000 = 60%, w_d = 40%. (Jebakan: pakai <em>book value</em> &mdash; salah! WACC memakai <strong>nilai pasar</strong>, karena itu &ldquo;harga&rdquo; modal hari ini.)</p>
<p><strong>Langkah 2:</strong> WACC = 0,6 &times; 14% + 0,4 &times; 8% &times; (1&minus;0,25) = 8,4% + 2,4% = <strong>10,8%</strong>.</p>
<p><strong>Langkah 3 &mdash; pakai:</strong> proyek berisiko <em>rata-rata</em> perusahaan &rarr; hurdle 10,8%. Proyek <em>lebih berisiko</em> &rarr; hurdle = 10,8% + premi risiko (risk-adjusted!). <strong>WACC bukan satu angka untuk semua proyek</strong> &mdash; ia titik awal, bukan titik akhir.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Target weights vs flotation cost</summary>
<p><strong>Soal:</strong> struktur modal saat ini 70% ekuitas, tapi <em>target</em> jangka panjang 60/40. Emisi saham baru berbiaya 5% (<em>flotation</em>). WACC mana yang dipakai untuk proyek 10 tahun?</p>
<p><strong>Jawaban dua lapis:</strong> (1) Pakai <strong>target weights</strong> (60/40) &mdash; proyek 10 tahun didanai struktur <em>jangka panjang</em>, bukan snapshot hari ini. (2) <strong>Flotation cost:</strong> jangan <em>menaikkan</em> WACC (praktik usang!) &mdash; yang benar: <strong>perlakukan sebagai arus kas keluar awal</strong> (tambah ke I₀). Menaikkan WACC mendistorsi <em>seluruh</em> umur proyek; flotation hanya terjadi sekali di awal.</p>
<p><strong>Triks ujian:</strong> soal yang memberi &ldquo;book weights&rdquo; dan &ldquo;target weights&rdquo; sekaligus sedang mengujimu &mdash; pilih <strong>target</strong> (atau pasar, jika target tak diberi).</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Book vs market weights.</strong> Soal memberi neraca (book: ekuitas Rp300M, utang Rp700M) <em>dan</em> harga pasar (saham Rp600M, obligasi Rp400M). WACC memakai <strong>pasar</strong> (600/400), bukan book (300/700)! Book = biaya historis; pasar = harga modal <em>hari ini</em>. Pengecualian: jika soal <em>hanya</em> memberi book &rarr; pakai book (dengan catatan).</p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Pertanyaan Board</h2>
      <p>Governance, budgeting, dan WACC = <strong>tiga pertanyaan yang wajib dijawab board</strong> sebelum menyetujui belanja besar:</p>
      <ol>
        <li><strong>SIAPA yang memutuskan? (governance)</strong> &mdash; apakah pengusul independen dari penilai? Apakah minoritas terlindungi? Keputusan bagus dari proses buruk = kebetulan.</li>
        <li><strong>APAKAH ini menciptakan nilai? (budgeting)</strong> &mdash; NPV inkremental &amp; after-tax &gt; 0? Sudah termasuk modal kerja, sunk cost dicoret, opportunity cost masuk?</li>
        <li><strong>DENGAN hurdle apa? (WACC)</strong> &mdash; apakah diskonto memakai bobot pasar, target weights, dan <em>risk adjustment</em> yang sesuai risiko proyek?</li>
      </ol>
      <p><strong>Kegagalan SinarAbadi = gagal di ketiganya:</strong> proses tanpa kertas kerja (1), pakai laba akuntansi (2), abaikan biaya modal &amp; mismatch tenor (3). <strong>Tiga centang, atau tidak ada tanda tangan.</strong></p>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Proyek dengan IRR tertinggi selalu yang terbaik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> IRR <strong>mengabaikan skala</strong>: proyek Rp10M IRR 50% (+Rp5M) vs Rp1M IRR 30% (+Rp300jt) — IRR pilih yang pertama, <strong>NPV pilih yang kedua</strong> (nilai absolut lebih besar). Untuk mutually exclusive: NPV menang. IRR juga bisa ganda jika arus kas berubah tanda.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Utang selalu buruk — perusahaan terbaik = tanpa utang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Bunga <strong>tax-deductible</strong> → utang moderat <em>menurunkan</em> WACC &amp; menaikkan nilai (trade-off theory). Yang berbahaya = utang <strong>berlebihan</strong> atau <strong>mismatch tenor</strong> (utang pendek untuk aset panjang — dosa SinarAbadi). Optimal ≠ nol.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Utang selalu buruk &mdash; perusahaan terbaik tanpa utang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> utang <strong>moderat</strong> <em>menurunkan</em> WACC (tax shield + biaya lebih murah dari ekuitas) &mdash; kurva U di atas membuktikannya. Yang buruk adalah utang <em>berlebihan</em> atau <em>mismatch tenor</em> (utang pendek untuk aset panjang &mdash; seperti SinarAbadi). <strong>Nilai perusahaan dimaksimalkan pada struktur modal optimal, bukan pada utang nol.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Proyek dengan IRR tertinggi = proyek terbaik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> untuk <em>mutually exclusive</em> beda skala/umur, IRR menyesatkan (lihat PM-A2). Plus: IRR proyek harus dibandingkan dengan <strong>WACC yang <em>risk-adjusted</em></strong>, bukan WACC perusahaan mentah &mdash; proyek tambang berisiko ≠ proyek ekspansi pabrik existing.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Arus kas inkremental saja.</strong> Sunk cost (riset yang sudah dibayar) = abaikan; opportunity cost (gudang yang bisa disewakan) = masukkan. 80% error NPV = salah mendefinisikan 'CF yang berubah karena proyek'.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Bobot WACC pakai nilai pasar, bukan buku.</strong> Ekuitas buku Rp600M tapi pasar Rp2M → bobot salah total. Analis malas pakai buku; analis benar hitung market cap + market value of debt.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist capex 60 detik:</strong> (1) Arus kas <em>inkremental</em> &amp; <em>after-tax</em>? (2) Sunk cost dicoret? Opportunity cost masuk? (3) Modal kerja dihitung? (4) Diskonto = WACC <em>risk-adjusted</em>? (5) Umur beda &rarr; EAA? (6) Sensitivitas &plusmn;20% masih positif? <strong>Enam centang sebelum board boleh tanda tangan.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Evaluator Proyek (NPV/IRR/Payback)</h2>
<p>Masukkan arus kas proyek — dapatkan NPV, IRR (biseksi), payback, dan keputusan.</p>
<PyodideLab
  title={"Lab 1 — Evaluator Proyek"}
  hint={"Ubah CF tahun 1-5 dari 120 -> 150. NPV jadi positif — lihat betapa sensitifnya keputusan ke asumsi kas!"}
  defaultCode={"# Evaluator capital budgeting\nI0 = 500  # investasi awal (Rp M)\nCF = [120, 120, 120, 120, 120]  # arus kas thn 1-5 (ubah sesukamu)\nWACC = 0.12\n\nnpv = sum(cf/(1+WACC)**(t+1) for t, cf in enumerate(CF)) - I0\n# IRR via biseksi\nlo, hi = -0.5, 1.0\nfor _ in range(60):\n    mid = (lo+hi)/2\n    v = sum(cf/(1+mid)**(t+1) for t, cf in enumerate(CF)) - I0\n    lo, hi = (mid, hi) if v > 0 else (lo, mid)\nirr = (lo+hi)/2\n# payback\nkum, pb = 0, None\nfor t, cf in enumerate(CF, 1):\n    kum += cf\n    if pb is None and kum >= I0: pb = t - 1 + (I0-(kum-cf))/cf\n\nprint(f\"NPV  @ {WACC:.0%}: Rp{npv:+.1f} M\")\nprint(f\"IRR          : {irr:.1%}\")\nprint(f\"Payback      : {pb:.1f} tahun\")\nprint(f\"\\nKeputusan: {'TERIMA' if npv > 0 else 'TOLAK'} (NPV {'positif' if npv>0 else 'negatif'})\")\nif irr > WACC and npv < 0: print(\"Konflik IRR vs NPV? Percaya NPV (skala & timing).\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator WACC & CCC</h2>
<p>Hitung biaya modal rata-rata dan cash conversion cycle.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator WACC & CCC"}
  hint={"Ubah DPO 40 -> 70 (bayar supplier lebih lambat). CCC turun 30 hari — kas bebas Rp besar!"}
  defaultCode={"# WACC & Cash Conversion Cycle\n# --- WACC ---\nWD, RD, WE, RE, TAX = 0.4, 0.10, 0.6, 0.16, 0.22  # bobot & biaya\nwacc = WD*RD*(1-TAX) + WE*RE\nprint(f\"WACC = {WD:.0%}x{RD:.0%}x{1-TAX:.0%} + {WE:.0%}x{RE:.0%} = {wacc:.2%}\")\nprint(f\"  Tax shield menghemat: {WD*RD*TAX:.2%} poin\")\n# --- CCC ---\nDIO, DSO, DPO = 90, 75, 40   # ubah DPO sesukamu\nccc = DIO + DSO - DPO\nprint(f\"\\nCCC = {DIO} + {DSO} - {DPO} = {ccc} hari\")\npenjualan_harian = 10  # Rp M/hari\nprint(f\"Kas terikat di modal kerja: ~Rp{ccc*penjualan_harian:,.0f} M\")\nprint(\"\\nAturan: CCC turun 30 hari = kas bebas Rp300 M (pada contoh ini).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. NPV &gt; 0 (independen) → <strong>Terima</strong></h3>
<p><strong>Kenapa:</strong> Menambah nilai perusahaan.</p>
<p><strong>Contoh nyata:</strong> Ekspansi yang lolos hurdle.</p>
</div>
<div className="decision-card">
<h3>2. Proyek mutually exclusive, NPV vs IRR konflik → <strong>Ikuti NPV</strong></h3>
<p><strong>Kenapa:</strong> NPV mengukur nilai absolut; IRR buta skala.</p>
<p><strong>Contoh nyata:</strong> Pilih Rp300M @30% atas Rp5M @50%.</p>
</div>
<div className="decision-card">
<h3>3. CCC &gt; 100 hari → <strong>Perketat: tekan DIO/DSO, negosiasi DPO</strong></h3>
<p><strong>Kenapa:</strong> Kas terikat = butuh pendanaan mahal.</p>
<p><strong>Contoh nyata:</strong> Program SCF dengan supplier.</p>
</div>
<div className="decision-card">
<h3>4. Governance red flag (afiliasi, auditor) → <strong>Diskon valuasi / tolak</strong></h3>
<p><strong>Kenapa:</strong> Laba bisa bocor via tunneling.</p>
<p><strong>Contoh nyata:</strong> Skor governance 5 menit.</p>
</div>
<div className="decision-card">
<h3>5. Proyek beda umur → <strong>EAA, bukan NPV langsung</strong></h3>
<p><strong>Kenapa:</strong> NPV tidak comparable antar-umur.</p>
<p><strong>Contoh nyata:</strong> Mesin A (NPV 100, 3 thn) vs B (140, 5 thn) → EAA: 40,2 vs 36,9 → pilih A.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>NPV &gt; 0</strong> = terima; konflik → NPV menang.</li><li><strong>Arus kas inkremental</strong>, bukan laba.</li><li><strong>WACC</strong> = hurdle; bobot pasar.</li><li><strong>CCC pendek</strong> = kas sehat.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Pabrik 'Untung' yang Membunuh Kas</h2>
<div className="callout">
<p>SinarAbadi: pabrik baru 'untung Rp50M/thn' (akuntansi), didanai utang jangka pendek, modal kerja membengkak. Hasil: krisis likuiditas.</p>
<p><strong>Vignette lanjutan.</strong> SinarAbadi: pabrik baru &lsquo;untung Rp50M/thn&rsquo; (akuntansi), didanai utang jangka pendek, modal kerja membengkak (CCC 125 hari). Hasil: krisis likuiditas. Data benar: CF inkremental Rp120M/thn 5 thn, I₀ Rp500M, WACC 12%. Alternatif: sewa pabrik (operating) Rp90M/thn, tanpa I₀.</p>
<p><strong>Pertanyaan:</strong> (a) Tiga kesalahan keputusan modal? (b) Hitung NPV &amp; putuskan. (c) Bagaimana jika WACC turun ke 8%? (d) Bandingkan dengan opsi sewa (PV sewa vs NPV beli). (e) Pelajaran governance?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tidak hitung NPV</strong> (pakai laba akuntansi); <strong>abaikan modal kerja</strong> (CCC 125 hari); <strong>mismatch tenor</strong> (utang pendek untuk aset panjang).</p>
<p>(b) <strong>NPV = &minus;Rp67,4M &rarr; TOLAK.</strong> PV = 120 &times; 3,6048 = Rp432,6M &minus; 500M. &lsquo;Untung Rp50M&rsquo; = ilusi depresiasi + abaikan TVM + abaikan modal kerja.</p>
<p>(c) <strong>WACC 8%:</strong> PV = 120 &times; 3,9927 = Rp479,1M &rarr; NPV = <strong>&minus;Rp20,9M &rarr; tetap TOLAK.</strong> Proyek ini tidak selamat bahkan dengan modal murah &mdash; masalahnya <em>fundamental</em> (CF terlalu kecil untuk I₀), bukan diskonto.</p>
<p>(d) <strong>Opsi sewa:</strong> PV sewa = 90 &times; 3,6048 = <strong>Rp324,4M</strong> vs PV beli Rp432,6M &mdash; sewa <em>lebih murah</em> Rp108M <em>dan</em> tanpa risiko modal kerja + fleksibel (bisa keluar). <strong>Tapi</strong>: sewa = tidak ada nilai sisa &amp; tidak ada <em>real option</em> ekspansi. Keputusan lengkap butuh valuasi opsi &mdash; pelajaran: <strong>selalu ada alternatif ketiga</strong> (beli vs sewa vs tunda).</p>
<p>(e) <strong>Board harus menuntut</strong> NPV + analisis sensitivitas + rencana pendanaan sesuai tenor <em>sebelum</em> setuju capex. Capex tanpa kertas kerja = maladministrasi. Tambahan: <strong>pisahkan pengusul &amp; penilai</strong> (yang mengusulkan pabrik tidak boleh yang menghitung NPV-nya) &mdash; konflik kepentingan internal sama berbahayanya dengan eksternal.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Teori di Balik Praktik</h2>
      <h3>1. Agency theory &mdash; kenapa manajer boros?</h3>
      <p><strong>Masalah:</strong> manajer (agen) ≠ pemegang saham (prinsipal). Manajer tergoda <em>empire building</em> (perusahaan besar = gaji &amp; prestise besar) &mdash; menerima proyek NPV negatif demi ukuran. <strong>Solusi:</strong> (1) kompensasi berbasis saham/kinerja jangka panjang; (2) dewan independen yang berani menolak; (3) utang sebagai <em>disiplin</em> (bunga wajib dibayar &rarr; kas bebas berkurang &rarr; ruang boros menyempit &mdash; argumen Jensen).</p>
      <h3>2. Pecking order &mdash; urutan pendanaan</h3>
      <p>Myers-Majluf: karena <em>asymmetric information</em>, perusahaan memilih: <strong>(1) laba ditahan</strong> &rarr; (2) <strong>utang</strong> &rarr; (3) <strong>saham baru</strong> (terakhir!). Emisi saham = sinyal &ldquo;saham kami kemahalan&rdquo; &rarr; harga <em>turun</em> saat pengumuman (<em>announcement effect</em> &minus;3% rata-rata). <strong>Implikasi:</strong> jangan heran emiten mengantre utang dulu; dan waspadai <em>rights issue</em> besar &mdash; tanyakan <em>kenapa</em> tidak pakai utang.</p>
      <h3>3. Dividen: sinyal atau irrelevan?</h3>
      <p><strong>MM (teori):</strong> dividen irrelevan &mdash; Rp1 dividen = Rp1 harga turun. <strong>Praktik:</strong> dividen = <strong>sinyal</strong> (naikkan dividen = manajemen yakin kas masa depan kuat; pasar menghargai +2&ndash;3%). <strong>Klien preferensi:</strong> pensiunan suka dividen (kas rutin). <strong>Aturan praktis:</strong> bayar dividen jika tidak ada proyek ROIC &gt; WACC; jika ada &rarr; tahan &amp; investasikan (buyback lebih <em>tax-efficient</em> di banyak yurisdiksi).</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; WACC kilat</h3>
      <p>Ekuitas pasar Rp800M, utang Rp200M, Re 12%, Rd 7%, pajak 20%. WACC?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>WACC = 0,8&times;12% + 0,2&times;7%&times;0,8 = 9,6% + 1,12% = <strong>10,72%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; EAA kilat</h3>
      <p>Proyek X: NPV 200, umur 4 thn. Proyek Y: NPV 240, umur 6 thn. r = 10%. Pilih?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>EAA_X = 200/3,1699 = <strong>63,1</strong>; EAA_Y = 240/4,3553 = <strong>55,1</strong> &rarr; <strong>pilih X</strong> (NPV lebih besar ≠ menang jika umur beda!).</p>
      </details>
      <h3>Drill 3 &mdash; Sunk cost trap</h3>
      <p>Studi Rp50M (sunk), NPV proyek +Rp20M (tanpa sunk), tapi butuh gudang milik sendiri yang bisa disewakan Rp8M/thn (5 thn, r = 10%). Keputusan?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>PV opportunity = 8 &times; 3,7908 = Rp30,3M. NPV benar = 20 &minus; 30,3 = <strong>&minus;Rp10,3M &rarr; TOLAK.</strong> Sunk Rp50M diabaikan; opportunity wajib dihitung &mdash; dan ia membalik keputusan!</p>
      </details>
      <h3>Drill 4 &mdash; Vignette governance</h3>
      <p>CEO merangkap ketua dewan, 2 dari 7 komisaris independen, auditor diganti 3&times; dalam 5 tahun. Tiga red flags &amp; satu tindakanmu sebagai calon investor?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p>(1) <strong>CEO duality</strong> &mdash; pengawas = yang diawasi; (2) <strong>independensi semu</strong> (2/7 &lt; mayoritas); (3) <strong>opini shopping</strong> &mdash; ganti auditor berulang = cari yang &ldquo;lunak&rdquo;. Tindakan: <strong>terapkan governance discount 25%+ atau hindari</strong> &mdash; dan cek footnote pihak berelasi sebelum memutuskan.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. I0 Rp500M, CF Rp120M/thn 5 thn, WACC 12%. NPV?"}
  options={
    ["+Rp67M",
    "−Rp67M (tolak!)",
    "Rp0",
    "+Rp100M"]
  }
  correct={1}
  explanation={"Benar: 120×3,6048 − 500 = −67,4. 'Untung akuntansi' menipu; NPV jujur. Keputusan: tolak."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Proyek A: Rp10M, IRR 50%. Proyek B: Rp1M, IRR 30%. Mutually exclusive. Pilih?"}
  options={
    ["A (IRR tertinggi)",
    "Hitung NPV — nilai absolut yang menang",
    "Keduanya",
    "Tolak keduanya"]
  }
  correct={1}
  explanation={"Benar: IRR buta skala. NPV A = +Rp5M vs B = +Rp300jt → B menang. Aturan: konflik NPV vs IRR → NPV."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. WACC = 0,4×10%×0,78 + 0,6×16%. Hasil?"}
  options={
    ["13,0%",
    "12,72%",
    "10,0%",
    "16,0%"]
  }
  correct={1}
  explanation={"Benar: 3,12% + 9,6% = 12,72%. Tax shield (1−T) membuat utang 'murah' — tapi bukan alasan utang ugal-ugalan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. DIO 90, DSO 75, DPO 40. CCC dan artinya?"}
  options={
    ["205 hari",
    "125 hari — kas terikat ~4 bulan",
    "25 hari",
    "90 hari"]
  }
  correct={1}
  explanation={"Benar: 90+75−40 = 125. Makin panjang = makin banyak kas 'nyangkut'. Perpanjang DPO & tekan DIO/DSO untuk membebaskan kas."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Governance red flag terkuat?"}
  options={
    ["Dividen kecil",
    "Transaksi afiliasi jumbo ke perusahaan direksi",
    "Rapat board rutin",
    "Situs web jelek"]
  }
  correct={1}
  explanation={"Benar: tunneling via afiliasi = laba 'bocor' ke kantong manajemen. Ini alasan utama diskon valuasi governance."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Ekuitas pasar 600M, utang 400M, Re 14%, Rd 8%, pajak 25%. WACC?"}
  options={
    ["11,6%",
    "10,8%",
    "12,0%",
    "9,6%"]}
  correct={1}
  explanation={"Benar: 0,6×14% + 0,4×8%×0,75 = 8,4% + 2,4% = 10,8%. Ingat: bobot pakai nilai PASAR, dan biaya utang setelah pajak."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Governance</strong>: wasit perusahaan; red flag = afiliasi jumbo, auditor gonta-ganti.</li>
<li><strong>NPV &gt; 0 terima</strong>; konflik dengan IRR → NPV menang.</li>
<li><strong>Arus kas inkremental</strong>: sunk cost abaikan, opportunity cost masukkan.</li>
<li><strong>WACC</strong> = w_d×r_d(1−T) + w_e×r_e (bobot pasar!) = hurdle rate.</li>
<li><strong>CCC</strong> = DIO + DSO − DPO — pendek = kas sehat.</li>
<li><strong>Kapan TIDAK capex</strong>: tanpa NPV + tanpa rencana tenor pendanaan.</li>

<li><strong>Governance:</strong> rem sebelum mesin — wedge kontrol, tunneling, CEO duality = red flags.</li>
<li><strong>Budgeting:</strong> NPV inkremental &amp; after-tax; EAA untuk umur beda; sunk dicoret, opportunity dihitung.</li>
<li><strong>WACC:</strong> bobot pasar/target, utang after-tax, risk-adjusted per proyek.</li>
<li><strong>Kapan TIDAK pakai:</strong> IRR untuk mutually exclusive; WACC perusahaan untuk proyek beda risiko; book weights jika market tersedia.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a4-financial-statements" className="btn btn-secondary btn-sm">← PM-A4</Link>
        <Link href="/learn/pm-a6-equity" className="btn btn-primary btn-sm">PM-A6 →</Link>
      </div>
    </div>
  );
}

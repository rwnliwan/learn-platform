"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA3EconomicsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A3 — Portfolio Management</span>
        <h1 className="display-title">Economics:<br/>Mikro, Makro & FX</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Kenapa Kopi Naik Saat Rupiah Melemah?</a></li>
<li><a href="#mikro">Mikro: Pasar & Struktur</a></li>
<li><a href="#makro">Makro & Kebijakan</a></li>
<li><a href="#fx">Perdagangan & FX</a></li>
<li><a href="#sintesis">Sintesis: Satu Warung, Tiga Lensa</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Warung Bu Ratna</a></li>
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
<li>Menjelaskan keseimbangan demand-supply dan 4 struktur pasar.</li>
<li>Menghitung GDP (expenditure approach) dan inflasi (CPI).</li>
<li>Membedakan kebijakan moneter vs fiskal dan transmisinya ke pasar.</li>
<li>Menjelaskan apresiasi/depresiasi dan menghitung cross-rate.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Kenapa Kopi Naik Saat Rupiah Melemah?</h2>
      <div className="story">
        <p><strong>Bu Ratna</strong> punya warung kopi. Tahun ini harga biji kopi naik 20% — padahal panen bagus. Ia menyalahkan tengkulak. Analis muda menjelaskan: <strong>kopi diperdagangkan dalam USD</strong>; rupiah melemah 15% terhadap USD tahun ini. Harga global tetap — yang berubah adalah <strong>nilai tukar</strong>.</p>
<p>Twist-nya: Bu Ratna lalu bertanya <em>&ldquo;kenapa rupiah melemah?&rdquo;</em> — dan jawabannya merambat: suku bunga AS naik → modal keluar → rupiah tertekan → <strong>Bank Indonesia menaikkan suku bunga</strong> → kredit warungnya ikut mahal. Satu keputusan The Fed mengguncang warung kopi di Makassar. <strong>Makroekonomi bukan teori jauh — ia harga kopimu.</strong> Lesson ini: rantai sebab-akibat itu.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="mikro">Mikro — Demand, Supply & Struktur Pasar</h2>
<p><strong>Definisi.</strong> <strong>Harga keseimbangan</strong>: demand = supply. <strong>Elastisitas</strong> (ingat MK14!): demand elastis → produsen tidak bisa menaikkan harga. <strong>Struktur pasar</strong>: <em>perfect competition</em> (banyak penjual, produk homogen, price taker — mis. beras), <em>monopolistic competition</em> (banyak, diferensiasi — warung kopi), <em>oligopoli</em> (sedikit penjual — semen, telekomunikasi), <em>monopoli</em> (satu penjual, price maker — PLN).</p>
<p>Implikasi investasi: <strong>pricing power</strong> (monopoli/oligopoli) = margin defensif = valuasi premium. Perfect competition = margin tipis selamanya.</p>
<p><strong>Kepribadian/intuisi:</strong> Struktur pasar seperti <strong>lapangan permainan</strong>: perfect competition = pasar becek (semua jual sama, untung tipis); monopoli = punya kunci stadion (tentukan harga sendiri). Investor membayar mahal untuk 'kunci stadion' (moat).</p>
<p><strong>Kapan dipakai:</strong> Analisis industri (Porter): siapa punya pricing power? → PM-B4 valuasi.</p>

<p><strong>Pendalaman intuisi &mdash; struktur pasar = takdir margin.</strong> Dalam kompetisi sempurna, laba ekonomi jangka panjang = <strong>nol</strong> (pendatang baru menggerus margin). Dalam monopoli/monopolistic competition dengan diferensiasi kuat, margin <em>bertahan</em>. Itulah kenapa analis ekuitas terobsesi dengan <strong>moat</strong> (parit pertahanan): brand, skala, <em>switching cost</em>, regulasi. <strong>Rumus Lerner:</strong> (P&minus;MC)/P = &minus;1/E &mdash; semakin <em>inelastic</em> demand (E kecil), semakin besar markup yang bisa dipasang. Saham &ldquo;mahal&rdquo; (P/E tinggi) sering kali cuma mencerminkan moat yang memang layak dibayar mahal.</p>
<details className="worked">
<summary>📐 Contoh: Dua emiten kopi (klik untuk buka)</summary>
<p><strong>KopiCurah</strong> (perfect competition): 1.000 penjual, margin bersih 3%, ROE 8%. <strong>KopiBrand</strong> (monopolistic + brand kuat): margin 18%, ROE 25%.</p>
<p>Saat biaya biji naik 20%: KopiCurah <strong>tidak bisa</strong> menaikkan harga (pelanggan pindah) → margin → 0%. KopiBrand menaikkan 15% → margin 14%.</p>
<p><strong>Pelajaran:</strong> struktur pasar menentukan siapa yang selamat dari shock biaya. Screening saham: cari pricing power, bukan sekadar growth.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Lerner Index &mdash; mengukur pricing power</summary>
<p><strong>Soal:</strong> dua emiten kopi. Emiten D (diferensiasi kuat): elastisitas demand E = &minus;2. Emiten K (komoditas): E = &minus;8. MC keduanya Rp10.000/cup. Hitung harga optimal &amp; markup.</p>
<p><strong>Langkah 1 &mdash; rumus:</strong> (P&minus;MC)/P = &minus;1/E &rarr; P = MC / (1 + 1/E).</p>
<p><strong>Langkah 2 &mdash; Emiten D:</strong> P = 10.000/(1&minus;0,5) = <strong>Rp20.000</strong> (markup 100%!). <strong>Emiten K:</strong> P = 10.000/(1&minus;0,125) = <strong>Rp11.429</strong> (markup 14%).</p>
<p><strong>Interpretasi investor:</strong> diferensiasi (brand/rasa/lokasi) mengubah E dari &minus;8 ke &minus;2 &mdash; dan <em>menggandakan</em> harga jual. Inilah matematika di balik &ldquo;moat&rdquo;: <strong>yang dibeli investor bukan kopinya, melainkan inelastisitas demand-nya</strong>. Saat menilai emiten consumer, selalu tanya: seberapa mudah pelanggan pindah?</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Multiplier &mdash; Rp100T stimulus jadi berapa?</summary>
<p><strong>Soal:</strong> pemerintah gelontorkan stimulus Rp100T. MPC masyarakat 0,8. Berapa dampak ke PDB?</p>
<p><strong>Langkah 1:</strong> multiplier = 1/(1&minus;MPC) = 1/0,2 = <strong>5</strong>.</p>
<p><strong>Langkah 2:</strong> &Delta;PDB = 100T &times; 5 = <strong>Rp500T</strong>.</p>
<p><strong>Nuansa analis:</strong> multiplier 5 adalah <em>teori</em> (asumsi tidak ada impor/kebocoran). Di ekonomi terbuka seperti Indonesia (kecenderungan impor tinggi), multiplier efektif 2&ndash;3. <strong>Jangan telan angka textbook mentah-mentah</strong> &mdash; sesuaikan dengan struktur ekonomi. Dan ingat: stimulus juga bisa bocor ke <em>inflasi</em>, bukan output, jika ekonomi sudah di kapasitas penuh.</p>
</details>

<details className="worked">
<summary>📐 Contoh 4 (gaya CFA): Elastisitas silang &mdash; teman atau musuh?</summary>
<p><strong>Soal:</strong> harga teh naik 10%, kuantitas kopi yang diminta naik 15%. Harga gula naik 10%, kuantitas kopi <em>turun</em> 5%. Hitung elastisitas silang dan klasifikasikan hubungannya.</p>
<p><strong>Langkah 1 &mdash; rumus:</strong> E_xy = (%&Delta;Q_x) / (%&Delta;P_y).</p>
<p><strong>Langkah 2 &mdash; kopi-teh:</strong> E = +15% / +10% = <strong>+1,5</strong> &rarr; positif &rarr; <strong>substitusi</strong>. Teh mahal &rarr; orang pindah ke kopi. <strong>Kopi-gula:</strong> E = &minus;5% / +10% = <strong>&minus;0,5</strong> &rarr; negatif &rarr; <strong>komplemen</strong>. Gula mahal &rarr; orang mengurangi kopi manis.</p>
<p><strong>Langkah 3 &mdash; implikasi investor:</strong> emiten kopi punya <em>dua</em> eksposur harga yang berlawanan arah &mdash; kenaikan harga teh = <em>tailwind</em> (permintaan kopi naik), kenaikan harga gula = <em>headwind</em>. Analis yang hanya melihat &ldquo;harga kopi&rdquo; melewatkan separuh cerita. <strong>Petakan rantai substitusi-komplemen tiap emiten consumer</strong> &mdash; di sinilah <em>earnings surprise</em> bersembunyi.</p>
<p><strong>Jebakan ujian:</strong> tanda positif/negatif yang tertukar. Ingat: <strong>substitusi = searah (positif)</strong>, <strong>komplemen = berlawanan (negatif)</strong>. Cara ingat: &ldquo;teman pengganti ikut naik, pasangan ikut turun&rdquo;.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;PDB naik, saham pasti naik&rdquo;.</strong> <strong>Salah.</strong> Pasar saham bereaksi terhadap <em>ekspektasi vs realisasi</em>, bukan level PDB. PDB tumbuh 5% tapi konsensus 5,5% &rarr; pasar <em>kecewa</em> &rarr; turun. Sebaliknya PDB 4% vs ekspektasi 3,5% &rarr; naik. Plus: laba emiten ≠ PDB (komposisi sektor beda). Soal CFA menguji ini dengan frasa &ldquo;<em>better-than-expected</em>&rdquo; &mdash; itu kata kuncinya, bukan angka absolutnya.</p>
</div>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [10,9,8,7,6,5,4,3,2,1], type: "scatter", mode: "lines", line: {color: "#2a7de1"}, name: "demand"}, {x: [1,2,3,4,5,6,7,8,9,10], y: [1,2,3,4,5,6,7,8,9,10], type: "scatter", mode: "lines", line: {color: "#e8a838"}, name: "supply"}]}
  title={"Keseimbangan demand-supply"}
  layout={{xaxis: {title: "Quantity"}, yaxis: {title: "Harga"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru turun = demand, kuning naik = supply. Titik potong = keseimbangan.</p>
<p><strong>Interpretasi:</strong> Pajak/subsidi/cuaca <strong>menggeser</strong> kurva (bukan bergerak di sepanjangnya). Rupiah melemah = biaya impor naik = supply kopi <strong>bergeser kiri</strong> → harga naik walau panen bagus. Bedakan 'pergerakan' vs 'pergeseran' — 80% kesalahan analisis mikro.</p>
</div>

<PlotlyChart
  data={[{x: [0.5,0.6,0.7,0.8,0.9], y: [2,2.5,3.33,5,10], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Multiplier = 1/(1-MPC)"}]}
  title={"Fiscal multiplier meledak saat MPC tinggi"}
  layout={{xaxis: {title: "MPC (marginal propensity to consume)"}, yaxis: {title: "Multiplier"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = MPC (berapa rupiah dari tiap Rp1 pendapatan yang dibelanjakan). Sumbu Y = multiplier fiskal.</p>
<p><strong>Interpretasi:</strong> Kurva <strong>eksponensial</strong>: MPC 0,5 &rarr; multiplier 2; MPC 0,9 &rarr; multiplier <strong>10</strong>. Artinya: stimulus ke masyarakat bawah (MPC tinggi) <em>jauh</em> lebih &ldquo;nendang&rdquo; ke PDB dibanding stimulus ke konglomerat (MPC rendah, uangnya ditabung). Inilah logika ekonomi di balik BLT vs insentif korporat &mdash; dan kenapa analis memetakan <em>siapa penerima</em> stimulus, bukan cuma <em>berapa besarnya</em>.</p>
</div>
<h2 id="makro">Makro — GDP, Siklus & Kebijakan</h2>
<p><strong>Definisi.</strong> <strong>GDP = C + I + G + (X − M)</strong>. <strong>Inflasi</strong> (CPI): <Tex math={String.raw`\pi = (CPI_t - CPI_{t-1})/CPI_{t-1}`} />. <strong>Pengangguran</strong>: frictional (cari kerja), structural (skill mismatch), cyclical (resesi). <strong>Siklus bisnis</strong>: ekspansi → puncak → kontraksi → lembah.</p>
<p><strong>Moneter</strong> (bank sentral): naikkan suku bunga → kredit mahal → demand turun → inflasi turun (tapi growth ikut turun). <strong>Fiskal</strong> (pemerintah): belanja naik/pajak turun → stimulus (tapi defisit &amp; utang naik).</p>
<Tex math={String.raw`GDP = C + I + G + (X-M) \quad;\quad \pi = \frac{CPI_t - CPI_{t-1}}{CPI_{t-1}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`C`} />: konsumsi rumah tangga (terbesar di Indonesia, ~55%)</li>
<li><Tex math={String.raw`I`} />: investasi (PMTB)</li>
<li><Tex math={String.raw`G`} />: belanja pemerintah</li>
<li><Tex math={String.raw`X-M`} />: net ekspor</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Kebijakan moneter seperti <strong>keran air</strong>: BI memutar keran suku bunga — air (kredit) mengecil → mesin ekonomi melambat → 'panas' inflasi turun. Fiskal seperti <strong>pompa tambahan</strong>: pemerintah menyuntik belanja langsung ke kolam.</p>
<p><strong>Kapan dipakai:</strong> Setiap keputusan alokasi: rezim suku bunga menentukan winners (bank vs properti vs obligasi).</p>

<p><strong>Pendalaman intuisi &mdash; pasar bereaksi terhadap <em>ekspektasi</em>, bukan realisasi.</strong> The Fed menaikkan suku bunga 0,25% <em>sesuai ekspektasi</em> &rarr; pasar tenang-tenang saja. Yang menggerakkan pasar adalah <strong>kejutan</strong> (selisih realisasi vs ekspektasi) — itulah kenapa pidato Powell yang &ldquo;lebih hawkish dari dugaan&rdquo; bisa menjatuhkan pasar 2% dalam sejam. <strong>Implikasi analis:</strong> jangan tanya &ldquo;BI akan naikkan bunga?&rdquo; — tanya &ldquo;<em>apakah kenaikan ini sudah priced-in?</em>&rdquo;. Baca <em>dot plot</em> Fed dan konsensus ekonom, bukan cuma keputusannya.</p>
<details className="worked">
<summary>📐 Contoh: Rantai The Fed → warung Bu Ratna (klik untuk buka)</summary>
<p><strong>1.</strong> The Fed naikkan rate → yield US naik → modal keluar dari EM. <strong>2.</strong> Rupiah melemah 15% → harga kopi impor (USD) naik. <strong>3.</strong> BI naikkan BI-Rate → KTA/kredit warung mahal. <strong>4.</strong> Demand melemah → Bu Ratna tidak bisa fully pass-through harga.</p>
<p><strong>Margin terjepit dua sisi</strong>: biaya naik (FX) + demand turun (rate). Inilah <em>stagflationary pressure</em> versi warung kopi — dan alasan investor EM wajib paham kebijakan global.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Taylor Rule &mdash; menebak BI rate</summary>
<p><strong>Soal:</strong> r* = 2%, inflasi aktual 5%, target 2%, <em>output gap</em> +1%. Berapa suku bunga &ldquo;wajar&rdquo; menurut Taylor rule?</p>
<p><strong>Langkah 1 &mdash; rumus:</strong> r = r* + &pi; + 0,5(&pi;&minus;&pi;*) + 0,5(output gap).</p>
<p><strong>Langkah 2:</strong> r = 2 + 5 + 0,5(5&minus;2) + 0,5(1) = 2 + 5 + 1,5 + 0,5 = <strong>9%</strong>.</p>
<p><strong>Interpretasi:</strong> jika BI rate aktual 6,25%, maka kebijakan <em>longgar</em> relatif terhadap Taylor (9%) &mdash; atau: pasar akan <em>menuntut</em> kenaikan jika inflasi tidak turun. Taylor rule bukan ramalan sempurna, tapi <strong>jangkar</strong>: ia memberi tahu apakah kebijakan saat ini <em>hawkish</em> atau <em>dovish</em> relatif terhadap kondisi. Analis obligasi memakai ini tiap RDG BI.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Membaca siklus &mdash; leading vs lagging</summary>
<p><strong>Soal:</strong> data: PMI manufaktur turun 3 bulan beruntun (48 &rarr; 46), <em>yield spread</em> 10Y&minus;2Y negatif (&minus;0,3%), tapi pengangguran masih rendah (5,1%) dan laba emiten Q3 naik. Resesi atau tidak?</p>
<p><strong>Analisis:</strong> PMI &amp; yield spread = <strong>leading</strong> (mendahului) &mdash; keduanya merah. Pengangguran &amp; laba = <strong>lagging/coincident</strong> (mengikuti) &mdash; masih hijau. <strong>Kesimpulan: waspada, belum vonis.</strong> Indikator leading memburuk 3 bulan ≠ resesi besok &mdash; tapi probabilitasnya naik. Respons investor: <em>tilt</em> defensif (naikkan kualitas kredit, kurangi siklikal), bukan <em>all-out</em> jual.</p>

<details className="worked">
<summary>📐 Contoh 4 (gaya CFA): Debt-deflation &mdash; kenapa deflasi menakutkan</summary>
<p><strong>Soal:</strong> emiten punya utang Rp1T (nominal tetap), aset Rp1,5T. Deflasi 5% setahun selama 3 tahun, pendapatan nominal ikut turun 5%/tahun. Apa yang terjadi pada <em>beban utang riil</em>?</p>
<p><strong>Langkah 1 &mdash; utang nominal tetap:</strong> Rp1T tetap Rp1T &mdash; tidak turun dengan deflasi.</p>
<p><strong>Langkah 2 &mdash; pendapatan menyusut:</strong> mis. EBITDA awal Rp300M &rarr; setelah 3 tahun deflasi 5%: 300 &times; 0,95&sup3; = 300 &times; 0,857 = <strong>Rp257M</strong>.</p>
<p><strong>Langkah 3 &mdash; rasio utang/EBITDA:</strong> awal 3,3&times; &rarr; 1.000/257 = <strong>3,9&times;</strong> &mdash; <em>memburuk</em> tanpa meminjam sepeser pun! Inilah <strong>paradoks debt-deflation</strong> Fisher (1933): semakin semua orang berhemat &amp; harga turun, semakin <em>berat</em> beban utang riil, semakin banyak yang gagal bayar, semakin dalam deflasinya &mdash; <strong>spiral</strong>.</p>
<p><strong>Implikasi investor:</strong> saat deflasi, <strong>hindari emiten berleverage tinggi</strong> (utang nominal + pendapatan menyusut = racun) dan pilih yang <em>cash-rich</em> &mdash; kas justru <em>bertambah</em> daya belinya. Inilah kenapa bank sentral <em>takut</em> deflasi lebih dari inflasi moderat: inflasi menggerus utang, deflasi menggemukkannya.</p>
</details>

<p><strong>Pelajaran abadi:</strong> jangan membuat keputusan <em>leading</em> berdasarkan data <em>lagging</em> (&ldquo;pengangguran masih rendah, aman&rdquo; = mengemudi sambil melihat spion).</p>
</details>
<h2 id="fx">Trade & FX — Keunggulan & Nilai Tukar</h2>
<p><strong>Definisi.</strong> <strong>Keunggulan komparatif</strong> (Ricardo): berdaganglah yang <em>opportunity cost</em>-nya terendah — bukan yang paling efisien absolut. <strong>Hambatan dagang</strong>: tarif, kuota, subsidi. <strong>FX</strong>: <em>apresiasi</em> (mata uang menguat) vs <em>depresiasi</em>; rezim <em>fixed/managed float/free float</em> (Indonesia: managed float).</p>
<p><strong>Cross-rate</strong>: jika USD/IDR = 16.000 dan USD/JPY = 150, maka JPY/IDR = 16.000/150 = 106,67. <strong>Triangular arbitrage</strong>: jika cross-rate pasar ≠ hitungan → peluang arbitrase (hilang dalam milidetik di era algoritma).</p>
<Tex math={String.raw`S_{JPY/IDR} = \frac{S_{USD/IDR}}{S_{USD/JPY}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`S`} />: spot rate (konvensi: mata uang kedua per satu unit pertama)</li>
<li>Cross-rate = pembagian dua rate terhadap mata uang bersama</li>
<li>Arbitrase segitiga: eksekusi 3 konversi; profit jika hasil &gt; 1</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Cross-rate seperti <strong>kurs di money changer bertingkat</strong>: tidak ada papan JPY/IDR? Hitung via USD. Jika money changer A kasih rate beda dari hitunganmu → borong (arbitrase) — sebelum ia sadar.</p>
<p><strong>Kapan dipakai:</strong> Eksposur FX emiten (PM-B7), hedging (PM-C9).</p>

<p><strong>Pendalaman intuisi &mdash; paritas FX adalah &ldquo;hukum gravitasi&rdquo;, carry adalah &ldquo;terbang&rdquo;.</strong> Paritas suku bunga bilang: return berhedge harus sama di semua mata uang (jika tidak, arbitrase menutup celah dalam <em>menit</em>). Tapi <em>uncovered</em> carry trade (pinjam murah, invest mahal, <strong>tanpa hedge</strong>) bisa profit bertahun-tahun &mdash; karena kamu dibayar untuk <strong>menanggung risiko crash</strong> (saat krisis, mata uang bunga-tinggi anjlok duluan). <strong>Carry bukan uang gratis; ia premi asuransi terbalik</strong> &mdash; kamu jadi penjual asuransi yang untung tiap bulan tenang, lalu bangkrut sekali saat badai.</p>
<details className="worked">
<summary>📐 Contoh: Cek arbitrase (klik untuk buka)</summary>
<p>Pasar: USD/IDR 16.000, USD/JPY 150, JPY/IDR <strong>110</strong> (quote pasar).</p>
<p><strong>Hitungan:</strong> 16.000/150 = <strong>106,67</strong>. Pasar quote 110 → JPY <em>kemahalan</em> di pasar itu.</p>
<p><strong>Arbitrase:</strong> Rp16jt → USD1.000 → JPY150.000 → (jual @110) Rp16,5jt. <strong>Profit Rp500rb/putaran</strong> (minus spread/biaya). Di dunia nyata: spread &amp; latensi membunuh ini — tapi logikanya dipakai untuk <em>pricing</em> derivatif FX.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Arbitrase covered interest &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> S = Rp16.000/USD, F_1thn = Rp16.200/USD, r_IDR = 6%, r_USD = 5%. Ada arbitrase?</p>
<p><strong>Langkah 1 &mdash; forward wajar:</strong> F* = 16.000 &times; (1,06/1,05) = <strong>Rp16.152</strong>.</p>
<p><strong>Langkah 2 &mdash; bandingkan:</strong> F_pasar (16.200) &gt; F* (16.152) &rarr; forward USD <em>kemahalan</em> &rarr; <strong>JUAL USD forward</strong>.</p>
<p><strong>Langkah 3 &mdash; eksekusi (per $1):</strong> pinjam Rp16.000 (bayar 6% &rarr; utang Rp16.960); konversi spot &rarr; $1; investasikan 5% &rarr; $1,05; jual $1,05 forward @16.200 &rarr; Rp17.010; bayar utang Rp16.960 &rarr; <strong>profit Rp50, tanpa risiko</strong>.</p>

<details className="worked">
<summary>📐 Contoh 4 (gaya CFA): Impossible trinity &mdash; pilih dua, korbankan satu</summary>
<p><strong>Soal:</strong> negara X ingin: (a) kurs tetap ke USD, (b) arus modal bebas, (c) kebijakan moneter independen (bisa cut rate saat resesi). Bisakah ketiganya?</p>
<p><strong>Jawaban: tidak &mdash; maksimal dua.</strong> Buktinya: mis. X mematok kurs + modal bebas. Investor bisa meminjam USD murah &rarr; konversi ke mata uang X &rarr; investasikan. Jika X memotong suku bunga (independen) di bawah USD, modal <em>kabur</em> &rarr; tekanan jual mata uang X &rarr; untuk <em>mempertahankan patokan</em>, bank sentral harus <em>menjual cadangan devisa &amp; menaikkan bunga</em> &mdash; persis kebalikan dari yang diinginkan! <strong>Kebijakan independennya mati.</strong></p>
<p><strong>Tiga pilihan dunia nyata:</strong> (1) AS: modal bebas + independen, <strong>korbankan</strong> kurs tetap (USD mengambang). (2) Hong Kong: kurs tetap + modal bebas, <strong>korbankan</strong> independen (suku bunga ikut The Fed). (3) China (dulu): kurs terkendali + independen, <strong>korbankan</strong> modal bebas (capital control).</p>
<p><strong>Posisi Indonesia:</strong> <em>managed float</em> + modal relatif bebas + BI independen = <strong>jalan tengah</strong>: intervensi saat volatilitas berlebihan, tapi tidak mematok kaku. Implikasi: <strong>IDR <em>pasti</em> berfluktuasi</strong> &mdash; dan itu <em>by design</em>, bukan kegagalan. Investor yang paham trinity tidak panik saat IDR bergerak; ia sudah memasukkan volatilitas ke model.</p>
</details>

<p><strong>Realita:</strong> Rp50 per dolar = 0,3% &mdash; kecil, dan di pasar nyata <em>bid-ask spread</em> + biaya transaksi menelannya. Arbitrase covered hampir tidak pernah menguntungkan ritel &mdash; tapi <strong>logikanya</strong> (F* sebagai jangkar kewajaran) dipakai tiap hari oleh <em>treasury</em> korporat untuk menilai &ldquo;forward mahal atau murah&rdquo;.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Matematika carry trade &mdash; dan kecelakaannya</summary>
<p><strong>Soal:</strong> pinjam JPY di 0,5%, investasikan di IDR 6%, setahun. (a) Return jika kurs flat. (b) Return jika IDR melemah 10%.</p>
<p><strong>Langkah 1 (flat):</strong> (1,06/1,005) &minus; 1 = <strong>+5,47%</strong> &mdash; &ldquo;uang gratis&rdquo;?</p>
<p><strong>Langkah 2 (IDR &minus;10%):</strong> (1,06/1,005) &times; 0,90 &minus; 1 = 1,0547 &times; 0,90 &minus; 1 = <strong>&minus;5,07%</strong>.</p>
<p><strong>Interpretasi:</strong> 5 tahun tenang = +5,47% &times; 5 &asymp; +30%; 1 tahun krisis = &minus;5% <em>plus</em> biasanya krisis = IDR melemah 20&ndash;30% (2008, 2020) &rarr; <strong>satu tahun menghapus seluruh akumulasi</strong>. Distribusi return carry = <em>negatively skewed</em>: &ldquo;naik tangga, turun lift&rdquo;. Inilah kenapa carry disebut <strong>memungut receh di depan buldoser</strong>.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Depresiasi IDR: untuk siapa?</strong> &ldquo;Rupiah melemah = buruk&rdquo; adalah generalisasi berbahaya. <strong>Importir &amp; emiten berutang USD: buruk.</strong> <strong>Eksportir (CPO, batubara, nikel): justru margin <em>melebar</em></strong> (pendapatan USD, biaya IDR). Soal vignette yang cerdas memberi emiten eksportir + IDR melemah, lalu bertanya dampak &mdash; jawaban &ldquo;negatif&rdquo; adalah pengecoh. <strong>Selalu petakan eksposur dulu.</strong></p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Satu Warung, Tiga Lensa</h2>
      <p>Mikro, makro, dan FX bukan tiga dunia &mdash; mereka <strong>tiga lensa untuk satu objek yang sama</strong> (warung Bu Ratna, atau emiten apa pun):</p>
      <ol>
        <li><strong>Lensa MIKRO:</strong> seberapa besar <em>pricing power</em>-nya? (struktur pasar &rarr; elastisitas &rarr; markup). Ini menentukan <em>siapa yang bisa meneruskan</em> kenaikan biaya.</li>
        <li><strong>Lensa MAKRO:</strong> dari mana guncangannya datang? (Fed &rarr; capital flow &rarr; IDR &rarr; BI rate &rarr; demand). Ini menentukan <em>arah &amp; besar</em> guncangan.</li>
        <li><strong>Lensa FX:</strong> berapa eksposur bersihnya? (utang USD vs pendapatan USD &rarr; natural hedge?). Ini menentukan <em>siapa untung, siapa buntung</em> dari pergerakan kurs.</li>
      </ol>
      <p><strong>Alur analis profesional:</strong> makro memberi <em>skenario</em> (&ldquo;IDR melemah 15%&rdquo;) &rarr; FX memberi <em>eksposur</em> (&ldquo;emiten ini net importir&rdquo;) &rarr; mikro memberi <em>respons</em> (&ldquo;tapi ia punya pricing power, jadi margin aman&rdquo;). <strong>Kesimpulan investasi = ketiga lensa dikalikan, bukan dijumlah.</strong></p>

      <h3>🎙️ Debat: Haruskah BI Memotong Suku Bunga?</h3>
      <p>Dua analis, satu data &mdash; inflasi 2,8% (dalam target), PDB tumbuh 4,9%, IDR melemah 6% YTD, Fed <em>on hold</em>. Siapa benar?</p>
      <p><strong>Analis Dovish (pro-cut):</strong> &ldquo;Inflasi jinak + pertumbuhan di bawah potensial (5,2%) = <em>output gap negatif</em>. Taylor rule memberi 5%, BI rate 6,25% = terlalu ketat. <em>Real rate</em> 3,45% mencekik kredit UMKM. Fed <em>on hold</em> = ruang gerak terbuka. <em>Cut</em> 25bp sekarang, nilai tukar bisa dijaga via intervensi.&rdquo;</p>
      <p><strong>Analis Hawkish (tahan):</strong> &ldquo;IDR melemah 6% = <em>imported inflation</em> mengintai 2&ndash;3 bulan ke depan. <em>Cut</em> sekarang = sinyal <em>dovish</em> &rarr; capital outflow &rarr; IDR makin lemah &rarr; inflasi naik &rarr; terpaksa <em>hike</em> lebih agresif nanti. <strong>Kredibilitas lebih mahal dari 25bp.</strong> Tunggu Fed bergerak dulu.&rdquo;</p>
      <p><strong>Putusan:</strong> keduanya valid &mdash; ini <strong>perbedaan bobot risiko</strong>, bukan benar/salah. Dovish menimbang <em>pertumbuhan hari ini</em>; hawkish menimbang <em>stabilitas esok hari</em>. <strong>Pelajaran analis:</strong> saat membaca rekomendasi &ldquo;BI harus cut/tahan&rdquo;, tanyakan <em>asumsi implisitnya tentang Fed &amp; IDR</em> &mdash; di situlah perdebatan sebenarnya. Dan untuk portofoliomu: jangan bertaruh satu arah; <em>position</em> untuk dua skenario (mis. obligasi tenor menengah = menang di dua skenario).</p>
      <h3>📊 Data Corner: Membaca Neraca Pembayaran (5 menit)</h3>
      <p><strong>Data (ilustrasi, USD miliar):</strong> transaksi berjalan &minus;8 (defisit), transaksi modal &amp; finansial +12 (surplus), cadangan devisa +3.</p>
      <p><strong>Cara membaca:</strong> (1) <strong>Transaksi berjalan defisit</strong> &rarr; negara belanja ke luar negeri lebih dari pendapatannya &mdash; impor &gt; ekspor + jasa. (2) <strong>Finansial surplus lebih besar</strong> &rarr; defisit <em>dibiayai</em> oleh inflow modal (FDI, portofolio, utang). (3) <strong>Cadangan naik</strong> &rarr; BI <em>menyerap</em> kelebihan USD (intervensi).</p>
      <p><strong>Interpretasi analis:</strong> struktur ini = <strong>sehat tapi rapuh</strong>. Sehat: defisit kecil &amp; terbiayai. Rapuh: jika sentimen global memburuk, <em>portfolio inflow</em> (uang panas) bisa berbalik dalam <em>hari</em> &rarr; IDR tertekan &rarr; BI bakar cadangan. <strong>Pertanyaan kunci:</strong> berapa porsi inflow yang <em>FDI</em> (lengket) vs <em>portofolio</em> (lincah)? Itu yang menentukan seberapa &ldquo;tidur nyenyak&rdquo; pemegang IDR.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Inflasi selalu buruk. Bank sentral harus mematok 0%.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Deflasi (inflasi negatif) <strong>lebih berbahaya</strong>: konsumen menunda belanja (besok lebih murah) → demand collapse → spiral. Target BI ~2–4% = 'hangat sehat'. Investor justru takut <strong>deflasi Jepang 1990-an</strong>, bukan inflasi 4%.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pelemahan rupiah selalu buruk untuk semua emiten Indonesia.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Eksportir (batubara, CPO) <strong>diuntungkan</strong>: pendapatan USD, biaya rupiah. Importir &amp; berutang USD menderita. Net effect = tergantung struktur. Analisis FX = per emiten, bukan per negara.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Bank sentral menaikkan suku bunga → pasar saham pasti turun.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> tergantung <strong>kenapa</strong> naik. Jika karena ekonomi <em>overheating</em> (laba emiten kuat) &rarr; saham bisa <em>naik</em> (efek laba &gt; efek diskonto). Jika karena inflasi tak terkendali &rarr; turun. Dan jika kenaikan <em>sudah diekspektasikan</em> &rarr; tidak ada efek. <strong>Tiga variabel, bukan satu panah.</strong> Analis yang baik bertanya &ldquo;kenapa &amp; apakah terduga?&rdquo; sebelum &ldquo;berapa?&rdquo;.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Carry trade = strategi aman karena suku bunga pasti.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> yang pasti hanya <em>diferensial bunga</em>; <strong>pergerakan kurs tidak pasti</strong> &mdash; dan justru berkorelasi negatif dengan carry saat krisis (mata uang target anjlok saat kamu paling butuh stabil). <em>Sharpe ratio</em> carry terlihat indah sampai <em>tail event</em> datang. Lindungi dengan opsi atau batasi ukuran posisi.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Ikuti rantai, bukan headline.</strong> 'BI naikkan suku bunga' → tanya: siapa menang (bank: NIM naik) vs kalah (properti: KPR mahal; obligasi: harga turun)? Satu kebijakan = peta winners/losers.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Bedakan nominal vs riil.</strong> GDP tumbuh 5% dengan inflasi 4% = riil ~1%. Upah naik 10% saat inflasi 8% = daya beli +2%. Semua keputusan investasi memakai angka <strong>riil</strong>.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Baca bahasa sentral bankir, bukan cuma angkanya.</strong> Keputusan RDG/FOMC hanya 10% cerita; 90% ada di <em>statement</em> &amp; <em>dot plot</em>: kata &ldquo;<em>patient</em>&rdquo; vs &ldquo;<em>vigilant</em>&rdquo;, &ldquo;<em>data-dependent</em>&rdquo; vs &ldquo;<em>pre-emptive</em>&rdquo; menggerakkan ekspektasi &mdash; dan ekspektasi menggerakkan pasar <em>sebelum</em> keputusan berikutnya. Latihan: bandingkan statement BI bulan ini vs bulan lalu, cari kata yang berubah. Itu &ldquo;soal ujian&rdquo; pasar setiap bulan.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator GDP & Inflasi</h2>
<p>Hitung GDP via expenditure approach dan inflasi dari CPI. Ubah komponen — lihat kontribusinya.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Makro"}
  hint={"Ubah NET_EKSPOR -50 -> +100 (surplus dagang). GDP naik — itulah kenapa pemerintah obses dengan ekspor."}
  defaultCode={"# Kalkulator GDP (expenditure) & inflasi CPI\nC, I, G = 9500, 3200, 1400   # triliun Rp\nNET_EKSPOR = -50             # ubah sesukamu\nCPI_LALU, CPI_KINI = 108.5, 112.0\n\ngdp = C + I + G + NET_EKSPOR\ninflasi = (CPI_KINI - CPI_LALU) / CPI_LALU\nprint(f\"GDP = {C}+{I}+{G}+({NET_EKSPOR}) = Rp{gdp:,.0f} T\")\nprint(f\"Kontribusi: C {C/gdp:.0%}, I {I/gdp:.0%}, G {G/gdp:.0%}, NX {NET_EKSPOR/gdp:.1%}\")\nprint(f\"Inflasi (CPI): {inflasi:.2%}\")\nprint()\n# GDP riil jika inflasi spt di atas dan GDP nominal tumbuh 9%\ng_nom, g_riil = 0.09, (1.09)/(1+inflasi) - 1\nprint(f\"GDP nominal +9%, inflasi {inflasi:.1%} -> GDP RIIL {g_riil:.1%}\")\nprint(\"Selalu pakai angka riil untuk keputusan investasi!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Cross-Rate FX</h2>
<p>Hitung cross-rate dan deteksi peluang triangular arbitrage.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator FX"}
  hint={"Ubah QUOTE_PASAR 110 -> 106.67 (sesuai hitungan). Arbitrase hilang — pasar efisien!"}
  defaultCode={"# Cross-rate & triangular arbitrage\nUSD_IDR = 16000\nUSD_JPY = 150\nQUOTE_PASAR = 110   # JPY/IDR di money changer (ubah sesukamu)\n\nhitung = USD_IDR / USD_JPY\nprint(f\"Cross-rate hitungan JPY/IDR: {hitung:.2f}\")\nprint(f\"Quote pasar JPY/IDR       : {QUOTE_PASAR:.2f}\")\nprint()\nmodal = 16_000_000  # Rp16jt\nusd = modal / USD_IDR\njpy = usd * USD_JPY\nkembali = jpy * QUOTE_PASAR\nprofit = kembali - modal\nprint(f\"Rp{modal/1e6:.0f}jt -> USD{usd:,.0f} -> JPY{jpy:,.0f} -> Rp{kembali/1e6:.2f}jt\")\nprint(f\"Profit: Rp{profit:,.0f} ({profit/modal:.2%})\")\nprint(\"Arbitrase!\" if profit > 0 else \"Tidak ada arbitrase (wajar - spread membunuh ini).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Suku bunga naik → <strong>Overweight bank (NIM), underweight properti & obligasi long-duration</strong></h3>
<p><strong>Kenapa:</strong> Transmisi moneter: kredit mahal, harga obligasi turun.</p>
<p><strong>Contoh nyata:</strong> Rotasi sektor saat BI hawkish.</p>
</div>
<div className="decision-card">
<h3>2. Rupiah melemah tajam → <strong>Cek eksposur FX per emiten; lindungi utang USD</strong></h3>
<p><strong>Kenapa:</strong> Eksportir menang, importir/berutang USD kalah.</p>
<p><strong>Contoh nyata:</strong> Hedging via forward (PM-C9).</p>
</div>
<div className="decision-card">
<h3>3. Inflasi &gt; target → <strong>Aset riil (komoditas, properti); hindari cash & obligasi nominal</strong></h3>
<p><strong>Kenapa:</strong> Inflasi menggerus daya beli nominal.</p>
<p><strong>Contoh nyata:</strong> TIPS / obligasi link-inflasi.</p>
</div>
<div className="decision-card">
<h3>4. Resesi (kontraksi) → <strong>Defensif: consumer staples, kesehatan, obligasi pemerintah</strong></h3>
<p><strong>Kenapa:</strong> Earnings defensif + flight to quality.</p>
<p><strong>Contoh nyata:</strong> Rotasi ke akhir siklus.</p>
</div>
<div className="decision-card">
<h3>5. Menilai emiten saat IDR bergejolak → <strong>Petakan eksposur FX dulu (natural hedge?)</strong></h3>
<p><strong>Kenapa:</strong> Dampak depresiasi beda tanda untuk importir vs eksportir.</p>
<p><strong>Contoh nyata:</strong> Emiten CPO (pendapatan USD, biaya IDR) justru diuntungkan IDR lemah.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Ikuti rantai</strong> kebijakan → sektor.</li><li><strong>Riil, bukan nominal.</strong></li><li><strong>FX per emiten</strong>, bukan per negara.</li><li><strong>Pricing power</strong> = moat.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Warung Bu Ratna vs The Fed</h2>
<div className="callout">
<p>Rupiah melemah 15% (kopi impor USD), BI menaikkan suku bunga, harga biji naik 20%. Bu Ratna (monopolistic competition — warung kopi diferensiasi rasa) ragu menaikkan harga.</p>
<p><strong>Vignette lanjutan.</strong> Rupiah melemah 15% (biji kopi impor USD), BI menaikkan suku bunga, harga biji naik 20%. Bu Ratna (monopolistic competition &mdash; warung kopi diferensiasi rasa) ragu menaikkan harga. Ternyata ia juga punya <strong>utang USD</strong> untuk mesin espresso (cicilan $500/bulan). Di seberang jalan, KopiCurah (perfect competition, kopi sachet) juga terdampak.</p>
<p><strong>Pertanyaan:</strong> (a) Gambarkan rantai The Fed &rarr; warung. (b) Haruskah Bu Ratna menaikkan harga? (c) Bagaimana utang USD mengubah kalkulasinya? (d) Bandingkan opsi Bu Ratna vs KopiCurah. (e) Pelajaran untuk investor saham?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Fed hawkish → modal keluar → IDR melemah → biaya impor naik; BI ikut hawkish → kredit mahal → demand lemah.</strong> Jepitan dua sisi.</p>
<p>(b) <strong>Ya, sebagian</strong> — diferensiasi rasa = pricing power parsial (monopolistic competition). Naikkan 10–12% (tidak full 20%): jaga volume + lindungi margin. KopiCurah (perfect competition) tidak punya opsi ini.</p>
<p>(c) <strong>Makro = mikro yang diagregat.</strong> Setiap emiten punya 'Bu Ratna'-nya: petakan eksposur FX + sensitivitas suku bunga sebelum beli sahamnya.</p>
<p>(d) <strong>Utang USD = pukulan kedua.</strong> Cicilan $500 &times; Rp16.000 = Rp8jt/bln; setelah IDR melemah 15% &rarr; Rp9,2jt/bln (+Rp1,2jt) <em>tanpa</em> kenaikan pendapatan. Bu Ratna kini dijepit <strong>tiga sisi</strong>: biaya biji naik, cicilan utang naik, daya beli pelanggan turun (BI hawkish). Respons: naikkan harga <em>lebih agresif</em> (12&ndash;15%) <strong>atau</strong> <em>hedge</em> utang via forward &mdash; diam = margin tergerus dari dua arah.</p>
<p>(e) <strong>Bu Ratna vs KopiCurah:</strong> Bu Ratna (diferensiasi, E rendah) <em>bisa</em> menaikkan harga &mdash; pelanggan setia menoleransi. KopiCurah (komoditas, E tinggi) <em>tidak bisa</em> &mdash; naikkan Rp500 saja pelanggan pindah; ia harus <em>menelan</em> kenaikan biaya (margin &rarr; nol) atau tutup. <strong>Pelajaran investor: saat guncangan makro, yang bertahan bukan yang paling efisien, melainkan yang punya <em>pricing power</em>.</strong> Inilah kenapa saham consumer bermerek <em>outperform</em> saat inflasi.</p>
</details>
</div>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Lerner kilat</h3>
      <p>MC = Rp50.000, elastisitas demand &minus;4. Harga optimal &amp; markup?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>P = 50.000/(1&minus;0,25) = <strong>Rp66.667</strong>; markup = (66.667&minus;50.000)/66.667 = <strong>25%</strong> (= &minus;1/E &mdash; cocok!).</p>
      </details>
      <h3>Drill 2 &mdash; Taylor kilat</h3>
      <p>r* = 2%, inflasi 3%, target 2%, output gap &minus;1%. Suku bunga wajar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>r = 2 + 3 + 0,5(1) + 0,5(&minus;1) = <strong>5%</strong>. Jika BI rate aktual 6,25% &rarr; kebijakan <em>ketat</em> relatif terhadap kondisi &mdash; ruang untuk <em>cut</em> jika inflasi jinak.</p>
      </details>
      <h3>Drill 3 &mdash; Forward wajar</h3>
      <p>S = 15.800, r_IDR = 5,5%, r_USD = 4,5%, 1 tahun. Forward wajar? Jika pasar 16.100, arbitrase apa?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>F* = 15.800 &times; (1,055/1,045) = <strong>15.951</strong>. Pasar 16.100 &gt; F* &rarr; <strong>jual USD forward</strong> (pinjam IDR &rarr; konversi spot &rarr; invest USD &rarr; jual forward). Profit &asymp; Rp149 per $1 <em>sebelum</em> biaya.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette makro</h3>
      <p>Fed <em>cut</em> 0,5% (ekspektasi 0,25%), BI tahan. Prediksi arah: (i) IDR, (ii) IHSG, (iii) yield obligasi IDR 10Y. Satu kalimat tiap jawaban.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p>(i) <strong>IDR menguat</strong> &mdash; diferensial menyempit + <em>dovish surprise</em> &rarr; capital inflow. (ii) <strong>IHSG cenderung naik</strong> &mdash; likuiditas global longgar + ekspektasi BI ikut cut. (iii) <strong>Yield turun (harga naik)</strong> &mdash; ekspektasi suku bunga domestik ikut turun. <em>Disclaimer</em>: ini arah <em>ceteris paribus</em> &mdash; pasar nyata punya 10 variabel lain bergerak bersamaan.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. GDP = C 9500 + I 3200 + G 1400 + NX (−50). GDP?"}
  options={
    ["Rp14.050 T",
    "Rp14.150 T",
    "Rp13.100 T",
    "Rp14.100 T"]
  }
  correct={0}
  explanation={"Benar: 9500+3200+1400−50 = 14.050. NX negatif (defisit dagang) mengurangi GDP — itulah obsesi pemerintah pada ekspor."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. USD/IDR 16.000, USD/JPY 150. Cross-rate JPY/IDR?"}
  options={
    ["106,67",
    "110",
    "2.400.000",
    "0,0094"]
  }
  correct={0}
  explanation={"Benar: 16.000/150 = 106,67. Jika pasar quote 110 → ada mispricing (arbitrase sebelum spread)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Bank sentral menaikkan suku bunga. Efek pertama ke pasar?"}
  options={
    ["Saham properti naik",
    "Harga obligasi turun (yield naik)",
    "Rupiah pasti menguat",
    "Inflasi langsung turun"]
  }
  correct={1}
  explanation={"Benar: harga obligasi ∝ 1/yield — yield naik → harga turun seketika. Efek ke inflasi butuh 12–18 bulan (lag transmisi)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Rupiah melemah 15%. Emiten paling diuntungkan?"}
  options={
    ["Maskapai (impor avtur)",
    "Eksportir batubara (pendapatan USD, biaya IDR)",
    "Ritel impor",
    "Emiten berutang USD"]
  }
  correct={1}
  explanation={"Benar: pendapatan USD naik dalam rupiah, biaya tetap rupiah → margin mekar. Analisis FX harus per emiten."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Deflasi 2% vs inflasi 4%. Mana lebih ditakuti investor?"}
  options={
    ["Inflasi 4%",
    "Deflasi 2% — memicu penundaan belanja & spiral",
    "Sama saja",
    "Tidak ada yang takut"]
  }
  correct={1}
  explanation={"Benar: deflasi = konsumen menunggu (besok lebih murah) → demand collapse. Jepang 1990-an = trauma deflasi. Target sehat ~2–4%."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. r* = 2%, inflasi 6%, target inflasi 2%, output gap +2%. Suku bunga 'wajar' Taylor rule?"}
  options={
    ["8%",
    "10%",
    "11%",
    "6%"]}
  correct={2}
  explanation={"Benar: r = r* + π + 0,5×(π−π*) + 0,5×gap = 2 + 6 + 0,5×4 + 0,5×2 = 2+6+2+1 = 11%. Jika BI rate aktual jauh di bawah ini, kebijakan relatif longgar — atau pasar akan menuntut kenaikan."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Mikro</strong>: keseimbangan demand-supply; struktur pasar → pricing power → margin.</li>
<li><strong>Makro</strong>: GDP = C+I+G+NX; inflasi via CPI; siklus: ekspansi–puncak–kontraksi–lembah.</li>
<li><strong>Moneter</strong> (suku bunga) vs <strong>fiskal</strong> (belanja/pajak) — beda alat, beda lag.</li>
<li><strong>FX</strong>: apresiasi/depresiasi; cross-rate via mata uang bersama; rezim Indonesia = managed float.</li>
<li><strong>Komparatif</strong>: dagang yang opportunity cost-nya terendah.</li>
<li><strong>Selalu riil</strong>: kurangi inflasi sebelum memutuskan.</li>

<li><strong>Lerner:</strong> markup = −1/E — pricing power bisa dihitung, bukan sekadar 'feeling'.</li>
<li><strong>Taylor rule:</strong> jangkar kewajaran suku bunga; pasar bergerak oleh <em>kejutan vs ekspektasi</em>.</li>
<li><strong>FX:</strong> F* = S×(1+r_d)/(1+r_f); carry = premi risiko crash, bukan uang gratis.</li>
<li><strong>Kapan TIDAK pakai:</strong> jangan ramal pasar dari PDB absolut (pakai ekspektasi); jangan generalisasi efek kurs (petakan eksposur); jangan pakai paritas untuk trading harian.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a2-quant-methods" className="btn btn-secondary btn-sm">← PM-A2</Link>
        <Link href="/learn/pm-a4-financial-statements" className="btn btn-primary btn-sm">PM-A4 →</Link>
      </div>
    </div>
  );
}

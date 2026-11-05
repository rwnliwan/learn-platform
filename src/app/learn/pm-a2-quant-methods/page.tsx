"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmA2QuantMethodsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-A2 — Portfolio Management</span>
        <h1 className="display-title">Quant Methods:<br/>TVM, Statistik & Regresi Dasar</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Rp1 Miliar Hari Ini atau Rp50 Juta/Tahun Selamanya?</a></li>
<li><a href="#tvm">Time Value of Money</a></li>
<li><a href="#stat">Statistik & Hypothesis Testing</a></li>
<li><a href="#regresi">Regresi Dasar & Big Data</a></li>
<li><a href="#sintesis">Sintesis: Alur Kerja Analis</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Tawaran Pensiun Dini</a></li>
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
<li>Menghitung PV, FV, anuitas, dan EAR (termasuk keystroke BA II Plus).</li>
<li>Menjelaskan mean/median/modus, varians, korelasi, dan distribusi normal.</li>
<li>Melakukan langkah hypothesis testing (H0/Ha, test statistic, p-value, keputusan).</li>
<li>Menjelaskan intuisi regresi OLS, R², dan jebakan overfitting.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Rp1 Miliar Hari Ini atau Rp50 Juta/Tahun Selamanya?</h2>
      <div className="story">
        <p><strong>Dimas</strong> menang undian: pilih <strong>Rp1 miliar tunai</strong> atau <strong>Rp50 juta per tahun selamanya</strong>. Temannya bilang <em>&ldquo;ambil tahunan dong, selamanya!&rdquo;</em> Dimas ragu.</p>
<p>Twist-nya: dengan discount rate 8%, &ldquo;selamanya&rdquo; itu bernilai <strong>Rp625 juta hari ini</strong> (50jt/0,08) — <strong>kalah</strong> dari Rp1 miliar tunai! Uang punya <strong>nilai waktu</strong>: Rp1 hari ini ≠ Rp1 tahun depan. Kesalahan Dimas hampir saja = kesalahan investor yang tidak mendiskon arus kas masa depan. Lesson ini: TVM — fondasi semua valuasi (PM-B4 memakai ini untuk menilai seluruh perusahaan).</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="tvm">TVM — Uang Punya Nilai Waktu</h2>
<p><strong>Definisi.</strong> <strong>FV = PV(1+r)^N</strong> (compounding); <strong>PV = FV/(1+r)^N</strong> (discounting). <strong>Anuitas</strong>: PV = PMT × [1 − (1+r)^−N]/r. <strong>Perpetuitas</strong>: PV = PMT/r. <strong>EAR</strong> = (1 + r/m)^m − 1 (bandingkan bunga beda frekuensi). <strong>NPV</strong> = Σ CF_t/(1+r)^t − investasi; terima jika NPV &gt; 0. <strong>IRR</strong> = r saat NPV = 0; terima jika IRR &gt; required return.</p>
<p><strong>BA II Plus</strong>: N, I/Y, PV, PMT, FV — isi 4, cari 1. Tanda: arus masuk (+), keluar (−).</p>
<Tex math={String.raw`FV = PV(1+r)^N \quad;\quad PV_{anuitas} = PMT \times \frac{1-(1+r)^{-N}}{r} \quad;\quad EAR = \left(1+\frac{r}{m}\right)^m - 1`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`r`} />: rate per periode (diskon/bunga)</li>
<li><Tex math={String.raw`N`} />: jumlah periode</li>
<li><Tex math={String.raw`PMT`} />: pembayaran per periode (anuitas)</li>
<li><Tex math={String.raw`m`} />: frekuensi compounding per tahun</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> TVM seperti <strong>mesin waktu untuk uang</strong>: compounding membawa uang ke masa depan (membesar), discounting membawanya ke hari ini (menyusut). Suku bunga = 'harga sewa' mesin waktu itu.</p>
<p><strong>Kapan dipakai:</strong> Semua valuasi: obligasi (PM-A7), saham (PM-B4), proyek (PM-A5).</p>

<p><strong>Pendalaman intuisi &mdash; kenapa EAR selalu lebih besar dari nominal?</strong> Bunga nominal 12% <em>compounded monthly</em> memberi 1% per bulan. Tapi bulan kedua, bunga dihitung dari pokok <em>plus</em> bunga bulan pertama &mdash; &ldquo;bunga berbunga&rdquo;. EAR = (1,01)¹² &minus; 1 = <strong>12,68%</strong>, bukan 12%. Selisih 0,68% adalah <strong>harga dari frekuensi</strong>. Aturan praktis: <em>jangan pernah</em> membandingkan dua produk bunga dengan frekuensi berbeda tanpa mengubah ke EAR dulu &mdash; &ldquo;11,8% kuartalan&rdquo; vs &ldquo;12% bulanan&rdquo; dimenangkan yang bulanan (12,68% vs 12,33% EAR). <strong>Rule of 72:</strong> uang berlipat ganda dalam &asymp;72/r tahun (r dalam %) &mdash; 8% &rarr; 9 tahun.</p>
<details className="worked">
<summary>📐 Contoh: Undian Dimas (klik untuk buka)</summary>
<p><strong>Opsi B</strong> = perpetuitas Rp50jt/thn, r = 8%: PV = 50.000.000/0,08 = <strong>Rp625jt</strong>.</p>
<p><strong>Opsi A</strong> = Rp1M tunai. <strong>A menang telak.</strong></p>
<p><strong>BA II Plus</strong> (cek anuitas 20 thn Rp50jt): N=20, I/Y=8, PMT=50.000.000, FV=0 → CPT PV = −Rp490.907.420. Tanda negatif = arus keluar jika kamu yang membayar.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Cicilan KPR &mdash; anuitas beraksi</summary>
<p><strong>Soal:</strong> Pinjaman Rp500 juta, bunga nominal 12% <em>compounded monthly</em>, tenor 5 tahun. Berapa cicilan bulanan? Berapa total bunga?</p>
<p><strong>Langkah 1 &mdash; samakan periode:</strong> r_bulanan = 12%/12 = <strong>1%</strong>, N = 5&times;12 = <strong>60</strong>. (Jebakan klasik: memakai 12% tahunan dengan N = 60 &mdash; periode tidak konsisten!)</p>
<p><strong>Langkah 2 &mdash; rumus anuitas dibalik:</strong> PMT = PV &times; r / [1 &minus; (1+r)^&minus;N] = 500jt &times; 0,01 / [1 &minus; 1,01^&minus;60].</p>
<p><strong>Langkah 3 &mdash; hitung:</strong> 1,01^60 &asymp; 1,8167 &rarr; 1,01^&minus;60 &asymp; 0,5504 &rarr; penyebut = 0,4496 &rarr; PMT = 500jt &times; 0,022244 = <strong>Rp11,12 juta/bulan</strong>.</p>
<p><strong>Langkah 4 &mdash; total bunga:</strong> 60 &times; 11,12jt = Rp667,3jt &rarr; bunga = <strong>Rp167,3jt</strong> (33% dari pokok!). <strong>Moral:</strong> tenor panjang = cicilan ringan, bunga brutal &mdash; selalu hitung total bunga, bukan cuma cicilan.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3 (gaya CFA): NPV vs IRR &mdash; saat dua metrik bertengkar</summary>
<p><strong>Soal:</strong> dua proyek <em>mutually exclusive</em>, r = 10%. A: &minus;100, +120 (thn 1). B: &minus;1000, +1150 (thn 1). Pilih mana?</p>
<p><strong>Langkah 1 &mdash; NPV:</strong> A: &minus;100 + 120/1,1 = <strong>+9,09</strong>. B: &minus;1000 + 1150/1,1 = <strong>+45,45</strong>. &rarr; <strong>B menang</strong>.</p>
<p><strong>Langkah 2 &mdash; IRR:</strong> A: 120/100 &minus; 1 = <strong>20%</strong>. B: 1150/1000 &minus; 1 = <strong>15%</strong>. &rarr; <strong>A menang</strong>?!</p>
<p><strong>Keputusan: pilih B (ikut NPV).</strong> Penyebab konflik = <strong>beda skala</strong>: IRR adalah <em>persentase</em> (buta terhadap ukuran uang), NPV adalah <em>rupiah</em> (yang masuk kantong). Untuk proyek mutually exclusive, <strong>NPV selalu wasit terakhir</strong> &mdash; karena tujuanmu memaksimalkan kekayaan (rupiah), bukan persentase. (Satu-satunya pengecualian: keterbatasan modal &rarr; pakai <em>profitability index</em>.)</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Multiple IRR.</strong> Jika arus kas berubah tanda <strong>lebih dari sekali</strong> (mis. &minus;100, +250, &minus;150 &mdash; ada biaya penutupan di akhir), persamaan NPV = 0 bisa punya <strong>dua solusi IRR</strong>! Aturan Descartes: jumlah IRR &le; jumlah perubahan tanda. Untuk arus kas non-konvensional: <strong>jangan pakai IRR &mdash; pakai NPV</strong>. Soal CFA suka menyisipkan &ldquo;biaya reklamasi di tahun terakhir&rdquo; persis untuk menjebak ini.</p>
</div>
<PlotlyChart
  data={[{x: [0,5,10,15,20,25], y: [20,14.29,9.09,4.35,0,-4], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "NPV Proyek A"}, {x: [0,5,10,15,20,25], y: [150,95.24,45.45,0,-41.67,-80], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "NPV Proyek B"}, {x: [0,25], y: [0,0], type: "scatter", mode: "lines", line: {dash: "dash", color: "#7f7f7f"}, name: "NPV = 0"}]}
  title={"NPV Profile: dua proyek, dua cerita (r = discount rate %)"}
  layout={{xaxis: {title: "Discount rate (%)"}, yaxis: {title: "NPV"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = discount rate, sumbu Y = NPV. Titik potong garis dengan NPV=0 = <strong>IRR</strong> tiap proyek (A: 20%, B: 15%). Pada r = 10% (garis vertikal bayangan), baca NPV masing-masing.</p>
<p><strong>Interpretasi:</strong> Pada r = 10%, <strong>B di atas A</strong> (45,45 vs 9,09) &mdash; NPV memilih B. Tapi IRR (titik potong nol) memilih A (20% vs 15%). <strong>Chart ini adalah bukti visual konflik NPV vs IRR.</strong> Aturan: <em>mutually exclusive</em> &rarr; pilih NPV tertinggi, abaikan IRR. Perhatikan juga: makin tinggi discount rate, makin &ldquo;kejam&rdquo; ia pada proyek berdurasi panjang.</p>
</div>
<PlotlyChart
  data={[{x: [0,5,10,15,20,25,30], y: [100,147,179,217,263,318,385], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "FV @8%"}, {x: [0,5,10,15,20,25,30], y: [100,68,46,32,21,15,10], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "PV @8%"}]}
  title={"Rp100 tumbuh (FV) vs menyusut (PV) @ 8%"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Rp"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = Rp100 diinvestasikan (compounding); kuning = nilai hari ini dari Rp100 di masa depan (discounting).</p>
<p><strong>Interpretasi:</strong> Compounding <strong>eksponensial</strong> — Rp100 jadi Rp385 dalam 30 tahun. Discounting kebalikannya: Rp100 tiga puluh tahun lagi cuma Rp10 hari ini. Inilah kenapa 'growth masa depan' saham harus didiskon berat — dan kenapa suku bunga adalah variabel terpenting valuasi.</p>
</div>

<details className="worked">
<summary>📐 Contoh 4 (gaya CFA): Perpetuitas tumbuh &mdash; jembatan ke valuasi saham</summary>
<p><strong>Soal:</strong> saham membayar dividen tahun depan Rp1.000, tumbuh 5%/tahun selamanya. Required return 12%. Berapa nilai wajar? (Ini <strong>Gordon Growth Model</strong> &mdash; pratinjau PM-B4!)</p>
<p><strong>Langkah 1 &mdash; rumus:</strong> PV = D₁ / (r &minus; g).</p>
<p><strong>Langkah 2 &mdash; hitung:</strong> PV = 1.000 / (0,12 &minus; 0,05) = 1.000 / 0,07 = <strong>Rp14.286</strong>.</p>
<p><strong>Langkah 3 &mdash; uji sensitivitas:</strong> jika g = 6% (naik 1pp): PV = 1.000/0,06 = Rp16.667 (+17%!). Jika r = 13%: PV = 1.000/0,08 = Rp12.500 (&minus;12,5%). <strong>Valuasi growth sangat sensitif</strong> terhadap (r &minus; g) &mdash; selisih kecil di penyebut = ayunan besar di harga. Inilah kenapa analis growth &ldquo;bertengkar&rdquo; soal 1% asumsi.</p>
<p><strong>Syarat wajib:</strong> g &lt; r (jika g &ge; r, rumus meledak &rarr; model tidak valid &mdash; perusahaan tidak bisa tumbuh melebihi required return <em>selamanya</em>).</p>
</details>
<h2 id="stat">Statistik — Dari Rata-rata ke Keputusan</h2>
<p><strong>Definisi.</strong> <strong>Mean</strong> (sensitif outlier) vs <strong>median</strong> (robust) vs <strong>modus</strong>. <strong>Varians/σ</strong> = sebaran; <strong>CV</strong> = σ/mean (bandingkan risiko relatif). <strong>Korelasi</strong> −1 s.d. +1 (arah &amp; kekuatan hubungan linear). <strong>Distribusi normal</strong>: 68-95-99,7% dalam 1-2-3 σ; <strong>z = (x−μ)/σ</strong>.</p>
<p><strong>Hypothesis testing</strong>: (1) H0 vs Ha; (2) pilih α (biasanya 5%); (3) hitung test statistic; (4) bandingkan dengan critical value / p-value; (5) tolak H0 jika |stat| &gt; kritis atau p &lt; α. <strong>Type I</strong> = tolak H0 yang benar (false alarm); <strong>Type II</strong> = gagal tolak H0 yang salah (miss).</p>
<Tex math={String.raw`z = \frac{\bar{x}-\mu_0}{s/\sqrt{n}} \quad;\quad \text{tolak } H_0 \text{ jika } |z| > 1{,}96 \ (\alpha=5\%)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\bar{x}`} />: rata-rata sampel</li>
<li><Tex math={String.raw`\mu_0`} />: nilai hipotesis nol</li>
<li><Tex math={String.raw`s/\sqrt{n}`} />: standard error — makin besar n, makin presisi</li>
<li>1,96 = nilai kritis normal dua sisi pada α = 5%</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Hypothesis testing seperti <strong>sidang pengadilan</strong>: H0 = 'terdakwa tidak bersalah' (tidak ada efek). Bukti (data) harus cukup kuat (p &lt; 5%) untuk memvonis. Type I = menghukum orang tak bersalah; Type II = membebaskan yang bersalah.</p>
<p><strong>Kapan dipakai:</strong> Uji klaim: 'manajer ini skill atau hoki?' (PM-C5), 'strategi ini beda dari benchmark?' (PM-D5).</p>

<p><strong>Pendalaman intuisi &mdash; apa yang <em>sebenarnya</em> dikatakan p-value?</strong> p = 0,03 <strong>bukan</strong> &ldquo;probabilitas H0 benar = 3%&rdquo;. Yang benar: <em>jika</em> H0 benar, probabilitas melihat data <em>seekstrem ini</em> = 3%. Bedanya subtil tapi fatal: p-value berbicara tentang <strong>data</strong> (dengan asumsi H0), bukan tentang <strong>kebenaran H0</strong>. Akibatnya dua jebakan: (1) p &lt; 0,05 dengan efek <em>super kecil</em> + sampel raksasa = &ldquo;signifikan&rdquo; tapi <strong>tidak penting secara ekonomi</strong>; (2) p = 0,08 bukan &ldquo;tidak ada efek&rdquo; &mdash; hanya &ldquo;belum cukup bukti&rdquo;. <strong>Selalu laporkan besar efek + interval kepercayaan, bukan cuma bintang signifikansi.</strong></p>
<details className="worked">
<summary>📐 Contoh: Uji return manajer (klik untuk buka)</summary>
<p>H0: return = 0 (tidak ada skill). Sampel: mean 1,2%/bln, s = 4%, n = 36.</p>
<p><strong>z</strong> = 1,2/(4/√36) = 1,2/0,667 = <strong>1,80</strong> &lt; 1,96 → <strong>gagal tolak H0</strong> pada 5%.</p>
<p>Artinya: <em>belum cukup bukti</em> ia skilled — bukan bukti ia tidak skilled! (Kegagalan menolak ≠ penerimaan H0.) Dengan n = 100: z = 3,0 → tolak. <strong>Sampel kecil = sulit membuktikan skill.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Satu sisi vs dua sisi &mdash; pilihan yang mengubah vonis</summary>
<p><strong>Soal:</strong> sama seperti contoh uji manajer (mean 1,2%/bln, s = 4%, n = 36 &rarr; z = 1,80). Tapi manajer <em>mengklaim</em> return-nya <strong>positif</strong> (bukan sekadar &ldquo;beda dari nol&rdquo;). Uji satu sisi &alpha; = 5%.</p>
<p><strong>Langkah 1 &mdash; hipotesis:</strong> H0: &mu; &le; 0 vs Ha: &mu; &gt; 0 (satu sisi kanan).</p>
<p><strong>Langkah 2 &mdash; nilai kritis:</strong> satu sisi 5% &rarr; <strong>1,645</strong> (bukan 1,96!). Seluruh &ldquo;anggaran keraguan&rdquo; 5% ditaruh di satu ekor.</p>
<p><strong>Langkah 3 &mdash; vonis:</strong> z = 1,80 &gt; 1,645 &rarr; <strong>TOLAK H0</strong> &mdash; manajer terbukti skilled (pada 5%, satu sisi)!</p>
<p><strong>Pelajaran ganda:</strong> (1) data <em>sama</em>, kesimpulan <em>berbeda</em> &mdash; hanya karena pilihan satu/dua sisi. (2) <strong>Aturan mainnya:</strong> tentukan satu/dua sisi <em>sebelum</em> melihat data, berdasarkan <em>klaim yang diuji</em>. Mengganti ke satu sisi <em>setelah</em> melihat z = 1,80 (&ldquo;eh, pakai satu sisi saja biar lolos&rdquo;) = <strong>p-hacking</strong>, pelanggaran integritas analisis.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Kekuatan uji (power) &mdash; kenapa sampel kecil tidak adil</summary>
<p><strong>Soal:</strong> manajer benar-benar punya skill &mu; = 1,5%/bln, s = 4%. Berapa probabilitas uji dua sisi (n = 36, &alpha; = 5%) <em>berhasil mendeteksi</em> skill itu? (Ini = <strong>power</strong> = 1 &minus; P(Type II).)</p>
<p><strong>Langkah 1:</strong> standard error = 4/&radic;36 = 0,667%. <strong>Langkah 2:</strong> z_true = 1,5/0,667 = 2,25. <strong>Langkah 3:</strong> power = P(Z &gt; 1,96 &minus; 2,25) + P(Z &lt; &minus;1,96 &minus; 2,25) &asymp; P(Z &gt; &minus;0,29) &asymp; <strong>61%</strong>.</p>
<p><strong>Interpretasi:</strong> meski manajer <em>benar-benar skilled</em>, uji ini <strong>39% gagal mendeteksinya</strong> (Type II)! Dengan n = 100: SE = 0,4%, z = 3,75, power &asymp; 96%. <strong>Moral untuk analis:</strong> &ldquo;tidak signifikan&rdquo; pada sampel kecil <em>bukan</em> vonis &ldquo;tidak ada efek&rdquo; &mdash; bisa jadi ujimu yang kurang bertenaga. Selalu tanyakan: <em>berapa power-nya?</em></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Ekonomis signifikan&rdquo; vs &ldquo;statistik signifikan&rdquo;.</strong> Dengan n = 100.000, efek 0,01% bisa &ldquo;signifikan&rdquo; (p &lt; 0,001) &mdash; tapi <strong>tidak ada artinya secara ekonomi</strong> (biaya transaksi 0,05% sudah menelannya). Soal yang baik bertanya dua hal: (1) apakah signifikan? (2) apakah <em>material</em>? Jawaban (1) ya + (2) tidak = &ldquo;menarik secara statistik, abaikan secara praktis&rdquo;.</p>
</div>
<h2 id="regresi">Regresi — Garis yang Menjelaskan</h2>
<p><strong>Definisi.</strong> <strong>OLS</strong>: cari garis ŷ = b0 + b1x yang meminimalkan Σ residual². <strong>b1</strong> = kemiringan (efek x ke y); <strong>R²</strong> = % variasi y yang dijelaskan model (0–1). <strong>Asumsi klasik</strong>: linearitas, residual acak (homoskedastisitas), independen, normal (untuk inferensi).</p>
<p><strong>Big data (3V)</strong>: volume, velocity, variety — plus veracity. <strong>Fintech</strong>: robo-advisor, blockchain/DLT, crowdfunding. Jebakan: <strong>overfitting</strong> — model menghafal noise (R² tinggi di training, jeblok di data baru). → didalami di PM-B1 &amp; PM-B3.</p>
<Tex math={String.raw`\hat{y} = b_0 + b_1 x \quad;\quad b_1 = \frac{Cov(x,y)}{Var(x)} \quad;\quad R^2 = 1 - \frac{SSE}{SST}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`b_1`} />: slope — naik 1 satuan x, y naik b1</li>
<li><Tex math={String.raw`SSE`} />: sum of squared errors (yang diminimalkan OLS)</li>
<li><Tex math={String.raw`SST`} />: total variasi y</li>
<li>R² = 0,8: 80% gerakan y 'dijelaskan' x (bukan berarti x menyebabkan y!)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Regresi seperti <strong>menarik garis tren di awan titik</strong>: OLS mencari garis yang 'paling dekat' ke semua titik sekaligus (kuadrat = menghukum titik jauh ekstra). R² = seberapa rapat awannya di garis.</p>
<p><strong>Kapan dipakai:</strong> Beta saham (PM-A10/PM-D3), forecasting (MK15), attribution (PM-C5).</p>

<p><strong>Pendalaman intuisi &mdash; regresi buta terhadap kausasi.</strong> OLS hanya melihat <em>ko-gerakan</em>: &ldquo;saat x naik, y cenderung naik&rdquo;. Ia tidak tahu <em>mengapa</em>. Tiga cerita bisa menghasilkan garis yang sama: (a) x menyebabkan y; (b) y menyebabkan x (<em>reverse causality</em>); (c) z tersembunyi menyebabkan keduanya (<em>omitted variable</em> &mdash; mis. &ldquo;penjualan es krim vs tenggelam&rdquo; sama-sama disebabkan musim panas). <strong>Regresi menjawab &ldquo;berapa&rdquo;, bukan &ldquo;mengapa&rdquo;</strong> &mdash; klaim kausal butuh desain (eksperimen/instrumen), bukan sekadar R&sup2; tinggi. Inilah kenapa PM-B1 mendalami <em>misspecification</em>.</p>
<details className="worked">
<summary>📐 Contoh: Beta dari regresi (klik untuk buka)</summary>
<p>Regresi return saham (y) vs return pasar (x): ŷ = 0,002 + 1,3x, R² = 0,65.</p>
<p><strong>b1 = 1,3 = beta</strong>: pasar naik 1%, saham naik ~1,3% (agresif). <strong>R² = 0,65</strong>: 65% gerakan saham dijelaskan pasar; 35% idiosinkratis.</p>
<p>Pratinjau PM-D3: regresi inilah mesin CAPM &amp; Fama-French.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Prediksi + interval &mdash; regresi yang jujur</summary>
<p><strong>Soal:</strong> model ŷ = 0,002 + 1,3x (x = return pasar). Jika pasar naik 2% bulan depan, prediksi return saham? Seberapa percaya diri kita?</p>
<p><strong>Langkah 1 &mdash; prediksi titik:</strong> ŷ = 0,002 + 1,3 &times; 0,02 = 0,002 + 0,026 = <strong>2,8%</strong>.</p>
<p><strong>Langkah 2 &mdash; ketidakpastian:</strong> R&sup2; = 0,65 &rarr; 35% variasi <em>tidak</em> dijelaskan model. Prediksi 2,8% adalah <em>rata-rata bersyarat</em> &mdash; realisasinya bisa jauh (residual!). Analis profesional menyertakan <strong>interval prediksi</strong>, bukan cuma titik.</p>
<p><strong>Langkah 3 &mdash; batas validitas:</strong> model diestimasi dari data pasar &plusmn;5%. Jika pasar <em>crash</em> &minus;20% (di luar rentang data), prediksi ŷ = 0,002 + 1,3&times;(&minus;0,20) = &minus;25,8% adalah <strong>ekstrapolasi</strong> &mdash; hubungan linear bisa jebol saat krisis (beta tidak konstan!). <strong>Jangan percaya prediksi di luar wilayah data.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: R&sup2; 0,99 yang menipu &mdash; regresi palsu (spurious)</summary>
<p><strong>Soal:</strong> regresi &ldquo;jumlah stork di desa&rdquo; (x) vs &ldquo;angka kelahiran&rdquo; (y) menghasilkan R&sup2; = 0,92, slope signifikan. Kesimpulan?</p>
<p><strong>Jawaban: tidak ada kesimpulan kausal.</strong> Ini contoh klasik <em>spurious regression</em> &mdash; kedua variabel naik bersama karena <strong>variabel ketiga</strong>: pembangunan desa (desa maju &rarr; lebih banyak stork bertahan <em>dan</em> fasilitas bersalin lebih baik). Korelasi tinggi + signifikansi &ldquo;sempurna&rdquo; <strong>tidak membuktikan</strong> stork mengantar bayi.</p>
<p><strong>Versi pasar modalnya:</strong> dua harga saham yang sama-sama <em>trending</em> naik akan berkorelasi tinggi &mdash; regresi &ldquo;signifikan&rdquo; padahal keduanya cuma ikut tren (non-stasioner!). Inilah kenapa PM-B2 mewajibkan uji <em>unit root</em> sebelum regresi time series. <strong>R&sup2; tinggi tanpa teori &amp; tanpa uji asumsi = angka kosong.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Ekstrapolasi.</strong> Model regresi hanya valid di <strong>rentang data estimasi</strong>. Memprediksi return saat pasar &minus;20% dari model yang diestimasi pada &plusmn;5% = ekstrapolasi &mdash; dan hubungan bisa <em>nonlinear</em> di ekstrem (beta naik saat krisis!). Soal CFA menandai ini dengan frasa &ldquo;<em>outside the range of observed data</em>&rdquo; &mdash; itu sinyal jawaban &ldquo;prediksi tidak reliabel&rdquo;.</p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: T&ndash;S&ndash;R, Alur Kerja Analis</h2>
      <p>TVM, Statistik, dan Regresi adalah <strong>satu alur kerja berurutan</strong>, bukan tiga bab lepas:</p>
      <ol>
        <li><strong>TVM &mdash; samakan &ldquo;waktu&rdquo; uang.</strong> Semua arus kas masa depan ditarik ke hari ini (PV) atau didorong ke masa depan (FV) dengan <em>discount rate</em> yang konsisten. Tanpa ini, kamu membandingkan apel (2026) dengan jeruk (2036).</li>
        <li><strong>Statistik &mdash; uji apakah pola itu nyata.</strong> Return 1,2%/bulan: skill atau noise? Uji hipotesis + interval kepercayaan memisahkan <em>sinyal</em> dari <em>kebetulan</em> &mdash; dengan disiplin p-value dan power yang jujur.</li>
        <li><strong>Regresi &mdash; modelkan hubungannya.</strong> Setelah yakin ada sinyal, regresi mengukurnya: beta = 1,3, R&sup2; = 0,65. Model ini lalu dipakai untuk <strong>prediksi</strong> &mdash; yang hasilnya <em>kembali</em> didiskon via TVM (ekspektasi return masa depan &rarr; PV hari ini).</li>
      </ol>
      <p><strong>Lingkaran penuh analis:</strong> TVM memberi <em>harga waktu</em>, statistik memberi <em>keyakinan</em>, regresi memberi <em>model</em> &mdash; dan model dipakai untuk memproyeksikan kas masa depan yang <em>kembali</em> dinilai dengan TVM. Kuasai lingkarannya, kuasai separuh CFA Level I.</p>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Rata-rata (mean) selalu mewakili data. Median itu 'versi malas'.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Mean <strong>diseret outlier</strong>: return [5%, 6%, 4%, 5%, −80%] mean-nya −12% — tidak mewakili apa pun. Median (5%) robust. Untuk data return yang skew (banyak strategi!), <strong>laporkan keduanya</strong> atau pakai geometric mean.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;p-value &lt; 5% berarti hipotesis alternatif 95% benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> p-value = P(data seekstrem ini | H0 benar) — <strong>bukan</strong> P(Ha benar). p = 4% artinya: jika H0 benar, data seperti ini muncul 4% dari waktu. Itu saja. '95% yakin' adalah misinterpretasi paling umum di seluruh sains.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Korelasi 0 berarti tidak ada hubungan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> korelasi Pearson = 0 hanya berarti <strong>tidak ada hubungan <em>linear</em></strong>. Contoh: y = x&sup2; untuk x &isin; [&minus;10, 10] &mdash; hubungan <em>sempurna</em> (deterministik!) tapi korelasi &asymp; 0 karena simetris. <strong>Selalu plot data</strong>: pola U, parabola, atau <em>cluster</em> tak terlihat dari satu angka korelasi. Inilah gunanya <em>scatter plot</em> sebelum regresi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;IRR lebih tinggi = proyek lebih baik, selalu.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> hanya untuk proyek <strong>independen</strong> vs <em>hurdle rate</em>. Untuk <em>mutually exclusive</em> beda skala/durasi, IRR bisa menyesatkan (contoh 3 TVM di atas). Ditambah: IRR mengasumsikan <strong>reinvestasi pada tingkat IRR itu sendiri</strong> &mdash; asumsi yang tidak realistis untuk IRR 40%. NPV mengasumsikan reinvestasi pada <em>cost of capital</em> &mdash; jauh lebih masuk akal.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>BA II Plus: tanda arus kas.</strong> Investasi (keluar) = negatif, terima = positif. Hasil negatif bukan 'rugi' — melainkan arah. 90% error TVM di ujian = salah tanda, bukan salah rumus.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Geometric mean untuk return multi-periode.</strong> Return +50% lalu −50% = rugi 25%, bukan 0%! Arithmetic mean (0%) berbohong; geometric (−13,4%) jujur. Untuk kinerja historis, selalu geometric.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Anscombe&rsquo;s Quartet &mdash; empat dataset, statistik identik, cerita beda total.</strong> Empat dataset bisa punya mean, varians, korelasi, <em>dan</em> garis regresi yang <strong>persis sama</strong> &mdash; tapi scatter plot-nya: satu linear normal, satu parabola, satu outlier ekstrem, satu garis vertikal. <strong>Angka ringkasan bisa berbohong; plot tidak.</strong> Aturan: tidak ada regresi tanpa scatter plot. (Coba di Lab: plot residual vs fitted &mdash; pola corong = heteroskedastisitas!)</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator TVM Lengkap</h2>
<p>Hitung FV, PV, anuitas, perpetuitas, dan EAR. Cek silang dengan BA II Plus.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator TVM"}
  hint={"Ubah FREQ 1 -> 12 (compounding bulanan). EAR naik — itulah harga 'bunga berbunga lebih sering'."}
  defaultCode={"# Kalkulator TVM\nPV, R, N, PMT, FREQ = 1_000_000_000, 0.08, 20, 50_000_000, 1  # ubah sesukamu\n\nfv = PV * (1 + R)**N\npv_ann = PMT * (1 - (1 + R)**(-N)) / R\npv_perp = PMT / R\near = (1 + R/FREQ)**FREQ - 1\n\nprint(f\"PV Rp{PV/1e9:.2f}M, r={R:.0%}, N={N}, PMT Rp{PMT/1e6:.0f}jt\")\nprint(f\"  FV lump sum   : Rp{fv/1e9:.3f} M\")\nprint(f\"  PV anuitas    : Rp{pv_ann/1e9:.3f} M\")\nprint(f\"  PV perpetuitas: Rp{pv_perp/1e9:.3f} M\")\nprint(f\"  EAR (m={FREQ})      : {ear:.4%}\")\nprint(\"\\nUndian Dimas: perpetuitas Rp50jt @8% = Rp625jt < Rp1M tunai.\")\nprint(\"Keputusan: ambil tunai!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator Z-Test</h2>
<p>Bangkitkan dua sampel return, hitung z-stat, dan putuskan: skill atau noise?</p>
<PyodideLab
  title={"Lab 2 — Simulator Hypothesis Test"}
  hint={"Ubah N 36 -> 144 (12 tahun data). z naik 2x lipat — bukti makin kuat dengan sampel besar."}
  defaultCode={"import random, math\nrandom.seed(42)\n# H0: mean return = 0. Sampel: mean 1.2%/bln, sd 4%\nN, MU, SD = 36, 1.2, 4.0   # ubah N sesukamu\nsampel = [random.gauss(MU, SD) for _ in range(N)]\n\nxbar = sum(sampel)/N\ns = math.sqrt(sum((x-xbar)**2 for x in sampel)/(N-1))\nz = (xbar - 0) / (s/math.sqrt(N))\nkritis = 1.96\n\nprint(f\"n={N}, mean={xbar:.2f}%, s={s:.2f}%\")\nprint(f\"z-stat = {z:.2f}  (kritis 5% dua sisi: {kritis})\")\nprint(f\"Keputusan: {'TOLAK H0 - ada bukti skill' if abs(z) > kritis else 'GAGAL TOLAK H0 - belum terbukti skill'}\")\nprint(\"\\nIngat: gagal tolak != H0 benar. Mungkin sampel kurang besar.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Bunga dikutip beda frekuensi → <strong>Bandingkan EAR, bukan nominal</strong></h3>
<p><strong>Kenapa:</strong> 12% bulanan (EAR 12,68%) &gt; 12% tahunan. Nominal menipu.</p>
<p><strong>Contoh nyata:</strong> Pilih deposito/KTA termurah.</p>
</div>
<div className="decision-card">
<h3>2. Return multi-periode → <strong>Geometric mean</strong></h3>
<p><strong>Kenapa:</strong> Arithmetic mean melebih-lebihkan (volatility drag).</p>
<p><strong>Contoh nyata:</strong> +50%, −50% = −13,4% p.a., bukan 0%.</p>
</div>
<div className="decision-card">
<h3>3. Data skew / outlier → <strong>Median + mean; laporkan keduanya</strong></h3>
<p><strong>Kenapa:</strong> Mean terseret outlier.</p>
<p><strong>Contoh nyata:</strong> Gaji, return strategi berekor tebal.</p>
</div>
<div className="decision-card">
<h3>4. Klaim 'strategi mengalahkan pasar' → <strong>Hypothesis test (α=5%)</strong></h3>
<p><strong>Kenapa:</strong> Bedakan skill vs hoki secara formal.</p>
<p><strong>Contoh nyata:</strong> Uji alpha manajer (PM-C5).</p>
</div>
<div className="decision-card">
<h3>5. Proyek mutually exclusive (beda skala/durasi) → <strong>NPV, bukan IRR</strong></h3>
<p><strong>Kenapa:</strong> IRR buta skala &amp; berasumsi reinvestasi pada IRR sendiri.</p>
<p><strong>Contoh nyata:</strong> A (IRR 20%, NPV 9) vs B (IRR 15%, NPV 45) → pilih B.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Diskon selalu</strong> — bandingkan dalam nilai hari ini.</li><li><strong>EAR</strong> untuk bandingkan bunga.</li><li><strong>Geometric</strong> untuk return multi-periode.</li><li><strong>p &lt; α</strong> baru tolak H0.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Tawaran Pensiun Dini</h2>
<div className="callout">
<p>Pak Budi (55 thn) ditawari: <strong>Rp2M lump sum</strong> atau <strong>Rp15jt/bulan selama 20 tahun</strong>. Discount rate 7%/tahun.</p>
<p><strong>Vignette lanjutan.</strong> Pak Budi (55 thn) ditawari: <strong>Rp2M lump sum</strong> atau <strong>Rp15jt/bulan selama 20 tahun</strong>. Discount rate 7%/tahun. Ayah Pak Budi meninggal di usia 95 &mdash; ia yakin gen umur panjang menurun padanya. Ia juga punya deposito yang bisa di-<em>roll</em> bulanan di 7% nominal.</p>
<p><strong>Pertanyaan:</strong> (a) Hitung PV anuitas (bulanan!). (b) Mana lebih baik secara finansial murni? (c) Bagaimana <em>longevity risk</em> (risiko umur panjang) mengubah analisis? (d) Jika discount rate memakai EAR vs nominal, apa bedanya? (e) Keputusan akhirmu untuk Pak Budi &mdash; dan satu angka yang <em>paling</em> ingin kamu verifikasi?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Bulanan:</strong> r = 7%/12 = 0,5833%, N = 240. PV = 15jt × [1 − (1,005833)^−240]/0,005833 = 15jt × 129,33 = <strong>Rp1,94M</strong>.</p>
<p>(b) <strong>Lump sum Rp2M menang</strong> (tipis: +Rp60jt). Plus fleksibilitas &amp; warisan.</p>
<p>(c) Jika <strong>discount rate &lt; ~6,7%</strong> anuitas menang; jika Pak Budi yakin <strong>hidup &gt; 20 tahun</strong> (<em>longevity risk</em>!), anuitas = asuransi umur panjang &mdash; nilai non-finansial yang TVM tidak tangkap.</p>
<p>(d) <strong>Longevity mengubah segalanya.</strong> PV di (a) mengasumsikan pembayaran <em>berhenti</em> di tahun ke-20. Jika Pak Budi hidup sampai 90 (35 tahun pensiun!), anuitas 20 tahun <em>habis</em> di usia 75 &mdash; ia butuh dana 15 tahun lagi entah dari mana. Ironisnya, <strong>semakin panjang umur (kabar baik), semakin buruk pilihan lump sum yang tidak dikelola</strong>. Anuitas = transfer <em>longevity risk</em> ke pemberi tawaran. Nilai ini tidak tertangkap PV &mdash; TVM mengukur <em>uang</em>, bukan <em>ketidakpastian hidup</em>.</p>
<p>(e) <strong>EAR vs nominal:</strong> 7% nominal bulanan &rarr; EAR = (1+0,07/12)¹²&minus;1 = <strong>7,23%</strong>. Jika deposito Pak Budi 7% <em>efektif tahunan</em>, maka discount rate bulanan yang konsisten = (1,07)^(1/12)&minus;1 = 0,5654% (bukan 0,5833%!). PV anuitas dengan EAR yang benar sedikit <em>lebih tinggi</em> (&asymp;Rp1,96M) &mdash; beda kecil, tapi menunjukkan <strong>disiplin periode</strong>: campur nominal/EAR = jawaban salah yang terlihat benar.</p>
<p><strong>Keputusan akhir:</strong> jika Pak Budi disiplin investasi &amp; khawatir umur panjang &rarr; <strong>anuitas</strong> (asuransi longevity + tidak perlu mengelola). Jika ia investor ulung yang yakin return &gt; 7% &rarr; lump sum. <strong>Satu angka yang wajib diverifikasi: apakah &ldquo;20 tahun&rdquo; itu pasti dibayar penuh</strong> (atau berhenti jika meninggal?) &mdash; anuitas yang berhenti saat meninggal vs <em>guaranteed</em> 20 tahun = dua produk berbeda dengan PV berbeda!</p>
</details>
</div>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Duel EAR</h3>
      <p>Deposito A: 12% nominal <em>compounded monthly</em>. Deposito B: 11,8% nominal <em>compounded quarterly</em>. Mana lebih baik?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>EAR_A = (1+0,12/12)¹² &minus; 1 = <strong>12,68%</strong>. EAR_B = (1+0,118/4)⁴ &minus; 1 = 1,0295⁴ &minus; 1 = <strong>12,33%</strong>. <strong>A menang</strong> &mdash; meski selisih nominal cuma 0,2%, selisih EAR 0,35%. Jangan pernah bandingkan nominal beda frekuensi!</p>
      </details>
      <h3>Drill 2 &mdash; Uji cepat</h3>
      <p>Sampel n = 100, mean return 0,8%/bln, s = 5%. Uji H0: &mu; = 0 (dua sisi, &alpha; = 5%). Simpulkan.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>SE = 5/&radic;100 = 0,5%. z = 0,8/0,5 = <strong>1,60</strong> &lt; 1,96 &rarr; <strong>gagal tolak H0</strong>. Belum cukup bukti ada return positif &mdash; <em>bukan</em> bukti return-nya nol. (Catatan: dengan n = 400, z = 3,2 &rarr; tolak &mdash; power matters!)</p>
      </details>
      <h3>Drill 3 &mdash; Baca output regresi</h3>
      <p>Model: ŷ = 1 + 2,5x, R&sup2; = 0,81, n = 50. (a) Prediksi untuk x = 4. (b) Interpretasi R&sup2;. (c) Satu peringatan.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>(a) ŷ = 1 + 2,5&times;4 = <strong>11</strong>. (b) <strong>81% variasi y dijelaskan model</strong> &mdash; sisanya 19% residual. (c) <strong>R&sup2; tinggi ≠ kausalitas</strong> &mdash; dan cek dulu x = 4 masih dalam rentang data (jangan ekstrapolasi!).</p>
      </details>
      <h3>Drill 4 &mdash; Vignette kilat</h3>
      <p>Manajer mengklaim &ldquo;strategi kami return 25% p.a.&rdquo; berdasarkan <em>backtest</em> 3 tahun yang ia <em>optimasi</em> hingga bagus. Dua pelanggaran standar + satu masalah statistik. Sebutkan.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>I(C)</strong> <em>Misrepresentation</em> (backtest disajikan seolah return aktual) + <strong>III(D)</strong> <em>Performance Presentation</em>. Masalah statistik: <strong>overfitting / data snooping</strong> &mdash; mengoptimasi parameter hingga backtest bagus = menghafal noise masa lalu, bukan menemukan sinyal.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Rp50jt/tahun selamanya, discount 8%. PV?"}
  options={
    ["Rp625 juta",
    "Rp1 miliar",
    "Rp400 juta",
    "Tidak terhingga"]
  }
  correct={0}
  explanation={"Benar: perpetuitas PV = PMT/r = 50jt/0,08 = Rp625jt. 'Selamanya' terdengar besar, tapi discounting membuatnya terbatas."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Return +50% lalu −50%. Return tahunan yang jujur?"}
  options={
    ["0% (rata-rata)",
    "−13,4% (geometric)",
    "+25%",
    "−25%"]
  }
  correct={1}
  explanation={"Benar: (1,5×0,5)^0,5 − 1 = −13,4%. Modal Rp100 → Rp150 → Rp75. Arithmetic mean 0% berbohong; geometric mengikuti uangmu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. z-stat 1,80, α=5% dua sisi (kritis 1,96). Keputusan?"}
  options={
    ["Tolak H0 — terbukti",
    "Gagal tolak H0 — belum cukup bukti",
    "Terima H0",
    "Ulangi dengan α=10%"]
  }
  correct={1}
  explanation={"Benar: 1,80 &lt; 1,96 → gagal tolak. 'Gagal tolak' ≠ 'H0 benar' — mungkin sampel kurang besar (dengan n=100, z=3,0 → tolak)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Regresi return saham vs pasar: slope 1,3, R² 0,65. Artinya?"}
  options={
    ["Beta 1,3; 65% gerakan dijelaskan pasar",
    "Alpha 1,3",
    "Korelasi 0,65",
    "Saham naik 65%"]
  }
  correct={0}
  explanation={"Benar: slope = beta (agresif, &gt;1); R² = explanatory power. 35% sisanya = risiko idiosinkratis (bisa didiversifikasi)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. p-value = 0,03. Interpretasi benar?"}
  options={
    ["95% yakin Ha benar",
    "Jika H0 benar, data seekstrem ini muncul 3% dari waktu",
    "H0 3% benar",
    "Efeknya besar"]
  }
  correct={1}
  explanation={"Benar: p-value = probabilitas data (atau lebih ekstrem) dengan asumsi H0 benar. Bukan probabilitas hipotesis benar, bukan ukuran efek."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Proyek A: -100, +120 (thn 1). Proyek B: -1000, +1150 (thn 1). Mutually exclusive, r = 10%. Keputusan?"}
  options={
    ["Pilih A — IRR 20% > 15%",
    "Pilih B — NPV 45,45 > 9,09 (NPV wasit terakhir)",
    "Pilih A — modal lebih kecil",
    "Tolak keduanya — IRR < 25%"]}
  correct={1}
  explanation={"Benar: NPV A = 9,09, NPV B = 45,45 → B menang. IRR menyesatkan di sini karena beda skala (IRR buta terhadap ukuran rupiah). Untuk mutually exclusive: NPV selalu menang atas IRR."}
/>

      {/* 11b. KAMUS RUMUS */}
      <h2 id="kamus">📖 Kamus Rumus Kilat</h2>
      <div className="callout">
      <ul>
      <li><strong>FV / PV:</strong> FV = PV(1+r)<sup>N</sup>; PV = FV/(1+r)<sup>N</sup></li>
      <li><strong>Anuitas:</strong> PV = PMT &times; [1 &minus; (1+r)<sup>&minus;N</sup>]/r; <strong>perpetuitas:</strong> PV = PMT/r; <strong>tumbuh:</strong> PV = PMT₁/(r&minus;g)</li>
      <li><strong>EAR:</strong> (1+r/m)<sup>m</sup> &minus; 1 &mdash; selalu samakan periode!</li>
      <li><strong>NPV:</strong> &Sigma; CF<sub>t</sub>/(1+r)<sup>t</sup> &minus; I₀ &gt; 0 &rarr; terima; <strong>IRR:</strong> r saat NPV = 0</li>
      <li><strong>z-test:</strong> z = (x&#772;&minus;&mu;₀)/(s/&radic;n); tolak H₀ jika |z| &gt; 1,96 (&alpha;=5%, dua sisi)</li>
      <li><strong>Regresi:</strong> b₁ = Cov(x,y)/Var(x); R&sup2; = 1 &minus; SSE/SST</li>
      </ul>
      <p><strong>Cara pakai:</strong> screenshot &mdash; ini &ldquo;contekan legal&rdquo; untuk drill &amp; ujian.</p>
      </div>

      <h3>🧪 Eksperimen Pikiran (uji pemahamanmu)</h3>
      <p><strong>(1) Mesin waktu bunga.</strong> Bank A menawarkan 8% <em>compounded annually</em>; Bank B 7,9% <em>compounded daily</em>. Mana lebih baik? (Jawab: EAR_B = (1+0,079/365)³⁶⁵&minus;1 &asymp; 8,22% &gt; 8% &rarr; <strong>B menang</strong> &mdash; frekuensi mengalahkan nominal!)</p>
      <p><strong>(2) Manajer 100 monyet.</strong> 100 manajer &ldquo;random&rdquo; (tanpa skill) diuji pada &alpha; = 5%. Berapa yang <em>terlihat</em> skilled padahal cuma hoki? (Jawab: &asymp;5 &mdash; inilah <strong>multiple testing problem</strong>: menguji banyak manajer/strategi tanpa koreksi = menemukan &ldquo;bintang&rdquo; palsu. Solusi: Bonferroni atau FDR &mdash; lihat PM-A2 lanjutan &amp; PM-D4.)</p>
      <p><strong>(3) Garis sempurna.</strong> Kamu meregresi harga saham harian (y) terhadap <em>tanggal</em> (x) dan dapat R&sup2; = 0,97. Apakah kamu menemukan mesin uang? (Jawab: <strong>tidak</strong> &mdash; itu cuma tren waktu; regresi y terhadap tren deterministik selalu &ldquo;bagus&rdquo;. Yang bisa diprediksi dari tren masa lalu <em>sudah</em> tercermin di harga hari ini. <strong>Tren ≠ sinyal trading.</strong>)</p>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>TVM</strong>: FV = PV(1+r)^N; anuitas; perpetuitas PMT/r; EAR; NPV &gt; 0 terima; IRR &gt; hurdle terima.</li>
<li><strong>Statistik</strong>: mean vs median (outlier!); σ; korelasi; z = (x−μ)/σ; 68-95-99,7.</li>
<li><strong>Hypothesis test</strong>: H0/Ha → α → statistik → bandingkan; Type I = false alarm, Type II = miss.</li>
<li><strong>Regresi OLS</strong>: ŷ = b0+b1x; b1 = Cov/Var; R² = explanatory power (bukan kausalitas!).</li>
<li><strong>Big data 3V</strong> + waspada <strong>overfitting</strong>.</li>
<li><strong>Kapan TIDAK pakai mean</strong>: data skew — pakai median/geometric.</li>

<li><strong>EAR</strong> untuk bandingkan bunga beda frekuensi; <strong>NPV &gt; IRR</strong> untuk mutually exclusive; <strong>multiple IRR</strong> → pakai NPV.</li>
<li><strong>p-value</strong> bicara tentang data (bukan kebenaran H0); <strong>power</strong> menentukan apakah 'tidak signifikan' berarti apa-apa.</li>
<li><strong>Regresi</strong>: R&sup2; tinggi ≠ kausalitas; jangan ekstrapolasi; plot dulu sebelum percaya.</li>
<li><strong>Kapan TIDAK pakai</strong>: IRR untuk arus kas non-konvensional; uji hipotesis tanpa cek power &amp; ukuran efek; regresi pada data non-stasioner tanpa uji unit root.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-a1-ethics" className="btn btn-secondary btn-sm">← PM-A1</Link>
        <Link href="/learn/pm-a3-economics" className="btn btn-primary btn-sm">PM-A3 →</Link>
      </div>
    </div>
  );
}

"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk14PricingPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK14 — Marketing Data Analytics</span>
        <h1 className="display-title">Pricing & Promosi:<br/>Elastisitas, Lift, dan Kanibalisasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Promo 50% yang 'Sukses' — dan Merugi</a></li>
<li><a href="#elastisitas">Elastisitas Harga</a></li>
<li><a href="#promo">Promo Lift & ROI</a></li>
<li><a href="#kanibal">Kanibalisasi</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Harga yang Tepat</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Diskon 50% KriukKu</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#megapricing">💰 Mega-Studi Kasus: Strategi Harga E-commerce</a></li>
<li><a href="#psychology">📊 Pricing Psychology Mendalam</a></li>
<li><a href="#kisahharga">📖 Kisah Nyata: Perang Harga di E-commerce</a></li>
<li><a href="#kisahpromo">📖 Kisah Nyata: Promo yang Hampir Membunuh Brand</a></li>
<li><a href="#tambahan-optimal">📐 Worked Example: Harga Optimal</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Diskon Ganda</a></li>
<li><a href="#tambahan-faq">❓ FAQ Pricing</a></li>
<li><a href="#tambahan-kit">🧰 Kit Kerja: Audit Pricing 1 Jam</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menghitung elastisitas harga (arc) dan mengklasifikasikan elastic vs inelastic.</li>
<li>Membedakan penjualan promo vs baseline dan menghitung lift yang benar.</li>
<li>Menghitung ROI promo termasuk biaya forward buying & kanibalisasi.</li>
<li>Menjelaskan kapan promo menguntungkan vs kapan ia 'membeli' penjualan sendiri.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Promo 50% yang 'Sukses' — dan Merugi</h2>
      <div className="story">
        <p>Brand snack <em>&ldquo;KriukKu&rdquo;</em> mengadakan promo <strong>diskon 50%</strong> seminggu. Penjualan <strong>naik 300%</strong>! Tim trade marketing merayakan: <em>&ldquo;Promo tersukses tahun ini!&rdquo;</em> Lalu finance datang dengan hitungannya: <strong>rugi Rp800 juta</strong>.</p>
<p>Twist-nya berlapis. <strong>Pertama</strong>: separuh &ldquo;kenaikan&rdquo; adalah <strong>forward buying</strong> — pelanggan menyetok untuk 2 bulan, penjualan minggu depan anjlok. <strong>Kedua</strong>: snack varian lain (margin lebih tinggi) <strong>termakan</strong> (kanibalisasi). <strong>Ketiga</strong>: harga referensi pelanggan turun — minggu berikutnya harga normal terasa &ldquo;mahal&rdquo;. <strong>Promo bukan soal volume — soal profit inkremental bersih.</strong> Lesson ini: matematika promo yang jujur.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="elastisitas">Elastisitas — Seberapa 'Tersinggung' Demand oleh Harga</h2>
<p><strong>Definisi.</strong> <strong>Elastisitas harga</strong> = % perubahan quantity dibagi % perubahan harga. <strong>|E| &gt; 1</strong> = elastis (demand sensitif — cocok promo); <strong>|E| &lt; 1</strong> = inelastis (tidak sensitif — promo buang margin). <strong>Arc elasticity</strong> memakai rata-rata sebagai basis (untuk perubahan besar); <strong>point elasticity</strong> dari kurva demand (untuk perubahan kecil).</p>
<p>Aturan profit: jika |E| &gt; 1, turunkan harga → revenue naik. Jika |E| &lt; 1, <em>naikkan</em> harga → revenue naik (dan margin naik!). Kebanyakan brand takut menaikkan harga padahal produknya inelastis.</p>
<Tex math={String.raw`E_{arc} = \frac{(Q_2 - Q_1)/((Q_2+Q_1)/2)}{(P_2 - P_1)/((P_2+P_1)/2)}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`E_{arc}`} />: elastisitas busur — negatif (harga naik → quantity turun)</li>
<li><Tex math={String.raw`Q_1, Q_2`} />: quantity sebelum &amp; sesudah perubahan harga</li>
<li><Tex math={String.raw`P_1, P_2`} />: harga sebelum &amp; sesudah</li>
<li>Basis rata-rata: adil untuk perubahan besar (tidak tergantung arah)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Elastisitas seperti <strong>mengukur 'baper'-nya pelanggan</strong>: produk elastis = pelanggan baper (naik Rp1.000 langsung pindah merek); inelastis = cuek (bensin, obat — butuh ya beli). Promo untuk yang baper; <em>naikkan harga</em> untuk yang cuek.</p>
<p><strong>Kapan dipakai:</strong> Setiap keputusan harga/promo. Estimasi dari histori (regresi log-log) atau eksperimen harga (MK9).</p>
<details className="worked">
<summary>📐 Contoh: Elastisitas KriukKu (klik untuk buka)</summary>
<p>Harga Rp10.000 → Rp8.000 (−20%). Quantity 10.000 → 16.000 (+60%).</p>
<p><strong>Arc:</strong> %ΔQ = 6.000/13.000 = 46,2%; %ΔP = −2.000/9.000 = −22,2%. E = 46,2/−22,2 = <strong>−2,08</strong> → |E| &gt; 1 = <strong>elastis</strong>.</p>
<p><strong>Revenue:</strong> sebelum Rp100jt → sesudah Rp128jt (+28%). Tapi <strong>profit</strong>? Margin/unit Rp3.000 → Rp1.000. Profit: 10.000×3.000 = Rp30jt → 16.000×1.000 = Rp16jt. <strong>Revenue naik, profit anjlok 47%!</strong> Inilah kenapa elastisitas tanpa margin = jebakan.</p>
</details>
<PlotlyChart
  data={[{x: [8000,9000,10000,11000,12000], y: [16000,13000,10000,7500,5500], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "demand"}]}
  title={"Kurva demand KriukKu"}
  layout={{xaxis: {title: "Harga (Rp)"}, yaxis: {title: "Quantity"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = harga, Y = quantity terjual. Kemiringan = sensitivitas.</p>
<p><strong>Interpretasi:</strong> Kurva landai (elastis): turun harga Rp2.000 → quantity +6.000. Tapi ingat worked example: quantity naik ≠ profit naik. Selalu kalikan dengan margin — kurva profit (bukan demand) yang menentukan keputusan.</p>
</div>
<h2 id="promo">Promo Lift — Penjualan 'Tambahan' yang Semu</h2>
<p><strong>Definisi.</strong> <strong>Baseline</strong> = penjualan tanpa promo (dari model/ histori). <strong>Lift</strong> = (promo − baseline)/baseline. <strong>Forward buying</strong>: pelanggan menyetok saat promo → penjualan <em>setelah</em> promo anjlok (dipinjam dari masa depan). <strong>Stockpiling</strong> versi konsumen menimbun.</p>
<p><strong>ROI promo yang jujur</strong> = (margin inkremental − biaya promo) / biaya promo, dengan inkremental = lift − forward buying − kanibalisasi. Promo &ldquo;300%&rdquo; KriukKu setelah koreksi: lift bersih cuma 40%.</p>
<Tex math={String.raw`\text{Lift}_{bersih} = \frac{Q_{promo} - Q_{base} - Q_{forward} - Q_{kanibal}}{Q_{base}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`Q_{promo}`} />: quantity selama promo</li>
<li><Tex math={String.raw`Q_{base}`} />: baseline (tanpa promo)</li>
<li><Tex math={String.raw`Q_{forward}`} />: yang 'dipinjam' dari minggu depan (lihat penurunan pasca-promo)</li>
<li><Tex math={String.raw`Q_{kanibal}`} />: penjualan produk lain yang termakan (lihat MK konsep berikut)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Promo seperti <strong>meminjam uang dari rentenir waktu</strong>: penjualan minggu ini naik karena 'meminjam' penjualan minggu depan (forward buying) — dan bunganya = margin yang hilang + harga referensi yang rusak. Kadang pinjaman ini worth it (akuisisi pelanggan baru); sering tidak.</p>
<p><strong>Kapan dipakai:</strong> Evaluasi setiap promo: ukur 2–4 minggu SESUDAH promo untuk menangkap forward buying. Jangan nilai promo di hari terakhirnya.</p>
<details className="worked">
<summary>📐 Contoh: Audit promo KriukKu (klik untuk buka)</summary>
<p>Promo 1 minggu: Q_promo = 40.000 (vs baseline 10.000/minggu). Minggu setelah promo: 4.000 (baseline 10.000 → forward buying = 6.000). Varian premium turun 3.000 (kanibalisasi, margin Rp5.000/unit).</p>
<p><strong>Lift kotor:</strong> (40.000−10.000)/10.000 = 300%. <strong>Lift bersih:</strong> (40.000−10.000−6.000−3.000)/10.000 = <strong>210%</strong> — masih besar!</p>
<p><strong>Profit:</strong> inkremental bersih 21.000 unit × margin promo Rp1.000 = Rp21jt. Kanibalisasi: 3.000 × Rp5.000 = Rp15jt hilang. Biaya promo (listing, spanduk): Rp10jt. <strong>Net = 21 − 15 − 10 = −Rp4jt.</strong> Ditambah harga referensi rusak. 'Promo tersukses' = rugi.</p>
</details>
<PlotlyChart
  data={[{x: ["Baseline", "Lift kotor", "Forward buying", "Kanibalisasi", "Lift bersih"], y: [10, 30, -6, -3, 21], type: "bar", marker: {color: ["#94a3b8","#2a7de1","#ef4444","#ef4444","#16a34a"]}, text: ["10rb","30rb","−6rb","−3rb","21rb"], textposition: "outside"}]}
  title={"Waterfall: dari lift kotor ke lift bersih"}
  layout={{yaxis: {title: "Ribu unit"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Baca kiri ke kanan: mulai dari baseline, tambah lift kotor, kurangi forward buying & kanibalisasi = lift bersih.</p>
<p><strong>Interpretasi:</strong> Lift kotor 30rb menyusut jadi 21rb bersih — 30% adalah 'pinjaman' & 'curian'. Waterfall ini = template audit tiap promo. Jika lift bersih masih besar TAPI profit negatif (margin promo tipis), keputusannya tetap: jangan ulangi.</p>
</div>
<h2 id="kanibal">Kanibalisasi — Mencuri dari Diri Sendiri</h2>
<p><strong>Definisi.</strong> <strong>Kanibalisasi</strong>: promo/produk baru memakan penjualan produkmu yang lain (margin lebih tinggi). Lawannya: <strong>halo effect</strong> (promo menarik traffic yang juga beli produk lain — positif). <strong>Net incremental</strong> = inkremental produk promo − kanibalisasi + halo.</p>
<p>Cara ukur: bandingkan penjualan produk <em>saudara</em> selama promo vs baseline (atau vs kontrol wilayah tanpa promo). Kanibalisasi 100% = promo murni memindahkan penjualan (nol tambahan, margin hilang).</p>
<p><strong>Kepribadian/intuisi:</strong> Kanibalisasi seperti <strong>memindahkan uang dari kantong kiri ke kantong kanan lalu merayakan 'dapat uang'</strong> — kecuali kantong kanan bocor (margin lebih kecil). Satu-satunya yang dirayakan = uang <em>baru</em> dari luar (pelanggan baru / konsumsi tambahan).</p>
<p><strong>Kapan dipakai:</strong> Setiap promo & peluncuran produk baru. Selalu ukur portofolio, bukan SKU.</p>
<details className="worked">
<summary>📐 Contoh: Varian baru KriukKu (klik untuk buka)</summary>
<p>Varian 'Pedas' diluncurkan: jual 8.000 unit/minggu. Varian 'Original' turun 5.000 (dari 20.000). Total portofolio: 28.000 → 23.000+8.000 = 31.000.</p>
<p><strong>Kanibalisasi:</strong> 5.000/8.000 = <strong>62,5%</strong> — hampir 2/3 'penjualan baru' adalah pindahan. Net incremental cuma 3.000 unit.</p>
<p><strong>Tapi</strong> — jika varian Pedas marginnya LEBIH TINGGI (Rp4.000 vs Rp3.000): profit = 8.000×4.000 − 5.000×3.000 = Rp32jt − Rp15jt = <strong>+Rp17jt</strong>. Kanibalisasi tidak selalu buruk — <strong>kanibalisasi ke margin lebih tinggi = strategi</strong> (premiumisasi).</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Harga yang Tepat</h2>
<p><strong>Harga</strong> = <strong>tuas</strong> profit paling <strong>kuat</strong> (1% naik harga = <strong>8–10%</strong> naik profit! — <strong>lebih</strong> dari 1% potong biaya!). Tapi <strong>salah</strong> harga = <strong>bencana</strong> (terlalu tinggi = <strong>tidak laku</strong>! terlalu rendah = <strong>buang margin</strong>!). Tiga pendalaman: (1) elastisitas; (2) promo lift; (3) kanibalisasi.</p>
<h3>1. Elastisitas — &ldquo;Seberapa Sensitif Pembeli?&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>Elastisitas harga</strong> = % perubahan <strong>quantity</strong> / % perubahan <strong>harga</strong>. <strong>Elastis</strong> (|e| &gt; 1!) = <strong>sensitif</strong> (naik 10% harga → turun &gt;10% beli!). <strong>Inelastis</strong> (|e| &lt; 1!) = <strong>tidak sensitif</strong> (naik 10% → turun &lt;10%!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>karet gelang</strong> vs <strong>kawat</strong>. <strong>Elastis</strong> = karet (<strong>ditarik</strong> sedikit, <strong>melar</strong> banyak!). <strong>Inelastis</strong> = kawat (<strong>ditarik</strong>, <strong>tidak</strong> berubah!). <strong>Bensin</strong> = inelastis (butuh! <strong>tetap</strong> beli!). <strong>Es krim</strong> = elastis (mahal? <strong>ganti</strong> merek!).</p>
<p><strong>Harga optimal:</strong> <strong>naikkan</strong> jika <strong>inelastis</strong> (revenue <strong>naik</strong>!). <strong>Turunkan</strong> (atau <strong>promo</strong>!) jika <strong>elastis</strong> (volume <strong>naik</strong> banyak!). <strong>Jangan</strong> tebak — <strong>ukur</strong>!</p>
<p><strong>Cara ukur:</strong> <strong>regresi</strong> log(Q) ~ log(P) (koefisien = <strong>elastisitas</strong>!). <strong>Eksperimen</strong> (beda harga beda wilayah!). <strong>Conjoint</strong> (survei!).</p>
<Tex math={String.raw`e = \frac{\%\Delta Q}{\%\Delta P} = \frac{\Delta Q / Q}{\Delta P / P}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`e`} /> = elastisitas; <Tex math={String.raw`Q`} /> = quantity; <Tex math={String.raw`P`} /> = harga. <strong>Negatif</strong> (naik harga → turun beli!). <strong>|e|</strong> = <strong>sensitivitas</strong>.</p>
<details className="worked">
<summary>📐 Contoh 1a: Elastisitas dalam angka (klik untuk buka)</summary>
<p><strong>Produk A:</strong> harga Rp10rb → Rp11rb (+10%). Q: 1.000 → 950 (−5%). e = −5%/+10% = <strong>−0,5</strong> (<strong>inelastis</strong>!).</p>
<p><strong>Revenue:</strong> sebelum = 10rb×1.000 = <strong>Rp10jt</strong>. Sesudah = 11rb×950 = <strong>Rp10,45jt</strong> (<strong>naik</strong> 4,5%!). <strong>Naikkan</strong> harga = <strong>benar</strong>!</p>
<p><strong>Produk B:</strong> harga Rp10rb → Rp11rb (+10%). Q: 1.000 → 800 (−20%). e = −20%/+10% = <strong>−2,0</strong> (<strong>elastis</strong>!).</p>
<p><strong>Revenue:</strong> sebelum = <strong>Rp10jt</strong>. Sesudah = 11rb×800 = <strong>Rp8,8jt</strong> (<strong>turun</strong> 12%!). <strong>Naikkan</strong> harga = <strong>salah</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>sama</strong> +10% harga, <strong>beda</strong> hasil (naik 4,5% vs turun 12%!). <strong>Elastisitas</strong> = <strong>kompas</strong> harga. <strong>Tanpa</strong> kompas = <strong>tersesat</strong>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Harga optimal dari elastisitas (klik untuk buka)</summary>
<p><strong>Rumus:</strong> P* = MC × [e/(e+1)] (markup <strong>optimal</strong>!). <strong>MC</strong> = marginal cost.</p>
<p><strong>Produk A</strong> (e=−0,5!, MC=Rp6rb): P* = 6rb × [−0,5/0,5] = 6rb × <strong>(−1)</strong>?? <strong>Salah!</strong> Rumus untuk <strong>|e| &gt; 1</strong>! (Jika <strong>inelastis</strong>, <strong>naikkan terus</strong> sampai <strong>elastis</strong>!).</p>
<p><strong>Produk B</strong> (e=−2,0!, MC=Rp6rb): P* = 6rb × [−2/(−2+1)] = 6rb × [−2/−1] = 6rb × 2 = <strong>Rp12rb</strong>.</p>
<p><strong>Cek:</strong> pada P=Rp12rb, margin = 12−6 = <strong>Rp6rb</strong> (50%!). <strong>Optimal</strong> untuk e=−2!</p>
<p><strong>Pelajaran:</strong> <strong>elastisitas</strong> → <strong>harga optimal</strong> (matematika!). <strong>Bukan</strong> &ldquo;kira-kira&rdquo;. <strong>Bukan</strong> &ldquo;ikut kompetitor&rdquo;. <strong>Hitung!</strong></p>
</details>
<h3>2. Promo Lift — &ldquo;Berapa Tambahan Karena Diskon?&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>Promo lift</strong> = penjualan <strong>selama</strong> promo − penjualan <strong>tanpa</strong> promo (<strong>baseline</strong>!). <strong>Pertanyaan:</strong> &ldquo;diskon 20% → <strong>berapa</strong> tambahan? <strong>Apakah</strong> worth it?&rdquo;</p>
<p><strong>Kepribadian:</strong> seperti <strong>dokter</strong> yang bertanya &ldquo;demam <strong>turun berapa</strong> karena obat?&rdquo; (bukan &ldquo;demam <strong>berapa</strong> setelah obat?&rdquo; — itu <strong>termasuk</strong> yang <strong>turun sendiri</strong>!). <strong>Baseline</strong> = &ldquo;yang <strong>terjadi anyway</strong>&rdquo;. <strong>Lift</strong> = &ldquo;yang <strong>karena promo</strong>&rdquo;.</p>
<p><strong>Tiga efek promo:</strong> <strong>(a) Brand switching</strong> (dari <strong>kompetitor</strong>! — <strong>bagus</strong>!). <strong>(b) Stockpiling</strong> (beli <strong>banyak</strong> sekarang, <strong>tidak</strong> beli nanti! — <strong>jahat</strong>!). <strong>(c) Category expansion</strong> (beli yang <strong>tidak</strong> direncanakan! — <strong>bagus</strong>!).</p>
<p><strong>Net lift</strong> = (a) + (c) − <strong>(b)</strong> − <strong>kanibalisasi</strong>! (<strong>Banyak</strong> promo = <strong>stockpiling</strong> = <strong>pinjam</strong> dari masa depan!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> promo! <strong>Ukur</strong> lift (bukan <strong>total</strong>!). <strong>Waspada</strong> stockpiling!</p>
<details className="worked">
<summary>📐 Contoh 2: Promo lift vs stockpiling (klik untuk buka)</summary>
<p><strong>Promo:</strong> diskon 20% (Rp10rb → Rp8rb!). <strong>Minggu promo:</strong> 2.000 unit. <strong>Baseline</strong> (tanpa promo!): 1.000 unit. <strong>Lift kotor:</strong> 2.000 − 1.000 = <strong>+1.000</strong>.</p>
<p><strong>Tapi:</strong> <strong>2 minggu setelah</strong> promo: 700 unit/minggu (vs baseline 1.000!). <strong>Stockpiling:</strong> (1.000−700)×2 = <strong>600</strong> unit (<strong>dipinjam</strong> dari depan!).</p>
<p><strong>Net lift:</strong> 1.000 − 600 = <strong>+400</strong> (bukan <strong>+1.000</strong>!). <strong>Profit:</strong> 400 × (8rb − 6rb COGS!) = 400 × 2rb = <strong>Rp800rb</strong>. <strong>Biaya</strong> (diskon untuk <strong>1.000 baseline</strong> yang <strong>anyway</strong> beli!): 1.000 × 2rb = <strong>Rp2jt</strong>! <strong>Net:</strong> 800rb − 2jt = <strong>−Rp1,2jt</strong>! <strong>Promo RUGI!</strong></p>
<p><strong>Pelajaran:</strong> <strong>lift kotor</strong> (+1.000!) <strong>menipu</strong>. <strong>Net lift</strong> (+400!) = <strong>kebenaran</strong>. <strong>Subsidi baseline</strong> (Rp2jt!) = <strong>pembunuh</strong> promo. <strong>Hitung</strong> net!</p>
</details>
<h3>3. Kanibalisasi — &ldquo;Produk Baru Makan Produk Lama?&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>Kanibalisasi</strong> = produk <strong>baru</strong> (atau <strong>promo</strong>!) <strong>mencuri</strong> penjualan dari produk <strong>existing</strong>. <strong>Net</strong> = penjualan baru − <strong>yang dicuri</strong>!</p>
<p><strong>Kepribadian:</strong> seperti <strong>kakak</strong> yang <strong>merebut</strong> mainan <strong>adik</strong> — <strong>total</strong> mainan <strong>tidak</strong> nambah, <strong>pindah tangan</strong>! <strong>Perusahaan</strong> senang (&ldquo;produk baru <strong>laku</strong>!&rdquo;), tapi <strong>total</strong> revenue <strong>tetap</strong> (atau <strong>turun</strong> jika margin <strong>lebih kecil</strong>!).</p>
<p><strong>Kapan kanibalisasi OK:</strong> <strong>(a)</strong> Mencuri dari <strong>kompetitor</strong> (bukan <strong>sendiri</strong>!). <strong>(b)</strong> Margin <strong>lebih tinggi</strong> (tukar <strong>murah</strong> ke <strong>mahal</strong>!). <strong>(c)</strong> <strong>Mempertahankan</strong> (lebih baik <strong>kanibal sendiri</strong> dari <strong>dikanibal kompetitor</strong>!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> launch &amp; promo! <strong>Ukur</strong> net (bukan <strong>gross</strong>!).</p>
<details className="worked">
<summary>📐 Contoh 3: Kanibalisasi produk baru (klik untuk buka)</summary>
<p><strong>Launch:</strong> Produk B (Rp15rb, margin Rp5rb!). <strong>Penjualan B:</strong> 500 unit. <strong>Produk A</strong> (Rp10rb, margin Rp4rb!): turun dari 1.000 → 700 (−300!).</p>
<p><strong>Gross:</strong> 500 × 5rb = <strong>Rp2,5jt</strong> (&ldquo;sukses!&rdquo;).</p>
<p><strong>Kanibalisasi:</strong> 300 × 4rb = <strong>Rp1,2jt</strong> (<strong>hilang</strong> dari A!). <strong>Net:</strong> 2,5jt − 1,2jt = <strong>Rp1,3jt</strong> (bukan <strong>Rp2,5jt</strong>!).</p>
<p><strong>Jika</strong> 400 dari 500 = <strong>kanibal</strong> (bukan 300!): net = 2,5jt − (400×4rb=1,6jt) = <strong>Rp900rb</strong>. <strong>Makin</strong> kanibal, <strong>makin</strong> kecil net!</p>
<p><strong>Pelajaran:</strong> <strong>gross</strong> = <strong>vanity</strong>. <strong>Net</strong> = <strong>sanity</strong>. <strong>Ukur</strong> kanibalisasi (<strong>kontrol</strong> wilayah! <strong>survei</strong> &ldquo;dari mana pindah?&rdquo;!).</p>
</details>
<PlotlyChart
  data={[{x: ["Baseline", "Promo (kotor)", "Stockpiling", "Subsidi baseline", "Net"], y: [1000, 2000, -600, 0, 1400], type: "bar", marker: {color: ["#94a3b8", "#2a7de1", "#ef4444", "#f59e0b", "#22c55e"]}}]}
  title={"Promo: kotor vs net (unit)"}
  layout={{yaxis: {title: "Unit"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Baseline = 1.000. Promo = 2.000 (<strong>kotor</strong>!). Stockpiling = −600 (<strong>pinjam</strong>!). Net = 1.400.</p>
<p><strong>Interpretasi:</strong> <strong>Lift kotor</strong> (+1.000!) vs <strong>net</strong> (+400!). <strong>60%</strong> lift = <strong>pinjaman</strong>! <strong>Jangan</strong> rayakan <strong>kotor</strong> — <strong>hitung</strong> net!</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Promo yang menaikkan volume 300% pasti sukses.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Volume ≠ profit. Kasus KriukKu: +300% volume, <strong>rugi Rp4jt + harga referensi rusak</strong> (forward buying + kanibalisasi + margin tipis). Metrik promo = <strong>profit inkremental bersih</strong>, bukan volume. Promo 'sukses' yang merugi = membeli penjualan sendiri dengan harga mahal.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Elastisitas itu angka tetap untuk satu produk.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Elastisitas <strong>berubah</strong>: beda segmen (mahasiswa vs Sultan), beda konteks (promo vs harga reguler), beda waktu (jangka pendek vs panjang — jangka panjang lebih elastis karena sempat cari alternatif). Satu angka untuk semua = penyederhanaan berbahaya. Segmentasikan.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Ukur promo 2–4 minggu SETELAH-nya.</strong> Forward buying tidak terlihat di minggu promo — ia terlihat sebagai 'lubang' minggu depan. Evaluasi promo tanpa jendela pasca = menilai pinjaman tanpa melihat tagihan.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Kanibalisasi ke atas = strategi, ke bawah = bunuh diri.</strong> Varian baru yang memakan varian murah (margin naik) = premiumisasi yang bagus. Promo yang memakan varian premium (margin turun) = diskon bunuh diri. Selalu ukur portofolio + margin, bukan SKU + volume.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Elastisitas & Implikasi Profit</h2>
<p>Hitung elastisitas arc dari dua titik harga, lalu lihat implikasi ke revenue DAN profit.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Elastisitas"}
  hint={"Ubah MARGIN 3000 → 500. Lihat: produk elastis + margin tipis = promo makin merugikan. Elastisitas tanpa margin = setengah cerita."}
  defaultCode={"# Kalkulator elastisitas arc + implikasi profit\nP1, Q1 = 10000, 10000   # sebelum\nP2, Q2 = 8000, 16000    # sesudah promo\nMARGIN1, MARGIN2 = 3000, 1000  # margin/unit\n\ndQ = (Q2-Q1)/((Q2+Q1)/2)\ndP = (P2-P1)/((P2+P1)/2)\nE = dQ/dP\nrev1, rev2 = P1*Q1, P2*Q2\nprof1, prof2 = MARGIN1*Q1, MARGIN2*Q2\n\nprint(f\"Elastisitas arc : {E:.2f}  ({'ELASTIS' if abs(E)>1 else 'INELASTIS'})\")\nprint(f\"Revenue  : Rp{rev1/1e6:.0f}jt -> Rp{rev2/1e6:.0f}jt ({(rev2-rev1)/rev1:+.0%})\")\nprint(f\"Profit   : Rp{prof1/1e6:.0f}jt -> Rp{prof2/1e6:.0f}jt ({(prof2-prof1)/prof1:+.0%})\")\nprint()\nif abs(E) > 1 and prof2 < prof1:\n    print(\"Jebakan klasik: elastis tapi margin hancur -> volume naik, profit turun.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Audit ROI Promo Lengkap</h2>
<p>Hitung lift bersih (koreksi forward buying + kanibalisasi) dan net profit promo.</p>
<PyodideLab
  title={"Lab 2 — Audit Promo"}
  hint={"Ubah KANIBAL 3000 → 0 (tidak ada kanibalisasi). Kapan promo ini jadi menguntungkan? Itulah 'syarat' promomu."}
  defaultCode={"# Audit promo: dari lift kotor ke profit bersih\nBASE = 10000          # baseline/minggu\nQ_PROMO = 40000       # quantity minggu promo\nFORWARD = 6000        # penurunan minggu depan (pinjaman)\nKANIBAL = 3000        # unit produk saudara yg hilang\nMARGIN_PROMO = 1000   # margin/unit saat promo\nMARGIN_SAUDARA = 5000 # margin/unit produk yg termakan\nBIAYA = 10_000_000    # biaya promo\n\ninkr_bersih = Q_PROMO - BASE - FORWARD - KANIBAL\nlift_kotor = (Q_PROMO - BASE) / BASE\nlift_bersih = inkr_bersih / BASE\nprofit = inkr_bersih * MARGIN_PROMO - KANIBAL * MARGIN_SAUDARA - BIAYA\n\nprint(f\"Lift kotor  : {lift_kotor:.0%}\")\nprint(f\"Lift bersih : {lift_bersih:.0%}\")\nprint(f\"Profit promo: Rp{profit/1e6:+.1f} jt\")\nprint()\nprint(\"Keputusan:\", \"ULANGI (profitable)\" if profit > 0 else \"JANGAN ULANGI (merugi)\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. |E| &gt; 1 (elastis) + margin cukup → <strong>Promo / turun harga</strong></h3>
<p><strong>Kenapa:</strong> Volume merespons kuat; pastikan margin tidak hancur.</p>
<p><strong>Contoh nyata:</strong> Snack, fashion fast-moving.</p>
</div>
<div className="decision-card">
<h3>2. |E| &lt; 1 (inelastis) → <strong>NAIKKAN harga (jangan promo)</strong></h3>
<p><strong>Kenapa:</strong> Quantity tidak turun banyak; revenue & margin naik.</p>
<p><strong>Contoh nyata:</strong> Bensin, obat, brand premium kuat.</p>
</div>
<div className="decision-card">
<h3>3. Mau promo tapi takut kanibalisasi → <strong>Promo varian/entry-level saja + ukur portofolio</strong></h3>
<p><strong>Kenapa:</strong> Arahkan kanibalisasi ke bawah (murah), lindungi premium.</p>
<p><strong>Contoh nyata:</strong> Diskon ukuran kecil, bukan flagship.</p>
</div>
<div className="decision-card">
<h3>4. Tidak tahu elastisitas → <strong>Eksperimen harga kecil (MK9) sebelum promo besar</strong></h3>
<p><strong>Kenapa:</strong> Asumsi elastisitas = judi. Test 5% traffic lebih murah dari promo gagal.</p>
<p><strong>Contoh nyata:</strong> Uji ±10% harga di 2 kota.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Elastisitas + margin</strong> — selalu berpasangan.</li><li><strong>Ukur pasca-promo</strong> (forward buying).</li><li><strong>Ukur portofolio</strong> (kanibalisasi).</li><li><strong>Metrik = profit bersih</strong>, bukan volume.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Diskon yang Membunuh Brand</h3>
<p>Fashion &ldquo;GayaKita&rdquo;: diskon <strong>50%</strong> tiap bulan (&ldquo;ramai!&rdquo;). <strong>Hasil:</strong> revenue <strong>naik</strong> 30%. <strong>Tapi:</strong> <strong>setelah</strong> 1 tahun, <strong>tanpa</strong> diskon = <strong>tidak laku</strong>! <strong>Pelanggan</strong> = <strong>pemburu diskon</strong> (bukan <strong>pecinta brand</strong>!). <strong>Brand equity</strong> = <strong>hancur</strong>.</p>
<p><strong>Analisis:</strong> <strong>elastisitas</strong> = −3,0 (<strong>sangat</strong> elastis! — <strong>karena</strong> dilatih diskon!). <strong>Stockpiling</strong> = 70% (<strong>pinjam</strong>!). <strong>Net lift</strong> = <strong>negatif</strong> (setelah <strong>subsidi baseline</strong>!).</p>
<p><strong>Solusi:</strong> <strong>kurangi</strong> frekuensi (bulanan → <strong>kuartalan</strong>!). <strong>Naikkan</strong> harga <strong>reguler</strong> (latih <strong>inelastis</strong>!). <strong>Hasil:</strong> 2 tahun → <strong>pulih</strong> (margin <strong>naik</strong> 15%!).</p>
<p><strong>Pelajaran:</strong> <strong>promo</strong> = <strong>narkoba</strong> (enak <strong>sekarang</strong>, <strong>hancur</strong> nanti!). <strong>Rehabilitasi</strong> = <strong>sakit</strong> tapi <strong>perlu</strong>.</p>
<h3>Kisah 2: Harga Naik yang Menyelamatkan</h3>
<p>Kopi &ldquo;KitaNgopi&rdquo;: harga Rp15rb (rugi! COGS Rp12rb!). <strong>Takut</strong> naik (&ldquo;pelanggan <strong>kabur</strong>!&rdquo;). <strong>Ukur</strong> elastisitas: <strong>−0,4</strong> (<strong>inelastis</strong>! — kopi = <strong>kebiasaan</strong>!).</p>
<p><strong>Naikkan</strong> ke Rp18rb (+20%!). <strong>Hasil:</strong> Q turun 8% (1.000 → 920!). <strong>Revenue:</strong> 15jt → <strong>16,56jt</strong> (+10%!). <strong>Profit:</strong> (15−12)×1.000=3jt → (18−12)×920=<strong>5,52jt</strong> (+84%!).</p>
<p><strong>Pelajaran:</strong> <strong>takut</strong> naik harga = <strong>takut</strong> yang <strong>salah</strong> (jika <strong>inelastis</strong>!). <strong>Ukur</strong> dulu, <strong>baru</strong> takut.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Harga = biaya + margin.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Harga</strong> = <strong>fungsi</strong> elastisitas + <strong>kompetitor</strong> + <strong>brand</strong> + <strong>psikologi</strong>! <strong>Biaya</strong> = <strong>batas bawah</strong> (jangan <strong>rugi</strong>!), bukan <strong>penentu</strong>. <strong>Nilai</strong> ke pelanggan &gt; <strong>biaya</strong> produksi.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Diskon 50% yang 'Tersukses'</h2>
<div className="callout">
<p>KriukKu: diskon 50% seminggu. Volume +300% (40.000 vs 10.000). Finance: rugi Rp800jt total (termasuk biaya + efek lanjutan). Data: forward buying 6.000, kanibalisasi varian premium 3.000 (margin Rp5.000), margin promo Rp1.000, harga referensi turun (survei: 40% pelanggan 'tunggu promo berikutnya').</p>
<p><strong>Pertanyaan:</strong> (a) Hitung profit bersih promo (asumsi biaya Rp10jt). (b) Tiga kerusakan non-angka? (c) Desain promo alternatif yang lebih sehat?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Inkremental bersih = 40.000−10.000−6.000−3.000 = 21.000 × Rp1.000 = Rp21jt. Kanibalisasi = 3.000 × Rp5.000 = Rp15jt. Net = 21 − 15 − 10 = <strong>−Rp4jt</strong> (belum termasuk kerusakan harga referensi).</p>
<p>(b) <strong>Harga referensi rusak</strong> (pelanggan menunda beli menunggu promo — 'promo trap'), <strong>brand equity</strong> (dari 'enak' jadi 'murah'), <strong>trade expectation</strong> (retailer menuntut promo rutin).</p>
<p>(c) <strong>Promo sehat:</strong> (1) bundling (beli 2 gratis 1 — volume naik tanpa merusak harga referensi per unit); (2) promo varian entry-level saja (lindungi premium); (3) cashback/loyalty (reward repeat, bukan diskon harga); (4) batasi frekuensi (maks 4x/tahun) + ukur pasca selalu.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Elastisitas.</strong> P: Rp20rb → Rp22rb (+10%). Q: 500 → 450 (−10%). Hitung e. Elastis? Revenue naik/turun?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>e</strong> = −10%/+10% = <strong>−1,0</strong> (<strong>unitary</strong>! — <strong>pas</strong> di batas!).</p>
<p><strong>Revenue:</strong> sebelum = 20rb×500 = <strong>Rp10jt</strong>. Sesudah = 22rb×450 = <strong>Rp9,9jt</strong> (<strong>turun</strong> 1%!).</p>
<p><strong>Pelajaran:</strong> e=−1 = <strong>revenue tetap</strong> (teori!). <strong>Praktik:</strong> turun <strong>sedikit</strong> (pembulatan!). <strong>Batas</strong> elastis/inelastis!</p>
</details>
<p><strong>Soal 2 — Promo net.</strong> Baseline 800. Promo 1.500. Stockpiling 400. Subsidi baseline (diskon Rp3rb × 800!). COGS Rp7rb, harga promo Rp10rb (normal Rp13rb!). Hitung net profit promo.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>Lift kotor:</strong> 1.500−800 = <strong>700</strong>. <strong>Net lift:</strong> 700−400 = <strong>300</strong>.</p>
<p><strong>Margin promo:</strong> 10rb−7rb = <strong>Rp3rb</strong>. <strong>Profit lift:</strong> 300×3rb = <strong>Rp900rb</strong>.</p>
<p><strong>Subsidi:</strong> 800×3rb = <strong>Rp2,4jt</strong>! <strong>Net:</strong> 900rb − 2,4jt = <strong>−Rp1,5jt</strong>! <strong>RUGI!</strong></p>
<p><strong>Pelajaran:</strong> <strong>subsidi baseline</strong> = <strong>pembunuh</strong>. <strong>Promo</strong> = <strong>bayar</strong> untuk yang <strong>anyway</strong> beli!</p>
</details>
<p><strong>Soal 3 — Kanibalisasi.</strong> Produk baru: 300 unit × margin Rp8rb. Kanibal: 200 unit × margin Rp5rb (dari produk lama!). Hitung net. Kapan launch <strong>worth it</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Gross:</strong> 300×8rb = <strong>Rp2,4jt</strong>. <strong>Kanibal:</strong> 200×5rb = <strong>Rp1jt</strong>. <strong>Net:</strong> <strong>Rp1,4jt</strong>.</p>
<p><strong>Worth it</strong> jika <strong>net &gt; 0</strong> (di sini <strong>ya</strong>!). <strong>Tapi:</strong> jika <strong>semua</strong> 300 = kanibal (300×5rb=1,5jt!): net = 2,4−1,5 = <strong>Rp900rb</strong> (masih <strong>positif</strong>! karena <strong>margin</strong> lebih tinggi!).</p>
<p><strong>Pelajaran:</strong> <strong>kanibal</strong> dengan <strong>margin lebih tinggi</strong> = <strong>OK</strong> (<strong>upgrade</strong>!). <strong>Kanibal</strong> dengan <strong>margin lebih rendah</strong> = <strong>bunuh diri</strong>.</p>
</details>
<p><strong>Soal 4 — Harga psikologis.</strong> Rp99rb vs Rp100rb. Mana <strong>lebih</strong> laku? Mengapa? Kapan <strong>tidak</strong> pakai?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Rp99rb</strong> (charm pricing!). <strong>Mengapa:</strong> <strong>digit kiri</strong> (9 vs 10!) = <strong>persepsi</strong> &ldquo;90-an&rdquo; vs &ldquo;100&rdquo;! <strong>Otak</strong> baca <strong>kiri</strong> dulu!</p>
<p><strong>Jangan</strong> pakai untuk <strong>luxury</strong> (Rp99rb = <strong>murahan</strong>! pakai <strong>Rp100rb</strong> = <strong>prestise</strong>!). <strong>Psikologi</strong> &gt; <strong>matematika</strong> untuk <strong>persepsi</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga pertanyaan harga: (1) <em>elastisitas</em> berapa? (2) <em>promo</em> net atau kotor? (3) <em>kanibal</em> siapa? Tiga jawaban = harga yang benar.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Harga Rp10rb→Rp8rb, quantity 10rb→16rb. Elastisitas arc?"}
  options={
    ["−0,48 (inelastis)",
    "−2,08 (elastis)",
    "−1,0 (uniter)",
    "+2,08"]
  }
  correct={1}
  explanation={"Benar: %ΔQ=46,2%, %ΔP=−22,2% → E=−2,08, |E|&gt;1 = elastis. Tapi ingat worked example: elastis + margin hancur = profit turun 47%. Elastisitas tanpa margin = setengah cerita."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Promo: Q=40rb, baseline 10rb, forward buying 6rb, kanibalisasi 3rb. Lift bersih?"}
  options={
    ["300%",
    "210%",
    "240%",
    "150%"]
  }
  correct={1}
  explanation={"Benar: (40−10−6−3)/10 = 210%. Lift kotor 300% mencampur 'pinjaman' (forward) dan 'curian' (kanibal). Selalu koreksi keduanya."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Produk inelastis (|E|=0,4). Strategi harga terbaik?"}
  options={
    ["Diskon besar",
    "Naikkan harga",
    "Harga tetap",
    "Gratis"]
  }
  correct={1}
  explanation={"Benar: inelastis = quantity tidak sensitif → naikkan harga: revenue naik (harga naik &gt; quantity turun) DAN margin naik. Promo untuk inelastis = buang margin."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Varian baru mengambil 62,5% penjualannya dari varian lama (margin lebih rendah). Ini?"}
  options={
    ["Sukses — penjualan naik",
    "Kanibalisasi merugikan — net profit bisa negatif",
    "Tidak masalah",
    "Halo effect"]
  }
  correct={1}
  explanation={"Benar: 62,5% = pindahan, bukan tambahan. Jika margin varian baru &lt; lama, profit portofolio turun. Ukur portofolio + margin, bukan SKU + volume."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kenapa evaluasi promo harus 2–4 minggu SETELAH promo?"}
  options={
    ["Biar datanya banyak",
    "Menangkap forward buying (lubang pasca-promo)",
    "Aturan software",
    "Tidak perlu"]
  }
  correct={1}
  explanation={"Benar: forward buying = 'pinjaman' yang baru terlihat sebagai penurunan minggu depan. Menilai promo di hari terakhirnya = menilai pinjaman tanpa melihat tagihan."}
/>

      <h2 id="megapricing">💰 Mega-Studi Kasus: Strategi Harga E-commerce</h2>
<p><strong>Toko</strong> &ldquo;MurahMeriah&rdquo;: 1.000 SKU. <strong>Masalah:</strong> <strong>margin</strong> tipis (5%!). <strong>Tujuan:</strong> <strong>naikkan</strong> ke 15% (<strong>tanpa</strong> kehilangan <strong>pelanggan</strong>!).</p>
<h3>Fase 1: Ukur elastisitas (bulan 1–2)</h3>
<p><strong>Eksperimen:</strong> 100 SKU (<strong>acak</strong>!). <strong>Naikkan</strong> 10%. <strong>Ukur</strong> perubahan Q.</p>
<p><strong>Hasil:</strong> <strong>30</strong> SKU inelastis (e=−0,3!). <strong>50</strong> SKU elastis (e=−2,0!). <strong>20</strong> SKU sangat elastis (e=−4,0!).</p>
<h3>Fase 2: Strategi per segmen (bulan 3)</h3>
<p><strong>Inelastis</strong> (30 SKU!): <strong>naikkan</strong> 15%. <strong>Revenue</strong> naik! <strong>Contoh:</strong> SKU A: Rp10rb → Rp11,5rb. Q: 1.000 → 955 (−4,5%!). Revenue: 10jt → <strong>10,98jt</strong> (+9,8%!).</p>
<p><strong>Elastis</strong> (50 SKU!): <strong>pertahankan</strong> (atau <strong>turunkan</strong> sedikit!). <strong>Fokus</strong> volume!</p>
<p><strong>Sangat elastis</strong> (20 SKU!): <strong>jadikan</strong> loss leader (<strong>umpan</strong>!). <strong>Tarik</strong> traffic!</p>
<h3>Fase 3: Hasil (bulan 4–6)</h3>
<p><strong>Margin:</strong> 5% → <strong>12%</strong>! (<strong>Belum</strong> 15%, tapi <strong>progres</strong>!). <strong>Pelanggan:</strong> <strong>tetap</strong> (churn <strong>tidak</strong> naik!).</p>
<p><strong>Pelajaran:</strong> <strong>segmentasi</strong> by <strong>elastisitas</strong> = <strong>kunci</strong>. <strong>Satu</strong> harga untuk <strong>semua</strong> = <strong>salah</strong>.</p>
<details className="worked">
<summary>📐 Hitungan lengkap 3 SKU (klik untuk buka)</summary>
<p><strong>SKU Inelastis</strong> (e=−0,3!): P 10rb→11,5rb (+15%!). Q 1.000→955 (−4,5%!). <strong>Revenue:</strong> 10jt→10,98jt. <strong>Margin:</strong> (10−8)×1.000=2jt → (11,5−8)×955=<strong>3,34jt</strong> (+67%!).</p>
<p><strong>SKU Elastis</strong> (e=−2,0!): P 10rb→10rb (tetap!). Q 1.000 (tetap!). <strong>Margin:</strong> 2jt (tetap!).</p>
<p><strong>SKU Sangat Elastis</strong> (e=−4,0!): P 10rb→9rb (−10%!). Q 1.000→1.400 (+40%!). <strong>Revenue:</strong> 10jt→12,6jt. <strong>Margin:</strong> 2jt → (9−8)×1.400=<strong>1,4jt</strong> (−30%! — <strong>tapi</strong> traffic <strong>naik</strong> 40%!).</p>
<p><strong>Total:</strong> margin <strong>naik</strong> (2+2+2=6jt → 3,34+2+1,4=<strong>6,74jt</strong>!). <strong>Traffic</strong> naik!</p>
</details>
<div className="callout">
<p><strong>What:</strong> Segmentasi 1.000 SKU by elastisitas. Naikkan inelastis, pertahankan elastis, umpan sangat elastis. Margin 5%→12%.</p>
<p><strong>So what:</strong> <strong>Harga</strong> = <strong>strategi</strong>, bukan <strong>angka</strong>. <strong>Ukur</strong> dulu, <strong>baru</strong> ubah.</p>
<p><strong>Now what:</strong> (1) <strong>Ukur</strong> elastisitas! (2) <strong>Segmentasi</strong>! (3) <strong>Strategi</strong> per segmen! (4) <strong>Monitor</strong>!</p>
</div>

      <h2 id="psychology">📊 Pricing Psychology Mendalam</h2>
<p><strong>Harga</strong> = <strong>psikologi</strong>! <strong>Enam</strong> taktik:</p>
<h3>1. Charm pricing (Rp99rb!)</h3>
<p><strong>Efek:</strong> <strong>terlihat</strong> murah (9 vs 10!). <strong>Kapan:</strong> <strong>mass market</strong>! <strong>Jangan:</strong> <strong>luxury</strong>!</p>
<h3>2. Prestige pricing (Rp100rb!)</h3>
<p><strong>Efek:</strong> <strong>terlihat</strong> premium (<strong>bulat</strong>!). <strong>Kapan:</strong> <strong>luxury</strong>! <strong>Jangan:</strong> <strong>diskon</strong>!</p>
<h3>3. Anchor pricing (coret Rp200rb! jadi Rp100rb!)</h3>
<p><strong>Efek:</strong> <strong>terlihat</strong> murah (<strong>dibanding</strong> jangkar!). <strong>Kapan:</strong> <strong>promo</strong>! <strong>Jangan:</strong> <strong>bohong</strong> (jangkar <strong>palsu</strong>!).</p>
<h3>4. Decoy pricing (3 pilihan!)</h3>
<p><strong>Efek:</strong> <strong>tengah</strong> terlihat <strong>menarik</strong>. <strong>Contoh:</strong> Kecil Rp50rb, Sedang Rp80rb, Besar Rp85rb → <strong>Besar</strong> menang! (<strong>hanya</strong> Rp5rb lebih!).</p>
<h3>5. Bundle pricing (paket!)</h3>
<p><strong>Efek:</strong> <strong>terlihat</strong> hemat. <strong>Kapan:</strong> <strong>komplementer</strong>! (<strong>shampoo</strong> + <strong>conditioner</strong>!).</p>
<h3>6. Freemium (gratis! → bayar!)</h3>
<p><strong>Efek:</strong> <strong>coba</strong> dulu. <strong>Kapan:</strong> <strong>digital</strong>! (<strong>marginal cost</strong> nol!).</p>
<details className="worked">
<summary>📐 Contoh decoy (klik untuk buka)</summary>
<p><strong>Tanpa</strong> decoy: Kecil Rp50rb (30%!), Besar Rp100rb (70%!). <strong>Revenue:</strong> 30×50 + 70×100 = 1,5jt + 7jt = <strong>8,5jt</strong>.</p>
<p><strong>Dengan</strong> decoy (Sedang Rp90rb!): Kecil 10%, Sedang 20%, Besar 70%. <strong>Revenue:</strong> 10×50 + 20×90 + 70×100 = 0,5 + 1,8 + 7 = <strong>9,3jt</strong> (+9,4%!).</p>
<p><strong>Pelajaran:</strong> <strong>decoy</strong> = <strong>gratis</strong> (+9,4%!). <strong>Psikologi</strong> = <strong>uang</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 <em>Enam</em> taktik: charm, prestige, anchor, decoy, bundle, freemium. <em>Pilih</em> sesuai <em>produk</em> &amp; <em>audiens</em>.</strong></p>
</div>

      <h2 id="kisahharga">📖 Kisah Nyata: Perang Harga di E-commerce</h2>
<p>Di sebuah e-commerce fashion di Bandung, terjadi kepanikan. Kompetitor baru masuk dengan harga dua puluh persen lebih murah! CEO, Pak Dedi, memanggil rapat darurat. &ldquo;Kita harus turunkan harga!&rdquo; katanya. &ldquo;Kalau tidak, pelanggan kita akan kabur!&rdquo;</p>
<p>Manajer pemasaran, Ibu Sari, tidak setuju. &ldquo;Tapi margin kita sudah tipis!&rdquo; katanya. &ldquo;Kalau turunkan harga lagi, kita rugi!&rdquo; Pak Dedi menggebrak meja. &ldquo;Lebih baik rugi sedikit daripada kehilangan semua pelanggan!&rdquo;</p>
<p>Kamu, sang analis data, diminta memberikan rekomendasi. Kamu tahu bahwa keputusan ini tidak bisa didasarkan pada emosi atau tebakan. Kamu perlu data.</p>
<p>Langkah pertama yang kamu lakukan adalah mengukur elastisitas harga. Kamu mengambil data enam bulan terakhir dan melihat bagaimana perubahan harga mempengaruhi quantity. Kamu menemukan sesuatu yang menarik: tidak semua produk memiliki elastisitas yang sama!</p>
<p>Produk basic (kaos polos, celana jeans standar) memiliki elastisitas -2,5 (sangat elastis!). Jika harga naik sepuluh persen, penjualan turun dua puluh lima persen! Pelanggan sangat sensitif terhadap harga untuk produk ini karena banyak alternatif.</p>
<p>Produk fashion (dress bermotif, jaket limited edition) memiliki elastisitas -0,8 (inelastis!). Jika harga naik sepuluh persen, penjualan hanya turun delapan persen! Pelanggan tidak terlalu sensitif karena produknya unik dan sulit dibandingkan.</p>
<p>Produk premium (tas branded, sepatu eksklusif) memiliki elastisitas -0,3 (sangat inelastis!). Pelanggan membeli karena brand dan status, bukan karena harga murah.</p>
<p>Dengan temuan ini, kamu memberikan rekomendasi yang berbeda dari yang diharapkan Pak Dedi. &ldquo;Jangan turunkan semua harga!&rdquo; katamu. &ldquo;Itu bunuh diri!&rdquo;</p>
<p>Kamu mengusulkan strategi tiga lapis. Untuk produk basic (elastis!), kamu setuju untuk menurunkan harga sepuluh persen untuk bersaing. Kamu menghitung bahwa meskipun margin per unit turun, volume akan naik dua puluh lima persen, sehingga total profit naik!</p>
<p>Untuk produk fashion (inelastis!), kamu mengusulkan untuk PERTAHANKAN harga, bahkan NAIKKAN lima persen! Kamu menghitung bahwa penurunan volume delapan persen akan dikompensasi oleh kenaikan margin, sehingga total profit naik!</p>
<p>Untuk produk premium (sangat inelastis!), kamu mengusulkan untuk NAIKKAN harga sepuluh persen! Kamu berargumen bahwa pelanggan premium justru mencurigai produk yang terlalu murah. Kenaikan harga akan meningkatkan persepsi kualitas.</p>
<p>Pak Dedi awalnya skeptis. &ldquo;Naikkan harga saat kompetitor menurunkan? Itu gila!&rdquo; Kamu menunjukkan perhitungannya. &ldquo;Lihat, Pak. Untuk produk fashion, jika kita ikuti kompetitor dan turunkan sepuluh persen, kita kehilangan margin tanpa mendapatkan banyak volume (karena inelastis!). Tapi jika kita naikkan lima persen, kita mendapatkan margin lebih dengan kehilangan volume yang kecil.&rdquo;</p>
<p>Ibu Sari mendukungmu. &ldquo;Itu masuk akal,&rdquo; katanya. &ldquo;Pelanggan fashion kita bukan pemburu diskon. Mereka mencari keunikan.&rdquo;</p>
<p>Setelah tiga bulan, hasilnya terlihat. Produk basic dengan harga turun berhasil mempertahankan market share. Produk fashion dengan harga naik justru profitnya naik dua puluh persen! Produk premium dengan harga naik profitnya naik tiga puluh persen!</p>
<p>Total profit perusahaan naik lima belas persen, meskipun kompetitor menjual lebih murah! Pak Dedi memanggilmu. &ldquo;Saya salah,&rdquo; katanya. &ldquo;Ternyata perang harga tidak selalu dijawab dengan perang harga. Terima kasih sudah menyelamatkan kita dari bunuh diri.&rdquo;</p>
<div className="callout">
<p><strong>What:</strong> Kompetitor turunkan 20%. Strategi 3 lapis by elastisitas (turun! tahan! naik!). Profit +15%.</p>
<p><strong>So what:</strong> <strong>Harga</strong> = <strong>strategi</strong>, bukan <strong>reaksi</strong>. <strong>Elastisitas</strong> = <strong>kompas</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Ukur</strong> elastisitas! (2) <strong>Segmentasi</strong>! (3) <strong>Strategi</strong> beda per segmen! (4) <strong>Jangan</strong> panik!</p>
</div>

      <h2 id="kisahpromo">📖 Kisah Nyata: Promo yang Hampir Membunuh Brand</h2>
<p>Di sebuah brand fashion lokal di Yogyakarta, pemiliknya, Mbak Rina, sangat bangga dengan strateginya. &ldquo;Setiap bulan kita kasih diskon 50%!&rdquo; katanya dengan antusias. &ldquo;Penjualan selalu ramai!&rdquo;</p>
<p>Kamu, sang konsultan, diminta untuk menganalisis. Kamu melihat datanya dan terkejut. Memang, penjualan saat promo sangat tinggi. Tetapi kamu melihat pola yang mengkhawatirkan.</p>
<p>Kamu menganalisis promo lift dari MK14. Kamu menemukan bahwa &ldquo;lift kotor&rdquo; memang besar: penjualan naik dari 1.000 unit (baseline) menjadi 3.000 unit saat promo (+2.000!). Tetapi kemudian kamu melihat dua minggu setelah promo: penjualan turun menjadi 500 unit (dari baseline 1.000!). Artinya, 1.000 unit adalah &ldquo;stockpiling&rdquo; — pelanggan membeli banyak saat promo dan tidak membeli setelahnya!</p>
<p>Net lift sebenarnya hanya +1.000 unit (bukan +2.000!). Dan itu belum termasuk &ldquo;subsidi baseline&rdquo; — 1.000 pelanggan yang anyway akan membeli tetap mendapatkan diskon 50%! Jika harga normal Rp200 ribu dan diskon menjadi Rp100 ribu, maka subsidi baseline adalah 1.000 × Rp100 ribu = Rp100 juta! Itu adalah uang yang dibakar untuk pelanggan yang anyway akan membeli!</p>
<p>Kamu menghitung profit. Margin normal Rp80 ribu per unit (harga Rp200 ribu, COGS Rp120 ribu). Saat promo, margin hanya Rp-20 ribu per unit (harga Rp100 ribu, COGS Rp120 ribu — RUGI!). Net lift 1.000 unit × (-Rp20 ribu) = -Rp20 juta! Ditambah subsidi baseline Rp100 juta! Total kerugian promo: Rp120 juta!</p>
<p>Mbak Rina pucat. &ldquo;Jadi promo kita rugi Rp120 juta setiap bulan?&rdquo; Kamu mengangguk. &ldquo;Ya, Mbak. Dan yang lebih buruk, pelanggan kita sudah dilatih untuk hanya membeli saat promo. Mereka tidak akan membeli dengan harga normal lagi. Brand kita menjadi &lsquo;brand diskon&rsquo;, bukan &lsquo;brand fashion&rsquo;.&rdquo;</p>
<p>Kamu mengusulkan rehabilitasi. Kurangi frekuensi promo dari bulanan menjadi kuartalan. Naikkan harga reguler secara bertahap. Fokus pada kualitas dan desain, bukan pada diskon. Awalnya penjualan turun, tetapi setelah enam bulan, margin mulai pulih. Setelah satu tahun, brand kembali sehat.</p>
<div className="callout">
<p><strong>What:</strong> Promo 50% bulanan → rugi Rp120 juta/bulan! Rehabilitasi → brand sehat.</p>
<p><strong>So what:</strong> <strong>Promo</strong> = <strong>narkoba</strong>. <strong>Hitung</strong> net lift!</p>
<p><strong>Now what:</strong> (1) <strong>Hitung</strong> net, bukan kotor! (2) <strong>Kurangi</strong> frekuensi! (3) <strong>Bangun</strong> brand!</p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-optimal">📐 Worked Example: Dari Elastisitas ke Harga Optimal, Langkah-demi-Langkah</h2>
<p>Rumus harga optimal terlihat sederhana — <strong>kekuatannya</strong> ada di cara mendapatkan angka elastisitasnya dengan jujur. Contoh: kopi susu kemasan 250ml, biaya variabel Rp4.000/unit.</p>
<details className="worked">
<summary>📐 Perhitungan lengkap (klik untuk buka)</summary>
<p><strong>Langkah 1 — Kumpulkan dua titik harga bersih.</strong> Dari eksperimen geo (2 region mirip, 4 minggu): Region A harga Rp10.000 → 50.000 unit/minggu. Region B harga Rp11.000 → 42.000 unit/minggu. (Bukan data observasional mentah — itu tercemar promo &amp; musiman.)</p>
<p><strong>Langkah 2 — Hitung elastisitas arc.</strong> <Tex math={String.raw`\varepsilon = \frac{(Q_2 - Q_1)/(Q_2 + Q_1)}{(P_2 - P_1)/(P_2 + P_1)} = \frac{(42 - 50)/92}{(11 - 10)/21} = \frac{-0{,}087}{0{,}0476} \approx -1{,}83`} /></p>
<p>Artinya: tiap 1% kenaikan harga → demand turun ~1,83%. Produk ini <strong>elastis</strong> (|ε| &gt; 1) — wajar untuk kopi kemasan yang substitusinya banyak.</p>
<p><strong>Langkah 3 — Terapkan aturan markup optimal.</strong> <Tex math={String.raw`\frac{P^* - c}{P^*} = -\frac{1}{\varepsilon} \quad\Rightarrow\quad P^* = \frac{c}{1 + 1/\varepsilon}`} />. Dengan c = Rp4.000 dan ε = −1,83: P* = 4.000 / (1 − 1/1,83) = 4.000 / (1 − 0,546) = 4.000 / 0,454 ≈ <strong>Rp8.810</strong>.</p>
<p><strong>Langkah 4 — Baca hasilnya dengan skeptis.</strong> Harga optimal Rp8.810 <em>di bawah</em> harga saat ini (Rp10.000)! Model bilang: turunkan harga → volume naik cukup banyak untuk menaikkan profit total. Cek: profit di Rp10.000 = (10.000−4.000) × 50.000 = <strong>Rp300jt</strong>/minggu. Estimasi demand di Rp8.810 (pakai elastisitas): turun harga 11,9% → volume naik ~21,8% → 60.900 unit. Profit = (8.810−4.000) × 60.900 ≈ <strong>Rp293jt</strong> — <em>sedikit lebih rendah</em>! Kok bisa?</p>
<p><strong>Langkah 5 — Pahami batas rumus.</strong> Rumus markup memakai elastisitas <em>titik</em> yang konstan — padahal elastisitas berubah sepanjang kurva demand. Pelajaran ganda: (a) jangan pakai rumus buta-buta — ia titik awal, bukan vonis; (b) <strong>jalankan eksperimen harga kecil</strong> di sekitar Rp9.000–Rp10.000 untuk memetakan kurva lokal sebelum mengubah harga nasional. Analis yang baik memakai rumus untuk <em>menantang</em> status quo (&ldquo;kenapa kita di Rp10.000?&rdquo;), bukan untuk <em>menggantikannya</em> (&ldquo;model bilang Rp8.810, ganti sekarang!&rdquo;).</p>
</details>
<h3>Lima jebakan elastisitas</h3>
<ul>
<li><strong>Elastisitas observasional ≠ kausal.</strong> Harga naik saat Ramadan (demand juga naik) → elastisitas terlihat positif (salah!). Pakai eksperimen atau kontrol yang benar.</li>
<li><strong>Elastisitas jangka pendek ≠ jangka panjang.</strong> Minggu pertama naik harga: −0,8 (orang belum sadar). Tiga bulan: −2,1 (pindah ke kompetitor). Keputusan permanen pakai yang panjang.</li>
<li><strong>Elastisitas per segmen beda jauh.</strong> Pelanggan setia: −0,9; pemburu promo: −3,5. Satu angka rata-rata = keputusan yang salah untuk keduanya.</li>
<li><strong>Kompetitor bereaksi.</strong> Kamu turunkan harga, kompetitor ikut — elastisitas &ldquo;bersih&rdquo;-mu menyusut. Model tanpa reaksi kompetitor = optimis.</li>
<li><strong>Elastisitas silang (kanibalisasi).</strong> Naikkan harga varian A → penjualan varian B naik. Keputusan harga tidak pernah sendirian — selalu portofolio.</li>
</ul>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: elastisitas mengubah debat harga dari &ldquo;menurut saya kemahalan&rdquo; menjadi &ldquo;data bilang tiap 1% kenaikan harga menghilangkan X unit&rdquo; — dan rumus markup mengubahnya lagi menjadi &ldquo;harga yang memaksimalkan profit adalah RpY&rdquo;. Tiga level kedewasaan pricing dalam satu angka.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: &ldquo;Diskon Ganda&rdquo; — Ketika Promo Bertumpuk Memakan Margin</h2>
<p><em>ModeKita</em> (nama disamarkan): fashion online, 2 juta pelanggan. Kebiasaan: tiap bulan ada promo — &ldquo;diskon 30% + voucher 20% + gratis ongkir&rdquo;. Tim marketing merayakan &ldquo;revenue promo naik terus&rdquo;. Finance melihat margin <strong>menyusut 8 poin dalam setahun</strong>. Kamu diminta audit.</p>
<h3>Temuan 1 — Diskon ganda = harga efektif yang tidak disadari siapa pun</h3>
<p>Harga normal Rp300.000. &ldquo;Diskon 30%&rdquo; → Rp210.000. Voucher 20% → Rp168.000. Gratis ongkir (Rp20.000) → efektif <strong>Rp148.000</strong> — <strong>51% di bawah harga normal</strong>, padahal tiap tim mengira promonya &ldquo;kecil&rdquo;. Tidak ada satu pun dashboard yang menampilkan <strong>harga efektif akhir</strong> — tiap tim hanya melihat potongannya sendiri. Aturan baru: setiap promo wajib menampilkan <em>harga efektif</em> &amp; <em>margin efektif</em> sebelum disetujui.</p>
<h3>Temuan 2 — 70% &ldquo;lift promo&rdquo; adalah forward-buying, bukan demand baru</h3>
<p>Analisis kohor: pelanggan yang beli saat promo, <strong>tidak beli 2 bulan berikutnya</strong> (mereka menyetok). &ldquo;Lift&rdquo; 40% di minggu promo → −25% di 8 minggu setelahnya. Net incremental: hanya <strong>+8%</strong>. Ditambah: 35% pembeli promo adalah pelanggan setia yang <em>akan beli juga</em> tanpa promo (sure things, MK11!). Promo ini sebagian besar = <strong>memberi diskon untuk pembelian yang sudah terjadi</strong>.</p>
<h3>Temuan 3 — Jangkar harga rusak permanen</h3>
<p>Survei: 62% pelanggan menjawab &ldquo;harga wajar&rdquo; ModeKita = <strong>harga promo</strong>, bukan harga normal. Butuh 6 bulan <em>tanpa</em> promo besar untuk mengembalikan persepsi — 6 bulan yang mahal. Ini biaya promo yang tidak pernah masuk spreadsheet ROI: <strong>erosi brand equity</strong>.</p>
<h3>Keputusan &amp; hasil</h3>
<p>Kalender promo dipangkas dari 12x menjadi <strong>4x setahun</strong> (momen besar saja), diskon maksimal 40% <em>efektif</em> (tidak boleh bertumpuk), dan voucher hanya untuk <strong>segmen persuadable</strong> (MK11) — bukan blast. Hasil 1 tahun: revenue promo turun 15%, tapi <strong>profit total naik 31%</strong> dan harga normal kembali dipercaya (62% → 28% yang menganggap harga promo = harga wajar).</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Promo yang menaikkan revenue = promo yang bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Promo dinilai dari <strong>profit incremental bersih</strong> (setelah forward-buying, kanibalisasi, subsidi sure-things, dan erosi jangkar harga) — bukan dari revenue minggu promo. Promo yang &ldquo;sukses&rdquo; menaikkan revenue sambil menurunkan profit adalah <strong>kegagalan yang dirayakan</strong>.</p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Pricing</h2>
<h3>1. &ldquo;Psychological pricing (Rp99.000) masih berfungsi?&rdquo;</h3>
<p><strong>Ya, tapi melemah dan tergantung konteks.</strong> Efek &ldquo;digit kiri&rdquo; (Rp99.000 terasa jauh lebih murah dari Rp100.000) terbukti kuat untuk pembelian impulsif &amp; pelanggan tidak teliti. Tapi untuk pembeli yang membandingkan (e-commerce!), efeknya kecil — mereka melihat angka penuh. Dan di segmen premium, harga &ldquo;99&rdquo; justru <strong>menurunkan persepsi kualitas</strong>. Aturan: pakai 99 untuk FMCG/impulsif, harga bulat untuk premium (Rp500.000 terasa &ldquo;bernilai&rdquo; dibanding Rp499.000).</p>
<h3>2. &ldquo;Dynamic pricing — kapan etis, kapan tidak?&rdquo;</h3>
<p><strong>Etis:</strong> berbasis <em>permintaan agregat</em> yang transparan (tiket pesawat naik saat high season — semua orang paham aturannya). <strong>Tidak etis (dan berisiko UU Perlindungan Konsumen):</strong> berbasis <em>profil individu</em> yang disembunyikan (harga beda karena HP-mu iPhone, atau karena kamu &ldquo;terlihat mampu&rdquo;). Uji koran: &ldquo;berani tidak praktik ini jadi headline?&rdquo; Jika tidak — jangan lakukan. Di Indonesia, personalisasi harga diam-diam = bom reputasi.</p>
<h3>3. &ldquo;Bagaimana mengetes harga tanpa membuat pelanggan marah?&rdquo;</h3>
<p><strong>Geo-experiment</strong> (kota A vs kota B, MK10) — pelanggan tidak pernah tahu mereka &ldquo;dites&rdquo;. Alternatif: tes pada <strong>produk baru/varian baru</strong> (tidak ada jangkar harga lama), atau <strong>bundling</strong> (ubah isi paket, bukan harga satuan — persepsi lebih halus). Yang dihindari: A/B test harga acak per orang di produk yang sama — ketika ketahuan (dan <em>akan</em> ketahuan via screenshot), kepercayaan hancur.</p>
<h3>4. &ldquo;MAP (Minimum Advertised Price) — perlu?&rdquo;</h3>
<p>Jika kamu produsen yang jual via banyak reseller: <strong>ya</strong>. Tanpa MAP, reseller perang harga → harga pasar anjlok → brand-mu terlihat murahan &amp; reseller premium pergi. MAP bukan kartel harga (mereka tetap boleh jual di bawah via nego privat) — ia hanya menjaga <strong>harga yang terlihat publik</strong>. Tegakkan konsisten; MAP yang tebang pilih = konflik channel.</p>
<h3>5. &ldquo;Naik harga di tengah inflasi — bagaimana caranya?&rdquo;</h3>
<p>Tiga teknik: (a) <strong>shrinkflation</strong> (kecilkan isi, harga tetap) — efektif tapi awas backlash jika ketahuan; (b) <strong>naik bertahap kecil</strong> (3–5% per kuartal, bukan 20% sekaligus) — di bawah radar persepsi; (c) <strong>tambah value</strong> (varian &ldquo;baru &amp; lebih baik&rdquo; dengan harga baru — jangkar lama tidak relevan). Yang terpenting: <strong>komunikasikan alasannya</strong> (biaya bahan baku naik) — pelanggan memaafkan kenaikan yang dijelaskan, membenci yang diam-diam.</p>
<h3>6. &ldquo;Freemium vs trial — mana yang lebih baik untuk akuisisi?&rdquo;</h3>
<p><strong>Trial berbayar-waktu</strong> (14 hari full fitur) konversi ke bayar 15–25%; <strong>freemium</strong> konversi 2–5% tapi akuisisi 10x lipat. Pilih trial jika: produk butuh &ldquo;aha moment&rdquo; cepat &amp; sales cycle pendek. Pilih freemium jika: network effect (makin banyak gratis makin berharga) atau pasar sangat besar. Jebakan freemium: <strong>gratis yang terlalu enak</strong> — tidak ada alasan upgrade. Desain batasnya di titik &ldquo;nyaman untuk coba, sempit untuk serius&rdquo;.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: pricing bukan tentang angka — tentang <em>persepsi, keadilan, dan kepercayaan</em>. Rumus memberi titik awal; psikologi &amp; etika menentukan apakah titik itu bisa dipertahankan. Harga yang &ldquo;optimal&rdquo; tapi menghancurkan kepercayaan = harga termahal yang pernah kamu tetapkan.</strong></p>
</div>

            <h2 id="tambahan-kit">🧰 Kit Kerja: Audit Pricing 1 Jam — 10 Pertanyaan yang Menemukan Uang Hilang</h2>
<p>Audit cepat untuk produk/lini bisnis apa pun. Siapkan: data harga, volume, dan promo 12 bulan terakhir. Jawab 10 pertanyaan ini — tiap &ldquo;tidak tahu&rdquo; = uang yang mungkin hilang.</p>
<div className="callout">
<ol>
<li><strong>Berapa elastisitas kita — dan dari mana angkanya?</strong> Jika jawabannya &ldquo;belum pernah dihitung&rdquo;, semua keputusan harga = feeling. Mulai dari eksperimen geo kecil.</li>
<li><strong>Berapa harga efektif rata-rata (setelah semua diskon)?</strong> Jika selisih harga katalog vs harga efektif &gt; 25%, kamu tidak menjual dengan harga yang kamu kira.</li>
<li><strong>Berapa % &ldquo;lift promo&rdquo; yang forward-buying?</strong> Bandingkan penjualan 8 minggu pasca-promo vs baseline. Jika &gt; 50% lift menguap, promonya memindahkan waktu beli — bukan menciptakan demand.</li>
<li><strong>Siapa yang dapat diskon tapi akan beli juga?</strong> (Sure things.) Jika &gt; 30% penerima promo adalah pelanggan setia frekuensi tinggi, promonya subsidi — targetkan ulang dengan uplift (MK11).</li>
<li><strong>Apakah ada kanibalisasi antar-varian?</strong> Saat varian A promo, apa yang terjadi ke varian B? Jika B turun &gt; 20%, hitung <strong>profit portofolio</strong>, bukan revenue A.</li>
<li><strong>Kapan terakhir naik harga — dan apa yang terjadi?</strong> Jika tidak pernah dalam 2 tahun sementara biaya naik, marginmu tergerus diam-diam. Inflasi = pajak bagi yang tidak berani menyesuaikan harga.</li>
<li><strong>Apakah harga kita konsisten antar-channel?</strong> Selisih &gt; 10% antara online-offline-marketplace = pelanggan arbitrase &amp; reseller protes. Tentukan <em>price ladder</em> yang disengaja.</li>
<li><strong>Berapa jangkar harga di benak pelanggan?</strong> Survei cepat 100 pelanggan: &ldquo;harga wajar produk ini?&rdquo; Jika jawabannya = harga promo, jangkarmu rusak — butuh periode &ldquo;puasa promo&rdquo;.</li>
<li><strong>Apakah kompetitor mengikuti perubahan harga kita?</strong> Jika ya dalam &lt; 2 minggu, kamu di pasar <strong>bertrand</strong> — keunggulan harga tidak bertahan; pindah ke diferensiasi.</li>
<li><strong>Siapa pemilik keputusan harga?</strong> Jika &ldquo;tidak jelas&rdquo; / &ldquo;semua orang&rdquo;, harga ditetapkan oleh inersia — dan inersia selalu mengarah ke margin yang menyusut.</li>
</ol>
</div>
<h3>Cara memakai hasil audit</h3>
<p>Hitung skor: tiap jawaban &ldquo;tidak tahu&rdquo; = 1 poin merah. <strong>0–2:</strong> pricing-mu sehat, fokus ke optimasi lanjutan (segmentasi harga). <strong>3–5:</strong> ada kebocoran — prioritaskan 2 merah terbesar kuartal ini. <strong>6+:</strong> jangan sentuh taktik dulu; bangun <strong>fondasi</strong>: definisikan pemilik harga, ukur elastisitas, rapikan kalender promo. Pengalaman: perusahaan dengan skor 6+ yang langsung &ldquo;optimasi harga dengan AI&rdquo; biasanya hanya mengotomasi kekacauan.</p>
<details className="worked">
<summary>📐 Contoh: Skor audit sebuah brand FMCG (klik untuk buka)</summary>
<p>Brand &ldquo;SegarPagi&rdquo; (minuman): tidak tahu elastisitas (1), harga efektif 32% di bawah katalog (2), 60% lift promo = forward-buying (3), 40% penerima promo = pelanggan setia (4), tidak tahu kanibalisasi varian (5), belum naik harga 3 tahun (6), harga marketplace 15% di bawah official store (7). <strong>Skor: 7 — merah.</strong></p>
<p><strong>Rencana 90 hari:</strong> (1) tetapkan pemilik harga (direktur komersial); (2) samakan harga marketplace (tegakkan MAP); (3) puasa promo 2 bulan untuk reset jangkar; (4) eksperimen geo untuk elastisitas. Hasil: margin naik 4,2 poin dalam 2 kuartal <strong>tanpa</strong> menaikkan harga katalog — murni dari menghentikan kebocoran.</p>
<p><strong>Pelajaran:</strong> sebagian besar &ldquo;masalah pricing&rdquo; bukan soal harga yang salah — melainkan soal <strong>tidak ada yang mengukur</strong>. Audit 1 jam ini menemukan lebih banyak uang hilang daripada model elastisitas secanggih apa pun yang dibangun di atas data yang tidak dipahami.</p>
</details>
<div className="tip">
<p><strong>💡 Jalankan audit ini tiap 6 bulan. Pricing bukan proyek sekali jalan — ia seperti kebun: tanpa disiangi rutin, gulma (diskon liar, kanibalisasi, jangkar rusak) tumbuh sendiri.</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Elastisitas</strong> = %ΔQ/%ΔP; |E|&gt;1 elastis (promo), |E|&lt;1 inelastis (naikkan harga); selalu dengan margin.</li>
<li><strong>Lift bersih</strong> = (promo − baseline − forward − kanibal)/baseline; ukur pasca-promo.</li>
<li><strong>ROI promo</strong> = (margin inkremental − kanibalisasi − biaya)/biaya; metrik = profit, bukan volume.</li>
<li><strong>Kanibalisasi</strong>: ke margin lebih tinggi = strategi; ke bawah = bunuh diri; ukur portofolio.</li>
<li><strong>Promo trap</strong>: harga referensi rusak → pelanggan menunggu promo berikutnya.</li>
<li><strong>Kapan TIDAK promo</strong>: inelastis, margin tipis, atau tanpa jendela ukur pasca.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk13-mmm" className="btn btn-secondary btn-sm">← MK13</Link>
        <Link href="/learn/mk15-forecasting" className="btn btn-primary btn-sm">MK15 →</Link>
      </div>
    </div>
  );
}

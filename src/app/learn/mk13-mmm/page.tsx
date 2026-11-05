"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk13MmmPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK13 — Marketing Data Analytics</span>
        <h1 className="display-title">Marketing Mix Modeling:<br/>Mengukur yang Tak Bisa Di-A/B</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Model Rp2 Miliar yang Bilang 'Potong TV' — Lalu Menyesal</a></li>
<li><a href="#dekomposisi">Dekomposisi MMM</a></li>
<li><a href="#adstock">Adstock & Saturasi</a></li>
<li><a href="#bayes">Bayesian MMM & Kalibrasi</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika "Berapa Sumbangan Iklan?"</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Konsultan Rp2 Miliar</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: MMM yang Menyelamatkan Brand Rp20 Miliar</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis MMM</a></li>
<li><a href="#extra3">📋 Playbook: MMM 1 Halaman</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#mmmpraktis">🔬 MMM Praktis: Dari Data ke Keputusan</a></li>
<li><a href="#startup">📊 Studi Kasus: MMM untuk Startup</a></li>
<li><a href="#kisahmmm">📖 Kisah Nyata: MMM yang Menyelamatkan Rp50 Miliar</a></li>
<li><a href="#tambahan-saturasi">📐 Worked Example: Kurva Saturasi</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Teh Nusantara</a></li>
<li><a href="#tambahan-faq">❓ FAQ MMM</a></li>
<li><a href="#tambahan-playbook">📋 Playbook: MMM 8 Minggu</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan dekomposisi MMM: base sales vs kontribusi tiap channel.</li>
<li>Menerapkan transformasi adstock & saturasi dan menjelaskan intuisinya.</li>
<li>Menjelaskan kenapa MMM butuh kontrol (musiman, harga, distribusi) — omitted variable bias.</li>
<li>Menjelaskan peran prior dalam Bayesian MMM dan kenapa kalibrasi eksperimen wajib.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Model Rp2 Miliar yang Bilang 'Potong TV' — Lalu Menyesal</h2>
      <div className="story">
        <p>FMCG <em>&ldquo;RasaNusa&rdquo;</em> membayar konsultan Rp2 miliar untuk MMM. Model berkata: <strong>TV ROI-nya 0,8 — potong!</strong> Budget TV dialihkan ke digital. Setahun kemudian, <strong>brand awareness anjlok 15 poin</strong>, dan penjualan ikut turun 8% — digital tidak bisa menutup lubang yang ditinggalkan TV.</p>
<p>Twist-nya: MMM-nya <strong>tidak salah hitung — tapi salah spesifikasi</strong>. Model tidak memasukkan <em>brand equity</em> sebagai variabel (hanya penjualan mingguan), tidak dikalibrasi dengan eksperimen apa pun, dan prior-nya asal. MMM tanpa kalibrasi = <strong>opini mahal berbaju matematika</strong>. Lesson ini: cara membangun (dan tidak dibodohi) MMM.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="dekomposisi">Dekomposisi — Memisahkan 'Dasar' dari 'Usaha'</h2>
<p><strong>Definisi.</strong> <strong>MMM</strong> memodelkan penjualan sebagai: <strong>base sales</strong> (yang terjadi tanpa marketing — loyalis, distribusi, musim) + <strong>incremental</strong> tiap channel (kontribusi iklan) + kontrol. Output: kontribusi % per channel, ROI per channel, dan <strong>kurva respons</strong> untuk alokasi optimal.</p>
<p>Data: agregat mingguan (2–3 tahun!), spend per channel, penjualan, + kontrol (harga, promo, distribusi, musiman, kompetitor bila ada). <strong>Tanpa variasi spend yang cukup</strong>, model tidak bisa memisahkan efek channel (kolinearitas) — ini syarat data yang sering dilanggar.</p>
<Tex math={String.raw`y_t = \alpha + \sum_{c} \beta_c \cdot f_c(\text{adstock}_c(\text{spend}_{c,t})) + \gamma X_t + \varepsilon_t`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`y_t`} />: penjualan minggu t</li>
<li><Tex math={String.raw`\alpha`} />: base sales — penjualan tanpa marketing</li>
<li><Tex math={String.raw`f_c`} />: fungsi saturasi channel c (diminishing return)</li>
<li><Tex math={String.raw`X_t`} />: kontrol (harga, musim, distribusi, promo)</li>
<li><Tex math={String.raw`\beta_c`} />: efektivitas channel c — yang diterjemahkan jadi ROI</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> MMM seperti <strong>mengurai sup</strong>: kuah dasar (base sales — merek & distribusi yang sudah ada) + bumbu tiap channel (incremental). Koki yang baik tahu berapa sendok garam (TV) vs merica (digital) yang pas — dan tahu kuahnya tetap ada tanpa bumbu (tapi hambar).</p>
<p><strong>Kapan dipakai:</strong> Alokasi budget antar-channel tahunan, channel tak bisa di-A/B (TV/OOH), butuh 'satu angka' per channel untuk direksi. Butuh 2–3 tahun data mingguan.</p>
<details className="worked">
<summary>📐 Contoh: Dekomposisi RasaNusa (klik untuk buka)</summary>
<p>Penjualan Rp100M/minggu: base Rp60M (60%), TV Rp15M, digital Rp12M, promo Rp8M, musiman Rp5M.</p>
<p><strong>ROI:</strong> TV: 15M/10M spend = 1,5. Digital: 12M/6M = 2,0. <strong>Rekomendasi naif:</strong> geser TV → digital.</p>
<p><strong>Tapi:</strong> kurva respons TV masih menanjak di spend saat ini (belum saturasi), digital sudah datar (saturasi!). Rupiah <em>berikutnya</em> lebih baik di TV. <strong>Keputusan alokasi = marginal ROI, bukan rata-rata ROI</strong> — pelajaran yang hanya terlihat dari kurva saturasi, bukan tabel.</p>
</details>
<PlotlyChart
  data={[{x: ["Base", "TV", "Digital", "Promo", "Musiman"], y: [60, 15, 12, 8, 5], type: "bar", marker: {color: ["#94a3b8","#2a7de1","#e8a838","#16a34a","#94a3b8"]}, text: ["60%","15%","12%","8%","5%"], textposition: "outside"}]}
  title={"Dekomposisi penjualan RasaNusa (Rp M/minggu)"}
  layout={{yaxis: {title: "Kontribusi (Rp M)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = kontribusi tiap komponen ke penjualan mingguan. Base = abu-abu (bukan hasil marketing).</p>
<p><strong>Interpretasi:</strong> 60% penjualan = base (bukan karena iklan!). Dari 40% yang 'bisa diperebutkan', TV 15M vs digital 12M. Analis yang hanya lapor 'total penjualan naik' mengklaim 60% yang bukan jasanya — dekomposisi memaksa kejujuran.</p>
</div>
<h2 id="adstock">Adstock & Saturasi — Iklan Punya Gema dan Batas</h2>
<p><strong>Definisi.</strong> <strong>Adstock</strong>: efek iklan tidak hilang minggu itu juga — ada <strong>carryover</strong> (gema): adstock minggu ini = spend minggu ini + λ × adstock minggu lalu (λ = daya tahan, 0–1). <strong>Saturasi</strong>: <strong>diminishing return</strong> — rupiah ke-100 juta kurang efektif dari rupiah pertama. Bentuk umum: fungsi Hill/log: f(x) = x^α/(x^α + k^α) atau logaritmik.</p>
<p>Tanpa adstock: model meremehkan channel brand-building (TV) yang efeknya menumpuk. Tanpa saturasi: model menyarankan 'tambah terus' sampai tak masuk akal.</p>
<Tex math={String.raw`\text{adstock}_t = s_t + \lambda \cdot \text{adstock}_{t-1} \quad;\quad f(x) = \frac{x^{\alpha}}{x^{\alpha} + k^{\alpha}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`s_t`} />: spend minggu t</li>
<li><Tex math={String.raw`\lambda`} />: carryover (0,5 = separuh efek terbawa ke minggu depan; TV ~0,7, digital ~0,3)</li>
<li><Tex math={String.raw`f(x)`} />: fungsi saturasi Hill — S-curve: lambat di awal, curam di tengah, datar di puncak</li>
<li><Tex math={String.raw`k`} />: titik tengah saturasi (setengah efek maksimal)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Adstock seperti <strong>gema di lembah</strong>: teriakan (iklan) minggu ini masih terdengar samar minggu depan. Saturasi seperti <strong>menyiram tanaman</strong>: gelas pertama menyegarkan, gelas ke-10 menggenang sia-sia. Model tanpa keduanya = tuli dan buta.</p>
<p><strong>Kapan dipakai:</strong> Selalu dalam MMM. λ dan α diestimasi dari data (atau prior) — jangan asal 0,5.</p>
<details className="worked">
<summary>📐 Contoh: Adstock TV vs digital (klik untuk buka)</summary>
<p>Spend minggu 1: TV Rp10M (λ=0,7), digital Rp10M (λ=0,3). Tidak ada spend lagi.</p>
<p><strong>Adstock minggu 2:</strong> TV = 0 + 0,7×10 = <strong>7,0M</strong>; digital = 0,3×10 = <strong>3,0M</strong>. <strong>Minggu 4:</strong> TV = 3,4M; digital = 0,3M.</p>
<p><strong>Implikasi:</strong> TV 'bekerja' 4+ minggu setelah tayang — evaluasi TV mingguan (tanpa adstock) meremehkannya sistematis. Inilah salah satu alasan MMM RasaNusa yang asal bilang 'TV ROI 0,8'.</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8], y: [10,7,4.9,3.4,2.4,1.7,1.2,0.8], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "TV (λ=0,7)"}, {x: [1,2,3,4,5,6,7,8], y: [10,3,0.9,0.27,0.08,0.02,0.01,0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "Digital (λ=0,3)"}]}
  title={"Adstock decay: gema TV vs digital"}
  layout={{xaxis: {title: "Minggu setelah spend"}, yaxis: {title: "Adstock tersisa (Rp M)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = minggu setelah spend Rp10M di minggu 1, Y = sisa efek. Biru = TV, kuning = digital.</p>
<p><strong>Interpretasi:</strong> TV masih 'berbunyi' di minggu ke-8 (0,8M); digital hilang di minggu ke-4. Evaluasi mingguan tanpa adstock = menghukum sistematis channel bergema panjang. Beda λ = beda cara membaca ROI.</p>
</div>
<PlotlyChart
  data={[{x: [2,5,10,15,20,30,40], y: [3,7,11,13.5,15,16.2,16.8], type: "scatter", mode: "lines+markers", marker: {color: "#16a34a"}, name: "respons"}]}
  title={"Kurva saturasi: rupiah berikutnya makin 'mahal'"}
  layout={{xaxis: {title: "Spend (Rp M)"}, yaxis: {title: "Incremental sales (Rp M)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = spend, Y = penjualan tambahan. Kemiringan = marginal ROI.</p>
<p><strong>Interpretasi:</strong> Rp2→5M: +4M sales (miring curam). Rp30→40M: +0,6M (hampir datar). <strong>Alokasi optimal: samakan marginal ROI antar channel</strong> — bukan rata-rata ROI. Inilah grafik yang seharusnya menentukan budget, bukan tabel ROI.</p>
</div>
<h2 id="bayes">Bayesian & Kalibrasi — Prior yang Jujur, Bukti yang Nyata</h2>
<p><strong>Definisi.</strong> <strong>Bayesian MMM</strong>: bukan mencari satu angka β, tapi <strong>distribusi</strong> — dengan <strong>prior</strong> (keyakinan awal: 'TV ROI 1–3 dari studi industri', bukan 'bebas 0–100'). Prior mencegah model ngawur saat data tipis (kolinearitas spend TV & digital). Output = interval kredibel ('ROI TV 1,2–2,1'), bukan titik.</p>
<p><strong>Kalibrasi</strong>: <em>wajib</em> — cocokkan MMM dengan <strong>hasil eksperimen</strong> (geo-lift, holdout). Jika MMM bilang TV ROI 0,8 tapi geo-experiment bilang 1,5 → percayai eksperimen, setel prior/model. MMM tanpa kalibrasi = opini mahal (kasus RasaNusa Rp2M).</p>
<p><strong>Kepribadian/intuisi:</strong> Prior seperti <strong>nasihat mentor</strong>: 'dari 20 studi, TV FMCG ROI-nya 1–3'. Tanpa mentor (prior datar), anak magang (model) dengan data 2 tahun yang berisik bisa menyimpulkan 'TV ROI 0,01 atau 50' — keduanya ngawur. Kalibrasi = 'buktikan nasihatmu dengan eksperimen'.</p>
<p><strong>Kapan dipakai:</strong> Selalu pakai prior informatif (dari eksperimen/studi) untuk channel utama. Kalibrasi minimal 1x/tahun dengan geo/holdout.</p>
<details className="worked">
<summary>📐 Contoh: Kalibrasi RasaNusa (klik untuk buka)</summary>
<p>MMM awal: TV ROI 0,8 (prior datar). Geo-experiment: TV ROI 1,5 (inkremental).</p>
<p><strong>Kalibrasi:</strong> set prior TV ~ Normal(1,5; 0,3) dari eksperimen → MMM diestimasi ulang → TV ROI 1,4 (CI 1,1–1,8). <strong>Rekomendasi berubah:</strong> bukan 'potong TV', tapi 'optimasi kreatif TV + alokasi marginal'.</p>
<p><strong>Pelajaran Rp2M:</strong> model termahal pun butuh jangkar realitas. Eksperimen Rp100jt menghemat kesalahan Rp2M + brand awareness 15 poin.</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika &ldquo;Berapa Sumbangan Iklan?&rdquo;</h2>
<p><strong>MMM</strong> (Marketing Mix Modeling) = <strong>regresi</strong> raksasa: &ldquo;revenue = base + iklan TV + iklan digital + promo + musim + ...&rdquo;. <strong>Pertanyaan:</strong> &ldquo;dari Rp100 miliar revenue, <strong>berapa</strong> karena iklan? <strong>channel</strong> mana? <strong>berapa</strong> lagi jika tambah Rp1 miliar?&rdquo; Tiga pendalaman: (1) dekomposisi; (2) adstock &amp; saturasi; (3) Bayesian &amp; kalibrasi.</p>
<h3>1. Dekomposisi — Memisahkan &ldquo;Base&rdquo; dari &ldquo;Iklan&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>Dekomposisi</strong> = memecah revenue jadi <strong>komponen</strong>: <strong>base</strong> (yang <strong>terjadi anyway</strong>! brand! loyalitas!), <strong>incremental</strong> (karena <strong>iklan</strong>!), <strong>musiman</strong> (Lebaran! Natal!), <strong>promo</strong>, <strong>kompetitor</strong>, <strong>noise</strong>.</p>
<p><strong>Kepribadian:</strong> seperti <strong>dokter</strong> yang memisahkan &ldquo;demam karena <strong>infeksi</strong>&rdquo; vs &ldquo;demam karena <strong>kepanasan</strong>&rdquo; — <strong>pengobatan</strong> beda! <strong>Base</strong> = &ldquo;sehat sendiri&rdquo; (<strong>jangan</strong> klaim sebagai &ldquo;hasil iklan&rdquo;!). <strong>Incremental</strong> = &ldquo;karena obat&rdquo; (<strong>ini</strong> yang diukur!).</p>
<p><strong>Rumus (konsep):</strong></p>
<Tex math={String.raw`Y_t = \alpha + \beta \cdot f(X_t) + \gamma \cdot Z_t + \epsilon_t`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`Y_t`} /> = revenue minggu t; <Tex math={String.raw`\alpha`} /> = <strong>base</strong> (tanpa iklan!); <Tex math={String.raw`f(X_t)`} /> = iklan <strong>ditransformasi</strong> (adstock! saturasi!); <Tex math={String.raw`\beta`} /> = <strong>efektivitas</strong>; <Tex math={String.raw`Z_t`} /> = <strong>kontrol</strong> (musim! harga! kompetitor!); <Tex math={String.raw`\epsilon_t`} /> = noise.</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> MMM! <strong>Base vs incremental</strong> = <strong>pertanyaan pertama</strong> &amp; <strong>tersulit</strong> (butuh <strong>kontrol</strong> yang bagus!).</p>
<details className="worked">
<summary>📐 Contoh 1: Dekomposisi Rp100 miliar (klik untuk buka)</summary>
<p>Revenue tahunan Rp100M. MMM:</p>
<p><strong>Base</strong> (α): <strong>Rp55M</strong> (55%! — brand! langganan!). <strong>Iklan TV:</strong> Rp15M. <strong>Digital:</strong> Rp12M. <strong>Promo:</strong> Rp8M. <strong>Musiman:</strong> Rp7M. <strong>Noise:</strong> Rp3M.</p>
<p><strong>Total incremental iklan</strong> = 15+12 = <strong>Rp27M</strong> (bukan <strong>Rp100M</strong>!). <strong>ROI iklan</strong> = 27M / spend (mis. Rp20M) = <strong>1,35</strong> (bukan <strong>5,0</strong> jika pakai <strong>total</strong> revenue!).</p>
<p><strong>Pelajaran:</strong> <strong>jangan</strong> bagi <strong>total</strong> revenue dengan <strong>spend</strong>! Itu = <strong>klaim base</strong> sebagai &ldquo;hasil iklan&rdquo; = <strong>penipuan diri</strong>. <strong>Dekomposisi</strong> = <strong>kejujuran</strong>.</p>
</details>
<h3>2. Adstock &amp; Saturasi — Dua Transformasi Wajib</h3>
<p><strong>Adstock:</strong> iklan <strong>minggu lalu</strong> masih <strong>berpengaruh</strong> hari ini! (Kamu <strong>ingat</strong> iklan kemarin!). <strong>Transformasi:</strong> <strong>adstock</strong> = spend hari ini + <strong>λ</strong> × adstock kemarin.</p>
<p><strong>Saturasi:</strong> Rp1 miliar <strong>pertama</strong> lebih <strong>berpengaruh</strong> dari Rp1 miliar <strong>kesepuluh</strong>! (<strong>Diminishing returns</strong>!). <strong>Transformasi:</strong> <strong>Hill</strong> atau <strong>log</strong>.</p>
<p><strong>Kepribadian:</strong> <strong>Adstock</strong> = <strong>gema</strong> (teriakan kemarin masih <strong>terdengar</strong>!). <strong>Saturasi</strong> = <strong>kenyang</strong> (nasi <strong>piring pertama</strong> nikmat, <strong>piring kelima</strong> mual!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Selalu</strong> di MMM! <strong>Tanpa</strong> adstock = <strong>meremehkan</strong> iklan (lupa <strong>gema</strong>!). <strong>Tanpa</strong> saturasi = <strong>melebihkan</strong> spend besar (lupa <strong>kenyang</strong>!).</p>
<Tex math={String.raw`A_t = X_t + \lambda A_{t-1}`} block />
<p><strong>Adstock:</strong> <Tex math={String.raw`A_t`} /> = adstock minggu t; <Tex math={String.raw`X_t`} /> = spend; <Tex math={String.raw`\lambda`} /> = <strong>decay</strong> (0,5 = <strong>setengah</strong> hilang tiap minggu!). <strong>λ tinggi</strong> = <strong>ingatan panjang</strong> (TV!). <strong>λ rendah</strong> = <strong>ingatan pendek</strong> (search!).</p>
<Tex math={String.raw`S(x) = \frac{x^a}{x^a + k^a}`} block />
<p><strong>Saturasi (Hill):</strong> <Tex math={String.raw`x`} /> = adstock; <Tex math={String.raw`k`} /> = <strong>titik tengah</strong> (setengah jenuh!); <Tex math={String.raw`a`} /> = <strong>kecuraman</strong>. <strong>x kecil</strong> → <strong>linear</strong>. <strong>x besar</strong> → <strong>datar</strong> (jenuh!).</p>
<details className="worked">
<summary>📐 Contoh 2a: Adstock dalam angka (klik untuk buka)</summary>
<p>Spend TV: minggu 1 = Rp1M, minggu 2 = Rp0, minggu 3 = Rp0. λ = 0,5.</p>
<p><strong>Minggu 1:</strong> A_1 = 1M + 0,5×0 = <strong>Rp1M</strong>.</p>
<p><strong>Minggu 2:</strong> A_2 = 0 + 0,5×1M = <strong>Rp500jt</strong> (<strong>gema</strong>! spend <strong>nol</strong> tapi <strong>efek</strong> masih ada!).</p>
<p><strong>Minggu 3:</strong> A_3 = 0 + 0,5×500jt = <strong>Rp250jt</strong> (gema <strong>memudar</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>tanpa</strong> adstock, minggu 2–3 = <strong>&ldquo;iklan tidak bekerja&rdquo;</strong> (spend nol!). <strong>Dengan</strong> adstock = <strong>&ldquo;iklan masih bergema&rdquo;</strong>. <strong>Beda</strong> kesimpulan!</p>
</details>
<details className="worked">
<summary>📐 Contoh 2b: Saturasi dalam angka (klik untuk buka)</summary>
<p>Hill: k=Rp500jt, a=2. <strong>x=Rp100jt:</strong> S = 100²/(100²+500²) = 10.000/260.000 = <strong>0,038</strong>. <strong>x=Rp500jt:</strong> S = 250.000/500.000 = <strong>0,50</strong>. <strong>x=Rp2M:</strong> S = 4jt/4,25jt = <strong>0,94</strong>.</p>
<p><strong>Marginal:</strong> 100→500jt (+400jt!) = +0,46. 500jt→2M (+1,5M!) = +0,44. <strong>Rp1,5M tambahan</strong> hanya = <strong>Rp400jt pertama</strong>! <strong>Jenuh!</strong></p>
<p><strong>Pelajaran:</strong> <strong>titik optimal</strong> ≈ <strong>k</strong> (Rp500jt!). <strong>Lebih</strong> = <strong>buang</strong>. <strong>MMM</strong> menemukan <strong>titik</strong> ini!</p>
</details>
<h3>3. Bayesian &amp; Kalibrasi — Menggabungkan Data + Pengetahuan</h3>
<p><strong>Bayesian MMM:</strong> gabungkan <strong>data</strong> (likelihood!) + <strong>pengetahuan prior</strong> (eksperimen! intuisi!) → <strong>posterior</strong>. <strong>Kalibrasi:</strong> &ldquo;paksa&rdquo; MMM agar <strong>konsisten</strong> dengan <strong>hasil eksperimen</strong> (MK10!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>hakim</strong> yang mendengar <strong>saksi</strong> (data!) + <strong>ahli</strong> (prior!) — <strong>keputusan</strong> lebih <strong>bijak</strong> dari <strong>saksi saja</strong>. <strong>Kalibrasi</strong> = <strong>&ldquo;hakim, ini bukti forensik!&rdquo;</strong> (eksperimen! — <strong>tidak bisa</strong> diabaikan!).</p>
<p><strong>Mengapa Bayesian?</strong> <strong>(a)</strong> Data <strong>sedikit</strong> (2 tahun mingguan = <strong>104 titik</strong>! — <strong>frequentist</strong> goyah!). <strong>(b)</strong> Prior <strong>masuk akal</strong> (&ldquo;TV <strong>tidak</strong> mungkin ROI 10x!&rdquo;). <strong>(c)</strong> <strong>Uncertainty</strong> (interval! bukan <strong>titik</strong>!).</p>
<p><strong>Kalibrasi:</strong> jika <strong>eksperimen</strong> bilang &ldquo;TV ROI 1,5&rdquo; tapi MMM bilang &ldquo;3,0&rdquo; → <strong>kalibrasi</strong> (prior <strong>kuat</strong> di 1,5!). <strong>Hasil:</strong> MMM yang <strong>konsisten</strong> dengan <strong>kebenaran eksperimental</strong>.</p>
<p><strong>Kapan dipakai:</strong> <strong>Selalu</strong> untuk MMM modern! <strong>Library:</strong> <strong>LightweightMMM</strong> (Google!), <strong>PyMC-Marketing</strong>!</p>
<details className="worked">
<summary>📐 Contoh 3: Kalibrasi menyelamatkan MMM (klik untuk buka)</summary>
<p>MMM <strong>tanpa</strong> kalibrasi: TV ROI <strong>3,5</strong>, Digital ROI <strong>0,8</strong>. <strong>Rekomendasi:</strong> &ldquo;all-in TV!&rdquo;</p>
<p><strong>Eksperimen</strong> (geo-test!): TV ROI <strong>1,2</strong> (bukan 3,5!). Digital ROI <strong>1,5</strong> (bukan 0,8!). <strong>MMM salah besar!</strong> (TV <strong>overestimate</strong> 3x! Digital <strong>underestimate</strong> 2x!).</p>
<p><strong>Kalibrasi:</strong> prior TV ~ 1,2 (±0,3!), Digital ~ 1,5 (±0,3!). <strong>MMM baru:</strong> TV <strong>1,3</strong>, Digital <strong>1,4</strong>. <strong>Rekomendasi:</strong> <strong>seimbang</strong> (bukan all-in!).</p>
<p><strong>Pelajaran:</strong> <strong>MMM tanpa kalibrasi</strong> = <strong>opini</strong>. <strong>MMM dengan kalibrasi</strong> = <strong>opini + bukti</strong>. <strong>Eksperimen</strong> = <strong>jangkar kebenaran</strong>.</p>
</details>
<PlotlyChart
  data={[{x: [100, 300, 500, 800, 1200, 2000], y: [0.038, 0.26, 0.5, 0.72, 0.85, 0.94], type: "scatter", mode: "lines+markers", name: "Hill (k=500, a=2)", line: {color: "#2a7de1", width: 3}}, {x: [100, 300, 500, 800, 1200, 2000], y: [0.1, 0.3, 0.5, 0.8, 1.2, 2.0], type: "scatter", mode: "lines", name: "Linear (tanpa saturasi)", line: {dash: "dash", color: "#94a3b8"}}]}
  title={"Saturasi: Rp2M tidak = 20x Rp100jt"}
  layout={{yaxis: {title: "Efek (ternormalisasi)"}, xaxis: {title: "Spend (Rp juta)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = spend. Sumbu Y = efek. Biru = <strong>Hill</strong> (saturasi!). Abu-abu = <strong>linear</strong> (tanpa saturasi!).</p>
<p><strong>Interpretasi:</strong> Hill <strong>mendatar</strong> setelah ~Rp800jt (<strong>jenuh</strong>!). Linear <strong>naik terus</strong> (<strong>salah</strong>! — tidak ada <strong>kenyang</strong>!). <strong>Tanpa</strong> saturasi = <strong>rekomendasi</strong> &ldquo;spend <strong>tanpa batas</strong>&rdquo; = <strong>bencana</strong>!</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;MMM = kebenaran ilmiah tentang ROI tiap channel. Model mahal = pasti benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> MMM = <strong>satu estimasi dengan asumsi</strong> (adstock, saturasi, kontrol, prior). Tanpa kalibrasi eksperimen, ia 'opini mahal berbaju matematika' (RasaNusa: Rp2M untuk rekomendasi yang merusak brand). Selalu tanya: 'dik alibrasi dengan eksperimen apa?' — tidak ada = diskon 90% kepercayaannya.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau sudah ada atribusi digital yang detail, MMM tidak perlu.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Atribusi buta terhadap <strong>TV/OOH/brand</strong> dan <strong>baseline</strong> (60% penjualan RasaNusa!). MMM melihat portofolio penuh + base vs incremental. Keduanya komplemen: MMM untuk alokasi strategis tahunan, atribusi untuk optimasi taktis harian, eksperimen untuk kalibrasi.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Keputusan alokasi = marginal ROI, bukan rata-rata.</strong> Channel dengan ROI rata-rata 3,0 tapi sudah saturasi (marginal 0,5) kalah dari channel ROI 1,5 yang masih curam (marginal 1,8). Selalu baca kurva saturasi, bukan tabel.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Syarat data MMM: variasi.</strong> Jika spend TV flat Rp10M/minggu selama 3 tahun, model tidak bisa memisahkan efek TV dari waktu (kolinearitas sempurna). Butuh 'goyangan' historis (h Flighting, promo) — atau akui ketidakpastiannya via interval lebar.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Transformasi Adstock + Saturasi</h2>
<p>Terapkan adstock lalu saturasi pada data spend — lihat bagaimana 'Rp10M' menjadi 'efek efektif'.</p>
<PyodideLab
  title={"Lab 1 — Adstock & Saturasi"}
  hint={"Ubah LAMBDA 0.7 → 0.3. Efek 'gema' memendek — channel bergema panjang vs pendek diperlakukan beda."}
  defaultCode={"# Adstock + saturasi (Hill)\nspend = [10, 10, 0, 0, 10, 0, 0, 0]  # Rp M per minggu\nLAMBDA, ALPHA, K = 0.7, 2.0, 8.0     # ubah sesukamu\n\nad, out = 0, []\nfor s in spend:\n    ad = s + LAMBDA * ad\n    sat = (ad ** ALPHA) / (ad ** ALPHA + K ** ALPHA)\n    out.append((ad, sat))\n\nprint(f\"{'mgg':>4} {'spend':>6} {'adstock':>8}  saturasi(0-1)\")\nfor i, (s, (a, f)) in enumerate(zip(spend, out), 1):\n    print(f\"{i:>4} {s:>6} {a:>8.1f}  {f:.2f}\")\nprint(\"\\nEfek 'efektif' = adstock -> saturasi, BUKAN spend mentah.\")\nprint(\"Dua transformasi ini yang membuat MMM realistis.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: MMM Mini via Regresi Manual</h2>
<p>Estimasi kontribusi channel dengan OLS sederhana (persamaan normal) pada data mingguan sintetis.</p>
<PyodideLab
  title={"Lab 2 — MMM Mini"}
  hint={"Hapus KONTROL harga dari regresi — lihat koefisien TV berubah (omitted variable bias!). Itulah kenapa kontrol wajib."}
  defaultCode={"import random\nrandom.seed(8)\n# Data sintetis 104 minggu: sales = 60 + 1.5*tv_eff + 2.0*dig_eff - 3*harga + noise\nrows = []\nfor _ in range(104):\n    tv, dig = random.uniform(5, 15), random.uniform(3, 9)\n    harga = random.uniform(0.9, 1.1)\n    sales = 60 + 1.5*tv + 2.0*dig - 30*(harga-1) + random.gauss(0, 3)\n    rows.append((1, tv, dig, harga, sales))\n\n# OLS via persamaan normal (X'X)^-1 X'y — implementasi 4x4 sederhana\ndef ols(rows):\n    n, p = len(rows), 4\n    XtX = [[sum(r[i]*r[j] for r in rows) for j in range(p)] for i in range(p)]\n    Xty = [sum(r[i]*r[4] for r in rows) for i in range(p)]\n    # eliminasi Gauss\n    M = [XtX[i] + [Xty[i]] for i in range(p)]\n    for c in range(p):\n        piv = M[c][c]\n        for r in range(c+1, p):\n            f = M[r][c]/piv\n            M[r] = [a - f*b for a, b in zip(M[r], M[c])]\n    b = [0]*p\n    for c in range(p-1, -1, -1):\n        b[c] = (M[c][p] - sum(M[c][j]*b[j] for j in range(c+1, p)))/M[c][c]\n    return b\n\nb = ols(rows)\nprint(\"Koefisien (true: base=60, tv=1.5, dig=2.0, harga=-30):\")\nfor nama, v in zip([\"base\", \"tv\", \"digital\", \"harga\"], b):\n    print(f\"  {nama:<8} {v:7.2f}\")\nprint(\"\\nROI: tv =\", f\"{b[1]:.2f}\", \"| digital =\", f\"{b[2]:.2f}\", \"(per Rp1M spend)\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Alokasi budget tahunan antar-channel → <strong>MMM (dengan kalibrasi)</strong></h3>
<p><strong>Kenapa:</strong> Satu-satunya yang melihat portofolio penuh + base vs incremental.</p>
<p><strong>Contoh nyata:</strong> Split TV vs digital vs promo tahun depan.</p>
</div>
<div className="decision-card">
<h3>2. Optimasi taktis harian/mingguan digital → <strong>Atribusi + eksperimen (bukan MMM)</strong></h3>
<p><strong>Kenapa:</strong> MMM terlalu lambat & agregat untuk bidding harian.</p>
<p><strong>Contoh nyata:</strong> Alokasi antar ad-set Meta.</p>
</div>
<div className="decision-card">
<h3>3. Validasi angka MMM → <strong>Geo/holdout experiment</strong></h3>
<p><strong>Kenapa:</strong> MMM tanpa kalibrasi = opini mahal.</p>
<p><strong>Contoh nyata:</strong> Kalibrasi tahunan RasaNusa.</p>
</div>
<div className="decision-card">
<h3>4. Data &lt; 2 tahun / spend flat → <strong>Jangan MMM dulu — eksperimen + heuristik</strong></h3>
<p><strong>Kenapa:</strong> Syarat data tidak terpenuhi; model akan ngawur dengan percaya diri.</p>
<p><strong>Contoh nyata:</strong> Startup 1 tahun: geo-test + aturan marginal.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Base vs incremental</strong> — pisahkan dulu.</li><li><strong>Adstock + saturasi</strong> selalu.</li><li><strong>Kontrol wajib</strong> (harga, musim, distribusi).</li><li><strong>Kalibrasi dengan eksperimen</strong> — tanpa kecuali.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: MMM yang &ldquo;Membuktikan&rdquo; TV Tidak Berguna</h3>
<p>FMCG &ldquo;RasaNusantara&rdquo;: MMM <strong>tanpa</strong> adstock. <strong>Hasil:</strong> TV ROI 0,5 (&ldquo;matikan!&rdquo;). <strong>Direksi</strong> potong TV Rp8M. <strong>Hasil:</strong> revenue <strong>turun 25%</strong>!</p>
<p><strong>Investigasi:</strong> <strong>tanpa</strong> adstock, efek <strong>gema</strong> TV (3–4 minggu!) <strong>tidak</strong> tertangkap! <strong>Dengan</strong> adstock (λ=0,6!): TV ROI <strong>1,8</strong>! <strong>TV</strong> = <strong>investasi memori</strong>, bukan <strong>transaksi instan</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>spesifikasi</strong> MMM menentukan <strong>kesimpulan</strong>. <strong>Tanpa</strong> adstock = <strong>menghukum</strong> brand-building. <strong>Dengan</strong> adstock = <strong>kebenaran</strong>. <strong>Model</strong> = <strong>pilihan</strong>, bukan <strong>fakta</strong>.</p>
<h3>Kisah 2: Kalibrasi yang Menghemat Rp5 Miliar</h3>
<p>Otomotif &ldquo;MobilKita&rdquo;: MMM <strong>tanpa</strong> kalibrasi → &ldquo;tambah digital Rp5M&rdquo; (ROI 2,5!). <strong>Geo-test</strong> (MK10!): digital ROI <strong>0,9</strong> (bukan 2,5!). <strong>Kalibrasi</strong> → rekomendasi <strong>dibatalkan</strong>. <strong>Hemat Rp5M</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>MMM</strong> = <strong>hipotesis</strong>. <strong>Eksperimen</strong> = <strong>verifikasi</strong>. <strong>Tanpa</strong> verifikasi = <strong>judi Rp5M</strong>. <strong>Dengan</strong> verifikasi = <strong>keputusan</strong>.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;MMM = kebenaran tentang iklan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> MMM = <strong>model</strong> (asumsi! spesifikasi!). <strong>Kebenaran</strong> = <strong>eksperimen</strong> (MK10!). <strong>MMM terbaik</strong> = yang <strong>dikalibrasi</strong> dengan eksperimen. <strong>Tanpa</strong> kalibrasi = <strong>opini mahal</strong>.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Konsultan Rp2 Miliar RasaNusa</h2>
<div className="callout">
<p>RasaNusa: MMM (tanpa kalibrasi, prior datar) → 'TV ROI 0,8, potong!'. Setahun kemudian: awareness −15 poin, sales −8%. Investigasi: model tanpa variabel brand, tanpa eksperimen kalibrasi.</p>
<p><strong>Pertanyaan:</strong> (a) Tiga cacat spesifikasinya? (b) Jika kamu analis internal saat itu, apa yang kamu lakukan sebelum eksekusi 'potong TV'? (c) Desain pengukuran yang benar untuk tahun depan?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tanpa brand equity</strong> sebagai outcome (hanya sales mingguan → buta efek jangka panjang), <strong>prior datar</strong> (model bebas ngawur), <strong>tanpa kalibrasi eksperimen</strong> (tidak ada jangkar realitas).</p>
<p>(b) <strong>Tahan eksekusi, minta:</strong> (1) interval kredibel (bukan titik 0,8 — jika CI 0,2–1,6, 'potong' tidak justified); (2) satu geo-experiment TV 8 minggu (Rp100jt) sebagai kalibrasi; (3) skenario 'potong bertahap 20%' + monitor awareness, bukan potong 100%.</p>
<p>(c) <strong>Portofolio:</strong> Bayesian MMM (prior dari eksperimen) + kalibrasi tahunan + brand tracking kuartalan + atribusi digital harian. Biaya total &lt; Rp500jt/tahun vs kerugian 8% sales.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Adstock.</strong> Spend: M1=Rp2M, M2=Rp2M, M3=Rp0. λ=0,5. Hitung A1, A2, A3.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>A1</strong> = 2M + 0,5×0 = <strong>Rp2M</strong>. <strong>A2</strong> = 2M + 0,5×2M = <strong>Rp3M</strong> (<strong>akumulasi</strong>!). <strong>A3</strong> = 0 + 0,5×3M = <strong>Rp1,5M</strong> (gema!).</p>
<p><strong>Pelajaran:</strong> <strong>adstock</strong> bisa <strong>lebih besar</strong> dari <strong>spend</strong> (akumulasi!). <strong>Spend nol</strong> ≠ <strong>efek nol</strong>.</p>
</details>
<p><strong>Soal 2 — Saturasi.</strong> Hill k=1M, a=2. Bandingkan efek x=500jt vs x=1M vs x=2M. Kapan &ldquo;cukup&rdquo;?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>500jt:</strong> 0,25/1,25 = <strong>0,20</strong>. <strong>1M:</strong> 1/2 = <strong>0,50</strong>. <strong>2M:</strong> 4/5 = <strong>0,80</strong>.</p>
<p><strong>Marginal:</strong> 500jt→1M (+500jt!) = +0,30. 1M→2M (+1M!) = +0,30. <strong>Rp1M kedua</strong> = <strong>Rp500jt pertama</strong>! <strong>&ldquo;Cukup&rdquo;</strong> ≈ <strong>1M</strong> (di atas = <strong>diminishing</strong>!).</p>
</details>
<p><strong>Soal 3 — Dekomposisi.</strong> Revenue Rp50M. Base Rp30M. Spend iklan Rp10M. Berapa ROI iklan yang <strong>benar</strong> vs yang <strong>salah</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Incremental</strong> = 50 − 30 = <strong>Rp20M</strong> (asumsi <strong>semua</strong> non-base = iklan!). <strong>ROI benar</strong> = 20/10 = <strong>2,0</strong>.</p>
<p><strong>ROI salah</strong> (total/spend) = 50/10 = <strong>5,0</strong>! <strong>2,5x lipat</strong>! <strong>Penipuan diri</strong> = <strong>klaim base</strong>!</p>
</details>
<p><strong>Soal 4 — Kalibrasi.</strong> MMM: TV ROI 2,0 (±0,5!). Eksperimen: TV ROI 1,0 (±0,2!). Ke mana posterior bergerak? Mengapa?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Posterior</strong> ≈ <strong>1,2–1,4</strong> (dekat <strong>eksperimen</strong>!). <strong>Mengapa:</strong> eksperimen <strong>lebih presisi</strong> (±0,2 &lt; ±0,5!) + <strong>kausal</strong> (bukan <strong>observasional</strong>!). <strong>Bayesian</strong> = <strong>rata-rata tertimbang</strong> by <strong>presisi</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>data</strong> yang <strong>lebih baik</strong> (eksperimen!) = <strong>bobot</strong> lebih besar. <strong>Otomatis</strong> di Bayesian!</p>
</details>
<div className="tip">
<p><strong>💡 Tiga transformasi MMM: <em>adstock</em> (gema!), <em>saturasi</em> (kenyang!), <em>kalibrasi</em> (jangkar!). Tiga ini = MMM yang benar.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Fungsi adstock dengan λ=0,7. Spend Rp10M minggu 1, nol setelahnya. Adstock minggu 3?"}
  options={
    ["Rp10M",
    "Rp7M",
    "Rp4,9M",
    "Rp0"]
  }
  correct={2}
  explanation={"Benar: minggu 2 = 0,7×10 = 7; minggu 3 = 0,7×7 = 4,9. Gema meluruh 30%/minggu. Tanpa adstock, model mengira efek TV hilang minggu 2."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Dua channel: TV ROI rata-rata 1,5 (masih curam), digital ROI 3,0 (sudah datar). Rupiah berikutnya ke?"}
  options={
    ["Digital — ROI lebih tinggi",
    "TV — marginal ROI lebih tinggi",
    "Bagi rata",
    "Potong keduanya"]
  }
  correct={1}
  explanation={"Benar: alokasi optimal menyamakan MARGINAL ROI. Rata-rata menipu (digital 3,0 adalah masa lalu); yang penting rupiah berikutnya."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kenapa MMM butuh kontrol harga/musim/distribusi?"}
  options={
    ["Biar model rumit",
    "Omitted variable bias — tanpa kontrol, efeknya 'dicuri' channel",
    "Syarat software",
    "Tidak butuh"]
  }
  correct={1}
  explanation={"Benar: promo harga berbarengan dengan iklan TV → tanpa kontrol harga, model mengira TV yang menjual (padahal diskon). Kontrol memisahkan sebab."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. MMM bilang TV ROI 0,8; geo-experiment bilang 1,5. Yang dipercaya?"}
  options={
    ["MMM — lebih canggih",
    "Eksperimen — kalibrasi MMM ke 1,5 via prior",
    "Rata-rata",
    "Buang keduanya"]
  }
  correct={1}
  explanation={"Benar: eksperimen = bukti kausal langsung. MMM dikalibrasi (prior) ke eksperimen, bukan sebaliknya. Hierarki bukti: eksperimen &gt; model."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Syarat data MMM yang paling sering dilanggar?"}
  options={
    ["Data harus besar",
    "Butuh variasi spend yang cukup (tidak flat) + 2-3 tahun",
    "Harus harian",
    "Harus dari satu sumber"]
  }
  correct={1}
  explanation={"Benar: spend flat = kolinearitas sempurna dengan waktu → model tidak bisa identifikasi. 'Goyangan' historis (flighting, promo) adalah bahan bakar identifikasi."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: MMM yang Menyelamatkan Brand Rp20 Miliar</h2>
<p>Consumer goods &ldquo;SegarRasa&rdquo;: spend Rp20M/tahun (TV Rp12M, digital Rp8M). <strong>Tekanan:</strong> &ldquo;potong TV, pindah ke digital (ROI <strong>terlihat</strong> lebih tinggi!)&rdquo;. Kamu diminta <strong>MMM</strong> sebelum potong.</p>
<h3>Langkah 1 — Data &amp; spesifikasi (bulan 1)</h3>
<p><strong>Data:</strong> 3 tahun mingguan (156 titik!). <strong>Kontrol:</strong> harga, promo, distribusi, kompetitor, musim, Lebaran. <strong>Transformasi:</strong> <strong>adstock</strong> (TV λ=0,6!, digital λ=0,3!) + <strong>saturasi</strong> (Hill!).</p>
<h3>Langkah 2 — Hasil awal (tanpa kalibrasi!)</h3>
<p><strong>TV ROI:</strong> 2,5. <strong>Digital ROI:</strong> 1,8. <strong>Rekomendasi:</strong> &ldquo;TV <strong>lebih</strong> baik — <strong>pertahankan</strong>!&rdquo; <strong>Tapi:</strong> direksi <strong>tidak percaya</strong> (&ldquo;digital <strong>terlihat</strong> lebih baik di dashboard!&rdquo;).</p>
<h3>Langkah 3 — Kalibrasi dengan geo-test (bulan 2–4)</h3>
<p><strong>Geo-test TV:</strong> matikan TV di 5 kota → revenue turun <strong>8%</strong>! <strong>ROI TV eksperimental:</strong> 1,9 (bukan 2,5, tapi <strong>bukan</strong> 0,5!). <strong>Geo-test digital:</strong> ROI <strong>1,6</strong>.</p>
<p><strong>Kalibrasi:</strong> MMM baru → TV <strong>2,0</strong>, digital <strong>1,7</strong>. <strong>Konsisten</strong> dengan eksperimen!</p>
<h3>Langkah 4 — Keputusan</h3>
<p><strong>Pertahankan</strong> TV (bukan <strong>potong</strong>!). <strong>Optimasi:</strong> geser <strong>sedikit</strong> (TV 12M→10M, digital 8M→10M!) — <strong>bukan</strong> all-in! <strong>Hasil:</strong> revenue <strong>naik 12%</strong> (vs <strong>turun 20%</strong> jika potong TV!).</p>
<div className="callout">
<p><strong>What:</strong> MMM + kalibrasi → pertahankan TV (bukan potong!). Revenue +12% (vs −20%!).</p>
<p><strong>So what:</strong> <strong>Dashboard</strong> (last-click!) <strong>menyesatkan</strong>. <strong>MMM</strong> (dengan adstock!) = <strong>kebenaran</strong>. <strong>Kalibrasi</strong> = <strong>kepercayaan</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Jangan</strong> potong by dashboard! (2) <strong>MMM</strong> dengan <strong>adstock+saturasi</strong>! (3) <strong>Kalibrasi</strong> dengan <strong>eksperimen</strong>! (4) <strong>Optimasi</strong> bertahap (bukan <strong>revolusi</strong>!).</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis MMM</h2>
<h3>Jebakan 1: Tanpa adstock</h3>
<p><strong>Deteksi:</strong> TV/brand <strong>selalu</strong> ROI rendah. <strong>Solusi:</strong> <strong>adstock</strong> (λ=0,5–0,7 untuk TV!).</p>
<h3>Jebakan 2: Tanpa saturasi</h3>
<p><strong>Deteksi:</strong> rekomendasi &ldquo;tambah <strong>terus</strong>&rdquo; (tidak ada <strong>batas</strong>!). <strong>Solusi:</strong> <strong>Hill/log</strong>!</p>
<h3>Jebakan 3: Tanpa kontrol</h3>
<p><strong>Deteksi:</strong> <strong>promo</strong> tidak di model → <strong>iklan</strong> dapat <strong>kredit</strong> promo! <strong>Solusi:</strong> <strong>kontrol lengkap</strong> (harga! promo! distribusi!).</p>
<h3>Jebakan 4: Tanpa kalibrasi</h3>
<p><strong>Deteksi:</strong> MMM <strong>tidak pernah</strong> dibandingkan eksperimen. <strong>Solusi:</strong> <strong>kalibrasi</strong> (minimal <strong>1</strong> geo-test!).</p>
<h3>Jebakan 5: Data terlalu pendek</h3>
<p><strong>Deteksi:</strong> &lt; 2 tahun data. <strong>Solusi:</strong> <strong>kumpulkan</strong> dulu! <strong>MMM</strong> butuh <strong>variasi</strong> (spend <strong>naik-turun</strong>!).</p>
<h3>Jebakan 6: Overfit (terlalu banyak variabel)</h3>
<p><strong>Deteksi:</strong> R² <strong>0,99</strong> (terlalu <strong>bagus</strong>!). <strong>Solusi:</strong> <strong>Bayesian</strong> (prior! regularisasi!) + <strong>validasi</strong>.</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam syarat: adstock, saturasi, kontrol, kalibrasi, data cukup, tidak overfit. MMM tanpa enam ini = <em>regresi mahal</em>.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: MMM 1 Halaman</h2>
<div className="callout">
<p><strong>🎯 MMM — [periode]</strong></p>
<p><strong>1. Data:</strong> __ minggu. <strong>Kontrol:</strong> __. <strong>Transformasi:</strong> adstock (λ=__), saturasi (__).</p>
<p><strong>2. Dekomposisi:</strong> base __%, iklan __%, promo __%, musim __%.</p>
<p><strong>3. ROI by channel:</strong> __ (__), __ (__), __ (__).</p>
<p><strong>4. Kalibrasi:</strong> eksperimen __ (ROI __). <strong>Konsisten?</strong> __.</p>
<p><strong>5. Rekomendasi:</strong> __ (geser? pertahankan? potong?). <strong>Marginal ROI:</strong> __.</p>
</div>
<p><strong>Aturan:</strong> <strong>tidak ada</strong> realokasi &gt; Rp1M tanpa 5 baris ini! <strong>Dekomposisi</strong> + <strong>kalibrasi</strong> = <strong>keputusan bertanggung jawab</strong>.</p>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: MMM vs incrementality — pilih mana?</strong><br/>A: <strong>Keduanya!</strong> <strong>Incrementality</strong> = <strong>kebenaran</strong> (kausal!). <strong>MMM</strong> = <strong>gambaran besar</strong> (semua channel!). <strong>Kalibrasi</strong> MMM dengan incrementality = <strong>terbaik</strong>.</p>
<p><strong>Q2: Berapa biaya MMM?</strong><br/>A: <strong>Konsultan:</strong> Rp500jt–2M. <strong>In-house</strong> (LightweightMMM!): <strong>gratis</strong> + <strong>waktu analis</strong>. <strong>Untuk</strong> spend &gt; Rp10M/tahun = <strong>wajib</strong>.</p>
<p><strong>Q3: MMM untuk <strong>digital-only</strong> brand?</strong><br/>A: <strong>Bisa</strong>, tapi <strong>kurang</strong> powerful (digital sudah <strong>terukur</strong>!). <strong>MMM</strong> = <strong>terbaik</strong> untuk <strong>mix</strong> (offline+online!).</p>
<p><strong>Q4: Seberapa sering update?</strong><br/>A: <strong>Tahunan</strong> (penuh!) + <strong>kuartalan</strong> (refresh!). <strong>Jangan</strong> bulanan (<strong>noise</strong>!).</p>
<p><strong>Q5: Satu kalimat inti?</strong><br/>A: <strong>Pisahkan base dari iklan, ingat gema dan kenyang, jangkar dengan eksperimen. MMM = peta, bukan teritori.</strong></p>

      <h2 id="mmmpraktis">🔬 MMM Praktis: Dari Data ke Keputusan</h2>
<p><strong>Teori</strong> MMM = <strong>mudah</strong>. <strong>Praktik</strong> = <strong>sulit</strong>! <strong>Lima</strong> langkah praktis:</p>
<h3>Langkah 1: Kumpulkan data (2–3 tahun!)</h3>
<p><strong>Butuh:</strong> <strong>revenue</strong> (mingguan!), <strong>spend</strong> per channel, <strong>kontrol</strong> (harga! promo! musim!). <strong>Minimal:</strong> <strong>104</strong> minggu (2 tahun!). <strong>Ideal:</strong> <strong>156</strong> (3 tahun!).</p>
<p><strong>Jebakan:</strong> <strong>data</strong> tidak <strong>konsisten</strong> (definisi <strong>berubah</strong>!). <strong>Solusi:</strong> <strong>dokumentasikan</strong>! <strong>bersihkan</strong>!</p>
<h3>Langkah 2: Spesifikasi model</h3>
<p><strong>Pilih:</strong> <strong>adstock</strong> (λ per channel!), <strong>saturasi</strong> (Hill!), <strong>kontrol</strong>. <strong>Jangan</strong> terlalu <strong>kompleks</strong> (overfit!). <strong>Jangan</strong> terlalu <strong>sederhana</strong> (bias!).</p>
<p><strong>Aturan:</strong> <strong>mulai</strong> sederhana, <strong>tambah</strong> kompleksitas jika <strong>dibutuhkan</strong>.</p>
<h3>Langkah 3: Estimasi (Bayesian!)</h3>
<p><strong>Pakai:</strong> <strong>LightweightMMM</strong> atau <strong>PyMC-Marketing</strong>. <strong>Prior:</strong> <strong>masuk akal</strong> (ROI 0,5–3!). <strong>Cek:</strong> <strong>konvergensi</strong> (R-hat &lt; 1,1!), <strong>posterior</strong> (masuk <strong>akal</strong>?).</p>
<h3>Langkah 4: Kalibrasi</h3>
<p><strong>Bandingkan</strong> dengan <strong>eksperimen</strong> (geo-test!). <strong>Jika</strong> beda &gt; 50%: <strong>kalibrasi</strong>! (<strong>Prior</strong> kuat!). <strong>Jika</strong> tidak ada eksperimen: <strong>akui</strong> ketidakpastian!</p>
<h3>Langkah 5: Rekomendasi</h3>
<p><strong>Output:</strong> <strong>ROI</strong> per channel, <strong>marginal</strong> ROI, <strong>rekomendasi</strong> alokasi. <strong>Presentasi:</strong> <strong>bahasa</strong> bisnis! (<strong>bukan</strong> &ldquo;posterior&rdquo;!).</p>
<details className="worked">
<summary>📐 Contoh: 5 langkah (klik untuk buka)</summary>
<p><strong>Langkah 1:</strong> 156 minggu. Revenue, spend (TV! digital! radio!), kontrol (harga! Lebaran!).</p>
<p><strong>Langkah 2:</strong> Adstock (TV λ=0,6! digital λ=0,3!). Saturasi (Hill!). Kontrol (harga! Lebaran!).</p>
<p><strong>Langkah 3:</strong> LightweightMMM. Prior ROI (1,0 ± 0,5!). R-hat 1,02 (OK!).</p>
<p><strong>Langkah 4:</strong> Geo-test TV: ROI 1,8 (vs MMM 2,2!). Kalibrasi → 1,9.</p>
<p><strong>Langkah 5:</strong> &ldquo;<strong>Geser</strong> Rp2M dari TV ke digital (marginal <strong>lebih tinggi</strong>!).&rdquo;</p>
<p><strong>Pelajaran:</strong> <strong>5 langkah</strong> = <strong>3 bulan</strong>. <strong>Worth it</strong> untuk <strong>Rp20M</strong> spend.</p>
</details>
<div className="tip">
<p><strong>💡 <em>Lima langkah</em>: data, spesifikasi, estimasi, kalibrasi, rekomendasi. <em>Jangan</em> skip <em>kalibrasi</em>.</strong></p>
</div>

      <h2 id="startup">📊 Studi Kasus: MMM untuk Startup</h2>
<p><strong>Startup</strong> &ldquo;MajuBersama&rdquo;: spend <strong>Rp2M/tahun</strong> (kecil!). <strong>Butuh</strong> MMM? <strong>Tidak</strong>! (<strong>Terlalu</strong> mahal! <strong>Data</strong> sedikit!).</p>
<h3>Alternatif untuk startup</h3>
<p><strong>(1)</strong> <strong>Incrementality</strong> (geo-test! — <strong>murah</strong>!). <strong>(2)</strong> <strong>Atribusi</strong> (Shapley! — <strong>cepat</strong>!). <strong>(3)</strong> <strong>Rule of thumb</strong> (60/40! — <strong>brand</strong> vs <strong>performance</strong>!).</p>
<p><strong>Kapan</strong> butuh MMM? <strong>Spend</strong> &gt; <strong>Rp10M/tahun</strong>! <strong>Mix</strong> channel! <strong>Data</strong> 2+ tahun!</p>
<p><strong>Pelajaran:</strong> <strong>MMM</strong> = <strong>untuk</strong> besar. <strong>Startup</strong> = <strong>eksperimen</strong>!</p>
<details className="worked">
<summary>📐 Contoh: Startup vs enterprise (klik untuk buka)</summary>
<p><strong>Startup</strong> (Rp2M!): <strong>Geo-test</strong> (Rp200rb!). <strong>Hasil:</strong> &ldquo;digital <strong>works</strong>, TV <strong>tidak</strong>.&rdquo; <strong>Cukup</strong>!</p>
<p><strong>Enterprise</strong> (Rp50M!): <strong>MMM</strong> (Rp1M!). <strong>Hasil:</strong> <strong>alokasi</strong> optimal. <strong>Worth it</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>sesuaikan</strong> alat dengan <strong>ukuran</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 <em>Startup</em> = <em>eksperimen</em>. <em>Enterprise</em> = <em>MMM</em>. <em>Jangan</em> overkill.</strong></p>
</div>

      <h2 id="kisahmmm">📖 Kisah Nyata: MMM yang Menyelamatkan Rp50 Miliar</h2>
<p>Di sebuah perusahaan FMCG besar di Indonesia, terjadi perdebatan sengit di ruang rapat direksi. CFO, Ibu Ratna, menatap tabel anggaran dengan kening berkerut. &ldquo;Kita menghabiskan Rp50 miliar per tahun untuk iklan TV,&rdquo; katanya. &ldquo;Tapi saya tidak melihat hasilnya di dashboard digital kami. Sementara itu, iklan digital kita hanya Rp20 miliar tetapi ROAS-nya terlihat 3,5! Mengapa kita tidak memindahkan semua budget TV ke digital?&rdquo;</p>
<p>CMO, Pak Budi, terlihat panik. &ldquo;Tapi TV membangun brand!&rdquo; protesnya. &ldquo;Tanpa TV, brand kita akan dilupakan!&rdquo; Ibu Ratna mengangkat alis. &ldquo;Bukti? Tunjukkan saya angkanya. Dashboard menunjukkan digital lebih baik.&rdquo;</p>
<p>Pak Budi menoleh kepadamu, sang analis data. &ldquo;Tolong bantu saya,&rdquo; bisiknya. &ldquo;Saya yakin TV penting, tetapi saya tidak bisa membuktikannya.&rdquo;</p>
<p>Kamu tahu persis masalahnya. Dashboard digital menggunakan last-click attribution, yang hanya mengukur dampak langsung dan jangka pendek. TV bekerja secara berbeda — ia membangun memori brand yang bertahan berminggu-minggu, bahkan berbulan-bulan. Ini adalah kasus klasik yang membutuhkan MMM (Marketing Mix Modeling) dari MK13.</p>
<p>Kamu meminta waktu tiga bulan untuk membangun MMM yang komprehensif. Ibu Ratna setuju, tetapi dengan syarat: &ldquo;Jika hasilnya tidak meyakinkan, kita pindahkan budget.&rdquo;</p>
<p>Bulan pertama kamu habiskan untuk mengumpulkan data. Kamu membutuhkan tiga tahun data mingguan: revenue, spend TV per minggu, spend digital per minggu, spend radio, harga produk, aktivitas promo, distribusi (jumlah toko), aktivitas kompetitor, dan variabel musiman (Lebaran, Natal, tahun ajaran baru). Total ada 156 titik data mingguan.</p>
<p>Kamu juga mengumpulkan data kontekstual. Kamu mewawancarai tim brand tentang kampanye besar yang pernah dilakukan. Kamu mencatat kapan ada peluncuran produk baru. Kamu mendokumentasikan semua hal yang mungkin mempengaruhi penjualan.</p>
<p>Bulan kedua kamu habiskan untuk membangun model. Kamu menggunakan pendekatan Bayesian dengan PyMC-Marketing. Kamu menerapkan transformasi adstock untuk TV dengan lambda 0,6 (artinya efek TV bertahan lama, dengan setengahnya masih terasa setelah satu minggu). Untuk digital, kamu menggunakan lambda 0,3 (efek lebih pendek).</p>
<p>Kamu juga menerapkan transformasi saturasi menggunakan fungsi Hill. Kamu menemukan bahwa TV mengalami saturasi pada spend sekitar Rp800 juta per minggu — di atas itu, tambahan spend memberikan hasil yang semakin kecil. Digital mengalami saturasi pada Rp400 juta per minggu.</p>
<p>Hasil awal sangat menarik. MMM menunjukkan bahwa TV memiliki ROI 2,1, sementara digital memiliki ROI 1,7. Ini bertentangan dengan dashboard yang menunjukkan digital ROAS 3,5 dan TV &ldquo;tidak terukur&rdquo;!</p>
<p>Namun, kamu tahu bahwa MMM tanpa kalibrasi hanyalah opini yang canggih. Kamu membutuhkan bukti eksperimental. Kamu mengusulkan geo-test: matikan TV di lima kota selama dua bulan, dan lihat apa yang terjadi.</p>
<p>Ibu Ratna awalnya ragu. &ldquo;Itu berisiko,&rdquo; katanya. Kamu menjelaskan metodologi dengan hati-hati. &ldquo;Kita pilih lima kota yang representatif. Kita bandingkan dengan lima kota kontrol yang mirip. Jika TV memang tidak penting, tidak akan ada perbedaan.&rdquo;</p>
<p>Hasil geo-test sangat jelas. Di lima kota tanpa TV, revenue turun dua belas persen! Padahal, spend TV hanya sekitar lima belas persen dari total marketing spend. Ini membuktikan bahwa TV memiliki dampak yang signifikan.</p>
<p>Kamu kemudian mengkalibrasi MMM dengan hasil eksperimen. MMM yang dikalibrasi menunjukkan TV ROI 1,9 (sedikit lebih rendah dari estimasi awal 2,1, tetapi masih jauh lebih tinggi dari &ldquo;nol&rdquo; yang disiratkan dashboard). Digital ROI 1,6 (sedikit lebih rendah dari 1,7).</p>
<p>Dengan bukti ini, kamu mempresentasikan kepada direksi. Kamu menunjukkan dekomposisi: dari total revenue Rp500 miliar, Rp275 miliar (55%) adalah &ldquo;base&rdquo; (yang terjadi karena brand yang sudah kuat), Rp95 miliar dari TV, Rp80 miliar dari digital, Rp30 miliar dari promo, dan sisanya dari faktor lain.</p>
<p>&ldquo;Jika kita memindahkan Rp50 miliar dari TV ke digital,&rdquo; katamu, &ldquo;kita akan kehilangan Rp95 miliar revenue dari TV, tetapi hanya mendapatkan tambahan sekitar Rp80 miliar dari digital (karena saturasi!). Net: kita kehilangan Rp15 miliar!&rdquo;</p>
<p>Ibu Ratna terdiam. Pak Budi tersenyum. CEO, Pak Andi, mengangguk. &ldquo;Jadi dashboard kita menipu?&rdquo; tanyanya. &ldquo;Tidak menipu, Pak,&rdquo; jawabmu. &ldquo;Hanya tidak lengkap. Dashboard mengukur yang mudah diukur (klik!), bukan yang penting (memori brand!).&rdquo;</p>
<p>Keputusan akhir: pertahankan TV, tetapi optimasi alokasi. Geser Rp10 miliar dari TV (yang sudah jenuh) ke digital (yang masih memiliki ruang). Hasilnya: revenue naik delapan persen tahun berikutnya!</p>
<p>Ibu Ratna menghampirimu setelah rapat. &ldquo;Terima kasih,&rdquo; katanya. &ldquo;Kamu menyelamatkan kami dari kesalahan Rp15 miliar.&rdquo;</p>
<div className="callout">
<p><strong>What:</strong> Perdebatan TV (Rp50M!) vs digital. MMM + geo-test membuktikan TV ROI 1,9. Keputusan: pertahankan TV, optimasi alokasi. Revenue +8%.</p>
<p><strong>So what:</strong> <strong>Dashboard</strong> = <strong>tidak lengkap</strong>. <strong>MMM</strong> = <strong>gambaran besar</strong>. <strong>Kalibrasi</strong> = <strong>kebenaran</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Jangan</strong> putuskan by dashboard! (2) <strong>Bangun</strong> MMM! (3) <strong>Kalibrasi</strong> dengan eksperimen! (4) <strong>Optimasi</strong>, bukan revolusi!</p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-saturasi">📐 Worked Example: Membaca Kurva Saturasi &amp; Menemukan Titik Jenuh Budget</h2>
<p>Konsep paling mahal dalam MMM: <strong>diminishing returns</strong> — rupiah iklan ke-100 tidak sekuat rupiah pertama. Contoh ini memakai fungsi saturasi Hill yang dipakai industri, dengan angka yang bisa kamu hitung pakai kalkulator HP.</p>
<p><strong>Model:</strong> <Tex math={String.raw`\text{Penjualan}(S) = \frac{500 \times S^{0{,}7}}{120^{0{,}7} + S^{0{,}7}}`} /> (dalam miliar rupiah; S = spend/bulan dalam miliar rupiah). Artinya: penjualan mendekati plafon 500M/bulan; 120 = titik belok (EC50); 0,7 = kelengkungan.</p>
<details className="worked">
<summary>📐 Menghitung marginal ROAS per level spend (klik untuk buka)</summary>
<p><strong>Langkah 1 — Hitung penjualan di 3 level spend.</strong> (120<sup>0,7</sup> ≈ 28,2)</p>
<ul>
<li>S = 60: 60<sup>0,7</sup> ≈ 17,4 → Penjualan = 500 × 17,4 / (28,2 + 17,4) = 500 × 0,381 = <strong>190,7 M</strong></li>
<li>S = 120: 120<sup>0,7</sup> = 28,2 → Penjualan = 500 × 28,2 / (28,2 + 28,2) = 500 × 0,5 = <strong>250,0 M</strong></li>
<li>S = 240: 240<sup>0,7</sup> ≈ 45,9 → Penjualan = 500 × 45,9 / (28,2 + 45,9) = 500 × 0,619 = <strong>309,7 M</strong></li>
</ul>
<p><strong>Langkah 2 — Hitung marginal ROAS</strong> (tambahan penjualan / tambahan spend):</p>
<ul>
<li>60 → 120: (250,0 − 190,7) / (120 − 60) = 59,3 / 60 = <strong>0,99</strong> — tiap Rp1 tambahan kembali Rp0,99 penjualan</li>
<li>120 → 240: (309,7 − 250,0) / (240 − 120) = 59,7 / 120 = <strong>0,50</strong> — separuhnya!</li>
</ul>
<p><strong>Langkah 3 — Bandingkan dengan rata-rata.</strong> Di S = 120, <em>rata-rata</em> ROAS = 250/120 = <strong>2,08</strong> — terlihat bagus! Tapi <em>marginal</em> ROAS (0,99) yang menentukan keputusan tambah/kurangi budget. <strong>Jebakan klasik:</strong> direksi melihat ROAS rata-rata 2,08 lalu menambah budget — padahal rupiah tambahannya hanya kembali 0,99 (dan turun ke 0,50). Keputusan budget selalu memakai <strong>marginal</strong>, bukan rata-rata.</p>
<p><strong>Langkah 4 — Temukan titik jenuh.</strong> Aturan: tambah budget selama marginal ROAS &gt; 1 (dengan margin kontribusi, mis. &gt; 1/0,35 ≈ 2,9 untuk margin 35% — karena yang penting <strong>profit</strong>, bukan revenue). Di contoh ini, dengan margin 35%: marginal profit ROAS di 60→120 = 0,99 × 0,35 = 0,35 &lt; 1 — artinya <strong>bahkan di S = 60 pun channel ini sudah lewat titik optimal!</strong> Budget seharusnya <em>dikurangi</em>, bukan ditambah. Inilah wawasan yang tidak akan pernah muncul dari dashboard last-click.</p>
<p><strong>Langkah 5 — Uji sensitivitas.</strong> EC50 dan slope diestimasi dari data dengan ketidakpastian. Praktik MMM Bayesian: bukan satu kurva, melainkan <strong>distribusi kurva</strong> — keputusan &ldquo;kurangi budget&rdquo; diambil jika 80%+ kurva sampel setuju. Satu kurva titik = keyakinan palsu.</p>
</details>
<h3>Empat intuisi saturasi untuk rapat budget</h3>
<ul>
<li><strong>Rata-rata menipu, marginal memutuskan.</strong> Selalu tanya: &ldquo;ROAS yang dilaporkan ini rata-rata atau marginal?&rdquo;</li>
<li><strong>Setiap channel punya bentuk kurva sendiri.</strong> Search biasanya jenuh cepat (permintaan terbatas), video/brand jenuh lambat. Budget optimal = samakan <strong>marginal ROAS antar-channel</strong>, bukan samakan budget.</li>
<li><strong>Adstock menggeser, bukan menghilangkan, saturasi.</strong> Efek gema (adstock) membuat spend bulan lalu masih bekerja — tapi plafonnya tetap ada.</li>
<li><strong>Saturasi berubah seiring waktu.</strong> Kurva 2024 belum tentu berlaku 2026 (kompetitor masuk, kreatif basi). Re-estimasi tiap 6–12 bulan.</li>
</ul>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: kurva saturasi adalah <em>foto kejujuran</em> channel iklan — ia menunjukkan kapan uangmu mulai bekerja setengah hati. Analis yang bisa menggambar kurva ini tidak pernah lagi kalah debat budget dengan &ldquo;tambah saja, ROAS kan masih 2&rdquo;.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Teh Nusantara — MMM Pertama untuk Brand Rp80 Miliar</h2>
<p><em>Teh Nusantara</em> (nama disamarkan): brand teh kemasan, revenue Rp80 miliar/tahun, spend iklan Rp12 miliar/tahun (TV 50%, digital 30%, radio &amp; OOH 20%). Selama ini budget dibagi &ldquo;berdasarkan tahun lalu + feeling&rdquo;. Kamu diminta membangun MMM pertama mereka dengan data 3 tahun.</p>
<h3>Fase 1 — Dekomposisi: berapa yang &ldquo;dasar&rdquo; vs &ldquo;usaha&rdquo;?</h3>
<p>Model memisahkan penjualan menjadi <strong>base</strong> (terjadi tanpa iklan: loyalitas, distribusi, musiman) dan <strong>incremental</strong> (karena iklan). Hasil: base = <strong>68%</strong>, incremental total = 32%. Artinya: Rp54,4 miliar penjualan terjadi <em>walau tidak ada iklan sama sekali</em> — fondasi brand yang kuat, tapi juga berarti <strong>iklan hanya memperebutkan 32%</strong>. Ekspektasi &ldquo;iklan melipatgandakan penjualan&rdquo; langsung dikalibrasi.</p>
<h3>Fase 2 — Kontribusi per channel (incremental)</h3>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Channel</th><th>Spend/tahun</th><th>Incremental</th><th>ROAS rata-rata</th><th>Marginal ROAS</th></tr></thead>
<tbody>
<tr><td>TV</td><td>Rp6,0 M</td><td>Rp9,0 M</td><td>1,50</td><td><strong>0,60</strong></td></tr>
<tr><td>Digital (video+search)</td><td>Rp3,6 M</td><td>Rp10,8 M</td><td>3,00</td><td><strong>1,80</strong></td></tr>
<tr><td>Radio + OOH</td><td>Rp2,4 M</td><td>Rp5,8 M</td><td>2,42</td><td><strong>1,10</strong></td></tr>
</tbody>
</table>
</div>
<p><strong>Temuan:</strong> TV — channel kebanggaan direksi — punya marginal ROAS <strong>0,60</strong>: tiap rupiah tambahan <em>menghancurkan</em> Rp0,40. Digital masih lapar (1,80). Rekomendasi: geser <strong>Rp2 miliar dari TV ke digital</strong>.</p>
<h3>Fase 3 — Kalibrasi dengan eksperimen (kejujuran Bayesian)</h3>
<p>MMM observasional bisa bias (TV tayang saat Ramadan = korelasi dengan musiman). Validasi: <strong>geo-experiment</strong> — 5 kota TV dimatikan 8 minggu, 5 kota kontrol. Hasil: penurunan penjualan di kota test hanya 60% dari prediksi MMM → efek TV di-<em>downweight</em> via prior. Model final: marginal TV = <strong>0,45</strong> (lebih parah dari estimasi awal!). Keputusan Rp2 miliar geser budget menjadi <strong>lebih berani</strong>: Rp2,8 miliar.</p>
<h3>Hasil 1 tahun setelah realokasi</h3>
<ul>
<li>Spend total <strong>tetap</strong> Rp12 miliar (tidak ada tambahan budget — murni realokasi).</li>
<li>Incremental naik dari Rp25,6 M → <strong>Rp31,4 M</strong> (+23%).</li>
<li>Efisiensi: ROAS blended 2,13 → <strong>2,62</strong>.</li>
<li>Bonus tak terduga: dengan TV dikurangi, tim kreatif dipaksa membuat <strong>1 materi hero</strong> (bukan 5 materi biasa-biasa saja) — kualitas naik, frekuensi efektif naik.</li>
</ul>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;MMM butuh konsultan Rp2 miliar dan 2 tahun data sempurna.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> MMM pertama Teh Nusantara dibangun 1 analis + 3 tahun data yang <em>berantakan</em> (dibersihkan 3 minggu) dalam 2 bulan. Nilai MMM bukan di presisinya — melainkan di <strong>keberanian mengambil keputusan realokasi</strong> yang sebelumnya hanya &ldquo;feeling&rdquo;. Model 70% benar yang dipakai mengalahkan model 95% benar yang tidak pernah selesai.</p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar MMM</h2>
<h3>1. &ldquo;Berapa banyak data yang dibutuhkan untuk MMM?&rdquo;</h3>
<p><strong>Minimal 2 tahun mingguan</strong> (104 titik) — butuh melihat pola musiman penuh 2x agar model bisa memisahkan musiman dari efek iklan. Data harian 1 tahun <em>bisa</em> tapi noisy; data bulanan 2 tahun = hanya 24 titik, terlalu sedikit untuk banyak channel. Jika datamu kurang: mulai dengan <strong>MMM sederhana</strong> (3–4 channel, tanpa adstock kompleks) atau pakai <strong>geo-experiment</strong> sebagai pengganti sementara — jangan memaksakan model canggih di data kurus.</p>
<h3>2. &ldquo;MMM vs atribusi multi-touch — pilih mana?&rdquo;</h3>
<p><strong>Keduanya, untuk pertanyaan berbeda.</strong> MMM menjawab &ldquo;berapa budget tiap channel tahun depan?&rdquo; (level strategis, semua channel termasuk offline). Multi-touch menjawab &ldquo;kampanye digital mana yang dioptimasi minggu ini?&rdquo; (level taktis, digital saja). MMM buta terhadap detail kampanye; multi-touch buta terhadap offline &amp; brand. Perusahaan dewasa menjalankan keduanya dan memakai <strong>eksperimen sebagai wasit</strong> saat keduanya bertentangan.</p>
<h3>3. &ldquo;Kenapa hasil MMM konsultan dan internal sering beda?&rdquo;</h3>
<p>Tiga sumber beda: <strong>definisi</strong> (apa itu &ldquo;base&rdquo;? termasuk distribusi atau tidak?), <strong>prior Bayesian</strong> (konsultan bawa prior dari &ldquo;benchmark industri&rdquo; yang mungkin tidak cocok), dan <strong>kepentingan</strong> (konsultan yang juga jualan media punya insentif menggelembungkan efek channel yang ia jual). Obatnya: minta <strong>semua asumsi tertulis</strong>, bandingkan dengan eksperimen kecil, dan jangan pernah terima model black-box tanpa akses ke kodenya.</p>
<h3>4. &ldquo;Adstock decay berapa yang &lsquo;benar&rsquo;?&rdquo;</h3>
<p><strong>Tidak ada angka universal</strong> — tergantung memori kategori. FMCG: decay cepat (0,3–0,5/minggu — orang lupa iklan sabun dalam sebulan). Otomotif/properti: decay lambat (0,7–0,9 — pertimbangan berbulan-bulan). Praktik: estimasi dari data (grid search), bukan dari textbook. Tanda decay salah: model memprediksi &ldquo;efek iklan masih kuat 6 bulan kemudian&rdquo; untuk produk impulsif — tidak masuk akal, perketat prior.</p>
<h3>5. &ldquo;Bisakah MMM mengukur brand building (bukan sales langsung)?&rdquo;</h3>
<p><strong>Bisa, dengan variabel antara.</strong> Iklan brand → (kesadaran/consideration naik) → penjualan naik 3–6 bulan kemudian. MMM yang hanya memakai penjualan sebagai output akan <strong>meremehkan</strong> brand (efeknya lambat &amp; tidak langsung). Solusi: model <strong>bertingkat</strong> — tahap 1: iklan → brand metrics (dari survei/brand tracking); tahap 2: brand metrics → penjualan. Atau pakai <strong>proxy</strong>: search volume brand sebagai jembatan. Yang pasti salah: mengklaim &ldquo;brand tidak terukur&rdquo; lalu memberi budget nol.</p>
<h3>6. &ldquo;Seberapa sering MMM harus di-refresh?&rdquo;</h3>
<p><strong>Model: tiap 6–12 bulan</strong> atau saat ada guncangan (kompetitor besar masuk, krisis, perubahan distribusi). <strong>Monitoring: bulanan</strong> — bandingkan prediksi vs aktual; jika error &gt; 15% tiga bulan berturut-turut, model basi. Kesalahan umum: memakai MMM 2022 untuk budget 2026 tanpa refresh — kurva saturasi sudah bergeser, keputusan jadi fosil.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: MMM adalah <em>model</em> — penyederhanaan yang berguna, bukan cermin kebenaran. Nilainya bukan di angka presisinya, melainkan di <em>disiplin berpikir</em> yang ia paksa: pisahkan base dari incremental, bedakan marginal dari rata-rata, dan kalibrasi dengan eksperimen. Analis MMM yang baik selalu bisa menjawab &ldquo;apa yang bisa membuat model ini salah?&rdquo;</strong></p>
</div>

            <h2 id="tambahan-playbook">📋 Playbook: Menjalankan MMM Pertamamu dalam 8 Minggu</h2>
<p>Template realistis untuk analis yang diminta &ldquo;bikin MMM&rdquo; tanpa konsultan Rp2 miliar. Total: 1 analis, 8 minggu, tools gratis (Python).</p>
<h3>Minggu 1–2 — Kumpulkan &amp; bersihkan data</h3>
<p>Checklist data mingguan minimal 104 minggu (2 tahun): penjualan (unit + revenue), spend per channel, harga/promo, distribusi (jumlah outlet), kalender (Ramadan, Harbolnas, cuaca ekstrem), dan kompetitor (jika ada). <strong>80% waktu habis di sini</strong> — itu normal. Aturan: satu tabel, satu baris per minggu, tidak ada missing week (isi 0 dengan flag, jangan hapus).</p>
<h3>Minggu 3 — Model baseline dulu</h3>
<p>Regresi sederhana: penjualan ~ musiman + tren + harga + distribusi (tanpa iklan). Ini = <strong>base</strong>-mu. R² 0,6–0,8 sudah cukup — sisanya (residual) adalah &ldquo;ruang&rdquo; tempat efek iklan tinggal. Jika baseline sudah menjelaskan 95%, iklanmu memang kecil efeknya — terima dengan jujur.</p>
<h3>Minggu 4–5 — Tambah channel satu per satu</h3>
<p>Transformasi adstock + saturasi per channel (lihat Lab 1 lesson ini), masukkan ke regresi <strong>satu per satu</strong> — mulai dari channel terbesar. Setiap channel harus: (a) menaikkan adjusted-R², (b) koefisiennya positif &amp; signifikan, (c) bentuk kurvanya masuk akal (tidak ada &ldquo;makin banyak iklan makin turun penjualan&rdquo;). Channel yang gagal tiga tes = dikeluarkan, bukan dipaksa masuk.</p>
<h3>Minggu 6 — Validasi seperti orang skeptis</h3>
<p>Tiga uji: (a) <strong>holdout</strong> — latih di 80% minggu awal, prediksi 20% akhir; error &gt; 20% = model overfit; (b) <strong>uji akal</strong> — matikan semua iklan di model, apakah base-nya masuk akal vs tahun tanpa iklan besar?; (c) <strong>bandingkan dengan eksperimen</strong> sekecil apa pun (mis. 2 minggu pause satu channel di 1 region). Model yang lolos ketiganya boleh dibawa ke direksi.</p>
<h3>Minggu 7 — Terjemahkan ke keputusan</h3>
<p>Output bukan &ldquo;model&rdquo; melainkan <strong>3 rekomendasi budget</strong>: (1) realokasi (geser X dari channel jenuh ke channel lapar), (2) total budget optimal (marginal ROAS = ambang profit), (3) kalender (kapan spend di depan musiman, dengan adstock). Tiap rekomendasi ditempeli <strong>interval ketidakpastian</strong> — &ldquo;geser Rp1–2 miliar&rdquo; lebih jujur dari &ldquo;geser Rp1,5 miliar&rdquo;.</p>
<h3>Minggu 8 — Presentasi &amp; institutionalize</h3>
<p>Slide 1: keputusan. Slide 2: uangnya (berapa incremental tambahan). Slide 3–5: bukti (kurva saturasi, validasi). Appendix: metodologi. Lalu <strong>jadwalkan refresh</strong> 6 bulan lagi + monitoring bulanan (prediksi vs aktual). MMM yang tidak di-refresh = fosil yang menyesatkan.</p>
<div className="callout">
<h3>🧭 Checklist kesiapan MMM (jawab jujur sebelum mulai)</h3>
<ol><li>Data mingguan ≥ 104 minggu, tanpa lubang? (tidak → kumpulkan dulu)</li><li>Spend per channel tercatat konsisten definisinya 2 tahun? (tidak → 1 bulan bersih-bersih dulu)</li><li>Ada variasi spend antar waktu? (spend datar terus = model tidak bisa belajar)</li><li>Stakeholder siap menerima &ldquo;channel favoritmu tidak efektif&rdquo;? (tidak → jangan mulai; model benar yang ditolak = sia-sia)</li><li>Ada budget eksperimen kecil untuk validasi? (tidak ada → pakai holdout, tapi catat keterbatasannya)</li></ol>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>MMM</strong>: y = base + Σ β·f(adstock(spend)) + kontrol; output = kontribusi, ROI, kurva respons.</li>
<li><strong>Adstock</strong> (gema, λ) + <strong>saturasi</strong> (Hill, diminishing return) = realisme.</li>
<li><strong>Alokasi optimal</strong>: samakan marginal ROI, bukan rata-rata.</li>
<li><strong>Bayesian</strong>: prior informatif mencegah ngawur; output = interval, bukan titik.</li>
<li><strong>Kalibrasi eksperimen wajib</strong> — MMM tanpa itu = opini mahal.</li>
<li><strong>Kapan TIDAK MMM</strong>: data &lt; 2 tahun / spend flat → eksperimen + heuristik dulu.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk12-attribution" className="btn btn-secondary btn-sm">← MK12</Link>
        <Link href="/learn/mk14-pricing" className="btn btn-primary btn-sm">MK14 →</Link>
      </div>
    </div>
  );
}

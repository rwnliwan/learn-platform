"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk1FunnelAarrrPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK1 — Marketing Data Analytics</span>
        <h1 className="display-title">Funnel AARRR:<br/>Dari 10.000 Pengunjung ke 100 Pelanggan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Rp500 Juta Terbakar dalam 3 Bulan</a></li>
<li><a href="#aarrr">Funnel AARRR — Lima Tahap</a></li>
<li><a href="#stp4p">STP & 4P — Peta Sebelum Perang</a></li>
<li><a href="#unit">Unit Economics — Matematika Bertahan Hidup</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Ember Bocor</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: KopiKilat — Scale atau Perbaiki?</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: WarungDigital dari Nol sampai Memo</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Funnel</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: 5 Pertanyaan CEO</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan tiap tahap AARRR beserta metrik kuncinya dengan bahasa sendiri.</li>
<li>Menghitung conversion rate antar-tahap dan menemukan bottleneck funnel dari data mentah.</li>
<li>Menghitung CAC, LTV, ROAS, dan payback period, lalu menilai sehat tidaknya unit economics.</li>
<li>Memutuskan fokus tim (acquisition vs activation vs retention) berdasarkan data funnel, bukan insting.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Rp500 Juta Terbakar dalam 3 Bulan</h2>
      <div className="story">
        <p>Startup kopi <em>&ldquo;KopiKilat&rdquo;</em> bangga: iklan mereka menghasilkan <strong>50.000 install</strong> dalam 3 bulan, bakar Rp500 juta. Deck ke investor penuh angka install yang menanjak. Lalu investor bertanya satu kalimat: <em>&ldquo;Yang pesan kopi kedua kali ada berapa?&rdquo;</em> Hening. Jawabannya: <strong>300 orang</strong>. Dari 50.000 install.</p>
<p>Twist-nya: acquisition <strong>bukan</strong> masalah mereka — 50.000 install itu bagus. Yang membunuh adalah <strong>activation</strong>: dari 8.000 yang daftar, cuma 1.200 yang pernah pesan (15%). Mereka mengoptimalkan tahap yang salah selama 3 bulan — karena tidak pernah mengukur conversion <em>antar-tahap</em>. Lesson ini memastikan kamu tidak mengulanginya.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="aarrr">AARRR — Lima Tahap yang Sering Dibaca Terbalik</h2>
<p><strong>Definisi.</strong> AARRR (Dave McClure, 2007) adalah lima tahap perjalanan pelanggan: <strong>Acquisition</strong> (orang datang), <strong>Activation</strong> (merasakan nilai pertama — <em>aha moment</em>), <strong>Retention</strong> (kembali lagi), <strong>Revenue</strong> (membayar), <strong>Referral</strong> (mengajak orang lain). Tiap tahap punya metrik kunci sendiri.</p>
<ul>
<li><strong>Acquisition:</strong> visitor, install, CAC (biaya per pelanggan baru).</li>
<li><strong>Activation:</strong> <em>activation rate</em> — % yang mencapai aha moment (misal: pesan pertama, buat proyek pertama).</li>
<li><strong>Retention:</strong> <em>N-day retention</em> — % yang masih aktif di hari ke-N.</li>
<li><strong>Revenue:</strong> ARPU, conversion ke paid.</li>
<li><strong>Referral:</strong> <em>K-factor</em> — berapa pelanggan baru dibawa tiap pelanggan lama.</li>
</ul>
<Tex math={String.raw`CR_{t \to t+1} = \frac{N_{t+1}}{N_t} \quad;\quad CR_{total} = \prod_{t} CR_{t \to t+1}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`CR_{t \to t+1}`} />: conversion rate dari tahap t ke tahap berikutnya</li>
<li><Tex math={String.raw`N_t`} />: jumlah orang di tahap t</li>
<li><Tex math={String.raw`CR_{total}`} />: conversion ujung-ke-ujung (hasil kali semua tahap — makanya satu tahap bocor menghancurkan total)</li>
</ul>
<Tex math={String.raw`K = i \times c`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`K`} />: K-factor (viral coefficient)</li>
<li><Tex math={String.raw`i`} />: rata-rata undangan dikirim per pelanggan</li>
<li><Tex math={String.raw`c`} />: conversion undangan menjadi pelanggan baru (K &gt; 1 = tumbuh viral, K &lt; 1 = referral hanya pemanis)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Bayangkan funnel sebagai <strong>saringan bertingkat yang bocor</strong>. Kebanyakan tim menatap angka paling atas (visitor) dan paling bawah (revenue), padahal uang hilang di <em>sambungan antar-tahap</em>. Satu tahap dengan conversion 15% — bukan 50.000 visitor — yang menentukan nasibmu.</p>
<p><strong>Kapan dipakai:</strong> Setiap produk digital, e-commerce (varian: lihat → keranjang → checkout → bayar), dan SaaS. Selalu mulai analisis marketing dari funnel, bukan dari total revenue.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Funnel KopiKilat (klik untuk buka)</summary>
<p>Data: install 50.000 → daftar 8.000 → pesan pertama 1.200 → pesan ulang 300 → langganan 200 → referral 40.</p>
<p><strong>Langkah 1</strong> — conversion antar-tahap: 8.000/50.000 = <strong>16%</strong>; 1.200/8.000 = <strong>15%</strong>; 300/1.200 = <strong>25%</strong>; 200/300 = <strong>67%</strong>; 40/200 = <strong>20%</strong>.</p>
<p><strong>Langkah 2</strong> — bottleneck = tahap dengan conversion terendah: <strong>daftar → pesan pertama (15%)</strong>. Di sinilah 6.800 orang hilang.</p>
<p><strong>Langkah 3</strong> — overall: 200/50.000 = <strong>0,4%</strong> = 0,16 × 0,15 × 0,25 × 0,67. Satu tahap 15% menyeret semuanya.</p>
</details>
<PlotlyChart
  data={[{y: ["Install", "Daftar", "Pesan pertama", "Pesan ulang", "Langganan", "Referral"], x: [50000, 8000, 1200, 300, 200, 40], type: "bar", orientation: "h", marker: {color: ["#2a7de1","#2a7de1","#e8a838","#2a7de1","#2a7de1","#2a7de1"]}, text: ["50rb","8rb","1,2rb","300","200","40"], textposition: "outside"}]}
  title={"Funnel KopiKilat: di mana 50.000 orang hilang?"}
  layout={{xaxis: {title: "Jumlah orang"}, yaxis: {autorange: "reversed"}, showlegend: false, margin: {l: 110}}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu vertikal = tahap funnel dari atas (akuisisi) ke bawah (referral). Panjang batang = jumlah orang yang lolos ke tahap itu. Bandingkan panjang batang yang bersebelahan — penyusutan terbesar = bottleneck.</p>
<p><strong>Interpretasi:</strong> Batang menyusut drastis dari &lsquo;Daftar&rsquo; (8.000) ke &lsquo;Pesan pertama&rsquo; (1.200) — batang kuning menandai masalah. Inilah visual dari &lsquo;ember bocor&rsquo;: 85% pendaftar tidak pernah merasakan produk. Budget iklan berikutnya seharusnya dipakai memperbaiki onboarding, bukan menambah install.</p>
</div>
<h2 id="stp4p">STP & 4P — Peta Sebelum Perang</h2>
<p><strong>Definisi.</strong> Sebelum menghitung apa pun, marketing yang benar menjawab tiga pertanyaan (<strong>STP</strong>): <strong>Segmentation</strong> — kelompok pelanggan apa saja yang ada? <strong>Targeting</strong> — kelompok mana yang kita layani? <strong>Positioning</strong> — apa yang membuat kita beda di benak mereka? Lalu mengeksekusi lewat <strong>4P</strong>: <strong>Product</strong> (apa yang dijual), <strong>Price</strong> (berapa), <strong>Place</strong> (di mana dibeli), <strong>Promotion</strong> (bagaimana orang tahu).</p>
<p>Analis data sering lompat langsung ke dashboard tanpa tahu &ldquo;produk ini untuk siapa&rdquo;. Akibatnya: segmentasi asal-asalan, targeting salah, dan insight yang tidak bisa dieksekusi tim marketing.</p>
<p><strong>Kepribadian/intuisi:</strong> STP adalah <strong>peta</strong>, 4P adalah <strong>rencana perjalanan</strong>. Data tanpa STP seperti GPS tanpa tujuan: kamu tahu kecepatanmu (metrik), tapi tidak tahu mau ke mana (strategi). Setiap angka funnel harus dibaca <em>per segmen</em> — conversion mahasiswa dan pekerja bisa beda 3x.</p>
<p><strong>Kapan dipakai:</strong> Saat merancang kampanye baru, mengevaluasi kenapa kampanye gagal (salah segmen? salah positioning?), dan sebelum membuat segmentasi di MK4.</p>
<details className="worked">
<summary>📐 Contoh: STP KopiKilat (klik untuk buka)</summary>
<p><strong>Segmentation:</strong> (1) mahasiswa — sensitif harga, nongkrong lama; (2) pekerja — butuh cepat, pesan via aplikasi; (3) premium — bayar mahal untuk ambience &amp; biji specialty.</p>
<p><strong>Targeting:</strong> KopiKilat pilih segmen (2) pekerja — ukuran besar, frekuensi beli tinggi, cocok dengan aplikasi pesan-antar.</p>
<p><strong>Positioning:</strong> &ldquo;kopi enak sampai dalam 15 menit&rdquo; — bukan &ldquo;kopi termurah&rdquo;.</p>
<p><strong>4P:</strong> Product = kopi + aplikasi; Price = Rp25rb (di bawah premium, di atas kaki lima); Place = aplikasi + 10 gerai dekat perkantoran; Promotion = iklan jam makan siang di sekitar kantor.</p>
<p>Pelajaran analis: kalau funnel dihitung gabungan tiga segmen, bottleneck tersamarkan. Pisahkan dulu, baru hitung.</p>
</details>
<PlotlyChart
  data={[{x: [3, 7, 8, 4, 6], y: [9, 6, 8, 3, 5], mode: "markers+text", text: ["Kaki lima", "KopiKilat", "Premium A", "Instan", "Premium B"], textposition: "top center", marker: {size: [14, 22, 18, 12, 16], color: ["#94a3b8","#e8a838","#2a7de1","#94a3b8","#2a7de1"]}}]}
  title={"Positioning Map: Harga vs Kecepatan Saji"}
  layout={{xaxis: {title: "Harga (1=murah, 10=mahal)"}, yaxis: {title: "Kecepatan saji (1=lambat, 10=kilat)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = harga, sumbu Y = kecepatan. Tiap titik = merek, ukuran titik = pangsa pasar. Cari area kosong (peluang) dan area berdesakan (red ocean).</p>
<p><strong>Interpretasi:</strong> KopiKilat (kuning, titik besar) duduk di kuadran &lsquo;harga menengah + sangat cepat&rsquo; — area yang relatif kosong. Inilah positioning-nya secara visual: tidak adu murah dengan kaki lima, tidak adu gengsi dengan premium. Kalau titiknya menumpuk dengan pesaing, positioning belum tajam.</p>
</div>
<h2 id="unit">Unit Economics — Matematika Bertahan Hidup</h2>
<p><strong>Definisi.</strong> Unit economics menjawab: <strong>apakah satu pelanggan menguntungkan?</strong> Empat angka: <strong>CAC</strong> (<em>Customer Acquisition Cost</em>) = biaya mendapatkan satu pelanggan baru; <strong>LTV</strong> (<em>Lifetime Value</em>) = total profit dari satu pelanggan selama ia bertahan; <strong>ROAS</strong> (<em>Return on Ad Spend</em>) = revenue per rupiah iklan; <strong>Payback period</strong> = berapa lama CAC kembali modal.</p>
<p>Aturan praktis industri: <strong>LTV : CAC ≥ 3 : 1</strong> dan <strong>payback &lt; 12 bulan</strong> (subscription) atau &lt; 3 bulan (e-commerce). Di bawah itu, scale = bakar uang lebih cepat.</p>
<Tex math={String.raw`CAC = \frac{\text{Biaya akuisisi total}}{\text{Pelanggan baru}} \quad;\quad ROAS = \frac{\text{Revenue dari iklan}}{\text{Biaya iklan}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Biaya akuisisi total: semua spend marketing/sales pada periode itu (iklan + gaji tim + tools)</li>
<li>Pelanggan baru: yang benar-benar jadi pelanggan (bayar/aktif), BUKAN install/visitor</li>
<li>ROAS = 4 artinya tiap Rp1 iklan menghasilkan Rp4 revenue (belum dikurangi margin!)</li>
</ul>
<Tex math={String.raw`LTV = ARPU \times \text{margin kotor} \times \frac{1}{\text{churn per periode}} \quad;\quad \text{Payback} = \frac{CAC}{ARPU \times \text{margin kotor}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`ARPU`} />: rata-rata revenue per pelanggan per bulan</li>
<li>margin kotor: % revenue yang jadi laba kotor (setelah COGS)</li>
<li>churn per periode: % pelanggan yang pergi tiap bulan (0,10 = 10%/bulan). Rumus ini untuk model subscription; 1/churn = umur rata-rata pelanggan dalam bulan</li>
<li>Payback: berapa bulan profit bulanan menutup CAC</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> CAC adalah <strong>&lsquo;harga beli&rsquo;</strong> pelanggan, LTV adalah <strong>&lsquo;nilai jualnya kembali ke kamu&rsquo;</strong>. Bisnis sehat = beli murah, jual mahal. Startup yang bangga &lsquo;CAC kami cuma Rp20rb!&rsquo; tapi LTV-nya Rp30rb sedang rugi — mereka membeli pelanggan seharga Rp20rb untuk dapat Rp30rb <em>kotor</em>. Rasio yang bicara, bukan angka absolut.</p>
<p><strong>Kapan dipakai:</strong> Sebelum menaikkan budget iklan, sebelum lapor ke investor, dan setiap kali ada yang usul &lsquo;scale 10x&rsquo;. Hitung dulu, scale kemudian.</p>
<details className="worked">
<summary>📐 Contoh: Unit Economics KopiKilat (klik untuk buka)</summary>
<p>Data: spend Rp500 jt → 200 pelanggan langganan. ARPU Rp120rb/bln, margin 60%, churn 15%/bln.</p>
<p><strong>Langkah 1 — CAC:</strong> 500.000.000 / 200 = <strong>Rp2,5 jt</strong> per pelanggan. (Sudah bau bahaya.)</p>
<p><strong>Langkah 2 — LTV:</strong> 120.000 × 0,6 × (1 / 0,15) = 120.000 × 0,6 × 6,67 = <strong>Rp480rb</strong>.</p>
<p><strong>Langkah 3 — Rasio:</strong> 480rb / 2,5jt = <strong>0,19</strong> — jauh di bawah 3. Tiap pelanggan merugikan Rp2jt.</p>
<p><strong>Langkah 4 — Payback:</strong> 2.500.000 / (120.000 × 0,6) = <strong>34,7 bulan</strong> — hampir 3 tahun, padahal umur rata-rata pelanggan cuma 6,7 bulan. Modal tidak pernah kembali.</p>
<p><strong>Kesimpulan:</strong> model ini mati secara matematis. Scale 10x = rugi 10x lebih cepat.</p>
</details>
<PlotlyChart
  data={[{x: ["Sehat", "Marginal", "KopiKilat"], y: [4.2, 2.9, 0.19], type: "bar", marker: {color: ["#2a7de1", "#e8a838", "#ef4444"]}, text: ["4,2", "2,9", "0,19"], textposition: "outside"}, {x: ["Sehat", "Marginal", "KopiKilat"], y: [3, 3, 3], type: "scatter", mode: "lines", name: "Batas sehat (3,0)", line: {dash: "dash", color: "#16a34a"}}]}
  title={"Rasio LTV:CAC — tiga skenario"}
  layout={{yaxis: {title: "LTV : CAC"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = skenario bisnis, tinggi batang = rasio LTV:CAC. Garis hijau putus-putus = ambang sehat 3,0. Batang di atas garis = boleh scale; di bawah = perbaiki dulu.</p>
<p><strong>Interpretasi:</strong> Hanya skenario &lsquo;Sehat&rsquo; (4,2) yang lolos ambang. KopiKilat (0,19) bahkan tidak terlihat di skala yang sama — visual betapa jauhnya mereka dari sehat. Inilah kenapa investor menanyakan angka kedua (repeat order), bukan angka install.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Ember Bocor</h2>
<p>Bagian konsep tadi memberimu rumusnya. Bagian ini memberimu <strong>rasanya</strong> — tiga pertanyaan yang memisahkan analis yang sekadar menghitung dari analis yang dipercaya direksi: (1) dari lima tahap, tahap mana yang <em>paling menguntungkan</em> diperbaiki — bukan cuma yang paling bocor? (2) kapan rasio LTV:CAC 3:1 <strong>berbohong</strong>? (3) mengapa CAC yang kamu baca di dashboard hampir selalu <strong>lebih murah dari aslinya</strong>?</p>
<h3>1. Leverage Tahap — Bocor Terbesar ≠ Prioritas Terbesar</h3>
<p><strong>Definisi.</strong> <em>Leverage</em> tahap t = seberapa besar conversion total berubah jika conversion tahap t naik 1 poin. Karena conversion total adalah <strong>perkalian</strong>, leverage tiap tahap <strong>tidak sama</strong>: tahap dengan conversion kecil punya leverage besar — 5 poin di tahap 15% jauh lebih berdampak daripada 5 poin di tahap 70%.</p>
<Tex math={String.raw`\Delta CR_{total} \approx CR_{total} \times \frac{\Delta CR_t}{CR_t}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\Delta CR_{total}`} />: kenaikan conversion ujung-ke-ujung (dalam poin) akibat perbaikan</li>
<li><Tex math={String.raw`CR_{total}`} />: conversion total saat ini (hasil kali semua tahap)</li>
<li><Tex math={String.raw`\Delta CR_t`} />: kenaikan conversion di tahap t (misal 0,05 = 5 poin)</li>
<li><Tex math={String.raw`CR_t`} />: conversion tahap t saat ini — <strong>penyebutnya</strong>: makin kecil tahap ini, makin besar dampaknya</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Bayangkan lima pipa berurutan mengalirkan air. Memperlebar pipa yang <strong>paling sempit</strong> menambah aliran total paling banyak — karena dialah yang menahan semuanya. Rumus di atas adalah versi matematikanya: dampak perbaikan = total saat ini × (kenaikan ÷ ukuran tahap itu). Perhatikan penyebut <Tex math={String.raw`CR_t`} />: tahap 15% memberi &ldquo;pengali&rdquo; 1/0,15 ≈ 6,7 sedangkan tahap 70% cuma 1/0,70 ≈ 1,4. <strong>Perbaikan yang sama, dampak hampir 5x lipat.</strong></p>
<p><strong>Kapan dipakai:</strong> Setiap rapat prioritas. Jangan pernah memutuskan &ldquo;perbaiki onboarding&rdquo; hanya karena angkanya paling kecil — hitung leverage-nya, lalu bandingkan dengan <strong>biaya</strong> memperbaikinya (lihat jebakannya di bawah).</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Leverage 4 tahap (klik untuk buka)</summary>
<p>Funnel toko online: Kunjung 100% → Daftar <strong>40%</strong> → Keranjang <strong>60%</strong> → Bayar <strong>50%</strong>. Total = 0,40 × 0,60 × 0,50 = <strong>12%</strong>.</p>
<p><strong>Langkah 1</strong> — naikkan Daftar 40% → 45% (+5 poin): Δtotal ≈ 12% × 0,05/0,40 = <strong>+1,50 poin</strong> → total 13,5%.</p>
<p><strong>Langkah 2</strong> — naikkan Keranjang 60% → 65%: Δtotal ≈ 12% × 0,05/0,60 = <strong>+1,00 poin</strong> → total 13,0%.</p>
<p><strong>Langkah 3</strong> — naikkan Bayar 50% → 55%: Δtotal ≈ 12% × 0,05/0,50 = <strong>+1,20 poin</strong> → total 13,2%.</p>
<p><strong>Langkah 4 — bandingkan biaya.</strong> Menaikkan Daftar 5 poin mungkin cuma butuh menyederhanakan form (2 hari kerja). Menaikkan Bayar 5 poin mungkin butuh integrasi payment baru (2 bulan). <strong>Keputusan = leverage ÷ biaya.</strong> Leverage tanpa biaya = setengah cerita.</p>
<p><strong>Jebakan langit-langit:</strong> tahap yang sudah 90% maksimal naik 10 poin — leverage teoritisnya kecil <em>dan</em> ruangnya sempit. Jangan kejar tahap yang hampir sempurna.</p>
</details>
<PlotlyChart
  data={[{x: ["Daftar 40%", "Keranjang 60%", "Bayar 50%"], y: [1.5, 1.0, 1.2], type: "bar", marker: {color: ["#e8a838","#2a7de1","#2a7de1"]}, text: ["+1,50 poin","+1,00 poin","+1,20 poin"], textposition: "outside"}]}
  title={"Dampak menaikkan tiap tahap 5 poin (funnel total 12%)"}
  layout={{yaxis: {title: "Kenaikan conversion total (poin)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = tahap yang diperbaiki 5 poin, tinggi batang = tambahan conversion total. Batang kuning = pemenang leverage.</p>
<p><strong>Interpretasi:</strong> &ldquo;Daftar&rdquo; (tahap tersempit) memberi +1,50 poin — 50% lebih besar dari &ldquo;Keranjang&rdquo;. Inilah bukti visual mengapa analis selalu menghitung leverage sebelum mengusulkan prioritas: insting (&ldquo;perbaiki yang paling bawah&rdquo;) belum tentu benar.</p>
</div>
<h3>2. Tiga Cara LTV:CAC 3:1 Berbohong</h3>
<p>Rasio 3:1 adalah <strong>syarat perlu, bukan syarat cukup</strong>. Tiga kebohongan paling umum:</p>
<p><strong>Kebohongan 1 — churn dianggap konstan.</strong> Rumus LTV = ARPU × margin / churn mengasumsikan churn <strong>sama setiap bulan</strong>. Kenyataannya churn bulan pertama sering 3–5x churn bulan keenam (pengguna yang tidak cocok pergi duluan). Contoh: ARPU Rp100rb, margin 50%, churn rata-rata &ldquo;10%&rdquo;. Rumus sederhana → LTV Rp500rb. Tapi jika churn bulan 1 = 30% lalu 5%, umur harapan sebenarnya ≈ 1/0,30 + sisa ≈ jauh di bawah 10 bulan — LTV riil bisa <strong>Rp300rb</strong>. Kamu mengira rasio 2,5 (marginal), padahal 1,5 (sekarat).</p>
<p><strong>Kebohongan 2 — margin yang salah.</strong> Banyak dashboard memakai <strong>revenue</strong>, bukan <strong>margin kotor</strong>. E-commerce dengan ARPU Rp200rb dan margin 20%: LTV &ldquo;versi revenue&rdquo; = 200rb/0,1 = Rp2jt, sedangkan yang benar = 200rb × 0,2/0,1 = <strong>Rp400rb</strong>. Selisih 5x lipat — cukup untuk mengubah keputusan scale dari &ldquo;ya&rdquo; menjadi &ldquo;jangan&rdquo;.</p>
<p><strong>Kebohongan 3 — rasio tanpa payback.</strong> LTV:CAC 4:1 dengan payback <strong>30 bulan</strong> = kamu meminjamkan uang ke masa depan tanpa bunga selama 2,5 tahun. Kalau umur rata-rata pelanggan cuma 24 bulan, modal <strong>tidak pernah kembali</strong> meski rasio terlihat sehat. Itu sebabnya aturan lengkapnya selalu berpasangan: <strong>rasio ≥ 3 DAN payback &lt; 12 bulan</strong> — satu tanpa yang lain = ilusi.</p>
<div className="tip">
<p><strong>💡 Uji tiga pertanyaan sebelum percaya rasio LTV:CAC: (1) churn-nya konstan atau menurun? (2) yang dipakai margin kotor atau revenue? (3) berapa payback-nya? Kalau satu saja tidak bisa dijawab — rasionya belum bisa dipakai untuk keputusan scale.</strong></p>
</div>
<h3>3. Blended CAC vs Incremental CAC — Biaya Rata-rata Menipu</h3>
<p><strong>Definisi.</strong> <strong>CAC blended</strong> = total spend ÷ total pelanggan (termasuk yang datang organik/gratis). <strong>CAC incremental</strong> = tambahan spend ÷ tambahan pelanggan <strong>akibat spend itu</strong>. Keputusan scale <strong>wajib</strong> memakai incremental — karena yang kamu putuskan adalah &ldquo;tambah spend&rdquo;, bukan &ldquo;rata-rata masa lalu&rdquo;.</p>
<Tex math={String.raw`CAC_{incr} = \frac{\Delta \text{Biaya}}{\Delta \text{Pelanggan}} \quad;\quad \text{keputusan scale memakai } CAC_{incr}, \text{ bukan } CAC_{blended}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\Delta \text{Biaya}`} />: tambahan budget yang diusulkan (misal +Rp100jt)</li>
<li><Tex math={String.raw`\Delta \text{Pelanggan}`} />: tambahan pelanggan <em>akibat</em> tambahan budget itu saja (organik dikecualikan)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Blended CAC seperti <strong>nilai rapor rata-rata</strong> — ia mencampur nilai ulangan yang mudah (organik, murah) dengan yang susah (iklan tambahan, mahal). Saat kamu memutuskan &ldquo;ikut ulangan susulan?&rdquo;, yang relevan bukan rata-rata rapormu, tapi <strong>perkiraan nilai ulangan susulan itu sendiri</strong>. Channel yang sudah jenuh punya incremental CAC 2–3x blended-nya — dan dashboard tidak akan memberitahumu.</p>
<p><strong>Kapan dipakai:</strong> Setiap proposal &ldquo;tambah budget X&rdquo;. Minta dua angka: blended (untuk laporan) dan incremental (untuk keputusan).</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Jebakan blended CAC (klik untuk buka)</summary>
<p>Brand skincare: spend Rp100jt/bulan → 1.000 pelanggan (500 organik + 500 dari iklan). Blended CAC = 100jt/1.000 = <strong>Rp100rb</strong>. LTV Rp400rb → rasio terlihat <strong>4,0</strong>. &ldquo;Scale 2x!&rdquo; kata tim.</p>
<p><strong>Langkah 1</strong> — tambah Rp100jt (total Rp200jt) → pelanggan jadi 1.400 (organik tetap 500, iklan 900). Tambahan pelanggan = 400.</p>
<p><strong>Langkah 2</strong> — incremental CAC = 100jt/400 = <strong>Rp250rb</strong> — 2,5x blended!</p>
<p><strong>Langkah 3</strong> — rasio incremental = 400rb/250rb = <strong>1,6</strong> — di bawah 3, tidak layak scale. Blended menutupi kejenuhan channel dengan pelanggan organik yang &ldquo;gratis&rdquo;.</p>
<p><strong>Pelajaran:</strong> setiap rupiah <em>berikutnya</em> lebih mahal dari rata-rata rupiah <em>sebelumnya</em>. Inilah hukum saturasi — dibahas penuh di MK13 (adstock &amp; saturasi).</p>
</details>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Funnel itu garis lurus: orang masuk dari atas, keluar jadi pelanggan di bawah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Pengguna nyata <strong>loncat-loncat</strong>: install → diam 2 minggu → pesan → hilang → kembali lewat referral teman. Funnel modern dibaca sebagai <strong>loop</strong>: retention yang bagus menghidupkan referral, referral menjadi acquisition gratis. Kalau analisismu memaksa semua orang ke satu garis lurus, kamu akan salah menuduh &lsquo;bocor&rsquo; padahal mereka cuma mampir.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CAC rendah selalu bagus — yang penting murah dapat pelanggan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> CAC Rp20rb dengan churn 30%/bulan (LTV Rp80rb, rasio 4,0) <strong>lebih sehat</strong> daripada CAC Rp10rb dengan churn 5% tapi ARPU kecil (LTV Rp15rb, rasio 1,5). CAC rendah yang membawa pelanggan berkualitas sampah = ember bocor versi murah. Selalu baca CAC <strong>berpasangan</strong> dengan LTV.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Ukur conversion antar-tahap, bukan cuma total.</strong> Overall 0,4% tidak memberi tahu apa yang rusak. Lima angka antar-tahap (16%, 15%, 25%, 67%, 20%) langsung menunjuk tersangka: tahap 15%.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Dua angka penentu boleh-tidaknya scale: LTV:CAC ≥ 3 dan payback &lt; 12 bulan.</strong> Hafalkan. Setiap ada yang usul &lsquo;tambah budget 10x&rsquo;, minta dua angka ini dulu. Tidak ada = tidak scale.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Simulasi Funnel: Cari Bocor Terbesar</h2>
<p>Ubah conversion tiap tahap (0–1), jalankan, dan lihat: tahap mana yang paling menguntungkan jika diperbaiki 5 poin? Itulah prioritasmu minggu ini.</p>
<PyodideLab
  title={"Lab 1 — Simulator Bottleneck Funnel"}
  hint={"Coba: naikkan tahap terendah dari 0.15 → 0.20. Bandingkan hasilnya dengan menaikkan tahap tertinggi. Mana yang lebih berdampak?"}
  defaultCode={"# Simulator funnel: ubah angka conversion sesukamu (0.0 - 1.0)\ntahap = [\"Install\", \"Daftar\", \"Pesan_1\", \"Repeat\", \"Langganan\"]\nconv  = [1.00,     0.16,     0.15,      0.25,     0.67]  # conv[i] = dari tahap i-1 ke i\nawal = 50000\n\nn = awal\nprint(f\"{'Tahap':<12} {'Masuk':>8} {'Conv':>7}\")\nfor i, t in enumerate(tahap):\n    if i > 0:\n        n = int(n * conv[i])\n    print(f\"{t:<12} {n:>8,} {conv[i]:>6.0%}\" if i>0 else f\"{t:<12} {n:>8,} {'-':>7}\")\n\nprint(f\"\\nOverall conversion: {n/awal:.2%}\")\n# Bottleneck = tahap dengan conversion terendah (selain tahap 0)\nb = min(range(1, len(conv)), key=lambda i: conv[i])\nprint(f\"Bottleneck: {tahap[b]} ({conv[b]:.0%})\")\nbaru = int(n * (conv[b] + 0.05) / conv[b])\nprint(f\"Jika {tahap[b]} naik 5 poin ({conv[b]:.0%} -> {conv[b]+0.05:.0%}): pelanggan akhir {n:,} -> {baru:,} (+{baru-n:,})\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Unit Economics</h2>
<p>Masukkan angka bisnismu (atau tebak untuk latihan). Kalkulator memberi verdict: SEHAT, MARGINAL, atau MATI.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator CAC / LTV / Payback"}
  hint={"Coba skenario KopiKilat: spend=500jt, pelanggan=200, arpu=120rb, margin=0.6, churn=0.15. Lalu coba perbaiki churn jadi 0.05 — lihat apa yang terjadi pada LTV."}
  defaultCode={"# Kalkulator unit economics — ubah angka sesukamu\nspend     = 500_000_000  # total biaya akuisisi (Rp)\npelanggan = 200          # pelanggan baru (bayar)\narpu      = 120_000      # Rp / pelanggan / bulan\nmargin    = 0.60         # margin kotor (0-1)\nchurn     = 0.15         # churn per bulan (0-1)\n\ncac = spend / pelanggan\nltv = arpu * margin * (1 / churn)\nrasio = ltv / cac\npayback = cac / (arpu * margin)\n\nprint(f\"CAC      = Rp{cac:,.0f}\")\nprint(f\"LTV      = Rp{ltv:,.0f}\")\nprint(f\"LTV:CAC  = {rasio:.2f}  (syarat sehat >= 3.0)\")\nprint(f\"Payback  = {payback:.1f} bulan  (syarat < 12)\")\nprint(f\"Umur pelanggan rata-rata = {1/churn:.1f} bulan\")\nprint()\nif rasio >= 3 and payback < 12:\n    print(\"Verdict: SEHAT - boleh scale\")\nelif rasio >= 1:\n    print(\"Verdict: MARGINAL - perbaiki retention/pricing dulu\")\nelse:\n    print(\"Verdict: MATI - tiap pelanggan = rugi. JANGAN scale.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Acquisition kuat, activation jeblok (banyak datang, sedikit yang coba) → <strong>Fokus ACTIVATION</strong></h3>
<p><strong>Kenapa:</strong> Orang sudah datang tapi tidak merasakan nilai. Masalahnya di onboarding / aha moment, bukan di iklan.</p>
<p><strong>Contoh nyata:</strong> Duolingo: streak & lesson pertama 2 menit. E-commerce: voucher first-order + gratis ongkir.</p>
</div>
<div className="decision-card">
<h3>2. Activation oke, retention anjlok (coba sekali lalu hilang) → <strong>Fokus RETENTION</strong></h3>
<p><strong>Kenapa:</strong> Produk belum jadi kebiasaan. Acquisition baru hanya menambal ember bocor — mahal dan sia-sia.</p>
<p><strong>Contoh nyata:</strong> Notifikasi habit loop (Tokopedia: flash sale harian), program loyalitas, email win-back.</p>
</div>
<div className="decision-card">
<h3>3. Retention bagus, revenue kecil (ramai tapi tidak bayar) → <strong>Fokus REVENUE / MONETIZATION</strong></h3>
<p><strong>Kenapa:</strong> Nilai sudah dirasakan, tinggal cara menagihnya. Jangan tambah user dulu — naikkan ARPU dari yang ada.</p>
<p><strong>Contoh nyata:</strong> Freemium → paywall fitur pro; bundling; naikkan harga tier dengan value baru.</p>
</div>
<div className="decision-card">
<h3>4. Semua tahap sehat + LTV:CAC ≥ 3 + payback &lt; 12 bulan → <strong>SCALE ACQUISITION</strong></h3>
<p><strong>Kenapa:</strong> Mesin sudah terbukti menghasilkan. Setiap rupiah iklan kembali ≥ 3x. Inilah satu-satunya kondisi scale itu rasional.</p>
<p><strong>Contoh nyata:</strong> Naikkan budget iklan bertahap (2x, ukur, 2x lagi) sambil pantau CAC tidak naik.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Hitung conversion tiap tahap</strong> — bukan cuma total.</li><li><strong>Cari drop terbesar</strong> — itulah prioritas minggu ini.</li><li><strong>Hitung LTV:CAC</strong> — di bawah 3 = jangan scale.</li><li><strong>Baru tambah budget</strong> kalau dua syarat di atas lolos.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<p>Dua kisah nyata (nama disamarkan) tentang bagaimana angka funnel yang &ldquo;benar&rdquo; tetap bisa menghasilkan keputusan yang salah — dan apa yang membedakannya.</p>
<h3>Kisah 1: Gratis Ongkir yang Menaikkan Conversion dan Membunuh Margin</h3>
<p>E-commerce fashion &ldquo;ModaKita&rdquo; melihat activation (kunjung → beli pertama) stagnan di 12%. Tim growth mengusulkan <strong>gratis ongkir tanpa minimum belanja</strong>. Hasil 2 bulan: activation naik ke <strong>19%</strong> (+58%!), funnel terlihat jauh lebih sehat. Deck internal penuh confetti.</p>
<p>Analis yang teliti membuka lapisan kedua: <strong>margin kotor turun dari 35% ke 22%</strong> (ongkir memakan margin), dan <strong>nilai keranjang rata-rata turun 18%</strong> (orang beli 1 barang murah karena &ldquo;gratis ongkir&rdquo;). Hitung ulang: LTV turun dari Rp850rb ke Rp470rb, sedangkan CAC naik (budget iklan sama, tapi... tunggu, CAC per pelanggan <em>turun</em> karena conversion naik). LTV:CAC bergerak dari <strong>3,4 → 2,1</strong> — di bawah ambang sehat.</p>
<p>Keputusan akhir: gratis ongkir <strong>dipertahankan tapi dengan minimum belanja Rp150rb</strong>. Activation turun sedikit ke 16%, tapi margin pulih ke 31% dan LTV:CAC kembali ke 3,1. <strong>Pelajaran:</strong> metrik funnel (conversion) dan unit economics (LTV:CAC) harus dibaca <strong>berpasangan</strong>. Funnel yang membaik sambil ekonomi memburuk = kemenangan semu.</p>
<h3>Kisah 2: SaaS dengan LTV:CAC 4:1 yang Kehabisan Kas</h3>
<p>SaaS B2B &ldquo;KantorPintar&rdquo; bangga: ARPA Rp5jt/tahun, CAC Rp15jt, churn 5%/tahun → LTV = 5jt × 0,8 / 0,05 = <strong>Rp80jt</strong>. Rasio <strong>5,3:1</strong> — jauh di atas ambang. Mereka scale agresif: rekrut 20 AE baru, bakar Rp3 miliar dalam setahun.</p>
<p>Yang tidak dihitung: <strong>payback</strong> = 15jt / (5jt × 0,8) = <strong>3,75 tahun</strong>. Sementara kontrak rata-rata cuma 2 tahun dan churn riil (termasuk downgrade) 25%/tahun — LTV riil ≈ 5jt × 0,8 / 0,25 = Rp16jt, rasio riil <strong>1,07</strong>. Kas habis di bulan ke-14; putaran pendanaan berikutnya gagal karena investor menghitung payback, bukan rasio.</p>
<p><strong>Pelajaran:</strong> rasio tanpa payback = mobil tanpa rem terlihat bagus di foto. Aturan &ldquo;payback &lt; 12 bulan&rdquo; ada <strong>untuk melindungi kas</strong>, bukan untuk mempersulit hidupmu. Startup mati karena kehabisan kas, bukan karena rasio jelek di spreadsheet.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Kalau semua metrik hijau, berarti bisnis sehat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Metrik hijau yang <strong>saling bertentangan</strong> (conversion naik + margin turun, rasio bagus + payback panjang) adalah sinyal paling berharga — ia menunjukkan <strong>di mana model bisnismu berbohong pada dirinya sendiri</strong>. Analis hebat justru berburu kontradiksi, bukan mengoleksi angka hijau.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: KopiKilat — Scale atau Perbaiki?</h2>
<div className="callout">
<p>Kamu analis di KopiKilat. CEO mengusulkan: <em>&ldquo;Funnel kita 0,4% — kecil. Kita scale iklan 5x supaya pelanggan 5x lipat!&rdquo;</em> Data: spend Rp500 jt → 200 pelanggan. ARPU Rp120rb/bln, margin 60%, churn 15%/bln. Conversion antar-tahap: 16% → <strong>15%</strong> → 25% → 67%.</p>
<p><strong>Pertanyaan:</strong> (a) Di tahap mana bottleneck-nya, dan berapa orang hilang di sana? (b) Apakah usul scale 5x rasional? (c) Jika budget perbaikan terbatas, satu intervensi apa yang paling berdampak?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Daftar → pesan pertama (15%)</strong>: 8.000 daftar, cuma 1.200 pesan — <strong>6.800 orang hilang</strong> di satu sambungan. Ini 85% dari semua yang daftar.</p>
<p>(b) <strong>Tidak rasional.</strong> LTV Rp480rb vs CAC Rp2,5jt → rasio 0,19. Scale 5x = rugi 5x lebih besar (Rp2jt rugi × 1.000 pelanggan = Rp2 miliar). Syarat scale (LTV:CAC ≥ 3) tidak terpenuhi.</p>
<p>(c) <strong>Perbaiki onboarding:</strong> sederhanakan pendaftaran (guest checkout), voucher Rp30rb untuk pesanan pertama, dan tutorial 30 detik. Jika tahap 15% → 25%, pelanggan akhir naik dari 200 → ~333 <em>tanpa tambah budget iklan</em>. Matematika: 8.000 × 0,25 × 0,25 × 0,67 ≈ 335.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p>Empat soal untuk menguji apakah intuisi &ldquo;ember bocor&rdquo;-mu sudah terasah. Kerjakan dulu (kertas + kalkulator cukup), baru buka pembahasannya.</p>
<p><strong>Soal 1 — Prioritas leverage.</strong> Funnel: Visitor 100% → Signup <strong>25%</strong> → Aktivasi <strong>80%</strong> → Bayar <strong>30%</strong>. Total = 0,25 × 0,80 × 0,30 = <strong>6%</strong>. Kamu punya satu sprint (2 minggu) dan hanya bisa memperbaiki <strong>satu</strong> tahap sebesar +5 poin. Tahap mana yang memberi kenaikan total terbesar, dan berapa?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>Pakai rumus leverage: Δtotal ≈ total × (0,05 / CR<sub>t</sub>).</p>
<p>Signup: 6% × 0,05/0,25 = <strong>+1,20 poin</strong>. Aktivasi: 6% × 0,05/0,80 = <strong>+0,375 poin</strong>. Bayar: 6% × 0,05/0,30 = <strong>+1,00 poin</strong>.</p>
<p><strong>Jawaban: Signup (+1,20 poin).</strong> Perhatikan: tahap &ldquo;Bayar&rdquo; (paling bawah, sering jadi obsesi) kalah dari &ldquo;Signup&rdquo;. Insting &ldquo;perbaiki yang paling dekat dengan uang&rdquo; salah di sini — matematika tidak peduli posisi tahap, hanya peduli ukurannya.</p>
</details>
<p><strong>Soal 2 — LTV yang jujur.</strong> ARPU Rp150rb/bln, margin kotor <strong>40%</strong> (bukan 100%!), churn bulan 1 = 25%, churn bulan ≥2 = 8%. (a) Hitung LTV &ldquo;naif&rdquo; dengan churn rata-rata 10%. (b) Estimasi LTV yang lebih jujur: pelanggan bertahan bulan 1 dengan peluang 75%, lalu umurnya ≈ 1/0,08 bulan. Bandingkan.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>(a) Naif: 150rb × 0,4 / 0,10 = <strong>Rp600rb</strong>.</p>
<p>(b) Jujur: profit per bulan = 150rb × 0,4 = Rp60rb. Peluang lolos bulan 1 = 75%; setelah itu umur harapan = 1/0,08 = 12,5 bulan. LTV ≈ 0,75 × 60rb × 12,5 = <strong>Rp562,5rb</strong>... terlihat mirip? Sekarang ubah churn bulan 1 jadi 40% (produk dengan onboarding buruk): LTV ≈ 0,60 × 60rb × 12,5 = <strong>Rp450rb</strong> — 25% di bawah versi naif. <strong>Pelajaran:</strong> semakin buruk bulan pertamamu, semakin besar kebohongan rumus sederhana. Dan (b) masih optimistis — ia mengabaikan bahwa yang churn di bulan 1 adalah yang paling tidak cocok.</p>
</details>
<p><strong>Soal 3 — Blended vs incremental.</strong> Spend Rp200jt → 2.000 pelanggan (1.200 organik). LTV Rp500rb. (a) Blended CAC dan rasio. (b) Tambahan Rp200jt menghasilkan +600 pelanggan. Incremental CAC dan rasio incremental. (c) Layak scale?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>(a) Blended = 200jt/2.000 = <strong>Rp100rb</strong>; rasio = 500rb/100rb = <strong>5,0</strong> — terlihat fantastis.</p>
<p>(b) Incremental = 200jt/600 = <strong>Rp333rb</strong>; rasio incremental = 500rb/333rb = <strong>1,5</strong>.</p>
<p>(c) <strong>Tidak layak scale agresif.</strong> Keputusan &ldquo;tambah Rp200jt&rdquo; dibayar dengan rasio 1,5, bukan 5,0. Organik (1.200 pelanggan &ldquo;gratis&rdquo;) membuat blended terlihat murah — tapi organik tidak ikut bertambah saat kamu tambah spend. <strong>Selalu tanya: CAC dari rupiah <em>berikutnya</em>, bukan rata-rata rupiah <em>kemarin</em>.</strong></p>
</details>
<p><strong>Soal 4 — Payback membunuh.</strong> CAC Rp1,2jt, ARPU Rp100rb/bln, margin 70%, churn 6%/bln. (a) LTV, rasio, payback. (b) Umur rata-rata pelanggan? (c) Verdict lengkap.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>(a) LTV = 100rb × 0,7 / 0,06 = <strong>Rp1.167.000</strong> ≈ Rp1,17jt. Rasio = 1,17jt/1,2jt = <strong>0,97</strong>. Payback = 1,2jt/(100rb × 0,7) = <strong>17,1 bulan</strong>.</p>
<p>(b) Umur rata-rata = 1/0,06 = <strong>16,7 bulan</strong> — lebih pendek dari payback 17,1 bulan!</p>
<p>(c) <strong>MATI.</strong> Rasio &lt; 1 (rugi per pelanggan) DAN payback &gt; umur pelanggan (modal tidak pernah kembali bahkan secara teori). Ini contoh &ldquo;Soal 4&rdquo; yang harus bisa kamu jawab dalam 60 detik di rapat: rasio, payback, umur — tiga angka, satu verdict.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga angka yang harus keluar dari mulutmu tanpa berpikir: rasio LTV:CAC, payback (bulan), dan umur rata-rata pelanggan. Kalau ketiganya tidak hafal di luar kepala untuk bisnismu, kamu belum siap memberi rekomendasi scale.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Funnel: 10.000 visitor → 2.000 signup → 400 aktif → 100 bayar. Berapa conversion signup → aktif?"}
  options={
    ["20%",
    "4%",
    "2%",
    "40%"]
  }
  correct={0}
  explanation={"Benar: 400/2.000 = 20%. Yang 4% (400/10.000) itu conversion visitor → aktif — beda tahap, beda arti. Selalu bagi dengan tahap sebelumnya, bukan dengan paling atas."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. CAC Rp200rb, ARPU Rp50rb/bln, margin 80%, churn 10%/bln. Berapa LTV dan verdict-nya?"}
  options={
    ["LTV Rp400rb, SEHAT",
    "LTV Rp400rb, MARGINAL (rasio 2,0)",
    "LTV Rp500rb, SEHAT",
    "LTV Rp160rb, MATI"]
  }
  correct={1}
  explanation={"Benar: LTV = 50.000 × 0,8 × (1/0,10) = Rp400rb. Rasio 400rb/200rb = 2,0 — di bawah 3 tapi di atas 1 → MARGINAL. Boleh jalan, belum boleh scale agresif."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Startup A: CAC 100rb, LTV 500rb. Startup B: CAC 50rb, LTV 120rb. Mana lebih sehat?"}
  options={
    ["B, karena CAC-nya lebih murah",
    "A, karena rasio LTV:CAC 5,0 vs 2,4",
    "Sama saja",
    "Tidak bisa dibandingkan"]
  }
  correct={1}
  explanation={"Benar: A (5,0) vs B (2,4). CAC murah tidak ada artinya tanpa LTV. B terlihat efisien tapi tiap pelanggannya kurang menguntungkan secara relatif."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. K-factor 0,3 artinya…"}
  options={
    ["Tiap 10 pelanggan membawa 3 pelanggan baru; belum viral",
    "30% pelanggan mereferensikan",
    "Viral — tumbuh eksponensial",
    "Churn 30%"]
  }
  correct={0}
  explanation={"Benar: K = 0,3 &lt; 1 → tiap pelanggan rata-rata membawa 0,3 pelanggan baru. Referral membantu tapi tidak menciptakan pertumbuhan viral (butuh K &gt; 1)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Activation rate rendah tapi retention tinggi. Fokus tim yang benar?"}
  options={
    ["Tambah budget iklan",
    "Perbaiki onboarding / aha moment",
    "Naikkan harga",
    "Program referral"]
  }
  correct={1}
  explanation={"Benar: yang bertahan itu setia (retention tinggi) — masalahnya orang tidak sampai merasakan nilai. Perbaiki jembatan daftar → aha moment, bukan menambah orang di pintu masuk."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: WarungDigital dari Nol sampai Memo Keputusan</h2>
<p>Semua konsep MK1 dalam satu alur kerja nyata. Ikuti langkahnya — di akhir kamu menulis memo yang benar-benar bisa dikirim ke CEO.</p>
<p><strong>Situasi.</strong> &ldquo;WarungDigital&rdquo;, aplikasi belanja kebutuhan harian. Data 3 bulan: 200.000 install (spend iklan Rp1,2 miliar), 60.000 daftar, 18.000 belanja pertama, 9.000 belanja ulang, 4.500 pelanggan aktif bulanan. ARPU Rp80rb/bln, margin kotor 25%, churn 20%/bln. CEO bertanya: <em>&ldquo;Scale iklan 3x lipat?&rdquo;</em></p>
<h3>Langkah 1 — Petakan funnel dan temukan bottleneck</h3>
<p>Conversion antar-tahap: 60.000/200.000 = <strong>30%</strong>; 18.000/60.000 = <strong>30%</strong>; 9.000/18.000 = <strong>50%</strong>; 4.500/9.000 = <strong>50%</strong>. Total = 0,30 × 0,30 × 0,50 × 0,50 = <strong>2,25%</strong>. Dua tahap 30% adalah kandidat bottleneck — tapi jangan berhenti di &ldquo;yang terkecil&rdquo;; hitung leverage (keduanya sama di sini: 2,25% × 0,05/0,30 = +0,375 poin per 5 poin perbaikan).</p>
<h3>Langkah 2 — Unit economics yang jujur</h3>
<p>CAC blended = 1,2M/4.500 = <strong>Rp266.667</strong>. LTV = 80rb × 0,25 / 0,20 = <strong>Rp100rb</strong>. Rasio = <strong>0,375</strong>. Payback = 266.667/(80rb × 0,25) = <strong>13,3 bulan</strong>; umur rata-rata = 1/0,20 = <strong>5 bulan</strong>. Verdict sementara: <strong>MATI</strong> — tiap pelanggan rugi Rp166rb, dan modal tidak pernah kembali (payback &gt; umur).</p>
<h3>Langkah 3 — Uji incremental sebelum menolak mentah-mentah</h3>
<p>Tim growth protes: &ldquo;Itu blended! Spend terakhir kita lebih efisien.&rdquo; Data: Rp400jt terakhir → 2.000 pelanggan aktif baru. Incremental CAC = 400jt/2.000 = <strong>Rp200rb</strong>. Rasio incremental = 100rb/200rb = <strong>0,5</strong>. Masih &lt; 1 — protes ditolak dengan angka, bukan opini. <strong>Inilah gunanya incremental: ia memberi tim growth kesempatan membuktikan diri secara adil — dan kali ini buktinya tetap gagal.</strong></p>
<h3>Langkah 4 — Cari jalan hidup: segmen mana yang sehat?</h3>
<p>Sebelum menyerah, pecah per segmen (pelajaran STP): pelanggan &ldquo;keluarga&rdquo; (belanja &gt; Rp300rb/transaksi): ARPU Rp200rb, churn 8% → LTV = 200rb × 0,25/0,08 = <strong>Rp625rb</strong>; CAC segmen ini (via komunitas ibu-ibu) Rp150rb → rasio <strong>4,2</strong>, payback 150rb/(200rb×0,25) = <strong>3 bulan</strong>. <strong>SEHAT.</strong> Segmen &ldquo;anak kos&rdquo; (belanja kecil, churn 35%): LTV = 80rb × 0,25/0,35 ≈ Rp57rb, rasio &lt; 1 — racun.</p>
<h3>Langkah 5 — Memo keputusan (yang sebenarnya dibaca CEO)</h3>
<div className="callout">
<p><strong>Memo: Jangan scale 3x. Pivot targeting ke segmen keluarga.</strong></p>
<p><strong>What:</strong> LTV:CAC keseluruhan 0,38 (rugi Rp166rb/pelanggan); incremental 0,5 — scale = bakar lebih cepat. Tapi segmen keluarga sehat (4,2; payback 3 bulan) dan hanya 20% dari base.</p>
<p><strong>So what:</strong> Masalah bukan &ldquo;iklan kurang&rdquo; tapi &ldquo;iklan menarget orang yang salah&rdquo;. 80% spend menarik segmen anak kos yang churn 35%.</p>
<p><strong>Now what:</strong> (1) Hentikan 60% spend broad-targeting minggu ini. (2) Alihkan ke channel komunitas keluarga dengan batas CAC Rp200rb (= LTV 625rb/3). (3) Perbaiki daftar → belanja pertama untuk segmen keluarga (leverage +0,375 poin/5 poin). (4) Review 30 hari: target rasio segmen ≥ 3.</p>
</div>
<p><strong>Intuisi penutup:</strong> analis yang baik tidak menjawab &ldquo;ya/tidak&rdquo; untuk scale — ia menjawab <strong>&ldquo;scale untuk siapa, dengan batas berapa, dan apa yang diperbaiki dulu&rdquo;</strong>. Lima langkah di atas adalah template yang bisa kamu pakai untuk bisnis apa pun: funnel → leverage → unit economics jujur → incremental → segmen → memo.</p>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Funnel</h2>
<p>Lima jebakan yang paling sering menjatuhkan analis junior — lengkap dengan cara mendeteksinya dalam 10 detik.</p>
<h3>Jebakan 1: Rata-rata yang menutupi segmen beracun</h3>
<p>Funnel gabungan: conversion 5%, LTV:CAC 3,2 — terlihat sehat. Dipecah: segmen A (30% base) rasio 8,0; segmen B (70% base) rasio <strong>1,1</strong>. Keputusan &ldquo;scale&rdquo; berdasarkan rata-rata = 70% budget dibakar di segmen B. <strong>Deteksi 10 detik:</strong> selalu minta funnel <em>per segmen akuisisi</em> sebelum setuju scale. Rata-rata adalah tempat kebenaran disembunyikan.</p>
<h3>Jebakan 2: Activation dirayakan, retention dilupakan</h3>
<p>Tim merayakan &ldquo;aktivasi naik 40%!&rdquo; setelah redesign onboarding. Tiga bulan kemudian revenue flat — karena yang diaktivasi adalah pengguna insentif (voucher Rp50rb) dengan churn 60% di bulan kedua. Aktivasi tanpa retention = mengisi ember yang dasarnya hilang. <strong>Deteksi 10 detik:</strong> setiap klaim kenaikan aktivasi wajib ditemani <strong>retention 30 hari kohor yang sama</strong>. Tidak ada = belum terbukti.</p>
<h3>Jebakan 3: K-factor dari undangan terkirim</h3>
<p>&ldquo;K-factor kami 0,8!&rdquo; — dihitung dari undangan <em>terkirim</em> per pengguna × asumsi conversion. Yang benar: K = undangan terkirim × conversion <em>aktual</em> undangan → pelanggan. Startup yang menghitung dari terkirim saja biasanya overestimasi 3–5x. <strong>Deteksi 10 detik:</strong> tanya &ldquo;conversion undangannya diukur atau diasumsikan?&rdquo; Diasumsikan = angka fantasi.</p>
<h3>Jebakan 4: Funnel linear untuk produk loop</h3>
<p>Marketplace dianalisis dengan funnel lurus: visitor → beli. Padahal 40% transaksinya dari <strong>penjual yang juga pembeli</strong> dan repeat buyer — loop, bukan garis. Optimasi &ldquo;conversion visitor→beli&rdquo; mengabaikan mesin sebenarnya: retensi penjual. <strong>Deteksi 10 detik:</strong> jika &gt;30% revenue dari repeat/loop, gambar funnel sebagai <strong>siklus</strong> (akuisisi → aktivasi → retensi → referral → akuisisi). Keputusan dari model yang salah bentuk = salah arah.</p>
<h3>Jebakan 5: Payback dihitung dari revenue, bukan margin</h3>
<p>&ldquo;Payback 6 bulan!&rdquo; — dihitung CAC ÷ ARPU. Dengan margin 25%, payback sebenarnya = CAC ÷ (ARPU × 0,25) = <strong>24 bulan</strong>. Empat kali lipat. Kesalahan ini sendirian sudah cukup membunuh startup. <strong>Deteksi 10 detik:</strong> setiap angka payback yang kamu lihat, tanya &ldquo;ini dibagi ARPU atau dibagi kontribusi margin?&rdquo; Kalau jawabannya ARPU, kalikan 1/margin di kepalamu sebelum bereaksi.</p>
<div className="tip">
<p><strong>💡 Checklist anti-jebakan sebelum presentasi funnel: (1) per segmen, bukan rata-rata; (2) aktivasi ditemani retention kohor; (3) K-factor dari conversion aktual; (4) bentuk model sesuai produk (garis vs loop); (5) payback dari margin, bukan revenue. Lima centang = analis yang bisa dipercaya.</strong></p>
</div>

      <h2 id="rapat">💬 Simulasi Rapat: Menjawab 5 Pertanyaan Tersulit CEO</h2>
<p>Angka tanpa keberanian menjawab pertanyaan sulit = hiasan. Berikut lima pertanyaan yang <em>pasti</em> muncul saat kamu presentasi funnel — dan jawaban berbasis angka yang membuatmu dipercaya.</p>
<p><strong>1. &ldquo;Kenapa conversion kita cuma 2%? Kompetitor katanya 5%.&rdquo;</strong><br/>Jawaban: &ldquo;Karena kita mengukur <strong>install → pelanggan aktif bulanan</strong> (4 tahap), mereka mungkin mengukur <strong>kunjung → checkout</strong> (2 tahap). Conversion tanpa definisi tahap = tidak bisa dibandingkan. Funnel kita per tahap: 30% → 30% → 50% → 50%. Tahap mana dari mereka yang 5%? Minta definisinya dulu — 9 dari 10 perbandingan antar-perusahaan runtuh di titik ini.&rdquo;</p>
<p><strong>2. &ldquo;Kalau LTV:CAC 0,38, kenapa tidak tutup saja?&rdquo;</strong><br/>Jawaban: &ldquo;Karena 0,38 adalah <strong>rata-rata</strong>. Segmen keluarga rasionya 4,2 dengan payback 3 bulan — mesin yang sehat sedang disubsidi silang oleh segmen beracun. Keputusan yang benar bukan tutup, tapi <strong>potong 70% spend yang menarik segmen beracun dan alihkan ke segmen keluarga</strong>. Saya bawa datanya per segmen di slide 3.&rdquo;</p>
<p><strong>3. &ldquo;Tim growth bilang incremental CAC mereka Rp150rb, kok beda dengan hitunganmu?&rdquo;</strong><br/>Jawaban: &ldquo;Mari samakan definisi. Incremental = Δspend ÷ Δpelanggan <em>yang benar-benar tambahan</em>. Kalau mereka menghitung 400jt ÷ 2.667 (= Rp150rb), mereka memasukkan 667 pelanggan organik yang datang tanpa iklan. Dengan organik dikecualikan: 400jt ÷ 2.000 = <strong>Rp200rb</strong>. Selisih Rp50rb ini = Rp100jt keputusan budget. Saya usulkan definisi incremental dibakukan mulai bulan ini.&rdquo;</p>
<p><strong>4. &ldquo;Berapa lama sampai kita sehat?&rdquo;</strong><br/>Jawaban: &ldquo;Tiga skenario. <strong>Optimistis</strong> (pivot segmen keluarga berhasil 100%): rasio blended 3,0 dalam 2 kuartal. <strong>Realistis</strong> (70% berhasil): 3 kuartal. <strong>Pesimistis</strong> (pivot gagal): kita harus turunkan CAC 60% atau naikkan ARPU 2x — saya tidak merekomendasikan skenario ini tanpa pivot pricing. Angka-angka ini ada di appendix dengan asumsinya — silakan tantang asumsi saya.&rdquo;</p>
<p><strong>5. &ldquo;Satu hal yang harus saya setujui hari ini, apa?&rdquo;</strong><br/>Jawaban: &ldquo;<strong>Hentikan spend broad-targeting Rp720jt/bulan mulai minggu depan.</strong> Itu 60% dari Rp1,2M yang terbukti menarik segmen beracun (rasio 0,5 incremental). Uangnya dialihkan bertahap ke channel komunitas keluarga dengan batas CAC Rp200rb. Keputusan ini <em>reversible</em> dalam 30 hari jika data berkata lain — tapi setiap bulan menunda = Rp480jt rugi tambahan (720jt × (1 − 0,38) ≈ Rp446jt, dibulatkan dengan buffer).&rdquo;</p>
<div className="tip">
<p><strong>💡 Pola jawaban yang dipercaya direksi: angka dulu, definisi kedua, keputusan ketiga, reversibilitas keempat. Tidak pernah &ldquo;menurut saya&rdquo; tanpa angka; tidak pernah angka tanpa &ldquo;jadi kita harus apa&rdquo;. Latih lima jawaban di atas dengan datamu sendiri — itulah bedanya analis dan <em>trusted advisor</em>.</strong></p>
</div>
<p><strong>6. &ldquo;Oke saya setuju pivot. Bagaimana saya tahu ini berhasil dalam 30 hari?&rdquo;</strong><br/>Jawaban: &ldquo;Tiga indikator, semuanya mingguan. <strong>Pertama</strong>, porsi pelanggan baru dari segmen keluarga: dari 20% → target 45%. <strong>Kedua</strong>, blended CAC: dari Rp266rb → di bawah Rp200rb (batas CAC segmen keluarga). <strong>Ketiga</strong>, retention 30 hari kohor baru: dari 50% → di atas 65%. Jika dua dari tiga tidak tercapai di hari ke-30, kita kembalikan 50% spend broad-targeting dan saya yang bertanggung jawab. Ini kontraknya — tertulis, terukur, ada tanggalnya.&rdquo;</p>
<p><strong>Intuisi terakhir:</strong> CEO tidak membeli analisismu — ia membeli <strong>keberanianmu menaruh nama di bawah angka</strong>. &ldquo;Jika gagal, ini yang saya lakukan&rdquo; adalah kalimat termahal di ruangan itu. Analis yang berani salah secara terukur akan selalu dipanggil kembali; analis yang selalu aman tidak pernah dipercaya keputusan besar.</p>
<details className="worked">
<summary>📐 Latihan penutup: tulis jawabanmu sendiri (klik untuk panduan)</summary>
<p>Ambil satu angka dari bisnismu (atau WarungDigital). Tulis jawaban 3 kalimat untuk: &ldquo;Kenapa angkanya segini?&rdquo; Kalimat 1 = angka + definisi. Kalimat 2 = pembanding yang adil (segmen/waktu/definisi sama). Kalimat 3 = keputusan yang diminta. Contoh: &ldquo;Conversion daftar→beli kita 30% — diukur dari pendaftar terverifikasi, bukan semua visitor. Kohor bulan lalu 28%, jadi ini naik 2 poin. Saya minta persetujuan alihkan Rp100jt ke perbaikan checkout karena leverage-nya +0,5 poin.&rdquo; Tiga kalimat, nol jargon, satu keputusan.</p>
</details>


      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>AARRR</strong>: lima tahap (Acquisition → Activation → Retention → Revenue → Referral); ukur conversion <em>antar-tahap</em> untuk menemukan bottleneck.</li>
<li><strong>Overall conversion</strong> = hasil kali semua tahap — satu tahap 15% menyeret semuanya.</li>
<li><strong>STP</strong> (siapa yang dilayani) mendahului <strong>4P</strong> (bagaimana melayani); analisis funnel selalu per segmen.</li>
<li><strong>CAC</strong> = biaya/pelanggan baru; <strong>LTV</strong> = ARPU × margin × (1/churn); <strong>ROAS</strong> = revenue/biaya iklan; <strong>Payback</strong> = CAC/(ARPU × margin).</li>
<li><strong>Aturan scale</strong>: LTV:CAC ≥ 3 dan payback &lt; 12 bulan. Di bawah itu, scale = bakar uang lebih cepat.</li>
<li><strong>Kapan TIDAK pakai funnel linear</strong>: produk dengan loop kuat (marketplace, social) — baca sebagai loop retention → referral → acquisition.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a19-eda-end-to-end" className="btn btn-secondary btn-sm">← A1.9 EDA</Link>
        <Link href="/learn/mk2-tracking" className="btn btn-primary btn-sm">MK2 →</Link>
      </div>
    </div>
  );
}

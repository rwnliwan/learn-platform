"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk7PropensityPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK7 — Marketing Data Analytics</span>
        <h1 className="display-title">Propensity & Next-Best-Action:<br/>Tawaran yang Tepat, ke Orang yang Tepat</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: 100.000 Email, 200 Pembeli — dan yang Salah Sasaran</a></li>
<li><a href="#prop">Propensity Modeling</a></li>
<li><a href="#nba">Next-Best-Action</a></li>
<li><a href="#lookalike">Lead Scoring & Lookalike</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Dari Skor ke Keputusan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: 10.000 Email PropertiKu</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Dari 100.000 Email ke Mesin NBA</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Propensity</a></li>
<li><a href="#extra3">📋 Playbook: Matriks NBA 1 Halaman</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Satu Skor</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Membela "Diam"</a></li>
<li><a href="#faq">❓ Tanya-Jawab Kilat</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan apa itu propensity score dan membedakannya dari prediksi churn/CLV.</li>
<li>Membaca kurva kalibrasi dan menjelaskan kenapa ranking bagus belum cukup.</li>
<li>Memilih next-best-action per pelanggan dengan expected value (bukan skor tertinggi mentah).</li>
<li>Merancang lead scoring B2B dan menjelaskan cara kerja lookalike audience.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: 100.000 Email, 200 Pembeli — dan yang Salah Sasaran</h2>
      <div className="story">
        <p>Tim CRM <em>&ldquo;PropertiKu&rdquo;</em> punya model &ldquo;canggih&rdquo;: skor ketertarikan KPR untuk 100.000 leads. Mereka kirim email penawaran ke <strong>10.000 skor tertinggi</strong>. Hasil: 200 pembeli (2%). Direksi kecewa: <em>&ldquo;Modelnya tidak bekerja!&rdquo;</em></p>
<p>Twist-nya: modelnya <strong>bekerja dengan benar</strong> — decile teratas memang konversi 2% vs 0,2% rata-rata (10x lift!). Yang salah: <strong>keputusan</strong>. Mereka menghubungi 10.000 orang padahal hanya 2.000 teratas yang EV-positif (8.000 sisanya: biaya email + unsubscribe &gt; expected revenue). Dan mereka menawarkan KPR ke semua — padahal untuk separuhnya, <em>next-best-action</em> yang benar adalah undangan survei lokasi dulu (EV lebih tinggi). Lesson ini: <strong>skor ≠ keputusan</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="prop">Propensity — Peluang Seseorang Mau Melakukan Sesuatu</h2>
<p><strong>Definisi.</strong> <strong>Propensity score</strong> = P(aksi | X): peluang seseorang melakukan aksi tertentu (beli, klik, daftar) given karakteristiknya. Model klasik: <strong>regresi logistik</strong> — memetakan kombinasi linear fitur ke peluang 0–1 via fungsi sigmoid. Output dipakai untuk <strong>ranking</strong> (urutkan: siapa dihubungi duluan) dan — kalau terkalibrasi — untuk <strong>expected value</strong>.</p>
<p><strong>Kalibrasi</strong> = apakah &ldquo;P=0,2&rdquo; benar-benar kejadian 20%? Model bisa ranking bagus (AUC tinggi) tapi kalibrasi jelek (semua skor menumpuk di 0,4–0,6). Untuk keputusan berbasis EV, kalibrasi wajib — cek dengan <strong>reliability curve</strong> (bin skor vs rate aktual).</p>
<Tex math={String.raw`P(y=1 \mid X) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p)}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`P(y=1 \mid X)`} />: propensity — peluang aksi given fitur</li>
<li><Tex math={String.raw`\beta_j`} />: bobot fitur j — tanda &amp; besarnya = arah &amp; kuat pengaruh (setelah standardisasi)</li>
<li>Fungsi sigmoid memetakan skor linear (−∞ s.d. +∞) ke peluang (0 s.d. 1)</li>
<li>Kalibrasi: plot rata-rata prediksi per bin vs rate aktual — idealnya garis diagonal</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Propensity seperti <strong>pramuniaga berpengalaman</strong> yang melirik pengunjung dan menebak &lsquo;yang ini serius mau beli&rsquo;. Ia tidak selalu benar per orang — tapi kalau ia menunjuk 10 orang, 3 beli (vs rata-rata 1 dari 10), instingnya berharga. Kalibrasi = memastikan &lsquo;feeling 30%&rsquo;-nya memang kejadian 30%.</p>
<p><strong>Kapan dipakai:</strong> Lead scoring, targeting kampanye, prioritas sales/audiens iklan. Selalu cek kalibrasi sebelum dipakai untuk EV.</p>
<details className="worked">
<summary>📐 Contoh: Decile analysis PropertiKu (klik untuk buka)</summary>
<p>100.000 leads diurutkan by skor, dibagi 10 decile @10.000. Conversion aktual per decile: D10 (teratas) 2,0%, D9 1,1%, D8 0,6%, …, D1 0,05%. Rata-rata 0,4%.</p>
<p><strong>Lift D10</strong> = 2,0/0,4 = <strong>5x</strong>. Model bekerja (monotonik turun).</p>
<p><strong>Tapi</strong>: biaya email Rp2.000/orang, margin per pembeli Rp5jt. EV per orang D10 = 0,02 × 5jt − 2rb = <strong>+Rp98rb</strong> (kirim!). D8: 0,006 × 5jt − 2rb = <strong>+Rp28rb</strong> (masih kirim). D5 (0,2%): 0,002 × 5jt − 2rb = <strong>+Rp8rb</strong> (masih tipis positif). D4 (0,1%): −Rp1.500 → <strong>STOP</strong>. Jadi kirim ke ~60.000 teratas, bukan 10.000 (terlalu sedikit!) dan bukan 100.000 (terlalu banyak).</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10], y: [0.05,0.08,0.1,0.12,0.2,0.35,0.6,0.8,1.1,2.0], type: "bar", marker: {color: ["#94a3b8","#94a3b8","#94a3b8","#94a3b8","#e8a838","#e8a838","#e8a838","#2a7de1","#2a7de1","#2a7de1"]}, text: ["0,05%","0,08%","0,1%","0,12%","0,2%","0,35%","0,6%","0,8%","1,1%","2,0%"], textposition: "outside"}]}
  title={"Decile analysis: conversion per decile skor"}
  layout={{xaxis: {title: "Decile (1=skor terendah, 10=tertinggi)"}, yaxis: {title: "Conversion aktual"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = decile skor (10 = 10.000 skor tertinggi), tinggi batang = conversion aktual decile itu.</p>
<p><strong>Interpretasi:</strong> Monotonik naik — model me-ranking dengan benar (lift 5x di D10). Tapi keputusan &lsquo;kirim ke berapa?&rsquo; tidak dijawab chart ini — dijawab EV per decile (lihat worked example). Ranking = model; cutoff = bisnis.</p>
</div>
<PlotlyChart
  data={[{x: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95], y: [0.04,0.13,0.22,0.30,0.38,0.48,0.58,0.70,0.82,0.93], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "model"}, {x: [0,1], y: [0,1], type: "scatter", mode: "lines", line: {dash: "dash", color: "#16a34a"}, name: "ideal"}]}
  title={"Kurva kalibrasi (reliability)"}
  layout={{xaxis: {title: "Rata-rata prediksi per bin"}, yaxis: {title: "Rate aktual"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = prediksi rata-rata tiap bin, Y = kejadian aktual. Garis hijau = kalibrasi sempurna.</p>
<p><strong>Interpretasi:</strong> Titik-titik menempel garis diagonal — model <strong>terkalibrasi baik</strong>: &lsquo;P=0,3&rsquo; memang kejadian ~30%. Model seperti ini boleh dipakai untuk EV. Kalau titik jauh dari diagonal (mis. selalu di atas = overconfident), kalibrasi ulang (Platt/isotonic) sebelum dipakai untuk keputusan uang.</p>
</div>
<h2 id="nba">Next-Best-Action — Dari Skor ke Keputusan</h2>
<p><strong>Definisi.</strong> <strong>Next-best-action (NBA)</strong>: untuk tiap pelanggan, pilih <strong>satu aksi</strong> (dari menu: email, telepon, diskon, undangan, diam saja) yang memaksimalkan expected value — dengan <strong>constraints</strong>: frekuensi kontak maksimal (fatigue), kapasitas tim, biaya channel. Formula: NBA = argmax atas aksi dari [P(respons|aksi,X) × nilai − biaya(aksi)].</p>
<p>Poin penting: <strong>aksi &ldquo;diam saja&rdquo; adalah aksi yang valid</strong> — kadang EV tertinggi adalah tidak menghubungi (menghemat biaya + menghindari unsubscribe). Dan P(respons|aksi) ≠ P(respons): butuh data eksperimen atau uplift (MK11), bukan sekadar propensity observasional.</p>
<Tex math={String.raw`a^* = \arg\max_{a} \left[ P(\text{respons} \mid a, X) \times V - C(a) \right]`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`a^*`} />: aksi terbaik untuk pelanggan ini</li>
<li><Tex math={String.raw`P(\text{respons} \mid a, X)`} />: peluang respons JIKA diberi aksi a — ini kausal, bukan propensity biasa</li>
<li><Tex math={String.raw`V`} />: nilai jika berhasil (margin/CLV)</li>
<li><Tex math={String.raw`C(a)`} />: biaya aksi a (uang + risiko fatigue/unsubscribe)</li>
<li>Constraints: mis. maks 2 kontak/minggu — optimasi dengan batasan</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Propensity = <strong>&lsquo;dia lapar&rsquo;</strong>. NBA = <strong>&lsquo;kasih dia menu apa?&rsquo;</strong> — nasi goreng (murah, kemungkinan dimakan 60%), steak (mahal, 80%), atau biarkan dulu (tidak lapar-lapar amat, ganggu = kesal). Skor lapar saja tidak menjawab menu apa.</p>
<p><strong>Kapan dipakai:</strong> CRM matang: banyak aksi × banyak pelanggan × kapasitas terbatas. Mulai sederhana: 3–5 aksi, EV per aksi, 1 constraint (frekuensi).</p>
<details className="worked">
<summary>📐 Contoh: NBA untuk satu lead (klik untuk buka)</summary>
<p>Lead Andi: P(beli|email)=2%, P(beli|telepon)=8%, P(beli|diam)=0,5%. V=Rp5jt. Biaya: email Rp2rb, telepon Rp50rb.</p>
<p>EV email = 0,02×5jt − 2rb = <strong>Rp98rb</strong>. EV telepon = 0,08×5jt − 50rb = <strong>Rp350rb</strong>. EV diam = 0,005×5jt = Rp25rb.</p>
<p><strong>NBA = telepon</strong> (Rp350rb). Tapi jika kapasitas sales penuh (constraint!), fallback = email. Inilah NBA dengan constraint: bukan sekadar &ldquo;terbaik&rdquo;, tapi &ldquo;terbaik yang feasible&rdquo;.</p>
</details>
<h2 id="lookalike">Lead Scoring & Lookalike — Kembaran Pelanggan Terbaikmu</h2>
<p><strong>Definisi.</strong> <strong>Lead scoring B2B</strong> = propensity + skor fit (kecocokan profil: industri, ukuran perusahaan, jabatan) + skor engagement. <strong>Lookalike audience</strong> = beri platform (Meta/Google/TikTok) <em>seed</em> 1.000–5.000 pelanggan terbaikmu; platform mencari &ldquo;kembaran&rdquo; mereka di populasinya (1–10% mirip). Kamu tidak tahu fiturnya (black box) — yang kamu kontrol: <strong>kualitas seed</strong>.</p>
<p>Aturan seed: <strong>seed = pelanggan terbaik</strong> (CLV tinggi, bukan sekadar &ldquo;pernah beli&rdquo;). Seed 5.000 pembeli diskon = lookalike pemburu diskon. Seed 1.000 Sultan = lookalike Sultan. Kualitas seed = kualitas kembaran.</p>
<p><strong>Kepribadian/intuisi:</strong> Lookalike seperti <strong>&lsquo;carikan saya 1 juta orang yang mirip 1.000 pelanggan terbaik saya&rsquo;</strong>. Kalau 1.000-nya pemburu diskon, dapatnya 1 juta pemburu diskon — modelnya bekerja sempurna, strateginya bunuh diri.</p>
<p><strong>Kapan dipakai:</strong> Prospecting (cari pelanggan baru) saat kamu punya seed berkualitas ≥1.000. Jangan untuk retensi (itu kerjaan CRM).</p>
<details className="worked">
<summary>📐 Contoh: Dua seed, dua nasib (klik untuk buka)</summary>
<p>Brand fashion: Seed A = 2.000 pembeli full-price (CLV Rp3jt). Seed B = 2.000 pembeli diskon 70% (CLV Rp400rb). Lookalike 1% dari keduanya, budget sama.</p>
<p>Hasil 3 bulan: A → CAC Rp450rb, CLV:CAC 6,7. B → CAC Rp180rb (terlihat murah!), CLV:CAC 2,2 — di bawah 3, marginal.</p>
<p><strong>Pelajaran:</strong> CAC murah menipu (lagi!). Seed menentukan segalanya — audit seed sebelum audit kampanye.</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Dari Skor ke Keputusan</h2>
<p>Skor propensity 0,83 terlihat canggih — tapi <strong>tidak ada yang bisa dipegang dari angka 0,83</strong> sampai kamu menjawab tiga hal: (1) apakah 0,83 berarti 83% <em>benar-benar</em> akan membeli (kalibrasi)? (2) di skor berapa kamu <em>bertindak</em> (cutoff)? (3) <em>tindakan apa</em> untuk siapa (NBA)? Tiga pendalaman ini mengubah skor dari hiasan menjadi mesin keputusan.</p>
<h3>1. Kalibrasi — Apakah 0,83 Berarti 83%?</h3>
<p><strong>Definisi.</strong> Model <em>terkalibrasi</em> jika: dari semua orang dengan skor ≈ 0,8, <strong>benar-benar</strong> ~80% yang membeli. Banyak model <strong>diskriminatif tapi tidak terkalibrasi</strong>: ia benar mengurutkan (yang skor tinggi lebih mungkin beli), tapi angkanya meleset (skor 0,8 → aktual 50%).</p>
<p><strong>Kepribadian/intuisi:</strong> Model tak-terkalibrasi seperti <strong>termometer yang konsisten 5 derajat kepanasan</strong>: ia benar bilang &ldquo;hari ini lebih panas dari kemarin&rdquo; (ranking benar), tapi &ldquo;38°C&rdquo;-nya sebenarnya 33°C. Untuk memutuskan &ldquo;pakai jaket atau tidak&rdquo; (cutoff!), kamu butuh <strong>angka yang benar</strong>, bukan sekadar urutan yang benar.</p>
<p><strong>Cara cek: decile table.</strong> Urutkan skor, bagi 10 grup. Per decile: rata-rata skor prediksi vs % aktual. Jika decile 10 (skor rata-rata 0,85) aktualnya 82% → terkalibrasi. Jika aktualnya 55% → <strong>overconfident</strong>, harus dikalibrasi (Platt scaling / isotonic regression).</p>
<p><strong>Kapan dipakai:</strong> Wajib sebelum memakai skor untuk <strong>expected value</strong> (cutoff, NBA). Jika hanya untuk ranking (prioritaskan siapa dihubungi dulu), kalibrasi kurang kritis — tapi tetap cek.</p>
<Tex math={String.raw`EV = p \times m - c`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`p`} /> = propensity <strong>terkalibrasi</strong>; <Tex math={String.raw`m`} /> = margin jika berhasil; <Tex math={String.raw`c`} /> = biaya tindakan. Bertindak jika EV &gt; 0 — yang menuntut <Tex math={String.raw`p`} /> yang jujur.</p>
<details className="worked">
<summary>📐 Contoh 1a: Decile table membongkar model (klik untuk buka)</summary>
<p>Model propensity beli asuransi, 100.000 prospek.</p>
<p><strong>Langkah 1 — Decile 10:</strong> 10.000 orang, skor rata-rata 0,78. Aktual beli: <strong>4.100 (41%)</strong>. → Model <strong>overconfident hampir 2x</strong>!</p>
<p><strong>Langkah 2 — Decile 1:</strong> skor rata-rata 0,02, aktual 1,8% → terkalibrasi di bawah.</p>
<p><strong>Langkah 3 — Dampak keputusan:</strong> cutoff &ldquo;skor &gt; 0,5&rdquo; dengan biaya telepon Rp75rb dan margin Rp2jt: EV per orang = 0,78 × 2jt − 75rb = <strong>Rp1.485.000</strong> (menurut model). Aktual: 0,41 × 2jt − 75rb = <strong>Rp745.000</strong> — masih positif, tapi <strong>setengah</strong> dari klaim. Jika biaya Rp1,5jt (kunjungan): model bilang EV = +Rp60rb (jalan!), aktual = 0,41×2jt − 1,5jt = <strong>−Rp680rb</strong> (rugi!).</p>
<p><strong>Langkah 4 — Perbaikan:</strong> kalibrasi isotonic → skor 0,78 menjadi 0,43. Cutoff dihitung ulang. <strong>Pelajaran:</strong> model yang &ldquo;akurat&rdquo; (AUC 0,82!) hampir menyebabkan keputusan rugi Rp680rb/orang — karena AUC mengukur <strong>ranking</strong>, bukan <strong>angka</strong>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Kalibrasi sederhana manual (klik untuk buka)</summary>
<p>Tidak punya library kalibrasi? Cara kasar tapi jujur:</p>
<p><strong>Langkah 1:</strong> buat decile table seperti di atas (butuh data validasi dengan label aktual).</p>
<p><strong>Langkah 2:</strong> untuk tiap decile, ganti skor prediksi dengan <strong>% aktual decile itu</strong>. Skor 0,78 (decile 10) → pakai 0,41.</p>
<p><strong>Langkah 3:</strong> ini = <strong>isotonic regression versi manual</strong> — monoton, terkalibrasi di data validasi.</p>
<p><strong>Batasan:</strong> butuh cukup data per decile (n &gt; 500); tidak mulus antar-decile. Tapi <strong>jauh lebih baik</strong> dari skor mentah yang overconfident. Kejujuran kasar &gt; presisi palsu.</p>
</details>
<h3>2. Cutoff Berbasis Expected Value — Bukan 0,5</h3>
<p><strong>Definisi.</strong> <em>Cutoff</em> = skor minimum untuk bertindak. Cutoff 0,5 (default) = <strong>asumsi biaya false positive = biaya false negative</strong> — yang hampir tidak pernah benar di marketing.</p>
<p><strong>Kepribadian/intuisi:</strong> Cutoff 0,5 seperti <strong>menyetel alarm kebakaran berbunyi hanya jika 50% yakin ada api</strong> — padahal biaya false alarm (bangun tidur) jauh lebih kecil dari biaya kebakaran (rumah hangus). Cutoff yang benar = <strong>titik impas ekonomi</strong>: p* = c/m. Jika biaya email Rp500 dan margin Rp500rb → p* = 0,001 — <strong>kirim ke hampir semua orang</strong>! Jika biaya kunjungan Rp1,5jt → p* = 0,75 — hanya yang sangat yakin.</p>
<p><strong>Kapan dipakai:</strong> Setiap kampanye dengan biaya &gt; 0. Cutoff berbeda <strong>per channel</strong> (biaya beda!) — satu model, banyak cutoff.</p>
<Tex math={String.raw`p^* = \frac{c}{m} \quad;\quad \text{bertindak jika } p > p^*`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`p^*`} /> = cutoff optimal; <Tex math={String.raw`c`} /> = biaya tindakan per orang; <Tex math={String.raw`m`} /> = margin jika berhasil. Rumus ini mengasumsikan <strong>tidak ada efek samping</strong> (lihat sleeping dogs di bawah!).</p>
<details className="worked">
<summary>📐 Contoh 2a: Satu model, tiga cutoff (klik untuk buka)</summary>
<p>Model propensity terkalibrasi, margin Rp1jt.</p>
<p><strong>Channel email</strong> (c=Rp1rb): p* = 1rb/1jt = <strong>0,001</strong> → kirim ke 95% base. <strong>Channel telepon</strong> (c=Rp50rb): p* = <strong>0,05</strong> → hubungi 30% teratas. <strong>Channel kunjungan</strong> (c=Rp500rb): p* = <strong>0,5</strong> → kunjungi 5% teratas.</p>
<p><strong>Pelajaran:</strong> &ldquo;cutoff model&rdquo; tidak ada — yang ada <strong>cutoff per channel</strong>. Tim yang memakai satu cutoff 0,5 untuk semua channel = membuang uang di email (terlalu sedikit dikirim) dan membakar uang di kunjungan (terlalu banyak dikunjungi).</p>
</details>
<details className="worked">
<summary>📐 Contoh 2b: Cutoff dengan kapasitas terbatas (klik untuk buka)</summary>
<p>Tim telesales hanya bisa menelepon <strong>1.000 orang/hari</strong> dari 100.000 prospek. p* ekonomis = 0,05 → 30.000 orang lolos — tapi kapasitas cuma 1.000!</p>
<p><strong>Langkah 1:</strong> urutkan by skor, ambil <strong>1.000 teratas</strong> (bukan semua di atas p*).</p>
<p><strong>Langkah 2:</strong> cutoff efektif = skor orang ke-1.000 ≈ <strong>0,62</strong> — jauh di atas p* 0,05.</p>
<p><strong>Langkah 3 — Insight:</strong> dengan kapasitas terbatas, yang relevan bukan &ldquo;EV positif&rdquo; tapi <strong>&ldquo;EV tertinggi&rdquo;</strong>. Ini = <strong>knapsack problem</strong> versi sederhana: isi kapasitas dengan EV terbesar dulu.</p>
<p><strong>Pelajaran:</strong> dua rezim cutoff: <strong>rezim biaya</strong> (p* = c/m, kapasitas tak terbatas) vs <strong>rezim kapasitas</strong> (ambil top-N). Kenali rezimmu — salah rezim = salah target.</p>
</details>
<h3>3. Next-Best-Action — Dari &ldquo;Siapa&rdquo; ke &ldquo;Apa&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Next-best-action</em> (NBA): untuk tiap individu, pilih <strong>tindakan</strong> (bukan sekadar ya/tidak) yang memaksimalkan expected value: diam, email, telepon, voucher, kunjungan.</p>
<p><strong>Kepribadian/intuisi:</strong> Propensity menjawab &ldquo;<strong>siapa</strong> yang lapar&rdquo;; NBA menjawab &ldquo;<strong>kasih makan apa</strong>&rdquo;. Memberi steak ke bayi (kunjungan ke prospek Rp50rb) = bahaya; memberi bubur ke atlet (email ke prospek Rp50jt) = sia-sia. <strong>Skor tanpa aksi = diagnosis tanpa resep.</strong></p>
<p><strong>Matriks keputusan:</strong> untuk tiap orang i dan aksi a: EV(i,a) = p(i,a) × m − c(a). Catatan: p <strong>tergantung aksi</strong>! p(beli | dikunjungi) ≠ p(beli | diemail) — inilah <strong>uplift</strong> (MK11). NBA sederhana memakai p yang sama (asumsi), NBA advanced memakai uplift per aksi.</p>
<p><strong>Kapan dipakai:</strong> Setiap ada &gt; 1 jenis tindakan dengan biaya berbeda. Mulai dari aturan (matriks), naik ke model saat data cukup.</p>
<details className="worked">
<summary>📐 Contoh 3: Matriks NBA 3×3 (klik untuk buka)</summary>
<p>Margin Rp2jt. Tiga aksi: email (c=2rb), telepon (c=60rb), kunjungan (c=600rb). Tiga prospek (p = propensity beli <strong>tanpa</strong> intervensi; asumsikan intervensi menaikkan p 20% relatif):</p>
<p><strong>Prospek A (p=0,7):</strong> EV email = 0,7×1,2×2jt − 2rb = Rp1.678.000. EV telepon = 0,7×1,2×2jt − 60rb = Rp1.620.000. EV kunjungan = 0,7×1,2×2jt − 600rb = Rp1.080.000. → <strong>Email menang</strong> (dia beli sendiri; jangan bakar biaya!).</p>
<p><strong>Prospek B (p=0,15):</strong> EV email = 0,15×1,2×2jt − 2rb = Rp358.000. EV telepon = 358rb − 58rb = Rp300.000. → <strong>Email</strong> (telepon tidak cukup menaikkan untuk menutup biayanya).</p>
<p><strong>Prospek C (p=0,4, tapi responsif telepon — uplift 2x):</strong> EV email = 0,4×1,2×2jt − 2rb = Rp958.000. EV telepon = 0,4×2×2jt − 60rb = <strong>Rp1.540.000</strong> → <strong>Telepon menang!</strong></p>
<p><strong>Pelajaran:</strong> (a) prospek terpanas (A) justru <strong>tidak butuh</strong> aksi mahal — hemat biaya untuk yang di tengah; (b) tanpa info uplift (C), kamu tidak akan pernah memilih telepon — <strong>NBA tanpa uplift = setengah buta</strong> (MK11!).</p>
</details>
<PlotlyChart
  data={[{x: ["Email\n(c=Rp1rb)", "Telepon\n(c=Rp50rb)", "Kunjungan\n(c=Rp500rb)"], y: [0.001, 0.05, 0.5], type: "bar", marker: {color: ["#2a7de1","#e8a838","#ef4444"]}, text: ["p*=0,001","p*=0,05","p*=0,5"], textposition: "outside"}]}
  title={"Cutoff optimal per channel (margin Rp1jt)"}
  layout={{yaxis: {title: "Cutoff p* (skala log)", type: "log"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang (skala log) = cutoff optimal per channel. Makin mahal channel, makin tinggi cutoff.</p>
<p><strong>Interpretasi:</strong> Cutoff email (0,001) vs kunjungan (0,5) = <strong>500x lipat bedanya</strong>. Satu cutoff 0,5 untuk semua = email hanya dikirim ke 5% teratas (buang 90% peluang murah!) dan kunjungan ke semua di atas 0,5 (bakar biaya). Visual ini = alasan &ldquo;cutoff per channel&rdquo;.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Skor propensity tinggi = harus dihubungi. Makin tinggi skor, makin wajib.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Skor menjawab &lsquo;siapa paling mungkin&rsquo;, bukan &lsquo;siapa menguntungkan dihubungi&rsquo;. Kasus PropertiKu: 8.000 dari 10.000 &lsquo;skor tertinggi&rsquo; ternyata EV-negatif (biaya &gt; expected revenue). Keputusan = <strong>EV &gt; 0</strong>, bukan &lsquo;skor &gt; X&rsquo;. Skor tanpa biaya = setengah keputusan.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Propensity tinggi berarti aksi kita yang menyebabkan mereka beli (kausal).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Propensity observasional = <strong>korelasi</strong>: orang berskor tinggi mungkin memang akan beli <em>tanpa</em> dihubungi (<em>sure things</em>). Menghubungi mereka = buang biaya + mengklaim kredit palsu. Efek kausal aksi diukur dengan <strong>uplift modeling</strong> (MK11) — propensity tidak menjawab &lsquo;apakah emailku yang membuat dia beli?&rsquo;</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Kalibrasi sebelum EV.</strong> Ranking bagus (AUC 0,85) tapi kalibrasi jelek = EV ngawur. Selalu plot reliability curve. Model yang &lsquo;P=0,5&rsquo; tapi aktualnya 0,2 akan membuatmu menghubungi 2,5x lebih banyak orang dari yang menguntungkan.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Seed lookalike = cermin strategimu.</strong> Audit seed tiap kuartal: masih berisi pelanggan terbaik (CLV), atau sudah terkontaminasi pemburu promo? Satu seed buruk = satu kuartal budget terbakar untuk &lsquo;kembaran&rsquo; yang salah.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Propensity Decile + Cutoff EV</h2>
<p>Bangun skor sederhana, buat decile analysis, lalu tentukan cutoff pengiriman berbasis EV — bukan 'top 10.000'.</p>
<PyodideLab
  title={"Lab 1 — Decile & Cutoff EV"}
  hint={"Ubah BIAYA 2000 → 10000. Cutoff bergeser naik — makin mahal aksi, makin sedikit yang layak dihubungi."}
  defaultCode={"import random\nrandom.seed(11)\n# 5000 leads: skor + konversi aktual (skor tinggi -> peluang lebih besar)\nleads = []\nfor _ in range(5000):\n    skor = random.random()\n    p = 0.005 + 0.06 * skor ** 2   # hubungan monotonik\n    leads.append((skor, 1 if random.random() < p else 0))\nleads.sort(reverse=True)\n\nBIAYA, NILAI = 2000, 5_000_000\nprint(f\"{'decile':>7} {'konv':>7} {'EV/orang (Rp rb)':>16}  keputusan\")\nfor d in range(10):\n    grup = leads[d*500:(d+1)*500]\n    konv = sum(y for _, y in grup) / len(grup)\n    ev = konv * NILAI - BIAYA\n    print(f\"{d+1:>7} {konv:>6.2%} {ev/1000:>15.0f}  {'KIRIM' if ev > 0 else 'STOP'}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Pilih Next-Best-Action</h2>
<p>Untuk tiap pelanggan, hitung EV tiap aksi (dengan constraint kapasitas) dan pilih NBA-nya.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator NBA"}
  hint={"Ubah KAPASITAS_TELEPON 2 → 0. Lihat NBA berubah ke email — constraint mengubah keputusan, bukan cuma skor."}
  defaultCode={"# NBA: pilih aksi terbaik per pelanggan (dengan constraint kapasitas)\npelanggan = [\n    (\"Andi\", 0.02, 0.08, 0.005),\n    (\"Budi\", 0.05, 0.06, 0.040),\n    (\"Cici\", 0.01, 0.02, 0.008),\n    (\"Dodi\", 0.03, 0.20, 0.002),\n]\nNILAI = 5_000_000\nBIAYA = {\"email\": 2_000, \"telepon\": 50_000, \"diam\": 0}\nKAPASITAS_TELEPON = 2  # ubah sesukamu\nprob = {\"email\": 0, \"telepon\": 1, \"diam\": 2}\n\nantre = []\nfor nama, pe, pt, pd in pelanggan:\n    ev = {\"email\": pe*NILAI-BIAYA[\"email\"], \"telepon\": pt*NILAI-BIAYA[\"telepon\"], \"diam\": pd*NILAI}\n    antre.append((nama, ev))\n# alokasikan telepon ke EV telepon tertinggi dulu\nantre.sort(key=lambda x: x[1][\"telepon\"], reverse=True)\njatah = set(n for n, _ in antre[:KAPASITAS_TELEPON])\n\nfor nama, ev in antre:\n    pilihan = sorted(ev, key=lambda a: ev[a] if (a != \"telepon\" or nama in jatah) else -1, reverse=True)\n    nba = pilihan[0]\n    print(f\"{nama:<6} NBA={nba:<8} (EV Rp{ev[nba]/1000:,.0f} rb)\" +\n          (\" [telepon habis -> fallback]\" if nba != \"telepon\" and ev[\"telepon\"] > ev[nba] else \"\"))\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh urutan prioritas (siapa duluan) → <strong>Propensity ranking (AUC/decile)</strong></h3>
<p><strong>Kenapa:</strong> Ranking cukup untuk alokasi kapasitas terbatas.</p>
<p><strong>Contoh nyata:</strong> Sales hubungi 100 skor teratas tiap minggu.</p>
</div>
<div className="decision-card">
<h3>2. Butuh keputusan kirim/tidak + budget → <strong>Propensity terkalibrasi + EV cutoff</strong></h3>
<p><strong>Kenapa:</strong> Tanpa kalibrasi & biaya, cutoff = tebak-tebakan.</p>
<p><strong>Contoh nyata:</strong> Email hanya ke decile dengan EV &gt; 0.</p>
</div>
<div className="decision-card">
<h3>3. Banyak aksi × banyak pelanggan × kapasitas terbatas → <strong>Next-best-action</strong></h3>
<p><strong>Kenapa:</strong> Satu skor tidak menjawab 'aksi apa'. NBA mengoptimasi aksi + constraint.</p>
<p><strong>Contoh nyata:</strong> CRM omnichannel: email/telepon/diam per pelanggan.</p>
</div>
<div className="decision-card">
<h3>4. Cari pelanggan BARU yang mirip terbaik → <strong>Lookalike (seed = CLV tertinggi)</strong></h3>
<p><strong>Kenapa:</strong> Prospecting efisien; kualitas seed menentukan.</p>
<p><strong>Contoh nyata:</strong> Seed 2.000 full-price buyers → lookalike 1%.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Skor = ranking.</strong> Keputusan = EV.</li><li><strong>Kalibrasi dulu</strong> sebelum EV.</li><li><strong>&lsquo;Diam&rsquo; adalah aksi valid.</strong></li><li><strong>Seed lookalike = pelanggan terbaik</strong>, bukan terbanyak.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: 100.000 Email yang 90%-nya Seharusnya Tidak Dikirim</h3>
<p>Asuransi &ldquo;AmanJiwa&rdquo; mengirim email penawaran ke <strong>100.000</strong> nasabah tiap bulan (cutoff: tidak ada — &ldquo;kirim semua, kan murah&rdquo;). Open rate 3%, unsubscribe 0,8%/bulan — <strong>daftar email menyusut 9%/tahun</strong> karena kelelahan.</p>
<p>Analisis: dengan p* = 0,001, yang layak dikirimi = 40.000 (bukan 100.000). 60.000 sisanya: EV negatif <strong>bukan karena biaya email</strong> (murah!) tapi karena <strong>biaya kelelahan</strong>: tiap email ke orang yang tidak tertarik menaikkan P(unsubscribe) — dan unsubscribe = <strong>kehilangan channel selamanya</strong> (biaya tak terlihat!).</p>
<p>Setelah cutoff + frekuensi cap: email turun 60%, revenue dari email <strong>naik 15%</strong> (yang dikirimi = yang relevan), unsubscribe turun 70%. <strong>Pelajaran:</strong> &ldquo;murah&rdquo; ≠ &ldquo;gratis&rdquo;. Setiap tindakan punya <strong>biaya perhatian</strong> — dan perhatian adalah sumber daya yang paling langka.</p>
<h3>Kisah 2: Lookalike yang Menemukan &ldquo;Kembaran&rdquo; yang Salah</h3>
<p>Fashion &ldquo;ModaKita&rdquo; memakai lookalike: &ldquo;cari orang mirip pembeli kami&rdquo;. Hasil: CPA naik 3x. Audit: &ldquo;mirip&rdquo; didefinisikan dari <strong>demografi</strong> (usia, kota, gender) — dan pembeli mereka kebetulan 80% perempuan 25–34 Jakarta. Lookalike menemukan <strong>semua perempuan 25–34 Jakarta</strong> — termasuk yang tidak pernah belanja fashion online.</p>
<p>Perbaikan: seed = <strong>pembeli bernilai tinggi</strong> (top 20% CLV, bukan semua pembeli!), fitur = <strong>perilaku</strong> (kategori dilihat, frekuensi kunjungi situs fashion) bukan demografi. CPA turun 40% di bawah baseline.</p>
<p><strong>Pelajaran:</strong> lookalike sebagus <strong>seed</strong>-nya. Seed &ldquo;semua pembeli&rdquo; = rata-rata = tidak ada. Seed &ldquo;pembeli terbaik&rdquo; + fitur perilaku = kembaran yang benar-benar kembar. <strong>Kualitas seed &gt; ukuran seed.</strong></p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Model propensity yang bagus = kampanye yang bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Rantai nilai: model → <strong>kalibrasi</strong> → <strong>cutoff</strong> → <strong>aksi (NBA)</strong> → <strong>eksekusi</strong>. Model hanya mata rantai pertama. Rantai putus di <strong>mana saja</strong> = kampanye gagal. Kegagalan paling umum bukan di model — tapi di <strong>cutoff asal</strong> (0,5!) dan <strong>aksi seragam</strong> (semua ditelepon!).</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 10.000 Email yang Kebanyakan</h2>
<div className="callout">
<p>PropertiKu: 100.000 leads, model propensity (D10 konversi 2%, rata-rata 0,4%). Tim kirim ke 10.000 teratas → 200 pembeli. Biaya email Rp2.000, margin Rp5jt/pembeli. Direksi: &ldquo;model tidak bekerja&rdquo;.</p>
<p><strong>Pertanyaan:</strong> (a) Apakah model bekerja? Buktikan. (b) Berapa cutoff pengiriman yang benar secara EV? (c) Satu usulan next-best-action selain 'kirim email'?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Bekerja.</strong> Lift D10 = 2%/0,4% = 5x, monotonik turun per decile. Model me-ranking dengan benar — yang salah keputusannya, bukan modelnya.</p>
<p>(b) EV/orang per decile: D10 +Rp98rb, D9 +Rp53rb, D8 +Rp28rb, D7 +Rp15,5rb, D6 +Rp8rb, D5 +Rp8rb, D4 −Rp1.500 → <strong>kirim ke ~60.000 teratas (D5–D10)</strong>, bukan 10.000. Ironisnya tim <em>kurang</em> agresif — 50.000 EV-positif tidak dikirimi!</p>
<p>(c) <strong>Undangan survei lokasi</strong> untuk D8–D10 (P datang 15%, biaya Rp100rb, EV = 0,15×5jt−100rb = +Rp650rb — jauh di atas email), dan <strong>diam</strong> untuk D1–D4.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Cutoff.</strong> Margin Rp800rb. Biaya: SMS Rp200, telepon Rp40rb. (a) p* tiap channel. (b) Prospek p=0,03 — aksi apa? (c) Jika ada biaya &ldquo;kelelahan&rdquo; tak terlihat Rp5rb per SMS, p* baru?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>(a) SMS: 200/800rb = <strong>0,00025</strong>. Telepon: 40rb/800rb = <strong>0,05</strong>.</p>
<p>(b) p=0,03 &gt; 0,00025 → <strong>SMS ya</strong>; 0,03 &lt; 0,05 → <strong>telepon tidak</strong>.</p>
<p>(c) p* = 5.200/800rb = <strong>0,0065</strong> — naik 26x! Prospek p=0,03 masih lolos (0,03 &gt; 0,0065), tapi yang p=0,001 tidak lagi. <strong>Pelajaran:</strong> biaya tak terlihat (kelelahan, unsubscribe) sering <strong>lebih besar</strong> dari biaya langsung — dan mengubah keputusan.</p>
</details>
<p><strong>Soal 2 — Kalibrasi.</strong> Decile 9: skor rata-rata 0,65, aktual 38%. Decile 10: 0,88, aktual 61%. (a) Terkoreksi? (b) Kampanye kunjungan (c=Rp300rb, m=Rp1jt): dengan skor mentah vs terkoreksi untuk prospek decile 10?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>(a) <strong>Overconfident</strong> di keduanya (0,65→0,38; 0,88→0,61). Pakai angka aktual.</p>
<p>(b) Skor mentah: EV = 0,88 × 1jt − 300rb = <strong>+Rp580rb</strong> → kunjungi! Terkoreksi: 0,61 × 1jt − 300rb = <strong>+Rp310rb</strong> → tetap kunjungi, tapi <strong>ekspektasi turun hampir setengah</strong>. Jika c=Rp700rb: mentah bilang +Rp180rb (jalan), koreksi bilang −Rp90rb (<strong>jangan</strong>). Kalibrasi = beda antara untung dan rugi.</p>
</details>
<p><strong>Soal 3 — NBA.</strong> m=Rp3jt. Aksi: email (c=5rb, lift 1,1x), telepon (c=100rb, lift 1,5x). Prospek p=0,5. Hitung EV keduanya. Aksi mana? Kapan telepon menang?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>Email: 0,5×1,1×3jt − 5rb = 1.650.000 − 5.000 = <strong>Rp1.645.000</strong>. Telepon: 0,5×1,5×3jt − 100rb = 2.250.000 − 100.000 = <strong>Rp2.150.000</strong> → <strong>telepon menang</strong>.</p>
<p>Telepon menang jika: 0,5×L×3jt − 100rb &gt; 0,5×1,1×3jt − 5rb → 1,5jt×L &gt; 1.745.000 → L &gt; <strong>1,163</strong>. Jadi telepon butuh lift minimal 16% untuk membenarkan biayanya. <strong>NBA = perbandingan lift vs biaya, bukan sekadar &ldquo;yang termahal pasti terbaik&rdquo;.</strong></p>
</details>
<p><strong>Soal 4 — Rezim kapasitas.</strong> 50.000 prospek, tim 500 kunjungan/minggu. Distribusi: 2.000 orang p&gt;0,5; 8.000 orang p 0,2–0,5; sisanya &lt;0,2. p* ekonomis = 0,3. Siapa dikunjungi minggu ini?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>p* = 0,3 → 10.000 lolos (2.000 + 8.000). Kapasitas 500 &lt;&lt; 10.000 → <strong>rezim kapasitas</strong>.</p>
<p><strong>Kunjungi 500 dengan p tertinggi</strong> (semua dari kelompok p&gt;0,5). Cutoff efektif ≈ skor orang ke-500 (mungkin ~0,75).</p>
<p><strong>Jebakan:</strong> &ldquo;kunjungi semua di atas p*&rdquo; = mustahil (10.000 &gt; 500). &ldquo;Kunjungi acak 500 dari yang lolos&rdquo; = buang EV. <strong>Top-N by EV = satu-satunya jawaban benar di rezim kapasitas.</strong></p>
</details>
<div className="tip">
<p><strong>💡 Empat langkah wajib sebelum kampanye propensity: (1) cek kalibrasi (decile table); (2) hitung p* per channel; (3) kenali rezim (biaya vs kapasitas); (4) petakan NBA (aksi per individu). Empat langkah = beda antara &ldquo;model bagus&rdquo; dan &ldquo;kampanye untung&rdquo;.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Model AUC 0,85 tapi kurva kalibrasi jauh dari diagonal. Boleh dipakai untuk hitung EV cutoff?"}
  options={
    ["Boleh — AUC tinggi cukup",
    "Tidak — kalibrasi dulu (Platt/isotonic), EV butuh probabilitas jujur",
    "Boleh jika datanya besar",
    "Tidak boleh dipakai sama sekali"]
  }
  correct={1}
  explanation={"Benar: AUC = ranking, kalibrasi = kejujuran angka. EV = p×V − C memakai p sebagai angka — p yang ngawur → cutoff ngawur. Kalibrasi ulang dulu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Propensity beli 30% untuk Andi. Artinya?"}
  options={
    ["Email pasti membuatnya beli 30%",
    "Dari 100 orang seperti Andi, ~30 akan beli (tanpa tahu efek email)",
    "Andi 30% lebih baik",
    "Tidak ada artinya"]
  }
  correct={1}
  explanation={"Benar: propensity = peluang observasional, bukan efek kausal email. Andi mungkin 'sure thing' (beli tanpa email). Efek email diukur via uplift (MK11)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. EV email +Rp98rb, EV telepon +Rp350rb, tapi kapasitas telepon habis. NBA?"}
  options={
    ["Telepon — EV tertinggi",
    "Email (fallback feasible terbaik)",
    "Diam saja",
    "Tunggu kapasitas"]
  }
  correct={1}
  explanation={"Benar: NBA = terbaik yang feasible. Telepon tidak feasible (constraint) → email. 'Diam' hanya jika semua EV negatif."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Seed lookalike terbaik adalah…"}
  options={
    ["Semua pembeli (makin banyak makin baik)",
    "1.000–5.000 pelanggan CLV tertinggi",
    "Semua visitor",
    "Pembeli diskon terbesar"]
  }
  correct={1}
  explanation={"Benar: kualitas &gt; kuantitas. Seed pemburu diskon = kembaran pemburu diskon (CAC murah menipu, CLV jeblok)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Decile D10 konversi 2%, rata-rata 0,4%. Lift?"}
  options={
    ["2%",
    "5x",
    "1,6 poin",
    "Tidak bisa dihitung"]
  }
  correct={1}
  explanation={"Benar: lift = 2,0/0,4 = 5x. Lift mengukur 'seberapa lebih baik dari acak' — bahasa yang dimengerti stakeholder untuk menilai model ranking."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Dari 100.000 Email ke Mesin NBA</h2>
<p>Bank &ldquo;Danarta&rdquo;: 100.000 nasabah tabungan, produk baru <strong>deposito online</strong> (margin Rp1,5jt per pembuka). Tim marketing biasa: blast email ke semua. Kamu diminta membangun <strong>mesin NBA</strong> dalam 8 minggu.</p>
<h3>Langkah 1 — Model + kalibrasi (minggu 1–3)</h3>
<p>Model gradient boosting dari fitur: saldo rata-rata, frekuensi transaksi, usia rekening, pernah buka deposito (target). AUC 0,84 — bagus. <strong>Decile table:</strong> decile 10 skor 0,72 → aktual <strong>44%</strong>. Overconfident! Kalibrasi isotonic → skor dikoreksi. <strong>Tanpa langkah ini</strong>, semua EV berikutnya salah 60%.</p>
<h3>Langkah 2 — Petakan aksi &amp; biaya (minggu 4)</h3>
<p>Tiga aksi: email (Rp3rb, lift 1,15x), telepon CS (Rp45rb, lift 1,8x), kunjungan RM (Rp400rb, lift 2,5x). Plus opsi keempat: <strong>diam</strong> (untuk yang akan buka sendiri — jangan ganggu!).</p>
<h3>Langkah 3 — Hitung EV per orang per aksi (minggu 5)</h3>
<p>Contoh tiga nasabah (p = propensity <strong>terkalibrasi</strong>):</p>
<p><strong>Nasabah S (p=0,65, saldo Rp500jt):</strong> EV diam = 0,65 × 1,5jt = Rp975rb. EV email = 0,65×1,15×1,5jt − 3rb = Rp1.118.250. EV telepon = 0,65×1,8×1,5jt − 45rb = Rp1.710.000. EV kunjungan = 0,65×2,5×1,5jt − 400rb = Rp2.037.500 → <strong>kunjungan menang</strong> (margin besar menutup biaya!).</p>
<p><strong>Nasabah T (p=0,65, saldo Rp20jt, margin sama):</strong> angka sama persis → kunjungan menang juga? <strong>Tunggu</strong> — RM hanya 20 orang, kapasitas 200 kunjungan/minggu. Dari 15.000 yang &ldquo;menang kunjungan&rdquo;, ambil <strong>200 EV tertinggi</strong> (rezim kapasitas!).</p>
<p><strong>Nasabah U (p=0,08):</strong> EV email = 0,08×1,15×1,5jt − 3rb = Rp135.000 &gt; 0 → <strong>email</strong>. EV telepon = 0,08×1,8×1,5jt − 45rb = Rp171.000 → telepon menang?! <strong>Cek ulang:</strong> 216.000 − 45.000 = Rp171.000 &gt; Rp135.000 — ya, telepon menang <strong>secara EV</strong>. Tapi kapasitas telepon 2.000/minggu vs 30.000 yang lolos → <strong>top-2.000 by EV</strong>.</p>
<h3>Langkah 4 — Jalankan sebagai eksperimen (minggu 6–8)</h3>
<p>50% nasabah → NBA; 50% → kontrol (blast email seperti biasa). Hasil 2 bulan: konversi NBA <strong>9,2%</strong> vs kontrol 3,1%; biaya per pembuka turun <strong>55%</strong>. <strong>Yang paling mengejutkan:</strong> 12% nasabah masuk kategori &ldquo;diam&rdquo; — dan mereka membuka deposito <strong>sendiri</strong> 7% (tanpa biaya!). Blast lama justru <strong>mengganggu</strong> sebagian dari mereka (unsubscribe).</p>
<h3>Langkah 5 — Institucionalisasi</h3>
<p>Matriks NBA dihitung ulang <strong>bulanan</strong> (skor + biaya bisa berubah). Dashboard: % tiap aksi, EV terealisasi vs prediksi (kalibrasi <strong>berkelanjutan</strong>). Aturan: jika realisasi menyimpang &gt; 20% dari prediksi 2 bulan berturut-turut → <strong>rekalibrasi</strong>.</p>
<div className="callout">
<p><strong>What:</strong> NBA 4 aksi (diam/email/telepon/kunjungan) mengalahkan blast: konversi 3,1% → 9,2%, biaya/pembuka −55%.</p>
<p><strong>So what:</strong> Kemenangan bukan dari &ldquo;model canggih&rdquo; (AUC 0,84 biasa saja) tapi dari <strong>rantai keputusan lengkap</strong>: kalibrasi → EV → kapasitas → eksperimen.</p>
<p><strong>Now what:</strong> (1) Perluas ke produk KPR &amp; kartu kredit. (2) Tambah aksi ke-5: WhatsApp (biaya di antara email-telepon). (3) Uji uplift per aksi (MK11) — lift 1,8x telepon masih asumsi!</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Propensity</h2>
<h3>Jebakan 1: Skor dipakai mentah untuk EV</h3>
<p>Sudah dibahas tuntas — tapi layak jadi jebakan #1 karena paling umum: <strong>AUC tinggi ≠ terkalibrasi</strong>. <strong>Deteksi:</strong> decile table sebelum <strong>setiap</strong> pemakaian EV. Tidak ada pengecualian.</p>
<h3>Jebakan 2: Cutoff 0,5 warisan</h3>
<p>Default library = 0,5. Untuk email (p*=0,001) ini membuang <strong>95% peluang</strong>; untuk kunjungan (p*=0,5) kebetulan benar — <strong>kebetulan bukan metode</strong>. <strong>Deteksi:</strong> cari angka 0,5 di kode kampanye. Ketemu = audit.</p>
<h3>Jebakan 3: Mengabaikan &ldquo;diam&rdquo; sebagai aksi</h3>
<p>NBA tanpa opsi &ldquo;diam&rdquo; = <strong>semua orang harus diapa-apakan</strong>. Padahal yang akan beli sendiri (p tinggi) <strong>rugi</strong> jika diganggu (biaya + risiko unsubscribe). <strong>Deteksi:</strong> jika matriks NBA-mu tidak punya kolom &ldquo;diam&rdquo;, tambahkan sekarang.</p>
<h3>Jebakan 4: Lift dianggap sama untuk semua</h3>
<p>&ldquo;Telepon menaikkan konversi 1,8x&rdquo; — rata-rata. Kenyataannya: untuk yang p=0,9 lift ≈ 1,05x (mereka beli sendiri); untuk p=0,2 lift ≈ 2,5x. <strong>Lift heterogen</strong> = inti uplift modeling (MK11). <strong>Deteksi:</strong> ukur lift <strong>per decile</strong>, bukan rata-rata.</p>
<h3>Jebakan 5: Model tidak pernah direkalibrasi</h3>
<p>Perilaku bergeser (pandemi, kompetitor, musim) — kalibrasi 6 bulan lalu = <strong>basi</strong>. <strong>Deteksi:</strong> plot prediksi vs aktual per bulan. Menyimpang tren = rekalibrasi. Jadwal: <strong>bulanan</strong>, otomatis.</p>
<h3>Jebakan 6: Lookalike seed &ldquo;semua pembeli&rdquo;</h3>
<p>Sudah dibahas di Kisah 2 — seed harus <strong>pembeli terbaik</strong> (top CLV), fitur <strong>perilaku</strong>. <strong>Deteksi:</strong> tanya &ldquo;seed-nya siapa tepatnya?&rdquo; Jawaban &ldquo;semua customer&rdquo; = red flag.</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam baris checklist pre-launch kampanye: kalibrasi ✓, cutoff per channel ✓, opsi diam ✓, lift per decile ✓, jadwal rekalibrasi ✓, seed berkualitas ✓. Enam centang = kampanye siap jalan.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Matriks NBA 1 Halaman</h2>
<p>Template operasional mingguan untuk tim kampanye.</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Segmen (by p)</th><th>Diam</th><th>Email (Rp3rb)</th><th>Telepon (Rp45rb)</th><th>Kunjungan (Rp400rb)</th><th>AKSI</th></tr></thead>
<tbody>
<tr><td>p &gt; 0,7 (panas)</td><td>EV tertinggi</td><td>−biaya sia-sia</td><td>−biaya sia-sia</td><td>−biaya sia-sia</td><td><strong>DIAM</strong> (atau email ringan)</td></tr>
<tr><td>p 0,3–0,7</td><td>rendah</td><td>sedang</td><td><strong>tertinggi*</strong></td><td>tinggi tapi mahal</td><td><strong>TELEPON</strong> (top by EV, kapasitas!)</td></tr>
<tr><td>p 0,05–0,3</td><td>rendah</td><td><strong>tertinggi</strong></td><td>negatif</td><td>negatif</td><td><strong>EMAIL</strong></td></tr>
<tr><td>p &lt; 0,05</td><td><strong>tertinggi (0)</strong></td><td>negatif + fatigue</td><td>negatif</td><td>negatif</td><td><strong>DIAM</strong></td></tr>
</tbody>
</table>
</div>
<p><strong>Cara membaca:</strong> baris = segmen propensity, kolom = EV tiap aksi. Kolom AKSI = pemenang. Tanda * = perhatikan <strong>kapasitas</strong> (tidak semua yang menang bisa dieksekusi).</p>
<p><strong>Aturan update:</strong> hitung ulang tiap bulan (skor berubah, biaya berubah). Jika &ldquo;panas&rdquo; makin besar → produk sudah menjual dirinya sendiri → <strong>alihkan budget ke akuisisi</strong> (MK1!). Matriks ini bukan sekadar alat kampanye — ia <strong>cermin kesehatan produk</strong>.</p>
<details className="worked">
<summary>📐 Contoh: Mengisi matriks untuk bisnismu (klik untuk buka)</summary>
<p><strong>Langkah 1:</strong> list aksi + biaya riil (termasuk biaya tak terlihat: fatigue Rp5rb/email).</p>
<p><strong>Langkah 2:</strong> estimasi lift per aksi (mulai dari asumsi konservatif: email 1,1x, telepon 1,5x — lalu <strong>ukur</strong> dengan eksperimen).</p>
<p><strong>Langkah 3:</strong> bagi base jadi 4 kuartil propensity, hitung EV tiap sel.</p>
<p><strong>Langkah 4:</strong> tentukan kapasitas tiap channel → alokasi top-EV.</p>
<p><strong>Langkah 5:</strong> sisakan 10% sebagai <strong>kontrol diam</strong> — untuk mengukur lift <strong>sebenarnya</strong> (tanpa ini, kamu tidak tahu apakah NBA-mu bekerja!).</p>
</details>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Propensity vs uplift — kapan pakai mana?</strong><br/>A: Propensity = &ldquo;siapa yang akan beli&rdquo; (termasuk yang beli <strong>sendiri</strong>). Uplift = &ldquo;siapa yang beli <strong>karena</strong> aksimu&rdquo;. Untuk <strong>targeting</strong> kampanye mahal → uplift (MK11). Untuk <strong>prioritisasi</strong> murah (email) → propensity cukup. Aturan: makin mahal aksinya, makin butuh uplift.</p>
<p><strong>Q2: Berapa banyak data untuk model propensity?</strong><br/>A: Minimal <strong>500–1.000 kejadian positif</strong> (pembeli) untuk model sederhana; 5.000+ untuk GBM. Kurang dari itu → pakai <strong>aturan</strong> (RFM + heuristik), bukan ML. Model lapar data yang dipaksa = overfit yang percaya diri.</p>
<p><strong>Q3: Fitur terbaik untuk propensity?</strong><br/>A: <strong>Perilaku recent</strong> (kunjungan 7 hari terakhir, keranjang ditinggal) &gt; demografi. Aturan praktis: <strong>recency mengalahkan segalanya</strong> — orang yang kemarin lihat produk 10x lebih mungkin beli dari yang &ldquo;profilnya cocok&rdquo; tapi tidak pernah datang.</p>
<p><strong>Q4: Model decay — seberapa cepat?</strong><br/>A: E-commerce: <strong>2–4 minggu</strong> tanpa retrain mulai menyimpang (tren, promo kompetitor). SaaS B2B: 2–3 bulan. Tanda: decile table bulanan menyimpang. Solusi: <strong>retrain terjadwal</strong>, bukan &ldquo;saat sempat&rdquo;.</p>
<p><strong>Q5: Satu model untuk semua produk?</strong><br/>A: <strong>Jangan.</strong> Propensity beli sabun ≠ propensity beli TV (siklus, pertimbangan beda). Model gabungan = rata-rata yang salah untuk keduanya. Pisahkan per <strong>kategori dengan siklus berbeda</strong>.</p>
<p><strong>Q6: Bagaimana handle &ldquo;tidak pernah beli&rdquo; (cold start)?</strong><br/>A: Pakai <strong>lookalike</strong> dari pembeli terbaik + data perilaku anonim (kategori dilihat). Skor awal = prior rendah; <strong>update</strong> setelah interaksi pertama. Jangan perlakukan prospek baru seperti prospek lama — mereka <strong>belum punya sejarah</strong>, bukan &ldquo;skor nol&rdquo;.</p>
<p><strong>Q7: Propensity untuk churn (bukan beli)?</strong><br/>A: Sama persis — hanya targetnya &ldquo;akan pergi&rdquo; (lihat MK6). Bedanya: <strong>aksi</strong> (retensi, bukan penjualan) dan <strong>biaya kesalahan</strong> (mengganggu yang setia = sleeping dogs!). Rantai kalibrasi → cutoff → NBA berlaku identik.</p>
<p><strong>Q8: Siapa yang boleh lihat skor individu?</strong><br/>A: <strong>Etika + UU PDP</strong> (MK18!): skor = profil perilaku. Batasi akses (need-to-know), jangan pakai untuk <strong>diskriminasi harga</strong> tanpa transparansi, dan sediakan <strong>opt-out</strong>. Skor yang bocor = krisis kepercayaan.</p>
<p><strong>Q9: Kapan berhenti mengoptimasi model?</strong><br/>A: Saat <strong>lift bisnis</strong> dari AUC +0,01 &lt; biaya waktu tim. Sering kali: perbaiki <strong>kalibrasi + cutoff + aksi</strong> memberi 10x lipat dari menaikkan AUC 0,82 → 0,84. <strong>Optimasi rantai, bukan mata rantai.</strong></p>
<p><strong>Q10: Metrik sukses program propensity?</strong><br/>A: <strong>Incremental profit vs kontrol</strong> — bukan AUC, bukan konversi mentah. Tanpa kontrol = tidak ada klaim. Metrik kedua: <strong>% &ldquo;diam&rdquo; yang benar</strong> (mereka yang tidak diganggu tapi tetap beli = bukti kamu tidak boros).</p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Satu Skor</h2>
<h3>Kasus A: Klinik &ldquo;SehatPlus&rdquo; — propensity medical check-up</h3>
<p>50.000 pasien lama. MCU margin Rp800rb, biaya telepon Rp30rb. Model: p rata-rata 0,12.</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Langkah 1 — p*:</strong> 30rb/800rb = <strong>0,0375</strong>. Rata-rata 0,12 &gt; p* → sebagian besar lolos.</p>
<p><strong>Langkah 2 — Kalibrasi check:</strong> decile 10: skor 0,45 → aktual <strong>28%</strong>. Overconfident! Pakai 0,28.</p>
<p><strong>Langkah 3 — Etika (MK18!):</strong> telepon menawarkan MCU ke lansia p tinggi — <strong>boleh</strong> (manfaat kesehatan). Tapi <strong>jangan</strong> pakai skor untuk <strong>menolak</strong> pasien. Skor = alat <strong>menjangkau</strong>, bukan <strong>menyeleksi</strong> — di kesehatan, bedanya = nyawa.</p>
<p><strong>Pelajaran:</strong> propensity di kesehatan punya <strong>batas etika</strong> yang tidak ada di e-commerce. Teknologi sama, tanggung jawab beda.</p>
</details>
<h3>Kasus B: Marketplace &ldquo;SerbaAda&rdquo; — propensity beli elektronik</h3>
<p>2 juta pengunjung/bulan. Kategori elektronik margin Rp300rb. Banner retargeting Rp500/impresi (butuh ~20 impresi/konversi).</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — Biaya efektif:</strong> 20 × Rp500 = <strong>Rp10rb</strong> per &ldquo;upaya&rdquo;. p* = 10rb/300rb = <strong>0,033</strong>.</p>
<p><strong>Langkah 2 — Fitur kunci:</strong> &ldquo;lihat halaman elektronik 3x dalam 7 hari&rdquo; → p=0,18. &ldquo;Sekali lihat 30 hari lalu&rdquo; → p=0,02 (&lt; p* → <strong>jangan retarget</strong>!).</p>
<p><strong>Langkah 3 — Frequency cap:</strong> setelah 20 impresi tanpa beli, <strong>berhenti</strong> — p turun (fatigue), biaya naik. Retargeting tanpa cap = <strong>menguntit</strong> pelanggan dengan uang perusahaan.</p>
<p><strong>Pelajaran:</strong> retargeting = propensity + <strong>recency + cap</strong>. Tiga serangkai yang sering dilupakan dua.</p>
</details>
<h3>Kasus C: Universitas &ldquo;Cendekia&rdquo; — propensity daftar ulang</h3>
<p>5.000 mahasiswa. Tim admisi ingin &ldquo;menelpon yang berisiko tidak daftar ulang&rdquo;.</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Langkah 1 — Framing ulang:</strong> ini <strong>churn</strong> (MK6!), bukan &ldquo;propensity beli&rdquo;. p = P(tidak daftar ulang).</p>
<p><strong>Langkah 2 — Fitur:</strong> IPK turun, tunggakan, tidak ambil KRS tepat waktu — <strong>leading indicators</strong>.</p>
<p><strong>Langkah 3 — Aksi:</strong> bukan &ldquo;telepon marketing&rdquo; tapi <strong>konseling akademik</strong>. NBA di sini = <strong>intervensi manusiawi</strong>, bukan penjualan.</p>
<p><strong>Pelajaran:</strong> framework propensity <strong>netral</strong> — ia bekerja untuk pendidikan, kesehatan, sosial. Yang berubah = <strong>aksi dan etikanya</strong>. Kuasai framework-nya, sesuaikan nuraninya.</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Membela "Diam"</h2>
<p><strong>Direktur Marketing:</strong> &ldquo;Kamu bilang 12% nasabah <strong>tidak usah diapa-apakan</strong>? Saya bayar tim marketing untuk <strong>bertindak</strong>, bukan diam!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Tepatnya: 12% ini <strong>akan beli sendiri</strong> — data kontrol menunjukkan 7% dari mereka konversi tanpa disentuh. Setiap email ke mereka = biaya Rp3rb + risiko unsubscribe 0,1%. Untuk 12.000 orang: biaya Rp36jt + ~12 unsubscribe permanen — <strong>untuk hasil yang sebenarnya negatif</strong> (mengganggu yang mau beli).&rdquo;</p>
<p><strong>Direktur:</strong> &ldquo;Tapi kalau mereka tidak jadi beli? Salahmu!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Adil. Saya usulkan: 2.000 dari 12.000 itu kita <strong>tetap kirim email</strong> sebagai asuransi — kita ukur. Jika yang &lsquo;diam&lsquo; konversinya ≥ yang dikirimi, bulan depan 12.000 semuanya diam. <strong>Keputusan berbasis eksperimen, bukan keyakinan.</strong> Deal?&rdquo;</p>
<p><strong>Direktur:</strong> &ldquo;...Deal. Tapi aku catat janjimu.&rdquo;</p>
<div className="tip">
<p><strong>💡 &ldquo;Diam&rdquo; adalah aksi tersulit untuk dibela — karena terlihat seperti tidak kerja. Senjatamu: <em>angka kontrol</em> + <em>eksperimen asuransi</em>. Jangan pernah meminta kepercayaan buta; mintalah <em>kesempatan membuktikan</em>.</strong></p>
</div>

      <h2 id="faq">❓ Tanya-Jawab Kilat</h2>
<p><strong>Q1: Model propensity vs aturan RFM — mana dulu?</strong><br/>A: <strong>Aturan dulu.</strong> Jika RFM + cutoff sederhana sudah memberi EV positif, model ML = optimasi tahap 2. Jangan bangun GBM untuk masalah yang bisa diselesaikan 3 baris IF.</p>
<p><strong>Q2: Skor 0,99 tapi tidak beli-beli — kenapa?</strong><br/>A: Tiga kemungkinan: (a) <strong>miskalibrasi</strong> (skor bohong); (b) <strong>hambatan</strong> (mau beli tapi checkout rusak / tidak ada stok — skor tidak melihat ini!); (c) <strong>waktu</strong> (mau beli bulan depan). Investigasi (b) dulu — sering kali masalahnya <strong>operasional</strong>, bukan model.</p>
<p><strong>Q3: Berapa lama skor valid?</strong><br/>A: Skor propensity = <strong>barang segar</strong>: hitung ulang <strong>harian</strong> untuk e-commerce (perilaku kemarin!), mingguan untuk B2B. Skor 30 hari = ramalan cuaca bulan lalu.</p>
<p><strong>Q4: Boleh pakai skor untuk diskriminasi harga?</strong><br/>A: <strong>Hati-hati (MK18).</strong> Tampilkan harga lebih tinggi ke yang &ldquo;mau bayar mahal&rdquo; = diskriminasi harga — legal di beberapa tempat, <strong>etis dipertanyakan</strong> di semua tempat. Jika dilakukan: transparan + ada batas. Jika ragu: jangan.</p>
<p><strong>Q5: Tim tidak percaya model — bagaimana?</strong><br/>A: Jangan presentasi AUC. Presentasi <strong>uang</strong>: &ldquo;kelompok yang model pilih konversi 9,2% vs 3,1% kontrol.&rdquo; Dan libatkan mereka di <strong>desain aksi</strong> — model yang aksinya dirancang tim lapangan = model yang dipakai.</p>
<p><strong>Q6: Satu kalimat inti lesson ini?</strong><br/>A: <strong>Skor tanpa kalibrasi = dusta; kalibrasi tanpa cutoff = hiasan; cutoff tanpa aksi = sia-sia; aksi tanpa eksperimen = judi.</strong> Empat rantai, tidak boleh putus satu pun.</p>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Propensity</strong> = P(aksi|X) via (biasanya) regresi logistik; untuk ranking + — jika terkalibrasi — EV.</li>
<li><strong>Kalibrasi</strong> (reliability curve) wajib sebelum probabilitas dipakai untuk keputusan uang.</li>
<li><strong>Decile analysis</strong>: bukti model bekerja (lift) dalam bahasa bisnis.</li>
<li><strong>NBA</strong> = argmax aksi [P(respons|aksi,X)×V − C(aksi)] + constraints; 'diam' adalah aksi valid.</li>
<li><strong>Propensity ≠ kausalitas</strong>: sure things vs persuadable dibedakan di MK11 (uplift).</li>
<li><strong>Lookalike</strong>: seed = pelanggan CLV tertinggi; kualitas seed = kualitas kembaran.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk6-churn" className="btn btn-secondary btn-sm">← MK6</Link>
        <Link href="/learn/mk8-rekomendasi" className="btn btn-primary btn-sm">MK8 →</Link>
      </div>
    </div>
  );
}

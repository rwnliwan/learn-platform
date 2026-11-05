"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk5ClvPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK5 — Marketing Data Analytics</span>
        <h1 className="display-title">CLV:<br/>Menebak Nilai Seumur Hidup Pelanggan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Dua Pelanggan, Satu 'Nilai' yang Salah</a></li>
<li><a href="#dasar">Rumus Dasar CLV</a></li>
<li><a href="#bgnbd">BG/NBD — Buy Till You Die</a></li>
<li><a href="#ggml">Gamma-Gamma & Pendekatan ML</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Tiga Cara Melihat Masa Depan Pelanggan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Alokasi CAC per Channel</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: CLV yang Menyelamatkan Rp2 Miliar Budget</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis CLV</a></li>
<li><a href="#extra3">📋 Playbook: Tabel CLV per Segmen per Channel</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Satu Rumus</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Membela Batas CAC</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menghitung CLV dasar dari margin, retention rate, dan discount rate.</li>
<li>Menjelaskan intuisi BG/NBD: kenapa recency & frequency cukup untuk menebak 'masih hidup'.</li>
<li>Membedakan kapan memakai rumus sederhana vs BG/NBD vs pendekatan ML.</li>
<li>Memakai CLV untuk keputusan alokasi: berapa CAC maksimal per segmen/channel.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Dua Pelanggan, Satu 'Nilai' yang Salah</h2>
      <div className="story">
        <p>Manajer CRM <em>&ldquo;LakuKeras&rdquo;</em> punya dua pelanggan: <strong>Pak Budi</strong> — belanja Rp20 juta total, tapi terakhir beli 2 tahun lalu. <strong>Bu Ani</strong> — belanja Rp8 juta total, tapi beli tiap bulan dan terakhir minggu lalu. Sistem memberi label &ldquo;VIP&rdquo; ke Pak Budi (belanja historis lebih besar) dan tim mengiriminya concierge mahal + diskon besar.</p>
<p>Twist-nya: <strong>nilai historis ≠ nilai masa depan</strong>. Pak Budi sudah &ldquo;mati&rdquo; (tidak akan kembali), Bu Ani masih &ldquo;hidup&rdquo; dan akan belanja Rp8 juta <em>lagi</em> tahun depan. Uang concierge terbuang; Bu Ani tidak dapat apa-apa dan pindah ke kompetitor. <strong>CLV</strong> (<em>Customer Lifetime Value</em>) adalah ilmu menebak nilai <em>masa depan</em> — dan model terbaik untuk itu justru lahir dari dua angka sederhana: <strong>recency & frequency</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="dasar">Rumus Dasar — Tiga Bahan, Satu Tebakan</h2>
<p><strong>Definisi.</strong> <strong>CLV</strong> = total profit yang diharapkan dari satu pelanggan selama sisa hubungannya denganmu, didiskon ke nilai sekarang. Tiga bahan: <strong>margin per periode</strong> (m), <strong>retention rate</strong> (r — peluang bertahan tiap periode), <strong>discount rate</strong> (d — nilai waktu uang).</p>
<p>Dua dunia: <strong>kontrak</strong> (langganan — tahu persis kapan churn: tidak perpanjang) vs <strong>non-kontrak</strong> (ritel — pelanggan &ldquo;pergi&rdquo; diam-diam; butuh model probabilistik seperti BG/NBD).</p>
<Tex math={String.raw`CLV = \sum_{t=0}^{\infty} \frac{m \cdot r^t}{(1+d)^t} = \frac{m \cdot r}{1 + d - r}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`m`} />: margin kotor per pelanggan per periode (Rp/bln)</li>
<li><Tex math={String.raw`r`} />: retention rate per periode (0,9 = 90% bertahan tiap bulan)</li>
<li><Tex math={String.raw`d`} />: discount rate per periode (0,01 = 1%/bln)</li>
<li>Rumus kanan = deret geometri tertutup — berlaku jika r &lt; 1+d (selalu, karena r ≤ 1)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> CLV seperti <strong>menilai pohon buah</strong>: bukan dari buah yang sudah dipetik (historis), tapi dari buah yang <em>akan</em> tumbuh (masa depan) — dikurangi peluang pohon mati (1−r) tiap musim. Pohon yang terakhir berbuah 2 tahun lalu kemungkinan sudah mati; yang berbuah tiap bulan masih subur.</p>
<p><strong>Kapan dipakai:</strong> Kontrak/subscription dengan r stabil. Untuk non-kontrak (ritel), rumus ini hanya kasar — naik ke BG/NBD.</p>
<details className="worked">
<summary>📐 Contoh: CLV Bu Ani vs Pak Budi (klik untuk buka)</summary>
<p>Bu Ani: m = Rp400rb/bln, r = 0,95/bln, d = 0,01. CLV = 400.000 × 0,95 / (1 + 0,01 − 0,95) = 400.000 × 0,95 / 0,06 = <strong>Rp6,33 juta</strong>.</p>
<p>Pak Budi: terakhir beli 2 tahun lalu → r efektif ≈ 0 → CLV ≈ <strong>Rp0</strong> (sudah &ldquo;mati&rdquo;).</p>
<p>Sistem lama memberi VIP ke Pak Budi (historis Rp20jt). CLV memberi VIP ke Bu Ani (masa depan Rp6,3jt). <strong>Selisih keputusan = selisih definisi nilai.</strong></p>
</details>
<PlotlyChart
  data={[{x: ["Pak Budi (mati)", "Rata-rata", "Bu Ani (hidup)"], y: [0, 2.1, 6.33], type: "bar", marker: {color: ["#94a3b8","#e8a838","#2a7de1"]}, text: ["Rp0", "Rp2,1jt", "Rp6,3jt"], textposition: "outside"}]}
  title={"CLV: historis vs masa depan"}
  layout={{yaxis: {title: "CLV (Rp juta)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = CLV prediksi (nilai masa depan). Bandingkan dengan label &lsquo;VIP historis&rsquo; yang dulu menunjuk Pak Budi.</p>
<p><strong>Interpretasi:</strong> Pak Budi (belanja historis Rp20jt) CLV-nya nol — ia sudah pergi. Bu Ani (historis Rp8jt) CLV-nya Rp6,3jt — 3x rata-rata. Visual ini = alasan kenapa budget VIP harus pindah dari Budi ke Ani.</p>
</div>
<h2 id="bgnbd">BG/NBD — Tebakan Hidup-Mati dari Dua Angka</h2>
<p><strong>Definisi.</strong> <strong>BG/NBD</strong> (Beta-Geometric / Negative Binomial Distribution, Fader-Hardie) adalah model untuk dunia <strong>non-kontrak</strong>: pelanggan membeli mengikuti proses Poisson (NBD mengatur beda frekuensi antar orang), dan setelah tiap pembelian ada peluang &ldquo;mati&rdquo; (dropout) yang mengikuti distribusi Beta-Geometric. Input cuma tiga: <strong>frequency</strong> (x), <strong>recency</strong> (t_x — kapan terakhir beli), <strong>umur</strong> (T — sejak pertama beli).</p>
<p>Intuisi kuncinya: <strong>recency mengalahkan frequency</strong> untuk menebak &ldquo;masih hidup&rdquo;. Beli 10x tapi terakhir 2 tahun lalu = kemungkinan besar mati. Beli 2x tapi minggu lalu = kemungkinan besar hidup. Model mengkuantifikasi firasat ini jadi <strong>P(alive)</strong> + prediksi pembelian masa depan.</p>
<Tex math={String.raw`P(\text{alive} \mid x, t_x, T) \;\; \text{naik jika } t_x \approx T \;\; \text{turun jika } t_x \ll T`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`x`} />: frequency — jumlah pembelian berulang (tidak termasuk pembelian pertama)</li>
<li><Tex math={String.raw`t_x`} />: recency — waktu pembelian terakhir (dari awal observasi)</li>
<li><Tex math={String.raw`T`} />: umur pelanggan — waktu sejak pembelian pertama</li>
<li>Aturan baca: t_x dekat T (baru beli) → P(alive) tinggi; t_x jauh dari T (lama tidak beli) → P(alive) rendah, <em>terlepas</em> dari x yang besar</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> BG/NBD seperti <strong>dokter yang mendiagnosis dari dua gejala</strong>: &lsquo;kapan terakhir terlihat&rsquo; (recency) lebih menentukan dari &lsquo;berapa kali datang&rsquo; (frequency). Pasien yang 10x kontrol tapi 2 tahun tidak muncul = kemungkinan pindah RS. Yang 2x kontrol tapi minggu lalu datang = pasien aktif.</p>
<p><strong>Kapan dipakai:</strong> Ritel/e-commerce non-kontrak dengan data transaksi (butuh x, t_x, T per pelanggan). Jangan pakai jika pembelian sangat musiman tanpa pola individual.</p>
<details className="worked">
<summary>📐 Contoh: P(alive) Budi vs Ani (klik untuk buka)</summary>
<p>Pak Budi: x=15, t_x=bulan ke-2, T=26 bulan → t_x ≪ T → <strong>P(alive) ≈ 3%</strong>. Mati.</p>
<p>Bu Ani: x=8, t_x=bulan ke-25, T=26 bulan → t_x ≈ T → <strong>P(alive) ≈ 92%</strong>. Hidup.</p>
<p>Perhatikan: Budi frequency-nya hampir 2x Ani, tapi recency membunuhnya. Inilah kenapa RFM (MK3) memberi bobot besar pada Recency — BG/NBD adalah versi probabilistik dari intuisi yang sama.</p>
</details>
<h2 id="ggml">Gamma-Gamma & ML — Dari 'Berapa Kali' ke 'Berapa Rupiah'</h2>
<p><strong>Definisi.</strong> BG/NBD memprediksi <strong>jumlah transaksi</strong> masa depan. <strong>Gamma-Gamma</strong> memprediksi <strong>nilai per transaksi</strong> (monetary): rata-rata belanja per pelanggan mengikuti Gamma antar individu. CLV = E[transaksi] × E[nilai] (asumsi keduanya independen — cek dulu!). <strong>Pendekatan ML</strong> (gradient boosting pada fitur RFM + tenure + kategori + tren) dipakai saat: banyak fitur non-transaksional (tiket CS, app usage), atau horizon pendek yang spesifik.</p>
<p>Aturan pemilihan: <strong>mulai dari BG/NBD + Gamma-Gamma</strong> (butuh sedikit data, terinterpretasi, benchmark kuat). Naik ke ML hanya jika fitur tambahan terbukti menambah akurasi di validasi out-of-time — kompleksitas harus dibayar dengan performa.</p>
<Tex math={String.raw`CLV_{12bln} = E[X_{12}] \times E[M] \times \text{margin}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`E[X_{12}]`} />: ekspektasi jumlah transaksi 12 bulan ke depan (dari BG/NBD)</li>
<li><Tex math={String.raw`E[M]`} />: ekspektasi nilai per transaksi (dari Gamma-Gamma)</li>
<li>margin: % yang jadi laba kotor</li>
<li>Validasi: bandingkan prediksi vs aktual di periode holdout — MAPE per decile CLV, bukan cuma rata-rata</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> BG/NBD menjawab <strong>&lsquo;berapa kali lagi dia datang?&rsquo;</strong>, Gamma-Gamma menjawab <strong>&lsquo;tiap datang bawa berapa?&rsquo;</strong>. Kalikan = CLV. ML menjawab &lsquo;apa lagi yang kutahu tentang dia?&rsquo; — berguna, tapi jangan sampai 50 fitur menutupi sinyal sederhana recency.</p>
<p><strong>Kapan dipakai:</strong> Gamma-Gamma: monetary per transaksi relatif stabil per orang. ML: ada fitur perilaku kaya (app, CS, web) + butuh horizon spesifik (CLV 90 hari untuk kampanye).</p>
<details className="worked">
<summary>📐 Contoh: CLV 12 bulan Bu Ani (klik untuk buka)</summary>
<p>BG/NBD: E[X_12] = 9,5 transaksi. Gamma-Gamma: E[M] = Rp850rb. Margin 40%.</p>
<p>CLV_12 = 9,5 × 850.000 × 0,4 = <strong>Rp3,23 juta</strong>.</p>
<p>Keputusan: CAC maksimal untuk segmen &ldquo;seperti Ani&rdquo; = CLV/3 ≈ <strong>Rp1,07 juta</strong> (aturan LTV:CAC ≥ 3 dari MK1). Channel yang CAC-nya Rp1,5jt untuk segmen ini = rugi — potong atau perbaiki.</p>
</details>
<PlotlyChart
  data={[{x: [0.5,1.5,2.5,3.5,4.5,6,8,12], y: [35,25,15,10,6,4,3,2], type: "bar", marker: {color: "#2a7de1"}, text: ["35%","25%","15%","10%","6%","4%","3%","2%"], textposition: "outside"}]}
  title={"Distribusi CLV 12 bulan (jt Rp) — miring kanan"}
  layout={{xaxis: {title: "CLV 12 bulan (Rp juta)"}, yaxis: {title: "% pelanggan"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = nilai CLV, tinggi batang = % pelanggan. Perhatikan bentuknya.</p>
<p><strong>Interpretasi:</strong> Distribusi <strong>miring kanan</strong>: 60% pelanggan CLV-nya di bawah Rp2,5jt, tapi 5% teratas (ekor kanan) menyumbang porsi revenue raksasa. Inilah kenapa CLV rata-rata menipu (ingat MK1!) — keputusan CAC harus per segmen CLV, bukan rata-rata.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Tiga Cara Melihat Masa Depan Pelanggan</h2>
<p>CLV adalah <strong>tebakan tentang masa depan</strong> — dan kualitas tebakan tergantung seberapa jujur kamu tentang asumsinya. Tiga pendalaman: (1) rumus dasar dan tiga asumsi yang hampir selalu dilanggar; (2) BG/NBD — menebak &ldquo;hidup-mati&rdquo; hanya dari dua angka; (3) discount rate — mengapa Rp1 juta tahun depan tidak sama dengan Rp1 juta hari ini.</p>
<h3>1. Rumus Dasar dan Tiga Asumsi yang Hampir Selalu Dilanggar</h3>
<p><strong>Definisi.</strong> <Tex math={String.raw`CLV = m \times \frac{r}{1 + d - r}`} /> — versi rapi dari &ldquo;margin per periode × umur harapan yang didiskon&rdquo;. Di sini <Tex math={String.raw`m`} /> = margin kotor per periode, <Tex math={String.raw`r`} /> = retention rate per periode (1 − churn), <Tex math={String.raw`d`} /> = discount rate per periode.</p>
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`m`} /> dalam rupiah per pelanggan per bulan/tahun — <strong>margin, bukan revenue</strong>; <Tex math={String.raw`r`} /> antara 0–1 (r=0,9 artinya 90% bertahan tiap periode); <Tex math={String.raw`d`} /> = biaya modal (mis. 1%/bulan ≈ 12%/tahun) — menghargai bahwa uang hari ini lebih berharga dari uang tahun depan.</p>
<p><strong>Kepribadian/intuisi:</strong> Rumus ini seperti <strong>ramalan cuaca 30 hari dari tiga angka</strong>: suhu rata-rata, kelembapan, angin. Berguna — selama kamu ingat ia mengasumsikan <strong>tiga kebohongan</strong>: (a) <strong>margin konstan</strong> — padahal pelanggan lama sering belanja lebih besar (atau lebih kecil, jika hanya menunggu diskon); (b) <strong>retention konstan</strong> — padahal churn bulan 1 ≠ churn bulan 12 (lihat MK1!); (c) <strong>discount rate = 0</strong> dalam versi sederhana — padahal startup yang kehabisan kas menilai Rp1 tahun depan jauh lebih murah dari Rp1 hari ini. Rumus dasar = <strong>titik awal diskusi</strong>, bukan jawaban final.</p>
<p><strong>Kapan dipakai:</strong> Estimasi cepat, perbandingan antar-segmen/channel, batas CAC (CLV/3). Jangan pakai untuk: valuasi perusahaan, kontrak jangka panjang, atau pelanggan dengan pola musiman kuat.</p>
<details className="worked">
<summary>📐 Contoh 1a: CLV tiga skenario, satu pelanggan (klik untuk buka)</summary>
<p>Pelanggan: margin Rp60rb/bln, retention 90%/bln, discount 1%/bln.</p>
<p><strong>Langkah 1 — Versi naif</strong> (tanpa diskon): CLV = 60rb × 0,9/(1 − 0,9) = 60rb × 9 = <strong>Rp540rb</strong>.</p>
<p><strong>Langkah 2 — Dengan diskon:</strong> CLV = 60rb × 0,9/(1 + 0,01 − 0,9) = 60rb × 0,9/0,11 = 60rb × 8,18 = <strong>Rp490.909</strong> — turun 9%.</p>
<p><strong>Langkah 3 — Retention tidak konstan</strong> (r=0,7 di 3 bulan pertama, lalu 0,95): umur harapan ≈ (0,7+0,7²+0,7³) + 0,7³×(0,95/(1−0,95)) = (0,7+0,49+0,343) + 0,343×19 = 1,533 + 6,517 = 8,05 bulan → CLV ≈ 60rb × 8,05 ≈ <strong>Rp483rb</strong> (tanpa diskon).</p>
<p><strong>Pelajaran:</strong> tiga asumsi → tiga angka (540rb / 491rb / 483rb). Selisih 10%+ — cukup untuk mengubah keputusan &ldquo;channel ini boleh CAC Rp180rb atau Rp160rb&rdquo;. <strong>Selalu laporkan CLV beserta asumsinya</strong> — angka tanpa asumsi = opini berpakaian matematika.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Kapan versi naif cukup? (klik untuk buka)</summary>
<p>Startup dengan churn <strong>rendah dan stabil</strong> (r=0,97, terukur 12 bulan, tidak ada musiman), margin stabil 40%, dan kas sehat (discount bisa diabaikan untuk keputusan operasional).</p>
<p><strong>Langkah 1:</strong> CLV naif = m × 0,97/0,03 = m × 32,3.</p>
<p><strong>Langkah 2:</strong> Dengan diskon 1%: m × 0,97/0,04 = m × 24,25 — selisih <strong>25%</strong>! Tidak bisa diabaikan ternyata.</p>
<p><strong>Pelajaran:</strong> semakin tinggi retention, semakin besar dampak discount rate — karena umur panjang = banyak &ldquo;masa depan&rdquo; yang didiskon. <strong>Aturan praktis:</strong> r &gt; 0,9 → wajib pakai discount; r &lt; 0,8 → versi naif cukup untuk keputusan cepat (error &lt; 10%).</p>
</details>
<h3>2. BG/NBD — Menebak &ldquo;Hidup-Mati&rdquo; dari Dua Angka</h3>
<p><strong>Definisi.</strong> Model <strong>BG/NBD</strong> (<em>Beta-Geometric / Negative Binomial Distribution</em>) menjawab: &ldquo;pelanggan yang terakhir beli 90 hari lalu, frekuensi 3x — <strong>masih hidup atau sudah pergi?</strong>&rdquo; Hanya dari <strong>recency</strong> (kapan terakhir) dan <strong>frequency</strong> (berapa kali) + tenure. Tanpa data demografis, tanpa survei.</p>
<p><strong>Kepribadian/intuisi:</strong> BG/NBD seperti <strong>dokter UGD yang mendiagnosis dari dua tanda vital</strong>: &ldquo;kapan terakhir terlihat bergerak&rdquo; (recency) dan &ldquo;seberapa sering bergerak&rdquo; (frequency). Pasien yang biasa bergerak tiap jam tapi diam 3 hari = <strong>gawat</strong>. Pasien yang biasa bergerak tiap bulan dan diam 3 hari = <strong>normal</strong>. Model ini brilian karena ia <strong>mengkalibrasi ekspektasi per individu</strong>: &ldquo;lama&rdquo; untuk si A belum tentu &ldquo;lama&rdquo; untuk si B.</p>
<p><strong>Asumsi inti (pahami, jangan hafal):</strong> (a) tiap pelanggan beli mengikuti Poisson dengan ratenya sendiri; (b) setelah tiap pembelian ada peluang &ldquo;mati&rdquo; (berhenti selamanya) — geometric; (c) rate &amp; peluang mati bervariasi antar-pelanggan mengikuti distribusi Beta/Gamma. Hasil: <strong>P(alive)</strong> per pelanggan + prediksi jumlah pembelian masa depan.</p>
<p><strong>Kapan dipakai:</strong> Non-kontrak (e-commerce, ritel) — pelanggan tidak &ldquo;berhenti langganan&rdquo;, mereka <strong>menghilang diam-diam</strong>. Tidak cocok untuk: kontraktual (churn teramati langsung), atau data sangat jarang (frekuensi &lt; 2).</p>
<details className="worked">
<summary>📐 Contoh 2a: Dua pelanggan, satu recency, nasib beda (klik untuk buka)</summary>
<p>Tenure 365 hari. Pelanggan X: 12x beli, terakhir 30 hari lalu. Pelanggan Y: 2x beli, terakhir 30 hari lalu.</p>
<p><strong>Langkah 1 — Intuisi:</strong> recency sama (30 hari). Tapi X biasa beli tiap ~30 hari (365/12) — <strong>dia terlambat</strong>. Y biasa beli tiap ~180 hari — dia <strong>tepat waktu</strong>.</p>
<p><strong>Langkah 2 — P(alive) model:</strong> X ≈ <strong>35%</strong> (pola rusak = kemungkinan besar mati); Y ≈ <strong>85%</strong> (pola normal).</p>
<p><strong>Langkah 3 — Implikasi aksi:</strong> X = target win-back <strong>sekarang</strong> (masih ada 35% harapan); Y = <strong>jangan ganggu</strong> (dia baik-baik saja — ganggu = bangunkan sleeping dog, MK11!).</p>
<p><strong>Pelajaran:</strong> &ldquo;terakhir beli 30 hari lalu&rdquo; <strong>tidak ada artinya</strong> tanpa frekuensi. Inilah mengapa RFM memakai R <em>dan</em> F — dan BG/NBD adalah versi probabilistiknya.</p>
</details>
<details className="worked">
<summary>📐 Contoh 2b: Dari P(alive) ke expected transaksi (klik untuk buka)</summary>
<p>Pelanggan Z: P(alive) = 70%, rata-rata beli 0,5x/bulan saat hidup. Prediksi 6 bulan ke depan?</p>
<p><strong>Langkah 1:</strong> Expected transaksi = P(alive) × rate × waktu = 0,7 × 0,5 × 6 = <strong>2,1 transaksi</strong>.</p>
<p><strong>Langkah 2:</strong> Nilai rata-rata Rp150rb, margin 30% → expected value = 2,1 × 150rb × 0,3 = <strong>Rp94.500</strong>.</p>
<p><strong>Langkah 3 — Keputusan:</strong> biaya voucher win-back Rp50rb → expected net = 94.500 − 50.000 = <strong>+Rp44.500</strong> → kirim voucher. Jika P(alive) cuma 20%: expected = 0,2×0,5×6×150rb×0,3 = Rp27.000 &lt; Rp50rb → <strong>jangan kirim</strong>.</p>
<p><strong>Pelajaran:</strong> BG/NBD mengubah &ldquo;feeling&rdquo; menjadi <strong>expected value</strong> — dan expected value mengubah kampanye dari judi menjadi investasi.</p>
</details>
<h3>3. Discount Rate — Uang Masa Depan Lebih Murah</h3>
<p><strong>Definisi.</strong> <em>Discount rate</em> (d) = &ldquo;harga&rdquo; waktu: Rp100rb tahun depan bernilai Rp100rb/(1+d) hari ini. Untuk startup: d = biaya modal + premi risiko kehabisan kas.</p>
<p><strong>Kepribadian/intuisi:</strong> Discount rate seperti <strong>ongkir waktu</strong>: semakin jauh ke masa depan, semakin mahal &ldquo;ongkirnya&rdquo; — nilainya menyusut di perjalanan. Startup yang kasnya tinggal 6 bulan punya &ldquo;ongkir&rdquo; sangat mahal: Rp1 juta tahun depan hampir tidak ada artinya dibanding Rp1 juta <strong>hari ini</strong> untuk gaji. Itulah mengapa dua perusahaan bisa menghitung CLV <strong>berbeda dari data sama</strong> — yang satu sekarat (d tinggi), yang satu kaya (d rendah).</p>
<p><strong>Kapan dipakai:</strong> Selalu cantumkan d yang dipakai. Untuk keputusan operasional: d = 10–15%/tahun wajar. Untuk valuasi/fundraising: ikuti standar keuangan.</p>
<details className="worked">
<summary>📐 Contoh 3: CLV dengan dan tanpa diskon, horizon 3 tahun (klik untuk buka)</summary>
<p>Margin Rp1jt/tahun, retention 80%/tahun.</p>
<p><strong>Langkah 1 — Tanpa diskon:</strong> CLV = 1jt × 0,8/0,2 = <strong>Rp4jt</strong>.</p>
<p><strong>Langkah 2 — d=12%:</strong> CLV = 1jt × 0,8/(1,12 − 0,8) = 1jt × 0,8/0,32 = <strong>Rp2,5jt</strong> — turun <strong>37,5%</strong>!</p>
<p><strong>Langkah 3 — Implikasi batas CAC:</strong> tanpa diskon batas CAC = 4jt/3 = Rp1,33jt; dengan diskon = Rp833rb. Selisih <strong>Rp500rb per pelanggan</strong> — cukup untuk membuat channel &ldquo;sehat&rdquo; menjadi &ldquo;beracun&rdquo;.</p>
<p><strong>Pelajaran:</strong> mengabaikan discount rate = <strong>menggelembungkan CLV</strong> = mengizinkan CAC yang terlalu mahal = bakar uang dengan restu spreadsheet.</p>
</details>
<PlotlyChart
  data={[{x: ["Naif", "+ Diskon 1%/bln", "Retention tak-konstan", "Naif + diskon riil"], y: [540, 491, 483, 445], type: "bar", marker: {color: ["#94a3b8","#e8a838","#e8a838","#ef4444"]}, text: ["540rb","491rb","483rb","445rb"], textposition: "outside"}]}
  title={"CLV satu pelanggan, empat asumsi (Rp ribu)"}
  layout={{yaxis: {title: "CLV (Rp ribu)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Empat batang = empat asumsi untuk pelanggan yang sama (margin 60rb/bln, r≈90%). Tinggi = CLV.</p>
<p><strong>Interpretasi:</strong> Dari 540rb ke 445rb — <strong>18% menguap</strong> hanya karena asumsi yang lebih jujur. Batang merah = estimasi paling jujur (dan paling kecil). Pelajaran visual: <strong>CLV yang &ldquo;besar&rdquo; sering kali CLV yang malas</strong> — ia besar karena asumsinya malas, bukan karena pelanggannya berharga.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CLV = total belanja historis pelanggan. Yang sudah belanja banyak = bernilai tinggi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Historis = <strong>masa lalu</strong>, CLV = <strong>masa depan yang didiskon</strong>. Pak Budi (historis Rp20jt, mati) vs Bu Ani (historis Rp8jt, hidup, CLV Rp6,3jt). Keputusan berbasis historis memberi VIP ke orang yang sudah pergi. Selalu tanya: &lsquo;angka ini menebak masa depan, atau mencatat masa lalu?&rsquo;</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Model ML dengan 50 fitur pasti mengalahkan BG/NBD yang cuma pakai 3 angka.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> BG/NBD adalah <strong>benchmark yang sangat kuat</strong> — sering menang lawan ML di data transaksi murni, dengan 1% kompleksitas. ML menang saat ada sinyal non-transaksional yang kuat (app usage, CS). Aturan: kalahkan dulu BG/NBD di validasi out-of-time sebelum bangga dengan 50 fitur.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Recency mengalahkan frequency untuk P(alive).</strong> Beli 15x tapi 2 tahun lalu = mati. Beli 2x tapi minggu lalu = hidup. Saat stakeholder protes &lsquo;kok dia CLV-nya rendah padahal belanja banyak?&rsquo;, tunjukkan t_x vs T.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>CLV bukan angka — CLV adalah batas CAC.</strong> CLV Rp3,2jt artinya CAC maksimal Rp1,07jt (aturan ÷3). Presentasikan CLV selalu berpasangan dengan implikasi budget-nya, bukan sebagai angka pajangan.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator CLV + Sensitivitas Retention</h2>
<p>Hitung CLV dasar dan lihat betapa sensitifnya ia terhadap retention — naik 5 poin retention bisa 2x lipat CLV.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator CLV"}
  hint={"Ubah r dari 0.90 → 0.95. Lihat CLV meledak. Inilah kenapa retensi 5 poin lebih berharga dari akuisisi 50%."}
  defaultCode={"# Kalkulator CLV dasar + sensitivitas retention\nm = 400_000   # margin per pelanggan per bulan (Rp)\nd = 0.01      # discount rate per bulan\n\nprint(f\"{'retention':>10} {'CLV (Rp jt)':>12}  umur(pln)\")\nfor r in [0.80, 0.85, 0.90, 0.95, 0.97]:\n    clv = m * r / (1 + d - r)\n    umur = 1 / (1 - r)\n    print(f\"{r:>10.2f} {clv/1e6:>12.2f}  {umur:5.1f} bln\")\n\nprint(\"\\nBatas CAC sehat (CLV/3) pada r=0.95:\", f\"Rp{m*0.95/(1+d-0.95)/3:,.0f}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: BG/NBD-lite: Estimasi P(alive)</h2>
<p>Implementasi sederhana intuisi BG/NBD: P(alive) turun seiring jarak t_x ke T. Bandingkan beberapa profil pelanggan.</p>
<PyodideLab
  title={"Lab 2 — Simulator P(alive)"}
  hint={"Buat pelanggan dengan x=20 tapi t_x jauh dari T — lihat P(alive)-nya anjlok walau frequency tinggi. Recency wins."}
  defaultCode={"import math\n\ndef p_alive(x, t_x, T, k=3.0):\n    # model sederhana: P(alive) ~ f(jarak t_x ke T, dengan koreksi x)\n    # makin jauh t_x dari T -> makin kecil; x besar sedikit menahan\n    gap = max(T - t_x, 0) / max(T, 1)\n    dasar = math.exp(-k * gap)\n    koreksi = min(x / 10, 1) * 0.15  # frequency tinggi sedikit menolong\n    return min(dasar + koreksi * dasar, 1.0)\n\nprofil = [\n    (\"Pak Budi (mati?)\", 15, 2, 26),\n    (\"Bu Ani (hidup?)\",   8, 25, 26),\n    (\"Cici (baru)\",        1, 26, 26),\n    (\"Dodi (loyal lama)\", 30, 20, 26),\n]\nprint(f\"{'nama':<18}{'x':>4}{'t_x':>5}{'T':>4}  P(alive)\")\nfor nama, x, tx, T in profil:\n    print(f\"{nama:<18}{x:>4}{tx:>5}{T:>4}  {p_alive(x, tx, T):>7.0%}\")\nprint(\"\\nCatatan: ini versi sederhana untuk intuisi.\")\nprint(\"BG/NBD asli mengestimasi parameter dari data via MLE.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Subscription/kontrak, retention stabil → <strong>Rumus dasar CLV (m·r/(1+d−r))</strong></h3>
<p><strong>Kenapa:</strong> Churn teramati jelas (tidak perpanjang). Sederhana, cukup akurat.</p>
<p><strong>Contoh nyata:</strong> SaaS, langganan gym, asuransi.</p>
</div>
<div className="decision-card">
<h3>2. Ritel non-kontrak, data transaksi rapi → <strong>BG/NBD + Gamma-Gamma</strong></h3>
<p><strong>Kenapa:</strong> Benchmark kuat, butuh sedikit fitur, terinterpretasi (P(alive) bisa dijelaskan).</p>
<p><strong>Contoh nyata:</strong> E-commerce, FMCG, fashion.</p>
</div>
<div className="decision-card">
<h3>3. Banyak sinyal non-transaksional + horizon spesifik → <strong>ML (GBM) dengan fitur RFM+</strong></h3>
<p><strong>Kenapa:</strong> Menangkap pola yang tidak ada di transaksi (app usage, komplain).</p>
<p><strong>Contoh nyata:</strong> CLV 90 hari untuk targeting kampanye; telco dengan data usage.</p>
</div>
<div className="decision-card">
<h3>4. Butuh jawaban hari ini untuk alokasi budget → <strong>CLV heuristik: segmen RFM × margin × umur</strong></h3>
<p><strong>Kenapa:</strong> 80% manfaat dengan 20% usaha. Model sempurna bulan depan kalah dari heuristik hari ini.</p>
<p><strong>Contoh nyata:</strong> Batas CAC per segmen untuk rapat budget minggu ini.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Nilai = masa depan</strong>, bukan historis.</li><li><strong>Recency &gt; frequency</strong> untuk tebak &lsquo;masih hidup&rsquo;.</li><li><strong>CLV selalu berpasangan dengan batas CAC</strong> (÷3).</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Channel &ldquo;Termahal&rdquo; yang Ternyata Termurah</h3>
<p>Marketplace &ldquo;SerbaAda&rdquo;: CAC Google Search Rp350rb, CAC TikTok Rp120rb. Laporan bulanan selalu memuji TikTok (&ldquo;murah!&rdquo;) dan mempertanyakan Search (&ldquo;mahal, potong?&rdquo;). Lalu analis menghitung <strong>CLV per channel</strong>: pelanggan Search → CLV Rp1,4jt (rasio 4,0); pelanggan TikTok → CLV Rp280rb (rasio 2,3 — mereka pemburu diskon, churn 3x lipat).</p>
<p>Keputusan: <strong>tambah</strong> budget Search (batas CAC = 1,4jt/3 = Rp467rb — masih ada ruang!), <strong>kebiri</strong> TikTok untuk akuisisi (pakai hanya untuk retargeting murah). Setahun kemudian: revenue naik 40% dengan budget <strong>tetap</strong> — karena budget pindah dari pelanggan murah-beracun ke pelanggan mahal-sehat.</p>
<p><strong>Pelajaran:</strong> CAC tanpa CLV = harga tanpa nilai. <strong>Channel termurah sering kali termahal</strong> — ia murah karena menjual pelanggan sampah. Satu-satunya metrik channel yang benar: <strong>CLV:CAC per channel</strong>.</p>
<h3>Kisah 2: Diskon yang Memakan CLV-nya Sendiri</h3>
<p>Brand fashion &ldquo;KalaKini&rdquo;: voucher 30% untuk pelanggan lama menaikkan repeat purchase 25%. Dirayakan. Setahun kemudian CLV segmen voucher turun <strong>30%</strong>: pelanggan <strong>terlatih menunggu diskon</strong> — margin per transaksi turun permanen, frekuensi &ldquo;normal&rdquo; (tanpa voucher) anjlok.</p>
<p>Analisis kohor: pelanggan yang <em>tidak pernah</em> dapat voucher → CLV Rp900rb. Yang dapat voucher 1x → Rp750rb. Yang dapat 3x+ → <strong>Rp480rb</strong>. Voucher bukan &ldquo;investasi retensi&rdquo; — ia <strong>pajak yang dibayar selamanya</strong> untuk kenaikan sesaat.</p>
<p><strong>Pelajaran:</strong> ukur CLV <strong>per kohor perlakuan</strong>, bukan rata-rata. Promosi yang &ldquo;berhasil&rdquo; di metrik jangka pendek bisa menjadi <strong>kecanduan margin</strong> jangka panjang. Obatnya: voucher <strong>berbatas</strong> (sekali, untuk aktivasi) — bukan program permanen.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;CLV tinggi = pelanggan setia = bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> CLV tinggi dari <strong>margin tinggi + retention tinggi</strong> = bagus. CLV tinggi dari <strong>frekuensi tinggi + margin tipis + diskon terus</strong> = pelanggan yang sibuk tapi tidak menguntungkan — seperti restoran penuh setiap hari tapi rugi per piring. Selalu pecah CLV menjadi komponennya: <strong>dari mana datangnya?</strong></p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Channel Mana yang Boleh Mahal?</h2>
<div className="callout">
<p>LakuKeras: CLV 12 bulan per channel akuisisi — Organik Rp4,2jt; Search Rp3,1jt; Sosmed Rp1,8jt; Agregator diskon Rp0,9jt. CAC aktual: Organik Rp200rb; Search Rp800rb; Sosmed Rp900rb; Agregator Rp400rb. Budget total Rp1M/bln, direksi minta &ldquo;efisiensi&rdquo;.</p>
<p><strong>Pertanyaan:</strong> (a) Hitung rasio CLV:CAC tiap channel — mana yang sehat? (b) Jika harus potong Rp300jt, dari mana? (c) Channel mana yang boleh dinaikkan budget-nya?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Rasio:</strong> Organik 21,0 (4,2jt/200rb) — sangat sehat; Search 3,9 — sehat; Sosmed 2,0 — marginal; Agregator 2,25 — marginal. Batas CAC sehat (=CLV/3): organik Rp1,4jt; search Rp1,03jt; sosmed Rp600rb; agregator Rp300rb.</p>
<p>(b) <strong>Potong dari agregator diskon</strong> (Rp400rb CAC vs batas Rp300rb = sudah rugi; CLV cuma Rp0,9jt) dan <strong>sosmed</strong> (CAC Rp900rb vs batas Rp600rb). Keduanya di atas batas sehat.</p>
<p>(c) <strong>Organik &amp; search</strong> — masih jauh di bawah batas CAC sehat. Naikkan bertahap sambil pantau CAC marginal (CAC naik saat scale — hukum diminishing return).</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — CLV cepat.</strong> Margin Rp80rb/bln, retention 85%/bln, discount 1%/bln. (a) CLV naif. (b) CLV dengan diskon. (c) Batas CAC per versi.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>(a) Naif: 80rb × 0,85/0,15 = 80rb × 5,67 = <strong>Rp453.333</strong>.</p>
<p>(b) Diskon: 80rb × 0,85/(1,01 − 0,85) = 80rb × 0,85/0,16 = 80rb × 5,3125 = <strong>Rp425.000</strong>.</p>
<p>(c) Batas CAC: naif Rp151.111 vs diskon <strong>Rp141.667</strong>. Selisih ~Rp10rb/pelanggan — kecil per orang, besar di skala 100.000 pelanggan (Rp1 miliar keputusan!).</p>
</details>
<p><strong>Soal 2 — BG/NBD.</strong> Tenure 200 hari. P: 8x beli, terakhir 10 hari lalu. Q: 8x beli, terakhir 120 hari lalu. Siapa P(alive)-nya lebih tinggi? Jika biaya win-back Rp75rb, margin/transaksi Rp40rb, rate 0,3x/bln — untuk siapa voucher dikirim? (Asumsi P(alive): P=90%, Q=25%.)</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>P(alive): <strong>P (90%)</strong> — polanya normal (biasa beli tiap 25 hari, terakhir 10 hari lalu = tepat waktu). Q terlambat parah (biasa 25 hari, sudah 120 hari) → kemungkinan besar mati.</p>
<p>Expected value 3 bulan: P = 0,9 × 0,3 × 3 × 40rb = <strong>Rp32.400</strong> &lt; Rp75rb → <strong>jangan kirim juga!</strong> Q = 0,25 × 0,3 × 3 × 40rb = Rp9.000 → jangan.</p>
<p><strong>Twist:</strong> keduanya tidak layak voucher — P karena <em>tidak butuh</em> (dia akan beli sendiri), Q karena <em>tidak akan kembali</em>. Inilah bedanya <strong>risiko</strong> vs <strong>uplift</strong> (MK11): yang &ldquo;berisiko&rdquo; (Q) belum tentu yang &ldquo;bisa diselamatkan&rdquo;.</p>
</details>
<p><strong>Soal 3 — CLV per channel.</strong> Channel A: CAC Rp200rb, margin Rp50rb/bln, r=0,9. Channel B: CAC Rp100rb, margin Rp50rb/bln, r=0,75. (a) CLV &amp; rasio tiap channel. (b) Budget Rp100jt — alokasi?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>(a) A: CLV = 50rb × 0,9/0,1 = <strong>Rp450rb</strong>, rasio = 450/200 = <strong>2,25</strong>. B: CLV = 50rb × 0,75/0,25 = <strong>Rp150rb</strong>, rasio = 150/100 = <strong>1,5</strong>.</p>
<p>(b) <strong>Keduanya di bawah 3!</strong> Jawaban yang benar: <strong>jangan alokasikan dulu</strong> — perbaiki produk/retention dulu, atau cari channel C. Jika <em>terpaksa</em> pilih: A (2,25 &gt; 1,5) — channel &ldquo;mahal&rdquo; mengalahkan channel &ldquo;murah&rdquo;. Pelajaran: rasio, bukan harga.</p>
</details>
<p><strong>Soal 4 — Retention tak-konstan.</strong> r bulan 1–3 = 0,6; bulan 4+ = 0,9. Margin Rp100rb/bln. Estimasi umur harapan &amp; CLV naif (tanpa diskon). Bandingkan dengan asumsi r konstan 0,8.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>Umur harapan = (0,6 + 0,36 + 0,216) + 0,216 × (0,9/0,1) = 1,176 + 1,944 = <strong>3,12 bulan</strong> → CLV = <strong>Rp312rb</strong>.</p>
<p>Asumsi konstan 0,8: umur = 0,8/0,2 = 4 bulan → CLV = <strong>Rp400rb</strong> — overestimasi <strong>28%</strong>!</p>
<p><strong>Pelajaran:</strong> churn tinggi di awal (seleksi alam pelanggan) membuat rumus konstan <strong>sistematis overestimasi</strong>. Jika onboarding-mu buruk, CLV naif-mu bohong — dan kebohongannya selalu ke arah &ldquo;terlihat lebih bagus&rdquo;.</p>
</details>
<div className="tip">
<p><strong>💡 Empat kalimat yang harus menempel di setiap angka CLV yang kamu sajikan: (1) &ldquo;dengan asumsi retention konstan X&rdquo;, (2) &ldquo;discount Y%&rdquo;, (3) &ldquo;margin yang dipakai margin kotor&rdquo;, (4) &ldquo;berlaku untuk segmen Z&rdquo;. Tanpa empat kalimat ini, CLV-mu bukan analisis — ia dongeng.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Pak Budi: historis Rp20jt, terakhir beli 2 thn lalu. Bu Ani: historis Rp8jt, beli tiap bulan. Siapa VIP menurut CLV?"}
  options={
    ["Pak Budi — historis lebih besar",
    "Bu Ani — P(alive) tinggi, CLV masa depan besar",
    "Keduanya sama",
    "Tidak bisa ditentukan"]
  }
  correct={1}
  explanation={"Benar: CLV menebak masa depan. Budi P(alive)≈3% → CLV≈0. Ani P(alive)≈92% → CLV Rp6,3jt. VIP berbasis historis = memberi karpet merah ke orang yang sudah pergi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Dalam BG/NBD, untuk menebak 'masih hidup', yang paling menentukan?"}
  options={
    ["Frequency tinggi",
    "Recency (t_x dekat T)",
    "Umur T yang panjang",
    "Ketiganya sama"]
  }
  correct={1}
  explanation={"Benar: recency mengalahkan frequency. t_x ≈ T → kemungkinan besar masih hidup, berapa pun x-nya. Inilah intuisi yang dikuantifikasi model."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. CLV 12 bulan Rp3,2jt. Berapa CAC maksimal yang sehat?"}
  options={
    ["Rp3,2jt",
    "Rp1,07jt (CLV/3)",
    "Rp6,4jt",
    "Rp320rb"]
  }
  correct={1}
  explanation={"Benar: aturan LTV:CAC ≥ 3 → CAC ≤ CLV/3 ≈ Rp1,07jt. CLV tanpa batas CAC = angka pajangan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Kapan pendekatan ML lebih tepat dari BG/NBD?"}
  options={
    ["Selalu — lebih modern",
    "Ada sinyal non-transaksional kuat + horizon spesifik, dan terbukti menang di validasi out-of-time",
    "Data sedikit",
    "Tidak pernah"]
  }
  correct={1}
  explanation={"Benar: ML menang saat fitur tambahan (app, CS) membawa sinyal baru. Tanpa itu, BG/NBD (3 angka!) sering menang — selalu jadikan benchmark dulu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Distribusi CLV miring kanan. Implikasi untuk alokasi budget?"}
  options={
    ["Pakai CLV rata-rata untuk semua",
    "Alokasi per segmen CLV — rata-rata menutupi ekor bernilai",
    "Fokus ke CLV terendah",
    "Abaikan CLV"]
  }
  correct={1}
  explanation={"Benar: rata-rata didominasi segelintir Sultan. Keputusan CAC per segmen menangkap ini; satu angka rata-rata membuat channel 'mahal tapi berisi Sultan' terlihat rugi."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: CLV yang Menyelamatkan Rp2 Miliar Budget</h2>
<p>Telko &ldquo;NusaCell&rdquo;: 1 juta pelanggan prabayar, ARPU Rp35rb/bln. CMO mengusulkan <strong>potong semua</strong> channel dengan CAC &gt; Rp100rb (&ldquo;efisiensi!&rdquo;). Kamu diminta memeriksa dengan CLV — sebelum Rp2 miliar budget dialihkan.</p>
<h3>Langkah 1 — CLV per segmen isi ulang</h3>
<p>Data: segmen &ldquo;Data Berat&rdquo; (30%): ARPU Rp60rb, churn 5%/bln, margin 45%. Segmen &ldquo;Nelpon Saja&rdquo; (50%): ARPU Rp20rb, churn 12%/bln, margin 45%. Segmen &ldquo;Musiman&rdquo; (20%): ARPU Rp35rb, churn 25%/bln, margin 45%.</p>
<p>CLV: Data Berat = 60rb × 0,45/0,05 = <strong>Rp540rb</strong>. Nelpon = 20rb × 0,45/0,12 = <strong>Rp75rb</strong>. Musiman = 35rb × 0,45/0,25 = <strong>Rp63rb</strong>.</p>
<h3>Langkah 2 — Batas CAC per segmen</h3>
<p>Data Berat: 540rb/3 = <strong>Rp180rb</strong>. Nelpon: <strong>Rp25rb</strong>. Musiman: <strong>Rp21rb</strong>. Usulan CMO (&ldquo;potong CAC &gt; Rp100rb&rdquo;) akan <strong>membunuh</strong> channel yang mengakuisisi Data Berat (CAC Rp120–150rb, rasio 3,6–4,5 — SEHAT!) sambil <strong>melindungi</strong> channel Nelpon (CAC Rp30rb terlihat &ldquo;murah&rdquo; padahal rasio 2,5 — dan batasnya cuma Rp25rb!).</p>
<h3>Langkah 3 — Simulasi usulan CMO</h3>
<p>Jika usulan jalan: kehilangan 60% akuisisi Data Berat (CLV 540rb) untuk menghemat CAC Rp150rb — <strong>menghemat Rp150rb untuk kehilangan Rp540rb</strong>. Net: −Rp390rb per pelanggan yang tidak diakuisisi. Dalam setahun (50.000 akuisisi Data Berat hilang): <strong>−Rp19,5 miliar</strong> nilai masa depan — demi &ldquo;efisiensi&rdquo; Rp7,5 miliar.</p>
<h3>Langkah 4 — Usulan tandingan</h3>
<div className="callout">
<p><strong>What:</strong> Aturan &ldquo;CAC &gt; Rp100rb dipotong&rdquo; memotong segmen paling berharga (CLV Rp540rb) dan melindungi yang beracun.</p>
<p><strong>So what:</strong> Efisiensi tanpa CLV = <strong>diet yang memotong otot, bukan lemak</strong>.</p>
<p><strong>Now what:</strong> (1) Ganti aturan jadi <strong>batas CAC per segmen</strong> (180rb/25rb/21rb). (2) <strong>Naikkan</strong> budget channel Data Berat sampai CAC menyentuh Rp180rb. (3) Potong channel Nelpon/Musiman di atas batasnya. Proyeksi: budget sama, nilai akuisisi <strong>+35%</strong>.</p>
</div>
<p><strong>Intuisi penutup:</strong> CLV bukan metrik — ia <strong>kacamata</strong>. Tanpa kacamata ini, &ldquo;efisiensi&rdquo; terlihat heroik padahal bunuh diri. Dengan kacamata ini, channel &ldquo;mahal&rdquo; Rp150rb ternyata murah, dan channel &ldquo;murah&rdquo; Rp30rb ternyata mahal.</p>

<h2 id="jebakan">🪤 Galeri Jebakan Analis CLV</h2>
<h3>Jebakan 1: Revenue, bukan margin</h3>
<p>CLV = ARPU/churn (tanpa margin). E-commerce margin 20%: CLV terlihat <strong>5x</strong> dari yang benar. <strong>Deteksi:</strong> tanya &ldquo;margin-nya di mana?&rdquo; Tidak ada = bagi 5 (atau berapapun 1/margin) di kepalamu.</p>
<h3>Jebakan 2: Churn tahunan untuk keputusan bulanan</h3>
<p>Churn 40%/tahun → dipakai r=0,6/bulan?? Salah: churn tahunan 40% ≈ churn bulanan <strong>4,2%</strong> (1 − 0,6^(1/12)). CLV dengan r=0,6 vs r=0,958 = beda <strong>24x</strong>. <strong>Deteksi:</strong> selalu samakan periode churn dengan periode margin.</p>
<h3>Jebakan 3: CLV rata-rata untuk batas CAC</h3>
<p>Rata-rata CLV Rp300rb → batas CAC Rp100rb untuk semua. Padahal segmen A CLV Rp900rb (batas 300rb), segmen B Rp90rb (batas 30rb). Aturan rata-rata = <strong>terlalu ketat untuk A, terlalu longgar untuk B</strong>. <strong>Deteksi:</strong> batas CAC harus per segmen, selalu.</p>
<h3>Jebakan 4: Mengabaikan biaya retensi</h3>
<p>CLV dihitung dari margin kotor — tapi mempertahankan pelanggan butuh <strong>biaya retensi</strong> (voucher, CS, loyalty). CLV bersih = margin − biaya retensi per periode. <strong>Deteksi:</strong> tanya &ldquo;biaya mempertahankan mereka sudah dikurangi?&rdquo;</p>
<h3>Jebakan 5: CLV historis = CLV masa depan</h3>
<p>&ldquo;Kohor 2020 CLV-nya Rp500rb, jadi kohor 2026 juga.&rdquo; Padahal: kompetisi naik, harga turun, churn naik. <strong>Deteksi:</strong> CLV untuk keputusan = <strong>proyeksi</strong> (dengan tren), bukan sejarah. Sejarah = titik awal, bukan jawaban.</p>
<div className="tip">
<p><strong>💡 Lima jebakan, satu obat: pecah CLV jadi komponen (margin × retention × discount) dan periksa tiap komponen — periode, definisi, segmen, tren. CLV yang tidak bisa dipecah = CLV yang tidak bisa dipercaya.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Tabel CLV per Segmen per Channel</h2>
<p>Artefak terpenting MK5: satu tabel yang menjadi <strong>aturan main budget</strong> seluruh perusahaan.</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Segmen</th><th>CLV</th><th>Batas CAC (CLV/3)</th><th>Channel lolos</th><th>Channel terlarang</th></tr></thead>
<tbody>
<tr><td>Data Berat</td><td>Rp540rb</td><td><strong>Rp180rb</strong></td><td>Search (150rb), Komunitas (90rb)</td><td>Display (220rb)</td></tr>
<tr><td>Nelpon Saja</td><td>Rp75rb</td><td><strong>Rp25rb</strong></td><td>SMS blast (15rb)</td><td>Search, Sosmed</td></tr>
<tr><td>Musiman</td><td>Rp63rb</td><td><strong>Rp21rb</strong></td><td>Organik</td><td>Semua berbayar</td></tr>
</tbody>
</table>
</div>
<p><strong>Cara memakai:</strong> (1) Tempel di dinding ruang growth. (2) Setiap proposal channel baru: &ldquo;CAC-nya berapa? Untuk segmen apa? Lolos batas?&rdquo; — tiga pertanyaan, 2 menit, keputusan. (3) Review kuartalan: CLV dihitung ulang (tren berubah!). <strong>Tabel ini kedaluwarsa</strong> — seperti susu, bukan seperti madu.</p>
<details className="worked">
<summary>📐 Contoh: Memakai tabel untuk menolak proposal (klik untuk buka)</summary>
<p>Proposal: &ldquo;Iklan TV untuk segmen Nelpon Saja, CAC Rp80rb, jangkauan 10 juta!&rdquo;</p>
<p><strong>Langkah 1:</strong> Buka tabel → batas CAC Nelpon = Rp25rb.</p>
<p><strong>Langkah 2:</strong> 80rb &gt; 25rb → <strong>ditolak dalam 30 detik</strong>, dengan alasan tertulis.</p>
<p><strong>Langkah 3 (yang penting):</strong> tawarkan alternatif — &ldquo;TV untuk Data Berat? Batasnya Rp180rb — jika CAC TV &lt; 180rb untuk segmen itu, saya dukung.&rdquo; Menolak tanpa alternatif = dianggap penghambat; menolak <strong>dengan</strong> alternatif = dianggap partner.</p>
</details>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: CLV pelanggan yang sudah churn — masih dihitung?</strong><br/>A: Untuk <strong>valuasi</strong> (berapa nilai base saat ini): ya, dengan P(alive)≈0 → kontribusi ~0. Untuk <strong>keputusan akuisisi</strong>: tidak — yang relevan CLV <em>prospektif</em> kohor baru. Campur keduanya = salah pakai.</p>
<p><strong>Q2: Pelanggan B2B dengan kontrak 3 tahun — CLV-nya?</strong><br/>A: Lebih mudah: CLV = Σ margin tahun 1–3 yang didiskon × probabilitas renewal. Tidak perlu BG/NBD — churn <strong>teramati</strong> (tidak renewal = churn). Justru tantangannya: probabilitas renewal &amp; ekspansi (upsell) — modelkan terpisah.</p>
<p><strong>Q3: CLV negatif — mungkin?</strong><br/>A: Sangat. Pelanggan yang CS-nya mahal + return terus + bayar pakai promo: margin − biaya layani &lt; 0. <strong>Keputusan:</strong> jangan &ldquo;mempertahankan&rdquo; — biarkan churn (atau naikkan harga/friction). Mempertahankan pelanggan negatif = amal yang tidak disengaja.</p>
<p><strong>Q4: Berapa sering hitung ulang CLV?</strong><br/>A: <strong>Kuartalan</strong> untuk tabel batas CAC; <strong>bulanan</strong> untuk monitoring tren; <strong>segera</strong> setelah perubahan besar (pricing, produk, kompetitor masuk). CLV bukan konstanta — ia seperti prakiraan cuaca: makin tua, makin basi.</p>
<p><strong>Q5: CLV vs LTV — beda?</strong><br/>A: Sering dipakai bergantian. Ketatnya: <strong>LTV</strong> = nilai historis/observasi; <strong>CLV</strong> = nilai <em>prediksi</em> masa depan (customer <em>lifetime</em> value ke depan). Di lesson ini kita memakai CLV untuk keduanya demi kesederhanaan — yang penting konsisten + cantumkan asumsi.</p>
<p><strong>Q6: Startup pre-revenue / belum ada churn history?</strong><br/>A: Pakai <strong>benchmark + skenario</strong>: &ldquo;jika churn 10% → CLV X; jika 20% → Y&rdquo;. CLV sebagai <strong>rentang</strong>, bukan titik. Dan tetapkan tanggal: &ldquo;akan dihitung ulang setelah 1.000 pelanggan × 3 bulan&rdquo;.</p>
<p><strong>Q7: CLV untuk produk gratis (freemium)?</strong><br/>A: CLV = P(konversi ke paid) × CLV paid − biaya layani free user. Pengguna gratis <strong>bukan</strong> CLV nol — mereka punya <strong>opsi</strong> konversi + nilai referral. Tapi jangan terlalu romantis: jika P(konversi) 0,5%, CLV-nya memang mendekati nol.</p>
<p><strong>Q8: Satu angka CLV untuk lapor ke direksi?</strong><br/>A: Jangan satu angka — berikan <strong>tiga</strong>: CLV rata-rata tertimbang (konteks), CLV per segmen kunci (keputusan), dan <strong>tren</strong> (naik/turun?). Direksi yang hanya dapat satu angka akan membuat satu keputusan yang salah.</p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Satu Rumus</h2>
<h3>Kasus A: Kopi langganan &ldquo;SeduhRutin&rdquo; (5.000 pelanggan, Rp150rb/bln)</h3>
<p>Margin 50%, churn 8%/bln. Kompetitor bakar uang dengan CAC Rp400rb. Ikut?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p>CLV = 150rb × 0,5/0,08 = <strong>Rp937.500</strong>. Batas CAC = <strong>Rp312.500</strong>.</p>
<p><strong>Keputusan: jangan ikut Rp400rb.</strong> Tapi jangan diam: kompetitor dengan CAC 400rb dan CLV sama = rasio 2,3 — mereka <strong>berdarah</strong>. Strategi: bertahan 6 bulan, ambil pelanggannya saat mereka kehabisan kas (program &ldquo;pindah langganan&rdquo; dengan CAC Rp150rb via referral). <strong>CLV memberitahumu kapan harus diam — dan itu sama berharganya dengan tahu kapan menyerang.</strong></p>
</details>
<h3>Kasus B: Aplikasi parkir &ldquo;ParkirKu&rdquo; (freemium, 200.000 pengguna gratis)</h3>
<p>Konversi ke premium 2%, premium Rp30rb/bln, churn premium 5%/bln, margin 70%. Biaya layani free user Rp500/bln. Berapa CLV rata-rata per pendaftar? Layak bayar CAC Rp25rb untuk akuisisi free user?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — CLV premium:</strong> 30rb × 0,7/0,05 = <strong>Rp420rb</strong>.</p>
<p><strong>Langkah 2 — Expected value per pendaftar:</strong> 0,02 × 420rb = Rp8.400 — <strong>minus</strong> biaya layani: free user hidup rata-rata ~10 bulan × Rp500 = Rp5.000 → net <strong>Rp3.400</strong>.</p>
<p><strong>Langkah 3 — Verdict:</strong> CAC Rp25rb &gt;&gt; Rp3.400 → <strong>JANGAN</strong> bayar untuk akuisisi free user. Fokus: naikkan konversi 2%→4% (menggandakan CLV per pendaftar) ATAU turunkan biaya layani. <strong>Pelajaran:</strong> freemium tanpa hitungan ini = sumur tanpa dasar.</p>
</details>
<h3>Kasus C: Klinik gigi &ldquo;SenyumKu&rdquo; (pasien datang 2x/tahun)</h3>
<p>Margin Rp400rb/kunjungan, 2 kunjungan/tahun, &ldquo;churn&rdquo; (pindah klinik) 20%/tahun, discount 12%/tahun. Berapa CLV? Berapa boleh bayar untuk program rujukan per pasien baru?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p>Margin/tahun = 800rb. CLV = 800rb × 0,8/(1,12 − 0,8) = 800rb × 0,8/0,32 = 800rb × 2,5 = <strong>Rp2jt</strong>. Batas CAC = <strong>Rp667rb</strong>.</p>
<p><strong>Keputusan:</strong> program rujukan Rp300rb/pasien baru (voucher untuk perujuk + yang dirujuk) <strong>layak</strong> — di bawah batas, dan pasien rujukan biasanya churn <strong>lebih rendah</strong> (ada ikatan sosial) → CLV riil lebih tinggi. <strong>Pelajaran:</strong> CLV untuk jasa lokal sering <strong>mengejutkan besar</strong> — Rp2jt membenarkan marketing yang terlihat &ldquo;mahal&rdquo; untuk ukuran UMKM.</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Membela Batas CAC</h2>
<p><strong>CMO:</strong> &ldquo;Aturan CLV/3 terlalu konservatif. Kompetitor berani CAC = CLV/2. Kita kalah agresif!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;CLV/3 bukan konservatif — ia <strong>buffer untuk ketidakpastian</strong>. CLV kita dihitung dengan asumsi retention konstan; jika churn naik 2 poin (sangat mungkin saat scale ke segmen baru), CLV turun 20%. CLV/2 tanpa buffer = <strong>taruhan bahwa asumsi kita sempurna</strong>. Kita boleh pakai CLV/2,5 — <strong>jika</strong> kita ukur ulang CLV tiap bulan dan siap memotong dalam 30 hari. Mau ambil risiko itu dengan monitoring mingguan?&rdquo;</p>
<p><strong>CMO:</strong> &ldquo;...tetap CLV/3 saja. Tapi untuk segmen Data Berat naikkan jadi /2,5 dengan monitoring bulanan.&rdquo;</p>
<p><strong>Kamu (dalam hati):</strong> <em>Itulah gunanya buffer yang bisa dijelaskan — ia menjadi alat negosiasi, bukan dogma.</em></p>
<div className="tip">
<p><strong>💡 Aturan main seperti CLV/3 harus bisa kamu <em>bela dengan angka</em> dan <em>longgarkan dengan syarat</em>. Aturan yang kaku = dilanggar diam-diam; aturan yang fleksibel dengan syarat = dipatuhi. Analis hebat menulis aturan yang hidup.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>CLV</strong> = nilai masa depan yang didiskon, bukan total historis. Rumus dasar: m·r/(1+d−r).</li>
<li><strong>Kontrak vs non-kontrak</strong>: churn teramati vs &lsquo;pergi diam-diam&rsquo; (butuh model probabilistik).</li>
<li><strong>BG/NBD</strong>: dari (x, t_x, T) → P(alive) + prediksi transaksi. Recency mengalahkan frequency.</li>
<li><strong>Gamma-Gamma</strong>: prediksi nilai per transaksi. CLV = E[transaksi] × E[nilai] × margin.</li>
<li><strong>ML</strong>: untuk sinyal non-transaksional + horizon spesifik; harus kalahkan BG/NBD dulu di validasi.</li>
<li><strong>CLV selalu berpasangan dengan batas CAC</strong> (÷3) — tanpa itu, CLV cuma pajangan.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk4-segmentasi" className="btn btn-secondary btn-sm">← MK4</Link>
        <Link href="/learn/mk6-churn" className="btn btn-primary btn-sm">MK6 →</Link>
      </div>
    </div>
  );
}

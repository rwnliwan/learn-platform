"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk3DeskriptifPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK3 — Marketing Data Analytics</span>
        <h1 className="display-title">Analitik Deskriptif:<br/>Funnel, Cohort, dan RFM</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: 'Retention Kami 40%' — Benarkah?</a></li>
<li><a href="#funnel2">Funnel Analytics Lanjutan</a></li>
<li><a href="#cohort">Cohort Retention</a></li>
<li><a href="#rfm">Segmentasi RFM</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Ketika Satu Angka Berbohong</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: 5% Champions, 40% Revenue</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Membedah "Retention 40%" sampai ke Akarnya</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Deskriptif</a></li>
<li><a href="#extra3">📋 Playbook: Laporan Kohor 1 Halaman</a></li>
<li><a href="#extra4">💬 Simulasi Rapat: Mempertahankan Angka Jujur</a></li>
<li><a href="#kit">🧰 Kit Kerja: Audit Deskriptif 30 Menit</a></li>
<li><a href="#tambahan-faq">❓ FAQ Analitik Deskriptif</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Sari Rasa</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menghitung drop-off dan time-to-convert antar tahap funnel per segmen/channel.</li>
<li>Membangun cohort retention table dan membaca kurva retensi (kapan retensi 'matang').</li>
<li>Menghitung skor RFM dan memetakan pelanggan ke segmen aksi (Champions, At Risk, Hibernating...).</li>
<li>Memilih lensa yang tepat (funnel vs cohort vs RFM) untuk tiap pertanyaan bisnis.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: 'Retention Kami 40%' — Benarkah?</h2>
      <div className="story">
        <p>CEO <em>&ldquo;SehatQ&rsquo;&rdquo;</em> (aplikasi kesehatan) bangga mengumumkan <em>&ldquo;retention kami 40%!&rdquo;</em> ke investor. Analis baru, Dita, mengangguk — lalu malamnya membongkar angka itu. Ternyata 40% adalah <strong>rata-rata</strong> dari: cohort Januari 55% (pengguna awal yang fanatik) dan cohort Juni <strong>18%</strong> (hasil kampanye diskon besar-besaran yang mendatangkan pemburu promo).</p>
<p>Twist-nya: retention <strong>agregat menutupi kemunduran</strong>. Produk sebenarnya makin buruk mempertahankan pengguna baru — tapi angka rata-rata terlihat stabil karena cohort lama yang besar menutupi. Dita mengganti satu angka dengan <strong>cohort table</strong>, dan rapat berikutnya berubah total: fokus dari &ldquo;tambah user&rdquo; menjadi &ldquo;perbaiki onboarding cohort baru&rdquo;. Lesson ini tentang tiga lensa yang membuat angka marketing jujur.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="funnel2">Funnel Analytics — Bukan Sekadar Corong</h2>
<p><strong>Definisi.</strong> Di MK1 kamu menghitung conversion antar-tahap. Lanjutannya: <strong>drop-off absolut vs relatif</strong> (hilang 6.800 orang vs hilang 85% — keduanya penting), <strong>time-to-convert</strong> (berapa lama dari tahap A ke B; median, bukan mean — distribusinya skew), dan <strong>funnel per segmen</strong> (per channel, per device, per cohort — bottleneck tiap segmen bisa beda).</p>
<p>Dua jebakan: (1) <strong>jendela waktu</strong> — funnel &ldquo;daftar → beli dalam 7 hari&rdquo; vs &ldquo;30 hari&rdquo; memberi conversion beda; pilih jendela sesuai siklus belimu. (2) <strong>urutan longgar</strong> — user boleh lompat tahap (langsung beli tanpa daftar via guest checkout); funnel kaku meremehkan conversion.</p>
<Tex math={String.raw`\text{Drop-off}_t = N_t - N_{t+1} \quad;\quad \text{Drop-off \%}_t = 1 - CR_{t \to t+1}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Drop-off absolut (orang): untuk sizing masalah — &lsquo;6.800 orang hilang&rsquo; menggerakkan tim</li>
<li>Drop-off % : untuk prioritas — tahap dengan % terbesar = bocor terbesar</li>
<li>Time-to-convert: median hari dari tahap t ke t+1 (pakai median karena ada yang convert 1 jam, ada yang 90 hari)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Funnel agregat itu seperti <strong>foto grup</strong>: semua orang terlihat, tidak ada yang jelas. Funnel per segmen = <strong>foto close-up</strong>: baru kelihatan siapa yang tersenyum dan siapa yang mengantuk. Selalu pecah funnel minimal per channel akuisisi — channel diskon vs organik conversion-nya beda dunia.</p>
<p><strong>Kapan dipakai:</strong> Untuk diagnosis &lsquo;di mana hilangnya&rsquo; dan &lsquo;berapa lama mereka mikir&rsquo;. Selalu dengan jendela waktu eksplisit.</p>
<details className="worked">
<summary>📐 Contoh: Time-to-convert checkout (klik untuk buka)</summary>
<p>Data 1.000 checkout: 600 convert &lt; 1 hari, 250 convert 1–7 hari, 100 convert 8–30 hari, 50 convert &gt; 30 hari.</p>
<p><strong>Median</strong> time-to-convert ≈ <strong>1 hari</strong> (600 dari 1.000 sudah convert di hari pertama). <strong>Mean</strong> ≈ 6,5 hari — ditarik 50 orang yang mikir 60 hari.</p>
<p>Implikasi: jendela atribusi 7 hari menangkap 850/1.000 = 85%. Email reminder &ldquo;lupa checkout&rdquo; paling efektif dikirim di <strong>hari ke-2</strong> (menangkap 250 yang masih hangat), bukan hari ke-7.</p>
</details>
<PlotlyChart
  data={[{x: ["Organik", "Iklan search", "Iklan sosmed", "Influencer", "Diskon agregator"], y: [0.32, 0.28, 0.15, 0.12, 0.06], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#e8a838","#e8a838","#ef4444"]}, text: ["32%","28%","15%","12%","6%"], textposition: "outside"}]}
  title={"Conversion daftar → beli per channel (jendela 30 hari)"}
  layout={{yaxis: {title: "Conversion"}, xaxis: {title: "Channel akuisisi"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = channel tempat user pertama datang, tinggi batang = % yang akhirnya beli dalam 30 hari. Warna menandai tier kualitas.</p>
<p><strong>Interpretasi:</strong> Organik &amp; search (28–32%) 5x lipat dari diskon agregator (6%). Funnel agregat (mis. 18%) menyembunyikan ini — dan budget yang &lsquo;rata-rata&rsquo; akan over-invest di channel sampah. Keputusan: potong agregator, tambah search.</p>
</div>
<h2 id="cohort">Cohort Retention — Satu Angka Berbohong, Tabel Berkata Jujur</h2>
<p><strong>Definisi.</strong> <strong>Cohort</strong> = sekelompok pengguna yang &ldquo;lahir&rdquo; bersamaan (biasanya bulan install/daftar). <strong>Retention table</strong> = % cohort yang masih aktif di bulan ke-0, 1, 2, … <strong>Kurva retensi</strong> menurun curam di awal lalu <strong>melandai</strong> (<em>flatten</em>) — titik landai = <em>core retained users</em>, pengguna yang benar-benar tinggal.</p>
<p>Metrik: <strong>N-day retention</strong> (masih aktif tepat di hari ke-N), <strong>rolling retention</strong> (pernah aktif dalam N hari terakhir — lebih longgar), <strong>retention berulang</strong> (brazil: Day 1, Day 7, Day 30 — standar industri aplikasi).</p>
<Tex math={String.raw`R_{c,m} = \frac{\text{aktif dari cohort } c \text{ di bulan } m}{\text{ukuran cohort } c}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`R_{c,m}`} />: retention cohort c pada bulan ke-m (m=0 selalu 100%)</li>
<li>Ukuran cohort: jumlah user cohort itu di awal — retention selalu dibagi ini, bukan dibagi total user aktif</li>
<li>Bandingkan R antar cohort di m yang SAMA (bulan ke-3 vs bulan ke-3), bukan bulan kalender yang beda</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Cohort table seperti <strong>rapor per angkatan</strong>: angkatan 2020 vs 2024 nilainya bisa beda jauh walau &lsquo;rata-rata sekolah&rsquo; stabil. Kalau angkatan baru makin buruk, sekolahnya (produkmu) yang bermasalah — bukan muridnya.</p>
<p><strong>Kapan dipakai:</strong> Setiap ada klaim &lsquo;retention naik/turun&rsquo; — pecah per cohort dulu. Juga untuk menilai kualitas channel (cohort diskon vs organik).</p>
<details className="worked">
<summary>📐 Contoh: Membaca cohort table SehatQ (klik untuk buka)</summary>
<p>Cohort Jan: 100% → 55% → 48% → 45% (melandai di ~45%). Cohort Jun: 100% → 30% → 20% → 18% (melandai di ~18%).</p>
<p><strong>Baca:</strong> (1) Keduanya melandai — bagus, ada core users. (2) Level landai Jun (18%) jauh di bawah Jan (45%) — kualitas pengguna baru memburuk. (3) &ldquo;Rata-rata 40%&rdquo; CEO = rata-rata berbobot yang didominasi cohort lama yang besar.</p>
<p><strong>Tindakan:</strong> bukan tambah user (memperbesar masalah), tapi perbaiki minggu pertama cohort baru — di sanalah 70%→30% terjadi.</p>
</details>
<PlotlyChart
  data={[{z: [[100,55,48,45],[100,48,40,37],[100,38,30,27],[100,30,20,18]], x: ["M0","M1","M2","M3"], y: ["Cohort Jan","Cohort Mar","Cohort Mei","Cohort Jun"], type: "heatmap", colorscale: [[0,"#fee2e2"],[0.5,"#e8a838"],[1,"#2a7de1"]], text: [["100%","55%","48%","45%"],["100%","48%","40%","37%"],["100%","38%","30%","27%"],["100%","30%","20%","18%"]], texttemplate: "%{text}", showscale: false}]}
  title={"Cohort retention heatmap SehatQ"}
  layout={{xaxis: {title: "Bulan sejak install"}, yaxis: {title: ""}}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Baris = cohort (kapan install), kolom = umur cohort (bulan ke-0 s.d. 3). Warna biru = retensi tinggi, merah = rendah. Baca horizontal = perjalanan satu cohort; baca vertikal (kolom M3) = bandingkan kualitas antar cohort.</p>
<p><strong>Interpretasi:</strong> Pola jelas: makin ke bawah (cohort makin baru), warna makin merah di kolom M3 — 45% → 37% → 27% → 18%. <strong>Kualitas memburuk sistematis.</strong> Satu angka &lsquo;40%&rsquo; tidak pernah menunjukkan ini. Inilah kenapa cohort table adalah senjata utama analis retensi.</p>
</div>
<h2 id="rfm">RFM — Tiga Angka yang Mengenal Pelangganmu</h2>
<p><strong>Definisi.</strong> <strong>RFM</strong> menilai pelanggan dari tiga dimensi: <strong>Recency</strong> (kapan terakhir beli — makin baru makin baik), <strong>Frequency</strong> (berapa sering beli), <strong>Monetary</strong> (total belanja). Tiap dimensi di-skor 1–5 (kuintil), menghasilkan 125 kombinasi yang dipetakan ke segmen aksi: <strong>Champions</strong> (555), <strong>Loyal</strong>, <strong>Potential Loyalist</strong>, <strong>At Risk</strong> (baru-baru ini berhenti), <strong>Hibernating</strong>, <strong>Lost</strong>.</p>
<p>RFM itu <strong>deskriptif &amp; sederhana</strong> — kekuatannya: bisa dihitung dengan SQL, dimengerti tim marketing, dan langsung jadi aksi (kirim apa ke siapa). Kelemahannya: tidak melihat <em>tren</em> (R=5 tapi F menurun = bahaya yang tidak tertangkap).</p>
<p><strong>Kepribadian/intuisi:</strong> RFM seperti <strong>rapor kesehatan 3 panel</strong>: kapan terakhir olahraga (R), seberapa rutin (F), seberapa intens (M). Satu angka &lsquo;total belanja&rsquo; tidak bisa bedakan pelanggan setia yang baru cuti vs pelanggan yang sudah pindah ke kompetitor — RFM bisa.</p>
<p><strong>Kapan dipakai:</strong> Segmentasi cepat untuk kampanye (siapa dikirimi promo win-back?), prioritas CS, dan dasar sebelum clustering canggih (MK4).</p>
<details className="worked">
<summary>📐 Contoh: Dari skor ke aksi (klik untuk buka)</summary>
<p>Pelanggan A: R=5, F=5, M=5 → <strong>Champions</strong> — aksi: program referral, early access. Jangan kirimi diskon besar (mereka beli tanpa diskon!).</p>
<p>Pelanggan B: R=2, F=5, M=4 → <strong>At Risk</strong> — dulu rajin, sekarang hilang. Aksi: win-back personal (&ldquo;kami kangen&rdquo; + insentif), BUKAN blast promo generik.</p>
<p>Pelanggan C: R=5, F=1, M=1 → <strong>New</strong> — aksi: onboarding, edukasi produk, bukan upsell agresif.</p>
<p>Aturan: <strong>aksi mengikuti segmen</strong>, bukan sebaliknya. Blast promo yang sama ke Champions (margin bocor) dan Lost (uang terbuang) = dua kerugian sekaligus.</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,4,5,1,2,3,4,5], y: [1,1,2,2,3,4,4,5,5,3], mode: "markers+text", text: ["Lost","Hibernating","","","At Risk","New","","Potential","Loyal","Champions"], textposition: "top center", marker: {size: [12,14,12,16,18,12,12,14,16,22], color: ["#94a3b8","#94a3b8","#94a3b8","#e8a838","#e8a838","#2a7de1","#2a7de1","#2a7de1","#2a7de1","#16a34a"]}}]}
  title={"Peta RFM: Recency vs Frequency (ukuran = Monetary)"}
  layout={{xaxis: {title: "Recency score (1=lama, 5=baru)"}, yaxis: {title: "Frequency score (1=jarang, 5=sering)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = skor recency, Y = skor frequency, ukuran titik = monetary. Titik hijau besar di kanan atas = Champions; abu-abu kiri bawah = Lost.</p>
<p><strong>Interpretasi:</strong> Segmen mengelompok alami: Champions (kanan atas, besar), At Risk (kiri atas — dulu sering, sekarang hilang), Lost (kiri bawah). Peta ini = daftar target kampanye: At Risk butuh win-back <em>sekarang</em> (masih hangat), Lost butuh insentif besar atau dilepas.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Ketika Satu Angka Berbohong</h2>
<p>Deskriptif analytics terlihat sederhana — rata-rata, tabel, grafik. Justru di sinilah kebohongan paling mahal bersembunyi, karena <strong>angkanya benar secara matematis tapi salah secara makna</strong>. Tiga pendalaman: (1) mengapa retention &ldquo;40%&rdquo; bisa berarti tiga hal berbeda; (2) paradoks Simpson di funnel; (3) RFM: mengapa bobot skormu menentukan siapa yang kamu anggap &ldquo;berharga&rdquo;.</p>
<h3>1. &ldquo;Retention 40%&rdquo; — Tiga Definisi, Tiga Cerita</h3>
<p><strong>Definisi.</strong> <em>N-day retention</em> = % pengguna yang kembali pada hari ke-N setelah instalasi. <em>Unbounded retention</em> = % yang kembali <strong>kapan saja setelah</strong> hari ke-N. <em>Rolling retention</em> = % yang kembali <strong>pada atau setelah</strong> hari ke-N. Tiga definisi, tiga angka — dari <strong>data yang sama</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Bayangkan menanyai 100 teman: (a) &ldquo;apakah kamu datang <em>tepat</em> di hari ulang tahunku?&rdquo; (N-day — ketat), (b) &ldquo;apakah kamu <em>pernah</em> datang setelah ulang tahunku?&rdquo; (unbounded — longgar), (c) &ldquo;apakah kamu datang <em>di hari ulang tahun atau sesudahnya</em>?&rdquo; (rolling — tengah). Jawaban (b) selalu ≥ (c) ≥ (a). Startup yang pamer &ldquo;retention 40%&rdquo; tanpa menyebut definisi <strong>hampir pasti memakai yang paling longgar</strong>.</p>
<p><strong>Kapan dipakai:</strong> N-day untuk produk harian (aplikasi ojek, game); unbounded untuk produk jarang dipakai (travel, properti); rolling sebagai kompromi. Yang wajib: <strong>sebutkan definisinya setiap kali menyebut angkanya</strong>.</p>
<Tex math={String.raw`R_{N} \leq R_{rolling,N} \leq R_{unbounded,N}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`R_N`} /> = N-day retention; <Tex math={String.raw`R_{rolling,N}`} /> = rolling; <Tex math={String.raw`R_{unbounded,N}`} /> = unbounded. Ketidaksamaan ini <strong>selalu</strong> berlaku — kalau dashboard-mu melanggarnya, definisinya salah implementasi.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Satu kohor, tiga angka (klik untuk buka)</summary>
<p>Kohor 1.000 instal 1 Januari. Aktivitas: 250 orang aktif tepat 30 Jan; 400 orang aktif pada/setelah 30 Jan; 550 orang pernah aktif setelah 1 Jan (kapan saja).</p>
<p><strong>Langkah 1 — N-day (D30):</strong> 250/1.000 = <strong>25%</strong>.</p>
<p><strong>Langkah 2 — Rolling D30:</strong> 400/1.000 = <strong>40%</strong>.</p>
<p><strong>Langkah 3 — Unbounded:</strong> 550/1.000 = <strong>55%</strong>.</p>
<p><strong>Langkah 4 — Ketidaksamaan:</strong> 25% ≤ 40% ≤ 55% ✓.</p>
<p><strong>Pelajaran:</strong> &ldquo;retention kami 40%&rdquo; (rolling) vs &ldquo;retention kami 25%&rdquo; (N-day) — selisih 15 poin dari <strong>definisi</strong>, bukan dari produk. Saat investor/kompetitor menyebut angka tanpa definisi, anggap itu unbounded (yang terbesar) dan tanyakan N-day-nya.</p>
</details>
<h3>2. Paradoks Simpson di Funnel — Total Naik, Semua Segmen Turun</h3>
<p><strong>Definisi.</strong> <em>Paradoks Simpson</em>: tren di data gabungan <strong>berbalik</strong> saat dipecah per segmen. Di funnel: conversion total naik bulan ini — tapi conversion <strong>tiap channel</strong> turun. Penyebab: <strong>komposisi berubah</strong> (channel ber-conversion tinggi porsinya membesar).</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti nilai rata-rata kelas yang naik karena <strong>murid pintar pindah masuk</strong>, bukan karena siapa pun belajar lebih giat. Kepala sekolah yang merayakan &ldquo;metode baru berhasil!&rdquo; sedang merayakan <strong>demografi</strong>, bukan pedagogi. Di marketing: &ldquo;conversion naik&rdquo; karena kamu menambah budget ke channel yang memang selalu tinggi — <strong>bukan</strong> karena funnel-mu membaik.</p>
<p><strong>Kapan dipakai:</strong> Setiap kali metrik gabungan bergerak. Aturan: <strong>tidak ada perayaan sebelum cek per segmen</strong>.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Conversion naik yang menipu (klik untuk buka)</summary>
<p>Bulan lalu: Organik 8.000 visitor × 10% = 800; Iklan 2.000 × 2% = 40. Total = 840/10.000 = <strong>8,4%</strong>.</p>
<p>Bulan ini: Organik 8.000 × <strong>9%</strong> = 720 (turun!); Iklan 12.000 × <strong>1,8%</strong> = 216 (turun!). Total = 936/20.000 = <strong>4,68%</strong>... tunggu, ini turun. Mari buat yang naik: bulan ini Organik 18.000 × 9% = 1.620; Iklan 2.000 × 1,8% = 36. Total = 1.656/20.000 = <strong>8,28%</strong> — masih di bawah 8,4%. Hmm, butuh komposisi ekstrem: Organik 19.000 × 9% = 1.710; Iklan 1.000 × 1,8% = 18 → 1.728/20.000 = <strong>8,64% &gt; 8,4%</strong> ✓.</p>
<p><strong>Hasil:</strong> total <strong>naik</strong> 8,4% → 8,64%, tapi <strong>tiap channel turun</strong> (10%→9%, 2%→1,8%). &ldquo;Kemenangan&rdquo; ini 100% komposisi: porsi organik (yang memang tinggi) membesar.</p>
<p><strong>Keputusan yang benar:</strong> bukan &ldquo;funnel membaik, scale!&rdquo; tapi &ldquo;dua-duanya memburuk — investigasi per channel; kenaikan total adalah artefak bauran&rdquo;. Tanpa pecah segmen, kamu merayakan pembusukan.</p>
</details>
<h3>3. RFM — Bobot Skormu Menentukan Siapa yang &ldquo;Berharga&rdquo;</h3>
<p><strong>Definisi.</strong> RFM = <strong>Recency</strong> (kapan terakhir beli), <strong>Frequency</strong> (berapa sering), <strong>Monetary</strong> (berapa banyak). Masing-masing di-skor 1–5 (quintile), lalu digabung — biasanya <strong>rata-rata berbobot</strong>. Bobotnya = <strong>keputusan bisnis</strong>, bukan matematika.</p>
<Tex math={String.raw`Skor = w_R \cdot R + w_F \cdot F + w_M \cdot M \quad;\quad w_R + w_F + w_M = 1`} block />
<p><strong>Artinya tiap simbol:</strong> R/F/M = skor quintile 1–5; <Tex math={String.raw`w_R, w_F, w_M`} /> = bobot (jumlah = 1). Bobot sama (⅓) = &ldquo;semua sama penting&rdquo; — klaim yang jarang benar.</p>
<p><strong>Kepribadian/intuisi:</strong> Bobot RFM seperti <strong>kriteria juri kontes</strong>: juri yang memberi bobot 50% ke &ldquo;penampilan&rdquo; akan memahkotai juara berbeda dari juri yang 50% ke &ldquo;bakat&rdquo; — dari peserta yang <strong>sama</strong>. Tidak ada bobot yang &ldquo;benar&rdquo; secara matematis; ada bobot yang <strong>jujur terhadap strategimu</strong>. Bisnis subscription: bobot F tinggi. Luxury: bobot M tinggi. Win-back campaign: bobot R tinggi.</p>
<p><strong>Kapan dipakai:</strong> Setiap segmentasi RFM wajib <strong>mencantumkan bobot + alasannya</strong>. &ldquo;Champions&rdquo; dari bobot berbeda = orang berbeda.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Dua bobot, dua champions (klik untuk buka)</summary>
<p>Pelanggan A: R=5, F=2, M=2 (baru beli kemarin, jarang, murah). Pelanggan B: R=2, F=5, M=5 (lama tidak beli, dulu royal).</p>
<p><strong>Bobot &ldquo;aktivasi&rdquo;</strong> (w_R=0,5, w_F=0,3, w_M=0,2): A = 0,5×5+0,3×2+0,2×2 = <strong>3,5</strong>; B = 0,5×2+0,3×5+0,2×5 = <strong>3,5</strong>. Seri!</p>
<p><strong>Bobot &ldquo;win-back&rdquo;</strong> (w_R=0,6, w_F=0,2, w_M=0,2): A = 0,6×5+0,2×2+0,2×2 = <strong>3,8</strong>; B = 0,6×2+0,2×5+0,2×5 = <strong>3,2</strong>. A menang — benar untuk kampanye reaktivasi.</p>
<p><strong>Bobot &ldquo;VIP&rdquo;</strong> (w_R=0,2, w_F=0,3, w_M=0,5): A = 0,2×5+0,3×2+0,5×2 = <strong>2,6</strong>; B = 0,2×2+0,3×5+0,5×5 = <strong>4,4</strong>. B menang telak — benar untuk undangan eksklusif.</p>
<p><strong>Pelajaran:</strong> &ldquo;siapa pelanggan terbaikmu&rdquo; <strong>tidak punya jawaban</strong> sampai kamu menjawab &ldquo;terbaik untuk <em>apa</em>&rdquo;. Bobot = strategi yang ditulis dalam angka.</p>
</details>
<PlotlyChart
  data={[{x: ["D30 N-day", "D30 Rolling", "Unbounded"], y: [25, 40, 55], type: "bar", marker: {color: ["#ef4444","#e8a838","#2a7de1"]}, text: ["25%","40%","55%"], textposition: "outside"}]}
  title={"Satu kohor, tiga definisi retention"}
  layout={{yaxis: {title: "Retention (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga batang = tiga definisi dari kohor yang sama (1.000 instal). Tinggi = angkanya. Urutan kiri→kanan = ketat→longgar.</p>
<p><strong>Interpretasi:</strong> Selisih 25% vs 55% = 30 poin, murni definisi. Inilah visual &ldquo;ketidaksamaan retention&rdquo;: setiap kali kamu melihat angka retention tanpa definisi, bayangkan tiga batang ini — angka yang dipamerkan hampir selalu batang paling kanan.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Cukup laporkan retention rata-rata — satu angka, gampang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Rata-rata <strong>mencampur cohort bagus (lama) dengan cohort buruk (baru)</strong> dan menyembunyikan tren. Kasus SehatQ: rata-rata 40% menutupi cohort baru yang 18%. Aturan: tidak ada metrik retensi tanpa pecahan cohort — minimal bandingkan 3 cohort terakhir di umur yang sama.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Skor RFM sekali hitung berlaku selamanya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> RFM adalah <strong>foto</strong>, bukan film. Pelanggan At Risk bulan ini bisa jadi Lost bulan depan. Hitung ulang tiap bulan (atau tiap kampanye), dan waspadai tren: R=5 tapi F turun 3 bulan beruntun = early warning yang tidak tertangkap skor statis.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Bandingkan cohort di umur yang sama.</strong> Cohort Jan bulan ke-3 vs cohort Jun bulan ke-3 — bukan Jan-M3 vs Jun-M1. Membandingkan umur beda = membandingkan apel dengan bibit apel.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>RFM terbaik dipakai untuk memutuskan siapa TIDAK dikirimi promo.</strong> Champions tidak butuh diskon (margin bocor), Lost tidak merespons (uang terbuang). Penghematan terbesar RFM sering dari <em>tidak</em> mengirim, bukan dari mengirim.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Bangun Cohort Table dari Nol</h2>
<p>Data transaksi sintetis 6 cohort. Hitung retention per cohort per bulan dan temukan: cohort mana yang bermasalah?</p>
<PyodideLab
  title={"Lab 1 — Cohort Retention Table"}
  hint={"Coba ubah pola belanja cohort 'jun' (mis. hilangkan repeat) — lihat kolom M3-nya memerah. Itulah yang dirasakan SehatQ."}
  defaultCode={"import random\nrandom.seed(42)\n\n# transaksi sintetis: {cohort: [user_id...]}, tiap user belanja di bulan 0..3 dgn prob tertentu\ncohorts = {\"jan\": 200, \"mar\": 250, \"mei\": 300, \"jun\": 350}\nprob = {\"jan\": [1.0, .55, .48, .45], \"mar\": [1.0, .48, .40, .37],\n        \"mei\": [1.0, .38, .30, .27], \"jun\": [1.0, .30, .20, .18]}\n\nprint(f\"{'cohort':<8}\" + \"\".join(f\"{'M'+str(m):>7}\" for m in range(4)))\nfor c, n in cohorts.items():\n    baris = []\n    for m in range(4):\n        aktif = sum(1 for _ in range(n) if random.random() < prob[c][m])\n        baris.append(f\"{aktif/n:>6.0%}\")\n    print(f\"{c:<8}\" + \"\".join(baris))\n\nprint(\"\\nBandingkan kolom M3: jan 45% vs jun 18% -> kualitas cohort baru jatuh.\")\nprint(\"Satu angka rata-rata akan menyembunyikan ini.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: RFM Scoring + Segmentasi</h2>
<p>Dari data transaksi, hitung skor R/F/M (kuintil 1–5), petakan ke segmen, dan lihat distribusi pelangganmu.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator RFM"}
  hint={"Ubah data: buat satu pelanggan yang dulu rajin lalu berhenti (R besar hari, F besar). Lihat ia jatuh ke 'At Risk' — target win-back terbaik."}
  defaultCode={"from datetime import date\n# (nama, tgl_terakhir_beli, jumlah_transaksi, total_belanja_jt)\ndata = [\n    (\"Ani\",  date(2026,10,10), 24, 18.5),\n    (\"Budi\", date(2026,10,8),  20, 12.0),\n    (\"Cici\", date(2026,6,15),  22, 15.0),\n    (\"Dodi\", date(2026,10,11), 2,  0.8),\n    (\"Eka\",  date(2025,12,1),  15, 9.0),\n    (\"Fajar\",date(2026,10,9),  8,  3.2),\n]\nhari_ini = date(2026, 10, 13)\n\ndef kuintil(vals, terbaik_besar=True):\n    s = sorted(vals)\n    n = len(s)\n    out = []\n    for v in vals:\n        r = s.index(v) / max(n - 1, 1)\n        skor = 1 + int(r * 4.99)\n        out.append(skor if terbaik_besar else 6 - skor)\n    return out\n\nrec = [(hari_ini - d).days for _, d, _, _ in data]\nfre = [f for _, _, f, _ in data]\nmon = [m for _, _, _, m in data]\nRs, Fs, Ms = kuintil(rec, False), kuintil(fre, True), kuintil(mon, True)\n\ndef segmen(r, f, m):\n    if (r, f) == (5, 5) or (r >= 4 and f >= 4 and m >= 4): return \"Champions\"\n    if r <= 2 and f >= 4: return \"At Risk\"\n    if r <= 2 and f <= 2: return \"Lost\"\n    if r == 5 and f <= 2: return \"New\"\n    if r >= 4 and f >= 3: return \"Loyal\"\n    return \"Potential\"\n\nprint(f\"{'nama':<7}{'R':>3}{'F':>3}{'M':>3}  segmen\")\nfor (nama, _, _, _), r, f, m in zip(data, Rs, Fs, Ms):\n    print(f\"{nama:<7}{r:>3}{f:>3}{m:>3}  {segmen(r,f,m)}\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Pertanyaan: 'di mana user hilang?' → <strong>Funnel per segmen</strong></h3>
<p><strong>Kenapa:</strong> Butuh lokasi bocor + sizing masalah per tahap.</p>
<p><strong>Contoh nyata:</strong> Funnel checkout per device: mobile drop 70% di pembayaran → perbaiki UX mobile.</p>
</div>
<div className="decision-card">
<h3>2. Pertanyaan: 'apakah produk makin bagus mempertahankan user?' → <strong>Cohort retention table</strong></h3>
<p><strong>Kenapa:</strong> Satu-satunya cara jujur melihat tren kualitas dari waktu ke waktu.</p>
<p><strong>Contoh nyata:</strong> Bandingkan M3 tiga cohort terakhir tiap sprint release.</p>
</div>
<div className="decision-card">
<h3>3. Pertanyaan: 'siapa dikirimi promo apa?' → <strong>RFM</strong></h3>
<p><strong>Kenapa:</strong> Cepat, bisa SQL, langsung jadi daftar target + pesan yang sesuai.</p>
<p><strong>Contoh nyata:</strong> At Risk → win-back; Champions → referral; Lost → dilepas/supresi.</p>
</div>
<div className="decision-card">
<h3>4. Butuh jawaban dalam 1 hari, data warehouse rapi → <strong>Ketiganya berurutan: funnel → cohort → RFM</strong></h3>
<p><strong>Kenapa:</strong> Funnel menemukan di mana, cohort menemukan kapan memburuk, RFM menemukan siapa yang diselamatkan.</p>
<p><strong>Contoh nyata:</strong> Playbook diagnosis standar tiap ada anomali metrik.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Tidak ada metrik tanpa pecahan:</strong> per channel / per cohort / per segmen.</li><li><strong>Bandingkan umur yang sama</strong> (M3 vs M3).</li><li><strong>RFM = daftar aksi</strong>, bukan sekadar label.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: &ldquo;Retention 40%&rdquo; yang Membuat Startup Gagal Fundraising</h3>
<p>Startup edtech &ldquo;BelajarKu&rdquo; mencantumkan &ldquo;D30 retention 40%&rdquo; di deck. Due diligence investor meminta <strong>data kohor mentah</strong>. Temuan: 40% itu <strong>unbounded</strong> — &ldquo;pernah buka aplikasi kapan saja setelah instal&rdquo;. N-day D30 yang sebenarnya: <strong>11%</strong>. Investor tidak marah karena angkanya kecil — mereka marah karena <strong>definisinya disembunyikan</strong>. Deal batal; bukan karena produk buruk, tapi karena kepercayaan habis.</p>
<p><strong>Pelajaran:</strong> definisi retention adalah <strong>tes kejujuran</strong>. Tim yang berani menulis &ldquo;D30 N-day: 11% (unbounded: 40%)&rdquo; justru dipercaya — karena investor tahu angka 11% yang jujur bisa diperbaiki, sedangkan 40% yang licik tidak bisa diaudit.</p>
<h3>Kisah 2: Champions 5% yang Menyelamatkan Perusahaan</h3>
<p>Ritel &ldquo;SegarMart&rdquo; hampir memotong <strong>seluruh</strong> program loyalitas untuk hemat biaya. Analisis RFM terakhir sebelum pemotongan: segmen Champions (skor 555/554) = <strong>5% pelanggan tapi 38% revenue</strong>, dan 70% dari mereka anggota loyalitas. Program yang terlihat &ldquo;biaya&rdquo; di laporan gabungan ternyata <strong>menjangkar</strong> 38% revenue.</p>
<p>Keputusan akhir: bukan memotong, tapi <strong>memangkas benefit untuk segmen bawah</strong> (yang biayanya tinggi, kontribusinya kecil) dan <strong>menambah benefit untuk Champions</strong>. Biaya program turun 30%, revenue dari Champions naik 12%. <strong>Pelajaran:</strong> analisis deskriptif yang baik tidak menjawab &ldquo;berapa rata-ratanya&rdquo; — ia menjawab <strong>&ldquo;siapa yang sebenarnya membayar gaji kita&rdquo;</strong>.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Deskriptif = gampang, yang susah itu machine learning.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Model ML yang dilatih di atas definisi retention yang salah = <strong>mesin yang presisi dalam memproduksi kesalahan</strong>. 80% kegagalan proyek analytics berakar di lapisan deskriptif (definisi, kohor, segmentasi) — bukan di algoritma. Analis yang menguasai deskriptif = analis yang modelnya bisa dipercaya.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 5% Champions, 40% Revenue</h2>
<div className="callout">
<p>E-commerce fashion: retention D30 agregat <strong>12%</strong> (terlihat buruk). RFM menemukan: <strong>5% pelanggan (Champions) menyumbang 40% revenue</strong>; 30% adalah &ldquo;Lost&rdquo; (beli sekali saat diskon 70%, tidak pernah kembali); cohort diskon retensi M3-nya 8% vs organik 31%.</p>
<p><strong>Pertanyaan:</strong> (a) Apakah retention 12% berarti produk gagal? (b) Tiga aksi prioritas bulan depan? (c) Apa yang harus DIHENTIKAN?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tidak serta-merta.</strong> 12% agregat mencampur organik (31%) dengan pemburu diskon (8%). Produk inti sehat untuk segmen yang tepat; masalahnya di <strong>kualitas akuisisi</strong>, bukan (hanya) produk.</p>
<p>(b) <strong>Tiga aksi:</strong> (1) lindungi Champions — early access koleksi baru + referral reward (mereka 40% revenue!); (2) win-back At Risk organik sebelum jadi Lost; (3) perbaiki onboarding 7 hari pertama (di sanalah cohort baru gugur).</p>
<p>(c) <strong>Hentikan diskon 70% blast ke semua orang.</strong> Ia mencetak &ldquo;pelanggan&rdquo; Lost yang merusak retention agregat, menggerus margin, dan menutupi sinyal produk. Ganti dengan diskon tersegmentasi (hanya New/At Risk organik).</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Tiga retention.</strong> Kohor 2.000 instal. Tepat hari ke-7: 300 aktif. Pada/setelah hari ke-7: 700 aktif. Pernah aktif setelah instal: 1.100. Hitung D7 N-day, rolling, unbounded. Jika kompetitor pamer &ldquo;D7 55%&rdquo;, apa pertanyaanmu?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>N-day = 300/2.000 = <strong>15%</strong>. Rolling = 700/2.000 = <strong>35%</strong>. Unbounded = 1.100/2.000 = <strong>55%</strong>.</p>
<p>Pertanyaan untuk kompetitor: <strong>&ldquo;55% itu definisi apa — N-day, rolling, atau unbounded?&rdquo;</strong> Jika jawabannya unbounded, angka N-day mereka mungkin ~15% — sama denganmu. Kamu tidak kalah; kamu hanya lebih jujur. Dan ketidaksamaan 15 ≤ 35 ≤ 55 ✓ terpenuhi.</p>
</details>
<p><strong>Soal 2 — Simpson.</strong> Q1: Channel X 5.000 visitor × 6% = 300; Channel Y 5.000 × 4% = 200 → total 5%. Q2: X 9.000 × 5,5% = 495; Y 1.000 × 3,5% = 35 → total 5,3%. Apa yang terjadi? Keputusanmu?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>Total naik 5% → 5,3% 🎉 — tapi <strong>X turun</strong> 6%→5,5% dan <strong>Y turun</strong> 4%→3,5%. Kenaikan total murni komposisi: porsi X (yang memang lebih tinggi) naik dari 50% → 90%.</p>
<p><strong>Keputusan:</strong> jangan rayakan. Investigasi <em>mengapa tiap channel turun</em> — itu masalah sebenarnya. &ldquo;Kemenangan&rdquo; ini akan berbalik begitu bauran kembali normal. Analis yang melaporkan &ldquo;naik 0,3 poin didorong bauran, fundamental tiap channel melemah&rdquo; = analis yang menyelamatkan perusahaan dari kejutan kuartal depan.</p>
</details>
<p><strong>Soal 3 — Bobot RFM.</strong> Pelanggan C: R=4, F=4, M=1. Pelanggan D: R=1, F=2, M=5. Bobot &ldquo;volume&rdquo; (0,2/0,5/0,3) vs bobot &ldquo;premium&rdquo; (0,2/0,2/0,6). Siapa &ldquo;terbaik&rdquo; di tiap bobot? Untuk kampanye &ldquo;bundel premium&rdquo;, siapa targetmu?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>Bobot volume: C = 0,2×4+0,5×4+0,3×1 = <strong>3,1</strong>; D = 0,2×1+0,5×2+0,3×5 = <strong>2,7</strong> → C menang (sering beli walau murah).</p>
<p>Bobot premium: C = 0,2×4+0,2×4+0,6×1 = <strong>2,2</strong>; D = 0,2×1+0,2×2+0,6×5 = <strong>3,6</strong> → D menang telak.</p>
<p>Untuk bundel premium: target <strong>D</strong> — ia terbukti berani bayar mahal (M=5). Menarget C dengan bundel premium = menawarkan steak ke vegetarian yang sering jajan: frekuensinya tinggi, dompetnya tidak cocok.</p>
</details>
<p><strong>Soal 4 — Kohor vs cross-sectional.</strong> &ldquo;Retention bulan ini 60%&rdquo; dihitung dari <strong>semua pengguna aktif bulan ini</strong> (cross-sectional). Mengapa angka ini bisa naik <strong>justru saat produk memburuk</strong>? (Petunjuk: siapa yang tersisa saat yang baru pergi?)</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>Saat produk memburuk, pengguna baru pergi duluan — yang tersisa adalah <strong>pengguna lama yang loyal</strong>. Cross-sectional retention = % dari (kebanyakan) pengguna lama yang aktif → <strong>naik</strong>, padahal tidak ada pengguna baru yang bertahan. Ini <strong>survivorship bias</strong> versi retention.</p>
<p>Obatnya: <strong>selalu kohor</strong> (kelompokkan by waktu instal, ukur tiap kohor terpisah). Kohor Januari vs kohor Juni yang memburuk akan terlihat jelas — sedangkan angka cross-sectional tersenyum menutupi kuburan.</p>
</details>
<div className="tip">
<p><strong>💡 Empat pertanyaan yang harus kamu tanyakan pada setiap angka deskriptif: (1) definisinya apa? (2) per segmen bagaimana? (3) kohor atau cross-sectional? (4) siapa yang bobotnya menentukan? Empat pertanyaan ini = 80% pekerjaan analis senior.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Cohort Jan M3 = 45%, cohort Jun M3 = 18%, rata-rata = 40%. Kesimpulan tepat?"}
  options={
    ["Retention stabil 40%, aman",
    "Kualitas cohort baru memburuk sistematis — investigasi onboarding/channel Jun",
    "Hapus cohort Jun dari laporan",
    "Naikkan budget akuisisi"]
  }
  correct={1}
  explanation={"Benar: bandingkan umur yang sama (M3 vs M3) — tren turun 45%→18% = sinyal masalah. Rata-rata 40% didominasi cohort lama yang besar dan menyembunyikan ini."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Pelanggan: terakhir beli 120 hari lalu, dulu 22x transaksi, total Rp15jt. Segmen RFM?"}
  options={
    ["Champions",
    "At Risk",
    "New",
    "Loyal"]
  }
  correct={1}
  explanation={"Benar: R rendah (lama tidak beli) + F/M tinggi (dulu rajin & besar) = At Risk. Ini target win-back paling berharga — jangan perlakukan seperti Lost."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Time-to-convert checkout: median 1 hari, mean 6,5 hari. Email reminder paling efektif dikirim kapan?"}
  options={
    ["Hari ke-7",
    "Hari ke-2",
    "Hari ke-30",
    "Tidak perlu reminder"]
  }
  correct={1}
  explanation={"Benar: median 1 hari → mayoritas memutuskan cepat. Hari ke-2 menangkap yang masih hangat (1–7 hari). Mean 6,5 hari ditarik segelintir orang yang mikir lama — jangan patok timing ke mean."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Funnel agregat 18%, tapi per channel: organik 32%, agregator diskon 6%. Keputusan budget?"}
  options={
    ["Naikkan semua channel proporsional",
    "Potong agregator, alihkan ke organik/search",
    "Fokus perbaiki funnel agregator",
    "Hentikan semua iklan"]
  }
  correct={1}
  explanation={"Benar: funnel per segmen menunjukkan kualitas beda 5x. Budget mengikuti kualitas, bukan rata-rata. (Pengecualian: kalau agregator bisa diperbaiki murah — tapi datanya bilang tidak.)"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kapan memakai rolling retention dibanding N-day retention?"}
  options={
    ["Selalu — lebih ketat",
    "Untuk produk yang dipakai tidak tiap hari (e-commerce, travel)",
    "Tidak pernah",
    "Hanya untuk game"]
  }
  correct={1}
  explanation={"Benar: N-day (tepat di hari ke-N) terlalu ketat untuk produk yang natural-nya dipakai mingguan/bulanan. Rolling ('pernah aktif dalam 30 hari') lebih adil untuk e-commerce/travel."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Membedah &ldquo;Retention 40%&rdquo; sampai ke Akarnya</h2>
<p>Kamu analis baru di &ldquo;FitTrack&rdquo; (aplikasi olahraga). CEO mengumumkan di all-hands: &ldquo;Retention kita 40% — di atas rata-rata industri!&rdquo; Tugasmu: verifikasi — dan sampaikan kebenarannya, apa pun itu.</p>
<h3>Langkah 1 — Minta definisi dan query-nya</h3>
<p>Ternyata 40% = <strong>unbounded</strong>: &ldquo;pengguna yang pernah buka aplikasi lagi kapan saja dalam 90 hari&rdquo;. Query-nya tidak memfilter bot internal (tim QA membuka aplikasi ratusan kali sehari!). <strong>Aturan pertama bedah: jangan percaya angka yang query-nya tidak bisa kamu baca.</strong></p>
<h3>Langkah 2 — Hitung ulang tiga definisi, dengan filter benar</h3>
<p>Setelah mengeluarkan traffic internal + bot: D30 N-day = <strong>14%</strong>, rolling = <strong>26%</strong>, unbounded = <strong>38%</strong>. Angka 40% yang dirayakan = unbounded <em>termasuk</em> bot internal. Angka jujurnya: 14%.</p>
<h3>Langkah 3 — Pecah per kohor: trennya ke mana?</h3>
<p>D30 N-day per kohor: Jan 18% → Feb 16% → Mar 14% → Apr <strong>12%</strong>. Tren <strong>menurun</strong> — produk memburuk tiap bulan (kemungkinan: onboarding baru di Februari menambah langkah). Angka gabungan 14% menyembunyikan bahwa kohor terbaru hanya 12%.</p>
<h3>Langkah 4 — Pecah per segmen: siapa yang bertahan?</h3>
<p>Pengguna yang menghubungkan smartwatch: D30 = <strong>34%</strong>. Yang tidak: <strong>8%</strong>. 80% instal tidak pernah menghubungkan perangkat — di sinilah 8% itu berasal. <strong>Insight sebenarnya:</strong> bukan &ldquo;retention 40%&rdquo;, melainkan &ldquo;pengguna yang melewati setup perangkat bertahan 4x lipat; 80% pengguna tidak sampai ke sana&rdquo;.</p>
<h3>Langkah 5 — Sampaikan dengan struktur what–so what–now what</h3>
<div className="callout">
<p><strong>What:</strong> D30 N-day riil 14% (bukan 40%), tren menurun 18%→12%, didorong kegagalan setup perangkat (80% tidak menghubungkan).</p>
<p><strong>So what:</strong> Masalah bukan &ldquo;konten kurang menarik&rdquo; (hipotesis tim produk) tapi <strong>aktivasi teknis</strong>: pengguna tidak sampai ke aha moment (data smartwatch).</p>
<p><strong>Now what:</strong> (1) Sederhanakan pairing perangkat — target 80%→50% gagal setup dalam 6 minggu. (2) Ganti metrik utama all-hands menjadi <strong>D30 N-day per kohor</strong> — angka yang bisa dipertanggungjawabkan. (3) Jika setup naik ke 50% berhasil, D30 proyeksi = 0,5×34% + 0,5×8% = <strong>21%</strong> (+7 poin tanpa mengubah produk inti).</p>
</div>
<p><strong>Intuisi penutup:</strong> bedah ini tidak menemukan &ldquo;angka yang benar&rdquo; — ia menemukan <strong>cerita yang benar</strong>: dari &ldquo;kita hebat&rdquo; menjadi &ldquo;ini masalahnya, ini solusinya, ini proyeksinya&rdquo;. Itulah pekerjaan deskriptif: <strong>mengubah angka menjadi keputusan</strong>.</p>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Deskriptif</h2>
<h3>Jebakan 1: Rata-rata dari distribusi bimodal</h3>
<p>Rata-rata order Rp150rb — terlihat normal. Distribusinya: <strong>dua punuk</strong>: Rp30rb (jajan) dan Rp400rb (belanja bulanan). Rata-rata Rp150rb = <strong>tidak ada yang beli segitu</strong>. Keputusan &ldquo;gratis ongkir min. belanja Rp150rb&rdquo; berdasarkan rata-rata = salah sasaran untuk kedua punuk. <strong>Deteksi:</strong> selalu plot histogram sebelum percaya rata-rata. Dua punuk = dua bisnis berbeda.</p>
<h3>Jebakan 2: Persentase dari basis kecil</h3>
<p>&ldquo;Conversion segmen Z naik 200%!&rdquo; — dari 1 menjadi 3 orang. <strong>Deteksi:</strong> setiap % wajib ditemani <strong>n absolut</strong>. Aturan: n &lt; 30 = &ldquo;indikasi awal&rdquo;, bukan &ldquo;temuan&rdquo;.</p>
<h3>Jebakan 3: Sumbu Y yang dipotong</h3>
<p>Grafik &ldquo;retention naik tajam!&rdquo; dengan sumbu Y 38%–42% — kenaikan 2 poin terlihat seperti gunung. <strong>Deteksi:</strong> tanya &ldquo;sumbu Y mulai dari nol?&rdquo; Jika tidak, minta versi jujurnya. Potong sumbu = alat retorika, bukan analisis.</p>
<h3>Jebakan 4: Korelasi periode vs kohor</h3>
<p>&ldquo;Pengguna yang buka fitur X retention-nya 2x!&rdquo; — tapi fitur X hanya dipakai pengguna lama yang memang loyal. <strong>Selection bias</strong>: bukan fitur yang menyebabkan retention. <strong>Deteksi:</strong> bandingkan <em>kohor yang sama</em> sebelum/sesudah pakai fitur, atau lebih baik: eksperimen (MK9).</p>
<h3>Jebakan 5: Angka &ldquo;stabil&rdquo; yang sebenarnya stagnan</h3>
<p>&ldquo;Retention stabil di 20% selama setahun&rdquo; — dirayakan sebagai konsistensi. Padahal: kohor lama 30%, kohor baru 10% — <strong>rata-rata</strong> 20% stabil karena yang lama menutupi yang baru yang memburuk. <strong>Deteksi:</strong> tren per kohor, selalu. Stabilitas rata-rata = tempat tren buruk bersembunyi.</p>
<div className="tip">
<p><strong>💡 Lima jebakan, satu penangkal: <em>distribusi, bukan titik</em>. Histogram sebelum rata-rata, n sebelum %, sumbu nol sebelum grafik, kohor sebelum gabungan, tren sebelum stabilitas.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Laporan Kohor 1 Halaman</h2>
<p>Template laporan mingguan yang membuat seluruh perusahaan membaca angka yang <strong>sama, jujur, dan bisa ditindaklanjuti</strong>.</p>
<div className="callout">
<p><strong>📊 Laporan Kohor Mingguan — [Produk], minggu [X]</strong></p>
<p><strong>1. Angka utama (dengan definisi!):</strong> D7 N-day: __% | D30 N-day: __% | <em>Definisi: % kohor instal yang aktif tepat di hari ke-N, traffic internal &amp; bot dikecualikan.</em></p>
<p><strong>2. Tren 8 kohor terakhir</strong> (sparkline/grafik): ↗ stabil / ↘ menurun / ~ flat. <em>Satu kalimat: apa yang berubah dan hipotesisnya.</em></p>
<p><strong>3. Per segmen kunci</strong> (maks 3): mis. &ldquo;dengan smartwatch: 34% | tanpa: 8%&rdquo;. <em>Fokus pada segmen dengan gap terbesar — di situlah leverage.</em></p>
<p><strong>4. Aksi minggu ini:</strong> maksimal 2, masing-masing dengan pemilik + target angka. <em>Contoh: &ldquo;Sederhanakan pairing (Budi) → target gagal setup 80%→65%.&rdquo;</em></p>
<p><strong>5. Catatan kaki:</strong> perubahan definisi/tracking minggu ini (jika ada). <em>Angka tanpa catatan kaki = angka yang tidak bisa diaudit.</em></p>
</div>
<p><strong>Cara memakai:</strong> isi setiap Senin pagi, 30 menit. Kirim ke grup produk + growth. Aturan keras: <strong>tidak ada angka tanpa definisi, tidak ada tren tanpa kohor, tidak ada laporan tanpa aksi</strong>. Laporan yang tidak menghasilkan aksi dalam 3 minggu = metrik yang salah — ganti metriknya, bukan formatnya.</p>
<details className="worked">
<summary>📐 Contoh terisi (klik untuk buka)</summary>
<p><strong>FitTrack, minggu 40.</strong> 1. D7 N-day: 22% | D30 N-day: 14%. Definisi: aktif = buka app + sinkronisasi data, N-day tepat. 2. Tren: ↘ (18%→12% dalam 4 kohor). Hipotesis: onboarding v2.3 menambah 2 langkah. 3. Segmen: dengan smartwatch 34% | tanpa 8%. 4. Aksi: (a) Budi: hapus 1 langkah pairing → target gagal setup 80%→65%; (b) Sinta: email tutorial pairing hari ke-2 → target setup +5 poin. 5. Catatan: filter bot internal diperketat 8 Okt (angka historis direvisi turun ~2 poin — bukan penurunan bisnis).</p>
<p>Perhatikan poin 5: <strong>perubahan metodologi diumumkan</strong>, bukan diam-diam. Inilah yang membedakan laporan yang dipercaya dari yang dicurigai.</p>
</details>

<h2 id="extra4">💬 Simulasi Rapat: Mempertahankan Angka Jujur</h2>
<p><strong>CEO:</strong> &ldquo;Kenapa retention turun dari 40% jadi 14%? Kamu merusak moral tim!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;40% tidak turun — 40% <strong>tidak pernah ada</strong>. Itu unbounded termasuk bot internal. 14% adalah D30 N-day yang sebenarnya, dan kabar baiknya: kita sekarang tahu <strong>persis</strong> di mana masalahnya — 80% pengguna gagal di setup perangkat. Tim tidak perlu &lsquo;semangat&rsquo;; tim perlu <strong>target yang benar</strong>: turunkan gagal setup dari 80% ke 65%. Itu +7 poin retention yang nyata.&rdquo;</p>
<p><strong>Head of Product:</strong> &ldquo;Tapi investor sudah lihat 40%...&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Justru itu alasan kita perbaiki sekarang. Due diligence akan menemukan hal yang sama dalam 10 menit — dan saat itu kita tidak punya cerita perbaikan. Hari ini kita punya: angka jujur + diagnosis + rencana + proyeksi 21%. <strong>Investor tidak mendanai angka; mereka mendanai tim yang tahu cara memperbaiki angka.</strong>&rdquo;</p>
<div className="tip">
<p><strong>💡 Pelajaran karier: analis yang menyampaikan kabar buruk dengan diagnosis dan rencana <em>dipromosikan</em>; analis yang menutupi kabar buruk dengan definisi licik <em>dipecat saat due diligence</em>. Kejujuran metodologis adalah asuransi karier jangka panjang.</strong></p>
</div>

      <h2 id="kit">🧰 Kit Kerja: Audit Deskriptif 30 Menit</h2>
<p>Checklist yang bisa kamu jalankan <strong>setiap kali</strong> menerima dashboard/angka dari siapa pun — 30 menit, 10 langkah, nol kepercayaan buta.</p>
<div className="callout">
<ol>
<li><strong>Definisi tertulis?</strong> Minta query + definisi operasional. Tidak ada = angka ditolak.</li>
<li><strong>Ketidaksamaan retention</strong> (jika relevan): N-day ≤ rolling ≤ unbounded? Langgar = bug.</li>
<li><strong>Histogram, bukan cuma rata-rata:</strong> unimodal atau bimodal? Outlier berapa %?</li>
<li><strong>n absolut:</strong> setiap % ditemani n. n &lt; 30 = indikasi, bukan temuan.</li>
<li><strong>Per segmen:</strong> pecah by channel/kohor/perangkat. Cari Simpson.</li>
<li><strong>Kohor, bukan cross-sectional:</strong> tren per kohor instal — bukan rata-rata semua pengguna.</li>
<li><strong>Sumbu grafik:</strong> mulai dari nol? Jika dipotong, minta versi jujur.</li>
<li><strong>Filter:</strong> bot, internal, test user sudah dikecualikan? Berapa % yang terfilter?</li>
<li><strong>Bobot tersembunyi:</strong> ada skor/rata-rata berbobot? Bobotnya apa + kenapa?</li>
<li><strong>Selection bias:</strong> &ldquo;pengguna fitur X lebih baik&rdquo; — atau &ldquo;pengguna baik memakai fitur X&rdquo;?</li>
</ol>
</div>
<details className="worked">
<summary>📐 Contoh: Menjalankan audit 30 menit (klik untuk buka)</summary>
<p>Dashboard: &ldquo;Conversion checkout 35% — naik dari 30%!&rdquo;</p>
<p><strong>Menit 0–5 (definisi):</strong> Query: conversion = payment_success / checkout_started. Definisi OK, tertulis.</p>
<p><strong>Menit 5–10 (n + segmen):</strong> n = 400 checkout (kecil!). Per channel: organik 40% (n=100), iklan 33% (n=300). Bulan lalu: organik 38% (n=300), iklan 28% (n=100).</p>
<p><strong>Menit 10–15 (Simpson check):</strong> tiap channel <strong>naik</strong> (38→40, 28→33) — bukan Simpson, ini perbaikan nyata. Tapi n organik cuma 100...</p>
<p><strong>Menit 15–20 (histogram):</strong> distribusi cart_value bimodal: Rp25rb vs Rp300rb. Conversion per punuk: punuk murah 45%, punuk mahal 20%.</p>
<p><strong>Menit 20–25 (selection):</strong> kenaikan didorong voucher Rp20rb untuk punuk murah — bukan perbaikan checkout.</p>
<p><strong>Menit 25–30 (verdict):</strong> &ldquo;Naik 5 poin, tapi 100% dari voucher punuk murah (n kecil, margin tipis). Checkout inti tidak membaik. Rekomendasi: jangan klaim kemenangan; uji tanpa voucher.&rdquo;</p>
<p><strong>Nilai audit 30 menit:</strong> mengubah &ldquo;kemenangan&rdquo; menjadi &ldquo;peringatan&rdquo; — sebelum direksi membuat keputusan budget di atasnya.</p>
</details>
<div className="tip">
<p><strong>💡 Cetak checklist ini. Tempel di dinding. Setiap angka yang lewat mejamu — 10 langkah, 30 menit. Analis yang mengaudit = analis yang tidak pernah malu saat due diligence.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Paling Sering Muncul di Analitik Deskriptif</h2>
<h3>1. &ldquo;Bedanya retention biasa dengan cohort retention?&rdquo;</h3>
<p><strong>Retention biasa</strong> = % pengguna aktif bulan ini dari total pengguna — satu angka yang mencampur pengguna lama dan baru. <strong>Cohort retention</strong> = % pengguna dari <em>kelompok yang mulai di waktu yang sama</em> yang masih aktif setelah N periode. Bedanya krusial: retention biasa bisa terlihat naik hanya karena kamu mengakuisisi banyak pengguna baru (penyebut membengkak), sementara produk sebenarnya bocor. Cohort memisahkan &ldquo;apakah produknya menahan orang&rdquo; dari &ldquo;apakah marketingnya mendatangkan orang&rdquo;. Kalau hanya boleh punya satu metrik retention, pilih cohort.</p>
<h3>2. &ldquo;Kapan RFM tidak cocok dipakai?&rdquo;</h3>
<p>RFM (Recency, Frequency, Monetary) berasumsi pelanggan <strong>bisa membeli berulang</strong>. Ia gagal total untuk: produk sekali-beli (rumah, mobil, jasa nikahan), bisnis langganan murni (semua orang bayar tiap bulan — frequency tidak membedakan), dan B2B dengan 20 klien raksasa (butuh analisis per-akun, bukan skor massal). RFM juga buta terhadap <strong>konteks</strong>: pelanggan &ldquo;hibernating&rdquo; yang pindah ke kompetitor terlihat sama dengan yang sekadar sibuk. Aturan: RFM = langkah pertama segmentasi, bukan langkah terakhir.</p>
<h3>3. &ldquo;Rata-rata conversion naik, tapi tiap channel turun. Kok bisa?&rdquo;</h3>
<p><strong>Simpson&rsquo;s paradox</strong> — musuh bebuyutan analis deskriptif. Contoh: Channel A conversion 5%→4% (turun), Channel B 2%→1,5% (turun), tapi rata-rata keseluruhan naik dari 2,5%→3,2%. Kok bisa? Karena <strong>komposisi berubah</strong>: traffic bergeser ke Channel A yang memang conversion-nya lebih tinggi. Rata-rata naik bukan karena performa membaik, tapi karena timbangan bergeser. Obatnya: <strong>jangan pernah baca rata-rata tanpa melihat breakdown-nya</strong> — selalu cek per segmen sebelum merayakan.</p>
<h3>4. &ldquo;Sampel berapa yang cukup untuk analisis deskriptif?&rdquo;</h3>
<p>Untuk <strong>deskripsi</strong> (bukan uji hipotesis), patokannya stabilitas: angka tidak berubah liar saat tambah data. Praktiknya: cohort mingguan butuh minimal ~200–500 pengguna per cohort agar retention % tidak lompat-lompat; breakdown per channel butuh minimal ~100 conversion per sel agar tidak didominasi noise. Kalau sel-mu hanya 12 conversion, jangan bikin klaim — gabungkan periode atau segmen. Ingat: deskriptif yang presisi palsu (2 desimal dari 12 sampel) lebih berbahaya daripada deskriptif yang jujur (&ldquo;data belum cukup&rdquo;).</p>
<h3>5. &ldquo;Bagaimana memisahkan tren asli dari musiman (seasonality)?&rdquo;</h3>
<p>Bandingkan <strong>apel-dengan-apel waktu</strong>: bulan ini vs bulan yang sama tahun lalu (YoY), bukan vs bulan lalu (MoM) — kecuali bisnismu tidak musiman. Untuk cohort: bandingkan cohort Januari 2026 dengan cohort Januari 2025, bukan dengan cohort Desember 2025 (efek Harbolnas menggelembungkan Desember). Teknik cepat: plot 2 tahun data bulanan berdampingan — pola yang berulang tiap 12 bulan = musiman, sisanya = tren/sinyal. Kesalahan klasik analis junior: merayakan &ldquo;growth 40% MoM&rdquo; di bulan Ramadan/Lebaran tanpa sadar itu terjadi tiap tahun.</p>
<h3>6. &ldquo;Bos saya suka vanity metrics (download, pageview). Bagaimana mengubahnya?&rdquo;</h3>
<p>Jangan melawan langsung — <strong>gandeng</strong>. Sajikan vanity metric berdampingan dengan metrik yang bermakna: &ldquo;Download naik 50% (bagus!), dan dari situ activation rate kita 12% → artinya 6.000 pengguna aktif baru.&rdquo; Lama-lama ia akan bertanya sendiri &ldquo;activation-nya berapa?&rdquo; tanpa disuruh. Trik kedua: tunjukkan <strong>biaya</strong> vanity metric — &ldquo;pageview naik 2x tapi revenue flat: artinya kita membayar server 2x untuk hasil yang sama.&rdquo; Uang adalah bahasa yang dimengerti semua bos.</p>
<div className="tip">
<p><strong>💡 Benang merah enam FAQ: analitik deskriptif bukan tentang menghitung — tentang <em>menghitung dengan jujur</em>. Cohort vs rata-rata, breakdown vs agregat, YoY vs MoM: semuanya adalah disiplin yang sama, yaitu menolak angka yang menipu.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Sari Rasa — Membaca Bisnis FMCG Lewat Tiga Lensa Deskriptif</h2>
<p><em>Sari Rasa</em> (nama disamarkan): produsen bumbu dapur dengan 2 juta pembeli/tahun, 70% lewat warung/toko kelontong, 30% lewat e-commerce. Direksi curiga &ldquo;penjualan stagnan&rdquo; tapi tidak tahu di mana bocornya. Kamu diberi data transaksi 24 bulan. Tiga lensa deskriptif, tiga temuan.</p>
<h3>Lensa 1 — Funnel distribusi: di mana barang berhenti?</h3>
<p>Funnel Sari Rasa bukan funnel digital, melainkan <strong>funnel distribusi</strong>: Pabrik → Distributor → Toko → Keranjang belanja. Deskriptif per tahap (unit/bulan): Pabrik keluar 1.000.000 → Distributor terima 980.000 (susut 2%, wajar) → Toko pesan ulang 720.000 (drop 27%!) → Terjual ke konsumen 610.000 (drop 15%). <strong>Temuan:</strong> kebocoran terbesar bukan di konsumen, melainkan di <strong>re-order toko</strong> — 260.000 unit/bulan tidak dipesan ulang. Akar: sales motor coverage hanya 40% toko/bulan; sisanya menunggu &ldquo;diingatkan&rdquo;. Solusi bukan iklan ke konsumen, melainkan <strong>menaikkan frekuensi kunjungan sales</strong> ke toko yang sepi order 30+ hari.</p>
<h3>Lensa 2 — Cohort: apakah promo menciptakan pelanggan atau pemburu diskon?</h3>
<p>Cohort pembeli pertama kali dari promo Harbolnas 2025 vs pembeli reguler (retention = beli lagi dalam 90 hari):</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Cohort</th><th>Pembeli awal</th><th>Beli lagi ≤ 90 hari</th><th>Retention</th><th>Nilai rata-rata order ke-2</th></tr></thead>
<tbody>
<tr><td>Promo Harbolnas (diskon 50%)</td><td>180.000</td><td>21.600</td><td>12%</td><td>Rp28.000</td></tr>
<tr><td>Reguler (tanpa promo)</td><td>95.000</td><td>41.800</td><td>44%</td><td>Rp52.000</td></tr>
</tbody>
</table>
</div>
<p><strong>Temuan:</strong> promo mendatangkan 2x pembeli, tapi retention-nya <strong>seperempat</strong> pembeli reguler — dan yang kembali pun belanja setengahnya. Promo 50% tidak menciptakan pelanggan; ia <strong>menyewa pemburu diskon</strong> selama 90 hari. Keputusan: budget promo dialihkan 60% ke program <strong>re-order reminder</strong> untuk cohort reguler (retention 44% = mesin yang layak diberi bensin).</p>
<h3>Lensa 3 — RFM: siapa yang sebenarnya menopang bisnis?</h3>
<p>Skor RFM 5 quintile pada 2 juta pembeli. Hasilnya klasik tapi mengejutkan direksi: segmen <strong>Champions</strong> (skor 12–15) hanya <strong>6%</strong> pembeli tapi menyumbang <strong>38%</strong> revenue; segmen <strong>At Risk</strong> (skor 6–8, dulu Champions) = 11% pembeli yang belanjanya turun 40% dalam 6 bulan. <strong>Temuan:</strong> bisnis ini berdiri di atas 120.000 pelanggan setia — dan 220.000 di antaranya sedang pergi diam-diam. Program win-back ke segmen At Risk (voucher + kunjungan sales) mengembalikan 18% dari mereka dalam 1 kuartal = Rp4,1 miliar revenue yang &ldquo;tidak perlu dicari&rdquo;.</p>
<details className="worked">
<summary>📐 Worked example: Menghitung nilai &ldquo;menyelamatkan&rdquo; segmen At Risk (klik untuk buka)</summary>
<p>Data: 220.000 pelanggan At Risk; belanja rata-rata dulu Rp180.000/bulan, kini Rp108.000/bulan (turun 40%); margin kontribusi 35%.</p>
<p><strong>Langkah 1 — Nilai yang hilang per pelanggan:</strong> (Rp180.000 − Rp108.000) × 35% = <strong>Rp25.200 margin/bulan</strong>.</p>
<p><strong>Langkah 2 — Total kebocoran:</strong> 220.000 × Rp25.200 = <strong>Rp5,54 miliar margin/bulan</strong> yang menguap diam-diam.</p>
<p><strong>Langkah 3 — Nilai program win-back:</strong> biaya Rp15.000/pelanggan (voucher + SMS) × 220.000 = Rp3,3 miliar. Jika 18% kembali ke belanja semula: 39.600 × Rp25.200 × 12 bulan = <strong>Rp11,98 miliar margin/tahun</strong>. ROI = (11,98 − 3,3) / 3,3 = <strong>263%</strong>.</p>
<p><strong>Pelajaran:</strong> analitik deskriptif yang baik tidak berhenti di &ldquo;ada segmen At Risk&rdquo; — ia menerjemahkan temuan menjadi <strong>rupiah dan ROI keputusan</strong>. Itulah bedanya laporan yang dibaca direksi dengan laporan yang diarsipkan.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga lensa, satu pola: masalah Sari Rasa tidak pernah terlihat dari &ldquo;total penjualan&rdquo; — ia baru terlihat saat data <em>dibelah</em>: per tahap funnel, per cohort, per segmen RFM. Deskriptif = seni membelah angka sampai ia mengaku.</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Funnel lanjutan</strong>: drop-off absolut (sizing) + relatif (prioritas) + time-to-convert (median!) + pecah per segmen/channel.</li>
<li><strong>Cohort table</strong>: retention = aktif cohort c di bulan m / ukuran cohort c; bandingkan umur yang sama; waspadai rata-rata agregat.</li>
<li><strong>Kurva retensi melandai</strong> = ada core users; level landai antar cohort = kualitas produk/channel dari waktu ke waktu.</li>
<li><strong>RFM</strong>: skor 1–5 per Recency/Frequency/Monetary → Champions, Loyal, At Risk, Hibernating, Lost → aksi berbeda per segmen.</li>
<li><strong>RFM juga untuk menahan diri</strong>: jangan kirim diskon ke Champions (margin bocor) atau ke Lost (uang terbuang).</li>
<li><strong>Kapan TIDAK cukup deskriptif</strong>: saat butuh sebab-akibat (butuh eksperimen, MK9) atau prediksi individu (MK5/MK6).</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk2-tracking" className="btn btn-secondary btn-sm">← MK2</Link>
        <Link href="/learn/mk4-segmentasi" className="btn btn-primary btn-sm">MK4 →</Link>
      </div>
    </div>
  );
}

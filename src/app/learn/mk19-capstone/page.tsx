"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk19CapstonePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK19 — Marketing Data Analytics</span>
        <h1 className="display-title">Capstone:<br/>Paket Churn + CLV + Uplift + Alokasi Budget</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Hari Pertama sebagai Marketing Analyst</a></li>
<li><a href="#fase1">Fase 1–2: Diagnosis & Nilai</a></li>
<li><a href="#fase3">Fase 3: Targeting Uplift</a></li>
<li><a href="#fase4">Fase 4: Alokasi Budget</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Empat Fase Capstone</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Minggu Depan Presentasi</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#naratif">📝 Panduan Naratif: Menjalankan Capstone dari Awal hingga Akhir</a></li>
<li><a href="#tambahan-rubrik">📋 Rubrik Penilaian Capstone</a></li>
<li><a href="#tambahan-summary">📊 Contoh: Executive Summary</a></li>
<li><a href="#tambahan-faq">❓ FAQ Capstone</a></li>
<li><a href="#tambahan-checklist">🧰 Checklist Submit Capstone</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menggabungkan RFM, churn, CLV, uplift, dan alokasi budget dalam satu alur kerja.</li>
<li>Menghitung batas CAC per segmen dari CLV dan menerjemahkannya jadi keputusan budget.</li>
<li>Merancang targeting kampanye retensi berbasis uplift (bukan sekadar risiko).</li>
<li>Menyusun laporan 1 halaman 'what–so what–now what' untuk direksi.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Hari Pertama sebagai Marketing Analyst</h2>
      <div className="story">
        <p>Hari pertama kerja sebagai marketing analyst di <em>&ldquo;MajuMart&rdquo;</em>, atasanmu memberi satu file: <strong>transaksi 2 tahun, 50.000 pelanggan</strong>. Lalu satu kalimat: <em>&ldquo;Minggu depan presentasi ke direksi: pelanggan kita siapa, siapa yang pergi, berapa nilainya, dan ke mana budget Rp2 miliar.&rdquo;</em></p>
<p>Kamu tersenyum. <strong>MK1–MK18 adalah senjatamu.</strong> Funnel untuk diagnosis (MK1), cohort untuk tren (MK3), RFM untuk segmentasi (MK3–MK4), CLV untuk nilai (MK5), churn untuk risiko (MK6), uplift untuk targeting (MK11), MMM/atribusi untuk alokasi (MK12–MK13), dan storytelling agar didengar (MK18). Capstone ini = <strong>gladi bersih</strong> hari pertamamu — dengan data sintetis yang perilakunya mirip asli.</p>
<p>Twist-nya: data sintetis ini <strong>sengaja dibuat &lsquo;berantakan&rsquo; seperti data asli</strong> — ada segmen yang terlihat bagus tapi beracun, channel yang terlihat murah tapi membunuh margin, dan kampanye yang terlihat sukses tapi sebenarnya merugikan. Atasanmu tidak minta model paling canggih; dia minta <strong>keputusan yang bisa dipertanggungjawabkan</strong>. Kebanyakan analis junior gagal di titik ini — bukan karena statistiknya salah, tapi karena mereka menyerahkan angka tanpa berani bilang &lsquo;jangan lakukan ini&rsquo;. Capstone ini melatih keberanian itu.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="fase1">Fase 1–2: Diagnosis (RFM/Churn) & Nilai (CLV)</h2>
<p><strong>Definisi.</strong> <strong>Fase 1 — Diagnosis:</strong> bangun funnel &amp; cohort (MK1/MK3): di mana bocor? tren membaik/memburuk? Lalu RFM (MK3) + skor churn sederhana (MK6): siapa berisiko? <strong>Fase 2 — Nilai:</strong> CLV per segmen (MK5): berapa nilai masa depan tiap kelompok? Output fase 2 = <strong>batas CAC per segmen</strong> (CLV/3).</p>
<p>Deliverable fase 1–2: tabel 1 halaman — segmen, ukuran, churn, CLV, batas CAC. Ini fondasi semua keputusan berikutnya.</p>
<Tex math={String.raw`\text{Batas CAC}_{segmen} = \frac{\text{CLV}_{segmen}}{3}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Aturan LTV:CAC ≥ 3 (MK1) diterapkan <em>per segmen</em> — bukan rata-rata</li>
<li>Segmen dengan CLV Rp900rb → batas CAC Rp300rb; channel yang CAC-nya Rp500rb untuk segmen ini = potong</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Fase 1–2 seperti <strong>medical check-up</strong>: diagnosis (apa penyakitnya? siapa kritis?) lalu prognosis (berapa 'nilai hidup' tiap pasien → berapa worth diobati?). Dokter yang langsung operasi tanpa check-up = malpraktik; analis yang langsung alokasi budget tanpa diagnosis = sama.</p>
<p><strong>Kapan dipakai:</strong> Awal setiap proyek/kwartal. Jangan lompat ke targeting sebelum tahu nilai.</p>
<details className="worked">
<summary>📐 Contoh: Tabel fase 1–2 MajuMart (klik untuk buka)</summary>
<p><strong>Champions</strong> (8%, churn 5%, CLV Rp6jt) → batas CAC Rp2jt. <strong>Loyal</strong> (20%, churn 12%, CLV Rp2,5jt) → Rp833rb. <strong>At Risk</strong> (15%, churn 45%, CLV Rp1,2jt) → Rp400rb. <strong>Hibernating</strong> (25%, churn 80%, CLV Rp300rb) → Rp100rb. <strong>Lost</strong> (32%, CLV ~0) → Rp0 (jangan akuisisi ulang!).</p>
<p><strong>Keputusan langsung:</strong> channel dengan CAC Rp600rb hanya boleh untuk Champions &amp; Loyal. Untuk At Risk, CAC Rp600rb &gt; batas Rp400rb → cari channel lebih murah atau terima.</p>
</details>
<PlotlyChart
  data={[{x: ["Champions", "Loyal", "At Risk", "Hibernating", "Lost"], y: [6.0, 2.5, 1.2, 0.3, 0.05], type: "bar", marker: {color: ["#16a34a","#2a7de1","#e8a838","#e8a838","#94a3b8"]}, text: ["Rp6jt","Rp2,5jt","Rp1,2jt","Rp300rb","Rp50rb"], textposition: "outside"}]}
  title={"CLV per segmen MajuMart"}
  layout={{yaxis: {title: "CLV (Rp jt)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = CLV tiap segmen. Garis imajiner 'batas CAC' = sepertiganya.</p>
<p><strong>Interpretasi:</strong> Champions 20x lipat Hibernating. Satu strategi untuk semua = membuang uang di Lost & kekurangan investasi di Champions. <strong>Segmentasi bukan teori — ia mesin alokasi.</strong></p>
</div>
<h2 id="fase3">Fase 3: Targeting — Dari 'Berisiko' ke 'Persuadable'</h2>
<p><strong>Definisi.</strong> <strong>Fase 3:</strong> untuk segmen At Risk, jangan target semua — bangun <strong>uplift</strong> (MK11) dari data pilot: siapa persuadable? Kebijakan: target jika uplift × CLV − biaya &gt; 0; <em>jangan ganggu</em> sleeping dogs. Pilih <strong>next-best-action</strong> per sub-segmen (MK7): voucher vs telepon vs diam.</p>
<p>Deliverable: daftar target + aksi + expected net value. Inilah bedanya kampanye 'Rp500jt gagal' (MK6) vs 'Rp150jt sukses' (MK11).</p>
<p><strong>Kepribadian/intuisi:</strong> Fase 3 seperti <strong>triase UGD</strong>: bukan 'siapa paling parah' (risiko), tapi 'siapa yang <em>tertolong</em> dengan sumber daya terbatas' (uplift) — dan 'siapa yang jangan disentuh' (sleeping dogs). Dokter UGD yang mengobati by 'parah' tanpa triase = kekacauan.</p>
<p><strong>Kapan dipakai:</strong> Setiap kampanye retensi/upsell berbiaya. Syarat: data pilot eksperimen (atau mulai dengan heuristik + pilot kecil).</p>
<details className="worked">
<summary>📐 Contoh: Kebijakan MajuMart (klik untuk buka)</summary>
<p>At Risk 7.500 orang. Pilot 1.000: uplift voucher = +8% (persuadables ~40%), telepon = +12% tapi biaya 10x.</p>
<p><strong>Kebijakan:</strong> persuadables + CLV tinggi → telepon (net +Rp180rb/orang); persuadables + CLV sedang → voucher (net +Rp90rb); sisanya → diam.</p>
<p><strong>Hasil proyeksi:</strong> biaya Rp85jt, selamat ~450, net <strong>+Rp390jt</strong>. Vs 'blast ke semua At Risk': biaya Rp375jt, net +Rp120jt (plus membangunkan sleeping dogs).</p>
</details>
<h2 id="fase4">Fase 4: Alokasi — Rp2 Miliar Dibagi dengan Matematika</h2>
<p><strong>Definisi.</strong> <strong>Fase 4:</strong> alokasikan budget Rp2M antar-channel × segmen dengan dua batas: (1) <strong>batas CAC per segmen</strong> (fase 2) — channel-segmen dengan CAC di atas batas = coret; (2) <strong>marginal ROI</strong> (MK13/MK16) — samakan di semua yang lolos. Sisa: <strong>eksperimen budget</strong> 10% untuk channel baru (bandit mindset, MK9).</p>
<p>Deliverable: matriks alokasi + laporan 1 halaman what–so what–now what (MK18).</p>
<p><strong>Kepribadian/intuisi:</strong> Fase 4 seperti <strong>menyusun tim sepak bola dengan salary cap</strong>: tiap posisi (segmen) punya budget maksimal (batas CAC); pemain (channel) dipilih yang value-nya terbaik di batas itu; 10% untuk pemain muda potensial (eksperimen). Bukan 'beli bintang termahal untuk semua posisi'.</p>
<p><strong>Kapan dipakai:</strong> Perencanaan budget kuartalan/tahunan. Review bulanan dengan data aktual (marginal bergeser).</p>
<details className="worked">
<summary>📐 Contoh: Matriks alokasi MajuMart (klik untuk buka)</summary>
<p><strong>Champions</strong> (batas CAC Rp2jt): search (CAC 800rb, marginal ROAS 4) → Rp600jt; referral (CAC 300rb) → Rp200jt. <strong>Loyal</strong> (batas Rp833rb): sosmed (CAC 500rb, marginal 3,5) → Rp500jt. <strong>At Risk</strong>: retensi (voucher, dari fase 3) → Rp300jt. <strong>Eksperimen</strong> (10%): TikTok Shop → Rp200jt. <strong>Hibernating/Lost:</strong> Rp0.</p>
<p><strong>Total Rp1,8M + Rp200jt eksperimen = Rp2M.</strong> Setiap rupiah punya alasan: batas CAC (mengapa boleh) + marginal ROAS (mengapa sebesar ini).</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Empat Fase Capstone</h2>
<p><strong>Capstone</strong> = <strong>proyek akhir</strong> yang <strong>menggabungkan</strong> semua (MK1–MK18!). <strong>Empat</strong> fase: <strong>(1)</strong> Diagnosa, <strong>(2)</strong> Analisis, <strong>(3)</strong> Rekomendasi, <strong>(4)</strong> Presentasi. <strong>Setiap</strong> fase = <strong>skill</strong> beda. <strong>Semua</strong> fase = <strong>analis</strong> lengkap.</p>
<h3>Fase 1: Diagnosa — &ldquo;Apa Masalahnya?&rdquo;</h3>
<p><strong>Tujuan:</strong> <strong>pahami</strong> bisnis &amp; <strong>temukan</strong> masalah. <strong>Alat:</strong> <strong>funnel</strong> (MK1!), <strong>deskriptif</strong> (MK3!), <strong>interview</strong> (tanya <strong>stakeholder</strong>!).</p>
<p><strong>Output:</strong> <strong>problem statement</strong> (&ldquo;conversion <strong>turun</strong> 20% di <strong>checkout</strong>!&rdquo;). <strong>Hipotesis</strong> (&ldquo;<strong>mungkin</strong> harga? <strong>mungkin</strong> UX?&rdquo;).</p>
<p><strong>Kepribadian:</strong> seperti <strong>dokter</strong> yang <strong>anamnesis</strong> (tanya <strong>gejala</strong>!) sebelum <strong>lab</strong>. <strong>Jangan</strong> langsung <strong>analisis</strong> — <strong>pahami</strong> dulu!</p>
<p><strong>Durasi:</strong> <strong>20%</strong> waktu. <strong>Jangan</strong> lebih (<strong>analysis paralysis</strong>!). <strong>Jangan</strong> kurang (<strong>salah</strong> masalah!).</p>
<details className="worked">
<summary>📐 Contoh Fase 1: Diagnosa e-commerce (klik untuk buka)</summary>
<p><strong>Brief:</strong> &ldquo;Penjualan <strong>turun</strong>!&rdquo;</p>
<p><strong>Diagnosa:</strong> <strong>funnel</strong> (MK1!): visit <strong>naik</strong> 10%, tapi <strong>checkout</strong> turun 30%! <strong>Masalah:</strong> <strong>bukan</strong> traffic (<strong>naik</strong>!), tapi <strong>conversion</strong> (<strong>turun</strong>!).</p>
<p><strong>Deskriptif</strong> (MK3!): <strong>mobile</strong> turun 40%, <strong>desktop</strong> turun 5%! <strong>Masalah:</strong> <strong>mobile</strong>!</p>
<p><strong>Interview:</strong> &ldquo;<strong>checkout</strong> mobile <strong>error</strong> setelah <strong>update</strong>!&rdquo; <strong>Akar:</strong> <strong>bug</strong> teknis!</p>
<p><strong>Problem statement:</strong> &ldquo;Conversion <strong>mobile</strong> turun 40% karena <strong>bug</strong> checkout pasca-update.&rdquo; <strong>Hipotesis:</strong> <strong>perbaiki</strong> bug → <strong>pulih</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>20 menit</strong> diagnosa = <strong>hemat</strong> 20 jam <strong>analisis salah</strong>.</p>
</details>
<h3>Fase 2: Analisis — &ldquo;Berapa Besar? Mengapa?&rdquo;</h3>
<p><strong>Tujuan:</strong> <strong>kuantifikasi</strong> &amp; <strong>jelaskan</strong>. <strong>Alat:</strong> <strong>semua</strong> MK! (<strong>segmentasi</strong>! <strong>elastisitas</strong>! <strong>uplift</strong>! <strong>MMM</strong>!).</p>
<p><strong>Output:</strong> <strong>angka</strong> (&ldquo;bug = <strong>Rp50jt</strong> hilang/bulan!&rdquo;). <strong>Penyebab</strong> (&ldquo;<strong>karena</strong> X, <strong>bukan</strong> Y!&rdquo;). <strong>Visual</strong> (chart! dashboard!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>detektif</strong> yang <strong>kumpulkan</strong> bukti. <strong>Setiap</strong> klaim = <strong>angka</strong>. <strong>Setiap</strong> angka = <strong>sumber</strong>.</p>
<p><strong>Durasi:</strong> <strong>40%</strong> waktu (<strong>terbanyak</strong>!). <strong>Fokus:</strong> <strong>jawab</strong> hipotesis Fase 1!</p>
<details className="worked">
<summary>📐 Contoh Fase 2: Analisis bug (klik untuk buka)</summary>
<p><strong>Kuantifikasi:</strong> <strong>sebelum</strong> bug: 1.000 checkout/hari. <strong>Sesudah:</strong> 600 (−40%!). <strong>Hilang:</strong> 400×30 hari = <strong>12.000</strong> checkout/bulan. <strong>Nilai:</strong> 12.000×Rp150rb = <strong>Rp1,8M/bulan</strong>!</p>
<p><strong>Segmentasi</strong> (MK4!): <strong>Android</strong> −50%, <strong>iOS</strong> −10%! (<strong>Bug</strong> di <strong>Android</strong>!).</p>
<p><strong>Uplift</strong> (MK11!): <strong>siapa</strong> yang <strong>kembali</strong> jika <strong>diperbaiki</strong>? <strong>Persuadables:</strong> 70%!</p>
<p><strong>Pelajaran:</strong> <strong>angka</strong> = <strong>kekuatan</strong>. &ldquo;Rp1,8M/bulan&rdquo; &gt; &ldquo;banyak&rdquo;.</p>
</details>
<h3>Fase 3: Rekomendasi — &ldquo;Apa yang Harus Dilakukan?&rdquo;</h3>
<p><strong>Tujuan:</strong> <strong>aksi</strong> konkret. <strong>Alat:</strong> <strong>prioritas</strong> (impact × effort!), <strong>ROI</strong> (hitung!), <strong>risiko</strong> (akui!).</p>
<p><strong>Output:</strong> <strong>rekomendasi</strong> (&ldquo;<strong>perbaiki</strong> bug Android <strong>minggu ini</strong>!&rdquo;). <strong>Estimasi</strong> (&ldquo;<strong>pulih</strong> Rp1,5M/bulan!&rdquo;). <strong>Langkah</strong> (&ldquo;<strong>1.</strong> rollback, <strong>2.</strong> test, <strong>3.</strong> deploy!&rdquo;).</p>
<p><strong>Kepribadian:</strong> seperti <strong>dokter</strong> yang <strong>resepkan</strong> obat (<strong>bukan</strong> cuma <strong>diagnosis</strong>!). <strong>Resep</strong> = <strong>jelas</strong> (dosis! jadwal!).</p>
<p><strong>Durasi:</strong> <strong>20%</strong> waktu. <strong>Fokus:</strong> <strong>aksi</strong>, bukan <strong>teori</strong>!</p>
<details className="worked">
<summary>📐 Contoh Fase 3: Rekomendasi bug (klik untuk buka)</summary>
<p><strong>Rekomendasi 1:</strong> <strong>Rollback</strong> update Android (<strong>2 jam</strong>!). <strong>Impact:</strong> <strong>pulih</strong> 80% (<strong>Rp1,4M/bulan</strong>!). <strong>Effort:</strong> <strong>rendah</strong>. <strong>Prioritas:</strong> <strong>P0</strong>!</p>
<p><strong>Rekomendasi 2:</strong> <strong>Kompensasi</strong> voucher untuk <strong>yang gagal</strong> checkout (<strong>uplift</strong>! MK11!). <strong>Impact:</strong> <strong>pertahankan</strong> 70% (<strong>Rp1jt</strong>!). <strong>Effort:</strong> <strong>sedang</strong>. <strong>Prioritas:</strong> <strong>P1</strong>!</p>
<p><strong>Rekomendasi 3:</strong> <strong>QA</strong> mobile <strong>sebelum</strong> update (<strong>cegah</strong>!). <strong>Impact:</strong> <strong>jangka panjang</strong>. <strong>Effort:</strong> <strong>tinggi</strong>. <strong>Prioritas:</strong> <strong>P2</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>prioritas</strong> = <strong>impact</strong> × <strong>effort</strong>. <strong>P0</strong> dulu!</p>
</details>
<h3>Fase 4: Presentasi — &ldquo;Bagaimana Menyampaikan?&rdquo;</h3>
<p><strong>Tujuan:</strong> <strong>yakinkan</strong> stakeholder. <strong>Alat:</strong> <strong>storytelling</strong> (MK18!), <strong>visual</strong> (chart!), <strong>bahasa</strong> bisnis (bukan <strong>teknis</strong>!).</p>
<p><strong>Struktur:</strong> <strong>(1)</strong> Masalah (<strong>1</strong> slide!), <strong>(2)</strong> Analisis (<strong>3</strong> slide!), <strong>(3)</strong> Rekomendasi (<strong>2</strong> slide!), <strong>(4)</strong> Next step (<strong>1</strong> slide!). <strong>Total:</strong> <strong>7</strong> slide (<strong>jangan</strong> 70!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>pengacara</strong> di <strong>pengadilan</strong>: <strong>bukti</strong> kuat, <strong>cerita</strong> jelas, <strong>tuntutan</strong> konkret. <strong>Juri</strong> (direksi!) = <strong>sibuk</strong> (to the <strong>point</strong>!).</p>
<p><strong>Durasi:</strong> <strong>20%</strong> waktu. <strong>Fokus:</strong> <strong>keputusan</strong>, bukan <strong>kekaguman</strong>!</p>
<details className="worked">
<summary>📐 Contoh Fase 4: Slide eksekutif (klik untuk buka)</summary>
<p><strong>Slide 1 (Masalah):</strong> &ldquo;Rp1,8M/bulan <strong>hilang</strong> karena <strong>bug</strong> checkout Android.&rdquo; (<strong>Chart:</strong> turun 40%!).</p>
<p><strong>Slide 2–4 (Analisis):</strong> &ldquo;<strong>Android</strong> −50%, <strong>iOS</strong> −10%.&rdquo; &ldquo;<strong>Sejak</strong> update 1 Okt.&rdquo; &ldquo;<strong>70%</strong> akan <strong>kembali</strong> jika <strong>diperbaiki</strong>.&rdquo;</p>
<p><strong>Slide 5–6 (Rekomendasi):</strong> &ldquo;<strong>Rollback</strong> hari ini (pulih <strong>Rp1,4M</strong>!).&rdquo; &ldquo;<strong>Voucher</strong> untuk yang terdampak (pertahankan <strong>Rp1jt</strong>!).&rdquo;</p>
<p><strong>Slide 7 (Next):</strong> &ldquo;<strong>Butuh</strong> ACC rollback <strong>hari ini</strong>. <strong>Tim</strong> siap.&rdquo;</p>
<p><strong>Pelajaran:</strong> <strong>7</strong> slide = <strong>keputusan</strong>. <strong>70</strong> slide = <strong>kebingungan</strong>.</p>
</details>
<PlotlyChart
  data={[{x: ["Fase 1: Diagnosa", "Fase 2: Analisis", "Fase 3: Rekomendasi", "Fase 4: Presentasi"], y: [20, 40, 20, 20], type: "bar", marker: {color: ["#2a7de1", "#22c55e", "#f59e0b", "#8b5cf6"]}}]}
  title={"Alokasi waktu capstone (%)"}
  layout={{yaxis: {title: "% waktu"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Setiap batang = <strong>fase</strong>. Tinggi = <strong>%</strong> waktu.</p>
<p><strong>Interpretasi:</strong> <strong>Analisis</strong> = <strong>40%</strong> (<strong>terbanyak</strong>!). <strong>Diagnosa</strong> = <strong>20%</strong> (<strong>jangan</strong> skip!). <strong>Presentasi</strong> = <strong>20%</strong> (<strong>jangan</strong> remehkan!).</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Capstone = merangkum semua lesson. Baca ulang saja cukup.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Capstone = <strong>memakai</strong> semua lesson untuk <strong>keputusan</strong>. Bedanya: merangkum ('CLV adalah...') vs memutuskan ('batas CAC Champions Rp2jt, jadi search boleh, agregator tidak'). Nilai analis = keputusan, bukan definisi. Kerjakan lab-nya — jangan cuma baca.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Urutan fase kaku: harus selalu 1→2→3→4.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Urutan = <strong>logika ketergantungan</strong>, bukan birokrasi: batas CAC (fase 2) dibutuhkan alokasi (fase 4); uplift (fase 3) butuh data pilot yang bisa jalan paralel. Di dunia nyata fase tumpang tindih — tapi <strong>jangan alokasi sebelum tahu nilai</strong> (fase 2). Itu satu-satunya aturan keras.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Satu halaman mengalahkan 50 slide.</strong> Direksi mengingat tabel segmen + 3 keputusan, bukan metodologi. Lampirkan detail sebagai appendix — presentasikan keputusan. (MK18).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Sisakan 10% untuk eksperimen.</strong> Alokasi 'optimal' hari ini = lokal optimum. Bandit mindset: selalu ada budget untuk menemukan channel berikutnya. Organisasi tanpa budget eksperimen = organisasi yang menua.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Pipeline Mini: RFM → Churn → CLV</h2>
<p>Dari data transaksi sintetis: hitung RFM, skor churn heuristik, CLV, dan batas CAC per segmen — fondasi fase 1–2.</p>
<PyodideLab
  title={"Lab 1 — Pipeline Capstone (1/2)"}
  hint={"Ubah CHURN_RISK untuk segmen At Risk. Lihat batas CAC ikut berubah — diagnosis menggerakkan alokasi."}
  defaultCode={"import random, math\nfrom datetime import date, timedelta\nrandom.seed(42)\n# Data sintetis: 300 pelanggan, transaksi terakhir `rec` hari lalu\npelanggan = []\nhari_ini = date(2026,1,1)\nfor i in range(300):\n    tipe = random.choices([\"champion\",\"loyal\",\"risk\",\"hiber\"], [0.1,0.3,0.3,0.3])[0]\n    n = {\"champion\": 24, \"loyal\": 12, \"risk\": 8, \"hiber\": 3}[tipe]\n    rec_true = {\"champion\": 5, \"loyal\": 30, \"risk\": 120, \"hiber\": 300}[tipe]\n    d = hari_ini - timedelta(days=rec_true + random.randint(0, 15))\n    trx = []\n    for _ in range(n):\n        trx.append((d, random.uniform(200, 2000)))\n        d = d - timedelta(days=random.randint(10, 90))\n    pelanggan.append((tipe, trx))\nMARGIN = 0.4\nprint(f\"{'segmen':<9} {'n':>4} {'churn_h':>8} {'CLV_est':>9}  batas_CAC\")\nfor tipe in [\"champion\",\"loyal\",\"risk\",\"hiber\"]:\n    grup = [p for p in pelanggan if p[0]==tipe]\n    rec = max(1, sum((hari_ini - max(t for t,_ in trx)).days for _, trx in grup)/len(grup))\n    fre = sum(len(trx) for _, trx in grup)/len(grup)\n    mon = sum(v for _, trx in grup for _, v in trx)/sum(len(trx) for _, trx in grup)\n    churn_m = 1 - math.exp(-rec/90)  # makin lama tidak belanja -> makin mungkin churn\n    clv = mon * MARGIN / max(churn_m, 0.02)\n    print(f\"{tipe:<9} {len(grup):>4} {churn_m:>7.0%} {clv/1000:>8.1f}rb  {clv/3/1000:.1f}rb\")\nprint(\"\\nFase 1-2 selesai: tiap segmen punya nilai & batas CAC.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Targeting Uplift + Alokasi Budget</h2>
<p>Simulasikan uplift per segmen, pilih target (net value &gt; 0), alokasikan Rp2M.</p>
<PyodideLab
  title={"Lab 2 — Targeting & Alokasi (2/2)"}
  hint={"Ubah BIAYA_VOUCHER. Target menyusut saat biaya naik — kebijakan targeting = makhluk hidup."}
  defaultCode={"# Fase 3-4: targeting uplift + alokasi budget\nimport random\nrandom.seed(7)\nBUDGET = 2_000_000_000\nBIAYA_VOUCHER, BIAYA_TELP = 50_000, 300_000\n\nsegmen = {  # (ukuran, uplift_voucher, uplift_telp, CLV)\n    \"champions\": (4000, 0.01, 0.02, 6_000_000),\n    \"loyal\":     (10000, 0.04, 0.06, 2_500_000),\n    \"risk\":      (7500, 0.08, 0.12, 1_200_000),\n    \"hiber\":     (12500, 0.02, 0.03, 300_000),\n}\nsisa = BUDGET\nprint(f\"{'segmen':<10}{'aksi':<9}{'target':>8}  biaya(Rp jt)  net(Rp jt)\")\ntotal_net = 0\nfor s, (n, uv, ut, clv) in segmen.items():\n    net_v = uv*clv - BIAYA_VOUCHER\n    net_t = ut*clv - BIAYA_TELP\n    aksi, net = (\"voucher\", net_v) if net_v >= net_t else (\"telepon\", net_t)\n    if net <= 0:\n        print(f\"{s:<10}{'diam':<9}{0:>8}  {'0':>11}  {'0':>9}\")\n        continue\n    target = min(n, int(sisa / (BIAYA_VOUCHER if aksi==\"voucher\" else BIAYA_TELP)))\n    biaya = target * (BIAYA_VOUCHER if aksi==\"voucher\" else BIAYA_TELP)\n    net_tot = target * net\n    sisa -= biaya; total_net += net_tot\n    print(f\"{s:<10}{aksi:<9}{target:>8}  {biaya/1e6:>11.0f}  {net_tot/1e6:>9.0f}\")\nprint(f\"\\nTotal net value: Rp{total_net/1e6:,.0f} jt | Sisa budget: Rp{sisa/1e6:,.0f} jt\")\nprint(\"Sisa -> eksperimen channel baru (10% mindset, MK9).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Mulai proyek analytics baru → <strong>Urutan fase 1→2→3→4</strong></h3>
<p><strong>Kenapa:</strong> Diagnosis → nilai → targeting → alokasi. Jangan alokasi sebelum tahu nilai.</p>
<p><strong>Contoh nyata:</strong> Template proyek MajuMart ini.</p>
</div>
<div className="decision-card">
<h3>2. Waktu 1 hari saja → <strong>Fase 1–2 heuristik (RFM + CLV sederhana)</strong></h3>
<p><strong>Kenapa:</strong> 80% keputusan dari diagnosis + nilai; uplift/MMM butuh waktu.</p>
<p><strong>Contoh nyata:</strong> Batas CAC per segmen untuk rapat besok.</p>
</div>
<div className="decision-card">
<h3>3. Kampanye berbiaya besar → <strong>Tambah fase 3 (uplift) penuh</strong></h3>
<p><strong>Kenapa:</strong> Biaya salah target mahal; sleeping dogs nyata.</p>
<p><strong>Contoh nyata:</strong> Retensi Rp500jt+.</p>
</div>
<div className="decision-card">
<h3>4. Presentasi direksi → <strong>1 halaman what–so what–now what</strong></h3>
<p><strong>Kenapa:</strong> Keputusan, bukan metodologi.</p>
<p><strong>Contoh nyata:</strong> Slide: 3 keputusan + tabel segmen.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Diagnosis → nilai → targeting → alokasi.</strong></li><li><strong>Batas CAC per segmen</strong> = CLV/3.</li><li><strong>Target = persuadable</strong>, bukan berisiko.</li><li><strong>10% untuk eksperimen.</strong> Selalu.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Capstone yang Mendapat Promosi</h3>
<p>Analis &ldquo;Sari&rdquo;: <strong>capstone</strong> &ldquo;churn <strong>turun</strong> 15%&rdquo;. <strong>4 fase</strong> (diagnosa! analisis! rekomendasi! presentasi!). <strong>Hasil:</strong> <strong>direksi</strong> = <strong>terkesan</strong>. <strong>Promosi</strong>! (<strong>Capstone</strong> = <strong>portofolio</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>capstone</strong> = <strong>bukti</strong> skill. <strong>Kerjakan</strong> serius!</p>
<h3>Kisah 2: Capstone yang Gagal (Terlalu Teknis)</h3>
<p>Analis &ldquo;Budi&rdquo;: <strong>capstone</strong> 100 slide (<strong>teknis</strong>!). <strong>Direksi</strong> = <strong>tidur</strong>. <strong>Gagal</strong>! (<strong>Terlalu</strong> teknis! <strong>Tidak</strong> ada rekomendasi!).</p>
<p><strong>Pelajaran:</strong> <strong>teknis</strong> = <strong>untuk</strong> analis. <strong>Bisnis</strong> = <strong>untuk</strong> direksi. <strong>Sesuaikan</strong> audiens!</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Capstone = pamer teknik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Capstone</strong> = <strong>pecahkan</strong> masalah <strong>bisnis</strong>. <strong>Teknik</strong> = <strong>alat</strong>, bukan <strong>tujuan</strong>. <strong>Nilai</strong> = <strong>dampak</strong>, bukan <strong>kompleksitas</strong>.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Minggu Depan Presentasi ke Direksi</h2>
<div className="callout">
<p>Kamu analis baru MajuMart. Data: 50.000 pelanggan, 2 tahun transaksi. Budget Rp2M. Direksi minta: siapa pelanggan kita, siapa pergi, berapa nilainya, ke mana budget.</p>
<p><strong>Pertanyaan:</strong> (a) Susun rencana 5 hari (fase per hari). (b) Tiga angka yang wajib ada di slide 1? (c) Satu risiko terbesar rencanamu?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>H1:</strong> diagnosis — funnel, cohort, RFM. <strong>H2:</strong> nilai — CLV + batas CAC per segmen. <strong>H3:</strong> targeting — uplift heuristik/pilot untuk At Risk. <strong>H4:</strong> alokasi — matriks channel×segmen + 10% eksperimen. <strong>H5:</strong> storytelling — 1 halaman what–so what–now what + appendix.</p>
<p>(b) <strong>(1)</strong> Batas CAC per segmen (aturan main). <strong>(2)</strong> Tiga keputusan alokasi terbesar (ke mana Rp2M). <strong>(3)</strong> Expected net value kampanye retensi (bukti targeting bekerja).</p>
<p>(c) <strong>Data quality</strong> (MK2!) — definisi 'aktif', 'churn', deduplikasi. Satu definisi salah = semua fase salah. Hari 0 (sebelum H1): audit definisi + tracking.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Prioritas.</strong> Tiga rekomendasi: A (impact 9, effort 2!), B (impact 7, effort 8!), C (impact 5, effort 3!). <strong>Urutkan</strong>!</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>Skor</strong> (impact/effort!): A = 9/2 = <strong>4,5</strong>. B = 7/8 = <strong>0,875</strong>. C = 5/3 = <strong>1,67</strong>.</p>
<p><strong>Urutan:</strong> <strong>A</strong> (4,5!) → <strong>C</strong> (1,67!) → <strong>B</strong> (0,875!). <strong>A</strong> = <strong>quick win</strong>! <strong>B</strong> = <strong>terakhir</strong> (effort <strong>besar</strong>!).</p>
</details>
<p><strong>Soal 2 — ROI.</strong> Rekomendasi: cost Rp10jt, benefit Rp50jt/tahun. <strong>Hitung</strong> ROI &amp; <strong>payback</strong>.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>ROI:</strong> (50−10)/10 = <strong>400%</strong>. <strong>Payback:</strong> 10/50 = <strong>0,2 tahun</strong> (<strong>2,4 bulan</strong>!).</p>
<p><strong>Bagus</strong>! (<strong>Payback</strong> &lt; <strong>3 bulan</strong>!)</p>
</details>
<p><strong>Soal 3 — Slide.</strong> Punya <strong>50</strong> chart. <strong>Berapa</strong> yang <strong>masuk</strong> presentasi? <strong>Kriteria</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Masuk:</strong> <strong>5–7</strong> (<strong>1</strong> per <strong>poin</strong>!). <strong>Kriteria:</strong> <strong>mendukung</strong> keputusan! (<strong>Bukan</strong> &ldquo;bagus&rdquo;! <strong>Bukan</strong> &ldquo;capek bikin&rdquo;!).</p>
<p><strong>Sisa</strong> 43 = <strong>appendix</strong> (<strong>jika</strong> ditanya!).</p>
</details>
<p><strong>Soal 4 — Bahasa.</strong> &ldquo;Model <strong>kausal forest</strong> menunjukkan <strong>heterogeneous treatment effect</strong> signifikan.&rdquo; <strong>Terjemahkan</strong> untuk <strong>direksi</strong>!</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Direksi:</strong> &ldquo;Iklan <strong>berpengaruh</strong> beda-beda. <strong>Untuk</strong> 30% pelanggan, <strong>sangat</strong> efektif (+15%). <strong>Untuk</strong> sisanya, <strong>kurang</strong>. <strong>Kita</strong> fokus ke <strong>30%</strong> itu.&rdquo;</p>
<p><strong>Pelajaran:</strong> <strong>bahasa</strong> bisnis = <strong>dampak</strong>, bukan <strong>metode</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 Empat fase capstone: <em>diagnosa</em> (apa?), <em>analisis</em> (berapa? mengapa?), <em>rekomendasi</em> (apa yang dilakukan?), <em>presentasi</em> (bagaimana menyampaikan?). Empat fase = analis lengkap.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Urutan fase capstone yang benar dan kenapa?"}
  options={
    ["4→3→2→1",
    "1 diagnosis → 2 nilai → 3 targeting → 4 alokasi (ketergantungan logis)",
    "Acak",
    "Hanya fase 4"]
  }
  correct={1}
  explanation={"Benar: alokasi butuh batas CAC (fase 2); targeting butuh diagnosis (fase 1). Satu-satunya aturan keras: jangan alokasi sebelum tahu nilai."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Segmen CLV Rp1,2jt. Channel A CAC Rp500rb, channel B CAC Rp300rb. Keputusan?"}
  options={
    ["Pakai A — jangkauan luas",
    "Batas CAC = Rp400rb → hanya B yang lolos",
    "Pakai keduanya",
    "Tolak keduanya"]
  }
  correct={1}
  explanation={"Benar: CLV/3 = Rp400rb. A (Rp500rb) di atas batas = rugi. Batas per segmen &gt; rata-rata."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kampanye retensi: target 'berisiko' vs 'persuadable'. Pilih?"}
  options={
    ["Berisiko — paling butuh",
    "Persuadable (uplift) — yang berubah karena aksi",
    "Semua",
    "Acak"]
  }
  correct={1}
  explanation={"Benar: 'berisiko' mencakup lost causes & sleeping dogs. Persuadable = ROI; kasus TelkoNusa membuktikan bedanya (net +Rp450jt vs ~0)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Sisa budget Rp200jt dari Rp2M. Alokasi terbaik?"}
  options={
    ["Habiskan ke channel terbaik",
    "Eksperimen channel baru (bandit mindset 10%)",
    "Simpan",
    "Bagi rata"]
  }
  correct={1}
  explanation={"Benar: alokasi 'optimal' hari ini = lokal optimum. 10% eksperimen = premi asuransi menemukan channel berikutnya."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Slide 1 presentasi direksi berisi?"}
  options={
    ["Metodologi lengkap",
    "3 keputusan + tabel segmen (what–so what–now what)",
    "50 chart",
    "Data mentah"]
  }
  correct={1}
  explanation={"Benar: direksi mengeksekusi keputusan, bukan metodologi. Detail di appendix. (MK18)."}
/>

      <h2 id="naratif">📝 Panduan Naratif: Menjalankan Capstone dari Awal hingga Akhir</h2>
<p>Bayangkan kamu adalah seorang analis data yang baru saja dipanggil oleh direktur pemasaran sebuah perusahaan e-commerce menengah. Ia terlihat cemas. &ldquo;Penjualan kita turun dua puluh persen dalam tiga bulan terakhir,&rdquo; katanya. &ldquo;Saya tidak tahu mengapa. Tim saya sudah mencoba berbagai hal — menambah budget iklan, membuat promo, mengganti agensi — tapi tidak ada yang berhasil. Bisakah kamu membantu?&rdquo;</p>
<p>Kamu mengangguk. Ini adalah momen yang tepat untuk menerapkan semua yang telah kamu pelajari dari MK1 hingga MK18. Ini bukan sekadar latihan — ini adalah capstone, proyek yang akan membuktikan bahwa kamu adalah seorang analis yang lengkap. Mari kita jalankan empat fase bersama-sama, langkah demi langkah, dengan detail yang lengkap.</p>
<h3>Fase 1: Diagnosa — Memahami Masalah dengan Mendalam</h3>
<p>Langkah pertama bukanlah membuka laptop dan menjalankan Python. Langkah pertama adalah mendengarkan. Kamu duduk bersama direktur pemasaran, manajer produk, tim customer service, dan bahkan beberapa pelanggan. Kamu bertanya: &ldquo;Kapan tepatnya penurunan dimulai? Apakah ada perubahan yang terjadi pada saat itu? Bagaimana perilaku pelanggan berubah?&rdquo;</p>
<p>Dari percakapan ini, kamu mendapatkan beberapa petunjuk awal. Penurunan dimulai sekitar tiga bulan yang lalu, yang bertepatan dengan peluncuran aplikasi mobile versi baru. Tim customer service melaporkan peningkatan keluhan tentang &ldquo;checkout yang error&rdquo;. Namun, tim produk bersikeras bahwa aplikasi baru &ldquo;lebih baik&rdquo; dari sebelumnya.</p>
<p>Kamu kemudian membuka data. Kamu membuat funnel dari MK1: visit → product view → add to cart → checkout → purchase. Kamu memisahkan antara desktop dan mobile, antara pengguna baru dan lama, antara berbagai kategori produk. Polanya mulai terlihat jelas.</p>
<p>Traffic (visit) sebenarnya naik sepuluh persen! Jadi masalahnya bukan pada akuisisi. Namun, conversion rate dari add to cart ke checkout turun drastis, terutama pada perangkat mobile. Pada desktop, penurunannya hanya lima persen. Pada mobile, penurunannya mencapai empat puluh persen! Ini adalah temuan yang sangat penting.</p>
<p>Kamu kemudian melakukan analisis deskriptif dari MK3. Kamu melihat distribusi, tren harian, dan membandingkan periode sebelum dan sesudah peluncuran aplikasi baru. Kamu menemukan bahwa penurunan dimulai tepat pada hari peluncuran aplikasi versi 2.0. Korelasinya sangat kuat.</p>
<p>Kamu juga melakukan segmentasi dari MK4. Kamu menemukan bahwa pengguna Android mengalami penurunan lima puluh persen, sementara pengguna iOS hanya sepuluh persen. Ini menunjukkan bahwa masalahnya spesifik pada platform Android.</p>
<p>Pada akhir Fase 1, kamu memiliki problem statement yang jelas: &ldquo;Conversion rate mobile Android turun lima puluh persen sejak peluncuran aplikasi versi 2.0 pada tanggal 1 Oktober, menyebabkan kehilangan pendapatan sebesar Rp1,8 miliar per bulan. Hipotesis utama adalah adanya bug pada proses checkout di aplikasi Android.&rdquo;</p>
<p>Fase 1 memakan waktu sekitar satu minggu. Kamu menghabiskan tiga hari untuk interview dan dua hari untuk analisis data awal. Ini adalah investasi waktu yang sangat berharga, karena tanpanya kamu mungkin akan menganalisis hal yang salah selama berminggu-minggu.</p>
<h3>Fase 2: Analisis — Mengkuantifikasi dan Menjelaskan</h3>
<p>Dengan hipotesis yang jelas, kamu sekarang masuk ke Fase 2: analisis mendalam. Tujuanmu adalah mengkuantifikasi dampak dan membuktikan hipotesis dengan data.</p>
<p>Pertama, kamu menghitung dampak finansial dengan presisi. Sebelum peluncuran, rata-rata ada seribu checkout berhasil per hari dari Android. Setelah peluncuran, hanya lima ratus. Selisihnya adalah lima ratus checkout per hari, atau lima belas ribu per bulan. Dengan rata-rata nilai transaksi Rp150 ribu, kerugiannya adalah Rp2,25 miliar per bulan! Angka ini bahkan lebih besar dari estimasi awal.</p>
<p>Kedua, kamu menganalisis lebih dalam menggunakan segmentasi. Kamu menemukan bahwa pengguna baru (yang menginstal aplikasi versi 2.0) mengalami penurunan enam puluh persen, sementara pengguna lama (yang masih menggunakan versi 1.x) hanya turun sepuluh persen. Ini semakin menguatkan hipotesis bug pada versi baru.</p>
<p>Ketiga, kamu melihat data customer service. Kamu menggunakan text analytics dari MK17 untuk menganalisis sepuluh ribu tiket komplain. Kamu menemukan bahwa tiga ribu di antaranya menyebutkan &ldquo;checkout&rdquo;, &ldquo;error&rdquo;, atau &ldquo;gagal bayar&rdquo;. Sentimennya sangat negatif. Topik utamanya adalah &ldquo;pembayaran gagal&rdquo; dan &ldquo;aplikasi crash&rdquo;.</p>
<p>Keempat, kamu melakukan analisis uplift dari MK11. Kamu bertanya: &ldquo;Jika kita memperbaiki bug ini, siapa yang akan kembali?&rdquo; Kamu menemukan bahwa tujuh puluh persen dari pengguna yang terdampak adalah &ldquo;persuadables&rdquo; — mereka akan kembali jika masalahnya diperbaiki. Tiga puluh persen sisanya adalah &ldquo;lost causes&rdquo; — mereka sudah pindah ke kompetitor.</p>
<p>Kelima, kamu membuat visualisasi yang jelas. Kamu membuat chart yang menunjukkan penurunan conversion rate dari waktu ke waktu, dengan garis vertikal pada tanggal peluncuran aplikasi baru. Kamu membuat heatmap yang menunjukkan penurunan per versi aplikasi dan per tipe perangkat. Semua visualisasi ini akan sangat berguna pada Fase 4.</p>
<p>Pada akhir Fase 2, kamu memiliki bukti yang kuat: (1) Dampak finansial Rp2,25 miliar per bulan, (2) Masalah spesifik pada Android versi 2.0, (3) Tiga ribu komplain terkait checkout, (4) Tujuh puluh persen pengguna akan kembali jika diperbaiki. Hipotesis terbukti!</p>
<p>Fase 2 memakan waktu dua minggu. Ini adalah fase terpanjang, sesuai dengan alokasi empat puluh persen waktu. Kamu menghabiskan waktu untuk analisis data, membuat visualisasi, dan memvalidasi temuan dengan tim teknis.</p>
<h3>Fase 3: Rekomendasi — Merumuskan Aksi Konkret</h3>
<p>Dengan bukti yang kuat, kamu sekarang harus merumuskan rekomendasi. Tujuannya bukan sekadar &ldquo;perbaiki bug&rdquo;, tetapi rekomendasi yang spesifik, terukur, dan dapat ditindaklanjuti.</p>
<p>Rekomendasi 1 (Prioritas P0 — Lakukan Hari Ini!): Rollback aplikasi Android ke versi 1.x sementara tim teknis memperbaiki bug pada versi 2.0. Dampak: memulihkan delapan puluh persen dari kerugian, atau sekitar Rp1,8 miliar per bulan. Effort: rendah (hanya perlu dua jam untuk rollback). Risiko: minimal (versi 1.x sudah terbukti stabil).</p>
<p>Rekomendasi 2 (Prioritas P1 — Lakukan Minggu Ini!): Kirimkan voucher kompensasi Rp50 ribu kepada lima belas ribu pengguna yang mengalami kegagalan checkout. Gunakan prinsip uplift dari MK11: targetkan hanya kepada &ldquo;persuadables&rdquo; (sekitar sepuluh ribu pengguna), bukan kepada semua. Dampak: mempertahankan tujuh ribu pelanggan (tujuh puluh persen dari sepuluh ribu), dengan nilai lifetime sekitar Rp1 miliar. Biaya: sepuluh ribu dikali Rp50 ribu sama dengan Rp500 juta. Net: positif Rp500 juta! Effort: sedang (perlu koordinasi dengan tim CRM).</p>
<p>Rekomendasi 3 (Prioritas P2 — Lakukan Bulan Ini!): Implementasikan proses QA yang lebih ketat untuk aplikasi mobile. Setiap update harus melalui pengujian pada minimal sepuluh tipe perangkat Android yang berbeda sebelum dirilis. Dampak: mencegah kejadian serupa di masa depan (nilai yang tidak terukur tetapi sangat besar). Effort: tinggi (perlu mengubah proses dan mungkin menambah staf QA).</p>
<p>Kamu juga menghitung ROI untuk setiap rekomendasi. Rekomendasi 1 memiliki ROI yang tidak terbatas (biaya hampir nol, manfaat Rp1,8 miliar). Rekomendasi 2 memiliki ROI seratus persen (biaya Rp500 juta, manfaat Rp1 miliar). Rekomendasi 3 memiliki ROI jangka panjang yang sulit diukur tetapi sangat penting.</p>
<p>Kamu memprioritaskan berdasarkan matriks impact vs effort. Rekomendasi 1 berada di kuadran &ldquo;quick win&rdquo; (impact tinggi, effort rendah) — lakukan segera! Rekomendasi 2 berada di kuadran &ldquo;major project&rdquo; (impact tinggi, effort sedang) — rencanakan dengan baik! Rekomendasi 3 berada di kuadran &ldquo;fill in&rdquo; (impact jangka panjang, effort tinggi) — lakukan secara bertahap!</p>
<p>Pada akhir Fase 3, kamu memiliki tiga rekomendasi yang jelas, dengan prioritas, dampak, biaya, dan langkah konkret. Kamu siap untuk mempresentasikannya.</p>
<p>Fase 3 memakan waktu satu minggu. Kamu menghabiskan tiga hari untuk merumuskan rekomendasi dan dua hari untuk menghitung ROI dan memprioritaskan.</p>
<h3>Fase 4: Presentasi — Menyampaikan dengan Meyakinkan</h3>
<p>Ini adalah fase yang paling menentukan. Kamu bisa memiliki analisis terbaik di dunia, tetapi jika tidak bisa menyampaikannya dengan baik, tidak akan ada yang terjadi.</p>
<p>Kamu menyiapkan presentasi tujuh slide. Slide 1: Masalah (&ldquo;Rp2,25 miliar per bulan hilang karena bug checkout Android&rdquo;). Slide 2: Bukti (&ldquo;Conversion turun 50% sejak 1 Oktober&rdquo; — dengan chart!). Slide 3: Detail (&ldquo;Android 2.0 bermasalah, iOS baik-baik saja&rdquo; — dengan heatmap!). Slide 4: Dampak pelanggan (&ldquo;3.000 komplain, sentimen negatif&rdquo; — dengan word cloud!). Slide 5: Rekomendasi 1 (&ldquo;Rollback hari ini, pulihkan Rp1,8 miliar&rdquo;). Slide 6: Rekomendasi 2 (&ldquo;Voucher untuk 10.000 pengguna, net positif Rp500 juta&rdquo;). Slide 7: Next step (&ldquo;Butuh persetujuan rollback hari ini. Tim siap.&rdquo;).</p>
<p>Kamu berlatih presentasi. Kamu memastikan bahwa setiap slide memiliki satu pesan utama. Kamu menyiapkan jawaban untuk pertanyaan yang mungkin muncul. Kamu menggunakan bahasa bisnis, bukan bahasa teknis. Kamu tidak mengatakan &ldquo;heterogeneous treatment effect&rdquo;, kamu mengatakan &ldquo;berpengaruh beda-beda untuk setiap pengguna&rdquo;.</p>
<p>Pada hari presentasi, direktur pemasaran, CTO, dan CFO hadir. Kamu memulai dengan masalah (bukan dengan metode!). Kamu menunjukkan angka Rp2,25 miliar — semua orang terkejut. Kamu menunjukkan bukti — semua orang mengangguk. Kamu memberikan rekomendasi — semua orang setuju.</p>
<p>CTO langsung memerintahkan rollback. Direktur pemasaran menyetujui voucher. CFO meminta laporan mingguan. Dalam satu jam, keputusan dibuat. Dalam dua jam, rollback dilakukan. Dalam satu hari, conversion mulai pulih.</p>
<p>Satu bulan kemudian, conversion sudah pulih sembilan puluh persen. Voucher berhasil mempertahankan tujuh ribu pelanggan. Proses QA baru diimplementasikan. Kamu dipromosikan menjadi Senior Analyst.</p>
<p>Fase 4 memakan waktu satu minggu (tiga hari persiapan, satu hari presentasi, satu hari follow-up). Ini adalah investasi yang sangat berharga.</p>
<div className="callout">
<p><strong>What:</strong> Empat fase capstone (diagnosa! analisis! rekomendasi! presentasi!). Dari masalah Rp2,25 miliar hingga solusi dan promosi.</p>
<p><strong>So what:</strong> <strong>Capstone</strong> = <strong>bukti</strong> kamu adalah <strong>analis lengkap</strong>. <strong>Bukan</strong> sekadar <strong>teknis</strong>, tapi <strong>bisnis</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Pilih</strong> masalah nyata! (2) <strong>Jalankan</strong> 4 fase! (3) <strong>Dokumentasikan</strong>! (4) <strong>Presentasikan</strong>! (5) <strong>Banggakan</strong>!</p>
</div>
<div className="tip">
<p><strong>💡 <em>Capstone</em> = <em>perjalanan</em> dari <em>masalah</em> ke <em>solusi</em> ke <em>dampak</em>. <em>Nikmati</em> perjalanannya.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-rubrik">📋 Rubrik Penilaian Capstone — Standar &ldquo;Lulus&rdquo; yang Jelas</h2>
<p>Capstone dinilai dari <strong>kualitas keputusan</strong>, bukan ketebalan laporan. Lima dimensi, masing-masing skor 1–4. Lulus = total ≥ 14 <strong>dan</strong> tidak ada dimensi bernilai 1.</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Dimensi (bobot)</th><th>1 — Kurang</th><th>2 — Cukup</th><th>3 — Baik</th><th>4 — Istimewa</th></tr></thead>
<tbody>
<tr><td><strong>Diagnosis</strong> (25%)</td><td>Angka tanpa breakdown; &ldquo;penjualan turun&rdquo; tanpa tahu di mana</td><td>Breakdown 1 level (per channel)</td><td>Cohort/RFM/funnel; akar masalah teridentifikasi</td><td>Diagnosis + <strong>kuantifikasi biaya</strong> masalah (Rp)</td></tr>
<tr><td><strong>Metodologi</strong> (20%)</td><td>Metode salah untuk pertanyaan</td><td>Metode benar, asumsi tak dinyatakan</td><td>Metode benar + asumsi &amp; keterbatasan jelas</td><td>+ <strong>validasi silang</strong> (2 metode sepakat / eksperimen)</td></tr>
<tr><td><strong>Keputusan</strong> (25%)</td><td>Tidak ada rekomendasi konkret</td><td>Rekomendasi ada, tak berdasar angka</td><td>Rekomendasi spesifik + estimasi dampak Rp</td><td>+ <strong>rencana eksekusi</strong> (siapa, kapan, metrik sukses)</td></tr>
<tr><td><strong>Kejujuran</strong> (15%)</td><td>Cherry-picking; ketidakpastian disembunyikan</td><td>Sebagian jujur</td><td>Interval, keterbatasan, &amp; &ldquo;yang tidak kami tahu&rdquo; dinyatakan</td><td>+ <strong>analisis &ldquo;bagaimana jika salah&rdquo;</strong></td></tr>
<tr><td><strong>Komunikasi</strong> (15%)</td><td>Direksi tidak paham</td><td>Paham sebagian</td><td>Executive summary 1 halaman yang jelas</td><td>+ <strong>cerita yang menggerakkan</strong> keputusan</td></tr>
</tbody>
</table>
</div>
<h3>Cara memakai rubrik (untuk belajar mandiri)</h3>
<ul>
<li><strong>Sebelum mulai:</strong> baca kolom &ldquo;4&rdquo; — itulah targetmu. Capstone tanpa target = jalan tanpa tujuan.</li>
<li><strong>Di tengah jalan:</strong> nilai draf sendiri per dimensi. Dimensi terendah = <strong>prioritas perbaikan</strong>, bukan dimensi favoritmu.</li>
<li><strong>Sebelum submit:</strong> cek &ldquo;tidak ada dimensi = 1&rdquo;. Satu dimensi jeblok (mis. tidak ada rekomendasi) = <strong>gagal otomatis</strong>, berapa pun bagusnya analisisnya. Analisis tanpa keputusan = hobi, bukan pekerjaan.</li>
<li><strong>Latihan peer-review:</strong> tukar capstone dengan teman, nilai dengan rubrik ini. Menilai orang lain = cara tercepat melihat kelemahan sendiri.</li>
</ul>
<div className="tip">
<p><strong>💡 Pola dari rubrik: 50% nilai = diagnosis + keputusan (bisnis), 20% = metodologi (teknik), 30% = kejujuran + komunikasi (kepercayaan). Analis junior biasanya terbalik: 80% waktu di metodologi, 20% di sisanya. Balik proporsinya — itulah bedanya analis dan ilmuwan.</strong></p>
</div>

      <h2 id="tambahan-summary">📊 Contoh: Executive Summary 1 Halaman yang Menggerakkan Keputusan</h2>
<p>Ini <strong>halaman pertama</strong> (dan sering satu-satunya yang dibaca) dari laporan capstone &ldquo;ModeKita&rdquo; — studi kasus fiksi yang merangkum 4 fase lesson ini. Perhatikan strukturnya: <strong>keputusan dulu, bukti kemudian, detail di appendix</strong>.</p>
<div className="callout">
<p><strong>EXECUTIVE SUMMARY — Optimalisasi Budget Marketing Rp2 Miliar/Tahun &ldquo;ModeKita&rdquo;</strong></p>
<p><strong>Rekomendasi (3 keputusan):</strong></p>
<ol>
<li><strong>Geser Rp600jt/tahun</strong> dari TV (marginal ROAS 0,6) ke digital prospekting (marginal ROAS 1,8) → estimasi <strong>+Rp720jt incremental revenue/tahun</strong>.</li>
<li><strong>Pangkas kalender promo</strong> 12x → 4x/tahun + voucher hanya untuk segmen persuadable → estimasi <strong>+Rp1,1M margin/tahun</strong> (berhenti subsidi sure-things).</li>
<li><strong>Program win-back</strong> 220rb pelanggan &ldquo;At Risk&rdquo; (biaya Rp3,3M) → estimasi <strong>+Rp12M margin/tahun</strong>.</li>
</ol>
<p><strong>Total dampak estimasi: +Rp13,8M margin/tahun</strong> dengan budget <strong>tetap</strong> Rp2M (murni realokasi + efisiensi).</p>
<p><strong>Bukti ringkas (1 baris per fase):</strong></p>
<ul>
<li><strong>Diagnosis:</strong> 38% revenue dari 6% Champions; 220rb pelanggan At Risk bocor Rp5,5M margin/bulan (RFM + cohort).</li>
<li><strong>Nilai:</strong> CLV Champions 8x rata-rata → mereka yang harus dipertahankan, bukan diakusisi ulang.</li>
<li><strong>Targeting:</strong> uplift model — hanya 18% penerima promo yang persuadable; 35% = sure-things (subsidi sia-sia).</li>
<li><strong>Alokasi:</strong> kurva saturasi — TV jenuh (marginal 0,6), digital lapar (1,8); realokasi menyamakan marginal.</li>
</ul>
<p><strong>Risiko &amp; ketidakpastian:</strong> estimasi ±25% (sensitivitas di appendix); risiko utama = eksekusi win-back (butuh tim CS 5 orang, 2 bulan setup). <strong>Yang tidak kami klaim:</strong> angka ini bukan janji — ia ekspektasi berbasis model yang divalidasi holdout.</p>
<p><strong>Diminta dari direksi:</strong> persetujuan 3 keputusan + tim eksekusi (nama terlampir). <strong>Timeline:</strong> 90 hari ke dampak pertama.</p>
</div>
<h3>Bedah kenapa summary ini bekerja</h3>
<ul>
<li><strong>Rekomendasi di 10 detik pertama.</strong> Direksi tidak perlu menggali 40 halaman untuk tahu &ldquo;jadi saya harus apa?&rdquo;.</li>
<li><strong>Setiap rekomendasi punya angka Rp.</strong> &ldquo;Geser budget&rdquo; tanpa angka = opini; dengan angka = keputusan.</li>
<li><strong>Bukti 1 baris per fase</strong> — cukup untuk percaya, tidak cukup untuk tenggelam. Detail di appendix untuk yang mau verifikasi.</li>
<li><strong>Risiko dinyatakan duluan.</strong> Paradoks: mengakui ketidakpastian <strong>menaikkan</strong> kepercayaan, bukan menurunkannya.</li>
<li><strong>Ask yang konkret</strong> (&ldquo;persetujuan + tim&rdquo;) — summary tanpa ask = presentasi yang berakhir dengan &ldquo;menarik, kita pikirkan dulu&rdquo; (= mati).</li>
</ul>
<div className="tip">
<p><strong>💡 Latihan: tulis executive summary capstone-mu <em>sebelum</em> analisis selesai — sebagai hipotesis. Lalu bandingkan di akhir: di mana hipotesismu salah? Selisihnya = <strong>yang benar-benar kamu pelajari</strong>. Analis hebat menulis summary dua kali: sekali sebagai tebakan, sekali sebagai kesimpulan.</strong></p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Capstone</h2>
<h3>1. &ldquo;Datanya harus data asli perusahaan?&rdquo;</h3>
<p><strong>Tidak harus — tapi harus <em>realistis</em>.</strong> Boleh: data publik (e-commerce dataset, retail), data simulasi yang dikalibrasi ke pola nyata, atau data perusahaan (dengan izin &amp; anonimisasi). Yang dinilai bukan &ldquo;keaslian&rdquo; data, melainkan <strong>kualitas keputusan</strong> di atasnya. Data simulasi yang dianalisis tajam &gt; data asli yang hanya dideskripsikan.</p>
<h3>2. &ldquo;Berapa panjang laporan yang ideal?&rdquo;</h3>
<p><strong>Executive summary: 1 halaman. Laporan inti: 8–12 halaman. Appendix: bebas.</strong> Aturan: tiap halaman inti harus <strong>mengubah atau menguatkan keputusan</strong> — halaman yang tidak melakukan keduanya = dibuang. Capstone 40 halaman yang berputar-putar kalah dari 10 halaman yang tajam. Direksi membaca 1 halaman; tim teknis membaca 12; auditor membaca appendix.</p>
<h3>3. &ldquo;Bolehkah hasilnya &lsquo;tidak ada temuan menarik&rsquo;?&rdquo;</h3>
<p><strong>Boleh — jika jujur &amp; metodologinya benar.</strong> &ldquo;Setelah analisis 4 fase, tidak ada realokasi yang justified: semua channel sudah di titik optimal marginal&rdquo; = <strong>temuan yang valid</strong> (dan berani!). Yang gagal = memaksakan temuan (&ldquo;pokoknya harus ada yang digeser&rdquo;) atau menyembunyikan hasil nol. Sains yang jujur &gt; cerita yang dipaksakan.</p>
<h3>4. &ldquo;Bagaimana jika stakeholder tidak setuju dengan rekomendasi?&rdquo;</h3>
<p><strong>Itu normal — siapkan lapis pertahanan:</strong> (a) tunjukkan <strong>asumsi</strong>-nya (&ldquo;jika Anda percaya X, maka Y&rdquo; — biarkan ia menyerang asumsi, bukan kamu); (b) tawarkan <strong>pilota kecil</strong> (&ldquo;coba di 2 kota dulu, 2 bulan&rdquo; — risiko kecil, bukti nyata); (c) <strong>dokumentasikan</strong> rekomendasi &amp; penolakannya — 6 bulan kemudian saat masalah meledak, catatan ini = kredibilitasmu. Analis bukan raja — ia <strong>penasihat yang catatannya rapi</strong>.</p>
<h3>5. &ldquo;Tools apa yang boleh dipakai?&rdquo;</h3>
<p><strong>Apa pun — yang dinilai bukan tools-nya.</strong> Python/R/spreadsheet semua sah. Tapi: (a) <strong>kode harus reproducible</strong> (orang lain bisa run &amp; dapat angka sama); (b) <strong>jangan sembunyikan di balik black-box</strong> (&ldquo;AI bilang begitu&rdquo; bukan metodologi); (c) pilih tools yang <strong>tim bisa maintain</strong> — model XGBoost yang tidak dimengerti tim = tidak akan dipakai lagi setelah kamu pergi.</p>
<h3>6. &ldquo;Capstone individu vs kelompok?&rdquo;</h3>
<p><strong>Individu untuk pembelajaran</strong> (kamu harus bisa semua fase sendiri). <strong>Kelompok untuk realisme</strong> (dunia nyata = tim). Jika kelompok: bagi <strong>per fase</strong> dengan <strong>pemilik jelas</strong> + 1 integrator (yang memastikan angka antar-fase konsisten — pekerjaan tersulit!). Aturan anti-free-rider: tiap anggota presentasi <strong>fasenya sendiri</strong> + menjawab pertanyaan fase lain (memaksa pemahaman penuh).</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: capstone = <em>simulasi pekerjaan analis sesungguhnya</em>. Penilainya bukan &ldquo;benar/salah&rdquo; melainkan &ldquo;apakah saya berani mengambil keputusan Rp2 miliar berdasarkan pekerjaan ini?&rdquo;. Standar itu — <em>keberanian untuk dipercaya</em> — adalah seluruh isi lesson MK1–MK19.</strong></p>
</div>

            <h2 id="tambahan-checklist">🧰 Checklist Submit: 15 Titik Sebelum Capstone Dinyatakan Selesai</h2>
<p>Jalankan checklist ini <strong>48 jam sebelum submit</strong> — cukup waktu memperbaiki tanpa panik.</p>
<div className="callout">
<h3>Integritas angka (5 titik)</h3>
<ol>
<li>Setiap angka di executive summary <strong>tertelusur</strong> ke appendix (nomor halaman/sheet)?</li>
<li>Kode <strong>reproducible</strong> dari nol (run ulang → angka sama)?</li>
<li>Tidak ada <strong>cherry-picking</strong> periode/segmen (uji: ganti window waktu ±1 bulan — kesimpulan bertahan?)</li>
<li>Ketidakpastian <strong>dinyatakan</strong> (interval / ±%) di setiap estimasi dampak?</li>
<li>Asumsi <strong>terdaftar eksplisit</strong> (1 halaman daftar asumsi)?</li>
</ol>
<h3>Kualitas keputusan (5 titik)</h3>
<ol start={6}>
<li>Ada <strong>rekomendasi konkret</strong> (bukan &ldquo;perlu ditingkatkan&rdquo;)?</li>
<li>Setiap rekomendasi punya <strong>estimasi dampak Rp</strong> + <strong>pemilik</strong> + <strong>timeline</strong>?</li>
<li>Ada <strong>rencana jika salah</strong> (pilot kecil / kill criteria)?</li>
<li>Alternatif yang <strong>ditolak</strong> disebutkan + alasannya (menunjukkan kamu mempertimbangkan opsi)?</li>
<li><strong>Ask ke direksi jelas</strong> (persetujuan apa, dari siapa, kapan)?</li>
</ol>
<h3>Komunikasi (5 titik)</h3>
<ol start={11}>
<li>Executive summary <strong>1 halaman</strong>, keputusan di 10 detik pertama?</li>
<li>Setiap grafik punya <strong>judul kesimpulan</strong> (bukan &ldquo;Grafik 7&rdquo;)?</li>
<li>Istilah teknis <strong>dijelaskan atau dibuang</strong> (uji: apakah ibumu paham intinya?)</li>
<li>Tidak ada <strong>typo angka</strong> (baca ulang semua angka 2x — typo Rp vs ribu = fatal)?</li>
<li>File <strong>rapi &amp; bernama jelas</strong> (bukan &ldquo;final_v7_beneran.xlsx&rdquo;)?</li>
</ol>
</div>
<h3>Ritual 48 jam</h3>
<p><strong>H-48:</strong> jalankan checklist, perbaiki yang merah. <strong>H-24:</strong> minta <strong>1 orang</strong> membaca executive summary saja, lalu tanya: &ldquo;apa yang harus kita lakukan?&rdquo; — jika jawabannya ≠ rekomendasimu, summary-mu gagal. <strong>H-12:</strong> berhenti mengutak-atik analisis; fokus ke kerapian &amp; narasi. <strong>H-2:</strong> backup semua file di 2 tempat. <strong>H-0:</strong> submit — dan <strong>catat</strong> 3 hal yang akan kamu lakukan berbeda lain kali (inilah compounding skill-mu).</p>
<p><strong>Setelah submit — ritual penutup yang membedakan profesional:</strong> (1) <strong>arsipkan</strong> data + kode + laporan dengan README 1 paragraf (&ldquo;capstone ini menjawab X dengan data Y, kesimpulan Z&rdquo;) — 6 bulan lagi kamu akan berterima kasih pada dirimu sendiri; (2) <strong>minta feedback tertulis</strong> dari 1 reviewer (&ldquo;apa 1 hal terkuat &amp; 1 hal terlemah?&rdquo;) — feedback lisan menguap, tulisan menetap; (3) <strong>publikasikan versi sanitized</strong> (portofolio!) — capstone yang hanya dibaca penilai = setengah nilai; yang dibaca recruiter = karier. Pekerjaan yang tidak terlihat = pekerjaan yang tidak pernah ada.</p>
<p><strong>Satu nasihat terakhir:</strong> capstone terbaik bukan yang paling canggih — melainkan yang <strong>paling dipakai</strong>. Enam bulan setelah submit, tanyakan ke stakeholder: &ldquo;rekomendasi mana yang jalan?&rdquo; Jika jawabannya &ldquo;semuanya&rdquo;, kamu analis kelas dunia. Jika &ldquo;tidak ada&rdquo;, jangan salahkan mereka — tanyakan apa yang kurang dari <em>pekerjaanmu</em> (kepercayaan? timing? politik?). Capstone ini = latihan; kariermu = pengulangan latihan ini ratusan kali, tiap kali sedikit lebih tajam.</p>
<p>Dan ingat tujuan akhirnya: <strong>kepercayaan</strong>. Semua teknik MK1–MK19 — tracking, cohort, RFM, segmentasi, eksperimen, uplift, atribusi, MMM, pricing, forecasting, ads, text analytics, etika — bermuara ke satu hal: <strong>direksi berani mengambil keputusan besar berdasarkan pekerjaanmu</strong>. Kepercayaan itu dibangun satu laporan jujur pada satu waktu, dan hancur oleh satu angka yang dipercantik. Jagalah seperti kariermu bergantung padanya — karena memang begitu.</p>
<div className="tip">
<p><strong>💡 Checklist ini = <em>standar profesional</em>. Analis yang submit tanpa checklist mengandalkan ingatan — dan ingatan selalu melupakan 1 hal penting. Bedanya amatir dan profesional bukan kepintaran — melainkan <em>sistem yang mencegah kesalahan bodoh</em>. Pilot pesawat pakai checklist untuk hal yang sudah mereka hafal; analis boleh apa?</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Fase 1 (Diagnosis)</strong>: funnel, cohort, RFM, churn — di mana bocor, siapa berisiko.</li>
<li><strong>Fase 2 (Nilai)</strong>: CLV per segmen → batas CAC = CLV/3 — aturan main alokasi.</li>
<li><strong>Fase 3 (Targeting)</strong>: uplift → persuadable; net value = uplift×CLV − biaya; jangan ganggu sleeping dogs.</li>
<li><strong>Fase 4 (Alokasi)</strong>: batas CAC + marginal ROI + 10% eksperimen.</li>
<li><strong>Deliverable</strong>: 1 halaman what–so what–now what; detail di appendix.</li>
<li><strong>Hari 0</strong>: audit definisi & tracking (MK2) — fondasi semua fase.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk18-etika" className="btn btn-secondary btn-sm">← MK18</Link>
        <Link href="/learn/pm-a1-ethics" className="btn btn-primary btn-sm">PM-A1 →</Link>
      </div>
    </div>
  );
}

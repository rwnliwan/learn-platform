"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk10IncrementalityPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK10 — Marketing Data Analytics</span>
        <h1 className="display-title">Incrementality:<br/>Apakah Iklanmu Benar-Benar Menambah?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Iklan Rp1 Miliar yang 'Menghasilkan' Rp3 Miliar</a></li>
<li><a href="#inkremen">Incrementality & Holdout</a></li>
<li><a href="#geo">Geo-Experiment</a></li>
<li><a href="#causal">Causal Impact</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Mengukur yang Tidak Terjadi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Rp1 Miliar SegarSari</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Audit Incrementality Rp5 Miliar Budget</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Incrementality</a></li>
<li><a href="#extra3">📋 Playbook: Kalender Pengukuran Incrementality</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Keputusan Incrementality</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Membela Holdout</a></li>
<li><a href="#faq">❓ Tanya-Jawab Kilat</a></li>
<li><a href="#synthetic">📊 Bedah Metode: Synthetic Control</a></li>
<li><a href="#kalkulator">💰 Kalkulator Keputusan: Kapan Holdout Worth It?</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Membedakan attributed conversion vs incremental lift dengan contoh angka.</li>
<li>Merancang holdout experiment (user-level) dan menghitung lift + signifikansinya.</li>
<li>Menjelaskan kapan geo-experiment dibutuhkan dan cara memilih matched markets.</li>
<li>Membaca output Causal Impact: actual vs counterfactual + interval.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Iklan Rp1 Miliar yang 'Menghasilkan' Rp3 Miliar</h2>
      <div className="story">
        <p>Brand FMCG <em>&ldquo;SegarSari&rdquo;</em> menghabiskan Rp1 miliar untuk iklan TV. Laporan agensi: <strong>&ldquo;Rp3 miliar penjualan teratribusi ke kampanye!&rdquo;</strong> (pemirsa yang melihat iklan lalu membeli). Direksi puas, budget TV dipertahankan.</p>
<p>Twist-nya: analis independen menjalankan <strong>geo-experiment</strong> — 10 kota dapat iklan, 10 kota mirip tidak. Hasil: kota beriklan naik Rp300jt, kota kontrol naik Rp280jt (tren umum). <strong>Lift inkremental = Rp20jt</strong>, bukan Rp3 miliar! Yang Rp3 miliar itu sebagian besar orang yang <em>memang akan beli</em> (loyalis yang kebetulan nonton TV). <strong>Atribusi ≠ inkrementalitas.</strong> Rp1 miliar dibakar untuk Rp20jt tambahan. Lesson ini: cara mengukur apa yang <em>benar-benar</em> disebabkan iklanmu.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="inkremen">Incrementality — 'Andai Tidak Ada Iklan...'</h2>
<p><strong>Definisi.</strong> <strong>Incrementality</strong> = penjualan <em>tambahan</em> yang disebabkan marketing — di atas yang <em>akan terjadi anyway</em> (baseline). <strong>Attributed</strong> = penjualan yang &ldquo;bersentuhan&rdquo; dengan iklan (klik, view). Hubungan: <em>incremental ≤ attributed</em>, selalu. Selisihnya = <strong>kannibalisasi atribusi</strong> (mengklaim penjualan yang memang akan terjadi).</p>
<p><strong>Holdout experiment</strong>: acak user/wilayah ke <em>treated</em> (lihat iklan) vs <em>holdout</em> (tidak). Lift = (treated − holdout)/holdout. Ini standar emas digital (Meta/Google punya fitur holdout bawaan).</p>
<Tex math={String.raw`\text{Lift} = \frac{\bar{Y}_T - \bar{Y}_C}{\bar{Y}_C} \quad;\quad \text{iROAS} = \frac{\text{Lift} \times \text{Revenue}_T}{\text{Spend}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\bar{Y}_T`} />: rata-rata outcome grup treated (lihat iklan)</li>
<li><Tex math={String.raw`\bar{Y}_C`} />: rata-rata outcome grup holdout (tidak lihat)</li>
<li><Tex math={String.raw`\text{iROAS}`} />: incremental ROAS — return per rupiah dari penjualan <em>tambahan</em> (bandingkan dengan ROAS atribusi yang membengkak)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Atribusi seperti <strong>memberi medali ke semua orang yang hadir saat gol</strong> — termasuk penonton. Incrementality bertanya: <strong>&lsquo;kalau pemain ini tidak main, apakah gol tetap terjadi?&rsquo;</strong> Holdout = mencadangkan pemain itu di beberapa pertandingan dan melihat skornya.</p>
<p><strong>Kapan dipakai:</strong> Setiap klaim &lsquo;kampanye menghasilkan X&rsquo; — tanya dulu: X ini attributed atau incremental? Untuk budget besar, holdout wajib.</p>
<details className="worked">
<summary>📐 Contoh: Holdout iklan display (klik untuk buka)</summary>
<p>1 juta user diacak: 900rb treated (lihat banner), 100rb holdout (tidak). Conversion 30 hari: treated 3,0%, holdout 2,7%.</p>
<p><strong>Lift</strong> = (3,0 − 2,7)/2,7 = <strong>11,1%</strong>. Dari 27.000 pembeli treated (900rb × 3%), yang inkremental = 27.000 × (0,3/3,0) = <strong>2.700</strong>. Sisanya 24.300 = akan beli anyway.</p>
<p><strong>iROAS</strong>: spend Rp500jt, revenue/pembeli Rp1jt → incremental revenue Rp2,7M → iROAS = <strong>5,4</strong>. Platform melaporkan &ldquo;ROAS atribusi&rdquo; 54 (27.000 × Rp1jt / Rp500jt) — <strong>10x lipat lebih besar</strong> dari kenyataan inkremental. Inilah jurang yang memisahkan analis dan agensi.</p>
</details>
<PlotlyChart
  data={[{x: ["Attributed (klaim platform)", "Incremental (holdout)"], y: [54, 5.4], type: "bar", marker: {color: ["#e8a838", "#2a7de1"]}, text: ["54x", "5,4x"], textposition: "outside"}]}
  title={"ROAS atribusi vs iROAS — jurang 10x"}
  layout={{yaxis: {title: "ROAS"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang: kiri = ROAS versi platform (atribusi), kanan = iROAS dari holdout (inkremental).</p>
<p><strong>Interpretasi:</strong> Jurang 10x lipat. Keputusan budget berbasis 54x vs 5,4x = keputusan yang beda total. Aturan: <strong>jangan alokasikan budget dari angka atribusi platform</strong> — platform dibayar saat kamu percaya angkanya (conflict of interest!).</p>
</div>
<h2 id="geo">Geo-Experiment — Saat User Tidak Bisa Diacak</h2>
<p><strong>Definisi.</strong> Channel seperti <strong>TV, radio, OOH (billboard), atau promo toko fisik</strong> tidak bisa diacak per user — iklannya menyebar per wilayah. Solusi: <strong>geo-experiment</strong> — acak <em>wilayah</em> (kota/provinsi) ke treated vs kontrol, lalu estimasi efek dengan <strong>DiD</strong> (MK9): (treated_post − treated_pre) − (kontrol_post − kontrol_pre).</p>
<p>Kunci: <strong>matched markets</strong> — pilih kontrol yang mirip treated (ukuran, tren, musiman) <em>sebelum</em> eksperimen. 10+10 kota lebih baik dari 2+2 (variansi antar-kota besar). Durasi: cukup lama untuk efek (TV butuh 4–8 minggu), cukup singkat agar dunia tidak berubah.</p>
<Tex math={String.raw`\hat{\tau}_{geo} = (\bar{Y}_{T,post} - \bar{Y}_{T,pre}) - (\bar{Y}_{C,post} - \bar{Y}_{C,pre})`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\bar{Y}_{T,pre}`} />: rata-rata penjualan kota treated sebelum kampanye</li>
<li><Tex math={String.raw`\hat{\tau}_{geo}`} />: estimasi lift inkremental kampanye</li>
<li>Sama seperti DiD di MK9 — bedanya unit randomisasi = kota, bukan user</li>
<li>Waspadai <em>spillover</em>: orang kota kontrol nonton TV kota treated (perbatasan) — pakai buffer geografis</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Geo-experiment seperti <strong>uji pupuk per kebun</strong> (bukan per tanaman): satu kebun dipupuk, kebun tetangga yang tanahnya mirip tidak. Kalau kebunmu di lereng dan tetangga di lembah (tidak matched), perbandingannya sampah — pupuk atau tanahnya yang bekerja?</p>
<p><strong>Kapan dipakai:</strong> TV, radio, OOH, promo ritel fisik, atau kapan pun targeting per user mustahil. Standar untuk mengukur 'above the line'.</p>
<details className="worked">
<summary>📐 Contoh: Geo-experiment SegarSari (klik untuk buka)</summary>
<p>10 kota treated (iklan TV), 10 kota kontrol (matched: ukuran &amp; tren mirip). Penjualan mingguan rata-rata per kota: treated pre Rp100jt → post Rp130jt (+30). Kontrol pre Rp95jt → post Rp123jt (+28).</p>
<p><strong>DiD</strong> = (130−100) − (123−95) = 30 − 28 = <strong>+Rp2jt/kota/minggu</strong>. Total 10 kota × 8 minggu = <strong>Rp160jt inkremental</strong>. Spend Rp1M → iROAS = 0,16. <strong>Bencana.</strong></p>
<p><strong>Cek validitas:</strong> 8 minggu pre-test, tren treated vs kontrol sejajar? (parallel trends). Jika ya → kesimpulan sahih: TV tidak bekerja untuk brand ini (atau kreatifnya yang salah — test berikutnya: kreatif baru, bukan channel baru).</p>
</details>
<PlotlyChart
  data={[{x: ["Pre", "Post"], y: [100, 130], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Treated (TV)"}, {x: ["Pre", "Post"], y: [95, 123], type: "scatter", mode: "lines+markers", marker: {color: "#94a3b8"}, name: "Kontrol"}]}
  title={"Geo-experiment: dua garis yang (hampir) sejajar"}
  layout={{xaxis: {title: "Periode"}, yaxis: {title: "Penjualan/kota/minggu (Rp jt)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua garis: biru = kota beriklan, abu = kontrol. Jarak vertikal antar garis = efek. Kalau garis bergerak sejajar, efek ≈ 0.</p>
<p><strong>Interpretasi:</strong> Kedua garis naik <strong>sejajar</strong> (+30 vs +28) — kenaikan treated hampir seluruhnya tren umum, bukan iklan. DiD cuma +2. Visual ini = Rp1 miliar yang terbakar, digambar dalam dua garis. Inilah kenapa geo-experiment menakutkan bagi yang hidup dari klaim atribusi.</p>
</div>
<h2 id="causal">Causal Impact — Membangun 'Dunia Tanpa Iklan'</h2>
<p><strong>Definisi.</strong> <strong>Causal Impact</strong> (Google, Bayesian structural time series): saat tidak ada grup kontrol bersih, bangun <strong>counterfactual</strong> — &ldquo;dunia tanpa intervensi&rdquo; — dari data historis + prediktor eksternal (kota kontrol, tren pasar). Bandingkan aktual vs counterfactual + interval kredibel. Output: grafik tiga panel (aktual vs prediksi, selisih pointwise, selisih kumulatif).</p>
<p>Kekuatan: bekerja untuk <strong>satu wilayah</strong> (mis. nasional, tidak bisa di-split) dan menangkap dinamika waktu. Kelemahan: <strong>sebagus prediktornya</strong> — jika tidak ada prediktor yang berkorelasi baik dengan target pre-intervensi, counterfactual-nya ngawur (cek fit pre-period!).</p>
<p><strong>Kepribadian/intuisi:</strong> Causal Impact seperti <strong>meteorolog yang memprediksi cuaca tanpa badai</strong>: dari pola historis + kota tetangga, ia menggambar &lsquo;seharusnya cerah begini&rsquo; — lalu selisih dengan hujan aktual = efek badai. Kalau modelnya tidak bisa memprediksi cuaca cerah dengan baik (pre-period jelek), jangan percaya efek badainya.</p>
<p><strong>Kapan dipakai:</strong> Intervensi nasional/tunggal (tidak bisa geo-split), atau validasi silang hasil geo-experiment. Selalu cek kecocokan pre-period dulu.</p>
<details className="worked">
<summary>📐 Contoh: Membaca output Causal Impact (klik untuk buka)</summary>
<p><strong>Panel 1:</strong> garis aktual (hitam) vs counterfactual (biru, dengan pita). Pre-period: hitam menempel di tengah pita → model bagus.</p>
<p><strong>Panel 2 (pointwise):</strong> selisih harian aktual − counterfactual. Positif konsisten setelah intervensi → efek nyata.</p>
<p><strong>Panel 3 (kumulatif):</strong> total efek + interval. Mis. +Rp160jt (95% CI: +Rp40jt s.d. +Rp280jt). <strong>Jika interval mencakup 0 → tidak signifikan</strong> — jangan klaim efek.</p>
<p>Aturan baca: panel 1 validasi model, panel 2 timing efek, panel 3 keputusan (dengan ketidakpastian jujur).</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Mengukur yang Tidak Terjadi</h2>
<p>Incrementality menjawab pertanyaan <strong>tersulit</strong> di marketing: &ldquo;dari Rp3 miliar revenue yang &lsquo;dihasilkan&rsquo; iklan, berapa yang <strong>benar-benar</strong> karena iklan — dan berapa yang <strong>terjadi sendiri</strong>?&rdquo; Ini = <strong>mengukur dunia yang tidak terjadi</strong> (kontrafaktual). Tiga pendalaman: (1) mengapa atribusi ≠ incrementality; (2) geo-experiment — randomisasi saat user tidak bisa diacak; (3) Causal Impact — membangun &ldquo;dunia tanpa iklan&rdquo; dari data.</p>
<h3>1. Atribusi ≠ Incrementality — Dua Pertanyaan Berbeda</h3>
<p><strong>Definisi.</strong> <em>Atribusi</em>: &ldquo;channel mana yang <strong>terlibat</strong> dalam pembelian?&rdquo; (observasional, melihat ke belakang). <em>Incrementality</em>: &ldquo;berapa pembelian yang <strong>tidak terjadi</strong> tanpa channel ini?&rdquo; (kausal, butuh kontrafaktual).</p>
<p><strong>Kepribadian/intuisi:</strong> Atribusi seperti <strong>memberi medali ke semua yang hadir</strong> di garis finish — termasuk penonton yang kebetulan lewat. Incrementality seperti <strong>bertanya</strong>: &ldquo;jika pelari ini tidak ikut, apakah ia tetap sampai finish?&rdquo; Iklan <strong>branded search</strong> (&ldquo;tokomu&rdquo; di Google) mendapat atribusi <strong>raksasa</strong> — tapi incrementality-nya <strong>kecil</strong> (orang sudah mau beli, tinggal klik!).</p>
<p><strong>Contoh angka:</strong> branded search &ldquo;menghasilkan&rdquo; Rp1M (atribusi last-click). Matikan seminggu (holdout!): revenue turun <strong>cuma Rp150rb</strong> — 85% pembeli <strong>pindah</strong> ke direct/organik! <strong>Incrementality = 15%</strong>. Rp850rb = <strong>uang yang &ldquo;diatribusikan&rdquo; tapi bukan karena iklan</strong>.</p>
<p><strong>Kapan dipakai:</strong> Atribusi untuk <strong>operasional</strong> (laporan, optimasi taktis). Incrementality untuk <strong>keputusan budget</strong> (naik/turun/matikan channel!). Jangan pernah pakai atribusi untuk keputusan matikan channel — itu <strong>bunuh diri</strong> yang terlihat cerdas.</p>
<Tex math={String.raw`\text{Incrementality} = \frac{\text{Revenue}_{\text{dengan iklan}} - \text{Revenue}_{\text{tanpa iklan}}}{\text{Biaya iklan}}`} block />
<p><strong>Artinya tiap simbol:</strong> pembilang = <strong>lift kausal</strong> (butuh eksperimen!); penyebut = biaya. Ini = <strong>iROAS</strong> (<em>incremental ROAS</em>) — bandingkan dengan ROAS atribusi yang <strong>selalu</strong> lebih besar (dan menipu!).</p>
<details className="worked">
<summary>📐 Contoh 1a: Branded search dibedah (klik untuk buka)</summary>
<p>Spend branded search: Rp200jt/bulan. Atribusi last-click: Rp800jt (ROAS 4,0!). &ldquo;Pertahankan!&rdquo;</p>
<p><strong>Langkah 1 — Holdout:</strong> matikan 50% wilayah (geo-experiment!) 2 minggu.</p>
<p><strong>Langkah 2 — Hasil:</strong> wilayah mati: revenue turun <strong>Rp60jt</strong> (dari Rp400jt → Rp340jt). Bukan Rp400jt!</p>
<p><strong>Langkah 3 — iROAS:</strong> (60jt × 2 minggu → Rp120jt/bulan) / Rp200jt = <strong>0,6</strong>. Di bawah 1 = <strong>rugi</strong>!</p>
<p><strong>Langkah 4 — Keputusan:</strong> <strong>potong 70%</strong> branded search (sisakan untuk <strong>defensif</strong> vs kompetitor bidding!). Alihkan Rp140jt ke <strong>prospecting</strong> (iROAS 2,5!).</p>
<p><strong>Pelajaran:</strong> ROAS 4,0 → iROAS 0,6. <strong>Atribusi berbohong 7x lipat.</strong> Tanpa holdout, kamu <strong>tidak akan pernah tahu</strong>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Kapan atribusi &ldquo;cukup&rdquo;? (klik untuk buka)</summary>
<p><strong>Atribusi cukup</strong> untuk: (a) <strong>optimasi dalam channel</strong> (kreatif A vs B — incrementality <strong>sama</strong> untuk keduanya!), (b) <strong>monitoring</strong> harian, (c) <strong>channel baru kecil</strong> (belum worth eksperimen mahal).</p>
<p><strong>Incrementality wajib</strong> untuk: (a) <strong>keputusan budget besar</strong> (&gt; Rp100jt/bulan!), (b) <strong>channel &ldquo;panen&rdquo;</strong> (branded, retargeting — atribusi <strong>pasti</strong> overclaim!), (c) <strong>sebelum scale 2x+</strong>.</p>
<p><strong>Aturan praktis:</strong> <strong>20%</strong> budget measurement untuk incrementality (holdout/geo) → <strong>mengkalibrasi</strong> 80% atribusi harian. <strong>Atribusi yang dikalibrasi</strong> = terbaik dari dua dunia.</p>
</details>
<h3>2. Geo-Experiment — Randomisasi Saat User Tak Bisa Diacak</h3>
<p><strong>Definisi.</strong> <em>Geo-experiment</em>: acak <strong>wilayah</strong> (kota/provinsi), bukan user. Wilayah A: iklan jalan. Wilayah B: iklan mati (holdout). Bandingkan <strong>perubahan</strong> (DiD: <em>difference-in-differences</em>!).</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti <strong>uji obat per desa</strong> (bukan per orang!) — saat obatnya <strong>menular</strong> (iklan TV tidak bisa &ldquo;tidak dilihat&rdquo; separuh kota!). Desa A dapat obat, desa B tidak. Bandingkan <strong>perubahan</strong> kesehatan (bukan level! — desa A mungkin memang lebih sehat dari awal!).</p>
<p><strong>DiD:</strong> efek = (A_sesudah − A_sebelum) − (B_sesudah − B_sebelum). <strong>Mengapa selisih ganda?</strong> Karena A dan B <strong>beda level</strong> (Jakarta vs Surabaya!) — yang penting <strong>perubahannya</strong>, bukan levelnya. Asumsi: <strong>parallel trends</strong> (tanpa iklan, A &amp; B bergerak <strong>searah</strong>!).</p>
<p><strong>Kapan dipakai:</strong> Channel <strong>tidak ter-target user-level</strong> (TV, radio, OOH!), atau saat <strong>privacy</strong> membunuh tracking (iOS!). Tidak untuk: efek <strong>sangat kecil</strong> (butuh banyak geo!) atau <strong>spillover antar-geo</strong> (orang Jakarta belanja di Bogor!).</p>
<Tex math={String.raw`\hat{\tau}_{DiD} = (\bar{Y}_{A,1} - \bar{Y}_{A,0}) - (\bar{Y}_{B,1} - \bar{Y}_{B,0})`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\hat{\tau}_{DiD}`} /> = estimasi efek; <Tex math={String.raw`\bar{Y}_{A,1}`} /> = rata-rata A <strong>sesudah</strong>; <Tex math={String.raw`\bar{Y}_{A,0}`} /> = A <strong>sebelum</strong>; B = kontrol. <strong>Selisih dari selisih</strong> = membuang perbedaan level permanen!</p>
<details className="worked">
<summary>📐 Contoh 2a: DiD iklan TV (klik untuk buka)</summary>
<p>Iklan TV di <strong>Jawa Barat</strong> (A), <strong>Jawa Tengah</strong> holdout (B). Revenue mingguan (Rp M):</p>
<p><strong>Sebelum:</strong> A=100, B=80. <strong>Sesudah (4 minggu iklan):</strong> A=130, B=85.</p>
<p><strong>Langkah 1 — Naif (bandingkan level):</strong> 130 vs 85 = +45?? <strong>Salah!</strong> A memang selalu lebih besar!</p>
<p><strong>Langkah 2 — DiD:</strong> (130−100) − (85−80) = 30 − 5 = <strong>+25</strong>. Efek iklan = <strong>Rp25M/minggu</strong>.</p>
<p><strong>Langkah 3 — iROAS:</strong> biaya TV Rp40M/minggu → iROAS = 25/40 = <strong>0,625</strong>. <strong>Rugi!</strong> (Tapi: efek <strong>brand jangka panjang</strong> belum masuk — DiD 4 minggu = <strong>efek pendek</strong>!)</p>
<p><strong>Pelajaran:</strong> DiD membuang <strong>perbedaan level</strong> (100 vs 80) dan mengambil <strong>perubahan</strong> (+30 vs +5). Tanpa DiD = <strong>+45 (ngawur)</strong>. Dengan DiD = <strong>+25 (jujur)</strong>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 2b: Parallel trends — asumsi yang harus dicek (klik untuk buka)</summary>
<p><strong>Asumsi:</strong> tanpa iklan, A &amp; B bergerak <strong>searah</strong> (tidak harus sama level!).</p>
<p><strong>Langkah 1 — Cek pra-periode:</strong> 8 minggu sebelum: A naik 2%/minggu, B naik 2,1%/minggu → <strong>paralel</strong> ✓. Jika A naik 5% &amp; B turun 1% → <strong>TIDAK paralel</strong> ✗ → DiD <strong>invalid</strong>!</p>
<p><strong>Langkah 2 — Jika tidak paralel:</strong> (a) pilih <strong>geo lain</strong> yang paralel, (b) pakai <strong>synthetic control</strong> (kombinasi beberapa geo sebagai &ldquo;B sintetis&rdquo;!), (c) <strong>jangan paksa</strong> — DiD yang asumsinya jebol = <strong>angka ngawur berjas lab</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>plot pra-tren</strong> = 50% pekerjaan geo-experiment. Tidak paralel = <strong>jangan lanjut</strong>. Kejujuran metodologis &gt; &ldquo;hasil&rdquo;.</p>
</details>
<h3>3. Causal Impact — Membangun &ldquo;Dunia Tanpa Iklan&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Causal Impact</em> (Google): bangun <strong>kontrafaktual</strong> (dunia tanpa iklan) dari <strong>data pra-periode + kovariat</strong> (geo kontrol, musiman, tren). Bandingkan <strong>aktual</strong> vs <strong>kontrafaktual</strong> = efek kausal. Dengan <strong>interval kredibel Bayesian</strong>!</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti <strong>peramal cuaca</strong> yang memprediksi &ldquo;bagaimana cuaca hari ini <strong>jika</strong> tidak ada badai&rdquo; — dari pola historis + kota tetangga yang tidak kena badai. Selisih ramalan vs aktual = <strong>dampak badai</strong>. Bedanya: &ldquo;badai&rdquo; = iklanmu.</p>
<p><strong>Cara kerja (intuisi):</strong> (1) latih model <strong>time series</strong> (Y ~ tren + musiman + geo kontrol) di <strong>pra-periode</strong>; (2) <strong>prediksi</strong> ke periode iklan (&ldquo;dunia tanpa iklan&rdquo;); (3) <strong>selisih</strong> = efek; (4) <strong>Bayesian</strong> → interval (&ldquo;efek 95% di antara X–Y&rdquo;).</p>
<p><strong>Kapan dipakai:</strong> <strong>Satu</strong> intervensi besar (peluncuran nasional!), tidak ada geo kontrol bersih, atau <strong>analisis retrospektif</strong> (&ldquo;berapa dampak kampanye kemarin?&rdquo;). Tidak untuk: banyak intervensi <strong>bersamaan</strong> (tidak bisa pisahkan!).</p>
<details className="worked">
<summary>📐 Contoh 3: Causal Impact kampanye Lebaran (klik untuk buka)</summary>
<p>Kampanye nasional 2 minggu Lebaran. Tidak ada holdout (nasional!).</p>
<p><strong>Langkah 1 — Model pra-periode:</strong> 12 minggu sebelum: revenue ~ tren + <strong>musiman mingguan</strong> + <strong>3 kota kontrol</strong> (tidak kena kampanye? tidak ada — nasional! pakai <strong>tahun lalu</strong> sebagai kontrol!).</p>
<p><strong>Langkah 2 — Kontrafaktual:</strong> model prediksi &ldquo;tanpa kampanye&rdquo;: Rp500M/minggu. Aktual: Rp650M/minggu.</p>
<p><strong>Langkah 3 — Efek:</strong> +Rp150M/minggu × 2 = <strong>+Rp300M</strong>. Interval 95%: [Rp180M, Rp420M]. <strong>P(bukan kebetulan) = 99%</strong>.</p>
<p><strong>Langkah 4 — iROAS:</strong> biaya Rp200M → iROAS = 300/200 = <strong>1,5</strong>. <strong>Untung</strong> — tapi <strong>tidak seheboh</strong> atribusi (ROAS 4,0!).</p>
<p><strong>Pelajaran:</strong> Causal Impact = <strong>&ldquo;mesin waktu&rdquo;</strong> untuk kampanye yang <strong>terlanjur jalan</strong> tanpa holdout. Tidak sesempurna eksperimen — tapi <strong>jauh lebih baik</strong> dari atribusi buta.</p>
</details>
<PlotlyChart
  data={[{x: ["Minggu -2", "Minggu -1", "Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"], y: [100, 102, 130, 132, 128, 131], name: "Jabar (iklan)", type: "scatter", mode: "lines+markers"}, {x: ["Minggu -2", "Minggu -1", "Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"], y: [80, 81, 85, 86, 84, 86], name: "Jateng (kontrol)", type: "scatter", mode: "lines+markers"}, {x: ["Minggu -2", "Minggu -1", "Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"], y: [100, 102, 107, 108, 106, 108], name: "Jabar kontrafaktual", type: "scatter", mode: "lines", line: {dash: "dash"}}]}
  title={"Geo-experiment: Jabar vs Jateng (kontrafaktual putus-putus)"}
  layout={{yaxis: {title: "Revenue (Rp M)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Garis solid = aktual; garis putus-putus = &ldquo;dunia tanpa iklan&rdquo; (Jabar jika ikut tren Jateng). Area di antara = efek.</p>
<p><strong>Interpretasi:</strong> Jabar <strong>melonjak</strong> saat iklan (minggu 1), Jateng <strong>datar</strong>. Kontrafaktual menunjukkan Jabar &ldquo;seharusnya&rdquo; di ~107 — selisih 130−107 = <strong>+23</strong> ≈ DiD +25. <strong>Visual = bukti.</strong> Tanpa garis putus-putus, &ldquo;+30&rdquo; terlihat seperti efek penuh — padahal 5 di antaranya = <strong>tren alami</strong>.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Platform melaporkan 'kampanye menghasilkan Rp3 miliar' — itu dampak iklan kami.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Itu <strong>atribusi</strong>, bukan <strong>inkrementalitas</strong>. Sebagian besar (sering 70–90%) adalah orang yang <em>akan beli anyway</em>. Kasus SegarSari: Rp3M atribusi vs Rp160jt inkremental (5%). Tanya selalu: &lsquo;berapa yang <em>tambahan</em>?&rsquo; — dan minta bukti holdout/geo, bukan dashboard platform.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Geo-experiment tidak perlu — kita bisa bandingkan sebelum vs sesudah saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Sebelum-vs-sesudah <strong>mencampur efek kampanye dengan tren umum</strong> (musim, ekonomi, kompetitor). SegarSari naik Rp30jt 'sesudah' — tapi kontrol naik Rp28jt tanpa iklan. Tanpa kontrol, kamu akan mengklaim Rp30jt sebagai kemenangan. Kontrol = satu-satunya cara memisahkan sinyal dari cuaca.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Incremental ≤ attributed — selalu.</strong> Jadikan ini refleks. Setiap ada angka 'dihasilkan kampanye', bagi mental dengan 5–10x untuk tebak inkremental — lalu minta bukti eksperimennya.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Platform punya conflict of interest.</strong> Mereka dibayar saat kamu percaya ROAS-nya. Holdout independen (atau geo-experiment) adalah satu-satunya angka yang tidak punya insentif untuk berbohong.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Lift Holdout + Signifikansi</h2>
<p>Hitung lift, iROAS, dan uji signifikansi sederhana dari data holdout. Ubah angka — lihat kapan lift 'besar' tapi tidak signifikan.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Holdout"}
  hint={"Perkecil holdout 100rb → 10rb. Lift sama tapi CI melebar — ukuran holdout menentukan presisi, bukan cuma lift."}
  defaultCode={"import math\n# Data holdout experiment — ubah sesukamu\nn_t, conv_t = 900_000, 0.030   # treated\nn_c, conv_c = 100_000, 0.027   # holdout\nspend, rev_per = 500_000_000, 1_000_000\n\nlift = (conv_t - conv_c) / conv_c\n# SE lift (delta method, pendekatan)\nse = math.sqrt(conv_t*(1-conv_t)/n_t + conv_c*(1-conv_c)/n_c) / conv_c\nci = (lift - 1.96*se, lift + 1.96*se)\ninkr = n_t * (conv_t - conv_c)\niroas = inkr * rev_per / spend\n\nprint(f\"Lift            : {lift:.1%}  (95% CI: {ci[0]:.1%} s.d. {ci[1]:.1%})\")\nprint(f\"Pembeli inkremental: {inkr:,.0f} dari {n_t*conv_t:,.0f} teratribusi\")\nprint(f\"iROAS           : {iroas:.1f}x\")\nprint(f\"ROAS atribusi   : {n_t*conv_t*rev_per/spend:.1f}x  <- yang dilaporkan platform\")\nprint()\nprint(\"Signifikan!\" if ci[0] > 0 else \"TIDAK signifikan — jangan klaim efek.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulasi Geo-Experiment (DiD)</h2>
<p>Simulasikan 10 kota treated + 10 kontrol dengan efek sebenarnya Rp2jt. Lihat DiD menemukannya — dan apa yang terjadi jika tren tidak paralel.</p>
<PyodideLab
  title={"Lab 2 — Simulator Geo DiD"}
  hint={"Ubah EFEK 2 → 0 (tidak ada efek). Lihat DiD ≈ 0 — metode tidak mengada-ada. Lalu buat tren kontrol beda (hilangkan parallel trends) dan lihat biasnya."}
  defaultCode={"import random\nrandom.seed(5)\nEFEK = 2  # efek sebenarnya (Rp jt/kota/minggu); coba 0!\n\ndef kota(base, tren, efek=0, noise=4):\n    pre  = [base + tren*t + random.gauss(0, noise) for t in range(8)]\n    post = [base + tren*(8+t) + efek + random.gauss(0, noise) for t in range(8)]\n    return sum(pre)/8, sum(post)/8\n\ntreated = [kota(100, 3.5, EFEK) for _ in range(10)]\nkontrol = [kota(95, 3.5, 0) for _ in range(10)]  # tren SAMA -> parallel\n\ndef rata(rows, i): return sum(r[i] for r in rows)/len(rows)\ndid = (rata(treated,1)-rata(treated,0)) - (rata(kontrol,1)-rata(kontrol,0))\nprint(f\"Efek sebenarnya : {EFEK} jt\")\nprint(f\"Estimasi DiD    : {did:.1f} jt\")\nprint(f\"Treated +{rata(treated,1)-rata(treated,0):.1f} vs kontrol +{rata(kontrol,1)-rata(kontrol,0):.1f}\")\nprint(\"Tanpa kontrol, kamu akan klaim seluruh kenaikan treated = efek iklan!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Channel digital, bisa acak per user → <strong>Holdout experiment</strong></h3>
<p><strong>Kenapa:</strong> Standar emas; platform besar punya fitur bawaan.</p>
<p><strong>Contoh nyata:</strong> Holdout 10% audiens Meta/Google.</p>
</div>
<div className="decision-card">
<h3>2. TV/radio/OOH/promo fisik → <strong>Geo-experiment (matched markets + DiD)</strong></h3>
<p><strong>Kenapa:</strong> Unit acak = wilayah. Satu-satunya kausalitas yang kredibel untuk above-the-line.</p>
<p><strong>Contoh nyata:</strong> 10 kota TV vs 10 kota kontrol.</p>
</div>
<div className="decision-card">
<h3>3. Intervensi tunggal nasional (tidak bisa split) → <strong>Causal Impact (BSTS)</strong></h3>
<p><strong>Kenapa:</strong> Bangun counterfactual dari historis + prediktor; cek fit pre-period.</p>
<p><strong>Contoh nyata:</strong> Peluncuran nasional, perubahan harga nasional.</p>
</div>
<div className="decision-card">
<h3>4. Butuh angka cepat, budget kecil → <strong>Atribusi + diskon mental (÷5–10x) + kalibrasi periodik</strong></h3>
<p><strong>Kenapa:</strong> Eksperimen mahal; tapi jangan pernah alokasikan budget besar dari atribusi mentah.</p>
<p><strong>Contoh nyata:</strong> Review triwulanan: 1 geo-test untuk kalibrasi semua angka atribusi.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Atribusi ≠ inkremental.</strong> Tanya 'berapa yang tambahan?'</li><li><strong>Tanpa kontrol, tidak ada klaim kausal.</strong></li><li><strong>Platform tidak netral</strong> — verifikasi independen.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Iklan Rp1 Miliar yang &ldquo;Menghasilkan&rdquo; Rp3 Miliar</h3>
<p>FMCG &ldquo;RasaNusa&rdquo;: spend TV Rp1M/bulan, &ldquo;atribusi&rdquo; (model media mix sederhana) Rp3M (ROAS 3,0!). <strong>Geo-experiment</strong>: 3 provinsi holdout 2 bulan.</p>
<p><strong>Hasil:</strong> iROAS = <strong>1,2</strong>. Bukan 3,0! <strong>60%</strong> &ldquo;atribusi&rdquo; = <strong>baseline</strong> (orang beli <strong>tanpa</strong> iklan — brand sudah kuat!).</p>
<p><strong>Keputusan:</strong> <strong>potong 40%</strong> TV (Rp400jt), alihkan ke <strong>digital prospecting</strong> (iROAS 2,8!). Revenue <strong>naik 12%</strong> dengan budget <strong>tetap</strong>.</p>
<p><strong>Pelajaran:</strong> brand kuat = <strong>atribusi tinggi, incrementality rendah</strong>. Semakin kuat brand-mu, semakin <strong>menipu</strong> atribusimu. <strong>Ironi pemasaran:</strong> yang terlihat &ldquo;berhasil&rdquo; (ROAS 3,0) justru yang <strong>paling boros</strong>.</p>
<h3>Kisah 2: Retargeting yang &ldquo;Sempurna&rdquo; — 90% Palsu</h3>
<p>E-commerce &ldquo;LakuTerus&rdquo;: retargeting ROAS <strong>12,0</strong>! &ldquo;Mesin uang!&rdquo; <strong>Holdout</strong>: matikan retargeting untuk 10% user.</p>
<p><strong>Hasil:</strong> holdout conversion <strong>hanya turun 8%</strong>. iROAS = <strong>1,1</strong>. <strong>92%</strong> &ldquo;ROAS 12&rdquo; = orang yang <strong>akan beli sendiri</strong> (mereka sudah taruh di keranjang!).</p>
<p><strong>Keputusan:</strong> <strong>potong 80%</strong> retargeting. Fokus ke <strong>prospecting</strong> (orang yang <strong>belum</strong> kenal!).</p>
<p><strong>Pelajaran:</strong> retargeting = <strong>juara atribusi, pecundang incrementality</strong>. Ia &ldquo;memanen&rdquo; yang sudah mau beli — lalu <strong>mengklaim</strong> sebagai &ldquo;hasil&rdquo;. <strong>Aturan:</strong> semakin tinggi ROAS atribusi, semakin <strong>wajib</strong> diuji incrementality-nya.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Incrementality = atribusi yang lebih canggih.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Beda pertanyaan, beda metode, beda kegunaan.</strong> Atribusi = &ldquo;siapa terlibat?&rdquo; (observasional). Incrementality = &ldquo;apa yang berubah karena kita?&rdquo; (kausal). <strong>Tidak ada</strong> &ldquo;atribusi yang cukup canggih&rdquo; menjadi incrementality — seperti <strong>tidak ada</strong> &ldquo;foto yang cukup tajam&rdquo; menjadi video. Butuh <strong>eksperimen</strong> (atau quasi-eksperimen).</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Rp1 Miliar untuk Rp160 Juta</h2>
<div className="callout">
<p>SegarSari: spend TV Rp1M. Agensi klaim &ldquo;Rp3M teratribusi&rdquo;. Geo-experiment 10+10 kota: DiD = +Rp2jt/kota/minggu × 10 kota × 8 minggu = <strong>Rp160jt inkremental</strong>. iROAS = 0,16.</p>
<p><strong>Pertanyaan:</strong> (a) Jelaskan jurang Rp3M vs Rp160jt. (b) Apakah TV 'tidak bekerja' — atau ada penjelasan lain? (c) Rencana pengukuran tahun depan (budget sama)?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Rp3M = atribusi</strong> (semua pembeli yang terpapar TV, termasuk loyalis yang akan beli anyway). <strong>Rp160jt = inkremental</strong> (tambahan vs kontrol). Rasio 5% — normal untuk brand FMCG mapan dengan baseline besar.</p>
<p>(b) <strong>Belum tentu.</strong> Bisa jadi: kreatif lemah, frekuensi kurang, atau TV bekerja via brand (jangka panjang, tidak tertangkap 8 minggu). Yang pasti: <em>klaim Rp3M salah</em>. Test berikutnya: kreatif baru + holdout digital + brand tracking (awareness), bukan 'tambah budget TV'.</p>
<p>(c) <strong>Portofolio pengukuran:</strong> (1) geo-experiment tahunan untuk kalibrasi; (2) holdout digital rutin per kuartal; (3) MMM (MK13) untuk alokasi antar-channel; (4) atribusi hanya untuk optimasi taktis harian, bukan keputusan budget.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — iROAS.</strong> Spend Rp500jt, atribusi Rp2M (ROAS 4,0). Holdout: revenue turun Rp300jt. Hitung iROAS. Keputusan?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>iROAS = 300jt/500jt = <strong>0,6</strong>. <strong>Rugi!</strong></p>
<p><strong>Keputusan:</strong> <strong>potong/mati</strong> channel ini (atau turunkan drastis). ROAS 4,0 = <strong>ilusi</strong>; iROAS 0,6 = <strong>kenyataan</strong>. Setiap bulan bertahan = <strong>Rp200jt dibakar</strong> (500jt − 300jt).</p>
<p><strong>Pelajaran:</strong> <strong>jangan jatuh cinta</strong> pada ROAS atribusi. <strong>Cintai iROAS</strong> — ia yang membayar gaji.</p>
</details>
<p><strong>Soal 2 — DiD.</strong> Kota X (iklan): sebelum 200, sesudah 260. Kota Y (kontrol): sebelum 150, sesudah 160. Hitung DiD. Jika biaya Rp50, iROAS?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>DiD = (260−200) − (160−150) = 60 − 10 = <strong>50</strong>.</p>
<p>iROAS = 50/50 = <strong>1,0</strong>. <strong>Impas.</strong></p>
<p><strong>Keputusan:</strong> <strong>jangan scale</strong> (impas!), tapi <strong>jangan matikan</strong> juga (tidak rugi + ada <strong>efek brand</strong> tak terukur!). <strong>Optimasi</strong> (kreatif, targeting) untuk naikkan di atas 1,0.</p>
</details>
<p><strong>Soal 3 — Parallel trends.</strong> Pra-periode 4 minggu, growth/minggu: A: +3%, +2%, +4%, +3%. B: −1%, +5%, −2%, +6%. Paralel? Tindakan?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>A: stabil +2–4%. B: <strong>acak</strong> (−1% sampai +6%, <strong>volatil</strong>!). <strong>Tidak paralel</strong> ✗.</p>
<p><strong>Tindakan:</strong> (a) cari <strong>geo lain</strong> yang stabil &amp; paralel dengan A, (b) <strong>synthetic control</strong> (kombinasi beberapa geo stabil), (c) <strong>tambah</strong> pra-periode (mungkin B hanya noise jangka pendek?). <strong>Jangan paksa DiD</strong> — hasilnya <strong>ngawur</strong>.</p>
</details>
<p><strong>Soal 4 — Budget allocation.</strong> Tiga channel, budget total Rp1M. A: iROAS 2,5 (cap Rp400jt). B: iROAS 1,8 (cap Rp600jt). C: iROAS 0,7. Alokasi optimal? (Petunjuk: isi dari iROAS tertinggi sampai cap!)</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Langkah 1:</strong> A (2,5) → isi sampai cap: <strong>Rp400jt</strong>. Sisa Rp600jt.</p>
<p><strong>Langkah 2:</strong> B (1,8) → isi sampai cap: <strong>Rp600jt</strong>. Sisa Rp0.</p>
<p><strong>Langkah 3:</strong> C (0,7 &lt; 1!) → <strong>Rp0</strong>. <strong>Matikan!</strong></p>
<p><strong>Alokasi: A=Rp400jt, B=Rp600jt, C=Rp0.</strong></p>
<p><strong>Pelajaran:</strong> alokasi <strong>by iROAS</strong> (bukan atribusi!). C dengan ROAS atribusi 3,0 tapi iROAS 0,7 = <strong>tetap dimatikan</strong>. <strong>Uang mengikuti kausalitas, bukan korelasi.</strong></p>
</details>
<div className="tip">
<p><strong>💡 Empat angka incrementality: (1) iROAS per channel, (2) % atribusi yang &ldquo;palsu&rdquo;, (3) hasil holdout terakhir, (4) kapan kalibrasi berikutnya. Tanpa empat ini = <em>terbang buta dengan dashboard yang indah</em>.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Treated 3,0%, holdout 2,7%. Lift dan pembeli inkremental dari 900rb treated?"}
  options={
    ["11,1% lift; 2.700 inkremental",
    "3,0% lift; 27.000 inkremental",
    "0,3% lift; 270 inkremental",
    "Tidak bisa dihitung"]
  }
  correct={0}
  explanation={"Benar: lift = (3,0−2,7)/2,7 = 11,1%. Inkremental = 900rb × 0,3% = 2.700. Yang 27.000 = teratribusi (termasuk yang akan beli anyway)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Kenapa 'sebelum vs sesudah' tanpa kontrol menyesatkan?"}
  options={
    ["Tidak menyesatkan",
    "Mencampur efek kampanye dengan tren umum/musim",
    "Terlalu mahal",
    "Butuh data banyak"]
  }
  correct={1}
  explanation={"Benar: kenaikan 'sesudah' bisa murni tren (kontrol SegarSari naik Rp28jt tanpa iklan). Tanpa kontrol, tren umum diklaim sebagai efek kampanye."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kapan geo-experiment dipilih atas holdout user-level?"}
  options={
    ["Selalu",
    "Channel tak bisa diacak per user (TV, radio, OOH, promo fisik)",
    "Budget kecil",
    "Tidak pernah"]
  }
  correct={1}
  explanation={"Benar: unit randomisasi mengikuti unit paparan. TV menyebar per wilayah → acak wilayah. Holdout user untuk TV = mustahil (satu rumah beda perlakuan = kontaminasi)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Output Causal Impact: CI kumulatif mencakup 0. Artinya?"}
  options={
    ["Efek positif kecil",
    "Tidak signifikan — jangan klaim efek",
    "Model rusak",
    "Ulangi dengan data lebih sedikit"]
  }
  correct={1}
  explanation={"Benar: interval mencakup 0 = efek tidak bisa dibedakan dari noise. Klaim 'ada efek' = overclaim. Perbaiki: perpanjang periode atau terima ketidakpastian."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Platform melaporkan ROAS 54x, holdout menunjukkan iROAS 5,4x. Untuk alokasi budget, pakai?"}
  options={
    ["54x — angka resmi platform",
    "5,4x (iROAS) — platform punya conflict of interest",
    "Rata-rata keduanya",
    "Tidak pakai keduanya"]
  }
  correct={1}
  explanation={"Benar: platform dibayar saat kamu percaya angkanya. iROAS dari holdout independen = satu-satunya angka kausal. Atribusi platform untuk optimasi taktis, bukan budget."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Audit Incrementality Rp5 Miliar Budget</h2>
<p>E-commerce &ldquo;LakuTerus&rdquo;: budget iklan <strong>Rp5M/bulan</strong> di 6 channel. Atribusi mengklaim total ROAS 3,5. CEO: &ldquo;Scale ke Rp8M?&rdquo; Kamu diminta <strong>audit incrementality</strong> sebelum scale.</p>
<h3>Langkah 1 — Petakan kecurigaan (minggu 1)</h3>
<p>Ranking channel by <strong>risiko overclaim</strong> (bukan by ROAS!): (1) <strong>Branded search</strong> (ROAS 8,0 — <strong>pasti</strong> overclaim!), (2) <strong>Retargeting</strong> (ROAS 6,5 — <strong>pasti</strong>!), (3) <strong>Display prospecting</strong> (ROAS 2,0 — mungkin jujur), (4) <strong>Sosmed prospecting</strong> (ROAS 2,2), (5) <strong>Influencer</strong> (ROAS 1,5 — susah diukur!), (6) <strong>TV</strong> (ROAS 3,0 — model, bukan data!).</p>
<p><strong>Prinsip:</strong> audit dari <strong>yang paling mencurigakan</strong> — bukan yang paling besar. Branded + retargeting = <strong>80%</strong> &ldquo;ROAS&rdquo; tapi kemungkinan <strong>20%</strong> incrementality.</p>
<h3>Langkah 2 — Holdout branded + retargeting (minggu 2–5)</h3>
<p><strong>Branded search:</strong> matikan 50% kota 3 minggu. iROAS = <strong>0,4</strong>. (ROAS atribusi 8,0 → <strong>20x overclaim</strong>!)</p>
<p><strong>Retargeting:</strong> holdout 10% user 3 minggu. iROAS = <strong>0,8</strong>. (ROAS 6,5 → <strong>8x overclaim</strong>!)</p>
<p><strong>Dua channel &ldquo;terbaik&rdquo;</strong> ternyata <strong>merugi</strong>! Rp1,8M/bulan <strong>dibakar</strong> untuk &ldquo;memanen&rdquo; yang akan beli sendiri.</p>
<h3>Langkah 3 — Geo-experiment TV (minggu 2–9)</h3>
<p>3 provinsi holdout 8 minggu. iROAS TV = <strong>1,4</strong>. <strong>Untung</strong> — tapi <strong>jauh</strong> dari 3,0. (Efek <strong>brand</strong> jangka panjang belum masuk — catat sebagai <strong>catatan kaki</strong>!)</p>
<h3>Langkah 4 — Rekomendasi alokasi baru</h3>
<div className="callout">
<p><strong>What:</strong> iROAS: branded 0,4 | retargeting 0,8 | TV 1,4 | display 2,1 | sosmed 2,3 | influencer 1,9 (via geo!).</p>
<p><strong>So what:</strong> Rp1,8M/bulan (36% budget!) <strong>dibakar</strong> di channel iROAS &lt; 1. Atribusi ROAS 3,5 = <strong>ilusi</strong>; iROAS tertimbang = <strong>1,6</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Matikan</strong> 80% branded (sisakan defensif Rp100jt). (2) <strong>Potong</strong> 70% retargeting. (3) <strong>Alihkan</strong> Rp1,5M ke sosmed + display (iROAS &gt; 2!). (4) <strong>JANGAN scale</strong> ke Rp8M — <strong>optimasi dulu</strong>! Proyeksi: budget <strong>tetap</strong> Rp5M, incremental revenue <strong>+35%</strong>.</p>
</div>
<p><strong>Intuisi penutup:</strong> audit ini <strong>tidak</strong> menemukan &ldquo;channel jahat&rdquo; — ia menemukan <strong>pengukuran yang berbohong</strong>. Branded &amp; retargeting <strong>berguna</strong> (defensif! panen!) — tapi <strong>bukan</strong> mesin pertumbuhan. <strong>Uang pertumbuhan</strong> = prospecting dengan iROAS &gt; 2.</p>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Incrementality</h2>
<h3>Jebakan 1: Holdout terlalu singkat</h3>
<p>Holdout 3 hari untuk produk dengan <strong>siklus beli 30 hari</strong>! Efek <strong>belum muncul</strong> (orang lihat iklan hari 1, beli hari 20!). <strong>Deteksi:</strong> durasi holdout ≥ <strong>1–2 siklus pembelian</strong>. Terlalu singkat = <strong>underestimate sistematis</strong>.</p>
<h3>Jebakan 2: Kontaminasi holdout</h3>
<p>Grup &ldquo;tanpa iklan&rdquo; <strong>melihat</strong> iklan (teman share! organik! kompetitor bidding brand-mu!). <strong>Deteksi:</strong> <strong>survey</strong> kecil (&ldquo;apakah Anda melihat iklan kami?&rdquo;) atau <strong>proxy</strong> (search volume brand di holdout!). Kontaminasi &gt; 20% = <strong>hasil tidak valid</strong>.</p>
<h3>Jebakan 3: Tidak mengukur <strong>efek negatif</strong></h3>
<p>Iklan yang <strong>mengganggu</strong> (terlalu sering!) bisa <strong>menurunkan</strong> pembelian! Holdout hanya mengukur &ldquo;berapa yang hilang tanpa iklan&rdquo; — tapi jika iklan <strong>merusak</strong>, &ldquo;tanpa iklan&rdquo; <strong>lebih baik</strong>! <strong>Deteksi:</strong> jika holdout <strong>mengalahkan</strong> perlakuan = <strong>iklanmu merusak</strong>! (Jarang, tapi <strong>nyata</strong> untuk frekuensi ekstrem!)</p>
<h3>Jebakan 4: Menggeneralisasi dari satu holdout</h3>
<p>Holdout Q1 (Lebaran!) → iROAS 3,0. <strong>Asumsi</strong> Q3 sama → <strong>salah besar</strong> (Q3 = sepi!). <strong>Deteksi:</strong> incrementality <strong>bermusiman</strong>! Kalibrasi <strong>per kuartal</strong> (atau per momen!). Satu angka untuk setahun = <strong>kemalasan</strong>.</p>
<h3>Jebakan 5: Mengabaikan <strong>halo effect</strong></h3>
<p>Iklan produk A <strong>menaikkan</strong> penjualan produk B (halo!) — tapi holdout hanya ukur A! <strong>Deteksi:</strong> ukur <strong>total revenue</strong> (bukan per produk!) di holdout. Halo effect bisa <strong>20–40%</strong> dari total — <strong>mengabaikannya</strong> = underestimate.</p>
<h3>Jebakan 6: &ldquo;Incrementality&rdquo; dari model, bukan eksperimen</h3>
<p>Vendor mengklaim &ldquo;iROAS 2,5&rdquo; dari <strong>model black-box</strong> (bukan holdout!). <strong>Deteksi:</strong> tanya <strong>&ldquo;holdout-nya mana?&rdquo;</strong> Tidak ada = <strong>bukan incrementality</strong> = <strong>atribusi berbaju incrementality</strong>. <strong>Jangan bayar</strong> untuk klaim tanpa bukti.</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam syarat holdout valid: durasi cukup, tidak terkontaminasi, ukur negatif, musiman, halo effect, bukti eksperimen. Holdout yang gagal satu syarat = <em>angka ngawur</em>.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Kalender Pengukuran Incrementality</h2>
<div className="callout">
<p><strong>📅 KALENDER INCREMENTALITY 2026</strong></p>
<p><strong>Q1 (Jan–Mar):</strong> Holdout <strong>branded search</strong> (2 minggu, Feb). Holdout <strong>retargeting</strong> (3 minggu, Mar).</p>
<p><strong>Q2 (Apr–Jun):</strong> <strong>Geo-experiment TV</strong> (8 minggu, Apr–Mei). Kalibrasi <strong>atribusi</strong> dengan hasil Q1.</p>
<p><strong>Q3 (Jul–Sep):</strong> Holdout <strong>sosmed prospecting</strong> (3 minggu, Agu). <strong>Causal Impact</strong> kampanye 17-an (retrospektif).</p>
<p><strong>Q4 (Okt–Des):</strong> <strong>JANGAN</strong> holdout besar (peak season! berisiko!). Hanya <strong>monitoring</strong> + kalibrasi ringan.</p>
<p><strong>Aturan:</strong> <strong>1 eksperimen besar per kuartal</strong> (tidak lebih — <strong>lelah organisasi</strong>!). <strong>Budget measurement</strong>: 5–10% dari budget media. <strong>Hasil</strong>: update <strong>faktor kalibrasi</strong> atribusi (mis. &ldquo;ROAS atribusi × 0,4 = estimasi iROAS&rdquo;).</p>
</div>
<p><strong>Cara memakai:</strong> presentasi ke CMO di <strong>awal tahun</strong>. <strong>Jual</strong> sebagai &ldquo;asuransi RpX miliar&rdquo; (bukan &ldquo;biaya&rdquo;!). Satu holdout yang menemukan <strong>pemborosan Rp1,8M/bulan</strong> = <strong>ROI 100x</strong> dari biaya measurement.</p>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Berapa % budget untuk measurement?</strong><br/>A: <strong>5–10%</strong> dari budget media untuk <strong>eksperimen</strong> (holdout/geo). Terdengar besar? <strong>Satu</strong> temuan pemborosan (seperti Rp1,8M/bulan di atas!) = <strong>ROI 50–100x</strong>. <strong>Tidak</strong> mengukur = <strong>bertaruh buta</strong> dengan 100% budget.</p>
<p><strong>Q2: Startup kecil — perlu incrementality?</strong><br/>A: <strong>Versi ringan:</strong> <strong>on/off test</strong> sederhana (matikan channel 1 minggu, lihat!). <strong>Jangan</strong> geo-experiment mahal. <strong>Prinsip</strong> (kontrafaktual!) &gt; <strong>metode</strong> (geo!). Bahkan <strong>intuisi terkalibrasi</strong> &gt; atribusi buta.</p>
<p><strong>Q3: iROAS vs ROAS — mana untuk laporan harian?</strong><br/>A: <strong>ROAS atribusi</strong> untuk <strong>monitoring harian</strong> (cepat!). <strong>iROAS</strong> untuk <strong>keputusan budget</strong> (kuartalan!). <strong>Jembatan:</strong> <strong>faktor kalibrasi</strong> (ROAS × faktor = estimasi iROAS harian!). <strong>Dua metrik, dua kegunaan.</strong></p>
<p><strong>Q4: Bagaimana jika kompetitor mengganggu holdout?</strong><br/>A: <strong>Monitor</strong> aktivitas kompetitor (bidding brand-mu!). Jika kompetitor <strong>masuk</strong> saat holdout-mu = <strong>hasil terkontaminasi</strong>. <strong>Solusi:</strong> <strong>jadwalkan ulang</strong> atau <strong>catat</strong> sebagai caveat. <strong>Kejujuran</strong> &gt; &ldquo;hasil&rdquo;.</p>
<p><strong>Q5: Incrementality untuk <strong>brand building</strong> (jangka panjang)?</strong><br/>A: <strong>Sulit</strong> (efek 1–3 tahun!). <strong>Solusi:</strong> (a) <strong>brand lift study</strong> (survei!), (b) <strong>holdout jangka panjang</strong> (1–5% tidak kena iklan <strong>setahun</strong>!), (c) <strong>model</strong> dengan <strong>kalibrasi</strong> eksperimen. <strong>Jangan klaim</strong> yang tidak bisa diukur — <strong>akui</strong> ketidakpastian.</p>
<p><strong>Q6: Satu kalimat inti lesson ini?</strong><br/>A: <strong>Atribusi = &ldquo;siapa terlibat&rdquo;; incrementality = &ldquo;apa yang berubah karena kita&rdquo;. Uang mengikuti yang kedua. Ukur dengan eksperimen, bukan model.</strong></p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Keputusan Incrementality</h2>
<h3>Kasus A: Podcast ads — tidak bisa di-track!</h3>
<p>Brand &ldquo;KopiKita&rdquo; spend Rp300jt/bulan di podcast. <strong>Tidak ada</strong> click tracking (orang dengar, lalu beli offline!). Atribusi = <strong>nol</strong>. Matikan?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Langkah 1 — Jangan pakai atribusi!</strong> Podcast = <strong>dark channel</strong> (tidak ter-track!). Atribusi nol ≠ incrementality nol!</p>
<p><strong>Langkah 2 — Geo-experiment:</strong> stop podcast di <strong>5 kota</strong> 2 bulan, bandingkan dengan 5 kota kontrol (DiD!).</p>
<p><strong>Langkah 3 — Hasil (hipotetis):</strong> DiD = +Rp450jt revenue/bulan. iROAS = 450/300 = <strong>1,5</strong>. <strong>Untung!</strong></p>
<p><strong>Pelajaran:</strong> <strong>channel yang tidak ter-track</strong> sering <strong>paling undervalued</strong> (karena atribusi nol!). <strong>Incrementality</strong> = satu-satunya cara mengukur mereka. <strong>Jangan matikan</strong> yang tidak bisa diukur — <strong>ukur</strong> dengan eksperimen!</p>
</details>
<h3>Kasus B: Diskon 50% — &ldquo;sukses&rdquo; tapi...?</h3>
<p>Promo 50% 1 minggu. Revenue <strong>naik 200%</strong>! &ldquo;Sukses besar!&rdquo; Ulangi tiap bulan?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — Pull-forward:</strong> berapa yang <strong>hanya maju</strong> (beli sekarang, bukan bulan depan)? Data: 60% pembeli promo = <strong>pelanggan lama</strong> yang <strong>menunggu</strong> promo!</p>
<p><strong>Langkah 2 — Incrementality:</strong> bandingkan dengan <strong>minggu normal</strong> + <strong>minggu setelah</strong> (penurunan!). Net: +40% (bukan +200%!).</p>
<p><strong>Langkah 3 — Margin:</strong> diskon 50% = <strong>margin hancur</strong>. Net profit: <strong>turun 20%</strong>! &ldquo;Sukses&rdquo; revenue = <strong>gagal</strong> profit!</p>
<p><strong>Keputusan: JANGAN ulangi tiap bulan.</strong> Promo = <strong>candu</strong> (pelanggan menunggu!). Maksimal <strong>2x/tahun</strong> + <strong>target</strong> pelanggan baru (bukan lama!).</p>
<p><strong>Pelajaran:</strong> <strong>revenue ≠ incrementality ≠ profit</strong>. Tiga lapis! Promo &ldquo;sukses&rdquo; di revenue bisa <strong>gagal</strong> di incrementality dan <strong>bencana</strong> di profit.</p>
</details>
<h3>Kasus C: Influencer — bayar mahal, ukur susah</h3>
<p>Influencer Rp100jt/post. &ldquo;Atribusi&rdquo;: kode voucher dipakai 500x (Rp50jt revenue). ROAS 0,5. Stop?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Langkah 1 — Voucher ≠ incrementality!</strong> Yang pakai voucher = <strong>sudah mau beli</strong> (mereka <strong>cari</strong> kode!). <strong>Selection bias!</strong></p>
<p><strong>Langkah 2 — Geo-experiment:</strong> influencer hanya di <strong>Jawa</strong>, holdout <strong>Sumatera</strong>. DiD: +Rp180jt.</p>
<p><strong>Langkah 3 — iROAS:</strong> 180/100 = <strong>1,8</strong>. <strong>Untung!</strong> (Voucher ROAS 0,5 = <strong>menipu</strong>!)</p>
<p><strong>Pelajaran:</strong> <strong>kode voucher</strong> = <strong>atribusi terburuk</strong> (100% selection bias!). <strong>Jangan</strong> nilai influencer dari voucher. <strong>Geo-experiment</strong> atau <strong>brand lift</strong>!</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Membela Holdout</h2>
<p><strong>CMO:</strong> &ldquo;Matikan iklan 3 minggu untuk &lsquo;eksperimen&rsquo;? Kita <strong>kehilangan</strong> Rp500jt revenue! <strong>Gila?</strong>&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Tiga minggu holdout = <strong>investasi</strong> Rp500jt untuk <strong>menemukan</strong> pemborosan Rp1,8M/<strong>bulan</strong>. <strong>ROI 43x dalam setahun.</strong> <strong>Tidak</strong> holdout = <strong>bertaruh</strong> Rp5M/bulan <strong>buta</strong>. <strong>Mana yang lebih gila?</strong>&rdquo;</p>
<p><strong>CMO:</strong> &ldquo;Tapi kompetitor bisa masuk saat kita mati!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;<strong>Valid.</strong> Solusi: (1) holdout <strong>parsial</strong> (50% kota, bukan 100%), (2) <strong>monitor</strong> kompetitor harian, (3) <strong>siap nyalakan</strong> dalam 24 jam jika diserang. <strong>Risiko dikelola</strong>, bukan dihindari. <strong>Deal?</strong>&rdquo;</p>
<p><strong>CMO:</strong> &ldquo;...Deal. Tapi kamu yang <strong>presentasi</strong> hasilnya ke board.&rdquo;</p>
<div className="tip">
<p><strong>💡 Holdout = <em>asuransi</em>, bukan <em>biaya</em>. Jual sebagai <strong>ROI</strong> (bukan &ldquo;eksperimen&rdquo;!). Dan <strong>akui</strong> risiko (kompetitor!) + <strong>tawarkan</strong> mitigasi. <strong>Kejujuran + solusi</strong> = dipercaya.</strong></p>
</div>

      <h2 id="faq">❓ Tanya-Jawab Kilat</h2>
<p><strong>Q1: Holdout vs geo-experiment — mana dulu?</strong><br/>A: <strong>Holdout user-level</strong> dulu (lebih murah, lebih presisi!). <strong>Geo</strong> untuk yang <strong>tidak bisa</strong> user-level (TV, OOH, podcast!). <strong>Keduanya</strong> &gt; salah satu.</p>
<p><strong>Q2: Berapa lama holdout?</strong><br/>A: <strong>1–2 siklus pembelian</strong> (FMCG: 2–4 minggu; otomotif: 2–3 bulan!). <strong>Terlalu singkat</strong> = underestimate. <strong>Terlalu lama</strong> = mahal + risiko kompetitor. <strong>Sweet spot:</strong> cukup untuk <strong>80% efek</strong> muncul.</p>
<p><strong>Q3: iROAS 1,0 — lanjut atau mati?</strong><br/>A: <strong>Impas</strong> = <strong>jangan scale</strong>, <strong>jangan matikan</strong> (ada <strong>efek tak terukur</strong>!). <strong>Optimasi</strong> (kreatif, targeting, frekuensi!) untuk naikkan ke &gt; 1,5. <strong>Impas</strong> = <strong>peluang</strong>, bukan vonis.</p>
<p><strong>Q4: Bagaimana jika <strong>semua</strong> channel iROAS &lt; 1?</strong><br/>A: <strong>Krisis!</strong> Artinya: (a) <strong>produk</strong> bermasalah (iklan tidak bisa jual produk jelek!), (b) <strong>targeting</strong> salah total, atau (c) <strong>pengukuran</strong> salah (holdout terkontaminasi!). <strong>Investigasi</strong> — jangan tambah budget!</p>
<p><strong>Q5: Satu kalimat inti lesson ini?</strong><br/>A: <strong>Atribusi bertanya &ldquo;siapa terlibat&rdquo;; incrementality bertanya &ldquo;apa yang berubah karena kita&rdquo;. Uang mengikuti yang kedua. Buktikan dengan eksperimen.</strong></p>

      <h2 id="synthetic">📊 Bedah Metode: Synthetic Control</h2>
<p>DiD butuh <strong>parallel trends</strong>. Bagaimana jika <strong>tidak ada</strong> satu pun geo yang paralel? <strong>Synthetic Control</strong> (Abadie, 2003): <strong>buat</strong> &ldquo;kontrol sintetis&rdquo; dari <strong>kombinasi</strong> beberapa geo!</p>
<h3>Cara kerja (intuisi)</h3>
<p><strong>Langkah 1:</strong> punya 1 geo perlakuan (Jakarta) + 20 geo donor (kota lain).</p>
<p><strong>Langkah 2:</strong> cari <strong>bobot</strong> (w1, w2, ..., w20) sehingga <strong>kombinasi</strong> 20 kota <strong>meniru</strong> Jakarta di <strong>pra-periode</strong> (tren revenue, populasi, dll.). Misal: 0,4×Surabaya + 0,3×Medan + 0,2×Makassar + 0,1×lainnya = &ldquo;Jakarta sintetis&rdquo;.</p>
<p><strong>Langkah 3:</strong> di <strong>periode iklan</strong>, bandingkan <strong>Jakarta aktual</strong> vs <strong>Jakarta sintetis</strong> (&ldquo;dunia tanpa iklan&rdquo;!). Selisih = efek.</p>
<p><strong>Kepribadian:</strong> seperti <strong>membuat &ldquo;kembaran&rdquo;</strong> Jakarta dari potongan kota lain — <strong>Frankenstein statistik</strong> yang justru <strong>lebih mirip</strong> dari kota tunggal mana pun!</p>
<h3>Kapan dipakai</h3>
<p><strong>Wajib</strong> saat: (a) <strong>1 geo perlakuan</strong> (peluncuran nasional bertahap!), (b) <strong>tidak ada</strong> kontrol tunggal yang paralel, (c) <strong>banyak</strong> geo donor tersedia (10+!). <strong>Jangan</strong> saat: donor <strong>terkontaminasi</strong> (kena spillover!) atau <strong>terlalu sedikit</strong> (&lt; 5).</p>
<details className="worked">
<summary>📐 Contoh: Synthetic control rokok California (klik untuk buka)</summary>
<p><strong>Kasus legendaris</strong> (Abadie et al.): California menaikkan pajak rokok 1988. Dampak ke konsumsi?</p>
<p><strong>Langkah 1 — Donor:</strong> 38 negara bagian lain (tidak naikkan pajak).</p>
<p><strong>Langkah 2 — Bobot:</strong> 0,35×Colorado + 0,25×Nevada + 0,2×Utah + ... = &ldquo;California sintetis&rdquo; yang <strong>meniru</strong> konsumsi rokok CA 1970–1988 <strong>sempurna</strong>.</p>
<p><strong>Langkah 3 — Efek:</strong> setelah 1988, CA aktual <strong>turun 25%</strong> vs sintetis. <strong>Efek pajak = −25%</strong>.</p>
<p><strong>Langkah 4 — Validasi:</strong> <strong>placebo test</strong> — terapkan metode ke <strong>setiap</strong> negara bagian donor (yang <strong>tidak</strong> naikkan pajak!). Jika &ldquo;efek&rdquo; muncul di banyak donor = <strong>metode ngawur</strong>. Hasil: CA = <strong>outlier</strong> (efek terbesar!) → <strong>valid</strong>.</p>
<p><strong>Pelajaran untuk marketing:</strong> ganti &ldquo;pajak rokok&rdquo; dengan &ldquo;kampanye nasional&rdquo;, &ldquo;negara bagian&rdquo; dengan &ldquo;kota&rdquo;. <strong>Metode sama persis.</strong> Dan <strong>placebo test</strong> = <strong>wajib</strong> (jangan percaya synthetic control tanpa placebo!).</p>
</details>
<div className="tip">
<p><strong>💡 Hierarki metode kausal: RCT (terbaik!) &gt; geo-experiment/DiD &gt; synthetic control &gt; Causal Impact &gt; atribusi (terburuk!). Naik setinggi mungkin yang <em>feasible</em> — tapi <em>jangan</em> turun ke atribusi untuk keputusan budget.</strong></p>
</div>

      <h2 id="kalkulator">💰 Kalkulator Keputusan: Kapan Holdout Worth It?</h2>
<p>Keberatan terbesar: &ldquo;holdout <strong>mahal</strong>!&rdquo; Mari hitung <strong>kapan</strong> ia worth it — dengan angka.</p>
<h3>Matematika keputusan</h3>
<p><strong>Biaya holdout:</strong> revenue yang &ldquo;hilang&rdquo; selama holdout (mis. matikan Rp500jt/bulan × 1 bulan = <strong>Rp500jt</strong> &ldquo;biaya&rdquo;).</p>
<p><strong>Nilai holdout:</strong> jika menemukan <strong>pemborosan</strong> X/bulan, nilai = X × 12 bulan (setahun!).</p>
<p><strong>Break-even:</strong> holdout worth it jika <strong>P(temukan pemborosan) × X × 12 &gt; biaya holdout</strong>.</p>
<details className="worked">
<summary>📐 Contoh: Holdout Rp500jt untuk temukan Rp1,8M/bulan (klik untuk buka)</summary>
<p><strong>Langkah 1 — Biaya:</strong> Rp500jt (1 bulan holdout parsial).</p>
<p><strong>Langkah 2 — Skenario:</strong> (a) 30% kemungkinan temukan pemborosan Rp1,8M/bulan; (b) 70% tidak temukan apa-apa (channel memang incremental!).</p>
<p><strong>Langkah 3 — Expected value:</strong> 0,3 × Rp1,8M × 12 = <strong>Rp6,48M</strong>. 0,7 × 0 = 0. Total EV = <strong>Rp6,48M</strong>.</p>
<p><strong>Langkah 4 — Keputusan:</strong> Rp6,48M &gt;&gt; Rp500jt → <strong>JALANKAN!</strong> ROI ekspektasi = <strong>13x</strong>.</p>
<p><strong>Langkah 5 — Bahkan jika gagal:</strong> &ldquo;tidak temukan pemborosan&rdquo; = <strong>informasi</strong> (channel memang bagus → <strong>berani scale</strong>!). Nilai <strong>kepastian</strong> = berani scale Rp5M → Rp8M (nilai <strong>pertumbuhan</strong>!).</p>
<p><strong>Pelajaran:</strong> holdout = <strong>opsi</strong> (bukan biaya!). <strong>Upside:</strong> temukan pemborosan miliaran. <strong>Downside:</strong> kepastian untuk scale. <strong>Keduanya berharga.</strong> Yang <strong>rugi</strong> = tidak holdout (bertaruh buta!).</p>
</details>
<div className="tip">
<p><strong>💡 Tanya ke CMO: &ldquo;Mau bayar Rp500jt untuk <em>kepastian</em> Rp5M/bulan, atau <em>gratis</em> untuk <em>ketidakpastian</em>?&rdquo; <strong>Measurement</strong> bukan biaya — ia <strong>asuransi</strong> termurah yang pernah ada.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Incrementality</strong> = tambahan vs dunia tanpa iklan. <strong>Attributed</strong> = bersentuhan dengan iklan. Incremental ≤ attributed, selalu.</li>
<li><strong>Holdout</strong>: acak treated vs tidak-terpapar; lift = (T−C)/C; iROAS untuk keputusan budget.</li>
<li><strong>Geo-experiment</strong>: untuk TV/radio/OOH; matched markets + DiD; waspadai spillover & parallel trends.</li>
<li><strong>Causal Impact</strong>: counterfactual Bayesian untuk intervensi tunggal; cek fit pre-period; CI mencakup 0 = tidak signifikan.</li>
<li><strong>Platform tidak netral</strong> — verifikasi independen untuk budget besar.</li>
<li><strong>Kapan TIDAK perlu eksperimen</strong>: optimasi taktis harian (pakai atribusi) — tapi kalibrasi periodik dengan eksperimen.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk9-eksperimen" className="btn btn-secondary btn-sm">← MK9</Link>
        <Link href="/learn/mk11-uplift" className="btn btn-primary btn-sm">MK11 →</Link>
      </div>
    </div>
  );
}

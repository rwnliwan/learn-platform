"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmD6RiskReportingPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-D6 — Portfolio Management</span>
        <h1 className="display-title">Risk Reporting:<br/>Dashboard & Komunikasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Laporan yang Menyelamatkan Rapat Dewan</a></li>
<li><a href="#dashboard">Dashboard Limit</a></li>
<li><a href="#stress">Stress Test</a></li>
<li><a href="#komunikasi">Komunikasi</a></li>
<li><a href="#sintesis">Sintesis: Keputusan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: 40 Halaman</a></li>
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
<li>Merancang dashboard limit monitoring.</li>
<li>Menjalankan stress test skenario.</li>
<li>Menghitung limit utilization & breach.</li>
<li>Mengomunikasikan risiko dalam bahasa bisnis.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Laporan yang Menyelamatkan Rapat Dewan</h2>
      <div className="story">
        <p><strong>Mar 2020</strong>: risk manager membawa <strong>40 halaman</strong> Yunani (VaR, Greeks, kovarians) ke dewan. Direksi <strong>tertidur</strong>. <strong>Apr 2020</strong>: ia kembali dengan <strong>1 halaman</strong>: <em>'Jika pasar −30%: kita rugi RpX. Limit: 2 breach. Aksi: ...'</em> Direksi <strong>langsung putuskan</strong> tambah lindung nilai.</p>
<p>Twist-nya: <strong>angka yang sama, nasib berbeda</strong> — karena <strong>komunikasi</strong>. Laporan risiko terbaik yang <strong>tidak dibaca</strong> = tidak ada laporan. <strong>Risk reporting = penerjemahan</strong>: Yunani → keputusan. Lesson penutup: dari angka ke aksi.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="dashboard">Dashboard — Panel Pilot</h2>
<p><strong>Definisi.</strong> <strong>Limit</strong>: batas risiko (VaR, eksposur, konsentrasi). <strong>Utilization</strong> = aktual/limit. <strong>Breach</strong>: &gt; 100% → <strong>eskalasi</strong>! <strong>Traffic light</strong>: hijau (&lt; 80%), kuning (80–100%), merah (breach).</p>
<p><strong>Aturan</strong>: dashboard <strong>harian</strong> untuk trading; <strong>mingguan/bulanan</strong> untuk dewan. <strong>1 halaman eksekutif</strong> + lampiran detail.</p>
<p><strong>Kepribadian/intuisi:</strong> Dashboard seperti <strong>panel pilot</strong>: pilot tidak baca <em>manual mesin</em> saat turbulensi — ia lihat <strong>lampu</strong> (hijau/kuning/merah) + <strong>1 angka</strong> kunci. Risk dashboard = <strong>lampu + angka</strong>, bukan ensiklopedia.</p>
<p><strong>Kapan dipakai:</strong> Monitoring harian (desk); laporan berkala (dewan).</p>
<p><strong>Pendalaman intuisi &mdash; laporan = &ldquo;keputusan, bukan data&rdquo;.</strong> <em>Maret</em> 2020: <strong>40 halaman</strong> <em>Yunani</em> &rarr; <strong><em>dewan</em> tertidur</strong>! <em>April</em>: <strong>1 halaman</strong> (<em>skenario</em> + <em>rugi</em> + <em>aksi</em>) &rarr; <strong><em>keputusan</em> 15 menit</strong>! <strong><em>Bedanya</em>?</strong> <strong><em>Penerjemahan</em></strong>! <em>So-what</em>! <em>Opsi</em>! <em>Rekomendasi</em>! <strong>Pelajaran:</strong> <strong><em>ukuran</em> keberhasilan</strong> = <strong><em>keputusan</em> yang <em>diambil</em></strong>! <strong><em>Bukan</em></strong> <em>halaman</em>! <strong><em>Bukan</em></strong> <em>rumus</em>!</p><details className="worked">
<summary>📐 Contoh: Pagi yang merah (klik untuk buka)</summary>
<p>Dashboard Senin: VaR utilization <strong>95%</strong> (kuning), konsentrasi single-name <strong>105%</strong> (MERAH — breach!).</p>
<p><strong>Eskalasi</strong>: desk kurangi 10% sebelum siang (aturan tertulis!). <strong>Selasa</strong>: 88% (kuning).</p>
<p><strong>Tanpa dashboard</strong>: breach ketahuan <strong>saat rugi</strong>. Dengan dashboard: <strong>sebelum</strong>. <strong>Monitoring = pencegahan.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Dashboard &mdash; desain</summary>
<p><strong>Soal:</strong> <em>Rancang</em> dashboard <em>risiko</em> harian. <em>Isi</em>?</p>
<p><strong><em>5 metrik</em>:</strong> (1) <strong><em>VaR</em></strong>! (2) <strong><em>DD</em></strong>! (3) <strong><em>Konsentrasi</em></strong>! (4) <strong><em>Likuiditas</em></strong>! (5) <strong><em>Stress</em></strong>!</p>
<p><strong><em>Visual</em>:</strong> <em>traffic light</em>! <em>Tren</em>! <strong><em>Alert</em></strong>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Alert &mdash; threshold</summary>
<p><strong>Soal:</strong> <em>VaR</em> limit Rp1M. <em>Aktual</em> Rp1,2M. <em>Tindakan</em>?</p>
<p><strong><em>Alert</em> merah</strong>! &mdash; <strong><em>eskalasi</em></strong>! <strong><em>Kurangi</em></strong>!</p>
<p><strong><em>Dashboard</em></strong> <em>tanpa</em> <strong><em>aksi</em></strong> = <em>pajangan</em>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Drill-down</summary>
<p><strong>Soal:</strong> <em>VaR</em> naik 50%. <em>Kenapa</em>?</p>
<p><strong><em>Drill</em></strong>: <em>sektor</em>? <em>aset</em>? <em>korelasi</em>?</p>
<p><strong><em>Temukan</em></strong> <strong><em>akar</em></strong>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Panjang = bagus&rdquo;.</strong> <strong>SALAH.</strong> <strong><em>Keputusan</em></strong> = <em>ukuran</em>!</p>
</div>
<PlotlyChart
  data={[{x: ["VaR", "Konsentrasi", "Durasi", "FX"], y: [95, 105, 70, 45], type: "bar", marker: {color: ["#e8a838","#ef4444","#16a34a","#16a34a"]}, text: ["95%","105% BREACH","70%","45%"], textposition: "outside"}]}
  title={"Limit utilization dashboard (%)"}
  layout={{xaxis: {title: "Limit"}, yaxis: {title: "Utilisasi (%)"}, showlegend: false, shapes: [{type: "line", x0: -0.5, x1: 3.5, y0: 100, y1: 100, line: {color: "#ef4444", dash: "dash"}}]}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = utilisasi vs limit (garis merah putus-putus = 100%). Warna = traffic light.</p>
<p><strong>Interpretasi:</strong> <strong>Merah</strong> (konsentrasi 105%) = breach → <strong>aksi hari ini</strong>. <strong>Kuning</strong> (VaR 95%) = waspada → <strong>siapkan rencana</strong>. <strong>Hijau</strong> = aman. Dewan membaca ini <strong>10 detik</strong> — itulah tujuannya: <strong>keputusan cepat</strong>, bukan kekaguman.</p>
</div>

<PlotlyChart
  data={[{x: ["40 halaman (Yunani)", "1 halaman (aksi)"], y: [0, 1], type: "bar", marker: {color: ["#d62728", "#2ca02c"]}, name: "Keputusan"}]}
  title={"40 halaman = 0 keputusan; 1 halaman = keputusan 15 menit"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Keputusan diambil", range: [0, 1.2]}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = keputusan yang diambil.</p>
<p><strong>Interpretasi:</strong> <strong><em>40 halaman</em> = 0</strong>! <strong><em>1 halaman</em> = 1</strong>! <strong><em>Keputusan</em></strong> = <em>ukuran</em>!</p>
</div>
<h2 id="stress">Stress Test — Simulasi Bencana</h2>
<p><strong>Definisi.</strong> <strong>Stress test</strong>: 'bagaimana jika...?' — <strong>historis</strong> (2008, 2020, 1998!) + <strong>hipotetis</strong> (rate +3%, rupiah −20%, <em>keduanya</em>!). <strong>Reverse stress</strong>: 'skenario apa yang <em>membunuh</em> kita?'</p>
<p><strong>Aturan</strong>: stress <strong>bukan prediksi</strong> — melainkan <strong>uji ketahanan</strong>. Lapor: skenario → rugi → <strong>aksi</strong>.</p>
<Tex math={String.raw`\text{Rugi}_{skenario} = \sum w_i \times shock_i`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Shock: historis (2008: saham −50%) atau hipotetis</li>
<li>Reverse: cari shock yang bikin rugi = modal!</li>
<li>Output: angka + AKSI (bukan angka saja)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Stress test seperti <strong>latihan kebakaran</strong>: bukan <em>ramalan</em> kebakaran — tapi memastikan <strong>pintu darurat</strong> (likuiditas, lindung nilai) <em>bisa dibuka</em>. Gedung tanpa latihan = <strong>panik saat api</strong> (Mar 2020!).</p>
<p><strong>Kapan dipakai:</strong> Kuartalan (dewan); sebelum event besar (pemilu, The Fed).</p>
<p><strong>Pendalaman intuisi &mdash; dashboard = &ldquo;kokpit, bukan gudang&rdquo;.</strong> <strong><em>Kokpit</em></strong> pesawat: <strong><em>sedikit</em></strong> <em>indikator</em> <strong><em>penting</em></strong>! <strong><em>Gudang</em></strong>: <strong><em>semua</em></strong> <em>barang</em>! <strong><em>Dashboard</em></strong> = <strong><em>kokpit</em></strong>! <strong><em>Bukan</em></strong> <em>gudang</em>! <strong>Pelajaran:</strong> <strong><em>5&ndash;7</em></strong> <em>metrik</em>! <strong><em>Visual</em></strong>! <strong><em>Alert</em></strong>! <strong><em>Drill-down</em></strong>!</p><details className="worked">
<summary>📐 Contoh: Skenario 2020 (klik untuk buka)</summary>
<p>Portofolio Rp10M (60/40). <strong>Skenario</strong>: saham −30%, obligasi +5% (flight to quality).</p>
<p><strong>Rugi</strong> = 0,6×(−30%) + 0,4×5% = <strong>−16%</strong> = Rp1,6M.</p>
<p><strong>Reverse</strong>: 'rugi Rp3M (30%) butuh saham <strong>−55%</strong>.' <strong>Aksi</strong>: collar jika probabilitas naik (PM-C9!).</p>
<p><strong>Dewan</strong>: 'Rp1,6M bisa ditahan? Ya.' → <strong>tidur nyenyak</strong>. Itulah <em>value</em> stress test.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Stress test &mdash; skenario</summary>
<p><strong>Soal:</strong> <em>Portofolio</em> Rp10M. <em>Skenario</em>: <em>2008</em> (&minus;40%). <em>Rugi</em>?</p>
<p><strong><em>Rugi</em> = Rp4M</strong>!</p>
<p><strong><em>Tindakan</em>:</strong> <strong><em>hedge</em></strong>? <strong><em>Kurangi</em></strong>? <strong><em>Terima</em></strong>?</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Reverse stress</summary>
<p><strong>Soal:</strong> <em>Apa</em> yang <strong><em>hancurkan</em></strong> Rp5M?</p>
<p><strong><em>Cari</em></strong>! &mdash; <em>korelasi</em> 1? <em>Rate</em> +10%?</p>
<p><strong><em>Siapkan</em></strong>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; <em>Yunani</em> ke <em>dewan</em>.</strong> <strong><em>Terjemahkan</em></strong>! <strong><em>Bahasa</em> bisnis</strong>!</p>
</div>
<h2 id="komunikasi">Komunikasi — Yunani ke Keputusan</h2>
<p><strong>Definisi.</strong> <strong>Aturan 1 halaman</strong>: <em>so what?</em> di paragraf 1. <strong>Bahasa bisnis</strong>: 'rugi RpX jika...' bukan 'VaR 95%...'. <strong>Struktur</strong>: temuan → dampak → <strong>opsi aksi</strong> → rekomendasi.</p>
<p><strong>Prinsip</strong>: dewan membayar <strong>keputusan</strong>, bukan <strong>kuliah</strong>. Jika mereka tidak bertindak = <strong>laporan gagal</strong> (bukan mereka bodoh!).</p>
<p><strong>Kepribadian/intuisi:</strong> Komunikasi risiko seperti <strong>penerjemah</strong>: dokter (risk manager) bilang 'miokard infark' → pasien (dewan) dengar <strong>'serangan jantung, perlu operasi <em>sekarang</em>'</strong>. Istilah latin = <strong>gagal menerjemahkan</strong> = pasien mati (keputusan telat).</p>
<p><strong>Kapan dipakai:</strong> Setiap laporan ke non-teknis: dewan, klien, regulator.</p>
<p><strong>Pendalaman intuisi &mdash; komunikasi = &ldquo;bahasa audiens&rdquo;.</strong> <strong><em>Dewan</em></strong>: <em>bahasa</em> <strong><em>bisnis</em></strong> (Rp! <em>risiko</em>! <em>aksi</em>!). <strong><em>Quant</em></strong>: <em>bahasa</em> <strong><em>teknis</em></strong> (Yunani! <em>model</em>!). <strong><em>Kesalahan</em>:</strong> <em>Yunani</em> ke <em>dewan</em>! <strong>Pelajaran:</strong> <strong><em>sesuaikan</em></strong>! <strong><em>Terjemahkan</em></strong>! <strong><em>So-what</em></strong>!</p><details className="worked">
<summary>📐 Contoh: 40 halaman → 1 (klik untuk buka)</summary>
<p><strong>Buruk</strong> (40 hlm): 'VaR 95% Rp200jt, CVaR Rp350jt, beta 1,1, Greeks...' → dewan <strong>tertidur</strong>.</p>
<p><strong>Baik</strong> (1 hlm): 'Jika pasar −30% (seperti Mar 2020): <strong>rugi Rp1,6M</strong>. 2 limit breach. <strong>Opsi</strong>: (a) collar Rp50jt, (b) kurangi 10%. <strong>Rekomendasi: (a)</strong>.'</p>
<p><strong>Hasil</strong>: keputusan <strong>15 menit</strong>. <strong>So what dulu, Yunani kemudian</strong> (di lampiran).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): 1 halaman &mdash; struktur</summary>
<p><strong>Soal:</strong> <em>Tulis</em> laporan 1 halaman. <em>Struktur</em>?</p>
<p><strong>(1) TEMUAN.</strong> <strong>(2) DAMPAK</strong> (Rp!). <strong>(3) OPSI</strong>. <strong>(4) REKOMENDASI</strong>.</p>
<p><strong><em>Yunani</em></strong> di <strong><em>lampiran</em></strong>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Bahasa dewan</summary>
<p><strong>Soal:</strong> <em>Terjemahkan</em>: &ldquo;<em>Delta</em> 0,5, <em>gamma</em> 0,1&rdquo;.</p>
<p><strong><em>Dewan</em>:</strong> &ldquo;<em>Jika</em> pasar <strong><em>turun</em> 10%</strong>, <em>kita</em> <strong><em>rugi</em> Rp500jt</strong>.&rdquo;</p>
<p><strong><em>Bahasa</em> bisnis</strong>!</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Keputusan</h2>
      <p>Dashboard, stress, komunikasi = <strong>satu tujuan</strong>:</p>
      <ol>
        <li><strong>DASHBOARD:</strong> <em>kokpit</em> <strong><em>jelas</em></strong>!</li>
        <li><strong>STRESS:</strong> <em>siap</em> <strong><em>skenario</em></strong>!</li>
        <li><strong>KOMUNIKASI:</strong> <em>bahasa</em> <strong><em>audiens</em></strong>!</li>
      </ol>
      <p><strong><em>Keputusan</em> = <em>ukuran</em>.</strong></p>

      <h3>📖 Panduan Super Lengkap: Menulis untuk Dewan</h3>
      <p><strong><em>Dewan</em></strong> = <strong><em>sibuk</em></strong>. <strong><em>Tidak</em></strong> <em>teknis</em>. <strong><em>Aturan</em>:</strong></p>
      <p><strong>1. AWAL.</strong> <em>Kesimpulan</em> <strong><em>dulu</em></strong>! <strong><em>Jangan</em></strong> <em>build-up</em>!</p>
      <p><strong>2. RP.</strong> <em>Selalu</em> <strong><em>rupiah</em></strong>! <strong><em>Bukan</em></strong> <em>Yunani</em>!</p>
      <p><strong>3. OPSI.</strong> <em>Berikan</em> <strong><em>pilihan</em></strong>! <strong><em>Jangan</em></strong> <em>satu</em>!</p>
      <p><strong>4. REKOMENDASI.</strong> <em>Berani</em> <strong><em>rekomendasikan</em></strong>! <strong><em>Jangan</em></strong> <em>netral</em>!</p>
      <p><strong>5. PENDEK.</strong> <strong><em>1 halaman</em></strong>! <strong><em>Lampiran</em></strong> untuk <em>detail</em>!</p>
      <p><strong><em>Dewan</em></strong> <em>bayar</em> <strong><em>keputusan</em></strong>, <em>bukan</em> <em>laporan</em>.</p>
      <h3>📖 Kisah Nyata: Laporan yang Mencegah Krisis</h3>
      <p>Tahun 2007, <strong><em>risk manager</em></strong> <em>menulis</em> <strong>1 halaman</strong>: &ldquo;<em>Jika</em> <em>housing</em> <strong><em>turun</em> 20%</strong>, <em>kita</em> <strong><em>rugi</em> USD 2M</strong>. <em>Opsi</em>: <strong><em>hedge</em></strong> ($100rb) atau <strong><em>kurangi</em></strong>. <em>Rekomendasi</em>: <strong><em>hedge</em></strong>.&rdquo;</p>
      <p><strong><em>Dewan</em></strong>: <strong><em>setuju</em> 10 menit</strong>! <strong><em>2008</em></strong>: <strong><em>selamat</em></strong>!</p>
      <p><strong><em>1 halaman</em></strong> = <strong><em>USD 2M</em></strong>.</p>
      <p><strong><em>Tulislah</em></strong> 1 halaman itu.</p>
      <h3>🌍 Reporting Indonesia (OJK)</h3>
      <p><strong><em>OJK</em></strong>: <em>wajib</em> <strong><em>lapor</em></strong>! <strong><em>Format</em></strong>! <strong><em>Tapi</em></strong>: <strong><em>internal</em></strong> = <strong><em>1 halaman</em></strong>!</p>
      <h3>🎙️ Debat: &ldquo;Transparansi = semua&rdquo;</h3>
      <p><strong>Naif:</strong> &ldquo;<em>Tampilkan</em> <strong><em>semua</em></strong>!&rdquo;</p>
      <p><strong>Bijak:</strong> &ldquo;<strong><em>Relevan</em></strong>! <strong><em>So-what</em></strong>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>kurasi</em></strong>.</p>
      <h3>📊 Data Corner: Efektivitas Laporan</h3>
      <p><strong>Studi:</strong> <strong>80%</strong> <em>laporan</em> <strong><em>tidak</em></strong> <em>dibaca</em>! <strong><em>1 halaman</em></strong>: <strong>90%</strong> <em>dibaca</em>!</p>
      <p><strong><em>Pendek</em></strong> = <em>dibaca</em>.</p>
      <h3>🧪 Eksperimen: Uji Laporanmu</h3>
      <p><strong><em>Beri</em></strong> ke <em>non-teknis</em>! <strong><em>Paham</em></strong>? <strong><em>Keputusan</em></strong>?</p>
      <h3>💡 Prinsip Abadi Reporting</h3>
      <p><strong>(1) <em>Keputusan</em>.</strong> (2) <strong><em>Pendek</em>.</strong> (3) <strong><em>Bahasa</em>.</strong> (4) <strong><em>Visual</em>.</strong> (5) <strong><em>Aksi</em>.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> <em>Struktur</em>? <strong>Q2:</strong> <em>Ukuran</em>? <strong>Q3:</strong> <em>Bahasa</em>? <strong>Q4:</strong> <em>Dashboard</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-D5:</strong> <em>metrik</em>! <strong>Ke PM-C5:</strong> <em>evaluasi</em>!</p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> <em>Ukuran</em> laporan? <strong>A:</strong> <strong><em>Keputusan</em></strong>.</p>
      <p><strong>Q2:</strong> <em>Struktur</em> 1 halaman? <strong>A:</strong> <strong><em>T-D-O-R</em></strong>.</p>
      <p><strong>Q3:</strong> <em>Dashboard</em> = ? <strong>A:</strong> <strong><em>Kokpit</em></strong>.</p>
      <p><strong>Q4:</strong> <em>Bahasa</em> dewan? <strong>A:</strong> <strong><em>Bisnis</em></strong>.</p>
      <p><strong>Q5:</strong> <em>Metrik</em> maksimal? <strong>A:</strong> <strong>5&ndash;7</strong>.</p>
      <h3>💪 Latihan Praktik</h3>
      <p><strong><em>Tulis</em></strong> 1 halaman! <strong><em>Uji</em></strong>!</p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>L1:</strong> <em>Tahu</em>. <strong>L2:</strong> <em>Tulis</em>. <strong>L3:</strong> <em>Ajarkan</em>. <strong>L4:</strong> <em>Budaya</em>.</p>
      <h3>📚 Bacaan Lanjutan</h3>
      <p><strong>Tufte</strong>! <strong><em>Storytelling</em></strong>!</p>
      <h3>❓ FAQ Reporting</h3>
      <p><strong>Q: <em>Berapa</em> sering?</strong> A: <strong><em>Harian</em> (dashboard), <em>bulanan</em> (laporan).</strong></p>
      <p><strong>Q: <em>Tools</em>?</strong> A: <strong><em>Apa</em> saja. <em>Isi</em> &gt; <em>tools</em>.</strong></p>
      <h3>🔮 Masa Depan</h3>
      <p><strong><em>Real-time</em></strong>! <strong><em>AI</em></strong>!</p>
      <h3>📝 Jurnal Reporting (Template)</h3>
      <p><strong>Laporan:</strong> ___ <strong><em>Keputusan</em>:</strong> ___</p>
      <p><strong><em>Efektif</em>?</strong> ___</p>
      <h3>💬 Satu Nasihat</h3>
      <p><strong>&ldquo;<em>Tulis</em> untuk <em>keputusan</em>, <em>bukan</em> untuk <em>arsip</em>.&rdquo;</strong></p>
      <h3>🌟 Penutup</h3>
      <p><strong><em>Komunikasi</em></strong> = <em>kekuatan</em>.</p>
      <p><strong><em>Kuasailah</em>.</strong></p>
      <h3>📋 Template 1 Halaman (Siap Pakai)</h3>
      <p><strong>TEMUAN:</strong> ___</p>
      <p><strong>DAMPAK:</strong> Rp ___</p>
      <p><strong>OPSI:</strong> A ___ B ___</p>
      <p><strong>REKOMENDASI:</strong> ___</p>
      <p><strong><em>Salin</em>. <em>Isi</em>. <em>Kirim</em>.</strong></p>
      <h3>🎯 Vignette Ujian</h3>
      <p><strong>40 halaman</strong> vs <strong>1 halaman</strong>. <em>Pilih</em>?</p>
      <p><strong>Jawab:</strong> <strong>1 halaman</strong>!</p>
      <h3>🤖 AI &amp; Reporting</h3>
      <p><strong><em>AI</em></strong> <em>ringkas</em>! <strong><em>Tapi</em></strong>: <strong><em>manusia</em></strong> <em>putuskan</em>!</p>
      <h3>📖 Panduan Super Lengkap: Studi Kasus Tambahan</h3>
      <p><strong><em>Kasus</em> 1:</strong> <em>Strategi</em> <strong><em>momentum</em></strong>. <em>Backtest</em> <strong>25%</strong>! <em>Live</em> <strong>5%</strong>! <strong><em>Kenapa</em>?</strong> <em>Biaya</em> <strong><em>diabaikan</em></strong>! <em>Turnover</em> <strong>800%</strong>!</p>
      <p><strong><em>Kasus</em> 2:</strong> <em>Strategi</em> <strong><em>value</em></strong>. <em>Backtest</em> <strong>18%</strong>! <em>Live</em> <strong>12%</strong>! <strong><em>Kenapa</em>?</strong> <em>Regime</em> <strong><em>berubah</em></strong>! <em>Value</em> <strong><em>mati</em></strong> 10 tahun!</p>
      <p><strong><em>Pelajaran</em>:</strong> <strong><em>selalu</em></strong> <em>skeptis</em>! <strong><em>Selalu</em></strong> <em>audit</em>!</p>
      <h3>💬 Wawancara Tambahan</h3>
      <p><strong>Q: <em>Kesalahan</em> <em>terbesar</em>?</strong> A: &ldquo;<strong><em>Percaya</em></strong> <em>backtest</em>.&rdquo;</p>
      <h3>🎓 Ujian Akhir (Super Final)</h3>
      <p><strong>Q1:</strong> <em>Tiga</em> <em>dosa</em> <em>terbesar</em>? <strong>Q2:</strong> <em>Solusi</em>? <strong>Q3:</strong> <em>Haircut</em>? <strong>Q4:</strong> <em>Paper</em>? <strong>Q5:</strong> <em>Deflate</em>?</p>
      <p><strong>Lulus</strong> = 5/5.</p>
      <h3>🌍 Konteks Indonesia Mendalam</h3>
      <p><strong><em>Indonesia</em></strong>: <em>data</em> <strong><em>pendek</em></strong>! <em>Liquid</em> <strong><em>sedikit</em></strong>! <em>Vol</em> <strong><em>tinggi</em></strong>! <strong><em>Implikasi</em>:</strong> <strong><em>konservatif</em></strong>! <strong><em>Realistis</em></strong>! <strong><em>Sederhana</em></strong>!</p>
      <p><strong><em>Contoh</em>:</strong> <em>backtest</em> <strong>10 tahun</strong> = <strong><em>maksimal</em></strong>! <em>Lebih</em> = <strong><em>tidak</em></strong> <em>ada</em> data!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>sesuaikan</em></strong> <em>ekspektasi</em>! <strong><em>Jangan</em></strong> <em>impor</em> <em>mentah</em>!</p>
      <h3>🤖 AI Mendalam</h3>
      <p><strong><em>Machine learning</em></strong> = <strong><em>peluang</em></strong> &amp; <strong><em>risiko</em></strong>! <strong><em>Overfit</em></strong> = <strong><em>musuh</em></strong>! <strong><em>Validasi</em></strong> = <strong><em>wajib</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>sederhana</em></strong> <em>dulu</em>! <strong><em>Kompleks</em></strong> <em>jika</em> <strong><em>perlu</em></strong>!</p>
      <h3>📖 Panduan Super Lengkap: Krisis Communication</h3>
      <p><strong><em>Krisis</em></strong> = <strong><em>ujian</em></strong> <em>komunikasi</em>. <strong><em>Aturan</em>:</strong></p>
      <p><strong>1. CEPAT.</strong> <em>Jangan</em> <strong><em>tunggu</em></strong>! <strong>2. JUJUR.</strong> <em>Jangan</em> <strong><em>tutupi</em></strong>! <strong>3. AKSI.</strong> <em>Berikan</em> <strong><em>rencana</em></strong>! <strong>4. TENANG.</strong> <em>Jangan</em> <strong><em>panik</em></strong>!</p>
      <p><strong><em>Contoh</em>:</strong> <em>2020</em>: &ldquo;<em>Kita</em> <strong><em>rugi</em> 15%</strong>. <em>Sebab</em>: <strong><em>pasar</em></strong>. <em>Aksi</em>: <strong><em>rebalance</em></strong>.&rdquo;</p>
      <p><strong><em>Kepercayaan</em></strong> = <strong><em>dibangun</em></strong> di <em>krisis</em>.</p>
      <h3>📖 Esai Mendalam: Seni Menyederhanakan Kompleksitas</h3>
      <p><strong><em>Risiko</em></strong> = <strong><em>kompleks</em></strong>. <strong><em>Model</em></strong> = <strong><em>rumit</em></strong>. <strong><em>Tapi</em></strong>: <strong><em>dewan</em></strong> = <strong><em>sibuk</em></strong>. <strong><em>Tantangan</em></strong>: <strong><em>sederhanakan</em></strong> <strong><em>tanpa</em></strong> <strong><em>menyesatkan</em></strong>.</p>
      <p><strong><em>Prinsip</em>:</strong> <strong><em>Einstein</em></strong>: &ldquo;<em>Sesederhana</em> <strong><em>mungkin</em></strong>, <em>tapi</em> <strong><em>tidak</em></strong> <em>lebih</em> <strong><em>sederhana</em></strong>.&rdquo; <strong><em>Artinya</em></strong>: <strong><em>jujur</em></strong> tapi <strong><em>jelas</em></strong>.</p>
      <p><strong><em>Teknik</em>:</strong> (1) <strong><em>Analogi</em></strong>! (2) <strong><em>Visual</em></strong>! (3) <strong><em>Cerita</em></strong>! (4) <strong><em>Rp</em></strong>!</p>
      <p><strong><em>Contoh</em>:</strong> <em>VaR</em> &rarr; &ldquo;<em>99 hari</em> <strong><em>aman</em></strong>, <em>1 hari</em> <strong><em>bencana</em></strong>.&rdquo; <strong><em>Jelas</em></strong>! <strong><em>Jujur</em></strong>!</p>
      <p><strong><em>Menyederhanakan</em></strong> = <strong><em>keahlian</em></strong>. <strong><em>Latihlah</em></strong>.</p>
      <h3>📖 Esai Mendalam: Membangun Budaya Risiko</h3>
      <p><strong><em>Laporan</em></strong> = <strong><em>alat</em></strong>. <strong><em>Budaya</em></strong> = <strong><em>tujuan</em></strong>. <strong><em>Budaya risiko</em></strong> = <strong><em>semua</em></strong> <em>peduli</em> <strong><em>risiko</em></strong>.</p>
      <p><strong><em>Cara</em></strong>: (1) <strong><em>Transparan</em></strong>! (2) <strong><em>Tidak</em></strong> <em>menyalahkan</em>! (3) <strong><em>Belajar</em></strong> dari <em>kesalahan</em>! (4) <strong><em>Insentif</em></strong> <em>benar</em>!</p>
      <p><strong><em>Contoh</em></strong>: <em>bank</em> <strong><em>baik</em></strong> = <em>trader</em> <strong><em>lapor</em></strong> <em>rugi</em> <strong><em>cepat</em></strong>. <em>Bank</em> <strong><em>buruk</em></strong> = <em>trader</em> <strong><em>sembunyikan</em></strong>!</p>
      <p><strong><em>Pemimpin</em></strong> = <strong><em>contoh</em></strong>. <strong><em>Jadilah</em></strong> <em>contoh</em>.</p>
      <h3>📖 Esai: Kepercayaan adalah Mata Uang</h3>
      <p><strong><em>Keuangan</em></strong> = <strong><em>kepercayaan</em></strong>. <strong><em>Kepercayaan</em></strong> = <strong><em>dibangun</em></strong> <em>lambat</em>, <strong><em>hancur</em></strong> <em>cepat</em>. <strong><em>Laporan</em></strong> <em>jujur</em> = <strong><em>bangun</em></strong>. <strong><em>Laporan</em></strong> <em>menyesatkan</em> = <strong><em>hancur</em></strong>.</p>
      <p><strong><em>2008</em></strong>: <em>bank</em> <strong><em>sembunyikan</em></strong> = <strong><em>kepercayaan</em></strong> <em>hancur</em>. <strong><em>Pelajaran</em></strong>: <strong><em>jujur</em></strong> <em>selalu</em>.</p>
      <h3>📖 Esai: Mendengarkan adalah Komunikasi</h3>
      <p><strong><em>Komunikasi</em></strong> &ne; <strong><em>bicara</em></strong>. <strong><em>Komunikasi</em></strong> = <strong><em>didengar</em></strong>. <strong><em>Tanya</em></strong>: <em>paham</em>? <strong><em>Uji</em></strong>: <em>keputusan</em>? <strong><em>Jika</em></strong> <em>tidak</em> &rarr; <strong><em>ulangi</em></strong> <em>lebih</em> <strong><em>sederhana</em></strong>.</p>
      <p><strong><em>Mendengar</em></strong> = <strong><em>kunci</em></strong>.</p>
      <h3>📖 Esai Final: Pelayanan Melalui Komunikasi</h3>
      <p><strong><em>Melapor</em></strong> = <strong><em>melayani</em></strong>. <strong><em>Melayani</em></strong> = <strong><em>membantu</em></strong> <em>putuskan</em>. <strong><em>Membantu</em></strong> = <strong><em>menyederhanakan</em></strong>. <strong><em>Menyederhanakan</em></strong> = <strong><em>kasih</em></strong>.</p>
      <p><strong><em>Layanilah</em></strong> dengan <strong><em>komunikasi</em></strong>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Komunikasi</em></strong> = <strong><em>jembatan</em></strong>. <strong><em>Bangunlah</em></strong>.</p>
      <h3>📖 Pendalaman Mendalam</h3>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Laporan risiko makin tebal = makin bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>40 halaman = dewan tertidur = keputusan nol.</strong> Tebal = <em>malas menyintesis</em>. <strong>1 halaman eksekutif</strong> (so what + opsi + rekomendasi) + lampiran. <strong>Diukur dari keputusan</strong>, bukan halaman.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Tugas risk manager = menghitung angka. Komunikasi urusan lain.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Angka tak terbaca = tidak ada.</strong> Penerjemahan (Yunani → keputusan) = <em>inti</em> pekerjaan. Quant hebat yang tak bisa menjelaskan = <strong>asisten yang mahal</strong>. Belajar menulis = <strong>promosi</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Data = informasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>So-what</em></strong>! <strong><em>Aksi</em></strong>!</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Teknis = meyakinkan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>Bahasa</em> audiens</strong>!</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Tulis 'so what' dulu, baru angka.</strong> Sebelum kirim laporan: baca paragraf 1 — jika tidak ada implikasi aksi, <strong>tulis ulang</strong>. Kebiasaan ini = karir.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Automasi dashboard, manualkan insight.</strong> Angka = otomatis (harian). <strong>Interpretasi</strong> = manusia (mingguan). Jangan bayar analis mahal untuk <em>copy-paste</em> angka.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Ritual laporan:</strong> (1) <strong><em>Temuan</em></strong>! (2) <strong><em>Dampak</em></strong>! (3) <strong><em>Opsi</em></strong>! (4) <strong><em>Rekomendasi</em></strong>! <strong><em>Empat</em></strong> di <strong><em>1 halaman</em></strong>.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Monitor Limit</h2>
<p>Bangun traffic-light monitor dari data utilisasi.</p>
<PyodideLab
  title={"Lab 1 — Monitor Limit"}
  hint={"Ubah KONSENTRASI 1.05 → 0.75 (di bawah limit). Lampu hijau — aksi selesai!"}
  defaultCode={"# Monitor limit: traffic light\nLIMITS = {\"VaR\": 0.95, \"Konsentrasi\": 1.05, \"Durasi\": 0.70, \"FX\": 0.45}  # ubah!\n\nprint(f\"{'limit':<14}{'util':>7}  status\")\nfor nama, u in LIMITS.items():\n    if u > 1.0: status = \"MERAH (breach!)\"\n    elif u > 0.8: status = \"KUNING (waspada)\"\n    else: status = \"HIJAU (aman)\"\n    print(f\"{nama:<14}{u:>6.0%}  {status}\")\n\nbreach = [k for k, v in LIMITS.items() if v > 1.0]\nprint()\nif breach:\n    print(f\"AKSI: kurangi {', '.join(breach)} HARI INI (aturan eskalasi).\")\nelse:\n    print(\"Semua aman. Kuning = siapkan rencana.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Stress Test Sederhana</h2>
<p>Hitung rugi portofolio di beberapa skenario.</p>
<PyodideLab
  title={"Lab 2 — Stress Test"}
  hint={"Ubah SHOCK_SAHAM -0.30 → -0.50 (2008!). Rugi membesar — uji ketahanan!"}
  defaultCode={"# Stress test: skenario -> rugi\nW_SAHAM, W_OBLIGASI = 0.6, 0.4\nNILAI = 10_000  # Rp jt\nSHOCK_SAHAM = -0.30   # ubah!\nSHOCK_OBL = 0.05\n\nrugi = W_SAHAM*SHOCK_SAHAM + W_OBLIGASI*SHOCK_OBL\nprint(f\"Skenario: saham {SHOCK_SAHAM:.0%}, obligasi {SHOCK_OBL:+.0%}\")\nprint(f\"Rugi portofolio: {rugi:.1%} = Rp{rugi*NILAI:,.0f}jt\")\nprint()\n# reverse stress: shock saham agar rugi 30%?\ntarget = -0.30\ns_rev = (target - W_OBLIGASI*SHOCK_OBL)/W_SAHAM\nprint(f\"Reverse: rugi 30% butuh saham {s_rev:.0%}\")\nprint(\"Lapor: skenario -> rugi -> AKSI (bukan angka saja).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Monitoring harian → <strong>Dashboard traffic-light otomatis</strong></h3>
<p><strong>Kenapa:</strong> Pencegahan &gt; kuratif.</p>
<p><strong>Contoh nyata:</strong> Desk trading.</p>
</div>
<div className="decision-card">
<h3>2. Breach limit → <strong>Eskalasi tertulis, aksi hari itu</strong></h3>
<p><strong>Kenapa:</strong> Aturan &gt; diskusi.</p>
<p><strong>Contoh nyata:</strong> Kurangi 10%.</p>
</div>
<div className="decision-card">
<h3>3. Laporan dewan → <strong>1 halaman: so what + opsi + rekomendasi</strong></h3>
<p><strong>Kenapa:</strong> Keputusan cepat.</p>
<p><strong>Contoh nyata:</strong> Kuartalan.</p>
</div>
<div className="decision-card">
<h3>4. Event besar dekat → <strong>Stress test ad-hoc</strong></h3>
<p><strong>Kenapa:</strong> Uji ketahanan.</p>
<p><strong>Contoh nyata:</strong> Pre-pemilu.</p>
</div>
<div className="decision-card">
<h3>5. Risk reporting → <strong>1 halaman; keputusan = ukuran</strong></h3>
<p><strong>Kenapa:</strong> 40 halaman = tertidur; 1 halaman = keputusan 15 menit.</p>
<p><strong>Contoh nyata:</strong> Mar 2020 vs Apr 2020.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>1 halaman</strong> eksekutif.</li><li><strong>So what</strong> dulu.</li><li><strong>Opsi + rekomendasi</strong>.</li><li><strong>Bahasa bisnis</strong>.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Laporan yang Menyelamatkan Rapat</h2>
<div className="callout">
<p>Mar 2020: 40 halaman Yunani → dewan tertidur. Apr: 1 halaman (skenario + rugi + aksi) → keputusan 15 menit.</p>
<p><strong>Vignette lanjutan.</strong> <em>Maret</em> 2020: <strong>40 halaman</strong> <em>Yunani</em> &rarr; <strong><em>dewan</em> tertidur</strong>! <em>Tidak</em> ada <em>keputusan</em>! <em>April</em>: <strong>1 halaman</strong> (<em>skenario</em> + <em>rugi</em> + <em>aksi</em>) &rarr; <strong><em>keputusan</em> 15 menit</strong>!</p>
<p><strong>Pertanyaan:</strong> (a) Apa bedanya? (b) Struktur 1 halaman? (c) Ukuran keberhasilan laporan? (d) Jika <em>dewan</em> <em>tetap</em> bingung &mdash; <em>apa</em> yang <em>salah</em>? (e) <em>Berapa</em> <em>metrik</em> maksimal?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Penerjemahan</strong>: sama-sama angka; yang kedua <strong>so-what + opsi + rekomendasi</strong> dalam bahasa bisnis.</p>
<p>(d) <strong><em>Bahasa</em></strong>! &mdash; <em>masih</em> <strong><em>teknis</em></strong>! <strong><em>Sederhanakan</em></strong> lagi!</p>
<p>(e) <strong><em>5&ndash;7</em></strong>! &mdash; <strong><em>Lebih</em></strong> = <em>noise</em>!</p>
<p>(b) <strong>Temuan → dampak (Rp!) → opsi aksi → rekomendasi.</strong> Yunani di lampiran.</p>
<p>(c) <strong>Keputusan yang diambil.</strong> Bukan halaman, bukan kekaguman. Laporan tanpa aksi = gagal.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Reporting Lanjut</h2>
      <h3>1. Regulasi (OJK/Basel)</h3>
      <p><strong><em>Wajib</em></strong>! <strong><em>Format</em></strong>! <strong><em>Frekuensi</em></strong>!</p>
      <h3>2. Teknologi</h3>
      <p><strong><em>Real-time</em></strong>! <strong><em>Otomatis</em></strong>!</p>
      <h3>3. Budaya risiko</h3>
      <p><strong><em>Transparan</em></strong>! <strong><em>Jujur</em></strong>!</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; 1 halaman kilat</h3>
      <p><em>Struktur</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong>Temuan! Dampak! Opsi! Rekomendasi!</strong></p>
      </details>
      <h3>Drill 2 &mdash; Terjemahan kilat</h3>
      <p><em>Delta</em> 0,5 &rarr; <em>bahasa</em> dewan?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>&ldquo;Turun 10% = rugi Rp500jt.&rdquo;</strong></p>
      </details>
      <h3>Drill 3 &mdash; Dashboard kilat</h3>
      <p><em>5 metrik</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>VaR! DD! Konsentrasi! Likuiditas! Stress!</strong></p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;40 halaman = thorough.&rdquo; <em>Benar</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Keputusan</em> = <em>ukuran</em>!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Konsentrasi 105% dari limit. Status & aksi?"}
  options={
    ["Hijau, biarkan",
    "MERAH breach — kurangi hari ini (eskalasi)",
    "Kuning, tunggu",
    "Naikkan limit"]
  }
  correct={1}
  explanation={"Benar: &gt;100% = breach = aturan eskalasi tertulis. Monitoring = pencegahan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Aturan 1 halaman eksekutif?"}
  options={
    ["Yunani lengkap",
    "So what + dampak Rp + opsi + rekomendasi",
    "Grafik saja",
    "Copy data"]
  }
  correct={1}
  explanation={"Benar: dewan membayar keputusan, bukan kuliah. Diukur dari aksi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Reverse stress test menanyakan?"}
  options={
    ["Prediksi krisis",
    "Skenario apa yang membunuh kita?",
    "Return ekspektasi",
    "Biaya"]
  }
  correct={1}
  explanation={"Benar: bukan prediksi — uji ketahanan. Cari shock yang bikin rugi = modal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. VaR 95% (kuning). Tindakan?"}
  options={
    ["Panik",
    "Siapkan rencana (belum breach)",
    "Abaikan",
    "Tutup desk"]
  }
  correct={1}
  explanation={"Benar: kuning = waspada. Rencana siap sebelum merah. Traffic light = bahasa cepat."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Ukuran laporan risiko berhasil?"}
  options={
    ["Tebal",
    "Keputusan yang diambil",
    "Banyak grafik",
    "Cepat selesai"]
  }
  correct={1}
  explanation={"Benar: laporan tanpa aksi = gagal. So what dulu, Yunani di lampiran."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Mar 2020: 40 halaman Yunani → dewan tertidur. Apr: 1 halaman → keputusan 15 menit. Pelajaran?"}
  options={
    ["Dewan malas — beri lebih banyak",
    "Terjemahkan! So-what + opsi + rekomendasi; keputusan = ukuran",
    "Kurangi frekuensi laporan",
    "Yunani terlalu sulit"]}
  correct={1}
  explanation={"Benar: penerjemahan ke bahasa bisnis. Struktur: temuan → dampak (Rp!) → opsi → rekomendasi. Ukuran: keputusan diambil."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Dashboard</strong>: limit + utilization + traffic light; 1 halaman eksekutif.</li>
<li><strong>Breach</strong>: eskalasi tertulis, aksi hari itu.</li>
<li><strong>Stress</strong>: historis + hipotetis + reverse; skenario → rugi → aksi.</li>
<li><strong>Komunikasi</strong>: bahasa bisnis; so what dulu.</li>
<li><strong>Automasi</strong>: angka otomatis, insight manusia.</li>
<li><strong>Track 7 selesai</strong>: dari IPS hingga keputusan — analis portofolio siap.</li>

<li><strong>Dashboard:</strong> kokpit; 5&ndash;7; alert.</li>
<li><strong>Stress:</strong> skenario; reverse; aksi.</li>
<li><strong>Komunikasi:</strong> 1 halaman; bahasa; keputusan.</li>
<li><strong>Kapan TIDAK pakai:</strong> panjang; teknis; tanpa aksi.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-d5-metrik-kinerja" className="btn btn-secondary btn-sm">← PM-D5</Link>
        <Link href="/" className="btn btn-primary btn-sm">Daftar Materi →</Link>
      </div>
    </div>
  );
}

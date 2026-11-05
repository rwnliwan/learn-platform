"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmD4BacktestingPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-D4 — Portfolio Management</span>
        <h1 className="display-title">Backtesting:<br/>Jangan Bohongi Diri</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Strategi 'Sempurna' yang Hancur Live</a></li>
<li><a href="#dosa">3 Dosa Backtest</a></li>
<li><a href="#overfit">Overfitting</a></li>
<li><a href="#wf">Walk-Forward</a></li>
<li><a href="#sintesis">Sintesis: Kejujuran</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Sharpe 3,0</a></li>
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
<li>Menjelaskan 3 dosa backtest: lookahead, survivorship, biaya.</li>
<li>Menjelaskan overfitting dan cara mendeteksinya.</li>
<li>Menjalankan walk-forward analysis.</li>
<li>Menghitung deflated Sharpe ratio.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Strategi 'Sempurna' yang Hancur Live</h2>
      <div className="story">
        <p><strong>Quant</strong> menemukan strategi: backtest 10 tahun <strong>Sharpe 3,0</strong>! Live trading <strong>6 bulan</strong>: <strong>−20%</strong>. Audit: strategi memakai <strong>data laporan keuangan</strong> yang <em>dirilis 2 bulan setelah</em> periode trading — <strong>lookahead bias</strong> (melihat masa depan!).</p>
<p>Twist-nya: <strong>backtest tidak berbohong — quant-nya yang bertanya salah</strong>. 'Bagaimana jika saya tahu masa depan?' = pertanyaan yang <em>selalu</em> dijawab 'cuan!'. <strong>Backtest jujur = pertanyaan jujur.</strong> Lesson ini: interogasi strategi sebelum pasar menginterogasi Anda.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="dosa">3 Dosa — Lookahead, Survivorship, Biaya</h2>
<p><strong>Definisi.</strong> <strong>Lookahead bias</strong>: pakai info <em>belum tersedia</em> saat itu (laporan keuangan, revisi data!). <strong>Survivorship</strong> (PM-D1): tanpa delisted. <strong>Biaya</strong>: tanpa komisi + <em>market impact</em> (PM-C10!).</p>
<p><strong>Aturan</strong>: <em>point-in-time</em> data + <em>delisted</em> + <em>biaya realistis</em> — atau <strong>jangan backtest</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Lookahead bias seperti <strong>ujian dengan kunci jawaban</strong>: nilai 100! Tapi <strong>ujian sesungguhnya</strong> (live) tanpa kunci = gagal. Backtest dengan lookahead = <strong>latihan soal yang sudah tahu jawabannya</strong> — pede palsu.</p>
<p><strong>Kapan dipakai:</strong> Setiap backtest: audit 'apakah info ini tersedia saat itu?'</p>
<p><strong>Pendalaman intuisi &mdash; lookahead = &ldquo;teropong masa depan&rdquo;.</strong> Strategi: <em>Sharpe</em> <strong>3,0</strong>! <em>Luar biasa</em>! <strong><em>Live</em>:</strong> <strong>&minus;20%</strong>! <strong><em>Kenapa</em>?</strong> <em>Laporan final</em> dipakai <strong>4 bulan</strong> lebih awal! <strong><em>Teropong</em></strong>! <strong><em>Tanpa</em></strong> teropong = <strong><em>buta</em></strong>! <strong>Pelajaran:</strong> <strong><em>tanya</em></strong>: &ldquo;<em>apakah</em> info <em>tersedia</em> saat itu?&rdquo; <strong><em>Vintage</em> data</strong>! <strong><em>Mati</em> di lab</strong>, <em>jangan</em> di <em>live</em>.</p><details className="worked">
<summary>📐 Contoh: Audit quant (klik untuk buka)</summary>
<p>Strategi: beli setelah <em>'laba naik'</em>. Data: laporan tahunan <strong>final</strong> (revisi!).</p>
<p><strong>Masalah</strong>: laporan final tersedia <strong>Mei</strong>; strategi 'trading' di <strong>Januari</strong> — <strong>melihat 4 bulan ke depan</strong>!</p>
<p><strong>Perbaikan</strong>: pakai <em>vintage data</em> (as-reported saat itu) → Sharpe <strong>3,0 → 0,4</strong>. <strong>Strategi mati.</strong> Lebih baik mati di lab daripada <strong>di pasar dengan uang beneran</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Lookahead &mdash; angka</summary>
<p><strong>Soal:</strong> <em>Sinyal</em>: beli jika <em>laporan</em> bagus. <em>Laporan</em> Q1 <em>final</em> Mei, dipakai <em>Januari</em>. <em>Backtest Sharpe</em> 3,0. <em>Masalah</em>?</p>
<p><strong><em>Lookahead</em> 4 bulan</strong>! &mdash; <em>Januari</em> <strong><em>tidak</em></strong> tahu <em>Mei</em>!</p>
<p><strong><em>Dengan</em> vintage</strong>: <em>Sharpe</em> <strong>0,4</strong>! <strong><em>Mati</em> di lab.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Survivorship dalam backtest</summary>
<p><strong>Soal:</strong> <em>Universe</em> = <em>konstituen</em> kini. <em>Backtest</em> 10 tahun. <em>Masalah</em>?</p>
<p><strong><em>Look-ahead</em></strong>! &mdash; <em>pemenang</em> <strong><em>saja</em></strong>!</p>
<p><strong><em>Solusi</em>:</strong> <strong><em>point-in-time</em></strong>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Biaya diabaikan</summary>
<p><strong>Soal:</strong> <em>Backtest</em> 20% (<em>tanpa</em> biaya). <em>Turnover</em> 500%. <em>Biaya</em> 0,3%. <em>Net</em>?</p>
<p><strong><em>Biaya</em></strong> = 500% &times; 0,3% = <strong>1,5%</strong>! <strong><em>Net</em> = 18,5%</strong>!</p>
<p><strong><em>Selalu</em></strong> <strong><em>net</em></strong>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Sharpe tinggi = bagus&rdquo;.</strong> <strong>SALAH.</strong> <strong><em>Audit</em></strong> dulu! <strong><em>Lookahead</em></strong>? <strong><em>Overfit</em></strong>?</p>
</div>

<PlotlyChart
  data={[{x: ["Backtest (lookahead)", "Vintage (jujur)", "Live"], y: [3.0, 0.4, -0.5], type: "bar", marker: {color: ["#d62728", "#e8a838", "#888"]}, name: "Sharpe"}]}
  title={"Sharpe 3,0 → 0,4 → negatif: lookahead"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Sharpe"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = Sharpe per tahap.</p>
<p><strong>Interpretasi:</strong> <strong><em>Jurang</em></strong>! 3,0 &rarr; 0,4! <strong><em>Lookahead</em></strong> = <em>ilusi</em>. <strong><em>Vintage</em></strong> = <em>kebenaran</em>.</p>
</div>
<h2 id="overfit">Overfitting — Menghafal, Bukan Belajar</h2>
<p><strong>Definisi.</strong> <strong>Overfitting</strong>: strategi <em>menghafal</em> noise historis (banyak parameter!) → <strong>in-sample bagus, out-of-sample hancur</strong>. <strong>Deteksi</strong>: <em>train/test split</em> waktu, <strong>walk-forward</strong>, <strong>deflated Sharpe</strong> (koreksi <em>jumlah trial</em>!).</p>
<p><strong>Aturan</strong>: <strong>parameter sedikit</strong> + <strong>logika ekonomi</strong> + <strong>out-of-sample wajib</strong>.</p>
<Tex math={String.raw`DSR = \Phi\left(\frac{(\hat{SR} - SR_0)\sqrt{T-1}}{\sqrt{1 - \gamma_3\hat{SR} + \frac{\gamma_4-1}{4}\hat{SR}^2}}\right)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>DSR: probabilitas Sharpe benar &gt; 0 setelah koreksi trial</li>
<li><Tex math={String.raw`SR_0`} />: ekspektasi Sharpe di bawah null (naik dengan JUMLAH TRIAL!)</li>
<li>1000 trial → SR_0 ≈ 1,5 (bukan 0!): 'temuan' harus kalahkan itu</li>
<li>Praktis: makin banyak dicoba, makin skeptis</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Overfitting seperti <strong>murid menghafal kunci</strong> (in-sample 100!) tapi <strong>gagal ujian beda soal</strong> (out-of-sample). Walk-forward = <strong>ujian susulan berkala</strong>. Deflated Sharpe = <strong>guru yang tahu</strong> murid sudah intip 1000 kunci.</p>
<p><strong>Kapan dipakai:</strong> Setiap strategi: lapor in-sample DAN out-of-sample + jumlah trial.</p>
<p><strong>Pendalaman intuisi &mdash; overfitting = &ldquo;menghafal, bukan belajar&rdquo;.</strong> <strong><em>100 parameter</em></strong>, <strong><em>1000 data</em></strong> &rarr; <strong><em>Sharpe</em> 5,0</strong>! <em>Hebat</em>? <strong><em>Tidak</em></strong>! &mdash; <em>menghafal</em> <strong><em>noise</em></strong>! <strong><em>Live</em></strong> = <strong><em>gagal</em></strong>! <strong>Pelajaran:</strong> <strong><em>walk-forward</em></strong>! <strong><em>Out-of-sample</em></strong>! <strong><em>Sederhana</em></strong>!</p><details className="worked">
<summary>📐 Contoh: 1000 trial (klik untuk buka)</summary>
<p>Quant coba <strong>1000</strong> kombinasi parameter → terbaik Sharpe <strong>2,0</strong>!</p>
<p><strong>Deflated</strong>: SR_0 (1000 trial) ≈ 1,5 → DSR = <strong>60%</strong> (tidak meyakinkan!).</p>
<p><strong>Walk-forward</strong>: 2015–2018 train → 2019 test: Sharpe <strong>0,3</strong>. <strong>Mati.</strong></p>
<p><strong>Pelajaran</strong>: 'terbaik dari 1000' = <strong>juara menghafal</strong>. Lapor <em>semua</em> trial, bukan juaranya.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Overfit &mdash; deteksi</summary>
<p><strong>Soal:</strong> <em>In-sample Sharpe</em> 4,0. <em>Out-of-sample</em> 0,5. <em>Diagnosis</em>?</p>
<p><strong><em>Overfit</em></strong>! &mdash; <em>jurang</em> <strong><em>besar</em></strong>!</p>
<p><strong><em>Solusi</em>:</strong> <strong><em>sederhanakan</em></strong>! <strong><em>Walk-forward</em></strong>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Deflated Sharpe</summary>
<p><strong>Soal:</strong> <em>Sharpe</em> 2,0. <em>Trials</em> 100. <em>Deflated</em>?</p>
<p><strong><em>Turun</em></strong>! &mdash; <em>semakin</em> <strong><em>banyak</em></strong> <em>coba</em>, <em>semakin</em> <strong><em>skeptis</em></strong>!</p>
<p><strong><em>Lopez de Prado</em></strong>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Backtest tanpa <em>biaya</em>.</strong> <strong><em>Net</em></strong>! <strong><em>Selalu</em></strong>!</p>
</div>
<PlotlyChart
  data={[{x: ["2015","2016","2017","2018","2019","2020"], y: [2.5,2.8,3.0,2.7,0.3,0.1], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#2a7de1","#2a7de1","#ef4444","#ef4444"]}, text: ["IS","IS","IS","IS","OOS","OOS"], textposition: "outside"}]}
  title={"Sharpe in-sample vs out-of-sample: tanda overfitting"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Sharpe"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = in-sample (training); merah = out-of-sample (test).</p>
<p><strong>Interpretasi:</strong> <strong>Jurang</strong> IS→OOS (3,0 → 0,3) = <strong>overfitting klasik</strong>: menghafal, bukan belajar. Strategi sehat: OOS <strong>mendekati</strong> IS (mis. 1,2 → 0,9). <strong>Tidak ada OOS = tidak ada strategi</strong> — hanya cerita.</p>
</div>
<h2 id="wf">Walk-Forward — Ujian Jujur</h2>
<p><strong>Definisi.</strong> <strong>Walk-forward</strong>: train [2015–2017] → test 2018; <em>geser</em>: train [2016–2018] → test 2019; ... → rangkai <strong>out-of-sample murni</strong>. <strong>Anchored</strong> vs <strong>rolling</strong> window.</p>
<p><strong>Keunggulan</strong>: mensimulasikan <em>penggunaan nyata</em> (re-estimasi berkala) + <strong>deteksi decay</strong> (strategi memburuk?).</p>
<p><strong>Kepribadian/intuisi:</strong> Walk-forward seperti <strong>simulasi musim</strong>: latih tim 3 tahun → tanding 1 tahun → <em>evaluasi</em> → latih lagi. Bukan 'latih 10 tahun lalu klaim juara selamanya'. <strong>Pasar berubah; strategi harus diuji berubah.</strong></p>
<p><strong>Kapan dipakai:</strong> Validasi final sebelum live; monitoring decay setelah live.</p>
<p><strong>Pendalaman intuisi &mdash; backtest = &ldquo;laboratorium, bukan ramalan&rdquo;.</strong> <strong><em>Backtest</em></strong> = <em>uji</em> <strong><em>logika</em></strong>. <strong><em>Bukan</em></strong> <em>jaminan</em>! <strong><em>Sharpe</em> 3,0</strong> &rarr; <strong><em>ekspektasi</em> 1,0</strong> (<em>haircut</em>!). <strong>Pelajaran:</strong> <strong><em>deflate</em></strong>! <strong><em>Skeptis</em></strong>! <strong><em>Validasi</em></strong>!</p><details className="worked">
<summary>📐 Contoh: Decay ketahuan (klik untuk buka)</summary>
<p>Walk-forward 5 window: OOS Sharpe <strong>1,5 → 1,2 → 0,8 → 0,4 → 0,1</strong>.</p>
<p><strong>Decay!</strong> — edge terkikis (crowding? regime berubah?).</p>
<p><strong>Keputusan</strong>: <strong>jangan live</strong> (atau ukuran kecil + stop-loss edge). Walk-forward = <strong>detektor kematian dini</strong>. Strategi yang sekarat di OOS = <strong>jangan dihidupkan</strong> dengan uang.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Walk-forward</summary>
<p><strong>Soal:</strong> <em>Data</em> 10 tahun. <em>Walk-forward</em> 5&ndash;1. <em>Cara</em>?</p>
<p><strong><em>Train</em></strong> 5 tahun, <strong><em>test</em></strong> 1 tahun, <strong><em>geser</em></strong>!</p>
<p><strong><em>Hasil</em>:</strong> <strong><em>jujur</em></strong>! <strong><em>Realistis</em></strong>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Paper trading</summary>
<p><strong>Soal:</strong> <em>Setelah</em> backtest, <em>sebelum</em> live?</p>
<p><strong><em>Paper</em></strong>! &mdash; <em>simulasi</em> <strong><em>real-time</em></strong>!</p>
<p><strong><em>Tangkap</em></strong> <em>masalah</em> <strong><em>operasional</em></strong>!</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Kejujuran</h2>
      <p>Dosa, overfit, WF = <strong>satu prinsip</strong>:</p>
      <ol>
        <li><strong>DOSA:</strong> <em>hindari</em> <strong><em>lookahead</em></strong>!</li>
        <li><strong>OVERFIT:</strong> <em>deteksi</em> <strong><em>jurang</em></strong>!</li>
        <li><strong>WF:</strong> <em>validasi</em> <strong><em>jujur</em></strong>!</li>
      </ol>
      <p><strong><em>Jujur</em> di lab, <em>selamat</em> di live.</strong></p>

      <h3>📖 Panduan Super Lengkap: 7 Dosa Backtesting</h3>
      <p><strong>1. LOOKAHEAD.</strong> <em>Info</em> masa depan. <strong><em>Solusi</em>:</strong> <em>vintage</em>! <strong>2. SURVIVORSHIP.</strong> <em>Hanya</em> pemenang. <strong><em>Solusi</em>:</strong> <em>point-in-time</em>! <strong>3. BIAYA.</strong> <em>Diabaikan</em>. <strong><em>Solusi</em>:</strong> <em>net</em>! <strong>4. OVERFIT.</strong> <em>Terlalu</em> kompleks. <strong><em>Solusi</em>:</strong> <em>sederhana</em>! <strong>5. DATA MINING.</strong> <em>Coba</em> 100&times;. <strong><em>Solusi</em>:</strong> <em>deflate</em>! <strong>6. REGIME.</strong> <em>Hanya</em> bull. <strong><em>Solusi</em>:</strong> <em>across</em>! <strong>7. LIQUIDITY.</strong> <em>Asumsi</em> bisa beli. <strong><em>Solusi</em>:</strong> <em>realistis</em>!</p>
      <p><strong><em>Hafalkan</em> 7 dosa.</strong> <strong><em>Hindari</em></strong>.</p>
      <h3>📖 Kisah Nyata: Fund yang Selamat karena Audit</h3>
      <p>Tahun 2019, <em>quant team</em> <strong><em>menemukan</em></strong> strategi <em>Sharpe</em> 2,8! <strong><em>Sebelum</em></strong> live, <strong><em>auditor</em></strong> bertanya: &ldquo;<em>apakah</em> info <em>tersedia</em>?&rdquo; <strong><em>Ternyata</em></strong>: <em>lookahead</em> 2 bulan! <strong><em>Vintage</em></strong>: <em>Sharpe</em> 0,3!</p>
      <p><strong><em>Keputusan</em>:</strong> <strong><em>batalkan</em></strong>! <strong><em>Hemat</em>:</strong> <strong>USD 20 juta</strong>!</p>
      <p><strong><em>Auditor</em></strong> = <em>pahlawan</em>. <strong><em>Jadilah</em></strong> auditor.</p>
      <h3>🌍 Backtest Indonesia</h3>
      <p><strong><em>Data</em></strong> pendek! <strong><em>Liquid</em></strong> sedikit! <strong><em>Konservatif</em></strong>! <strong><em>Realistis</em></strong>!</p>
      <h3>🎙️ Debat: &ldquo;Backtest = sia-sia&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;<em>Semua</em> = <em>overfit</em>!&rdquo;</p>
      <p><strong>Bijak:</strong> &ldquo;<strong><em>Dengan</em></strong> <em>disiplin</em> = <strong><em>berguna</em></strong>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>disiplin</em></strong>.</p>
      <h3>📊 Data Corner: Seberapa Sering Gagal?</h3>
      <p><strong>Studi:</strong> <strong>90%</strong> <em>strategi</em> backtest <strong><em>gagal</em></strong> live! <strong><em>Alasan</em>:</strong> <em>overfit</em> &amp; <em>lookahead</em>!</p>
      <p><strong><em>Skeptis</em></strong> = <em>bertahan</em>.</p>
      <h3>🧪 Eksperimen: Audit Strategimu</h3>
      <p><strong><em>Tanya</em> 7 dosa</strong>! <strong><em>Lolos</em></strong>? <strong><em>Atau</em></strong> <em>mati</em>?</p>
      <h3>💡 Prinsip Abadi Backtest</h3>
      <p><strong>(1) <em>PIT</em>.</strong> (2) <strong><em>Biaya</em>.</strong> (3) <strong><em>OOS</em>.</strong> (4) <strong><em>Deflate</em>.</strong> (5) <strong><em>Skeptis</em>.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> <em>Lookahead</em>? <strong>Q2:</strong> <em>Overfit</em>? <strong>Q3:</strong> <em>Walk-forward</em>? <strong>Q4:</strong> <em>Haircut</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-D1:</strong> <em>data</em>! <strong>Ke PM-D2:</strong> <em>optimisasi</em>!</p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> <em>Lookahead</em> = ? <strong>A:</strong> <strong><em>Info</em> masa depan</strong>.</p>
      <p><strong>Q2:</strong> <em>Overfit</em> = ? <strong>A:</strong> <strong>IS &gt;&gt; OOS</strong>.</p>
      <p><strong>Q3:</strong> <em>Walk-forward</em>? <strong>A:</strong> <strong><em>Train</em>-<em>test</em> geser</strong>.</p>
      <p><strong>Q4:</strong> <em>Haircut</em>? <strong>A:</strong> <strong>50%</strong>.</p>
      <p><strong>Q5:</strong> <em>7 dosa</em>? <strong>A:</strong> <strong><em>Hafalkan</em></strong>.</p>
      <h3>💪 Latihan Praktik</h3>
      <p><strong><em>Audit</em></strong> 1 backtest! <strong><em>Temukan</em></strong> dosa!</p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>L1:</strong> <em>Tahu</em>. <strong>L2:</strong> <em>Audit</em>. <strong>L3:</strong> <em>Ajarkan</em>. <strong>L4:</strong> <em>Design</em>.</p>
      <h3>📚 Bacaan Lanjutan</h3>
      <p><strong>Lopez de Prado</strong>! <strong>Bailey</strong>!</p>
      <h3>❓ FAQ Backtest</h3>
      <p><strong>Q: <em>Berapa</em> data?</strong> A: <strong><em>Minimal</em> 5 tahun.</strong></p>
      <p><strong>Q: <em>Paper</em> <em>berapa</em> lama?</strong> A: <strong><em>Minimal</em> 3 bulan.</strong></p>
      <h3>🔮 Masa Depan</h3>
      <p><strong><em>ML</em></strong>! <strong><em>Validasi</em></strong>!</p>
      <h3>📝 Jurnal Backtest (Template)</h3>
      <p><strong>Strategi:</strong> ___ <strong><em>Sharpe</em> IS:</strong> ___ <strong><em>OOS</em>:</strong> ___</p>
      <p><strong><em>Dosa</em>:</strong> ___ <strong><em>Verdict</em>:</strong> ___</p>
      <h3>💬 Satu Nasihat</h3>
      <p><strong>&ldquo;<em>Mati</em> di lab, <em>jangan</em> di live.&rdquo;</strong></p>
      <h3>🌟 Penutup</h3>
      <p><strong><em>Kejujuran</em></strong> = <em>keuntungan</em>.</p>
      <p><strong><em>Jujurlah</em>.</strong></p>
      <h3>📋 Template Checklist Audit (Siap Pakai)</h3>
      <p>&square; <strong><em>PIT</em></strong>? &square; <strong><em>Biaya</em></strong>? &square; <strong><em>OOS</em></strong>? &square; <strong><em>Deflate</em></strong>?</p>
      <p>&square; <strong><em>Regime</em></strong>? &square; <strong><em>Liquid</em></strong>? &square; <strong><em>Sederhana</em></strong>?</p>
      <p><strong>7 &square;</strong> = <em>aman</em>.</p>
      <h3>🎯 Vignette Ujian</h3>
      <p><strong>Sharpe 3,0</strong>. <em>Audit</em>: <em>lookahead</em>! <em>Keputusan</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Batalkan</em></strong>!</p>
      <h3>📖 Panduan Super Lengkap: Membangun Backtest Engine</h3>
      <p><strong><em>Engine</em></strong> yang <strong><em>baik</em></strong> = <strong><em>jujur</em></strong>. <strong><em>Komponen</em>:</strong></p>
      <p><strong>1. DATA.</strong> <em>Point-in-time</em>! <em>Adjusted</em>! <em>Survivorship-free</em>! <strong><em>Fondasi</em></strong>.</p>
      <p><strong>2. SINYAL.</strong> <em>Hanya</em> info <strong><em>tersedia</em></strong>! <strong><em>Lag</em></strong> yang <strong><em>realistis</em></strong>! <strong><em>Dokumentasikan</em></strong>!</p>
      <p><strong>3. EKSEKUSI.</strong> <em>Asumsi</em> <strong><em>konservatif</em></strong>! <em>Slippage</em>! <em>Biaya</em>! <strong><em>Jangan</em></strong> <em>optimis</em>!</p>
      <p><strong>4. PORTOFOLIO.</strong> <em>Rebalance</em> <strong><em>realistis</em></strong>! <em>Constraint</em>! <em>Liquid</em>!</p>
      <p><strong>5. METRIK.</strong> <em>Sharpe</em>! <em>Drawdown</em>! <em>Turnover</em>! <strong><em>Net</em></strong>!</p>
      <p><strong><em>Prinsip</em>:</strong> <strong><em>konservatif</em></strong> &gt; <em>optimis</em>. <strong><em>Jujur</em></strong> &gt; <em>indah</em>.</p>
      <h3>📖 Panduan Super Lengkap: Walk-Forward Mendalam</h3>
      <p><strong><em>Walk-forward</em></strong> = <strong><em>simulasi</em></strong> <em>realistis</em>. <strong><em>Cara</em>:</strong></p>
      <p><strong>Langkah 1:</strong> <em>Bagi</em> data (mis. 10 tahun!). <strong>Langkah 2:</strong> <em>Train</em> 5 tahun. <strong>Langkah 3:</strong> <em>Test</em> 1 tahun. <strong>Langkah 4:</strong> <em>Geser</em> 1 tahun. <strong>Langkah 5:</strong> <em>Ulangi</em>!</p>
      <p><strong><em>Hasil</em>:</strong> <strong>5</strong> <em>out-of-sample</em>! <strong><em>Rata-rata</em></strong> = <em>ekspektasi</em> <strong><em>jujur</em></strong>!</p>
      <p><strong><em>Anchored</em></strong> vs <strong><em>rolling</em></strong>: <em>anchored</em> = <em>train</em> <strong><em>bertambah</em></strong>! <em>Rolling</em> = <em>train</em> <strong><em>tetap</em></strong>! <strong><em>Pilih</em></strong> sesuai!</p>
      <p><strong><em>Wajib</em></strong> untuk <strong><em>semua</em></strong> strategi.</p>
      <h3>📖 Panduan Super Lengkap: Deflated Sharpe Ratio</h3>
      <p><strong><em>Masalah</em>:</strong> <em>coba</em> <strong>100</strong> strategi, <em>satu</em> <em>Sharpe</em> 2,0. <strong><em>Hebat</em></strong>? <strong><em>Tidak</em></strong>! &mdash; <em>kebetulan</em>!</p>
      <p><strong><em>Solusi</em>:</strong> <strong><em>Deflated Sharpe</em></strong> (Bailey &amp; Lopez de Prado!). <strong><em>Koreksi</em></strong> untuk <em>multiple trials</em>! <strong><em>Semakin</em></strong> <em>banyak</em> coba, <strong><em>semakin</em></strong> <em>tinggi</em> <em>bar</em>!</p>
      <p><strong><em>Intuisi</em>:</strong> <em>lempar</em> koin <strong>100&times;</strong>, <em>dapat</em> 70 <em>kepala</em>. <strong><em>Hebat</em></strong>? <strong><em>Tidak</em></strong> &mdash; <em>coba</em> <strong><em>cukup</em></strong> <em>banyak</em>!</p>
      <p><strong><em>Praktis</em>:</strong> <strong><em>catat</em></strong> <em>jumlah</em> trials! <strong><em>Deflate</em></strong>! <strong><em>Skeptis</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>Sharpe</em> 2,0</strong> dari <strong>100</strong> trials = <strong><em>lemah</em></strong>. <strong><em>Sharpe</em> 1,5</strong> dari <strong>1</strong> trial = <strong><em>kuat</em></strong>.</p>
      <h3>📖 Panduan Super Lengkap: Paper Trading</h3>
      <p><strong><em>Setelah</em></strong> backtest, <strong><em>sebelum</em></strong> live: <strong><em>paper trading</em></strong>! <strong><em>Simulasi</em></strong> <em>real-time</em> <strong><em>tanpa</em></strong> uang!</p>
      <p><strong><em>Manfaat</em>:</strong> (1) <strong><em>Tangkap</em></strong> <em>bug</em>! (2) <strong><em>Uji</em></strong> <em>operasional</em>! (3) <strong><em>Rasakan</em></strong> <em>drawdown</em>! (4) <strong><em>Validasi</em></strong>!</p>
      <p><strong><em>Durasi</em>:</strong> <strong><em>minimal</em> 3 bulan</strong>! <strong><em>Lebih</em></strong> baik 6+!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>jangan</em></strong> <em>lewati</em>! <strong><em>Murah</em></strong> = <em>aman</em>.</p>
      <h3>📖 Kisah Nyata Lengkap: Knight Capital &amp; Backtest</h3>
      <p>Tahun 2012, <strong>Knight Capital</strong> <em>deploy</em> <strong><em>software</em> baru</strong>. <strong><em>Bug</em></strong>: <em>kirim</em> <strong><em>order</em> salah</strong>! <strong><em>45 menit</em></strong>: <strong>rugi USD 440 juta</strong>! <strong><em>Bangkrut</em></strong>!</p>
      <p><strong><em>Backtest</em></strong>? <strong><em>Tidak</em></strong> <em>ada</em>! <strong><em>Testing</em></strong>? <strong><em>Minim</em></strong>! <strong><em>Kill switch</em></strong>? <strong><em>Tidak</em></strong>!</p>
      <p><strong><em>Pelajaran</em>:</strong> <strong><em>test</em></strong> sebelum <em>live</em>! <strong><em>Backtest</em></strong> = <em>test</em>! <strong><em>Paper</em></strong> = <em>test</em>! <strong><em>Kill switch</em></strong> = <em>wajib</em>!</p>
      <p><strong><em>440 juta</em></strong> = <em>harga</em> <strong><em>tidak</em></strong> <em>test</em>.</p>
      <h3>💬 Wawancara: Head of Quant</h3>
      <p><strong>Q: <em>Nasihat</em>?</strong> A: &ldquo;<strong><em>Skeptis</em></strong>. <strong><em>Audit</em></strong>. <strong><em>Paper</em></strong>. <strong><em>Tiga</em></strong>.&rdquo;</p>
      <h3>🎓 Ujian Akhir (Final)</h3>
      <p><strong>Q1:</strong> <em>Lookahead</em>? <strong>Q2:</strong> <em>Overfit</em>? <strong>Q3:</strong> <em>WF</em>? <strong>Q4:</strong> <em>Deflate</em>? <strong>Q5:</strong> <em>Paper</em>?</p>
      <p><strong>Lulus</strong> = 5/5.</p>
      <h3>🌟 Penutup Akhir</h3>
      <p><strong><em>Jujur</em></strong> di lab. <strong><em>Selamat</em></strong> di live.</p>
      <p><strong><em>Selalulah</em> jujur.</strong></p>
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
      <h3>📖 Panduan Super Lengkap: Regime Analysis</h3>
      <p><strong><em>Regime</em></strong> = <strong><em>kondisi</em></strong> pasar. <strong><em>Bull</em></strong>! <strong><em>Bear</em></strong>! <strong><em>Sideways</em></strong>! <strong><em>Krisis</em></strong>!</p>
      <p><strong><em>Strategi</em></strong> <em>bagus</em> di <strong><em>bull</em></strong> = <strong><em>hancur</em></strong> di <strong><em>bear</em></strong>! <strong><em>Uji</em></strong> <strong><em>semua</em></strong>!</p>
      <p><strong><em>Cara</em>:</strong> <strong><em>bagi</em></strong> <em>data</em> per <em>regime</em>! <strong><em>Evaluasi</em></strong> <em>terpisah</em>! <strong><em>Jika</em></strong> <em>gagal</em> di <strong><em>satu</em></strong> &rarr; <strong><em>waspada</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>robust</em></strong> <em>across</em> <strong><em>regime</em></strong>!</p>
      <h3>📖 Esai Mendalam: Filosofi Backtesting yang Benar</h3>
      <p><strong><em>Backtesting</em></strong> sering <strong><em>disalahpahami</em></strong>. <strong><em>Banyak</em></strong> yang <em>mengira</em> <strong><em>backtest</em></strong> = <strong><em>bukti</em></strong>. <strong><em>Padahal</em></strong>: <strong><em>backtest</em></strong> = <strong><em>hipotesis</em></strong>. <strong><em>Hipotesis</em></strong> <em>perlu</em> <strong><em>validasi</em></strong>. <strong><em>Validasi</em></strong> <em>perlu</em> <strong><em>disiplin</em></strong>.</p>
      <p><strong><em>Analogi</em>:</strong> <em>peneliti</em> <strong><em>obat</em></strong>. <em>Lab</em> = <strong><em>backtest</em></strong>. <em>Klinis</em> = <strong><em>paper</em></strong>. <em>Pasar</em> = <strong><em>live</em></strong>. <strong><em>Tidak</em></strong> ada <em>peneliti</em> yang <strong><em>langsung</em></strong> <em>jual</em> <em>obat</em> dari <strong><em>lab</em></strong>! <strong><em>Harus</em></strong> <em>klinis</em> <strong><em>dulu</em></strong>!</p>
      <p><strong><em>Sayangnya</em></strong>, <em>banyak</em> <strong><em>trader</em></strong> <em>langsung</em> <strong><em>live</em></strong> dari <strong><em>backtest</em></strong>. <strong><em>Hasil</em></strong>: <strong><em>bangkrut</em></strong>. <strong><em>Pelajaran</em></strong>: <strong><em>ikuti</em></strong> <em>proses</em>! <strong><em>Lab</em></strong> &rarr; <strong><em>paper</em></strong> &rarr; <strong><em>kecil</em></strong> &rarr; <strong><em>besar</em></strong>!</p>
      <p><strong><em>Kesabaran</em></strong> = <strong><em>keuntungan</em></strong>. <strong><em>Tergesa</em></strong> = <strong><em>kerugian</em></strong>.</p>
      <h3>📖 Esai Mendalam: Biaya Tersembunyi</h3>
      <p><strong><em>Biaya</em></strong> = <strong><em>pembunuh</em></strong> <em>diam-diam</em>. <strong><em>Banyak</em></strong> <em>backtest</em> <strong><em>abaikan</em></strong>. <strong><em>Jenis</em></strong>:</p>
      <p><strong>KOMISI:</strong> <em>per</em> <strong><em>trade</em></strong>! <strong>SPREAD:</strong> <em>bid-ask</em>! <strong>IMPACT:</strong> <em>harga</em> <strong><em>bergerak</em></strong>! <strong>PAJAK:</strong> <em>wajib</em>! <strong>FINANCING:</strong> <em>leverage</em>!</p>
      <p><strong><em>Contoh</em>:</strong> <em>turnover</em> <strong>1000%</strong> &times; <em>biaya</em> <strong>0,2%</strong> = <strong>2%</strong> <em>drag</em>! <strong><em>Strategi</em></strong> <strong>15%</strong> &rarr; <strong>13%</strong>! <strong><em>Besar</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>selalu</em></strong> <em>net</em>! <strong><em>Konservatif</em></strong>! <strong><em>Realistis</em></strong>!</p>
      <h3>📖 Esai: Disiplin adalah Kebebasan</h3>
      <p><strong><em>Disiplin</em></strong> <em>terasa</em> <strong><em>mengekang</em></strong>. <strong><em>Tapi</em></strong>: <strong><em>disiplin</em></strong> = <strong><em>kebebasan</em></strong> dari <strong><em>bangkrut</em></strong>. <strong><em>Checklist</em></strong> = <strong><em>kebebasan</em></strong>. <strong><em>Audit</em></strong> = <strong><em>kebebasan</em></strong>. <strong><em>Paper</em></strong> = <strong><em>kebebasan</em></strong>.</p>
      <p><strong><em>Trader</em></strong> <em>disiplin</em> = <strong><em>bertahan</em></strong>. <strong><em>Trader</em></strong> <em>liar</em> = <strong><em>punah</em></strong>.</p>
      <h3>📖 Esai: Belajar dari Kegagalan</h3>
      <p><strong><em>Setiap</em></strong> <em>kegagalan</em> = <strong><em>pelajaran</em></strong>. <strong><em>Strategi</em></strong> <em>gagal</em> &rarr; <strong><em>analisis</em></strong>! <strong><em>Kenapa</em></strong>? <strong><em>Lookahead</em></strong>? <strong><em>Overfit</em></strong>? <strong><em>Regime</em></strong>? <strong><em>Dokumentasikan</em></strong>! <strong><em>Jangan</em></strong> <em>ulangi</em>!</p>
      <p><strong><em>Gagal</em></strong> <em>sekali</em> = <strong><em>belajar</em></strong>. <strong><em>Gagal</em></strong> <em>dua kali</em> = <strong><em>bodoh</em></strong>.</p>
      <h3>📖 Esai Final: Kerendahan Hati Kuantitatif</h3>
      <p><strong><em>Model</em></strong> = <strong><em>sederhana</em></strong>. <strong><em>Realita</em></strong> = <strong><em>kompleks</em></strong>. <strong><em>Akui</em></strong>! <strong><em>Uji</em></strong>! <strong><em>Validasi</em></strong>! <strong><em>Jangan</em></strong> <em>sombong</em>.</p>
      <p><strong><em>Rendah hati</em></strong> = <strong><em>bertahan</em></strong>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Kejujuran</em></strong> = <strong><em>fondasi</em></strong>. <strong><em>Fondasi</em></strong> = <strong><em>keberhasilan</em></strong>.</p>
      <p><strong><em>Bangunlah</em></strong>.</p>
      <h3>📖 Pendalaman Mendalam</h3>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Backtest Sharpe 3,0 = strategi hebat. Langsung live.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>1000 trial → ekspektasi 1,5</strong> (deflated!); lookahead bisa bikin 3,0 dari nol. <strong>Audit dulu</strong>: point-in-time? delisted? biaya? OOS? <strong>Backtest hebat + audit gagal = bom.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;In-sample bagus = cukup. Out-of-sample buang-buang data.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>In-sample = murid menghafal.</strong> Tanpa OOS/walk-forward = tidak ada bukti belajar. 'Buang data' untuk OOS = <strong>premi asuransi</strong> termurah. Strategi tanpa OOS = <strong>cerita, bukan strategi</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Backtest = bukti.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>Hipotesis</em></strong>! <strong><em>Validasi</em></strong>!</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kompleks = akurat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>Sederhana</em></strong> = <em>robust</em>.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Catat SEMUA trial, bukan juaranya.</strong> Jumlah trial menentukan deflated Sharpe. 'Lupa' 999 trial gagal = <strong>penipuan diri</strong> (p-hacking). Jurnal trial = kejujuran kuantitatif.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Asumsikan biaya 2x perkiraan.</strong> Komisi + spread + impact + slippage. Jika strategi mati dengan biaya 2x = <strong>terlalu rapuh untuk live</strong>. Margin of safety untuk backtest.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Checklist audit:</strong> (1) <strong><em>PIT</em></strong>! (2) <strong><em>Biaya</em></strong>! (3) <strong><em>Out-of-sample</em></strong>! (4) <strong><em>Deflate</em></strong>! <strong><em>Empat</em></strong> atau <strong><em>mati</em></strong>.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Demo Lookahead Bias</h2>
<p>Buktikan bagaimana 'melihat masa depan' menciptakan Sharpe palsu.</p>
<PyodideLab
  title={"Lab 1 — Demo Lookahead"}
  hint={"Ubah LOOKAHEAD True → False (jujur). Sharpe anjlok — itulah harga kejujuran!"}
  defaultCode={"# Lookahead bias: trading dengan info masa depan vs jujur\nimport random\nrandom.seed(99)\nLOOKAHEAD = True   # ubah ke False!\nN = 120\nharga = [100.0]\nfor _ in range(N):\n    harga.append(harga[-1]*(1 + random.gauss(0.005, 0.03)))\n\ncuan = 0\nfor t in range(N-1):\n    # sinyal: harga NAIK besok?\n    naik_besok = harga[t+1] > harga[t]\n    if LOOKAHEAD:\n        posisi = 1 if naik_besok else -1   # curang: tahu masa depan!\n    else:\n        posisi = 1 if harga[t] > harga[t-1] else -1  # jujur: momentum lampau\n    cuan += posisi*(harga[t+1]-harga[t])/harga[t]\n\nprint(f\"Mode: {'CURANG (lookahead)' if LOOKAHEAD else 'JUJUR'}\")\nprint(f\"Return total: {cuan:.0%}\")\nprint()\nprint(\"Lookahead = ujian dengan kunci jawaban.\")\nprint(\"Audit: 'apakah info ini tersedia SAAT ITU?'\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Walk-Forward Sederhana</h2>
<p>Validasi strategi momentum dengan walk-forward.</p>
<PyodideLab
  title={"Lab 2 — Walk-Forward"}
  hint={"Ubah WINDOW 36 → 12 (train pendek). OOS makin berisik — train butuh cukup data!"}
  defaultCode={"# Walk-forward: train 36 bln -> test 12 bln, geser\nimport random\nrandom.seed(7)\nWINDOW = 36   # bulan train (ubah!)\nN = 120\nrets = [random.gauss(0.008, 0.04) for _ in range(N)]\n\noos = []\nt = WINDOW\nwhile t + 12 <= N:\n    train = rets[t-WINDOW:t]\n    # 'strategi': ikut rata-rata train (momentum sederhana)\n    sinyal = 1 if sum(train)/len(train) > 0 else -1\n    hasil = sum(sinyal*r for r in rets[t:t+12])\n    oos.append(hasil)\n    t += 12\n\nimport statistics\nprint(f\"OOS per window: {[f'{x:.0%}' for x in oos]}\")\nprint(f\"Rata-rata OOS: {statistics.mean(oos):.1%}\")\nprint()\nprint(\"OOS murni = simulasi penggunaan nyata.\")\nprint(\"Decay (menurun antar window) = edge sekarat.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Sebelum percaya backtest → <strong>Audit 3 dosa</strong></h3>
<p><strong>Kenapa:</strong> Lookahead/survivor/biaya.</p>
<p><strong>Contoh nyata:</strong> Checklist wajib.</p>
</div>
<div className="decision-card">
<h3>2. Banyak trial dicoba → <strong>Deflated Sharpe</strong></h3>
<p><strong>Kenapa:</strong> Koreksi p-hacking.</p>
<p><strong>Contoh nyata:</strong> 1000 trial → skeptis.</p>
</div>
<div className="decision-card">
<h3>3. Validasi final → <strong>Walk-forward</strong></h3>
<p><strong>Kenapa:</strong> OOS murni + decay.</p>
<p><strong>Contoh nyata:</strong> 5 window.</p>
</div>
<div className="decision-card">
<h3>4. OOS jauh &lt; IS → <strong>Tolak / sederhanakan</strong></h3>
<p><strong>Kenapa:</strong> Overfitting.</p>
<p><strong>Contoh nyata:</strong> Kurangi parameter.</p>
</div>
<div className="decision-card">
<h3>5. Backtesting → <strong>PIT + biaya + OOS; skeptis selalu</strong></h3>
<p><strong>Kenapa:</strong> Lookahead & overfit = ilusi.</p>
<p><strong>Contoh nyata:</strong> Sharpe 3,0 → live −20%.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Audit</strong> 3 dosa dulu.</li><li><strong>OOS wajib</strong>.</li><li><strong>Catat semua</strong> trial.</li><li><strong>Biaya 2x</strong> asumsi.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Strategi Sempurna yang Hancur</h2>
<div className="callout">
<p>Backtest Sharpe 3,0 → live −20% (6 bulan). Sebab: laporan final dipakai 4 bulan lebih awal (lookahead).</p>
<p><strong>Vignette lanjutan.</strong> Strategi: <em>backtest Sharpe</em> <strong>3,0</strong>! <em>Investor</em> <strong><em>terpesona</em></strong>. <em>Live</em> 6 bulan: <strong>&minus;20%</strong>! <em>Sebab</em>: <strong><em>laporan final</em></strong> dipakai <strong>4 bulan</strong> lebih awal (<em>lookahead</em>!). <em>Tanpa</em> &ldquo;teropong&rdquo; = <strong><em>hancur</em></strong>.</p>
<p><strong>Pertanyaan:</strong> (a) Mekanisme kegagalan? (b) Bagaimana audit menangkap? (c) Sistem pencegahan? (d) Jika <em>vintage</em> Sharpe 0,4 &mdash; <em>lanjut</em>? (e) <em>Berapa</em> <em>haircut</em> wajar?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Lookahead</strong>: sinyal dari masa depan → Sharpe palsu. Live tanpa &lsquo;teropong&rsquo; = hancur.</p>
<p>(d) <strong><em>Tidak</em></strong>! &mdash; 0,4 = <strong><em>lemah</em></strong>! <strong><em>Mati</em> di lab.</strong></p>
<p>(e) <strong><em>50%</em></strong>! &mdash; <em>Sharpe</em> 3,0 &rarr; <strong><em>ekspektasi</em> 1,5</strong>! <strong><em>Skeptis</em></strong>!</p>
<p>(b) <strong>'Apakah info tersedia saat itu?'</strong> + vintage data → Sharpe 3,0 → 0,4. <strong>Mati di lab.</strong></p>
<p>(c) <strong>Checklist audit</strong> (PIT/delisted/biaya/OOS) + <strong>jurnal trial</strong> + <strong>walk-forward</strong> + <strong>deflated Sharpe</strong>. Kejujuran = sistem, bukan niat.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Backtest Lanjut</h2>
      <h3>1. Deflated Sharpe (Lopez de Prado)</h3>
      <p><strong><em>Koreksi</em></strong> <em>multiple trials</em>! <strong><em>Formula</em></strong>! <strong><em>Wajib</em></strong>!</p>
      <h3>2. Combinatorial purged CV</h3>
      <p><strong><em>CV</em></strong> untuk <em>time series</em>! <strong><em>Purge</em></strong> &amp; <strong><em>embargo</em></strong>!</p>
      <h3>3. Monte Carlo</h3>
      <p><strong><em>Simulasi</em></strong>! <strong><em>Distribusi</em></strong>!</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Lookahead kilat</h3>
      <p><em>Laporan</em> Mei dipakai Januari. <em>Masalah</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong><em>Lookahead</em> 4 bulan</strong>!</p>
      </details>
      <h3>Drill 2 &mdash; Overfit kilat</h3>
      <p>IS 4,0, OOS 0,5. <em>Diagnosis</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong><em>Overfit</em></strong>!</p>
      </details>
      <h3>Drill 3 &mdash; Biaya kilat</h3>
      <p>20% gross, turnover 500%, biaya 0,3%. <em>Net</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>18,5%</strong>.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Sharpe 3,0 = hebat.&rdquo; <em>Benar</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Audit</em> dulu!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Strategi pakai laporan final untuk 'trading' 4 bulan sebelumnya. Ini?"}
  options={
    ["OK",
    "Lookahead bias — melihat masa depan",
    "Alpha",
    "Efisien"]
  }
  correct={1}
  explanation={"Benar: info belum tersedia saat itu. Pakai vintage (as-reported) data!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. 1000 trial, terbaik Sharpe 2,0. Sikap?"}
  options={
    ["Live!",
    "Skeptis: deflated Sharpe (ekspektasi 1,5 dari noise)",
    "Tambah leverage",
    "Publikasikan"]
  }
  correct={1}
  explanation={"Benar: 'terbaik dari 1000' = juara menghafal. DSR mengoreksi jumlah trial."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. IS Sharpe 3,0, OOS 0,3. Diagnosis?"}
  options={
    ["Hebat",
    "Overfitting — tolak/sederhanakan",
    "Naikkan ukuran",
    "Tunggu"]
  }
  correct={1}
  explanation={"Benar: jurang IS→OOS = menghafal noise. Strategi sehat: OOS mendekati IS."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Walk-forward OOS: 1,5 → 1,2 → 0,8 → 0,4 → 0,1. Artinya?"}
  options={
    ["Membaik",
    "Decay — edge sekarat, jangan live",
    "Stabil",
    "Acak"]
  }
  correct={1}
  explanation={"Benar: edge terkikis (crowding/regime). Detektor kematian dini bekerja."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Asumsi biaya backtest yang aman?"}
  options={
    ["Nol",
    "2x perkiraan (margin of safety)",
    "Setengah",
    "Komisi saja"]
  }
  correct={1}
  explanation={"Benar: jika mati dengan biaya 2x = terlalu rapuh. Include impact + slippage!"}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Backtest Sharpe 3,0 → live −20%. Sebab: laporan final dipakai 4 bulan lebih awal. Pelajaran?"}
  options={
    ["Strategi jelek — buang",
    "Lookahead! Audit PIT + vintage; mati di lab",
    "Perlu lebih banyak data",
    "Live trading salah"]}
  correct={1}
  explanation={"Benar: lookahead 4 bulan. Audit: 'apakah info tersedia saat itu?' + vintage data → Sharpe 0,4. Mati di lab."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>3 dosa</strong>: lookahead, survivorship, biaya — audit wajib.</li>
<li><strong>Overfitting</strong>: IS vs OOS; jurang = menghafal.</li>
<li><strong>Walk-forward</strong>: OOS murni + deteksi decay.</li>
<li><strong>Deflated Sharpe</strong>: koreksi jumlah trial.</li>
<li><strong>Aturan</strong>: jurnal semua trial; biaya 2x; OOS wajib.</li>
<li><strong>Prinsip</strong>: backtest jujur = pertanyaan jujur.</li>

<li><strong>Dosa:</strong> lookahead; survivorship; biaya.</li>
<li><strong>Overfit:</strong> IS&gt;&gt;OOS; sederhanakan.</li>
<li><strong>WF:</strong> train-test geser; paper.</li>
<li><strong>Kapan TIDAK pakai:</strong> tanpa PIT; tanpa biaya; tanpa OOS.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-d3-regresi-faktor" className="btn btn-secondary btn-sm">← PM-D3</Link>
        <Link href="/learn/pm-d5-metrik-kinerja" className="btn btn-primary btn-sm">PM-D5 →</Link>
      </div>
    </div>
  );
}

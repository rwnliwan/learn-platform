"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmD2OptimisasiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-D2 — Portfolio Management</span>
        <h1 className="display-title">Optimisasi Portofolio:<br/>Black-Litterman & Robust</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Optimisasi yang 'Sempurna' dan Bangkrut</a></li>
<li><a href="#mv">Mean-Variance Hands-On</a></li>
<li><a href="#bl">Black-Litterman</a></li>
<li><a href="#robust">Teknik Robust</a></li>
<li><a href="#sintesis">Sintesis: Kerendahan Hati</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: 147% Satu Saham</a></li>
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
<li>Menjalankan optimisasi mean-variance dengan grid search.</li>
<li>Menjelaskan intuisi Black-Litterman.</li>
<li>Menggabungkan market equilibrium dengan views.</li>
<li>Membedakan teknik robust: resampling, risk parity.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Optimisasi yang 'Sempurna' dan Bangkrut</h2>
      <div className="story">
        <p><strong>1990-an</strong>: quant fund menjalankan mean-variance <em>murni</em>. Output: <strong>147% leverage di satu saham</strong> (E(R) tertinggi 0,3%!). <strong>1998</strong>: estimasi meleset sedikit → portofolio <strong>hancur</strong>. <strong>Error maximization</strong> (Michaud) memakan korban nyata.</p>
<p>Twist-nya: <strong>matematikanya benar, inputnya sampah</strong> — dan optimisasi <em>memperkuat</em> sampah (bobot ekstrem di estimasi paling salah!). Solusinya bukan 'jangan optimisasi' — melainkan <strong>optimisasi yang rendah hati</strong>: Black-Litterman + constraints + resampling. Lesson ini: kekuatan dengan rem.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="mv">Mean-Variance — Mesin dengan Rem</h2>
<p><strong>Definisi.</strong> <strong>Mean-variance</strong>: pilih bobot max <em>Sharpe</em> (PM-C3). <strong>Grid search</strong>: coba ribuan kombinasi → frontier. <strong>Rem wajib</strong>: long-only, max 40%/aset, turnover limit.</p>
<p><strong>Ingat PM-C4</strong>: tanpa constraints = <strong>error maximizer</strong>!</p>
<Tex math={String.raw`\max_w \frac{w^T\mu - r_f}{\sqrt{w^T\Sigma w}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Max Sharpe (bukan max return!) — return per unit risiko</li>
<li>Constraints: <Tex math={String.raw`w_i \geq 0`} />, <Tex math={String.raw`w_i \leq 0{,}4`} /></li>
<li>Grid search: coba kombinasi kelipatan 10%</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Mean-variance seperti <strong>mesin balap</strong>: powerful, tapi tanpa rem (constraints) = <strong>tabrak tembok</strong> (147% satu saham!). Pembalap hebat = <strong>cepat + tahu kapan ngerem</strong>. Quant 1998 = gaspol tanpa rem.</p>
<p><strong>Kapan dipakai:</strong> Alokasi taktis; selalu dengan constraints + sensitivitas.</p>
<p><strong>Pendalaman intuisi &mdash; error maximization = &ldquo;mesin pembesar noise&rdquo;.</strong> Estimasi return A = 8,3% vs B = 8,0% (<em>beda</em> 0,3% = <em>noise</em>!). Optimizer: <strong>147% ke A</strong>! (<em>leverage</em>!). <strong>Kenapa?</strong> Optimizer <em>percaya</em> 0,3% = <em>sinyal</em>! <strong>Hasil:</strong> <em>estimasi meleset</em> &rarr; <strong><em>hancur</em></strong>! <strong>Pelajaran:</strong> <strong><em>jangan</em> percaya <em>beda kecil</em></strong>! <strong><em>Shrink</em>! <em>Constrain</em>! <em>BL</em>!</strong></p><details className="worked">
<summary>📐 Contoh: 3 aset (klik untuk buka)</summary>
<p>Saham E(R) 10% σ18%; obligasi 7% σ6%; emas 5% σ15%; ρ saham-obligasi 0,2.</p>
<p><strong>Grid search</strong> (kelipatan 10%, max 40%/aset): max Sharpe = <strong>30/40/30</strong> (Sharpe 0,62).</p>
<p><strong>Tanpa max 40%</strong>: 60/40/0 (Sharpe 0,65) — <em>sedikit</em> lebih baik, <em>jauh</em> lebih rapuh. <strong>Robust &gt; optimal.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): MV murni &mdash; bencana</summary>
<p><strong>Soal:</strong> A: E(R)=8,3%, B: 8,0%, <em>cov</em> sama. Optimizer MV <em>tanpa constraint</em>. Hasil?</p>
<p><strong>Hasil:</strong> <strong>147% A, &minus;47% B</strong>! (<em>leverage</em>! <em>short</em>!).</p>
<p><strong>Kenapa:</strong> 0,3% = <em>dipercaya</em>! <strong><em>Jika</em> meleset</strong> (A sebenarnya 7%!) &rarr; <strong><em>hancur</em></strong>! <strong><em>Error maximization</em>!</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Dengan constraint</summary>
<p><strong>Soal:</strong> <em>Sama</em>, tapi <em>long-only</em> + maks 60%. Hasil?</p>
<p><strong>Hasil:</strong> <strong>60% A, 40% B</strong> (<em>masuk akal</em>!).</p>
<p><strong>Pelajaran:</strong> <strong><em>constraint</em> = <em>kebijaksanaan</em></strong>! <strong><em>Selalu</em> pakai!</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Sensitivitas</summary>
<p><strong>Soal:</strong> <em>Ubah</em> E(R) A &plusmn;1%. <em>Berapa</em> perubahan bobot?</p>
<p><strong><em>Tanpa</em> constraint:</strong> <strong><em>liar</em></strong> (100% &rarr; 0%!). <strong><em>Dengan</em>:</strong> <em>stabil</em>!</p>
<p><strong><em>Uji</em> sensitivitas</strong> = <em>wajib</em>! <strong><em>Rapuh</em> = <em>tolak</em>.</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Optimal = terbaik&rdquo;.</strong> <strong>SALAH.</strong> <strong><em>Robust</em> &gt; <em>optimal</em></strong>! <em>Optimal</em> = <em>rapuh</em>!</p>
</div>
<PlotlyChart
  data={[{x: [6,7,8,9.5,11,13,15,18], y: [0.35,0.45,0.52,0.58,0.62,0.6,0.55,0.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "frontier"}, {x: [9.5], y: [0.62], type: "scatter", mode: "markers", marker: {color: "#ef4444", size: 12}, name: "max Sharpe"}]}
  title={"Frontier 3 aset: Sharpe vs volatilitas (ilustrasi)"}
  layout={{xaxis: {title: "Volatilitas (%)"}, yaxis: {title: "Sharpe ratio"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Kurva = Sharpe tiap titik frontier; titik merah = maksimum.</p>
<p><strong>Interpretasi:</strong> Sharpe <strong>naik lalu turun</strong>: titik optimal ≠ risiko maksimal. Max Sharpe (merah) = <strong>return per risiko terbaik</strong>. Titik di kanan = <em>return lebih tinggi, efisiensi lebih rendah</em> — pilih sesuai <strong>risk appetite IPS</strong>, bukan serakah.</p>
</div>

<PlotlyChart
  data={[{x: ["MV murni", "Dengan constraint", "Black-Litterman", "1/N"], y: [147, 60, 55, 50], type: "bar", marker: {color: ["#d62728", "#e8a838", "#2a7de1", "#2ca02c"]}, name: "Bobot A (%)"}]}
  title={"Bobot A: dari gila (147%) ke masuk akal"}
  layout={{xaxis: {title: "Metode"}, yaxis: {title: "Bobot A (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = bobot aset A per metode.</p>
<p><strong>Interpretasi:</strong> <strong><em>MV murni</em> = <em>gila</em></strong> (147%!). <strong><em>Constraint</em>/BL/1/N</strong> = <em>masuk akal</em>! <strong><em>Kerendahan hati</em> = <em>kewarasan</em>.</strong></p>
</div>
<h2 id="bl">Black-Litterman — Equilibrium + Views</h2>
<p><strong>Definisi.</strong> <strong>BL</strong>: mulai dari <strong>equilibrium</strong> (market-cap weights → implied return) + campur <strong>views</strong> analis (dengan <em>confidence</em>!) → <strong>posterior return</strong> → optimisasi.</p>
<p><strong>Keunggulan</strong>: intuitif (mulai dari 'pasar benar'), views <em>terukur</em> (bukan 0/100), bobot <strong>masuk akal</strong>.</p>
<Tex math={String.raw`\Pi = \delta \Sigma w_{mkt} \quad;\quad \mu_{BL} = [(\tau\Sigma)^{-1} + P^T\Omega^{-1}P]^{-1}[(\tau\Sigma)^{-1}\Pi + P^T\Omega^{-1}Q]`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\Pi`} />: implied equilibrium return (dari bobot pasar!)</li>
<li><Tex math={String.raw`Q`} />: views analis (mis. 'saham &gt; obligasi 2%')</li>
<li><Tex math={String.raw`\Omega`} />: confidence views (ragu → kecil pengaruhnya)</li>
<li>Hasil: antara pasar dan views, proporsional keyakinan</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> BL seperti <strong>musyawarah</strong>: pasar = <strong>pendapat mayoritas</strong> (equilibrium); analis = <strong>saksi ahli</strong> (views). Keputusan = <strong>mayoritas + ahli</strong>, dibobot <em>kredibilitas</em> (confidence). Bukan 'ahli selalu benar' (mean-variance murni) atau 'ahli diabaikan'.</p>
<p><strong>Kapan dipakai:</strong> Ada views house-analis yang ingin digabung sistematis.</p>
<p><strong>Pendalaman intuisi &mdash; Black-Litterman = &ldquo;kerendahan hati Bayesian&rdquo;.</strong> <strong><em>Prior</em></strong> = <em>equilibrium pasar</em> (<em>masuk akal</em>!). <strong><em>Views</em></strong> = <em>pandanganmu</em> (<em>di-shrink</em> by <em>confidence</em>!). <strong>Hasil:</strong> <em>stabil</em>! <em>intuitif</em>! <strong><em>Tidak ada</em></strong> 147% dari <em>view lemah</em>! <strong>BL = <em>cara</em> optimisasi <em>tanpa</em> bunuh diri.</strong></p><details className="worked">
<summary>📐 Contoh: View saham (klik untuk buka)</summary>
<p>Equilibrium: saham 8%, obligasi 5%. View: <em>'saham outperform 3%'</em>, confidence <strong>sedang</strong>.</p>
<p><strong>BL posterior</strong>: saham ≈ <strong>9%</strong>, obligasi ≈ 5% (bukan 8+3=11%! — di-<em>shrink</em> ke equilibrium).</p>
<p><strong>Optimisasi</strong> → overweight saham <em>moderat</em> (+10%), bukan ekstrem. <strong>Views tanpa BL</strong> = 100% saham (bencana jika salah!).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): BL &mdash; angka</summary>
<p><strong>Soal:</strong> <em>equilibrium</em>: A 6%, B 6%. <em>View</em>: A 8% (<em>confidence</em> 50%). Hasil BL?</p>
<p><strong>BL:</strong> 6% + 0,5&times;(8%&minus;6%) = <strong>7%</strong> (bukan 8%!).</p>
<p><strong>Bobot:</strong> <em>moderat</em> (<em>tidak</em> 147%!). <strong><em>Shrink</em> by <em>confidence</em>!</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Reverse optimization</summary>
<p><strong>Soal:</strong> pasar 60/40. <em>Implikasikan</em> E(R)!</p>
<p><strong><em>Reverse</em>:</strong> E(R) = &lambda;&Sigma;w &rarr; <strong><em>tersirat</em> pasar</strong>!</p>
<p><strong>Gunanya:</strong> <strong><em>prior</em> BL</strong>! <strong><em>Cek</em> kewajaran</strong>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Optimisasi tanpa <em>constraint</em>.</strong> <strong><em>Bahaya</em>!</strong> <strong><em>Selalu</em> <em>constrain</em>!</strong></p>
</div>
<h2 id="robust">Robust — Rendah Hati</h2>
<p><strong>Definisi.</strong> <strong>Resampling</strong> (Michaud): optimisasi di <em>banyak</em> simulasi input → rata-ratakan bobot (haluskan ekstrem!). <strong>Risk parity</strong> (PM-C4): bobot ∝ 1/σ. <strong>Max diversification</strong>: max rasio diversifikasi.</p>
<p><strong>Prinsip</strong>: <strong>diversifikasi antar-model</strong> — tidak ada satu optimisasi yang dipercaya 100%.</p>
<p><strong>Kepribadian/intuisi:</strong> Robust seperti <strong>tanya 100 dokter</strong> (resampling) vs 1 dokter (mean-variance tunggal). Satu dokter bisa salah fatal; <strong>konsensus 100</strong> = aman. Mahal? Ya. Lebih murah dari <strong>bangkrut</strong>.</p>
<p><strong>Kapan dipakai:</strong> Input sangat tidak pasti (EM, aset baru); governance konservatif.</p>
<p><strong>Pendalaman intuisi &mdash; robust = &ldquo;siap untuk terburuk&rdquo;.</strong> <strong><em>Resampling</em></strong> (Michaud!): <em>rata-rata</em> banyak <em>dunia</em>! <strong><em>Min-max</em></strong>: <em>optimalkan</em> untuk <em>terburuk</em>! <strong><em>Constraint</em></strong>: <em>batasi</em> kegilaan! <strong>Prinsip:</strong> <strong><em>robust</em> &gt; <em>optimal</em></strong>. <strong><em>Optimal</em> di <em>kertas</em> = <em>rapuh</em> di <em>nyata</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Resampling (klik untuk buka)</summary>
<p>Input: E(R) saham 10% ±3%. <strong>MV tunggal</strong>: 60% saham.</p>
<p><strong>Resampling</strong> (1000 simulasi E(R) 7–13%): bobot rata-rata <strong>45%</strong> (kadang 20%, kadang 70%!).</p>
<p><strong>Hasil</strong>: 45% — <strong>mengakui ketidakpastian</strong>. Jika E(R) sebenarnya 7%: MV tunggal rugi besar; resampled <strong>selamat</strong>. Kerendahan hati = <strong>asuransi model</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Resampling (Michaud)</summary>
<p><strong>Soal:</strong> <em>resample</em> 100&times;, optimisasi tiap <em>sampel</em>, <em>rata-rata</em> bobot. Hasil vs MV tunggal?</p>
<p><strong>Hasil:</strong> <strong><em>lebih stabil</em></strong>! <strong><em>lebih diversifikasi</em></strong>!</p>
<p><strong>Intuisi:</strong> <strong><em>akui</em> ketidakpastian</strong>! <strong><em>Rata-rata</em> banyak <em>dunia</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: 1/N vs optimisasi (DeMiguel)</summary>
<p><strong>Soal:</strong> 14 model vs 1/N. <em>Pemenang</em>?</p>
<p><strong><em>1/N</em>!</strong> &mdash; <em>tidak ada</em> yang konsisten <em>kalahkan</em>!</p>
<p><strong>Pelajaran:</strong> <strong><em>sederhana</em> &gt; <em>canggih</em></strong> (jika <em>input</em> buruk!).</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Kerendahan Hati</h2>
      <p>MV, BL, robust = <strong>satu pelajaran</strong>:</p>
      <ol>
        <li><strong>MV = <em>alat</em></strong> &mdash; <strong><em>berbahaya</em> tanpa <em>rem</em></strong>!</li>
        <li><strong>BL = <em>rem</em></strong> &mdash; <strong><em>prior</em> + <em>views</em></strong>!</li>
        <li><strong>ROBUST = <em>filsafat</em></strong> &mdash; <strong><em>siap</em> untuk <em>salah</em></strong>!</li>
      </ol>
      <p><strong><em>Optimisasi</em> = <em>melayani</em>, bukan <em>memerintah</em>.</strong></p>

      <h3>🎙️ Debat: &ldquo;Optimisasi = sia-sia&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;1/N <em>menang</em>! <em>Buang</em> optimisasi!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;<strong><em>Dengan</em> kerendahan hati</strong> = <em>berguna</em>! <em>Alat</em>, bukan <em>orakel</em>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>gunakan</em> dengan <em>rem</em>.</strong></p>
      <h3>🧪 Eksperimen: Uji portofoliomu</h3>
      <p><strong><em>Ubah</em></strong> input &plusmn;1%. <strong><em>Berubah</em> drastis?</strong> &rarr; <strong><em>rapuh</em></strong>!</p>
      <h3>📰 Studi Kasus: Yale &amp; Optimisasi</h3>
      <p><strong>Swensen:</strong> <em>tidak</em> MV murni! <strong><em>Judgment</em> + <em>disiplin</em></strong>!</p>
      <h3>📊 Data Corner: Turnover Optimisasi</h3>
      <p><strong><em>Tanpa</em> constraint:</strong> <em>turnover</em> 300%+! <strong><em>Dengan</em>:</strong> 50%!</p>
      <h3>📖 Kamus Istilah</h3>
      <p><strong><em>Error max</em></strong>! <em>Shrinkage</em>! <em>BL</em>! <em>Resampling</em>! <strong>Hafalkan!</strong></p>
      <h3>💡 Prinsip Abadi Optimisasi</h3>
      <p><strong>(1) <em>Shrink</em>.</strong> (2) <strong><em>Constrain</em>.</strong> (3) <strong><em>BL</em>.</strong> (4) <strong><em>Uji</em>.</strong> (5) <strong><em>Robust</em>.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> <em>Error maximization</em>? <strong>Q2:</strong> BL? <strong>Q3:</strong> <em>Kapan</em> 1/N?</p>
      <p><strong>Lulus</strong> = 3/3.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-C4:</strong> <em>konstruksi</em>! <strong>Ke PM-C3:</strong> <em>SAA</em>!</p>
      <h3>🔬 Deep Dive Tambahan: Matematika BL</h3>
      <p><strong><em>Formula</em>:</strong> &mu;_BL = [(&tau;&Sigma;)^-1 + P'&Omega;^-1P]^-1 [(&tau;&Sigma;)^-1&Pi; + P'&Omega;^-1Q]</p>
      <p><strong><em>Intuisi</em>:</strong> <strong><em>rata-rata tertimbang</em></strong> <em>prior</em> &amp; <em>views</em>! <strong><em>Bobot</em></strong> = <em>presisi</em>!</p>
      <p><strong><em>Praktis</em>:</strong> <strong><em>software</em></strong> hitung! <strong><em>Pahami</em></strong> intuisi!</p>
      <h3>📊 Data Corner: Seberapa Sering MV Gagal?</h3>
      <p><strong>Studi:</strong> MV murni <em>out-of-sample</em> = <strong><em>lebih buruk</em></strong> dari 1/N <em>80%</em> waktu!</p>
      <p><strong><em>Solusi</em></strong> = <em>rem</em>!</p>
      <h3>🧪 Eksperimen: Stress Optimizer-mu</h3>
      <p><strong><em>Ubah</em></strong> E(R) &plusmn;2%. <strong><em>Lihat</em></strong> bobot. <strong><em>Liar</em>?</strong> &rarr; <strong><em>tambah</em> rem</strong>!</p>
      <h3>📰 Studi Kasus: Harvard &amp; MV</h3>
      <p><strong><em>Tidak</em></strong> pakai MV murni! <strong><em>Judgment</em></strong>!</p>
      <h3>💡 Prinsip Abadi Optimisasi (Lengkap)</h3>
      <p><strong>(1) <em>Shrink</em>.</strong> (2) <strong><em>Constrain</em>.</strong> (3) <strong><em>BL</em>.</strong> (4) <strong><em>Uji</em>.</strong> (5) <strong><em>Robust</em>.</strong> (6) <strong><em>Sederhana</em>.</strong></p>
      <h3>🎓 Ujian Akhir (Lengkap)</h3>
      <p><strong>Q1:</strong> <em>Error max</em>? <strong>Q2:</strong> BL? <strong>Q3:</strong> 1/N? <strong>Q4:</strong> <em>Constraint</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>📋 Template Checklist Optimisasi (Siap Pakai)</h3>
      <p><strong>SEBELUM OPTIMISASI:</strong></p>
      <p>&square; <strong><em>Shrink</em>?</strong> (input!)</p>
      <p>&square; <strong><em>Constraint</em>?</strong> (long-only! maks!)</p>
      <p>&square; <strong><em>BL</em>?</strong> (prior! views!)</p>
      <p>&square; <strong><em>Sensitivitas</em>?</strong> (&plusmn;1%!)</p>
      <p>&square; <strong><em>Round</em>?</strong> (5%!)</p>
      <p>&square; <strong><em>Turnover</em>?</strong> (biaya!)</p>
      <p><strong>6 &square; = <em>aman</em>. <em>Salin</em>. <em>Pakai</em>.</strong></p>
      <h3>🎯 Studi Kasus Mini (Latihan)</h3>
      <p><strong>KASUS 1:</strong> 147% satu saham. <em>Tindakan</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Tolak</em>! <em>Constrain</em>!</strong></p>
      <p><strong>KASUS 2:</strong> <em>View</em> lemah. <em>Bobot</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Shrink</em>! BL!</strong></p>
      <p><strong>KASUS 3:</strong> <em>Tidak yakin</em> input. <em>Metode</em>?</p>
      <p><strong>Jawab:</strong> <strong>1/N!</strong></p>
      <p><strong><em>Latihan</em> = <em>kebijaksanaan</em>.</strong></p>
      <h3>💬 Satu Nasihat</h3>
      <p><strong>&ldquo;<em>Robust</em> &gt; <em>optimal</em>.&rdquo;</strong></p>
      <h3>🔗 Rantai Optimisasi (Ringkas)</h3>
      <p><strong>INPUT</strong> (shrink!) &rarr; <strong>PRIOR</strong> (equilibrium!) &rarr; <strong>VIEWS</strong> (confidence!) &rarr; <strong>OPTIMIZE</strong> (constrain!) &rarr; <strong>VALIDATE</strong> (sensitivitas!).</p>
      <p><strong><em>Rantai</em> kuat</strong> = <em>portofolio</em> kuat.</p>
      <h3>🏆 Optimizer Terbaik: Ciri-ciri</h3>
      <p><strong>(1) <em>Rendah hati</em></strong>! (2) <strong><em>Disiplin</em></strong>! (3) <strong><em>Robust</em></strong>! (4) <strong><em>Sederhana</em></strong>!</p>
      <p><strong><em>Kembangkan</em></strong>!</p>
      <h3>🎙️ Debat: &ldquo;BL = terlalu subjektif&rdquo;</h3>
      <p><strong>Kritik:</strong> &ldquo;<em>Views</em> = <em>opini</em>!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;<strong><em>Semua</em> = <em>opini</em></strong>! BL = <em>jujur</em> tentangnya!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>transparan</em></strong>.</p>
      <h3>📚 Bacaan Lanjutan</h3>
      <p><strong>Black-Litterman (1992)</strong>! <strong>DeMiguel (2009)</strong>! <strong>Michaud (1998)</strong>!</p>
      <h3>❓ FAQ Optimisasi</h3>
      <p><strong>Q: <em>MV</em> vs <em>BL</em>?</strong> A: <strong>BL</strong> (<em>stabil</em>!).</p>
      <p><strong>Q: <em>Berapa</em> constraint?</strong> A: <strong><em>Long-only</em> + <em>maks</em> 10&ndash;20%</strong>!</p>
      <p><strong>Q: 1/N <em>kapan</em>?</strong> A: <strong><em>Tidak yakin</em>!</strong></p>
      <h3>🔮 Masa Depan Optimisasi</h3>
      <p><strong><em>ML</em></strong>! <em>Robust</em>! <strong><em>Siap</em> = <em>belajar</em>.</strong></p>
      <h3>📝 Jurnal Optimisasi (Template)</h3>
      <p><strong>Metode:</strong> ___ <strong><em>Shrink</em>?</strong> ___ <strong><em>Constraint</em>?</strong> ___</p>
      <p><strong><em>Sensitivitas</em>:</strong> ___</p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> <em>Error max</em>? <strong>A:</strong> <strong>147%</strong>!</p>
      <p><strong>Q2:</strong> BL = ? <strong>A:</strong> <strong><em>Prior</em> + <em>views</em></strong>!</p>
      <p><strong>Q3:</strong> 1/N <em>kapan</em>? <strong>A:</strong> <strong><em>Tidak yakin</em></strong>!</p>
      <p><strong>Q4:</strong> <em>Constraint</em> = ? <strong>A:</strong> <strong><em>Kebijaksanaan</em></strong>!</p>
      <p><strong>Q5:</strong> <em>Robust</em> vs <em>optimal</em>? <strong>A:</strong> <strong><em>Robust</em></strong>!</p>
      <h3>💪 Latihan Praktik</h3>
      <p><strong><em>Uji</em></strong> optimizer-mu dengan <em>checklist</em> 6 &square;! <strong><em>Laporkan</em></strong>!</p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>L1:</strong> <em>Tahu</em>. <strong>L2:</strong> <em>BL</em>. <strong>L3:</strong> <em>Ajarkan</em>. <strong>L4:</strong> <em>Inovasi</em>.</p>
      <h3>🌍 Optimisasi Indonesia: Realitas</h3>
      <p>Pasar Indonesia: <strong><em>terkonsentrasi</em></strong> (BBCA, BBRI dominan!). <strong><em>Illiquid</em></strong> (banyak saham <em>tidak</em> bisa dibeli besar!). <strong><em>Data</em></strong> pendek!</p>
      <p><strong>Implikasi:</strong> <strong><em>constraint</em> likuiditas</strong>! <strong><em>Batasi</em> bobot</strong> (maks 10%!). <strong><em>Shrink</em> agresif</strong>!</p>
      <p><strong>Contoh:</strong> optimizer mau 30% saham <em>lapis tiga</em> &mdash; <strong><em>tidak</em> bisa</strong> dibeli! <strong><em>Constraint</em> = <em>realitas</em>.</strong></p>
      <p><strong>Aturan Indonesia:</strong> <strong><em>likuiditas</em> dulu</strong>, <em>optimisasi</em> kemudian. <strong><em>Sederhana</em> &gt; <em>canggih</em>.</strong></p>
      <h3>⚖️ Regulasi: Batas Investasi</h3>
      <p><strong>Reksadana:</strong> <em>maks</em> 10% per emiten! <strong><em>Ikuti</em></strong>! <strong><em>Constraint</em> = <em>hukum</em>.</strong></p>
      <h3>📖 Kisah Nyata: LTCM &amp; Optimisasi</h3>
      <p>Tahun 1998, <strong>Long-Term Capital Management</strong> &mdash; <em>fund</em> dengan <em>2 peraih Nobel</em>! &mdash; <strong><em>bangkrut</em></strong>! <em>Model</em> mereka = <em>optimisasi</em> canggih! <strong><em>Leverage</em> 25&times;!</strong></p>
      <p><strong>Apa yang salah?</strong> <strong><em>Input</em> = <em>masa lalu</em> tenang</strong>! <em>Model</em> <em>tidak</em> siap untuk <em>krisis</em> Rusia! <strong><em>Optimisasi</em> = <em>rapuh</em></strong>! <strong><em>Fed</em> harus <em>talangi</em></strong>!</p>
      <p><strong>Pelajaran:</strong> <strong><em>kepintaran</em> &ne; <em>kebijaksanaan</em></strong>. <strong><em>Nobel</em> &ne; <em>kebal</em>.</strong> <strong><em>Robust</em> &gt; <em>optimal</em>.</strong> <strong><em>Selalu</em>.</strong></p>
      <h3>🤖 AI &amp; Optimisasi</h3>
      <p><strong><em>ML</em></strong> untuk <em>estimasi</em>! <strong><em>Tapi</em>:</strong> <strong><em>overfit</em></strong>! <strong><em>Validasi</em></strong>! <strong><em>Sederhana</em> dulu.</strong></p>
      <h3>🌟 Penutup: Kebijaksanaan</h3>
      <p><strong><em>Optimisasi</em></strong> = <em>alat</em>. <strong><em>Kebijaksanaan</em></strong> = <em>pengguna</em>. <strong><em>Jadilah</em> bijak.</strong></p>
      <h3>📊 Data Corner: Statistik Optimisasi</h3>
      <p><strong>80%</strong> waktu MV <em>kalah</em> dari 1/N! <strong>147%</strong> = <em>contoh</em> gila! <strong><em>Angka</em> = <em>peringatan</em>.</strong></p>
      <h3>🧪 Eksperimen Lanjutan</h3>
      <p><strong><em>Bandingkan</em></strong> MV vs BL vs 1/N! <strong><em>Out-of-sample</em>!</strong> <strong><em>Lihat</em></strong>!</p>
      <h3>💬 Wawancara: Quant Senior</h3>
      <p><strong>Q: <em>Nasihat</em>?</strong> A: &ldquo;<strong><em>Robust</em></strong>. <strong><em>Sederhana</em></strong>. <strong><em>Rendah hati</em></strong>.&rdquo;</p>
      <p><strong><em>Dengarkan</em></strong> praktisi.</p>
      <h3>🎓 Ujian Akhir (Final)</h3>
      <p><strong>Q1:</strong> <em>Error max</em>? <strong>Q2:</strong> BL? <strong>Q3:</strong> 1/N? <strong>Q4:</strong> <em>Constraint</em>? <strong>Q5:</strong> <em>Robust</em>?</p>
      <p><strong>Lulus</strong> = 5/5.</p>
      <h3>🔗 Menghubungkan (Lengkap)</h3>
      <p><strong>Ke PM-C4:</strong> <em>konstruksi</em>! <strong>Ke PM-C3:</strong> <em>SAA</em>! <strong>Ke PM-D3:</strong> <em>faktor</em>!</p>
      <p><strong><em>Optimisasi</em></strong> = <em>alat</em> <strong><em>semua</em></strong>.</p>
      <h3>📜 Sumpah Optimizer</h3>
      <p>&ldquo;Saya <em>berjanji</em>: <em>shrink</em>. <em>Constrain</em>. <em>BL</em>. <em>Robust</em>.&rdquo;</p>
      <p><strong><em>Ucapkan</em></strong>.</p>
      <h3>📖 Panduan Lengkap: Black-Litterman Step-by-Step</h3>
      <p><strong>Langkah 1: <em>Equilibrium</em>.</strong> <em>Ambil</em> bobot pasar (mis. 60/40!). <em>Reverse optimize</em>: &Pi; = &lambda;&Sigma;w. <strong><em>Hasil</em>:</strong> <em>implied returns</em> (<em>masuk akal</em>!).</p>
      <p><strong>Langkah 2: <em>Views</em>.</strong> <em>Nyatakan</em> pandangan: &ldquo;A <em>outperform</em> B 2%&rdquo; (<em>confidence</em> 70%!). <em>Matriks</em> P, Q, &Omega;.</p>
      <p><strong>Langkah 3: <em>Gabung</em>.</strong> <em>Formula</em> BL &rarr; &mu;_BL. <strong><em>Hasil</em>:</strong> <em>di antara</em> prior &amp; views!</p>
      <p><strong>Langkah 4: <em>Optimisasi</em>.</strong> <em>Pakai</em> &mu;_BL untuk MV. <strong><em>Hasil</em>:</strong> <em>stabil</em>! <em>intuitif</em>!</p>
      <p><strong>Contoh angka:</strong> <em>equilibrium</em> 6%/6%. <em>View</em>: A 8% (50%). <strong>BL: 7%</strong>. <em>Bobot</em>: 55/45 (<em>masuk akal</em>!). <strong><em>Tidak</em> 147%!</strong></p>
      <p><strong><em>Praktis</em>:</strong> <strong><em>software</em></strong> (Python <em>PyPortfolioOpt</em>!). <strong><em>Pahami</em></strong> intuisi. <strong><em>Validasi</em></strong>.</p>
      <h3>📖 Panduan Lengkap: Shrinkage (Ledoit-Wolf)</h3>
      <p><strong><em>Masalah</em>:</strong> <em>covariance</em> sampel = <em>noisy</em>! <strong><em>Terutama</em></strong> jika <em>aset</em> banyak, <em>data</em> sedikit!</p>
      <p><strong><em>Solusi</em>:</strong> <strong><em>shrink</em></strong> ke <em>target</em> terstruktur! &Sigma;_shrink = &delta;F + (1&minus;&delta;)S. <strong><em>Target</em></strong> F = <em>single-index</em> atau <em>konstan</em>. <strong><em>Intensitas</em></strong> &delta; = <em>optimal</em> (analitis!).</p>
      <p><strong><em>Hasil</em>:</strong> <strong><em>lebih stabil</em></strong>! <strong><em>Out-of-sample</em> lebih baik</strong>! <strong><em>Terbukti</em></strong> (Ledoit &amp; Wolf 2004!).</p>
      <p><strong><em>Praktis</em>:</strong> <strong><em>selalu</em> shrink</strong> <em>covariance</em>! <strong><em>Default</em></strong> di <em>PyPortfolioOpt</em>! <strong><em>Jangan</em> pakai <em>sampel</em> mentah.</strong></p>
      <h3>📖 Panduan Lengkap: Resampling (Michaud)</h3>
      <p><strong><em>Masalah</em>:</strong> <em>input</em> = <em>estimasi</em>! <strong><em>Solusi</em>:</strong> <strong><em>akui</em></strong> ketidakpastian!</p>
      <p><strong><em>Cara</em>:</strong> (1) <strong><em>Asumsikan</em></strong> distribusi (mean, cov!). (2) <strong><em>Simulasikan</em></strong> banyak <em>sampel</em> (100&times;!). (3) <strong><em>Optimisasi</em></strong> tiap <em>sampel</em>. (4) <strong><em>Rata-rata</em></strong> bobot!</p>
      <p><strong><em>Hasil</em>:</strong> <strong><em>resampled frontier</em></strong>! <strong><em>Lebih stabil</em></strong>! <strong><em>Lebih diversifikasi</em></strong>!</p>
      <p><strong><em>Kritik</em>:</strong> <em>tidak</em> Bayesian <em>murni</em>. <strong><em>Tapi</em>:</strong> <strong><em>praktis</em></strong> &amp; <em>berhasil</em>!</p>
      <p><strong><em>Gunakan</em></strong> jika <em>ragu</em> input. <strong><em>Stabilitas</em></strong> = <em>nilai</em>.</p>
      <h3>📖 Panduan Lengkap: Constraints yang Bijak</h3>
      <p><strong><em>Long-only</em>:</strong> <em>tidak</em> short! <strong><em>Alasan</em>:</strong> <em>short</em> = <em>risiko</em> tak terbatas! <strong><em>Default</em></strong> untuk <em>kebanyakan</em>!</p>
      <p><strong><em>Max weight</em>:</strong> <em>batas</em> per aset (10%! 20%!). <strong><em>Alasan</em>:</strong> <em>cegah</em> konsentrasi! <strong><em>Diversifikasi</em></strong>!</p>
      <p><strong><em>Min weight</em>:</strong> <em>hindari</em> bobot <em>kecil</em> (0,1%!). <strong><em>Alasan</em>:</strong> <em>tidak</em> material! <em>Biaya</em>!</p>
      <p><strong><em>Turnover</em>:</strong> <em>batas</em> perubahan! <strong><em>Alasan</em>:</strong> <em>biaya</em> transaksi!</p>
      <p><strong><em>Sektor</em>:</strong> <em>batas</em> per sektor! <strong><em>Alasan</em>:</strong> <em>risiko</em> konsentrasi!</p>
      <p><strong><em>Constraint</em></strong> = <strong><em>kebijaksanaan</em></strong> yang <em>dikodekan</em>.</p>
      <h3>📖 Panduan Lengkap: Kapan 1/N Menang</h3>
      <p><strong>DeMiguel et al. (2009):</strong> <em>14 model</em> vs 1/N. <strong><em>Hasil</em>:</strong> <em>tidak ada</em> yang <em>konsisten</em> menang!</p>
      <p><strong><em>Kenapa</em>?</strong> <strong><em>Estimasi error</em></strong>! <em>Model</em> = <em>parameter</em> banyak! <em>Parameter</em> = <em>error</em>! <strong><em>1/N</em></strong> = <em>0 parameter</em>!</p>
      <p><strong><em>Kapan</em> 1/N <em>menang</em>?</strong> (1) <strong><em>Data</em> pendek</strong>! (2) <strong><em>Aset</em> banyak</strong>! (3) <strong><em>Noise</em> tinggi</strong>! (4) <strong><em>Tidak yakin</em></strong>!</p>
      <p><strong><em>Kapan</em> optimisasi <em>menang</em>?</strong> (1) <strong><em>Data</em> panjang</strong>! (2) <strong><em>Sinyal</em> kuat</strong>! (3) <strong><em>Dengan</em> rem</strong>!</p>
      <p><strong><em>Default</em>:</strong> <strong>1/N</strong> atau <strong>BL</strong>. <strong><em>Buktikan</em></strong> sebelum <em>canggih</em>.</p>
      <h3>📖 Panduan Lengkap: Turnover &amp; Biaya</h3>
      <p><strong><em>Optimisasi</em></strong> tanpa <em>batas</em> = <em>turnover</em> <strong>300%+</strong>! <strong><em>Biaya</em></strong> = <em>return</em> <em>terkikis</em>!</p>
      <p><strong><em>Solusi</em>:</strong> (1) <strong><em>Batas</em></strong> turnover! (2) <strong><em>Penalty</em></strong> di <em>objektif</em>! (3) <strong><em>Rebalance</em></strong> jarang!</p>
      <p><strong><em>Contoh</em>:</strong> <em>turnover</em> 300% &times; <em>biaya</em> 0,5% = <strong>1,5%</strong> <em>drag</em>! <strong><em>Besar</em></strong>!</p>
      <p><strong><em>Net</em></strong> &gt; <em>gross</em>. <strong><em>Selalu</em></strong>.</p>
      <h3>🤝 Komunitas</h3>
      <p><strong><em>Berbagi</em></strong>! <strong><em>Belajar</em></strong>!</p>
      <h3>🌟 Penutup Akhir</h3>
      <p><strong><em>Kebijaksanaan</em></strong> &gt; <em>kepintaran</em>. <strong><em>Robust</em></strong> &gt; <em>optimal</em>.</p>
      <p><strong><em>Jadilah</em> bijak.</strong></p>
      <h3>📖 Studi Mendalam: Mengapa Estimasi Return Sulit</h3>
      <p><strong><em>Return</em></strong> = <em>noisy</em>! <strong><em>Volatilitas</em></strong> tahunan 20%! <strong><em>Untuk</em></strong> <em>estimasi</em> mean &plusmn;1% &rarr; <strong><em>butuh</em> 400 tahun</strong> data!</p>
      <p><strong><em>Implikasi</em>:</strong> <strong><em>jangan</em></strong> percaya <em>estimasi</em> return! <strong><em>Shrink</em></strong> ke <em>equilibrium</em>! <strong><em>Fokus</em></strong> ke <em>risiko</em> (<em>lebih</em> stabil!).</p>
      <p><strong><em>Merton</em> (1980):</strong> <em>estimasi</em> mean = <em>sulit</em>. <em>Estimasi</em> var = <em>mudah</em>. <strong><em>Pelajaran</em>:</strong> <strong><em>minimum variance</em></strong> (tanpa <em>return</em>!) <em>sering</em> <strong><em>lebih baik</em></strong>!</p>
      <p><strong><em>Minimum variance</em></strong>: <em>hanya</em> butuh <em>covariance</em>! <strong><em>Lebih robust</em></strong>! <strong><em>Pertimbangkan</em></strong>!</p>
      <h3>🎯 Vignette Ujian (CFA-Style)</h3>
      <p><strong>Situasi:</strong> <em>Manajer</em> optimisasi MV. <em>Hasil</em>: 80% satu <em>sektor</em>. <em>Klien</em> tanya: &ldquo;<em>Aman</em>?&rdquo;</p>
      <p><strong>Jawab:</strong> <strong><em>Tidak</em></strong>! <em>Tambah</em> <em>constraint</em> sektor! <em>Uji</em> sensitivitas! <em>Pertimbangkan</em> BL!</p>
      <p><strong><em>Profesional</em></strong> = <em>jujur</em> tentang <em>risiko</em>.</p>
      <h3>📖 Esai: Kebijaksanaan dalam Optimisasi</h3>
      <p><strong><em>Optimisasi</em></strong> = <strong><em>matematika</em></strong>. <strong><em>Kebijaksanaan</em></strong> = <strong><em>manusia</em></strong>. <strong><em>Matematika</em></strong> <em>tanpa</em> <strong><em>kebijaksanaan</em></strong> = <strong><em>bahaya</em></strong>. <strong><em>Contoh</em></strong>: <em>LTCM</em>. <strong><em>Pelajaran</em></strong>: <strong><em>selalu</em></strong> <em>rendah hati</em>. <strong><em>Selalu</em></strong> <em>robust</em>. <strong><em>Selalu</em></strong> <em>sederhana</em>.</p>
      <p><strong><em>Matematika</em></strong> = <strong><em>pelayan</em></strong>. <strong><em>Bukan</em></strong> <em>tuan</em>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Robust</em></strong> &gt; <em>optimal</em>. <strong><em>Selalu</em></strong>.</p>
      <h3>💎 Kebijaksanaan Kuantitatif</h3>
      <p><strong><em>Kuantitatif</em></strong> + <strong><em>bijak</em></strong> = <strong><em>kuat</em></strong>. <strong><em>Kuantitatif</em></strong> <em>tanpa</em> <strong><em>bijak</em></strong> = <strong><em>rapuh</em></strong>.</p>
      <p><strong><em>Gabungkan</em></strong>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      <p><strong><em>Teruslah</em></strong> <strong><em>belajar</em></strong> dan <strong><em>berkembang</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Optimisasi memberi jawaban optimal — ikuti bobotnya persis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Error maximization</strong>: garbage in → <em>amplified</em> garbage out (147% satu saham!). Bobot 2 desimal = <strong>presisi palsu</strong>. Pakai constraints + BL + resampling + <strong>round ke 5%</strong>. Optimisasi = <em>alat berpikir</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Black-Litterman terlalu akademis, tidak praktis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Intuisi BL = <strong>musyawarah pasar + analis</strong> — justru <em>paling praktis</em>! Dipakai manajer institusi global. Implementasi sederhana (Lab 2) sudah menangkap 80% manfaat: <strong>views terukur + bobot masuk akal</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Matematika = kebenaran.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>input</em> = <em>tebakan</em></strong>! <em>Matematika</em> = <em>kalkulator</em>!</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kompleks = canggih.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>1/N &gt; <em>canggih</em></strong> (sering!). <strong><em>Sederhana</em> = <em>robust</em>.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu tampilkan sensitivitas.</strong> 'Jika E(R) saham ±2%, bobot berubah X.' Jika berubah drastis = <strong>jangan percaya</strong> bobot itu. Analisis sensitivitas = kejujuran kuantitatif.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Round bobot ke 5%.</strong> 32,47% → 30%. Presisi palsu menggoda overconfidence. Portofolio 30/40/30 yang dipahami &gt; 32,47/38,12/29,41 yang mistis.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Aturan optimisasi:</strong> (1) <strong><em>Shrink</em>!</strong> (2) <strong><em>Constrain</em>!</strong> (3) <strong><em>BL</em>!</strong> (4) <strong><em>Uji</em> sensitivitas!</strong> <strong><em>Empat</em> atau <em>jangan</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Grid Search Frontier 3 Aset</h2>
<p>Cari portofolio max Sharpe dengan grid search + constraints.</p>
<PyodideLab
  title={"Lab 1 — Grid Search"}
  hint={"Ubah MAX_W 0.4 → 1.0 (tanpa batas). Bobot ekstrem muncul — error maximization!"}
  defaultCode={"# Grid search mean-variance 3 aset (pure Python)\nimport math, itertools\nER = [0.10, 0.07, 0.05]\nSIG = [0.18, 0.06, 0.15]\nRHO = [[1, 0.2, 0.1], [0.2, 1, 0.0], [0.1, 0.0, 1]]\nRF, MAX_W = 0.03, 0.4   # ubah MAX_W!\nCOV = [[RHO[i][j]*SIG[i]*SIG[j] for j in range(3)] for i in range(3)]\n\nterbaik = None\nfor w in itertools.product([i/10 for i in range(11)], repeat=3):\n    if abs(sum(w)-1) > 1e-9 or any(x > MAX_W + 1e-9 for x in w): continue\n    er = sum(a*b for a, b in zip(w, ER))\n    var = sum(w[i]*w[j]*COV[i][j] for i in range(3) for j in range(3))\n    sharpe = (er - RF)/math.sqrt(var)\n    if terbaik is None or sharpe > terbaik[0]: terbaik = (sharpe, w, er)\ns, w, er = terbaik\nprint(f\"Max Sharpe {s:.2f}: saham {w[0]:.0%}, obligasi {w[1]:.0%}, emas {w[2]:.0%}\")\nprint(f\"E(R) {er:.1%}\")\nprint(\"\\nTanpa MAX_W: bobot ekstrem (error maximization).\")\nprint(\"Constraints = rem. Round ke 5%!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Black-Litterman Sederhana</h2>
<p>Gabungkan equilibrium + views dengan confidence.</p>
<PyodideLab
  title={"Lab 2 — Black-Litterman"}
  hint={"Ubah CONF 0.5 → 0.9 (sangat yakin). Posterior mendekati views penuh!"}
  defaultCode={"# Black-Litterman 2 aset (intuisi: rata-rata terbobot)\nEQ = {\"saham\": 0.08, \"obligasi\": 0.05}   # equilibrium (implied)\nVIEW = {\"saham\": 0.11, \"obligasi\": 0.05} # views analis\nCONF = 0.5   # confidence 0..1 (ubah!)\n\nprint(f\"{'aset':<10}{'equil':>8}{'view':>8}{'BL':>8}\")\nfor a in EQ:\n    bl = (1-CONF)*EQ[a] + CONF*VIEW[a]\n    print(f\"{a:<10}{EQ[a]:>7.1%}{VIEW[a]:>8.1%}{bl:>8.1%}\")\nprint()\nprint(\"CONF=0 -> ikut pasar. CONF=1 -> ikut analis.\")\nprint(\"BL = musyawarah proporsional keyakinan.\")\nprint(\"(Versi penuh pakai matriks kovarians; intuisi sama.)\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Alokasi dengan views analis → <strong>Black-Litterman</strong></h3>
<p><strong>Kenapa:</strong> Sistematis + masuk akal.</p>
<p><strong>Contoh nyata:</strong> Overweight moderat.</p>
</div>
<div className="decision-card">
<h3>2. Tidak percaya return forecast → <strong>Risk parity / min-variance</strong></h3>
<p><strong>Kenapa:</strong> Hanya butuh kovarians.</p>
<p><strong>Contoh nyata:</strong> Bobot ∝ 1/σ.</p>
</div>
<div className="decision-card">
<h3>3. Input sangat tidak pasti → <strong>Resampling</strong></h3>
<p><strong>Kenapa:</strong> Rata-ratakan ketidakpastian.</p>
<p><strong>Contoh nyata:</strong> 1000 simulasi.</p>
</div>
<div className="decision-card">
<h3>4. Bobot terlihat ekstrem → <strong>Curigai + tambah constraints</strong></h3>
<p><strong>Kenapa:</strong> Error maximization.</p>
<p><strong>Contoh nyata:</strong> Max 40%.</p>
</div>
<div className="decision-card">
<h3>5. Optimisasi &rarr; <strong>Shrink + constrain + BL; robust &gt; optimal</strong></h3>
<p><strong>Kenapa:</strong> Error maximization; 147% dari noise 0,3%.</p>
<p><strong>Contoh nyata:</strong> Quant fund hancur 1998.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Constraints</strong> selalu.</li><li><strong>BL</strong> untuk views.</li><li><strong>Resampling</strong> untuk ketidakpastian.</li><li><strong>Round 5%</strong>.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Optimisasi Sempurna yang Bangkrut</h2>
<div className="callout">
<p>Quant fund: MV murni → 147% satu saham (E(R) tertinggi 0,3%). Estimasi meleset → hancur 1998.</p>
<p><strong>Vignette lanjutan.</strong> Quant fund: MV murni &rarr; <strong>147% satu saham</strong> (E(R) tertinggi <em>hanya</em> 0,3%!). Estimasi <em>meleset</em> &rarr; <strong>hancur 1998</strong>.</p>
<p><strong>Pertanyaan:</strong> (a) Apa yang salah? (b) Bagaimana BL mencegah? (c) Aturan praktis? (d) Jika <em>dengan</em> constraint 60% &mdash; <em>berapa</em> rugi maksimal? (e) <em>Kapan</em> 1/N <em>lebih baik</em>?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Error maximization</strong>: 0,3% = noise; optimisasi memperkuat noise jadi 147% leverage. Matematika benar, <strong>input sampah</strong>.</p>
<p>(d) <strong><em>Jauh</em> lebih kecil!</strong> &mdash; 60% vs 147%! <strong><em>Constraint</em> = <em>asuransi</em>.</strong></p>
<p>(e) <strong><em>Jika</em> input <em>buruk</em></strong> (noise &gt; sinyal!)! <strong><em>Jika</em> <em>tidak yakin</em></strong>! <strong><em>Default</em> = 1/N <em>atau</em> BL.</strong></p>
<p>(b) <strong>BL</strong>: mulai dari equilibrium (masuk akal) + views di-shrink by confidence → <strong>tidak ada</strong> bobot 147% dari view lemah.</p>
<p>(c) <strong>Constraints + sensitivitas + round 5% + resampling.</strong> Optimisasi = alat berpikir, bukan mesin jawaban.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Optimisasi Lanjut</h2>
      <h3>1. Shrinkage (Ledoit-Wolf)</h3>
      <p><strong><em>Covariance</em></strong> = <em>shrink</em> ke <em>terstruktur</em>! <strong><em>Terbukti</em>!</strong></p>
      <h3>2. Risk parity</h3>
      <p><strong><em>Lihat</em> PM-C4</strong>! <strong><em>Alternatif</em></strong> MV!</p>
      <h3>3. Machine learning</h3>
      <p><strong><em>Hati-hati</em></strong>! <em>Overfit</em>! <strong><em>Validasi</em></strong>!</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Error max kilat</h3>
      <p>Beda 0,3%. Bobot MV murni?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong>147%</strong>! (<em>Gila</em>!).</p>
      </details>
      <h3>Drill 2 &mdash; BL kilat</h3>
      <p>Prior 6%, view 8% (50%). BL?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>7%</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; Constraint</h3>
      <p><em>Kenapa</em> constraint?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong><em>Kebijaksanaan</em></strong>! <em>Cegah</em> gila!</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Optimal = terbaik.&rdquo; <em>Benar</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Robust</em> &gt; <em>optimal</em>!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. MV murni memberi 147% satu saham. Diagnosis?"}
  options={
    ["Ikuti",
    "Error maximization — tambah constraints",
    "Leverage lagi",
    "Ganti data"]
  }
  correct={1}
  explanation={"Benar: optimisasi memperkuat error input. Constraints + BL + resampling = rem."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Intuisi Black-Litterman?"}
  options={
    ["Ikuti analis 100%",
    "Musyawarah: equilibrium pasar + views by confidence",
    "Ikuti pasar 100%",
    "Acak"]
  }
  correct={1}
  explanation={"Benar: posterior = antara pasar dan views, proporsional keyakinan. Bobot masuk akal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. CONF=0 dalam BL artinya?"}
  options={
    ["Ikuti analis",
    "Ikuti equilibrium pasar",
    "Error",
    "Acak"]
  }
  correct={1}
  explanation={"Benar: confidence nol → views diabaikan. CONF=1 → views penuh."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Resampling (Michaud) mengatasi?"}
  options={
    ["Biaya",
    "Ketidakpastian input (rata-ratakan banyak optimisasi)",
    "Pajak",
    "Likuiditas"]
  }
  correct={1}
  explanation={"Benar: 1000 simulasi input → bobot rata-rata yang robust. Kerendahan hati kuantitatif."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Bobot 32,47%. Praktik terbaik?"}
  options={
    ["Ikuti persis",
    "Round ke 30% (presisi palsu)",
    "Tambah desimal",
    "Abaikan"]
  }
  correct={1}
  explanation={"Benar: 2 desimal = presisi palsu dari input ±2%. Round 5% + pahami."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. MV murni → 147% satu saham (beda E(R) 0,3%). Solusi TEPAT?"}
  options={
    ["Biarkan — matematika benar",
    "Constraint + BL + sensitivitas — error maximization!",
    "Tambah leverage",
    "Ganti model"]}
  correct={1}
  explanation={"Benar: 0,3% = noise. Solusi: shrink, constrain, BL, uji sensitivitas. Robust > optimal."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>MV</strong>: max Sharpe + constraints (rem wajib).</li>
<li><strong>Error maximization</strong>: garbage in → amplified garbage out.</li>
<li><strong>Black-Litterman</strong>: equilibrium + views × confidence.</li>
<li><strong>Robust</strong>: resampling, risk parity, max diversification.</li>
<li><strong>Aturan</strong>: sensitivitas selalu; round 5%; diversifikasi model.</li>
<li><strong>Prinsip</strong>: optimisasi rendah hati &gt; optimisasi sempurna.</li>

<li><strong>MV:</strong> error maximizer; butuh rem.</li>
<li><strong>BL:</strong> prior + views; stabil.</li>
<li><strong>Robust:</strong> resampling; constraint; 1/N.</li>
<li><strong>Kapan TIDAK pakai:</strong> tanpa constraint; percaya beda kecil; optimal tanpa robust.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-d1-data-harga" className="btn btn-secondary btn-sm">← PM-D1</Link>
        <Link href="/learn/pm-d3-regresi-faktor" className="btn btn-primary btn-sm">PM-D3 →</Link>
      </div>
    </div>
  );
}

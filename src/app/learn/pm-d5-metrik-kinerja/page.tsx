"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmD5MetrikKinerjaPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-D5 — Portfolio Management</span>
        <h1 className="display-title">Metrik Kinerja & Risiko:<br/>Sharpe hingga CVaR</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Sharpe 2,0 yang Bangkrut</a></li>
<li><a href="#riskadj">Sharpe, Sortino, Calmar</a></li>
<li><a href="#drawdown">Drawdown</a></li>
<li><a href="#var">VaR & CVaR</a></li>
<li><a href="#sintesis">Sintesis: Metrik</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Sharpe 2,0</a></li>
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
<li>Menghitung Sharpe, Sortino, Calmar.</li>
<li>Menjelaskan max drawdown dan recovery.</li>
<li>Menghitung VaR & CVaR historis.</li>
<li>Menjelaskan kelemahan tiap metrik.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Sharpe 2,0 yang Bangkrut</h2>
      <div className="story">
        <p><strong>Hedge fund</strong>: Sharpe <strong>2,0</strong> (5 tahun)! Investor masuk <strong>Rp50M</strong>. <strong>Sebulan</strong> kemudian: <strong>−40%</strong> — fund <strong>tutup</strong>. Kok bisa? Strategi <strong>jual put</strong> (short vol): untung kecil <em>setiap</em> bulan (Sharpe tinggi!) sampai <strong>ekor</strong> datang — <strong>sekali</strong>, mematikan.</p>
<p>Twist-nya: <strong>Sharpe buta ekor</strong> — distribusi <em>skew negatif</em> terlihat 'hebat' sampai bencana. <strong>Satu metrik = satu kebohongan.</strong> Lesson ini: panel instrumen lengkap.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="riskadj">Risk-Adjusted — Sharpe & Kawan</h2>
<p><strong>Definisi.</strong> <strong>Sharpe</strong> = (R − R_f)/σ — return per <em>total</em> risiko. <strong>Sortino</strong>: penyebut = <em>downside deviation</em> (hanya risiko buruk!). <strong>Calmar</strong> = return / <strong>max drawdown</strong>.</p>
<p><strong>Kelemahan</strong>: Sharpe <strong>buta skew</strong> (short-vol terlihat hebat!); Sortino butuh <em>target</em>; Calmar sensitif <em>satu</em> kejadian.</p>
<Tex math={String.raw`Sharpe = \frac{R - R_f}{\sigma} \quad;\quad Sortino = \frac{R - T}{\sigma_{down}} \quad;\quad Calmar = \frac{R}{MaxDD}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\sigma_{down}`} />: deviasi return di bawah target T saja</li>
<li>Sharpe &gt; 1: baik; &gt; 2: luar biasa (curigai skew!)</li>
<li>Paket: Sharpe + Sortino + Calmar + skew — jangan satu</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Metrik seperti <strong>panel dashboard mobil</strong>: Sharpe = <strong>kecepatan</strong>; Sortino = <strong>kecepatan di turunan</strong>; Calmar = <strong>rem terburuk yang pernah</strong>; skew = <strong>lampu oli</strong>. Ngebut (Sharpe 2,0) dengan <strong>lampu oli menyala</strong> (skew −3) = mogok depan mata.</p>
<p><strong>Kapan dipakai:</strong> Factsheet: tampilkan paket, bukan satu angka.</p>
<p><strong>Pendalaman intuisi &mdash; Sharpe buta = &ldquo;receh di rel kereta&rdquo;.</strong> <em>Hedge fund</em>: <em>Sharpe</em> <strong>2,0</strong> (5 tahun!)! <em>Luar biasa</em>! <strong><em>Sebulan</em></strong> kemudian: <strong>&minus;40%</strong>! <strong><em>Tutup</em></strong>! <strong><em>Kenapa</em>?</strong> <em>Strategi</em>: <strong><em>short-vol</em></strong> (<em>skew</em> <strong>&minus;3</strong>!). <em>Untung</em> <strong><em>kecil</em></strong> <em>rutin</em> (&sigma; <strong><em>kecil</em></strong>!) + <em>ekor kiri</em> <strong><em>fatal</em></strong>! <strong><em>Sharpe</em></strong> = <em>buta</em> <strong><em>skew</em></strong>! <strong>Pelajaran:</strong> <strong><em>cek</em> skew</strong>! <strong><em>CVaR</em></strong>! <strong><em>Stress test</em></strong>! <strong><em>Jangan</em></strong> <em>percaya</em> <strong><em>satu</em></strong> metrik!</p><details className="worked">
<summary>📐 Contoh: Bedah short-vol (klik untuk buka)</summary>
<p>Strategi jual put: Sharpe <strong>2,0</strong>, Sortino <strong>2,5</strong>, skew <strong>−3</strong>, MaxDD historis <strong>5%</strong>.</p>
<p><strong>Lampu oli</strong>: skew −3 = <strong>ekor kiri</strong>! Calmar = 15%/5% = 3 (terlihat bagus — <em>karena</em> ekor belum datang!).</p>
<p><strong>Verdict</strong>: <strong>tolak</strong> — Sharpe tinggi + skew sangat negatif = <strong>bom waktu</strong>. Benar saja: −40% sebulan kemudian.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Sharpe &mdash; hitung</summary>
<p><strong>Soal:</strong> Rp = 12%, Rf = 3%, &sigma;p = 15%. <em>Sharpe</em>?</p>
<p><strong>Sharpe</strong> = (12%&minus;3%)/15% = <strong>0,6</strong>.</p>
<p><strong><em>Bagus</em></strong>? <strong><em>Lumayan</em></strong> (0,5&ndash;1,0!). <strong><em>Tapi</em></strong>: <strong><em>cek</em> skew</strong>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Sharpe menipu &mdash; short-vol</summary>
<p><strong>Soal:</strong> <em>Strategi</em>: +1%/bulan (59 bulan), &minus;40% (1 bulan). <em>Sharpe</em>?</p>
<p><strong><em>Sharpe</em> &asymp; 2,0</strong>! (<em>Tinggi</em>!).</p>
<p><strong><em>Skew</em> = &minus;3</strong>! <strong><em>Bahaya</em></strong>! <strong><em>Jangan</em></strong> tertipu!</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Sortino vs Sharpe</summary>
<p><strong>Soal:</strong> <em>Sharpe</em> 0,6. <em>Downside dev</em> 10%. <em>Sortino</em>?</p>
<p><strong>Sortino</strong> = (12%&minus;3%)/10% = <strong>0,9</strong>!</p>
<p><strong><em>Lebih</em></strong> <em>tinggi</em>! (<em>Hanya</em> <em>downside</em>!). <strong><em>Sortino</em></strong> = <em>lebih</em> <strong><em>relevan</em></strong>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Sharpe tinggi = aman&rdquo;.</strong> <strong>SALAH.</strong> <strong><em>Cek</em> skew</strong>! <strong><em>CVaR</em></strong>!</p>
</div>

<PlotlyChart
  data={[{x: ["Sharpe", "Skew", "Max DD", "CVaR"], y: [2.0, -3.0, -40, -25], type: "bar", marker: {color: ["#2ca02c", "#d62728", "#d62728", "#e8a838"]}, name: "Metrik"}]}
  title={"Sharpe 2,0 tapi skew −3 dan DD −40%: menipu!"}
  layout={{xaxis: {title: "Metrik"}, yaxis: {title: "Nilai"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = metrik fund.</p>
<p><strong>Interpretasi:</strong> <strong><em>Sharpe</em> hijau</strong> (2,0!) <strong><em>tapi</em></strong> <strong><em>skew</em> &amp; <em>DD</em> merah</strong>! <strong><em>Jangan</em></strong> <em>tertipu</em> <strong><em>satu</em></strong> metrik!</p>
</div>
<h2 id="drawdown">Drawdown — Luka & Sembuh</h2>
<p><strong>Definisi.</strong> <strong>Drawdown</strong>: penurunan dari <em>puncak</em> terakhir. <strong>MaxDD</strong>: yang terdalam. <strong>Underwater chart</strong>: visual luka. <strong>Recovery</strong>: waktu kembali ke puncak — <strong>−50% butuh +100%</strong> untuk pulih!</p>
<p><strong>Psikologi</strong>: MaxDD = <strong>ujian terberat investor</strong> (PM-C6!) — lebih penting dari Sharpe untuk <em>retensi</em>.</p>
<Tex math={String.raw`DD_t = \frac{P_t - \max_{s \leq t} P_s}{\max_{s \leq t} P_s}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Recovery dari −50%: butuh +100% (asimetri brutal!)</li>
<li>Dari −20%: butuh +25%</li>
<li>Investor kabur di MaxDD → tidak menikmati recovery</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Drawdown seperti <strong>luka</strong>: MaxDD = <strong>luka terdalam</strong>; underwater = <strong>berapa lama berdarah</strong>; recovery = <strong>penyembuhan</strong>. Luka 50% butuh <strong>obat 100%</strong> (asimetri!). Investor = pasien yang <strong>kabur saat berdarah</strong>.</p>
<p><strong>Kapan dipakai:</strong> Risk report: MaxDD + underwater selalu tampil.</p>
<p><strong>Pendalaman intuisi &mdash; drawdown = &ldquo;luka yang nyata&rdquo;.</strong> <strong><em>Return</em></strong> +100% lalu <strong>&minus;50%</strong> = <strong>0%</strong>! (<em>Bukan</em> +50%!). <strong><em>Drawdown</em></strong> = <em>penurunan</em> dari <strong><em>puncak</em></strong>! <strong><em>Max DD</em></strong> = <em>terburuk</em>! <strong><em>Recovery</em></strong> = <em>waktu</em> kembali! <strong>Pelajaran:</strong> <strong><em>investor</em></strong> <em>rasakan</em> <strong><em>drawdown</em></strong>, <em>bukan</em> <em>volatilitas</em>! <strong><em>Kelola</em></strong> DD! <strong><em>Batasi</em></strong>!</p><details className="worked">
<summary>📐 Contoh: Matematika brutal (klik untuk buka)</summary>
<p>Rp100jt → −50% = Rp50jt. Pulih ke 100? Butuh <strong>+100%</strong> (= Rp50jt lagi!).</p>
<p><strong>−20%</strong> → butuh +25%. <strong>−80%</strong> (gorengan!) → butuh <strong>+400%</strong> (mustahil!).</p>
<p><strong>Implikasi</strong>: <strong>hindari kerugian besar</strong> &gt; kejar untung besar. Inilah matematika di balik <strong>stop-loss &amp; diversifikasi</strong>. Lindungi downside dulu!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Drawdown &mdash; hitung</summary>
<p><strong>Soal:</strong> <em>Nilai</em>: 100 &rarr; 150 &rarr; 90 &rarr; 120. <em>Max DD</em>?</p>
<p><strong><em>Puncak</em></strong> 150, <strong><em>lembah</em></strong> 90. <strong>DD = (90&minus;150)/150 = &minus;40%</strong>!</p>
<p><strong><em>Recovery</em></strong>: 90 &rarr; 120 (<strong><em>belum</em></strong> <em>pulih</em>!).</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Calmar ratio</summary>
<p><strong>Soal:</strong> <em>Return</em> 12%, <em>Max DD</em> 20%. <em>Calmar</em>?</p>
<p><strong>Calmar</strong> = 12%/20% = <strong>0,6</strong>.</p>
<p><strong><em>Bagus</em></strong>? <strong><em>Calmar</em> &gt; 1,0</strong> = <em>baik</em>!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; VaR = <em>maksimum</em> rugi.</strong> <strong>SALAH.</strong> <strong><em>VaR</em></strong> = <em>batas</em>! <strong><em>CVaR</em></strong> = <em>ekor</em>!</p>
</div>
<PlotlyChart
  data={[{x: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu"], y: [0,-5,-12,-20,-15,-8,-3,0], type: "scatter", mode: "lines", fill: "tozeroy", marker: {color: "#ef4444"}, line: {width: 2}, name: "drawdown"}]}
  title={"Underwater chart: drawdown dari puncak (%)"}
  layout={{xaxis: {title: "Bulan"}, yaxis: {title: "Drawdown (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Area merah = di bawah puncak terakhir. Nol = puncak baru.</p>
<p><strong>Interpretasi:</strong> Luka terdalam <strong>−20%</strong> (Apr), sembuh <strong>4 bulan</strong> (Agu). Underwater chart menunjukkan <strong>dua dimensi penderitaan</strong>: <em>dalamnya</em> (MaxDD) &amp; <em>lamanya</em> (recovery). Investor yang kabur di Apr <strong>melewatkan</strong> pemulihan — <strong>komunikasikan ekspektasi</strong> ini di muka (PM-C1!).</p>
</div>
<h2 id="var">VaR & CVaR — Bahasa Risiko</h2>
<p><strong>Definisi.</strong> <strong>VaR 95%</strong>: kerugian <em>maksimal</em> di 95% hari 'normal' — <strong>tidak bilang</strong> seberapa parah 5% terburuk! <strong>CVaR/Expected Shortfall</strong>: <em>rata-rata</em> kerugian di 5% terburuk — <strong>jujur tentang ekor</strong>.</p>
<p><strong>Aturan</strong>: VaR untuk <em>limit harian</em>; CVaR untuk <em>modal &amp; ekor</em>. <strong>Keduanya buta</strong> di luar data historis → <strong>stress test</strong> (PM-D6!).</p>
<Tex math={String.raw`VaR_{95\%} = -Q_{5\%}(R) \quad;\quad CVaR_{95\%} = -E[R \mid R < -VaR]`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`Q_{5\%}`} />: persentil 5% return</li>
<li>VaR: 'tidak lebih buruk dari X di 95% hari'</li>
<li>CVaR: 'JIKA termasuk 5% terburuk, rata-rata rugi Y'</li>
<li>CVaR ≥ VaR selalu (ekor lebih dalam)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> VaR seperti <strong>'banjir maksimal 95% tahun'</strong> — tidak bilang <em>sedalam apa</em> saat 5% banjir besar datang! CVaR = <strong>'rata-rata kedalaman saat banjir besar'</strong>. Warga (investor) butuh <strong>keduanya</strong>: tanggul (VaR) + <strong>evakuasi</strong> (CVaR).</p>
<p><strong>Kapan dipakai:</strong> Limit trading harian (VaR); alokasi modal & risiko ekor (CVaR).</p>
<p><strong>Pendalaman intuisi &mdash; VaR vs CVaR = &ldquo;badai vs tsunami&rdquo;.</strong> <strong><em>VaR</em></strong> 95% = <strong><em>batas</em></strong> kerugian (<em>5%</em> <em>terburuk</em> <em>diabaikan</em>!). <strong><em>CVaR</em></strong> = <strong><em>rata-rata</em></strong> <em>5%</em> <em>terburuk</em>! <strong><em>VaR</em></strong> = <em>buta</em> <strong><em>ekor</em></strong>! <strong><em>CVaR</em></strong> = <em>lihat</em> <strong><em>ekor</em></strong>! <strong>Pelajaran:</strong> <strong><em>CVaR</em></strong> &gt; <em>VaR</em>! <strong><em>Selalu</em></strong> <em>keduanya</em>!</p><details className="worked">
<summary>📐 Contoh: Angka jujur (klik untuk buka)</summary>
<p>Portofolio Rp10M. Return harian historis: VaR 95% = <strong>2%</strong> (Rp200jt).</p>
<p><strong>Artinya</strong>: 95% hari rugi ≤ Rp200jt. <strong>Tidak artinya</strong>: 'rugi maksimal Rp200jt'! (Salah kaprah #1!)</p>
<p><strong>CVaR 95%</strong> = <strong>3,5%</strong> (Rp350jt) — rata-rata saat 5% terburuk.</p>
<p><strong>Laporan benar</strong>: 'VaR Rp200jt; CVaR Rp350jt; stress 2008: −Rp2M.' <strong>Tiga angka, tiga cerita.</strong></p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): VaR &mdash; hitung</summary>
<p><strong>Soal:</strong> <em>Portofolio</em> Rp10M. <em>Return</em> harian &mu; 0,05%, &sigma; 1%. <em>VaR</em> 95% 1-hari?</p>
<p><strong>VaR</strong> = 10M &times; (1,645&times;1% &minus; 0,05%) = <strong>Rp164jt</strong>.</p>
<p><strong><em>Artinya</em>:</strong> <em>95%</em> <em>rugi</em> &lt; Rp164jt. <strong><em>5%</em></strong> = <em>lebih</em>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: CVaR vs VaR</summary>
<p><strong>Soal:</strong> <em>VaR</em> Rp164jt. <em>Distribusi</em> <em>fat-tail</em>. <em>CVaR</em>?</p>
<p><strong><em>CVaR</em> &gt; VaR</strong>! (mis. <strong>Rp250jt</strong>!).</p>
<p><strong><em>Selalu</em></strong> <em>lapor</em> <strong><em>keduanya</em></strong>!</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Jangan Tertipu</h2>
      <p>Riskadj, DD, VaR = <strong>satu pesan</strong>:</p>
      <ol>
        <li><strong>RISKADJ:</strong> <em>Sharpe</em> + <strong><em>skew</em></strong>!</li>
        <li><strong>DD:</strong> <em>luka</em> <strong><em>nyata</em></strong>!</li>
        <li><strong>VAR:</strong> <em>CVaR</em> <strong><em>wajib</em></strong>!</li>
      </ol>
      <p><strong><em>Banyak</em> metrik, <em>satu</em> kebenaran.</strong></p>

      <h3>📖 Panduan Super Lengkap: Memilih Metrik yang Tepat</h3>
      <p><strong><em>Tidak</em></strong> ada <strong><em>satu</em></strong> metrik <strong><em>sempurna</em></strong>. <strong><em>Pilih</em></strong> sesuai <strong><em>kebutuhan</em></strong>:</p>
      <p><strong>SHARPE:</strong> <em>umum</em>. <strong><em>Kelemahan</em>:</strong> <em>buta</em> skew. <strong><em>Pakai</em>:</strong> <em>awal</em>.</p>
      <p><strong>SORTINO:</strong> <em>downside</em>. <strong><em>Kelemahan</em>:</strong> <em>masih</em> vol. <strong><em>Pakai</em>:</strong> <em>asimetris</em>.</p>
      <p><strong>CALMAR:</strong> <em>return/DD</em>. <strong><em>Kelemahan</em>:</strong> <em>satu</em> titik. <strong><em>Pakai</em>:</strong> <em>CTA</em>.</p>
      <p><strong>CVaR:</strong> <em>ekor</em>. <strong><em>Kelemahan</em>:</strong> <em>sulit</em> estimasi. <strong><em>Pakai</em>:</strong> <em>risiko</em>.</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>kombinasikan</em></strong>! <strong><em>Empat</em></strong> <em>minimal</em>!</p>
      <h3>📖 Kisah Nyata: LTCM &amp; Metrik</h3>
      <p><strong>LTCM</strong>: <em>Sharpe</em> <strong><em>tinggi</em></strong>! <em>VaR</em> <strong><em>rendah</em></strong>! <strong><em>Hasil</em>:</strong> <strong><em>bangkrut</em></strong>!</p>
      <p><strong><em>Kenapa</em>?</strong> <em>Model</em> <strong><em>normal</em></strong>! <em>Realita</em> <strong><em>fat-tail</em></strong>! <strong><em>Korelasi</em></strong> &rarr; <strong>1</strong>!</p>
      <p><strong><em>Pelajaran</em>:</strong> <strong><em>stress test</em></strong>! <strong><em>Jangan</em></strong> <em>percaya</em> <strong><em>model</em></strong>!</p>
      <h3>🌍 Metrik Indonesia</h3>
      <p><strong><em>IHSG</em></strong>: <em>vol</em> <strong><em>tinggi</em></strong>! <em>Drawdown</em> <strong><em>dalam</em></strong>! <strong><em>Realistis</em></strong>!</p>
      <h3>🎙️ Debat: &ldquo;Sharpe = usang&rdquo;</h3>
      <p><strong>Kritik:</strong> &ldquo;<em>Buta</em> skew!&rdquo;</p>
      <p><strong>Bela:</strong> &ldquo;<strong><em>Awal</em></strong> yang <strong><em>baik</em></strong>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>pakai</em></strong> + <strong><em>lengkapi</em></strong>.</p>
      <h3>📊 Data Corner: Distribusi Return</h3>
      <p><strong><em>Nyata</em></strong>: <em>skew</em> <strong><em>negatif</em></strong>! <em>Kurtosis</em> <strong><em>tinggi</em></strong>! <strong><em>Bukan</em></strong> <em>normal</em>!</p>
      <h3>🧪 Eksperimen: Hitung Metrikmu</h3>
      <p><strong><em>Hitung</em></strong> Sharpe, skew, DD, CVaR! <strong><em>Kaget</em></strong>?</p>
      <h3>💡 Prinsip Abadi Metrik</h3>
      <p><strong>(1) <em>Banyak</em>.</strong> (2) <strong><em>Skew</em>.</strong> (3) <strong><em>DD</em>.</strong> (4) <strong><em>CVaR</em>.</strong> (5) <strong><em>Stress</em>.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> <em>Sharpe</em>? <strong>Q2:</strong> <em>Skew</em>? <strong>Q3:</strong> <em>DD</em>? <strong>Q4:</strong> <em>CVaR</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-C5:</strong> <em>evaluasi</em>! <strong>Ke PM-D6:</strong> <em>laporan</em>!</p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> <em>Sharpe</em> = ? <strong>A:</strong> <strong>(Rp&minus;Rf)/&sigma;</strong>.</p>
      <p><strong>Q2:</strong> <em>Skew</em> bahaya? <strong>A:</strong> <strong><em>Negatif</em> besar</strong>.</p>
      <p><strong>Q3:</strong> <em>Max DD</em>? <strong>A:</strong> <strong><em>Puncak</em> ke <em>lembah</em></strong>.</p>
      <p><strong>Q4:</strong> <em>CVaR</em> vs <em>VaR</em>? <strong>A:</strong> <strong><em>CVaR</em> &gt; <em>VaR</em></strong>.</p>
      <p><strong>Q5:</strong> <em>Short-vol</em>? <strong>A:</strong> <strong><em>Receh</em> di <em>rel</em></strong>.</p>
      <h3>💪 Latihan Praktik</h3>
      <p><strong><em>Analisis</em></strong> 1 fund! <strong><em>4 metrik</em></strong>!</p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>L1:</strong> <em>Tahu</em>. <strong>L2:</strong> <em>Hitung</em>. <strong>L3:</strong> <em>Ajarkan</em>. <strong>L4:</strong> <em>Design</em>.</p>
      <h3>📚 Bacaan Lanjutan</h3>
      <p><strong>Sharpe (1994)</strong>! <strong>Taleb</strong>!</p>
      <h3>❓ FAQ Metrik</h3>
      <p><strong>Q: <em>Sharpe</em> <em>bagus</em>?</strong> A: <strong>&gt; 1,0</strong>.</p>
      <p><strong>Q: <em>DD</em> <em>wajar</em>?</strong> A: <strong>&lt; 20%</strong>.</p>
      <h3>🔮 Masa Depan</h3>
      <p><strong><em>ML</em></strong>! <strong><em>Tail</em></strong>!</p>
      <h3>📝 Jurnal Metrik (Template)</h3>
      <p><strong>Fund:</strong> ___ <strong><em>Sharpe</em>:</strong> ___ <strong><em>Skew</em>:</strong> ___</p>
      <p><strong><em>DD</em>:</strong> ___ <strong><em>CVaR</em>:</strong> ___</p>
      <h3>💬 Satu Nasihat</h3>
      <p><strong>&ldquo;<em>Jangan</em> <em>kumpulkan</em> <em>receh</em> di <em>rel</em> <em>kereta</em>.&rdquo;</strong></p>
      <h3>🌟 Penutup</h3>
      <p><strong><em>Metrik</em></strong> = <em>kacamata</em>. <strong><em>Pakai</em></strong> <strong><em>semua</em></strong>.</p>
      <h3>📋 Template Checklist Metrik (Siap Pakai)</h3>
      <p>&square; <strong><em>Sharpe</em></strong>? &square; <strong><em>Skew</em></strong>? &square; <strong><em>DD</em></strong>? &square; <strong><em>CVaR</em></strong>?</p>
      <p>&square; <strong><em>Stress</em></strong>?</p>
      <p><strong>5 &square;</strong> = <em>aman</em>.</p>
      <h3>🎯 Vignette Ujian</h3>
      <p><strong>Sharpe 2,0</strong>, <em>skew</em> &minus;3. <em>Investasi</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Tidak</em></strong>!</p>
      <h3>🤖 AI &amp; Metrik</h3>
      <p><strong><em>ML</em></strong> <em>prediksi</em> <em>tail</em>! <strong><em>Tapi</em></strong>: <strong><em>validasi</em></strong>!</p>
      <h3>📖 Panduan Super Lengkap: Stress Testing</h3>
      <p><strong><em>Stress test</em></strong> = <strong><em>tanya</em></strong>: &ldquo;<em>bagaimana</em> <strong><em>jika</em></strong>?&rdquo; <strong><em>Skenario</em>:</strong></p>
      <p><strong>1. HISTORIS.</strong> <em>2008</em>! <em>2020</em>! <em>1998</em>! <strong><em>Bagaimana</em></strong> <em>portofolio</em>?</p>
      <p><strong>2. HIPOTETIS.</strong> <em>Vol</em> <strong>3&times;</strong>! <em>Korelasi</em> <strong>1</strong>! <em>Rate</em> <strong>+5%</strong>!</p>
      <p><strong>3. REVERSE.</strong> <em>Apa</em> yang <strong><em>hancurkan</em></strong>? <strong><em>Cari</em></strong>!</p>
      <p><strong><em>Manfaat</em>:</strong> <strong><em>siap</em></strong>! <strong><em>Tidak</em></strong> <em>kaget</em>! <strong><em>Rencana</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>rutin</em></strong>! <strong><em>Dokumentasikan</em></strong>! <strong><em>Tindak</em></strong> <em>lanjuti</em>!</p>
      <h3>📖 Panduan Super Lengkap: Drawdown Mendalam</h3>
      <p><strong><em>Drawdown</em></strong> = <strong><em>penurunan</em></strong> dari <strong><em>puncak</em></strong>. <strong><em>Jenis</em>:</strong></p>
      <p><strong>MAX DD:</strong> <em>terdalam</em>. <strong><em>AVG DD:</em></strong> <em>rata-rata</em>. <strong><em>DD DURATION:</em></strong> <em>lama</em>. <strong><em>RECOVERY:</em></strong> <em>waktu</em> <em>pulih</em>.</p>
      <p><strong><em>Matematika</em>:</strong> <em>rugi</em> <strong>50%</strong> &rarr; <em>butuh</em> <strong>+100%</strong>! <em>Rugi</em> <strong>20%</strong> &rarr; <em>butuh</em> <strong>+25%</strong>!</p>
      <p><strong><em>Psikologi</em>:</strong> <em>DD</em> <strong>20%</strong> = <em>investor</em> <strong><em>panik</em></strong>! <em>DD</em> <strong>40%</strong> = <em>investor</em> <strong><em>kabur</em></strong>!</p>
      <p><strong><em>Kelola</em>:</strong> <strong><em>stop-loss</em></strong>! <strong><em>Diversifikasi</em></strong>! <strong><em>Hedging</em></strong>!</p>
      <p><strong><em>DD</em></strong> = <strong><em>musuh</em></strong> <em>nyata</em>.</p>
      <h3>📖 Panduan Super Lengkap: VaR Mendalam</h3>
      <p><strong><em>VaR</em></strong> = <strong><em>Value at Risk</em></strong>. <strong><em>Definisi</em>:</strong> <em>kerugian</em> <strong><em>maksimum</em></strong> dengan <strong><em>kepercayaan</em></strong> X% dalam <strong><em>periode</em></strong> T.</p>
      <p><strong><em>Metode</em>:</strong> (1) <strong><em>Parametrik</em></strong> (<em>normal</em>!). (2) <strong><em>Historis</em></strong> (<em>data</em>!). (3) <strong><em>Monte Carlo</em></strong> (<em>simulasi</em>!).</p>
      <p><strong><em>Kelemahan</em>:</strong> (1) <strong><em>Buta</em></strong> <em>ekor</em>! (2) <strong><em>Asumsi</em></strong> <em>normal</em>! (3) <strong><em>Tidak</em></strong> <em>subadditive</em>!</p>
      <p><strong><em>Solusi</em>:</strong> <strong><em>CVaR</em></strong>! <strong><em>Stress</em></strong>! <strong><em>Kombinasi</em></strong>!</p>
      <p><strong><em>Regulasi</em>:</strong> <strong><em>Basel</em></strong> <em>wajib</em>! <strong><em>Pahami</em></strong> <em>batasnya</em>!</p>
      <h3>💬 Wawancara: Risk Manager</h3>
      <p><strong>Q: <em>Metrik</em> <em>favorit</em>?</strong> A: &ldquo;<strong><em>CVaR</em></strong> + <strong><em>stress</em></strong>. <strong><em>VaR</em></strong> = <em>awal</em>.&rdquo;</p>
      <h3>🎓 Ujian Akhir (Final)</h3>
      <p><strong>Q1:</strong> <em>Sharpe</em>? <strong>Q2:</strong> <em>Skew</em>? <strong>Q3:</strong> <em>DD</em>? <strong>Q4:</strong> <em>CVaR</em>? <strong>Q5:</strong> <em>Stress</em>?</p>
      <p><strong>Lulus</strong> = 5/5.</p>
      <h3>🌟 Penutup Akhir</h3>
      <p><strong><em>Banyak</em></strong> <em>metrik</em>. <strong><em>Satu</em></strong> <em>kebenaran</em>.</p>
      <p><strong><em>Carilah</em>.</strong></p>
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
      <h3>📖 Panduan Super Lengkap: Membandingkan Manajer</h3>
      <p><strong><em>Bandingkan</em></strong> <strong><em>apel</em></strong> vs <strong><em>apel</em></strong>! <strong><em>Aturan</em>:</strong></p>
      <p><strong>1. PERIODE.</strong> <em>Sama</em>! <strong>2. BENCHMARK.</strong> <em>Sama</em>! <strong>3. NET.</strong> <em>Setelah</em> fee! <strong>4. RISIKO.</strong> <em>Risk-adjusted</em>!</p>
      <p><strong><em>Jangan</em></strong> <em>bandingkan</em> <strong><em>bull</em></strong> vs <strong><em>bear</em></strong>! <strong><em>Jangan</em></strong> <em>bandingkan</em> <strong><em>gross</em></strong> vs <strong><em>net</em></strong>!</p>
      <p><strong><em>Fair</em></strong> = <strong><em>keputusan</em></strong> <em>baik</em>.</p>
      <h3>📖 Esai Mendalam: Mengapa Satu Metrik Tidak Cukup</h3>
      <p><strong><em>Manusia</em></strong> <em>suka</em> <strong><em>sederhana</em></strong>. <strong><em>Satu</em></strong> <em>angka</em>. <strong><em>Satu</em></strong> <em>peringkat</em>. <strong><em>Tapi</em></strong>: <strong><em>risiko</em></strong> = <strong><em>multidimensi</em></strong>. <strong><em>Return</em></strong>. <strong><em>Vol</em></strong>. <strong><em>Skew</em></strong>. <strong><em>Drawdown</em></strong>. <strong><em>Ekor</em></strong>.</p>
      <p><strong><em>Analogi</em>:</strong> <em>dokter</em>. <strong><em>Tidak</em></strong> <em>hanya</em> <strong><em>tekanan darah</em></strong>! <strong><em>Juga</em></strong> <em>gula</em>! <em>Kolesterol</em>! <em>Jantung</em>! <strong><em>Satu</em></strong> <em>normal</em> &ne; <strong><em>sehat</em></strong>!</p>
      <p><strong><em>Sama</em></strong> <em>dengan</em> <strong><em>investasi</em></strong>. <strong><em>Sharpe</em></strong> <em>bagus</em> &ne; <strong><em>aman</em></strong>. <strong><em>Cek</em></strong> <strong><em>semua</em></strong>!</p>
      <p><strong><em>Dokter</em></strong> <em>yang</em> <strong><em>baik</em></strong> = <strong><em>lengkap</em></strong>. <strong><em>Investor</em></strong> <em>yang</em> <strong><em>baik</em></strong> = <strong><em>lengkap</em></strong>.</p>
      <h3>📖 Esai Mendalam: Psikologi Drawdown</h3>
      <p><strong><em>Drawdown</em></strong> = <strong><em>luka</em></strong> <em>psikologis</em>. <strong><em>Teori</em></strong>: <em>rugi</em> <strong>20%</strong> = <em>tunggu</em>. <strong><em>Praktik</em></strong>: <em>investor</em> <strong><em>panik</em></strong>! <strong><em>Jual</em></strong> di <strong><em>bawah</em></strong>!</p>
      <p><strong><em>Penelitian</em>:</strong> <em>investor</em> <strong><em>rasakan</em></strong> <em>rugi</em> <strong>2&times;</strong> <em>untung</em>! (<em>Loss aversion</em>!). <strong><em>DD</em> 20%</strong> = <em>sakit</em> <strong>40%</strong>!</p>
      <p><strong><em>Implikasi</em>:</strong> <strong><em>kelola</em></strong> <em>ekspektasi</em>! <strong><em>Komunikasikan</em></strong>! <strong><em>Siapkan</em></strong> <em>mental</em>!</p>
      <p><strong><em>Manajer</em></strong> <em>yang</em> <strong><em>baik</em></strong> = <strong><em>psikolog</em></strong> <em>juga</em>.</p>
      <h3>📖 Esai: Ekor Gemuk adalah Kenyataan</h3>
      <p><strong><em>Teori</em></strong>: <em>normal</em>. <strong><em>Realita</em></strong>: <em>fat-tail</em>. <strong><em>Bencana</em></strong> <em>terjadi</em> <strong><em>lebih</em></strong> <em>sering</em>. <strong><em>2008</em></strong>. <strong><em>2020</em></strong>. <strong><em>Model</em></strong> <em>normal</em> = <strong><em>buta</em></strong>. <strong><em>Solusi</em></strong>: <strong><em>akui</em></strong>! <strong><em>Stress</em></strong>! <strong><em>CVaR</em></strong>!</p>
      <p><strong><em>Yang</em></strong> <em>tidak</em> <strong><em>terbayangkan</em></strong> = <strong><em>terjadi</em></strong>.</p>
      <h3>📖 Esai: Kesabaran dalam Evaluasi</h3>
      <p><strong><em>Evaluasi</em></strong> <em>butuh</em> <strong><em>waktu</em></strong>. <strong><em>1 tahun</em></strong> = <strong><em>noise</em></strong>. <strong><em>3 tahun</em></strong> = <strong><em>awal</em></strong>. <strong><em>5 tahun</em></strong> = <strong><em>minimum</em></strong>. <strong><em>Jangan</em></strong> <em>pecat</em> <strong><em>cepat</em></strong>. <strong><em>Jangan</em></strong> <em>hire</em> <strong><em>cepat</em></strong>.</p>
      <p><strong><em>Kesabaran</em></strong> = <strong><em>kebijaksanaan</em></strong>.</p>
      <h3>📖 Esai Final: Kebijaksanaan Metrik</h3>
      <p><strong><em>Angka</em></strong> = <strong><em>alat</em></strong>. <strong><em>Kebijaksanaan</em></strong> = <strong><em>pengguna</em></strong>. <strong><em>Alat</em></strong> <em>baik</em> + <strong><em>pengguna</em></strong> <em>bodoh</em> = <strong><em>bencana</em></strong>. <strong><em>Alat</em></strong> <em>sederhana</em> + <strong><em>pengguna</em></strong> <em>bijak</em> = <strong><em>sukses</em></strong>.</p>
      <p><strong><em>Jadilah</em></strong> <em>bijak</em>.</p>
      <h3>🌟 Penutup Final</h3>
      <p><strong><em>Lihat</em></strong> <strong><em>semua</em></strong>. <strong><em>Jangan</em></strong> <em>buta</em>.</p>
      <h3>📖 Pendalaman Mendalam</h3>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      <p><strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>. <strong><em>Konsep</em></strong> ini <strong><em>sangat</em></strong> <strong><em>penting</em></strong> untuk <strong><em>dikuasai</em></strong> secara <strong><em>mendalam</em></strong> oleh setiap <strong><em>praktisi</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Sharpe 2,0 = investasi hebat. Masuk besar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Short-vol: Sharpe 2,0 → bangkrut −40%.</strong> Sharpe <strong>buta skew</strong>. Cek: skew? MaxDD? CVaR? <strong>Satu metrik = satu kebohongan.</strong> Paket lengkap atau tidak sama sekali.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR 95% Rp200jt = kerugian maksimal Rp200jt.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Salah kaprah #1!</strong> VaR = 'di 95% hari <em>normal</em>'. 5% terburuk <strong>bisa jauh lebih dalam</strong> (itulah CVaR!). VaR tanpa CVaR + stress test = <strong>rasa aman palsu</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas = risiko.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>Drawdown</em></strong>! <strong><em>Ekor</em></strong>! <strong><em>Permanen</em></strong>!</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR = cukup.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>CVaR</em></strong>! <strong><em>Stress</em></strong>!</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Tampilkan paket 5: Sharpe, skew, MaxDD, CVaR, stress.</strong> Satu halaman risk report. Jika ada yang menolak tampilkan salah satunya — <strong>tanyakan kenapa</strong>.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Hafal asimetri recovery.</strong> −10%→+11%, −20%→+25%, −50%→+100%, −80%→+400%. Tulis di dinding. <strong>Pertahanan &gt; serangan.</strong></strong></p>
</div>

<div className="tip">
<p><strong>💡 Ritual metrik:</strong> (1) <strong><em>Sharpe</em></strong>! (2) <strong><em>Skew</em></strong>! (3) <strong><em>DD</em></strong>! (4) <strong><em>CVaR</em></strong>! <strong><em>Empat</em></strong> atau <strong><em>buta</em></strong>.</p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Metrik Lengkap</h2>
<p>Hitung Sharpe, Sortino, MaxDD, Calmar dari return bulanan.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Metrik"}
  hint={"Ubah SKEW_CRASH True → False (tanpa crash). Sharpe mirip, MaxDD beda jauh — metrik butuh paket!"}
  defaultCode={"# Kalkulator metrik: Sharpe, Sortino, MaxDD, Calmar\nimport math, random\nrandom.seed(21)\nSKEW_CRASH = True   # ubah ke False!\nrets = [random.gauss(0.012, 0.03) for _ in range(59)]\nrets.append(-0.40 if SKEW_CRASH else 0.01)\n\nn = len(rets)\nmean = sum(rets)/n\nsd = math.sqrt(sum((r-mean)**2 for r in rets)/(n-1))\ndown = [r for r in rets if r < 0]\ndsd = math.sqrt(sum(r**2 for r in down)/len(down))\nsharpe = mean/sd*math.sqrt(12)\nsortino = mean/dsd*math.sqrt(12)\n# max drawdown\npek, mdd, nav, peak_nav = 1.0, 0.0, 1.0, 1.0\nfor r in rets:\n    nav *= 1+r; pek = max(pek, nav); mdd = min(mdd, nav/pek-1)\ncalmar = (mean*12)/abs(mdd)\n\nprint(f\"Sharpe : {sharpe:.2f}   Sortino: {sortino:.2f}\")\nprint(f\"MaxDD  : {mdd:.0%}   Calmar : {calmar:.2f}\")\nprint()\nprint(\"Crash:\", SKEW_CRASH)\nprint(\"Sharpe mirip, MaxDD beda jauh -> SATU metrik menipu!\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator VaR & CVaR</h2>
<p>Hitung VaR 95% dan CVaR historis dari return harian.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator VaR/CVaR"}
  hint={"Ubah NILAI 10000 → 50000 (Rp jt). VaR/CVaR skala linear — risiko proporsional!"}
  defaultCode={"# VaR & CVaR historis\nimport random\nrandom.seed(33)\nNILAI = 10000   # Rp jt (ubah!)\nrets = sorted([random.gauss(0.0005, 0.015) for _ in range(1000)])\n\nidx = int(0.05*1000)\nvar = -rets[idx]\nekor = rets[:idx]\ncvar = -sum(ekor)/len(ekor)\n\nprint(f\"VaR 95% : {var:.2%} = Rp{var*NILAI:.0f}jt\")\nprint(f\"CVaR 95%: {cvar:.2%} = Rp{cvar*NILAI:.0f}jt\")\nprint()\nprint(\"VaR: 95% hari rugi <= ini. BUKAN rugi maksimal!\")\nprint(\"CVaR: rata-rata rugi di 5% hari terburuk.\")\nprint(\"Keduanya buta di luar histori -> tambah STRESS TEST.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Factsheet / evaluasi → <strong>Paket 5 metrik</strong></h3>
<p><strong>Kenapa:</strong> Satu metrik menipu.</p>
<p><strong>Contoh nyata:</strong> Sharpe+skew+MaxDD+CVaR+stress.</p>
</div>
<div className="decision-card">
<h3>2. Limit harian trading → <strong>VaR 95%</strong></h3>
<p><strong>Kenapa:</strong> Operasional.</p>
<p><strong>Contoh nyata:</strong> Desk limit.</p>
</div>
<div className="decision-card">
<h3>3. Alokasi modal / ekor → <strong>CVaR + stress test</strong></h3>
<p><strong>Kenapa:</strong> Jujur tentang bencana.</p>
<p><strong>Contoh nyata:</strong> PM-D6.</p>
</div>
<div className="decision-card">
<h3>4. Retensi investor → <strong>Komunikasikan MaxDD ekspektasi</strong></h3>
<p><strong>Kenapa:</strong> Psikologi &gt; matematika.</p>
<p><strong>Contoh nyata:</strong> IPS (PM-C1).</p>
</div>
<div className="decision-card">
<h3>5. Metrik → <strong>Sharpe + skew + DD + CVaR; jangan satu</strong></h3>
<p><strong>Kenapa:</strong> Sharpe buta ekor; short-vol = receh di rel kereta.</p>
<p><strong>Contoh nyata:</strong> Sharpe 2,0 → −40% sebulan.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Paket</strong>, bukan satu metrik.</li><li><strong>Skew</strong> selalu dicek.</li><li><strong>CVaR</strong> &gt; VaR untuk ekor.</li><li><strong>Stress</strong> melengkapi histori.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Hedge Fund yang Bangkrut</h2>
<div className="callout">
<p>Sharpe 2,0 (5 tahun) → −40% sebulan → tutup. Strategi: short-vol (skew −3).</p>
<p><strong>Vignette lanjutan.</strong> <em>Hedge fund</em>: <em>Sharpe</em> <strong>2,0</strong> (5 tahun!)! <em>Investor</em> <strong><em>antre</em></strong>. <em>Sebulan</em> kemudian: <strong>&minus;40%</strong>! <strong><em>Tutup</em></strong>! <em>Strategi</em>: <strong><em>short-vol</em></strong> (<em>skew</em> <strong>&minus;3</strong>!). <em>Untung</em> <em>kecil</em> <em>rutin</em> + <em>ekor</em> <strong><em>fatal</em></strong>.</p>
<p><strong>Pertanyaan:</strong> (a) Mengapa Sharpe menipu? (b) Metrik apa yang menangkap? (c) Sistem due diligence? (d) Jika <em>skew</em> &minus;3 &mdash; <em>investasi</em>? (e) <em>Hitung</em> <em>probabilitas</em> &minus;40% jika <em>normal</em>?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Sharpe buta skew</strong>: untung kecil rutin (σ kecil!) + ekor kiri fatal. Short-vol = <strong>mengumpulkan receh di rel kereta</strong>.</p>
<p>(d) <strong><em>Tidak</em></strong>! &mdash; <em>skew</em> <strong>&minus;3</strong> = <strong><em>lampu merah</em></strong>! <strong><em>Tolak</em></strong>!</p>
<p>(e) <strong><em>Hampir</em> nol</strong>! &mdash; <em>normal</em> <strong><em>tidak</em></strong> <em>prediksi</em> &minus;40%! <strong><em>Fat-tail</em></strong> = <em>nyata</em>!</p>
<p>(b) <strong>Skew −3</strong> (lampu oli!) + <strong>CVaR</strong> + <strong>stress test</strong> ('bagaimana jika vol meledak 3x?').</p>
<p>(c) <strong>Paket 5 wajib</strong> + <strong>wawancara strategi</strong> ('dari mana return berasal?') + <strong>batas skew</strong> di IPS.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Metrik Lanjut</h2>
      <h3>1. Omega ratio</h3>
      <p><strong><em>Semua</em></strong> <em>momen</em>! <strong><em>Lebih</em></strong> <em>lengkap</em>!</p>
      <h3>2. Tail risk</h3>
      <p><strong><em>Expected shortfall</em></strong>! <strong><em>Stress</em></strong>!</p>
      <h3>3. Risk-adjusted <em>across</em></h3>
      <p><strong><em>Bandingkan</em></strong> <em>apel</em> vs <em>apel</em>!</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Sharpe kilat</h3>
      <p>Rp 12%, Rf 3%, &sigma; 15%. <em>Sharpe</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><strong>0,6</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Drawdown kilat</h3>
      <p>100 &rarr; 150 &rarr; 90. <em>Max DD</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>&minus;40%</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; VaR kilat</h3>
      <p>10M, &sigma; 1%. <em>VaR</em> 95%?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>Rp164jt</strong>.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Sharpe 2,0 = aman.&rdquo; <em>Benar</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>SALAH.</strong> <em>Cek</em> skew!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Sharpe 2,0, skew −3. Verdict?"}
  options={
    ["Hebat",
    "Bahaya: bom waktu short-vol — tolak",
    "Lumayan",
    "Masuk"]
  }
  correct={1}
  explanation={"Benar: Sharpe buta ekor. Skew −3 = lampu oli menyala. Cek CVaR + stress!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. VaR 95% Rp200jt artinya?"}
  options={
    ["Rugi maksimal Rp200jt",
    "95% hari normal rugi ≤ Rp200jt (5% bisa lebih dalam!)",
    "Untung minimal",
    "Tidak ada arti"]
  }
  correct={1}
  explanation={"Benar: salah kaprah #1 = baca VaR sebagai maksimal. Itulah gunanya CVaR."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Portofolio −50%. Butuh berapa untuk pulih?"}
  options={
    ["+50%",
    "+100%",
    "+25%",
    "+200%"]
  }
  correct={1}
  explanation={"Benar: asimetri brutal. −80% → +400% (mustahil). Hindari rugi besar!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Sortino vs Sharpe: bedanya?"}
  options={
    ["Sama",
    "Sortino: penyebut downside deviation (risiko buruk saja)",
    "Sortino lebih kecil",
    "Tidak ada"]
  }
  correct={1}
  explanation={"Benar: volatilitas ke atas bukan 'risiko'. Sortino menghukum yang benar."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Paket risk report minimal?"}
  options={
    ["Sharpe saja",
    "Sharpe + skew + MaxDD + CVaR + stress",
    "Return saja",
    "VaR saja"]
  }
  correct={1}
  explanation={"Benar: satu metrik = satu kebohongan. Lima = panel dashboard lengkap."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Fund Sharpe 2,0 (5 tahun) → −40% sebulan. Strategi short-vol (skew −3). Pelajaran?"}
  options={
    ["Sial — tidak bisa diprediksi",
    "Sharpe buta skew! Cek skew + CVaR + stress",
    "Sharpe salah hitung",
    "Volatilitas terlalu rendah"]}
  correct={1}
  explanation={"Benar: Sharpe buta ekor. Skew −3 = lampu merah. Selalu cek skew, CVaR, stress test."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Sharpe</strong>: return/σ; <strong>buta skew</strong>.</li>
<li><strong>Sortino</strong>: downside deviation; <strong>Calmar</strong>: return/MaxDD.</li>
<li><strong>Drawdown</strong>: MaxDD + underwater + asimetri recovery.</li>
<li><strong>VaR</strong>: 95% normal; <strong>CVaR</strong>: rata-rata 5% terburuk.</li>
<li><strong>Paket 5</strong>: Sharpe, skew, MaxDD, CVaR, stress.</li>
<li><strong>Aturan</strong>: satu metrik menipu; pertahanan &gt; serangan.</li>

<li><strong>Riskadj:</strong> Sharpe + skew + Sortino.</li>
<li><strong>DD:</strong> max; Calmar; recovery.</li>
<li><strong>VaR:</strong> CVaR wajib; stress.</li>
<li><strong>Kapan TIDAK pakai:</strong> satu metrik; abaikan skew; VaR saja.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-d4-backtesting" className="btn btn-secondary btn-sm">← PM-D4</Link>
        <Link href="/learn/pm-d6-risk-reporting" className="btn btn-primary btn-sm">PM-D6 →</Link>
      </div>
    </div>
  );
}

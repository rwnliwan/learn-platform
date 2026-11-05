"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmD1DataHargaPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-D1 — Portfolio Management</span>
        <h1 className="display-title">Data & Harga:<br/>Fondasi yang Jujur</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Saham yang 'Naik' 500% dalam Sehari</a></li>
<li><a href="#adjust">Adjusted Price</a></li>
<li><a href="#survivor">Survivorship Bias</a></li>
<li><a href="#cleaning">Data Cleaning</a></li>
<li><a href="#sintesis">Sintesis: Fondasi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: XYZ +500%</a></li>
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
<li>Menjelaskan mengapa harga harus di-adjust (split, dividen).</li>
<li>Menghitung penyesuaian corporate action.</li>
<li>Menjelaskan survivorship bias dan dampaknya.</li>
<li>Membersihkan data: stale price, delisting, missing.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Saham yang 'Naik' 500% dalam Sehari</h2>
      <div className="story">
        <p><strong>2019</strong>: screener saham menampilkan <strong>XYZ +500%</strong> sehari! Junior analis berteriak <em>'breakout!'</em> — senior tersenyum: <strong>reverse split 1:5</strong>. Harga 'naik' 5x, nilai <strong>tetap</strong>. Yang beli di 'breakout' = <strong>tertipu data mentah</strong>.</p>
<p>Twist-nya: <strong>80% 'anomali' di backtest</strong> = artefak data (split tak ter-adjust, saham delisted hilang, harga basi). <strong>Analisis canggih di atas data kotor = kebohongan presisi.</strong> Lesson ini: fondasi sebelum menara.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="adjust">Adjusted Price — Harga yang Jujur</h2>
<p><strong>Definisi.</strong> <strong>Harga unadjusted</strong> = harga <em>tercatat</em> (menipu saat corporate action!). <strong>Adjusted</strong> = disesuaikan <em>mundur</em> untuk split &amp; dividen → <strong>return benar</strong>. <strong>Stock split</strong> 2:1: harga ÷2, jumlah saham ×2 (nilai tetap!). <strong>Dividen</strong>: harga turun ≈ dividen di ex-date → adjust <em>naik</em> histori.</p>
<p><strong>Aturan</strong>: <em>selalu</em> pakai adjusted untuk return; unadjusted hanya untuk <em>level</em> (support/resistance).</p>
<Tex math={String.raw`P^{adj}_{t-1} = P_{t-1} \times \frac{P_t - D}{P_t} \quad (dividen)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>Split 2:1: semua harga sebelum split dibagi 2</li>
<li>Dividen Rp100, harga Rp1.000 → faktor 0,9</li>
<li>Return = dari harga ADJUSTED — bukan unadjusted!</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Adjusted price seperti <strong>foto dengan koreksi inflasi</strong>: Rp1.000 tahun 2000 ≠ Rp1.000 kini. Split = <strong>pecah uang Rp100rb jadi 2×Rp50rb</strong> — 'harganya turun' tapi kantong sama. Data mentah = <strong>menukar pecahan dikira rugi</strong>.</p>
<p><strong>Kapan dipakai:</strong> Setiap perhitungan return, backtest, valuasi historis.</p>
<p><strong>Pendalaman intuisi &mdash; data mentah = &ldquo;musuh pertama&rdquo;.</strong> XYZ +500% sehari &rarr; &ldquo;breakout!&rdquo; &rarr; ternyata <em>reverse split</em> 1:5! <strong>80% &ldquo;anomali&rdquo; = <em>artefak data</em></strong> (corporate action! <em>stale price</em>! <em>survivorship</em>!). <strong>Aturan:</strong> <strong><em>curiga dulu</em>, <em>kagum</em> kemudian.</strong> <em>Screener</em> pakai <em>adjusted</em>! <em>Alert</em> corporate action! <strong>Data kotor = <em>keputusan</em> kotor.</strong></p><details className="worked">
<summary>📐 Contoh: Jebakan XYZ (klik untuk buka)</summary>
<p>XYZ: Rp10.000 → reverse split 1:5 → tercatat <strong>Rp50.000</strong> ('+400%'!).</p>
<p><strong>Unadjusted</strong>: return +400% (salah!). <strong>Adjusted</strong>: harga lama ÷5 = Rp2.000 → Rp50.000... tunggu — reverse split: harga lama Rp10.000 ×5 = <strong>Rp50.000 adjusted</strong> → return <strong>0%</strong> ✓.</p>
<p><strong>Screener</strong> tanpa adjust = daftar 'breakout' palsu. <strong>Selalu verifikasi corporate action</strong> sebelum euforia.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Stock split &mdash; adjust</summary>
<p><strong>Soal:</strong> saham @10.000, <em>split</em> 2:1. Harga jadi 5.000. Return?</p>
<p><strong>Mentah:</strong> (5.000&minus;10.000)/10.000 = <strong>&minus;50%</strong>! (<em>Salah</em>!)</p>
<p><strong><em>Adjusted</em>:</strong> 10.000 &rarr; 5.000&times;2 = 10.000 &rarr; <strong>0%</strong>! (&check;)</p>
<p><strong>Pelajaran:</strong> <strong><em>selalu</em> pakai <em>adjusted</em>!</strong> <em>Mentah</em> = <em>menyesatkan</em>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Dividen &mdash; total return</summary>
<p><strong>Soal:</strong> beli @100, jual @105, dividen 5. Return <em>harga</em> vs <em>total</em>?</p>
<p><strong><em>Harga</em>:</strong> 5%.</p>
<p><strong><em>Total</em>:</strong> (105+5&minus;100)/100 = <strong>10%</strong>!</p>
<p><strong>Pelajaran:</strong> <strong><em>dividen</em> = <em>return</em>!</strong> <em>Abaikan</em> = <em>setengah</em> cerita. <strong><em>Total return</em></strong> = <em>standar</em>.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Reverse split (kasus XYZ)</summary>
<p><strong>Soal:</strong> XYZ @10.000 &rarr; <em>reverse split</em> 1:5 &rarr; @50.000. <em>Screener</em> bilang +400%! Benar?</p>
<p><strong><em>Adjusted</em>:</strong> 10.000&times;5 = 50.000 &rarr; <strong>0%</strong>!</p>
<p><strong>Pelajaran:</strong> <strong><em>reverse split</em> = <em>jebakan</em> screener!</strong> <strong><em>Ritual</em>:</strong> lompatan &gt; 20%? &rarr; <strong><em>cek</em> corporate action!</strong></p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Data = kebenaran&rdquo;.</strong> <strong>SALAH.</strong> <em>Data</em> = <em>artefak</em> + <em>kebenaran</em>! <strong><em>Curiga</em> dulu!</strong></p>
</div>
<PlotlyChart
  data={[{x: ["Jan","Feb","Mar","Apr","Mei"], y: [10000,10200,10100,50000,50500], type: "scatter", mode: "lines+markers", marker: {color: "#94a3b8"}, name: "unadjusted"}, {x: ["Jan","Feb","Mar","Apr","Mei"], y: [2000,2040,2020,10000,10100], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "adjusted (split 1:5 di Apr)"}]}
  title={"Unadjusted vs adjusted: reverse split 1:5"}
  layout={{xaxis: {title: "Bulan"}, yaxis: {title: "Rp"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Abu = unadjusted (lompat); biru = adjusted (mulus).</p>
<p><strong>Interpretasi:</strong> Unadjusted <strong>melompat 5x</strong> di April — ilusi +400%. Adjusted <strong>mulus</strong>: return sebenarnya +1%. <strong>Setiap lompatan vertikal</strong> di chart = curigai corporate action dulu, rayakan kemudian.</p>
</div>

<PlotlyChart
  data={[{x: ["Mentah (+400%)", "Adjusted (0%)"], y: [400, 0], type: "bar", marker: {color: ["#d62728", "#2ca02c"]}, name: "Return (%)"}]}
  title={"Reverse split: mentah vs adjusted"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Return (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua batang = return <em>mentah</em> vs <em>adjusted</em>.</p>
<p><strong>Interpretasi:</strong> <strong><em>jurang</em>!</strong> +400% vs 0%! <strong><em>Mentah</em> = <em>bohong</em>.</strong> <strong><em>Selalu</em> adjusted!</strong></p>
</div>
<h2 id="survivor">Survivorship Bias — Kuburan yang Hilang</h2>
<p><strong>Definisi.</strong> <strong>Survivorship bias</strong>: database hanya berisi saham <em>yang masih hidup</em> → return historis <strong>terlihat lebih tinggi</strong> (yang bangkrut 'dihapus'!). <strong>Dampak</strong>: bias <strong>2–4%/tahun</strong> untuk strategi saham!</p>
<p><strong>Obat</strong>: database <em>point-in-time</em> (termasuk delisted), atau <strong>diskon mental</strong> hasil backtest.</p>
<p><strong>Kepribadian/intuisi:</strong> Survivorship bias seperti <strong>menilai sekolah dari alumninya yang sukses</strong> — yang DO tidak diundang reuni! 'Lulusan kami 90% sukses' = <strong>karena yang gagal tidak dihitung</strong>. Database saham = reuni tanpa yang bangkrut.</p>
<p><strong>Kapan dipakai:</strong> Setiap backtest & studi 'anomali pasar'.</p>
<p><strong>Pendalaman intuisi &mdash; survivorship bias = &ldquo;kuburan yang hilang&rdquo;.</strong> Studi &ldquo;rata-rata return saham&rdquo; = <strong><em>hanya</em> yang <em>bertahan</em></strong>! Yang <em>bangkrut</em> (<em>delisted</em>!) = <em>hilang</em> dari data! <strong>Hasil:</strong> return <em>terlihat</em> 12%, <em>sebenarnya</em> 8%! <strong><em>Bias</em> = 4 poin!</strong> <strong>Solusi:</strong> <em>point-in-time</em> database (termasuk <em>yang mati</em>!)! <strong><em>Tanya</em>: &ldquo;yang <em>gagal</em> di mana?&rdquo;</strong></p><details className="worked">
<summary>📐 Contoh: Strategi 'hebat' (klik untuk buka)</summary>
<p>Backtest 2010–2020 saham IDX: return <strong>18%/tahun</strong>! Due diligence: database <em>tanpa</em> 40 saham delisted (mayoritas −100%).</p>
<p><strong>Dengan delisted</strong>: return <strong>13%</strong>. Selisih <strong>5 poin = kuburan</strong>.</p>
<p><strong>Aturan</strong>: tanya vendor data — 'apakah termasuk delisted?' Jika tidak → <strong>kurangi 2–4%</strong> dari hasil, atau <strong>tolak</strong>.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Survivorship &mdash; angka</summary>
<p><strong>Soal:</strong> 100 saham 2000. 2020: 70 bertahan (rata-rata +10%/tahun), 30 <em>delisted</em> (&minus;100%!). Berapa &ldquo;rata-rata&rdquo; <em>dilaporkan</em> vs <em>sebenarnya</em>?</p>
<p><strong><em>Dilaporkan</em>:</strong> <strong>+10%</strong> (hanya yang bertahan!).</p>
<p><strong><em>Sebenarnya</em>:</strong> (70&times;10% + 30&times;(&minus;100%))/100 &rarr; <strong><em>jauh</em> lebih rendah</strong>! (geometris &asymp; <strong>+2&ndash;3%</strong>!).</p>
<p><strong><em>Bias</em> = 7&ndash;8 poin!</strong> &mdash; <strong><em>masif</em></strong>! <strong><em>Solusi</em>:</strong> <em>point-in-time</em>!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Look-ahead bias</summary>
<p><strong>Soal:</strong> <em>backtest</em> pakai <em>konstituen</em> indeks <em>kini</em> (2024) untuk 2010&ndash;2024. Masalah?</p>
<p><strong><em>Look-ahead</em>!</strong> &mdash; 2024 <em>konstituen</em> = <em>pemenang</em>! Yang <em>keluar</em> (kalah!) = <em>hilang</em>!</p>
<p><strong>Hasil:</strong> <em>backtest</em> <strong><em>terlalu bagus</em></strong>! <strong><em>Solusi</em>:</strong> <em>konstituen</em> historis (<em>point-in-time</em>!)!</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; <em>Backtest</em> tanpa <em>point-in-time</em>.</strong> <strong><em>Bias</em>!</strong> <em>Hasil</em> = <em>terlalu bagus</em>! <strong><em>Tanya</em>: data <em>point-in-time</em>?</strong></p>
</div>
<h2 id="cleaning">Cleaning — Stale, Missing, Sinkron</h2>
<p><strong>Definisi.</strong> <strong>Stale price</strong>: harga tidak bergerak berhari-hari (tidak likuid!) → volatilitas <em>understated</em>. <strong>Missing data</strong>: libur beda negara, suspensi. <strong>Sinkronisasi</strong>: pasar tutup beda jam (IDX vs NYSE!) → return 'harian' tidak sebanding.</p>
<p><strong>Aturan</strong>: drop/flag stale &gt; 5 hari; forward-fill <em>hati-hati</em> (bukan untuk return!); samakan <em>timestamp</em> zona waktu.</p>
<p><strong>Kepribadian/intuisi:</strong> Data kotor seperti <strong>bahan masakan basi</strong>: resep (model) Michelin pun menghasilkan <strong>keracunan</strong> (keputusan salah). 80% kerja analis = <strong>memilah bahan</strong>; 20% = memasak. Junior ingin langsung masak; senior <strong>cium dulu bahannya</strong>.</p>
<p><strong>Kapan dipakai:</strong> Sebelum analisis APAPUN: EDA + quality check dulu.</p>
<p><strong>Pendalaman intuisi &mdash; cleaning = &ldquo;80% pekerjaan&rdquo;.</strong> <em>Data science</em>: 80% waktu = <em>cleaning</em>! <strong><em>Corporate actions</em></strong> (<em>split</em>! <em>dividen</em>! <em>rights</em>!)! <strong><em>Stale</em></strong> (<em>tidak</em> diperdagangkan!)! <strong><em>Outlier</em></strong> (<em>salah ketik</em>? <em>nyata</em>?)! <strong><em>Timezone</em></strong>! <strong><em>Mata uang</em></strong>! <strong>Tanpa <em>cleaning</em></strong> = <em>sampah</em> masuk, <em>sampah</em> keluar. <strong><em>Investasi</em> di data = <em>investasi</em> di kebenaran.</strong></p><details className="worked">
<summary>📐 Contoh: Stale price (klik untuk buka)</summary>
<p>Saham gorengan: harga Rp500 <strong>tidak bergerak 20 hari</strong> → volatilitas terhitung <strong>2%</strong> ('aman!').</p>
<p><strong>Realita</strong>: tidak ada transaksi (tidak likuid!) → saat ada, lompat <strong>±30%</strong> (ARB/ARA!). Vol '2%' = <strong>fatamorgana</strong>.</p>
<p><strong>Check</strong>: hitung <strong>% hari nol-volume</strong>; jika &gt; 20% → <strong>exclude</strong> dari analisis risiko. Likuiditas = prasyarat statistik.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Stale price</summary>
<p><strong>Soal:</strong> saham <em>tidak</em> diperdagangkan 3 hari. Harga &ldquo;tetap&rdquo;. <em>Return</em> 0%? <em>Vol</em> rendah?</p>
<p><strong><em>Salah</em>!</strong> &mdash; <em>harga</em> = <em>basi</em>! (<em>tidak</em> diperbarui!). <strong><em>Vol</em> <em>terlihat</em> rendah</strong> = <em>ilusi</em>!</p>
<p><strong><em>Solusi</em>:</strong> <em>filter</em> (<em>volume</em> = 0 &rarr; <em>buang</em>!)! <strong><em>Illiquid</em> = <em>data</em> buruk.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Outlier &mdash; salah ketik vs nyata</summary>
<p><strong>Soal:</strong> harga: 100, 101, 1000, 102. <em>Outlier</em>? <em>Buang</em>?</p>
<p><strong><em>Investigasi</em>:</strong> 1000 = <strong><em>salah ketik</em></strong>? (100?) atau <strong><em>nyata</em></strong> (<em>flash crash</em>?).</p>
<p><strong><em>Jangan</em> asal buang!</strong> &mdash; <em>cek</em>! <strong><em>Aturan</em>:</strong> <em>dokumentasikan</em>! <strong><em>Transparan</em></strong>!</p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Fondasi Jujur</h2>
      <p>Adjust, survivorship, cleaning = <strong>satu fondasi</strong>:</p>
      <ol>
        <li><strong>ADJUST:</strong> <em>corporate actions</em> &mdash; <strong><em>total return</em></strong>!</li>
        <li><strong>SURVIVOR:</strong> <em>point-in-time</em> &mdash; <strong><em>jangan</em> hilang</strong>!</li>
        <li><strong>CLEAN:</strong> <em>curiga</em> &mdash; <strong><em>verifikasi</em></strong>!</li>
      </ol>
      <p><strong><em>Data</em> jujur = <em>keputusan</em> jujur.</strong></p>

      <h3>🎙️ Debat: &ldquo;Data gratis = cukup&rdquo;</h3>
      <p><strong>Hemat:</strong> &ldquo;Yahoo <em>gratis</em>! <em>Cukup</em>!&rdquo;</p>
      <p><strong>Pro:</strong> &ldquo;<strong><em>Gratis</em> = <em>kotor</em></strong>! <em>Survivorship</em>! <em>Stale</em>! <strong><em>Bayar</em> untuk <em>kebenaran</em>.</strong>&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>sesuai</em> kebutuhan</strong>. <em>Belajar</em> = gratis <em>boleh</em>. <em>Uang</em> = <em>bayar</em>.</p>
      <h3>🧪 Eksperimen: Audit datamu</h3>
      <p><strong><em>Cek</em>:</strong> <em>adjusted</em>? <em>point-in-time</em>? <strong><em>Jika</em> tidak &rarr; <em>perbaiki</em>!</strong></p>
      <h3>📰 Studi Kasus: LTCM &amp; Data</h3>
      <p><strong><em>Data</em> tenang</strong> (1990-an!) &rarr; <em>model</em> rapuh! <strong><em>Regime</em></strong>!</p>
      <h3>📊 Data Corner: Biaya Data</h3>
      <p><strong>Bloomberg:</strong> $25rb/tahun! <strong>Yahoo:</strong> <em>gratis</em>! <strong><em>Value</em></strong>? <em>Tergantung</em>!</p>
      <h3>📖 Kamus Istilah</h3>
      <p><strong><em>Adjusted</em></strong>! <em>Survivorship</em>! <em>Point-in-time</em>! <em>Stale</em>! <strong>Hafalkan!</strong></p>
      <h3>💡 Prinsip Abadi Data</h3>
      <p><strong>(1) <em>Curiga</em> dulu.</strong> (2) <strong><em>Adjusted</em> selalu.</strong> (3) <strong><em>Point-in-time</em>.</strong> (4) <strong><em>Verifikasi</em>.</strong> (5) <strong><em>Dokumentasikan</em>.</strong></p>
      <h3>🎓 Ujian Akhir</h3>
      <p><strong>Q1:</strong> <em>Return</em> benar XYZ? <strong>Q2:</strong> <em>Bias</em> survivorship? <strong>Q3:</strong> <em>Ritual</em> 3 cek?</p>
      <p><strong>Lulus</strong> = 3/3.</p>
      <h3>🔗 Menghubungkan</h3>
      <p><strong>Ke PM-D4:</strong> <em>backtest</em> butuh <em>data bersih</em>! <strong>Ke PM-B1:</strong> <em>regresi</em> butuh <em>data jujur</em>!</p>
      <h3>🔬 Deep Dive Tambahan: Sumber Data</h3>
      <p><strong>Yahoo Finance:</strong> <em>gratis</em>! Tapi: <em>survivorship</em>! <em>stale</em>! <strong><em>Cukup</em> untuk <em>belajar</em>.</strong></p>
      <p><strong>Bloomberg:</strong> $25rb/tahun! <em>Point-in-time</em>! <em>Bersih</em>! <strong><em>Standar</em> institusi.</strong></p>
      <p><strong>CRSP:</strong> <em>akademis</em>! <em>Survivorship-free</em>! <strong><em>Emas</em> riset.</strong></p>
      <p><strong>Pilih:</strong> <strong><em>sesuai</em> kebutuhan &amp; <em>budget</em>.</strong></p>
      <h3>📊 Data Corner: Seberapa Kotor Yahoo?</h3>
      <p><strong>Studi:</strong> 5% <em>harga</em> Yahoo <em>salah</em>! (<em>split</em> belum adjust! <em>dividen</em> hilang!).</p>
      <p><strong>Implikasi:</strong> <strong><em>verifikasi</em>!</strong> <strong><em>Jangan</em> buta.</strong></p>
      <h3>🧪 Eksperimen: Bandingkan Vendor</h3>
      <p><strong><em>Ambil</em></strong> 1 saham. <strong><em>Bandingkan</em></strong> Yahoo vs Bloomberg. <strong><em>Beda</em>?</strong> &rarr; <strong><em>investigasi</em></strong>!</p>
      <h3>📰 Studi Kasus: Flash Crash &amp; Data</h3>
      <p><strong>2010:</strong> <em>tick</em> aneh! <strong><em>Filter</em></strong> atau <em>pelajaran</em>?</p>
      <p><strong><em>Konteks</em></strong> = <em>kunci</em>.</p>
      <h3>💡 Prinsip Abadi Data (Lengkap)</h3>
      <p><strong>(1) <em>Curiga</em>.</strong> (2) <strong><em>Adjusted</em>.</strong> (3) <strong><em>Point-in-time</em>.</strong> (4) <strong><em>Verifikasi</em>.</strong> (5) <strong><em>Dokumentasikan</em>.</strong> (6) <strong><em>Ulangi</em>.</strong></p>
      <h3>🎓 Ujian Akhir (Lengkap)</h3>
      <p><strong>Q1:</strong> <em>Return</em> XYZ? <strong>Q2:</strong> <em>Survivorship bias</em>? <strong>Q3:</strong> <em>Ritual</em>? <strong>Q4:</strong> <em>Look-ahead</em>?</p>
      <p><strong>Lulus</strong> = 4/4.</p>
      <h3>📋 Template Checklist Data (Siap Pakai)</h3>
      <p><strong>SEBELUM ANALISIS:</strong></p>
      <p>&square; <strong><em>Adjusted</em>?</strong> (split! dividen! rights!)</p>
      <p>&square; <strong><em>Point-in-time</em>?</strong> (survivorship! look-ahead!)</p>
      <p>&square; <strong><em>Stale</em>?</strong> (volume 0!)</p>
      <p>&square; <strong><em>Outlier</em>?</strong> (investigasi!)</p>
      <p>&square; <strong><em>Mata uang</em>?</strong> (konsisten!)</p>
      <p>&square; <strong><em>Timezone</em>?</strong> (sinkron!)</p>
      <p>&square; <strong><em>Total return</em>?</strong> (dividen!)</p>
      <p><strong>7 &square; = <em>aman</em>. <em>Salin</em>. <em>Pakai</em>.</strong></p>
      <h3>🎯 Studi Kasus Mini (Latihan)</h3>
      <p><strong>KASUS 1:</strong> <em>Screener</em> +300%. <em>Tindakan</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Curiga</em>! <em>Cek</em> CA!</strong></p>
      <p><strong>KASUS 2:</strong> <em>Backtest</em> 15% vs <em>live</em> 5%. <em>Kenapa</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Survivorship</em>! <em>Look-ahead</em>!</strong></p>
      <p><strong>KASUS 3:</strong> <em>Outlier</em> 1000 (lainnya ~100). <em>Buang</em>?</p>
      <p><strong>Jawab:</strong> <strong><em>Investigasi</em> dulu!</strong></p>
      <p><strong><em>Latihan</em> = <em>kebiasaan</em>.</strong></p>
      <h3>💬 Satu Nasihat</h3>
      <p><strong>&ldquo;<em>Curiga</em> dulu, <em>kagum</em> kemudian.&rdquo;</strong></p>
      <h3>🔗 Rantai Data (Ringkas)</h3>
      <p><strong>SUMBER</strong> (vendor!) &rarr; <strong>ADJUST</strong> (CA!) &rarr; <strong>CLEAN</strong> (curiga!) &rarr; <strong>VALIDATE</strong> (point-in-time!) &rarr; <strong>ANALISIS</strong> (aman!).</p>
      <p><strong><em>Rantai</em> kuat</strong> = <em>keputusan</em> kuat.</p>
      <h3>🏆 Analis Data Terbaik: Ciri-ciri</h3>
      <p><strong>(1) <em>Curiga</em></strong>! (2) <strong><em>Teliti</em></strong>! (3) <strong><em>Dokumentasikan</em></strong>! (4) <strong><em>Verifikasi</em></strong>!</p>
      <p><strong><em>Kembangkan</em></strong>!</p>
      <h3>🎙️ Debat: &ldquo;Data = objektif&rdquo;</h3>
      <p><strong>Naif:</strong> &ldquo;<em>Angka</em> tidak bohong!&rdquo;</p>
      <p><strong>Bijak:</strong> &ldquo;<strong><em>Angka</em> = <em>pilihan</em></strong>! <em>Adjusted</em>? <em>Point-in-time</em>? <strong><em>Pilihan</em> = <em>subjektif</em></strong>!&rdquo;</p>
      <p><strong>Putusan:</strong> <strong><em>transparan</em></strong> tentang <em>pilihan</em>.</p>
      <h3>📚 Bacaan Lanjutan</h3>
      <p><strong>Lopez de Prado:</strong> <em>Advances</em> &mdash; <em>data</em>! <strong>CRSP:</strong> <em>manual</em>!</p>
      <h3>❓ FAQ Data</h3>
      <p><strong>Q: <em>Gratis</em> vs <em>bayar</em>?</strong> A: <strong><em>Belajar</em> = gratis. <em>Uang</em> = bayar.</strong></p>
      <p><strong>Q: <em>Berapa</em> sering <em>bersihkan</em>?</strong> A: <strong><em>Selalu</em></strong>!</p>
      <p><strong>Q: <em>Outlier</em> = <em>peluang</em>?</strong> A: <strong><em>Kadang</em></strong>! <em>Investigasi</em>!</p>
      <h3>🔮 Masa Depan Data</h3>
      <p><strong><em>Alternative</em></strong>! <em>Real-time</em>! <em>AI</em> cleaning! <strong><em>Siap</em> = <em>belajar</em>.</strong></p>
      <h3>📝 Jurnal Data (Template)</h3>
      <p><strong>Sumber:</strong> ___ <strong><em>Adjusted</em>?</strong> ___ <strong><em>Point-in-time</em>?</strong> ___</p>
      <p><strong><em>Masalah</em>:</strong> ___ <strong><em>Solusi</em>:</strong> ___</p>
      <h3>🎯 Kuis Kilat (5 Soal)</h3>
      <p><strong>Q1:</strong> Split 2:1. Return <em>adjusted</em>? <strong>A:</strong> <strong>0%</strong>.</p>
      <p><strong>Q2:</strong> <em>Survivorship bias</em> = ? <strong>A:</strong> <strong>7&ndash;8 poin</strong>!</p>
      <p><strong>Q3:</strong> <em>Ritual</em> 3 cek? <strong>A:</strong> <strong>Lompatan? Stale? CA?</strong></p>
      <p><strong>Q4:</strong> <em>Look-ahead</em>? <strong>A:</strong> <strong><em>Konstituen</em> kini untuk <em>masa lalu</em></strong>!</p>
      <p><strong>Q5:</strong> <em>Outlier</em> &rarr; ? <strong>A:</strong> <strong><em>Investigasi</em></strong>!</p>
      <h3>💪 Latihan Praktik</h3>
      <p><strong><em>Audit</em></strong> datamu dengan <em>checklist</em> 7 &square;! <strong><em>Laporkan</em></strong> temuan!</p>
      <h3>🎖️ Level Penguasaan</h3>
      <p><strong>L1:</strong> <em>Tahu</em>. <strong>L2:</strong> <em>Bersihkan</em>. <strong>L3:</strong> <em>Ajarkan</em>. <strong>L4:</strong> <em>Otomatiskan</em>.</p>
      <h3>🌍 Data Indonesia: Tantangan Khusus</h3>
      <p>Pasar Indonesia punya <strong>tantangan data unik</strong>. <strong><em>Likuiditas</em></strong> rendah &rarr; banyak saham <em>stale</em> (tidak diperdagangkan berhari-hari!). <strong><em>Corporate actions</em></strong> sering &rarr; <em>rights issue</em>, <em>warant</em>, <em>dividen</em> saham! <strong><em>Data vendor</em></strong> lokal &rarr; <em>kualitas</em> bervariasi!</p>
      <p><strong>Implikasi praktis:</strong> <strong><em>jangan</em> asal pakai</strong> data IDX mentah! <strong><em>Filter</em></strong> saham <em>illiquid</em>! <strong><em>Adjust</em></strong> untuk <em>rights issue</em>! <strong><em>Verifikasi</em></strong> dengan <em>keterbukaan informasi</em>!</p>
      <p><strong>Contoh nyata:</strong> saham <em>lapis tiga</em> &ldquo;naik&rdquo; 25% &mdash; ternyata <strong><em>tidak</em> ada transaksi</strong> 2 minggu, harga = <em>stale</em>! <strong><em>Screener</em> tanpa filter</strong> = <em>jebakan</em>!</p>
      <p><strong>Aturan Indonesia:</strong> <strong><em>likuiditas minimum</em></strong> (mis. Rp1M/hari!). <strong><em>Adjusted</em> untuk <em>semua</em> CA.</strong> <strong><em>Curiga</em> pada <em>lapis tiga</em>.</strong></p>
      <h3>⚖️ Regulasi Data: IDX &amp; OJK</h3>
      <p><strong>IDX:</strong> <em>wajib</em> laporkan <em>corporate action</em>! <strong>OJK:</strong> <em>keterbukaan informasi</em>! <strong><em>Manfaatkan</em></strong>! <strong><em>Cross-check</em></strong>!</p>
      <p><strong><em>Data resmi</em></strong> = <em>lebih可信</em>. <strong><em>Tapi</em></strong> tetap <em>verifikasi</em>!</p>
      <h3>📖 Kisah Nyata: Quant yang Tertipu Data</h3>
      <p>Tahun 2018, sebuah <em>hedge fund</em> kecil meluncurkan strategi <em>momentum</em> berdasarkan <em>backtest</em> 10 tahun dengan <em>Sharpe</em> 2,5 &mdash; <strong>luar biasa</strong>! Mereka <em>raise</em> USD 50 juta. <strong>Live trading:</strong> <em>Sharpe</em> 0,2! <strong>Investor <em>kabur</em>.</strong> <em>Fund</em> <strong><em>tutup</em></strong> 18 bulan kemudian.</p>
      <p><strong>Autopsi:</strong> <em>backtest</em> pakai <strong><em>konstituen</em> indeks <em>kini</em></strong> (<em>look-ahead bias</em>!) + <strong><em>tanpa</em> adjust dividen</strong>! <em>Return</em> &ldquo;2,5&rdquo; = <strong><em>ilusi</em></strong>! <em>Realita</em> = 0,2!</p>
      <p><strong>Pelajaran:</strong> <strong><em>data</em> = <em>fondasi</em></strong>. <strong><em>Fondasi</em> retak</strong> = <em>gedung</em> runtuh. <strong><em>Audit</em> data</strong> = <em>asuransi</em> termurah.</p>
      <p><strong><em>Jangan</em></strong> jadi mereka. <strong><em>Checklist</em> 7 &square;.</strong> <strong><em>Selalu</em>.</strong></p>
      <h3>🤖 AI &amp; Data Cleaning</h3>
      <p><strong><em>Machine learning</em></strong> bisa <em>deteksi</em> anomali! <strong><em>Contoh</em>:</strong> <em>autoencoder</em> untuk <em>outlier</em>! <strong><em>Tapi</em>:</strong> <strong><em>manusia</em> tetap <em>putuskan</em></strong>! <strong><em>AI</em> = <em>asisten</em></strong>, bukan <em>pengganti</em>.</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>validasi</em></strong>! <strong><em>Jangan</em> buta.</strong></p>
      <h3>🌟 Penutup: Data = Kepercayaan</h3>
      <p><strong><em>Investor</em></strong> percaya <em>angka</em>. <strong><em>Angka</em></strong> harus <em>jujur</em>. <strong><em>Kejujuran</em></strong> = <em>kerja keras</em>.</p>
      <p><strong><em>Lakukan</em> kerja keras.</strong></p>
      <h3>📊 Data Corner: Statistik Kotor</h3>
      <p><strong>80%</strong> waktu <em>data science</em> = <em>cleaning</em>! <strong>5%</strong> harga Yahoo <em>salah</em>! <strong>7 poin</strong> <em>bias</em> survivorship! <strong><em>Angka</em> = <em>alasan</em>.</strong></p>
      <p><strong><em>Investasi</em></strong> di data = <em>ROI</em> tertinggi.</p>
      <h3>🧪 Eksperimen Lanjutan</h3>
      <p><strong><em>Buat</em></strong> <em>pipeline</em> cleaning! <strong><em>Otomatiskan</em></strong> 7 &square;! <strong><em>Test</em></strong>!</p>
      <h3>💬 Wawancara: Data Engineer</h3>
      <p><strong>Q: <em>Nasihat</em>?</strong> A: &ldquo;<strong><em>Curiga</em></strong>. <strong><em>Verifikasi</em></strong>. <strong><em>Dokumentasikan</em></strong>.&rdquo;</p>
      <p><strong><em>Dengarkan</em></strong> praktisi.</p>
      <h3>🎓 Ujian Akhir (Final)</h3>
      <p><strong>Q1:</strong> <em>Return</em> XYZ? <strong>Q2:</strong> <em>Bias</em>? <strong>Q3:</strong> <em>Ritual</em>? <strong>Q4:</strong> <em>Look-ahead</em>? <strong>Q5:</strong> <em>Outlier</em>?</p>
      <p><strong>Lulus</strong> = 5/5.</p>
      <h3>🔗 Menghubungkan (Lengkap)</h3>
      <p><strong>Ke PM-D4:</strong> <em>backtest</em> butuh <em>data bersih</em>! <strong>Ke PM-B1:</strong> <em>regresi</em> butuh <em>data jujur</em>! <strong>Ke PM-D5:</strong> <em>metrik</em> butuh <em>total return</em>!</p>
      <p><strong><em>Data</em></strong> = <em>fondasi</em> <strong><em>semua</em></strong>.</p>
      <h3>📜 Sumpah Data</h3>
      <p>&ldquo;Saya <em>berjanji</em>: <em>curiga</em> dulu. <em>Adjusted</em> selalu. <em>Point-in-time</em>. <em>Verifikasi</em>.&rdquo;</p>
      <p><strong><em>Ucapkan</em></strong>.</p>
      <h3>📖 Panduan Lengkap: Corporate Actions Indonesia</h3>
      <p>Indonesia punya <strong>ragam <em>corporate actions</em></strong> yang <em>wajib</em> di-adjust. <strong><em>Stock split</em></strong>: memecah saham (2:1, 5:1!). <em>Harga</em> turun <em>proporsional</em>. <strong><em>Reverse split</em></strong>: menggabung (1:5, 1:10!). <em>Harga</em> naik <em>proporsional</em>. <strong><em>Dividen tunai</em></strong>: mengurangi <em>harga</em> ex-date. <strong><em>Dividen saham</em></strong>: seperti <em>split</em> kecil. <strong><em>Rights issue</em></strong>: <em>kompleks</em>! <em>Harga</em> teoritis ex-rights = (harga lama &times; saham lama + harga rights &times; saham baru) / total saham. <strong><em>Waran</em></strong>: <em>dilusi</em> potensial!</p>
      <p><strong>Contoh rights issue:</strong> saham @1000, rights 1:1 @800. <em>Harga</em> ex-rights teoritis = (1000 + 800)/2 = <strong>900</strong>. <em>Jika</em> tidak adjust &rarr; <strong><em>terlihat</em> turun 10%</strong>! <em>Padahal</em> <strong>0%</strong> (pemegang dapat <em>rights</em>!).</p>
      <p><strong>Aturan praktis:</strong> <strong><em>selalu</em> cek</strong> <em>keterbukaan informasi</em> IDX! <strong><em>Gunakan</em></strong> <em>adjusted price</em> dari vendor! <strong><em>Verifikasi</em></strong> untuk <em>rights issue</em> (paling <em>tricky</em>!).</p>
      <p><strong><em>Rights issue</em></strong> = <em>jebakan</em> terbesar. <strong><em>Waspadalah</em>.</strong></p>
      <h3>📖 Panduan Lengkap: Membangun Database Point-in-Time</h3>
      <p><strong><em>Point-in-time</em></strong> berarti: data yang <em>tersedia</em> pada <em>waktu</em> itu. <strong><em>Contoh</em>:</strong> <em>backtest</em> 2015 &rarr; <em>pakai</em> data yang <em>diketahui</em> 2015! <strong><em>Bukan</em></strong> data <em>revisi</em> 2024!</p>
      <p><strong>Kenapa penting?</strong> <strong><em>Laporan keuangan</em></strong> direvisi! <strong><em>Konstituen</em></strong> indeks berubah! <strong><em>Rating</em></strong> di-update! <strong><em>Jika</em></strong> pakai <em>revisi</em> &rarr; <strong><em>look-ahead bias</em></strong>!</p>
      <p><strong>Cara membangun:</strong> (1) <strong><em>Snapshot</em></strong> berkala (harian!). (2) <strong><em>Simpan</em></strong> <em>as-of date</em>. (3) <strong><em>Query</em></strong> dengan <em>as-of</em> &le; <em>tanggal simulasi</em>. (4) <strong><em>Termasuk</em></strong> yang <em>delisted</em>!</p>
      <p><strong>Biaya:</strong> <strong><em>mahal</em></strong> (storage! kompleksitas!). <strong><em>Tapi</em></strong>: <strong><em>lebih murah</em></strong> dari <em>fund</em> yang <em>bangkrut</em>.</p>
      <p><strong><em>Tidak</em> ada <em>point-in-time</em></strong> = <strong><em>tidak</em> ada <em>backtest</em> valid.</strong></p>
      <h3>📖 Panduan Lengkap: Total Return vs Price Return</h3>
      <p><strong><em>Price return</em></strong> = (P1 &minus; P0) / P0. <strong><em>Hanya</em></strong> harga! <strong><em>Total return</em></strong> = (P1 &minus; P0 + D) / P0. <strong><em>Termasuk</em></strong> dividen!</p>
      <p><strong><em>Beda</em></strong> bisa <strong><em>besar</em></strong>! <em>Saham dividen</em> 5%: <em>price</em> 5%, <em>total</em> 10%! <strong><em>Setengah</em></strong> return <em>hilang</em> jika <em>abaikan</em>!</p>
      <p><strong><em>Standar</em> industri:</strong> <strong><em>total return</em></strong>! <strong><em>Indeks</em></strong> (S&amp;P 500 TR!). <strong><em>Benchmark</em></strong>! <strong><em>Evaluasi</em></strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>selalu</em></strong> pakai <em>total return</em>! <strong><em>Jika</em></strong> data <em>hanya</em> harga &rarr; <strong><em>tambahkan</em></strong> dividen!</p>
      <p><strong><em>Dividen</em></strong> = <em>uang</em>. <strong><em>Uang</em></strong> = <em>return</em>.</p>
      <h3>📖 Panduan Lengkap: Timezone &amp; Mata Uang</h3>
      <p><strong><em>Timezone</em>:</strong> <em>data</em> global = <em>zona</em> beda! <strong><em>Contoh</em>:</strong> <em>tutup</em> NYSE 04:00 WIB! <em>Tutup</em> IDX 15:00 WIB! <strong><em>Jika</em></strong> <em>digabung</em> tanpa <em>sinkron</em> &rarr; <strong><em>korelasi</em> salah</strong>!</p>
      <p><strong><em>Solusi</em>:</strong> <strong><em>konversi</em></strong> ke <em>UTC</em>! <strong><em>Dokumentasikan</em></strong>! <strong><em>Hati-hati</em></strong> dengan <em>daylight saving</em>!</p>
      <p><strong><em>Mata uang</em>:</strong> <em>return</em> USD vs IDR = <em>beda</em>! <strong><em>Contoh</em>:</strong> <em>saham</em> AS +10%, <em>IDR</em> melemah 5% &rarr; <em>return</em> IDR = <strong>+15,5%</strong>!</p>
      <p><strong><em>Aturan</em>:</strong> <strong><em>konsisten</em></strong>! <strong><em>Pilih</em></strong> satu <em>mata uang</em>! <strong><em>Konversi</em></strong> dengan <em>kurs</em> yang <em>tepat</em>!</p>
      <p><strong><em>Detail</em></strong> = <em>profesionalisme</em>.</p>
      <h3>🤝 Komunitas: Belajar Bersama</h3>
      <p><strong><em>Forum</em></strong>! <em>Meetup</em>! <strong><em>Berbagi</em></strong> pengalaman <em>data</em>! <strong><em>Belajar</em></strong> dari <em>kesalahan</em> orang!</p>
      <p><strong><em>Bersama</em></strong> = <em>lebih cepat</em>.</p>
      <h3>🌟 Penutup Akhir</h3>
      <p><strong><em>Data</em></strong> = <em>fondasi</em>. <strong><em>Fondasi</em></strong> = <em>kepercayaan</em>. <strong><em>Kepercayaan</em></strong> = <em>karier</em>.</p>
      <p><strong><em>Bangunlah</em> dengan <em>benar</em>.</strong></p>
      <h3>📖 Esai: Data adalah Tanggung Jawab</h3>
      <p><strong><em>Data</em></strong> = <strong><em>amanah</em></strong>. <strong><em>Amanah</em></strong> = <strong><em>jujur</em></strong>. <strong><em>Jujur</em></strong> = <strong><em>verifikasi</em></strong>.</p>
      <p><strong><em>Peganglah</em></strong> <em>amanah</em>.</p>
      <p><strong><em>Data</em></strong> <strong><em>jujur</em></strong> = <strong><em>keputusan</em></strong> <em>jujur</em>.</p>
      <h3>📖 Pendalaman Tambahan</h3>
      <p><strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>. <strong><em>Penting</em></strong> untuk <strong><em>memahami</em></strong> konsep ini dengan <strong><em>mendalam</em></strong> dan <strong><em>menerapkannya</em></strong> secara <strong><em>konsisten</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Data dari vendor mahal = pasti bersih. Langsung analisis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Tidak ada data bersih.</strong> Vendor pun punya stale, error split, missing delisted. <strong>Quality check</strong> (distribusi return, lompatan, stale) = ritual wajib <em>sebelum</em> analisis. Percaya tapi <strong>verifikasi</strong> — 30 menit EDA menghemat 3 bulan sesat.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Return dihitung dari harga penutupan biasa (unadjusted).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Corporate action membuat unadjusted <strong>menipu</strong> (XYZ +400% palsu!). <strong>Selalu adjusted</strong> untuk return. Unadjusted hanya untuk level harga (chart pattern). Salah pilih = <strong>semua angka downstream salah</strong>.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Data vendor = bersih.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>verifikasi</em>!</strong> <em>Vendor</em> = <em>manusia</em>! <strong><em>Trust, but verify</em>.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;<em>Outlier</em> = buang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong><em>investigasi</em>!</strong> <em>Salah ketik</em> = buang. <em>Nyata</em> = <em>pelajaran</em>!</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Ritual 3 cek sebelum analisis.</strong> (1) Plot harga — ada lompatan vertikal? (2) % hari stale/nol-volume. (3) Daftar corporate actions periode itu. 15 menit, selamatkan karir.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Tanya 1 kalimat ke vendor data.</strong> 'Apakah database ini point-in-time termasuk delisted?' Jawabannya menentukan apakah backtest-mu <strong>fakta atau fiksi</strong>.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Ritual 3 cek:</strong> (1) <strong><em>Lompatan</em>?</strong> (&gt;20% &rarr; cek CA!). (2) <strong><em>Stale</em>?</strong> (volume 0?). (3) <strong><em>Corporate action</em>?</strong> <strong><em>Curiga</em> = <em>kebiasaan</em>.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Adjust Harga untuk Split</h2>
<p>Praktik menyesuaikan harga historis untuk stock split.</p>
<PyodideLab
  title={"Lab 1 — Adjust Split"}
  hint={"Ubah RASIO 2 → 5 (split 1:5). Harga adjusted makin kecil — return tetap sama!"}
  defaultCode={"# Adjust harga untuk stock split\nharga = [10000, 10200, 10100, 10300]  # sebelum split\nRASIO = 2          # split 2:1 (ubah! 5 = 1:5)\nharga_setelah = 5150  # tercatat setelah split\n\nadj = [h / RASIO for h in harga]\nret_unadj = (harga_setelah - harga[-1]) / harga[-1]\nret_adj = (harga_setelah - adj[-1]) / adj[-1]\n\nprint(\"Harga adjusted:\", [f\"{h:.0f}\" for h in adj])\nprint(f\"Return UNADJUSTED: {ret_unadj:.0%} (menipu!)\")\nprint(f\"Return ADJUSTED  : {ret_adj:.1%} (benar)\")\nprint()\nprint(\"Split tidak menciptakan nilai - hanya pecah uang.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Demo Survivorship Bias</h2>
<p>Lihat bagaimana saham mati menggelembungkan return.</p>
<PyodideLab
  title={"Lab 2 — Demo Survivorship"}
  hint={"Ubah MATI 40 → 0 (tanpa delisted). Bias hilang — itulah dunia fiksi database!"}
  defaultCode={"# Survivorship bias: yang mati tidak tercatat\nimport random\nrandom.seed(42)\nHIDUP, MATI = 60, 40   # jumlah saham (ubah MATI!)\nret_hidup = [random.uniform(-0.2, 0.5) for _ in range(HIDUP)]\nret_mati = [-1.0] * MATI  # bangkrut = -100%\n\ntercatat = sum(ret_hidup) / HIDUP\nsebenarnya = (sum(ret_hidup) + sum(ret_mati)) / (HIDUP + MATI)\n\nprint(f\"Return TERCATAT (tanpa yg mati): {tercatat:.1%}\")\nprint(f\"Return SEBENARNYA (semua)      : {sebenarnya:.1%}\")\nprint(f\"BIAS: {tercatat - sebenarnya:+.1%} (kuburan yang hilang!)\")\nprint()\nprint(\"Database tanpa delisted = fiksi yang optimis.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Hitung return/backtest → <strong>Harga adjusted</strong></h3>
<p><strong>Kenapa:</strong> Corporate action menipu.</p>
<p><strong>Contoh nyata:</strong> XYZ +400% palsu.</p>
</div>
<div className="decision-card">
<h3>2. Pilih database → <strong>Point-in-time + delisted</strong></h3>
<p><strong>Kenapa:</strong> Bunuh survivorship bias.</p>
<p><strong>Contoh nyata:</strong> Tanya vendor 1 kalimat.</p>
</div>
<div className="decision-card">
<h3>3. Saham tidak likuid → <strong>Flag/exclude (stale check)</strong></h3>
<p><strong>Kenapa:</strong> Vol palsu.</p>
<p><strong>Contoh nyata:</strong> &gt;20% hari nol-volume.</p>
</div>
<div className="decision-card">
<h3>4. Pasar beda zona waktu → <strong>Sinkronkan timestamp</strong></h3>
<p><strong>Kenapa:</strong> Return harian sebanding.</p>
<p><strong>Contoh nyata:</strong> IDX vs NYSE.</p>
</div>
<div className="decision-card">
<h3>5. Data harga → <strong>Adjusted + point-in-time + curiga dulu</strong></h3>
<p><strong>Kenapa:</strong> 80% anomali = artefak; survivorship = bias masif.</p>
<p><strong>Contoh nyata:</strong> XYZ +500% = reverse split, bukan breakout.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Adjusted</strong> untuk return.</li><li><strong>Delisted</strong> termasuk.</li><li><strong>Stale</strong> di-flag.</li><li><strong>EDA dulu</strong>, model kemudian.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Breakout Palsu</h2>
<div className="callout">
<p>Screener: XYZ +500% sehari. Junior: 'breakout!'. Faktanya: reverse split 1:5.</p>
<p><strong>Vignette lanjutan.</strong> <em>Screener</em>: XYZ +500% sehari! Junior: &ldquo;<em>breakout</em>!&rdquo; (<em>all-in</em>!). Faktanya: <strong><em>reverse split</em> 1:5</strong> &mdash; return <em>sebenarnya</em> <strong>0%</strong>! Junior <em>rugi</em> (beli di puncak <em>ilusi</em>!).</p>
<p><strong>Pertanyaan:</strong> (a) Hitung return benar. (b) Sistem agar tidak terulang? (c) Pelajaran <em>survivorship</em>? (d) Jika <em>backtest</em> strategi ini 10 tahun (<em>tanpa</em> adjust) &mdash; <em>apa</em> yang terjadi? (e) Rancang <em>checklist</em> data.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>0%</strong> (Rp10.000×5 = Rp50.000 adjusted). Bukan +400%.</p>
<p>(b) <strong>Screener pakai adjusted</strong> + <strong>alert corporate action</strong> + <strong>ritual 3 cek</strong> (lompatan? stale? CA?). Junior dilatih <em>curiga dulu</em>.</p>
<p>(c) <strong>Data mentah = musuh pertama.</strong> 80% &lsquo;anomali&rsquo; = artefak. Bersihkan dulu, kagum kemudian.</p>
<p>(d) <strong><em>Bencana</em>!</strong> &mdash; <em>backtest</em> <em>menemukan</em> &ldquo;<em>breakout</em>&rdquo; palsu &rarr; <strong><em>return</em> ilusi</strong>! <em>Live</em> = <em>gagal</em>! <strong><em>Garbage in</em> = <em>garbage out</em>.</strong></p>
<p>(e) <strong><em>Checklist</em>:</strong> (1) <strong><em>Adjusted</em>?</strong> (2) <strong><em>Point-in-time</em>?</strong> (3) <strong><em>Corporate actions</em>?</strong> (4) <strong><em>Stale</em>?</strong> (5) <strong><em>Outlier</em>?</strong> (6) <strong><em>Mata uang</em>?</strong> (7) <strong><em>Timezone</em>?</strong> <strong>7 cek <em>sebelum</em> analisis.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Data Lanjut</h2>
      <h3>1. Tick data &mdash; &ldquo;hutan&rdquo;</h3>
      <p><strong><em>Microstructure noise</em></strong>! <em>Bid-ask bounce</em>! <strong><em>Filter</em></strong>! <strong><em>Agregat</em></strong>!</p>
      <h3>2. Alternative data</h3>
      <p><strong><em>Satelit</em></strong>! <em>Sentimen</em>! <strong><em>Validasi</em></strong>! <strong><em>Biaya</em></strong>!</p>
      <h3>3. Data vendor &mdash; <em>perbandingan</em></h3>
      <p><strong><em>Bloomberg</em></strong>! <em>Refinitiv</em>! <em>Yahoo</em> (<em>gratis</em> tapi <em>kotor</em>!)! <strong><em>Pilih</em> sesuai <em>butuh</em>.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Adjust kilat</h3>
      <p>Split 2:1, @10.000 &rarr; 5.000. Return <em>mentah</em> vs <em>adjusted</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p><em>Mentah</em>: <strong>&minus;50%</strong> (<em>salah</em>!). <em>Adjusted</em>: <strong>0%</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; Survivorship</h3>
      <p>70 bertahan (+10%), 30 mati. <em>Bias</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>7&ndash;8 poin</strong>! (<em>Masif</em>!).</p>
      </details>
      <h3>Drill 3 &mdash; Ritual</h3>
      <p>Lompatan 30% sehari. <em>3 cek</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p><strong>CA? Stale? Outlier?</strong></p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;+500% = breakout!&rdquo; <em>Benar</em>?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong><em>Curiga</em>!</strong> <em>Cek</em> CA dulu!</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Split 2:1, harga Rp10.000. Harga adjusted histori?"}
  options={
    ["Rp10.000",
    "Rp5.000",
    "Rp20.000",
    "Rp0"]
  }
  correct={1}
  explanation={"Benar: bagi 2. Nilai tetap (saham ×2). Return dihitung dari adjusted!"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Database tanpa delisted, backtest 18%. Realita kemungkinan?"}
  options={
    ["18%",
    "13% (bias 2-5% dari kuburan)",
    "25%",
    "0%"]
  }
  correct={1}
  explanation={"Benar: survivorship bias 2–4%/tahun. Tanya vendor: point-in-time?"}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Harga tidak bergerak 20 hari, vol 2%. Kesimpulan?"}
  options={
    ["Aman",
    "Stale price — vol fatamorgana, cek likuiditas",
    "Beli",
    "Jual"]
  }
  correct={1}
  explanation={"Benar: tidak ada transaksi ≠ tidak ada risiko. % hari nol-volume &gt; 20% → exclude."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Dividen Rp100, harga Rp1.000 ex-date. Adjust histori?"}
  options={
    ["Tidak usah",
    "Kali 0,9 (turunkan histori)",
    "Kali 1,1",
    "Hapus"]
  }
  correct={1}
  explanation={"Benar: harga ex-div turun ≈ dividen. Histori disesuaikan agar return kontinu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Ritual wajib sebelum analisis?"}
  options={
    ["Langsung model",
    "Plot + cek lompatan/stale/CA (EDA)",
    "Tanya AI",
    "Copy template"]
  }
  correct={1}
  explanation={"Benar: 15 menit EDA &gt; 3 bulan sesat. Data kotor = kebohongan presisi."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. XYZ +500% sehari. Ternyata reverse split 1:5. Return benar & pelajaran?"}
  options={
    ["+500% — breakout!",
    "0% — adjusted; curiga dulu, kagum kemudian",
    "+400% — dikurangi split",
    "Tidak bisa dihitung"]}
  correct={1}
  explanation={"Benar: 10.000×5=50.000 → 0%. Pelajaran: selalu pakai adjusted; ritual 3 cek (lompatan? stale? CA?)."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Adjusted</strong>: untuk return (split/dividen disesuaikan mundur).</li>
<li><strong>Survivorship bias</strong>: 2–4%/tahun; butuh database point-in-time.</li>
<li><strong>Stale price</strong>: vol understated; flag &gt;20% hari nol-volume.</li>
<li><strong>Sinkronisasi</strong>: samakan timestamp antar-pasar.</li>
<li><strong>Ritual</strong>: plot, cek lompatan, daftar CA — sebelum model.</li>
<li><strong>Aturan</strong>: tidak ada data bersih; percaya tapi verifikasi.</li>

<li><strong>Adjust:</strong> corporate actions; total return.</li>
<li><strong>Survivor:</strong> point-in-time; jangan hilang.</li>
<li><strong>Clean:</strong> curiga; verifikasi; dokumentasi.</li>
<li><strong>Kapan TIDAK pakai:</strong> mentah; tanpa point-in-time; asal buang outlier.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-c11-ethics-esg" className="btn btn-secondary btn-sm">← PM-C11</Link>
        <Link href="/learn/pm-d2-optimisasi" className="btn btn-primary btn-sm">PM-D2 →</Link>
      </div>
    </div>
  );
}

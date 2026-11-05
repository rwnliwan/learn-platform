"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmB2TimeseriesPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-B2 — Portfolio Management</span>
        <h1 className="display-title">Time Series:<br/>AR, Unit Root & GARCH</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Ramalan yang 'Akurat' Karena Mencontek</a></li>
<li><a href="#ar">AR & Stationarity</a></li>
<li><a href="#unitroot">Unit Root & Dickey-Fuller</a></li>
<li><a href="#garch">ARCH/GARCH</a></li>
<li><a href="#sintesis">Sintesis: Tiga Pertanyaan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: R² 0,98</a></li>
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
<li>Menjelaskan stationarity dan syarat AR(1) stasioner.</li>
<li>Membedakan trend-stationary vs difference-stationary (unit root).</li>
<li>Menjelaskan logika uji Dickey-Fuller.</li>
<li>Menjelaskan GARCH(1,1) dan volatility clustering.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Ramalan yang 'Akurat' Karena Mencontek</h2>
      <div className="story">
        <p><strong>Analis</strong> membangun model prediksi harga saham: R² <strong>0,98</strong>! <em>&ldquo;Regresi harga hari ini ke harga kemarin — hampir sempurna!&rdquo;</em> Ia trading dengan model itu. Hasil: <strong>rugi besar</strong>.</p>
<p>Twist-nya: harga saham = <strong>random walk</strong> (unit root). Regresi dua random walk menghasilkan <strong>spurious regression</strong> — R² tinggi <em>palsu</em> (Granger &amp; Newbold, 1974). Model 'mencontek' (harga kemarin ≈ harga hari ini) tapi <strong>tidak memprediksi apa-apa</strong> — seperti meramal 'besok cuaca = hari ini' lalu mengklaim jadi meteorolog. Lesson ini: mengenali data yang tidak stasioner.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="ar">AR(1) — Ingatan Satu Langkah</h2>
<p><strong>Definisi.</strong> <strong>AR(1)</strong>: <Tex math={String.raw`x_t = b_0 + b_1 x_{t-1} + \epsilon_t`} />. <strong>Stasioner</strong> jika <strong>|b1| &lt; 1</strong>: mean-reverting (kembali ke b0/(1−b1)). <strong>b1 = 1</strong> = <strong>random walk</strong> (tidak stasioner: varians → ∞, shock permanen). <strong>b1 &gt; 1</strong> = eksplosif.</p>
<p>Implikasi: regresi dengan data tidak stasioner → <strong>spurious</strong> (uji-t invalid). Solusi: <strong>difference</strong> dulu (Δx_t stasioner) atau uji kointegrasi.</p>
<Tex math={String.raw`x_t = b_0 + b_1 x_{t-1} + \epsilon_t \quad;\quad \text{stasioner} \iff |b_1| < 1`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`b_1`} />: persistensi — seberapa 'ingat' masa lalu</li>
<li>Mean jangka panjang: <Tex math={String.raw`b_0/(1-b_1)`} /> (hanya jika stasioner!)</li>
<li>Random walk (b1=1): harga saham — prediksi terbaik = harga kini (tapi bukan 'model')</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> AR(1) seperti <strong>anjing dengan tali</strong>: |b1| &lt; 1 = tali elastis (anjing kembali ke pemilik = mean reversion); b1=1 = tali putus (anjing mengembara = random walk, ke mana-mana tapi tak kembali); b1 &gt; 1 = anjing ditarik roket.</p>
<p><strong>Kapan dipakai:</strong> Model return/volatilitas: pastikan stasioner dulu (plot + uji).</p>
<p><strong>Pendalaman intuisi &mdash; AR = &ldquo;memori&rdquo; deret waktu.</strong> AR(1): y_t = c + &phi;y_&#123;t&minus;1&#125; + &epsilon;_t. Koefisien &phi; = <strong>seberapa kuat hari ini &ldquo;mengingat&rdquo; kemarin</strong>. &phi; = 0,9 &rarr; guncangan bertahan lama (memori panjang); &phi; = 0,1 &rarr; cepat lupa. <strong>Mean reversion</strong> = |&phi;| &lt; 1: deret <em>tertarik kembali</em> ke rata-rata. &phi; = 1 = <strong>random walk</strong>: tidak ada tarikan &mdash; guncangan <em>permanen</em>. Inilah kenapa |&phi;| &lt; 1 vs = 1 adalah <em>garis hidup-mati</em> analisis time series.</p><details className="worked">
<summary>📐 Contoh: Tiga nasib (klik untuk buka)</summary>
<p><strong>b1 = 0,8</strong>: shock Rp100 → tersisa 80, 64, 51… → <strong>lenyap</strong> (mean-reverting). <strong>b1 = 1</strong>: shock Rp100 → <strong>menetap selamanya</strong> (harga saham!). <strong>b1 = 1,05</strong>: shock <strong>membesar</strong> eksponensial (bubble).</p>
<p>Regresi harga (b1=1) ke harga: R² 0,98 tapi <strong>spurious</strong>. Regresi <em>return</em> (Δharga, stasioner): R² 0,02 tapi <strong>jujur</strong>. Pilih jujur.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Forecast AR(1) &mdash; langkah demi langkah</summary>
<p><strong>Soal:</strong> y_t = 0,5 + 0,7&times;y_&#123;t&minus;1&#125; + &epsilon;_t. Terakhir y_T = 10. Forecast 1, 2 langkah &amp; jangka panjang.</p>
<p><strong>1-step:</strong> &ycirc;_&#123;T+1&#125; = 0,5 + 0,7&times;10 = <strong>7,5</strong>.</p>
<p><strong>2-step:</strong> &ycirc;_&#123;T+2&#125; = 0,5 + 0,7&times;7,5 = <strong>5,75</strong>.</p>
<p><strong>Jangka panjang:</strong> mean = 0,5/(1&minus;0,7) = <strong>1,67</strong> &mdash; forecast <em>meluruh</em> menuju ini (mean reversion!).</p>
<p><strong>Pelajaran:</strong> forecast AR <strong>melemah</strong> seiring horizon (0,7&sup2; = 0,49 untuk 2-step, 0,7&sup1;&sup2; &asymp; 0,014 untuk 12-step). <strong>AR berguna untuk jangka pendek; untuk jangka panjang ia hanya bilang &ldquo;kembali ke rata-rata&rdquo;.</strong> Jangan percaya forecast AR(1) 12 bulan &mdash; itu cuma mean dengan hiasan.</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: ACF vs PACF &mdash; membaca sidik jari</summary>
<p><strong>Soal:</strong> ACF meluruh perlahan (0,8; 0,64; 0,51; ...), PACF terpotong setelah lag 1 (0,8; 0,05; &minus;0,02; ...). Model apa?</p>
<p><strong>Jawaban: AR(1).</strong> Pola khas: <strong>AR(p)</strong> &rarr; PACF terpotong di lag p, ACF meluruh. <strong>MA(q)</strong> &rarr; sebaliknya (ACF terpotong, PACF meluruh).</p>
<p><strong>Cara ingat:</strong> &ldquo;<strong>P</strong>ACF <strong>P</strong>otong = AR(<strong>P</strong>)&rdquo;. Ini <em>Box-Jenkins identification</em> &mdash; masih dipakai sebelum model otomatis. <strong>Praktik:</strong> jika ACF <em>dan</em> PACF sama-sama meluruh &rarr; ARMA campuran.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; Meregresi harga (level).</strong> Harga saham = random walk (unit root) &rarr; regresi level = <strong>spurious</strong> kecuali terkointegrasi. <strong>Aturan:</strong> selalu uji DF dulu; jika unit root &rarr; pakai <em>return</em> (difference) atau uji kointegrasi. Soal yang memberi &ldquo;regresi harga A pada harga B, R&sup2; 0,98&rdquo; tanpa uji kointegrasi sedang menjebakmu &mdash; jawabannya: <strong>model invalid</strong>.</p>
</div>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], y: [0,0.5,0.2,0.9,0.4,0.1,0.6,0.3,0.0,0.4,0.2,0.5,0.1,0.3,0.0,0.2,0.4,0.1,0.3,0.2], type: "scatter", mode: "lines", line: {color: "#2a7de1"}, name: "AR(1) b1=0,5"}, {x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], y: [0,0.8,1.5,2.1,1.8,2.9,3.5,3.1,4.2,4.8,4.5,5.3,5.9,5.5,6.4,7.0,6.7,7.5,8.1,8.6], type: "scatter", mode: "lines", line: {color: "#ef4444"}, name: "random walk b1=1"}]}
  title={"Stasioner vs random walk (ilustrasi)"}
  layout={{xaxis: {title: "Waktu"}, yaxis: {title: "Nilai"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = AR(1) b1=0,5 (bolak-balik di sekitar 0); merah = random walk (mengembara).</p>
<p><strong>Interpretasi:</strong> Biru <strong>mean-reverting</strong> — selalu kembali. Merah <strong>mengembara tanpa jangkar</strong> — varians membesar. Regresi dua garis merah = spurious. <strong>Uji stationarity sebelum regresi time series.</strong></p>
</div>

<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8], y: [0.8,0.64,0.51,0.41,0.33,0.26,0.21,0.17], type: "bar", marker: {color: "#2a7de1"}, name: "ACF (meluruh)"}, {x: [1,2,3,4,5,6,7,8], y: [0.8,0.05,-0.02,0.03,-0.01,0.02,-0.03,0.01], type: "bar", marker: {color: "#e8a838"}, name: "PACF (terpotong lag 1)"}]}
  title={"Sidik jari AR(1): ACF meluruh, PACF terpotong"}
  layout={{xaxis: {title: "Lag"}, yaxis: {title: "Korelasi"}, showlegend: true, barmode: "group"}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = ACF per lag; kuning = PACF per lag. Garis nol = tidak ada korelasi.</p>
<p><strong>Interpretasi:</strong> ACF <strong>meluruh perlahan</strong> (0,8 &rarr; 0,17) &mdash; memori menipis bertahap. PACF <strong>langsung mati</strong> setelah lag 1 (0,8 &rarr; &asymp;0) &mdash; hanya lag 1 yang &ldquo;langsung&rdquo; berpengaruh; lag 2+ hanya <em>tidak langsung</em> (via lag 1). <strong>Pola ini = tanda tangan AR(1).</strong> Jika keduanya meluruh &rarr; ARMA; jika ACF terpotong &rarr; MA.</p>
</div>
<h2 id="unitroot">Unit Root — Akar Persoalan</h2>
<p><strong>Definisi.</strong> <strong>Unit root</strong>: b1 = 1 (akar karakteristik = 1). <strong>Trend-stationary</strong>: stasioner di sekitar <em>trend deterministik</em> (detrend → stasioner). <strong>Difference-stationary</strong>: butuh <em>differencing</em> (random walk with drift).</p>
<p><strong>Dickey-Fuller</strong>: H0 = ada unit root (tidak stasioner). Tolak H0 (test stat &lt; kritis, negatif besar) → stasioner. <strong>Kointegrasi</strong>: dua series tidak stasioner tapi <em>kombinasinya</em> stasioner → hubungan jangka panjang (pairs trading!).</p>
<p><strong>Kepribadian/intuisi:</strong> Unit root seperti <strong>tes kewarganegaraan data</strong>: 'apakah kamu warga Stasioner?' Dickey-Fuller = pewawancaranya. H0 = 'bukan warga' (harus dibuktikan sebaliknya). Kointegrasi = 'dua turis yang selalu jalan bareng' — masing-masing mengembara, tapi jaraknya stabil.</p>
<p><strong>Kapan dipakai:</strong> Sebelum regresi time series; pairs trading (kointegrasi).</p>
<p><strong>Pendalaman intuisi &mdash; unit root = tidak punya &ldquo;rumah&rdquo;.</strong> Deret stasioner punya <em>rumah</em> (mean) yang selalu dituju kembali. Random walk <strong>tunawisma</strong>: ia mengembara tanpa tujuan, variansnya <em>tumbuh</em> dengan waktu. Meregresi dua tunawisma &rarr; mereka &ldquo;terlihat&rdquo; berhubungan (spurious!) padahal cuma sama-sama mengembara. <strong>Uji unit root = menanyakan &ldquo;punya rumah tidak?&rdquo; sebelum membangun model di atasnya.</strong></p><details className="worked">
<summary>📐 Contoh: Prosedur 3 langkah (klik untuk buka)</summary>
<p><strong>1. Plot</strong>: tren naik tanpa kembali? curiga unit root. <strong>2. DF test</strong>: stat −1,2 &gt; kritis −2,9 → <strong>gagal tolak H0</strong> → tidak stasioner. <strong>3. Difference</strong>: Δx → DF stat −4,5 &lt; −2,9 → <strong>stasioner</strong> → pakai Δx untuk model.</p>
<p><strong>Jangan</strong> regresi level jika DF gagal tolak — kecuali uji kointegrasi lolos.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Dickey-Fuller &mdash; uji &ldquo;tunawisma&rdquo;</summary>
<p><strong>Soal:</strong> regresi &Delta;y_t = 0,1 &minus; 0,05&times;y_&#123;t&minus;1&#125; + e_t. t-stat koefisien y_&#123;t&minus;1&#125; = &minus;1,8. Ada unit root? (&alpha; = 5%)</p>
<p><strong>Langkah 1 &mdash; hipotesis:</strong> H0: &gamma; = 0 (unit root, tunawisma) vs Ha: &gamma; &lt; 0 (stasioner).</p>
<p><strong>Langkah 2 &mdash; kritis DF:</strong> &asymp; <strong>&minus;2,86</strong> (bukan &minus;1,96! &mdash; distribusi DF <em>non-standar</em>).</p>
<p><strong>Langkah 3:</strong> &minus;1,8 &gt; &minus;2,86 &rarr; <strong>gagal tolak H0</strong> &rarr; ada unit root &rarr; <em>difference</em> dulu!</p>
<p><strong>Jebakan klasik:</strong> memakai kritis normal &minus;1,96 &rarr; &ldquo;tolak H0&rdquo; &rarr; <strong>salah total</strong>. DF butuh tabel khusus (MacKinnon). <strong>Software melakukannya benar; yang harus kamu tahu adalah <em>kapan</em> menggunakannya.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Spurious regression &mdash; dua tunawisma &ldquo;pacaran&rdquo;</summary>
<p><strong>Soal:</strong> regresi harga saham A (random walk) pada harga saham B (random walk independen). R&sup2; = 0,85, t-stat = 12. Kesimpulan?</p>
<p><strong>Jawaban: SAMPAH.</strong> Dua random walk independen <em>sering</em> menghasilkan R&sup2; tinggi &amp; t-stat raksasa &mdash; murni kebetulan (keduanya &ldquo;mengembara&rdquo; dan kadang searah). <strong>Ciri spurious:</strong> R&sup2; tinggi + DW <em>rendah</em> (&lt; 0,5) + residual <em>non-stasioner</em>.</p>
<p><strong>Uji pembeda:</strong> uji unit root pada <em>residual</em> &mdash; jika residual stasioner &rarr; <strong>kointegrasi</strong> (hubungan <em>nyata</em>!) &rarr; model valid (VECM). Jika residual juga tunawisma &rarr; buang modelnya.</p>
<p><strong>Inilah kenapa quant fund kolaps:</strong> meregresi harga (bukan return) tanpa uji kointegrasi = membangun istana di atas dua tunawisma.</p>
</details>
<details className="worked">
<summary>📐 Contoh 4: Kointegrasi &mdash; pairs trading yang sah</summary>
<p><strong>Soal:</strong> saham A &amp; B sama-sama random walk, tapi spread S = A &minus; 2&times;B stasioner (mean 0, &sigma; = 5). Harga kini: A = 100, B = 40. Sinyal trading?</p>
<p><strong>Langkah 1:</strong> S = 100 &minus; 80 = <strong>20</strong> = 4&sigma; di atas mean!</p>
<p><strong>Langkah 2:</strong> spread <em>mean-reverting</em> &rarr; <strong>jual A, beli 2&times;B</strong> &mdash; taruhan spread kembali ke 0.</p>
<p><strong>Beda dengan spurious:</strong> di sini <em>spread</em>-nya stasioner (teruji!) &mdash; hubungan <em>ekonomis</em> (mis. dua emiten satu grup). <strong>Pairs trading = kointegrasi + disiplin eksekusi.</strong> Tanpa uji kointegrasi, &ldquo;pairs trading&rdquo; = menebak dua tunawisma akan bertemu.</p>
</details>

<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], y: [0.5,-0.3,0.8,-0.4,0.6,-0.5,3.2,-2.8,3.5,-3.1,2.9,-2.5,0.4,-0.6,0.5,-0.3,0.7,-0.4,0.3,-0.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Return harian (%)"}]}
  title={"Volatility clustering: tenang-bertenang, panik-berpanik"}
  layout={{xaxis: {title: "Hari"}, yaxis: {title: "Return (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = waktu, sumbu Y = return harian. Perhatikan <em>pengelompokan</em> ayunan besar.</p>
<p><strong>Interpretasi:</strong> Hari 1&ndash;6 &amp; 14&ndash;20: <strong>tenang</strong> (ayunan &lt; 1%). Hari 7&ndash;13: <strong>badai</strong> (ayunan 3%+). Inilah <em>volatility clustering</em> &mdash; <strong>volatilitas hari ini memprediksi volatilitas esok</strong> (tapi <em>bukan</em> arah return!). GARCH menangkap pola ini; volatilitas historis statis <em>melebur</em> keduanya menjadi rata-rata yang tidak mewakili keduanya.</p>
</div>
<h2 id="garch">GARCH — Volatilitas Berkelompok</h2>
<p><strong>Definisi.</strong> <strong>Volatility clustering</strong>: 'hari bergejolak diikuti hari bergejolak' (krisis berkelompok!). <strong>ARCH</strong>: varians kini = f(residual kuadrat lalu). <strong>GARCH(1,1)</strong>: <Tex math={String.raw`\sigma_t^2 = \omega + \alpha \epsilon_{t-1}^2 + \beta \sigma_{t-1}^2`} /> — standar industri.</p>
<p><strong>α + β</strong> = persistensi volatilitas (≈ 0,9+ untuk saham: shock volatilitas <em>awet</em>). GARCH untuk <strong>forecasting risiko</strong>, bukan return.</p>
<Tex math={String.raw`\sigma_t^2 = \omega + \alpha \epsilon_{t-1}^2 + \beta \sigma_{t-1}^2`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\omega`} />: baseline varians jangka panjang</li>
<li><Tex math={String.raw`\alpha`} />: reaksi ke shock kemarin (news impact)</li>
<li><Tex math={String.raw`\beta`} />: ingatan volatilitas (persistensi)</li>
<li>Unconditional variance = <Tex math={String.raw`\omega/(1-\alpha-\beta)`} /></li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> GARCH seperti <strong>prakiraan gempa susulan</strong>: gempa besar kemarin (α) + daerah memang rawan (β) = waspada hari ini. Volatilitas tidak acak — ia <em>menular</em> dari hari ke hari.</p>
<p><strong>Kapan dipakai:</strong> Risk management: VaR besok (PM-B8), option pricing, margin setting.</p>
<p><strong>Pendalaman intuisi &mdash; GARCH = &ldquo;volatilitas bergerombol&rdquo;.</strong> Fakta pasar: hari tenang diikuti hari tenang; hari panik diikuti hari panik (<em>volatility clustering</em>). GARCH(1,1) menangkap ini: varians hari ini = f(guncangan kemarin, varians kemarin). <strong>Implikasi:</strong> risiko <em>tidak konstan</em> &mdash; VaR yang memakai volatilitas rata-rata akan <em>kekecilan</em> tepat saat dibutuhkan (setelah guncangan!). <strong>Manajemen risiko modern = volatilitas <em>kondisional</em>, bukan historis statis.</strong></p><details className="worked">
<summary>📐 Contoh: Setelah crash (klik untuk buka)</summary>
<p>ω=0,000005, α=0,10, β=0,85. Vol long-run = √(0,000005/0,05) = √(0,0001) = <strong>1%/hari</strong>.</p>
<p><strong>Crash</strong>: return −8% (ε² = 0,0064). σ²_besok = 0,000005 + 0,10×0,0064 + 0,85×0,0001 = <strong>0,00073</strong> → σ = 2,70%/hari (<strong>2,7x normal!</strong>).</p>
<p><strong>VaR besok naik 2,7x</strong> — risk manager yang pakai volatilitas konstan akan <em>underestimate</em> risiko tepat saat paling berbahaya.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Forecast GARCH(1,1)</summary>
<p><strong>Soal:</strong> &sigma;&sup2;_t = 0,02 + 0,10&times;r&sup2;_&#123;t&minus;1&#125; + 0,85&times;&sigma;&sup2;_&#123;t&minus;1&#125;. Kemarin r = &minus;3%, &sigma;&sup2; = 4. Forecast volatilitas hari ini.</p>
<p><strong>Langkah 1:</strong> &sigma;&sup2;_t = 0,02 + 0,10&times;9 + 0,85&times;4 = 0,02 + 0,9 + 3,4 = <strong>4,32</strong>.</p>
<p><strong>Langkah 2:</strong> &sigma;_t = &radic;4,32 = <strong>2,08%</strong> (vs 2,00% kemarin &mdash; <em>naik</em> karena guncangan &minus;3%!).</p>
<p><strong>Intuisi parameter:</strong> 0,10 (&alpha;) = <em>reaksi</em> ke guncangan baru; 0,85 (&beta;) = <em>memori</em> volatilitas lama. &alpha;+&beta; = 0,95 &rarr; <strong>guncangan meluruh lambat</strong> (persisten). Jika &alpha;+&beta; &ge; 1 &rarr; <em>non-stasioner</em> (IGARCH) &mdash; volatilitas tidak kembali ke rata-rata!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Unconditional variance &mdash; &ldquo;rumah&rdquo; volatilitas</summary>
<p><strong>Soal:</strong> lanjutkan contoh 2. Berapa varians jangka panjang?</p>
<p><strong>Langkah 1:</strong> &sigma;&sup2;_LR = &omega;/(1&minus;&alpha;&minus;&beta;) = 0,02/(1&minus;0,95) = 0,02/0,05 = <strong>0,40</strong>.</p>
<p><strong>Langkah 2:</strong> &sigma;_LR = &radic;0,40 = <strong>0,63%</strong> per hari &asymp; 10% per tahun (&times;&radic;250).</p>
<p><strong>Interpretasi:</strong> forecast 4,32 (hari ini) akan <em>meluruh</em> menuju 0,40 &mdash; kecepatan peluruhan = (&alpha;+&beta;)^h. <strong>Untuk VaR 1-hari pakai 4,32 (kondisional!); untuk alokasi strategis pakai 0,40.</strong> Mencampur keduanya = kesalahan klasik.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Volatilitas tinggi&rdquo; ≠ &ldquo;return akan tinggi&rdquo;.</strong> GARCH memprediksi <em>besaran ayunan</em>, bukan <em>arah</em>. Volatilitas 5% artinya &ldquo;bergerak &plusmn;5%&rdquo; &mdash; bisa +5% atau &minus;5%. <strong>Jangan pernah trading arah berdasarkan forecast volatilitas.</strong> Volatilitas untuk <em>sizing</em> &amp; <em>risk</em>, bukan untuk <em>arah</em>.</p>
</div>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: Tiga Pertanyaan Time Series</h2>
      <p>AR, unit root, dan GARCH menjawab <strong>tiga pertanyaan berurutan</strong>:</p>
      <ol>
        <li><strong>APAKAH stasioner? (unit root)</strong> &mdash; jika tidak, <em>difference</em> atau kointegrasi. Tanpa ini, semua model = istana pasir.</li>
        <li><strong>APA polanya? (AR/MA)</strong> &mdash; setelah stasioner, identifikasi via ACF/PACF. Model untuk <em>level ekspektasi</em>.</li>
        <li><strong>BERAPA risikonya? (GARCH)</strong> &mdash; model untuk <em>varians kondisional</em>. Untuk sizing &amp; VaR, bukan arah.</li>
      </ol>
      <p><strong>Urutan tidak bisa dibalik.</strong> Analis yang kolaps membalik semuanya: langsung AR pada level, tanpa uji, dengan VaR historis.</p>

      <h3>🎙️ Debat: &ldquo;Modelku R&sup2;-nya 98%&rdquo;</h3>
      <p>Dua analis mempresentasikan model:</p>
      <p><strong>Analis A:</strong> &ldquo;Regresi harga saham ke harga kemarin: R&sup2; <strong>98%</strong>! Modelku hampir sempurna.&rdquo;</p>
      <p><strong>Analis B:</strong> &ldquo;Model return-ku R&sup2;-nya cuma <strong>3%</strong>. Tapi: stasioner, terkointegrasi, <em>walk-forward</em> positif net of cost.&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>B menang telak.</strong> R&sup2; 98% A = <em>spurious</em> (harga = random walk) &mdash; &ldquo;prediksi&rdquo;nya = &ldquo;besok ≈ hari ini&rdquo;, tidak bisa ditradingkan. R&sup2; 3% B = <em>sinyal nyata</em> yang kecil tapi konsisten &mdash; dengan <em>leverage</em> &amp; diversifikasi, 3% bisa jadi strategi. <strong>Pelajaran: di time series, R&sup2; kecil yang jujur &gt; R&sup2; besar yang bohong.</strong></p>
      <h3>📊 Data Corner: Membaca output ADF</h3>
      <p><strong>Data (software):</strong> ADF t-stat = &minus;1,82; kritis 5% = &minus;2,86; p-value = 0,37.</p>
      <p><strong>Cara membaca:</strong> (1) t-stat (&minus;1,82) <strong>lebih besar</strong> (kurang negatif) dari kritis (&minus;2,86) &rarr; <strong>gagal tolak H0</strong>; (2) p-value 0,37 &gt; 0,05 &rarr; konsisten: <strong>ada unit root</strong>.</p>
      <p><strong>Aksi:</strong> <em>difference</em> deret &rarr; uji lagi pada &Delta;y. Jika &Delta;y stasioner &rarr; deret I(1) &rarr; model <em>return</em>/<em>perubahan</em>. <strong>Jangan pernah</strong> menginterpretasikan &ldquo;p = 0,37&rdquo; sebagai &ldquo;37% stasioner&rdquo; &mdash; p-value bukan probabilitas hipotesis!</p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) Dua random walk &ldquo;berhubungan&rdquo;.</strong> Generate dua random walk independen di kepala (atau Python): regresikan satu pada lainnya. Berapa R&sup2;-nya? (Jawab: <em>sering</em> 0,7+! &mdash; inilah spurious. Ulangi 10&times; untuk melihat variasinya.)</p>
      <p><strong>(2) Volatilitas vs arah.</strong> GARCH memprediksi &sigma; besok = 5%. Apakah kamu beli atau jual? (Jawab: <strong>tidak ada informasi arah!</strong> 5% = &ldquo;bergerak besar&rdquo;, bisa +5% atau &minus;5%. Yang benar: <em>kecilkan ukuran posisi</em> atau <em>lebarkan stop-loss</em>.)</p>
      <p><strong>(3) Mean reversion half-life.</strong> AR(1) dengan &phi; = 0,9. Berapa lama guncangan meluruh setengah? (Jawab: 0,9^h = 0,5 &rarr; h = ln(0,5)/ln(0,9) &asymp; <strong>6,6 periode</strong>. &phi; = 0,5 &rarr; 1 periode. <strong>Half-life = ukuran &ldquo;kesabaran&rdquo; yang dibutuhkan mean reversion trader.</strong>)</p>
      <h3>📰 Studi Kasus: Bagaimana Time Series yang Salah Membunuh Fund (2008)</h3>
      <p>Tahun 2006, sebuah quant fund membangun model &ldquo;revolusioner&rdquo;: meregresi harga 50 saham terhadap 12 faktor makro. R&sup2; <strong>0,94</strong>. <em>Backtest</em> 5 tahun: Sharpe 2,1. Investor mengantre.</p>
      <p><strong>Yang tidak mereka lakukan:</strong> (1) uji unit root &mdash; harga = random walk, regresi level = <strong>spurious</strong>; (2) cek DW &mdash; 0,7 = <strong>autokorelasi parah</strong> &rarr; t-stat palsu; (3) <em>out-of-sample test</em> &mdash; 0,94 = <strong>in-sample</strong> (menghafal!).</p>
      <p><strong>2008:</strong> hubungan &ldquo;sempurna&rdquo; itu tidak ada &mdash; R&sup2; <em>out-of-sample</em> ternyata 0,08. Fund kehilangan 60% dalam 3 bulan. Bukan karena &ldquo;pasar tidak rasional&rdquo;, melainkan karena <strong>model tidak pernah valid</strong> &mdash; ia hanya <em>terlihat</em> valid di cermin data lama.</p>
      <p><strong>Tiga pelajaran abadi:</strong> (1) <strong>R&sup2; in-sample = nilai pemasaran, bukan nilai prediksi;</strong> (2) <strong>diagnostik (DW, DF, residual) = rem;</strong> (3) <strong>model yang tidak diuji di data yang belum dilihat = hipotesis, bukan strategi.</strong> Fund ini membayar ratusan juta dolar untuk pelajaran yang ada gratis di lesson ini.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;R² 0,98 = model terbaik. Pakai saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Regresi harga-ke-harga (random walk) = <strong>spurious regression</strong> (Granger-Newbold): R² tinggi palsu, uji-t invalid. Model 'mencontek' tapi tidak memprediksi. <strong>Stasionerkan dulu</strong> (difference/return), baru nilai R²-nya.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas konstan cukup untuk risk management.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Volatility clustering</strong> = fakta: krisis berkelompok. σ konstan <em>underestimate</em> risiko setelah shock (lihat contoh GARCH: VaR 2,7x!). Risk manager modern memakai <strong>GARCH/EWMA</strong> — bukan σ historis statis.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;R&sup2; 0,98 = model hebat.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> untuk <em>time series level</em>, R&sup2; tinggi = <strong>bendera merah spurious</strong>, bukan medali. &ldquo;Meramal harga besok = harga hari ini&rdquo; memberi R&sup2; 0,98 &mdash; dan <em>nol</em> nilai trading. <strong>R&sup2; yang jujur untuk return harian = 1&ndash;5%</strong> &mdash; kecil tapi <em>nyata</em>.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas historis = risiko masa depan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> hanya jika volatilitas <em>konstan</em> &mdash; padahal ia <em>bergerombol</em>. Setelah crash, volatilitas kondisional (GARCH) bisa <strong>3&times;</strong> historis. VaR berbasis historis statis = <strong>kekecilan tepat saat dibutuhkan</strong>. Pakai kondisional untuk jangka pendek.</p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Plot dulu, uji kemudian.</strong> Time series plot 10 detik memberi tahu: tren? musiman? cluster volatilitas? break? Uji formal (DF) mengkonfirmasi, bukan menggantikan, mata.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Bedakan forecast return vs volatilitas.</strong> Return hampir tidak terprediksi (random walk); <strong>volatilitas sangat terprediksi</strong> (GARCH). Fokus risk modeling ke yang bisa diprediksi.</strong></p>
</div>

<div className="tip">
<p><strong>💡 Ritual 3 langkah sebelum model time series:</strong> (1) <strong>Plot</strong> &mdash; tren? musiman? break? (2) <strong>Uji DF</strong> &mdash; stasioner atau difference? (3) <strong>ACF/PACF residual</strong> &mdash; masih ada pola? <strong>Tiga langkah, lima menit, menyelamatkan dari 90% kesalahan time series.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Simulator AR(1): Tiga Nasib</h2>
<p>Simulasikan AR(1) dengan b1 = 0,8 / 1,0 / 1,05. Lihat bedanya.</p>
<PyodideLab
  title={"Lab 1 — Simulator AR(1)"}
  hint={"Ubah B1 1.0 -> 0.5. Series jadi mean-reverting — bandingkan dengan random walk!"}
  defaultCode={"# Simulator AR(1): stasioner vs random walk vs eksplosif\nimport random\nrandom.seed(3)\nB1 = 1.0   # ubah: 0.8 (stasioner) | 1.0 (random walk) | 1.05 (eksplosif)\nN = 40\n\nx, series = 0.0, []\nfor _ in range(N):\n    x = B1 * x + random.gauss(0, 1)\n    series.append(x)\n\nprint(f\"AR(1) b1={B1}:\")\nprint(\" \".join(f\"{v:6.1f}\" for v in series[:20]))\nprint(\" ...\")\nmn, mx = min(series), max(series)\nprint(f\"\\nrange: [{mn:.1f}, {mx:.1f}]\")\nif abs(B1) < 1: print(\"STASIONER: mean-reverting, varians terbatas.\")\nelif B1 == 1: print(\"RANDOM WALK: mengembara, varians membesar dgn waktu.\")\nelse: print(\"EKSPLOSIF: meledak (bubble!).\")\nprint(\"\\nRegresi dua random walk = spurious (R2 palsu tinggi).\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulator GARCH(1,1)</h2>
<p>Simulasikan volatility clustering dan lihat VaR naik setelah shock.</p>
<PyodideLab
  title={"Lab 2 — Simulator GARCH"}
  hint={"Ubah SHOCK 5.0 -> 8.0. VaR besok makin besar — clustering beraksi!"}
  defaultCode={"# GARCH(1,1): sigma2_t = w + a*e2_{t-1} + b*sigma2_{t-1}\nimport random, math\nrandom.seed(5)\nW, A, B = 0.000005, 0.10, 0.85   # long-run vol = 1%/hari\nSHOCK = 0.08   # return -8% hari ini (ubah sesukamu)\n\nsig2 = W/(1-A-B)   # mulai dari long-run variance\nprint(f\"Vol long-run: {math.sqrt(sig2):.2%}/hari\")\ne2 = SHOCK**2\nsig2_besok = W + A*e2 + B*sig2\nprint(f\"Setelah shock {SHOCK:.0%}: vol besok = {math.sqrt(sig2_besok):.2%}/hari\")\nprint(f\"VaR 99% besok: {2.33*math.sqrt(sig2_besok):.2%} (vs normal {2.33*math.sqrt(W/(1-A-B)):.2%})\")\nprint(\"\\nPelajaran: risiko TIDAK konstan. Setelah crash, siaga!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Regresi dengan data level tren → <strong>Uji DF dulu; difference jika unit root</strong></h3>
<p><strong>Kenapa:</strong> Cegah spurious regression.</p>
<p><strong>Contoh nyata:</strong> Pakai return, bukan harga.</p>
</div>
<div className="decision-card">
<h3>2. Dua series tidak stasioner tapi bergerak bersama → <strong>Uji kointegrasi</strong></h3>
<p><strong>Kenapa:</strong> Hubungan jangka panjang = peluang pairs trading.</p>
<p><strong>Contoh nyata:</strong> Saham kembar (dual listing).</p>
</div>
<div className="decision-card">
<h3>3. Forecasting risiko/VaR → <strong>GARCH(1,1), bukan σ konstan</strong></h3>
<p><strong>Kenapa:</strong> Volatility clustering.</p>
<p><strong>Contoh nyata:</strong> VaR besok setelah crash.</p>
</div>
<div className="decision-card">
<h3>4. b1 &gt; 1 terestimasi → <strong>Curigai bubble / spesifikasi salah</strong></h3>
<p><strong>Kenapa:</strong> Eksplosif tidak sustain.</p>
<p><strong>Contoh nyata:</strong> Harga kripto 2021.</p>
</div>
<div className="decision-card">
<h3>5. Data harga saham → <strong>Uji unit root dulu; model return, bukan level</strong></h3>
<p><strong>Kenapa:</strong> Level = random walk = spurious.</p>
<p><strong>Contoh nyata:</strong> R² 0,98 harga-vs-harga = jebakan; R² 3% return = jujur.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>|b1| &lt; 1</strong> = stasioner.</li><li><strong>DF test</strong> sebelum regresi level.</li><li><strong>Spurious</strong>: R² tinggi bisa palsu.</li><li><strong>GARCH</strong> untuk volatilitas.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Model 'Sempurna' yang Mencontek</h2>
<div className="callout">
<p>Analis: regresi harga saham hari ini ke kemarin, R² 0,98. Trading dengannya → rugi besar.</p>
<p><strong>Vignette lanjutan.</strong> Analis meregresi harga saham hari ini ke kemarin: R&sup2; 0,98. Ia trading &ldquo;mean reversion&rdquo; berdasarkan residual &mdash; rugi besar. Audit menemukan: tidak ada uji unit root, tidak ada uji kointegrasi, <em>backtest</em> in-sample.</p>
<p><strong>Pertanyaan:</strong> (a) Apa yang salah? (b) Kenapa R&sup2; tinggi tapi tak berguna? (c) Prosedur benar? (d) Jika residual ternyata <em>stasioner</em> &mdash; apakah strategi valid? (e) Rancang protokol time series yang benar.</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Spurious regression</strong>: harga = random walk (unit root); regresi level invalid.</p>
<p>(b) <strong>R² mengukur 'kemiripan'</strong>, bukan prediksi. Harga kemarin ≈ hari ini secara mekanis — seperti 'meramal cuaca besok = hari ini'.</p>
<p>(c) <strong>Uji DF</strong> → difference (return) → model return (R² kecil tapi jujur) <strong>atau</strong> uji kointegrasi untuk hubungan level yang valid.</p>
<p>(d) <strong>Ya &mdash; dengan syarat!</strong> Residual stasioner = <strong>kointegrasi</strong> = hubungan <em>nyata</em> (bukan spurious). Tapi strategi &ldquo;mean reversion&rdquo; butuh lebih: <em>half-life</em> mean reversion (berapa hari kembali?), <em>biaya transaksi</em> vs ekspektasi profit, dan <em>stabilitas</em> kointegrasi (bisa jebol saat rezim berubah!). <strong>Kointegrasi = izin untuk model level; bukan jaminan profit.</strong></p>
<p>(e) <strong>Protokol:</strong> (1) plot &amp; uji DF tiap deret; (2) jika semua I(1) &rarr; uji kointegrasi (Johansen/Engle-Granger); (3) jika terkointegrasi &rarr; VECM; jika tidak &rarr; model <em>return</em>; (4) <em>walk-forward backtest</em> dengan biaya; (5) <em>paper trade</em> sebelum modal. <strong>Lima langkah atau jangan trading.</strong></p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Melampaui Dasar</h2>
      <h3>1. Regime switching &mdash; pasar punya &ldquo;mood&rdquo;</h3>
      <p>Model Markov-switching: pasar beralih antara <em>rezim tenang</em> (vol rendah, return stabil) dan <em>rezim panik</em> (vol tinggi, korelasi &rarr; 1). <strong>Implikasi:</strong> parameter AR/GARCH <em>tidak konstan</em> &mdash; model satu-rezim meremehkan risiko transisi. Praktis: <em>estimasi terpisah</em> per rezim, atau pakai <em>rolling window</em> (tapi waspadai <em>lookback bias</em>!).</p>
      <h3>2. Long memory &mdash; antara stasioner &amp; unit root</h3>
      <p>Volatilitas sering punya <em>long memory</em> (ARFIMA): guncangan meluruh <em>hiperbolik</em> (lambat), bukan eksponensial. <strong>Implikasi:</strong> GARCH standar <em>meremehkan</em> persistensi &mdash; pakai FIGARCH/HAR untuk forecast multi-hari. Untuk trader harian: tidak masalah; untuk manajemen risiko mingguan: <em>material</em>.</p>
      <h3>3. Seasonality &mdash; kalender berisi pola</h3>
      <p><em>January effect</em>, <em>weekend effect</em>, <em>intraday U-shape</em> (vol tinggi di buka &amp; tutup). <strong>Aturan:</strong> selalu cek musiman <em>sebelum</em> AR &mdash; jika tidak, AR &ldquo;menemukan&rdquo; pola yang sebenarnya kalender. Dan: <strong>anomali kalender yang sudah dipublikasikan cenderung melemah</strong> (<em>arbitraged away</em>) &mdash; jangan trading paper 1990 di 2026.</p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Forecast AR kilat</h3>
      <p>y_t = 2 + 0,5&times;y_&#123;t&minus;1&#125;. y_T = 20. Forecast 1-step &amp; long-run mean.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>1-step: 2 + 10 = <strong>12</strong>. Mean: 2/0,5 = <strong>4</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; DF kilat</h3>
      <p>t-stat DF = &minus;3,5, kritis &minus;2,86. Simpulkan.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p>&minus;3,5 &lt; &minus;2,86 &rarr; <strong>tolak H0</strong> &rarr; stasioner (tidak ada unit root).</p>
      </details>
      <h3>Drill 3 &mdash; GARCH kilat</h3>
      <p>&sigma;&sup2; = 0,01 + 0,08&times;r&sup2; + 0,90&times;&sigma;&sup2;_&#123;t&minus;1&#125;. r = 2%, &sigma;&sup2;_&#123;t&minus;1&#125; = 1. Forecast &sigma;&sup2;?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>0,01 + 0,08&times;4 + 0,90&times;1 = 0,01 + 0,32 + 0,90 = <strong>1,23</strong>.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette identifikasi</h3>
      <p>ACF meluruh cepat (0,6; 0,1; 0,02), PACF: 0,6 di lag 1 lalu &asymp; 0. Model? Stasioner?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>AR(1)</strong> (PACF terpotong di lag 1). Stasioner jika |&phi;| &lt; 1 &mdash; butuh uji DF formal, tapi pola ACF meluruh mendukung stasioneritas.</p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. AR(1) dengan b1 = 1. Sifatnya?"}
  options={
    ["Stasioner",
    "Random walk — tidak stasioner, shock permanen",
    "Eksplosif",
    "Mean-reverting cepat"]
  }
  correct={1}
  explanation={"Benar: b1=1 = unit root. Varians → ∞, shock tidak hilang. Regresi level = spurious."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. DF test: stat −1,2, kritis −2,9. Kesimpulan?"}
  options={
    ["Stasioner",
    "Gagal tolak H0 — ada unit root (tidak stasioner)",
    "Eksplosif",
    "Perlu lebih banyak data"]
  }
  correct={1}
  explanation={"Benar: −1,2 &gt; −2,9 (kurang negatif) → gagal tolak H0. Solusi: difference dulu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. GARCH: ω=0,02, α=0,10, β=0,85. Setelah return −5%, vol besok?"}
  options={
    ["Tetap 0,63%",
    "≈ 1,69% (2,7x normal) — clustering!",
    "Turun",
    "Nol"]
  }
  correct={1}
  explanation={"Benar: σ² = 0,02+0,10×25+0,85×0,4 = 2,86 → σ=1,69%. VaR ikut naik — risk manager waspada."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. α + β = 0,95 pada GARCH. Artinya?"}
  options={
    ["Volatilitas tidak persisten",
    "Sangat persisten — shock lama hilang",
    "Model salah",
    "Tidak ada artinya"]
  }
  correct={1}
  explanation={"Benar: α+β ≈ 1 = ingatan panjang. Shock volatilitas butuh berminggu-minggu untuk reda (khas pasar saham)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Dua saham tidak stasioner tapi spread-nya stasioner. Ini?"}
  options={
    ["Spurious",
    "Kointegrasi — peluang pairs trading",
    "Kebetulan",
    "Autokorelasi"]
  }
  correct={1}
  explanation={"Benar: kombinasi linear stasioner = hubungan ekuilibrium jangka panjang. Spread menyimpang → mean-revert → trading."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. y_t = 0,5 + 0,7×y_{t−1}. y_T = 10. Forecast 2-step?"}
  options={
    ["7,5",
    "5,75",
    "1,67",
    "10,7"]}
  correct={1}
  explanation={"Benar: 1-step = 0,5+7 = 7,5; 2-step = 0,5+0,7×7,5 = 5,75. Forecast meluruh menuju mean 1,67 — jangan percaya AR untuk horizon jauh."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>AR(1)</strong>: stasioner jika |b1| &lt; 1 (mean-reverting).</li>
<li><strong>Unit root</strong> (b1=1) = random walk; regresi level = <strong>spurious</strong>.</li>
<li><strong>Dickey-Fuller</strong>: H0 = unit root; tolak jika stat &lt; kritis.</li>
<li><strong>Kointegrasi</strong>: kombinasi stasioner dari series tak stasioner.</li>
<li><strong>GARCH(1,1)</strong>: σ² = ω + αε² + βσ²; clustering volatilitas.</li>
<li><strong>Aturan</strong>: stasionerkan dulu, baru model.</li>

<li><strong>AR:</strong> forecast meluruh ke mean; PACF terpotong = AR(p).</li>
<li><strong>Unit root:</strong> uji DF (kritis −2,86); level tanpa kointegrasi = spurious.</li>
<li><strong>GARCH:</strong> volatilitas kondisional untuk risk; bukan untuk arah.</li>
<li><strong>Kapan TIDAK pakai:</strong> regresi level tanpa uji; forecast AR horizon jauh; VaR historis statis pasca-guncangan.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b1-regresi" className="btn btn-secondary btn-sm">← PM-B1</Link>
        <Link href="/learn/pm-b3-ml-investasi" className="btn btn-primary btn-sm">PM-B3 →</Link>
      </div>
    </div>
  );
}

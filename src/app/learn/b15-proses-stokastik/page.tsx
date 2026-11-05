import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B15ProsesStokastikPage() {
  const chart1 = [{"x": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], "y": [0.5, -0.5, 0, 1, 0.5, 1.5, 1, 2, 1.5, 2.5, 2.77, 1.55, 2.33, 3.1, 1.88, 2.66, 3.44, 2.21, 2.99, 3.77, 2.55, 3.32, 2.1, 2.88, 3.65, 2.43, 3.21, 3.99, 2.76, 3.54, 4.32, 3.1, 3.87, 2.65, 3.43, 4.2, 2.98, 3.76, 4.54, 3.31, 4.09, 4.87, 3.65, 4.42, 3.2, 3.98, 4.75, 3.53, 4.31, 5.09, 3.86, 4.64, 5.42, 4.2, 4.97, 3.75, 4.53, 5.3, 4.08, 4.86, 5.64, 4.41, 5.19, 5.97, 4.75, 5.52, 4.3, 5.08, 5.85, 4.63, 5.41, 6.19, 4.96, 5.74, 6.52, 5.3, 6.07, 4.85, 5.63, 6.4, 5.18, 5.96, 6.74, 5.51, 6.29, 7.07, 5.85, 6.62, 5.4, 6.18, 6.95, 5.73, 6.51, 7.29, 6.06, 6.84, 7.62, 6.4, 7.17, 5.95, 6.73], "type": "scatter", "mode": "lines", "name": "Random walk (ilustrasi)", "line": {"color": "#2a7de1"}}, {"x": [0, 100], "y": [10, 10], "type": "scatter", "mode": "lines", "name": "+√t", "line": {"color": "#94a3b8", "dash": "dash"}}, {"x": [0, 100], "y": [-10, -10], "type": "scatter", "mode": "lines", "name": "−√t", "line": {"color": "#94a3b8", "dash": "dash"}, "showlegend": false}];
  const lab1Code = String.raw`import random, statistics
random.seed(151)

def rw(n):
    s = 0
    for _ in range(n):
        s += 1 if random.random() < 0.5 else -1
    return s

for n in [100, 400, 1600, 10000]:
    xs = [rw(n) for _ in range(5000)]
    print(f"n={n:>6}: SD = {statistics.pstdev(xs):6.1f}  (teori √n = {n**0.5:6.1f})")
print()
print("Aturan pasar: SD tahunan = SD harian × √252")
print(f"SD harian 2% -> SD tahunan = {0.02 * 252**0.5:.1%}")
print("Coba: jika return BERKORELASI (tren), apakah √t masih berlaku? (tidak!)")`;
  const lab2Code = String.raw`import random, math, statistics
random.seed(152)
S0, mu, sigma, T = 10_000, 0.10, 0.30, 1.0
N = 5000
ST = [S0*math.exp((mu-0.5*sigma**2)*T + sigma*math.sqrt(T)*random.gauss(0,1)) for _ in range(N)]
ST.sort()
print(f"mean   = Rp{statistics.mean(ST):,.0f} (teori {S0*math.exp(mu*T):,.0f})")
print(f"median = Rp{statistics.median(ST):,.0f} (teori {S0*math.exp((mu-0.5*sigma**2)*T):,.0f})")
print(f"P(rugi) = {sum(1 for s in ST if s < S0)/N:.1%} (teori ~43%)")
print(f"kuantil 5%  = Rp{ST[int(0.05*N)]:,.0f}  <- VaR 95%!")
print(f"kuantil 95% = Rp{ST[int(0.95*N)]:,.0f}")
print("\nCoba: sigma=0.6. Apa yang terjadi pada median vs mean? (Jensen melebar!)")`;
  const quizData = [{"question": "Var(Sₙ) untuk random walk ±1 adalah…", "options": ["√n", "n", "n²", "0"], "correct": 1, "explanation": "Benar: varians jumlah inkremen independen = n. SD = √n."}, {"question": "VaR 1-hari Rp1 M. VaR 10-hari (i.i.d.) ≈ …", "options": ["Rp10 M", "Rp3,16 M (√10)", "Rp100 juta", "Tetap Rp1 M"], "correct": 1, "explanation": "Benar: skala √t. ×10 linear = kesalahan 3x lipat."}, {"question": "Koreksi −½σ² di GBM berasal dari…", "options": ["Regulasi", "Jensen/Itô: E[exp] > exp(E) — mean vs median", "Pembulatan", "Biaya transaksi"], "correct": 1, "explanation": "Benar: konveksitas eksponensial — E[S_t] = S₀e^μt tapi median lebih rendah."}, {"question": "Suku bunga lebih tepat dimodelkan…", "options": ["GBM", "OU (mean-reverting)", "Poisson", "Random walk biasa"], "correct": 1, "explanation": "Benar: suku bunga punya gravitasi ke normal — GBM bisa memprediksi 1000% (absurd)."}, {"question": "Jalur Brownian motion bersifat…", "options": ["Mulus & terdiferensiasi", "Kontinu tapi tidak terdiferensiasi di manapun (fraktal)", "Lurus", "Periodik"], "correct": 1, "explanation": "Benar: bergerigi di semua skala — &ldquo;tren jangka pendek&rdquo; biasanya ilusi."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B15 — Probabilitas</span>
        <h1 className="display-title">Proses Stokastik: Random Walk<br/>hingga GBM</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Pemabuk dan Harga Saham</a></li>
          <li><a href="#rw">Random Walk — Fondasi Diskret</a></li>
          <li><a href="#bm">Brownian Motion — Limit Kontinu</a></li>
          <li><a href="#gbm">GBM — Model Harga Saham</a></li>
          <li><a href="#ou">OU &amp; Poisson — Mean-Reversion dan Lompatan</a></li>
          <li><a href="#lab1">🔬 Lab 1: √t — Jarak Tipikal Random Walk</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi GBM — Harga Saham Setahun</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Proses Stokastik Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: VaR 10-Hari Portofolio</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>random walk</strong> dan sifat varians ∝ t.</li><li>Menurunkan <strong>Brownian motion</strong> sebagai limit random walk.</li><li>Menjelaskan <strong>GBM</strong> sebagai model harga saham + rumusnya.</li><li>Membedakan <strong>OU</strong> (mean-reverting) vs <strong>Poisson process</strong> (lompatan).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Pemabuk dan Harga Saham</h2>

      <div className="story"><p>Seorang pemabuk melangkah acak: tiap detik ke kiri atau kanan dengan peluang 50:50. Setelah 10.000 langkah, di mana dia? Jawabannya mengejutkan: <strong>jarak tipikalnya ~100 langkah dari awal</strong> — bukan 0, bukan 10.000.</p><p>Ini <strong>random walk</strong> — dan Louis Bachelier (1900!) menyadari harga saham berperilaku sama: tiap tick naik/turun acak, akumulasinya = random walk. Dari ide sesederhana pemabuk ini lahir <strong>Brownian motion</strong>, <strong>GBM</strong> (fondasi Black-Scholes!), dan seluruh pemodelan harga modern.</p><p>Lesson ini menaikkan tangga: diskret → kontinu, aditif → multiplikatif.</p><p><strong>Twist-nya:</strong> pemabuk setelah 10.000 langkah jaraknya ~100 — bukan 0. Keacakan tidak &ldquo;saling menghapus&rdquo;; ia <em>mengakumulasi</em> seperti akar kuadrat. Dan ironi terbesar: dari model semabuk inilah lahir gerak Brown, GBM, dan rumus Black-Scholes yang menggerakkan triliunan dolar. Keuangan modern berdiri di atas langkah sempoyongan orang mabuk.</p></div>

      <h2 id="rw">Random Walk — Fondasi Diskret</h2>

      <p><Tex math={String.raw`S_n = X_1 + X_2 + \cdots + X_n, \quad X_i = \pm 1`} block /></p>

      <ul>
<li><Tex math={String.raw`E[S_n] = 0`} />: ekspektasi tetap di awal (fair game).</li>
<li><Tex math={String.raw`\mathrm{Var}(S_n) = n`} />: varians <strong>tumbuh linear</strong> dengan waktu!</li>
<li><Tex math={String.raw`\text{SD}(S_n) = \sqrt{n}`} />: jarak tipikal ~ √n — 10.000 langkah → ~100.</li>
</ul>

      <p><strong>Kepribadian:</strong> random walk adalah &ldquo;difusi ketidaktahuan&rdquo; — makin lama, makin tidak tahu di mana (varians ∝ t), tapi ekspektasi tidak bias ke mana-mana. Akar kuadrat lagi: untuk 2x jarak tipikal butuh 4x waktu.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan √t ada di mana-mana: SD return tahunan = SD harian × √252. Volatilitas &ldquo;diskalakan&rdquo; dengan akar waktu — BUKAN linear! Ini sebabnya VaR 10-hari = VaR 1-hari × √10 (aturan Basel).</p>
</div>

      <h2 id="bm">Brownian Motion — Limit Kontinu</h2>

      <p>Perkecil langkah (→0) dan percepat (→∞) dengan skala tepat → <strong>gerak Brown standar</strong> <Tex math={String.raw`W_t`} />:</p>

      <ul>
<li><Tex math={String.raw`W_0 = 0`} />, jalur kontinu,</li>
<li>Inkremen independen: <Tex math={String.raw`W_t - W_s \sim N(0, t-s)`} /> — <strong>varians = selang waktu</strong>,</li>
<li><Tex math={String.raw`E[W_t] = 0,\ \mathrm{Var}(W_t) = t`} />.</li>
</ul>

      <p><strong>Mengapa penting?</strong> Brownian motion adalah &ldquo;atom&rdquo; proses kontinu — seperti Bernoulli untuk diskret. SDE (stochastic differential equation) ditulis sebagai:</p>

      <p><Tex math={String.raw`dX_t = \mu\,dt + \sigma\,dW_t`} block /></p>

      <p>&ldquo;Perubahan = tren (μ·dt) + guncangan acak (σ·dW)&rdquo; — template untuk SEMUA model difusi.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Jalur Brownian bisa diprediksi jika tahu polanya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Jalur Brown kontinu tapi <strong>tidak terdiferensiasi di titik manapun</strong> — bergerigi di semua skala (fraktal!). &ldquo;Tren&rdquo; yang kamu lihat di grafik harga jangka pendek hampir selalu ilusi random walk. Inilah alasan teknikal analisis murni pola sangat dipertanyakan.</p>
</div>

      <h2 id="gbm">GBM — Model Harga Saham</h2>

      <p>Harga tidak boleh negatif dan return-nya yang acak (bukan perubahan absolut) → pakai <strong>eksponensial dari Brown</strong>:</p>

      <p><Tex math={String.raw`dS_t = \mu S_t\,dt + \sigma S_t\,dW_t`} block /></p>

      <p>Solusinya (Itô):</p>

      <p><Tex math={String.raw`S_t = S_0\, \exp\!\left(\left(\mu - \tfrac{1}{2}\sigma^2\right)t + \sigma W_t\right)`} block /></p>

      <ul>
<li><Tex math={String.raw`\mu`} />: drift (return ekspektasi),</li>
<li><Tex math={String.raw`\sigma`} />: volatilitas,</li>
<li><Tex math={String.raw`-\frac{1}{2}\sigma^2`} />: <strong>koreksi Itô</strong> — Jensen (B5!) beraksi: E[S_t] = S_0·e^(μt), tapi median = S_0·e^((μ−σ²/2)t) &lt; mean!</li>
<li><Tex math={String.raw`\ln(S_t/S_0) \sim N`} />: <strong>log-return normal → harga lognormal</strong> (B7.1!).</li>
</ul>

      <p><strong>Kepribadian:</strong> GBM adalah &ldquo;random walk untuk orang kaya&rdquo; — bekerja di skala perkalian (return), bukan penjumlahan (rupiah). Inilah fondasi Black-Scholes (E11).</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>S0 = Rp10.000, μ = 10%/thn, σ = 30%/thn. Distribusi harga 1 tahun lagi?</p><p><strong>Langkah 1</strong> — ln(S₁/S₀) ~ N((0,1 − 0,045)×1, 0,09) = N(0,055; 0,09).</p><p><strong>Langkah 2</strong> — median S₁ = 10.000×e^0,055 ≈ <strong>Rp10.566</strong>.</p><p><strong>Langkah 3</strong> — E[S₁] = 10.000×e^0,1 ≈ <strong>Rp11.052</strong> (lebih tinggi — Jensen!).</p><p><strong>Langkah 4</strong> — P(S₁ &lt; 10.000) = P(Z &lt; −0,055/0,3) = P(Z &lt; −0,18) ≈ <strong>43%</strong> — meski ekspektasi +10%!</p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tiga angka GBM yang wajib bisa: <strong>mean</strong> (S₀e^μt), <strong>median</strong> (S₀e^((μ−σ²/2)t)), dan <strong>probabilitas di bawah level</strong> (via z-score log-return). Ketiganya beda — dan ketiganya dipakai.</p>
</div>

      <h2 id="ou">OU &amp; Poisson — Mean-Reversion dan Lompatan</h2>

      <h3>Ornstein-Uhlenbeck (mean-reverting)</h3>

      <p><Tex math={String.raw`dX_t = \theta(\mu - X_t)\,dt + \sigma\,dW_t`} block /></p>

      <p>&ldquo;Pegas&rdquo; yang menarik kembali ke μ dengan kekuatan θ. <strong>Kapan:</strong> suku bunga, volatilitas, spread pairs-trading — yang <em>tidak bisa kabur jauh</em>. GBM untuk harga saham (bisa 10x), OU untuk suku bunga (kembali ke normal).</p>

      <h3>Proses Poisson (lompatan)</h3>

      <p>Kejadian diskret di waktu kontinu: N_t ~ Poisson(λt) (B6.2!). <strong>Kapan:</strong> default, klaim, kedatangan order — <em>event</em>, bukan difusi mulus.</p>

      <h3>Jump-diffusion (Merton)</h3>

      <p>GBM + lompatan Poisson — untuk <strong>crash</strong>: difusi sehari-hari + lompatan sesekali. Model yang jujur untuk return saham berekor tebal.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Satu model cocok untuk semua deret waktu.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Harga saham (GBM, non-stasioner) ≠ suku bunga (OU, stasioner) ≠ default (Poisson, event). Salah model = salah sifat: memodelkan suku bunga dengan GBM memprediksi ia bisa 1000% (absurd); memodelkan harga dengan OU memprediksi ia kembali ke &ldquo;rata-rata&rdquo; (value trap!). Pilih model sesuai <em>sifat</em> data.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Random Walk: Tetap di Sekitar 0, Menyebar ∝ √t"
  layout={{"xaxis": {"title": "Langkah n"}, "yaxis": {"title": "Posisi Sₙ"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = satu jalur random walk; garis putus-putus = ±√n (amplop jarak tipikal).</p>
<p><strong>Interpretasi:</strong> Jalur berkelok tanpa tren (ekspektasi 0), tapi amplop melebar ∝ √n. <strong>Dua fakta dalam satu gambar:</strong> tak bisa diprediksi arahnya, tapi bisa diukur sebarannya. Inilah esensi pemodelan stokastik: bukan meramal jalur, melainkan mengukur distribusinya.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Dari langkah mabuk ke harga saham — satu tangga.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Random walk — di mana setelah 10.000 langkah?</summary>
              <p>Xᵢ = ±1 (50:50), Sₙ = ΣXᵢ, n = 10.000. Berapa E[Sₙ], Var(Sₙ), dan &ldquo;jarak tipikal&rdquo;? Berapa P(Sₙ &gt; 200)?</p>
              <p><strong>Langkah 1</strong> — E[Sₙ] = 0 (fair). Var(Sₙ) = n = 10.000 → SD = <strong>100</strong>.<br />
              <strong>Langkah 2</strong> — jarak tipikal ≈ SD = 100 (bukan 0, bukan 10.000!).<br />
              <strong>Langkah 3</strong> — CLT: Sₙ ≈ N(0, 100²). P(Sₙ &gt; 200) = P(Z &gt; 2) ≈ <strong>2,3%</strong>.</p>
              <p>Pelajaran: keacakan mengakumulasi ∝ √n. &ldquo;Rata-rata nol&rdquo; tidak berarti &ldquo;tetap di nol&rdquo; — varians adalah ceritanya.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: GBM — mean vs median harga</summary>
              <p>S₀ = 100, μ = 8%/thn, σ = 30%/thn, t = 1. Berapa E[S₁] dan median S₁? Mengapa beda?</p>
              <p><strong>Langkah 1</strong> — E[S₁] = 100·e<sup>0,08</sup> ≈ <strong>108,33</strong>.<br />
              <strong>Langkah 2</strong> — median = 100·e<sup>(0,08−0,09/2)×1</sup> = 100·e<sup>0,035</sup> ≈ <strong>103,56</strong>.<br />
              <strong>Langkah 3</strong> — selisih 4,77 = koreksi Itô (−½σ²): volatilitas <em>menggerogoti</em> median (Jensen, B5!).</p>
              <p>Pelajaran: investor &ldquo;tipikal&rdquo; (median) mendapat 3,6%, bukan 8%! Volatilitas adalah pajak tersembunyi atas return — inilah &ldquo;volatility drag&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: OU — suku bunga yang kembali</summary>
              <p>Suku bunga rₜ: d r = 0,5(0,04 − r)dt + 0,01 dW. Mulai r₀ = 0,08. Berapa ekspektasi r setelah 2 tahun? Seberapa cepat &ldquo;lupa&rdquo; titik awal?</p>
              <p><strong>Langkah 1</strong> — E[rₜ] = μ + (r₀−μ)e<sup>−θt</sup> = 0,04 + 0,04·e<sup>−1</sup> ≈ 0,04 + 0,0147 = <strong>5,47%</strong>.<br />
              <strong>Langkah 2</strong> — waktu paruh: ln2/θ ≈ <strong>1,39 tahun</strong> — setelah itu, separuh &ldquo;ingatan&rdquo; titik awal hilang.<br />
              <strong>Langkah 3</strong> — bandingkan dengan random walk (tidak pernah lupa!): OU = &ldquo;ada gravitasi ke mean&rdquo;.</p>
              <p>Pelajaran: θ = kekuatan mean-reversion. Data suku bunga/Kurs yang &ldquo;kembali&rdquo; = OU; yang &ldquo;melayang&rdquo; = random walk/GBM. Pilih model sesuai perilakunya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: √t — Jarak Tipikal Random Walk</h2>

      <p>Simulasikan random walk. Verifikasi SD(Sₙ) = √n dan aturan skala volatilitas √252.</p>

      <PyodideLab
  title="Lab 1 — Hukum Akar Kuadrat"
  hint="Peringatan: √t hanya untuk inkremen &lt;strong>independen&lt;/strong>. Ada autokorelasi → skala beda (inilah mengapa estimasi vol butuh kehati-hatian)."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Simulasi GBM — Harga Saham Setahun</h2>

      <p>Simulasikan 5.000 path GBM (S₀=10.000, μ=10%, σ=30%). Hitung mean, median, P(rugi).</p>

      <PyodideLab
  title="Lab 2 — GBM dari Nol"
  hint="Perhatikan mean > median — selalu, untuk GBM. Dan VaR langsung terbaca dari kuantil simulasi."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Proses Stokastik Mana?</h2>

      <div className="decision-card">
<h3>1. Harga aset (positif, multiplikatif) → <strong>GBM</strong></h3>
<p><strong>Kondisi data:</strong> Saham, komoditas, FX.</p>
<p><strong>Kenapa:</strong> Log-return normal → harga lognormal; tidak pernah negatif.</p>
<p><strong>Contoh nyata:</strong> Black-Scholes, simulasi harga (Lab 2).</p>
</div>

      <div className="decision-card">
<h3>2. Kembali ke rata-rata (suku bunga, vol, spread) → <strong>OU</strong></h3>
<p><strong>Kondisi data:</strong> Ada &ldquo;gravitasi&rdquo; ke level normal.</p>
<p><strong>Kenapa:</strong> Suku bunga 1000% absurd — butuh mean-reversion.</p>
<p><strong>Contoh nyata:</strong> Model Vasicek/CIR untuk suku bunga (MR15).</p>
</div>

      <div className="decision-card">
<h3>3. Kejadian diskret (default, klaim) → <strong>Poisson process</strong></h3>
<p><strong>Kondisi data:</strong> Event, bukan difusi.</p>
<p><strong>Kenapa:</strong> Menghitung &ldquo;berapa event&rdquo; per periode.</p>
<p><strong>Contoh nyata:</strong> Intensitas default dalam model reduksi (CR).</p>
</div>

      <div className="decision-card">
<h3>4. Difusi + crash sesekali → <strong>jump-diffusion</strong></h3>
<p><strong>Kondisi data:</strong> Return berekor tebal dengan lompatan.</p>
<p><strong>Kenapa:</strong> GBM murni meremehkan crash; lompatan Poisson menangkapnya.</p>
<p><strong>Contoh nyata:</strong> Pricing opsi saat earnings/makro.</p>
</div>

      <div className="decision-card">
<h3>5. Status diskret per periode → <strong>Markov chain (B14)</strong></h3>
<p><strong>Kondisi data:</strong> Bukan proses kontinu.</p>
<p><strong>Kenapa:</strong> Jika waktu diskret &amp; status diskret, Markov lebih pas.</p>
<p><strong>Contoh nyata:</strong> Migrasi rating bulanan.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Skala <strong>perkalian</strong> (harga) → GBM; ada <strong>pegas</strong> → OU; <strong>event</strong> → Poisson.</li><li>Vol diskala <strong>√t</strong> — bukan linear (butuh inkremen independen).</li><li>Untuk GBM: bedakan <strong>mean vs median</strong> (Jensen!) — dan laporkan keduanya.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: VaR 10-Hari Portofolio</h2>

      <div className="callout">
<p>Regulator meminta VaR 10-hari 99%. Tim menghitung VaR 1-hari = Rp1 M (via GBM/historis), lalu melaporkan VaR 10-hari = Rp10 M (×10).</p><p><strong>Pertanyaan:</strong> (a) Apa yang salah? (b) Berapa yang benar di bawah asumsi i.i.d.? (c) Kapan bahkan √10 pun salah?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Skala linear salah.</strong> Volatilitas tumbuh ∝ √t, bukan t — mengalikan 10 melebih-lebihkan 3x lipat (dan membuat modal boros / sinyal salah).</p><p>(b) VaR 10-hari = Rp1 M × √10 ≈ <strong>Rp3,16 M</strong> (asumsi i.i.d. dan distribusi stabil).</p><p>(c) <strong>√10 pun salah jika:</strong> return berautokorelasi (tren/vol clustering — butuh GARCH, A3.10), distribusi tidak stabil (regime change), atau ada lompatan (jump-diffusion). Aturan Basel memakai √10 sebagai <em>aproksimasi</em> — bank yang serius memodelkan langsung horizon 10-hari. <strong>Pelajaran:</strong> aturan skala adalah alat cepat, bukan kebenaran.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Random walk n = 2.500 langkah ±1. Berapa SD posisi akhir? Berapa peluang |Sₙ| &gt; 100?</li>
              <li>GBM: S₀ = 50, μ = 5%, σ = 40%, t = 2. Hitung E[S₂] dan mediannya. Berapa volatility drag per tahun?</li>
              <li>Proses Poisson λ = 3/jam. Berapa peluang tepat 5 event dalam 2 jam? Berapa peluang tidak ada event dalam 30 menit?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> SD = √2500 = <strong>50</strong>. P(|Sₙ| &gt; 100) = P(|Z| &gt; 2) ≈ <strong>4,6%</strong>.</p>
              <p><strong>2.</strong> E[S₂] = 50·e<sup>0,10</sup> ≈ <strong>55,26</strong>. Median = 50·e<sup>(0,05−0,08)×2</sup> = 50·e<sup>−0,06</sup> ≈ <strong>47,09</strong>. Drag = ½σ² = <strong>8%/tahun</strong> — volatilitas 40% menghapus seluruh drift 5% bahkan negatif untuk investor tipikal!</p>
              <p><strong>3.</strong> 2 jam: λt = 6 → P(X=5) = e<sup>−6</sup>6<sup>5</sup>/5! ≈ <strong>16,1%</strong>. 30 menit: λt = 1,5 → P(X=0) = e<sup>−1,5</sup> ≈ <strong>22,3%</strong>.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Random walk:</strong> Var ∝ t, SD ∝ √t — aturan skala volatilitas.</li><li><strong>Brownian:</strong> limit kontinu; inkremen N(0, dt) independen; template SDE.</li><li><strong>GBM:</strong> <Tex math={String.raw`dS = \mu S\,dt + \sigma S\,dW`} /> — harga lognormal; bedakan mean vs median.</li><li><strong>OU:</strong> mean-reverting (suku bunga); <strong>Poisson:</strong> event; <strong>jump-diffusion:</strong> keduanya.</li><li><strong>Jangan</strong> skala vol linear dengan waktu; <strong>jangan</strong> pakai satu model untuk semua deret.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b14-markov-chain" className="btn btn-secondary btn-sm">← ← B14</Link>
        <Link href="/learn/b16-heavy-tails-evt" className="btn btn-primary btn-sm">Next: B16 →</Link>
      </div>
    </div>
  );
}

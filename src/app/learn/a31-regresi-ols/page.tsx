"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A31Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const scatterFitData = [
    {
      x: [2, 5, 8, 12, 15, 18, 22, 25, 30, 35, 40, 45],
      y: [18, 26, 33, 45, 52, 60, 74, 80, 95, 108, 120, 133],
      mode: "markers",
      type: "scatter",
      name: "Observasi (DPD vs LGD)",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [2, 45],
      y: [16.2, 135.4],
      mode: "lines",
      type: "scatter",
      name: "Garis OLS",
      line: { color: "#e8a838", width: 3 },
    },
  ];

  const residualData = [
    {
      x: [16, 24, 32, 44, 54, 62, 72, 82, 96, 110, 122, 134],
      y: [1.8, 2.0, 1.0, 1.0, -2.0, -2.0, 2.0, -2.0, -1.0, -2.0, -2.0, -1.0],
      mode: "markers",
      type: "scatter",
      name: "Residual",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [16, 134],
      y: [0, 0],
      mode: "lines",
      type: "scatter",
      name: "Nol",
      line: { color: "#ef4444", width: 2, dash: "dash" },
    },
  ];

  const heteroData = [
    {
      x: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
      y: [12, 13.5, 15, 18, 17, 22, 21, 26, 24, 30, 27, 34],
      mode: "markers",
      type: "scatter",
      name: "Residual heteroskedastik",
      marker: { color: "#ef4444", size: 9 },
    },
    {
      x: [10, 65],
      y: [0, 0],
      mode: "lines",
      type: "scatter",
      name: "Nol",
      line: { color: "#64748b", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# OLS manual: estimasi LGD (ribu Rp) dari DPD (hari)
# Pure Python — tanpa library eksternal
dpd = [2, 5, 8, 12, 15, 18, 22, 25, 30, 35, 40, 45]
lgd = [18, 26, 33, 45, 52, 60, 74, 80, 95, 108, 120, 133]
n = len(dpd)

# Normal equations: beta1 = Cov(x,y)/Var(x), beta0 = ybar - beta1*xbar
mx = sum(dpd)/n; my = sum(lgd)/n
sxy = sum((x-mx)*(y-my) for x, y in zip(dpd, lgd))
sxx = sum((x-mx)**2 for x in dpd)
b1 = sxy/sxx
b0 = my - b1*mx

pred = [b0 + b1*x for x in dpd]
ssr = sum((y-p)**2 for y, p in zip(lgd, pred))
sst = sum((y-my)**2 for y in lgd)
r2 = 1 - ssr/sst

print(f"beta0 (intersep) = {b0:.2f}")
print(f"beta1 (slope)    = {b1:.2f}  -> tiap +1 hari DPD, LGD naik ~Rp{b1*1000:,.0f}")
print(f"R-squared        = {r2:.4f}")
print()
# Prediksi untuk DPD = 60 (EKSTRAPOLASI - di luar rentang data!)
print(f"Prediksi DPD=60  = {b0 + b1*60:.1f} ribu Rp  <- hati-hati, di luar data!")
print()
print("COBA: ubah satu nilai lgd jadi outlier (misal 133 -> 300),")
print("jalankan lagi, dan lihat beta1 ikut lari.")`;

  const lab2Code = `# Uji asumsi: apakah hubungan benar-benar linear?
# Data curiga: default rate vs rasio utang (hubungan sebenarnya melengkung)
rasio = [10, 20, 30, 40, 50, 60, 70, 80, 90]
dr    = [2, 3, 5, 8, 14, 22, 35, 52, 75]  # persen default
n = len(rasio)
mx = sum(rasio)/n; my = sum(dr)/n
sxy = sum((x-mx)*(y-my) for x, y in zip(rasio, dr))
sxx = sum((x-mx)**2 for x in rasio)
b1 = sxy/sxx; b0 = my - b1*mx
pred = [b0 + b1*x for x in rasio]
resid = [y-p for y, p in zip(dr, pred)]

print(f"Model linear: default = {b0:.1f} + {b1:.2f} * rasio")
r2 = 1 - sum(r**2 for r in resid)/sum((y-my)**2 for y in dr)
print(f"R2 = {r2:.3f}  <- terlihat 'bagus', TAPI...")
print()
print("Residual (y - prediksi), urut dari rasio kecil ke besar:")
for x, r in zip(rasio, resid):
    bar = "#" * int(abs(r)) + ("+" if r > 0 else "-")
    print(f"rasio {x:3d}: {r:+6.1f}  {bar}")
print()
print("KESIMPULAN: residual membentuk pola U (negatif di tengah, positif di ujung).")
print("Itu TANDA asumsi linearitas RUSAK - butuh transformasi/kuadratik.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.1 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Regresi Linear OLS:<br />Garis Lurus Paling Jujur — dan Paling Sering Berbohong</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model R²=0,92 yang Meramalkan Kerugian Negatif</a></li>
          <li><a href="#model">Model Regresi Linear — Anatomi Satu Persamaan</a></li>
          <li><a href="#ols">OLS — Si Tukang Ukur yang Benci Jarak Jauh</a></li>
          <li><a href="#asumsi">Asumsi Gauss-Markov — 5 Janji yang Sering Dilanggar</a></li>
          <li><a href="#inferensi">R², t-stat, p-value — Membaca Hasil tanpa Tertipu</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung OLS dari Nol (Pure Python)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Menangkap Pelanggaran Asumsi dari Residual</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan OLS, Kapan Minggir</a></li>
          <li><a href="#case">📋 Mini-Case: Estimasi LGD untuk Cadangan Bank</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menurunkan dan menghitung estimator OLS (<Tex math={String.raw`\hat{\beta}`} />) dari rumus normal equations untuk regresi sederhana.</li>
          <li>Menyebutkan 5 asumsi Gauss-Markov dan menjelaskan konsekuensi praktis jika masing-masing dilanggar.</li>
          <li>Menginterpretasikan koefisien regresi dengan benar (termasuk perangkap &ldquo;ceteris paribus&rdquo;) dan membaca R², t-stat, p-value tanpa tertipu.</li>
          <li>Mendiagnosis pelanggaran asumsi dari pola residual — dan memilih perbaikan yang tepat (transformasi, robust SE, atau ganti model).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Model R²=0,92 yang Meramalkan Kerugian Negatif</h2>
      <div className="story">
        <p>Tim risiko Bank &ldquo;CuanTerus&rdquo; bangga bukan main. Model mereka memprediksi LGD (<em>loss given default</em> — kerugian saat nasabah gagal bayar) hanya dari satu variabel: DPD (<em>days past due</em>, hari keterlambatan). R² = 0,92. Hampir sempurna. Model langsung dipakai menentukan cadangan kerugian.</p>
        <p>Sebulan kemudian, analis junior iseng memasukkan DPD = 5 hari ke model untuk segmen KPR baru. Output: <strong>LGD = −Rp2,1 juta</strong>. Kerugian <em>negatif</em> — artinya nasabah gagal bayar justru <em>memberi bank untung</em>? Tentu saja absurd.</p>
        <p>Twist-nya: tidak ada yang salah dengan matematikanya. Yang salah: model dilatih di rentang DPD 30–180 hari, lalu dipakai di DPD 5 hari — <strong>ekstrapolasi</strong>. Dan hubungan aslinya melengkung, bukan lurus. R²=0,92 hanya mengukur &ldquo;kecocokan di dalam sampel&rdquo;, bukan &ldquo;kebenaran di luar sampel&rdquo;. Lesson ini tentang kapan garis lurus bisa dipercaya — dan kapan ia berbohong dengan percaya diri.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="model">Model Regresi Linear — Anatomi Satu Persamaan</h2>
      <p><strong>Definisi.</strong> Regresi linear memodelkan hubungan antara variabel target <Tex math={String.raw`y`} /> dan satu/beberapa prediktor <Tex math={String.raw`x`} /> sebagai garis (atau bidang) lurus plus noise:</p>
      <Tex math={String.raw`y_i = \beta_0 + \beta_1 x_{i1} + \beta_2 x_{i2} + \cdots + \beta_k x_{ik} + \varepsilon_i`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`y_i`} />: nilai target observasi ke-<Tex math={String.raw`i`} /> (misal LGD nasabah ke-<Tex math={String.raw`i`} />)</li>
        <li><Tex math={String.raw`\beta_0`} /> (intersep): nilai <Tex math={String.raw`y`} /> saat semua <Tex math={String.raw`x = 0`} /> — sering tidak bermakna secara bisnis (DPD = 0 hari tapi sudah default? aneh), tapi dibutuhkan matematikanya</li>
        <li><Tex math={String.raw`\beta_j`} />: <strong>efek marjinal</strong> — rata-rata <Tex math={String.raw`y`} /> berubah sebesar <Tex math={String.raw`\beta_j`} /> tiap <Tex math={String.raw`x_j`} /> naik 1 satuan, <em>variabel lain dianggap tetap</em> (<em>ceteris paribus</em>)</li>
        <li><Tex math={String.raw`\varepsilon_i`} /> (error/galat): semua yang tidak dijelaskan model — faktor tak teramati, kesalahan ukur, keacakan murni</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: membaca koefisien</summary>
        <p>Model terestimasi: <Tex math={String.raw`\widehat{LGD} = 5{,}2 + 2{,}77 \times DPD`} /> (dalam ribu Rp).</p>
        <p><strong>Langkah 1</strong> — intersep 5,2: saat DPD = 0, prediksi LGD = Rp5,2 ribu. (Tidak terlalu bermakna — ekstrapolasi ke 0.)<br />
        <strong>Langkah 2</strong> — slope 2,77: tiap tambahan 1 hari keterlambatan, LGD naik rata-rata <strong>Rp2.770</strong>, dengan asumsi tidak ada variabel lain yang berubah.<br />
        <strong>Langkah 3</strong> — prediksi DPD = 30: 5,2 + 2,77&times;30 = <strong>Rp88,3 ribu</strong>.</p>
        <p>Angka 2,77 adalah &ldquo;harga&rdquo; satu hari keterlambatan menurut data — bukan menurut teori, bukan menurut bos.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> regresi linear itu &ldquo;linear dalam <strong>parameter</strong>, bukan dalam <strong>variabel</strong>&rdquo;. Model <Tex math={String.raw`y = \beta_0 + \beta_1 x^2 + \varepsilon`} /> tetap regresi linear (karena <Tex math={String.raw`\beta`} />-nya linear) — kamu boleh memasukkan <Tex math={String.raw`x^2`} />, <Tex math={String.raw`\log(x)`} />, bahkan interaksi <Tex math={String.raw`x_1 x_2`} /> sebagai &ldquo;variabel&rdquo; baru. Yang tidak linear: <Tex math={String.raw`y = \beta_0 + x^{\beta_1}`} />.</p>
      </div>

      <h2 id="ols">OLS — Si Tukang Ukur yang Benci Jarak Jauh</h2>
      <p><strong>Definisi.</strong> OLS (<em>Ordinary Least Squares</em> — kuadrat terkecil biasa) memilih <Tex math={String.raw`\hat{\beta}`} /> yang <strong>meminimalkan jumlah kuadrat residual</strong> (SSR — <em>sum of squared residuals</em>):</p>
      <Tex math={String.raw`\min_{\beta} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2, \quad \hat{y}_i = x_i'\beta`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\hat{y}_i`} />: prediksi model untuk observasi ke-<Tex math={String.raw`i`} /></li>
        <li><Tex math={String.raw`y_i - \hat{y}_i`} />: residual — kesalahan prediksi untuk observasi itu</li>
        <li>Kuadrat dipakai agar error positif dan negatif tidak saling menghapus, dan error besar dihukum <strong>lebih dari proporsional</strong></li>
      </ul>
      <p>Solusinya punya rumus tertutup (<em>normal equations</em>):</p>
      <Tex math={String.raw`\hat{\beta} = (X'X)^{-1}X'y`} block />
      <p>Untuk regresi sederhana (satu <Tex math={String.raw`x`} />), ini menyederhanakan menjadi rumus yang bisa dihitung pakai kalkulator:</p>
      <Tex math={String.raw`\hat{\beta}_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} = \frac{\text{Cov}(x,y)}{\text{Var}(x)}, \qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}`} block />

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;OLS mencari garis yang melewati sebanyak mungkin titik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> OLS tidak peduli berapa titik yang dilewati — ia meminimalkan <em>total kuadrat jarak vertikal</em>. Satu titik jauh (outlier) bisa menyeret seluruh garis karena hukumannya kuadratik: error 10 dihukum 100, error 1 dihukum 1. Inilah mengapa OLS sangat sensitif terhadap outlier — ia &ldquo;benci jarak jauh&rdquo; sampai rela mengorbankan kecocokan di 99 titik demi mendekati 1 titik ekstrem.</p>
      </div>

      <p><strong>Kepribadian OLS:</strong> ia demokratis tapi penakut — setiap observasi didengar, tapi satu teriakan (outlier) membuatnya panik dan mengubah arah. Teorema Gauss-Markov memberinya medali: <strong>di antara semua estimator linear yang tak bias, OLS punya variansi terkecil (BLUE — <em>best linear unbiased estimator</em>)</strong> — TAPI medali itu hanya berlaku jika 5 asumsi di bawah dipenuhi.</p>

      <PlotlyChart
        data={scatterFitData}
        title="Scatter DPD vs LGD + Garis OLS"
        layout={{ xaxis: { title: "DPD (hari)" }, yaxis: { title: "LGD (ribu Rp)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = DPD (hari keterlambatan), vertikal = LGD (kerugian, ribu Rp). Titik biru = observasi nyata; garis kuning = prediksi OLS.</p>
        <p><strong>Interpretasi:</strong> titik-titik mengikuti garis dengan cukup rapat — hubungan terlihat linear di rentang ini. Tapi perhatikan: garis hanya &ldquo;berhak&rdquo; bicara di rentang DPD 2–45 hari (tempat ada data). Memperpanjang garis ke kiri (DPD &lt; 0) atau jauh ke kanan adalah ekstrapolasi — persis kesalahan Bank CuanTerus.</p>
      </div>

      <h2 id="asumsi">Asumsi Gauss-Markov — 5 Janji yang Sering Dilanggar</h2>
      <p>BLUE hanya berlaku jika:</p>
      <ol>
        <li><strong>Linearitas dalam parameter</strong> — hubungan benar-benar bisa ditulis <Tex math={String.raw`y = X\beta + \varepsilon`} />. <em>Pelanggaran:</em> hubungan aslinya melengkung. <em>Gejala:</em> residual berpola (U atau gelombang), bukan acak. <em>Obat:</em> transformasi (<Tex math={String.raw`\log`} />, kuadrat) atau model non-linear.</li>
        <li><strong>Eksogenitas</strong> — <Tex math={String.raw`E[\varepsilon_i | X] = 0`} />: error tidak berkorelasi dengan prediktor. <em>Pelanggaran:</em> ada variabel penting yang tidak dimasukkan (<em>omitted variable bias</em>) — misal memprediksi default dari pendapatan tanpa memasukkan riwayat kredit. <em>Gejala:</em> koefisien berubah drastis saat variabel ditambah/dikurangi. <em>Obat:</em> masukkan variabel yang relevan; jika tidak teramati, butuh metode kausal (A3.13).</li>
        <li><strong>Homoskedastisitas</strong> — <Tex math={String.raw`Var(\varepsilon_i | X) = \sigma^2`} />: sebaran error konstan di semua level <Tex math={String.raw`x`} />. <em>Pelanggaran:</em> error makin besar saat <Tex math={String.raw`x`} /> besar (umum di data keuangan!). <em>Gejala:</em> residual membentuk corong/kipas. <em>Obat:</em> robust standard errors atau transformasi log. Koefisien tetap tak bias — yang rusak hanya uji statistiknya.</li>
        <li><strong>Tidak ada autokorelasi</strong> — <Tex math={String.raw`Cov(\varepsilon_i, \varepsilon_j) = 0`} /> untuk <Tex math={String.raw`i \neq j`} />. <em>Pelanggaran:</em> data time series — error hari ini mirip error kemarin. <em>Gejala:</em> residual berurutan membentuk gelombang. <em>Obat:</em> model time series (A3.9) atau Newey-West SE.</li>
        <li><strong>Tidak ada multikolinearitas sempurna</strong> — tidak ada prediktor yang kombinasi linear persis dari lainnya. <em>Pelanggaran ringan (umum):</em> dua prediktor sangat berkorelasi (misal pendapatan &amp; pengeluaran). <em>Gejala:</em> koefisien tidak stabil, standard error membengkak, tanda koefisien aneh. <em>Obat:</em> buang satu variabel, atau regularisasi (A3.3).</li>
      </ol>
      <p>Bonus untuk inference (uji hipotesis): <strong>normalitas error</strong> — dibutuhkan agar t-stat dan p-value valid di sampel kecil. Di sampel besar, teorema limit pusat menyelamatkan.</p>

      <PlotlyChart
        data={residualData}
        title="Residual vs Prediksi: Pola SEHAT (acak di sekitar nol)"
        layout={{ xaxis: { title: "Prediksi ŷ" }, yaxis: { title: "Residual (y − ŷ)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = nilai prediksi model, vertikal = residual (error). Garis merah putus-putus = nol (prediksi sempurna).</p>
        <p><strong>Interpretasi:</strong> titik tersebar acak di sekitar nol, tanpa pola — inilah residual yang sehat. Bandingkan dengan chart berikutnya: pola corong = heteroskedastisitas, pola lengkung = non-linearitas. <strong>Aturan emas diagnostik: selalu plot residual SEBELUM percaya model.</strong></p>
      </div>

      <PlotlyChart
        data={heteroData}
        title="Residual vs Prediksi: Pola SAKIT (corong = heteroskedastisitas)"
        layout={{ xaxis: { title: "Prediksi ŷ" }, yaxis: { title: "Residual (y − ŷ)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama seperti chart sebelumnya — residual vs prediksi.</p>
        <p><strong>Interpretasi:</strong> sebaran residual <strong>melebar</strong> seiring prediksi membesar — bentuk corong/kipas. Ini heteroskedastisitas: model makin tidak pasti untuk nilai besar. Sangat umum di data keuangan (kerugian besar lebih sulit diprediksi tepat). Koefisien OLS masih tak bias, tapi standard error &amp; p-value-nya tidak bisa dipercaya → pakai <strong>robust standard errors</strong> (dibahas A3.2).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan mantra diagnostik — <strong>&ldquo;acak = sehat, pola = sakit&rdquo;</strong>. Residual yang acak di sekitar nol berarti model sudah menangkap semua pola sistematis. Residual berpola berarti ada informasi yang belum ditangkap model — dan pola bentuknya memberi tahu obatnya (lengkung → transformasi; corong → robust SE; gelombang → time series).</p>
      </div>

      <h2 id="inferensi">R², t-stat, p-value — Membaca Hasil tanpa Tertipu</h2>
      <p><strong>R² (koefisien determinasi)</strong> — proporsi variansi <Tex math={String.raw`y`} /> yang dijelaskan model:</p>
      <Tex math={String.raw`R^2 = 1 - \frac{SSR}{SST} = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}`} block />
      <ul>
        <li><Tex math={String.raw`SSR`} />: variansi yang <em>tidak</em> dijelaskan (sisa error); <Tex math={String.raw`SST`} />: total variansi <Tex math={String.raw`y`} /></li>
        <li>R² = 0,92 artinya 92% variasi LGD &ldquo;dijelaskan&rdquo; DPD — <strong>di dalam sampel</strong></li>
        <li><strong>Adjusted R²</strong> menghukum penambahan variabel tak berguna: <Tex math={String.raw`\bar{R}^2 = 1 - (1-R^2)\frac{n-1}{n-k-1}`} /> (<Tex math={String.raw`k`} /> = jumlah prediktor). Selalu pakai ini saat membandingkan model dengan jumlah variabel beda.</li>
      </ul>
      <p><strong>Uji signifikansi koefisien</strong> — untuk tiap <Tex math={String.raw`\beta_j`} />:</p>
      <Tex math={String.raw`t = \frac{\hat{\beta}_j}{SE(\hat{\beta}_j)}, \qquad p\text{-value} = P(|T| > |t| \mid H_0: \beta_j = 0)`} block />
      <ul>
        <li><Tex math={String.raw`SE`} />: standard error — seberapa goyang estimasi koefisien antar sampel</li>
        <li>p-value kecil (&lt; 0,05): &ldquo;data seperti ini jarang terjadi jika <Tex math={String.raw`\beta_j`} /> benar-benar nol&rdquo; → koefisien dianggap signifikan</li>
        <li><strong>Confidence interval 95%:</strong> <Tex math={String.raw`\hat{\beta}_j \pm 1{,}96 \times SE`} /> — rentang nilai <Tex math={String.raw`\beta_j`} /> yang masih masuk akal menurut data</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;R² tinggi berarti model bagus dan bisa dipakai prediksi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> R² hanya mengukur kecocokan <em>di dalam sampel latih</em>. Model yang menghafal noise (overfit) bisa R² = 0,99 tapi hancur di data baru. R² juga naik otomatis tiap tambah variabel — bahkan variabel acak! Untuk klaim prediksi, butuh <strong>validasi out-of-sample</strong> (A3.8): uji model di data yang belum pernah dilihatnya.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;p-value kecil berarti efeknya besar dan penting.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> p-value hanya menjawab &ldquo;apakah efek ini (mungkin) bukan nol?&rdquo; — bukan &ldquo;seberapa besar?&rdquo;. Dengan 1 juta observasi, efek Rp100 pun bisa &ldquo;sangat signifikan&rdquo; (p &lt; 0,001) tapi tidak material bagi bisnis. Selalu baca <strong>besar koefisien + confidence interval</strong>, bukan cuma bintangnya. Signifikansi statistik ≠ signifikansi bisnis.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> koefisien regresi <strong>bukan</strong> efek kausal — ia hanya asosiasi <em>setelah mengontrol</em> variabel lain di model. &ldquo;DPD naik 1 hari → LGD naik Rp2.770&rdquo; tidak berarti <em>menunda pembayaran menyebabkan</em> kerugian naik; bisa jadi keduanya disebabkan faktor ketiga (misal PHK). Untuk klaim sebab-akibat butuh desain kausal (A3.13), bukan sekadar regresi observasional.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. OLS = &ldquo;garis yang meminimalkan kuadrat kesalahan&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: OLS 3 titik — hitung manual</summary>
              <p>Data: (1, 2), (2, 4), (3, 5). Hitung <Tex math={String.raw`\hat{\beta}_0, \hat{\beta}_1`} /> manual.</p>
              <p><strong>Langkah 1</strong> — x̄ = 2, ȳ = 11/3 ≈ 3,667.<br />
              <strong>Langkah 2</strong> — <Tex math={String.raw`\hat{\beta}_1 = \frac{\sum(x_i-\bar{x})(y_i-\bar{y})}{\sum(x_i-\bar{x})^2}`} />. Pembilang: (−1)(−1,667) + 0 + (1)(1,333) = 3,0. Penyebut: 1 + 0 + 1 = 2. → <strong>β̂₁ = 1,5</strong>.<br />
              <strong>Langkah 3</strong> — β̂₀ = ȳ − β̂₁x̄ = 3,667 − 3 = <strong>0,667</strong>.<br />
              <strong>Langkah 4</strong> — garis: ŷ = 0,667 + 1,5x. Cek: x=2 → 3,667 = ȳ ✓ (garis OLS selalu lewat (x̄, ȳ)!).</p>
              <p>Pelajaran: rumus OLS = kovarians/varians. Sekali hitung manual, rumusnya &ldquo;hidup&rdquo; — bukan simbol mati.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Interpretasi — &ldquo;ceteris paribus&rdquo;</summary>
              <p>Model: <code className="inline">dpd ~ penghasilan + umur</code>. Koef penghasilan = −2,1 (per Rp1jt), p &lt; 0,001. Artinya?</p>
              <p><strong>Langkah 1</strong> — &ldquo;Setiap +Rp1jt penghasilan, dpd turun 2,1 hari — <em>dengan umur sama</em> (ceteris paribus).&rdquo;<br />
              <strong>Langkah 2</strong> — <strong>bukan</strong> &ldquo;naikkan gaji orang 1jt → dpd turun&rdquo; (kausal!). Ini asosiasi terkontrol, bukan eksperimen.<br />
              <strong>Langkah 3</strong> — cek satuan: koef per Rp1 — bukan per Rp1jt — akan terbaca −0,0000021 (sama, tapi tidak terbaca manusia!). Selalu skala ke satuan bermakna.</p>
              <p>Pelajaran: interpretasi regresi = &ldquo;asosiasi dengan kontrol&rdquo;. Untuk klaim kausal → butuh desain kausal (A2.13/A3.13!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Hitung OLS dari Nol (Pure Python)</h2>
      <p>Tidak ada library — hanya rumus normal equations yang kamu hitung sendiri. Perhatikan interpretasi slope-nya.</p>
      <PyodideLab
        title="Lab 1 — OLS Manual: DPD → LGD"
        hint="Coba: ubah satu nilai lgd jadi outlier (misal 133 → 300), jalankan lagi. Berapa slope barunya? Itulah sensitivitas OLS."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Menangkap Pelanggaran Asumsi dari Residual</h2>
      <p>Data ini punya R² yang &ldquo;bagus&rdquo; — tapi plot residualnya bercerita lain. Jalankan dan baca pola residualnya.</p>
      <PyodideLab
        title="Lab 2 — Detektif Residual: Linearitas Rusak"
        hint="Coba: ganti dr dengan versi linear (misal dr = [3,6,9,12,15,18,21,24,27]) lalu jalankan — residual jadi acak. Bandingkan rasanya."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan OLS, Kapan Minggir</h2>

      <div className="decision-card">
        <h3>1. Hubungan linear, asumsi terpenuhi → <strong>OLS biasa</strong></h3>
        <p><strong>Kondisi:</strong> scatterplot <Tex math={String.raw`y`} /> vs <Tex math={String.raw`x`} /> lurus, residual acak, tidak ada outlier ekstrem.</p>
        <p><strong>Kenapa:</strong> OLS adalah BLUE — tak ada estimator linear tak bias yang lebih efisien. Sederhana, interpretable, cepat.</p>
        <p><strong>Contoh nyata:</strong> estimasi LGD dari DPD di rentang data yang wajar; hubungan suku bunga vs pertumbuhan kredit jangka pendek.</p>
      </div>

      <div className="decision-card">
        <h3>2. Residual corong (heteroskedastisitas) → <strong>OLS + robust SE</strong>, atau transformasi log</h3>
        <p><strong>Kondisi:</strong> sebaran residual melebar/menyempit seiring <Tex math={String.raw`\hat{y}`} />.</p>
        <p><strong>Kenapa:</strong> koefisien tetap tak bias — yang rusak hanya standard error &amp; p-value. Robust SE (White/HC) memperbaikinya tanpa mengubah koefisien. Alternatif: <Tex math={String.raw`\log(y)`} /> sering menstabilkan variansi data keuangan.</p>
        <p><strong>Contoh nyata:</strong> prediksi nominal kerugian kredit (error untuk loss besar jauh lebih lebar).</p>
      </div>

      <div className="decision-card">
        <h3>3. Hubungan melengkung → <strong>transformasi atau polynomial</strong></h3>
        <p><strong>Kondisi:</strong> residual berpola U/gelombang; scatterplot melengkung.</p>
        <p><strong>Kenapa:</strong> asumsi linearitas rusak — OLS memaksa garis lurus ke hubungan yang bengkok. Tambahkan <Tex math={String.raw`x^2`} /> atau pakai <Tex math={String.raw`\log(x)`} />; tetap &ldquo;regresi linear&rdquo; karena linear dalam parameter.</p>
        <p><strong>Contoh nyata:</strong> default rate vs rasio utang (risiko meledak di atas ambang tertentu).</p>
      </div>

      <div className="decision-card">
        <h3>4. Outlier berpengaruh besar → <strong>regresi robust</strong> (Huber) atau investigasi</h3>
        <p><strong>Kondisi:</strong> 1–2 titik menyeret garis; dihapus → koefisien berubah drastis.</p>
        <p><strong>Kenapa:</strong> hukuman kuadratik OLS memberi outlier pengaruh berlebihan. Regresi robust menghukum error besar secara linear, bukan kuadratik. Tapi JANGAN asal hapus — outlier bisa jadi sinyal fraud!</p>
        <p><strong>Contoh nyata:</strong> satu nasabah korporat raksasa di data UMKM.</p>
      </div>

      <div className="decision-card">
        <h3>5. Prediktor saling berkorelasi kuat → <strong>seleksi variabel atau regularisasi</strong></h3>
        <p><strong>Kondisi:</strong> VIF tinggi (&gt; 10), koefisien tidak stabil, tanda aneh.</p>
        <p><strong>Kenapa:</strong> model bingung membagi &ldquo;jasa&rdquo; antar variabel yang bergerak bersama. Solusi: buang satu, gabungkan jadi indeks, atau Ridge/Lasso (A3.3).</p>
        <p><strong>Contoh nyata:</strong> pendapatan, pengeluaran, dan limit kartu kredit sebagai prediktor bersamaan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Plot dulu, percaya kemudian</strong> — scatterplot + residual plot sebelum baca R².</li>
          <li>Residual acak = sehat. Berpola = ada yang salah, dan bentuk polanya = petunjuk obatnya.</li>
          <li>R² tinggi ≠ boleh ekstrapolasi. Model hanya berhak bicara di rentang datanya.</li>
          <li>Koefisien = asosiasi terkontrol, <strong>bukan</strong> bukti kausal.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Estimasi LGD untuk Cadangan Bank</h2>
      <div className="callout">
        <p>Kamu analis risiko. Regulator meminta estimasi LGD portofolio KPR macet untuk cadangan (CKPN). Kamu regresikan LGD (juta Rp) ke DPD dan LTV (<em>loan-to-value</em>, %):</p>
        <p><Tex math={String.raw`\widehat{LGD} = -12{,}4 + 1{,}9 \times DPD + 0{,}62 \times LTV`} />, R² = 0,71, n = 2.400.</p>
        <ul>
          <li>Koefisien DPD: 1,9 (SE = 0,15, p &lt; 0,001) → 95% CI: [1,61; 2,19]</li>
          <li>Koefisien LTV: 0,62 (SE = 0,40, p = 0,12) → 95% CI: [−0,16; 1,40]</li>
          <li>Intersep −12,4: LGD negatif saat DPD = LTV = 0??</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Interpretasikan koefisien DPD dengan benar. (b) Apakah LTV &ldquo;tidak berpengaruh&rdquo;? (c) Apa masalah intersep negatif, dan haruskah diperbaiki?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiap +1 hari DPD, LGD naik rata-rata Rp1,9 juta</strong>, dengan LTV dianggap tetap (<em>ceteris paribus</em>) — dan hanya valid di rentang DPD data latih. CI [1,61; 2,19] artinya efeknya cukup presisi, bukan sekadar &ldquo;signifikan&rdquo;.</p>
          <p>(b) <strong>Tidak.</strong> p = 0,12 hanya berarti &ldquo;data ini masih masuk akal jika efek LTV = 0&rdquo; — bukan bukti efeknya nol. CI-nya [−0,16; 1,40] mencakup efek positif sampai Rp1,4 juta per poin LTV — itu material! Kemungkinan ada multikolinearitas (LTV berkorelasi dengan DPD) yang menggembungkan SE. Jangan buang variabel hanya karena p &gt; 0,05.</p>
          <p>(c) Intersep −12,4 adalah <strong>ekstrapolasi</strong> ke titik (DPD=0, LTV=0) yang tidak ada di data (nasabah default dengan DPD 0 hari tidak masuk akal). Tidak perlu &ldquo;diperbaiki&rdquo; — cukup jangan dipakai untuk prediksi di titik itu. Jika prediksi butuh non-negatif, pertimbangkan model <Tex math={String.raw`\log(LGD)`} /> atau GLM.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>R² = 0,18. Interpretasikan dengan benar (dan sebutkan 1 miskonsepsi umum).</li>
              <li>Mengapa <em>tidak boleh</em> membandingkan R² model dengan target berbeda (mis. dpd vs log(dpd))?</li>
              <li>Koefisien berubah tanda saat variabel ditambah (Simpson!). Apa artinya?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> &ldquo;Model menjelaskan 18% variasi dpd.&rdquo; Miskonsepsi: &ldquo;R² kecil = model buruk&rdquo; — untuk perilaku manusia, 0,18 normal; yang penting signifikansi koef &amp; validasi out-of-sample.</p>
              <p><strong>2.</strong> R² = 1 − SSE/SST — SST beda (varians dpd vs varians log(dpd)) → tidak comparable. Bandingkan via <em>metrik bisnis yang sama</em> (mis. MAE dalam rupiah) atau informasi criteria pada skala sama.</p>
              <p><strong>3.</strong> <strong>Confounding/multikolinearitas</strong>: variabel baru &ldquo;mencuri&rdquo; penjelasan (atau membalik via Simpson). Jangan baca koef parsial sebagai efek kausal; cek VIF &amp; korelasi antar prediktor.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Model LGD = 5,2 + 2,77×DPD dipakai memprediksi nasabah dengan DPD 200 hari, padahal data latih hanya DPD 2–45 hari. Masalah utama?"
        options={[
          "R² pasti turun",
          "Ekstrapolasi — model tidak punya bukti hubungan tetap linear di luar rentang data",
          "Intersep harus nol",
          "Tidak ada masalah, OLS selalu valid",
        ]}
        correct={1}
        explanation="Benar: ekstrapolasi. OLS hanya 'berhak' bicara di rentang x tempat ia dilatih. Di luar itu, hubungan bisa melengkung, jenuh, atau berubah rezim — persis jebakan Bank CuanTerus."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Manakah pernyataan yang TEPAT tentang estimator OLS?"
        options={[
          "OLS meminimalkan jumlah residual (bukan kuadratnya)",
          "OLS adalah BLUE hanya jika asumsi Gauss-Markov terpenuhi",
          "OLS selalu tak bias bahkan jika ada omitted variable",
          "OLS kebal terhadap outlier karena memakai kuadrat",
        ]}
        correct={1}
        explanation="Benar: status BLUE (best linear unbiased estimator) bersyarat pada asumsi Gauss-Markov. Omitted variable yang berkorelasi dengan x menimbulkan bias; hukuman kuadratik justru membuat OLS sensitif outlier."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Residual plot menunjukkan pola corong (melebar ke kanan). Diagnosis dan langkah tepat?"
        options={[
          "Linearitas rusak → tambah x²",
          "Heteroskedastisitas → koefisien tetap tak bias, tapi pakai robust SE / pertimbangkan transformasi log",
          "Autokorelasi → pakai model ARIMA",
          "Tidak ada masalah, abaikan saja",
        ]}
        correct={1}
        explanation="Benar: corong = heteroskedastisitas. Koefisien OLS masih tak bias, yang rusak adalah standard error dan p-value. Robust SE memperbaikinya; transformasi log sering menstabilkan variansi data keuangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Koefisien = 0,03 dengan p < 0,001 pada n = 500.000. Interpretasi yang jujur?"
        options={[
          "Efeknya sangat penting karena sangat signifikan",
          "Signifikan secara statistik, tapi besar efeknya (0,03) harus dinilai dari sisi bisnis — signifikansi ≠ materialitas",
          "p kecil berarti R² pasti tinggi",
          "Koefisien pasti kausal",
        ]}
        correct={1}
        explanation="Benar: sampel raksasa membuat efek mungil pun 'signifikan'. Selalu baca besar koefisien + confidence interval dan tanya: apakah 0,03 material bagi bisnis? Bintang signifikansi bukan nilai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua prediktor (pendapatan & pengeluaran) berkorelasi 0,95. Gejala yang akan muncul?"
        options={[
          "R² pasti rendah",
          "Koefisien tidak stabil, SE membengkak, tanda bisa aneh — multikolinearitas",
          "Residual pasti berpola",
          "OLS tidak bisa dihitung sama sekali",
        ]}
        correct={1}
        explanation="Benar: multikolinearitas. Model kesulitan membagi 'jasa' antar dua variabel yang bergerak bersama → SE besar, koefisien goyang antar sampel. Solusi: buang satu, gabungkan, atau regularisasi (A3.3)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kapan adjusted R² LEBIH tepat dipakai daripada R² biasa?"
        options={[
          "Selalu — adjusted R² tidak pernah lebih kecil",
          "Saat membandingkan model dengan jumlah prediktor berbeda, karena R² biasa naik otomatis tiap tambah variabel",
          "Hanya untuk regresi sederhana",
          "Saat n sangat kecil",
        ]}
        correct={1}
        explanation="Benar: R² biasa tidak pernah turun saat tambah variabel (bahkan variabel acak!), sehingga menyesatkan untuk perbandingan model. Adjusted R² menghukum kompleksitas yang tidak berguna."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>OLS</strong> meminimalkan jumlah kuadrat residual; solusinya <Tex math={String.raw`\hat{\beta}=(X'X)^{-1}X'y`} /> — sensitif outlier karena hukuman kuadratik.</li>
          <li><strong>BLUE</strong> hanya jika 5 asumsi Gauss-Markov terpenuhi: linearitas, eksogenitas, homoskedastisitas, tanpa autokorelasi, tanpa multikolinearitas sempurna.</li>
          <li><strong>Residual acak = sehat.</strong> Pola lengkung → transformasi; corong → robust SE; gelombang → time series.</li>
          <li><strong>R²</strong> = kecocokan dalam sampel, bukan izin ekstrapolasi. <strong>p-value</strong> ≠ besar efek ≠ kausalitas.</li>
          <li><strong>Jangan</strong> pakai OLS untuk: hubungan non-linear tanpa transformasi, prediksi jauh di luar rentang data, atau klaim sebab-akibat dari data observasional.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a32-diagnostik-regresi" className="btn btn-primary btn-sm">Next: A3.2 →</Link>
      </div>
    </div>
  );
}

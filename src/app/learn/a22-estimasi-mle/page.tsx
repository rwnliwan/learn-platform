"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A22Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: kurva likelihood koin — 7 head dari 10 lemparan: L(p) = p^7 (1-p)^3
  const pGrid: number[] = [];
  for (let p = 0.01; p <= 0.99; p += 0.01) pGrid.push(p);
  const likelihoodData = [
    {
      x: pGrid,
      y: pGrid.map((p) => Math.pow(p, 7) * Math.pow(1 - p, 3)),
      type: "scatter",
      mode: "lines",
      marker: { color: "#2a7de1" },
      name: "Likelihood L(p)",
    },
    {
      x: [0.7, 0.7],
      y: [0, Math.pow(0.7, 7) * Math.pow(0.3, 3)],
      type: "scatter",
      mode: "lines",
      line: { dash: "dash", color: "#c2410c" },
      name: "MLE: p̂ = 0,7",
    },
  ];

  // Chart 2: bias-variance tradeoff pada shrinkage — ilustrasi dekomposisi MSE
  const lamGrid: number[] = [];
  for (let l = 0; l <= 1.001; l += 0.05) lamGrid.push(Math.round(l * 100) / 100);
  const biasSq = lamGrid.map((l) => (0.9 * l) ** 2);
  const varian = lamGrid.map((l) => 0.55 * (1 - l) ** 2 + 0.02);
  const mse = lamGrid.map((_, i) => biasSq[i] + varian[i]);
  const tradeoffData = [
    { x: lamGrid, y: biasSq, type: "scatter", mode: "lines", name: "Bias²", line: { color: "#c2410c" } },
    { x: lamGrid, y: varian, type: "scatter", mode: "lines", name: "Variansi", line: { color: "#2a7de1" } },
    { x: lamGrid, y: mse, type: "scatter", mode: "lines", name: "MSE total", line: { color: "#16a34a", width: 3 } },
  ];

  // Chart 3: distribusi sampling dua estimator variansi (ilustrasi bias)
  const lab1Code = `import random, math

random.seed(11)
# Data: 7 head (1) dari 10 lemparan
data = [1]*7 + [0]*3
n = len(data)

# Grid search MLE: p mana yang memaksimalkan likelihood?
best_p, best_L = 0, -1
for i in range(1, 100):
    p = i/100
    # log-likelihood (lebih stabil dari perkalian langsung)
    ll = sum(x*math.log(p) + (1-x)*math.log(1-p) for x in data)
    if ll > best_L:
        best_L, best_p = ll, p

print(f"Data: {sum(data)} head dari {n} lemparan")
print(f"MLE  p̂ = {best_p:.2f}")
print(f"Cek rumus: p̂ = x̄ = {sum(data)/n:.2f}  <- sama!")
print()
print("Coba: ubah data jadi [1]*2 + [0]*8 (2 head dari 10).")
print("Perhatikan puncak likelihood bergeser — MLE selalu 'mengikuti data'.")`;

  const lab2Code = `import random, statistics as st

random.seed(5)
sigma2_true = 64.0  # variansi populasi sebenarnya (sigma = 8)
n = 10
M = 5000

est_n = []    # pembagi n   (MLE)
est_n1 = []   # pembagi n-1 (unbiased)
for _ in range(M):
    xs = [random.gauss(100, 8) for _ in range(n)]
    m = st.mean(xs)
    est_n.append(sum((x-m)**2 for x in xs) / n)
    est_n1.append(sum((x-m)**2 for x in xs) / (n-1))

b_n = st.mean(est_n) - sigma2_true
b_n1 = st.mean(est_n1) - sigma2_true
print(f"Variansi benar        = {sigma2_true}")
print(f"Rata-rata est. (1/n)  = {st.mean(est_n):.2f}  -> bias = {b_n:.2f}")
print(f"Rata-rata est.(1/n-1) = {st.mean(est_n1):.2f}  -> bias = {b_n1:.2f}")
print()
print("Coba: ubah n jadi 100. Perhatikan bias MLE (1/n) menyusut,")
print("tapi TIDAK PERNAH nol — ia konsisten, bukan unbiased.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.2 — Statistika Inferensial</span>
        <h1 className="display-title">Menebak yang Tak Terlihat:<br />Seni Estimasi Titik &amp; MLE</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> Estimasi memakai <em>sampel</em> untuk menebak <em>parameter populasi</em> yang tak terlihat (misal rata-rata kepuasan seluruh nasabah). Lesson sebelumnya menunjukkan mean sampel punya <strong>distribusi sampling</strong> dengan standard error <Tex math={String.raw`SE = s/\sqrt{n}`} /> — ia berfluktuasi di sekitar nilai benar. Lesson ini bertanya lebih dalam: <strong>bagaimana cara menebak yang terbaik</strong>, dan bagaimana mengukur kualitas sebuah tebakan?</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 7 Head dari 10 Lemparan</a></li>
          <li><a href="#estimator">Estimator vs Estimasi — Si Penebak &amp; Tebakannya</a></li>
          <li><a href="#bias">Bias — Tebakan yang Miring Sistematis</a></li>
          <li><a href="#mse">Variansi &amp; MSE — Dekomposisi Kualitas Tebakan</a></li>
          <li><a href="#mle">MLE — Si Oportunis yang Mengikuti Data</a></li>
          <li><a href="#tradeoff">Tradeoff Bias-Variance — Tidak Ada Makan Siang Gratis</a></li>
          <li><a href="#lab1">🔬 Lab 1: Berburu MLE dengan Grid Search</a></li>
          <li><a href="#lab2">🔬 Lab 2: Membuktikan Bias Estimator Variansi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metode Estimasi</a></li>
          <li><a href="#case">📋 Mini-Case: Estimasi Default Rate Portofolio Kecil</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>parameter</strong>, <strong>estimator</strong>, dan <strong>estimasi</strong> — serta menghitung bias suatu estimator.</li>
          <li>Menghitung <strong>MSE</strong> sebagai <Tex math={String.raw`\text{bias}^2 + \text{variansi}`} /> dan menjelaskan mengapa estimator unbiased belum tentu terbaik.</li>
          <li>Menurunkan <strong>MLE</strong> untuk kasus Bernoulli dan Normal (mean &amp; variansi) langkah-demi-langkah.</li>
          <li>Menjelaskan mengapa estimator variansi MLE (pembagi <Tex math={String.raw`n`} />) bias, dan kapan bias itu masalah.</li>
          <li>Menjelaskan <strong>tradeoff bias-variance</strong> dengan contoh shrinkage — intuisi yang dipakai ulang di machine learning.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 7 Head dari 10 Lemparan</h2>
      <div className="story">
        <p>Seorang teman menantangmu bertaruh. Ia melempar koin 10 kali: hasilnya <strong>7 head, 3 tail</strong>. &ldquo;Koin ini berpihak ke head,&rdquo; katanya. &ldquo;Berapa peluang head yang sebenarnya?&rdquo;</p>
        <p>Jawaban instingmu: 7/10 = <strong>0,7</strong>. Masuk akal — tapi seberapa yakin kamu? Dengan hanya 10 lemparan, 7 head bisa terjadi juga pada koin adil (peluangnya ~12%). Tebakan 0,7 itu <em>tebakan terbaik dari data yang ada</em>, namun data yang ada sedikit sekali.</p>
        <p><strong>Twist-nya:</strong> &ldquo;tebakan terbaik&rdquo; ternyata punya banyak arti. Ada tebakan yang <em>rata-rata</em> tepat tapi liar setiap kali dipakai. Ada tebakan yang stabil tapi selalu sedikit meleset. Dan ada satu prinsip — <strong>Maximum Likelihood</strong> — yang menjadi mesin di balik regresi logistik, model kredit, dan hampir semua model machine learning modern. Lesson ini membongkar cara kerja &ldquo;mesin penebak&rdquo; itu.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="estimator">Estimator vs Estimasi — Si Penebak &amp; Tebakannya</h2>
      <p><strong>Definisi.</strong> <strong>Parameter</strong> (<Tex math={String.raw`\theta`} />, dibaca &ldquo;theta&rdquo;) adalah besaran populasi yang ingin diketahui tapi tak terlihat (misal peluang head sebenarnya <Tex math={String.raw`p`} />). <strong>Estimator</strong> (<Tex math={String.raw`\hat{\theta}`} />, &ldquo;theta-topi&rdquo;) adalah <em>rumus</em> yang dipakai untuk menebak — misal <Tex math={String.raw`\hat{p} = \bar{x}`} />. <strong>Estimasi</strong> adalah <em>hasil angka</em> dari rumus itu pada data tertentu — misal 0,7.</p>
      <p><strong>Kepribadian konsep ini:</strong> estimator adalah <em>resep masakan</em>, estimasi adalah <em>hidangan yang tersaji hari ini</em>. Resep yang sama menghasilkan hidangan yang sedikit beda setiap dimasak (karena bahan/data beda) — kualitas resep dinilai dari <em>rata-rata</em> semua masakannya, bukan satu piring.</p>
      <p><strong>Kapan memakai:</strong> setiap kali melaporkan satu angka sebagai &ldquo;jawaban&rdquo; — rata-rata, proporsi, variansi, koefisien model. Pertanyaan kualitasnya selalu sama: seberapa bagus resep ini?</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> estimator adalah <strong>variabel acak</strong> — ia punya distribusi (distribusi sampling dari lesson sebelumnya!). Menilai estimator berarti menilai <em>distribusinya</em>: di mana pusatnya (bias?) dan seberapa lebar (variansi?). Satu estimasi 0,7 tidak memberi tahu apa-apa soal kualitas resepnya.</p>
      </div>

      <h2 id="bias">Bias — Tebakan yang Miring Sistematis</h2>
      <p><strong>Definisi.</strong> <strong>Bias</strong> adalah selisih antara rata-rata tebakan dan nilai yang sebenarnya:</p>
      <Tex math={String.raw`\text{Bias}(\hat{\theta}) = E[\hat{\theta}] - \theta`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\hat{\theta}`} />: estimator (rumus penebak)</li>
        <li><Tex math={String.raw`E[\hat{\theta}]`} />: nilai harapan — rata-rata tebakan jika eksperimen diulang tak hingga kali</li>
        <li><Tex math={String.raw`\theta`} />: parameter sebenarnya (target)</li>
        <li><Tex math={String.raw`\text{Bias} = 0`} />: estimator disebut <strong>unbiased</strong> (tak bias) — rata-rata tebakannya tepat sasaran</li>
      </ul>
      <p><strong>Contoh klasik:</strong> mean sampel <Tex math={String.raw`\bar{x}`} /> adalah estimator unbiased untuk <Tex math={String.raw`\mu`} /> — rata-rata dari semua mean sampel tepat <Tex math={String.raw`\mu`} />. Sebaliknya, estimator variansi dengan pembagi <Tex math={String.raw`n`} /> ternyata bias (dibuktikan di Lab 2).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: bias estimator variansi</summary>
        <p>Data: 4, 6, 8 (<Tex math={String.raw`n = 3`} />). Mean <Tex math={String.raw`\bar{x} = 6`} />.</p>
        <p><strong>Langkah 1</strong> — jumlah kuadrat deviasi: <Tex math={String.raw`(4-6)^2 + (6-6)^2 + (8-6)^2 = 4 + 0 + 4 = 8`} />.<br />
        <strong>Langkah 2</strong> — estimator MLE (pembagi <Tex math={String.raw`n`} />): <Tex math={String.raw`8/3 \approx 2{,}67`} />.<br />
        <strong>Langkah 3</strong> — estimator unbiased (pembagi <Tex math={String.raw`n-1`} />): <Tex math={String.raw`8/2 = 4`} />.</p>
        <p>Secara teori, <Tex math={String.raw`E[\hat{\sigma}^2_{MLE}] = \frac{n-1}{n}\sigma^2`} /> — selalu <em>underestimate</em> sebesar <Tex math={String.raw`\sigma^2/n`} />. Mengapa? Karena deviasi dihitung terhadap <Tex math={String.raw`\bar{x}`} /> (yang &ldquo;mengejar&rdquo; data), bukan terhadap <Tex math={String.raw`\mu`} /> yang sebenarnya — data selalu terlihat sedikit lebih &ldquo;rapat&rdquo; di sekitar meannya sendiri.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Estimator yang bagus harus unbiased.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> unbiased hanya soal <em>pusat</em> distribusi tebakan, bukan <em>lebarnya</em>. Estimator unbiased tapi variansinya raksasa bisa jauh lebih buruk dari estimator yang sedikit bias tapi stabil. Kualitas total diukur oleh <strong>MSE</strong> — dan di situlah tradeoff dimulai.</p>
      </div>

      <h2 id="mse">Variansi &amp; MSE — Dekomposisi Kualitas Tebakan</h2>
      <p><strong>Definisi.</strong> <strong>Mean Squared Error</strong> (MSE, galat kuadrat rata-rata) mengukur rata-rata kuadrat kemelesetan tebakan dari target:</p>
      <Tex math={String.raw`MSE(\hat{\theta}) = E[(\hat{\theta} - \theta)^2] = \underbrace{[Bias(\hat{\theta})]^2}_{\text{kemiringan sistematis}} + \underbrace{Var(\hat{\theta})}_{\text{keliarian}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`MSE`} />: rata-rata kuadrat jarak tebakan ke nilai benar — makin kecil makin bagus</li>
        <li><Tex math={String.raw`[Bias]^2`} />: kuadrat kemiringan sistematis (nol jika unbiased)</li>
        <li><Tex math={String.raw`Var(\hat{\theta})`} />: seberapa liar tebakan berfluktuasi antar sampel</li>
      </ul>
      <p><strong>Kepribadian rumus ini:</strong> ini adalah &ldquo;laporan rapor&rdquo; estimator — dua komponen nilai yang sering tarik-menarik. Menurunkan variansi (misal dengan menyusutkan estimasi ke suatu nilai aman) biasanya menaikkan bias, dan sebaliknya.</p>
      <p><strong>Sifat penting — konsistensi:</strong> estimator disebut <strong>konsisten</strong> jika ia konvergen ke nilai benar saat <Tex math={String.raw`n \to \infty`} />. MLE variansi (pembagi <Tex math={String.raw`n`} />) bias tapi <em>konsisten</em> — biasnya <Tex math={String.raw`\sigma^2/n`} /> lenyap saat n besar. Untuk n besar, perdebatan <Tex math={String.raw`n`} /> vs <Tex math={String.raw`n-1`} /> tidak penting lagi.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> analogi memanah — bias = seberapa jauh <em>pusat</em> kelompok anak panah dari titik tengah target; variansi = seberapa <em>menyebar</em> anak panahnya. Pemanah yang anak panahnya menumpuk rapat tapi 5 cm ke kiri (bias kecil, variansi kecil) mengalahkan pemanah yang rata-rata tepat tengah tapi panahnya ke mana-mana. MSE = jarak kuadrat rata-rata tiap panah ke titik tengah — satu angka yang merangkum keduanya.</p>
      </div>

      <h2 id="mle">MLE — Si Oportunis yang Mengikuti Data</h2>
      <p><strong>Definisi.</strong> <strong>Maximum Likelihood Estimation</strong> (MLE, estimasi kemungkinan maksimum): pilih nilai parameter yang membuat data yang <em>teramati</em> menjadi <strong>paling mungkin terjadi</strong>.</p>
      <Tex math={String.raw`L(\theta \mid x) = \prod_{i=1}^{n} f(x_i; \theta) \qquad \hat{\theta}_{MLE} = \arg\max_{\theta} L(\theta \mid x)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`L(\theta \mid x)`} />: fungsi <strong>likelihood</strong> — &ldquo;seberapa masuk akal data <Tex math={String.raw`x`} /> jika parameternya <Tex math={String.raw`\theta`} />&rdquo;</li>
        <li><Tex math={String.raw`\prod`} />: kalikan peluang tiap observasi (asumsi data independen)</li>
        <li><Tex math={String.raw`f(x_i; \theta)`} />: fungsi peluang/densitas data ke-<Tex math={String.raw`i`} /> di bawah parameter <Tex math={String.raw`\theta`} /></li>
        <li><Tex math={String.raw`\arg\max`} />: &ldquo;nilai <Tex math={String.raw`\theta`} /> yang memaksimalkan&rdquo;</li>
      </ul>
      <p><strong>Trik kerja:</strong> karena logaritma monoton naik, praktisnya kita memaksimalkan <strong>log-likelihood</strong> <Tex math={String.raw`\ell(\theta) = \sum \log f(x_i; \theta)`} /> — perkalian menjadi penjumlahan, jauh lebih stabil dihitung.</p>
      <p><strong>Kepribadian MLE:</strong> si oportunis yang tidak punya pendirian — ia bertanya &ldquo;dunia seperti apa yang membuat bukti ini paling masuk akal?&rdquo; lalu menjawab sesuai bukti. 7 head dari 10 → dunia dengan p=0,7 membuat bukti itu paling masuk akal. Tidak lebih, tidak kurang.</p>

      <details className="worked">
        <summary>📐 Penurunan MLE untuk koin (Bernoulli) — langkah-demi-langkah</summary>
        <p>Data: <Tex math={String.raw`x_1, \dots, x_n`} /> dengan <Tex math={String.raw`x_i \in \{0,1\}`} /> (1 = head). Parameter: <Tex math={String.raw`p`} />.</p>
        <p><strong>Langkah 1</strong> — tulis likelihood: <Tex math={String.raw`L(p) = \prod p^{x_i}(1-p)^{1-x_i} = p^{\sum x_i}(1-p)^{n - \sum x_i}`} />.<br />
        <strong>Langkah 2</strong> — log-likelihood: <Tex math={String.raw`\ell(p) = (\sum x_i)\log p + (n - \sum x_i)\log(1-p)`} />.<br />
        <strong>Langkah 3</strong> — turunkan dan nol-kan: <Tex math={String.raw`\frac{d\ell}{dp} = \frac{\sum x_i}{p} - \frac{n - \sum x_i}{1-p} = 0`} />.<br />
        <strong>Langkah 4</strong> — selesaikan: <Tex math={String.raw`\hat{p}_{MLE} = \frac{1}{n}\sum x_i = \bar{x}`} />.</p>
        <p>Hasilnya &ldquo;cuma&rdquo; rata-rata sampel — tapi sekarang kamu tahu <em>mengapa</em>: rata-rata adalah nilai yang memaksimalkan kemungkinan data teramati. Untuk Normal, cara yang sama menghasilkan <Tex math={String.raw`\hat{\mu}_{MLE} = \bar{x}`} /> dan <Tex math={String.raw`\hat{\sigma}^2_{MLE} = \frac{1}{n}\sum(x_i - \bar{x})^2`} /> (yang bias!).</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;MLE selalu unbiased dan selalu terbaik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> MLE punya sifat asimtotik yang indah (konsisten, efisien saat n besar), tapi pada sampel kecil ia bisa bias — contohnya variansi Normal. &ldquo;Terbaik&rdquo; juga tergantung kriteria: untuk n kecil, estimator yang sedikit bias tapi stabil (misal versi shrinkage) sering menang MSE. MLE adalah titik awal yang hebat, bukan jawaban final untuk segalanya.</p>
      </div>

      <p><strong>Kapan memakai MLE:</strong> hampir selalu sebagai default — ia menjadi fondasi regresi logistik (model PD kredit!), model survival, dan semua model probabilistik. Sifat &ldquo;mengikuti data&rdquo;-nya juga berarti: jika modelnya salah (asumsi distribusi keliru), MLE mengikuti ke arah yang salah. <em>Garbage model in, garbage estimate out.</em></p>

      <PlotlyChart
        data={likelihoodData}
        title="Kurva Likelihood: 7 Head dari 10 Lemparan"
        layout={{ xaxis: { title: "p (peluang head yang dihipotesiskan)" }, yaxis: { title: "Likelihood L(p)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = nilai p yang kita coba-coba; tinggi kurva = seberapa mungkin data &ldquo;7 head dari 10&rdquo; terjadi jika p itulah yang benar. Garis putus-putus = puncak kurva.</p>
        <p><strong>Interpretasi:</strong> kurva memuncak tepat di p = 0,7 — dunia dengan p=0,7 membuat data teramati paling masuk akal. Itulah MLE secara visual: <strong>naik ke puncak kurva likelihood</strong>. Perhatikan kurvanya landai di sekitar puncak — dengan n=10, nilai 0,5–0,9 pun masih &ldquo;lumayan masuk akal&rdquo;, cerminan ketidakpastian sampel kecil.</p>
      </div>

      <h2 id="tradeoff">Tradeoff Bias-Variance — Tidak Ada Makan Siang Gratis</h2>
      <p>Ingat dekomposisi MSE: <Tex math={String.raw`MSE = \text{bias}^2 + \text{variansi}`} />. Dua suku ini sering <strong>tarik-menarik</strong>. Contoh paling bersih: <strong>shrinkage</strong> — susutkan estimasi ke arah suatu nilai jangkar <Tex math={String.raw`c`} />:</p>
      <Tex math={String.raw`\hat{\theta}_{\lambda} = (1-\lambda)\bar{x} + \lambda c, \qquad 0 \le \lambda \le 1`} block />
      <p><Tex math={String.raw`\lambda = 0`} /> murni mengikuti data (unbiased, variansi penuh); <Tex math={String.raw`\lambda = 1`} /> selalu menjawab <Tex math={String.raw`c`} /> (bias besar, variansi nol). Di tengahnya ada <Tex math={String.raw`\lambda`} /> optimal yang meminimalkan MSE — inilah ide di balik <strong>regularisasi</strong> (ridge regression) di machine learning.</p>
      <p><strong>Contoh nyata:</strong> mengestimasi rata-rata batting 500 pemain baseball dari 20 pertandingan pertama. MLE murni (rata-rata tiap pemain) liar — pemain yang kebetulan 0,500 tidak akan bertahan. Menyusutkan semua estimasi ke rata-rata liga (shrinkage) terbukti menurunkan MSE total. Fenomena ini (James–Stein) mengejutkan dunia statistika 1961: <em>kadang sengaja bias menghasilkan tebakan lebih baik</em>.</p>

      <PlotlyChart
        data={tradeoffData}
        title="Tradeoff Bias–Variance pada Shrinkage (λ: 0 = murni data, 1 = murni jangkar)"
        layout={{ xaxis: { title: "λ (kekuatan shrinkage)" }, yaxis: { title: "Error" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = seberapa kuat estimasi disusutkan ke nilai jangkar. Tiga kurva = dua komponen error dan totalnya.</p>
        <p><strong>Interpretasi:</strong> bias² naik dan variansi turun seiring λ — keduanya monoton berlawanan arah. MSE total (hijau) berbentuk U dengan minimum di tengah (λ ≈ 0,4): <strong>sedikit bias yang ditukar dengan banyak penurunan variansi = menang total</strong>. Inilah kurva U yang akan kamu temui lagi di setiap pembahasan overfitting machine learning.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. MLE = &ldquo;parameter yang membuat data teramati paling mungkin&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: MLE koin — turunkan sampai dapat</summary>
              <p>10 lemparan: 7 angka (H). Turunkan <Tex math={String.raw`\hat{p}_{MLE}`} /> dari definisi likelihood.</p>
              <p><strong>Langkah 1</strong> — model: <Tex math={String.raw`X \sim \text{Binomial}(10, p)`} />. Likelihood: <Tex math={String.raw`L(p) = \binom{10}{7} p^7 (1-p)^3`} />.<br />
              <strong>Langkah 2</strong> — log-likelihood: <Tex math={String.raw`\ell(p) = 7\ln p + 3\ln(1-p) + \text{konst}`} />.<br />
              <strong>Langkah 3</strong> — turunan = 0: <Tex math={String.raw`7/p - 3/(1-p) = 0`} /> → <Tex math={String.raw`7(1-p) = 3p`} /> → <Tex math={String.raw`\hat{p} = 0,7`} />.<br />
              <strong>Langkah 4</strong> — cek maksimum: turunan kedua negatif. Selesai.</p>
              <p>Pelajaran: &ldquo;proporsi sampel&rdquo; bukan tebakan — ia <em>diturunkan</em> dari prinsip maksimum likelihood. Prinsip yang sama (turunkan ℓ, samakan nol) dipakai untuk SEMUA model parametrik.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: MLE Eksponensial — waktu antar klaim</summary>
              <p>Waktu antar klaim (hari): 2, 5, 1, 8, 4 (n = 5). Estimasi MLE laju <Tex math={String.raw`\lambda`} />.</p>
              <p><strong>Langkah 1</strong> — <Tex math={String.raw`L(\lambda) = \prod \lambda e^{-\lambda x_i} = \lambda^n e^{-\lambda \sum x_i}`} />.<br />
              <strong>Langkah 2</strong> — <Tex math={String.raw`\ell = n\ln\lambda - \lambda\sum x_i`} />. Turunan: <Tex math={String.raw`n/\lambda - \sum x_i = 0`} />.<br />
              <strong>Langkah 3</strong> — <Tex math={String.raw`\hat{\lambda} = n/\sum x_i = 1/\bar{x} = 1/4 = 0,25`} /> per hari.<br />
              <strong>Langkah 4</strong> — interpretasi: rata-rata 1 klaim per 4 hari. (Catatan: <Tex math={String.raw`1/\bar{X}`} /> bias untuk n kecil — unbiased butuh koreksi <Tex math={String.raw`(n-1)/n`} />!)</p>
              <p>Pelajaran: MLE = &ldquo;balikkan&rdquo; mean sampel untuk Eksponensial. Dan waspada: MLE <em>tidak selalu</em> unbiased — sifat baiknya adalah konsistensi &amp; efisiensi asimtotik, bukan ketidakbiasan sampel kecil.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Berburu MLE dengan Grid Search</h2>
      <p>Alih-alih menghafal rumus, kita <em>mencari</em> MLE secara brutal: coba semua p dari 0,01 sampai 0,99, pilih yang likelihood-nya terbesar. Lalu verifikasi bahwa jawabannya sama dengan rumus <Tex math={String.raw`\hat{p} = \bar{x}`} />.</p>
      <PyodideLab
        title="Lab 1 — Grid Search MLE Koin (Live Python)"
        hint="⚡ Live Python. Coba: ubah data jadi [1]*2 + [0]*8. Ke mana puncak likelihood bergeser? Coba juga [1]*70 + [0]*30 — bagaimana 'kecuraman' puncak berubah saat n besar?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Membuktikan Bias Estimator Variansi</h2>
      <p>Simulasi 5.000 eksperimen: bandingkan estimator variansi pembagi <Tex math={String.raw`n`} /> (MLE) vs pembagi <Tex math={String.raw`n-1`} /> (unbiased). Siapa yang rata-ratanya tepat sasaran?</p>
      <PyodideLab
        title="Lab 2 — Bias 1/n vs 1/(n−1) (Live Python)"
        hint="Coba: ubah n jadi 100. Bias MLE menyusut tapi tak pernah nol — ia konsisten, bukan unbiased. Kapan perbedaan ini penting di dunia nyata? (Jawab: saat n kecil!)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Metode Estimasi</h2>

      <div className="decision-card">
        <h3>1. Model probabilistik jelas, n cukup besar → <strong>MLE</strong></h3>
        <p><strong>Kondisi:</strong> kamu berani menuliskan <Tex math={String.raw`f(x; \theta)`} /> (Bernoulli untuk default/tidak, Normal untuk return). Sampel ratusan ke atas.</p>
        <p><strong>Kenapa:</strong> konsisten, efisien asimtotik, dan menjadi fondasi model lanjutan (regresi logistik = MLE untuk Bernoulli). Perilaku teorinya paling dipahami.</p>
        <p><strong>Contoh nyata:</strong> estimasi PD (probability of default) per rating dengan regresi logistik — koefisiennya adalah MLE.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh estimator unbiased untuk laporan → <strong>Koreksi bias (Bessel)</strong></h3>
        <p><strong>Kondisi:</strong> n kecil dan angka akan dikutip mentah (tanpa interval) — misal estimasi volatilitas dari 12 bulan data.</p>
        <p><strong>Kenapa:</strong> bias <Tex math={String.raw`\sigma^2/n`} /> lumayan saat n kecil (n=12 → underestimate 8%). Pakai pembagi <Tex math={String.raw`n-1`} />.</p>
        <p><strong>Contoh nyata:</strong> laporan risiko memakai <em>sample</em> standard deviation (n−1), bukan versi populasi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Banyak parameter, n kecil, estimasi liar → <strong>Shrinkage / regularisasi</strong></h3>
        <p><strong>Kondisi:</strong> mengestimasi ratusan parameter dari sedikit data (rata-rata per segmen kecil, koefisien model dengan banyak fitur).</p>
        <p><strong>Kenapa:</strong> variansi mendominasi MSE. Sengaja menambah sedikit bias via shrinkage/ridge menurunkan total error.</p>
        <p><strong>Contoh nyata:</strong> estimasi default rate per cabang kecil — disusutkan ke rata-rata nasional (empirical Bayes).</p>
      </div>

      <div className="decision-card">
        <h3>4. Ada informasi awal yang kuat → <strong>Bayesian (MAP)</strong></h3>
        <p><strong>Kondisi:</strong> kamu punya prior yang defensibel — data historis, studi sebelumnya, pengetahuan domain.</p>
        <p><strong>Kenapa:</strong> menggabungkan prior + likelihood secara prinsipil; sangat membantu saat n kecil. (Detail penuh di A2.12.)</p>
        <p><strong>Contoh nyata:</strong> segmen kredit baru dengan 50 nasabah — prior dari segmen lama menstabilkan estimasi.</p>
      </div>

      <div className="decision-card">
        <h3>5. Distribusi tidak jelas / data kotor → <strong>Estimator robust</strong></h3>
        <p><strong>Kondisi:</strong> outlier, distribusi tak diketahui, atau kamu tidak mau berasumsi.</p>
        <p><strong>Kenapa:</strong> median/trimmed mean mengorbankan sedikit efisiensi demi kekebalan. Kadang &ldquo;resep sederhana yang kebal&rdquo; mengalahkan &ldquo;resep optimal yang rapuh&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> estimasi &ldquo;tipikal&rdquo; waktu tunggu layanan yang datanya miring parah.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Default = MLE.</strong> Tulis likelihood, maksimalkan — untuk n besar ia sulit dikalahkan.</li>
          <li><strong>n kecil + lapor angka mentah</strong> → cek bias, koreksi bila perlu (Bessel).</li>
          <li><strong>Estimasi liar / banyak parameter</strong> → pertimbangkan shrinkage; unbiased bukan tujuan, MSE rendah yang tujuan.</li>
          <li>Selalu tanya: &ldquo;asumsi distribusi saya apa?&rdquo; — MLE sekuat modelnya.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Estimasi Default Rate Portofolio Kecil</h2>
      <div className="callout">
        <p>Fintech &ldquo;DanaKita&rdquo; meluncurkan segmen baru: kredit modal kerja untuk warung. Setelah 6 bulan: <strong>200 pinjaman disalurkan, 6 gagal bayar</strong>. Tim risiko butuh satu angka PD (probability of default) untuk penetapan bunga.</p>
        <p>Analis junior menghitung MLE: <Tex math={String.raw`\hat{p} = 6/200 = 3\%`} />. &ldquo;PD kita 3%,&rdquo; katanya. Direksi memakai 3% untuk pricing.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung SE dari estimasi ini. (b) Apa bahayanya memakai 3% mentah untuk pricing? (c) Usulkan estimasi yang lebih defensibel dengan 2 pendekatan berbeda.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <Tex math={String.raw`SE = \sqrt{0{,}03 \times 0{,}97 / 200} \approx 0{,}012`} /> = 1,2 poin. Interval kasar 95%: 3% ± 2,4% → (0,6%, 5,4%). <strong>PD sebenarnya bisa hampir 2× lipat dari 3%!</strong> Satu angka 3% menyembunyikan ketidakpastian raksasa.</p>
          <p>(b) Pricing dari titik 3%: jika PD sebenarnya 5%, bunga yang dipatok tidak menutup expected loss — portofolio merugi sistematis. Keputusan bisnis dari estimasi titik tanpa ukuran ketidakpastian = berjudi.</p>
          <p>(c) <strong>Pendekatan 1 — interval (A2.3):</strong> pakai batas atas Wilson (~5,9%) sebagai PD konservatif untuk pricing — praktik umum &ldquo;add-on konservatisme&rdquo; untuk portofolio kecil. <strong>Pendekatan 2 — shrinkage/Bayesian:</strong> susutkan 3% ke PD historis segmen sejenis (misal 4,5%): <Tex math={String.raw`\hat{p}_{shrunk} = w \cdot 3\% + (1-w)\cdot 4{,}5\%`} /> — menukar sedikit bias dengan jauh lebih kecilnya variansi. Keduanya mengakui: <strong>n=200 dengan 6 kejadian terlalu sedikit untuk percaya pada satu angka</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Data Poisson: 2, 3, 1, 4, 0. Turunkan <Tex math={String.raw`\hat{\lambda}_{MLE}`} /> (lihat B8!).</li>
              <li>Mengapa memaksimalkan <em>log</em>-likelihood ekuivalen dengan likelihood? (1 kalimat.)</li>
              <li>MLE Normal untuk <Tex math={String.raw`\sigma^2`} /> = <Tex math={String.raw`\frac{1}{n}\sum(x_i-\bar{x})^2`} /> — bias atau tidak? Apa koreksinya?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <Tex math={String.raw`\ell = -n\lambda + (\sum x)\ln\lambda`} /> → <Tex math={String.raw`d\ell/d\lambda = -n + \sum x/\lambda = 0`} /> → <Tex math={String.raw`\hat{\lambda} = \bar{x} = 2,0`} />.</p>
              <p><strong>2.</strong> Logaritma <em>monoton naik</em> — argmax tidak berubah. Bonus: log mengubah <em>produk</em> jadi <em>jumlah</em> (stabil numerik + mudah diturunkan).</p>
              <p><strong>3.</strong> <strong>Bias</strong> (ekspektasi = <Tex math={String.raw`\frac{n-1}{n}\sigma^2`} />). Koreksi Bessel: bagi <Tex math={String.raw`n-1`} /> (varians <em>sampel</em>) — inilah mengapa <code className="inline">statistics.variance</code> ≠ <code className="inline">pvariance</code>!</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Manakah yang dimaksud 'estimator'?"
        options={[
          "Angka 0,7 dari pelemparan koin",
          "Rumus p̂ = x̄ (aturan untuk menghitung dari data apapun)",
          "Nilai p sebenarnya yang tidak diketahui",
          "Distribusi binomial",
        ]}
        correct={1}
        explanation="Benar. Estimator = resep/rumus (p̂ = x̄); estimasi = hidangan hari ini (0,7); parameter = bahan ideal yang tak terlihat (p). Kualitas dinilai dari resepnya (distribusinya), bukan satu hidangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Estimator θ̂ punya E[θ̂] = θ + 2 dan Var(θ̂) = 9. Berapa MSE-nya?"
        options={[
          "9",
          "11",
          "13",
          "4",
        ]}
        correct={2}
        explanation="Benar: MSE = bias² + variansi = 2² + 9 = 13. Bias 2 menyumbang 4 ke MSE — kadang menghapus bias kecil tidak sepadan jika menaikkan variansi lebih dari 4."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa estimator variansi MLE (pembagi n) bias ke bawah?"
        options={[
          "Karena datanya selalu kurang",
          "Karena deviasi dihitung terhadap x̄ yang 'mengejar' data, sehingga data terlihat lebih rapat dari sebenarnya",
          "Karena rumusnya salah ketik",
          "Karena n selalu terlalu kecil",
        ]}
        correct={1}
        explanation="Benar. x̄ dipilih untuk meminimalkan jumlah kuadrat deviasi pada sampel itu — deviasi terhadap μ yang sebenarnya pasti ≥ itu. Rata-rata, underestimate-nya sebesar σ²/n."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk data Bernoulli (7 sukses dari 10), MLE bagi p adalah…"
        options={[
          "0,5 karena koin adil",
          "0,7 = x̄ — nilai yang memaksimalkan likelihood data teramati",
          "Tidak bisa ditentukan tanpa prior",
          "Median dari data",
        ]}
        correct={1}
        explanation="Benar. Turunan log-likelihood menghasilkan p̂ = x̄. Secara visual: p=0,7 adalah puncak kurva likelihood — dunia yang membuat '7 dari 10' paling masuk akal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan estimator yang sedikit bias bisa MENGALAHKAN estimator unbiased?"
        options={[
          "Tidak pernah — unbiased selalu menang",
          "Ketika penurunan variansinya lebih besar dari kenaikan bias²-nya, sehingga MSE total lebih kecil",
          "Hanya jika n sangat besar",
          "Hanya untuk data normal",
        ]}
        correct={1}
        explanation="Benar — inilah inti tradeoff bias-variance. Shrinkage/ridge adalah contoh nyatanya: tambah sedikit bias, pangkas banyak variansi, MSE total turun. James-Stein membuktikan ini bahkan untuk kasus sederhana."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dua analis mengestimasi rata-rata dari n=12 data. A pakai x̄, B selalu menjawab 100 (konstanta). Manakah pernyataan BENAR?"
        options={[
          "B lebih baik karena variansinya nol",
          "A konsisten (mendekati μ saat n besar); B biasnya tetap |100−μ| selamanya — B tidak konsisten",
          "Keduanya sama baiknya",
          "B adalah MLE",
        ]}
        correct={1}
        explanation="Benar. Variansi nol tidak berguna jika biasnya permanen. Konsistensi — tebakan membaik seiring data bertambah — adalah syarat minimal estimator yang serius. B gagal total di sini."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Parameter</strong> (tak terlihat) → <strong>estimator</strong> (rumus, <Tex math={String.raw`\hat{\theta}`} />) → <strong>estimasi</strong> (angka hari ini).</li>
          <li><strong>Bias</strong> <Tex math={String.raw`= E[\hat{\theta}] - \theta`} />: kemiringan sistematis. Unbiased ≠ terbaik.</li>
          <li><strong>MSE = bias² + variansi</strong>: rapor lengkap kualitas estimator.</li>
          <li><strong>MLE</strong>: pilih <Tex math={String.raw`\theta`} /> yang memaksimalkan <Tex math={String.raw`L(\theta) = \prod f(x_i;\theta)`} /> — praktisnya via log-likelihood. Untuk Bernoulli/Normal menghasilkan <Tex math={String.raw`\bar{x}`} />.</li>
          <li>MLE variansi (pembagi <Tex math={String.raw`n`} />) <strong>bias ke bawah</strong> sebesar <Tex math={String.raw`\sigma^2/n`} /> — koreksi Bessel (<Tex math={String.raw`n-1`} />) untuk n kecil.</li>
          <li><strong>Tradeoff bias-variance</strong>: sedikit bias yang ditukar dengan banyak penurunan variansi = MSE menang (shrinkage, ridge).</li>
          <li><strong>Jangan:</strong> melaporkan estimasi titik tanpa ukuran ketidakpastian; menganggap MLE kebal terhadap model yang salah.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a21-sampling-bias" className="btn btn-secondary btn-sm">← A2.1</Link>
        <Link href="/learn/a23-interval-kepercayaan" className="btn btn-primary btn-sm">Next: A2.3 →</Link>
      </div>
    </div>
  );
}

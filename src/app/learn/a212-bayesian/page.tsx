"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function lgamma(x: number): number {
  const g = 7;
  const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  let a = C[0];
  for (let i = 1; i < g + 2; i++) a += C[i] / (x + i);
  const t = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
function betaPdf(x: number, a: number, b: number) {
  if (x <= 0 || x >= 1) return 0;
  const lb = lgamma(a) + lgamma(b) - lgamma(a + b);
  return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - lb);
}

export default function A212Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: prior -> posterior updating (Beta-Binomial): 2 sukses dari 10, prior Beta(2,2)
  const xs: number[] = [];
  for (let x = 0.01; x <= 0.99; x += 0.01) xs.push(Math.round(x * 100) / 100);
  const updateData = [
    { x: xs, y: xs.map((x) => betaPdf(x, 2, 2)), type: "scatter", mode: "lines", name: "Prior Beta(2,2)", line: { color: "#94a3b8", dash: "dash" } },
    { x: xs, y: xs.map((x) => betaPdf(x, 4, 10)), type: "scatter", mode: "lines", name: "Posterior Beta(4,10) — setelah 2/10", line: { color: "#2a7de1", width: 3 } },
  ];

  // Chart 2: sensitivitas prior — posterior dengan prior berbeda, data sama (8/20)
  const priorSensData = [
    { x: xs, y: xs.map((x) => betaPdf(x, 10, 50)), type: "scatter", mode: "lines", name: "Prior skeptis Beta(2,38) → post Beta(10,50)", line: { color: "#c2410c" } },
    { x: xs, y: xs.map((x) => betaPdf(x, 18, 22)), type: "scatter", mode: "lines", name: "Prior pesimis Beta(10,10) → post Beta(18,22)", line: { color: "#16a34a" } },
    { x: xs, y: xs.map((x) => betaPdf(x, 9, 13)), type: "scatter", mode: "lines", name: "Prior netral Beta(1,1) → post Beta(9,13)", line: { color: "#2a7de1", dash: "dot" } },
  ];

  // Chart 3: posterior dengan credible interval 95%
  const credX: number[] = [];
  for (let x = 0.05; x <= 0.75; x += 0.005) credX.push(Math.round(x * 1000) / 1000);
  const credData = [
    {
      x: credX,
      y: credX.map((x) => betaPdf(x, 9, 13)),
      type: "scatter",
      mode: "lines",
      fill: "tozeroy",
      name: "Posterior Beta(9,13), mean 41%",
      line: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `import math

# Beta-Binomial updating LANGKAH DEMI LANGKAH.
# Prior: Beta(alpha, beta). Data: x sukses dari n.
# Posterior: Beta(alpha + x, beta + n - x). Sesederhana itu!

def beta_mean(a, b): return a/(a+b)

# Skenario: estimasi default rate segmen baru.
# Prior dari segmen lama: kira-kira 5%, keyakinan "setara 40 observasi"
alpha, beta = 2, 38   # mean = 2/40 = 5%
print(f"Prior: Beta({alpha},{beta}), mean = {beta_mean(alpha,beta):.1%}")

# Data datang bertahap
for label, x, n in [("Bulan 1", 3, 50), ("Bulan 2", 2, 60), ("Bulan 3", 4, 55)]:
    alpha, beta = alpha + x, beta + (n - x)
    mle = x/n
    print(f"{label}: data {x}/{n} (MLE={mle:.1%}) -> posterior mean = {beta_mean(alpha,beta):.2%}")

print()
print("Amati: bulan 1, MLE data (6%) 'menang' atas prior (5%) sebagian;")
print("posterior (5.5%) adalah KOMPROMI. Makin banyak data, makin data")
print("yang menang -- prior 'terlupakan' secara otomatis.")
print()
print("Coba: ubah prior jadi Beta(1,1) (netral). Posterior bulan 1 -> ?")`;

  const lab2Code = `# Sensitivitas prior: tiga analis, tiga prior, SATU data.
# Data: 8 default dari 20 pinjaman (40% -- tinggi!).

def beta_mean(a, b): return a/(a+b)

data_x, data_n = 8, 20
priors = {
    "Skeptis  (percaya 5%)": (2, 38),
    "Netral   (tidak tahu)": (1, 1),
    "Pesimis  (percaya 50%)": (10, 10),
}
print(f"Data: {data_x}/{data_n} = {data_x/data_n:.0%} (MLE)")
print(f"{'Analis':>24}  {'Prior mean':>10}  {'Posterior mean':>14}")
for nama, (a, b) in priors.items():
    post = beta_mean(a+data_x, b+data_n-data_x)
    print(f"{nama:>24}  {beta_mean(a,b):>9.1%}  {post:>13.1%}")
print()
print("Dengan n=20, prior MASIH berpengaruh (26% vs 40% vs 43%).")
print("Coba: ubah data jadi 80/200 (n=200). Ketiga posterior MENYATU")
print("ke ~40% -- data besar menghapus perbedaan prior. Inilah")
print("'prior terlupakan secara otomatis' -- bukan asumsi, tapi matematika.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.12 — Statistika Inferensial</span>
        <h1 className="display-title">Memperbarui Keyakinan dengan Data:<br />Bayesian Dasar</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> Semua lesson sebelumnya memakai kerangka <strong>frequentist</strong>: parameter dianggap <em>tetap</em> (tapi tak diketahui), dan ketidakpastian dinyatakan lewat prosedur pengulangan (CI 95%, p-value). Lesson ini memperkenalkan kerangka kedua yang sama tuanya: <strong>Bayesian</strong> — parameter diperlakukan sebagai <em>keyakinan</em> yang <strong>diperbarui</strong> saat data datang, via <strong>teorema Bayes</strong>. Dua kerangka, dua cara berpikir — analis lengkap menguasai keduanya.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tes Positif, Tapi Sehat?</a></li>
          <li><a href="#bayes">Teorema Bayes — Mesin Pembaruan Keyakinan</a></li>
          <li><a href="#tiga">Tiga Pemain: Prior, Likelihood, Posterior</a></li>
          <li><a href="#konjugat">Pasangan Konjugat Beta-Binomial</a></li>
          <li><a href="#credible">Credible Interval — &ldquo;95%&rdquo; yang Sebenarnya</a></li>
          <li><a href="#prior">Memilih Prior — Seni yang Jujur</a></li>
          <li><a href="#banding">Bayesian vs Frequentist — Kapan yang Mana</a></li>
          <li><a href="#lab1">🔬 Lab 1: Updating Beta-Binomial Langkah demi Langkah</a></li>
          <li><a href="#lab2">🔬 Lab 2: Sensitivitas Prior</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Bayesian</a></li>
          <li><a href="#case">📋 Mini-Case: Default Rate Segmen Baru</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menuliskan <strong>teorema Bayes</strong> dan mengidentifikasi prior, likelihood, posterior, evidence.</li>
          <li>Menyelesaikan <strong>base-rate fallacy</strong> (tes medis) dengan perhitungan Bayes langkah-demi-langkah.</li>
          <li>Melakukan <strong>updating Beta-Binomial</strong>: prior Beta(α,β) + data (x dari n) → posterior Beta(α+x, β+n−x).</li>
          <li>Menjelaskan <strong>credible interval</strong> dan perbedaannya dari confidence interval frequentist.</li>
          <li>Memilih <strong>prior</strong> yang defensibel dan menjelaskan mengapa &ldquo;prior terlupakan&rdquo; saat n besar.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Tes Positif, Tapi Sehat?</h2>
      <div className="story">
        <p>Sebuah tes kanker memiliki <strong>sensitivitas 99%</strong> (mendeteksi 99% penderita) dan <strong>spesifisitas 99%</strong> (benar negatif pada 99% orang sehat). Kamu tes — hasilnya <strong>positif</strong>. Berapa peluang kamu benar-benar sakit?</p>
        <p>Insting kebanyakan orang (termasuk banyak dokter!): &ldquo;99%, kan tesnya 99% akurat.&rdquo; <strong>Salah besar.</strong> Jika hanya 1 dari 10.000 orang yang sakit (base rate), maka dari 10.000 orang: 1 penderita terdeteksi, tapi <strong>~100 orang sehat</strong> juga positif palsu (1% × 9.999). Dari 101 yang positif, hanya 1 yang sakit — peluangmu sakit ≈ <strong>1%</strong>, bukan 99%!</p>
        <p><strong>Twist-nya:</strong> tes yang &ldquo;99% akurat&rdquo; memberi jawaban yang 99% <em>salah</em> — karena akurasi tes bukan satu-satunya bahan; <strong>seberapa umum penyakitnya</strong> (prior!) sama pentingnya. Kegagalan menggabungkan keduanya disebut <strong>base-rate fallacy</strong>, dan teorema Bayes adalah obatnya: ia adalah <em>cara yang benar secara matematis</em> untuk menggabungkan &ldquo;apa yang kuketahui sebelumnya&rdquo; dengan &ldquo;apa yang dikatakan bukti&rdquo;.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="bayes">Teorema Bayes — Mesin Pembaruan Keyakinan</h2>
      <Tex math={String.raw`P(H \mid D) = \frac{P(D \mid H) \cdot P(H)}{P(D)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`P(H \mid D)`} /> — <strong>posterior</strong>: keyakinan tentang hipotesis <em>setelah</em> melihat data. Inilah jawabannya.</li>
        <li><Tex math={String.raw`P(D \mid H)`} /> — <strong>likelihood</strong>: jika hipotesis benar, seberapa mungkin data ini? (Sama seperti di MLE!)</li>
        <li><Tex math={String.raw`P(H)`} /> — <strong>prior</strong>: keyakinan <em>sebelum</em> data — base rate, pengetahuan domain, studi sebelumnya.</li>
        <li><Tex math={String.raw`P(D)`} /> — <strong>evidence</strong>: peluang data secara keseluruhan (konstanta normalisasi agar posterior berjumlah 1).</li>
      </ul>
      <p><strong>Versi bahasa:</strong> <em>keyakinan baru ∝ kecocokan bukti × keyakinan lama</em>. Data yang sangat cocok dengan hipotesis menaikkan keyakinan; data yang aneh menurunkannya — tapi keyakinan lama tidak pernah dihapus total, hanya ditimbang ulang.</p>
      <p><strong>Kepribadian teorema ini:</strong> si akuntan keyakinan yang disiplin — ia memaksa setiap &ldquo;firasat&rdquo; ditulis sebagai angka (prior), setiap bukti dinilai kecocokannya (likelihood), dan mengharamkan &ldquo;lupa base rate&rdquo;. Ditemukan Thomas Bayes (1763), dipopulerkan Laplace — sempat dicemooh kaum frequentist seabad, kini menjadi mesin di balik spam filter, rekomendasi, dan AI modern.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: tes kanker di cerita pembuka</summary>
        <p>H = &ldquo;sakit&rdquo;, D = &ldquo;tes positif&rdquo;. Base rate P(H) = 1/10.000 = 0,0001.</p>
        <p><strong>Langkah 1</strong> — likelihood: P(D|H) = 0,99 (sensitivitas).<br />
        <strong>Langkah 2</strong> — false positive: P(D|¬H) = 0,01.<br />
        <strong>Langkah 3</strong> — evidence: P(D) = 0,99×0,0001 + 0,01×0,9999 ≈ 0,0101.<br />
        <strong>Langkah 4</strong> — posterior: P(H|D) = (0,99 × 0,0001)/0,0101 ≈ <strong>0,0098 ≈ 1%</strong>.</p>
        <p>Tes &ldquo;99% akurat&rdquo; → peluang sakit 1%. Inilah kekuatan prior: base rate 1/10.000 mendominasi bukti. <strong>Tanpa prior, bukti disalahartikan.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> frequentist bertanya &ldquo;seberapa aneh data ini <em>andaikan</em> H0 benar?&rdquo; (p-value). Bayesian bertanya &ldquo;<em>seberapa yakin</em> saya pada tiap hipotesis <em>setelah</em> melihat data?&rdquo; — pertanyaan yang sebenarnya ingin dijawab manusia. Harga: kamu harus berani menulis prior sebagai angka. Hadiah: jawaban langsung atas pertanyaan yang benar.</p>
      </div>

      <h2 id="tiga">Tiga Pemain: Prior, Likelihood, Posterior</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Pemain</th><th>Peran</th><th>Contoh (estimasi default rate)</th></tr></thead>
          <tbody>
            <tr><td><strong>Prior</strong> P(θ)</td><td>Keyakinan sebelum data — dari historis/domain</td><td>&ldquo;Segmen sejenis default ~5%&rdquo; → Beta(2,38)</td></tr>
            <tr><td><strong>Likelihood</strong> P(data|θ)</td><td>Model bagaimana data muncul dari θ</td><td>Binomial: 8 default dari 200</td></tr>
            <tr><td><strong>Posterior</strong> P(θ|data)</td><td>Keyakinan sesudah data — ∝ prior × likelihood</td><td>Beta(10,230) → mean ≈ 4,2%</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Alur kerjanya siklikal:</strong> posterior hari ini = prior besok. Data datang bertahap → keyakinan diperbarui bertahap. Tidak seperti frequentist yang &ldquo;menghitung ulang dari nol&rdquo;, Bayesian <strong>mengakumulasi pengetahuan</strong> — sifat alaminya untuk monitoring dan pembelajaran berkelanjutan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Prior itu subjektif, jadi Bayesian tidak ilmiah.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> prior yang <em>ditulis eksplisit dan bisa diaudit</em> justru lebih ilmiah daripada asumsi frequentist yang <em>disembunyikan</em> (misal &ldquo;α = 5%&rdquo; juga pilihan subjektif!). Lagipula: (1) prior bisa <strong>non-informatif</strong> (Beta(1,1) = &ldquo;saya tidak tahu&rdquo;); (2) <strong>data besar menghapus prior</strong> — posterior didominasi likelihood saat n besar; (3) sensitivitas prior bisa (dan harus) dilaporkan — lihat Lab 2.</p>
      </div>

      <h2 id="konjugat">Pasangan Konjugat Beta-Binomial</h2>
      <p><strong>Definisi.</strong> <strong>Konjugat</strong>: jika prior dan posterior berasal dari <em>keluarga distribusi yang sama</em>, updating menjadi aritmetika sederhana. Pasangan paling terkenal: <strong>prior Beta + likelihood Binomial → posterior Beta</strong>:</p>
      <Tex math={String.raw`Beta(\alpha, \beta) + (x \text{ dari } n) \;\longrightarrow\; Beta(\alpha+x,\; \beta+n-x)`} block />
      <p><strong>Artinya:</strong> cukup <em>tambahkan</em> jumlah sukses ke α dan jumlah gagal ke β. Tidak ada integral, tidak ada MCMC — updating Bayesian semudah penjumlahan.</p>
      <p><strong>Mean posterior</strong> — kompromi elegan antara prior dan data:</p>
      <Tex math={String.raw`E[\theta \mid data] = \frac{\alpha + x}{\alpha + \beta + n} = w \cdot \underbrace{\frac{x}{n}}_{\text{MLE}} + (1-w) \cdot \underbrace{\frac{\alpha}{\alpha+\beta}}_{\text{prior mean}}, \quad w = \frac{n}{\alpha+\beta+n}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`w`} /> = bobot data — makin besar n, makin <Tex math={String.raw`w \to 1`} /> (data menang); <Tex math={String.raw`\alpha+\beta`} /> = &ldquo;ukuran sampel semu&rdquo; prior (keyakinan prior setara berapa observasi). Prior Beta(2,38): mean 5% dengan bobot &ldquo;40 observasi&rdquo;.</p>
      <p><strong>Kepribadian Beta-Binomial:</strong> si diplomat — tidak memihak membabi buta pada &ldquo;kata leluhur&rdquo; (prior) maupun &ldquo;data kemarin sore&rdquo; (MLE); ia menimbang keduanya sesuai bobot bukti masing-masing.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: updating default rate</summary>
        <p>Prior dari segmen lama: Beta(2, 38) — mean 5%, &ldquo;keyakinan setara 40 observasi&rdquo;. Data segmen baru: 8 default dari 200.</p>
        <p><strong>Langkah 1</strong> — posterior: Beta(2+8, 38+192) = <strong>Beta(10, 230)</strong>.<br />
        <strong>Langkah 2</strong> — mean posterior: 10/240 ≈ <strong>4,17%</strong>.<br />
        <strong>Langkah 3</strong> — cek kompromi: MLE data = 8/200 = 4%; prior mean = 5%. Bobot data w = 200/240 ≈ 0,83 → 0,83×4% + 0,17×5% ≈ 4,17%. ✓</p>
        <p>Posterior (4,17%) berada di antara MLE (4%) dan prior (5%) — ditarik ke prior karena keyakinan prior (&ldquo;40 observasi&rdquo;) tidak bisa diabaikan terhadap n=200.</p>
      </details>

      <PlotlyChart
        data={updateData}
        title="Prior → Posterior: Keyakinan Menyempit & Bergeser oleh Data"
        layout={{ xaxis: { title: "θ (proporsi)" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva abu-abu putus-putus = keyakinan awal Beta(2,2) (lebar, tidak yakin); kurva biru = keyakinan setelah melihat 2 sukses dari 10.</p>
        <p><strong>Interpretasi:</strong> posterior <strong>lebih sempit</strong> (lebih yakin — data menambah informasi) dan <strong>bergeser kiri</strong> (data 20% menarik keyakinan dari 50% ke ~29%). Inilah updating Bayesian dalam bentuk visual: <em>belajar = menyempit + bergeser</em>.</p>
      </div>

      <h2 id="credible">Credible Interval — &ldquo;95%&rdquo; yang Sebenarnya</h2>
      <p><strong>Definisi.</strong> <strong>Credible interval</strong> 95% adalah rentang [a, b] sehingga <strong>peluang posterior</strong> θ di dalamnya = 95%:</p>
      <Tex math={String.raw`P(a \le \theta \le b \mid data) = 0{,}95`} block />
      <p><strong>Perbedaan fundamental dari CI frequentist:</strong> di sini θ diperlakukan sebagai <em>acak</em> (distribusi posterior) — sehingga kalimat &ldquo;<strong>ada 95% peluang θ di dalam interval ini</strong>&rdquo; adalah <strong>benar secara harfiah</strong>. Inilah interpretasi yang selama ini orang <em>inginkan</em> dari CI — dan yang salah untuk CI frequentist (A2.3).</p>
      <p>Untuk posterior Beta, credible interval 95% = persentil 2,5% dan 97,5% dari distribusi posterior. Untuk Beta(9,13): mean 41%, 95% credible interval ≈ (21%, 62%).</p>

      <PlotlyChart
        data={credData}
        title="Posterior Beta(9,13) dengan 95% Credible Interval"
        layout={{ xaxis: { title: "θ" }, yaxis: { title: "Kepadatan posterior" }, showlegend: true, shapes: [{ type: "line", x0: 0.21, x1: 0.21, y0: 0, y1: 2.5, line: { dash: "dash", color: "#c2410c" } }, { type: "line", x0: 0.62, x1: 0.62, y0: 0, y1: 2.5, line: { dash: "dash", color: "#c2410c" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva = distribusi posterior (keyakinanmu tentang θ setelah data). Garis oranye = batas credible interval 95%.</p>
        <p><strong>Interpretasi:</strong> luas di antara garis oranye = 95% — <strong>kamu boleh berkata</strong> &ldquo;95% yakin θ antara 21% dan 62%&rdquo;. Bandingkan dengan CI frequentist di A2.3 yang <em>melarang</em> kalimat itu. Perbedaan satu kata (credible vs confidence) = perbedaan filosofi total.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> credible interval menjawab pertanyaan manusia yang sebenarnya (&ldquo;seberapa yakin saya?&rdquo;), sedangkan CI frequentist menjawab pertanyaan prosedur (&ldquo;seberapa andal metodenya?&rdquo;). Untuk <strong>komunikasi ke pengambil keputusan</strong>, credible interval hampir selalu lebih intuitif — salah satu alasan Bayesian populer di industri.</p>
      </div>

      <h2 id="prior">Memilih Prior — Seni yang Jujur</h2>
      <p><strong>Tiga jenis prior:</strong></p>
      <ol>
        <li><strong>Non-informatif:</strong> Beta(1,1) (uniform — &ldquo;semua nilai sama mungkin&rdquo;) atau Jeffreys Beta(0,5, 0,5). Untuk &ldquo;saya tidak tahu apa-apa&rdquo;. Posterior ≈ didominasi data.</li>
        <li><strong>Informatif lemah:</strong> Beta(2,2) — &ldquo;sedikit condong ke tengah, tapi terbuka&rdquo;. Menstabilkan estimasi n kecil tanpa mendikte.</li>
        <li><strong>Informatif:</strong> Beta(2,38) dari data historis — &ldquo;saya tahu banyak&rdquo;. Kuat untuk n kecil; wajib dilaporkan &amp; diuji sensitivitasnya.</li>
      </ol>
      <p><strong>Aturan kejujuran:</strong> (1) prior harus <strong>ditulis &amp; dibenarkan</strong> (&ldquo;dari 3 tahun data segmen X&rdquo;); (2) laporkan <strong>analisis sensitivitas</strong> — bagaimana hasil berubah jika prior diganti (Lab 2); (3) jika hasil <em>sangat</em> tergantung prior, akui: &ldquo;data belum cukup; kesimpulan didominasi asumsi.&rdquo;</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Prior non-informatif = tidak ada asumsi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> tidak ada prior yang benar-benar &ldquo;tanpa asumsi&rdquo; — Beta(1,1) uniform dalam θ <em>tidak</em> uniform dalam transformasinya (misal log-odds). &ldquo;Non-informatif&rdquo; berarti &ldquo;berusaha netral&rdquo;, bukan &ldquo;bebas asumsi&rdquo;. Kejujuran Bayesian bukan pada ketiadaan asumsi, melainkan pada <strong>keterbukaan</strong> asumsi.</p>
      </div>

      <PlotlyChart
        data={priorSensData}
        title="Sensitivitas Prior: Tiga Keyakinan Awal, Satu Data (8/20)"
        layout={{ xaxis: { title: "θ (default rate)" }, yaxis: { title: "Kepadatan posterior" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga kurva posterior dari data yang sama (8 default dari 20) tapi prior berbeda.</p>
        <p><strong>Interpretasi:</strong> dengan n=20, prior masih &ldquo;menarik&rdquo; posterior: skeptis → 17%, netral → 41%, pesimis → 45%. <strong>Pesan ganda:</strong> (1) untuk n kecil, prior penting — pilih &amp; laporkan dengan jujur; (2) untuk n besar, ketiganya menyatu (coba di Lab 2 dengan n=200). Bayesian tidak menyembunyikan ketergantungan pada asumsi — ia <strong>mengkuantifikasinya</strong>.</p>
      </div>

      <h2 id="banding">Bayesian vs Frequentist — Kapan yang Mana</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th></th><th>Frequentist</th><th>Bayesian</th></tr></thead>
          <tbody>
            <tr><td><strong>θ itu…</strong></td><td>Tetap, tak diketahui</td><td>Variabel acak (keyakinan)</td></tr>
            <tr><td><strong>Ketidakpastian</strong></td><td>Prosedur pengulangan (CI, p-value)</td><td>Distribusi posterior</td></tr>
            <tr><td><strong>&ldquo;95%&rdquo;</strong></td><td>95% interval mencakup θ (prosedur)</td><td>95% peluang θ di interval ini</td></tr>
            <tr><td><strong>Data kecil + info awal</strong></td><td>Sulit (hanya data bicara)</td><td>Alami (prior membantu)</td></tr>
            <tr><td><strong>Komputasi</strong></td><td>Ringan (rumus)</td><td>Berat (MCMC untuk non-konjugat)</td></tr>
            <tr><td><strong>Monitoring berkala</strong></td><td>Peeking bermasalah!</td><td>Natural (update posterior)</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Catatan penting:</strong> untuk n besar dengan prior non-informatif, keduanya <strong>konvergen</strong> — posterior ≈ distribusi sampling MLE. Perdebatan filosofisnya seru, tapi praktisnya: <strong>gunakan Bayesian saat prior berharga (n kecil, monitoring) dan frequentist saat rumus cukup (n besar, standar)</strong>. Analis modern memakai keduanya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> keunggulan praktis terbesar Bayesian di industri: <strong>monitoring tanpa dosa peeking</strong>. Frequentist melarang mengintip A/B test sebelum n tercapai; Bayesian <em>mempersilakan</em> update posterior tiap hari — karena posterior adalah keyakinan saat ini, bukan keputusan final dengan α yang digelembungkan. (Tetap butuh aturan keputusan yang disiplin!)</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Bayesian = &ldquo;percaya, tapi update&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Beta-Binomial — dari 5% ke 7,3%</summary>
              <p>Prior PD ~ Beta(5, 95) (mean 5%, &ldquo;100 nasabah virtual&rdquo;). Data: 200 nasabah, 16 gagal (8%). Posterior?</p>
              <p><strong>Langkah 1</strong> — posterior = Beta(5+16, 95+184) = <strong>Beta(21, 279)</strong>.<br />
              <strong>Langkah 2</strong> — mean = 21/300 = <strong>7%</strong>. (Naif: 8%; prior murni: 5%.)<br />
              <strong>Langkah 3</strong> — P(PD &gt; 8% | data) dari Beta(21,279) ≈ 25% — jawaban langsung untuk keputusan! (Frekuentis tidak bisa menjawab ini.)</p>
              <p>Pelajaran: konjugat = update dengan <em>penjumlahan</em>. Dan posterior memberi seluruh distribusi — bukan titik.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Prior skeptis vs antusias — sensitivitas</summary>
              <p>Data sama (16/200). Prior A (skeptis): Beta(50, 950) [mean 5%, kuat]. Prior B (vague): Beta(1, 1). Bandingkan posterior.</p>
              <p><strong>Langkah 1</strong> — A: Beta(66, 1134) → mean <strong>5,5%</strong> (data hampir tidak menggerakkan prior kuat!).<br />
              <strong>Langkah 2</strong> — B: Beta(17, 185) → mean <strong>8,4%</strong> (≈ data).<br />
              <strong>Langkah 3</strong> — pelajaran: dengan n=200, prior kuat <em>mendominasi</em>. <strong>Uji sensitivitas wajib</strong>: laporkan hasil di beberapa prior. Jika kesimpulan berubah → data belum cukup kuat; katakan jujur.</p>
              <p>Pelajaran: Bayesian memaksa prior <em>eksplisit</em> — dan karena eksplisit, ia bisa diuji. Frekuentis menyembunyikan asumsi; Bayesian menampilkannya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Updating Beta-Binomial Langkah demi Langkah</h2>
      <p>Estimasi default rate segmen baru: prior dari segmen lama (Beta(2,38)), data datang per bulan. Saksikan posterior sebagai kompromi — dan prior yang &ldquo;terlupakan&rdquo; seiring data bertambah.</p>
      <PyodideLab
        title="Lab 1 — Updating Beta-Binomial Bertahap (Live Python)"
        hint="⚡ Live Python. Coba: ubah prior jadi Beta(1,1) (netral). Posterior bulan 1 berubah berapa? Lalu tambah 'Bulan 4' dengan 200 data — lihat prior lenyap."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Sensitivitas Prior</h2>
      <p>Tiga analis, tiga prior, satu data (8/20). Seberapa beda kesimpulan mereka? Lalu perbesar n dan saksikan perbedaannya lenyap.</p>
      <PyodideLab
        title="Lab 2 — Uji Sensitivitas Prior (Live Python)"
        hint="Coba: ubah data jadi 80/200 (n=200, proporsi sama). Ketiga posterior menyatu ke ~40% — bukti matematis bahwa data besar menghapus perbedaan prior."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Bayesian</h2>

      <div className="decision-card">
        <h3>1. n kecil + pengetahuan awal kuat → <strong>Bayesian dengan prior informatif</strong></h3>
        <p><strong>Kondisi:</strong> segmen baru 50 nasabah, tapi 3 tahun data segmen sejenis.</p>
        <p><strong>Kenapa:</strong> prior menstabilkan estimasi yang liar jika hanya mengandalkan 50 data. Frequentist murni akan memberi CI selebar jurang.</p>
        <p><strong>Contoh nyata:</strong> PD segmen baru = kompromi prior historis + data awal (seperti Lab 1).</p>
      </div>

      <div className="decision-card">
        <h3>2. Monitoring / updating berkala → <strong>Bayesian updating</strong></h3>
        <p><strong>Kondisi:</strong> dashboard yang diperbarui harian/mingguan; A/B test yang ingin dipantau tanpa dosa peeking.</p>
        <p><strong>Kenapa:</strong> posterior hari ini = prior besok — akumulasi pengetahuan yang natural. (Tetapkan aturan keputusan terpisah!)</p>
        <p><strong>Contoh nyata:</strong> Bayesian A/B testing: &ldquo;P(B &gt; A | data) = 93%&rdquo; — langsung bisa diinterpretasi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh pernyataan probabilitas langsung → <strong>credible interval / posterior</strong></h3>
        <p><strong>Kondisi:</strong> direksi bertanya &ldquo;berapa peluang PD di atas 5%?&rdquo;.</p>
        <p><strong>Kenapa:</strong> P(θ &gt; 5% | data) dihitung langsung dari posterior — tidak ada padanan frequentist yang natural. Untuk komunikasi eksekutif, ini jauh lebih intuitif.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;peluang default rate &gt; 5% hanya 8%&rdquo; — dari luas posterior di atas 0,05.</p>
      </div>

      <div className="decision-card">
        <h3>4. n besar, tanpa info awal, butuh standar → <strong>frequentist cukup</strong></h3>
        <p><strong>Kondisi:</strong> survei 10.000 responden, tidak ada prior khusus.</p>
        <p><strong>Kenapa:</strong> posterior ≈ hasil frequentist (prior terlupakan). Rumus lebih cepat, lebih standar, lebih mudah diaudit. Jangan Bayesian hanya karena &ldquo;modern&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> polling nasional — interval Wald/Wilson sudah memadai.</p>
      </div>

      <div className="decision-card">
        <h3>5. Model kompleks non-konjugat → <strong>Bayesian komputasional (MCMC)</strong></h3>
        <p><strong>Kondisi:</strong> model hierarkis, banyak parameter, tidak ada pasangan konjugat.</p>
        <p><strong>Kenapa:</strong> updating analitik tidak tersedia — pakai MCMC (Stan, PyMC). Di luar cakupan lesson dasar ini, tapi ketahui: inilah &ldquo;level berikutnya&rdquo; Bayesian.</p>
        <p><strong>Contoh nyata:</strong> model PD hierarkis per segmen × wilayah dengan partial pooling.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Prior ditulis &amp; dibenarkan</strong> — &ldquo;dari data historis X&rdquo;, bukan &ldquo;feeling&rdquo;.</li>
          <li><strong>Selalu uji sensitivitas prior</strong> — jika kesimpulan bergantung pada prior, katakan terus terang.</li>
          <li><strong>Beta-Binomial untuk proporsi</strong> — updating semudah penjumlahan; hafalkan polanya.</li>
          <li>Untuk n besar &amp; tanpa prior: frequentist cukup — jangan over-engineering.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Default Rate Segmen Baru</h2>
      <div className="callout">
        <p>DanaKita membuka segmen <strong>kredit warung</strong>. Data historis segmen <strong>kios pasar</strong> (mirip): default ~5% (dari 2.000 pinjaman). Setelah 3 bulan segmen baru: <strong>165 pinjaman, 9 default</strong> (MLE = 5,45%).</p>
        <p>Tim risiko terbelah: kubu &ldquo;data bicara&rdquo; mau pakai 5,45%; kubu &ldquo;pengalaman bicara&rdquo; mau pakai 5% historis. Kamu diminta angka tunggal untuk pricing + ukuran ketidakpastiannya.</p>
        <p><strong>Pertanyaan:</strong> (a) Susun prior Beta yang mewakili &ldquo;5% dengan keyakinan sedang&rdquo;. (b) Hitung posterior mean &amp; 95% credible interval. (c) Jawab kedua kubu — dan apa keputusan pricing-mu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Prior Beta(5, 95)</strong>: mean 5%, &ldquo;bobot&rdquo; 100 observasi — keyakinan sedang (tidak mendikte, tidak diabaikan). Alternatif defensibel: Beta(2,38) (bobot 40) jika ingin lebih terbuka pada data baru.</p>
          <p>(b) Posterior = Beta(5+9, 95+156) = <strong>Beta(14, 251)</strong>. Mean = 14/265 ≈ <strong>5,28%</strong>. 95% credible interval ≈ <strong>(2,9%, 8,2%)</strong>.</p>
          <p>(c) <strong>Kedua kubu setengah benar:</strong> 5,45% (MLE) mengabaikan 2.000 data historis; 5% mengabaikan 165 data baru. Posterior 5,28% adalah kompromi berbobot bukti. <strong>Keputusan pricing:</strong> pakai <strong>batas atas credible interval yang didiskon</strong> — misal PD konservatif 7% untuk pricing (di dalam CI, di atas mean), dengan <em>review trigger</em>: jika 6 bulan lagi posterior mean &gt; 6%, repricing. <strong>Bayesian memberi bukan cuma angka, tapi juga aturan belajarnya.</strong></p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Prior Beta(2, 18), data 50 trial 2 sukses. Posterior? Mean?</li>
              <li>Kapan prior <em>informatif</em> dibenarkan? Kapan harus vague?</li>
              <li>Interpretasikan: &ldquo;interval credible 95% PD = (4%; 9%)&rdquo; — bandingkan dengan interpretasi CI frekuentis.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Beta(4, 66); mean = 4/70 ≈ <strong>5,7%</strong>.</p>
              <p><strong>2.</strong> Informatif dibenarkan saat ada <em>pengetahuan nyata</em> (data historis 100rb nasabah!). Vague saat tidak tahu / ingin &ldquo;biarkan data bicara&rdquo; / untuk <em>uji sensitivitas</em> pembanding.</p>
              <p><strong>3.</strong> Bayesian: &ldquo;<strong>P(PD ∈ (4%;9%) | data) = 95%</strong>&rdquo; — pernyataan langsung tentang parameter. Frekuentis: &ldquo;prosedur ini menangkap nilai benar 95% dari waktu&rdquo; — tentang <em>prosedur</em>. Yang pertama = yang ditanya direksi.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Tes 99% akurat, hasil positif, tapi penyakitnya 1/10.000. Peluang benar-benar sakit?"
        options={[
          "99%",
          "~1% — base rate (prior) mendominasi: 100 false positive vs 1 true positive",
          "50%",
          "0,01%",
        ]}
        correct={1}
        explanation="Benar — base-rate fallacy. P(sakit|positif) = (0,99×0,0001)/(0,99×0,0001 + 0,01×0,9999) ≈ 1%. Bukti kuat (99% akurat) dikalahkan prior yang sangat kecil. Inilah mengapa skrining massal penyakit langka butuh tes konfirmasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Prior Beta(2,38), data 8 sukses dari 200. Posterior?"
        options={[
          "Beta(10, 230)",
          "Beta(8, 200)",
          "Beta(2, 38)",
          "Beta(10, 238)",
        ]}
        correct={0}
        explanation="Benar: α + x = 2+8 = 10; β + (n−x) = 38+192 = 230. Updating konjugat semudah penjumlahan — hafalkan polanya, bukan rumusnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 95% credible interval (2,9%, 8,2%) untuk PD. Pernyataan yang BENAR?"
        options={[
          "95% data ada di rentang itu",
          "Ada 95% peluang PD sebenarnya di antara 2,9% dan 8,2% — benar secara harfiah untuk credible interval",
          "Sama saja dengan confidence interval",
          "PD pasti 5,55% (tengahnya)",
        ]}
        correct={1}
        explanation="Benar. Inilah keunggulan Bayesian: θ diperlakukan sebagai distribusi, sehingga pernyataan probabilitas tentang θ valid. Untuk CI frequentist, kalimat ini justru miskonsepsi (A2.3)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dengan n=20, tiga prior berbeda memberi posterior 26%, 40%, 43%. Dengan n=2.000 proporsi sama, ketiganya → ~40%. Pelajarannya?"
        options={[
          "Prior tidak pernah penting",
          "Prior penting untuk n kecil (laporkan sensitivitasnya); data besar menghapus perbedaan prior secara otomatis",
          "Selalu pakai prior netral",
          "Bayesian tidak konsisten",
        ]}
        correct={1}
        explanation="Benar. Bobot data w = n/(α+β+n) → 1 saat n besar. Ini adalah 'theorema' bukan opini: dengan data cukup, semua prior yang wajar konvergen. Untuk n kecil, kejujuran = laporkan sensitivitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan Bayesian jelas mengungguli frequentist?"
        options={[
          "Selalu — lebih modern",
          "n kecil + prior kuat & defensibel; monitoring berkala; butuh pernyataan probabilitas langsung (P(θ>5%|data))",
          "Tidak pernah",
          "Hanya untuk data normal",
        ]}
        correct={1}
        explanation="Benar. Tiga keunggulan praktis Bayesian. Untuk n besar tanpa prior, keduanya konvergen — frequentist lebih simpel. Pilih alat sesuai masalah, bukan sesuai tren."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Analis memakai prior Beta(50,50) ('sangat yakin 50%') untuk data 8/20 tanpa justifikasi, lalu melaporkan posterior 35% sebagai 'fakta'. Masalahnya?"
        options={[
          "Tidak ada — itu Bayesian",
          "Prior kuat tanpa justifikasi mendikte hasil (bobot 100 obs vs data 20); melanggar aturan kejujuran: prior harus dibenarkan + sensitivitas dilaporkan",
          "Harusnya pakai frequentist",
          "Beta(50,50) salah hitung",
        ]}
        correct={1}
        explanation="Benar. Prior adalah asumsi yang ditulis eksplisit — bukan lisensi memasukkan keyakinan sembarangan. Bobot prior (100) 5× bobot data (20): hasilnya lebih mencerminkan prior daripada data. Bayesian yang tidak jujur = frequentist yang menyembunyikan α."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Teorema Bayes:</strong> <Tex math={String.raw`P(H|D) = P(D|H)P(H)/P(D)`} /> — keyakinan baru ∝ kecocokan bukti × keyakinan lama.</li>
          <li><strong>Base-rate fallacy:</strong> tanpa prior, bukti 99% akurat pun bisa 99% menyesatkan.</li>
          <li><strong>Beta-Binomial:</strong> Beta(α,β) + (x dari n) → Beta(α+x, β+n−x). Mean posterior = kompromi berbobot <Tex math={String.raw`w = n/(\alpha+\beta+n)`} />.</li>
          <li><strong>Credible interval:</strong> &ldquo;95% peluang θ di dalam&rdquo; — benar secara harfiah (beda dari CI frequentist).</li>
          <li><strong>Prior:</strong> tulis &amp; benarkan; uji sensitivitas; data besar menghapus perbedaan prior.</li>
          <li><strong>Posterior hari ini = prior besok</strong> — akumulasi pengetahuan; monitoring tanpa dosa peeking.</li>
          <li><strong>Jangan:</strong> prior kuat tanpa justifikasi; mengklaim &ldquo;tanpa asumsi&rdquo;; memakai Bayesian saat frequentist cukup.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a211-ab-testing" className="btn btn-secondary btn-sm">← A2.11</Link>
        <Link href="/learn/a213-kausalitas" className="btn btn-primary btn-sm">Next: A2.13 →</Link>
      </div>
    </div>
  );
}

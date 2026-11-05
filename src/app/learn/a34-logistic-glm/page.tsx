"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A34Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const sigmoidData = [
    {
      x: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
      y: [0.0025, 0.0067, 0.018, 0.047, 0.119, 0.269, 0.5, 0.731, 0.881, 0.953, 0.982, 0.993, 0.9975],
      mode: "lines",
      type: "scatter",
      name: "Fungsi sigmoid",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const logitLinearData = [
    {
      x: [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
      y: [0.62, 0.45, 0.32, 0.22, 0.14, 0.09, 0.05, 0.03, 0.018, 0.01, 0.006],
      mode: "markers",
      type: "scatter",
      name: "PD observasi per skor",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [300, 800],
      y: [0.62, 0.006],
      mode: "lines",
      type: "scatter",
      name: "Kurva logistik fitted",
      line: { color: "#e8a838", width: 3 },
    },
  ];

  const oddsData = [
    {
      x: ["Skor 400", "Skor 500", "Skor 600"],
      y: [0.47, 0.16, 0.053],
      name: "Odds default",
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#22c55e"] },
    },
  ];

  const lab1Code = `# Regresi logistik dari NOL: gradient descent manual
# Data: skor kredit (standar) vs default (1=gagal, 0=lancar)
import random, math
random.seed(3)

skor = [random.gauss(0,1) for _ in range(400)]
# kebenaran: P(default) = sigmoid(-1.2 - 1.8*skor)
def sigmoid(z): return 1/(1+math.exp(-z))
y = [1 if random.random() < sigmoid(-1.2 - 1.8*s) else 0 for s in skor]
print(f"default rate sampel: {sum(y)/len(y):.1%} (n={len(y)})")

# Maximum Likelihood via gradient descent
b0, b1 = 0.0, 0.0
lr = 0.5
for it in range(300):
    g0 = g1 = 0.0
    for s, yi in zip(skor, y):
        p = sigmoid(b0 + b1*s)
        g0 += (yi - p)          # gradien thd b0
        g1 += (yi - p)*s        # gradien thd b1
    b0 += lr*g0/len(y); b1 += lr*g1/len(y)

print(f"\nEstimasi: b0 = {b0:.3f} (benar: -1.2), b1 = {b1:.3f} (benar: -1.8)")
print(f"Odds ratio skor: exp({b1:.3f}) = {math.exp(b1):.3f}")
print(f"-> tiap +1 SD skor, odds default dikali {math.exp(b1):.2f} (turun {100*(1-math.exp(b1)):.0f}%)")
print("\nCOBA: ubah lr=0.5 -> lr=5.0. Apa yang terjadi? (divergen!)")
print("COBA: kecilkan n jadi 60. Estimasi masih akurat?")`;

  const lab2Code = `# Odds, probabilitas, dan jebakan interpretasi koefisien
import math

def sigmoid(z): return 1/(1+math.exp(-z))

# Model: logit(P) = -1.2 - 1.8*skor_std + 0.9*punya_tunggakan
b0, b_skor, b_tunggak = -1.2, -1.8, 0.9

def pd(skor_std, tunggak):
    return sigmoid(b0 + b_skor*skor_std + b_tunggak*tunggak)

print("PD untuk berbagai profil nasabah:")
print(f"{'skor':>6} {'tunggakan':>9} | {'PD':>7} | odds")
print("-"*40)
for s, t in [(1.5,0),(0,0),(-1,0),(-1,1),(0,1)]:
    p = pd(s,t); odds = p/(1-p)
    print(f"{s:>6} {t:>9} | {p:>6.1%} | {odds:.3f}")

print()
print("Efek punya_tunggakan (b=0.9) pada DUA level risiko:")
for s, label in [(1.0,"risiko rendah"),(-1.0,"risiko tinggi")]:
    p0, p1 = pd(s,0), pd(s,1)
    print(f"  {label}: PD {p0:.1%} -> {p1:.1%}  (naik {p1-p0:.1%} poin,",
          f"tapi odds ratio TETAP {math.exp(0.9):.2f}x)")
print()
print("PELAJARAN: odds ratio konstan (2.46x), tapi efek dalam")
print("POIN probabilitas tergantung level risiko awal - tidak konstan!")
print("Jangan pernah bilang 'tunggakan menaikkan PD sebesar X%' tanpa")
print("menyebut dari level berapa.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.4 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Regresi Logistik &amp; GLM:<br />Ketika Jawabannya Bukan Angka, Melainkan Peluang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model yang Memprediksi Probabilitas 140%</a></li>
          <li><a href="#logit">Fungsi Logit &amp; Sigmoid — Mesin Pengubah Tak Terbatas jadi Peluang</a></li>
          <li><a href="#odds">Odds Ratio — Bahasa Asli Regresi Logistik</a></li>
          <li><a href="#mle">Estimasi Maximum Likelihood — OLS Tidak Bisa Dipakai</a></li>
          <li><a href="#glm">GLM — Keluarga Besar Regresi Logistik</a></li>
          <li><a href="#lab1">🔬 Lab 1: Regresi Logistik dari Nol (Gradient Descent Manual)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Odds Ratio Konstan, Efek Poin Tidak</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: OLS, Logistik, atau GLM Lain?</a></li>
          <li><a href="#case">📋 Mini-Case: Scorecard PD untuk Pengajuan KTA</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa OLS gagal untuk target biner dan menurunkan fungsi logistik dari kebutuhan membatasi output ke [0,1].</li>
          <li>Menghitung dan menginterpretasikan odds ratio dari koefisien, termasuk perbedaan odds ratio vs perubahan poin probabilitas.</li>
          <li>Menjelaskan prinsip maximum likelihood estimation (MLE) dan kapan terjadi separasi sempurna.</li>
          <li>Memetakan GLM (link function + distribusi) untuk memilih model yang tepat: logistik, Poisson, Gamma.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Model yang Memprediksi Probabilitas 140%</h2>
      <div className="story">
        <p>Analis junior di multifinance diminta memprediksi peluang gagal bayar (<em>probability of default</em>, PD). Ia pakai cara yang ia kenal: regresi linear OLS dengan target 0/1. Hasilnya &ldquo;bagus&rdquo; — R² lumayan, koefisien masuk akal. Model dipresentasikan, disetujui, dipakai untuk pricing.</p>
        <p>Sebulan kemudian, sistem pricing mengajukan harga untuk debitur super-berisiko: PD terprediksi = <strong>140%</strong>. Dan untuk debitur super-aman: PD = <strong>−30%</strong>. Probabilitas di atas 100% dan di bawah 0% — modelnya &ldquo;bocor&rdquo; keluar dari akal sehat.</p>
        <p>Twist-nya: ini bukan bug — ini <em>konsekuensi matematis</em> memakai garis lurus untuk target yang terbatas [0,1]. Garis lurus tidak kenal batas; ia terus jalan ke 140% dan −30%. Solusinya bukan &ldquo;potong manual jadi 0–100%&rdquo; (itu menambal gejala), melainkan fungsi yang <em>secara alami</em> terjepit di [0,1]: <strong>kurva logistik</strong>. Lesson ini tentang memodelkan peluang dengan benar.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="logit">Fungsi Logit &amp; Sigmoid — Mesin Pengubah Tak Terbatas jadi Peluang</h2>
      <p><strong>Definisi.</strong> Regresi logistik memodelkan <strong>log-odds</strong> (logit) sebagai fungsi linear, lalu mengubahnya kembali menjadi probabilitas via fungsi <strong>sigmoid</strong>:</p>
      <Tex math={String.raw`\log\left(\frac{p_i}{1-p_i}\right) = \beta_0 + \beta_1 x_{i1} + \cdots + \beta_k x_{ik} \quad \Longleftrightarrow \quad p_i = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_{i1} + \cdots)}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`p_i = P(y_i = 1 \mid x_i)`} />: probabilitas kejadian (misal default) untuk observasi ke-<Tex math={String.raw`i`} /> — selalu di [0,1] berkat sigmoid</li>
        <li><Tex math={String.raw`\frac{p_i}{1-p_i}`} />: <strong>odds</strong> — rasio peluang terjadi vs tidak terjadi (p = 0,75 → odds = 3, &ldquo;3 banding 1&rdquo;)</li>
        <li><Tex math={String.raw`\log\left(\frac{p_i}{1-p_i}\right)`} />: <strong>logit</strong> — odds yang di-log, rentangnya (−∞, +∞) sehingga <em>boleh</em> dimodelkan linear</li>
        <li><Tex math={String.raw`\beta_j`} />: efek ke <strong>log-odds</strong>, BUKAN ke probabilitas langsung (inilah sumber 90% salah interpretasi!)</li>
      </ul>

      <PlotlyChart
        data={sigmoidData}
        title="Fungsi Sigmoid: Menjepit (−∞,∞) menjadi (0,1)"
        layout={{ xaxis: { title: "Skor linear z = β₀ + β₁x" }, yaxis: { title: "Probabilitas p", range: [0, 1.05] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = skor linear (bisa minus tak hingga sampai plus tak hingga), vertikal = probabilitas hasil (0–1). Kurva = fungsi sigmoid.</p>
        <p><strong>Interpretasi:</strong> berapa pun ekstremnya skor linear, output <em>tidak pernah</em> keluar dari [0,1] — inilah yang gagal dilakukan OLS. Perhatikan bentuk <strong>S</strong>: di tengah (p ≈ 0,5) kurva curam — perubahan kecil di x → perubahan besar di probabilitas; di ujung (p ≈ 0 atau 1) kurva datar — butuh perubahan x raksasa untuk menggerakkan probabilitas yang sudah ekstrem. <strong>Implikasi bisnis:</strong> menaikkan skor nasabah yang sudah aman hampir tidak menurunkan PD-nya lagi (diminishing return).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> nama &ldquo;regresi logistik&rdquo; menipu — ini <strong>klasifikasi</strong>, bukan regresi. Ia disebut regresi karena memodelkan <em>parameter</em> distribusi (probabilitas) sebagai fungsi regresi. Dan meski outputnya probabilitas, keputusan bisnis butuh <strong>threshold</strong> (misal tolak jika PD &gt; 8%) — memilih threshold adalah keputusan ekonomi (biaya false positive vs false negative), bukan statistik (dibahas di A3.5).</p>
      </div>

      <h2 id="odds">Odds Ratio — Bahasa Asli Regresi Logistik</h2>
      <p><strong>Definisi.</strong> Jika <Tex math={String.raw`x_j`} /> naik 1 satuan, <strong>odds</strong> dikalikan sebesar:</p>
      <Tex math={String.raw`\text{Odds Ratio (OR)} = e^{\beta_j}`} block />
      <ul>
        <li><Tex math={String.raw`\beta_j = 0{,}9`} /> → OR = <Tex math={String.raw`e^{0{,}9} \approx 2{,}46`} />: odds kejadian menjadi <strong>2,46× lipat</strong> (naik 146%)</li>
        <li><Tex math={String.raw`\beta_j = -1{,}8`} /> → OR = <Tex math={String.raw`e^{-1{,}8} \approx 0{,}17`} />: odds menjadi 0,17× (turun 83%)</li>
        <li><Tex math={String.raw`\beta_j = 0`} /> → OR = 1: tidak ada efek</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: dari koefisien ke cerita bisnis</summary>
        <p>Model PD: <Tex math={String.raw`\text{logit}(p) = -1{,}2 - 1{,}8 \times \text{skor}_{std} + 0{,}9 \times \text{tunggakan}`} />.</p>
        <p><strong>Langkah 1</strong> — koefisien tunggakan 0,9 → OR = e<sup>0,9</sup> ≈ <strong>2,46</strong>.<br />
        <strong>Langkah 2</strong> — terjemahan: &ldquo;nasabah yang punya tunggakan punya <strong>odds default 2,46×</strong> dibanding yang tidak, pada skor yang sama.&rdquo;<br />
        <strong>Langkah 3</strong> — JANGAN bilang &ldquo;probabilitasnya naik 146%&rdquo;! Odds ≠ probabilitas. Jika PD awal 4% (odds 0,0417), odds baru = 0,0417 × 2,46 = 0,1026 → PD baru = 0,1026/1,1026 ≈ <strong>9,3%</strong> (naik 5,3 poin, bukan 146%).</p>
      </details>

      <PlotlyChart
        data={oddsData}
        title="Odds Default Menyusut Drastis seiring Skor Naik"
        layout={{ xaxis: { title: "Segmen skor" }, yaxis: { title: "Odds default" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga segmen skor kredit; tinggi batang = odds default (peluang gagal : peluang lancar).</p>
        <p><strong>Interpretasi:</strong> odds turun dari 0,47 → 0,053 — hampir 9× lipat. Inilah visual dari odds ratio: pergerakan skor menggeser odds secara <em>multiplikatif</em>, bukan aditif. Untuk pricing, ini berarti tarif risiko antar segmen berbeda secara proporsional — bukan selisih tetap.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Koefisien 0,9 berarti probabilitas naik 90%.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> koefisien logistik hidup di dunia <strong>log-odds</strong>, bukan probabilitas. e<sup>0,9</sup> = 2,46 adalah pengali <em>odds</em>. Efek ke probabilitas (dalam poin persen) <strong>tergantung posisi awal</strong> di kurva S: di tengah (p≈50%) efeknya besar, di ujung (p≈2%) efeknya kecil. Satu koefisien, efek probabilitas yang berbeda-beda — inilah mengapa &ldquo;efek marginal&rdquo; logistik selalu dilaporkan <em>pada nilai x tertentu</em> (biasanya rata-rata).</p>
      </div>

      <h2 id="mle">Estimasi Maximum Likelihood — OLS Tidak Bisa Dipakai</h2>
      <p><strong>Definisi.</strong> Koefisien logistik diestimasi dengan <strong>MLE</strong> (<em>maximum likelihood estimation</em> — kemungkinan maksimum): pilih <Tex math={String.raw`\beta`} /> yang membuat data yang teramati <strong>paling mungkin terjadi</strong>:</p>
      <Tex math={String.raw`L(\beta) = \prod_{i=1}^{n} p_i^{y_i}(1-p_i)^{1-y_i}, \qquad \hat{\beta} = \arg\max_{\beta} \log L(\beta)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`L(\beta)`} />: <em>likelihood</em> — probabilitas (bersama) mengamati data persis seperti ini, jika parameternya <Tex math={String.raw`\beta`} /></li>
        <li>Untuk <Tex math={String.raw`y_i = 1`} />: kontribusi = <Tex math={String.raw`p_i`} /> (model &ldquo;dihargai&rdquo; jika memberi probabilitas tinggi ke kejadian yang benar terjadi)</li>
        <li>Tidak ada rumus tertutup seperti OLS — diselesaikan iteratif (Newton-Raphson / gradient descent). Lab 1 menunjukkan caranya.</li>
      </ul>
      <p><strong>Separasi sempurna</strong> (<em>complete separation</em>): jika satu variabel memisahkan 0 dan 1 dengan sempurna (misal semua yang default punya skor &lt; 400, semua yang lancar &gt; 400), likelihood bisa dimaksimalkan dengan <Tex math={String.raw`\beta \to \pm\infty`} /> — koefisien &ldquo;meledak&rdquo;, SE raksasa. Obat: regularisasi (penalized logistic, A3.3) atau cek apakah variabel itu <em>terlalu bagus untuk jadi kenyataan</em> (sering = leakage, A3.8!).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> MLE adalah &ldquo;detektif terbalik&rdquo;: bukan &ldquo;parameter apa yang benar?&rdquo; (tak terjawab), melainkan &ldquo;parameter apa yang membuat bukti yang kita lihat menjadi <em>paling masuk akal</em>?&rdquo;. OLS sebenarnya juga MLE — untuk error normal. Jadi MLE bukan metode baru yang asing; ia adalah <em>generalisasi</em> dari prinsip yang sudah kamu kenal.</p>
      </div>

      <h2 id="glm">GLM — Keluarga Besar Regresi Logistik</h2>
      <p><strong>Definisi.</strong> GLM (<em>generalized linear model</em> — model linear yang digeneralisasi) menyatukan regresi untuk target non-normal dalam satu kerangka: <strong>distribusi</strong> + <strong>link function</strong>:</p>
      <Tex math={String.raw`g(\mu_i) = \beta_0 + \beta_1 x_{i1} + \cdots + \beta_k x_{ik}`} block />
      <ul>
        <li><Tex math={String.raw`g(\cdot)`} />: <em>link function</em> — &ldquo;penerjemah&rdquo; dari skala target ke skala linear</li>
        <li><Tex math={String.raw`\mu_i = E[y_i \mid x_i]`} />: rata-rata target yang dimodelkan</li>
      </ul>
      <p>Anggota keluarga (hafalkan pola <strong>target → distribusi → link</strong>):</p>
      <ul>
        <li><strong>Target kontinu</strong> → Normal + link identitas → <strong>OLS biasa</strong> (ya, OLS adalah GLM!)</li>
        <li><strong>Target biner (0/1)</strong> → Bernoulli/Binomial + link logit → <strong>regresi logistik</strong></li>
        <li><strong>Target count</strong> (jumlah klaim, jumlah transaksi) → Poisson + link log → <strong>regresi Poisson</strong>: <Tex math={String.raw`\log(\mu_i) = x_i'\beta`} />. Koefisien diinterpretasi multiplikatif: <Tex math={String.raw`e^{\beta_j}`} /> = pengali rata-rata count.</li>
        <li><strong>Target positif miring</strong> (besar klaim, LGD nominal) → Gamma + link log → <strong>regresi Gamma</strong>. Standar industri asuransi untuk severity.</li>
        <li><strong>Target ordinal</strong> (rating AAA–D) → ordered logit/probit.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: regresi Poisson untuk jumlah klaim</summary>
        <p>Model: <Tex math={String.raw`\log(\hat{\mu}) = -0{,}5 + 0{,}3 \times \text{usia\_kendaraan}`} />.</p>
        <p><strong>Langkah 1</strong> — koefisien 0,3 → pengali = e<sup>0,3</sup> ≈ 1,35.<br />
        <strong>Langkah 2</strong> — tiap +1 tahun usia kendaraan, <strong>rata-rata jumlah klaim dikali 1,35</strong> (naik 35%).<br />
        <strong>Langkah 3</strong> — prediksi untuk usia 5 tahun: μ̂ = e<sup>−0,5+0,3×5</sup> = e<sup>1,0</sup> ≈ <strong>2,72 klaim/tahun</strong>. Selalu non-negatif — link log menjaganya, seperti sigmoid menjaga probabilitas.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Regresi logistik butuh data seimbang 50:50.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> logistik mengestimasi <strong>probabilitas</strong> dengan benar berapa pun base rate-nya — ketidakseimbangan bukan pelanggaran asumsi. Yang rusak oleh imbalance ekstrem adalah <em>threshold klasifikasi default 0,5</em> dan metrik seperti akurasi (dibahas A3.5 &amp; A3.7). Jangan &ldquo;menyeimbangkan&rdquo; data lalu mengklaim probabilitasnya valid — sampling mengubah base rate dan merusak kalibrasi!</p>
      </div>

      <PlotlyChart
        data={logitLinearData}
        title="PD Observasi vs Kurva Logistik: Skor Kredit"
        layout={{ xaxis: { title: "Skor kredit" }, yaxis: { title: "PD", tickformat: ".0%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = skor kredit, vertikal = probability of default. Titik biru = PD aktual per kelompok skor; garis kuning = kurva logistik hasil fitting.</p>
        <p><strong>Interpretasi:</strong> PD turun curam di skor rendah-menengah lalu <em>mendatar</em> di skor tinggi — pola S khas yang tidak bisa ditangkap garis lurus. Perhatikan: di atas skor 700, menaikkan skor 50 poin hampir tidak mengubah PD (kurva datar) — <strong>jangan beri insentif bisnis untuk sesuatu yang tidak menggerakkan risiko</strong>.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Logistik = &ldquo;regresi untuk peluang&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Odds ratio — dari koef ke bahasa bisnis</summary>
              <p>Model: <code className="inline">macet ~ dpd</code>. Koef dpd = 0,05 (log-odds). Interpretasikan untuk dpd 30 vs 0.</p>
              <p><strong>Langkah 1</strong> — odds ratio per 1 hari dpd = e<sup>0,05</sup> ≈ 1,051 (+5,1% odds per hari).<br />
              <strong>Langkah 2</strong> — 30 hari: OR = e<sup>0,05×30</sup> = e<sup>1,5</sup> ≈ <strong>4,48</strong> — odds macet 4,5× lipat!<br />
              <strong>Langkah 3</strong> — ke peluang: jika baseline P = 2% (odds 0,0204), maka odds baru = 0,0914 → P ≈ <strong>8,4%</strong>. (Bukan 2% × 4,48 = 9% — odds ≠ peluang!)</p>
              <p>Pelajaran: koef logistik dibaca via <em>odds ratio</em> (perkalian odds), bukan penambahan peluang. Untuk &ldquo;berapa %&rdquo; → konversi via rumus logistik.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Separasi — koefisien meledak</summary>
              <p>Fitur <code className="inline">pernah_macet</code>: semua yang =1 → macet; semua =0 → lancar. Koefisien → ∞, SE raksasa. Apa yang terjadi?</p>
              <p><strong>Langkah 1</strong> — <strong>separasi sempurna</strong>: fitur memisahkan target 100% → likelihood dimaksimalkan di koef tak berhingga.<br />
              <strong>Langkah 2</strong> — gejala: koef raksasa + SE raksasa + warning konvergensi. Model &ldquo;sempurna&rdquo; tapi <em>tidak bisa</em> memberi peluang bermakna (0%/100%).<br />
              <strong>Langkah 3</strong> — obat: regularisasi (penalti menahan koef), atau sadari ini <em>aturan bisnis</em> (bukan model!): &ldquo;pernah macet → tolak&rdquo;.</p>
              <p>Pelajaran: separasi = &ldquo;terlalu bagus untuk jadi model&rdquo;. Kadang jawabannya bukan statistik — melainkan kebijakan.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Regresi Logistik dari Nol (Gradient Descent Manual)</h2>
      <p>Tidak ada library ML — hanya sigmoid + gradient descent dari prinsip MLE. Bandingkan estimasi dengan nilai benarnya.</p>
      <PyodideLab
        title="Lab 1 — MLE via Gradient Descent (Pure Python)"
        hint="Coba: lr=0.5 → 5.0 (divergen! learning rate terlalu besar). Coba n=400 → 60 (estimasi makin goyang)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Odds Ratio Konstan, Efek Poin Tidak</h2>
      <p>Koefisien yang sama memberi efek probabilitas berbeda di level risiko berbeda — buktikan sendiri.</p>
      <PyodideLab
        title="Lab 2 — Membedah Interpretasi Koefisien Logistik"
        hint="Coba: ubah b_tunggak 0.9 → 0.2. Odds ratio berubah, tapi pola 'efek poin tergantung level awal' tetap."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: OLS, Logistik, atau GLM Lain?</h2>

      <div className="decision-card">
        <h3>1. Target biner (default/tidak, fraud/bukan) → <strong>regresi logistik</strong></h3>
        <p><strong>Kondisi:</strong> <Tex math={String.raw`y \in \{0,1\}`} />; butuh probabilitas yang valid [0,1].</p>
        <p><strong>Kenapa:</strong> link logit menjamin output probabilitas; odds ratio interpretable untuk bisnis &amp; regulator.</p>
        <p><strong>Contoh nyata:</strong> model PD, scorecard kredit, deteksi fraud.</p>
      </div>

      <div className="decision-card">
        <h3>2. Target count (0, 1, 2, ...) → <strong>regresi Poisson</strong> (atau Negative Binomial jika overdispersi)</h3>
        <p><strong>Kondisi:</strong> target = jumlah kejadian; variansi ≈ mean (Poisson) atau variansi &gt; mean (NegBin).</p>
        <p><strong>Kenapa:</strong> link log menjaga prediksi non-negatif; koefisien = pengali.</p>
        <p><strong>Contoh nyata:</strong> frekuensi klaim asuransi, jumlah transaksi mencurigakan per nasabah.</p>
      </div>

      <div className="decision-card">
        <h3>3. Target positif &amp; miring kanan (nominal rugi) → <strong>regresi Gamma + link log</strong></h3>
        <p><strong>Kondisi:</strong> <Tex math={String.raw`y > 0`} />, distribusi miring kanan.</p>
        <p><strong>Kenapa:</strong> Gamma menangani heteroskedastisitas alami data severity (variansi ∝ mean²); standar industri asuransi.</p>
        <p><strong>Contoh nyata:</strong> severity klaim, LGD nominal.</p>
      </div>

      <div className="decision-card">
        <h3>4. Target ordinal (rating) → <strong>ordered logit</strong></h3>
        <p><strong>Kondisi:</strong> kategori berurutan (AAA &gt; AA &gt; ... &gt; D).</p>
        <p><strong>Kenapa:</strong> menghormati urutan tanpa mengasumsikan jarak antar rating sama (kesalahan A1.1!).</p>
        <p><strong>Contoh nyata:</strong> model rating internal bank (IRB).</p>
      </div>

      <div className="decision-card">
        <h3>5. Target kontinu &amp; (kira-kira) normal → <strong>OLS biasa</strong></h3>
        <p><strong>Kondisi:</strong> target kontinu tak terbatas, residual (kira-kira) normal.</p>
        <p><strong>Kenapa:</strong> OLS = GLM dengan link identitas — tidak perlu meriam untuk membunuh lalat.</p>
        <p><strong>Contoh nyata:</strong> return portofolio, spread kredit.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Bentuk target menentukan keluarga model</strong> — biner → logistik, count → Poisson, positif miring → Gamma.</li>
          <li>Koefisien logistik = efek ke <strong>log-odds</strong>. Terjemahkan via odds ratio, bukan persen probabilitas.</li>
          <li>Efek dalam poin probabilitas <strong>selalu</strong> tergantung level awal — laporkan pada nilai x yang spesifik.</li>
          <li>Separasi sempurna = alarm: cek leakage sebelum merayakan.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Scorecard PD untuk Pengajuan KTA</h2>
      <div className="callout">
        <p>Bank membangun scorecard KTA. Model logistik final (variabel sudah di-WoE):</p>
        <p><Tex math={String.raw`\text{logit}(p) = -2{,}1 - 0{,}04 \times \text{skor\_kredit} + 1{,}1 \times \text{tunggakan\_12m} + 0{,}5 \times \text{utilisasi\_tinggi}`} /></p>
        <ul>
          <li>skor_kredit: 300–850. tunggakan_12m: 0/1. utilisasi_tinggi: 0/1 (utilisasi &gt; 80%).</li>
          <li>Validasi: AUC 0,78, kalibrasi baik (dibahas A3.5–A3.6).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Nasabah A: skor 650, tidak ada tunggakan, utilisasi rendah. Berapa PD-nya? (b) Nasabah B: sama tapi punya tunggakan. Berapa odds ratio-nya dan PD barunya? (c) Tim bisnis usul: &ldquo;koefisien skor −0,04 kecil, buang saja.&rdquo; Tanggapanmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) logit = −2,1 − 0,04×650 = −28,1 → p ≈ <strong>0%</strong>?? Tunggu — ini tidak masuk akal! (Jebakan: skor mentah 300–850 tidak mungkin dipakai langsung dengan koefisien −0,04 tanpa scaling — model asumsi variabel sudah di-WoE/standar. Jika skor distandarkan (mean 0, SD 1) dan &ldquo;650&rdquo; = +0,5 SD: logit = −2,1 − 0,04×0,5 = −2,12 → p = 1/(1+e<sup>2,12</sup>) ≈ <strong>10,7%</strong>. <strong>Pelajaran: jangan hitung tanpa tahu skala variabel!</strong>)</p>
          <p>(b) OR tunggakan = e<sup>1,1</sup> ≈ <strong>3,0</strong>. Odds A = 0,107/0,893 = 0,120 → odds B = 0,120 × 3,0 = 0,36 → PD B = 0,36/1,36 ≈ <strong>26,5%</strong>. Satu tunggakan melipatgandakan odds 3× — dari 10,7% ke 26,5%.</p>
          <p>(c) <strong>Tolak.</strong> &ldquo;Kecil&rdquo; tidak bermakna tanpa satuan: −0,04 <em>per poin skor</em> berarti per 100 poin = −4,0 di logit → OR = e<sup>−4</sup> = 0,018 — efek <strong>raksasa</strong>! Inilah mengapa standarisasi penting untuk menilai &ldquo;besar&rdquo; koefisien (A3.3).</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Fungsi link logit vs probit — kapan bedanya <em>praktis</em> penting?</li>
              <li>Overdispersi pada Binomial (varians &gt; np(1−p)): 2 penyebab + 1 solusi.</li>
              <li>Mengapa akurasi bukan metrik tuning untuk model PD? (Hubungkan ke A3.5.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Hampir <strong>tidak pernah</strong> praktis penting (kurva mirip di tengah; beda di ekor ekstrem). Pilih logit untuk <em>interpretasi odds ratio</em> — alasan komunikasi, bukan statistik.</p>
              <p><strong>2.</strong> Penyebab: (a) <strong>heterogenitas tak teramati</strong> (p beda per individu — B13!), (b) <strong>korelasi dalam grup</strong>. Solusi: <strong>quasi-binomial</strong> (parameter dispersi) atau <strong>beta-binomial</strong> (p ~ Beta!).</p>
              <p><strong>3.</strong> PD dipakai untuk <em>ranking &amp; pricing</em> (butuh peluang terkalibrasi!), bukan klasifikasi ya/tidak. Akurasi butuh threshold arbitrer &amp; buta terhadap <em>seberapa yakin</em> model. Metrik: AUC (ranking) + kalibrasi (A3.6!).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Model OLS dengan target 0/1 memprediksi PD = 140% untuk debitur berisiko. Akar masalah?"
        options={[
          "Data kurang banyak",
          "Garis lurus tidak mengenal batas [0,1] — butuh fungsi link (sigmoid) yang menjepit output jadi probabilitas valid",
          "R² terlalu rendah",
          "Harus tambah variabel",
        ]}
        correct={1}
        explanation="Benar: ini konsekuensi matematis, bukan bug data. OLS memodelkan ekspektasi sebagai garis tak terbatas. Regresi logistik memakai link logit + sigmoid sehingga output selalu probabilitas valid."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Koefisien logistik β = 0,7 untuk variabel 'punya_kartu_kredit'. Interpretasi tepat?"
        options={[
          "Probabilitas naik 70%",
          "Odds dikali e^0,7 ≈ 2,01 — odds kejadian menjadi 2× lipat, dengan variabel lain tetap",
          "Probabilitas naik 2,01 poin persen",
          "Tidak ada efek karena < 1",
        ]}
        correct={1}
        explanation="Benar: β hidup di dunia log-odds. e^0,7 ≈ 2,01 adalah pengali odds (odds ratio). Efek ke probabilitas dalam poin persen tergantung level awal — tidak bisa dibaca langsung dari β."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Koefisien MLE 'meledak' (β = 18, SE = 4000). Diagnosis paling mungkin?"
        options={[
          "Multikolinearitas biasa",
          "Separasi sempurna — satu variabel memisahkan 0/1 dengan sempurna; cek leakage, lalu pakai penalized logistic",
          "Sampel terlalu besar",
          "Learning rate terlalu kecil",
        ]}
        correct={1}
        explanation="Benar: separasi sempurna membuat likelihood dimaksimalkan di β→∞. Ini sering gejala leakage (variabel yang 'bocor' dari masa depan). Jangan rayakan — investigasi dulu (A3.8)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Target = jumlah klaim per polis per tahun (0,1,2,...). Model GLM yang tepat?"
        options={[
          "OLS biasa",
          "Regresi logistik",
          "Regresi Poisson (link log) — target count non-negatif; jika variansi > mean pakai Negative Binomial",
          "Regresi Gamma",
        ]}
        correct={2}
        explanation="Benar: Poisson + link log adalah GLM untuk count — prediksi selalu non-negatif, koefisien = pengali. Gamma untuk target kontinu positif yang miring (severity), bukan count."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 'Data default hanya 3%, jadi regresi logistik tidak valid. Harus diseimbangkan dulu.' Tanggapan?"
        options={[
          "Setuju — logistik butuh 50:50",
          "Tidak setuju — logistik mengestimasi probabilitas dengan benar di base rate berapapun; yang rusak oleh imbalance adalah threshold 0,5 dan akurasi, bukan modelnya",
          "Setuju — tapi cukup undersample mayoritas",
          "Tidak setuju — pakai OLS saja",
        ]}
        correct={1}
        explanation="Benar: imbalance bukan pelanggaran asumsi logistik. Menyeimbangkan via sampling justru merusak kalibrasi probabilitas (base rate berubah). Atasi di level threshold/metrik (A3.5, A3.7), bukan dengan merusak data."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dalam GLM, apa peran 'link function'?"
        options={[
          "Menghubungkan dua variabel prediktor",
          "Penerjemah: memetakan rata-rata target (yang terbatas/miring) ke skala linear (−∞,∞) sehingga bisa dimodelkan sebagai β₀+β₁x",
          "Menghitung R²",
          "Memilih distribusi error",
        ]}
        correct={1}
        explanation="Benar: link function (logit, log, identitas) adalah jembatan antara dunia target yang terbatas (probabilitas, count, nilai positif) dan dunia linear tempat β hidup. Pilih link sesuai bentuk target."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Regresi logistik</strong> memodelkan log-odds secara linear; sigmoid menjepit output ke [0,1] — tidak pernah 140%.</li>
          <li><strong>Odds ratio</strong> <Tex math={String.raw`e^{\beta}`} /> = bahasa asli koefisien. Efek poin probabilitas tergantung level awal.</li>
          <li><strong>MLE</strong> memaksimalkan likelihood; tidak ada rumus tertutup — iteratif. Waspadai <strong>separasi sempurna</strong> (cek leakage!).</li>
          <li><strong>GLM</strong> = distribusi + link: biner → logit, count → Poisson/log, positif miring → Gamma/log, ordinal → ordered logit. OLS = GLM link identitas.</li>
          <li><strong>Jangan</strong> samakan &ldquo;kecilnya koefisien&rdquo; dengan &ldquo;kecilnya efek&rdquo; tanpa cek satuan; jangan seimbangkan data lalu klaim probabilitas valid.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a33-regularisasi" className="btn btn-secondary btn-sm">← A3.3</Link>
        <Link href="/learn/a35-metrik-klasifikasi" className="btn btn-primary btn-sm">Next: A3.5 →</Link>
      </div>
    </div>
  );
}

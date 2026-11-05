import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B7DistribusiKontinu1Page() {
  const chart1 = [{"x": [40.0, 40.5, 41.0, 41.5, 42.0, 42.5, 43.0, 43.5, 44.0, 44.5, 45.0, 45.5, 46.0, 46.5, 47.0, 47.5, 48.0, 48.5, 49.0, 49.5, 50.0, 50.5, 51.0, 51.5, 52.0, 52.5, 53.0, 53.5, 54.0, 54.5, 55.0, 55.5, 56.0, 56.5, 57.0, 57.5, 58.0, 58.5, 59.0, 59.5, 60.0, 60.5, 61.0, 61.5, 62.0, 62.5, 63.0, 63.5, 64.0, 64.5, 65.0, 65.5, 66.0, 66.5, 67.0, 67.5, 68.0, 68.5, 69.0, 69.5, 70.0, 70.5, 71.0, 71.5, 72.0, 72.5, 73.0, 73.5, 74.0, 74.5, 75.0, 75.5, 76.0, 76.5, 77.0, 77.5, 78.0, 78.5, 79.0, 79.5, 80.0, 80.5, 81.0, 81.5, 82.0, 82.5, 83.0, 83.5, 84.0, 84.5, 85.0, 85.5, 86.0, 86.5, 87.0, 87.5, 88.0, 88.5, 89.0, 89.5, 90.0, 90.5, 91.0, 91.5, 92.0, 92.5, 93.0, 93.5, 94.0, 94.5, 95.0, 95.5, 96.0, 96.5, 97.0, 97.5, 98.0, 98.5, 99.0, 99.5, 100.0], "y": [0.0004, 0.0005, 0.0006, 0.0007, 0.0008, 0.0009, 0.001, 0.0012, 0.0014, 0.0015, 0.0018, 0.002, 0.0022, 0.0025, 0.0028, 0.0032, 0.0035, 0.004, 0.0044, 0.0049, 0.0054, 0.006, 0.0066, 0.0072, 0.0079, 0.0086, 0.0094, 0.0102, 0.0111, 0.012, 0.013, 0.0139, 0.015, 0.016, 0.0171, 0.0183, 0.0194, 0.0206, 0.0218, 0.023, 0.0242, 0.0254, 0.0266, 0.0278, 0.029, 0.0301, 0.0312, 0.0323, 0.0333, 0.0343, 0.0352, 0.0361, 0.0368, 0.0375, 0.0381, 0.0387, 0.0391, 0.0394, 0.0397, 0.0398, 0.0399, 0.0398, 0.0397, 0.0394, 0.0391, 0.0387, 0.0381, 0.0375, 0.0368, 0.0361, 0.0352, 0.0343, 0.0333, 0.0323, 0.0312, 0.0301, 0.029, 0.0278, 0.0266, 0.0254, 0.0242, 0.023, 0.0218, 0.0206, 0.0194, 0.0183, 0.0171, 0.016, 0.015, 0.0139, 0.013, 0.012, 0.0111, 0.0102, 0.0094, 0.0086, 0.0079, 0.0072, 0.0066, 0.006, 0.0054, 0.0049, 0.0044, 0.004, 0.0035, 0.0032, 0.0028, 0.0025, 0.0022, 0.002, 0.0018, 0.0015, 0.0014, 0.0012, 0.001, 0.0009, 0.0008, 0.0007, 0.0006, 0.0005, 0.0004], "type": "scatter", "mode": "lines", "name": "Normal(70, 10²)", "line": {"color": "#2a7de1"}, "fill": "tozeroy"}, {"x": [85, 85], "y": [0, 0.04], "type": "scatter", "mode": "lines", "name": "x=85 (z=1,5)", "line": {"color": "#e8a838", "dash": "dash"}}];
  const chart2 = [{"x": [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0, 1.15, 1.3, 1.45, 1.6, 1.75, 1.9, 2.05, 2.2, 2.35, 2.5, 2.65, 2.8, 2.95, 3.1, 3.25, 3.4, 3.55, 3.7, 3.85, 4.0, 4.15, 4.3, 4.45, 4.6, 4.75, 4.9, 5.05, 5.2, 5.35, 5.5, 5.65, 5.8, 5.95, 6.1, 6.25, 6.4, 6.55, 6.7, 6.85, 7.0, 7.15, 7.3, 7.45, 7.6, 7.75, 7.9, 8.05, 8.2, 8.35, 8.5, 8.65, 8.8, 8.95], "y": [0.0, 0.0003, 0.0016, 0.0047, 0.0093, 0.0152, 0.0219, 0.029, 0.0363, 0.0433, 0.0501, 0.0563, 0.0621, 0.0673, 0.072, 0.0761, 0.0797, 0.0828, 0.0853, 0.0875, 0.0892, 0.0906, 0.0916, 0.0923, 0.0927, 0.0929, 0.0929, 0.0927, 0.0922, 0.0917, 0.091, 0.0901, 0.0892, 0.0882, 0.0871, 0.0859, 0.0847, 0.0834, 0.0821, 0.0808, 0.0794, 0.0781, 0.0767, 0.0753, 0.0739, 0.0725, 0.0711, 0.0697, 0.0683, 0.0669, 0.0656, 0.0642, 0.0629, 0.0616, 0.0603, 0.059, 0.0578, 0.0565, 0.0553, 0.0541], "type": "scatter", "mode": "lines", "name": "Lognormal(μ=2, σ=0,8)", "line": {"color": "#e8a838"}}];
  const lab1Code = String.raw`import random, statistics
random.seed(60)
mu, sigma, N = 70, 10, 200000
xs = [random.gauss(mu, sigma) for _ in range(N)]
print(f"mean={statistics.mean(xs):.2f}, SD={statistics.pstdev(xs):.2f}")
for k in [1, 2, 3]:
    p = sum(1 for x in xs if abs(x-mu) <= k*sigma) / N
    print(f"dalam ±{k} SD: {p:.2%}")
print("Teori: 68.27% / 95.45% / 99.73%")
print()
print("Coba: ganti jadi data seragam (random.uniform(40,100)).")
print("Apakah 68-95-99.7 masih berlaku? (Tidak! itu KHAS Normal)")`;
  const lab2Code = String.raw`import random, math, statistics
random.seed(61)
lam = 2  # per jam
N = 100000
# waktu antar kejadian ~ Eksponensial(lam): -ln(U)/lam
waits = [-math.log(random.random())/lam for _ in range(N)]
print(f"mean waktu tunggu = {statistics.mean(waits):.3f} jam (teori 1/λ = 0.5)")
print(f"P(tunggu > 1 jam) = {sum(1 for w in waits if w > 1)/N:.3f} (teori e^-2 = 0.135)")
print(f"P(tunggu > 2 jam) = {sum(1 for w in waits if w > 2)/N:.4f} (teori e^-4 = 0.0183)")
print("\nCoba: lam=0.5. Bagaimana mean waktu tunggu berubah?")
print("Coba: memoryless - P(tunggu>1.5 | tunggu>1) vs P(tunggu>0.5)")`;
  const quizData = [{"question": "Untuk X kontinu, P(X = 5,0) = 0 karena…", "options": ["5,0 mustahil terjadi", "Ada tak berhingga nilai di sekitarnya; peluang hanya bermakna untuk rentang (luas)", "pdf-nya nol", "Rumusnya salah"], "correct": 1, "explanation": "Benar: peluang kontinu = luas. Titik tak berluas → 0. Yang bermakna: P(4,9 < X < 5,1)."}, {"question": "Nilai ujian μ=70, σ=10. P(nilai > 85) ≈ …", "options": ["50%", "16%", "6,7%", "2,5%"], "correct": 2, "explanation": "Benar: z=1,5 → ekor kanan ≈ 6,7%. (z=1 → 16%, z=2 → 2,5% — hafalkan!)"}, {"question": "Harga saham sebaiknya dimodelkan Lognormal, bukan Normal, karena…", "options": ["Lognormal lebih mudah", "Harga positif & miring kanan; Normal mengizinkan negatif & simetris", "Regulator meminta", "Selalu sama saja"], "correct": 1, "explanation": "Benar: harga = hasil perkalian return → lognormal. Normal untuk harga = absurd (harga negatif)."}, {"question": "Jika kedatangan ~ Poisson(λ=2/jam), waktu antar kedatangan ~ …", "options": ["Poisson(2)", "Eksponensial(2), mean 0,5 jam", "Normal", "Binomial"], "correct": 1, "explanation": "Benar: pasangan Poisson–Eksponensial. &ldquo;Per jam&rdquo; ↔ &ldquo;antar kejadian&rdquo;."}, {"question": "Sifat memoryless Eksponensial artinya…", "options": ["Tidak punya varians", "P(X>s+t|X>s) = P(X>t) — menunggu lama tak mengubah sisa tunggu", "Selalu simetris", "Mean = 0"], "correct": 1, "explanation": "Benar: tanpa ingatan. Di dunia nyata jarang persis — ini model baseline."}, {"question": "Aturan 68–95–99,7 berlaku untuk…", "options": ["Semua distribusi", "Hanya (mendekati) Normal", "Semua yang simetris", "Data besar saja"], "correct": 1, "explanation": "Benar: khas Normal. Data uniform/exponensial punya aturan sendiri — jangan tempel sembarangan."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B7 (Part 1) — Probabilitas</span>
        <h1 className="display-title">Distribusi Kontinu (1):<br/>Normal, Lognormal &amp; Eksponensial</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Peluang Tepat Rp5.000.000&rdquo; = Nol?</a></li>
          <li><a href="#jembatan">Jembatan: Dari Batang ke Kurva (pdf &amp; cdf)</a></li>
          <li><a href="#normal">Normal — Ratu Distribusi</a></li>
          <li><a href="#lognormal">Lognormal — Ketika yang Normal adalah Log-nya</a></li>
          <li><a href="#eksponen">Eksponensial — Waktu Tunggu Kontinu</a></li>
          <li><a href="#lab1">🔬 Lab 1: Aturan 68-95-99,7 via Simulasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Poisson vs Eksponensial — Dua Sisi Koin</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Distribusi Kontinu Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: SLA Call Center</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>pdf vs pmf</strong>: mengapa P(X = tepat 5,0) = 0 untuk kontinu.</li><li>Menggunakan <strong>distribusi Normal</strong> + aturan 68-95-99,7 dan z-score.</li><li>Membedakan <strong>Normal vs Lognormal</strong> — kapan log yang normal.</li><li>Menerapkan <strong>Eksponensial</strong> untuk waktu tunggu kontinu + sifat memoryless.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Peluang Tepat Rp5.000.000&rdquo; = Nol?</h2>

      <div className="story"><p>Analis bertanya: <em>&ldquo;Berapa peluang saldo nasabah <strong>tepat</strong> Rp5.000.000,00?&rdquo;</em> Jawaban yang benar: <strong>nol</strong>. Bukan karena mustahil — melainkan karena saldo itu kontinu: ada tak berhingga nilai di sekitar 5 juta (5.000.000,01; 5.000.000,001; …), masing-masing berpeluang nol, tapi peluang <em>rentang</em> 4,9–5,1 juta bisa 10%.</p><p>Ini lompatan konseptual terbesar B-track: dari <strong>batang peluang</strong> (diskret) ke <strong>luas di bawah kurva</strong> (kontinu). Setelah paham ini, Normal, Lognormal, dan Eksponensial jadi mudah.</p><p><strong>Twist-nya:</strong> peluang saldo <em>tepat</em> Rp5.000.000 = 0 — tapi saldo Rp5.000.000 bisa terjadi! &ldquo;Peluang nol&rdquo; ≠ &ldquo;mustahil&rdquo;. Inilah paradoks yang mematahkan otak diskret: di dunia kontinu, kejadian yang nyata terjadi justru berpeluang nol satu per satu. Yang bermakna hanyalah peluang <em>rentang</em> — dan seluruh lesson ini adalah latihan berpikir dalam luas, bukan titik.</p></div>

      <h2 id="jembatan">Jembatan: Dari Batang ke Kurva (pdf &amp; cdf)</h2>

      <p><strong>pmf</strong> (diskret): <Tex math={String.raw`p(x) = P(X=x)`} /> — tinggi batang = peluang. <strong>pdf</strong> (kontinu): <Tex math={String.raw`f(x)`} /> — <em>tinggi kurva BUKAN peluang</em>; peluang = <strong>luas</strong> di bawah kurva:</p>

      <p><Tex math={String.raw`P(a \le X \le b) = \int_a^b f(x)\,dx, \qquad P(X = x_0) = 0`} block /></p>

      <p><strong>cdf</strong> (keduanya): <Tex math={String.raw`F(x) = P(X \le x)`} /> — &ldquo;peluang kumulatif sampai x&rdquo;. Untuk kontinu: <Tex math={String.raw`F'(x) = f(x)`} />.</p>

      <p><strong>Contoh.</strong> Waktu tunggu <Tex math={String.raw`X`} /> dengan <Tex math={String.raw`P(X \le 5 \text{ mnt}) = 0{,}6`} />: cdf di 5 = 0,6. Peluang 3–5 menit = F(5) − F(3) = luas di bawah pdf antara 3 dan 5.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Selalu tanya: &ldquo;yang ditanya <strong>titik</strong> atau <strong>rentang</strong>?&rdquo; Titik pada kontinu → 0 (tak bermakna). Rentang → luas/cdf. Jebakan klasik: &ldquo;peluang return tepat 0%&rdquo; = 0, tapi &ldquo;return antara −1% dan 1%&rdquo; bisa 30%.</p>
</div>

      <h2 id="normal">Normal — Ratu Distribusi</h2>

      <p><Tex math={String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}`} block /></p>

      <ul>
<li><Tex math={String.raw`\mu`} />: pusat (mean = median = modus — simetris!)</li>
<li><Tex math={String.raw`\sigma`} />: lebar (SD). Total luas = 1.</li>
</ul>

      <p><strong>Mengapa merajalela?</strong> (1) Banyak fenomena ≈ normal (tinggi, error pengukuran). (2) <strong>CLT</strong> (B11): rata-rata sampel → normal apapun distribusi aslinya. (3) Matematikanya enak.</p>

      <p><strong>Aturan 68–95–99,7:</strong> ±1σ → 68%, ±2σ → 95%, ±3σ → 99,7% data.</p>

      <p><strong>z-score</strong> — standarisasi ke Normal(0,1):</p>

      <p><Tex math={String.raw`Z = \frac{X - \mu}{\sigma}`} block /></p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Nilai ujian <Tex math={String.raw`\mu=70,\ \sigma=10`} />. Peluang nilai &gt; 85?</p><p><strong>Langkah 1</strong> — z = (85−70)/10 = <strong>1,5</strong>.</p><p><strong>Langkah 2</strong> — P(Z &gt; 1,5) = 1 − Φ(1,5) ≈ 1 − 0,9332 = <strong>6,7%</strong> (Φ = cdf Normal standar).</p><p>z-score mengubah <em>soal apapun</em> menjadi soal Normal(0,1) — satu tabel untuk semua!</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Data harus normal agar boleh pakai mean/SD.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak! Mean/SD terdefinisi untuk distribusi apapun. Yang butuh normalitas: <em>uji/interval tertentu</em> (dan itupun sering diselamatkan CLT untuk n besar). &ldquo;Data tidak normal → tidak boleh pakai mean&rdquo; adalah miskonsepsi mahal.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Hafalkan tiga angka: <strong>68–95–99,7</strong> dan z untuk 95% dua sisi (<strong>1,96</strong>) dan 95% satu sisi (<strong>1,645</strong>). Empat angka ini menyelesaikan separuh soal Normal tanpa kalkulator.</p>
</div>

      <h2 id="lognormal">Lognormal — Ketika yang Normal adalah Log-nya</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X`} /> lognormal jika <Tex math={String.raw`\ln X \sim \mathrm{Normal}(\mu, \sigma^2)`} />. Syarat: <Tex math={String.raw`X > 0`} />.</p>

      <p><Tex math={String.raw`E[X] = e^{\mu + \sigma^2/2}, \qquad \mathrm{Median}(X) = e^{\mu}`} block /></p>

      <p><strong>Kapan memakai:</strong> harga aset, pendapatan, klaim asuransi — <strong>positif &amp; miring kanan</strong>. Harga saham tidak bisa negatif dan bisa naik 10x — Normal (yang simetris &amp; bisa negatif) salah model; Lognormal benar.</p>

      <p><strong>Kepribadian:</strong> Lognormal adalah &ldquo;Normal yang dipaksa positif&rdquo; — hasil dari banyak <em>perkalian</em> acak kecil (return berlipat), sedangkan Normal adalah hasil banyak <em>penjumlahan</em> acak kecil (CLT!). Perkalian vs penjumlahan = Lognormal vs Normal.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Lognormal = Normal yang di-log-kan, jadi sama saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda fundamental: Normal simetris (mean=median), Lognormal miring kanan (mean &gt; median!). Untuk <Tex math={String.raw`\sigma=1`} />: mean = e^(μ+0,5), median = e^μ — mean 65% lebih besar dari median. Pakai Normal untuk harga → model mengizinkan harga negatif (absurd) dan meremehkan ekor kanan.</p>
</div>

      <h2 id="eksponen">Eksponensial — Waktu Tunggu Kontinu</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Eksponensial}(\lambda)`} />: waktu tunggu sampai kejadian berikutnya jika kejadian datang dengan laju <Tex math={String.raw`\lambda`} /> per satuan waktu (pasangan kontinu dari Poisson!).</p>

      <p><Tex math={String.raw`f(x) = \lambda e^{-\lambda x}, \quad x \ge 0, \qquad E[X] = \frac{1}{\lambda}`} block /></p>

      <p><strong>Hubungan Poisson–Eksponensial:</strong> jika jumlah kejadian per jam ~ Poisson(λ), maka <em>waktu antar kejadian</em> ~ Eksponensial(λ). Dua sisi koin yang sama!</p>

      <p><strong>Memoryless</strong> (versi kontinu dari Geometrik B6.2):</p>

      <p><Tex math={String.raw`P(X > s+t \mid X > s) = P(X > t)`} block /></p>

      <p>&ldquo;Sudah menunggu 10 menit tidak mengubah peluang menunggu 5 menit lagi.&rdquo; <strong>Catatan jujur:</strong> di dunia nyata waktu tunggu jarang benar-benar memoryless (mesin menua, nasabah lelah menunggu) — Eksponensial adalah model <em>baseline</em>, bukan kebenaran.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pasangan yang wajib dihafal: <strong>Poisson(λ) ↔ Eksponensial(λ)</strong>. &ldquo;Berapa kejadian per jam&rdquo; ↔ &ldquo;berapa lama antar kejadian&rdquo;. Soal yang satu bisa dijawab lewat yang lain.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Normal(70, 10²): Peluang = Luas di Bawah Kurva"
  layout={{"xaxis": {"title": "Nilai ujian"}, "yaxis": {"title": "pdf f(x)"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kurva biru = pdf; luas total di bawahnya = 1. Garis putus-putus di 85; luas kanan garis = P(X&gt;85).</p>
<p><strong>Interpretasi:</strong> Peluang adalah <strong>luas</strong>, bukan tinggi kurva. Luas kanan 85 ≈ 6,7% (z=1,5). Visual ini menjelaskan mengapa P(X=tepat 85) = 0: garis tunggal tidak punya luas!</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Lognormal: Miring Kanan, Selalu Positif"
  layout={{"xaxis": {"title": "x"}, "yaxis": {"title": "pdf"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kurva mulai dari 0 (tidak pernah negatif), puncak di kiri, ekor panjang ke kanan.</p>
<p><strong>Interpretasi:</strong> Bentuk khas data harga/pendapatan: banyak nilai kecil-menengah, sedikit sangat besar. <strong>Mean &gt; median</strong> di sini — memakai Normal (simetris) untuk data seperti ini meremehkan ekor kanan (= meremehkan risiko kerugian besar pada data loss!).</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Dunia kontinu = berpikir dalam <em>luas</em>, bukan titik.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Aturan 68-95-99,7 di gaji</summary>
              <p>Gaji berdistribusi Normal: mean Rp8 juta, SD Rp2 juta. Berapa peluang gaji di antara 6–10 juta? Di atas 12 juta?</p>
              <p><strong>Langkah 1</strong> — standarkan: 6 jt → z = −1; 10 jt → z = +1; 12 jt → z = +2.<br />
              <strong>Langkah 2</strong> — P(−1 &lt; Z &lt; 1) = <strong>68%</strong> (aturan empiris).<br />
              <strong>Langkah 3</strong> — P(Z &gt; 2) = (1 − 0,954)/2 ≈ <strong>2,3%</strong>.</p>
              <p>Pelajaran: z-score menerjemahkan &ldquo;rupiah&rdquo; menjadi &ldquo;berapa SD dari mean&rdquo; — bahasa universal semua Normal. Hafalkan: ±1 → 68%, ±2 → 95%, ±3 → 99,7%.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Lognormal — harga saham tidak bisa negatif</summary>
              <p>Harga saham hari ini Rp1.000. Log-return harian ~ Normal(mean 0,0005, SD 0,02). Berapa peluang harga &lt; Rp900 besok? Mengapa tidak pakai Normal langsung?</p>
              <p><strong>Langkah 1</strong> — jika pakai Normal(mean 1000, SD 20): P(harga &lt; 0) &gt; 0 — mustahil! Harga tidak bisa negatif.<br />
              <strong>Langkah 2</strong> — model benar: ln(S₁/S₀) ~ N(0,0005, 0,02²). P(S₁ &lt; 900) = P(ln(S₁/1000) &lt; ln(0,9) = −0,1054).<br />
              <strong>Langkah 3</strong> — z = (−0,1054 − 0,0005)/0,02 ≈ −5,29 → peluang ≈ <strong>0,000006%</strong> (praktis nol untuk 1 hari).</p>
              <p>Pelajaran: pilih distribusi yang <em>menghormati batas</em> datamu (harga ≥ 0 → lognormal). Distribusi yang salah = peluang untuk kejadian mustahil.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Eksponensial — waktu antar kedatangan</summary>
              <p>Nasabah datang rata-rata 12/jam (Poisson). Berapa peluang nasabah berikutnya datang dalam 5 menit? Berapa median waktu tunggu?</p>
              <p><strong>Langkah 1</strong> — λ = 12/jam = 0,2/menit. Waktu antar ~ Eksponensial(λ = 0,2).<br />
              <strong>Langkah 2</strong> — P(T ≤ 5) = 1 − e<sup>−0,2×5</sup> = 1 − e<sup>−1</sup> ≈ <strong>63,2%</strong>.<br />
              <strong>Langkah 3</strong> — median: 0,5 = e<sup>−0,2m</sup> → m = ln 2/0,2 ≈ <strong>3,47 menit</strong> &lt; mean 5 menit (miring kanan!).</p>
              <p>Pelajaran: Poisson (&ldquo;berapa per jam&rdquo;) dan Eksponensial (&ldquo;berapa lama sampai berikutnya&rdquo;) adalah dua sisi koin yang sama. Kuasai satu = kuasai keduanya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Aturan 68-95-99,7 via Simulasi</h2>

      <p>Simulasi 200.000 sampel Normal(70, 10²). Hitung proporsi dalam ±1/2/3 SD — cocokkan dengan 68/95/99,7%.</p>

      <PyodideLab
  title="Lab 1 — Buktikan Aturan Empiris"
  hint="Aturan ini KHAS Normal — jangan tempel ke distribusi lain. Cek dengan uniform untuk buktinya."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Poisson vs Eksponensial — Dua Sisi Koin</h2>

      <p>Nasabah datang λ=2/jam (Poisson). Simulasikan waktu antar kedatangan — harusnya Eksponensial dengan mean 0,5 jam.</p>

      <PyodideLab
  title="Lab 2 — Waktu Antar Kedatangan"
  hint="Hubungan Poisson↔Eksponensial adalah salah satu yang paling sering keluar di interview quant."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Distribusi Kontinu Mana?</h2>

      <div className="decision-card">
<h3>1. Data simetris, bisa negatif, banyak penjumlahan → <strong>Normal</strong></h3>
<p><strong>Kondisi data:</strong> Error pengukuran, tinggi badan, rata-rata sampel (CLT).</p>
<p><strong>Kenapa:</strong> Stabil di bawah penjumlahan; 68-95-99,7; z-score universal.</p>
<p><strong>Contoh nyata:</strong> Interval kepercayaan mean (A2.3).</p>
</div>

      <div className="decision-card">
<h3>2. Data positif &amp; miring kanan (hasil perkalian) → <strong>Lognormal</strong></h3>
<p><strong>Kondisi data:</strong> Harga aset, pendapatan, klaim.</p>
<p><strong>Kenapa:</strong> ln(X) normal; mean &gt; median; tidak pernah negatif.</p>
<p><strong>Contoh nyata:</strong> Model harga saham (fondasi GBM, B15).</p>
</div>

      <div className="decision-card">
<h3>3. &ldquo;Berapa lama sampai kejadian berikutnya&rdquo; → <strong>Eksponensial</strong></h3>
<p><strong>Kondisi data:</strong> Waktu antar kedatangan dengan laju konstan λ.</p>
<p><strong>Kenapa:</strong> Pasangan Poisson; memoryless; E=1/λ.</p>
<p><strong>Contoh nyata:</strong> Waktu antar nasabah datang; lifetime komponen (baseline).</p>
</div>

      <div className="decision-card">
<h3>4. Butuh ekor tebal / data proporsi / lainnya → <strong>tunggu B7.2</strong></h3>
<p><strong>Kondisi data:</strong> Return saham berekor tebal, data proporsi 0–1, rasio varians.</p>
<p><strong>Kenapa:</strong> Normal meremehkan ekstrem — butuh t, Pareto, Beta, Gamma, χ².</p>
<p><strong>Contoh nyata:</strong> Return harian saham (t), pangsa pasar (Beta).</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Kontinu: peluang = <strong>luas</strong>, bukan tinggi. Titik → 0.</li><li>Hafal <strong>68–95–99,7</strong> + z=1,96 / 1,645.</li><li>Bisa negatif &amp; simetris → Normal; positif &amp; miring kanan → Lognormal.</li><li>&ldquo;Per jam&rdquo; ↔ &ldquo;antar kejadian&rdquo; = Poisson ↔ Eksponensial.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: SLA Call Center</h2>

      <div className="callout">
<p>Call center: waktu antar telepon ~ Eksponensial(λ=12/jam). SLA: 90% penelepon menunggu &lt; 5 menit untuk diangkat. Kapasitas saat ini: 1 agen menangani 1 telepon per 4 menit rata-rata.</p><p><strong>Pertanyaan:</strong> (a) Berapa peluang jeda antar telepon &gt; 10 menit? (b) Jika 1 agen, berapa % penelepon menunggu &gt; 5 menit (asumsikan waktu layanan juga Eksponensial)? Apakah SLA terpenuhi?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) P(T &gt; 10 mnt) = e^(−λt) = e^(−12×10/60) = e^(−2) ≈ <strong>13,5%</strong>.</p><p>(b) Ini antrean M/M/1: laju datang λ=12/jam, laju layanan μ=15/jam (1 per 4 mnt). Utilisasi ρ=0,8. P(menunggu &gt; 5 mnt) = ρ×e^(−(μ−λ)t) = 0,8×e^(−3×5/60) = 0,8×e^(−0,25) ≈ <strong>62%</strong> — jauh di atas 10%! <strong>SLA jebol.</strong> Butuh ~3 agen. <strong>Pelajaran:</strong> &ldquo;rata-rata cukup&rdquo; (12 vs 15/jam) menipu — variabilitas Eksponensial membuat antrean menumpuk. Lagi-lagi: distribusi, bukan mean.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Tinggi ~ Normal(170, 10) cm. Berapa peluang seseorang &gt; 190 cm? Berapa persentil ke-95 tinggi?</li>
              <li>Return lognormal: median harga besok Rp1.000, P(harga &gt; Rp1.100) = 16%. Jelaskan mengapa mean &gt; median di sini.</li>
              <li>Waktu antar email ~ Eksponensial(mean 10 menit). Berapa peluang email berikutnya datang dalam 2 menit? Setelah 15 menit tanpa email, berapa peluang 2 menit berikutnya ada email? (Ingat sifatnya!)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> z = 2 → P ≈ <strong>2,3%</strong>. Persentil-95: z = 1,645 → 170 + 1,645×10 = <strong>186,45 cm</strong>.</p>
              <p><strong>2.</strong> Lognormal miring kanan: ekor kanan menarik mean ke atas median. P(harga &gt; 1100) = 16% ≈ P(Z &gt; 1) — konsisten dengan log-return Normal.</p>
              <p><strong>3.</strong> P(T ≤ 2) = 1 − e<sup>−0,2</sup> ≈ <strong>18,1%</strong>. Setelah 15 menit: <em>tetap</em> <strong>18,1%</strong> — memoryless! Waktu yang sudah berlalu tidak mengubah peluang sisa.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Kontinu:</strong> peluang = luas di bawah pdf; P(titik) = 0; cdf = P(X ≤ x).</li><li><strong>Normal(μ,σ²):</strong> simetris; 68–95–99,7; z = (X−μ)/σ; raja karena CLT.</li><li><strong>Lognormal:</strong> ln(X) normal; positif &amp; miring kanan; untuk harga/pendapatan.</li><li><strong>Eksponensial(λ):</strong> waktu antar kejadian; E=1/λ; memoryless; pasangan Poisson.</li><li><strong>Jangan</strong> pakai Normal untuk data positif miring kanan — dan <strong>jangan</strong> tanya peluang &ldquo;tepat&rdquo; pada kontinu.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b6-distribusi-diskret-2" className="btn btn-secondary btn-sm">← ← B6.2</Link>
        <Link href="/learn/b7-distribusi-kontinu-2" className="btn btn-primary btn-sm">Next: B7.2 →</Link>
      </div>
    </div>
  );
}

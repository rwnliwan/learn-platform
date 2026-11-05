import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B11LlnCltPage() {
  const chart1 = [{"x": [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25, 8.5, 8.75, 9.0, 9.25, 9.5, 9.75], "y": [0.181, 0.172, 0.164, 0.156, 0.148, 0.141, 0.134, 0.128, 0.121, 0.115, 0.11, 0.104, 0.099, 0.094, 0.09, 0.085, 0.081, 0.077, 0.074, 0.07, 0.067, 0.063, 0.06, 0.057, 0.055, 0.052, 0.049, 0.047, 0.045, 0.042, 0.04, 0.038, 0.037, 0.035, 0.033, 0.031, 0.03, 0.028], "type": "scatter", "mode": "lines", "name": "Data asal: Eksponensial", "line": {"color": "#e8a838"}}, {"x": ["n=1", "n=5", "n=30", "n=100"], "y": [1, 1, 1, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "showlegend": false, "visible": false}];
  const chart2 = [{"x": [100, 400, 1000, 4000, 10000], "y": [5.0, 2.5, 1.58, 0.79, 0.5], "type": "scatter", "mode": "lines+markers", "name": "SE = 50%/√n (p=0,5)", "line": {"color": "#2a7de1"}}];
  const lab1Code = String.raw`import random, statistics
random.seed(111)

def rata2_sampel(n, trials, gen):
    return [statistics.mean([gen() for _ in range(n)]) for _ in range(trials)]

# data asal: Eksponensial(1) — sangat miring, mean=1
means1 = rata2_sampel(1, 20000, lambda: random.expovariate(1))
means30 = rata2_sampel(30, 20000, lambda: random.expovariate(1))
print(f"n=1 : mean={statistics.mean(means1):.2f}, bentuk: miring (itu datanya sendiri)")
print(f"n=30: mean={statistics.mean(means30):.3f}, SD={statistics.pstdev(means30):.3f}")
print(f"      teori: mean=1.000, SE=1/√30={1/30**0.5:.3f}  <- COCOK!")
# cek normalitas kasar: proporsi dalam ±2 SE
p = sum(1 for m in means30 if abs(m-1) <= 2/30**0.5)/len(means30)
print(f"      proporsi dalam ±2SE: {p:.1%} (teori Normal: 95.4%)")
print("\nCoba: ganti gen jadi dadu: lambda: random.randint(1,6). n=30 cukup?")`;
  const lab2Code = String.raw`import random, statistics
random.seed(112)

def pareto(a):
    return 1.0 / (random.random() ** (1/a))

print("Eksponensial(1) — LLN bekerja:")
xs = [random.expovariate(1) for _ in range(50000)]
for n in [100, 1000, 10000, 50000]:
    print(f"  n={n:>6}: mean={statistics.mean(xs[:n]):.3f}")
print("\nPareto(α=1.1) — LLN GAGAL (mean tak hingga):")
ys = [pareto(1.1) for _ in range(50000)]
for n in [100, 1000, 10000, 50000]:
    print(f"  n={n:>6}: mean={statistics.mean(ys[:n]):8.1f}  <- meloncat terus!")
print("\nKesimpulan: teorema punya SYARAT. Cek E|X|<∞ sebelum percaya rata-rata.")`;
  const quizData = [{"question": "LLN mengatakan…", "options": ["Data menjadi normal", "Rata-rata sampel → ekspektasi saat n→∞", "n=30 selalu cukup", "Populasi harus kecil"], "correct": 1, "explanation": "Benar: konvergensi rata-rata ke ekspektasi. &ldquo;Menjadi normal&rdquo; adalah CLT."}, {"question": "CLT: yang menjadi (mendekati) normal adalah…", "options": ["Data aslinya", "Distribusi rata-rata sampel", "Seluruh populasi", "Variansnya"], "correct": 1, "explanation": "Benar: rata-ratanya! Data gaji tetap miring; rata-rata 100 gaji yang normal."}, {"question": "SE = σ/√n. Untuk memangkas SE setengahnya, n harus…", "options": ["2x", "4x", "10x", "Tetap"], "correct": 1, "explanation": "Benar: pajak akar kuadrat. 4x sampel = 2x presisi."}, {"question": "Survei 1.000 orang untuk 200 juta pemilih valid karena…", "options": ["1.000 cukup besar absolut", "SE hanya bergantung pada n, bukan besar populasi", "Pemilih homogen", "Kebetulan"], "correct": 1, "explanation": "Benar: SE = σ/√n — populasi tidak masuk rumus (kecuali populasi kecil → koreksi populasi hingga)."}, {"question": "LLN bisa gagal jika…", "options": ["n terlalu besar", "Mean tak hingga (Pareto α≤1) atau tidak independen", "Data normal", "Sampel acak"], "correct": 1, "explanation": "Benar: syarat E|X|<∞ dan i.i.d. Data finansial berekor tebal = waspada."}, {"question": "Data Eksponensial (miring), n=100. P(rata-rata > μ+2SE) ≈ …", "options": ["50%", "2,3%", "16%", "Tidak bisa dihitung"], "correct": 1, "explanation": "Benar: CLT — rata-rata ≈ Normal meski data asal miring. z=2 → ekor 2,3%."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B11 — Probabilitas</span>
        <h1 className="display-title">LLN &amp; CLT: Mengapa Rata-rata<br/>Sampel Bisa Dipercaya</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Jajak Pendapat 1.000 Orang Mewakili 200 Juta?</a></li>
          <li><a href="#lln">Hukum Bilangan Besar (LLN) — Rata-rata Menuju Ekspektasi</a></li>
          <li><a href="#clt">Teorema Limit Pusat (CLT) — Keajaiban Bentuk Lonceng</a></li>
          <li><a href="#se">Standard Error — Penggaris Kepercayaan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Saksikan CLT Lahir dari Data Miring</a></li>
          <li><a href="#lab2">🔬 Lab 2: LLN Gagal di Pareto — Batas Teorema</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: LLN/CLT dalam Praktik</a></li>
          <li><a href="#case">📋 Mini-Case: Survei Kepuasan 400 Responden</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>LLN</strong>: rata-rata sampel → ekspektasi, dan kapan ia gagal (Pareto!).</li><li>Menjelaskan <strong>CLT</strong>: distribusi rata-rata sampel → Normal, seberapa cepat, dan syaratnya.</li><li>Menghitung <strong>standard error</strong> <Tex math={String.raw`\sigma/\sqrt{n}`} /> dan menafsirkan &ldquo;√n&rdquo;.</li><li>Menjelaskan mengapa seluruh inferensi klasik (interval, uji) berdiri di atas dua teorema ini.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Jajak Pendapat 1.000 Orang Mewakili 200 Juta?</h2>

      <div className="story"><p>Survei elektabilitas: <strong>1.000 responden</strong> diklaim mewakili 200 juta pemilih, dengan &ldquo;margin of error ±3%&rdquo;. Kok bisa? 1.000 dari 200 juta itu 0,0005%!</p><p>Jawabannya dua teorema paling penting di statistika. <strong>LLN</strong> bilang: rata-rata 1.000 orang mendekati rata-rata populasi. <strong>CLT</strong> bilang: <em>seberapa dekatnya</em> bisa dihitung — dan hanya bergantung pada n (1.000), <strong>bukan</strong> pada besar populasi (200 juta)! Inilah mengapa survei nasional tidak butuh jutaan responden.</p><p>Dua teorema ini juga fondasi A/B testing, interval kepercayaan, dan Monte Carlo (B12).</p><p><strong>Twist-nya:</strong> 1.000 mewakili 200 juta — tapi 1.000 <em>tidak</em> mewakili 200 juta jika seribunya bukan acak (survei Twitter, misalnya!). LLN dan CLT menjamin &ldquo;n besar → akurat&rdquo; <em>hanya</em> jika sampel acak. Keajaibannya bukan pada angka 1.000 — melainkan pada kata &ldquo;acak&rdquo;. Tanpa keacakan, n sebesar apapun hanya memperbesar bias dengan presisi.</p></div>

      <h2 id="lln">Hukum Bilangan Besar (LLN) — Rata-rata Menuju Ekspektasi</h2>

      <p><Tex math={String.raw`\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i \;\xrightarrow[n\to\infty]{}\; E[X]`} block /></p>

      <ul>
<li><Tex math={String.raw`X_i`} />: sampel acak independen dari distribusi yang sama (i.i.d.),</li>
<li>Panah: konvergensi dalam peluang — makin besar n, <Tex math={String.raw`\bar{X}_n`} /> makin &ldquo;nempel&rdquo; ke <Tex math={String.raw`E[X]`} />.</li>
</ul>

      <p><strong>Intuisi:</strong> tiap sampel baru &ldquo;mengencerkan&rdquo; pengaruh sampel lama. Setelah 10.000 lemparan, 10 lemparan awal yang sial tidak lagi berarti.</p>

      <p><strong>Kapan GAGAL?</strong> Syarat: <Tex math={String.raw`E|X| < \infty`} /> (mean hingga!). Pareto α≤1 (B7.2): mean tak hingga → LLN gagal → rata-rata sampel meloncat selamanya (ingat Lab B7.2!). Juga gagal jika tidak independen (data berkorelasi kuat) atau tidak identik.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;LLN berarti 1.000 sampel selalu dekat dengan populasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> LLN adalah pernyataan <em>asimtotik</em> (n → ∞) — tidak menjanjikan seberapa dekat di n=1.000. &ldquo;Seberapa dekat&rdquo; diatur CLT + standard error. Dan LLN butuh mean hingga: untuk data Pareto (α≤1), n=1 juta pun rata-rata tetap liar.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> LLN adalah <em>alasan</em> kita percaya rata-rata sampel; CLT adalah <em>penggaris</em> yang mengukur kepercayaannya. Dua-duanya dibutuhkan — LLN tanpa CLT = &ldquo;percaya saja&rdquo; tanpa ukuran.</p>
</div>

      <h2 id="clt">Teorema Limit Pusat (CLT) — Keajaiban Bentuk Lonceng</h2>

      <p><Tex math={String.raw`\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \;\xrightarrow[n\to\infty]{}\; N(0,1)`} block /></p>

      <ul>
<li>Apapun bentuk distribusi asal (miring! bimodal! diskret!) — distribusi <strong>rata-rata sampel</strong> mendekati Normal.</li>
<li><Tex math={String.raw`\mu, \sigma`} />: mean &amp; SD distribusi asal (harus hingga!).</li>
<li><Tex math={String.raw`\sigma/\sqrt{n}`} />: <strong>standard error</strong> — SD dari rata-rata sampel.</li>
</ul>

      <p><strong>Mengapa ajaib?</strong> Data gaji (miring kanan parah) → rata-rata dari 100 gaji → (hampir) Normal! Inilah mengapa uji-z/interval kepercayaan bekerja untuk data tidak normal — asal n cukup.</p>

      <p><strong>Seberapa cepat?</strong> Aturan praktis n ≥ 30 untuk data &ldquo;wajar&rdquo;. Tapi: makin miring/ekor tebal data asal → makin besar n yang dibutuhkan. Data Pareto butuh n raksasa; data simetris butuh n kecil.</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Waktu tunggu nasabah ~ Eksponensial(λ=0,2/mnt): μ=5 mnt, σ=5 mnt (sangat miring!). Sampel n=100. Berapa P(rata-rata &gt; 6 mnt)?</p><p><strong>Langkah 1</strong> — SE = σ/√n = 5/10 = <strong>0,5</strong>.</p><p><strong>Langkah 2</strong> — z = (6−5)/0,5 = <strong>2,0</strong>.</p><p><strong>Langkah 3</strong> — P(Z &gt; 2) ≈ <strong>2,3%</strong>.</p><p>Padahal data aslinya Eksponensial (jauh dari Normal)! CLT yang memungkinkan hitungan ini — inilah &ldquo;keajaiban&rdquo;-nya.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CLT berarti data menjadi normal jika n besar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> SALAH total — yang menjadi normal adalah <strong>distribusi rata-rata sampel</strong>, bukan datanya! Data gaji 1 juta orang tetap miring kanan; yang normal adalah distribusi &ldquo;rata-rata dari 100 gaji&rdquo; yang diulang berkali-kali. Mencampuradukkan keduanya = kesalahan paling umum tentang CLT.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Hafalkan: <strong>SE = σ/√n</strong>. Untuk presisi 2x lipat → butuh <strong>4x sampel</strong> (√n!). Inilah ekonomi survei: 1.000 → 4.000 responden hanya memangkas error dari 3% ke 1,5%. Akar kuadrat adalah &ldquo;pajak&rdquo; presisi.</p>
</div>

      <h2 id="se">Standard Error — Penggaris Kepercayaan</h2>

      <p><Tex math={String.raw`SE(\bar{X}) = \frac{\sigma}{\sqrt{n}}`} block /></p>

      <p><strong>Contoh survei:</strong> proporsi p=0,5 (kasus terburuk), n=1.000 → SE = √(0,25/1000) ≈ 1,58%. Margin of error 95% = 1,96×SE ≈ <strong>±3,1%</strong> — inilah &ldquo;±3%&rdquo; di cerita pembuka! Dan populasi 200 juta tidak masuk rumus — hanya n.</p>

      <p><strong>Implikasi A/B testing:</strong> beda konversi 0,5% butuh n besar agar SE lebih kecil dari efeknya. Inilah kalkulasi ukuran sampel (A2.10).</p>

      <PlotlyChart
  data={chart1}
  title="CLT: Rata-rata Sampel dari Data Eksponensial"
  layout={{"xaxis": {"title": "x"}, "yaxis": {"title": "densitas"}, "showlegend": true, "annotations": [{"x": 7, "y": 0.16, "text": "n=1: miring (Eksponensial)", "showarrow": false}, {"x": 5, "y": 0.05, "text": "n=100: hampir Normal di sekitar μ=5", "showarrow": false}]}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kurva kuning = distribusi data asal (Eksponensial, sangat miring). Anotasi menjelaskan bentuk distribusi rata-rata sampel untuk n=1 vs n=100 (lihat Lab 1 untuk visual pastinya).</p>
<p><strong>Interpretasi:</strong> Data asal tidak berubah (tetap miring!) — yang berubah adalah <strong>distribusi rata-ratanya</strong>: dari miring (n=1) menjadi lonceng simetris di sekitar μ (n=100). Inilah CLT: keajaiban terjadi pada rata-rata, bukan pada data.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Pajak √n: Presisi 2x Butuh Sampel 4x"
  layout={{"xaxis": {"title": "n (sampel)", "type": "log"}, "yaxis": {"title": "Standard error (%)"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X log: n dari 100 ke 10.000. Sumbu Y = standard error proporsi (p=0,5).</p>
<p><strong>Interpretasi:</strong> Kurva melandai: 100→400 memangkas SE 5%→2,5%, tapi 1.000→4.000 hanya 1,58%→0,79%. <strong>Presisi punya diminishing return akar kuadrat.</strong> Keputusan bisnis: kapan berhenti menambah sampel? Saat biaya sampel &gt; nilai presisi tambahan.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. LLN = &ldquo;rata-rata mendekati&rdquo;; CLT = &ldquo;seberapa dekatnya bisa dihitung&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Margin of error survei — dihitung</summary>
              <p>Survei 1.000 responden, 520 mendukung (52%). Berapa margin of error 95%? Mengapa populasi 200 juta tidak masuk hitungan?</p>
              <p><strong>Langkah 1</strong> — p̂ = 0,52. SE = √(p̂(1−p̂)/n) = √(0,52×0,48/1000) ≈ <strong>0,0158</strong>.<br />
              <strong>Langkah 2</strong> — MoE 95% = 1,96 × 0,0158 ≈ <strong>±3,1%</strong>. Interval: (48,9%; 55,1%).<br />
              <strong>Langkah 3</strong> — populasi tidak muncul karena SE hanya bergantung pada <em>n</em> (CLT!) — selama n ≪ populasi, koreksi populasi terabaikan.</p>
              <p>Pelajaran: &ldquo;±3%&rdquo; bukan sulap — ia 1,96 × SE. Dan ia hanya valid jika sampel <em>acak</em> (twist cerita pembuka!).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: LLN — koin 100 vs 10.000 lemparan</summary>
              <p>Berapa peluang rata-rata koin menyimpang &gt; 5% dari 0,5 — untuk n = 100 vs n = 10.000?</p>
              <p><strong>Langkah 1</strong> — SD rata-rata = 0,5/√n (koin: σ = 0,5). n=100: SE = 0,05. n=10.000: SE = 0,005.<br />
              <strong>Langkah 2</strong> — n=100: P(|p̂−0,5| &gt; 0,05) ≈ P(|Z| &gt; 1) ≈ <strong>31,7%</strong>.<br />
              <strong>Langkah 3</strong> — n=10.000: P(|p̂−0,5| &gt; 0,05) ≈ P(|Z| &gt; 10) ≈ <strong>0%</strong> (praktis mustahil).</p>
              <p>Pelajaran: SE menyusut ∝ 1/√n — untuk memangkas error 10×, butuh 100× data. Inilah &ldquo;hukum akar kuadrat&rdquo; yang mengatur semua survei, A/B test, dan Monte Carlo.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: CLT pada distribusi miring — tetap Normal!</summary>
              <p>Waktu tunggu ~ Eksponensial(mean 10 mnt, sangat miring). Rata-rata 100 observasi: distribusinya?</p>
              <p><strong>Langkah 1</strong> — CLT: x̄ ≈ Normal(mean 10, SE = 10/√100 = <strong>1</strong>) — <em>meski</em> datanya eksponensial!<br />
              <strong>Langkah 2</strong> — P(x̄ &gt; 12) ≈ P(Z &gt; 2) ≈ <strong>2,3%</strong>.<br />
              <strong>Langkah 3</strong> — cek syarat: n = 100 cukup besar; observasi independen. (Untuk n = 5, aproksimasi buruk — CLT butuh n!)</p>
              <p>Pelajaran: keajaiban CLT = bentuk distribusi asal <em>tidak penting</em> (asal varians berhingga — Pareto bisa menggagalkannya, B7.2!). Yang penting: n besar &amp; independen.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Saksikan CLT Lahir dari Data Miring</h2>

      <p>Data asal: dadu (diskret!) atau Eksponensial (miring!). Lihat distribusi rata-rata sampel menjadi lonceng saat n naik.</p>

      <PyodideLab
  title="Lab 1 — Distribusi Rata-rata Sampel"
  hint="Ulangi dengan n=5: belum normal sempurna. Itulah &amp;ldquo;kecepatan konvergensi&amp;rdquo; — tergantung kemiringan data asal."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: LLN Gagal di Pareto — Batas Teorema</h2>

      <p>Bandingkan LLN untuk data &ldquo;baik&rdquo; (Eksponensial) vs &ldquo;liar&rdquo; (Pareto α=1,1).</p>

      <PyodideLab
  title="Lab 2 — Kapan LLN Berkhianat"
  hint="Inilah mengapa B7.2/B16 ada: sebagian data finansial hidup di wilayah LLN-gagal."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: LLN/CLT dalam Praktik</h2>

      <div className="decision-card">
<h3>1. Mau percaya rata-rata sampel → <strong>cek syarat LLN</strong></h3>
<p><strong>Kondisi data:</strong> Data i.i.d. dan mean hingga.</p>
<p><strong>Kenapa:</strong> Tanpa mean hingga (Pareto α≤1) atau independensi, rata-rata menipu.</p>
<p><strong>Contoh nyata:</strong> Rata-rata klaim: cek ekor dulu (B7.2) sebelum percaya mean.</p>
</div>

      <div className="decision-card">
<h3>2. Mau interval/uji untuk mean → <strong>CLT + SE</strong></h3>
<p><strong>Kondisi data:</strong> n cukup besar relatif terhadap kemiringan data.</p>
<p><strong>Kenapa:</strong> SE = σ/√n mengukur presisi; 1,96×SE = margin 95%.</p>
<p><strong>Contoh nyata:</strong> Survei ±3%: 1,96×√(0,25/1000).</p>
</div>

      <div className="decision-card">
<h3>3. n kecil + data miring → <strong>jangan paksa CLT</strong></h3>
<p><strong>Kondisi data:</strong> n &lt; 30 dengan data sangat miring/ekor tebal.</p>
<p><strong>Kenapa:</strong> Konvergensi belum terjadi — interval Normal terlalu sempit.</p>
<p><strong>Contoh nyata:</strong> Pakai t (lebih lebar), bootstrap (A2.9), atau tambah sampel.</p>
</div>

      <div className="decision-card">
<h3>4. Butuh presisi 2x → <strong>siapkan 4x sampel</strong></h3>
<p><strong>Kondisi data:</strong> Perencanaan survei/eksperimen.</p>
<p><strong>Kenapa:</strong> Pajak √n — diminishing return.</p>
<p><strong>Contoh nyata:</strong> A/B testing: hitung n dari efek minimum yang mau dideteksi (A2.10).</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>LLN: rata-rata → ekspektasi (butuh mean hingga + i.i.d.).</li><li>CLT: <strong>rata-rata</strong> → Normal (bukan datanya!). SE = σ/√n.</li><li>Presisi 2x = sampel 4x. Populasi tidak masuk rumus SE.</li><li>Data liar (Pareto) → kedua teorema goyah — pakai B16.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Survei Kepuasan 400 Responden</h2>

      <div className="callout">
<p>Bank survei 400 nasabah: 320 puas (80%). Direksi: <em>&ldquo;Berapa rentang kepuasan sebenarnya? Dan kalau mau ±2%, berapa responden?&rdquo;</em></p><p><strong>Pertanyaan:</strong> (a) Interval 95% untuk proporsi puas. (b) n agar margin ±2%.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) SE = √(0,8×0,2/400) = 0,02. Interval 95% = 0,80 ± 1,96×0,02 = <strong>76%–84%</strong>. (CLT untuk proporsi: Binomial → Normal.)</p><p>(b) 1,96×√(0,25/n) ≤ 0,02 (pakai p=0,5, kasus terburuk) → √n ≥ 49 → <strong>n ≥ 2.401</strong>. Dari 400 ke 2.401 — pajak √n beraksi! <strong>Pelajaran bisnis:</strong> presisi itu mahal; tentukan dulu <em>berapa presisi yang benar-benar dibutuhkan untuk keputusan</em> sebelum bayar survei.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Survei 400 orang, 220 puas (55%). Hitung SE dan interval kepercayaan 95% untuk proporsi populasi.</li>
              <li>Berapa n agar MoE 95% ≤ 1% untuk proporsi? (Pakai p = 0,5, kasus terburuk.)</li>
              <li>Rata-rata 64 transaksi: mean Rp150 ribu, SD Rp80 ribu. Berapa peluang rata-ratanya &gt; Rp165 ribu? (Pakai CLT.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> SE = √(0,55×0,45/400) = 0,0249. IK95%: 0,55 ± 1,96×0,0249 = <strong>(50,1%; 59,9%)</strong>.</p>
              <p><strong>2.</strong> 1,96×√(0,25/n) ≤ 0,01 → √(0,25/n) ≤ 0,0051 → n ≥ 0,25/0,0051² ≈ <strong>9.604</strong>. (Aturan cepat: n ≈ 10.000 untuk MoE 1%.)</p>
              <p><strong>3.</strong> SE = 80/8 = 10. z = (165−150)/10 = 1,5 → P ≈ <strong>6,7%</strong>.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>LLN:</strong> <Tex math={String.raw`\bar{X}_n \to E[X]`} /> — alasan percaya rata-rata (butuh mean hingga, i.i.d.).</li><li><strong>CLT:</strong> distribusi <Tex math={String.raw`\bar{X}_n`} /> → Normal — <strong>bukan datanya</strong>, tapi rata-ratanya.</li><li><strong>SE = σ/√n:</strong> penggaris presisi; presisi 2x = 4x sampel; populasi tak masuk rumus.</li><li><strong>Fondasi:</strong> survei ±3%, interval kepercayaan, uji hipotesis, A/B testing, Monte Carlo.</li><li><strong>Jangan</strong> paksa CLT untuk n kecil + data liar — dan <strong>jangan</strong> samakan &ldquo;data normal&rdquo; dengan &ldquo;rata-rata normal&rdquo;.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b10-copula" className="btn btn-secondary btn-sm">← ← B10</Link>
        <Link href="/learn/b12-monte-carlo" className="btn btn-primary btn-sm">Next: B12 →</Link>
      </div>
    </div>
  );
}

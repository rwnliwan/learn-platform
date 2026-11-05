import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B12MonteCarloPage() {
  const chart1 = [{"x": [100, 1000, 10000, 100000], "y": [0.041, 0.013, 0.0041, 0.0013], "type": "scatter", "mode": "lines+markers", "name": "SE Monte Carlo untuk π", "line": {"color": "#2a7de1"}}];
  const chart2 = [{"x": ["Tanpa VR", "Antithetic", "Control variate"], "y": [1.0, 0.35, 0.12], "type": "bar", "marker": {"color": ["#94a3b8", "#2a7de1", "#34a853"]}, "text": ["1,0x", "0,35x", "0,12x"], "textposition": "outside"}];
  const lab1Code = String.raw`import random, math
random.seed(123)

def mc_pi(N):
    dalam = sum(1 for _ in range(N)
                if (lambda x, y: x*x + y*y <= 1)(random.uniform(-1,1), random.uniform(-1,1)))
    p = dalam / N
    se = 4 * math.sqrt(p*(1-p)/N)  # SE untuk 4*p
    return 4*p, se

for N in [100, 1_000, 10_000, 100_000]:
    est, se = mc_pi(N)
    print(f"N={N:>7}: π ≈ {est:.4f} ± {1.96*se:.4f}  (error {(est-math.pi):+.4f})")
print(f"\nπ asli = {math.pi:.4f}")
print("\nCoba: N=1_000_000 (lambat?). Bandingkan waktu vs presisi.")`;
  const lab2Code = String.raw`import random, math, statistics
random.seed(124)
S0, mu, sigma, N = 10_000, 0.0005, 0.02, 50_000
# S1 = S0 * exp(return); return ~ Normal(mu, sigma)
pl = [S0*math.exp(random.gauss(mu, sigma)) - S0 for _ in range(N)]
pl_sorted = sorted(pl)
var95 = -pl_sorted[int(0.05*N)]  # kerugian pada kuantil 5%
es = -statistics.mean(pl_sorted[:int(0.05*N)])  # Expected Shortfall
print(f"VaR 95% (1 hari) = Rp{var95:,.0f}")
print(f"ES 95% (1 hari)  = Rp{es:,.0f}  (rata-rata kerugian JIKA tembus VaR)")
print(f"P(rugi > Rp500)  = {sum(1 for x in pl if x < -500)/N:.2%}")
print("\nCoba: sigma=0.04 (2x lipat). VaR naik berapa? (tidak 2x persis!)")`;
  const quizData = [{"question": "Prinsip Monte Carlo untuk E[g(X)] adalah…", "options": ["Integral analitik", "Rata-rata g(Xi) dari sampel acak (LLN)", "Tebakan", "Regresi"], "correct": 1, "explanation": "Benar: LLN dipekerjakan — rata-rata simulasi → ekspektasi."}, {"question": "SE Monte Carlo = σ/√N. Untuk error 10x lebih kecil, N harus…", "options": ["10x", "100x", "1000x", "Tetap"], "correct": 1, "explanation": "Benar: pajak akar kuadrat — 100x komputasi untuk 10x presisi."}, {"question": "Kapan sebaiknya TIDAK pakai Monte Carlo?", "options": ["VaR multi-aset", "Opsi eksotik", "Ada rumus analitik murah & eksak (Black-Scholes standar)", "Integral 10 dimensi"], "correct": 2, "explanation": "Benar: jangan bayar noise & waktu untuk yang bisa eksak instan."}, {"question": "Untuk kejadian langka (ekor), teknik yang wajib…", "options": ["Antithetic saja", "Importance sampling", "Seed besar", "N kecil"], "correct": 1, "explanation": "Benar: MC polos hampir tak pernah menyentuh ekor — sampel harus difokuskan lalu dikoreksi."}, {"question": "Monte Carlo tanpa SE yang dilaporkan…", "options": ["Tetap valid", "Setengah bohong — tidak tahu ketelitiannya", "Lebih cepat", "Disyaratkan"], "correct": 1, "explanation": "Benar: kejujuran MC = ia tahu errornya sendiri. Tanpa SE, angka MC = angka misterius."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B12 — Probabilitas</span>
        <h1 className="display-title">Monte Carlo: Ketika Rumus Menyerah,<br/>Simulasi Berbicara</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Menghitung π dengan Hujan Beras?</a></li>
          <li><a href="#prinsip">Prinsip — LLN yang Dipekerjakan</a></li>
          <li><a href="#aplikasi">Tiga Aplikasi Klasik</a></li>
          <li><a href="#vr">Variance Reduction — Bekerja Lebih Cerdas</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung π dengan Beras Digital</a></li>
          <li><a href="#lab2">🔬 Lab 2: VaR Portofolio via Monte Carlo</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Monte Carlo</a></li>
          <li><a href="#case">📋 Mini-Case: ECL dengan 3 Skenario Makro</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>prinsip Monte Carlo</strong>: ekspektasi = rata-rata simulasi (LLN beraksi).</li><li>Menghitung <strong>standard error Monte Carlo</strong> <Tex math={String.raw`\sigma/\sqrt{N}`} /> dan menentukan N.</li><li>Menerapkan Monte Carlo untuk <strong>integral, VaR, dan harga opsi</strong> sederhana.</li><li>Mengenal <strong>variance reduction</strong> (antithetic, control variate) dan kapan Monte Carlo <em>tidak</em> cocok.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Menghitung π dengan Hujan Beras?</h2>

      <div className="story"><p>Tempel kertas 2×2 m di dinding, gambar lingkaran diameter 2 m di dalamnya. Lempar 10.000 butir beras acak ke kertas. Hitung yang jatuh di dalam lingkaran: misal 7.854. Maka π ≈ 4 × 7854/10000 = <strong>3,1416</strong>.</p><p>Kedengarannya konyol — tapi ini <strong>metode Monte Carlo</strong>: menjawab pertanyaan deterministik (berapa π?) dengan <em>acak</em>. Prinsipnya: peluang butir jatuh di lingkaran = luas lingkaran / luas kertas = π/4 — dan LLN (B11) menjamin frekuensi → peluang.</p><p>Di keuangan: harga opsi eksotik, VaR portofolio kompleks, ECL dengan banyak skenario — semua yang <em>rumusnya tidak ada atau terlalu sulit</em> — dijawab Monte Carlo. Industri berjalan di atasnya.</p><p><strong>Twist-nya:</strong> menembak butir beras untuk menghitung π — metode paling &ldquo;tidak serius&rdquo; yang pernah ada justru menjadi fondasi industri keuangan modern. Ironinya: ketika rumus eksak tidak ada, &ldquo;tebak-tebakan terstruktur&rdquo; (acak + LLN) lebih dapat diandalkan daripada model elegan yang asumsinya salah. Kadang cara paling jujur menjawab pertanyaan sulit adalah mengakui kita menebak — dengan sangat banyak tebakan.</p></div>

      <h2 id="prinsip">Prinsip — LLN yang Dipekerjakan</h2>

      <p>Banyak masalah = menghitung ekspektasi <Tex math={String.raw`E[g(X)]`} /> yang integralnya sulit. Monte Carlo:</p>

      <p><Tex math={String.raw`E[g(X)] \approx \frac{1}{N}\sum_{i=1}^{N} g(X_i), \quad X_i \text{ sampel acak}`} block /></p>

      <p>Ini <strong>LLN (B11)</strong> yang dipekerjakan: rata-rata simulasi → ekspektasi. <strong>Error-nya:</strong></p>

      <p><Tex math={String.raw`SE_{MC} = \frac{\sigma_g}{\sqrt{N}}`} block /></p>

      <p>dengan <Tex math={String.raw`\sigma_g`} /> = SD dari <Tex math={String.raw`g(X)`} />. <strong>Contoh π:</strong> tiap butir ~ Bernoulli(p=π/4); <Tex math={String.raw`\sigma_g = \sqrt{p(1-p)} \approx 0{,}41`} />; N=10.000 → SE ≈ 0,0041 → π ≈ 3,1416 ± 0,016 (95%).</p>

      <p><strong>Kepribadian:</strong> Monte Carlo adalah &ldquo;pekerja kasar yang jujur&rdquo; — tidak pintar (error turun lambat, 1/√N), tapi tidak pernah berbohong tentang errornya dan bisa mengerjakan <em>apapun</em> yang bisa disimulasikan.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Rumus menentukan N: mau error &lt; ε dengan 95% keyakinan? <Tex math={String.raw`N \approx (1{,}96\,\sigma_g/\varepsilon)^2`} />. Untuk π ± 0,001: N ≈ 650.000. Pajak √n lagi — Monte Carlo mahal untuk presisi tinggi, murah untuk jawaban kasar yang cepat.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak simulasi = makin akurat, tanpa batas.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Akurat iya, tapi error hanya turun 1/√N: 100x simulasi = 10x presisi. Dari 10 ribu ke 1 juta simulasi (100x komputasi) error cuma turun 10x. Untuk presisi tinggi, <strong>variance reduction</strong> (di bawah) jauh lebih murah daripada brute force N.</p>
</div>

      <h2 id="aplikasi">Tiga Aplikasi Klasik</h2>

      <h3>1. Integral sulit</h3>

      <p><Tex math={String.raw`\int_0^1 e^{-x^2} dx = E[e^{-U^2}],\ U \sim \mathrm{Uniform}(0,1)`} block /></p>

      <p>Sampel U acak, rata-ratakan <Tex math={String.raw`e^{-U^2}`} /> — selesai. (Untuk integral dimensi tinggi, Monte Carlo <em>mengalahkan</em> metode grid: error 1/√N tak peduli dimensi!)</p>

      <h3>2. VaR portofolio (topik E13/MR3)</h3>

      <p>Simulasikan N skenario return (dengan korelasi/copula yang benar!), hitung P&L tiap skenario, ambil <strong>kuantil 5%</strong> = VaR 95%. Tidak butuh rumus — butuh model simulasi yang jujur.</p>

      <h3>3. Harga opsi (topik E10–E11)</h3>

      <p>Opsi call Eropa: payoff = max(S_T − K, 0). Simulasikan <Tex math={String.raw`S_T`} /> (misal GBM, B15), rata-ratakan payoff yang didiskon:</p>

      <p><Tex math={String.raw`C \approx e^{-rT}\, \frac{1}{N}\sum_{i=1}^{N} \max(S_T^{(i)} - K,\, 0)`} block /></p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola universal Monte Carlo: <strong>(1)</strong> tulis yang dicari sebagai ekspektasi; <strong>(2)</strong> sampel dari distribusinya; <strong>(3)</strong> rata-ratakan; <strong>(4)</strong> laporkan SE = σ/√N. Empat langkah ini menyelesaikan ribuan masalah.</p>
</div>

      <h2 id="vr">Variance Reduction — Bekerja Lebih Cerdas</h2>

      <ul>
<li><strong>Antithetic variates:</strong> tiap sampel Z dipasangkan dengan −Z — saling mengkansel noise. Sering memangkas varians 2–10x, hampir gratis.</li>
<li><strong>Control variate:</strong> jika tahu E[h(X)] analitik dan h mirip g, simulasikan g−h (varians kecil) lalu tambah E[h].</li>
<li><strong>Importance sampling:</strong> sampel lebih banyak di wilayah penting (ekor!) — wajib untuk kejadian langka; jika tidak, 1 juta simulasi pun tak menyentuh ekor.</li>
</ul>

      <p><strong>Kapan Monte Carlo TIDAK cocok:</strong> butuh presisi sangat tinggi (pakai metode deterministik/analitik), dimensi rendah + fungsi mulus (kuadratur lebih cepat), atau kejadian super-langka tanpa importance sampling.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Monte Carlo = asal simulasi banyak-banyak.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Simulasi tanpa desain = pemborosan. Seed tidak di-set (tidak reproducible!), tanpa SE (tidak tahu error), tanpa variance reduction (lambat 100x), model simulasi salah (copula Gaussian untuk krisis — B10!). Monte Carlo yang profesional = desain eksperimen, bukan brute force.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Error Monte Carlo: Turun 1/√N (Lambat tapi Pasti)"
  layout={{"xaxis": {"title": "N (simulasi, skala log)", "type": "log"}, "yaxis": {"title": "Standard error", "type": "log"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Skala log-log: garis lurus dengan kemiringan −1/2 — ciri 1/√N.</p>
<p><strong>Interpretasi:</strong> Dari 100 ke 100.000 simulasi (1000x komputasi), error turun 30x (bukan 1000x). <strong>Keputusan praktis:</strong> butuh 1 digit presisi → Monte Carlo murah; butuh 6 digit → pikir ulang (analitik/variance reduction). Pilih N dari rumus error, bukan dari &ldquo;angka bulat yang enak&rdquo;.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Variance Reduction: Varians Relatif (ilustrasi)"
  layout={{"yaxis": {"title": "Varians relatif terhadap MC biasa"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = varians estimator relatif terhadap Monte Carlo polos untuk masalah yang sama.</p>
<p><strong>Interpretasi:</strong> Antithetic memangkas ~3x, control variate ~8x — <strong>setara menambah simulasi 8x lipat tanpa biaya komputasi tambahan</strong>. Pelajaran: satu jam memikirkan variance reduction &gt; satu hari menambah N.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Monte Carlo = &ldquo;jawab dengan banyak tebakan acak&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: π dari 10.000 butir — berapa presisinya?</summary>
              <p>10.000 butir, 7.854 di lingkaran. Estimasi π = 3,1416. Berapa standard error-nya?</p>
              <p><strong>Langkah 1</strong> — tiap butir ~ Bernoulli(p = π/4 ≈ 0,785). p̂ = 0,7854.<br />
              <strong>Langkah 2</strong> — SE(p̂) = √(0,7854×0,2146/10000) ≈ 0,0041.<br />
              <strong>Langkah 3</strong> — π̂ = 4p̂ → SE(π̂) = 4 × 0,0041 = <strong>0,0164</strong>. IK95%: 3,1416 ± 0,032.</p>
              <p>Pelajaran: Monte Carlo selalu datang dengan SE-nya sendiri (∝ 1/√N). Tanpa SE, angka Monte Carlo = tebakan tanpa ukuran ketidakpastian.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: VaR portofolio — yang tidak ada rumusnya</summary>
              <p>Portofolio: 3 aset dengan payoff non-linear (opsi). Tidak ada rumus VaR 99% 1-hari. Bagaimana Monte Carlo menjawabnya?</p>
              <p><strong>Langkah 1</strong> — model: return tiap aset ~ distribusi (mis. t dengan korelasi via copula).<br />
              <strong>Langkah 2</strong> — simulasikan N = 100.000 skenario → hitung P&amp;L tiap skenario (lewat fungsi payoff, semahal apapun).<br />
              <strong>Langkah 3</strong> — VaR 99% = <strong>persentil ke-1</strong> dari 100.000 P&amp;L. SE kuantil ≈ √[p(1−p)/(N·f²)] — N besar = kuantil stabil.</p>
              <p>Pelajaran: Monte Carlo memisahkan &ldquo;model dunia&rdquo; (distribusi) dari &ldquo;perhitungan&rdquo; (simulasi). Payoff serumit apapun — asal bisa dihitung per skenario — VaR-nya bisa diestimasi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Variance reduction — antithetic</summary>
              <p>Estimasi E[max(S−100, 0)], S lognormal. N = 10.000 memberi SE = 0,5. Dengan antithetic variates (pasangan Z, −Z), varians turun 60%. Berapa N <em>efektif</em> sekarang?</p>
              <p><strong>Langkah 1</strong> — varians baru = 0,4 × varians lama.<br />
              <strong>Langkah 2</strong> — SE baru = 0,5 × √0,4 ≈ <strong>0,316</strong>.<br />
              <strong>Langkah 3</strong> — N efektif: SE ∝ 1/√N → N<sub>eff</sub> = 10.000/0,4 = <strong>25.000</strong> — gratis, tanpa simulasi tambahan!</p>
              <p>Pelajaran: variance reduction = &ldquo;bekerja lebih cerdas&rdquo;. Antithetic, control variates, importance sampling — semuanya menukar sedikit kode dengan banyak presisi.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Hitung π dengan Beras Digital</h2>

      <p>Lempar titik acak ke kotak [−1,1]², hitung proporsi dalam lingkaran. Lihat error menyusut 1/√N.</p>

      <PyodideLab
  title="Lab 1 — Monte Carlo Klasik"
  hint="Perhatikan error ≈ SE yang diprediksi — Monte Carlo selalu jujur tentang ketelitiannya sendiri."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: VaR Portofolio via Monte Carlo</h2>

      <p>Saham Rp10.000, return harian ~ Normal(μ=0,05%, σ=2%). Simulasikan 50.000 hari, hitung VaR 95% (kerugian maksimum yang &ldquo;wajar&rdquo;).</p>

      <PyodideLab
  title="Lab 2 — VaR 95% Satu Saham"
  hint="VaR = kuantil, ES = rata-rata ekor. Keduanya dari SATU simulasi — dan keduanya butuh model return yang jujur (Normal? t? — B7!)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Monte Carlo</h2>

      <div className="decision-card">
<h3>1. Ekspektasi/integral tanpa rumus tertutup → <strong>Monte Carlo</strong></h3>
<p><strong>Kondisi data:</strong> Payoff eksotik, portofolio kompleks, dimensi tinggi.</p>
<p><strong>Kenapa:</strong> Empat langkah universal; error 1/√N tak peduli dimensi.</p>
<p><strong>Contoh nyata:</strong> Opsi Asia, VaR multi-aset.</p>
</div>

      <div className="decision-card">
<h3>2. Butuh presisi → <strong>hitung N dari rumus error</strong></h3>
<p><strong>Kondisi data:</strong> Ada target toleransi ε.</p>
<p><strong>Kenapa:</strong> N ≈ (1,96σ/ε)² — jangan asal 10.000 atau 1 juta.</p>
<p><strong>Contoh nyata:</strong> π ± 0,001 → N ≈ 650 ribu.</p>
</div>

      <div className="decision-card">
<h3>3. Simulasi lambat / N mahal → <strong>variance reduction dulu</strong></h3>
<p><strong>Kondisi data:</strong> Tiap sampel mahal (model kompleks).</p>
<p><strong>Kenapa:</strong> Antithetic/control variate = &ldquo;N gratis&rdquo;.</p>
<p><strong>Contoh nyata:</strong> Pricing portofolio derivatif.</p>
</div>

      <div className="decision-card">
<h3>4. Kejadian langka (ekor) → <strong>importance sampling</strong></h3>
<p><strong>Kondisi data:</strong> P(ekstrem) kecil — MC polos tak menyentuh.</p>
<p><strong>Kenapa:</strong> Sampel difokuskan ke wilayah penting, lalu dikoreksi bobotnya.</p>
<p><strong>Contoh nyata:</strong> P(kerugian &gt; Rp10 M) dengan model berekor tebal.</p>
</div>

      <div className="decision-card">
<h3>5. Ada rumus analitik eksak &amp; murah → <strong>jangan Monte Carlo</strong></h3>
<p><strong>Kondisi data:</strong> Opsi Eropa standar (Black-Scholes), integral 1D mulus.</p>
<p><strong>Kenapa:</strong> Analitik: instan &amp; presisi mesin. MC: lambat &amp; ber-noise.</p>
<p><strong>Contoh nyata:</strong> Jangan MC untuk Black-Scholes standar — pakai rumus.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Tulis target sebagai <strong>ekspektasi</strong> → sampel → rata-rata → SE.</li><li>Selalu laporkan <strong>SE = σ/√N</strong> — MC tanpa error bar = setengah bohong.</li><li>Set <strong>seed</strong> — reproducibility bukan opsional.</li><li>Model simulasinya harus jujur (distribusi + copula) — MC hanya sebaik modelnya.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: ECL dengan 3 Skenario Makro</h2>

      <div className="callout">
<p>IFRS 9/PSAK 71 mewajibkan ECL = rata-rata tertimbang skenario: baseline (50%), adverse (30%), severe (20%). Bank punya model PD bersyarat makro — tapi distribusi makro kontinu, bukan 3 titik.</p><p><strong>Pertanyaan:</strong> (a) Bagaimana Monte Carlo memperbaiki &ldquo;3 skenario&rdquo;? (b) Apa risikonya?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>MC mengintegrasikan seluruh distribusi makro:</strong> sampel 10.000 path makro (GDP, unemployment) dari distribusi forecast → hitung PD &amp; ECL tiap path → rata-ratakan. Ini menghilangkan &ldquo;loncatan&rdquo; antar 3 skenario diskret dan menangkap non-linearitas (Jensen, B5!). ECL_3skenario bisa bias jika hubungan makro→PD cembung.</p><p>(b) <strong>Risiko:</strong> (1) distribusi forecast makro harus jujur (bukan Normal jika resesi berekor); (2) korelasi antar variabel makro (copula!); (3) 10.000 path × portofolio besar = komputasi berat → butuh variance reduction atau surrogate model. <strong>Pelajaran:</strong> MC memindahkan masalah dari &ldquo;rumus&rdquo; ke &ldquo;kualitas model simulasi&rdquo; — tetap butuh B7–B10 yang benar.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Monte Carlo N = 40.000 mengestimasi peluang 0,12. Berapa SE estimasinya? Berapa N agar SE &lt; 0,001?</li>
              <li>Jelaskan dalam 2 kalimat mengapa Monte Carlo untuk ECL (expected credit loss) dengan 20 skenario makro butuh simulasi, bukan rumus.</li>
              <li>Dengan importance sampling, separuh sampel difokuskan ke daerah ekor. Kapan teknik ini paling berguna — untuk mean atau untuk kuantil ekstrem? Mengapa?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> SE = √(0,12×0,88/40000) ≈ <strong>0,00163</strong>. Agar &lt; 0,001: N &gt; 0,12×0,88/0,001² = <strong>105.600</strong>.</p>
              <p><strong>2.</strong> ECL = E[loss(skenario)] dengan loss non-linear terhadap 20 variabel makro yang berkorelasi — integral 20 dimensinya tidak ada rumus tertutupnya. Monte Carlo: sampel skenario → hitung loss → rata-ratakan.</p>
              <p><strong>3.</strong> Untuk <strong>kuantil ekstrem</strong> (VaR 99%): sampel acak biasa jarang menyentuh ekor → kuantil berisik. Importance sampling memaksa sampel ke ekor lalu mengoreksi bobotnya — jauh lebih efisien untuk yang jarang terjadi.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Prinsip:</strong> <Tex math={String.raw`E[g(X)] \approx \frac{1}{N}\sum g(X_i)`} /> — LLN yang dipekerjakan.</li><li><strong>Error:</strong> SE = σ/√N — lambat tapi pasti; tentukan N dari target error.</li><li><strong>Pola:</strong> tulis ekspektasi → sampel → rata-rata → SE. Untuk integral, VaR, opsi.</li><li><strong>Variance reduction:</strong> antithetic, control variate, importance sampling — &ldquo;N gratis&rdquo;.</li><li><strong>Jangan</strong> MC untuk yang ada rumus eksaknya; <strong>selalu</strong> set seed + laporkan SE; model harus jujur.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b11-lln-clt" className="btn btn-secondary btn-sm">← ← B11</Link>
        <Link href="/learn/b13-vasicek" className="btn btn-primary btn-sm">Next: B13 →</Link>
      </div>
    </div>
  );
}

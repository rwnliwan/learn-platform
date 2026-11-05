import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B7DistribusiKontinu2Page() {
  const chart1 = [{"x": [-4.0, -3.9, -3.8, -3.7, -3.6, -3.5, -3.4, -3.3, -3.2, -3.1, -3.0, -2.9, -2.8, -2.7, -2.6, -2.5, -2.4, -2.3, -2.2, -2.1, -2.0, -1.9, -1.8, -1.7, -1.6, -1.5, -1.4, -1.3, -1.2, -1.1, -1.0, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0], "y": [0.0001, 0.0002, 0.0003, 0.0004, 0.0006, 0.0009, 0.0012, 0.0017, 0.0024, 0.0033, 0.0044, 0.006, 0.0079, 0.0104, 0.0136, 0.0175, 0.0224, 0.0283, 0.0355, 0.044, 0.054, 0.0656, 0.079, 0.094, 0.1109, 0.1295, 0.1497, 0.1714, 0.1942, 0.2179, 0.242, 0.2661, 0.2897, 0.3123, 0.3332, 0.3521, 0.3683, 0.3814, 0.391, 0.397, 0.3989, 0.397, 0.391, 0.3814, 0.3683, 0.3521, 0.3332, 0.3123, 0.2897, 0.2661, 0.242, 0.2179, 0.1942, 0.1714, 0.1497, 0.1295, 0.1109, 0.094, 0.079, 0.0656, 0.054, 0.044, 0.0355, 0.0283, 0.0224, 0.0175, 0.0136, 0.0104, 0.0079, 0.006, 0.0044, 0.0033, 0.0024, 0.0017, 0.0012, 0.0009, 0.0006, 0.0004, 0.0003, 0.0002, 0.0001], "type": "scatter", "mode": "lines", "name": "Normal(0,1)", "line": {"color": "#94a3b8"}}, {"x": [-4.0, -3.9, -3.8, -3.7, -3.6, -3.5, -3.4, -3.3, -3.2, -3.1, -3.0, -2.9, -2.8, -2.7, -2.6, -2.5, -2.4, -2.3, -2.2, -2.1, -2.0, -1.9, -1.8, -1.7, -1.6, -1.5, -1.4, -1.3, -1.2, -1.1, -1.0, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0], "y": [0.0092, 0.01, 0.0109, 0.0119, 0.013, 0.0142, 0.0156, 0.0171, 0.0189, 0.0208, 0.023, 0.0254, 0.0282, 0.0312, 0.0347, 0.0387, 0.0431, 0.0481, 0.0538, 0.0602, 0.0675, 0.0757, 0.085, 0.0954, 0.107, 0.12, 0.1345, 0.1504, 0.1678, 0.1866, 0.2067, 0.2279, 0.2497, 0.2716, 0.293, 0.3132, 0.3313, 0.3465, 0.3579, 0.3651, 0.3676, 0.3651, 0.3579, 0.3465, 0.3313, 0.3132, 0.293, 0.2716, 0.2497, 0.2279, 0.2067, 0.1866, 0.1678, 0.1504, 0.1345, 0.12, 0.107, 0.0954, 0.085, 0.0757, 0.0675, 0.0602, 0.0538, 0.0481, 0.0431, 0.0387, 0.0347, 0.0312, 0.0282, 0.0254, 0.023, 0.0208, 0.0189, 0.0171, 0.0156, 0.0142, 0.013, 0.0119, 0.0109, 0.01, 0.0092], "type": "scatter", "mode": "lines", "name": "t (ν=3)", "line": {"color": "#e8a838"}}];
  const chart2 = [{"x": [1.0, 1.3, 1.6, 1.9, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.3, 4.6, 4.9, 5.2, 5.5, 5.8, 6.1, 6.4, 6.7, 7.0, 7.3, 7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0, 10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.7], "y": [1.0, 0.5917, 0.3906, 0.277, 0.2066, 0.16, 0.1276, 0.1041, 0.0865, 0.073, 0.0625, 0.0541, 0.0473, 0.0416, 0.037, 0.0331, 0.0297, 0.0269, 0.0244, 0.0223, 0.0204, 0.0188, 0.0173, 0.016, 0.0149, 0.0138, 0.0129, 0.0121, 0.0113, 0.0106, 0.01, 0.0094, 0.0089, 0.0084, 0.008, 0.0076, 0.0072, 0.0068, 0.0065, 0.0062], "type": "scatter", "mode": "lines", "name": "Pareto: P(X>x)=(1/x)²", "line": {"color": "#ef4444"}}, {"x": [1.0, 1.3, 1.6, 1.9, 2.2, 2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.3, 4.6, 4.9, 5.2, 5.5, 5.8, 6.1, 6.4, 6.7, 7.0, 7.3, 7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0, 10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.7], "y": [1.0, 0.7408, 0.5488, 0.4066, 0.3012, 0.2231, 0.1653, 0.1225, 0.0907, 0.0672, 0.0498, 0.0369, 0.0273, 0.0202, 0.015, 0.0111, 0.0082, 0.0061, 0.0045, 0.0033, 0.0025, 0.0018, 0.0014, 0.001, 0.0007, 0.0006, 0.0004, 0.0003, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "type": "scatter", "mode": "lines", "name": "Eksponensial (banding)", "line": {"color": "#2a7de1", "dash": "dash"}}];
  const lab1Code = String.raw`a, b = 5, 95  # prior Beta: mean 5%
print(f"Prior: Beta({a},{b}), mean = {a/(a+b):.2%}")
print()
for sukses, total in [(8, 100), (16, 200), (40, 500), (80, 1000)]:
    pa, pb = a + sukses, b + (total - sukses)
    mean_post = pa / (pa + pb)
    mentah = sukses / total
    print(f"data {sukses}/{total} (mentah {mentah:.1%}): posterior Beta({pa},{pb}), mean {mean_post:.2%}")
print()
print("Makin banyak data, posterior makin dekat ke data mentah")
print("(prior 'tenggelam'). Sedikit data -> prior menahan (shrinkage).")
print("Coba: prior Beta(1,1) (tidak tahu apa-apa). Apa yang berubah?")`;
  const lab2Code = String.raw`import random, statistics
random.seed(71)

def pareto(alpha, xm=1.0):
    return xm / (random.random() ** (1/alpha))

alpha = 1.2
xs = [pareto(alpha) for _ in range(20000)]
print("Pareto(α=1.2): rata-rata kumulatif")
for n in [100, 1000, 5000, 20000]:
    print(f"  n={n:>6}: mean = {statistics.mean(xs[:n]):8.1f}")
print(f"  (teori: α/(α-1) = {alpha/(alpha-1):.1f}, tapi sampel meloncat!)")
print()
ys = [random.gauss(0,1) for _ in range(20000)]
print("Normal(0,1) sebagai banding:")
for n in [100, 1000, 5000, 20000]:
    print(f"  n={n:>6}: mean = {statistics.mean(ys[:n]):+.3f}")
print("\nCoba: alpha=2.5 (ekor lebih tipis). Apakah mean stabil?")`;
  const quizData = [{"question": "Beta(5,95) lalu amati 16 gagal dari 200. Posterior?", "options": ["Beta(21, 279)", "Beta(16, 184)", "Beta(5, 95)", "Beta(21, 184)"], "correct": 0, "explanation": "Benar: tambah sukses ke a, gagal ke b → Beta(5+16, 95+184). Mean 7% — shrinkage dari 8% mentah."}, {"question": "Distribusi t vs Normal: bedanya…", "options": ["t selalu simetris sempurna", "t berekor lebih tebal; ν→∞ → Normal", "t hanya untuk data besar", "Tidak ada beda"], "correct": 1, "explanation": "Benar: t = Normal + ketidakpastian estimasi SD. ν kecil → ekor tebal."}, {"question": "χ² dengan k derajat bebas muncul sebagai…", "options": ["Jumlah k Normal standar yang dikuadratkan", "Rata-rata k Normal", "Selisih dua Normal", "Hasil kali k Uniform"], "correct": 0, "explanation": "Benar: definisinya. Makanya dipakai untuk varians (jumlah kuadrat deviasi)."}, {"question": "Pareto α=1,5: yang benar…", "options": ["Mean dan varians hingga", "Mean hingga, varians tak hingga", "Keduanya tak hingga", "Mean nol"], "correct": 1, "explanation": "Benar: α>1 → mean hingga; α≤2 → varians tak hingga. Jangan hitung SD!"}, {"question": "Kapan pakai Gamma?", "options": ["Data proporsi", "Waktu tunggu sampai kejadian ke-α", "Uji independensi", "Data kategorik"], "correct": 1, "explanation": "Benar: Gamma = generalisasi Eksponensial. α=1 → Eksponensial."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B7 (Part 2) — Probabilitas</span>
        <h1 className="display-title">Distribusi Kontinu (2):<br/>Gamma, Beta, t, Chi-Square &amp; Pareto</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Ketika Rata-rata Tidak Ada</a></li>
          <li><a href="#gamma">Gamma — Menunggu Kejadian ke-k</a></li>
          <li><a href="#beta">Beta — Distribusi untuk Peluang</a></li>
          <li><a href="#t">Distribusi t — Normal dengan Ketidakpastian Tambahan</a></li>
          <li><a href="#chisq">Chi-Square — Distribusi untuk Jumlah Kuadrat</a></li>
          <li><a href="#pareto">Pareto — Hukum Pangkat &amp; Ekor yang Memakan Mean</a></li>
          <li><a href="#lab1">🔬 Lab 1: Beta-Binomial — Update Keyakinan Live</a></li>
          <li><a href="#lab2">🔬 Lab 2: Pareto — Rata-rata yang Tidak Stabil</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Distribusi Kontinu Lanjutan</a></li>
          <li><a href="#case">📋 Mini-Case: LGD yang &ldquo;Rata-rata 40%&rdquo;</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>Gamma</strong> (waktu tunggu kejadian ke-k) dan <strong>Beta</strong> (distribusi untuk peluang/proporsi).</li><li>Menjelaskan <strong>t</strong> dan <strong>χ²</strong> sebagai &ldquo;distribusi sampling&rdquo; — dari mana uji-t dan uji chi-square berasal.</li><li>Menjelaskan <strong>Pareto</strong> dan hukum pangkat — mengapa &ldquo;rata-rata&rdquo; bisa tidak ada.</li><li>Memilih distribusi kontinu yang tepat untuk tiap jenis data.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Ketika Rata-rata Tidak Ada</h2>

      <div className="story"><p>Manajer kekayaan melapor: <em>&ldquo;Rata-rata kekayaan nasabah kami Rp2 miliar.&rdquo;</em> Kamu hitung ulang dengan data lengkap — dan dapat <strong>Rp8 miliar</strong>. Kok beda? Karena satu konglomerat Rp500 miliar masuk sampel. Kamu tambah data lagi — rata-rata jadi Rp5 miliar. Tambah lagi — Rp11 miliar. <strong>Rata-ratanya tidak pernah stabil!</strong></p><p>Ini bukan error — ini <strong>distribusi Pareto</strong>: ekor sangat tebal sehingga mean teoritisnya bisa tak berhingga (untuk parameter tertentu). Hukum bilangan besar (B11) <em>gagal</em> di sini. Jika datamu Pareto tapi kamu perlakukan seperti Normal, seluruh analisismu — mean, SD, interval — runtuh.</p><p>Part 2 ini tentang distribusi-distribusi &ldquo;kambing hitam&rdquo; yang justru paling penting di risiko.</p><p><strong>Twist-nya:</strong> 2 miliar → 8 miliar → 5 miliar → 11 miliar — setiap tambahan data justru membuat rata-rata makin liar. Di dunia Pareto, &ldquo;lebih banyak data&rdquo; TIDAK menenangkan estimasi; ia mengekspos bahwa satu observasi ekstrem bisa mengalahkan sejuta observasi biasa. Big data tidak menyelamatkan model yang salah keluarga distribusi — ia hanya membuat kesalahanmu lebih presisi.</p></div>

      <h2 id="gamma">Gamma — Menunggu Kejadian ke-k</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Gamma}(\alpha, \beta)`} />: waktu tunggu sampai kejadian <strong>ke-</strong><Tex math={String.raw`\alpha`} /> jika kejadian datang laju <Tex math={String.raw`\beta`} />.</p>

      <p><Tex math={String.raw`f(x) = \frac{\beta^\alpha}{\Gamma(\alpha)}\, x^{\alpha-1} e^{-\beta x}, \quad E[X] = \frac{\alpha}{\beta}`} block /></p>

      <ul>
<li><Tex math={String.raw`\alpha=1`} /> → persis Eksponensial(β). Gamma = &ldquo;Eksponensial yang digeneralisasi&rdquo;.</li>
<li><Tex math={String.raw`\alpha`} /> bulat = <strong>Erlang</strong>: jumlah <Tex math={String.raw`\alpha`} /> Eksponensial independen.</li>
</ul>

      <p><strong>Kapan memakai:</strong> total waktu tunggu beberapa kejadian (klaim ke-5), jumlah curah hujan, waktu antar kegagalan mesin. Juga sebagai <strong>prior konjugat</strong> untuk laju Poisson (B17!).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Ingat rantai: <strong>Eksponensial</strong> (tunggu 1) → <strong>Erlang/Gamma</strong> (tunggu α). Pasangan diskretnya: <strong>Geometrik</strong> (tunggu 1 sukses) → <strong>Negatif Binomial</strong> (tunggu r). Empat distribusi, satu pola &ldquo;waktu tunggu&rdquo;.</p>
</div>

      <h2 id="beta">Beta — Distribusi untuk Peluang</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Beta}(a, b)`} />: variabel acak di <strong>[0,1]</strong> — cocok untuk <em>peluang yang tidak diketahui</em>, proporsi, rate.</p>

      <p><Tex math={String.raw`f(x) = \frac{x^{a-1}(1-x)^{b-1}}{B(a,b)}, \quad E[X] = \frac{a}{a+b}`} block /></p>

      <p><strong>Interpretasi ajaib:</strong> Beta(a,b) bisa dibaca sebagai &ldquo;punya bukti setara a−1 sukses dan b−1 gagal&rdquo;. Beta(1,1) = Uniform(0,1) = &ldquo;tidak tahu apa-apa&rdquo;.</p>

      <p><strong>Kapan memakai:</strong> <strong>prior konjugat untuk peluang Binomial</strong> (B17): mulai Beta(a,b), amati s sukses &amp; f gagal → posterior Beta(a+s, b+f). Sesederhana tambah! Juga: modeling LGD (0–1), conversion rate, pangsa pasar.</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Keyakinan awal PD ≈ 5%: prior Beta(5, 95) (mean 5/100 = 5%). Amati 200 nasabah: 16 gagal.</p><p><strong>Langkah 1</strong> — posterior: Beta(5+16, 95+184) = <strong>Beta(21, 279)</strong>.</p><p><strong>Langkah 2</strong> — mean posterior = 21/300 = <strong>7%</strong> (tertarik dari 5% ke data 8%).</p><p><strong>Langkah 3</strong> — bandingkan dengan estimasi mentah 16/200 = 8%: prior &ldquo;menahan&rdquo; agar tidak terlalu reaktif — inilah <strong>shrinkage</strong> (B17).</p>
</details>

      <h2 id="t">Distribusi t — Normal dengan Ketidakpastian Tambahan</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`T = \frac{Z}{\sqrt{V/\nu}}`} /> dengan <Tex math={String.raw`Z \sim N(0,1)`} />, <Tex math={String.raw`V \sim \chi^2_\nu`} /> independen. Parameter: derajat bebas <Tex math={String.raw`\nu`} />.</p>

      <p><strong>Intuisi:</strong> seperti Normal tapi <strong>ekor lebih tebal</strong> — karena SD-nya sendiri diestimasi dari sampel kecil (tidak diketahui pasti). Makin kecil <Tex math={String.raw`\nu`} />, makin tebal ekor; <Tex math={String.raw`\nu \to \infty`} /> → Normal.</p>

      <p><strong>Kapan memakai:</strong> uji-t &amp; interval kepercayaan mean untuk <strong>sampel kecil</strong> (A2.5). Return keuangan juga sering dimodelkan dengan t (ekor tebal!).</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Uji-t butuh data normal.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Yang butuh (mendekati) normal adalah <em>distribusi sampling mean</em> — bukan data mentah. Untuk n besar, CLT menyelamatkan. Untuk n kecil + data sangat tidak normal, t-test memang goyah — di situlah uji nonparametrik (A2.6) masuk.</p>
</div>

      <h2 id="chisq">Chi-Square — Distribusi untuk Jumlah Kuadrat</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`Q = \sum_{i=1}^{k} Z_i^2`} /> dengan <Tex math={String.raw`Z_i \sim N(0,1)`} /> independen → <Tex math={String.raw`Q \sim \chi^2_k`} />.</p>

      <p><Tex math={String.raw`E[Q] = k, \qquad \mathrm{Var}(Q) = 2k`} block /></p>

      <p><strong>Kapan memakai:</strong> uji chi-square independensi/homogenitas (A2.6), interval kepercayaan <strong>varians</strong>, dan — penting! — <Tex math={String.raw`\chi^2`} /> adalah fondasi distribusi t dan F. Juga: jumlah kuadrat return ternormalisasi untuk uji volatilitas.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Trio sampling yang wajib dikenal: <strong>Z</strong> (mean, σ diketahui) → <strong>t</strong> (mean, σ diestimasi) → <strong>χ²</strong> (varians). Tiga distribusi ini = mesin di balik separuh uji hipotesis klasik (A2.4–A2.6).</p>
</div>

      <h2 id="pareto">Pareto — Hukum Pangkat &amp; Ekor yang Memakan Mean</h2>

      <p><Tex math={String.raw`P(X > x) = \left(\frac{x_m}{x}\right)^{\alpha}, \quad x \ge x_m`} block /></p>

      <ul>
<li><Tex math={String.raw`x_m`} />: nilai minimum (skala)</li>
<li><Tex math={String.raw`\alpha`} />: indeks ekor — <strong>makin kecil α, makin tebal ekor</strong></li>
</ul>

      <p><strong>Fakta mengejutkan:</strong></p>

      <p><Tex math={String.raw`E[X] = \frac{\alpha\, x_m}{\alpha - 1} \quad (\alpha > 1), \qquad \mathrm{Var}(X) = \infty \text{ jika } \alpha \le 2`} block /></p>

      <p>Jika <Tex math={String.raw`\alpha \le 1`} />: <strong>mean pun tak berhingga!</strong> Rata-rata sampel tidak konvergen — inilah cerita pembuka. Kekayaan, ukuran kota, klaim bencana alam: α sering 1–2.</p>

      <p><strong>Aturan 80/20:</strong> Pareto dengan α ≈ 1,16 menghasilkan &ldquo;80% efek dari 20% sebab&rdquo; — bukan hukum alam, hanya satu titik parameter!</p>

      <p><strong>Kapan memakai:</strong> data dengan sedikit raksasa &amp; banyak kecil: klaim asuransi besar, ukuran kerugian operasional, kekayaan. <strong>Peran di risiko:</strong> model ekor untuk EVT (B16).</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Ekor tebal = outlier yang harus dibuang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Pada Pareto, &ldquo;outlier&rdquo; raksasa BUKAN error — mereka <em>ciri</em> distribusinya dan mendominasi total! Membuang klaim terbesar dari data asuransi = membuang bagian terpenting risiko. Ekor tebal dimodelkan (B16), bukan dihapus.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tes cepat ekor tebal: plot log-log P(X &gt; x) vs x. Pareto → garis lurus (kemiringan −α). Normal/eksponensial → melengkung turun curam. Satu plot ini = diagnosis 10 detik.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="t(ν=3) vs Normal: Ekor Lebih Tebal"
  layout={{"xaxis": {"title": "x", "range": [-4, 4]}, "yaxis": {"title": "pdf"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Abu-abu = Normal standar; kuning = distribusi t dengan ν=3. Perhatikan ujung kiri-kanan.</p>
<p><strong>Interpretasi:</strong> t lebih <strong>rendah di tengah, lebih tinggi di ekor</strong> — massa peluang &ldquo;bocor&rdquo; ke ekstrem. Untuk ν kecil (sampel kecil), memakai Normal meremehkan peluang kejadian ekstrem. Makin besar ν, t menyatu ke Normal.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Pareto vs Eksponensial: Ekor Turun Jauh Lebih Lambat"
  layout={{"xaxis": {"title": "x (skala log)", "type": "log"}, "yaxis": {"title": "P(X > x) (skala log)", "type": "log"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu log-log: Pareto = garis lurus; Eksponensial = melengkung turun curam.</p>
<p><strong>Interpretasi:</strong> Pada x besar, peluang Pareto <strong>orde magnitude</strong> lebih besar dari Eksponensial. &ldquo;Kejadian 10x lipat&rdquo; pada Pareto masih lumayan mungkin; pada Eksponensial praktis mustahil. <strong>Model risiko yang salah di ekor = bangkrut saat ekor datang</strong> (B16/EVT).</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Distribusi &ldquo;kambing hitam&rdquo; ini justru yang paling sering muncul di risiko.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Beta — update keyakinan PD</summary>
              <p>Prior PD ~ Beta(2, 38) (mean 5%). Data baru: 100 nasabah, 8 gagal. Berapa posterior?</p>
              <p><strong>Langkah 1</strong> — konjugat Beta-Binomial: posterior = Beta(2+8, 38+92) = <strong>Beta(10, 130)</strong>.<br />
              <strong>Langkah 2</strong> — mean posterior = 10/140 ≈ <strong>7,14%</strong> (di antara prior 5% dan data 8% — shrinkage!).<br />
              <strong>Langkah 3</strong> — bandingkan: estimasi naif 8% mengabaikan 40 &ldquo;pengamatan virtual&rdquo; dari prior. Beta menghitungnya eksak.</p>
              <p>Pelajaran: Beta = &ldquo;distribusi untuk peluang&rdquo;. Parameternya dibaca sebagai &ldquo;sukses/gagal virtual&rdquo; — prior yang jujur tentang seberapa kuat keyakinanmu.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Pareto — 80/20 di kekayaan</summary>
              <p>Kekayaan ~ Pareto(x<sub>m</sub> = 1 M, α = 1,5). Berapa peluang kekayaan &gt; 10 M? Berapa % total kekayaan dipegang 20% teratas?</p>
              <p><strong>Langkah 1</strong> — P(X &gt; 10) = (1/10)<sup>1,5</sup> ≈ <strong>3,16%</strong>.<br />
              <strong>Langkah 2</strong> — untuk Pareto α = 1,5: 20% teratas memegang ≈ <strong>73%</strong> total (aturan 80/20 versi eksak: pangkat (α−1)/α).<br />
              <strong>Langkah 3</strong> — bandingkan dengan Normal: P(&gt;10× lipat dari minimum) di Normal ≈ 0 — di Pareto 3%! Ekor tebal = kejadian &ldquo;mustahil&rdquo; yang rutin terjadi.</p>
              <p>Pelajaran: jika datamu Pareto tapi dihitung dengan rumus Normal, estimasi risiko ekormu salah <em>orde magnitude</em>.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Distribusi t — interval dengan n kecil</summary>
              <p>n = 10, mean sampel 8,2, s = 1,5. Interval kepercayaan 95% untuk mean — pakai z atau t?</p>
              <p><strong>Langkah 1</strong> — n kecil (10) → <strong>t</strong> dengan df = 9: t<sub>0,975</sub> = 2,262 (vs z = 1,96).<br />
              <strong>Langkah 2</strong> — SE = 1,5/√10 ≈ 0,474. Interval: 8,2 ± 2,262×0,474 = <strong>(7,13; 9,27)</strong>.<br />
              <strong>Langkah 3</strong> — jika (salah) pakai z: 8,2 ± 0,93 = (7,27; 9,13) — <em>terlalu sempit</em>, kepercayaan palsu.</p>
              <p>Pelajaran: t mengoreksi &ldquo;SD yang diestimasi dari sedikit data&rdquo; dengan interval lebih lebar. Aturan: n &lt; 30 (atau σ tak diketahui &amp; n kecil) → t, bukan z.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Beta-Binomial — Update Keyakinan Live</h2>

      <p>Prior Beta(5,95) untuk PD. Tambahkan data observasi, lihat posterior menyusut ke data — tapi tidak sepenuhnya.</p>

      <PyodideLab
  title="Lab 1 — Prior → Posterior (Shrinkage)"
  hint="Inilah &lt;strong>conjugate update&lt;/strong>: posterior = prior + hitung sukses/gagal. Fondasi B17."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Pareto — Rata-rata yang Tidak Stabil</h2>

      <p>Simulasi Pareto(α=1,2): rata-rata sampel meloncat-loncat bahkan di n besar. Bandingkan dengan Normal.</p>

      <PyodideLab
  title="Lab 2 — Mean yang Gagal Konvergen"
  hint="Jika datamu seperti Pareto(α≤2): &lt;strong>jangan percaya SD&lt;/strong> (tak berhingga!) — pakai kuantil &amp; EVT (B16)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Distribusi Kontinu Lanjutan</h2>

      <div className="decision-card">
<h3>1. Waktu tunggu kejadian ke-α → <strong>Gamma</strong></h3>
<p><strong>Kondisi data:</strong> Generalisasi Eksponensial untuk beberapa kejadian.</p>
<p><strong>Kenapa:</strong> α=1 → Eksponensial; α bulat → Erlang (jumlah Eksponensial).</p>
<p><strong>Contoh nyata:</strong> Waktu sampai klaim ke-5; total hujan sebulan.</p>
</div>

      <div className="decision-card">
<h3>2. Peluang/proporsi yang tidak diketahui → <strong>Beta</strong></h3>
<p><strong>Kondisi data:</strong> Parameter di [0,1]: PD, LGD, conversion rate.</p>
<p><strong>Kenapa:</strong> Konjugat Binomial: update = tambah sukses/gagal. Shrinkage alami.</p>
<p><strong>Contoh nyata:</strong> Posterior PD setelah observasi (worked di atas).</p>
</div>

      <div className="decision-card">
<h3>3. Inferensi mean sampel kecil / return berekor → <strong>t</strong></h3>
<p><strong>Kondisi data:</strong> SD tidak diketahui pasti (diestimasi) atau ekor tebal moderat.</p>
<p><strong>Kenapa:</strong> Ekor lebih tebal dari Normal; ν→∞ → Normal.</p>
<p><strong>Contoh nyata:</strong> Uji-t (A2.5); model return harian.</p>
</div>

      <div className="decision-card">
<h3>4. Uji varians / independensi kategori → <strong>Chi-Square</strong></h3>
<p><strong>Kondisi data:</strong> Jumlah kuadrat Normal standar.</p>
<p><strong>Kenapa:</strong> Mesin di balik uji chi-square & interval varians; fondasi t dan F.</p>
<p><strong>Contoh nyata:</strong> Uji independensi (A2.6).</p>
</div>

      <div className="decision-card">
<h3>5. Sedikit raksasa, banyak kecil (ekor pangkat) → <strong>Pareto</strong></h3>
<p><strong>Kondisi data:</strong> Kekayaan, klaim besar, kerugian operasional.</p>
<p><strong>Kenapa:</strong> Hukum pangkat; α≤2 → varians tak hingga; α≤1 → mean tak hingga.</p>
<p><strong>Contoh nyata:</strong> Model ekor klaim bencana (EVT, B16).</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Yang diestimasi <strong>peluang</strong> → Beta. <strong>Waktu tunggu k kejadian</strong> → Gamma.</li><li>Sampel kecil → t, bukan Z. Varians → χ².</li><li>Curiga ekor tebal → plot log-log dulu; Pareto = garis lurus.</li><li>α ≤ 2 → lupakan SD; pakai kuantil.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: LGD yang &ldquo;Rata-rata 40%&rdquo;</h2>

      <div className="callout">
<p>Bank melapor &ldquo;rata-rata LGD 40%&rdquo;. Kamu tarik distribusinya: ternyata <strong>bimodal</strong> — 60% kasus LGD ≈ 10% (ada agunan), 40% kasus LGD ≈ 85% (tanpa agunan). Distribusi Beta campuran.</p><p><strong>Pertanyaan:</strong> (a) Mengapa &ldquo;rata-rata 40%&rdquo; berbahaya untuk pricing? (b) Distribusi apa yang lebih jujur untuk LGD?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Tidak ada LGD yang 40%! Rata-rata jatuh di lembah kosong (mirip Lab B5). Pricing berbasis 40% salah harga untuk <em>kedua</em> segmen: kemahalan untuk beragunan (kabur ke kompetitor), kemurahan untuk tanpa agunan (rugi).</p><p>(b) <strong>Campuran dua Beta</strong> (atau model dua segmen): Beta untuk &ldquo;ada agunan&rdquo; (puncak di 10%) + Beta untuk &ldquo;tanpa agunan&rdquo; (puncak di 85%). LGD memang standar dimodelkan Beta (0–1) — dan <strong>bimodalitas = sinyal segmentasi</strong> (ingat A1.2!). Pelajaran: distribusi yang tepat + segmentasi &gt; satu angka rata-rata.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Chi-square df = 5. Jika jumlah kuadrat 5 Normal standar = 11,07, apakah &ldquo;terlalu besar&rdquo; pada α = 5%? (Petunjuk: kuantil-95 chi-square(5) = 11,07.)</li>
              <li>LGD ~ Beta(2, 3). Berapa mean dan modusnya? Interpretasikan untuk risiko kredit.</li>
              <li>Kerugian ~ Pareto(x<sub>m</sub> = 1, α = 2). Berapa P(kerugian &gt; 5)? Mengapa mean-nya ada (α &gt; 1) tapi &ldquo;tidak stabil&rdquo;?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> 11,07 <em>tepat</em> di kuantil-95 → <strong>tolak H0 pada α = 5%</strong> (batas!). Nilai sebesar ini hanya 5% terjadi jika H0 benar.</p>
              <p><strong>2.</strong> Mean = 2/5 = <strong>40%</strong>; modus = (2−1)/(2+3−2) = <strong>33,3%</strong>. Artinya: ekspektasi LGD 40%, nilai paling mungkin 33% — distribusi miring kanan, sesuai data LGD empiris.</p>
              <p><strong>3.</strong> P = (1/5)² = <strong>4%</strong>. Mean ada (= αx<sub>m</sub>/(α−1) = 2) tapi varians tak berhingga (α ≤ 2) → mean sampel <em>tidak stabil</em> (B7.1 gagal, B11 gagal) — cerita pembuka lesson ini.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Gamma:</strong> tunggu kejadian ke-α (α=1 → Eksponensial).</li><li><strong>Beta:</strong> distribusi untuk peluang di [0,1]; konjugat Binomial — update = tambah.</li><li><strong>t:</strong> Normal berekor tebal untuk sampel kecil; <strong>χ²:</strong> jumlah kuadrat Normal — untuk varians.</li><li><strong>Pareto:</strong> hukum pangkat; α≤2 → varians ∞; α≤1 → mean ∞ — jangan perlakukan seperti Normal.</li><li><strong>Jangan</strong> buang &ldquo;outlier&rdquo; ekor tebal — mereka adalah risikonya.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b7-distribusi-kontinu-1" className="btn btn-secondary btn-sm">← ← B7.1</Link>
        <Link href="/learn/b8-fitting-distribusi" className="btn btn-primary btn-sm">Next: B8 →</Link>
      </div>
    </div>
  );
}

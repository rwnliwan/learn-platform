import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B9JointKovariansPage() {
  const chart1 = [{"x": [1, 2, 3, 4, 5, 6], "y": [2, 4, 5, 4, 5, 7], "type": "scatter", "mode": "markers", "name": "Korelasi + (ρ≈0,9)", "marker": {"color": "#2a7de1", "size": 10}}, {"x": [1, 2, 3, 4, 5, 6], "y": [7, 5, 6, 4, 3, 2], "type": "scatter", "mode": "markers", "name": "Korelasi − (ρ≈−0,9)", "marker": {"color": "#e8a838", "size": 10}, "xaxis": "x2", "yaxis": "y2"}];
  const chart2 = [{"x": ["ρ = −0,5", "ρ = 0,2 (normal)", "ρ = 0,8 (krisis)"], "y": [0.1, 0.155, 0.19], "type": "bar", "marker": {"color": ["#34a853", "#2a7de1", "#ef4444"]}, "text": ["10%", "15,5%", "19%"], "textposition": "outside"}];
  const lab1Code = String.raw`import random, statistics
random.seed(90)
N = 200000
xs = [random.uniform(-1, 1) for _ in range(N)]
ys = [x**2 for x in xs]
mx, my = statistics.mean(xs), statistics.mean(ys)
cov = sum((x-mx)*(y-my) for x, y in zip(xs, ys)) / N
sx, sy = statistics.pstdev(xs), statistics.pstdev(ys)
print(f"Cov(X,Y) = {cov:.4f}")
print(f"Korelasi = {cov/(sx*sy):.4f}  <- NOL!")
print(f"Tapi Y = X^2: dependen SEMPURNA (tahu X -> tahu Y persis)")
print()
print("Coba: ys = [abs(x) for x in xs]. Korelasi? (masih ~0!)")
print("Pelajaran: korelasi buta terhadap hubungan non-linear simetris.")`;
  const lab2Code = String.raw`import random, statistics
random.seed(91)

def sim_port(rho, N=100000):
    # dua Normal(0, 0.2) dengan korelasi rho (via Cholesky)
    vals = []
    for _ in range(N):
        z1, z2 = random.gauss(0,1), random.gauss(0,1)
        a = 0.2*z1
        b = 0.2*(rho*z1 + (1-rho**2)**0.5*z2)
        vals.append(0.5*a + 0.5*b)
    return statistics.pstdev(vals)

for rho in [-0.5, 0.0, 0.2, 0.5, 0.8, 1.0]:
    print(f"ρ={rho:+.1f} -> SD portofolio = {sim_port(rho):.3f}")
print()
print("Lihat: ρ naik -> SD naik. Di ρ=1, diversifikasi NOL.")
print("Coba: bobot 80/20. Apakah diversifikasi lebih baik?")`;
  const quizData = [{"question": "Dari tabel joint, P(telat)=0,08 didapat dengan…", "options": ["Membagi 0,03/0,08", "Menjumlahkan baris X=1: 0,05+0,03", "Mengalikan 0,05×0,03", "Tidak bisa"], "correct": 1, "explanation": "Benar: marginal = jumlahkan keluar variabel lain. Fondasi sebelum hitung bersyarat."}, {"question": "Cov(X,Y)=0. Kesimpulan yang VALID…", "options": ["X,Y independen", "Tidak ada hubungan linear; bisa tetap dependen non-linear", "Korelasi = 1", "Y konstan"], "correct": 1, "explanation": "Benar: contoh Y=X² membuktikan kovarians nol ≠ independen."}, {"question": "Pada bivariat normal, ρ=0 berarti…", "options": ["Tidak ada hubungan apapun", "Independen (kasus istimewa!)", "Korelasi tidak terdefinisi", "Marginal tidak normal"], "correct": 1, "explanation": "Benar: satu-satunya kasus umum di mana nol korelasi ⟺ independen. Jangan generalisasi ke distribusi lain."}, {"question": "Dua aset σ=20%, 50/50, ρ naik 0,2→0,8. SD portofolio…", "options": ["Tetap 15,5%", "Naik ke ~19%", "Turun ke 10%", "Jadi 0"], "correct": 1, "explanation": "Benar: 15,5% → 19%. Diversifikasi menguap — correlation breakdown."}, {"question": "Mengapa korelasi saja tidak cukup untuk risiko?", "options": ["Cukup sebenarnya", "Korelasi hanya linear & tidak stabil; bentuk dependensi ekor butuh lebih (copula)", "Korelasi sulit dihitung", "Korelasi selalu 0"], "correct": 1, "explanation": "Benar: krisis 2008 = pelajaran bahwa dependensi ekor ≠ korelasi linear. Lanjut ke B10."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B9 — Probabilitas</span>
        <h1 className="display-title">Joint, Kovarians &amp; Bivariat Normal:<br/>Ketika Dua Variabel Bergerak Bersama</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Diversifikasi yang Menghilang</a></li>
          <li><a href="#joint">Distribusi Joint &amp; Marginal</a></li>
          <li><a href="#kov">Kovarians &amp; Korelasi — Arah Gerak Bersama</a></li>
          <li><a href="#biv">Bivariat Normal — Kasus Istimewa</a></li>
          <li><a href="#port">Varians Portofolio — Matematika Diversifikasi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Korelasi Nol tapi Dependen!</a></li>
          <li><a href="#lab2">🔬 Lab 2: Correlation Breakdown — Simulasi Krisis</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Joint, Kovarians, Korelasi</a></li>
          <li><a href="#case">📋 Mini-Case: &ldquo;Hedging&rdquo; yang Bukan Hedging</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>distribusi joint</strong> dan menurunkan <strong>marginal</strong> dari joint.</li><li>Menghitung <strong>kovarians &amp; korelasi</strong> dan menafsirkan tandanya dengan benar.</li><li>Menjelaskan <strong>bivariat normal</strong>: kapan &ldquo;tidak berkorelasi = independen&rdquo; berlaku.</li><li>Menghitung <strong>varians portofolio</strong> — mengapa korelasi menentukan diversifikasi.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Diversifikasi yang Menghilang</h2>

      <div className="story"><p>Manajer portofolio membanggakan: <em>&ldquo;Kami diversifikasi ke 20 saham dengan korelasi rata-rata 0,2 — risiko kami rendah.&rdquo;</em> Lalu krisis datang. Korelasi melonjak ke <strong>0,8</strong>. Semua saham jatuh bareng. Diversifikasinya <em>menguap</em> tepat saat paling dibutuhkan.</p><p>Pelajaran pahit 2008: <strong>korelasi bukan konstanta</strong> — ia berubah, dan biasanya naik saat krisis (correlation breakdown). Memahami joint distribution, kovarians, dan batasnya adalah syarat untuk tidak tertipu &ldquo;diversifikasi di atas kertas&rdquo;.</p><p><strong>Twist-nya:</strong> diversifikasi 20 saham, korelasi 0,2 — di atas kertas risiko turun 70%. Tapi korelasi itu diukur saat <em>tenang</em>; saat krisis ia melonjak ke 0,8. Diversifikasi yang dihitung dari masa damai = payung yang hanya pernah diuji saat cerah. Kovarians bukan konstanta alam — ia berubah, dan ia berkhianat tepat saat kamu paling butuh.</p></div>

      <h2 id="joint">Distribusi Joint &amp; Marginal</h2>

      <p><strong>Definisi.</strong> <strong>Joint pmf/pdf</strong> <Tex math={String.raw`p(x,y)`} /> / <Tex math={String.raw`f(x,y)`} /> = peluang (densitas) <Tex math={String.raw`X=x`} /> <em>dan</em> <Tex math={String.raw`Y=y`} /> bersamaan.</p>

      <p><strong>Marginal</strong> — &ldquo;lupakan Y&rdquo;: jumlahkan/integralkan Y keluar:</p>

      <p><Tex math={String.raw`p_X(x) = \sum_y p(x,y), \qquad f_X(x) = \int f(x,y)\,dy`} block /></p>

      <p><strong>Contoh.</strong> Tabel joint (X = telat bayar &#123;0,1&#125;, Y = gagal &#123;0,1&#125;):</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>Y=0</th><th>Y=1</th><th>Marginal X</th></tr></thead>
<tbody>
<tr><td>X=0</td><td>0,90</td><td>0,02</td><td>0,92</td></tr>
<tr><td>X=1</td><td>0,05</td><td>0,03</td><td>0,08</td></tr>
<tr><td>Marginal Y</td><td>0,95</td><td>0,05</td><td>1,00</td></tr>
</tbody>
</table>
</div>

      <p>Marginal X: P(telat) = 0,05+0,03 = 8%. Dari joint, kita dapat P(gagal|telat) = 0,03/0,08 = 37,5% (B3!). <strong>Joint adalah &ldquo;induk&rdquo;</strong> — marginal &amp; bersyarat lahir darinya.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Jika diberi tabel joint, selalu hitung marginal dulu (jumlahkan baris/kolom). Itu &ldquo;cek kewarasan&rdquo;: total harus 1, dan marginal harus cocok dengan yang kamu tahu dari data.</p>
</div>

      <h2 id="kov">Kovarians &amp; Korelasi — Arah Gerak Bersama</h2>

      <p><Tex math={String.raw`\mathrm{Cov}(X,Y) = E\big[(X-E[X])(Y-E[Y])\big] = E[XY] - E[X]E[Y]`} block /></p>

      <ul>
<li><Tex math={String.raw`\mathrm{Cov} > 0`} />: cenderung bergerak <strong>searah</strong> (sama-sama di atas/di bawah mean).</li>
<li><Tex math={String.raw`\mathrm{Cov} < 0`} />: cenderung <strong>berlawanan arah</strong>.</li>
<li><Tex math={String.raw`\mathrm{Cov} = 0`} />: <strong>tidak berkorelasi</strong> — TAPI belum tentu independen! (lihat miskonsepsi)</li>
</ul>

      <p><strong>Korelasi</strong> = kovarians yang dinormalisasi (tak bersatuan, −1 s/d 1):</p>

      <p><Tex math={String.raw`\rho_{X,Y} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X\,\sigma_Y}`} block /></p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Data 4 kuartal: return saham A dan B (dalam %): (2,3), (4,5), (−2,−1), (0,1).</p><p><strong>Langkah 1</strong> — mean: Ā=1, B̄=2.</p><p><strong>Langkah 2</strong> — deviasi: A:(1,3,−3,−1), B:(1,3,−3,−1).</p><p><strong>Langkah 3</strong> — Cov = (1×1 + 3×3 + (−3)(−3) + (−1)(−1))/4 = 20/4 = <strong>5</strong>.</p><p><strong>Langkah 4</strong> — σ_A = σ_B = √5 → ρ = 5/5 = <strong>1,0</strong> (di contoh mainan ini keduanya bergerak searah sempurna).</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Kovarians nol berarti independen.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Salah! Nol kovarians = tidak ada hubungan <em>linear</em>. Contoh klasik: <Tex math={String.raw`X \sim`} /> simetris di [−1,1], <Tex math={String.raw`Y = X^2`} /> — Y sepenuhnya ditentukan X (sangat dependen!) tapi Cov(X,Y) = 0. <strong>Independen → kovarians nol, tapi tidak sebaliknya.</strong> Untuk deteksi dependensi non-linear butuh alat lain (copula/B10, mutual information).</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Korelasi hanya mengukur hubungan <strong>linear</strong>. Dua variabel bisa berkorelasi 0 tapi berhubungan kuat (non-linear), atau berkorelasi 0,9 tapi hubungannya tidak kausal (confounder — ingat Simpson di A1.6).</p>
</div>

      <h2 id="biv">Bivariat Normal — Kasus Istimewa</h2>

      <p>Jika (X,Y) bivariat normal dengan korelasi <Tex math={String.raw`\rho`} />:</p>

      <ul>
<li>Marginal X dan Y masing-masing <strong>normal</strong> (univariat).</li>
<li><Tex math={String.raw`\rho = 0`} /> ⟺ <strong>independen</strong> — SATU-SATUNYA kasus umum di mana &ldquo;tidak berkorelasi = independen&rdquo;!</li>
<li>Distribusi bersyarat juga normal: <Tex math={String.raw`Y|X=x`} /> ~ Normal dengan mean <Tex math={String.raw`\mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(x-\mu_X)`} /> — ini <strong>regresi linear</strong> dalam bentuk probabilistik (fondasi A3.1!).</li>
</ul>

      <p><strong>Kepribadian:</strong> bivariat normal adalah &ldquo;warga teladan&rdquo; — semua sifat bagus (marginal normal, kondisional normal, ρ=0 ⟺ independen). Masalahnya: <strong>data keuangan nyata bukan warga teladan</strong> (ekor tebal, dependensi non-linear) — di situlah copula (B10) masuk.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Marginal normal + korelasi ρ = joint-nya bivariat normal.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Salah dan berbahaya! Marginal tidak menentukan joint — ada tak berhingga joint dengan marginal & korelasi yang sama tapi bentuk dependensi beda (inilah yang ditemukan copula). Pra-2008, model CDO memakai korelasi Gaussian dan mengasumsikan joint Gaussian — salah di ekor, dan ekor itulah yang meledak.</p>
</div>

      <h2 id="port">Varians Portofolio — Matematika Diversifikasi</h2>

      <p><Tex math={String.raw`\mathrm{Var}(w_1X_1 + w_2X_2) = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2\,w_1w_2\,\rho\,\sigma_1\sigma_2`} block /></p>

      <p><strong>Contoh.</strong> Dua aset, σ=20% masing-masing, bobot 50/50:</p>

      <ul>
<li>ρ = 0,2 → Var = 0,25×0,04×2 + 2×0,25×0,2×0,04 = 0,024 → SD = <strong>15,5%</strong> (&lt; 20%: diversifikasi bekerja).</li>
<li>ρ = 0,8 → SD = <strong>19,0%</strong> (hampir tidak ada manfaat diversifikasi!).</li>
<li>ρ = −0,5 → SD = <strong>10%</strong> (lindung nilai alami).</li>
</ul>

      <p><strong>Interpretasi:</strong> satu-satunya &ldquo;free lunch&rdquo; di keuangan adalah korelasi rendah — dan ia bisa hilang saat krisis. Inilah mengapa stress test memakai korelasi <em>stress</em>, bukan korelasi normal.</p>

      <PlotlyChart
  data={chart1}
  title="Korelasi Positif vs Negatif (sketsa)"
  layout={{"xaxis": {"title": "X", "domain": [0, 0.45]}, "yaxis": {"title": "Y"}, "xaxis2": {"title": "X", "domain": [0.55, 1]}, "yaxis2": {"title": "Y", "anchor": "x2"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua panel: kiri X-Y naik bersama (ρ positif), kanan X naik Y turun (ρ negatif).</p>
<p><strong>Interpretasi:</strong> Korelasi = &ldquo;kecenderungan bergerak searah/berlawanan&rdquo; — <strong>bukan</strong> &ldquo;sebab-akibat&rdquo; dan <strong>bukan</strong> &ldquo;keeratan&rdquo; dalam arti umum (non-linear lolos). Untuk diversifikasi: cari pasangan kanan (negatif/rendah).</p>
</div>

      <PlotlyChart
  data={chart2}
  title="SD Portofolio 50/50: Korelasi Menentukan Segalanya"
  layout={{"yaxis": {"title": "SD portofolio", "tickformat": ".0%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga skenario korelasi untuk portofolio yang sama (dua aset σ=20%).</p>
<p><strong>Interpretasi:</strong> Asetnya sama, bobotnya sama — hanya korelasi beda, risiko nyaris 2x lipat (10% → 19%). <strong>Korelasi adalah parameter risiko terpenting sekaligus tersulit diestimasi</strong> — dan ia tidak stabil (cerita pembuka). Jangan percaya diversifikasi tanpa stress korelasi.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Kovarians = &ldquo;apakah mereka bergerak bareng&rdquo; — dalam angka.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Kovarians dari tabel 2×2</summary>
              <p>X, Y ∈ &lbrace;0, 1&rbrace;. P(0,0)=0,4; P(0,1)=0,1; P(1,0)=0,1; P(1,1)=0,4. Hitung Cov(X,Y) dan korelasinya.</p>
              <p><strong>Langkah 1</strong> — E[X] = E[Y] = 0,5. E[XY] = P(1,1) = 0,4.<br />
              <strong>Langkah 2</strong> — Cov = E[XY] − E[X]E[Y] = 0,4 − 0,25 = <strong>0,15 &gt; 0</strong> (bergerak searah).<br />
              <strong>Langkah 3</strong> — Var(X) = Var(Y) = 0,25 → ρ = 0,15/0,25 = <strong>0,6</strong>.</p>
              <p>Pelajaran: kovarians positif = &ldquo;diagonal utama&rdquo; tabel lebih penuh. Rumus Cov = E[XY]−E[X]E[Y] bekerja untuk semua distribusi joint.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Varians portofolio 2 aset</summary>
              <p>Aset A: σ = 20%; B: σ = 20%; bobot 50:50. Bandingkan risiko portofolio untuk ρ = 0,2 vs ρ = 0,8.</p>
              <p><strong>Langkah 1</strong> — Var = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂ = 0,01 + 0,01 + 2×0,25×ρ×0,04 = 0,02(1+ρ).<br />
              <strong>Langkah 2</strong> — ρ = 0,2: Var = 0,024 → σ<sub>p</sub> = <strong>15,5%</strong> (diversifikasi bekerja: &lt; 20%).<br />
              <strong>Langkah 3</strong> — ρ = 0,8: Var = 0,036 → σ<sub>p</sub> = <strong>19,0%</strong> — hampir tidak ada manfaat diversifikasi!</p>
              <p>Pelajaran: manfaat diversifikasi = fungsi korelasi. Inilah aritmetika di balik &ldquo;diversifikasi menguap saat krisis&rdquo; (cerita pembuka): ρ naik 0,2→0,8 menghapus 2/3 manfaatnya.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Korelasi nol ≠ independen</summary>
              <p>X ~ Uniform(−1, 1), Y = X². Hitung korelasinya. Apakah X dan Y independen?</p>
              <p><strong>Langkah 1</strong> — E[X] = 0 (simetris). E[XY] = E[X³] = 0 (simetris). Cov = 0 − 0 = <strong>0</strong> → ρ = 0.<br />
              <strong>Langkah 2</strong> — independen? Tidak! Y <em>ditentukan</em> X (Y = X²) — dependensi sempurna tapi non-linear.<br />
              <strong>Langkah 3</strong> — P(Y &lt; 0,25 | X = 0) = 1 vs P(Y &lt; 0,25) = 0,5 — pengetahuan X mengubah distribusi Y.</p>
              <p>Pelajaran: korelasi hanya menangkap hubungan <em>linear</em>. ρ = 0 tidak berarti &ldquo;tidak berhubungan&rdquo; — bisa berarti &ldquo;berhubungan secara non-linear&rdquo;. Untuk dependensi umum: copula (B10).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Korelasi Nol tapi Dependen!</h2>

      <p>X simetris, Y = X². Hitung korelasi (≈0!) padahal Y sepenuhnya ditentukan X.</p>

      <PyodideLab
  title="Lab 1 — Bukti Kovarians Nol ≠ Independen"
  hint="Inilah mengapa eksplorasi butuh &lt;strong>scatterplot&lt;/strong> (A1.8), bukan cuma angka korelasi."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Correlation Breakdown — Simulasi Krisis</h2>

      <p>Portofolio 2 aset. Bandingkan SD portofolio saat ρ=0,2 (normal) vs ρ=0,8 (krisis).</p>

      <PyodideLab
  title="Lab 2 — Diversifikasi Menguap"
  hint="Stress test yang benar: hitung ulang risiko dengan &lt;strong>ρ krisis&lt;/strong>, bukan ρ historis normal."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Joint, Kovarians, Korelasi</h2>

      <div className="decision-card">
<h3>1. Punya tabel joint → <strong>hitung marginal dulu</strong></h3>
<p><strong>Kondisi data:</strong> Data peluang gabungan dua variabel.</p>
<p><strong>Kenapa:</strong> Marginal = cek kewarasan + fondasi untuk bersyarat (B3).</p>
<p><strong>Contoh nyata:</strong> P(telat) = 8% dari tabel di atas.</p>
</div>

      <div className="decision-card">
<h3>2. Mau tahu arah gerak bersama → <strong>korelasi (bukan kovarians mentah)</strong></h3>
<p><strong>Kondisi data:</strong> Dua variabel numerik.</p>
<p><strong>Kenapa:</strong> Kovarians bersatuan (sulit tafsir); korelasi −1..1, sebanding.</p>
<p><strong>Contoh nyata:</strong> ρ return dua saham untuk diversifikasi.</p>
</div>

      <div className="decision-card">
<h3>3. ρ = 0 → <strong>jangan simpulkan independen</strong></h3>
<p><strong>Kondisi data:</strong> Kecuali yakin bivariat normal.</p>
<p><strong>Kenapa:</strong> Nol korelasi = nol hubungan linear saja. Cek scatterplot!</p>
<p><strong>Contoh nyata:</strong> Y = X²: ρ=0 tapi dependen sempurna.</p>
</div>

      <div className="decision-card">
<h3>4. Risiko portofolio → <strong>stress korelasinya</strong></h3>
<p><strong>Kondisi data:</strong> Keputusan berbasis diversifikasi.</p>
<p><strong>Kenapa:</strong> Korelasi naik saat krisis — risiko &ldquo;normal&rdquo; menipu.</p>
<p><strong>Contoh nyata:</strong> Hitung SD portofolio dengan ρ=0,8, bukan 0,2.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Korelasi = arah linear, bukan sebab-akibat, bukan keeratan umum.</li><li>ρ=0 ≠ independen (kecuali bivariat normal).</li><li>Marginal ≠ joint — korelasi saja tidak menentukan bentuk dependensi (→ B10).</li><li>Diversifikasi diuji dengan korelasi <strong>krisis</strong>.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: &ldquo;Hedging&rdquo; yang Bukan Hedging</h2>

      <div className="callout">
<p>Bank &ldquo;melindungi&rdquo; portofolio kredit UKM dengan membeli asuransi yang membayar saat <em>default berkorelasi rendah</em>. Korelasi historis default antar debitur: 0,1. Saat resesi sektoral, korelasi aktual: 0,6.</p><p><strong>Pertanyaan:</strong> apa yang terjadi pada efektivitas &ldquo;hedging&rdquo; ini? Pelajaran umumnya?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Hedge-nya gagal tepat saat dibutuhkan.</strong> Proteksi dihargai dengan asumsi ρ=0,1 (independen-ish) — saat ρ=0,6, klaim datang bergerombol melebihi yang dimodelkan; penyedia proteksi bisa ikut gagal (counterparty risk berkorelasi!). Ini replika mini krisis 2008: <em>model korelasi konstan + ekor Gaussian = bencana</em>.</p><p><strong>Pelajaran umum:</strong> (1) parameter dependensi harus di-stress, bukan diestimasi dari masa tenang; (2) lindung nilai yang bergantung pada korelasi rendah adalah <em>korelasi itu sendiri</em> sebagai risiko — butuh copula dengan tail dependence (B10) untuk memodelkannya jujur.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>X, Y independen, Var(X) = 4, Var(Y) = 9. Berapa Var(2X − Y)?</li>
              <li>Dua aset: σ₁ = 10%, σ₂ = 30%, ρ = −0,5, bobot 50:50. Berapa σ portofolio? Bandingkan dengan rata-rata σ (20%).</li>
              <li>Buktikan: jika Y = aX + b (a &gt; 0), maka ρ(X,Y) = 1 — korelasi sempurna tidak peduli a dan b.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Var(2X−Y) = 4Var(X) + Var(Y) − 4Cov(X,Y) = 16 + 9 − 0 = <strong>25</strong>. (Independen → Cov = 0; koefisien dikuadratkan!)</p>
              <p><strong>2.</strong> Var = 0,0025+0,0225+2×0,25×(−0,5)×0,03 = 0,0175 → σ = <strong>13,2%</strong> &lt; 20% — korelasi negatif = diversifikasi super.</p>
              <p><strong>3.</strong> Cov(X, aX+b) = aVar(X); σ<sub>Y</sub> = |a|σ<sub>X</sub> = aσ<sub>X</sub>; ρ = aVar(X)/(σ<sub>X</sub>·aσ<sub>X</sub>) = <strong>1</strong>. Korelasi buta terhadap skala &amp; lokasi — ia hanya peduli <em>bentuk</em> hubungan linear.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Joint</strong> = induk: marginal (jumlahkan keluar) &amp; bersyarat lahir darinya.</li><li><strong>Korelasi</strong> = kovarians ternormalisasi (−1..1); hanya hubungan <strong>linear</strong>.</li><li><strong>ρ=0 ≠ independen</strong> — kecuali bivariat normal (kasus istimewa).</li><li><strong>Varians portofolio</strong> ditentukan korelasi — dan korelasi naik saat krisis.</li><li><strong>Jangan</strong> percaya diversifikasi tanpa stress korelasi; <strong>jangan</strong> simpulkan independensi dari korelasi nol.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b8-fitting-distribusi" className="btn btn-secondary btn-sm">← ← B8</Link>
        <Link href="/learn/b10-copula" className="btn btn-primary btn-sm">Next: B10 →</Link>
      </div>
    </div>
  );
}

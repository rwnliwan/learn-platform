import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B10CopulaPage() {
  const chart1 = [{"x": ["Gaussian", "t (ν=4)", "Clayton"], "y": [0.0, 0.35, 0.55], "type": "bar", "marker": {"color": ["#94a3b8", "#e8a838", "#ef4444"]}, "text": ["0", "0,35", "0,55"], "textposition": "outside"}];
  const chart2 = [{"x": [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99], "y": [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75, 0.76, 0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99], "type": "scatter", "mode": "lines", "name": "Independen (diagonal)", "line": {"color": "#94a3b8", "dash": "dash"}}, {"x": [0.01, 0.05, 0.1, 0.2, 0.5], "y": [0.35, 0.42, 0.48, 0.55, 0.68], "type": "scatter", "mode": "lines+markers", "name": "Clayton: P(V≤q|U≤q)", "line": {"color": "#ef4444"}}];
  const lab1Code = String.raw`import random, math
random.seed(101)
N = 200000

def gauss_copula(rho, n):
    pts = []
    for _ in range(n):
        z1, z2 = random.gauss(0,1), random.gauss(0,1)
        x = z1
        y = rho*z1 + math.sqrt(1-rho**2)*z2
        # ke uniform via cdf Normal (aproksimasi)
        pts.append((0.5*(1+math.erf(x/math.sqrt(2))), 0.5*(1+math.erf(y/math.sqrt(2)))))
    return pts

def clayton_copula(theta, n):
    pts = []
    for _ in range(n):
        # Marshall-Olkin untuk Clayton
        u = random.random()
        e = -math.log(random.random())
        s = -math.log(random.random())
        w = (1 + s)**(-1/theta)
        v = (u**(-theta)*(w**(-theta)-1) + 1)**(-1/theta)
        pts.append((u, min(v, 1.0)))
    return pts

g = gauss_copula(0.7, N)
c = clayton_copula(2.0, N)
q = 0.05
pg = sum(1 for u, v in g if u < q and v < q) / sum(1 for u, v in g if u < q)
pc = sum(1 for u, v in c if u < q and v < q) / sum(1 for u, v in c if u < q)
print(f"Gaussian(0.7): P(ikut ekstrem | ekstrem) = {pg:.2%}")
print(f"Clayton(2.0) : P(ikut ekstrem | ekstrem) = {pc:.2%}")
print("\nKorelasi mirip, tapi peluang krisis bersama beda JAUH.")
print("Coba: q=0.01 (lebih ekstrem). Selisih makin besar?")`;
  const lab2Code = String.raw`import random, statistics
random.seed(102)
N = 5000
# X,Y eksponensial berkorelasi (dibangun via Gaussian copula, rho=0.6)
import math
xs, ys = [], []
for _ in range(N):
    z1, z2 = random.gauss(0,1), random.gauss(0,1)
    u = 0.5*(1+math.erf(z1/math.sqrt(2)))
    v = 0.5*(1+math.erf((0.6*z1+0.8*z2)/math.sqrt(2)))
    xs.append(-math.log(1-u))  # Eksponensial(1) via inverse cdf
    ys.append(-2*math.log(1-v)) # Eksponensial(0.5)
# cdf empiris -> uniform
sx, sy = sorted(xs), sorted(ys)
u = [sx.index(x)/N for x in xs]
v = [sy.index(y)/N for y in ys]
print(f"data asli: X miring (mean {statistics.mean(xs):.2f}), Y miring (mean {statistics.mean(ys):.2f})")
print(f"setelah transformasi: U,V ~ Uniform(0,1), mean {statistics.mean(u):.2f}, {statistics.mean(v):.2f}")
# korelasi peringkat (Spearman) vs korelasi linear
mu, mv = statistics.mean(u), statistics.mean(v)
num = sum((a-mu)*(b-mv) for a,b in zip(u,v))
den = (sum((a-mu)**2 for a in u)*sum((b-mv)**2 for b in v))**0.5
print(f"korelasi peringkat (Spearman) U,V = {num/den:.3f}  <- dependensi murni, tanpa pengaruh marginal!")
print("\nCoba: ubah rho 0.6 -> 0.9. Apa yang berubah? (marginal tetap!)")`;
  const quizData = [{"question": "Teorema Sklar: H(x,y) = C(F(x), G(y)). Artinya…", "options": ["Joint = jumlah marginal", "Joint = copula(marginal) — dependensi terpisah dari marginal", "Copula = korelasi", "Marginal tidak penting"], "correct": 1, "explanation": "Benar: pemisahan elegan — bentuk tiap variabel (marginal) bebas dipilih, lalu dipasang struktur dependensi (copula)."}, {"question": "Dosa fatal copula Gaussian untuk risiko kredit…", "options": ["Terlalu rumit", "Tidak punya tail dependence — ekstrem dianggap independen", "Tidak bisa dihitung", "Hanya untuk data normal"], "correct": 1, "explanation": "Benar: λ=0. Default bersama saat krisis = kejadian ekstrem berekor — persis yang tidak ditangkap."}, {"question": "Untuk default bersama (ekor bawah menular), copula paling jujur…", "options": ["Gaussian", "Gumbel", "Clayton", "Independen"], "correct": 2, "explanation": "Benar: Clayton punya tail dependence bawah. Gumbel untuk ekor atas."}, {"question": "Dua portofolio, korelasi sama 0,5, copula beda (Gaussian vs Clayton). Maka…", "options": ["Risiko krisis bersama sama", "Peluang krisis bersama bisa beda jauh", "Clayton selalu lebih aman", "Korelasi salah hitung"], "correct": 1, "explanation": "Benar: korelasi hanya satu angka linear; bentuk ekor ditentukan copula."}, {"question": "Langkah pertama alur kerja copula yang benar…", "options": ["Langsung fit copula Gaussian", "Fit marginal tiap variabel, transformasi ke uniform", "Hitung korelasi Pearson", "Asumsikan independen"], "correct": 1, "explanation": "Benar: marginal dulu (boleh beda keluarga!), baru dependensi di dunia uniform."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B10 — Probabilitas</span>
        <h1 className="display-title">Copula: Memisahkan Bentuk<br/>Marginal dari Ketergantungan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rumus yang &ldquo;Membunuh&rdquo; Wall Street?</a></li>
          <li><a href="#sklar">Teorema Sklar — Pemisahan Elegan</a></li>
          <li><a href="#jenis">Keluarga Copula — Pilih Bentuk Ekornya</a></li>
          <li><a href="#praktek">Copula dalam Praktik — Alur Kerja</a></li>
          <li><a href="#lab1">🔬 Lab 1: Korelasi Sama, Ekor Beda</a></li>
          <li><a href="#lab2">🔬 Lab 2: Transformasi ke Uniform (Cara Kerja Copula)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Copula Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: Audit Model CDO 2007 (Retrospektif)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>teorema Sklar</strong>: joint = marginal + copula (pemisahan).</li><li>Membedakan <strong>copula Gaussian vs t vs Clayton/Gumbel</strong> via tail dependence.</li><li>Menjelaskan <strong>tail dependence</strong> — mengapa krisis butuh copula yang tepat.</li><li>Menafsirkan pelajaran 2008: apa yang salah dari &ldquo;korelasi Gaussian&rdquo;.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Rumus yang &ldquo;Membunuh&rdquo; Wall Street?</h2>

      <div className="story"><p>Tahun 2000, David Li mempublikasikan cara memakai <strong>copula Gaussian</strong> untuk memodelkan default bersama. Rumusnya elegan, mudah dipakai — Wall Street mengadopsinya untuk menilai triliunan dolar CDO. Tahun 2008, semuanya runtuh. <em>Wired</em> menulis: &ldquo;The Formula That Killed Wall Street&rdquo;.</p><p>Apakah rumusnya yang salah? Tidak persis — yang salah adalah <strong>cara pakainya</strong>: korelasi diestimasi dari masa tenang, dan copula Gaussian <strong>tidak punya tail dependence</strong> — ia mengasumsikan kejadian ekstrem terjadi <em>independen</em>. Saat krisis, default datang bergerombol — persis yang tidak bisa ditangkap model itu.</p><p>Lesson ini: apa itu copula, mengapa ia powerful, dan mengapa memilih yang salah bisa bencana.</p><p><strong>Twist-nya:</strong> rumus David Li tidak salah secara matematis — ia salah secara <em>epistemologis</em>: mengasumsikan &ldquo;yang belum pernah terjadi bersama tidak akan terjadi bersama&rdquo;. Copula Gaussian memberi angka NOL pada peluang yang tidak terlihat di data tenang — padahal &ldquo;tidak ada di data&rdquo; ≠ &ldquo;tidak mungkin&rdquo;. Pelajaran termahal di keuangan modern: model tidak boleh mengklaim pengetahuan tentang yang belum diamati.</p></div>

      <h2 id="sklar">Teorema Sklar — Pemisahan Elegan</h2>

      <p><strong>Teorema Sklar:</strong> setiap distribusi joint <Tex math={String.raw`H(x,y)`} /> dengan marginal kontinu <Tex math={String.raw`F(x), G(y)`} /> bisa ditulis:</p>

      <p><Tex math={String.raw`H(x,y) = C\big(F(x),\, G(y)\big)`} block /></p>

      <ul>
<li><Tex math={String.raw`F(x), G(y)`} />: marginal — diubah jadi <strong>uniform [0,1]</strong> (transformasi integral peluang).</li>
<li><Tex math={String.raw`C(u,v)`} />: <strong>copula</strong> — distribusi joint dari dua uniform; murni &ldquo;bentuk ketergantungan&rdquo;, bebas dari bentuk marginal.</li>
</ul>

      <p><strong>Intuisi:</strong> copula memisahkan <em>&ldquo;bagaimana tiap variabel berperilaku sendiri&rdquo;</em> (marginal) dari <em>&ldquo;bagaimana mereka bergerak bersama&rdquo;</em> (copula). Kamu bisa pasang marginal apapun (Normal? Pareto? bebas!) dengan struktur dependensi apapun — LEGO probabilistik.</p>

      <p><strong>Kepribadian:</strong> copula adalah &ldquo;penerjemah&rdquo; — ia bekerja di dunia peringkat/uniform, tidak peduli satuan asli. Korelasi peringkat (Spearman!) hidup alami di sini.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Ingat miskonsepsi B9: &ldquo;marginal + korelasi = joint&rdquo; itu SALAH. Yang benar: <strong>marginal + copula = joint</strong>. Korelasi hanya satu angka; copula adalah seluruh bentuk dependensi.</p>
</div>

      <h2 id="jenis">Keluarga Copula — Pilih Bentuk Ekornya</h2>

      <h3>1. Copula Gaussian</h3>

      <p>Dari bivariat normal: <Tex math={String.raw`C_\rho(u,v) = \Phi_\rho(\Phi^{-1}(u), \Phi^{-1}(v))`} />. <strong>Tidak punya tail dependence</strong>: <Tex math={String.raw`\lambda = 0`} /> — kejadian ekstrem (hampir) independen. Inilah dosa 2008.</p>

      <h3>2. Copula t</h3>

      <p>Dari bivariat t: punya <strong>tail dependence simetris</strong> <Tex math={String.raw`\lambda > 0`} /> — ekstrem atas &amp; bawah cenderung bareng. Makin kecil ν, makin kuat.</p>

      <h3>3. Clayton &amp; Gumbel (Archimedean)</h3>

      <ul>
<li><strong>Clayton:</strong> tail dependence <strong>bawah</strong> saja — cocok untuk default bersama / crash bersama (risiko kredit!).</li>
<li><strong>Gumbel:</strong> tail dependence <strong>atas</strong> saja — cocok untuk kejadian besar bersama (klaim bencana, lonjakan).</li>
</ul>

      <p><strong>Tail dependence</strong> <Tex math={String.raw`\lambda`} />:</p>

      <p><Tex math={String.raw`\lambda_{\text{bawah}} = \lim_{q \to 0} P(V \le q \mid U \le q)`} block /></p>

      <p>&ldquo;Jika satu variabel ekstrem bawah, berapa peluang yang lain ikut ekstrem bawah?&rdquo; Gaussian: → 0. Clayton: &gt; 0.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Korelasi 0,5 = dependensi 0,5, apapun copulanya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Korelasi linear yang sama bisa berasal dari copula Gaussian (ekor independen), t (ekor bareng), atau Clayton (bawah bareng) — dengan <strong>implikasi risiko sangat beda</strong>. Dua portofolio dengan korelasi &ldquo;sama&rdquo; bisa punya peluang krisis bersama yang beda 10x lipat. Inilah mengapa copula ada.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Untuk risiko kredit (default bersama = ekor <em>bawah</em>), copula Clayton/Gumbel-rotated lebih jujur dari Gaussian. Untuk return saham (crash bersama), copula t. Gaussian hanya untuk masa tenang — dan masa tenang bukan saat kamu butuh model.</p>
</div>

      <h2 id="praktek">Copula dalam Praktik — Alur Kerja</h2>

      <ol>
<li><strong>Fit marginal</strong> tiap variabel (B8): F₁, F₂ — boleh beda keluarga!</li>
<li><strong>Transformasi ke uniform:</strong> uᵢ = F₁(xᵢ), vᵢ = G(yᵢ) — sekarang hidup di kotak [0,1]².</li>
<li><strong>Pilih &amp; fit copula:</strong> dari pola scatter (u,v) + tail dependence yang dibutuhkan; estimasi parameter via MLE.</li>
<li><strong>Validasi:</strong> bandingkan frekuensi kejadian bersama ekstrem (empiris vs model) — <em>di ekor</em>, bukan di tengah.</li>
</ol>

      <p><strong>Hubungan ke Vasicek (B13):</strong> model Vasicek sebenarnya memakai <em>struktur Gaussian</em> satu faktor — pahami batasnya dari lesson ini sebelum percaya hasilnya.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Copula = alat curang untuk menaikkan korelasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Copula bukan tentang &ldquo;menaikkan angka&rdquo; — ia tentang <em>bentuk</em>. Bahkan dengan korelasi sama, copula yang tepat mengubah peluang kejadian bersama ekstrem secara dramatis. Yang &ldquo;curang&rdquo; adalah memakai Gaussian dan berharap ekor baik-baik saja.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Tail Dependence Bawah: Gaussian vs t vs Clayton"
  layout={{"xaxis": {"title": "Copula (korelasi disamakan)"}, "yaxis": {"title": "λ bawah"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga copula dengan korelasi linear SAMA; batang = peluang &ldquo;ikut jatuh&rdquo; saat satu ekstrem bawah.</p>
<p><strong>Interpretasi:</strong> Korelasi sama, nasib beda: Gaussian bilang &ldquo;ekstrem tidak menular&rdquo; (λ=0), Clayton bilang 55% menular. <strong>Model 2008 memakai yang kiri untuk risiko yang perilakunya seperti kanan.</strong> Inilah &ldquo;formula yang membunuh&rdquo; — bukan rumusnya, tapi pilihannya.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Clayton: Makin Ekstrem, Makin Menular"
  layout={{"xaxis": {"title": "q (ambang ekstrem)"}, "yaxis": {"title": "P(ikut ekstrem | satu ekstrem)"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = seberapa ekstrem ambangnya (makin kiri makin ekstrem); sumbu Y = peluang bersyarat ikut ekstrem.</p>
<p><strong>Interpretasi:</strong> Pada Clayton, makin ekstrem kejadiannya, makin besar peluang menularnya (naik ke kiri) — <strong>kebalikan dari intuisi &ldquo;kejadian langka itu independen&rdquo;</strong>. Inilah pola krisis finansial: yang &ldquo;1-in-100-tahun&rdquo; datang bergerombol.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Copula = &ldquo;lem&rdquo; yang menempelkan marginal menjadi joint.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Sklar — pisahkan marginal dari dependensi</summary>
              <p>X ~ Eksponensial(1), Y ~ Eksponensial(1), dihubungkan copula Gaussian ρ = 0,5. Apa distribusi marginal X? Apa yang diatur copula?</p>
              <p><strong>Langkah 1</strong> — marginal: X tetap <strong>Eksponensial(1)</strong> — copula tidak mengubah marginal sama sekali (teorema Sklar).<br />
              <strong>Langkah 2</strong> — copula mengatur <em>peringkat</em>: P(X besar DAN Y besar) lebih tinggi dari independen.<br />
              <strong>Langkah 3</strong> — konstruksi: Z₁, Z₂ ~ Normal korelasi 0,5 → U = Φ(Z₁), V = Φ(Z₂) → X = −ln(1−U), Y = −ln(1−V).</p>
              <p>Pelajaran: copula memisahkan dua keputusan modeling: &ldquo;distribusi tiap variabel&rdquo; (marginal) vs &ldquo;cara mereka bergerak bareng&rdquo; (copula). Campur keduanya = model kaku.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Tail dependence — Gaussian vs t vs Clayton</summary>
              <p>Dua obligasi, masing-masing P(default) = 5%. Bandingkan P(keduanya default) di bawah: independen, Gaussian copula (ρ=0,5), Clayton (θ=2).</p>
              <p><strong>Langkah 1</strong> — independen: 0,05² = <strong>0,25%</strong>.<br />
              <strong>Langkah 2</strong> — Gaussian ρ=0,5: ≈ <strong>0,9%</strong> (naik, tapi tail dependence = 0 — kejadian <em>sangat</em> ekstrem tetap &ldquo;hampir independen&rdquo;).<br />
              <strong>Langkah 3</strong> — Clayton θ=2: tail dependence bawah = 2<sup>−1/2</sup> ≈ 0,707 — P(keduanya) ≈ <strong>2,5%</strong>, 10× independen!</p>
              <p>Pelajaran: tiga model dengan marginal &amp; korelasi <em>sama</em> memberi jawaban beda 10× untuk kejadian bersama. Korelasi tidak menentukan perilaku ekor — copula-lah yang menentukan. Inilah yang diabaikan Wall Street 2008.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Fréchet bounds — batas korelasi yang jujur</summary>
              <p>X ~ Bernoulli(0,5), Y ~ Bernoulli(0,9). Berapa korelasi <em>maksimum</em> yang mungkin? (Petunjuk: tidak 1!)</p>
              <p><strong>Langkah 1</strong> — P(X=1, Y=1) ≤ min(P(X=1), P(Y=1)) = 0,5 (Fréchet upper bound).<br />
              <strong>Langkah 2</strong> — E[XY] ≤ 0,5; E[X]E[Y] = 0,45; Cov ≤ 0,05. σ<sub>X</sub> = 0,5; σ<sub>Y</sub> = 0,3.<br />
              <strong>Langkah 3</strong> — ρ<sub>max</sub> = 0,05/(0,5×0,3) = <strong>1/3 ≈ 0,333</strong> — jauh dari 1!</p>
              <p>Pelajaran: korelasi maksimum dibatasi marginal yang berbeda. &ldquo;Korelasi 0,3&rdquo; yang terlihat lemah bisa jadi <em>sudah maksimal</em> untuk marginal tersebut. Jangan baca korelasi tanpa melihat marginalnya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Korelasi Sama, Ekor Beda</h2>

      <p>Simulasikan dua copula dengan korelasi mirip. Hitung P(keduanya &lt; persentil 5%) — lihat bedanya.</p>

      <PyodideLab
  title="Lab 1 — Gaussian vs Clayton (Simulasi)"
  hint="Angka ini = alasan model CDO Gaussian meremehkan risiko 2008."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Transformasi ke Uniform (Cara Kerja Copula)</h2>

      <p>Ambil data miring (eksponensial), transformasi via cdf empiris ke uniform — lihat dependensi &ldquo;telanjang&rdquo;.</p>

      <PyodideLab
  title="Lab 2 — Pisahkan Marginal dari Dependensi"
  hint="Inilah Sklar beraksi: marginal (Eksponensial) dipisahkan, dependensi (ρ=0,6) tetap."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Copula Mana?</h2>

      <div className="decision-card">
<h3>1. Masa tenang / dependensi simetris ringan → <strong>Gaussian</strong></h3>
<p><strong>Kondisi data:</strong> Tidak ada alasan curiga ekor menular.</p>
<p><strong>Kenapa:</strong> Sederhana, mudah dihitung. Tapi tanpa tail dependence!</p>
<p><strong>Contoh nyata:</strong> Operasional harian non-krisis.</p>
</div>

      <div className="decision-card">
<h3>2. Crash bersama dua arah (saham) → <strong>t</strong></h3>
<p><strong>Kondisi data:</strong> Ekstrem atas &amp; bawah sama-sama menular.</p>
<p><strong>Kenapa:</strong> Tail dependence simetris; ν kecil → kuat.</p>
<p><strong>Contoh nyata:</strong> Return portofolio multi-aset saat stress.</p>
</div>

      <div className="decision-card">
<h3>3. Default / gagal bersama (ekor bawah) → <strong>Clayton</strong></h3>
<p><strong>Kondisi data:</strong> Yang menakutkan adalah kejadian buruk bergerombol.</p>
<p><strong>Kenapa:</strong> Tail dependence bawah saja — hemat &amp; tepat sasaran.</p>
<p><strong>Contoh nyata:</strong> Default bersama portofolio kredit (pengganti Vasicek Gaussian).</p>
</div>

      <div className="decision-card">
<h3>4. Lonjakan besar bersama (ekor atas) → <strong>Gumbel</strong></h3>
<p><strong>Kondisi data:</strong> Klaim bencana, spike harga komoditas.</p>
<p><strong>Kenapa:</strong> Tail dependence atas saja.</p>
<p><strong>Contoh nyata:</strong> Asuransi bencana multi-wilayah.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Tanya dulu: <strong>ekor mana yang menular?</strong> Bawah → Clayton, atas → Gumbel, dua-duanya → t, tidak ada → Gaussian.</li><li>Korelasi sama ≠ risiko sama. Selalu tanya copulanya.</li><li>Validasi di <strong>ekor</strong>: bandingkan frekuensi kejadian bersama ekstrem empiris vs model.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Audit Model CDO 2007 (Retrospektif)</h2>

      <div className="callout">
<p>Kamu auditor kuant di 2007. Bank memakai copula Gaussian dengan korelasi default 0,2 (dari data 2003–2006, masa tenang) untuk menilai tranche CDO. Kamu curiga.</p><p><strong>Pertanyaan:</strong> (a) Dua kelemahan fatal apa? (b) Tes/analisis apa yang kamu minta sebelum menyetujui?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Kelemahan 1:</strong> copula Gaussian tanpa tail dependence — default bersama saat krisis tidak tertangkap. <strong>Kelemahan 2:</strong> korelasi dari masa tenang (0,2) — correlation breakdown: saat krisis korelasi melonjak (B9!). Kombinasinya = meremehkan risiko tranche senior secara sistematis.</p><p>(b) <strong>Yang diminta:</strong> (1) ganti/uji copula dengan tail dependence (t/Clayton) dan bandingkan harga tranche; (2) stress korelasi (0,2 → 0,5/0,7); (3) backtest pada periode stress historis (bukan cuma masa tenang); (4) analisis sensitivitas: seberapa besar harga berubah jika asumsi goyah. <strong>Pelajaran abadi:</strong> model dependensi harus diuji di rezim yang relevan dengan keputusan — bukan di rezim yang nyaman.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Sebutkan dua hal yang <em>tidak</em> berubah saat kamu mengganti copula Gaussian menjadi Clayton (marginal tetap).</li>
              <li>Dua saham masing-masing P(turun &gt; 10%) = 10%. Dengan copula t (tail dependence tinggi), apakah P(keduanya turun &gt; 10%) lebih besar atau lebih kecil dari 1%? Mengapa?</li>
              <li>Mengapa mengestimasi korelasi copula dari &ldquo;masa tenang&rdquo; berbahaya untuk pricing CDO? (Jawab dengan konsep tail dependence.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) <strong>Distribusi marginal</strong> tiap variabel — copula tidak menyentuhnya. (b) <strong>Peringkat/korelasi rank</strong> (Spearman) — relatif stabil antar copula; yang berubah drastis adalah perilaku <em>ekor</em>.</p>
              <p><strong>2.</strong> <strong>Lebih besar</strong> dari 1%: tail dependence tinggi = kejadian ekstrem cenderung datang bersamaan. Copula t menangkap &ldquo;jatuh bareng saat krisis&rdquo; yang diabaikan Gaussian.</p>
              <p><strong>3.</strong> Masa tenang tidak mengandung kejadian ekstrem → data tidak memberi informasi tentang tail dependence → Gaussian (tail dep = 0) terlihat &ldquo;cocok&rdquo; padahal ia mengasumsikan justru yang paling penting (default bersama saat krisis) tidak ada. Estimasi butuh data ekor atau asumsi yang eksplisit &amp; konservatif.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Sklar:</strong> joint = copula(marginal) — pisahkan bentuk individu dari ketergantungan.</li><li><strong>Tail dependence (λ):</strong> &ldquo;ekstrem menular?&rdquo; — Gaussian λ=0, t simetris, Clayton bawah, Gumbel atas.</li><li><strong>Pelajaran 2008:</strong> korelasi masa tenang + copula tanpa tail dependence = bencana.</li><li><strong>Alur:</strong> fit marginal → ke uniform → pilih copula sesuai ekor → validasi di ekor.</li><li><strong>Jangan</strong> samakan korelasi dengan dependensi — dan <strong>jangan</strong> validasi model krisis dengan data masa tenang.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b9-joint-kovarians" className="btn btn-secondary btn-sm">← ← B9</Link>
        <Link href="/learn/b11-lln-clt" className="btn btn-primary btn-sm">Next: B11 →</Link>
      </div>
    </div>
  );
}

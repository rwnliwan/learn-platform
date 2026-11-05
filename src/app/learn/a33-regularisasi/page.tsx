"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A33Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const biasVarData = [
    {
      x: ["Underfit (λ besar)", "Seimbang (λ pas)", "Overfit (λ ≈ 0)"],
      y: [38, 12, 35],
      name: "Error di data BARU",
      type: "bar",
      marker: { color: ["#ef4444", "#22c55e", "#ef4444"] },
    },
    {
      x: ["Underfit (λ besar)", "Seimbang (λ pas)", "Overfit (λ ≈ 0)"],
      y: [36, 11, 4],
      name: "Error di data LATIH",
      type: "bar",
      marker: { color: ["#94a3b8", "#94a3b8", "#94a3b8"] },
    },
  ];

  const cvData = [
    {
      x: [0.001, 0.01, 0.1, 1, 10, 100],
      y: [0.31, 0.24, 0.17, 0.14, 0.16, 0.28],
      mode: "lines+markers",
      type: "scatter",
      name: "CV error",
      line: { color: "#2a7de1", width: 3 },
      marker: { color: "#2a7de1", size: 10 },
    },
  ];

  const coefPathData = [
    {
      x: [0.001, 0.01, 0.1, 1, 10, 100],
      y: [2.8, 2.6, 2.2, 1.4, 0.5, 0.08],
      mode: "lines+markers",
      type: "scatter",
      name: "β₁ (pendapatan)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0.001, 0.01, 0.1, 1, 10, 100],
      y: [-1.9, -1.7, -1.2, -0.6, -0.15, 0.0],
      mode: "lines+markers",
      type: "scatter",
      name: "β₂ (rasio utang)",
      line: { color: "#e8a838", width: 3 },
    },
    {
      x: [0.001, 0.01, 0.1, 1, 10, 100],
      y: [0.4, 0.35, 0.2, 0.05, 0.0, 0.0],
      mode: "lines+markers",
      type: "scatter",
      name: "β₃ (noise: no. rumah)",
      line: { color: "#ef4444", width: 3, dash: "dash" },
    },
  ];

  const lab1Code = `# Bias-Variance tradeoff: LIHAT overfitting terjadi
# Model polinomial derajat d memprediksi y dari x.
# Data latih = 15 titik, data uji = 500 titik (tak terlihat saat latih).
import random, math
random.seed(11)

def true_f(x): return math.sin(x * 2.2) * 1.5 + 0.3 * x
xtr = [random.uniform(-3, 3) for _ in range(15)]
ytr = [true_f(x) + random.gauss(0, 0.5) for x in xtr]
xte = [i * 0.03 - 3 for i in range(200)]
yte = [true_f(x) for x in xte]

def polyfit_predict(xs, ys, deg, x):
    # OLS untuk polinomial via eliminasi Gauss (tanpa numpy)
    n = deg + 1
    A = [[sum(xi**(i+j) for xi in xs) for j in range(n)] for i in range(n)]
    b = [sum(y * (xi**i) for xi, y in zip(xs, ys)) for i in range(n)]
    M = [row[:] + [bi] for row, bi in zip(A, b)]
    for c in range(n):
        piv = max(range(c, n), key=lambda r: abs(M[r][c]))
        M[c], M[piv] = M[piv], M[c]
        for r in range(c+1, n):
            f = M[r][c]/M[c][c]
            for k in range(c, n+1): M[r][k] -= f*M[c][k]
    beta = [0]*n
    for i in range(n-1, -1, -1):
        beta[i] = (M[i][n] - sum(M[i][j]*beta[j] for j in range(i+1, n)))/M[i][i]
    return sum(beta[i]*(x**i) for i in range(n))

print(f"{'derajat':>8} | {'err latih':>9} | {'err UJI':>8} | kesimpulan")
print("-"*52)
for d in [1, 3, 9, 14]:
    etr = sum((y - polyfit_predict(xtr, ytr, d, x))**2 for x, y in zip(xtr, ytr))/len(xtr)
    ete = sum((y - polyfit_predict(xtr, ytr, d, x))**2 for x, y in zip(xte, yte))/len(xte)
    tag = "underfit" if d == 1 else ("OK" if d == 3 else "OVERFIT!")
    print(f"{d:>8} | {etr:>9.3f} | {ete:>8.3f} | {tag}")
print()
print("Perhatikan: err latih SELALU turun saat derajat naik,")
print("tapi err UJI turun lalu NAIK - itulah overfitting.")
print("COBA: ubah noise 0.5 -> 1.5. Overfitting makin parah?")`;

  const lab2Code = `# Ridge dari nol: penalti L2 menyusutkan koefisien
# y = 3*x1 - 2*x2 + 0*x3(noise) + error ; x1,x2 berkorelasi kuat (0.9)
import random, math
random.seed(5)
n = 60
x1 = [random.gauss(0, 1) for _ in range(n)]
x2 = [0.9*a + random.gauss(0, 0.44) for a in x1]   # korelasi ~0.9
x3 = [random.gauss(0, 1) for _ in range(n)]          # murni noise
y  = [3*a - 2*b + random.gauss(0, 1) for a, b in zip(x1, x2)]

def ridge(xs_list, y, lam):
    k = len(xs_list); p = k + 1
    X = [[1.0] + [xs[i] for xs in xs_list] for i in range(n)]
    A = [[sum(X[i][a]*X[i][b] for i in range(n)) for b in range(p)] for a in range(p)]
    for a in range(1, p): A[a][a] += lam          # penalti: hanya slope, bukan intersep
    b = [sum(X[i][a]*y[i] for i in range(n)) for a in range(p)]
    M = [row[:] + [bi] for row, bi in zip(A, b)]
    for c in range(p):
        piv = max(range(c, p), key=lambda r: abs(M[r][c]))
        M[c], M[piv] = M[piv], M[c]
        for r in range(c+1, p):
            f = M[r][c]/M[c][c]
            for kk in range(c, p+1): M[r][kk] -= f*M[c][kk]
    beta = [0]*p
    for i in range(p-1, -1, -1):
        beta[i] = (M[i][p] - sum(M[i][j]*beta[j] for j in range(i+1, p)))/M[i][i]
    return beta

print(f"{'lambda':>8} | {'b1':>7} {'b2':>7} {'b3(noise)':>9} | catatan")
print("-"*58)
for lam in [0, 0.5, 2, 10, 50]:
    b0, b1, b2, b3 = ridge([x1, x2, x3], y, lam)
    tag = "OLS: b1,b2 liar (multikolinearitas)" if lam == 0 else ("noise dibunuh" if lam >= 10 else "")
    print(f"{lam:>8} | {b1:>7.2f} {b2:>7.2f} {b3:>9.2f} | {tag}")
print()
print("Kebenaran: b1=3, b2=-2, b3=0. Ridge mengorbankan sedikit bias")
print("demi stabilitas - dan membunuh koefisien noise duluan.")
print("COBA: naikkan korelasi x1-x2 jadi 0.99. Lihat OLS makin liar,")
print("tapi Ridge tetap tenang.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.3 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Regularisasi:<br />Seni Menahan Model yang Terlalu Pintar Menghafal</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model Sempurna di Lab, Bencana di Lapangan</a></li>
          <li><a href="#biasvar">Bias-Variance Tradeoff — Dua Musuh yang Tak Bisa Dikalahkan Bersamaan</a></li>
          <li><a href="#ridge">Ridge — Si Pengerem Halus (L2)</a></li>
          <li><a href="#lasso">Lasso — Si Tukang Seleksi Tegas (L1)</a></li>
          <li><a href="#en">Elastic Net — Jalan Tengah</a></li>
          <li><a href="#cv">Cross-Validation — Memilih λ Tanpa Mencontek</a></li>
          <li><a href="#lab1">🔬 Lab 1: Menyaksikan Overfitting Lahir (Bias-Variance Live)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Ridge dari Nol — Penalti Menjinakkan Koefisien Liar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Ridge, Lasso, atau Elastic Net?</a></li>
          <li><a href="#case">📋 Mini-Case: 200 Variabel, 500 Nasabah — Model Apa?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tradeoff bias-variance dengan dekomposisi error dan mengaitkannya dengan overfitting/underfitting.</li>
          <li>Menuliskan fungsi objektif Ridge, Lasso, dan Elastic Net, dan menjelaskan perbedaan geometris penalti L1 vs L2.</li>
          <li>Memprediksi perilaku koefisien (menyusut vs menjadi nol) untuk tiap metode pada kasus multikolinearitas dan variabel noise.</li>
          <li>Menjalankan cross-validation untuk memilih λ dan menjelaskan mengapa tuning di data latih saja menipu.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Model Sempurna di Lab, Bencana di Lapangan</h2>
      <div className="story">
        <p>Tim data science fintech &ldquo;PinjamYuk&rdquo; merayakan: model PD baru mereka mencapai <strong>akurasi 99,2%</strong> di data latih — mengalahkan semua model lama. CEO langsung minta <em>go live</em>. Dua minggu setelah produksi, tim koleksi panik: prediksi model ngawur total. Nasabah &ldquo;aman&rdquo; menurut model ternyata macet massal.</p>
        <p>Investigasi menemukan: model itu punya <strong>200 variabel untuk 500 nasabah</strong> — termasuk &ldquo;nomor rumah&rdquo;, &ldquo;jumlah huruf nama ibu&rdquo;, dan &ldquo;digit terakhir NIK&rdquo;. Dengan variabel sebanyak itu, OLS bisa menghafal data latih sampai 99,2% — termasuk <em>noise</em>-nya. Model tidak belajar pola; ia <strong>menghafal daftar</strong>.</p>
        <p>Twist-nya: solusinya bukan &ldquo;buang variabel manual satu per satu&rdquo; (200 variabel!), melainkan memberi model <strong>denda otomatis</strong> untuk koefisien yang terlalu besar — itulah regularisasi. Lesson ini tentang cara menahan model yang terlalu pintar menghafal.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="biasvar">Bias-Variance Tradeoff — Dua Musuh yang Tak Bisa Dikalahkan Bersamaan</h2>
      <p><strong>Definisi.</strong> Error model di data baru bisa diurai menjadi tiga komponen:</p>
      <Tex math={String.raw`E[(y - \hat{f}(x))^2] = \underbrace{\text{Bias}^2(\hat{f})}_{\text{kesalahan sistematis}} + \underbrace{\text{Var}(\hat{f})}_{\text{kegoyangan antar sampel}} + \underbrace{\sigma^2}_{\text{noise tak terhindarkan}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\text{Bias}`} />: seberapa jauh <em>rata-rata</em> prediksi model dari kebenaran — model terlalu sederhana (misal garis lurus untuk hubungan melengkung) punya bias tinggi = <strong>underfit</strong></li>
        <li><Tex math={String.raw`\text{Var}`} />: seberapa goyang prediksi jika dilatih di sampel berbeda — model terlalu kompleks menghafal noise tiap sampel = <strong>overfit</strong></li>
        <li><Tex math={String.raw`\sigma^2`} />: noise murni yang tidak bisa dihilangkan model apapun — batas bawah error</li>
      </ul>
      <p>Tradeoff-nya: menaikkan kompleksitas <strong>menurunkan bias tapi menaikkan variance</strong>. Model terbaik duduk di lembah di antara keduanya — tidak terlalu kaku, tidak terlalu liar.</p>

      <PlotlyChart
        data={biasVarData}
        title="Error Latih vs Error di Data Baru: Tanda Overfitting"
        layout={{ barmode: "group", yaxis: { title: "Error" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga tingkat kompleksitas model; batang abu-abu = error di data latih, batang berwarna = error di data baru (yang menentukan).</p>
        <p><strong>Interpretasi:</strong> model overfit (kanan) punya error latih <em>terkecil</em> (4) tapi error di data baru <em>terbesar</em> (35) — ia menghafal, bukan belajar. Model seimbang (tengah) tidak terbaik di data latih, tapi terbaik di data baru. <strong>Tanda overfitting selalu sama: jurang menganga antara performa latih dan performa di data baru.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bayangkan memanah. <strong>Bias tinggi</strong> = semua anak panah mengelompok rapat tapi jauh dari sasaran (konsisten salah — model terlalu sederhana). <strong>Variance tinggi</strong> = anak panah menyebar ke mana-mana di sekitar sasaran (rata-rata benar, tapi tiap tembakan ngawur — model terlalu kompleks). Regularisasi mengorbankan <em>sedikit</em> bias untuk memangkas <em>banyak</em> variance.</p>
      </div>

      <h2 id="ridge">Ridge — Si Pengerem Halus (L2)</h2>
      <p><strong>Definisi.</strong> Ridge menambahkan <strong>denda</strong> (<em>penalty</em>) proporsional terhadap jumlah kuadrat koefisien ke fungsi objektif OLS:</p>
      <Tex math={String.raw`\min_{\beta} \sum_{i=1}^{n}(y_i - \hat{y}_i)^2 + \lambda \sum_{j=1}^{k} \beta_j^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\lambda \geq 0`} /> (lambda): <strong>parameter regularisasi</strong> — tombol &ldquo;seberapa keras remnya&rdquo;. <Tex math={String.raw`\lambda = 0`} /> = OLS biasa; <Tex math={String.raw`\lambda \to \infty`} /> = semua koefisien → 0</li>
        <li><Tex math={String.raw`\sum \beta_j^2`} />: penalti L2 — menghukum koefisien besar secara kuadratik (koefisien 10 didenda 100× lipat dari koefisien 1)</li>
        <li>Intersep <Tex math={String.raw`\beta_0`} /> <strong>tidak</strong> didenda (kita tidak peduli garisnya tinggi/rendah, hanya peduli slope-nya liar atau tidak)</li>
      </ul>
      <p>Solusi tertutupnya:</p>
      <Tex math={String.raw`\hat{\beta}^{ridge} = (X'X + \lambda I)^{-1}X'y`} block />
      <p>Perhatikan: <Tex math={String.raw`\lambda I`} /> ditambahkan ke <Tex math={String.raw`X'X`} /> — secara ajaib ini juga <strong>menyelesaikan masalah multikolinearitas</strong> (matriks yang tadinya hampir singular jadi invertible dan stabil).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: efek λ pada koefisien</summary>
        <p>Data: <Tex math={String.raw`y = 3x_1 - 2x_2 + \varepsilon`} />, <Tex math={String.raw`x_1, x_2`} /> berkorelasi 0,9, plus <Tex math={String.raw`x_3`} /> = noise murni.</p>
        <p><strong>λ = 0 (OLS):</strong> b₁ = 5,8, b₂ = −4,5, b₃ = 0,7 — liar! (multikolinearitas membuat OLS bingung membagi jasa)<br />
        <strong>λ = 2:</strong> b₁ = 2,6, b₂ = −1,7, b₃ = 0,2 — mendekati kebenaran (3, −2, 0)<br />
        <strong>λ = 50:</strong> b₁ = 0,9, b₂ = −0,6, b₃ = 0,02 — semua menyusut, tapi tidak ada yang persis nol.</p>
        <p>Ridge <strong>menyusutkan</strong> tapi <strong>tidak menolkan</strong> — semua variabel tetap di model, hanya diperkecil.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> penalti kuadratik membenci <em>satu</em> koefisien raksasa tapi toleran terhadap <em>banyak</em> koefisien kecil (10² = 100 vs sepuluh × 1² = 10). Makanya Ridge <strong>membagi</strong> bobot secara merata ke variabel-variabel yang berkorelasi — cocok saat kamu percaya banyak variabel kecil-kecil berkontribusi (misal puluhan rasio keuangan yang saling berkaitan).</p>
      </div>

      <h2 id="lasso">Lasso — Si Tukang Seleksi Tegas (L1)</h2>
      <p><strong>Definisi.</strong> Lasso memakai penalti <strong>nilai absolut</strong> (L1), bukan kuadrat:</p>
      <Tex math={String.raw`\min_{\beta} \sum_{i=1}^{n}(y_i - \hat{y}_i)^2 + \lambda \sum_{j=1}^{k} |\beta_j|`} block />
      <p>Satu kata yang membedakan: penalti <Tex math={String.raw`|\beta_j|`} /> (bukan <Tex math={String.raw`\beta_j^2`} />). Konsekuensinya dramatis: <strong>Lasso bisa membuat koefisien TEPAT nol</strong> — artinya seleksi variabel otomatis. Dari 200 variabel PinjamYuk, Lasso bisa menolkan 190 dan menyisakan 10 yang benar-benar penting.</p>
      <p><strong>Mengapa L1 menolkan tapi L2 tidak?</strong> Geometrinya: penalti L1 berbentuk belah ketupat (<em>diamond</em>) dengan sudut tajam di sumbu — solusi optimum &ldquo;tersangkut&rdquo; di sudut = salah satu koefisien persis nol. Penalti L2 berbentuk lingkaran mulus — solusi menyentuh lingkaran di titik yang kedua koordinatnya bukan nol. (Tidak perlu dihafal rumusnya; ingat gambarnya: <strong>sudut tajam = seleksi</strong>.)</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Lasso memilih variabel yang benar-benar penting secara kausal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Lasso memilih variabel yang <em>berguna untuk prediksi</em> di sampel ini — bukan yang &ldquo;benar&rdquo; secara teori. Jika dua variabel berkorelasi kuat dan sama-sama penting, Lasso <strong>arbirtrer</strong> memilih satu dan menolkan yang lain (tidak stabil antar sampel!). Untuk interpretasi &ldquo;variabel mana yang penting&rdquo;, perilaku ini berbahaya — yang dipilih bisa berganti tiap kali data di-refresh.</p>
      </div>

      <h2 id="en">Elastic Net — Jalan Tengah</h2>
      <p><strong>Definisi.</strong> Kombinasi keduanya:</p>
      <Tex math={String.raw`\min_{\beta} SSR + \lambda \left[ \alpha \sum |\beta_j| + (1-\alpha) \sum \beta_j^2 \right]`} block />
      <ul>
        <li><Tex math={String.raw`\alpha = 1`} /> = Lasso murni; <Tex math={String.raw`\alpha = 0`} /> = Ridge murni; di antaranya = campuran</li>
        <li>Mewarisi seleksi variabel dari Lasso <strong>plus</strong> stabilitas Ridge untuk variabel berkorelasi (tidak lagi memilih arbitrer satu-dua)</li>
      </ul>
      <p><strong>Kapan dipakai:</strong> banyak variabel berkorelasi berkelompok (misal 30 rasio keuangan dalam 5 kelompok tema) dan kamu ingin seleksi <em>per kelompok</em> yang stabil — Lasso murni terlalu acak, Ridge murni tidak menyeleksi.</p>

      <PlotlyChart
        data={coefPathData}
        title="Coefficient Path: Koefisien Menyusut seiring λ Membesar"
        layout={{ xaxis: { title: "λ (skala log)", type: "log" }, yaxis: { title: "Nilai koefisien" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = λ (makin kanan = penalti makin keras, skala log), vertikal = nilai koefisien tiap variabel, garis merah putus-putus = variabel noise.</p>
        <p><strong>Interpretasi:</strong> saat λ membesar, semua koefisien menyusut menuju nol — tapi <strong>variabel noise (merah) mati duluan</strong>, sementara variabel asli bertahan lebih lama. Inilah cara membaca &ldquo;urutan kepentingan&rdquo; variabel dari coefficient path: yang mati terakhir = paling penting. λ optimal dipilih via cross-validation (bagian berikut).</p>
      </div>

      <h2 id="cv">Cross-Validation — Memilih λ Tanpa Mencontek</h2>
      <p><strong>Definisi.</strong> Cross-validation (CV) memilih <Tex math={String.raw`\lambda`} /> dengan menguji tiap kandidat di data yang <strong>tidak dipakai</strong> untuk fitting:</p>
      <ol>
        <li>Bagi data jadi K lipatan (<em>folds</em>), misal K = 5.</li>
        <li>Untuk tiap kandidat <Tex math={String.raw`\lambda`} />: latih di 4 folds, uji di 1 fold yang disisihkan; ulangi 5× (tiap fold jadi uji sekali).</li>
        <li>Pilih <Tex math={String.raw`\lambda`} /> dengan <strong>rata-rata error uji terkecil</strong>.</li>
      </ol>
      <p>Aturan praktis <strong>&ldquo;one-standard-error&rdquo;</strong>: pilih <Tex math={String.raw`\lambda`} /> <em>terbesar</em> (model tersederhana) yang errornya masih dalam 1 SE dari error minimum — mengorbankan sedikit akurasi demi kesederhanaan dan stabilitas.</p>

      <PlotlyChart
        data={cvData}
        title="Kurva Validasi: Error CV vs λ (bentuk U)"
        layout={{ xaxis: { title: "λ (skala log)", type: "log" }, yaxis: { title: "Rata-rata error CV" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = λ (skala log), vertikal = rata-rata error cross-validation.</p>
        <p><strong>Interpretasi:</strong> kurva berbentuk <strong>U</strong> — inilah bias-variance tradeoff yang terlihat! Kiri (λ kecil): overfit, error tinggi (variance). Kanan (λ besar): underfit, error tinggi (bias). Lembah di λ ≈ 1 = titik seimbang. Inilah mengapa tuning λ tidak bisa ditebak — harus diukur.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pilih λ yang error latihnya terkecil.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> error latih <em>selalu</em> terkecil di λ = 0 (tanpa penalti) — itu justru overfitting, bukan prestasi. λ harus dipilih dari <strong>error di data yang tidak terlihat saat fitting</strong> (CV atau holdout). Menyetel hyperparameter di data latih = mencontek soal ujian yang sama dengan PR — nilainya bagus, pemahamannya nol.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Scaling wajib sebelum regularisasi!</strong> Penalti <Tex math={String.raw`\sum \beta_j^2`} /> menghukum koefisien berdasarkan <em>angkanya</em> — variabel dalam rupiah (jutaan) vs dalam persen akan diperlakukan tidak adil. Selalu <strong>standarkan</strong> prediktor (<Tex math={String.raw`z = (x-\bar{x})/s`} />) sebelum Ridge/Lasso/Elastic Net, atau λ mendenda variabel berskala besar secara tidak proporsional.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Regularisasi = &ldquo;rem untuk model yang terlalu pintar menghafal&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Ridge vs Lasso — 50 fitur berkorelasi</summary>
              <p>50 fitur, banyak yang berkorelasi. OLS: train R² 0,95, test 0,60 (overfit!). Bandingkan Ridge &amp; Lasso.</p>
              <p><strong>Langkah 1 (Ridge, L2)</strong> — menyusutkan <em>semua</em> koefisien (tidak ada yang nol): test R² → 0,78. Stabil, tapi 50 fitur tetap dipakai.<br />
              <strong>Langkah 2 (Lasso, L1)</strong> — memaksa banyak koefisien <em>tepat nol</em>: 12 fitur tersisa, test R² → 0,80. Bonus: seleksi fitur otomatis!<br />
              <strong>Langkah 3</strong> — pilih λ via CV. Aturan praktis: butuh <em>interpretasi/seleksi</em> → Lasso; butuh <em>stabilitas</em> (fitur berkorelasi berbagi bobot) → Ridge; ragu → Elastic Net.</p>
              <p>Pelajaran: regularisasi = &ldquo;bayar pajak kompleksitas&rdquo;. λ = seberapa mahal pajaknya — dipilih dari data (CV), bukan dari firasat.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Lasso memilih 1 dari 2 kembar</summary>
              <p>Fitur A &amp; B identik (korelasi 1,0). Lasso memilih A (koef 0,8), B = 0. Ridge: A = B = 0,4. Mana yang &ldquo;benar&rdquo;?</p>
              <p><strong>Langkah 1</strong> — prediksi: <em>identik</em> (0,8×A = 0,4×A + 0,4×B jika A=B). Tidak ada yang &ldquo;lebih benar&rdquo; untuk prediksi.<br />
              <strong>Langkah 2</strong> — interpretasi: Lasso <em>arbitrer</em> (bisa A bisa B tergantung noise!) — jangan klaim &ldquo;fitur A yang penting, B tidak&rdquo;!<br />
              <strong>Langkah 3</strong> — jika butuh stabilitas interpretasi dengan fitur berkorelasi → Ridge/Elastic Net.</p>
              <p>Pelajaran: seleksi Lasso ≠ &ldquo;kebenaran&rdquo;. Ia alat prediksi + kompresi, bukan alat inferensi kausal. Untuk &ldquo;variabel mana yang penting&rdquo; → butuh desain inferensi, bukan Lasso buta.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Menyaksikan Overfitting Lahir (Bias-Variance Live)</h2>
      <p>Naikkan derajat polinomial dan saksikan error latih turun terus sementara error uji berbalik naik.</p>
      <PyodideLab
        title="Lab 1 — Bias-Variance Tradeoff Live"
        hint="Coba: naikkan noise 0.5 → 1.5. Derajat berapa yang kini optimal? Noise besar = overfitting datang lebih cepat."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Ridge dari Nol — Penalti Menjinakkan Koefisien Liar</h2>
      <p>Implementasi Ridge murni dari rumus <Tex math={String.raw`(X'X+\lambda I)^{-1}X'y`} />. Lihat OLS liar vs Ridge tenang.</p>
      <PyodideLab
        title="Lab 2 — Ridge Regression dari Nol (Pure Python)"
        hint="Coba: naikkan korelasi x1-x2 jadi 0.99 (0.9*a + gauss(0,0.14)). OLS makin gila, Ridge tetap waras."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Ridge, Lasso, atau Elastic Net?</h2>

      <div className="decision-card">
        <h3>1. Banyak variabel berkorelasi, semua mungkin penting → <strong>Ridge</strong></h3>
        <p><strong>Kondisi:</strong> puluhan rasio keuangan yang saling berkaitan; tidak ada alasan membuang satupun.</p>
        <p><strong>Kenapa:</strong> Ridge membagi bobot merata, stabil terhadap multikolinearitas, tidak membuang informasi.</p>
        <p><strong>Contoh nyata:</strong> model LGD dengan 25 rasio laporan keuangan yang berkorelasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ratusan variabel, curiga hanya sedikit yang penting → <strong>Lasso</strong></h3>
        <p><strong>Kondisi:</strong> p besar, n kecil/sedang; butuh model ramping yang bisa dijelaskan ke regulator.</p>
        <p><strong>Kenapa:</strong> seleksi otomatis — menolkan yang tidak berguna. Model akhir spars dan interpretable.</p>
        <p><strong>Contoh nyata:</strong> 200 kandidat variabel perilaku transaksi → 12 variabel final untuk scorecard.</p>
      </div>

      <div className="decision-card">
        <h3>3. Variabel berkorelasi berkelompok + butuh seleksi → <strong>Elastic Net</strong></h3>
        <p><strong>Kondisi:</strong> variabel-variabel membentuk kelompok tema berkorelasi; Lasso murni memilih acak di dalam kelompok.</p>
        <p><strong>Kenapa:</strong> seleksi per kelompok yang stabil — tidak menolkan arbitrer satu dari dua variabel kembar.</p>
        <p><strong>Contoh nyata:</strong> 5 kelompok rasio (likuiditas, leverage, profitabilitas...) — ingin tahu kelompok mana yang penting.</p>
      </div>

      <div className="decision-card">
        <h3>4. n besar, p kecil, asumsi terpenuhi → <strong>OLS biasa saja</strong></h3>
        <p><strong>Kondisi:</strong> 10.000 observasi, 5 variabel yang dipilih dengan teori.</p>
        <p><strong>Kenapa:</strong> regularisasi mengorbankan ketakbiasan — jika tidak ada masalah variance/multikolinearitas, OLS sudah BLUE. Jangan mengobati penyakit yang tidak ada.</p>
        <p><strong>Contoh nyata:</strong> model klasik dengan variabel teori yang mapan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Standarkan dulu</strong> sebelum penalti — selalu.</li>
          <li>Mau stabilitas → <strong>Ridge</strong>. Mau seleksi → <strong>Lasso</strong>. Mau keduanya → <strong>Elastic Net</strong>.</li>
          <li>λ dipilih dari <strong>CV</strong>, bukan dari error latih. Kurva U = kompasmu.</li>
          <li>Regularisasi = obat variance. Jika masalahmu bias (model terlalu sederhana), tambah fitur — jangan naikkan λ.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: 200 Variabel, 500 Nasabah — Model Apa?</h2>
      <div className="callout">
        <p>Kamu diminta membangun model PD dengan <strong>200 kandidat variabel</strong> (data transaksi, demografi, perilaku digital) tapi hanya <strong>500 nasabah</strong> dengan riwayat default yang lengkap. Atasanmu bilang &ldquo;pakai semua variabel, biar akurat&rdquo;.</p>
        <p>Kamu coba OLS: R² = 0,97 di data latih. Kamu curiga, lalu jalankan 5-fold CV: error CV-nya 3× lipat error latih.</p>
        <p><strong>Pertanyaan:</strong> (a) Diagnosis apa ini? (b) Metode regularisasi apa yang paling tepat dan kenapa? (c) Bagaimana kamu memilih λ-nya, dan apa yang kamu laporkan ke atasan soal R² = 0,97?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Overfitting klasik</strong> (p/n = 200/500 terlalu besar): jurang antara error latih dan error CV adalah tanda tangan hafalan, bukan pembelajaran.</p>
          <p>(b) <strong>Lasso atau Elastic Net.</strong> Dengan 200 variabel campuran (banyak noise seperti &ldquo;digit NIK&rdquo;), kamu butuh <em>seleksi</em> — Ridge tidak membuang variabel. Elastic Net lebih aman karena variabel perilaku cenderung berkorelasi berkelompok (Lasso murni bisa memilih acak). Standarkan semua variabel dulu!</p>
          <p>(c) λ via <strong>5-fold CV</strong> + aturan one-standard-error. Ke atasan: &ldquo;R² = 0,97 itu nilai ujian yang soalnya sudah dibocorkan — model menghafal 500 nasabah. Ukuran jujurnya adalah error CV, dan setelah regularisasi model kita ramping (misal 18 variabel) dengan performa yang <em>terbukti</em> di data tak terlihat.&rdquo;</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Mengapa fitur <em>wajib</em> di-standardize sebelum Ridge/Lasso? (Apa yang terjadi jika tidak?)</li>
              <li>λ → ∞: apa yang terjadi pada koefisien Ridge? Lasso? (Limit.)</li>
              <li>Early stopping pada gradient boosting = regularisasi? Jelaskan analoginya.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Penalti <Tex math={String.raw`\lambda\sum\beta_j^2`} /> buta terhadap <em>skala</em>: fitur 0–1jt &ldquo;terlihat&rdquo; butuh koef kecil → dihukum ringan; fitur 0–1 dihukum berat — <em>tidak adil</em>! Standardize dulu → penalti proporsional. (Tree-based tidak butuh — tidak ada penalti koefisien.)</p>
              <p><strong>2.</strong> Ridge → <strong>0</strong> (semua menyusut, tak ada yang tepat nol). Lasso → <strong>0</strong> juga (semua tepat nol — model = intersep saja!). Beda di λ <em>hingga</em>: Lasso memangkas, Ridge menyusut.</p>
              <p><strong>3.</strong> <strong>Ya</strong> — berhenti sebelum konvergen = membatasi kompleksitas efektif, analog dengan λ &gt; 0. Iterasi = &ldquo;waktu&rdquo; bagi model untuk menghafal; early stopping memotongnya via validasi.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Error latih = 4, error di data baru = 35. Diagnosis dan obat?"
        options={[
          "Underfit — tambah kompleksitas",
          "Overfit (variance tinggi) — sederhanakan model / naikkan regularisasi λ",
          "Noise terlalu kecil",
          "Butuh lebih banyak data latih saja, model sudah benar",
        ]}
        correct={1}
        explanation="Benar: jurang latih-vs-baru = overfitting = variance tinggi. Obatnya mengurangi kompleksitas (naikkan λ, kurangi variabel/derajat). Data tambahan membantu tapi tidak menyembuhkan model yang terlalu kompleks."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dua variabel berkorelasi 0,95, keduanya penting secara teori. Ridge vs Lasso?"
        options={[
          "Lasso — akan memilih satu secara stabil",
          "Ridge — membagi bobot merata dan stabil; Lasso memilih satu secara arbitrer dan tidak stabil antar sampel",
          "Keduanya identik",
          "OLS saja",
        ]}
        correct={1}
        explanation="Benar: penalti kuadratik Ridge 'benci' satu koefisien raksasa → membagi ke keduanya. Lasso (L1, sudut tajam) cenderung menolkan salah satu secara arbitrer — berbahaya untuk interpretasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kenapa prediktor WAJIB distandarkan sebelum Ridge/Lasso?"
        options={[
          "Agar R² naik",
          "Penalti menghukum besar angka koefisien — variabel berskala besar (rupiah) terdenda tidak adil dibanding berskala kecil (persen)",
          "Agar OLS lebih cepat",
          "Tidak wajib, hanya rekomendasi kosmetik",
        ]}
        correct={1}
        explanation="Benar: penalti buta terhadap satuan. Tanpa standarisasi, λ mendenda variabel 'rupiah' jauh lebih keras daripada 'persen' — keputusan seleksi jadi ditentukan satuan, bukan pentingnya variabel."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. λ dipilih berdasarkan error latih terkecil. Apa yang salah?"
        options={[
          "Tidak ada — error latih terkecil = model terbaik",
          "Error latih selalu turun saat λ→0, jadi 'pemenangnya' selalu tanpa regularisasi = overfitting. λ harus dari CV/holdout",
          "CV terlalu lambat",
          "λ tidak mempengaruhi error latih",
        ]}
        correct={1}
        explanation="Benar: memilih λ dari error latih = mencontek. λ=0 selalu menang di data latih karena penalti nol = OLS = paling fleksibel menghafal. Satu-satunya juri jujur adalah data yang tidak dipakai fitting."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kurva CV error berbentuk U dengan lembah di λ=1. Aturan one-standard-error menyarankan?"
        options={[
          "Selalu λ=1, titik minimum",
          "λ terbesar yang errornya masih dalam 1 SE dari minimum — model lebih sederhana dengan akurasi setara",
          "λ terkecil",
          "Rata-rata semua λ",
        ]}
        correct={1}
        explanation="Benar: one-SE rule memilih model tersederhana yang 'secara statistik tidak kalah' dari yang terbaik — mengorbankan sedikit akurasi demi kesederhanaan, stabilitas, dan interpretabilitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Setelah Lasso, koefisien 'jumlah_transaksi_bulanan' = 0. Kesimpulan tepat?"
        options={[
          "Variabel itu pasti tidak berpengaruh kausal",
          "Variabel itu tidak berguna untuk prediksi di sampel ini (mungkin redundan dengan variabel lain) — bukan bukti tidak penting secara kausal/teori",
          "Lasso salah, pakai OLS",
          "Naikkan λ agar jadi non-nol",
        ]}
        correct={1}
        explanation="Benar: nol dari Lasso = 'tidak terpilih untuk prediksi', bukan 'tidak penting'. Bisa jadi informasinya sudah diwakili variabel lain yang berkorelasi. Jangan hapus dari kamus teori bisnismu hanya karena Lasso menolkannya."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Bias-variance:</strong> error baru = bias² + variance + noise. Kompleksitas ↑ → bias ↓, variance ↑. Tanda overfit: jurang latih vs data baru.</li>
          <li><strong>Ridge (L2):</strong> <Tex math={String.raw`\lambda\sum\beta_j^2`} /> — menyusutkan, tidak menolkan; stabil untuk multikolinearitas; solusi <Tex math={String.raw`(X'X+\lambda I)^{-1}X'y`} />.</li>
          <li><strong>Lasso (L1):</strong> <Tex math={String.raw`\lambda\sum|\beta_j|`} /> — bisa tepat nol = seleksi otomatis; tapi arbitrer untuk variabel berkorelasi.</li>
          <li><strong>Elastic Net:</strong> campuran keduanya — seleksi yang stabil untuk variabel berkelompok.</li>
          <li><strong>λ dari CV</strong> (kurva U) + one-SE rule. <strong>Standarkan dulu</strong> — selalu.</li>
          <li><strong>Jangan</strong> pakai regularisasi saat n ≫ p dan teori sudah memilih variabel — OLS sudah BLUE.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a32-diagnostik-regresi" className="btn btn-secondary btn-sm">← A3.2</Link>
        <Link href="/learn/a34-logistic-glm" className="btn btn-primary btn-sm">Next: A3.4 →</Link>
      </div>
    </div>
  );
}

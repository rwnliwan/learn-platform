"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A315Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const splitData = [
    {
      x: [300, 350, 400, 450, 500, 550, 600, 650, 700],
      y: [0.55, 0.48, 0.40, 0.33, 0.25, 0.18, 0.12, 0.08, 0.05],
      mode: "markers",
      type: "scatter",
      name: "PD per skor",
      marker: { color: "#2a7de1", size: 10 },
    },
    {
      x: [300, 520, 520, 700],
      y: [0.475, 0.475, 0.115, 0.115],
      mode: "lines",
      type: "scatter",
      name: "Tree (1 split)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const biasVarTreeData = [
    {
      x: ["1 tree\n(dalam)", "Random Forest\n(100 trees)", "Boosting\n(100 trees)"],
      y: [0.32, 0.19, 0.16],
      name: "Error test",
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#22c55e"] },
      text: ["var tinggi", "var turun", "bias+var turun"],
      textposition: "outside",
    },
  ];

  const fiData = [
    {
      x: [0.32, 0.24, 0.18, 0.12, 0.08, 0.06],
      y: ["DPD max", "Utilisasi", "Rasio utang", "Skor kredit", "Tenor", "Usia"],
      type: "bar",
      orientation: "h",
      name: "Gain importance",
      marker: { color: "#2a7de1" },
    },
  ];

  const lrData = [
    {
      x: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5],
      y: [0.42, 0.28, 0.21, 0.17, 0.19, 0.35],
      mode: "lines+markers",
      type: "scatter",
      name: "Error validasi",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 10 },
    },
  ];

  const lab1Code = `# Decision tree dari nol: 1 level (stump) dengan Gini split terbaik
# Cari threshold yang meminimalkan Gini impurity tertimbang.
import random, math
random.seed(131)

n = 600
skor = [random.uniform(300, 800) for _ in range(n)]
# kebenaran: PD turun terhadap skor (nonlinear)
y = [1 if random.random() < 1/(1+math.exp((s-550)/60)) else 0 for s in skor]
print(f"default rate: {sum(y)/n:.1%}")

def gini(ys):
    if not ys: return 0
    p = sum(ys)/len(ys)
    return 2*p*(1-p)

g_parent = gini(y)
best = (1e9, None)
for thr in range(350, 751, 10):
    L = [v for s, v in zip(skor, y) if s < thr]
    R = [v for s, v in zip(skor, y) if s >= thr]
    if not L or not R: continue
    g = (len(L)*gini(L) + len(R)*gini(R))/n
    if g < best[0]: best = (g, thr)

print(f"Gini parent : {g_parent:.4f}")
print(f"Split terbaik: skor < {best[1]}")
print(f"Gini split  : {best[0]:.4f}  (gain = {g_parent-best[0]:.4f})")
L = [v for s, v in zip(skor, y) if s < best[1]]
R = [v for s, v in zip(skor, y) if s >= best[1]]
print(f"  kiri : n={len(L)}, default={sum(L)/len(L):.1%}")
print(f"  kanan: n={len(R)}, default={sum(R)/len(R):.1%}")
print()
print("Ini SATU split. Tree dalam = ulangi rekursif di tiap anak.")
print("Makin dalam -> makin hafal (variance naik!). Itulah kenapa")
print("single tree dalam = overfit, dan butuh ensemble (forest/boosting).")
print("COBA: batasi min 100 sampel per daun (jangan split jika anak < 100).")
print("Split tetap sama? Daun jadi lebih stabil = regularisasi tree.")`;

  const lab2Code = `# Bagging dari nol: buktikan variance turun dengan rata-rata banyak tree
# Tree dalam pada bootstrap sample -> rata-ratakan prediksi.
import random, math
random.seed(141)

def true_f(x): return math.sin(x*2)*1.2 + 0.2*x
ntr, nte = 60, 300
xtr = [random.uniform(-3, 3) for _ in range(ntr)]
ytr = [true_f(x) + random.gauss(0, 0.6) for x in xtr]
xte = [i*0.02-3 for i in range(nte)]
yte = [true_f(x) for x in xte]

def stump_predict(xs, ys, xq, depth=0, maxd=6):
    # tree rekursif sederhana: split median, tanpa kriteria canggih
    if depth == maxd or len(xs) < 6:
        return sum(ys)/len(ys)
    xs_s = sorted(xs); thr = xs_s[len(xs_s)//2]
    L = [(a, b) for a, b in zip(xs, ys) if a < thr]
    R = [(a, b) for a, b in zip(xs, ys) if a >= thr]
    if not L or not R: return sum(ys)/len(ys)
    branch = L if xq < thr else R
    return stump_predict([a for a, b in branch], [b for a, b in branch], xq, depth+1, maxd)

def mse(pred): return sum((a-b)**2 for a, b in zip(yte, pred))/nte

# 1 tree dalam di data asli
p1 = [stump_predict(xtr, ytr, x) for x in xte]
# Bagging: 50 tree di bootstrap samples, rata-ratakan
B = 50
preds = []
for b in range(B):
    idx = [random.randrange(ntr) for _ in range(ntr)]
    xb = [xtr[i] for i in idx]; yb = [ytr[i] for i in idx]
    preds.append([stump_predict(xb, yb, x) for x in xte])
pbag = [sum(p[i] for p in preds)/B for i in range(nte)]

print(f"MSE 1 tree dalam : {mse(p1):.4f}  (variance tinggi)")
print(f"MSE bagging-50   : {mse(pbag):.4f}  (variance turun!)")
print(f"Perbaikan        : {(1-mse(pbag)/mse(p1))*100:.0f}%")
print()
print("INILAH inti random forest: rata-rata B tree yang (hampir)")
print("independen -> variance dibagi ~B, bias TETAP (tree tetap dalam).")
print("Random forest = bagging + acak subset fitur per split (agar tree")
print("tidak berkorelasi - kalau semua tree sama, rata-rata tak membantu).")
print("COBA: B=50 -> B=5. Perbaikan menyusut (1/B).")
print("COBA: maxd=6 -> maxd=2 (tree dangkal). Bagging tak membantu banyak")
print("- tree dangkal bias tinggi, dan bagging TIDAK menurunkan bias!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.15 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Tree, Forest &amp; Boosting:<br />Senjata Pamungkas Data Tabular Risiko</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 0,82 vs 0,91 — Selisih Rp Miliaran</a></li>
          <li><a href="#tree">Decision Tree — Aturan Main yang Bisa Dibaca</a></li>
          <li><a href="#forest">Random Forest — Demokrasi Pohon</a></li>
          <li><a href="#boosting">Gradient Boosting — Belajar dari Kesalahan</a></li>
          <li><a href="#tuning">Hyperparameter &amp; Regularisasi Tree</a></li>
          <li><a href="#lab1">🔬 Lab 1: Split Gini Terbaik dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Bagging Menurunkan Variance (Bukti Live)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Tree/Forest/Boosting?</a></li>
          <li><a href="#case">📋 Mini-Case: Duel Logistik vs XGBoost</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mekanisme split decision tree (Gini/entropy) dan mengapa single tree dalam overfit.</li>
          <li>Menjelaskan mengapa random forest menurunkan variance (bagging + feature subsampling).</li>
          <li>Menjelaskan logika gradient boosting (sequential error correction) dan peran learning rate.</li>
          <li>Menyetel hyperparameter kunci (depth, learning rate, n_estimators, min_child) dengan validasi yang benar + early stopping.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 0,82 vs 0,91 — Selisih Rp Miliaran</h2>
      <div className="story">
        <p>Benchmark publik model credit scoring: regresi logistik AUC <strong>0,82–0,85</strong>, random forest <strong>0,86–0,89</strong>, gradient boosting/XGBoost <strong>0,88–0,91</strong>. &ldquo;Cuma&rdquo; 6–9 poin AUC. Kedengarannya kecil — sampai dihitung rupiahnya: di portofolio Rp10 triliun, tiap 1 poin AUC ≈ puluhan miliar penghematan kerugian dari seleksi risiko yang lebih tajam.</p>
        <p>Itulah mengapa lowongan <em>senior risk model validation analyst</em> di bank global menulis syarat eksplisit: <strong>&ldquo;hands-on experience with gradient boosting models for classification and regression, including hyperparameter tuning, overfitting and explainability&rdquo;</strong> — bukan &ldquo;nilai plus&rdquo;, tapi <em>required</em>. Tree ensemble bukan lagi &ldquo;ML modern yang keren&rdquo; — ia adalah <strong>skill wajib</strong> analis risiko 2026.</p>
        <p>Twist-nya: model yang sama persis ini <strong>ditolak regulator</strong> jika tidak bisa dijelaskan (A3.14) dan tidak tervalidasi (A3.8). Kekuatan tanpa kendali = liabilitas. Lesson ini: kuasai senjatanya — dengan disiplin yang sudah kamu pelajari.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="tree">Decision Tree — Aturan Main yang Bisa Dibaca</h2>
      <p><strong>Definisi.</strong> Decision tree mempartisi ruang fitur dengan <strong>split biner rekursif</strong>: di tiap node, pilih (fitur, threshold) yang paling memurnikan pemisahan kelas. Ukuran ketidakmurnian:</p>
      <Tex math={String.raw`\text{Gini} = 1 - \sum_c p_c^2, \qquad \text{Entropy} = -\sum_c p_c \log_2 p_c`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`p_c`} />: proporsi kelas <Tex math={String.raw`c`} /> di node itu</li>
        <li>Gini = 0 → node murni (satu kelas); Gini = 0,5 → campur 50:50 (paling kotor, untuk biner)</li>
        <li>Split dipilih yang memaksimalkan <strong>gain</strong> = Gini parent − rata-rata tertimbang Gini anak</li>
      </ul>
      <p><strong>Kelebihan:</strong> menangani non-linearitas &amp; interaksi <em>otomatis</em> (tidak perlu <Tex math={String.raw`x^2`} /> manual!), tahan terhadap outlier &amp; skala (tidak perlu standarisasi!), bisa dibaca sebagai aturan &ldquo;jika-maka&rdquo;.</p>
      <p><strong>Kelemahan fatal:</strong> <strong>variance tinggi</strong> — ubah sedikit data, pohonnya berubah total (tidak stabil). Pohon dalam = menghafal = overfit. Solusi: jangan pakai satu pohon — pakai <em>hutan</em>.</p>

      <PlotlyChart
        data={splitData}
        title="Satu Split Tree = Fungsi Tangga"
        layout={{ xaxis: { title: "Skor kredit" }, yaxis: { title: "PD", tickformat: ".0%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik biru = PD aktual per skor; garis merah = prediksi tree 1-split (threshold 520).</p>
        <p><strong>Interpretasi:</strong> tree memprediksi <strong>fungsi tangga</strong> — konstan di tiap segmen, lompat di split. Satu split terlalu kasar (underfit); 100 split terlalu bergerigi (overfit). <strong>Pelajaran visual:</strong> tree tidak &ldquo;memahami&rdquo; tren mulus — ia mengaproksimasi dengan tangga. Makin banyak anak tangga, makin mulus — tapi makin hafal noise.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tree adalah &ldquo;ahli bedah&rdquo; yang memotong data dengan pertanyaan ya/tidak. Kekuatannya: menemukan <strong>interaksi</strong> otomatis (&ldquo;DPD tinggi <em>dan</em> LTV tinggi&rdquo; = segmen berbahaya) yang regresi linear lewatkan kecuali kamu buat manual. Kelemahannya: ia <strong>rakus</strong> (<em>greedy</em> — split terbaik <em>sekarang</em>, bukan terbaik <em>global</em>) dan tidak stabil. Ensemble menutupi kedua kelemahan ini.</p>
      </div>

      <h2 id="forest">Random Forest — Demokrasi Pohon</h2>
      <p><strong>Definisi.</strong> Random forest = <strong>bagging</strong> (<em>bootstrap aggregating</em>) + <strong>acak fitur</strong>:</p>
      <ol>
        <li><strong>Bootstrap:</strong> buat B sampel dengan pengembalian dari data latih (tiap sampel ≈ 63% data unik).</li>
        <li><strong>Latih 1 pohon dalam</strong> di tiap sampel — tapi di tiap split, hanya boleh pilih dari <strong>subset acak fitur</strong> (misal √p).</li>
        <li><strong>Rata-rata/vote</strong> B pohon untuk prediksi final.</li>
      </ol>
      <p><strong>Mengapa bekerja</strong> (matematikanya indah): variance rata-rata B variabel berkorelasi <Tex math={String.raw`\rho`} />:</p>
      <Tex math={String.raw`Var(\bar{f}) = \rho\sigma^2 + \frac{1-\rho}{B}\sigma^2`} block />
      <p>Bagging saja menurunkan suku kedua (÷B), tapi pohon-pohon masih berkorelasi tinggi (<Tex math={String.raw`\rho`} /> besar — fitur kuat selalu menang di tiap pohon). <strong>Acak fitur</strong> memaksa pohon berbeda-beda → <Tex math={String.raw`\rho`} /> turun → variance anjlok. Inilah &ldquo;rahasia&rdquo; random forest yang sering disalahpahami: bukan jumlah pohonnya, tapi <strong>dekorelasinya</strong>.</p>
      <p><strong>Bonus:</strong> ~37% data tak ter-bootstrap per pohon = <strong>OOB</strong> (<em>out-of-bag</em>) — validasi gratis tanpa split! Error OOB ≈ error CV.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak pohon, makin overfit.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> untuk random forest, menambah pohon (B) <strong>tidak</strong> menambah overfitting — ia hanya menstabilkan rata-rata (variance suku 1/B mengecil menuju batas ρσ²). Yang menyebabkan overfit adalah pohon yang <em>terlalu dalam</em> / data noise — bukan jumlah pohon. (Catatan: untuk <em>boosting</em>, menambah iterasi BISA overfit — beda mekanisme!)</p>
      </div>

      <h2 id="boosting">Gradient Boosting — Belajar dari Kesalahan</h2>
      <p><strong>Definisi.</strong> Boosting membangun pohon <strong>sekuensial</strong>: pohon ke-<Tex math={String.raw`m`} /> dilatih untuk memprediksi <strong>residual/sisa error</strong> gabungan pohon-pohon sebelumnya:</p>
      <Tex math={String.raw`F_m(x) = F_{m-1}(x) + \nu \cdot h_m(x), \qquad h_m \approx -\frac{\partial L}{\partial F_{m-1}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`F_m`} />: model gabungan setelah <Tex math={String.raw`m`} /> pohon</li>
        <li><Tex math={String.raw`h_m`} />: pohon baru yang menargetkan <strong>gradien negatif loss</strong> — &ldquo;ke arah mana prediksi harus dikoreksi&rdquo;</li>
        <li><Tex math={String.raw`\nu`} /> (learning rate, 0–1): &ldquo;seberapa besar tiap koreksi dipercaya&rdquo; — kecil = belajar lambat tapi stabil (butuh banyak pohon)</li>
      </ul>
      <p><strong>Analogi:</strong> random forest = <em>demokrasi</em> (banyak ahli independen, voting). Boosting = <em>magang berjenjang</em> (ahli pertama kerja, ahli kedua memperbaiki kesalahannya, dst.). Karena sekuensial memperbaiki error, boosting <strong>menurunkan bias</strong> — makanya biasanya mengalahkan forest di data tabular (tapi lebih mudah overfit &amp; butuh tuning!).</p>
      <p><strong>XGBoost/LightGBM/CatBoost</strong> = boosting + engineering: regularisasi (λ, γ), handling missing native, histogram binning (cepat), categorical handling. Perbedaan praktis: LightGBM tercepat untuk data besar; CatBoost terbaik untuk kategorikal; XGBoost paling mapan/dokumentasi.</p>

      <PlotlyChart
        data={biasVarTreeData}
        title="Dari Tree ke Ensemble: error test turun"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Error test" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga pendekatan, error di data test.</p>
        <p><strong>Interpretasi:</strong> 1 tree dalam: 0,32 (variance tinggi). Random forest: 0,19 — <strong>variance dihancurkan</strong> demokrasi. Boosting: 0,16 — <strong>bias juga turun</strong> via koreksi sekuensial. Inilah mengapa boosting memuncaki benchmark tabular — dengan catatan: tuning &amp; validasi yang disiplin (bagian berikut).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pilih dengan bias-variance (A3.3): data <strong>noise tinggi</strong> → random forest (aman, sulit overfit); data <strong>sinyal kuat + kompleks</strong> → boosting (lebih tajam, tapi awasi overfit). Dan untuk <strong>interpretasi regulator</strong>: keduanya butuh SHAP (A3.14) — tidak ada yang &ldquo;intrinsik&rdquo; di sini.</p>
      </div>

      <h2 id="tuning">Hyperparameter &amp; Regularisasi Tree</h2>
      <p><strong>Hyperparameter kunci</strong> (yang benar-benar penting — sisanya default dulu):</p>
      <ul>
        <li><strong>max_depth</strong>: kedalaman pohon. Dalam = bias rendah, variance tinggi. Mulai 3–6 untuk boosting, tak terbatas untuk forest.</li>
        <li><strong>learning_rate (ν) &amp; n_estimators</strong>: pasangan tak terpisahkan — ν kecil (0,01–0,1) + pohon banyak &gt; ν besar + pohon sedikit. <strong>Early stopping</strong>: hentikan saat error validasi berhenti turun (JANGAN tentukan n_estimators buta!).</li>
        <li><strong>min_child_weight / min_samples_leaf</strong>: sampel minimum per daun — &ldquo;rem&rdquo; anti-hafal. Naikkan jika overfit.</li>
        <li><strong>subsample &amp; colsample</strong>: fraksi baris/kolom per pohon — &lt; 1,0 = regularisasi stokastik (mirip dropout).</li>
        <li><strong>λ (reg_lambda), γ (min_split_loss)</strong>: penalti kompleksitas ala XGBoost — γ = &ldquo;gain minimum agar split diizinkan&rdquo;.</li>
      </ul>

      <PlotlyChart
        data={lrData}
        title="Tuning Learning Rate: kurva U lagi"
        layout={{ xaxis: { title: "Learning rate", type: "log" }, yaxis: { title: "Error validasi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = learning rate (skala log), vertikal = error validasi (dengan early stopping).</p>
        <p><strong>Interpretasi:</strong> kurva U lagi! Terlalu kecil (0,01): belajar terlalu lambat, berhenti sebelum konvergen. Terlalu besar (0,5): lompat-lompat, tidak stabil. Sweet spot ≈ 0,1–0,2. <strong>Selalu tuning dengan validasi</strong> (bukan test!) + early stopping — inilah &ldquo;hyperparameter tuning&rdquo; yang diminta lowongan kerja.</p>
      </div>

      <p><strong>Feature importance</strong> (dengan catatan!): <em>gain</em> (total perbaikan split per fitur) cepat tapi <strong>bias ke fitur kardinalitas tinggi</strong>; <em>permutation importance</em> (acak fitur, lihat penurunan skor) lebih jujur tapi mahal; <strong>SHAP</strong> (A3.14) = standar emas. Jangan pernah laporkan gain mentah ke regulator tanpa verifikasi SHAP.</p>

      <PlotlyChart
        data={fiData}
        title="Feature Importance (gain): DPD dominan"
        layout={{ xaxis: { title: "Importance" }, yaxis: { title: "" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang horizontal = kontribusi tiap fitur ke model (gain ternormalisasi).</p>
        <p><strong>Interpretasi:</strong> DPD max dominan (0,32) — konsisten dengan domain (keterlambatan = sinyal default terkuat). <strong>Uji kewarasan:</strong> jika &ldquo;nomor HP&rdquo; muncul di top-3, curigai leakage (A3.8), bukan &ldquo;temuan menarik&rdquo;. Importance = alat debugging, bukan sekadar laporan.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Tree tidak butuh preprocessing sama sekali.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> tree <em>tahan</em> terhadap skala &amp; outlier (split hanya peduli urutan), tapi <strong>tidak kebal</strong> terhadap: (1) <strong>missing yang informatif</strong> — perlakukan eksplisit; (2) <strong>kategorikal kardinalitas tinggi</strong> — one-hot 1000 kolom membuat split miskin; pakai target encoding/CatBoost; (3) <strong>leakage</strong> — tree serakah justru <em>lebih cepat</em> menemukan &amp; mengeksploitasi fitur bocor! Validasi tetap wajib penuh.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Boosting + early stopping = wajib.</strong> Tanpa early stopping, n_estimators besar = overfit yang <em>pasti</em> (tidak seperti forest!). Selalu sediakan validation set untuk early stopping — dan ingat: itu <em>validation</em>, bukan <em>test</em> (A3.0). Untuk data temporal: validasi harus OOT (A3.8)!</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Tree &amp; boosting = &ldquo;senjata pamungkas data tabular&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Satu tree — baca aturannya</summary>
              <p>Tree kedalaman 2 untuk macet: split 1: dpd &gt; 30? (ya → 40% macet; tidak → 5%). Split 2 (cabang &ldquo;ya&rdquo;): penghasilan &lt; 8jt? (ya → 70%; tidak → 20%). Baca sebagai aturan bisnis.</p>
              <p><strong>Langkah 1</strong> — aturan: &ldquo;IF dpd &gt; 30 AND penghasilan &lt; 8jt THEN P(macet) = 70%.&rdquo;<br />
              <strong>Langkah 2</strong> — kekuatan tree: <em>interaksi otomatis</em> (dpd × penghasilan!) + aturan terbaca.<br />
              <strong>Langkah 3</strong> — kelemahan: satu tree = <em>varian tinggi</em> (ubah sedikit data → tree beda!) → butuh ensemble (forest/boosting).</p>
              <p>Pelajaran: tree = &ldquo;aturan if-then yang dipelajari data&rdquo;. Untuk <em>komunikasi</em> ke bisnis: tak terkalahkan. Untuk <em>akurasi</em>: ensemble.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Boosting — mengapa menang di tabular?</summary>
              <p>Dataset kredit 50 fitur campuran (numerik + kategorikal + missing). Logistic: AUC 0,76. Random Forest: 0,81. XGBoost: 0,85. Mengapa boosting menang?</p>
              <p><strong>Langkah 1</strong> — tree menangani <em>non-linearitas &amp; interaksi</em> otomatis (logistik butuh fitur manual!).<br />
              <strong>Langkah 2</strong> — boosting <em>berurutan</em>: tiap tree memperbaiki sisa kesalahan sebelumnya → bias turun drastis.<br />
              <strong>Langkah 3</strong> — XGBoost + regularisasi (λ, γ) + handling missing bawaan → <em>generalisasi</em> tanpa banyak tuning.</p>
              <p>Pelajaran: untuk tabular: <strong>boosting default pertama</strong>. Untuk gambar/teks: deep learning. Untuk n kecil &amp; interpretasi: logistik. Pilih senjata sesuai medan (A3.0!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Split Gini Terbaik dari Nol</h2>
      <p>Cari threshold pemisah skor kredit yang meminimalkan Gini impurity. Rasakan cara tree &ldquo;berpikir&rdquo;.</p>
      <PyodideLab
        title="Lab 1 — Mekanisme Split Decision Tree"
        hint="Batasi min 100 sampel per daun — split lebih stabil = regularisasi tree paling sederhana."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Bagging Menurunkan Variance (Bukti Live)</h2>
      <p>Bandingkan 1 tree dalam vs rata-rata 50 tree bootstrap. Saksikan variance anjlok — dan kapan bagging TIDAK membantu.</p>
      <PyodideLab
        title="Lab 2 — Inti Random Forest dari Nol"
        hint="Coba maxd 6 → 2: bagging tak membantu tree dangkal — bagging menurunkan VARIANCE, bukan bias!"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Tree/Forest/Boosting?</h2>

      <div className="decision-card">
        <h3>1. Butuh aturan bisnis yang bisa dibaca → <strong>single tree dangkal</strong></h3>
        <p><strong>Kondisi:</strong> aturan operasional (&ldquo;tolak jika...&rdquo;), presentasi ke non-teknis.</p>
        <p><strong>Kenapa:</strong> satu-satunya yang intrinsik interpretable. Batasi depth 3–4.</p>
        <p><strong>Contoh nyata:</strong> aturan cutoff awal verifikasi manual.</p>
      </div>

      <div className="decision-card">
        <h3>2. Data noisy, ingin aman, minim tuning → <strong>random forest</strong></h3>
        <p><strong>Kondisi:</strong> banyak noise, waktu tuning terbatas, butuh baseline kuat.</p>
        <p><strong>Kenapa:</strong> sulit overfit, OOB gratis, robust. &ldquo;Nyalakan dan lupakan&rdquo; (dengan validasi!).</p>
        <p><strong>Contoh nyata:</strong> challenger model untuk validasi (A3.8).</p>
      </div>

      <div className="decision-card">
        <h3>3. Kompetisi akurasi tabular, siap tuning → <strong>gradient boosting (XGBoost/LightGBM)</strong></h3>
        <p><strong>Kondisi:</strong> sinyal kompleks, data cukup, ada waktu validasi.</p>
        <p><strong>Kenapa:</strong> bias terendah di kelas tabular — benchmark 0,88–0,91 AUC.</p>
        <p><strong>Contoh nyata:</strong> model PD/LGD produksi, deteksi fraud.</p>
      </div>

      <div className="decision-card">
        <h3>4. Butuh probabilitas terkalibrasi → <strong>boosting + kalibrasi ulang</strong></h3>
        <p><strong>Kondisi:</strong> output untuk pricing/cadangan.</p>
        <p><strong>Kenapa:</strong> boosting terkenal overconfident (A3.6) — latih untuk ranking, kalibrasi ulang untuk angka.</p>
        <p><strong>Contoh nyata:</strong> PD untuk ECL dengan XGBoost + Platt/isotonic.</p>
      </div>

      <div className="decision-card">
        <h3>5. Regulator menuntut interpretabilitas penuh → <strong>logistik/scorecard, bukan tree!</strong></h3>
        <p><strong>Kondisi:</strong> model IRB, adverse action notice.</p>
        <p><strong>Kenapa:</strong> jika kompleksitas tidak membayar dirinya secara material, pilih intrinsik (A3.14).</p>
        <p><strong>Contoh nyata:</strong> scorecard PD ritel untuk persetujuan regulator.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Forest = demokrasi</strong> (turunkan variance). <strong>Boosting = magang</strong> (turunkan bias). Pilih sesuai masalahmu.</li>
          <li>Boosting <strong>wajib</strong> early stopping di validation set. Forest: tambah pohon aman.</li>
          <li>Learning rate kecil + pohon banyak &gt; learning rate besar + pohon sedikit.</li>
          <li>Importance = alat debugging (curigai anomali!), bukan sekadar laporan. Verifikasi dengan SHAP.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Duel Logistik vs XGBoost</h2>
      <div className="callout">
        <p>Kamu membangun model PD KTA (n = 80.000, 40 fitur). Hasil validasi OOT:</p>
        <ul>
          <li>Logistik + WoE: AUC 0,83, ECE 0,012, training 2 menit, fully interpretable</li>
          <li>XGBoost (tuned, early stopping): AUC 0,875, ECE 0,041, training 40 menit, butuh SHAP</li>
          <li>Portofolio: Rp4 triliun. Estimasi: tiap 1 poin AUC ≈ Rp18 M/tahun penghematan seleksi.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Model mana yang dipilih untuk produksi? Hitung tradeoff rupiahnya. (b) Apa yang harus dilakukan sebelum XGBoost go-live? (c) Kapan kamu tetap pilih logistik?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>XGBoost</strong> — selisih 4,5 poin AUC × Rp18 M ≈ <strong>Rp81 M/tahun</strong>. Ini material — kompleksitas <em>membayar dirinya</em> jauh. (Bandingkan dengan contoh A3.0: selisih 0,3 poin = tolak.)</p>
          <p>(b) <strong>Checklist go-live:</strong> (1) kalibrasi ulang (ECE 0,041 → target &lt; 0,015) di data OOT terpisah — XGBoost overconfident! (2) SHAP global: pastikan pendorong = faktor risiko masuk akal (bukan leakage). (3) Audit fairness per wilayah/gender. (4) PSI baseline + monitoring kuartalan. (5) Dokumentasi SR 11-7 + challenger (logistik sebagai benchmark permanen).</p>
          <p>(c) <strong>Pilih logistik jika:</strong> regulator menolak black-box untuk segmen ini; atau tim tidak mampu maintain pipeline XGBoost + monitoring SHAP; atau selisih AUC ternyata tidak material setelah dihitung rupiah. Keputusan = bisnis, bukan fanatisme algoritma.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Random Forest vs Gradient Boosting: beda <em>filosofi</em> (bagging vs boosting) dalam 2 kalimat.</li>
              <li>Overfitting di XGBoost: 3 hyperparameter yang mengendalikannya + arahnya.</li>
              <li>Mengapa <em>learning rate kecil + banyak tree</em> biasanya mengalahkan <em>learning rate besar + sedikit tree</em>?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Bagging (RF)</strong>: banyak tree <em>independen</em> (paralel) → voting menurunkan <em>varians</em>. <strong>Boosting</strong>: tree <em>berurutan</em>, tiap tree memperbaiki sisa error → menurunkan <em>bias</em> (tapi bisa overfit!).</p>
              <p><strong>2.</strong> (a) <strong>max_depth ↓</strong> (tree dangkal), (b) <strong>min_child_weight ↑</strong> (butuh bukti lebih per split), (c) <strong>subsample/colsample &lt; 1</strong> (acak = regularisasi), (d) <strong>λ/α ↑</strong> (penalti). Semua = &ldquo;batasi kompleksitas&rdquo;.</p>
              <p><strong>3.</strong> <strong>Shrinkage</strong>: langkah kecil = koreksi bertahap → model menjelajahi ruang fungsi lebih halus &amp; tidak &ldquo;melompat&rdquo; ke overfit. Analog: menuruni bukit dengan langkah kecil vs lompatan besar.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Random forest dengan 500 pohon vs 100 pohon — mana yang lebih overfit?"
        options={[
          "500 — makin banyak makin hafal",
          "Sama saja — menambah pohon TIDAK menambah overfit di RF (hanya menstabilkan rata-rata). Overfit datang dari pohon yang terlalu dalam",
          "100 — lebih sedikit lebih aman",
          "Tergantung seed",
        ]}
        correct={1}
        explanation="Benar: Var(rata-rata) = ρσ² + (1−ρ)σ²/B — B besar hanya mengecilkan suku kedua menuju batas. Ini KHUSUS forest; untuk boosting, n_estimators besar TANPA early stopping = overfit!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Apa 'rahasia' random forest yang sebenarnya menurunkan variance?"
        options={[
          "Jumlah pohon yang banyak",
          "Bootstrap saja",
          "Dekorelasi via acak subset fitur per split — pohon yang beragam membuat rata-rata efektif. Tanpa ini, pohon-pohon terlalu mirip",
          "Depth tak terbatas",
        ]}
        correct={2}
        explanation="Benar: bagging tanpa dekorelasi = rata-rata pohon yang hampir identik (ρ tinggi) → variance tetap. Feature subsampling memaksa diversitas — itulah yang membuat 1/B bekerja."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Boosting: learning rate 0,5 dengan 50 pohon vs 0,05 dengan 500 pohon (early stopping). Mana umumnya lebih baik?"
        options={[
          "0,5/50 — lebih cepat",
          "0,05/500 — kecil + banyak = belajar bertahap yang stabil; analog dengan 'langkah kecil, banyak langkah' di optimasi",
          "Sama saja",
          "Tergantung data saja",
        ]}
        correct={1}
        explanation="Benar: shrinkage — koreksi kecil berulang mengalahkan koreksi besar sedikit. Ini pola universal gradient boosting. Tapi JANGAN lupa early stopping untuk yang 500 pohon!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Feature importance (gain) menempatkan 'ID nasabah' di top-3. Tindakan?"
        options={[
          "Pertahankan — model tahu yang terbaik",
          "RED FLAG: ID = leakage/noise berkardinalitas tinggi (gain bias ke sini!). Investigasi, kemungkinan besar buang",
          "Naikkan max_depth",
          "Tambah pohon",
        ]}
        correct={1}
        explanation="Benar: gain bias ke fitur kardinalitas tinggi. ID unik = 'fitur' yang bisa menghafal target (leakage sempurna!). Importance adalah alat debugging — anomali di top list = investigasi dulu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. XGBoost AUC 0,90 tapi ECE 0,05. Untuk pricing, apa yang kurang?"
        options={[
          "Tidak ada — AUC tinggi cukup",
          "Kalibrasi ulang! Boosting overconfident — probabilitasnya tidak jujur. Latih untuk ranking, kalibrasi (Platt/isotonic) untuk angka",
          "Tambah depth",
          "Kurangi learning rate",
        ]}
        correct={1}
        explanation="Benar: (A3.6) AUC = ranking, ECE = kejujuran angka. 0,05 = rata-rata meleset 5 poin — untuk pricing itu mahal. Recalibration di data terpisah, bukan data latih!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kapan single decision tree (bukan ensemble) adalah pilihan TEPAT?"
        options={[
          "Tidak pernah — selalu ensemble",
          "Saat butuh aturan yang bisa dibaca manusia (operasional/regulasi sederhana) — batasi depth 3-4, terima akurasinya sebagai harga interpretabilitas",
          "Untuk data besar",
          "Untuk probabilitas terkalibrasi",
        ]}
        correct={1}
        explanation="Benar: satu-satunya keunggulan single tree = keterbacaan langsung. Untuk aturan cutoff operasional atau komunikasi dengan non-teknis, pohon dangkal tak tergantikan — asal sadar harganya (akurasi & stabilitas)."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Tree:</strong> split Gini/entropy rekursif → fungsi tangga; otomatis tangkap non-linearitas &amp; interaksi; variance tinggi.</li>
          <li><strong>Random forest:</strong> bagging + acak fitur → dekorelasi → variance anjlok. B banyak aman. OOB = validasi gratis.</li>
          <li><strong>Boosting:</strong> sekuensial koreksi residual (<Tex math={String.raw`F_m=F_{m-1}+\nu h_m`} />) → bias turun; juara tabular; butuh tuning + early stopping.</li>
          <li><strong>Tuning:</strong> ν kecil + pohon banyak; max_depth 3–6; min_child; subsample. Validasi OOT untuk temporal.</li>
          <li><strong>Skill wajib</strong> analis risiko 2026 (lowongan global mensyaratkan). Tapi: kalibrasi ulang + SHAP + validasi penuh sebelum produksi.</li>
          <li><strong>Jangan</strong> boosting tanpa early stopping; jangan percaya gain mentah; jangan lupakan leakage — tree serakah menemukannya duluan!</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a38-validasi-model" className="btn btn-secondary btn-sm">← A3.8</Link>
        <Link href="/learn/a39-time-series" className="btn btn-primary btn-sm">Next: A3.9 →</Link>
      </div>
    </div>
  );
}

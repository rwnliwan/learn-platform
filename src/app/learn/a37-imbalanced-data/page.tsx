"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A37Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const imbalanceData = [
    {
      x: ["KTA lancar", "KTA default"],
      y: [9700, 300],
      type: "bar",
      marker: { color: ["#22c55e", "#ef4444"] },
      text: ["97%", "3%"],
      textposition: "outside",
    },
  ];

  const smoteData = [
    {
      x: [1, 1.5, 2, 2.2, 1.8, 5, 5.5, 6],
      y: [1, 1.2, 0.8, 1.5, 2, 5, 5.3, 4.8],
      mode: "markers",
      type: "scatter",
      name: "Mayoritas (lancar)",
      marker: { color: "#22c55e", size: 10 },
    },
    {
      x: [8, 8.5, 9],
      y: [8, 8.3, 7.8],
      mode: "markers",
      type: "scatter",
      name: "Minoritas asli (default)",
      marker: { color: "#ef4444", size: 12, symbol: "x" },
    },
    {
      x: [8.2, 8.7, 8.3, 8.6, 8.1],
      y: [8.1, 8.2, 7.9, 8.4, 8.2],
      mode: "markers",
      type: "scatter",
      name: "SMOTE sintetis",
      marker: { color: "#e8a838", size: 9, symbol: "diamond" },
    },
  ];

  const thresholdCostData = [
    {
      x: [0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5],
      y: [420, 310, 265, 290, 340, 450, 700],
      mode: "lines+markers",
      type: "scatter",
      name: "Total biaya (Rp jt)",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 9 },
    },
  ];

  const lab1Code = `# Class weight vs SMOTE: bandingkan dua strategi imbalance
# n=3000, default rate 4%. Evaluasi: recall & precision di threshold operasional.
import random, math
random.seed(13)

def sigmoid(z): return 1/(1+math.exp(-z))
n = 3000
x1 = [random.gauss(0,1) for _ in range(n)]
x2 = [random.gauss(0,1) for _ in range(n)]
y = [1 if random.random() < sigmoid(-3.0 - 1.6*a + 1.1*b) else 0 for a, b in zip(x1, x2)]
print(f"default rate: {sum(y)/n:.1%} (n={n}, positif={sum(y)})")

def fit_logreg(xs1, xs2, ys, w1=1.0, iters=400, lr=0.5):
    b0, b1, b2 = 0.0, 0.0, 0.0
    for _ in range(iters):
        g0=g1=g2=0.0
        for a, c, yi in zip(xs1, xs2, ys):
            p = sigmoid(b0+b1*a+b2*c)
            w = w1 if yi==1 else 1.0
            g0 += w*(yi-p); g1 += w*(yi-p)*a; g2 += w*(yi-p)*c
        tot = sum(w1 if yi==1 else 1.0 for yi in ys)
        b0 += lr*g0/tot; b1 += lr*g1/tot; b2 += lr*g2/tot
    return b0, b1, b2

def pr_at(y, p, thr=0.15):
    pred = [1 if v > thr else 0 for v in p]
    tp = sum(1 for a,b in zip(y,pred) if a==1 and b==1)
    fp = sum(1 for a,b in zip(y,pred) if a==0 and b==1)
    fn = sum(1 for a,b in zip(y,pred) if a==1 and b==0)
    return tp/(tp+fp) if tp+fp else 0, tp/(tp+fn) if tp+fn else 0

# Strategi 1: tanpa bobot
b0,b1,b2 = fit_logreg(x1, x2, y, w1=1.0)
p1 = [sigmoid(b0+b1*a+b2*c) for a, c in zip(x1, x2)]
# Strategi 2: class weight (bobot minoritas ~ rasio imbalance)
ratio = (n-sum(y))/sum(y)
b0,b1,b2 = fit_logreg(x1, x2, y, w1=ratio)
p2 = [sigmoid(b0+b1*a+b2*c) for a, c in zip(x1, x2)]

for nama, p in [("tanpa bobot", p1), (f"class_weight 1:{ratio:.0f}", p2)]:
    prec, rec = pr_at(y, p)
    print(f"{nama:>18}: precision={prec:.1%}, recall={rec:.1%}")
print()
print("Class weight MENDORONG model peduli kelas minoritas: recall naik")
print("(lebih banyak default tertangkap), precision turun (lebih banyak")
print("alarm palsu). Tidak ada makan siang gratis - ini tradeoff.")
print("COBA: ubah threshold 0.15 -> 0.5. Lihat recall anjlok.")`;

  const lab2Code = `# SMOTE dari nol: interpolasi tetangga minoritas
# SMOTE = buat titik sintetis di ANTARA titik minoritas yang bertetangga.
import random, math
random.seed(8)

# minoritas: 6 titik di 2D
minor = [(8.0,8.0),(8.5,8.3),(9.0,7.8),(8.2,7.5),(8.8,8.5),(7.8,8.2)]

def dist(a, b): return math.hypot(a[0]-b[0], a[1]-b[1])

def smote(minor, k=3, n_new=12):
    new_pts = []
    for _ in range(n_new):
        i = random.randrange(len(minor))
        # k tetangga terdekat dari titik i
        neigh = sorted(range(len(minor)), key=lambda j: dist(minor[i], minor[j]))[1:k+1]
        j = random.choice(neigh)
        t = random.random()  # interpolasi acak di antara keduanya
        new_pts.append((minor[i][0]+t*(minor[j][0]-minor[i][0]),
                        minor[i][1]+t*(minor[j][1]-minor[i][1])))
    return new_pts

syn = smote(minor)
print(f"Minoritas asli: {len(minor)} titik -> SMOTE: +{len(syn)} titik sintetis")
print("Contoh titik sintetis (interpolasi dua tetangga):")
for p in syn[:5]:
    print(f"  ({p[0]:.2f}, {p[1]:.2f})")
print()
print("CATATAN PENTING: SMOTE hanya interpolasi - ia TIDAK menciptakan")
print("informasi baru. Jika minoritas asli tidak representatif, SMOTE hanya")
print("memperbanyak ketidakrepresentatifan itu. Dan SMOTE butuh jarak yang")
print("bermakna - untuk data kategorikal/teks, pikir ulang!")
print()
print("COBA: ubah k=3 -> k=1. Titik sintetis jadi hanya di garis antar")
print("pasangan terdekat - variasi menyusut.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.7 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Imbalanced Data:<br />Ketika 3% yang Menentukan 100% Nasib Modelmu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 10.000 Transaksi Aman, 3 Penipu Lolos</a></li>
          <li><a href="#masalah">Mengapa Imbalance Merusak: Tiga Mekanisme</a></li>
          <li><a href="#datalevel">Pendekatan Data: Undersampling, Oversampling, SMOTE</a></li>
          <li><a href="#algolevel">Pendekatan Algoritma: Class Weight &amp; Threshold Tuning</a></li>
          <li><a href="#evaluasi">Evaluasi yang Jujur: Metrik &amp; Validasi untuk Imbalance</a></li>
          <li><a href="#lab1">🔬 Lab 1: Class Weight vs Tanpa Bobot</a></li>
          <li><a href="#lab2">🔬 Lab 2: SMOTE dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Strategi Mana untuk Kasus Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Model Fraud 0,1%</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tiga mekanisme mengapa class imbalance merusak model (prior mendominasi, gradien tenggelam, metrik menipu).</li>
          <li>Membandingkan undersampling, oversampling, dan SMOTE — termasuk asumsi dan bahaya masing-masing.</li>
          <li>Menerapkan class weight dan threshold tuning, dan menjelaskan mengapa keduanya tidak merusak kalibrasi seperti sampling.</li>
          <li>Memilih strategi evaluasi yang jujur untuk imbalance (stratified CV, PR-AUC, expected cost).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 10.000 Transaksi Aman, 3 Penipu Lolos</h2>
      <div className="story">
        <p>Tim fraud bank meluncurkan model ML baru. Di data uji: akurasi 99,97%! Semua orang merayakan — sampai kepala fraud memeriksa daftar tangkapan: <strong>kosong</strong>. Dari 10.000 transaksi uji berisi 3 fraud aktual, model tidak menandai satu pun.</p>
        <p>Yang terjadi: model belajar strategi paling aman — &ldquo;tebak selalu aman&rdquo;. Dengan fraud rate 0,03%, strategi malas itu benar 99,97% dan loss function-nya (yang dioptimasi saat training) sangat puas. Model tidak rusak; ia <strong>rasional</strong> — diberi insentif yang salah, ia memilih kemalasan yang optimal.</p>
        <p>Twist-nya: solusinya bukan &ldquo;data lebih banyak&rdquo; (10 juta transaksi aman tidak membantu jika hanya 3.000 fraud), melainkan <strong>mengubah insentif</strong>: membuat kesalahan pada kelas langka <em>lebih mahal</em> daripada kesalahan pada kelas umum. Lesson ini tentang cara membuat model peduli pada minoritas.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="masalah">Mengapa Imbalance Merusak: Tiga Mekanisme</h2>
      <ol>
        <li><strong>Prior mendominasi.</strong> Model belajar &ldquo;base rate&rdquo; dulu: jika 97% lancar, prediksi &ldquo;lancar&rdquo; adalah taruhan awal yang sangat menguntungkan. Sinyal lemah dari fitur tenggelam oleh prior yang kuat.</li>
        <li><strong>Gradien tenggelam.</strong> Dalam training (misal gradient descent), kontribusi 9.700 observasi mayoritas <strong>menenggelamkan</strong> 300 observasi minoritas — model nyaris tidak &ldquo;mendengar&rdquo; kelas langka.</li>
        <li><strong>Metrik menipu.</strong> Akurasi 97% untuk strategi &ldquo;selalu tebak mayoritas&rdquo; (A3.5). Jika metrik evaluasinya buta, tim tidak sadar modelnya malas sampai produksi.</li>
      </ol>

      <PlotlyChart
        data={imbalanceData}
        title="Imbalance KTA: 97% vs 3%"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Jumlah nasabah" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang — 9.700 nasabah lancar (hijau) vs 300 default (merah).</p>
        <p><strong>Interpretasi:</strong> rasio 32:1. Inilah medan perangnya: setiap batch training, setiap split validasi, setiap metrik — semuanya didominasi hijau. <strong>Seluruh lesson ini adalah tentang memaksa model memperhatikan batang merah kecil itu.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tanyakan dulu: <strong>apakah imbalance ini masalah?</strong> Jika tujuanmu <em>estimasi probabilitas</em> (PD untuk pricing), imbalance BUKAN masalah — regresi logistik menangani base rate berapapun (A3.4). Imbalance menjadi masalah saat tujuanmu <em>keputusan klasifikasi</em> dengan threshold, atau saat algoritma (terutama tree/deep learning) kesulitan &ldquo;mendengar&rdquo; kelas langka. Jangan obati yang tidak sakit.</p>
      </div>

      <h2 id="datalevel">Pendekatan Data: Undersampling, Oversampling, SMOTE</h2>
      <p><strong>Definisi.</strong> Ubah komposisi data latih agar kelas seimbang:</p>
      <ul>
        <li><strong>Random undersampling:</strong> buang acak observasi mayoritas (9.700 → 300). <em>Pro:</em> cepat, mengurangi komputasi. <em>Kontra:</em> <strong>membuang informasi</strong> — 9.400 observasi hilang! Berbahaya jika mayoritas punya variasi penting.</li>
        <li><strong>Random oversampling:</strong> duplikasi acak minoritas (300 → 9.700). <em>Pro:</em> tidak buang info. <em>Kontra:</em> duplikat persis → model <strong>menghafal</strong> 300 titik itu (overfit); tidak menambah informasi baru sama sekali.</li>
        <li><strong>SMOTE</strong> (<em>synthetic minority oversampling technique</em>): buat titik <strong>sintetis</strong> dengan interpolasi antara titik minoritas yang bertetangga:
          <Tex math={String.raw`x_{new} = x_i + t \cdot (x_j - x_i), \quad t \sim U(0,1)`} block />
          dengan <Tex math={String.raw`x_j`} /> tetangga terdekat <Tex math={String.raw`x_i`} />. <em>Pro:</em> variasi baru, mengurangi overfit vs duplikasi. <em>Kontra:</em> interpolasi butuh <strong>jarak yang bermakna</strong> — untuk fitur kategorikal/tekstual bisa menghasilkan &ldquo;manusia setengah&rdquo; yang tidak masuk akal; bisa juga <strong>mencemari</strong> wilayah mayoritas jika minoritas bertetangga dengan mayoritas (ada varian Borderline-SMOTE).</li>
      </ul>

      <PlotlyChart
        data={smoteData}
        title="SMOTE: Titik Sintetis di Antara Tetangga Minoritas"
        layout={{ xaxis: { title: "Fitur 1" }, yaxis: { title: "Fitur 2" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik hijau = mayoritas, silang merah = minoritas asli (3 titik), diamond kuning = titik sintetis SMOTE.</p>
        <p><strong>Interpretasi:</strong> SMOTE mengisi ruang <em>di antara</em> titik minoritas yang bertetangga — bukan duplikat, tapi juga bukan data baru dari dunia nyata. Perhatikan: titik sintetis tidak pernah keluar dari &ldquo;gugusan&rdquo; minoritas asli. <strong>Jika 3 titik asli tidak mewakili populasi fraud, 300 titik sintetis pun tidak.</strong></p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;SMOTE selalu lebih baik daripada duplikasi biasa.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> SMOTE hanya menang jika jarak antar fitur bermakna dan minoritas membentuk gugusan yang koheren. Untuk data dengan banyak fitur kategorikal, teks, atau minoritas yang tersebar (bukan menggumpal), SMOTE bisa menghasilkan sampel sintetis yang <em>tidak realistis</em> — Frankenstein statistik. Selalu validasi dengan metrik di data <strong>asli</strong> (bukan data SMOTE!) — jika SMOTE tidak memperbaiki PR-AUC di data asli, buang.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Aturan keras sampling:</strong> sampling (over/undersampling/SMOTE) <strong>HANYA</strong> boleh diterapkan ke <strong>data latih</strong> — tidak pernah ke data validasi/uji! Validasi harus mencerminkan dunia nyata (base rate asli). Terapkan SMOTE sebelum split = <strong>leakage</strong>: titik sintetis di fold validasi &ldquo;bocor&rdquo; dari titik asli di fold latih → performa terlihat bagus palsu (A3.8).</p>
      </div>

      <h2 id="algolevel">Pendekatan Algoritma: Class Weight &amp; Threshold Tuning</h2>
      <p><strong>Definisi.</strong> Tanpa mengubah data — ubah <em>insentif</em> algoritma:</p>
      <ul>
        <li><strong>Class weight:</strong> kalikan loss tiap observasi minoritas dengan bobot <Tex math={String.raw`w`} /> (umumnya <Tex math={String.raw`w = n_{mayoritas}/n_{minoritas}`} />):
          <Tex math={String.raw`\text{Loss} = \sum_{mayoritas} \ell_i + w \sum_{minoritas} \ell_i`} block />
          Kesalahan pada 1 default &ldquo;dihitung&rdquo; 32× — model dipaksa peduli. <em>Pro:</em> tidak mengubah data, tidak merusak kalibrasi separah sampling, didukung hampir semua library. <em>Kontra:</em> bobot terlalu besar → model paranoid (precision anjlok).</li>
        <li><strong>Threshold tuning:</strong> latih model biasa (probabilitas jujur!), lalu <strong>turunkan threshold</strong> keputusan (misal 0,5 → 0,08) sampai tradeoff precision-recall sesuai biaya bisnis. <em>Pro:</em> paling jujur — probabilitas tetap terkalibrasi (A3.6), keputusan dioptimasi terpisah. <em>Kontra:</em> butuh probabilitas yang memang terkalibrasi baik.</li>
      </ul>

      <PlotlyChart
        data={thresholdCostData}
        title="Total Biaya vs Threshold: Ada Titik Termurah"
        layout={{ xaxis: { title: "Threshold penolakan" }, yaxis: { title: "Total biaya (Rp juta)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = threshold (makin kanan = makin ketat menandai), vertikal = total biaya = FN×biaya_FN + FP×biaya_FP.</p>
        <p><strong>Interpretasi:</strong> kurva berbentuk U dengan minimum di threshold ≈ 0,10 — <strong>bukan 0,5!</strong> Threshold &ldquo;default&rdquo; 0,5 hampir tidak pernah optimal untuk imbalance + biaya asimetris. Inilah mengapa threshold adalah <em>keputusan bisnis</em> (A3.5), bukan konstanta statistik.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan kerja yang benar untuk imbalance: (1) <strong>metrik dulu</strong> — ganti akurasi dengan PR-AUC/expected cost; (2) <strong>class weight</strong> — murah dan aman; (3) <strong>threshold tuning</strong> — optimasi keputusan; (4) <strong>sampling/SMOTE</strong> — terakhir, hanya jika 1–3 belum cukup, dan hanya di data latih. Kebanyakan kasus selesai di langkah 2–3.</p>
      </div>

      <h2 id="evaluasi">Evaluasi yang Jujur: Metrik &amp; Validasi untuk Imbalance</h2>
      <ul>
        <li><strong>Metrik:</strong> PR-AUC (bukan ROC-AUC), precision/recall/F1 di threshold operasional, expected cost. Akurasi <strong>dilarang</strong>.</li>
        <li><strong>Stratified CV:</strong> tiap fold <strong>wajib</strong> mempertahankan proporsi kelas. Tanpa stratifikasi, fold bisa berisi <em>nol</em> positif → metrik NaN/gaduh. Untuk data berkelompok (nasabah punya banyak transaksi), pakai <strong>stratified group K-fold</strong> — transaksi satu nasabah tidak boleh bocor ke fold lain.</li>
        <li><strong>Jangan evaluasi di data hasil sampling!</strong> Validasi di distribusi asli — kalau tidak, kamu mengukur performa di dunia fantasi.</li>
        <li><strong>Laporkan interval:</strong> dengan 300 positif, recall 70% punya margin error ±5 poin. Jangan klaim &ldquo;recall naik 2%&rdquo; sebagai kemenangan — itu noise.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Setelah SMOTE, probabilitas model tetap valid untuk pricing.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> model yang dilatih di data hasil sampling <strong>kehilangan kalibrasi</strong> — base rate-nya sudah diubah! Probabilitasnya sistematis kegedean. Jika butuh probabilitas jujur (pricing, cadangan): pakai class weight + threshold tuning (probabilitas relatif terjaga), atau lakukan <strong>koreksi prior</strong> setelah sampling (A3.6). Jangan pernah masukkan probabilitas model-SMOTE mentah ke rumus ECL.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Imbalance = &ldquo;3% yang menentukan segalanya&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Class weight — matematika di baliknya</summary>
              <p>1.000 data, 30 positif (3%). Tanpa bobot, model memprediksi negatif semua (akurasi 97%!). Hitung class weight yang benar.</p>
              <p><strong>Langkah 1</strong> — <code className="inline">class_weight = n/(k × n_kelas)</code>: negatif: 1000/(2×970) ≈ 0,52; positif: 1000/(2×30) ≈ <strong>16,7</strong>.<br />
              <strong>Langkah 2</strong> — artinya: 1 kesalahan di kelas positif &ldquo;dihitung&rdquo; 16,7× — loss memaksa model memperhatikan minoritas.<br />
              <strong>Langkah 3</strong> — hasil: recall positif 0% → 70%, akurasi 97% → 93% — <em>tradeoff yang benar</em> (A3.5!).</p>
              <p>Pelajaran: class weight = &ldquo;terjemahkan biaya bisnis ke bahasa loss function&rdquo;. Alternatif: threshold tuning (A3.5) — kadang cukup tanpa retrain!</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: SMOTE — kapan membantu, kapan merusak</summary>
              <p>30 sampel positif di ruang 20 dimensi. SMOTE ×10 → 300 &ldquo;sampel&rdquo; sintetis. Kapan ini membantu?</p>
              <p><strong>Langkah 1</strong> — SMOTE menginterpolasi antar tetangga minoritas — <em>asumsi</em>: ruang antar sampel = wilayah positif.<br />
              <strong>Langkah 2</strong> — membantu jika: kelas minoritas <em>cluster</em> (tetangga = sejenis) &amp; n cukup untuk tetangga bermakna.<br />
              <strong>Langkah 3</strong> — <strong>merusak</strong> jika: 30 sampel tersebar (tetangga = noise!) atau ada overlap kelas — SMOTE menciptakan &ldquo;positif&rdquo; di wilayah negatif!</p>
              <p>Pelajaran: SMOTE bukan sihir — ia <em>asumsi geometris</em>. Validasi dengan PR-AUC (bukan akurasi!), dan selalu bandingkan dengan baseline class-weight (sering menang!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Class Weight vs Tanpa Bobot</h2>
      <p>Latih regresi logistik dua kali (dengan/tanpa class weight) di data imbalance 4%. Bandingkan precision-recall-nya.</p>
      <PyodideLab
        title="Lab 1 — Mengubah Insentif Model"
        hint="Coba: threshold 0.15 → 0.5. Recall anjlok — threshold adalah keputusan bisnis, bukan konstanta."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: SMOTE dari Nol</h2>
      <p>Implementasi SMOTE murni: interpolasi acak antara titik minoritas yang bertetangga.</p>
      <PyodideLab
        title="Lab 2 — Synthetic Minority Oversampling dari Nol"
        hint="Coba: k=3 → k=1. Variasi titik sintetis menyusut — SMOTE buta tanpa tetangga yang beragam."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Strategi Mana untuk Kasus Apa</h2>

      <div className="decision-card">
        <h3>1. Butuh probabilitas jujur (pricing, PD untuk ECL) → <strong>class weight + threshold tuning, TANPA sampling</strong></h3>
        <p><strong>Kondisi:</strong> angka probabilitas masuk rumus rupiah.</p>
        <p><strong>Kenapa:</strong> sampling merusak base rate → probabilitas bias. Class weight menjaga kalibrasi relatif lebih baik; threshold tuning memisahkan keputusan dari estimasi.</p>
        <p><strong>Contoh nyata:</strong> model PD untuk pencadangan IFRS 9.</p>
      </div>

      <div className="decision-card">
        <h3>2. Hanya butuh klasifikasi + algoritma &ldquo;tuli&rdquo; (tree, deep learning) → <strong>class weight dulu, SMOTE jika belum cukup</strong></h3>
        <p><strong>Kondisi:</strong> keputusan biner; model kesulitan mendengar kelas langka.</p>
        <p><strong>Kenapa:</strong> class weight murah &amp; aman. SMOTE membantu untuk algoritma berbasis jarak/densitas — tapi validasi di data asli.</p>
        <p><strong>Contoh nyata:</strong> deteksi fraud dengan gradient boosting.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data raksasa, mayoritas redundan → <strong>undersampling cerdas</strong></h3>
        <p><strong>Kondisi:</strong> 10 juta mayoritas vs 10 ribu minoritas; komputasi mahal.</p>
        <p><strong>Kenapa:</strong> buang mayoritas yang redundan menghemat biaya tanpa banyak kehilangan info. &ldquo;Cerdas&rdquo; = pertahankan yang informatif (misal near-miss / Tomek links), bukan buang acak.</p>
        <p><strong>Contoh nyata:</strong> training harian model fraud di data streaming.</p>
      </div>

      <div className="decision-card">
        <h3>4. Minoritas &lt; 100 sampel → <strong>jangan percaya teknik apapun sepenuhnya</strong></h3>
        <p><strong>Kondisi:</strong> positif sangat sedikit (misal 40 kasus).</p>
        <p><strong>Kenapa:</strong> tidak ada teknik yang menciptakan informasi dari ketiadaan. SMOTE dari 40 titik = memperbanyak tebakan. Fokus: kumpulkan data, pakai aturan pakar, anomaly detection (A3.11), atau model Bayesian dengan prior kuat.</p>
        <p><strong>Contoh nyata:</strong> deteksi money laundering pola baru.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Metrik dulu, teknik kemudian.</strong> Akurasi dilarang; PR-AUC + expected cost.</li>
          <li>Sampling <strong>hanya di data latih</strong> — tidak pernah di validasi/uji.</li>
          <li>Butuh probabilitas jujur → hindari sampling; pakai class weight + threshold.</li>
          <li>SMOTE bukan sihir: ia tidak menciptakan informasi, hanya menginterpolasi.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Model Fraud 0,1%</h2>
      <div className="callout">
        <p>Bank ingin model deteksi fraud kartu kredit: 2 juta transaksi/bulan, fraud rate <strong>0,1%</strong> (2.000 kasus). Tim investigasi mampu memeriksa <strong>5.000 transaksi/bulan</strong>. Vendor mengusulkan: &ldquo;SMOTE 50:50, akurasi 99%.&rdquo;</p>
        <p><strong>Pertanyaan:</strong> (a) Apa yang salah dari usulan vendor? (b) Rancang strategi yang benar: teknik + metrik + threshold. (c) Berapa precision minimum agar kapasitas 5.000 cukup untuk menangkap 60% fraud?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga kesalahan:</strong> (1) akurasi 99% tidak bermakna di base rate 0,1%; (2) SMOTE 50:50 tanpa menyebut validasi di data asli + probabilitasnya tidak terkalibrasi; (3) tidak ada pembahasan kapasitas investigasi — model yang menandai 50.000 transaksi/bulan tidak berguna walau &ldquo;akurat&rdquo;.</p>
          <p>(b) <strong>Strategi:</strong> class weight + gradient boosting; metrik = PR-AUC + precision/recall; threshold dipilih dari <em>kapasitas</em>: tandai tepat ~5.000/bulan (top-k ranking, bukan threshold probabilitas!). Evaluasi stratified group CV (satu kartu = satu grup).</p>
          <p>(c) Target: tangkap 60% × 2.000 = 1.200 fraud dari 5.000 yang diperiksa → precision minimum = 1.200/5.000 = <strong>24%</strong>. Ini target operasional yang jujur — jauh lebih bermakna daripada &ldquo;akurasi 99%&rdquo;.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Undersampling mayoritas 970 → 30. Apa yang hilang? Kapan ini OK?</li>
              <li>Anomaly detection (isolation forest) vs klasifikasi imbalance — kapan pilih yang pertama?</li>
              <li>Focal loss: intuisi 1 kalimat + kapan dipakai.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Hilang: <strong>informasi variasi mayoritas</strong> (970 → 30 = buang 97%!). OK saat: data raksasa (30rb masih mewakili) atau untuk <em>eksplorasi cepat</em>. Untuk model final: class weight lebih hemat info.</p>
              <p><strong>2.</strong> Saat positif <em>sangat</em> langka (&lt; 0,1%) atau <em>tidak berlabel lengkap</em> (fraud baru tak terdefinisi!) — anomaly detection tidak butuh contoh positif banyak, hanya &ldquo;profil normal&rdquo;.</p>
              <p><strong>3.</strong> &ldquo;Fokuskan loss pada contoh yang <em>salah/sulit</em>, abaikan yang sudah mudah.&rdquo; Dipakai: deteksi objek / NLP dengan imbalance ekstrem — saat class weight saja kurang.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Fraud rate 0,1%. Strategi pertama yang PALING tepat?"
        options={[
          "Langsung SMOTE 50:50",
          "Ganti metrik ke PR-AUC/expected cost + class weight; SMOTE hanya jika belum cukup",
          "Kumpulkan 10× data lagi",
          "Naikkan akurasi dengan model lebih kompleks",
        ]}
        correct={1}
        explanation="Benar: urutan kerja = metrik dulu, class weight (murah & aman), threshold tuning, SMOTE terakhir. SMOTE sebagai langkah pertama berisiko merusak kalibrasi dan validasi tanpa menyelesaikan akar masalah (insentif & metrik)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. SMOTE diterapkan SEBELUM train-test split. Akibat?"
        options={[
          "Tidak ada masalah",
          "Leakage: titik sintetis di test set 'bocor' dari titik asli di train set → performa terlihat bagus palsu",
          "Model jadi lebih cepat",
          "Akurasi pasti turun",
        ]}
        correct={1}
        explanation="Benar: SMOTE sebelum split mencemari test set dengan informasi dari train set (titik sintetis adalah interpolasi titik train). Validasi jadi tidak jujur. Aturan keras: sampling hanya di dalam fold latih."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Model butuh probabilitas untuk pricing (PD × LGD). Data imbalance 2%. Teknik yang AMAN?"
        options={[
          "SMOTE 50:50 lalu pakai probabilitasnya langsung",
          "Class weight + threshold tuning — menjaga kalibrasi relatif; hindari sampling yang merusak base rate",
          "Undersampling 50:50",
          "Akurasi sebagai metrik",
        ]}
        correct={1}
        explanation="Benar: sampling mengubah base rate → probabilitas bias → rupiah salah. Class weight + threshold tuning memisahkan 'estimasi jujur' dari 'keputusan optimal'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kenapa stratified CV WAJIB untuk data imbalance?"
        options={[
          "Agar lebih cepat",
          "Tanpa stratifikasi, fold bisa berisi nol sampel positif → metrik NaN/gaduh; proporsi kelas harus dijaga tiap fold",
          "Agar akurasi naik",
          "Tidak wajib",
        ]}
        correct={1}
        explanation="Benar: dengan 3% positif dan 5-fold CV acak, satu fold bisa kebetulan kosong dari positif. Stratifikasi menjamin tiap fold representatif. Untuk data berkelompok: stratified GROUP k-fold."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Minoritas hanya 40 sampel. Klaim 'SMOTE akan menyelesaikan masalah' — tanggapan?"
        options={[
          "Setuju — SMOTE menciptakan data baru",
          "Tidak — SMOTE hanya interpolasi; dari 40 titik tidak lahir informasi baru. Fokus: kumpulkan data / pakar / anomaly detection",
          "Setuju — asal k besar",
          "Tidak — pakai undersampling saja",
        ]}
        correct={1}
        explanation="Benar: tidak ada teknik yang menciptakan informasi dari ketiadaan. 40 titik yang diinterpolasi tetap 40 titik informasi. Solusi struktural: data, domain expert, atau pendekatan anomaly detection."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Class weight 1:32 membuat recall naik tapi precision anjlok ke 8%. Interpretasi?"
        options={[
          "Model rusak",
          "Tradeoff yang diharapkan: bobot memaksa model agresif menandai. Pilih bobot/threshold dari biaya bisnis, bukan maksimalkan satu metrik",
          "Bobot harus selalu = rasio imbalance",
          "Kembali ke tanpa bobot",
        ]}
        correct={1}
        explanation="Benar: tidak ada bobot 'benar' secara statistik — hanya ada bobot yang biayanya paling murah. Rasio imbalance adalah titik awal, bukan jawaban. Tuning dengan expected cost (A3.5)."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Imbalance merusak</strong> via prior dominan, gradien tenggelam, metrik menipu — tapi bukan masalah jika hanya butuh probabilitas.</li>
          <li><strong>Data-level:</strong> undersampling (buang info), oversampling (overfit hafalan), SMOTE (interpolasi — butuh jarak bermakna). <strong>Hanya di data latih!</strong></li>
          <li><strong>Algorithm-level:</strong> class weight (ubah insentif) + threshold tuning (optimasi keputusan) — lebih aman untuk kalibrasi.</li>
          <li><strong>Evaluasi:</strong> PR-AUC, precision/recall, expected cost; stratified (group) CV; validasi di distribusi asli.</li>
          <li><strong>Jangan</strong> pakai akurasi; jangan SMOTE sebelum split; jangan pakai probabilitas model-SMOTE untuk pricing tanpa koreksi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a36-kalibrasi" className="btn btn-secondary btn-sm">← A3.6</Link>
        <Link href="/learn/a38-validasi-model" className="btn btn-primary btn-sm">Next: A3.8 →</Link>
      </div>
    </div>
  );
}

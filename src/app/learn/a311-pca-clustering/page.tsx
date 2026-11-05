"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A311Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const screeData = [
    {
      x: ["PC1", "PC2", "PC3", "PC4", "PC5", "PC6", "PC7", "PC8"],
      y: [42, 23, 12, 8, 5, 4, 3, 3],
      type: "bar",
      name: "% variansi dijelaskan",
      marker: { color: "#2a7de1" },
      text: ["42%", "23%", "12%", "8%", "5%", "4%", "3%", "3%"],
      textposition: "outside",
    },
  ];

  const cumvarData = [
    {
      x: ["PC1", "PC2", "PC3", "PC4", "PC5", "PC6", "PC7", "PC8"],
      y: [42, 65, 77, 85, 90, 94, 97, 100],
      mode: "lines+markers",
      type: "scatter",
      name: "Kumulatif",
      line: { color: "#e8a838", width: 3 },
      marker: { size: 9 },
    },
    {
      x: ["PC1", "PC8"],
      y: [80, 80],
      mode: "lines",
      type: "scatter",
      name: "Ambang 80%",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const elbowData = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8],
      y: [820, 480, 310, 290, 270, 255, 245, 238],
      mode: "lines+markers",
      type: "scatter",
      name: "WCSS",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 9 },
    },
  ];

  const kmeansData = [
    {
      x: [1, 1.5, 2, 1.2, 5, 5.5, 6, 5.2, 9, 9.5, 10, 9.2],
      y: [1, 1.3, 0.8, 2, 5, 5.4, 4.8, 5.6, 1, 1.4, 0.9, 1.8],
      mode: "markers",
      type: "scatter",
      name: "Cluster A/B/C",
      marker: { color: ["#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#e8a838", "#e8a838", "#22c55e", "#22c55e", "#22c55e", "#22c55e"], size: 11 },
    },
    {
      x: [1.4, 5.4, 9.4],
      y: [1.3, 5.2, 1.3],
      mode: "markers",
      type: "scatter",
      name: "Centroid",
      marker: { color: "#ef4444", size: 15, symbol: "x" },
    },
    {
      x: [5.4],
      y: [1.3],
      mode: "markers",
      type: "scatter",
      name: "Anomali?",
      marker: { color: "#a855f7", size: 14, symbol: "star" },
    },
  ];

  const lab1Code = `# PCA dari nol: eigen-decomposition manual (2D -> 1D)
# Data: 2 fitur berkorelasi kuat. PCA mencari arah variansi maksimum.
import random, math
random.seed(71)

# fitur1 & fitur2 berkorelasi 0.9
x1 = [random.gauss(0, 1) for _ in range(200)]
x2 = [0.9*a + random.gauss(0, 0.44) for a in x1]

# standarisasi (WAJIB sebelum PCA!)
def std(v):
    m = sum(v)/len(v); s = math.sqrt(sum((a-m)**2 for a in v)/len(v))
    return [(a-m)/s for a in v]
z1, z2 = std(x1), std(x2)

# matriks kovarians 2x2 -> eigenvalue manual (rumus kuadratik)
n = len(z1)
c11 = sum(a*a for a in z1)/n; c22 = sum(b*b for b in z2)/n
c12 = sum(a*b for a, b in zip(z1, z2))/n
tr = c11 + c22; det = c11*c22 - c12**2
l1 = (tr + math.sqrt(tr**2 - 4*det))/2
l2 = (tr - math.sqrt(tr**2 - 4*det))/2

print(f"Kovarians: [[{c11:.3f}, {c12:.3f}], [{c12:.3f}, {c22:.3f}]]")
print(f"Eigenvalue PC1 = {l1:.3f} ({l1/(l1+l2):.1%} variansi)")
print(f"Eigenvalue PC2 = {l2:.3f} ({l2/(l1+l2):.1%} variansi)")
print()
print("INTERPRETASI: PC1 menangkap 95%+ variansi - 2 fitur berkorelasi")
print("kuat ini sebenarnya 'satu' informasi. Buang PC2 = buang 5% info,")
print("hemat 50% dimensi. Itulah inti PCA: kompresi dengan garansi.")
print()
# proyeksi ke PC1 (eigenvector untuk l1)
vx, vy = c12, l1 - c11
norm = math.hypot(vx, vy); vx, vy = vx/norm, vy/norm
pc1 = [vx*a + vy*b for a, b in zip(z1, z2)]
print(f"Arah PC1: ({vx:.3f}, {vy:.3f}) - diagonal, mengikuti korelasi.")
print(f"Contoh proyeksi 3 titik pertama: {[f'{v:.2f}' for v in pc1[:3]]}")
print()
print("COBA: ubah korelasi 0.9 -> 0.2. PC1 kini hanya ~60% - PCA")
print("tidak berguna jika fitur tidak berkorelasi!")`;

  const lab2Code = `# K-means dari nol + deteksi anomali via jarak ke centroid
import random, math
random.seed(88)

# 3 gugus nasabah: (transaksi/bln, rata2 nominal jt)
data = ([(random.gauss(5,1.5), random.gauss(2,0.6)) for _ in range(60)] +
        [(random.gauss(20,3), random.gauss(8,1.5)) for _ in range(60)] +
        [(random.gauss(45,5), random.gauss(1,0.4)) for _ in range(60)])
data.append((22, 25.0))   # ANOMALI: transaksi sedang tapi nominal RAKSASA

def dist(a, b): return math.hypot(a[0]-b[0], a[1]-b[1])

# standarisasi
m1 = sum(p[0] for p in data)/len(data); s1 = math.sqrt(sum((p[0]-m1)**2 for p in data)/len(data))
m2 = sum(p[1] for p in data)/len(data); s2 = math.sqrt(sum((p[1]-m2)**2 for p in data)/len(data))
Z = [((p[0]-m1)/s1, (p[1]-m2)/s2) for p in data]

# K-means k=3
k = 3
cent = [Z[0], Z[60], Z[120]]
for _ in range(50):
    cl = [min(range(k), key=lambda c: dist(z, cent[c])) for z in Z]
    new = []
    for c in range(k):
        pts = [z for z, cc in zip(Z, cl) if cc == c]
        new.append((sum(p[0] for p in pts)/len(pts), sum(p[1] for p in pts)/len(pts)))
    if all(dist(a, b) < 1e-6 for a, b in zip(cent, new)): break
    cent = new

print("Centroid (skala asli):")
for c in range(k):
    pts = [(p[0]*s1+m1, p[1]*s2+m2) for p, cc in zip(data, cl) if cc == c]
    print(f"  Cluster {c}: n={len(pts):>3}, pusat=({sum(p[0] for p in pts)/len(pts):5.1f}, {sum(p[1] for p in pts)/len(pts):4.1f})")
print()
print("Profil bisnis:")
print("  Cluster 0: transaksi sedikit, nominal kecil -> RITEL")
print("  Cluster 1: transaksi banyak, nominal sedang -> KORPORAT AKTIF")
print("  Cluster 2: transaksi sangat banyak, nominal kecil -> AGEN/QRIS")
print()
# Anomali: jarak terjauh ke centroid-nya sendiri
dists = sorted([(dist(z, cent[cc]), i) for i, (z, cc) in enumerate(zip(Z, cl))], reverse=True)
print("Top-3 'paling jauh dari centroid cluster-nya':")
for d, i in dists[:3]:
    p = data[i]
    print(f"  ({p[0]:5.1f}, {p[1]:5.1f}) jarak={d:.2f} -> {'ANOMALI!' if p==(22,25.0) else ''}")
print()
print("COBA: hapus titik anomali, jalankan lagi. Centroid bergeser?")
print("K-means sensitif outlier - untuk fraud, itu justru sinyal.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.11 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Belajar Tanpa Label:<br />PCA, Clustering &amp; Deteksi Anomali</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#prasyarat">Prasyarat 2 Menit: Dari Supervised ke Unsupervised</a></li>
          <li><a href="#cerita">Cerita Pembuka: 50 Kolom, 3 Cerita, 1 Penipu</a></li>
          <li><a href="#pca">PCA — Merampingkan Dimensi Tanpa Kehilangan Cerita</a></li>
          <li><a href="#kmeans">K-Means — Mengelompokkan yang Serupa</a></li>
          <li><a href="#anomali">Deteksi Anomali — Berburu yang Tidak Wajar</a></li>
          <li><a href="#lab1">🔬 Lab 1: PCA dari Nol (Eigen Manual)</a></li>
          <li><a href="#lab2">🔬 Lab 2: K-Means dari Nol + Anomali</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: PCA, Clustering, atau Anomali?</a></li>
          <li><a href="#case">📋 Mini-Case: Pipeline Anti-Fraud Tanpa Label</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan ide PCA (arah variansi maksimum) dan membaca scree plot untuk memilih jumlah komponen.</li>
          <li>Menjalankan logika K-means (assign–update) dan memilih k via elbow method + validasi bisnis.</li>
          <li>Membandingkan tiga pendekatan deteksi anomali (jarak, densitas, isolasi) dan memilih yang tepat untuk fraud.</li>
          <li>Merancang pipeline unsupervised end-to-end: PCA → clustering → anomaly scoring untuk kasus tanpa label.</li>
        </ul>
      </div>

      {/* PRASYARAT */}
      <h2 id="prasyarat">📦 Prasyarat 2 Menit: Dari Supervised ke Unsupervised</h2>
      <div className="callout">
        <p>Sejauh ini semua lesson adalah <strong>supervised learning</strong>: ada target <Tex math={String.raw`y`} /> (default/tidak, LGD berapa) dan model belajar memetakkan <Tex math={String.raw`x \to y`} />. Lesson ini memasuki <strong>unsupervised learning</strong>: <strong>tidak ada target</strong> — hanya <Tex math={String.raw`x`} />. Tujuannya bukan prediksi, melainkan <strong>struktur</strong>: &ldquo;pola apa yang tersembunyi di data ini?&rdquo; Tiga pertanyaan, tiga alat: (1) &ldquo;terlalu banyak kolom&rdquo; → <strong>PCA</strong> (kompresi); (2) &ldquo;ada berapa kelompok alami?&rdquo; → <strong>clustering</strong>; (3) &ldquo;mana yang tidak wajar?&rdquo; → <strong>deteksi anomali</strong>. Evaluasinya pun berbeda: tidak ada &ldquo;akurasi&rdquo; — yang ada adalah <em>kegunaan bisnis</em> dari struktur yang ditemukan.</p>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 50 Kolom, 3 Cerita, 1 Penipu</h2>
      <div className="story">
        <p>Bank mewarisi database nasabah korporat: <strong>50 kolom</strong> rasio keuangan per nasabah, tanpa label apa pun — tidak ada yang tahu mana yang bermasalah. Tim junior menyerah: &ldquo;50 dimensi tidak bisa divisualisasikan, tidak bisa dianalisis manual.&rdquo;</p>
        <p>Analis senior melakukan tiga langkah dalam satu sore. <strong>Pertama</strong>, PCA: 50 kolom ternyata 90% variansinya dijelaskan <strong>3 komponen</strong> — &ldquo;ukuran&rdquo;, &ldquo;profitabilitas&rdquo;, &ldquo;leverage&rdquo;. <strong>Kedua</strong>, K-means di 3 komponen itu: muncul 4 kelompok alami — termasuk satu kelompok kecil &ldquo;perusahaan besar tapi rugi terus&rdquo;. <strong>Ketiga</strong>, anomaly detection: satu perusahaan <strong>tidak masuk akal</strong> — labanya terlalu mulus, terlalu sempurna, tidak seperti perusahaan nyata mana pun.</p>
        <p>Investigasi: perusahaan itu fiktif — cangkang untuk <em>fraud</em> kredit Rp40 miliar. Twist-nya: tidak ada model supervised yang bisa menemukan ini — <strong>tidak ada label &ldquo;fraud&rdquo;</strong> untuk dilatih! Inilah kekuatan unsupervised: menemukan yang tidak kamu tahu cara mencarinya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="pca">PCA — Merampingkan Dimensi Tanpa Kehilangan Cerita</h2>
      <p><strong>Definisi.</strong> PCA (<em>principal component analysis</em>) mencari <strong>arah-orthogonal</strong> baru (komponen utama) yang menangkap <strong>variansi maksimum</strong> data, berurutan: PC1 = arah paling bervariasi, PC2 = arah paling bervariasi yang tegak lurus PC1, dst.</p>
      <p>Matematikanya: komponen utama adalah <strong>eigenvector</strong> matriks kovarians <Tex math={String.raw`\Sigma`} />, dan <strong>eigenvalue</strong> <Tex math={String.raw`\lambda_i`} /> = variansi yang dijelaskan PC ke-<Tex math={String.raw`i`} />:</p>
      <Tex math={String.raw`\Sigma v_i = \lambda_i v_i, \qquad \text{proporsi} = \frac{\lambda_i}{\sum_j \lambda_j}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\Sigma`} />: matriks kovarians — &ldquo;peta&rdquo; bagaimana tiap pasangan fitur bergerak bersama</li>
        <li><Tex math={String.raw`v_i`} /> (eigenvector): <em>arah</em> PC ke-<Tex math={String.raw`i`} /> — kombinasi linear fitur asli (misal PC1 = 0,7×aset + 0,7×pendapatan)</li>
        <li><Tex math={String.raw`\lambda_i`} /> (eigenvalue): <em>seberapa besar</em> variansi di arah itu — &ldquo;nilai informasi&rdquo; tiap komponen</li>
      </ul>

      <PlotlyChart
        data={screeData}
        title="Scree Plot: berapa komponen yang disimpan?"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "% variansi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % variansi yang dijelaskan tiap PC, berurutan menurun.</p>
        <p><strong>Interpretasi:</strong> PC1–PC3 menjelaskan 42+23+12 = <strong>77%</strong>; setelah PC3, batangnya &ldquo;landai&rdquo; (scree = puing) — komponen 4+ masing-masing &lt;10% dan kemungkinan besar noise. <strong>Aturan praktis:</strong> potong di &ldquo;siku&rdquo; (elbow) atau saat kumulatif ≥ 80–90%. Di sini: simpan 3–4 komponen, buang sisanya.</p>
      </div>

      <PlotlyChart
        data={cumvarData}
        title="Variansi Kumulatif: 3 PC ≈ 77%"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "% kumulatif", range: [0, 105] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis kuning = total variansi yang dipertahankan jika menyimpan sampai PC tersebut; garis putus-putus = ambang 80%.</p>
        <p><strong>Interpretasi:</strong> 3 PC mencapai 77%, 4 PC mencapai 85% (melewati ambang). Keputusan &ldquo;3 atau 4&rdquo; adalah tradeoff kompresi vs informasi — tidak ada jawaban tunggal; pilih berdasarkan kebutuhan downstream (visualisasi 2D? butuh 2. Atau butuh 85% untuk modeling? butuh 4).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;PCA memilih fitur terbaik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> PCA tidak memilih fitur — ia <strong>mencampur</strong> semua fitur menjadi komponen baru. PC1 = 0,7×aset + 0,7×pendapatan − 0,1×umur... bukan &ldquo;fitur aset&rdquo;. Konsekuensi: (1) interpretasi lebih sulit (komponen adalah ramuan); (2) jika tujuanmu <em>seleksi fitur</em> (tahu variabel mana penting), pakai Lasso (A3.3), bukan PCA. PCA untuk <em>kompresi &amp; visualisasi</em>, bukan seleksi.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Standarisasi WAJIB sebelum PCA!</strong> PCA memaksimalkan <em>variansi</em> — fitur dalam rupiah (variansi jutaan) akan &ldquo;menang&rdquo; atas fitur dalam persen (variansi kecil) bukan karena lebih penting, tapi karena satuannya besar. Selalu standarkan (<Tex math={String.raw`z`} />-score) dulu, kecuali semua fitur memang satu satuan yang sebanding.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> baca <strong>loadings</strong> (bobot tiap fitur di tiap PC) untuk memberi nama komponen: jika PC1 dibobot besar oleh aset, pendapatan, karyawan → namai &ldquo;ukuran perusahaan&rdquo;. PCA yang baik <em>bercerita</em> — komponen tanpa interpretasi bisnis adalah kompresi tanpa makna. Dan ingat: PCA hanya menangkap struktur <strong>linear</strong>; jika polanya melengkung (donat, spiral), butuh metode non-linear (kernel PCA, UMAP).</p>
      </div>

      <h2 id="kmeans">K-Means — Mengelompokkan yang Serupa</h2>
      <p><strong>Definisi.</strong> K-means membagi data jadi <Tex math={String.raw`k`} /> cluster dengan meminimalkan <strong>WCSS</strong> (<em>within-cluster sum of squares</em> — total kuadrat jarak ke centroid cluster masing-masing):</p>
      <Tex math={String.raw`\min \sum_{c=1}^{k} \sum_{i \in C_c} \|x_i - \mu_c\|^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`C_c`} />: himpunan anggota cluster ke-<Tex math={String.raw`c`} /></li>
        <li><Tex math={String.raw`\mu_c`} />: <strong>centroid</strong> — rata-rata anggota cluster = &ldquo;prototipe&rdquo; kelompok itu</li>
        <li>Algoritma: (1) assign tiap titik ke centroid terdekat → (2) hitung ulang centroid → ulangi sampai stabil. Dijamin konvergen (tapi bisa ke <em>local optimum</em> — ulangi dengan inisialisasi beda!).</li>
      </ul>

      <PlotlyChart
        data={kmeansData}
        title="K-Means: 3 cluster + centroid + 1 anomali"
        layout={{ xaxis: { title: "Transaksi/bulan" }, yaxis: { title: "Rata-rata nominal (jt)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik berwarna = 3 cluster; silang merah = centroid (pusat tiap kelompok); bintang ungu = titik yang tidak wajar.</p>
        <p><strong>Interpretasi:</strong> cluster biru = ritel (sedikit, kecil), kuning = korporat aktif, hijau = agen QRIS (banyak, kecil). Bintang ungu (transaksi sedang, nominal <strong>raksasa</strong>) tidak cocok di cluster manapun — inilah jembatan ke deteksi anomali. <strong>Profil cluster harus diterjemahkan ke bahasa bisnis</strong> — cluster tanpa nama adalah angka tanpa makna.</p>
      </div>

      <PlotlyChart
        data={elbowData}
        title="Elbow Method: WCSS vs k"
        layout={{ xaxis: { title: "k (jumlah cluster)" }, yaxis: { title: "WCSS" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = k, vertikal = WCSS (makin kecil = cluster makin kompak).</p>
        <p><strong>Interpretasi:</strong> WCSS turun tajam 1→3 lalu melandai — <strong>siku di k=3</strong>. Menambah cluster ke-4+ hanya memecah kelompok alami tanpa banyak memperbaiki kekompakan (= overfitting clustering). <strong>Validasi sebenarnya:</strong> apakah k=3 menghasilkan segmen yang <em>ditindaklanjuti berbeda</em> oleh bisnis? Jika dua cluster diperlakukan sama → gabung saja.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;K-means menemukan kelompok yang benar-benar ada.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> K-means <strong>selalu</strong> menghasilkan k cluster — bahkan dari data acak tanpa struktur! Ia tidak &ldquo;menemukan&rdquo; kelompok; ia <strong>memaksakan</strong> partisi. Cluster &ldquo;benar&rdquo; hanya jika (1) stabil antar inisialisasi/sampel, dan (2) bermakna bagi bisnis. Selalu uji: acak ulang, bootstrap, dan tanya domain expert &ldquo;masuk akal tidak?&rdquo;.</p>
      </div>

      <h2 id="anomali">Deteksi Anomali — Berburu yang Tidak Wajar</h2>
      <p><strong>Definisi.</strong> Anomali = observasi yang <strong>tidak sesuai pola mayoritas</strong>. Tiga keluarga pendekatan:</p>
      <ul>
        <li><strong>Berbasis jarak:</strong> skor = jarak ke centroid/tetangga (seperti Lab 2). Sederhana, tapi gagal di dimensi tinggi (<em>curse of dimensionality</em> — semua jarak jadi mirip).</li>
        <li><strong>Berbasis densitas</strong> (LOF — <em>local outlier factor</em>): bandingkan kepadatan lokal titik vs tetangganya. Kuat untuk cluster berkepadatan beda — tapi mahal komputasinya.</li>
        <li><strong>Berbasis isolasi</strong> (<strong>Isolation Forest</strong>): anomali = titik yang <strong>mudah diisolasi</strong> dengan partisi acak (sedikit &ldquo;potongan&rdquo; sudah memisahkannya). Counter-intuitive tapi brilian: tidak perlu memodelkan &ldquo;normal&rdquo; — cukup ukur &ldquo;betapa cepat ia terpisah&rdquo;. Standar industri untuk fraud/skor anomali.</li>
      </ul>
      <p><strong>Parameter kunci:</strong> <em>contamination</em> — perkiraan % anomali (misal 1%). Ini bukan hasil — ini <strong>asumsi input</strong> yang menentukan threshold! Salah tebak → banjir alarm palsu atau banyak yang lolos.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> anomali ≠ fraud. Anomali = &ldquo;tidak biasa&rdquo; — bisa jadi error input, nasabah sultan yang valid, atau pola bisnis baru. <strong>Pipeline yang benar:</strong> unsupervised scoring → <em>human review</em> sampel teratas → label terkumpul → latih supervised (A3.4–A3.7). Deteksi anomali adalah <strong>pintu masuk</strong>, bukan vonis. Dan untuk fraud adaptif (penipu belajar), anomali harus di-retrain berkala — polanya bergerak.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Unsupervised = &ldquo;temukan struktur tanpa diberi tahu&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: PCA — 20 fitur → 3 komponen</summary>
              <p>20 rasio keuangan berkorelasi. PCA: 3 komponen pertama menjelaskan 85% varians. Apa yang didapat &amp; hilang?</p>
              <p><strong>Langkah 1</strong> — dapat: 3 fitur <em>tidak berkorelasi</em> (PC1, PC2, PC3) — 85% informasi, 1/7 dimensi.<br />
              <strong>Langkah 2</strong> — hilang: 15% varians + <em>interpretabilitas</em> (PC1 = &ldquo;campuran 20 rasio&rdquo; — bukan &ldquo;profitabilitas&rdquo;!).<br />
              <strong>Langkah 3</strong> — cek: scree plot — &ldquo;siku&rdquo; di 3 = titik berhenti. Jangan pakai 10 PC &ldquo;karena bisa&rdquo; (defeats the purpose!).</p>
              <p>Pelajaran: PCA = kompresi, bukan pemahaman. Untuk visualisasi &amp; de-noise: bagus. Untuk &ldquo;fitur mana yang penting&rdquo;: salah alat.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: K-means — segmentasi nasabah, k=3 vs k=5</summary>
              <p>10.000 nasabah, fitur: penghasilan, usia. Elbow: k=3 &ldquo;siku&rdquo; jelas. Bisnis minta 5 segmen (&ldquo;lebih detail&rdquo;!).</p>
              <p><strong>Langkah 1</strong> — k=3: segmen stabil, terpisah jelas, <em>actionable</em> (3 strategi).<br />
              <strong>Langkah 2</strong> — k=5: 2 segmen mungil &amp; tidak stabil (berubah tiap run!) — &ldquo;detail&rdquo; palsu.<br />
              <strong>Langkah 3</strong> — putusan: <strong>k=3</strong>. Segmentasi yang tidak stabil = tidak bisa dioperasionalkan (tim bingung &ldquo;nasabah ini segmen apa bulan ini?&rdquo;).</p>
              <p>Pelajaran: &ldquo;lebih banyak segmen&rdquo; ≠ &ldquo;lebih baik&rdquo;. Kriteria: stabilitas + keterpisahan + <em>actionability</em>. Clustering tanpa tujuan bisnis = seni, bukan analisis.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: PCA dari Nol (Eigen Manual)</h2>
      <p>Hitung eigenvalue matriks kovarians 2×2 dengan rumus kuadratik. Lihat kompresi 95%+ terjadi.</p>
      <PyodideLab
        title="Lab 1 — Eigen-decomposition Manual"
        hint="Coba: korelasi 0.9 → 0.2. PC1 anjlok ke ~60% — PCA butuh korelasi untuk berguna."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: K-Means dari Nol + Anomali</h2>
      <p>Implementasi assign–update K-means, profilkan cluster secara bisnis, lalu buru anomali via jarak.</p>
      <PyodideLab
        title="Lab 2 — K-Means + Anomaly Scoring"
        hint="Hapus titik anomali, jalankan lagi — centroid bergeser? K-means sensitif outlier."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: PCA, Clustering, atau Anomali?</h2>

      <div className="decision-card">
        <h3>1. Terlalu banyak kolom berkorelasi → <strong>PCA</strong></h3>
        <p><strong>Kondisi:</strong> puluhan/ratusan fitur, multikolinearitas, butuh visualisasi atau input model lebih ramping.</p>
        <p><strong>Kenapa:</strong> kompresi dengan garansi variansi; menghilangkan redundansi sebelum modeling.</p>
        <p><strong>Contoh nyata:</strong> 50 rasio keuangan → 3 komponen untuk dashboard risiko.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ingin segmen alami untuk strategi berbeda → <strong>clustering (K-means)</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada label; butuh kelompok yang ditindaklanjuti berbeda.</p>
        <p><strong>Kenapa:</strong> menemukan struktur; tiap cluster = persona bisnis.</p>
        <p><strong>Contoh nyata:</strong> segmentasi nasabah untuk strategi koleksi berbeda.</p>
      </div>

      <div className="decision-card">
        <h3>3. Tidak ada label fraud, ingin kandidat investigasi → <strong>deteksi anomali</strong></h3>
        <p><strong>Kondisi:</strong> fraud langka/tanpa label; butuh daftar prioritas review manusia.</p>
        <p><strong>Kenapa:</strong> Isolation Forest tidak butuh contoh fraud — cukup tahu &ldquo;normal&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> skrining transaksi mencurigakan untuk tim AML.</p>
      </div>

      <div className="decision-card">
        <h3>4. Cluster berbentuk aneh (bukan bola) → <strong>bukan K-means!</strong></h3>
        <p><strong>Kondisi:</strong> pola melingkar/memanjang; cluster berukuran sangat beda.</p>
        <p><strong>Kenapa:</strong> K-means mengasumsikan cluster bola berukuran mirip (jarak Euclidean). Pakai DBSCAN (densitas) atau Gaussian Mixture.</p>
        <p><strong>Contoh nyata:</strong> pola transaksi geografis memanjang.</p>
      </div>

      <div className="decision-card">
        <h3>5. Butuh tahu FITUR mana yang penting (bukan kompresi) → <strong>bukan PCA!</strong></h3>
        <p><strong>Kondisi:</strong> tujuan = seleksi/interpretasi variabel.</p>
        <p><strong>Kenapa:</strong> PCA mencampur fitur. Pakai Lasso (A3.3) atau feature importance tree (A3.15).</p>
        <p><strong>Contoh nyata:</strong> memilih 10 variabel untuk scorecard regulator.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Standarkan dulu</strong> — untuk PCA, K-means, dan deteksi jarak. Selalu.</li>
          <li>PCA = kompresi (bukan seleksi). K-means = partisi (bukan penemuan mutlak). Anomali = kandidat (bukan vonis).</li>
          <li>Cluster tanpa nama bisnis = angka tanpa makna. Beri nama tiap cluster.</li>
          <li>Pipeline fraud: unsupervised → review manusia → label → supervised. Melingkar, bukan sekali jalan.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Pipeline Anti-Fraud Tanpa Label</h2>
      <div className="callout">
        <p>Fintech P2P punya 800.000 transaksi/bulan, <strong>tanpa label fraud</strong> (belum pernah investigasi sistematis). Kamu diminta membangun &ldquo;sistem deteksi dini&rdquo;. Fitur: nominal, frekuensi, jam, perangkat, lokasi.</p>
        <p><strong>Pertanyaan:</strong> (a) Rancang pipeline 3 tahap (PCA → clustering → anomali). (b) Tim investigasi hanya mampu review 500 transaksi/bulan — bagaimana menentukan threshold? (c) Setelah 3 bulan terkumpul 200 label fraud — langkah berikutnya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tahap 1 — PCA:</strong> standarkan fitur, simpan komponen hingga 85% variansi (kemungkinan 3–5 dari ~15 fitur engineered) — juga untuk visualisasi 2D. <strong>Tahap 2 — K-means:</strong> cluster perilaku (misal: ritel malam, korporat pagi, agen) — anomali dinilai <em>relatif terhadap cluster-nya</em> (transaksi Rp50 jt aneh untuk ritel, biasa untuk korporat). <strong>Tahap 3 — Isolation Forest</strong> per cluster → skor anomali 0–1.</p>
          <p>(b) <strong>Top-k, bukan threshold probabilitas:</strong> urutkan skor tertinggi, ambil 500 teratas — pas dengan kapasitas. Ini operasional, bukan statistik. Catat: contamination hanyalah tebakan awal; yang menentukan adalah kapasitas review.</p>
          <p>(c) <strong>Tutup lingkaran:</strong> 200 label → latih supervised (logistik/gradient boosting) dengan validasi jujur → bandingkan vs pipeline unsupervised (challenger!). Unsupervised tetap jalan untuk pola <em>baru</em> yang belum ada labelnya — keduanya komplementer, bukan pengganti.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Mengapa standardize <em>wajib</em> sebelum PCA &amp; K-means? (Beri contoh angka.)</li>
              <li>Anomali: isolation forest vs z-score — kapan yang pertama menang?</li>
              <li>DBSCAN menemukan 1 cluster besar + 200 &ldquo;noise&rdquo;. Interpretasikan untuk fraud.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> PCA/K-means berbasis <em>jarak/varians</em>: fitur 0–1jt mendominasi fitur 0–1 (contoh: penghasilan &ldquo;menang&rdquo; atas usia 0–100!). Standardize → kontribusi adil. Tanpa ini, hasil = artefak skala.</p>
              <p><strong>2.</strong> Saat anomali <em>multivariat</em> (tiap fitur normal sendiri, kombinasinya aneh!) — z-score per fitur buta terhadap ini. Isolation forest memotong ruang fitur → isolasi cepat = anomali.</p>
              <p><strong>3.</strong> 200 noise = <strong>kandidat fraud untuk investigasi</strong> (transaksi tak berpola normal!). Tapi: noise ≠ fraud pasti — butuh aturan bisnis/label. DBSCAN = <em>penyaring</em>, bukan vonis.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Lupa menstandarkan sebelum PCA. Fitur A dalam rupiah (variansi 10¹²), fitur B dalam persen (variansi 25). Akibat?"
        options={[
          "Tidak ada — PCA robust terhadap skala",
          "PC1 didominasi fitur A bukan karena lebih penting, tapi karena satuannya besar — hasil menyesatkan",
          "PCA error",
          "Fitur B otomatis dibuang",
        ]}
        correct={1}
        explanation="Benar: PCA memaksimalkan variansi mentah. Tanpa standarisasi, 'pemenang' ditentukan satuan, bukan informasi. Aturan keras: standarkan dulu (kecuali semua fitur satu satuan sebanding)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. K-means dengan k=5 pada data acak murni (tanpa struktur). Apa yang terjadi?"
        options={[
          "Error — tidak ada cluster",
          "Tetap menghasilkan 5 cluster! K-means memaksakan partisi. Validasi: stabilitas + makna bisnis",
          "Otomatis memilih k=1",
          "Centroid tidak konvergen",
        ]}
        correct={1}
        explanation="Benar: K-means tidak tahu apakah struktur itu 'nyata'. Ia selalu mempartisi. Jangan percaya cluster hanya karena algoritma mengeluarkannya — uji stabilitas dan tanya domain expert."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Scree plot: PC1 45%, PC2 25%, PC3 8%, sisanya <5% landai. Berapa komponen disimpan?"
        options={[
          "Semua — jangan buang info",
          "2–3: siku setelah PC2/PC3; 2 PC = 70%, 3 PC = 78%. Pilih berdasar kebutuhan (visualisasi vs modeling)",
          "Hanya PC1",
          "Acak",
        ]}
        correct={1}
        explanation="Benar: potong di siku. 2 untuk visualisasi 2D yang bersih; 3 jika butuh variansi lebih untuk modeling. Tidak ada jawaban tunggal — ada tradeoff yang dijelaskan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kenapa Isolation Forest cocok untuk fraud tanpa label?"
        options={[
          "Butuh banyak contoh fraud",
          "Tidak memodelkan 'normal' — anomali = titik yang cepat terisolasi partisi acak. Tidak butuh label sama sekali",
          "Selalu 100% akurat",
          "Hanya untuk data kecil",
        ]}
        correct={1}
        explanation="Benar: logika terbalik yang brilian — alih-alih mendefinisikan normal (sulit), ukur 'betapa mudah ia dipisahkan'. Cocok saat label tidak ada, tapi outputnya skor prioritas, bukan vonis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Cluster berbentuk cincin/donat. K-means dengan k=2. Masalah?"
        options={[
          "Tidak ada — K-means universal",
          "K-means mengasumsikan cluster bola (jarak Euclidean) — gagal total untuk bentuk non-convex. Pakai DBSCAN",
          "Naikkan k",
          "Standarkan lagi",
        ]}
        correct={1}
        explanation="Benar: asumsi geometris K-means = bola. Donat akan dipotong paksa jadi dua setengah lingkaran yang salah. Kenali asumsi algoritmamu — DBSCAN (densitas) menangani bentuk bebas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Skor anomali menandai transaksi direktur (valid, nominal besar). Tindakan?"
        options={[
          "Blokir otomatis — skor tinggi = fraud",
          "Anomali ≠ fraud: review manusia dulu. Skor adalah prioritas antrean, bukan vonis. Pertimbangkan whitelist/aturan bisnis untuk pola valid yang langka",
          "Turunkan contamination ke 0",
          "Buang fitur nominal",
        ]}
        correct={1}
        explanation="Benar: unsupervised tidak tahu 'valid tapi langka' vs 'jahat'. Human-in-the-loop wajib; pola valid yang langka ditangani dengan aturan bisnis/whitelist, bukan dengan merusak model."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>PCA:</strong> eigenvector kovarians = arah variansi maks; eigenvalue = nilainya. Scree plot → potong di siku. <strong>Standarkan dulu!</strong></li>
          <li><strong>K-means:</strong> minimasi WCSS via assign–update; k via elbow + makna bisnis; selalu menghasilkan k cluster bahkan dari acak.</li>
          <li><strong>Anomali:</strong> jarak vs densitas (LOF) vs isolasi (Isolation Forest). Contamination = asumsi input. Anomali ≠ vonis.</li>
          <li><strong>Pipeline:</strong> PCA → clustering → anomaly → review manusia → label → supervised. Melingkar.</li>
          <li><strong>Jangan</strong> pakai PCA untuk seleksi fitur; jangan pakai K-means untuk cluster non-bola; jangan blokir otomatis dari skor anomali.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a310-volatilitas" className="btn btn-secondary btn-sm">← A3.10</Link>
        <Link href="/learn/a312-survival-analysis" className="btn btn-primary btn-sm">Next: A3.12 →</Link>
      </div>
    </div>
  );
}

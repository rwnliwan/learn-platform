"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR7Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const algoData = [
    {
      x: ["Logistic Reg.", "Random Forest", "XGBoost", "XGBoost + tuned", "XGBoost + fitur pakar"],
      y: [0.78, 0.85, 0.90, 0.915, 0.955],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["0,78", "0,85", "0,90", "0,915", "0,955"],
      textposition: "outside",
    },
  ];

  const weightData = [
    {
      x: [1, 5, 10, 20, 50, 100],
      y: [42, 58, 68, 74, 76, 75],
      type: "scatter",
      mode: "lines+markers",
      name: "Recall (%)",
      marker: { color: "#e05252" },
    },
    {
      x: [1, 5, 10, 20, 50, 100],
      y: [38, 30, 24, 19, 14, 11],
      type: "scatter",
      mode: "lines+markers",
      name: "Precision (%)",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `# Class weight: 'denda' untuk salah klasifikasi kelas minoritas
# Data sintetis 1D: 1000 normal (skor 20-50), 20 fraud (skor 60-90)
import random
random.seed(5)

normal = [random.gauss(35, 8) for _ in range(1000)]
fraud  = [random.gauss(75, 8) for _ in range(20)]

def weighted_threshold(weight):
    # Model sederhana: prediksi fraud jika skor > t.
    # 'weight' menggeser t ke bawah (makin peduli fraud).
    t = 60 - (weight - 1) * 0.35
    tp = sum(1 for s in fraud if s > t)
    fp = sum(1 for s in normal if s > t)
    recall = tp / len(fraud) * 100
    prec = tp / (tp + fp) * 100 if (tp + fp) else 0
    return t, recall, prec

print(f"{'Weight':>6s} {'Ambang':>6s} {'Recall':>7s} {'Precision':>9s}")
for w in [1, 5, 10, 25, 50]:
    t, r, p = weighted_threshold(w)
    print(f"{w:6d} {t:6.1f} {r:6.1f}% {p:8.1f}%")
print()
print("COBA UBAH: rentang fraud gauss(75,8) -> gauss(55,10) (overlap dengan normal).")
print("Pelajaran: class weight MENGORBANKAN precision demi recall.")
print("Weight optimal = yang memaksimalkan NILAI BISNIS (FR9), bukan akurasi.")`;

  const lab2Code = `# Cost-sensitive: hitung BIAYA keputusan, bukan sekadar benar/salah
# Matriks biaya (Rp): FN (fraud lolos) jauh lebih mahal dari FP (review sia-sia)
COST_FN = 1_100_000   # rata-rata loss per fraud yang lolos
COST_FP = 25_000      # biaya investigator per review false positive

import random
random.seed(9)
# 5000 transaksi, 100 fraud. Model memberi skor; kita pilih ambang.
skor_fraud = [random.gauss(0.75, 0.15) for _ in range(100)]
skor_ok = [random.gauss(0.25, 0.15) for _ in range(4900)]

def total_cost(ambang):
    fn = sum(1 for s in skor_fraud if s < ambang)
    fp = sum(1 for s in skor_ok if s >= ambang)
    return fn * COST_FN + fp * COST_FP, fn, fp

print(f"{'Ambang':>6s} {'FN':>4s} {'FP':>5s} {'Total biaya':>12s}")
terbaik = None
for a in [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:
    c, fn, fp = total_cost(a)
    print(f"{a:6.1f} {fn:4d} {fp:5d} Rp{c/1e6:8.1f} jt")
    if terbaik is None or c < terbaik[0]: terbaik = (c, a)
print(f"\nAmbang termurah: {terbaik[1]} (biaya Rp{terbaik[0]/1e6:.1f} jt)")
print()
print("COBA UBAH: COST_FP 25_000 -> 100_000 (investigator mahal).")
print("Ambang optimal BERGESER ke atas. Pelajaran: threshold optimal =")
print("fungsi BIAYA BISNIS, bukan properti model. Inilah inti FR11.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR7 — Fraud / ML Analytics</span>
        <h1 className="display-title">Supervised ML: Saat Mesin<br />Belajar dari Investigator</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 40 Fitur, 1 Baris yang Mengubah Segalanya</a></li>
          <li><a href="#gbm">Gradient Boosting: Kenapa Ia Raja Tabel Fraud</a></li>
          <li><a href="#imbalance">Imbalance: 1 Berbanding 500</a></li>
          <li><a href="#weight">Class Weight: Denda untuk Kesalahan Mahal</a></li>
          <li><a href="#cost">Cost-Sensitive: Berpikir dalam Rupiah, Bukan Akurasi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Class Weight Menggeser Trade-off</a></li>
          <li><a href="#lab2">🔬 Lab 2: Threshold dari Matriks Biaya</a></li>
          <li><a href="#worked">📐 Worked Example: Class Weight &amp; Threshold Biaya</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Loss Function adalah Insentif</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Konfigurasi untuk Tiap Situasi</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Memilih Senjata ML</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Skor Transaksi Bank Digital</a></li>

          <li><a href="#case">📋 Mini-Case: Pilih Konfigurasi untuk PayKu</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Supervised ML</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>mengapa gradient boosting</strong> (XGBoost/LightGBM) menjadi standar industri fraud.</li>
          <li>Menghitung dampak <strong>class imbalance</strong> dan memilih strategi penanganannya.</li>
          <li>Mengatur <strong>class weight / scale_pos_weight</strong> dan membaca trade-off recall–precision-nya.</li>
          <li>Menyusun <strong>matriks biaya</strong> dan menurunkan threshold optimal dari biaya bisnis.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 40 Fitur, 1 Baris yang Mengubah Segalanya</h2>
      <div className="story">
        <p>Data scientist &ldquo;PayKu&rdquo; frustrasi. Model XGBoost-nya: 40 fitur pakar (dari FR6!), tuning 3 hari, AUC 0,93. Tapi di produksi: <strong>recall cuma 41%</strong> — 6 dari 10 fraud lolos. Ia curiga fiturnya kurang. Ia curiga modelnya kurang dalam. Ia menghabiskan 2 minggu menambah fitur.</p>
        <p>Lalu seorang kolega menatap satu baris konfigurasinya dan bertanya: <em>&ldquo;Scale_pos_weight kamu berapa?&rdquo;</em> — &ldquo;Default. 1.&rdquo; Kolega itu mengubahnya jadi 25. Recall melonjak ke <strong>78%</strong>. Satu baris. Lima detik.</p>
        <p>Twist-nya: model itu <strong>sudah pintar sejak awal</strong> — ia hanya diajari dengan &ldquo;aturan main&rdquo; yang salah. Dengan weight 1, model menganggap &ldquo;salah menuduh 1.000 orang normal&rdquo; sama buruknya dengan &ldquo;meloloskan 1 fraud Rp1 juta&rdquo;. Padahal biayanya beda 40× lipat. Lesson ini: <strong>di fraud ML, mengajari model tentang BIAYA lebih penting daripada mengajarinya tentang POLA</strong>.</p>
      </div>

      <h2 id="gbm">Gradient Boosting: Kenapa Ia Raja Tabel Fraud</h2>
      <p><strong>Definisi singkat.</strong> Gradient boosting (XGBoost, LightGBM, CatBoost) membangun ratusan pohon keputusan kecil secara berurutan — tiap pohon baru <strong>memperbaiki kesalahan</strong> pohon-pohon sebelumnya:</p>
      <Tex math={String.raw`F_m(x) = F_{m-1}(x) + \eta \cdot h_m(x)`} block />
      <ul>
        <li><Tex math={String.raw`F_m`} />: model setelah <Tex math={String.raw`m`} /> pohon.</li>
        <li><Tex math={String.raw`h_m`} />: pohon baru yang memprediksi <em>sisa kesalahan</em> (residual) model sebelumnya.</li>
        <li><Tex math={String.raw`\eta`} />: learning rate — &ldquo;seberapa percaya&rdquo; pada tiap pohon (kecil = lambat tapi stabil).</li>
      </ul>
      <p><strong>Kenapa cocok untuk fraud:</strong></p>
      <ul>
        <li><strong>Data tabular heterogen:</strong> nominal + count + flag + kategori — pohon tidak butuh scaling/normalisasi.</li>
        <li><strong>Interaksi non-linear gratis:</strong> &ldquo;device baru AND velocity tinggi AND jam aneh&rdquo; ditemukan otomatis sebagai cabang pohon.</li>
        <li><strong>Robust terhadap missing:</strong> XGBoost punya arah default untuk missing — penting karena data fraud berlubang (FR4).</li>
        <li><strong>Feature importance bawaan:</strong> tahu fitur mana yang bekerja — modal untuk explainability (FR17).</li>
      </ul>

      <PlotlyChart
        data={algoData}
        title="AUC per Algoritma & Investasi (ilustrasi — dataset fraud tipikal)"
        layout={{ xaxis: { title: "Konfigurasi" }, yaxis: { title: "AUC", range: [0.7, 1.0] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = AUC satu konfigurasi, dari kiri (sederhana) ke kanan (investasi besar).</p>
        <p><strong>Interpretasi:</strong> lompatan terbesar: logistic → XGBoost (+0,12) dan <strong>tuning → fitur pakar (+0,04)</strong>. Tuning hyperparameter 3 hari (+0,015) kalah dari 1 fitur bagus. <strong>Pelajaran:</strong> urutan investasi yang benar = algoritma yang tepat → fitur pakar → class weight → <em>terakhir</em> tuning.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pohon keputusan berpikir seperti investigator: <em>&ldquo;jika device baru DAN velocity tinggi, maka curiga&rdquo;</em> — itulah kenapa GBM &ldquo;nyambung&rdquo; dengan domain fraud. Neural network berpikir dalam geometri berdimensi-100 yang tak bisa dijelaskan ke auditor. Pilih senjata yang bahasanya dimengerti medan perangmu.</p>
      </div>

      <h2 id="imbalance">Imbalance: 1 Berbanding 500</h2>
      <p>Fraud rate 0,2% = <strong>1 fraud : 500 normal</strong>. Tiga masalah yang ditimbulkannya:</p>
      <ol>
        <li><strong>Model malas:</strong> prediksi &ldquo;semua normal&rdquo; memberi akurasi 99,8% — model tidak punya insentif belajar pola fraud.</li>
        <li><strong>Metrik menipu:</strong> akurasi 99,8% dengan recall 0% (lihat FR2, FR9).</li>
        <li><strong>Validasi berisik:</strong> dengan 100 fraud di validasi, selisih 5 kasus = 5% recall — butuh <strong>stratified split</strong> agar tiap lipatan punya fraud cukup.</li>
      </ol>
      <p><strong>Tiga keluarga solusi:</strong> (1) <strong>data-level:</strong> oversampling (SMOTE), undersampling; (2) <strong>algorithm-level:</strong> class weight (fokus lesson ini); (3) <strong>decision-level:</strong> geser threshold (FR11). Untuk fraud, <strong>class weight + threshold tuning</strong> adalah kombinasi standar — SMOTE pada data fraud sering <em>merusak</em> karena menciptakan &ldquo;fraud sintetis&rdquo; yang tidak realistis.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Atasi imbalance dengan SMOTE — standar textbook.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> SMOTE menginterpolasi antar contoh fraud — untuk fraud, &ldquo;titik di antara dua serangan&rdquo; sering <strong>bukan serangan yang realistis</strong> (penipu tidak berdistribusi mulus di ruang fitur). Hasilnya: model percaya diri pada pola fiktif. Class weight + threshold tuning lebih aman dan lebih explainable.</p>
      </div>

      <h2 id="weight">Class Weight: Denda untuk Kesalahan Mahal</h2>
      <p><strong>Definisi.</strong> Class weight mengalikan &ldquo;denda&rdquo; (loss) untuk kesalahan pada kelas minoritas. Di XGBoost: <code className="inline">scale_pos_weight = jumlah_negatif / jumlah_positif</code> (≈ 500 untuk fraud 0,2%).</p>
      <p><strong>Cara kerja intuitif:</strong> tanpa weight, model melihat 500 normal vs 1 fraud dan memutuskan &ldquo;fraud tidak penting&rdquo;. Dengan weight 25, tiap fraud dihitung <strong>25×</strong> — model &ldquo;merasakan&rdquo; 25 fraud vs 500 normal. Ia mulai peduli.</p>

      <PlotlyChart
        data={weightData}
        title="Efek scale_pos_weight: Recall Naik, Precision Turun"
        layout={{ xaxis: { title: "scale_pos_weight", type: "log" }, yaxis: { title: "%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X (log) = bobot, garis merah = recall, biru = precision.</p>
        <p><strong>Interpretasi:</strong> weight 1→20: recall melonjak 42%→74% (&ldquo;model mulai peduli&rdquo;). Weight 20→100: recall stagnan (+2%) tapi precision anjlok 19%→11% (&ldquo;model jadi paranoid&rdquo;). <strong>Sweet spot ~10–25</strong> — di sinilah trade-off optimal. <strong>Pelajaran:</strong> weight bukan &ldquo;makin besar makin bagus&rdquo;; ia adalah kenop trade-off, bukan tombol ajaib.</p>
      </div>

      <details className="worked">
        <summary>📐 Contoh: memilih scale_pos_weight awal</summary>
        <p>Data: 2.000.000 transaksi, 4.000 fraud (0,2%). Rasio = 1.996.000/4.000 = <strong>499</strong>.</p>
        <p><strong>Langkah 1</strong> — mulai dari <code className="inline">scale_pos_weight = 25</code> (bukan 499! — 499 membuat model paranoid total; mulai konservatif).<br />
        <strong>Langkah 2</strong> — ukur recall &amp; precision di validasi temporal (FR10).<br />
        <strong>Langkah 3</strong> — naikkan bertahap (25 → 50) sampai <strong>biaya total</strong> (lihat bawah) berhenti turun.</p>
        <p>Aturan praktis: mulai dari √rasio (≈22) — titik awal empiris yang sering dekat optimal.</p>
      </details>

      <h2 id="cost">Cost-Sensitive: Berpikir dalam Rupiah, Bukan Akurasi</h2>
      <p>Level tertinggi: jangan optimasi metrik statistik — optimasi <strong>uang</strong>. Definisikan matriks biaya:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th></th><th>Prediksi: Normal</th><th>Prediksi: Fraud</th></tr></thead>
          <tbody>
            <tr><td><strong>Asli: Normal</strong></td><td>TN: Rp0</td><td>FP: Rp25 rb (biaya review)</td></tr>
            <tr><td><strong>Asli: Fraud</strong></td><td>FN: Rp1,1 jt (loss)</td><td>TP: −Rp1,1 jt (loss dicegah)</td></tr>
          </tbody>
        </table>
      </div>
      <p>Total biaya yang diminimalkan:</p>
      <Tex math={String.raw`\text{Biaya} = FN \times C_{FN} + FP \times C_{FP}`} block />
      <ul>
        <li><Tex math={String.raw`C_{FN}`} />: biaya fraud lolos (rata-rata loss per kasus).</li>
        <li><Tex math={String.raw`C_{FP}`} />: biaya review sia-sia (gaji investigator ÷ kasus per hari).</li>
        <li><strong>Threshold optimal</strong> = ambang yang meminimalkan biaya ini — bukan 0,5, bukan yang &ldquo;AUC-nya bagus&rdquo;.</li>
      </ul>
      <p><strong>Contoh:</strong> jika <Tex math={String.raw`C_{FN}`} /> = Rp1,1 jt dan <Tex math={String.raw`C_{FP}`} /> = Rp25 rb, rasio 44:1 — &ldquo;lebih baik 44× salah menuduh daripada 1× meloloskan&rdquo;. Threshold optimal bergeser <strong>rendah</strong> (agresif). Jika investigator mahal langka, geser ke atas. <strong>Threshold adalah keputusan bisnis, bukan properti model</strong> — fondasi FR11.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> class weight mengatur <em>bagaimana model belajar</em>; matriks biaya mengatur <em>bagaimana keputusannya dipakai</em>. Keduanya menjawab pertanyaan yang sama (&ldquo;seberapa mahal kesalahan?&rdquo;) di dua tahap berbeda. Tim yang dewasa menyelaraskan keduanya dengan angka biaya yang <strong>sama</strong>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Threshold 0,5 adalah default yang netral.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 0,5 hanya &ldquo;netral&rdquo; jika biaya FP = biaya FN — yang <strong>tidak pernah</strong> terjadi di fraud (rasio 40:1 ke atas). Threshold 0,5 bukan netral; ia adalah keputusan bisnis yang diambil tanpa sadar. Setiap threshold = pernyataan tentang biaya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Class Weight Menggeser Trade-off</h2>
      <p>Rasakan bagaimana weight mengubah &ldquo;kepribadian&rdquo; model.</p>
      <PyodideLab
        title="Lab 1 — Class Weight: Dari Malas ke Paranoid"
        hint="Ubah distribusi fraud (overlap dengan normal). Pada overlap besar, weight tinggi bikin precision hancur — kapan kamu tetap melakukannya?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Threshold dari Matriks Biaya</h2>
      <PyodideLab
        title="Lab 2 — Ambang Optimal = Ambang Termurah"
        hint="Ubah COST_FP 25rb → 100rb. Lihat ambang optimal bergeser. Inilah kenapa 'threshold terbaik' beda untuk tiap perusahaan."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Melatih Model di Data 1:500</h2>
      <p>Dua perhitungan yang mengubah model &ldquo;malas&rdquo; (prediksi semua normal, akurasi 99,8%) menjadi model yang benar-benar bekerja.</p>

      <details className="worked">
        <summary>📐 Contoh 1: menghitung scale_pos_weight dari rasio imbalance</summary>
        <p>Data training: 500.000 transaksi, 1.000 fraud → rasio 1:500. Model XGBoost/LightGBM tanpa penyesuaian akan mengabaikan kelas minoritas.</p>
        <p><strong>Langkah 1 — rumus bobot.</strong> <Tex math={String.raw`\text{scale\_pos\_weight} = \frac{\text{negatif}}{\text{positif}} = \frac{499.000}{1.000} = 499`} block /> Artinya: setiap kesalahan pada satu fraud dihukum <strong>499×</strong> lebih berat daripada kesalahan pada satu transaksi normal — model &ldquo;dipaksa peduli&rdquo;.</p>
        <p><strong>Langkah 2 — efeknya.</strong> Tanpa bobot: recall 4%, precision 61% (model hampir tidak pernah berani memprediksi fraud). Dengan bobot 499: recall 71%, precision 18%. Precision turun — tapi itu <em>trade-off yang benar</em>: 18% dari flag adalah fraud vs 0,2% base rate = <strong>90× lebih baik dari acak</strong>.</p>
        <p><strong>Langkah 3 — jebakannya.</strong> Bobot 499 membuat skor probabilitas <em>tidak terkalibrasi</em> (skor 0,8 bukan berarti peluang 80%). Jika skor dipakai untuk threshold biaya (contoh 2), <strong>kalibrasi ulang dulu</strong> (Platt scaling / isotonic) atau gunakan ranking, bukan nilai absolutnya. Analis junior lupa langkah ini — lalu heran kenapa rumus threshold &ldquo;tidak bekerja&rdquo;.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: threshold dari biaya — kapan &ldquo;tahan&rdquo; transaksi?</summary>
        <p>Untuk skor terkalibrasi <Tex math={String.raw`p`} /> (peluang fraud), ambang optimal meminimalkan biaya ekspektasian:</p>
        <Tex math={String.raw`\tau^* = \frac{C_{FP}}{C_{FP} + C_{FN}}`} block />
        <p><Tex math={String.raw`C_{FP}`} /> = biaya false positive (review sia-sia Rp25rb). <Tex math={String.raw`C_{FN}`} /> = biaya false negative (fraud lolos Rp1,1jt). Maka τ* = 25.000/(25.000 + 1.100.000) = <strong>0,022</strong>.</p>
        <p><strong>Interpretasi:</strong> tahan transaksi jika peluang fraud &gt; <strong>2,2%</strong> — jauh di bawah 50%! Intuisinya: karena meloloskan fraud 44× lebih mahal daripada review sia-sia, kita rela &ldquo;mengganggu&rdquo; banyak transaksi normal demi menangkap fraud. Angka ini artinya <strong>threshold optimal hampir tidak pernah 0,5</strong> di fraud — 0,5 hanya benar jika biaya FP = FN, yang tidak pernah terjadi.</p>
        <p><strong>Coba pikir:</strong> untuk transaksi Rp50rb (C_FN kecil), τ* naik → lebih permisif. Untuk transaksi Rp50jt, τ* turun → lebih ketat. Inilah dasar <strong>threshold per-segmen nominal</strong> (FR11): satu ambang global = menghukum transaksi kecil dan membiarkan transaksi besar.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Loss Function adalah Insentif</h2>
      <p>Model bukan &ldquo;pintar&rdquo; — ia adalah <strong>pegawai yang memaksimalkan insentifnya</strong> (loss function). Beri insentif &ldquo;akurasi&rdquo; di data 1:500 → ia belajar &ldquo;tidur saja, toh 99,8% benar&rdquo;. Beri insentif berbobot (scale_pos_weight) → ia belajar &ldquo;fraud itu penting&rdquo;. <strong>Setiap kegagalan model pada dasarnya adalah kegagalan insentif</strong> — sebelum menyalahkan algoritma, periksa apa yang kamu perintahkan ia optimalkan.</p>
      <p>Intuisi kedua: <strong>model supervised adalah cermin label-mu</strong> — termasuk bias &amp; lukanya (FR4). Model yang &ldquo;diskriminatif&rdquo; terhadap segmen tertentu biasanya mewarisi bias <em>siapa yang diinvestigasi</em>, bukan realitas fraud. Audit model = audit label = audit proses investigasi. Rantai ini tidak bisa diputus: <strong>kualitas model ≤ kualitas label ≤ kualitas tim investigasi</strong>.</p>
      <p><strong>Kapan supervised ML TIDAK boleh dipakai:</strong> (1) <strong>label &lt; 200 positif</strong> — model menghafal noise; pakai rule + unsupervised dulu; (2) <strong>pola berubah lebih cepat dari siklus retrain</strong> — model kemarin melawan musuh kemarin; (3) <strong>keputusan butuh penjelasan hukum</strong> (skor kredit!) — pakai model interpretable, terima trade-off akurasi; (4) <strong>sebagai satu-satunya pertahanan</strong> — model adalah satu lapis; tanpa rule, monitoring, dan manusia, ia satu titik kegagalan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum tuning hyperparameter, jawab tiga pertanyaan: <strong>(1) apa insentif model ini? (2) dari label siapa ia belajar? (3) kapan ia terakhir melihat dunia nyata?</strong> 90% &ldquo;model buruk&rdquo; gagal di salah satu dari tiga ini — bukan di arsitektur.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Konfigurasi untuk Tiap Situasi</h2>

      <div className="decision-card">
        <h3>1. Imbalance ekstrem (1:500+), label matang → <strong>XGBoost + scale_pos_weight ~√rasio + threshold dari biaya</strong></h3>
        <p><strong>Kondisi:</strong> kasus standar fraud kartu/e-wallet.</p>
        <p><strong>Kenapa:</strong> resep standar industri yang terbukti. Jangan mulai dari SMOTE.</p>
      </div>

      <div className="decision-card">
        <h3>2. Biaya FN ≫ FP (loss besar per kasus) → <strong>weight agresif + threshold rendah</strong></h3>
        <p><strong>Kondisi:</strong> ATO dengan rata-rata loss Rp2,4 jt; investigator cukup.</p>
        <p><strong>Kenapa:</strong> meloloskan 1 fraud = 44× biaya review sia-sia. Optimal = agresif.</p>
      </div>

      <div className="decision-card">
        <h3>3. Kapasitas investigator terbatas → <strong>threshold tinggi, weight moderat</strong></h3>
        <p><strong>Kondisi:</strong> tim kecil, 200 review/hari untuk 1 juta transaksi.</p>
        <p><strong>Kenapa:</strong> precision rendah = investigator tenggelam = alert diabaikan = sistem mati. Lebih baik sedikit tapi dipercaya (FR11).</p>
      </div>

      <div className="decision-card">
        <h3>4. Butuh penjelasan ke regulator/auditor → <strong>GBM + SHAP (bukan deep learning)</strong></h3>
        <p><strong>Kondisi:</strong> bank yang diawasi OJK; tiap blokir harus bisa dijelaskan.</p>
        <p><strong>Kenapa:</strong> pohon + SHAP = &ldquo;ditahan karena velocity 12× + device baru&rdquo; — bahasa manusia. Neural net = kotak hitam (FR17).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Urutan investasi: algoritma tepat → fitur pakar → class weight → <em>terakhir</em> tuning.</li>
          <li>Mulai <code className="inline">scale_pos_weight</code> dari √rasio, naikkan sampai biaya total berhenti turun.</li>
          <li>Threshold dari <strong>matriks biaya</strong>, bukan 0,5.</li>
          <li>SMOTE untuk fraud = waspada; class weight + threshold = default aman.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: GBM, LogReg, atau Neural Net?</h2>
      <p>Tiga skenario pemilihan model yang dihadapi tim fraud Indonesia:</p>
      <p><strong>Skenario A — butuh dijelaskan ke regulator/auditor.</strong> Pilih <strong>logistic regression / shallow tree</strong> meski AUC 2–3 poin lebih rendah dari GBM. Di Indonesia, ketika OJK/BI bertanya &ldquo;kenapa nasabah ini diblokir&rdquo;, jawaban &ldquo;SHAP bilang begitu&rdquo; lebih lemah daripada &ldquo;koefisien velocity 15 menit = +2,1&rdquo;. Aturan: <strong>di industri teregulasi, explainability adalah fitur, bukan aksesori</strong> (FR17).</p>
      <p><strong>Skenario B — data tabular + imbalance ekstrem + butuh cepat.</strong> Pilih <strong>GBM (LightGBM/XGBoost)</strong>. Ia juara dunia data tabular fraud: menangani missing value, interaksi fitur otomatis, training menit bukan jam. 90% model skor fraud produksi di Indonesia adalah GBM — bukan karena paling canggih, tapi karena <strong>rasio akurasi-per-rupiah-biaya-operasional</strong> terbaik.</p>
      <p><strong>Skenario C — data sekuensial kaya (urutan klik, teks).</strong> Baru pertimbangkan <strong>neural net / sequence model</strong> — dan hanya jika datamu cukup besar (&gt; 1 juta sampel) dan timmu bisa mengoperasikannya (FR18). Neural net yang tidak terawat di produksi lebih berbahaya daripada GBM sederhana yang terpantau.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Model dengan AUC 0,99 pasti bagus.&rdquo;<br /><strong>Yang benar:</strong> di data imbalance 1:500, AUC-ROC 0,99 bisa berarti precision 5% — model &ldquo;hebat&rdquo; yang 19 dari 20 flag-nya salah. Selalu lihat <strong>PR-AUC dan precision@recall-operasional</strong> (FR9). AUC-ROC di fraud seperti nilai ujian tanpa melihat soalnya: terlihat bagus, belum tentu bermakna.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Skor di Bank Digital</h2>
      <p>Bank digital Indonesia dengan 8 juta transaksi/bulan menerapkan model GBM untuk skor fraud real-time. Angka-angka operasionalnya (ilustratif dari pola umum industri):</p>
      <ol>
        <li><strong>Sebelum model:</strong> 40 rule manual, precision 6%, 12.000 flag/hari, tim 45 investigator kewalahan, fraud loss Rp4,2 M/bulan.</li>
        <li><strong>Sesudah model (GBM, 28 fitur):</strong> precision 23%, flag turun ke 5.500/hari (model memprioritaskan), recall naik dari 31% ke 58%, fraud loss turun ke Rp2,6 M/bulan.</li>
        <li><strong>Biaya:</strong> tim model 4 orang + infra Rp180 jt/bulan. Penghematan loss Rp1,6 M/bulan → <strong>ROI 9×</strong>.</li>
      </ol>
      <p><strong>Yang tidak terlihat di angka:</strong> 3 bulan pertama, investigator <em>tidak percaya</em> model — mereka me-review ulang semua skor tinggi manual (menggandakan kerja). Kepercayaan baru tumbuh setelah tim model duduk 2 minggu bersama investigator, menjelaskan 10 contoh &ldquo;kenapa skor ini tinggi&rdquo; dengan bahasa fitur. Pelajaran: <strong>adopsi model = 50% teknis + 50% antropologi</strong>. Model terbaik yang tidak dipercaya = model yang tidak dipakai.</p>
      <p><strong>Fitur yang paling berkontribusi</strong> (dari analisis SHAP): velocity 1 jam ternormalisasi, device baru + nominal di atas persentil-95 nasabah, dan <em>perubahan pola jam transaksi</em>. Tiga fitur &ldquo;murah&rdquo; — lagi-lagi membuktikan FR6: kemenangan ada di fitur, bukan di algoritma.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dalam supervised fraud, <strong>urutan dampaknya: label (40%) &gt; fitur (40%) &gt; algoritma (15%) &gt; tuning (5%)</strong>. Tim yang menghabiskan 80% waktu untuk tuning XGBoost tapi labelnya kotor sedang mengoptimasi 5% sambil mengabaikan 80%. Kerja dari kiri ke kanan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Pilih Konfigurasi untuk PayKu</h2>
      <div className="callout">
        <p>PayKu: 1 juta transaksi/bulan, 2.000 fraud (0,2%), rata-rata loss Rp1,1 jt. Tim: 5 investigator, masing-masing 40 review/hari = <strong>200 review/hari</strong> (~6.000/bulan). Biaya per review ≈ Rp25 rb. Kandidat konfigurasi (dari validasi):</p>
        <ul>
          <li><strong>A</strong> (weight 10, thr 0,5): recall 55%, precision 30% → alert ±3.700/bln</li>
          <li><strong>B</strong> (weight 25, thr 0,35): recall 78%, precision 18% → alert ±8.700/bln</li>
          <li><strong>C</strong> (weight 25, thr 0,6): recall 62%, precision 35% → alert ±3.500/bln</li>
        </ul>
        <p><strong>Pertanyaan:</strong> pilih A/B/C dengan perhitungan biaya total. (Biaya = FN×1,1jt + FP×25rb.)</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Hitung tiap opsi</strong> (fraud 2.000/bln):</p>
          <ul>
            <li><strong>A:</strong> TP=1.100, FN=900 → 900×1,1jt = Rp990 jt. FP = 3.700−1.100=2.600 → 2.600×25rb = Rp65 jt. <strong>Total Rp1.055 jt.</strong> Alert 3.700 ≤ 6.000 ✓ muat.</li>
            <li><strong>B:</strong> TP=1.560, FN=440 → Rp484 jt. FP = 8.700−1.560=7.140 → Rp178,5 jt. Total Rp662,5 jt — TAPI alert 8.700 &gt; 6.000 ✗ <strong>kapasitas jebol</strong> (investigator akan mengabaikan alert → recall aktual anjlok).</li>
            <li><strong>C:</strong> TP=1.240, FN=760 → Rp836 jt. FP = 3.500−1.240=2.260 → Rp56,5 jt. <strong>Total Rp892,5 jt.</strong> Alert 3.500 ≤ 6.000 ✓ muat.</li>
          </ul>
          <p><strong>Pilih C.</strong> B terlihat termurah di kertas tapi melanggar kendala kapasitas — dan kendala yang dilanggar = sistem yang mati di dunia nyata. <strong>Pelajaran:</strong> optimasi tanpa kendala = fiksi. Inilah jembatan ke FR11 (queue optimization).</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Supervised ML</h2>
      <details className="worked">
        <summary>Q1: XGBoost, LightGBM, atau CatBoost — mana yang &ldquo;terbaik&rdquo; untuk fraud?</summary>
        <p><strong>Ketiganya setara</strong> untuk data tabular fraud — selisih AUC biasanya &lt; 1 poin. Yang membedakan: LightGBM paling cepat training, CatBoost paling nyaman untuk kategorikal, XGBoost paling matang ekosistemnya. <strong>Pilih yang tim-mu paling paham mengoperasikannya</strong> — karena 95% nilai ada di fitur + label + threshold, bukan di pilihan GBM. Debat algoritma = mengoptimasi 5%.</p>
      </details>
      <details className="worked">
        <summary>Q2: Model overfitting — tanda-tandanya di fraud?</summary>
        <p>Tanda klasik: training AUC 0,99, validasi 0,85 — <strong>gap besar</strong>. Tapi di fraud ada tanda khas: model &ldquo;hafal&rdquo; <em>ID spesifik</em> (kartu/device tertentu) bukan <em>pola</em> — di produksi, ID baru = model buta. Cegah: <strong>validasi time-based</strong> (train Jan–Jun, validasi Jul — bukan random split!), fitur agregat bukan ID mentah, dan regularisasi. Random split di data deret waktu = <strong>kebocoran masa depan</strong> yang sistematis.</p>
      </details>
      <details className="worked">
        <summary>Q3: Seberapa sering retrain?</summary>
        <p><strong>Berdasarkan drift, bukan kalender</strong> (FR10): retrain saat PSI &gt; 0,25 bertahan 2+ bulan atau performa turun signifikan. Retrain buta bulanan berisiko melatih dengan data terkontaminasi label-lag. Praktik umum: <em>evaluasi</em> bulanan, <em>retrain</em> kuartalan atau saat terpicu. Dan selalu via champion-challenger (FR18) — jangan replace buta.</p>
      </details>
      <details className="worked">
        <summary>Q4: Model bagus tapi investigator tidak percaya — bagaimana?</summary>
        <p><strong>Masalah adopsi, bukan akurasi.</strong> Resep yang terbukti: (1) duduk 2 minggu dengan investigator, bedah 10 contoh &ldquo;kenapa skor ini tinggi&rdquo; (FR17); (2) mulai sebagai <em>penasihat</em> (skor membantu prioritas) bukan <em>pengganti</em> (auto-block); (3) tunjukkan <em>uangnya</em>: &ldquo;model ini menghemat RpX/bulan&rdquo;. Kepercayaan dibangun dengan <strong>transparansi + hasil</strong>, bukan dengan slide AUC.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Data 2 juta transaksi, 4.000 fraud. Nilai awal scale_pos_weight yang masuk akal?"
        options={[
          "1 (default)",
          "499 (rasio penuh)",
          "≈22 (√rasio) — titik awal, lalu naikkan sampai biaya total berhenti turun",
          "0",
        ]}
        correct={2}
        explanation="Benar: √499 ≈ 22. Rasio penuh (499) membuat model paranoid; default (1) membuat model malas. Mulai dari akar, lalu tune berdasarkan biaya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa SMOTE berisiko untuk data fraud?"
        options={[
          "Terlalu lambat",
          "'Fraud sintetis' hasil interpolasi sering bukan serangan realistis — model percaya diri pada pola fiktif",
          "Tidak bisa dipakai dengan XGBoost",
          "Melanggar privasi",
        ]}
        correct={1}
        explanation="Benar: titik di antara dua serangan ≠ serangan baru yang masuk akal. Penipu tidak terdistribusi mulus di ruang fitur. Class weight + threshold lebih aman."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. C_FN = Rp1,1 jt, C_FP = Rp25 rb (rasio 44:1). Implikasi untuk threshold?"
        options={[
          "Tetap 0,5 — netral",
          "Threshold rendah (agresif) — lebih baik 44× salah menuduh daripada 1× meloloskan",
          "Threshold 0,9 — hemat investigator",
          "Tidak butuh threshold",
        ]}
        correct={1}
        explanation="Benar: threshold rendah. 0,5 hanya 'netral' jika biaya seimbang — di fraud tidak pernah seimbang. Tiap threshold adalah pernyataan tentang biaya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Setelah menambah 1 fitur pakar AUC naik 0,04; setelah tuning 3 hari naik 0,005. Pelajaran?"
        options={[
          "Tuning tidak berguna",
          "Urutan investasi: fitur > weight > tuning. Satu sudut pandang baru mengalahkan optimasi hyperparameter",
          "Fitur tidak penting",
          "AUC tidak penting",
        ]}
        correct={1}
        explanation="Benar: fitur pakar > tuning. Waktu analis paling berharga dipakai mencari sinyal baru (FR6), bukan grid search buta."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan gradient boosting LEBIH tepat daripada deep learning untuk fraud?"
        options={[
          "Tidak pernah",
          "Data tabular heterogen + butuh explainability ke auditor + data tidak masif — GBM menang di ketiganya",
          "Hanya jika datanya kecil",
          "Hanya jika tidak ada GPU",
        ]}
        correct={1}
        explanation="Benar: GBM = raja tabel. Tidak butuh scaling, menemukan interaksi otomatis, robust missing, feature importance bawaan, dan bisa dijelaskan (SHAP) — semua yang dibutuhkan fraud."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Gradient boosting</strong> (XGBoost/LightGBM): <Tex math={String.raw`F_m = F_{m-1} + \eta h_m`} /> — raja tabel fraud: no scaling, interaksi otomatis, robust missing, explainable.</li>
          <li><strong>Imbalance 1:500</strong> → model malas, metrik menipu, validasi berisik (stratified!).</li>
          <li><strong>Class weight</strong>: mulai dari √rasio; weight = kenop trade-off recall–precision, bukan tombol ajaib.</li>
          <li><strong>Cost-sensitive</strong>: <Tex math={String.raw`\text{Biaya} = FN \cdot C_{FN} + FP \cdot C_{FP}`} /> — threshold optimal = ambang termurah, bukan 0,5.</li>
          <li><strong>SMOTE waspada</strong> untuk fraud; default aman = weight + threshold tuning.</li>
          <li>Optimasi <strong>dengan kendala kapasitas</strong> — konfigurasi termurah di kertas bisa mati di dunia nyata.</li>
          <li>Kapan TIDAK pakai supervised: label belum matang / noise tinggi (perbaiki label dulu — FR4).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr6-feature-engineering" className="btn btn-secondary btn-sm">← FR6</Link>
        <Link href="/learn/fr8-unsupervised" className="btn btn-primary btn-sm">Next: FR8 →</Link>
      </div>
    </div>
  );
}

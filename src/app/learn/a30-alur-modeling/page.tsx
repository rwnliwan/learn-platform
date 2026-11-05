"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A30Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const workflowData = [
    {
      x: ["Bisnis", "Data", "Fitur", "Model", "Validasi", "Deploy", "Monitor"],
      y: [1, 1, 1, 1, 1, 1, 1],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#ef4444", "#22c55e", "#22c55e"] },
      text: ["tujuan", "kumpul", "rekayasa", "latih", "uji jujur", "produksi", "jaga"],
      textposition: "outside",
    },
  ];

  const splitData = [
    {
      x: ["Train (60%)", "Validasi (20%)", "Test (20%)"],
      y: [60, 20, 20],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#22c55e"] },
      text: ["belajar pola", "pilih model", "nilai akhir (sekali!)"],
      textposition: "outside",
    },
  ];

  const overfitGapData = [
    {
      x: ["Model A\nsederhana", "Model B\nkompleks"],
      y: [82, 99],
      name: "Skor train",
      type: "bar",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Model A\nsederhana", "Model B\nkompleks"],
      y: [80, 71],
      name: "Skor test",
      type: "bar",
      marker: { color: ["#22c55e", "#ef4444"] },
    },
  ];

  const lab1Code = `# Train/validation/test: buktikan test-set hanya boleh dipakai SEKALI
# Skenario: 20 model acak (noise murni). Pilih yang terbaik di validasi,
# lalu lihat skornya di test yang belum pernah disentuh.
import random, math
random.seed(7)

n = 300
# Target = noise murni (tidak ada sinyal!). Fitur = 20 noise.
y = [random.gauss(0, 1) for _ in range(n)]
X = [[random.gauss(0, 1) for _ in range(n)] for _ in range(20)]

# split: 60/20/20
ntr, nva = 180, 60
def r2_on(xs_cols, y, idx):
    # korelasi kuadrat fitur TERBAIK di subset idx (model "curang": pilih max)
    best = 0
    for col in xs_cols:
        xv = [col[i] for i in idx]; yv = [y[i] for i in idx]
        mx = sum(xv)/len(xv); my = sum(yv)/len(yv)
        num = sum((a-mx)*(b-my) for a, b in zip(xv, yv))
        den = math.sqrt(sum((a-mx)**2 for a in xv)*sum((b-my)**2 for b in yv))
        r = num/den if den else 0
        best = max(best, r**2)
    return best

tr = list(range(ntr)); va = list(range(ntr, ntr+nva)); te = list(range(ntr+nva, n))
r2tr = r2_on(X, y, tr); r2va = r2_on(X, y, va); r2te = r2_on(X, y, te)
print(f"R2 train    : {r2tr:.3f}  <- 'model terbaik' dipilih di sini")
print(f"R2 validasi : {r2va:.3f}  <- dipakai untuk MEMILIH model")
print(f"R2 test     : {r2te:.3f}  <- realita (noise murni -> ~0)")
print()
print("PELAJARAN: dari 20 fitur noise, selalu ada yang 'terlihat' bagus")
print("di train (R2 0.05+). Validasi sedikit lebih jujur. Test = hakim")
print("terakhir yang tak bisa dibohongi - MAKANYA hanya dipakai sekali.")
print()
print("COBA: naikkan fitur 20 -> 100. R2 train 'terbaik' makin besar,")
print("tapi R2 test tetap ~0. Itulah multiple testing / p-hacking.")`;

  const lab2Code = `# Baseline: model 'bodoh' yang harus dikalahkan
# Aturan: model fancy WAJIB mengalahkan baseline sederhana, atau tidak
# layak produksi (prinsip challenger, A3.8).
import random, math
random.seed(12)

n = 1000
# y = 3*x1 - 2*x2 + noise ; x3 = noise murni
x1 = [random.gauss(0, 1) for _ in range(n)]
x2 = [random.gauss(0, 1) for _ in range(n)]
x3 = [random.gauss(0, 1) for _ in range(n)]
y  = [3*a - 2*b + random.gauss(0, 2) for a, b in zip(x1, x2)]

def rmse(y, p): return math.sqrt(sum((a-b)**2 for a, b in zip(y, p))/len(y))

# Baseline 1: tebak rata-rata (model paling bodoh)
mean_y = sum(y)/n
b1 = rmse(y, [mean_y]*n)
# Baseline 2: regresi 1 variabel (x1 saja) via OLS manual
mx = sum(x1)/n; my = mean_y
b_1 = sum((a-mx)*(c-my) for a, c in zip(x1, y))/sum((a-mx)**2 for a in x1)
b_0 = my - b_1*mx
b2 = rmse(y, [b_0 + b_1*a for a in x1])
# Model 'fancy': OLS 3 variabel (termasuk noise x3)
def ols_rmse(cols):
    k = len(cols); X = [[1.0]+[c[i] for c in cols] for i in range(n)]
    A = [[sum(X[i][a]*X[i][b] for i in range(n)) for b in range(k+1)] for a in range(k+1)]
    bb = [sum(X[i][a]*y[i] for i in range(n)) for a in range(k+1)]
    M = [row[:]+[v] for row, v in zip(A, bb)]
    for c_ in range(k+1):
        piv = max(range(c_, k+1), key=lambda r: abs(M[r][c_]))
        M[c_], M[piv] = M[piv], M[c_]
        for r in range(c_+1, k+1):
            f = M[r][c_]/M[c_][c_]
            for kk in range(c_, k+2): M[r][kk] -= f*M[c_][kk]
    be = [0]*(k+1)
    for i in range(k, -1, -1):
        be[i] = (M[i][k+1]-sum(M[i][j]*be[j] for j in range(i+1, k+1)))/M[i][i]
    return rmse(y, [sum(be[a]*X[i][a] for a in range(k+1)) for i in range(n)])

b3 = ols_rmse([x1, x2, x3])
print(f"Baseline 1 (tebak rata2) : RMSE = {b1:.3f}")
print(f"Baseline 2 (1 variabel)   : RMSE = {b2:.3f}")
print(f"Model fancy (3 variabel)  : RMSE = {b3:.3f}")
print()
print("Model fancy HARUS jauh lebih baik dari baseline 1.")
print("Jika selisihnya tipis, kompleksitasnya tidak justified -")
print("pilih baseline (prinsip challenger SR 11-7).")
print()
print("COBA: naikkan noise 2 -> 5. Semua RMSE naik, tapi URUTAN tetap:")
print("baseline selalu jadi pembanding yang jujur.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.0 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Alur Kerja Modeling:<br />Peta Sebelum Masuk Hutan Model</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model Terbaik yang Tidak Pernah Dipakai</a></li>
          <li><a href="#peta">Peta 7 Tahap: Dari Masalah Bisnis ke Monitoring</a></li>
          <li><a href="#split">Train / Validation / Test — Tiga Peran yang Tidak Boleh Tertukar</a></li>
          <li><a href="#overfit">Overfitting vs Underfitting — Dua Cara Gagal</a></li>
          <li><a href="#baseline">Baseline &amp; Challenger — Standar Kejujuran</a></li>
          <li><a href="#fitur">Fitur: Mata Uang Sebenarnya Modeling</a></li>
          <li><a href="#lab1">🔬 Lab 1: Test Set Hanya Boleh Dipakai Sekali</a></li>
          <li><a href="#lab2">🔬 Lab 2: Baseline yang Wajib Dikalahkan</a></li>
          <li><a href="#peta2">🗺️ Peta Keputusan: Pertanyaan → Jenis Model</a></li>
          <li><a href="#case">📋 Mini-Case: Brief Model PD dari Nol</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menggambarkan 7 tahap alur kerja modeling dan menjelaskan mengapa 80% waktu habis di luar &ldquo;training model&rdquo;.</li>
          <li>Membedakan peran train/validation/test dan menjelaskan konsekuensi memakai test set lebih dari sekali.</li>
          <li>Mendiagnosis overfitting vs underfitting dari perbandingan skor train vs test.</li>
          <li>Menetapkan baseline dan challenger model sebelum mengklaim model &ldquo;bagus&rdquo;.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Model Terbaik yang Tidak Pernah Dipakai</h2>
      <div className="story">
        <p>Data scientist baru di bank menghabiskan 3 bulan membangun model PD dengan arsitektur canggih. Akurasi validasi: 91% — terbaik yang pernah ada di tim. Ia presentasi dengan bangga. Lalu kepala risiko bertanya tiga hal: <em>&ldquo;Fitur-fiturnya tersedia saat pengajuan, atau baru tersedia setelahnya? Model ini menjawab pertanyaan bisnis yang mana — ranking atau probabilitas? Dan bagaimana kita tahu ia masih valid 6 bulan lagi?&rdquo;</em></p>
        <p>Sunyi. Fitur &ldquo;riwayat tunggakan 12 bulan&rdquo; ternyata dihitung <em>setelah</em> periode prediksi (leakage). Tidak ada yang menetapkan apakah outputnya dipakai untuk <em>ranking</em> atau <em>pricing</em> (butuh kalibrasi berbeda). Tidak ada rencana monitoring. Model 91% itu <strong>tidak pernah dipakai</strong> — bukan karena matematikanya salah, tapi karena <em>alur kerjanya</em> salah dari langkah pertama.</p>
        <p>Twist-nya: kegagalan ini tidak bisa diperbaiki dengan &ldquo;model yang lebih bagus&rdquo;. Ia diperbaiki dengan <strong>peta</strong> — memahami seluruh perjalanan dari masalah bisnis sampai monitoring <em>sebelum</em> menulis baris kode pertama. Lesson ini adalah peta itu, dan bekal untuk seluruh track A3.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="peta">Peta 7 Tahap: Dari Masalah Bisnis ke Monitoring</h2>
      <ol>
        <li><strong>Masalah bisnis → pertanyaan model.</strong> &ldquo;Kurangi kerugian kredit&rdquo; bukan pertanyaan model. &ldquo;Estimasi PD 12-bulan tiap pengajuan untuk pricing&rdquo; — baru bisa dimodelkan. Tulis: <em>target apa, keputusan apa, kapan dipakai</em>.</li>
        <li><strong>Data: kumpulkan + audit.</strong> Grain (A1.1), missing (A1.7), outlier (A1.5), dan <strong>perangko waktu tiap fitur</strong> (kapan tersedia? — anti-leakage, A3.8).</li>
        <li><strong>Fitur: rekayasa + seleksi.</strong> Fitur adalah &ldquo;mata uang&rdquo; modeling — model hebat dengan fitur buruk kalah dari model sederhana dengan fitur bagus. WoE/IV untuk scorecard, interaksi domain, transformasi skew (A1.4).</li>
        <li><strong>Model: latih kandidat.</strong> Mulai dari baseline sederhana → naik kompleksitas <em>hanya jika</em> terbukti lebih baik (A3.1–A3.4, A3.15).</li>
        <li><strong>Validasi: uji jujur.</strong> Metrik yang tepat (A3.5), kalibrasi (A3.6), OOT + leakage audit + PSI (A3.8), challenger (SR 11-7).</li>
        <li><strong>Deploy: produksi.</strong> Pipeline reproducible, versi model &amp; data tercatat, <em>shadow mode</em> dulu jika berisiko.</li>
        <li><strong>Monitor: jaga.</strong> PSI berkala, backtesting kalibrasi, ambang retraining. Model adalah <em>aset yang meluruh</em>, bukan artefak sekali jadi.</li>
      </ol>

      <PlotlyChart
        data={workflowData}
        title="7 Tahap Alur Kerja Modeling"
        layout={{ xaxis: { title: "" }, yaxis: { title: "", showticklabels: false }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tujuh tahap berurutan, kiri ke kanan; warna = fase (biru: persiapan, kuning: pembangunan, merah: pengujian, hijau: produksi).</p>
        <p><strong>Interpretasi:</strong> perhatikan proporsinya di dunia nyata: tahap 1–3 dan 5–7 (biru, merah, hijau) memakan <strong>~80% waktu</strong> — &ldquo;training model&rdquo; (kuning) hanyalah bagian kecil di tengah. Kegagalan terbesar justru di tahap 1 (pertanyaan salah), 2 (leakage), dan 7 (tidak dimonitor) — bukan di algoritma.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan pertanyaan pembuka tiap tahap: (1) &ldquo;keputusan apa yang akan berubah?&rdquo; (2) &ldquo;kapan tiap fitur tersedia?&rdquo; (3) &ldquo;fitur apa yang belum kita punya?&rdquo; (4) &ldquo;apakah baseline sudah dikalahkan?&rdquo; (5) &ldquo;bagaimana cara model ini berbohong?&rdquo; (6) &ldquo;bisakah direproduksi?&rdquo; (7) &ldquo;kapan kita tahu ia rusak?&rdquo;. Tujuh pertanyaan ini = 80% kualitas validasi modelmu.</p>
      </div>

      <h2 id="split">Train / Validation / Test — Tiga Peran yang Tidak Boleh Tertukar</h2>
      <ul>
        <li><strong>Train (60–70%):</strong> untuk <em>belajar</em> — fitting parameter. Model boleh &ldquo;menghafal&rdquo; di sini; tidak ada penilaian.</li>
        <li><strong>Validation (15–20%):</strong> untuk <em>memilih</em> — bandingkan model, tuning hyperparameter (λ di A3.3!). Boleh dipakai berkali-kali, tapi tiap pemakaian sedikit &ldquo;membocorkan&rdquo; informasi (optimisme bertambah).</li>
        <li><strong>Test (15–20%):</strong> untuk <em>menilai akhir</em> — <strong>sekali saja</strong>, di akhir, setelah semua keputusan dikunci. Test yang dipakai 10× bukan test — ia sudah jadi validation kedua.</li>
      </ul>

      <PlotlyChart
        data={splitData}
        title="Pembagian Data: tiga peran"
        layout={{ xaxis: { title: "" }, yaxis: { title: "%" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = tiga subset dengan perannya masing-masing.</p>
        <p><strong>Interpretasi:</strong> alur informasi hanya boleh mengalir <strong>satu arah</strong>: train → validation → test. Begitu hasil test memengaruhi keputusanmu (&ldquo;hmm, jelek — coba tuning lagi&rdquo;), test set terkontaminasi dan angka finalnya tidak jujur lagi. <strong>Disiplin ini adalah fondasi seluruh evaluasi ML.</strong></p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Test set boleh dipakai berkali-kali asal tidak untuk training.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> setiap kali kamu <em>melihat</em> skor test lalu mengubah sesuatu, informasi test bocor ke keputusanmu — ini <strong>test-set overfitting</strong> (bentuk p-hacking). Setelah 20 iterasi &ldquo;lihat test → tweak → lihat lagi&rdquo;, skor test-mu seoptimis skor validation. Solusi: kunci test set (bahkan secara akses!), atau siapkan <em>test kedua</em> yang benar-benar buta untuk laporan final.</p>
      </div>

      <h2 id="overfit">Overfitting vs Underfitting — Dua Cara Gagal</h2>
      <p><strong>Definisi.</strong> Bandingkan skor train vs test:</p>
      <ul>
        <li><strong>Overfitting</strong> (variance tinggi): train bagus, test jelek — model <strong>menghafal</strong> noise. <em>Obat:</em> sederhanakan, regularisasi (A3.3), data lebih banyak, CV.</li>
        <li><strong>Underfitting</strong> (bias tinggi): train <em>pun</em> jelek — model <strong>terlalu bodoh</strong> untuk pola yang ada. <em>Obat:</em> tambah fitur/kompleksitas — regularisasi justru memperparah!</li>
      </ul>

      <PlotlyChart
        data={overfitGapData}
        title="Diagnosis dari Jurang Train vs Test"
        layout={{ barmode: "group", xaxis: { title: "" }, yaxis: { title: "Skor" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua model; batang abu-abu = skor train, berwarna = skor test.</p>
        <p><strong>Interpretasi:</strong> Model A: train 82, test 80 — <strong>sehat</strong> (jurang kecil). Model B: train 99, test 71 — <strong>overfitting klasik</strong> (jurang 28 poin!). Model B &ldquo;belajar&rdquo; lebih banyak tapi <em>mengetahui</em> lebih sedikit tentang dunia baru. <strong>Jangan pernah memilih model dari skor train.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> diagnosis dulu, obat kemudian — dan obatnya <strong>berlawanan</strong>! Overfitting → kurangi kompleksitas. Underfitting → tambah kompleksitas. Salah diagnosis = salah obat = memperparah. &ldquo;Naikkan regularisasi&rdquo; untuk model yang underfit seperti &ldquo;minum obat tidur&rdquo; untuk orang yang pingsan — arahnya salah total.</p>
      </div>

      <h2 id="baseline">Baseline &amp; Challenger — Standar Kejujuran</h2>
      <p><strong>Definisi.</strong> Dua pembanding wajib sebelum klaim &ldquo;model bagus&rdquo;:</p>
      <ul>
        <li><strong>Baseline:</strong> model paling bodoh yang masuk akal — tebak rata-rata/mayoritas, atau satu variabel. Jika model canggihmu tidak jauh lebih baik → <strong>kompleksitas tidak justified</strong>.</li>
        <li><strong>Challenger:</strong> model pembanding <em>independen</em> dengan pendekatan berbeda (prinsip SR 11-7, A3.8) — misal logistik sederhana vs gradient boosting.</li>
      </ul>
      <p>Aturan: <strong>kompleksitas harus membayar dirinya</strong> — dengan perbaikan yang <em>material</em> (bukan 0,2 poin AUC), setelah memperhitungkan biaya interpretabilitas, maintenance, dan risiko.</p>

      <h2 id="fitur">Fitur: Mata Uang Sebenarnya Modeling</h2>
      <p>Pengalaman industri: <strong>fitur &gt; algoritma</strong>. Model linear dengan fitur yang direkayasa domain-expert sering mengalahkan deep learning dengan fitur mentah. Bekal dari track A1–A2 yang langsung dipakai:</p>
      <ul>
        <li><strong>Transformasi:</strong> log untuk skew (A1.4), standarisasi untuk regularisasi/PCA (A3.3, A3.11)</li>
        <li><strong>Encoding kategorikal:</strong> one-hot (sedikit kategori), target/WoE encoding (banyak kategori — <em>hati-hati leakage</em>, hitung di train fold!), embedding untuk teks</li>
        <li><strong>Interaksi domain:</strong> DPD × LTV, rasio utang/pendapatan — pengetahuan bisnis yang dikodekan jadi fitur</li>
        <li><strong>Missing sebagai fitur:</strong> indikator missing kadang prediktif sendiri (A1.7)</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Algoritma terbaru = hasil terbaik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> di data tabular risiko kredit, XGBoost (2014) masih mengalahkan arsitektur 2024 di banyak benchmark — karena yang menentukan adalah <em>fitur dan validasi</em>, bukan kebaruan algoritma. Fokus: pahami data → rekayasa fitur → validasi jujur. Algoritma adalah 10% terakhir, bukan 90% pertama.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Alur modeling = &ldquo;peta sebelum masuk hutan&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Leakage via target — &ldquo;fitur&rdquo; status hari ini</summary>
              <p>Target: macet 90 hari lagi. Fitur: <code className="inline">dpd_hari_ini</code>. Model: AUC 0,98. Apa masalahnya?</p>
              <p><strong>Langkah 1</strong> — <code className="inline">dpd_hari_ini = 90</code> → sudah macet hari ini → target &ldquo;macet 90 hari lagi&rdquo; hampir pasti ya.<br />
              <strong>Langkah 2</strong> — fitur mengandung <em>informasi masa depan relatif terhadap momen keputusan</em> (saat scoring, dpd yang dipakai harus dpd <em>saat itu</em>, bukan dpd yang sudah &ldquo;matang&rdquo;).<br />
              <strong>Langkah 3</strong> — tes: &ldquo;apakah fitur ini <em>diketahui</em> pada saat prediksi dibuat dalam produksi?&rdquo; Jika tidak → buang.</p>
              <p>Pelajaran: leakage paling umum = fitur yang &ldquo;terlalu tahu&rdquo;. AUC 0,98 bukan prestasi — ia <em>gejala</em>. Selalu curigai angka terlalu bagus.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Train/test split yang salah — shuffle time series</summary>
              <p>Data kredit 2020–2025. <code className="inline">train_test_split(shuffle=True)</code> → AUC 0,85. Out-of-time (train ≤2023, test 2024–25) → AUC 0,72. Mana yang jujur?</p>
              <p><strong>Langkah 1</strong> — shuffle mencampur masa depan ke train → model &ldquo;belajar&rdquo; pola 2024 lalu diuji di 2024 (bocor!).<br />
              <strong>Langkah 2</strong> — out-of-time meniru produksi: model hanya tahu masa lalu, diuji di masa depan.<br />
              <strong>Langkah 3</strong> — <strong>0,72 yang jujur</strong>. Selisih 0,13 = &ldquo;pajak&rdquo; yang akan kamu bayar di produksi jika percaya 0,85.</p>
              <p>Pelajaran: validasi harus <em>meniru produksi</em>. Untuk data waktu: out-of-time, bukan shuffle. (A3.8!)</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Test Set Hanya Boleh Dipakai Sekali</h2>
      <p>Dari 20 fitur noise murni, selalu ada yang &ldquo;terlihat bagus&rdquo; di train. Saksikan test set membongkarnya.</p>
      <PyodideLab
        title="Lab 1 — Hakim Terakhir yang Tak Bisa Dibohongi"
        hint="Naikkan fitur 20 → 100. R² train 'terbaik' makin besar, test tetap ~0. Itulah p-hacking."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Baseline yang Wajib Dikalahkan</h2>
      <p>Tiga level: tebak rata-rata → 1 variabel → 3 variabel. Model fancy harus mengalahkan baseline dengan jelas.</p>
      <PyodideLab
        title="Lab 2 — Prinsip Challenger"
        hint="Naikkan noise 2 → 5. Urutan tetap: baseline selalu pembanding jujur."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta2">🗺️ Peta Keputusan: Pertanyaan → Jenis Model</h2>

      <div className="decision-card">
        <h3>1. &ldquo;Berapa nilainya?&rdquo; (kontinu) → <strong>regresi</strong></h3>
        <p><strong>Contoh:</strong> LGD, EAD, return. Mulai OLS (A3.1) → regularisasi (A3.3) → GLM sesuai distribusi (A3.4).</p>
      </div>

      <div className="decision-card">
        <h3>2. &ldquo;Terjadi atau tidak?&rdquo; (biner) → <strong>klasifikasi</strong></h3>
        <p><strong>Contoh:</strong> default, fraud. Mulai logistik (A3.4) → metrik (A3.5) → kalibrasi (A3.6) → boosting (A3.15).</p>
      </div>

      <div className="decision-card">
        <h3>3. &ldquo;Kapan terjadinya?&rdquo; (waktu) → <strong>survival / time series</strong></h3>
        <p><strong>Contoh:</strong> time-to-default → survival (A3.12); forecast NPL → ARIMA (A3.9); risiko pasar → GARCH (A3.10).</p>
      </div>

      <div className="decision-card">
        <h3>4. &ldquo;Pola apa yang ada?&rdquo; (tanpa label) → <strong>unsupervised</strong></h3>
        <p><strong>Contoh:</strong> segmentasi → clustering; kompresi → PCA; fraud tanpa label → anomali (A3.11).</p>
      </div>

      <div className="decision-card">
        <h3>5. &ldquo;Apakah X menyebabkan Y?&rdquo; → <strong>inferensi kausal</strong></h3>
        <p><strong>Contoh:</strong> efek program → RCT/DiD/RDD/IV (A3.13). Bukan regresi biasa!</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Pertanyaan dulu, algoritma kemudian.</strong> Tulis target + keputusan + kapan dipakai.</li>
          <li>Train untuk belajar, validation untuk memilih, <strong>test sekali</strong> untuk menilai.</li>
          <li>Jurang train–test = diagnosis. Obat overfit ≠ obat underfit.</li>
          <li>Baseline dulu. Kompleksitas harus membayar dirinya.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Brief Model PD dari Nol</h2>
      <div className="callout">
        <p>Kamu diminta memimpin proyek model PD untuk KTA online. Direksi: &ldquo;pokoknya akurat.&rdquo; Kamu diminta menulis <strong>brief 1 halaman</strong> sebelum proyek jalan.</p>
        <p><strong>Pertanyaan:</strong> (a) Tulis 5 baris terpenting brief-mu. (b) Metrik evaluasi apa — dan kenapa bukan akurasi? (c) Apa desain validasi yang benar untuk data pengajuan 2022–2025?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Brief:</strong> (1) Target: PD 12-bulan per pengajuan; dipakai untuk <em>pricing</em> (butuh kalibrasi!) + <em>cutoff</em> penolakan. (2) Perangko waktu: semua fitur harus tersedia <em>saat pengajuan</em>. (3) Baseline: scorecard logistik existing (AUC 0,76). (4) Validasi: OOT walk-forward + audit leakage + challenger. (5) Monitoring: PSI bulanan, rekalibrasi kuartalan, ambang retraining AUC &lt; 0,72.</p>
          <p>(b) <strong>AUC/KS</strong> (ranking) + <strong>Brier/ECE</strong> (kalibrasi — karena dipakai pricing!) + <strong>expected cost</strong> di threshold operasional. Bukan akurasi: base rate ~8% → akurasi menipu (A3.5, A3.7).</p>
          <p>(c) <strong>Time-based split:</strong> train 2022–2023, validation 2024-H1, test 2024-H2 (sekali, dikunci); OOT 2025 untuk laporan. Random CV dilarang (temporal leakage). Stratifikasi per vintage.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Sebutkan 5 tahap alur modeling (dari problem framing ke monitoring).</li>
              <li>Fitur <code className="inline">rata2_telat_12bln</code> untuk prediksi bulan depan — leakage atau tidak? (Syaratnya?)</li>
              <li>Mengapa &ldquo;akurasi&rdquo; jarang jadi metrik utama di credit scoring? (2 alasan.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (1) <strong>Problem framing</strong> (target &amp; horizon), (2) <strong>data &amp; fitur</strong> (dengan cek leakage!), (3) <strong>validasi</strong> (split meniru produksi), (4) <strong>model &amp; tuning</strong>, (5) <strong>evaluasi bisnis</strong> + (6) <strong>monitoring</strong> (drift!).</p>
              <p><strong>2.</strong> <strong>Tidak leakage</strong> — <em>asal</em> 12 bulannya berakhir <em>sebelum</em> bulan prediksi (point-in-time!). Jika mencakup bulan target → leakage. Selalu tanya: &ldquo;kapan tepatnya fitur ini diketahui?&rdquo;</p>
              <p><strong>3.</strong> (a) <strong>Imbalance</strong>: 95% lancar → model &ldquo;bodoh&rdquo; dapat 95%. (b) <strong>Biaya asimetris</strong>: false negative (macet lolos) jauh lebih mahal dari false positive — akurasi buta terhadap biaya. Pakai AUC/KS/F1 + profit-based.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Setelah melihat skor test jelek, kamu tuning lagi dan skor test membaik. Masalah?"
        options={[
          "Tidak ada — itulah gunanya test",
          "Test-set overfitting: test sudah terkontaminasi keputusanmu. Angka final tidak jujur lagi",
          "Harus hapus test set",
          "Naikkan train",
        ]}
        correct={1}
        explanation="Benar: 'lihat test → tweak → lihat lagi' = p-hacking. Test set hanya untuk penilaian akhir SEKALI. Siapkan test kedua yang buta, atau kunci akses test."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Train 95, test 70. Diagnosis + obat?"
        options={[
          "Underfit — tambah kompleksitas",
          "Overfit — sederhanakan / regularisasi / tambah data. Jangan tambah kompleksitas!",
          "Normal",
          "Ganti metrik",
        ]}
        correct={1}
        explanation="Benar: jurang 25 poin = overfitting klasik. Obatnya MENGURANGI kompleksitas — arah berlawanan dengan underfitting. Salah diagnosis = salah obat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Model XGBoost AUC 0,851 vs baseline logistik AUC 0,848. Keputusan?"
        options={[
          "Deploy XGBoost — lebih tinggi",
          "Tolak kompleksitas: selisih 0,3 poin tidak material vs biaya interpretabilitas & maintenance. Pilih baseline (challenger principle)",
          "Rata-ratakan",
          "Cari algoritma baru",
        ]}
        correct={1}
        explanation="Benar: kompleksitas harus MEMBAYAR dirinya dengan perbaikan material. 0,3 poin AUC tidak sebanding dengan kotak hitam + risiko validasi. (Kecuali portofolio raksasa di mana 0,3 poin = rupiah besar — hitung dulu!)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Tahap mana yang paling sering menyebabkan kegagalan model di produksi?"
        options={[
          "Pemilihan algoritma",
          "Tuning hyperparameter",
          "Definisi masalah, leakage data, dan monitoring — bukan algoritmanya",
          "Visualisasi",
        ]}
        correct={2}
        explanation="Benar: 80% kegagalan = pertanyaan salah, fitur bocor dari masa depan, model tidak dimonitor lalu meluruh. Algoritma jarang menjadi pembeda — alur kerja yang menjadi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk data pengajuan kredit 2020–2024, split yang BENAR?"
        options={[
          "Random 80/20",
          "Time-based: train masa lalu → test masa depan (OOT). Random = temporal leakage",
          "Train 2024, test 2020",
          "Tidak perlu split",
        ]}
        correct={1}
        explanation="Benar: (pratinjau A3.8) data temporal → validasi harus menghormati panah waktu. Random split membuat model 'belajar dari masa depan'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. 'Fitur lebih penting dari algoritma.' Contoh konkret?"
        options={[
          "Ganti XGBoost ke LightGBM",
          "Menambah fitur 'DPD × LTV' dari pengetahuan bisnis sering mengalahkan ganti algoritma — informasi baru > mesin baru",
          "Naikkan learning rate",
          "Tambah layer",
        ]}
        correct={1}
        explanation="Benar: fitur mengkodekan pengetahuan domain yang tidak ada di data mentah. Interaksi DPD×LTV memberi tahu model sesuatu yang tidak bisa ia temukan sendiri dengan mudah. Algoritma memoles; fitur memberi makan."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>7 tahap:</strong> masalah → data → fitur → model → validasi → deploy → monitor. 80% waktu di luar training.</li>
          <li><strong>Train</strong> belajar, <strong>validation</strong> memilih, <strong>test sekali</strong> menilai. Alur satu arah.</li>
          <li><strong>Jurang train–test</strong> = diagnosis: besar = overfit (sederhanakan), train pun jelek = underfit (komplekskan).</li>
          <li><strong>Baseline &amp; challenger</strong> wajib. Kompleksitas harus membayar dirinya.</li>
          <li><strong>Fitur &gt; algoritma.</strong> Pertanyaan dulu, mesin kemudian.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a31-regresi-ols" className="btn btn-primary btn-sm">Next: A3.1 →</Link>
      </div>
    </div>
  );
}

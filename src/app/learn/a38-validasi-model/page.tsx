"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A38Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const psiData = [
    {
      x: ["<550", "550-600", "600-650", "650-700", "700-750", ">750"],
      y: [12, 18, 25, 22, 15, 8],
      name: "Distribusi training (%)",
      type: "bar",
      marker: { color: "#2a7de1" },
    },
    {
      x: ["<550", "550-600", "600-650", "650-700", "700-750", ">750"],
      y: [8, 14, 22, 24, 20, 12],
      name: "Distribusi produksi (%)",
      type: "bar",
      marker: { color: "#e8a838" },
    },
  ];

  const ootData = [
    {
      x: ["2022", "2023", "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4"],
      y: [0.84, 0.83, 0.81, 0.78, 0.72, 0.65],
      mode: "lines+markers",
      type: "scatter",
      name: "AUC out-of-time",
      line: { color: "#ef4444", width: 3 },
      marker: { size: 10 },
    },
    {
      x: ["2022", "2023", "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4"],
      y: [0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
      mode: "lines",
      type: "scatter",
      name: "Ambang minimum",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const leakageData = [
    {
      x: ["Validasi bocor", "Validasi jujur"],
      y: [0.97, 0.78],
      name: "AUC",
      type: "bar",
      marker: { color: ["#ef4444", "#22c55e"] },
      text: ["0,97", "0,78"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# LEAKAGE: target leakage vs validasi jujur - bedanya MENGERIKAN
# Fitur "rata2_tunggakan_12m_ke_depan" = info masa depan yang bocor.
import random, math
random.seed(17)

def sigmoid(z): return 1/(1+math.exp(-z))
n = 2000
x1 = [random.gauss(0,1) for _ in range(n)]   # fitur legit: skor
x2 = [random.gauss(0,1) for _ in range(n)]   # fitur legit: utilisasi
y  = [1 if random.random() < sigmoid(-2.5 - 1.2*a + 0.9*b) else 0 for a, b in zip(x1, x2)]
# FITUR BOCOR: dihitung dari info yang baru ada SETELAH periode prediksi
x_leak = [yi + random.gauss(0, 0.3) for yi in y]

def fit_predict(xs_list, y, xs_test):
    p = len(xs_list); ntr = len(y)
    X = [[1.0]+[xs[i] for xs in xs_list] for i in range(ntr)]
    A = [[sum(X[i][a]*X[i][b] for i in range(ntr)) for b in range(p+1)] for a in range(p+1)]
    bb = [sum(X[i][a]*y[i] for i in range(ntr)) for a in range(p+1)]
    M = [row[:]+[bi] for row, bi in zip(A, bb)]
    for c in range(p+1):
        piv = max(range(c, p+1), key=lambda r: abs(M[r][c]))
        M[c], M[piv] = M[piv], M[c]
        for r in range(c+1, p+1):
            f = M[r][c]/M[c][c]
            for k in range(c, p+2): M[r][k] -= f*M[c][k]
    beta = [0]*(p+1)
    for i in range(p, -1, -1):
        beta[i] = (M[i][p+1]-sum(M[i][j]*beta[j] for j in range(i+1, p+1)))/M[i][i]
    return [sum(beta[a]*([1.0]+[xs[i] for xs in xs_test])[a] for a in range(p+1)) for i in range(len(xs_test[0]))]

def auc_score(y, s):
    pos=[v for a,v in zip(y,s) if a==1]; neg=[v for a,v in zip(y,s) if a==0]
    return sum(1 for a in pos for b in neg if a>b)/ (len(pos)*len(neg))

# split jujur 70/30
ntr = 1400
for nama, feats in [("JUJUR (x1,x2)       ", [x1, x2]),
                    ("BOCOR (+x_leak)     ", [x1, x2, x_leak])]:
    tr = [f[:ntr] for f in feats]; te = [f[ntr:] for f in feats]
    s = fit_predict(tr, y[:ntr], te)
    print(f"{nama}: AUC test = {auc_score(y[ntr:], s):.3f}")
print()
print("Fitur bocor memberi AUC 'sempurna' - di produksi ia TIDAK ADA")
print("(info masa depan belum terjadi saat prediksi). Model runtuh total.")
print()
print("CARA DETEKSI: untuk tiap fitur, tanya 'kapan nilai ini tersedia?'")
print("Jika jawabannya 'setelah periode yang diprediksi' -> LEAKAGE.")`;

  const lab2Code = `# PSI dari nol: ukur pergeseran populasi antar periode
# PSI = sum((Aktual% - Ekspektasi%) * ln(Aktual%/Ekspektasi%))
import math

def psi(expected_pct, actual_pct):
    total = 0.0
    print(f"{'bucket':>12} | {'train%':>6} | {'prod%':>6} | kontribusi")
    print("-"*48)
    for b, e, a in zip(["<550","550-600","600-650","650-700","700-750",">750"],
                       expected_pct, actual_pct):
        e = max(e, 0.0001); a = max(a, 0.0001)
        c = (a - e) * math.log(a/e)
        total += c
        print(f"{b:>12} | {e:>5.1%} | {a:>5.1%} | {c:.4f}")
    return total

train = [12, 18, 25, 22, 15, 8]
prod  = [8, 14, 22, 24, 20, 12]
print("Skenario 1: pergeseran SEDANG (training vs produksi)\n")
v = psi(train, prod)
print(f"\nPSI = {v:.4f} ->", "STABIL (<0.1)" if v < 0.1 else ("WASPADA (0.1-0.25)" if v < 0.25 else "BERGESER SIGNIFIKAN (>=0.25)!"))

print("\n" + "="*48 + "\nSkenario 2: pergeseran BESAR\n")
prod2 = [5, 8, 15, 20, 27, 25]
v2 = psi(train, prod2)
print(f"\nPSI = {v2:.4f} ->", "STABIL (<0.1)" if v2 < 0.1 else ("WASPADA (0.1-0.25)" if v2 < 0.25 else "BERGESER SIGNIFIKAN (>=0.25)!"))
print("\nCOBA: ubah satu bucket prod2 jadi 0% (misal segmen hilang total).")
print("Lihat kontribusi PSI meledak - PSI sensitif pada bucket yang hilang.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.8 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Validasi Model:<br />Leakage, Out-of-Time &amp; Cara Lolos Audit Regulator</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: AUC 0,97 yang Runtuh di Hari Pertama Produksi</a></li>
          <li><a href="#leakage">Leakage — Tiga Wajah Kebocoran Informasi</a></li>
          <li><a href="#oot">Out-of-Time Validation — Ujian yang Sebenarnya</a></li>
          <li><a href="#psi">PSI — Radar Pergeseran Populasi</a></li>
          <li><a href="#challenge">Effective Challenge — Standar SR 11-7</a></li>
          <li><a href="#lab1">🔬 Lab 1: Menyaksikan Leakage Menggelembungkan AUC</a></li>
          <li><a href="#lab2">🔬 Lab 2: Menghitung PSI dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Desain Validasi per Risiko</a></li>
          <li><a href="#case">📋 Mini-Case: Checklist Validasi Sebelum Go-Live</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mengidentifikasi tiga jenis leakage (target, train-test contamination, temporal) dan merancang pencegahannya.</li>
          <li>Merancang skema validasi out-of-time yang benar untuk data berdimensi waktu.</li>
          <li>Menghitung dan menginterpretasikan PSI dengan ambang &lt;0,1 / 0,1–0,25 / &gt;0,25.</li>
          <li>Menjelaskan prinsip effective challenge (SR 11-7): replikasi independen, challenger model, dan dokumentasi.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: AUC 0,97 yang Runtuh di Hari Pertama Produksi</h2>
      <div className="story">
        <p>Startup lending &ldquo;DanaKilat&rdquo; merekrut data scientist top. Tiga minggu kemudian ia menunjukkan model PD dengan <strong>AUC 0,97</strong> — nyaris sempurna. &ldquo;Fitur terbaiknya,&rdquo; katanya bangga, &ldquo;rata-rata tunggakan 12 bulan ke depan.&rdquo;</p>
        <p>CTO yang mendengarnya langsung pucat. <em>Rata-rata tunggakan 12 bulan ke depan</em> — informasi yang <strong>baru ada 12 bulan setelah</strong> prediksi dibuat! Di data historis, fitur itu tersedia (karena masa lalu sudah terjadi). Di produksi, saat memprediksi nasabah baru, fitur itu <strong>tidak ada</strong> — masa depan belum terjadi. Model AUC 0,97 itu pada dasarnya berkata: &ldquo;Saya bisa memprediksi masa depan dengan sempurna, asal diberi tahu masa depannya dulu.&rdquo;</p>
        <p>Twist-nya: leakage seperti ini <strong>tidak terdeteksi oleh metrik apapun</strong> — AUC, KS, Brier semuanya terlihat cantik. Satu-satunya pertahanan adalah <em>disiplin berpikir temporal</em>: untuk setiap fitur, tanya &ldquo;kapan nilai ini tersedia di produksi?&rdquo;. Lesson ini tentang validasi yang tidak bisa dibohongi.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="leakage">Leakage — Tiga Wajah Kebocoran Informasi</h2>
      <p><strong>Definisi.</strong> <em>Data leakage</em> (kebocoran data): informasi dari <strong>luar batas pengetahuan yang sah</strong> bocor ke proses training/validasi, membuat performa terlihat bagus palsu. Tiga wajahnya:</p>
      <ol>
        <li><strong>Target leakage:</strong> fitur yang mengandung informasi target (atau masa depan target). Contoh: &ldquo;status_koleksi_akhir&rdquo; untuk memprediksi default; &ldquo;rata-rata tunggakan 12 bulan ke depan&rdquo;. <em>Deteksi:</em> AUC &ldquo;terlalu bagus&rdquo; (&gt; 0,95 patut dicurigai); audit temporal tiap fitur — &ldquo;kapan tersedia?&rdquo;. <em>Contoh terkenal:</em> model yang memakai &ldquo;tanggal_pelunasan&rdquo; untuk prediksi default — yang lunas tidak mungkin default!</li>
        <li><strong>Train-test contamination:</strong> informasi test set bocor ke training. Contoh: imputasi/scaling dihitung dari <em>seluruh</em> data sebelum split; SMOTE sebelum split (A3.7); duplikat observasi yang sama di train &amp; test; <em>feature selection</em> memakai seluruh data. <em>Obat:</em> semua preprocessing di-fit <strong>hanya</strong> di train fold (pipeline!), split dulu baru transform.</li>
        <li><strong>Temporal leakage:</strong> untuk data waktu — training memakai observasi yang <em>terjadi setelah</em> periode yang diprediksi. Contoh: random K-fold CV pada data kredit 2020–2024 — fold &ldquo;validasi&rdquo; berisi 2024 sementara &ldquo;train&rdquo; berisi 2022: model belajar dari masa depan! <em>Obat:</em> <strong>time-based split</strong> — train di masa lalu, validasi di masa depan (lihat bagian OOT).</li>
      </ol>

      <PlotlyChart
        data={leakageData}
        title="Leakage: AUC 0,97 (palsu) vs 0,78 (jujur)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "AUC", range: [0, 1.1] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang — AUC dengan fitur bocor vs tanpa.</p>
        <p><strong>Interpretasi:</strong> selisih 19 poin AUC <em>sepenuhnya</em> berasal dari informasi masa depan yang tidak akan ada di produksi. Inilah mengapa &ldquo;AUC tinggi&rdquo; bukan bukti model bagus — bisa jadi bukti leakage. <strong>Kecurigaan sehat:</strong> AUC &gt; 0,95 di masalah sulit = investigasi leakage dulu, rayakan kemudian.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji leakage termurah: <strong>&ldquo;perangko waktu&rdquo;</strong> (<em>timestamp test</em>). Untuk tiap fitur, tulis kapan nilainya <em>tersedia secara operasional</em> vs kapan <em>prediksi dibuat</em>. Jika tersedia &gt; prediksi → bocor. Latihan ini 30 menit bisa menyelamatkan 3 bulan kerja sia-sia — dan kariermu saat auditor menemukannya duluan.</p>
      </div>

      <h2 id="oot">Out-of-Time Validation — Ujian yang Sebenarnya</h2>
      <p><strong>Definisi.</strong> Validasi <strong>out-of-time</strong> (OOT): latih di periode <Tex math={String.raw`[t_0, t_1]`} />, uji di periode <Tex math={String.raw`(t_1, t_2]`} /> yang <strong>belum pernah dilihat</strong> — mensimulasikan persis cara model dipakai di produksi (memprediksi masa depan dari masa lalu).</p>
      <ul>
        <li><strong>Kenapa random CV tidak cukup:</strong> random split mengasumsikan observasi <em>independent</em> — padahal data kredit/fraud punya <strong>drift temporal</strong> (perilaku 2022 ≠ 2024). Random CV mengukur &ldquo;performa jika masa depan mirip masa lalu yang diacak&rdquo; — bukan &ldquo;performa di masa depan yang sebenarnya&rdquo;.</li>
        <li><strong>Skema yang benar:</strong> <em>walk-forward</em> — train 2020–2022 → test 2023; train 2020–2023 → test 2024. Makin jauh ke depan, makin jujur.</li>
        <li><strong>Out-of-sample vs out-of-time:</strong> OOS = data tak terlihat (bisa acak); OOT = tak terlihat <em>dan</em> dari masa depan. Untuk data berwaktu, OOT adalah standar emas.</li>
      </ul>

      <PlotlyChart
        data={ootData}
        title="Degradasi Out-of-Time: AUC Melorot Menjauhi Training"
        layout={{ xaxis: { title: "Periode" }, yaxis: { title: "AUC", range: [0.55, 0.9] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = AUC model di tiap periode OOT setelah training (2022); garis putus-putus = ambang minimum operasional.</p>
        <p><strong>Interpretasi:</strong> performa <strong>meluruh</strong> seiring menjauh dari periode training: 0,84 → 0,65, menembus ambang di Q3 2024. Inilah <strong>model decay</strong> — dunia berubah (kebijakan, perilaku, ekonomi), model tidak. Random CV tidak akan pernah menunjukkan grafik ini. <strong>Keputusan operasional:</strong> jadwalkan retraining/rekalibrasi <em>sebelum</em> menembus ambang — validasi bukan sekali, tapi siklus.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Cross-validation 5-fold sudah cukup untuk semua kasus.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> random K-fold valid <em>hanya jika</em> observasi independen dan tidak ada dimensi waktu. Untuk data kredit, fraud, dan deret waktu — di mana &ldquo;masa depan&rdquo; adalah yang diprediksi — random CV adalah <strong>temporal leakage yang dilembagakan</strong>: model &ldquo;belajar&rdquo; dari 2024 untuk &ldquo;memvalidasi&rdquo; di 2022. Hasilnya optimis palsu. Pakai time-based split / walk-forward.</p>
      </div>

      <h2 id="psi">PSI — Radar Pergeseran Populasi</h2>
      <p><strong>Definisi.</strong> PSI (<em>population stability index</em>) mengukur seberapa jauh distribusi suatu variabel (atau skor model) <strong>bergeser</strong> antara dua populasi (training vs produksi, atau antar periode):</p>
      <Tex math={String.raw`PSI = \sum_{b} (A_b - E_b) \cdot \ln\left(\frac{A_b}{E_b}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`E_b`} />: % observasi di bucket <Tex math={String.raw`b`} /> pada populasi <em>referensi</em> (training)</li>
        <li><Tex math={String.raw`A_b`} />: % di bucket yang sama pada populasi <em>aktual</em> (produksi/saat ini)</li>
        <li>Ambang praktik industri: <strong>&lt; 0,1</strong> = stabil; <strong>0,1–0,25</strong> = waspada, investigasi; <strong>&gt; 0,25</strong> = bergeser signifikan, tindakan</li>
      </ul>
      <p>PSI dipakai dua arah: <strong>stabiltas input</strong> (apakah karakteristik nasabah berubah?) dan <strong>stabilitas output</strong> (apakah distribusi skor PD bergeser?). Keduanya dimonitor berkala — biasanya bulanan/kuartalan.</p>

      <PlotlyChart
        data={psiData}
        title="Pergeseran Distribusi Skor: Training vs Produksi"
        layout={{ barmode: "group", xaxis: { title: "Bucket skor" }, yaxis: { title: "% populasi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap bucket skor, dua batang: biru = training, kuning = produksi.</p>
        <p><strong>Interpretasi:</strong> produksi menggeser ke kanan (skor lebih tinggi) — komposisi nasabah berubah: lebih sedikit skor &lt;600, lebih banyak &gt;700. Mungkin strategi akuisisi berubah, atau definisi skor berubah. <strong>Pertanyaan kuncinya bukan</strong> &ldquo;PSI berapa?&rdquo; <strong>melainkan</strong> &ldquo;apakah model yang dilatih di populasi kiri masih valid untuk populasi kanan?&rdquo; — jawab dengan revalidasi OOT di populasi baru.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> PSI adalah <strong>alarm kebakaran, bukan diagnosis</strong>. PSI &gt; 0,25 tidak otomatis berarti model rusak — bisa jadi pergeseran yang <em>baik</em> (akuisisi nasabah lebih berkualitas). Tapi ia mewajibkan investigasi: <em>kenapa</em> bergeser, dan apakah asumsi model masih berlaku. Jangan pernah &ldquo;menyetel ulang baseline PSI&rdquo; agar alarm berhenti tanpa memahami penyebabnya — itu mematikan detektor asap karena berisik.</p>
      </div>

      <h2 id="challenge">Effective Challenge — Standar SR 11-7</h2>
      <p><strong>Definisi.</strong> SR 11-7 (panduan model risk management OCC AS, diadopsi global sebagai <em>best practice</em>) mewajibkan <strong>effective challenge</strong> — pengujian kritis dan independen terhadap model:</p>
      <ul>
        <li><strong>Validasi independen:</strong> validator <strong>bukan</strong> tim yang membangun model — menghindari <em>confirmation bias</em> (&ldquo;modelku pasti benar&rdquo;).</li>
        <li><strong>Replikasi:</strong> bangun ulang model dari dokumentasi. Jika tidak bisa direplikasi, dokumentasinya gagal — dan model tidak auditable.</li>
        <li><strong>Challenger model:</strong> bangun model pembanding dengan pendekatan <em>berbeda</em> (misal benchmark = regresi logistik sederhana vs model utama = gradient boosting). Jika model kompleks tidak mengalahkan benchmark sederhana secara material → kompleksitas tidak justified.</li>
        <li><strong>Uji sensitivitas &amp; skenario:</strong> bagaimana model berperilaku di kondisi stres? (input ekstrem, krisis ekonomi) — model yang hanya valid di &ldquo;cuaca cerah&rdquo; adalah liabilitas.</li>
        <li><strong>Dokumentasi:</strong> tujuan, data, metodologi, asumsi, keterbatasan, hasil validasi — cukup lengkap sehingga pihak ketiga bisa menilai. &ldquo;Model tanpa dokumentasi = model tanpa pemilik.&rdquo;</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Validasi = menjalankan metrik di test set.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> metrik di test set hanyalah <em>satu baris</em> dalam laporan validasi. Validasi penuh mencakup: audit data &amp; leakage, uji asumsi, stabilitas (PSI), OOT, sensitivitas, challenger benchmark, review kode, dan dokumentasi. Bank yang hanya &ldquo;cek AUC&rdquo; akan gagal audit regulator — dan lebih buruk, akan gagal di krisis pertama.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Paket validasi minimum sebelum go-live:</strong> (1) audit leakage temporal per fitur; (2) performa OOT (bukan cuma random CV); (3) diskriminasi (AUC/KS) + kalibrasi (ECE/Brier) — keduanya; (4) challenger benchmark; (5) PSI baseline tercatat untuk monitoring; (6) analisis sensitivitas input ekstrem. Tidak ada yang boleh dilewati dengan alasan &ldquo;deadline&rdquo;.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Validasi = &ldquo;bukti model bekerja di dunia nyata&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: K-fold vs out-of-time — angka yang jujur</summary>
              <p>Model PD: 5-fold CV AUC = 0,82. Out-of-time (train 2020–23, test 2024) AUC = 0,74. Mana yang dilaporkan ke regulator?</p>
              <p><strong>Langkah 1</strong> — K-fold (shuffle): mencampur 2024 ke train → <em>lookahead</em> (D7!). 0,82 = <em>optimis</em>.<br />
              <strong>Langkah 2</strong> — out-of-time: meniru produksi (hanya masa lalu → masa depan). 0,74 = <em>jujur</em>.<br />
              <strong>Langkah 3</strong> — regulator (OJK/Basel): <strong>out-of-time / out-of-sample</strong> — model harus terbukti di data yang <em>belum terlihat</em> saat training.</p>
              <p>Pelajaran: validasi = simulasi produksi. Shuffle = simulasi dunia tanpa waktu — dunia yang tidak ada.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Audit model — checklist 5 menit</summary>
              <p>Vendor mengklaim &ldquo;model PD AUC 0,9&rdquo;. Tulis 5 pertanyaan audit sebelum percaya.</p>
              <p><strong>Langkah 1</strong> — &ldquo;AUC di <em>data apa</em>? (train? test? out-of-time?)&rdquo;<br />
              <strong>Langkah 2</strong> — &ldquo;Bagaimana split-nya? Ada leakage fitur? (daftar fitur + timestamp ketersediaan!)&rdquo;<br />
              <strong>Langkah 3</strong> — &ldquo;Kalibrasinya? (AUC tanpa kalibrasi = ranking tanpa level — A3.6!)&rdquo;<br />
              <strong>Langkah 4</strong> — &ldquo;Stabilitas? (AUC per tahun/vintage — 0,9 rata-rata bisa = 0,95 &amp; 0,75!)&rdquo;<br />
              <strong>Langkah 5</strong> — &ldquo;Monitoring apa setelah deploy? (drift detection!)&rdquo;</p>
              <p>Pelajaran: &ldquo;AUC 0,9&rdquo; tanpa konteks = angka marketing. Lima pertanyaan ini memisahkan model dari sulap.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Menyaksikan Leakage Menggelembungkan AUC</h2>
      <p>Model yang sama, dua dunia: dengan dan tanpa fitur bocor. Rasakan bedanya.</p>
      <PyodideLab
        title="Lab 1 — Target Leakage: AUC Palsu vs Jujur"
        hint="AUC 0,97 dari fitur bocor = ilusi. Di produksi fitur itu tidak ada. Selalu audit 'kapan tersedia?'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Menghitung PSI dari Nol</h2>
      <p>Hitung PSI per bucket untuk dua skenario pergeseran. Rasakan ambang 0,1 dan 0,25.</p>
      <PyodideLab
        title="Lab 2 — Population Stability Index Manual"
        hint="Coba: buat satu bucket produksi = 0%. Kontribusi PSI meledak — hilangnya segmen adalah sinyal keras."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Desain Validasi per Risiko</h2>

      <div className="decision-card">
        <h3>1. Data berdimensi waktu (kredit, fraud) → <strong>time-based split + OOT walk-forward</strong></h3>
        <p><strong>Kondisi:</strong> prediksi tentang masa depan; ada drift.</p>
        <p><strong>Kenapa:</strong> random CV = temporal leakage. OOT mensimulasikan produksi yang sebenarnya.</p>
        <p><strong>Contoh nyata:</strong> validasi model PD: train 2021–2023, OOT 2024.</p>
      </div>

      <div className="decision-card">
        <h3>2. Data independen tanpa waktu (survei sekali ukur) → <strong>stratified K-fold CV</strong></h3>
        <p><strong>Kondisi:</strong> observasi independen, tidak ada urutan temporal.</p>
        <p><strong>Kenapa:</strong> random CV valid dan efisien di sini. Stratifikasi untuk imbalance.</p>
        <p><strong>Contoh nyata:</strong> survei kepuasan satu titik waktu.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data berkelompok (banyak observasi per nasabah) → <strong>group K-fold</strong></h3>
        <p><strong>Kondisi:</strong> observasi tidak independen dalam grup.</p>
        <p><strong>Kenapa:</strong> transaksi nasabah yang sama di train &amp; test = contamination. Satu grup = satu fold.</p>
        <p><strong>Contoh nyata:</strong> model fraud transaksi (satu kartu banyak transaksi).</p>
      </div>

      <div className="decision-card">
        <h3>4. Model berdampak regulasi/keuangan besar → <strong>paket SR 11-7 penuh</strong></h3>
        <p><strong>Kondisi:</strong> model dipakai untuk modal, cadangan, keputusan kredit massal.</p>
        <p><strong>Kenapa:</strong> regulator &amp; audit menuntut effective challenge: validator independen, challenger, dokumentasi.</p>
        <p><strong>Contoh nyata:</strong> model IRB, IFRS 9 ECL, stress testing.</p>
      </div>

      <div className="decision-card">
        <h3>5. Monitoring pasca go-live → <strong>PSI + backtesting kalibrasi berkala</strong></h3>
        <p><strong>Kondisi:</strong> model sudah produksi.</p>
        <p><strong>Kenapa:</strong> dunia berubah; validasi bukan peristiwa sekali. PSI bulanan + kurva kalibrasi kuartalan + ambang retraining.</p>
        <p><strong>Contoh nyata:</strong> dashboard monitoring model PD.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Perangko waktu tiap fitur:</strong> kapan tersedia vs kapan prediksi dibuat.</li>
          <li>Ada dimensi waktu → <strong>OOT</strong>, bukan random CV.</li>
          <li>Preprocessing di-fit <strong>di dalam</strong> fold latih — tidak pernah sebelum split.</li>
          <li>PSI &gt; 0,25 = investigasi wajib. AUC &gt; 0,95 = curigai leakage dulu.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Checklist Validasi Sebelum Go-Live</h2>
      <div className="callout">
        <p>Kamu validator independen untuk model <em>early warning</em> kredit korporat (akan dipakai menentukan CKPN Rp3 triliun). Dokumen pengembang: AUC 0,91 (5-fold CV acak), 40 fitur, &ldquo;tidak ada leakage&rdquo;.</p>
        <p>Kamu menemukan: (a) fitur &ldquo;restrukturisasi_6m&rdquo; — didefinisikan dari kejadian dalam 6 bulan <em>setelah</em> tanggal observasi; (b) imputasi median dihitung dari seluruh data sebelum split; (c) tidak ada validasi OOT; (d) tidak ada challenger model.</p>
        <p><strong>Pertanyaan:</strong> klasifikasikan tiap temuan (jenis leakage / pelanggaran apa), dan putuskan: go-live, bersyarat, atau tolak?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Target/temporal leakage</strong> — fitur dari masa depan. Di produksi tidak tersedia. Fatal.</p>
          <p>(b) <strong>Train-test contamination</strong> — imputasi sebelum split membocorkan distribusi test ke train. Biasanya kecil, tapi menunjukkan disiplin pipeline buruk.</p>
          <p>(c) <strong>Desain validasi salah</strong> — untuk peringatan dini kredit (temporal), random CV tidak valid; wajib OOT.</p>
          <p>(d) <strong>Melanggar effective challenge</strong> — tanpa benchmark, tidak tahu apakah kompleksitas 40 fitur justified.</p>
          <p><strong>Putusan: TOLAK go-live.</strong> Temuan (a) saja sudah fatal — AUC 0,91 tidak bermakna. Syarat perbaikan: buang fitur bocor, pipeline yang benar, OOT walk-forward, challenger (logistik sederhana), dokumentasi lengkap. Baru kemudian validasi ulang independen.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Nested CV: kapan dibutuhkan? (Bedakan dengan CV biasa.)</li>
              <li>Data leakage via <em>preprocessing</em>: beri 1 contoh konkret + obatnya.</li>
              <li>Champion-challenger: desain 3 bulan untuk mengganti model PD produksi. Tulis alurnya.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Saat <em>tuning hyperparameter</em> + estimasi performa jujur: CV biasa memakai data yang sama untuk pilih λ <em>dan</em> nilai → optimis. Nested: outer loop untuk evaluasi, inner loop untuk tuning. Mahal tapi jujur.</p>
              <p><strong>2.</strong> Contoh: imputasi median dihitung dari <em>seluruh</em> data (termasuk test!) sebelum split → statistik test bocor ke train. Obat: <strong>Pipeline</strong> (D12!) — semua preprocessing di dalam CV fold.</p>
              <p><strong>3.</strong> Bulan 1: challenger jalan <em>shadow</em> (skor dicatat, keputusan tetap champion). Bulan 2: bandingkan metrik + stabilitas. Bulan 3: jika challenger menang signifikan &amp; stabil → <em>bertahap</em> (10% → 50% → 100% traffic). Rollback plan siap.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Fitur 'total_denda_12_bulan_ke_depan' untuk prediksi default bulan ini. Masalah?"
        options={[
          "Tidak ada — fitur prediktif kuat",
          "Target/temporal leakage — informasi masa depan yang tidak tersedia saat prediksi di produksi",
          "Multikolinearitas",
          "Heteroskedastisitas",
        ]}
        correct={1}
        explanation="Benar: fitur dari masa depan = leakage klasik. AUC akan terlihat fantastis di data historis dan runtuh total di produksi. Uji 'perangko waktu': kapan tersedia vs kapan diprediksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Untuk model PD dengan data 2020–2024, skema validasi yang BENAR?"
        options={[
          "Random 5-fold CV",
          "Time-based split / walk-forward: train masa lalu, validasi masa depan (OOT)",
          "Train di 2024, test di 2020",
          "Satu split 50:50 acak",
        ]}
        correct={1}
        explanation="Benar: data temporal → validasi harus menghormati panah waktu. Random CV = temporal leakage yang dilembagakan. OOT mensimulasikan persis cara model dipakai: memprediksi masa depan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. PSI = 0,31 untuk distribusi skor PD bulan ini vs training. Tindakan?"
        options={[
          "Abaikan — model masih jalan",
          "Investigasi wajib: kenapa bergeser, apakah asumsi masih valid; revalidasi OOT di populasi baru sebelum putuskan retraining",
          "Setel ulang baseline agar PSI turun",
          "Naikkan threshold",
        ]}
        correct={1}
        explanation="Benar: >0,25 = bergeser signifikan = investigasi wajib. 'Menyetel ulang baseline' tanpa memahami penyebab = mematikan detektor asap. PSI adalah alarm, bukan vonis — tapi alarm tidak boleh diabaikan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Scaling dihitung dari seluruh data, baru kemudian split train/test. Ini?"
        options={[
          "Praktik standar yang benar",
          "Train-test contamination — statistik test bocor ke training; harus fit scaler hanya di train fold",
          "Target leakage",
          "Tidak berpengaruh",
        ]}
        correct={1}
        explanation="Benar: mean/SD dari seluruh data mengandung informasi test set. Efeknya biasanya kecil untuk scaling, tapi prinsipnya fatal — dan untuk imputasi/feature selection bisa besar. Pipeline yang benar: split dulu, fit di train saja."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Apa peran 'challenger model' dalam effective challenge (SR 11-7)?"
        options={[
          "Menggantikan model utama",
          "Benchmark independen dengan pendekatan berbeda — menguji apakah kompleksitas model utama justified oleh perbaikan material",
          "Mempercepat training",
          "Menghitung PSI",
        ]}
        correct={1}
        explanation="Benar: challenger (misal logistik sederhana vs boosting kompleks) adalah 'pembanding jujur'. Jika model kompleks hanya menang 0,5 poin AUC, kompleksitasnya tidak justified — pilih yang sederhana."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Model fraud: transaksi satu kartu tersebar di train dan test fold. Risiko?"
        options={[
          "Tidak ada — transaksi independen",
          "Contamination via grup: pola kartu yang sama ada di kedua sisi → performa overoptimis. Solusi: group K-fold (satu kartu = satu fold)",
          "Temporal leakage",
          "Target leakage",
        ]}
        correct={1}
        explanation="Benar: transaksi satu kartu tidak independen — model 'menghafal' kartu, bukan pola fraud umum. Group K-fold memastikan tidak ada kartu yang bocor antar fold."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Leakage</strong> tiga wajah: target (info masa depan), contamination (preprocessing sebelum split), temporal (random CV di data waktu). Uji perangko waktu tiap fitur.</li>
          <li><strong>OOT walk-forward</strong> = standar emas data temporal; random CV = leakage yang dilembagakan.</li>
          <li><strong>PSI:</strong> &lt;0,1 stabil; 0,1–0,25 waspada; &gt;0,25 investigasi wajib. Alarm, bukan vonis.</li>
          <li><strong>Effective challenge (SR 11-7):</strong> validator independen, replikasi, challenger model, uji stres, dokumentasi.</li>
          <li><strong>Jangan</strong> percaya AUC &gt; 0,95 tanpa audit leakage; jangan validasi sekali lalu lupa — monitoring itu siklus.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a37-imbalanced-data" className="btn btn-secondary btn-sm">← A3.7</Link>
        <Link href="/learn/a39-time-series" className="btn btn-primary btn-sm">Next: A3.9 →</Link>
      </div>
    </div>
  );
}

import type { V2Lesson } from "../lib/types";

// Kurva bias-variance: training error turun terus, validation error berbentuk U.
const BV_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Kurva bias-variance: training error turun terus, validation error berbentuk U dengan minimum di model B.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">16%</text><text x="54" y="74">12%</text><text x="54" y="124">8%</text><text x="54" y="174">4%</text><text x="54" y="224">0%</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="140" y="240">C: sederhana</text><text x="280" y="240">B: seimbang</text><text x="420" y="240">A: kompleks</text></g>
<line x1="280" y1="20" x2="280" y2="220" stroke="var(--text)" stroke-width="1" stroke-dasharray="5,4" opacity="0.6"/>
<polyline points="140,120 280,157.5 420,195" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="140,107.5 280,132.5 420,32.5" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<g fill="var(--c1)"><circle cx="140" cy="120" r="4"/><circle cx="280" cy="157.5" r="4"/><circle cx="420" cy="195" r="4"/></g>
<g fill="var(--c2)"><circle cx="140" cy="107.5" r="4"/><circle cx="280" cy="132.5" r="4"/><circle cx="420" cy="32.5" r="4"/></g>
<circle cx="280" cy="132.5" r="9" fill="none" stroke="var(--text)" stroke-width="1.5"/>
<text x="280" y="12" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">optimum: B</text>
<g font-size="10" font-family="var(--font-ui)"><line x1="352" y1="28" x2="376" y2="28" stroke="var(--c1)" stroke-width="2.5"/><text x="382" y="32" fill="var(--chart-text)">training error</text><line x1="352" y1="44" x2="376" y2="44" stroke="var(--c2)" stroke-width="2.5"/><text x="382" y="48" fill="var(--chart-text)">validation error</text></g>
<text x="14" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 14 120)">error</text>
</svg>`;

export const pmb3: V2Lesson = {
  slug: "pm-b3-ml-investasi",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B3 Machine Learning: untuk Investasi",
  estMinutes: 55,
  steps: [
    {
      id: "supervised",
      eyebrow: "Langkah 1 · Supervised & Validasi",
      title: "AI \u2018akurat 99%\u2019 yang bangkrut",
      prose: [
        "Startup meluncurkan \u2018AI prediksi saham akurat 99%\u2019. Investor antre. Setahun kemudian: return \u221240%. Twist-nya: 99% adalah akurasi training — model menghafal noise historis (overfitting). Validasi memakai cross-validation acak pada time series (= look-ahead bias: \u2018melihat\u2019 masa depan). Dua dosa fatal: tidak ada test set yang jujur. ML tanpa validasi benar = astrologi dengan GPU.",
        "Supervised: prediksi y dari X berlabel — regresi (return kontinu) & klasifikasi (naik/turun, default/tidak). Train/test split: latih di masa lalu, uji di \u2018masa depan\u2019 yang belum dilihat. Untuk time series: walk-forward (train 2015\u201320 \u2192 test 2021; geser) — CV acak DILARANG (look-ahead).",
        "Metrik: regresi \u2192 RMSE/MAE; klasifikasi \u2192 akurasi/precision/recall/AUC (untuk default: recall penting). Validasi ML seperti ujian sekolah: train = latihan soal, test = ujian. CV acak di time series = ujian dengan kunci jawaban bocor.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Data leakage: fitur yang \u201cbocor\u201d dari masa depan — memakai laba Q4 untuk prediksi return Q4 (laporan keluar Q1 tahun depan), atau normalisasi memakai seluruh data termasuk test. Setiap transformasi di-fit hanya pada train.",
      },
      quiz: [
        {
          q: "Validasi benar untuk model time series?",
          options: [
            { text: "CV acak 5-fold", why: "Salah: CV acak \u201cmembocorkan\u201d masa depan ke training (look-ahead)." },
            { text: "Walk-forward (train masa lalu \u2192 test masa depan)", why: "Benar: walk-forward meniru live trading. Urutan waktu = sakral.", correct: true },
            { text: "Tidak perlu validasi", why: "Salah: tanpa validasi = astrologi dengan GPU." },
            { text: "Test = training", why: "Salah: itu mengukur kemampuan menghafal, bukan generalisasi." },
          ],
        },
      ],
      reference: "Time series \u2192 walk-forward. CV acak = look-ahead bias. Transformasi di-fit hanya pada train.",
    },
    {
      id: "bias-variance",
      eyebrow: "Langkah 2 · Bias-Variance + chart",
      title: "Pilih model dari validation, bukan training",
      prose: [
        "Tiga model prediksi return. Training error: A 2%, B 5%, C 8%. Validation error: A 15%, B 7%, C 9%. A: overfit (2% \u2192 15% = menghafal). C: underfit (8% \u2192 9% = terlalu sederhana). B: seimbang (5% \u2192 7%).",
        "Pilih B. Aturan: pilih model dengan validation error terkecil — bukan training error. Training error = \u201cnilai latihan\u201d; validation = \u201cnilai ujian sesungguhnya\u201d. Startup \u201c99% akurat\u201d (training) = Model A = bom waktu.",
        "Cara membaca: sumbu X = kompleksitas model (C sederhana ke A kompleks), sumbu Y = error persen; dua garis = training error dan validation error untuk model A, B, C.",
        "Interpretasi: training error turun terus saat model makin kompleks, tetapi validation error berbentuk U dengan minimum di B (7%) — titik itulah model yang dipilih; A overfit (gap 2% ke 15%), C underfit (8% ke 9%).",
      ],
      figure: {
        svg: BV_SVG,
        alt: "Kurva bias-variance: training error turun terus, validation error berbentuk U dengan minimum di model B.",
        caption: "Kurva bias-variance: training error turun terus, validation error berbentuk U — model dipilih di titik minimum validasi (B), bukan training.",
      },
      formula: String.raw`\text{error} = \text{bias}^2 + \text{variance} + \text{noise}`,
      formulaNote: "error = total kesalahan prediksi; bias² = error karena model terlalu sederhana (underfit); variance = error karena terlalu sensitif ke data training (overfit); noise = tak tereduksi. Contoh: model A train 2% → val 15% = variance mendominasi. Interpretasi: pilih model di titik minimum kurva validasi — bukan training.",
      tasks: [
        { id: "t1", text: "Pilih `best`: model dengan validation error terkecil" },
        { id: "t2", text: "Cetak pilihannya" },
      ],
      expected: "best=B",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih A karena training error 2% terkecil. Gap train\u2192test yang besar = overfitting. Model optimal = titik minimum kurva validasi, bukan training.",
      },
      hints: [
        "Bandingkan nilai di val_err, bukan train_err.",
        "Fungsi min() dengan key bisa membantu.",
        "best = min(val_err, key=val_err.get)",
      ],
      code: {
        starter: `train_err = {"A": 2, "B": 5, "C": 8}\nval_err = {"A": 15, "B": 7, "C": 9}\n\n# TULIS KODEMU: model dengan validation error terkecil\nbest = \n\nprint(f"best={best}")`,
        lockLines: 2,
        solution: `train_err = {"A": 2, "B": 5, "C": 8}\nval_err = {"A": 15, "B": 7, "C": 9}\n\n# TULIS KODEMU: model dengan validation error terkecil\nbest = min(val_err, key=val_err.get)\n\nprint(f"best={best}")`,
        checks: [
          { kind: "defined", task: "t1", name: "best", label: "`best` terdefinisi", msg: "Buat variabel bernama best di kode editable." },
          { kind: "equal", task: "t1", name: "best", value: "B", label: "`best` seharusnya B", msg: "Validation terkecil = B (7%). Bukan A — A overfit." },
          { kind: "stdout_matches", task: "t2", pattern: "best=B", label: "`print` menampilkan best", msg: "Format: best=... ." },
        ],
      },
      reference: "Pilih validation error terkecil. Gap train\u2013test besar = overfit.",
    },
    {
      id: "regularisasi",
      eyebrow: "Langkah 3 · Regularisasi",
      title: "Ridge, Lasso, dan rasio fitur",
      prose: [
        "Bias = error karena model terlalu sederhana (underfit). Variance = error karena terlalu sensitif ke training (overfit). Kompleksitas naik \u2192 bias turun tetapi variance naik.",
        "Regularisasi: Ridge (L2) = hukum koefisien besar (menciutkan); Lasso (L1) = hukum hingga nol (seleksi variabel otomatis). Butuh semua variabel tetapi stabil \u2192 ridge; butuh model ramping \u2192 lasso. Keduanya dipilih via cross-validation — bukan feeling.",
        "Aturan praktis: maksimal 1 fitur per 10 observasi. 200 fitur, 500 observasi \u2192 rasio 2,5 = overfit yang dijamin secara matematis (kasus startup AI \u221240%).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Concept drift: model 2019 (pre-COVID) hancur di 2020 — distribusi data berubah. Model finansial = makhluk hidup yang butuh makan (data baru) rutin: monitoring live vs validasi, retrain berkala.",
      },
      quiz: [
        {
          q: "Train R\u00b2 0,92, test 0,15. Diagnosis?",
          options: [
            { text: "Model bagus", why: "Salah: gap train\u2013test sebesar ini = masalah serius." },
            { text: "Overfitting — sederhanakan/regularisasi", why: "Benar: gap train\u2013test = menghafal noise. Solusi: Ridge/Lasso, kurangi kompleksitas, atau tambah data.", correct: true },
            { text: "Data salah", why: "Salah: pola ini khas overfitting, bukan data rusak." },
            { text: "Tambah fitur", why: "Salah: menambah fitur memperparah overfitting." },
          ],
        },
        {
          q: "Lasso vs Ridge. Kelebihan Lasso?",
          options: [
            { text: "Tidak ada", why: "Salah: Lasso punya keunggulan seleksi yang Ridge tidak punya." },
            { text: "L1 membuat koefisien = 0 (seleksi variabel otomatis)", why: "Benar: Lasso = seleksi + estimasi sekaligus. Ridge hanya menciutkan. Untuk 50 fitur \u2192 Lasso menemukan yang penting.", correct: true },
            { text: "Lebih cepat", why: "Salah: kecepatan bukan pembedanya." },
            { text: "Tidak butuh \u03bb", why: "Salah: keduanya butuh tuning \u03bb via validasi." },
          ],
        },
      ],
      reference: "Ridge = ciutkan; Lasso = seleksi (L1 \u2192 nol). Rasio fitur \u2264 1:10.",
    },
    {
      id: "clustering",
      eyebrow: "Langkah 4 · Clustering",
      title: "Temukan rezim pasar tanpa label",
      prose: [
        "Clustering (k-means): kelompokkan observasi mirip — regime detection (pasar risk-on/off), segmentasi saham. PCA: kompres banyak variabel jadi sedikit komponen utama — 100 rasio \u2192 5 faktor.",
        "Contoh: k-means (k=2) pada (return, volatilitas) harian 10 tahun \u2192 Cluster A: return +, vol rendah (risk-on, 75% hari); Cluster B: return \u2212, vol tinggi (risk-off, 25%). Strategi: alokasi agresif di A, defensif di B. Batas: cluster = korelasi historis, bukan sebab — dan korelasi berubah saat krisis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dA`, `dB`: jarak Euclidean titik p ke centroid A dan B" },
        { id: "t2", text: "Tentukan `cluster` terdekat (\u201cA\u201d/\u201cB\u201d), cetak ketiganya" },
      ],
      expected: "dA=0.10  dB=1.64  cluster=A",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai cluster untuk diversifikasi tetapi memilih 10 saham dari 1 cluster yang sama. Pilih satu dari tiap cluster — bukan 10 saham satu cluster.",
      },
      hints: [
        "Jarak Euclidean = sqrt((x1\u2212x2)\u00b2 + (y1\u2212y2)\u00b2).",
        "Cluster = yang jaraknya lebih kecil.",
        "dA = math.dist(cA, p)  # atau hitung manual\ndB = math.dist(cB, p)\ncluster = \"A\" if dA < dB else \"B\"",
      ],
      code: {
        starter: `import math\ncA = (0.05, 0.8)    # risk-on: return +, vol rendah\ncB = (-0.30, 2.5)  # risk-off: return -, vol tinggi\np = (0.06, 0.9)\n\n# TULIS KODEMU\ndA = \ndB = \ncluster = \n\nprint(f"dA={dA:.2f}  dB={dB:.2f}  cluster={cluster}")`,
        lockLines: 4,
        solution: `import math\ncA = (0.05, 0.8)    # risk-on: return +, vol rendah\ncB = (-0.30, 2.5)  # risk-off: return -, vol tinggi\np = (0.06, 0.9)\n\n# TULIS KODEMU\ndA = math.dist(cA, p)\ndB = math.dist(cB, p)\ncluster = "A" if dA < dB else "B"\n\nprint(f"dA={dA:.2f}  dB={dB:.2f}  cluster={cluster}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dA", value: 0.1005, tol: 0.01, label: "`dA` sekitar 0.10", msg: "Titik p sangat dekat centroid A (risk-on)." },
          { kind: "equal", task: "t2", name: "cluster", value: "A", label: "`cluster` seharusnya A", msg: "dA (0,10) < dB (1,64) \u2192 risk-on." },
          { kind: "stdout_matches", task: "t2", pattern: "dA=0\\.10\\s+dB=1\\.64\\s+cluster=A", label: "`print` menampilkan ketiganya", msg: "Format: dA=...  dB=...  cluster=... ." },
        ],
      },
      reference: "K-means = regime detection. Rezim risk-off \u2192 defensif.",
    },
    {
      id: "leakage",
      eyebrow: "Langkah 5 · Data Leakage",
      title: "Kebocoran yang membunuh live trading",
      prose: [
        "Model memakai \u201creturn hari ini\u201d sebagai fitur untuk prediksi \u201creturn hari ini\u201d. Masalah? Data leakage total: fitur = target = \u201cakurasi 100%\u201d yang tidak bermakna. Fitur harus tersedia sebelum periode prediksi.",
        "Bentuk lain: normalisasi memakai seluruh data (termasuk test), atau memakai laba Q4 untuk prediksi return Q4 (laporan keluar Q1 tahun depan). Backtest indah + live hancur = tanda klasik leakage.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cAkurat 80% tetapi live rugi\u201d — akurasi \u2260 profit. Sinyal kecil habis di biaya transaksi; 80% win kecil vs 20% loss besar = rugi. Ukur net of cost.",
      },
      quiz: [
        {
          q: "Model \u2018akurat 80%\u2019 tetapi live rugi. Penjelasan paling mungkin?",
          options: [
            { text: "Akurasi salah hitung", why: "Salah: akurasinya bisa benar — masalahnya di tempat lain." },
            { text: "Biaya transaksi + win/loss asymmetry memakan edge", why: "Benar: akurasi \u2260 profit. Sinyal kecil habis di biaya; 80% win kecil vs 20% loss besar = rugi. Ukur net of cost.", correct: true },
            { text: "Pasar jahat", why: "Salah: bukan soal niat pasar." },
            { text: "Komputer lambat", why: "Salah: latensi bukan penjelasan utama di sini." },
          ],
        },
      ],
      reference: "Fitur harus tersedia sebelum periode prediksi. Ukur net of cost.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: ML untuk investasi tanpa bunuh diri",
      prose: [
        "Skenario 1 — Startup klaim 'akurasi 99%'. → Tanya dulu: akurasi training atau validation? 99% training = Model A = overfit = bom waktu.",
        "Skenario 2 — Validasi model time series. → Walk-forward (train masa lalu → test 'masa depan'). Cross-validation acak = look-ahead bias = dilarang.",
        "Skenario 3 — Memilih di antara beberapa model. → Pilih validation error terkecil, bukan training. Dan cek rasio observasi-fitur: di bawah 10:1, model tidak mungkin generalisasi.",
        "Skenario 4 — Backtest indah (Sharpe 1,8 dari 500 kombinasi parameter). → Curigai multiple testing: di bawah hipotesis nol, Sharpe maksimum 500 percobaan acak ≈ 2,0. Bandingkan dengan ekspektasi noise (deflated Sharpe).",
        "Skenario 5 — Live trading hancur padahal backtest indah. → Audit leakage: fitur dari masa depan, normalisasi memakai seluruh data termasuk test, label dari harga masa depan. Setiap transformasi di-fit hanya pada train.",
        "Aturan praktis 10 detik: klaim akurasi → tanya train vs validation; time series → walk-forward; pilih model → validation error; backtest indah → deflated Sharpe; live hancur → cari leakage.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menormalisasi fitur memakai statistik seluruh dataset termasuk test set. Kebocoran halus ini membuat backtest terlihat bagus dan live berdarah — dan ia tidak tertangkap oleh metrik apa pun, hanya oleh audit proses.",
      },
    },
    {
      id: "minicase-ai",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Autopsi AI 99%: tiga pertanyaan due diligence",
      prose: [
        "Startup AI klaim \u201c99% akurat\u201d (training), validasi pakai CV acak. Live trading: \u221240% setahun. Investigasi: 200 fitur, 500 observasi, tanpa biaya transaksi di backtest, tidak ada paper trade.",
        "Dua dosa validasi: (1) tidak ada test set jujur (99% = training = overfit); (2) CV acak di time series = look-ahead bias. Rasio observasi-fitur = 2,5 — jauh di bawah minimal 10. Model ini tidak mungkin generalisasi.",
        "Tiga pertanyaan due diligence sebelum tanam modal: (1) \u201cTunjukkan walk-forward net of cost — bukan training accuracy\u201d; (2) \u201cBerapa live/paper track record?\u201d (nol = belum terbukti); (3) \u201cApa yang terjadi saat regime berubah?\u201d Tidak bisa jawab ketiganya = jangan invest.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Interpretability: regulator & klien menuntut \u201ckenapa model memutuskan ini?\u201d Di keuangan, model yang tidak bisa dijelaskan = model yang tidak bisa dipercaya.",
      },
      reference: "99% training = overfit sampai terbukti sebaliknya. Tanya walk-forward net of cost.",
    },
    {
      id: "overfit-backtest-jujur",
      eyebrow: "Langkah 8 · Overfit & validasi jujur",
      title: "Backtest indah, live berdarah",
      prose: [
        "Overfitting dalam backtest: 500 kombinasi parameter diuji, yang terbaik Sharpe 1,8 in-sample → walk-forward 0,3. Yang overfit bukan satu model — melainkan proses seleksinya (multiple testing). Di bawah hipotesis nol (tidak ada sinyal), Sharpe maksimum dari 500 percobaan acak ≈ 2,0 — jadi “terbaik 1,8” bahkan di bawah ekspektasi noise murni. Aturan: deflated Sharpe — bandingkan dengan ekspektasi maksimum di bawah nol; atau simpan 30% data sebagai holdout suci yang tidak pernah disentuh sampai keputusan final.",
        "Feature leakage — recap: leakage = fitur mengandung informasi dari masa depan relatif terhadap momen prediksi. Tiga wajahnya: memakai return hari ini untuk memprediksi hari ini; normalisasi memakai statistik seluruh data termasuk test; label yang dihitung dari harga masa depan. Setiap transformasi di-fit hanya pada train, dan setiap fitur harus sudah tersedia sebelum periode prediksi — tanpa pengecualian.",
        "Validasi yang jujur untuk deret waktu: walk-forward + embargo — beri gap antara train dan test selebar horizon label (label 5-hari → embargo 5 hari) agar tidak ada tumpang tindih informasi; untuk dataset kecil pakai purged k-fold. Contoh nyata: tanpa embargo Sharpe 1,2, dengan embargo 0,4 — selisih 0,8 itu bukan skill, melainkan kebocoran yang baru ketahuan.",
        "Batas ML vs model ekonomi: ML menemukan korelasi tanpa mekanisme — hebat untuk prediksi jangka pendek di rezim stabil, rapuh saat rezim berubah (model 2019 hancur di 2020). Model ekonomi memberi “kenapa” — lebih lambat tetapi survive. Keputusan praktisi: ML untuk sinyal + overlay judgment ekonomi; bila keduanya bertentangan, kecilkan ukuran posisi — jangan pilih salah satu secara buta.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `acc_bocor` (fitur mengandung info hari ini) dan `acc_jujur` (hanya info kemarin)" },
        { id: "t2", text: "Cetak keduanya sebagai persen 1 desimal" },
      ],
      expected: "acc_bocor=96.2%  acc_jujur=54.6%",
      note: {
        title: "Intuisi: anggap setiap backtest indah sebagai tersangka",
        body: "Heuristik due diligence yang dipakai fund-of-funds sebelum percaya angka backtest. Pertama: akurasi > 80% di finance hampir selalu bug, bukan alpha — pasar terlalu efisien untuk memberi makan siang semudah itu; reaksi pertama adalah “di mana bocornya?”, bukan “berapa alokasinya?”. Kedua: walk-forward net of cost adalah satu-satunya angka yang boleh masuk slide presentasi — training accuracy, in-sample Sharpe, dan CV acak adalah dekorasi. Ketiga: simpan holdout suci — sekali disentuh untuk tuning, ia bukan holdout lagi melainkan validasi kedua; tidak ada “cuma lihat sebentar”. Keempat: uji tanggal ketersediaan setiap fitur — “data ini ada di tangan analis pada tanggal prediksi, atau baru terbit tiga bulan kemudian?” Satu fitur yang jawabannya “kemudian” = seluruh backtest batal. Empat kebiasaan ini tidak membuatmu menemukan lebih banyak alpha — tetapi mencegahmu kehilangan uang untuk alpha yang tidak pernah ada. Kelima: ukur biaya transaksi dari data riil — slippage dan market impact di small-cap Indonesia bisa 5–10x komisi broker; backtest yang memakai komisi flat 0,1% sedang berbohong tentang setengah biaya.",
      },
      hints: [
        "Akurasi = % prediksi tanda yang benar via hit_rate().",
        "fitur_bocor mengandung return hari INI; fitur_jujur hanya kemarin.",
        "acc_bocor = hit_rate(fitur_bocor)",
      ],
      code: {
        starter: `import random
random.seed(7)
n = 500
rets = [random.gauss(0, 1) for _ in range(n)]   # return TAK terprediksi
noise = [random.gauss(0, 1) for _ in range(n)]
fitur_bocor = [r + 0.1*e for r, e in zip(rets, noise)]  # mengandung info hari INI
fitur_jujur = [0.0] + rets[:-1]                          # hanya info kemarin
def hit_rate(feat):
    return sum(1 for f, r in zip(feat, rets) if (f > 0) == (r > 0)) / n * 100

# TULIS KODEMU
acc_bocor = 
acc_jujur = 

print(f"acc_bocor={acc_bocor:.1f}%  acc_jujur={acc_jujur:.1f}%")`,
        lockLines: 11,
        solution: `import random
random.seed(7)
n = 500
rets = [random.gauss(0, 1) for _ in range(n)]   # return TAK terprediksi
noise = [random.gauss(0, 1) for _ in range(n)]
fitur_bocor = [r + 0.1*e for r, e in zip(rets, noise)]  # mengandung info hari INI
fitur_jujur = [0.0] + rets[:-1]                          # hanya info kemarin
def hit_rate(feat):
    return sum(1 for f, r in zip(feat, rets) if (f > 0) == (r > 0)) / n * 100

# TULIS KODEMU
acc_bocor = hit_rate(fitur_bocor)
acc_jujur = hit_rate(fitur_jujur)

print(f"acc_bocor={acc_bocor:.1f}%  acc_jujur={acc_jujur:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "acc_bocor", value: 96.2, tol: 0.5, label: "`acc_bocor` sekitar 96.2", msg: "96,2% 'akurasi' dari fitur bocor — angka indah yang 100% tidak bisa dipakai live." },
          { kind: "equal", task: "t1", name: "acc_jujur", value: 54.6, tol: 1.0, label: "`acc_jujur` sekitar 54.6", msg: "54,6% ≈ 50% — kebenaran: return ini memang tak terprediksi. Itulah yang jujur." },
          { kind: "stdout_matches", task: "t2", pattern: "acc_bocor=96\.2%\s+acc_jujur=54\.6%", label: "`print` menampilkan keduanya", msg: "Format persen: acc_bocor=...%  acc_jujur=...% ." },
        ],
      },
      reference: "Backtest indah + live hancur = leakage atau overfit seleksi. Walk-forward + embargo.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Dua pertanyaan campuran: regime detection dan diagnosis overfit.",
      ],
      tasks: [],
      quiz: [
        {
          q: "K-means pada (return, vol) menemukan cluster vol-tinggi/return-negatif. Gunakan untuk?",
          options: [
            { text: "Diabaikan", why: "Salah: cluster itu justru informasi rezim yang berharga." },
            { text: "Regime detection — defensif saat risk-off", why: "Benar: unsupervised menemukan struktur. Rezim risk-off = kurangi eksposur (strategi regime-switching).", correct: true },
            { text: "Beli saat risk-off", why: "Salah: cluster risk-off = sinyal defensif, bukan beli." },
            { text: "Tidak ada gunanya", why: "Salah: regime detection mengalahkan buy-and-hold statis di backtest." },
          ],
        },
        {
          q: "Model: training error 2%, validation error 15%. Diagnosis & tindakan?",
          options: [
            { text: "Underfit — tambah kompleksitas", why: "Salah: kebalikannya — ini overfit, bukan underfit." },
            { text: "Overfit — sederhanakan/regularisasi, validasi walk-forward", why: "Benar: gap 2%\u219215% = overfit klasik (menghafal). Tindakan: sederhanakan, regularisasi, fitur < obs/10.", correct: true },
            { text: "Data kurang — kumpulkan 10x lipat", why: "Salah: data lebih banyak membantu, tetapi tindakan pertamanya adalah sederhanakan/regularisasi." },
            { text: "Normal — lanjutkan ke live trading", why: "Salah: live trading dengan model overfit = mengulangi kasus startup \u221240%." },
          ],
        },
      ],
      summary: [
        "Time series \u2192 walk-forward validation. CV acak = look-ahead bias.",
        "Pilih model dari validation error terkecil, bukan training.",
        "Ridge menciutkan; Lasso menyeleksi (L1 \u2192 nol). Rasio fitur \u2264 1:10.",
        "Clustering = regime detection; PCA = reduksi fitur.",
        "Waspadai data leakage dan concept drift. Ukur net of cost.",
      ],
      next: { label: "PM-B4 — Valuasi Ekuitas: DDM, FCFF & Multiples", href: "/v2/learn/pm-b4-valuasi-ekuitas" },
    },
  ],
};

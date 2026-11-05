import type { V2Lesson } from "../lib/types";

// CV accuracy: majority 0.47 vs kNN 0.83 — baseline dulu, baru model.
const FIG_CV = `<svg viewBox="0 0 480 250" role="img" aria-label="Akurasi CV: baseline 0,47 vs kNN 0,83.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="205" x2="460" y2="205"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="105" x2="460" y2="105"/><line x1="44" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="209">0</text><text x="38" y="159">0,25</text><text x="38" y="109">0,5</text><text x="38" y="59">1,0</text></g>
<rect x="120" y="109" width="100" height="96" fill="var(--c4)"/>
<rect x="300" y="39" width="100" height="166" fill="var(--c1)"/>
<g fill="var(--text)" font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="700"><text x="170" y="100">0,47</text><text x="350" y="30">0,83</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="227">baseline majority</text><text x="350" y="227">kNN (k=5)</text></g>
<line x1="44" y1="105" x2="460" y2="105" stroke="var(--c4)" stroke-width="1" stroke-dasharray="5,4"/>
<text x="452" y="98" font-size="10" fill="var(--chart-text)" text-anchor="end" font-family="var(--font-ui)">acak = 0,5</text>
<text x="240" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">5-fold CV · 120 sampel · baseline di bawah acak!</text>
</svg>`;

// Backtest rolling-origin: seasonal-naive selalu ketinggalan tren naik.
const FIG_BACKTEST = `<svg viewBox="0 0 480 262" role="img" aria-label="Deret penjualan mingguan 24 titik: train 20 minggu, backtest 4 minggu; prediksi seasonal-naive selalu di bawah aktual karena tren naik.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="220" x2="460" y2="220"/><line x1="44" y1="168" x2="460" y2="168"/><line x1="44" y1="116" x2="460" y2="116"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="224">100</text><text x="38" y="172">120</text><text x="38" y="120">140</text></g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<line x1="44" y1="30" x2="70" y2="30" stroke="var(--c1)" stroke-width="2"/><text x="74" y="34">train (20 minggu)</text>
<circle cx="216" cy="30" r="4.5" fill="var(--c4)" stroke="var(--c1)" stroke-width="1.5"/><text x="226" y="34">aktual (backtest)</text>
<circle cx="352" cy="30" r="5.5" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="3,3"/><text x="362" y="34">prediksi seasonal-naive</text>
</g>
<path d="M40 194.0 L57 233.5 L74 194.0 L91 222.1 L108 176.6 L125 223.1 L142 188.0 L159 216.1 L176 166.2 L193 205.7 L210 164.6 L227 190.1 L244 142.8 L261 188.5 L278 154.2 L295 184.4 L312 136.8 L329 177.6 L346 136.5 L363 160.7 L380 110.8 L397 154.5 L414 119.6 L431 150.6" fill="none" stroke="var(--c1)" stroke-width="2"/>
<line x1="371.5" y1="96" x2="371.5" y2="232" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="5,4"/>
<text x="371.5" y="90" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">backtest</text>
<g stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,3"><line x1="380" y1="110.8" x2="380" y2="136.8"/><line x1="397" y1="154.5" x2="397" y2="177.6"/><line x1="414" y1="119.6" x2="414" y2="136.5"/><line x1="431" y1="150.6" x2="431" y2="160.7"/></g>
<g fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="3,3"><circle cx="380" cy="136.8" r="5.5"/><circle cx="397" cy="177.6" r="5.5"/><circle cx="414" cy="136.5" r="5.5"/><circle cx="431" cy="160.7" r="5.5"/></g>
<g fill="var(--c4)" stroke="var(--c1)" stroke-width="1.5"><circle cx="380" cy="110.8" r="4.5"/><circle cx="397" cy="154.5" r="4.5"/><circle cx="414" cy="119.6" r="4.5"/><circle cx="431" cy="150.6" r="4.5"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="40" y="250">mgg 0</text><text x="363" y="250">mgg 19</text><text x="431" y="250">mgg 23</text></g>
<text x="240" y="258" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">Penjualan mingguan · tren + musiman periode 4</text>
</svg>`;

export const mle15: V2Lesson = {
  slug: "mle15-ml-klasik",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE15 — Algoritma ML Klasik & Model Selection",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-pilih",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model Rp180 juta yang kalah dari 20 baris",
      prose: [
        "Startup pinjol menyewa konsultan deep learning: 3 bulan, Rp180 juta, neural network untuk skor kredit dari 40 fitur tabel. Akurasi: 81%. Seorang analis iseng menjalankan XGBoost 20 baris di laptop: 84% — dalam 2 jam. Konsultan berdalih 'data kurang'; analis menambahkan: 'coba logistic regression dulu?' — 82% dalam 5 menit.",
        "Twist-nya: untuk DATA TABEL, urutan kekuatan sering terbalik dari gengsi — gradient boosting > random forest > logistic regression > deep learning. DL unggul di citra/teks/audio, BUKAN tabel. Rp180 juta membayar pelajaran: pilih algoritma dari JENIS DATA, bukan dari hype. Lesson ini = peta lengkap algoritma klasik + cara memilih yang benar (diminta eksplisit di JD: scikit-learn, XGBoost/LightGBM).",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memetakan 6 keluarga algoritma ke jenis masalah; (2) menjelaskan bias-variance trade-off dengan contoh; (3) menjalankan k-fold CV dan membaca hasilnya; (4) memilih model via perbandingan yang adil (baseline dulu!); (5) melakukan feature selection sederhana.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Enam keluarga algoritma — Langkah 3 · Lab: CV & model selection — Langkah 4 · Bias-variance & feature selection — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Untuk tabel: boosting > forest > linear > deep learning. Pilih dari data, bukan gengsi.",
    },
    {
      id: "konsep-keluarga",
      eyebrow: "Langkah 2 · Enam keluarga",
      title: "Enam keluarga, enam kepribadian",
      prose: [
        "Keluarga 1 — Linear (regresi logistik/linear): 'si jujur'. Asumsi hubungan garis lurus; koefisien bisa dibaca langsung ('tiap Rp1 juta gaji → +0,3 skor'). Kelebihan: cepat, interpretable, butuh sedikit data. Kelemahan: buta pola non-linear. Pakai untuk: baseline pertama, kasus regulasi (harus bisa dijelaskan), data sedikit.",
        "Keluarga 2 — Tree (decision tree): 'si tukang potong'. Membelah data dengan aturan if-else ('gaji > 5jt & telat < 2 → approve'). Kelebihan: menangani non-linear + interaksi otomatis, tidak perlu scaling. Kelemahan: overfit parah jika dibiarkan (hafal data). Pakai untuk: eksplorasi cepat, data campur numerik-kategorikal.",
        "Keluarga 3 — Ensemble (random forest, XGBoost/LightGBM): 'si dewan juri'. Ratusan tree voting — varian tinggi tree tunggal dirata-rata. XGBoost = juara bertahan data tabel (menang ~70% kompetisi Kaggle tabel). Kelebihan: akurasi top untuk tabel, robust. Kelemahan: tuning, kurang interpretable. Pakai untuk: hampir semua data tabel serius.",
        "Keluarga 4 — KNN/SVM: 'si tetangga' dan 'si pembatas'. KNN: prediksi = mayoritas tetangga terdekat — sederhana, tetapi lambat saat prediksi (hitung jarak ke semua!). SVM: cari garis pembatas maksimal — kuat untuk dimensi tinggi, lemah untuk data besar. Pakai untuk: dataset kecil-menengah, baseline non-linear cepat (KNN).",
        "Keluarga 5 — Clustering (k-means, DBSCAN): 'si pengelompok' — unsupervised, tanpa label. K-means: bagi jadi k kelompok; DBSCAN: temukan kelompok bentuk bebas + outlier. Pakai untuk: segmentasi pelanggan, deteksi anomali, eksplorasi sebelum label ada.",
        "Keluarga 6 — Naive Bayes: 'si probabilis naif'. Asumsi fitur independen (sering salah, tetapi bekerja!). Sangat cepat, bagus untuk teks (spam filter klasik). Pakai untuk: baseline teks super-cepat, data sangat sedikit.",
        "Kepribadian keseluruhan: linear = penggaris, tree = gunting, ensemble = musyawarah, KNN = gotong royong, clustering = panitia pembagian kelompok. Pilih alat sesuai bahan — tukang kayu tidak memaku dengan gergaji.",
        "SVM — si pembatas maksimal. Mencari hyperplane dengan MARGIN terbesar; kernel trick memetakan ke dimensi tinggi tanpa menghitungnya (RBF: lingkaran menjadi garis di dimensi tak hingga!). Kuat untuk dimensi tinggi + sampel sedang; lemah untuk 1 juta baris (training O(n²)-O(n³)). Klasik teks sebelum transformer.",
      ],
      formula: String.raw`\text{CV}_k = \frac{1}{k}\sum_{i=1}^{k} \text{skor}_i \qquad \text{pilih } \arg\max_m \text{CV}_k(m)`,
      formulaNote: "CV_k = skor cross-validation k-fold (rata-rata skor di k lipatan); m = kandidat model; pilih model dengan CV tertinggi. Contoh lab: CV(majority)=0,47 vs CV(kNN)=0,83 → pilih kNN. Jangan pilih dari skor training!",
      figure: {
        svg: FIG_CV,
        alt: "Akurasi CV: baseline 0,47 vs kNN 0,83.",
        caption: "5-fold CV: baseline vs kNN.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Model kompleks selalu lebih baik.' Salah — untuk 40 fitur tabel 10.000 baris, XGBoost mengalahkan neural network 9 dari 10 kali (dan 50x lebih cepat training). Kompleksitas tanpa kebutuhan = overfitting + biaya. Mulai dari yang sederhana; naik HANYA jika CV membuktikan.",
      },
      reference: "Linear jujur, tree memotong, ensemble bermusyawarah. Tabel = boosting.",
    },
    {
      id: "lab-cv",
      eyebrow: "Langkah 3 · Lab CV",
      title: "Lab: baseline dulu, baru model",
      prose: [
        "120 sampel, 4 fitur, target biner. Bandingkan dua kandidat dengan 5-fold CV: (1) baseline majority (selalu tebak kelas terbanyak) — 'lawan' yang harus dikalahkan; (2) kNN k=5 (numpy murni). Implementasikan kedua akurasi + loop CV, tentukan pemenang.",
        "Perhatikan: baseline HANYA 0,47 — di bawah tebak acak 0,5! (Ketidakseimbangan fold kecil.) Model yang 'kalah dari acak' = tidak belajar apa-apa. Coba ubah: k=1 (overfit? CV turun?) dan k=51 (underfit?). k adalah kenop bias-variance KNN.",
        "Cara membaca: cv_majority vs cv_knn = 'apakah modelku lebih baik dari tidak belajar?'. Interpretasi: 0,83 vs 0,47 = model belajar pola nyata, bukan hafalan (CV menguji di data tak terlihat).",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `acc_majority` dan `acc_knn` (jarak Euclidean, voting k tetangga)" },
        { id: "t2", text: "Loop 5-fold CV, hitung rata-rata, tentukan `pemenang`, `print` hasilnya" },
      ],
      expected: "cv_majority=0.4667  cv_knn=0.825  pemenang=knn",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Baseline majority = 'lawan sparring' wajib. Setiap model yang tidak mengalahkan baseline dengan JELAS (bukan 1-2 poin) = belum membuktikan apa-apa. Kebiasaan ini mencegah 90% 'model bagus' yang ternyata ilusi.",
      },
      hints: [
        "majority: np.bincount(ytr).argmax() -> tebak itu untuk semua yte",
        "kNN: d = ((Xte[:,None,:]-Xtr[None,:,:])**2).sum(-1); nn = argpartition(d,k,axis=1)[:,:k]",
        "pred per baris = bincount(ytr[baris]).argmax(); rata-ratakan 5 fold",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(42)
X = rng.normal(size=(120, 4))
y = (X[:, 0] + 0.5*X[:, 1] - 0.3*X[:, 2] + rng.normal(scale=0.5, size=120) > 0).astype(int)
def kfold_idx(n, k, seed=0):
    idx = np.random.default_rng(seed).permutation(n)
    return np.array_split(idx, k)

# TULIS KODEMU
def acc_majority(ytr, yte):
    # TODO t1: tebak kelas mayoritas ytr untuk semua yte
    return 0.0

def acc_knn(Xtr, ytr, Xte, yte, k=5):
    # TODO t1: jarak Euclidean, k tetangga, voting mayoritas
    return 0.0

# UJI (jangan ubah)
folds = kfold_idx(len(X), 5)
s_maj, s_knn = [], []
for te in folds:
    tr = np.concatenate([f for f in folds if f is not te])
    s_maj.append(acc_majority(y[tr], y[te]))
    s_knn.append(acc_knn(X[tr], y[tr], X[te], y[te]))
print("cv_majority =", round(float(np.mean(s_maj)), 4))
print("cv_knn =", round(float(np.mean(s_knn)), 4))
print("pemenang =", "knn" if np.mean(s_knn) > np.mean(s_maj) else "majority")`,
        lockLines: 9,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(42)
X = rng.normal(size=(120, 4))
y = (X[:, 0] + 0.5*X[:, 1] - 0.3*X[:, 2] + rng.normal(scale=0.5, size=120) > 0).astype(int)
def kfold_idx(n, k, seed=0):
    idx = np.random.default_rng(seed).permutation(n)
    return np.array_split(idx, k)

# TULIS KODEMU
def acc_majority(ytr, yte):
    maj = int(np.bincount(ytr).argmax())
    return float((np.full(len(yte), maj) == yte).mean())

def acc_knn(Xtr, ytr, Xte, yte, k=5):
    d = ((Xte[:, None, :] - Xtr[None, :, :])**2).sum(-1)
    nn = np.argpartition(d, k, axis=1)[:, :k]
    pred = np.array([np.bincount(ytr[r]).argmax() for r in nn])
    return float((pred == yte).mean())

# UJI (jangan ubah)
folds = kfold_idx(len(X), 5)
s_maj, s_knn = [], []
for te in folds:
    tr = np.concatenate([f for f in folds if f is not te])
    s_maj.append(acc_majority(y[tr], y[te]))
    s_knn.append(acc_knn(X[tr], y[tr], X[te], y[te]))
print("cv_majority =", round(float(np.mean(s_maj)), 4))
print("cv_knn =", round(float(np.mean(s_knn)), 4))
print("pemenang =", "knn" if np.mean(s_knn) > np.mean(s_maj) else "majority")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "cv_majority\\s*=\\s*0\\.4667", label: "CV majority = 0.4667", msg: "Baseline di bawah acak — wajar untuk fold kecil." },
          { kind: "stdout_matches", task: "t2", pattern: "cv_knn\\s*=\\s*0\\.825", label: "CV kNN = 0.825", msg: "Jauh di atas baseline = belajar pola nyata." },
          { kind: "stdout_matches", task: "t2", pattern: "pemenang\\s*=\\s*knn", label: "Pemenang = knn", msg: "0.825 > 0.4667, jelas." },
        ],
      },
      reference: "Baseline dulu, CV selalu, pilih dari CV bukan training.",
    },
    {
      id: "konsep-bias-variance",
      eyebrow: "Langkah 4 · Bias-variance & fitur",
      title: "Bias-variance: dua cara model gagal",
      prose: [
        "Bias tinggi (underfit): model terlalu sederhana — garis lurus untuk data melengkung. Gejala: training DAN validasi jelek. Obat: model lebih kompleks / fitur lebih baik. Variance tinggi (overfit): model terlalu kompleks — menghafal noise. Gejala: training bagus, validasi jelek. Obat: regularisasi, lebih banyak data, model sederhana.",
        "Contoh angka: tree depth=2 → train 0,70/val 0,68 (bias, keduanya rendah). depth=20 → train 0,99/val 0,72 (variance, jurang 27 poin!). depth=6 → train 0,85/val 0,83 (seimbang). Jurang train-val = meteran overfit — baca SELALU.",
        "Feature selection: 40 fitur → 12 yang penting. Tiga pendekatan: (1) filter — korelasi/chi-square, cepat, tanpa model; (2) wrapper — coba subset dengan CV, akurat, mahal; (3) embedded — L1 regularization menciutkan koefisien tak penting ke nol otomatis. Aturan: mulai filter (buang yang jelas sampah), lanjut embedded (L1), wrapper hanya bila perlu.",
        "Kepribadian bias-variance: seperti memanah — bias = selalu meleset ke arah yang sama (perbaiki bidikan/model); variance = menyebar ke mana-mana (tenangkan tangan/regularisasi). Pemanah baik = bidikan benar + tangan tenang.",
        "Learning curve — diagnosis visual. Plot skor vs ukuran training: train turun + val naik → konvergen = butuh LEBIH BANYAK DATA (gap akan menutup). Keduanya datar rendah = bias (tambah kompleksitas). Keduanya datar tinggi = cukup — berhenti! Satu plot menggantikan 10 tebakan.",
        "Regularisasi L1 vs L2 — dua filosofi. L1 (Lasso): menciutkan koefisien TEPAT ke nol = seleksi fitur otomatis. L2 (Ridge): mengecilkan semua proporsional = stabil. Butuh sedikit fitur? L1. Fitur berkorelasi? L2 (L1 memilih salah satu acak!). Elastic net = keduanya. Pilih dari TUJUAN, bukan kebiasaan.",
        "Cross-validation berstrata — untuk klasifikasi tak seimbang. Fold acak bisa menghasilkan lipatan tanpa kelas minoritas (0%!) → skor ngaco. Stratified: tiap fold menjaga proporsi kelas. Untuk 95:5 imbalance: WAJIB stratified. Satu parameter (stratify=y) = perbedaan valid vs sampah.",
        "Pipeline — anti bocor. Scaling dihitung dari SEMUA data lalu CV = bocor (test mengintip!). Pipeline: dalam tiap fold, fit scaler HANYA di train. sklearn Pipeline melakukan ini otomatis. 30% 'hasil bagus' di tutorial = bocor pipeline. Aturan: semua preprocessing DI DALAM CV, bukan di luar.",
      ],
      formula: String.raw`\text{Error} = \text{Bias}^2 + \text{Variance} + \text{Noise}`,
      formulaNote: "Error = kesalahan total; Bias² = kesalahan karena asumsi model terlalu sederhana; Variance = kesalahan karena sensitif terhadap data training; Noise = kesalahan tak terhindarkan (data itu sendiri berisik). Target: minimalkan jumlah ketiganya — bukan salah satu.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Jurang train-val adalah SATU-SATUNYA angka yang membedakan 'model bagus' dari 'model hafal'. Tidak ada jurang + skor tinggi = aman. Jurang besar = jangan deploy, apapun skor trainingnya. Jadikan ini refleks pertama saat melihat hasil.",
      },
      reference: "Bias = keduanya jelek; variance = jurang besar. Obati sesuai diagnosis.",
    },
    {
      id: "audit-leakage-pipeline",
      eyebrow: "Langkah 5 · Audit leakage",
      title: "Pipeline anti-leakage: disiplin yang memisahkan senior dari junior",
      prose: [
        "Junior dan senior bisa memakai algoritma yang sama persis dan mendapat nasib berbeda — pembedanya bukan modelnya, melainkan DISIPLIN pipeline. Leakage (kebocoran) adalah cara paling umum skor CV terlihat hebat lalu model produksi gagal total. Lima saluran bocor di bawah ini wajib kamu hafal seperti hafal nama jalan pulang.",
        "Saluran 1 — preprocessing fit di seluruh data. Scaler di-fit SEBELUM split: mean/std test set 'bocor' ke training. Terlihat sepele, tetapi sistematis — dan untuk imputer atau encoder kategorikal bocornya bisa besar. Aturan keras: SPLIT DULU, fit HANYA di train, transform test. `Pipeline` sklearn bukan alat kenyamanan — ia adalah MESIN ANTI-BOCOR: `fit()` hanya menyentuh train secara konstruksi.",
        "Saluran 2 — fitur turunan target. Contoh: 'rata-rata default per cabang' dihitung dari SELURUH data (termasuk test) lalu dipakai sebagai fitur. Model 'belajar' pola yang di produksi belum ada (rata-rata cabang untuk nasabah baru = tidak diketahui). Obat: hitung agregat hanya dari train (atau pakai out-of-fold encoding), dan tanya untuk tiap fitur: 'apakah nilai ini tersedia SAAT prediksi dibuat?'",
        "Saluran 3 — bocor temporal. Shuffle split di data deret waktu: training berisi Januari 2025 sementara test berisi Juni 2024 — model 'meramal masa lalu' dengan pengetahuan masa depan. Obat: time-based split (train = masa lalu, test = masa depan), tidak bisa ditawar untuk data berwaktu.",
        "Saluran 4 — bocor grup. Nasabah yang sama muncul di train DAN test (punya tiga pengajuan) — model menghafal nasabah, bukan pola. Skor CV 0,90, produksi 0,75. Obat: GroupKFold — satu grup tidak pernah terbelah. Tanya selalu: 'unit independennya apa?' (nasabah? toko? hari?) — itulah unit split.",
        "Saluran 5 — bocor seleksi. Feature selection dijalankan di SELURUH data, lalu CV di 12 fitur terpilih. Seleksi sudah 'melihat' test fold — 40 fitur menjadi 12 yang 'terbaik' dengan bantuan informasi test. Skor optimistis 3–7 poin. Obat: seleksi DI DALAM loop CV, atau nested CV.",
        "Nested CV — kapan perlu? Bila pemilihan model memakai skor validation BERULANG-ULANG (puluhan kandidat), skor validation terbaik menjadi optimistis (selection bias). Nested: loop luar (5-fold) memberi estimasi jujur, loop dalam (3-fold) memilih model. Biaya: 15× training. Aturan: pakai bila kandidat di atas 10 dan data di bawah 10 ribu; untuk 2–3 kandidat, single CV + test terkunci cukup.",
        "Urutkan ekspektasi: E[test] ≤ E[val] ≤ E[train] (rumus di bawah). Pelanggaran = diagnosis: val di atas train → bug (atau data mungil yang berisik); test jauh di atas val → test bocor atau keberuntungan sampling; test jauh di bawah val → drift data atau overfitting ke validation. Senior membaca TIGA angka ini seperti dokter membaca tensi — satu angka tidak pernah cukup.",
        "Hierarki baseline — disiplin seleksi model. Tingkat 0: majority (0,47 di lab). Tingkat 1: heuristik domain ('tolak bila telat di atas 3x'). Tingkat 2: linear. Tingkat 3: GBM. Naik tingkat HANYA bila mengalahkan tingkat sebelumnya dengan margin BERMAKNA (bukan 0,001 — itu noise). Tiap tingkat membayar 'pajak kompleksitas': interpretabilitas, latensi, maintenance. Model yang menang 0,002 tetapi butuh GPU = kalah secara bisnis.",
        "Checklist audit leakage senior — tujuh pertanyaan sebelum mempercayai skor CV apapun: (1) split dilakukan SEBELUM fitting apapun? (2) ada fitur yang memakai target? (3) ada informasi masa depan? (4) ada grup yang terbelah? (5) seleksi fitur di dalam loop? (6) test set benar-benar terkunci? (7) bisa direproduksi dari data mentah? Satu 'tidak' = skor belum bisa dipercaya.",
        "Kapan yang sederhana menang? Empat kondisi: regulasi menuntut penjelasan (linear + koefisien), data di bawah 1.000 baris (kompleks = overfit pasti), latensi ketat (skor kredit real-time), dan keunggulan model kompleks yang tenggelam dalam noise seed. Senior tidak alergi kompleksitas — ia menagih BUKTI bahwa kompleksitas membayar pajaknya.",
        "Saluran 6 — bocor via ID dan join. Fitur `user_id` atau nomor baris yang lolos sebagai fitur: model menghafal ID ('user 4521 selalu default') — skor CV 0,95, produksi 0,50 untuk user baru. Varian halusnya: join dengan tabel eksternal yang dihitung dari periode yang TUMPANG TINDIH dengan test (mis. 'rata-rata transaksi 30 hari terakhir' yang mencakup tanggal test). Obat: blacklist kolom ID; untuk setiap join, verifikasi jendela waktunya murni sebelum tanggal prediksi.",
        "Leakage di time-series: purged & embargoed CV (López de Prado). Bila label tumpang tindih antar sampel (mis. return 5-hari ke depan untuk hari yang berurutan), sampel di boundary train/test berbagi informasi. Purge: buang sampel train yang labelnya tumpang tindih dengan test. Embargo: buang jeda tambahan setelah tiap test fold. Tanpa ini, CV time-series optimistis 5–15 poin — angka yang terasa enak sampai live trading menghukummu.",
        "Uji leakage pamungkas: prospective validation. Deploy model dalam mode shadow — ia memprediksi, tetapi keputusan tetap memakai sistem lama — lalu bandingkan prediksinya dengan realita yang datang KEMUDIAN. Tidak ada leakage yang selamat dari waktu: semua kebocoran (target, temporal, grup) terbongkar saat prediksi diuji masa depan yang sesungguhnya. Mahal (butuh minggu), tetapi satu-satunya vonis yang tidak bisa dibohongi.",
      ],
      formula: String.raw`\mathbb{E}[\text{test}] \le \mathbb{E}[\text{val}] \le \mathbb{E}[\text{train}]`,
      formulaNote: "E[·] = ekspektasi skor; train = data yang dipakai fitting; val = data pemilihan model; test = data terkunci yang tak pernah dipakai. Urutan wajar: model paling bagus di data yang 'dilihatnya'. Pelanggaran = sinyal: test jauh di atas val → kebocoran/keberuntungan; test jauh di bawah val → drift/overfit-validasi.",
      tasks: [],
      note: {
        title: "⚠️ Jebakan",
        type: "pitfall",
        body: "Scaling/imputing SEBELUM split — 'kan cuma mean/std'. Mean/std dari test set = informasi test yang masuk ke training; kecil tetapi sistematis, dan untuk encoder kategorikal bisa besar. Selalu: split → fit di train → transform test. `Pipeline` ada untuk ini.",
      },
      reference: "Lima saluran bocor: preprocessing, fitur-target, temporal, grup, seleksi. Obat: split dulu + Pipeline + GroupKFold/time-split + nested bila perlu. E[test] ≤ E[val] ≤ E[train].",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: model apa untuk dataku?",
      prose: [
        "Skenario 1 — data tabel <100 ribu baris → XGBoost/LightGBM. Juara bertahan; tuning 1 hari.",
        "Skenario 2 — harus bisa dijelaskan ke regulator → regresi logistik (+ SHAP untuk boosting bila perlu). Akurasi sedikit turun, audit lolos.",
        "Skenario 3 — data sedikit (<1.000) → linear/naive Bayes + regularisasi kuat. Model kompleks = overfit pasti.",
        "Skenario 4 — teks → TF-IDF + linear/naive Bayes (baseline 1 jam), naik ke transformer bila perlu.",
        "Skenario 5 — tanpa label → k-means/DBSCAN untuk segmentasi; deteksi anomali via isolation forest.",
        "Skenario 6 — citra/audio → deep learning (bukan di sini — track DLE). Jangan paksa boosting untuk citra.",
        "Aturan praktis 10 detik: (1) tabel? boosting. (2) harus dijelaskan? linear. (3) sedikit? sederhana. (4) selalu: baseline + CV + jurang train-val.",
        "Skenario 7 — waktu 1 jam, harus ada hasil → logistic regression + CV. Selesai 30 menit, baseline jujur. 'Cepat dan benar' > 'lambat dan mungkin'.",
        "Skenario 8 — 10 juta baris → LightGBM (bukan XGBoost — 5x lebih cepat untuk besar) atau linear SGD. KNN/SVM = mustahil (O(n²)). Skala mengubah pilihan algoritma!",
      ],
      tasks: [],
    },
    {
      id: "minicase-kredit",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 10.000 nasabah, 40 fitur, 2 pekan",
      prose: [
        "Bank: 10.000 nasabah, 40 fitur tabel, target skor kredit. Kandidat: logistik (2 jam), random forest (4 jam), XGBoost (1 hari tuning), neural network (1 pekan). Hasil CV: 0,78 / 0,82 / 0,85 / 0,83. Pemenang: XGBoost 0,85 — NN kalah meski 5x waktu! Keputusan: XGBoost + SHAP untuk penjelasan regulator.",
        "Nilai bisnis: tiap 0,01 AUC = Rp200 juta/tahun (NPL turun). XGBoost vs logistik: 0,07 × Rp200 juta = Rp1,4 M/tahun. Biaya: 1 hari tuning vs 2 jam — Rp5 juta sekali. ROI: 280x. NN vs XGBoost: −0,02 = −Rp400 juta/tahun + 1 pekan waktu. 'Canggih' yang kalah = mahal dua kali.",
        "Pembahasan: perhatikan XGBoost dipilih bukan karena 'populer', melainkan karena CV tertinggi + waktu wajar + bisa dijelaskan via SHAP. Tiga kriteria (akurasi, biaya, explainability) — bukan satu. Keputusan satu kriteria = keputusan sembrono.",
        "Cara membaca: tabel perbandingan harus selalu punya kolom WAKTU dan EXPLAINABILITY, bukan hanya akurasi. Model terbaik = yang menang di tiga kolom.",
        "Interpretasi: model selection = optimasi terkendala (akurasi, waktu, regulasi). CV = wasit yang adil; baseline = lawan minimum.",
      ],
      tasks: [],
    },
    {
      id: "forecasting-klasik",
      eyebrow: "Langkah 8 · Forecasting klasik",
      title: "Forecasting klasik: deret waktu bukan baris acak",
      prose: [
        "Tim demand planning 'Sinar Mart' (nama samaran) punya 40 toko dan 2 tahun data penjualan mingguan. Data scientist baru mereka melatih XGBoost dengan train_test_split acak — prosedur standar data tabular — dan melaporkan MAPE 2,1%. Manajemen terkesan. Model di-deploy ke semua toko. Minggu pertama: error 38%. Investigasi menemukan twist-nya: karena split ACAK, sebagian besar 'data training' berisi minggu-minggu yang terjadi SETELAH data test. Model tidak meramal masa depan — ia menghafal masa depan, lalu diuji dengan masa lalu yang sudah dilihatnya. CV 98% itu fiksi. Yang rusak bukan XGBoost-nya; yang rusak adalah evaluasinya.",
        "Deret waktu = data dengan panah waktu. Tiga komponennya: TREN (arah jangka panjang — penjualan naik 1,5 unit/minggu), MUSIMAN (pola berulang dengan periode tetap — lonjakan tiap Lebaran, lesu tiap awal bulan), RESIDU (sisanya: noise + kejadian tak terduga seperti banjir). Dekomposisi aditif menulisnya y_t = T_t + S_t + R_t. Bila ayunan musiman membesar seiring tren (penjualan tiket mudik), pakai versi multiplikatif. Langkah pertama forecasting yang benar bukan memilih model — melainkan MEMBACA ketiga komponen ini.",
        "Lima senjata klasik sebelum menyentuh ML: (1) NAIVE — besok = hari ini. (2) SEASONAL NAIVE — minggu depan = minggu yang sama 4 minggu lalu (atau tahun lalu). Jangan remehkan: di data musiman kuat, ia sering mengalahkan model canggih — dan ia adalah BASELINE wajib. (3) MOVING AVERAGE — rata-rata k periode terakhir, menghaluskan noise. (4) EXPONENTIAL SMOOTHING / Holt-Winters — rata-rata berbobot dengan bobot meluruh untuk masa lalu; versi lengkapnya memodelkan level + tren + musiman sekaligus. (5) ARIMA(p,d,q) — p = berapa lag dipakai, d = berapa kali differencing agar deret stasioner, q = lag error. Mesin statistik paling terkenal — dan paling sering dipakai salah karena orang menebak p,d,q tanpa melihat ACF/PACF.",
        "Aturan emas evaluasi: ROLLING-ORIGIN BACKTEST. Train = masa lalu, test = masa depan, lalu geser jendela maju dan ulangi — meniru cara model dipakai di produksi. Shuffle split = model mengintip masa depan = skor fiksi (lihat cerita Sinar Mart). Metrik: MAE = rata-rata |aktual − prediksi|, satuannya sama dengan data ('melenceng rata-rata 7,3 unit/minggu' — langsung dibaca manajemen). MAPE = versi persen, enak untuk membandingkan antar seri — TETAPI tidak terdefinisi bila aktual = 0 (toko tutup di hari libur → pembagi nol → MAPE meledak), dan ia menghukum under-forecast lebih berat daripada over-forecast. Aturan praktis: MAE dulu untuk keputusan, MAPE untuk perbandingan — selalu dengan konteks.",
        "💡 Intuisi: forecasting itu seperti mengemudi sambil melihat kaca spion — kamu hanya boleh memakai apa yang terlihat DI BELAKANG. Setiap kali tergoda memakai trik data tabular (shuffle, split acak, imputasi memakai seluruh kolom), tanya satu kalimat: 'apakah informasi ini tersedia SAAT prediksi dibuat?' Kalau jawabannya 'belum terjadi', itu leakage, bukan fitur. Kalimat ini mencegah 90% bencana forecasting.",
        "Cara membaca chart: garis biru = penjualan mingguan 24 minggu (naik + berayun = tren + musiman). Garis putus-putus vertikal = batas train/test: 20 minggu untuk training, 4 minggu terakhir untuk backtest. Titik oranye = aktual di periode backtest; lingkaran putus-putus abu-abu = prediksi seasonal-naive ('nilai 4 minggu lalu'). Garis penghubung pendek = error tiap titik.",
        "Interpretasi: SEMUA prediksi seasonal-naive jatuh DI BAWAH aktual — ia selalu ketinggalan tren naik (1,5 unit/minggu × 4 minggu ≈ 6 unit). Inilah 'pajak' metode naive di data bertren: MAE 7,3. Pelajarannya: baseline yang salah memberi ilusi 'modelku hebat'; baseline yang tepat memberi target jujur untuk dikalahkan.",
      ],
      formula: String.raw`y_t = T_t + S_t + R_t \qquad \text{MAE} = \frac{1}{n}\sum_{t=1}^{n}\lvert y_t - \hat{y}_t \rvert`,
      formulaNote: "y_t = nilai aktual periode t; T_t = tren; S_t = musiman (periode tetap, mis. 7 hari); R_t = residu; ŷ_t (dibaca 'y-topi') = prediksi; n = jumlah titik evaluasi. Contoh: MAE 7,3 pada penjualan mingguan = 'prediksi meleset rata-rata 7,3 unit per minggu' — satuannya sama dengan data, jadi langsung bermakna bisnis.",
      figure: {
        svg: FIG_BACKTEST,
        alt: "Deret penjualan mingguan 24 titik: train 20 minggu, backtest 4 minggu; prediksi seasonal-naive selalu di bawah aktual karena tren naik.",
        caption: "Backtest rolling-origin: seasonal naive selalu ketinggalan tren.",
      },
      tasks: [
        { id: "t1", text: "Jelaskan dalam 2–3 kalimat: mengapa train_test_split acak pada deret waktu membuat model 'mengintip masa depan'? Beri contoh tanggal konkret." },
        { id: "t2", text: "Hitung MAE manual: aktual [100, 110, 105], prediksi [98, 115, 105]." },
      ],
      expected: "MAE = (2 + 5 + 0) / 3 = 2,33",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'CV 5-fold standar berlaku untuk semua data.' Untuk deret waktu, fold acak = training berisi masa depan. Skornya fiksi — persis kasus Sinar Mart (MAPE 2,1% di CV, error 38% di produksi). Pakai rolling-origin / TimeSeriesSplit: train selalu SEBELUM test dalam urutan waktu. Satu-satunya pengecualian: data yang benar-benar tidak punya ketergantungan waktu — dan itu bukan forecasting.",
      },
      reference: "Waktu punya arah: train = masa lalu, test = masa depan. Baseline = seasonal naive; metrik = MAE dulu, MAPE dengan waspada (aktual nol = tak terdefinisi).",
    },
    {
      id: "forecasting-gbm",
      eyebrow: "Langkah 9 · Forecasting modern",
      title: "GBM untuk forecasting: fitur mengalahkan algoritma",
      prose: [
        "Reframing yang mengubah segalanya: forecasting = supervised learning biasa. Satu BARIS training = satu titik waktu t. FITUR = masa lalu yang dienkode: lag (y_{t-1}, y_{t-7}), rolling mean/std 4 dan 12 minggu, fitur kalender (hari-ke-minggu, bulan, libur nasional, tanggal gajian). TARGET = y_{t+h} (h langkah ke depan). Begitu data berbentuk tabel, SEMUA senjata lesson ini — XGBoost, LightGBM, CV, jurang train-val — langsung bisa dipakai. Inilah kenapa GBM mendominasi kompetisi forecasting modern (M5 Walmart: 42.840 seri penjualan).",
        "Dua arsitektur: PER-SERI (satu model per toko/produk — cocok bila tiap seri unik dan panjang) vs GLOBAL (SATU model untuk semua seri — seri saling 'meminjam kekuatan'; toko baru dengan 8 minggu data ikut belajar pola dari 2.000 toko lain). M5 dimenangkan model global. Aturan praktis: di bawah 50 seri pendek → per-seri atau klasik; ratusan seri homogen → global.",
        "Kapan GBM MENANG: banyak seri + fitur eksternal kaya (promo, cuaca, harga kompetitor, event) — interaksi 'promo × akhir bulan' ditangkap otomatis oleh tree. Kapan GBM KALAH: (1) seri tunggal pendek — tidak cukup baris untuk belajar; (2) musiman sangat kuat & stabil — Holt-Winters/seasonal-naive sama bagus dengan 1% usaha; (3) EKSTRAPOLASI TREN — ini yang paling penting: tree memprediksi rata-rata daun yang pernah dilihat, sehingga ia TIDAK BISA mengeluarkan angka di luar rentang training. Tren naik yang belum pernah dilihat = diramal DATAR. Obatnya: beri fitur tren eksplisit (t itu sendiri, atau lag-1 yang koefisiennya ≈ 1 seperti di lab).",
        "Jebakan leakage fitur lag — 'kan data masa lalu, pasti aman'? Belum tentu. Contoh nyata: fitur 'rata-rata penjualan minggu 17–20' dipakai untuk memprediksi minggu 20 — minggu 20 BELUM TERJADI saat prediksi dibuat! Varian halusnya: rolling window yang mencakup titik target, atau agregat yang dihitung dari data lengkap SEBELUM split. Obatnya sama seperti Langkah 8: untuk tiap fitur, tulis TANGGAL KETERSEDIAANNYA. Fitur yang 'tersedia' setelah forecast origin = leakage. Dan backtest tetap rolling-origin — tidak ada diskon untuk model ML.",
        "Lab: deret penjualan mingguan 24 titik (tren + musiman periode 4, tertanam di kode). Bandingkan dua pendekatan dengan backtest 4 titik terakhir: seasonal-naive (prediksi = nilai 4 minggu lalu) vs regresi lag sederhana (fitur [1, y_{t-1}, y_{t-4}], diselesaikan dengan normal equation 3×3 — stdlib murni, tanpa numpy). Cara membaca output: dua baris MAE — semakin kecil semakin baik. Ekspektasi: seasonal-naive ≈ 7,3 (tertinggal tren), regresi lag ≈ 2,4 (koefisien lag-1 ≈ 1 menangkap tren — fitur mengalahkan algoritma).",
        "💡 Intuisi: tree tidak bisa bermimpi. Decision tree hanya mengeluarkan angka yang pernah ia lihat di training — seperti koki yang tidak bisa memasak rasa yang belum pernah dicicipi. Karena itu GBM butuh 'jembatan' menuju masa depan: fitur tren, atau target yang di-detrending dulu (ramalkan residunya, lalu tambahkan tren kembali). Model yang tidak bisa mengekstrapolasi bukan model jelek — ia hanya butuh fitur yang menerjemahkan arah waktu menjadi angka.",
      ],
      formula: String.raw`\hat{y}_{t+h} = f(y_{t-1}, \dots, y_{t-k}, \text{roll}_4, \text{roll}_{12}, \text{kalender}_t)`,
      formulaNote: "ŷ_{t+h} = prediksi h langkah ke depan dari titik t; f = model ML apapun (GBM, linear); y_{t-1}…y_{t-k} = fitur lag; roll = rata-rata/simpangan baku jendela 4 dan 12 minggu; kalender_t = fitur tanggal (hari, bulan, libur). Contoh: ramalkan penjualan minggu depan dari 4 minggu terakhir + rata-rata 12 minggu + 'apakah minggu depan ada libur nasional'.",
      tasks: [
        { id: "t1", text: "Implementasikan `mae_seasonal_naive` dan `mae_regresi_lag`, jalankan, catat kedua MAE." },
        { id: "t2", text: "Jelaskan dalam 2–3 kalimat: mengapa tree/GBM gagal mengekstrapolasi tren naik yang belum pernah dilihat?" },
        { id: "t3", text: "Untuk deret penjualan ritel Indonesia, sebutkan 1 fitur kalender + 1 jebakan leakage yang mungkin terjadi pada fitur itu." },
      ],
      expected: "MAE seasonal_naive = 7.325, MAE regresi_lag = 2.414",
      hints: [
        "seasonal-naive: untuk t di range(train_n, len(y)): pred = y[t - periode]; kembalikan rata-rata |y[t] - pred|",
        "regresi: fitur [1.0, y[t-1], y[t-periode]] untuk t in range(periode, train_n); bentuk A = Xt'Xt (3x3) dan b = Xt'yt; w = solve3(A, b)",
        "backtest regresi: one-step-ahead — lag memakai nilai histori SEBENARNYA (y[t-1], y[t-periode]), bukan prediksi berantai",
      ],
      code: {
        starter: `# SEED — jangan ubah
import math
SEAS = [10, -8, 5, -7]  # pola musiman periode 4 minggu
def deret():
    return [round(100 + 1.5*t + SEAS[t % 4] + 2*math.sin(0.7*t), 1) for t in range(24)]

def solve3(A, b):  # eliminasi Gauss 3x3 — stdlib murni
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    n = 3
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        M[c], M[p] = M[p], M[c]
        d = M[c][c]
        for r in range(n):
            if r != c:
                f = M[r][c] / d
                for k in range(c, n + 1):
                    M[r][k] -= f * M[c][k]
    return [M[i][n] / M[i][i] for i in range(n)]

Y = deret()
TRAIN_N = 20  # 20 minggu train, 4 minggu terakhir = backtest

# TULIS KODEMU
def mae_seasonal_naive(y, train_n, periode):
    # TODO t1: untuk tiap t di 4 titik terakhir: prediksi = y[t - periode];
    #         kembalikan rata-rata |aktual - prediksi|
    return 0.0

def mae_regresi_lag(y, train_n, periode):
    # TODO t2: fitur [1.0, y[t-1], y[t-periode]] untuk t in range(periode, train_n);
    #         bentuk normal equation: A = Xt'Xt (3x3), b = Xt'yt; w = solve3(A, b);
    #         backtest one-step-ahead di 4 titik terakhir (lag memakai histori sebenarnya)
    return 0.0

# UJI (jangan ubah)
mae_sn = mae_seasonal_naive(Y, TRAIN_N, 4)
mae_lr = mae_regresi_lag(Y, TRAIN_N, 4)
print("MAE seasonal_naive =", round(mae_sn, 3))
print("MAE regresi_lag    =", round(mae_lr, 3))`,
        lockLines: 23,
        solution: `# SEED — jangan ubah
import math
SEAS = [10, -8, 5, -7]  # pola musiman periode 4 minggu
def deret():
    return [round(100 + 1.5*t + SEAS[t % 4] + 2*math.sin(0.7*t), 1) for t in range(24)]

def solve3(A, b):  # eliminasi Gauss 3x3 — stdlib murni
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    n = 3
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        M[c], M[p] = M[p], M[c]
        d = M[c][c]
        for r in range(n):
            if r != c:
                f = M[r][c] / d
                for k in range(c, n + 1):
                    M[r][k] -= f * M[c][k]
    return [M[i][n] / M[i][i] for i in range(n)]

Y = deret()
TRAIN_N = 20  # 20 minggu train, 4 minggu terakhir = backtest

# TULIS KODEMU
def mae_seasonal_naive(y, train_n, periode):
    errs = []
    for t in range(train_n, len(y)):
        errs.append(abs(y[t] - y[t - periode]))
    return sum(errs) / len(errs)

def mae_regresi_lag(y, train_n, periode):
    Xt, yt = [], []
    for t in range(periode, train_n):
        Xt.append([1.0, y[t - 1], y[t - periode]])
        yt.append(y[t])
    A = [[sum(Xt[i][r] * Xt[i][c] for i in range(len(Xt))) for c in range(3)] for r in range(3)]
    b = [sum(Xt[i][r] * yt[i] for i in range(len(Xt))) for r in range(3)]
    w = solve3(A, b)
    errs = []
    for t in range(train_n, len(y)):
        pred = w[0] + w[1] * y[t - 1] + w[2] * y[t - periode]
        errs.append(abs(y[t] - pred))
    return sum(errs) / len(errs)

# UJI (jangan ubah)
mae_sn = mae_seasonal_naive(Y, TRAIN_N, 4)
mae_lr = mae_regresi_lag(Y, TRAIN_N, 4)
print("MAE seasonal_naive =", round(mae_sn, 3))
print("MAE regresi_lag    =", round(mae_lr, 3))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "MAE seasonal_naive\\s*=\\s*7\\.325", label: "MAE seasonal-naive = 7.325", msg: "Prediksi = nilai 4 minggu lalu; tren naik membuatnya bias ~6 unit." },
          { kind: "stdout_matches", task: "t2", pattern: "MAE regresi_lag\\s*=\\s*2\\.414", label: "MAE regresi lag = 2.414", msg: "Koefisien lag-1 ≈ 1 menangkap tren — fitur mengalahkan algoritma." },
        ],
      },
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Fitur lag selalu aman karena datanya masa lalu.' Salah — rolling mean yang mencakup titik yang diprediksi, atau agregat yang dihitung SEBELUM split, adalah leakage klasik. Uji tiap fitur dengan: 'apakah nilai ini sudah ada SAAT prediksi dibuat (forecast origin)?' Kalau belum — buang atau geser jendelanya. Backtest rolling-origin tetap wajib; tidak ada diskon untuk model ML.",
      },
      reference: "Forecasting = supervised learning: baris = titik waktu, fitur = lag + rolling + kalender. GBM menang bila banyak seri + fitur eksternal kaya; kalah dari klasik bila seri tunggal pendek atau musiman sangat stabil. Tree tidak mengekstrapolasi — beri fitur tren.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Enam keluarga: linear (jujur), tree (memotong), ensemble (musyawarah), KNN/SVM, clustering, naive Bayes.",
        "Tabel → XGBoost/LightGBM; harus dijelaskan → linear; sedikit data → sederhana.",
        "Model selection = baseline + k-fold CV; pilih argmax CV, bukan skor training.",
        "Error = Bias² + Variance + Noise; jurang train-val = meteran overfit.",
        "Feature selection: filter → embedded (L1) → wrapper bila perlu.",
      ],
      next: { label: "MLE16 — Hyperparameter Tuning", href: "/v2/learn/mle16-hyperparameter-tuning" },
      quiz: [
        {
          q: "40 fitur tabel, 10.000 baris, tanpa keharusan explainability. Pilihan pertama?",
          options: [
            { text: "XGBoost/LightGBM + CV", why: "Tepat: juara data tabel; CV membuktikan.", correct: true },
            { text: "Neural network 5 layer", why: "Untuk tabel, NN kalah dari boosting 9/10 kali + 50x lebih lambat.", correct: false },
            { text: "KNN k=3", why: "Baseline boleh, tetapi bukan pilihan utama untuk 10rb baris.", correct: false },
            { text: "Tanpa model — tebak acak", why: "Itu baseline — lawan minimum yang harus dikalahkan, bukan solusi yang dikirim ke produksi.", correct: false },
          ],
        },
        {
          q: "Train 0,99, validasi 0,72. Diagnosis dan obat?",
          options: [
            { text: "Variance tinggi (overfit) — regularisasi / sederhanakan / tambah data", why: "Tepat: jurang 27 poin = menghafal noise.", correct: true },
            { text: "Bias tinggi — kompleksitaskan model", why: "Terbalik: train 0,99 = model SUDAH terlalu kompleks.", correct: false },
            { text: "Data kurang — tidak ada obat", why: "Ada: regularisasi, penyederhanaan model, atau tambah data — variance bisa diobati.", correct: false },
            { text: "Normal, langsung deploy", why: "Deploy model hafal = gagal di produksi.", correct: false },
          ],
        },
        {
          q: "Mengapa baseline majority WAJIB sebelum model?",
          options: [
            { text: "Lawan minimum — model harus mengalahkannya dengan jelas", why: "Tepat: mencegah 'model bagus' yang ilusi.", correct: true },
            { text: "Untuk memperlambat kerja", why: "5 menit yang menghemat 5 hari — bukan lambat.", correct: false },
            { text: "Hanya formalitas", why: "Lab menunjukkan baseline 0,47 — tanpa itu, 0,60 terlihat 'bagus'.", correct: false },
            { text: "Tidak perlu jika data besar", why: "Justru data besar = baseline kuat = uji lebih ketat.", correct: false },
          ],
        },
        {
          q: "Regulator menuntut penjelasan tiap keputusan kredit. Pilihan?",
          options: [
            { text: "Regresi logistik (koefisien terbaca) atau boosting + SHAP", why: "Tepat: akurasi vs explainability — pilih sesuai tuntutan.", correct: true },
            { text: "Neural network 10 layer", why: "Kotak hitam = ditolak regulator.", correct: false },
            { text: "KNN k=100", why: "'Karena 100 tetangga bilang begitu' bukan penjelasan.", correct: false },
            { text: "Tebak acak yang didokumentasikan", why: "Terdokumentasi tetapi salah — tetap ditolak.", correct: false },
          ],
        },
        {
          q: "Memilih model dari skor TRAINING tertinggi. Masalahnya?",
          options: [
            { text: "Memilih yang paling overfit — harus dari CV", why: "Tepat: training = ujian dengan kunci jawaban bocor.", correct: true },
            { text: "Tidak ada masalah", why: "Ada: 0,99 training bisa = 0,72 validasi.", correct: false },
            { text: "Terlalu lambat", why: "Bukan soal kecepatan — soal validitas.", correct: false },
            { text: "Hanya untuk data kecil", why: "Berlaku untuk semua ukuran data.", correct: false },
          ],
        },
        {
          q: "Feature selection dijalankan pada SELURUH data (40 menjadi 12 fitur), lalu CV. Apa yang salah?",
          options: [
            { text: "Selection leakage — seleksi sudah 'melihat' test fold; skor CV optimistis 3–7 poin", why: "Tepat: 12 fitur 'terbaik' dipilih dengan bantuan informasi test; obatnya seleksi di dalam loop.", correct: true },
            { text: "Tidak ada — seleksi bukan training", why: "Seleksi = keputusan berbasis data; memakai test = bocor.", correct: false },
            { text: "Hanya masalah kecepatan", why: "Ini soal validitas skor, bukan kecepatan.", correct: false },
            { text: "CV menjadi tidak perlu", why: "CV tetap perlu — yang salah adalah seleksi di luar loop.", correct: false },
          ],
        },
        {
          q: "Hasil: train 0,99, val 0,97, test 0,71. Diagnosis senior?",
          options: [
            { text: "Overfitting ke validation (atau drift) — val terlalu bagus untuk dipercaya; test yang jujur", why: "Tepat: E[test] ≤ E[val] dilanggar berat; pemilihan berulang di val = val menjadi 'test kedua'.", correct: true },
            { text: "Model bagus, test yang salah", why: "Menyalahkan test = menolak diagnosis; jurang 26 poin = sinyal sistemik.", correct: false },
            { text: "Kurang data training", why: "Train 0,99 = model menghafal; masalahnya validasi, bukan volume.", correct: false },
            { text: "Normal — test selalu lebih rendah", why: "'Lebih rendah' 2–3 poin wajar; 26 poin = patologi.", correct: false },
          ],
        },
      ],
    },
  ],
};

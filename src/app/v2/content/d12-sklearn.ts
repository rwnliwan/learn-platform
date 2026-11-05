import type { V2Lesson } from "../lib/types";

export const d12: V2Lesson = {
  slug: "d12-sklearn",
  track: "Python",
  module: "Machine Learning",
  title: "D12 scikit-learn: Pipeline ML Pertama",
  estMinutes: 55,
  steps: [
    {
      id: "api",
      eyebrow: "Langkah 1 · API seragam",
      title: "Cerita pembuka: satu API untuk semua model",
      prose: [
        "sklearn = API seragam untuk ML klasik: semua model punya fit/predict. Pola: `Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression())])`, lalu `cross_val_score(pipe, X, y, cv=5)`. Ganti LogisticRegression dengan RandomForest — kode lain sama.",
        "Kapan ML klasik vs deep learning: data tabular < 100k baris = ML klasik (cepat, interpretable, cukup). Gambar/teks/unstructured = deep learning. Aturan: mulai dari baseline sederhana (logistic regression) sebelum model kompleks.",
      ],
      tasks: [],
      reference: "Pipeline + cross_val_score. Baseline sederhana dulu, kompleks kemudian.",
    },
    {
      id: "logreg",
      eyebrow: "Langkah 2 · Baseline",
      title: "Baseline logistic regression",
      prose: [
        "Logistic regression memodelkan P(macet | fitur) — output probabilitas, cocok untuk risk scoring. Cross-validation 5-fold memberi AUC 0.68 ± 0.06: estimasi performa yang jujur, bukan keberuntungan satu split.",
        "Kenapa CV penting: satu split bisa beruntung. CV melatih-menguji 5x di lipatan berbeda — std menunjukkan stabilitas. AUC 0.68 = di atas acak (0.5), tapi belum bagus; ini baseline untuk dikalahkan.",
      ],
      requires: ["scikit-learn", "pandas", "numpy"],
      tasks: [
        { id: "t1", text: "Bangun Pipeline scaler + LogisticRegression, jalankan `cross_val_score` (cv=5, AUC)" },
        { id: "t2", text: "Hitung `auc_mean` dan `auc_std`" },
      ],
      expected: "auc_mean=0.68  auc_std=0.06",
      note: {
        title: "Sering salah",
        body: "Menilai model dari satu split train/test. Satu split = satu undian. cross_val_score memberi mean DAN std — std besar berarti model tidak stabil dan hasil tidak bisa dipercaya.",
      },
      hints: [
        "pipe = Pipeline([('s', StandardScaler()), ('c', LogisticRegression(max_iter=1000))]).",
        "skor = cross_val_score(pipe, X, y, cv=5, scoring='roc_auc').",
        "auc_mean = skor.mean(); auc_std = skor.std()",
      ],
      code: {
        starter: `import pandas as pd, numpy as np\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nrng = np.random.default_rng(5)\nn = 300\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n)\nmacet = ((gaji < 7_000_000) & (dpd > 15)).astype(int)\nX = pd.DataFrame({"gaji": gaji, "dpd": dpd, "tenor": rng.integers(6, 37, n)})\ny = macet\n\n# TULIS KODEMU\npipe = \nskor = \nauc_mean = \nauc_std = \n\nprint(f"proporsi={y.mean():.2f}  auc_mean={auc_mean:.2f}  auc_std={auc_std:.2f}")`,
        lockLines: 12,
        solution: `import pandas as pd, numpy as np\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nrng = np.random.default_rng(5)\nn = 300\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n)\nmacet = ((gaji < 7_000_000) & (dpd > 15)).astype(int)\nX = pd.DataFrame({"gaji": gaji, "dpd": dpd, "tenor": rng.integers(6, 37, n)})\ny = macet\n\n# TULIS KODEMU\npipe = Pipeline([("s", StandardScaler()), ("c", LogisticRegression(max_iter=1000))])\nskor = cross_val_score(pipe, X, y, cv=5, scoring="roc_auc")\nauc_mean = skor.mean()\nauc_std = skor.std()\n\nprint(f"proporsi={y.mean():.2f}  auc_mean={auc_mean:.2f}  auc_std={auc_std:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "auc_mean", value: 0.681, tol: 0.03, label: "`auc_mean` sekitar 0.68", msg: "AUC cross-val 5-fold." },
          { kind: "equal", task: "t2", name: "auc_std", value: 0.057, tol: 0.03, label: "`auc_std` sekitar 0.06", msg: "Variabilitas antar fold." },
          { kind: "stdout_matches", task: "t2", pattern: "auc_mean=0\\.68\\s+auc_std=0\\.06", label: "`print` menampilkan AUC", msg: "Format: auc_mean=0.68  auc_std=0.06." },
        ],
      },
      reference: "cross_val_score(pipe, X, y, cv=5). Lapor mean + std, bukan satu angka.",
    },
    {
      id: "forest",
      eyebrow: "Langkah 3 · Random forest",
      title: "Ensemble + feature importance",
      prose: [
        "RandomForestClassifier: 100 pohon, tiap pohon lihat subset fitur/sampel, voting. Hasil: AUC 0.87 vs baseline 0.68 — non-linearitas yang tidak ditangkap regresi logistik. Akurat, tapi lebih lambat dan kurang interpretable.",
        "Feature importance memberi bobot tiap fitur (gaji: 0.45, dpd: 0.35, tenor: 0.20). Penting: importance bisa bias ke fitur kardinalitas tinggi — validasi dengan permutasi atau SHAP sebelum klaim 'fitur X paling penting'.",
      ],
      requires: ["scikit-learn", "pandas", "numpy"],
      tasks: [
        { id: "t1", text: "Fit `RandomForestClassifier(n_estimators=50)`, ambil `imp` (importance)" },
        { id: "t2", text: "Tentukan `top` = nama fitur paling penting" },
      ],
      expected: "top=dpd  imp_dpd=0.35",
      note: {
        title: "Sering salah",
        body: "Mengira feature importance = kausalitas. Importance hanya bilang 'model banyak memakai fitur ini' — bisa karena korelasi dengan fitur lain atau leakage. Jangan jadikan dasar keputusan bisnis tanpa validasi.",
      },
      hints: [
        "rf = RandomForestClassifier(n_estimators=50, random_state=42); rf.fit(X, y).",
        "imp = dict(zip(X.columns, rf.feature_importances_)).",
        "top = max(imp, key=imp.get)",
      ],
      code: {
        starter: `import pandas as pd, numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\nrng = np.random.default_rng(5)\nn = 300\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n)\nmacet = ((gaji < 7_000_000) & (dpd > 15)).astype(int)\nX = pd.DataFrame({"gaji": gaji, "dpd": dpd, "tenor": rng.integers(6, 37, n)})\ny = macet\n\n# TULIS KODEMU\nrf = \nimp = \ntop = \n\nprint(f"top={top}  imp_dpd={imp['dpd']:.2f}")`,
        lockLines: 10,
        solution: `import pandas as pd, numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\nrng = np.random.default_rng(5)\nn = 300\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n)\nmacet = ((gaji < 7_000_000) & (dpd > 15)).astype(int)\nX = pd.DataFrame({"gaji": gaji, "dpd": dpd, "tenor": rng.integers(6, 37, n)})\ny = macet\n\n# TULIS KODEMU\nrf = RandomForestClassifier(n_estimators=50, random_state=42)\nrf.fit(X, y)\nimp = dict(zip(X.columns, rf.feature_importances_))\ntop = max(imp, key=imp.get)\n\nprint(f"top={top}  imp_dpd={imp['dpd']:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "top", value: "dpd", label: "`top` = 'dpd'", msg: "DPD fitur paling penting." },
          { kind: "contains", task: "t1", name: "imp", value: "dpd", label: "`imp` memuat 'dpd'", msg: "Dict importance untuk 3 fitur." },
          { kind: "stdout_matches", task: "t2", pattern: "top=dpd\\s+imp_dpd=0\\.3\\d", label: "`print` menampilkan top fitur", msg: "Format: top=dpd  imp_dpd=0.3x." },
        ],
      },
      reference: "rf.feature_importances_ — validasi sebelum klaim kausal.",
    },
    {
      id: "overfit",
      eyebrow: "Langkah 4 · Overfitting",
      title: "Mendiagnosis dengan learning curve",
      prose: [
        "Max_depth dikontrol: depth 1 memberi train 0.77/cv 0.71 (underfit), depth 5 memberi train 0.98/cv 0.88 (gap 0.10 — mulai overfit). Gap train-cv adalah diagnosis: besar = varians tinggi = kurangi kompleksitas atau tambah data.",
        "Obat: regularisasi (C kecil, max_depth), lebih banyak data, fitur lebih sedikit, ensemble. Underfit (keduanya rendah) = tambah kompleksitas. Diagnosis dulu, obat kemudian.",
      ],
      requires: ["scikit-learn", "pandas", "numpy"],
      tasks: [
        { id: "t1", text: "Loop depth [1, 3, 5], catat `train_auc` dan `cv_auc` (cv=3)" },
        { id: "t2", text: "Hitung `gap_5` = train - cv di depth 5" },
      ],
      expected: "gap_5=0.10",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model overfit di produksi tampak akurat di backtest tapi gagal di data baru — persis jebakan yang membuat scorecard kredit 'bagus di kertas'. Gap train-cv adalah baris pertama audit model risiko.",
      },
      hints: [
        "for d in [1, 3, 5]: clf = DecisionTreeClassifier(max_depth=d).",
        "train_auc = roc_auc_score(y, clf.fit(X, y).predict_proba(X)[:, 1]).",
        "cv_auc = cross_val_score(clf, X, y, cv=3, scoring='roc_auc').mean()",
      ],
      code: {
        starter: `import pandas as pd, numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.metrics import roc_auc_score\n\nrng = np.random.default_rng(5)\nn = 300\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n)\nmacet = ((gaji < 7_000_000) & (dpd > 15)).astype(int)\nX = pd.DataFrame({"gaji": gaji, "dpd": dpd, "tenor": rng.integers(6, 37, n)})\ny = macet\n\n# TULIS KODEMU: gap train-cv per depth\ntrain_auc, cv_auc = {}, {}\nfor d in [1, 3, 5]:\n    clf = DecisionTreeClassifier(max_depth=d, random_state=42)\n    \n    \ngap_5 = \n\nprint(f"gap_5={gap_5:.2f}")`,
        lockLines: 12,
        solution: `import pandas as pd, numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.metrics import roc_auc_score\n\nrng = np.random.default_rng(5)\nn = 300\ngaji = rng.normal(9_000_000, 2_500_000, n).clip(3_000_000)\ndpd = rng.poisson(12, n)\nmacet = ((gaji < 7_000_000) & (dpd > 15)).astype(int)\nX = pd.DataFrame({"gaji": gaji, "dpd": dpd, "tenor": rng.integers(6, 37, n)})\ny = macet\n\n# TULIS KODEMU: gap train-cv per depth\ntrain_auc, cv_auc = {}, {}\nfor d in [1, 3, 5]:\n    clf = DecisionTreeClassifier(max_depth=d, random_state=42)\n    clf.fit(X, y)\n    train_auc[d] = roc_auc_score(y, clf.predict_proba(X)[:, 1])\n    cv_auc[d] = cross_val_score(clf, X, y, cv=3, scoring="roc_auc").mean()\ngap_5 = train_auc[5] - cv_auc[5]\n\nprint(f"gap_5={gap_5:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "gap_5", value: 0.10, tol: 0.05, label: "`gap_5` sekitar 0.10", msg: "Depth 5: train 0.98 vs cv 0.88 — mulai overfit." },
          { kind: "stdout_matches", task: "t2", pattern: "gap_5=0\\.10", label: "`print` menampilkan gap", msg: "Format: gap_5=0.10." },
        ],
      },
      reference: "Gap train-cv besar = overfit. Obat: regularisasi, data, fitur lebih sedikit.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 5 · Metrik bisnis",
      title: "Akurasi menipu; pilih metrik dari biaya",
      prose: [
        "Akurasi 95% pada data 5% macet bisa dicapai model yang selalu bilang 'lancar' — tidak berguna. Precision = dari yang diprediksi macet, berapa yang benar macet. Recall = dari yang benar-benar macet, berapa yang ketangkap.",
        "Biaya menentukan: miss satu nasabah macet (FN) jauh lebih mahal dari salah tolak satu nasabah baik (FP) — pilih recall tinggi. Threshold 0.5 bukan hukum: geser untuk menyeimbangkan biaya. F1 hanya saat biaya seimbang.",
      ],
      tasks: [],
      reference: "FN mahal -> recall; FP mahal -> precision. Threshold bisa digeser.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 6 · Intuisi",
      title: "Intuisi: yang divalidasi adalah prosedur, bukan artefak",
      prose: [
        "Heuristik penutup: model yang baik lahir dari prosedur yang jujur — artefak (file .pkl) hanyalah akibatnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: yang divalidasi adalah prosedur, bukan artefak",
        body: "Heuristik pertama: CV mengukur PROSEDUR (cara kamu split, imputasi, tuning), bukan model final — model final dilatih di semua data SETELAH prosedurnya terbukti jujur. Skor CV yang bagus dari prosedur bocor tidak bernilai apa-apa. Heuristik kedua: Pipeline adalah cara termurah mematuhi semua aturan leakage — bila pra-pemrosesanmu tidak muat dalam satu Pipeline, itu sinyal prosedurnya terlalu rumit untuk dipercaya. Heuristik ketiga: curigai metrik yang terlalu bagus — lompatan besar dari satu trik pra-pemrosesan hampir selalu leakage; perbaikan yang benar datang bertahap. Heuristik keempat: untuk data berwaktu, satu-satunya validasi yang jujur adalah validasi temporal — masa lalu melatih, masa depan menguji; KFold acak pada data waktu adalah optimisme yang disponsori library. Heuristik kelima: pisahkan tuning dari pelaporan (nested CV) — memilih hyperparameter pada CV yang sama dengan yang dilaporkan adalah memilih yang beruntung lalu melaporkan keberuntungannya. Dan yang paling senior: model sederhana dengan prosedur jujur mengalahkan model canggih dengan prosedur bocor — selalu, dalam jangka panjang.",
      },
      reference: "Validasi prosedur, bukan artefak. Pipeline = kepatuhan termurah. Temporal untuk data waktu; nested untuk tuning.",
    },
    {
      id: "advanced-pipeline",
      eyebrow: "Langkah 7 · Advanced",
      title: "Advanced: Pipeline/ColumnTransformer, leakage pra-split, CV yang benar",
      prose: [
        "Tiga praktik yang memisahkan notebook eksperimen dari modeling yang bisa di-deploy. Pertama, PIPELINE + COLUMNTRANSFORMER: rangkai seluruh pra-pemrosesan dan model dalam SATU objek — `Pipeline([('prep', ColumnTransformer([...])), ('clf', LogisticRegression())])`. Tiga kemenangan: (1) ANTI-LEAKAGE — transformer di-fit ULANG di tiap lipatan CV secara otomatis, tidak ada lagi 'lupa, scaler-nya ke-fit di semua data'; (2) REPRODUSIBILITAS — satu objek untuk di-pickle, di-version, di-deploy; tidak ada lagi 'imputer-nya pakai mean berapa ya?'; (3) ANTI TRAIN-SERVE SKEW — transformasi yang sama persis dipakai saat training dan saat prediksi live. Alternatifnya (fit/transform manual berserakan di 20 sel notebook) adalah tempat leakage berkembang biak.",
        "Kedua, LEAKAGE VIA SCALING SEBELUM SPLIT: `scaler.fit(X_seluruh)` sebelum `train_test_split` — mean/std dihitung memakai baris test, lalu dipakai menormalisasi train. Efeknya biasanya kecil (beda 0,1–0,5pp), tetapi ia SATU KELAS dengan target leakage: informasi test merembes ke train. Di konteks regulated (model risiko kredit yang diaudit), ini temuan — bukan karena angkanya besar, melainkan karena prosedurnya salah. Aturannya absolut: SPLIT DULU, baru semua transformasi (imputasi, scaling, encoding, seleksi fitur) — dan cara termudah mematuhinya adalah Pipeline. Praktikkan di lab: versi bocor vs pipeline pada imputasi yang memakai label — selisih 6pp yang terlihat 'gratis'.",
        "Ketiga, KEBENARAN CROSS-VALIDATION: tiga aturan yang sering dilanggar. (1) Data berwaktu: KFold acak menaruh masa depan di train — pakai TimeSeriesSplit (train masa lalu, test masa depan). (2) Klasifikasi imbalance: StratifiedKFold menjaga proporsi kelas per lipatan — KFold biasa bisa menghasilkan lipatan tanpa satu pun sampel minoritas. (3) NESTED CV saat tuning hyperparameter: loop dalam untuk memilih parameter, loop luar untuk mengestimasi performa — tuning dan pelaporan pada CV yang sama = bias optimis (kamu memilih yang beruntung, lalu melaporkan keberuntungannya). Dan ingat apa yang diukur CV: bukan 'model ini', melainkan 'PROSEDUR ini' — model final dilatih pada SEMUA data setelah prosedur tervalidasi.",
      ],
      tasks: [],
      reference: "Satu Pipeline untuk semua pra-pemrosesan. Split dulu, transform kemudian. TimeSeriesSplit untuk data waktu; nested CV untuk tuning.",
    },
    {
      id: "minicase-pipeline",
      eyebrow: "Langkah 8 · Mini-case",
      requires: ["scikit-learn", "pandas", "numpy"],
      title: "Mini-case: akurasi 86% yang menguap saat live",
      prose: [
        "Skenario (angka konkret): model churn dengan 600 ribu baris historis; fitur 'tenure_terakhir' 30% missing (MNAR — pelanggan churn cenderung tidak mengisi). Analis mengisi missing dengan rata-rata per kelas churn dari SELURUH data — termasuk data validasi. CV: akurasi 86,5%. Di-deploy; 2 bulan live: akurasi 80,2% — selisih 6,3pp. Model 'kehilangan' 6pp bukan karena data live berbeda, melainkan karena imputasi bocor menyuntikkan informasi label ke fitur: nilai imputasi untuk kelas churn = rata-rata kelas churn — fitur itu sebagian menghafal jawabannya. Versi pipeline yang benar (SimpleImputer di dalam CV): 80,2% sejak awal — jujur, tidak mengejutkan.",
        "Pertanyaan analisis: (1) Di mana tepatnya label merembes? (2) Mengapa selisihnya 6pp, bukan 0,1pp? (3) Bagaimana struktur kode yang mencegah ini?",
        "Pembahasan: (1) Di baris imputasi: mean per kelas dihitung dari SEMUA label, lalu dipakai sebagai nilai fitur — nilai fitur untuk baris missing secara harfiah diturunkan dari jawabannya. (2) Karena missing-nya MNAR dan terstruktur (30%), informasi label yang disuntikkan besar — bukan noise kecil seperti scaling pra-split. (3) Pipeline: seluruh pra-pemrosesan (imputasi, scaling, encoding) di DALAM objek Pipeline sehingga CV me-refit-nya per lipatan; dan aturan 'split dulu, transform kemudian' sebagai hukum. Praktikkan di lab: replika mini dari kasus ini — 80,2% vs 86,5%.",
        "Kaitan ke karier: 6pp inflasi akurasi = keputusan bisnis yang salah harga (target campaign, cadangan). Pipeline bukan gaya — ia kontrol risiko modeling.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `X_bocor`: isi missing x2 dengan mean per kelas dari SEMUA data" },
        { id: "t2", text: "Bangun `pipe` (SimpleImputer + LogisticRegression); bandingkan CV kedua pendekatan" },
      ],
      expected: "skor_benar sekitar 0.80, skor_bocor sekitar 0.87, bocor_menang=True",
      hints: [
        "Loop k in [0,1]: X_bocor.loc[(X_bocor['x2'].isna()) & (y==k), 'x2'] = X.loc[y==k, 'x2'].mean().",
        "pipe = Pipeline([('imp', SimpleImputer()), ('clf', LogisticRegression())]).",
        "cv = StratifiedKFold(5, shuffle=True, random_state=1); cross_val_score(...).mean().",
      ],
      code: {
        starter: `import numpy as np\\nimport pandas as pd\\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\\nfrom sklearn.pipeline import Pipeline\\nfrom sklearn.impute import SimpleImputer\\nfrom sklearn.linear_model import LogisticRegression\\n\\nrng = np.random.default_rng(11)\\nn = 600\\nx1 = rng.normal(0, 1, n)\\ny = (x1 + rng.normal(0, 1.2, n) > 0).astype(int)\\nx2 = y * 1.5 + rng.normal(0, 1, n)              # fitur informatif\\nhilang = rng.random(n) < np.where(y == 1, 0.5, 0.1)  # missing MNAR\\nx2 = np.where(hilang, np.nan, x2)\\nX = pd.DataFrame({"x1": x1, "x2": x2})\\nprint("X:", X.shape, "| missing x2:", X["x2"].isna().sum())\\n\\n# TULIS KODEMU: bandingkan imputasi BOCOR vs PIPELINE yang benar\\n# CARA BOCOR: imputasi memakai LABEL (mean per kelas dari SEMUA data)\\nX_bocor = X.copy()\\nfor k in [0, 1]:\\n    X_bocor.loc[(X_bocor["x2"].isna()) & (y == k), "x2"] =\\n\\n# CARA BENAR: pipeline — imputasi terjadi DI DALAM tiap lipatan CV\\npipe = Pipeline([\\n\\n])\\n\\ncv = StratifiedKFold(5, shuffle=True, random_state=1)\\nskor_benar = cross_val_score(pipe, X, y, cv=cv).mean()\\nskor_bocor = cross_val_score(LogisticRegression(), X_bocor, y, cv=cv).mean()\\nbocor_menang = skor_bocor > skor_benar\\nprint(f"skor_benar={skor_benar:.3f} skor_bocor={skor_bocor:.3f} bocor_menang={bocor_menang}")\\n`,
        lockLines: 16,
        solution: `import numpy as np\\nimport pandas as pd\\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\\nfrom sklearn.pipeline import Pipeline\\nfrom sklearn.impute import SimpleImputer\\nfrom sklearn.linear_model import LogisticRegression\\n\\nrng = np.random.default_rng(11)\\nn = 600\\nx1 = rng.normal(0, 1, n)\\ny = (x1 + rng.normal(0, 1.2, n) > 0).astype(int)\\nx2 = y * 1.5 + rng.normal(0, 1, n)              # fitur informatif\\nhilang = rng.random(n) < np.where(y == 1, 0.5, 0.1)  # missing MNAR\\nx2 = np.where(hilang, np.nan, x2)\\nX = pd.DataFrame({"x1": x1, "x2": x2})\\nprint("X:", X.shape, "| missing x2:", X["x2"].isna().sum())\\n\\n# TULIS KODEMU: bandingkan imputasi BOCOR vs PIPELINE yang benar\\n# CARA BOCOR: imputasi memakai LABEL (mean per kelas dari SEMUA data)\\nX_bocor = X.copy()\\nfor k in [0, 1]:\\n    X_bocor.loc[(X_bocor["x2"].isna()) & (y == k), "x2"] = X.loc[y == k, "x2"].mean()\\n\\n# CARA BENAR: pipeline — imputasi terjadi DI DALAM tiap lipatan CV\\npipe = Pipeline([\\n    ("imp", SimpleImputer()),\\n    ("clf", LogisticRegression()),\\n])\\n\\ncv = StratifiedKFold(5, shuffle=True, random_state=1)\\nskor_benar = cross_val_score(pipe, X, y, cv=cv).mean()\\nskor_bocor = cross_val_score(LogisticRegression(), X_bocor, y, cv=cv).mean()\\nbocor_menang = skor_bocor > skor_benar\\nprint(f"skor_benar={skor_benar:.3f} skor_bocor={skor_bocor:.3f} bocor_menang={bocor_menang}")\\n`,
        checks: [
          { kind: "defined", task: "t1", name: "X_bocor", label: "`X_bocor` terdefinisi", msg: "Salin X lalu isi missing per kelas memakai SEMUA label." },
          { kind: "defined", task: "t2", name: "skor_benar", label: "`skor_benar` terdefinisi", msg: "CV dari Pipeline yang imputasinya di dalam lipatan." },
          { kind: "equal", task: "t2", name: "bocor_menang", value: true, tol: 0, label: "`bocor_menang` = True", msg: "Imputasi ber-label menggelembungkan skor ~6pp (ilusi)." },
          { kind: "stdout_matches", task: "t2", pattern: "bocor_menang=True", label: "Perbandingan tercetak", msg: "Format: skor_benar=... skor_bocor=... bocor_menang=True." },
        ],
      },
      reference: "Imputasi/encoding memakai label = leakage. Pipeline = pra-pemrosesan di dalam CV. 6pp ilusi = keputusan salah harga.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kapan mulai dengan model kompleks?",
          options: [
            { text: "Selalu", why: "Kompleks dulu = overfit dulu." },
            { text: "Setelah baseline sederhana ada", why: "Baseline memberi target untuk dikalahkan.", correct: true },
            { text: "Tidak pernah", why: "Kadang kompleks memang dibutuhkan." },
            { text: "Kalau data besar", why: "Besar data bukan alasan skip baseline." },
          ],
        },
        {
          q: "Train 0.98, CV 0.75 — diagnosis?",
          options: [
            { text: "Underfit", why: "Underfit = keduanya rendah." },
            { text: "Overfit — kurangi kompleksitas", why: "Gap besar = varians tinggi.", correct: true },
            { text: "Data bocor", why: "Leakage gejalanya akurasi tidak wajar, bukan gap." },
            { text: "Model bagus", why: "CV 0.75 jauh di bawah train." },
          ],
        },
        {
          q: "FN (miss macet) sangat mahal — metrik?",
          options: [
            { text: "Precision", why: "Precision untuk FP mahal." },
            { text: "Recall tinggi", why: "Tangkap sebanyak mungkin yang macet.", correct: true },
            { text: "Akurasi", why: "Akurasi menipu di data imbalanced." },
            { text: "F1", why: "F1 saat biaya seimbang." },
          ],
        },
        {
          q: "Feature importance tinggi berarti...",
          options: [
            { text: "Kausal", why: "Importance bukan kausalitas." },
            { text: "Model banyak memakai fitur itu — validasi dulu", why: "Bisa bias kardinalitas/leakage.", correct: true },
            { text: "Fitur terbaik", why: "Belum tentu — perlu validasi." },
            { text: "Bisa dihapus", why: "Terbalik." },
          ],
        },
      ],
      summary: [
        "Pipeline + CV: API seragam, evaluasi jujur (mean + std).",
        "Baseline dulu; kompleks hanya jika mengalahkan baseline.",
        "Gap train-cv = diagnosis overfit/underfit.",
        "Metrik dari biaya bisnis: FN mahal -> recall.",
        "Importance bukan kausalitas — validasi.",
      ],
      next: { label: "D13 — Performa", href: "/learn/d13-performa" },
    },
  ],
};

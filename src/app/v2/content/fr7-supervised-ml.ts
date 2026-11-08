import type { V2Lesson } from "../lib/types";

export const fr7: V2Lesson = {
  slug: "fr7-supervised-ml",
  track: "Fraud & AML Analytics",
  module: "Machine Learning",
  title: "FR7 — Supervised ML",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "40 fitur, 1 baris yang mengubah segalanya",
      prose: [
        "Data scientist \"PayKu\" frustrasi. Model XGBoost-nya: 40 fitur pakar, tuning 3 hari, AUC 0,93. Tapi di produksi: recall cuma 41% — 6 dari 10 fraud lolos. Ia curiga fiturnya kurang. Ia curiga modelnya kurang dalam. Ia menghabiskan 2 minggu menambah fitur.",
        "Lalu seorang kolega menatap satu baris konfigurasinya dan bertanya: \"Scale_pos_weight kamu berapa?\" — \"Default. 1.\" Kolega itu mengubahnya jadi 25. Recall melonjak ke 78%. Satu baris. Lima detik.",
        "Model itu sudah pintar sejak awal — ia hanya diajari dengan \"aturan main\" yang salah. Dengan weight 1, model menganggap \"salah menuduh 1.000 orang normal\" sama buruknya dengan \"meloloskan 1 fraud Rp1 juta\". Padahal biayanya beda 40x lipat. Di fraud ML, mengajari model tentang BIAYA lebih penting daripada mengajarinya tentang POLA.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Urutan dampak dalam supervised fraud: label (40%) > fitur (40%) > algoritma (15%) > tuning (5%). Tim yang menghabiskan 80% waktu untuk tuning XGBoost tapi labelnya kotor sedang mengoptimasi 5% sambil mengabaikan 80%. Kerja dari kiri ke kanan.",
      },
      reference: "Gradient boosting (XGBoost/LightGBM) = raja tabel fraud: no scaling, interaksi otomatis, robust missing, explainable.",
    },
    {
      id: "imbalance",
      eyebrow: "Langkah 2 · Imbalance",
      title: "1 berbanding 500",
      prose: [
        "Fraud rate 0,2% = 1 fraud : 500 normal. Tiga masalah yang ditimbulkannya. Model malas: prediksi \"semua normal\" memberi akurasi 99,8% — model tidak punya insentif belajar pola fraud. Metrik menipu: akurasi 99,8% dengan recall 0%. Validasi berisik: dengan 100 fraud di validasi, selisih 5 kasus = 5% recall — butuh stratified split agar tiap lipatan punya fraud cukup.",
        "Tiga keluarga solusi: (1) data-level: oversampling (SMOTE), undersampling; (2) algorithm-level: class weight; (3) decision-level: geser threshold. Untuk fraud, class weight + threshold tuning adalah kombinasi standar — SMOTE pada data fraud sering merusak karena menciptakan \"fraud sintetis\" yang tidak realistis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Atasi imbalance dengan SMOTE — standar textbook.\" SMOTE menginterpolasi antar contoh fraud — untuk fraud, \"titik di antara dua serangan\" sering bukan serangan yang realistis (penipu tidak berdistribusi mulus di ruang fitur). Hasilnya: model percaya diri pada pola fiktif. Class weight + threshold tuning lebih aman dan lebih explainable.",
      },
      reference: "SMOTE untuk fraud = waspada; default aman = class weight + threshold tuning.",
    },
    {
      id: "weight",
      eyebrow: "Langkah 3 · Class weight",
      title: "Denda untuk kesalahan mahal",
      prose: [
        "Class weight mengalikan \"denda\" (loss) untuk kesalahan pada kelas minoritas. Di XGBoost: scale_pos_weight = jumlah_negatif / jumlah_positif (≈ 500 untuk fraud 0,2%). Tanpa weight, model melihat 500 normal vs 1 fraud dan memutuskan \"fraud tidak penting\". Dengan weight 25, tiap fraud dihitung 25x — model \"merasakan\" 25 fraud vs 500 normal. Ia mulai peduli.",
        "Weight 1→20: recall melonjak 42%→74% (\"model mulai peduli\"). Weight 20→100: recall stagnan (+2%) tapi precision anjlok 19%→11% (\"model jadi paranoid\"). Sweet spot ~10–25. Weight bukan \"makin besar makin bagus\"; ia adalah kenop trade-off, bukan tombol ajaib. Aturan praktis: mulai dari √rasio (≈22) — titik awal empiris yang sering dekat optimal.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `weighted_threshold(weight)` → (ambang, recall%, precision%)" },
        { id: "t2", text: "Uji weight 1, 5, 10, 25, 50 dan cetak tabelnya" },
      ],
      expected: "Weight 1→10: recall tetap 100%, precision turun 95→91% | weight 50: precision anjlok ke 11.8%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bobot 499 membuat skor probabilitas tidak terkalibrasi (skor 0,8 bukan berarti peluang 80%). Jika skor dipakai untuk threshold biaya, kalibrasi ulang dulu (Platt scaling / isotonic) atau gunakan ranking, bukan nilai absolutnya.",
      },
      hints: [
        "Ambang t = 60 - (weight-1)*0.35: makin besar weight, makin rendah ambang.",
        "recall = tp/20*100; precision = tp/(tp+fp)*100.",
        "t = 60 - (weight - 1) * 0.35",
      ],
      code: {
        starter: `# Class weight: 'denda' untuk salah klasifikasi kelas minoritas.\n# 1000 normal (skor 20-50), 20 fraud (skor 60-90).\nimport random\nrandom.seed(5)\nnormal = [random.gauss(35, 8) for _ in range(1000)]\nfraud  = [random.gauss(75, 8) for _ in range(20)]\n\n# TULIS KODEMU: ambang bergeser turun saat weight naik\ndef weighted_threshold(weight):\n    t =\n    tp =\n    fp =\n    recall =\n    prec =\n    return t, recall, prec\n\nprint(f"{'Weight':>6s} {'Ambang':>6s} {'Recall':>7s} {'Precision':>9s}")\nfor w in [1, 5, 10, 25, 50]:\n    t, r, p = weighted_threshold(w)\n    print(f"{w:6d} {t:6.1f} {r:6.1f}% {p:8.1f}%")`,
        lockLines: 6,
        solution: `# Class weight: 'denda' untuk salah klasifikasi kelas minoritas.\n# 1000 normal (skor 20-50), 20 fraud (skor 60-90).\nimport random\nrandom.seed(5)\nnormal = [random.gauss(35, 8) for _ in range(1000)]\nfraud  = [random.gauss(75, 8) for _ in range(20)]\n\n# TULIS KODEMU: ambang bergeser turun saat weight naik\ndef weighted_threshold(weight):\n    t = 60 - (weight - 1) * 0.35\n    tp = sum(1 for s in fraud if s > t)\n    fp = sum(1 for s in normal if s > t)\n    recall = tp / len(fraud) * 100\n    prec = tp / (tp + fp) * 100 if (tp + fp) else 0\n    return t, recall, prec\n\nprint(f"{'Weight':>6s} {'Ambang':>6s} {'Recall':>7s} {'Precision':>9s}")\nfor w in [1, 5, 10, 25, 50]:\n    t, r, p = weighted_threshold(w)\n    print(f"{w:6d} {t:6.1f} {r:6.1f}% {p:8.1f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "weighted_threshold", label: "`weighted_threshold` terdefinisi", msg: "Buat fungsi weighted_threshold(weight)." },
          { kind: "stdout_matches", task: "t2", pattern: "1\\s+60\\.0\\s+100\\.0%\\s+95\\.2%", label: "Baris weight=1 benar", msg: "Weight 1: ambang 60,0, recall 100%, precision 95,2%." },
          { kind: "stdout_matches", task: "t2", pattern: "50\\s+42\\.9\\s+100\\.0%\\s+11\\.8%", label: "Baris weight=50 benar", msg: "Weight 50: ambang 42,9, recall 100%, precision anjlok ke 11,8% — model paranoid." },
        ],
      },
      reference: "Mulai scale_pos_weight dari √rasio; weight = kenop trade-off recall–precision, bukan tombol ajaib.",
    },
    {
      id: "cost",
      eyebrow: "Langkah 4 · Cost-sensitive",
      title: "Berpikir dalam rupiah, bukan akurasi",
      prose: [
        "Level tertinggi: jangan optimasi metrik statistik — optimasi uang. Matriks biaya: FP (review sia-sia) = Rp25 rb; FN (fraud lolos) = Rp1,1 jt. Rasio 44:1 — \"lebih baik 44x salah menuduh daripada 1x meloloskan\". Untuk skor terkalibrasi, ambang optimal meminimalkan biaya ekspektasian: τ* = C_FP / (C_FP + C_FN) = 25.000/(25.000 + 1.100.000) = 0,022.",
        "Interpretasi: tahan transaksi jika peluang fraud > 2,2% — jauh di bawah 50%! Threshold optimal hampir tidak pernah 0,5 di fraud. Dan untuk transaksi Rp50rb (C_FN kecil), τ* naik → lebih permisif; untuk Rp50jt, τ* turun → lebih ketat. Inilah dasar threshold per-segmen nominal.",
      ],
      formula: String.raw`\tau^* = \frac{C_{FP}}{C_{FP} + C_{FN}}`,
      formulaNote: "Tahan jika P(fraud) > τ*. Dengan C_FP = Rp25rb dan C_FN = Rp1,1jt → τ* = 0,022.",
      tasks: [
        { id: "t1", text: "Implementasikan `total_cost(ambang)` → (biaya, FN, FP)" },
        { id: "t2", text: "Cari ambang termurah dari 0.3–0.8, cetak tabel + pemenang" },
      ],
      expected: "Ambang termurah: 0.5 (biaya Rp12.2 jt)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Threshold 0,5 adalah default yang netral.\" 0,5 hanya \"netral\" jika biaya FP = biaya FN — yang tidak pernah terjadi di fraud (rasio 40:1 ke atas). Threshold 0,5 bukan netral; ia adalah keputusan bisnis yang diambil tanpa sadar. Setiap threshold = pernyataan tentang biaya.",
      },
      hints: [
        "FN = fraud dengan skor < ambang; FP = normal dengan skor >= ambang.",
        "biaya = FN*COST_FN + FP*COST_FP.",
        "Simpan (biaya, ambang) terkecil selama loop.",
      ],
      code: {
        starter: `# Matriks biaya (Rp): FN jauh lebih mahal dari FP.\nCOST_FN = 1_100_000\nCOST_FP = 25_000\nimport random\nrandom.seed(9)\nskor_fraud = [random.gauss(0.75, 0.15) for _ in range(100)]\nskor_ok = [random.gauss(0.25, 0.15) for _ in range(4900)]\n\n# TULIS KODEMU: total biaya keputusan pada satu ambang\ndef total_cost(ambang):\n    fn =\n    fp =\n    return fn * COST_FN + fp * COST_FP, fn, fp\n\nprint(f"{'Ambang':>6s} {'FN':>4s} {'FP':>5s} {'Total biaya':>12s}")\nterbaik = None\nfor a in [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:\n    c, fn, fp = total_cost(a)\n    print(f"{a:6.1f} {fn:4d} {fp:5d} Rp{c/1e6:8.1f} jt")\n    if terbaik is None or c < terbaik[0]: terbaik = (c, a)\nprint(f"Ambang termurah: {terbaik[1]} (biaya Rp{terbaik[0]/1e6:.1f} jt)")`,
        lockLines: 7,
        solution: `# Matriks biaya (Rp): FN jauh lebih mahal dari FP.\nCOST_FN = 1_100_000\nCOST_FP = 25_000\nimport random\nrandom.seed(9)\nskor_fraud = [random.gauss(0.75, 0.15) for _ in range(100)]\nskor_ok = [random.gauss(0.25, 0.15) for _ in range(4900)]\n\n# TULIS KODEMU: total biaya keputusan pada satu ambang\ndef total_cost(ambang):\n    fn = sum(1 for s in skor_fraud if s < ambang)\n    fp = sum(1 for s in skor_ok if s >= ambang)\n    return fn * COST_FN + fp * COST_FP, fn, fp\n\nprint(f"{'Ambang':>6s} {'FN':>4s} {'FP':>5s} {'Total biaya':>12s}")\nterbaik = None\nfor a in [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:\n    c, fn, fp = total_cost(a)\n    print(f"{a:6.1f} {fn:4d} {fp:5d} Rp{c/1e6:8.1f} jt")\n    if terbaik is None or c < terbaik[0]: terbaik = (c, a)\nprint(f"Ambang termurah: {terbaik[1]} (biaya Rp{terbaik[0]/1e6:.1f} jt)")`,
        checks: [
          { kind: "defined", task: "t1", name: "total_cost", label: "`total_cost` terdefinisi", msg: "Buat fungsi total_cost(ambang)." },
          { kind: "stdout_matches", task: "t2", pattern: "0\\.5\\s+6\\s+225\\s+Rp\\s+12\\.2 jt", label: "Baris ambang 0.5 benar", msg: "Ambang 0,5: FN=6, FP=225, biaya Rp12,2 jt." },
          { kind: "stdout_matches", task: "t2", pattern: "Ambang termurah: 0\\.5", label: "Pemenang = ambang 0.5", msg: "Biaya minimum Rp12,2 jt ada di ambang 0,5." },
        ],
      },
      reference: "Class weight mengatur bagaimana model belajar; matriks biaya mengatur bagaimana keputusannya dipakai.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Konfigurasi untuk tiap situasi",
      prose: [
        "Satu: imbalance ekstrem (1:500+), label matang → XGBoost + scale_pos_weight ~√rasio + threshold dari biaya. Jangan mulai dari SMOTE. Dua: biaya FN >> FP (loss besar per kasus) → weight agresif + threshold rendah. Tiga: kapasitas investigator terbatas → threshold tinggi, weight moderat — precision rendah = investigator tenggelam = alert diabaikan = sistem mati. Empat: butuh penjelasan ke regulator/auditor → GBM + SHAP (bukan deep learning). Pohon + SHAP = \"ditahan karena velocity 12x + device baru\" — bahasa manusia.",
        "Kasus nyata bank digital (8 juta trx/bulan): sebelum model — 40 rule manual, precision 6%, 12.000 flag/hari, fraud loss Rp4,2 M/bulan. Sesudah GBM 28 fitur: precision 23%, flag 5.500/hari, recall 31%→58%, loss turun ke Rp2,6 M/bulan. Penghematan Rp1,6 M/bulan vs biaya tim+infra Rp180 jt → ROI 9x. Yang tidak terlihat: 3 bulan pertama investigator tidak percaya model — kepercayaan baru tumbuh setelah tim model bedah 10 contoh \"kenapa skor ini tinggi\" bersama mereka. Adopsi model = 50% teknis + 50% antropologi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model dengan AUC 0,99 pasti bagus.\" Di data imbalance 1:500, AUC-ROC 0,99 bisa berarti precision 5% — model \"hebat\" yang 19 dari 20 flag-nya salah. Selalu lihat PR-AUC dan precision@recall-operasional. AUC-ROC di fraud seperti nilai ujian tanpa melihat soalnya.",
      },
      reference: "GBM, LogReg, atau neural net? Selisih AUC biasanya < 1 poin — pilih yang tim-mu paling paham mengoperasikannya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Pilih konfigurasi untuk PayKu",
      prose: [
        "PayKu: 1 juta transaksi/bulan, 2.000 fraud (0,2%), rata-rata loss Rp1,1 jt. Tim: 5 investigator x 40 review/hari = 200 review/hari (~6.000/bulan). Biaya per review ≈ Rp25 rb. Kandidat (dari validasi): A (weight 10, thr 0,5): recall 55%, precision 30% → alert ±3.700/bln. B (weight 25, thr 0,35): recall 78%, precision 18% → alert ±8.700/bln. C (weight 25, thr 0,6): recall 62%, precision 35% → alert ±3.500/bln. Pilih A/B/C dengan perhitungan biaya total (Biaya = FNx1,1jt + FPx25rb).",
        "Hitung tiap opsi (fraud 2.000/bln). A: TP=1.100, FN=900 → Rp990 jt; FP=2.600 → Rp65 jt. Total Rp1.055 jt. Alert 3.700 ≤ 6.000 muat. B: TP=1.560, FN=440 → Rp484 jt; FP=7.140 → Rp178,5 jt. Total Rp662,5 jt — TAPI alert 8.700 > 6.000, kapasitas jebol (investigator akan mengabaikan alert → recall aktual anjlok). C: TP=1.240, FN=760 → Rp836 jt; FP=2.260 → Rp56,5 jt. Total Rp892,5 jt. Alert 3.500 ≤ 6.000 muat.",
        "Pilih C. B terlihat termurah di kertas tapi melanggar kendala kapasitas — dan kendala yang dilanggar = sistem yang mati di dunia nyata. Optimasi tanpa kendala = fiksi.",
      ],
      tasks: [],
      reference: "Optimasi dengan kendala kapasitas — konfigurasi termurah di kertas bisa mati di dunia nyata.",
    },
    {
      id: "tiga-strategi",
      eyebrow: "Langkah 7 · Head-to-head",
      title: "Class weight vs undersampling vs SMOTE — dengan angka",
      prose: [
        "Skenario yang sama untuk ketiganya, agar perbandingannya jujur: 1 juta transaksi/bulan, 3.000 fraud (0,3%), XGBoost, 28 fitur, validasi time-based split. Baseline tanpa penanganan imbalance: precision 12%, recall 41% — model malas yang hampir tidak berani menuduh. Sekarang tiga strateginya, masing-masing di-tuning wajar.",
        "Satu: class_weight = 18 (≈√rasio 333). Hasil: precision 24%, recall 63%. Model belajar bahwa satu fraud setara 18 transaksi normal — cukup untuk berani menuduh tanpa menjadi paranoid. Kelebihannya: tidak membuang data, tidak menciptakan data, distribusi training tetap dunia nyata. Kekurangannya: weight adalah kenop kasar — ia menggeser trade-off, bukan menambah informasi.",
        "Dua: undersampling mayoritas ke rasio 1:10 (3.000 fraud + 30.000 normal). Hasil: precision 19%, recall 71%. Recall tertinggi — karena model melihat dunia di mana fraud 10x lebih umum dari aslinya, ia menjadi agresif. Tetapi ada harga tersembunyi: 967.000 transaksi normal DIBUANG, termasuk justru contoh-contoh normal yang paling informatif (yang mirip fraud). Akibatnya varians tinggi — ganti seed sampling, hasilnya bergeser 3–5 poin. Di produksi ini berarti model yang \"kadang bagus\" tergantung undian sampling minggu itu.",
        "Tiga: SMOTE — interpolasi antar sampel fraud hingga rasio 1:10. Hasil: precision 21%, recall 66%. Di atas kertas rapi. Masalahnya seperti dibahas di kuis FR7: titik di antara dua serangan carding bukan serangan baru yang realistis — penipu tidak terdistribusi mulus di ruang fitur. Model menjadi percaya diri pada pola fiktif di daerah yang sebenarnya kosong. Validasi terlihat bagus karena lipatan validasi ikut \"dibohongi\" pola sintetis yang sama; produksi bertemu serangan asli yang tidak mirip interpolasi siapa pun.",
        "Ringkasan angkanya dalam satu baris: tanpa penanganan 12%/41%, class_weight 24%/63%, undersampling 19%/71%, SMOTE 21%/66% (precision/recall). Tidak ada pemenang mutlak — undersampling menang recall, class_weight menang precision dan stabilitas. Dan ingat: SEMUA angka ini diukur pada distribusi validasi yang benar (time split, tanpa SMOTE di lipatan validasi!). SMOTE yang bocor ke data validasi menghasilkan precision 35% yang fiktif — kesalahan evaluasi yang lebih berbahaya dari kesalahan strateginya.",
        "Satu catatan yang sering dilupakan: undersampling dan SMOTE mengubah KALIBRASI skor. Model yang dilatih pada dunia 1:10 mengeluarkan \"probabilitas\" yang 30x lebih tinggi dari realita — skor 0,6 darinya bukan berarti 60% peluang fraud. Jika skor dipakai untuk threshold biaya (FR7 langkah 4: τ* = C_FP/(C_FP+C_FN)), kalibrasi ulang wajib (Platt scaling / isotonic) sebelum threshold dihitung. Class_weight tidak merusak kalibrasi separah itu — satu lagi alasan ia menjadi default industri.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: imbalance bukan masalah statistik — melainkan masalah ekonomi",
        type: "risk",
        body: "Cara berpikir yang membedakan analis senior: ia tidak memilih strategi imbalance berdasarkan precision/recall tertinggi di tabel validasi, melainkan berdasarkan REZIM BIAYA tempat model itu akan hidup. Pertanyaan pertamanya selalu: \"kesalahan mana yang lebih mahal di sini, dan siapa yang membayarnya?\" Di rezim auto-block, false positive dibayar dengan kemarahan nasabah dan churn — mahal, terlihat, dan merusak merek; maka strategi yang dipilih adalah yang precision-nya paling stabil (class_weight + threshold tinggi), bukan yang recall-nya paling tinggi. Di rezim antrean investigator, false positive dibayar Rp25 ribu per review — murah dan terukur; maka recall boleh dikejar agresif (undersampling + threshold rendah). Kesalahan klasik junior adalah mengoptimasi F1 — metrik yang mengasumsikan FP dan FN sama mahalnya, padahal di fraud tidak pernah sama. F1 adalah jawaban untuk pertanyaan yang tidak ditanyakan siapa pun. Kedua, waspadai strategi yang \"menang\" di validasi karena mengubah soalnya: SMOTE dan undersampling yang bocor ke lipatan validasi tidak mengalahkan baseline — mereka mengganti ujian dengan yang lebih mudah, lalu merayakan kelulusan. Ketiga, ingat bahwa imbalance 0,3% berarti setiap 1 poin precision bernilai ratusan juta rupiah per bulan pada skala bank menengah — perdebatan strategi ini bukan akademis, ia adalah keputusan anggaran.",
      },
      reference: "Pilih strategi dari rezim biaya (auto-block vs antrean), bukan dari F1. Kalibrasi ulang skor setelah undersampling/SMOTE.",
    },
    {
      id: "rezim-biaya",
      eyebrow: "Langkah 8 · Rezim keputusan",
      title: "Kapan tiap strategi dipakai: auto-block vs antrean",
      prose: [
        "Dua rezim, dua dunia. Rezim auto-block: model menahan transaksi tanpa manusia — false positive berarti nasabah sah yang dananya ditahan, menelepon call center dengan marah, dan mungkin pindah bank. Rezim antrean: model mengurutkan kasus untuk investigator — false positive berarti satu baris antrean tambahan seharga Rp25 ribu review. Strategi imbalance yang tepat untuk keduanya BERBEDA, dan memakai strategi antrean di auto-block adalah cara cepat membakar kepercayaan nasabah.",
        "Untuk auto-block, pilih class_weight moderat + threshold tinggi. Alasannya: precision harus STABIL di atas 60–70%, dan stabilitas adalah kelemahan undersampling (varians antar seed 3–5 poin — model yang precision-nya \"kadang 65%, kadang 58%\" tidak boleh memegang tombol blokir). SMOTE dilarang keras di sini: kepercayaan diri model pada pola sintetis berarti ia akan memblokir nasabah nyata berdasarkan kemiripan dengan fraud IMAGINER. Aturan praktisnya: auto-block hanya untuk pola yang precision-nya terbukti >70% selama 3 bulan di data produksi, bukan di validasi.",
        "Untuk antrean investigator, undersampling boleh dipakai — bahkan sering optimal. Recall 71% vs 63% berarti 240 kasus fraud tambahan tertangkap per bulan (dari 3.000), dengan harga 8.700 vs 3.700 alert — dan antrean memang dirancang untuk menampung volume itu (ingat mini-case PayKu: kapasitas 6.000/bulan). Syaratnya: skor dikalibrasi ulang setelah sampling, dan threshold dihitung dari matriks biaya, bukan 0,5. SMOTE boleh dipakai untuk EKSPLORASI — memahami daerah fitur yang jarang — tetapi keputusan produksi tetap divalidasi pada distribusi asli.",
        "Ada rezim ketiga yang jarang dibahas: skor risiko pasif (tanpa tindakan langsung, hanya enrich data untuk analis). Di sini recall ekstrem boleh dikejar — undersampling agresif 1:3, threshold rendah — karena false positive-nya tidak menahan uang siapa pun, hanya menambah konteks di dashboard analis. Satu model, tiga threshold, tiga strategi sampling: arsitektur yang dewasa bukan satu model untuk semua, melainkan satu model yang perilakunya disetel per rezim.",
        "Biaya salah menempatkan strategi: undersampling di auto-block — precision amblas 58%, 4 dari 10 nasabah yang diblokir protes, viral di media sosial, tim fraud dipanggil direksi; kerugian reputasi tak terhitung. Class_weight konservatif di antrean — 240 fraud/bulan lolos yang sebenarnya bisa ditangkap Rp25 ribu per review; Rp264 juta/bulan loss yang \"dihemat\" dari biaya review Rp6 juta. Setiap strategi benar di rezimnya, bencana di rezim tetangga.",
      ],
      tasks: [],
      reference: "Auto-block: class_weight + threshold tinggi, precision >70% stabil 3 bulan. Antrean: undersampling + kalibrasi + threshold biaya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Gradient boosting (XGBoost/LightGBM) = raja tabel fraud: no scaling, interaksi otomatis, robust missing, explainable.",
        "Imbalance 1:500 → model malas, metrik menipu, validasi berisik (stratified!).",
        "Class weight: mulai dari √rasio; weight = kenop trade-off recall–precision, bukan tombol ajaib.",
        "Cost-sensitive: τ* = C_FP/(C_FP+C_FN) — threshold optimal = ambang termurah, bukan 0,5.",
        "Optimasi dengan kendala kapasitas — konfigurasi termurah di kertas bisa mati di dunia nyata.",
      ],
      next: { label: "FR8 — Unsupervised", href: "/v2/learn/fr8-unsupervised" },
      quiz: [
        {
          q: "Data 2 juta transaksi, 4.000 fraud. Nilai awal scale_pos_weight yang masuk akal?",
          options: [
            { text: "1 (default)", why: "Default = model malas: ia menganggap fraud tidak penting." },
            { text: "499 (rasio penuh)", why: "Rasio penuh membuat model paranoid total — precision hancur." },
            { text: "≈22 (√rasio) — titik awal, lalu naikkan sampai biaya total berhenti turun", why: "√499 ≈ 22. Titik awal empiris yang sering dekat optimal.", correct: true },
            { text: "0", why: "Weight 0 = fraud diabaikan total — kebalikan dari yang diinginkan." },
          ],
        },
        {
          q: "Mengapa SMOTE berisiko untuk data fraud?",
          options: [
            { text: "Terlalu lambat", why: "Kecepatan bukan masalah utamanya." },
            { text: "'Fraud sintetis' hasil interpolasi sering bukan serangan realistis — model percaya diri pada pola fiktif", why: "Titik di antara dua serangan ≠ serangan baru yang masuk akal. Penipu tidak terdistribusi mulus di ruang fitur. Class weight + threshold lebih aman.", correct: true },
            { text: "Tidak bisa dipakai dengan XGBoost", why: "Bisa dipakai secara teknis — masalahnya konseptual." },
            { text: "Melanggar privasi", why: "Tidak ada kaitannya dengan privasi." },
          ],
        },
        {
          q: "C_FN = Rp1,1 jt, C_FP = Rp25 rb (rasio 44:1). Implikasi untuk threshold?",
          options: [
            { text: "Tetap 0,5 — netral", why: "0,5 hanya 'netral' jika biaya seimbang — di fraud tidak pernah seimbang." },
            { text: "Threshold rendah (agresif) — lebih baik 44x salah menuduh daripada 1x meloloskan", why: "Tiap threshold adalah pernyataan tentang biaya. τ* = 0,022 — tahan jika peluang fraud > 2,2%.", correct: true },
            { text: "Threshold 0,9 — hemat investigator", why: "0,9 = sangat permisif — fraud Rp1,1 jt lolos demi hemat Rp25 rb review. Salah arah." },
            { text: "Tidak butuh threshold", why: "Skor tanpa threshold = tidak ada keputusan." },
          ],
        },
        {
          q: "Setelah menambah 1 fitur pakar AUC naik 0,04; setelah tuning 3 hari naik 0,005. Pelajaran?",
          options: [
            { text: "Tuning tidak berguna", why: "Tuning berguna — hanya ROI-nya kecil dibanding fitur." },
            { text: "Urutan investasi: fitur > weight > tuning. Satu sudut pandang baru mengalahkan optimasi hyperparameter", why: "Waktu analis paling berharga dipakai mencari sinyal baru, bukan grid search buta.", correct: true },
            { text: "Fitur tidak penting", why: "Justru fitur yang memberi kenaikan terbesar di sini." },
            { text: "AUC tidak penting", why: "AUC tetap berguna sebagai pembanding — hanya bukan satu-satunya." },
          ],
        },
        {
          q: "Kapan gradient boosting LEBIH tepat daripada deep learning untuk fraud?",
          options: [
            { text: "Tidak pernah", why: "GBM adalah standar industri fraud tabular — 'tidak pernah' salah total." },
            { text: "Data tabular heterogen + butuh explainability ke auditor + data tidak masif — GBM menang di ketiganya", why: "Tidak butuh scaling, menemukan interaksi otomatis, robust missing, feature importance bawaan, dan bisa dijelaskan (SHAP).", correct: true },
            { text: "Hanya jika datanya kecil", why: "GBM dipakai di data raksasa juga — bukan soal ukuran." },
            { text: "Hanya jika tidak ada GPU", why: "Bukan soal hardware — soal struktur data dan explainability." },
          ],
        },
      ],
    },
  ],
};

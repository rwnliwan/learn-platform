import type { V2Lesson } from "../lib/types";

export const a315: V2Lesson = {
  slug: "a315-tree-boosting",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.15 Tree, Forest & Boosting: Senjata Pamungkas Data Tabular",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-selisi-auc",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "0,82 vs 0,91: selisih Rp miliaran",
      prose: [
        "Benchmark publik model credit scoring: regresi logistik AUC 0,82-0,85, random forest 0,86-0,89, gradient boosting/XGBoost 0,88-0,91. Cuma 6-9 poin AUC — kedengarannya kecil, sampai dihitung rupiahnya: di portofolio Rp10 triliun, tiap 1 poin AUC setara puluhan miliar penghematan kerugian dari seleksi risiko yang lebih tajam.",
        "Itulah mengapa lowongan senior risk model validation analyst di bank global menulis syarat eksplisit: hands-on experience with gradient boosting models — bukan nilai plus, tapi required. Tree ensemble bukan lagi ML modern yang keren; ia skill wajib analis risiko.",
        "Twist-nya: model yang sama persis ini ditolak regulator jika tidak bisa dijelaskan dan tidak tervalidasi. Kekuatan tanpa kendali = liabilitas. Lesson ini: kuasai senjatanya, dengan disiplin yang sudah kamu pelajari.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model kuat tanpa explainability dan validasi adalah liabilitas regulasi. Penguasaan teknis harus berjalan dengan disiplin validasi — keduanya required, bukan salah satu.",
      },
      reference: "Tiap 1 poin AUC di portofolio besar = rupiah yang material. Hitung dulu, baru pilih.",
    },
    {
      id: "lab-stump",
      eyebrow: "Langkah 2 · Lab: decision stump",
      title: "Satu split terbaik dengan Gini",
      prose: [
        "Decision tree memilih split yang meminimalkan Gini impurity tertimbang: pecah data di threshold skor, hitung Gini tiap sisi, rata-ratakan berbobot ukuran. Threshold terbaik = Gini terkecil.",
        "Data di bawah: 600 nasabah, PD turun terhadap skor (nonlinear). Tugasmu menulis loop pencarian threshold 350 sampai 750 dan mengukur gain = Gini parent dikurangi Gini split.",
        "Satu split hanyalah awal: tree dalam = ulangi rekursif di tiap anak. Makin dalam makin hafal (variance naik) — itulah mengapa single tree dalam = overfit, dan butuh ensemble.",
      ],
      tasks: [
        { id: "t1", text: "Tulis loop pencarian `thr` dengan Gini tertimbang terkecil" },
        { id: "t2", text: "Hitung `gain` dan cetak `thr` + `gain`" },
      ],
      expected: "thr=550 gain=0.2338",
      note: {
        title: "Sering salah",
        body: "Membiarkan tree tumbuh tanpa batas lalu heran kenapa overfit. Batasi min sampel per daun atau max depth — itu regularisasi versi tree.",
      },
      hints: [
        "Untuk tiap thr: L = y[skor<thr], R = y[skor>=thr].",
        "Gini tertimbang = (n_L*gini(L) + n_R*gini(R)) / n.",
        "Simpan (g, thr) terkecil ke best.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(131)\nn = 600\nskor = [random.uniform(300, 800) for _ in range(n)]\n# kebenaran: PD turun terhadap skor (nonlinear)\ny = [1 if random.random() < 1/(1+math.exp((s-550)/60)) else 0 for s in skor]\n\ndef gini(ys):\n    if not ys: return 0\n    p = sum(ys)/len(ys)\n    return 2*p*(1-p)\n\ng_parent = gini(y)\n# TULIS KODEMU: cari threshold 350..750 (step 10) dgn Gini tertimbang min\nbest = (1e9, None)\n\n\ng_split, thr = best\ngain = g_parent - g_split\nprint(f"thr={thr} gain={gain:.4f}")`,
        lockLines: 12,
        solution: `import random, math\nrandom.seed(131)\nn = 600\nskor = [random.uniform(300, 800) for _ in range(n)]\n# kebenaran: PD turun terhadap skor (nonlinear)\ny = [1 if random.random() < 1/(1+math.exp((s-550)/60)) else 0 for s in skor]\n\ndef gini(ys):\n    if not ys: return 0\n    p = sum(ys)/len(ys)\n    return 2*p*(1-p)\n\ng_parent = gini(y)\n# TULIS KODEMU: cari threshold 350..750 (step 10) dgn Gini tertimbang min\nbest = (1e9, None)\nfor thr_ in range(350, 751, 10):\n    L = [v for s, v in zip(skor, y) if s < thr_]\n    R = [v for s, v in zip(skor, y) if s >= thr_]\n    if not L or not R: continue\n    g = (len(L)*gini(L) + len(R)*gini(R))/n\n    if g < best[0]: best = (g, thr_)\n\ng_split, thr = best\ngain = g_parent - g_split\nprint(f"thr={thr} gain={gain:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "thr", value: 550, tol: 1e-9, label: "`thr` seharusnya 550", msg: "Split terbaik di sekitar titik balik kurva PD (550). Cek rentang loop-nya." },
          { kind: "equal", task: "t2", name: "gain", value: 0.2338, tol: 0.002, label: "`gain` sekitar 0.2338", msg: "0,5000 - 0,2661 = 0,2338. Cek rumus Gini tertimbang." },
          { kind: "stdout_matches", task: "t2", pattern: "thr=550\\s+gain=0\\.2338", label: "`print` menampilkan split terbaik", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Gini = 2*p*(1-p). Gain = Gini parent - Gini split tertimbang.",
    },
    {
      id: "random-forest",
      eyebrow: "Langkah 3 · Random forest",
      title: "Rata-rata banyak tree yang beragam",
      prose: [
        "Random forest = bagging + dekorelasi. Bagging: latih tree dalam di bootstrap sample, rata-ratakan prediksinya. Variance rata-rata = rho x sigma2 + (1-rho) x sigma2 / B. Suku kedua menyusut dengan B — tapi suku pertama tidak.",
        "Rahasia sebenarnya adalah dekorelasi via acak subset fitur per split. Tanpa ini, pohon-pohon terlalu mirip (rho tinggi) dan rata-rata tidak membantu. Feature subsampling memaksa diversitas — itulah yang membuat 1/B bekerja.",
        "Konsekuensi: menambah pohon tidak menambah overfit di RF — hanya menstabilkan rata-rata. Overfit datang dari pohon yang terlalu dalam. Ini khusus forest; untuk boosting, n_estimators besar tanpa early stopping = overfit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var50` = variance rata-rata 50 tree" },
        { id: "t2", text: "Hitung `var5` = variance rata-rata 5 tree, lalu `print`" },
      ],
      expected: "var50=0.412 var5=0.520",
      note: {
        title: "Sering salah",
        body: "Mengira rahasia RF adalah jumlah pohon yang banyak. Tanpa dekorelasi fitur, 500 pohon yang hampir identik = 1 pohon yang mahal.",
      },
      hints: [
        "Rumus: var = rho*s2 + (1-rho)*s2/B.",
        "rho=0,4, s2=1,0. Ganti B saja.",
        "var50 = rho*s2 + (1-rho)*s2/50",
      ],
      code: {
        starter: `# Variance rata-rata B tree: rho*s2 + (1-rho)*s2/B\nrho, s2 = 0.4, 1.0\n\n# TULIS KODEMU\nvar50 = \nvar5 = \n\nprint(f"var50={var50:.3f} var5={var5:.3f}")`,
        lockLines: 2,
        solution: `# Variance rata-rata B tree: rho*s2 + (1-rho)*s2/B\nrho, s2 = 0.4, 1.0\n\n# TULIS KODEMU\nvar50 = rho*s2 + (1-rho)*s2/50\nvar5 = rho*s2 + (1-rho)*s2/5\n\nprint(f"var50={var50:.3f} var5={var5:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var50", value: 0.412, tol: 0.002, label: "`var50` seharusnya 0.412", msg: "0,4 + 0,6/50 = 0,412. Cek pembagi B-nya." },
          { kind: "equal", task: "t2", name: "var5", value: 0.520, tol: 0.002, label: "`var5` seharusnya 0.520", msg: "0,4 + 0,6/5 = 0,52. Suku rho tidak bisa dihilangkan dengan B." },
          { kind: "stdout_matches", task: "t2", pattern: "var50=0\\.412\\s+var5=0\\.520", label: "`print` menampilkan kedua variance", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Besar B hanya mengecilkan suku (1-rho)/B. Dekorelasi menurunkan rho.",
    },
    {
      id: "boosting",
      eyebrow: "Langkah 4 · Boosting",
      title: "Belajar bertahap dari kesalahan",
      prose: [
        "Boosting membangun pohon sekuensial: tiap pohon baru mengoreksi residual pendahulunya. Pola yang umumnya lebih baik: learning rate kecil + banyak pohon + early stopping — koreksi kecil berulang mengalahkan koreksi besar sedikit, analog dengan langkah kecil banyak langkah di optimasi.",
        "Tapi boosting overconfident: probabilitasnya tidak jujur. XGBoost AUC 0,90 dengan ECE 0,05 berarti rata-rata meleset 5 poin — untuk pricing itu mahal. Latih untuk ranking, kalibrasi ulang (Platt atau isotonic) untuk angka, di data terpisah — bukan data latih.",
        "Feature importance (gain) adalah alat debugging: jika ID nasabah ada di top-3, itu red flag — ID berkardinalitas tinggi bisa menghafal target (leakage sempurna). Gain bias ke fitur kardinalitas tinggi; anomali di top list = investigasi dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai probabilitas mentah boosting untuk pricing tanpa kalibrasi ulang. AUC mengukur ranking; ECE mengukur kejujuran angka. Keduanya dibutuhkan untuk pricing.",
      },
      reference: "lr kecil + banyak pohon + early stopping. Kalibrasi ulang di data terpisah.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Random forest dengan 500 pohon vs 100 pohon — mana yang lebih overfit?",
          options: [
            { text: "500 — makin banyak makin hafal", why: "Salah. Itu intuisi boosting, bukan forest." },
            { text: "Sama saja — menambah pohon tidak menambah overfit di RF, hanya menstabilkan rata-rata", why: "Benar. Overfit datang dari pohon yang terlalu dalam, bukan jumlah pohon.", correct: true },
            { text: "100 — lebih sedikit lebih aman", why: "Salah. Lebih sedikit pohon = rata-rata lebih berisik." },
            { text: "Tergantung seed", why: "Salah. Seed tidak menentukan overfit." },
          ],
        },
        {
          q: "Boosting: learning rate 0,5 dengan 50 pohon vs 0,05 dengan 500 pohon (early stopping). Mana umumnya lebih baik?",
          options: [
            { text: "0,5/50 — lebih cepat training", why: "Salah. Cepat bukan berarti lebih baik." },
            { text: "0,05/500 — kecil + banyak = belajar bertahap yang stabil", why: "Benar. Shrinkage: koreksi kecil berulang mengalahkan koreksi besar sedikit.", correct: true },
            { text: "Sama saja", why: "Salah. Dinamika belajarnya berbeda." },
            { text: "Tergantung data saja", why: "Salah. Pola shrinkage cukup universal di gradient boosting." },
          ],
        },
      ],
      reference: "RF: B besar = stabil, bukan overfit. Boosting: kecil + banyak + early stopping.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan pakai yang mana",
      prose: [
        "Satu, butuh aturan yang bisa dibaca manusia (operasional atau regulasi sederhana): single decision tree depth 3-4 — terima akurasinya sebagai harga interpretabilitas. Dua, butuh akurasi kuat dengan tuning minimal dan risiko overfit rendah: random forest — tambah pohon sampai stabil.",
        "Tiga, butuh akurasi maksimum di data tabular dan siap tuning + validasi ketat: gradient boosting/XGBoost — learning rate kecil, early stopping, kalibrasi ulang untuk probabilitas. Empat, butuh interpretabilitas penuh untuk keputusan teregulasi: regresi logistik + WoE — boosting hanya jika selisih AUC-nya material dalam rupiah.",
        "Aturan 10 detik: tree untuk aturan baca-manusia, forest untuk aman-cepat, boosting untuk maksimal-dengan-disiplin, logistik untuk teregulasi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ensemble adalah komite, bukan orang pintar",
        body: "Ensemble bekerja seperti komite: forest = voting banyak anggota yang bodoh tapi beragam — keragaman mengalahkan kecerdasan seragam; boosting = satu murid yang belajar dari kesalahannya berulang-ulang. Tiga heuristik. Pertama: ensemble adalah obat variance, bukan obat bias — kecuali boosting yang juga bisa menurunkan bias. Bila single tree-mu sudah bagus, ensemble memberi sedikit; bila single tree-mu liar, ensemble menjinakkan. Kedua: urutan tuning tidak bisa dibolak-balik. Forest: tambah pohon sampai error stabil, baru atur depth. Boosting: learning rate kecil dulu, baru tambah pohon dengan early stopping — kebalikannya (banyak pohon + learning rate besar) = hafalan cepat. Ketiga: jangan pernah percaya feature importance tanpa curiga. Ia mengukur apa yang dipakai model, bukan apa yang benar di dunia — gain bias ke fitur kardinalitas tinggi, dan ID di top-3 adalah red flag leakage. Aturan praktis: boosting + data kecil + noise = hafalan yang mahal. Di n kecil, random forest atau bahkan logistik sering menang — kecanggihan butuh data untuk membayar harganya.",
      },
      reference: "Aturan -> tree. Aman -> forest. Maksimal -> boosting. Teregulasi -> logistik.",
    },
    {
      id: "mini-case-duel",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Duel logistik vs XGBoost",
      prose: [
        "Kamu membangun model PD KTA (n = 80.000, 40 fitur). Validasi OOT: logistik + WoE AUC 0,83, ECE 0,012, training 2 menit, fully interpretable. XGBoost (tuned, early stopping) AUC 0,875, ECE 0,041, training 40 menit, butuh SHAP. Portofolio Rp4 triliun; tiap 1 poin AUC = Rp18 M per tahun penghematan seleksi.",
        "Pilih XGBoost: selisih 4,5 poin AUC x Rp18 M = Rp81 M per tahun. Ini material — kompleksitas membayar dirinya jauh. Bandingkan dengan patokan umum: selisih 0,3 poin = tolak karena tidak material setelah dihitung rupiah.",
        "Checklist sebelum XGBoost go-live: kalibrasi ulang (ECE 0,041 ke target di bawah 0,015) di data OOT terpisah — XGBoost overconfident; SHAP global untuk memastikan pendorongnya faktor risiko yang masuk akal (bukan leakage); audit fairness per wilayah dan gender; PSI baseline plus monitoring kuartalan; dokumentasi SR 11-7 plus challenger (logistik sebagai benchmark permanen). Tetap pilih logistik jika regulator menolak black-box untuk segmen ini, tim tidak mampu maintain pipeline-nya, atau selisih AUC ternyata tidak material setelah dihitung rupiah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan model adalah keputusan bisnis: Rp81 M per tahun membenarkan kompleksitas, tapi hanya jika checklist validasi (kalibrasi, SHAP, fairness, monitoring, dokumentasi) ikut dikerjakan.",
      },
      reference: "Materialitas rupiah dulu, checklist validasi menyusul, dokumentasi menutup.",
    },
    {
      id: "pendalaman-gbm-math",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Gradient boosting: matematika, XGBoost/LightGBM & urutan tuning",
      prose: [
        "Gradient boosting adalah gradient descent di ruang fungsi. Model dibangun aditif: F_m(x) = F_{m-1}(x) + nu x h_m(x), dengan h_m di-fit ke negative gradient dari loss terhadap prediksi saat ini. Untuk squared error, negative gradient = residual biasa — itulah mengapa boosting regresi terlihat seperti fit residual berulang. Untuk log-loss (klasifikasi), targetnya adalah residual yang diboboti probabilitas. Shrinkage nu (learning rate) adalah ukuran langkah: kecil berarti belajar lambat tapi stabil.",
        "XGBoost menaikkan level: ia memakai turunan KEDUA (metode Newton — langkah lebih cerdas dari gradient biasa) plus regularisasi eksplisit Omega = gamma x T + lambda/2 x ||w||^2 — penalti jumlah daun dan besar bobot daun. Inilah mengapa XGBoost lebih disiplin dari GBM klasik: kompleksitas pohon dihukum langsung di fungsi objektif, bukan cuma via early stopping. LightGBM menempuh jalur berbeda: histogram binning (fitur dikelompokkan jadi bin — jauh lebih cepat dan hemat memori), GOSS (fokus komputasi pada sampel bergradien besar, sampel mudah di-downsample), dan EFB (menggabungkan fitur yang jarang aktif bersamaan). Hasilnya: untuk data besar dengan fitur banyak, LightGBM sering 5-10x lebih cepat dengan akurasi setara.",
        "Bias-variance untuk ensemble — pahami perbedaannya. Bagging/random forest: menurunkan variance TANPA menaikkan bias (pohon dalam = bias rendah, variance tinggi; rata-rata menjinakkan variance). Boosting: menurunkan bias (tiap pohon mengoreksi sisa kesalahan) TAPI bisa menaikkan variance bila pohon terlalu banyak — itulah peran early stopping dan shrinkage. Konsekuensi praktis: RF hampir tidak bisa overfit karena tambah pohon; boosting BISA overfit karena tambah pohon — dua perilaku berlawanan yang sering tertukar.",
        "Urutan tuning level senior — jangan grid search buta. Satu: tetapkan learning rate kecil (0,05-0,1) + early stopping di validasi; ini fondasi. Dua: atur kompleksitas pohon (max_depth, min_child_weight) — dari dangkal ke dalam sampai validasi berhenti membaik. Tiga: regularisasi stokastik (subsample baris, colsample fitur < 1.0) — dekorelasi ala forest di dalam boosting. Empat: lambda/alpha XGBoost untuk penalti bobot. Aturan berhenti: bila langkah 2-4 tidak memberi perbaikan material di validasi OOT, kembalikan ke konfigurasi sederhana — tuning yang tidak membayar dirinya adalah overfitting proses.",
      ],
      formula: String.raw`F_m(x) = F_{m-1}(x) + \nu \cdot h_m(x), \qquad \Omega = \gamma T + \frac{\lambda}{2}\lVert w \rVert^2`,
      formulaNote: "F_m = model setelah m pohon; nu = learning rate (shrinkage, ukuran langkah); h_m = pohon ke-m yang di-fit ke negative gradient loss. Omega = regularisasi XGBoost: T = jumlah daun, w = bobot tiap daun; gamma menghukum penambahan daun, lambda mengecilkan bobot daun.",
      tasks: [],
      reference: "GBM = gradient descent di ruang fungsi. XGBoost = Newton + regularisasi eksplisit. LightGBM = histogram + GOSS + EFB.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Tree memilih split via Gini; tree dalam = overfit. Batasi depth/sampel daun sebagai regularisasi.",
        "Random forest = bagging + dekorelasi fitur. Tambah pohon tidak menambah overfit.",
        "Boosting: learning rate kecil + banyak pohon + early stopping. Overconfident — kalibrasi ulang untuk pricing.",
        "Feature importance = alat debugging; ID di top-3 = red flag leakage.",
        "Pilih model berdasar materialitas rupiah + disiplin validasi, bukan fanatisme algoritma.",
      ],
      next: { label: "A3.2 — Diagnostik Regresi", href: "/learn/a32-diagnostik-regresi" },
      quiz: [
        {
          q: "Apa rahasia random forest yang sebenarnya menurunkan variance?",
          options: [
            { text: "Jumlah pohon yang banyak", why: "Salah. Itu menstabilkan, bukan menurunkan suku rho." },
            { text: "Bootstrap saja", why: "Salah. Bagging tanpa dekorelasi kurang efektif." },
            { text: "Dekorelasi via acak subset fitur per split — pohon yang beragam membuat rata-rata efektif", why: "Benar. Tanpa ini pohon-pohon terlalu mirip dan variance tetap.", correct: true },
            { text: "Depth tak terbatas", why: "Salah. Itu justru sumber overfit tiap pohon." },
          ],
        },
        {
          q: "Feature importance (gain) menempatkan ID nasabah di top-3. Tindakan?",
          options: [
            { text: "Pertahankan — model tahu yang terbaik", why: "Salah. Itu bukan pengetahuan, itu hafalan." },
            { text: "Red flag: ID = leakage/noise berkardinalitas tinggi. Investigasi, kemungkinan besar buang", why: "Benar. ID unik bisa menghafal target — leakage sempurna.", correct: true },
            { text: "Naikkan max_depth", why: "Salah. Itu memperparah hafalan." },
            { text: "Tambah jumlah pohon", why: "Salah. Tidak menyelesaikan masalah fitur." },
          ],
        },
        {
          q: "XGBoost AUC 0,90 tapi ECE 0,05. Untuk pricing, apa yang kurang?",
          options: [
            { text: "Tidak ada — AUC tinggi cukup", why: "Salah. AUC = ranking; pricing butuh angka jujur." },
            { text: "Kalibrasi ulang. Boosting overconfident — latih untuk ranking, kalibrasi untuk angka, di data terpisah", why: "Benar. Meleset 5 poin rata-rata itu mahal untuk pricing.", correct: true },
            { text: "Tambah max_depth", why: "Salah. Tidak memperbaiki kalibrasi." },
            { text: "Kurangi learning rate", why: "Salah. Itu soal training, bukan kejujuran probabilitas." },
          ],
        },
        {
          q: "Kapan single decision tree (bukan ensemble) adalah pilihan tepat?",
          options: [
            { text: "Tidak pernah — selalu ensemble", why: "Salah. Ada satu keunggulan tree tunggal." },
            { text: "Saat butuh aturan yang bisa dibaca manusia — batasi depth 3-4, terima akurasinya sebagai harga interpretabilitas", why: "Benar. Untuk aturan operasional atau komunikasi non-teknis, pohon dangkal tak tergantikan.", correct: true },
            { text: "Untuk data besar", why: "Salah. Data besar justru butuh ensemble yang stabil." },
            { text: "Untuk probabilitas terkalibrasi", why: "Salah. Tree tunggal probabilitasnya kasar." },
          ],
        },
        {
          q: "Gradient boosting untuk regresi (squared error): pohon ke-m di-fit ke target apa?",
          options: [
            { text: "Data asli y", why: "Salah. Itu yang dilakukan pohon pertama saja." },
            { text: "Residual (negative gradient) dari model F_{m-1} — tiap pohon mengoreksi sisa kesalahan pendahulunya", why: "Benar. Inilah arti gradient descent di ruang fungsi.", correct: true },
            { text: "Sampel bootstrap acak", why: "Salah. Itu bagging, bukan boosting." },
            { text: "Fitur yang belum dipakai", why: "Salah. Tidak ada konsep seperti itu di boosting." },
          ],
        },
        {
          q: "Apa pembeda utama XGBoost dibanding gradient boosting klasik?",
          options: [
            { text: "Memakai lebih banyak pohon", why: "Salah. Jumlah pohon bukan pembeda arsitektur." },
            { text: "Turunan kedua (Newton) + regularisasi eksplisit gamma/lambda yang menghukum kompleksitas pohon langsung di objektif", why: "Benar. GBM klasik hanya mengandalkan early stopping dan shrinkage.", correct: true },
            { text: "Tidak butuh tuning", why: "Salah. XGBoost justru punya lebih banyak hyperparameter." },
            { text: "Hanya untuk klasifikasi", why: "Salah. Berlaku untuk regresi juga." },
          ],
        },
        {
          q: "Boosting 2000 pohon tanpa early stopping: error validasi turun sampai pohon 300 lalu naik. Diagnosis dan obat?",
          options: [
            { text: "Underfit — tambah max_depth", why: "Salah. Error validasi NAIK = overfit, bukan underfit." },
            { text: "Overfit variance dari terlalu banyak pohon. Obat: early stopping + learning rate lebih kecil (bukan n_estimators besar mentah)", why: "Benar. Beda dengan RF: di boosting, tambah pohon BISA menambah overfit.", correct: true },
            { text: "Normal — abaikan kenaikan", why: "Salah. Kenaikan error validasi adalah sinyal berhenti." },
            { text: "Ganti ke random forest", why: "Salah. Belum tentu; perbaiki dulu disiplin training-nya." },
          ],
        },
      ],
    },
  ],
};

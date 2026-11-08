import type { V2Lesson } from "../lib/types";

export const a30: V2Lesson = {
  slug: "a30-alur-modeling",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.0 Alur Kerja Modeling: Peta Sebelum Masuk Hutan Model",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-model-tak-terpakai",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model terbaik yang tidak pernah dipakai",
      prose: [
        "Data scientist baru di sebuah bank menghabiskan 3 bulan membangun model PD dengan arsitektur canggih. Akurasi validasi: 91 persen, terbaik yang pernah ada di timnya. Lalu kepala risiko bertanya tiga hal: apakah fitur-fiturnya tersedia saat pengajuan atau baru tersedia setelahnya, apakah model ini dipakai untuk ranking atau pricing, dan bagaimana kita tahu ia masih valid 6 bulan lagi.",
        "Sunyi. Fitur riwayat tunggakan 12 bulan ternyata dihitung setelah periode prediksi (leakage). Tidak ada yang menetapkan apakah outputnya dipakai untuk ranking atau pricing. Tidak ada rencana monitoring. Model 91 persen itu tidak pernah dipakai — bukan karena matematikanya salah, tapi karena alur kerjanya salah sejak langkah pertama.",
        "Lesson ini adalah peta untuk seluruh track A3: tujuh tahap dari masalah bisnis sampai monitoring, tiga peran data yang tidak boleh tertukar, dan standar kejujuran sebelum kamu mengklaim modelmu bagus.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Leakage adalah risiko model paling mahal di perbankan: fitur yang mengandung informasi masa depan membuat validasi terlihat sempurna, lalu model runtuh di produksi. Regulator menanyakan ini duluan.",
      },
      reference: "Tulis sebelum coding: target apa, keputusan apa yang berubah, kapan dipakai.",
    },
    {
      id: "tujuh-tahap",
      eyebrow: "Langkah 2 · Peta tujuh tahap",
      title: "Tujuh tahap, dan 80 persen waktu habis di luar training",
      prose: [
        "Satu, masalah bisnis menjadi pertanyaan model. Kurangi kerugian kredit bukan pertanyaan model; estimasi PD 12-bulan tiap pengajuan untuk pricing baru bisa dimodelkan. Dua, kumpulkan dan audit data: grain, missing, outlier, dan perangko waktu tiap fitur. Tiga, rekayasa fitur: fitur adalah mata uang modeling — model sederhana dengan fitur bagus mengalahkan model canggih dengan fitur buruk.",
        "Empat, latih kandidat mulai dari baseline sederhana, naik kompleksitas hanya jika terbukti lebih baik. Lima, validasi jujur: metrik yang tepat, kalibrasi, uji out-of-time, audit leakage, model pembanding. Enam, deploy: pipeline reproducible, versi tercatat, shadow mode dulu bila berisiko. Tujuh, monitor: drift, backtesting, ambang retraining. Model adalah aset yang meluruh, bukan artefak sekali jadi.",
        "Proporsi waktu nyata: tahap 1 sampai 3 dan 5 sampai 7 memakan sekitar 80 persen waktu. Training model hanyalah bagian kecil di tengah. Kegagalan terbesar justru di tahap 1 (pertanyaan salah), 2 (leakage), dan 7 (tidak dimonitor) — bukan di algoritma.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Langsung melatih model sebelum pertanyaan bisnisnya tajam. Tujuh pertanyaan pembuka: keputusan apa yang berubah, kapan tiap fitur tersedia, fitur apa yang belum ada, apakah baseline sudah dikalahkan, bagaimana model ini bisa berbohong, bisakah direproduksi, kapan kita tahu ia rusak.",
      },
      reference: "Fitur > algoritma. Pertanyaan dulu, mesin kemudian.",
    },
    {
      id: "tiga-peran-data",
      eyebrow: "Langkah 3 · Train, validation, test",
      title: "Tiga peran data yang tidak boleh tertukar",
      prose: [
        "Train (60 sampai 70 persen) dipakai untuk belajar: fitting parameter, model boleh menghafal di sini. Validation (15 sampai 20 persen) dipakai untuk memilih: bandingkan model dan tuning hyperparameter. Test (15 sampai 20 persen) dipakai untuk penilaian akhir: sekali saja, di akhir, setelah semua keputusan dikunci.",
        "Alur informasi hanya boleh mengalir satu arah: train ke validation ke test. Begitu hasil test memengaruhi keputusanmu (skor jelek, lalu tuning lagi), test set terkontaminasi — ia sudah menjadi validation kedua dan angka akhirnya tidak jujur lagi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_train` (60 persen dari `n`)" },
        { id: "t2", text: "Hitung `n_val` dan `n_test` (20 persen tiap, sisanya ke test)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "train=600 val=200 test=200",
      note: {
        title: "Sering salah",
        body: "Memakai test set berkali-kali asal tidak untuk training. Setiap kamu melihat skor test lalu mengubah sesuatu, informasi test bocor ke keputusanmu — itu test-set overfitting, bentuk p-hacking.",
      },
      hints: [
        "60 persen dari 1000 = 600. Kalikan lalu ubah ke integer.",
        "n_test = n - n_train - n_val agar totalnya pas.",
        "n_train = int(0.6 * n)",
      ],
      code: {
        starter: `n = 1000\n\n# TULIS KODEMU: bagi data 60/20/20\nn_train = \nn_val = \nn_test = \n\nprint(f"train={n_train} val={n_val} test={n_test}")`,
        lockLines: 1,
        solution: `n = 1000\n\n# TULIS KODEMU: bagi data 60/20/20\nn_train = int(0.6 * n)\nn_val = int(0.2 * n)\nn_test = n - n_train - n_val\n\nprint(f"train={n_train} val={n_val} test={n_test}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_train", value: 600, tol: 1e-9, label: "`n_train` seharusnya 600", msg: "60 persen dari 1000 = 600. Cek perkaliannya." },
          { kind: "equal", task: "t2", name: "n_val", value: 200, tol: 1e-9, label: "`n_val` seharusnya 200", msg: "20 persen dari 1000 = 200." },
          { kind: "equal", task: "t2", name: "n_test", value: 200, tol: 1e-9, label: "`n_test` seharusnya 200", msg: "Sisa dari 1000 - 600 - 200 = 200." },
          { kind: "stdout_matches", task: "t3", pattern: "train=600\\s+val=200\\s+test=200", label: "`print` menampilkan pembagian", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Train belajar, validation memilih, test menilai sekali.",
    },
    {
      id: "lab-hakim-terakhir",
      eyebrow: "Langkah 4 · Lab: test set",
      title: "Saksikan test set membongkar model curang",
      prose: [
        "Skenario: 20 fitur noise murni, target noise murni. Tidak ada sinyal sama sekali. Model curang memilih fitur dengan R kuadrat terbaik di train. Kode di bawah sudah memilih fitur itu untukmu; tugasmu mengukur R kuadrat fitur yang sama di test set yang belum pernah disentuh.",
        "Dari 20 fitur noise, selalu ada yang terlihat bagus di train. Pertanyaannya: apakah ia tetap bagus di test? Jalankan dan lihat angkanya sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `r2_te` fitur terbaik (dipilih di train) pada data test" },
        { id: "t2", text: "Cetak `r2_tr` dan `r2_te` dengan `print`" },
      ],
      expected: "r2_tr=0.0208 r2_te=0.0004",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah multiple testing / p-hacking dalam bentuk paling sederhana: dari banyak kandidat noise, satu selalu terlihat bagus. Tanpa test set yang dikunci, kamu akan mempresentasikan noise sebagai temuan.",
      },
      hints: [
        "Gunakan fungsi r2_on yang sama, dengan idx = te dan satu kolom [X[bestc]].",
        "Fungsi r2_on mengembalikan (r2, kolom); kamu hanya butuh r2.",
        "r2_te, _ = r2_on([X[bestc]], y, te)",
      ],
      code: {
        starter: `import random, math\nrandom.seed(7)\n\nn = 300\n# Target = noise murni (tidak ada sinyal!). Fitur = 20 noise.\ny = [random.gauss(0, 1) for _ in range(n)]\nX = [[random.gauss(0, 1) for _ in range(n)] for _ in range(20)]\n\nntr, nva = 180, 60\ndef r2_on(xs_cols, y, idx):\n    best, bestc = 0.0, 0\n    for c, col in enumerate(xs_cols):\n        xv = [col[i] for i in idx]; yv = [y[i] for i in idx]\n        mx = sum(xv)/len(xv); my = sum(yv)/len(yv)\n        num = sum((a-mx)*(b-my) for a, b in zip(xv, yv))\n        den = math.sqrt(sum((a-mx)**2 for a in xv)*sum((b-my)**2 for b in yv))\n        r = num/den if den else 0\n        if r**2 > best: best, bestc = r**2, c\n    return best, bestc\n\ntr = list(range(ntr)); te = list(range(ntr+nva, n))\n# Model "curang": pilih fitur terbaik DI TRAIN\nr2_tr, bestc = r2_on(X, y, tr)\n\n# TULIS KODEMU: ukur fitur yang SAMA di test set (jujur!)\nr2_te = \n\nprint(f"r2_tr={r2_tr:.4f} r2_te={r2_te:.4f}")`,
        lockLines: 25,
        solution: `import random, math\nrandom.seed(7)\n\nn = 300\n# Target = noise murni (tidak ada sinyal!). Fitur = 20 noise.\ny = [random.gauss(0, 1) for _ in range(n)]\nX = [[random.gauss(0, 1) for _ in range(n)] for _ in range(20)]\n\nntr, nva = 180, 60\ndef r2_on(xs_cols, y, idx):\n    best, bestc = 0.0, 0\n    for c, col in enumerate(xs_cols):\n        xv = [col[i] for i in idx]; yv = [y[i] for i in idx]\n        mx = sum(xv)/len(xv); my = sum(yv)/len(yv)\n        num = sum((a-mx)*(b-my) for a, b in zip(xv, yv))\n        den = math.sqrt(sum((a-mx)**2 for a in xv)*sum((b-my)**2 for b in yv))\n        r = num/den if den else 0\n        if r**2 > best: best, bestc = r**2, c\n    return best, bestc\n\ntr = list(range(ntr)); te = list(range(ntr+nva, n))\n# Model "curang": pilih fitur terbaik DI TRAIN\nr2_tr, bestc = r2_on(X, y, tr)\n\n# TULIS KODEMU: ukur fitur yang SAMA di test set (jujur!)\nr2_te, _ = r2_on([X[bestc]], y, te)\n\nprint(f"r2_tr={r2_tr:.4f} r2_te={r2_te:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r2_te", value: 0.0004, tol: 0.01, label: "`r2_te` mendekati 0", msg: "Ukur fitur X[bestc] pada indeks te dengan fungsi r2_on. Hasilnya harus runtuh ke nol." },
          { kind: "stdout_matches", task: "t2", pattern: "r2_tr=0\\.0208\\s+r2_te=0\\.0004", label: "`print` menampilkan kedua R kuadrat", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "r2_on(cols, y, idx): R kuadrat terbaik di subset idx.",
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
          q: "Setelah melihat skor test jelek, kamu tuning lagi dan skor test membaik. Masalahnya?",
          options: [
            { text: "Tidak ada — itulah gunanya test", why: "Salah. Test dipakai untuk penilaian akhir, bukan untuk iterasi tuning." },
            { text: "Test-set overfitting: test sudah terkontaminasi keputusanmu, angka final tidak jujur lagi", why: "Benar. Melihat test lalu mengubah sesuatu = informasi bocor. Test hanya dipakai sekali.", correct: true },
            { text: "Harus hapus test set", why: "Salah. Test setnya tidak bersalah; yang salah cara pakainya." },
            { text: "Naikkan ukuran train", why: "Salah. Masalahnya bukan ukuran data, melainkan disiplin pemakaian test." },
          ],
        },
        {
          q: "Model A: train 82, test 80. Model B: train 99, test 71. Diagnosis Model B?",
          options: [
            { text: "Underfit — tambah kompleksitas", why: "Salah. Underfit berarti train pun jelek; di sini train 99." },
            { text: "Overfit — sederhanakan, regularisasi, atau tambah data. Jangan tambah kompleksitas", why: "Benar. Jurang 28 poin = menghafal noise. Obatnya mengurangi kompleksitas.", correct: true },
            { text: "Normal — train memang selalu lebih tinggi", why: "Salah. Jurang kecil (seperti Model A) yang normal; jurang 28 poin adalah sinyal bahaya." },
            { text: "Ganti metrik evaluasi", why: "Salah. Metriknya tidak salah; modelnya yang menghafal." },
          ],
        },
      ],
      reference: "Jurang train-test = diagnosis. Obat overfit berlawanan dengan obat underfit.",
    },
    {
      id: "lab-baseline",
      eyebrow: "Langkah 6 · Lab: baseline",
      title: "Model fancy wajib mengalahkan model bodoh",
      prose: [
        "Aturan kejujuran: sebelum mengklaim model bagus, ia harus mengalahkan baseline — model paling bodoh yang masuk akal, misalnya menebak rata-rata. Di bawah, data sudah disiapkan dengan hubungan benar y = 3x1 - 2x2 + noise. Tugasmu menulis fungsi RMSE lalu mengukur tiga level: tebak rata-rata, regresi satu variabel, dan OLS tiga variabel.",
        "Model fancy harus jauh lebih baik dari baseline 1. Jika selisihnya tipis, kompleksitasnya tidak justified — pilih baseline. Inilah prinsip challenger.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `rmse(y, p)`" },
        { id: "t2", text: "Hitung `b1` (tebak rata-rata), `b2` (1 variabel), `b3` (3 variabel)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "b1=4.072 b2=2.789 b3=1.991",
      note: {
        title: "Sering salah",
        body: "Membandingkan model fancy dengan model fancy lain tanpa baseline. Tanpa pembanding bodoh, kamu tidak tahu apakah kecanggihanmu memberi nilai atau hanya menambah risiko.",
      },
      hints: [
        "RMSE = akar dari rata-rata kuadrat selisih.",
        "Baseline 1: prediksinya [mean_y]*n untuk semua observasi.",
        "def rmse(y, p):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(y, p))/len(y))",
      ],
      code: {
        starter: `import random, math\nrandom.seed(12)\n\nn = 1000\n# y = 3*x1 - 2*x2 + noise ; x3 = noise murni\nx1 = [random.gauss(0, 1) for _ in range(n)]\nx2 = [random.gauss(0, 1) for _ in range(n)]\nx3 = [random.gauss(0, 1) for _ in range(n)]\ny  = [3*a - 2*b + random.gauss(0, 2) for a, b in zip(x1, x2)]\n\n# TULIS KODEMU: fungsi RMSE\ndef rmse(y, p):\n\nmean_y = sum(y)/n\n# Baseline 1: tebak rata-rata (model paling bodoh)\nb1 = rmse(y, [mean_y]*n)\n# Baseline 2: OLS 1 variabel (x1 saja) — koefisien sudah dihitung\nmx = sum(x1)/n\nbb1 = sum((a-mx)*(c-mean_y) for a, c in zip(x1, y))/sum((a-mx)**2 for a in x1)\nbb0 = mean_y - bb1*mx\nb2 = rmse(y, [bb0 + bb1*a for a in x1])\n# Model fancy: OLS 3 variabel (fungsi eliminasi Gauss sudah disiapkan)\ndef ols_rmse(cols):\n    k = len(cols); Xd = [[1.0]+[c[i] for c in cols] for i in range(n)]\n    A = [[sum(Xd[i][a]*Xd[i][b] for i in range(n)) for b in range(k+1)] for a in range(k+1)]\n    bb = [sum(Xd[i][a]*y[i] for i in range(n)) for a in range(k+1)]\n    M = [row[:]+[v] for row, v in zip(A, bb)]\n    for c_ in range(k+1):\n        piv = max(range(c_, k+1), key=lambda r: abs(M[r][c_])); M[c_], M[piv] = M[piv], M[c_]\n        for r in range(c_+1, k+1):\n            f = M[r][c_]/M[c_][c_]\n            for kk in range(c_, k+2): M[r][kk] -= f*M[c_][kk]\n    be = [0]*(k+1)\n    for i in range(k, -1, -1):\n        be[i] = (M[i][k+1]-sum(M[i][j]*be[j] for j in range(i+1, k+1)))/M[i][i]\n    return rmse(y, [sum(be[a]*Xd[i][a] for a in range(k+1)) for i in range(n)])\nb3 = ols_rmse([x1, x2, x3])\n\nprint(f"b1={b1:.3f} b2={b2:.3f} b3={b3:.3f}")`,
        lockLines: 9,
        solution: `import random, math\nrandom.seed(12)\n\nn = 1000\n# y = 3*x1 - 2*x2 + noise ; x3 = noise murni\nx1 = [random.gauss(0, 1) for _ in range(n)]\nx2 = [random.gauss(0, 1) for _ in range(n)]\nx3 = [random.gauss(0, 1) for _ in range(n)]\ny  = [3*a - 2*b + random.gauss(0, 2) for a, b in zip(x1, x2)]\n\n# TULIS KODEMU: fungsi RMSE\ndef rmse(y, p):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(y, p))/len(y))\n\nmean_y = sum(y)/n\n# Baseline 1: tebak rata-rata (model paling bodoh)\nb1 = rmse(y, [mean_y]*n)\n# Baseline 2: OLS 1 variabel (x1 saja) — koefisien sudah dihitung\nmx = sum(x1)/n\nbb1 = sum((a-mx)*(c-mean_y) for a, c in zip(x1, y))/sum((a-mx)**2 for a in x1)\nbb0 = mean_y - bb1*mx\nb2 = rmse(y, [bb0 + bb1*a for a in x1])\n# Model fancy: OLS 3 variabel (fungsi eliminasi Gauss sudah disiapkan)\ndef ols_rmse(cols):\n    k = len(cols); Xd = [[1.0]+[c[i] for c in cols] for i in range(n)]\n    A = [[sum(Xd[i][a]*Xd[i][b] for i in range(n)) for b in range(k+1)] for a in range(k+1)]\n    bb = [sum(Xd[i][a]*y[i] for i in range(n)) for a in range(k+1)]\n    M = [row[:]+[v] for row, v in zip(A, bb)]\n    for c_ in range(k+1):\n        piv = max(range(c_, k+1), key=lambda r: abs(M[r][c_])); M[c_], M[piv] = M[piv], M[c_]\n        for r in range(c_+1, k+1):\n            f = M[r][c_]/M[c_][c_]\n            for kk in range(c_, k+2): M[r][kk] -= f*M[c_][kk]\n    be = [0]*(k+1)\n    for i in range(k, -1, -1):\n        be[i] = (M[i][k+1]-sum(M[i][j]*be[j] for j in range(i+1, k+1)))/M[i][i]\n    return rmse(y, [sum(be[a]*Xd[i][a] for a in range(k+1)) for i in range(n)])\nb3 = ols_rmse([x1, x2, x3])\n\nprint(f"b1={b1:.3f} b2={b2:.3f} b3={b3:.3f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "rmse", label: "`rmse` terdefinisi", msg: "Tulis fungsi rmse(y, p) di bagian kode editable." },
          { kind: "equal", task: "t2", name: "b1", value: 4.072, tol: 0.01, label: "`b1` sekitar 4.072", msg: "RMSE prediksi konstan = simpangan baku y. Cek fungsi rmse-mu." },
          { kind: "equal", task: "t2", name: "b2", value: 2.789, tol: 0.01, label: "`b2` sekitar 2.789", msg: "Satu variabel menjelaskan sebagian variansi. Cek rumus prediksi [bb0 + bb1*a ...]." },
          { kind: "equal", task: "t2", name: "b3", value: 1.991, tol: 0.01, label: "`b3` sekitar 1.991", msg: "Model 3 variabel mendekati noise sejati (2.0). Pastikan ols_rmse dipanggil dengan [x1, x2, x3]." },
          { kind: "stdout_matches", task: "t3", pattern: "b1=4\\.072\\s+b2=2\\.789\\s+b3=1\\.991", label: "`print` menampilkan tiga RMSE", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "RMSE: math.sqrt(mean((y-p)^2)). Model fancy wajib jauh lebih baik dari baseline.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Pertanyaan dulu, algoritma kemudian",
      prose: [
        "Jenis model ditentukan oleh pertanyaan, bukan oleh tren. Satu, berapa nilainya (kontinu) — regresi: mulai OLS, lalu regularisasi, lalu GLM sesuai distribusi. Dua, terjadi atau tidak (biner) — klasifikasi: mulai logistik, lalu metrik, kalibrasi, boosting.",
        "Tiga, kapan terjadinya (waktu) — survival untuk time-to-default, ARIMA untuk forecast, GARCH untuk volatilitas. Empat, pola apa yang ada (tanpa label) — unsupervised: clustering untuk segmentasi, PCA untuk kompresi, deteksi anomali untuk fraud tanpa label. Lima, apakah X menyebabkan Y — inferensi kausal dengan RCT, DiD, RDD, atau IV; bukan regresi biasa.",
        "Aturan praktis: tulis target, keputusan, dan kapan dipakai sebelum memilih algoritma. Train untuk belajar, validation untuk memilih, test sekali untuk menilai. Baseline dulu — kompleksitas harus membayar dirinya dengan perbaikan yang material, bukan 0,3 poin AUC.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih algoritma karena baru atau populer. Di data tabular risiko kredit, metode lama yang divalidasi jujur masih sering mengalahkan arsitektur terbaru — yang menentukan adalah fitur dan validasi.",
      },
      reference: "Kontinu → regresi. Biner → klasifikasi. Waktu → survival/TS. Tanpa label → unsupervised. Kausal → desain kausal.",
    },
    {
      id: "mini-case-brief-pd",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Brief model PD dari nol",
      prose: [
        "Kamu diminta memimpin proyek model PD untuk KTA online. Direksi bilang pokoknya akurat. Sebelum proyek jalan, kamu harus menulis brief satu halaman. Lima baris terpenting: target PD 12-bulan per pengajuan, dipakai untuk pricing (butuh kalibrasi) dan cutoff penolakan; perangko waktu — semua fitur harus tersedia saat pengajuan; baseline scorecard logistik existing dengan AUC 0,76; validasi out-of-time walk-forward plus audit leakage plus model pembanding; monitoring PSI bulanan dan ambang retraining.",
        "Metrik evaluasi: AUC atau KS untuk ranking, Brier atau ECE untuk kalibrasi karena dipakai pricing, dan expected cost di threshold operasional. Bukan akurasi: base rate default sekitar 8 persen membuat akurasi menipu — model bodoh yang selalu menebak lancar pun dapat 92 persen.",
        "Desain validasi untuk data pengajuan 2022 sampai 2025: train 2022-2023, validation semester 1 2024, test semester 2 2024 yang dikunci dan dipakai sekali, out-of-time 2025 untuk laporan. Random CV dilarang karena temporal leakage; stratifikasi per vintage.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Brief seperti ini adalah dokumen yang diminta regulator dan auditor duluan. Model tanpa brief = keputusan tanpa jejak: tidak bisa dipertahankan saat ditanya kenapa limit dinaikkan.",
      },
      reference: "Brief: target + keputusan + perangko waktu + baseline + validasi + monitoring.",
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
        "Tujuh tahap: masalah, data, fitur, model, validasi, deploy, monitor. Sekitar 80 persen waktu habis di luar training.",
        "Train belajar, validation memilih, test dipakai sekali untuk penilaian akhir. Alur informasi satu arah.",
        "Jurang train-test = diagnosis: jurang besar berarti overfit (sederhanakan), train pun jelek berarti underfit (tambah kompleksitas).",
        "Baseline dan challenger wajib sebelum klaim bagus. Kompleksitas harus membayar dirinya.",
        "Fitur lebih penting dari algoritma. Pertanyaan dulu, mesin kemudian.",
      ],
      next: { label: "A3.1 — Regresi Linear OLS", href: "/v2/learn/a31-regresi-ols" },
      quiz: [
        {
          q: "Model XGBoost AUC 0,851 vs baseline logistik AUC 0,848. Keputusan?",
          options: [
            { text: "Deploy XGBoost — lebih tinggi", why: "Salah. Selisih 0,3 poin tidak material dibanding biaya interpretabilitas dan maintenance." },
            { text: "Tolak kompleksitas: selisih tidak material, pilih baseline (prinsip challenger)", why: "Benar. Kompleksitas harus membayar dirinya dengan perbaikan yang material.", correct: true },
            { text: "Rata-ratakan kedua model", why: "Salah. Ensemble menambah kompleksitas tanpa menjawab pertanyaan materialitas." },
            { text: "Cari algoritma yang lebih baru", why: "Salah. Masalahnya bukan kebaruan algoritma, melainkan nilai tambah yang tidak ada." },
          ],
        },
        {
          q: "Tahap mana yang paling sering menyebabkan kegagalan model di produksi?",
          options: [
            { text: "Pemilihan algoritma", why: "Salah. Algoritma jarang menjadi pembeda kegagalan." },
            { text: "Tuning hyperparameter", why: "Salah. Tuning jarang menjadi penyebab kegagalan produksi." },
            { text: "Definisi masalah, leakage data, dan monitoring — bukan algoritmanya", why: "Benar. Sekitar 80 persen kegagalan berasal dari pertanyaan salah, fitur bocor, dan model yang tidak dimonitor.", correct: true },
            { text: "Visualisasi hasil", why: "Salah. Visualisasi tidak menentukan kegagalan produksi." },
          ],
        },
        {
          q: "Untuk data pengajuan kredit 2020-2024, split yang benar?",
          options: [
            { text: "Random 80/20", why: "Salah. Random split mencampur masa depan ke train — temporal leakage." },
            { text: "Time-based: train masa lalu, test masa depan (out-of-time)", why: "Benar. Validasi harus meniru produksi: model hanya tahu masa lalu, diuji di masa depan.", correct: true },
            { text: "Train 2024, test 2020", why: "Salah. Model diuji di masa lalu tidak meniru cara ia dipakai." },
            { text: "Tidak perlu split", why: "Salah. Tanpa split tidak ada penilaian jujur." },
          ],
        },
        {
          q: "Fitur lebih penting dari algoritma. Contoh konkretnya?",
          options: [
            { text: "Ganti XGBoost ke LightGBM", why: "Salah. Itu ganti mesin, bukan ganti bahan bakar." },
            { text: "Menambah fitur DPD x LTV dari pengetahuan bisnis sering mengalahkan ganti algoritma", why: "Benar. Fitur mengkodekan pengetahuan domain yang tidak ada di data mentah.", correct: true },
            { text: "Naikkan learning rate", why: "Salah. Itu tuning, bukan informasi baru." },
            { text: "Tambah layer neural network", why: "Salah. Kompleksitas tanpa informasi baru tidak menambah pengetahuan." },
          ],
        },
      ],
      note: {
        title: "Intuisi: model yang bagus lahir dari alur yang jujur",
        body: "Lima heuristik. Satu: leakage tidak berbau — fitur yang “terlalu bagus untuk jadi kenyataan” adalah tersangka utama; tanya selalu “apakah informasi ini sudah ada saat prediksi harus dibuat?” Dua: baseline dulu, fancy kemudian — bila XGBoost hanya menang satu poin dari tebakan rata-rata, kompleksitasnya tidak justified; model bodoh yang menang adalah vonis untuk masalahnya, bukan untuk algoritmanya. Tiga: test set adalah saksi yang hanya boleh bicara sekali — begitu hasilnya memengaruhi keputusanmu, ia sudah menjadi validation set dan kejujurannya hangus. Empat: metrik mengikuti keputusan bisnis — untuk ranking pakai AUC atau KS, untuk pricing pakai kalibrasi seperti Brier atau ECE; akurasi pada base rate 8 persen adalah jebakan orang malas. Lima: 80 persen waktu habis di luar training — yang menggagalkan proyek biasanya definisi masalah yang kabur dan data yang bocor, bukan arsitekturnya; perbaiki hulu sebelum menyalahkan hilir. Enam: dokumentasikan keputusanmu — threshold, MDE, dan alasan pemilihan model yang ditulis hari ini adalah satu-satunya pertahananmu saat model ditanya auditor enam bulan kemudian.",
      },
    },
  ],
};

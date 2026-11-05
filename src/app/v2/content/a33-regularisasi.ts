import type { V2Lesson } from "../lib/types";

export const a33: V2Lesson = {
  slug: "a33-regularisasi",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.3 Regularisasi: Menahan Model yang Terlalu Pintar Menghafal",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-pinjamyuk",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model sempurna di lab, bencana di lapangan",
      prose: [
        "Tim data science fintech PinjamYuk merayakan: model PD baru mencapai akurasi 99,2 persen di data latih — mengalahkan semua model lama. CEO langsung minta go live. Dua minggu setelah produksi, tim koleksi panik: prediksi model ngawur total. Nasabah aman menurut model ternyata macet massal.",
        "Investigasi menemukan: model itu punya 200 variabel untuk 500 nasabah — termasuk nomor rumah, jumlah huruf nama ibu, dan digit terakhir NIK. Dengan variabel sebanyak itu, OLS bisa menghafal data latih sampai 99,2 persen, termasuk noise-nya. Model tidak belajar pola; ia menghafal daftar.",
        "Solusinya bukan buang variabel manual satu per satu, melainkan memberi model denda otomatis untuk koefisien yang terlalu besar — itulah regularisasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model yang menghafal noise lolos validasi yang ceroboh lalu runtuh di produksi — kerugian kredit nyata dari keputusan berbasis hafalan, bukan pola.",
      },
      reference: "Rasio p/n besar = waspada hafalan. 200 variabel untuk 500 nasabah = red flag.",
    },
    {
      id: "lab-bias-variance",
      eyebrow: "Langkah 2 · Lab: bias-variance",
      title: "Saksikan overfitting lahir",
      prose: [
        "Error model di data baru bisa diurai menjadi tiga: bias kuadrat (model terlalu sederhana), variance (model terlalu goyang antar sampel), dan noise (tak tereduksi). Keduanya tidak bisa dikalahkan bersamaan — itulah tradeoff.",
        "Di bawah: 15 titik latih, polinomial derajat 1, 3, 9, 14. Error latih selalu turun saat derajat naik. Pertanyaan: apa yang terjadi pada error uji? Hitung dan tentukan derajat mana yang pertama kali overfit (error uji > 10).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `e_latih9`, `e_uji9` untuk derajat 9" },
        { id: "t2", text: "Tentukan `d_over` = derajat pertama dengan error uji > 10, lalu `print`" },
      ],
      expected: "d9: latih=0.087 uji=229.055 over=9",
      note: {
        title: "Sering salah",
        body: "Mengira error latih kecil = model bagus. Error latih selalu turun dengan kompleksitas — ia bukan juri. Satu-satunya juri jujur adalah data yang tidak dipakai fitting.",
      },
      hints: [
        "Fungsi polyfit_predict(xtr, ytr, d, x) sudah disiapkan.",
        "mse(a, b) = rata-rata kuadrat selisih.",
        "Cek derajat 1, 3, 9, 14 satu per satu.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(11)\n\ndef true_f(x): return math.sin(x * 2.2) * 1.5 + 0.3 * x\nxtr = [random.uniform(-3, 3) for _ in range(15)]\nytr = [true_f(x) + random.gauss(0, 0.5) for x in xtr]\nxte = [i * 0.03 - 3 for i in range(200)]\nyte = [true_f(x) for x in xte]\n\ndef polyfit_predict(xs, ys, deg, x):\n    n = deg + 1\n    A = [[sum(xi**(i+j) for xi in xs) for j in range(n)] for i in range(n)]\n    b = [sum(y * (xi**i) for xi, y in zip(xs, ys)) for i in range(n)]\n    M = [row[:] + [bi] for row, bi in zip(A, b)]\n    for c in range(n):\n        piv = max(range(c, n), key=lambda r: abs(M[r][c]))\n        M[c], M[piv] = M[piv], M[c]\n        for r in range(c+1, n):\n            f = M[r][c]/M[c][c]\n            for k in range(c, n+1): M[r][k] -= f*M[c][k]\n    beta = [0]*n\n    for i in range(n-1, -1, -1):\n        beta[i] = (M[i][n] - sum(M[i][j]*beta[j] for j in range(i+1, n)))/M[i][i]\n    return sum(beta[i]*(x**i) for i in range(n))\n\ndef mse(a, b):\n    return sum((x-y)**2 for x, y in zip(a, b))/len(a)\n\n# TULIS KODEMU: error latih & uji derajat 9, lalu derajat pertama yg overfit\nptr9 = [polyfit_predict(xtr, ytr, 9, x) for x in xtr]\npte9 = [polyfit_predict(xtr, ytr, 9, x) for x in xte]\ne_latih9 = \ne_uji9 = \nd_over = \n\nprint(f"d9: latih={e_latih9:.3f} uji={e_uji9:.3f} over={d_over}")`,
        lockLines: 26,
        solution: `import random, math\nrandom.seed(11)\n\ndef true_f(x): return math.sin(x * 2.2) * 1.5 + 0.3 * x\nxtr = [random.uniform(-3, 3) for _ in range(15)]\nytr = [true_f(x) + random.gauss(0, 0.5) for x in xtr]\nxte = [i * 0.03 - 3 for i in range(200)]\nyte = [true_f(x) for x in xte]\n\ndef polyfit_predict(xs, ys, deg, x):\n    n = deg + 1\n    A = [[sum(xi**(i+j) for xi in xs) for j in range(n)] for i in range(n)]\n    b = [sum(y * (xi**i) for xi, y in zip(xs, ys)) for i in range(n)]\n    M = [row[:] + [bi] for row, bi in zip(A, b)]\n    for c in range(n):\n        piv = max(range(c, n), key=lambda r: abs(M[r][c]))\n        M[c], M[piv] = M[piv], M[c]\n        for r in range(c+1, n):\n            f = M[r][c]/M[c][c]\n            for k in range(c, n+1): M[r][k] -= f*M[c][k]\n    beta = [0]*n\n    for i in range(n-1, -1, -1):\n        beta[i] = (M[i][n] - sum(M[i][j]*beta[j] for j in range(i+1, n)))/M[i][i]\n    return sum(beta[i]*(x**i) for i in range(n))\n\ndef mse(a, b):\n    return sum((x-y)**2 for x, y in zip(a, b))/len(a)\n\n# TULIS KODEMU: error latih & uji derajat 9, lalu derajat pertama yg overfit\nptr9 = [polyfit_predict(xtr, ytr, 9, x) for x in xtr]\npte9 = [polyfit_predict(xtr, ytr, 9, x) for x in xte]\ne_latih9 = mse(ytr, ptr9)\ne_uji9 = mse(yte, pte9)\nd_over = 9  # d=1: 1.14, d=3: 1.13, d=9: 229 -> pertama yg > 10\n\nprint(f"d9: latih={e_latih9:.3f} uji={e_uji9:.3f} over={d_over}")`,
        checks: [
          { kind: "equal", task: "t1", name: "e_latih9", value: 0.087, tol: 0.005, label: "`e_latih9` sekitar 0.087", msg: "Error latih derajat 9 kecil — model menghafal 15 titik." },
          { kind: "equal", task: "t1", name: "e_uji9", value: 229.055, tol: 1.0, label: "`e_uji9` sekitar 229.055", msg: "Error uji meledak — polinomial derajat 9 liar di luar titik latih." },
          { kind: "equal", task: "t2", name: "d_over", value: 9, tol: 1e-9, label: "`d_over` seharusnya 9", msg: "Derajat 1 dan 3 error uji ~1,1; derajat 9 pertama kali > 10." },
          { kind: "stdout_matches", task: "t2", pattern: "d9: latih=0\\.087\\s+uji=229\\.055\\s+over=9", label: "`print` menampilkan diagnosis", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Error latih turun terus; error uji turun lalu naik. Lembah = kompleksitas tepat.",
    },
    {
      id: "lab-ridge",
      eyebrow: "Langkah 3 · Lab: Ridge",
      title: "Ridge: pengerem halus (L2)",
      prose: [
        "Ridge menambahkan denda proporsional jumlah kuadrat koefisien ke fungsi objektif OLS. Penalti kuadratik benci satu koefisien raksasa — ia membagi bobot merata, stabil terhadap multikolinearitas, dan tidak membuang informasi.",
        "Di bawah: y = 3x1 - 2x2 + noise; x1, x2 berkorelasi 0,9; x3 noise murni. OLS (lambda=0): b1=3,66, b2=-2,54 — liar karena bingung membagi jasa. Ridge lambda=2: 3,09 dan -1,97 — mendekati kebenaran (3, -2). Lambda=50: 0,89 dan -0,07 — semua menyusut tapi tidak ada yang persis nol.",
        "Ridge menyusutkan tapi tidak menolkan. Koefisien noise x3 tetap kecil (~0,2) di semua lambda — Ridge membunuh yang liar duluan.",
      ],
      formula: String.raw`\min_{\beta} \sum_{i=1}^{n}(y_i - x_i'\beta)^2 + \lambda \sum_{j=1}^{k}\beta_j^2`,
      formulaNote: "beta = koefisien; lambda = kekuatan penalti (dipilih via CV); suku pertama = kesalahan fitting OLS; suku kedua = penalti kuadrat. Penalti hanya dikenakan ke slope (j = 1..k), bukan intersep. Makin besar lambda, makin menyusut — tapi tidak pernah tepat nol.",
      tasks: [
        { id: "t1", text: "Hitung `b1_l0`, `b1_l2`, `b1_l50` via `ridge(...)`" },
        { id: "t2", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "b1_l0=3.66 b1_l2=3.09 b1_l50=0.89",
      note: {
        title: "Sering salah",
        body: "Lupa menstandarkan sebelum Ridge/Lasso. Penalti buta terhadap satuan: variabel berskala rupiah terdenda tidak adil dibanding berskala persen. Standarkan dulu — selalu.",
      },
      hints: [
        "ridge([x1,x2,x3], y, lam) mengembalikan [b0,b1,b2,b3].",
        "Ambil indeks 1 untuk b1.",
        "b1_l0 = ridge([x1,x2,x3], y, 0)[1]",
      ],
      code: {
        starter: `import random, math\nrandom.seed(5)\nn = 60\nx1 = [random.gauss(0, 1) for _ in range(n)]\nx2 = [0.9*a + random.gauss(0, 0.44) for a in x1]\nx3 = [random.gauss(0, 1) for _ in range(n)]\ny  = [3*a - 2*b + random.gauss(0, 1) for a, b in zip(x1, x2)]\n\ndef ridge(xs_list, y, lam):\n    k = len(xs_list); p = k + 1\n    X = [[1.0] + [xs[i] for xs in xs_list] for i in range(n)]\n    A = [[sum(X[i][a]*X[i][b] for i in range(n)) for b in range(p)] for a in range(p)]\n    for a in range(1, p): A[a][a] += lam\n    b = [sum(X[i][a]*y[i] for i in range(n)) for a in range(p)]\n    M = [row[:] + [bi] for row, bi in zip(A, b)]\n    for c in range(p):\n        piv = max(range(c, p), key=lambda r: abs(M[r][c]))\n        M[c], M[piv] = M[piv], M[c]\n        for r in range(c+1, p):\n            f = M[r][c]/M[c][c]\n            for kk in range(c, p+1): M[r][kk] -= f*M[c][kk]\n    beta = [0]*p\n    for i in range(p-1, -1, -1):\n        beta[i] = (M[i][p] - sum(M[i][j]*beta[j] for j in range(i+1, p)))/M[i][i]\n    return beta\n\n# TULIS KODEMU: koefisien b1 untuk lambda 0, 2, 50 (kebenaran: 3)\nb1_l0 = \nb1_l2 = \nb1_l50 = \n\nprint(f"b1_l0={b1_l0:.2f} b1_l2={b1_l2:.2f} b1_l50={b1_l50:.2f}")`,
        lockLines: 26,
        solution: `import random, math\nrandom.seed(5)\nn = 60\nx1 = [random.gauss(0, 1) for _ in range(n)]\nx2 = [0.9*a + random.gauss(0, 0.44) for a in x1]\nx3 = [random.gauss(0, 1) for _ in range(n)]\ny  = [3*a - 2*b + random.gauss(0, 1) for a, b in zip(x1, x2)]\n\ndef ridge(xs_list, y, lam):\n    k = len(xs_list); p = k + 1\n    X = [[1.0] + [xs[i] for xs in xs_list] for i in range(n)]\n    A = [[sum(X[i][a]*X[i][b] for i in range(n)) for b in range(p)] for a in range(p)]\n    for a in range(1, p): A[a][a] += lam\n    b = [sum(X[i][a]*y[i] for i in range(n)) for a in range(p)]\n    M = [row[:] + [bi] for row, bi in zip(A, b)]\n    for c in range(p):\n        piv = max(range(c, p), key=lambda r: abs(M[r][c]))\n        M[c], M[piv] = M[piv], M[c]\n        for r in range(c+1, p):\n            f = M[r][c]/M[c][c]\n            for kk in range(c, p+1): M[r][kk] -= f*M[c][kk]\n    beta = [0]*p\n    for i in range(p-1, -1, -1):\n        beta[i] = (M[i][p] - sum(M[i][j]*beta[j] for j in range(i+1, p)))/M[i][i]\n    return beta\n\n# TULIS KODEMU: koefisien b1 untuk lambda 0, 2, 50 (kebenaran: 3)\nb1_l0 = ridge([x1, x2, x3], y, 0)[1]\nb1_l2 = ridge([x1, x2, x3], y, 2)[1]\nb1_l50 = ridge([x1, x2, x3], y, 50)[1]\n\nprint(f"b1_l0={b1_l0:.2f} b1_l2={b1_l2:.2f} b1_l50={b1_l50:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "b1_l0", value: 3.66, tol: 0.03, label: "`b1_l0` sekitar 3.66", msg: "OLS liar karena multikolinearitas — ambil indeks 1 dari hasil ridge." },
          { kind: "equal", task: "t1", name: "b1_l2", value: 3.09, tol: 0.03, label: "`b1_l2` sekitar 3.09", msg: "Ridge lambda=2 mendekati kebenaran 3." },
          { kind: "equal", task: "t1", name: "b1_l50", value: 0.89, tol: 0.03, label: "`b1_l50` sekitar 0.89", msg: "Lambda besar menyusutkan semua — harga bias yang dibayar." },
          { kind: "stdout_matches", task: "t2", pattern: "b1_l0=3\\.66\\s+b1_l2=3\\.09\\s+b1_l50=0\\.89", label: "`print` menampilkan penyusutan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Ridge = (X'X + λI)^-1 X'y. Penalti hanya untuk slope, bukan intersep.",
    },
    {
      id: "lasso-enet",
      eyebrow: "Langkah 4 · Lasso & Elastic Net",
      title: "Tukang seleksi tegas dan jalan tengah",
      prose: [
        "Lasso memakai penalti nilai absolut (L1), bukan kuadrat. Geometri L1 yang bersudut tajam memaksa banyak koefisien tepat nol — seleksi otomatis. Contoh: 200 kandidat variabel perilaku transaksi menjadi 12 variabel final untuk scorecard; test R kuadrat naik dari 0,60 (OLS overfit) ke 0,80.",
        "Tapi Lasso memilih satu secara arbitrer di antara variabel berkorelasi — tidak stabil antar sampel dan berbahaya untuk interpretasi. Jika dua variabel berkorelasi 0,95 dan keduanya penting secara teori, Ridge lebih tepat: ia membagi bobot merata.",
        "Elastic Net menggabungkan keduanya: seleksi per kelompok yang stabil untuk variabel yang membentuk kelompok tema berkorelasi (likuiditas, leverage, profitabilitas). Dan jika n besar, p kecil, asumsi terpenuhi — OLS biasa saja sudah BLUE; jangan mengobati penyakit yang tidak ada.",
      ],
      formula: String.raw`\text{Lasso: } \lambda \sum |\beta_j|, \qquad \text{Elastic Net: } \lambda_1 \sum |\beta_j| + \lambda_2 \sum \beta_j^2`,
      formulaNote: "L1 (Lasso): penalti jumlah nilai absolut — geometri bersudut tajam memaksa banyak koefisien tepat nol (seleksi otomatis). Elastic Net: L1 untuk seleksi + L2 untuk stabilitas; lambda_1 dan lambda_2 mengatur campuran via CV.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menyimpulkan variabel berkoefisien nol dari Lasso pasti tidak penting secara kausal. Nol berarti tidak terpilih untuk prediksi di sampel ini — mungkin redundan dengan variabel lain. Jangan hapus dari kamus teori bisnismu hanya karena Lasso menolkannya.",
      },
      reference: "Mau stabilitas -> Ridge. Mau seleksi -> Lasso. Mau keduanya -> Elastic Net.",
    },
    {
      id: "cv-lambda",
      eyebrow: "Langkah 5 · Memilih lambda",
      title: "Lambda dipilih dari CV, bukan dari firasat",
      prose: [
        "Cross-validation memilih lambda dengan menguji tiap kandidat di data yang tidak dipakai fitting: bagi data jadi K lipatan, latih di K-1, uji di 1, rata-ratakan. Kurva error CV berbentuk U — lembah = tradeoff bias-variance terbaik.",
        "Aturan one-standard-error: pilih lambda terbesar yang errornya masih dalam 1 SE dari minimum — model lebih sederhana dengan akurasi setara. Mengorbankan sedikit akurasi demi kesederhanaan, stabilitas, dan interpretabilitas.",
        "Jangan pernah pilih lambda dari error latih: error latih selalu turun saat lambda menuju 0, jadi pemenangnya selalu tanpa regularisasi = overfitting. Itu mencontek.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih lambda dari error latih terkecil. Lambda=0 selalu menang di data latih karena penalti nol = OLS = paling fleksibel menghafal. Satu-satunya juri jujur adalah data yang tidak dipakai fitting.",
      },
      reference: "Kurva U = kompasmu. One-SE rule = pilih yang sederhana tapi setara.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 5. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Error latih = 4, error di data baru = 35. Diagnosis dan obat?",
          options: [
            { text: "Underfit — tambah kompleksitas", why: "Salah. Underfit berarti error latih pun besar." },
            { text: "Overfit (variance tinggi) — sederhanakan model atau naikkan regularisasi lambda", why: "Benar. Jurang latih-vs-baru = variance tinggi.", correct: true },
            { text: "Noise terlalu kecil", why: "Salah. Noise kecil justru memudahkan." },
            { text: "Butuh lebih banyak data latih saja", why: "Salah. Data membantu tapi tidak menyembuhkan model terlalu kompleks." },
          ],
        },
        {
          q: "Dua variabel berkorelasi 0,95, keduanya penting secara teori. Ridge vs Lasso?",
          options: [
            { text: "Lasso — akan memilih satu secara stabil", why: "Salah. Lasso memilih satu secara arbitrer dan tidak stabil." },
            { text: "Ridge — membagi bobot merata dan stabil; Lasso menolkan salah satu secara arbitrer", why: "Benar. Penalti kuadratik benci satu koefisien raksasa.", correct: true },
            { text: "Keduanya identik", why: "Salah. Geometri penalti L1 vs L2 berbeda." },
            { text: "OLS saja", why: "Salah. OLS liar di bawah multikolinearitas." },
          ],
        },
      ],
      reference: "Jurang = overfit. Korelasi tinggi + keduanya penting = Ridge.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Ridge, Lasso, atau Elastic Net?",
      prose: [
        "Satu, banyak variabel berkorelasi dan semua mungkin penting (puluhan rasio keuangan): Ridge — membagi bobot merata, stabil, tidak membuang informasi. Dua, ratusan variabel dan curiga hanya sedikit yang penting (200 kandidat perilaku transaksi): Lasso — seleksi otomatis menjadi model ramping yang bisa dijelaskan ke regulator.",
        "Tiga, variabel berkorelasi berkelompok dan butuh seleksi: Elastic Net — seleksi per kelompok yang stabil, tidak menolkan arbitrer satu dari dua variabel kembar. Empat, n besar, p kecil, asumsi terpenuhi: OLS biasa saja — regularisasi mengorbankan ketakbiasan; jangan mengobati penyakit yang tidak ada.",
        "Aturan 10 detik: standarkan dulu sebelum penalti — selalu. Lambda dari CV, bukan error latih. Regularisasi = obat variance; jika masalahmu bias (model terlalu sederhana), tambah fitur — jangan naikkan lambda.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: regularisasi adalah rem, bukan kemudi",
        body: "Regularisasi mengendalikan variance — ia tidak memperbaiki model yang salah arah (bias). Rem tidak berguna bila mobilnya menghadap jurang. Tiga heuristik. Pertama: lambda = seberapa keras rem diinjak. Nol = liar menghafal; tak hingga = semua koefisien nol = model mati. CV memilih kekerasan yang pas — bukan firasatmu. Kedua: standarkan SEBELUM penalti, selalu. Penalti buta terhadap satuan: tanpa standarisasi, seleksi ditentukan satuan variabel, bukan pentingnya. Ketiga: pilih senjata sesuai misi — Lasso untuk seleksi yang bisa dibaca manusia dan regulator; Ridge untuk stabilitas prediksi; Elastic Net untuk keduanya. Aturan praktis: koefisien hasil regularisasi bias menuju nol — jangan pakai untuk uji signifikansi atau interval kepercayaan tanpa koreksi. Inferensi pasca-seleksi butuh metode khusus (selective inference) atau pemisahan data.",
      },
      reference: "Stabilitas -> Ridge. Seleksi -> Lasso. Keduanya -> Elastic Net. Sehat -> OLS.",
    },
    {
      id: "mini-case-200",
      eyebrow: "Langkah 8 · Mini-case",
      title: "200 variabel, 500 nasabah — model apa?",
      prose: [
        "Kamu diminta membangun model PD dengan 200 kandidat variabel tapi hanya 500 nasabah dengan riwayat default lengkap. Atasan bilang pakai semua variabel biar akurat. Kamu coba OLS: R kuadrat = 0,97 di data latih. Kamu curiga, lalu jalankan 5-fold CV: error CV-nya 3 kali lipat error latih.",
        "Diagnosis: overfitting klasik (p/n = 200/500 terlalu besar) — jurang antara error latih dan error CV adalah tanda tangan hafalan, bukan pembelajaran. Metode: Lasso atau Elastic Net — dengan 200 variabel campuran (banyak noise seperti digit NIK), kamu butuh seleksi, bukan sekadar penyusutan.",
        "Lambda dipilih dari CV, bukan dari error latih. Yang kamu laporkan ke atasan soal R kuadrat 0,97: itu angka hafalan, bukan angka pembelajaran — model yang menghafal 500 nasabah tidak tahu apa-apa tentang nasabah ke-501.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "R kuadrat 0,97 yang dilaporkan sebagai prestasi adalah bom waktu: direksi mengambil keputusan limit dari angka hafalan.",
      },
      reference: "p/n besar -> curiga. Jurang latih-CV = tanda hafalan. Lapor keduanya, bukan cuma R2.",
    },
    {
      id: "pendalaman-jalur-df",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Jalur regularisasi, derajat bebas efektif & inferensi pasca-seleksi",
      prose: [
        "Plot koefisien terhadap log(lambda) — regularization path — adalah peta kepribadian tiap variabel. Ridge: semua koefisien menyusut mulus menuju nol. Lasso: koefisien mati satu per satu, tepat nol — dan urutan kematiannya informatif: variabel yang bertahan paling lama (mati terakhir) adalah yang paling robust. Path mengubah satu angka lambda menjadi cerita: siapa yang penting, siapa yang redundan, siapa yang noise.",
        "Ridge punya konsep derajat bebas efektif: df(lambda) = jumlah atas j dari d_j^2/(d_j^2 + lambda), dengan d_j singular value matriks X. Saat lambda = 0: df = p (OLS penuh, tiap parameter utuh). Saat lambda → tak hingga: df → 0. Di antaranya: parameter sebagian — penalti mengubah parameter utuh menjadi pecahan parameter. Untuk AIC/BIC model terpenalti, pakai df efektif ini, bukan p mentah — menghukum kompleksitas yang sebenarnya, bukan yang nominal.",
        "Kapan ridge mengalahkan lasso? Bila sinyal tersebar di banyak variabel kecil (dense) — mis. puluhan rasio keuangan yang masing-masing sedikit informatif — ridge menang karena tidak membuang informasi. Bila sinyal terkonsentrasi di sedikit variabel (sparse) — lasso menang via seleksi. Dunia nyata sering di tengah: elastic net. Aturan senior: tidak tahu struktur sinyalnya? Jangan berdebat — coba ketiganya via CV dan ukur. Data memutuskan, bukan preferensi.",
        "Jebakan paling mahal: inferensi pasca-seleksi. Melaporkan SE dan p-value OLS dari variabel HASIL seleksi Lasso seolah tidak ada seleksi = tidak valid — seleksi memakai data yang sama sehingga SE terlalu optimis. Ini kesalahan yang bahkan muncul di publikasi. Solusi: selective inference (koreksi distribusi pasca-seleksi, Lee dkk.) atau sample splitting — seleksi di setengah data, inferensi di setengah lain. Aturan: bila butuh p-value yang jujur, jangan seleksi dan inferensi di data yang sama.",
      ],
      formula: String.raw`\text{df}(\lambda) = \sum_{j=1}^{p} \frac{d_j^2}{d_j^2 + \lambda}`,
      formulaNote: "df(λ) = derajat bebas efektif ridge; d_j = singular value ke-j dari matriks X (akar eigenvalue X'X); p = jumlah prediktor. λ = 0 → df = p (OLS penuh); λ → ∞ → df → 0. Dipakai untuk AIC/BIC model terpenalti — menghukum kompleksitas efektif, bukan nominal.",
      tasks: [],
      reference: "Path = peta pentingnya variabel. df efektif untuk AIC/BIC. Seleksi + inferensi di data sama = tidak valid.",
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
        "Error data baru = bias^2 + variance + noise. Overfit = variance tinggi; obatnya kurangi kompleksitas.",
        "Ridge (L2): menyusutkan semua, stabil untuk korelasi, tidak menolkan.",
        "Lasso (L1): menolkan — seleksi otomatis; arbitrer di antara variabel berkorelasi.",
        "Standarkan dulu sebelum penalti. Lambda dari CV (kurva U, one-SE rule), bukan error latih.",
        "Elastic Net untuk kelompok berkorelasi; OLS saja jika tidak ada masalah variance.",
      ],
      next: { label: "A3.4 — Regresi Logistik & GLM", href: "/learn/a34-logistic-glm" },
      quiz: [
        {
          q: "Kenapa prediktor wajib distandarkan sebelum Ridge/Lasso?",
          options: [
            { text: "Agar R kuadrat naik", why: "Salah. Bukan itu mekanismenya." },
            { text: "Penalti menghukum besar angka koefisien — variabel berskala besar terdenda tidak adil dibanding berskala kecil", why: "Benar. Tanpa standarisasi, seleksi ditentukan satuan, bukan pentingnya variabel.", correct: true },
            { text: "Agar OLS lebih cepat", why: "Salah. Tidak ada hubungan dengan kecepatan." },
            { text: "Tidak wajib, hanya kosmetik", why: "Salah. Ini wajib, bukan kosmetik." },
          ],
        },
        {
          q: "Lambda dipilih berdasarkan error latih terkecil. Apa yang salah?",
          options: [
            { text: "Tidak ada — error latih terkecil = model terbaik", why: "Salah. Error latih bukan juri jujur." },
            { text: "Error latih selalu turun saat lambda -> 0, jadi pemenangnya selalu tanpa regularisasi = overfitting", why: "Benar. Memilih dari error latih = mencontek.", correct: true },
            { text: "CV terlalu lambat", why: "Salah. Bukan soal kecepatan." },
            { text: "Lambda tidak mempengaruhi error latih", why: "Salah. Sangat mempengaruhi." },
          ],
        },
        {
          q: "Kurva CV error berbentuk U dengan lembah di lambda=1. Aturan one-standard-error menyarankan?",
          options: [
            { text: "Selalu lambda=1, titik minimum", why: "Salah. Itu aturan minimum, bukan one-SE." },
            { text: "Lambda terbesar yang errornya masih dalam 1 SE dari minimum — model lebih sederhana dengan akurasi setara", why: "Benar. Korbankan sedikit akurasi demi kesederhanaan dan stabilitas.", correct: true },
            { text: "Lambda terkecil", why: "Salah. Arahnya berlawanan." },
            { text: "Rata-rata semua lambda", why: "Salah. Tidak ada dasarnya." },
          ],
        },
        {
          q: "Setelah Lasso, koefisien jumlah_transaksi_bulanan = 0. Kesimpulan tepat?",
          options: [
            { text: "Variabel itu pasti tidak berpengaruh kausal", why: "Salah. Lasso tidak menguji kausalitas." },
            { text: "Tidak berguna untuk prediksi di sampel ini (mungkin redundan) — bukan bukti tidak penting secara kausal", why: "Benar. Nol = tidak terpilih, bukan tidak penting.", correct: true },
            { text: "Lasso salah, pakai OLS", why: "Salah. Bukan kesalahan Lasso." },
            { text: "Naikkan lambda agar jadi non-nol", why: "Salah. Menaikkan lambda justru menolkan lebih banyak." },
          ],
        },
        {
          q: "Regularization path Lasso: variabel X7 mati terakhir (bertahan hingga lambda terbesar). Artinya?",
          options: [
            { text: "X7 tidak penting — mati belakangan = lemah", why: "Salah. Arahnya terbalik." },
            { text: "X7 paling robust — urutan kematian di path Lasso = urutan pentingnya variabel. Yang bertahan paling lama paling kuat sinyalnya", why: "Benar. Path mengubah satu lambda menjadi cerita.", correct: true },
            { text: "Tidak ada artinya", why: "Salah. Path sangat informatif." },
            { text: "X7 harus dibuang duluan", why: "Salah. Justru sebaliknya." },
          ],
        },
        {
          q: "Setelah Lasso memilih 12 variabel, kamu melaporkan p-value OLS dari 12 variabel itu seolah tidak ada seleksi. Masalah?",
          options: [
            { text: "Tidak ada — p-value OLS selalu valid", why: "Salah. Seleksi memakai data yang sama." },
            { text: "Post-selection inference tidak valid: SE terlalu optimis karena seleksi memakai data yang sama. Solusi: selective inference atau sample splitting", why: "Benar. Ini jebakan yang bahkan muncul di publikasi.", correct: true },
            { text: "Harus pakai lebih banyak variabel", why: "Salah. Bukan itu masalahnya." },
            { text: "Lasso tidak boleh dipakai", why: "Salah. Lasso boleh; inferensinya yang butuh koreksi." },
          ],
        },
        {
          q: "Sinyal tersebar di 50 rasio keuangan yang masing-masing sedikit informatif (dense). Ridge atau Lasso?",
          options: [
            { text: "Lasso — seleksi selalu lebih baik", why: "Salah. Lasso membuang informasi yang tersebar." },
            { text: "Ridge — untuk sinyal dense, menyusutkan semua tanpa membuang mengalahkan seleksi. Lasso untuk sinyal sparse", why: "Benar. Tidak tahu strukturnya? Coba keduanya via CV.", correct: true },
            { text: "OLS saja", why: "Salah. 50 variabel berkorelasi = OLS liar." },
            { text: "Buang 40 variabel manual", why: "Salah. Membuang manual tanpa kriteria = membuang informasi." },
          ],
        },
      ],
    },
  ],
};

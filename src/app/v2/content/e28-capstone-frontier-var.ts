import type { V2Lesson } from "../lib/types";

export const e28: V2Lesson = {
  slug: "e28-capstone-frontier-var",
  track: "Financial Markets",
  module: "Capstone",
  title: "E28. Capstone: Efficient Frontier App + VaR/ES",
  estMinutes: 60,
  steps: [
    {
      id: "brief",
      eyebrow: "Langkah 1 · Brief capstone",
      title: "Tugasmu: bangun app mini frontier + VaR/ES",
      prose: [
        "Capstone ini menggabungkan tiga lesson sebelumnya menjadi satu produk kerja: E8 (Markowitz dan diversifikasi), E9 (CAPM dan Sharpe), dan E13 (VaR, Expected Shortfall, dan stress test). Deliverable-mu: sebuah app mini — boleh notebook Python, boleh halaman web sederhana — yang menerima data return, menghitung efficient frontier dari 3 aset, menemukan minimum-variance portfolio, lalu mengukur VaR dan Expected Shortfall portofolio itu.",
        "Dataset (ilustratif): return bulanan 20 bulan untuk tiga aset — A (saham siklikal), B (obligasi), C (saham defensif). Angka-angka ini sintetis dan hanya untuk belajar, bukan data pasar nyata. Mean return: A 0,50%, B 0,35%, C 0,55% per bulan. Volatilitas: A 2,21%, B 1,84%, C 1,85% per bulan. Korelasi A–B −0,07, A–C 0,48, B–C 0,05 — B hampir tidak berkorelasi dengan keduanya, sehingga ia menjadi penyeimbang portofolio. Risk-free rate ilustratif: 0,30% per bulan. Nilai portofolio ilustratif untuk VaR: Rp100 juta.",
        "Kriteria lolos capstone: (1) mean dan kovarians dihitung benar dari data; (2) minimum-variance portfolio ditemukan lewat grid bobot dan hasilnya masuk akal; (3) VaR historis dan parametrik dihitung dari return portofolio yang sama, lalu dibandingkan; (4) ES dihitung dan dijelaskan kenapa ia lebih besar dari VaR; (5) app menampilkan kesimpulan dalam bahasa manusia, bukan sekadar angka.",
      ],
      tasks: [],
      reference: "Capstone = E8 + E9 + E13 dalam satu app: frontier, Sharpe, VaR, ES.",
    },
    {
      id: "return-kovarians",
      eyebrow: "Langkah 2 · Return & kovarians",
      title: "Fondasi app: mean return dan matriks kovarians",
      prose: [
        "Setiap app portofolio berdiri di atas dua objek: vektor mean return (ekspektasi tiap aset) dan matriks kovarians (bagaimana aset bergerak bersama). Dari 20 bulan data ilustratif, mean return: A 0,0050, B 0,0035, C 0,0055 per bulan. Volatilitas (akar variansi, pembagi n−1): A 0,0221, B 0,0184, C 0,0185. Kovarians A–B negatif kecil (−0,000029): saat A naik, B cenderung sedikit turun — inilah bahan baku diversifikasi.",
        "Perhatikan konvensi: numpy memakai pembagi n−1 (sample covariance) lewat np.cov — konsisten dengan cara E13 menghitung standar deviasi. Bila kamu memakai pembagi n, seluruh angka volatilitas bergeser sedikit dan jawaban lab tidak cocok. Selalu catat konvensi yang kamu pakai di app-mu.",
      ],
      formula: String.raw`\mu_i = \frac{1}{n}\sum_{t=1}^{n} R_{i,t} \qquad \Sigma_{ij} = \frac{1}{n-1}\sum_{t=1}^{n}(R_{i,t}-\mu_i)(R_{j,t}-\mu_j)`,
      formulaNote: "μ = mean return; Σ = matriks kovarians (pembagi n−1). Hasil dari data ilustratif: μ = [0,0050; 0,0035; 0,0055]; volatilitas [0,0221; 0,0184; 0,0185].",
      tasks: [
        { id: "t1", text: "Hitung `mu_a`, `mu_b`, `mu_c` (mean return tiap aset)" },
        { id: "t2", text: "Hitung `vol_a` (volatilitas aset A, pembagi n−1)" },
      ],
      expected: "mu_a=0.0050  mu_b=0.0035  mu_c=0.0055  vol_a=0.0221",
      requires: ["numpy"],
      note: {
        title: "Sering salah",
        body: "Mencampur pembagi n dan n−1 antar langkah. Pilih satu konvensi (di sini n−1, sample) dan pakai konsisten sampai VaR/ES — kalau tidak, frontier dan VaR bicara tentang dua portofolio yang berbeda.",
      },
      hints: [
        "R = np.column_stack([A, B, C]); mu = R.mean(axis=0).",
        "vol_a = np.std(A, ddof=1) — ddof=1 berarti pembagi n−1.",
        "mu_a = mu[0], mu_b = mu[1], mu_c = mu[2].",
      ],
      code: {
        starter: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\n\n# TULIS KODEMU: mean tiap aset dan volatilitas A (ddof=1)\nmu_a = \nmu_b = \nmu_c = \nvol_a = \n\nprint(f"mu_a={mu_a:.4f}  mu_b={mu_b:.4f}  mu_c={mu_c:.4f}  vol_a={vol_a:.4f}")`,
        lockLines: 5,
        solution: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\n\n# TULIS KODEMU: mean tiap aset dan volatilitas A (ddof=1)\nmu_a = R.mean(axis=0)[0]\nmu_b = R.mean(axis=0)[1]\nmu_c = R.mean(axis=0)[2]\nvol_a = np.std(A, ddof=1)\n\nprint(f"mu_a={mu_a:.4f}  mu_b={mu_b:.4f}  mu_c={mu_c:.4f}  vol_a={vol_a:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mu_a", value: 0.005, tol: 0.0005, label: "`mu_a` = 0,0050", msg: "Rata-rata 20 bulan return A = 0,50% per bulan." },
          { kind: "equal", task: "t1", name: "mu_b", value: 0.0035, tol: 0.0005, label: "`mu_b` = 0,0035", msg: "Rata-rata return B = 0,35% per bulan." },
          { kind: "equal", task: "t1", name: "mu_c", value: 0.0055, tol: 0.0005, label: "`mu_c` = 0,0055", msg: "Rata-rata return C = 0,55% per bulan." },
          { kind: "equal", task: "t2", name: "vol_a", value: 0.0221, tol: 0.001, label: "`vol_a` ≈ 0,0221", msg: "Standar deviasi A (n−1) = 2,21% per bulan." },
          { kind: "stdout_matches", task: "t2", pattern: "mu_a=0\\.0050\\s+mu_b=0\\.0035\\s+mu_c=0\\.0055\\s+vol_a=0\\.0221", label: "`print` menampilkan keempat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Mean + kovarians (n−1) = fondasi. Catat konvensimu di app.",
    },
    {
      id: "frontier-grid",
      eyebrow: "Langkah 3 · Efficient frontier",
      title: "Grid bobot: cari portofolio variansi minimum",
      prose: [
        "Efficient frontier adalah himpunan portofolio yang memberi return tertinggi untuk tiap level risiko. Cara paling jujur untuk menemukannya di app mini: grid search. Coba semua kombinasi bobot dengan langkah 5% (w1 + w2 + w3 = 100%), hitung return dan volatilitas tiap kombinasi (rumus E8: return = w·μ, variansi = wᵀΣw), lalu simpan yang variansinya terkecil.",
        "Hasil grid pada data ilustratif: vol minimum ≈ 0,0126 pada bobot w1 = 0,25, w2 = 0,45, w3 = 0,30 — jauh di bawah volatilitas tiap aset sendirian (1,84–2,21%). Itulah diskon diversifikasi E8, kini terhitung oleh app-mu sendiri. Sebagai pembanding, solusi analitik (invers matriks kovarians) memberi bobot [0,2250; 0,4673; 0,3077] dengan vol 0,0125 — grid 5% sudah sangat dekat. Return minimum-variance portfolio ≈ 0,45% per bulan. Catatan E8 tetap berlaku: bobot optimal ini setepat estimasi inputnya — jangan over-presisi.",
      ],
      formula: String.raw`E[R_p] = w^T\mu \qquad \sigma_p^2 = w^T\Sigma w \qquad \sum w_i = 1`,
      formulaNote: "Grid langkah 5% pada data ilustratif: vol minimum ≈ 0,0126 pada bobot [0,25; 0,45; 0,30]. Solusi analitik: bobot [0,2250; 0,4673; 0,3077], vol 0,0125, return 0,0045.",
      tasks: [
        { id: "t1", text: "Grid search langkah 0,05: hitung `vol_min` (volatilitas minimum)" },
        { id: "t2", text: "Hitung `w1_best`, `w2_best`, `w3_best` (bobot pemenang grid)" },
      ],
      expected: "vol_min=0.0126  w1_best=0.25  w2_best=0.45  w3_best=0.30",
      requires: ["numpy"],
      note: {
        title: "Sering salah",
        body: "Lupa syarat bobot berjumlah 1 (w3 = 1 − w1 − w2). Grid yang membiarkan total bobot 120% menghitung portofolio yang tidak bisa dibeli — frontier-nya fiktif.",
      },
      hints: [
        "Loop i 0..20, j 0..(20−i); k = 20−i−j; w = [i/20, j/20, k/20].",
        "vol = np.sqrt(w @ cov @ w); simpan yang terkecil (perbandingan ketat, bukan ≤).",
        "cov = np.cov(R, rowvar=False) sudah dihitung di starter.",
      ],
      code: {
        starter: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\ncov = np.cov(R, rowvar=False)\n\n# TULIS KODEMU: grid bobot langkah 0,05, cari vol minimum\nvol_min = 1.0\nw1_best = w2_best = w3_best = 0.0\nfor i in range(21):\n    for j in range(21 - i):\n        k = 20 - i - j\n        w = np.array([i / 20, j / 20, k / 20])\n        vol = \n        if vol < vol_min:\n            vol_min = \n            w1_best, w2_best, w3_best = \n\nprint(f"vol_min={vol_min:.4f}  w1_best={w1_best:.2f}  w2_best={w2_best:.2f}  w3_best={w3_best:.2f}")`,
        lockLines: 6,
        solution: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\ncov = np.cov(R, rowvar=False)\n\n# TULIS KODEMU: grid bobot langkah 0,05, cari vol minimum\nvol_min = 1.0\nw1_best = w2_best = w3_best = 0.0\nfor i in range(21):\n    for j in range(21 - i):\n        k = 20 - i - j\n        w = np.array([i / 20, j / 20, k / 20])\n        vol = float(np.sqrt(w @ cov @ w))\n        if vol < vol_min:\n            vol_min = vol\n            w1_best, w2_best, w3_best = w[0], w[1], w[2]\n\nprint(f"vol_min={vol_min:.4f}  w1_best={w1_best:.2f}  w2_best={w2_best:.2f}  w3_best={w3_best:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "vol_min", value: 0.0126, tol: 0.001, label: "`vol_min` ≈ 0,0126", msg: "Vol minimum grid = 1,26% per bulan — di bawah vol tiap aset sendirian." },
          { kind: "equal", task: "t2", name: "w1_best", value: 0.25, tol: 0.001, label: "`w1_best` = 0,25", msg: "Bobot grid pemenang: A 25%." },
          { kind: "equal", task: "t2", name: "w2_best", value: 0.45, tol: 0.001, label: "`w2_best` = 0,45", msg: "Bobot grid pemenang: B 45% — obligasi menjadi penyeimbang." },
          { kind: "stdout_matches", task: "t2", pattern: "vol_min=0\\.0126\\s+w1_best=0\\.25\\s+w2_best=0\\.45\\s+w3_best=0\\.30", label: "`print` menampilkan vol dan bobot", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Grid 5% ≈ solusi analitik. Vol minimum 1,26% vs aset 1,84–2,21% = diskon diversifikasi.",
    },
    {
      id: "cml-sharpe",
      eyebrow: "Langkah 4 · Capital market line & Sharpe",
      title: "Dari frontier ke CML: berapa harga satu unit risiko?",
      prose: [
        "Tambahkan aset bebas risiko (risk-free rate ilustratif 0,30% per bulan) dan frontier berubah menjadi garis: capital market line (CML). Garis ini menyinggung frontier di tangency portfolio — portofolio berisiko dengan Sharpe ratio tertinggi. Sharpe = (return portofolio − risk-free) / volatilitas: kelebihan return per satu unit risiko.",
        "Pada data ilustratif, minimum-variance portfolio (return 0,45%, vol 1,25%) punya Sharpe bulanan = (0,0045 − 0,0030) / 0,0125 ≈ 0,12. Portofolio bobot sama (return 0,47%, vol 1,31%) punya Sharpe ≈ 0,13 — sedikit lebih tinggi! Selisih 0,01 ini kecil dan berada dalam noise estimasi dari hanya 20 bulan data — jangan dijadikan dasar alokasi. Pelajaran capstone yang penting: portofolio risiko TERKECIL belum tentu portofolio TERBAIK per unit risiko. App-mu harus menampilkan keduanya dan membiarkan pengguna memilih sesuai tujuan: tidur nyenyak (vol minimum) atau return per risiko maksimum (Sharpe maksimum). Sharpe bulanan 0,12 setara dengan Sharpe tahunan sekitar 0,42 (kali akar 12) — realistis untuk data ilustratif, bukan angka fantasi.",
      ],
      formula: String.raw`\text{Sharpe} = \frac{E[R_p] - R_f}{\sigma_p} \qquad \text{CML: } E[R] = R_f + \text{Sharpe}_{\text{max}} \cdot \sigma`,
      formulaNote: "Rf ilustratif 0,30% per bulan. Min-var: (0,0045 − 0,0030) / 0,0125 ≈ 0,12. Bobot sama: (0,0047 − 0,0030) / 0,0131 ≈ 0,13. Sharpe tahunan ≈ Sharpe bulanan × √12.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sharpe memakai volatilitas sebagai satu-satunya ukuran risiko — ia buta terhadap ekor (skewness, kurtosis). Portofolio dengan Sharpe tertinggi bisa menyimpan risiko ekor terbesar. Itulah kenapa langkah berikutnya (VaR/ES) wajib ada di app-mu.",
      },
      reference: "CML = garis dari Rf menyinggung frontier. Sharpe = harga satu unit risiko.",
    },
    {
      id: "var-dua-metode",
      eyebrow: "Langkah 5 · VaR historis & parametrik",
      title: "Dua cara mengukur VaR portofolio — dan kenapa berbeda",
      prose: [
        "Ambil return bulanan minimum-variance portfolio (bobot analitik dibulatkan [0,225; 0,467; 0,308] dari Langkah 3 — bukan bobot grid [0,25; 0,45; 0,30]) pada data ilustratif 20 bulan. Bulan terburuk: −2,92% (bulan ke-5, saat ketiga aset jatuh bersamaan). VaR historis 95% = −return terburuk ke-2 (persentil 5% dari 20 data) = 0,0222 = 2,22% per bulan. Pada portofolio ilustratif Rp100 juta, itu ≈ Rp2,23 juta.",
        "VaR parametrik 95% memakai asumsi normal: −(mean − 1,645 × sd). Mean return portofolio 0,45%, sd 1,25% (analitik) → VaR = −(0,0045 − 1,645 × 0,0125) = 0,0162 = 1,62% per bulan (≈ Rp1,62 juta). VaR parametrik LEBIH KECIL dari VaR historis — persis peringatan E13: asumsi normal meremehkan ekor, karena return nyata punya ekor lebih tebal dari kurva normal. App yang baik menampilkan keduanya dan memberi tahu pengguna mana yang lebih konservatif dan kenapa.",
      ],
      formula: String.raw`VaR^{hist}_{95\%} = -\text{persentil ke-5 return} \qquad VaR^{param}_{95\%} = -(\mu - 1{,}645\cdot\sigma)`,
      formulaNote: "Data ilustratif, bobot min-var analitik dibulatkan [0,225; 0,467; 0,308] (vol 1,25% analitik; grid memberi 1,26%). VaR historis 95% = 0,0222 (≈ Rp2,23 jt dari Rp100 jt); VaR parametrik 95% = 0,0162 (≈ Rp1,62 jt). Historis lebih besar karena menangkap ekor nyata.",
      tasks: [
        { id: "t1", text: "Hitung `var_hist` (VaR historis 95% dari return portofolio)" },
        { id: "t2", text: "Hitung `var_param` (VaR parametrik 95%, z = 1,645)" },
      ],
      expected: "var_hist=0.0222  var_param=0.0162",
      requires: ["numpy"],
      note: {
        title: "Sering salah",
        body: "Menghitung VaR dari return ASET, bukan return PORTOFOLIO. VaR portofolio memakai deret return portofolio (R @ w) — diversifikasi sudah bekerja di dalamnya, sehingga VaR-nya lebih kecil dari VaR tiap aset sendirian.",
      },
      hints: [
        "rp = R @ w sudah dihitung; rs = np.sort(rp); k = int(0,05 × 20) = 1.",
        "var_hist = −rs[k] (terburuk ke-2, bukan terburuk ke-1).",
        "var_param = −(mean − 1,645 × sd) dengan sd pembagi n−1.",
      ],
      code: {
        starter: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\nw = np.array([0.225, 0.467, 0.308])\nrp = R @ w\nrs = np.sort(rp)\nk = int(0.05 * len(rs))\n\n# TULIS KODEMU: VaR historis dan parametrik 95%\nvar_hist = \nmean = rp.mean()\nsd = rp.std(ddof=1)\nvar_param = \n\nprint(f"var_hist={var_hist:.4f}  var_param={var_param:.4f}")`,
        lockLines: 9,
        solution: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\nw = np.array([0.225, 0.467, 0.308])\nrp = R @ w\nrs = np.sort(rp)\nk = int(0.05 * len(rs))\n\n# TULIS KODEMU: VaR historis dan parametrik 95%\nvar_hist = -rs[k]\nmean = rp.mean()\nsd = rp.std(ddof=1)\nvar_param = -(mean - 1.645 * sd)\n\nprint(f"var_hist={var_hist:.4f}  var_param={var_param:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_hist", value: 0.0222, tol: 0.001, label: "`var_hist` ≈ 0,0222", msg: "−return terburuk ke-2 dari 20 bulan = 2,22% (≈ Rp2,23 jt dari Rp100 jt)." },
          { kind: "equal", task: "t2", name: "var_param", value: 0.0162, tol: 0.001, label: "`var_param` ≈ 0,0162", msg: "−(0,0045 − 1,645 × 0,0125) = 1,62% — lebih kecil dari historis, sesuai teori ekor tebal." },
          { kind: "stdout_matches", task: "t2", pattern: "var_hist=0\\.0222\\s+var_param=0\\.0162", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "VaR historis = data bicara (2,22%). VaR parametrik = asumsi normal (1,62%).",
    },
    {
      id: "expected-shortfall",
      eyebrow: "Langkah 6 · Expected Shortfall",
      title: "Di balik VaR: seberapa parah saat VaR jebol?",
      prose: [
        "VaR menjawab “seberapa sering”, tetapi bungkam soal “seberapa parah”. Expected Shortfall (ES) menjawabnya: rata-rata kerugian pada hari-hari saat VaR terlampaui. Pada data ilustratif 20 bulan, 5% terburuk = 1 bulan — bulan ke-5 dengan return −2,92%. Jadi ES 95% = 0,0292 = 2,92% per bulan (≈ Rp2,92 juta dari Rp100 juta).",
        "Urutannya bercerita: VaR parametrik 1,62% di bawah VaR historis 2,22%, dan ES 2,92% di atas keduanya — ES selalu lebih besar atau sama dengan VaR, karena ia merata-ratakan ekor, bukan mengambil ambangnya. Inilah alasan Basel/FRTB memakai ES untuk modal risiko pasar: modal harus menutup rata-rata keparahan krisis, bukan sekadar ambang frekuensinya. Peringatan jujur untuk app-mu: dengan hanya 20 bulan data, ES 95% didasarkan pada SATU observasi — sangat berisik. App yang baik menampilkan jumlah observasi ekor dan memperingatkan pengguna bila datanya terlalu pendek.",
      ],
      formula: String.raw`ES_{95\%} = E[\text{Loss} \mid \text{Loss} > VaR_{95\%}]`,
      formulaNote: "Data ilustratif: 5% dari 20 bulan = 1 bulan terburuk (−2,92%) → ES 95% = 0,0292 (≈ Rp2,92 jt dari Rp100 jt). ES ≥ VaR selalu.",
      tasks: [
        { id: "t1", text: "Hitung `es` (rata-rata 5% return terburuk portofolio, sebagai kerugian positif)" },
      ],
      expected: "es=0.0292",
      requires: ["numpy"],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ES dari 20 observasi = rata-rata dari 1 bulan. Satu data baru bisa mengubahnya drastis. Di app-mu, tampilkan ukuran sampel ekor di samping angka ES — angka tanpa ukuran sampel = ketenangan palsu.",
      },
      hints: [
        "rs sudah terurut menaik; k = 1 untuk 5% dari 20 data.",
        "es = −rata-rata rs[:k].",
      ],
      code: {
        starter: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\nw = np.array([0.225, 0.467, 0.308])\nrp = R @ w\nrs = np.sort(rp)\nk = int(0.05 * len(rs))\n\n# TULIS KODEMU: Expected Shortfall 95%\nes = \n\nprint(f"es={es:.4f}")`,
        lockLines: 9,
        solution: `import numpy as np\nA = np.array([0.02, -0.01, 0.03, 0.01, -0.04, 0.04, 0.00, 0.02, -0.03, 0.03, 0.01, -0.02, 0.02, 0.00, -0.01, 0.03, -0.02, 0.01, 0.02, -0.01])\nB = np.array([0.01, 0.02, -0.01, 0.03, -0.03, -0.02, 0.02, 0.01, -0.02, -0.01, 0.02, 0.01, -0.01, 0.02, 0.00, -0.02, 0.01, 0.03, -0.01, 0.02])\nC = np.array([0.03, 0.01, 0.02, -0.02, -0.02, 0.01, -0.01, 0.03, -0.02, 0.02, 0.00, 0.03, 0.01, -0.01, 0.02, 0.01, -0.03, 0.02, 0.00, 0.01])\nR = np.column_stack([A, B, C])\nw = np.array([0.225, 0.467, 0.308])\nrp = R @ w\nrs = np.sort(rp)\nk = int(0.05 * len(rs))\n\n# TULIS KODEMU: Expected Shortfall 95%\nes = -rs[:k].mean()\n\nprint(f"es={es:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "es", value: 0.0292, tol: 0.001, label: "`es` ≈ 0,0292", msg: "Rata-rata 5% terburuk = bulan −2,92% → ES 2,92% (≈ Rp2,92 jt dari Rp100 jt)." },
          { kind: "stdout_matches", task: "t1", pattern: "es=0\\.0292", label: "`print` menampilkan ES", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ES 2,92% di atas VaR historis 2,22% dan VaR parametrik 1,62% — urutan yang benar.",
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 7 · Deliverable",
      title: "Merakit app dan menilai diri sendiri",
      prose: [
        "Deliverable capstone: satu app mini yang menjalankan seluruh rantai — (1) terima data return (tempelkan dataset ilustratif atau unggah CSV dengan format yang sama), (2) tampilkan mean, volatilitas, dan matriks korelasi tiap aset, (3) gambar efficient frontier dari grid bobot dan tandai minimum-variance portfolio serta tangency portfolio, (4) tampilkan VaR historis, VaR parametrik, dan ES 95% portofolio minimum-variance dalam rupiah, (5) tulis kesimpulan satu paragraf dalam bahasa manusia: portofolio ini cocok untuk siapa, dan apa kelemahan terbesarnya.",
        "Rubrik nilai diri (total 100): kebenaran hitungan 40% — semua angka lab cocok dengan jawaban yang diharapkan dan konvensi n−1 konsisten; frontier lengkap 25% — grid menutup seluruh rentang bobot dan minimum-variance portfolio ditandai dengan benar; VaR dan ES plus interpretasi 25% — ketiga angka tampil, urutannya benar (parametrik di bawah historis di bawah ES), dan dijelaskan kenapa berbeda; kerapian dan kejujuran 10% — dataset dilabeli ilustratif, ukuran sampel ekor ditampilkan, dan keterbatasan (estimation error E8, ekor tebal E13) ditulis eksplisit. Nilai dirimu dengan jujur: di bawah 70 berarti ulangi satu langkah yang paling lemah; di atas 85 berarti app-mu layak ditunjukkan ke orang lain.",
        "Tantangan lanjutan bila sempat: tambah slider bobot interaktif (geser w1 dan lihat frontier bergerak), tambah backtest sederhana (hitung pelanggaran VaR seperti E13 Langkah 3), atau ganti dataset ilustratif dengan return nyata dari sumber terbuka — dan catat bagaimana frontier berubah ketika data nyata masuk.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: app yang baik = kalkulator yang jujur",
        body: "App mini ini bukan soal grafik yang cantik — soal kejujuran angka. Tampilkan konvensi, ukuran sampel, dan keterbatasan di samping setiap angka. Pengguna yang tahu keterbatasan model adalah pengguna yang tidak akan disakiti oleh model itu.",
      },
      reference: "Deliverable: input return → frontier + min-var + VaR/ES + kesimpulan bahasa manusia.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Fondasi app: mean return dan matriks kovarians (pembagi n−1) dari data return.",
        "Efficient frontier dari grid bobot: vol minimum 1,26% pada bobot [25%; 45%; 30%] — di bawah vol tiap aset.",
        "CML dan Sharpe: min-var Sharpe bulanan 0,12; bobot sama 0,13 — risiko terkecil belum tentu Sharpe tertinggi.",
        "VaR 95% portofolio: historis 2,22% di atas parametrik 1,62% — asumsi normal meremehkan ekor.",
        "ES 95% = 2,92% — rata-rata keparahan saat VaR jebol; selalu di atas VaR; waspadai sampel ekor yang kecil.",
      ],
      next: { label: "E29 — Nonprofit & Finance for Public Purpose", href: "/v2/learn/e29-nonprofit-finance" },
      quiz: [
        {
          q: "Minimum-variance portfolio dari grid (data ilustratif) punya vol 1,26%, sedangkan tiap aset bervol 1,84–2,21%. Apa artinya?",
          options: [
            { text: "Grid salah hitung — vol portofolio tidak bisa di bawah vol anggotanya", why: "Salah: bisa — itulah diskon diversifikasi dari korelasi rendah (E8)." },
            { text: "Diskon diversifikasi: korelasi rendah antar aset menurunkan risiko portofolio", why: "Benar: B hampir tidak berkorelasi dengan A dan C — penggabungan menenangkan portofolio.", correct: true },
            { text: "Volatilitas aset dihitung dengan pembagi yang salah", why: "Salah: konvensi n−1 dipakai konsisten di semua langkah." },
            { text: "Return portofolio pasti lebih tinggi", why: "Salah: vol rendah tidak menjamin return tinggi — return min-var hanya 0,45% per bulan." },
          ],
        },
        {
          q: "VaR historis 95% = 2,22%, VaR parametrik 95% = 1,62%. Kenapa parametrik lebih kecil?",
          options: [
            { text: "Karena data historis salah", why: "Salah: data historis justru menangkap ekor nyata." },
            { text: "Asumsi normal meremehkan ekor — return nyata lebih tebal ekornya dari kurva normal", why: "Benar: inilah peringatan E13 yang kini terhitung di app-mu sendiri.", correct: true },
            { text: "Karena z = 1,645 terlalu besar", why: "Salah: z lebih besar justru memperbesar VaR parametrik." },
            { text: "Karena portofolio berbeda", why: "Salah: keduanya dihitung dari return portofolio yang sama." },
          ],
        },
        {
          q: "ES 95% portofolio = 2,92%. Apa makna angka ini?",
          options: [
            { text: "Rugi maksimal portofolio", why: "Salah: ES bukan maksimum — ia rata-rata kerugian saat VaR terlampaui." },
            { text: "Rata-rata kerugian pada bulan-bulan saat VaR 95% terlampaui", why: "Benar: ES menjawab kedalaman ekor, bukan frekuensinya.", correct: true },
            { text: "Frekuensi kerugian melebihi VaR", why: "Salah: itu yang dijawab VaR, bukan ES." },
            { text: "Keuntungan yang diharapkan", why: "Salah: ES bicara tentang kerugian ekor." },
          ],
        },
        {
          q: "Sharpe min-var 0,12 vs bobot sama 0,13 (bulanan). Kesimpulan yang benar?",
          options: [
            { text: "Bobot sama selalu lebih baik dari min-var", why: "Salah: hanya pada data ini dan hanya untuk kriteria Sharpe — tujuan lain bisa memilih min-var." },
            { text: "Risiko terkecil belum tentu memberi return per unit risiko tertinggi — pilih sesuai tujuan", why: "Benar: min-var menang di vol, bobot sama menang tipis di Sharpe.", correct: true },
            { text: "Sharpe tidak berguna", why: "Salah: Sharpe berguna — ia hanya bukan satu-satunya kriteria." },
            { text: "Min-var salah hitung", why: "Salah: kedua angka dihitung benar dari data yang sama." },
          ],
        },
        {
          q: "ES dihitung dari 20 bulan data (5% terburuk = 1 bulan). Apa kelemahan terbesarnya?",
          options: [
            { text: "Tidak ada — ES selalu akurat", why: "Salah: ES dari 1 observasi sangat berisik." },
            { text: "Sampel ekor terlalu kecil — satu bulan menentukan seluruh angka; app wajib menampilkan ukuran sampel", why: "Benar: kejujuran sampel adalah bagian dari deliverable.", correct: true },
            { text: "ES harus lebih kecil dari VaR", why: "Salah: terbalik — ES selalu lebih besar atau sama dengan VaR." },
            { text: "ES tidak bisa dihitung dari data historis", why: "Salah: ES historis justru metode standar." },
          ],
        },
      ],
    },
  ],
};

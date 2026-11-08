import type { V2Lesson } from "../lib/types";

export const b7_2: V2Lesson = {
  slug: "b7-distribusi-kontinu-2",
  track: "Probabilitas",
  module: "Distribusi",
  title: "B7.2 Distribusi Kontinu 2: Gamma, Beta, t, Chi-Square & Pareto",
  estMinutes: 55,
  steps: [
    {
      id: "rata-rata-tak-ada",
      eyebrow: "Langkah 1 · Ketika rata-rata tidak ada",
      title: "Rp2 miliar \u2192 Rp8 miliar \u2192 Rp5 miliar \u2192 Rp11 miliar",
      prose: [
        "Manajer kekayaan melapor: \u201CRata-rata kekayaan nasabah kami Rp2 miliar.\u201D Kamu hitung ulang dengan data lengkap \u2014 dapat Rp8 miliar. Tambah data lagi \u2014 Rp5 miliar. Tambah lagi \u2014 Rp11 miliar. Rata-ratanya tidak pernah stabil!",
        "Ini bukan error \u2014 ini distribusi Pareto: ekor sangat tebal sehingga mean teoritisnya bisa tak berhingga (untuk parameter tertentu). Hukum bilangan besar (B11) gagal di sini. Jika datamu Pareto tapi diperlakukan seperti Normal, seluruh analisismu \u2014 mean, SD, interval \u2014 runtuh.",
        "Di dunia Pareto, \u201Clebih banyak data\u201D TIDAK menenangkan estimasi; ia mengekspos bahwa satu observasi ekstrem bisa mengalahkan sejuta observasi biasa. Big data tidak menyelamatkan model yang salah keluarga distribusi \u2014 ia hanya membuat kesalahanmu lebih presisi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CEkor tebal = outlier yang harus dibuang.\u201D Pada Pareto, raksasa BUKAN error \u2014 mereka ciri distribusinya dan mendominasi total! Membuang klaim terbesar dari data asuransi = membuang bagian terpenting risiko. Ekor tebal dimodelkan (B16), bukan dihapus.",
      },
      reference: "Curiga ekor tebal \u2192 plot log-log dulu; Pareto = garis lurus.",
    },
    {
      id: "gamma",
      eyebrow: "Langkah 2 · Gamma",
      title: "Menunggu kejadian ke-\u03B1",
      prose: [
        "Gamma(\u03B1, \u03B2): waktu tunggu sampai kejadian ke-\u03B1 jika kejadian datang dengan laju \u03B2. E[X] = \u03B1/\u03B2. \u03B1=1 \u2192 persis Eksponensial(\u03B2). Gamma = \u201CEksponensial yang digeneralisasi\u201D; \u03B1 bulat = Erlang: jumlah \u03B1 Eksponensial independen.",
        "Kapan memakai: total waktu tunggu beberapa kejadian (waktu sampai klaim ke-5), jumlah curah hujan, waktu antar kegagalan mesin. Juga sebagai prior konjugat untuk laju Poisson (B17!).",
        "Ingat rantai: Eksponensial (tunggu 1) \u2192 Erlang/Gamma (tunggu \u03B1). Pasangan diskretnya: Geometrik (tunggu 1 sukses) \u2192 Negatif Binomial (tunggu r). Empat distribusi, satu pola \u201Cwaktu tunggu\u201D.",
      ],
      formula: String.raw`f(x) = \frac{\beta^\alpha}{\Gamma(\alpha)}\, x^{\alpha-1} e^{-\beta x}, \quad E[X] = \frac{\alpha}{\beta}`,
      formulaNote: "α (alpha) = parameter bentuk: banyak kejadian yang ditunggu; β (beta) = parameter laju: kejadian per satuan waktu; Γ(α) = fungsi gamma, untuk α bulat nilainya (α−1)! — konstanta penormal agar total luas 1; x^(α−1)·e^(−βx) = bentuk kurva: naik polinomial lalu meluruh eksponensial. E[X] = α/β: α kejadian @ laju β. Contoh angka: α = 3, β = 2/jam → E[X] = 1,5 jam — angka ini artinya menunggu 3 kejadian yang datang 2 per jam rata-rata memakan 1,5 jam; α = 1 tepat menjadi Eksponensial(β) — Gamma adalah Eksponensial yang digeneralisasi untuk menunggu lebih dari satu kejadian.",
      tasks: [
        { id: "t1", text: "Hitung `e` = ekspektasi waktu sampai klaim ke-5 (laju 2/jam)" },
        { id: "t2", text: "Cetak `e` dalam jam" },
      ],
      expected: "e=2.5 jam",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Waktu tunggu klaim ke-k menentukan kapan cadangan habis. Gamma memodelkan akumulasi kejadian \u2014 bukan kejadian tunggal.",
      },
      hints: [
        "E[X] = alpha / beta.",
        "alpha=5, beta=2 \u2192 2,5 jam.",
        "print(f\"e={e} jam\")",
      ],
      code: {
        starter: `alpha, beta = 5, 2  # klaim ke-5, laju 2/jam\n\n# TULIS KODEMU: ekspektasi waktu tunggu\ne = \n\nprint(f"e={e} jam")`,
        lockLines: 1,
        solution: `alpha, beta = 5, 2  # klaim ke-5, laju 2/jam\n\n# TULIS KODEMU: ekspektasi waktu tunggu\ne = alpha / beta\n\nprint(f"e={e} jam")`,
        checks: [
          { kind: "equal", task: "t1", name: "e", value: 2.5, tol: 1e-9, label: "`e` seharusnya 2,5", msg: "5/2 = 2,5 jam." },
          { kind: "stdout_matches", task: "t2", pattern: "e=2\\.5 jam", label: "`print` menampilkan e", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "\u03B1=1 \u2192 Eksponensial. Generalisasi untuk beberapa kejadian.",
    },
    {
      id: "beta",
      eyebrow: "Langkah 3 · Beta",
      title: "Distribusi untuk peluang",
      prose: [
        "Beta(a,b): variabel acak di [0,1] \u2014 cocok untuk peluang yang tidak diketahui, proporsi, rate. E[X] = a/(a+b). Interpretasi ajaib: Beta(a,b) bisa dibaca sebagai \u201Cpunya bukti setara a\u22121 sukses dan b\u22121 gagal\u201D. Beta(1,1) = Uniform(0,1) = \u201Ctidak tahu apa-apa\u201D.",
        "Kapan memakai: prior konjugat untuk peluang Binomial (B17): mulai Beta(a,b), amati s sukses & f gagal \u2192 posterior Beta(a+s, b+f). Sesederhana tambah! Juga untuk LGD (0\u20131), conversion rate, pangsa pasar.",
        "Contoh: prior PD ~ Beta(2,38) (mean 5%). Data baru: 100 nasabah, 8 gagal. Posterior = Beta(2+8, 38+92) = Beta(10,130). Mean posterior = 10/140 \u2248 7,14% \u2014 di antara prior 5% dan data 8%. Prior \u201Cmenahan\u201D agar tidak terlalu reaktif \u2014 inilah shrinkage.",
      ],
      formula: String.raw`f(x) = \frac{x^{a-1}(1-x)^{b-1}}{B(a,b)}, \quad E[X] = \frac{a}{a+b} \quad \text{Beta}(a,b) + \text{data } s/f \to \text{Beta}(a+s,\,b+f)`,
      formulaNote: "a, b = parameter bentuk; baca sebagai bukti semu: a−1 sukses dan b−1 gagal yang sudah dilihat — Beta(a,b) seperti punya pengalaman setara a sukses dan b gagal. B(a,b) = konstanta penormal. E[X] = a/(a+b): proporsi sukses dari total bukti. Aturan update Beta(a,b) + data s sukses/f gagal → Beta(a+s, b+f): Bayesian tanpa integral. Contoh angka: Beta(2,8) → E = 0,2 — angka ini artinya seperti sudah melihat 2 sukses dan 8 gagal, keyakinan 20% dengan kekuatan 10 observasi; datang data 3 sukses 7 gagal → Beta(5,15), E = 0,25 — prior 10 dan data 10 berbobot sama, posterior tepat di tengahnya.",
      tasks: [
        { id: "t1", text: "Hitung posterior `pa`, `pb` dari prior Beta(2,38) + data 8/100" },
        { id: "t2", text: "Hitung `mean_post`, cetak dengan 2 desimal persen" },
      ],
      expected: "mean_post=7.14%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Estimasi PD mentah 8% dari 100 nasabah itu reaktif. Prior Beta men-shrink ke 7,14% \u2014 stabil untuk pricing, tidak panik oleh satu sampel kecil.",
      },
      hints: [
        "pa = 2+8; pb = 38+(100-8).",
        "mean_post = pa/(pa+pb).",
        "print(f\"mean_post={mean_post:.2%}\")",
      ],
      code: {
        starter: `# Prior Beta(2,38): mean 5%. Data: 8 gagal dari 100.\n\n# TULIS KODEMU: posterior Beta-Binomial\npa = \npb = \nmean_post = \n\nprint(f"mean_post={mean_post:.2%}")`,
        lockLines: 1,
        solution: `# Prior Beta(2,38): mean 5%. Data: 8 gagal dari 100.\n\n# TULIS KODEMU: posterior Beta-Binomial\npa = 2 + 8\npb = 38 + (100 - 8)\nmean_post = pa / (pa + pb)\n\nprint(f"mean_post={mean_post:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pa", value: 10, tol: 1e-9, label: "`pa` seharusnya 10", msg: "2 + 8 = 10." },
          { kind: "equal", task: "t1", name: "pb", value: 130, tol: 1e-9, label: "`pb` seharusnya 130", msg: "38 + 92 = 130." },
          { kind: "equal", task: "t2", name: "mean_post", value: 10 / 140, tol: 0.001, label: "`mean_post` seharusnya \u2248 7,14%", msg: "10/140 \u2248 0,0714." },
          { kind: "stdout_matches", task: "t2", pattern: "mean_post=7\\.14%", label: "`print` menampilkan mean_post", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Beta = distribusi untuk peluang. Update = tambah sukses/gagal.",
    },
    {
      id: "t-chisquare",
      eyebrow: "Langkah 4 · t dan Chi-Square",
      title: "Distribusi sampling: dari mana uji-t berasal",
      prose: [
        "Distribusi t: seperti Normal tapi ekor lebih tebal \u2014 karena SD-nya sendiri diestimasi dari sampel kecil (tidak diketahui pasti). Makin kecil derajat bebas \u03BD, makin tebal ekor; \u03BD\u2192\u221E \u2192 Normal. Dipakai untuk uji-t dan interval mean sampel kecil; return keuangan juga sering dimodelkan dengan t (ekor tebal!).",
        "Chi-Square: Q = jumlah kuadrat k Normal standar \u2192 \u03C7\u00B2_k. E[Q]=k, Var=2k. Dipakai untuk uji independensi/homogenitas, interval varians \u2014 dan \u03C7\u00B2 adalah fondasi distribusi t dan F.",
        "Contoh: n=10, mean sampel 8,2, s=1,5. Interval 95% untuk mean \u2014 pakai t df=9: t=2,262 (vs z=1,96). SE = 1,5/\u221A10 \u2248 0,474. Interval: 8,2 \u00B1 2,262\u00D70,474 = (7,13; 9,27). Kalau (salah) pakai z: (7,27; 9,13) \u2014 terlalu sempit, kepercayaan palsu.",
      ],
      formula: String.raw`T = \frac{Z}{\sqrt{V/\nu}} \qquad Q = \sum_{i=1}^{k} Z_i^2 \sim \chi^2_k`,
      formulaNote: "Z = Normal standar; V = variabel chi-square; ν (nu) = derajat bebas: ukuran sampel di balik estimasi σ — makin kecil ν, makin tidak pasti estimasi σ, makin tebal ekor t. T = Z/√(V/ν): Normal yang simpangan bakunya sendiri acak — itulah mengapa ekornya tebal. Q = Σ Z_i² ~ χ²_k: jumlah k kuadrat Normal standar; k = derajat bebas. Contoh angka: t dengan ν = 5 punya peluang di |T|>2 sekitar dua kali lipat dibanding Normal — angka ini artinya interval kepercayaan dari sampel kecil harus lebih lebar; memakai z = 1,96 untuk n = 6 adalah sesumbar. Saat ν → ∞, t menyatu kembali ke Normal — ketidakpastian σ-nya hilang.",
      tasks: [
        { id: "t1", text: "Hitung `se` = 1,5/\u221A10" },
        { id: "t2", text: "Hitung batas `lo`, `hi` interval-t 95% (t=2,262), cetak" },
      ],
      expected: "lo=7.13  hi=9.27",
      note: {
        title: "Sering salah",
        body: "\u201CUji-t butuh data normal.\u201D Yang butuh (mendekati) normal adalah distribusi sampling mean \u2014 bukan data mentah. Untuk n besar, CLT menyelamatkan. Aturan: n < 30 (atau \u03C3 tak diketahui & n kecil) \u2192 t, bukan z.",
      },
      hints: [
        "se = 1.5 / 10**0.5.",
        "margin = 2.262 * se; lo = 8.2 - margin; hi = 8.2 + margin.",
        "print(f\"lo={lo:.2f}  hi={hi:.2f}\")",
      ],
      code: {
        starter: `import math\nmean, s, n, t = 8.2, 1.5, 10, 2.262\n\n# TULIS KODEMU: interval kepercayaan 95% dengan distribusi t\nse = \nlo = \nhi = \n\nprint(f"lo={lo:.2f}  hi={hi:.2f}")`,
        lockLines: 1,
        solution: `import math\nmean, s, n, t = 8.2, 1.5, 10, 2.262\n\n# TULIS KODEMU: interval kepercayaan 95% dengan distribusi t\nse = s / math.sqrt(n)\nlo = mean - t * se\nhi = mean + t * se\n\nprint(f"lo={lo:.2f}  hi={hi:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.4743, tol: 0.001, label: "`se` seharusnya \u2248 0,474", msg: "1,5/\u221A10 \u2248 0,4743." },
          { kind: "equal", task: "t2", name: "lo", value: 7.13, tol: 0.02, label: "`lo` seharusnya \u2248 7,13", msg: "8,2 \u2212 2,262\u00D70,474 \u2248 7,13." },
          { kind: "equal", task: "t2", name: "hi", value: 9.27, tol: 0.02, label: "`hi` seharusnya \u2248 9,27", msg: "8,2 + 2,262\u00D70,474 \u2248 9,27." },
          { kind: "stdout_matches", task: "t2", pattern: "lo=7\\.1\\d\\s+hi=9\\.2\\d", label: "`print` menampilkan interval", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Trio sampling: Z (mean, \u03C3 diketahui) \u2192 t (mean, \u03C3 diestimasi) \u2192 \u03C7\u00B2 (varians).",
    },
    {
      id: "pareto",
      eyebrow: "Langkah 5 · Pareto",
      title: "Hukum pangkat yang memakan mean",
      prose: [
        "Pareto: P(X>x) = (xm/x)^\u03B1 untuk x \u2265 xm. \u03B1 = indeks ekor \u2014 makin kecil \u03B1, makin tebal ekor. E[X] = \u03B1\u00B7xm/(\u03B1\u22121) jika \u03B1>1. Jika \u03B1\u22642: varians tak hingga! Jika \u03B1\u22641: mean pun tak hingga \u2014 rata-rata sampel tidak konvergen, itulah cerita pembuka.",
        "Contoh: kekayaan ~ Pareto(xm=1 M, \u03B1=1,5). P(kekayaan > 10 M) = (1/10)^1,5 \u2248 3,16%. Bandingkan dengan Normal: P(>10x lipat dari minimum) \u2248 0 \u2014 di Pareto 3%! Ekor tebal = kejadian \u201Cmustahil\u201D yang rutin terjadi. Aturan 80/20: Pareto \u03B1\u22481,16 menghasilkan \u201C80% efek dari 20% sebab\u201D \u2014 bukan hukum alam, hanya satu titik parameter.",
        "Simulasi membuktikan: rata-rata kumulatif Pareto(\u03B1=1,2) meloncat-loncat bahkan di n=5.000, sementara Normal(0,1) tenang. Kalau \u03B1\u22642 \u2014 lupakan SD, pakai kuantil.",
      ],
      formula: String.raw`P(X > x) = \left(\frac{x_m}{x}\right)^{\alpha}, \quad E[X] = \frac{\alpha x_m}{\alpha-1}\ (\alpha>1), \quad \mathrm{Var} = \infty \text{ jika } \alpha \le 2`,
      formulaNote: "x_m = nilai minimum (scale): distribusi mulai dari sini; x = nilai yang ditanya (x ≥ x_m); α (alpha) = indeks ekor: makin KECIL α, makin TEBAL ekor. P(X>x) = (x_m/x)^α: peluang melampaui x meluruh polinomial, bukan eksponensial. E[X] = α·x_m/(α−1) hanya jika α>1; Var = ∞ jika α ≤ 2. Contoh angka: α = 1,5, x_m = 1 → E[X] = 3 — angka ini artinya rata-rata 3 kali lipat minimum, tetapi variansnya takhingga: simpangan baku sampel tidak akan pernah stabil berapa pun datanya, dan satu observasi raksasa bisa mendominasi total. P(X>10) = (1/10)^1,5 ≈ 3,2% — ekor yang menurut Normal mustahil, di sini kejadian rutin.",
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` sampel Pareto(\u03B1=1,2, xm=1)" },
        { id: "t2", text: "Hitung `m100`, `m5000` = mean kumulatif n=100 dan n=5000" },
        { id: "t3", text: "Cetak keduanya 1 desimal" },
      ],
      expected: "mean meloncat (tidak stabil)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Klaim bencana, kerugian operasional, kekayaan: \u03B1 sering 1\u20132. Model risiko yang salah di ekor = bangkrut saat ekor datang (B16/EVT).",
      },
      hints: [
        "pareto: xm / (random.random() ** (1/alpha)).",
        "m100 = sum(xs[:100])/100.",
        "Bandingkan m100 vs m5000 \u2014 jauh berbeda = tidak stabil.",
      ],
      code: {
        starter: `import random\nrandom.seed(71)\nalpha, xm, N = 1.2, 1.0, 5000\nxs = [xm / (random.random() ** (1/alpha)) for _ in range(N)]\n\n# TULIS KODEMU: mean kumulatif n=100 dan n=5000\nm100 = \nm5000 = \n\nprint(f"m100={m100:.1f}  m5000={m5000:.1f}")`,
        lockLines: 3,
        solution: `import random\nrandom.seed(71)\nalpha, xm, N = 1.2, 1.0, 5000\nxs = [xm / (random.random() ** (1/alpha)) for _ in range(N)]\n\n# TULIS KODEMU: mean kumulatif n=100 dan n=5000\nm100 = sum(xs[:100]) / 100\nm5000 = sum(xs) / N\n\nprint(f"m100={m100:.1f}  m5000={m5000:.1f}")`,
        checks: [
          { kind: "defined", task: "t2", name: "m100", label: "`m100` terdefinisi", msg: "Hitung mean 100 sampel pertama." },
          { kind: "defined", task: "t2", name: "m5000", label: "`m5000` terdefinisi", msg: "Hitung mean seluruh 5000 sampel." },
          { kind: "stdout_matches", task: "t3", pattern: "m100=\\d+\\.\\d\\s+m5000=\\d+\\.\\d", label: "`print` menampilkan keduanya", msg: "Cetak dengan format m100=...  m5000=... ." },
        ],
      },
      reference: "\u03B1\u22642 \u2192 lupakan SD; pakai kuantil & EVT (B16).",
    },
    {
      id: "minicase-lgd",
      eyebrow: "Langkah 6 · Mini-case",
      title: "LGD yang \u201Crata-rata 40%\u201D",
      prose: [
        "Bank melapor \u201Crata-rata LGD 40%\u201D. Kamu tarik distribusinya: ternyata bimodal \u2014 60% kasus LGD \u2248 10% (ada agunan), 40% kasus LGD \u2248 85% (tanpa agunan). Tidak ada LGD yang 40%! Rata-rata jatuh di lembah kosong (mirip pelajaran B5).",
        "Pricing berbasis 40% salah harga untuk kedua segmen: kemahalan untuk beragunan (nasabah kabur ke kompetitor), kemurahan untuk tanpa agunan (rugi). Distribusi yang lebih jujur: campuran dua Beta \u2014 Beta untuk \u201Cada agunan\u201D (puncak di 10%) + Beta untuk \u201Ctanpa agunan\u201D (puncak di 85%).",
        "LGD memang standar dimodelkan Beta (0\u20131) \u2014 dan bimodalitas = sinyal segmentasi. Pelajaran: distribusi yang tepat + segmentasi > satu angka rata-rata.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean_campur` = 0,6\u00D710% + 0,4\u00D785%" },
        { id: "t2", text: "Cetak `mean_campur` sebagai persen" },
      ],
      expected: "mean_campur=40.0%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu angka rata-rata menyembunyikan dua populasi berbeda. Pricing, cadangan, dan modal harus per segmen \u2014 bukan per rata-rata.",
      },
      hints: [
        "mean_campur = 0.6*0.10 + 0.4*0.85.",
        "Hasilnya 0.40 \u2014 cocok dengan laporan, tapi menyesatkan.",
        "print(f\"mean_campur={mean_campur:.1%}\")",
      ],
      code: {
        starter: `# 60% LGD ~10% (agunan), 40% LGD ~85% (tanpa agunan)\n\n# TULIS KODEMU: rata-rata campuran\nmean_campur = \n\nprint(f"mean_campur={mean_campur:.1%}")`,
        lockLines: 1,
        solution: `# 60% LGD ~10% (agunan), 40% LGD ~85% (tanpa agunan)\n\n# TULIS KODEMU: rata-rata campuran\nmean_campur = 0.6*0.10 + 0.4*0.85\n\nprint(f"mean_campur={mean_campur:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_campur", value: 0.40, tol: 1e-9, label: "`mean_campur` seharusnya 0,40", msg: "0,6\u00D70,10 + 0,4\u00D70,85 = 0,40 \u2014 tapi tidak ada LGD yang 40%!" },
          { kind: "stdout_matches", task: "t2", pattern: "mean_campur=40\\.0%", label: "`print` menampilkan mean_campur", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bimodal = sinyal segmentasi. Satu rata-rata menyembunyikan dua populasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B8.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ekor menentukan segalanya — α kecil berarti hukum fisika yang berbeda",
        body: "Pareto mengajarkan pelajaran yang tidak nyaman: pada α ≤ 2 variansnya takhingga, pada α ≤ 1 bahkan meannya takhingga. Ini bukan filsafat — ini berarti simpangan baku sampel tidak akan pernah stabil berapa pun datamu, dan rata-rata sampel didominasi oleh observasi terbesar. Praktisi merasakannya sebagai: satu klaim raksasa menghapus seluruh rata-rata tahunan. Heuristik lapangannya: jika nilai maksimum sebanding dengan totalnya, kamu hidup di dunia Pareto — berhentilah mengutip mean dan SD seolah mereka bermakna. Yang bermakna adalah kuantil: VaR, median, ekor. Aturan keputusannya: estimasi α dari data ekor dulu, baru pilih statistiknya. α > 2: mean dan varians boleh dipakai dengan hati-hati. 1 < α ≤ 2: mean ada tetapi rapuh — laporkan median dan kuantil. α ≤ 1: lupakan mean sepenuhnya. Jebakan yang paling mahal: model risiko yang memakai Normal untuk data Pareto — ia akan meremehkan kerugian ekstrem bukan dua kali lipat, melainkan berbeda orde besarnya. Ekor bukan detail; ekor adalah ceritanya.",
      },
      summary: [
        "Gamma: tunggu kejadian ke-\u03B1 (\u03B1=1 \u2192 Eksponensial).",
        "Beta: distribusi untuk peluang di [0,1]; konjugat Binomial \u2014 update = tambah.",
        "t: Normal berekor tebal untuk sampel kecil; \u03C7\u00B2: jumlah kuadrat Normal \u2014 untuk varians.",
        "Pareto: hukum pangkat; \u03B1\u22642 \u2192 varians \u221E; \u03B1\u22641 \u2192 mean \u221E \u2014 jangan perlakukan seperti Normal.",
        "Jangan buang \u201Coutlier\u201D ekor tebal \u2014 mereka adalah risikonya.",
      ],
      next: { label: "B8 \u2014 Fitting Distribusi", href: "/v2/learn/b8-fitting-distribusi" },
      quiz: [
        {
          q: "Beta(5,95) lalu amati 16 gagal dari 200. Posterior?",
          options: [
            { text: "Beta(21, 279)", why: "Benar: tambah sukses ke a, gagal ke b \u2192 Beta(5+16, 95+184). Mean 7% \u2014 shrinkage dari 8% mentah.", correct: true },
            { text: "Beta(16, 184)", why: "Salah: prior-nya hilang \u2014 itu estimasi mentah, bukan posterior." },
            { text: "Beta(5, 95)", why: "Salah: itu prior, belum diupdate data." },
          ],
        },
        {
          q: "Distribusi t vs Normal: bedanya\u2026",
          options: [
            { text: "t selalu simetris sempurna", why: "Salah: justru ekornya lebih tebal." },
            { text: "t berekor lebih tebal; \u03BD\u2192\u221E \u2192 Normal", why: "Benar: t = Normal + ketidakpastian estimasi SD. \u03BD kecil \u2192 ekor tebal.", correct: true },
            { text: "Tidak ada beda", why: "Salah: beda di ekor \u2014 dan ekor menentukan risiko." },
          ],
        },
        {
          q: "\u03C7\u00B2 dengan k derajat bebas muncul sebagai\u2026",
          options: [
            { text: "Jumlah k Normal standar yang dikuadratkan", why: "Benar: definisinya. Makanya dipakai untuk varians (jumlah kuadrat deviasi).", correct: true },
            { text: "Rata-rata k Normal", why: "Salah: itu tetap Normal (diskalakan)." },
            { text: "Hasil kali k Uniform", why: "Salah: tidak ada hubungannya." },
          ],
        },
        {
          q: "Pareto \u03B1=1,5: yang benar\u2026",
          options: [
            { text: "Mean dan varians hingga", why: "Salah: varians tak hingga karena \u03B1\u22642." },
            { text: "Mean hingga, varians tak hingga", why: "Benar: \u03B1>1 \u2192 mean hingga; \u03B1\u22642 \u2192 varians tak hingga. Jangan hitung SD!", correct: true },
            { text: "Keduanya tak hingga", why: "Salah: mean hingga karena \u03B1>1." },
          ],
        },
        {
          q: "Kapan pakai Gamma?",
          options: [
            { text: "Data proporsi", why: "Salah: itu wilayah Beta." },
            { text: "Waktu tunggu sampai kejadian ke-\u03B1", why: "Benar: Gamma = generalisasi Eksponensial. \u03B1=1 \u2192 Eksponensial.", correct: true },
            { text: "Uji independensi", why: "Salah: itu wilayah Chi-Square." },
          ],
        },
      ],
    },
  ],
};

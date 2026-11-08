import type { V2Lesson } from "../lib/types";

export const b7_1: V2Lesson = {
  slug: "b7-distribusi-kontinu-1",
  track: "Probabilitas",
  module: "Distribusi",
  title: "B7.1 Distribusi Kontinu 1: Normal, Lognormal & Eksponensial",
  estMinutes: 55,
  steps: [
    {
      id: "titik-nol",
      eyebrow: "Langkah 1 · Dari batang ke kurva",
      title: "\u201CPeluang tepat Rp5.000.000\u201D = nol?",
      prose: [
        "Analis bertanya: \u201CBerapa peluang saldo nasabah tepat Rp5.000.000,00?\u201D Jawaban yang benar: nol. Bukan karena mustahil \u2014 melainkan karena saldo itu kontinu: ada tak berhingga nilai di sekitar 5 juta, masing-masing berpeluang nol, tapi peluang rentang 4,9\u20135,1 juta bisa 10%.",
        "Ini lompatan konseptual terbesar: dari batang peluang (diskret) ke luas di bawah kurva (kontinu). pdf f(x): tinggi kurva BUKAN peluang; peluang = luas di bawah kurva. P(a \u2264 X \u2264 b) = integral f(x) dari a ke b. Dan P(X = tepat x0) = 0 \u2014 garis tunggal tidak punya luas!",
        "\u201CPeluang nol\u201D \u2260 \u201Cmustahil\u201D: di dunia kontinu, kejadian yang nyata terjadi justru berpeluang nol satu per satu. Yang bermakna hanyalah peluang rentang. Selalu tanya: \u201Cyang ditanya titik atau rentang?\u201D Titik pada kontinu \u2192 0. Rentang \u2192 luas/cdf.",
      ],
      formula: String.raw`P(a \le X \le b) = \int_a^b f(x)\,dx, \qquad P(X = x_0) = 0, \qquad F(x) = P(X \le x)`,
      formulaNote: "cdf F(x) = peluang kumulatif sampai x. Untuk kontinu: F'(x) = f(x). Peluang 3\u20135 menit = F(5) \u2212 F(3).",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menanyakan \u201Cpeluang return tepat 0%\u201D lalu heran jawabannya nol. Pada data kontinu, pertanyaan yang bermakna selalu tentang rentang: \u201Creturn antara \u22121% dan 1%\u201D bisa 30%.",
      },
      reference: "Kontinu: peluang = luas, bukan tinggi. Titik \u2192 0.",
    },
    {
      id: "normal",
      eyebrow: "Langkah 2 · Normal",
      title: "Ratu distribusi dan aturan 68-95-99,7",
      prose: [
        "Normal(\u03BC,\u03C3\u00B2): simetris, mean = median = modus. Mengapa merajalela? Banyak fenomena \u2248 normal, CLT (B11) membuat rata-rata sampel \u2192 normal apa pun distribusi aslinya, dan matematikanya enak.",
        "Aturan 68\u201395\u201399,7: \u00B11\u03C3 \u2192 68%, \u00B12\u03C3 \u2192 95%, \u00B13\u03C3 \u2192 99,7% data. z-score menstandarkan ke Normal(0,1): Z = (X\u2212\u03BC)/\u03C3. Contoh: nilai ujian \u03BC=70, \u03C3=10. P(nilai > 85)? z = 1,5 \u2192 P(Z>1,5) = 1\u2212\u03A6(1,5) \u2248 6,7%. Satu tabel untuk semua soal!",
        "Hafalkan empat angka: 68\u201395\u201399,7, z=1,96 (95% dua sisi), z=1,645 (95% satu sisi). Empat angka ini menyelesaikan separuh soal Normal tanpa kalkulator.",
      ],
      formula: String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}} \qquad Z = \frac{X-\mu}{\sigma}`,
      formulaNote: "μ (mu) = mean = median = modus, pusat simetri; σ (sigma) = simpangan baku, lebar lonceng; 1/(σ√(2π)) = konstanta penormal agar total luas = 1; pangkat −(x−μ)²/(2σ²) = jarak kuadrat dari pusat, makin jauh makin kecil eksponensialnya. Z = (X−μ)/σ = jarak dalam satuan σ, bahasa universal. Contoh angka: aturan 68-95-99,7 — angka ini artinya untuk data Normal, sekitar 68% observasi dalam μ±σ, 95% dalam μ±2σ, 99,7% dalam μ±3σ; Z = 2 berarti hanya ~2,5% populasi di atasnya. Z inilah yang membuat mean 170 cm σ 10 cm bisa dibandingkan dengan mean Rp5 juta σ Rp1 juta — satuannya sudah dinetralkan.",
      tasks: [
        { id: "t1", text: "Hitung `z` untuk nilai 85 (\u03BC=70, \u03C3=10)" },
        { id: "t2", text: "Hitung `p` = P(Z > z) via `math.erf`, cetak keduanya" },
      ],
      expected: "z=1.5  p=0.0668",
      note: {
        title: "Sering salah",
        body: "\u201CData harus normal agar boleh pakai mean/SD.\u201D Tidak! Mean/SD terdefinisi untuk distribusi apa pun. Yang butuh normalitas: uji/interval tertentu \u2014 dan itu pun sering diselamatkan CLT untuk n besar.",
      },
      hints: [
        "z = (85 - 70) / 10.",
        "Phi(z) = 0.5 * (1 + math.erf(z / 2**0.5)); p = 1 - Phi(z).",
        "print(f\"z={z}  p={p:.4f}\")",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU: z-score nilai 85, lalu P(Z > z)\nz = \nPhi = 0.5 * (1 + math.erf(z / 2**0.5))\np = \n\nprint(f"z={z}  p={p:.4f}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU: z-score nilai 85, lalu P(Z > z)\nz = (85 - 70) / 10\nPhi = 0.5 * (1 + math.erf(z / 2**0.5))\np = 1 - Phi\n\nprint(f"z={z}  p={p:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z", value: 1.5, tol: 1e-9, label: "`z` seharusnya 1,5", msg: "(85\u221270)/10 = 1,5." },
          { kind: "equal", task: "t2", name: "p", value: 0.0668, tol: 0.001, label: "`p` seharusnya \u2248 0,0668", msg: "1 \u2212 \u03A6(1,5) \u2248 0,0668 = 6,7%." },
          { kind: "stdout_matches", task: "t2", pattern: "z=1\\.5\\s+p=0\\.0668", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "math.erf untuk cdf Normal. Hafal: z=1 \u2192 16%, z=2 \u2192 2,5%.",
    },
    {
      id: "lognormal",
      eyebrow: "Langkah 3 · Lognormal",
      title: "Ketika yang normal adalah log-nya",
      prose: [
        "X lognormal jika ln X ~ Normal(\u03BC, \u03C3\u00B2). Syarat: X > 0. E[X] = e^(\u03BC+\u03C3\u00B2/2), median = e^\u03BC \u2014 mean > median, distribusi miring kanan!",
        "Kapan memakai: harga aset, pendapatan, klaim asuransi \u2014 positif dan miring kanan. Harga saham tidak bisa negatif dan bisa naik 10x \u2014 Normal (simetris dan bisa negatif) salah model; Lognormal benar. Kepribadiannya: Lognormal = hasil banyak perkalian acak kecil (return berlipat), Normal = hasil banyak penjumlahan acak kecil (CLT!).",
        "Contoh: harga Rp1.000, log-return harian ~ N(0,0005, 0,02\u00B2). Jika pakai Normal(mean 1000, SD 20): P(harga < 0) > 0 \u2014 mustahil! Harga tidak bisa negatif. Model benar via log: z = (\u22120,1054\u22120,0005)/0,02 \u2248 \u22125,29 \u2192 peluang praktis nol untuk 1 hari.",
      ],
      formula: String.raw`\ln X \sim \mathrm{Normal}(\mu, \sigma^2) \qquad E[X] = e^{\mu + \sigma^2/2} \quad \mathrm{Median}(X) = e^{\mu}`,
      formulaNote: "ln X ~ Normal(μ,σ²) artinya yang Normal adalah logaritmanya, bukan X-nya; syarat X > 0. μ, σ = parameter dari ln X — BUKAN mean/SD dari X! E[X] = e^(μ+σ²/2): mean X mendapat premi σ²/2 dari kemiringan; median(X) = e^μ: selalu di bawah mean. Contoh angka: jika ln X ~ Normal(0,1), median = 1 tetapi E[X] = e^0,5 ≈ 1,65 — angka ini artinya rata-rata 65% di atas median karena ekor kanan menariknya; setengah populasi di bawah 1, tetapi segelintir nilai besar mengangkat rata-rata. Inilah mengapa untuk harga dan kerugian, median sering lebih jujur daripada mean.",
      tasks: [
        { id: "t1", text: "Hitung `mean` dan `median` untuk \u03BC=0, \u03C3=1" },
        { id: "t2", text: "Hitung `rasio` = mean/median, cetak ketiganya" },
      ],
      expected: "mean=1.6487  median=1.0  rasio=1.6487",
      note: {
        title: "Sering salah",
        body: "\u201CLognormal = Normal yang di-log-kan, jadi sama saja.\u201D Beda fundamental: Normal simetris (mean=median), Lognormal miring kanan (mean > median!). Untuk \u03C3=1, mean 65% lebih besar dari median. Pakai Normal untuk harga \u2192 meremehkan ekor kanan.",
      },
      hints: [
        "import math; mean = math.exp(0 + 1/2).",
        "median = math.exp(0) = 1.",
        "print(f\"mean={mean:.4f}  median={median:.1f}  rasio={rasio:.4f}\")",
      ],
      code: {
        starter: `import math\nmu, sigma = 0, 1\n\n# TULIS KODEMU: mean, median, rasio lognormal\nmean = \nmedian = \nrasio = \n\nprint(f"mean={mean:.4f}  median={median:.1f}  rasio={rasio:.4f}")`,
        lockLines: 2,
        solution: `import math\nmu, sigma = 0, 1\n\n# TULIS KODEMU: mean, median, rasio lognormal\nmean = math.exp(mu + sigma**2 / 2)\nmedian = math.exp(mu)\nrasio = mean / median\n\nprint(f"mean={mean:.4f}  median={median:.1f}  rasio={rasio:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean", value: 1.6487, tol: 0.001, label: "`mean` seharusnya \u2248 1,6487", msg: "e^(0+0,5) \u2248 1,6487." },
          { kind: "equal", task: "t1", name: "median", value: 1.0, tol: 1e-9, label: "`median` seharusnya 1,0", msg: "e^0 = 1." },
          { kind: "equal", task: "t2", name: "rasio", value: 1.6487, tol: 0.001, label: "`rasio` seharusnya \u2248 1,6487", msg: "Mean 65% lebih besar dari median." },
          { kind: "stdout_matches", task: "t2", pattern: "mean=1\\.6487\\s+median=1\\.0\\s+rasio=1\\.6487", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Positif & miring kanan \u2192 Lognormal. Perkalian vs penjumlahan.",
    },
    {
      id: "eksponensial",
      eyebrow: "Langkah 4 · Eksponensial",
      title: "Waktu tunggu kontinu",
      prose: [
        "Eksponensial(\u03BB): waktu tunggu sampai kejadian berikutnya jika kejadian datang dengan laju \u03BB per satuan waktu \u2014 pasangan kontinu dari Poisson! f(x) = \u03BBe^(\u2212\u03BBx), E[X] = 1/\u03BB.",
        "Contoh: nasabah datang 12/jam (Poisson) \u2192 \u03BB = 0,2/menit. P(nasabah berikutnya dalam 5 menit) = 1 \u2212 e^(−0,2\u00D75) = 1 \u2212 e^(−1) \u2248 63,2%. Median = ln2/0,2 \u2248 3,47 menit < mean 5 menit \u2014 miring kanan lagi!",
        "Memoryless versi kontinu: P(X>s+t | X>s) = P(X>t). \u201CSudah menunggu 10 menit tidak mengubah peluang menunggu 5 menit lagi.\u201D Catatan jujur: di dunia nyata jarang benar-benar memoryless (mesin menua, nasabah lelah menunggu) \u2014 Eksponensial adalah model baseline, bukan kebenaran.",
      ],
      formula: String.raw`f(x) = \lambda e^{-\lambda x}, \quad x \ge 0 \qquad E[X] = \frac{1}{\lambda} \qquad P(X > t) = e^{-\lambda t}`,
      formulaNote: "λ (lambda) = laju kejadian per satuan waktu — satu-satunya parameter; x ≥ 0 karena waktu tunggu tidak negatif; e^(−λx) = ekor yang meluruh eksponensial. E[X] = 1/λ: rata-rata tunggu berbanding terbalik dengan laju. P(X>t) = e^(−λt): peluang menunggu lebih dari t. Contoh angka: λ = 2 kedatangan/jam → E[X] = 0,5 jam = 30 menit — angka ini artinya rata-rata menunggu 30 menit; P(X>1 jam) = e^(−2) ≈ 0,135 = 13,5% — dari 100 kedatangan, sekitar 14 menunggu lebih dari sejam. Pasangan kontinu dari Poisson: jika kejadian datang Poisson(λ), waktu antar-kejadiannya Eksponensial(λ) — dua sisi koin yang sama.",
      tasks: [
        { id: "t1", text: "Hitung `p` = P(nasabah berikutnya dalam 5 menit), \u03BB=0,2/menit" },
        { id: "t2", text: "Hitung `median` waktu tunggu (menit), cetak keduanya" },
      ],
      expected: "p=0.6321  median=3.47",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pasangan yang wajib dihafal: Poisson(\u03BB) \u2194 Eksponensial(\u03BB). \u201CBerapa kejadian per jam\u201D \u2194 \u201Cberapa lama antar kejadian\u201D. Soal yang satu bisa dijawab lewat yang lain.",
      },
      hints: [
        "p = 1 - math.exp(-0.2*5).",
        "median: 0.5 = e^(-0.2*m) \u2192 m = ln2/0.2.",
        "print(f\"p={p:.4f}  median={median:.2f}\")",
      ],
      code: {
        starter: `import math\nlam = 0.2  # per menit\n\n# TULIS KODEMU: P(T <= 5 mnt) dan median waktu tunggu\np = \nmedian = \n\nprint(f"p={p:.4f}  median={median:.2f}")`,
        lockLines: 2,
        solution: `import math\nlam = 0.2  # per menit\n\n# TULIS KODEMU: P(T <= 5 mnt) dan median waktu tunggu\np = 1 - math.exp(-lam * 5)\nmedian = math.log(2) / lam\n\nprint(f"p={p:.4f}  median={median:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.6321, tol: 0.001, label: "`p` seharusnya \u2248 0,632", msg: "1 \u2212 e^(−1) \u2248 0,6321." },
          { kind: "equal", task: "t2", name: "median", value: 3.47, tol: 0.01, label: "`median` seharusnya \u2248 3,47", msg: "ln2/0,2 \u2248 3,47 < mean 5." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.6321\\s+median=3\\.47", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "P(X>t) = e^(\u2212\u03BBt). Mean 1/\u03BB, median ln2/\u03BB.",
    },
    {
      id: "minicase-sla",
      eyebrow: "Langkah 5 · Mini-case",
      title: "SLA call center yang jebol",
      prose: [
        "Call center: waktu antar telepon ~ Eksponensial(\u03BB=12/jam). SLA: 90% penelepon menunggu < 5 menit. (a) P(jeda antar telepon > 10 menit) = e^(−12\u00D710/60) = e^(−2) \u2248 13,5%.",
        "(b) Dengan 1 agen: laju datang \u03BB=12/jam, laju layanan \u03BC=15/jam (1 per 4 menit). Utilisasi \u03C1=0,8. P(menunggu > 5 menit) = \u03C1\u00D7e^(−(\u03BC\u2212\u03BB)t) = 0,8\u00D7e^(−3\u00D75/60) = 0,8\u00D7e^(−0,25) \u2248 62% \u2014 jauh di atas 10%! SLA jebol. Butuh ~3 agen.",
        "Pelajaran: \u201Crata-rata cukup\u201D (12 vs 15/jam) menipu \u2014 variabilitas Eksponensial membuat antrean menumpuk. Lagi-lagi: distribusi, bukan mean.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_jeda` = P(jeda > 10 menit)" },
        { id: "t2", text: "Hitung `p_tunggu` = P(menunggu > 5 mnt) 1 agen, cetak keduanya" },
      ],
      expected: "p_jeda=13.5%  p_tunggu=62.3%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kapasitas dari rata-rata (\u03BB vs \u03BC) terlihat cukup, tapi distribusi bilang SLA jebol 62% vs target 10%. Under-staffing = risiko operasional yang terukur \u2014 bukan firasat.",
      },
      hints: [
        "p_jeda = math.exp(-12*10/60).",
        "p_tunggu = 0.8 * math.exp(-3*5/60).",
        "print(f\"p_jeda={p_jeda:.1%}  p_tunggu={p_tunggu:.1%}\")",
      ],
      code: {
        starter: `import math\n\n# (a) jeda antar telepon > 10 menit, lam=12/jam\np_jeda = \n# (b) antrean M/M/1: rho=0.8, mu-lam=3/jam, t=5 mnt\np_tunggu = \n\nprint(f"p_jeda={p_jeda:.1%}  p_tunggu={p_tunggu:.1%}")`,
        lockLines: 1,
        solution: `import math\n\n# (a) jeda antar telepon > 10 menit, lam=12/jam\np_jeda = math.exp(-12 * 10/60)\n# (b) antrean M/M/1: rho=0.8, mu-lam=3/jam, t=5 mnt\np_tunggu = 0.8 * math.exp(-3 * 5/60)\n\nprint(f"p_jeda={p_jeda:.1%}  p_tunggu={p_tunggu:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_jeda", value: 0.1353, tol: 0.001, label: "`p_jeda` seharusnya \u2248 13,5%", msg: "e^(−2) \u2248 0,1353." },
          { kind: "equal", task: "t2", name: "p_tunggu", value: 0.623, tol: 0.003, label: "`p_tunggu` seharusnya \u2248 62,3%", msg: "0,8\u00D7e^(−0,25) \u2248 0,623." },
          { kind: "stdout_matches", task: "t2", pattern: "p_jeda=13\\.5%\\s+p_tunggu=62\\.3%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Distribusi, bukan mean \u2014 untuk staffing maupun SLA.",
    },
    {
      id: "pilih-distribusi",
      eyebrow: "Langkah 6 · Cek cepat",
      title: "Distribusi kontinu mana?",
      prose: [
        "Dua pertanyaan untuk mengunci peta keputusan distribusi kontinu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Harga saham sebaiknya dimodelkan Lognormal, bukan Normal, karena\u2026",
          options: [
            { text: "Lognormal lebih mudah", why: "Salah: bukan soal kemudahan." },
            { text: "Harga positif & miring kanan; Normal mengizinkan negatif & simetris", why: "Benar: harga = hasil perkalian return \u2192 lognormal. Normal untuk harga = absurd (harga negatif).", correct: true },
            { text: "Selalu sama saja", why: "Salah: beda fundamental \u2014 mean vs median, ekor kanan." },
          ],
        },
        {
          q: "Jika kedatangan ~ Poisson(\u03BB=2/jam), waktu antar kedatangan ~ \u2026",
          options: [
            { text: "Poisson(2)", why: "Salah: Poisson untuk count, bukan waktu tunggu." },
            { text: "Eksponensial(2), mean 0,5 jam", why: "Benar: pasangan Poisson\u2013Eksponensial. \u201CPer jam\u201D \u2194 \u201Cantar kejadian\u201D.", correct: true },
            { text: "Normal", why: "Salah: waktu tunggu tak negatif dan miring kanan." },
          ],
        },
      ],
      note: {
        title: "Intuisi: 68-95-99,7 adalah penggaris saku untuk dunia Normal",
        body: "Untuk data yang wajar Normal, tiga angka ini menjawab sebagian besar pertanyaan tanpa kalkulator: sekitar 68% data dalam ±1σ, 95% dalam ±2σ, 99,7% dalam ±3σ dari mean. Z-score mengubahnya menjadi bahasa universal: Z = 2 berarti dua simpangan baku di atas rata-rata — hanya sekitar 2,5% populasi yang lebih tinggi, apa pun satuannya. Praktisi memakai ini sebagai uji kewarasan tercepat: klaim 5σ tanpa bukti luar biasa hampir pasti salah ukur atau salah model. Tetapi penggaris ini hanya jujur jika datanya memang Normal. Jebakan termahalnya: memaksakan Normal karena nyaman. Return saham, kerugian operasional, klaim asuransi — semuanya miring kanan dan berekor tebal; menganggapnya Normal meremehkan kejadian ekstrem secara sistematis. Aturan keputusannya: jika data tidak boleh negatif dan miring kanan, pikirkan lognormal dulu — yang Normal adalah log-nya, bukan dirinya. Jika datanya waktu tunggu, pikirkan eksponensial. Normal adalah titik awal, bukan tujuan. Dan setiap kali seseorang mengutip 95% tanpa memeriksa bentuk distribusi, tanyakan: dari mana keyakinan Normalnya?",
      },

      reference: "Simetris & bisa negatif \u2192 Normal. Positif miring kanan \u2192 Lognormal. Waktu tunggu \u2192 Eksponensial.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B7.2.",
      ],
      tasks: [],
      summary: [
        "Kontinu: peluang = luas di bawah pdf; P(titik) = 0; cdf = P(X \u2264 x).",
        "Normal(\u03BC,\u03C3\u00B2): simetris; 68\u201395\u201399,7; z = (X\u2212\u03BC)/\u03C3; raja karena CLT.",
        "Lognormal: ln(X) normal; positif & miring kanan; untuk harga/pendapatan.",
        "Eksponensial(\u03BB): waktu antar kejadian; E=1/\u03BB; memoryless; pasangan Poisson.",
        "Jangan pakai Normal untuk data positif miring kanan \u2014 dan jangan tanya peluang \u201Ctepat\u201D pada kontinu.",
      ],
      next: { label: "B7.2 \u2014 Distribusi Kontinu 2", href: "/v2/learn/b7-distribusi-kontinu-2" },
      quiz: [
        {
          q: "Untuk X kontinu, P(X = 5,0) = 0 karena\u2026",
          options: [
            { text: "5,0 mustahil terjadi", why: "Salah: 5,0 bisa terjadi \u2014 \u201Cpeluang nol\u201D \u2260 \u201Cmustahil\u201D." },
            { text: "Ada tak berhingga nilai di sekitarnya; peluang hanya bermakna untuk rentang (luas)", why: "Benar: peluang kontinu = luas. Titik tak berluas \u2192 0.", correct: true },
            { text: "pdf-nya nol", why: "Salah: pdf di 5,0 bisa positif \u2014 tinggi kurva bukan peluang." },
          ],
        },
        {
          q: "Aturan 68\u201395\u201399,7 berlaku untuk\u2026",
          options: [
            { text: "Semua distribusi", why: "Salah: data uniform/eksponensial punya aturan sendiri." },
            { text: "Hanya (mendekati) Normal", why: "Benar: khas Normal \u2014 jangan tempel sembarangan.", correct: true },
            { text: "Semua yang simetris", why: "Salah: simetris belum tentu Normal." },
          ],
        },
        {
          q: "Sifat memoryless Eksponensial artinya\u2026",
          options: [
            { text: "Tidak punya varians", why: "Salah: Var = 1/\u03BB\u00B2." },
            { text: "P(X>s+t|X>s) = P(X>t) \u2014 menunggu lama tak mengubah sisa tunggu", why: "Benar: tanpa ingatan. Di dunia nyata jarang persis \u2014 ini model baseline.", correct: true },
            { text: "Mean = 0", why: "Salah: mean = 1/\u03BB." },
          ],
        },
        {
          q: "Waktu antar email ~ Eksponensial(mean 10 menit). Setelah 15 menit tanpa email, peluang email dalam 2 menit berikutnya?",
          options: [
            { text: "Tetap 1 \u2212 e^(\u22120,2) \u2248 18,1% \u2014 memoryless", why: "Benar: waktu yang sudah berlalu tidak mengubah peluang sisa.", correct: true },
            { text: "Lebih besar \u2014 sudah 15 menit menunggu", why: "Salah: itu intuisi gambler's fallacy versi kontinu." },
            { text: "Nol \u2014 emailnya tidak datang-datang", why: "Salah: tidak ada dasarnya." },
          ],
        },
        {
          q: "Tinggi ~ Normal(170, 10) cm. Peluang seseorang > 190 cm?",
          options: [
            { text: "z=2 \u2192 \u2248 2,3%", why: "Benar: (190\u2212170)/10 = 2 \u2192 ekor kanan \u2248 2,3%.", correct: true },
            { text: "50%", why: "Salah: 190 jauh di atas mean 170." },
            { text: "16%", why: "Salah: itu untuk z=1 (180 cm)." },
          ],
        },
      ],
    },
  ],
};

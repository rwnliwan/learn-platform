import type { V2Lesson } from "../lib/types";

export const b10: V2Lesson = {
  slug: "b10-copula",
  track: "Probabilitas",
  module: "Dependensi",
  title: "B10. Copula: Memisahkan Marginal dari Ketergantungan",
  estMinutes: 75,
  steps: [
    {
      id: "sklar",
      eyebrow: "Langkah 1 · Teorema Sklar",
      title: "Rumus yang \u201Cmembunuh\u201D Wall Street?",
      prose: [
        "Tahun 2000, David Li mempublikasikan cara memakai copula Gaussian untuk memodelkan default bersama. Wall Street mengadopsinya untuk menilai triliunan dolar CDO. Tahun 2008, semuanya runtuh. Apakah rumusnya yang salah? Tidak persis \u2014 yang salah cara pakainya: korelasi diestimasi dari masa tenang, dan copula Gaussian tidak punya tail dependence \u2014 ia mengasumsikan kejadian ekstrem terjadi independen.",
        "Teorema Sklar: setiap joint H(x,y) dengan marginal kontinu F(x), G(y) bisa ditulis H(x,y) = C(F(x), G(y)). Marginal diubah jadi uniform [0,1] via transformasi integral peluang; C(u,v) adalah copula \u2014 distribusi joint dari dua uniform, murni \u201Cbentuk ketergantungan\u201D, bebas dari bentuk marginal.",
        "Intuisi: copula memisahkan \u201Cbagaiamana tiap variabel berperilaku sendiri\u201D (marginal) dari \u201Cbagaimana mereka bergerak bersama\u201D (copula). Kamu bisa pasang marginal apa pun (Normal? Pareto? bebas!) dengan struktur dependensi apa pun \u2014 LEGO probabilistik.",
      ],
      formula: String.raw`H(x,y) = C\big(F(x),\, G(y)\big)`,
      formulaNote: "F(x), G(y): marginal \u2192 uniform. C(u,v): copula = seluruh bentuk dependensi.",
      tasks: [
        { id: "t1", text: "Bangun `N=3000` pasangan (U,V) dari copula Gaussian \u03C1=0,5" },
        { id: "t2", text: "Transformasi ke X,Y ~ Eksponensial(1) via inverse cdf, hitung `mean_x`" },
        { id: "t3", text: "Cetak `mean_x` dengan 2 desimal" },
      ],
      expected: "mean_x\u22481.00 (marginal tetap Eksponensial!)",
      note: {
        title: "Sering salah",
        body: "\u201CMarginal + korelasi = joint\u201D (miskonsepsi B9). Yang benar: marginal + copula = joint. Korelasi hanya satu angka; copula adalah seluruh bentuk dependensi.",
      },
      hints: [
        "U = Phi(z1), V = Phi(rho*z1 + sqrt(1-rho^2)*z2); Phi via 0.5*(1+erf(.))",
        "X = -ln(1-U) \u2192 Eksponensial(1).",
        "mean_x harus \u2248 1 \u2014 copula tidak mengubah marginal.",
      ],
      code: {
        starter: `import random, math, statistics\nrandom.seed(103)\nrho, N = 0.5, 3000\nxs = []\nfor _ in range(N):\n    z1, z2 = random.gauss(0,1), random.gauss(0,1)\n    u = 0.5*(1+math.erf(z1/math.sqrt(2)))\n    # TULIS KODEMU: v dari copula Gaussian, lalu X = -ln(1-u)\n    v = \n    x = \n    xs.append(x)\nmean_x = statistics.mean(xs)\nprint(f"mean_x={mean_x:.2f}")`,
        lockLines: 7,
        solution: `import random, math, statistics\nrandom.seed(103)\nrho, N = 0.5, 3000\nxs = []\nfor _ in range(N):\n    z1, z2 = random.gauss(0,1), random.gauss(0,1)\n    u = 0.5*(1+math.erf(z1/math.sqrt(2)))\n    # TULIS KODEMU: v dari copula Gaussian, lalu X = -ln(1-u)\n    v = 0.5*(1+math.erf((rho*z1 + math.sqrt(1-rho**2)*z2)/math.sqrt(2)))\n    x = -math.log(1-u)\n    xs.append(x)\nmean_x = statistics.mean(xs)\nprint(f"mean_x={mean_x:.2f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "v", label: "`v` terdefinisi", msg: "Hitung v dari copula Gaussian dengan korelasi rho." },
          { kind: "equal", task: "t2", name: "mean_x", value: 1.0, tol: 0.1, label: "`mean_x` mendekati 1,0", msg: "X ~ Eksponensial(1) \u2192 mean \u2248 1. Copula tidak mengubah marginal!" },
          { kind: "stdout_matches", task: "t3", pattern: "mean_x=1\\.\\d\\d", label: "`print` menampilkan mean_x", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Sklar: pisahkan keputusan \u201Cdistribusi tiap variabel\u201D vs \u201Ccara bergerak bareng\u201D.",
    },
    {
      id: "keluarga-copula",
      eyebrow: "Langkah 2 · Keluarga copula",
      title: "Pilih bentuk ekornya",
      prose: [
        "Gaussian: dari bivariat normal, tail dependence \u03BB = 0 \u2014 kejadian ekstrem bersama → 0 saat kuantilnya → 0 (ASYMPTOTIC independence) — BUKAN independensi pada kuantil berhingga: pada q = 5% dua obligasi berkorelasi masih default bersama jauh lebih sering daripada bila independen (lihat contoh di bawah) — λ = 0 hanya berlaku di limit. Inilah dosa 2008. Copula t: tail dependence simetris \u03BB > 0 \u2014 ekstrem atas & bawah cenderung bareng; makin kecil \u03BD, makin kuat.",
        "Clayton: tail dependence bawah saja \u2014 cocok untuk default bersama / crash bersama (risiko kredit!). Gumbel: tail dependence atas saja \u2014 cocok untuk kejadian besar bersama (klaim bencana). \u03BB_bawah = limit P(V\u2264q | U\u2264q) saat q\u21920: \u201Cjika satu ekstrem bawah, berapa peluang yang lain ikut?\u201D Gaussian \u2192 0, Clayton > 0.",
        "Contoh — peluang default BERSAMA pada kuantil berhingga q=5% (BUKAN λ): dua obligasi, masing-masing P(default)=5%. Independen: 0,05\u00B2=0,25%. Gaussian \u03C1=0,5: \u22481,2%. Clayton \u03B8=2: \u22483,5% \u2014 14x independen! Tiga model dengan marginal & korelasi sama memberi jawaban beda jauh untuk kejadian bersama — Clayton 3,5% vs Gaussian 1,2% (hampir 3x), dan Gaussian yang λ-nya 0 tetap default bersama hampir 5x lebih sering daripada independen (1,2% vs 0,25%).",
      ],
      formula: String.raw`\lambda_{\text{bawah}} = \lim_{q \to 0} P(V \le q \mid U \le q)`,
      formulaNote: "Gaussian: \u03BB=0. Clayton(\u03B8=2): \u03BB_bawah = 2^(-1/2) \u2248 0,707.",
      tasks: [
        { id: "t1", text: "Simulasikan copula Gaussian(\u03C1=0,7) dan Clayton(\u03B8=2), `N=5000`" },
        { id: "t2", text: "Hitung `pg`, `pc` = P(ikut ekstrem bawah | ekstrem bawah) pada kuantil berhingga q=0,05 — ini co-exceedance kuantil berhingga, BUKAN λ (λ adalah limit q→0)" },
        { id: "t3", text: "Cetak keduanya sebagai persen" },
      ],
      expected: "pc jauh > pg",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk risiko kredit (default bersama = ekor bawah), Clayton lebih jujur dari Gaussian. Untuk return saham (crash bersama), copula t. Gaussian hanya untuk masa tenang \u2014 dan masa tenang bukan saat kamu butuh model.",
      },
      hints: [
        "Clayton Marshall-Olkin: u acak; w=(1+s)^(-1/\u03B8); v=(u^-\u03B8*(w^-\u03B8-1)+1)^(-1/\u03B8).",
        "pg = (u<q dan v<q)/(u<q) untuk sampel Gaussian.",
        "print(f\"pg={pg:.1%}  pc={pc:.1%}\")",
      ],
      code: {
        starter: `import random, math\nrandom.seed(101)\nN, q = 5000, 0.05\n\ndef gauss_pts(rho, n):\n    pts = []\n    for _ in range(n):\n        z1, z2 = random.gauss(0,1), random.gauss(0,1)\n        x = z1; y = rho*z1 + math.sqrt(1-rho**2)*z2\n        pts.append((0.5*(1+math.erf(x/math.sqrt(2))), 0.5*(1+math.erf(y/math.sqrt(2)))))\n    return pts\n\ndef clayton_pts(theta, n):\n    pts = []\n    for _ in range(n):\n        u = random.random()\n        s = -math.log(random.random())\n        w = (1 + s)**(-1/theta)\n        v = (u**(-theta)*(w**(-theta)-1) + 1)**(-1/theta)\n        pts.append((u, min(v, 1.0)))\n    return pts\n\n# TULIS KODEMU: peluang bersyarat ikut ekstrem bawah\ng = gauss_pts(0.7, N)\nc = clayton_pts(2.0, N)\npg = \npc = \n\nprint(f"pg={pg:.1%}  pc={pc:.1%}")`,
        lockLines: 21,
        solution: `import random, math\nrandom.seed(101)\nN, q = 5000, 0.05\n\ndef gauss_pts(rho, n):\n    pts = []\n    for _ in range(n):\n        z1, z2 = random.gauss(0,1), random.gauss(0,1)\n        x = z1; y = rho*z1 + math.sqrt(1-rho**2)*z2\n        pts.append((0.5*(1+math.erf(x/math.sqrt(2))), 0.5*(1+math.erf(y/math.sqrt(2)))))\n    return pts\n\ndef clayton_pts(theta, n):\n    pts = []\n    for _ in range(n):\n        u = random.random()\n        s = -math.log(random.random())\n        w = (1 + s)**(-1/theta)\n        v = (u**(-theta)*(w**(-theta)-1) + 1)**(-1/theta)\n        pts.append((u, min(v, 1.0)))\n    return pts\n\n# TULIS KODEMU: peluang bersyarat ikut ekstrem bawah\ng = gauss_pts(0.7, N)\nc = clayton_pts(2.0, N)\npg = sum(1 for u, v in g if u < q and v < q) / sum(1 for u, v in g if u < q)\npc = sum(1 for u, v in c if u < q and v < q) / sum(1 for u, v in c if u < q)\n\nprint(f"pg={pg:.1%}  pc={pc:.1%}")`,
        checks: [
          { kind: "defined", task: "t2", name: "pg", label: "`pg` terdefinisi", msg: "Hitung P(ikut ekstrem | ekstrem) pada q=5% untuk Gaussian — kuantil berhingga, bukan λ." },
          { kind: "defined", task: "t2", name: "pc", label: "`pc` terdefinisi", msg: "Hitung P(ikut ekstrem | ekstrem) pada q=5% untuk Clayton — kuantil berhingga, bukan λ." },
          { kind: "stdout_matches", task: "t3", pattern: "pg=\\d+\\.\\d%\\s+pc=\\d+\\.\\d%", label: "`print` menampilkan keduanya", msg: "Cetak dengan format pg=...  pc=... ." },
        ],
      },
      reference: "Korelasi mirip, peluang krisis bersama beda jauh. Ekor mana yang menular?",
    },
    {
      id: "frechet",
      eyebrow: "Langkah 3 · Batas Fr\u00E9chet",
      title: "Korelasi maksimum yang jujur",
      prose: [
        "X ~ Bernoulli(0,5), Y ~ Bernoulli(0,9). Berapa korelasi maksimum yang mungkin? Bukan 1! P(X=1,Y=1) \u2264 min(P(X=1),P(Y=1)) = 0,5 (Fr\u00E9chet upper bound). E[XY] \u2264 0,5; E[X]E[Y] = 0,45; Cov \u2264 0,05. \u03C3X=0,5, \u03C3Y=0,3 \u2192 \u03C1max = 0,05/(0,5\u00D70,3) = 1/3 \u2248 0,333 \u2014 jauh dari 1!",
        "\u201CKorelasi 0,3\u201D yang terlihat lemah bisa jadi sudah maksimal untuk marginal tersebut. Jangan baca korelasi tanpa melihat marginalnya.",
        "Alur kerja copula yang benar: (1) fit marginal tiap variabel (B8) \u2014 boleh beda keluarga! (2) transformasi ke uniform: u=F(x), v=G(y); (3) pilih & fit copula dari pola scatter (u,v) + tail dependence yang dibutuhkan; (4) validasi di ekor: bandingkan frekuensi kejadian bersama ekstrem empiris vs model.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rho_max` untuk X~Bernoulli(0,5), Y~Bernoulli(0,9)" },
        { id: "t2", text: "Cetak `rho_max` dengan 3 desimal" },
      ],
      expected: "rho_max=0.333",
      note: {
        title: "Sering salah",
        body: "\u201CKorelasi 0,5 = dependensi 0,5, apa pun copulanya.\u201D Korelasi linear yang sama bisa berasal dari Gaussian (tanpa tail dependence asimtotik), t (ekor bareng), atau Clayton (bawah bareng) \u2014 dengan implikasi risiko sangat beda.",
      },
      hints: [
        "Cov_max = 0.5 - 0.5*0.9 = 0.05.",
        "sigma_x = 0.5, sigma_y = (0.9*0.1)**0.5 = 0.3.",
        "rho_max = 0.05/(0.5*0.3).",
      ],
      code: {
        starter: `# X ~ Bernoulli(0.5), Y ~ Bernoulli(0.9)\n# Fr\u00E9chet: P(X=1,Y=1) <= min(0.5, 0.9) = 0.5\n\n# TULIS KODEMU: korelasi maksimum yang mungkin\nrho_max = \n\nprint(f"rho_max={rho_max:.3f}")`,
        lockLines: 2,
        solution: `# X ~ Bernoulli(0.5), Y ~ Bernoulli(0.9)\n# Fr\u00E9chet: P(X=1,Y=1) <= min(0.5, 0.9) = 0.5\n\n# TULIS KODEMU: korelasi maksimum yang mungkin\nrho_max = (0.5 - 0.5*0.9) / (0.5 * (0.9*0.1)**0.5)\n\nprint(f"rho_max={rho_max:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rho_max", value: 1 / 3, tol: 0.001, label: "`rho_max` seharusnya \u2248 0,333", msg: "0,05/(0,5\u00D70,3) = 1/3." },
          { kind: "stdout_matches", task: "t2", pattern: "rho_max=0\\.333", label: "`print` menampilkan rho_max", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Korelasi maksimum dibatasi marginal yang berbeda.",
    },
    {
      id: "minicase-cdo",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Audit model CDO 2007 (retrospektif)",
      prose: [
        "Kamu auditor kuant di 2007. Bank memakai copula Gaussian dengan korelasi default 0,2 (dari data 2003\u20132006, masa tenang) untuk menilai tranche CDO. Kamu curiga. Dua kelemahan fatal apa?",
        "Kelemahan 1: copula Gaussian tanpa tail dependence \u2014 default bersama saat krisis tidak tertangkap. Kelemahan 2: korelasi dari masa tenang (0,2) \u2014 correlation breakdown: saat krisis korelasi melonjak (B9!). Kombinasinya = meremehkan risiko tranche senior secara sistematis.",
        "Yang kamu minta sebelum menyetujui: (1) ganti/uji copula dengan tail dependence (t/Clayton) dan bandingkan harga tranche; (2) stress korelasi (0,2 \u2192 0,5/0,7); (3) backtest pada periode stress historis (bukan cuma masa tenang); (4) analisis sensitivitas: seberapa besar harga berubah jika asumsi goyah. Model dependensi harus diuji di rezim yang relevan dengan keputusan \u2014 bukan di rezim yang nyaman.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hubungan ke Vasicek (B13): model Vasicek memakai struktur Gaussian satu faktor \u2014 pahami batasnya dari lesson ini sebelum percaya hasilnya.",
      },
      quiz: [
        {
          q: "Kelemahan fatal #1 model CDO 2007?",
          options: [
            { text: "Korelasinya terlalu tinggi", why: "Salah: korelasi 0,2 justru terlalu rendah untuk krisis." },
            { text: "Copula Gaussian tanpa tail dependence + korelasi dari masa tenang", why: "Benar: default bersama saat krisis tidak tertangkap, dan 0,2 runtuh saat correlation breakdown.", correct: true },
            { text: "Matematikanya salah", why: "Salah: rumusnya benar \u2014 salahnya epistemologis: mengklaim tahu tentang yang belum diamati." },
          ],
        },
        {
          q: "Sebelum menyetujui model, analisis yang paling penting?",
          options: [
            { text: "Fit ulang di data masa tenang yang lebih banyak", why: "Salah: masa tenang tidak mengandung info tail dependence." },
            { text: "Stress korelasi + uji copula berekor + backtest periode stress", why: "Benar: uji di rezim yang relevan dengan keputusan.", correct: true },
            { text: "Naikkan korelasi sedikit", why: "Salah: tanpa tail dependence, menaikkan korelasi tidak memperbaiki struktur ekor." },
          ],
        },
      ],
      reference: "Jangan validasi model krisis dengan data masa tenang.",
    },
    {
      id: "pilih-copula-quiz",
      eyebrow: "Langkah 5 · Cek cepat",
      title: "Copula mana untuk apa?",
      prose: [
        "Dua pertanyaan untuk mengunci peta keputusan copula.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Untuk default bersama (ekor bawah menular), copula paling jujur\u2026",
          options: [
            { text: "Gaussian", why: "Salah: tanpa tail dependence \u2014 dosa 2008." },
            { text: "Gumbel", why: "Salah: Gumbel untuk ekor atas." },
            { text: "Clayton", why: "Benar: Clayton punya tail dependence bawah.", correct: true },
          ],
        },
        {
          q: "Langkah pertama alur kerja copula yang benar\u2026",
          options: [
            { text: "Langsung fit copula Gaussian", why: "Salah: marginal dulu!" },
            { text: "Fit marginal tiap variabel, transformasi ke uniform", why: "Benar: marginal dulu (boleh beda keluarga!), baru dependensi di dunia uniform.", correct: true },
            { text: "Asumsikan independen", why: "Salah: itu mengabaikan dependensi sama sekali." },
          ],
        },
      ],
      note: {
        title: "Intuisi: marginal itu selera masing-masing, copula itu cara mereka berpelukan saat panik",
        body: "Teorema Sklar memisahkan dua keputusan yang selama ini tercampur: bentuk distribusi tiap variabel (marginal) dan cara mereka bergerak bersama (copula). Praktisi memakai pemisahan ini sebagai disiplin berpikir — pasangkan marginal yang jujur untuk tiap risiko, lalu pilih copula berdasarkan satu pertanyaan: bagaimana perilaku mereka di ekor? Inilah pelajaran 2008 yang dibayar mahal: copula Gaussian tidak punya tail dependence. Dua kejadian ekstrem di bawah copula Gaussian praktis independen — padahal di krisis, justru kejadian ekstremlah yang datang berbarengan. Memakai Gaussian untuk CDO berarti mengasumsikan hal yang ingin dihindari tidak terjadi bersamaan. Aturan keputusannya: butuh kejatuhan bersama di ekor bawah — pilih Clayton atau t-copula yang punya lower tail dependence. Butuh simetri — t-copula. Hanya butuh korelasi peringkat tanpa drama ekor — Gaussian boleh. Jebakan yang tersisa: mengkalibrasi korelasi saja lalu menganggap bentuk joint-nya selesai. Korelasi adalah satu angka; copula adalah seluruh bentuk ketergantungan. Jangan biarkan satu angka mewakili seluruh pernikahan. Pilih dengan sadar.",
      },

      reference: "Bawah \u2192 Clayton, atas \u2192 Gumbel, dua-duanya \u2192 t, tidak ada \u2192 Gaussian.",
    },
    {
      id: "tail-dependence",
      eyebrow: "Langkah 6 · Tail dependence",
      title: "Seberapa menular ekstrem itu? Koefisien tail dependence",
      prose: [
        "Langkah 2 membandingkan copula secara kualitatif — sekarang ukur dengan angka. Koefisien lower tail dependence: λ_bawah = limit P(V ≤ q | U ≤ q) saat q → 0. Artinya: kalau satu variabel sudah di ekor bawah ekstrem, berapa peluang yang lain ikut? λ = 0 berarti ekstrem ASIMTOTIK independen (di limit q→0); λ = 0,7 berarti 70 persen kejadian ekstrem bawah datang berpasangan.",
        "Angka tiap keluarga: Gaussian λ = 0 untuk korelasi berapa pun di bawah 1 — inilah dosa 2008 dalam satu angka. Copula t punya λ simetris atas dan bawah yang tumbuh saat derajat bebas ν kecil dan korelasi ρ besar. Clayton punya rumus tertutup: λ_bawah = 2^(−1/θ). Untuk θ = 2: λ_bawah = 2^(−0,5) ≈ 0,71 — 71 persen default ekstrem datang berpasangan, berbanding 0 persen versi Gaussian dengan korelasi yang sama. (Ingat: λ = 0 tidak berarti peluang default bersama pada q = 5% sama dengan independen — contoh Langkah 2: Gaussian 1,2% vs independen 0,25%.)",
        "Implikasi praktisnya: dua model dengan marginal sama dan korelasi sama bisa memberi peluang default bersama yang berbeda berkali-kali lipat — pada contoh Langkah 2, Gaussian 1,2% vs Clayton 3,5% (hampir 3x); terhadap independen, Clayton 14x. Bedanya hanya λ. Saat memilih copula, tanyakan dulu berapa λ yang dibutuhkan datamu: estimasi empirisnya dari frekuensi kejadian bersama di kuantil 5 persen terbawah — itu PROXY kuantil berhingga untuk λ, bukan λ itu sendiri (λ adalah limit q→0; estimasi pada q kecil tidak stabil) — lalu pilih keluarga yang λ-nya paling dekat. Korelasi menjawab gerak sehari-hari; λ menjawab gerak di hari krisis — dan hari krisislah yang menentukan modal.",
      ],
      formula: String.raw`\lambda_{\text{bawah}} = \lim_{q \to 0} P(V \le q \mid U \le q), \qquad \lambda_{\text{bawah}}^{\text{Clayton}} = 2^{-1/\theta}`,
      formulaNote: "λ_bawah = koefisien lower tail dependence; θ (theta) = parameter Clayton; θ = 2 → 2^(−1/2) ≈ 0,71 — 71 persen kejadian ekstrem bawah datang berpasangan; Gaussian: λ = 0.",
      tasks: [
        { id: "t1", text: "Hitung `lambda_clayton` = 2^(-1/theta) untuk theta = 2 (2 desimal)" },
        { id: "t2", text: "Tetapkan `lambda_gauss` = 0 — Gaussian tanpa tail dependence" },
      ],
      expected: "lambda_clayton=0.71  lambda_gauss=0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "λ adalah satu angka yang membedakan model yang jujur di krisis dari model yang hanya jujur di masa tenang. Kalau laporan risikomu tidak menyebut λ, tanyakan: copula apa, dan berapa tail dependence-nya?",
      },
      hints: [
        "lambda_clayton = round(2 ** (-1/theta), 2).",
        "Gaussian: lambda = 0 berapa pun korelasinya (di bawah 1).",
        "print(f\"lambda_clayton={lambda_clayton}  lambda_gauss={lambda_gauss}\")",
      ],
      code: {
        starter: `# Clayton theta=2 vs Gaussian: siapa yang menularkan ekstrem bawah?\ntheta = 2\n\n# TULIS KODEMU\nlambda_clayton = \nlambda_gauss = \n\nprint(f"lambda_clayton={lambda_clayton}  lambda_gauss={lambda_gauss}")`,
        lockLines: 2,
        solution: `# Clayton theta=2 vs Gaussian: siapa yang menularkan ekstrem bawah?\ntheta = 2\n\n# TULIS KODEMU\nlambda_clayton = round(2 ** (-1/theta), 2)\nlambda_gauss = 0\n\nprint(f"lambda_clayton={lambda_clayton}  lambda_gauss={lambda_gauss}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lambda_clayton", value: 0.71, tol: 0.01, label: "`lambda_clayton` seharusnya 0.71", msg: "2^(−1/2) ≈ 0,707 → 0,71." },
          { kind: "equal", task: "t2", name: "lambda_gauss", value: 0, tol: 1e-9, label: "`lambda_gauss` seharusnya 0", msg: "Gaussian: λ = 0 — asymptotic independence (di limit); pada kuantil berhingga ekstrem masih bisa bergerak bareng." },
          { kind: "stdout_matches", task: "t2", pattern: "lambda_clayton=0\\.71\\s+lambda_gauss=0", label: "`print` menampilkan keduanya", msg: "Format: lambda_clayton=...  lambda_gauss=... ." },
        ],
      },
      quiz: [
        {
          q: "Clayton θ=2 memberi λ_bawah ≈ 0,71, Gaussian λ=0, korelasi sama. Artinya?",
          options: [
            { text: "Kedua model sama risikonya", why: "Salah: peluang default bersama ekstrem beda jauh — 71% vs 0%." },
            { text: "Clayton: 71% kejadian ekstrem bawah datang berpasangan; Gaussian: λ = 0 (asymptotic independence — bukan independensi pada kuantil berhingga)", why: "Benar: λ mengukur penularan ekstrem — korelasi saja tidak menangkapnya.", correct: true },
            { text: "Gaussian lebih aman karena λ=0", why: "Salah: λ=0 bukan aman — ia meremehkan risiko krisis bersama." },
          ],
        },
        {
          q: "Untuk memilih copula dari data, ukuran yang paling relevan di ekor adalah…",
          options: [
            { text: "Korelasi Pearson saja", why: "Salah: korelasi tidak menentukan bentuk ekor." },
            { text: "Frekuensi kejadian bersama di kuantil ekstrem — estimasi empiris λ", why: "Benar: bandingkan λ empiris dengan λ tiap keluarga, lalu pilih yang paling dekat.", correct: true },
            { text: "Mean tiap marginal", why: "Salah: marginal tidak menentukan dependensi." },
          ],
        },
      ],
      reference: "λ = ukuran penularan ekstrem. Gaussian 0, Clayton 2^(−1/θ), t simetris.",
    },
    {
      id: "gap-g16-estimasi-parameter-copula",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G16)",
      title: "Mengestimasi parameter copula dari data: dua jalan yang jujur",
      prose: [
        "Copula tanpa parameter yang diestimasi dari data hanyalah kurva yang digambar tangan. Dua jalan standar: pertama, metode momen via korelasi rank. Untuk copula Gaussian, korelasi linear ρ dihubungkan dengan Kendall tau oleh ρ = sin(πτ/2). Contoh: tau sampel 0,4 → ρ = sin(0,2π) = sin(36°) = 0,5878. Untuk copula Clayton, tau = θ/(θ+2), dibalik menjadi θ = 2τ/(1−τ): tau 0,4 → θ = 0,8/0,6 = 1,333. Kelebihannya: cepat, robust terhadap outlier (rank, bukan nilai), dan tidak butuh asumsi marginal. Kelemahannya: hanya memakai satu angka ringkas — informasi bentuk distribusi bersama yang lain terbuang.",
        "Kedua, maximum likelihood dua tahap (IFM — inference functions for margins). Tahap satu: fit marginal tiap variabel sendiri-sendiri, ubah data menjadi pseudo-observasi uniform lewat CDF empiris (rank dibagi n+1 — jangan pernah memakai CDF parametrik yang salah untuk tahap ini). Tahap dua: maksimalkan likelihood copula atas pseudo-observasi itu. IFM efisien dan menjadi standar industri, tetapi standard error-nya harus dikoreksi (tahap satu membawa ketidakpastian sendiri) — laporkan dengan bootstrap bila ragu. Full MLE satu tahap memang lebih efisien, tetapi bila marginal salah spesifikasi, kesalahan itu merembes ke parameter copula.",
        "Aturan pemilihan: mulai dari momen-rank untuk nilai awal dan sanity check, lanjutkan ke IFM untuk estimasi akhir, dan selalu bandingkan copula yang di-fit dengan copula empiris (misal lewat uji goodness-of-fit Genest–Rémillard) sebelum dipakai untuk pricing atau risk. Copula yang parameternya cantik tetapi gagal uji kecocokan sama berbahayanya dengan copula yang tidak pernah diestimasi.",
      ],
      formula: String.raw`\rho = \sin\left(\frac{\pi \tau}{2}\right) \qquad \theta_{\text{Clayton}} = \frac{2\tau}{1-\tau}`,
      formulaNote: "Tau 0,4 → ρ Gaussian 0,5878; θ Clayton 1,333. IFM: marginal dulu (rank), baru likelihood copula.",
      tasks: [
        { id: "t1", text: "Hitung `rho_gauss` dari tau 0,4 (rumus sin)" },
        { id: "t2", text: "Hitung `theta_clayton` dari tau 0,4" },
      ],
      expected: "rho_gauss=0.5878  theta_clayton=1.3333",
      hints: [
        "rho = sin(pi × tau / 2); tau = 0,4.",
        "theta Clayton = 2×tau / (1 − tau).",
        "Bulatkan 4 desimal di print.",
      ],
      code: {
        starter: `import math\n\ntau = 0.4  # Kendall tau sampel\n\n# TULIS KODEMU: parameter copula dari tau.\nrho_gauss = \ntheta_clayton = \n\nprint(f"rho_gauss={rho_gauss:.4f}  theta_clayton={theta_clayton:.4f}")`,
        lockLines: 3,
        solution: `import math\n\ntau = 0.4  # Kendall tau sampel\n\n# TULIS KODEMU: parameter copula dari tau.\nrho_gauss = math.sin(math.pi * tau / 2)\ntheta_clayton = 2 * tau / (1 - tau)\n\nprint(f"rho_gauss={rho_gauss:.4f}  theta_clayton={theta_clayton:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rho_gauss", value: 0.5878, tol: 0.001, label: "`rho_gauss` = 0,5878", msg: "sin(0,2π) = sin(36°) = 0,5878." },
          { kind: "equal", task: "t2", name: "theta_clayton", value: 1.3333, tol: 0.001, label: "`theta_clayton` = 1,3333", msg: "2×0,4/(1−0,4) = 0,8/0,6 = 1,3333." },
          { kind: "stdout_matches", task: "t2", pattern: "rho_gauss=0.5878\\s+theta_clayton=1.3333", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Kenapa IFM memakai CDF empiris (rank) untuk tahap marginal, bukan CDF parametrik?",
          options: [
            { text: "Supaya kesalahan spesifikasi marginal tidak merembes ke parameter copula", why: "Tepat: rank bebas asumsi distribusi; CDF parametrik yang salah mencemari tahap copula.", correct: true },
            { text: "Karena CDF empiris selalu lebih akurat dari CDF parametrik", why: "Salah: bukan soal akurasi — soal isolasi kesalahan; CDF parametrik yang benar justru lebih efisien." },
            { text: "Karena likelihood copula tidak bisa dihitung dari CDF parametrik", why: "Salah: bisa — full MLE memang begitu; hanya saja rapuh terhadap salah spesifikasi." },
            { text: "Supaya standard error otomatis benar tanpa bootstrap", why: "Salah: IFM tetap butuh koreksi standard error karena tahap satu membawa ketidakpastian." },
          ],
        },
      ],
      reference: "Estimasi copula: momen-rank (rho = sin(πτ/2), theta Clayton = 2τ/(1−τ)) untuk awal; IFM dua tahap dengan pseudo-observasi rank untuk akhir; uji goodness-of-fit sebelum dipakai.",
    },
    {
      id: "gap-g17-tail-dependence-q5",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G17)",
      title: "Tail dependence pada q = 5%: kenapa estimasinya goyah",
      prose: [
        "Lesson ini sudah menegaskan Gaussian copula punya tail dependence asimtotik nol (λ = 0) tetapi co-exceedance pada kuantil berhingga tetap ada. Langkah ini menjawab pertanyaan lanjutannya: seberapa bisa dipercaya angka λ yang diestimasi pada q = 5%? Estimator empirisnya λ(q) = P(U lebih dari q dan V lebih dari q) / P(V lebih dari q) — proporsi kejadian bersama di antara kejadian ekstrem satu sisi. Masalahnya adalah penyebutnya: pada q = 5% dan n = 500, hanya ada 25 kejadian ekstrem untuk dihitung. Statistik dari 25 observasi itu rapuh.",
        "Hitung simpangan bakunya. Bila λ sebenarnya 0,30, jumlah co-exceedance mengikuti Binomial(25; 0,30): simpangan baku λ topi = akar(0,30 × 0,70 / 25) = 0,092 — interval kepercayaan 95%-nya selebar ±0,18, dari 0,12 sampai 0,48. Angka itu praktis tidak memberi tahu apa-apa: ia konsisten dengan tail dependence lemah maupun kuat. Dengan n = 5.000 (250 kejadian ekstrem), simpangan baku menyusut ke 0,029 dan intervalnya ±0,057 — baru bisa dipakai untuk keputusan. Aturan kasarnya: butuh sedikitnya 100 kejadian ekstrem (n × q di atas 100) sebelum λ(q) layak dilaporkan sebagai angka, bukan sebagai anekdot.",
        "Implikasi praktisnya tiga. Satu, jangan pernah membandingkan λ(q) antar copula pada sampel kecil — selisih 0,1 bisa murni noise. Dua, bila datamu kecil, laporkan interval kepercayaannya bersama titik estimasinya, atau turunkan ambang ke q = 10% (lebih banyak kejadian, lebih stabil — dengan catatan λ(10%) bukan λ(5%)). Tiga, untuk keputusan pricing CDO atau modal, pakai estimator yang meminjam kekuatan dari seluruh ekor (misal estimator berbasis extreme value theory atau model copula parametrik yang di-fit penuh) — bukan hitungan mentah dari 25 titik.",
      ],
      formula: String.raw`SE(\hat{\lambda}) = \sqrt{\frac{\lambda(1-\lambda)}{n \times q}} \qquad \text{butuh } n \times q \geq 100`,
      formulaNote: "n=500, q=5%: SE 0,092, interval 95% ±0,18. n=5.000: SE 0,029, interval ±0,057.",
      tasks: [
        { id: "t1", text: "Hitung `se_500` dan `se_5000` (simpangan baku lambda topi, lambda benar 0,30)" },
        { id: "t2", text: "Hitung `lebar_500` dan `lebar_5000` (setengah-lebar interval 95%)" },
      ],
      expected: "se_500=0.092  se_5000=0.029  lebar_500=0.180  lebar_5000=0.057",
      hints: [
        "Kejadian ekstrem = n × q; q = 0,05.",
        "SE = akar(lambda×(1−lambda)/kejadian); lambda = 0,30.",
        "Setengah-lebar 95% = 1,96 × SE. Bulatkan 3 desimal di print.",
      ],
      code: {
        starter: `import math\n\nlam = 0.30  # tail dependence sebenarnya\nq = 0.05\n\n# TULIS KODEMU: SE lambda topi pada n=500 dan n=5000.\ndef se(n):\n    kejadian = n * q\n    return math.sqrt(lam * (1 - lam) / kejadian)\n\nse_500 = \nse_5000 = \nlebar_500 = \nlebar_5000 = \n\nprint(f"se_500={se_500:.3f}  se_5000={se_5000:.3f}  lebar_500={lebar_500:.3f}  lebar_5000={lebar_5000:.3f}")`,
        lockLines: 7,
        solution: `import math\n\nlam = 0.30  # tail dependence sebenarnya\nq = 0.05\n\n# TULIS KODEMU: SE lambda topi pada n=500 dan n=5000.\ndef se(n):\n    kejadian = n * q\n    return math.sqrt(lam * (1 - lam) / kejadian)\n\nse_500 = se(500)\nse_5000 = se(5000)\nlebar_500 = 1.96 * se_500\nlebar_5000 = 1.96 * se_5000\n\nprint(f"se_500={se_500:.3f}  se_5000={se_5000:.3f}  lebar_500={lebar_500:.3f}  lebar_5000={lebar_5000:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se_500", value: 0.092, tol: 0.001, label: "`se_500` = 0,092", msg: "akar(0,3×0,7/25) = 0,092 — dari hanya 25 kejadian ekstrem." },
          { kind: "equal", task: "t1", name: "se_5000", value: 0.029, tol: 0.001, label: "`se_5000` = 0,029", msg: "akar(0,3×0,7/250) = 0,029 — sepuluh kali data, SE menyusut 3,16 kali." },
          { kind: "equal", task: "t2", name: "lebar_500", value: 0.18, tol: 0.001, label: "`lebar_500` = 0,18", msg: "1,96×0,092 = 0,18 — interval 0,12 sampai 0,48, praktis tidak informatif." },
          { kind: "equal", task: "t2", name: "lebar_5000", value: 0.057, tol: 0.001, label: "`lebar_5000` = 0,057", msg: "1,96×0,029 = 0,057 — baru layak dipakai untuk keputusan." },
          { kind: "stdout_matches", task: "t2", pattern: "se_500=0.092\\s+se_5000=0.029\\s+lebar_500=0.180\\s+lebar_5000=0.057", label: "`print` menampilkan keempat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Dua copula dibandingkan pada n = 500, q = 5%: lambda topi 0,25 vs 0,35. Kesimpulan yang benar?",
          options: [
            { text: "Tidak ada kesimpulan — selisih 0,10 berada di dalam noise (SE sekitar 0,09)", why: "Tepat: interval keduanya tumpang tindih lebar; selisih itu konsisten dengan nol.", correct: true },
            { text: "Copula kedua punya tail dependence lebih kuat 0,10 — pakai itu untuk pricing", why: "Salah: selisih 0,10 dengan SE 0,09 tidak signifikan; pricing dari noise = keputusan dari noise." },
            { text: "Turunkan q ke 1% agar estimasi lebih akurat", why: "Salah: q lebih kecil = kejadian lebih sedikit = SE lebih BESAR, bukan lebih kecil." },
            { text: "Naikkan q ke 10% agar lambda-nya sama dengan lambda 5%", why: "Salah: lambda(10%) bukan lambda(5%); q lebih besar memang lebih stabil, tapi mengukur hal berbeda." },
          ],
        },
      ],
      reference: "SE lambda(q) = akar(λ(1−λ)/(n×q)); n=500, q=5% → SE 0,092, interval ±0,18 — butuh n×q di atas 100 sebelum lambda layak dilaporkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B11.",
      ],
      tasks: [],
      summary: [
        "Sklar: joint = copula(marginal) \u2014 pisahkan bentuk individu dari ketergantungan.",
        "Tail dependence (\u03BB): \u201Cekstrem menular?\u201D \u2014 Gaussian \u03BB=0, t simetris, Clayton bawah, Gumbel atas.",
        "Pelajaran 2008: korelasi masa tenang + copula tanpa tail dependence = bencana.",
        "Alur: fit marginal \u2192 ke uniform \u2192 pilih copula sesuai ekor \u2192 validasi di ekor.",
        "Jangan samakan korelasi dengan dependensi \u2014 dan jangan validasi model krisis dengan data masa tenang.",
      ],
      next: { label: "B11 \u2014 LLN & CLT", href: "/v2/learn/b11-lln-clt" },
      quiz: [
        {
          q: "Teorema Sklar: H(x,y) = C(F(x), G(y)). Artinya\u2026",
          options: [
            { text: "Joint = jumlah marginal", why: "Salah: bukan penjumlahan." },
            { text: "Joint = copula(marginal) \u2014 dependensi terpisah dari marginal", why: "Benar: pemisahan elegan \u2014 bentuk tiap variabel bebas dipilih, lalu dipasang struktur dependensi.", correct: true },
            { text: "Copula = korelasi", why: "Salah: korelasi hanya satu angka; copula seluruh bentuk." },
          ],
        },
        {
          q: "Dosa fatal copula Gaussian untuk risiko kredit\u2026",
          options: [
            { text: "Terlalu rumit", why: "Salah: justru terlalu sederhana di ekor." },
            { text: "Tidak punya tail dependence asimtotik (λ=0) — default bersama saat krisis diremehkan", why: "Benar: λ=0 berarti peluang default bersama → 0 di limit — tetapi pada kuantil berhingga Gaussian masih punya co-exceedance (contoh Langkah 2: 1,2% vs 0,25% independen), jadi 'dianggap independen' hanya benar asimtotik; dosanya adalah meremehkan ekor, bukan mengklaim independensi penuh.", correct: true },
            { text: "Hanya untuk data normal", why: "Salah: copula Gaussian bisa dipasang marginal apa pun \u2014 masalahnya struktur ekornya." },
          ],
        },
        {
          q: "Dua portofolio, korelasi sama 0,5, copula beda (Gaussian vs Clayton). Maka\u2026",
          options: [
            { text: "Risiko krisis bersama sama", why: "Salah: bentuk ekor beda \u2192 peluang krisis bersama beda jauh." },
            { text: "Peluang krisis bersama bisa beda jauh", why: "Benar: korelasi hanya satu angka linear; bentuk ekor ditentukan copula.", correct: true },
            { text: "Korelasi salah hitung", why: "Salah: korelasinya benar \u2014 tapi tidak cukup." },
          ],
        },
        {
          q: "Dua hal yang TIDAK berubah saat ganti copula Gaussian \u2192 Clayton (marginal tetap)?",
          options: [
            { text: "Distribusi marginal tiap variabel; korelasi rank relatif stabil", why: "Benar: copula tidak menyentuh marginal; korelasi rank (Spearman/Kendall) hanya bergantung pada copula — stabil terhadap transformasi monoton marginal, TETAPI berubah bila struktur dependensinya berubah, jadi 'relatif stabil' hanya terhadap marginal, bukan terhadap rezim.", correct: true },
            { text: "Peluang default bersama", why: "Salah: itu yang berubah paling dramatis." },
            { text: "Korelasi linear selalu sama", why: "Salah: korelasi linear bisa ikut berubah." },
          ],
        },
        {
          q: "Mengapa mengestimasi korelasi copula dari \u201Cmasa tenang\u201D berbahaya untuk pricing CDO?",
          options: [
            { text: "Datanya terlalu sedikit", why: "Salah: masalahnya bukan jumlah, tapi rezim." },
            { text: "Masa tenang tak mengandung kejadian ekstrem \u2192 tail dependence tak terestimasi \u2192 Gaussian terlihat \u201Ccocok\u201D", why: "Benar: \u201Ctidak ada di data\u201D \u2260 \u201Ctidak mungkin\u201D.", correct: true },
            { text: "Korelasi masa tenang selalu 0", why: "Salah: tidak selalu 0 \u2014 tapi tidak relevan untuk krisis." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const b11: V2Lesson = {
  slug: "b11-lln-clt",
  track: "Probabilitas",
  module: "Limit",
  title: "B11. LLN & CLT: Mengapa Rata-rata Sampel Bisa Dipercaya",
  estMinutes: 55,
  steps: [
    {
      id: "survei-1000",
      eyebrow: "Langkah 1 · Survei 1.000 orang",
      title: "1.000 mewakili 200 juta \u2014 kok bisa?",
      prose: [
        "Survei elektabilitas: 1.000 responden diklaim mewakili 200 juta pemilih, dengan \u201Cmargin of error \u00B13%\u201D. 1.000 dari 200 juta itu 0,0005%! Jawabannya dua teorema terpenting statistika. LLN: rata-rata 1.000 orang mendekati rata-rata populasi. CLT: seberapa dekatnya bisa dihitung \u2014 dan hanya bergantung pada n (1.000), bukan besar populasi (200 juta)!",
        "Angkanya: proporsi p=0,5 (kasus terburuk), n=1.000 \u2192 SE = \u221A(0,25/1000) \u2248 1,58%. Margin of error 95% = 1,96\u00D7SE \u2248 \u00B13,1% \u2014 inilah \u201C\u00B13%\u201D di cerita pembuka! Populasi 200 juta tidak masuk rumus \u2014 hanya n.",
        "Twist-nya: 1.000 mewakili 200 juta \u2014 tapi tidak jika seribunya bukan acak (survei Twitter!). LLN dan CLT menjamin \u201Cn besar \u2192 akurat\u201D hanya jika sampel acak. Keajaibannya bukan pada angka 1.000 \u2014 melainkan pada kata \u201Cacak\u201D.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `se` = SE proporsi (p=0,5, n=1000)" },
        { id: "t2", text: "Hitung `moe` = margin of error 95%, cetak keduanya persen" },
      ],
      expected: "se=1.58%  moe=3.10%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dua teorema ini fondasi A/B testing, interval kepercayaan, dan Monte Carlo (B12). Tanpa mereka, tidak ada inferensi \u2014 hanya angka mentah.",
      },
      hints: [
        "se = (0.25/1000)**0.5.",
        "moe = 1.96 * se.",
        "print(f\"se={se:.2%}  moe={moe:.2%}\")",
      ],
      code: {
        starter: `# Survei: p=0.5 (kasus terburuk), n=1000\n\n# TULIS KODEMU: standard error dan margin of error 95%\nse = \nmoe = \n\nprint(f"se={se:.2%}  moe={moe:.2%}")`,
        lockLines: 1,
        solution: `# Survei: p=0.5 (kasus terburuk), n=1000\n\n# TULIS KODEMU: standard error dan margin of error 95%\nse = (0.25/1000) ** 0.5\nmoe = 1.96 * se\n\nprint(f"se={se:.2%}  moe={moe:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.01581, tol: 0.0002, label: "`se` seharusnya \u2248 1,58%", msg: "\u221A(0,25/1000) \u2248 0,0158." },
          { kind: "equal", task: "t2", name: "moe", value: 0.031, tol: 0.001, label: "`moe` seharusnya \u2248 3,10%", msg: "1,96 \u00D7 0,0158 \u2248 0,031." },
          { kind: "stdout_matches", task: "t2", pattern: "se=1\\.58%\\s+moe=3\\.10%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "MoE 95% = 1,96 \u00D7 SE. Populasi tidak masuk rumus.",
    },
    {
      id: "lln",
      eyebrow: "Langkah 2 · LLN",
      title: "Rata-rata menuju ekspektasi \u2014 dengan syarat",
      prose: [
        "Hukum Bilangan Besar: x\u0304_n \u2192 E[X] saat n\u2192\u221E (konvergensi dalam peluang). Intuisi: tiap sampel baru \u201Cmengencerkan\u201D pengaruh sampel lama. Setelah 10.000 lemparan, 10 lemparan awal yang sial tidak lagi berarti.",
        "Kapan GAGAL? Syarat: E|X| < ∞ dan sampel i.i.d. Untuk Pareto α≤1, mean TIDAK ADA (E|X| = ∞) — LLN tidak berlaku sama sekali. Untuk Pareto α=1,1, mean ADA (α·x_m/(α−1) = 1,1/0,1 = 11 untuk x_m=1) tetapi varians TAK HINGGA — LLN berlaku, namun rata-rata sampel konvergen sangat lambat: simulasi membuktikan mean kumulatif Pareto(α=1,1) meloncat terus, sementara Eksponensial(1) tenang mendekati 1. \"Tidak ada mean\" dan \"mean ada tetapi sulit diestimasi\" adalah dua hal berbeda.",
        "LLN adalah alasan kita percaya rata-rata sampel; CLT adalah penggaris yang mengukur kepercayaannya. LLN tanpa CLT = \u201Cpercaya saja\u201D tanpa ukuran.",
      ],
      formula: String.raw`\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i \;\xrightarrow[n\to\infty]{}\; E[X]`,
      formulaNote: "Syarat: sampel acak independen (i.i.d.) dan mean hingga.",
      tasks: [
        { id: "t1", text: "Simulasikan `N=10000` sampel Eksponensial(1) dan Pareto(\u03B1=1,1)" },
        { id: "t2", text: "Hitung mean kumulatif n=100 dan n=10000 untuk keduanya" },
        { id: "t3", text: "Cetak keempatnya" },
      ],
      expected: "eksponensial stabil \u22481; pareto meloncat",
      note: {
        title: "Sering salah",
        body: "\u201CLLN berarti 1.000 sampel selalu dekat dengan populasi.\u201D LLN asimtotik (n\u2192\u221E) \u2014 tidak menjanjikan seberapa dekat di n=1.000. \u201CSeberapa dekat\u201D diatur CLT + standard error.",
      },
      hints: [
        "Pareto: 1.0 / (random.random() ** (1/1.1)).",
        "mean kumulatif = sum(xs[:n])/n.",
        "Bandingkan kestabilan keduanya.",
      ],
      code: {
        starter: `import random\nrandom.seed(112)\nN = 10000\nxs = [random.expovariate(1) for _ in range(N)]\nys = [1.0 / (random.random() ** (1/1.1)) for _ in range(N)]\n\n# TULIS KODEMU: mean kumulatif n=100 dan n=10000\nm_eks_100, m_eks_10k = \nm_par_100, m_par_10k = \n\nprint(f"eksponensial: n=100 -> {m_eks_100:.2f}, n=10000 -> {m_eks_10k:.2f}")\nprint(f"pareto      : n=100 -> {m_par_100:.1f}, n=10000 -> {m_par_10k:.1f}")`,
        lockLines: 4,
        solution: `import random\nrandom.seed(112)\nN = 10000\nxs = [random.expovariate(1) for _ in range(N)]\nys = [1.0 / (random.random() ** (1/1.1)) for _ in range(N)]\n\n# TULIS KODEMU: mean kumulatif n=100 dan n=10000\nm_eks_100, m_eks_10k = sum(xs[:100])/100, sum(xs)/N\nm_par_100, m_par_10k = sum(ys[:100])/100, sum(ys)/N\n\nprint(f"eksponensial: n=100 -> {m_eks_100:.2f}, n=10000 -> {m_eks_10k:.2f}")\nprint(f"pareto      : n=100 -> {m_par_100:.1f}, n=10000 -> {m_par_10k:.1f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "m_eks_10k", value: 1.0, tol: 0.05, label: "mean eksponensial n=10000 \u2248 1", msg: "LLN bekerja: mendekati 1." },
          { kind: "defined", task: "t2", name: "m_par_10k", label: "`m_par_10k` terdefinisi", msg: "Hitung mean kumulatif Pareto." },
          { kind: "stdout_matches", task: "t3", pattern: "eksponensial:", label: "`print` menampilkan hasil", msg: "Cetak kedua baris perbandingan." },
        ],
      },
      reference: "Teorema punya SYARAT. Cek E|X|<\u221E sebelum percaya rata-rata.",
    },
    {
      id: "clt",
      eyebrow: "Langkah 3 · CLT",
      title: "Keajaiban bentuk lonceng",
      prose: [
        "CLT: (x\u0304_n \u2212 \u03BC)/(\u03C3/\u221An) \u2192 N(0,1). Apa pun bentuk distribusi asal (miring! bimodal! diskret!) \u2014 distribusi rata-rata sampel mendekati Normal. Data gaji (miring kanan parah) \u2192 rata-rata dari 100 gaji \u2192 (hampir) Normal!",
        "Contoh: waktu tunggu ~ Eksponensial(\u03BB=0,2/mnt): \u03BC=5 mnt, \u03C3=5 mnt (sangat miring!). Sampel n=100. P(rata-rata > 6 mnt)? SE = 5/10 = 0,5. z = (6\u22125)/0,5 = 2,0. P(Z>2) \u2248 2,3%. Padahal data aslinya Eksponensial \u2014 CLT yang memungkinkan hitungan ini.",
        "Seberapa cepat? Aturan praktis n \u2265 30 untuk data \u201Cwajar\u201D. Makin miring/ekor tebal data asal \u2192 makin besar n yang dibutuhkan.",
      ],
      formula: String.raw`\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \;\xrightarrow[n\to\infty]{}\; N(0,1) \qquad SE = \frac{\sigma}{\sqrt{n}}`,
      formulaNote: "x̄_n = rata-rata n sampel; μ, σ = mean dan SD populasi (yang tidak diketahui); σ/√n = standard error: ketidakpastian rata-rata sampel — menyusut dengan akar n; → N(0,1) artinya setelah dibakukan, distribusi rata-rata sampel mendekati Normal standar, APA PUN bentuk distribusi aslinya. Contoh angka: σ = 15, n = 400 → SE = 15/20 = 0,75 — angka ini artinya rata-rata sampel tipikal meleset sekitar ±0,75 dari μ; interval kepercayaan 95% ≈ ±1,96×0,75 ≈ ±1,5. Syaratnya: n cukup besar (untuk data miring butuh ratusan, bukan 30) dan σ hingga — untuk data berekor tebal dengan varians takhingga, CLT ini tidak berlaku dan intervalnya bohong.",
      tasks: [
        { id: "t1", text: "Hitung `se` untuk \u03C3=5, n=100" },
        { id: "t2", text: "Hitung `p` = P(rata-rata > 6) via z dan `math.erf`" },
        { id: "t3", text: "Cetak `se` dan `p`" },
      ],
      expected: "se=0.5  p=0.0228",
      note: {
        title: "Sering salah",
        body: "\u201CCLT berarti data menjadi normal jika n besar.\u201D SALAH total \u2014 yang menjadi normal adalah distribusi rata-rata sampel, bukan datanya! Data gaji 1 juta orang tetap miring kanan; yang normal adalah distribusi \u201Crata-rata dari 100 gaji\u201D.",
      },
      hints: [
        "se = 5 / 100**0.5 = 0.5.",
        "z = (6-5)/se = 2; p = 1 - 0.5*(1+erf(z/sqrt(2))).",
        "print(f\"se={se}  p={p:.4f}\")",
      ],
      code: {
        starter: `import math\nmu, sigma, n = 5, 5, 100\n\n# TULIS KODEMU: SE dan P(rata-rata > 6) via CLT\nse = \nz = (6 - mu) / se\np = \n\nprint(f"se={se}  p={p:.4f}")`,
        lockLines: 1,
        solution: `import math\nmu, sigma, n = 5, 5, 100\n\n# TULIS KODEMU: SE dan P(rata-rata > 6) via CLT\nse = sigma / math.sqrt(n)\nz = (6 - mu) / se\np = 1 - 0.5 * (1 + math.erf(z / math.sqrt(2)))\n\nprint(f"se={se}  p={p:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.5, tol: 1e-9, label: "`se` seharusnya 0,5", msg: "5/\u221A100 = 0,5." },
          { kind: "equal", task: "t2", name: "p", value: 0.0228, tol: 0.001, label: "`p` seharusnya \u2248 0,0228", msg: "P(Z>2) \u2248 2,28%." },
          { kind: "stdout_matches", task: "t3", pattern: "se=0\\.5\\s+p=0\\.0228", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "CLT: keajaiban terjadi pada rata-rata, bukan pada data.",
    },
    {
      id: "pajak-akar",
      eyebrow: "Langkah 4 · Pajak \u221An",
      title: "Presisi 2x butuh sampel 4x",
      prose: [
        "SE = \u03C3/\u221An. Untuk presisi 2x lipat \u2192 butuh 4x sampel (\u221An!). Inilah ekonomi survei: 1.000 \u2192 4.000 responden hanya memangkas error dari 3% ke 1,5%. Akar kuadrat adalah \u201Cpajak\u201D presisi \u2014 diminishing return yang tak terhindarkan.",
        "Kurva SE melandai: n=100 \u2192 SE 5%; n=400 \u2192 2,5%; n=1.000 \u2192 1,58%; n=4.000 \u2192 0,79%. Keputusan bisnis: kapan berhenti menambah sampel? Saat biaya sampel > nilai presisi tambahan.",
        "Implikasi A/B testing: beda konversi 0,5% butuh n besar agar SE lebih kecil dari efeknya. Inilah kalkulasi ukuran sampel.",
      ],
      tasks: [
        { id: "t1", text: "Hitung SE proporsi (p=0,5) untuk n = 100, 400, 1000, 4000" },
        { id: "t2", text: "Cetak keempatnya sebagai persen 2 desimal" },
      ],
      expected: "5.00%  2.50%  1.58%  0.79%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Presisi itu mahal. Tentukan dulu berapa presisi yang benar-benar dibutuhkan untuk keputusan \u2014 sebelum membayar survei atau eksperimen.",
      },
      hints: [
        "se(n) = (0.25/n)**0.5.",
        "Loop n dalam [100, 400, 1000, 4000].",
        "print satu baris berisi keempatnya.",
      ],
      code: {
        starter: `# TULIS KODEMU: SE untuk tiap n, cetak sekaligus\nns = [100, 400, 1000, 4000]\nses = \n\nprint(" ".join(f"{s:.2%}" for s in ses))`,
        lockLines: 1,
        solution: `# TULIS KODEMU: SE untuk tiap n, cetak sekaligus\nns = [100, 400, 1000, 4000]\nses = [(0.25/n) ** 0.5 for n in ns]\n\nprint(" ".join(f"{s:.2%}" for s in ses))`,
        checks: [
          { kind: "defined", task: "t1", name: "ses", label: "`ses` terdefinisi", msg: "Hitung SE untuk keempat n." },
          { kind: "stdout_matches", task: "t2", pattern: "5\\.00% 2\\.50% 1\\.58% 0\\.79%", label: "`print` menampilkan pola pajak \u221An", msg: "Cetak keempat SE sebagai persen." },
        ],
      },
      reference: "Diminishing return akar kuadrat: 4x sampel = 2x presisi.",
    },
    {
      id: "minicase-survei",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Survei kepuasan: 400 responden cukup?",
      prose: [
        "Bank survei 400 nasabah: 320 puas (80%). Direksi: \u201CBerapa rentang kepuasan sebenarnya? Dan kalau mau \u00B12%, berapa responden?\u201D (a) SE = \u221A(0,8\u00D70,2/400) = 0,02. Interval 95% = 0,80 \u00B1 1,96\u00D70,02 = 76%\u201384%. (CLT untuk proporsi: Binomial \u2192 Normal.)",
        "(b) 1,96\u00D7\u221A(0,25/n) \u2264 0,02 (pakai p=0,5, kasus terburuk) \u2192 \u221An \u2265 49 \u2192 n \u2265 2.401. Dari 400 ke 2.401 \u2014 pajak \u221An beraksi!",
        "Pelajaran bisnis: presisi itu mahal; tentukan dulu berapa presisi yang benar-benar dibutuhkan untuk keputusan sebelum bayar survei.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lo`, `hi` interval 95% proporsi puas" },
        { id: "t2", text: "Hitung `n_butuh` agar MoE \u2264 2% (p=0,5), cetak semuanya" },
      ],
      expected: "lo=76.1%  hi=83.9%  n_butuh=2401",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Interval 76%\u201384% = ketidakpastian keputusan yang jujur. Melapor \u201C80%\u201D tanpa interval = menyembunyikan presisi dari direksi.",
      },
      hints: [
        "se = (0.8*0.2/400)**0.5; lo = 0.8-1.96*se; hi = 0.8+1.96*se.",
        "n_butuh = ceil((1.96*0.5/0.02)**2) = 2401.",
        "import math untuk ceil.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU: interval 95% dan n untuk MoE <= 2%\nse = \nlo, hi = \nn_butuh = \n\nprint(f"lo={lo:.1%}  hi={hi:.1%}  n_butuh={n_butuh}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU: interval 95% dan n untuk MoE <= 2%\nse = (0.8*0.2/400) ** 0.5\nlo, hi = 0.8 - 1.96*se, 0.8 + 1.96*se\nn_butuh = math.ceil((1.96*0.5/0.02) ** 2)\n\nprint(f"lo={lo:.1%}  hi={hi:.1%}  n_butuh={n_butuh}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lo", value: 0.7608, tol: 0.001, label: "`lo` seharusnya \u2248 76,1%", msg: "0,8 \u2212 1,96\u00D70,02 \u2248 0,7608." },
          { kind: "equal", task: "t1", name: "hi", value: 0.8392, tol: 0.001, label: "`hi` seharusnya \u2248 83,9%", msg: "0,8 + 1,96\u00D70,02 \u2248 0,8392." },
          { kind: "equal", task: "t2", name: "n_butuh", value: 2401, tol: 1e-9, label: "`n_butuh` seharusnya 2401", msg: "ceil((1,96\u00D70,5/0,02)\u00B2) = 2401." },
          { kind: "stdout_matches", task: "t2", pattern: "lo=76\\.1%\\s+hi=83\\.9%\\s+n_butuh=2401", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Interval = estimasi \u00B1 1,96\u00D7SE. n dari MoE target.",
    },
    {
      id: "lln-clt-quiz",
      eyebrow: "Langkah 6 · Cek cepat",
      title: "LLN vs CLT dalam dua soal",
      prose: [
        "Dua pertanyaan untuk memisahkan dua teorema yang paling sering tertukar.",
      ],
      tasks: [],
      quiz: [
        {
          q: "LLN mengatakan\u2026",
          options: [
            { text: "Data menjadi normal", why: "Salah: itu (keliru) CLT." },
            { text: "Rata-rata sampel \u2192 ekspektasi saat n\u2192\u221E", why: "Benar: konvergensi rata-rata ke ekspektasi. \u201CMenjadi normal\u201D adalah CLT.", correct: true },
            { text: "n=30 selalu cukup", why: "Salah: tidak ada angka ajaib \u2014 tergantung kemiringan data." },
          ],
        },
        {
          q: "SE = \u03C3/\u221An. Untuk memangkas SE setengahnya, n harus\u2026",
          options: [
            { text: "2x", why: "Salah: 2x sampel hanya memangkas SE \u00F7\u221A2 \u2248 0,71x." },
            { text: "4x", why: "Benar: pajak akar kuadrat. 4x sampel = 2x presisi.", correct: true },
            { text: "10x", why: "Salah: 10x sampel \u2192 SE \u00F73,16x." },
          ],
        },
      ],
      note: {
        title: "Intuisi: presisi dua kali lipat harganya empat kali sampel",
        body: "Standard error menyusut dengan 1/√n — akar kuadrat yang kejam. Ingin margin error separuhnya? Siapkan sampel empat kali lipat. Ingin sepersepuluhnya? Seratus kali lipat. Praktisi memakai ini sebagai kalkulator anggaran tercepat: survei 400 responden memberi margin sekitar ±5%; untuk ±2,5% butuh 1.600, bukan 800. Banyak proyek mati bukan karena statistiknya salah, melainkan karena anggarannya dihitung linear. LLN memberi tahu rata-rata akan menuju ekspektasi; CLT memberi tahu caranya — menyebar Normal dengan lebar σ/√n. Dua jebakan yang dirasakan: pertama, folklor n = 30. Untuk data miring seperti gaji atau klaim, n = 30 belum cukup Normal — butuh ratusan. Kedua, memakai aproksimasi Normal CLT untuk ekor jauh. CLT bicara tentang pusat distribusi rata-rata; peluang kejadian 4σ darinya tetap bisa meleset jauh jika data aslinya berekor tebal. Aturan praktisnya: pakai CLT untuk interval di tengah, curigai untuk ekor; dan setiap kali seseorang meminta presisi dua kali lipat tanpa anggaran empat kali lipat, tunjukkan akarnya.",
      },

      reference: "LLN: rata-rata \u2192 ekspektasi. CLT: rata-rata \u2192 Normal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B12.",
      ],
      tasks: [],
      summary: [
        "LLN: x\u0304_n \u2192 E[X] \u2014 alasan percaya rata-rata (butuh mean hingga, i.i.d.).",
        "CLT: distribusi x\u0304_n \u2192 Normal \u2014 bukan datanya, tapi rata-ratanya.",
        "SE = σ/√n: penggaris presisi (bergantung σ dan n); presisi 2x = 4x sampel; populasi tak masuk rumus.",
        "Fondasi: survei \u00B13%, interval kepercayaan, uji hipotesis, A/B testing, Monte Carlo.",
        "Jangan paksa CLT untuk n kecil + data liar \u2014 dan jangan samakan \u201Cdata normal\u201D dengan \u201Crata-rata normal\u201D.",
      ],
      next: { label: "B12 \u2014 Monte Carlo", href: "/v2/learn/b12-monte-carlo" },
      quiz: [
        {
          q: "CLT: yang menjadi (mendekati) normal adalah\u2026",
          options: [
            { text: "Data aslinya", why: "Salah: data gaji 1 juta orang tetap miring kanan." },
            { text: "Distribusi rata-rata sampel", why: "Benar: rata-ratanya! Yang normal adalah distribusi \u201Crata-rata dari 100 gaji\u201D.", correct: true },
            { text: "Variansnya", why: "Salah: varians menyusut, bukan menjadi normal." },
          ],
        },
        {
          q: "Survei 1.000 orang untuk 200 juta pemilih valid karena\u2026",
          options: [
            { text: "1.000 cukup besar absolut", why: "Salah: 1.000 vs 200 juta itu 0,0005%." },
            { text: "Untuk σ yang sama, SE hanya bergantung pada n, bukan besar populasi", why: "Benar: SE = σ/√n — SE bergantung pada σ DAN n; untuk σ yang sama, hanya n yang mengubahnya, dan besar populasi tidak masuk rumus.", correct: true },
            { text: "Pemilih homogen", why: "Salah: tidak perlu homogen \u2014 perlu acak." },
          ],
        },
        {
          q: "LLN bisa gagal jika\u2026",
          options: [
            { text: "n terlalu besar", why: "Salah: n besar justru membantu \u2014 kalau syarat terpenuhi." },
            { text: "Mean tak hingga (Pareto \u03B1\u22641) atau tidak independen", why: "Benar: syarat E|X|<\u221E dan i.i.d. Data finansial berekor tebal = waspada.", correct: true },
            { text: "Sampel acak", why: "Salah: sampel acak justru syaratnya." },
          ],
        },
        {
          q: "Data Eksponensial (miring), n=100. P(rata-rata > \u03BC+2SE) \u2248 \u2026",
          options: [
            { text: "50%", why: "Salah: itu P(rata-rata > \u03BC)." },
            { text: "2,3%", why: "Benar: CLT \u2014 rata-rata \u2248 Normal meski data asal miring. z=2 \u2192 ekor 2,3%.", correct: true },
            { text: "16%", why: "Salah: itu untuk +1SE." },
          ],
        },
        {
          q: "Rata-rata 64 transaksi dari distribusi yang cukup ringan (tidak sangat miring; SD Rp80 ribu diketahui): mean Rp150 ribu, SD Rp80 ribu. P(rata-ratanya > Rp165 ribu)?",
          options: [
            { text: "SE=10, z=1,5 \u2192 \u22486,7%", why: "Benar: SE=80/8=10; z=(165\u2212150)/10=1,5.", correct: true },
            { text: "SE=80 \u2192 \u224850%", why: "Salah: SE = \u03C3/\u221An = 80/8 = 10, bukan 80." },
            { text: "Tidak bisa — soal tidak memberi tahu distribusinya", why: "Salah: soal tidak memberi info distribusi — kecukupan n=64 BERGANTUNG pada distribusi (untuk yang ringan, n=64 cukup; untuk yang sangat miring/berekor tebal, belum). Tanpa info itu kunci tidak dapat ditentukan." },
          ],
        },
      ],
    },
  ],
};

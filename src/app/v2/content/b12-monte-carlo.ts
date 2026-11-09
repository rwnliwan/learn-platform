import type { V2Lesson } from "../lib/types";

export const b12: V2Lesson = {
  slug: "b12-monte-carlo",
  track: "Probabilitas",
  module: "Simulasi",
  title: "B12. Monte Carlo: Ketika Rumus Menyerah, Simulasi Berbicara",
  estMinutes: 75,
  steps: [
    {
      id: "beras-pi",
      eyebrow: "Langkah 1 · Prinsip",
      title: "Menghitung \u03C0 dengan hujan beras",
      prose: [
        "Tempel kertas 2\u00D72 m di dinding, gambar lingkaran diameter 2 m. Lempar 10.000 butir beras acak. Yang jatuh di lingkaran: misal 7.854. Maka \u03C0 \u2248 4 \u00D7 7854/10000 = 3,1416. Kedengarannya konyol \u2014 tapi ini Monte Carlo: menjawab pertanyaan deterministik dengan acak.",
        "Prinsipnya: peluang butir jatuh di lingkaran = luas lingkaran / luas kertas = \u03C0/4 \u2014 dan LLN (B11) menjamin frekuensi \u2192 peluang. Banyak masalah = menghitung ekspektasi E[g(X)] yang integralnya sulit \u2192 ganti dengan rata-rata simulasi.",
        "Di keuangan: harga opsi eksotik, VaR portofolio kompleks, ECL dengan banyak skenario \u2014 semua yang rumusnya tidak ada atau terlalu sulit \u2014 dijawab Monte Carlo. Ketika rumus eksak tidak ada, \u201Ctebak-tebakan terstruktur\u201D (acak + LLN) lebih dapat diandalkan daripada model elegan yang asumsinya salah.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Market Risk, dan Portfolio Management — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      formula: String.raw`E[g(X)] \approx \frac{1}{N}\sum_{i=1}^{N} g(X_i), \quad SE_{MC} = \frac{\sigma_g}{\sqrt{N}}`,
      formulaNote: "X_i sampel acak. Ini LLN (B11) yang dipekerjakan.",
      tasks: [
        { id: "t1", text: "Estimasi \u03C0 dengan `N=2000` titik acak di kotak [\u22121,1]\u00B2" },
        { id: "t2", text: "Hitung `est` dan `se` (SE untuk 4\u00D7p), cetak keduanya" },
      ],
      expected: "est\u22483.14  se\u22480.04",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CMakin banyak simulasi = makin akurat, tanpa batas.\u201D Akurat iya, tapi error hanya turun 1/\u221AN: 100x simulasi = 10x presisi. Dari 10 ribu ke 1 juta simulasi (100x komputasi) error cuma turun 10x.",
      },
      hints: [
        "Titik dalam lingkaran jika x*x + y*y <= 1.",
        "p = dalam/N; est = 4*p; se = 4*sqrt(p*(1-p)/N).",
        "print(f\"est={est:.4f}  se={se:.4f}\")",
      ],
      code: {
        starter: `import random, math\nrandom.seed(123)\nN = 2000\n\n# TULIS KODEMU: estimasi pi dan SE-nya\ndalam = sum(1 for _ in range(N) if (lambda x, y: x*x + y*y <= 1)(random.uniform(-1,1), random.uniform(-1,1)))\np = \nest = \nse = \n\nprint(f"est={est:.4f}  se={se:.4f}")`,
        lockLines: 2,
        solution: `import random, math\nrandom.seed(123)\nN = 2000\n\n# TULIS KODEMU: estimasi pi dan SE-nya\ndalam = sum(1 for _ in range(N) if (lambda x, y: x*x + y*y <= 1)(random.uniform(-1,1), random.uniform(-1,1)))\np = dalam / N\nest = 4 * p\nse = 4 * math.sqrt(p*(1-p)/N)\n\nprint(f"est={est:.4f}  se={se:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "dalam", label: "`dalam` terdefinisi", msg: "Hitung titik yang jatuh di dalam lingkaran." },
          { kind: "equal", task: "t2", name: "est", value: 3.1416, tol: 0.06, label: "`est` mendekati \u03C0", msg: "Dengan seed 123, N=2000, estimasi harus dekat 3,14." },
          { kind: "equal", task: "t2", name: "se", value: 0.0367, tol: 0.01, label: "`se` mendekati 0,037", msg: "4\u00D7\u221A(p(1\u2212p)/N) \u2248 0,037." },
          { kind: "stdout_matches", task: "t2", pattern: "est=3\\.\\d+\\s+se=0\\.0", label: "`print` menampilkan keduanya", msg: "Cetak dengan format est=...  se=... ." },
        ],
      },
      reference: "Pola universal: tulis ekspektasi \u2192 sampel \u2192 rata-rata \u2192 SE.",
    },
    {
      id: "se-mc",
      eyebrow: "Langkah 2 · Error Monte Carlo",
      title: "10.000 butir: \u03C0 \u00B1 berapa?",
      prose: [
        "10.000 butir, 7.854 di lingkaran \u2192 \u03C0\u0302 = 3,1416. Berapa presisinya? Tiap butir ~ Bernoulli(p=\u03C0/4\u22480,785). SE(p\u0302) = \u221A(0,7854\u00D70,2146/10000) \u2248 0,0041. \u03C0\u0302 = 4p\u0302 \u2192 SE(\u03C0\u0302) = 4 \u00D7 0,0041 = 0,0164. IK95%: 3,1416 \u00B1 0,032.",
        "Monte Carlo selalu datang dengan SE-nya sendiri (\u221D 1/\u221AN). Tanpa SE, angka Monte Carlo = tebakan tanpa ukuran ketidakpastian. Rumus menentukan N: mau error \u03B5 dengan keyakinan 95% \u2192 N \u2248 (1,96\u03C3/\u03B5)\u00B2. π ± 0,001 → N ≈ 10,4 juta. (σ yang benar untuk π̂ adalah σ(π̂) = 4 × σ(p̂) = 4 × 0,4106 = 1,64 — bukan 0,4106: N ≈ (1,96 × 1,64 / 0,001)² ≈ 10,4 juta. Memakai 0,4106 langsung memberi 650 ribu, 16× terlalu kecil — faktor 4 yang hilang, dikuadratkan.) Jangan pilih N dari \u201Cangka bulat yang enak\u201D.",
        "Monte Carlo adalah \u201Cpekerja kasar yang jujur\u201D \u2014 tidak pintar (error turun lambat), tapi tidak pernah berbohong tentang errornya dan bisa mengerjakan apa pun yang bisa disimulasikan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `se_pi` untuk kasus 10.000 butir (p\u0302=0,7854)" },
        { id: "t2", text: "Hitung `lebar` = setengah lebar IK95%, cetak keduanya 4 desimal" },
      ],
      expected: "se_pi=0.0164  lebar=0.0322",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Monte Carlo tanpa SE yang dilaporkan = setengah bohong \u2014 tidak tahu ketelitiannya. Kejujuran MC = ia tahu errornya sendiri.",
      },
      hints: [
        "se_p = (0.7854*0.2146/10000)**0.5; se_pi = 4*se_p.",
        "lebar = 1.96 * se_pi.",
        "print(f\"se_pi={se_pi:.4f}  lebar={lebar:.4f}\")",
      ],
      code: {
        starter: `import math\np_hat, N = 0.7854, 10000\n\n# TULIS KODEMU: SE estimasi pi dan setengah lebar IK95%\nse_pi = \nlebar = \n\nprint(f"se_pi={se_pi:.4f}  lebar={lebar:.4f}")`,
        lockLines: 2,
        solution: `import math\np_hat, N = 0.7854, 10000\n\n# TULIS KODEMU: SE estimasi pi dan setengah lebar IK95%\nse_pi = 4 * math.sqrt(p_hat*(1-p_hat)/N)\nlebar = 1.96 * se_pi\n\nprint(f"se_pi={se_pi:.4f}  lebar={lebar:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se_pi", value: 0.0164, tol: 0.0005, label: "`se_pi` seharusnya \u2248 0,0164", msg: "4\u00D7\u221A(0,7854\u00D70,2146/10000) \u2248 0,0164." },
          { kind: "equal", task: "t2", name: "lebar", value: 0.0322, tol: 0.001, label: "`lebar` seharusnya \u2248 0,0322", msg: "1,96 \u00D7 0,0164 \u2248 0,0322." },
          { kind: "stdout_matches", task: "t2", pattern: "se_pi=0\\.0164\\s+lebar=0\\.0322", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "N \u2248 (1,96\u03C3/\u03B5)\u00B2. Tentukan N dari target error.",
    },
    {
      id: "lab-var",
      eyebrow: "Langkah 3 · Lab VaR",
      title: "VaR portofolio yang tidak ada rumusnya",
      prose: [
        "Saham Rp10.000, return harian ~ Normal(\u03BC=0,05%, \u03C3=2%). Simulasikan 5.000 hari: S1 = S0\u00D7exp(return), P&L = S1\u2212S0. VaR 95% = kerugian pada kuantil 5% dari P&L terurut. Tidak butuh rumus \u2014 butuh model simulasi yang jujur.",
        "Expected Shortfall (ES) = rata-rata kerugian JIKA tembus VaR \u2014 ukuran yang lebih informatif karena VaR tidak bilang \u201Cseberapa dalam\u201D saat jebol. Monte Carlo memisahkan \u201Cmodel dunia\u201D (distribusi) dari \u201Cperhitungan\u201D (simulasi): payoff serumit apa pun \u2014 asal bisa dihitung per skenario \u2014 VaR-nya bisa diestimasi.",
        "Catatan: 5.000 skenario cukup untuk demo di browser. Di produksi, VaR 99% butuh N jauh lebih besar — atau importance sampling (langkah 4). Dan ingat aturan lesson ini sendiri: estimasi MC tanpa SE = angka tanpa kejujuran. Untuk rata-rata P&L, SE = SD/√N langsung bisa dihitung; untuk kuantil seperti VaR/ES, SE-nya lebih besar dan butuh bootstrap atau teori statistik urutan — jangan laporkan VaR/ES simulasi tanpa ukuran ketidakpastiannya."
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` P&L harian" },
        { id: "t2", text: "Hitung `var95` (kuantil 5%) dan `es95`, cetak keduanya" },
        { id: "t3", text: "Hitung `se_mean` = SE dari rata-rata P&L (SD/√N) — aturan lesson ini: setiap estimasi MC wajib ditemani SE-nya" },
      ],
      expected: "var95≈330  es95≈410  se_mean≈2.8",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "VaR bilang \u201Cbatas wajar\u201D, ES bilang \u201Cseberapa dalam jika jebol\u201D. Keduanya dari distribusi simulasi yang sama \u2014 modelnya harus jujur (distribusi + copula yang benar, B7\u2013B10).",
      },
      hints: [
        "pl = S0*exp(gauss(mu, sigma)) - S0.",
        "Urutkan; var95 = -pl_sorted[int(0.05*N)].",
        "es95 = -mean(pl_sorted[:int(0.05*N)]).",
      ],
      code: {
        starter: `import random, math, statistics\nrandom.seed(124)\nS0, mu, sigma, N = 10_000, 0.0005, 0.02, 5000\npl = [S0*math.exp(random.gauss(mu, sigma)) - S0 for _ in range(N)]\npl_sorted = sorted(pl)\n\n# TULIS KODEMU: VaR 95% dan Expected Shortfall\nvar95 = \nes95 = \nse_mean = \n\nprint(f"var95={var95:.0f}  es95={es95:.0f}  se_mean={se_mean:.1f}")`,
        lockLines: 3,
        solution: `import random, math, statistics\nrandom.seed(124)\nS0, mu, sigma, N = 10_000, 0.0005, 0.02, 5000\npl = [S0*math.exp(random.gauss(mu, sigma)) - S0 for _ in range(N)]\npl_sorted = sorted(pl)\n\n# TULIS KODEMU: VaR 95% dan Expected Shortfall\nvar95 = -pl_sorted[int(0.05*N)]\nes95 = -statistics.mean(pl_sorted[:int(0.05*N)])\nse_mean = statistics.stdev(pl) / math.sqrt(N)\n\nprint(f"var95={var95:.0f}  es95={es95:.0f}  se_mean={se_mean:.1f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "var95", value: 330, tol: 60, label: "`var95` sekitar 330", msg: "Dengan seed 124, N=5000, VaR 95% \u2248 Rp330." },
          { kind: "equal", task: "t2", name: "es95", value: 410, tol: 80, label: "`es95` sekitar 410", msg: "ES > VaR \u2014 rata-rata kerugian saat tembus." },
          { kind: "stdout_matches", task: "t2", pattern: "var95=\\d+\\s+es95=\\d+", label: "`print` menampilkan keduanya", msg: "Cetak dengan format var95=...  es95=... ." },
          { kind: "equal", task: "t3", name: "se_mean", value: 2.8, tol: 0.3, label: "`se_mean` sekitar 2,8", msg: "SD(P&L)/√5000 ≈ 200/70,7 ≈ 2,8 — SE yang menemani estimasi MC." },
          { kind: "stdout_matches", task: "t3", pattern: "se_mean=\\d+\\.\\d", label: "`print` menampilkan SE", msg: "Estimasi MC tanpa SE = angka tanpa kejujuran." },
        ],
      },
      reference: "VaR = kuantil simulasi. ES = rata-rata ekor. Model harus jujur.",
    },
    {
      id: "variance-reduction",
      eyebrow: "Langkah 4 · Variance reduction",
      title: "Bekerja lebih cerdas, bukan lebih banyak",
      prose: [
        "Antithetic variates: tiap sampel Z dipasangkan dengan \u2212Z \u2014 saling mengkansel noise. Sering memangkas varians 2\u201310x, hampir gratis. Control variate: jika tahu E[h(X)] analitik dan h mirip g, simulasikan g\u2212h (varians kecil) lalu tambah E[h].",
        "Importance sampling: sampel lebih banyak di wilayah penting (ekor!) — wajib untuk kejadian langka; jika tidak, 1 juta simulasi pun tak menyentuh ekor. Tetapi ada syarat yang tidak boleh dilupakan: setiap sampel dari distribusi proposal q WAJIB dikoreksi dengan bobot likelihood-ratio w(x) = p(x)/q(x) — tanpa koreksi itu, rata-rata sampelmu adalah ekspektasi di bawah q, bukan di bawah p, alias estimator yang BIAS. Sampling terarah tanpa koreksi bukan variance reduction — itu jawaban salah yang terlihat presisi. Satu jam memikirkan variance reduction > satu hari menambah N.",
        "Contoh: estimasi E[max(S\u2212100,0)], N=10.000 memberi SE=0,5. Dengan antithetic, varians turun 60% \u2192 SE baru = 0,5\u00D7\u221A0,4 \u2248 0,316. N efektif = 10.000/0,4 = 25.000 \u2014 gratis, tanpa simulasi tambahan!",
      ],
      tasks: [
        { id: "t1", text: "Hitung `se_baru` setelah varians turun 60%" },
        { id: "t2", text: "Hitung `n_efektif`, cetak keduanya" },
      ],
      expected: "se_baru=0.316  n_efektif=25000",
      note: {
        title: "Sering salah",
        body: "\u201CMonte Carlo = asal simulasi banyak-banyak.\u201D Simulasi tanpa desain = pemborosan: seed tidak di-set (tidak reproducible!), tanpa SE (tidak tahu error), tanpa variance reduction (lambat 100x), model simulasi salah.",
      },
      hints: [
        "se_baru = 0.5 * 0.4**0.5.",
        "SE \u221D 1/\u221AN \u2192 n_efektif = 10000/0.4.",
        "print(f\"se_baru={se_baru:.3f}  n_efektif={int(n_efektif)}\")",
      ],
      code: {
        starter: `# SE awal 0.5 dari N=10000; antithetic memangkas varians 60%\n\n# TULIS KODEMU: SE baru dan N efektif\nse_baru = \nn_efektif = \n\nprint(f"se_baru={se_baru:.3f}  n_efektif={int(n_efektif)}")`,
        lockLines: 1,
        solution: `# SE awal 0.5 dari N=10000; antithetic memangkas varians 60%\n\n# TULIS KODEMU: SE baru dan N efektif\nse_baru = 0.5 * 0.4**0.5\nn_efektif = 10000 / 0.4\n\nprint(f"se_baru={se_baru:.3f}  n_efektif={int(n_efektif)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se_baru", value: 0.316, tol: 0.002, label: "`se_baru` seharusnya \u2248 0,316", msg: "0,5\u00D7\u221A0,4 \u2248 0,316." },
          { kind: "equal", task: "t2", name: "n_efektif", value: 25000, tol: 1e-9, label: "`n_efektif` seharusnya 25000", msg: "10.000/0,4 = 25.000 \u2014 gratis!" },
          { kind: "stdout_matches", task: "t2", pattern: "se_baru=0\\.316\\s+n_efektif=25000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Variance reduction = menghemat path, bukan N gratis: antithetic, control variate, importance sampling (selalu dengan koreksi likelihood-ratio).",
    },
    {
      id: "minicase-ecl",
      eyebrow: "Langkah 5 · Mini-case",
      title: "ECL dengan 3 skenario makro",
      prose: [
        "IFRS 9/PSAK 109 mewajibkan ECL = rata-rata tertimbang skenario: baseline (50%), adverse (30%), severe (20%). Bank punya model PD bersyarat makro \u2014 tapi distribusi makro kontinu, bukan 3 titik.",
        "Monte Carlo memperbaiki \u201C3 skenario\u201D: sampel 10.000 path makro (GDP, unemployment) dari distribusi forecast \u2192 hitung PD & ECL tiap path \u2192 rata-ratakan. Ini menghilangkan \u201Cloncatan\u201D antar 3 skenario diskret dan menangkap non-linearitas (Jensen, B5!). ECL 3-skenario bisa bias jika hubungan makro\u2192PD cembung.",
        "Risikonya: (1) distribusi forecast makro harus jujur (bukan Normal jika resesi berekor); (2) korelasi antar variabel makro (copula!); (3) 10.000 path \u00D7 portofolio besar = komputasi berat \u2192 butuh variance reduction atau surrogate model. MC memindahkan masalah dari \u201Crumus\u201D ke \u201Ckualitas model simulasi\u201D \u2014 tetap butuh B7\u2013B10 yang benar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ECL 3-skenario bisa bias sistematis jika hubungan makro\u2192PD non-linear. Monte Carlo mengintegrasikan seluruh distribusi \u2014 tapi kualitasnya = kualitas model simulasinya.",
      },
      quiz: [
        {
          q: "Bagaimana Monte Carlo memperbaiki ECL \u201C3 skenario\u201D?",
          options: [
            { text: "Menambah skenario jadi 10 titik", why: "Salah: masih diskret \u2014 loncatan tetap ada." },
            { text: "Mengintegrasikan seluruh distribusi makro kontinu via sampling", why: "Benar: menghilangkan loncatan antar skenario dan menangkap non-linearitas (Jensen).", correct: true },
            { text: "Menghapus skenario severe", why: "Salah: severe justru yang paling penting untuk ECL." },
          ],
        },
        {
          q: "Risiko utama MC untuk ECL?",
          options: [
            { text: "Terlalu cepat", why: "Salah: justru komputasi berat." },
            { text: "Kualitas model simulasi (distribusi makro + korelasinya) menentukan segalanya", why: "Benar: MC hanya sebaik modelnya \u2014 butuh B7\u2013B10 yang jujur.", correct: true },
            { text: "Tidak bisa paralel", why: "Salah: MC sangat mudah diparalelkan." },
          ],
        },
      ],
      reference: "MC: dari rumus ke kualitas model simulasi.",
    },
    {
      id: "kapan-mc",
      eyebrow: "Langkah 6 · Cek cepat",
      title: "Kapan (tidak) pakai Monte Carlo",
      prose: [
        "Dua pertanyaan untuk mengunci peta keputusan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Prinsip Monte Carlo untuk E[g(X)] adalah\u2026",
          options: [
            { text: "Integral analitik", why: "Salah: itu lawannya MC." },
            { text: "Rata-rata g(Xi) dari sampel acak (LLN)", why: "Benar: LLN dipekerjakan \u2014 rata-rata simulasi \u2192 ekspektasi.", correct: true },
            { text: "Tebakan", why: "Salah: tebakan terstruktur dengan SE terukur." },
          ],
        },
        {
          q: "Kapan sebaiknya TIDAK pakai Monte Carlo?",
          options: [
            { text: "VaR multi-aset", why: "Salah: ini kasus klasik MC." },
            { text: "Opsi eksotik", why: "Salah: tidak ada rumus \u2192 MC tepat." },
            { text: "Ada rumus analitik murah & eksak (Black-Scholes standar)", why: "Benar: jangan bayar noise & waktu untuk yang bisa eksak instan.", correct: true },
          ],
        },
      ],
      note: {
        title: "Intuisi: Monte Carlo dibayar dengan N — kurangi varians dulu, tambah N kemudian",
        body: "Standard error Monte Carlo adalah σ/√N — akar kuadrat yang sama kejamnya dengan survei. Menambah path dari 10.000 ke 1.000.000 hanya memangkas error sepuluh kali lipat dengan biaya seratus kali lipat. Praktisi tidak membayar pajak ini mentah-mentah; mereka mengakalinya. Variance reduction adalah seni membayar lebih murah: antithetic memasangkan tiap path dengan cerminnya, control variates mengurangkan sesuatu yang jawabannya diketahui, dan yang paling penting — importance sampling untuk kejadian langka. Mensimulasikan VaR 99% dengan sampling mentah berarti 99% path terbuang sia-sia; sampling yang diarahkan ke ekor — dengan koreksi bobot likelihood-ratio — BISA memberi jawaban yang sama dengan biaya jauh lebih kecil (seperseratus biaya hanya bila proposalnya dirancang baik; bukan janji pasti, dan tanpa koreksi bobot jawabannya bias). Aturan keputusannya: jika ada rumus analitik, pakai rumus. Jika integralnya berdimensi tinggi atau payoff-nya aneh, baru Monte Carlo — dan selalu laporkan standard error bersama estimasinya. Estimasi tanpa SE adalah angka tanpa kejujuran. Jebakan yang terasa: N besar memberi rasa aman palsu. Satu juta path dari model yang salah tetap salah — presisi bukan akurasi. Dan satu disiplin terakhir: seed yang tetap untuk eksperimen yang bisa direproduksi — Monte Carlo yang tidak reproducible bukanlah sains.",
      },

      reference: "Ada rumus eksak murah \u2192 jangan MC. Kejadian langka \u2192 importance sampling.",
    },
        {
          id: "gap-r7-importance-sampling-bobot",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P2-G1)",
          title: "Importance sampling: tanpa bobot, jawabannya bias",
          prose: [
            "Langkah 4 sudah menyatakan syaratnya — setiap sampel dari proposal q WAJIB dikoreksi dengan bobot likelihood-ratio w(x) = p(x)/q(x) — tetapi belum pernah menunjukkan SEBESAR APA kesalahannya bila koreksi itu dilupakan. Lab ini menunjukkannya dengan angka. Target: P(X > 2,5) untuk X ~ N(0,1) — nilai benarnya 0,00621 (kejadian langka). Proposal q = N(2,5, 1) mengarahkan sampel ke ekor: dari 5.000 sampel, 49,24% melewati 2,5. Tanpa koreksi, estimasimu 0,4924 — hampir 80× lipat dari jawaban benar. Itu bukan 'sedikit bias' — itu jawaban untuk pertanyaan yang berbeda (peluang di bawah q, bukan di bawah p).",
            "Dengan koreksi bobot likelihood-ratio, estimasi yang sama menjadi 0,00605 — nyaris tepat di nilai benar 0,00621. Bobotnya w(x) = p(x)/q(x) = exp(−x²/2 + (x−2,5)²/2): sampel yang 'terlalu mudah' di bawah q (x besar) diberi bobot kecil, sampel yang jarang di bawah q diberi bobot besar. Tetapi koreksi ini ada harganya: effective sample size (ESS) hanya 29 dari 5.000 sampel — proposal yang terlalu jauh dari target membuat segelintir sampel memegang hampir semua bobot. Pelajarannya berlapis: tanpa bobot = BIAS; dengan bobot = tak bias, tetapi proposal yang buruk tetap mahal — pilih proposal yang dekat dengan target (atau campuran defensif), dan selalu laporkan ESS bersama estimasinya.",
          ],
          formula: String.raw`\hat{p} = \frac{1}{n}\sum_{i=1}^{n} w(x_i)\,\mathbf{1}\{x_i > 2{,}5\} \qquad w(x) = \frac{p(x)}{q(x)}`,
          formulaNote: "Target P(X > 2,5) = 0,00621. Tanpa koreksi: 0,4924 (bias ~80×). Dengan koreksi: 0,00605. ESS = 29 dari 5.000.",
          tasks: [
            { id: "t1", text: "Hitung `est_tanpa_koreksi` (rata-rata indikator mentah) dan `nilai_benar`" },
            { id: "t2", text: "Hitung `est_dengan_koreksi` (bobot likelihood-ratio) dan `ess`" },
          ],
          expected: "tanpa_koreksi=0.4924 dengan_koreksi=0.00605 nilai_benar=0.00621 ess=29",
          hints: [
            "w(x) = exp(−x²/2 + (x−2,5)²/2) — rasio densitas N(0,1) terhadap N(2,5,1).",
            "ESS = (Σw)² / Σw² — makin kecil, makin sedikit sampel yang 'benar-benar bekerja'.",
          ],
          code: {
            starter: `import random, math, statistics as st\n\nrng = random.Random(42)\nn = 5000\n# target p: P(X > 2.5), X ~ N(0,1); proposal q: N(2.5, 1)\nxs = [rng.gauss(2.5, 1) for _ in range(n)]\n\n# TULIS KODEMU: estimasi TANPA koreksi vs DENGAN bobot likelihood-ratio\nest_tanpa_koreksi =\nest_dengan_koreksi =\nnilai_benar =\ness =\n\nprint(f"tanpa_koreksi={est_tanpa_koreksi} dengan_koreksi={est_dengan_koreksi} nilai_benar={nilai_benar} ess={ess}")`,
            lockLines: 8,
            solution: `import random, math, statistics as st\n\nrng = random.Random(42)\nn = 5000\n# target p: P(X > 2.5), X ~ N(0,1); proposal q: N(2.5, 1)\nxs = [rng.gauss(2.5, 1) for _ in range(n)]\n\n# TULIS KODEMU: estimasi TANPA koreksi vs DENGAN bobot likelihood-ratio\nest_tanpa_koreksi = round(sum(1 for x in xs if x > 2.5) / n, 4)\nw = [math.exp(-x * x / 2 + (x - 2.5) ** 2 / 2) for x in xs]\nest_dengan_koreksi = round(sum(wi for x, wi in zip(xs, w) if x > 2.5) / n, 5)\nnilai_benar = round(1 - st.NormalDist().cdf(2.5), 5)\ness = round(sum(w) ** 2 / sum(wi * wi for wi in w))\n\nprint(f"tanpa_koreksi={est_tanpa_koreksi} dengan_koreksi={est_dengan_koreksi} nilai_benar={nilai_benar} ess={ess}")`,
            checks: [
              { kind: "equal", task: "t1", name: "est_tanpa_koreksi", value: 0.4924, tol: 0.001, label: "`est_tanpa_koreksi` = 0,4924", msg: "Rata-rata indikator di bawah q — peluang di bawah proposal, bukan target." },
              { kind: "equal", task: "t1", name: "nilai_benar", value: 0.00621, tol: 0.0001, label: "`nilai_benar` = 0,00621", msg: "1 − Φ(2,5) = 0,00621." },
              { kind: "equal", task: "t2", name: "est_dengan_koreksi", value: 0.00605, tol: 0.0005, label: "`est_dengan_koreksi` = 0,00605", msg: "Dengan bobot w(x) = p(x)/q(x): nyaris tepat di nilai benar." },
              { kind: "equal", task: "t2", name: "ess", value: 29, tol: 2, label: "`ess` = 29", msg: "Hanya 29 dari 5.000 sampel yang benar-benar bekerja — proposal terlalu jauh." },
              { kind: "stdout_matches", task: "t2", pattern: "tanpa_koreksi=0\\.4924\\s+dengan_koreksi=0\\.00605\\s+nilai_benar=0\\.00621\\s+ess=29", label: "`print` menampilkan keempatnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Importance sampling tanpa koreksi bobot memberi 0,49 untuk peluang yang benarnya 0,006. Apa yang terjadi?",
              options: [
                { text: "Estimator bias — ia mengestimasi peluang di bawah proposal q, bukan di bawah target p", why: "Tepat: tanpa w(x) = p(x)/q(x), rata-rata sampelmu adalah ekspektasi di bawah q. Sampling terarah tanpa koreksi bukan variance reduction — itu jawaban salah yang terlihat presisi.", correct: true },
                { text: "Variansnya terlalu besar — tambah N saja", why: "Salah: masalahnya bias, bukan varians. N lebih besar hanya membuat jawaban salah itu makin presisi." },
                { text: "Proposalnya salah pilih — ganti proposal dan biasnya hilang sendiri", why: "Salah: proposal apa pun tetap butuh koreksi bobot; proposal yang baik hanya memperbaiki ESS, bukan menghilangkan keharusan koreksi." },
                { text: "Tidak ada yang salah — 0,49 adalah estimasi yang sah", why: "Salah: 0,49 adalah peluang di bawah N(2,5,1), bukan peluang target. Beda 80× lipat." },
              ],
            },
          ],
          reference: "Importance sampling WAJIB dikoreksi w(x) = p(x)/q(x) — tanpa itu estimator BIAS; laporkan ESS (di sini 29/5.000) sebagai harga proposal yang buruk.",
        },
        {
          id: "gap-r7-var-es-ketidakpastian",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P2-G2)",
          title: "VaR/ES simulasi: berapa lebar ketidakpastiannya?",
          prose: [
            "Lesson ini sudah menetapkan aturannya sendiri — 'estimasi tanpa SE adalah angka tanpa kejujuran' — tetapi lab langkah 3 hanya menghitung SE untuk rata-rata P&L (Rp2,8), bukan untuk VaR/ES yang justru dipakai mengambil keputusan. Lab ini menutupnya: dari P&L yang sama (seed 124, N = 5.000), VaR95 = Rp321,4 dengan SE bootstrap Rp6,6; ES95 = Rp407,7 dengan SE Rp6,8. Artinya interval 95% VaR-nya kira-kira (308, 334) — VaR 321 bukan angka pasti, melainkan titik tengah dari rentang selebar Rp26.",
            "Kenapa SE kuantil lebih besar dari SE rata-rata (6,6 vs 2,8)? Karena hanya ~250 observasi (5% dari 5.000) yang menginformasikan ekor — sisanya tidak berkata apa-apa tentang VaR95. Makin ekstrem kuantilnya (VaR99, ES99), makin sedikit observasi yang bekerja, makin lebar SE-nya. Praktik yang jujur: laporkan VaR/ES BESERTA SE-nya (dari bootstrap — resample P&L, hitung ulang VaR tiap resample, lihat sebarannya — atau teori statistik urutan), dan ingat SE ini hanya mengukur ketidakpastian SIMULASI, bukan ketidakpastian MODEL (distribusi yang salah tetap salah walau SE-nya kecil).",
          ],
          formula: String.raw`SE(\widehat{VaR}_{95\%}) \approx 6{,}6 \qquad SE(\widehat{ES}_{95\%}) \approx 6{,}8 \qquad SE(\bar{x}) \approx 2{,}8`,
          formulaNote: "P&L seed 124, N = 5.000 (lab langkah 3). Bootstrap B = 200, seed 7. VaR95 = 321,4 ± 1,96×6,6 → kira-kira (308, 334).",
          tasks: [
            { id: "t1", text: "Hitung `var95`, `es95`, dan `se_mean` dari P&L (seperti lab langkah 3)" },
            { id: "t2", text: "Bootstrap B=200 (seed 7): hitung `se_var95` dan `se_es95`" },
          ],
          expected: "var95=321.4 es95=407.7 se_mean=2.8 se_var95=6.6 se_es95=6.8",
          hints: [
            "Bootstrap: tiap ulangan, resample 5.000 P&L dengan penggantian, hitung ulang VaR95/ES95.",
            "SE bootstrap = simpangan baku dari 200 nilai VaR95 (dan ES95) hasil resample.",
          ],
          code: {
            starter: `import random, math, statistics as st\n\nrandom.seed(124)\nS0, mu, sigma, N = 10_000, 0.0005, 0.02, 5000\npl = [S0 * math.exp(random.gauss(mu, sigma)) - S0 for _ in range(N)]\npls = sorted(pl)\n\n# TULIS KODEMU: VaR95/ES95 + SE bootstrap (B=200, seed 7) vs SE rata-rata\nvar95 =\nes95 =\nse_mean =\nse_var95 =\nse_es95 =\n\nprint(f"var95={var95} es95={es95} se_mean={se_mean} se_var95={se_var95} se_es95={se_es95}")`,
            lockLines: 8,
            solution: `import random, math, statistics as st\n\nrandom.seed(124)\nS0, mu, sigma, N = 10_000, 0.0005, 0.02, 5000\npl = [S0 * math.exp(random.gauss(mu, sigma)) - S0 for _ in range(N)]\npls = sorted(pl)\n\n# TULIS KODEMU: VaR95/ES95 + SE bootstrap (B=200, seed 7) vs SE rata-rata\nvar95 = round(-pls[int(0.05 * N)], 1)\nes95 = round(-st.mean(pls[:int(0.05 * N)]), 1)\nse_mean = round(st.stdev(pl) / math.sqrt(N), 1)\nbrng = random.Random(7)\nbvar, bes = [], []\nfor _ in range(200):\n    s = sorted(brng.choice(pl) for _ in range(N))\n    bvar.append(-s[int(0.05 * N)])\n    bes.append(-st.mean(s[:int(0.05 * N)]))\nse_var95 = round(st.stdev(bvar), 1)\nse_es95 = round(st.stdev(bes), 1)\n\nprint(f"var95={var95} es95={es95} se_mean={se_mean} se_var95={se_var95} se_es95={se_es95}")`,
            checks: [
              { kind: "equal", task: "t1", name: "var95", value: 321.4, tol: 0.5, label: "`var95` = 321,4", msg: "Sama dengan lab langkah 3 (tol 60 di sana)." },
              { kind: "equal", task: "t1", name: "es95", value: 407.7, tol: 0.5, label: "`es95` = 407,7", msg: "Rata-rata kerugian saat tembus VaR." },
              { kind: "equal", task: "t1", name: "se_mean", value: 2.8, tol: 0.3, label: "`se_mean` = 2,8", msg: "SD/√N — kecil karena 5.000 observasi menginformasikan rata-rata." },
              { kind: "equal", task: "t2", name: "se_var95", value: 6.6, tol: 0.5, label: "`se_var95` = 6,6", msg: "Lebih dari 2× SE rata-rata — hanya ~250 observasi menginformasikan ekor." },
              { kind: "equal", task: "t2", name: "se_es95", value: 6.8, tol: 0.5, label: "`se_es95` = 6,8", msg: "ES punya ketidakpastian simulasi yang sama besarnya." },
              { kind: "stdout_matches", task: "t2", pattern: "var95=321\\.4\\s+es95=407\\.7\\s+se_mean=2\\.8\\s+se_var95=6\\.6\\s+se_es95=6\\.8", label: "`print` menampilkan kelimanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "VaR95 = Rp321, SE bootstrap Rp6,6. Apa artinya?",
              options: [
                { text: "VaR itu sendiri tidak pasti — interval 95%-nya kira-kira (308, 334); laporkan beserta SE-nya", why: "Tepat: SE 6,6 berarti VaR 321 adalah titik tengah rentang, bukan angka pasti.", correct: true },
                { text: "VaR-nya salah — angka yang benar 334", why: "Salah: 334 adalah ujung atas interval, bukan 'angka yang benar'. VaR 321 tetap estimasi titiknya." },
                { text: "SE 6,6 terlalu kecil untuk dipedulikan", why: "Salah: 6,6 adalah 2,4× SE rata-rata — dan untuk VaR99 angkanya lebih besar lagi." },
                { text: "SE ini mengukur apakah model distribusinya benar", why: "Salah: SE bootstrap hanya mengukur ketidakpastian SIMULASI. Model yang salah tetap salah walau SE-nya kecil." },
              ],
            },
          ],
          reference: "VaR/ES simulasi wajib membawa SE-nya (bootstrap): di sini SE VaR95 6,6 dan SE ES95 6,8 — lebih dari 2× SE rata-rata. SE mengukur simulasi, bukan kebenaran model.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B13.",
      ],
      tasks: [],
      summary: [
        "Prinsip: E[g(X)] \u2248 rata-rata g(Xi) \u2014 LLN yang dipekerjakan.",
        "Error: SE = \u03C3/\u221AN \u2014 lambat tapi pasti; tentukan N dari target error.",
        "Pola: tulis ekspektasi \u2192 sampel \u2192 rata-rata \u2192 SE. Untuk integral, VaR, opsi.",
        "Variance reduction: antithetic, control variate, importance sampling (selalu dengan koreksi likelihood-ratio) — menghemat path, bukan 'N gratis'.",
        "Jangan MC untuk yang ada rumus eksaknya; selalu set seed + laporkan SE; model harus jujur.",
      ],
      next: { label: "B13 \u2014 Model Vasicek", href: "/v2/learn/b13-vasicek" },
      quiz: [
        {
          q: "SE Monte Carlo = \u03C3/\u221AN. Untuk error 10x lebih kecil, N harus\u2026",
          options: [
            { text: "10x", why: "Salah: 10x N \u2192 error \u00F73,16x." },
            { text: "100x", why: "Benar: pajak akar kuadrat \u2014 100x komputasi untuk 10x presisi.", correct: true },
            { text: "1000x", why: "Salah: 1000x N \u2192 error \u00F731,6x." },
          ],
        },
        {
          q: "Untuk kejadian langka (ekor), teknik yang wajib\u2026",
          options: [
            { text: "Antithetic saja", why: "Salah: antithetic tidak menyelesaikan kelangkaan ekor." },
            { text: "Importance sampling", why: "Benar: MC polos hampir tak pernah menyentuh ekor \u2014 sampel harus difokuskan lalu dikoreksi.", correct: true },
            { text: "N kecil", why: "Salah: N kecil memperparah." },
          ],
        },
        {
          q: "Monte Carlo tanpa SE yang dilaporkan\u2026",
          options: [
            { text: "Tetap valid", why: "Salah: tanpa ukuran ketidakpastian, validitasnya tak bisa dinilai." },
            { text: "Setengah bohong \u2014 tidak tahu ketelitiannya", why: "Benar: kejujuran MC = ia tahu errornya sendiri.", correct: true },
            { text: "Lebih cepat", why: "Salah: kecepatan bukan soal pelaporan." },
          ],
        },
        {
          q: "N=40.000 mengestimasi peluang 0,12. SE-nya?",
          options: [
            { text: "\u22480,00163", why: "Benar: \u221A(0,12\u00D70,88/40000) \u2248 0,00163.", correct: true },
            { text: "0,12", why: "Salah: itu estimasinya, bukan SE-nya." },
            { text: "0,0001", why: "Salah: hitung ulang \u2014 terlalu kecil." },
          ],
        },
        {
          q: "Agar SE \u2264 0,001 untuk peluang 0,12, N minimal?",
          options: [
            { text: "105.600", why: "Benar: 0,12\u00D70,88/0,001\u00B2 = 105.600.", correct: true },
            { text: "40.000", why: "Salah: itu N untuk SE 0,00163." },
            { text: "10.000", why: "Salah: terlalu kecil." },
          ],
        },
      ],
    },
  ],
};

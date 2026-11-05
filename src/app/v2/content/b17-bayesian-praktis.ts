import type { V2Lesson } from "../lib/types";

export const b17: V2Lesson = {
  slug: "b17-bayesian-praktis",
  track: "Probabilitas",
  module: "Bayesian",
  title: "B17. Bayesian Praktis: Belajar dari Data, Bukan dari Nol",
  estMinutes: 55,
  steps: [
    {
      id: "cabang",
      eyebrow: "Langkah 1 · Aliran Bayesian",
      title: "Cabang baru dengan 10 nasabah",
      prose: [
        "Bank buka cabang baru. Bulan pertama: 10 nasabah, 3 gagal (30%!). Manajer panik: \u201CPD cabang ini 30% \u2014 tutup saja!\u201D Analis Bayesian tenang: \u201CBank kita punya 100.000 nasabah historis dengan PD 5%. Dengan 10 data baru, estimasi terbaik bukan 30%, melainkan 5,3%.\u201D",
        "Alirannya: posterior \u221D likelihood \u00D7 prior. Prior: pengetahuan sebelum data (historis bank: PD \u2248 5% \u2192 Beta(50,950)). Likelihood: data cabang (3 gagal dari 10). Posterior: pengetahuan setelah data \u2014 yang = prior untuk data berikutnya. Posterior hari ini = prior besok.",
        "Setahun kemudian (2.000 nasabah, 140 gagal = 7%): estimasi Bayesian 6,4% \u2014 akurat. 30% dari 10 data \u201Ckalah\u201D dari 5% dari 100.000 data: 10 data berisik memang seharusnya hampir tidak menggerakkan keyakinan. Kebijaksanaan statistik = tahu kapan harus tidak terkesan oleh data.",
      ],
      formula: String.raw`P(\theta \mid \text{data}) \propto P(\text{data} \mid \theta) \times P(\theta)`,
      formulaNote: "θ (theta) = parameter yang diestimasi (misal PD cabang baru); P(θ) = prior: keyakinan SEBELUM data — pengalaman 100.000 nasabah bank; P(data|θ) = likelihood: seberapa mungkin data teramati jika θ benar; P(θ|data) = posterior: keyakinan SETELAH data; ∝ = proporsional: penyebut P(data) konstanta terhadap θ sehingga diabaikan untuk mencari bentuknya. Contoh angka: 10 nasabah, 3 gagal (rate mentah 30%) + prior bank 5% dari 100.000 nasabah → posterior ≈ (5.000+3)/(100.000+10) ≈ 5,00% — angka ini artinya 10 data hampir tidak menggerakkan keyakinan yang dibangun 100.000 data; 30% mentah adalah noise sampel kecil, 5,00% adalah kejujuran. Panik atas 30% berarti memberi 10 data hak veto atas 100.000 data.",
      tasks: [
        { id: "t1", text: "Hitung `post1` = mean posterior setelah Beta(50,950) + 3 gagal/10" },
        { id: "t2", text: "Hitung `post2` = mean setelah +140 gagal/2000 lagi" },
        { id: "t3", text: "Cetak keduanya sebagai persen" },
      ],
      expected: "post1=5.25%  post2=6.4%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bayesian natural untuk sistem live: skor fraud diupdate per transaksi, PD diupdate per bulan \u2014 tidak perlu refit dari nol. Posterior hari ini = prior besok.",
      },
      hints: [
        "Beta(a,b) + s sukses/gagal \u2192 Beta(a+s, b+f).",
        "post1 = 53/1010; post2 = 193/3010.",
        "print(f\"post1={post1:.2%}  post2={post2:.1%}\")",
      ],
      code: {
        starter: `# Prior bank: Beta(50, 950). Data cabang: 3 gagal dari 10.\n# Setahun kemudian: +140 gagal dari 2000.\n\n# TULIS KODEMU: mean posterior dua tahap\npost1 = \npost2 = \n\nprint(f"post1={post1:.2%}  post2={post2:.1%}")`,
        lockLines: 3,
        solution: `# Prior bank: Beta(50, 950). Data cabang: 3 gagal dari 10.\n# Setahun kemudian: +140 gagal dari 2000.\n\n# TULIS KODEMU: mean posterior dua tahap\npost1 = (50+3) / (50+950+10)\npost2 = (50+3+140) / (50+950+10+2000)\n\nprint(f"post1={post1:.2%}  post2={post2:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "post1", value: 0.0525, tol: 0.001, label: "`post1` seharusnya \u2248 5,25%", msg: "53/1010 \u2248 0,0525." },
          { kind: "equal", task: "t2", name: "post2", value: 0.0641, tol: 0.002, label: "`post2` seharusnya \u2248 6,4%", msg: "193/3010 \u2248 0,0641 (Beta(193, 2817))." },
          { kind: "stdout_matches", task: "t3", pattern: "post1=5\\.25%\\s+post2=", label: "`print` menampilkan keduanya", msg: "Cetak dengan format post1=...  post2=... ." },
        ],
      },
      reference: "Posterior \u221D likelihood \u00D7 prior. Posterior hari ini = prior besok.",
    },
    {
      id: "konjugat",
      eyebrow: "Langkah 2 · Konjugat",
      title: "Bayesian tanpa integral",
      prose: [
        "Pasangan prior\u2013likelihood konjugat: posterior satu keluarga dengan prior \u2014 update = aritmetika! Binomial \u00D7 Beta(a,b) \u2192 Beta(a+s, b+f) (PD dari data default). Poisson \u00D7 Gamma(\u03B1,\u03B2) \u2192 Gamma(\u03B1+n, \u03B2+t) (\u03BB klaim per bulan). Normal(\u03C3\u00B2 diketahui) \u00D7 Normal \u2192 Normal presisi-tertimbang (mean return). Multinomial \u00D7 Dirichlet \u2192 Dirichlet (pangsa kategori).",
        "Contoh kasus 1: prior Beta(5,95) (mean 5%, bobot 100), data 3 gagal dari 10 \u2192 posterior Beta(8,102), mean = 8/110 \u2248 7,27% (naif: 30%; prior murni: 5%). 10 data menggeser 5% \u2192 7,27%, bukan \u2192 30%. Bobot prior (100) vs data (10) = 10:1.",
        "Kasus 2 (konjugat Normal): prior \u03BC ~ N(0,1), data n=16, x\u0304=0,5, \u03C3=2. Presisi prior=1, presisi data=n/\u03C3\u00B2=4. Posterior mean = (1\u00D70+4\u00D70,5)/5 = 0,4, SD=0,447. Presisi (1/varians) adalah mata uang Bayesian: yang lebih presisi, lebih didengar.",
      ],
      formula: String.raw`\hat{\mu}_{\text{post}} = \frac{\tau_0 \mu_0 + \tau_d \bar{x}}{\tau_0 + \tau_d} \qquad \tau = \text{presisi} = 1/\mathrm{Var}`,
      formulaNote: "μ_0 = mean prior (keyakinan awal); τ_0 = presisi prior = 1/Var: kepercayaan pada prior — makin besar, makin berat suaranya; x̄ = rata-rata data; τ_d = presisi data: kepercayaan pada data; μ̂_post = rata-rata TERTIMBANG presisi. τ = 1/Var: presisi adalah kebalikan varians — varians kecil berarti sangat yakin. Contoh angka: prior μ_0 = 5% @ τ_0 = 1.000 vs data x̄ = 30% dari 10 observasi @ τ_d = 10 → μ̂_post = (1.000×5% + 10×30%)/1.010 ≈ 5,25% — angka ini artinya prior 100 kali lebih presisi sehingga data 10 nyaris tak bersuara; posterior hanya bergeser 0,25 poin dari prior. Inilah Bayesian tanpa integral: update = aritmetika tertimbang kepercayaan.",
      tasks: [
        { id: "t1", text: "Hitung `post_mean` = mean posterior Beta(5,95) + 3 gagal/10" },
        { id: "t2", text: "Hitung `post_norm` = mean posterior Normal (kasus 2)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "post_mean=7.27%  post_norm=0.4",
      note: {
        title: "Sering salah",
        body: "\u201CPrior = subjektivitas = tidak ilmiah.\u201D Prior yang disembunyikan memang berbahaya \u2014 tapi prior eksplisit & didokumentasikan justru lebih ilmiah dari asumsi implisit. Metode \u201Cobjektif\u201D pun punya pilihan subjektif (model, \u03B1=5%, prior implisit uniform).",
      },
      hints: [
        "post_mean = 8/110.",
        "post_norm = (1*0 + 4*0.5)/(1+4).",
        "print(f\"post_mean={post_mean:.2%}  post_norm={post_norm}\")",
      ],
      code: {
        starter: `# Kasus 1: prior Beta(5,95), data 3 gagal dari 10\n# Kasus 2: prior N(0,1), data n=16, xbar=0.5, sigma=2\n\n# TULIS KODEMU\npost_mean = \npost_norm = \n\nprint(f"post_mean={post_mean:.2%}  post_norm={post_norm}")`,
        lockLines: 3,
        solution: `# Kasus 1: prior Beta(5,95), data 3 gagal dari 10\n# Kasus 2: prior N(0,1), data n=16, xbar=0.5, sigma=2\n\n# TULIS KODEMU\npost_mean = (5+3) / (5+95+10)\npost_norm = (1*0 + 4*0.5) / (1+4)\n\nprint(f"post_mean={post_mean:.2%}  post_norm={post_norm}")`,
        checks: [
          { kind: "equal", task: "t1", name: "post_mean", value: 0.0727, tol: 0.001, label: "`post_mean` seharusnya \u2248 7,27%", msg: "8/110 \u2248 0,0727." },
          { kind: "equal", task: "t2", name: "post_norm", value: 0.4, tol: 0.001, label: "`post_norm` seharusnya 0,4", msg: "(1\u00D70+4\u00D70,5)/5 = 0,4." },
          { kind: "stdout_matches", task: "t3", pattern: "post_mean=7\\.27%\\s+post_norm=0\\.4", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Update = aritmetika. Presisi = mata uang Bayesian.",
    },
    {
      id: "shrinkage",
      eyebrow: "Langkah 3 · Shrinkage",
      title: "Kebijaksanaan data kecil",
      prose: [
        "Estimasi Bayesian = rata-rata tertimbang prior dan data: \u03B8\u0302_Bayes \u2248 w\u00B7x\u0304_data + (1\u2212w)\u00B7\u03BC_prior, dengan w = n/(n+n_0) dan n_0 = \u201Ckekuatan\u201D prior (observasi ekuivalen). n kecil \u2192 w kecil \u2192 ikut prior. Inilah James-Stein/empirical Bayes: \u201Cpinjam kekuatan\u201D dari populasi.",
        "Jika ada yang melapor \u201CPD segmen ini 30%\u201D dari n=10 \u2014 tanya: berapa n-nya, dan apa prior-nya? Dua pertanyaan ini membunuh 90% klaim dramatis dari data kecil. Shrinkage adalah \u201Crem\u201D terhadap overreaksi. Kapan kritis: segmen kecil, rare event, A/B testing awal, model hierarkis.",
        "Hati-hati sisi lain: jika data besar & konsisten berkata lain (1.000 trial, 300 gagal vs prior mean 5%), prior kuat memperlambat adaptasi. Solusi: prior lebih lemah (vague) atau prior predictive check \u2014 prior-data conflict harus dideteksi, bukan ditelan.",
      ],
      formula: String.raw`\hat{\theta}_{\text{Bayes}} \approx w\cdot \bar{x}_{\text{data}} + (1-w)\cdot \mu_{\text{prior}} \qquad w = \frac{n}{n + n_0}`,
      formulaNote: "θ̂_Bayes = estimasi Bayesian; x̄_data = rata-rata mentah dari data; μ_prior = nilai prior (pengalaman populasi); w = n/(n+n_0) = bobot data: fraksi kepercayaan pada data; n = ukuran data; n_0 = ukuran sampel semu prior: seberapa kuat prior dinyatakan dalam satuan observasi. Contoh angka: n = 10, n_0 = 1.000 → w = 10/1.010 ≈ 0,01 — angka ini artinya estimasi = 1% data + 99% prior: cabang baru mendapat PD bank sampai ia membuktikan dirinya sendiri dengan data; butuh n = 1.000 agar bobotnya 50:50. Shrinkage menarik estimasi ekstrem dari sampel kecil kembali ke akal sehat populasi — proporsional dengan kelemahan datanya.",
      tasks: [
        { id: "t1", text: "Hitung bobot data `w` untuk n = 10, 50, 200, 1000 (n\u2080=1000)" },
        { id: "t2", text: "Cetak tiap n dan w-nya" },
      ],
      expected: "w\u22481%, 4.8%, 16.7%, 50%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Latihan mandiri: produk baru 0 gagal dari 20 (naif: PD 0%!). Bayesian dengan prior Beta(5,95): posterior Beta(5,115), mean \u2248 4,2%. 0% dari 20 data bukan bukti risiko nol \u2014 hanya belum terlihat (Cromwell\u2019s rule).",
      },
      hints: [
        "w = n/(n+1000).",
        "Loop untuk tiap n, print(f\"n={n:>5}: w={w:.1%}\").",
        "n=10 \u2192 w\u22481%.",
      ],
      code: {
        starter: `n0 = 1000  # kekuatan prior (observasi ekuivalen)\n\n# TULIS KODEMU: bobot data w untuk tiap n\nfor n in [10, 50, 200, 1000]:\n    w = \n    print(f"n={n:>5}: w={w:.1%}")`,
        lockLines: 1,
        solution: `n0 = 1000  # kekuatan prior (observasi ekuivalen)\n\n# TULIS KODEMU: bobot data w untuk tiap n\nfor n in [10, 50, 200, 1000]:\n    w = n / (n + n0)\n    print(f"n={n:>5}: w={w:.1%}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "n=\\s*10: w=1\\.0%", label: "w untuk n=10 \u2248 1,0%", msg: "w = n/(n+1000)." },
          { kind: "stdout_matches", task: "t2", pattern: "n=\\s*1000: w=50\\.0%", label: "w untuk n=1000 \u2248 50,0%", msg: "w = n/(n+1000)." },
        ],
      },
      reference: "n kecil \u2192 ikut prior. Skeptis saat bukti lemah, ikut saat bukti kuat.",
    },
    {
      id: "credible",
      eyebrow: "Langkah 4 · Credible vs confidence",
      title: "Beda filsafat, beda kalimat",
      prose: [
        "Bayesian (credible interval): P(\u03B8 di interval | data) = 95% \u2014 yang ingin diketahui! Frekuentis (confidence interval): \u201Cjika diulang, 95% interval menutupi \u03B8\u201D \u2014 pernyataan tentang prosedur, bukan parameter. Posterior PD ~ Beta(8,102) memberi credible 95%: (2,9%; 12,3%).",
        "Untuk keputusan (\u201Cberapa peluang PD > 10%?\u201D), yang pertama langsung menjawab: P(PD > 10% | data) dari Beta(8,102) \u2248 12%. Yang kedua tidak bisa menjawab tanpa contortion. Credible interval menjawab pertanyaan yang sebenarnya ditanya pengambil keputusan.",
        "Kapan Bayesian menang: data kecil, butuh interpretasi probabilistik langsung, model hierarkis, update sekuensial, menggabung expert judgment. Kapan frekuentis cukup: data besar (keduanya konvergen! \u2014 Bernstein\u2013von Mises), butuh cepat & standar, regulasi meminta. Pilih berdasarkan masalah, bukan ideologi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CBayesian selalu lebih baik.\u201D Dengan data besar, prior tenggelam \u2014 hasil Bayesian \u2248 MLE frekuentis. Bayesian membayar harga komputasi & debat prior; jika data melimpah dan pertanyaan standar, frekuentis lebih murah.",
      },
      quiz: [
        {
          q: "Keunggulan unik Bayesian vs frekuentis\u2026",
          options: [
            { text: "Selalu lebih cepat", why: "Salah: justru biasanya lebih mahal (MCMC)." },
            { text: "Bisa menyatakan P(parameter > ambang | data)", why: "Benar: parameter sebagai variabel acak \u2192 probabilitas langsung tentang \u03B8.", correct: true },
            { text: "Tidak butuh data", why: "Salah: tetap butuh \u2014 prior bukan pengganti data." },
          ],
        },
        {
          q: "Dengan data sangat besar, Bayesian vs frekuentis\u2026",
          options: [
            { text: "Selalu beda jauh", why: "Salah: prior tenggelam." },
            { text: "Konvergen \u2014 pilih yang murah", why: "Benar: Bernstein\u2013von Mises. Jangan bayar harga Bayesian jika data melimpah.", correct: true },
            { text: "Frekuentis tidak bisa dipakai", why: "Salah: frekuentis justru standar di sini." },
          ],
        },
      ],
      reference: "Credible = bahasa keputusan. Pilih metode berdasarkan masalah.",
    },
    {
      id: "lab-pd10",
      eyebrow: "Langkah 5 · Lab",
      title: "\u201CPeluang PD > 10%?\u201D \u2014 pertanyaan Bayesian",
      prose: [
        "Dari posterior Beta(53,957) (cerita cabang baru), hitung P(PD > 10%) via simulasi \u2014 pertanyaan yang TAK bisa dijawab frekuentis langsung. Sampel Beta via dua Gamma: X/(X+Y) dengan X~Gamma(a,1), Y~Gamma(b,1).",
        "\u201CP(PD > 10%) = 0,03%\u201D \u2192 keputusan langsung: cabang AMAN. Frekuentis tidak bisa mengucapkan kalimat itu (\u03B8 bukan acak bagi mereka). (N=5000 cukup untuk browser.)",
      ],
      tasks: [
        { id: "t1", text: "Sampel `N=5000` dari Beta(53, 957) via dua Gamma" },
        { id: "t2", text: "Hitung `p10` = P(PD>10%) dan `p7` = P(PD>7%)" },
        { id: "t3", text: "Cetak keduanya sebagai persen" },
      ],
      expected: "p10\u22480.03%  p7\u224814%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "P(\u03B8 > ambang | data) adalah bahasa limit setting dan risk appetite. Tanpa posterior, keputusan memakai titik estimasi yang menyembunyikan ketidakpastian.",
      },
      hints: [
        "s = gammavariate(a,1)/(gammavariate(a,1)+gammavariate(b,1)).",
        "p10 = mean(s > 0.10).",
        "Seed 172 untuk reproduksibilitas.",
      ],
      code: {
        starter: `import random\nrandom.seed(172)\na, b, N = 53, 957, 5000\n\n# TULIS KODEMU: sampel Beta lalu P(PD>10%) dan P(PD>7%)\nsamp = [random.gammavariate(a,1)/(random.gammavariate(a,1)+random.gammavariate(b,1)) for _ in range(N)]\np10 = \np7 = \n\nprint(f"p10={p10:.2%}  p7={p7:.2%}")`,
        lockLines: 3,
        solution: `import random\nrandom.seed(172)\na, b, N = 53, 957, 5000\n\n# TULIS KODEMU: sampel Beta lalu P(PD>10%) dan P(PD>7%)\nsamp = [random.gammavariate(a,1)/(random.gammavariate(a,1)+random.gammavariate(b,1)) for _ in range(N)]\np10 = sum(1 for s in samp if s > 0.10) / N\np7 = sum(1 for s in samp if s > 0.07) / N\n\nprint(f"p10={p10:.2%}  p7={p7:.2%}")`,
        checks: [
          { kind: "equal", task: "t2", name: "p10", value: 0.0003, tol: 0.0015, label: "`p10` mendekati 0,03%", msg: "Ekor jauh Beta(53,957) \u2014 harus sangat kecil." },
          { kind: "equal", task: "t2", name: "p7", value: 0.14, tol: 0.03, label: "`p7` mendekati ~14%", msg: "Mean posterior 5,25% < 7% \u2014 p7 harus belasan persen." },
          { kind: "stdout_matches", task: "t3", pattern: "p10=\\d+\\.\\d\\d%\\s+p7=", label: "`print` menampilkan keduanya", msg: "Cetak dengan format p10=...  p7=... ." },
        ],
      },
      reference: "Probabilitas tentang parameter \u2014 bahasa keputusan.",
    },
    {
      id: "minicase-ab",
      eyebrow: "Langkah 6 · Mini-case",
      title: "A/B testing yang dihentikan terlalu cepat",
      prose: [
        "Tim produk: setelah 200 pengunjung (100/varian), konversi A=8%, B=14%. \u201CB menang! Hentikan test, rollout!\u201D Apa kata analisis Bayesian (prior Beta(20,180) \u2248 10% historis)? Posterior A: Beta(28,272) \u2192 mean 9,3%. Posterior B: Beta(34,266) \u2192 mean 11,3%.",
        "P(B > A | data) via simulasi \u2248 78% \u2014 jauh dari \u201Cpasti\u201D! Interval kredibel keduanya tumpang tindih lebar. Jangan rollout: 78% bukan keyakinan cukup untuk keputusan mahal (butuh ~95%+ atau expected loss analysis).",
        "Yang benar: lanjutkan test sampai P(B>A) > 95% atau hitung expected value of information. Frekuentis dengan n=200 pun akan bilang \u201Cbelum signifikan\u201D \u2014 tapi Bayesian memberi angka yang bisa ditindaklanjuti (78%) + bahasa yang dipahami bisnis (\u201Cpeluang B lebih baik\u201D). Ini Bayesian A/B testing \u2014 standar di tech company modern.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CPrior Beta(20,180) subjektif \u2014 pakai uniform saja.\u201D Prior historis 10% adalah informasi nyata (bukan opini); mengabaikannya = membuang data lama. Yang wajib: eksplisit & uji sensitivitas.",
      },
      quiz: [
        {
          q: "Posterior A/B: P(B>A|data) \u2248 78%. Keputusan?",
          options: [
            { text: "Rollout \u2014 B menang", why: "Salah: 78% jauh dari kepastian untuk keputusan mahal." },
            { text: "Lanjut test sampai >95% atau hitung expected value of information", why: "Benar: 78% = sinyal lemah, bukan keputusan.", correct: true },
            { text: "Buang data, ulangi dari nol", why: "Salah: Bayesian justru mengakumulasi, bukan membuang." },
          ],
        },
        {
          q: "Keunggulan Bayesian di A/B testing ini?",
          options: [
            { text: "Tidak butuh prior", why: "Salah: prior justru dipakai (Beta(20,180))." },
            { text: "Angka P(B>A) yang bisa ditindaklanjuti + bahasa bisnis", why: "Benar: 78% langsung diterjemahkan ke keputusan lanjut/berhenti.", correct: true },
            { text: "Selalu lebih cepat signifikan", why: "Salah: tidak ada jaminan kecepatan." },
          ],
        },
      ],
      reference: "78% \u2260 pasti. Lanjut sampai 95% atau hitung EVI.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi \u2014 ini penutup Track Probabilitas sebelum C1.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: data kecil harus meminjam kekuatan — itulah shrinkage",
        body: "Cabang baru dengan 3 gagal dari 10 nasabah terlihat seperti PD 30% — tetapi analis Bayesian tidak panik, karena 10 data tidak berhak mengalahkan 100.000 data bank. Bobot w = n/(n+n₀) mengkuantifikasi kerendahan hati ini: dengan n = 10 dan kekuatan prior n₀ = 1000, data hanya mendapat bobot 1%, dan estimasi 99% adalah prior. Inilah shrinkage — estimasi ditarik ke arah pengalaman populasi, proporsional dengan kelemahan data. Praktisi memakainya di mana-mana: PD cabang baru, conversion rate halaman yang baru launching, default rate vintage muda. Aturan keputusannya: selalu laporkan estimasi Bayesian berdampingan dengan rate mentah saat n kecil — selisihnya adalah ukuran ketidakpastianmu. Dan pakai credible interval untuk menjawab pertanyaan yang sebenarnya ditanya: bukan berapa PD-nya, melainkan berapa peluang PD melebihi 10%? Jebakan yang halus: prior yang diklaim tidak informatif. Tidak ada prior yang benar-benar netral — prior datar di satu parameterisasi bisa sangat informatif di parameterisasi lain. Uji sensitivitas: ubah priornya, lihat apakah keputusannya ikut berubah. Jika ya, kejujuranmu ada di prior, bukan di data.",
      },
      summary: [
        "Aliran: posterior \u221D likelihood \u00D7 prior; posterior hari ini = prior besok.",
        "Konjugat: Beta-Binomial, Gamma-Poisson \u2014 update = aritmetika.",
        "Shrinkage: w = n/(n+n\u2080) \u2014 skeptis saat bukti lemah, ikut saat bukti kuat.",
        "Credible interval: P(\u03B8 di interval | data) \u2014 bahasa keputusan.",
        "Data kecil/hierarkis/live \u2192 Bayesian; data besar/standar \u2192 frekuentis cukup.",
      ],
      next: { label: "C1 \u2014 SELECT Dasar", href: "/learn/c1-select-dasar" },
      quiz: [
        {
          q: "Posterior Beta setelah prior Beta(50,950) + 3 gagal dari 10\u2026",
          options: [
            { text: "Beta(53, 957)", why: "Benar: tambah gagal ke b. Mean 5,25% \u2014 shrinkage dari 30% mentah.", correct: true },
            { text: "Beta(3, 7)", why: "Salah: itu prior diabaikan total." },
            { text: "Beta(53, 960)", why: "Salah: 950+7=957, bukan 960." },
          ],
        },
        {
          q: "Shrinkage berarti\u2026",
          options: [
            { text: "Data selalu diabaikan", why: "Salah: data menang saat n besar." },
            { text: "Estimasi ditarik ke prior saat data sedikit; data menang saat banyak", why: "Benar: w = n/(n+n\u2080) \u2014 timbangan otomatis.", correct: true },
            { text: "Prior selalu menang", why: "Salah: hanya saat data lemah." },
          ],
        },
        {
          q: "Dengan data sangat besar, Bayesian vs frekuentis\u2026",
          options: [
            { text: "Selalu beda jauh", why: "Salah: prior tenggelam." },
            { text: "Konvergen \u2014 pilih yang murah", why: "Benar: Bernstein\u2013von Mises.", correct: true },
            { text: "Bayesian selalu menang", why: "Salah: tidak ada ideologi di sini." },
          ],
        },
        {
          q: "Kritik \u201Cprior subjektif\u201D dijawab dengan\u2026",
          options: [
            { text: "Prior disembunyikan", why: "Salah: itu yang berbahaya." },
            { text: "Prior eksplisit, didokumentasikan, diuji sensitivitasnya", why: "Benar: transparansi > ilusi objektivitas.", correct: true },
            { text: "Prior selalu uniform", why: "Salah: uniform juga pilihan (dan sering buruk)." },
          ],
        },
        {
          q: "Latihan: prior Beta(2,18), data 50 trial 2 sukses. Posterior?",
          options: [
            { text: "Beta(4, 66), mean \u2248 5,7%", why: "Benar: data (4%) menarik prior (10%) ke bawah, tapi tidak sampai 4%.", correct: true },
            { text: "Beta(2, 48), mean 4%", why: "Salah: itu data mentah \u2014 prior diabaikan." },
            { text: "Beta(4, 68), mean 5,6%", why: "Salah: b = 18+48 = 66, bukan 68." },
          ],
        },
      ],
    },
  ],
};

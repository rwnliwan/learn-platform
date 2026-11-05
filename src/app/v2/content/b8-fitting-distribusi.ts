import type { V2Lesson } from "../lib/types";

export const b8: V2Lesson = {
  slug: "b8-fitting-distribusi",
  track: "Probabilitas",
  module: "Distribusi",
  title: "B8. Fitting Distribusi: Distribusi Mana yang Jujur?",
  estMinutes: 55,
  steps: [
    {
      id: "mle",
      eyebrow: "Langkah 1 · MLE",
      title: "Model \u201Csempurna\u201D yang gagal di ekor",
      prose: [
        "Tim risiko mem-fit Normal ke data kerugian operasional. QQ-plot tengahnya sempurna, uji chi-square p-value 0,4 \u2014 \u201Clolos\u201D, model disetujui. Setahun kemudian kerugian Rp50 miliar datang \u2014 model Normal bilang peluangnya 1 banding 10 juta tahun. Modelnya lolos uji tapi buta di ekor: uji goodness-of-fit standar didominasi badan distribusi, bukan ekor tempat risiko terbesar.",
        "MLE (maximum likelihood) menjawab: \u201Cparameter apa yang membuat data yang kita lihat menjadi paling tidak mengejutkan?\u201D Likelihood L(\u03B8) = peluang data teramati jika parameter = \u03B8; MLE = \u03B8 yang memaksimalkannya (dipakai log karena jumlah lebih mudah dari kali).",
        "Contoh: koin 100x, 60 angka \u2192 L(p) = p^60(1\u2212p)^40 \u2014 dimaksimalkan di p\u0302 = 60/100 = 0,6. Untuk Binomial, MLE = proporsi sampel. Tapi ingat: MLE menjawab \u201Cparameter terbaik untuk distribusi yang sudah kupilih\u201D \u2014 ia TIDAK menjawab \u201Cdistribusi mana yang benar\u201D.",
      ],
      formula: String.raw`\hat{\theta}_{MLE} = \arg\max_{\theta}\; L(\theta) = \arg\max_{\theta}\; \sum_{i=1}^{n} \log f(x_i;\theta)`,
      formulaNote: "θ (theta) = parameter yang dicari (misal μ, σ); L(θ) = likelihood: peluang data yang teramati JIKA θ benar — dibaca sebagai fungsi dari θ, bukan dari data; log mengubah perkalian n peluang menjadi penjumlahan; Σ log f(x_i;θ) = total log-peluang; argmax = nilai θ yang memaksimalkan, bukan nilai maksimumnya. θ̂_MLE adalah tebakan yang membuat data terlihat paling mungkin. Contoh maknanya: MLE menimbang tiap observasi sama — 990 data tengah mengalahkan 10 data ekor, sehingga parameter yang menang adalah yang paling cocok di tengah. Angka ini artinya model lolos uji kecocokan tetapi ekornya salah: bukan karena MLE-nya rusak, melainkan karena yang dioptimalkan adalah kecocokan rata-rata, bukan kecocokan di tempat risiko tinggal.",
      tasks: [
        { id: "t1", text: "Cari `p_mle` = p yang memaksimalkan log-likelihood (grid 0,05..0,95)" },
        { id: "t2", text: "Cetak `p_mle` dengan 2 desimal" },
      ],
      expected: "p_mle=0.65",
      note: {
        title: "Sering salah",
        body: "\u201CMLE selalu memberikan jawaban terbaik.\u201D Optimal asimtotik (n\u2192\u221E) jika keluarga distribusi benar. Untuk n kecil atau keluarga salah, MLE sensitif outlier: satu titik ekstrem menggeser \u03BC\u0302 dan menggelembungkan \u03C3\u0302.",
      },
      hints: [
        "ll = 63*log(p) + 37*log(1-p) untuk data 63/100.",
        "Loop p dari 5..95, p = p100/100; simpan yang ll terbesar.",
        "print(f\"p_mle={p_mle:.2f}\")",
      ],
      code: {
        starter: `import math\nn, sukses = 100, 63\n\n# TULIS KODEMU: grid search MLE untuk p\np_mle, ll_terbaik = 0, -1e18\nfor p100 in range(5, 96, 5):\n    p = p100 / 100\n    ll = \n    if ll > ll_terbaik:\n        p_mle, ll_terbaik = p, ll\n\nprint(f"p_mle={p_mle:.2f}")`,
        lockLines: 1,
        solution: `import math\nn, sukses = 100, 63\n\n# TULIS KODEMU: grid search MLE untuk p\np_mle, ll_terbaik = 0, -1e18\nfor p100 in range(5, 96, 5):\n    p = p100 / 100\n    ll = sukses*math.log(p) + (n-sukses)*math.log(1-p)\n    if ll > ll_terbaik:\n        p_mle, ll_terbaik = p, ll\n\nprint(f"p_mle={p_mle:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_mle", value: 0.65, tol: 0.001, label: "`p_mle` seharusnya 0,65", msg: "Grid 0,05 langkah: maksimum di 0,65 (dekat 63/100 = 0,63)." },
          { kind: "stdout_matches", task: "t2", pattern: "p_mle=0\\.65", label: "`print` menampilkan p_mle", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "MLE = parameter yang membuat data paling tidak mengejutkan.",
    },
    {
      id: "qqplot",
      eyebrow: "Langkah 2 · QQ-plot",
      title: "Diagnosis visual 10 detik \u2014 baca dari ujung",
      prose: [
        "QQ-plot: plot kuantil data vs kuantil teoretis distribusi kandidat. Cocok \u2192 titik-titik di garis diagonal. Lengkung ke atas di kanan \u2192 ekor kanan data lebih tebal dari model (bahaya! model meremehkan ekstrem). Lengkung ke bawah di kanan \u2192 ekor lebih tipis. Bentuk S \u2192 skew tidak tertangkap.",
        "QQ-plot adalah \u201Ctes kejujuran\u201D distribusi \u2014 ia memaksa model menunjukkan di mana ia berbohong, terutama di ekor (titik-titik ujung). Baca dari ujung-ujungnya, bukan tengahnya: tengah hampir selalu cocok \u2014 risiko tinggal di ujung.",
        "Aturan: jika 5 titik teratas melengkung menjauh garis, modelmu buta ekor. Contoh data kerugian (Rp M): 1, 2, 2, 3, 5, 8, 13, 25, 60 \u2014 QQ vs Normal: tengah menempel, 2 titik kanan melengkung ke atas \u2192 ekor kanan lebih tebal dari Normal \u2192 tolak Normal untuk risiko.",
      ],
      tasks: [
        { id: "t1", text: "Buat data campuran (95% Normal + 5% ekstrem), n=2000" },
        { id: "t2", text: "Hitung `n_melengkung` = titik 10 teratas yang |data| > |teoretis|+0,8" },
        { id: "t3", text: "Cetak `n_melengkung`" },
      ],
      expected: "n_melengkung>=1 (ekor melengkung terdeteksi)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "\u201CMelengkung ke atas di kanan\u201D = satu frasa yang menyelamatkan Rp50 miliar (cerita pembuka). Untuk risiko, urutan diagnosis: 1. ekor, 2. badan, 3. tengah \u2014 kebanyakan tutorial mengajarkan urutan terbalik.",
      },
      hints: [
        "data terurut; kuantil teoretis via norm_ppf (disediakan).",
        "Bandingkan 10 titik teratas: abs(data[i]) > abs(t)+0.8.",
        "print(f\"n_melengkung={n_melengkung}\")",
      ],
      code: {
        starter: `import random, math\nrandom.seed(82)\ndata = [random.gauss(0,1) if random.random() < 0.95 else random.choice([-1,1])*random.uniform(3,6) for _ in range(2000)]\ndata.sort()\nn = len(data)\n\ndef norm_ppf(p):\n    a = [-39.696830286, 220.683265068, -275.928510446, 138.357751867, -30.664798066, 2.506628277]\n    b = [-54.476098798, 161.585836858, -155.698979859, 66.801311887, -13.280681552]\n    c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]\n    d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]\n    pl, pu = 0.02425, 1 - 0.02425\n    if pl < p < pu:\n        q = p - 0.5; r = q*q\n        return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)\n    q = math.sqrt(-2*math.log(min(p, 1-p)))\n    x = (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)\n    return -x if p < 0.5 else x\n\n# TULIS KODEMU: hitung titik teratas yang melengkung\nn_melengkung = 0\nfor i in range(n-10, n):\n    t = norm_ppf((i+0.5)/n)\n    if :\n        n_melengkung += 1\n\nprint(f"n_melengkung={n_melengkung}")`,
        lockLines: 19,
        solution: `import random, math\nrandom.seed(82)\ndata = [random.gauss(0,1) if random.random() < 0.95 else random.choice([-1,1])*random.uniform(3,6) for _ in range(2000)]\ndata.sort()\nn = len(data)\n\ndef norm_ppf(p):\n    a = [-39.696830286, 220.683265068, -275.928510446, 138.357751867, -30.664798066, 2.506628277]\n    b = [-54.476098798, 161.585836858, -155.698979859, 66.801311887, -13.280681552]\n    c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]\n    d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]\n    pl, pu = 0.02425, 1 - 0.02425\n    if pl < p < pu:\n        q = p - 0.5; r = q*q\n        return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)\n    q = math.sqrt(-2*math.log(min(p, 1-p)))\n    x = (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)\n    return -x if p < 0.5 else x\n\n# TULIS KODEMU: hitung titik teratas yang melengkung\nn_melengkung = 0\nfor i in range(n-10, n):\n    t = norm_ppf((i+0.5)/n)\n    if abs(data[i]) > abs(t) + 0.8:\n        n_melengkung += 1\n\nprint(f"n_melengkung={n_melengkung}")`,
        checks: [
          { kind: "defined", task: "t2", name: "n_melengkung", label: "`n_melengkung` terdefinisi", msg: "Hitung titik 10 teratas yang melengkung." },
          { kind: "stdout_matches", task: "t3", pattern: "n_melengkung=\\d+", label: "`print` menampilkan n_melengkung", msg: "Cetak dengan format n_melengkung=... ." },
        ],
      },
      reference: "QQ-plot dibaca dari ujung. Lengkung ke atas di kanan = ekor tebal.",
    },
    {
      id: "uji-aic",
      eyebrow: "Langkah 3 · Uji & AIC",
      title: "Anderson-Darling untuk ekor, AIC untuk banding model",
      prose: [
        "Uji goodness-of-fit: Kolmogorov-Smirnov (jarak maksimum cdf empiris vs teoretis) \u2014 umum tapi kurang peka di ekor. Anderson-Darling: seperti KS tapi memberi bobot lebih ke ekor \u2014 pilihan tepat untuk risiko! Chi-square: bandingkan frekuensi per bin, sensitif pada pilihan bin.",
        "Banding model: AIC = 2k \u2212 2logL\u0302, BIC = k\u00B7log n \u2212 2logL\u0302. k = jumlah parameter \u2014 penalti kompleksitas (Occam's razor terkuantifikasi). Pilih yang terkecil; BIC menghukum lebih keras untuk n besar.",
        "Contoh: data kerugian n=200. Normal: logL=\u2212520 (k=2) \u2192 AIC = 1040+4 = 1044. Lognormal: logL=\u2212490 \u2192 AIC = 980+4 = 984. Selisih \u0394=60 \u2014 sangat besar (\u0394>10 = bukti decisive). Pilih lognormal.",
      ],
      formula: String.raw`AIC = 2k - 2\log\hat{L}, \qquad BIC = k\log n - 2\log\hat{L}`,
      formulaNote: "k = banyak parameter model — penalti kompleksitas; L̂ (L topi) = likelihood maksimum yang dicapai model; n = ukuran sampel; log L̂ = seberapa cocok model (makin besar makin cocok). AIC = 2k − 2logL̂: tiap parameter harus membayar 2 poin. BIC = k·log n − 2logL̂: hukumannya tumbuh dengan log n — makin besar data, makin mahal parameter. Contoh maknanya: model A (k=2, logL̂=−100) → AIC = 204; model B (k=5, logL̂=−97) → AIC = 204 — angka ini artinya kecocokan B yang lebih baik (+3 log-likelihood) tepat dihabiskan oleh 3 parameter tambahannya; AIC seri, pilih yang sederhana. BIC dengan n = 1.000 menghukum B lebih keras (5×6,9 vs 2×6,9). AIC/BIC hanya untuk MEMBANDINGKAN — angkanya sendiri tanpa pembanding tidak berarti apa-apa.",
      tasks: [
        { id: "t1", text: "Hitung `aic_normal` dan `aic_lognormal`" },
        { id: "t2", text: "Hitung `delta` = selisihnya, cetak ketiganya" },
      ],
      expected: "aic_normal=1044  aic_lognormal=984  delta=60",
      note: {
        title: "Sering salah",
        body: "\u201Cp-value > 0,05 berarti distribusi benar.\u201D Tidak! \u201CGagal menolak\u201D \u2260 \u201Cterbukti benar\u201D. Dengan n kecil, uji tidak punya power \u2014 distribusi salah pun lolos. Uji adalah saringan, bukan sertifikat.",
      },
      hints: [
        "AIC = 2*k - 2*logL.",
        "Normal: 2*2 - 2*(-520) = 1044.",
        "print(f\"aic_normal={aic_normal}  aic_lognormal={aic_lognormal}  delta={delta}\")",
      ],
      code: {
        starter: `# log-likelihood hasil MLE: Normal vs Lognormal, n=200, k=2\nll_normal, ll_logn = -520, -490\nk = 2\n\n# TULIS KODEMU: AIC keduanya dan selisihnya\naic_normal = \naic_lognormal = \ndelta = \n\nprint(f"aic_normal={aic_normal}  aic_lognormal={aic_lognormal}  delta={delta}")`,
        lockLines: 2,
        solution: `# log-likelihood hasil MLE: Normal vs Lognormal, n=200, k=2\nll_normal, ll_logn = -520, -490\nk = 2\n\n# TULIS KODEMU: AIC keduanya dan selisihnya\naic_normal = 2*k - 2*ll_normal\naic_lognormal = 2*k - 2*ll_logn\ndelta = aic_normal - aic_lognormal\n\nprint(f"aic_normal={aic_normal}  aic_lognormal={aic_lognormal}  delta={delta}")`,
        checks: [
          { kind: "equal", task: "t1", name: "aic_normal", value: 1044, tol: 1e-9, label: "`aic_normal` seharusnya 1044", msg: "2\u00D72 \u2212 2\u00D7(\u2212520) = 1044." },
          { kind: "equal", task: "t1", name: "aic_lognormal", value: 984, tol: 1e-9, label: "`aic_lognormal` seharusnya 984", msg: "2\u00D72 \u2212 2\u00D7(\u2212490) = 984." },
          { kind: "equal", task: "t2", name: "delta", value: 60, tol: 1e-9, label: "`delta` seharusnya 60", msg: "1044 \u2212 984 = 60 \u2014 decisive." },
          { kind: "stdout_matches", task: "t2", pattern: "aic_normal=1044\\s+aic_lognormal=984\\s+delta=60", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "AD > KS untuk risiko. AIC terkecil menang; \u0394>10 = decisive.",
    },
    {
      id: "minicase-operasional",
      eyebrow: "Langkah 4 · Mini-case",
      title: "Memilih model kerugian operasional",
      prose: [
        "Data 500 kerugian operasional (Rp juta): mean 120, median 45, maks 8.500. Tiga kandidat ter-fit: Lognormal (AIC 5.210, AD p-value 0,08), Pareto (AIC 5.195, AD p-value 0,15), Campuran body Lognormal + ekor Pareto (AIC 5.180, AD p-value 0,35). Model mana untuk perhitungan modal (ekor 99,9%)?",
        "Jawabannya campuran. AIC memang terkecil, tapi alasan utamanya struktural: mekanisme badan \u2260 mekanisme ekor. Kerugian rutin (proses) vs kerugian bencana (fraud besar/sistem) adalah dua fenomena \u2014 satu distribusi dipaksa menjelaskan keduanya akan kompromi di tempat yang salah.",
        "Mengapa bukan \u201CAIC terkecil, selesai\u201D? Karena AIC rata-rata seluruh data \u2014 untuk kuantil 99,9%, yang relevan adalah fit di ekor (AD + QQ ujung + exceedance backtest). Praktik industri: body + ekor terpisah (B16/EVT). Kriteria statistik + pengetahuan mekanisme > satu angka.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Modal dihitung dari kuantil 99,9% \u2014 ekor, bukan badan. Model yang \u201Clolos uji\u201D di badan bisa bangkrut di ekor (cerita pembuka: Rp50 miliar vs 1 banding 10 juta tahun).",
      },
      quiz: [
        {
          q: "Untuk perhitungan modal (ekor 99,9%), model terbaik dari tiga kandidat?",
          options: [
            { text: "Lognormal \u2014 AIC-nya paling familiar", why: "Salah: AIC lognormal justru paling besar (5.210)." },
            { text: "Campuran body Lognormal + ekor Pareto", why: "Benar: AIC terkecil DAN alasan struktural \u2014 mekanisme badan \u2260 mekanisme ekor. AD p-value 0,35 terbaik.", correct: true },
            { text: "Pareto murni \u2014 ekornya paling tebal", why: "Salah: Pareto murni mengorbankan fit badan; campuran lebih jujur." },
          ],
        },
        {
          q: "Mengapa tidak cukup memilih \u201CAIC terkecil, selesai\u201D?",
          options: [
            { text: "AIC tidak valid", why: "Salah: AIC valid \u2014 tapi ia rata-rata seluruh data." },
            { text: "AIC rata-rata seluruh data; untuk kuantil 99,9% yang relevan fit di ekor", why: "Benar: butuh AD + QQ ujung + exceedance backtest khusus ekor.", correct: true },
            { text: "AIC selalu memilih model kompleks", why: "Salah: AIC menghukum kompleksitas via suku 2k." },
          ],
        },
      ],
      reference: "Body + ekor terpisah untuk modal. Kriteria + mekanisme > satu angka.",
    },
    {
      id: "alur-quiz",
      eyebrow: "Langkah 5 · Cek cepat",
      title: "Alur fitting yang benar",
      prose: [
        "Dua pertanyaan untuk mengunci alur kerja dan interpretasi uji.",
      ],
      tasks: [],
      quiz: [
        {
          q: "MLE untuk Binomial(n=100, 63 sukses) menghasilkan p\u0302 =\u2026",
          options: [
            { text: "0,5", why: "Salah: itu tebakan tanpa melihat data." },
            { text: "0,63", why: "Benar: 63/100 \u2014 parameter yang membuat data paling tidak mengejutkan.", correct: true },
            { text: "Tidak bisa tanpa prior", why: "Salah: itu Bayesian (B17), bukan MLE." },
          ],
        },
        {
          q: "p-value uji KS = 0,4. Interpretasi tepat?",
          options: [
            { text: "Distribusi terbukti benar", why: "Salah: \u201Cgagal menolak\u201D \u2260 \u201Cbenar\u201D." },
            { text: "Gagal menolak \u2014 belum tentu benar; cek power & QQ-plot", why: "Benar: n kecil \u2192 power rendah \u2192 model salah pun lolos.", correct: true },
            { text: "Model salah", why: "Salah: p-value 0,4 tidak menolak \u2014 tapi juga tidak membuktikan." },
          ],
        },
      ],
      note: {
        title: "Intuisi: fit untuk ekor, bukan untuk tengah",
        body: "Uji goodness-of-fit dan MLE mengukur kecocokan di tempat data paling padat — yaitu tengah distribusi. Tetapi modal risiko, premi asuransi, dan batas kerugian hidup di ekor, tempat data paling sedikit. Model yang lolos uji chi-square dengan p-value 0,4 bisa tetap gagal total memprediksi kerugian Rp50 miliar, karena uji itu hampir tidak menimbang ekor. Inilah asimetri yang harus diinternalisasi: model dinilai di tengah, tetapi dipakai di ekor. Aturan praktisnya: baca QQ-plot dari ujung, bukan dari tengah. Tengah yang lurus hanya berarti model menangkap hal yang biasa; ujung yang melengkung berarti model berbohong tentang hal yang luar biasa. Untuk ekor, pakai Anderson-Darling yang memberi bobot lebih ke ujung, atau langsung perkakas Extreme Value Theory. Untuk membandingkan dua model, AIC dan BIC menghukum kompleksitas — model dengan parameter lebih banyak harus menang cukup besar untuk membenarkan dirinya. Dan tradeoff yang jujur: model sederhana yang salah di ekor vs model kompleks yang overfit di tengah. Tidak ada jawaban gratis; yang ada hanya pilihan sadar tentang di mana kamu bersedia salah.",
      },

      reference: "Diagnosis \u2192 MLE \u2192 banding \u2192 cek ekor khusus \u2192 validasi out-of-sample.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B9.",
      ],
      tasks: [],
      summary: [
        "MLE: parameter yang membuat data paling tidak mengejutkan \u2014 tapi tidak memilih keluarga distribusi.",
        "QQ-plot: baca dari ujung; lengkung = model buta ekor/bentuk.",
        "AD > KS untuk risiko; AIC/BIC untuk banding model (terkecil menang).",
        "Alur: diagnosis \u2192 MLE \u2192 banding \u2192 cek ekor khusus \u2192 validasi out-of-sample.",
        "Jangan anggap \u201Clolos uji\u201D = \u201Cbenar\u201D \u2014 terutama untuk ekor.",
      ],
      next: { label: "B9 \u2014 Joint & Kovarians", href: "/learn/b9-joint-kovarians" },
      quiz: [
        {
          q: "QQ-plot titik-titik melengkung ke atas di ujung kanan. Artinya\u2026",
          options: [
            { text: "Data cocok sempurna", why: "Salah: cocok sempurna = garis lurus diagonal." },
            { text: "Ekor kanan data lebih tebal dari model", why: "Benar: data punya ekstrem lebih besar dari prediksi model \u2014 bahaya untuk risiko.", correct: true },
            { text: "Ekor kanan lebih tipis", why: "Salah: itu kalau melengkung ke bawah." },
          ],
        },
        {
          q: "Untuk risiko (fokus ekor), uji goodness-of-fit yang lebih tepat\u2026",
          options: [
            { text: "Kolmogorov-Smirnov", why: "Salah: KS didominasi badan distribusi." },
            { text: "Anderson-Darling", why: "Benar: AD memberi bobot lebih ke ekor.", correct: true },
            { text: "Uji-t", why: "Salah: uji-t untuk mean, bukan kecocokan distribusi." },
          ],
        },
        {
          q: "AIC = 2k \u2212 2log L\u0302. Suku 2k berfungsi sebagai\u2026",
          options: [
            { text: "Bonus akurasi", why: "Salah: ia penalti, bukan bonus." },
            { text: "Penalti kompleksitas (Occam's razor)", why: "Benar: menghukum parameter tambahan \u2014 model sederhana yang hampir sama baik akan menang.", correct: true },
            { text: "Koreksi sampel kecil", why: "Salah: itu AICc, bukan AIC." },
          ],
        },
        {
          q: "Data Poisson: 2, 3, 1, 4, 0. Estimasi MLE \u03BB?",
          options: [
            { text: "2,0 (= mean sampel)", why: "Benar: MLE Poisson = mean sampel = 10/5 = 2,0.", correct: true },
            { text: "2,5", why: "Salah: itu bukan mean datanya." },
            { text: "4", why: "Salah: itu nilai maksimum, bukan MLE." },
          ],
        },
        {
          q: "Model A: \u2113=\u2212300, k=3. Model B: \u2113=\u2212298, k=5. n=500. Pilih?",
          options: [
            { text: "Model B \u2014 likelihood lebih baik", why: "Salah: AIC keduanya 606 \u2014 seri." },
            { text: "Model A \u2014 AIC seri, pilih yang lebih sederhana", why: "Benar: AIC_A = 606, AIC_B = 606. Tambahan 2 parameter tidak membeli apa-apa \u2014 parsimoni.", correct: true },
            { text: "Keduanya buruk", why: "Salah: tidak ada informasi itu." },
          ],
        },
      ],
    },
  ],
};

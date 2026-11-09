import type { V2Lesson } from "../lib/types";

export const a22: V2Lesson = {
  slug: "a22-estimasi-mle",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.2 Estimasi Parameter & Maximum Likelihood",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-koin",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "7 head dari 10 lemparan",
      prose: [
        "Seorang teman menantangmu bertaruh. Ia melempar koin 10 kali: 7 head, 3 tail. Berapa peluang head yang sebenarnya? Jawaban instingmu: 7/10 = 0,7. Masuk akal — tapi dengan hanya 10 lemparan, 7 head bisa terjadi juga pada koin adil (peluangnya ~12%). Tebakan 0,7 itu tebakan terbaik dari data yang ada, namun datanya sedikit sekali.",
        "Tebakan terbaik ternyata punya banyak arti. Ada yang rata-rata tepat tapi liar setiap dipakai; ada yang stabil tapi selalu sedikit meleset. Dan ada satu prinsip — Maximum Likelihood — yang menjadi mesin di balik regresi logistik, model kredit, dan hampir semua model machine learning modern.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_mle` = 7/10" },
        { id: "t2", text: "Catat `peluang_adil` = 0,12 (peluang 7 head pada koin adil)" },
      ],
      expected: "p_mle=0.7  peluang_adil=0.12",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tebakan 0,7 adalah estimasi titik — satu angka tanpa ukuran ketidakpastian. Keputusan bisnis dari estimasi titik mentah (misalnya PD untuk pricing) sama dengan berjudi. Nanti kamu hitung seberapa lebar ketidakpastiannya.",
      },
      hints: [
        "p_mle = 7 / 10.",
        "peluang_adil = 0.12 dari cerita.",
        "Format print: p_mle=...  peluang_adil=...",
      ],
      code: {
        starter: `# hasil lemparan: 7 head dari 10\n\n# TULIS KODEMU\np_mle = \npeluang_adil = \n\nprint(f"p_mle={p_mle}  peluang_adil={peluang_adil}")`,
        lockLines: 1,
        solution: `# hasil lemparan: 7 head dari 10\n\n# TULIS KODEMU\np_mle = 7/10\npeluang_adil = 0.12  # peluang 7 head jika koin adil\n\nprint(f"p_mle={p_mle}  peluang_adil={peluang_adil}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_mle", value: 0.7, tol: 1e-9, label: "`p_mle` seharusnya 0.7", msg: "7/10 = 0,7 — tebakan terbaik dari data yang ada." },
          { kind: "equal", task: "t2", name: "peluang_adil", value: 0.12, tol: 1e-9, label: "`peluang_adil` seharusnya 0.12", msg: "12% — data sekecil ini belum membuktikan koin curang." },
          { kind: "stdout_matches", task: "t2", pattern: "p_mle=0\\.7\\s+peluang_adil=0\\.12", label: "`print` menampilkan keduanya", msg: "Format: p_mle=...  peluang_adil=... ." },
        ],
      },
      reference: "MLE = parameter yang membuat data teramati paling mungkin.",
    },
    {
      id: "estimator-bias",
      eyebrow: "Langkah 2 · Estimator dan bias",
      title: "Resep masakan dan hidangan hari ini",
      prose: [
        "Parameter (θ) adalah besaran populasi yang tak terlihat. Estimator (θ̂) adalah rumusnya — misal p̂ = x̄; estimasi adalah hasil angkanya — misal 0,7. Estimator adalah resep, estimasi adalah hidangan hari ini. Kualitas resep dinilai dari rata-rata semua masakannya, bukan satu piring.",
        "Bias = E[θ̂] − θ: rata-rata tebakan minus nilai sebenarnya. Data 4, 6, 8 (n=3): mean 6; jumlah kuadrat deviasi 8. Estimator MLE (pembagi n): 8/3 ≈ 2,67. Estimator unbiased (pembagi n−1): 8/2 = 4. MLE selalu underestimate karena deviasi dihitung terhadap x̄ yang mengejar data — data terlihat lebih rapat di sekitar meannya sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ss` = jumlah kuadrat deviasi data [4, 6, 8]" },
        { id: "t2", text: "Hitung `var_mle` = ss/3 (pembulatan 2 desimal)" },
        { id: "t3", text: "Hitung `var_unbiased` = ss/2" },
      ],
      expected: "ss=8  var_mle=2.67  var_unbiased=4",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Estimator yang bagus harus unbiased. Salah: unbiased hanya soal pusat distribusi tebakan, bukan lebarnya. Estimator unbiased tapi variansinya raksasa bisa jauh lebih buruk dari yang sedikit bias tapi stabil. Kualitas total diukur MSE.",
      },
      hints: [
        "Mean data = 6. ss = (4−6)² + (6−6)² + (8−6)².",
        "var_mle = round(ss/3, 2).",
        "var_unbiased = ss / 2",
      ],
      code: {
        starter: `# data: 4, 6, 8\n\n# TULIS KODEMU\nss = \nvar_mle = \nvar_unbiased = \n\nprint(f"ss={ss}  var_mle={var_mle}  var_unbiased={var_unbiased}")`,
        lockLines: 1,
        solution: `# data: 4, 6, 8\n\n# TULIS KODEMU\nss = (4-6)**2 + (6-6)**2 + (8-6)**2\nvar_mle = round(ss/3, 2)\nvar_unbiased = ss/2\n\nprint(f"ss={ss}  var_mle={var_mle}  var_unbiased={var_unbiased}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ss", value: 8, tol: 1e-9, label: "`ss` seharusnya 8", msg: "(4−6)² + (6−6)² + (8−6)² = 8." },
          { kind: "equal", task: "t2", name: "var_mle", value: 2.67, tol: 0.01, label: "`var_mle` seharusnya 2.67", msg: "8/3 ≈ 2,67 — versi MLE yang bias ke bawah." },
          { kind: "equal", task: "t3", name: "var_unbiased", value: 4, tol: 1e-9, label: "`var_unbiased` seharusnya 4", msg: "8/2 = 4 — koreksi Bessel." },
          { kind: "stdout_matches", task: "t3", pattern: "ss=8\\s+var_mle=2\\.67\\s+var_unbiased=4", label: "`print` menampilkan ketiganya", msg: "Format: ss=...  var_mle=...  var_unbiased=... ." },
        ],
      },
      reference: "Laporan risiko memakai sample standard deviation (n−1), bukan versi populasi.",
    },
    {
      id: "mse",
      eyebrow: "Langkah 3 · Variansi dan MSE",
      title: "Rapor lengkap si penebak",
      prose: [
        "MSE = E[(θ̂ − θ)²] = bias² + variansi. Ini laporan rapor estimator: dua komponen yang sering tarik-menarik. Menurunkan variansi (misal menyusutkan estimasi ke nilai aman) biasanya menaikkan bias, dan sebaliknya.",
        "Analogi memanah: bias = seberapa jauh pusat kelompok anak panah dari titik tengah; variansi = seberapa menyebar panahnya. Pemanah yang panahnya menumpuk rapat tapi 5 cm ke kiri mengalahkan pemanah yang rata-rata tepat tengah tapi panahnya ke mana-mana. Sifat penting: konsistensi — estimator konsisten konvergen ke nilai benar saat n besar. MLE variansi bias tapi konsisten; untuk n besar, perdebatan n vs n−1 tidak penting lagi.",
      ],
      formula: String.raw`\mathrm{MSE} = \mathrm{Bias}^2 + \mathrm{Variansi}`,
      formulaNote: "MSE = mean squared error estimator; Bias = E[theta-hat] minus theta (penyimpangan sistematis); Variansi = sebaran tebakan antar sampel; MSE menjumlahkan keduanya — rapor lengkap si penebak.",
      tasks: [
        { id: "t1", text: "Hitung `mse` jika bias = 2 dan variansi = 9" },
      ],
      expected: "mse=13",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghapus bias selalu memperbaiki estimasi. Salah: bias 2 menyumbang 4 ke MSE — menghapusnya tidak sepadan jika variansi naik lebih dari 4. Kualitas = MSE total, bukan bias nol.",
      },
      hints: [
        "mse = bias**2 + variansi.",
        "bias = 2, variansi = 9.",
        "mse = 2**2 + 9",
      ],
      code: {
        starter: `# estimator: E[theta_hat] = theta + 2, Var = 9\n\n# TULIS KODEMU\nmse = \n\nprint(f"mse={mse}")`,
        lockLines: 1,
        solution: `# estimator: E[theta_hat] = theta + 2, Var = 9\n\n# TULIS KODEMU\nmse = 2**2 + 9\n\nprint(f"mse={mse}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mse", value: 13, tol: 1e-9, label: "`mse` seharusnya 13", msg: "2² + 9 = 13." },
          { kind: "stdout_matches", task: "t1", pattern: "mse=13", label: "`print` menampilkan mse", msg: "Format: mse=... ." },
        ],
      },
      reference: "MSE adalah satu angka yang merangkum bias dan variansi.",
    },
    {
      id: "mle-bernoulli",
      eyebrow: "Langkah 4 · Maximum likelihood",
      title: "Si oportunis yang mengikuti data",
      prose: [
        "MLE: pilih nilai parameter yang membuat data teramati paling mungkin. Likelihood L(θ) = ∏ f(xᵢ; θ); praktisnya maksimalkan log-likelihood (perkalian jadi penjumlahan). Untuk koin Bernoulli: langkah 1 — L(p) = p⁷(1−p)³; langkah 2 — ℓ = 7 log p + 3 log(1−p); langkah 3 — turunkan, nol-kan; langkah 4 — p̂ = 7/10. Hasilnya cuma rata-rata sampel — tapi sekarang kamu tahu mengapa: rata-rata adalah nilai yang memaksimalkan kemungkinan data teramati.",
        "Untuk Normal, cara yang sama menghasilkan x̄ dan variansi pembagi-n (yang bias!). MLE punya sifat asimtotik indah (konsisten, efisien saat n besar), tapi pada sampel kecil bisa bias. Jika modelnya salah (asumsi distribusi keliru), MLE mengikuti ke arah yang salah. Garbage model in, garbage estimate out.",
      ],
      tasks: [
        { id: "t1", text: "Cari `p_hat` dengan grid search: p dari 0,01 s/d 0,99 yang memaksimalkan log-likelihood 7 head dari 10" },
      ],
      expected: "p_hat=0.7",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "MLE selalu unbiased dan selalu terbaik. Salah: sifat baiknya adalah konsistensi & efisiensi asimtotik, bukan ketidakbiasan sampel kecil. Untuk n kecil, estimator yang sedikit bias tapi stabil sering menang MSE. MLE adalah titik awal yang hebat, bukan jawaban final.",
      },
      hints: [
        "log-likelihood = 7*log(p) + 3*log(1-p).",
        "Loop p = 0.01, 0.02, …, 0.99; simpan yang terbesar.",
        "Jawabannya cocok dengan rumus p̂ = x̄.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nbest_p, best_ll = 0, float("-inf")\n# loop p dari 0.01 sampai 0.99 ...\n\np_hat = \n\nprint(f"p_hat={round(p_hat, 2)}")`,
        lockLines: 3,
        solution: `import math\n\n# TULIS KODEMU\nbest_p, best_ll = 0, float("-inf")\nfor i in range(1, 100):\n    p = i / 100\n    ll = 7*math.log(p) + 3*math.log(1-p)\n    if ll > best_ll:\n        best_p, best_ll = p, ll\n\np_hat = best_p\n\nprint(f"p_hat={round(p_hat, 2)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_hat", value: 0.7, tol: 0.011, label: "`p_hat` seharusnya ≈ 0.7", msg: "Puncak kurva likelihood di p = 0,7 — cocok dengan rumus." },
          { kind: "stdout_matches", task: "t1", pattern: "p_hat=0\\.7", label: "`print` menampilkan p_hat", msg: "Format: p_hat=0.7." },
        ],
      },
      reference: "MLE adalah fondasi regresi logistik (model PD kredit).",
    },
    {
      id: "bias-variance-shinkage",
      eyebrow: "Langkah 5 · Tradeoff bias-variance",
      title: "Kadang sengaja bias hasilnya lebih baik",
      prose: [
        "Ingat MSE = bias² + variansi: keduanya monoton berlawanan arah terhadap kekuatan shrinkage. MSE total berbentuk U dengan minimum di tengah — sedikit bias yang ditukar dengan banyak penurunan variansi = menang total. Inilah kurva U yang akan kamu temui lagi di setiap pembahasan overfitting machine learning.",
        "Contoh: waktu antar klaim (hari) 2, 5, 1, 8, 4 (n=5). MLE laju Eksponensial λ̂ = n/Σx = 5/20 = 0,25 per hari — rata-rata 1 klaim per 4 hari. James–Stein (1961) mengejutkan dunia statistika: menyusutkan estimasi 500 rata-rata batting ke rata-rata liga terbukti menurunkan MSE total. Kadang sengaja bias menghasilkan tebakan lebih baik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lambda_mle` = n / jumlah waktu antar klaim" },
        { id: "t2", text: "Hitung `rata_hari` = 1 / lambda_mle (rata-rata hari per klaim)" },
      ],
      expected: "lambda_mle=0.25  rata_hari=4.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Banyak parameter dari sedikit data (default rate per cabang kecil) → variansi mendominasi MSE. Estimasi per cabang yang disusutkan ke rata-rata nasional (empirical Bayes) lebih defensibel daripada angka liar tiap cabang.",
      },
      hints: [
        "n = 5; jumlah = 2+5+1+8+4 = 20.",
        "lambda_mle = 5 / 20.",
        "rata_hari = 1 / 0.25",
      ],
      code: {
        starter: `# waktu antar klaim (hari): 2, 5, 1, 8, 4\n\n# TULIS KODEMU\nlambda_mle = \nrata_hari = \n\nprint(f"lambda_mle={lambda_mle}  rata_hari={rata_hari}")`,
        lockLines: 1,
        solution: `# waktu antar klaim (hari): 2, 5, 1, 8, 4\n\n# TULIS KODEMU\nlambda_mle = 5 / (2+5+1+8+4)\nrata_hari = 1 / lambda_mle\n\nprint(f"lambda_mle={lambda_mle}  rata_hari={rata_hari}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lambda_mle", value: 0.25, tol: 1e-9, label: "`lambda_mle` seharusnya 0.25", msg: "5/20 = 0,25 per hari." },
          { kind: "equal", task: "t2", name: "rata_hari", value: 4.0, tol: 1e-9, label: "`rata_hari` seharusnya 4.0", msg: "1/0,25 = 4 hari per klaim rata-rata." },
          { kind: "stdout_matches", task: "t2", pattern: "lambda_mle=0\\.25\\s+rata_hari=4\\.0", label: "`print` menampilkan keduanya", msg: "Format: lambda_mle=...  rata_hari=... ." },
        ],
      },
      reference: "Tradeoff bias-variance adalah ide di balik regularisasi ridge.",
    },
    {
      id: "minicase-pd",
      eyebrow: "Langkah 6 · Mini-case",
      title: "PD 3% untuk pricing — berani?",
      prose: [
        "Fintech DanaKita meluncurkan segmen kredit modal kerja untuk warung. Setelah 6 bulan: 200 pinjaman, 6 gagal bayar. Analis junior menghitung MLE: p̂ = 6/200 = 3%. Direksi memakai 3% untuk pricing.",
        "(a) SE = √(0,03·0,97/200) ≈ 1,2 poin. Interval kasar 95%: 3% ± 2,4% → (0,6%, 5,4%). PD sebenarnya bisa hampir 2× lipat! (b) Jika PD sebenarnya 5%, bunga tidak menutup expected loss — portofolio merugi sistematis. Keputusan bisnis dari estimasi titik tanpa ketidakpastian = berjudi. (c) Pendekatan 1: pakai batas atas Wilson (~5,9%) sebagai PD konservatif — add-on konservatisme untuk portofolio kecil. Pendekatan 2: shrinkage — susutkan 3% ke PD historis segmen sejenis 4,5%: (200·0,03 + 100·0,045)/300 = 3,5%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pd` = 6/200" },
        { id: "t2", text: "Hitung `se` = √(pd·(1−pd)/200), bulatkan 4 desimal" },
        { id: "t3", text: "Hitung `pd_shrink` = (200·0,03 + 100·0,045)/300" },
      ],
      expected: "pd=0.03  se=0.0121  pd_shrink=0.035",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "n=200 dengan 6 kejadian terlalu sedikit untuk percaya pada satu angka. Praktik defensibel: pakai batas atas interval (konservatif) atau shrinkage ke historis. Angka 3% mentah untuk pricing adalah underpricing risk yang menunggu meledak.",
      },
      hints: [
        "pd = 6 / 200.",
        "se = round(math.sqrt(pd*(1-pd)/200), 4).",
        "pd_shrink = (200*0.03 + 100*0.045) / 300",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\npd = \nse = \npd_shrink = \n\nprint(f"pd={pd}  se={se}  pd_shrink={pd_shrink}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\npd = 6/200\nse = round(math.sqrt(pd*(1-pd)/200), 4)\npd_shrink = (200*0.03 + 100*0.045)/300\n\nprint(f"pd={pd}  se={se}  pd_shrink={pd_shrink}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pd", value: 0.03, tol: 1e-9, label: "`pd` seharusnya 0.03", msg: "6/200 = 3% — MLE mentah." },
          { kind: "equal", task: "t2", name: "se", value: 0.0121, tol: 1e-4, label: "`se` seharusnya 0.0121", msg: "SE ≈ 1,2 poin — interval 95% selebar (0,6%, 5,4%)." },
          { kind: "equal", task: "t3", name: "pd_shrink", value: 0.035, tol: 1e-9, label: "`pd_shrink` seharusnya 0.035", msg: "(6 + 4,5)/300 = 3,5% — disusutkan ke historis 4,5%." },
          { kind: "stdout_matches", task: "t3", pattern: "pd=0\\.03\\s+se=0\\.0121\\s+pd_shrink=0\\.035", label: "`print` menampilkan ketiganya", msg: "Format: pd=...  se=...  pd_shrink=... ." },
        ],
      },
      reference: "Satu angka 3% menyembunyikan ketidakpastian raksasa.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Parameter = target tak terlihat; estimator = rumus; estimasi = hasil angka.",
        "MSE = bias² + variansi; kualitas total, bukan bias nol.",
        "MLE = parameter yang membuat data teramati paling mungkin; konsisten tapi bisa bias di sampel kecil.",
        "Bias-variance tradeoff: shrinkage sengaja menambah bias untuk memangkas variansi.",
        "Estimasi titik tanpa ketidakpastian tidak layak untuk keputusan bisnis.",
      ],
      next: { label: "A2.3 — Interval Kepercayaan", href: "/v2/learn/a23-interval-kepercayaan" },
      quiz: [
        {
          q: "Manakah yang dimaksud 'estimator'?",
          options: [
            { text: "Angka 0,7 dari pelemparan koin", why: "Itu estimasi — hidangan hari ini, bukan resepnya." },
            { text: "Rumus p̂ = x̄ (aturan untuk menghitung dari data apapun)", why: "Estimator = resep/rumus; kualitas dinilai dari distribusinya.", correct: true },
            { text: "Nilai p sebenarnya yang tidak diketahui", why: "Itu parameter — target yang ingin ditebak." },
            { text: "Distribusi binomial", why: "Itu model datanya, bukan rumus penebaknya." },
          ],
        },
        {
          q: "Estimator θ̂ punya E[θ̂] = θ + 2 dan Var(θ̂) = 9. Berapa MSE-nya?",
          options: [
            { text: "9", why: "Itu hanya variansi — biasnya belum dihitung." },
            { text: "11", why: "2 + 9? Bias harus dikuadratkan dulu." },
            { text: "13", why: "MSE = bias² + variansi = 4 + 9.", correct: true },
            { text: "4", why: "Itu hanya bias² — variansinya belum dihitung." },
          ],
        },
        {
          q: "Mengapa estimator variansi MLE (pembagi n) bias ke bawah?",
          options: [
            { text: "Karena datanya selalu kurang", why: "Bukan soal jumlah data — soal terhadap apa deviasi dihitung." },
            { text: "Karena deviasi dihitung terhadap x̄ yang 'mengejar' data, sehingga data terlihat lebih rapat dari sebenarnya", why: "x̄ meminimalkan jumlah kuadrat deviasi pada sampel itu.", correct: true },
            { text: "Karena rumusnya salah ketik", why: "Rumusnya benar — biasnya terstruktur, sebesar σ²/n." },
            { text: "Karena n selalu terlalu kecil", why: "Bias ada di n berapapun; hanya mengecil saat n besar." },
          ],
        },
        {
          q: "Untuk data Bernoulli (7 sukses dari 10), MLE bagi p adalah…",
          options: [
            { text: "0,5 karena koin adil", why: "Itu asumsi, bukan yang dimaksimalkan dari data." },
            { text: "0,7 = x̄ — nilai yang memaksimalkan likelihood data teramati", why: "Turunan log-likelihood menghasilkan p̂ = x̄.", correct: true },
            { text: "Tidak bisa ditentukan tanpa prior", why: "MLE tidak butuh prior — itu ranah Bayesian." },
            { text: "Median dari data", why: "Median tidak memaksimalkan likelihood Bernoulli." },
          ],
        },
        {
          q: "Kapan estimator yang sedikit bias bisa MENGALAHKAN estimator unbiased?",
          options: [
            { text: "Tidak pernah — unbiased selalu menang", why: "James–Stein (1961) membuktikan sebaliknya." },
            { text: "Ketika penurunan variansinya lebih besar dari kenaikan bias²-nya, sehingga MSE total lebih kecil", why: "Inti tradeoff bias-variance; shrinkage/ridge adalah contohnya.", correct: true },
            { text: "Hanya jika n sangat besar", why: "Justru untuk n kecil (variansi besar) shrinkage paling membantu." },
            { text: "Hanya untuk data normal", why: "Tradeoff ini umum, tidak spesifik Normal." },
          ],
        },
      ],
      note: {
        title: "Intuisi: setiap estimator adalah taruhan antara bias dan variansi",
        body: "Enam heuristik. Satu: tak bias bukan berarti terbaik — yang menentukan adalah MSE, jumlah bias kuadrat dan variansi; estimator yang sedikit bias tetapi stabil sering mengalahkan yang tak bias tetapi liar. Dua: MLE adalah oportunis — ia memilih parameter yang membuat data teramati paling mungkin, termasuk noise-nya; pada sampel kecil oportunisme ini berujung bias. Tiga: pembagi n versus n-minus-1 mengajarkan pelajaran mahal — bahkan “tak bias” pun ada harganya, dan pilihan kecil di rumus bisa mengubah sifat estimator. Empat: shrinkage adalah taruhan yang cerdas — sedikit bias yang ditukar dengan banyak penurunan variansi memenangkan MSE; James-Stein membuktikan bahwa intuisi “tak bias selalu lebih baik” bisa salah total. Lima: sifat asimtotik yang indah (konsisten, efisien) hanya berlaku saat n besar — selalu cek n-mu sebelum meminjam kemewahan teori; dan bila modelnya salah sejak awal, estimator terbaik pun hanya presisi mengukur kesalahan. Enam: bedakan estimator, estimasi, dan parameter — estimator adalah resep, estimasi adalah hidangan hari ini, parameter adalah rasa sejati yang tak pernah terlihat; tertukar ketiganya berarti salah membaca rapor.",
      },
    },
  ],
};

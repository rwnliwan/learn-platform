import type { V2Lesson } from "../lib/types";

export const mr15: V2Lesson = {
  slug: "mr15-model-stokastik",
  track: "Market Risk",
  module: "Model Stokastik",
  title: "MR15 — Model Stokastik: Mesin Penghasil Masa Depan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-sempurna",
      eyebrow: "Langkah 1 · Memilih model",
      title: "Cerita: model yang terlalu sempurna",
      prose: [
        "Sebuah bank memakai model suku bunga Vasicek untuk mensimulasikan skenario 10 tahun ke depan. Model itu elegan: punya rumus tertutup untuk harga obligasi, mudah dikalibrasi. Hasil simulasi: suku bunga jangka panjang stabil di sekitar 5%, skenario terburuk −1%. Masalahnya: model dikalibrasi di era suku bunga positif — dan Vasicek mengizinkan suku bunga negatif tanpa batas.",
        "Di simulasi, 15% skenario menghasilkan suku bunga −3% atau lebih rendah — mustahil secara ekonomi di negara itu. Seluruh perhitungan modal berbasis skenario itu cacat dari fondasinya. Twist-nya: bukan modelnya yang salah — Vasicek benar-benar dipakai luas. Yang salah adalah pemilihan model tanpa memahami propertinya: untuk rezim itu, CIR (yang menjamin non-negatif) adalah pilihan tepat.",
        "Pelajaran: simulasi Monte Carlo, perhitungan CVA, dan stress test semuanya hanya sebagus model stokastiknya. Lesson ini tentang memilih mesin penghasil masa depan yang benar — karena properti model (positif? mean-reverting? pas ke kurva?) menentukan apakah skenariomu masuk akal.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan apa yang salah dalam cerita: modelnya atau pemilihannya?" },
        { id: "t2", text: "Sebutkan tiga properti yang harus ditanyakan sebelum memilih model." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Model hanya sebagus kalibrasinya — dan kalibrasi hanya sebagus datanya. Model yang dikalibrasi di era suku bunga positif lalu dipakai untuk skenario 10 tahun tanpa memeriksa propertinya adalah cara elegan untuk salah dengan penuh percaya diri.",
        type: "risk",
      },
      reference: "Pilih model dari properti yang dibutuhkan: positif? mean-reverting? pas ke kurva?",
    },
    {
      id: "gbm",
      eyebrow: "Langkah 2 · GBM",
      title: "GBM: model standar harga saham",
      prose: [
        "Geometric Brownian Motion — model paling terkenal di keuangan (fondasi Black-Scholes): dS_t = μS_t dt + σS_t dW_t. S_t = harga; μ = drift (return ekspektasi tahunan); σ = volatilitas tahunan; dW_t = guncangan acak. Solusi eksak untuk simulasi: S_T = S_t·exp[(μ − ½σ²)Δt + σ√Δt·Z], Z ~ N(0,1).",
        "Sifat kunci: harga selalu positif (eksponensial), return log-normal, dan tidak mean-reverting — sebaran melebar dengan √T. Cocok untuk saham (harga bisa terbang ke mana saja), tidak cocok untuk suku bunga (yang ditarik bank sentral). Suku −½σ² adalah koreksi Jensen (volatility drag): return median/geometrik lebih rendah dari return ekspektasi aritmatika — dua aset dengan μ sama, yang lebih volatil tumbuh lebih lambat dalam jangka panjang.",
        "Simulasi: S0=100, μ=5%, σ=20%, T=1 tahun, 500 skenario. Rata-rata terminal ≈ 105,4 (teori 105,1), standar deviasi ≈ 21,1 — sebaran melebar. Median teori = 103,05 < mean 105,13: volatilitas memakan pertumbuhan median. Inilah gunanya Monte Carlo: bukan meramal satu masa depan, melainkan memetakan sebaran masa depan yang mungkin.",
      ],
      formula: String.raw`S_T = S_t \exp\left[\left(\mu - \tfrac{1}{2}\sigma^2\right)\Delta t + \sigma\sqrt{\Delta t}\,Z\right]`,
      formulaNote: "S_t = harga kini; μ = drift (return ekspektasi tahunan); σ = volatilitas tahunan; Δt = horizon; Z = guncangan acak standar N(0,1). Suku −½σ² = koreksi Jensen (volatility drag): median tumbuh lebih lambat dari mean. Contoh lab: S0=100, μ=5%, σ=20% → mean terminal ≈ 105,4 tetapi median teori hanya 103,05. Interpretasi: harga selalu positif (eksponensial), sebaran melebar dengan √T — cocok untuk saham, tidak untuk suku bunga (tidak mean-reverting).",
      tasks: [
        { id: "t1", text: "Simulasikan 500 harga terminal GBM, hitung `mean_st` dan `std_st`" },
        { id: "t2", text: "Bandingkan dengan teori; jelaskan volatility drag" },
      ],
      expected: "mean_st=105.37  std_st=21.12",
      note: {
        title: "Sering salah",
        body: "Memakai GBM untuk semua harga. GBM mengasumsikan volatilitas konstan dan return normal — dua asumsi yang dilanggar data nyata (volatility smile — senyum volatilitas implisit, clustering — pengelompokan volatilitas). GBM adalah titik awal, bukan kebenaran. Untuk aplikasi serius: vol stokastik (Heston) atau setidaknya GARCH untuk volatilitasnya.",
        type: "pitfall",
      },
      hints: [
        "ST = S0*exp((mu-0.5*sig**2)*T + sig*sqrt(T)*gauss(0,1)) per skenario. Perlu import random, math.",
        "random.seed(7) sudah dikunci — hasil deterministik.",
        "mean = sum(ST)/len(ST); std = akar variansi sampel.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(7)\n\nS0, mu, sig, T = 100.0, 0.05, 0.2, 1.0\nn = 500\n\n# TULIS KODEMU: 500 harga terminal, lalu mean & std\nST = \nmean_st = \nstd_st = \n\nprint(f"mean_st={mean_st:.2f}  std_st={std_st:.2f}")`,
        lockLines: 5,
        solution: `import random, math\nrandom.seed(7)\n\nS0, mu, sig, T = 100.0, 0.05, 0.2, 1.0\nn = 500\n\n# TULIS KODEMU: 500 harga terminal, lalu mean & std\nST = [S0 * math.exp((mu - 0.5 * sig ** 2) * T + sig * math.sqrt(T) * random.gauss(0, 1)) for _ in range(n)]\nmean_st = sum(ST) / len(ST)\nvar = sum((x - mean_st) ** 2 for x in ST) / (len(ST) - 1)\nstd_st = math.sqrt(var)\n\nprint(f"mean_st={mean_st:.2f}  std_st={std_st:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_st", value: 105.37, tol: 0.05, label: "`mean_st` seharusnya ~105.37", msg: "Dekat teori 105,13. Cek suku −½σ² di eksponen." },
          { kind: "equal", task: "t1", name: "std_st", value: 21.12, tol: 0.05, label: "`std_st` seharusnya ~21.12", msg: "Sebaran melebar dengan √T — ciri GBM." },
          { kind: "stdout_matches", task: "t2", pattern: "mean_st=105\\.37\\s+std_st=21\\.12", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "GBM: positif, log-normal, tidak mean-reverting. −½σ² = volatility drag.",
    },
    {
      id: "suku-bunga-model",
      eyebrow: "Langkah 3 · Model suku bunga",
      title: "Vasicek, CIR, Hull-White: suku bunga butuh karet gelang",
      prose: [
        "Suku bunga mean-reverting (ditarik ke level normal oleh bank sentral & ekonomi) dan tidak boleh negatif (di sebagian besar rezim) — GBM gagal di keduanya. Vasicek (1977): dr_t = κ(θ−r_t)dt + σdW_t. κ = kecepatan mean-reversion (kekuatan karet gelang); θ = level jangka panjang; σ = volatilitas. Kelebihan: rumus tertutup untuk harga obligasi. Kelemahan: bisa negatif tanpa batas — masalah di cerita pembuka.",
        "CIR (1985): dr_t = κ(θ−r_t)dt + σ√r_t dW_t. Bedanya: volatilitas ∝ √r_t — saat rate mendekati nol, guncangan mengecil → tidak bisa negatif. Hull-White (1990): Vasicek dengan θ bergantung waktu θ(t) — dikalibrasi agar pas persis dengan kurva yield kini. Kegunaan: pricing derivatif suku bunga yang konsisten dengan pasar hari ini (standar industri untuk swaption, callable bond).",
        "Mean-reversion = karet gelang: κ besar = karet kuat (cepat kembali, cocok untuk rate jangka pendek yang dikontrol bank sentral); κ kecil = karet longgar (rate jangka panjang yang melayang). Salah pilih κ = salah estimasi seberapa lama guncangan bertahan — fatal untuk skenario multi-tahun.",
      ],
      formula: String.raw`dr_t = \kappa(\theta - r_t)\,dt + \sigma\sqrt{r_t}\,dW_t \quad \text{(CIR)}`,
      formulaNote: "r_t = suku bunga; κ = kecepatan mean-reversion (kekuatan 'karet gelang'); θ = level jangka panjang; σ = volatilitas; dW_t = guncangan acak. Bedanya dengan Vasicek: volatilitas ∝ √r_t — saat rate mendekati nol, guncangan mengecil sehingga tidak bisa negatif. Interpretasi: pilih CIR untuk simulasi di rezim non-negatif (skenario ALM/NII); Vasicek hanya jika analitis lebih penting dari realisme; Hull-White (θ bergantung waktu) untuk pricing yang pas ke kurva kini.",
      tasks: [
        { id: "t1", text: "Bandingkan Vasicek vs CIR: kapan tiap model tepat?" },
        { id: "t2", text: "Kapan Hull-White dipilih atas Vasicek/CIR?" },
      ],
      note: {
        title: "Sering salah",
        body: "Memakai Vasicek untuk simulasi di rezim yang tidak mungkin negatif. 15% skenario ≤ −3% bukan sekadar angka aneh — ia meracuni seluruh perhitungan modal yang memakai skenario itu. Pilih model dari properti rezimmu, bukan dari kemudahan rumusnya.",
        type: "pitfall",
      },
      reference: "Vasicek: analitis tapi bisa negatif. CIR: non-negatif. HW: pas ke kurva kini (pricing).",
    },
    {
      id: "garch",
      eyebrow: "Langkah 4 · GARCH",
      title: "Volatilitas yang hidup",
      prose: [
        "GARCH(1,1) memodelkan volatilitas sebagai proses yang mengikuti dirinya sendiri: σ_t² = ω + αr_{t-1}² + βσ_{t-1}². ω = level dasar; α = reaksi ke guncangan kemarin (ARCH effect — kaget); β = persistensi volatilitas kemarin (GARCH effect — ingatan). Volatilitas jangka panjang (unconditional): σ²_LR = ω/(1−α−β).",
        "Hubungan dengan EWMA (rata-rata bergerak eksponensial untuk volatilitas): EWMA adalah GARCH(1,1) dengan ω=0, α=1−λ, β=λ — tanpa level jangka panjang (α+β=1, integrated). GARCH lebih umum: punya mean-reversion volatilitas ke level jangka panjang. α+β tipikal ≈ 0,95–0,99 — ingatan volatilitas sangat panjang: guncangan hari ini masih terasa berminggu-minggu. Inilah volatility clustering dalam bentuk formal.",
        "Contoh: ω=0,02, α=0,08, β=0,90; return (%) [1,5, −2,0, 0,5, 3,0, −1,0]; mulai dari variansi 1,0. Variansi berkembang: 1,10 → 1,33 → 1,237 → 1,853 → 1,768. Perhatikan: guncangan 3,0% melompatkan variansi ke 1,85 — lalu ia meluruh perlahan (β=0,90): cluster. Volatilitas unconditional = √(0,02/0,02) = 1,0%.",
      ],
      formula: String.raw`\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta \sigma_{t-1}^2 \qquad \sigma^2_{LR} = \frac{\omega}{1-\alpha-\beta}`,
      formulaNote: "σ_t² = variansi hari ini; ω = level dasar; α = reaksi ke guncangan kemarin (kaget); β = persistensi volatilitas kemarin (ingatan); σ²_LR = variansi jangka panjang. Contoh lab: ω=0,02, α=0,08, β=0,90 → guncangan 3,0% melompatkan variansi ke 1,85 lalu meluruh perlahan; σ_LR = 1,0%. Interpretasi: α+β ≈ 0,95–0,99 = ingatan sangat panjang (volatility clustering formal); α+β=1 = EWMA/integrated, tanpa level jangka panjang.",
      tasks: [
        { id: "t1", text: "Jalankan rekursi GARCH untuk 5 return, dapatkan `var_akhir`" },
        { id: "t2", text: "Hitung `vol_lr` (unconditional, %), lalu cetak keduanya" },
      ],
      expected: "var_akhir=1.7680  vol_lr=1.00",
      note: {
        title: "Sering salah",
        body: "Mengira GARCH meramal volatilitas masa depan dengan akurat. GARCH hebat menjelaskan dinamika volatilitas (clustering, mean-reversion) — tetapi ramalan titiknya tetap tidak presisi. Gunanya: skenario & VaR adaptif (Filtered HS memakai ini!), bukan vol besok = 23,4%. Jangan oversell presisinya.",
        type: "pitfall",
      },
      hints: [
        "Loop: v = w + a*rt**2 + b*v untuk tiap rt di rets.",
        "vol_lr = sqrt(w/(1-a-b)). Perlu import math.",
        "α+β = 0,98 < 1 → ada level jangka panjang (bukan integrated seperti EWMA).",
      ],
      code: {
        starter: `import math\n\nw, a, b = 0.02, 0.08, 0.90\nrets = [1.5, -2.0, 0.5, 3.0, -1.0]  # return harian (%)\nv = 1.0  # variansi awal\n\n# TULIS KODEMU: rekursi GARCH dan vol unconditional\nfor rt in rets:\n    v = \nvar_akhir = v\nvol_lr = \n\nprint(f"var_akhir={var_akhir:.4f}  vol_lr={vol_lr:.2f}")`,
        lockLines: 6,
        solution: `import math\n\nw, a, b = 0.02, 0.08, 0.90\nrets = [1.5, -2.0, 0.5, 3.0, -1.0]  # return harian (%)\nv = 1.0  # variansi awal\n\n# TULIS KODEMU: rekursi GARCH dan vol unconditional\nfor rt in rets:\n    v = w + a * rt ** 2 + b * v\nvar_akhir = v\nvol_lr = math.sqrt(w / (1 - a - b))\n\nprint(f"var_akhir={var_akhir:.4f}  vol_lr={vol_lr:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_akhir", value: 1.768, tol: 0.001, label: "`var_akhir` seharusnya 1.7680", msg: "Rekursi 5 langkah dari v=1,0. Cek urutan: kaget (α) lalu ingatan (β)." },
          { kind: "equal", task: "t2", name: "vol_lr", value: 1.0, tol: 0.01, label: "`vol_lr` seharusnya 1.00", msg: "√(0,02/(1−0,98)) = 1,0%. Level jangka panjang volatilitas." },
          { kind: "stdout_matches", task: "t2", pattern: "var_akhir=1\\.7680\\s+vol_lr=1\\.00", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "GARCH: ω dasar, α kaget, β ingatan. α+β ≈ 0,97 = clustering kuat. EWMA = kasus khusus.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Model mana, kapan",
      prose: [
        "Empat keputusan. Pertama, simulasi harga saham/ekuitas (Monte Carlo VaR ekuitas, skenario harga) → GBM: positif, sederhana, standar. Untuk pricing opsi eksotis: tambah stochastic vol (Heston). Kedua, simulasi suku bunga di rezim non-negatif (skenario ALM, risiko suku bunga banking book, proyeksi NII) → CIR: mean-reverting + non-negatif. Jangan pakai Vasicek jika rate negatif mustahil di rezimmu.",
        "Ketiga, pricing derivatif suku bunga yang konsisten pasar (swaption, callable bond, XVA) → Hull-White: θ(t) dikalibrasi pas ke kurva kini — harga konsisten dengan pasar hari ini; standar industri. Keempat, volatilitas dinamis atau VaR adaptif (simulasi historis terfilter — Filtered Historical Simulation, peramalan vol jangka pendek-menengah) → GARCH(1,1): menangkap clustering + mean-reversion vol; butuh data panjang untuk estimasi stabil.",
        "Aturan 10 detik: saham → GBM; suku bunga → mean-reverting (CIR/HW); volatilitas → GARCH. Selalu tanya: properti apa yang saya butuhkan (positif? mean-reverting? pas ke kurva?) — lalu pilih model yang punya properti itu.",
        "Kapan difusi tidak cukup — jump diffusion. GBM dan CIR mengasumsikan harga bergerak kontinu — tetapi pasar nyata melompat: default obligasi, devaluasi tiba-tiba, pengumuman mengejutkan. Model jump-diffusion (Merton, 1976) menambahkan lompatan Poisson ke difusi: sebagian besar waktu harga bergerak halus, kadang melompat besar. Konsekuensinya untuk risiko: jump membuat ekor jauh lebih tebal daripada difusi murni — VaR dari GBM meremehkan risiko lompatan secara sistematis. Kapan dibutuhkan: pricing opsi jangka pendek (jump mendominasi), risiko kredit (default = lompatan ke nol), komoditas (guncangan pasokan). Kapan tidak: untuk horizon panjang di pasar likuid, difusi + vol stokastik biasanya cukup — jump menambah parameter yang sulit dikalibrasi.",
        "Kalibrasi — seni mencocokkan model ke pasar — dan jebakan overfitting-nya. Mengkalibrasi 5 parameter ke 5 harga opsi selalu 'berhasil' (fit sempurna), tetapi parameternya tidak stabil: besok pasar bergerak sedikit, parameter melompat jauh — model yang tidak robust. Aturan praktisi: lebih sedikit parameter yang stabil mengalahkan banyak parameter yang presisi; selalu uji stabilitas kalibrasi (rekalibrasi harian — apakah parameter melompat-lompat?); dan bedakan kalibrasi historis (untuk simulasi risiko: cocokkan ke data masa lalu) vs kalibrasi implisit (untuk pricing: cocokkan ke harga pasar hari ini) — keduanya menjawab pertanyaan berbeda. Model yang dikalibrasi sempurna tetapi tidak stabil = overfitting berbaju matematika.",
      ],
      tasks: [
        { id: "t1", text: "Butuh skenario NII 5 tahun di negara tanpa rate negatif. Model apa?" },
        { id: "t2", text: "Butuh pricing swaption yang konsisten dengan kurva hari ini. Model apa?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Kelemahan fundamental GBM ber-vol-konstan untuk VaR ekuitas: mengabaikan volatility clustering & fat tail — VaR tidak adaptif terhadap rezim dan meremehkan ekor. Praktik yang benar: GBM dengan σ dari GARCH/EWMA (seperti Filtered HS), atau model vol stokastik penuh.",
        type: "risk",
      },
      reference: "Saham → GBM. Suku bunga → CIR/HW. Vol → GARCH. Properti dulu, model kemudian.",
    },
    {
      id: "minicase-rate-salah",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Model suku bunga yang salah",
      prose: [
        "Tim ALM memakai Vasicek (r0=2%, κ=0,3, θ=2%, σ=2%) untuk proyeksi NII 10 tahun di negara yang tidak mengenal suku bunga negatif. Simulasi 1.000 skenario: ~23% skenario berakhir negatif — dan 15% di antaranya ≤ −3%. Setiap skenario negatif menghasilkan proyeksi NII yang mustahil (beban bunga negatif = pendapatan!).",
        "Rata-rata NII 10-tahun dari simulasi terlihat sehat — tetapi rata-rata itu mencampurkan skenario mustahil. Direksi menyetujui rencana bisnis berdasarkan angka yang terkontaminasi. Tiga pertanyaan yang seharusnya ditanyakan validator: berapa persen skenario yang melanggar batas ekonomi (negatif)? Apakah model alternatif (CIR) mengubah kesimpulan? Dan apakah keputusan (rencana bisnis) sensitif terhadap skenario mustahil itu?",
        "Perbaikannya: ganti ke CIR (volatilitas ∝ √r_t mengecil mendekati nol) atau Hull-White dengan floor — lalu bandingkan keputusannya. Jika keputusan berubah, model lama bukan sekadar tidak elegan — ia berbahaya. Disiplin validasi model ada untuk menangkap persis ini: menguji kesesuaian model dengan rezim tempat ia dipakai.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa rata-rata NII dari simulasi Vasicek menyesatkan." },
        { id: "t2", text: "Tuliskan tiga pertanyaan validator untuk kasus ini." },
      ],
      note: {
        title: "Sering salah",
        body: "Memvalidasi model hanya dari kecocokan statistik (goodness-of-fit) tanpa memeriksa properti ekonominya. Model bisa fit sempurna ke data historis tetapi menghasilkan skenario mustahil — validasi harus mencakup uji properti, bukan cuma uji statistik.",
        type: "pitfall",
      },
      reference: "~23% skenario Vasicek negatif = proyeksi NII terkontaminasi. Ganti CIR/HW+floor.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Properti dulu, model kemudian",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson: pilih model dari properti yang kamu butuhkan — bukan dari kemudahan rumusnya, bukan dari kecanggihannya, bukan dari apa yang dipakai tetangga. Properti yang ditanyakan sebelum memilih: apakah harus positif? apakah mean-reverting? apakah harus pas ke kurva kini? apakah ada lompatan? Setiap jawaban 'ya' mengeliminasi kandidat.",
        "Tiga pertanyaan yang diajukan praktisi senior sebelum memakai model stokastik untuk keputusan: (1) berapa persen skenario yang melanggar batas ekonomi — dan apakah keputusan berubah jika skenario mustahil itu dibuang? (2) apakah parameternya stabil saat direkalibrasi — atau melompat-lompat (overfitting)? (3) kapan model ini gagal — dan apakah kegagalan itu sudah tertulis sebagai batasan, bukan ditemukan saat krisis?",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan 'properti dulu, model kemudian' dengan contoh Vasicek vs CIR." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke model GARCH untuk VaR adaptif." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk model stokastik. Pertama, ingat hierarki pilihannya: saham → GBM (positif, sederhana); suku bunga → mean-reverting (CIR untuk simulasi non-negatif, Hull-White untuk pricing yang pas kurva); volatilitas → GARCH (clustering + mean-reversion); lompatan → jump-diffusion (Merton) untuk risiko jangka pendek/kredit/komoditas. Salah pilih = skenario mustahil (Vasicek −3% di negara tanpa rate negatif) atau risiko yang diremehkan (GBM tanpa jump untuk default). Kedua, waspadai dua asumsi GBM yang paling sering dilanggar data nyata: volatilitas konstan (ada volatility smile dan clustering) dan return normal (ekor tebal). Untuk aplikasi serius: GBM dengan σ dari GARCH/EWMA, atau vol stokastik penuh (Heston). Ketiga, kalibrasi bukan kebenaran: fit sempurna dengan parameter tidak stabil = overfitting — uji stabilitas rekalibrasi harian, dan bedakan kalibrasi historis (risiko) vs implisit (pricing). Keempat, Monte Carlo error vs model error: menambah skenario dari 10 ribu ke 1 juta hanya mengurangi noise simulasi — tidak memperbaiki model yang salah. Satu juta skenario dari model yang salah = jawaban sangat presisi untuk pertanyaan yang salah. Kelima, mean-reversion (κ) menentukan daya tahan guncangan: κ besar = karet kuat (rate jangka pendek yang dikontrol bank sentral), κ kecil = karet longgar (rate jangka panjang yang melayang) — salah κ = salah estimasi seberapa lama guncangan bertahan, fatal untuk skenario multi-tahun. Dan terakhir: semua model di lesson ini adalah mesin penghasil masa depan untuk Monte Carlo, CVA, dan stress test — kualitas seluruh bangunan risiko berdiri di atas mesin ini. Validasi mesinnya (uji properti, bukan cuma goodness-of-fit) sebelum percaya atapnya.",
      },
      reference: "Properti dulu (positif? mean-reverting? pas kurva? ada jump?), model kemudian. Uji stabilitas kalibrasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR16.",
      ],
      tasks: [],
      summary: [
        "GBM: dS = μS dt + σS dW — positif, log-normal, tidak mean-reverting; −½σ² = volatility drag.",
        "Suku bunga butuh mean-reversion: Vasicek (bisa negatif), CIR (non-negatif), Hull-White (pas ke kurva kini).",
        "κ = kekuatan karet gelang; salah κ = salah estimasi daya tahan guncangan.",
        "GARCH(1,1): ω dasar, α kaget, β ingatan; σ²_LR = ω/(1−α−β); α+β ≈ 0,97 = clustering kuat.",
        "EWMA = GARCH dengan ω=0, α=1−λ, β=λ (tanpa mean-reversion vol).",
        "Pilih model dari properti yang dibutuhkan — bukan dari kemudahan rumusnya.",
      ],
      next: { label: "MR16 — Regulasi FRTB", href: "/learn/mr16-regulasi-frtb" },
      quiz: [
        {
          q: "Dalam GBM, suku −½σ² dalam solusi eksak adalah?",
          options: [
            { text: "Kesalahan pembulatan", why: "ini suku matematis yang eksak, bukan error." },
            { text: "Koreksi Jensen (volatility drag): return median/geometrik lebih rendah dari ekspektasi aritmatika sebesar ½σ²", why: "volatilitas memakan pertumbuhan median — dua aset dengan μ sama, yang lebih volatil tumbuh lebih lambat.", correct: true },
            { text: "Biaya transaksi", why: "tidak ada biaya dalam model ini." },
            { text: "Pajak", why: "tidak ada pajak dalam model ini." },
          ],
        },
        {
          q: "Untuk simulasi suku bunga di negara yang tidak mungkin negatif, model tepat?",
          options: [
            { text: "Vasicek", why: "Vasicek mengizinkan negatif tanpa batas." },
            { text: "CIR — volatilitas proporsional √r mencegah penembusan nol; atau Hull-White dengan floor", why: "pilih model berdasarkan properti yang dibutuhkan.", correct: true },
            { text: "GBM", why: "GBM tidak mean-reverting — salah untuk suku bunga." },
            { text: "Random walk biasa", why: "tidak punya sifat yang dibutuhkan." },
          ],
        },
        {
          q: "Dalam GARCH(1,1), α + β = 0,97 berarti?",
          options: [
            { text: "Model salah", why: "ini nilai tipikal yang valid." },
            { text: "Persistensi volatilitas sangat tinggi — guncangan hari ini bergema berminggu-minggu", why: "α+β dekat 1 = ingatan panjang = formalisasi volatility clustering.", correct: true },
            { text: "Volatilitas konstan", why: "justru sebaliknya — volatilitas sangat persisten." },
            { text: "Tidak ada clustering", why: "justru clustering kuat." },
          ],
        },
        {
          q: "Hubungan EWMA (rata-rata bergerak eksponensial) dengan GARCH(1,1)?",
          options: [
            { text: "Tidak ada hubungan", why: "ada hubungan matematis langsung." },
            { text: "EWMA = GARCH(1,1) dengan ω=0, α=1−λ, β=λ — kasus khusus tanpa mean-reversion volatilitas", why: "EWMA adalah IGARCH (α+β=1) — tanpa level jangka panjang.", correct: true },
            { text: "EWMA lebih umum", why: "GARCH lebih umum." },
            { text: "GARCH tidak bisa dipakai untuk VaR", why: "GARCH dipakai untuk VaR adaptif/Filtered HS." },
          ],
        },
        {
          q: "Kelemahan fundamental memakai GBM dengan vol konstan untuk VaR ekuitas?",
          options: [
            { text: "Terlalu lambat", why: "justru cepat." },
            { text: "Mengabaikan volatility clustering & fat tail — VaR tidak adaptif dan meremehkan ekor", why: "praktik benar = GBM dengan σ dari GARCH/EWMA, atau vol stokastik penuh.", correct: true },
            { text: "Tidak bisa untuk saham", why: "bisa, hanya tidak sempurna." },
            { text: "Terlalu akurat", why: "masalahnya justru ketidakakuratannya." },
          ],
        },
        {
          q: "Desk memakai model jump-diffusion dengan 6 parameter untuk pricing opsi mingguan. Setelah rekalibrasi harian seminggu, parameter melompat-lompat liar. Kesimpulan?",
          options: [
            { text: "Modelnya bagus — fit-nya sempurna", why: "fit sempurna dengan parameter tidak stabil = overfitting." },
            { text: "Overfitting: terlalu banyak parameter yang tidak stabil — sederhanakan model atau kunci sebagian parameter, lalu uji stabilitas", why: "aturan praktisi: sedikit parameter yang stabil mengalahkan banyak parameter yang presisi tapi liar.", correct: true },
            { text: "Tambah parameter lagi", why: "justru kebalikannya." },
            { text: "Ganti ke GBM murni", why: "belum tentu — mungkin cukup menyederhanakan jump-nya." },
          ],
        },
      ],
    },
  ],
};

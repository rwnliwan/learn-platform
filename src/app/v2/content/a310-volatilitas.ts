import type { V2Lesson } from "../lib/types";

export const a310: V2Lesson = {
  slug: "a310-volatilitas",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.10 Volatilitas: Mengukur Badai Saat Laut Tenang",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-var-jebol",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "VaR yang lolos 250 hari, lalu gagal 12 kali sebulan",
      prose: [
        "Desk trading sebuah bank memakai VaR 99 persen berbasis volatilitas historis 1 tahun dengan bobot sama. Selama 250 hari perdagangan, VaR jebol 3 kali — sesuai teori (1 persen x 250 = 2,5). Model dinyatakan valid. Semua tenang.",
        "Lalu krisis mini datang. Dalam satu bulan, VaR jebol 12 kali. Bukan karena modelnya rusak kemarin — tapi karena volatilitas historis 1 tahun lambat merespons: ia masih ingat 11 bulan pasar tenang, sehingga VaR-nya kekecilan saat badai datang. Breach ke-12 memicu margin call berantai; desk rugi dua kuartal profit dalam 3 minggu.",
        "Data untuk VaR yang benar sudah ada — return-return besar minggu itu berteriak volatilitas naik. Tapi estimator bobot-sama tuli terhadap kabar terbaru: ia memberi bobot sama ke return kemarin dan return 11 bulan lalu. Lesson ini tentang estimator volatilitas yang mendengar: EWMA dan GARCH.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "VaR yang lambat merespons adalah VaR yang menipu tepat saat paling dibutuhkan. Breach yang bergerombol adalah gejala estimator tuli — bukan kesialan.",
      },
      reference: "Backtest breach: bergerombol = model tuli terhadap regime shift.",
    },
    {
      id: "tiga-fakta",
      eyebrow: "Langkah 2 · Tiga fakta volatilitas",
      title: "Clustering, mean-reversion, asimetri",
      prose: [
        "Satu, volatility clustering: volatilitas tinggi mengikuti volatilitas tinggi, dan tenang mengikuti tenang. Ini fakta paling robust di keuangan. Model statis meremehkan risiko tepat setelah guncangan — saat paling penting.",
        "Dua, mean-reversion: setelah melonjak, volatilitas cenderung meluruh kembali ke level normal jangka panjangnya. Tiga, asimetri (leverage effect): kabar buruk menaikkan volatilitas lebih dari kabar baik dengan besaran sama — umum di ekuitas.",
        "Implikasinya: volatilitas adalah sifat waktu, bukan sifat aset. Satu angka statis untuk sepanjang tahun adalah kebohongan yang rapi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira GARCH memprediksi return. GARCH memprediksi variansi bersyarat (seberapa lebar goyangan besok), bukan arah pergerakan harga.",
      },
      reference: "Clustering -> butuh model dinamis. Mean-reversion -> butuh jangkar jangka panjang.",
    },
    {
      id: "ewma",
      eyebrow: "Langkah 3 · EWMA",
      title: "EWMA: volatilitas yang bisa lupa",
      prose: [
        "EWMA (exponentially weighted moving average) memberi bobot yang meluruh eksponensial ke masa lalu. Kabar terbaru dapat bobot (1-lambda), sisanya untuk ingatan lama. Standar RiskMetrics memakai lambda = 0,94 untuk data harian.",
        "Contoh: lambda = 0,94, estimasi kemarin 4,0 (vol 2 persen), return hari ini -3 persen. Update: 0,94 x 4,0 + 0,06 x 9 = 4,30. Vol baru = akar 4,30 = 2,07 persen. Satu hari buruk mengangkat estimasi; besok, jika pasar tenang, ia meluruh kembali. Inilah ingatan yang bisa lupa.",
        "Naikkan lambda ke 0,98: ingatan lebih panjang, VaR lebih stabil tapi telat saat krisis. Turunkan ke 0,80: responsif tapi gelisah mengikuti noise. Itu tradeoff responsivitas vs stabilitas.",
      ],
      formula: String.raw`\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1-\lambda) r_{t-1}^2, \qquad \lambda = 0{,}94`,
      formulaNote: "sigma_t^2 variansi hari ini, r_{t-1} return kemarin, lambda kecepatan lupa.",
      tasks: [
        { id: "t1", text: "Hitung variansi baru `s2` dengan update EWMA" },
        { id: "t2", text: "Hitung `vol` = akar dari `s2`, dalam persen" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "s2=4.30 vol=2.07",
      note: {
        title: "Sering salah",
        body: "Memakai return dalam persen langsung tanpa konsisten satuan. Di sini return -3 persen dipakai sebagai -3,0 dan variansi dalam satuan persen-kuadrat — konsisten di kedua sisi rumus.",
      },
      hints: [
        "Rumus: s2 = lam*s2_prev + (1-lam)*r*r.",
        "Vol = akar kuadrat s2. Pakai **0.5.",
        "s2 = lam*s2_prev + (1-lam)*r**2",
      ],
      code: {
        starter: `import math\n\nlam = 0.94          # RiskMetrics harian\ns2_prev = 4.0       # estimasi kemarin (vol 2%)\nr = -3.0            # return hari ini, persen\n\n# TULIS KODEMU: update EWMA satu langkah\ns2 = \nvol = \n\nprint(f"s2={s2:.2f} vol={vol:.2f}")`,
        lockLines: 5,
        solution: `import math\n\nlam = 0.94          # RiskMetrics harian\ns2_prev = 4.0       # estimasi kemarin (vol 2%)\nr = -3.0            # return hari ini, persen\n\n# TULIS KODEMU: update EWMA satu langkah\ns2 = lam*s2_prev + (1-lam)*r**2\nvol = math.sqrt(s2)\n\nprint(f"s2={s2:.2f} vol={vol:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "s2", value: 4.30, tol: 0.01, label: "`s2` seharusnya 4.30", msg: "0,94 x 4,0 + 0,06 x 9 = 4,30. Cek bobot (1-lambda)-nya." },
          { kind: "equal", task: "t2", name: "vol", value: 2.07, tol: 0.02, label: "`vol` seharusnya 2.07", msg: "Vol = akar dari s2. Jangan lupa akarnya." },
          { kind: "stdout_matches", task: "t3", pattern: "s2=4\\.30\\s+vol=2\\.07", label: "`print` menampilkan update", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "EWMA = GARCH dengan omega=0: tanpa jangkar jangka panjang.",
    },
    {
      id: "garch",
      eyebrow: "Langkah 4 · GARCH",
      title: "GARCH(1,1): standar industri dengan jangkar",
      prose: [
        "GARCH(1,1) menambahkan konstanta omega ke EWMA: variansi hari ini = omega + alpha x shock kemarin + beta x variansi kemarin. Omega memberi jangkar: level variansi jangka panjang (unconditional) = omega / (1 - alpha - beta), dengan syarat alpha + beta < 1.",
        "Kecepatan kembali ke jangkar diukur half-life = ln(0,5) / ln(alpha+beta). Jika alpha + beta = 0,97, half-life sekitar 22,8 hari — guncangan diingat berminggu-minggu. Mendekati 1 berarti shock nyaris permanen, umum saat krisis.",
        "Forecast h langkah meluruh eksponensial menuju level jangka panjang. Inilah keunggulan GARCH atas EWMA: EWMA tanpa omega membuat forecast jangka jauh meluruh ke nol — tidak realistis.",
      ],
      formula: String.raw`\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta \sigma_{t-1}^2, \qquad \bar{\sigma}^2 = \frac{\omega}{1-\alpha-\beta}`,
      formulaNote: "omega konstanta, alpha respons ke shock, beta keawetan ingatan, sigma-bar level jangka panjang.",
      tasks: [
        { id: "t1", text: "Hitung `s2bar` (variansi jangka panjang)" },
        { id: "t2", text: "Hitung `hl` (half-life, hari) dan forecast 2 langkah `f2`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "s2bar=0.6667 hl=22.8 f2=1.9600",
      note: {
        title: "Sering salah",
        body: "Memakai EWMA untuk forecast 30 hari. Tanpa omega, forecast EWMA meluruh ke nol. Untuk horizon jauh, pakai GARCH yang berjangkar di level jangka panjang.",
      },
      hints: [
        "s2bar = om / (1 - al - be).",
        "Half-life = ln(0.5)/ln(al+be). Forecast: s2bar + (al+be)*(s2_t1 - s2bar).",
        "import math sudah tersedia untuk log.",
      ],
      code: {
        starter: `import math\n\nom, al, be = 0.02, 0.07, 0.90   # parameter GARCH(1,1)\ns2_t1 = 2.0                     # variansi bersyarat besok (sedang tinggi)\n\n# TULIS KODEMU\ns2bar = \nhl = \nf2 = \n\nprint(f"s2bar={s2bar:.4f} hl={hl:.1f} f2={f2:.4f}")`,
        lockLines: 4,
        solution: `import math\n\nom, al, be = 0.02, 0.07, 0.90   # parameter GARCH(1,1)\ns2_t1 = 2.0                     # variansi bersyarat besok (sedang tinggi)\n\n# TULIS KODEMU\ns2bar = om/(1-al-be)\nhl = math.log(0.5)/math.log(al+be)\nf2 = s2bar + (al+be)*(s2_t1 - s2bar)\n\nprint(f"s2bar={s2bar:.4f} hl={hl:.1f} f2={f2:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "s2bar", value: 0.6667, tol: 0.002, label: "`s2bar` sekitar 0.6667", msg: "0,02 / (1 - 0,07 - 0,90) = 0,667. Cek penyebutnya." },
          { kind: "equal", task: "t2", name: "hl", value: 22.8, tol: 0.2, label: "`hl` sekitar 22.8 hari", msg: "ln(0,5)/ln(0,97). Gunakan math.log (log natural)." },
          { kind: "equal", task: "t2", name: "f2", value: 1.96, tol: 0.01, label: "`f2` sekitar 1.96", msg: "Forecast 2 langkah sudah meluruh sebagian menuju 0,667 dari 2,0." },
          { kind: "stdout_matches", task: "t3", pattern: "s2bar=0\\.6667\\s+hl=22\\.8\\s+f2=1\\.9600", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Forecast: E[s2_{t+h}] = s2bar + (a+b)^(h-1) x (s2_{t+1} - s2bar).",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kenapa EWMA (omega=0) tidak cocok untuk forecast volatilitas 30 hari?",
          options: [
            { text: "Terlalu lambat merespons", why: "Salah. EWMA justru responsif; masalahnya di horizon jauh." },
            { text: "Tanpa omega, forecast meluruh ke nol — tidak realistis. GARCH punya unconditional variance sebagai jangkar", why: "Benar. EWMA = GARCH dengan omega=0, tanpa mean-reversion ke level wajar.", correct: true },
            { text: "EWMA hanya untuk return, bukan volatilitas", why: "Salah. EWMA memang estimator volatilitas." },
            { text: "Tidak ada alasan, EWMA cocok saja", why: "Salah. Forecast jangka jauh EWMA ambruk ke nol." },
          ],
        },
        {
          q: "Lambda EWMA dinaikkan 0,94 menjadi 0,98. Efeknya?",
          options: [
            { text: "Lebih responsif terhadap guncangan", why: "Salah. Itu efek menurunkan lambda." },
            { text: "Lebih lambat dan stabil — ingatan lebih panjang, VaR kurang berisik tapi telat saat krisis", why: "Benar. Lambda lebih besar = bobot masa lalu lebih awet = adaptasi lebih lambat.", correct: true },
            { text: "Tidak ada efek", why: "Salah. Lambda mengendalikan kecepatan lupa." },
            { text: "Volatilitas menjadi nol", why: "Salah. Tidak ada hubungan seperti itu." },
          ],
        },
      ],
      reference: "Lambda = kecepatan lupa. Omega = jangkar jangka panjang.",
    },
    {
      id: "var-es",
      eyebrow: "Langkah 6 · VaR dan Expected Shortfall",
      title: "VaR adalah ambang, bukan maksimum",
      prose: [
        "Dengan forecast volatilitas sigma, VaR 99 persen = 2,33 x sigma x posisi. VaR Rp1 M artinya ada 1 persen peluang rugi melebihi Rp1 M — bukan rugi maksimal Rp1 M. VaR tidak mengatakan seberapa besar kelebihannya.",
        "Itu tugas Expected Shortfall: rata-rata kerugian dengan syarat kerugian melebihi VaR. ES menjawab seberapa buruk saat keadaan buruk — alasan Basel beralih ke ES untuk market risk.",
        "Return keuangan berekor tebal: kejadian ekstrem lebih sering dari prediksi normal. Kuantil normal 2,33 terlalu pendek sehingga breach lebih sering dari 1 persen. Praktik industri: GARCH untuk dinamika, kuantil t-student atau empiris untuk bentuk ekor (filtered historical simulation).",
      ],
      formula: String.raw`VaR_{\alpha} = z_{\alpha} \cdot \sigma_{t+1} \cdot \text{posisi}, \qquad ES_{\alpha} = E[L \mid L > VaR_{\alpha}]`,
      formulaNote: "VaR_alpha = ambang kerugian pada level confidence alpha; z_alpha = kuantil distribusi normal standar (2,33 untuk 99 persen); sigma_{t+1} = forecast volatilitas satu langkah ke depan; posisi = nilai eksposur; ES_alpha = ekspektasi kerugian dengan syarat kerugian melebihi VaR_alpha.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "VaR berbasis kuantil normal di return berekor tebal meremehkan risiko ekor secara sistematis. Modal yang dihitung dari situ kekecilan — bank undercapitalized tanpa sadar.",
      },
      reference: "VaR = kuantil. ES = rata-rata di luar kuantil. Ekor tebal -> tinggalkan kuantil normal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Estimator volatilitas mana?",
      prose: [
        "Satu, butuh cepat tanpa estimasi untuk VaR harian operasional: EWMA lambda=0,94 — tanpa parameter yang diestimasi, responsif, standar RiskMetrics yang dikenal regulator. Dua, butuh forecast multi-hari dan level jangka panjang: GARCH(1,1) — punya unconditional variance dan half-life untuk proyeksi VaR 10 hari atau stress testing.",
        "Tiga, asimetri kuat (kabar buruk lebih berpengaruh dari kabar baik): GJR-GARCH atau EGARCH — GARCH standar simetris dan meremehkan volatilitas setelah crash. Empat, butuh ES yang jujur di ekor tebal untuk perhitungan modal: GARCH untuk dinamika ditambah kuantil t atau empiris untuk bentuk ekor.",
        "Aturan 10 detik: volatilitas adalah sifat waktu, bukan sifat aset. Operasional harian pakai EWMA; horizon jauh pakai GARCH. VaR adalah ambang, bukan maksimum; ES mengukur seberapa buruk saat buruk. Backtest breach-mu: bergerombol berarti model tuli.",
      ],
      tasks: [],
      reference: "Harian -> EWMA. Horizon jauh -> GARCH. Asimetri -> GJR/EGARCH. Modal -> GARCH + ekor t/empiris.",
      note: {
        title: "Intuisi: volatilitas itu cuaca, bukan iklim",
        body: "Lima heuristik yang tidak tertulis di manual RiskMetrics. Satu: volatilitas tanpa horizon tidak bermakna — 2 persen per hari dan 2 persen per bulan adalah dua dunia berbeda; selalu tanya “untuk berapa hari ke depan” sebelum membandingkan dua angka, karena VaR 1-hari dan VaR 10-hari memakai prakiraan yang berbeda. Dua: lambda adalah seberapa jauh kamu menatap spion — lambda 0,98 memberi VaR yang tenang dan stabil, tetapi stabilitas itu dibayar dengan keterlambatan saat regime berganti; breach yang bergerombol hampir selalu berarti lambdamu terlalu tinggi untuk kondisi pasar saat itu, bukan pasarnya yang anomali. Tiga: jumlah alpha tambah beta adalah ukuran kedengkian pasar — mendekati 1 berarti guncangan hari ini masih menghantui forecast berminggu-minggu; bila half-life melebihi horizon laporanmu, forecast-mu masih didominasi masa lalu, bukan informasi baru. Empat: saat volatilitas naik dua kali lipat, VaR naik dua kali lipat tetapi expected shortfall naik lebih dari dua kali lipat — ekor distribusi menebal lebih cepat dari badannya, sehingga bank yang hanya memantau VaR selalu kaget duluan. Lima: curigai setiap angka volatilitas yang tidak berubah saat pasar berubah — estimator yang sehat gelisah mengikuti kabar terbaru; yang tenang-tenang saja biasanya tuli.",
      },
    },
    {
      id: "mini-case-limit",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Limit trading berbasis GARCH",
      prose: [
        "Desk forex bank punya limit VaR 99 persen 1-hari = Rp5 M. Model saat ini: volatilitas = SD 1 tahun (bobot sama) = 0,8 persen per hari. Posisi: Rp270 M. VaR menurut model lama = 2,33 x 0,8 persen x 270M = Rp5,03 M — masih di bawah limit, aman menurut laporan.",
        "Tapi GARCH yang mendengar 3 hari terakhir mengestimasi volatilitas kondisional 1,9 persen per hari. VaR_GARCH = 2,33 x 1,9 persen x 270M = Rp11,95 M — sudah 2,4 kali lipat limit. Model lama bilang aman karena tuli terhadap kabar terbaru.",
        "Agar VaR kembali ke Rp5 M, posisi harus dipotong: posisi maks = 5M / (2,33 x 1,9 persen) = Rp113 M. Limit statis plus volatilitas statis itu procyclical: longgar saat seharusnya ketat (badai) dan ketat saat seharusnya longgar (tenang). GARCH membuat limit countercyclical: mengencang otomatis saat badai.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Limit statis memperparah krisis: ia membiarkan posisi besar tepat saat volatilitas meledak. Limit dinamis berbasis volatilitas kondisional memaksa deleveraging otomatis saat badai.",
      },
      reference: "Posisi maks = limit / (z x sigma_kondisional).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Volatilitas punya tiga fakta: clustering, mean-reversion, asimetri. Ia sifat waktu, bukan sifat aset.",
        "EWMA (lambda=0,94) responsif dan tanpa estimasi — cocok untuk operasional harian, tidak untuk forecast jauh.",
        "GARCH(1,1) punya jangkar jangka panjang omega/(1-alpha-beta) dan half-life — cocok untuk horizon multi-hari.",
        "VaR adalah ambang (bukan maksimum); ES mengukur seberapa buruk saat jebol.",
        "Ekor tebal: tinggalkan kuantil normal, pakai kuantil t atau empiris. Breach bergerombol = estimator tuli.",
      ],
      next: { label: "A3.11 — PCA & Clustering", href: "/learn/a311-pca-clustering" },
      quiz: [
        {
          q: "VaR 99 persen jebol 12 kali dalam sebulan (ekspektasi sekitar 2 kali). Diagnosis?",
          options: [
            { text: "Normal — 1 persen dari 250 hari", why: "Salah. 12 breach sebulan bukan sial, itu pola." },
            { text: "Breach bergerombol = volatilitas tidak tertangkap; ganti ke EWMA/GARCH yang responsif", why: "Benar. Estimator bobot-sama lambat merespons regime shift.", correct: true },
            { text: "Naikkan confidence ke 99,9 persen", why: "Salah. Mengubah ambang tidak memperbaiki estimator yang tuli." },
            { text: "Kurangi posisi secara acak", why: "Salah. Tanpa diagnosis, itu menebak." },
          ],
        },
        {
          q: "Dalam GARCH(1,1), alpha + beta = 0,98. Artinya?",
          options: [
            { text: "Model salah spesifikasi", why: "Salah. Nilai di bawah 1 masih valid." },
            { text: "Persistence sangat tinggi — guncangan diingat lama (half-life sekitar 34 hari); forecast meluruh lambat", why: "Benar. Half-life = ln(0,5)/ln(0,98) = 34 hari. Pasar pendendam.", correct: true },
            { text: "Volatilitas konstan", why: "Salah. Justru sangat persisten berubahnya." },
            { text: "Alpha tidak penting", why: "Salah. Alpha mengukur respons terhadap shock baru." },
          ],
        },
        {
          q: "VaR 99 persen = Rp1 M. Pernyataan yang tepat?",
          options: [
            { text: "Rugi maksimal Rp1 M", why: "Salah. VaR bukan maksimum." },
            { text: "Ada 1 persen peluang rugi melebihi Rp1 M; VaR tidak mengatakan seberapa besar kelebihannya — itu tugas Expected Shortfall", why: "Benar. VaR = kuantil, bukan batas atas.", correct: true },
            { text: "Rugi pasti Rp1 M", why: "Salah. VaR adalah ambang probabilitas." },
            { text: "Model 99 persen akurat", why: "Salah. 99 persen adalah level confidence, bukan akurasi model." },
          ],
        },
        {
          q: "Return berekor tebal, VaR dihitung dengan kuantil normal 2,33. Risikonya?",
          options: [
            { text: "Tidak ada — normal selalu cukup", why: "Salah. Ekor tebal justru kasus di mana normal gagal." },
            { text: "Meremehkan risiko ekor: breach lebih sering dari 1 persen. Pakai kuantil t-student atau empiris", why: "Benar. Kuantil normal 2,33 terlalu pendek untuk ekor tebal.", correct: true },
            { text: "Melebihkan risiko", why: "Salah. Arahnya meremehkan, bukan melebihkan." },
            { text: "VaR menjadi negatif", why: "Salah. Tidak ada hubungan seperti itu." },
          ],
        },
      ],
    },
  ],
};

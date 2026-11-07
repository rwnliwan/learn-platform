import type { V2Lesson } from "../lib/types";

export const pma2b: V2Lesson = {
  slug: "pm-a2b-quant-lanjut",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A2B Quant Lanjut: Distribusi, Uji Hipotesis & Regresi",
  estMinutes: 60,
  steps: [
    {
      id: "distribusi-keuangan",
      eyebrow: "Langkah 1 · Distribusi",
      title: "Normal, lognormal, atau t: pilih distribusi sesuai datanya",
      prose: [
        "PM-A2 mengajarkan time value of money, pengujian z, dan regresi dasar. Lesson ini melangkah lebih jauh: dari mana angka-angka itu berasal, distribusi apa yang layak dipakai untuk return keuangan, dan kapan sebuah klaim statistik boleh dipercaya.",
        "Distribusi normal adalah titik awal yang nyaman: simetris, ditentukan sepenuhnya oleh mean dan simpangan baku, dan mudah dipakai untuk interval kepercayaan. Masalahnya: return keuangan jarang normal. Harga saham tidak bisa negatif, tetapi distribusi normal mengizinkan nilai negatif sejauh apa pun — dan return keuangan memiliki ekor yang lebih gemuk dari prediksi normal.",
        "Distribusi lognormal memperbaiki satu hal: bila log harga berdistribusi normal, maka harga itu sendiri berdistribusi lognormal dan tidak pernah negatif — cocok untuk memodelkan harga saham. Distribusi t Student memperbaiki hal lain: ekornya lebih gemuk, sehingga ia lebih jujur tentang peluang kejadian ekstrem. Aturan praktisnya: harga memakai lognormal, return memakai t bila sampelnya kecil atau ekornya gemuk, dan normal hanya sebagai pendekatan saat sampel besar dan ekornya tipis. Memilih distribusi yang salah bukan kesalahan teknis kecil — ia meremehkan risiko kejadian ekstrem, persis risiko yang paling mahal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai distribusi normal untuk return karena rumusnya mudah, lalu terkejut saat kerugian 5 sigma terjadi dua kali dalam satu dekade. Di pasar, ekor gemuk adalah aturan, bukan pengecualian.",
      },
      reference: "Harga: lognormal. Return berekor gemuk atau sampel kecil: t. Normal: pendekatan, bukan hukum alam.",
    },
    {
      id: "skewness-kurtosis",
      eyebrow: "Langkah 2 · Skewness & Kurtosis",
      title: "Return yang miring dan berekor: membaca bentuk distribusi",
      prose: [
        "Mean dan simpangan baku tidak cukup menggambarkan return. Skewness mengukur kemiringan: skewness negatif berarti ekor kiri lebih panjang — kerugian besar lebih mungkin daripada keuntungan besar yang setara. Strategi yang menjual asuransi pasar, misalnya, memiliki skewness negatif yang dalam: untung kecil yang sering, rugi besar yang jarang — dan satu rugi besar itu menghapus tahun-tahun keuntungan.",
        "Kurtosis mengukur ketebalan ekor dan ketajaman puncak: kurtosis berlebih (excess kurtosis positif) berarti kejadian ekstrem lebih sering dari prediksi normal. Return saham umumnya memiliki excess kurtosis positif — itulah sebabnya model normal meremehkan Value at Risk. Analis yang hanya melaporkan mean dan standar deviasi menyembunyikan dua hal yang paling penting bagi manajemen risiko: seberapa miring dan seberapa berekor distribusinya.",
        "Implikasi praktisnya langsung: dua strategi dengan mean dan standar deviasi yang sama bisa memiliki profil risiko yang sangat berbeda. Strategi A simetris dan berekor tipis; strategi B miring negatif dan berekor gemuk. Investor yang hanya membandingkan Sharpe ratio akan menilai keduanya setara — padahal B membawa risiko bencana yang tidak terlihat di dua momen pertama. Selalu minta skewness dan kurtosis sebelum mempercayai sebuah Sharpe ratio.",
      ],
      formula: String.raw`\text{Skewness} < 0 \Rightarrow \text{ekor kiri panjang} \quad;\quad \text{Excess kurtosis} > 0 \Rightarrow \text{ekor lebih gemuk dari normal}`,
      formulaNote: "Skewness negatif berarti distribusi miring ke kiri: kerugian ekstrem lebih mungkin daripada keuntungan ekstrem yang setara. Excess kurtosis positif berarti kejadian ekstrem lebih sering dari prediksi normal. Interpretasi: keduanya adalah peringatan bahwa mean dan simpangan baku saja meremehkan risiko — Value at Risk berbasis normal akan terlalu kecil.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Strategi dengan skewness negatif yang dalam adalah bom waktu: Sharpe ratio-nya terlihat bagus selama bertahun-tahun, sampai satu kejadian ekor menghapus semuanya. Cek skewness sebelum memuji Sharpe.",
      },
      quiz: [
        {
          q: "Dua strategi memiliki mean dan standar deviasi return yang sama. Strategi B memiliki skewness negatif dan excess kurtosis positif, A tidak. Penilaianmu?",
          options: [
            { text: "Keduanya sama berisiko — mean dan standar deviasi sudah cukup", why: "Salah: dua momen pertama menyembunyikan kemiringan dan ketebalan ekor — justru di situlah risiko bencana bersembunyi." },
            { text: "B lebih berisiko — kerugian ekstrem lebih mungkin dan lebih sering dari prediksi normal", why: "Benar: skewness negatif berarti ekor kiri panjang; excess kurtosis positif berarti kejadian ekstrem lebih sering.", correct: true },
            { text: "A lebih berisiko — simetris berarti tidak ada pelindung", why: "Salah: simetri dan ekor tipis justru berarti risiko ekstremnya lebih kecil dari B." },
            { text: "Tidak bisa dinilai tanpa Sharpe ratio", why: "Salah: Sharpe ratio memakai mean dan standar deviasi saja — ia buta terhadap skewness dan kurtosis." },
          ],
        },
      ],
      reference: "Skewness negatif = ekor kiri panjang. Excess kurtosis positif = ekor gemuk. Keduanya meremehkan VaR normal.",
    },
    {
      id: "uji-hipotesis-lanjut",
      eyebrow: "Langkah 3 · Lab: Uji Hipotesis Lanjut",
      title: "Dari z ke t: menguji klaim dengan sampel yang jujur",
      prose: [
        "PM-A2 menguji klaim manajer dengan z-stat: sampel n = 100, mean 0,8 persen, standar deviasi 5 persen, z = 1,60 — gagal tolak hipotesis nol. Uji itu memakai z karena standar deviasi populasi diasumsikan diketahui. Dalam praktik, standar deviasi populasi hampir tidak pernah diketahui — kita mengestimasinya dari sampel, dan estimasi itu menambah ketidakpastian. Di situlah t-stat mengambil alih: rumusnya sama, tetapi nilai kritisnya diambil dari distribusi t dengan derajat kebebasan n dikurangi 1, yang lebih lebar saat sampel kecil.",
        "Kerangka ujinya tetap sama dan wajib dihafal: tentukan H0 dan H1, tetapkan tingkat signifikansi alpha, hitung statistik uji, bandingkan dengan nilai kritis atau p-value, lalu simpulkan. Yang berubah di lesson ini adalah pemahaman tentang dua kesalahan. Type I error adalah false alarm — menolak H0 yang sebenarnya benar — dan peluangnya adalah alpha yang kamu tetapkan. Type II error adalah miss — gagal menolak H0 yang sebenarnya salah — dan peluangnya adalah beta. Power adalah 1 dikurangi beta: peluang mendeteksi efek yang benar-benar ada.",
        "Contoh ilustratif baru: seorang analis mengklaim strateginya menghasilkan mean return 0,9 persen per bulan. Sampel 144 bulan, standar deviasi sampel 6 persen. Standard error adalah 6 dibagi akar 144 = 0,5 persen. Statistik t adalah 0,9 dibagi 0,5 = 1,8. Dengan derajat kebebasan 143, nilai kritis dua sisi pada alpha 5 persen sekitar 1,98 — sehingga 1,8 belum cukup untuk menolak H0. Klaimnya belum terbukti, meski angkanya terlihat meyakinkan. Hitung sendiri di lab.",
      ],
      formula: String.raw`t = \frac{\bar{x}-\mu_0}{s/\sqrt{n}} \quad;\quad \text{tolak } H_0 \text{ jika } |t| > t_{\text{kritis}} \ (df = n-1)`,
      formulaNote: "Mean sampel 0,9 persen, hipotesis nol 0 persen, standar deviasi sampel 6 persen, n = 144 (ilustratif). Interpretasi: t = 1,8 berarti mean sampel 1,8 standard error di atas nol — di bawah nilai kritis sekitar 1,98, sehingga bukti belum cukup pada alpha 5 persen. Contoh angka: SE = 6 dibagi 12 = 0,5; t = 0,9 dibagi 0,5 = 1,8.",
      tasks: [
        { id: "t1", text: "Hitung `se` (standard error: s dibagi akar n)" },
        { id: "t2", text: "Hitung `tstat` (mean dibagi se), cetak keduanya" },
      ],
      expected: "se=0.5  tstat=1.8",
      hints: [
        "Standard error = s dibagi akar n; akar 144 adalah 12.",
        "Statistik t = mean dibagi standard error.",
        "se = s / n**0.5\ntstat = mean / se",
      ],
      code: {
        starter: `n, mean, s = 144, 0.9, 6.0\n\n# TULIS KODEMU\nse = \ntstat = \n\nprint(f"se={se}  tstat={tstat}")`,
        lockLines: 1,
        solution: `n, mean, s = 144, 0.9, 6.0\n\n# TULIS KODEMU\nse = s / n**0.5\ntstat = mean / se\n\nprint(f"se={se}  tstat={tstat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.5, tol: 1e-9, label: "`se` seharusnya 0.5", msg: "SE = 6 dibagi akar 144 = 6 dibagi 12 = 0,5." },
          { kind: "equal", task: "t2", name: "tstat", value: 1.8, tol: 1e-9, label: "`tstat` seharusnya 1.8", msg: "t = 0,9 dibagi 0,5 = 1,8 — di bawah kritis 1,98, gagal tolak H0." },
          { kind: "stdout_matches", task: "t2", pattern: "se=0\\.5\\s+tstat=1\\.8", label: "`print` menampilkan keduanya", msg: "Format: se=...  tstat=... ." },
        ],
      },
      reference: "t = (mean dikurangi nol) dibagi SE; df = n dikurangi 1. Type I = false alarm; Type II = miss; power = 1 dikurangi beta.",
    },
    {
      id: "interval-kepercayaan",
      eyebrow: "Langkah 4 · Interval Kepercayaan",
      title: "Signifikan secara statistik belum tentu penting secara praktis",
      prose: [
        "Interval kepercayaan 95 persen untuk mean return adalah mean sampel ditambah dan dikurangi sekitar 1,96 standard error (dengan t kritis bila sampel kecil). Contoh ilustratif: mean 0,9 persen dengan SE 0,5 persen menghasilkan interval 0,9 ditambah dan dikurangi 0,98 — yaitu dari negatif 0,08 persen sampai 1,88 persen. Interval ini mencakup nol, sehingga konsisten dengan kesimpulan uji hipotesis: belum cukup bukti mean-nya positif.",
        "Interpretasi yang benar: bila eksperimen yang sama diulang berkali-kali, 95 persen dari interval-interval yang dihasilkan akan mencakup mean populasi yang sebenarnya. Interpretasi yang salah — dan sangat umum — adalah ada peluang 95 persen mean sebenarnya berada dalam interval ini. Interval yang sudah dihitung tidak lagi mengandung peluang; mean populasi adalah angka tetap, intervalnya yang bervariasi antar sampel.",
        "Pembedaan terpenting di langkah ini adalah signifikansi statistik versus signifikansi praktis. Dengan sampel 100.000 observasi, efek 0,01 persen bisa signifikan secara statistik — tetapi tidak ada investor yang peduli dengan 0,01 persen. Sebaliknya, efek 2 persen yang tidak signifikan karena sampelnya hanya 12 observasi bisa sangat penting secara ekonomi. Selalu tanyakan dua hal: apakah intervalnya mengecualikan nol, dan apakah besar efeknya berarti sesuatu dalam rupiah?",
      ],
      formula: String.raw`CI_{95\%} = \bar{x} \pm t_{\text{kritis}} \times SE`,
      formulaNote: "Mean 0,9 persen, SE 0,5 persen, t kritis sekitar 1,96 (ilustratif). Interpretasi: interval dari negatif 0,08 persen sampai 1,88 persen mencakup nol — konsisten dengan gagal tolak H0. Contoh angka: 0,9 dikurangi 0,98 = negatif 0,08; 0,9 ditambah 0,98 = 1,88.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca interval kepercayaan sebagai peluang 95 persen. Yang benar: 95 persen adalah sifat prosedurnya dalam pengulangan, bukan peluang tentang interval yang sudah dihitung.",
      },
      quiz: [
        {
          q: "Interval kepercayaan 95 persen untuk mean return adalah dari negatif 0,08 persen sampai 1,88 persen. Kesimpulan yang benar?",
          options: [
            { text: "Ada peluang 95 persen mean sebenarnya ada di dalam interval ini", why: "Salah: itu interpretasi yang umum tetapi keliru — mean populasi tetap, interval yang bervariasi antar sampel." },
            { text: "Interval mencakup nol, konsisten dengan gagal tolak H0; dan lebarnya menunjukkan estimasi masih tidak presisi", why: "Benar: mencakup nol berarti belum cukup bukti mean positif; lebar hampir 2 poin berarti ketidakpastiannya besar.", correct: true },
            { text: "Mean return pasti negatif", why: "Salah: interval mencakup nilai positif sampai 1,88 persen — data tidak membuktikan mean negatif." },
            { text: "Strateginya terbukti menguntungkan", why: "Salah: interval mencakup nol dan nilai negatif — keuntungan belum terbukti." },
          ],
        },
      ],
      reference: "CI = mean ditambah dan dikurangi t kritis dikali SE. Signifikan statistik bukan sama dengan penting secara praktis.",
    },
    {
      id: "regresi-ols-lanjut",
      eyebrow: "Langkah 5 · Lab: Regresi OLS",
      title: "Menghitung slope dengan tangan: lima titik, satu garis",
      prose: [
        "PM-A2 memperkenalkan regresi: slope adalah beta, R kuadrat adalah explanatory power. Lesson ini membuka mesinnya. OLS memilih garis yang meminimalkan jumlah kuadrat residual — selisih antara nilai aktual dan nilai prediksi garis. Slope dihitung dari kovarians x dan y dibagi varians x; intercept memastikan garis melewati titik rata-rata.",
        "Contoh ilustratif dengan lima titik: x adalah 1, 2, 3, 4, 5 dan y adalah 2, 4, 5, 4, 5. Rata-rata x adalah 3, rata-rata y adalah 4. Pembilang slope adalah jumlah dari (x dikurangi 3) dikali (y dikurangi 4): (-2 dikali -2) ditambah (-1 dikali 0) ditambah (0 dikali 1) ditambah (1 dikali 0) ditambah (2 dikali 1) = 4 ditambah 0 ditambah 0 ditambah 0 ditambah 2 = 6. Penyebutnya adalah jumlah (x dikurangi 3) kuadrat: 4 ditambah 1 ditambah 0 ditambah 1 ditambah 4 = 10. Slope adalah 6 dibagi 10 = 0,6; intercept adalah 4 dikurangi 0,6 dikali 3 = 2,2. Garisnya: y topi = 2,2 ditambah 0,6x.",
        "R kuadrat dari garis ini adalah 0,60 — 60 persen variasi y dijelaskan oleh x. Artinya 40 persen sisanya adalah residual: bagian yang tidak dijelaskan model. Di pasar modal, residual inilah yang disebut risiko idiosinkratis — bagian yang bisa didiversifikasi — sedangkan bagian yang dijelaskan adalah risiko sistematis yang tidak bisa dihilangkan.",
      ],
      formula: String.raw`\hat{y} = b_0 + b_1 x \quad;\quad b_1 = \frac{\sum (x-\bar{x})(y-\bar{y})}{\sum (x-\bar{x})^2} \quad;\quad b_0 = \bar{y} - b_1 \bar{x}`,
      formulaNote: "Lima titik ilustratif: x = 1, 2, 3, 4, 5 dan y = 2, 4, 5, 4, 5. Interpretasi: slope 0,6 berarti setiap kenaikan 1 satuan x dikaitkan dengan kenaikan 0,6 satuan y; intercept 2,2 adalah prediksi y saat x nol. Contoh angka: pembilang 6, penyebut 10, slope 0,6, intercept 4 dikurangi 1,8 = 2,2; R kuadrat 0,60.",
      tasks: [
        { id: "t1", text: "Hitung `slope` dari 5 titik (kovarians dibagi varians x)" },
        { id: "t2", text: "Hitung `intercept` (rata-rata y dikurangi slope dikali rata-rata x), cetak keduanya" },
      ],
      expected: "slope=0.60  intercept=2.20",
      hints: [
        "Rata-rata x = 3, rata-rata y = 4.",
        "Slope = jumlah (x-3)(y-4) dibagi jumlah (x-3) kuadrat.",
        "slope = 6 / 10\nintercept = 4 - slope * 3",
      ],
      code: {
        starter: `# Titik ilustratif: x = [1,2,3,4,5], y = [2,4,5,4,5]\n# Pembilang = 6, penyebut = 10 (dihitung di teks)\n\n# TULIS KODEMU\nslope = \nintercept = \n\nprint(f"slope={slope:.2f}  intercept={intercept:.2f}")`,
        lockLines: 2,
        solution: `# Titik ilustratif: x = [1,2,3,4,5], y = [2,4,5,4,5]\n# Pembilang = 6, penyebut = 10 (dihitung di teks)\n\n# TULIS KODEMU\nslope = 6 / 10\nintercept = 4 - slope * 3\n\nprint(f"slope={slope:.2f}  intercept={intercept:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "slope", value: 0.6, tol: 1e-9, label: "`slope` seharusnya 0.6", msg: "Pembilang 6 dibagi penyebut 10 = 0,6." },
          { kind: "equal", task: "t2", name: "intercept", value: 2.2, tol: 1e-9, label: "`intercept` seharusnya 2.2", msg: "4 dikurangi 0,6 dikali 3 = 2,2." },
          { kind: "stdout_matches", task: "t2", pattern: "slope=0\\.60\\s+intercept=2\\.20", label: "`print` menampilkan keduanya", msg: "Format: slope=...  intercept=... ." },
        ],
      },
      reference: "Slope = kovarians dibagi varians x. Intercept membuat garis melewati titik rata-rata. R kuadrat = porsi variasi yang dijelaskan.",
    },
    {
      id: "asumsi-regresi",
      eyebrow: "Langkah 6 · Asumsi Regresi",
      title: "Saat asumsi rusak, kesimpulan ikut rusak",
      prose: [
        "OLS memberikan estimasi terbaik hanya bila asumsinya terpenuhi. Empat asumsi yang paling sering dilanggar dalam data keuangan: linearitas, homoskedastisitas, independensi residual, dan tidak adanya multikolinearitas ekstrem. Pelanggaran tidak membuat slope menjadi salah arah secara otomatis — tetapi membuat standar error, uji t, dan interval kepercayaan tidak bisa dipercaya.",
        "Heteroskedastisitas berarti varians residual tidak konstan — misalnya residual return saham kecil jauh lebih menyebar daripada saham besar. Akibatnya standar error OLS menjadi bias: uji t bisa menyatakan signifikan padahal tidak, atau sebaliknya. Deteksinya sederhana: plot residual terhadap nilai prediksi — bila menyebar membentuk corong, heteroskedastisitas hadir. Perbaikannya memakai standar error yang robust.",
        "Autokorelasi berarti residual hari ini berkorelasi dengan residual kemarin — sangat umum pada data deret waktu keuangan. Akibatnya standar error diremehkan dan uji t terlihat terlalu bagus: manajer yang mengklaim alpha signifikan dari data harian yang autokorelasi bisa jadi hanya mengulang satu temuan berkali-kali. Multikolinearitas — dua variabel penjelas yang hampir sama — membuat slope masing-masing tidak stabil: sedikit perubahan data membalik tandanya. Dalam semua kasus, aturan praktisnya sama: periksa residual sebelum mempercayai uji t.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Klaim alpha dengan t-stat 3,0 dari data harian tanpa koreksi autokorelasi patut dicurigai: standar error yang diremehkan membuat t-stat mengembang. Minta standar error robust sebelum percaya.",
      },
      quiz: [
        {
          q: "Residual regresi membentuk pola corong saat di-plot terhadap nilai prediksi. Apa artinya dan apa akibatnya?",
          options: [
            { text: "Heteroskedastisitas — standar error OLS tidak bisa dipercaya", why: "Benar: varians residual tidak konstan; uji t dan interval kepercayaan menjadi menyesatkan meski slope-nya tetap tidak bias.", correct: true },
            { text: "Autokorelasi — residual berkorelasi antar waktu", why: "Salah: autokorelasi terlihat dari pola residual terhadap waktu, bukan terhadap nilai prediksi." },
            { text: "Tidak ada masalah — pola corong adalah normal", why: "Salah: residual yang memenuhi asumsi menyebar acak tanpa pola." },
            { text: "Multikolinearitas — variabel penjelas saling berkorelasi", why: "Salah: multikolinearitas soal hubungan antar variabel penjelas, bukan pola residual." },
          ],
        },
      ],
      reference: "Heteroskedastisitas = varians residual tidak konstan. Autokorelasi = residual berkorelasi antar waktu. Keduanya merusak uji t.",
    },
    {
      id: "minicase-alpha",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Analis mengklaim alpha signifikan — uji klaimnya",
      prose: [
        "Seorang analis mempresentasikan strateginya: alpha 0,9 persen per bulan, t-stat 1,8, dari sampel 144 bulan. Ia menyimpulkan strateginya terbukti mengalahkan pasar. Terapkan seluruh lesson ini untuk menguji klaimnya.",
        "Pertama, t-stat 1,8 di bawah nilai kritis 1,98 — klaimnya gagal lolos uji pada alpha 5 persen. Gagal tolak bukan bukti tidak ada alpha, tetapi beban pembuktian ada pada yang mengklaim — dan ia belum memenuhinya. Kedua, interval kepercayaannya mencakup nol dan nilai negatif — alpha sebesar itu bisa jadi noise. Ketiga, tanyakan distribusinya: bila return strateginya memiliki skewness negatif dan excess kurtosis positif, maka t-stat berbasis normal meremehkan risiko ekornya — kerugian besarnya lebih mungkin dari yang diklaim.",
        "Keempat, tanyakan asumsi regresinya: apakah residualnya autokorelasi? Bila strateginya memakai data harian yang di-aggregasi, t-stat 1,8 itu bisa jadi sudah mengembang. Kelima, tanyakan signifikansi praktis: alpha 0,9 persen per bulan terdengar besar, tetapi setelah biaya transaksi dan pajak, berapa yang tersisa? Analis yang baik tidak bertanya apakah klaim itu signifikan secara statistik — ia bertanya apakah klaim itu bertahan setelah semua pertanyaan ini dijawab.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menerima klaim alpha dari satu angka t-stat. Uji yang lengkap memeriksa nilai kritis, interval, distribusi, asumsi residual, dan signifikansi praktis — lima lapis, bukan satu.",
      },
      reference: "Uji klaim alpha: t-stat vs kritis, interval, skewness dan kurtosis, autokorelasi, lalu signifikansi praktis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: distribusi, skewness, uji t, interval kepercayaan, dan asumsi regresi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Harga saham dimodelkan dengan distribusi yang tidak pernah negatif. Distribusi yang tepat?",
          options: [
            { text: "Lognormal — log harga berdistribusi normal sehingga harga tidak pernah negatif", why: "Benar: lognormal memperbaiki kelemahan normal yang mengizinkan harga negatif.", correct: true },
            { text: "Normal — paling mudah dipakai", why: "Salah: normal mengizinkan nilai negatif sejauh apa pun — tidak cocok untuk harga." },
            { text: "Seragam — semua harga sama mungkinnya", why: "Salah: return dan harga keuangan tidak berdistribusi seragam." },
            { text: "Binomial — hanya dua hasil", why: "Salah: harga bergerak kontinu, bukan hanya naik atau turun." },
          ],
        },
        {
          q: "Sampel 144 bulan, mean 0,9 persen, standar deviasi 6 persen. Standard error dan t-stat?",
          options: [
            { text: "SE 0,5 persen dan t 1,8", why: "Benar: 6 dibagi akar 144 = 0,5; 0,9 dibagi 0,5 = 1,8.", correct: true },
            { text: "SE 6 persen dan t 0,15", why: "Salah: standard error membagi standar deviasi dengan akar n, bukan memakainya mentah-mentah." },
            { text: "SE 0,05 persen dan t 18", why: "Salah: akar 144 adalah 12, bukan 120." },
            { text: "SE 0,75 persen dan t 1,2", why: "Salah: hitung ulang 6 dibagi 12 dan 0,9 dibagi 0,5." },
          ],
        },
        {
          q: "t-stat 1,8 dengan nilai kritis 1,98 pada alpha 5 persen. Keputusan?",
          options: [
            { text: "Tolak H0 — alpha terbukti", why: "Salah: 1,8 di bawah 1,98 — belum cukup bukti." },
            { text: "Gagal tolak H0 — belum cukup bukti ada alpha", why: "Benar: gagal tolak bukan bukti alpha nol, tetapi klaim belum terbukti.", correct: true },
            { text: "Terima H0 — alpha pasti nol", why: "Salah: bahasa yang benar adalah gagal tolak, bukan terima." },
            { text: "Naikkan alpha menjadi 10 persen agar lolos", why: "Salah: mengubah alpha setelah melihat hasil adalah p-hacking." },
          ],
        },
        {
          q: "Lima titik x 1 sampai 5, y 2, 4, 5, 4, 5. Slope dan intercept OLS?",
          options: [
            { text: "Slope 0,6 dan intercept 2,2", why: "Benar: pembilang 6, penyebut 10, slope 0,6; intercept 4 dikurangi 1,8 = 2,2.", correct: true },
            { text: "Slope 1,0 dan intercept 1,0", why: "Salah: itu garis y = x — bukan garis OLS dari titik-titik ini." },
            { text: "Slope 0,5 dan intercept 2,5", why: "Salah: hitung ulang pembilang dan penyebutnya." },
            { text: "Slope 2,2 dan intercept 0,6", why: "Salah: slope dan intercept tertukar." },
          ],
        },
        {
          q: "Residual regresi berkorelasi antar waktu (autokorelasi). Akibat utamanya?",
          options: [
            { text: "Standar error diremehkan sehingga t-stat terlihat terlalu bagus", why: "Benar: autokorelasi membuat observasi tidak independen — satu temuan terhitung berkali-kali.", correct: true },
            { text: "Slope menjadi bias ke nol", why: "Salah: autokorelasi terutama merusak standar error, bukan membuat slope bias ke nol." },
            { text: "R kuadrat menjadi nol", why: "Salah: R kuadrat tidak otomatis nol karena autokorelasi." },
            { text: "Tidak ada akibat bila sampel besar", why: "Salah: sampel besar tidak memperbaiki autokorelasi — koreksi standar error tetap diperlukan." },
          ],
        },
      ],
      summary: [
        "Harga memakai lognormal; return berekor gemuk memakai t; normal hanya pendekatan.",
        "Skewness negatif dan excess kurtosis positif berarti risiko ekstrem lebih besar dari prediksi normal.",
        "Uji t memakai standar deviasi sampel dengan df n dikurangi 1; Type I = false alarm, Type II = miss, power = 1 dikurangi beta.",
        "Interval kepercayaan mencakup nol berarti belum cukup bukti; signifikan statistik bukan sama dengan penting secara praktis.",
        "OLS: slope = kovarians dibagi varians x; R kuadrat = porsi variasi yang dijelaskan; periksa residual sebelum percaya uji t.",
      ],
      next: { label: "PM-A3 — Economics: Mikro, Makro & FX", href: "/learn/pm-a3-economics" },
    },
  ],
};

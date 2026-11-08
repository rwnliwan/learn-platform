import type { V2Lesson } from "../lib/types";

export const mr37: V2Lesson = {
  slug: "mr37-evt-var-es",
  track: "Market Risk",
  module: "Pengukuran Risiko",
  title: "MR37 — Extreme Value Theory untuk VaR dan ES: Mengukur Ekor",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "VaR yang lolos backtest 250 hari — lalu gagal di hari ke-251",
      prose: [
        "Model VaR Bank Nusantara lolos backtest 250 hari: pelanggaran sesuai ekspektasi, Kupiec lolos, semua hijau. Hari ke-251, pasar jatuh 8 persen dalam sehari — kerugian tiga kali VaR 99 persen. Direksi bertanya: 'Bukankah VaR 99 persen berarti kerugian sebesar ini hanya terjadi 1 hari dalam 100?' Jawabannya pahit: VaR historis hanya tahu apa yang PERNAH terjadi dalam 250 hari itu — dan 250 hari tidak mengandung krisis. VaR tidak pernah berjanji tentang hari ke-251; ia hanya merangkum 250 hari yang lalu.",
        "Extreme Value Theory (EVT) adalah jawaban atas keterbatasan ini. Alih-alih memakai seluruh distribusi return — yang didominasi hari-hari biasa — EVT hanya memakai EKOR: return-return terburuk, lalu memodelkan bentuk ekor itu dengan distribusi Pareto tergeneralisasi (GPD). Dari 5 return terburuk, EVT bisa memperkirakan VaR 99,9 persen — kuantil yang tidak pernah teramati dalam datamu. Itulah yang tidak bisa dilakukan VaR historis: ia tidak bisa memperkirakan apa yang belum pernah dilihatnya.",
        "Lesson ini mengambil sudut market risk yang belum ada: B16 sudah mengajarkan EVT secara penuh dari sisi probabilitas (heavy tails, distribusi Pareto, Hill estimator) — tetapi tidak ada lesson yang memakai EVT untuk VaR dan ES trading book. MR21 hanya menyebut 'HS/EVT' dalam satu label diagram. Setelah lesson ini kamu bisa: (1) menjelaskan kapan VaR historis gagal dan EVT dibutuhkan; (2) menerapkan metode Peaks Over Threshold (POT) dengan GPD; (3) menghitung VaR dan ES ekstrem dari mean excess; (4) menjelaskan Hill estimator dan tail index; (5) menjelaskan keterbatasan EVT.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "B16 (Heavy Tails dan EVT) mengajarkan fondasi probabilitasnya: ekor tebal, distribusi Pareto, dan Hill estimator. MR21 menyebut 'HS/EVT' dalam satu label diagram alur — tanpa penjelasan. Tidak ada lesson Market Risk yang menerapkan EVT untuk VaR dan ES: tidak ada POT, tidak ada GPD, tidak ada ekstrapolasi kuantil ekstrem, tidak ada ES dari ekor. Lesson ini membangun penerapan itu — dengan merujuk ke B16 untuk teorinya dan fokus di sini pada perhitungan risiko.",
      },
      reference: "Ambang minus 2 persen, 5 pelampauan dari 250 observasi. Mean excess 0,92 persen. VaR 99,9 persen minus 4,76 persen; ES 99,9 persen minus 5,68 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengukur risiko yang belum pernah terjadi — dengan jujur tentang ketidakpastiannya.",
        "(1) Menjelaskan kapan VaR historis gagal dan EVT dibutuhkan;",
        "(2) Menerapkan metode Peaks Over Threshold (POT) dengan distribusi GPD;",
        "(3) Menghitung VaR dan ES ekstrem dari mean excess;",
        "(4) Menjelaskan Hill estimator dan tail index;",
        "(5) Menjelaskan keterbatasan EVT — termasuk kapan ia menyesatkan.",
      ],
      tasks: [],
    },
    {
      id: "pot-gpd",
      eyebrow: "Langkah 3 · Teori",
      title: "Peaks Over Threshold: hanya ekor yang dihitung",
      prose: [
        "Metode POT bekerja dalam tiga langkah. Pertama, pilih ambang (threshold) u — misalnya kerugian harian di atas 2 persen. Dari 250 observasi, 5 melampaui ambang: 2,5; 3,1; 2,2; 4,0; dan 2,8 persen. Kedua, hitung excess (pelampauan) tiap observasi di atas ambang: 0,5; 1,1; 0,2; 2,0; dan 0,8. Ketiga, modelkan excess itu dengan Generalized Pareto Distribution (GPD) — teorema Pickands-Balkema-de Haan membuktikan bahwa untuk ambang yang cukup tinggi, distribusi excess mendekati GPD apapun distribusi asalnya.",
        "GPD punya dua parameter: bentuk (xi) dan skala (beta). Bentuk menentukan seberapa gemuk ekornya: xi = 0 berarti ekor eksponensial (tipis); xi positif berarti ekor Pareto (gemuk, seperti return saham); xi negatif berarti ekor terbatas (ada batas maksimum kerugian). Skala beta menentukan lebarnya — dan untuk xi = 0, beta sama dengan mean excess (rata-rata pelampauan). Contoh kita: mean excess = (0,5 + 1,1 + 0,2 + 2,0 + 0,8) dibagi 5 = 4,6 dibagi 5 = 0,92 persen. Dengan asumsi xi = 0 (eksponensial), beta = 0,92.",
        "Dari GPD, VaR ekstrem diekstrapolasi: VaR 99,9 persen = u + beta × ln((1 − Fu) / (1 − p)), di mana Fu adalah fraksi observasi di bawah ambang (245/250 = 0,98, sehingga 1 − Fu = 0,02) dan p = 0,999. Hitung: ln(0,02 / 0,001) = ln(20) = 2,9957. VaR 99,9 persen = 2 + 0,92 × 2,9957 = 2 + 2,7561 = 4,76 persen. ES 99,9 persen = VaR + beta = 4,76 + 0,92 = 5,68 persen (untuk ekor eksponensial, ES = VaR + beta). Bandingkan dengan VaR historis 99 persen (sekitar 2,5 persen): EVT memberi angka hampir dua kali lipat — karena ia memodelkan ekor, bukan sekadar menghitungnya.",
        "Memilih ambang adalah seni: terlalu rendah (misalnya 0,5 persen) berarti 100 pelampauan — GPD tidak lagi valid karena datanya bukan 'ekstrem'; terlalu tinggi (misalnya 5 persen) berarti hanya 1 pelampauan — estimasi tidak stabil. Praktik standar: mean excess plot — plot rata-rata excess terhadap ambang; ambang yang tepat adalah titik di mana plot menjadi linear. Aturan praktis: ambang harus memberi 5–10 persen observasi sebagai pelampauan — cukup banyak untuk stabil, cukup sedikit untuk tetap ekstrem.",
      ],
      tasks: [],
      formula: String.raw`\text{VaR}_p = u + \beta \ln\frac{1 - F_u}{1 - p} \qquad \text{ES}_p = \text{VaR}_p + \beta \quad (\xi = 0)`,
      formulaNote: "u = ambang (2 persen); beta = skala GPD = mean excess (0,92); Fu = fraksi di bawah ambang (0,98); p = 0,999. VaR 99,9 persen = 2 + 0,92 × ln(20) = 4,76 persen. ES = 4,76 + 0,92 = 5,68 persen.",
      reference: "Mean excess 0,92 persen; VaR 99,9 persen 4,76 persen; ES 99,9 persen 5,68 persen.",
    },
    {
      id: "hill-keterbatasan",
      eyebrow: "Langkah 4 · Teori",
      title: "Hill estimator, tail index, dan keterbatasan EVT",
      prose: [
        "Hill estimator adalah cara lain mengukur kegemukan ekor — tanpa memilih ambang secara eksplisit. Ia memakai k return terburuk dan menghitung tail index alpha = 1 / (rata-rata log dari rasio return terburuk terhadap return ke-k). Alpha kecil (1–2) berarti ekor sangat gemuk (seperti return saham individual); alpha besar (4 ke atas) berarti ekor hampir normal. B16 membahas Hill estimator secara mendalam; di sini yang penting adalah interpretasinya: alpha menentukan seberapa jauh VaR ekstrem melampaui VaR biasa — semakin kecil alpha, semakin besar lompatannya.",
        "EVT mengubah cara bank menghitung modal ekor: FRTB (MR16) memakai ES 97,5 persen — dan untuk portofolio dengan ekor gemuk, ES dari EVT bisa 50–100 persen lebih besar dari ES historis. Bank yang memakai EVT untuk modalnya memegang modal lebih besar — dan lebih jujur. Tetapi EVT juga punya tiga keterbatasan yang wajib diketahui. Pertama, ia butuh ekor yang 'cukup' — dengan hanya 5 pelampauan, estimasi beta 0,92 punya standar error besar; VaR 4,76 persen bisa dengan mudah menjadi 3,5 atau 6,5 persen. Kedua, ia mengasumsikan ekor masa depan berbentuk seperti ekor masa lalu — asumsi yang runtuh saat rezim berubah (krisis yang belum pernah terjadi tidak ada di ekor historis). Ketiga, ia tidak menangkap perubahan struktural: EVT dari data 2020–2024 tidak tahu bahwa regulasi berubah pada 2025.",
        "Aturan praktis: pakai EVT sebagai PELENGKAP VaR historis, bukan pengganti. Laporkan ketiganya: VaR historis, VaR parametrik, VaR EVT — bila ketiganya berdekatan, ekormu jinak; bila EVT jauh lebih besar, ekormu gemuk dan modalmu harus lebih besar. Dan selalu laporkan interval kepercayaan EVT: VaR 4,76 persen dengan interval 3,5–6,5 persen adalah informasi yang jujur; VaR 4,76 persen tanpa interval adalah presisi palsu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira EVT bisa memprediksi kerugian maksimum. EVT memperkirakan KUANTIL ekstrem (misalnya 1 hari dalam 1.000) — bukan kerugian maksimum yang mungkin. Kerugian maksimum tidak ada — selalu ada hari yang lebih buruk dari yang pernah tercatat. EVT memberi angka untuk probabilitas tertentu, bukan jaminan batas.",
      },
      reference: "Hill alpha kecil (1–2) = ekor sangat gemuk. EVT sebagai pelengkap — laporkan VaR historis, parametrik, dan EVT bersama.",
    },
    {
      id: "lab-evt",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin VaR dan ES ekstrem (POT)",
      prose: [
        "Lab ini membangun mesin EVT: dari ambang, pelampauan, dan fraksi — hitung mean excess, VaR 99,9 persen, dan ES 99,9 persen dengan ekor eksponensial.",
        "Hitung dulu di kepala. Mean excess = (0,5 + 1,1 + 0,2 + 2,0 + 0,8) dibagi 5 = 4,6 dibagi 5 = 0,92 persen. ln(20) = 2,9957. VaR 99,9 persen = 2 + 0,92 × 2,9957 = 2 + 2,7561 = 4,76 persen. ES 99,9 persen = 4,76 + 0,92 = 5,68 persen.",
        "Tugas lab: tulis fungsi yang menerima ambang, daftar excess, fraksi pelampauan, dan probabilitas target — lalu mencetak mean excess, VaR 99,9 persen, dan ES 99,9 persen. Tiga angka ini adalah ukuran ekor yang tidak bisa diberikan VaR historis.",
        "Setelah lolos, coba eksperimen: naikkan excess terbesar dari 2,0 menjadi 5,0 (krisis lebih dalam) dan lihat mean excess menjadi 1,52, VaR menjadi 6,55 persen — lalu tanyakan: berapa banyak pelampauan yang kamu butuhkan sebelum percaya pada angka ini?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean_excess` (rata-rata excess)" },
        { id: "t2", text: "Hitung `var999` (ambang + mean excess dikali ln(fraksi / 0,001))" },
        { id: "t3", text: "Hitung `es999` (var999 + mean excess)" },
      ],
      expected: "mean_excess=0.92\nvar999=4.76\nes999=5.68",
      hints: [
        "Mean excess = jumlah excess / banyaknya excess.",
        "VaR = ambang + mean_excess x ln(fraksi_pelampauan / (1 - 0,999)); gunakan math.log.",
        "ES = VaR + mean excess (ekor eksponensial).",
      ],
      code: {
        starter: `# POT: ambang 2%, excess [0.5, 1.1, 0.2, 2.0, 0.8], fraksi pelampauan 0,02, target 99,9%.\nimport math\nambang = 2.0\nexcess = [0.5, 1.1, 0.2, 2.0, 0.8]\nfraksi = 0.02  # 5 dari 250 observasi\np = 0.999\n\n# TULIS KODEMU: hitung mean_excess, var999, es999.\n# Cetak, per baris: mean_excess, var999, es999.\n\n`,
        lockLines: 6,
        solution: `# POT: ambang 2%, excess [0.5, 1.1, 0.2, 2.0, 0.8], fraksi pelampauan 0,02, target 99,9%.\nimport math\nambang = 2.0\nexcess = [0.5, 1.1, 0.2, 2.0, 0.8]\nfraksi = 0.02  # 5 dari 250 observasi\np = 0.999\n\n\nmean_excess = sum(excess) / len(excess)\nvar999 = ambang + mean_excess * math.log(fraksi / (1 - p))\nes999 = var999 + mean_excess\nprint(f"mean_excess={mean_excess:.2f}")\nprint(f"var999={var999:.2f}")\nprint(f"es999={es999:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_excess", value: 0.92, tol: 0.01, label: "Mean excess 0,92 persen", msg: "4,6 / 5 = 0,92. Itulah beta GPD untuk ekor eksponensial." },
          { kind: "equal", task: "t2", name: "var999", value: 4.76, tol: 0.01, label: "VaR 99,9 persen 4,76 persen", msg: "2 + 0,92 x ln(20) = 2 + 2,76 = 4,76. Hampir dua kali VaR historis 99 persen." },
          { kind: "equal", task: "t3", name: "es999", value: 5.68, tol: 0.01, label: "ES 99,9 persen 5,68 persen", msg: "4,76 + 0,92 = 5,68. ES selalu di atas VaR — ia rata-rata ekor, bukan batasnya." },
        ],
      },
      reference: "Mean excess 0,92 persen; VaR 99,9 persen 4,76 persen; ES 99,9 persen 5,68 persen.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 6 · Teori",
      title: "Praktik: kapan EVT, kapan tidak",
      prose: [
        "EVT paling bernilai dalam tiga situasi. Pertama, modal ekor: menghitung ES 99,9 persen untuk economic capital (MR33) — kuantil yang tidak pernah teramati dalam data 250 hari. Kedua, stress test: menanyakan 'seberapa buruk kerugian 1-dalam-1.000-hari' untuk skenario yang belum pernah terjadi. Ketiga, membandingkan ekor antar portofolio: dua portofolio dengan VaR 99 persen yang sama bisa punya VaR 99,9 persen yang sangat berbeda — EVT membongkar perbedaan yang disembunyikan VaR biasa.",
        "EVT tidak berguna dalam tiga situasi. Pertama, data sedikit: kurang dari 250 observasi berarti pelampauan terlalu sedikit untuk estimasi yang stabil — jangan pakai EVT untuk saham IPO 3 bulan. Kedua, rezim berubah: data sebelum perubahan struktural (misalnya sebelum floating rupiah) tidak menggambarkan ekor sesudahnya. Ketiga, keputusan harian: VaR harian untuk limit trading tidak butuh EVT — VaR historis 250 hari sudah cukup, dan EVT hanya menambah noise estimasi.",
        "Aturan penutup: EVT adalah mikroskop untuk ekor — ia memperbesar apa yang ada di ekor, termasuk noise-nya. Pakai ia untuk pertanyaan ekor (modal, stress test, perbandingan), dan jangan pakai ia untuk pertanyaan biasa (limit harian, laporan rutin). Dan selalu ingat: ekor yang paling berbahaya adalah ekor yang tidak ada di datamu — EVT tidak bisa menemukannya, karena ia hanya memodelkan ekor yang pernah terlihat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai EVT dengan ambang terlalu rendah sehingga 'ekor'-nya berisi data biasa. Bila 100 dari 250 observasi melampaui ambang, itu bukan ekor — itu badan distribusi. GPD tidak berlaku di sana, dan VaR yang dihasilkan adalah fiksi yang dibungkus rumus.",
      },
      reference: "EVT untuk: modal ekor, stress test, perbandingan ekor. Bukan untuk: data sedikit, rezim berubah, limit harian.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: hari ke-251 — dengan EVT",
      prose: [
        "Kembali ke Bank Nusantara dan hari ke-251. Seandainya tim risiko memakai EVT, apa yang berbeda? VaR historis 99 persen mereka: 2,5 persen. VaR EVT 99,9 persen: 4,76 persen. ES EVT 99,9 persen: 5,68 persen. Kerugian aktual hari ke-251: 8 persen — masih di atas ES EVT. EVT tidak akan mencegah kerugian itu. Tetapi tiga hal akan berbeda: pertama, limit posisi akan lebih kecil — karena modal ekor yang dihitung EVT lebih besar; kedua, direksi akan tahu bahwa kerugian 8 persen BUKAN 'tidak mungkin' — ia berada di luar kuantil 99,9 persen, tetapi EVT memberi tahu bahwa ekornya gemuk dan interval kepercayaannya lebar; ketiga, stress test akan memakai 5,68 persen sebagai skenario — bukan 2,5 persen.",
        "Pelajaran mini-case ini bukan 'EVT akan menyelamatkanmu' — melainkan 'VaR historis memberimu rasa aman yang palsu, EVT memberimu rasa tidak aman yang jujur'. Bank yang tahu ekornya gemuk akan memegang modal lebih besar dan posisi lebih kecil — dan saat hari ke-251 datang, ia masih berdiri. Bank yang percaya VaR historisnya akan terkejut — dan keterkejutan adalah kemewahan yang tidak bisa dibeli bank.",
        "Keputusan yang benar setelah hari ke-251: jangan buang model VaR-mu — tambahkan EVT sebagai lensa kedua, laporkan ketiganya (historis, parametrik, EVT), dan naikkan modal ekor. Model yang gagal sekali bukan model yang buruk; model yang gagal dan tidak diperbaiki adalah model yang buruk.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat respons ini benar. Pertama, EVT tidak diklaim sebagai penyelamat — ia diklaim sebagai lensa kedua yang jujur. Kedua, tindakan yang diambil adalah menaikkan modal dan mengecilkan posisi — bukan mengganti model. Ketiga, kegagalan dipakai untuk memperbaiki, bukan untuk membuang.",
      },
      reference: "VaR historis 2,5 persen; VaR EVT 99,9 persen 4,76 persen; kerugian aktual 8 persen — masih di luar, tetapi tidak lagi 'tidak mungkin'.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Mean excess 0,92 persen; VaR 99,9 persen 4,76 persen; ES 99,9 persen 5,68 persen.",
        "POT: pilih ambang, hitung excess, modelkan dengan GPD.",
        "VaR historis tidak bisa memperkirakan kuantil yang belum pernah teramati; EVT bisa.",
        "Hill alpha kecil (1–2) = ekor sangat gemuk.",
        "EVT sebagai pelengkap — laporkan historis, parametrik, dan EVT bersama.",
      ],
      next: { label: "MR38 — Risiko Intraday: Volatilitas Realisasi, VaR Per Jam, dan Flash Crash", href: "/v2/learn/mr38-risiko-intraday" },
      quiz: [
        {
          q: "Ambang 2 persen, excess 0,5; 1,1; 0,2; 2,0; 0,8 (5 dari 250 observasi). Berapa mean excess, VaR 99,9 persen, dan ES 99,9 persen (ekor eksponensial)?",
          options: [
            { text: "Mean excess 0,92; VaR 4,76; ES 5,68 (persen)", why: "Tepat: 4,6/5 = 0,92; 2 + 0,92 × ln(20) = 4,76; 4,76 + 0,92 = 5,68.", correct: true },
            { text: "Mean excess 0,92; VaR 2,92; ES 3,84 (persen)", why: "Salah: VaR memakai ln(20) = 2,9957 — bukan ln(2). Fraksinya 0,02/0,001 = 20." },
            { text: "Mean excess 4,6; VaR 15,78; ES 20,38 (persen)", why: "Salah: 4,6 adalah JUMLAH excess, bukan rata-rata. Mean excess = 4,6/5 = 0,92." },
            { text: "Mean excess 0,92; VaR 4,76; ES 4,76 (persen)", why: "Salah: ES = VaR + beta = 4,76 + 0,92 = 5,68. ES selalu di atas VaR." },
          ],
        },
        {
          q: "Kenapa VaR historis 250 hari tidak bisa memperkirakan VaR 99,9 persen?",
          options: [
            { text: "Karena 250 hari terlalu banyak data", why: "Salah: masalahnya bukan terlalu banyak — melainkan kuantil 99,9 persen berarti 1 hari dalam 1.000, sementara datamu hanya 250 hari. Kuantil itu tidak pernah teramati." },
            { text: "Karena kuantil 99,9 persen berarti 1 hari dalam 1.000 — tidak pernah teramati dalam 250 hari; EVT memodelkan bentuk ekor untuk mengekstrapolasinya", why: "Tepat: VaR historis hanya merangkum yang pernah terjadi. EVT memakai bentuk ekor (GPD) untuk melampaui data.", correct: true },
            { text: "Karena VaR historis selalu salah", why: "Salah: VaR historis benar untuk kuantil yang teramati (95 persen, 99 persen). Ia hanya tidak bisa mengekstrapolasi ke kuantil yang belum teramati." },
            { text: "Karena 250 hari bukan kelipatan 1.000", why: "Salah: bukan soal kelipatan. Soalnya adalah kuantil 99,9 persen membutuhkan ekor yang lebih panjang dari data yang ada." },
          ],
        },
        {
          q: "Ambang POT terlalu rendah sehingga 100 dari 250 observasi melampaui ambang. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — semakin banyak data semakin baik", why: "Salah: 100 pelampauan berarti ambangmu berada di badan distribusi, bukan di ekor. GPD tidak berlaku di sana." },
            { text: "Itu bukan ekor — GPD hanya valid untuk pelampauan ekstrem; VaR yang dihasilkan adalah fiksi", why: "Tepat: ambang yang tepat memberi 5–10 persen observasi sebagai pelampauan. 40 persen berarti ambang terlalu rendah.", correct: true },
            { text: "Estimasi menjadi lebih akurat karena sampel besar", why: "Salah: sampel besar dari tempat yang salah tidak membantu. GPD memodelkan EKOR — data badan justru merusak estimasi bentuk ekor." },
            { text: "VaR menjadi lebih kecil — lebih konservatif", why: "Salah: VaR dari ambang yang salah tidak bisa diinterpretasikan — bukan lebih kecil atau lebih besar secara bermakna." },
          ],
        },
        {
          q: "Hill alpha 1,5 vs alpha 4,0. Mana yang ekornya lebih gemuk — dan apa artinya untuk VaR ekstrem?",
          options: [
            { text: "Alpha 4,0 lebih gemuk — angka lebih besar berarti ekor lebih gemuk", why: "Salah: terbalik. Alpha KECIL berarti ekor gemuk. Alpha 1,5 (seperti return saham) jauh lebih gemuk dari alpha 4,0 (hampir normal)." },
            { text: "Alpha 1,5 lebih gemuk — VaR ekstremnya melompat jauh lebih tinggi di atas VaR biasa", why: "Tepat: alpha kecil = ekor Pareto yang gemuk. Lompatan dari VaR 99 persen ke VaR 99,9 persen jauh lebih besar.", correct: true },
            { text: "Keduanya sama — alpha tidak memengaruhi VaR", why: "Salah: alpha menentukan bentuk ekor — dan bentuk ekor menentukan seberapa jauh kuantil ekstrem dari kuantil biasa." },
            { text: "Alpha 1,5 berarti distribusi normal", why: "Salah: distribusi normal punya ekor eksponensial (alpha tak hingga dalam arti tertentu). Alpha 1,5 adalah ekor yang sangat gemuk." },
          ],
        },
        {
          q: "Kerugian aktual hari ke-251 adalah 8 persen — di atas ES EVT 99,9 persen (5,68 persen). Apa kesimpulan yang benar?",
          options: [
            { text: "EVT gagal total dan harus dibuang", why: "Salah: EVT tidak menjanjikan batas maksimum. Kerugian di atas ES 99,9 persen berarti hari itu berada di luar kuantil 99,9 persen — mungkin, tetapi jarang. Satu observasi tidak membatalkan model." },
            { text: "EVT tetap berguna — ia memberi perkiraan ekor yang jujur dengan interval kepercayaan lebar; satu hari di luar kuantil tidak membatalkan model", why: "Tepat: kuantil 99,9 persen berarti 1 hari dalam 1.000 MELAMPAUINYA. Hari ke-251 bisa menjadi hari itu. Yang penting: interval dan modalnya sudah lebih jujur dari VaR historis.", correct: true },
            { text: "VaR historis terbukti lebih baik dari EVT", why: "Salah: VaR historis (2,5 persen) bahkan lebih jauh dari kenyataan (8 persen). EVT (5,68 persen) lebih dekat — meski tetap terlampaui." },
            { text: "Tidak ada model yang bisa dipakai lagi — risiko tidak bisa diukur", why: "Salah: menyerah bukan jawaban. Model yang terlampaui sekali diperbaiki dan dilengkapi — bukan dibuang." },
          ],
        },
      ],
    },
  ],
};

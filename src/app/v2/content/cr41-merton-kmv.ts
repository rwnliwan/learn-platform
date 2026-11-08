import type { V2Lesson } from "../lib/types";

export const cr41: V2Lesson = {
  slug: "cr41-merton-kmv",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR41 — Model Struktural Merton dan KMV untuk PD Korporasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Debitur tanpa histori gagal bayar — bagaimana mengukur PD-nya?",
      prose: [
        "Bank diminta memberi kredit Rp500 miliar ke sebuah perusahaan terbuka yang tidak pernah gagal bayar. Tidak ada histori default, tidak ada rating eksternal, dan laporan keuangannya terlihat sehat. Komite kredit bertanya satu hal: berapa probability of default (PD) satu tahunnya? Model scorecard butuh data default historis — yang tidak ada untuk perusahaan sebesar ini. Model yang tersisa adalah model struktural.",
        "Ide Merton (1974) sederhana dan brilian: ekuitas perusahaan adalah call option atas asetnya. Bila nilai aset di atas utang saat jatuh tempo, pemegang saham membayar utang dan menyimpan sisanya. Bila nilai aset di bawah utang, perusahaan default dan pemegang saham menyerahkan asetnya. Default terjadi tepat saat nilai aset jatuh di bawah ambang utang — dan pasar saham, lewat harga dan volatilitasnya, memberi tahu kita seberapa jauh aset itu dari ambang tersebut.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan logika Merton — ekuitas sebagai call option dan default sebagai aset di bawah utang; (2) menghitung distance-to-default dan PD dari nilai aset, utang, dan volatilitas aset; (3) menjelaskan apa yang diubah KMV dari Merton murni — estimasi aset dari pasar dan pemetaan EDF empiris; (4) menilai kapan model struktural cocok dan kapan ia gagal.",
      ],
      tasks: [],
      note: {
        title: "Kenapa pasar saham tahu lebih dulu",
        body: "Laporan keuangan terbit kuartalan dan bisa diatur tampilannya. Harga saham bergerak tiap detik dan mencerminkan ekspektasi pasar atas nilai aset. Model struktural membaca sinyal pasar itu — sehingga PD-nya bergerak sebelum rasio keuangan memburuk. Itulah keunggulan utamanya atas model berbasis laporan keuangan semata.",
      },
      reference: "Ekuitas = call option atas aset. Default = aset jatuh di bawah utang. Jarak ke ambang itu = distance-to-default.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menghitung PD korporasi dari data pasar dan menjelaskan setiap asumsi yang kamu pakai — termasuk yang paling rapuh.",
        "(1) Menurunkan rumus Merton: d1, d2, distance-to-default, dan PD sebagai N(-d2);",
        "(2) Menghitung PD dua perusahaan dari nilai aset, utang, volatilitas aset, dan suku bunga bebas risiko;",
        "(3) Menjelaskan tiga perubahan KMV: estimasi nilai dan volatilitas aset dari harga saham, default point di antara utang jangka pendek dan jangka panjang, dan pemetaan EDF dari data historis;",
        "(4) Menilai keterbatasan: asumsi lognormal, utang satu tenor, dan tidak berlakunya model untuk perusahaan tidak terbuka.",
      ],
      tasks: [],
    },
    {
      id: "merton",
      eyebrow: "Langkah 3 · Teori",
      title: "Merton 1974: ekuitas sebagai call option",
      prose: [
        "Perusahaan punya aset bernilai V dan satu utang D yang jatuh tempo dalam T tahun. Di saat jatuh tempo, bila V di atas D, pemegang saham membayar D dan menyimpan V dikurangi D. Bila V di bawah D, perusahaan default: pemegang saham mendapat nol dan kreditur mengambil V. Payoff ekuitas ini persis payoff call option dengan strike D atas underlying V — sehingga Black-Scholes bisa dipakai untuk menilainya.",
        "Distance-to-default (DD) mengukur berapa standar deviasi nilai aset harus jatuh agar menyentuh ambang utang. Rumusnya memakai d2 dari Black-Scholes: d1 sama dengan ln(V dibagi D) ditambah (r ditambah setengah sigma kuadrat) dikali T, seluruhnya dibagi sigma akar T; d2 sama dengan d1 dikurangi sigma akar T. DD sama dengan d2. PD satu tahun sama dengan N(-d2) — peluang nilai aset jatuh di bawah utang — dengan N sebagai fungsi distribusi normal standar.",
        "Contoh di lab: perusahaan A, nilai aset Rp150 miliar, utang Rp100 miliar, volatilitas aset 20 persen, suku bunga 3 persen, tenor 1 tahun. d1 = 2,28, d2 = 2,08, PD = 1,89 persen. Perusahaan B, nilai aset Rp110 miliar, utang Rp100 miliar, volatilitas 30 persen: d1 = 0,57, d2 = 0,27, PD = 39,45 persen. B hanya 10 persen di atas ambang utang dengan volatilitas tinggi — pasar berkata ia hampir separuh jalan menuju default.",
      ],
      tasks: [],
      formula: String.raw`d_1 = \frac{\ln(V/D) + (r + \frac{1}{2}\sigma_A^2)T}{\sigma_A \sqrt{T}}, \quad d_2 = d_1 - \sigma_A \sqrt{T}, \quad PD = N(-d_2)`,
      formulaNote: "V = nilai aset; D = nilai utang; sigma_A = volatilitas aset; r = suku bunga bebas risiko; T = tenor; N = distribusi normal standar. DD = d2: berapa standar deviasi aset harus jatuh agar menyentuh utang.",
      reference: "PD = N(-d2). Aset jauh di atas utang dengan volatilitas rendah = PD kecil. Aset dekat utang dengan volatilitas tinggi = PD besar.",
    },
    {
      id: "kmv",
      eyebrow: "Langkah 4 · Teori",
      title: "KMV: dari teori ke praktik",
      prose: [
        "Merton murni punya satu masalah praktis: nilai aset V dan volatilitasnya sigma_A tidak bisa diamati langsung — yang bisa diamati adalah harga saham dan volatilitasnya. KMV (kini Moody's Analytics) menyelesaikan ini dengan dua persamaan dan dua hal yang tidak diketahui: nilai ekuitas dari Black-Scholes sebagai fungsi V dan sigma_A, dan hubungan volatilitas ekuitas dengan volatilitas aset. Keduanya diselesaikan iteratif dari data pasar harian.",
        "Perubahan kedua: default point. Perusahaan nyata tidak punya satu utang yang jatuh tempo serentak — ia punya utang jangka pendek dan jangka panjang. KMV memakai default point sama dengan utang jangka pendek ditambah setengah utang jangka panjang: perusahaan cenderung default saat asetnya tidak lagi menutup utang jangka pendek ditambah sebagian utang panjangnya.",
        "Perubahan ketiga — yang paling penting: KMV tidak memakai N(-DD) sebagai PD. Ia memetakan DD ke Expected Default Frequency (EDF) dari database historis ribuan perusahaan: untuk tiap tingkat DD, berapa persen perusahaan yang benar-benar default dalam setahun. Pemetaan empiris ini memperbaiki kelemahan distribusi normal — yang meremehkan peluang kejadian ekstrem. DD 2,08 di lab memetakan ke PD teoritis 1,89 persen, tetapi EDF historis untuk DD yang sama bisa berbeda — dan EDF-lah yang dipakai untuk pricing dan modal.",
        "Keterbatasannya harus dihafal: asumsi aset berdistribusi lognormal meremehkan lompatan harga; utang diasumsikan satu tenor; model tidak berlaku untuk perusahaan tidak terbuka karena tidak ada harga saham; dan di krisis, korelasi antar-perusahaan melonjak sehingga PD individual meremehkan risiko portofolio.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira PD Merton sama dengan EDF KMV. PD Merton adalah peluang teoritis dari distribusi normal — N(-d2). EDF adalah frekuensi default historis untuk DD yang sama. Keduanya searah tetapi tidak sama, dan bank memakai EDF untuk keputusan karena ia dikalibrasi ke kejadian nyata, bukan ke asumsi distribusi.",
      },
      reference: "KMV = Merton + estimasi aset dari pasar + default point realistis + EDF empiris. Teori yang dikalibrasi ke dunia nyata.",
    },
    {
      id: "lab-merton",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung PD Merton dua perusahaan",
      prose: [
        "Hitung d1, d2, distance-to-default, dan PD untuk dua perusahaan dengan suku bunga 3 persen dan tenor 1 tahun. Perusahaan A (sehat): nilai aset 150, utang 100, volatilitas aset 0,20. Perusahaan B (tertekan): nilai aset 110, utang 100, volatilitas aset 0,30. Nilai dalam Rp miliar; PD dihitung sebagai N(-d2) dengan fungsi distribusi normal dari math.erf.",
        "Hitung di kepala dulu untuk A: ln(150 dibagi 100) = 0,4055; r ditambah setengah sigma kuadrat = 0,03 + 0,02 = 0,05; d1 = (0,4055 + 0,05) dibagi 0,20 = 2,28; d2 = 2,28 - 0,20 = 2,08; PD = N(-2,08) = 1,89 persen. Untuk B: ln(1,1) = 0,0953; 0,03 + 0,045 = 0,075; d1 = 0,1703 dibagi 0,30 = 0,57; d2 = 0,27; PD = N(-0,27) = 39,45 persen.",
        "Perhatikan sensitivitasnya: B hanya 10 persen di atas ambang utang, tetapi PD-nya 21 kali lipat A. PD struktural sangat sensitif di dekat ambang — penurunan aset 10 persen lagi (V = 99, di bawah utang) membuat PD naik menjadi 53,33 persen — d1 = 0,22, d2 = −0,08, PD = N(0,08) = 53,33 persen: lebih mungkin default daripada tidak, tetapi jauh dari 'hampir pasti'. Itulah kenapa monitoring DD harian lebih penting daripada laporan kuartalan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `d1_a`, `d2_a`, `pd_a` untuk perusahaan A" },
        { id: "t2", text: "Hitung `d1_b`, `d2_b`, `pd_b` untuk perusahaan B, lalu cetak semuanya" },
      ],
      expected: "A: d2=2.08 PD=1.89 persen | B: d2=0.27 PD=39.45 persen",
      hints: [
        "d1 = (ln(V/D) + (r + 0,5 × sigma²) × T) / (sigma × akar T); d2 = d1 - sigma × akar T.",
        "N(x) = 0,5 × (1 + erf(x / akar 2)) — pakai math.erf dan math.sqrt.",
        "PD = N(-d2). Untuk A: d2 2,08 → PD 0,0189. Untuk B: d2 0,27 → PD 0,3945.",
        "Gunakan math.log untuk log natural — bukan log basis 10.",
      ],
      code: {
        starter: `# PD Merton: d1, d2, DD, PD = N(-d2) (nilai Rp miliar, T = 1 tahun, r = 3 persen)\nimport math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\n\nr, T = 0.03, 1.0\nVA, DA, sigA = 150.0, 100.0, 0.20   # perusahaan A (sehat)\nVB, DB, sigB = 110.0, 100.0, 0.30   # perusahaan B (tertekan)\n\n# TULIS KODEMU\nd1_a = \nd2_a = \npd_a = \n\nd1_b = \nd2_b = \npd_b = \n\nprint(f"A: d2={d2_a:.2f} PD={pd_a*100:.2f} persen | B: d2={d2_b:.2f} PD={pd_b*100:.2f} persen")`,
        lockLines: 8,
        solution: `# PD Merton: d1, d2, DD, PD = N(-d2) (nilai Rp miliar, T = 1 tahun, r = 3 persen)\nimport math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\n\nr, T = 0.03, 1.0\nVA, DA, sigA = 150.0, 100.0, 0.20   # perusahaan A (sehat)\nVB, DB, sigB = 110.0, 100.0, 0.30   # perusahaan B (tertekan)\n\n# TULIS KODEMU\nd1_a = (math.log(VA / DA) + (r + 0.5 * sigA ** 2) * T) / (sigA * math.sqrt(T))\nd2_a = d1_a - sigA * math.sqrt(T)\npd_a = N(-d2_a)\n\nd1_b = (math.log(VB / DB) + (r + 0.5 * sigB ** 2) * T) / (sigB * math.sqrt(T))\nd2_b = d1_b - sigB * math.sqrt(T)\npd_b = N(-d2_b)\n\nprint(f"A: d2={d2_a:.2f} PD={pd_a*100:.2f} persen | B: d2={d2_b:.2f} PD={pd_b*100:.2f} persen")`,
        checks: [
          { kind: "equal", task: "t1", name: "d2_a", value: 2.0773, tol: 0.01, label: "`d2_a` ≈ 2,08", msg: "(ln(1,5) + 0,05) / 0,20 - 0,20 = 2,08." },
          { kind: "equal", task: "t1", name: "pd_a", value: 0.0189, tol: 0.001, label: "`pd_a` ≈ 1,89 persen", msg: "N(-2,08) = 1,89 persen — aset jauh di atas utang." },
          { kind: "equal", task: "t2", name: "d2_b", value: 0.2677, tol: 0.01, label: "`d2_b` ≈ 0,27", msg: "(ln(1,1) + 0,075) / 0,30 - 0,30 = 0,27." },
          { kind: "equal", task: "t2", name: "pd_b", value: 0.3945, tol: 0.001, label: "`pd_b` ≈ 39,45 persen", msg: "N(-0,27) = 39,45 persen — aset hanya 10 persen di atas utang." },
          { kind: "stdout_matches", task: "t2", pattern: "A: d2=2\\.08 PD=1\\.89 persen", label: "`print` menampilkan PD perusahaan A", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "A: DD 2,08, PD 1,89 persen. B: DD 0,27, PD 39,45 persen. Dekat ambang = PD meledak.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: debitur C di ambang spekulatif",
      prose: [
        "Debitur C mengajukan kredit Rp200 miliar: nilai aset Rp130 miliar, utang Rp100 miliar, volatilitas aset 22 persen, tenor 1 tahun, suku bunga 3 persen. Hitung: ln(130 dibagi 100) = 0,2624; r ditambah setengah sigma kuadrat = 0,03 + 0,0242 = 0,0542; d1 = (0,2624 + 0,0542) dibagi 0,22 = 1,44; d2 = 1,44 - 0,22 = 1,22; PD = N(-1,22) = 11,14 persen.",
        "PD 11,14 persen menempatkan C di wilayah spekulatif — jauh di atas A (1,89 persen) tetapi jauh di bawah B (39,45 persen). Keputusan komite: kredit bisa diberikan, tetapi dengan tiga syarat. Satu, pricing: spread harus menutup expected loss — PD 11,14 persen dikali LGD 45 persen sama dengan expected loss 5,01 persen, sebelum biaya modal dan operasional. Dua, covenant: debt-to-asset tidak boleh melewati ambang yang menurunkan DD di bawah 1,0. Tiga, monitoring: DD dihitung bulanan dari harga saham — bila DD jatuh di bawah 1,0, fasilitas ditinjau ulang.",
        "Jebakan yang harus dihindari: memakai PD Merton mentah untuk pricing tanpa kalibrasi EDF. Bila EDF historis untuk DD 1,22 lebih tinggi dari 11,14 persen — karena distribusi nyata berekor tebal — maka spread yang dihitung dari 11,14 persen terlalu murah. Praktik yang benar: pakai PD Merton untuk ranking dan monitoring, pakai EDF terkalibrasi untuk pricing dan modal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "PD C 11,14 persen: d2 = 1,22. Expected loss = 11,14 persen × 45 persen = 5,01 persen. Keputusan: berikan dengan pricing yang menutup expected loss, covenant DD di atas 1,0, dan monitoring bulanan. Dan ingat: kalibrasi EDF sebelum pricing.",
      },
      reference: "PD 11,14 persen = spekulatif. Berikan dengan spread menutup expected loss 5,01 persen + covenant + monitoring DD bulanan.",
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
        "Merton: ekuitas = call option atas aset; default saat nilai aset jatuh di bawah utang.",
        "PD = N(-d2); d2 = distance-to-default. A: DD 2,08, PD 1,89 persen. B: DD 0,27, PD 39,45 persen.",
        "KMV: estimasi aset dari harga saham, default point = utang pendek + setengah utang panjang, EDF dari data historis.",
        "PD Merton adalah peluang teoritis; EDF adalah frekuensi historis — bank memakai EDF untuk pricing dan modal.",
        "Keterbatasan: asumsi lognormal, utang satu tenor, tidak berlaku untuk perusahaan tidak terbuka.",
      ],
      next: { label: "CR42 — Altman Z-Score: dari Skor Kebangkrutan ke PD dan Internal Rating", href: "/v2/learn/cr42-altman-zscore" },
      quiz: [
        {
          q: "Dalam model Merton, kapan perusahaan default?",
          options: [
            { text: "Saat harga sahamnya turun 20 persen", why: "Salah: penurunan harga saham bukan definisi default. Default didefinisikan dari nilai aset relatif terhadap utang." },
            { text: "Saat nilai aset jatuh di bawah nilai utang pada saat jatuh tempo", why: "Tepat: itulah payoff call option — pemegang saham hanya membayar bila aset di atas utang; bila di bawah, perusahaan default.", correct: true },
            { text: "Saat labanya negatif dua kuartal berturut-turut", why: "Salah: laba negatif bukan default. Perusahaan bisa rugi tetapi tetap membayar utangnya dari kas atau aset." },
            { text: "Saat rating eksternalnya diturunkan", why: "Salah: penurunan rating adalah opini agensi, bukan kejadian default. Model Merton tidak memakai rating." },
          ],
        },
        {
          q: "Perusahaan A: V=150, D=100, volatilitas 20 persen. Perusahaan B: V=110, D=100, volatilitas 30 persen. Kenapa PD B (39,45 persen) jauh lebih besar dari PD A (1,89 persen)?",
          options: [
            { text: "Karena utang B lebih besar", why: "Salah: utang keduanya sama, Rp100 miliar. Yang berbeda adalah nilai aset dan volatilitasnya." },
            { text: "Karena aset B hanya 10 persen di atas utang dan volatilitasnya lebih tinggi — jarak ke ambang default jauh lebih pendek", why: "Tepat: DD B hanya 0,27 standar deviasi, sementara DD A 2,08. Dekat ambang ditambah volatilitas tinggi = PD meledak.", correct: true },
            { text: "Karena tenor B lebih pendek", why: "Salah: tenor keduanya sama, 1 tahun. Tenor bukan penyebab perbedaan ini." },
            { text: "Karena suku bunga untuk B lebih tinggi", why: "Salah: suku bunga keduanya sama, 3 persen." },
          ],
        },
        {
          q: "Apa perbedaan utama EDF KMV dengan PD Merton mentah?",
          options: [
            { text: "Tidak ada — keduanya dihitung dengan rumus yang sama", why: "Salah: PD Merton memakai N(-d2) dari distribusi normal; EDF memakai frekuensi default historis untuk DD yang sama." },
            { text: "EDF memetakan DD ke frekuensi default historis yang benar-benar terjadi, sehingga mengurangi ketergantungan pada asumsi normal untuk mengubah DD menjadi PD", why: "Tepat: distribusi normal meremehkan kejadian ekstrem, dan EDF dikalibrasi ke data nyata ribuan perusahaan — tetapi DD inputnya sendiri tetap dihitung dari kerangka Merton/KMV yang berasumsi model/distribusi, jadi ketergantungannya berkurang, bukan hilang.", correct: true },
            { text: "EDF hanya berlaku untuk perusahaan tidak terbuka", why: "Salah: kebalikannya — KMV butuh harga saham, jadi justru untuk perusahaan terbuka." },
            { text: "EDF mengabaikan volatilitas aset", why: "Salah: EDF diturunkan dari DD, dan DD sendiri memakai volatilitas aset." },
          ],
        },
        {
          q: "Kenapa model Merton tidak bisa dipakai untuk perusahaan tidak terbuka?",
          options: [
            { text: "Karena perusahaan tidak terbuka tidak punya utang", why: "Salah: perusahaan tidak terbuka punya utang — yang tidak dipunya adalah harga saham yang diperdagangkan." },
            { text: "Karena nilai dan volatilitas aset diestimasi dari harga saham — tanpa pasar saham, tidak ada sinyal pasar untuk dikalibrasi", why: "Tepat: KMV menyelesaikan dua persamaan dari harga dan volatilitas saham. Tanpa keduanya, V dan sigma_A tidak teridentifikasi.", correct: true },
            { text: "Karena perusahaan tidak terbuka tidak pernah default", why: "Salah: perusahaan tidak terbuka juga bisa default — hanya saja model ini tidak bisa mengukurnya." },
            { text: "Karena regulator melarangnya", why: "Salah: tidak ada larangan seperti itu. Kendalanya adalah data, bukan regulasi." },
          ],
        },
        {
          q: "Debitur C: PD Merton 11,14 persen, LGD 45 persen. Berapa expected loss-nya, dan apa implikasi pricing-nya?",
          options: [
            { text: "5,01 persen — spread kredit harus menutup angka ini sebelum biaya modal dan operasional", why: "Tepat: 11,14 persen × 45 persen = 5,01 persen. Spread di bawah itu berarti bank mensubsidi risiko.", correct: true },
            { text: "11,14 persen — spread sama dengan PD", why: "Salah: spread harus menutup expected loss (PD × LGD), bukan PD mentah. LGD 45 persen berarti hanya 45 persen dari eksposur yang hilang." },
            { text: "45 persen — spread sama dengan LGD", why: "Salah: LGD adalah kerugian bila default terjadi. Expected loss memakai peluangnya juga: PD × LGD." },
            { text: "0 persen — PD di bawah 15 persen berarti aman", why: "Salah: tidak ada ambang aman seperti itu. PD 11,14 persen adalah wilayah spekulatif yang harus dihargai." },
          ],
        },
      ],
    },
  ],
};

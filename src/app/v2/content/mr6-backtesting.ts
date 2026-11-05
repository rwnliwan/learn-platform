import type { V2Lesson } from "../lib/types";

export const mr6: V2Lesson = {
  slug: "mr6-backtesting",
  track: "Market Risk",
  module: "VaR & Backtesting",
  title: "MR6 — Backtesting VaR: Mengadili Model dengan Data Nyata",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-model-sehat",
      eyebrow: "Langkah 1 · Pelanggaran",
      title: "Cerita: model yang lolos ujian tapi gagal di lapangan",
      prose: [
        "Sebuah bank dengan bangga melaporkan: backtest VaR kami hijau selama 2 tahun — hanya 4 pelanggaran dari 500 hari, sesuai ekspektasi 5. Validator puas, regulator puas. Model dinyatakan sehat. Lalu krisis mini datang: dalam 10 hari berurutan, VaR terlampaui 7 kali — kerugian Rp120 miliar. Bagaimana model sehat bisa gagal sebrutal itu?",
        "Twist-nya: backtest mereka hanya menghitung jumlah pelanggaran (uji Kupiec lolos), tetapi tidak pernah menguji polanya. Tujuh pelanggaran itu terjadi beruntun — pelanggaran yang berkelompok justru terjadi saat model paling dibutuhkan. Uji independensi (Christoffersen) akan menangkap ini, tetapi tidak ada yang menjalankannya.",
        "Definisi: backtesting membandingkan prediksi VaR kemarin dengan hasil aktual hari ini. Jika kerugian aktual > VaR → pelanggaran (exception/breach). Untuk VaR 99% selama 250 hari, ekspektasi pelanggaran = 2,5 kali. Dua jenis P&L: hipotetis (HPL) — P&L jika posisi kemarin tidak berubah (frozen portfolio); menguji murni model VaR. Aktual (APL) — P&L sesungguhnya termasuk trading intraday, fee, komisi; menguji model + aktivitas trading. Jika HPL lolos tetapi APL gagal → modelnya benar, trading intraday yang bermasalah. Jika keduanya gagal → modelnya yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa backtest harus memakai HPL dulu sebelum APL." },
        { id: "t2", text: "HPL lolos tetapi APL gagal. Apa diagnosis dan obatnya?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira backtest hijau = model benar. Backtest hanya menguji kalibrasi frekuensi historis — apakah 1% kejadian terjadi ~1% dari waktu di masa lalu. Ia tidak menguji ketahanan terhadap krisis yang belum terjadi (butuh stress test — simulasi skenario ekstrem), ketepatan ekor (butuh Expected Shortfall — rata-rata kerugian di ekor terburuk), atau apakah model benar untuk alasan yang benar. Backtest = syarat perlu, bukan syarat cukup.",
        type: "pitfall",
      },
      reference: "Pelanggaran = rugi aktual > VaR. HPL mengisolasi model; APL menguji model + trading.",
    },
    {
      id: "uji-kupiec",
      eyebrow: "Langkah 2 · Uji Kupiec",
      title: "Apakah jumlahnya benar?",
      prose: [
        "Uji Kupiec POF (Proportion of Failures) menguji H₀: probabilitas pelanggaran = p (1% untuk VaR 99%). Statistiknya adalah likelihood ratio: LR = −2 ln[(1−p)^(T−x) p^x / (1−p̂)^(T−x) p̂^x], menyebar chi-square 1 derajat bebas — tolak H₀ jika LR > 3,84 (α=5%). Di sini T = jumlah hari, x = pelanggaran teramati, p̂ = x/T.",
        "Intuisinya: pembilang = likelihood data jika model benar (p=1%); penyebut = likelihood data dengan p terbaik menurut data. Jika keduanya jauh berbeda → LR besar → model ditolak. Sederhananya: apakah frekuensi pelanggaran sesuai janji model?",
        "Contoh: T = 250 hari, x = 7 pelanggaran, p = 0,01 → p̂ = 0,028. LR = −2 ln[(0,99)^243 (0,01)^7] + 2 ln[(0,972)^243 (0,028)^7] ≈ 5,50 > 3,84 → tolak H₀. Kesimpulan: 7 pelanggaran terlalu banyak untuk VaR 99% — model underestimate risiko (atau periode ini memang luar biasa; investigasi lanjut wajib).",
      ],
      formula: String.raw`LR_{POF} = -2\ln\left[\frac{(1-p)^{T-x}\,p^{x}}{(1-\hat{p})^{T-x}\,\hat{p}^{x}}\right] \sim \chi^2(1)`,
      formulaNote: "LR_POF = statistik likelihood ratio uji Kupiec; T = jumlah hari (250 standar Basel); x = pelanggaran teramati; p = probabilitas pelanggaran janji model (1% untuk VaR 99%); p̂ = x/T = frekuensi teramati; χ²(1) — tolak H₀ jika LR > 3,84.",
      tasks: [
        { id: "t1", text: "Hitung `LR` uji Kupiec dari `T`, `x`, `p`" },
        { id: "t2", text: "Tentukan `tolak` (True/False) dengan kritis 3,84, lalu cetak keduanya" },
      ],
      expected: "LR=5.50  tolak=True",
      note: {
        title: "Sering salah",
        body: "Menguji dengan T terlalu kecil (misal 60 hari) lalu menyimpulkan model baik-baik saja. Dengan ekspektasi pelanggaran 0,6, uji tidak punya power statistik — ketidakmampuan menolak bukan bukti model benar. Basel memakai 250 hari karena alasan ini.",
        type: "pitfall",
      },
      hints: [
        "phat = x / T. Perlu import math untuk logaritma natural.",
        "LR = -2*log((1-p)**(T-x) * p**x) + 2*log((1-phat)**(T-x) * phat**x).",
        "tolak = LR > 3.84.",
      ],
      code: {
        starter: `import math\n\nT, x, p = 250, 7, 0.01  # 7 pelanggaran dari 250 hari, VaR 99%\n\n# TULIS KODEMU: statistik LR Kupiec dan keputusan (kritis 3,84)\nphat = \nLR = \ntolak = \n\nprint(f"LR={LR:.2f}  tolak={tolak}")`,
        lockLines: 3,
        solution: `import math\n\nT, x, p = 250, 7, 0.01  # 7 pelanggaran dari 250 hari, VaR 99%\n\n# TULIS KODEMU: statistik LR Kupiec dan keputusan (kritis 3,84)\nphat = x / T\nLR = -2 * math.log((1 - p) ** (T - x) * p ** x) + 2 * math.log((1 - phat) ** (T - x) * phat ** x)\ntolak = LR > 3.84\n\nprint(f"LR={LR:.2f}  tolak={tolak}")`,
        checks: [
          { kind: "equal", task: "t1", name: "LR", value: 5.5, tol: 0.05, label: "`LR` seharusnya ~5.50", msg: "Cek rumus: −2ln(likelihood H₀) + 2ln(likelihood p̂). p̂ = 7/250 = 0,028." },
          { kind: "equal", task: "t2", name: "tolak", value: true, label: "`tolak` seharusnya True", msg: "5,50 > 3,84 → tolak H₀. Model underestimate risiko." },
          { kind: "stdout_matches", task: "t2", pattern: "LR=5\\.50\\s+tolak=True", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kupiec: LR ~ χ²(1), tolak jika > 3,84. Menguji frekuensi, buta urutan.",
    },
    {
      id: "uji-christoffersen",
      eyebrow: "Langkah 3 · Uji Christoffersen",
      title: "Apakah polanya acak?",
      prose: [
        "Uji Kupiec buta terhadap urutan — 7 pelanggaran tersebar acak vs 7 pelanggaran beruntun diperlakukan sama. Uji Christoffersen menguji independensi: pelanggaran hari ini tidak boleh diprediksi dari pelanggaran kemarin. Caranya: modelkan deret pelanggaran sebagai rantai Markov 2-state (0 = tidak langgar, 1 = langgar) dengan matriks transisi berisi π_01 = P(langgar | kemarin tidak) dan π_11 = P(langgar | kemarin langgar).",
        "H₀ independensi: π_01 = π_11. Jika π_11 jauh lebih besar dari π_01 → pelanggaran berkelompok → tolak. Kenapa penting: pelanggaran berkelompok berarti model gagal beradaptasi — setelah sehari jebol ia tidak belajar (model volatilitas adaptif seperti EWMA memberi bobot lebih besar ke data terbaru, tetapi model ini tidak melakukannya). Dan kegagalan beruntun = kerugian terkompounding — jauh lebih mematikan daripada pelanggaran tersebar.",
        "Contoh: 250 hari, 8 pelanggaran dalam 2 cluster (masing-masing 4 berurutan). Transisi: n_00=239, n_01=2, n_10=2, n_11=6 → π_01 = 2/241 ≈ 0,008, π_11 = 6/8 = 0,75. Peluang langgar setelah kemarin langgar = 75% vs 0,8% setelah hari normal — cluster yang ekstrem. Statistik independensi LR ≈ 38,6 >> 3,84 → tolak independensi dengan telak.",
      ],
      formula: String.raw`H_0: \pi_{01} = \pi_{11} \qquad LR_{ind} \sim \chi^2(1)`,
      formulaNote: "π_01 = peluang pelanggaran setelah hari normal; π_11 = peluang pelanggaran setelah kemarin pelanggaran; H₀ independensi: keduanya sama; LR_ind ~ χ²(1) — tolak jika > 3,84; π_11 >> π_01 = pelanggaran berkelompok.",
      tasks: [
        { id: "t1", text: "Hitung `pi01` dan `pi11` dari tabel transisi" },
        { id: "t2", text: "Hitung `LR_ind` uji independensi, tentukan `tolak`, lalu cetak" },
      ],
      expected: "pi01=0.0083  pi11=0.75  LR_ind=38.60  tolak=True",
      note: {
        title: "Sering salah",
        body: "Cukup menjalankan uji Kupiec saja. Kupiec + Christoffersen = uji gabungan (conditional coverage): Kupiec menjawab apakah jumlahnya benar, Christoffersen menjawab apakah waktunya acak. Model bisa lolos Kupiec tetapi gagal Christoffersen — dan kegagalan pola justru yang paling berbahaya karena terjadi saat krisis.",
        type: "pitfall",
      },
      hints: [
        "pi01 = n01/(n00+n01); pi11 = n11/(n10+n11).",
        "pi_pooled = (n01+n11)/(total transisi). LR_ind = -2ln[L(pi,pi)/L(pi01,pi11)].",
        "L(a,b) = (1-a)^n00 * a^n01 * (1-b)^n10 * b^n11. Perlu import math.",
      ],
      code: {
        starter: `import math\n\n# 8 pelanggaran dalam 2 cluster (4+4 berurutan), 250 hari\nn00, n01, n10, n11 = 239, 2, 2, 6\n\n# TULIS KODEMU: pi01, pi11, LR independensi, keputusan\npi01 = \npi11 = \npi_pool = \ndef L(a, b):\n    return (1 - a) ** n00 * a ** n01 * (1 - b) ** n10 * b ** n11\nLR_ind = \ntolak = \n\nprint(f"pi01={pi01:.4f}  pi11={pi11:.2f}  LR_ind={LR_ind:.2f}  tolak={tolak}")`,
        lockLines: 8,
        solution: `import math\n\n# 8 pelanggaran dalam 2 cluster (4+4 berurutan), 250 hari\nn00, n01, n10, n11 = 239, 2, 2, 6\n\n# TULIS KODEMU: pi01, pi11, LR independensi, keputusan\npi01 = n01 / (n00 + n01)\npi11 = n11 / (n10 + n11)\npi_pool = (n01 + n11) / (n00 + n01 + n10 + n11)\ndef L(a, b):\n    return (1 - a) ** n00 * a ** n01 * (1 - b) ** n10 * b ** n11\nLR_ind = -2 * math.log(L(pi_pool, pi_pool) / L(pi01, pi11))\ntolak = LR_ind > 3.84\n\nprint(f"pi01={pi01:.4f}  pi11={pi11:.2f}  LR_ind={LR_ind:.2f}  tolak={tolak}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pi01", value: 0.0083, tol: 0.0005, label: "`pi01` seharusnya ~0.0083", msg: "2/(239+2). Peluang langgar setelah hari normal sangat kecil." },
          { kind: "equal", task: "t1", name: "pi11", value: 0.75, tol: 1e-9, label: "`pi11` seharusnya 0.75", msg: "6/(2+6). Peluang langgar setelah kemarin langgar = 75% — cluster ekstrem." },
          { kind: "equal", task: "t2", name: "LR_ind", value: 38.6, tol: 0.1, label: "`LR_ind` seharusnya ~38.60", msg: "−2ln[L(pooled)/L(bebas)]. Nilai besar = bukti clustering kuat." },
          { kind: "equal", task: "t2", name: "tolak", value: true, label: "`tolak` seharusnya True", msg: "38,6 >> 3,84 → tolak independensi." },
        ],
      },
      reference: "Christoffersen: π_11 >> π_01 = cluster = model tidak adaptif. Obat: perbaiki responsivitas (EWMA/Filtered HS).",
    },
    {
      id: "traffic-light",
      eyebrow: "Langkah 4 · Basel & PLA",
      title: "Lampu lalu lintas dan atribusi P&L",
      prose: [
        "Basel menerjemahkan jumlah pelanggaran 250-hari (VaR 99%) menjadi zona dengan konsekuensi modal langsung. Hijau (0–4 pelanggaran): model OK, multiplier modal 3,0×. Kuning (5–9): perlu perhatian, multiplier naik bertahap 3,4× → 3,85× — contoh: 7 pelanggaran → 3,65×. Merah (≥10): model ditolak, multiplier 4,0×, regulator bisa mencabut izin model internal (kembali ke pendekatan standar yang lebih mahal).",
        "Kenapa zona kuning ada: 5–9 pelanggaran masih mungkin terjadi karena sial untuk model yang benar — jadi tidak langsung dihukum mati, tetapi didenda via multiplier. Ini insentif ekonomi: model yang akurat = modal lebih murah. Multiplier 3–4× diterapkan ke VaR rata-rata 60-hari — modal ≈ 3–4× VaR, jauh lebih besar dari VaR itu sendiri. Inilah harga ketidakpastian model.",
        "P&L attribution (PLA) menjelaskan perbedaan P&L prediksi model risiko (RTPL, dari sensitivitas ΣS_iΔf_i) vs P&L aktual: APL = RTPL + unexplained. FRTB memakai uji korelasi Spearman RTPL vs HPL (harus tinggi) dan uji Kolmogorov-Smirnov (distribusi tidak boleh beda jauh). Backtest bertanya apakah model salah; PLA bertanya di mana model salah — seperti dokter yang tidak cuma cek suhu tetapi juga pemeriksaan darah. Unexplained besar dan persisten = alarm dini sebelum backtest gagal.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan zona, rentang pelanggaran, dan multiplier untuk tiap zona Basel." },
        { id: "t2", text: "PLA menunjukkan unexplained besar 3 bulan tetapi backtest hijau. Apa tindakanmu?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "PLA adalah leading indicator, backtest adalah lagging indicator. Unexplained persisten berarti model sistematis buta terhadap sesuatu — faktor hilang, data salah, atau non-linearitas. Menunggu backtest gagal = menunggu kerugian. Investigasi segera saat PLA berbunyi.",
        type: "risk",
      },
      reference: "Hijau 0–4 (3,0×), kuning 5–9 (3,4–3,85×), merah ≥10 (4,0× + cabut izin). PLA = di mana model salah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Merawat model VaR",
      prose: [
        "Empat keputusan. Pertama, validasi rutin model VaR (kuartalan/tahunan atau setelah perubahan model) → Kupiec + Christoffersen berpasangan (conditional coverage). Kupiec saja tidak cukup — pola pelanggaran sama pentingnya dengan jumlahnya.",
        "Kedua, backtest gagal (zona kuning/merah) → diagnosis bertahap: bandingkan HPL vs APL dulu (apakah model atau trading yang rusak?), lalu PLA (faktor apa yang hilang?), lalu estimator volatilitas (apakah model cukup adaptif?). Ketiga, PLA berbunyi tetapi backtest hijau → investigasi segera: unexplained persisten adalah alarm dini, jangan tunggu backtest gagal.",
        "Keempat, memilih P&L untuk backtest → selalu HPL dulu untuk mengadili model; APL untuk mengadili model + aktivitas trading. Aturan 10 detik: jumlah (Kupiec) + pola (Christoffersen) + zona (Basel) + lokasi salahnya (PLA). Model yang hanya lolos satu uji belum terbukti sehat.",
      ],
      tasks: [
        { id: "t1", text: "Backtest zona kuning. Tuliskan urutan diagnosis tiga langkah." },
        { id: "t2", text: "Kapan memakai HPL dan kapan APL untuk backtest?" },
      ],
      note: {
        title: "Sering salah",
        body: "Langsung menaikkan VaR manual saat backtest gagal. Obatnya bukan angka yang digemukkan — melainkan diagnosis: HPL vs APL, PLA, lalu responsivitas estimator. VaR yang digemukkan manual menyembunyikan akar masalah dan merusak insentif model.",
        type: "pitfall",
      },
      reference: "Diagnosis: HPL vs APL → PLA → estimator. Jangan gemukkan VaR manual.",
    },
    {
      id: "minicase-kuning",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Zona kuning yang diabaikan",
      prose: [
        "Bank melaporkan 7 pelanggaran dalam 250 hari — zona kuning, multiplier 3,65×. Manajemen melihat denda modalnya masih tertahankan dan memutuskan: investigasi ditunda kuartal depan, fokus ke pertumbuhan bisnis dulu. PLA saat itu sudah menunjukkan unexplained persisten 2 bulan — tetapi karena backtest belum merah, alarm itu diarsipkan.",
        "Kuartal berikutnya pasar bergejolak. Pelanggaran beruntun: total 12 dalam 250 hari berjalan → zona merah. Multiplier 4,0×, izin model internal dicabut sementara, bank terpaksa memakai pendekatan standar yang modalnya jauh lebih mahal — tepat saat modal paling dibutuhkan. Biaya penundaan investigasi: ratusan miliar modal tambahan + reputasi ke regulator.",
        "Tiga pelajaran: zona kuning adalah peringatan dengan harga, bukan vonis yang bisa ditunda seenaknya. PLA yang berbunyi saat backtest belum merah adalah kesempatan termurah untuk memperbaiki — setelah merah, biayanya berlipat. Dan multiplier 3–4× berarti setiap perbaikan akurasi model langsung diterjemahkan jadi penghematan modal: investasi di kualitas model adalah investasi bermargin.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa menunda investigasi zona kuning berbiaya mahal." },
        { id: "t2", text: "Apa yang seharusnya dilakukan saat PLA berbunyi tetapi backtest belum merah?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Insentif Basel dirancang eksplisit: model akurat = modal murah. Mengabaikan zona kuning = memilih membayar denda modal yang membesar + risiko pencabutan izin. Risk manager yang baik menerjemahkan setiap temuan validasi menjadi angka modal — itulah bahasa yang didengar direksi.",
        type: "risk",
      },
      reference: "Kuning = peringatan berharga. PLA bunyi + backtest hijau = kesempatan termurah.",
    },
    {
      id: "validasi-sistem",
      eyebrow: "Langkah 7 · Validasi sebagai sistem",
      title: "Backtest tidak cukup: validasi model sebagai sistem",
      prose: [
        "Uji Kupiec dan Christoffersen punya kelemahan yang jarang dibicarakan: power yang rendah. Dengan 250 hari dan ekspektasi 2,5 pelanggaran, uji nyaris tidak bisa membedakan model 1% yang benar dari model 2% yang underestimate dua kali lipat — keduanya sama-sama sering lolos. Ketidakmampuan menolak bukan bukti model benar; ia bukti ujinya lemah. Inilah alasan Basel menambahkan multiplier 3–4×: ketidakpastian model dihargai langsung ke modal, bukan diabaikan.",
        "Validasi dewasa memakai tiga pilar. Pilar pertama: outcomes analysis — backtest dan PLA seperti di lesson ini, tetapi diperluas: uji di beberapa tingkat kepercayaan (97,5%, 99%) untuk memeriksa bentuk ekor, bukan cuma satu titik; segmentasi per desk dan per kelas aset agar kegagalan satu desk tidak tenggelam dalam agregat. Pilar kedua: ongoing monitoring — PLA sebagai leading indicator, tren unexplained, perubahan parameter model; validasi bukan acara tahunan melainkan denyut harian. Pilar ketiga: conceptual soundness — dokumentasi asumsi, batas validitas, dan use test: apakah model benar-benar dipakai untuk keputusan, atau hanya dihitung untuk laporan? Model yang tidak dipakai untuk keputusan tidak akan pernah diperbaiki.",
        "Governance-nya: temuan validasi harus diterjemahkan ke bahasa modal — setiap kelemahan = estimasi dampak ke multiplier dan capital charge. Itulah satu-satunya bahasa yang didengar direksi. Dan atur ekspektasi: tidak ada model yang lolos selamanya; rezim berubah, portofolio berubah, model yang sehat tahun lalu bisa basi tahun ini. Validasi yang baik bukan memberi stempel sehat — melainkan memberi tanggal kedaluwarsa.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa uji Kupiec dengan 250 hari punya power rendah dan apa implikasinya." },
        { id: "t2", text: "Sebutkan tiga pilar validasi model dan contoh aktivitas tiap pilar." },
      ],
      note: {
        title: "Intuisi: validasi = memberi tanggal kedaluwarsa, bukan stempel sehat",
        body: "Pola pikir validator senior: setiap model pasti basi — pertanyaannya kapan dan bagaimana kamu tahu. Lima heuristik. Pertama: uji statistik dengan sampel kecil lebih sering buta daripada benar — ketidakmampuan menolak H₀ bukan bukti model sehat; selalu tanyakan power ujinya sebelum merayakan hasil hijau. Kedua: perluas titik uji — satu tingkat kepercayaan = satu titik buta; uji multi-level dan segmentasi per desk menemukan kegagalan yang tersembunyi di agregat. Ketiga: leading indicator (PLA, tren unexplained) lebih berharga daripada lagging indicator (backtest gagal) — investigasi termurah selalu yang paling dini. Keempat: use test adalah validasi yang paling jujur — model yang dipakai untuk keputusan nyata akan ketahuan rusaknya oleh penggunanya sendiri; model pajangan rusak dalam diam. Kelima: terjemahkan setiap temuan ke modal — validator yang hanya bicara statistik akan diabaikan; validator yang bicara ratusan miliar multiplier didengar. Keenam: catat tanggal kedaluwarsa setiap persetujuan model — rezim dan portofolio berubah, dan model yang sehat tahun lalu bisa basi tahun ini; validasi berkala bukan birokrasi melainkan pengingat. Aturan 10 detiknya: tanya power-nya, perluas titik ujinya, pantau leading-nya, cek dipakai-tidaknya, dan bicaralah dalam bahasa modal.",
      },
      reference: "Validasi = outcomes analysis + ongoing monitoring + conceptual soundness. Beri tanggal kedaluwarsa.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      summary: [
        "Pelanggaran = rugi aktual > VaR. Ekspektasi VaR 99%/250 hari = 2,5 pelanggaran.",
        "Uji Kupiec: LR ~ χ²(1), tolak jika > 3,84 — menguji frekuensi, buta urutan.",
        "Uji Christoffersen: menguji independensi (π_01 = π_11) — pelanggaran berkelompok = model tidak adaptif.",
        "Traffic light Basel: hijau 0–4 (3,0×), kuning 5–9 (3,4–3,85×), merah ≥10 (4,0× + cabut izin).",
        "HPL mengisolasi model; APL = model + trading. PLA (RTPL vs aktual) = alarm dini lokasi kesalahan model.",
        "Backtest = syarat perlu, bukan cukup: tidak menguji krisis unprecedented (butuh stress test) atau kedalaman ekor (butuh ES).",
      ],
      next: { label: "MR7 — Stress Test", href: "/learn/mr7-stress-test" },
      quiz: [
        {
          q: "VaR 99%, 250 hari, 7 pelanggaran. Uji Kupiec (5%)?",
          options: [
            { text: "Lolos — 7 masih wajar", why: "ekspektasi hanya 2,5; 7 sudah jauh di atasnya." },
            { text: "Tolak H₀ — LR ≈ 5,50 > 3,84, model underestimate risiko", why: "7 pelanggaran memberi LR ≈ 5,50 melebihi kritis 3,84. Frekuensi pelanggaran tidak sesuai janji 1%.", correct: true },
            { text: "Tidak bisa diuji", why: "250 hari justru ukuran sampel standar Basel." },
            { text: "Perlu 500 hari dulu", why: "tidak perlu — 250 hari sudah cukup untuk uji ini." },
          ],
        },
        {
          q: "Backtest HPL lolos tetapi APL gagal. Diagnosis?",
          options: [
            { text: "Model VaR salah total", why: "HPL lolos berarti modelnya baik-baik saja." },
            { text: "Model benar, tetapi aktivitas trading intraday (atau fee/komisi) menyebabkan penyimpangan — investigasi desk, bukan model", why: "HPL mengisolasi model (posisi frozen); APL mencakup trading. Obatnya beda!", correct: true },
            { text: "Data harga salah", why: "kemungkinan kecil — HPL memakai harga yang sama dan lolos." },
            { text: "VaR harus dinaikkan 2×", why: "menggemukkan VaR manual menyembunyikan akar masalah." },
          ],
        },
        {
          q: "8 pelanggaran terjadi dalam 2 cluster berurutan. Uji Kupiec tidak menolak. Apa yang terlewat?",
          options: [
            { text: "Tidak ada — lolos berarti aman", why: "lolos Kupiec tidak menjamin pola aman." },
            { text: "Uji independensi (Christoffersen): pelanggaran berkelompok = model tidak adaptif, gagal saat krisis", why: "Kupiec buta urutan. Cluster = P(langgar|kemarin langgar) tinggi = model tidak belajar dari kegagalan.", correct: true },
            { text: "Perlu uji normalitas", why: "bukan itu yang terlewat." },
            { text: "VaR harus diganti ES", why: "ES tidak menyelesaikan masalah clustering pelanggaran." },
          ],
        },
        {
          q: "Zona kuning Basel (7 pelanggaran) berarti?",
          options: [
            { text: "Model dilarang", why: "itu zona merah." },
            { text: "Multiplier modal naik (3,65×) sebagai denda — peringatan untuk investigasi, belum pencabutan izin", why: "kuning = denda ekonomi via multiplier. Tujuannya insentif: model akurat = modal murah.", correct: true },
            { text: "Tidak ada konsekuensi", why: "multiplier naik adalah konsekuensi nyata ke modal." },
            { text: "VaR harus dihitung ulang setiap jam", why: "tidak ada aturan seperti itu." },
          ],
        },
        {
          q: "Keterbatasan fundamental backtesting?",
          options: [
            { text: "Terlalu mahal", why: "backtest justru murah." },
            { text: "Hanya menguji kalibrasi frekuensi historis — tidak bisa menguji krisis unprecedented (butuh stress test) atau kedalaman ekor (butuh ES)", why: "backtest = apakah model benar tentang masa lalu. Tiga pilar (backtest, ES, stress test) saling melengkapi.", correct: true },
            { text: "Tidak bisa dihitung untuk VaR 99%", why: "justru standar Basel memakai VaR 99%." },
            { text: "Hanya berlaku untuk saham", why: "berlaku untuk semua kelas aset." },
          ],
        },
        {
          q: "Backtest 250 hari tidak menolak model yang underestimate dua kali lipat. Kesimpulan yang tepat?",
          options: [
            { text: "Model terbukti sehat", why: "tidak menolak bukan bukti sehat — bisa jadi ujinya yang lemah." },
            { text: "Ujinya kurang power untuk sampel sekecil itu — ketidakmampuan menolak bukan bukti model benar; perluas titik uji dan pantau leading indicator", why: "dengan ekspektasi 2,5 pelanggaran, Kupiec nyaris buta membedakan 1% vs 2%. Validasi dewasa: multi-level, segmentasi, PLA.", correct: true },
            { text: "Tambah data sampai 1000 hari lalu uji ulang", why: "data lebih panjang mencampur rezim — bukan solusi bersih." },
            { text: "Naikkan VaR 2× agar aman", why: "menggemukkan manual menyembunyikan akar masalah." },
          ],
        },
      ],
    },
  ],
};

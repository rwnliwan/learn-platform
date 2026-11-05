import type { V2Lesson } from "../lib/types";

export const mr18: V2Lesson = {
  slug: "mr18-validasi-model",
  track: "Market Risk",
  module: "Tata Kelola & Validasi",
  title: "MR18 — Validasi Model & Data Lineage",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-data-busuk",
      eyebrow: "Langkah 1 · Data busuk",
      title: "Cerita: model sempurna dengan data busuk",
      prose: [
        "Sebuah bank menghabiskan 2 tahun membangun model VaR Monte Carlo tercanggih — 100.000 skenario, full revaluation, Greeks lengkap. Validasi awal: lolos. Backtest: hijau. Semua orang bangga. Setahun kemudian, kerugian tak terduga Rp200 miliar dari portofolio obligasi korporasi.",
        "Investigasi: modelnya benar — tetapi data harga obligasi illiquid yang masuk ke model basi 3 minggu (tidak ada transaksi, harga tidak di-update, tidak ada yang sadar). Model canggih itu menghitung risiko dengan presisi tinggi dari harga yang salah.",
        "Twist-nya: validasi model memeriksa modelnya — tetapi tidak memeriksa silsilah datanya (data lineage). Seperti membangun istana di atas fondasi yang tidak diperiksa. Lesson ini tentang dua disiplin yang tak terpisahkan: validasi model (apakah mesinnya benar?) dan data lineage (apakah bahan bakarnya bersih?).",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan apa yang sebenarnya salah dalam cerita." },
        { id: "t2", text: "Kenapa backtest hijau tidak menangkap masalah ini?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Model canggih dengan data basi = presisi tinggi pada kebohongan. Dalam hierarki kebutuhan analis risiko: data benar > model canggih. Validasi yang tidak mencakup lineage hanya memvalidasi setengah sistem.",
        type: "risk",
      },
      reference: "Model benar + data basi 3 minggu = Rp200 M. Validasi harus mencakup lineage.",
    },
    {
      id: "tiga-pilar",
      eyebrow: "Langkah 2 · Tiga pilar",
      title: "Tiga pilar validasi (SR 11-7)",
      prose: [
        "Standar validasi model (Fed SR 11-7, diadopsi OJK/Basel secara prinsip) bertumpu pada tiga pilar. Conceptual soundness: apakah teori, asumsi, dan desain model masuk akal? (Review kualitatif.) Ongoing monitoring: apakah model tetap bekerja? (Pemantauan berkala.) Outcomes analysis: apakah prediksi model cocok dengan kenyataan? (Backtesting & benchmarking.)",
        "Prinsip kunci — independensi: validator tidak boleh orang yang membangun atau menggunakan model (tidak boleh menilai karya sendiri). Dan validasi bukan sekali — model yang lolos tahun lalu bisa gagal tahun ini (data berubah, pasar berubah, portofolio berubah). Monitoring berkala memakan upaya terbesar sepanjang hidup model — bank yang hanya berinvestasi di validasi awal lalu lalai monitoring = membeli asuransi lalu tidak membayar preminya.",
        "Intuisi kunci: validasi menjawab tiga pertanyaan berlapis — apakah idenya benar? apakah ia masih benar? apakah prediksinya terbukti? Model bisa lolos (3) tetapi gagal (1): misal backtest hijau karena beruntung, padahal teorinya cacat. Tiga lapis = tiga jaring pengaman.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga pilar dan pertanyaan yang dijawab tiap pilar." },
        { id: "t2", text: "Kenapa validasi bukan proyek sekali?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira validasi = backtesting. Backtesting hanya satu dari tiga pilar (outcomes analysis). Model bisa lolos backtest tapi gagal konseptual (teori salah, beruntung saja) atau gagal monitoring (sudah basi). 'Backtest hijau' ≠ 'tervalidasi' — klaim seperti itu pelanggaran disiplin validasi.",
        type: "pitfall",
      },
      reference: "3 pilar: konseptual (ide benar?) + monitoring (masih benar?) + outcome (terbukti?).",
    },
    {
      id: "pilar-satu-dua",
      eyebrow: "Langkah 3 · Konseptual & monitoring",
      title: "Pilar 1 & 2: ide yang sehat, mesin yang diawasi",
      prose: [
        "Conceptual soundness — review kualitatif atas fondasi model, sebelum angka dipercaya. Teori: apakah modelnya tepat untuk tujuan ini? (VaR delta-only untuk desk opsi = salah teori — aproksimasi linear gagal di payoff non-linear.) Asumsi: daftarkan semua asumsi + uji sensitivitasnya (normal? i.i.d.? likuid?). Data: apakah input representatif & berkualitas? (Sampai ke lineage.) Keterbatasan: dokumentasikan kapan model gagal — model tanpa label peringatan = produk cacat. Benchmarking: bandingkan dengan model alternatif/sederhana — jika model kompleks tidak lebih baik dari model naif, pakai yang naif.",
        "Contoh temuan konseptual: model memakai korelasi historis 0,3 untuk sekuritisasi — asumsi ini runtuh saat krisis (lihat 2008). Model tidak boleh dipakai untuk limit tanpa overlay korelasi-stres. Temuan seperti ini menyelamatkan lebih banyak uang daripada backtest hijau mana pun.",
        "Ongoing monitoring — pemantauan berkala bahwa model tetap fit. Stabilitas parameter: apakah kalibrasi melompat-lompat? (Tidak stabil = tidak robust.) Kualitas input: apakah data masih representatif? (Regime change = kalibrasi basi.) Penggunaan: apakah dipakai sesuai tujuannya? Override: berapa sering hasil model di-override manual? Override sering = model tidak dipercaya = selidiki! Trigger tindakan: tetapkan ambang kuantitatif sebelumnya — misal unexplained P&L > X tiga hari berurutan → review. Monitoring tanpa trigger = menonton tanpa wasit. Dan override log adalah dokumen paling jujur di bank: alasan yang berulang adalah spesifikasi perbaikan model yang ditulis penggunanya sendiri.",
        "Benchmarking & challenger models — senjata validator. Jangan validasi model sendirian: bandingkan dengan (1) model naif/sederhana — jika model kompleks tidak mengalahkan rata-rata historis, pakai yang sederhana; (2) challenger model — model alternatif independen dengan asumsi berbeda (misal: VaR historis sebagai challenger untuk VaR Monte Carlo); (3) konsensus eksternal — model vendor atau peer. Aturan: jika champion dan challenger sepakat, kepercayaan naik; jika berbeda jauh, selidiki — perbedaan adalah informasi. Bank yang hanya punya satu model untuk satu risiko = tidak punya pembanding = tidak bisa tahu kapan ia salah.",
        "Tata kelola validasi — OJK & praktik. OJK (melalui POJK manajemen risiko dan ketentuan validasi model internal) mensyaratkan fungsi validasi yang independen, dokumentasi model yang lengkap, dan persetujuan penggunaan model. Praktiknya: model inventory (daftar seluruh model + tiering risikonya — model Tier 1 divalidasi tahunan penuh), model risk committee (forum yang menyetujui/menolak model), dan use-test (model benar-benar dipakai untuk keputusan, bukan pajangan). Validator melapor ke CRO — bukan ke bisnis yang memakai model. Jika validator melapor ke kepala trading, independensinya fiksi.",
      ],
      tasks: [
        { id: "t1", text: "Tuliskan checklist conceptual soundness (5 item)." },
        { id: "t2", text: "Jelaskan kenapa override log disebut dokumen paling jujur." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Formula Li (Gaussian copula untuk CDO) — model US$1 miliar yang ikut membakar dunia 2008 — lolos validasi statistik tetapi gagal konseptual: asumsi korelasi konstan runtuh saat krisis. Teori yang cacat = bom waktu yang tidak terdeteksi backtest.",
        type: "risk",
      },
      reference: "Konseptual: teori+asumsi+data+batasan+benchmark. Monitoring: parameter, input, misuse, override, trigger.",
    },
    {
      id: "sensitivitas",
      eyebrow: "Langkah 4 · Uji sensitivitas",
      title: "Parameter mana yang berbahaya?",
      prose: [
        "Conceptual soundness menuntut: daftarkan semua asumsi + uji sensitivitasnya. Contoh: portofolio 2 aset dengan σ1=10, σ2=15 (Rp M). VaR 99% = 2,33 × σ_portofolio. Dengan korelasi 0,2: VaR = 45,72. Dengan korelasi 0,5: VaR = 50,78 — naik 5,06 (+11,1%) hanya karena satu parameter berubah!",
        "Korelasi adalah parameter berbahaya: sulit diestimasi, tidak stabil, dan melonjak saat krisis (persis saat kamu paling membutuhkannya akurat). Uji sensitivitas menjawab: jika asumsi saya salah sebesar X, seberapa salah jawabannya? Parameter dengan elastisitas tinggi = parameter yang butuh pengawasan paling ketat dan overlay paling konservatif.",
        "Inilah jembatan ke outcomes analysis: backtesting (uji pelanggaran VaR vs aktual) menguji prediksi vs realita — tetapi outcomes analysis tidak bisa membuktikan ketahanan terhadap masa depan yang unprecedented. Validator yang baik menulis batasan ini eksplisit di laporan — lagi-lagi, butuh stress test (skenario ekstrem di luar data historis).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var_rho02` dan `var_rho05` (VaR 99%, ρ=0,2 dan 0,5)" },
        { id: "t2", text: "Hitung `delta_pct` (kenaikan %) dan simpulkan bahayanya" },
      ],
      expected: "var_rho02=45.72  var_rho05=50.78  delta_pct=11.1",
      note: {
        title: "Sering salah",
        body: "Menguji sensitivitas hanya ke parameter yang mudah (volatilitas) dan mengabaikan yang sulit (korelasi, asumsi distribusi). Parameter berbahaya justru yang sulit diestimasi — korelasi, tail dependence, regime. Uji sensitivitas yang menghindari parameter sulit = teater validasi.",
        type: "pitfall",
      },
      hints: [
        "sigma_p = sqrt(s1² + s2² + 2*rho*s1*s2); var = 2.33 * sigma_p.",
        "delta_pct = (var_rho05 - var_rho02)/var_rho02 * 100.",
        "Perlu import math.",
      ],
      code: {
        starter: `import math\n\ns1, s2 = 10.0, 15.0  # Rp miliar\n\n# TULIS KODEMU: VaR 99% utk rho 0,2 dan 0,5, lalu kenaikan %\ndef var99(rho):\n    return \nvar_rho02 = var99(0.2)\nvar_rho05 = var99(0.5)\ndelta_pct = \n\nprint(f"var_rho02={var_rho02:.2f}  var_rho05={var_rho05:.2f}  delta_pct={delta_pct:.1f}")`,
        lockLines: 5,
        solution: `import math\n\ns1, s2 = 10.0, 15.0  # Rp miliar\n\n# TULIS KODEMU: VaR 99% utk rho 0,2 dan 0,5, lalu kenaikan %\ndef var99(rho):\n    return 2.33 * math.sqrt(s1 ** 2 + s2 ** 2 + 2 * rho * s1 * s2)\nvar_rho02 = var99(0.2)\nvar_rho05 = var99(0.5)\ndelta_pct = (var_rho05 - var_rho02) / var_rho02 * 100\n\nprint(f"var_rho02={var_rho02:.2f}  var_rho05={var_rho05:.2f}  delta_pct={delta_pct:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_rho02", value: 45.72, tol: 0.01, label: "`var_rho02` seharusnya 45.72", msg: "2,33 × √(100+225+60). Cek rumusnya." },
          { kind: "equal", task: "t1", name: "var_rho05", value: 50.78, tol: 0.01, label: "`var_rho05` seharusnya 50.78", msg: "2,33 × √(100+225+150)." },
          { kind: "equal", task: "t2", name: "delta_pct", value: 11.1, tol: 0.1, label: "`delta_pct` seharusnya 11.1", msg: "Satu parameter berubah → VaR naik 11%." },
          { kind: "stdout_matches", task: "t2", pattern: "var_rho02=45\\.72\\s+var_rho05=50\\.78\\s+delta_pct=11\\.1", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Uji sensitivitas: seberapa salah jawaban jika asumsi salah sebesar X? Korelasi = parameter berbahaya.",
    },
    {
      id: "lineage",
      eyebrow: "Langkah 5 · Data lineage",
      title: "Silsilah angka: lacak titik bocor",
      prose: [
        "Data lineage = peta asal-usul & perjalanan setiap data: dari vendor → pembersihan → mapping → agregasi → model → laporan. Untuk tiap tahap: apa yang terjadi, siapa yang bertanggung jawab, berapa kualitasnya. Empat pembunuh kualitas data pasar: stale price (harga tidak di-update — obligasi illiquid!); mapping salah (instrumen ke kurva/faktor yang salah → sensitivitas salah → VaR salah); timestamp mismatch (harga saham jam 15:00 dicampur FX jam 16:00 → korelasi artifisial); interpolasi diam-diam (data kosong diisi interpolasi tanpa penanda → model yakin pada data fiktif).",
        "Kualitas data = perkalian, bukan rata-rata: vendor 98% → pembersihan 97% → mapping 85% → agregasi 99% → laporan 99% = 0,98×0,97×0,85×0,99×0,99 ≈ 79,2% — 19 poin hilang di perjalanan, dan penurunan terbesar di mapping. Satu tahap buruk merusak seluruh rantai. Lineage yang baik mengidentifikasi di mana tepatnya berinvestasi perbaikan: perbaiki titik bocor (mapping), bukan yang sudah bagus.",
        "Untuk setiap angka di laporan risiko, kamu harus bisa menjawab: dari mana angka ini berasal, siapa yang menyentuhnya, dan kapan terakhir diverifikasi? Jika tidak bisa — angka itu tidak bisa dipercaya, seberapa pun canggih modelnya. Lineage = rantai kepercayaan angka. Dan saat model aneh: lacak lineage DULU — 80% anomali berasal dari data, bukan model.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kualitas_akhir` (perkalian 5 tahap) dan `titik_bocor` (indeks tahap terburuk)" },
        { id: "t2", text: "Cetak keduanya; jelaskan investasi perbaikan paling efektif" },
      ],
      expected: "kualitas_akhir=0.7919  titik_bocor=2",
      note: {
        title: "Sering salah",
        body: "Mengira data lineage = dokumentasi IT yang membosankan. Lineage adalah alat investigasi risiko: saat model aneh, lineage menjawab dalam hitungan jam (bukan minggu) — data mana yang basi, mapping mana yang salah. Tanpa lineage, setiap anomali = proyek forensik. Dengan lineage = query 5 menit. Ini infrastruktur, bukan birokrasi.",
        type: "pitfall",
      },
      hints: [
        "kualitas_akhir = perkalian semua elemen stages.",
        "titik_bocor = stages.index(min(stages)).",
        "Investasi paling efektif = perbaiki tahap terburuk dulu.",
      ],
      code: {
        starter: `# Skor kualitas per tahap: vendor, pembersihan, mapping, agregasi, laporan\nstages = [0.98, 0.97, 0.85, 0.99, 0.99]\n\n# TULIS KODEMU: kualitas akhir & indeks titik bocor\nkualitas_akhir = \ntitik_bocor = \n\nprint(f"kualitas_akhir={kualitas_akhir:.4f}  titik_bocor={titik_bocor}")`,
        lockLines: 2,
        solution: `# Skor kualitas per tahap: vendor, pembersihan, mapping, agregasi, laporan\nstages = [0.98, 0.97, 0.85, 0.99, 0.99]\n\n# TULIS KODEMU: kualitas akhir & indeks titik bocor\nkualitas_akhir = 1.0\nfor s in stages:\n    kualitas_akhir *= s\ntitik_bocor = stages.index(min(stages))\n\nprint(f"kualitas_akhir={kualitas_akhir:.4f}  titik_bocor={titik_bocor}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kualitas_akhir", value: 0.7919, tol: 0.0001, label: "`kualitas_akhir` seharusnya 0.7919", msg: "0,98×0,97×0,85×0,99×0,99. Perkalian, bukan rata-rata!" },
          { kind: "equal", task: "t1", name: "titik_bocor", value: 2, label: "`titik_bocor` seharusnya 2", msg: "Mapping (0,85) = tahap terburuk." },
          { kind: "stdout_matches", task: "t2", pattern: "kualitas_akhir=0\\.7919\\s+titik_bocor=2", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Lineage: kualitas = perkalian. 79,2% akhir; titik bocor = mapping. Anomali → lineage dulu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan memvalidasi, kapan melacak",
      prose: [
        "Empat keputusan. Pertama, model baru / perubahan besar → validasi penuh 3 pilar SEBELUM produksi. Kondisi: go-live model baru. Alasan: conceptual + data + benchmarking + backtest awal. Tidak ada pakai dulu, validasi nanti — itu seperti terbang dulu, cek mesin nanti.",
        "Kedua, model sudah produksi → ongoing monitoring dengan trigger kuantitatif. Kondisi: berkala (kuartalan/tahunan sesuai materialitas). Alasan: dunia berubah; model yang benar tahun lalu bisa salah tahun ini. Trigger: unexplained P&L, override sering, parameter tak stabil. Ketiga, anomali model → lacak via data lineage DULU. Kondisi: angka aneh, backtest gagal tiba-tiba. Alasan: 80% anomali berasal dari data, bukan model — menghemat minggu investigasi.",
        "Keempat, membangun infrastruktur → investasi di titik bocor lineage. Kondisi: roadmap data & teknologi. Alasan: kualitas = perkalian — perbaiki tahap terburuk dulu (biasanya mapping & validasi input), bukan yang sudah bagus. Aturan 10 detik: 3 pilar (konseptual + monitoring + outcome); backtest saja ≠ validasi; validator independen; lineage dulu saat anomali; override log = spesifikasi perbaikan.",
        "Effective challenge — budaya yang tidak bisa dibeli. Standar SR 11-7 menuntut 'effective challenge': kritik yang tajam, terdokumentasi, dan berpengaruh — bukan stempel. Tanda challenge yang sehat: validator pernah menolak model (jika tidak pernah menolak, ia bukan validator melainkan notaris); temuan didokumentasikan dengan tingkat keparahan; ada tenggat perbaikan yang dipantau. Tanda challenge yang mati: validasi selesai 2 hari (terlalu cepat untuk serius), temuan nol untuk model kompleks (tidak mungkin), atau validator yang 'membantu memperbaiki' model yang ia validasi (kehilangan independensi). Challenge yang efektif = gesekan yang produktif.",
      ],
      tasks: [
        { id: "t1", text: "Model baru mau go-live minggu depan. Apa yang harus terjadi dulu?" },
        { id: "t2", text: "VaR tiba-tiba aneh padahal kemarin normal. Langkah pertama?" },
      ],
      note: {
        title: "Sering salah",
        body: "Memvalidasi model hanya dari kecocokan statistik (goodness-of-fit) tanpa memeriksa properti ekonominya. Model bisa fit sempurna ke data historis tetapi menghasilkan skenario mustahil — validasi harus mencakup uji properti, bukan cuma uji statistik.",
        type: "pitfall",
      },
      reference: "Baru → 3 pilar penuh. Produksi → monitoring + trigger. Anomali → lineage dulu. Investasi → titik bocor.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Jadilah pembunuh model profesional",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson: validator yang baik adalah pembunuh model profesional — dibayar untuk menemukan cara model bisa salah, bukan untuk menandatangani. Tiga pilar (konseptual, monitoring, outcome) adalah tiga jaring pengaman berlapis: model bisa lolos backtest tetapi gagal konseptual (teori cacat, beruntung saja) — dan tiga veto berlaku: gagal satu pilar = tidak lolos.",
        "Tiga pertanyaan yang diajukan validator senior sebelum menandatangani: (1) apa asumsi paling rapuh model ini — dan apa yang terjadi jika ia salah 2× lipat? (2) kapan terakhir model ini dibandingkan dengan challenger independen — dan seberapa jauh selisihnya? (3) apakah data lineage-nya sudah dilacak — atau saya memvalidasi setengah sistem?",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa 'backtest hijau' tidak sama dengan 'tervalidasi'." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke model VaR Monte Carlo di cerita pembuka." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk validasi model. Pertama, hafalkan urutan pemeriksaannya: lineage DULU saat anomali (80% anomali berasal dari data — stale price, mapping salah, timestamp mismatch, interpolasi diam-diam), baru modelnya. Cerita pembuka membuktikan: model sempurna + data basi 3 minggu = Rp200 miliar. Validasi tanpa lineage = memvalidasi setengah sistem. Kedua, conceptual soundness adalah veto, bukan formalitas: Formula Li (Gaussian copula untuk CDO) lolos validasi statistik tetapi gagal konseptual — asumsi korelasi konstan runtuh saat krisis, dan ia ikut membakar dunia 2008. Teori cacat = bom waktu yang tidak terdeteksi backtest. Ketiga, uji sensitivitas ke parameter yang SULIT (korelasi, tail dependence, regime) — bukan yang mudah (volatilitas). Contoh lesson ini: korelasi 0,2 → 0,5 menaikkan VaR 11,1% — satu parameter mengubah segalanya. Keempat, benchmarking adalah kewajiban: bandingkan dengan model naif, challenger independen, dan konsensus eksternal. Selisih champion vs challenger = informasi, bukan gangguan. Kelima, monitoring memakan upaya terbesar sepanjang hidup model: stabilitas parameter, kualitas input, deteksi misuse, dan override log — dokumen paling jujur di bank. Tetapkan trigger kuantitatif sebelumnya; monitoring tanpa trigger = menonton tanpa wasit. Keenam, effective challenge butuh bukti: validator yang tidak pernah menolak = notaris. Untuk OJK: fungsi validasi independen, model inventory + tiering, model risk committee, use-test — dan validator melapor ke CRO, bukan ke bisnis. Dan terakhir: validasi bukan proyek sekali. Bank yang hanya berinvestasi di validasi awal lalu lalai monitoring = membeli asuransi lalu tidak membayar preminya.",
      },
      reference: "Tiga veto: konseptual + monitoring + outcome. Lineage dulu. Challenger wajib. Validator pernah menolak.",
    },
    {
      id: "minicase-validator-menolak",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Validator yang menolak model Rp2 triliun",
      prose: [
        "Tim kuantitatif Bank Nusantara membangun model pricing & VaR untuk portofolio obligasi korporasi Rp2 triliun — Monte Carlo 100 ribu skenario, full revaluation. Backtest hijau 2 tahun. Tim bisnis sudah menghitung efisiensi modal Rp80 miliar/tahun dari model ini. Validator independen menemukan tiga hal: (1) korelasi antar obligor memakai data 2019–2021 (masa tenang) — tanpa overlay stres; (2) harga 30% obligasi illiquid basi lebih dari 2 minggu — lineage tidak pernah diperiksa tim; (3) tidak ada challenger model — satu-satunya pembanding adalah model itu sendiri tahun lalu.",
        "Keputusan validator: TOLAK untuk penggunaan limit — boleh dipakai untuk monitoring dengan overlay korelasi-stres + haircut untuk data basi, sambil dibangun challenger independen. Bisnis protes: 'backtest hijau dua tahun!' Respons validator: 'Backtest menguji masa lalu yang tenang; korelasi tanpa stres = Formula Li versi mini. Saya tidak akan menandatangani bom waktu Rp2 triliun.' Enam bulan kemudian pasar bergejolak — model versi overlay bertahan; versi asli yang ditolak diperkirakan akan jebol Rp120 miliar.",
        "Tiga pelajaran: conceptual soundness adalah veto — backtest hijau tidak mengalahkan teori cacat dan data basi. Validator yang tidak pernah menolak = notaris, bukan validator — effective challenge butuh keberanian menolak model Rp2 triliun yang didukung bisnis. Dan data lineage adalah bagian validasi yang tak terpisahkan: 30% harga basi = presisi tinggi di atas kebohongan.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga temuan validator dan jelaskan kenapa masing-masing fatal." },
        { id: "t2", text: "Kenapa keputusan 'tolak untuk limit, boleh untuk monitoring dengan overlay' tepat?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira penolakan validator = kegagalan tim kuantitatif. Penolakan dengan syarat perbaikan (overlay + challenger + lineage) adalah HASIL KERJA validasi yang sehat — jauh lebih murah dari Rp120 miliar. Budaya yang menghukum validator yang menolak = budaya yang membeli bom waktu.",
        type: "pitfall",
      },
      reference: "Tolak untuk limit (korelasi tanpa stres + data basi + tanpa challenger). Overlay + challenger = jalan maju.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR19.",
      ],
      tasks: [],
      summary: [
        "3 pilar (SR 11-7): conceptual soundness + ongoing monitoring + outcomes analysis.",
        "Validator independen; validasi bukan sekali — model bisa basi.",
        "Backtest hijau ≠ tervalidasi. Teori cacat = bom waktu (Formula Li).",
        "Uji sensitivitas: parameter berbahaya = yang sulit diestimasi (korelasi).",
        "Lineage: kualitas = perkalian; titik bocor = mapping; anomali → lineage dulu.",
        "Override log = spesifikasi perbaikan yang ditulis pengguna.",
      ],
      next: { label: "MR19 — Capstone VaR & ES", href: "/learn/mr19-capstone-var-es" },
      quiz: [
        {
          q: "Tiga pilar validasi model (SR 11-7)?",
          options: [
            { text: "Backtest, backtest, backtest", why: "backtest hanya bagian dari pilar ketiga." },
            { text: "Conceptual soundness + ongoing monitoring + outcomes analysis", why: "tiga lapis saling melengkapi — ide benar? masih benar? terbukti benar?", correct: true },
            { text: "Data, data, data", why: "data penting tetapi bukan kerangka validasi." },
            { text: "Profit, profit, profit", why: "validasi bukan soal profit." },
          ],
        },
        {
          q: "Mengapa validator harus independen dari pembuat/pengguna model?",
          options: [
            { text: "Agar terlihat formal", why: "alasannya substantif, bukan kosmetik." },
            { text: "Tidak bisa menilai karya sendiri secara objektif — bias konfirmasi membuat cacat konseptual tak terlihat oleh pembuatnya", why: "pembuat jatuh cinta pada kreasinya — buta terhadap asumsi lemah yang ia buat sendiri.", correct: true },
            { text: "Agar mahal", why: "bukan soal biaya." },
            { text: "Tidak ada alasan", why: "ada alasan kuat." },
          ],
        },
        {
          q: "Model VaR tiba-tiba aneh. Langkah investigasi PERTAMA?",
          options: [
            { text: "Ganti modelnya", why: "jangan salahkan model dulu." },
            { text: "Lacak data lineage — 80% anomali berasal dari data (stale price, mapping salah, timestamp)", why: "lineage dulu, model kemudian. Cerita pembuka membuktikan: model sempurna + data basi = bencana Rp200 M.", correct: true },
            { text: "Naikkan VaR manual", why: "menutupi masalah, bukan menyelesaikannya." },
            { text: "Abaikan", why: "jelas berbahaya." },
          ],
        },
        {
          q: "Override model sering terjadi oleh trader. Artinya?",
          options: [
            { text: "Trader nakal", why: "jangan langsung menyalahkan — baca polanya." },
            { text: "Sinyal model tidak dipercaya/tidak fit — override log adalah spesifikasi perbaikan yang ditulis pengguna", why: "override berulang = pengguna memberi tahu dengan tindakan bahwa model salah di situasi tertentu.", correct: true },
            { text: "Normal saja", why: "override sering = sinyal yang harus diselidiki." },
            { text: "Model terlalu bagus", why: "justru sebaliknya." },
          ],
        },
        {
          q: "Model lolos backtest tapi validator menemukan teori cacat (asumsi yang runtuh saat krisis). Keputusan?",
          options: [
            { text: "Lolos — backtest hijau berarti aman", why: "backtest menguji masa lalu; teori cacat = gagal di masa depan yang belum terjadi." },
            { text: "Tolak/batasi — conceptual soundness adalah pilar tersendiri; backtest hijau bisa karena beruntung", why: "tiga pilar = tiga veto. Gagal satu pilar = tidak lolos. (Pelajaran Formula Li.)", correct: true },
            { text: "Abaikan teori", why: "teori adalah pilar pertama." },
            { text: "Pakai dengan hati-hati tanpa batasan", why: "butuh pembatasan eksplisit, bukan sekadar hati-hati." },
          ],
        },
        {
          q: "Bank hanya punya satu model VaR tanpa challenger/pembanding independen. Masalahnya?",
          options: [
            { text: "Tidak masalah — satu model cukup", why: "tanpa pembanding, tidak bisa tahu kapan ia salah." },
            { text: "Tidak ada cara tahu kapan model salah — wajib benchmarking: model naif, challenger independen, konsensus eksternal", why: "selisih champion vs challenger = informasi. Satu model = satu titik buta.", correct: true },
            { text: "Modelnya pasti benar", why: "tidak ada jaminan seperti itu." },
            { text: "Challenger hanya untuk bank besar", why: "prinsipnya berlaku untuk semua." },
          ],
        },
        {
          q: "Validator tidak pernah menolak satu pun model dalam 5 tahun. Kesimpulan?",
          options: [
            { text: "Model-model bank sangat bagus", why: "tidak mungkin semua model sempurna 5 tahun." },
            { text: "Validasi mati — validator berfungsi sebagai notaris, bukan effective challenge; eskalasi ke CRO/komite", why: "tanda challenge sehat: pernah menolak, temuan berjenjang, tenggat dipantau.", correct: true },
            { text: "Efisiensi yang bagus", why: "bukan efisiensi, melainkan kegagalan fungsi." },
            { text: "Tidak perlu validasi lagi", why: "justru butuh perbaikan fungsi validasi." },
          ],
        },
      ],
    },
  ],
};

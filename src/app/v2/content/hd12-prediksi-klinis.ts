import type { V2Lesson } from "../lib/types";

export const hd12: V2Lesson = {
  slug: "hd12-prediksi-klinis",
  track: "Health Data Science",
  module: "Data Science Klinis",
  title: "HD12 TRIPOD & Kalibrasi: Model Prediksi yang Dipercaya Dokter",
  estMinutes: 60,
  steps: [
    {
      id: "model-ditolak",
      eyebrow: "Langkah 1 · Kalibrasi",
      title: "Model 95% yang ditolak dokter",
      prose: [
        "Tim data science membangun model risiko readmission: akurasi 95%. Presentasi ke dokter: ditolak mentah-mentah. “Modelmu bilang pasien ini risiko 80%,” kata dokter senior, “tapi dari 10 pasien yang kamu bilang 80%, cuma 4 yang benar-benar readmit. Angkamu tidak bisa dipercaya.”",
        "Model itu diskriminatif (bisa mengurutkan siapa lebih berisiko — AUC) tapi tidak terkalibrasi (angkanya bohong). Dokter tidak butuh ranking — mereka butuh probabilitas yang jujur untuk keputusan. Model yang diskriminatif tapi tidak terkalibrasi seperti termometer yang urutannya benar tapi angkanya ngawur: berguna untuk lomba, berbahaya untuk keputusan.",
        "Dua sumbu kualitas model yang independen. Sumbu diskriminasi: bisakah model mengurutkan (diukur AUC). Sumbu kalibrasi: apakah angkanya jujur — dari semua pasien yang diprediksi 30%, memang ~30% yang kejadian (diukur calibration plot, Brier score). Empat kuadran: diskriminasi baik + kalibrasi baik = deploy; diskriminasi baik + kalibrasi buruk = rekalibrasi (masih bisa diselamatkan); diskriminasi buruk + kalibrasi baik = “jujur tapi bodoh”, tidak berguna; keduanya buruk = buang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira AUC 0,9 berarti model siap dipakai dokter. AUC hanya diskriminasi. Tanpa kalibrasi (angka jujur), validasi eksternal (generalisasi), dan decision curve (utilitas pada threshold operasional), AUC 0,9 bisa menjadi model yang merugikan.",
        type: "pitfall",
      },
      reference: "Dokter bertanya “bolehkah saya percaya angka 70% ini?” — jawab itu.",
    },
    {
      id: "lab-brier",
      eyebrow: "Langkah 2 · Lab Brier",
      title: "Brier score menghukum overconfidence",
      prose: [
        "Dua model pada dua kelompok pasien berbeda (ilustrasi — BUKAN perbandingan head-to-head pada pasien yang sama). Model A terkalibrasi: memprediksi 80% pada 10 pasien, 8 di antaranya benar-benar readmit. Model B overconfident: memprediksi 95% pada 10 pasien, hanya 4 yang readmit. Hitung Brier score keduanya: rata-rata (prediksi − aktual)². CATATAN KEJUJURAN (koreksi lesson lama): versi lama lesson ini mengklaim kedua model “AUC sama 0,80” — SALAH: prediksi di lab ini KONSTAN per model (0,8 dan 0,95 untuk semua pasien), dan model dengan prediksi konstan tidak punya ranking, jadi AUC-nya 0,5. Dan karena y_A ≠ y_B (8/10 vs 4/10 kejadian), perbandingan Brier di sini BUKAN pada pasien yang sama — ia hanya mengilustrasikan bagaimana overconfidence dihukum, bukan bukti model A lebih baik dari B pada populasi yang sama. Untuk perbandingan yang sah, kedua model harus dinilai pada pasien dan outcome yang sama.",
        "Brier menghukum overconfidence tanpa ampun: prediksi 95% yang salah jauh lebih mahal dari prediksi 80% yang salah. Ia proper scoring rule — nilai terbaik dicapai tepat saat kamu melaporkan keyakinanmu yang sebenarnya, tidak ada insentif untuk berbohong.",
      ],
      formula: String.raw`\text{Brier} = \frac{1}{n}\sum_{i=1}^{n} (p_i - y_i)^2`,
      formulaNote: "Brier = rata-rata kuadrat selisih prediksi dan outcome — makin kecil makin baik (0 = sempurna; 0,25 = Brier prediksi konstan 0,5 — “tidak informatif” hanya pada prevalensi 50%; pada prevalensi p, baseline konstan = p(1−p), mis. prevalensi 4% → 0,0384). p_i = probabilitas prediksi untuk pasien ke-i (0–1); y_i = outcome aktual (0 atau 1); n = jumlah pasien; Σ = jumlahkan atas semua pasien. Interpretasi: menghukum overconfidence tanpa ampun — prediksi 95% yang salah (outcome 0: 0,95² ≈ 0,90) jauh lebih mahal dari prediksi 60% yang salah (outcome 0: 0,6² = 0,36). Ia proper scoring rule: nilai terbaik hanya dicapai dengan melaporkan probabilitas yang sejujurnya diyakini.",
      tasks: [
        { id: "t1", text: "Hitung `brier_A` model terkalibrasi" },
        { id: "t2", text: "Hitung `brier_B` model overconfident" },
      ],
      expected: "brier_A=0.16  brier_B=0.5425",
      note: {
        title: "Sering salah",
        body: "Mengoptimasi akurasi lalu heran kenapa dokter menolak. Optimasi akurasi bisa merusak kalibrasi — inilah alasan leaderboard (akurasi/AUC) sering melahirkan model yang ditolak dokter. Untuk model klinis, optimasi proper scoring rule (log-loss/Brier), bukan akurasi.",
        type: "pitfall",
      },
      hints: [
        "Brier = rata-rata dari (prediksi − aktual)² untuk tiap pasien.",
        "aktual = 1 bila readmit, 0 bila tidak.",
        "brier_A = sum((p-y)**2 for p, y in zip(pred_A, y_A))/len(y_A)",
      ],
      code: {
        starter: `pred_A = [0.8]*10;  y_A = [1]*8 + [0]*2   # terkalibrasi: klaim 80%, kejadian 80%\npred_B = [0.95]*10; y_B = [1]*4 + [0]*6  # overconfident: klaim 95%, kejadian 40%\n\n# TULIS KODEMU: Brier score kedua model\nbrier_A = \nbrier_B = \n\nprint(f"brier_A={brier_A:.4f}  brier_B={brier_B:.4f}")
# CATATAN: prediksi konstan -> AUC = 0,5 (bukan 0,80); y_A != y_B -> perbandingan ini ilustrasi, bukan head-to-head`,
        lockLines: 2,
        solution: `pred_A = [0.8]*10;  y_A = [1]*8 + [0]*2   # terkalibrasi: klaim 80%, kejadian 80%\npred_B = [0.95]*10; y_B = [1]*4 + [0]*6  # overconfident: klaim 95%, kejadian 40%\n\n# TULIS KODEMU: Brier score kedua model\nbrier_A = sum((p-y)**2 for p, y in zip(pred_A, y_A))/len(y_A)\nbrier_B = sum((p-y)**2 for p, y in zip(pred_B, y_B))/len(y_B)\n\nprint(f"brier_A={brier_A:.4f}  brier_B={brier_B:.4f}")
# CATATAN: prediksi konstan -> AUC = 0,5 (bukan 0,80); y_A != y_B -> perbandingan ini ilustrasi, bukan head-to-head`,
        checks: [
          { kind: "equal", task: "t1", name: "brier_A", value: 0.16, tol: 1e-9, label: "`brier_A` seharusnya 0.16", msg: "(8×0,04 + 2×0,64)/10 = 0,16. Cek zip(pred_A, y_A)." },
          { kind: "equal", task: "t2", name: "brier_B", value: 0.5425, tol: 1e-9, label: "`brier_B` seharusnya 0.5425", msg: "(4×0,0025 + 6×0,9025)/10 = 0,5425 — jauh lebih buruk." },
          { kind: "stdout_matches", task: "t2", pattern: "brier_A=0\\.1600\\s+brier_B=0\\.5425", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Brier = rata-rata (p − y)². Makin kecil makin jujur.",
    },
    {
      id: "validasi-leakage",
      eyebrow: "Langkah 3 · Validasi",
      title: "Tiga ujian dan checklist leakage",
      prose: [
        "Validasi internal (split/bootstrapping dalam satu dataset) itu ujian di rumah sendiri — soalnya bocor ke pola lokal. Validasi temporal (latih masa lalu, uji masa depan, satu situs) itu ujian semester depan. Validasi eksternal (uji di situs/populasi berbeda) itu pindah sekolah — yang lulus di sini baru boleh dipamerkan. Contoh: model readmission AUC internal 0,82 (RS A), temporal 0,78, eksternal (RS B) 0,65 — karena definisi discharge beda, populasi lebih tua, EHR beda kelengkapan.",
        "Keputusan yang benar: JANGAN deploy di RS B tanpa rekalibrasi/retraining lokal. “Tolak” adalah jawaban yang valid dan profesional — memaksakan model yang tidak cocok adalah malapraktik analitik. Model yang direkalibrasi dengan baik di tempat baru sering lebih berguna daripada model baru yang dilatih asal-asalan.",
        "Checklist leakage sebelum validasi: (1) split berdasarkan WAKTU atau pasien (bukan baris!); (2) imputasi/scaling dihitung dari train saja; (3) tidak ada fitur yang baru tersedia setelah prediction time; (4) label tidak mengandung info masa depan. Dan waspadai drift: populasi menua, protokol berubah, EHR berganti — performa model klinis meluruh diam-diam tanpa monitoring berkala.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira validasi silang 5-fold sudah cukup untuk klaim generalisasi. CV menguji generalisasi ke sampel baru dari populasi yang sama — ia buta terhadap pergeseran waktu (drift), perbedaan situs, dan perbedaan definisi. Untuk klaim “berlaku di RS lain”, butuh validasi eksternal sungguhan.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Leakage yang paling sering di model EHR?",
          options: [
            { text: "Fitur yang baru tersedia SETELAH prediction time", why: "Benar: target leakage — memprediksi masa lalu. Tetapkan prediction time eksplisit dan bekukan fitur di sana.", correct: true },
            { text: "Data terlalu sedikit", why: "Data sedikit menurunkan presisi, bukan leakage." },
            { text: "Model terlalu kompleks", why: "Kompleksitas berlebih = overfitting, bukan leakage." },
            { text: "Terlalu banyak validasi", why: "Validasi tidak pernah “terlalu banyak” — masalahnya adalah validasi yang salah desain." },
          ],
        },
      ],
      reference: "Minimal: temporal. Ideal sebelum deploy: eksternal. Monitoring drift sejak hari pertama.",
    },
    {
      id: "tripod-keputusan",
      eyebrow: "Langkah 4 · Utilitas klinis",
      title: "TRIPOD, decision curve, dan perawat yang protes",
      prose: [
        "TRIPOD adalah checklist pelaporan model prediksi: populasi, prediktor, outcome, validasi, performa — notaris yang memastikan semua tercatat sehingga orang lain bisa menilai dan mengulang. Decision curve analysis mengukur net benefit model pada berbagai threshold: apakah memakai model lebih baik dari “obati semua” atau “obati tak satu pun”. Jika kurva model di bawah “obati semua” pada threshold operasionalmu, modelmu merugikan walau AUC-nya tinggi.",
        "Mini-case: model prediksi sepsis AUC 0,88 dideploy di IGD. Sebulan kemudian perawat protes: “alert berbunyi terus, 9 dari 10 ternyata bukan sepsis — kami mulai mengabaikannya.” Investigasi: threshold default 0,5; prevalensi sepsis di IGD 8%; PPV pada threshold itu hanya 12%. Masalahnya bukan model, melainkan ambang + alur kerja.",
        "Perbaikan: pilih threshold dari decision curve dengan bobot biaya alert fatigue (FP mahal karena mengikis kepercayaan); naikkan threshold hingga PPV ~30–40% walau sensitivitas turun — alert yang dipercaya mengalahkan alert yang sering; tampilkan probabilitas terkalibrasi, bukan biner; ukur outcome operasional (time-to-antibiotik), bukan cuma AUC. Libatkan perawat SEBELUM deploy, bukan setelah protes. Threshold adalah keputusan klinis-ekonomi, bukan statistik — jangan pakai default 0,5.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Alert fatigue membuat perawat mengabaikan semua alert — termasuk yang benar. Model sepsis yang “akurat” tapi memicu puluhan alert palsu per shift bisa menunda antibiotik untuk pasien sepsis sungguhan. Utilitas klinis diukur di alur kerja, bukan di leaderboard.",
        type: "risk",
      },
      reference: "Laporkan kalibrasi + diskriminasi + utilitas sebagai satu paket.",
    },
    {
      id: "dekomposisi-brier",
      eyebrow: "Langkah 5 · Skor",
      title: "Membedah Brier: kalibrasi vs ketajaman",
      prose: [
        "Brier score bukan satu angka misterius — ia terurai menjadi tiga komponen (dekomposisi Murphy): reliabilitas (kalibrasi), resolusi (ketajaman), dan ketidakpastian (variansi bawaan outcome). Dua model bisa punya Brier sama dengan “penyakit” berbeda: model A terkalibrasi tapi tumpul (semua prediksi 18% — aman tapi tak berguna), model B tajam tapi overconfident (prediksi 0%/100% yang sering salah). Dekomposisi memberi tahu obatnya: perbaiki kalibrasi dengan rekalibrasi, atau terima bahwa masalahnya resolusi — butuh fitur yang lebih baik, bukan tuning.",
        "Mengapa Brier disebut proper scoring rule — dan mengapa akurasi bukan? Proper scoring rule mencapai nilai optimal HANYA bila kamu melaporkan probabilitas yang sejujurnya kamu yakini. Akurasi (dengan threshold 0,5) bukan proper: model bisa memaksimalkan akurasi dengan melaporkan 0,51 untuk semua yang “mungkin ya” — angka yang tidak jujur tapi lolos metrik. Inilah akar model 95% yang ditolak dokter di lesson ini: dioptimasi untuk metrik yang salah sejak awal.",
        "Praktiknya: (a) laporkan Brier per kelompok risiko (desil) — Brier global bisa menyembunyikan kalibrasi buruk di ujung distribusi (tetapi ingat: Brier per desil saja tidak membuktikan miskalibrasi — ia bisa berasal dari ketidakpastian yang tinggi di desil itu; lengkapi dengan calibration plot per bin); (b) bandingkan dengan Brier baseline (prediksi = prevalensi untuk semua pasien): Brier 0,15 terlihat bagus sampai tahu baseline-nya 0,147 — modelmu kalah dari baseline naif; bedah dekomposisinya dulu (kalibrasi buruk vs memang tak ada sinyal) sebelum membuangnya; (c) untuk model yang dipakai dengan threshold, lengkapi dengan decision curve (net benefit) — Brier menilai kejujuran probabilitas, NB menilai kegunaan keputusan. Keduanya, bukan salah satu.",
        "Jebakan terakhir: mengoptimasi Brier di validasi lalu memilih threshold terpisah tanpa kalibrasi ulang. Urutan yang benar: latih → validasi (Brier + kalibrasi) → rekalibrasi bila perlu → PILIH threshold dari kapasitas/NB → kunci → uji temporal. Setiap langkah yang dibalik urutannya menghasilkan angka yang tidak bisa dipercaya pada langkah berikutnya.",
      ],
      tasks: [],
      formula: String.raw`\text{Brier} = \text{reliabilitas} - \text{resolusi} + \text{ketidakpastian}`,
      formulaNote: "Dekomposisi Murphy atas Brier score. reliabilitas = komponen kalibrasi — rata-rata kuadrat selisih prediksi vs frekuensi aktual per bin (0 = terkalibrasi sempurna; inilah yang ingin dikecilkan); resolusi = seberapa jauh FREKUENSI OBSERVASI tiap bin menyebar dari rata-rata populasi — bukan sebaran prediksinya: resolusi mengukur seberapa berbeda outcome antar bin (makin besar makin baik — model berani membedakan); ketidakpastian = variansi bawaan outcome, p̄(1−p̄) (tak bisa diubah model). Interpretasi: Brier membaik lewat dua jalan — kalibrasi lebih jujur ATAU resolusi lebih tajam; akurasi hanya peduli threshold, Brier peduli seluruh distribusi probabilitas.",
      note: {
        title: "Intuisi: metrik dari keputusan, curigai yang tunggal, bisa dijelaskan satu kalimat",
        body: "Setiap metrik yang kamu pilih adalah perintah kepada model — dan kepada tim. Pilih akurasi, dan tim akan mengoptimasi threshold 0,5 sambil mengabaikan kejujuran probabilitas; pilih AUC, dan tim akan mengoptimasi ranking sambil mengabaikan kalibrasi; pilih Brier, dan tim dipaksa jujur soal ketidakpastian. Heuristik praktisi: pilih metrik dari keputusan yang akan diambil, bukan dari yang paling populer di leaderboard. Bila keputusan memakai angka probabilitas (rujuk bila >20%), metriknya proper scoring rule; bila keputusan memakai ranking (50 pasien teratas), metriknya ranking; bila keputusan memakai ya/tidak pada kapasitas tetap, metriknya net benefit pada threshold itu. Heuristik kedua: curigai metrik tunggal yang “terlalu bagus” — ia biasanya mengukur hal yang mudah, bukan hal yang penting. Pasangkan selalu: diskriminasi + kalibrasi + utilitas. Heuristik ketiga: metrik yang tidak bisa dijelaskan ke dokter dalam satu kalimat tidak akan dipakai dokter — “Brier 0,12” kalah dari “dari 100 pasien berkode merah, 38 benar-benar readmit”. Tiga kebiasaan — metrik dari keputusan, curigai yang tunggal, bisa dijelaskan satu kalimat — menjaga evaluasi tetap jujur dan dipakai.",
      },
      quiz: [
        {
          q: "Model A: Brier 0,16 (terkalibrasi, tumpul). Model B: Brier 0,16 (tajam, overconfident). Tindakan?",
          options: [
            { text: "Beda obat: A butuh fitur lebih baik (resolusi), B butuh rekalibrasi (reliabilitas)", why: "Benar: dekomposisi memberi diagnosis berbeda untuk angka yang sama.", correct: true },
            { text: "Keduanya sama baik — Brier sama", why: "Angka sama, penyakit beda. Brier global menyembunyikan diagnosis." },
            { text: "Pilih A karena lebih aman", why: "“Aman tapi tumpul” tidak berguna untuk keputusan." },
            { text: "Pilih B karena lebih tajam", why: "Ketajaman tanpa kalibrasi = overconfidence yang berbahaya." },
          ],
        },
        {
          q: "Brier model 0,150; Brier baseline (prediksi = prevalensi) 0,147. Kesimpulan?",
          options: [
            { text: "Model kalah dari baseline — bedah dulu sebelum deploy: kalibrasi buruk atau memang tak ada sinyal?", why: "Benar bahwa model kalah dari baseline naif — tetapi Brier yang lebih buruk tidak membuktikan “tidak ada sinyal”: model bisa punya diskriminasi (ranking) yang baik dengan kalibrasi yang buruk, dan obatnya rekalibrasi, bukan buang. Jangan deploy TANPA membedah dekomposisinya.", correct: true },
            { text: "0,150 cukup kecil, deploy saja", why: "“Kecil” tanpa pembanding baseline menyesatkan." },
            { text: "Naikkan threshold", why: "Threshold tidak memperbaiki Brier — masalahnya di model." },
            { text: "Tambah data training", why: "Mungkin membantu, tapi kesimpulan utamanya: model saat ini tidak berguna." },
          ],
        },
        {
          q: "Mengapa akurasi (threshold 0,5) bukan proper scoring rule?",
          options: [
            { text: "Model bisa memaksimalkannya dengan probabilitas yang tidak jujur (mis. 0,51 untuk semua “mungkin ya”)", why: "Benar: akurasi hanya peduli sisi threshold, bukan kejujuran angka.", correct: true },
            { text: "Akurasi sulit dihitung", why: "Akurasi justru paling mudah dihitung — itu masalahnya." },
            { text: "Akurasi selalu 95%", why: "Tidak ada angka bawaan seperti itu." },
            { text: "Dokter tidak suka akurasi", why: "Bukan soal suka — soal insentif yang diberikannya ke model." },
          ],
        },
        {
          q: "Brier global 0,12 terlihat baik, tapi Brier desil risiko tertinggi 0,28. Artinya?",
          options: [
            { text: "Belum bisa disimpulkan dari Brier saja — butuh calibration plot / reliabilitas per bin", why: "Benar: Brier desil tinggi bisa berasal dari ketidakpastian (uncertainty) yang tinggi di desil itu, bukan miskalibrasi. Vonis miskalibrasi butuh reliabilitas per bin (bandingkan prediksi rata-rata vs frekuensi aktual) — Brier per desil saja tidak cukup.", correct: true },
            { text: "Model sudah baik, abaikan desil", why: "Desil tertinggi = pasien yang keputusannya paling kritis — tidak boleh diabaikan." },
            { text: "Tambah threshold", why: "Threshold tidak memperbaiki kalibrasi per desil." },
            { text: "Kalibrasi buruk di ujung — pasien risiko tertinggi justru yang angkanya paling bohong", why: "Salah: Brier desil tinggi tidak membuktikan miskalibrasi — bisa berasal dari ketidakpastian yang tinggi di desil itu. Butuh calibration plot." },
          ],
        },
      ],
      reference: "Brier = kejujuran. Dekomposisi = diagnosis. Metrik dipilih dari keputusan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: model prediksi yang dipercaya dokter",
      prose: [
        "Lima situasi keputusan yang dihadapi tim data setiap kali model prediksi klinis bergerak menuju ranjang pasien:",
        "Skenario 1 — “Modelnya bagus di validasi — siap deploy?” → Belum: cek KALIBRASI dulu, bukan cuma diskriminasi. AUC 0,88 tidak menjamin angka probabilitasnya jujur — laporkan Brier per desil risiko dan bandingkan dengan Brier baseline (prediksi = prevalensi). Model yang terkalibrasi buruk memberi dokter angka yang tidak bisa dipercaya, seberapa pun tinggi AUC-nya.",
        "Skenario 2 — “Threshold-nya berapa?” → Dari decision curve dengan bobot biaya klinis + kapasitas operasional — JANGAN pakai default 0,5 vendor. Contoh: model sepsis dengan threshold 0,5 menghasilkan PPV 13,3% dan 200 alert/hari (50 jam perawat/hari — mustahil); naikkan threshold hingga PPV ~40% — alert turun ke ~45/hari dan perawat kembali percaya.",
        "Skenario 3 — “Performanya terlalu bagus untuk jadi kenyataan?” → Audit leakage: cocokkan setiap fitur dengan prediction time-nya. Fitur dari masa depan relatif terhadap titik prediksi = kebocoran, bukan kecerdasan. AUC 0,97 di EHR hampir selalu berarti bocor.",
        "Skenario 4 — “Mau mempublikasikan atau mengajukan model ke komite medik?” → Ikuti TRIPOD: laporkan populasi, prediktor, outcome, validasi, dan performa sebagai satu paket — kalibrasi + diskriminasi + utilitas klinis. Model tanpa ketiganya tidak bisa dinilai orang lain, dan tidak bisa diulang.",
        "Skenario 5 — “Performa menurun setelah deploy?” → Monitor drift kalibrasi secara berkala (populasi bergeser, praktik klinis berubah) dan rekalibrasi bila perlu — threshold ikut dievaluasi ulang, karena PPV bergantung pada prevalensi yang bisa berubah.",
        "Aturan praktis 10 detik: validasi → kalibrasi dulu (Brier per desil) → threshold dari decision curve + kapasitas → audit leakage vs prediction time → laporkan TRIPOD lengkap → monitor drift pasca-deploy.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mendeploy threshold bawaan vendor lalu menyalahkan model saat perawat protes — padahal yang salah adalah ambang alarm yang tidak pernah diputuskan secara sadar — dan kalibrasi yang tidak pernah dibuktikan (Brier 0,09 kalah dari baseline 0,0384). Rp2,1 miliar hampir hangus bukan karena model buruk, melainkan karena satu angka default yang tak pernah ditantang.",
        type: "pitfall",
      },
      reference: "Kalibrasi + diskriminasi + utilitas = satu paket. Threshold = keputusan kapasitas, bukan default.",
    },
    {
      id: "minicase-sepsis",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case 1: Skor sepsis Rp2,1 miliar dan 9 dari 10 alert palsu",
      prose: [
        "RS menginvestasikan Rp2,1 miliar (lisensi + integrasi + pelatihan) untuk model prediksi sepsis (AUC 0,88) di IGD. Sebulan pasca-deploy, perawat protes: “alert berbunyi terus — 9 dari 10 ternyata bukan sepsis.” Komite medik mengancam mematikan sistem.",
        "Datamu: threshold default 0,5 dari vendor. Pada threshold itu: sensitivitas 92%, spesifisitas 75%, prevalensi sepsis IGD 4%. PPV = (0,92×0,04)/(0,92×0,04 + 0,25×0,96) ≈ 13,3% — hampir 7 dari 8 alert palsu. Kapasitas: tiap alert butuh 15 menit asesmen perawat; 200 alert/hari × 15 menit = 50 jam perawat/hari — mustahil. Catatan kejujuran atas angka lesson lama: klaim “terkalibrasi dengan baik (Brier 0,09)” SALAH dua kali. Pertama, Brier 0,09 LEBIH BURUK dari baseline konstan (prediksi 4% untuk semua pasien: 0,04×0,96 = 0,0384) — model yang kalah dari baseline naif tidak bisa disebut terkalibrasi dengan baik. Kedua, angka-angka ini tidak kompatibel dengan kalibrasi: bila model terkalibrasi dan alert = p̂ ≥ 0,5, maka event rate di antara yang ter-alert harus ≥50% — bukan 13,3%. Yang benar: model ini TIDAK terkalibrasi dengan baik (atau sensitivitas/spesifisitasnya berasal dari operating point yang berbeda) — dan itu justru memperkuat pelajaran: jangan percaya klaim kalibrasi tanpa calibration plot. Masalahnya BUKAN HANYA threshold — kalibrasi yang buruk ikut menyumbang alert palsu.",
        "Pertanyaan: (1) threshold berapa yang kamu usulkan? (2) bagaimana menjelaskan ke perawat bahwa “modelnya tidak rusak”? (3) metrik sukses apa yang kamu tetapkan?",
        "Pembahasan: (1) Naikkan threshold hingga PPV ~40% (sensitivitas turun ke ~70% — trade-off eksplisit): alert/hari turun ke ~45, beban asesmen ~11 jam/hari, masih dalam kapasitas. Pilih via decision curve dengan bobot biaya alert fatigue. (2) Jelaskan dengan jujur: “Angka 80%-nya belum terbukti jujur di data kita — Brier 0,09 kalah dari baseline 0,0384, jadi sebelum membela model, kita rekalibrasi dan buktikan dengan calibration plot (mis. dari 100 pasien skor 80%, berapa yang benar-benar sepsis). Yang pasti salah adalah ambang bunyi alarmnya, dan itu keputusan kita, bukan vonis model.” (3) Metrik sukses: time-to-antibiotik pada sepsis terkonfirmasi + PPV alert + survei beban perawat — bukan AUC. Pelajaran: Rp2,1 miliar hampir hangus bukan karena model buruk, melainkan karena threshold default vendor. Jangan pernah deploy threshold bawaan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Alarm fatigue bukan sekadar ketidaknyamanan — perawat yang berhenti percaya pada alert akan mengabaikan alert yang benar juga. Model sepsis yang “akurat” dengan threshold salah bisa meningkatkan mortalitas lewat jalan yang tidak tercatat di metrik mana pun.",
        type: "risk",
      },
      reference: "Jangan deploy threshold bawaan vendor. Threshold = keputusan kapasitas.",
    },
        {
          id: "gap-r7-calibration-plot",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P8-G1)",
          title: "Calibration plot: dari Brier global ke kejujuran per bin",
          prose: [
            "Lesson ini memberi Brier global dan Brier per desil — tetapi Brier per desil saja tidak membuktikan miskalibrasi (langkah 5 sudah memperingatkan: Brier desil tinggi bisa berasal dari ketidakpastian, bukan kalibrasi buruk). Yang membuktikan kalibrasi adalah CALIBRATION PLOT: kelompokkan pasien per bin prediksi, lalu bandingkan rata-rata prediksi vs frekuensi kejadian aktual di tiap bin. Lab ini menghitungnya dari 10 pasien: probabilitas [0,9; 0,8; 0,7; 0,6; 0,55; 0,45; 0,4; 0,3; 0,2; 0,1], outcome [1, 1, 0, 1, 0, 0, 1, 0, 0, 0].",
            "Hasilnya: bin tinggi (prediksi ≥ 0,5): prediksi rata-rata 0,71, kejadian aktual 0,60 — model melebih-lebihkan 11 poin. Bin rendah (prediksi < 0,5): prediksi 0,29, kejadian 0,20 — melebih-lebihkan 9 poin. Kedua bin OVERCONFIDENT (prediksi > aktual). Brier-nya 0,1705 — dan ECE (expected calibration error, rata-rata selisih tertimbang) = 0,10. Bandingkan dengan baseline konstan (prediksi = prevalensi 0,4 untuk semua): Brier baseline 0,24 — model ini lebih baik dari baseline, TETAPI tetap miskalibrasi: 'lebih baik dari baseline' bukan 'terkalibrasi'. Perbaikan: rekalibrasi (Platt scaling / isotonic) lalu plot ulang — dan laporkan n per bin, karena bin berisi 5 pasien seperti di sini sangat berisik (satu pasien mengubah frekuensi 20 poin).",
          ],
          formula: String.raw`\text{ECE} = \sum_b \frac{n_b}{n}\,|\bar{p}_b - \bar{y}_b| \qquad \text{terkalibrasi} \iff \bar{p}_b \approx \bar{y}_b \ \text{di tiap bin}`,
          formulaNote: "10 pasien: Brier 0,1705; bin tinggi pred 0,71 vs obs 0,60; bin rendah pred 0,29 vs obs 0,20; ECE 0,10; baseline (prevalensi 0,4) Brier 0,24.",
          tasks: [
            { id: "t1", text: "Hitung `brier` + rata-rata prediksi vs observasi per bin (`pred_tinggi`, `obs_tinggi`, `pred_rendah`, `obs_rendah`)" },
            { id: "t2", text: "Hitung `ece` (expected calibration error)" },
          ],
          expected: "brier=0.1705 pred_tinggi=0.71 obs_tinggi=0.6 pred_rendah=0.29 obs_rendah=0.2 ece=0.1",
          hints: [
            "Brier = rata-rata (p − y)²; bin tinggi = prediksi ≥ 0,5.",
            "ECE = Σ (n_bin/n) × |pred rata-rata − frekuensi aktual|.",
          ],
          code: {
            starter: `# 10 pasien: probabilitas prediksi + outcome (1 = sepsis)\nprobs = [0.9, 0.8, 0.7, 0.6, 0.55, 0.45, 0.4, 0.3, 0.2, 0.1]\ny = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0]\n\n# TULIS KODEMU: Brier + rata-rata prediksi vs frekuensi aktual per bin + ECE\nbrier =\npred_tinggi =\nobs_tinggi =\npred_rendah =\nobs_rendah =\nece =\n\nprint(f"brier={brier} pred_tinggi={pred_tinggi} obs_tinggi={obs_tinggi} pred_rendah={pred_rendah} obs_rendah={obs_rendah} ece={ece}")`,
            lockLines: 5,
            solution: `# 10 pasien: probabilitas prediksi + outcome (1 = sepsis)\nprobs = [0.9, 0.8, 0.7, 0.6, 0.55, 0.45, 0.4, 0.3, 0.2, 0.1]\ny = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0]\n\n# TULIS KODEMU: Brier + rata-rata prediksi vs frekuensi aktual per bin + ECE\nbrier = round(sum((p - t) ** 2 for p, t in zip(probs, y)) / len(y), 4)\ntinggi = [(p, t) for p, t in zip(probs, y) if p >= 0.5]\nrendah = [(p, t) for p, t in zip(probs, y) if p < 0.5]\npred_tinggi = round(sum(p for p, _ in tinggi) / len(tinggi), 2)\nobs_tinggi = round(sum(t for _, t in tinggi) / len(tinggi), 2)\npred_rendah = round(sum(p for p, _ in rendah) / len(rendah), 2)\nobs_rendah = round(sum(t for _, t in rendah) / len(rendah), 2)\nece = round(len(tinggi) / len(y) * abs(pred_tinggi - obs_tinggi) + len(rendah) / len(y) * abs(pred_rendah - obs_rendah), 2)\n\nprint(f"brier={brier} pred_tinggi={pred_tinggi} obs_tinggi={obs_tinggi} pred_rendah={pred_rendah} obs_rendah={obs_rendah} ece={ece}")`,
            checks: [
              { kind: "equal", task: "t1", name: "brier", value: 0.1705, tol: 0.001, label: "`brier` = 0,1705", msg: "Rata-rata (p−y)² atas 10 pasien." },
              { kind: "equal", task: "t1", name: "pred_tinggi", value: 0.71, tol: 0.01, label: "`pred_tinggi` = 0,71", msg: "Rata-rata prediksi bin tinggi." },
              { kind: "equal", task: "t1", name: "obs_tinggi", value: 0.6, tol: 0.01, label: "`obs_tinggi` = 0,60", msg: "3 dari 5 pasien bin tinggi benar-benar sepsis." },
              { kind: "equal", task: "t1", name: "pred_rendah", value: 0.29, tol: 0.01, label: "`pred_rendah` = 0,29", msg: "Rata-rata prediksi bin rendah." },
              { kind: "equal", task: "t1", name: "obs_rendah", value: 0.2, tol: 0.01, label: "`obs_rendah` = 0,20", msg: "1 dari 5 pasien bin rendah benar-benar sepsis." },
              { kind: "equal", task: "t2", name: "ece", value: 0.1, tol: 0.01, label: "`ece` = 0,10", msg: "0,5×0,11 + 0,5×0,09 = 0,10." },
              { kind: "stdout_matches", task: "t2", pattern: "brier=0\\.1705\\s+pred_tinggi=0\\.71\\s+obs_tinggi=0\\.6\\s+pred_rendah=0\\.29\\s+obs_rendah=0\\.2\\s+ece=0\\.1", label: "`print` menampilkan keenamnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Bin tinggi: prediksi rata-rata 0,71, kejadian aktual 0,60. Brier global 0,1705. Apa artinya?",
              options: [
                { text: "Overconfident di bin itu — model melebih-lebihkan risiko 11 poin; Brier global tidak menunjukkan di mana", why: "Tepat: calibration plot menunjukkan LOKASI miskalibrasi (kedua bin overconfident); Brier hanya memberi satu angka global.", correct: true },
                { text: "Terkalibrasi dengan baik — Brier 0,1705 sudah kecil", why: "Salah: Brier kecil tidak berarti terkalibrasi — bandingkan dengan baseline 0,24 dan lihat selisih per bin (11 dan 9 poin)." },
                { text: "Underconfident — model meremehkan risiko", why: "Salah: prediksi (0,71) LEBIH TINGGI dari kejadian (0,60) — itu overconfident, bukan underconfident." },
                { text: "Tidak bisa disimpulkan — butuh Brier per desil", why: "Salah: justru Brier per desil yang tidak cukup — calibration plot (prediksi vs frekuensi per bin) yang membuktikan kalibrasi." },
              ],
            },
          ],
          reference: "Calibration plot = prediksi rata-rata vs frekuensi aktual per bin; ECE = selisih tertimbang (di sini 0,10, overconfident di kedua bin). Brier saja tidak menunjukkan lokasinya.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Kalibrasi (kejujuran angka) sama pentingnya dengan diskriminasi (AUC).",
        "Brier score menghukum overconfidence; calibration plot menampakkannya.",
        "Validasi: internal < temporal < eksternal. Klaim generalisasi butuh eksternal.",
        "Cegah leakage: prediction time eksplisit, fitur dibekukan sebelumnya.",
        "Threshold dari biaya klinis; waspadai drift; lapor sesuai TRIPOD.",
      ],
      next: { label: "HD13 — Fairness di Kesehatan", href: "/v2/learn/hd13-fairness-kesehatan" },
      quiz: [
        {
          q: "Perbedaan kalibrasi vs diskriminasi?",
          options: [
            { text: "Kalibrasi = kejujuran angka probabilitas; diskriminasi = kemampuan mengurutkan (AUC)", why: "Benar: dokter butuh keduanya — ranking untuk prioritas, angka jujur untuk keputusan.", correct: true },
            { text: "Sama saja", why: "Beda sumbu: model bisa mengurutkan dengan baik tapi angkanya bohong." },
            { text: "Kalibrasi untuk regresi saja", why: "Kalibrasi justru krusial untuk model probabilitas klasifikasi klinis." },
            { text: "Diskriminasi tidak penting", why: "Diskriminasi tetap dibutuhkan untuk prioritas — hanya tidak cukup sendirian." },
          ],
        },
        {
          q: "Brier score menghukum terutama…",
          options: [
            { text: "Overconfidence — prediksi ekstrem yang salah", why: "Benar: (p−y)² meledak saat p=95% tapi y=0. Kejujuran tentang ketidakpastian dihargai.", correct: true },
            { text: "Model lambat", why: "Kecepatan komputasi tidak masuk Brier score." },
            { text: "Model sederhana", why: "Model sederhana yang terkalibrasi justru bisa punya Brier baik." },
            { text: "Data kecil", why: "Ukuran data tidak dihukum Brier — yang dihukum adalah ketidakjujuran angka." },
          ],
        },
        {
          q: "Model AUC 0,85 di RS A, 0,65 di RS B. Tindakan?",
          options: [
            { text: "Jangan deploy di B tanpa investigasi/rekalibrasi — validasi eksternal gagal", why: "Benar: generalisasi tidak terbukti. Cari penyebab (populasi, definisi, EHR) sebelum pakai.", correct: true },
            { text: "Deploy di B juga", why: "Itu malapraktik analitik — performa anjlok 20 poin adalah sinyal bahaya." },
            { text: "Rata-ratakan saja", why: "Rata-rata AUC tidak membuat model aman dipakai di B." },
            { text: "Buang modelnya", why: "Terlalu cepat: rekalibrasi atau retraining lokal mungkin menyelamatkannya." },
          ],
        },
        {
          q: "Decision curve menunjukkan model kalah dari “obati semua” pada threshold operasional. Artinya?",
          options: [
            { text: "Model merugikan pada threshold itu — jangan pakai di sana", why: "Benar: utilitas klinis ditentukan threshold operasional, bukan AUC. Model bisa akurat tapi tak berguna.", correct: true },
            { text: "Model tetap bagus karena AUC tinggi", why: "AUC tidak mengukur manfaat pada threshold keputusan nyata." },
            { text: "Threshold salah hitung", why: "Threshold operasional berasal dari biaya klinis — bukan dari kesalahan hitung." },
            { text: "Abaikan saja", why: "Mengabaikan net benefit negatif berarti mendeploy model yang merugikan." },
          ],
        },
        {
          q: "TRIPOD adalah…",
          options: [
            { text: "Checklist pelaporan model prediksi agar transparan dan reproducible", why: "Benar: standar pelaporan (populasi, prediktor, outcome, validasi, performa). TRIPOD+AI untuk model ML.", correct: true },
            { text: "Model machine learning baru", why: "TRIPOD bukan model — ia checklist pelaporan." },
            { text: "Tes diagnostik", why: "Tidak ada hubungannya dengan tes diagnostik." },
            { text: "Regulasi obat", why: "Regulasi obat adalah ranah BPOM/FDA, bukan TRIPOD." },
          ],
        },
      ],
    },
  ],
};

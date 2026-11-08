import type { V2Lesson } from "../lib/types";

export const mr16: V2Lesson = {
  slug: "mr16-regulasi-frtb",
  track: "Market Risk",
  module: "Regulasi FRTB",
  title: "MR16 — Regulasi Risiko Pasar: Dari Basel 2.5 ke FRTB",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-darah",
      eyebrow: "Langkah 1 · Basel 2.5",
      title: "Cerita: aturan yang ditulis dengan darah",
      prose: [
        "2009. Asap krisis 2008 belum hilang. Regulator Basel berkumpul dan bertanya: mengapa modal risiko pasar bank-bank runtuh begitu cepat? Jawabannya pahit: (1) VaR dihitung dari data masa tenang — modal menyusut tepat sebelum krisis; (2) tidak ada capital charge untuk risiko kredit di trading book — padahal sekuritisasi itulah yang meledak; (3) korelasi yang diasumsikan stabil ternyata melonjak ke 1.",
        "Lahirlah Basel 2.5 — tambalan darurat dengan tiga tambahan utama. Stressed VaR: hitung VaR 99%/10-hari dari periode stres historis 12-bulan (bukan data kini!); modal = VaR biasa + Stressed VaR (masing-masing × multiplier). Intuisi: jangan biarkan modal menyusut di masa tenang — komponen stres menjaga lantai modal; obat untuk amnesia model (kalibrasi di masa tenang membuat VaR buta menjelang krisis). IRC (Incremental Risk Charge): capital charge untuk risiko default & migrasi rating di trading book (99,9%/1-tahun) — menutup lubang risiko kredit di trading book tidak kena charge. Comprehensive Risk Measure: untuk portofolio korelasi kompleks (CDO) — dengan floor ke pendekatan standar.",
        "Tetapi tambalan menumpuk di atas fondasi retak. Maka Basel meluncurkan proyek 7 tahun: FRTB (Fundamental Review of the Trading Book) — bukan tambalan, melainkan bangun ulang total: definisi ulang boundary (mana yang masuk trading book vs banking book — anti-arbitrase), ganti VaR → ES, dan ujian kelulusan model yang jauh lebih keras. Regulasi bukan sekadar aturan — ia arsitektur insentif yang membentuk perilaku seluruh industri.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga kegagalan yang dijawab Basel 2.5." },
        { id: "t2", text: "Jelaskan intuisi Stressed VaR dalam satu kalimat." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Warisan Basel 2.5: prinsip modal harus tahan krisis, bukan cuma masa tenang — yang kemudian disempurnakan FRTB via ES + liquidity horizon. Setiap kali modelmu terlihat terlalu tenang, tanyakan: di mana komponen stresnya?",
        type: "risk",
      },
      reference: "Basel 2.5 = Stressed VaR + IRC + CRM. Tambalan darurat sebelum bangun ulang (FRTB).",
    },
    {
      id: "lima-pilar",
      eyebrow: "Langkah 2 · FRTB",
      title: "Lima pilar revolusi FRTB",
      prose: [
        "FRTB (Fundamental Review of the Trading Book, Basel 2016+, implementasi bertahap) membangun ulang kerangka modal risiko pasar dalam lima pilar. Pertama, boundary ketat trading vs banking book — daftar presumptive, anti-arbitrase. Kedua, VaR → ES: metrik modal beralih ke Expected Shortfall 97,5% (koheren + menangkap tail — rata-rata kerugian di luar VaR).",
        "Ketiga, liquidity horizon: bukan lagi 10-hari untuk semua — tiap kelas aset punya horizon sesuai likuiditasnya (10 s/d 120 hari). Keempat, desk-level approval: izin model internal diberikan per trading desk (bukan per bank!) — desk yang gagal ujian kembali ke standar. Kelima, NMRF: faktor yang tak bisa dimodelkan kena charge terpisah yang mahal.",
        "Pola modalnya ilustratif: Basel 2.5 melonjakkan modal (tambalan darurat); FRTB SA menurunkannya sedikit tetapi lebih sensitif risiko (berbasis sensitivitas); FRTB IMA memberi diskon untuk model bagus — insentif untuk investasi model. Pesan: regulator tidak sekadar menaikkan modal — ia merancang insentif: model bagus = modal murah.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan lima pilar FRTB." },
        { id: "t2", text: "Jelaskan kenapa FRTB disebut arsitektur insentif, bukan sekadar palu modal." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira FRTB hanya menaikkan modal bank. Dampak agregat bervariasi — untuk portofolio sederhana & likuid, FRTB bisa menurunkan modal vs Basel 2.5. Yang pasti berubah: struktur insentif (model bagus didiskon, faktor illiquid dihukum, desk dinilai sendiri-sendiri).",
        type: "pitfall",
      },
      reference: "5 pilar: boundary, ES 97,5%, liquidity horizon, desk-level, NMRF.",
    },
    {
      id: "sbm",
      eyebrow: "Langkah 3 · SBM",
      title: "SBM: pendekatan standar berbasis sensitivitas",
      prose: [
        "SBM (Sensitivities-Based Method) = cara standar FRTB: hitung sensitivitas tiap posisi ke risk factor yang ditentukan regulator, lalu agregasikan dengan bobot risiko & korelasi yang ditentukan: SA = √(ΣK_b² + Σγ_bc·K_b·K_c) + DRC + RRAO. K_b = capital charge per bucket (kelas risiko) — dari sensitivitas × bobot risiko; γ_bc = korelasi antar bucket yang ditetapkan regulator (bukan dari data bank!); DRC = Default Risk Charge (risiko default di trading book); RRAO = Residual Risk Add-On (risiko eksotik tak tertangkap, misal gap risk).",
        "Tiga komponen risiko dalam SBM: delta (arah), vega (volatilitas), curvature (non-linearitas — versi regulator dari gamma/convexity!). Perhatikan: regulator memaksa pengukuran orde-2 (curvature) — pelajaran dari krisis yang diabaikan VaR linear (aproksimasi delta-only gagal di tekukan payoff opsi).",
        "Kapan dipakai: default untuk semua bank; wajib untuk desk yang gagal atau tak punya IMA; dan sebagai floor pembanding. Lebih mahal untuk portofolio kompleks — insentif untuk membangun model bagus.",
      ],
      formula: String.raw`\text{SA} = \sqrt{\sum_b K_b^2 + \sum_{b \neq c} \gamma_{bc} K_b K_c} + \text{DRC} + \text{RRAO}`,
      formulaNote: "K_b = capital charge per bucket (sensitivitas × bobot risiko regulator); γ_bc = korelasi antar bucket yang DITETAPKAN regulator (bukan dari data bank!); DRC = Default Risk Charge (risiko default di trading book); RRAO = Residual Risk Add-On (risiko eksotik tak tertangkap, misal gap risk). SBM mengukur tiga komponen: delta (arah), vega (vol), curvature (non-linearitas — orde-2 wajib!). Interpretasi: korelasi versi regulator = pelajaran correlation breakdown — bank tidak boleh mengandalkan diversifikasi versinya sendiri untuk modal.",
      tasks: [
        { id: "t1", text: "Jelaskan tiap simbol dalam rumus SBM." },
        { id: "t2", text: "Kenapa regulator memaksa komponen curvature?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Korelasi antar bucket ditetapkan regulator, bukan dari data bank — pelajaran dari correlation breakdown setiap krisis (korelasi melonjak ke 1 saat stres). Bank tidak boleh mengandalkan diversifikasi versi mereka sendiri untuk modal.",
        type: "risk",
      },
      reference: "SBM = sensitivitas × bobot regulator; delta + vega + curvature; + DRC + RRAO.",
    },
    {
      id: "ima-es",
      eyebrow: "Langkah 4 · IMA & ES",
      title: "Model internal: ES 97,5% dengan liquidity horizon",
      prose: [
        "IMA (Internal Models Approach) = bank boleh pakai model internal (ES 97,5%) — jika lolos ujian. Komponen modal IMA: IMA = max(ES_T, m_c·ES_rata-rata-60-hari) + NMRF + DRC, dengan m_c = multiplier (1,5 + add-on dari backtest — mirip sistem lampu lalu lintas backtest: hijau/kuning/merah!).",
        "ES dengan liquidity horizon: ES dihitung per horizon likuiditas (10/20/40/60/120 hari sesuai kelas aset), lalu diagregasi: ES = √(ES_1² + Σ(ES_j·√((LH_j−LH_{j−1})/10))²). Intuisi: aset illiquid (LH=120 hari) memberi kontribusi lebih besar — hukuman otomatis untuk illiquiditas. Inilah versi regulasi dari LVaR (VaR yang ditambah biaya likuidasi).",
        "Kenapa 97,5%? Dikalibrasi agar ≈ VaR 99% untuk distribusi normal — tetapi lebih besar untuk ekor tebal (menghukum tail risk diam-diam). Buktikan: pada 40 kerugian (35 normal kecil + 2 ekstrem 25 dan 35), VaR 99% = 31,10 sedangkan ES 97,5% = 35,00 — ES diam-diam lebih besar. Pilihan 97,5% bukan acak: tidak menggegerkan modal agregat, tetapi mengubah insentif terhadap tail risk.",
      ],
      formula: String.raw`ES = \sqrt{ES_1^2 + \sum_j \left(ES_j \sqrt{\tfrac{LH_j - LH_{j-1}}{10}}\right)^2}`,
      formulaNote: "ES_j = expected shortfall untuk bucket liquidity horizon ke-j; LH_j = liquidity horizon (10/20/40/60/120 hari sesuai kelas aset). Akar ((LH_j − LH_{j−1})/10) = skala waktu: horizon lebih panjang → kontribusi lebih besar. Contoh lab: pada data berekor tebal, VaR 99% = 31,10 sedangkan ES 97,5% = 35,00 — ES diam-diam lebih besar. Interpretasi: 97,5% dikalibrasi ≈ VaR 99% untuk normal, tetapi menghukum tail risk — dan liquidity horizon menghukum illiquiditas otomatis.",
      tasks: [
        { id: "t1", text: "Hitung `var99` dan `es975` dari `losses` (gunakan fungsi `pct`)" },
        { id: "t2", text: "Bandingkan dan simpulkan: kapan ES 97,5% > VaR 99%?" },
      ],
      expected: "var99=31.10  es975=35.00",
      note: {
        title: "Sering salah",
        body: "Mengira ES 97,5% selalu ≈ VaR 99%. Kesetaraan itu hanya untuk distribusi normal — untuk ekor tebal, ES 97,5% diam-diam lebih besar. Itulah inti insentifnya: portofolio berekor tebal membayar modal lebih mahal tanpa perdebatan.",
        type: "pitfall",
      },
      hints: [
        "var99 = pct(losses, 0.99); n_tail = ceil(0.025 * len(losses)).",
        "es975 = rata-rata n_tail kerugian terbesar: sorted(losses, reverse=True)[:n_tail].",
        "Perlu import math untuk floor dan ceil.",
      ],
      code: {
        starter: `import math\n\n# 40 kerugian (Rp miliar): 38 kecil + 2 ekstrem\nlosses = [1]*10 + [2]*10 + [3]*8 + [4]*6 + [5]*4 + [25, 35]\n\ndef pct(xs, p):\n    s = sorted(xs)\n    k = (len(s) - 1) * p\n    f = math.floor(k)\n    return s[f] + (s[f + 1] - s[f]) * (k - f)\n\n# TULIS KODEMU: VaR 99% dan ES 97,5%\nvar99 = \nn_tail = \nes975 = \n\nprint(f"var99={var99:.2f}  es975={es975:.2f}")`,
        lockLines: 11,
        solution: `import math\n\n# 40 kerugian (Rp miliar): 38 kecil + 2 ekstrem\nlosses = [1]*10 + [2]*10 + [3]*8 + [4]*6 + [5]*4 + [25, 35]\n\ndef pct(xs, p):\n    s = sorted(xs)\n    k = (len(s) - 1) * p\n    f = math.floor(k)\n    return s[f] + (s[f + 1] - s[f]) * (k - f)\n\n# TULIS KODEMU: VaR 99% dan ES 97,5%\nvar99 = pct(losses, 0.99)\nn_tail = math.ceil(0.025 * len(losses))\nes975 = sum(sorted(losses, reverse=True)[:n_tail]) / n_tail\n\nprint(f"var99={var99:.2f}  es975={es975:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var99", value: 31.1, tol: 0.01, label: "`var99` seharusnya 31.10", msg: "pct(losses, 0.99). Cek interpolasi kuantilnya." },
          { kind: "equal", task: "t1", name: "es975", value: 35.0, tol: 1e-9, label: "`es975` seharusnya 35.00", msg: "Rata-rata 1 kerugian terburuk (2,5% dari 40 = 1)." },
          { kind: "stdout_matches", task: "t2", pattern: "var99=31\\.10\\s+es975=35\\.00", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "IMA = max(ES, m_c·ES_avg60) + NMRF + DRC. ES 97,5% ≈ VaR 99% utk normal; > utk ekor tebal.",
    },
    {
      id: "ujian-ima",
      eyebrow: "Langkah 5 · Ujian IMA",
      title: "Dua ujian kelulusan: backtest & PLA",
      prose: [
        "Izin IMA diberikan per trading desk — bukan per bank! Desk yang gagal ujian kembali ke SBM (modal naik). Dua ujian kelulusan per desk. Pertama, backtesting: bandingkan VaR 99%/97,5% vs P&L aktual — zona merah = model ditolak, desk ditendang dari IMA. Kedua, P&L Attribution (PLA): model harus menjelaskan P&L — dua uji: korelasi Spearman RTPL vs HPL harus tinggi (arah benar); Kolmogorov-Smirnov: distribusi RTPL vs HPL tidak boleh beda jauh (bentuk benar).",
        "Kenapa PLA penting: backtest hanya menguji frekuensi pelanggaran — model yang beruntung bisa lolos. PLA menguji apakah model benar-benar memahami risiko: jika RTPL tak berkorelasi dengan P&L aktual, modelmu fiksi — walau backtest hijau! PLA adalah ujian yang lebih jujur: ia bertanya apakah modelmu mengerti P&L, bukan cuma apakah pelanggaranmu pas jumlahnya.",
        "Mini-case: desk gagal PLA (Spearman 0,62) tetapi backtest hijau. Konsekuensi FRTB: desk ditendang dari IMA kembali ke SBM — modal naik. Dua ujian, dua-duanya wajib lolos per desk. PLA gagal = model tidak memahami P&L = tidak layak untuk modal internal. Desk dengan backtest hijau tetapi PLA merah = model yang benar secara kebetulan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung korelasi Spearman `rho` antara `rtpl` dan `hpl`" },
        { id: "t2", text: "Tentukan `lolos` (ambang 0,8), lalu cetak keduanya" },
      ],
      expected: "rho=0.9762  lolos=True",
      note: {
        title: "Kaitan ke risk",
        body: "Granularitas per desk = akuntabilitas: desk dengan model jelek tidak bisa bersembunyi di balik bank yang besar; ia kembali ke SBM (mahal) sementara desk bagus tetap di IMA. Insentif tepat sasaran ke unit bisnis.",
        type: "risk",
      },
      hints: [
        "Urutkan tiap list untuk dapat rank; rho = 1 - 6*Σd²/(n(n²-1)).",
        "d = selisih rank tiap pasangan.",
        "lolos = rho > 0.8.",
      ],
      code: {
        starter: `# RTPL (prediksi model) vs HPL (aktual), 8 hari\nrtpl = [1, 2, 3, 4, 5, 6, 7, 8]\nhpl  = [1.1, 2.5, 3.5, 3.8, 5.1, 5.9, 7.2, 7.0]\n\n# TULIS KODEMU: rank tiap list, lalu Spearman rho\ndef ranks(xs):\n    s = sorted(xs)\n    return [s.index(x) + 1 for x in xs]\nrr, hr = ranks(rtpl), ranks(hpl)\nn = len(rtpl)\nd2 = \nrho = \nlolos = \n\nprint(f"rho={rho:.4f}  lolos={lolos}")`,
        lockLines: 9,
        solution: `# RTPL (prediksi model) vs HPL (aktual), 8 hari\nrtpl = [1, 2, 3, 4, 5, 6, 7, 8]\nhpl  = [1.1, 2.5, 3.5, 3.8, 5.1, 5.9, 7.2, 7.0]\n\n# TULIS KODEMU: rank tiap list, lalu Spearman rho\ndef ranks(xs):\n    s = sorted(xs)\n    return [s.index(x) + 1 for x in xs]\nrr, hr = ranks(rtpl), ranks(hpl)\nn = len(rtpl)\nd2 = sum((a - b) ** 2 for a, b in zip(rr, hr))\nrho = 1 - 6 * d2 / (n * (n * n - 1))\nlolos = rho > 0.8\n\nprint(f"rho={rho:.4f}  lolos={lolos}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rho", value: 0.9762, tol: 0.001, label: "`rho` seharusnya 0.9762", msg: "1 − 6×2/(8×63). Cek rank hpl: [1,2,3,4,5,6,8,7]." },
          { kind: "equal", task: "t2", name: "lolos", value: true, label: "`lolos` seharusnya True", msg: "0,9762 > 0,8 → lolos PLA (arah benar)." },
          { kind: "stdout_matches", task: "t2", pattern: "rho=0\\.9762\\s+lolos=True", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "IMA per desk. Ujian: backtest + PLA (Spearman arah, KS bentuk). Gagal satu = kembali ke SBM.",
    },
    {
      id: "nmrf-peta",
      eyebrow: "Langkah 6 · NMRF & peta",
      title: "Faktor yang tak bisa dimodelkan — dan peta keputusan",
      prose: [
        "NMRF (Non-Modellable Risk Factor) = faktor risiko yang tidak memenuhi uji likuiditas data: kurang dari 24 observasi harga real per tahun, atau gap > 1 bulan tanpa data. Contoh: harga obligasi eksotis yang jarang diperdagangkan, volatilitas implisit strike jauh. Charge NMRF dihitung via stress skenario (bukan ES!) — dan tidak boleh ada diversifikasi antar NMRF (dijumlah mentah!).",
        "Ini sengaja mahal — insentif untuk: (1) perbaiki data pasar, (2) kurangi eksposur ke faktor tak likuid, atau (3) terima charge mahal. Sebelum FRTB, bank bisa memodelkan apa saja dengan interpolasi; kini tidak ada data real = tidak bisa model = bayar mahal. Data pasar menjadi aset regulasi — kaitan langsung ke data lineage (peta asal-usul & kualitas data harga). NMRF bukan masalah teknis data — ia senjata insentif.",
        "Peta keputusan: bank tanpa model internal atau desk gagal ujian → SBM (standar, transparan, berbasis sensitivitas delta/vega/curvature; lebih mahal untuk kompleks — insentif bangun model bagus). Desk dengan model teruji → IMA (ES 97,5% + liquidity horizon; modal lebih rendah = diskon kualitas; harga: investasi validasi & data berkelanjutan). Faktor tak likuid → terima NMRF yang mahal, atau perbaiki data/kurangi eksposur. Aturan 10 detik: tidak ada data = tidak ada model = bayar mahal.",
        "Keputusan SA vs IMA — matematika bisnisnya. IMA memberi modal lebih rendah TETAPI berbiaya: investasi model, data 24-observasi per faktor, validasi berkelanjutan, dan risiko gagal PLA lalu ditendang kembali ke SBM (lihat mini-case di bawah). Aturan keputusan: pilih IMA jika (a) portofolio kompleks & besar — penghematan modal melebihi biaya infrastruktur; (b) data pasar cukup untuk lolos uji NMRF; (c) desk punya rekam backtest hijau + PLA kuat. Untuk bank kecil atau portofolio sederhana: SBM lebih murah secara total — transparan, tanpa risiko gagal ujian. Jebakan: mengejar IMA demi gengsi lalu gagal PLA = modal naik + biaya validasi hangus. Hitung total cost of ownership, bukan cuma angka modal.",
        "Konteks Indonesia: OJK mengadopsi kerangka Basel secara bertahap — bank-bank besar (KBMI 3/4) wajib melaporkan dengan standar selaras Basel III, termasuk komponen modal risiko pasar. Implikasi praktis untuk bank Indonesia: boundary trading vs banking book menentukan perlakuan SBN di trading book; dan data pasar domestik yang tipis (obligasi korporasi jarang diperdagangkan) = risiko NMRF yang nyata — faktor yang tidak memenuhi 24 observasi harga real per tahun kena stress charge mahal tanpa diversifikasi. Pelajaran: investasi data pasar domestik (price source independen, IPV yang rapi) bukan beban compliance — melainkan penghemat modal.",
      ],
      tasks: [
        { id: "t1", text: "Faktor risiko dengan 10 harga real per tahun. Perlakuan FRTB?" },
        { id: "t2", text: "Bank kecil tanpa model internal. Pendekatan apa dan kenapa?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira NMRF hanya masalah teknis data. Charge-nya dirancang menyakitkan agar bank memperbaiki kualitas data atau keluar dari posisi tak likuid. Bank yang mengabaikan masalah data membayarnya via modal — mahal dan permanen sampai data diperbaiki.",
        type: "pitfall",
      },
      reference: "NMRF: <24 obs/tahun → stress charge tanpa diversifikasi. SBM default; IMA untuk yang lolos.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Regulator merancang insentif, bukan sekadar palu",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson: FRTB bukan sekadar aturan modal — ia arsitektur insentif yang membentuk perilaku industri. Setiap pilarnya adalah insentif: model bagus = modal murah (IMA); data buruk = bayar mahal (NMRF); desk bermodel jelek = kembali ke standar yang mahal (desk-level). Regulator tidak melarang — ia membuat yang buruk menjadi mahal.",
        "Tiga pertanyaan yang diajukan praktisi senior sebelum memilih pendekatan: (1) apakah penghematan modal IMA melebihi total cost of ownership-nya (model + data + validasi + risiko gagal PLA)? (2) apakah data pasar kita cukup untuk lolos uji NMRF — atau kita akan membayar stress charge mahal? (3) per desk, bukan per bank: desk mana yang lolos PLA dan mana yang tidak?",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa FRTB disebut arsitektur insentif, bukan sekadar palu modal." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke bank menengah dengan portofolio obligasi sederhana." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk regulasi risiko pasar. Pertama, pahami urutan sejarahnya: Basel 2.5 adalah tambalan darurat (Stressed VaR + IRC — jangan biarkan modal menyusut di masa tenang); FRTB adalah bangun ulang total (boundary, ES, liquidity horizon, desk-level, NMRF). Setiap krisis menulis aturannya dengan darah — dan aturan berikutnya selalu menutup lubang yang dieksploitasi sebelumnya. Kedua, hafalkan logika angka-angkanya: ES 97,5% dikalibrasi ≈ VaR 99% untuk distribusi normal — tetapi diam-diam lebih besar untuk ekor tebal (menghukum tail risk tanpa perdebatan); liquidity horizon 10–120 hari menghukum illiquiditas otomatis (versi regulasi dari LVaR); korelasi antar bucket ditetapkan regulator (pelajaran correlation breakdown — bank tidak boleh memakai diversifikasi versinya sendiri untuk modal). Ketiga, PLA adalah ujian yang lebih jujur dari backtest: backtest hanya menghitung pelanggaran (model beruntung bisa lolos), PLA menguji apakah model memahami P&L (Spearman untuk arah, KS untuk bentuk). Keempat, NMRF bukan masalah teknis data — ia senjata insentif: tidak ada 24 observasi harga real = tidak boleh model = bayar stress charge mahal tanpa diversifikasi. Investasi data pasar adalah penghemat modal. Kelima, untuk Indonesia: data pasar domestik yang tipis membuat NMRF menjadi risiko nyata — price source independen dan IPV yang rapi adalah infrastruktur modal, bukan beban compliance. Dan terakhir: izin IMA per desk (bukan per bank) = akuntabilitas — desk bermodel buruk tidak bisa bersembunyi di balik bank besar.",
      },
      reference: "FRTB = insentif: model bagus murah, data buruk mahal, desk dinilai sendiri. Hitung total cost of ownership.",
    },
    {
      id: "minicase-desk-gagal",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Desk yang kehilangan IMA: Rp45 miliar modal menguap",
      prose: [
        "Desk derivatif suku bunga Bank Cakrawala memakai IMA selama 3 tahun — modal risiko pasar Rp120 miliar (vs Rp165 miliar jika memakai SBM; penghematan Rp45 miliar per tahun). Tahun ini, uji PLA: korelasi Spearman RTPL vs HPL = 0,62 — di bawah ambang. Backtest masih hijau (4 pelanggaran, zona kuning). Desk mengajukan banding: 'backtest kami baik-baik saja!'",
        "Keputusan regulator: IMA dicabut untuk desk ini — kembali ke SBM. Modal naik Rp45 miliar seketika. Investigasi internal menemukan penyebabnya: model desk memakai volatilitas implisit dari satu broker (stale, jarang di-update) — RTPL tidak lagi mencerminkan P&L aktual. Modelnya 'benar secara kebetulan' selama 3 tahun: backtest hijau karena pasar tenang, bukan karena model memahami risiko.",
        "Tiga pelajaran: PLA menguji pemahaman, bukan keberuntungan — backtest hijau tidak menyelamatkan desk yang modelnya fiksi. Data (vol implisit basi) adalah akar kegagalan — lagi-lagi data lineage menentukan nasib modal. Dan Rp45 miliar adalah harga satu ambang PLA: investasi data & validasi berkelanjutan jauh lebih murah dari kehilangan IMA. IMA bukan hadiah permanen — ia sewa tahunan yang dibayar dengan PLA hijau.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa desk kehilangan IMA walau backtest-nya hijau." },
        { id: "t2", text: "Apa akar masalahnya dan apa pencegahannya?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira IMA yang sudah didapat = permanen. IMA adalah izin tahunan per desk yang dipertahankan dengan backtest hijau DAN PLA lolos — gagal satu = kembali ke SBM. Bank yang berhenti berinvestasi di data/validasi setelah lolos = menyewa IMA lalu berhenti membayar sewanya.",
        type: "pitfall",
      },
      reference: "PLA 0,62 < ambang → IMA dicabut → modal +Rp45 M. IMA = sewa tahunan, dibayar dengan PLA hijau.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR17.",
      ],
      tasks: [],
      summary: [
        "Basel 2.5: Stressed VaR + IRC — modal harus tahan krisis, bukan cuma masa tenang.",
        "FRTB 5 pilar: boundary ketat, ES 97,5%, liquidity horizon (10–120 hari), desk-level approval, NMRF.",
        "SBM: sensitivitas × bobot regulator; delta + vega + curvature (orde-2 wajib!); + DRC + RRAO.",
        "IMA = max(ES, m_c·ES_avg60) + NMRF + DRC; ujian per desk: backtest + PLA (Spearman & KS).",
        "NMRF: <24 obs/tahun → stress charge tanpa diversifikasi — sengaja mahal.",
        "FRTB = arsitektur insentif: model bagus = modal murah; data buruk = bayar mahal.",
      ],
      next: { label: "MR17 — Limit & Laporan", href: "/v2/learn/mr17-limit-laporan" },
      quiz: [
        {
          q: "Inovasi utama Basel 2.5 dibanding Basel I/II untuk risiko pasar?",
          options: [
            { text: "Menurunkan modal", why: "justru menaikkan via komponen stres." },
            { text: "Stressed VaR (VaR dari periode krisis) + IRC — memaksa modal tahan krisis, bukan cuma masa tenang", why: "VaR dari data tenang = modal menyusut sebelum krisis. Stressed VaR mengunci periode stres sebagai jangkar.", correct: true },
            { text: "Menghapus VaR", why: "VaR tetap dipakai, ditambah komponen stres." },
            { text: "Melarang derivatif", why: "tidak ada larangan seperti itu." },
          ],
        },
        {
          q: "Mengapa FRTB memilih ES 97,5% (bukan VaR 99%)?",
          options: [
            { text: "Agar modal turun", why: "bukan soal menurunkan modal." },
            { text: "ES koheren + menangkap tail risk; 97,5% dikalibrasi ≈ VaR 99% untuk normal — tetapi lebih besar untuk ekor tebal", why: "kalibrasi cerdas — tidak menggegerkan modal agregat, tetapi mengubah insentif terhadap tail risk.", correct: true },
            { text: "VaR terlalu sulit", why: "VaR justru lebih mudah." },
            { text: "Supaya terlihat modern", why: "alasannya teknis dan insentif." },
          ],
        },
        {
          q: "Desk gagal PLA (Spearman 0,62) tetapi backtest hijau. Konsekuensi FRTB?",
          options: [
            { text: "Tidak apa-apa — backtest yang penting", why: "PLA setara pentingnya dengan backtest." },
            { text: "Desk ditendang dari IMA kembali ke SBM (modal naik) — PLA adalah ujian kelulusan yang setara", why: "dua ujian, dua-duanya wajib lolos per desk. PLA gagal = model tidak memahami P&L.", correct: true },
            { text: "Cukup perbaiki tahun depan", why: "konsekuensinya langsung — kembali ke SBM." },
            { text: "Denda kecil", why: "bukan denda kecil, melainkan kehilangan IMA." },
          ],
        },
        {
          q: "Faktor risiko dengan hanya 10 harga real per tahun. Perlakuan FRTB?",
          options: [
            { text: "Boleh dimodelkan seperti biasa", why: "tidak memenuhi uji 24 observasi." },
            { text: "NMRF — tidak memenuhi uji 24 observasi → stress charge terpisah tanpa diversifikasi (sengaja mahal)", why: "NMRF = bayar mahal untuk data buruk.", correct: true },
            { text: "Diabaikan", why: "justru kena charge khusus." },
            { text: "Dilarang diperdagangkan", why: "boleh, tetapi mahal modalnya." },
          ],
        },
        {
          q: "Izin IMA diberikan per apa — dan mengapa itu penting?",
          options: [
            { text: "Per bank — lebih sederhana", why: "justru per desk." },
            { text: "Per trading desk — desk bermodel buruk tidak bisa bersembunyi di balik bank besar", why: "granularitas per desk = akuntabilitas; insentif tepat sasaran ke unit bisnis.", correct: true },
            { text: "Per negara", why: "bukan itu." },
            { text: "Per trader", why: "terlalu granular; per desk yang benar." },
          ],
        },
        {
          q: "Bank kecil dengan portofolio obligasi sederhana mempertimbangkan IMA. Nasihat tepat?",
          options: [
            { text: "Kejar IMA — selalu lebih murah modalnya", why: "belum tentu: total cost of ownership bisa melebihi penghematan." },
            { text: "Hitung total cost of ownership: untuk portofolio sederhana, SBM biasanya lebih murah total — transparan, tanpa risiko gagal PLA", why: "IMA = investasi model + data + validasi + risiko ditendang ke SBM. Gengsi IMA yang gagal = modal naik + biaya hangus.", correct: true },
            { text: "IMA wajib untuk semua bank", why: "SBM adalah default yang sah." },
            { text: "Pilih berdasarkan gengsi", why: "keputusan modal bukan soal gengsi." },
          ],
        },
      ],
    },
  ],
};

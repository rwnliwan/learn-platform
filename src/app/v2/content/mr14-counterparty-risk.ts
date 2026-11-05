import type { V2Lesson } from "../lib/types";

export const mr14: V2Lesson = {
  slug: "mr14-counterparty-risk",
  track: "Market Risk",
  module: "Risiko Counterparty",
  title: "MR14 — Counterparty Risk: Saat Lawan Transaksimu yang Gagal Bayar",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-keuntungan",
      eyebrow: "Langkah 1 · Exposure",
      title: "Cerita: keuntungan yang menguap",
      prose: [
        "Bank memiliki portofolio swap suku bunga dengan sebuah perusahaan energi — nilai mark-to-market menguntungkan bank Rp80 miliar. Di laporan, itu keuntungan. Di sistem, itu piutang. Perusahaan energi itu gagal bayar. Bank tidak menerima Rp80 miliar — malah harus mengganti posisi swap itu di pasar dengan biaya Rp80 miliar (replacement cost). Keuntungan berubah menjadi kerugian dalam semalam, tanpa ada pergerakan pasar sama sekali.",
        "Twist-nya: risiko ini tidak terlihat di VaR pasar — VaR mengukur pergerakan harga, bukan kebangkrutan lawan transaksi. Dan lebih licik lagi: exposure-nya berubah setiap hari mengikuti harga pasar. Hari ini Rp80 miliar, bulan depan bisa Rp20 miliar atau Rp150 miliar — tergantung pasar. Inilah counterparty credit risk (CCR): risiko kredit yang menari mengikuti pasar.",
        "Jika counterparty default hari ini, kerugian = nilai positif derivatif saat ini (yang negatif = bank yang berutang → tidak rugi). Karena nilai berubah, exposure masa depan adalah distribusi: EE_t (Expected Exposure) = rata-rata nilai positif di waktu-t; PFE_t = kuantil tinggi (misal 95%) — skenario buruk exposure; EPE = rata-rata EE sepanjang hidup transaksi (untuk modal). Bentuk khas profil swap: punuk — naik dulu (ketidakpastian menumpuk), lalu turun (tenor tersisa menipis). EE untuk CVA/pricing; PFE untuk limit. Jangan tertukar.",
      ],
      formula: String.raw`EE_t = E[\max(V_t, 0)]`,
      formulaNote: "EE_t = expected exposure di waktu-t: rata-rata dari nilai positif derivatif (V_t) — nilai negatif di-nol-kan karena jika bank yang berutang, bank tidak rugi saat counterparty default. PFE_t = kuantil tinggi (misal 95%) exposure — skenario buruk untuk limit. EPE = rata-rata EE sepanjang hidup transaksi — untuk modal. Contoh lab: EE [5,12,18,15,10,6] → EPE = 11,0, puncak tahun ke-3. Interpretasi: profil swap berbentuk punuk — EE untuk harga (CVA), PFE untuk limit, jangan tertukar.",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa kerugian bank = Rp80 M (bukan nol) saat counterparty default." },
        { id: "t2", text: "Kapan memakai EE dan kapan memakai PFE?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira derivatif bernilai nol tidak punya risiko counterparty. Nilai kini nol ≠ exposure masa depan nol: swap yang ATM hari ini bisa bernilai +Rp50 M bulan depan jika suku bunga bergerak. PFE selalu positif untuk derivatif — risiko counterparty ada sejak hari pertama, bahkan saat mark-to-market nol.",
        type: "pitfall",
      },
      reference: "CCR: risiko kredit yang mengikuti pasar. EE untuk harga, PFE untuk limit.",
    },
    {
      id: "ee-pfe",
      eyebrow: "Langkah 2 · Profil EE/PFE",
      title: "Membaca punuk exposure",
      prose: [
        "Profil EE swap 6 tahun (Rp miliar): [5, 12, 18, 15, 10, 6]. Punuknya jelas: naik ke puncak 18 di tahun ke-3 (ketidakpastian menumpuk seiring waktu), lalu turun (tenor tersisa menipis → nilai konvergen ke nol). Puncak punuk = titik risiko maksimum — di sinilah bank paling rentan jika counterparty default.",
        "EPE (Expected Positive Exposure) = rata-rata EE sepanjang hidup transaksi = 11,0 — dipakai untuk modal. PFE 95% ≈ 1,8× EE di tiap titik — dipakai untuk limit. Exposure derivatif ≠ exposure kredit biasa: kredit Rp100 M = exposure Rp100 M (tetap, menurun saat diangsur); swap Rp100 M notional = exposure berubah-ubah, bisa 0, bisa Rp15 M — tergantung pasar. Inilah mengapa CCR butuh simulasi Monte Carlo, bukan sekadar baca baki debet.",
        "Hitung EPE dan temukan tahun puncak dari profil di atas. Lalu renungkan: limit counterparty yang memakai nilai kini (misal 5 di tahun-1) akan jebol 3× lipat di tahun-3 — itulah mengapa limit wajib pakai PFE.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `epe` (rata-rata EE, Rp miliar)" },
        { id: "t2", text: "Tentukan `peak_year` (tahun EE maksimum), lalu cetak keduanya" },
      ],
      expected: "epe=11.0  peak_year=3",
      note: {
        title: "Sering salah",
        body: "Memakai mark-to-market kini untuk limit counterparty. Nilai kini adalah snapshot — PFE adalah distribusi masa depan. Limit berbasis nilai kini jebol tepat saat exposure memuncak.",
        type: "pitfall",
      },
      hints: [
        "epe = sum(ee) / len(ee).",
        "peak_year = ee.index(max(ee)) + 1 (tahun mulai dari 1).",
        "Puncak punuk = titik risiko maksimum.",
      ],
      code: {
        starter: `# Profil EE swap 6 tahun (Rp miliar)\nee = [5, 12, 18, 15, 10, 6]\n\n# TULIS KODEMU: EPE dan tahun puncak exposure\nepe = \npeak_year = \n\nprint(f"epe={epe}  peak_year={peak_year}")`,
        lockLines: 2,
        solution: `# Profil EE swap 6 tahun (Rp miliar)\nee = [5, 12, 18, 15, 10, 6]\n\n# TULIS KODEMU: EPE dan tahun puncak exposure\nepe = sum(ee) / len(ee)\npeak_year = ee.index(max(ee)) + 1\n\nprint(f"epe={epe}  peak_year={peak_year}")`,
        checks: [
          { kind: "equal", task: "t1", name: "epe", value: 11.0, tol: 1e-9, label: "`epe` seharusnya 11.0", msg: "(5+12+18+15+10+6)/6 = 11,0." },
          { kind: "equal", task: "t2", name: "peak_year", value: 3, tol: 1e-9, label: "`peak_year` seharusnya 3", msg: "EE maksimum 18 ada di tahun ke-3." },
          { kind: "stdout_matches", task: "t2", pattern: "epe=11\\.0\\s+peak_year=3", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "EPE = rata-rata EE (untuk modal). Puncak punuk = risiko maksimum (untuk limit pakai PFE).",
    },
    {
      id: "cva",
      eyebrow: "Langkah 3 · CVA",
      title: "Harga risiko counterparty",
      prose: [
        "CVA (Credit Valuation Adjustment) = penyesuaian negatif ke nilai derivatif untuk mencerminkan kemungkinan counterparty default: CVA = LGD × Σ EE_t · PD_t · DF_t. LGD = loss given default (misal 60%); EE_t = expected exposure; PD_t = probabilitas default marginal (dari credit spread/CDS); DF_t = faktor diskonto. Nilai wajar derivatif = nilai bebas-risiko − CVA.",
        "Poin kritis — CVA risk: CVA berubah setiap hari mengikuti EE (pasar bergerak) dan credit spread counterparty. Spread melebar → PD naik → CVA naik → nilai derivatif turun → P&L negatif hari ini, padahal counterparty belum default! CVA naik Rp55 M dalam setahun tanpa default = rugi Rp55 M di P&L. Inilah yang memakan laba — dan mengapa Basel mengenakan capital charge khusus untuk CVA risk.",
        "Contoh 3 periode (Rp miliar): EE = [10, 15, 8], PD = [1%, 1,5%, 2%], DF = [0,98, 0,95, 0,92], LGD = 60%. CVA = 0,6 × (10×0,01×0,98 + 15×0,015×0,95 + 8×0,02×0,92) = 0,6 × 0,45895 ≈ Rp0,275 miliar. Kecil? Bandingkan dengan margin keuntungan tipis bisnis derivatif — CVA bisa menghapus seluruh P&L bisnis.",
        "Keluarga XVA — CVA punya saudara. DVA (Debit Valuation Adjustment): penyesuaian untuk kemungkinan bank SENDIRI default — ironisnya, saat kesehatan bank memburuk, DVA naik dan 'menaikkan' nilai derivatif (keuntungan akuntansi dari memburuknya diri sendiri — tidak boleh diandalkan, dan Basel melarang memakainya untuk modal). FVA (Funding Valuation Adjustment): biaya pendanaan untuk collateral yang harus disetor — derivatif butuh dana untuk margin; dana itu berbiaya. MVA: biaya pendanaan initial margin ke CCP. Praktisi: CVA untuk harga ke klien, FVA untuk biaya dana, DVA untuk akuntansi (bukan modal). Jangan campur ketiganya dalam satu angka tanpa menjelaskan — tiap huruf menjawab pertanyaan berbeda.",
      ],
      formula: String.raw`\text{CVA} = \text{LGD} \sum_t EE_t \cdot PD_t \cdot DF_t`,
      formulaNote: "LGD = loss given default (misal 60%); EE_t = expected exposure per periode; PD_t = probabilitas default marginal (dari credit spread/CDS counterparty); DF_t = faktor diskonto. Nilai wajar derivatif = nilai bebas-risiko − CVA. Contoh lab: 0,6 × (10×0,01×0,98 + 15×0,015×0,95 + 8×0,02×0,92) ≈ Rp0,275 miliar. Interpretasi: CVA bergerak harian mengikuti spread — naik Rp55 M tanpa default = rugi Rp55 M di P&L (CVA risk, kena capital charge Basel).",
      tasks: [
        { id: "t1", text: "Hitung `cva` (Rp miliar) dari `EE`, `PD`, `DF`, `LGD`" },
        { id: "t2", text: "Cetak `cva` dengan `print`" },
      ],
      expected: "cva=0.27537",
      note: {
        title: "Kaitan ke risk",
        body: "CVA membuat risiko kredit masuk ke P&L harian — jembatan antara credit risk dan market risk. Desk XVA modern me-manage CVA seperti portofolio pasar: hedge dengan CDS, hitung VaR-nya. Jika kamu hanya memikirkan CVA sebagai cadangan akuntansi, kamu ketinggalan satu dekade. Mini-case: CVA yang naik Rp55 M memakan seluruh laba desk derivatif tahun itu — tanpa satu pun default terjadi.",
        type: "risk",
      },
      hints: [
        "Tiap periode: EE[i]*PD[i]*DF[i]. Jumlahkan, lalu kali LGD.",
        "Gunakan zip(EE, PD, DF) untuk memasangkan.",
        "cva = LGD * sum(e*p*d for e, p, d in zip(EE, PD, DF)).",
      ],
      code: {
        starter: `# CVA 3 periode (Rp miliar)\nEE = [10, 15, 8]\nPD = [0.01, 0.015, 0.02]\nDF = [0.98, 0.95, 0.92]\nLGD = 0.6\n\n# TULIS KODEMU: CVA\ncva = \n\nprint(f"cva={cva:.5f}")`,
        lockLines: 5,
        solution: `# CVA 3 periode (Rp miliar)\nEE = [10, 15, 8]\nPD = [0.01, 0.015, 0.02]\nDF = [0.98, 0.95, 0.92]\nLGD = 0.6\n\n# TULIS KODEMU: CVA\ncva = LGD * sum(e * p * d for e, p, d in zip(EE, PD, DF))\n\nprint(f"cva={cva:.5f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cva", value: 0.27537, tol: 0.0005, label: "`cva` seharusnya ~0.27537", msg: "0,6 × (0,098 + 0,21375 + 0,1472). Cek perkalian tiap periode." },
          { kind: "stdout_matches", task: "t2", pattern: "cva=0\\.27537", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "CVA = LGD·Σ EE·PD·DF. Bergerak dengan spread — CVA risk kena capital charge.",
    },
    {
      id: "netting-collateral",
      eyebrow: "Langkah 4 · Mitigasi",
      title: "Netting & collateral: perisai ganda",
      prose: [
        "Netting: 3 transaksi dengan counterparty yang sama (nilai +100, −60, +30). Tanpa netting: exposure = 100 + 30 = 130. Dengan master agreement (ISDA) yang enforceable: exposure = max(100 − 60 + 30, 0) = 70. Penghematan 46% — gratis, hanya butuh dokumen hukum yang benar.",
        "Collateral (CSA): margin harian — pihak yang kalah menyetor jaminan (kas/obligasi). Dengan threshold nol + margin harian, exposure tersisa ≈ pergerakan 1 hari (margin period of risk), bukan seluruh nilai. Contoh: netting memangkas 100 → 45 (55%); collateral memangkas lagi ke 12 — total reduksi 88%. Pelajaran: mitigasi CCR paling murah adalah hukum + operasional (ISDA + CSA yang rapi), bukan modal.",
        "Tetapi: ada collateral ≠ tidak ada risiko. Sisa risiko: gap risk (nilai melompat di antara margin call — misal default di akhir pekan), collateral tak likuid (jaminan obligasi yang ikut jatuh), dan sengketa valuasi (margin call yang diperebutkan). Jangan nol-kan CVA hanya karena ada CSA.",
      ],
      tasks: [
        { id: "t1", text: "Hitung exposure tanpa dan dengan netting untuk nilai +100, −60, +30." },
        { id: "t2", text: "Sebutkan tiga sisa risiko walau sudah ada CSA." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira ada collateral = tidak ada risiko counterparty. Collateral mengurangi, tidak menghilangkan: gap risk, collateral illiquid, dan sengketa valuasi tetap ada. CVA tidak boleh di-nol-kan hanya karena ada CSA.",
        type: "pitfall",
      },
      reference: "Netting: hemat 46% (gratis, butuh ISDA). +CSA: total 88%. Audit dokumen dulu sebelum model mahal.",
    },
    {
      id: "wwr-saccr",
      eyebrow: "Langkah 5 · WWR & SA-CCR",
      title: "Wrong-way risk dan cara standar Basel",
      prose: [
        "Wrong-way risk (WWR) = exposure naik tepat ketika probabilitas default counterparty naik — korelasi yang melipatgandakan kerugian. Specific WWR: hubungan langsung — misal bank menerima fixed dari perusahaan minyak: saat harga minyak jatuh, swap makin menguntungkan bank (exposure naik) dan perusahaan minyak sekarat (PD naik). Dilarang keras untuk modal internal. General WWR: hubungan makro — krisis negara → mata uang jatuh (exposure FX naik) dan semua perusahaan sekarat bersamaan.",
        "Kenapa mematikan: rumus CVA mengasumsikan EE dan PD independen. Dengan WWR, keduanya naik bersamaan → kerugian aktual = perkalian dua kenaikan, bukan penjumlahan. CVA standar underestimate sistematis. Penanganan: identifikasi eksplisit, stress test khusus (exposure & PD naik bersamaan), limit terpisah — dan untuk specific WWR: tolak transaksinya.",
        "SA-CCR (cara standar Basel): EAD = 1,4 × (RC + PFE). RC (replacement cost) = max(nilai kini − collateral, 0) — biaya mengganti posisi hari ini. PFE = add-on = multiplier × notional × faktor supervisory (FX 4%, suku bunga 0,5%, ekuitas 32%…). 1,4 = faktor alpha, margin of conservatism regulator. Contoh: RC=80, notional FX 1000 → PFE = 40 → EAD = 1,4 × 120 = 168. Wajib untuk bank tanpa model internal — dan menjadi floor bahkan untuk bank ber-IMM.",
        "Checklist identifikasi wrong-way risk untuk setiap counterparty besar: (1) apakah bisnis inti counterparty berkorelasi dengan nilai derivatif mereka padamu? (bank terima fixed dari perusahaan minyak + harga minyak jatuh = specific WWR); (2) apakah ada skenario makro yang membuat mereka berutang besar padamu DAN sekarat bersamaan? (krisis negara → mata uang jatuh + semua korporasi sekarat = general WWR); (3) apakah collateral mereka berkorelasi dengan kesehatan mereka? (jaminan berupa saham sendiri = collateral yang menguap tepat saat dibutuhkan). Jika salah satu jawabannya 'ya' — kamu punya WWR: stress test exposure & PD naik bersamaan, bukan independen.",
      ],
      formula: String.raw`\text{EAD} = 1{,}4 \times (\text{RC} + \text{PFE})`,
      formulaNote: "EAD = exposure at default untuk modal; RC = replacement cost = max(nilai kini − collateral, 0), biaya mengganti posisi hari ini; PFE = add-on masa depan = multiplier × notional × faktor supervisory (FX 4%, suku bunga 0,5%, ekuitas 32%); 1,4 = faktor alpha, bantalan konservatisme regulator. Contoh: RC=80, PFE=40 → EAD = 168. Interpretasi: wajib untuk bank tanpa model internal (IMM) — dan menjadi floor bahkan untuk bank ber-IMM.",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa WWR membuat CVA standar underestimate." },
        { id: "t2", text: "Sebutkan komponen SA-CCR dan arti faktor 1,4." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "AIG 2008: penjual proteksi (CDS) raksasa yang butuh ditalangi. AIG menjual proteksi kredit dalam jumlah masif — saat krisis, semua proteksi itu bergerak melawannya bersamaan (general WWR raksasa) + collateral call yang tidak bisa dipenuhi. Pelajaran: penjual proteksi terkonsentrasi = bom sistemik; dan WWR terbesar sering tidak terlihat sampai krisis.",
        type: "risk",
      },
      reference: "WWR: exposure & PD naik bersamaan → tolak (specific). SA-CCR = 1,4×(RC+PFE).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Mengelola risiko counterparty",
      prose: [
        "Lima keputusan. Pertama, limit eksposur counterparty → PFE (bukan nilai kini!): nilai kini bisa nol sementara PFE positif besar; limit harus menahan skenario buruk. Kedua, pricing & P&L → CVA (EE-based): nilai wajar = bebas-risiko − CVA; CVA bergerak harian dengan spread — kelola seperti portofolio pasar (hedge dengan CDS).",
        "Ketiga, mitigasi termurah dulu → audit ISDA/CSA: sebelum investasi model mahal, pastikan semua counterparty punya dokumen enforceable dan operasional margin berjalan — netting + collateral memangkas hingga 88%. Keempat, identifikasi WWR eksplisit: untuk setiap counterparty besar, tanyakan skenario apa yang membuat mereka berutang besar padamu dan sekarat bersamaan — jika jawabannya mudah ditemukan, kamu punya WWR.",
        "Kelima, modal → SA-CCR (atau IMM jika punya izin): EAD = 1,4×(RC+PFE); tambah capital charge CVA risk. Aturan 10 detik: limit pakai PFE, harga pakai EE/CVA, mitigasi mulai dari dokumen, WWR diidentifikasi eksplisit — bukan diasumsikan independen.",
      ],
      tasks: [
        { id: "t1", text: "Counterparty dengan MtM nol meminta limit besar. Metrik apa yang kamu pakai?" },
        { id: "t2", text: "Urutkan prioritas mitigasi CCR dari yang termurah." },
      ],
      note: {
        title: "Sering salah",
        body: "Langsung membangun model CVA canggih sementara ISDA/CSA berantakan. Mitigasi termurah = hukum + operasional yang rapi. Model mahal di atas dokumen berantakan = presisi di atas fondasi pasir.",
        type: "pitfall",
      },
      reference: "Limit → PFE. Harga → CVA. Mitigasi → dokumen dulu. WWR → eksplisit. Modal → SA-CCR.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Tanyakan skenario gandanya",
      prose: [
        "Satu kalimat yang merangkum seluruh lesson: counterparty risk adalah risiko kredit yang menari mengikuti pasar — dan menarinya paling liar tepat saat pasangannya sekarat. Maka pertanyaan terpenting bukan 'berapa exposure hari ini?' melainkan 'berapa exposure saat mereka default?' — dua angka yang bisa berbeda 3× lipat.",
        "Tiga pertanyaan yang diajukan risk manager senior untuk setiap counterparty material: (1) berapa PFE-nya — bukan mark-to-market hari ini, melainkan skenario buruk masa depan; (2) apakah ada wrong-way risk — skenario apa yang membuat mereka berutang besar padaku DAN sekarat bersamaan; (3) apakah dokumen netting-nya enforceable dan CSA-nya berjalan — karena mitigasi termurah adalah hukum yang rapi, bukan model yang canggih.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa 'berapa exposure saat mereka default' lebih penting dari exposure hari ini." },
        { id: "t2", text: "Terapkan tiga pertanyaan ke swap dengan perusahaan energi di cerita pembuka." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk risiko counterparty. Pertama, hafalkan pembagian kerja metriknya: EE untuk harga (CVA), PFE untuk limit, EPE untuk modal, RC untuk biaya ganti hari ini. Tertukar = salah pakai: limit berbasis mark-to-market jebol 3× lipat saat punuk EE memuncak; pricing tanpa CVA = memberi diskon untuk risiko yang tidak dihargai. Kedua, ingat bahwa CVA adalah jembatan antara credit risk dan market risk: ia bergerak harian mengikuti credit spread — desk XVA modern me-manage-nya seperti portofolio pasar (hedge dengan CDS, hitung VaR-nya). Jika kamu masih memikirkan CVA sebagai cadangan akuntansi statis, kamu ketinggalan satu dekade. Ketiga, urutan mitigasi dari yang termurah: audit ISDA/CSA dulu (netting + collateral memangkas hingga 88% — gratis, hanya butuh dokumen dan operasional rapi), baru model canggih. Model mahal di atas dokumen berantakan = presisi di atas fondasi pasir. Keempat, waspadai keluarga XVA: DVA (keuntungan akuntansi dari memburuknya diri sendiri — jangan andalkan, dilarang untuk modal), FVA (biaya pendanaan collateral — nyata dan material). Kelima, wrong-way risk adalah pembunuh yang tidak terlihat di rumus standar: CVA mengasumsikan EE dan PD independen, tetapi specific WWR (terima fixed dari perusahaan minyak saat harga minyak jatuh) melipatgandakan kerugian — untuk specific WWR, tolak transaksinya. Dan terakhir: AIG 2008 adalah pelajaran general WWR raksasa — penjual proteksi terkonsentrasi yang butuh ditalangi saat semua proteksinya bergerak melawan bersamaan. Konsentrasi penjual proteksi = bom sistemik; jangan jadi AIG berikutnya.",
      },
      reference: "EE→harga, PFE→limit, EPE→modal. Dokumen dulu, model kemudian. WWR diidentifikasi eksplisit.",
    },
    {
      id: "minicase-netting",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Netting yang menyelamatkan Rp85 miliar",
      prose: [
        "Bank Nusantara memiliki 4 swap suku bunga dengan PT Energi Jaya — nilainya (Rp miliar): +120, −45, +30, −25. Bersih menguntungkan bank Rp80 miliar. Di tengah krisis energi, Energi Jaya gagal bayar. Skenario A — tanpa netting yang enforceable: bank menagih 120 + 30 = Rp150 miliar sebagai kreditor tanpa jaminan (recovery 40% → Rp60 miliar), tetapi tetap wajib membayar kewajibannya 45 + 25 = Rp70 miliar PENUH ke kurator. Kas bersih: 60 − 70 = −Rp10 miliar — dari posisi yang 'menguntungkan Rp80 miliar'!",
        "Skenario B — dengan ISDA master agreement yang enforceable: eksposur = max(120 − 45 + 30 − 25, 0) = Rp80 miliar. Ditagih sebagai satu klaim bersih, recovery 40% → Rp32 miliar. Kerugian Rp48 miliar — masih sakit, tetapi jauh lebih baik dari skenario A. Skenario C — ditambah CSA dengan margin harian: collateral yang sudah disetor menutup hampir semua; eksposur tersisa ≈ pergerakan 1 hari (margin period of risk) ≈ Rp8 miliar → kerugian ≈ Rp5 miliar.",
        "Tiga pelajaran: netting yang enforceable mengubah gross Rp150 miliar menjadi net Rp80 miliar — penghematan Rp85 miliar dari selembar dokumen hukum, bukan dari model. Opini hukum netting (netting opinion) per yurisdiksi wajib ada dan diperbarui — netting yang tidak enforceable = tidak ada netting. Dan bahkan dengan CSA, jangan nol-kan CVA: gap risk (default di akhir pekan), collateral illiquid, dan sengketa valuasi tetap menyisakan risiko.",
      ],
      tasks: [
        { id: "t1", text: "Hitung eksposur bank di skenario A (tanpa netting) dan B (dengan netting). Jelaskan selisihnya." },
        { id: "t2", text: "Kenapa bank tetap wajib bayar Rp70 miliar penuh di skenario A?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira netting berlaku otomatis karena 'kan sudah ada ISDA'. Netting hanya mengurangi eksposur jika master agreement-nya enforceable di yurisdiksi counterparty — butuh opini hukum (netting opinion) yang valid dan diperbarui. Tanpa itu, yang berlaku adalah gross exposure.",
        type: "pitfall",
      },
      reference: "Netting enforceable: Rp150 M gross → Rp80 M net. +CSA → ~Rp8 M. Dokumen = mitigasi termurah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR15.",
      ],
      tasks: [],
      summary: [
        "CCR: risiko kredit yang menari mengikuti pasar — tak terlihat di VaR pasar.",
        "EE = rata-rata nilai positif (untuk CVA/pricing); PFE = kuantil buruk (untuk limit); EPE = rata-rata EE (untuk modal).",
        "CVA = LGD·Σ EE·PD·DF — bergerak dengan spread; CVA risk kena capital charge.",
        "Netting + collateral memangkas hingga 88% — mitigasi termurah = dokumen, bukan model.",
        "Wrong-way risk: exposure & PD naik bersamaan — specific WWR ditolak; CVA standar underestimate.",
        "SA-CCR: EAD = 1,4×(RC+PFE) — wajib tanpa IMM, floor untuk yang ber-IMM.",
      ],
      next: { label: "MR15 — Model Stokastik", href: "/learn/mr15-model-stokastik" },
      quiz: [
        {
          q: "Swap bernilai nol hari ini. Apakah ada risiko counterparty?",
          options: [
            { text: "Tidak — nilainya nol", why: "nilai kini = snapshot, bukan distribusi masa depan." },
            { text: "Ya — PFE selalu positif: nilai bisa menjadi positif di masa depan; risiko ada sejak hari pertama", why: "inilah mengapa limit memakai PFE, bukan mark-to-market.", correct: true },
            { text: "Hanya jika tenor > 10 tahun", why: "PFE positif untuk semua tenor." },
            { text: "Hanya untuk FX", why: "berlaku untuk semua derivatif OTC." },
          ],
        },
        {
          q: "Untuk limit counterparty, metrik yang tepat?",
          options: [
            { text: "Nilai mark-to-market kini", why: "snapshot — bisa nol saat PFE besar." },
            { text: "PFE (skenario buruk masa depan) — limit harus menahan exposure maksimum yang ditoleransi", why: "EE untuk pricing, notional tidak menggambarkan exposure.", correct: true },
            { text: "EE", why: "EE untuk pricing/ekspektasi, bukan batas toleransi." },
            { text: "Notional", why: "notional swap tidak menggambarkan exposure." },
          ],
        },
        {
          q: "CVA naik Rp55 M dalam setahun padahal tidak ada default. Dampak ke P&L?",
          options: [
            { text: "Tidak ada — belum ada default", why: "CVA bergerak dengan spread, bukan menunggu default." },
            { text: "Rugi Rp55 M — CVA naik = nilai derivatif turun; CVA risk terealisasi via spread", why: "inilah CVA risk yang dikenai capital charge Basel.", correct: true },
            { text: "Untung Rp55 M", why: "arahnya terbalik." },
            { text: "Ditunda sampai default", why: "akuntansi CVA mengakui perubahan nilai kini." },
          ],
        },
        {
          q: "Bank menerima fixed dari perusahaan minyak saat harga minyak jatuh. Ini adalah?",
          options: [
            { text: "Right-way risk", why: "justru sebaliknya." },
            { text: "Specific wrong-way risk — exposure naik tepat saat PD counterparty naik", why: "korelasi langsung melipatgandakan kerugian; specific WWR dilarang untuk modal internal.", correct: true },
            { text: "Tidak ada risiko", why: "ini WWR yang paling berbahaya." },
            { text: "Basis risk", why: "ini bukan basis risk." },
          ],
        },
        {
          q: "SA-CCR: EAD = 1,4 × (RC + PFE). Komponen 1,4 adalah?",
          options: [
            { text: "Suku bunga", why: "tidak ada hubungannya." },
            { text: "Faktor alpha — margin of conservatism regulator atas ketidakpastian model", why: "RC = biaya ganti hari ini, PFE = add-on masa depan, 1,4 = bantalan.", correct: true },
            { text: "Jumlah counterparty", why: "bukan itu." },
            { text: "Probabilitas default", why: "PD tidak ada di rumus SA-CCR." },
          ],
        },
        {
          q: "Bank untung Rp80 M dari swap dengan counterparty yang default, tetapi bank juga berutang Rp70 M ke counterparty yang sama. Tanpa netting yang enforceable, apa yang terjadi?",
          options: [
            { text: "Saling hapus otomatis — bank rugi Rp10 M", why: "tanpa netting yang enforceable tidak ada saling hapus otomatis." },
            { text: "Bank menagih Rp80 M sebagai kreditor tanpa jaminan (recovery sebagian) tetapi wajib bayar Rp70 M penuh — kerugian jauh lebih besar dari selisih bersih", why: "inilah mengapa opini hukum netting (ISDA enforceable) adalah mitigasi CCR termurah — tanpa itu yang berlaku gross exposure.", correct: true },
            { text: "Tidak ada kerugian", why: "jelas ada kerugian." },
            { text: "CSA otomatis menutupi semuanya", why: "CSA hanya membantu jika ada dan collateral sudah disetor." },
          ],
        },
      ],
    },
  ],
};

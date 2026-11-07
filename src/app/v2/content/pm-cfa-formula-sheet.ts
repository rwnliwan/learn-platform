import type { V2Lesson } from "../lib/types";

export const pmcfaFormulaSheet: V2Lesson = {
  slug: "pm-cfa-formula-sheet",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-CFA Formula Sheet: Rumus yang Wajib di Luar Kepala",
  estMinutes: 60,
  steps: [
    {
      id: "tvm",
      eyebrow: "Langkah 1 · TVM dan arus kas",
      title: "Time Value of Money: FV, PV, anuitas, perpetuitas",
      prose: [
        "Satu rupiah hari ini lebih berharga dari satu rupiah tahun depan, karena rupiah hari ini bisa diinvestasikan. Itulah seluruh isi Time Value of Money (TVM): memindahkan uang melintasi waktu dengan tingkat diskonto r. Future Value (FV) menggeser uang ke depan, Present Value (PV) menariknya ke masa kini, dan anuitas adalah rangkaian pembayaran sama besar setiap periode.",
        "Kapan dipakai: FV untuk target tabungan dan nilai akhir investasi; PV untuk harga wajar aset dan keputusan beli hari ini; anuitas untuk cicilan, dana pensiun, dan sewa; perpetuitas untuk aset yang membayar selamanya, seperti saham preferen atau konsol. Contoh hitung (ilustratif): Rp1.000 diinvestasikan 10 tahun pada 8% per tahun menjadi FV = 1.000 × 1,08^10 = Rp2.158,92. Sebaliknya, Rp5.000 yang diterima 5 tahun lagi pada 6% bernilai PV = 5.000 ÷ 1,06^5 = Rp3.736,29 hari ini.",
        "Jebakan klasik: mencampur periode dengan tingkat. Kalau pembayaran bulanan, r harus bulanan dan n harus jumlah bulan. Anuitas biasa (ordinary annuity) membayar di AKHIR periode; anuitas jatuh tempo (annuity due) di AWAL periode dan nilainya lebih besar tepat satu faktor (1 + r).",
      ],
      formula: String.raw`FV = PV(1+r)^n \qquad PV = \frac{FV}{(1+r)^n} \qquad PV_{anuitas} = PMT \times \frac{1-(1+r)^{-n}}{r} \qquad PV_{perpetuitas} = \frac{PMT}{r}`,
      formulaNote: "PV = nilai kini; FV = nilai masa depan; r = tingkat per periode; n = jumlah periode; PMT = pembayaran per periode. Rumus perpetuitas adalah limit rumus anuitas saat n menuju tak hingga.",
      tasks: [],
      quiz: [
        {
          q: "Rp1.000 diinvestasikan 10 tahun pada 8% per tahun (ilustratif). Berapa FV-nya?",
          options: [
            { text: "Rp1.800,00", why: "Salah: itu bunga sederhana 1.000 × (1 + 0,08 × 10). TVM memakai bunga majemuk.", },
            { text: "Rp2.158,92", why: "Benar: 1.000 × 1,08^10 = 2.158,92. Bunga majemuk membuat nilai tumbuh lebih cepat dari bunga sederhana.", correct: true },
            { text: "Rp2.500,00", why: "Salah: 1,08^10 ≈ 2,1589, bukan 2,5.", },
          ],
        },
      ],
      reference: "FV = PV(1+r)^n; PV anuitas memakai faktor 1 dikurangi (1+r) pangkat minus n, dibagi r.",
    },
    {
      id: "npv-irr",
      eyebrow: "Langkah 2 · Keputusan investasi",
      title: "NPV, IRR, dan payback: tiga juri proyek",
      prose: [
        "Net Present Value (NPV) adalah nilai kini seluruh arus kas proyek dikurangi investasi awal. NPV positif berarti proyek menciptakan nilai di atas biaya modalnya; NPV negatif berarti proyek menghancurkan nilai. Internal Rate of Return (IRR) adalah tingkat diskonto yang membuat NPV tepat nol — proyek diterima bila IRR di atas biaya modal.",
        "Contoh hitung (ilustratif): proyek menelan Rp1.000 hari ini dan menghasilkan Rp300, Rp400, Rp500, Rp600 pada tahun 1 sampai 4. Pada biaya modal 10%, NPV = -1.000 + 300/1,10 + 400/1,10^2 + 500/1,10^3 + 600/1,10^4 = Rp388,77. IRR proyek ini sekitar 24,89%, jauh di atas 10%, jadi proyek diterima oleh kedua juri.",
        "Payback period hanya menghitung berapa lama investasi kembali, tanpa mendiskonto dan tanpa peduli arus kas setelah payback. Ia berguna sebagai saringan likuiditas, tetapi JANGAN pernah menjadi satu-satunya kriteria: proyek ber-payback cepat bisa ber-NPV negatif. Bila NPV dan IRR bertentangan pada proyek yang saling meniadakan, NPV yang menang, karena NPV mengukur nilai absolut dalam rupiah, bukan persentase.",
      ],
      formula: String.raw`NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t} \qquad IRR: NPV = 0`,
      formulaNote: "CF_t = arus kas tahun t (CF_0 biasanya negatif, yaitu investasi awal); r = biaya modal; IRR dicari dengan trial-and-error atau fungsi IRR kalkulator, bukan rumus tertutup.",
      tasks: [],
      quiz: [
        {
          q: "Dua proyek saling meniadakan: proyek A NPV Rp500 juta dan IRR 15%, proyek B NPV Rp700 juta dan IRR 12%. Biaya modal 10%. Mana yang dipilih?",
          options: [
            { text: "Proyek A, karena IRR lebih tinggi", why: "Salah: IRR mengukur persentase, bukan nilai absolut. Proyek kecil bisa ber-IRR tinggi tetapi menciptakan nilai lebih sedikit.", },
            { text: "Proyek B, karena NPV lebih besar", why: "Benar: untuk proyek yang saling meniadakan, NPV adalah kriteria penentu karena mengukur nilai absolut yang diciptakan.", correct: true },
            { text: "Keduanya, karena IRR keduanya di atas biaya modal", why: "Salah: saling meniadakan berarti hanya satu yang bisa dipilih.", },
          ],
        },
      ],
      reference: "NPV positif = terima. IRR di atas biaya modal = terima. Konflik antar proyek = NPV menang.",
    },
    {
      id: "obligasi",
      eyebrow: "Langkah 3 · Fixed income",
      title: "Obligasi: harga, YTM, durasi, konveksitas",
      prose: [
        "Harga obligasi adalah PV seluruh arus kasnya: kupon setiap periode plus pokok di akhir, didiskonto pada yield to maturity (YTM). Bila YTM naik, harga turun, dan sebaliknya; bila YTM sama dengan kupon, harga sama dengan nilai nominal (par). Contoh hitung (ilustratif): obligasi nominal Rp1.000, kupon 8% per tahun, tenor 10 tahun, YTM 6% — harganya = PV kupon Rp80 selama 10 tahun + PV pokok = Rp1.147,20, yaitu di atas par karena kupon 8% lebih besar dari YTM 6%.",
        "Durasi Macaulay adalah rata-rata tertimbang waktu penerimaan arus kas (dalam tahun); durasi modified = durasi Macaulay dibagi (1 + YTM) dan mengukur sensitivitas harga: perubahan harga persen kira-kira sama dengan minus durasi modified dikali perubahan YTM. Konveksitas adalah koreksi orde kedua: hubungan harga-YTM itu melengkung, bukan garis lurus, sehingga durasi saja meremehkan kenaikan harga saat YTM turun dan melebih-lebihkan penurunan saat YTM naik.",
        "Aturan praktis: durasi panjang berarti risiko suku bunga besar. Dua obligasi dengan YTM sama, yang bertenor lebih panjang dan berkupon lebih kecil punya durasi lebih panjang. Konveksitas selalu menguntungkan pemegang obligasi, sehingga pasar mau membayar premi untuk obligasi berkonveksitas tinggi.",
      ],
      formula: String.raw`P = \sum_{t=1}^{n} \frac{C}{(1+y)^t} + \frac{F}{(1+y)^n} \qquad D_{mod} = \frac{D_{Mac}}{1+y} \qquad \frac{\Delta P}{P} \approx -D_{mod} \times \Delta y`,
      formulaNote: "P = harga; C = kupon per periode; F = nilai nominal; y = YTM per periode; n = jumlah periode; D_Mac = durasi Macaulay; D_mod = durasi modified; delta y = perubahan YTM.",
      tasks: [],
      quiz: [
        {
          q: "Obligasi kupon 8%, YTM 6%, nominal Rp1.000 (ilustratif). Harganya di atas atau di bawah par, dan kenapa?",
          options: [
            { text: "Di bawah par, karena YTM lebih kecil dari kupon", why: "Salah: YTM lebih kecil dari kupon justru membuat arus kas obligasi lebih berharga dari pasar, sehingga harga naik di atas par.", },
            { text: "Di atas par (Rp1.147,20), karena kupon 8% lebih besar dari YTM 6%", why: "Benar: investor mau membayar premi untuk kupon di atas pasar. Harga = PV kupon + PV pokok pada YTM 6%.", correct: true },
            { text: "Tepat di par, karena kupon selalu sama dengan harga", why: "Salah: harga sama dengan par hanya bila YTM sama dengan kupon.", },
          ],
        },
      ],
      reference: "Harga = PV kupon + PV pokok pada YTM. Durasi modified mengukur sensitivitas harga terhadap YTM.",
    },
    {
      id: "saham",
      eyebrow: "Langkah 4 · Ekuitas",
      title: "Saham: DDM, Gordon growth, residual income",
      prose: [
        "Dividend Discount Model (DDM) menilai saham sebagai PV seluruh dividen masa depan. Gordon growth model adalah DDM yang disederhanakan dengan asumsi dividen tumbuh konstan g selamanya: nilai = D1 dibagi (k dikurangi g), dengan D1 dividen tahun depan dan k required return. Contoh hitung (ilustratif): D1 = Rp5, k = 12%, g = 4% — nilai wajar = 5 ÷ (0,12 − 0,04) = Rp62,50.",
        "Syarat Gordon growth: k harus lebih besar dari g, dan g harus berkelanjutan selamanya — g di atas pertumbuhan ekonomi jangka panjang selamanya adalah fantasi. Model ini paling cocok untuk perusahaan matang berdividen stabil, dan paling rapuh untuk perusahaan tanpa dividen atau bertumbuh eksplosif.",
        "Residual income model menilai saham dari nilai buku ekuitas ditambah PV residual income (laba bersih dikurangi beban ekuitas, yaitu ekuitas awal dikali required return). Kelebihannya: tetap bisa dipakai saat perusahaan tidak membayar dividen atau arus kas bebasnya negatif, selama laporan keuangannya bersih. Ketiga model ini harus saling mengonfirmasi — bila DDM dan residual income memberi jawaban yang sangat berbeda, ada asumsi yang tidak konsisten.",
      ],
      formula: String.raw`V_0 = \frac{D_1}{k-g} \qquad RI_t = NI_t - r \times B_{t-1} \qquad V_0 = B_0 + \sum_{t=1}^{\infty} \frac{RI_t}{(1+r)^t}`,
      formulaNote: "V_0 = nilai wajar hari ini; D_1 = dividen tahun depan; k = required return; g = pertumbuhan dividen konstan; RI = residual income; NI = laba bersih; B = nilai buku ekuitas; r = biaya ekuitas.",
      tasks: [],
      quiz: [
        {
          q: "Saham membayar dividen tahun depan Rp5, required return 12%, pertumbuhan dividen konstan 4% (ilustratif). Nilai wajar Gordon growth?",
          options: [
            { text: "Rp31,25", why: "Salah: 5 ÷ 0,16 memakai k ditambah g. Rumusnya k dikurangi g.", },
            { text: "Rp62,50", why: "Benar: 5 ÷ (0,12 − 0,04) = 5 ÷ 0,08 = 62,50.", correct: true },
            { text: "Rp125,00", why: "Salah: itu 5 ÷ 0,04, hanya membagi dengan g dan mengabaikan required return.", },
          ],
        },
      ],
      reference: "Gordon: V = D1 / (k − g), syarat k lebih besar dari g. Residual income: nilai buku + PV residual income.",
    },
    {
      id: "capm-wacc-dupont",
      eyebrow: "Langkah 5 · Return dan biaya modal",
      title: "CAPM, WACC, dan DuPont: tiga lensa profitabilitas",
      prose: [
        "Capital Asset Pricing Model (CAPM) menjawab berapa return yang WAJIB diminta investor atas aset berisiko: required return = risk-free rate ditambah beta dikali equity risk premium. Contoh hitung (ilustratif): risk-free 3%, beta 1,2, return pasar 10% — required return = 3% + 1,2 × (10% − 3%) = 11,4%. Beta di atas 1 berarti saham bergerak lebih liar dari pasar.",
        "Weighted Average Cost of Capital (WACC) adalah biaya modal rata-rata tertimbang perusahaan: bobot utang dikali biaya utang setelah pajak, ditambah bobot ekuitas dikali biaya ekuitas. WACC adalah tingkat diskonto standar untuk menilai proyek perusahaan secara keseluruhan — tetapi hanya benar bila proyek baru punya risiko dan struktur modal yang sama dengan perusahaan.",
        "Analisis DuPont mengurai ROE menjadi tiga pendorong: margin laba bersih dikali perputaran aset dikali leverage (aset dibagi ekuitas). ROE tinggi karena margin dan perputaran adalah kualitas; ROE tinggi karena leverage adalah kerapuhan. Bila dua perusahaan ber-ROE sama, yang marginnya sehat lebih kuat dari yang leverage-nya tinggi.",
      ],
      formula: String.raw`E(R_i) = R_f + \beta_i \left[E(R_m) - R_f\right] \qquad WACC = w_d r_d (1-t) + w_e r_e \qquad ROE = \frac{NI}{Sales} \times \frac{Sales}{Assets} \times \frac{Assets}{Equity}`,
      formulaNote: "E(R_i) = expected return aset; R_f = risk-free rate; beta = sensitivitas terhadap pasar; w_d dan w_e = bobot utang dan ekuitas; r_d = biaya utang; t = tarif pajak; r_e = biaya ekuitas; NI = laba bersih.",
      tasks: [],
      quiz: [
        {
          q: "Risk-free 3%, beta 1,2, return pasar 10% (ilustratif). Required return CAPM?",
          options: [
            { text: "10,0%", why: "Salah: itu return pasar, bukan return saham ber-beta 1,2.", },
            { text: "11,4%", why: "Benar: 3% + 1,2 × 7% = 3% + 8,4% = 11,4%.", correct: true },
            { text: "15,0%", why: "Salah: 3% + 1,2 × 10% lupa mengurangkan risk-free dari return pasar.", },
          ],
        },
      ],
      reference: "CAPM: Rf + beta × (Rm − Rf). WACC memakai biaya utang SETELAH pajak. DuPont: margin × perputaran × leverage.",
    },
    {
      id: "statistik",
      eyebrow: "Langkah 6 · Statistik",
      title: "Statistik: mean, varians, korelasi, t-stat, interval kepercayaan",
      prose: [
        "Mean dan varians adalah bahasa dasar risiko. Varians mengukur sebaran return di sekitar mean; standar deviasi adalah akarnya, dalam satuan yang sama dengan return sehingga bisa dibandingkan langsung. Kovarians mengukur arah gerak bersama dua aset; korelasi adalah kovarians yang dinormalisasi ke rentang minus 1 sampai plus 1, sehingga kekuatan hubungan bisa dibandingkan antar pasangan aset.",
        "Contoh hitung (ilustratif): return tahunan 8%, minus 2%, 12%, 5%, 7% — mean = 6%. Sample standar deviasi = 5,15%. Korelasi +1 berarti dua aset bergerak seirama sempurna; korelasi 0 berarti tidak ada hubungan linear; korelasi negatif adalah bahan diversifikasi, karena kerugian satu aset cenderung diimbangi keuntungan aset lain.",
        "Uji-t menguji apakah mean sampel berbeda signifikan dari nilai hipotesis: t-stat = (mean sampel dikurangi nilai hipotesis) dibagi standard error. Interval kepercayaan 95% untuk mean kira-kira mean sampel plus minus 1,96 dikali standard error (sampel besar). Ingat: interval kepercayaan yang lebar bukan jawaban yang salah, melainkan jawaban yang jujur tentang ketidakpastian data.",
      ],
      formula: String.raw`\bar{x} = \frac{1}{n}\sum x_i \qquad s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1} \qquad \rho_{XY} = \frac{Cov(X,Y)}{\sigma_X \sigma_Y} \qquad t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}`,
      formulaNote: "x bar = mean sampel; s kuadrat = varians sampel (pembagi n−1, bukan n); rho = korelasi; Cov = kovarians; t = t-stat; mu_0 = nilai hipotesis; s dibagi akar n = standard error.",
      tasks: [],
      quiz: [
        {
          q: "Return 8%, minus 2%, 12%, 5%, 7% (ilustratif). Mean dan sample standar deviasi?",
          options: [
            { text: "Mean 6%, SD 5,15%", why: "Benar: mean = 30 ÷ 5 = 6%; sample SD dengan pembagi n−1 = 5,15%.", correct: true },
            { text: "Mean 6%, SD 4,61%", why: "Salah: 4,61% adalah population SD (pembagi n). Untuk sampel, CFA memakai pembagi n−1.", },
            { text: "Mean 5%, SD 5,15%", why: "Salah: jumlah return = 30, dibagi 5 = 6%, bukan 5%.", },
          ],
        },
      ],
      reference: "Varians sampel memakai pembagi n−1. Korelasi di rentang minus 1 sampai plus 1. t-stat = selisih mean dibagi standard error.",
    },
    {
      id: "akuntansi",
      eyebrow: "Langkah 7 · Akuntansi",
      title: "Akuntansi: LIFO reserve, DTL/DTA, dan rasio kunci",
      prose: [
        "LIFO reserve adalah selisih antara persediaan FIFO dan persediaan LIFO. Saat harga naik, LIFO menghasilkan COGS lebih besar dan persediaan lebih kecil. Dua konversi wajib hafal: persediaan FIFO = persediaan LIFO ditambah LIFO reserve; COGS FIFO = COGS LIFO dikurangi perubahan LIFO reserve. Contoh hitung (ilustratif): persediaan LIFO Rp200, LIFO reserve Rp40 — persediaan FIFO = Rp240. Bila reserve naik Rp10 selama setahun dan COGS LIFO Rp600, COGS FIFO = 600 − 10 = Rp590.",
        "Deferred Tax Liability (DTL) muncul bila laba akuntansi lebih besar dari laba pajak hari ini, sehingga pajak yang ditunda harus dibayar di masa depan; Deferred Tax Asset (DTA) adalah kebalikannya — pajak dibayar di muka dan bisa dipakai mengurangi pajak masa depan. Kuncinya: DTL dan DTA lahir dari perbedaan temporer antara basis akuntansi dan basis pajak, bukan dari perbedaan permanen.",
        "Rasio kunci yang wajib di luar kepala: current ratio = aset lancar dibagi liabilitas lancar; debt-to-equity = total liabilitas dibagi ekuitas; interest coverage = EBIT dibagi beban bunga; ROE = laba bersih dibagi ekuitas; gross margin = laba kotor dibagi pendapatan. Contoh hitung (ilustratif): aset lancar Rp400, liabilitas lancar Rp150 — current ratio = 2,67. Angka rasio tanpa pembanding (tren perusahaan, rata-rata industri) tidak bercerita apa-apa.",
      ],
      formula: String.raw`Inv_{FIFO} = Inv_{LIFO} + LIFO_{reserve} \qquad COGS_{FIFO} = COGS_{LIFO} - \Delta LIFO_{reserve}`,
      formulaNote: "Inv = persediaan; delta LIFO reserve = reserve akhir dikurangi reserve awal. Rumus ini berlaku saat harga naik (kasus normal soal CFA); bila harga turun, arahnya berbalik.",
      tasks: [],
      quiz: [
        {
          q: "Persediaan LIFO Rp200, LIFO reserve Rp40 (ilustratif). Berapa persediaan FIFO?",
          options: [
            { text: "Rp160", why: "Salah: reserve ditambahkan, bukan dikurangkan — FIFO selalu lebih besar dari LIFO saat harga naik.", },
            { text: "Rp240", why: "Benar: persediaan FIFO = 200 + 40 = 240.", correct: true },
            { text: "Rp200", why: "Salah: itu nilai LIFO-nya, belum dikonversi.", },
          ],
        },
      ],
      reference: "FIFO inventory = LIFO + reserve. COGS FIFO = COGS LIFO − perubahan reserve. DTL = pajak ditunda ke masa depan.",
    },
    {
      id: "risk",
      eyebrow: "Langkah 8 · Risiko",
      title: "Risiko: VaR, expected shortfall, Sharpe, Sortino",
      prose: [
        "Value at Risk (VaR) menjawab: berapa kerugian terburuk yang masih dalam batas keyakinan tertentu? VaR 95% harian Rp100 juta berarti ada peluang 5% kerugian harian melebihi Rp100 juta. Kelemahan VaR: ia diam tentang seberapa buruk kerugian di ekor 5% itu — Rp101 juta dan Rp1 miliar diperlakukan sama. Expected shortfall (conditional VaR) menutup lubang ini: ia adalah rata-rata kerugian BILA kerugian sudah melewati VaR.",
        "Sharpe ratio mengukur return berlebih per unit risiko total: (return portofolio dikurangi risk-free) dibagi standar deviasi portofolio. Sortino ratio mengganti penyebutnya dengan downside deviation — hanya volatilitas ke bawah yang dihitung sebagai risiko, karena investor tidak pernah mengeluh return yang terlalu tinggi. Contoh hitung (ilustratif): return 12%, risk-free 3%, standar deviasi 15% — Sharpe = (12% − 3%) ÷ 15% = 0,60.",
        "Aturan baca: Sharpe dan Sortino hanya bermakna bila dibandingkan dengan portofolio sebanding pada periode yang sama; Sharpe tinggi dari return yang tidak normal (ekor gemuk) bisa menipu, karena standar deviasi meremehkan risiko ekor. Selalu laporkan VaR bersama expected shortfall, dan laporkan Sharpe bersama Sortino bila distribusi return miring.",
      ],
      formula: String.raw`Sharpe = \frac{R_p - R_f}{\sigma_p} \qquad Sortino = \frac{R_p - R_f}{\sigma_{downside}} \qquad ES = E\left[Loss \mid Loss > VaR\right]`,
      formulaNote: "R_p = return portofolio; R_f = risk-free rate; sigma_p = standar deviasi portofolio; sigma_downside = downside deviation; ES = expected shortfall, rata-rata kerugian di luar ambang VaR.",
      tasks: [],
      quiz: [
        {
          q: "Portofolio return 12%, risk-free 3%, standar deviasi 15% (ilustratif). Sharpe ratio?",
          options: [
            { text: "0,80", why: "Salah: 12% ÷ 15% lupa mengurangkan risk-free. Sharpe memakai return BERLEBIH.", },
            { text: "0,60", why: "Benar: (12% − 3%) ÷ 15% = 9% ÷ 15% = 0,60.", correct: true },
            { text: "0,45", why: "Salah: tidak ada kombinasi rumus Sharpe yang menghasilkan 0,45 dari angka-angka ini.", },
          ],
        },
      ],
      summary: [
        "TVM: FV = PV(1+r)^n; anuitas dan perpetuitas adalah PV dari rangkaian pembayaran.",
        "NPV positif dan IRR di atas biaya modal berarti terima; konflik antar proyek dimenangkan NPV.",
        "Harga obligasi = PV kupon + PV pokok pada YTM; durasi modified mengukur sensitivitas harga.",
        "Gordon: V = D1 / (k − g); residual income: nilai buku + PV residual income.",
        "CAPM: Rf + beta × premi pasar; WACC memakai biaya utang setelah pajak; DuPont mengurai ROE.",
        "Varians sampel memakai pembagi n−1; korelasi di rentang minus 1 sampai plus 1.",
        "FIFO inventory = LIFO + reserve; DTL menunda pajak ke masa depan, DTA sebaliknya.",
        "VaR diam tentang ekor — laporkan bersama expected shortfall; Sharpe memakai return berlebih.",
      ],
      next: { label: "PM-CFA Drill Kalkulator BA II Plus", href: "/learn/pm-cfa-calculator-drill" },
    },
  ],
};

import type { V2Lesson } from "../lib/types";

// Diagram payoff collar (long put K=90 + short call K=110, zero-cost, S=100)
// vs tanpa proteksi. Garis datar = lantai 90 dan plafon 110; area arsir =
// zona lindung (kiri) dan upside yang dikorbankan (kanan).
const COLLAR_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Payoff collar: lantai 90 dan plafon 110, dibanding tanpa proteksi yang diagonal penuh.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<polygon points="60,220 60,143 225,143" fill="var(--c1)" opacity="0.12"/>
<polygon points="335,91 500,91 500,14" fill="var(--c4)" opacity="0.15"/>
<line x1="225" y1="25" x2="225" y2="228" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<line x1="335" y1="25" x2="335" y2="228" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"/>
<polyline points="60,220 500,14" fill="none" stroke="var(--c2)" stroke-width="2"/>
<polyline points="60,143 225,143 335,91 500,91" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="115" cy="143" r="4" fill="var(--c1)"/>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="95">110</text><text x="54" y="147">90</text><text x="54" y="224">60</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">60</text><text x="225" y="240">90 (put)</text><text x="280" y="240">100</text><text x="335" y="240">110 (call)</text><text x="500" y="240">140</text></g>
<text x="62" y="14" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">nilai portofolio</text>
<text x="225" y="162" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">lantai 90: rugi maks 10%</text>
<text x="417" y="78" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">plafon 110: cuan maks 10%</text>
<text x="128" y="178" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">zona lindung</text>
<text x="417" y="52" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">upside dikorbankan</text>
<text x="115" y="130" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">S=70 -&gt; nilai 90</text>
<text x="490" y="30" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">abu: tanpa proteksi</text>
</svg>`;

export const pmc9: V2Lesson = {
  slug: "pm-c9-derivatives-overlay",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C9 — Derivatives Overlay",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-dana-pensiun",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp50 miliar yang diasuransikan Rp500 juta",
      prose: [
        "Dana pensiun kelola Rp50 miliar saham. Januari 2020: CIO gelisah \u2014 valuasi tinggi, virus misterius. Ia beli protective put 3 bulan: premi Rp500 juta (1%). Maret: pasar −35% \u2192 put meledak \u2192 kerugian terpotong Rp12 miliar.",
        "Twist-nya: dewan protes \u2014 \u2018Rp500jt hangus jika pasar naik!\u2019 CIO: \u2018Asuransi rumah juga hangus jika tidak kebakaran.\u2019 Tahun itu put tidak hangus \u2014 ia menyelamatkan funded ratio.",
        "Lesson ini tentang derivatif sebagai asuransi, bukan spekulasi: equity overlay, currency overlay, dan portable alpha.",
      ],
      note: {
        title: "Intuisi: overlay adalah keputusan tentang apa yang TIDAK kamu lakukan",
        body: "Tiga heuristik praktisi overlay. Pertama, nilai overlay diukur dari apa yang ia cegah, bukan dari apa yang ia hasilkan — put yang kedaluwarsa sia-sia 9 tahun lalu menyelamatkan dana di tahun ke-10; dewan yang menilai overlay dari P&L tahunan akan selalu membatalkannya tepat sebelum dibutuhkan. Kedua, overlay yang baik membuatmu berani memegang SAA yang benar: tanpa collar, komite takut alokasi 70% ekuitas; dengan collar, mereka berani — proteksi memungkinkan keberanian yang produktif. Ketiga, kompleksitas overlay harus berbanding terbalik dengan frekuensi review-nya: strategi yang butuh pantauan harian (portable alpha dengan margin) tidak cocok untuk komite yang rapat kuartalan — pilih overlay yang bisa “ditinggal tidur” sesuai governance-mu. Keempat, overlay termurah adalah yang tidak dipasang: sebelum membeli proteksi, hitung dulu biaya tidak melakukan apa-apa \u2014 untuk horizon 20 tahun, drawdown 30% yang pulih dalam tiga tahun berharga nol. Kelima, lindung nilai parsial yang konsisten mengalahkan lindung nilai penuh yang on-off mengikuti emosi \u2014 disiplin mengalahkan presisi.",
      },
      tasks: [],
      reference: "Derivatif = alat; tujuan yang menentukan.",
    },
    {
      id: "equity-overlay",
      eyebrow: "Langkah 2 · Equity overlay + chart",
      title: "Asuransi portofolio: put, call, collar",
      prose: [
        "Tiga equity overlay. Protective put: beli put \u2192 batasi downside, bayar premi. Covered call: jual call \u2192 terima premi, korbankan upside (cocok saat pasar sideways + butuh income). Collar: beli put + jual call \u2192 koridor (downside lindung, upside dibatasi) \u2014 sering zero-cost.",
        "Contoh collar dana pensiun: saham harga 100; beli put K=90 (premi 3), jual call K=110 (premi 3) \u2192 zero-cost. Jatuh ke 70: put bayar 20 \u2192 nilai 90 (rugi maks 10%). Naik ke 130: call dieksekusi \u2192 nilai 110% (cuan maks 10%). Maret 2020: pasar −35% \u2192 portofolio hanya −10%. Funded ratio selamat. Trade-off yang tidak bisa dihindari: proteksi selalu dibayar \u2014 dengan premi atau dengan upside.",
        "Overlay bukan alokasi: punya portofolio Rp50M dan takut crash 3 bulan? Jual = ubah SAA + biaya + pajak + timing risk. Overlay put = bayar premi 1% \u2192 pertahankan SAA + proteksi sementara. Jual saham mengubah strategi; overlay hanya menambah lapisan. Kapan tidak perlu overlay? Horizon 30 tahun (crash = noise yang pulih), atau premi sedang mahal. Timing overlay itu kontra-intuitif: beli saat tenang (VIX < 15, premi murah), bukan saat panik (VIX > 30, premi 3× lipat).",
        "Cara membaca: sumbu X = harga saham saat opsi jatuh tempo; sumbu Y = nilai portofolio collar. Garis abu diagonal = tanpa proteksi (nilai = harga saham). Garis biru = collar: datar di 90 untuk harga di bawah 90, mengikuti harga di antara 90–110, datar di 110 untuk harga di atas 110. Garis putus-putus = strike put (90) dan call (110).",
        "Interpretasi: collar memotong kedua ekor distribusi — jatuh ke 70, nilai tetap 90 (rugi maks 10% alih-alih 30%, area arsir kiri); naik ke 130, nilai berhenti di 110 (cuan maks 10%, area arsir kanan = upside yang dikorbankan). Inilah harga proteksi zero-cost: bukan premi, melainkan plafon. Koridor ketenangan selalu punya langit-langit.",
      ],
      figure: {
        svg: COLLAR_SVG,
        alt: "Diagram payoff collar: lantai 90 dan plafon 110 dibanding tanpa proteksi yang diagonal penuh.",
        caption: "Payoff collar (put 90 + call 110, zero-cost): downside dipotong di 90, upside dibatasi di 110 — proteksi dibayar dengan plafon, bukan premi.",
      },
      formula: String.raw`\text{Collar: } S + P(K_1) - C(K_2), \quad K_1 < S < K_2`,
      formulaNote: "P(K1) = long put strike bawah (lantai), C(K2) = short call strike atas (plafon). Zero-cost bila premi put ≈ premi call.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Overlay = market timing.\u2019 Salah. Overlay = pertahankan SAA + proteksi sementara. Timing = ubah SAA karena ramalan. Overlay itu disiplin; timing itu spekulasi.",
      },
      reference: "Collar = koridor ketenangan; harganya upside dibatasi.",
    },
    {
      id: "lab-collar",
      eyebrow: "Langkah 3 · Lab collar",
      title: "Kalkulator collar",
      prose: [
        "Hitung lantai, plafon, dan biaya bersih collar dari strike dan premi. Coba ubah STRIKE_CALL dari 110 menjadi 105: plafon turun, tetapi premi call naik \u2014 kamu bisa dapat zero-cost dengan put yang lebih jauh.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lantai` dan `plafon`" },
        { id: "t2", text: "Hitung `biaya_bersih`" },
        { id: "t3", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Rugi maksimal : 10% (lantai 90)  Cuan maksimal : 10% (plafon 110)  Biaya bersih  : 0 (ZERO-COST)",
      hints: [
        "lantai = STRIKE_PUT − (PREMI_PUT − PREMI_CALL); plafon = STRIKE_CALL − (PREMI_PUT − PREMI_CALL).",
        "biaya_bersih = PREMI_PUT − PREMI_CALL.",
        "Rugi maks = (1 − lantai/S), cuan maks = (plafon/S − 1) \u2014 format persen dengan :.0%.",
      ],
      code: {
        starter: `# Kalkulator collar: S + P(K1) - C(K2)\nS = 100\nSTRIKE_PUT, PREMI_PUT = 90, 3\nSTRIKE_CALL, PREMI_CALL = 110, 3   # ubah jadi 105!\n\n# TULIS KODEMU\nlantai = \nplafon = \nbiaya_bersih = \n\nprint(f"Rugi maksimal : {(1 - lantai/S):.0%} (lantai {lantai})")\nprint(f"Cuan maksimal : {(plafon/S - 1):.0%} (plafon {plafon})")\nprint(f"Biaya bersih  : {biaya_bersih} ({'ZERO-COST' if biaya_bersih==0 else 'bayar' if biaya_bersih>0 else 'terima premi'})")\nprint()\nprint("Collar = koridor ketenangan. Harga: upside dibatasi.")`,
        lockLines: 3,
        solution: `# Kalkulator collar: S + P(K1) - C(K2)\nS = 100\nSTRIKE_PUT, PREMI_PUT = 90, 3\nSTRIKE_CALL, PREMI_CALL = 110, 3   # ubah jadi 105!\n\n# TULIS KODEMU\nlantai = STRIKE_PUT - (PREMI_PUT - PREMI_CALL)\nplafon = STRIKE_CALL - (PREMI_PUT - PREMI_CALL)\nbiaya_bersih = PREMI_PUT - PREMI_CALL\n\nprint(f"Rugi maksimal : {(1 - lantai/S):.0%} (lantai {lantai})")\nprint(f"Cuan maksimal : {(plafon/S - 1):.0%} (plafon {plafon})")\nprint(f"Biaya bersih  : {biaya_bersih} ({'ZERO-COST' if biaya_bersih==0 else 'bayar' if biaya_bersih>0 else 'terima premi'})")\nprint()\nprint("Collar = koridor ketenangan. Harga: upside dibatasi.")`,
        checks: [
          { kind: "equal", task: "t1", name: "lantai", value: 90, tol: 1e-9, label: "`lantai` = 90", msg: "90 − (3 − 3) = 90." },
          { kind: "equal", task: "t1", name: "plafon", value: 110, tol: 1e-9, label: "`plafon` = 110", msg: "110 − (3 − 3) = 110." },
          { kind: "equal", task: "t2", name: "biaya_bersih", value: 0, tol: 1e-9, label: "`biaya_bersih` = 0", msg: "3 − 3 = 0 \u2192 ZERO-COST. \u2018Gratis\u2019 bukan berarti tanpa biaya: bayarnya dengan upside yang dibatasi." },
          { kind: "stdout_matches", task: "t3", pattern: "Biaya bersih  : 0 \\(ZERO-COST\\)", label: "`print` menampilkan ZERO-COST", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Collar zero-cost = kompromi: proteksi tanpa premi, upside dibatasi.",
    },
    {
      id: "lab-hedge-ratio",
      eyebrow: "Langkah 4 · Lab hedge ratio",
      title: "Berapa banyak valas yang di-hedge?",
      prose: [
        "Hitung hedge ratio optimal dari korelasi dan volatilitas, lalu biaya carry-nya. Coba ubah RHO dari 0,3 menjadi 0,8 (korelasi kuat): h* naik \u2014 hedge lebih besar. Ingat: h* jarang 100%; ini optimisasi, bukan tombol on/off.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `h` dan batasi ke [0, 1]" },
        { id: "t2", text: "Hitung `nilai_hedge` dan `biaya`" },
        { id: "t3", text: "Cetak hasil dengan `print`" },
      ],
      expected: "h* = 56% → hedge Rp5,625jt  Biaya carry: Rp112jt/tahun",
      hints: [
        "h = RHO × SIG_ASET / SIG_FX, lalu max(0, min(1, h)).",
        "nilai_hedge = EKSPOSUR × h; biaya = nilai_hedge × CARRY.",
        "Format f-string lama: {h:.0%} untuk persen, {nilai_hedge:,.0f} untuk ribuan.",
      ],
      code: {
        starter: `# Hedge ratio optimal: h* = rho * sigma_aset / sigma_fx\nRHO = 0.3          # korelasi aset vs FX (ubah jadi 0.8!)\nSIG_ASET = 0.15\nSIG_FX = 0.08\nEKSPOSUR = 10_000  # Rp jt\nCARRY = 0.02       # biaya hedge/tahun\n\n# TULIS KODEMU\nh = \nh = \nnilai_hedge = \nbiaya = \n\nprint(f"h* = {h:.0%} -> hedge Rp{nilai_hedge:,.0f}jt")\nprint(f"Biaya carry: Rp{biaya:,.0f}jt/tahun")\nprint()\nprint("h* jarang 100%: optimisasi, bukan on/off.")\nprint("Review berkala: korelasi berubah!")`,
        lockLines: 5,
        solution: `# Hedge ratio optimal: h* = rho * sigma_aset / sigma_fx\nRHO = 0.3          # korelasi aset vs FX (ubah jadi 0.8!)\nSIG_ASET = 0.15\nSIG_FX = 0.08\nEKSPOSUR = 10_000  # Rp jt\nCARRY = 0.02       # biaya hedge/tahun\n\n# TULIS KODEMU\nh = RHO * SIG_ASET / SIG_FX\nh = max(0, min(1, h))\nnilai_hedge = EKSPOSUR * h\nbiaya = nilai_hedge * CARRY\n\nprint(f"h* = {h:.0%} -> hedge Rp{nilai_hedge:,.0f}jt")\nprint(f"Biaya carry: Rp{biaya:,.0f}jt/tahun")\nprint()\nprint("h* jarang 100%: optimisasi, bukan on/off.")\nprint("Review berkala: korelasi berubah!")`,
        checks: [
          { kind: "equal", task: "t1", name: "h", value: 0.5625, tol: 1e-9, label: "`h` = 0.5625", msg: "0,3 × 0,15 / 0,08 = 0,5625 \u2192 tampil sebagai 56%." },
          { kind: "equal", task: "t2", name: "nilai_hedge", value: 5625, tol: 1e-6, label: "`nilai_hedge` = 5625", msg: "10.000 × 0,5625 = 5.625 (Rp jt)." },
          { kind: "equal", task: "t2", name: "biaya", value: 112.5, tol: 1e-6, label: "`biaya` = 112.5", msg: "5.625 × 0,02 = 112,5 (Rp jt/tahun) \u2192 tampil sebagai Rp112jt." },
          { kind: "stdout_matches", task: "t3", pattern: "h\\* = 56% -> hedge Rp5,625jt", label: "`print` menampilkan h* = 56%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "h* = optimisasi; review ulang saat korelasi berubah.",
    },
    {
      id: "currency-overlay",
      eyebrow: "Langkah 5 · Currency overlay",
      title: "Menjinakkan valas tanpa membunuh diversifikasi",
      prose: [
        "Aset global = return aset + return valas. Hedge ratio optimal dari regresi: h* = ρ × (σ_aset / σ_fx). Contoh: reksadana USD Rp10M, ρ = 0,3, σ_aset = 15%, σ_fx = 8% → h* = 0,3 × 15/8 = 0,56 → hedge 56% via forward USDIDR. Biaya carry ≈ selisih suku bunga (BI rate − Fed rate ≈ 2%/tahun) → Rp112jt/tahun untuk proteksi Rp5,6M.",
        "Keputusan hedge adalah keputusan ekonomi, bukan teknis. Hedge jika valas = risiko tanpa premi (jangka pendek) atau volatilitasnya mengganggu IPS. Jangan hedge penuh jika horizon panjang (valas = diversifikasi, USD justru natural hedge saat krisis) atau biaya carry mahal. Praktik umum: parsial 25\u201350% \u2014 bukan 0%, bukan 100%.",
        "Manajer saham hebat tapi buta valas? Overlay terpusat lebih baik daripada tiap manajer hedging sendiri: spesialis, konsisten, efisien (netting, skala), dan akuntabilitasnya jelas. Pisahkan yang bisa dipisahkan: biarkan manajer saham memilih saham, tim terpisah kelola risiko mata uang.",
      ],
      formula: String.raw`h^* = \rho_{A,FX} \frac{\sigma_A}{\sigma_{FX}}`,
      formulaNote: "h* = hedge ratio optimal. Jika h* = 0,6 → hedge 60% eksposur. Biaya hedge ≈ selisih suku bunga.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Hedge 100% selalu terbaik \u2014 hilangkan semua risiko valas.\u2019 Salah. Full hedge = bayar biaya carry penuh + membuang diversifikasi valas jangka panjang. Hedge ratio adalah optimisasi, bukan tombol on/off. Hedging itu keputusan ekonomi: hedge jika risiko > biaya.",
      },
      reference: "Currency overlay = sabuk pengaman: perjalanan tetap jalan, cedera berkurang.",
    },
    {
      id: "portable-alpha",
      eyebrow: "Langkah 6 · Portable alpha",
      title: "Memindahkan keahlian, bukan sekadar eksposur",
      prose: [
        "Portable alpha: pisahkan alpha (skill manajer A) dari beta (eksposur pasar B) via derivatif \u2014 pindahkan alpha ke mana pun dibutuhkan. Contoh: manajer obligasi hebat (alpha +3%) tetapi SAA butuh ekuitas → beli manajer obligasi + jual bond futures + beli equity futures (swap beta). Hasil: eksposur ekuitas + alpha obligasi. Completion portfolio adalah kerabatnya: overlay yang melengkapi bias tidak disengaja (mis. semua manajer large-cap → tambah small-cap futures).",
        "Syaratnya keras: alpha harus benar-benar portable (tidak terikat beta asalnya!), pasar futures harus likuid, dan kamu harus paham basis risk + margin. 2008 adalah pelajaran berdarah: portable alpha (alpha saham + beta obligasi) hancur \u2014 alpha berubah negatif, futures memicu margin call, likuiditas kering. Portable alpha = leverage terselubung.",
        "Dan jangan lupakan counterparty: AIG 2008 menjual proteksi (CDS) lalu gagal bayar. Hedging dengan counterparty lemah = ilusi. Cek collateral dan clearing sebelum percaya pada \u2018asuransi\u2019.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Portable alpha = leverage terselubung: saat krisis, alpha hilang tepat ketika margin menuntut. Kompleksitas adalah risiko. Hanya untuk institusi yang sangat paham \u2014 dan tetap dengan limit.",
      },
      reference: "Pinjam beta, bawa alpha \u2014 hanya jika benar-benar paham.",
    },
    {
      id: "minicase-put",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Put Rp500 juta: anatomi keputusan",
      prose: [
        "Dana pensiun Rp50M: beli put 3 bulan premi Rp500jt (Januari 2020 \u2014 murah saat tenang). Maret: −35% → rugi terpotong Rp12M. Dewan protes: \u2018Rp500jt hangus jika naik!\u2019",
        "(a) Jawab dengan analogi: asuransi rumah juga hangus jika tidak kebakaran \u2014 ekspektasi premi hangus, nilainya di skenario buruk. (b) Mengapa put, bukan jual saham? Jual = ubah SAA + biaya + pajak; put = pertahankan SAA + proteksi sementara. (c) Kapan tidak perlu? Horizon sangat panjang + surplus besar (volatilitas = noise), atau premi mahal (VIX tinggi) \u2014 pertimbangkan collar/parsial.",
        "(d) Breakeven kasar: hemat Rp12M saat crash vs bayar Rp500jt × 10 tahun = Rp5M → 12M > 5M, layak. Bahkan jika crash 1 dari 20 tahun: 12M vs 10M → masih layak. Asuransi dibayar untuk skenario, bukan untuk rata-rata. (e) Komunikasi ke dewan harus sebelum beli: \u2018premi akan hangus jika naik \u2014 itu rencana\u2019, tertulis di IPS, dievaluasi dari proses bukan hasil. Edukasi = vaksin protes.",
      ],
      tasks: [],
      reference: "1987: portfolio insurance memperparah crash \u2014 put asli > sintetis; sederhana > pintar.",
    },

    {
      id: "hedging-futures-ekuitas",
      eyebrow: "Langkah 8 · Hedging tingkat lanjut",
      title: "Hedging ekuitas dengan futures: murah, tetapi tidak gratis",
      prose: [
        "Futures indeks adalah cara termurah memangkas eksposur ekuitas sementara: jual futures senilai porsi yang ingin dilindungi. Contoh: portofolio Rp50 miliar, beta 1,1 terhadap indeks. Ingin turunkan beta ke 0,5 selama 3 bulan tanpa menjual saham (hindari pajak + biaya + kehilangan dividen). Nilai futures per kontrak Rp1,5 miliar → jumlah kontrak = 50M × (1,1 − 0,5) / 1,5M = 20 kontrak short. Biaya: komisi kecil + roll cost (selisih harga futures antar-seri, ~0,3\u20130,5%/kuartal) + margin yang mengikat kas.",
        "Tiga gesekan yang membuat hedge futures tidak sempurna. Basis risk: portofoliomu ≠ indeks \u2014 jika saham-saham value-mu jatuh 40% sementara indeks (didominasi big-tech) hanya −25%, short futures hanya menutup 25 poin; 15 poin sisanya tetap lukamu. Ukur tracking error portofolio vs indeks SEBELUM mengandalkan hedge: TE 8% berarti hedge futures menyisakan ±8% yang tidak terlindungi. Margin call: futures di-mark-to-market harian \u2014 jika pasar naik tajam (bukan turun), posisi short merugi di kertas dan broker menuntut tambahan margin; dana yang kas-nya tipis bisa dipaksa menutup hedge di waktu terburuk. Roll risk: tiap 3 bulan kontrak kedaluwarsa dan harus di-roll \u2014 di pasar contango, roll memakan 1\u20132% per tahun.",
        "Aturan keputusan: (1) hedge futures layak bila portofolio berkorelasi tinggi dengan indeks (R² > 0,85) \u2014 jika tidak, pertimbangkan put options pada saham spesifik atau terima risikonya; (2) siapkan likuiditas margin 10\u201315% dari nilai hedge \u2014 jangan sampai proteksi membunuhmu lewat margin call; (3) tetapkan durasi hedge di muka (mis. 3 bulan) dengan kriteria perpanjangan tertulis \u2014 hedge \u201Csementara\u201D yang diperpanjang terus-menerus adalah perubahan SAA yang tidak diakui; (4) untuk IDX: likuiditas futures terbatas dibanding pasar AS \u2014 cek bid-ask spread dan open interest sebelum mengandalkan angka teoritis.",
      ],
      formula: String.raw`N = \frac{V_p \cdot (\beta_{target} - \beta_{awal})}{V_{kontrak}}`,
      formulaNote: "N = jumlah kontrak futures (negatif = short). V_p = nilai portofolio; β_awal = beta kini, β_target = beta yang diinginkan; V_kontrak = nilai nosional per kontrak. Contoh: 50M × (0,5 − 1,1)/1,5M = −20 kontrak (short 20). Tanda negatif = jual futures untuk menurunkan eksposur. Rumus ini mengasumsikan korelasi portofolio-indeks tinggi \u2014 jika tidak, tambahkan penyesuaian tracking error.",
      tasks: [],
      reference: "Futures = hedge murah; basis risk + margin + roll = harganya. R² > 0,85 dulu.",
    },
    {
      id: "kapan-overlay-merusak",
      eyebrow: "Langkah 9 · Batas overlay",
      title: "Kapan overlay justru merusak portofolio",
      prose: [
        "Overlay merusak lewat lima pintu. Pertama, over-hedging kronis: dana yang membeli protective put SETIAP kuartal selama 10 tahun bull market membayar ~1,5%/tahun × 10 = 15% return yang hilang untuk proteksi yang tidak pernah terpakai \u2014 lebih mahal dari drawdown yang coba dicegah. Aturan: overlay taktis (beli saat valuasi ekstrem + VIX murah), bukan overlay permanen; jika butuh proteksi permanen, turunkan saja alokasi ekuitasnya \u2014 lebih jujur dan lebih murah.",
        "Kedua, basis risk yang diremehkan: hedging portofolio saham Indonesia dengan futures indeks yang komposisinya beda, atau hedging USDIDR dengan proxy SGD \u2014 saat krisis, korelasi yang \u201Cbiasanya 0,8\u201D bisa runtuh ke 0,3 tepat saat dibutuhkan (correlation breakdown). Lindung nilai yang gagal di momen kritis lebih buruk daripada tidak hedging: kamu membayar premi DAN menanggung rugi. Uji stress: bagaimana hedge-mu berperilaku di 2008/2020, bukan di kondisi normal.",
        "Ketiga, counterparty dan kompleksitas: AIG 2008 menjual CDS (proteksi) lalu hampir gagal bayar \u2014 pembeli proteksi hampir kehilangan keduanya (premi + klaim). Untuk institusi Indonesia: pakai bursa berkliring (cleared) bila tersedia; untuk OTC, tetapkan limit eksposur per counterparty + collateral agreement (CSA). Keempat, overlay yang mengubah perilaku: collar zero-cost membuat komite merasa \u201Caman\u201D lalu menaikkan alokasi ekuitas melebihi risk tolerance \u2014 proteksi parsial dipakai untuk membenarkan risiko berlebih (moral hazard internal). Kelima, biaya tersembunyi jangka panjang: roll cost futures 1\u20132%/tahun + carry hedge FX 2%/tahun + premi put 1\u20135%/tahun \u2014 jumlahkan SEMUA overlay dalam satu \u201Canggaran proteksi\u201D tahunan (mis. maks 1% dari NAV); jika melebihi, pangkas proteksi yang tumpang tindih.",
        "Checklist sebelum memasang overlay apa pun: (1) risiko apa persisnya yang dilindungi \u2014 tulis satu kalimat; (2) berapa biaya total tahunan (premi + carry + roll + margin opportunity cost); (3) apa yang terjadi di skenario ekstrem (counterparty gagal? korelasi runtuh? margin call?); (4) kapan overlay dilepas \u2014 kriteria tertulis, bukan perasaan; (5) apakah alternatif sederhana (turunkan alokasi, diversifikasi) lebih murah? Overlay yang tidak lolos lima pertanyaan ini adalah kompleksitas yang menyamar sebagai kehati-hatian.",
      ],
      tasks: [],
      reference: "Anggaran proteksi ≤1% NAV/tahun; tulis risiko, biaya total, skenario ekstrem, dan kriteria lepas.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Equity overlay: put = asuransi, call = income, collar = koridor (sering zero-cost); proteksi selalu dibayar.",
        "Currency overlay: h* = ρ × σ_aset/σ_fx; hedge parsial optimal; keputusan ekonomi, bukan on/off.",
        "Portable alpha: pindahkan alpha via futures; = leverage terselubung \u2014 hanya jika sangat paham.",
        "Overlay ≠ alokasi: lindungi sementara tanpa ubah SAA; beli asuransi saat tenang (VIX rendah).",
        "Lima prinsip: pertahankan SAA, bayar untuk tenang, pisahkan keputusan, pahami sebelum pakai, komunikasikan sebelum beli.",
      ],
      next: { label: "C10 \u2014 Trading & Execution", href: "/v2/learn/pm-c10-trading-execution" },
      quiz: [
        {
          q: "Portofolio Rp50M, beta 1,1, target beta 0,5, nilai kontrak Rp1,5M. Berapa kontrak short?",
          options: [
            { text: "20 kontrak short", why: "Tepat: 50M × (0,5 − 1,1)/1,5M = −20. Tanda negatif = short untuk menurunkan eksposur.", correct: true },
            { text: "33 kontrak short", why: "Salah: itu memakai beta awal penuh (50M × 1,1/1,5M) \u2014 padahal targetnya 0,5, bukan 0." },
            { text: "20 kontrak long", why: "Salah arah: long futures MENAMBAH eksposur; untuk hedging butuh short." },
            { text: "Tidak bisa dihitung", why: "Salah: rumusnya tersedia dan semua input diketahui." },
          ],
        },
        {
          q: "Collar: beli put K=90 (premi 3), jual call K=110 (premi 3), S=100. Lantai & plafon?",
          options: [
            { text: "90 & 110 (zero-cost)", why: "Tepat: biaya bersih 0 → lantai 90, plafon 110. Koridor ketenangan gratis (bayar dengan upside).", correct: true },
            { text: "87 & 113", why: "Salah: lantai = 90 − (3−3) = 90, bukan 87. Premi saling meniadakan, bukan mengurangi lantai." },
            { text: "90 & 107", why: "Salah: plafon = 110 − (3−3) = 110. Premi call yang diterima menetralkan premi put yang dibayar." },
            { text: "93 & 110", why: "Salah: lantai 93 akan benar jika biaya bersih premi = 3, tetapi di sini zero-cost." },
          ],
        },
        {
          q: "ρ=0,3, σ_aset=15%, σ_fx=8%. Berapa h*?",
          options: [
            { text: "100%", why: "Salah: full hedge = bayar carry penuh + buang diversifikasi. h* jarang 100%." },
            { text: "56%", why: "Tepat: 0,3 × 15/8 = 0,5625. Hedge parsial optimal \u2014 optimisasi, bukan on/off.", correct: true },
            { text: "30%", why: "Salah: itu hanya ρ \u2014 rumusnya ρ × (σ_aset/σ_fx), bukan ρ saja." },
            { text: "0%", why: "Salah: 0% hanya benar jika ρ = 0 atau biaya > manfaat \u2014 di sini ada korelasi material." },
          ],
        },
        {
          q: "Portable alpha memindahkan?",
          options: [
            { text: "Beta ke pasar lain", why: "Salah: beta justru di-swap via futures \u2014 yang dipindahkan adalah alpha." },
            { text: "Alpha manajer A ke eksposur pasar B via derivatif", why: "Tepat: pisahkan alpha dari beta asal, tempel ke beta yang dibutuhkan. Syarat: alpha benar-benar portable.", correct: true },
            { text: "Risiko ke investor lain", why: "Salah: itu deskripsi asuransi/transfer risiko \u2014 bukan portable alpha." },
            { text: "Fee ke manajer", why: "Salah: fee tidak dipindahkan \u2014 yang dipindahkan adalah skill." },
          ],
        },
        {
          q: "Kapan beli protective put paling murah?",
          options: [
            { text: "Saat krisis", why: "Salah: saat krisis premi mahal (VIX tinggi, bisa 3× lipat)." },
            { text: "Saat tenang (VIX rendah)", why: "Tepat: premi murah saat VIX < 15. Asuransi dibeli sebelum kebakaran.", correct: true },
            { text: "Tidak pernah", why: "Salah: put menyelamatkan Rp12M pada 2020 \u2014 proteksi punya nilai saat dibutuhkan." },
            { text: "Saat panik", why: "Salah: panik = premi termahal. Itu membeli asuransi saat rumah sudah terbakar." },
          ],
        },
        {
          q: "Covered call cocok saat?",
          options: [
            { text: "Pasar bullish kuat", why: "Salah: upside yang dikorbankan justru besar saat bullish \u2014 call yang dijual dieksekusi." },
            { text: "Sideways + butuh income", why: "Tepat: jual call = terima premi, korbankan upside yang memang tidak diharapkan.", correct: true },
            { text: "Krisis", why: "Salah: saat krisis yang dibutuhkan proteksi downside (put), bukan income dari call." },
            { text: "Selalu", why: "Salah: tidak ada overlay yang selalu benar \u2014 semua tergantung objective." },
          ],
        },
      ],
    },
  ],
};

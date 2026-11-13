import type { V2Lesson } from "../lib/types";

export const mlfM44: V2Lesson = {
  slug: "mlf-m44-greeks-risk-decomposition",
  track: "Machine Learning Finance",
  module: "Market risk — Greeks & dekomposisi risiko",
  title: "MLF-M4.4 — Greeks & Dekomposisi Risiko: Dari Mana Datangnya Risiko?",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson sebelumnya menguji apakah VaR-mu jujur. Lesson ini bertanya lebih dalam: dari mana datangnya risiko itu? Dua alat menjawabnya dari dua sisi yang berbeda. Greeks menjelaskan bagaimana nilai SATU posisi opsi bergerak bila pasar bergerak — seberapa sensitif ia terhadap harga, volatilitas, waktu, dan suku bunga. Dekomposisi risiko menjelaskan bagaimana risiko SATU PORTOFOLIO terbagi di antara aset-asetnya — siapa penyumbang terbesar, dan posisi mana yang paling layak ditambah atau dikurangi.",
        "Tujuan lesson ini:",
        "• Menghitung harga dan Greeks sebuah call ATM pada ^GSPC dengan Black-Scholes — dan membaca tiap Greek sebagai keputusan (hedge, rebalancing, biaya waktu).",
        "• Menjelaskan delta sebagai lindung nilai: berapa saham per 1 kontrak call, dengan konvensi 1 kontrak = 100 saham.",
        "• Menjelaskan gamma sebagai «delta yang ikut bergerak» — kenapa delta hedging butuh rebalancing.",
        "• Menjelaskan vega (risiko volatilitas), theta (biaya waktu), dan rho (risiko suku bunga) dengan angka nyata.",
        "• Menghitung marginal VaR dan component VaR portofolio equal-weight — dan membuktikan penjumlahan Euler menutup (jumlah component VaR = VaR portofolio).",
        "• Membaca beta vs ^GSPC: kenapa saham IDX hampir tidak bergerak bersama S&P 500 — dan apa artinya untuk lindung nilai.",
        "• Menjalankan dua lab dari nol: Black-Scholes pada call ATM mainan, dan component VaR pada portofolio 2-aset mainan — tanpa library, hanya Python standar.",
        "Isi lesson: cerita trader dengan satu call → Black-Scholes & asumsi → delta & gamma → vega, theta, rho → atribusi P&L gabungan → dekomposisi risiko (marginal & component VaR) → beta vs ^GSPC → keputusan marginal → 2 lab → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M4.4: call ATM pada ^GSPC — S = 7.619,38, K = 7.619,38, T = 0,25 tahun, r = 0,05, σ = 0,2243 (vol realized 20 hari, tahunan) [notebook]. Harga call 388,03; delta 0,5665; gamma 0,000460; vega per +1pp vol 14,9867; theta per hari −2,3801; rho per +1pp suku bunga 9,8214 [notebook]. S naik 1 persen → call naik $44,49 (perkiraan delta $43,17); delta setelah S +1 persen menjadi 0,6011 [notebook]. Dekomposisi risiko (VaR95 parametrik, log return): portofolio VaR95 0,0324; BBCA marginal 0,0246 / component 0,0082 / share 0,2532; KLBF 0,0328 / 0,0109 / 0,3370; UNVR 0,0398 / 0,0133 / 0,4098 [notebook]. Beta vs ^GSPC: BBCA 0,1272, KLBF 0,1943, UNVR 0,0248; korelasi 0,0570 / 0,0706 / 0,0076 [notebook].",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Satu call, tiga saham, dan pertanyaan «dari mana risikonya?»",
      prose: [
        "Bayangkan kamu memegang dua hal sekaligus. Pertama, satu call option pada indeks S&P 500 (^GSPC) — hak membeli indeks di harga 7.619,38 tiga bulan lagi. Kedua, portofolio saham Indonesia: BBCA, KLBF, UNVR, bobot sama. Pagi ini S&P naik 1 persen dan portofoliomu bergerak entah ke mana. Dua pertanyaan muncul — dan keduanya tentang risiko, tapi dari arah yang berbeda.",
        "Pertanyaan pertama: call-mu naik berapa? Jawabannya bukan «1 persen» — opsi bergerak lebih rumit dari itu. Ia naik karena harga indeksnya naik (delta), naiknya itu sendiri berubah karena delta ikut bergerak (gamma), ia bisa naik atau turun karena volatilitas berubah (vega), dan setiap hari yang berlalu menggerogotinya sedikit (theta). Satu posisi, empat sumber gerakan — dan lesson ini mengukur keempatnya.",
        "Pertanyaan kedua: dari ketiga saham di portofoliomu, mana yang paling menyumbang risiko? Jawabannya bukan «yang bobotnya terbesar» — bobotnya sama semua, sepertiga-sepertiga-sepertiga. Jawabannya ada di volatilitas dan korelasi masing-masing — dan angka yang menjawabnya bernama component VaR: UNVR menyumbang 40,98 persen dari VaR portofolio meski bobotnya sama dengan yang lain [notebook].",
        "Nilai: call ATM ^GSPC berharga 388,03 — sekitar 5,09 persen dari harga indeks 7.619,38 [notebook]. Portofolio equal-weight punya VaR95 parametrik (log return) 0,0324 — pada Rp100 juta, kerugian 1 hari yang dilampaui 5 persen hari adalah Rp3.240.000 [notebook]. Dua angka, dua bahasa risiko: harga opsi bicara dalam dolar per kontrak, VaR portofolio bicara dalam fraksi nilai. Lesson ini mengajarkanmu menerjemahkan keduanya menjadi keputusan.",
        "Baik atau buruk: Greeks bagus karena ia mengubah «opsi itu berisiko» menjadi lima angka yang masing-masing bisa di-hedge: delta di-hedge dengan saham, vega dengan opsi lain, theta tidak bisa di-hedge — ia adalah biaya yang dibayar. Buruk bila dibaca sebagai ramalan: Greeks adalah turunan pada SATU titik — ia berkata «bila S naik sedikit, harga naik sekian», bukan «besok S akan naik». Dekomposisi risiko bagus karena ia mengubah «portofolio itu berisiko» menjadi peta — siapa penyumbangnya. Buruk bila dibaca sebagai vonis atas satu saham: component VaR besar bisa berarti sahamnya memang berisiko, atau berarti ia tidak terdiversifikasi dengan yang lain — dua diagnosis yang obatnya berbeda.",
        "Mitigasi: untuk opsi, selalu baca Greeks BERDAMPINGAN dengan asumsi modelnya (langkah 3) — harga 388,03 hanya setepat asumsinya. Untuk portofolio, selalu baca component VaR BERDAMPINGAN dengan marginal VaR (langkah 7) — component berkata «siapa penyumbang terbesar hari ini», marginal berkata «apa yang terjadi bila saya tambah atau kurangi posisi itu».",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: risiko portofolio = jumlah risiko tiap aset",
        type: "pitfall",
        body: "Yang benar: risiko portofolio BUKAN jumlah risiko aset-asetnya — korelasi menguranginya (diversifikasi). Itulah sebabnya dekomposisi memakai marginal VaR (turunan VaR terhadap bobot) dan component VaR (bobot × marginal), bukan VaR tiap aset dijumlahkan. Penjumlahan yang benar adalah penjumlahan component VaR — dan ia menutup persis ke VaR portofolio (Euler).",
      },
    },
    {
      id: "bs",
      eyebrow: "Langkah 3 · Black-Scholes",
      title: "Black-Scholes: harga call ATM dan lima asumsi yang wajib ditulis",
      prose: [
        "Rumus Black-Scholes memberi harga wajar sebuah call Eropa dari lima input: harga saham S, strike K, waktu sampai jatuh tempo T, suku bunga bebas risiko r, dan volatilitas σ. Dua besaran perantara — d1 dan d2 — mengubah kelima input itu menjadi probabilitas (di bawah ukuran risk-neutral): N(d1) adalah delta, N(d2) adalah probabilitas (risk-neutral) opsi berakhir in-the-money. Harga call = S × N(d1) − K × e^(−rT) × N(d2): nilai yang diharapkan dari menerima saham, dikurangi nilai yang diharapkan dari membayar strike (didiskon).",
        "Nilai: call ATM pada ^GSPC — S = 7.619,38, K = 7.619,38 (ATM: strike sama dengan harga saat ini), T = 0,25 tahun (3 bulan), r = 0,05, σ = 0,2243 (vol realized 20 hari, tahunan) [notebook]. Harga call 388,03 [notebook] — sekitar $388 untuk hak membeli indeks seharga $7.619 tiga bulan lagi. Itu mahal atau murah? Black-Scholes tidak menjawabnya — ia menjawab «berapa harga yang KONSISTEN dengan kelima input ini». Bila kamu tidak setuju dengan σ = 0,2243, kamu tidak setuju dengan harganya — dan perdebatan itu bernama implied volatility, bukan ada di lesson ini.",
        "Lima asumsi eksplisit yang wajib ditulis — karena setiap angka di lesson ini bergantung padanya. Pertama, ^GSPC sendiri tidak bisa ditransaksikan — ia indeks, bukan aset; proxy yang bisa ditransaksikan adalah opsi indeks SPX (dan ETF seperti SPY untuk sahamnya). Kedua, r = 5 persen adalah ASUMSI — bukan suku bunga yang dikutip dari pasar pada 11 November 2026. Ketiga, σ = 0,2243 adalah realized vol 20 hari — volatilitas MASA LALU yang dipakai sebagai proksi masa depan — bukan implied vol dari harga opsi di pasar. Keempat, tanpa dividen — dividen indeks diabaikan, padahal S&P 500 membayar dividen. Kelima, call Eropa — hanya bisa dieksekusi saat jatuh tempo, bukan kapan saja (Amerika). Ubah satu asumsi, berubah harganya — dan seorang risk manager yang tidak menuliskan asumsinya sedang menyembunyikan setengah dari modelnya.",
        "Baik atau buruk: Black-Scholes bagus sebagai BAHASA — lima input, satu harga, lima turunan (Greeks) yang masing-masing bisa di-hedge. Buruk bila dibaca sebagai hukum alam: volatilitas tidak konstan (lesson M4.3 menunjukkan ia bergerombol), return tidak normal (ekor gemuk), dan suku bunga tidak tetap. Harga 388,03 adalah titik awal perdebatan, bukan akhir perdebatan.",
        "Mitigasi: setiap kali kamu melaporkan harga opsi, laporkan kelima inputnya berdampingan — S, K, T, r, σ — plus sumber σ-nya (di sini: realized 20 hari). Dan ingat: σ adalah input yang PALING menentukan harga dan PALING tidak bisa diamati langsung — ia harus diestimasi (realized) atau dibalik dari harga pasar (implied). Ketidaksepakatan tentang σ adalah ketidaksepakatan tentang harga.",
      ],
      formula: String.raw`C = S\, N(d_1) - K e^{-rT} N(d_2), \quad d_1 = \frac{\ln(S/K) + (r + \tfrac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}`,
      formulaNote: "Harga call Eropa Black-Scholes. N(·) = fungsi distribusi normal standar. S = 7.619,38; K = 7.619,38 (ATM); T = 0,25; r = 0,05; σ = 0,2243 (realized 20 hari, tahunan). Asumsi: tanpa dividen, call Eropa, ^GSPC tidak bisa ditransaksikan langsung (proxy: opsi indeks SPX).",
      tasks: [],
      note: {
        title: "Miskonsepsi: harga Black-Scholes adalah «harga yang benar»",
        type: "pitfall",
        body: "Yang benar: Black-Scholes memberi harga yang konsisten dengan LIMA INPUT yang kamu masukkan — terutama σ. Bila σ yang kamu pakai (realized 20 hari, 0,2243) berbeda dari σ yang dipakai pasar (implied), harga «wajar»-mu berbeda dari harga pasar — dan selisih itu bukan kesalahan pasar, melainkan informasi: pasar tidak setuju dengan volatilitasmu.",
      },
    },
    {
      id: "delta-gamma",
      eyebrow: "Langkah 4 · Delta & gamma",
      title: "Delta = lindung nilai; gamma = delta ikut bergerak",
      prose: [
        "Delta adalah turunan harga opsi terhadap harga saham: bila S naik $1, harga call naik sebesar delta. Delta call ATM di sini 0,5665 [notebook] — call naik $0,57 untuk tiap $1 kenaikan indeks. Delta juga adalah probabilitas (risk-neutral) opsi berakhir in-the-money — 56,65 persen — dan rasio hedge: untuk melindung nilai 1 kontrak call (konvensi: 1 kontrak = 100 saham), jual 0,5665 × 100 ≈ 57 saham (atau ekuivalen indeksnya). Portofolio «call + short 57 saham» menjadi (sesaat) kebal terhadap gerakan kecil S — itulah delta hedging.",
        "Nilai: S naik 1 persen (dari 7.619,38 ke 7.695,57, naik $76,19) → call naik $44,49 (repricing Black-Scholes) — perkiraan delta saja $43,17 (0,5665 × 76,19 ≈ $43,16), selisih $1,32 adalah suku gamma (lihat langkah atribusi). Dan delta SETELAH kenaikan itu menjadi 0,6011 [notebook] — naik 0,0346. Itulah gamma bekerja: gamma 0,000460 per $1 [notebook] berarti tiap $1 kenaikan S menaikkan delta sebesar 0,000460 — dikali $76,19 kenaikan, delta naik ≈ 0,0350, cocok dengan 0,0346 yang teramati (selisih kecil karena gamma sendiri berubah sedikit sepanjang jalan).",
        "Gambar di bawah menunjukkan delta sebelum dan sesudah S naik 1 persen. Baca dengan benar: delta bukan konstanta — ia bergerak bersama S, dan gamma mengukur seberapa cepat ia bergerak.",
        "Baik atau buruk: delta bagus karena ia memberi SATU angka untuk hedge — 57 saham per kontrak — yang bisa dieksekusi hari ini. Buruk bila hedge-nya dibiarkan: begitu S bergerak, delta berubah (gamma), dan hedge yang tadinya netral menjadi tidak netral lagi. Delta hedging tanpa rebalancing adalah hedge yang kedaluwarsa — dan rebalancing itu sendiri punya biaya (spread, komisi, slippage). Gamma besar berarti delta berubah cepat — hedge-mu cepat kedaluwarsa, dan rebalancing-mu mahal.",
        "Mitigasi: tentukan ambang rebalancing SEBELUM berdagang — misal «rebalance bila delta bergerak lebih dari 0,05» — dan hitung biayanya sebagai bagian dari strategi, bukan sebagai kejutan. Dan ingat: delta hedging melindungi dari gerakan KECIL S; terhadap lompatan besar (gap), delta linear tidak cukup — di situlah gamma dan stress test (M4.5) masuk.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar delta call ATM: delta awal 0,5665; delta setelah S naik 1 persen 0,6011">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Delta call ATM: sebelum vs sesudah S naik 1% (gamma bekerja)</text>
<text x="240.0" y="32" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">S 7.619,38 → 7.695,57 · call naik $44,49 · gamma 0,000460 per $1</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<rect x="130" y="63.6" width="80" height="142.4" fill="var(--c4)"/>
<text x="170" y="59.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5665</text>
<rect x="270" y="54.9" width="80" height="151.1" fill="var(--c1)"/>
<text x="310" y="50.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6011</text>
<text x="170" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">delta awal</text>
<text x="310" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">delta setelah S +1%</text>
</svg>`,
        alt: "Bar delta call ATM: delta awal 0,5665; delta setelah S naik 1 persen 0,6011.",
        caption: "Cara membaca: bar kiri = delta awal (0,5665), bar kanan = delta setelah S naik 1 persen (0,6011). Interpretasi: delta naik 0,0346 karena gamma 0,000460 per $1 — hedge 57 saham per kontrak menjadi 60 saham; delta hedging butuh rebalancing.",
      },
      tasks: [],
    },
    {
      id: "vega-theta-rho",
      eyebrow: "Langkah 5 · Vega, theta, rho",
      title: "Vega = risiko volatilitas; theta = biaya waktu; rho = risiko suku bunga",
      prose: [
        "Tiga Greek sisanya menjawab tiga pertanyaan yang berbeda — dan ketiganya dibaca dalam satuan yang sama: «berapa dolar berubahnya harga call bila SATU input bergerak satu satuan?». Vega: bila volatilitas naik 1 poin persen (dari 22,43 persen ke 23,43 persen), call naik $14,9867 [notebook]. Theta: tiap hari yang berlalu (mendekati jatuh tempo, semua input lain tetap), call KEHILANGAN $2,3801 per hari [notebook]. Rho: bila suku bunga naik 1 poin persen (dari 5 persen ke 6 persen), call naik $9,8214 [notebook].",
        "Nilai: gambar di bawah menaruh keempat sensitivitas dalam satu sumbu — efek S +1 persen (+$44,49 total: delta $43,17 + gamma $1,34), efek vol +1pp (+$14,99, dari vega), efek 1 hari berlalu (−$2,38, dari theta), efek suku bunga +1pp (+$9,82, dari rho) [notebook]. Baca hierarkinya: gerakan harga mendominasi (44,49 total), volatilitas kedua (14,99), suku bunga ketiga (9,82), dan waktu menggerogoti pelan tapi PASTI (−2,38 per hari — estimasi linear 90 hari × $2,38 ≈ $214, lebih dari separuh harga call 388,03; tapi itu MEREMEHKAN: theta mempercepat saat mendekati expiry, dan bila S tetap = K sampai expiry, call menjadi 0 — peluruhan kumulatifnya penuh 388,03, bukan $214).",
        "Baik atau buruk: vega bagus untuk dibaca sebagai POSISI terhadap volatilitas — opsi panjang (long call) berarti long vega: kamu UNTUNG bila volatilitas naik, RUGI bila volatilitas turun. Itu juga berarti: membeli call ATM di tengah badai (vol tinggi) berarti membayar mahal untuk vega yang mungkin sudah di puncak. Theta bagus karena ia jujur: ia adalah biaya sewa waktu — pemegang opsi membayar $2,38 per hari untuk hak yang belum tentu dipakai. Buruk bila theta dibaca sebagai «kerugian yang pasti»: theta adalah biaya bila SEMUA input lain diam — dalam kenyataan, S bergerak setiap hari, dan gerakan S bisa menutup theta berkali-kali lipat. Rho bagus sebagai pengingat bahwa suku bunga BUKAN netral untuk opsi — tapi pada T = 0,25 tahun efeknya kecil (9,82 vs 43,17 efek delta dari S); rho baru dominan pada opsi jangka panjang.",
        "Mitigasi: bila kamu long call, tanyakan tiga hal setiap pagi — «apakah S bergerak ke arahku? (delta)», «apakah vol naik atau turun? (vega)», «berapa hari lagi yang saya bayar? (theta)». Bila kamu short call, ketiganya berbalik: kamu DIBAYAR theta $2,38 per hari, tapi kamu short vega — lonjakan volatilitas menyakitimu. Dan jangan pernah membandingkan theta antar opsi dengan T berbeda tanpa menormalisasi per hari — theta opsi 3 bulan dan opsi 3 tahun tidak sebanding mentah-mentah.",
        "Tips: vega paling besar pada opsi ATM dan jangka panjang — vega ATM tumbuh dengan √T (T = 0,25 → 14,99; T = 1 → ≈ 28,74 per +1pp), jadi opsi jangka panjang jauh lebih sensitif terhadap volatilitas daripada opsi 3 bulan di lesson ini. Bila kamu ingin bertaruh pada volatilitas (bukan pada arah harga), ATM straddle adalah kendaraan yang vega-nya paling murni — tapi itu topik strategi, bukan topik lesson ini.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar sensitivitas harga call ATM: S naik 1 persen +44,49; vol naik 1pp +14,99; satu hari berlalu -2,38; suku bunga naik 1pp +9,82">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Sensitivitas harga call ATM ($): S, vol, waktu, suku bunga</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−5</text>
<line x1="48" y1="188.4" x2="52" y2="188.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="191.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="153.2" x2="52" y2="153.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="156.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20</text>
<line x1="48" y1="82.8" x2="52" y2="82.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="85.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">30</text>
<line x1="48" y1="47.6" x2="52" y2="47.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="50.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">40</text>
<line x1="52" y1="188.4" x2="466" y2="188.4" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<rect x="80" y="31.8" width="60" height="156.6" fill="var(--c4)"/>
<text x="110" y="27.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+44,49</text>
<rect x="170" y="135.6" width="60" height="52.8" fill="var(--c1)"/>
<text x="200" y="131.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+14,99</text>
<rect x="260" y="188.4" width="60" height="8.4" fill="var(--c2)"/>
<text x="290" y="210.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−2,38</text>
<rect x="350" y="153.8" width="60" height="34.6" fill="var(--c1)"/>
<text x="380" y="149.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+9,82</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">S +1%</text>
<text x="200" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">vol +1pp</text>
<text x="290" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 hari</text>
<text x="380" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">r +1pp</text>
</svg>`,
        alt: "Bar sensitivitas harga call ATM: S naik 1 persen +44,49; vol naik 1pp +14,99; satu hari berlalu −2,38; suku bunga naik 1pp +9,82.",
        caption: "Cara membaca: tiap bar = perubahan harga call ($) bila satu input bergerak dan yang lain diam; garis putus-putus = nol; bar theta turun ke bawah nol. Interpretasi: gerakan harga mendominasi (+$44,49 = delta 43,17 + gamma 1,34), volatilitas kedua (+$14,99), suku bunga ketiga (+$9,82), waktu menggerogoti pelan tapi pasti (−$2,38 per hari). Bar S adalah efek S TOTAL (repricing), bukan perkiraan delta saja — lihat langkah atribusi.",
      },
      tasks: [],
    },
    {
      id: "atribusi-pnl",
      eyebrow: "Langkah 6 · Atribusi P&L",
      title: "Atribusi P&L: menjumlahkan kelima Greek menjadi satu perubahan harga",
      prose: [
        "Sejauh ini tiap Greek dibaca sendirian: delta bila S bergerak, vega bila vol bergerak, theta bila waktu berlalu, rho bila suku bunga bergerak. Di pasar nyata, semuanya bergerak BERSAMAAN — S naik, vol naik, satu hari berlalu, suku bunga naik — dan harga call berubah oleh gabungan kelimanya. Atribusi P&L adalah cara menjumlahkan kelima efek itu menjadi satu perubahan harga — dan cara mengukur berapa yang TIDAK tertangkap oleh penjumlahan itu.",
        "Rumusnya adalah ekspansi Taylor orde-1 ditambah suku gamma: ΔV ≈ Δ·ΔS + ½Γ(ΔS)² + Vega·Δσ + Θ·Δt + ρ·Δr. Tiap Greek adalah turunan parsial pada SATU titik — harga call hari ini, dengan input hari ini. Menjumlahkannya adalah PERKIRAAN perubahan harga, bukan perubahan sebenarnya. Perubahan sebenarnya hanya didapat dengan satu cara: repricing Black-Scholes — hitung ulang harga call dengan input yang baru. Selisih keduanya bernama residu: residu = perubahan sebenarnya − jumlah Taylor. Residu menampung semua yang tidak ditangkap Taylor: cross-Greek (vanna = perubahan delta bila vol bergerak, volga = perubahan vega bila vol bergerak, speed = perubahan gamma bila S bergerak) plus suku orde tinggi lainnya.",
        "Nilai — atribusi S +1% saja [notebook]: S naik 1 persen (7.619,38 → 7.695,57, ΔS = $76,19). Perkiraan delta saja: 0,5665 × 76,19 ≈ $43,17. Suku gamma: ½ × 0,000460 × 76,19² ≈ $1,34. Delta + gamma ≈ $44,50 (angka tak-bulat — jumlah suku yang dibulatkan 43,17 + 1,34 = 44,51; selisih 1 sen adalah pembulatan, bukan kesalahan). Perubahan SEBENARNYA (repricing Black-Scholes): $44,49 — residu −$0,01. Koreksi penting: $43,17 adalah perkiraan delta SAJA, bukan perubahan sebenarnya — call sebenarnya naik $44,49, dan selisih $1,32 dari perkiraan delta adalah suku gamma (dikurangi residu $0,01). Hedge delta-only meremehkan kenaikan harga sebesar $1,32 pada gerakan 1 persen — kecil, tapi bukan nol, dan ia tumbuh bersama ukuran gerakan.",
        "Nilai — skenario gabungan [ilustrasi]: S naik 1 persen, vol naik 1 poin persen, 1 hari berlalu, suku bunga naik 1 poin persen. Rinciannya: delta $43,17 + gamma $1,34 + vega $14,99 + theta −$2,38 + rho $9,82 = $66,93 (jumlah komponen yang belum dibulatkan). Perubahan SEBENARNYA (repricing): $67,23 — residu +$0,30. Pada gerakan kecil, Taylor bekerja sangat baik: residu $0,30 dari perubahan $67,23 — kurang dari setengah persen. Perhatikan tanda theta: 1 hari berlalu MENGURANGI harga $2,38 — theta adalah satu-satunya suku yang negatif di skenario ini, dan gerakan S serta vol menutupinya berkali-kali lipat.",
        "Nilai — skenario BESAR [ilustrasi]: S naik 5 persen, vol naik 3 poin persen, 5 hari berlalu, suku bunga naik 1 poin persen. Rinciannya: delta $215,83 + gamma $33,41 + vega $44,96 + theta −$11,90 + rho $9,82 = $292,12. Perubahan SEBENARNYA (repricing): $286,82 — residu −$5,30. Taylor kini MELEBIHI perubahan sebenarnya sebesar $5,30 — hampir 2 persen dari perubahan. Pelajarannya: residu kecil saat gerakan kecil (+$0,30 dari $67,23), membesar saat gerakan besar (−$5,30 dari $286,82). Taylor orde-1 + gamma akurat di dekat titik hitung, dan memburuk jauh darinya — karena gamma sendiri berubah sepanjang jalan (speed), dan vol yang bergerak mengubah delta serta vega (vanna, volga).",
        "Baik atau buruk: atribusi Taylor bagus karena ia memberi NAMA pada tiap dolar perubahan harga — $43,17 dari arah harga, $1,34 dari kelengkungan, $14,99 dari vol, −$2,38 dari waktu, $9,82 dari suku bunga — dan residu yang kecil adalah bukti bahwa modelmu masih memegang pasar. Buruk bila dibaca sebagai harga yang sebenarnya: hedge delta-only meremehkan $1,32 pada gerakan 1 persen — kecil — tapi pada gerakan 5 persen residunya −$5,30, dan hedge yang dibangun dari Taylor saja makin meleset seiring gerakan membesar. Dan buruk bila residu dibaca sebagai «kesalahan Greeks»: residu bukan kesalahan — ia adalah informasi bahwa gerakan sudah cukup besar sehingga aproksimasi linear + gamma tidak lagi cukup.",
        "Mitigasi: untuk skenario KECIL (gerakan sekitar 1 persen, 1 hari), Taylor + gamma cukup — residu di bawah $0,50 adalah wajar. Untuk skenario BESAR (gerakan 5 persen atau lebih, beberapa hari, vol bergerak beberapa poin), JANGAN percaya Taylor — reprice penuh dengan Black-Scholes dan laporkan residunya berdampingan. Untuk hedging, rebalance gamma (tambah opsi atau saham saat delta bergerak) daripada berharap delta-only cukup — dan ingat: cross-Greek (vanna, volga, speed) tidak pernah tertangkap Taylor orde-1 + gamma; bila vol dan harga bergerak bersamaan secara besar, hanya repricing penuh yang jujur.",
      ],
      formula: String.raw`\Delta V \approx \Delta\, \Delta S + \tfrac{1}{2}\Gamma (\Delta S)^2 + \text{Vega}\, \Delta\sigma + \Theta\, \Delta t + \rho\, \Delta r`,
      formulaNote: "Ekspansi Taylor orde-1 + suku gamma. Tiap Greek adalah turunan parsial pada satu titik (S = 7.619,38; σ = 0,2243; T = 0,25; r = 0,05). Jumlah Taylor adalah PERKIRAAN; harga sebenarnya = repricing Black-Scholes dengan input baru. Residu = sebenarnya − Taylor (cross-Greek: vanna, volga, speed + orde tinggi). Skenario gabungan/besar berlabel [ilustrasi].",
      tasks: [],
      quiz: [
        {
          q: "S naik 1 persen: call sebenarnya naik $44,49, perkiraan delta saja $43,17, suku gamma $1,34. Apa yang menjelaskan selisih $1,32 antara perkiraan delta dan perubahan sebenarnya?",
          options: [
            { text: "Gamma — suku ½Γ(ΔS)² menambah $1,34, sehingga delta + gamma ≈ $44,50 (angka tak-bulat; residu −$0,01)", why: "Benar: delta + gamma ≈ 44,50 (angka tak-bulat) vs sebenarnya 44,49 — selisih $1,32 dari perkiraan delta hampir seluruhnya adalah suku gamma; $43,17 adalah perkiraan delta SAJA, bukan perubahan sebenarnya.", correct: true },
            { text: "Vega — volatilitas ikut naik saat S naik 1 persen", why: "Volatilitas TIDAK berubah dalam skenario ini (hanya S yang bergerak) — suku vega-nya nol; yang bekerja adalah gamma." },
            { text: "Theta — satu hari berlalu menambah harga call $1,32", why: "Tidak ada waktu yang berlalu dalam skenario ini, dan theta justru MENGURANGI harga (−$2,38 per hari), bukan menambah." },
            { text: "Perkiraan delta yang salah hitung — delta 0,5665 seharusnya 0,5838", why: "Delta 0,5665 sudah benar (repricing membuktikannya); perkiraan delta memang BUKAN perubahan sebenarnya — ia adalah aproksimasi orde-1 yang mengabaikan gamma." },
          ],
        },
        {
          q: "Skenario gabungan (gerakan kecil) residunya +$0,30 dari $67,23; skenario BESAR residunya −$5,30 dari $286,82. Apa pelajaran utamanya?",
          options: [
            { text: "Taylor orde-1 + gamma akurat di dekat titik hitung dan memburuk jauh darinya — untuk skenario besar, reprice penuh dengan Black-Scholes", why: "Benar: residu membesar dari +$0,30 menjadi −$5,30 saat gerakan membesar — cross-Greek (vanna, volga, speed) dan orde tinggi tidak tertangkap Taylor; skenario besar wajib repricing penuh.", correct: true },
            { text: "Taylor itu eksak — residu −$5,30 berarti Greeks-nya salah hitung", why: "Residu bukan kesalahan hitung: Taylor adalah aproksimasi; residu adalah bagian perubahan yang memang tidak ditangkap aproksimasi orde-1 + gamma." },
            { text: "Residu yang membesar berarti delta-only hedge makin akurat pada gerakan besar", why: "Terbalik: residu yang membesar berarti hedge dari Taylor saja makin MELESET — delta-only meremehkan $1,32 pada gerakan 1 persen dan residu −$5,30 pada gerakan 5 persen." },
            { text: "Skenario besar tidak perlu dihitung — gerakan 5 persen tidak pernah terjadi", why: "Gerakan 5 persen terjadi — crash 16 Oktober 2026 di M4.2/M4.5 adalah buktinya; justru untuk gerakan besar inilah repricing penuh paling dibutuhkan." },
          ],
        },
      ],
    },
    {
      id: "dekomposisi",
      eyebrow: "Langkah 7 · Dekomposisi risiko",
      title: "Marginal VaR & component VaR: siapa menyumbang risiko portofolio?",
      prose: [
        "VaR portofolio bilang «risiko total sekian». Dekomposisi bertanya «siapa menyumbangnya?» — dan ia memakai kalkulus, bukan tebakan. Marginal VaR aset i adalah turunan VaR portofolio terhadap bobot aset i: berapa VaR bertambah bila bobot aset itu naik 1 unit (100 persen — jadi untuk kenaikan 1 poin persen, bagi 100). Component VaR = bobot × marginal VaR: kontribusi aset itu ke VaR total. Dan teorema Euler menjamin penjumlahannya menutup: jumlah component VaR SEMUA aset = VaR portofolio. Bila penjumlahanmu tidak menutup, ada yang salah dalam hitunganmu — itulah checks bawaan yang paling berguna di risk.",
        "Nilai: VaR95 parametrik portofolio (log return) 0,0324 [notebook]. BBCA: marginal VaR 0,0246, component VaR 0,0082, share 0,2532. KLBF: marginal 0,0328, component 0,0109, share 0,3370. UNVR: marginal 0,0398, component 0,0133, share 0,4098 [notebook]. Penjumlahan Euler: 0,0082 + 0,0109 + 0,0133 = 0,0324 — menutup persis ke VaR portofolio [notebook]. Perhatikan: VaR95 parametrik log-return ini (0,0324) sedikit berbeda dari VaR95 parametrik simple-return di M4.2 (0,0328) — keduanya benar, basis return-nya berbeda (log vs simple); lesson ini memakai log return agar konsisten dengan matriks kovarians log return.",
        "Gambar di bawah menunjukkan share component VaR: UNVR 0,4098 — lebih dari 40 persen risiko portofolio — meski bobotnya sama dengan BBCA dan KLBF (sepertiga masing-masing). Penyebabnya ada di langkah 8: volatilitas UNVR tertinggi.",
        "Baik atau buruk: component VaR bagus karena ia memberi peta risiko yang bisa ditindaklanjuti — bukan sekadar «portofolio berisiko», melainkan «UNVR menyumbang 41 persen». Buruk bila dibaca sebagai vonis atas UNVR: share besar bisa berarti sahamnya memang paling volatil, atau berarti ia paling tidak terdiversifikasi dengan dua lainnya — dan keduanya punya obat yang berbeda (kurangi bobot vs tambah aset yang berkorelasi rendah). Dan ingat: dekomposisi ini memakai VaR parametrik dengan asumsi normal dan korelasi linear — ia tidak menangkap risiko ekor bersama (tail dependence) yang muncul saat krisis.",
        "Mitigasi: laporkan SELALU tiga kolom berdampingan — marginal, component, share — plus penjumlahan Euler sebagai checks. Bila share sebuah aset jauh di atas bobotnya (di sini UNVR: share 0,4098 vs bobot 0,3333), tandai untuk ditinjau — bukan untuk langsung dijual. Keputusan jual/beli memakai marginal VaR (langkah 9), bukan component VaR.",
      ],
      formula: String.raw`\text{ComponentVaR}_i = w_i \cdot \frac{\partial \text{VaR}}{\partial w_i}, \qquad \sum_i \text{ComponentVaR}_i = \text{VaR}`,
      formulaNote: "Dekomposisi Euler: marginal VaR = turunan VaR terhadap bobot (di sini VaR parametrik: marginal = z95 × (Σw)_i / σ_portofolio); component = bobot × marginal; jumlah component = VaR portofolio. VaR95 parametrik log-return 0,0324.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar share component VaR: BBCA 0,2532; KLBF 0,3370; UNVR 0,4098; jumlah 1,0000">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Share component VaR — UNVR menyumbang 41% risiko (bobot sama)</text>
<text x="240.0" y="32" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">VaR95 portofolio 0,0324 · jumlah component = 0,0082 + 0,0109 + 0,0133</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<rect x="100" y="116.9" width="80" height="89.1" fill="var(--c1)"/>
<text x="140" y="112.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2532</text>
<rect x="230" y="87.4" width="80" height="118.6" fill="var(--c1)"/>
<text x="270" y="83.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3370</text>
<rect x="360" y="61.8" width="80" height="144.2" fill="var(--c4)"/>
<text x="400" y="57.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4098</text>
<text x="140" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">BBCA</text>
<text x="270" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">KLBF</text>
<text x="400" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">UNVR</text>
</svg>`,
        alt: "Bar share component VaR: BBCA 0,2532; KLBF 0,3370; UNVR 0,4098; jumlah 1,0000.",
        caption: "Cara membaca: tiap bar = share component VaR satu saham terhadap VaR95 portofolio 0,0324; bobot ketiganya sama (sepertiga). Interpretasi: UNVR menyumbang 40,98 persen risiko — bukan karena bobotnya, melainkan karena volatilitasnya tertinggi (0,4981 tahunan).",
      },
      tasks: [],
    },
    {
      id: "beta",
      eyebrow: "Langkah 8 · Beta vs ^GSPC",
      title: "Beta vs S&P: saham IDX hampir tidak bergerak bersama S&P 500",
      prose: [
        "Beta mengukur seberapa banyak return sebuah saham bergerak bersama pasar — di sini pasarnya ^GSPC (S&P 500). Beta 1 berarti bergerak seiring pasar; beta 0 berarti tidak berhubungan; beta 0,13 berarti bila S&P naik 1 persen, saham itu naik 0,13 persen (rata-rata, secara linear). Beta dihitung dari regresi return saham terhadap return pasar. Keduanya memang memakai kovarians — tapi dari pasangan yang BERBEDA: dekomposisi di langkah 7 memakai kovarians ANTAR saham (korelasi BBCA–KLBF 0,3610, BBCA–UNVR 0,2850, KLBF–UNVR 0,3001), sedangkan beta memakai korelasi tiap saham vs ^GSPC (0,0570 / 0,0706 / 0,0076) — dua himpunan korelasi yang sama sekali berbeda.",
        "Nilai: beta vs ^GSPC — BBCA 0,1272, KLBF 0,1943, UNVR 0,0248 [notebook]. Korelasi dengan ^GSPC — BBCA 0,0570, KLBF 0,0706, UNVR 0,0076 [notebook]. Semua sangat rendah: saham IDX ini hampir tidak bergerak bersama S&P 500. UNVR praktis tidak berhubungan sama sekali (korelasi 0,0076 — nol untuk semua tujuan praktis). Bandingkan dengan korelasi antar saham IDX sendiri: BBCA–KLBF 0,3610, BBCA–UNVR 0,2850, KLBF–UNVR 0,3001 [notebook] — saham-saham IDX bergerak bersama satu sama lain jauh lebih kuat daripada bersama S&P.",
        "Baik atau buruk: beta rendah bagus untuk diversifikasi global — menambahkan saham IDX ke portofolio S&P hampir tidak menambah risiko pasar S&P-nya. Buruk bila dipakai sebagai lindung nilai yang salah alamat: meng-hedge portofolio IDX dengan short S&P futures hampir tidak melindungi apa-apa — beta 0,13 berarti hedge ratio-nya kecil dan sisa risikonya (risiko spesifik IDX) tetap dominan. Dan buruk bila beta dibaca sebagai «saham ini aman»: beta rendah bukan berarti volatilitas rendah — UNVR punya beta terendah (0,0248) DAN volatilitas tahunan tertinggi (0,4981). Beta mengukur risiko SISTEMATIS terhadap S&P; volatilitas mengukur risiko TOTAL. Keduanya berbeda — dan UNVR adalah buktinya.",
        "Mitigasi: pilih benchmark yang relevan sebelum menghitung beta. Untuk portofolio IDX, benchmark yang benar adalah IHSG — bukan S&P 500. Beta vs S&P di sini diajarkan sebagai CONTOH perhitungan dan sebagai bukti segmentasi pasar (IDX vs AS), bukan sebagai alat hedge. Bila kamu meng-hedge portofolio IDX, hedge dengan instrumen yang berkorelasi dengan IDX — atau akui bahwa risiko spesifiknya tidak bisa di-hedge murah dan kelola lewat ukuran posisi.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: beta rendah berarti sahamnya aman",
        type: "pitfall",
        body: "Yang benar: beta hanya mengukur gerakan BERSAMA pasar acuan. UNVR: beta 0,0248 (terendah) tapi volatilitas tahunan 0,4981 (tertinggi) dan component VaR terbesar (share 0,4098). Risiko totalnya justru paling besar — hanya saja risikonya spesifik (idiosyncratic), bukan risiko pasar S&P. Beta rendah + volatilitas tinggi = saham yang bergerak liar sendirian.",
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 9 · Keputusan marginal",
      title: "Marginal VaR untuk keputusan «tambah atau kurangi posisi?»",
      prose: [
        "Component VaR berkata «siapa penyumbang terbesar hari ini». Marginal VaR berkata «apa yang terjadi bila saya UBAH posisinya». Itulah bedanya — dan itulah mengapa keputusan memakai marginal, bukan component. Marginal VaR BBCA 0,0246 berarti: naikkan bobot BBCA sebesar 1 unit (100 poin persen — tidak realistis, tapi itulah satuan turunan), VaR naik 0,0246; naikkan 1 poin persen (0,01), VaR naik 0,0246 × 0,01 = 0,000246. Marginal VaR UNVR 0,0398 — tertinggi — berarti tiap rupiah tambahan ke UNVR menambah VaR lebih banyak daripada rupiah tambahan ke BBCA (0,0246) atau KLBF (0,0328) [notebook].",
        "Nilai: urutan marginal VaR — UNVR 0,0398 > KLBF 0,0328 > BBCA 0,0246 [notebook] — sama dengan urutan component VaR, karena bobotnya sama. Tapi maknanya berbeda: marginal adalah HARGA risiko di margin. Bila kamu punya Rp10 juta tambahan untuk dialokasikan dan hanya peduli VaR, alokasikan ke BBCA — ia menambah VaR paling sedikit per rupiah. Bila kamu harus MEMOTONG risiko sebesar 0,0010 VaR dengan menjual satu saham, jual UNVR — tiap rupiah UNVR yang dijual mengurangi VaR paling banyak. Dan bila kamu menaikkan bobot UNVR 1 poin persen (dari 33,33 persen ke 34,33 persen, dengan menyesuaikan yang lain), VaR naik sekitar 0,0398 × 0,01 = 0,000398 — kecil, tapi itulah harga marginalnya.",
        "Baik atau buruk: marginal VaR bagus untuk keputusan KECIL (tambah/kurangi sedikit) — di situlah aproksimasi linear turunan akurat. Buruk untuk keputusan BESAR: menjual seluruh posisi UNVR tidak mengurangi VaR sebesar 0,0398 × 0,3333 — karena setelah penjualan besar, korelasi dan bobot portofolio berubah, dan turunan di titik lama tidak lagi berlaku. Component VaR (0,0133 untuk UNVR) adalah ukuran kontribusi SAAT INI; marginal VaR adalah ukuran perubahan DI MARGIN. Mencampuradukkan keduanya adalah kesalahan yang paling umum di risk reporting.",
        "Mitigasi: pakai marginal VaR untuk pertanyaan «tambah/kurangi sedikit?», pakai component VaR untuk pertanyaan «siapa penyumbang terbesar saat ini?», dan hitung ulang keduanya SETELAH perubahan besar — jangan ekstrapolasi turunan jauh dari titik hitungnya. Dan ingat caveat dari langkah 7: semua ini memakai VaR parametrik normal — untuk perubahan besar di tengah krisis, pakai stress test (M4.5), bukan turunan.",
        "Tips: aturan praktis yang bisa kamu pakai besok — bila share component VaR sebuah aset jauh di atas bobotnya (UNVR: 0,4098 vs 0,3333), dan marginal VaR-nya juga tertinggi (0,0398), maka aset itu adalah kandidat pertama untuk ditinjau: kurangi sedikit, atau cari tahu MENGAPA volatilitasnya tertinggi (di sini: 0,4981 tahunan) sebelum memutuskan.",
        "Jembatan ke M5 (optimasi portofolio): dua angka di lesson ini adalah BAHAN BAKU optimasi, bukan optimasi itu sendiri. Marginal VaR adalah GRADIEN — turunan VaR terhadap bobot — dan dalam optimasi portofolio (M5), gradien inilah yang menjadi turunan fungsi tujuan atau kendala: optimizer bergerak melawan gradien untuk menurunkan VaR, atau memakai gradien sebagai harga bayangan (shadow price) dari kendala risiko. Component VaR adalah ALOKASI risiko saat ini — berapa VaR yang «dimiliki» tiap aset — dan di M5 ia menjadi dasar risk budgeting: menetapkan target alokasi risiko (misal tiap aset menyumbang risiko yang sama — risk parity — atau sebanding dengan return yang diharapkan) lalu mencari bobot yang mewujudkannya. Singkatnya: marginal VaR berkata «ke arah mana VaR bergerak bila bobot berubah», component VaR berkata «di mana risiko berada sekarang» — dan M5 memakai keduanya untuk MEMILIH bobot.",
        "Yang lesson ini TIDAK lakukan: lesson ini tidak mengoptimasi apa pun. Tidak ada bobot optimal yang dihitung, tidak ada portofolio «terbaik» yang diklaim — hanya gradien dan alokasi pada bobot SAAT INI (sepertiga-sepertiga-sepertiga). Optimasi — memilih bobot baru dari gradien ini, dengan kendala return dan batas bobot, lalu memvalidasi hasilnya out-of-sample — adalah materi M5. Bila kamu tergoda menyimpulkan «jual semua UNVR» dari angka-angka di atas, ingatlah: marginal VaR hanya berlaku untuk perubahan KECIL di sekitar titik hitung, dan keputusan «berapa bobot yang optimal» butuh fungsi tujuan yang eksplisit — yang baru didefinisikan di M5.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: menjual seluruh posisi UNVR mengurangi VaR sebesar component VaR-nya",
        type: "pitfall",
        body: "Yang benar: component VaR (0,0133) adalah kontribusi UNVR pada VaR SAAT INI, dengan bobot dan korelasi saat ini. Menjual seluruh posisi mengubah bobot portofolio (dan dimensi matriks kovariansnya — dari 3×3 menjadi 2×2), tapi TIDAK mengubah korelasi antar aset yang tersisa: korelasi adalah sifat return, bukan bobot. VaR baru harus dihitung ulang dari awal. Component VaR bukan «VaR yang hilang bila aset dijual»; ia adalah «bagian VaR yang dialokasikan ke aset itu hari ini».",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 10 · Lab 1",
      title: "Lab: Black-Scholes dari nol pada call ATM mainan",
      prose: [
        "Sekarang giliranmu menghitung Black-Scholes. Datanya mainan dan deterministik: call ATM dengan S = K = 100, T = 0,25 tahun, r = 0,05, σ = 0,20. Tanpa library — hanya math.erf untuk fungsi distribusi normal standar N(x) = 0,5 × (1 + erf(x / √2)).",
        "Tugasmu: lengkapi d1, d2, harga call, dan delta. Perhatikan: d1 memakai ln(S/K) — karena S = K (ATM), ln(1) = 0, sehingga d1 = (r + 0,5σ²)T / (σ√T) — kecil dan positif (0,1750) karena suku bunga dan volatilitas mendorong d1 ke atas. d2 = d1 − σ√T = 0,0750.",
        "Hasilnya: d1 = 0,1750, d2 = 0,0750, call = 4,6150, delta = 0,5695 [lab]. Bandingkan dengan notebook: call ATM ^GSPC berharga 388,03 dengan delta 0,5665 — delta mainan (0,5695) sangat dekat dengan delta nyata (0,5665), karena keduanya ATM dengan T = 0,25 dan r = 0,05; yang berbeda hanya σ (0,20 vs 0,2243) dan skala harga (100 vs 7.619,38). Harga call mainan 4,6150 adalah 4,62 persen dari S = 100 — bandingkan dengan 388,03 / 7.619,38 = 5,09 persen di data nyata: lebih tinggi karena σ nyata lebih tinggi (0,2243 vs 0,20). Mekaniknya sama; yang berbeda hanya inputnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi d1: (log(S/K) + (r + 0,5*sigma^2)*T) / (sigma*sqrt(T))" },
        { id: "t2", text: "Lengkapi d2 = d1 - sigma*sqrt(T), harga call, dan delta = N(d1)" },
        { id: "t3", text: "Jalankan dan baca d1, d2, harga call, dan delta" },
      ],
      expected: "d1=0.1750\nd2=0.0750\ncall=4.6150\ndelta=0.5695",
      hints: [
        "N(x) sudah disediakan: 0.5 * (1.0 + math.erf(x / math.sqrt(2.0))).",
        "Harga call = S*N(d1) - K*exp(-r*T)*N(d2) — jangan lupa diskonto e^(-rT) pada strike.",
        "Karena S = K, math.log(S / K) = 0 — d1 hanya dari (r + 0,5*sigma^2)*T dibagi sigma*sqrt(T).",
      ],
      code: {
        starter: `import math

def N(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

# Call ATM mainan: S = K = 100, T = 0,25 tahun, r = 0,05, sigma = 0,20
S, K, T, r, sigma = 100.0, 100.0, 0.25, 0.05, 0.20
d1 = 0.0  # TODO: (log(S/K) + (r + 0,5*sigma^2)*T) / (sigma*sqrt(T))
d2 = 0.0  # TODO: d1 - sigma*sqrt(T)
call = 0.0  # TODO: S*N(d1) - K*exp(-r*T)*N(d2)
delta = 0.0  # TODO: N(d1)
print(f"d1={d1:.4f}")
print(f"d2={d2:.4f}")
print(f"call={call:.4f}")
print(f"delta={delta:.4f}")`,
        lockLines: 7,
        solution: `import math

def N(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

# Call ATM mainan: S = K = 100, T = 0,25 tahun, r = 0,05, sigma = 0,20
S, K, T, r, sigma = 100.0, 100.0, 0.25, 0.05, 0.20
d1 = (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))
d2 = d1 - sigma * math.sqrt(T)
call = S * N(d1) - K * math.exp(-r * T) * N(d2)
delta = N(d1)
print(f"d1={d1:.4f}")
print(f"d2={d2:.4f}")
print(f"call={call:.4f}")
print(f"delta={delta:.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "d1=0\\.1750", label: "Output menampilkan d1 = 0.1750", msg: "d1 = 0,1750 — dari (r + 0,5σ²)T / (σ√T), karena ln(S/K) = 0 pada ATM." },
          { kind: "stdout_matches", task: "t2", pattern: "d2=0\\.0750", label: "Output menampilkan d2 = 0.0750", msg: "d2 = d1 − σ√T = 0,0750." },
          { kind: "stdout_matches", task: "t2", pattern: "call=4\\.6150", label: "Output menampilkan harga call = 4.6150", msg: "Harga call = 4,6150 — 4,62 persen dari S = 100." },
          { kind: "stdout_matches", task: "t3", pattern: "delta=0\\.5695", label: "Output menampilkan delta = 0.5695", msg: "Delta = N(d1) = 0,5695 — dekat dengan delta nyata 0,5665 di ^GSPC." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 11 · Lab 2",
      title: "Lab: component VaR dari nol pada portofolio 2-aset mainan",
      prose: [
        "Lab kedua adalah dekomposisi risiko dari nol. Portofolio 2 aset mainan: bobot 50/50, volatilitas harian A 0,02 dan B 0,03, korelasi 0,40, mean return 0. Tugasmu: hitung varians portofolio (w′Σw), volatilitasnya, VaR95 parametrik (z95 = 1,6449), marginal VaR tiap aset, component VaR tiap aset — lalu VERIFIKASI penjumlahan Euler: jumlah component VaR harus sama dengan VaR portofolio.",
        "Hasilnya: volatilitas portofolio 0,0211, VaR95 0,0347, marginal A 0,0250 dan B 0,0444, component A 0,0125 dan B 0,0222 — jumlah component 0,0347, sama dengan VaR portofolio [lab]. Perhatikan: aset B menyumbang 64,04 persen risiko (0,0222 / 0,0347) meski bobotnya sama 50 persen — karena volatilitasnya lebih tinggi (0,03 vs 0,02) DAN korelasinya positif. Itulah pelajaran yang sama dengan notebook: UNVR menyumbang 40,98 persen risiko portofolio dengan bobot sepertiga — karena volatilitasnya tertinggi.",
        "Perhatikan juga: marginal VaR B (0,0444) LEBIH BESAR dari VaR portofolio itu sendiri (0,0347). Itu bukan kesalahan — marginal VaR adalah turunan terhadap bobot (satuan: VaR per 1 unit bobot), dan ia bisa melebihi VaR total bila aset itu berisiko dan berkorelasi positif dengan portofolio. Yang harus sama dengan VaR portofolio adalah JUMLAH component VaR — bukan marginal VaR.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi varians portofolio: w0^2*cov_aa + 2*w0*w1*cov_ab + w1^2*cov_bb" },
        { id: "t2", text: "Lengkapi marginal VaR A dan B: z95 * (Σw)_i / port_sd" },
        { id: "t3", text: "Jalankan dan verifikasi jumlah component VaR = VaR95 portofolio" },
      ],
      expected: "port_sd=0.0211\nVaR95=0.0347\nmarginal A=0.0250 B=0.0444\ncomponent A=0.0125 B=0.0222\njumlah component=0.0347",
      hints: [
        "Kovarians: cov_aa = sd_a^2, cov_ab = rho*sd_a*sd_b, cov_bb = sd_b^2 — ketiganya sudah dihitung di starter.",
        "Marginal A = z95 * (cov_aa*w0 + cov_ab*w1) / port_sd; marginal B = z95 * (cov_ab*w0 + cov_bb*w1) / port_sd.",
        "Component = bobot × marginal; jumlahnya harus 0,0347 — bila tidak, periksa lagi varians portofolionya.",
      ],
      code: {
        starter: `import math

# Portofolio 2 aset mainan: bobot 50/50, vol harian A 0,02 dan B 0,03, korelasi 0,40
w = [0.5, 0.5]
sd_a, sd_b, rho = 0.02, 0.03, 0.40
cov_aa = sd_a ** 2
cov_ab = rho * sd_a * sd_b
cov_bb = sd_b ** 2
# Varians portofolio = w' Σ w
port_var = 0.0  # TODO: w0^2*cov_aa + 2*w0*w1*cov_ab + w1^2*cov_bb
port_sd = math.sqrt(port_var)
z95 = 1.6449  # -Phi^-1(0,05); mean return 0
var95 = z95 * port_sd
# Marginal VaR: z95 * (Σ w)_i / port_sd
marg_a = 0.0  # TODO: z95 * (cov_aa*w0 + cov_ab*w1) / port_sd
marg_b = 0.0  # TODO: z95 * (cov_ab*w0 + cov_bb*w1) / port_sd
comp_a = w[0] * marg_a
comp_b = w[1] * marg_b
print(f"port_sd={port_sd:.4f}")
print(f"VaR95={var95:.4f}")
print(f"marginal A={marg_a:.4f} B={marg_b:.4f}")
print(f"component A={comp_a:.4f} B={comp_b:.4f}")
print(f"jumlah component={comp_a + comp_b:.4f}")`,
        lockLines: 9,
        solution: `import math

# Portofolio 2 aset mainan: bobot 50/50, vol harian A 0,02 dan B 0,03, korelasi 0,40
w = [0.5, 0.5]
sd_a, sd_b, rho = 0.02, 0.03, 0.40
cov_aa = sd_a ** 2
cov_ab = rho * sd_a * sd_b
cov_bb = sd_b ** 2
# Varians portofolio = w' Σ w
port_var = w[0] ** 2 * cov_aa + 2 * w[0] * w[1] * cov_ab + w[1] ** 2 * cov_bb
port_sd = math.sqrt(port_var)
z95 = 1.6449  # -Phi^-1(0,05); mean return 0
var95 = z95 * port_sd
# Marginal VaR: z95 * (Σ w)_i / port_sd
marg_a = z95 * (cov_aa * w[0] + cov_ab * w[1]) / port_sd
marg_b = z95 * (cov_ab * w[0] + cov_bb * w[1]) / port_sd
comp_a = w[0] * marg_a
comp_b = w[1] * marg_b
print(f"port_sd={port_sd:.4f}")
print(f"VaR95={var95:.4f}")
print(f"marginal A={marg_a:.4f} B={marg_b:.4f}")
print(f"component A={comp_a:.4f} B={comp_b:.4f}")
print(f"jumlah component={comp_a + comp_b:.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "port_sd=0\\.0211", label: "Output menampilkan volatilitas portofolio = 0.0211", msg: "Volatilitas portofolio 0,0211 — di antara 0,02 dan 0,03 karena diversifikasi parsial (korelasi 0,40)." },
          { kind: "stdout_matches", task: "t1", pattern: "VaR95=0\\.0347", label: "Output menampilkan VaR95 = 0.0347", msg: "VaR95 = 1,6449 × 0,0211 = 0,0347." },
          { kind: "stdout_matches", task: "t2", pattern: "component A=0\\.0125 B=0\\.0222", label: "Output menampilkan component A = 0.0125, B = 0.0222", msg: "Component A 0,0125 dan B 0,0222 — B menyumbang 64,04 persen risiko dengan bobot yang sama." },
          { kind: "stdout_matches", task: "t3", pattern: "jumlah component=0\\.0347", label: "Output menampilkan jumlah component = VaR95", msg: "Penjumlahan Euler menutup: 0,0125 + 0,0222 = 0,0347 = VaR95 portofolio." },
        ],
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 12 · Mini-case",
      title: "Mini-case: hedge call-mu, potong risiko portofoliomu — berapa angkanya?",
      prose: [
        "Kembali ke cerita pembuka — sekarang dengan angka. Kamu memegang 10 kontrak call ATM ^GSPC (1 kontrak = 100 saham) dan portofolio Rp100 juta (BBCA/KLBF/UNVR, bobot sama). Dua keputusan di mejamu pagi ini.",
        "Keputusan pertama — hedge call. Delta 0,5665 berarti tiap kontrak butuh hedge 0,5665 × 100 ≈ 57 saham (ekuivalen indeks). Untuk 10 kontrak: short ≈ 567 saham ekuivalen indeks (atau ETF/futures senilai 567 × 7.619,38 ≈ $4,32 juta — ya, hedge-nya besar, karena 10 kontrak mengendalikan 1.000 saham indeks). S naik 1 persen → call-mu naik 10 × $44,49 = $444,90 — perkiraan delta saja 10 × $43,17 = $431,70, selisih $13,20 adalah suku gamma (lihat langkah atribusi) — dan delta menjadi 0,6011 — hedge-mu harus ditambah dari 57 menjadi 60 saham per kontrak (≈ 601 total) bila kamu ingin tetap netral. Biaya rebalancing itu — dan theta $2,3801 × 10 = $23,80 per hari yang kamu bayar — adalah harga dari posisi long call-mu.",
        "Keputusan kedua — potong risiko portofolio. VaR95 portofolio 0,0324 berarti pada Rp100 juta, kerugian 1 hari yang dilampaui 5 persen hari adalah Rp3.240.000 [notebook]. Direksi minta VaR dipotong sekitar Rp324.000 (10 persen). Marginal VaR berkata: jual UNVR — tiap rupiah UNVR yang dijual mengurangi VaR paling banyak (marginal 0,0398 vs BBCA 0,0246). Untuk mengurangi VaR 0,00324 (10 persen dari 0,0324), jual UNVR senilai sekitar 0,00324 / 0,0398 × Rp100 juta ≈ Rp8,14 juta — sebagai aproksimasi linear (hitung ulang setelah eksekusi, karena turunan berubah). Alternatifnya: jual BBCA senilai 0,00324 / 0,0246 × Rp100 juta ≈ Rp13,17 juta — lebih banyak yang harus dijual untuk pengurangan risiko yang sama. Itulah gunanya marginal VaR: ia memberi HARGA risiko tiap aset, sehingga kamu memotong risiko dengan modal yang paling efisien.",
        "Keputusan mini-case: hedge 10 call dengan short ≈ 567 saham ekuivalen indeks, rebalance ke ≈ 601 bila S naik 1 persen (delta 0,6011), dan terima theta $23,80 per hari sebagai biaya; potong VaR portofolio dengan menjual UNVR ≈ Rp8,14 juta (bukan BBCA Rp13,17 juta) — lalu hitung ulang VaR dan dekomposisinya setelah eksekusi, karena aproksimasi linear hanya berlaku untuk perubahan kecil.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 13 · Guided task di Colab",
      title: "Guided task di Colab: Greeks & dekomposisi risiko di data nyata",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada call ATM mainan (S = K = 100) dan portofolio 2-aset mainan. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m44-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga ^GSPC, BBCA, KLBF, dan UNVR (window 2024-11-01 sampai 2026-11-12, yfinance, dengan fallback ke file data/m4_prices.csv bila download gagal), menghitung volatilitas realized 20 hari ^GSPC (σ = 0,2243), mereplikasi Black-Scholes call ATM (harga 388,03; delta 0,5665; gamma 0,000460; vega 14,9867 per +1pp; theta −2,3801 per hari; rho 9,8214 per +1pp), mengukur efek S +1 persen (call +$44,49 sebenarnya — perkiraan delta $43,17, lihat langkah atribusi; delta menjadi 0,6011), lalu menghitung dekomposisi risiko portofolio equal-weight (VaR95 0,0324; component BBCA 0,0082 / KLBF 0,0109 / UNVR 0,0133 — jumlah menutup; share 0,2532 / 0,3370 / 0,4098) dan beta vs ^GSPC (BBCA 0,1272; KLBF 0,1943; UNVR 0,0248) — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/18ZdXvnwXRGDwaVGKulhLwA7-Wh18Xlo2",
        "Jalur file notebook: colab/mlf-m44-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: risiko punya alamat — Greek atau saham penyumbangnya",
      prose: [
        "Rangkuman: call ATM ^GSPC (S = K = 7.619,38, T = 0,25, r = 0,05, σ = 0,2243 realized 20 hari) berharga 388,03 dengan delta 0,5665, gamma 0,000460, vega 14,9867 per +1pp, theta −2,3801 per hari, rho 9,8214 per +1pp. S naik 1 persen → call naik $44,49 (perkiraan delta $43,17) dan delta menjadi 0,6011 — gamma bekerja, hedge butuh rebalancing (57 → 60 saham per kontrak, konvensi 1 kontrak = 100 saham). Opsi panjang = long vega; theta adalah biaya waktu $2,38 per hari. Atribusi P&L (langkah 6): S +1% saja — delta $43,17 + gamma $1,34 ≈ $44,50 vs sebenarnya $44,49 (residu −$0,01); skenario gabungan [ilustrasi] sebenarnya $67,23 vs Taylor $66,93 (residu +$0,30); skenario BESAR [ilustrasi] sebenarnya $286,82 vs Taylor $292,12 (residu −$5,30) — Taylor akurat di dekat titik hitung, memburuk jauh darinya. Dekomposisi risiko (VaR95 parametrik log-return 0,0324): BBCA marginal 0,0246 / component 0,0082 / share 0,2532; KLBF 0,0328 / 0,0109 / 0,3370; UNVR 0,0398 / 0,0133 / 0,4098 — jumlah component 0,0324 menutup (Euler). UNVR penyumbang terbesar meski bobot sama, karena vol tahunannya tertinggi (0,4981). Beta vs ^GSPC sangat rendah (BBCA 0,1272, KLBF 0,1943, UNVR 0,0248; korelasi 0,0570 / 0,0706 / 0,0076) — saham IDX hampir tidak bergerak bersama S&P; beta rendah bukan berarti aman (UNVR: beta terendah, vol tertinggi).",
      ],
      tasks: [],
      quiz: [
        {
          q: "Call ATM ^GSPC: delta 0,5665, 1 kontrak = 100 saham. Berapa saham yang harus di-short untuk meng-hedge 1 kontrak call?",
          options: [
            { text: "100 saham — satu kontrak berarti hedge satu banding satu", why: "Hedge ratio adalah delta, bukan 1 — 1 kontrak mengendalikan 100 saham, tapi delta-nya hanya 0,5665." },
            { text: "≈ 57 saham (0,5665 × 100) — dan hedge ini harus di-rebalance bila S bergerak", why: "Benar: delta × 100 = 56,65 ≈ 57 saham per kontrak; setelah S +1 persen delta menjadi 0,6011, jadi hedge menjadi ≈ 60 saham.", correct: true },
            { text: "0 saham — call ATM tidak butuh hedge karena delta-nya 0,5", why: "Delta ATM sekitar 0,57, bukan 0 — dan 0,5 pun tetap butuh hedge 50 saham." },
            { text: "566 saham — delta dikali 1.000", why: "Pengali yang benar adalah 100 (saham per kontrak), bukan 1.000." },
          ],
        },
        {
          q: "S naik 1 persen: call naik $44,49 dan delta menjadi 0,6011 dari 0,5665. Greek mana yang menjelaskan perubahan delta itu?",
          options: [
            { text: "Vega — delta berubah karena volatilitas naik", why: "Vega mengukur sensitivitas terhadap volatilitas, bukan terhadap harga — volatilitas tidak berubah di sini." },
            { text: "Gamma — delta ikut bergerak bersama S (gamma 0,000460 per $1 × $76,19 ≈ 0,0350)", why: "Benar: gamma adalah turunan delta terhadap S; kenaikan S $76,19 menaikkan delta ≈ 0,0350, cocok dengan 0,6011 − 0,5665 = 0,0346.", correct: true },
            { text: "Theta — delta berubah karena waktu berlalu", why: "Theta mengukur erosi waktu, bukan perubahan delta terhadap harga — dan tidak ada waktu yang berlalu dalam skenario ini." },
            { text: "Rho — delta berubah karena suku bunga naik", why: "Rho mengukur sensitivitas terhadap suku bunga; suku bunga tidak berubah di sini." },
          ],
        },
        {
          q: "Vega call ATM adalah 14,9867 per +1pp vol, theta −2,3801 per hari. Apa posisi seorang pemegang long call terhadap volatilitas dan waktu?",
          options: [
            { text: "Long vega (untung bila vol naik) dan membayar theta $2,38 per hari (biaya waktu)", why: "Benar: opsi panjang untung bila volatilitas naik (vega positif) dan kehilangan $2,38 per hari bila semua input lain diam — theta adalah biaya sewa waktu.", correct: true },
            { text: "Short vega dan menerima theta $2,38 per hari", why: "Itu posisi SHORT call — kebalikan dari pemegang long call." },
            { text: "Netral terhadap volatilitas karena vega hanya berlaku untuk opsi OTM", why: "Vega justru paling besar pada opsi ATM — 14,9867 di sini — dan long call selalu long vega." },
            { text: "Theta $2,38 per hari adalah keuntungan yang pasti bagi pemegang call", why: "Theta adalah BIAYA bagi pemegang (harga call tergerus $2,38/hari bila input lain diam) — keuntungan hanya bila gerakan S menutupinya." },
          ],
        },
        {
          q: "Component VaR: BBCA 0,0082, KLBF 0,0109, UNVR 0,0133; VaR95 portofolio 0,0324. Apa yang dibuktikan penjumlahan ini?",
          options: [
            { text: "Penjumlahan Euler menutup: 0,0082 + 0,0109 + 0,0133 = 0,0324 — dekomposisinya konsisten", why: "Benar: jumlah component VaR sama persis dengan VaR portofolio (Euler) — bila tidak menutup, ada yang salah dalam hitungan.", correct: true },
            { text: "VaR portofolio sama dengan jumlah VaR tiap aset yang sudah ditimbang bobotnya", why: "Jumlah VaR tiap aset (historis) yang ditimbang bobot equal-weight adalah (0,0290 + 0,0380 + 0,0438) / 3 = 0,0369 — hanya sedikit di atas 0,0324, karena diversifikasi menguranginya; yang menutup PERSIS adalah jumlah COMPONENT VaR, bukan jumlah VaR tiap aset." },
            { text: "UNVR menyumbang risiko paling kecil karena bobotnya sepertiga", why: "UNVR menyumbang PALING BESAR: component 0,0133, share 0,4098 — meski bobotnya sama." },
            { text: "Component VaR membuktikan VaR parametrik lebih baik dari VaR historis", why: "Penjumlahan Euler adalah checks konsistensi internal dekomposisi — ia tidak membandingkan metode VaR." },
          ],
        },
        {
          q: "UNVR menyumbang share component VaR terbesar (0,4098) meski bobotnya sama (sepertiga). Mengapa?",
          options: [
            { text: "Karena bobot UNVR sebenarnya lebih besar dari sepertiga", why: "Bobot ketiganya sama — sepertiga masing-masing; share risiko tidak ditentukan bobot saja." },
            { text: "Karena volatilitas tahunan UNVR tertinggi (0,4981) — marginal VaR-nya pun tertinggi (0,0398)", why: "Benar: component = bobot × marginal, dan marginal UNVR tertinggi karena vol-nya tertinggi (0,4981 vs BBCA 0,3471 dan KLBF 0,4244).", correct: true },
            { text: "Karena korelasi UNVR dengan ^GSPC paling tinggi", why: "Korelasi UNVR dengan ^GSPC justru PALING RENDAH (0,0076) — dan dekomposisi ini tidak memakai ^GSPC sama sekali." },
            { text: "Karena UNVR punya beta tertinggi vs ^GSPC", why: "Beta UNVR justru TERENDAH (0,0248) — beta mengukur risiko sistematis vs S&P, bukan risiko total." },
          ],
        },
        {
          q: "Beta vs ^GSPC: BBCA 0,1272, KLBF 0,1943, UNVR 0,0248; korelasi 0,0570 / 0,0706 / 0,0076. Apa implikasi praktisnya?",
          options: [
            { text: "Saham IDX hampir tidak bergerak bersama S&P — meng-hedge portofolio IDX dengan short S&P hampir tidak melindungi apa-apa", why: "Benar: beta dan korelasi sangat rendah — risiko portofolio ini didominasi risiko spesifik IDX, bukan risiko pasar AS; hedge harus memakai instrumen yang berkorelasi dengan IDX.", correct: true },
            { text: "Portofolio IDX aman dari gejolak global karena beta-nya rendah", why: "Beta rendah vs S&P bukan berarti aman — volatilitas totalnya tinggi (UNVR 0,4981 tahunan); risikonya spesifik, bukan tidak ada." },
            { text: "Beta rendah berarti volatilitas saham-saham ini rendah", why: "UNVR membantahnya: beta terendah (0,0248) tapi volatilitas tertinggi (0,4981) — beta mengukur risiko sistematis, bukan risiko total." },
            { text: "Benchmark yang benar untuk beta portofolio ini adalah S&P 500", why: "Benchmark yang benar untuk portofolio IDX adalah IHSG — S&P dipakai di sini sebagai contoh perhitungan dan bukti segmentasi pasar." },
          ],
        },
        {
          q: "Direksi minta VaR portofolio dipotong 0,00324 (10 persen dari 0,0324). Marginal VaR: BBCA 0,0246, KLBF 0,0328, UNVR 0,0398. Saham mana yang paling efisien dijual, dan kira-kira berapa nilainya (dari Rp100 juta)?",
          options: [
            { text: "BBCA — jual ≈ Rp13,17 juta (0,00324 / 0,0246 × Rp100 juta)", why: "BBCA adalah yang PALING TIDAK efisien: marginal-nya terendah, jadi butuh penjualan terbesar untuk pengurangan VaR yang sama." },
            { text: "UNVR — jual ≈ Rp8,14 juta (0,00324 / 0,0398 × Rp100 juta), karena marginal-nya tertinggi", why: "Benar: tiap rupiah UNVR yang dijual mengurangi VaR paling banyak (marginal 0,0398) — pengurangan risiko yang sama butuh modal paling sedikit. Hitung ulang VaR setelah eksekusi, karena aproksimasi linear hanya untuk perubahan kecil.", correct: true },
            { text: "KLBF — jual ≈ Rp9,88 juta, karena marginal-nya di tengah", why: "KLBF berada di tengah (0,0328) — bukan yang paling efisien; UNVR (0,0398) mengurangi VaR lebih banyak per rupiah." },
            { text: "Ketiganya sama — jual sepertiga dari tiap saham", why: "Marginal VaR ketiganya berbeda (0,0246 / 0,0328 / 0,0398) — menjual sepertiga dari tiap saham bukan cara paling efisien memotong VaR." },
          ],
        },
        {
          q: "Harga call 388,03 dihitung dengan σ = 0,2243 (realized vol 20 hari) dan r = 0,05 (asumsi). Apa yang terjadi bila pasar memakai implied vol yang lebih tinggi dari 0,2243?",
          options: [
            { text: "Harga pasar call akan lebih tinggi dari 388,03 — karena call adalah long vega (vega 14,9867 per +1pp)", why: "Benar: vega positif 14,9867 berarti tiap +1pp vol menaikkan harga ≈ $14,99 — selisih harga vs model adalah informasi tentang volatilitas yang dipakai pasar, bukan kesalahan pasar.", correct: true },
            { text: "Harga pasar call akan lebih rendah — volatilitas tinggi membuat opsi lebih murah", why: "Terbalik: volatilitas lebih tinggi berarti peluang payoff besar lebih tinggi — harga call NAIK dengan vol (long vega)." },
            { text: "Harga tidak berubah — Black-Scholes tidak memakai volatilitas", why: "Volatilitas adalah input Black-Scholes yang paling menentukan harga — tanpa σ tidak ada harga." },
            { text: "Delta menjadi negatif bila implied vol naik", why: "Delta call ATM tetap positif (≈ 0,57) bila vol naik — vol memengaruhi delta sedikit, tapi tidak membaliknya menjadi negatif." },
          ],
        },
      ],
      summary: [
        "Call ATM ^GSPC (S = K = 7.619,38, T = 0,25, r = 0,05, σ = 0,2243 realized 20 hari): harga 388,03; delta 0,5665; gamma 0,000460; vega 14,9867 per +1pp; theta −2,3801 per hari; rho 9,8214 per +1pp.",
        "Delta = hedge: 0,5665 × 100 ≈ 57 saham per kontrak (1 kontrak = 100 saham). S +1 persen → call +$44,49 (perkiraan delta $43,17), delta menjadi 0,6011 — gamma bekerja, hedge butuh rebalancing.",
        "Atribusi P&L (Taylor + gamma): S +1% saja — delta $43,17 + gamma $1,34 ≈ $44,50 vs sebenarnya $44,49 (residu −$0,01); skenario gabungan [ilustrasi] sebenarnya $67,23 vs Taylor $66,93 (residu +$0,30); skenario BESAR [ilustrasi] sebenarnya $286,82 vs Taylor $292,12 (residu −$5,30) — Taylor akurat di dekat titik hitung, memburuk jauh darinya; skenario besar wajib repricing penuh.",
        "Opsi panjang = long vega (untung bila vol naik); theta adalah biaya waktu $2,38 per hari; rho kecil pada T = 0,25 tahun.",
        "Dekomposisi risiko (VaR95 parametrik log-return 0,0324): BBCA marginal 0,0246 / component 0,0082 / share 0,2532; KLBF 0,0328 / 0,0109 / 0,3370; UNVR 0,0398 / 0,0133 / 0,4098 — jumlah component 0,0324 menutup (Euler).",
        "UNVR penyumbang risiko terbesar meski bobot sama — karena vol tahunannya tertinggi (0,4981). Marginal VaR untuk keputusan tambah/kurangi posisi; component VaR untuk peta kontribusi saat ini.",
        "Beta vs ^GSPC sangat rendah (BBCA 0,1272, KLBF 0,1943, UNVR 0,0248; korelasi 0,0570 / 0,0706 / 0,0076) — saham IDX hampir tidak bergerak bersama S&P; beta rendah bukan berarti aman (UNVR: beta terendah, vol tertinggi).",
        "Asumsi BS yang wajib ditulis: ^GSPC tidak bisa ditransaksikan (proxy SPX); r = 5 persen asumsi; σ realized 20 hari, bukan implied; tanpa dividen; call Eropa.",
        "Lab: Black-Scholes mainan (d1 = 0,1750, d2 = 0,0750, call = 4,6150, delta = 0,5695); component VaR 2-aset (VaR95 0,0347, component 0,0125 + 0,0222 menutup).",
      ],
      next: { label: "Lanjut: MLF-M4.5 — Drawdown, Regime & Stress Test", href: "/v2/learn/mlf-m45-drawdown-regime-stress" },
    },
  ],
};

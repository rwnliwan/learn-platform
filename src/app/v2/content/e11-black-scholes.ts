import type { V2Lesson } from "../lib/types";

export const e11: V2Lesson = {
  slug: "e11-black-scholes",
  track: "Financial Markets",
  module: "Derivatif",
  title: "E11. Black-Scholes & Greeks",
  estMinutes: 75,
  steps: [
    {
      id: "cerita-1973",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Rumus 1973 yang mengubah Wall Street",
      prose: [
        "Tahun 1973, Fischer Black dan Myron Scholes mempublikasikan cara menghitung harga wajar opsi. Sebelumnya, harga opsi = tebakan bandar. Sesudahnya = sains — dan pada 1997, Nobel Ekonomi diberikan kepada Robert Merton & Myron Scholes atas karya ini (Fischer Black meninggal pada 1995 dan tidak menerima Nobel). Rumus ini begitu fundamental hingga setiap trading screen opsi di dunia menampilkannya — termasuk Greeks, panel instrumen risiko yang lahir dari rumus yang sama.",
        "Kabar baik: kamu tidak perlu menurunkan rumusnya. Kamu perlu memahami inputnya, membaca outputnya, dan mengendarai Greeks-nya. Dari lima input (versi tanpa dividen — saham berdividen butuh q sebagai input keenam), empat bisa dilihat — harga saham, strike, waktu, bunga. Hanya satu yang tidak bisa dilihat: volatilitas masa depan. Seluruh tebakan pasar terkompresi menjadi satu angka misterius.",
      ],
      formula: String.raw`C = S \cdot N(d_1) - K e^{-rT} \cdot N(d_2) \qquad d_1 = \frac{\ln(S/K) + (r + \sigma^2/2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}`,
      formulaNote: "S = harga saham; K = strike; T = sisa waktu (tahun); r = risk-free; σ = volatilitas; N(·) = peluang kumulatif normal. Catatan: rumus di atas untuk saham TANPA dividen — untuk saham berdividen tambahkan dividend yield q: C = S·e^(−qT)·N(d₁) − K·e^(−rT)·N(d₂), dengan d₁ memakai (r − q + σ²/2). Lima input yang diajarkan di sini belum lengkap untuk saham berdividen.",
      tasks: [
        { id: "t1", text: "Hitung `d1` dan `d2` (S=K=100, T=1, r=6%, σ=30%)" },
        { id: "t2", text: "Hitung `call` (harga wajar call)" },
      ],
      expected: "d1=0.350  d2=0.050  call=14.72",
      note: {
        title: "Sering salah",
        body: "Mengira Black-Scholes “harga yang benar”. Rumus ini mengasumsikan volatilitas konstan, tanpa biaya transaksi, dan hedge kontinu — dunia nyata melanggar ketiganya. Pakai sebagai kerangka, bukan vonis.",
      },
      hints: [
        "d1 = (ln(S/K) + (r + σ²/2)×T) / (σ×√T). S=K → ln(1) = 0.",
        "N(x) = 0,5×(1 + erf(x/√2)). d2 = d1 − σ√T.",
        "call = S×N(d1) − K×e^(−rT)×N(d2)",
      ],
      code: {
        starter: `import math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\n\nS, K, T, r, sigma = 100, 100, 1.0, 0.06, 0.30\n\n# TULIS KODEMU: d1, d2, dan harga wajar call\nd1 = \nd2 = \ncall = \n\nprint(f"d1={d1:.3f}  d2={d2:.3f}  call={call:.2f}")`,
        lockLines: 6,
        solution: `import math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\n\nS, K, T, r, sigma = 100, 100, 1.0, 0.06, 0.30\n\n# TULIS KODEMU: d1, d2, dan harga wajar call\nd1 = (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))\nd2 = d1 - sigma * math.sqrt(T)\ncall = S * N(d1) - K * math.exp(-r * T) * N(d2)\n\nprint(f"d1={d1:.3f}  d2={d2:.3f}  call={call:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d1", value: 0.35, tol: 0.001, label: "`d1` seharusnya 0,350", msg: "(0 + (0,06 + 0,045)×1)/(0,3×1) = 0,35. N(d1) = delta!" },
          { kind: "equal", task: "t1", name: "d2", value: 0.05, tol: 0.001, label: "`d2` seharusnya 0,050", msg: "d2 = d1 − σ√T = 0,35 − 0,30 = 0,05." },
          { kind: "equal", task: "t2", name: "call", value: 14.72, tol: 0.02, label: "`call` sekitar 14,72", msg: "100×0,6368 − 100×e^−0,06×0,5199 = 14,72." },
          { kind: "stdout_matches", task: "t2", pattern: "d1=0\\.350\\s+d2=0\\.050\\s+call=14\\.72", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Lima input BS (tanpa dividen); σ satu-satunya opini — trader opsi = trader volatilitas.",
    },
    {
      id: "iv",
      eyebrow: "Langkah 2 · Implied volatility",
      title: "Membaca pikiran pasar dari harga opsi",
      prose: [
        "Balikkan Black-Scholes: diketahui harga pasar opsi (C), cari σ yang membuatnya cocok. Itulah implied volatility (IV) — volatilitas yang “ditakuti/diharapkan” pasar untuk sisa umur opsi. IV 20% ≈ pasar menghargai opsi seolah-olah volatilitas tahunan (1-sigma log-return) sekitar 20% — kira-kira 68% peluang pergerakan tahunan dalam ±20% JIKA return lognormal. Itu BUKAN prediksi arah, bukan pula janji rentang: IV adalah harga ketidakpastian, bukan ramalan gerakan.",
        "IV melonjak sebelum pemilu/laporan keuangan = pasar bersiap guncangan. Setelah peristiwa lewat → IV anjlok (volatility crush) — pembeli opsi yang “benar arah” pun bisa rugi karena premi menyusut!",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Prediksiku benar (saham naik), tapi opsi call-ku rugi. Pasar curang!” Kamu benar arah tapi kalah oleh volatility crush + time decay. Jika IV 60% sebelum pengumuman lalu anjlok ke 25% sesudahnya, premi amblas meski arahmu benar.",
      },
      reference: "IV = ekspektasi pasar forward-looking. Jangan beli opsi saat IV mahal menjelang peristiwa.",
    },
    {
      id: "greeks",
      eyebrow: "Langkah 3 · Greeks",
      title: "Panel instrumen: delta, gamma, theta, vega",
      prose: [
        "Greeks = turunan harga opsi terhadap tiap input. Delta (Δ) = sensitivitas ke harga saham — “opsi naik berapa jika saham naik Rp1”. Call: 0 s.d. 1; at-the-money ≈ 0,5. Gamma (Γ) = seberapa cepat delta berubah — terbesar di at-the-money menjelang kedaluwarsa.",
        "Theta (Θ) = penurunan nilai opsi per hari — opsi = es batu dijemur, meleleh tiap hari, makin cepat dekat kedaluwarsa. Vega = “opsi naik berapa jika volatilitas naik 1%” — selalu positif untuk pembeli opsi. Hitung keempatnya untuk opsi di langkah 1.",
      ],
      formula: String.raw`\Delta = N(d_1) \qquad \Theta = \frac{\partial C}{\partial t} < 0 \ \text{(long)} \qquad \text{Vega} = \frac{\partial C}{\partial \sigma} > 0`,
      formulaNote: "Δ (delta) = perubahan harga opsi per Rp1 perubahan harga saham — call 0 s.d. 1 (ATM ≈ 0,5). Γ (gamma) = kecepatan delta berubah — terbesar saat at-the-money menjelang kedaluwarsa. Θ (theta) = “bocor” nilai per hari — negatif bagi pembeli (opsi = es batu dijemur). Vega = sensitivitas ke volatilitas — selalu positif bagi pembeli. Contoh: vega 0,35 per 1 poin persen σ → IV naik 1% menaikkan harga opsi 0,35. (Vega lab 37,52 dihitung per 100% σ — 37,52/100 ≈ 0,38 per 1% — konvensi yang sama, skala berbeda.)",
      tasks: [
        { id: "t1", text: "Hitung `delta` dan `gamma`" },
        { id: "t2", text: "Hitung `theta_harian` (bocor per hari) dan `vega`" },
      ],
      expected: "delta=0.637  gamma=0.0125  theta_harian=-0.0235  vega=37.52",
      note: {
        title: "Sering salah",
        body: "“Opsi = taruhan arah harga.” Harga opsi digerakkan empat mesin: arah (delta), kecepatan perubahan delta (gamma), waktu (theta), dan ketakutan pasar (vega). Trader profesional berpikir dalam Greeks, bukan “naik/turun”.",
      },
      hints: [
        "delta = N(d1). gamma = n(d1)/(S×σ×√T), n = pdf normal.",
        "theta tahunan = −(S×n(d1)×σ)/(2√T) − r×K×e^(−rT)×N(d2); bagi 365.",
        "vega = S × n(d1) × √T",
      ],
      code: {
        starter: `import math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef n_pdf(x):\n    return math.exp(-0.5*x*x) / math.sqrt(2*math.pi)\n\nS, K, T, r, sigma = 100, 100, 1.0, 0.06, 0.30\nd1 = (math.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*math.sqrt(T))\nd2 = d1 - sigma*math.sqrt(T)\n\n# TULIS KODEMU: delta, gamma, theta harian, vega\ndelta = \ngamma = \ntheta_harian = \nvega = \n\nprint(f"delta={delta:.3f}  gamma={gamma:.4f}  theta_harian={theta_harian:.4f}  vega={vega:.2f}")`,
        lockLines: 11,
        solution: `import math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef n_pdf(x):\n    return math.exp(-0.5*x*x) / math.sqrt(2*math.pi)\n\nS, K, T, r, sigma = 100, 100, 1.0, 0.06, 0.30\nd1 = (math.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*math.sqrt(T))\nd2 = d1 - sigma*math.sqrt(T)\n\n# TULIS KODEMU: delta, gamma, theta harian, vega\ndelta = N(d1)\ngamma = n_pdf(d1) / (S * sigma * math.sqrt(T))\ntheta_tahunan = -(S * n_pdf(d1) * sigma) / (2 * math.sqrt(T)) - r * K * math.exp(-r * T) * N(d2)\ntheta_harian = theta_tahunan / 365\nvega = S * n_pdf(d1) * math.sqrt(T)\n\nprint(f"delta={delta:.3f}  gamma={gamma:.4f}  theta_harian={theta_harian:.4f}  vega={vega:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "delta", value: 0.637, tol: 0.001, label: "`delta` sekitar 0,637", msg: "Delta = N(d1) = 0,637 — opsi naik Rp0,64 per Rp1 saham naik." },
          { kind: "equal", task: "t1", name: "gamma", value: 0.0125, tol: 0.0002, label: "`gamma` sekitar 0,0125", msg: "n(0,35)/(100×0,3×1) = 0,0125." },
          { kind: "equal", task: "t2", name: "theta_harian", value: -0.0235, tol: 0.001, label: "`theta_harian` sekitar −0,0235", msg: "−8,57/tahun ÷ 365 = −0,0235/hari. Es batunya meleleh." },
          { kind: "equal", task: "t2", name: "vega", value: 37.52, tol: 0.05, label: "`vega` sekitar 37,52", msg: "100 × n(0,35) × 1 = 37,52 — opsi naik Rp0,38 per 1% vol naik." },
          { kind: "stdout_matches", task: "t2", pattern: "theta_harian=-0\\.0235\\s+vega=37\\.52", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Delta = kecepatan (hedge ratio); gamma = akselerasi; theta = bocor waktu; vega = harga ketakutan.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang input BS dan theta.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dari 5 input Black-Scholes versi tanpa dividen, mana yang TIDAK bisa diobservasi langsung?",
          options: [
            { text: "Harga saham (S)", why: "Salah: S terlihat di layar setiap detik." },
            { text: "Strike (K)", why: "Salah: K tertulis di kontrak opsinya." },
            { text: "Volatilitas (σ) — harus diestimasi/diimplikasikan dari pasar", why: "Benar: volatilitas masa depan = satu-satunya opini. Makanya trader opsi = trader volatilitas.", correct: true },
            { text: "Sisa waktu (T)", why: "Salah: T = tanggal kedaluwarsa minus hari ini." },
          ],
        },
        {
          q: "Kamu LONG call. Theta harian −Rp50 ribu. Artinya…",
          options: [
            { text: "Untung Rp50 ribu per hari", why: "Salah: theta negatif untuk pembeli = rugi, bukan untung." },
            { text: "Rugi Rp50 ribu per hari hanya karena waktu berlalu (ceteris paribus)", why: "Benar: time decay — pembeli berlomba dengan waktu, penjual dipanen waktu.", correct: true },
            { text: "Delta berubah", why: "Salah: itu gamma, bukan theta." },
            { text: "Tidak ada artinya", why: "Salah: theta = “bocor bensin” harian posisimu." },
          ],
        },
      ],
    },
    {
      id: "minicase-asuransi",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Menjual asuransi: Sharpe 2,8 yang menipu",
      prose: [
        "Reksa dana AMAN rutin menjual put indeks (tenor 1 bulan, 10% out-of-the-money). 11 bulan: premi masuk tiap bulan, return mulus 1,2%/bulan, Sharpe 2,8 — brosurnya memukau. Bulan ke-12: indeks anjlok 25% dalam sebulan. Put yang dijual dieksekusi — dana wajib membeli indeks di harga jauh di atas pasar.",
        "Pertanyaan: (a) Profil Greek penjual put ini? (b) Mengapa Sharpe 2,8-nya menipu (ingat E7)? (c) Pelajaran untuk investor yang tergiur “return mulus”?",
        "Pembahasan: (a) Theta positif (panen time decay), vega negatif (rugi saat panik/IV melonjak), gamma negatif (kerugian berakselerasi saat pasar jatuh), delta positif kecil. Klasik short-volatility. (b) Sharpe memakai volatilitas historis — 11 bulan tenang = vol rendah = Sharpe tinggi. Ia buta terhadap ekor kiri yang memang belum terjadi di sampel. Return mulus = premi risiko ekor, bukan keahlian. (c) Tanya distribusi return lengkap + skenario stres, bukan Sharpe. Minta MaxDD historis strategi sejenis, bukan cuma dana ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Strategi short-volatility = “memungut receh di depan buldoser”. Volatilitasnya kecil — terlihat aman — sampai ekornya datang. Short opsi telanjang = rugi tak terbatas; selalu batasi dengan spread/hedge.",
      },
      reference: "Return mulus tanpa penjelasan = curigai sebagai premi risiko tersembunyi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Greek mana yang dijaga? Empat skenario",
      prose: [
        "Market maker/penjual opsi → jaga delta netral, panen theta: delta-hedge tiap hari (kebal arah), biarkan time decay menggerogoti opsi yang dijual. Risiko: gamma — gerakan besar mendadak. Yakin ada guncangan besar (arah tidak tahu) → beli volatilitas: long straddle (call+put) — vega dan gamma positif, untung dari gerakan besar ke arah mana pun.",
        "Pasar tenang, IV mahal → jual volatilitas (tertutup!): theta + vega bekerja untuk penjual. Peringatan keras: short opsi telanjang = rugi tak terbatas. Lindungi portofolio saham → long put: delta negatif put menetralkan sebagian delta saham; theta = biaya asuransi yang disadari.",
        "Aturan 10 detik: lima input BS (versi tanpa dividen; saham berdividen butuh q); σ satu-satunya opini. Pembeli opsi dibayar arah; penjual dibayar waktu. IV tinggi + peristiwa dekat = jangan beli.",
      ],
      tasks: [],
      reference: "Pilih sisi sesuai keunggulanmu. Volatility crush memakan yang benar arah sekalipun.",
    },
    {
      id: "bs-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: vol smile & 1987",
      title: "Senyum volatilitas: kapan Black-Scholes berbohong",
      prose: [
        "Black-Scholes mengasumsikan satu volatilitas untuk semua strike. Pasar menertawakannya: plot implied volatility vs strike membentuk “senyum” (smile) — dan sejak 1987 lebih tepat disebut seringai (skew): put OTM (proteksi crash) punya IV jauh LEBIH TINGGI dari call OTM. Artinya satu saham, satu tanggal kedaluwarsa, punya BANYAK volatilitas sekaligus — kemustahilan dalam dunia BS, kenyataan di dunia nyata. Smile adalah harga ketakutan: pasar membayar mahal untuk asuransi jatuhnya pasar.",
        "Kenapa 1987 mengubah segalanya? Sebelum crash, smile hampir datar — pasar tidak menghargai risiko ekor. Lalu 19 Oktober 1987: Dow −22,6% sehari. “Portfolio insurance” — strategi jual futures otomatis saat pasar turun, yang mengasumsikan likuiditas selalu ada — justru mempercepat longsoran: semua orang menjual bersamaan ke pasar yang tidak ada pembelinya. Model yang mengasumsikan kamu bisa keluar kapan saja gagal tepat saat semua orang ingin keluar bersamaan.",
        "Empat asumsi BS yang retak di dunia nyata: (1) return lognormal — ekor nyata lebih gemuk (fat tails); (2) volatilitas konstan — vol bergerombol dan melonjak saat krisis; (3) tanpa lompatan harga — padahal gap overnight itu nyata (ingat ARB/ARA); (4) trading kontinu tanpa biaya — likuiditas bisa menguap.",
        "Praktisi memakai BS bukan sebagai peramal, melainkan penerjemah: harga opsi diterjemahkan ke bahasa implied volatility, lalu dikutip dan dibandingkan dalam IV — bukan rupiah. Model memberi kerangka lindung nilai (delta hedging); manajemen risiko menanggung sisanya. Aturan praktis: (1) jangan percaya satu angka vol — lihat seluruh skew; (2) skew curam = pasar takut crash, sesuaikan sizing; (3) model + batas risiko, tidak pernah model saja.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih_iv` (skew: IV put OTM − IV ATM)" },
        { id: "t2", text: "Hitung `premi_smile` (rupiah ketakutan crash)" },
      ],
      expected: "selisih_iv=15  premi_smile=5250000",
      hints: [
        "selisih_iv = iv_put_otm − iv_atm (dalam poin %).",
        "premi_smile = selisih_iv × vega_rp.",
      ],
      code: {
        starter: `iv_atm = 25.0        # %, opsi at-the-money\niv_put_otm = 40.0   # %, put OTM (proteksi crash)\nvega_rp = 350_000     # rupiah per 1% IV\n\n# TULIS KODEMU\nselisih_iv = \npremi_smile = \n\nprint(f"selisih_iv={selisih_iv:.0f}  premi_smile={premi_smile:.0f}")`,
        lockLines: 3,
        solution: `iv_atm = 25.0        # %, opsi at-the-money\niv_put_otm = 40.0   # %, put OTM (proteksi crash)\nvega_rp = 350_000     # rupiah per 1% IV\n\n# TULIS KODEMU\nselisih_iv = iv_put_otm - iv_atm\npremi_smile = selisih_iv * vega_rp\n\nprint(f"selisih_iv={selisih_iv:.0f}  premi_smile={premi_smile:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih_iv", value: 15, tol: 1e-9, label: "`selisih_iv` seharusnya 15", msg: "40 − 25 = 15 poin. Itulah “seringai”-nya." },
          { kind: "equal", task: "t2", name: "premi_smile", value: 5250000, tol: 1, label: "`premi_smile` seharusnya 5250000", msg: "15 × 350.000 = Rp5,25 juta. Harga ketakutan crash, dalam rupiah." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih_iv=15\\s+premi_smile=5250000", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: model = penerjemah, bukan peramal",
        body: "Black-Scholes tidak memprediksi harga opsi yang “benar” — ia menyediakan bahasa umum agar trader bisa berkata “put ini mahal” dalam satuan volatilitas, bukan rupiah. Empat heuristik. Pertama: kalau model dan pasar beda, pasar yang benar — smile/skew adalah pasar yang memberi tahumu asumsi mana yang dilanggar; dengarkan, jangan berdebat dengan pasar. Kedua: harga proteksi crash (OTM put) mahal BUKAN karena penjualnya serakah, melainkan karena saat crash terjadi, semua pembeli proteksi menagih bersamaan sementara penjualnya bangkrut — premi itu membayar risiko korelasi, bukan sekadar volatilitas. Ketiga: 1987 mengajarkan bahwa model yang dipakai semua orang menjadi bagian dari pasar — portfolio insurance yang mengasumsikan likuiditas justru menghancurkannya; model bisa menjadi pemicu dari apa yang ia asumsikan tidak ada. Keempat: praktisi mengutip dalam IV, bukan rupiah — IV membuat opsi beda strike dan tenor bisa dibandingkan apel-ke-apel; harga rupiah tanpa konteks vol = angka buta. Aturan 10 detiknya: pakai model untuk mengukur dan membandingkan, jangan untuk meyakinkan diri bahwa ekor tidak ada.",
      },
      reference: "BS = penerjemah harga→IV. Smile = harga ketakutan. 1987 = model dimakan ekor.",
    },
    {
      id: "gap-g23-bs-dividen",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G23)",
      title: "Black-Scholes dengan dividen: input keenam q",
      prose: [
        "Rumus yang diajarkan di langkah 1 berlaku untuk saham TANPA dividen. Saham berdividen butuh input keenam: dividend yield q — dan mengabaikannya bukan pembulatan, melainkan salah harga. Logikanya: pemegang call tidak menerima dividen; dividen yang dibayarkan sebelum kedaluwarsa mengalir ke pemegang saham, bukan ke pemegang opsi — jadi harga saham yang relevan untuk opsi adalah harga saham dikurangi nilai kini dividen yang akan dibayarkan, S × e^(−qT). Rumus call menjadi C = S×e^(−qT)×N(d1) − K×e^(−rT)×N(d2), dengan d1 memakai (r − q + σ²/2) — q mengurangi drift risk-neutral, persis seperti r yang lebih kecil.",
        "Contoh penuh: S = 100, K = 100, T = 1, r = 5%, q = 3%, σ = 20%. Hitung: d1 = (ln(100/100) + (0,05 − 0,03 + 0,5×0,04) × 1) / (0,20 × 1) = (0 + 0,04) / 0,20 = 0,20. d2 = 0,20 − 0,20 = 0,00. N(d1) = 0,57926, N(d2) = 0,50000. C = 100 × e^(−0,03) × 0,57926 − 100 × e^(−0,05) × 0,50 = 56,21 − 47,56 = 8,65. Bandingkan tanpa dividen (q = 0): d1 = 0,35, d2 = 0,15, C = 10,45. Dividen 3% memangkas harga call sebesar 1,80 (17%) — karena sebagian nilai saham akan bocor sebagai dividen sebelum opsi dieksekusi. Put-nya lewat paritas dengan dividen: P = C + K×e^(−rT) − S×e^(−qT) = 8,65 + 95,12 − 97,04 = 6,73.",
        "Tiga catatan praktik. Satu, q di sini adalah dividend yield kontinu — dividen diskret (misal Rp2.000 per kuartal) harus dikonversi dulu (jumlahkan nilai kini dividen, kurangi dari S — model escrowed dividend). Dua, q yang dipakai adalah ekspektasi pasar, bukan dividen tahun lalu — memakai yield historis saat dividen baru dipotong salah harga dua arah. Tiga, untuk indeks (misal IDX Composite), q adalah yield agregat indeks — itulah sebabnya opsi indeks hampir selalu dihitung dengan q, sementara opsi saham tunggal sering dihitung tanpa q bila dividennya kecil.",
      ],
      formula: String.raw`C = S e^{-qT} N(d_1) - K e^{-rT} N(d_2) \qquad d_1 = \frac{\ln(S/K) + (r - q + \sigma^2/2)T}{\sigma\sqrt{T}}`,
      formulaNote: "S=100, K=100, T=1, r=5%, q=3%, σ=20% → d1=0,20, d2=0,00, C=8,65 (tanpa dividen 10,45). Put = 6,73.",
      tasks: [
        { id: "t1", text: "Hitung `d1` dan `d2` dengan dividend yield q = 3%" },
        { id: "t2", text: "Hitung harga call `call_q` dan put `put_q` (paritas dengan dividen)" },
      ],
      expected: "d1=0.2000  d2=0.0000  call_q=8.65  put_q=6.73",
      hints: [
        "d1 = (ln(S/K) + (r − q + 0,5σ²)×T) / (σ√T); d2 = d1 − σ√T.",
        "N(x) = 0,5×(1 + erf(x/√2)) — pakai math.erf.",
        "Put dari paritas: P = C + K×e^(−rT) − S×e^(−qT).",
      ],
      code: {
        starter: `import math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\n\nS, K, T, r, q, sigma = 100, 100, 1.0, 0.05, 0.03, 0.20\n\n# TULIS KODEMU: Black-Scholes dengan dividend yield q.\nd1 = \nd2 = \ncall_q = \nput_q = \n\nprint(f"d1={d1:.4f}  d2={d2:.4f}  call_q={call_q:.2f}  put_q={put_q:.2f}")`,
        lockLines: 5,
        solution: `import math\n\ndef N(x):\n    return 0.5 * (1 + math.erf(x / math.sqrt(2)))\n\nS, K, T, r, q, sigma = 100, 100, 1.0, 0.05, 0.03, 0.20\n\n# TULIS KODEMU: Black-Scholes dengan dividend yield q.\nd1 = (math.log(S / K) + (r - q + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))\nd2 = d1 - sigma * math.sqrt(T)\ncall_q = S * math.exp(-q * T) * N(d1) - K * math.exp(-r * T) * N(d2)\nput_q = call_q + K * math.exp(-r * T) - S * math.exp(-q * T)\n\nprint(f"d1={d1:.4f}  d2={d2:.4f}  call_q={call_q:.2f}  put_q={put_q:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d1", value: 0.2, tol: 0.001, label: "`d1` = 0,20", msg: "(0 + (0,05−0,03+0,02)×1)/0,20 = 0,20." },
          { kind: "equal", task: "t1", name: "d2", value: 0.0, tol: 0.001, label: "`d2` = 0,00", msg: "0,20 − 0,20 = 0,00 — N(d2) tepat 0,50." },
          { kind: "equal", task: "t2", name: "call_q", value: 8.65, tol: 0.01, label: "`call_q` = 8,65", msg: "56,21 − 47,56 = 8,65 — dividen memangkas 1,80 dari 10,45." },
          { kind: "equal", task: "t2", name: "put_q", value: 6.73, tol: 0.01, label: "`put_q` = 6,73", msg: "Paritas dengan dividen: 8,65 + 95,12 − 97,04 = 6,73." },
          { kind: "stdout_matches", task: "t2", pattern: "d1=0.2000\\s+d2=0.0000\\s+call_q=8.65\\s+put_q=6.73", label: "`print` menampilkan keempat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Call atas saham berdividen (q = 3%) dihargai dengan rumus tanpa dividen. Apa yang terjadi?",
          options: [
            { text: "Call dinilai terlalu mahal (10,45 vs 8,65) — dividen yang bocor tidak dihitung", why: "Tepat: pemegang call tidak menerima dividen; mengabaikan q melebih-lebihkan nilai call 1,80.", correct: true },
            { text: "Call dinilai terlalu murah — dividen menambah nilai opsi", why: "Salah: dividen MENGURANGI nilai call (mengalir ke pemegang saham, bukan opsi); arahnya kebalik." },
            { text: "Tidak ada efek — q hanya memengaruhi put", why: "Salah: q masuk d1 dan faktor S×e^(−qT) pada call; put ikut lewat paritas." },
            { text: "Efeknya hilang bila T = 1 tahun — q hanya penting untuk tenor panjang", why: "Salah: pada T = 1 tahun efeknya sudah 1,80 (17%); makin panjang T, makin besar." },
          ],
        },
      ],
      reference: "Saham berdividen: C = S×e^(−qT)×N(d1) − K×e^(−rT)×N(d2), d1 memakai (r − q + σ²/2). Contoh: q=3% → call 8,65 (bukan 10,45), put 6,73.",
    },
    {
      id: "gap-g24-iv-greeks-interpretasi",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G24)",
      title: "IV dan Greeks: interpretasi yang benar (dan tiga salah kaprah)",
      prose: [
        "Lesson ini sudah menghitung Greeks-nya (delta 0,637, gamma 0,0125, theta −0,0235 per hari, vega 37,52 per 100% σ alias 0,38 per 1 poin persen). Langkah ini memastikan angkanya dibaca dengan benar — karena Greeks yang salah dibaca lebih berbahaya daripada Greeks yang tidak dihitung. Salah kaprah satu: delta = probabilitas. Delta call 0,637 sering dibaca 'peluang 63,7% opsi berakhir in-the-money'. Salah — delta adalah hedge ratio: harga opsi naik Rp0,64 bila saham naik Rp1. Probabilitas risk-neutral berakhir in-the-money adalah N(d2), bukan N(d1) — dan keduanya adalah probabilitas di dunia risk-neutral, bukan dunia nyata; pasar tidak berjanji apa pun soal frekuensi kejadian.",
        "Salah kaprah dua: IV = ramalan. IV 20% pada langkah IV dibaca 'pasar meramal saham bergerak ±20% setahun dengan peluang 68%'. Yang benar: 68% dalam ±20% hanya berlaku BILA return lognormal DAN volatilitas konstan — dua asumsi yang tidak pernah benar persis. IV adalah HARGA ketidakpastian (biaya mengasuransikan gerakan), bukan ramalan gerakan: IV tinggi bisa berarti pasar takut, bisa berarti pasar bersiap — tetapi tidak pernah berarti pasar tahu arah. Buktinya: IV melonjak sebelum pengumuman lalu anjlok sesudahnya (volatility crush) — pembeli opsi yang benar arah tetap rugi karena premi menyusut.",
        "Salah kaprah tiga: Greeks sebagai angka mati. Delta 0,637 berlaku SAAT INI, pada harga SAAT INI. Gamma 0,0125 berarti bila saham naik Rp1, delta menjadi 0,637 + 0,0125 = 0,6495 ≈ 0,65 — delta bergerak, dan makin dekat kedaluwarsa dan makin at-the-money, gamma makin besar sehingga delta berubah makin liar. Theta −0,0235 per hari berarti opsi kehilangan Rp0,0235 tiap hari — tetapi theta mempercepat mendekati kedaluwarsa: es batu meleleh makin cepat saat mengecil. Vega 0,38 per 1 poin persen IV berarti IV naik 1 poin (misal 30% ke 31%) menaikkan harga opsi Rp0,38 — dan saat IV crush 60% ke 25%, opsi kehilangan 35 × 0,38 = Rp13,30 hanya dari vega, sebelum arah harga dihitung. Membaca Greeks berarti membaca ketiganya sebagai turunan yang bergerak, bukan sebagai label tetap.",
      ],
      formula: String.raw`\Delta = \text{hedge ratio} \neq P(ITM) \qquad \text{Vega crush: } \Delta C = \text{vega} \times \Delta IV`,
      formulaNote: "Delta 0,637 = Rp0,64 per Rp1 saham. IV crush 35 poin × vega 0,38 = Rp13,30 hilang dari premi.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membeli call karena 'delta 0,64 berarti peluang menang 64%'. Delta bukan probabilitas — ia hedge ratio. Dan IV bukan ramalan arah — ia harga ketakutan. Trader yang membeli narasi ini membeli premi mahal menjelang peristiwa, lalu kalah oleh theta dan vega crush walau arahnya benar.",
      },
      quiz: [
        {
          q: "Call delta 0,637, gamma 0,0125, theta −0,0235/hari, vega 0,38 per 1 poin IV. Saham naik Rp1 dan IV turun 10 poin di hari yang sama. Efek orde-pertama pada harga opsi?",
          options: [
            { text: "Naik ~Rp0,64 dari delta, turun ~Rp3,80 dari vega → net sekitar −Rp3,16 (belum termasuk theta dan gamma)", why: "Tepat: +0,64 − (10 × 0,38) = −3,16; arah benar pun kalah oleh IV crush.", correct: true },
            { text: "Naik Rp0,64 — hanya delta yang penting", why: "Salah: vega 10 poin = −Rp3,80, jauh lebih besar dari delta; mengabaikannya berarti mengabaikan mesin terbesar hari itu." },
            { text: "Naik 63,7% — delta adalah probabilitas menang", why: "Salah: delta = hedge ratio (Rp0,64 per Rp1), bukan probabilitas; N(d2) pun probabilitas risk-neutral, bukan dunia nyata." },
            { text: "Turun Rp0,0235 — hanya theta yang bekerja harian", why: "Salah: theta hanya −Rp0,0235; vega crush −Rp3,80 mendominasi hari itu." },
          ],
        },
      ],
      reference: "Delta = hedge ratio (bukan probabilitas); IV = harga ketidakpastian (bukan ramalan arah); Greeks bergerak — gamma mengubah delta, theta mempercepat, vega menghukum IV crush.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Black-Scholes (tanpa dividen): C = S·N(d₁) − Ke^(−rT)·N(d₂); lima input, σ satu-satunya opini — saham berdividen butuh input keenam, dividend yield q.",
        "Implied volatility = ekspektasi pasar forward-looking; jangan beli opsi saat IV mahal menjelang peristiwa.",
        "Delta = kecepatan (hedge ratio); gamma = akselerasi (terbesar ATM dekat expiry).",
        "Theta = bocor waktu (pembeli membayar, penjual memanen). Vega = sensitivitas ke volatilitas.",
        "Trader opsi profesional berpikir dalam Greeks — bukan sekadar “naik/turun”.",
      ],
      next: { label: "E12 — Kurs & Suku Bunga", href: "/v2/learn/e12-fx-suku-bunga" },
      quiz: [
        {
          q: "Implied volatility (IV) 60% artinya…",
          options: [
            { text: "Saham pasti naik 60%", why: "Salah: IV bukan soal arah — ia soal besar gerakan." },
            { text: "Pasar menghargai opsi seolah-olah volatilitas tahunan (1-sigma log-return) sekitar 60%", why: "Benar: kira-kira 68% peluang gerakan tahunan dalam ±60% jika lognormal — bukan prediksi arah. IV = ekspektasi forward-looking, BUKAN historis. IV tinggi = premi mahal.", correct: true },
            { text: "Opsi pasti untung", why: "Salah: IV tinggi justru membuat opsi mahal — pembeli butuh gerakan ekstra besar." },
            { text: "Volatilitas historis 60%", why: "Salah: IV = ekspektasi masa depan, bukan catatan masa lalu." },
          ],
        },
        {
          q: "Market maker menjual call lalu membeli 0,5 saham per kontrak (delta 0,5). Tujuannya?",
          options: [
            { text: "Spekulasi saham naik", why: "Salah: market maker tidak menebak arah." },
            { text: "Delta hedging: netral terhadap gerakan kecil harga saham", why: "Benar: ia memanen spread/theta sambil kebal guncangan kecil.", correct: true },
            { text: "Menambah return", why: "Salah: tujuannya netralitas risiko, bukan return arah." },
            { text: "Menghindari pajak", why: "Salah: tidak ada kaitan dengan pajak." },
          ],
        },
        {
          q: "Strategi “jual put rutin” punya Sharpe 2,8 selama 11 bulan. Penilaian tepat?",
          options: [
            { text: "Luar biasa — langsung investasi", why: "Salah: return mulus 11 bulan bisa = premi risiko ekor yang belum terjadi." },
            { text: "Curigai: profil short-volatility (theta+, vega−, gamma−); Sharpe buta terhadap ekor yang belum terjadi", why: "Benar: minta distribusi lengkap + skenario stres sebelum percaya.", correct: true },
            { text: "Sharpe tidak relevan", why: "Salah: Sharpe relevan — tapi tidak cukup sendirian." },
            { text: "Pasti penipuan", why: "Salah: belum tentu penipuan — tapi wajib diverifikasi." },
          ],
        },
      ],
    },
  ],
};

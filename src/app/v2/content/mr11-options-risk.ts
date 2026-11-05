import type { V2Lesson } from "../lib/types";

export const mr11: V2Lesson = {
  slug: "mr11-options-risk",
  track: "Market Risk",
  module: "Derivatif, FX & Komoditas",
  title: "MR11 — Options Risk: Greeks, Vol Surface, dan Seni Delta-Hedging",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-mesin-premi",
      eyebrow: "Langkah 1 · Payoff opsi",
      title: "Cerita: premi kecil, bencana besar",
      prose: [
        "Seorang trader menjual put options atas indeks saham — menerima premi Rp2 miliar per bulan. Strateginya terbukti: 11 bulan berturut-turut untung. Ia dijuluki mesin premi. Risk manager mencatat delta portofolionya kecil (terhedge) dan VaR-nya rendah. Bulan ke-12: indeks jatuh 8% dalam seminggu. Kerugian: Rp45 miliar — 22× premi tahunan.",
        "Investigasi: delta memang kecil, tetapi gamma sangat negatif (short put = short gamma) dan vega sangat negatif (saat pasar jatuh, volatilitas meledak → harga put yang ia jual melonjak). VaR delta-only tidak melihat keduanya. Twist-nya: strategi mesin premi ini secara ekonomi setara menjual asuransi gempa — untung kecil tiap bulan, bangkrut saat gempa. Seperti semua penjual asuransi, ia short volatilitas: diuntungkan ketenangan, dibunuh keguncangan.",
        "Fondasi 2 menit: call = hak membeli di strike K, payoff max(S_T−K, 0). Put = hak menjual di K, payoff max(K−S_T, 0). Long (beli): bayar premi; rugi terbatas (premi), untung tak terbatas. Short (jual): terima premi; untung terbatas (premi), rugi tak terbatas. Perhatikan tekukan (kink) di S=K — di sinilah non-linearitas lahir: kink membuat delta berubah-ubah (gamma), membuat VaR linear gagal (aproksimasi delta-only buta terhadap tekukan payoff), dan membuat opsi butuh full revaluation. Semua kerumitan Greeks berakar di satu tekukan ini.",
      ],
      formula: String.raw`\text{Call: } \max(S_T - K, 0) \qquad \text{Put: } \max(K - S_T, 0)`,
      formulaNote: "S_T = harga aset saat jatuh tempo; K = strike (harga eksekusi). Call hanya bernilai jika S_T > K (selisihnya = payoff); put hanya bernilai jika S_T < K. Contoh: S_T=110, K=100 → call bernilai 10. Interpretasi: tekukan (kink) tepat di S_T = K adalah sumber seluruh non-linearitas opsi — di sinilah gamma lahir dan VaR linear gagal.",
      tasks: [
        { id: "t1", text: "Gambarkan payoff long call dan short put, tandai di mana kink-nya." },
        { id: "t2", text: "Jelaskan kenapa kink membuat VaR linear gagal." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Strategi short-vol (jual opsi) adalah mesin pencetak premi di masa tenang dan mesin penghancur modal di masa krisis — profil yang sama dengan menjual proteksi kredit (risiko kredit). Premi Rp2 miliar/bulan terlihat seperti alpha sampai bulan ke-12 menghapus 22× premi tahunan.",
        type: "risk",
      },
      reference: "Long: rugi terbatas, untung tak terbatas. Short: sebaliknya. Kink = sumber non-linearitas.",
    },
    {
      id: "greeks",
      eyebrow: "Langkah 2 · Greeks",
      title: "Lima Greek yang mengendalikan",
      prose: [
        "Greeks adalah turunan parsial nilai opsi V terhadap tiap faktor. Delta (Δ = ∂V/∂S): kecepatan — jika saham naik Rp1, opsi naik Δ rupiah. Call: 0 s/d 1; put: −1 s/d 0. Hedge ratio: short 1 call Δ=0,6 → beli 0,6 saham untuk netral. Gamma (Γ = ∂²V/∂S²): akselerasi — seberapa cepat delta berubah; terbesar saat ATM & dekat expiry. Long gamma = untung dari pergerakan besar (rem otomatis); short gamma = bencana saat pasar liar.",
        "Vega (ν = ∂V/∂σ): sensitivitas ke volatilitas implisit; long opsi = long vega (untung saat pasar panik & vol naik); terbesar untuk opsi ATM jangka panjang. Theta (Θ = ∂V/∂t): peluruhan waktu — opsi kehilangan nilai tiap hari; long opsi theta negatif (bayar tiap hari), short opsi theta positif (terima premi waktu). Rho (ρ = ∂V/∂r): sensitivitas ke suku bunga — biasanya terkecil, sering diabaikan kecuali opsi jangka sangat panjang.",
        "Hafalkan pasangan trade-off: theta vs gamma (terima premi waktu ↔ bayar risiko pergerakan) dan delta vs gamma (netral arah ↔ eksposur percepatan). Setiap strategi opsi adalah pilihan di antara trade-off ini — tidak ada posisi yang untung semua. Kalau ada yang terlihat untung semua, kamu belum menemukan Greek yang negatif.",
      ],
      formula: String.raw`\Delta = \frac{\partial V}{\partial S}, \quad \Gamma = \frac{\partial^2 V}{\partial S^2}, \quad \nu = \frac{\partial V}{\partial \sigma}, \quad \Theta = \frac{\partial V}{\partial t}, \quad \rho = \frac{\partial V}{\partial r}`,
      formulaNote: "V = nilai opsi; S = harga aset dasar; σ = volatilitas implisit; t = waktu; r = suku bunga. Delta (∂V/∂S): hedge ratio — 0,6 artinya beli 0,6 saham per 1 call yang di-short. Gamma: turunan kedua — seberapa cepat delta berubah; terbesar saat ATM dekat expiry (inilah pin risk). Vega: sensitivitas ke vol; theta: peluruhan harian; rho: biasanya terkecil, diabaikan kecuali tenor sangat panjang.",
      tasks: [
        { id: "t1", text: "Jelaskan tiap Greek dalam satu kalimat: apa yang diukur dan tanda untuk long call." },
        { id: "t2", text: "Jelaskan trade-off theta vs gamma dengan contoh short put." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira delta-neutral = tidak ada risiko. Delta-neutral hanya mematikan orde-1 — masih hidup: gamma (orde-2), vega (vol), theta (waktu). Portofolio delta-neutral tetapi short gamma + short vega = bom waktu yang terlihat aman, persis strategi mesin premi di cerita pembuka. Selalu tanya: netral terhadap apa — dan ekspos ke apa?",
        type: "pitfall",
      },
      reference: "Delta kecepatan, gamma akselerasi, vega ke vol, theta ke waktu, rho ke rate. Trade-off abadi: theta vs gamma.",
    },
    {
      id: "pnl-explain-opsi",
      eyebrow: "Langkah 3 · P&L explain",
      title: "Membedah P&L opsi per Greek",
      prose: [
        "P&L harian opsi didekomposisi per Greek: ΔV ≈ Δ·ΔS + ½Γ(ΔS)² + ν·Δσ + Θ·Δt + ρ·Δr. Tiap suku punya nama: delta (arah), gamma (percepatan), vega (vol), theta (waktu), rho (rate). Cara pakai untuk diagnosis: P&L aktual ≈ prediksi → model & data sehat. Unexplained besar → kandidat: smile berubah bentuk (vega bucket salah), jump (gamma tak tertangkap), data vol basi, atau biaya transaksi tak tercatat.",
        "Contoh long call: Δ=0,6, Γ=0,08, ν=1,5, Θ=−0,05. Skenario: pasar jatuh (ΔS=−5) + panik (Δσ=+5), 1 hari. Hitung: delta −3,0; gamma +1,0; vega +7,5; theta −0,05. Total +5,45 — vega mendominasi! Untuk long opsi, kepanikan pasar justru menguntungkan via vega. Bandingkan dengan short: total −5,45 — vega yang sama kini membunuh.",
        "Aturan diagnosis: theta positif tetapi P&L negatif persisten → gamma/vega sedang memakan theta — strategi short-vol yang mulai berdarah. Itu sinyal awal sebelum bulan ke-12 datang.",
      ],
      formula: String.raw`\Delta V \approx \Delta\cdot\Delta S + \tfrac{1}{2}\Gamma(\Delta S)^2 + \nu\cdot\Delta\sigma + \Theta\cdot\Delta t`,
      formulaNote: "ΔV = perubahan nilai opsi; ΔS = pergerakan harga aset; Δσ = perubahan volatilitas implisit; Δt = berlalunya waktu (hari). Suku gamma memakai ½(ΔS)² — efek kuadratik: pergerakan 2× lipat → kontribusi gamma 4× lipat. Contoh lab: delta −3,0; gamma +1,0; vega +7,5; theta −0,05 → total +5,45. Interpretasi: dekomposisi ini adalah 'otopsi' P&L — komponen unexplained yang besar = sinyal model, data vol, atau smile bermasalah.",
      tasks: [
        { id: "t1", text: "Hitung `total` P&L long call dari tiap komponen Greek" },
        { id: "t2", text: "Tentukan `dominan` (nama komponen terbesar), lalu cetak keduanya" },
      ],
      expected: "total=5.45  dominan=vega",
      note: {
        title: "Kaitan ke risk",
        body: "Untuk posisi short, semua tanda terbalik: vega +7,5 menjadi −7,5. Inilah yang membunuh mesin premi — pasar jatuh (delta) dan vol meledak (vega) terjadi bersamaan, dua pukulan sekaligus. Dekomposisi per Greek menunjukkan dari mana tepatnya darah keluar.",
        type: "risk",
      },
      hints: [
        "Tiap suku: t_delta = delta*dS; t_gamma = 0.5*gamma*dS**2; t_vega = vega*dVol; t_theta = theta*dt.",
        "total = jumlah keempat suku. dominan = yang nilai absolutnya terbesar.",
        "Gunakan max dengan key abs pada dict komponen.",
      ],
      code: {
        starter: `# Long call: Greeks dan skenario (pasar jatuh + panik)\ndelta, gamma, vega, theta = 0.6, 0.08, 1.5, -0.05\ndS, dVol, dt = -5, 5, 1\n\n# TULIS KODEMU: tiap komponen, total, dan komponen dominan\nkomp = {\n    "delta": delta * dS,\n    "gamma": ,\n    "vega": ,\n    "theta": ,\n}\ntotal = \ndominan = \n\nprint(f"total={total}  dominan={dominan}")`,
        lockLines: 3,
        solution: `# Long call: Greeks dan skenario (pasar jatuh + panik)\ndelta, gamma, vega, theta = 0.6, 0.08, 1.5, -0.05\ndS, dVol, dt = -5, 5, 1\n\n# TULIS KODEMU: tiap komponen, total, dan komponen dominan\nkomp = {\n    "delta": delta * dS,\n    "gamma": 0.5 * gamma * dS ** 2,\n    "vega": vega * dVol,\n    "theta": theta * dt,\n}\ntotal = sum(komp.values())\ndominan = max(komp, key=lambda k: abs(komp[k]))\n\nprint(f"total={total}  dominan={dominan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 5.45, tol: 1e-9, label: "`total` seharusnya 5.45", msg: "−3,0 + 1,0 + 7,5 − 0,05. Cek tiap suku." },
          { kind: "equal", task: "t2", name: "dominan", value: "vega", label: "`dominan` seharusnya vega", msg: "|7,5| > |−3,0| > |1,0| > |−0,05|. Vega mendominasi saat panik." },
          { kind: "stdout_matches", task: "t2", pattern: "total=5\\.45\\s+dominan=vega", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ΔV ≈ ΔΔS + ½Γ(ΔS)² + νΔσ + ΘΔt. Diagnosis: unexplained besar → selidiki smile/jump/data.",
    },
    {
      id: "vol-surface",
      eyebrow: "Langkah 4 · Vol surface",
      title: "Senyum yang membantah Black-Scholes",
      prose: [
        "Implied volatility (IV) = volatilitas yang membuat harga Black-Scholes sama dengan harga pasar. Jika asumsi BS benar (vol konstan), IV harus sama untuk semua strike & tenor. Kenyataannya: kurva IV vs strike membentuk senyum (smile) — IV lebih tinggi di strike jauh (OTM/ITM dalam). Pasar membayar lebih mahal untuk proteksi jauh (put OTM) daripada prediksi BS — karena pasar tahu ekor lebih tebal dari asumsi normal.",
        "Smile yang miring (skew: put OTM lebih mahal dari call OTM) = pasar takut jatuh lebih dari takut naik — cerminan crash risk. Vol surface = smile ini untuk semua tenor sekaligus (permukaan 3D: strike × tenor × IV). Implikasi risiko: vega tidak cukup — vega hanya mengukur pergeseran paralel IV, tetapi smile bisa berubah bentuk (skew menajam saat panik) → butuh vega per strike (bucketed vega). Dan sticky strike vs sticky delta: saat spot bergerak, apakah smile ikut bergerak atau menempel di moneyness? Asumsi yang salah → hedge vega salah.",
        "Model risk: memakai BS dengan satu vol untuk semua strike = salah harga opsi jauh — dan salah ukur risikonya. IV bukan ramalan murni: ia harga risiko dalam satuan volatilitas — mencakup ekspektasi plus premi ketakutan. Jangan baca IV sebagai prediksi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa vol smile muncul dan apa arti skew." },
        { id: "t2", text: "Kenapa vega tunggal tidak cukup saat smile berubah bentuk?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira volatilitas implisit = prediksi pasar tentang volatilitas masa depan. IV = harga risiko dalam satuan volatilitas — mencakup ekspektasi plus premi risiko (ketakutan). IV tinggi bisa berarti pasar berekspektasi gejolak ATAU pasar sangat takut sehingga membayar mahal untuk proteksi.",
        type: "pitfall",
      },
      reference: "Smile = pasar tahu ekor tebal. Skew = takut jatuh. Butuh bucketed vega, bukan vega tunggal.",
    },
    {
      id: "delta-hedging",
      eyebrow: "Langkah 5 · Delta-hedging",
      title: "Menjinakkan delta — dan kenapa tak pernah sempurna",
      prose: [
        "Delta-hedging: pegang −Δ unit saham per opsi untuk membuat portofolio delta-netral — kebal (orde-1) terhadap pergerakan kecil. Karena delta berubah terus (gamma!), hedge harus di-rebalance berkala. Hasil fundamental: P&L portofolio ter-delta-hedge ≈ theta − biaya gamma yang terealisasi. Short call ter-hedge = short volatilitas terealisasi: untung jika pasar tenang (theta > biaya hedge), rugi jika liar.",
        "Kenapa tidak pernah sempurna: diskritisasi (teori = rebalance kontinu, praktik = harian — di antaranya gamma bekerja liar), biaya transaksi (rebalance terus = biaya terus; hedge sempurna = bangkrut oleh biaya), vol salah (delta dihitung dengan vol model; jika vol aktual beda → hedge ratio salah sistematis), dan gap/jump (saham bisa melompat — delta-hedge tidak melindungi dari jump).",
        "Simulasi: short 1 call ATM (S=K=100, 30 hari), delta-hedge harian 10 langkah, 500 path. Vol model 30%, vol aktual 40%. Premi diterima 3,43. Rata-rata P&L ter-hedge = −1,14 — negatif sistematis! Vol aktual > vol model → biaya gamma melebihi theta. Inilah cara volatility trading bekerja: untung jika vol terealisasi < vol implisit. Delta-hedging seperti menyeimbangkan sapu di telapak tangan — bisa, tetapi butuh koreksi terus, dan biaya koreksinya dimakan theta.",
        "Pin risk — gamma yang meledak di dekat expiry: saat opsi ATM mendekati jatuh tempo, gamma melonjak tajam — delta bisa berayun dari 0 ke 1 dalam hitungan menit jika harga menari di sekitar strike. Untuk penjual opsi, ini zona paling berbahaya: hedge yang tadinya tenang tiba-tiba butuh rebalance besar tepat saat likuiditas menipis. Market maker menyebutnya pinning: harga cenderung menempel di strike populer saat expiry karena hedging kolektif itu sendiri yang menahannya. Aturan praktisi: kurangi ukuran atau tutup posisi short gamma 1–2 hari sebelum expiry — theta yang tersisa tidak sebanding dengan risiko gamma yang meledak. Untuk risk manager: limit gamma diperketat (bukan dilonggarkan) mendekati expiry.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan simulasi dan hitung `avg_pnl` dari 500 path" },
        { id: "t2", text: "Jelaskan kenapa rata-ratanya negatif (bukan nol)" },
      ],
      expected: "avg_pnl=-1.14",
      note: {
        title: "Kaitan ke risk",
        body: "1987: ketika gamma membunuh asuransi portofolio. Portfolio insurance = strategi delta-hedge dinamis raksasa — saat pasar jatuh 19 Oktober 1987, semua pelaku menjual bersamaan untuk rebalance, memperdalam kejatuhan, memicu penjualan lagi. Gamma kolektif menjadi umpan balik sistemik. Hedging individual yang rasional bisa menjadi bencana kolektif.",
        type: "risk",
      },
      hints: [
        "Struktur simulasi sudah disediakan dan terkunci — fokus pada perhitungan akhir.",
        "avg_pnl = sum(pnls) / len(pnls).",
        "Negatif karena vol aktual (40%) > vol model (30%): biaya gamma > theta.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(42)\n\ndef bs_call(S, K, T, r, sig):\n    if T <= 0:\n        return max(S - K, 0), (1.0 if S > K else 0.0)\n    d1 = (math.log(S / K) + (r + 0.5 * sig * sig) * T) / (sig * math.sqrt(T))\n    d2 = d1 - sig * math.sqrt(T)\n    N = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\n    return S * N(d1) - K * math.exp(-r * T) * N(d2), N(d1)\n\nS0, K, T, r = 100.0, 100.0, 30 / 365, 0.0\nsig_m, sig_r = 0.30, 0.40  # vol MODEL vs vol AKTUAL\npremium, _ = bs_call(S0, K, T, r, sig_m)\nn_paths, n_steps = 500, 10\ndt = T / n_steps\npnls = []\nfor _ in range(n_paths):\n    S = S0\n    _, delta = bs_call(S, K, T, r, sig_m)\n    shares, cash, t = delta, premium - delta * S, T\n    for i in range(n_steps):\n        t -= dt\n        S = S * math.exp((r - 0.5 * sig_r ** 2) * dt + sig_r * math.sqrt(dt) * random.gauss(0, 1))\n        _, delta_new = bs_call(S, K, t, r, sig_m)\n        cash -= (delta_new - shares) * S\n        shares = delta_new\n    pnls.append(cash + shares * S - max(S - K, 0))\n\n# TULIS KODEMU: rata-rata P&L hedge\navg_pnl = \n\nprint(f"avg_pnl={avg_pnl:.2f}")`,
        lockLines: 30,
        solution: `import random, math\nrandom.seed(42)\n\ndef bs_call(S, K, T, r, sig):\n    if T <= 0:\n        return max(S - K, 0), (1.0 if S > K else 0.0)\n    d1 = (math.log(S / K) + (r + 0.5 * sig * sig) * T) / (sig * math.sqrt(T))\n    d2 = d1 - sig * math.sqrt(T)\n    N = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\n    return S * N(d1) - K * math.exp(-r * T) * N(d2), N(d1)\n\nS0, K, T, r = 100.0, 100.0, 30 / 365, 0.0\nsig_m, sig_r = 0.30, 0.40  # vol MODEL vs vol AKTUAL\npremium, _ = bs_call(S0, K, T, r, sig_m)\nn_paths, n_steps = 500, 10\ndt = T / n_steps\npnls = []\nfor _ in range(n_paths):\n    S = S0\n    _, delta = bs_call(S, K, T, r, sig_m)\n    shares, cash, t = delta, premium - delta * S, T\n    for i in range(n_steps):\n        t -= dt\n        S = S * math.exp((r - 0.5 * sig_r ** 2) * dt + sig_r * math.sqrt(dt) * random.gauss(0, 1))\n        _, delta_new = bs_call(S, K, t, r, sig_m)\n        cash -= (delta_new - shares) * S\n        shares = delta_new\n    pnls.append(cash + shares * S - max(S - K, 0))\n\n# TULIS KODEMU: rata-rata P&L hedge\navg_pnl = sum(pnls) / len(pnls)\n\nprint(f"avg_pnl={avg_pnl:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "avg_pnl", value: -1.14, tol: 0.15, label: "`avg_pnl` seharusnya ~−1.14", msg: "Rata-rata dari 500 path (seed 42). Cek pembagi len(pnls)." },
          { kind: "stdout_matches", task: "t1", pattern: "avg_pnl=-1\\.14", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "P&L hedge ≈ theta − biaya gamma aktual. Vol aktual > vol model → rugi sistematis.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta & mini-case",
      title: "Kontrol risiko untuk penjual opsi",
      prose: [
        "Empat keputusan. Pertama, portofolio ber-opsi dengan gamma/vega material → ukur dan limit Greeks orde-2, bukan cuma delta: delta-neutral + short gamma + short vega = bom waktu. Kedua, valuasi dan VaR → full revaluation (Monte Carlo): VaR delta-only buta terhadap short-vol; aproksimasi linear gagal di kink.",
        "Ketiga, lindung nilai → delta-hedge dengan kesadaran biayanya: rebalance diskrit + biaya transaksi + vol model bisa salah + jump. Tanyakan: berapa hedging error yang bisa ditoleransi, dan apakah theta menutupinya? Keempat, risiko vol → kelola smile, bukan satu angka: bucketed vega per strike/tenor; uji asumsi sticky strike vs sticky delta.",
        "Mini-case: desk menjual opsi untuk pendapatan premi stabil. Kontrol wajib: limit gamma & vega terpisah (bukan cuma delta/VaR), stress skenario gap + vol eksplisit (pasar jatuh 8% + vol meledak — skenario bulan ke-12), dan VaR full-revaluation. VaR delta-only untuk short-vol = speedometer yang rusak: menunjukkan angka tenang saat mesin menuju jurang.",
      ],
      tasks: [
        { id: "t1", text: "Desk delta-neutral, short gamma, short vega, VaR rendah. Apa profil risikonya?" },
        { id: "t2", text: "Sebutkan tiga kontrol wajib untuk desk penjual opsi." },
      ],
      note: {
        title: "Sering salah",
        body: "Mengandalkan VaR delta-only untuk mengawasi desk short-vol. Delta kecil + VaR rendah justru adalah kamuflase strategi ini — kontrol yang benar: limit gamma/vega terpisah, stress eksplisit, full revaluation. Angka yang menenangkan adalah bagian dari bahayanya.",
        type: "pitfall",
      },
      reference: "Short-vol: limit gamma & vega + stress gap/vol + VaR full-revaluation.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi praktisi",
      title: "Cari Greek yang negatif",
      prose: [
        "Aturan emas dari meja derivatif: jika sebuah strategi opsi terlihat menguntungkan dalam semua skenario — kamu belum menemukan Greek yang negatif. Setiap posisi opsi adalah pertukaran: theta yang kamu terima dibayar dengan gamma yang kamu tanggung; delta yang kamu netralkan dibayar dengan vega yang kamu buka. Tidak ada makan siang gratis di permukaan vol.",
        "Tiga pertanyaan yang diajukan risk manager senior sebelum menyetujui strategi opsi baru: (1) di mana gamma terbesarnya — dan apa yang terjadi jika pasar bergerak 3× lipat dari ekspektasi dalam sehari? (2) bagaimana posisi ini berperilaku saat volatilitas meledak — apakah vega membantu atau membunuh? (3) apa yang terjadi 2 hari sebelum expiry — apakah gamma meledak (pin risk)? Strategi yang lolos tiga pertanyaan ini boleh dibicarakan; yang tidak, ditolak sebelum merugikan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan 'cari Greek yang negatif' dengan contoh strategi short put." },
        { id: "t2", text: "Terapkan tiga pertanyaan risk manager ke strategi 'mesin premi' di cerita pembuka." },
      ],
      note: {
        title: "💡 Intuisi",
        body: "Heuristik praktisi untuk risiko opsi. Pertama, hafalkan pasangan trade-off-nya: theta vs gamma (premi waktu vs risiko pergerakan) dan delta vs vega (netral arah vs eksposur vol). Setiap kali seseorang menawarkan 'strategi theta positif yang aman', tanyakan di mana gamma dan veganya disembunyikan — jawabannya selalu ada. Kedua, gamma adalah Greek yang paling menipu karena ia diam di masa tenang: portofolio short gamma terlihat seperti mesin uang selama berbulan-bulan, lalu menagih semuanya dalam seminggu — persis profil mesin premi di cerita pembuka (Rp2 miliar/bulan × 11 bulan, lalu −Rp45 miliar). Ukur gamma dalam skenario stres, bukan kondisi normal. Ketiga, vega membunuh saat kamu paling tidak siap: pasar jatuh dan vol meledak terjadi bersamaan — dua pukulan sekaligus untuk penjual opsi. Jangan pernah menilai risiko short-vol dari delta dan VaR linear saja; butuh full revaluation + stress gabungan (gap + vol spike). Keempat, waspadai pin risk: gamma meledak di dekat expiry untuk opsi ATM — tutup atau kecilkan posisi short gamma sebelum expiry, dan ketatkan limit gamma (bukan sebaliknya). Kelima, smile/skew bukan dekorasi: ia adalah harga yang dibayar pasar untuk ekor tebal — pakai bucketed vega per strike/tenor, dan uji asumsi sticky strike vs sticky delta sebelum percaya hedge vegamu. Dan terakhir: delta-hedging adalah seni mengelola biaya, bukan menghilangkan risiko — P&L hedge ≈ theta − biaya gamma aktual; jika vol terealisasi > vol implisit, kamu membayar selisihnya setiap hari. Itulah harga menjadi penjual asuransi.",
      },
      reference: "Cari Greek yang negatif: theta↔gamma, delta↔vega. Uji gamma saat stres, vega saat panik, pin risk saat expiry.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut ke MR12.",
      ],
      tasks: [],
      summary: [
        "Payoff: long rugi terbatas/untung tak terbatas; short sebaliknya. Kink = sumber non-linearitas.",
        "Greeks: delta (kecepatan), gamma (akselerasi), vega (vol), theta (waktu), rho (rate). Trade-off abadi: theta vs gamma.",
        "P&L explain: ΔV ≈ ΔΔS + ½Γ(ΔS)² + νΔσ + ΘΔt — diagnosis dari mana darah keluar.",
        "Vol smile = pasar tahu ekor tebal; skew = takut jatuh. Butuh bucketed vega.",
        "Delta-hedge: P&L ≈ theta − biaya gamma aktual; tak pernah sempurna (diskrit, biaya, vol salah, jump).",
        "Delta-neutral ≠ aman. Short gamma + short vega = bom waktu.",
      ],
      next: { label: "MR12 — FX & Komoditas", href: "/learn/mr12-fx-komoditas" },
      quiz: [
        {
          q: "Portofolio delta-neutral, short gamma besar, short vega besar. Profil risikonya?",
          options: [
            { text: "Aman — delta sudah netral", why: "delta-neutral hanya mematikan orde-1." },
            { text: "Bom waktu: rugi kuadratik saat pasar bergerak besar (gamma) + rugi saat vol naik (vega)", why: "short gamma + short vega = eksposur ke dua hal yang terjadi bersamaan saat krisis — persis mesin premi yang menunggu bencana.", correct: true },
            { text: "Untung pasti dari theta", why: "theta positif tidak menjamin — gamma/vega bisa memakannya habis." },
            { text: "Tidak ada risiko sama sekali", why: "justru sebaliknya." },
          ],
        },
        {
          q: "Long call ATM. Suku bunga naik (S & vol tetap). Efek ke nilai opsi? (Rho call positif)",
          options: [
            { text: "Turun", why: "rho call positif — arahnya naik." },
            { text: "Naik sedikit — rho call positif tapi kecil; efeknya minor dibanding delta/gamma/vega", why: "rho ada tetapi biasanya terkecil — kecuali opsi jangka sangat panjang.", correct: true },
            { text: "Tidak berubah", why: "berubah, walau kecil." },
            { text: "Naik besar", why: "rho bukan Greek dominan." },
          ],
        },
        {
          q: "Vol smile menunjukkan put OTM jauh lebih mahal (IV tinggi) dari call OTM. Artinya?",
          options: [
            { text: "Pasar salah harga", why: "pasar justru lebih tahu dari model." },
            { text: "Pasar membayar premi lebih untuk proteksi jatuh — mencerminkan crash risk / ekor tebal kiri", why: "skew = harga ketakutan. BS dengan vol konstan tidak menangkap ini, makanya smile muncul.", correct: true },
            { text: "Put selalu lebih mahal dari call", why: "tidak selalu — ini tentang skew, bukan aturan umum." },
            { text: "Volatilitas akan turun", why: "tidak ada implikasi arah vol masa depan." },
          ],
        },
        {
          q: "Short call yang di-delta-hedge. Jika vol aktual > vol model, P&L hedge akan?",
          options: [
            { text: "Tetap nol", why: "nol hanya jika vol aktual = vol model." },
            { text: "Negatif sistematis — biaya rebalancing (gamma) melebihi theta; short call ter-hedge = short vol terealisasi", why: "P&L hedge = theta − biaya gamma aktual. Inilah cara volatility trading bekerja.", correct: true },
            { text: "Positif sistematis", why: "itu untuk long vol, bukan short." },
            { text: "Acak", why: "ada bias sistematis, bukan acak." },
          ],
        },
        {
          q: "Mengapa delta-hedging tidak pernah sempurna di praktik?",
          options: [
            { text: "Karena rumusnya salah", why: "rumusnya benar dalam asumsinya — asumsinya yang tidak realistis." },
            { text: "Rebalance diskrit (bukan kontinu) + biaya transaksi + vol model bisa salah + gap/jump harga", why: "empat sumber hedging error. Black-Scholes mengasumsikan dunia ideal yang dilanggar semuanya.", correct: true },
            { text: "Karena trader malas", why: "ini masalah struktural, bukan perilaku." },
            { text: "Karena tidak ada saham", why: "bukan itu masalahnya." },
          ],
        },
      ],
    },
  ],
};

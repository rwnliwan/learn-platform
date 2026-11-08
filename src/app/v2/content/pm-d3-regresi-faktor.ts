import type { V2Lesson } from "../lib/types";

// Bar eksposur faktor (beta) portofolio contoh CFA di lesson:
// beta_mkt = 1,0; beta_SMB = 0,8; beta_HML = 0,6.
// Kontribusi: 1,0x7% = 7%; 0,8x3% = 2,4%; 0,6x4% = 2,4%.
const FACTOR_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Bar eksposur faktor: beta pasar 1,0; beta size 0,8; beta value 0,6; kontribusi return 7 persen, 2,4 persen, 2,4 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="57">1,0</text><text x="54" y="141">0,5</text><text x="54" y="224">0</text></g>
<rect x="120" y="53" width="80" height="167" fill="var(--c1)"/>
<rect x="240" y="87" width="80" height="133" fill="var(--c2)"/>
<rect x="360" y="120" width="80" height="100" fill="var(--c3)"/>
<g fill="var(--text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle" font-weight="700"><text x="160" y="44">1,0</text><text x="280" y="78">0,8</text><text x="400" y="111">0,6</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="160" y="240">beta pasar (MKT)</text><text x="280" y="240">beta size (SMB)</text><text x="400" y="240">beta value (HML)</text></g>
<g fill="var(--text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="160" y="212">-&gt; 7,0% return</text><text x="280" y="212">-&gt; 2,4% return</text><text x="400" y="212">-&gt; 2,4% return</text></g>
<text x="280" y="14" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">eksposur faktor portofolio (contoh CFA)</text>
</svg>`;

export const pmd3: V2Lesson = {
  slug: "pm-d3-regresi-faktor",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D3 — Regresi Faktor",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-bintang",
      eyebrow: "Langkah 1 · Cerita",
      title: "Alpha \u2018bintang\u2019 yang ternyata beta",
      prose: [
        "Manajer \u2018Bintang\u2019: 5 tahun alpha +4%/tahun! Fee 2%. Investor antre. Analis menjalankan regresi Fama-French: alpha → +0,5% (t-stat 0,8); loading: small-cap + value tinggi.",
        "Twist-nya: \u2018alpha\u2019 = beta tersamar (faktor small & value yang sedang bagus!) \u2014 bisa direplikasi dengan ETF 0,2%. Investor membayar 2% untuk beta mahal. Regresi = kacamata X-ray klaim manajer.",
        "Lesson ini tentang membedah dengan angka: regresi CAPM, Fama-French, dan style analysis.",
      ],
      tasks: [],
      reference: "Bayar untuk alpha, bukan beta.",
    },
    {
      id: "regresi-capm",
      eyebrow: "Langkah 2 · Regresi CAPM",
      title: "Tes DNA klaim manajer",
      prose: [
        "Regresi CAPM: R_p − R_f = α + β(R_m − R_f) + ε. Alpha (intersep): return di luar pasar \u2014 skill? Beta (slope): sensitivitas pasar. R²: % variasi yang dijelaskan pasar (0,95 = closet indexer; 0,5 = aktif beneran). t-stat = α/SE(α): |t| > 2 = signifikan (95%). Aturannya: alpha tanpa t-stat = anecdote.",
        "Bedah \u2018Bintang\u2019: alpha +4%, beta 1,1, R² 0,85, t-stat 1,2. Verdict CAPM: t < 2 → alpha tidak signifikan (bisa noise!). R² 0,85 → mirip pasar. Setelah Fama-French (loading SMB +0,8, HML +0,6): alpha sisa +0,5% (t 0,8). Kesimpulan: bayar 2% untuk beta small-value (ETF 0,2%!). Pecat atau nego.",
        "Tiga contoh kilat. (1) R fund 12%, Rf 3%, Rm 10%, β 1,2 → E(R) = 3% + 1,2×7% = 11,4%; alpha = +0,6% (kecil!) \u2014 hampir semua = beta, tidak layak fee mahal. (2) Bull market +20%, fund β 1,5 → +30%; E(R) = 3% + 1,5×17% = 28,5%; alpha hanya +1,5%. Bear −20% → −30%! Beta = pedang bermata dua. (3) R = 8%, E(R) = 10% → alpha −2% (merusak nilai!) → pecat, ganti ETF.",
      ],
      formula: String.raw`R_p - R_f = \alpha + \beta(R_m - R_f) + \varepsilon`,
      formulaNote: "α = alpha (skill? atau noise?); β = beta; t = α/SE; |t|>2 = signifikan.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Return tinggi = skill.\u2019 Salah. Regresi dulu! Beta ≠ alpha. Dan \u2018R² tinggi = manajer bagus\u2019 juga salah: R² 0,95 = closet indexer \u2014 bayar fee aktif untuk hasil indeks! R² rendah + alpha signifikan = aktif beneran (layak fee!).",
      },
      reference: "Selalu minta: alpha, t-stat, R², dan loadings FF \u2014 empat angka = 80% due diligence.",
    },
    {
      id: "lab-ols",
      eyebrow: "Langkah 3 · Lab regresi CAPM",
      title: "OLS manual tanpa library",
      prose: [
        "Hitung alpha, beta, R², dan t-stat dari 60 bulan data return \u2014 murni dengan Python standar. Coba ubah ALPHA_TRUE dari 0,005 menjadi 0,02 (skill beneran): t-stat naik > 2 \u2014 signifikan!",
      ],
      tasks: [
        { id: "t1", text: "Hitung `beta`, `alpha`, `se_alpha`, `r2`" },
        { id: "t2", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Alpha : 1.546% (t-stat 4.1)  Beta  : 1.11  R2    : 0.78  SIGNIFIKAN",
      hints: [
        "beta = Σ(a−mx)(b−my)/Σ(a−mx)²; alpha = my − beta×mx.",
        "se_alpha = se×√(1/N + mx²/Σ(a−mx)²); t = alpha/se_alpha.",
        "r2 = 1 − Σres²/Σ(b−my)²; |t|>2 → SIGNIFIKAN.",
      ],
      code: {
        starter: `# OLS manual: R_p - R_f = alpha + beta*(R_m - R_f)\nimport math, random\nrandom.seed(11)\nALPHA_TRUE, BETA_TRUE = 0.005, 1.1  # per bulan (ubah ALPHA jadi 0.02!)\nN = 60\nrm = [random.uniform(-0.08, 0.08) for _ in range(N)]\nrp = [ALPHA_TRUE + BETA_TRUE*x + random.gauss(0, 0.03) for x in rm]\n\n# TULIS KODEMU\nmx, my = sum(rm)/N, sum(rp)/N\nbeta = \nalpha = \nres = [b - (alpha + beta*a) for a, b in zip(rm, rp)]\nse = math.sqrt(sum(r*r for r in res)/(N-2))\nse_alpha = \nr2 = \n\nprint(f"Alpha : {alpha:.3%} (t-stat {alpha/se_alpha:.1f})")\nprint(f"Beta  : {beta:.2f}")\nprint(f"R2    : {r2:.2f}")\nprint(f"|t|>2: {'SIGNIFIKAN' if abs(alpha/se_alpha) > 2 else 'tidak signifikan (noise?)'}")`,
        lockLines: 6,
        solution: `# OLS manual: R_p - R_f = alpha + beta*(R_m - R_f)\nimport math, random\nrandom.seed(11)\nALPHA_TRUE, BETA_TRUE = 0.005, 1.1  # per bulan (ubah ALPHA jadi 0.02!)\nN = 60\nrm = [random.uniform(-0.08, 0.08) for _ in range(N)]\nrp = [ALPHA_TRUE + BETA_TRUE*x + random.gauss(0, 0.03) for x in rm]\n\n# TULIS KODEMU\nmx, my = sum(rm)/N, sum(rp)/N\nbeta = sum((a-mx)*(b-my) for a, b in zip(rm, rp))/sum((a-mx)**2 for a in rm)\nalpha = my - beta*mx\nres = [b - (alpha + beta*a) for a, b in zip(rm, rp)]\nse = math.sqrt(sum(r*r for r in res)/(N-2))\nse_alpha = se*math.sqrt(1/N + mx**2/sum((a-mx)**2 for a in rm))\nr2 = 1 - sum(r*r for r in res)/sum((b-my)**2 for b in rp)\n\nprint(f"Alpha : {alpha:.3%} (t-stat {alpha/se_alpha:.1f})")\nprint(f"Beta  : {beta:.2f}")\nprint(f"R2    : {r2:.2f}")\nprint(f"|t|>2: {'SIGNIFIKAN' if abs(alpha/se_alpha) > 2 else 'tidak signifikan (noise?)'}")`,
        checks: [
          { kind: "equal", task: "t1", name: "beta", value: 1.109, tol: 0.01, label: "`beta` ≈ 1.11", msg: "Slope OLS dari 60 bulan data (seed 11)." },
          { kind: "equal", task: "t1", name: "alpha", value: 0.01546, tol: 0.001, label: "`alpha` ≈ 0.0155", msg: "Intersep ≈ 1,55%/bulan (seed 11) \u2014 t-stat 4,1 → signifikan." },
          { kind: "equal", task: "t1", name: "r2", value: 0.7753, tol: 0.01, label: "`r2` ≈ 0.78", msg: "77,5% variasi dijelaskan pasar." },
          { kind: "stdout_matches", task: "t2", pattern: "Alpha : 1\\.546% \\(t-stat 4\\.1\\)", label: "`print` menampilkan Alpha 1.546% (t-stat 4.1)", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Studi: 80% manajer alpha negatif (net fee); hanya 20% positif \u2014 regresi = filter.",
    },
    {
      id: "lab-tstat",
      eyebrow: "Langkah 4 · Lab t-stat",
      title: "Berapa lama agar alpha signifikan?",
      prose: [
        "t-stat alpha tumbuh dengan akar waktu: t = alpha×√T/TE. Hitung untuk track record 1\u201315 tahun. Coba ubah ALPHA dari 0,04 menjadi 0,02: butuh tahun LEBIH lama \u2014 alpha kecil butuh dekade! Aturan praktis: 1 tahun alpha +10% (t~1) = noise; 10 tahun +2% (t~2,5) = skill. Waktu = bukti.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `t` untuk tiap T" },
        { id: "t2", text: "Cetak tabel dengan `print`" },
      ],
      expected: "1→0.5, 3→0.9, 5→1.1, 10→1.6, 15→1.9 — semua 'belum' signifikan",
      hints: [
        "t = ALPHA × √T / TE; math.sqrt untuk akar.",
        "Loop for T in [1, 3, 5, 10, 15]; format {t:>8.1f}.",
        "Signifikan jika t > 2 \u2014 dengan alpha 4% & TE 8%, 15 tahun pun belum cukup!",
      ],
      code: {
        starter: `# t-stat alpha vs panjang track record: t = alpha*sqrt(T)/vol_aktif\nimport math\nALPHA = 0.04      # alpha tahunan (ubah jadi 0.02!)\nTE = 0.08         # tracking error tahunan\n\nprint(f"{'tahun':>6}{'t-stat':>8}  signifikan?")\nfor T in [1, 3, 5, 10, 15]:\n    # TULIS KODEMU\n    t = \n    print(f"{T:>6}{t:>8.1f}  {'YA' if t > 2 else 'belum'}")\nprint()\nprint("t-stat tumbuh dengan AKAR waktu: butuh 4x lipat waktu")\nprint("untuk 2x keyakinan. Alpha kecil = butuh dekade!")`,
        lockLines: 3,
        solution: `# t-stat alpha vs panjang track record: t = alpha*sqrt(T)/vol_aktif\nimport math\nALPHA = 0.04      # alpha tahunan (ubah jadi 0.02!)\nTE = 0.08         # tracking error tahunan\n\nprint(f"{'tahun':>6}{'t-stat':>8}  signifikan?")\nfor T in [1, 3, 5, 10, 15]:\n    # TULIS KODEMU\n    t = ALPHA*math.sqrt(T)/TE\n    print(f"{T:>6}{t:>8.1f}  {'YA' if t > 2 else 'belum'}")\nprint()\nprint("t-stat tumbuh dengan AKAR waktu: butuh 4x lipat waktu")\nprint("untuk 2x keyakinan. Alpha kecil = butuh dekade!")`,
        checks: [
          { kind: "equal", task: "t1", name: "t", value: 1.9365, tol: 0.01, label: "`t` terakhir (T=15) ≈ 1.94", msg: "0,04×√15/0,08 = 1,94 \u2014 masih < 2! Alpha 4% butuh > 15 tahun agar signifikan." },
          { kind: "stdout_matches", task: "t2", pattern: "15\\s+1\\.9\\s+belum", label: "`print` menampilkan T=15 → 1.9 belum", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Curigai alpha dari periode pendek: t-stat ∝ √T.",
    },
    {
      id: "fama-french",
      eyebrow: "Langkah 5 · Fama-French + chart",
      title: "DNA yang lebih detail",
      prose: [
        "FF3: pasar + SMB (small minus big) + HML (value minus growth). FF5: + RMW (profitabilitas) + CMA (investasi konservatif). Gunanya: bedakan alpha murni dari premi faktor \u2014 yang bisa dibeli murah! CAPM = tes golongan darah (kasar); FF = sekuensing (detail). \u2018Unik\u2019 di tes kasar sering = keturunan umum di tes detail (small-value!).",
        "Dekomposisi gaya CFA: R = 14%; regresi: α 0,5% (t 0,8), β_mkt 1,0, β_SMB 0,8, β_HML 0,6; premi mkt 7%, SMB 3%, HML 4%. Faktor = 1,0×7% + 0,8×3% + 0,6×4% = 7% + 2,4% + 2,4% = 11,8%. Alpha = 14% − 3% − 11,8% = −0,8% (negatif!). Verdict: beta tersamar \u2014 replikasi ETF!",
        "Replikasi \u2018Bintang\u2019: 80% small-value ETF (0,2%) + 20% pasar → return sama, fee 0,2%. Hemat: 1,8%/tahun = Rp180jt per Rp10M. Regresi 10 menit = gaji analis setahun. Kisah nyata: pension fund 2015 hampir hire manajer \u2018bintang\u2019 (fee 2%); analis junior menjalankan regresi → alpha tidak signifikan → batalkan, replikasi ETF → hemat 1,8% × Rp1T = Rp18M/tahun. Junior dipromosikan. Regresi = karier.",
        "Cara membaca: sumbu X = tiga faktor Fama-French; sumbu Y = beta (loading) — sensitivitas return portofolio terhadap tiap faktor. Angka di atas bar = beta; angka di bawah bar = kontribusi ke return (beta × premi faktor).",
        "Interpretasi: portofolio ini 1,0× pasar + 0,8× size + 0,6× value — kontribusinya 7% + 2,4% + 2,4% = 11,8% dari total return 14%, menyisakan alpha −0,8%. Bar SMB dan HML yang tinggi menjelaskan “misteri” alpha +4% manajer Bintang: itu bukan skill, melainkan beta small-value yang sedang bagus — dan bisa direplikasi dengan ETF 0,2%. Bar chart ini adalah kacamata X-ray-nya.",
      ],
      figure: {
        svg: FACTOR_SVG,
        alt: "Bar eksposur faktor: beta pasar 1,0; beta size 0,8; beta value 0,6; kontribusi return 7 persen, 2,4 persen, 2,4 persen.",
        caption: "Eksposur faktor portofolio contoh: 11,8% dari 14% return dijelaskan tiga faktor — alpha yang tersisa −0,8%. Beta tersamar, terbongkar.",
      },
      formula: String.raw`R_p - R_f = \alpha + \beta_m MKT + \beta_s SMB + \beta_v HML + \varepsilon`,
      formulaNote: "SMB, HML = premi faktor (bukan alpha!). Alpha FF = setelah semua faktor dikontrol.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Faktor = alpha.\u2019 Salah. Faktor = beta (premi yang bisa direplikasi murah!). Jika alpha hilang setelah FF → itu beta tersamar. Bayar fee 2% untuk sesuatu yang ETF 0,2% bisa tiru = beta mahal.",
      },
      reference: "Bahkan Buffett = value + quality + low-vol + leverage (Frazzini) \u2014 sebagian \u2018skill\u2019 = faktor; disiplin 50 tahun = skill.",
    },
    {
      id: "style-analysis",
      eyebrow: "Langkah 6 · Style analysis",
      title: "Polisi gaya",
      prose: [
        "Style analysis (Sharpe): regresi return dana ke indeks gaya (large/small × value/growth) dengan bobot ≥ 0, jumlah = 1 → peta gaya + selection return (sisa = skill!). Gunanya: \u2018manajer value\u2019 yang loading-nya growth = style drift \u2014 ketahuan! Seperti tes kepribadian: ngakunya \u2018value investor\u2019 (kata-kata), hasilnya \u2018growth chaser\u2019 (perbuatan). Perbuatan > kata-kata.",
        "Contoh: mandat large-value; style analysis: 60% large-growth! Konfrontasi: \u2018FOMO tech 2020?\u2019 Manajer: \u2018taktis...\u2019 → style drift tanpa persetujuan. Tindakan: peringatan tertulis / ganti. Mandat = kontrak; drift = pelanggaran. Contoh lain: HML loading turun 0,8 → 0,2 \u2014 tidak lagi value! Tanya, monitor kuartalan. Rolling regression: alpha 36 bulan +2%, +1%, 0%, −1%, −2% → tren menurun \u2014 skill memudar? kapasitas? Waspada, review.",
        "Ritual hire manajer: (1) regresi! (2) t-stat! (3) net fee! (4) style! Empat atau tolak. Vignette ujian: A return 15% fee 1,5% α 1% (t 1,2); B return 12% fee 0,5% α 0,5% (t 2,5); C return 13% fee 2% α 2% (t 0,9). Pilih B! \u2014 t 2,5 = signifikan, fee rendah, net positif. A & C = t < 2 = ragu. Return tinggi ≠ pilihan.",
      ],
      tasks: [],
      reference: "Holdings vs returns-based bisa kontradiksi (derivatif? timing?) \u2014 investigasi, jangan percaya satu.",
    },
    {
      id: "minicase-bintang-palsu",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Bintang palsu",
      prose: [
        "Manajer \u2018Bintang\u2019: alpha +4%, fee 2%. Regresi FF: alpha +0,5% (t 0,8), loading SMB/HML tinggi.",
        "(a) Diagnosis: t-stat 1,2 < 2 → tidak signifikan (noise!); R² 0,85 → mirip pasar; setelah FF alpha sisa +0,5% (t 0,8) → beta tersamar. Alpha tanpa t-stat = anecdote. (b) Replikasi: 80% small-value ETF (0,2%) + 20% pasar → return sama; hemat 1,8%/tahun.",
        "(c) Keputusan: pecat atau nego fee ke level ETF+. Jangan bayar 2% untuk beta mahal. (d) Monitoring ke depan: style analysis kuartalan (drift?), rolling alpha (memudar?), t-stat vs track record. Due diligence = 7 cek: regresi, fee, style, track record (min 36 bulan), kapasitas, tim, proses.",
      ],
      tasks: [],
      reference: "Faktor Indonesia: SMB kuat, HML bervariasi \u2014 uji lokal, jangan asal impor AS.",
    },
    {
      id: "beta-stabil",
      eyebrow: "Langkah 8 · Estimasi stabil",
      title: "Beta yang tidak goyang: shrinkage, VIF, Newey-West",
      prose: [
        "Beta OLS dari 60 bulan data punya standard error ~0,2–0,3 — beta “1,2” sesungguhnya bisa 0,9 sampai 1,5. Vasicek shrinkage menarik beta ekstrem ke arah 1,0 (pasar), dengan tarikan proporsional ketidakpastian: β_adj = w×β_OLS + (1−w)×1,0, w = σ²_cross/(σ²_cross + SE²). Contoh: β_OLS = 1,8, SE = 0,5, σ²_cross = 0,09 → w = 0,09/(0,09+0,25) = 0,26 → β_adj = 0,26×1,8 + 0,74×1,0 = 1,21. Klaim “beta 1,8” yang didukung SE 0,5 sebagian besar adalah noise — shrink tanpa ampun. Blume menambahkan fakta kedua: beta mean-revert dari waktu ke waktu — pakai bobot 0,67×β + 0,33×1,0 untuk proyeksi ke depan.",
        "Multicollinearity: di beberapa pasar, SMB dan HML berkorelasi tinggi (value dan size tumpang tindih). Akibatnya loadings “berebut” menjelaskan return yang sama — koefisien tidak bias, tetapi variansnya menggembung (goyang!). Smoke alarm: VIF_j = 1/(1−R²_j) > 5. Perbaikan: buang salah satu, gabungkan, atau orthogonalisasi. Jangan pernah menafsirkan loading individual saat VIF merah — laporkan kombinasinya.",
        "Newey-West: return bulanan saham illiquid ber-autokorelasi — harga yang tidak bergerak berhari-hari (stale price) menciptakan autokorelasi semu. OLS mengasumsikan residual independen; saat asumsi jebol, standard error kekecilan → t-stat kegedean → “alpha signifikan” palsu. Koreksi Newey-West (HAC standard errors) menyesuaikan autokorelasi + heteroskedastisitas. Aturan praktis: data bulanan aset illiquid → selalu Newey-West; jika t-stat alpha jatuh di bawah 2 setelah koreksi, “skill” itu adalah artefak harga basi. Skeptis = selamat.",
      ],
      formula: String.raw`\beta_{adj} = w \cdot \hat{\beta}_{OLS} + (1-w) \cdot 1.0, \quad w = \frac{\sigma^2_{cross}}{\sigma^2_{cross} + SE(\hat{\beta})^2}`,
      formulaNote: "β̂_OLS = beta mentah hasil regresi; SE = standard error-nya (ketidakpastian!); σ²_cross = varians beta antar-saham (tipikal 0,09); w = bobot kepercayaan pada data. SE besar → w kecil → beta ditarik kuat ke 1,0. Contoh: β̂=1,8, SE=0,5 → w=0,26 → β_adj=1,21. Klaim ekstrem butuh bukti ekstrem.",
      tasks: [],
      note: {
        title: "💡 Intuisi: beta itu prakiraan cuaca — bawa payung cadangan",
        body: "Empat heuristik praktisi. Pertama: jangan pernah mengambil keputusan biner dari estimasi titik — beta 1,2 dengan SE 0,3 artinya “kira-kira 1, antara 0,9 dan 1,5”; keputusan leverage dari angka tunggal = judi berkedok analisis. Kedua: semakin jauh beta dari 1,0, semakin curigai — shrink beta ekstrem ke pasar kecuali datanya luar biasa kuat (Vasicek); klaim luar biasa butuh bukti luar biasa. Ketiga: jika dua faktor berkorelasi > 0,7, loading mereka akan “berkelahi” — cek VIF > 5 sebagai alarm asap, lalu buang, gabung, atau orthogonalisasi; menafsirkan loading individual saat multikolinearitas = membaca ampas teh. Keempat: return itu “lengket” (autokorelasi), terutama di saham tipis — t-stat OLS berbohong ke arah optimis; Newey-West adalah sabuk pengaman yang selalu dipakai untuk data bulanan illiquid. Beta yang stabil bukan beta yang “tepat” — melainkan beta yang tidak goyang saat datanya diganggu sedikit.",
      },
      reference: "Shrink dulu, tafsir kemudian. Beta ekstrem + SE besar = noise yang menyamar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Regresi CAPM: pisahkan alpha (intersep) dari beta (slope); alpha tanpa t-stat = anecdote.",
        "|t| > 2 = signifikan; t-stat ∝ √T \u2014 alpha kecil butuh dekade untuk terbukti.",
        "Fama-French: bedakan alpha murni dari premi faktor; faktor = beta yang bisa direplikasi murah.",
        "Style analysis: monitor konsistensi mandat; drift = pelanggaran kontrak.",
        "Bayar hanya untuk alpha net yang signifikan; R² 0,95 + alpha kecil = closet indexer.",
      ],
      next: { label: "D4 \u2014 Backtesting", href: "/v2/learn/pm-d4-backtesting" },
      quiz: [
        {
          q: "R fund 12%, Rf 3%, Rm 10%, β 1,2. Alpha?",
          options: [
            { text: "+2% (12% − 10%)", why: "Salah: itu mengabaikan beta \u2014 fund lebih agresif dari pasar, ekspektasinya lebih tinggi." },
            { text: "+0,6%", why: "Tepat: E(R) = 3% + 1,2×7% = 11,4%; alpha = 12% − 11,4% = +0,6% (kecil!) \u2014 hampir semua = beta.", correct: true },
            { text: "+9% (12% − 3%)", why: "Salah: itu excess return, bukan alpha \u2014 belum dikurangi kompensasi risiko pasar." },
            { text: "0%", why: "Salah: ada sisa +0,6% di atas ekspektasi CAPM \u2014 kecil, tetapi tidak nol." },
          ],
        },
        {
          q: "Alpha +4%, t-stat 1,2. Kesimpulan?",
          options: [
            { text: "Hebat \u2014 hire!", why: "Salah: alpha tanpa t-stat = anecdote. 1,2 < 2 = belum terbukti." },
            { text: "Tidak signifikan \u2014 bisa noise; uji FF dulu", why: "Tepat: |t| < 2 = ragu. Lanjut ke Fama-French: mungkin beta tersamar.", correct: true },
            { text: "Pasti luck", why: "Salah: \u2018tidak signifikan\u2019 ≠ \u2018pasti luck\u2019 \u2014 artinya bukti belum cukup." },
            { text: "Tunggu 1 tahun lagi", why: "Salah: 1 tahun tambahan tidak cukup mengubah t-stat secara material \u2014 butuh track record panjang." },
          ],
        },
        {
          q: "R² 0,95, alpha kecil, fee 1,5%. Verdict?",
          options: [
            { text: "Bagus \u2014 R² tinggi", why: "Salah: R² tinggi = return dijelaskan pasar = closet indexer, bukan skill." },
            { text: "Closet indexer \u2014 pecat / pindah ke pasif", why: "Tepat: bayar fee aktif untuk hasil indeks = beta mahal. Pecat atau nego ke fee pasif.", correct: true },
            { text: "Tambah alokasi", why: "Salah: menambah alokasi ke closet indexer = membayar lebih untuk beta." },
            { text: "Tunggu alpha muncul", why: "Salah: R² 0,95 berarti hampir tidak ada ruang untuk alpha muncul." },
          ],
        },
        {
          q: "Tiga manajer: A (α 1%, t 1,2, fee 1,5%), B (α 0,5%, t 2,5, fee 0,5%), C (α 2%, t 0,9, fee 2%). Pilih?",
          options: [
            { text: "A \u2014 return tertinggi", why: "Salah: return 15% dengan t 1,2 = belum terbukti skill." },
            { text: "B \u2014 alpha signifikan + fee rendah", why: "Tepat: t 2,5 = signifikan (95%), fee 0,5%, net positif. Return tinggi ≠ pilihan.", correct: true },
            { text: "C \u2014 alpha terbesar", why: "Salah: alpha 2% dengan t 0,9 = anecdote + fee 2% termahal." },
            { text: "Tidak ada", why: "Salah: B lolos tiga saringan (signifikan, fee wajar, net positif)." },
          ],
        },
        {
          q: "Alpha CAPM +4% hilang menjadi +0,5% setelah kontrol SMB/HML. Artinya?",
          options: [
            { text: "Manajer hebat \u2014 alpha murni", why: "Salah: alpha murni justru yang tersisa setelah kontrol \u2014 hanya +0,5% (t 0,8)." },
            { text: "Beta tersamar \u2014 replikasi dengan ETF faktor", why: "Tepat: 3,5 poin = premi faktor small-value. Replikasi ETF 0,2%, hemat 1,8%/tahun.", correct: true },
            { text: "Model FF salah", why: "Salah: hilangnya alpha setelah kontrol faktor = bukti faktor, bukan kesalahan model." },
            { text: "Naikkan fee", why: "Salah: temuan ini justru alasan nego fee turun, bukan naik." },
          ],
        },
        {
          q: "β_OLS = 1,8, SE = 0,5, σ²_cross = 0,09. Beta Vasicek-shrunk?",
          options: [
            { text: "≈1,21", why: "Tepat: w = 0,09/(0,09+0,25) = 0,26; β = 0,26×1,8 + 0,74×1,0 = 1,21. Klaim ekstrem + SE besar = shrink kuat.", correct: true },
            { text: "1,8 — pakai apa adanya", why: "Salah: SE 0,5 = ketidakpastian besar; beta mentah terlalu berani." },
            { text: "1,0 — buang total", why: "Salah: shrink ≠ buang; w = 0,26 masih memberi bobot pada data." },
            { text: "2,1 — tambah margin keamanan", why: "Salah: menambah justru memperbesar kesalahan estimasi, bukan mengoreksi." },
          ],
        },
        {
          q: "Alpha t-stat 2,3 (OLS) → 1,4 setelah koreksi Newey-West. Kesimpulan?",
          options: [
            { text: "Tetap signifikan — 1,4 dekat 2", why: "Salah: ambang 95% = 2; “dekat” bukan signifikan." },
            { text: "Tidak signifikan — autokorelasi (stale price) menggelembungkan t-stat OLS", why: "Tepat: return lengket → SE OLS kekecilan → t-stat palsu. Newey-West membongkarnya.", correct: true },
            { text: "Ganti ke data harian", why: "Salah: data harian justru lebih berisik dan lebih berautokorelasi (bid-ask bounce)." },
            { text: "Naikkan leverage — alpha masih positif", why: "Salah: alpha tidak terbukti + leverage = memperbesar taruhan atas noise." },
          ],
        },
      ],
    },
  ],
};

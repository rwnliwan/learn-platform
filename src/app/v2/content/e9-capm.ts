import type { V2Lesson } from "../lib/types";

export const e9: V2Lesson = {
  slug: "e9-capm",
  track: "Financial Markets",
  module: "Teori Portofolio",
  title: "E9. CAPM, Beta & Alpha",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-dua-saham",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dua saham, satu return 15%: sama bagusnya?",
      prose: [
        "Dua saham sama-sama return 15% tahun ini. Saham TENANG bergerak pelan mengikuti pasar. Saham LIAR naik-turun 3× lipat pasar — investornya sempat minus 30% di tengah tahun. Return sama — apakah keduanya “sama bagusnya”? Tidak. Pemegang LIAR menanggung risiko sistematis jauh lebih besar — dan seharusnya dituntut return lebih tinggi sebagai kompensasi.",
        "Beta mengukur sensitivitas return saham terhadap return pasar: β = Cov(R_i, R_m)/Var(R_m). Praktisnya = kemiringan garis regresi return saham vs return pasar. β > 1 = agresif; 0 < β < 1 = defensif; β < 0 = bergerak berlawanan pasar. Hitung beta saham bank dari 12 bulan data.",
      ],
      formula: String.raw`\beta_i = \frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}`,
      formulaNote: "R_i = return saham; R_m = return pasar (mis. IHSG). Beta hanya menangkap risiko sistematis.",
      tasks: [
        { id: "t1", text: "Hitung `beta` saham dari data return bulanan" },
        { id: "t2", text: "Tentukan `sifat` (\"agresif\" jika beta > 1, \"defensif\" jika < 1)" },
      ],
      expected: "beta=1.60  sifat=agresif",
      note: {
        title: "Sering salah",
        body: "Mengira beta mengukur total risiko saham. Beta hanya menangkap risiko sistematis (yang searah pasar) — risiko idiosinkratik tidak tertangkap beta.",
      },
      hints: [
        "beta = kovarians(pasar, saham) / variansi(pasar).",
        "Kovarians = rata-rata dari (pasar−mean_pasar)×(saham−mean_saham).",
        "sifat = \"agresif\" if beta > 1 else \"defensif\"",
      ],
      code: {
        starter: `pasar = [2.0, -1.5, 3.0, 1.0, -2.0, 2.5, 0.5, -1.0, 1.5, 2.0, -0.5, 1.0]\nsaham = [3.2, -2.6, 4.8, 1.5, -3.1, 3.9, 0.8, -1.7, 2.4, 3.1, -0.9, 1.6]\n\n# TULIS KODEMU: beta = cov / var_pasar\nn = len(pasar)\nmp = sum(pasar) / n\nms = sum(saham) / n\ncov = \nvar_pasar = \nbeta = \nsifat = \n\nprint(f"beta={beta:.2f}  sifat={sifat}")`,
        lockLines: 2,
        solution: `pasar = [2.0, -1.5, 3.0, 1.0, -2.0, 2.5, 0.5, -1.0, 1.5, 2.0, -0.5, 1.0]\nsaham = [3.2, -2.6, 4.8, 1.5, -3.1, 3.9, 0.8, -1.7, 2.4, 3.1, -0.9, 1.6]\n\n# TULIS KODEMU: beta = cov / var_pasar\nn = len(pasar)\nmp = sum(pasar) / n\nms = sum(saham) / n\ncov = sum((pasar[i]-mp)*(saham[i]-ms) for i in range(n)) / n\nvar_pasar = sum((x-mp)**2 for x in pasar) / n\nbeta = cov / var_pasar\nsifat = "agresif" if beta > 1 else "defensif"\n\nprint(f"beta={beta:.2f}  sifat={sifat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "beta", value: 1.6, tol: 0.01, label: "`beta` sekitar 1,60", msg: "Cov/var = 3,91/2,44 = 1,60. Saham bergerak 1,6× pasar." },
          { kind: "stdout_matches", task: "t2", pattern: "sifat=agresif", label: "Sifat = agresif", msg: "Beta > 1 = agresif — dua arah: pasar +10% → saham ≈ +16%, pasar −10% → ≈ −16%." },
        ],
      },
      reference: "Beta = pengali guncangan pasar. >1 agresif, <1 defensif — dua arah!",
    },
    {
      id: "capm",
      eyebrow: "Langkah 2 · CAPM",
      title: "Daftar harga risiko: return pantas untuk tiap beta",
      prose: [
        "Capital Asset Pricing Model: E[R_i] = R_f + β_i × (E[R_m] − R_f). R_f = risk-free (SBN, “gaji pokok” semua investasi); β = beta; (E[R_m] − R_f) = premi risiko pasar. SBN 6%, ekspektasi IHSG 12%, beta saham 1,5 → E[R] = 6% + 1,5 × 6% = 15%.",
        "Alpha = return aktual − return pantas: “kemenangan murni” setelah dikoreksi risiko. Saham agresif return aktual 16% → alpha = 16% − 15% = +1%. Hitung return pantas untuk beta 0,6 / 1,0 / 1,5 dan alpha-nya.",
      ],
      formula: String.raw`E[R_i] = R_f + \beta_i \times (E[R_m] - R_f) \qquad \alpha_i = R_{\text{aktual}} - E[R_i]`,
      formulaNote: "E[R_i] = return ekspektasi aset i (return “pantas”); R_f = risk-free (SBN); β_i = beta; E[R_m] − R_f = premi risiko pasar. α_i (alpha) = R_aktual − E[R_i] = “kemenangan murni” setelah koreksi risiko. Contoh: R_f 6%, E[R_m] 12%, β 1,5 → E[R] = 6% + 1,5×6% = 15%; aktual 16% → α = +1%.",
      tasks: [
        { id: "t1", text: "Hitung `er_agresif` (beta 1,5) dalam desimal" },
        { id: "t2", text: "Hitung `alpha` jika return aktual 16%" },
      ],
      expected: "er_agresif=0.15  alpha=0.01",
      note: {
        title: "Sering salah",
        body: "Menilai manajer dari return mentah. Return 24% dengan beta 1,8 = bukan keahlian, melainkan risiko. Nilai manajer dari alpha — return mentah = brosur marketing.",
      },
      hints: [
        "Premi pasar = 12% − 6% = 6%. E[R] = 6% + beta × 6%.",
        "alpha = aktual − pantas, dalam desimal.",
        "alpha = 0.16 - er_agresif",
      ],
      code: {
        starter: `Rf = 0.06  # SBN\nRm = 0.12  # ekspektasi pasar\npremi = Rm - Rf\naktual = 0.16\n\n# TULIS KODEMU: return pantas beta 1,5 dan alpha-nya\ner_agresif = \nalpha = \n\nprint(f"er_agresif={er_agresif:.2f}  alpha={alpha:+.2f}")`,
        lockLines: 4,
        solution: `Rf = 0.06  # SBN\nRm = 0.12  # ekspektasi pasar\npremi = Rm - Rf\naktual = 0.16\n\n# TULIS KODEMU: return pantas beta 1,5 dan alpha-nya\ner_agresif = Rf + 1.5 * premi\nalpha = aktual - er_agresif\n\nprint(f"er_agresif={er_agresif:.2f}  alpha={alpha:+.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "er_agresif", value: 0.15, tol: 1e-9, label: "`er_agresif` seharusnya 0,15", msg: "6% + 1,5 × 6% = 15%. Setiap 0,5 beta “bernilai” 3% return ekspektasi." },
          { kind: "equal", task: "t2", name: "alpha", value: 0.01, tol: 1e-9, label: "`alpha` seharusnya +0,01", msg: "16% − 15% = +1%. Satu tahun +1% bisa jadi keberuntungan — alpha butuh track record." },
          { kind: "stdout_matches", task: "t2", pattern: "alpha=\\+0\\.01", label: "`print` menampilkan alpha", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Return pantas = Rf + β × premi pasar. Di bawah ini = kemahalan.",
    },
    {
      id: "sml-famafrench",
      eyebrow: "Langkah 3 · SML & model faktor",
      title: "Di atas atau di bawah garis?",
      prose: [
        "Gambarkan CAPM sebagai garis (Security Market Line): sumbu X = beta, sumbu Y = expected return. Saham tepat di garis = wajar. Di atas garis = undervalued (alpha positif). Di bawah garis = mahal/kinerja buruk meski return terlihat tinggi.",
        "Masalah CAPM: beta saja tidak cukup menjelaskan return. Saham kecil (size) dan murah (value) cenderung memberi return lebih tinggi dari prediksi CAPM. Solusi: Fama-French 3-faktor — tambah premi size (SMB) dan value (HML). CAPM = “satu rasa”; Fama-French = “menu 3 rasa”.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Waspada “alpha” yang ternyata beta tersamar: banyak klaim keahlian manajer ternyata cuma eksposur ke faktor size/value yang tidak diakui. Tanya: sudah dikoreksi faktor?",
      },
      reference: "SML = daftar harga risiko. Fama-French: return = kompensasi multi-risiko.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang beta dan return pantas.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Beta saham = 1,5. Pasar naik 10%. Perkiraan return saham?",
          options: [
            { text: "10%", why: "Salah: itu jika beta = 1." },
            { text: "15% (1,5 × 10%)", why: "Benar: beta = pengali guncangan pasar — berlaku dua arah.", correct: true },
            { text: "6,7%", why: "Salah: itu 10%/1,5 — beta mengalikan, bukan membagi." },
            { text: "Tidak berhubungan", why: "Salah: beta justru mengukur hubungannya dengan pasar." },
          ],
        },
        {
          q: "Rf=6%, E[Rm]=12%, β=1,5. Expected return pantas?",
          options: [
            { text: "12%", why: "Salah: itu return pasarnya (beta 1), bukan untuk beta 1,5." },
            { text: "18%", why: "Salah: itu 12% + 6% — premi tidak ditambah mentah ke Rm." },
            { text: "15% (6% + 1,5×6%)", why: "Benar: premi pasar 6% × 1,5 = 9% + 6% pokok.", correct: true },
            { text: "9%", why: "Salah: itu cuma kompensasi risikonya — lupa “gaji pokok” Rf." },
          ],
        },
      ],
    },
    {
      id: "minicase-manajer",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Manajer “hebat”?",
      prose: [
        "Manajer X: return 24% tahun ini, beta 1,8. Manajer Y: return 15%, beta 0,9. Risk-free 6%, return pasar 14%. X beriklan: “Return kami 60% lebih tinggi dari Y!”",
        "Pertanyaan: (a) Hitung return pantas dan alpha keduanya. Siapa sebenarnya lebih baik? (b) Jika tahun depan pasar turun 10%, perkirakan return keduanya. (c) Pelajaran untuk memilih reksa dana?",
        "Pembahasan: (a) Premi pasar = 8%. Pantas X = 6% + 1,8×8% = 20,4% → alpha X = +3,6%. Pantas Y = 6% + 0,9×8% = 13,2% → alpha Y = +1,8%. X tetap menang — tapi keunggulannya jauh lebih kecil dari klaim iklan. (b) Pasar −10%: X ≈ 6% + 1,8×(−16%) = −22,8%; Y ≈ 6% + 0,9×(−16%) = −8,4%. Inilah harga beta X di tahun buruk. (c) Jangan beli return mentah — beli alpha per unit beta yang sanggup kamu tahan. Sesuaikan dengan toleransi drawdown-mu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Beta tinggi = return tinggi di tahun bagus DAN kehancuran di tahun buruk. Pilih manajer (dan beta) yang drawdown-nya sanggup kamu tahan — bukan yang return-nya paling heboh.",
      },
      reference: "Nilai manajer dari alpha, bukan return mentah. Beta = harga yang dibayar dua arah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Memakai beta dengan benar: empat skenario",
      prose: [
        "Yakin pasar akan naik → beta > 1 (agresif): naik 10% pasar → ~15% portofolio. Takut pasar jatuh tapi harus tetap invest → beta < 1 (defensif): pasar −10% → portofolio ≈ −6%. Menilai manajer investasi → bandingkan alpha, bukan return.",
        "Menetapkan required return untuk valuasi → CAPM, bukan angka asal: r = Rf + β×premi pasar memberi argumen terstruktur; “pakai 12% saja” = firasat.",
        "Aturan 10 detik: beta = pengali guncangan pasar, >1 agresif, <1 defensif — dua arah! Return pantas = Rf + β × premi pasar. Di bawah ini = kemahalan.",
      ],
      tasks: [],
      reference: "Bullish → beta > 1. Waspada → beta < 1. Valuasi → CAPM untuk required return.",
    },
    {
      id: "capm-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: beta & faktor",
      title: "Beta yang goyang: Vasicek, Blume, dan dunia multi-faktor",
      prose: [
        "Beta dari regresi historis itu berisik: standard error 0,4 untuk beta 1,8 berarti “tebakan berani”, bukan “pengukuran”. Vasicek (1973) menawarkan rem: susutkan beta mentah ke arah 1,0 (rata-rata pasar) — β_adj = w·β_raw + (1−w)·1,0, dengan w mengecil saat estimasimu makin berisik. Blume (1975) menemukan beta cenderung menuju 1 seiring waktu — praktisinya memakai β_adj = 0,67·β + 0,33. Pesannya sama: jangan percaya beta mentah bulat-bulat.",
        "Lalu CAPM-nya sendiri retak. Fama-French (1993) menunjukkan return saham dijelaskan tiga faktor: pasar, size (SMB — small minus big), dan value (HML — high minus low book-to-market); Carhart menambah momentum. “Alpha” manajer yang pamer di CAPM satu faktor sering lenyap begitu dikontrol faktor value dan size — ia bukan jagoan, ia cuma tanpa sadar bertaruh pada saham murah dan kecil.",
        "Anomali paling mengganggu: low-beta anomaly — saham beta RENDAH justru memberi return risk-adjusted LEBIH TINGGI dari prediksi CAPM, konsisten di banyak negara. Penjelasannya behavioral: investor terobsesi lotre (saham beta tinggi = tiket lotre), membuat harganya kemahalan. CAPM tetap berguna sebagai bahasa — tetapi sebagai ramalan presisi, ia bocor.",
        "Aturan praktis: (1) beta mentah wajib disusutkan (Vasicek/Blume) sebelum dipakai; (2) alpha = return − SEMUA faktor relevan, bukan cuma pasar; (3) beta berubah tiap rezim — estimasi ulang tiap 1–2 tahun, dan curigai beta saham yang baru IPO atau baru restrukturisasi.",
      ],
      formula: String.raw`\beta_{adj} = w \cdot \beta_{raw} + (1-w) \cdot 1{,}0 \qquad w = \frac{\sigma^2_{cross}}{\sigma^2_{\beta} + \sigma^2_{cross}}`,
      formulaNote: "β_adj = beta setelah shrinkage; β_raw = beta mentah dari regresi; w = bobot kepercayaan (0–1); σ²_β = varians estimasi betamu; σ²_cross = varians beta antar saham. Makin berisik estimasimu (σ²_β besar), makin kecil w — beta ditarik ke 1,0. Contoh: β_raw 1,8, w 0,36 → β_adj = 0,36×1,8 + 0,64×1,0 = 1,29.",
      tasks: [
        { id: "t1", text: "Hitung `w` (bobot kepercayaan Vasicek)" },
        { id: "t2", text: "Hitung `beta_adj` (beta setelah shrinkage)" },
      ],
      expected: "w=0.36  beta_adj=1.288",
      hints: [
        "w = se_cross² ÷ (se_beta² + se_cross²).",
        "beta_adj = w×beta_raw + (1−w)×1,0.",
      ],
      code: {
        starter: `beta_raw = 1.8\nse_beta = 0.4    # standard error estimasi beta\nse_cross = 0.3   # sebaran beta antar saham\n\n# TULIS KODEMU: w dan beta_adj\nw = \nbeta_adj = \n\nprint(f"w={w:.2f}  beta_adj={beta_adj:.3f}")`,
        lockLines: 3,
        solution: `beta_raw = 1.8\nse_beta = 0.4    # standard error estimasi beta\nse_cross = 0.3   # sebaran beta antar saham\n\n# TULIS KODEMU: w dan beta_adj\nw = se_cross**2 / (se_beta**2 + se_cross**2)\nbeta_adj = w * beta_raw + (1 - w) * 1.0\n\nprint(f"w={w:.2f}  beta_adj={beta_adj:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w", value: 0.36, tol: 0.001, label: "`w` seharusnya 0,36", msg: "0,09 ÷ 0,25 = 0,36. Estimasi berisik → kepercayaan rendah." },
          { kind: "equal", task: "t2", name: "beta_adj", value: 1.288, tol: 0.001, label: "`beta_adj` seharusnya 1,288", msg: "0,36×1,8 + 0,64×1,0 = 1,288. Beta 1,8 “disusutkan” ke 1,29." },
          { kind: "stdout_matches", task: "t2", pattern: "w=0\\.36\\s+beta_adj=1\\.288", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: beta = masa lalu yang disusutkan",
        body: "Beta mengukur “kalau pasar batuk, saham ini flu seberapa parah” — tetapi ia dihitung dari masa lalu yang belum tentu terulang. Empat heuristik. Pertama: beta 1,8 dengan standard error 0,4 artinya rentang keyakinanmu kira-kira 1,0–2,6 — itu bukan angka, itu puisi; susutkan (Vasicek/Blume) sebelum dipakai. Kedua: prior terbaik untuk beta yang tidak kamu ketahui = 1,0 (ikut pasar) — butuh bukti kuat untuk mengklaim beda; kerendahan hati statistik mengalahkan keberanian buta. Ketiga: alpha tanpa kontrol faktor = ilusi — manajer “hebat” dengan alpha +3% di CAPM bisa jadi cuma pemilik saham-saham value kecil yang sedang musimnya; uji dengan Fama-French sebelum membayar fee mahal. Keempat: beta hidup — leverage berubah, model bisnis berubah, beta ikut berubah; estimasi ulang tiap 1–2 tahun, dan curigai beta saham yang baru IPO atau baru restrukturisasi karena “masa lalu”-nya belum ada. Aturan 10 detiknya: beta > 1,5 atau < 0,5 dari regresi 2 tahun = curigai dulu, baru pakai.",
      },
      reference: "Beta mentah = tebakan berisik. Susutkan ke 1,0. Alpha = setelah semua faktor.",
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
        "Beta = Cov(R_i,R_m)/Var(R_m) — pengali guncangan pasar; >1 agresif, <1 defensif, dua arah.",
        "CAPM: E[R] = R_f + β(E[R_m]−R_f) — daftar harga risiko; beta hanya menghargai risiko sistematis.",
        "Alpha = return aktual − return pantas — kemenangan murni setelah koreksi risiko.",
        "Fama-French menambah faktor size (SMB) & value (HML) — return = kompensasi multi-risiko.",
        "CAPM = kompas, bukan GPS: beta tak stabil, pasar tak terobservasi sempurna.",
      ],
      next: { label: "E10 — Derivatif", href: "/learn/e10-derivatif" },
      quiz: [
        {
          q: "Manajer return 24% (β=1,8), manajer lain 15% (β=0,9). Rf=6%, Rm=14%. Mana alpha lebih besar?",
          options: [
            { text: "Yang 24% — jelas", why: "Salah arah benar, alasan salah: bukan karena return mentahnya, tapi karena alphanya." },
            { text: "Yang 15% — beta kecil", why: "Salah: alphanya +1,8% < +3,6%." },
            { text: "Yang 24%: alpha +3,6% vs +1,8% — tapi selisihnya jauh lebih kecil dari selisih return mentah", why: "Benar: return mentah melebih-lebihkan keunggulan karena tidak mengoreksi beta.", correct: true },
            { text: "Sama saja", why: "Salah: alphanya berbeda jelas." },
          ],
        },
        {
          q: "Saham ber-beta negatif (misal −0,3) berguna untuk…",
          options: [
            { text: "Spekulasi", why: "Salah: beta negatif = bergerak berlawanan pasar, bukan alat spekulasi arah." },
            { text: "Diversifikasi — cenderung naik saat pasar jatuh (hedge alami)", why: "Benar: peredam portofolio saat krisis (misal emas).", correct: true },
            { text: "Tidak ada gunanya", why: "Salah: justru berguna sebagai penyeimbang." },
            { text: "Menjamin untung", why: "Salah: tidak ada yang menjamin untung." },
          ],
        },
        {
          q: "Keterbatasan CAPM yang paling praktis?",
          options: [
            { text: "Rumusnya terlalu sulit", why: "Salah: rumusnya satu baris — masalahnya di inputnya." },
            { text: "Beta tidak stabil & “pasar” tak terobservasi sempurna — pakai sebagai kompas, bukan GPS", why: "Benar: beta berubah tiap periode dan IHSG ≠ pasar sejati.", correct: true },
            { text: "Tidak ada yang memakai CAPM", why: "Salah: CAPM dipakai luas untuk required return dan evaluasi kinerja." },
            { text: "CAPM selalu tepat", why: "Salah: justru keterbatasannya yang harus diingat." },
          ],
        },
      ],
    },
  ],
};

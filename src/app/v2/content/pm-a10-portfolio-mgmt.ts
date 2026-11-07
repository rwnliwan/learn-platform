import type { V2Lesson } from "../lib/types";

const FRONTIER_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Efficient frontier melengkung, garis CAL dari Rf menyinggungnya di portofolio optimal, dan satu titik tak efisien di bawah kurva.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">16</text><text x="54" y="74">12</text><text x="54" y="124">8</text><text x="54" y="174">4</text><text x="54" y="224">0</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">E(R) (%)</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0</text><text x="148" y="240">5</text><text x="236" y="240">10</text><text x="324" y="240">15</text><text x="412" y="240">20</text><text x="500" y="240">25%</text></g>
<polyline points="201,133 218,125 236,114 254,100 280,84 306,70 333,55 359,43 386,33 412,24" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="60" y1="170" x2="447" y2="13" stroke="var(--c4)" stroke-width="2"/>
<circle cx="60" cy="170" r="4" fill="var(--c4)"/>
<text x="52" y="174" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">Rf</text>
<circle cx="306" cy="70" r="5.5" fill="var(--c2)"/>
<text x="316" y="56" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">portofolio optimal</text>
<text x="392" y="50" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">frontier efisien</text>
<text x="80" y="156" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">CAL/CML</text>
<circle cx="280" cy="130" r="4" fill="var(--chart-text)" opacity="0.6"/>
<text x="280" y="148" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">tak efisien</text>
<text x="280" y="252" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">risiko σ (%) →</text>
</svg>`;

export const pma10: V2Lesson = {
  slug: "pm-a10-portfolio-mgmt",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A10 Portfolio Management: Diversifikasi, CAPM & IPS",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Return vs Risiko",
      title: "Dua sepupu, satu angka, nasib berbeda",
      prose: [
        "Rudi: all-in Rp100 juta di satu saham tambang, expected return 15%. Sinta: Rp50 juta saham tambang + Rp50 juta consumer goods, expected return juga 15%. Setahun krisis komoditas: Rudi \u221225%, Sinta \u22128%. Padahal semua angka di atas kertas identik: return harapan 15%, volatilitas masing-masing 30%.",
        "Twist-nya: Sinta memegang satu angka yang luput dari Rudi — korelasi 0,2 antara tambang dan consumer goods. Saat tambang jatuh, consumer goods menahan; guncangannya saling meniadakan. Rudi berasumsi \u201cdua saham = setengah risiko\u201d. Matematika berkata lain: risiko portofolio bukan rata-rata risiko — ia ditentukan oleh korelasi.",
        "Return portofolio = rata-rata tertimbang (linear). Risiko portofolio = punya suku korelasi (nonlinear). Investor dibayar untuk return, tetapi bertahan hidup karena mengelola risiko.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Korelasi 0,2 dihitung dari data historis tenang. Saat krisis sistemik, korelasi melonjak mendekati 1 (correlation breakdown) — justru saat diversifikasi paling dibutuhkan. Uji portofoliomu dengan stress test, bukan cuma data manis.",
      },
      reference: "Return linear; risiko kuadratik. Korelasi menentukan segalanya.",
    },
    {
      id: "diversifikasi",
      eyebrow: "Langkah 2 · Diversifikasi",
      title: "Satu-satunya makan siang gratis",
      prose: [
        "\u03c3_p\u00b2 = w1\u00b2\u03c31\u00b2 + w2\u00b2\u03c32\u00b2 + 2w1w2\u03c1\u03c31\u03c32. Sinta: w1 = w2 = 0,5; \u03c31 = \u03c32 = 30%; \u03c1 = 0,2. \u03c3_p\u00b2 = 0,0225 + 0,0225 + 0,009 = 0,054 \u2192 \u03c3_p = 23,2% (dari 30%). Return harapan tetap 15%. Risiko turun 23% tanpa mengorbankan return.",
        "Jika \u03c1 = 0,9: \u03c3_p = 29,2% (hampir tidak membantu). Jika \u03c1 = 1: tidak ada manfaat sama sekali. Risiko terbagi dua: sistematis (pasar — tidak bisa didiversifikasi) vs idiosinkratis (spesifik — bisa). Sekitar 30 saham menghilangkan hampir semua risiko idiosinkratis.",
      ],
      formula: String.raw`\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2`,
      formulaNote: "w = bobot tiap aset (0,5); σ = volatilitas tiap aset (30% = 0,30); ρ = korelasi keduanya (0,2). Interpretasi: dua suku pertama adalah “risiko rata-rata”, suku ketiga (korelasi) adalah “diskon diversifikasi” — ρ < 1 selalu memberi potongan risiko di bawah rata-rata tertimbang. Contoh angka: 0,25×0,09 + 0,25×0,09 + 2×0,25×0,2×0,09 = 0,054 → σ_p = √0,054 = 23,2% (dari 30%, return harapan tetap 15%).",
      tasks: [
        { id: "t1", text: "Hitung `var_p` portofolio Sinta (w=50/50, \u03c3=30%, \u03c1=0,2)" },
        { id: "t2", text: "Hitung `sig_p` = akar var_p, cetak dalam persen 1 desimal" },
      ],
      expected: "sig_p=23.2%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira risiko portofolio = rata-rata volatilitas (30%). Rumusnya punya suku silang korelasi — \u03c1 < 1 selalu menurunkan risiko di bawah rata-rata tertimbang.",
      },
      hints: [
        "var_p = w1\u00b2\u03c31\u00b2 + w2\u00b2\u03c32\u00b2 + 2\u00d7w1\u00d7w2\u00d7\u03c1\u00d7\u03c31\u00d7\u03c32.",
        "sig_p = var_p**0.5.",
        "var_p = w1**2*s1**2 + w2**2*s2**2 + 2*w1*w2*rho*s1*s2\nsig_p = var_p**0.5",
      ],
      code: {
        starter: `w1, w2, s1, s2, rho = 0.5, 0.5, 0.30, 0.30, 0.2\n\n# TULIS KODEMU\nvar_p = \nsig_p = \n\nprint(f"sig_p={sig_p*100:.1f}%")`,
        lockLines: 1,
        solution: `w1, w2, s1, s2, rho = 0.5, 0.5, 0.30, 0.30, 0.2\n\n# TULIS KODEMU\nvar_p = w1**2*s1**2 + w2**2*s2**2 + 2*w1*w2*rho*s1*s2\nsig_p = var_p**0.5\n\nprint(f"sig_p={sig_p*100:.1f}%")`,
        checks: [
          { kind: "equal", task: "t2", name: "sig_p", value: 0.2324, tol: 0.002, label: "`sig_p` sekitar 0.232", msg: "\u221a0,054 = 23,2%. Jangan lupa akarkan variansnya." },
          { kind: "stdout_matches", task: "t2", pattern: "sig_p=23\\.2%", label: "`print` menampilkan persen", msg: "Format persen: sig_p=23.2%." },
        ],
      },
      reference: "\u03c1 < 1 \u2192 diversifikasi bekerja. ~30 saham menghilangkan risiko idiosinkratis.",
    },
    {
      id: "minvar",
      eyebrow: "Langkah 3 · Bobot Optimal",
      title: "Berapa porsi ideal tiap aset?",
      prose: [
        "Dua aset, \u03c31 = 20%, \u03c32 = 30%, \u03c1 = 0,3. Bobot minimum-variance: w1* = (\u03c32\u00b2 \u2212 \u03c1\u03c31\u03c32)/(\u03c31\u00b2 + \u03c32\u00b2 \u2212 2\u03c1\u03c31\u03c32) = (0,09 \u2212 0,018)/(0,04 + 0,09 \u2212 0,036) = 0,072/0,094 = 0,766.",
        "Artinya: 76,6% di aset 1 (yang lebih stabil), 23,4% di aset 2. Aset berisiko rendah mendapat bobot lebih besar — tetapi korelasi positif 0,3 menggesernya dari 100%.",
      ],
      formula: String.raw`w_1^* = \frac{\sigma_2^2 - \rho\sigma_1\sigma_2}{\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2}`,
      formulaNote: "σ1/σ2 = volatilitas aset 1/2 (20%/30%); ρ = korelasi (0,3). Interpretasi: bobot minimum-variance adalah fungsi eksak dari volatilitas dan korelasi — bukan tebakan 50/50; aset yang lebih stabil mendapat porsi lebih besar, tetapi korelasi positif menggesernya dari 100%. Contoh angka: (0,09 − 0,018)/(0,04 + 0,09 − 0,036) = 0,072/0,094 = 76,6% di aset 1.",
      tasks: [
        { id: "t1", text: "Hitung `w1` bobot minimum-variance (\u03c31=20%, \u03c32=30%, \u03c1=0,3)" },
        { id: "t2", text: "Cetak 3 desimal" },
      ],
      expected: "w1=0.766",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjawab 50/50 atau 100% di aset stabil. Bobot optimal bukan tebakan — ia fungsi eksak dari volatilitas dan korelasi.",
      },
      hints: [
        "Ikuti rumus: pembilang = \u03c32\u00b2 \u2212 \u03c1\u00d7\u03c31\u00d7\u03c32.",
        "Penyebut = \u03c31\u00b2 + \u03c32\u00b2 \u2212 2\u00d7\u03c1\u00d7\u03c31\u00d7\u03c32.",
        "w1 = (s2**2 - rho*s1*s2) / (s1**2 + s2**2 - 2*rho*s1*s2)",
      ],
      code: {
        starter: `s1, s2, rho = 0.20, 0.30, 0.3\n\n# TULIS KODEMU\nw1 = \n\nprint(f"w1={w1:.3f}")`,
        lockLines: 1,
        solution: `s1, s2, rho = 0.20, 0.30, 0.3\n\n# TULIS KODEMU\nw1 = (s2**2 - rho*s1*s2) / (s1**2 + s2**2 - 2*rho*s1*s2)\n\nprint(f"w1={w1:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w1", value: 0.766, tol: 0.002, label: "`w1` sekitar 0.766", msg: "0,072/0,094 = 0,766. Cek penyebut: ada faktor 2 di suku korelasi." },
          { kind: "stdout_matches", task: "t2", pattern: "w1=0\\.766", label: "`print` menampilkan w1", msg: "Format 3 desimal: w1=0.766." },
        ],
      },
      reference: "Bobot min-variance = fungsi volatilitas & korelasi, bukan tebakan.",
    },
    {
      id: "capm",
      eyebrow: "Langkah 4 · CAPM & SML + chart",
      title: "Harga risiko: berapa return yang wajar?",
      prose: [
        "CAPM: E(R_i) = R_f + \u03b2_i[E(R_m) \u2212 R_f]. Beta = risiko sistematis (sensitivitas ke pasar), diestimasi dari regresi return saham terhadap return pasar (kemiringan garis regresinya = beta). \u03b2 = 1: ikut pasar; > 1: agresif; < 1: defensif.",
        "Contoh: R_f = 4%, market risk premium = 5%, saham Q \u03b2 = 1,4, forecast analis 12%. Required = 4% + 1,4\u00d75% = 11%. Alpha = 12% \u2212 11% = +1% \u2192 di atas SML \u2192 undervalued \u2192 BELI. SML = garis E(R) vs \u03b2; aset di atasnya = return > wajar untuk risikonya.",
        "Pasar hanya membayar \u2018upah\u2019 untuk risiko yang tidak bisa didiversifikasi (sistematis). Risiko idiosinkratis = kerja bakti — tidak dibayar, jadi diversifikasikan saja. CML untuk portofolio efisien (risiko total); SML untuk semua sekuritas (beta).",
        "Cara membaca: sumbu X = risiko total σ (%), sumbu Y = return harapan E(R) (%); kurva = efficient frontier (portofolio terbaik untuk tiap level risiko); garis lurus dari Rf = CAL/CML.",
        "Interpretasi: garis CAL menyinggung frontier tepat di portofolio optimal — kombinasi Rf + portofolio tangen ini mendominasi semua portofolio lain: untuk risiko berapa pun, tidak ada yang memberi E(R) lebih tinggi. Titik di bawah kurva = portofolio tak efisien. Rf = 4% sesuai contoh CAPM di teks.",
      ],
      figure: {
        svg: FRONTIER_SVG,
        alt: "Efficient frontier melengkung, garis CAL dari Rf menyinggungnya di portofolio optimal, dan satu titik tak efisien di bawah kurva.",
        caption: "Ilustrasi konsep dari teks: CML untuk portofolio efisien (risiko total σ), SML untuk sekuritas individual (beta). Pesan konstruksinya: pilih di frontier, bukan di bawahnya — dan waspadai estimation error yang membuat optimizer menjadi 'error maximizer'.",
      },
      formula: String.raw`E(R_i) = R_f + \beta_i\,[E(R_m) - R_f] \quad;\quad \alpha = R_{\text{aktual}} - E(R_i)`,
      formulaNote: "R_f = risk-free rate (4%); β = sensitivitas saham ke pasar (1,4 — agresif); E(R_m) − R_f = premi risiko pasar (5%); R_aktual = forecast analis (12%). Interpretasi: CAPM memberi “upah wajar” untuk risiko sistematis; alpha = kelebihan return di atas upah wajar — aset di atas garis SML berarti undervalued. Contoh angka: required = 4% + 1,4 × 5% = 11%; alpha = 12% − 11% = +1% → BELI.",
      tasks: [
        { id: "t1", text: "Hitung `req` CAPM: Rf=4%, MRP=5%, beta=1,4 (desimal)" },
        { id: "t2", text: "Hitung `alpha` (forecast 12%), cetak keduanya persen bulat" },
      ],
      expected: "req=11%  alpha=1%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Alpha +1% itu tipis. Dalam praktik, pertimbangkan margin of safety dan signifikansi statistik alpha sebelum bertindak — evaluasi kinerja butuh uji signifikansi: alpha +1% dengan tracking error 8% dan 36 bulan data punya t-statistik ≈ 0,75, jauh di bawah ambang 2 — belum bisa dibedakan dari noise.",
      },
      hints: [
        "Required = Rf + beta \u00d7 MRP.",
        "Alpha = forecast \u2212 required.",
        "req = rf + beta * mrp\nalpha = forecast - req",
      ],
      code: {
        starter: `rf, mrp, beta, forecast = 0.04, 0.05, 1.4, 0.12\n\n# TULIS KODEMU\nreq = \nalpha = \n\nprint(f"req={req*100:.0f}%  alpha={alpha*100:.0f}%")`,
        lockLines: 1,
        solution: `rf, mrp, beta, forecast = 0.04, 0.05, 1.4, 0.12\n\n# TULIS KODEMU\nreq = rf + beta * mrp\nalpha = forecast - req\n\nprint(f"req={req*100:.0f}%  alpha={alpha*100:.0f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "req", value: 0.11, tol: 1e-9, label: "`req` seharusnya 0.11", msg: "4% + 1,4\u00d75% = 11%. Beta mengalikan premi pasar." },
          { kind: "equal", task: "t2", name: "alpha", value: 0.01, tol: 1e-9, label: "`alpha` seharusnya 0.01", msg: "12% \u2212 11% = +1% \u2192 di atas SML \u2192 BELI." },
          { kind: "stdout_matches", task: "t2", pattern: "req=11%\\s+alpha=1%", label: "`print` menampilkan keduanya", msg: "Format: req=...%  alpha=...%." },
        ],
      },
      quiz: [
        {
          q: "Saham PT Maju berkorelasi 0,86 dengan pasar (\u03c3_saham=28%, \u03c3_pasar=20%). Rf=6%, E(Rm)=12%. Analis forecast return 16%. Keputusan?",
          options: [
            { text: "Beli — \u03b2=1,2, required 13,2%, alpha +2,8% (di atas SML)", why: "Benar: \u03b2 = \u03c1\u00b7\u03c3i/\u03c3m = 0,86 \u00d7 (28/20) = 1,2. Required = 6% + 1,2\u00d76% = 13,2%. Forecast 16% \u2192 alpha +2,8% \u2192 BELI.", correct: true },
            { text: "Jual — overvalued, return di bawah SML", why: "Salah: forecast 16% di atas required 13,2%, bukan di bawah." },
            { text: "Tahan — fairly valued, alpha nol", why: "Salah: alpha +2,8% \u2260 0." },
            { text: "Beta tidak bisa dihitung dari data korelasi", why: "Salah: \u03b2 = \u03c1 \u00d7 \u03c3i/\u03c3m — justru dari korelasilah beta dihitung." },
          ],
        },
      ],
      reference: "CAPM = harga risiko. Alpha = aktual \u2212 CAPM. Di atas SML = BELI.",
    },
    {
      id: "ips-behavioral",
      eyebrow: "Langkah 5 · IPS & Behavioral",
      title: "Manusia di balik angka",
      prose: [
        "IPS (Investment Policy Statement): tujuan, toleransi risiko, horizon, likuiditas, pajak, regulasi — diagnosis sebelum resep. Satu halaman tertulis: tujuan, horizon, batasan. Tanpa IPS = nasihat tanpa arah; saat pasar panik, IPS adalah jangkar anti loss-aversion.",
        "Bias behavioral yang merusak return: loss aversion (menolak merealisasi rugi — \u201cbelum rugi kalau belum dijual\u201d), overconfidence (kinerja 1 tahun dianggap skill), herding. Lawannya: proses tertulis. Rudi berkata \u201cPokoknya gue nggak jual sebelum balik modal\u201d = loss aversion + disposition effect. Respons sesuai IPS: jika IPS-nya punya stop-loss \u221215%, posisi wajib dipotong mekanis — tanpa negosiasi dengan emosi. IPS = \u201cpakta Ulysses\u201d.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "IPS yang tidak pernah direview = dokumen mati. Review tiap ada perubahan hidup klien (pernikahan, pensiun, warisan) — bukan tiap ada gejolak pasar.",
      },
      reference: "IPS: tujuan\u2013kendala\u2013kebijakan tertulis. Lawan bias = proses, bukan tekad.",
    },
    {
      id: "naik-tangga",
      eyebrow: "Langkah 6 · Naik Tangga",
      title: "Dari sekuritas ke portofolio: dua pekerjaan berbeda",
      prose: [
        "Sembilan langkah pertama seri fondasi ini mengajarimu menilai sekuritas: membaca laporan keuangan, menghitung valuasi, mengukur risiko kredit dan durasi. Langkah penutup ini mengubah pertanyaannya: bukan “saham apa yang bagus?” melainkan “kumpulan apa yang bertahan?”. Dua pertanyaan itu butuh dua skill berbeda — stock picking mencari return, portfolio construction mengelola risiko. Investor yang hanya menguasai yang pertama akan menumpuk saham-saham “bagus” yang ternyata bergerak bersamaan (ρ ≈ 0,9) — diversifikasi semu seperti Rudi dengan tiga saham tambangnya. Diversifikasi diukur dari matriks korelasi, bukan dari jumlah ticker atau dari keyakinanmu pada tiap saham.",
        "Peringatan estimation error: rumus bobot optimal di Langkah 3 terlihat eksak — tetapi inputnya (return harapan, volatilitas, korelasi) adalah estimasi dari data masa lalu yang berisik. Optimizer mean-variance dijuluki “error maximizer”: ia memberi bobot terbesar pada aset dengan return estimasi tertinggi — yang justru paling mungkin overestimate. Tiga rem praktis yang dipakai profesional: (1) batasi bobot maksimum (misalnya 10% per aset) agar satu estimasi ngawur tidak mendominasi; (2) pakai estimasi yang di-shrinkage ke rata-rata historis; (3) saat sinyal lemah, 1/N (bobot sama rata) sering mengalahkan optimasi canggih pada data baru — kesederhanaan adalah bentuk kerendahan hati terhadap noise.",
        "Jembatan ke konstruksi portofolio: fondasi yang kamu kuasai — diversifikasi (korelasi menentukan risiko), CAPM (pasar hanya membayar risiko sistematis), IPS (tujuan dan batasan tertulis sebagai jangkar) — adalah tiga kaki portofolio yang kokoh. Konstruksi portofolio menambahkan tiga hal di atasnya: alokasi aset strategis (berapa persen ke tiap kelas aset), ekspektasi pasar modal (skenario 5–10 tahun, bukan ramalan 5 hari), dan evaluasi kinerja (apakah alpha-mu nyata atau sekadar noise). Urutannya tidak bisa dibalik: tanpa fondasi ini, optimasi portofolio hanyalah matematika elegan di atas pasir.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: portofolio dirakit dari korelasi, bukan dari keyakinan",
        body: "Intuisi konstruktor portofolio: optimizer mean-variance adalah “error maximizer” — ia memberi bobot terbesar pada aset dengan estimasi return tertinggi, yang justru estimasi paling mungkin salah karena noise. Praktisi merespons dengan tiga rem: batasi bobot maksimum per aset, pakai shrinkage pada input estimasi, atau — yang paling jujur — akui ketidaktahuanmu dengan bobot sama rata (1/N) saat sinyal lemah. Kedua: diversifikasi diukur dari matriks korelasi, bukan jumlah ticker — 50 saham bank dengan korelasi 0,9 adalah satu taruhan raksasa, bukan lima puluh taruhan kecil. Ketiga, dan paling penting: memilih sekuritas (mencari alpha) dan merakit portofolio (mengelola risiko) adalah dua pekerjaan berbeda dengan dua skill berbeda. Banyak investor hebat dalam memilih saham tetapi gagal merakit portofolio — karena di level portofolio mereka mengulang keyakinan yang sama, bukan melengkapinya dengan ketakberkorelasian. Seri fondasi ini memberimu kedua kakinya; konstruksi portofolio adalah tempat kamu belajar berjalan. Keempat: rebalancing adalah diversifikasi yang dijadwalkan — tanpa rebalancing, pemenang akan mendominasi portofolio dan profil risikomu melayang; dengan rebalancing mekanis, kamu menjual mahal dan membeli murah secara otomatis. IPS yang baik menulis aturan rebalancing (ambang atau kalender), bukan sekadar alokasi awal.",
      },
      quiz: [
        {
          q: "Optimizer memberi bobot 40% ke satu aset karena return estimasinya paling tinggi. Respons profesional?",
          options: [
            { text: "Ikuti — matematika tidak berbohong", why: "Salah: matematika benar, inputnya yang berisik. Optimizer memaksimalkan error estimasi, bukan return masa depan." },
            { text: "Curigai estimation error: batasi bobot / shrinkage / pertimbangkan 1/N", why: "Benar: return estimasi tertinggi = kandidat overestimate terbesar. Rem praktis: cap bobot, shrinkage, atau 1/N saat sinyal lemah.", correct: true },
            { text: "Tambah lagi — keyakinan harus dimaksimalkan", why: "Salah: itu menggandakan taruhan pada estimasi yang paling meragukan." },
            { text: "Ganti optimizer lain", why: "Salah: semua optimizer mean-variance punya masalah yang sama — masalahnya di input, bukan algoritma." },
          ],
        },
      ],
      reference: "Stock picking ≠ portfolio construction. Optimizer = error maximizer → batasi, shrinkage, atau 1/N.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: dari stock picking ke portfolio construction",
      prose: [
        "Skenario 1 — Menambah saham ke portofolio. → Tanya korelasinya, bukan jumlahnya. Tiga saham tambang dengan ρ ≈ 0,85 = diversifikasi semu ≈ satu saham raksasa.",
        "Skenario 2 — Menentukan bobot optimal. → Rumus minimum-variance sebagai titik awal — tetapi waspadai estimation error: optimizer adalah 'error maximizer' yang memberi bobot terbesar pada estimasi paling optimis. Batasi bobot maksimum.",
        "Skenario 3 — Menilai apakah saham 'murah'. → CAPM: required = R_f + β × MRP; alpha = forecast − required. Di atas SML → beli; di bawah → jual.",
        "Skenario 4 — Pasar panik, emosi mengambil alih. → Kembali ke IPS tertulis: stop-loss −15% = potong mekanis, tanpa negosiasi dengan emosi. IPS adalah jangkar anti loss-aversion.",
        "Skenario 5 — Dua pertanyaan berbeda, dua skill berbeda. → 'Saham apa yang bagus?' = stock picking (mencari return). 'Kumpulan apa yang bertahan?' = construction (mengelola risiko). Kuasai keduanya, jangan campur.",
        "Aturan praktis 10 detik: tambah aset → cek korelasi; bobot → waspadai estimation error; murah? → alpha vs SML; panik → baca IPS.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira diversifikasi = banyak ticker. Diversifikasi diukur dari matriks korelasi, bukan jumlah saham — Rudi menambah jumlah tanpa menambah ketakberkorelasian, dan membayarnya dengan −25%.",
      },
    },
    {
      id: "minicase-rudi-sinta",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Diversifikasi semu Rudi",
      prose: [
        "Rudi kapok lalu membeli tiga saham tambang berbeda (\u03c1 antar-saham \u2248 0,85). Apakah ini diversifikasi yang benar? Bukan — ini diversifikasi semu. Tiga saham tambang dengan \u03c1 \u2248 0,85 \u2248 satu saham tambang raksasa: \u03c3_p \u2248 29%+. Rudi menambah jumlah tanpa menambah ketakberkorelasian.",
        "Pelajaran: diversifikasi diukur dari matriks korelasi, bukan jumlah ticker. Portofolio Sinta memenuhi IPS-nya sendiri: E(R) 15% \u2265 target 12%; \u03c3_p 23,2% < batas 25%. Keputusan (alokasi 50/50) bisa dipertahankan secara tertulis, bukan sekadar \u201cfeeling\u201d.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "50 saham semuanya bank (\u03c1 \u2248 0,9) = diversifikasi semu. Jumlah tidak penting; korelasi yang penting. 50 saham sekeranjang = konsentrasi terselubung.",
      },
      reference: "Diversifikasi diukur dari korelasi, bukan jumlah ticker.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: diversifikasi, CAPM, risiko yang dibayar, dan IPS.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dua aset \u03c3=30%, w=50/50, \u03c1=0,2. \u03c3 portofolio?",
          options: [
            { text: "30%", why: "Salah: itu rata-rata volatilitas — rumus portofolio punya suku korelasi." },
            { text: "23,2%", why: "Benar: \u221a0,054 = 23,2%. Risiko turun 23% dengan return sama — makan siang gratis diversifikasi.", correct: true },
            { text: "15%", why: "Salah: terlalu rendah; cek \u03c3_p\u00b2 = 0,0225+0,0225+0,009." },
            { text: "42,4%", why: "Salah: itu \u221a0,18 — salah hitung suku korelasi." },
          ],
        },
        {
          q: "Rf 6%, Rm 12%, \u03b2=1,5. E(R) CAPM?",
          options: [
            { text: "12%", why: "Salah: itu return pasar — lupakan beta dan Rf." },
            { text: "15%", why: "Benar: 6% + 1,5\u00d76% = 15%. Forecast 18% \u2192 alpha +3% (undervalued, di atas SML).", correct: true },
            { text: "18%", why: "Salah: itu contoh forecast analis, bukan required CAPM." },
            { text: "9%", why: "Salah: cek 6% + 1,5 \u00d7 (12%\u22126%)." },
          ],
        },
        {
          q: "Risiko mana yang \u2018dibayar\u2019 pasar menurut CAPM?",
          options: [
            { text: "Risiko total", why: "Salah: risiko total mencakup idiosinkratis yang bisa didiversifikasi gratis." },
            { text: "Risiko sistematis (beta) saja", why: "Benar: idiosinkratis bisa didiversifikasi gratis \u2192 tidak dikompensasi. Hanya beta yang punya \u201cupah\u201d.", correct: true },
            { text: "Risiko idiosinkratis", why: "Salah: justru yang tidak dibayar." },
            { text: "Semua risiko", why: "Salah: CAPM membedakan sistematis vs idiosinkratis." },
          ],
        },
        {
          q: "50 saham semuanya bank (\u03c1\u22480,9). Diversifikasi?",
          options: [
            { text: "Sempurna — 50 saham", why: "Salah: jumlah tidak penting; korelasi yang penting." },
            { text: "Semu — korelasi tinggi = 1 saham raksasa", why: "Benar: 50 saham sekeranjang = konsentrasi terselubung.", correct: true },
            { text: "Cukup", why: "Salah: \u03c1 \u2248 0,9 hampir tidak memberi manfaat diversifikasi." },
            { text: "Tidak bisa dinilai", why: "Salah: bisa — dari korelasinya." },
          ],
        },
        {
          q: "Fungsi utama IPS?",
          options: [
            { text: "Memilih saham terbaik", why: "Salah: IPS bukan stock picker." },
            { text: "Dokumen tujuan\u2013kendala\u2013kebijakan sebagai jangkar keputusan", why: "Benar: diagnosis sebelum resep; jangkar saat pasar panik (anti loss-aversion).", correct: true },
            { text: "Menjamin return", why: "Salah: tidak ada dokumen yang menjamin return." },
            { text: "Syarat legal semata", why: "Salah: fungsinya jauh lebih dalam — jangkar keputusan." },
          ],
        },
      ],
      summary: [
        "Diversifikasi: \u03c3_p\u00b2 punya suku korelasi; \u03c1 < 1 \u2192 risiko turun tanpa korban return.",
        "Risiko sistematis (tidak bisa dihindari) vs idiosinkratis (bisa).",
        "CAPM: E(R) = R_f + \u03b2(E(R_m) \u2212 R_f); alpha = aktual \u2212 CAPM.",
        "SML: di atas = undervalued; CML untuk portofolio efisien.",
        "IPS: tujuan, toleransi, horizon, likuiditas — jangkar anti-bias behavioral.",
      ],
      next: { label: "PM-A10B — Portfolio Management: IPS, Manajemen Risiko & Rebalancing", href: "/v2/learn/pm-a10b-IPS-risiko" },
    },
  ],
};

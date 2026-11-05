import type { V2Lesson } from "../lib/types";

const GARCH_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Deret AR(1) kembali ke rata-rata dengan pita volatilitas yang melebar di tengah lalu menyempit — volatility clustering.">
<text x="260" y="18" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Volatility clustering: pita ±2σ melebar lalu menyempit</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="40" x2="500" y2="40"/><line x1="60" y1="90" x2="500" y2="90"/><line x1="60" y1="140" x2="500" y2="140"/><line x1="60" y1="190" x2="500" y2="190"/></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">return</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0</text><text x="170" y="240">10</text><text x="280" y="240">20</text><text x="390" y="240">30</text><text x="500" y="240">40</text></g>
<polygon points="60,98.7 71,98.1 82,97.3 93,96.1 104,94.6 115,92.6 126,90.1 137,87.1 148,83.4 159,79.1 170,74.2 181,68.9 192,63.1 203,57.1 214,51.2 225,45.5 236,40.3 247,36.0 258,32.7 269,30.7 280,30.0 291,30.7 302,32.7 313,36.0 324,40.3 335,45.5 346,51.2 357,57.1 368,63.1 379,68.9 390,74.2 401,79.1 412,83.4 423,87.1 434,90.1 445,92.6 456,94.6 467,96.1 478,97.3 489,98.1 500,98.7 500,141.3 489,141.9 478,142.7 467,143.9 456,145.4 445,147.4 434,149.9 423,152.9 412,156.6 401,160.9 390,165.8 379,171.1 368,176.9 357,182.9 346,188.8 335,194.5 324,199.7 313,204.0 302,207.3 291,209.3 280,210.0 269,209.3 258,207.3 247,204.0 236,199.7 225,194.5 214,188.8 203,182.9 192,176.9 181,171.1 170,165.8 159,160.9 148,156.6 137,152.9 126,149.9 115,147.4 104,145.4 93,143.9 82,142.7 71,141.9 60,141.3" fill="var(--c2)" opacity="0.15" stroke="none"/>
<polyline points="60,98.7 71,98.1 82,97.3 93,96.1 104,94.6 115,92.6 126,90.1 137,87.1 148,83.4 159,79.1 170,74.2 181,68.9 192,63.1 203,57.1 214,51.2 225,45.5 236,40.3 247,36.0 258,32.7 269,30.7 280,30.0 291,30.7 302,32.7 313,36.0 324,40.3 335,45.5 346,51.2 357,57.1 368,63.1 379,68.9 390,74.2 401,79.1 412,83.4 423,87.1 434,90.1 445,92.6 456,94.6 467,96.1 478,97.3 489,98.1 500,98.7" fill="none" stroke="var(--c2)" stroke-width="1.5" opacity="0.55"/>
<polyline points="60,141.3 71,141.9 82,142.7 93,143.9 104,145.4 115,147.4 126,149.9 137,152.9 148,156.6 159,160.9 170,165.8 181,171.1 192,176.9 203,182.9 214,188.8 225,194.5 236,199.7 247,204.0 258,207.3 269,209.3 280,210.0 291,209.3 302,207.3 313,204.0 324,199.7 335,194.5 346,188.8 357,182.9 368,176.9 379,171.1 390,165.8 401,160.9 412,156.6 423,152.9 434,149.9 445,147.4 456,145.4 467,143.9 478,142.7 489,141.9 500,141.3" fill="none" stroke="var(--c2)" stroke-width="1.5" opacity="0.55"/>
<line x1="60" y1="120" x2="500" y2="120" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="5,4"/>
<text x="494" y="114" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">mean</text>
<polyline points="60,60.0 71,70.0 82,83.3 93,97.7 104,111.4 115,123.1 126,131.8 137,137.3 148,139.6 159,139.3 170,136.9 181,133.1 192,128.8 203,124.4 214,120.5 225,117.4 236,115.3 247,114.2 258,113.9 269,114.4 280,115.4 291,116.7 302,118.1 313,119.4 324,120.4 335,121.2 346,121.7 357,121.9 368,121.8 379,121.6 390,121.2 401,120.8 412,120.4 423,120.0 434,119.7 445,119.5 456,119.4 467,119.4 478,119.5 489,119.6 500,119.7" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<text x="280" y="198" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">klaster volatilitas tinggi</text>
<text x="100" y="134" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">volatilitas rendah</text>
</svg>`;

export const pmb2: V2Lesson = {
  slug: "pm-b2-timeseries",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B2 Time Series: AR, Unit Root & GARCH",
  estMinutes: 55,
  steps: [
    {
      id: "ar1",
      eyebrow: "Langkah 1 · AR(1)",
      title: "Ramalan yang \u2018akurat\u2019 karena mencontek",
      prose: [
        "Analis membangun model prediksi harga saham: R\u00b2 0,98. \u201cRegresi harga hari ini ke harga kemarin — hampir sempurna!\u201d Ia trading dengan model itu. Hasil: rugi besar. Twist-nya: harga saham = random walk (unit root). Regresi dua random walk menghasilkan spurious regression — R\u00b2 tinggi palsu. Model \u2018mencontek\u2019 (harga kemarin \u2248 harga hari ini) tetapi tidak memprediksi apa-apa — seperti meramal \u201cbesok cuaca = hari ini\u201d lalu mengklaim jadi meteorolog.",
        "AR(1): x_t = b0 + b1\u00b7x_{t\u22121} + \u03b5. Stasioner jika |b1| < 1: mean-reverting (kembali ke b0/(1\u2212b1)). b1 = 1 = random walk (tidak stasioner: varians \u2192 \u221e, shock permanen). b1 > 1 = eksplosif. Tiga nasib shock Rp100: b1 = 0,8 \u2192 tersisa 80, 64, 51\u2026 \u2192 lenyap; b1 = 1 \u2192 menetap selamanya; b1 = 1,05 \u2192 membesar eksponensial (bubble).",
        "Implikasi: regresi dengan data tidak stasioner \u2192 spurious (uji-t invalid). Solusi: difference dulu (\u0394x_t stasioner) atau uji kointegrasi. Regresi harga (b1=1): R\u00b2 0,98 tetapi spurious. Regresi return (\u0394harga, stasioner): R\u00b2 0,02 tetapi jujur. Pilih jujur.",
      ],
      formula: String.raw`x_t = b_0 + b_1 x_{t-1} + \varepsilon \quad;\quad \text{stasioner jika } |b_1| < 1`,
      formulaNote: "x_t = nilai hari ini; b0 = konstanta (level); b1 = persistensi (berapa porsi kemarin terbawa); ε = shock. |b1|<1 = stasioner, mean jangka panjang = b0/(1−b1). Contoh: b1=0,8 → shock Rp100 tersisa 80, 64, 51… → lenyap; b1=1 → shock menetap selamanya (random walk).",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "R\u00b2 0,98 dari regresi harga-vs-harga = jebakan; R\u00b2 3% dari return = jujur. Model yang \u2018akurat\u2019 karena mencontek akan menghancurkan modal saat di-trading-kan.",
      },
      reference: "|b1| < 1 = stasioner. b1 = 1 = random walk. Difference dulu, baru model.",
    },
    {
      id: "forecast-ar",
      eyebrow: "Langkah 2 · Forecast AR",
      title: "Forecast yang meluruh ke mean",
      prose: [
        "y_t = 0,5 + 0,7\u00d7y_{t\u22121}. Terakhir y_T = 10. 1-step: \u0177 = 0,5 + 0,7\u00d710 = 7,5. 2-step: \u0177 = 0,5 + 0,7\u00d77,5 = 5,75. Jangka panjang: mean = 0,5/(1\u22120,7) = 1,67 — forecast meluruh menuju ini (mean reversion).",
        "Pelajaran: jangan percaya AR untuk horizon jauh. Forecast 10-step praktis sudah = mean jangka panjang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `f1` (1-step) dan `f2` (2-step) dari y_T = 10" },
        { id: "t2", text: "Hitung `mean` jangka panjang, cetak ketiganya" },
      ],
      expected: "f1=7.5  f2=5.75  mean=1.67",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai y_T = 10 untuk 2-step juga. 2-step memakai hasil 1-step (7,5) sebagai input — forecast berantai, bukan paralel.",
      },
      hints: [
        "f1 = c + phi \u00d7 y_T.",
        "f2 = c + phi \u00d7 f1 (pakai hasil f1!).",
        "mean = c / (1 \u2212 phi) — hanya jika |phi| < 1.",
      ],
      code: {
        starter: `c, phi, y_t = 0.5, 0.7, 10\n\n# TULIS KODEMU\nf1 = \nf2 = \nmean = \n\nprint(f"f1={f1}  f2={f2}  mean={mean:.2f}")`,
        lockLines: 1,
        solution: `c, phi, y_t = 0.5, 0.7, 10\n\n# TULIS KODEMU\nf1 = c + phi * y_t\nf2 = c + phi * f1\nmean = c / (1 - phi)\n\nprint(f"f1={f1}  f2={f2}  mean={mean:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "f1", value: 7.5, tol: 1e-9, label: "`f1` seharusnya 7.5", msg: "0,5 + 0,7\u00d710 = 7,5." },
          { kind: "equal", task: "t1", name: "f2", value: 5.75, tol: 1e-9, label: "`f2` seharusnya 5.75", msg: "0,5 + 0,7\u00d77,5 = 5,75. Pakai f1 sebagai input." },
          { kind: "equal", task: "t2", name: "mean", value: 1.6667, tol: 0.01, label: "`mean` sekitar 1.67", msg: "0,5/(1\u22120,7) = 1,67. Forecast meluruh ke sini." },
          { kind: "stdout_matches", task: "t2", pattern: "f1=7\\.5\\s+f2=5\\.75\\s+mean=1\\.67", label: "`print` menampilkan ketiganya", msg: "Format: f1=...  f2=...  mean=... ." },
        ],
      },
      reference: "Forecast AR meluruh ke mean. Jangan percaya horizon jauh.",
    },
    {
      id: "unit-root",
      eyebrow: "Langkah 3 · Unit Root",
      title: "Akar persoalan: uji Dickey-Fuller",
      prose: [
        "Dickey-Fuller: H0 = ada unit root (tidak stasioner). Tolak H0 jika test stat < nilai kritis (mis. \u22122,86). Stat \u22123,5 < \u22122,86 \u2192 tolak H0 \u2192 stasioner. Stat \u22121,2 > \u22122,9 \u2192 gagal tolak \u2192 ada unit root \u2192 difference dulu.",
        "Perhatikan arahnya: kritis negatif, dan \u201clebih negatif\u201d = lebih kuat menolak. Ini kebalikan intuisi uji-t biasa — hafalkan: tolak jika stat < kritis.",
        "Data harga saham \u2192 uji unit root dulu; model return, bukan level. Level tanpa kointegrasi = spurious.",
      ],
      formula: String.raw`H_0: b_1 = 1 \ (\text{unit root}) \quad;\quad \text{tolak } H_0 \text{ jika stat} < \text{kritis}`,
      formulaNote: "H0: b1=1 (ada unit root = tidak stasioner). Tolak H0 hanya jika test stat LEBIH NEGATIF dari kritis. Contoh: stat −3,5 < −2,86 → tolak → stasioner; stat −1,2 > −2,9 → gagal tolak → ada unit root → difference dulu. Arahnya kebalikan intuisi uji-t biasa — hafalkan.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca \u22121,2 < \u22122,9 sebagai \u201ctolak\u201d. \u22121,2 lebih besar (kurang negatif) dari \u22122,9 \u2192 gagal tolak. Garis bilangan negatif menjebak.",
      },
      quiz: [
        {
          q: "AR(1) dengan b1 = 1. Sifatnya?",
          options: [
            { text: "Stasioner", why: "Salah: b1 = 1 = unit root — tidak stasioner." },
            { text: "Random walk — tidak stasioner, shock permanen", why: "Benar: varians \u2192 \u221e, shock tidak hilang. Regresi level = spurious.", correct: true },
            { text: "Eksplosif", why: "Salah: eksplosif = b1 > 1." },
            { text: "Mean-reverting cepat", why: "Salah: itu |b1| < 1." },
          ],
        },
        {
          q: "DF test: stat \u22121,2, kritis \u22122,9. Kesimpulan?",
          options: [
            { text: "Stasioner", why: "Salah: \u22121,2 > \u22122,9 (kurang negatif) \u2192 gagal tolak H0." },
            { text: "Gagal tolak H0 — ada unit root (tidak stasioner)", why: "Benar: tolak H0 hanya jika stat < kritis. Solusi: difference dulu.", correct: true },
            { text: "Eksplosif", why: "Salah: DF menguji unit root, bukan eksplosivitas." },
            { text: "Perlu lebih banyak data", why: "Salah: keputusan uji sudah bisa diambil — gagal tolak." },
          ],
        },
      ],
      reference: "DF: H0 = unit root. Tolak jika stat < kritis (lebih negatif).",
    },
    {
      id: "garch",
      eyebrow: "Langkah 4 · GARCH + chart",
      title: "Volatilitas berkelompok",
      prose: [
        "GARCH(1,1): \u03c3\u00b2_t = \u03c9 + \u03b1\u00b7r\u00b2_{t\u22121} + \u03b2\u00b7\u03c3\u00b2_{t\u22121}. Volatilitas tidak konstan — ia berkelompok (clustering): setelah shock besar, volatilitas tetap tinggi beberapa waktu.",
        "Contoh: \u03c3\u00b2 = 0,01 + 0,08\u00d7r\u00b2 + 0,90\u00d7\u03c3\u00b2_{t\u22121}. Dengan r = 2%, \u03c3\u00b2_{t\u22121} = 1: forecast = 0,01 + 0,08\u00d74 + 0,90\u00d71 = 1,23. \u03b1 + \u03b2 = 0,98 \u2248 1 = ingatan panjang: shock volatilitas butuh berminggu-minggu untuk reda.",
        "Gunakan GARCH untuk forecasting risiko/VaR — bukan untuk arah harga. Setelah crash, VaR besok naik: risk manager siaga.",
        "Cara membaca: sumbu X = waktu, sumbu Y = return; garis biru = deret yang kembali ke rata-rata (mean-reversion ala AR(1)); pita arsir = ±2σ volatilitas kondisional; garis putus-putus = rata-rata jangka panjang.",
        "Interpretasi: pita melebar di tengah lalu menyempit — volatility clustering: setelah shock, volatilitas tetap tinggi beberapa waktu (α+β = 0,08+0,90 = 0,98 ≈ 1 = ingatan panjang, seperti di teks). Inilah mengapa VaR besok harus naik setelah hari ini bergejolak — VaR statis = bunuh diri.",
      ],
      figure: {
        svg: GARCH_SVG,
        alt: "Deret AR(1) kembali ke rata-rata dengan pita volatilitas yang melebar di tengah lalu menyempit — volatility clustering.",
        caption: "Ilustrasi GARCH(1,1) dari teks (ω=0,01, α=0,08, β=0,90). Pita bukan interval kepercayaan harga — ia memvisualkan satu ide: risiko tidak konstan, ia berkelompok.",
      },
      formula: String.raw`\sigma^2_t = \omega + \alpha r^2_{t-1} + \beta \sigma^2_{t-1}`,
      formulaNote: "σ²_t = varians kondisional hari ini; ω = lantai varians; α = reaksi terhadap shock kemarin (r²_{t−1}); β = memori volatilitas. α+β ≈ 1 = sangat persisten. Contoh: ω=0,01, α=0,08, β=0,90, r=2%, σ²=1 → forecast 1,23. Untuk risiko/VaR — bukan arah harga.",
      tasks: [
        { id: "t1", text: "Hitung forecast varians `f`: \u03c9=0,01, \u03b1=0,08, \u03b2=0,90, r=2, \u03c3\u00b2=1" },
        { id: "t2", text: "Cetak 2 desimal" },
      ],
      expected: "f=1.23",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko TIDAK konstan. Setelah return \u22128% (shock), volatilitas besok melonjak — VaR 99% ikut naik. VaR historis statis pasca-guncangan = bunuh diri.",
      },
      hints: [
        "f = w + a\u00d7r\u00b2 + b\u00d7s2. Di sini r = 2 (satuan persen) \u2192 r\u00b2 = 4.",
        "Jangan ubah satuan di tengah jalan.",
        "f = w + a*r**2 + b*s2",
      ],
      code: {
        starter: `w, a, b, r, s2 = 0.01, 0.08, 0.90, 2.0, 1.0\n\n# TULIS KODEMU\nf = \n\nprint(f"f={f:.2f}")`,
        lockLines: 1,
        solution: `w, a, b, r, s2 = 0.01, 0.08, 0.90, 2.0, 1.0\n\n# TULIS KODEMU\nf = w + a*r**2 + b*s2\n\nprint(f"f={f:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "f", value: 1.23, tol: 1e-9, label: "`f` seharusnya 1.23", msg: "0,01 + 0,08\u00d74 + 0,90\u00d71 = 1,23. r\u00b2 = 4 (r = 2)." },
          { kind: "stdout_matches", task: "t2", pattern: "f=1\\.23", label: "`print` menampilkan f", msg: "Format 2 desimal: f=1.23." },
        ],
      },
      reference: "GARCH = volatilitas kondisional untuk risk. \u03b1+\u03b2 \u2248 1 = persisten.",
    },
    {
      id: "kointegrasi",
      eyebrow: "Langkah 5 · Kointegrasi",
      title: "Ketika dua random walk berjalan bersama",
      prose: [
        "Dua saham tidak stasioner, tetapi spread-nya stasioner \u2192 kointegrasi = hubungan ekuilibrium jangka panjang = peluang pairs trading. Spread menyimpang \u2192 mean-revert \u2192 trading.",
        "Tetapi strategi \u201cmean reversion\u201d butuh lebih dari kointegrasi: half-life mean reversion (berapa hari kembali?), biaya transaksi vs ekspektasi profit, dan stabilitas kointegrasi (bisa jebol saat rezim berubah). Kointegrasi = izin untuk memodelkan level; bukan jaminan profit.",
        "Protokol time series yang benar: (1) plot & uji DF tiap deret; (2) jika semua I(1) \u2192 uji kointegrasi; (3) jika terkointegrasi \u2192 VECM, jika tidak \u2192 model return; (4) walk-forward backtest dengan biaya; (5) paper trade sebelum modal. Lima langkah atau jangan trading.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira kointegrasi = jaminan profit pairs trading. Ia hanya memberi izin statistik untuk memodelkan level — eksekusi butuh half-life, biaya, dan stabilitas rezim.",
      },
      quiz: [
        {
          q: "Dua saham tidak stasioner tetapi spread-nya stasioner. Ini?",
          options: [
            { text: "Spurious", why: "Salah: spurious = regresi palsu tanpa hubungan; di sini spread stasioner = hubungan nyata." },
            { text: "Kointegrasi — peluang pairs trading", why: "Benar: kombinasi linear stasioner = hubungan ekuilibrium jangka panjang. Spread menyimpang \u2192 mean-revert.", correct: true },
            { text: "Kebetulan", why: "Salah: butuh uji kointegrasi formal, bukan asumsi kebetulan." },
            { text: "Autokorelasi", why: "Salah: itu soal residual berkorelasi, bukan hubungan level." },
          ],
        },
      ],
      reference: "Kointegrasi = kombinasi stasioner dari deret tak stasioner. Izin model level.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: memodelkan data deret waktu",
      prose: [
        "Skenario 1 — Regresi harga hari ini ke kemarin: R² 0,98. → Berhenti. Itu spurious regression dari random walk — harga kemarin ≈ hari ini secara mekanis, bukan prediksi.",
        "Skenario 2 — Sebelum memodelkan level harga. → Uji unit root (Dickey-Fuller) dulu: gagal tolak H0 = ada unit root → difference dulu. Ingat arahnya: tolak jika stat < kritis (negatif).",
        "Skenario 3 — Dua aset tidak stasioner tetapi spread-nya stasioner. → Kointegrasi = izin memodelkan level (pairs trading). Tetapi hitung half-life mean reversion, biaya transaksi, dan stabilitas rezim — kointegrasi bukan jaminan profit.",
        "Skenario 4 — Butuh forecast volatilitas atau VaR harian. → GARCH(1,1) atau shortcut EWMA RiskMetrics (σ² = 0,94σ² + 0,06r²). Untuk risiko 1–10 hari — bukan untuk arah harga.",
        "Skenario 5 — Forecast AR untuk horizon jauh. → Sadari ia meluruh ke mean jangka panjang b0/(1−b1). Jangan percaya AR untuk 10-step — praktis sudah = mean.",
        "Aturan praktis 10 detik: R² ~1 di harga → spurious; level → uji unit root dulu; spread stasioner → kointegrasi; butuh vol → GARCH/EWMA; horizon jauh → mean.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Trading 'mean reversion' dari residual regresi level tanpa uji kointegrasi. Yang di-trade adalah noise random walk — dan seperti analis di mini-case, kerugiannya sangat nyata.",
      },
    },
    {
      id: "minicase-spurious",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Model \u2018sempurna\u2019 yang mencontek: autopsi",
      prose: [
        "Analis meregresi harga saham hari ini ke kemarin: R\u00b2 0,98. Ia trading \u201cmean reversion\u201d berdasarkan residual — rugi besar. Audit: tidak ada uji unit root, tidak ada uji kointegrasi, backtest in-sample.",
        "Yang salah: spurious regression — harga = random walk; regresi level invalid. R\u00b2 mengukur \u201ckemiripan\u201d, bukan prediksi: harga kemarin \u2248 hari ini secara mekanis.",
        "Prosedur benar: uji DF \u2192 difference (return) \u2192 model return (R\u00b2 kecil tetapi jujur), atau uji kointegrasi untuk hubungan level yang valid. Jika residual ternyata stasioner — strategi bisa valid, dengan syarat half-life, biaya, dan stabilitas terpenuhi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ACF meluruh cepat + PACF terpotong di lag 1 = AR(1) — tetapi tetap butuh uji DF formal sebelum memodelkan. Pola visual mendukung, bukan menggantikan, uji.",
      },
      reference: "Stasionerkan dulu, baru model. R\u00b2 tinggi bisa palsu.",
    },
    {
      id: "rezim-garch-praktisi",
      eyebrow: "Langkah 8 · Rezim & volatilitas praktisi",
      title: "Pasar ganti rezim, model ikut ganti",
      prose: [
        "Regime switching: pasar punya dua wajah — tenang dan krisis — dan parameter model ikut berganti. Beta saham vs IHSG 0,8 di rezim tenang bisa jadi 1,4 saat krisis (korelasi → 1). Model satu-rezim merata-ratakan keduanya → salah di dua-duanya: hedge terlalu kecil saat krisis, terlalu besar saat tenang. Deteksi: uji Chow di tanggal krisis yang kamu tahu — F = 8,3 > kritis 3,1 → break struktural 2008 terkonfirmasi. Solusi: model per-rezim (Markov-switching) atau dummy rezim.",
        "ARCH/GARCH konseptual: ARCH — varians hari ini adalah fungsi kuadrat shock kemarin (α·r²_{t−1}); GARCH — tambah memori volatilitas (β·σ²_{t−1}). Kapan dipakai praktisi: forecast risiko 1–10 hari, VaR harian, margin — bukan arah harga. Shortcut praktisi: EWMA RiskMetrics σ²_t = 0,94·σ²_{t−1} + 0,06·r²_{t−1} — tanpa estimasi, update tiap hari. Contoh: setelah return −8%, σ besok melonjak dan VaR ikut naik otomatis — risk manager tidak perlu rapat dulu.",
        "Kapan TIDAK dipakai: GARCH tidak memprediksi return — memakai forecast σ untuk timing arah = salah alamat. Untuk horizon > 1 bulan, volatilitas mean-revert ke unconditional — forecast GARCH jangka panjang praktis flat. Aturan keputusan: horizon 1–10 hari → GARCH/EWMA; > 1 bulan → unconditional vol; arah harga → jangan sentuh GARCH. Volatilitas menjawab “seberapa besar”, bukan “ke mana”.",
      ],
      tasks: [
        { id: "t1", text: "Regresi level: hitung `r2_level` dan `t_level` (dua random walk independen)" },
        { id: "t2", text: "Regresi difference: hitung `r2_diff` dan `t_diff`, cetak keempatnya" },
      ],
      expected: "r2_level=0.36  t_level=10.5  r2_diff=0.01  t_diff=1.5",
      note: {
        title: "Intuisi: stasionerkan dulu, curigai R² cantik",
        body: "Tiga kebiasaan memisahkan quant time series yang survive dari yang meledak. Pertama: sebelum model apa pun, plot datanya dan uji DF — dua menit yang menjawab “level atau difference?”. Harga saham selalu dicurigai random walk sampai terbukti sebaliknya. Kedua: R² tinggi + DW jauh dari 2 = spurious sampai terbukti sebaliknya — jangan pernah trading dari regresi level tanpa uji kointegrasi. Ketiga: pasar ganti rezim; parameter 2019 bukan parameter 2020 — uji Chow di tanggal krisis yang kamu ketahui, dan bila break terkonfirmasi, pakai model per-rezim atau jangan model sama sekali. Keempat: GARCH untuk “seberapa besar”, bukan “ke mana” — risk manager memakainya tiap pagi, trader arah tidak. Dan ingat: forecast AR di luar 5 langkah praktis sudah sama dengan mean — keyakinan pada forecast 20-step adalah keyakinan pada mean, bukan pada model. Kelima: untuk data Indonesia, waspadai break struktural dari kebijakan — perubahan BI rate, pemilu, atau revisi metodologi indeks bisa mematahkan deret lebih tajam dari krisis global; tandai tanggal kebijakan di chart sebelum memodelkan.",
      },
      hints: [
        "Regresi level: ols(x, y) — dua random walk independen.",
        "Difference: dx[i] = x[i] − x[i−1], lalu ols(dx, dy).",
        "r2_level, t_level = ols(x, y)",
      ],
      code: {
        starter: `import random
random.seed(42)
n = 200
x, y = [0.0], [0.0]
for i in range(1, n):
    x.append(x[-1] + random.gauss(0, 1))
    y.append(y[-1] + random.gauss(0, 1))
def ols(a, b):
    ma = sum(a)/len(a); mb = sum(b)/len(b)
    sxx = sum((v-ma)**2 for v in a)
    sxy = sum((v-ma)*(w-mb) for v, w in zip(a, b))
    slope = sxy/sxx
    resid = [w - mb - slope*(v-ma) for v, w in zip(a, b)]
    sse = sum(e*e for e in resid)
    r2 = 1 - sse/sum((w-mb)**2 for w in b)
    se = (sse/(len(a)-2)/sxx)**0.5
    return r2, abs(slope/se)

# TULIS KODEMU: regresi level (y ~ x), lalu difference
r2_level, t_level = 
dx = [x[i]-x[i-1] for i in range(1, n)]
dy = [y[i]-y[i-1] for i in range(1, n)]
r2_diff, t_diff = 

print(f"r2_level={r2_level:.2f}  t_level={t_level:.1f}  r2_diff={r2_diff:.2f}  t_diff={t_diff:.1f}")`,
        lockLines: 19,
        solution: `import random
random.seed(42)
n = 200
x, y = [0.0], [0.0]
for i in range(1, n):
    x.append(x[-1] + random.gauss(0, 1))
    y.append(y[-1] + random.gauss(0, 1))
def ols(a, b):
    ma = sum(a)/len(a); mb = sum(b)/len(b)
    sxx = sum((v-ma)**2 for v in a)
    sxy = sum((v-ma)*(w-mb) for v, w in zip(a, b))
    slope = sxy/sxx
    resid = [w - mb - slope*(v-ma) for v, w in zip(a, b)]
    sse = sum(e*e for e in resid)
    r2 = 1 - sse/sum((w-mb)**2 for w in b)
    se = (sse/(len(a)-2)/sxx)**0.5
    return r2, abs(slope/se)

# TULIS KODEMU: regresi level (y ~ x), lalu difference
r2_level, t_level = ols(x, y)
dx = [x[i]-x[i-1] for i in range(1, n)]
dy = [y[i]-y[i-1] for i in range(1, n)]
r2_diff, t_diff = ols(dx, dy)

print(f"r2_level={r2_level:.2f}  t_level={t_level:.1f}  r2_diff={r2_diff:.2f}  t_diff={t_diff:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r2_level", value: 0.36, tol: 0.05, label: "`r2_level` sekitar 0.36", msg: "Dua random walk independen menghasilkan R² 0,36 — palsu! Inilah spurious regression." },
          { kind: "equal", task: "t1", name: "t_level", value: 10.5, tol: 0.5, label: "`t_level` sekitar 10.5", msg: "t = 10,5 terlihat 'sangat signifikan' — padahal tidak ada hubungan sama sekali." },
          { kind: "equal", task: "t2", name: "r2_diff", value: 0.01, tol: 0.02, label: "`r2_diff` sekitar 0.01", msg: "Setelah difference: R² 0,01 — kebenaran muncul. Stasionerkan dulu, baru model." },
          { kind: "stdout_matches", task: "t2", pattern: "r2_level=0\.36\s+t_level=10\.5\s+r2_diff=0\.01\s+t_diff=1\.5", label: "`print` menampilkan keempatnya", msg: "Format: r2_level=...  t_level=...  r2_diff=...  t_diff=... ." },
        ],
      },
      reference: "Rezim berganti → parameter berganti. GARCH/EWMA untuk risiko 1–10 hari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tiga pertanyaan campuran: GARCH, persistensi, dan forecast AR.",
      ],
      tasks: [],
      quiz: [
        {
          q: "GARCH: \u03c9=0,02, \u03b1=0,10, \u03b2=0,85. Setelah return \u22125%, vol besok?",
          options: [
            { text: "Tetap 0,63%", why: "Salah: shock mengubah forecast — volatilitas tidak konstan." },
            { text: "\u2248 1,69% (2,7x normal) — clustering!", why: "Benar: \u03c3\u00b2 = 0,02+0,10\u00d725+0,85\u00d70,4 = 2,86 \u2192 \u03c3=1,69%. VaR ikut naik.", correct: true },
            { text: "Turun", why: "Salah: shock besar menaikkan volatilitas, bukan menurunkan." },
            { text: "Nol", why: "Salah: \u03c9 > 0 selalu memberi lantai positif." },
          ],
        },
        {
          q: "\u03b1 + \u03b2 = 0,95 pada GARCH. Artinya?",
          options: [
            { text: "Volatilitas tidak persisten", why: "Salah: kebalikannya — mendekati 1 = sangat persisten." },
            { text: "Sangat persisten — shock lama hilang", why: "Benar: \u03b1+\u03b2 \u2248 1 = ingatan panjang. Shock butuh berminggu-minggu untuk reda (khas pasar saham).", correct: true },
            { text: "Model salah", why: "Salah: 0,95 < 1 masih valid dan umum di pasar saham." },
            { text: "Tidak ada artinya", why: "Salah: jumlah ini mengukur persistensi volatilitas." },
          ],
        },
        {
          q: "y_t = 0,5 + 0,7\u00d7y_{t\u22121}. y_T = 10. Forecast 2-step?",
          options: [
            { text: "7,5", why: "Salah: itu 1-step. 2-step memakai 7,5 sebagai input." },
            { text: "5,75", why: "Benar: 1-step = 7,5; 2-step = 0,5+0,7\u00d77,5 = 5,75. Forecast meluruh menuju mean 1,67.", correct: true },
            { text: "1,67", why: "Salah: itu mean jangka panjang — forecast 2-step belum sampai sana." },
            { text: "10,7", why: "Salah: cek 0,5 + 0,7\u00d710 = 7,5 dulu." },
          ],
        },
      ],
      summary: [
        "AR(1): stasioner jika |b1| < 1 (mean-reverting). b1 = 1 = random walk.",
        "Unit root: uji DF (H0 = unit root); level tanpa kointegrasi = spurious.",
        "Kointegrasi: kombinasi stasioner dari deret tak stasioner = izin model level.",
        "GARCH(1,1): \u03c3\u00b2 = \u03c9 + \u03b1\u03b5\u00b2 + \u03b2\u03c3\u00b2; clustering volatilitas untuk risk.",
        "Aturan: stasionerkan dulu, baru model. Forecast AR meluruh ke mean.",
      ],
      next: { label: "PM-B3 — Machine Learning: untuk Investasi", href: "/learn/pm-b3-ml-investasi" },
    },
  ],
};

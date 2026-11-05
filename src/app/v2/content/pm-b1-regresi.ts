import type { V2Lesson } from "../lib/types";

const REGRESI_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Dua panel: kiri regresi terspesifikasi benar dengan residual acak, kanan data kuadratik yang keliru difit garis lurus.">
<rect x="10" y="20" width="240" height="200" fill="none" stroke="var(--chart-grid)" stroke-width="1"/>
<rect x="270" y="20" width="240" height="200" fill="none" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="40" y1="180" x2="230" y2="70" stroke="var(--c2)" stroke-width="2.5"/>
<g fill="var(--c1)" opacity="0.7"><circle cx="60" cy="174" r="3.5"/><circle cx="90" cy="146" r="3.5"/><circle cx="120" cy="150" r="3.5"/><circle cx="140" cy="116" r="3.5"/><circle cx="170" cy="110" r="3.5"/><circle cx="190" cy="78" r="3.5"/><circle cx="210" cy="86" r="3.5"/><circle cx="230" cy="66" r="3.5"/></g>
<line x1="120" y1="150" x2="120" y2="134" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4,3"/>
<line x1="190" y1="78" x2="190" y2="93" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4,3"/>
<text x="64" y="160" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">garis regresi</text>
<text x="130" y="240" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">spesifikasi benar: residual acak</text>
<g fill="var(--c1)" opacity="0.7"><circle cx="300" cy="82.7" r="3.5"/><circle cx="320" cy="73.7" r="3.5"/><circle cx="340" cy="67" r="3.5"/><circle cx="360" cy="62.5" r="3.5"/><circle cx="390" cy="60" r="3.5"/><circle cx="420" cy="62.5" r="3.5"/><circle cx="440" cy="67" r="3.5"/><circle cx="460" cy="73.7" r="3.5"/><circle cx="490" cy="88" r="3.5"/></g>
<line x1="300" y1="74" x2="490" y2="74" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6,4"/>
<text x="335" y="66" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">garis linear (salah bentuk)</text>
<text x="390" y="240" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">misspecified: kuadratik difit linear</text>
</svg>`;

export const pmb1: V2Lesson = {
  slug: "pm-b1-regresi",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B1 Regresi Berganda: Model & Misspesifikasi",
  estMinutes: 55,
  steps: [
    {
      id: "regresi-berganda",
      eyebrow: "Langkah 1 · Regresi Berganda",
      title: "Model \u2018sempurna\u2019 yang hancur di 2008",
      prose: [
        "Quant fund membangun model return saham: R\u00b2 0,94, semua koefisien signifikan. \u201cModel terbaik yang pernah kami buat.\u201d 2008: model kolaps — prediksi meleset total. Twist-nya: R\u00b2 0,94 adalah artefak. Model menderita autokorelasi residual (error berkorelasi antar-waktu \u2192 t-stat palsu signifikan) dan overfitting (12 variabel untuk 40 observasi). Ujian diagnostik tidak pernah dijalankan.",
        "Regresi berganda: Y = b0 + b1X1 + b2X2 + \u2026 + \u03b5. Interpretasi parsial: b1 = efek X1 dengan X lain konstan (ceteris paribus). Dummy variable: 0/1 untuk kategori (mis. krisis = 1). Adjusted R\u00b2 = R\u00b2 yang dihukum tiap tambah variabel — ia hanya naik jika variabel benar-benar membantu.",
        "Aturan: R\u00b2 selalu naik saat tambah variabel (bahkan variabel sampah). Adjusted R\u00b2 yang jujur. Regresi tanpa diagnostik = ramalan cuaca tanpa melihat langit.",
      ],
      formula: String.raw`Y = b_0 + b_1 X_1 + b_2 X_2 + \epsilon \quad;\quad \bar{R}^2 = 1 - (1-R^2)\frac{n-1}{n-k-1}`,
      formulaNote: "Y = return yang dijelaskan; b0 = intersep (return saat semua X = 0); b1..bk = efek parsial tiap faktor (ceteris paribus); ε = residual (bagian tak dijelaskan). R̄² = R² yang dihukum kompleksitas: n = observasi, k = variabel. Contoh: R²=0,75, n=50, k=5 → R̄² = 0,722 (penalti 0,028). Interpretasi: R̄² turun saat tambah variabel = variabel sampah — tolak.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Percaya R\u00b2 tinggi tanpa diagnostik. R\u00b2 buta terhadap 5 dosa misspecification — fund 2008: R\u00b2 0,94, DW 0,7 \u2192 t-stat palsu \u2192 kolaps.",
      },
      reference: "Adjusted R\u00b2, bukan R\u00b2. Koefisien = efek parsial (ceteris paribus).",
    },
    {
      id: "adjusted-r2",
      eyebrow: "Langkah 2 · Adjusted R\u00b2",
      title: "R\u00b2 yang jujur",
      prose: [
        "R\u00b2 = 0,75, n = 50, k = 5. Adjusted R\u00b2 = 1 \u2212 0,25\u00d749/44 = 1 \u2212 0,278 = 0,722. Penalti 0,028 untuk 5 variabel — wajar.",
        "Keputusan praktis: tambah variabel, R\u00b2 naik 0,72 \u2192 0,75 tetapi adjusted turun 0,70 \u2192 0,68 \u2192 TOLAK variabelnya. R\u00b2 selalu naik; adjusted yang jujur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `adj` adjusted R\u00b2: R\u00b2=0,75, n=50, k=5" },
        { id: "t2", text: "Cetak 3 desimal" },
      ],
      expected: "adj=0.722",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mempertahankan variabel karena R\u00b2 naik. R\u00b2 selalu naik tambah variabel — bahkan variabel acak. Hanya adjusted R\u00b2 yang boleh jadi wasit.",
      },
      hints: [
        "Rumus: 1 \u2212 (1\u2212R\u00b2)\u00d7(n\u22121)/(n\u2212k\u22121).",
        "n\u2212k\u22121 = 50\u22125\u22121 = 44.",
        "adj = 1 - (1 - r2)*(n-1)/(n-k-1)",
      ],
      code: {
        starter: `r2, n, k = 0.75, 50, 5\n\n# TULIS KODEMU\nadj = \n\nprint(f"adj={adj:.3f}")`,
        lockLines: 1,
        solution: `r2, n, k = 0.75, 50, 5\n\n# TULIS KODEMU\nadj = 1 - (1 - r2)*(n-1)/(n-k-1)\n\nprint(f"adj={adj:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "adj", value: 0.722, tol: 0.002, label: "`adj` sekitar 0.722", msg: "1 \u2212 0,25\u00d749/44 = 0,722. Cek penyebut n\u2212k\u22121 = 44." },
          { kind: "stdout_matches", task: "t2", pattern: "adj=0\\.722", label: "`print` menampilkan adj", msg: "Format 3 desimal: adj=0.722." },
        ],
      },
      reference: "Adjusted R\u00b2 menghukum tiap variabel tambahan. Turun = tolak variabel.",
    },
    {
      id: "misspesifikasi",
      eyebrow: "Langkah 3 · 4 Misspesifikasi + chart",
      title: "Penyakit model dan gejalanya",
      prose: [
        "(1) Omitted variable: variabel penting hilang \u2192 koefisien bias. (2) Heteroskedastisitas: varians residual tidak konstan \u2192 SE salah (t-stat tidak valid). (3) Multikolinearitas: X saling berkorelasi \u2192 koefisien tidak stabil (tanda bisa terbalik). (4) Autokorelasi: residual berkorelasi antar-waktu \u2192 t-stat terlalu optimis (dosa fund 2008).",
        "Deteksi: plot residual vs fitted (corong = hetero), VIF > 10 (multikol), Durbin-Watson \u2248 2 sehat / jauh dari 2 = autokorelasi. Koreksi: tambah variabel, White SE, drop/gabung variabel, Newey-West/model AR. Diagnosis dulu, obat kemudian.",
        "Cara membaca: panel kiri = data linear yang difit garis lurus (benar); panel kanan = data berbentuk U (kuadratik) yang keliru difit garis datar; segmen putus-putus = residual.",
        "Interpretasi: di panel kanan, residual berpola (negatif di tengah, positif di tepi) — tanda klasik bentuk fungsional salah, penyakit nomor 1 di teks. Obatnya bukan menambah data, melainkan memperbaiki spesifikasi: tambah suku kuadratik, lalu cek ulang plot residual vs fitted.",
      ],
      figure: {
        svg: REGRESI_SVG,
        alt: "Dua panel: kiri regresi terspesifikasi benar dengan residual acak, kanan data kuadratik yang keliru difit garis lurus.",
        caption: "Ilustrasi penyakit (1) di teks: bentuk fungsional salah. Gejalanya selalu sama — residual berpola, bukan acak. Diagnosis dulu (plot residual), obat kemudian.",
      },
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Heteroskedastisitas: koefisien tetap unbiased, tetapi SE biasanya terlalu kecil \u2192 t-stat terlalu besar \u2192 \u201csignifikan\u201d palsu. Di pasar, ini berarti kamu bertaruh pada sinyal yang tidak ada.",
      },
      quiz: [
        {
          q: "DW = 0,7 pada regresi time series. Artinya?",
          options: [
            { text: "Sehat", why: "Salah: DW \u2248 2 yang sehat; 0,7 jauh di bawah." },
            { text: "Autokorelasi positif — SE bias, uji-t terlalu optimis", why: "Benar: dosa fund 2008. t-stat \u201csignifikan\u201d ternyata inflated.", correct: true },
            { text: "Heteroskedastisitas", why: "Salah: itu soal varians residual (corong), bukan korelasi antar-waktu." },
            { text: "Multikolinearitas", why: "Salah: itu soal X berkorelasi (VIF), bukan residual." },
          ],
        },
        {
          q: "VIF = 15 untuk X1. Masalah & solusi?",
          options: [
            { text: "Tidak ada", why: "Salah: VIF > 10 = masalah serius." },
            { text: "Multikolinearitas — drop/gabung variabel", why: "Benar: X berkorelasi kuat \u2192 koefisien tidak stabil (tanda bisa terbalik).", correct: true },
            { text: "Omitted variable", why: "Salah: itu soal variabel hilang, bukan X berkorelasi." },
            { text: "Tambah data", why: "Salah: data lebih banyak tidak memisahkan X yang kolinear." },
          ],
        },
      ],
      reference: "Corong = hetero. VIF > 10 = multikol. DW \u2248 2 = sehat.",
    },
    {
      id: "ovb",
      eyebrow: "Langkah 4 · Omitted Variable Bias",
      title: "Matematika pencurian koefisien",
      prose: [
        "Model benar: R = 1 + 2\u00d7SKILL + 3\u00d7LUCK. Kamu meregresi R hanya pada SKILL. Corr(SKILL, LUCK) = 0,5. Bias = \u03b2_omitted \u00d7 Cov(SKILL,LUCK)/Var(SKILL) = 3 \u00d7 0,5 = +1,5. Koefisien terestimasi = 2 + 1,5 = 3,5 (vs benar 2,0) — 75% lebih besar.",
        "Versi pasar modal: meregresi return pada ESG score tanpa mengontrol sektor & size \u2192 koefisien ESG \u201cmencuri\u201d efek sektor teknologi. Klaim \u201cESG outperform\u201d tanpa kontrol = omitted variable bias yang dikemas sebagai insight.",
      ],
      formula: String.raw`\text{bias} = \beta_{\text{omitted}} \times \frac{\text{Cov}(X, \text{omitted})}{\text{Var}(X)}`,
      formulaNote: "bias = selisih koefisien terestimasi vs benar; β_omitted = efek sebenarnya variabel yang hilang; Cov(X,omitted)/Var(X) = seberapa variabel hilang 'menempel' pada X. Contoh: β=3, korelasi 0,5 → bias +1,5; koefisien terestimasi 3,5 vs benar 2,0 (75% lebih besar). Interpretasi: koefisien 'mencuri' efek variabel hilang — kontrol dulu sebelum klaim.",
      tasks: [
        { id: "t1", text: "Hitung `bias` = beta_omitted \u00d7 korelasi (3,0 dan 0,5)" },
        { id: "t2", text: "Hitung `est` = koefisien benar (2,0) + bias, cetak keduanya" },
      ],
      expected: "bias=1.5  est=3.5",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira menambah kontrol selalu aman. Variabel irrelevant justru membengkakkan varians. Kontrol yang benar = variabel yang memengaruhi Y dan berkorelasi dengan X.",
      },
      hints: [
        "bias = b_omit \u00d7 corr (di sini Var proporsional sama).",
        "est = koefisien benar + bias.",
        "bias = b_omit * corr\nest = b_true + bias",
      ],
      code: {
        starter: `b_true, b_omit, corr = 2.0, 3.0, 0.5\n\n# TULIS KODEMU\nbias = \nest = \n\nprint(f"bias={bias}  est={est}")`,
        lockLines: 1,
        solution: `b_true, b_omit, corr = 2.0, 3.0, 0.5\n\n# TULIS KODEMU\nbias = b_omit * corr\nest = b_true + bias\n\nprint(f"bias={bias}  est={est}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bias", value: 1.5, tol: 1e-9, label: "`bias` seharusnya 1.5", msg: "3 \u00d7 0,5 = 1,5. Variabel hilang \u201cmencuri\u201d efeknya ke X." },
          { kind: "equal", task: "t2", name: "est", value: 3.5, tol: 1e-9, label: "`est` seharusnya 3.5", msg: "2 + 1,5 = 3,5 — 75% lebih besar dari yang benar." },
          { kind: "stdout_matches", task: "t2", pattern: "bias=1\\.5\\s+est=3\\.5", label: "`print` menampilkan keduanya", msg: "Format: bias=...  est=... ." },
        ],
      },
      reference: "OVB = beta_hilang \u00d7 kovarians/varians. Kontrol size & sektor sebelum klaim.",
    },
    {
      id: "koreksi",
      eyebrow: "Langkah 5 · Koreksi",
      title: "Obat untuk tiap penyakit",
      prose: [
        "Autokorelasi (DW jauh dari 2) \u2192 Newey-West SE atau tambah lag. Autopsi fund 2008: setelah Newey-West, 3 dari 12 variabel jadi tidak signifikan — R\u00b2 \u201c0,94\u201d runtuh jadi model jujur R\u00b2 0,55. Signifikansi tanpa SE yang benar = ilusi.",
        "Heteroskedastisitas (corong) \u2192 White/robust SE (perbaiki SE tanpa ubah koefisien), WLS, atau transformasi log jika varians \u221d level. Multikolinearitas (VIF > 10) \u2192 drop/gabung variabel, atau ridge/lasso (ridge = L2 yang menciutkan koefisien; lasso = L1 yang menyeleksi hingga nol — keduanya dipilih via validasi, bukan feeling). Omitted variable \u2192 tambah kontrol yang benar.",
        "Untuk investasi: regresi inilah mesin CAPM & Fama-French — beta, alpha, dan factor exposure semuanya diestimasi via OLS. Event study: AR = +3,8%, SE = 1,5% \u2192 t = 2,53 > 1,96 \u2192 signifikan: pasar benar-benar bereaksi, bukan noise.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regresi buta terhadap kausasi: OLS hanya melihat ko-gerakan. Meregresi insentif manajer pada kinerja tanpa instrumen = kausalitas dua arah (endogenitas). Klaim kausal dari data observasional tanpa desain = spekulasi berjas.",
      },
      reference: "DW jauh dari 2 \u2192 Newey-West. Corong \u2192 White SE. VIF > 10 \u2192 drop/gabung.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: model regresi yang bisa dipercaya",
      prose: [
        "Skenario 1 — R² 0,94, semua koefisien signifikan. → Jangan percaya dulu: cek autokorelasi residual (Durbin-Watson), VIF multikolinearitas, dan — yang paling penting — performa out-of-sample.",
        "Skenario 2 — Menambah variabel ke model. → Lihat adjusted R², bukan R². R² selalu naik; adjusted yang turun = tolak variabelnya.",
        "Skenario 3 — t-stat 'signifikan' di data time series. → Hitung ulang dengan Newey-West SE. Banyak 'sinyal' (seperti HML dengan t = 2,8 → 1,6) mati setelah koreksi — dan lima tahun live trading membuktikannya.",
        "Skenario 4 — Koefisien terlihat besar dan menarik. → Curigai omitted variable bias: bias = β_omitted × Cov/Var. Kontrol sektor & size sebelum mengklaim 'ESG outperform'.",
        "Skenario 5 — Residual membentuk corong atau DW jauh dari 2. → Heteroskedastisitas → White/robust SE; multikolinearitas (VIF > 10) → drop/gabung atau ridge/lasso; autokorelasi → Newey-West atau tambah lag.",
        "Aturan praktis 10 detik: R² tinggi → diagnostik dulu; tambah variabel → adjusted; time series → Newey-West; koefisien besar → cek OVB; residual berpola → obati.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Melaporkan R² in-sample sebagai bukti model bagus. Tanpa train/test split berbasis waktu dan SE yang benar, signifikansi adalah ilusi — quant fund 2008 dengan R² 0,94 adalah buktinya.",
      },
    },
    {
      id: "minicase-2008",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Autopsi fund 2008: checklist pre-launch",
      prose: [
        "Quant fund: R\u00b2 0,94, 12 variabel, 40 observasi, semua \u2018signifikan\u2019. 2008: kolaps. Autopsi: DW 0,7, VIF rata-rata 8, backtest hanya in-sample. Tiga dosa: autokorelasi (t-stat inflated), overfitting (12 variabel/40 obs), tanpa diagnostik.",
        "Checklist pre-launch agar tidak terulang: (1) train/test split waktu (bukan acak); (2) lapor out-of-sample R\u00b2 (bukan in-sample); (3) Newey-West SE sebagai default; (4) maksimal 1 variabel per 10 observasi; (5) paper trade 3 bulan sebelum modal riil.",
        "Menjelaskan ke klien tanpa jargon: \u201cModel kami terlihat 94% akurat di data lama, tetapi 3 dari 12 sinyalnya ternyata noise — seperti menemukan pola di awan. Kami menyederhanakan ke 9 sinyal yang terbukti, dan mulai sekarang semua model diuji di data yang belum pernah dilihat model.\u201d",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "12 variabel untuk 40 observasi = overfitting yang dijamin secara matematis. Aturan praktis: maksimal 1 variabel per 10 observasi.",
      },
      reference: "Diagnostik bukan opsional — ia adalah analisisnya.",
    },
    {
      id: "newey-west-faktor",
      eyebrow: "Langkah 8 · Newey-West & faktor kolinear",
      title: "SE yang jujur untuk data berisik",
      prose: [
        "Quant meregresi return portofolio ke lima faktor (MKT, SMB, HML, momentum, quality), 120 bulan. OLS: HML t = 2,8 → “signifikan, tambah exposure value!”. Rekan yang curiga menghitung ulang dengan Newey-West: t = 1,6 → tidak signifikan. Lima tahun live trading kemudian: exposure HML tidak membayar — sinyalnya memang tidak pernah ada. Dosa asalnya: residual return berkorelasi antar-waktu (volatility clustering membuat error bulan ini mirip bulan lalu), sehingga SE OLS underestimate sekitar 40% dan t-stat menggelembung.",
        "Newey-West (HAC): standard error yang robust terhadap heteroskedastisitas DAN autokorelasi — koefisien tidak berubah, yang berubah hanya SE (dan t-stat). Lag truncation L: aturan praktis L ≈ 4×(T/100)^(2/9) — T = 120 bulan → L ≈ 4; T = 1.250 harian → L ≈ 7. L terlalu kecil → koreksi kurang menggigit; L terlalu besar → SE jadi noisy. Default praktisi: untuk data return time series, selalu pakai Newey-West — OLS SE hanya untuk cross-section.",
        "Multikolinearitas dalam data faktor: HML dan satu proxy value lain berkorelasi 0,95 → VIF = 10,3 → drop satu atau gabung jadi komposit. Pasangan berkorelasi 0,70 → VIF = 2,0 → aman, pertahankan keduanya. Gejala klasik: tanda koefisien terbalik dari intuisi ekonomi, atau koefisien lompat besar saat satu variabel dibuang. Jangan “tambah data” — data lebih banyak tidak memisahkan X yang kolinear.",
        "Kapan R² menipu dalam finance: (1) regresi level harga — spurious (harga kemarin ≈ harga hari ini); (2) in-sample vs out-of-sample — R² 0,35 in-sample tetapi 0,02 walk-forward = model menghafal; (3) R² terdongkrak dummy krisis atau outlier. Aturan analis: selalu laporkan adjusted R² + out-of-sample R² + DW dalam satu paket; R² tanpa ketiganya = angka hiasan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `vif_tinggi` (r=0,95) dan `vif_rendah` (r=0,70)" },
        { id: "t2", text: "Tentukan `drop` (True jika vif_tinggi > 10), cetak ketiganya" },
      ],
      expected: "vif_tinggi=10.3  vif_rendah=2.0  drop=True",
      note: {
        title: "Intuisi: baca diagnostik dulu, koefisien belakangan",
        body: "Praktisi regresi yang berpengalaman tidak pernah membaca koefisien sebelum membaca diagnostik — urutannya selalu: plot residual, DW, VIF, baru tabel koefisien. Lima menit di awal ini menyelamatkan lima tahun live trading yang salah arah, seperti kasus quant yang mengejar HML “signifikan” padahal t-statnya kembung 40%. Kedua, untuk data return, Newey-West bukan opsi melainkan default: pasar punya memori (volatility clustering), dan OLS yang mengasumsikan error independen sedang berbohong pada dirinya sendiri. Ketiga, curigai setiap t-stat yang “terlalu bagus untuk jadi kenyataan” — t di atas 3 dari 120 observasi dengan 8 variabel hampir selalu berarti ada yang salah di SE, bukan berarti kamu menemukan alpha. Keempat, R² in-sample adalah nilai latihan; yang menentukan bonusmu adalah out-of-sample. Empat kebiasaan — diagnostik dulu, Newey-West default, curigai t-stat cantik, validasi out-of-sample — membedakan analis yang dihormati risk manager dari yang hanya dihormati spreadsheetnya. Kelima: dokumentasikan setiap keputusan diagnostik — catat DW, VIF, dan pilihan lag Newey-West di working paper; enam bulan kemudian kamu tidak akan ingat kenapa memilih L=4, dan reviewer pasti bertanya.",
      },
      hints: [
        "VIF = 1/(1−r²).",
        "Ambang keputusan: VIF > 10 = drop salah satu.",
        "vif = 1/(1-r**2)",
      ],
      code: {
        starter: `# VIF: seberapa "duplikat" sebuah faktor (r = korelasi antar-faktor)
r_tinggi, r_rendah = 0.95, 0.70

# TULIS KODEMU
vif_tinggi = 
vif_rendah = 
drop = 

print(f"vif_tinggi={vif_tinggi:.1f}  vif_rendah={vif_rendah:.1f}  drop={drop}")`,
        lockLines: 2,
        solution: `# VIF: seberapa "duplikat" sebuah faktor (r = korelasi antar-faktor)
r_tinggi, r_rendah = 0.95, 0.70

# TULIS KODEMU
vif_tinggi = 1/(1-r_tinggi**2)
vif_rendah = 1/(1-r_rendah**2)
drop = vif_tinggi > 10

print(f"vif_tinggi={vif_tinggi:.1f}  vif_rendah={vif_rendah:.1f}  drop={drop}")`,
        checks: [
          { kind: "equal", task: "t1", name: "vif_tinggi", value: 10.3, tol: 0.1, label: "`vif_tinggi` sekitar 10.3", msg: "1/(1−0,95²) = 10,3 > 10 → faktor duplikat, drop satu." },
          { kind: "equal", task: "t1", name: "vif_rendah", value: 2.0, tol: 0.1, label: "`vif_rendah` sekitar 2.0", msg: "1/(1−0,70²) = 1,96 → aman, pertahankan keduanya." },
          { kind: "stdout_matches", task: "t2", pattern: "vif_tinggi=10\.3\s+vif_rendah=2\.0\s+drop=True", label: "`print` menampilkan ketiganya", msg: "Format: vif_tinggi=...  vif_rendah=...  drop=... ." },
        ],
      },
      reference: "Newey-West = SE jujur untuk return. VIF > 10 = drop. R² + OOS + DW = paket wajib.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: adjusted R\u00b2, heteroskedastisitas, event study, dan autokorelasi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tambah variabel: R\u00b2 0,72\u21920,75, adjusted 0,70\u21920,68. Keputusan?",
          options: [
            { text: "Pertahankan (R\u00b2 naik)", why: "Salah: R\u00b2 selalu naik tambah variabel — bahkan variabel sampah." },
            { text: "Tolak — adjusted turun, variabel tidak membantu", why: "Benar: adjusted yang jujur — turun = variabel sampah.", correct: true },
            { text: "Tambah lagi", why: "Salah: menambah variabel sampah lagi memperburuk." },
            { text: "Tidak bisa diputuskan", why: "Salah: bisa — adjusted R\u00b2 adalah wasitnya." },
          ],
        },
        {
          q: "Residual membentuk corong (melebar ke kanan). Ini?",
          options: [
            { text: "Normal", why: "Salah: residual sehat menyebar acak, bukan corong." },
            { text: "Heteroskedastisitas — pakai White robust SE", why: "Benar: varians tidak konstan \u2192 SE salah. Koreksi: robust SE atau transformasi.", correct: true },
            { text: "Autokorelasi", why: "Salah: itu soal korelasi antar-waktu (DW), bukan bentuk sebaran." },
            { text: "Model sempurna", why: "Salah: corong = gejala penyakit, bukan kesempurnaan." },
          ],
        },
        {
          q: "Event study: AR = +3,8%, SE = 1,5%. Signifikan (5%)?",
          options: [
            { text: "Tidak", why: "Salah: hitung t = 3,8/1,5 = 2,53." },
            { text: "Ya — t = 2,53 > 1,96", why: "Benar: 3,8/1,5 = 2,53 > 1,96 \u2192 tolak H0. Pasar benar-benar bereaksi, bukan noise.", correct: true },
            { text: "Butuh R\u00b2", why: "Salah: uji signifikansi butuh t-stat, bukan R\u00b2." },
            { text: "Tidak bisa diuji", why: "Salah: AR/SE = t-stat — bisa diuji." },
          ],
        },
        {
          q: "DW = 0,7 pada regresi return saham. Kesimpulan?",
          options: [
            { text: "Model bagus — residual kecil", why: "Salah: DW bukan ukuran besar residual." },
            { text: "Autokorelasi positif — SE terlalu kecil, t-stat tidak bisa dipercaya", why: "Benar: DW \u2248 2 = bersih; 0,7 = autokorelasi positif kuat. Solusi: Newey-West SE.", correct: true },
            { text: "Heteroskedastisitas — transformasi log", why: "Salah: DW menguji autokorelasi, bukan heteroskedastisitas." },
            { text: "Tidak ada masalah — DW < 2 normal", why: "Salah: 0,7 jauh dari 2 = masalah serius." },
          ],
        },
      ],
      summary: [
        "Adjusted R\u00b2, bukan R\u00b2 — turun = tolak variabel.",
        "4 misspesifikasi: omitted (bias), hetero (SE salah), multikol (VIF > 10), autokorelasi (DW \u2248 2).",
        "Koreksi: tambah variabel, White SE, drop/gabung, Newey-West.",
        "OVB: koefisien \u201cmencuri\u201d efek variabel hilang — kontrol dulu sebelum klaim.",
        "Plot residual selalu. Diagnostik = analisisnya.",
      ],
      next: { label: "PM-B2 — Time Series: AR, Unit Root & GARCH", href: "/learn/pm-b2-timeseries" },
    },
  ],
};

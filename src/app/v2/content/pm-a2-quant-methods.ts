import type { V2Lesson } from "../lib/types";

const TVM_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Tiga kurva compounding: Rp1 juta tumbuh 20 tahun pada r 5, 10, dan 15 persen; kurva 15 persen melesat jauh di atas.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="86.7" x2="500" y2="86.7"/><line x1="60" y1="153.3" x2="500" y2="153.3"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">18</text><text x="54" y="90">12</text><text x="54" y="157">6</text><text x="54" y="224">0</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">FV (Rp juta)</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0</text><text x="170" y="240">5</text><text x="280" y="240">10</text><text x="390" y="240">15</text><text x="500" y="240">20 thn</text></g>
<polyline points="60,208.9 82,208.3 104,207.8 126,207.1 148,206.5 170,205.8 192,205.1 214,204.4 236,203.6 258,202.8 280,201.9 302,201.0 324,200.0 346,199.0 368,198.0 390,196.9 412,195.7 434,194.5 456,193.3 478,191.9 500,190.5" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="60,208.9 82,207.8 104,206.6 126,205.2 148,203.7 170,202.1 192,200.3 214,198.3 236,196.2 258,193.8 280,191.2 302,188.3 324,185.1 346,181.6 368,177.8 390,173.6 412,168.9 434,163.8 456,158.2 478,152.0 500,145.3" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<polyline points="60,208.9 82,207.2 104,205.3 126,203.1 148,200.6 170,197.7 192,194.3 214,190.4 236,186.0 258,180.9 280,175.0 302,168.3 324,160.6 346,151.6 368,141.4 390,129.6 412,116.0 434,100.4 456,82.5 478,61.9 500,38.1" fill="none" stroke="var(--c3)" stroke-width="2.5"/>
<g font-size="10" font-family="var(--font-ui)" fill="var(--chart-text)"><line x1="300" y1="14" x2="322" y2="14" stroke="var(--c1)" stroke-width="2.5"/><text x="326" y="17">r = 5%</text><line x1="368" y1="14" x2="390" y2="14" stroke="var(--c2)" stroke-width="2.5"/><text x="394" y="17">r = 10%</text><line x1="444" y1="14" x2="466" y2="14" stroke="var(--c3)" stroke-width="2.5"/><text x="470" y="17">r = 15%</text></g>
<g font-size="10" font-family="var(--font-ui)" fill="var(--chart-text)" text-anchor="end"><text x="494" y="184">2,65 jt</text><text x="494" y="139">6,73 jt</text><text x="494" y="32">16,37 jt</text></g>
</svg>`;

export const pma2: V2Lesson = {
  slug: "pm-a2-quant-methods",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A2 Quant Methods: TVM, Statistik & Regresi",
  estMinutes: 65,
  steps: [
    {
      id: "tvm-perpetuitas",
      eyebrow: "Langkah 1 · Time Value of Money + chart",
      title: "\u201cSelamanya\u201d yang ternyata terbatas",
      prose: [
        "Dimas menang undian: pilih Rp1 miliar tunai atau Rp50 juta per tahun selamanya. Temannya bilang \u201cambil tahunan, selamanya!\u201d. Dengan discount rate 8%, \u201cselamanya\u201d itu bernilai Rp625 juta hari ini — kalah dari Rp1 miliar tunai. Uang punya nilai waktu: Rp1 hari ini \u2260 Rp1 tahun depan.",
        "Rumus intinya: FV = PV(1+r)^N; PV = FV/(1+r)^N; anuitas PV = PMT \u00d7 [1 \u2212 (1+r)^\u2212N]/r; perpetuitas PV = PMT/r. NPV = \u03a3 CF_t/(1+r)^t \u2212 investasi (terima jika > 0); IRR = r saat NPV = 0 (terima jika > required return).",
        "Cara membaca: sumbu X = tahun (0–20), sumbu Y = future value dalam Rp juta dari modal awal Rp1 juta; tiga kurva = tiga tingkat return tahunan.",
        "Interpretasi: kurva 15% melesat eksponensial jauh di atas 5% — selisih 10 poin return mengubah hasil akhir 20 tahun dari Rp2,65 juta menjadi Rp16,37 juta (6x lipat). Inilah mengapa membandingkan return harus selalu dalam EAR, bukan nominal.",
      ],
      figure: {
        svg: TVM_SVG,
        alt: "Tiga kurva compounding dari Rp1 juta selama 20 tahun untuk r 5 persen, 10 persen, dan 15 persen; kurva 15 persen melesat jauh di atas.",
        caption: "FV = 1 × (1+r)^N dalam Rp juta. Perbedaan kecil di r ter-compound menjadi jurang besar — persis alasan discount rate harus tepat sebelum menghitung PV perpetuitas di atas.",
      },
      formula: String.raw`PV_{\text{perp}} = \frac{PMT}{r} \qquad;\qquad PV_{\text{anuitas}} = PMT \times \frac{1 - (1+r)^{-N}}{r}`,
      formulaNote: "PMT = arus kas per periode (Rp50 juta/tahun); r = discount rate per periode (8% = 0,08 — satuannya harus konsisten dengan PMT: tahunan dengan tahunan); N = jumlah periode anuitas. Interpretasi: PV adalah nilai hari ini dari seluruh arus kas masa depan — Rp625 juta artinya menerima Rp50 juta/tahun selamanya setara dengan memegang Rp625 juta tunai hari ini pada r 8%. Contoh angka: PMT Rp50 juta, r 8% → PV perpetuitas = 50/0,08 = Rp625 juta; anuitas 20 tahun = 50 × [1 − 1,08^−20]/0,08 = 50 × 9,818 = Rp490,9 juta.",
      tasks: [
        { id: "t1", text: "Hitung `pv` perpetuitas Rp50jt/tahun dengan `r` = 8% (dalam Rp juta)" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "pv=625",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira \u201cselamanya\u201d = tidak terhingga. Discounting membuat arus kas jauh nyaris nol — perpetuitas selalu terbatas selama r > 0.",
      },
      hints: [
        "Perpetuitas = PMT dibagi discount rate.",
        "Satuan: Rp juta. PMT = 50, r = 0.08.",
        "pv = 50 / 0.08",
      ],
      code: {
        starter: `PMT = 50   # Rp juta per tahun, selamanya\nr = 0.08\n\n# TULIS KODEMU: PV perpetuitas\npv = \n\nprint(f"pv={pv}")`,
        lockLines: 2,
        solution: `PMT = 50   # Rp juta per tahun, selamanya\nr = 0.08\n\n# TULIS KODEMU: PV perpetuitas\npv = PMT / r\n\nprint(f"pv={pv}")`,
        checks: [
          { kind: "defined", task: "t1", name: "pv", label: "`pv` terdefinisi", msg: "Buat variabel bernama pv di kode editable." },
          { kind: "equal", task: "t1", name: "pv", value: 625, tol: 1e-9, label: "`pv` seharusnya 625", msg: "Perpetuitas = PMT/r = 50/0,08 = 625 (Rp juta)." },
          { kind: "stdout_matches", task: "t2", pattern: "pv=625", label: "`print` menampilkan pv", msg: "Cetak dengan format pv=... ." },
        ],
      },
      reference: "Perpetuitas PV = PMT/r. NPV > 0 = terima; IRR > required = terima.",
    },
    {
      id: "ear",
      eyebrow: "Langkah 2 · EAR",
      title: "Bandingkan bunga dengan EAR, bukan nominal",
      prose: [
        "Deposito A: 12% nominal compounded monthly. Deposito B: 11,8% nominal compounded quarterly. Mana lebih baik? Nominal menipu — bandingkan EAR = (1 + r/m)^m \u2212 1. EAR_A = 12,68%, EAR_B = 12,33%: A menang meski selisih nominal cuma 0,2%.",
        "Aturan yang sama berlaku di keputusan pensiun: 7% nominal bulanan \u2260 7% efektif tahunan. EAR = (1+0,07/12)^12\u22121 = 7,23%. Campur nominal dengan EAR = jawaban salah yang terlihat benar.",
      ],
      formula: String.raw`EAR = \left(1 + \frac{r}{m}\right)^{m} - 1`,
      formulaNote: "r = tingkat bunga nominal tahunan (12% = 0,12); m = frekuensi compounding per tahun (12 = bulanan, 4 = kuartalan, 365 = harian). Interpretasi: EAR adalah bunga “sebenarnya” selama setahun setelah efek bunga-berbunga — satu-satunya angka yang fair untuk membandingkan produk dengan frekuensi berbeda. Contoh angka: 12% nominal bulanan → (1 + 0,12/12)^12 − 1 = 12,68%; bandingkan dengan 11,8% nominal kuartalan → (1 + 0,118/4)^4 − 1 = 12,33%.",
      tasks: [
        { id: "t1", text: "Hitung `ear_a` (12% monthly) dan `ear_b` (11,8% quarterly)" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "ear_a=0.1268  ear_b=0.1233",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan nominal beda frekuensi langsung. 12% bulanan vs 11,8% kuartalan: nominal hampir sama, EAR beda 0,35 poin.",
      },
      hints: [
        "EAR = (1 + r/m)**m - 1, dengan m = frekuensi per tahun.",
        "Deposito A: m = 12. Deposito B: m = 4.",
        "ear_a = (1 + 0.12/12)**12 - 1\near_b = (1 + 0.118/4)**4 - 1",
      ],
      code: {
        starter: `# TULIS KODEMU: EAR dua deposito\near_a = \near_b = \n\nprint(f"ear_a={ear_a:.4f}  ear_b={ear_b:.4f}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: EAR dua deposito\near_a = (1 + 0.12/12)**12 - 1\near_b = (1 + 0.118/4)**4 - 1\n\nprint(f"ear_a={ear_a:.4f}  ear_b={ear_b:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ear_a", value: 0.1268, tol: 1e-4, label: "`ear_a` sekitar 0.1268", msg: "(1+0,12/12)^12 \u2212 1 = 12,68%. Cek m = 12." },
          { kind: "equal", task: "t1", name: "ear_b", value: 0.1233, tol: 1e-4, label: "`ear_b` sekitar 0.1233", msg: "(1+0,118/4)^4 \u2212 1 = 12,33%. Cek m = 4." },
          { kind: "stdout_matches", task: "t2", pattern: "ear_a=0\\.1268\\s+ear_b=0\\.1233", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Proyek A: -100, +120 (tahun 1). Proyek B: -1000, +1150 (tahun 1). Mutually exclusive, r = 10%. Keputusan?",
          options: [
            { text: "Pilih A — IRR 20% > 15%", why: "Salah: IRR buta skala. A: NPV 9,09; B: NPV 45,45. Untuk mutually exclusive, NPV adalah wasit terakhir." },
            { text: "Pilih B — NPV 45,45 > 9,09", why: "Benar: NPV mengukur nilai absolut dalam rupiah. IRR A lebih tinggi tetapi dari basis modal yang jauh lebih kecil.", correct: true },
            { text: "Pilih A — modal lebih kecil", why: "Salah: modal kecil bukan kriteria keputusan; yang dihitung nilai tambah absolut." },
            { text: "Tolak keduanya — return kurang dari 25%", why: "Salah: 25% bukan hurdle yang diberikan (r = 10%); kedua NPV positif." },
          ],
        },
      ],
      reference: "EAR = (1+r/m)^m \u2212 1. Proyek mutually exclusive: NPV menang atas IRR.",
    },
    {
      id: "ztest",
      eyebrow: "Langkah 3 · Hypothesis Testing",
      title: "Skill atau noise? Uji dengan z",
      prose: [
        "Manajer mengklaim strateginya mengalahkan pasar. Kamu punya sampel n = 100 bulan, EXCESS return (return strategi − return benchmark) rata-rata 0,8%/bulan, s = 5%. Alurnya: (1) H0: \u03bc = 0 vs Ha: \u03bc \u2260 0; (2) \u03b1 = 5%; (3) z = (x\u0304 \u2212 \u03bc0)/(s/\u221an); (4) tolak H0 jika |z| > 1,96 atau p < \u03b1; (5) simpulkan. CATATAN: menguji mean return strategi terhadap NOL hanya menguji apakah return-nya positif — BUKAN apakah ia mengalahkan pasar. Klaim “mengalahkan pasar” hanya bisa diuji pada SELISIH return strategi − benchmark (atau pada alpha regresi). Versi lama lesson ini menguji return mentah terhadap nol sambil mengklaim menguji outperformance — salah. Di lesson ini, 0,8% dan 5% adalah statistik dari EXCESS return, bukan return mentah; H0 di atas adalah H0: μ_excess = 0.",
        "Di sini SE = 5/\u221a100 = 0,5%; z = 0,8/0,5 = 1,60 < 1,96 \u2192 gagal tolak H0. Belum cukup bukti ada EXCESS return positif (outperformance) — dan itu bukan bukti excess return-nya nol. Dengan n = 400, z = 3,2 \u2192 tolak: power matters.",
      ],
      formula: String.raw`z = \frac{\bar{x}-\mu_0}{s/\sqrt{n}} \quad;\quad \text{tolak } H_0 \text{ jika } |z| > 1{,}96 \ (\alpha=5\%)`,
      formulaNote: "x̄ = rata-rata EXCESS return sampel (strategi − benchmark; 0,8%/bulan); μ0 = nilai yang diklaim hipotesis nol (0%); s = simpangan baku sampel (5%); n = ukuran sampel (100); s/√n = standard error (0,5%). Interpretasi: z mengukur berapa standard error rata-rata sampel menyimpang dari nol — z = 1,60 artinya rata-rata 0,8% hanya 1,6 SE di atas nol, belum meyakinkan pada α 5% (butuh |z| > 1,96). Contoh angka: dengan n = 400, SE = 5/√400 = 0,25% → z = 0,8/0,25 = 3,2 → tolak H0. Sampel 4x lipat mengubah kesimpulan tanpa mengubah data.",
      tasks: [
        { id: "t1", text: "Hitung `se` (standard error)" },
        { id: "t2", text: "Hitung `z` dan cetak keduanya" },
      ],
      expected: "se=0.5  z=1.6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cGagal tolak H0\u201d \u2260 \u201cH0 benar\u201d. Mungkin sampel kurang besar. Dan Type I = false alarm (tolak H0 yang benar); Type II = miss (gagal tolak H0 yang salah).",
      },
      hints: [
        "Standard error = s dibagi akar n.",
        "z = (mean \u2212 0) / se.",
        "se = s / n**0.5\nz = mean / se",
      ],
      code: {
        starter: `n, mean, s = 100, 0.8, 5.0  # mean, s = statistik EXCESS return (strategi - benchmark), BUKAN return mentah\n\n# TULIS KODEMU\nse = \nz = \n\nprint(f"se={se}  z={z}")`,
        lockLines: 1,
        solution: `n, mean, s = 100, 0.8, 5.0  # mean, s = statistik EXCESS return (strategi - benchmark), BUKAN return mentah\n\n# TULIS KODEMU\nse = s / n**0.5\nz = mean / se\n\nprint(f"se={se}  z={z}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.5, tol: 1e-9, label: "`se` seharusnya 0.5", msg: "SE = 5/\u221a100 = 0,5. Jangan lupa akar n." },
          { kind: "equal", task: "t2", name: "z", value: 1.6, tol: 1e-9, label: "`z` seharusnya 1.6", msg: "z = 0,8/0,5 = 1,6 < 1,96 \u2192 gagal tolak H0." },
          { kind: "stdout_matches", task: "t2", pattern: "se=0\\.5\\s+z=1\\.6", label: "`print` menampilkan keduanya", msg: "Format: se=...  z=... ." },
        ],
      },
      quiz: [
        {
          q: "p-value = 0,03. Interpretasi yang benar?",
          options: [
            { text: "95% yakin Ha benar", why: "Salah: p-value bukan probabilitas hipotesis benar." },
            { text: "Jika H0 benar, data seekstrem ini muncul 3% dari waktu", why: "Benar: p-value = P(data | H0), bukan P(H0 | data). Ia juga bukan ukuran besar efek.", correct: true },
            { text: "H0 3% benar", why: "Salah: p-value tidak mengukur probabilitas H0 benar." },
            { text: "Efeknya besar", why: "Salah: p-value tidak mengukur besar efek — efek kecil bisa signifikan dengan n besar." },
          ],
        },
      ],
      reference: "SE = s/\u221an. Tolak H0 jika |z| > 1,96 atau p < \u03b1. p-value = P(data|H0).",
    },
    {
      id: "geometric",
      eyebrow: "Langkah 4 · Geometric Mean",
      title: "Return +50% lalu \u221250% bukan 0%",
      prose: [
        "Return bersifat perkalian, bukan penjumlahan. Rata-rata aritmatika melebih-lebihkan hasil (volatility drag). Contoh: +50% lalu \u221250%. Mean aritmatika = 0% — padahal modal Rp100 \u2192 Rp150 \u2192 Rp75.",
        "Geometric mean mengikuti uangmu: (1,5 \u00d7 0,5)^0,5 \u2212 1 = \u221213,4%. Selalu pakai geometric untuk return multi-periode.",
      ],
      formula: String.raw`G = \sqrt[n]{x_1 \times x_2 \times \cdots \times x_n} - 1`,
      formulaNote: "x_i = faktor pengali tiap periode (1,5 = +50%; 0,5 = −50%); n = jumlah periode. Interpretasi: G adalah tingkat pertumbuhan konstan yang menghasilkan akumulasi akhir yang sama — satu-satunya rata-rata yang mengikuti uangmu, karena return bersifat perkalian. Contoh angka: (1,5 × 0,5)^0,5 − 1 = −13,4%: modal Rp100 → Rp150 → Rp75 dalam dua tahun, padahal rata-rata aritmatikanya 0%.",
      tasks: [
        { id: "t1", text: "Hitung `g` (geometric, desimal) dari faktor `f1`, `f2`" },
        { id: "t2", text: "Cetak dalam persen 1 desimal" },
      ],
      expected: "g=-13.4%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai mean aritmatika untuk return. (50 \u2212 50)/2 = 0% terlihat benar tetapi salah secara finansial — uangmu tumbuh secara perkalian.",
      },
      hints: [
        "Kalikan faktor, pangkatkan 1/2, kurangi 1.",
        "Cetak persen: kalikan 100 dan format 1 desimal.",
        "g = (f1*f2)**0.5 - 1",
      ],
      code: {
        starter: `f1, f2 = 1.50, 0.50  # faktor pengali\n\n# TULIS KODEMU\ng = \n\nprint(f"g={g*100:.1f}%")`,
        lockLines: 1,
        solution: `f1, f2 = 1.50, 0.50  # faktor pengali\n\n# TULIS KODEMU\ng = (f1*f2)**0.5 - 1\n\nprint(f"g={g*100:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "g", value: -0.133975, tol: 0.002, label: "`g` sekitar \u22120.134", msg: "(1,5 \u00d7 0,5)^0,5 \u2212 1 = \u221213,4%. Jangan lupa kurangi 1 di akhir." },
          { kind: "stdout_matches", task: "t2", pattern: "-13\\.4%", label: "`print` menampilkan persen", msg: "Format persen 1 desimal: g=-13.4%." },
        ],
      },
      reference: "Return multi-periode selalu geometric, bukan aritmatika.",
    },
    {
      id: "regresi",
      eyebrow: "Langkah 5 · Regresi Dasar",
      title: "Garis yang menjelaskan — dan menipu",
      prose: [
        "OLS mencari garis \u0177 = b0 + b1x yang meminimalkan \u03a3 residual\u00b2. b1 = kemiringan (efek x ke y); R\u00b2 = % variasi y yang dijelaskan model (0\u20131). Asumsi klasik: linearitas, residual acak (homoskedastisitas), independen, normal untuk inferensi.",
        "Contoh pasar: regresi return saham (y) vs return pasar (x): \u0177 = 0,002 + 1,3x, R\u00b2 = 0,65. b1 = 1,3 = beta (agresif: pasar naik 1%, saham naik ~1,3%); R\u00b2 = 0,65 berarti 65% gerakan dijelaskan pasar, 35% idiosinkratis. Inilah mesin di balik model penetapan harga aset: regresi return saham terhadap return pasar menghasilkan beta (kemiringannya), dan model multi-faktor menambahkan faktor ukuran perusahaan dan valuasi sebagai regressor tambahan — semuanya regresi yang sama, hanya variabel x-nya yang berbeda.",
        "Batasnya: R\u00b2 tinggi \u2260 kausalitas. Regresi hanya melihat ko-gerakan — \u201cberapa\u201d, bukan \u201cmengapa\u201d. Regresi palsu (spurious): dua harga saham yang sama-sama trending akan berkorelasi tinggi padahal keduanya cuma ikut tren. Dan jangan ekstrapolasi di luar rentang data.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Overfitting: mengoptimasi parameter hingga backtest 3 tahun terlihat bagus = menghafal noise masa lalu. Klaim \u201creturn 25% p.a.\u201d dari backtest yang dioptimasi juga melanggar I(C) Misrepresentation + III(D).",
      },
      reference: "Slope = beta. R\u00b2 = explanatory power, bukan kausalitas. Waspadai overfitting & ekstrapolasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: alat kuantitatif untuk pertanyaan apa",
      prose: [
        "Skenario 1 — Membandingkan dua arus kas di waktu berbeda (lump sum vs cicilan, proyek A vs proyek B). → Hitung PV keduanya dengan discount rate yang sama, pilih PV tertinggi. Pak Budi: lump sum Rp2M vs PV cicilan Rp1,94M — lump sum menang tipis plus fleksibilitas.",
        "Skenario 2 — Membandingkan produk bunga dengan frekuensi compounding berbeda. → Bandingkan EAR, bukan nominal: EAR = (1+r/m)^m − 1. Deposito 12% bulanan (EAR 12,68%) mengalahkan 11,8% kuartalan (EAR 12,33%) meski selisih nominal cuma 0,2%.",
        "Skenario 3 — Seseorang mengklaim strateginya mengalahkan pasar. → Uji hipotesis: z = (x̄−μ0)/(s/√n), tolak H0 hanya jika |z| > 1,96. Gagal tolak ≠ bukti return nol — dan cek power: n = 100 vs n = 400 bisa membalik kesimpulan.",
        "Skenario 4 — Merata-ratakan return multi-periode. → Pakai geometric mean, bukan aritmatika: +50% lalu −50% = −13,4%, bukan 0%. Aritmatika melebih-lebihkan karena volatility drag.",
        "Skenario 5 — Mengukur sensitivitas saham ke pasar. → Regresi OLS return saham vs pasar: kemiringan = beta, R² = porsi gerakan yang dijelaskan. Lalu cek asumsi: residual harus acak, bukan berpola.",
        "Aturan praktis 10 detik: beda waktu → PV; beda compounding → EAR; klaim outperformance → uji z pada EXCESS return; rata-rata return → geometric; hubungan dua variabel → regresi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mencampur nominal dengan EAR dalam satu perhitungan — atau merata-ratakan return dengan aritmatika. Keduanya menghasilkan jawaban yang terlihat tepat secara hitungan tetapi salah secara makna, dan keduanya muncul di soal ujian maupun keputusan nyata.",
      },
    },
    {
      id: "minicase-pensiun",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Tawaran pensiun dini Pak Budi",
      prose: [
        "Pak Budi (55 tahun) ditawari: Rp2 miliar lump sum atau Rp15 juta/bulan selama 20 tahun. Discount rate 7%/tahun.",
        "Hitung bulanan: r = 7%/12 = 0,5833%, N = 240. PV = 15jt \u00d7 [1 \u2212 (1,005833)^\u2212240]/0,005833 = 15jt \u00d7 129,0 = Rp1,94 miliar. Lump sum Rp2M menang tipis (+Rp60jt), plus fleksibilitas dan warisan.",
        "Tetapi ada yang tidak ditangkap TVM: longevity risk. Jika Pak Budi hidup sampai 90, anuitas 20 tahun habis di usia 75. Anuitas SEUMUR HIDUP = transfer longevity risk ke pemberi tawaran — nilai non-finansial yang PV tidak ukur. Tetapi anuitas ini BERJANGKA 20 tahun: jika Pak Budi hidup sampai 90, pembayarannya habis di usia 75 dan risiko hidup 75–90 tetap ditanggung Pak Budi sendiri. Transfer penuh butuh anuitas seumur hidup, bukan anuitas berjangka — lesson lama menyatakan transfer secara mutlak tepat setelah mencontohkan batasnya sendiri. Dan disiplin periode: 7% nominal bulanan \u2192 EAR 7,23%; jika depositonya 7% efektif tahunan, discount bulanan yang konsisten = (1,07)^(1/12)\u22121 = 0,5654%, bukan 0,5833%. Campur nominal/EAR = jawaban salah yang terlihat benar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu angka yang wajib diverifikasi sebelum memutuskan: apakah \u201c20 tahun\u201d itu pasti dibayar penuh, atau berhenti jika Pak Budi meninggal? Anuitas yang berhenti saat meninggal vs guaranteed 20 tahun = dua produk berbeda dengan PV berbeda.",
      },
      reference: "PV anuitas bulanan \u2248 Rp1,94M < lump sum Rp2M. TVM mengukur uang, bukan ketidakpastian hidup.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Perhatikan mana yang menguji TVM, statistik, dan regresi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: angka yang “benar” bisa berbohong",
        body: "Tiga intuisi praktisi. Satu: bedakan return uang vs return waktu. Manajer yang menerima setoran besar tepat sebelum rally akan memamerkan money-weighted return yang tinggi — padahal skill-nya nol; time-weighted return-lah yang mengukur kualitas keputusan investasinya, karena ia kebal terhadap timing setoran klien. Selalu tanya: return siapa yang sedang dipamerkan? Dua: geometric untuk uang, aritmatika untuk ekspektasi satu periode — mencampur keduanya adalah cara paling elegan untuk berbohong dengan angka yang benar, seperti “rata-rata 0%” pada contoh +50%/−50%. Tiga: curigai presisi palsu. Estimasi dari 36 bulan data dengan standard error besar yang dilaporkan sampai empat desimal adalah kostum sains di atas tebakan. Aturan praktis: jika kesimpulanmu berubah tanda saat kamu membuang 10% data terburuk, kamu tidak punya temuan — kamu punya noise yang berdandan. Keempat: waspadai survivorship bias dalam data return — database yang hanya berisi dana yang masih hidup membuat rata-rata return terlihat 2–3 poin lebih tinggi dari kenyataan. Selalu tanya: dana yang mati di mana, dan apakah mereka masuk dalam sampelmu?",
      },
      quiz: [
        {
          q: "Rp50jt/tahun selamanya, discount 8%. PV?",
          options: [
            { text: "Rp625 juta", why: "Benar: perpetuitas PV = PMT/r = 50jt/0,08 = Rp625jt. \u201cSelamanya\u201d terdengar besar, tetapi discounting membuatnya terbatas.", correct: true },
            { text: "Rp1 miliar", why: "Salah: itu angka nominal tanpa discounting — persis jebakan Dimas." },
            { text: "Rp400 juta", why: "Salah: tidak ada dasarnya; hitung PMT/r." },
            { text: "Tidak terhingga", why: "Salah: discounting membuat perpetuitas selalu terbatas selama r > 0." },
          ],
        },
        {
          q: "Return +50% lalu \u221250%. Return tahunan yang jujur?",
          options: [
            { text: "0% (rata-rata)", why: "Salah: itu mean aritmatika — berbohong untuk return yang bersifat perkalian." },
            { text: "\u221213,4% (geometric)", why: "Benar: (1,5\u00d70,5)^0,5 \u2212 1 = \u221213,4%. Modal Rp100 \u2192 Rp150 \u2192 Rp75.", correct: true },
            { text: "+25%", why: "Salah: tidak ada dasarnya." },
            { text: "\u221225%", why: "Salah: itu setengah dari \u221250%, bukan hasil perhitungan geometric." },
          ],
        },
        {
          q: "z-stat 1,80, \u03b1=5% dua sisi (kritis 1,96). Keputusan?",
          options: [
            { text: "Tolak H0 — terbukti", why: "Salah: 1,80 < 1,96. Dan \u201cterbukti\u201d bukan bahasa hypothesis testing." },
            { text: "Gagal tolak H0 — belum cukup bukti", why: "Benar: 1,80 < 1,96 \u2192 gagal tolak. Bukan bukti H0 benar — mungkin sampel kurang besar.", correct: true },
            { text: "Terima H0", why: "Salah: bahasa yang benar adalah \u201cgagal tolak\u201d, bukan \u201cterima\u201d." },
            { text: "Ulangi dengan \u03b1=10%", why: "Salah: mengubah \u03b1 setelah melihat hasil = p-hacking." },
          ],
        },
        {
          q: "Regresi return saham vs pasar: slope 1,3, R\u00b2 0,65. Artinya?",
          options: [
            { text: "Beta 1,3; 65% gerakan dijelaskan pasar", why: "Benar: slope = beta (agresif, >1); R\u00b2 = explanatory power. 35% sisanya = risiko idiosinkratis yang bisa didiversifikasi.", correct: true },
            { text: "Alpha 1,3", why: "Salah: alpha = intercept (b0), bukan slope." },
            { text: "Korelasi 0,65", why: "Salah: korelasi = \u221a0,65 \u2248 0,81 (satu variabel); R\u00b2 bukan korelasi." },
            { text: "Saham naik 65%", why: "Salah: R\u00b2 bukan prediksi return." },
          ],
        },
      ],
      summary: [
        "TVM: diskon selalu; bandingkan dalam nilai hari ini. EAR untuk bandingkan bunga beda frekuensi.",
        "Return multi-periode: geometric, bukan aritmatika.",
        "Hypothesis testing: p < \u03b1 baru tolak H0; \u201cgagal tolak\u201d \u2260 \u201cH0 benar\u201d.",
        "Regresi: slope = beta, R\u00b2 = explanatory power; R\u00b2 tinggi \u2260 kausalitas; waspadai overfitting dan ekstrapolasi.",
        "Proyek mutually exclusive: NPV menang atas IRR.",
      ],
      next: { label: "PM-A2B — Quant Lanjut: Distribusi, Uji Hipotesis & Regresi", href: "/v2/learn/pm-a2b-quant-lanjut" },
    },
  ],
};

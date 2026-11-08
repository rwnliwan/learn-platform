import type { V2Lesson } from "../lib/types";

export const b9: V2Lesson = {
  slug: "b9-joint-kovarians",
  track: "Probabilitas",
  module: "Dependensi",
  title: "B9. Joint, Kovarians & Bivariat Normal",
  estMinutes: 55,
  steps: [
    {
      id: "diversifikasi-hilang",
      eyebrow: "Langkah 1 · Joint & marginal",
      title: "Diversifikasi yang menghilang",
      prose: [
        "Manajer portofolio membanggakan: \u201CKami diversifikasi ke 20 saham dengan korelasi rata-rata 0,2 \u2014 risiko kami rendah.\u201D Lalu krisis datang. Korelasi melonjak ke 0,8. Semua saham jatuh bareng. Diversifikasinya menguap tepat saat paling dibutuhkan.",
        "Pelajaran pahit 2008: korelasi bukan konstanta \u2014 ia berubah, dan biasanya naik saat krisis (correlation breakdown). Diversifikasi yang dihitung dari masa damai = payung yang hanya pernah diuji saat cerah.",
        "Fondasinya: distribusi joint. Tabel joint X=telat {0,1}, Y=gagal {0,1}: P(0,0)=0,90, P(0,1)=0,02, P(1,0)=0,05, P(1,1)=0,03. Marginal X: P(telat) = 0,05+0,03 = 8%. Dari joint lahir bersyarat: P(gagal|telat) = 0,03/0,08 = 37,5% (B3!). Joint adalah induk \u2014 marginal & bersyarat lahir darinya.",
      ],
      formula: String.raw`p_X(x) = \sum_y p(x,y), \qquad f_X(x) = \int f(x,y)\,dy`,
      formulaNote: "Marginal = \u201Clupakan Y\u201D: jumlahkan/integralkan Y keluar.",
      tasks: [
        { id: "t1", text: "Hitung `p_telat` = marginal X=1 dari tabel joint" },
        { id: "t2", text: "Hitung `p_gagal_given_telat`, cetak keduanya" },
      ],
      expected: "p_telat=0.08  p_gagal_given_telat=0.375",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Langsung menghitung bersyarat tanpa marginal dulu. Marginal = cek kewarasan: total harus 1, dan marginal harus cocok dengan yang kamu tahu dari data.",
      },
      hints: [
        "p_telat = 0.05 + 0.03.",
        "P(gagal|telat) = P(1,1)/p_telat = 0.03/0.08.",
        "print(f\"p_telat={p_telat}  p_gagal_given_telat={p_gagal_given_telat}\")",
      ],
      code: {
        starter: `# Tabel joint: X=telat {0,1}, Y=gagal {0,1}\njoint = {(0,0): 0.90, (0,1): 0.02, (1,0): 0.05, (1,1): 0.03}\n\n# TULIS KODEMU: marginal P(telat) dan P(gagal|telat)\np_telat = \np_gagal_given_telat = \n\nprint(f"p_telat={p_telat}  p_gagal_given_telat={p_gagal_given_telat}")`,
        lockLines: 2,
        solution: `# Tabel joint: X=telat {0,1}, Y=gagal {0,1}\njoint = {(0,0): 0.90, (0,1): 0.02, (1,0): 0.05, (1,1): 0.03}\n\n# TULIS KODEMU: marginal P(telat) dan P(gagal|telat)\np_telat = joint[(1,0)] + joint[(1,1)]\np_gagal_given_telat = joint[(1,1)] / p_telat\n\nprint(f"p_telat={p_telat}  p_gagal_given_telat={p_gagal_given_telat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_telat", value: 0.08, tol: 1e-9, label: "`p_telat` seharusnya 0,08", msg: "Jumlahkan baris X=1: 0,05+0,03." },
          { kind: "equal", task: "t2", name: "p_gagal_given_telat", value: 0.375, tol: 1e-9, label: "P(gagal|telat) seharusnya 0,375", msg: "0,03/0,08 = 0,375." },
          { kind: "stdout_matches", task: "t2", pattern: "p_telat=0\\.08\\s+p_gagal_given_telat=0\\.375", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Joint = induk. Marginal dulu, baru bersyarat.",
    },
    {
      id: "kovarians-korelasi",
      eyebrow: "Langkah 2 · Kovarians & korelasi",
      title: "Arah gerak bersama",
      prose: [
        "Cov(X,Y) = E[(X\u2212E[X])(Y\u2212E[Y])] = E[XY] \u2212 E[X]E[Y]. Cov > 0: cenderung bergerak searah. Cov < 0: berlawanan arah. Cov = 0: tidak berkorelasi \u2014 TAPI belum tentu independen!",
        "Korelasi = kovarians ternormalisasi (\u22121 s/d 1, tak bersatuan): \u03C1 = Cov/(\u03C3_X\u03C3_Y). Contoh tabel: P(0,0)=0,4, P(0,1)=0,1, P(1,0)=0,1, P(1,1)=0,4. E[X]=E[Y]=0,5, E[XY]=0,4 \u2192 Cov = 0,4\u22120,25 = 0,15 > 0. Var=0,25 \u2192 \u03C1 = 0,15/0,25 = 0,6.",
        "Kovarians positif = \u201Cdiagonal utama\u201D tabel lebih penuh. Korelasi hanya mengukur hubungan linear \u2014 dua variabel bisa berkorelasi 0 tapi berhubungan kuat (non-linear), atau berkorelasi 0,9 tapi tidak kausal.",
      ],
      formula: String.raw`\mathrm{Cov}(X,Y) = E[XY] - E[X]E[Y] \qquad \rho_{X,Y} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X\,\sigma_Y}`,
      formulaNote: "Cov(X,Y) = E[XY] − E[X]E[Y]: rata-rata hasil kali minus kali rata-rata — mengukur kecenderungan bergerak searah (>0) atau berlawanan (<0). σ_X, σ_Y = simpangan baku masing-masing; ρ (rho) = Cov/(σ_X·σ_Y): versi tak bersatuan dalam [−1,1]. Contoh angka: ρ = 0,8 — angka ini artinya kenaikan 1σ di X rata-rata ditemani kenaikan 0,8σ di Y; ρ = 0 artinya tidak berkorelasi linear — TAPI belum tentu independen (Y = X² dengan X simetris punya ρ = 0 persis padahal Y ditentukan X). Korelasi mengukur garis lurus; hubungan melengkung lolos tanpa terdeteksi.",
      tasks: [
        { id: "t1", text: "Hitung `cov` dari tabel joint 2x2" },
        { id: "t2", text: "Hitung `rho`, cetak keduanya 2 desimal" },
      ],
      expected: "cov=0.15  rho=0.60",
      note: {
        title: "Sering salah",
        body: "\u201CKovarians nol berarti independen.\u201D Salah! Nol kovarians = tidak ada hubungan linear. Contoh: X simetris di [\u22121,1], Y=X\u00B2 \u2014 Y sepenuhnya ditentukan X tapi Cov=0. Independen \u2192 kovarians nol, tapi tidak sebaliknya.",
      },
      hints: [
        "E[X] = E[Y] = 0.5; E[XY] = P(1,1) = 0.4.",
        "cov = 0.4 - 0.5*0.5; rho = cov/0.25.",
        "print(f\"cov={cov:.2f}  rho={rho:.2f}\")",
      ],
      code: {
        starter: `# Joint 2x2: P(0,0)=0.4, P(0,1)=0.1, P(1,0)=0.1, P(1,1)=0.4\n\n# TULIS KODEMU: kovarians dan korelasi\ncov = \nrho = \n\nprint(f"cov={cov:.2f}  rho={rho:.2f}")`,
        lockLines: 1,
        solution: `# Joint 2x2: P(0,0)=0.4, P(0,1)=0.1, P(1,0)=0.1, P(1,1)=0.4\n\n# TULIS KODEMU: kovarians dan korelasi\ncov = 0.4 - 0.5*0.5\nrho = cov / 0.25\n\nprint(f"cov={cov:.2f}  rho={rho:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cov", value: 0.15, tol: 1e-9, label: "`cov` seharusnya 0,15", msg: "0,4 \u2212 0,25 = 0,15." },
          { kind: "equal", task: "t2", name: "rho", value: 0.6, tol: 1e-9, label: "`rho` seharusnya 0,6", msg: "0,15/0,25 = 0,6." },
          { kind: "stdout_matches", task: "t2", pattern: "cov=0\\.15\\s+rho=0\\.60", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Cov = E[XY]\u2212E[X]E[Y]. \u03C1 \u2208 [\u22121,1], hanya hubungan linear.",
    },
    {
      id: "bivariat-normal",
      eyebrow: "Langkah 3 · Bivariat normal",
      title: "Kasus istimewa yang jangan digeneralisasi",
      prose: [
        "Jika (X,Y) bivariat normal dengan korelasi \u03C1: marginal X dan Y masing-masing normal, \u03C1=0 \u27FA independen \u2014 SATU-SATUNYA kasus umum di mana \u201Ctidak berkorelasi = independen\u201D! Distribusi bersyarat juga normal: Y|X=x ~ Normal dengan mean \u03BC_Y + \u03C1(\u03C3_Y/\u03C3_X)(x\u2212\u03BC_X) \u2014 ini regresi linear dalam bentuk probabilistik.",
        "Bivariat normal adalah \u201Cwarga teladan\u201D \u2014 semua sifat bagus. Masalahnya: data keuangan nyata bukan warga teladan (ekor tebal, dependensi non-linear) \u2014 di situlah copula (B10) masuk.",
        "Jebakan berbahaya: \u201Cmarginal normal + korelasi \u03C1 = joint-nya bivariat normal.\u201D Salah! Marginal tidak menentukan joint \u2014 ada tak berhingga joint dengan marginal & korelasi sama tapi bentuk dependensi beda. Pra-2008, model CDO memakai korelasi Gaussian dan mengasumsikan joint Gaussian \u2014 salah di ekor, dan ekor itulah yang meledak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model CDO pra-2008 mengasumsikan joint Gaussian dari korelasi saja \u2014 dependensi ekor yang sebenarnya jauh lebih kuat. Korelasi saja tidak menentukan bentuk dependensi (lanjut B10).",
      },
      quiz: [
        {
          q: "Pada bivariat normal, \u03C1=0 berarti\u2026",
          options: [
            { text: "Tidak ada hubungan apa pun", why: "Kurang tepat \u2014 pernyataan yang benar lebih kuat dari itu." },
            { text: "Independen (kasus istimewa!)", why: "Benar: satu-satunya kasus umum di mana nol korelasi \u27FA independen. Jangan generalisasi ke distribusi lain.", correct: true },
            { text: "Marginal tidak normal", why: "Salah: marginal bivariat normal selalu normal." },
          ],
        },
        {
          q: "Cov(X,Y)=0. Kesimpulan yang VALID\u2026",
          options: [
            { text: "X,Y independen", why: "Salah: contoh Y=X\u00B2 \u2014 kovarians nol tapi dependen sempurna." },
            { text: "Tidak ada hubungan linear; bisa tetap dependen non-linear", why: "Benar: nol kovarians = nol hubungan linear saja.", correct: true },
            { text: "Korelasi = 1", why: "Salah: korelasi juga nol." },
          ],
        },
      ],
      reference: "\u03C1=0 \u27FA independen HANYA untuk bivariat normal.",
    },
    {
      id: "var-portofolio",
      eyebrow: "Langkah 4 · Varians portofolio",
      title: "Matematika diversifikasi",
      prose: [
        "Var(w1X1 + w2X2) = w1\u00B2\u03C31\u00B2 + w2\u00B2\u03C32\u00B2 + 2w1w2\u03C1\u03C31\u03C32. Contoh: dua aset \u03C3=20% masing-masing, bobot 50/50. \u03C1=0,2 \u2192 SD = 15,5%. \u03C1=0,8 \u2192 SD = 19,0% (hampir tidak ada manfaat diversifikasi!). \u03C1=\u22120,5 \u2192 SD = 10% (lindung nilai alami).",
        "Asetnya sama, bobotnya sama \u2014 hanya korelasi beda, risiko nyaris 2x lipat (10% \u2192 19%). Korelasi adalah parameter risiko terpenting sekaligus tersulit diestimasi \u2014 dan ia tidak stabil. Jangan percaya diversifikasi tanpa stress korelasi.",
        "Simulasi memverifikasi: dua Normal(0, 0.2) berkorelasi \u03C1, portofolio 50/50. SD naik seiring \u03C1 naik; di \u03C1=1 diversifikasi NOL.",
      ],
      formula: String.raw`\mathrm{Var}(w_1X_1 + w_2X_2) = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2\,w_1w_2\,\rho\,\sigma_1\sigma_2`,
      formulaNote: "w₁, w₂ = bobot portofolio; σ₁, σ₂ = volatilitas tiap aset; ρ = korelasi keduanya. Dua suku pertama = risiko masing-masing yang tertimbang kuadrat; suku terakhir 2w₁w₂ρσ₁σ₂ = interaksi — satu-satunya yang bisa negatif dan satu-satunya sumber diversifikasi. Contoh angka: σ = 20% masing-masing, bobot 50/50. ρ = 0,2 → Var = 0,01+0,01+0,004 = 0,024, SD = 15,5%; ρ = 0,8 → Var = 0,036, SD ≈ 19,0% — angka ini artinya diversifikasi menghemat 4,5 poin volatilitas saat ρ rendah tetapi hanya 1,0 poin saat ρ tinggi; yang menentukan bukanlah σ, melainkan ρ. Di krisis ρ → 1 dan suku penghemat menguap — diversifikasi yang hanya ada saat tenang bukanlah diversifikasi.",
      tasks: [
        { id: "t1", text: "Hitung `sd_rumus` untuk \u03C1=0,2 (dua aset \u03C3=20%, 50/50)" },
        { id: "t2", text: "Simulasikan `N=5000` dan hitung `sd_sim`, cetak keduanya" },
      ],
      expected: "sd_rumus=0.155  sd_sim\u22480.155",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu-satunya free lunch di keuangan adalah korelasi rendah \u2014 dan ia bisa hilang saat krisis. Stress test memakai korelasi stress, bukan korelasi normal.",
      },
      hints: [
        "var = 0.25*0.04 + 0.25*0.04 + 2*0.25*0.2*0.04; sd = var**0.5.",
        "Cholesky: b = 0.2*(rho*z1 + sqrt(1-rho^2)*z2).",
        "Gunakan statistics.pstdev untuk SD simulasi.",
      ],
      code: {
        starter: `import random, statistics\nrandom.seed(91)\nrho, N = 0.2, 5000\n\n# TULIS KODEMU: rumus dan simulasi SD portofolio\nsd_rumus = \nvals = []\nfor _ in range(N):\n    z1, z2 = random.gauss(0,1), random.gauss(0,1)\n    a = 0.2*z1\n    b = 0.2*(rho*z1 + (1-rho**2)**0.5*z2)\n    vals.append(0.5*a + 0.5*b)\nsd_sim = statistics.pstdev(vals)\n\nprint(f"sd_rumus={sd_rumus:.3f}  sd_sim={sd_sim:.3f}")`,
        lockLines: 2,
        solution: `import random, statistics\nrandom.seed(91)\nrho, N = 0.2, 5000\n\n# TULIS KODEMU: rumus dan simulasi SD portofolio\nsd_rumus = (0.25*0.04 + 0.25*0.04 + 2*0.25*rho*0.04) ** 0.5\nvals = []\nfor _ in range(N):\n    z1, z2 = random.gauss(0,1), random.gauss(0,1)\n    a = 0.2*z1\n    b = 0.2*(rho*z1 + (1-rho**2)**0.5*z2)\n    vals.append(0.5*a + 0.5*b)\nsd_sim = statistics.pstdev(vals)\n\nprint(f"sd_rumus={sd_rumus:.3f}  sd_sim={sd_sim:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_rumus", value: 0.1549, tol: 0.001, label: "`sd_rumus` seharusnya \u2248 0,155", msg: "\u221A0,024 \u2248 0,1549." },
          { kind: "equal", task: "t2", name: "sd_sim", value: 0.1549, tol: 0.01, label: "`sd_sim` mendekati 0,155", msg: "Simulasi 5000 harus dekat rumus." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_rumus=0\\.15\\d\\s+sd_sim=0\\.15", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Diversifikasi diuji dengan korelasi krisis, bukan korelasi normal.",
    },
    {
      id: "minicase-hedging",
      eyebrow: "Langkah 5 · Mini-case",
      title: "\u201CHedging\u201D yang bukan hedging",
      prose: [
        "Bank \u201Cmelindungi\u201D portofolio kredit UKM dengan membeli asuransi yang membayar saat default berkorelasi rendah. Korelasi historis default antar debitur: 0,1. Saat resesi sektoral, korelasi aktual: 0,6.",
        "Hedge-nya gagal tepat saat dibutuhkan. Proteksi dihargai dengan asumsi \u03C1=0,1 (independen-ish) \u2014 saat \u03C1=0,6, klaim datang bergerombol melebihi yang dimodelkan; penyedia proteksi bisa ikut gagal (counterparty risk berkorelasi!). Ini replika mini krisis 2008: model korelasi konstan + ekor Gaussian = bencana.",
        "Pelajaran umum: (1) parameter dependensi harus di-stress, bukan diestimasi dari masa tenang; (2) lindung nilai yang bergantung pada korelasi rendah adalah korelasi itu sendiri sebagai risiko \u2014 butuh copula dengan tail dependence (B10) untuk memodelkannya jujur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sd_tenang` dan `sd_krisis` untuk dua aset \u03C3=20%, 50/50" },
        { id: "t2", text: "Cetak keduanya sebagai persen 1 desimal" },
      ],
      expected: "sd_tenang=14.8%  sd_krisis=17.9%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Proteksi yang dihargai dari korelasi masa tenang = premi terlalu murah = penyedia proteksi under-capitalized. Saat krisis, yang \u201Cdilindungi\u201D dan \u201Cpelindung\u201D gagal bareng.",
      },
      hints: [
        "Var = 0.02*(1+rho) untuk kasus ini.",
        "sd = var**0.5; rho 0.1 dan 0.6.",
        "print(f\"sd_tenang={sd_tenang:.1%}  sd_krisis={sd_krisis:.1%}\")",
      ],
      code: {
        starter: `# Dua aset sigma=20%, bobot 50/50: Var = 0.02*(1+rho)\n\n# TULIS KODEMU: SD saat tenang (rho=0.1) vs krisis (rho=0.6)\nsd_tenang = \nsd_krisis = \n\nprint(f"sd_tenang={sd_tenang:.1%}  sd_krisis={sd_krisis:.1%}")`,
        lockLines: 1,
        solution: `# Dua aset sigma=20%, bobot 50/50: Var = 0.02*(1+rho)\n\n# TULIS KODEMU: SD saat tenang (rho=0.1) vs krisis (rho=0.6)\nsd_tenang = (0.02*(1+0.1)) ** 0.5\nsd_krisis = (0.02*(1+0.6)) ** 0.5\n\nprint(f"sd_tenang={sd_tenang:.1%}  sd_krisis={sd_krisis:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_tenang", value: 0.1483, tol: 0.002, label: "`sd_tenang` seharusnya \u2248 14,8%", msg: "\u221A(0,02\u00D71,1) \u2248 0,1483." },
          { kind: "equal", task: "t1", name: "sd_krisis", value: 0.1789, tol: 0.002, label: "`sd_krisis` seharusnya \u2248 17,9%", msg: "\u221A(0,02\u00D71,6) \u2248 0,1789." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_tenang=14\\.8%\\s+sd_krisis=17\\.9%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Stress korelasinya. Lindung nilai berbasis \u03C1 rendah = \u03C1 itu sendiri risikonya.",
    },
    {
      id: "kovarians-portofolio",
      eyebrow: "Langkah 6 · Kovarians portofolio 2 aset",
      title: "Kovarians portofolio: saat korelasi negatif menjadi lindung nilai",
      prose: [
        "Langkah 4 memberi rumus varians portofolio — sekarang bedah suku kovariansnya. Dua aset: saham σ₁ = 10 persen, obligasi σ₂ = 30 persen, korelasi ρ = −0,5, bobot 50:50. Kovariansnya: Cov = ρ × σ₁ × σ₂ = −0,5 × 0,10 × 0,30 = −0,015. Negatif — kedua aset cenderung bergerak berlawanan, dan itulah sumber diversifikasi.",
        "Varians portofolio = 0,25 × 0,01 + 0,25 × 0,09 + 2 × 0,25 × (−0,015) = 0,0025 + 0,0225 − 0,0075 = 0,0175. SD-nya = √0,0175 ≈ 13,23 persen — di bawah rata-rata volatilitas kedua aset (20 persen). Tanpa suku kovarians (ρ = 0), variansnya 0,025 dan SD-nya 15,81 persen; korelasi negatif menghemat 2,6 poin volatilitas. Inilah lindung nilai alami: bukan dari aset yang aman, melainkan dari aset yang bergerak berlawanan.",
        "Tiga pelajaran: pertama, kovarians adalah satu-satunya suku yang bisa negatif — diversifikasi hidup atau mati di sana. Kedua, korelasi negatif yang besar lebih berharga daripada volatilitas yang kecil: aset berisiko dengan ρ = −0,5 melindungi lebih baik daripada aset aman dengan ρ = +0,8. Ketiga, korelasi negatif yang diandalkan sebagai lindung nilai harus di-stress — korelasi −0,5 di masa tenang bisa menjadi +0,3 di krisis, dan saat itu lindung nilainya berubah menjadi pengganda risiko.",
      ],
      formula: String.raw`\mathrm{Var} = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\,\mathrm{Cov} = 0{,}0025 + 0{,}0225 - 0{,}0075 = 0{,}0175`,
      formulaNote: "Cov = ρσ₁σ₂ = −0,5 × 0,10 × 0,30 = −0,015; Var = 0,0175; SD = √0,0175 ≈ 13,23 persen — di bawah rata-rata volatilitas 20 persen.",
      tasks: [
        { id: "t1", text: "Hitung `cov` = ρ × σ₁ × σ₂" },
        { id: "t2", text: "Hitung `var_port` dan `sd_port` portofolio 50:50 (4 desimal)" },
      ],
      expected: "cov=-0.015  var_port=0.0175  sd_port=0.1323",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Lindung nilai berbasis korelasi negatif adalah korelasi itu sendiri sebagai risiko: saat krisis membalik tandanya, portofolio yang tadinya terlindungi menjadi terekspos ganda. Stress korelasinya, bukan hanya volatilitasnya.",
      },
      hints: [
        "cov = rho * s1 * s2.",
        "var_port = 0.25*s1**2 + 0.25*s2**2 + 2*0.25*cov.",
        "sd_port = round(var_port ** 0.5, 4)",
      ],
      code: {
        starter: `import math\n\n# saham sigma 10%, obligasi sigma 30%, korelasi -0,5, bobot 50:50\ns1, s2, rho = 0.10, 0.30, -0.5\n\n# TULIS KODEMU\ncov = \nvar_port = \nsd_port = \n\nprint(f"cov={cov}  var_port={var_port}  sd_port={sd_port}")`,
        lockLines: 2,
        solution: `import math\n\n# saham sigma 10%, obligasi sigma 30%, korelasi -0,5, bobot 50:50\ns1, s2, rho = 0.10, 0.30, -0.5\n\n# TULIS KODEMU\ncov = rho * s1 * s2\nvar_port = 0.25*s1**2 + 0.25*s2**2 + 2*0.25*cov\nsd_port = round(var_port ** 0.5, 4)\n\nprint(f"cov={cov}  var_port={var_port}  sd_port={sd_port}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cov", value: -0.015, tol: 1e-9, label: "`cov` seharusnya -0.015", msg: "−0,5 × 0,10 × 0,30 = −0,015." },
          { kind: "equal", task: "t2", name: "var_port", value: 0.0175, tol: 1e-9, label: "`var_port` seharusnya 0.0175", msg: "0,0025 + 0,0225 − 0,0075 = 0,0175." },
          { kind: "equal", task: "t2", name: "sd_port", value: 0.1323, tol: 0.001, label: "`sd_port` seharusnya 0.1323", msg: "√0,0175 ≈ 0,1323 = 13,23%." },
          { kind: "stdout_matches", task: "t2", pattern: "cov=-0\\.015\\s+var_port=0\\.0175\\s+sd_port=0\\.1323", label: "`print` menampilkan ketiganya", msg: "Format: cov=...  var_port=...  sd_port=... ." },
        ],
      },
      quiz: [
        {
          q: "Dua aset σ=10% dan 30%, ρ=−0,5, 50:50. SD portofolio 13,23% — di bawah rata-rata σ (20%). Kenapa?",
          options: [
            { text: "Karena bobotnya sama", why: "Salah: bobot sama tanpa korelasi negatif memberi SD 15,81%." },
            { text: "Karena suku kovarians negatif mengurangi varians — lindung nilai alami", why: "Benar: Cov = −0,015 menghemat 2,6 poin volatilitas.", correct: true },
            { text: "Karena σ obligasi lebih besar", why: "Salah: σ besar menaikkan varians, bukan menurunkannya." },
          ],
        },
        {
          q: "Korelasi −0,5 di masa tenang menjadi +0,3 di krisis. Apa yang terjadi pada lindung nilai?",
          options: [
            { text: "Tetap melindungi — korelasi tidak memengaruhi varians", why: "Salah: varians portofolio ditentukan korelasi." },
            { text: "Berbalik menjadi pengganda risiko — suku kovarians yang tadinya negatif menjadi positif", why: "Benar: lindung nilai berbasis korelasi adalah korelasi itu sendiri sebagai risiko.", correct: true },
            { text: "Tidak ada efek selama bobot tetap", why: "Salah: bobot tetap, tetapi suku interaksi berubah tanda." },
          ],
        },
      ],
      reference: "Cov negatif = satu-satunya sumber diversifikasi. Stress tandanya, bukan hanya besarnya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B10.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: korelasi nol bukan independen — dan di krisis, semua korelasi pulang ke satu",
        body: "Dua fakta yang terasa berlawanan tetapi sama-sama benar. Pertama: ρ = 0 tidak berarti independen. Contoh klasiknya Y = X² dengan X simetris — korelasinya nol persis, tetapi Y sepenuhnya ditentukan oleh X. Korelasi hanya mengukur hubungan garis lurus; hubungan yang melengkung lolos tanpa terdeteksi. Jangan pernah menulis independen hanya karena korelasinya nol — kecuali datanya joint Normal, satu-satunya dunia di mana nol berarti bebas. Kedua: korelasi yang diestimasi di masa tenang berbohong tentang masa krisis. Diversifikasi portofolio bekerja lewat suku interaksi 2w₁w₂ρσ₁σ₂ — saat ρ naik menuju 1 di tengah panik, suku penghemat itu menguap dan dua aset yang tadinya diversifikasi jatuh bersamaan. Praktisi yang berpengalaman tidak bertanya berapa korelasinya, melainkan korelasi dalam kondisi apa. Aturan keputusannya: untuk lindung nilai dan modal, stres ρ-nya — hitung varians portofolio dengan ρ krisis, bukan ρ rata-rata. Diversifikasi yang hanya ada saat tidak dibutuhkan bukanlah diversifikasi. Korelasi juga buta terhadap skala: ρ = 0,9 dengan σ kecil bisa jauh lebih tidak berbahaya daripada ρ = 0,5 dengan σ raksasa — selalu baca ρ bersama σ.",
      },
      summary: [
        "Joint = induk: marginal (jumlahkan keluar) & bersyarat lahir darinya.",
        "Korelasi = kovarians ternormalisasi (\u22121..1); hanya hubungan linear.",
        "\u03C1=0 \u2260 independen \u2014 kecuali bivariat normal (kasus istimewa).",
        "Varians portofolio ditentukan korelasi \u2014 dan korelasi naik saat krisis.",
        "Jangan percaya diversifikasi tanpa stress korelasi; jangan simpulkan independensi dari korelasi nol.",
      ],
      next: { label: "B10 \u2014 Copula", href: "/v2/learn/b10-copula" },
      quiz: [
        {
          q: "Dari tabel joint, P(telat)=0,08 didapat dengan\u2026",
          options: [
            { text: "Membagi 0,03/0,08", why: "Salah: itu P(gagal|telat), bukan marginal." },
            { text: "Menjumlahkan baris X=1: 0,05+0,03", why: "Benar: marginal = jumlahkan keluar variabel lain.", correct: true },
            { text: "Mengalikan 0,05\u00D70,03", why: "Salah: perkalian untuk independen, bukan marginal." },
          ],
        },
        {
          q: "Dua aset \u03C3=20%, 50/50, \u03C1 naik 0,2\u21920,8. SD portofolio\u2026",
          options: [
            { text: "Tetap 15,5%", why: "Salah: korelasi mengubah varians portofolio." },
            { text: "Naik ke ~19%", why: "Benar: 15,5% \u2192 19%. Diversifikasi menguap \u2014 correlation breakdown.", correct: true },
            { text: "Turun ke 10%", why: "Salah: 10% butuh \u03C1=\u22120,5." },
          ],
        },
        {
          q: "Mengapa korelasi saja tidak cukup untuk risiko?",
          options: [
            { text: "Cukup sebenarnya", why: "Salah: krisis 2008 membuktikan sebaliknya." },
            { text: "Korelasi hanya linear & tidak stabil; bentuk dependensi ekor butuh lebih (copula)", why: "Benar: dependensi ekor \u2260 korelasi linear. Lanjut ke B10.", correct: true },
            { text: "Korelasi selalu 0", why: "Salah: tidak ada dasarnya." },
          ],
        },
        {
          q: "X, Y independen, Var(X)=4, Var(Y)=9. Var(2X\u2212Y)?",
          options: [
            { text: "25", why: "Benar: 4\u00D7Var(X) + Var(Y) \u2212 0 = 16+9 = 25. Koefisien dikuadratkan!", correct: true },
            { text: "13", why: "Salah: lupa mengkuadratkan koefisien 2." },
            { text: "7", why: "Salah: bukan penjumlahan biasa." },
          ],
        },
        {
          q: "Dua aset: \u03C31=10%, \u03C32=30%, \u03C1=\u22120,5, bobot 50:50. \u03C3 portofolio?",
          options: [
            { text: "\u224813,2% \u2014 di bawah rata-rata \u03C3 (20%)", why: "Benar: Var=0,0175 \u2192 \u03C3\u224813,2%. Korelasi negatif = lindung nilai alami.", correct: true },
            { text: "20% \u2014 rata-rata saja", why: "Salah: mengabaikan rumus varians portofolio." },
            { text: "30% \u2014 ikut yang terbesar", why: "Salah: diversifikasi menurunkan, bukan menaikkan." },
          ],
        },
      ],
    },
  ],
};

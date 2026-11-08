import type { V2Lesson } from "../lib/types";

export const a32: V2Lesson = {
  slug: "a32-diagnostik-regresi",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.2 Diagnostik Regresi: Autopsi Model Sebelum Terlambat",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-bintang-palsu",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Semua bintang signifikan, semua salah",
      prose: [
        "Konsultan mempresentasikan model probability of default ke direksi bank. Slide penuh bintang: setiap variabel signifikan pada 1 persen. Direksi mengangguk puas, model disetujui, limit kredit dinaikkan untuk segmen yang terbukti aman.",
        "Tiga bulan kemudian, analis risiko junior yang tidak diundang ke presentasi iseng memplot residual model itu. Corong raksasa: error untuk debitur besar 10 kali lebih lebar daripada debitur kecil. Artinya semua standard error di slide itu salah hitung — bintang-bintang signifikansi dicetak oleh asumsi homoskedastisitas yang tidak pernah dicek. Setelah dihitung ulang dengan robust SE, separuh variabel jadi tidak signifikan, termasuk yang dipakai menaikkan limit.",
        "Twist-nya: koefisien modelnya tidak berubah sama sekali. Yang berubah hanya ketidakpastiannya — dan ketidakpastian itulah yang menentukan keputusan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan limit kredit dari signifikansi palsu adalah risiko langsung ke portofolio. Diagnostik bukan kosmetik — ia menentukan apakah angka keputusan bisa dipercaya.",
      },
      reference: "Koefisien boleh sama; yang menentukan keputusan adalah ketidakpastiannya.",
    },
    {
      id: "plot-residual",
      eyebrow: "Langkah 2 · Plot residual",
      title: "Rontgen pertama setiap model",
      prose: [
        "Diagnostik regresi adalah pemeriksaan sistematis apakah asumsi model terpenuhi, berbasis residual e = y - y_hat. Empat plot standar: residual vs fitted (mendeteksi non-linearitas dan heteroskedastisitas), scale-location (akar residual standar vs fitted — corong lebih jelas di sini), Q-Q plot (normalitas residual), dan residual vs leverage (titik berpengaruh).",
        "Mantra diagnostik: acak = sehat, pola = sakit. Residual yang acak di sekitar nol berarti model sudah menangkap semua pola sistematis. Residual berpola berarti ada informasi yang belum ditangkap — dan bentuk polanya memberi tahu obatnya: lengkung berarti transformasi, corong berarti robust SE, gelombang berarti time series.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengandalkan uji formal dan melewatkan plot. Uji formal menjawab apakah ada masalah, tapi buta terhadap seperti apa masalahnya. Breusch-Pagan yang signifikan tidak memberi tahu corongnya melebar ke mana atau disebabkan 3 titik aneh. Plot dulu untuk diagnosis, uji formal untuk dokumentasi.",
      },
      reference: "Urutan diagnosis: bentuk -> sebaran -> titik aneh. Tidak boleh dibalik.",
    },
    {
      id: "lab-bp",
      eyebrow: "Langkah 3 · Lab: uji Breusch-Pagan",
      title: "Dari kelihatannya ada corong menjadi angka",
      prose: [
        "Logika Breusch-Pagan sederhana: regresikan residual kuadrat ke x. Kalau x bisa menjelaskan besarnya error, variansi tidak konstan — heteroskedastisitas. Statistik LM = n x R_kuadrat mengikuti chi-square(1); nilai kritis 5 persen = 3,84.",
        "Di bawah, fungsi simulate sudah menyiapkan dua skenario: A homoskedastik (error konstan) dan B heteroskedastik (error membesar seiring x). Tugasmu menghitung statistik LM skenario B dan memutuskan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `r2b, lm_b` skenario B via `simulate(hetero=True)`" },
        { id: "t2", text: "Tentukan `tolak` = apakah LM > 3.84, lalu `print`" },
      ],
      expected: "lm_b=25.88 tolak=True",
      note: {
        title: "Sering salah",
        body: "Setelah BP menolak, membuang variabel yang tidak signifikan. Heteroskedastisitas tidak membiaskan koefisien — yang rusak hanya ukuran ketidakpastiannya. Koefisien tetap dipakai; SE, t, p-value, CI dihitung ulang dengan robust SE.",
      },
      hints: [
        "simulate(hetero=True) mengembalikan (r2, lm).",
        "Keputusan: lm_b > 3.84 berarti tolak homoskedastisitas.",
        "r2b, lm_b = simulate(hetero=True)",
      ],
      code: {
        starter: `import random\nrandom.seed(42)\n\ndef simulate(hetero=False, n=200):\n    xs, res2 = [], []\n    for i in range(n):\n        x = random.uniform(1, 10)\n        sigma = (0.5 + 0.5*x) if hetero else 1.0\n        e = random.gauss(0, sigma)\n        xs.append(x); res2.append(e**2)\n    mx = sum(xs)/n; my = sum(res2)/n\n    sxy = sum((a-mx)*(b-my) for a, b in zip(xs, res2))\n    sxx = sum((x-mx)**2 for x in xs)\n    b1 = sxy/sxx\n    pred = [my + b1*(a-mx) for a in xs]\n    ssr = sum((b-p)**2 for b, p in zip(res2, pred))\n    sst = sum((b-my)**2 for b in res2)\n    r2 = 1 - ssr/sst\n    lm = n * r2\n    return r2, lm\n\n# TULIS KODEMU: statistik LM skenario B + keputusan (kritis 3.84)\nr2b, lm_b = \ntolak = \n\nprint(f"lm_b={lm_b:.2f} tolak={tolak}")`,
        lockLines: 20,
        solution: `import random\nrandom.seed(42)\n\ndef simulate(hetero=False, n=200):\n    xs, res2 = [], []\n    for i in range(n):\n        x = random.uniform(1, 10)\n        sigma = (0.5 + 0.5*x) if hetero else 1.0\n        e = random.gauss(0, sigma)\n        xs.append(x); res2.append(e**2)\n    mx = sum(xs)/n; my = sum(res2)/n\n    sxy = sum((a-mx)*(b-my) for a, b in zip(xs, res2))\n    sxx = sum((x-mx)**2 for x in xs)\n    b1 = sxy/sxx\n    pred = [my + b1*(a-mx) for a in xs]\n    ssr = sum((b-p)**2 for b, p in zip(res2, pred))\n    sst = sum((b-my)**2 for b in res2)\n    r2 = 1 - ssr/sst\n    lm = n * r2\n    return r2, lm\n\n# TULIS KODEMU: statistik LM skenario B + keputusan (kritis 3.84)\nr2b, lm_b = simulate(hetero=True)\ntolak = lm_b > 3.84\n\nprint(f"lm_b={lm_b:.2f} tolak={tolak}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lm_b", value: 25.88, tol: 0.05, label: "`lm_b` sekitar 25.88", msg: "LM = n x R_kuadrat regresi residual-kuadrat. Jauh di atas 3,84." },
          { kind: "equal", task: "t2", name: "tolak", value: true, tol: 1e-9, label: "`tolak` seharusnya True", msg: "25,88 > 3,84 berarti tolak homoskedastisitas." },
          { kind: "stdout_matches", task: "t2", pattern: "lm_b=25\\.88\\s+tolak=True", label: "`print` menampilkan keputusan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "LM = n*R2_aux ~ chi-square(1). Kritis 5% = 3.84.",
    },
    {
      id: "titik-berpengaruh",
      eyebrow: "Langkah 4 · Titik berpengaruh",
      title: "Tidak semua outlier berbahaya",
      prose: [
        "Yang berbahaya adalah titik berpengaruh (influential): yang jika dibuang, kesimpulan berubah. Tiga alat ukur: leverage — seberapa jauh titik di ruang x (potensi, bukan vonis); Cook's distance — menggabungkan leverage dan residual, ambang umum 4/n; DFBETAS — seberapa besar tiap koefisien berubah jika titik itu dibuang.",
        "Titik dengan leverage tinggi tapi residual kecil tidak berbahaya: ia menempel garis sehingga tidak menyeret beta — justru memperkuat estimasi. Berbahaya hanya jika residual juga besar; itulah yang ditangkap Cook's distance.",
        "Urutan yang benar saat menemukan titik berpengaruh: cek apakah salah input (perbaiki atau hapus dengan dokumentasi); jika valid tapi dari populasi berbeda, modelkan terpisah; jika valid dan sepopulasi, pertahankan dan laporkan sensitivitasnya — atau pakai regresi robust.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membuang titik berpengaruh agar model bersih tanpa investigasi. Itu memalsukan data — menghapus informasi karena tidak cocok dengan model, bukan karena datanya salah.",
      },
      reference: "Leverage = potensi. Cook's D > 4/n = investigasi, bukan auto-hapus.",
    },
    {
      id: "lab-robust-se",
      eyebrow: "Langkah 5 · Lab: robust SE",
      title: "Perban untuk SE yang berdarah",
      prose: [
        "Robust SE (heteroskedasticity-consistent, HC — estimator sandwich White) menghitung ulang ketidakpastian koefisien tanpa mengasumsikan variansi konstan. Koefisiennya sama; yang berubah hanya SE, t-stat, p-value, dan confidence interval.",
        "Untuk sampel kecil, pakai HC3, bukan HC0: HC0 cenderung underestimate SE saat n kecil, sedangkan HC3 mengoreksi efek leverage tiap observasi sehingga lebih jujur.",
        "Di bawah, fungsi ols_with_se sudah disiapkan. Hitung SE klasik dan robust dari data heteroskedastik yang sama, lalu bandingkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sec` (SE klasik) dan `ser` (SE robust HC0)" },
        { id: "t2", text: "Hitung `t_c`, `t_r`, lalu `print`" },
      ],
      expected: "sec=0.0730 ser=0.0755",
      note: {
        title: "Sering salah",
        body: "Mengira robust SE memperbaiki model yang salah bentuk. Robust SE memperbaiki ketidakpastian, bukan spesifikasi — residual berpola lengkung tetap harus diperbaiki spesifikasinya dulu.",
      },
      hints: [
        "ols_with_se(xs, ys, robust=False) mengembalikan (b1, se).",
        "t-stat = b1 / se.",
        "b1c, sec = ols_with_se(xs, ys, robust=False)",
      ],
      code: {
        starter: `import random, math\nrandom.seed(7)\n\ndef ols_with_se(xs, ys, robust=False):\n    n = len(xs)\n    mx = sum(xs)/n; my = sum(ys)/n\n    sxx = sum((x-mx)**2 for x in xs)\n    sxy = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n    b1 = sxy/sxx; b0 = my - b1*mx\n    resid = [y - (b0 + b1*x) for x, y in zip(xs, ys)]\n    if not robust:\n        s2 = sum(r**2 for r in resid)/(n-2)\n        se = math.sqrt(s2/sxx)\n    else:\n        meat = sum(((x-mx)**2)*(r**2) for x, r in zip(xs, resid))\n        se = math.sqrt(meat)/sxx\n    return b1, se\n\n# Data heteroskedastik: error membesar seiring x\nxs = [random.uniform(1, 10) for _ in range(300)]\nys = [2 + 1.5*x + random.gauss(0, 0.3 + 0.5*x) for x in xs]\n\n# TULIS KODEMU: SE klasik vs robust + t-stat\nb1c, sec = \nb1r, ser = \nt_c = \nt_r = \n\nprint(f"sec={sec:.4f} ser={ser:.4f}")`,
        lockLines: 21,
        solution: `import random, math\nrandom.seed(7)\n\ndef ols_with_se(xs, ys, robust=False):\n    n = len(xs)\n    mx = sum(xs)/n; my = sum(ys)/n\n    sxx = sum((x-mx)**2 for x in xs)\n    sxy = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n    b1 = sxy/sxx; b0 = my - b1*mx\n    resid = [y - (b0 + b1*x) for x, y in zip(xs, ys)]\n    if not robust:\n        s2 = sum(r**2 for r in resid)/(n-2)\n        se = math.sqrt(s2/sxx)\n    else:\n        meat = sum(((x-mx)**2)*(r**2) for x, r in zip(xs, resid))\n        se = math.sqrt(meat)/sxx\n    return b1, se\n\n# Data heteroskedastik: error membesar seiring x\nxs = [random.uniform(1, 10) for _ in range(300)]\nys = [2 + 1.5*x + random.gauss(0, 0.3 + 0.5*x) for x in xs]\n\n# TULIS KODEMU: SE klasik vs robust + t-stat\nb1c, sec = ols_with_se(xs, ys, robust=False)\nb1r, ser = ols_with_se(xs, ys, robust=True)\nt_c = b1c/sec\nt_r = b1r/ser\n\nprint(f"sec={sec:.4f} ser={ser:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sec", value: 0.0730, tol: 0.002, label: "`sec` sekitar 0.0730", msg: "SE klasik dari ols_with_se(robust=False)." },
          { kind: "equal", task: "t1", name: "ser", value: 0.0755, tol: 0.002, label: "`ser` sekitar 0.0755", msg: "SE robust dari ols_with_se(robust=True). Koefisien keduanya sama." },
          { kind: "stdout_matches", task: "t2", pattern: "sec=0\\.0730\\s+ser=0\\.0755", label: "`print` menampilkan kedua SE", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "HC0 = sandwich White. Sampel kecil -> HC3.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 5. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Setelah uji Breusch-Pagan menolak H0, tindakan yang tepat?",
          options: [
            { text: "Buang variabel yang tidak signifikan", why: "Salah. Koefisien tidak bias; masalahnya di SE." },
            { text: "Koefisien tetap dipakai, tapi SE/t/p-value/CI dihitung ulang dengan robust SE", why: "Benar. Heteroskedastisitas merusak ukuran ketidakpastian, bukan koefisien.", correct: true },
            { text: "Transformasi semua variabel jadi log", why: "Salah. Bukan respons otomatis; pertimbangkan jika corong parah." },
            { text: "Naikkan alpha ke 10% agar tetap signifikan", why: "Salah. Itu p-hacking." },
          ],
        },
        {
          q: "Durbin-Watson = 0,7 pada regresi data bulanan. Artinya?",
          options: [
            { text: "Tidak ada masalah", why: "Salah. DW jauh di bawah 2." },
            { text: "Autokorelasi positif kuat — robust SE biasa tidak cukup, butuh Newey-West atau model dinamis", why: "Benar. Error bergerombol searah menurut waktu.", correct: true },
            { text: "Heteroskedastisitas", why: "Salah. DW menguji autokorelasi, bukan heteroskedastisitas." },
            { text: "Multikolinearitas sempurna", why: "Salah. Tidak ada hubungan dengan DW." },
          ],
        },
      ],
      reference: "BP menolak -> robust SE. DW jauh dari 2 -> autokorelasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Temuan diagnostik ke tindakan",
      prose: [
        "Satu, residual berpola lengkung: perbaiki spesifikasi — tambah suku kuadratik, transformasi log, atau interaksi. Prioritas nomor satu: model yang salah bentuk tidak bisa diselamatkan SE apapun. Dua, residual corong dan BP menolak: robust SE (HC3) — koefisien tetap, hitung ulang ketidakpastian; pertimbangkan log(y) jika corong parah.",
        "Tiga, DW jauh dari 2 di data time series: Newey-West SE atau model dinamis — robust SE biasa tidak cukup. Empat, Cook's D > 4/n: investigasi, jangan auto-hapus — cek sumber data, analisis sensitivitas, atau regresi robust. Lima, Q-Q berekor tebal: waspadai interval prediksi — pakai kuantil empiris residual atau distribusi t.",
        "Aturan 10 detik: bentuk dulu, sebaran kemudian, titik aneh terakhir. Plot untuk diagnosis, uji formal untuk dokumentasi. Setiap titik berpengaruh adalah misteri yang harus dipecahkan, bukan sampah yang dibuang.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: residual adalah model yang berbicara",
        body: "Model yang sehat meninggalkan residual yang membosankan — acak, tanpa pola. Residual yang menarik = model yang belum selesai bekerja. Tiga heuristik. Pertama: urutan autopsi tidak bisa dibalik. Bentuk (nonlinearitas) dulu — karena model yang salah bentuk membuat SEMUA diagnostik lain berbohong; baru sebaran (heteroskedastisitas); terakhir titik aneh. Mengobati heteroskedastisitas pada model yang salah bentuk = mengobati gejala. Kedua: plot untuk diagnosis, angka untuk dokumentasi. Uji formal menjawab apakah ada masalah; hanya plot yang memberi tahu seperti apa masalahnya dan apa obatnya. Ketiga: satu titik berpengaruh yang mengubah kesimpulan = satu misteri yang wajib dipecahkan sebelum laporan ditulis — siapa dia, kenapa ekstrem, apakah valid. Aturan praktis: jalankan diagnostik tiap kali data atau spesifikasi berubah, bukan sekali di akhir. Diagnostik bukan ritual penutup; ia rem tangan yang selalu aktif.",
      },
      reference: "Lengkung -> spesifikasi. Corong -> robust. DW -> Newey-West. Cook -> investigasi. Ekor -> kuantil empiris.",
    },
    {
      id: "mini-case-vendor",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Model PD yang terlalu bagus",
      prose: [
        "Vendor menjual model PD ke bankmu seharga Rp2 miliar. Laporan validasi: 8 variabel, semuanya signifikan pada 1 persen, R kuadrat = 0,68, n = 50.000. Kamu diminta me-review sebelum pembelian. Kamu minta data residual dan menemukan: scale-location menanjak tajam — error debitur besar 8 kali lebih lebar; satu observasi dengan Cook's D = 0,35 (ambang 4/n = 0,00008); Q-Q plot berekor tebal di kanan.",
        "Status klaim semua signifikan 1 persen: tidak bisa dipercaya. Heteroskedastisitas parah berarti SE klasik yang menghasilkan bintang-bintang itu salah hitung — kemungkinan underestimate, sehingga p-value palsu optimis. Minta hasil dengan robust SE sebelum percaya satu bintang pun.",
        "Cook's D = 0,35 vs ambang 0,00008 berarti sangat berpengaruh — ribuan kali lipat ambang. Satu observasi menggerakkan kesimpulan model 50.000 data. Wajib investigasi: siapa debitur ini? Rekomendasi ke direksi: tunda pembelian. Minta vendor hasil dengan robust SE, analisis sensitivitas tanpa titik berpengaruh, dan validasi out-of-sample. Model yang sehat tidak takut diautopsi — vendor yang menolak autopsi adalah red flag.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Membeli model Rp2 miliar tanpa autopsi diagnostik berarti membeli kesimpulan yang mungkin digerakkan satu debitur dan bintang signifikansi yang salah hitung.",
      },
      reference: "Vendor yang menolak diautopsi = red flag. Minta robust SE + sensitivitas + OOS.",
    },
    {
      id: "pendalaman-vif",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Multikolinearitas: VIF, angka kondisi & hierarki obat",
      prose: [
        "Multikolinearitas tidak membiaskan koefisien — ia menggembungkan variansinya. Ukurannya: VIF_j = 1/(1 − R^2_j), dengan R^2_j dari regresi x_j terhadap semua prediktor lain. VIF = 10 berarti variansi koefisien 10x lipat (SE 3,16x) dibanding kasus ortogonal — interval kepercayaan melebar, t-statistik menciut, variabel penting terlihat tidak signifikan. Ambang praktis: VIF > 5 waspada, > 10 serius. Tapi ingat: VIF tinggi tidak selalu masalah — bila tujuanmu prediksi murni dan error validasi bagus, biarkan; yang rusak hanya interpretasi per variabel.",
        "VIF melihat satu variabel per satu waktu. Untuk kesehatan sistem, pakai condition number: kappa = lambda_max/lambda_min dari matriks X'X. Kappa > 30 menandakan kolinearitas parah di tingkat sistem — mungkin melibatkan kombinasi beberapa variabel yang tidak tertangkap VIF individual. VIF = diagnosis per pasien; condition number = status UGD rumah sakit.",
        "Hierarki obat, dari paling jujur: satu, buang atau gabungkan variabel redundan (mis. rata-ratakan dua rasio yang mengukur hal sama) — menyelesaikan akar masalah. Dua, ridge regression — menstabilkan dengan harga bias kecil; cocok bila semua variabel dipertahankan. Tiga, PCA/PLS — kompresi, tapi interpretasi per variabel hilang. Empat, kumpulkan data lebih banyak — kadang kolinearitas hanya artefak sampel kecil. Yang JANGAN: stepwise otomatis tanpa teori — ia memilih noise yang kebetulan signifikan dan melaporkan SE yang terlalu optimis.",
        "Dua jebakan terakhir. Satu: VIF tidak mendeteksi kolinearitas dengan intersep — centering variabel (kurangi mean) sebelum menghitung bila curiga. Dua: VIF buta terhadap hubungan nonlinear antar prediktor (mis. x dan x^2 memang berkorelasi tinggi — itu by design, bukan masalah). Aturan keputusan senior: tanya dulu untuk apa koefisiennya — bila untuk keputusan per variabel (variabel mana yang diintervensi?), tangani; bila untuk prediksi, ukur dampaknya di validasi sebelum mengobati.",
      ],
      formula: String.raw`\text{VIF}_j = \frac{1}{1 - R^2_j}`,
      formulaNote: "VIF_j = variance inflation factor variabel j; R^2_j = R-kuadrat regresi x_j terhadap semua prediktor lain. VIF = 10 → variansi koefisien 10x (SE 3,16x) dibanding kasus ortogonal. Ambang: > 5 waspada, > 10 serius. Tidak mendeteksi kolinearitas dengan intersep.",
      tasks: [],
      reference: "VIF per variabel, condition number per sistem. Obat: buang/gabung > ridge > PCA > data. Prediksi murni boleh dibiarkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Plot residual dulu: acak = sehat, pola = sakit. Uji formal untuk dokumentasi.",
        "Heteroskedastisitas: koefisien tetap, SE dihitung ulang dengan robust (HC3 untuk sampel kecil).",
        "Leverage = potensi; Cook's D menggabungkan leverage dan residual. Investigasi, jangan auto-hapus.",
        "DW jauh dari 2 = autokorelasi: butuh Newey-West atau model dinamis.",
        "R kuadrat tinggi dari model yang salah spesifikasi adalah ilusi — perbaiki bentuknya dulu.",
      ],
      next: { label: "A3.3 — Regularisasi", href: "/v2/learn/a33-regularisasi" },
      quiz: [
        {
          q: "Titik dengan leverage tinggi tapi residual kecil. Berbahaya?",
          options: [
            { text: "Ya, leverage tinggi selalu berbahaya", why: "Salah. Leverage = potensi, bukan vonis." },
            { text: "Tidak — ia menempel garis sehingga tidak menyeret beta. Berbahaya hanya jika residual juga besar", why: "Benar. Itulah yang digabungkan Cook's distance.", correct: true },
            { text: "Ya, harus selalu dibuang", why: "Salah. Membuang tanpa investigasi = memalsukan data." },
            { text: "Tidak, leverage tidak pernah penting", why: "Salah. Leverage tinggi + residual besar = berpengaruh." },
          ],
        },
        {
          q: "Q-Q plot residual melengkung seperti huruf S (kedua ujung menjauh dari garis). Diagnosis?",
          options: [
            { text: "Residual skewed satu sisi", why: "Salah. Pola S simetris berarti kedua sisi." },
            { text: "Residual berekor tebal di kedua sisi (heavy-tailed simetris)", why: "Benar. Konsekuensi: interval prediksi normal kekecilan di kedua arah.", correct: true },
            { text: "Heteroskedastisitas", why: "Salah. Itu terlihat di scale-location, bukan Q-Q." },
            { text: "Autokorelasi", why: "Salah. Itu terlihat di plot residual vs waktu." },
          ],
        },
        {
          q: "Kenapa HC3 direkomendasikan untuk sampel kecil dibanding HC0?",
          options: [
            { text: "HC3 selalu menghasilkan SE lebih kecil", why: "Salah. Justru biasanya lebih besar (lebih jujur)." },
            { text: "HC0 cenderung underestimate SE di sampel kecil; HC3 mengoreksi efek leverage tiap observasi", why: "Benar. HC3 membagi tiap residual kuadrat dengan (1-h)^2.", correct: true },
            { text: "HC3 tidak butuh residual", why: "Salah. Keduanya memakai residual." },
            { text: "HC0 tidak valid secara teori", why: "Salah. HC0 valid asimtotik; masalahnya sampel kecil." },
          ],
        },
        {
          q: "Model A: semua diagnostik sehat. Model B: R kuadrat lebih tinggi tapi residual berpola lengkung. Pilih?",
          options: [
            { text: "Model B — R kuadrat lebih tinggi selalu menang", why: "Salah. R kuadrat dari model salah spesifikasi adalah ilusi." },
            { text: "Model A — perbaiki dulu bentuknya baru bandingkan", why: "Benar. Residual berpola = koefisien bisa bias; model sehat lebih bisa dipercaya.", correct: true },
            { text: "Rata-ratakan keduanya", why: "Salah. Ensemble tidak memperbaiki spesifikasi yang salah." },
            { text: "Pilih berdasar jumlah variabel", why: "Salah. Kriteria yang tidak relevan." },
          ],
        },
        {
          q: "VIF = 12 untuk variabel X3 dalam model yang dipakai untuk inferensi per variabel. Artinya?",
          options: [
            { text: "Tidak ada masalah — VIF hanya angka", why: "Salah. VIF 12 = masalah serius." },
            { text: "SE koefisien X3 menggembung ~3,5x akibat korelasi dengan prediktor lain — interpretasi per variabel tidak bisa dipercaya sebelum ditangani", why: "Benar. Akar(12) ≈ 3,46. Untuk inferensi: buang/gabung atau ridge.", correct: true },
            { text: "X3 harus selalu dibuang", why: "Salah. Tergantung tujuan — untuk prediksi murni boleh dibiarkan bila validasi bagus." },
            { text: "Naikkan alpha", why: "Salah. Itu p-hacking, bukan solusi." },
          ],
        },
        {
          q: "Tujuan model murni prediksi; VIF beberapa variabel > 10 tapi error CV sangat bagus. Tindakan?",
          options: [
            { text: "Wajib buang variabel bervariabel VIF tinggi", why: "Salah. Untuk prediksi murni, VIF bukan vonis." },
            { text: "Boleh dibiarkan — multikolinearitas merusak interpretasi per variabel, bukan akurasi prediksi. Ukur di validasi, jangan obati buta", why: "Benar. Obati bila tujuannya inferensi.", correct: true },
            { text: "Pakai stepwise untuk membersihkan", why: "Salah. Stepwise tanpa teori memilih noise signifikan." },
            { text: "Transformasi log semua variabel", why: "Salah. Tidak relevan dengan kolinearitas." },
          ],
        },
        {
          q: "Condition number matriks X'X = 120, tapi semua VIF individual di bawah 4. Interpretasi?",
          options: [
            { text: "Tidak ada masalah — VIF aman", why: "Salah. Condition number melihat sistem, bukan per variabel." },
            { text: "Kolinearitas sistemik: kombinasi beberapa variabel hampir dependen linear meski tiap pasangan terlihat aman. Investigasi matriks desain", why: "Benar. Kappa > 30 = parah; VIF bisa lolos dari pola multivariat.", correct: true },
            { text: "Naikkan ukuran sampel 2x", why: "Salah. Bisa membantu tapi bukan respons pertama untuk pola struktural." },
            { text: "Ganti ke regresi logistik", why: "Salah. Tidak relevan dengan masalahnya." },
          ],
        },
      ],
    },
  ],
};

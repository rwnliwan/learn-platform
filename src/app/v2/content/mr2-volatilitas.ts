import type { V2Lesson } from "../lib/types";

export const mr2: V2Lesson = {
  slug: "mr2-volatilitas",
  track: "Market Risk",
  module: "Fondasi Risiko Pasar",
  title: "MR2 — Volatilitas & Kovarians: EWMA, Shrinkage, dan Jendela Data",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-amnesia",
      eyebrow: "Langkah 1 · Volatilitas yang hidup",
      title: "Cerita: model yang tertular amnesia",
      prose: [
        "Maret 2020. IHSG anjlok 5% dalam sehari, lalu 6% lagi. Di ruang risiko sebuah bank, layar VaR masih berwarna hijau tenang. Model VaR mereka memakai volatilitas dari 250 hari terakhir dengan bobot sama — 249 hari tenang menenggelamkan 1 hari krisis. Model itu butuh berminggu-minggu untuk sadar bahwa dunia sudah berubah.",
        "Bank sebelah memakai EWMA — model yang memberi bobot lebih besar ke data terbaru. VaR mereka melonjak dalam 3 hari, limit diketatkan, posisi dikurangi. Bank pertama baru sadar setelah kerugian menumpuk — dan VaR-nya meledak justru saat pasar mulai tenang, karena hari-hari krisis akhirnya masuk jendela 250 hari dan tidak mau keluar.",
        "Volatilitas (σ) adalah standar deviasi return — bahan bakar hampir semua model risiko: VaR parametrik, harga opsi, simulasi Monte Carlo. Masalahnya: volatilitas tidak konstan. Ia berkelompok (volatility clustering) — hari liar diikuti hari liar. Return yang dipakai biasanya log-return, r_t = ln(P_t/P_{t-1}), karena aditif terhadap waktu: return 2 hari = jumlah return harian.",
      ],
      formula: String.raw`r_t = \ln\left(\frac{P_t}{P_{t-1}}\right)`,
      formulaNote: "r_t = return periode t; P_t = harga kini, P_{t-1} = harga periode lalu; ln = logaritma natural — log-return aditif terhadap waktu: return 2 hari = r_1 + r_2.",
      tasks: [
        { id: "t1", text: "Jelaskan dengan kata-katamu: kenapa jendela 250-hari equal-weighted terlambat membaca krisis?" },
        { id: "t2", text: "Sebutkan dua alasan log-return dipilih dibanding simple return." },
      ],
      note: {
        title: "Sering salah",
        body: "Menyamakan volatilitas dengan risiko. Volatilitas mengukur ketidakpastian dua arah (naik dan turun) — volatilitas ke atas justru menguntungkan posisi long. Volatilitas adalah input untuk menghitung VaR/ES, bukan jawabannya.",
        type: "pitfall",
      },
      reference: "σ = standar deviasi return. Clustering → estimator statis terlambat saat rezim berubah.",
    },
    {
      id: "ewma",
      eyebrow: "Langkah 2 · EWMA",
      title: "EWMA: si pelupa yang bijak",
      prose: [
        "EWMA (Exponentially Weighted Moving Average) mengestimasi variansi dengan bobot yang meluruh eksponensial ke masa lalu — data kemarin jauh lebih penting daripada data 100 hari lalu. Lambda (λ) adalah daya ingat model: standar RiskMetrics untuk data harian adalah 0,94. Bobot data k hari lalu adalah (1−λ)λ^k.",
        "Contoh: estimasi variansi kemarin 4 (vol 2%), return kemarin +5% (hari liar). Rekursinya: 0,94 × 4 + 0,06 × 25 = 3,76 + 1,5 = 5,26 → volatilitas baru √5,26 ≈ 2,29%. Naik dari 2% ke 2,29% dalam sehari — bandingkan dengan rolling 250-hari yang bergerak nyaris nol. Itulah kecepatan adaptasi EWMA.",
      ],
      formula: String.raw`\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1-\lambda) r_{t-1}^2`,
      formulaNote: "σ_t² = estimasi variansi hari ini; λ = daya ingat model (0,94 standar harian RiskMetrics); σ_{t-1}² = estimasi kemarin; r_{t-1}² = kuadrat return kemarin — kejutan terbaru menaikkan estimasi.",
      tasks: [
        { id: "t1", text: "Hitung `var_baru` dari `var_lama`, `r_kemarin`, dan `lam`" },
        { id: "t2", text: "Hitung `vol_baru` = akar dari `var_baru`, lalu cetak keduanya" },
      ],
      expected: "var_baru=10.62  vol_baru=3.26",
      note: {
        title: "Sering salah",
        body: "Mengira EWMA selalu lebih baik dari rolling window. EWMA unggul saat rezim berubah cepat, tetapi di masa tenang ia justru lebih berisik (over-reactive). Untuk modal dan stress test yang butuh stabilitas, window panjang equal-weighted sering dipilih regulator.",
        type: "pitfall",
      },
      hints: [
        "Ikuti rumus rekursif: var_baru = lam * var_lama + (1 - lam) * r_kemarin**2.",
        "r_kemarin dalam persen (−6), jadi r_kemarin**2 = 36 dalam satuan persen-kuadrat.",
        "vol_baru = var_baru ** 0.5. Perlu import math? Tidak — pakai ** 0.5.",
      ],
      code: {
        starter: `# Estimasi kemarin dan kejutan kemarin (dalam persen)\nvar_lama = 9.0   # variansi kemarin -> vol 3%\nr_kemarin = -6.0  # return kemarin: -6% (hari liar)\nlam = 0.94\n\n# TULIS KODEMU: variansi baru dan volatilitas baru (persen)\nvar_baru = \nvol_baru = \n\nprint(f"var_baru={var_baru:.2f}  vol_baru={vol_baru:.2f}")`,
        lockLines: 4,
        solution: `# Estimasi kemarin dan kejutan kemarin (dalam persen)\nvar_lama = 9.0   # variansi kemarin -> vol 3%\nr_kemarin = -6.0  # return kemarin: -6% (hari liar)\nlam = 0.94\n\n# TULIS KODEMU: variansi baru dan volatilitas baru (persen)\nvar_baru = lam * var_lama + (1 - lam) * r_kemarin ** 2\nvol_baru = var_baru ** 0.5\n\nprint(f"var_baru={var_baru:.2f}  vol_baru={vol_baru:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_baru", value: 10.62, tol: 1e-9, label: "`var_baru` seharusnya 10.62", msg: "0,94 × 9 + 0,06 × 36 = 8,46 + 2,16. Cek rumus rekursifnya." },
          { kind: "equal", task: "t2", name: "vol_baru", value: 3.2588, tol: 0.01, label: "`vol_baru` seharusnya ~3.26", msg: "vol_baru = akar kuadrat dari var_baru." },
          { kind: "stdout_matches", task: "t2", pattern: "var_baru=10\\.62\\s+vol_baru=3\\.26", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "σ_t² = λσ_{t-1}² + (1−λ)r_{t-1}². λ kecil = cepat & berisik; λ besar = lambat & stabil.",
    },
    {
      id: "half-life",
      eyebrow: "Langkah 3 · Daya ingat",
      title: "Half-life: mengukur seberapa cepat model lupa",
      prose: [
        "Seberapa cepat EWMA melupakan masa lalu? Bobot data k hari lalu adalah (1−λ)λ^k. Half-life adalah jumlah hari sampai bobotnya tinggal separuh dari bobot kemarin: k_{1/2} = ln(1/2) / ln(λ). Untuk λ = 0,94, half-life ≈ 11,2 hari — data 11 hari lalu pengaruhnya tinggal separuh.",
        "Bandingkan dengan rolling window 250-hari: data 249 hari lalu bobotnya sama persis dengan kemarin — ingatan yang demokratis tetapi tuli terhadap perubahan. Aturan praktis: pilih λ sehingga half-life ≈ ¼–½ dari horizon keputusanmu. Standar RiskMetrics: 0,94 harian, 0,97 bulanan — horizon lebih panjang butuh ingatan lebih panjang.",
        "Dunia nyata mengonfirmasi perilaku ini. VIX (implied volatility S&P 500): masa tenang 12–18, krisis 2008 menyentuh 80,9, COVID crash 82,7. Polanya: VIX melonjak cepat dalam hitungan hari dan reda perlahan dalam hitungan bulan — cerminan perilaku EWMA. Dan volatilitas berkelompok karena efek leverage: harga jatuh → leverage perusahaan naik → volatilitas naik. Penurunan harga menaikkan vol lebih besar daripada kenaikan setara — model simetris murni meremehkan tepat sisi yang paling menyakitkan.",
      ],
      formula: String.raw`k_{1/2} = \frac{\ln(1/2)}{\ln(\lambda)}`,
      formulaNote: "k_{1/2} = jumlah hari sampai bobot data tinggal separuh bobot kemarin — daya ingat model dalam satuan hari; λ = 0,94 → ≈ 11,2 hari.",
      tasks: [
        { id: "t1", text: "Hitung `hl_94`, `hl_97`, `hl_90` (half-life dalam hari) untuk tiga nilai `lam`" },
        { id: "t2", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "hl_94=11.20  hl_97=22.76  hl_90=6.58",
      note: {
        title: "Sering salah",
        body: "Mengira VIX tinggi = saat tepat untuk beli. VIX tinggi berarti pasar mengharapkan kegilaan berlanjut — bukan berarti kegilaan sudah selesai. VIX adalah termometer ketakutan, bukan sinyal beli.",
        type: "pitfall",
      },
      hints: [
        "Rumus: half-life = ln(0.5) / ln(lam). Perlu import math untuk logaritma natural.",
        "math.log(0.5) negatif dan math.log(lam) negatif — hasilnya positif.",
        "hl_94 = math.log(0.5) / math.log(0.94), dan seterusnya untuk 0.97 dan 0.90.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU: half-life (hari) untuk tiga nilai lambda\nhl_94 = \nhl_97 = \nhl_90 = \n\nprint(f"hl_94={hl_94:.2f}  hl_97={hl_97:.2f}  hl_90={hl_90:.2f}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU: half-life (hari) untuk tiga nilai lambda\nhl_94 = math.log(0.5) / math.log(0.94)\nhl_97 = math.log(0.5) / math.log(0.97)\nhl_90 = math.log(0.5) / math.log(0.90)\n\nprint(f"hl_94={hl_94:.2f}  hl_97={hl_97:.2f}  hl_90={hl_90:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hl_94", value: 11.20, tol: 0.01, label: "`hl_94` seharusnya 11.20", msg: "ln(0,5)/ln(0,94). Cek tanda: kedua logaritma negatif, hasil positif." },
          { kind: "equal", task: "t1", name: "hl_97", value: 22.76, tol: 0.01, label: "`hl_97` seharusnya 22.76", msg: "ln(0,5)/ln(0,97) — ingatan lebih panjang dari 0,94." },
          { kind: "equal", task: "t1", name: "hl_90", value: 6.58, tol: 0.01, label: "`hl_90` seharusnya 6.58", msg: "ln(0,5)/ln(0,90) — ingatan paling pendek." },
          { kind: "stdout_matches", task: "t2", pattern: "hl_94=11\\.20\\s+hl_97=22\\.76\\s+hl_90=6\\.58", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Half-life λ=0,94 ≈ 11 hari; λ=0,97 ≈ 23 hari; λ=0,90 ≈ 6,6 hari.",
    },
    {
      id: "shrinkage",
      eyebrow: "Langkah 4 · Kovarians",
      title: "Shrinkage: kovarians sampel itu berisik",
      prose: [
        "Untuk portofolio multi-aset kita butuh matriks kovarians — bukan cuma volatilitas tiap aset, tetapi juga korelasinya. Masalahnya: kovarians sampel dari data terbatas penuh estimation error. Korelasi yang terlihat besar sering hanya noise. Lebih parah: matriks bisa tidak invertible (singular) kalau jumlah aset melebihi jumlah observasi — padahal inversnya dibutuhkan untuk optimasi portofolio.",
        "Solusi Ledoit-Wolf: tarik (shrink) matriks sampel ke arah target yang terstruktur dan stabil. Σ* = δF + (1−δ)S. S adalah kovarians sampel (noisy tetapi unbiased), F adalah target terstruktur — misal variansi = rata-rata semua variansi, kovarians = rata-rata semua kovarians — dan δ adalah intensitas shrinkage 0–1 yang dihitung otomatis dari data: makin noisy data, makin besar δ.",
        "Shrinkage seperti editor yang bijak: tidak menghapus kesaksian data, tetapi menarik klaim yang terlalu ekstrem ke arah akal sehat. Makin sedikit bukti, makin kuat tarikannya. Pakai saat: banyak aset dengan histori pendek, input optimasi mean-variance, VaR parametrik multi-faktor. Tidak perlu saat: sedikit aset dengan data panjang — sampel sudah cukup stabil.",
      ],
      formula: String.raw`\Sigma^* = \delta F + (1-\delta) S`,
      formulaNote: "Σ* = matriks kovarians hasil shrinkage; S = kovarians sampel (noisy tetapi unbiased); F = target terstruktur yang stabil; δ = intensitas tarikan (0–1), otomatis besar saat data sedikit atau noisy.",
      tasks: [
        { id: "t1", text: "Jelaskan arti δ=0 dan δ=1 dalam rumus shrinkage." },
        { id: "t2", text: "Sebutkan dua kondisi kapan shrinkage wajib dipakai." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Kovarians sampel yang singular atau noisy menghasilkan bobot portofolio ekstrem di optimasi — model menyarankan taruhan besar pada korelasi yang sebenarnya noise. Itu bukan alpha, itu estimation error yang disulap jadi keputusan.",
        type: "risk",
      },
      reference: "Σ* = δF + (1−δ)S. δ optimal dari data; besar δ saat data sedikit/noisy.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Estimator mana, kapan",
      prose: [
        "Empat keputusan. Pertama, butuh respons cepat ke perubahan pasar (trading harian, limit intraday) → EWMA dengan λ kecil–sedang: bobot eksponensial membuatnya bangun dalam hitungan hari, dengan harga lebih berisik di masa tenang.",
        "Kedua, butuh stabilitas untuk modal atau regulasi → rolling window panjang equal-weighted: regulator menghargai stabilitas dan transparansi; window 250-hari–1 tahun adalah standar, keterlambatan adaptasi adalah harga yang disadari — biasanya dipasangkan dengan stressed VaR.",
        "Ketiga, banyak aset dengan histori pendek → kovarians plus shrinkage (Ledoit-Wolf): sampel murni terlalu noisy dan bisa singular. Keempat, volatilitas berkelompok jelas dan butuh forecasting formal dengan mean-reversion → GARCH: model volatilitas yang menambahkan mean-reversion — volatilitas cenderung kembali ke rata-rata jangka panjangnya (EWMA sebenarnya adalah GARCH(1,1) dengan batasan tertentu, versi tanpa mean-reversion).",
        "Aturan 10 detik: cepat dan adaptif → EWMA; stabil dan regulator-friendly → window panjang; banyak aset data sedikit → shrinkage. Selalu tanya: estimator ini ingatannya seberapa panjang — dan apakah itu cocok dengan horizon keputusanku?",
      ],
      tasks: [
        { id: "t1", text: "Untuk VaR modal bank, estimator mana yang dipilih dan kenapa?" },
        { id: "t2", text: "Untuk early-warning intraday, estimator mana dan apa risikonya?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Jawaban dewasa untuk dilema kecepatan vs stabilitas: pakai keduanya. EWMA untuk peringatan dini, window panjang untuk stabilitas modal. Satu estimator untuk semua tujuan adalah cara cepat mendapat kejutan dari arah yang tidak diantisipasi.",
        type: "risk",
      },
      reference: "Cepat → EWMA. Stabil → window panjang. Banyak aset → shrinkage. Forecasting → GARCH.",
    },
    {
      id: "minicase-var-terlambat",
      eyebrow: "Langkah 6 · Mini-case",
      title: "VaR yang terlambat bangun",
      prose: [
        "Desk ekuitas memakai VaR parametrik 99%/1-hari dengan volatilitas rolling 250-hari equal-weighted. Posisi Rp200 miliar (beta 1 terhadap IHSG), vol tahunan masa tenang 16%. VaR harian masa tenang = 2,33 × (16%/√250) × Rp200 M ≈ Rp4,7 miliar.",
        "Krisis datang: volatilitas aktual melonjak ke 48% tahunan dalam 2 minggu, tetapi estimator 250-hari baru naik ke ~20%. Hari ke-10 krisis: rugi Rp18 miliar dalam sehari — hampir 4× VaR. Kenapa VaR hijau padahal pasar sudah merah? Karena tiap hari bobotnya 0,4% — 10 hari krisis hanya 4% dari estimasi. Model teringat 240 hari tenang.",
        "Hitung VaR masa tenangnya sendiri, lalu hitung berapa kali lipat kerugian aktual terhadap VaR itu. Perbaikan minimal tanpa mengganti seluruh sistem: ganti ke EWMA λ=0,94 (atau tambahkan sebagai overlay early-warning). Risikonya: procyclicality — VaR melonjak tepat saat krisis dan memaksa deleveraging di saat terburuk.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var_tenang` (VaR 99%/1-hari masa tenang, rupiah)" },
        { id: "t2", text: "Hitung `kelipatan` = rugi aktual / VaR, lalu cetak keduanya" },
      ],
      expected: "var_tenang=4715588  kelipatan=3.82",
      note: {
        title: "Sering salah",
        body: "Lupa mengakarkan 250 saat mengubah vol tahunan ke harian. Vol harian = vol tahunan / √250, bukan / 250.",
        type: "pitfall",
      },
      hints: [
        "Vol harian = 0.16 / sqrt(250). Perlu import math.",
        "VaR = 2.33 * vol_harian * 200_000_000.",
        "kelipatan = 18_000_000 / var_tenang.",
      ],
      code: {
        starter: `import math\n\nposisi = 200_000_000  # Rp200 miliar\nvol_tahunan = 0.16\nrugi_aktual = 18_000_000\n\n# TULIS KODEMU\nvol_harian = \nvar_tenang = \nkelipatan = \n\nprint(f"var_tenang={var_tenang:.0f}  kelipatan={kelipatan:.2f}")`,
        lockLines: 5,
        solution: `import math\n\nposisi = 200_000_000  # Rp200 miliar\nvol_tahunan = 0.16\nrugi_aktual = 18_000_000\n\n# TULIS KODEMU\nvol_harian = vol_tahunan / math.sqrt(250)\nvar_tenang = 2.33 * vol_harian * posisi\nkelipatan = rugi_aktual / var_tenang\n\nprint(f"var_tenang={var_tenang:.0f}  kelipatan={kelipatan:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var_tenang", value: 4715588, tol: 1, label: "`var_tenang` seharusnya ~4.715.588", msg: "2,33 × (0,16/√250) × 200 jt. Cek pembagi akar-250." },
          { kind: "equal", task: "t2", name: "kelipatan", value: 3.82, tol: 0.01, label: "`kelipatan` seharusnya ~3.82", msg: "18 jt / var_tenang. Kerugian hampir 4× VaR." },
          { kind: "stdout_matches", task: "t2", pattern: "var_tenang=4715588\\s+kelipatan=3\\.82", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "VaR tenang ≈ Rp4,7 jt; rugi aktual Rp18 jt ≈ 3,8× VaR — amnesia jendela panjang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca setiap alasan opsi sebelum lanjut — volatilitas yang kamu estimasi di sini menjadi input VaR parametrik (ukuran kerugian ambang pada tingkat kepercayaan tertentu).",
      ],
      tasks: [],
      note: {
        title: "Intuisi: estimator volatilitas = pilihan seberapa cepat kamu mau kaget",
        body: "Tidak ada estimator volatilitas yang benar — hanya ada trade-off yang dipilih sadar. Lima heuristik. Pertama: pilih daya ingat sesuai horizon keputusan — setengah-ingatan (half-life) sekitar seperempat sampai setengah horizon; memakai EWMA 11-hari untuk modal tahunan sama salahnya dengan memakai window 250-hari untuk limit intraday. Kedua: di masa tenang, estimator adaptif justru berisik — jangan kejar setiap goyangan; di awal krisis, estimator lambat justru buta — jangan percaya angka hijaunya. Ketiga: ketika jumlah aset melebihi jumlah observasi, kovarians sampel bukan cuma noisy — ia singular dan tidak bisa di-invers; shrinkage bukan penyempurnaan, melainkan prasyarat agar optimasi tidak menghasilkan bobot ekstrem dari noise. Keempat: volatilitas bukan risiko — ia input; angka vol tinggi pada posisi yang tepat arah justru kabar baik. Kelima: jawaban dewasa untuk dilema kecepatan vs stabilitas adalah memakai dua estimator sekaligus — yang cepat untuk peringatan dini, yang lambat untuk angka modal — dan bertindak saat keduanya sepakat. Aturan 10 detiknya: tanya ingatannya berapa hari, tanya apakah itu cocok dengan horizon keputusanmu, dan jangan pernah membiarkan satu estimator memutuskan sendirian.",
      },
      summary: [
        "Volatilitas berkelompok (clustering) — estimator statis terlambat membaca perubahan rezim.",
        "EWMA: σ_t² = λσ_{t-1}² + (1−λ)r_{t-1}² — λ kecil = cepat & berisik; λ besar = lambat & stabil. Standar harian: 0,94.",
        "Half-life mengukur daya ingat: λ=0,94 → ~11 hari; λ=0,97 → ~23 hari.",
        "Shrinkage (Ledoit-Wolf): Σ* = δF + (1−δ)S — kompromi bias vs estimation error; wajib untuk banyak-aset + data-pendek.",
        "Trade-off abadi: kecepatan adaptasi vs stabilitas — pilih sesuai tujuan, atau pakai keduanya.",
      ],
      next: { label: "MR3 — Value at Risk", href: "/v2/learn/mr3-var" },
      quiz: [
        {
          q: "EWMA dengan λ=0,94 vs λ=0,99. Mana yang lebih cepat menyadari krisis?",
          options: [
            { text: "λ=0,99 — ingatan lebih panjang", why: "ingatan lebih panjang justru berarti lebih lambat merespons." },
            { text: "λ=0,94 — bobot data terbaru lebih besar, jadi lebih cepat adaptasi", why: "λ lebih kecil = daya ingat lebih pendek = bobot lebih besar untuk data terbaru. Harganya: lebih berisik di masa tenang.", correct: true },
            { text: "Sama saja", why: "λ menentukan kecepatan adaptasi secara langsung." },
            { text: "Tergantung hari", why: "ini sifat struktural rumus, bukan kebetulan harian." },
          ],
        },
        {
          q: "σ² kemarin = 9, return kemarin = −6%, λ=0,94. Estimasi variansi baru?",
          options: [
            { text: "9,00", why: "itu berarti model tidak belajar apa-apa dari kejutan kemarin." },
            { text: "10,62", why: "0,94×9 + 0,06×36 = 8,46 + 2,16 = 10,62. Vol naik dari 3% ke ~3,26% dalam sehari.", correct: true },
            { text: "6,00", why: "kejutan besar menaikkan estimasi, bukan menurunkannya." },
            { text: "15,00", why: "15 akan muncul jika bobot kejutan jauh lebih besar dari 6%." },
          ],
        },
        {
          q: "Portofolio 100 saham dengan histori 60 hari. Masalah utama kovarians sampel?",
          options: [
            { text: "Terlalu stabil", why: "masalahnya justru sebaliknya — terlalu berisik." },
            { text: "Estimation error besar dan matriks bisa singular (aset > observasi) → butuh shrinkage", why: "dengan 100 aset dan 60 observasi, kovarians sampel sangat noisy dan tidak invertible.", correct: true },
            { text: "Tidak bisa dihitung", why: "bisa dihitung, tetapi hasilnya tidak bisa dipercaya." },
            { text: "Selalu akurat", why: "justru di sinilah estimation error paling parah." },
          ],
        },
        {
          q: "Kapan rolling window panjang equal-weighted lebih tepat daripada EWMA?",
          options: [
            { text: "Untuk trading intraday", why: "intraday butuh respons cepat — wilayah EWMA." },
            { text: "Untuk perhitungan modal/regulator yang butuh stabilitas dan transparansi", why: "VaR modal tidak boleh berayun liar setiap hari; keterlambatan adaptasi adalah trade-off yang disadari.", correct: true },
            { text: "Tidak pernah", why: "untuk stabilitas angka modal, window panjang adalah standar." },
            { text: "Saat pasar krisis", why: "saat krisis justru butuh estimator yang cepat sadar." },
          ],
        },
        {
          q: "Mengapa dipakai log-return, bukan simple return, untuk estimasi volatilitas multi-hari?",
          options: [
            { text: "Supaya angkanya lebih kecil", why: "bukan soal ukuran angka." },
            { text: "Log-return aditif terhadap waktu — return 10 hari = jumlah return harian, memudahkan scaling horizon", why: "aditivitas membuat agregasi waktu bersih — penting saat VaR 1-hari diskalakan ke horizon 10-hari lewat aturan akar waktu.", correct: true },
            { text: "Simple return tidak bisa negatif", why: "simple return bisa negatif." },
            { text: "Tidak ada alasan", why: "aditivitas adalah alasan teknis yang kuat." },
          ],
        },
      ],
    },
  ],
};

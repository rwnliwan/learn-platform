import type { V2Lesson } from "../lib/types";

export const b15: V2Lesson = {
  slug: "b15-proses-stokastik",
  track: "Probabilitas",
  module: "Proses Stokastik",
  title: "B15. Proses Stokastik: Random Walk hingga GBM",
  estMinutes: 55,
  steps: [
    {
      id: "pemabuk",
      eyebrow: "Langkah 1 · Random walk",
      title: "Pemabuk dan harga saham",
      prose: [
        "Seorang pemabuk melangkah acak: tiap detik ke kiri atau kanan 50:50. Setelah 10.000 langkah, di mana dia? Jarak tipikalnya ~100 langkah dari awal \u2014 bukan 0, bukan 10.000. Ini random walk \u2014 dan Louis Bachelier (1900!) menyadari harga saham berperilaku sama.",
        "S_n = X_1+\u2026+X_n, X_i = \u00B11. E[S_n] = 0 (fair game). Var(S_n) = n \u2014 varians tumbuh linear dengan waktu! SD(S_n) = \u221An \u2014 jarak tipikal ~\u221An. Keacakan tidak \u201Csaling menghapus\u201D; ia mengakumulasi seperti akar kuadrat.",
        "Aturan \u221At ada di mana-mana: SD return tahunan = SD harian \u00D7 \u221A252. Volatilitas \u201Cdiskalakan\u201D dengan akar waktu \u2014 BUKAN linear! Inilah sebabnya VaR 10-hari = VaR 1-hari \u00D7 \u221A10 (aturan Basel).",
      ],
      formula: String.raw`S_n = \sum_{i=1}^{n} X_i \qquad E[S_n] = 0 \quad \mathrm{Var}(S_n) = n \quad SD(S_n) = \sqrt{n}`,
      formulaNote: "S_n = posisi setelah n langkah: jumlah dari langkah-langkah X_i; tiap X_i = ±1 (kanan/kiri 50:50). E[S_n] = 0: tidak ada arah — ekspektasi diam di awal. Var(S_n) = n: varians bertambah LINEAR dengan langkah karena langkah-langkah independen; SD(S_n) = √n: simpangan baku tumbuh dengan AKAR. Contoh angka: n = 10.000 → SD = 100 — angka ini artinya jarak tipikal pemabuk dari titik awal sekitar 100 langkah: bukan 0 (ekspektasi menipu — ia hampir tidak pernah tepat di 0), bukan 10.000 (langkahnya tidak searah). Akar inilah yang kelak menjadi √t di semua model harga: ketidakpastian tumbuh dengan akar waktu.",
      tasks: [
        { id: "t1", text: "Simulasikan random walk untuk n = 100, 400, 1600 (2000 trial)" },
        { id: "t2", text: "Hitung `sd_tahunan` = SD tahunan dari SD harian 2%" },
        { id: "t3", text: "Cetak SD tiap n + sd_tahunan" },
      ],
      expected: "SD \u2248 \u221An; sd_tahunan\u224831.7%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menskalakan volatilitas linear dengan waktu (VaR 10-hari = 10x VaR 1-hari). Salah 3x lipat. Vol tumbuh \u221D \u221At \u2014 butuh inkremen independen; jika return berkorelasi (tren/vol clustering), \u221At pun goyah.",
      },
      hints: [
        "rw(n): jumlah \u00B11 sebanyak n langkah.",
        "statistics.pstdev untuk SD tiap n.",
        "sd_tahunan = 0.02 * 252**0.5.",
      ],
      code: {
        starter: `import random, statistics\nrandom.seed(151)\n\ndef rw(n):\n    return sum(1 if random.random() < 0.5 else -1 for _ in range(n))\n\n# TULIS KODEMU: SD random walk tiap n, dan SD tahunan\nsds = []\nfor n in [100, 400, 1600]:\n    xs = [rw(n) for _ in range(2000)]\n    sds.append((n, statistics.pstdev(xs)))\nsd_tahunan = \n\nfor n, sd in sds:\n    print(f"n={n:>5}: SD={sd:5.1f}  (teori {n**0.5:.1f})")\nprint(f"sd_tahunan={sd_tahunan:.1%}")`,
        lockLines: 7,
        solution: `import random, statistics\nrandom.seed(151)\n\ndef rw(n):\n    return sum(1 if random.random() < 0.5 else -1 for _ in range(n))\n\n# TULIS KODEMU: SD random walk tiap n, dan SD tahunan\nsds = []\nfor n in [100, 400, 1600]:\n    xs = [rw(n) for _ in range(2000)]\n    sds.append((n, statistics.pstdev(xs)))\nsd_tahunan = 0.02 * 252**0.5\n\nfor n, sd in sds:\n    print(f"n={n:>5}: SD={sd:5.1f}  (teori {n**0.5:.1f})")\nprint(f"sd_tahunan={sd_tahunan:.1%}")`,
        checks: [
          { kind: "equal", task: "t2", name: "sd_tahunan", value: 0.3175, tol: 0.002, label: "`sd_tahunan` seharusnya \u2248 31,7%", msg: "0,02\u00D7\u221A252 \u2248 0,3175." },
          { kind: "stdout_matches", task: "t3", pattern: "sd_tahunan=31\\.7%", label: "`print` menampilkan sd_tahunan", msg: "Cetak dengan format sd_tahunan=... ." },
        ],
      },
      reference: "SD \u221D \u221At. VaR 10-hari = VaR 1-hari \u00D7 \u221A10.",
    },
    {
      id: "brownian",
      eyebrow: "Langkah 2 · Brownian motion",
      title: "Limit kontinu: atom proses kontinu",
      prose: [
        "Perkecil langkah (\u21920) dan percepat (\u2192\u221E) dengan skala tepat \u2192 gerak Brown standar W_t: W_0=0, jalur kontinu, inkremen independen W_t\u2212W_s ~ N(0, t\u2212s) \u2014 varians = selang waktu. E[W_t]=0, Var(W_t)=t.",
        "Brownian motion adalah \u201Catom\u201D proses kontinu \u2014 seperti Bernoulli untuk diskret. SDE ditulis: dX_t = \u03BC dt + \u03C3 dW_t. \u201CPerubahan = tren (\u03BC\u00B7dt) + guncangan acak (\u03C3\u00B7dW)\u201D \u2014 template untuk SEMUA model difusi.",
        "Jalur Brown kontinu tapi tidak terdiferensiasi di titik mana pun \u2014 bergerigi di semua skala (fraktal!). \u201CTren\u201D yang kamu lihat di grafik harga jangka pendek hampir selalu ilusi random walk.",
      ],
      formula: String.raw`W_t - W_s \sim N(0, t-s) \qquad dX_t = \mu\,dt + \sigma\,dW_t`,
      formulaNote: "W_t = gerak Brown standar: W_0 = 0, jalur kontinu, inkremen independen; W_t − W_s ~ N(0, t−s): perubahan selama selang (s,t) berdistribusi Normal dengan mean 0 dan VARIANS = panjang selang — ketidakpastian tumbuh linear dengan waktu. dX_t = μ·dt + σ·dW_t: perubahan infinitesimal = drift μ·dt (arah) + guncangan σ·dW_t (acak, skala √dt). Contoh angka: σ = 20%/tahun → setelah 1 tahun, simpangan tipikal ≈ 20% — angka ini artinya harga aset dengan volatilitas 20% dalam setahun tipikal bergerak ±20% dari driftnya; setelah 4 tahun bukan ±80% melainkan ±40% (√4 = 2). Varians linear, simpangan baku akar — pasangan yang tidak boleh tertukar.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CJalur Brownian bisa diprediksi jika tahu polanya.\u201D Tidak \u2014 fraktal di semua skala. Inilah alasan analisis teknikal murni pola sangat dipertanyakan.",
      },
      reference: "dX = tren + guncangan. Template semua model difusi.",
    },
    {
      id: "gbm",
      eyebrow: "Langkah 3 · GBM",
      title: "Random walk untuk orang kaya",
      prose: [
        "Harga tidak boleh negatif dan return-nya yang acak (bukan perubahan absolut) \u2192 pakai eksponensial dari Brown: dS_t = \u03BCS_t dt + \u03C3S_t dW_t. Solusinya (It\u00F4): S_t = S_0\u00B7exp((\u03BC\u2212\u00BD\u03C3\u00B2)t + \u03C3W_t).",
        "\u2212\u00BD\u03C3\u00B2 adalah koreksi It\u00F4 \u2014 Jensen (B5!) beraksi: E[S_t] = S_0\u00B7e^(\u03BCt), tapi median = S_0\u00B7e^((\u03BC\u2212\u03C3\u00B2/2)t). Log-return normal \u2192 harga lognormal (B7.1!).",
        "Contoh: S0=Rp10.000, \u03BC=10%/thn, \u03C3=30%/thn. ln(S1/S0) ~ N(0,055; 0,09). Median S1 = 10.000\u00D7e^0,055 \u2248 Rp10.566. E[S1] = 10.000\u00D7e^0,1 \u2248 Rp11.052 (lebih tinggi \u2014 Jensen!). P(S1 < S0) \u2248 43% \u2014 meski ekspektasi +10%! Investor \u201Ctipikal\u201D (median) tidak mendapat 10%.",
      ],
      formula: String.raw`dS_t = \mu S_t\,dt + \sigma S_t\,dW_t \qquad S_t = S_0\, e^{(\mu - \frac{1}{2}\sigma^2)t + \sigma W_t}`,
      formulaNote: "S_t = harga di waktu t; μ = expected return (drift); σ = volatilitas; dW_t = guncangan Brown. dS_t = μS_t·dt + σS_t·dW_t: perubahan PROPOSIONAL terhadap harga — yang acak adalah return-nya, bukan perubahan rupiahnya, sehingga harga tidak pernah negatif. Solusinya S_t = S_0·e^((μ−½σ²)t + σW_t): −½σ² adalah koreksi Itô. Contoh angka: μ = 8%, σ = 20% → drift efektif harga = 8% − ½×0,04 = 6% — angka ini artinya ekspektasi harga tumbuh 6%/tahun, BUKAN 8%: volatilitas memakan 2 poin lewat koreksi Itô. Median tumbuh lebih lambat lagi. Mengabaikan −½σ² berarti melebih-lebihkan ekspektasi harga secara sistematis.",
      tasks: [
        { id: "t1", text: "Hitung `mean1` = E[S1] dan `median1` (S0=10000, \u03BC=10%, \u03C3=30%)" },
        { id: "t2", text: "Hitung `p_rugi` = P(S1 < S0) via z-score log-return" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "mean1=11052  median1=10565  p_rugi=42.7%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Volatility drag: investor tipikal (median) mendapat return lebih rendah dari ekspektasi. Volatilitas adalah pajak tersembunyi \u2014 \u00BD\u03C3\u00B2 per tahun.",
      },
      hints: [
        "mean1 = 10000*exp(0.10); median1 = 10000*exp(0.055).",
        "z = (0 - 0.055)/0.30; p_rugi = Phi(z).",
        "Phi via 0.5*(1+erf(z/sqrt(2))).",
      ],
      code: {
        starter: `import math\nS0, mu, sigma = 10_000, 0.10, 0.30\nPhi = lambda z: 0.5*(1+math.erf(z/math.sqrt(2)))\n\n# TULIS KODEMU: mean, median, P(rugi) GBM 1 tahun\nmean1 = \nmedian1 = \np_rugi = \n\nprint(f"mean1={mean1:.0f}  median1={median1:.0f}  p_rugi={p_rugi:.1%}")`,
        lockLines: 2,
        solution: `import math\nS0, mu, sigma = 10_000, 0.10, 0.30\nPhi = lambda z: 0.5*(1+math.erf(z/math.sqrt(2)))\n\n# TULIS KODEMU: mean, median, P(rugi) GBM 1 tahun\nmean1 = S0 * math.exp(mu)\nmedian1 = S0 * math.exp((mu - 0.5*sigma**2))\np_rugi = Phi((0 - (mu - 0.5*sigma**2)) / sigma)\n\nprint(f"mean1={mean1:.0f}  median1={median1:.0f}  p_rugi={p_rugi:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean1", value: 11052, tol: 2, label: "`mean1` seharusnya \u2248 11052", msg: "10.000\u00D7e^0,1 \u2248 11052." },
          { kind: "equal", task: "t1", name: "median1", value: 10565, tol: 2, label: "`median1` seharusnya ≈ 10565", msg: "10.000×e^0,055 ≈ 10565." },
          { kind: "equal", task: "t2", name: "p_rugi", value: 0.4273, tol: 0.005, label: "`p_rugi` seharusnya ≈ 42,7%", msg: "\u03A6(\u22120,183) \u2248 0,427\u20130,433." },
          { kind: "stdout_matches", task: "t3", pattern: "mean1=11052\\s+median1=10565\\s+p_rugi=4", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "GBM: bedakan mean vs median (Jensen!) \u2014 laporkan keduanya.",
    },
    {
      id: "lab-gbm",
      eyebrow: "Langkah 4 · Lab GBM",
      title: "Simulasikan 2.000 path harga setahun",
      prose: [
        "S_T = S0\u00B7exp((\u03BC\u2212\u00BD\u03C3\u00B2)T + \u03C3\u221AT\u00B7Z), Z~N(0,1). Simulasikan 2.000 path (cukup untuk browser), hitung mean, median, dan kuantil 5% (= VaR 95%!). Verifikasi mean \u2248 11.052 dan median \u2248 10.566 dari langkah 3.",
        "Perhatikan: mean > median \u2014 selalu, untuk GBM. Dan VaR langsung terbaca dari kuantil simulasi.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=2000` harga S1 via GBM" },
        { id: "t2", text: "Hitung `m_mean`, `m_median`, `q5` (kuantil 5%)" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "mean\u224811052  median≈10565",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kuantil simulasi = VaR langsung. Model harga yang jujur (GBM + koreksi It\u00F4) = fondasi Black-Scholes dan pricing derivatif.",
      },
      hints: [
        "ST = S0*exp((mu-0.5*sigma**2) + sigma*gauss(0,1)).",
        "Urutkan untuk kuantil 5%.",
        "Bandingkan dengan teori langkah 3.",
      ],
      code: {
        starter: `import random, math, statistics\nrandom.seed(152)\nS0, mu, sigma, N = 10_000, 0.10, 0.30, 2000\nST = [S0*math.exp((mu-0.5*sigma**2) + sigma*random.gauss(0,1)) for _ in range(N)]\nST.sort()\n\n# TULIS KODEMU: mean, median, kuantil 5%\nm_mean = \nm_median = \nq5 = \n\nprint(f"m_mean={m_mean:.0f}  m_median={m_median:.0f}  q5={q5:.0f}")`,
        lockLines: 3,
        solution: `import random, math, statistics\nrandom.seed(152)\nS0, mu, sigma, N = 10_000, 0.10, 0.30, 2000\nST = [S0*math.exp((mu-0.5*sigma**2) + sigma*random.gauss(0,1)) for _ in range(N)]\nST.sort()\n\n# TULIS KODEMU: mean, median, kuantil 5%\nm_mean = statistics.mean(ST)\nm_median = statistics.median(ST)\nq5 = ST[int(0.05*N)]\n\nprint(f"m_mean={m_mean:.0f}  m_median={m_median:.0f}  q5={q5:.0f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "m_mean", value: 11052, tol: 400, label: "`m_mean` mendekati 11052", msg: "Simulasi 2000 path harus dekat teori." },
          { kind: "equal", task: "t2", name: "m_median", value: 10566, tol: 400, label: "`m_median` mendekati 10566", msg: "Median simulasi harus dekat teori." },
          { kind: "stdout_matches", task: "t3", pattern: "m_mean=\\d+\\s+m_median=\\d+\\s+q5=\\d+", label: "`print` menampilkan ketiganya", msg: "Cetak dengan format m_mean=...  m_median=...  q5=... ." },
        ],
      },
      reference: "Mean > median \u2014 selalu, untuk GBM.",
    },
    {
      id: "ou-poisson",
      eyebrow: "Langkah 5 · OU & Poisson",
      title: "Pegas mean-reversion dan lompatan",
      prose: [
        "Ornstein-Uhlenbeck: dX_t = \u03B8(\u03BC\u2212X_t)dt + \u03C3dW_t \u2014 \u201Cpegas\u201D yang menarik kembali ke \u03BC dengan kekuatan \u03B8. Untuk suku bunga, volatilitas, spread pairs-trading \u2014 yang tidak bisa kabur jauh. GBM untuk harga saham (bisa 10x), OU untuk suku bunga (kembali ke normal).",
        "Contoh: dr = 0,5(0,04\u2212r)dt + 0,01dW, r0=0,08. E[r_t] = \u03BC+(r0\u2212\u03BC)e^(\u2212\u03B8t). Setelah 2 tahun: 0,04+0,04\u00B7e^\u22121 \u2248 5,47%. Waktu paruh = ln2/\u03B8 \u2248 1,39 tahun \u2014 setelah itu separuh \u201Cingatan\u201D titik awal hilang. Bandingkan random walk (tidak pernah lupa!): OU = \u201Cada gravitasi ke mean\u201D.",
        "Proses Poisson: kejadian diskret di waktu kontinu (N_t ~ Poisson(\u03BBt)) \u2014 untuk default, klaim, kedatangan order. Jump-diffusion (Merton) = GBM + lompatan Poisson \u2014 untuk crash: difusi sehari-hari + lompatan sesekali.",
      ],
      formula: String.raw`dX_t = \theta(\mu - X_t)\,dt + \sigma\,dW_t \qquad E[X_t] = \mu + (X_0-\mu)e^{-\theta t}`,
      formulaNote: "θ (theta) = kecepatan mean-reversion: seberapa kuat pegas menarik; μ = level keseimbangan jangka panjang; (μ − X_t) = jarak dari keseimbangan — makin jauh, makin kuat tarikannya; σ·dW_t = guncangan acak. E[X_t] = μ + (X_0−μ)e^(−θt): deviasi awal meluruh EKSPONENSIAL. Contoh angka: θ = 2/tahun, deviasi awal 4% → setelah 1 tahun tersisa 4%×e^(−2) ≈ 4%×0,135 = 0,54% — angka ini artinya 86% deviasi sudah terkoreksi dalam setahun; waktu paruhnya ln2/θ ≈ 0,35 tahun ≈ 4 bulan. Untuk suku bunga dan spread pairs trading: jangan ekstrapolasi deviasi hari ini secara linear — pegasnya bekerja dengan kecepatan θ.",
      tasks: [
        { id: "t1", text: "Hitung `e_r2` = E[r] setelah 2 tahun (OU di atas)" },
        { id: "t2", text: "Hitung `waktu_paruh`, cetak keduanya" },
      ],
      expected: "e_r2=5.47%  waktu_paruh=1.39 thn",
      note: {
        title: "Sering salah",
        body: "\u201CSatu model cocok untuk semua deret waktu.\u201D Harga saham (GBM, non-stasioner) \u2260 suku bunga (OU, stasioner) \u2260 default (Poisson, event). Memodelkan suku bunga dengan GBM memprediksi ia bisa 1000% (absurd); memodelkan harga dengan OU memprediksi ia kembali ke \u201Crata-rata\u201D (value trap!).",
      },
      hints: [
        "e_r2 = 0.04 + 0.04*exp(-0.5*2).",
        "waktu_paruh = ln(2)/0.5.",
        "print(f\"e_r2={e_r2:.2%}  waktu_paruh={waktu_paruh:.2f} thn\")",
      ],
      code: {
        starter: `import math\ntheta, mu, r0 = 0.5, 0.04, 0.08\n\n# TULIS KODEMU: ekspektasi OU setelah 2 tahun + waktu paruh\ne_r2 = \nwaktu_paruh = \n\nprint(f"e_r2={e_r2:.2%}  waktu_paruh={waktu_paruh:.2f} thn")`,
        lockLines: 1,
        solution: `import math\ntheta, mu, r0 = 0.5, 0.04, 0.08\n\n# TULIS KODEMU: ekspektasi OU setelah 2 tahun + waktu paruh\ne_r2 = mu + (r0 - mu) * math.exp(-theta * 2)\nwaktu_paruh = math.log(2) / theta\n\nprint(f"e_r2={e_r2:.2%}  waktu_paruh={waktu_paruh:.2f} thn")`,
        checks: [
          { kind: "equal", task: "t1", name: "e_r2", value: 0.0547, tol: 0.001, label: "`e_r2` seharusnya \u2248 5,47%", msg: "0,04+0,04\u00B7e^\u22121 \u2248 0,0547." },
          { kind: "equal", task: "t2", name: "waktu_paruh", value: 1.386, tol: 0.01, label: "`waktu_paruh` seharusnya \u2248 1,39", msg: "ln2/0,5 \u2248 1,386." },
          { kind: "stdout_matches", task: "t2", pattern: "e_r2=5\\.47%\\s+waktu_paruh=1\\.39 thn", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "\u03B8 = kekuatan mean-reversion. Kembali \u2192 OU; melayang \u2192 GBM.",
    },
    {
      id: "minicase-var10",
      eyebrow: "Langkah 6 · Mini-case",
      title: "VaR 10-hari: \u00D710 atau \u00D7\u221A10?",
      prose: [
        "Regulator meminta VaR 10-hari 99%. Tim menghitung VaR 1-hari = Rp1 M (via GBM/historis), lalu melaporkan VaR 10-hari = Rp10 M (\u00D710). Apa yang salah? Skala linear salah \u2014 volatilitas tumbuh \u221D \u221At, bukan t. Mengalikan 10 melebih-lebihkan 3x lipat.",
        "Yang benar di bawah asumsi i.i.d.: VaR 10-hari = Rp1 M \u00D7 \u221A10 \u2248 Rp3,16 M. Kapan bahkan \u221A10 pun salah? Jika return berautokorelasi (tren/vol clustering \u2014 butuh GARCH), distribusi tidak stabil (regime change), atau ada lompatan (jump-diffusion).",
        "Aturan Basel memakai \u221A10 sebagai aproksimasi \u2014 bank yang serius memodelkan langsung horizon 10-hari. Aturan skala adalah alat cepat, bukan kebenaran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Skala linear = modal boros 3x lipat (atau sinyal salah). Aturan \u221At menghemat modal tanpa mengorbankan kejujuran \u2014 selama asumsi i.i.d. dicek.",
      },
      quiz: [
        {
          q: "VaR 1-hari Rp1 M. VaR 10-hari (i.i.d.) yang benar?",
          options: [
            { text: "Rp10 M", why: "Salah: skala linear melebih-lebihkan 3x lipat." },
            { text: "Rp3,16 M (\u221A10)", why: "Benar: volatilitas \u221D \u221At.", correct: true },
            { text: "Tetap Rp1 M", why: "Salah: risiko mengakumulasi dengan waktu." },
          ],
        },
        {
          q: "Kapan \u221A10 pun salah untuk skala VaR?",
          options: [
            { text: "Tidak pernah \u2014 selalu benar", why: "Salah: butuh asumsi i.i.d." },
            { text: "Jika return berautokorelasi / regime change / ada lompatan", why: "Benar: tren, vol clustering, atau jump-diffusion merusak skala \u221At.", correct: true },
            { text: "Jika VaR 1-hari kecil", why: "Salah: besarnya VaR tidak relevan." },
          ],
        },
      ],
      reference: "Aturan skala = alat cepat, bukan kebenaran. Cek asumsi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B16.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: waktu empat kali lipat, risiko hanya dua kali lipat",
        body: "Risiko menyebar dengan akar waktu, bukan linear. VaR 10 hari adalah VaR 1 hari dikali √10 ≈ 3,16 — bukan dikali 10. Praktisi yang mengalikan linear melebih-lebihkan risiko horizon panjang hampir tiga kali lipat; yang mengabaikan akar waktu meremehkannya. Akar ini datang dari varians yang bertambah linear: setiap hari menambah ketidakpastian yang independen, dan simpangan baku adalah akarnya. Aturan keputusannya: skala waktu pakai √t untuk difusi murni; curigai jika ada tren atau autokorelasi — keduanya merusak akar. Dua koreksi praktisi yang sering dilupakan: pertama, dalam GBM bekerjalah dalam log-return, karena yang acak adalah return-nya, bukan perubahan harganya — dan ingat koreksi Itô −½σ²: harga ekspektasian tumbuh lebih lambat dari μ karena volatilitas memakan sebagian. Kedua, untuk suku bunga atau spread, mean-reversion berarti guncangan meluruh — jangan ekstrapolasi deviasi hari ini secara linear ke depan. Waktu menyembuhkan sebagian guncangan, dan model yang baik tahu seberapa cepat: itulah θ. Hafalkan pasangannya: varians linear, simpangan baku akar — tertukar keduanya berarti salah kuadrat.",
      },
      summary: [
        "Random walk: Var \u221D t, SD \u221D \u221At \u2014 aturan skala volatilitas.",
        "Brownian: limit kontinu; inkremen N(0, dt) independen; template SDE.",
        "GBM: dS = \u03BCSdt + \u03C3SdW \u2014 harga lognormal; bedakan mean vs median.",
        "OU: mean-reverting (suku bunga); Poisson: event; jump-diffusion: keduanya.",
        "Jangan skala vol linear dengan waktu; jangan pakai satu model untuk semua deret.",
      ],
      next: { label: "B16 \u2014 Heavy Tails & EVT", href: "/v2/learn/b16-heavy-tails-evt" },
      quiz: [
        {
          q: "Var(S_n) untuk random walk \u00B11 adalah\u2026",
          options: [
            { text: "\u221An", why: "Salah: itu SD-nya." },
            { text: "n", why: "Benar: varians jumlah inkremen independen = n. SD = \u221An.", correct: true },
            { text: "n\u00B2", why: "Salah: terlalu besar." },
          ],
        },
        {
          q: "Koreksi \u2212\u00BD\u03C3\u00B2 di GBM berasal dari\u2026",
          options: [
            { text: "Regulasi", why: "Salah: ini matematika, bukan aturan." },
            { text: "Jensen/It\u00F4: E[exp] > exp(E) \u2014 mean vs median", why: "Benar: konveksitas eksponensial \u2014 E[S_t] = S_0e^\u03BCt tapi median lebih rendah.", correct: true },
            { text: "Biaya transaksi", why: "Salah: tidak ada hubungannya." },
          ],
        },
        {
          q: "Suku bunga lebih tepat dimodelkan\u2026",
          options: [
            { text: "GBM", why: "Salah: GBM bisa memprediksi suku bunga 1000% \u2014 absurd." },
            { text: "OU (mean-reverting)", why: "Benar: suku bunga punya gravitasi ke normal.", correct: true },
            { text: "Poisson", why: "Salah: Poisson untuk event diskret." },
          ],
        },
        {
          q: "Jalur Brownian motion bersifat\u2026",
          options: [
            { text: "Mulus & terdiferensiasi", why: "Salah: justru sebaliknya." },
            { text: "Kontinu tapi tidak terdiferensiasi di mana pun (fraktal)", why: "Benar: bergerigi di semua skala \u2014 \u201Ctren jangka pendek\u201D biasanya ilusi.", correct: true },
            { text: "Periodik", why: "Salah: tidak ada periodisitas." },
          ],
        },
        {
          q: "S0=50, \u03BC=5%, \u03C3=40%, t=2. Volatility drag per tahun?",
          options: [
            { text: "8% \u2014 menghapus seluruh drift 5%", why: "Benar: drag = \u00BD\u03C3\u00B2 = 8%/tahun. Investor tipikal bahkan negatif!", correct: true },
            { text: "5%", why: "Salah: itu drift-nya, bukan drag-nya." },
            { text: "0%", why: "Salah: volatilitas selalu menggerogoti median." },
          ],
        },
      ],
    },
  ],
};

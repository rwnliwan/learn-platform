import type { V2Lesson } from "../lib/types";

export const b13: V2Lesson = {
  slug: "b13-vasicek",
  track: "Probabilitas",
  module: "Risiko Kredit",
  title: "B13. Vasicek: Satu Faktor yang Menggerakkan Ribuan Kredit",
  estMinutes: 55,
  steps: [
    {
      id: "mustahil-terjadi",
      eyebrow: "Langkah 1 · Model satu faktor",
      title: "Mengapa 5% \u00D7 1.000 \u2260 50 gagal?",
      prose: [
        "B1 mengajarkan: 1.000 nasabah \u00D7 PD 5% (independen) \u2192 ekspektasi 50 gagal, SD 6,9. Kenyataannya saat krisis 2008: 200 gagal \u2014 22 SD di atas mean! Model Binomial bilang \u201Cmustahil\u201D. Yang mustahil bukan kejadiannya, melainkan modelnya \u2014 yang salah asumsi independen.",
        "Model Vasicek (1987): nilai aset (laten) debitur i adalah X_i = \u221A\u03C1\u00B7Y + \u221A(1\u2212\u03C1)\u00B7\u03B5_i. Y ~ N(0,1) faktor sistemik (ekonomi, sama untuk semua), \u03B5_i ~ N(0,1) idiosinkratik (nasib individual, independen), \u03C1 korelasi aset. Default jika X_i < \u03A6\u207B\u00B9(PD).",
        "Vasicek adalah \u201Corkestra satu dirigen\u201D \u2014 Y dirigen (ekonomi), tiap debitur main notnya sendiri (\u03B5_i) tapi mengikuti tempo dirigen sebesar \u221A\u03C1. Model ini basis rumus modal Basel II/III \u2014 setiap bank di dunia memakainya.",
      ],
      formula: String.raw`X_i = \sqrt{\rho}\,Y + \sqrt{1-\rho}\,\varepsilon_i \qquad \text{default} \iff X_i < \Phi^{-1}(PD)`,
      formulaNote: "\u221A\u03C1 dan \u221A(1\u2212\u03C1) memastikan Var(X_i)=1 \u2014 PD individual tetap, hanya korelasi yang ditambahkan.",
      tasks: [
        { id: "t1", text: "Hitung `sd_binom` = SD Binomial(1000, 0,05)" },
        { id: "t2", text: "Hitung `z` = z-score realisasi 200 gagal, cetak keduanya" },
      ],
      expected: "sd_binom=6.89  z=21.77",
      note: {
        title: "Sering salah",
        body: "\u201CVasicek menaikkan ekspektasi kerugian.\u201D Tidak! E[loss] = PD\u00D7LGD\u00D7EAD tetap (linearitas B5). Yang berubah: distribusi kerugian \u2014 ekor kanan menggemuk. Modal naik, ekspektasi tidak.",
      },
      hints: [
        "sd_binom = (1000*0.05*0.95)**0.5.",
        "z = (200 - 50)/sd_binom.",
        "print(f\"sd_binom={sd_binom:.2f}  z={z:.2f}\")",
      ],
      code: {
        starter: `# 1000 nasabah, PD 5%, model independen (Binomial)\n\n# TULIS KODEMU: SD dan z-score realisasi 200 gagal\nsd_binom = \nz = \n\nprint(f"sd_binom={sd_binom:.2f}  z={z:.2f}")`,
        lockLines: 1,
        solution: `# 1000 nasabah, PD 5%, model independen (Binomial)\n\n# TULIS KODEMU: SD dan z-score realisasi 200 gagal\nsd_binom = (1000 * 0.05 * 0.95) ** 0.5\nz = (200 - 1000*0.05) / sd_binom\n\nprint(f"sd_binom={sd_binom:.2f}  z={z:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_binom", value: 6.89, tol: 0.01, label: "`sd_binom` seharusnya \u2248 6,89", msg: "\u221A(1000\u00D70,05\u00D70,95) \u2248 6,89." },
          { kind: "equal", task: "t2", name: "z", value: 21.77, tol: 0.05, label: "`z` seharusnya \u2248 21,8", msg: "(200\u221250)/6,89 \u2248 21,8 \u2014 \u201Cmustahil\u201D versi Binomial." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_binom=6\\.89\\s+z=21\\.7", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "22 SD = sinyal model salah, bukan kejadian mustahil.",
    },
    {
      id: "kuantil-var",
      eyebrow: "Langkah 2 · VaR kredit",
      title: "Rumus kuantil: ekor 8,8x mean",
      prose: [
        "Bersyarat pada Y (ekonomi diketahui), default antar debitur independen dengan p(Y) = \u03A6((\u03A6\u207B\u00B9(PD) \u2212 \u221A\u03C1\u00B7Y)/\u221A(1\u2212\u03C1)). Untuk portofolio besar homogen (LLN!), fraksi default \u2192 p(Y). Kuantilnya ada rumus tertutup: q_\u03B1 = \u03A6((\u03A6\u207B\u00B9(PD) + \u221A\u03C1\u00B7\u03A6\u207B\u00B9(\u03B1))/\u221A(1\u2212\u03C1)).",
        "Contoh: PD=2%, \u03C1=0,15, \u03B1=99,9%. \u03A6\u207B\u00B9(0,02)=\u22122,05, \u03A6\u207B\u00B9(0,999)=3,09. q = \u03A6((\u22122,05+\u221A0,15\u00D73,09)/\u221A0,85) = \u03A6(\u22120,93) \u2248 17,6%. Bandingkan: ekspektasi cuma 2%, tapi VaR 99,9% = 17,6% \u2014 8,8x lipat!",
        "Inilah mengapa modal bank besar: melindungi dari ekor korelasi. Basel IRB memakai rumus ini (dengan penyesuaian maturity & LGD); \u03C1 ditetapkan regulator per segmen (misal 0,12\u20130,24 untuk korporasi).",
      ],
      formula: String.raw`q_\alpha = \Phi\left(\frac{\Phi^{-1}(PD) + \sqrt{\rho}\,\Phi^{-1}(\alpha)}{\sqrt{1-\rho}}\right)`,
      formulaNote: "VaR kredit: dengan keyakinan \u03B1, fraksi default \u2264 q_\u03B1.",
      tasks: [
        { id: "t1", text: "Hitung `q` = kuantil 99,9% untuk PD=2%, \u03C1=0,15" },
        { id: "t2", text: "Cetak `q` sebagai persen 1 desimal" },
      ],
      expected: "q=17.6%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ekor \u2248 8,8x mean \u2014 modal melindungi dari korelasi, bukan dari rata-rata. Modal SANGAT sensitif terhadap \u03C1: salah estimasi sedikit \u2192 modal salah besar.",
      },
      hints: [
        "Gunakan statistics.NormalDist().inv_cdf dan .cdf.",
        "q = ND.cdf((ND.inv_cdf(0.02) + sqrt(0.15)*ND.inv_cdf(0.999))/sqrt(0.85)).",
        "print(f\"q={q:.1%}\")",
      ],
      code: {
        starter: `import math, statistics\nND = statistics.NormalDist()\npd, rho, alpha = 0.02, 0.15, 0.999\n\n# TULIS KODEMU: kuantil Vasicek 99,9%\nq = \n\nprint(f"q={q:.1%}")`,
        lockLines: 2,
        solution: `import math, statistics\nND = statistics.NormalDist()\npd, rho, alpha = 0.02, 0.15, 0.999\n\n# TULIS KODEMU: kuantil Vasicek 99,9%\nq = ND.cdf((ND.inv_cdf(pd) + math.sqrt(rho)*ND.inv_cdf(alpha)) / math.sqrt(1-rho))\n\nprint(f"q={q:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "q", value: 0.176, tol: 0.003, label: "`q` seharusnya \u2248 17,6%", msg: "\u03A6(\u22120,93) \u2248 0,176." },
          { kind: "stdout_matches", task: "t2", pattern: "q=17\\.6%", label: "`print` menampilkan q", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "statistics.NormalDist: inv_cdf & cdf. VaR kredit = PD kondisional pada ekonomi seburuk kuantil 1\u2212\u03B1.",
    },
    {
      id: "lab-ekor",
      eyebrow: "Langkah 3 · Lab simulasi",
      title: "Lihat ekor menggemuk dengan \u03C1",
      prose: [
        "Simulasikan 200 debitur, PD=5%, 500 trial: tiap trial tarik SATU faktor Y, lalu tiap debitur default jika \u221A\u03C1\u00B7Y + \u221A(1\u2212\u03C1)\u00B7\u03B5_i < ambang. Bandingkan mean dan VaR 99% untuk \u03C1=0 vs \u03C1=0,3.",
        "Hasilnya: mean sama (~10), tapi VaR meledak dengan \u03C1. Korelasi tidak menggeser pusat (ekspektasi tetap!) \u2014 ia melebarkan distribusi dan menggemukkan ekor kanan. Dengan \u03C1=0,3, skenario \u201C15% gagal\u201D yang mustahil di model independen menjadi lumayan mungkin.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan Vasicek: n=200, PD=5%, trials=500, \u03C1=0 dan \u03C1=0,3" },
        { id: "t2", text: "Hitung `m0`, `v0`, `m3`, `v3` = mean & VaR99% tiap \u03C1" },
        { id: "t3", text: "Cetak keempatnya" },
      ],
      expected: "mean sama, VaR naik dengan \u03C1",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Modal = VaR \u2212 ekspektasi (unexpected loss) tumbuh dengan \u03C1. Salah estimasi \u03C1 = salah modal besar \u2014 itulah mengapa \u03C1 di-stress.",
      },
      hints: [
        "ambang = NormalDist().inv_cdf(0.05).",
        "Tiap trial: satu Y, lalu n cek default.",
        "VaR99% = nilai terurut ke-int(0.99*trials).",
      ],
      code: {
        starter: `import random, math, statistics\nrandom.seed(131)\nND = statistics.NormalDist()\nambang = ND.inv_cdf(0.05)\nn, trials = 200, 500\n\ndef sim(rho):\n    sr, s1r = math.sqrt(rho), math.sqrt(1-rho)\n    hasil = []\n    for _ in range(trials):\n        Y = random.gauss(0, 1)\n        gagal = sum(1 for _ in range(n) if sr*Y + s1r*random.gauss(0,1) < ambang)\n        hasil.append(gagal)\n    hasil.sort()\n    return statistics.mean(hasil), hasil[int(0.99*trials)]\n\n# TULIS KODEMU: bandingkan rho=0 vs rho=0.3\nm0, v0 = \nm3, v3 = \n\nprint(f"rho=0:   mean={m0:.0f}  VaR99%={v0}")\nprint(f"rho=0.3: mean={m3:.0f}  VaR99%={v3}")`,
        lockLines: 13,
        solution: `import random, math, statistics\nrandom.seed(131)\nND = statistics.NormalDist()\nambang = ND.inv_cdf(0.05)\nn, trials = 200, 500\n\ndef sim(rho):\n    sr, s1r = math.sqrt(rho), math.sqrt(1-rho)\n    hasil = []\n    for _ in range(trials):\n        Y = random.gauss(0, 1)\n        gagal = sum(1 for _ in range(n) if sr*Y + s1r*random.gauss(0,1) < ambang)\n        hasil.append(gagal)\n    hasil.sort()\n    return statistics.mean(hasil), hasil[int(0.99*trials)]\n\n# TULIS KODEMU: bandingkan rho=0 vs rho=0.3\nm0, v0 = sim(0.0)\nm3, v3 = sim(0.3)\n\nprint(f"rho=0:   mean={m0:.0f}  VaR99%={v0}")\nprint(f"rho=0.3: mean={m3:.0f}  VaR99%={v3}")`,
        checks: [
          { kind: "equal", task: "t2", name: "m0", value: 10, tol: 2, label: "mean \u03C1=0 \u2248 10", msg: "200\u00D70,05 = 10." },
          { kind: "equal", task: "t2", name: "m3", value: 10, tol: 2, label: "mean \u03C1=0,3 \u2248 10", msg: "Ekspektasi tidak berubah dengan \u03C1!" },
          { kind: "stdout_matches", task: "t3", pattern: "VaR99%=\\d+", label: "`print` menampilkan VaR", msg: "Cetak kedua baris perbandingan." },
        ],
      },
      reference: "\u03C1 mengubah distribusi, bukan ekspektasi. Ekor = modal.",
    },
    {
      id: "batas-jujur",
      eyebrow: "Langkah 4 · Batas-batas",
      title: "Model pertama yang benar arahnya \u2014 bukan kitab suci",
      prose: [
        "Batas yang jujur: (1) Struktur Gaussian (B10!) \u2014 tanpa tail dependence; krisis ekstrem bisa lebih bergerombol dari prediksi. (2) \u03C1 konstan \u2014 korelasi aset berubah sepanjang siklus (correlation breakdown, B9). (3) Portofolio homogen \u2014 dunia nyata heterogen (PD/LGD/EAD beda), butuh Monte Carlo (B12). (4) Satu faktor \u2014 ekonomi multi-dimensi (sektor, region) butuh multi-faktor.",
        "Vasicek adalah \u201Cmodel pertama yang benar arahnya\u201D \u2014 ia menangkap esensi (korelasi via faktor bersama) dengan elegan. Tapi: stress \u03C1, uji copula alternatif, dan Monte Carlo untuk portofolio heterogen.",
        "Satu jebakan: \u201Ckorelasi aset (\u03C1) = korelasi default.\u201D Beda! \u03C1 adalah korelasi nilai aset laten (kontinu). Korelasi default (indikator biner) jauh lebih kecil dan tergantung PD: PD=2%, \u03C1_aset=0,15 \u2243 korelasi default ~0,02! Selalu tanyakan: korelasi apa?",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mencampuradukkan korelasi aset dengan korelasi default = salah mengira \u201Cdefault hampir independen\u201D padahal \u03C1_aset signifikan. Parameter yang paling menentukan modal adalah yang paling sulit diestimasi \u2014 di sinilah konservatisme regulator berasal.",
      },
      quiz: [
        {
          q: "Kelemahan struktural Vasicek terkait B10\u2026",
          options: [
            { text: "Terlalu rumit", why: "Salah: justru elegan dan sederhana." },
            { text: "Struktur Gaussian tanpa tail dependence", why: "Benar: seperti copula Gaussian \u2014 krisis ekstrem bisa lebih bergerombol.", correct: true },
            { text: "Tidak ada rumus", why: "Salah: rumus kuantilnya tertutup." },
          ],
        },
        {
          q: "Dalam Vasicek, Y (faktor sistemik) berperan sebagai\u2026",
          options: [
            { text: "Nasib individual tiap debitur", why: "Salah: itu \u03B5_i." },
            { text: "Ekonomi bersama yang menggerakkan semua debitur", why: "Benar: Y sama untuk semua \u2014 sumber korelasi.", correct: true },
            { text: "Tingkat bunga", why: "Salah: Y abstrak \u2014 \u201Ckesehatan ekonomi\u201D laten." },
          ],
        },
      ],
      reference: "Stress \u03C1. Uji copula alternatif. MC untuk heterogen.",
    },
    {
      id: "minicase-kalibrasi",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Kalibrasi \u03C1 dari 10 tahun data",
      prose: [
        "Bank punya 10 tahun data default tahunan portofolio UKM: rata-rata 3%, tapi tahun terburuk 11%. Model independen (Binomial) bilang P(\u226511%) \u2248 0. Perkirakan \u03C1 yang konsisten: cari \u03C1 sehingga q_90% \u2248 11% (tahun terburuk dari 10 \u2248 kuantil 90%).",
        "Coba \u03C1=0,2: q_90% = \u03A6((\u03A6\u207B\u00B9(0,03)+\u221A0,2\u00D71,28)/\u221A0,8) \u2248 7,2%. Kurang. \u03C1=0,35 \u2192 \u22488,2%. \u03C1=0,5 \u2192 \u22488,4%. Butuh \u03C1 sangat tinggi atau model multi-faktor \u2014 data 10 titik tidak cukup untuk kalibrasi presisi! Inilah pesan sebenarnya: kalibrasi \u03C1 dari deret pendek sangat tidak pasti.",
        "Bahaya mengkalibrasi dari 10 tahun \u201Ctenang\u201D: tidak mengandung krisis \u2014 \u03C1 terkalibrasi terlalu rendah (period bias). Praktik benar: pakai \u03C1 regulator (konservatif) + stress + data lintas siklus + benchmark antar bank.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `q90` untuk PD=3%, \u03C1=0,2 (bandingkan dengan 11%)" },
        { id: "t2", text: "Cetak `q90` sebagai persen 1 desimal" },
      ],
      expected: "q90=7.2% (< 11%: butuh \u03C1 lebih besar)",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Parameter yang paling menentukan modal = yang paling sulit diestimasi. Kalibrasi dari periode tenang = modal terlalu kecil tepat sebelum krisis.",
      },
      hints: [
        "q90 = ND.cdf((ND.inv_cdf(0.03) + sqrt(0.2)*ND.inv_cdf(0.9))/sqrt(0.8)).",
        "ND.inv_cdf(0.9) \u2248 1,28.",
        "print(f\"q90={q90:.1%}\")",
      ],
      code: {
        starter: `import math, statistics\nND = statistics.NormalDist()\n\n# TULIS KODEMU: kuantil 90% Vasicek, PD=3%, rho=0.2\nq90 = \n\nprint(f"q90={q90:.1%}")`,
        lockLines: 2,
        solution: `import math, statistics\nND = statistics.NormalDist()\n\n# TULIS KODEMU: kuantil 90% Vasicek, PD=3%, rho=0.2\nq90 = ND.cdf((ND.inv_cdf(0.03) + math.sqrt(0.2)*ND.inv_cdf(0.9)) / math.sqrt(0.8))\n\nprint(f"q90={q90:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "q90", value: 0.0719, tol: 0.003, label: "`q90` seharusnya \u2248 7,2%", msg: "\u03A6(\u22121,46) \u2248 0,0719 < 11% \u2014 \u03C1=0,2 belum cukup." },
          { kind: "stdout_matches", task: "t2", pattern: "q90=7\\.2%", label: "`print` menampilkan q90", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kalibrasi \u03C1 dari deret pendek = sangat tidak pasti. Pakai \u03C1 konservatif + stress.",
    },
    {
      id: "modal-vasicek",
      eyebrow: "Langkah 6 · Modal Vasicek",
      title: "Dari kuantil ke modal: unexpected loss",
      prose: [
        "Kuantil q dari langkah 2 adalah kerugian di skenario buruk (99,9 persen). Modal bukan q itu sendiri — modal adalah unexpected loss: selisih antara kerugian skenario buruk dan kerugian yang diharapkan. Rumusnya: modal per unit eksposur = LGD × (q − PD). Ekspektasi (PD × LGD) sudah dicadangkan lewat provisi atau CKPN; modal menutup sisanya — yang tidak diharapkan.",
        "Contoh: PD = 2 persen, ρ = 0,15, LGD = 45 persen. Kuantil 99,9 persen dari langkah 2: q ≈ 17,63 persen. Modal = 0,45 × (0,1763 − 0,02) = 0,45 × 0,1563 ≈ 7,03 persen dari eksposur. Bandingkan dengan expected loss-nya: 0,02 × 0,45 = 0,9 persen. Modalnya hampir 8x expected loss — sekali lagi, ekor yang menentukan, bukan rata-rata.",
        "Tiga hal yang membuat angka ini bergerak: ρ naik → q naik → modal naik (paling sensitif); PD naik → q dan ekspektasi sama-sama naik, tetapi selisihnya melebar; LGD naik → modal naik proporsional. Inilah alasan Basel menetapkan ρ per segmen dan mewajibkan stress: parameter yang paling menentukan modal adalah yang paling sulit diestimasi — jadi regulator memaksa konservatisme di sana.",
      ],
      formula: String.raw`\text{Modal} = LGD \times (q_{99{,}9\%} - PD) = 0{,}45 \times (0{,}1763 - 0{,}02) \approx 7{,}03\%`,
      formulaNote: "Modal = unexpected loss per unit eksposur; LGD = 45 persen; q = 17,63 persen = kuantil Vasicek 99,9 persen; PD = 2 persen; 0,45 × 0,1563 = 0,0703 = 7,03 persen.",
      tasks: [
        { id: "t1", text: "Hitung `q` = kuantil Vasicek 99,9% (PD=2%, ρ=0,15)" },
        { id: "t2", text: "Hitung `capital` = LGD × (q − PD) dengan LGD=45%, cetak keduanya 4 desimal" },
      ],
      expected: "q=0.1763  capital=0.0703",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Modal ≈ 8x expected loss (7,03% vs 0,9%) — bank yang mencadangkan modal sebesar expected loss-nya sedang bermain api. Provisi menutup yang diharapkan; modal menutup yang tidak diharapkan.",
      },
      hints: [
        "q = rumus kuantil langkah 2 (ND.cdf dan ND.inv_cdf).",
        "capital = lgd * (q - pd).",
        "print(f\"q={q:.4f}  capital={capital:.4f}\")",
      ],
      code: {
        starter: `import math, statistics\nND = statistics.NormalDist()\npd, rho, lgd = 0.02, 0.15, 0.45\n\n# TULIS KODEMU: kuantil 99,9% lalu modal = LGD x (q - PD)\nq = \ncapital = \n\nprint(f"q={q:.4f}  capital={capital:.4f}")`,
        lockLines: 2,
        solution: `import math, statistics\nND = statistics.NormalDist()\npd, rho, lgd = 0.02, 0.15, 0.45\n\n# TULIS KODEMU: kuantil 99,9% lalu modal = LGD x (q - PD)\nq = ND.cdf((ND.inv_cdf(pd) + math.sqrt(rho)*ND.inv_cdf(0.999)) / math.sqrt(1-rho))\ncapital = lgd * (q - pd)\n\nprint(f"q={q:.4f}  capital={capital:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "q", value: 0.1763, tol: 0.003, label: "`q` seharusnya ≈ 0.1763", msg: "Kuantil Vasicek 99,9% untuk PD=2%, ρ=0,15." },
          { kind: "equal", task: "t2", name: "capital", value: 0.0703, tol: 0.001, label: "`capital` seharusnya ≈ 0.0703", msg: "0,45 × (0,1763 − 0,02) ≈ 0,0703." },
          { kind: "stdout_matches", task: "t2", pattern: "q=0\\.1763\\s+capital=0\\.0703", label: "`print` menampilkan keduanya", msg: "Format: q=...  capital=... ." },
        ],
      },
      quiz: [
        {
          q: "Modal Vasicek = LGD × (q − PD). Kenapa bukan LGD × q?",
          options: [
            { text: "Karena PD sudah dicadangkan lewat provisi/CKPN — modal hanya menutup unexpected loss", why: "Benar: expected loss = PD × LGD ditutup provisi; modal = selisihnya.", correct: true },
            { text: "Karena q terlalu kecil", why: "Salah: q justru besar — 17,63% vs PD 2%." },
            { text: "Karena LGD tidak berlaku untuk modal", why: "Salah: LGD mengalikan keduanya — kerugian = fraksi default × LGD." },
          ],
        },
        {
          q: "ρ naik dari 0,15 ke 0,30. Apa yang terjadi pada modal?",
          options: [
            { text: "Tetap — modal hanya bergantung PD dan LGD", why: "Salah: q naik dengan ρ, jadi modal naik." },
            { text: "Naik — kuantil q menggemuk, selisih (q − PD) melebar", why: "Benar: modal paling sensitif terhadap ρ — itulah mengapa ρ di-stress.", correct: true },
            { text: "Turun — korelasi tinggi berarti diversifikasi", why: "Salah: korelasi tinggi menghancurkan diversifikasi, bukan menciptakannya." },
          ],
        },
      ],
      reference: "Modal = LGD × (q − PD). Provisi menutup EL; modal menutup UL.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B14.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: satu faktor menjelaskan mengapa yang mustahil terjadi berbarengan",
        body: "PD 5% untuk 1.000 kredit tidak berarti 50 gagal dengan pasti — dan juga tidak berarti gagalnya tersebar acak. Model Vasicek menunjukkan satu faktor bersama Y, kondisi ekonomi, mengikat semuanya: saat Y buruk, peluang gagal tiap kredit naik bersamaan. Inilah mengapa 200 gagal sekaligus bisa terjadi padahal ekspektasinya 50 — bukan karena PD-nya salah, melainkan karena korelasinya bekerja. Praktisi merasakannya sebagai: diversifikasi antar debitur bukan diversifikasi antar skenario. Seribu kredit di satu negara dalam satu resesi pada dasarnya adalah satu taruhan besar pada faktor yang sama. Aturan keputusannya: ρ adalah seluruh cerita. ρ kecil mengubah ekor secara dramatis — kuantil 99,9% bisa sembilan kali lipat mean. Kalibrasi ρ dari data tahun baik akan meremehkan ekor; stres dengan ρ krisis. Jebakan yang mahal: mengira portofolio granular, banyak debitur kecil, berarti aman. Granularitas membunuh idiosyncratic risk, tetapi systematic risk — faktor Y — tidak bisa didiversifikasi pergi. Satu faktor tetap berkuasa atas ribuan kredit.",
      },
      summary: [
        "Model: X_i = \u221A\u03C1\u00B7Y + \u221A(1\u2212\u03C1)\u00B7\u03B5_i \u2014 satu faktor sistemik + idiosinkratik.",
        "Default jika X_i < \u03A6\u207B\u00B9(PD); VaR kredit via rumus kuantil \u2014 basis modal Basel.",
        "Ekspektasi tetap, ekor menggemuk dengan \u03C1 \u2014 modal melindungi unexpected loss.",
        "Batas: Gaussian (tanpa tail dependence), \u03C1 konstan, homogen \u2014 stress & validasi selalu.",
        "\u03C1_aset \u2260 korelasi default. Selalu tanyakan: korelasi apa?",
      ],
      next: { label: "B14 \u2014 Markov Chain", href: "/v2/learn/b14-markov-chain" },
      quiz: [
        {
          q: "Vasicek mengubah ekspektasi kerugian portofolio?",
          options: [
            { text: "Ya, menaikkan", why: "Salah: linearitas B5 \u2014 E[loss] tetap." },
            { text: "Tidak \u2014 hanya distribusinya (ekor menggemuk)", why: "Benar: yang naik VaR/modal (unexpected loss), bukan ekspektasi.", correct: true },
            { text: "Ya, menurunkan", why: "Salah: tidak ada mekanisme penurunan." },
          ],
        },
        {
          q: "PD=2%, \u03C1=0,15: VaR 99,9% \u2248 17,9% vs ekspektasi 2%. Artinya\u2026",
          options: [
            { text: "Model salah", why: "Salah: ini konsekuensi korelasi yang benar." },
            { text: "Ekor 9x mean \u2014 modal melindungi dari korelasi, bukan dari rata-rata", why: "Benar: inti modal kredit \u2014 unexpected loss dari korelasi.", correct: true },
            { text: "PD sebenarnya 17,9%", why: "Salah: PD tetap 2% \u2014 17,9% adalah kuantil distribusi kerugian." },
          ],
        },
        {
          q: "\u03C1 naik. Yang terjadi pada modal (VaR\u2212ekspektasi)?",
          options: [
            { text: "Turun", why: "Salah: ekor menggemuk \u2192 modal naik." },
            { text: "Naik \u2014 ekor menggemuk", why: "Benar: modal \u221D ekor \u221D \u03C1. Salah estimasi \u03C1 = salah modal besar.", correct: true },
            { text: "Tetap", why: "Salah: hanya ekspektasi yang tetap." },
          ],
        },
        {
          q: "n=500, PD=2%, \u03C1=0,15. SD jumlah gagal Vasicek vs Binomial?",
          options: [
            { text: "\u224827,3 vs 3,13 \u2014 8,7x lipat", why: "Benar: korelasi meledakkan SD jumlah gagal.", correct: true },
            { text: "Sama \u2014 korelasi tidak mengubah SD", why: "Salah: justru itu yang diubah korelasi." },
            { text: "3,13 vs 27,3", why: "Salah: tertukar." },
          ],
        },
        {
          q: "Mengapa rumus modal Basel memakai PD kondisional (Z buruk), bukan PD rata-rata?",
          options: [
            { text: "Karena PD rata-rata sulit dihitung", why: "Salah: PD rata-rata mudah \u2014 tapi bukan yang dilindungi modal." },
            { text: "Modal = buffer untuk kondisi buruk; PD rata-rata di-cover provisi/EL", why: "Benar: unexpected loss = PD saat Z buruk.", correct: true },
            { text: "Regulator suka angka besar", why: "Salah: alasannya risiko, bukan preferensi." },
          ],
        },
      ],
    },
  ],
};

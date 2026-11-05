import type { V2Lesson } from "../lib/types";

export const b16: V2Lesson = {
  slug: "b16-heavy-tails-evt",
  track: "Probabilitas",
  module: "Ekor Berat",
  title: "B16. Heavy Tails & EVT: Ekor yang Memakan Model",
  estMinutes: 55,
  steps: [
    {
      id: "banjir",
      eyebrow: "Langkah 1 · Heavy tail",
      title: "Banjir \u201C1-in-100-tahun\u201D yang datang 3x seabad",
      prose: [
        "Kota membangun tanggul untuk banjir \u201C1-in-100-tahun\u201D berdasar 50 tahun data dengan model Normal. Dalam 30 tahun berikutnya, banjir sebesar itu datang 3 kali. Yang salah: modelnya. Tinggi banjir berekor tebal \u2014 ekstrapolasi Normal dari 50 tahun data meremehkan kuantil 1% secara sistematis.",
        "Definisi: distribusi berekor tebal (kanan) jika ekornya turun lebih lambat dari eksponensial. Praktisnya: Pareto, lognormal (agak), t-Student \u2014 vs Normal/Eksponensial (tipis). Konsekuensi: momen bisa tak hingga (B7.2); sampel maksimum tumbuh cepat; CLT lambat/gagal.",
        "Tes 10 detik: urutkan data, lihat 1% teratas menyumbang berapa % dari total. Normal: ~3%. Pareto \u03B1=1,5: ~30%+. Jika \u201Csecuil data menguasai total\u201D \u2014 kamu di wilayah heavy tail, dan mean/SD tidak bisa dipercaya.",
      ],
      formula: String.raw`\lim_{x\to\infty} \frac{P(X > x)}{e^{-\lambda x}} = \infty \quad \text{untuk semua } \lambda > 0`,
      formulaNote: "P(X>x) = ekor distribusi: peluang melampaui x; e^(−λx) = ekor eksponensial pembanding — turun sangat cepat; / = lomba siapa lebih cepat menuju nol; lim_{x→∞} = lihat perilaku di nilai raksasa; = ∞ artinya pembilang menang telak: ekor distribusi turun LEBIH LAMBAT dari eksponensial mana pun, berapa pun λ-nya. Contoh maknanya: banjir 1-in-100-tahun yang datang 3 kali dalam 30 tahun — angka ini artinya bukan kesialan statistik, melainkan model Normal yang ekornya turun terlalu cepat sehingga meremehkan kejadian besar secara sistematis. Di bawah ekor tebal, yang menurut Normal mustahil hanyalah jarang — dan jarang bukan tidak pernah.",
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` data Pareto(\u03B1=1,5)" },
        { id: "t2", text: "Hitung `rasio` = sum 1% terbesar / sum total" },
        { id: "t3", text: "Cetak `rasio` sebagai persen" },
      ],
      expected: "rasio\u224830%+ (secuil menguasai total)",
      note: {
        title: "Sering salah",
        body: "\u201CEkor tebal hanya soal outlier sesekali.\u201D Bukan sesekali \u2014 ini struktural. Pada Pareto \u03B1=1,5, kejadian \u201C10x median\u201D terjadi ~3% waktu (vs 0% praktis pada Normal). Ekstrem adalah rutin, bukan anomali.",
      },
      hints: [
        "pareto: 1.0 / (random.random() ** (1/1.5)).",
        "Urutkan; 1% terbesar = data[-50:].",
        "rasio = sum(top)/sum(data).",
      ],
      code: {
        starter: `import random\nrandom.seed(163)\nN = 5000\ndata = sorted([1.0 / (random.random() ** (1/1.5)) for _ in range(N)])\n\n# TULIS KODEMU: kontribusi 1% terbesar terhadap total\ntop = \nrasio = \n\nprint(f"rasio={rasio:.0%}")`,
        lockLines: 3,
        solution: `import random\nrandom.seed(163)\nN = 5000\ndata = sorted([1.0 / (random.random() ** (1/1.5)) for _ in range(N)])\n\n# TULIS KODEMU: kontribusi 1% terbesar terhadap total\ntop = data[-50:]\nrasio = sum(top) / sum(data)\n\nprint(f"rasio={rasio:.0%}")`,
        checks: [
          { kind: "defined", task: "t2", name: "rasio", label: "`rasio` terdefinisi", msg: "Hitung sum 1% terbesar dibagi sum total." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio=\\d+%", label: "`print` menampilkan rasio", msg: "Cetak dengan format rasio=...%." },
        ],
      },
      reference: "Deteksi: log-log, Hill, QQ-plot vs Eksponensial, rasio max/sum.",
    },
    {
      id: "fisher-tippett",
      eyebrow: "Langkah 2 · Fisher-Tippett",
      title: "Teorema limit untuk maksimum",
      prose: [
        "CLT adalah teorema limit untuk rata-rata. EVT punya padanannya untuk maksimum: (M_n \u2212 b_n)/a_n \u2192 G_\u03BE, dengan M_n = max(X_1,\u2026,X_n) dan G_\u03BE = Generalized Extreme Value (GEV).",
        "\u03BE > 0: Fr\u00E9chet \u2014 heavy tail (Pareto-like). Ini yang menakutkan. \u03BE = 0: Gumbel \u2014 ekor tipis (Normal/Eksponensial). \u03BE < 0: Weibull \u2014 ada batas atas hingga. Jika CLT bilang \u201Crata-rata selalu jadi lonceng\u201D, Fisher-Tippett bilang \u201Cmaksimum selalu jadi salah satu dari tiga bentuk\u201D \u2014 dan bentuknya (\u03BE) menentukan apakah duniamu jinak atau liar.",
        "Metode block maxima: ambil maksimum per blok (tahunan), fit GEV via MLE \u2192 estimasi return level. Tapi boros: 1 data per tahun! POT (langkah 4) memakai semua data ekor.",
      ],
      formula: String.raw`\frac{M_n - b_n}{a_n} \xrightarrow{d} G_\xi \qquad G_\xi(x) = \exp\!\big(-(1+\xi x)^{-1/\xi}\big)`,
      formulaNote: "M_n = maksimum dari n observasi (banjir terbesar, kerugian terbesar); a_n, b_n = konstanta penskala dan penggeser agar limitnya tidak degenerasi; →d = konvergen dalam distribusi; G_ξ = Generalized Extreme Value: SATU keluarga dengan parameter bentuk ξ (xi). ξ = indeks bentuk: satu angka yang menentukan keluarga ekor. Contoh maknanya: ξ > 0 → Fréchet, ekor tebal polinomial (Pareto); ξ = 0 → Gumbel, ekor eksponensial; ξ < 0 → Weibull, ekor terbatas ada batas atasnya — angka ini artinya seluruh pertanyaan apakah ekor tebal atau tidak runtuh menjadi estimasi satu angka ξ; ξ = 0,4 yang signifikan = waspada, model Normal tidak berlaku di sini.",
      tasks: [],
      quiz: [
        {
          q: "Fisher-Tippett adalah padanan CLT untuk\u2026",
          options: [
            { text: "Rata-rata", why: "Salah: itu CLT sendiri." },
            { text: "Maksimum", why: "Benar: maksimum ternormalisasi \u2192 GEV (Fr\u00E9chet/Gumbel/Weibull tergantung \u03BE).", correct: true },
            { text: "Varians", why: "Salah: tidak ada padanan langsung." },
          ],
        },
        {
          q: "Heavy tail berarti\u2026",
          options: [
            { text: "Banyak outlier kecil", why: "Salah: soal ekor besar, bukan kecil." },
            { text: "Ekor turun lebih lambat dari eksponensial \u2014 ekstrem struktural", why: "Benar: konsekuensi: momen bisa tak hingga, ekstrem adalah rutin.", correct: true },
            { text: "Varians nol", why: "Salah: justru varians bisa tak hingga." },
          ],
        },
      ],
      reference: "\u03BE>0 = dunia liar (Fr\u00E9chet). \u03BE menentukan segalanya.",
    },
    {
      id: "lab-normal-pareto",
      eyebrow: "Langkah 3 · Lab",
      title: "Normal vs Pareto: siapa meremehkan ekor?",
      prose: [
        "Data sebenarnya Pareto(\u03B1=1,5), n=5000. Fit Normal via MLE (mean & SD sampel), lalu bandingkan kuantil 99%: empiris vs prediksi Normal (\u03BC + 2,326\u03C3). Normal meremehkan secara sistematis \u2014 inilah dosa insinyur tanggul di cerita pembuka.",
        "Perhatikan juga: SD sampel meledak karena 1\u20132 monster \u2014 gejala klasik heavy tail yang merusak seluruh inferensi berbasis SD.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` Pareto(\u03B1=1,5), hitung kuantil 99% empiris" },
        { id: "t2", text: "Fit Normal (mean, SD), hitung kuantil 99% Normal" },
        { id: "t3", text: "Hitung `remeh` = 1 \u2212 q_norm/q_emp, cetak ketiganya" },
      ],
      expected: "Normal meremehkan puluhan persen",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ekstrapolasi Normal/Eksponensial ke wilayah 1-in-100 meremehkan secara sistematis. Diagnosis 10 detik: plot log-log dulu \u2014 garis lurus = Pareto.",
      },
      hints: [
        "q_emp = data terurut ke-int(0.99*N).",
        "q_norm = mean + 2.326*sd.",
        "remeh = 1 - q_norm/q_emp.",
      ],
      code: {
        starter: `import random, statistics\nrandom.seed(161)\nN = 5000\ndata = sorted([1.0/(random.random()**(1/1.5)) for _ in range(N)])\n\n# TULIS KODEMU: kuantil 99% empiris vs Normal, dan % remeh\nq_emp = \nmu, sd = statistics.mean(data), statistics.pstdev(data)\nq_norm = \nremeh = \n\nprint(f"q_emp={q_emp:.1f}  q_norm={q_norm:.1f}  remeh={remeh:.0%}")`,
        lockLines: 3,
        solution: `import random, statistics\nrandom.seed(161)\nN = 5000\ndata = sorted([1.0/(random.random()**(1/1.5)) for _ in range(N)])\n\n# TULIS KODEMU: kuantil 99% empiris vs Normal, dan % remeh\nq_emp = data[int(0.99*N)]\nmu, sd = statistics.mean(data), statistics.pstdev(data)\nq_norm = mu + 2.326*sd\nremeh = 1 - q_norm/q_emp\n\nprint(f"q_emp={q_emp:.1f}  q_norm={q_norm:.1f}  remeh={remeh:.0%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "q_emp", label: "`q_emp` terdefinisi", msg: "Ambil data terurut ke-99%." },
          { kind: "defined", task: "t3", name: "remeh", label: "`remeh` terdefinisi", msg: "Hitung 1 \u2212 q_norm/q_emp." },
          { kind: "stdout_matches", task: "t3", pattern: "q_emp=\\d+\\.\\d\\s+q_norm=\\d+\\.\\d\\s+remeh=", label: "`print` menampilkan ketiganya", msg: "Cetak dengan format q_emp=...  q_norm=...  remeh=... ." },
        ],
      },
      reference: "Jangan ekstrapolasi Normal ke ekor. Jangan anggap ekstrem anomali.",
    },
    {
      id: "pot-gpd",
      eyebrow: "Langkah 4 · POT + GPD",
      title: "Memakai semua data ekor",
      prose: [
        "Block maxima boros (1 data per tahun!). POT (Peaks Over Threshold): ambil semua exceedance di atas ambang u. Teorema Pickands-Balkema-de Haan: exceedance ternormalisasi \u2192 Generalized Pareto (GPD). Return level \u201C1-in-m observasi\u201D: x_m = u + (\u03B2/\u03BE)((m\u00B7\u03B6_u)^\u03BE \u2212 1), dengan \u03B6_u = P(X>u).",
        "Contoh: kerugian operasional, ambang u=Rp10 M, 40 exceedance dari 1.000 hari (\u03B6=4%). Fit GPD: \u03BE=0,3, \u03B2=5. VaR99,9% = 10 + (5/0,3)[(0,04/0,001)^0,3 \u2212 1] = 10 + 16,67\u00D72,03 \u2248 Rp43,8 M. POT memakai 40 titik, bukan cuma max tahunan \u2014 jauh lebih efisien. \u03BE>0 = ekor tebal = ekstrapolasi meledak.",
        "Pemilihan ambang u: trade-off bias-varians \u2014 terlalu rendah (teorema belum berlaku), terlalu tinggi (sedikit data). Praktik: u di sekitar kuantil 90\u201395% data, lalu cek stabilitas: geser u sedikit \u2014 jika \u03BE berubah drastis, ambangmu salah atau data tidak cukup.",
      ],
      formula: String.raw`x_m = u + \frac{\beta}{\xi}\left((m\,\zeta_u)^{\xi} - 1\right)`,
      formulaNote: "\u03B6_u = proporsi exceedance. Ambang u ~ kuantil 90\u201395%.",
      tasks: [
        { id: "t1", text: "Hitung `var999` = VaR 99,9% via GPD (u=10, \u03B2=5, \u03BE=0,3, \u03B6=4%)" },
        { id: "t2", text: "Cetak `var999` dengan 1 desimal" },
      ],
      expected: "var999=43.7 (Rp juta)",
      note: {
        title: "Sering salah",
        body: "\u201C\u20181-in-100-tahun\u2019 berarti aman 99 tahun.\u201D Artinya peluang 1% tiap tahun \u2014 seperti dadu 100-sisi tiap tahun. P(terjadi dalam 30 tahun) = 1\u22120,99\u00B3\u2070 \u2248 26%! Return level adalah probabilitas tahunan, bukan jadwal.",
      },
      hints: [
        "var999 = 10 + (5/0.3)*((0.04/0.001)**0.3 - 1).",
        "0.04/0.001 = 40; 40**0.3 \u2248 3,02.",
        "print(f\"var999={var999:.1f}\")",
      ],
      code: {
        starter: `# GPD: u=10, beta=5, xi=0.3, zeta=4% (Rp juta)\n\n# TULIS KODEMU: VaR 99,9% via rumus return level\nvar999 = \n\nprint(f"var999={var999:.1f}")`,
        lockLines: 1,
        solution: `# GPD: u=10, beta=5, xi=0.3, zeta=4% (Rp juta)\n\n# TULIS KODEMU: VaR 99,9% via rumus return level\nvar999 = 10 + (5/0.3)*((0.04/0.001)**0.3 - 1)\n\nprint(f"var999={var999:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var999", value: 43.7, tol: 0.3, label: "`var999` seharusnya \u2248 43,7", msg: "10 + 16,67\u00D7(40^0,3\u22121) \u2248 43,7." },
          { kind: "stdout_matches", task: "t2", pattern: "var999=43\\.\\d", label: "`print` menampilkan var999", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "POT: semua exceedance. Ambang ~k95, cek stabilitas \u03BE.",
    },
    {
      id: "lab-hill",
      eyebrow: "Langkah 5 · Lab Hill",
      title: "Estimasi \u03BE dari data",
      prose: [
        "Ambang u = kuantil 95%. Estimator Hill: \u03BE\u0302 = rata-rata log(x/u) untuk exceedance. Untuk Pareto(\u03B1=1,5), teori \u03BE = 1/1,5 \u2248 0,67. Return level 1-in-m untuk Pareto: x_m = u\u00B7(m\u00B7\u03B6)^\u03BE.",
        "Hasilnya: return 1-in-2000 MELAMPAUI max data! Itulah gunanya EVT: ekstrapolasi jujur ke luar data. Tapi ingat: estimasi ekor butuh BANYAK data ekor \u2014 dengan n kecil, \u03BE\u0302 tidak stabil.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=5000` Pareto(1,5); ambang u = kuantil 95%" },
        { id: "t2", text: "Hitung `xi` via Hill dan `x2000` = return level 1-in-2000" },
        { id: "t3", text: "Cetak `xi` dan `x2000` dengan 2/1 desimal" },
      ],
      expected: "xi\u22480.67  x2000 > max data",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "EVT tidak memberi kepastian; ia memberi cara jujur berkata \u201Ckita tidak tahu\u201D \u2014 beserta batas terhitung dari ketidaktahuan itu. Dalam risiko ekor, kejujuran tentang ketidaktahuan adalah satu-satunya kompetensi.",
      },
      hints: [
        "u = data[int(0.95*N)]; exc = [x for x in data if x > u].",
        "xi = sum(log(x/u))/len(exc); zeta = len(exc)/N.",
        "x2000 = u * (2000*zeta)**xi.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(162)\nN = 5000\ndata = sorted([1.0/(random.random()**(1/1.5)) for _ in range(N)])\n\n# TULIS KODEMU: estimator Hill dan return level 1-in-2000\nu = \nexc = \nxi = \nzeta = \nx2000 = \n\nprint(f"xi={xi:.2f}  x2000={x2000:.1f}  max={data[-1]:.1f}")`,
        lockLines: 3,
        solution: `import random, math\nrandom.seed(162)\nN = 5000\ndata = sorted([1.0/(random.random()**(1/1.5)) for _ in range(N)])\n\n# TULIS KODEMU: estimator Hill dan return level 1-in-2000\nu = data[int(0.95*N)]\nexc = [x for x in data if x > u]\nxi = sum(math.log(x/u) for x in exc) / len(exc)\nzeta = len(exc) / N\nx2000 = u * (2000*zeta)**xi\n\nprint(f"xi={xi:.2f}  x2000={x2000:.1f}  max={data[-1]:.1f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "xi", value: 0.67, tol: 0.15, label: "`xi` mendekati 0,67", msg: "Teori: 1/1,5 \u2248 0,67." },
          { kind: "defined", task: "t2", name: "x2000", label: "`x2000` terdefinisi", msg: "Hitung return level 1-in-2000." },
          { kind: "stdout_matches", task: "t3", pattern: "xi=0\\.\\d\\d\\s+x2000=", label: "`print` menampilkan xi dan x2000", msg: "Cetak dengan format xi=...  x2000=...  max=... ." },
        ],
      },
      reference: "Hill: rata-rata log exceedance. Butuh banyak data ekor.",
    },
    {
      id: "minicase-lda",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Modal risiko operasional (LDA)",
      prose: [
        "Bank memakai LDA: frekuensi ~ Poisson(50/thn), severitas ~ Lognormal. AMA menghitung VaR 99,9% = Rp80 M. Kamu curiga severitas berekor tebal (ada 2 kerugian > Rp30 M dalam 5 tahun). Bagaimana menguji kecurigaan?",
        "Uji: log-log plot severitas; Hill estimator; QQ-plot vs Lognormal (lengkung ke atas di kanan = lebih tebal). 2/250 (0,8%) kerugian > Rp30 M \u2014 bandingkan dengan prediksi Lognormal.",
        "Jika benar: VaR 99,9% sangat sensitif ke ekor \u2014 ganti Lognormal \u2192 GPD/Pareto untuk ekor bisa menaikkan VaR 2\u20135x lipat. Rp80 M bisa jadi Rp200\u2013400 M. Desain jujur: body (di bawah ambang) ~ Lognormal + ekor (di atas ambang) ~ GPD (spliced model, seperti mini-case B8!). Untuk risiko operasional, pemilihan ekor adalah keputusan modal terbesar \u2014 lebih penting dari presisi parameter body.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah mengapa model risk untuk LDA sangat tinggi: VaR 99,9% ditentukan ekor, bukan body. Salah keluarga ekor = modal salah 2\u20135x.",
      },
      quiz: [
        {
          q: "VaR 99,9% LDA = Rp80 M dengan severitas Lognormal, tapi data curiga berekor tebal. Dampak jika benar?",
          options: [
            { text: "Tidak ada \u2014 VaR robust", why: "Salah: VaR 99,9% sangat sensitif ke ekor." },
            { text: "VaR bisa naik 2\u20135x \u2014 Rp80 M jadi Rp200\u2013400 M", why: "Benar: ekor menentukan kuantil ekstrem.", correct: true },
            { text: "VaR turun", why: "Salah: ekor tebal menaikkan kuantil ekstrem." },
          ],
        },
        {
          q: "Desain model severitas yang lebih jujur?",
          options: [
            { text: "Lognormal saja, tambah data", why: "Salah: keluarga yang salah tidak diperbaiki lebih banyak data." },
            { text: "Spliced: body Lognormal + ekor GPD di atas ambang", why: "Benar: seperti mini-case B8 \u2014 mekanisme body \u2260 mekanisme ekor.", correct: true },
            { text: "Normal", why: "Salah: lebih buruk lagi." },
          ],
        },
      ],
      reference: "Pemilihan ekor = keputusan modal terbesar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B17.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: di ekor tebal, jangan tanya rata-rata — tanya kuantilnya",
        body: "Pada data berekor tebal, rata-rata adalah statistik yang rapuh: satu observasi raksasa bisa menghapus seluruh sejarah. Praktisi yang berpengalaman mengganti pertanyaannya — bukan berapa rata-rata kerugiannya, melainkan berapa kerugian yang hanya terlampaui 1% waktu. Kuantil, VaR, tetap bermakna bahkan ketika mean tidak ada (α ≤ 1) atau varians takhingga (α ≤ 2). Aturan keputusannya: estimasi indeks ekor ξ dulu, baru pilih perkakasnya. ξ mendekati nol: dunia Gumbel, relatif jinak. ξ di atas 0,3: waspada — ekor tebal terkonfirmasi, VaR Normal meremehkan secara sistematis. ξ di atas 0,5: varians takhingga — berhentilah mengutip simpangan baku seolah ia bermakna. Untuk memodelkan ekor, pakai POT: ambil semua data di atas threshold u, fit GPD — jangan buang data ekor dengan hanya memakai maksimum tahunan. Jebakan termahalnya tetap klasik: menyebut banjir 1-in-100-tahun dari 50 tahun data yang di-fit Normal. Itu bukan estimasi; itu harapan yang ditulis dengan angka. Ekor harus diukur dengan perkakas ekor.",
      },
      summary: [
        "Heavy tail: ekor turun lambat; deteksi via log-log/Hill/rasio max-sum.",
        "Fisher-Tippett: maksimum \u2192 GEV; \u03BE>0 (Fr\u00E9chet) = dunia liar.",
        "POT+GPD: exceedance di atas ambang \u2192 return level; ambang ~k95, cek stabilitas.",
        "\u201C1-in-m\u201D = peluang tahunan, bukan jadwal.",
        "Jangan ekstrapolasi Normal ke ekor; jangan anggap ekstrem sebagai anomali.",
      ],
      next: { label: "B17 \u2014 Bayesian Praktis", href: "/learn/b17-bayesian-praktis" },
      quiz: [
        {
          q: "Kelebihan POT dibanding block maxima\u2026",
          options: [
            { text: "Lebih sederhana", why: "Salah: justru butuh pilihan ambang." },
            { text: "Memakai semua exceedance \u2014 efisien data", why: "Benar: block maxima boros (1/blok).", correct: true },
            { text: "Tidak butuh ambang", why: "Salah: POT butuh ambang u." },
          ],
        },
        {
          q: "\u201CBanjir 1-in-100-tahun\u201D. P(terjadi dalam 30 tahun) \u2248 \u2026",
          options: [
            { text: "30%", why: "Salah: bukan 1%\u00D730." },
            { text: "26% (1\u22120,99\u00B3\u2070)", why: "Benar: 1% per tahun, bukan jadwal \u2014 jauh dari \u201Caman\u201D.", correct: true },
            { text: "3%", why: "Salah: hitung komplemennya." },
          ],
        },
        {
          q: "QQ-plot data vs Eksponensial melengkung ke atas. Artinya\u2026",
          options: [
            { text: "Ekor tipis", why: "Salah: itu kalau melengkung ke bawah." },
            { text: "Heavy tail \u2014 butuh EVT, bukan model eksponensial", why: "Benar: ekor data lebih tebal dari eksponensial.", correct: true },
            { text: "Data normal", why: "Salah: tidak ada hubungannya." },
          ],
        },
        {
          q: "Data klaim: mean=5, median=2, max=200 (n=1.000). Bukti ekor tebal?",
          options: [
            { text: "Mean jauh > median + max = 40x mean", why: "Benar: di Normal, max 1000 sampel \u2248 mean+3,1SD \u2014 tidak 40x mean.", correct: true },
            { text: "n=1.000 terlalu kecil", why: "Salah: n bukan buktinya." },
            { text: "Median < mean selalu berarti heavy tail", why: "Salah: skew ringan juga begitu \u2014 butuh besaran ekstremnya." },
          ],
        },
        {
          q: "\u03BE = 0,4 untuk kerugian (GPD). Artinya untuk mean dan varians?",
          options: [
            { text: "Mean ada; varians ada tapi besar", why: "Benar: \u03BE<1 \u2192 mean ada; \u03BE<0,5 \u2192 varians ada. Hati-hati: \u03BE\u22650,5 = varians tak hingga!", correct: true },
            { text: "Keduanya tak hingga", why: "Salah: butuh \u03BE\u22651 untuk itu." },
            { text: "Keduanya nol", why: "Salah: tidak ada dasarnya." },
          ],
        },
      ],
    },
  ],
};

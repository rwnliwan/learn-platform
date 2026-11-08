import type { V2Lesson } from "../lib/types";

export const a34: V2Lesson = {
  slug: "a34-logistic-glm",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.4 Regresi Logistik & GLM: Peluang, Bukan Angka",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-pd-140",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model yang memprediksi probabilitas 140 persen",
      prose: [
        "Analis junior di multifinance diminta memprediksi peluang gagal bayar (PD). Ia pakai cara yang ia kenal: regresi linear OLS dengan target 0/1. Hasilnya bagus — R kuadrat lumayan, koefisien masuk akal. Model dipresentasikan, disetujui, dipakai untuk pricing.",
        "Sebulan kemudian, sistem pricing mengajukan harga untuk debitur super-berisiko: PD terprediksi = 140 persen. Dan untuk debitur super-aman: PD = -30 persen. Probabilitas di atas 100 persen dan di bawah 0 persen — modelnya bocor keluar dari akal sehat.",
        "Ini bukan bug — ini konsekuensi matematis memakai garis lurus untuk target yang terbatas [0,1]. Garis lurus tidak kenal batas. Solusinya bukan potong manual jadi 0-100 persen (itu menambal gejala), melainkan fungsi yang secara alami terjepit di [0,1]: kurva logistik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "PD 140 persen yang masuk ke pricing berarti harga yang salah hitung secara sistematis — kerugian atau kehilangan bisnis dari model yang bocor.",
      },
      reference: "Target terbatas [0,1] -> butuh link function, bukan garis lurus.",
    },
    {
      id: "lab-mle",
      eyebrow: "Langkah 2 · Lab: MLE & odds ratio",
      title: "Estimasi maximum likelihood, bukan OLS",
      prose: [
        "Regresi logistik memodelkan log-odds (logit) sebagai fungsi linear, lalu mengubahnya kembali jadi probabilitas via sigmoid. Koefisien diestimasi dengan MLE: pilih beta yang membuat data teramati paling mungkin terjadi — OLS tidak bisa dipakai karena targetnya biner.",
        "Di bawah, gradient descent manual sudah mengestimasi model logit(PD) = -1,116 - 1,650 x skor_std (nilai benar: -1,2 dan -1,8). Tugasmu menerjemahkan koefisien ke bahasa bisnis: odds ratio = e^beta.",
        "Odds ratio skor = e^-1,650 = 0,192: tiap +1 SD skor, odds default dikali 0,19 — turun 81 persen. Itulah cara membaca koefisien logistik.",
      ],
      formula: String.raw`\log\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 x_1 + \cdots, \qquad p = \frac{1}{1+e^{-z}}`,
      formulaNote: "log(p/(1-p)) = log-odds (logit); beta_j = perubahan log-odds per 1 satuan x_j; p = 1/(1+e^-z) mengubah logit kembali jadi probabilitas dalam [0,1]. Contoh: beta = -1,65 → odds ratio e^-1,65 = 0,19 — tiap +1 satuan x, odds dikali 0,19.",
      tasks: [
        { id: "t1", text: "Hitung `or_skor` = odds ratio untuk skor" },
        { id: "t2", text: "Hitung `p00` = PD profil baseline (skor_std=0), lalu `print`" },
      ],
      expected: "or=0.192 p00=24.7%",
      note: {
        title: "Sering salah",
        body: "Membaca beta = -1,65 sebagai probabilitas turun 165 persen atau 1,65 poin. Beta hidup di dunia log-odds — terjemahkan via odds ratio, bukan persen probabilitas.",
      },
      hints: [
        "Odds ratio = e pangkat koefisien.",
        "PD baseline: sigmoid(b0) = 1/(1+e^(-b0)).",
        "or_skor = math.exp(b1)",
      ],
      code: {
        starter: `import math\n\n# Hasil estimasi MLE (gradient descent manual); nilai benar: -1.2, -1.8\nb0, b1 = -1.116, -1.650\n\ndef sigmoid(z):\n    return 1/(1+math.exp(-z))\n\n# TULIS KODEMU: odds ratio skor + PD baseline\nor_skor = \np00 = \n\nprint(f"or={or_skor:.3f} p00={p00:.1%}")`,
        lockLines: 7,
        solution: `import math\n\n# Hasil estimasi MLE (gradient descent manual); nilai benar: -1.2, -1.8\nb0, b1 = -1.116, -1.650\n\ndef sigmoid(z):\n    return 1/(1+math.exp(-z))\n\n# TULIS KODEMU: odds ratio skor + PD baseline\nor_skor = math.exp(b1)\np00 = sigmoid(b0)\n\nprint(f"or={or_skor:.3f} p00={p00:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "or_skor", value: 0.192, tol: 0.005, label: "`or_skor` sekitar 0.192", msg: "e^(-1,650) = 0,192. Tiap +1 SD skor, odds dikali 0,19." },
          { kind: "equal", task: "t2", name: "p00", value: 0.2468, tol: 0.005, label: "`p00` sekitar 24.7%", msg: "sigmoid(-1,116) = 0,247. Itu PD profil rata-rata." },
          { kind: "stdout_matches", task: "t2", pattern: "or=0\\.192\\s+p00=24\\.7%", label: "`print` menampilkan OR dan PD", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "MLE: pilih beta yang memaksimalkan peluang data teramati.",
    },
    {
      id: "lab-odds-konstan",
      eyebrow: "Langkah 3 · Lab: odds ratio",
      title: "Odds ratio konstan, efek poin tidak",
      prose: [
        "Koefisien yang sama memberi efek probabilitas berbeda di level risiko berbeda. Model: logit(P) = -1,2 - 1,8 x skor_std + 0,9 x punya_tunggakan. Odds ratio tunggakan = e^0,9 = 2,46 — konstan di semua level.",
        "Tapi efek dalam poin probabilitas tidak konstan: di risiko rendah (skor +1), tunggakan menaikkan PD dari 4,7 ke 10,9 persen (+6,2 poin); di risiko tinggi (skor -1), dari 64,6 ke 81,8 persen (+17,2 poin). Odds ratio tetap 2,46x di keduanya.",
        "Jangan pernah bilang tunggakan menaikkan PD sebesar X persen tanpa menyebut dari level berapa. Hitung sendiri di bawah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p0`, `p1` = PD risiko rendah tanpa/dengan tunggakan" },
        { id: "t2", text: "Hitung `or_t` = odds ratio tunggakan, lalu `print`" },
      ],
      expected: "p0=4.7% p1=10.9% or=2.46",
      note: {
        title: "Sering salah",
        body: "Melaporkan efek koefisien logistik sebagai persen probabilitas yang tetap. Efek poin selalu tergantung level awal — laporkan pada nilai x yang spesifik.",
      },
      hints: [
        "pd(s, t) = sigmoid(-1.2 - 1.8*s + 0.9*t).",
        "Risiko rendah: s = 1.0; bandingkan t=0 vs t=1.",
        "or_t = math.exp(0.9)",
      ],
      code: {
        starter: `import math\n\ndef sigmoid(z):\n    return 1/(1+math.exp(-z))\n\nb0, b_skor, b_tunggak = -1.2, -1.8, 0.9\ndef pd(skor_std, tunggak):\n    return sigmoid(b0 + b_skor*skor_std + b_tunggak*tunggak)\n\n# TULIS KODEMU: PD risiko rendah (skor_std=1) tanpa vs dengan tunggakan\np0 = \np1 = \nor_t = \n\nprint(f"p0={p0:.1%} p1={p1:.1%} or={or_t:.2f}")`,
        lockLines: 9,
        solution: `import math\n\ndef sigmoid(z):\n    return 1/(1+math.exp(-z))\n\nb0, b_skor, b_tunggak = -1.2, -1.8, 0.9\ndef pd(skor_std, tunggak):\n    return sigmoid(b0 + b_skor*skor_std + b_tunggak*tunggak)\n\n# TULIS KODEMU: PD risiko rendah (skor_std=1) tanpa vs dengan tunggakan\np0 = pd(1.0, 0)\np1 = pd(1.0, 1)\nor_t = math.exp(b_tunggak)\n\nprint(f"p0={p0:.1%} p1={p1:.1%} or={or_t:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p0", value: 0.047, tol: 0.003, label: "`p0` sekitar 4.7%", msg: "PD skor_std=1 tanpa tunggakan." },
          { kind: "equal", task: "t1", name: "p1", value: 0.109, tol: 0.003, label: "`p1` sekitar 10.9%", msg: "PD skor_std=1 dengan tunggakan. Selisihnya 6,2 poin." },
          { kind: "equal", task: "t2", name: "or_t", value: 2.46, tol: 0.01, label: "`or_t` sekitar 2.46", msg: "e^0,9 = 2,46 — konstan di semua level risiko." },
          { kind: "stdout_matches", task: "t2", pattern: "p0=4\\.7%\\s+p1=10\\.9%\\s+or=2\\.46", label: "`print` menampilkan efek + OR", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "OR konstan; efek poin = f(level awal). Laporkan keduanya.",
    },
    {
      id: "separasi-mle",
      eyebrow: "Langkah 4 · Separasi & MLE",
      title: "Koefisien meledak = alarm, bukan prestasi",
      prose: [
        "MLE memilih beta yang membuat data paling mungkin. Jika satu variabel memisahkan 0 dan 1 dengan sempurna (separasi sempurna), likelihood dimaksimalkan di beta menuju tak hingga — koefisien meledak (misal beta = 18, SE = 4000).",
        "Jangan rayakan — investigasi dulu. Separasi sempurna sering gejala leakage: variabel yang bocor dari masa depan. Uji perangko waktu tiap fitur (kapan nilainya tersedia di produksi vs kapan prediksi dibuat), lalu pakai penalized logistic (Firth atau regularisasi) jika memang valid.",
        "Data default hanya 3 persen bukan alasan menyeimbangkan dulu: logistik mengestimasi probabilitas dengan benar di base rate berapapun. Yang rusak oleh imbalance adalah threshold 0,5 dan akurasi — bukan modelnya. Menyeimbangkan via sampling justru merusak kalibrasi. Atasi di level threshold dan metrik.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menyeimbangkan data 3 persen menjadi 50:50 sebelum regresi logistik. Itu merusak kalibrasi probabilitas karena base rate berubah. Imbalance bukan pelanggaran asumsi logistik.",
      },
      reference: "Beta meledak + SE raksasa = separasi. Cek leakage, lalu penalized logistic.",
    },
    {
      id: "glm-keluarga",
      eyebrow: "Langkah 5 · GLM",
      title: "Keluarga besar regresi logistik",
      prose: [
        "GLM (generalized linear model) menyatukan regresi untuk target non-normal dalam satu kerangka: distribusi + link function. Link adalah penerjemah: memetakan rata-rata target yang terbatas ke skala linear sehingga bisa dimodelkan sebagai beta0 + beta1 x.",
        "Target count (0,1,2,...): regresi Poisson dengan link log — prediksi selalu non-negatif, koefisien = pengali. Jika variansi > mean (overdispersi), pakai Negative Binomial. Contoh: frekuensi klaim asuransi.",
        "Target positif dan miring kanan (nominal rugi): regresi Gamma + link log — standar industri asuransi untuk severity. Target ordinal (rating AAA > AA > ... > D): ordered logit — menghormati urutan tanpa mengasumsikan jarak antar rating sama. Target kontinu dan kira-kira normal: OLS biasa — OLS adalah GLM dengan link identitas.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai OLS untuk target count atau biner karena lebih familiar. Bentuk target menentukan keluarga model — bukan kenyamanan analis.",
      },
      reference: "Biner -> logit. Count -> Poisson/log. Positif miring -> Gamma/log. Ordinal -> ordered logit.",
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
          q: "Model OLS dengan target 0/1 memprediksi PD = 140% untuk debitur berisiko. Akar masalah?",
          options: [
            { text: "Data kurang banyak", why: "Salah. Ini konsekuensi matematis, bukan soal ukuran data." },
            { text: "Garis lurus tidak mengenal batas [0,1] — butuh link (sigmoid) yang menjepit output jadi probabilitas valid", why: "Benar. OLS memodelkan ekspektasi sebagai garis tak terbatas.", correct: true },
            { text: "R kuadrat terlalu rendah", why: "Salah. R kuadrat tidak relevan dengan batas output." },
            { text: "Harus tambah variabel", why: "Salah. Menambah variabel tidak memberi batas pada garis." },
          ],
        },
        {
          q: "Koefisien logistik beta = 0,7 untuk variabel punya_kartu_kredit. Interpretasi tepat?",
          options: [
            { text: "Probabilitas naik 70%", why: "Salah. Beta tidak dibaca sebagai persen probabilitas." },
            { text: "Odds dikali e^0,7 = 2,01 — odds kejadian menjadi 2x lipat, variabel lain tetap", why: "Benar. Beta hidup di dunia log-odds.", correct: true },
            { text: "Probabilitas naik 2,01 poin persen", why: "Salah. Efek poin tergantung level awal." },
            { text: "Tidak ada efek karena < 1", why: "Salah. Ambang 1 tidak relevan untuk beta." },
          ],
        },
      ],
      reference: "Garis tak terbatas vs target terbatas. Beta -> odds ratio.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "OLS, logistik, atau GLM lain?",
      prose: [
        "Satu, target biner (default/tidak, fraud/bukan): regresi logistik — link logit menjamin probabilitas valid; odds ratio interpretable untuk bisnis dan regulator. Dua, target count: regresi Poisson (atau Negative Binomial jika overdispersi) — link log menjaga prediksi non-negatif.",
        "Tiga, target positif dan miring kanan: regresi Gamma + link log — menangani heteroskedastisitas alami data severity; standar industri asuransi. Empat, target ordinal (rating): ordered logit — menghormati urutan. Lima, target kontinu dan kira-kira normal: OLS biasa — tidak perlu meriam untuk membunuh lalat.",
        "Aturan 10 detik: bentuk target menentukan keluarga model. Koefisien logistik = efek ke log-odds; terjemahkan via odds ratio. Efek poin probabilitas selalu tergantung level awal — laporkan pada nilai x spesifik. Separasi sempurna = alarm: cek leakage sebelum merayakan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: link function adalah penerjemah dua dunia",
        body: "Setiap GLM adalah OLS yang belajar bahasa target: link menerjemahkan dunia target (yang terbatas, miring, atau count) ke dunia linear tempat beta bekerja. Tiga heuristik. Pertama: bila prediksimu keluar dari akal sehat — probabilitas di atas 100 persen, count negatif — bukan datanya yang salah, melainkan link-nya. Itu sinyal memilih keluarga yang salah, bukan sinyal data kotor. Kedua: koefisien selalu dibaca di dunia link (log-odds, log-count) lalu diterjemahkan — jangan baca beta mentah sebagai efek probabilitas. Beta = -1,65 bukan turun 165 persen; ia odds ratio 0,19. Ketiga: keluarga distribusi = asumsi tentang variansi. Poisson mengasumsikan variansi = mean; bila data berkata lain (overdispersi), ganti keluarga — bukan tutup mata. Aturan praktis untuk regulator: logistik + odds ratio adalah bahasa yang mereka pahami. Kecanggihan yang tidak bisa dijelaskan = kecanggihan yang ditolak — pilih keluarga yang bisa kamu pertahankan di ruang sidang validasi.",
      },
      reference: "Target menentukan keluarga. Link = penerjemah ke dunia linear.",
    },
    {
      id: "mini-case-scorecard",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Scorecard PD: jebakan skala",
      prose: [
        "Bank membangun scorecard KTA. Model logistik final: logit(p) = -2,1 - 0,04 x skor + 1,1 x tunggakan_12m + 0,5 x utilisasi_tinggi. Skor 300-850; tunggakan 0/1; utilisasi_tinggi 0/1. Validasi: AUC 0,78, kalibrasi baik. Nasabah A: skor 650, tanpa tunggakan, utilisasi rendah.",
        "Hitung mentah: logit = -2,1 - 0,04 x 650 = -28,1 -> p = 0 persen?? Tunggu — ini tidak masuk akal. Jebakan: skor mentah 300-850 tidak mungkin dipakai langsung dengan koefisien -0,04 tanpa scaling. Model mengasumsikan variabel sudah di-WoE/standar. Jika 650 = +0,5 SD: logit = -2,1 - 0,04 x 0,5 = -2,12 -> PD = 10,7 persen. Pelajaran: jangan hitung tanpa tahu skala variabel.",
        "Nasabah B: sama tapi punya tunggakan. OR tunggakan = e^1,1 = 3,0. Odds A = 0,107/0,893 = 0,120; odds B = 0,120 x 3,0 = 0,36; PD B = 0,36/1,36 = 26,5 persen. Satu tunggakan melipatgandakan odds 3x — dari 10,7 ke 26,5 persen. Tim bisnis usul buang koefisien skor karena kecil (-0,04): tolak. Kecil tidak bermakna tanpa satuan — per 100 poin = -4,0 di logit, OR = e^-4 = 0,018, efek raksasa. Inilah mengapa standarisasi penting untuk menilai besar koefisien.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menghitung PD tanpa tahu skala variabel menghasilkan angka sampah yang terlihat presisi. Scorecard yang salah skala = keputusan kredit yang salah skala.",
      },
      reference: "Selalu tanya skala variabel sebelum membaca koefisien. Kecil belum tentu tidak penting.",
    },
    {
      id: "pendalaman-deviance-overdispersi",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Deviance, overdispersi & offset: GLM level senior",
      prose: [
        "GLM punya padanan SSE: deviance, D = 2 x (l_sat − l_model) — seberapa jauh modelmu dari model jenuh (satu parameter per observasi, fit sempurna). Deviance untuk membandingkan model bersarang: tambah 1 parameter, deviance turun 50 = perbaikan nyata (uji chi-square); turun 2 = noise. Dan AIC = D + 2p memungkinkan bandingkan model yang TIDAK bersarang — dua keluarga berbeda pun bisa diadu secara adil.",
        "Overdispersi adalah pembunuh diam-diam model count. Poisson mengasumsikan variansi = mean. Data klaim nyata: variansi 3x mean — maka SE Poisson kekecilan ~1,7x dan signifikansi palsu bermunculan. Deteksi: rasio deviance/df jauh di atas 1. Obat: quasi-Poisson (mengoreksi SE dengan faktor dispersi — cepat, cukup untuk inferensi) atau Negative Binomial (memodelkan variansi berlebih eksplisit — lebih baik untuk prediksi). Aturan: SELALU cek rasio deviance/df di model count sebelum percaya satu bintang signifikansi pun.",
        "Offset: untuk rate (klaim per polis-tahun), masukkan log(exposure) sebagai offset — prediktor dengan koefisien dipaksa = 1. Tanpa offset, polis berumur 1 bulan disamakan dengan polis 12 bulan — bias sistematis yang tidak tertangkap diagnostik biasa karena ia kesalahan spesifikasi, bukan kesalahan fit.",
        "Link alternatif untuk biner: probit dan cloglog. Hasilnya mirip logit di tengah distribusi, berbeda di ekor — cloglog asimetris, cocok untuk data ketahanan diskrit (survival). Pilih logit bila butuh odds ratio yang interpretable untuk bisnis dan regulator; pilih cloglog bila prosesnya memang asimetris. Jangan gonta-ganti link untuk memoles hasil — itu p-hacking berkedok metodologi.",
      ],
      formula: String.raw`D = 2\left(\ell_{\text{sat}} - \ell_{\text{model}}\right), \qquad \text{AIC} = D + 2p`,
      formulaNote: "D = deviance; l_sat = log-likelihood model jenuh (satu parameter per observasi, fit sempurna); l_model = log-likelihood modelmu; p = jumlah parameter. AIC = deviance + penalti kompleksitas 2p — untuk membandingkan model tak bersarang, termasuk beda keluarga.",
      tasks: [],
      reference: "Deviance = SSE-nya GLM. Overdispersi: cek deviance/df. Rate: pakai offset. Link: logit untuk interpretasi.",
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
        "Target biner butuh link logit + sigmoid — garis lurus bocor keluar [0,1].",
        "Koefisien logistik = efek ke log-odds; terjemahkan via odds ratio (e^beta).",
        "Odds ratio konstan; efek dalam poin probabilitas tergantung level awal.",
        "Separasi sempurna (beta meledak) = alarm leakage, bukan prestasi.",
        "GLM: bentuk target menentukan keluarga — Poisson untuk count, Gamma untuk severity, ordered logit untuk rating.",
      ],
      next: { label: "A3.5 — Metrik Klasifikasi", href: "/v2/learn/a35-metrik-klasifikasi" },
      quiz: [
        {
          q: "Koefisien MLE meledak (beta = 18, SE = 4000). Diagnosis paling mungkin?",
          options: [
            { text: "Multikolinearitas biasa", why: "Salah. Itu menggembungkan SE tapi tidak meledakkan beta ke 18." },
            { text: "Separasi sempurna — cek leakage, lalu pakai penalized logistic", why: "Benar. Likelihood dimaksimalkan di beta menuju tak hingga.", correct: true },
            { text: "Sampel terlalu besar", why: "Salah. Sampel besar justru menstabilkan." },
            { text: "Learning rate terlalu kecil", why: "Salah. Ini soal data, bukan optimizer." },
          ],
        },
        {
          q: "Target = jumlah klaim per polis per tahun (0,1,2,...). Model GLM yang tepat?",
          options: [
            { text: "OLS biasa", why: "Salah. Prediksi bisa negatif; count butuh link log." },
            { text: "Regresi logistik", why: "Salah. Itu untuk target biner." },
            { text: "Regresi Poisson (link log) — jika variansi > mean pakai Negative Binomial", why: "Benar. Prediksi non-negatif, koefisien = pengali.", correct: true },
            { text: "Regresi Gamma", why: "Salah. Gamma untuk kontinu positif yang miring, bukan count." },
          ],
        },
        {
          q: "Data default hanya 3%, jadi regresi logistik tidak valid dan harus diseimbangkan dulu. Tanggapan?",
          options: [
            { text: "Setuju — logistik butuh 50:50", why: "Salah. Tidak ada asumsi seperti itu." },
            { text: "Tidak setuju — logistik valid di base rate berapapun; yang rusak adalah threshold 0,5 dan akurasi", why: "Benar. Menyeimbangkan justru merusak kalibrasi.", correct: true },
            { text: "Setuju — tapi cukup undersample mayoritas", why: "Salah. Sampling mengubah base rate dan merusak kalibrasi." },
            { text: "Tidak setuju — pakai OLS saja", why: "Salah. OLS untuk biner bocor keluar [0,1]." },
          ],
        },
        {
          q: "Dalam GLM, apa peran link function?",
          options: [
            { text: "Menghubungkan dua variabel prediktor", why: "Salah. Bukan itu perannya." },
            { text: "Penerjemah: memetakan rata-rata target yang terbatas ke skala linear sehingga bisa dimodelkan sebagai beta0+beta1x", why: "Benar. Jembatan antara dunia target dan dunia linear.", correct: true },
            { text: "Menghitung R kuadrat", why: "Salah. Tidak ada hubungan." },
            { text: "Memilih distribusi error", why: "Salah. Itu peran komponen distribusi, bukan link." },
          ],
        },
        {
          q: "Model Poisson untuk klaim: deviance/df = 4,2. Apa artinya dan apa obatnya?",
          options: [
            { text: "Model sempurna — deviance besar = bagus", why: "Salah. Arahnya terbalik." },
            { text: "Overdispersi: variansi jauh di atas mean → SE kekecilan, signifikansi palsu. Obat: quasi-Poisson atau Negative Binomial", why: "Benar. Selalu cek rasio ini sebelum percaya bintang signifikansi.", correct: true },
            { text: "Underdispersi — tidak masalah", why: "Salah. 4,2 = overdispersi, bukan under." },
            { text: "Tambah variabel sampai deviance/df = 1", why: "Salah. Menambah variabel buta bukan obat dispersi." },
          ],
        },
        {
          q: "Memodelkan jumlah klaim per polis dengan masa pertanggungan 1-12 bulan yang bervariasi. Yang wajib dipakai?",
          options: [
            { text: "Tidak perlu penyesuaian — model menanganinya", why: "Salah. Exposure beda = rate beda." },
            { text: "Offset log(exposure): polis 1 bulan tidak boleh disamakan dengan 12 bulan. Koefisien offset dipaksa = 1", why: "Benar. Tanpa offset = bias sistematis kesalahan spesifikasi.", correct: true },
            { text: "Bagi target dengan exposure manual lalu OLS", why: "Salah. Itu merusak struktur count dan heteroskedastisitasnya." },
            { text: "Buang polis berekposure pendek", why: "Salah. Membuang data = membuang informasi." },
          ],
        },
        {
          q: "Deviance turun 3 setelah menambah 2 parameter. Kesimpulan?",
          options: [
            { text: "Perbaikan besar — pertahankan", why: "Salah. 3 untuk 2 parameter = noise." },
            { text: "Tidak material (chi-square: 3 dengan df=2 tidak signifikan). Model sederhana menang — pakai AIC untuk konfirmasi", why: "Benar. Deviance turun sedikit dengan harga kompleksitas = tidak worth it.", correct: true },
            { text: "Deviance tidak bisa dipakai untuk ini", why: "Salah. Justru itu fungsi utamanya untuk model bersarang." },
            { text: "Tambah 2 parameter lagi", why: "Salah. Menambah kompleksitas tanpa sinyal = overfit." },
          ],
        },
      ],
    },
  ],
};

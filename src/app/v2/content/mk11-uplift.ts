import type { V2Lesson } from "../lib/types";

export const mk11: V2Lesson = {
  slug: "mk11-uplift",
  track: "Marketing Analytics",
  module: "Uplift Modeling",
  title: "MK11 — Uplift Modeling",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-telkonusa",
      eyebrow: "Langkah 1 · Cerita TelkoNusa",
      title: "Diskon yang malah menaikkan churn",
      prose: [
        "TelkoNusa memberi diskon ke 10.000 pelanggan \u201Cberisiko churn\u201D. Hasilnya: churn naik. Kok bisa? Di antara mereka ada sleeping dogs — pelanggan yang tidak akan pergi, tapi tersinggung/diingatkan untuk pergi karena ditawari diskon \u201Cretensi\u201D.",
        "Targeting by risiko (MK6) menjawab \u201Csiapa mau pergi\u201D. Uplift menjawab \u201Csiapa yang pergi-nya berubah karena aksiku\u201D. Beda pertanyaan, beda target, beda hasil.",
        "Setelah beralih ke uplift: hanya 3.000 persuadables yang ditarget, net +Rp450jt. Lebih sedikit aksi, hasil jauh lebih baik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Kampanye retensi buta bisa merugikan: membangunkan sleeping dogs = menciptakan churn yang sebelumnya tidak ada. Setiap kampanye berbiaya harus lolos saring uplift.",
        type: "risk",
      },
      reference: "Risiko ≠ respons. Target persuadable, bukan sekadar berisiko.",
    },
    {
      id: "empat-kuadran",
      eyebrow: "Langkah 2 · Empat kuadran",
      title: "τ(x): efek kausal per individu",
      prose: [
        "Uplift τ(x) = P(Y|T=1,X) − P(Y|T=0,X): selisih probabilitas outcome jika diberi treatment vs tidak. Empat kuadran: sure things (convert anyway, τ≈0), persuadables (τ>0 besar), lost causes (τ≈0, tidak tertolong), sleeping dogs (τ<0 — treatment merugikan).",
        "Worked example 8 pelanggan (margin Rp2jt, biaya Rp50rb): Ani +0,55 dan Eka +0,50 = persuadables → target. Bimo +0,02 = sure thing → jangan buang uang. Dedi −0,20 dan Hadi −0,25 = sleeping dogs → jangan sentuh! Gita/Jono ≈ 0 = lost causes → diam.",
        "Kebijakan: target jika τ×m − c > 0. Bimo: 0,02×2jt − 50rb = −Rp10rb → tidak. Matematika kecil ini mencegah dua kesalahan: mensubsidi sure things dan membangunkan dogs.",
      ],
      formula: String.raw`\tau(x) = P(Y \mid T=1, X) - P(Y \mid T=0, X)`,
      formulaNote: "tau(x) = uplift (efek kausal) untuk individu berfitur x: P(Y|T=1,X) = probabilitas outcome jika DIBERI treatment; P(Y|T=0,X) = probabilitas outcome jika TIDAK diberi. Selisihnya = seberapa besar treatment mengubah nasib individu itu. Target hanya jika tau(x) x margin - biaya > 0.",
      tasks: [],
      reference: "Target ⟺ τ×m − c > 0. Empat kuadran menentukan aksi.",
    },
    {
      id: "model-evaluasi",
      eyebrow: "Langkah 3 · Model & evaluasi",
      title: "Two-model, causal forest, Qini",
      prose: [
        "Two-model: latih satu model di grup treatment, satu di kontrol; uplift = selisih prediksinya. Sederhana, tapi dua error model menumpuk. Causal forest: langsung mengestimasi efek heterogen per individu — lebih tepat untuk τ(x).",
        "Evaluasi: JANGAN pakai AUC — AUC mengukur ranking outcome, bukan ranking efek. Pakai Qini / AUUC (area under uplift curve): urutkan by τ prediksi, ukur gain inkremental kumulatif. Model bagus = kurva menanjak curam di awal.",
        "Validasi butuh data eksperimen (treatment vs kontrol acak). Uplift dari data observasional tanpa eksperimen = propensity berkedok kausal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengevaluasi model uplift dengan AUC. AUC tinggi bisa berarti model jago menemukan sure things — yang justru tidak boleh ditarget. Qini/AUUC satu-satunya metrik yang jujur.",
        type: "pitfall",
      },
      reference: "Evaluasi uplift = Qini/AUUC. Butuh data eksperimen.",
    },
    {
      id: "kebijakan-lab",
      eyebrow: "Langkah 4 · Kebijakan & lab",
      title: "Dari skor ke daftar target",
      prose: [
        "Skor τ hanyalah angka — keputusan adalah kebijakan: siapa dihubungi, dengan aksi apa, dan berapa expected net value-nya. Net per pelanggan = τ×m − c; total net = jumlah yang positif saja.",
        "Kasus TelkoNusa: 3.000 persuadables × net positif = +Rp450jt. Bandingkan \u201Cblast ke semua 10.000\u201D: biaya membengkak, sure things tersubsidi sia-sia, dogs terbangun — net ≈ 0 atau negatif.",
        "Di lab ini kamu menerapkan kebijakan τ×m−c>0 ke 4 pelanggan dan menghitung total net. Inilah \u201Cmodel menjadi keputusan\u201D.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `net` tiap pelanggan = tau × margin − biaya" },
        { id: "t2", text: "Hitung `total_net` = jumlah net yang positif saja, cetak" },
      ],
      expected: "total_net=2000000",
      hints: [
        "net_i = tau * margin - biaya.",
        "Ani: 0,55 × 2.000.000 − 50.000 = 1.050.000.",
        "Dedi: −0,20 × 2.000.000 − 50.000 = −450.000 → tidak ikut total.",
      ],
      code: {
        starter: `# (nama, tau, margin, biaya)\ndata = [("Ani", 0.55, 2000000, 50000),\n        ("Eka", 0.50, 2000000, 50000),\n        ("Dedi", -0.20, 2000000, 50000),\n        ("Hadi", -0.25, 2000000, 50000)]\n\n# TULIS KODEMU: net per pelanggan, lalu total net yang positif\ntotal_net = 0\nfor nama, tau, margin, biaya in data:\n    net =\n    if net > 0:\n        total_net += net\n\nprint(f"total_net={total_net:.0f}")`,
        lockLines: 5,
        solution: `# (nama, tau, margin, biaya)\ndata = [("Ani", 0.55, 2000000, 50000),\n        ("Eka", 0.50, 2000000, 50000),\n        ("Dedi", -0.20, 2000000, 50000),\n        ("Hadi", -0.25, 2000000, 50000)]\n\n# TULIS KODEMU: net per pelanggan, lalu total net yang positif\ntotal_net = 0\nfor nama, tau, margin, biaya in data:\n    net = tau * margin - biaya\n    if net > 0:\n        total_net += net\n\nprint(f"total_net={total_net:.0f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "total_net", value: 2000000, tol: 1, label: "`total_net` seharusnya 2000000", msg: "1.050.000 (Ani) + 950.000 (Eka). Dedi & Hadi negatif → tidak ditarget." },
          { kind: "stdout_matches", task: "t2", pattern: "total_net=2000000", label: "`print` menampilkan total_net", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kebijakan: target ⟺ net > 0. Total = jumlah yang positif.",
    },
    {
      id: "vs-propensity",
      eyebrow: "Langkah 5 · Peta konsep",
      title: "Churn vs propensity vs uplift",
      prose: [
        "Tiga model, tiga pertanyaan: churn (MK6) = siapa mau pergi? propensity (MK7) = siapa akan convert? uplift (MK11) = siapa yang berubah karena aksiku?",
        "Hubungan biayanya: kampanye by churn boros di sure things; by propensity boros di yang convert anyway; by uplift tepat sasaran tapi butuh data eksperimen (lebih mahal dibangun).",
        "Aturan praktis: aksi murah (email) → propensity cukup. Aksi mahal (telepon, diskon besar) → wajib uplift. Makin mahal aksinya, makin kausal model yang dibutuhkan.",
      ],
      tasks: [],
      reference: "Aksi murah: propensity. Aksi mahal: uplift.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Pelanggan τ = −0,20. Aksi?",
          options: [
            { text: "Jangan sentuh — sleeping dog", why: "Treatment menurunkannya. Menghubungi = menciptakan churn.", correct: true },
            { text: "Beri diskon lebih besar", why: "Memperbesar treatment yang merugikan = memperbesar kerugian." },
            { text: "Telepon untuk meyakinkan", why: "τ negatif bilang kontak justru mendorong pergi." },
          ],
        },
        {
          q: "τ = +0,02, margin Rp2jt, biaya Rp50rb. Target?",
          options: [
            { text: "Tidak — net = −Rp10rb (sure thing, buang uang)", why: "0,02×2jt−50rb < 0. Convert anyway, jangan subsidi.", correct: true },
            { text: "Ya — τ positif", why: "Positif saja tidak cukup; harus menutup biaya." },
            { text: "Ya — setiap uplift berharga", why: "Uplift berharga hanya jika net > 0." },
          ],
        },
        {
          q: "Kenapa AUC salah untuk evaluasi uplift?",
          options: [
            { text: "AUC mengukur ranking outcome, bukan ranking efek kausal", why: "AUC tinggi = jago temukan sure things — yang tidak boleh ditarget.", correct: true },
            { text: "AUC terlalu sulit dihitung", why: "Bukan soal sulit — soal mengukur hal yang salah." },
            { text: "AUC selalu rendah untuk uplift", why: "Tidak selalu; masalahnya relevansi, bukan nilainya." },
          ],
        },
      ],
    },
    {
      id: "adv-response-vs-uplift",
      eyebrow: "Langkah 7 · Uplift vs response",
      title: "Ranking outcome vs ranking efek: jebakan response modeling",
      prose: [
        "Response modeling meranking by P(Y|X) — siapa yang paling mungkin convert. Uplift meranking by tau(x) — siapa yang paling berubah karena treatment. Keduanya 'benar', tetapi untuk target yang berbeda: response mengutamakan sure things (convert anyway, tau≈0), uplift mengutamakan persuadables.",
        "Worked: 1.000 pelanggan, budget 100 panggilan (Rp50rb/panggilan, margin Rp2jt). Top-100 by response: 80 sure things (tau 0,02) + 20 persuadables (tau 0,5) → net = (80×0,02 + 20×0,5) × 2jt − 100×50rb = Rp18,2jt. Top-100 by uplift: 90 persuadables (tau 0,5) + 10 sure things → net = (90×0,5 + 10×0,02) × 2jt − 5jt = Rp85,4jt. Model yang sama-sama 'akurat', net berbeda 4,7x lipat.",
        "Pelajaran: untuk aksi mahal, response modeling bukan versi murah dari uplift — ia adalah jawaban untuk pertanyaan yang salah. Mengurutkan by probabilitas convert saat yang dibutuhkan adalah efek kausal = presisi mengoptimasi hal yang keliru.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Top-100 by response net Rp18,2jt; top-100 by uplift net Rp85,4jt. Kesimpulan?",
          options: [
            { text: "Untuk aksi mahal, ranking by efek (uplift) mengalahkan ranking by outcome 4,7x", why: "Response memprioritaskan sure things yang convert tanpa aksi — mensubsidi yang gratis.", correct: true },
            { text: "Response modeling tidak berguna", why: "Berguna untuk aksi murah (email) — hanya salah untuk aksi mahal." },
            { text: "Uplift selalu menang 4,7x", why: "Angka spesifik kasus ini; keunggulannya tergantung komposisi kuadran." },
            { text: "Keduanya sama — beda metodologi saja", why: "Net berbeda nyata; metodologi menentukan siapa yang ditarget." },
          ],
        },
        {
          q: "Kapan response modeling BOLEH dipakai untuk targeting?",
          options: [
            { text: "Aksi murah (email Rp2rb) — biaya salah target kecil", why: "Aturan praktis lesson ini: murah → propensity/response cukup; mahal → wajib uplift.", correct: true },
            { text: "Tidak pernah", why: "Berlebihan; untuk aksi murah ia efisien dan cukup." },
            { text: "Selalu — lebih sederhana", why: "Untuk aksi Rp500rb, 'sederhana' = mahal karena salah target." },
            { text: "Hanya jika AUC > 0,9", why: "AUC tinggi ≠ menjawab pertanyaan kausal." },
          ],
        },
      ],
      reference: "Response = ranking outcome (sure things). Uplift = ranking efek (persuadables).",
    },
    {
      id: "lab-qini",
      eyebrow: "Langkah 8 · Lab Qini",
      title: "Lab: membaca kurva Qini dan memilih kedalaman target",
      prose: [
        "Qini curve = gain inkremental kumulatif saat kamu menarget dari ranking teratas ke bawah. Di lab ini gain per desil (ribu Rp, sudah urut by tau) diberikan — tugasmu menemukan kedalaman optimal: berhenti menarget saat desil berikutnya merusak total.",
        "Coba: ubah gain desil ke-5 dari −20 menjadi +30. Bagaimana kedalaman optimal berubah? (Menjadi 5 — dan inilah kenapa Qini dibaca sebagai kurva, bukan satu angka.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kum` = gain kumulatif per desil" },
        { id: "t2", text: "Tentukan `opt_depth` dan `opt_gain`, cetak" },
      ],
      expected: "opt_depth=4 opt_gain=250",
      hints: [
        "Loop: s += g; kum.append(s).",
        "opt_gain = max(kum); opt_depth = kum.index(opt_gain) + 1.",
        "Kumulatif: 120, 200, 240, 250, 230, ... — puncak di desil 4.",
      ],
      code: {
        starter: `# gain inkremental per desil (ribu Rp), sudah urut by tau prediksi
gain = [120, 80, 40, 10, -20, -30, -10, 0, 5, -5]

# TULIS KODEMU: kumulatif, kedalaman optimal, gain optimal
kum =
opt_depth =
opt_gain =

print(f"opt_depth={opt_depth} opt_gain={opt_gain"}`,
        lockLines: 2,
        solution: `# gain inkremental per desil (ribu Rp), sudah urut by tau prediksi
gain = [120, 80, 40, 10, -20, -30, -10, 0, 5, -5]

# TULIS KODEMU: kumulatif, kedalaman optimal, gain optimal
kum = []
s = 0
for g in gain:
    s += g
    kum.append(s)
opt_gain = max(kum)
opt_depth = kum.index(opt_gain) + 1

print(f"opt_depth={opt_depth} opt_gain={opt_gain"}`,
        checks: [
          { kind: "equal", task: "t2", name: "opt_depth", value: 4, tol: 1e-9, label: "`opt_depth` seharusnya 4", msg: "Kumulatif puncak 250 di desil 4; desil 5 (−20) mulai merusak." },
          { kind: "equal", task: "t2", name: "opt_gain", value: 250, tol: 1e-9, label: "`opt_gain` seharusnya 250", msg: "120+80+40+10 = 250 ribu Rp." },
          { kind: "stdout_matches", task: "t2", pattern: "opt_depth=4", label: "`print` menampilkan opt_depth", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Target sampai puncak Qini; desil setelahnya merusak total.",
    },
    {
      id: "intuisi-berubah",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Berhenti bertanya 'siapa yang akan membeli'",
      prose: [
        "Seluruh lesson ini adalah satu pergeseran pertanyaan — dan tiga heuristik menjaganya tetap bergeser ke arah yang benar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: jangan tanya siapa yang akan membeli — tanya siapa yang berubah karena kamu datang",
        body: "Heuristik pertama: setiap daftar target adalah klaim kausal yang menyamar. '10.000 pelanggan berisiko' terdengar seperti analisis, tetapi ia diam-diam mengklaim 'menghubungi mereka mengubah sesuatu'. Uplift memaksa klaim itu terbuka: tau(x) × margin − biaya > 0 atau tidak. Jika tidak bisa menuliskan ketidaksamaan ini untuk targetmu, kamu tidak punya target — kamu punya daftar nama. Heuristik kedua: takutlah pada kuadran yang salah, bukan pada model yang salah. Sure things membuang uang (subsidi yang gratis), sleeping dogs menciptakan masalah (membangunkan yang tidur), lost causes membuang waktu. Tiga kuadran ini merugikan dengan cara yang berbeda, dan semuanya lolos dari saringan 'risiko tinggi' atau 'propensity tinggi'. Satu-satunya saringan yang menangkap ketiganya sekaligus adalah tau(x). Heuristik ketiga: harga aksi menentukan harga model. Email Rp2rb tidak butuh model kausal — salah target murah. Telepon Rp50rb dan diskon Rp500rb butuh uplift — salah target mahal. Ini bukan soal kecanggihan; ini soal ekonomi kesalahan. Dan satu pengingat terakhir: uplift tanpa data eksperimen = propensity berkedok kausal. Jika tidak ada randomisasi treatment vs kontrol, tau(x) yang kamu hitung hanyalah korelasi yang berdasi — rapi, meyakinkan, dan salah.",
      },
      reference: "Target = klaim kausal; saring by tau; harga aksi = harga model.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: kirim penawaran hanya ke yang berubah karenanya",
      prose: [
        "Skenario satu — memilih target kampanye: pakai skor uplift (tau), bukan skor response. Model R (AUC 0,85) mengisi top-1.000 dengan sure things (tau 0,01) — diskon untuk mereka adalah bakar margin.",
        "Skenario dua — empat kuadran: persuadables diberi treatment; sure things jangan diganggu; lost causes jangan dibuang-buang; sleeping dogs jangan disentuh — treatment malah memicu churn.",
        "Skenario tiga — evaluasi model: pakai Qini atau AUUC, bukan AUC. AUC mengukur 'siapa membeli'; yang dibutuhkan adalah 'siapa berubah karena treatment'.",
        "Skenario empat — biaya treatment tinggi (diskon Rp200rb): naikkan ambang tau. Treatment mahal hanya untuk persuadable kuat; yang ragu-ragu dapat treatment murah seperti email, bukan diskon.",
        "Skenario lima — tidak ada data eksperimen: jangan paksa uplift modeling dari data observasional murni tanpa desain. Kumpulkan RCT kecil dulu — uplift tanpa randomisasi adalah tebakan berbiaya.",
        "Aturan praktis 10 detik: target = persuadables? Evaluasi = Qini, bukan AUC? Sleeping dogs dikecualikan? Ambang tau sesuai biaya treatment?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menargetkan 'yang paling mungkin membeli'. Sure things membeli tanpa diskon — memberi mereka diskon Rp200rb × 700 orang = Rp140jt hadiah untuk perilaku yang sudah terjadi. Uplift bertanya 'siapa berubah', bukan 'siapa membeli'.",
      },
      reference: "Skor uplift (tau) → empat kuadran → Qini → ambang sesuai biaya.",
    },
    {
      id: "minicase-dua-model",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Dua model, satu budget: response vs uplift diadili",
      prose: [
        "TelkoNusa menguji dua model untuk kampanye diskon Rp200rb (margin per retensi Rp3jt, 5.000 kandidat). Model R (response, AUC 0,85): top-1.000 berisi 700 sure things (tau 0,01), 200 persuadables (tau 0,4), 100 lost causes (tau 0). Model U (uplift, AUUC 2x): top-1.000 berisi 800 persuadables (tau 0,4), 150 sure things (tau 0,01), 50 lost causes.",
        "Net R = (700×0,01 + 200×0,4) × 3jt − 1.000×200rb = Rp261jt − Rp200jt = Rp61jt. Net U = (800×0,4 + 150×0,01) × 3jt − Rp200jt = Rp964,5jt − Rp200jt = Rp764,5jt. Model dengan AUC 'hebat' menghasilkan 12,5x lebih kecil.",
        "Pertanyaan: (1) Mengapa AUC 0,85 kalah telak? (2) Metrik apa yang seharusnya dipakai memilih model? (3) Kapan model R boleh dipakai?",
        "Pembahasan: (1) AUC mengukur ranking outcome — ia hebat menemukan sure things, yang justru tidak boleh ditarget. (2) Qini/AUUC: mengukur ranking efek kausal — satu-satunya metrik yang selaras dengan net. (3) Model R boleh untuk aksi murah (email) di mana biaya salah target kecil — bukan untuk diskon Rp200rb.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Model R (AUC 0,85) net Rp61jt; model U (AUUC 2x) net Rp764,5jt. Pelajaran?",
          options: [
            { text: "Metrik evaluasi harus selaras dengan keputusan — Qini/AUUC, bukan AUC", why: "AUC mengoptimasi ranking yang salah untuk targeting aksi mahal.", correct: true },
            { text: "AUC tidak berguna", why: "Berguna untuk prediksi outcome; hanya salah untuk evaluasi uplift." },
            { text: "Model U overfit", why: "Net dihitung dari tau aktual, bukan prediksi — bukan overfit." },
            { text: "Naikkan budget model R 12,5x", why: "Mengalikan target yang salah = mengalikan kerugian." },
          ],
        },
        {
          q: "Kapan model response (AUC tinggi) BOLEH dipakai untuk targeting?",
          options: [
            { text: "Aksi murah — biaya salah target kecil", why: "Ekonomi kesalahan: email Rp2rb tidak butuh presisi kausal.", correct: true },
            { text: "Tidak pernah", why: "Berlebihan; konteks aksi menentukan." },
            { text: "Selalu — AUC 0,85 sudah hebat", why: "Hebat untuk outcome, menyesatkan untuk efek." },
            { text: "Jika tidak ada data eksperimen", why: "Tanpa eksperimen, uplift pun tidak valid — bukan alasan memakai response untuk aksi mahal." },
          ],
        },
      ],
      reference: "Pilih model by metrik yang selaras dengan net: Qini/AUUC.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Uplift = disiplin kausal untuk setiap rupiah retensi.",
      ],
      tasks: [],
      summary: [
        "τ(x) = P(Y|T=1,X) − P(Y|T=0,X); empat kuadran menentukan aksi.",
        "Kebijakan: target ⟺ τ×m − c > 0; TelkoNusa net +Rp450jt dari 3.000 persuadables.",
        "Two-model vs causal forest; evaluasi dengan Qini/AUUC, bukan AUC.",
        "Butuh data eksperimen; observasional saja tidak cukup.",
        "Response ranking mengutamakan sure things; untuk aksi mahal pakai ranking efek (uplift).",
        "Baca Qini sebagai kurva: target sampai puncak; AUUC untuk bandingkan model.",
        "Aksi murah → propensity; aksi mahal → uplift.",
      ],
      next: { label: "MK12 — Atribusi", href: "/learn/mk12-attribution" },
      quiz: [
        {
          q: "Bedanya sure things dan persuadables?",
          options: [
            { text: "Sure things convert tanpa aksi (τ≈0); persuadables butuh aksi (τ>0)", why: "Mensubsidi sure things = buang uang; menarget persuadables = ROI.", correct: true },
            { text: "Sure things lebih berisiko churn", why: "Risiko ≠ kuadran uplift. Sure things soal respons, bukan risiko." },
            { text: "Tidak ada bedanya", why: "Bedanya = seluruh nilai uplift modeling." },
          ],
        },
        {
          q: "Model uplift dilatih dari data kampanye lama (tanpa randomisasi). Masalah?",
          options: [
            { text: "Bias seleksi — yang di-treatment dulu memang beda; τ terkontaminasi", why: "Uplift butuh eksperimen. Observasional = propensity berkedok kausal.", correct: true },
            { text: "Tidak masalah, data besar", why: "Data besar tidak memperbaiki bias seleksi." },
            { text: "Model jadi lebih akurat", why: "Terbalik: ia percaya diri pada estimasi yang bias." },
          ],
        },
        {
          q: "Qini curve menanjak curam di awal lalu datar. Artinya?",
          options: [
            { text: "Model bagus — sebagian kecil teratas menangkap sebagian besar gain", why: "Itulah tujuan: konsentrasi persuadables di ranking teratas.", correct: true },
            { text: "Model buruk", why: "Terbalik: garis diagonal = acak = buruk." },
            { text: "Data terlalu sedikit", why: "Bentuk kurva soal ranking, bukan ukuran data." },
          ],
        },
        {
          q: "Kampanye email murah (Rp2rb) vs kunjungan sales (Rp500rb). Model untuk masing-masing?",
          options: [
            { text: "Email: propensity cukup. Sales: wajib uplift", why: "Makin mahal aksi, makin kausal model yang dibutuhkan.", correct: true },
            { text: "Keduanya uplift", why: "Overkill untuk email — biaya model > nilai presisinya." },
            { text: "Keduanya propensity", why: "Untuk sales Rp500rb, salah target mahal — butuh kausal." },
          ],
        },
        {
          q: "Setelah uplift, kampanye retensi TelkoNusa menarget 3.000 dari 10.000. Kenapa hasilnya lebih baik?",
          options: [
            { text: "Menghindari subsidi sure things + membangunkan dogs; fokus ke persuadables", why: "Net +Rp450jt vs ≈0. Presisi mengalahkan volume.", correct: true },
            { text: "Diskonnya lebih besar", why: "Bukan soal besaran — soal siapa yang menerima." },
            { text: "Kebetulan", why: "Mekanismenya jelas: τ×m−c>0 menyaring target." },
          ],
        },
      ],
    },
  ],
};

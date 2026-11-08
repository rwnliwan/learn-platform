import type { V2Lesson } from "../lib/types";

export const a212: V2Lesson = {
  slug: "a212-bayesian",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.12 Memperbarui Keyakinan dengan Data: Bayesian Dasar",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-tes",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Tes positif, tapi sehat?",
      prose: [
        "Sebuah tes kanker memiliki sensitivitas 99% dan spesifisitas 99%. Kamu tes — hasilnya positif. Berapa peluang kamu benar-benar sakit? Insting kebanyakan orang (termasuk banyak dokter): 99%, kan tesnya 99% akurat. Salah besar.",
        "Jika hanya 1 dari 10.000 orang yang sakit: dari 10.000 orang, 1 penderita terdeteksi, tapi ~100 orang sehat juga positif palsu (1% × 9.999). Dari 101 yang positif, hanya 1 yang sakit — peluangmu sakit ≈ 1%, bukan 99%! Tes yang 99% akurat memberi jawaban yang 99% salah — karena seberapa umum penyakitnya (prior!) sama pentingnya dengan akurasi tes.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `posterior` = P(sakit|positif) dengan Bayes (4 desimal)" },
        { id: "t2", text: "Hitung `pct` = posterior dalam persen (2 desimal)" },
      ],
      expected: "posterior=0.0098  pct=0.98",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kegagalan menggabungkan base rate dengan bukti disebut base-rate fallacy. Dalam fraud detection: sistem dengan 99% akurasi pada kejadian langka tetap menghasilkan mayoritas false positive — triase harus memperhitungkan base rate, bukan akurasi mentah.",
      },
      hints: [
        "P(D) = 0,99×0,0001 + 0,01×0,9999.",
        "Posterior = (0,99 × 0,0001) / P(D).",
        "posterior = 0.99*0.0001/(0.99*0.0001+0.01*0.9999)",
      ],
      code: {
        starter: `# TULIS KODEMU\nposterior = \npct = \n\nprint(f"posterior={posterior}  pct={pct}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU\nposterior = round(0.99*0.0001/(0.99*0.0001+0.01*0.9999), 4)\npct = round(posterior*100, 2)\n\nprint(f"posterior={posterior}  pct={pct}")`,
        checks: [
          { kind: "equal", task: "t1", name: "posterior", value: 0.0098, tol: 0.0001, label: "`posterior` seharusnya 0.0098", msg: "(0,99 × 0,0001)/0,0101 ≈ 0,0098." },
          { kind: "equal", task: "t2", name: "pct", value: 0.98, tol: 0.01, label: "`pct` seharusnya 0.98", msg: "0,0098 × 100% = 0,98% — bukan 99%!" },
          { kind: "stdout_matches", task: "t2", pattern: "posterior=0\\.0098\\s+pct=0\\.98", label: "`print` menampilkan keduanya", msg: "Format: posterior=...  pct=... ." },
        ],
      },
      reference: "Base rate (prior) bisa mendominasi bukti yang kuat.",
    },
    {
      id: "teorema-bayes",
      eyebrow: "Langkah 2 · Teorema Bayes",
      title: "Mesin pembaruan keyakinan",
      prose: [
        "Tiga pemain: prior P(H) — keyakinan sebelum data (base rate, pengetahuan domain); likelihood P(D|H) — jika hipotesis benar, seberapa mungkin data ini?; posterior P(H|D) — keyakinan setelah melihat data. Ditambah evidence P(D): konstanta normalisasi. Versi bahasa: keyakinan baru ∝ kecocokan bukti × keyakinan lama.",
        "Kepribadiannya: si akuntan keyakinan yang disiplin — memaksa setiap firasat ditulis sebagai angka (prior), setiap bukti dinilai kecocokannya (likelihood), dan mengharamkan lupa base rate. Frequentist bertanya seberapa aneh data ini andaikan H0 benar; Bayesian bertanya seberapa yakin saya pada tiap hipotesis setelah melihat data — pertanyaan yang sebenarnya ingin dijawab manusia.",
      ],
      formula: String.raw`P(H \mid D) = \frac{P(D \mid H)\,P(H)}{P(D)}`,
      formulaNote: "P(H|D) = posterior: keyakinan pada hipotesis H setelah melihat data D; P(D|H) = likelihood: peluang data bila H benar; P(H) = prior: keyakinan sebelum data; P(D) = peluang data keseluruhan (penormal).",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Prior itu subjektif, jadi Bayesian tidak ilmiah. Salah: prior yang ditulis eksplisit dan bisa diaudit justru lebih ilmiah daripada asumsi frequentist yang disembunyikan (α = 5% juga pilihan subjektif!). Prior bisa non-informatif, data besar menghapus prior, dan sensitivitas prior bisa dilaporkan.",
      },
      reference: "Alur siklikal: posterior hari ini = prior besok.",
    },
    {
      id: "beta-binomial",
      eyebrow: "Langkah 3 · Beta-Binomial",
      title: "Updating semudah penjumlahan",
      prose: [
        "Pasangan konjugat: prior Beta + likelihood Binomial → posterior Beta. Cukup tambahkan jumlah sukses ke α dan jumlah gagal ke β. Tidak ada integral, tidak ada MCMC. Prior dari segmen lama: Beta(2, 38) — mean 5%, keyakinan setara 40 observasi. Data segmen baru: 8 default dari 200.",
        "Posterior = Beta(2+8, 38+192) = Beta(10, 230). Mean posterior = 10/240 ≈ 4,17%. Cek kompromi: MLE data = 4%, prior mean = 5%. Bobot data w = 200/240 ≈ 0,83 → 0,83×4% + 0,17×5% ≈ 4,17%. Posterior berada di antara keduanya — si diplomat yang menimbang bukti sesuai bobotnya.",
      ],
      formula: String.raw`\text{Beta}(\alpha, \beta) + \text{Bin}(x, n) \to \text{Beta}(\alpha+x,\; \beta+n-x)`,
      formulaNote: "Beta(alpha, beta) = prior atas peluang sukses; Bin(x, n) = likelihood dari x sukses dalam n percobaan; posterior = Beta(alpha+x, beta+n-x) — updating semudah menjumlahkan observasi ke parameter prior.",
      tasks: [
        { id: "t1", text: "Hitung `a_post` = α + sukses" },
        { id: "t2", text: "Hitung `b_post` = β + gagal" },
        { id: "t3", text: "Hitung `mean_post` = a_post/(a_post+b_post) × 100 (2 desimal)" },
      ],
      expected: "a_post=10  b_post=230  mean_post=4.17",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Pakai MLE 4% saja — data bicara. Salah: MLE mengabaikan 40 observasi virtual dari historis. Dengan n kecil, MLE liar; posterior menstabilkannya. Dengan n besar, posterior ≈ MLE — prior terlupakan otomatis.",
      },
      hints: [
        "a_post = 2 + 8.",
        "b_post = 38 + (200 − 8).",
        "mean_post = round(a_post/(a_post+b_post)*100, 2)",
      ],
      code: {
        starter: `# prior Beta(2,38), data: 8 default dari 200\n\n# TULIS KODEMU\na_post = \nb_post = \nmean_post = \n\nprint(f"a_post={a_post}  b_post={b_post}  mean_post={mean_post}")`,
        lockLines: 1,
        solution: `# prior Beta(2,38), data: 8 default dari 200\n\n# TULIS KODEMU\na_post = 2 + 8\nb_post = 38 + (200-8)\nmean_post = round(a_post/(a_post+b_post)*100, 2)\n\nprint(f"a_post={a_post}  b_post={b_post}  mean_post={mean_post}")`,
        checks: [
          { kind: "equal", task: "t1", name: "a_post", value: 10, tol: 1e-9, label: "`a_post` seharusnya 10", msg: "2 + 8 = 10." },
          { kind: "equal", task: "t2", name: "b_post", value: 230, tol: 1e-9, label: "`b_post` seharusnya 230", msg: "38 + 192 = 230." },
          { kind: "equal", task: "t3", name: "mean_post", value: 4.17, tol: 0.01, label: "`mean_post` seharusnya 4.17", msg: "10/240 × 100% ≈ 4,17% — di antara MLE 4% dan prior 5%." },
          { kind: "stdout_matches", task: "t3", pattern: "a_post=10\\s+b_post=230\\s+mean_post=4\\.17", label: "`print` menampilkan ketiganya", msg: "Format: a_post=...  b_post=...  mean_post=... ." },
        ],
      },
      reference: "Konjugat = update dengan penjumlahan. Hafalkan polanya.",
    },
    {
      id: "sensitivitas-prior",
      eyebrow: "Langkah 4 · Sensitivitas prior",
      title: "Prior kuat bisa membungkam data",
      prose: [
        "Data sama (16 default dari 200). Prior A (skeptis): Beta(50, 950) — mean 5%, kuat. Prior B (vague): Beta(1, 1). Posterior A = Beta(66, 1134) → mean 5,5%: data hampir tidak menggerakkan prior kuat! Posterior B = Beta(17, 185) → mean 8,4% (≈ data).",
        "Pelajaran: dengan n = 200, prior kuat mendominasi. Uji sensitivitas wajib: laporkan hasil di beberapa prior. Jika kesimpulan berubah → data belum cukup kuat; katakan jujur. Bayesian memaksa prior eksplisit — dan karena eksplisit, ia bisa diuji. Bobot data w = n/(α+β+n) → 1 saat n besar: semua prior yang wajar konvergen.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean_a` posterior prior skeptis (%, 2 desimal)" },
        { id: "t2", text: "Hitung `mean_b` posterior prior vague (%, 2 desimal)" },
      ],
      expected: "mean_a=5.5  mean_b=8.42",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Prior non-informatif = tidak ada asumsi. Salah: tidak ada prior yang benar-benar tanpa asumsi — Beta(1,1) uniform dalam θ tidak uniform dalam transformasinya (misal log-odds). Non-informatif berarti berusaha netral, bukan bebas asumsi. Kejujuran Bayesian ada pada keterbukaan asumsi, bukan ketiadaannya.",
      },
      hints: [
        "A: Beta(50+16, 950+184) → mean = 66/1200.",
        "B: Beta(1+16, 1+184) → mean = 17/202.",
        "Kalikan 100, bulatkan 2 desimal.",
      ],
      code: {
        starter: `# data: 16 default dari 200\n# A: Beta(50,950) skeptis | B: Beta(1,1) vague\n\n# TULIS KODEMU\nmean_a = \nmean_b = \n\nprint(f"mean_a={mean_a}  mean_b={mean_b}")`,
        lockLines: 2,
        solution: `# data: 16 default dari 200\n# A: Beta(50,950) skeptis | B: Beta(1,1) vague\n\n# TULIS KODEMU\nmean_a = round(66/1200*100, 2)\nmean_b = round(17/202*100, 2)\n\nprint(f"mean_a={mean_a}  mean_b={mean_b}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_a", value: 5.5, tol: 0.01, label: "`mean_a` seharusnya 5.5", msg: "66/1200 × 100% = 5,5% — prior kuat hampir tidak bergeser." },
          { kind: "equal", task: "t2", name: "mean_b", value: 8.42, tol: 0.01, label: "`mean_b` seharusnya 8.42", msg: "17/202 × 100% ≈ 8,42% — mengikuti data." },
          { kind: "stdout_matches", task: "t2", pattern: "mean_a=5\\.5\\s+mean_b=8\\.42", label: "`print` menampilkan keduanya", msg: "Format: mean_a=...  mean_b=... ." },
        ],
      },
      reference: "Untuk n kecil, prior penting — pilih & laporkan dengan jujur.",
    },
    {
      id: "credible-interval",
      eyebrow: "Langkah 5 · Credible interval",
      title: "95% yang sebenarnya",
      prose: [
        "Credible interval 95% (2,9%, 8,2%) untuk PD berarti: ada 95% peluang PD sebenarnya di antara 2,9% dan 8,2% — benar secara harfiah. Bandingkan dengan confidence interval frequentist yang melarang kalimat itu (CI frequentist soal prosedur, bukan soal θ). Perbedaan satu kata = perbedaan filosofi total.",
        "Credible interval menjawab pertanyaan manusia yang sebenarnya (seberapa yakin saya?), sedangkan CI frequentist menjawab pertanyaan prosedur (seberapa andal metodenya?). Untuk komunikasi ke pengambil keputusan, credible interval hampir selalu lebih intuitif — salah satu alasan Bayesian populer di industri.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "95% credible interval = 95% data ada di rentang itu. Salah: interval ini soal parameter θ (PD sebenarnya), bukan soal data. Dan PD tidak pasti 5,55% (tengahnya) — posterior adalah distribusi, bukan titik.",
      },
      reference: "Direksi bertanya berapa peluang PD > 5%? Hitung luas posterior di atas 0,05.",
    },
    {
      id: "prior-vs-frequentist",
      eyebrow: "Langkah 6 · Memilih pendekatan",
      title: "Kapan Bayesian, kapan frequentist",
      prose: [
        "Tiga jenis prior: non-informatif Beta(1,1) — saya tidak tahu apa-apa; informatif lemah Beta(2,2) — sedikit condong ke tengah, menstabilkan n kecil; informatif Beta(2,38) — dari data historis, kuat untuk n kecil, wajib dilaporkan & diuji sensitivitasnya. Aturan kejujuran: prior ditulis & dibenarkan; laporkan sensitivitas; jika hasil tergantung prior, akui data belum cukup.",
        "Peta keputusan: n kecil + pengetahuan awal kuat → Bayesian informatif. Monitoring berkala → Bayesian updating (posterior hari ini = prior besok; monitoring tanpa dosa peeking). Butuh pernyataan probabilitas langsung → credible interval. n besar tanpa info awal → frequentist cukup (posterior ≈ hasil frequentist; jangan over-engineering). Model kompleks non-konjugat → MCMC.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keunggulan praktis terbesar Bayesian di industri: monitoring tanpa dosa peeking. Frequentist melarang mengintip A/B test sebelum n tercapai; Bayesian mempersilakan update posterior tiap hari — karena posterior adalah keyakinan saat ini, bukan keputusan final dengan α yang digelembungkan.",
      },
      reference: "Analis modern memakai keduanya — pilih alat sesuai masalah, bukan tren.",
    },
    {
      id: "minicase-segmen",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Default rate segmen baru: mendamaikan dua kubu",
      prose: [
        "DanaKita membuka segmen kredit warung. Data historis segmen kios pasar (mirip): default ~5% (dari 2.000 pinjaman). Setelah 3 bulan segmen baru: 165 pinjaman, 9 default (MLE = 5,45%). Tim risiko terbelah: kubu data bicara mau pakai 5,45%; kubu pengalaman bicara mau pakai 5% historis. Kamu diminta angka tunggal untuk pricing + ukuran ketidakpastiannya.",
        "(a) Prior Beta(5, 95): mean 5%, bobot 100 observasi — keyakinan sedang. (b) Posterior = Beta(5+9, 95+156) = Beta(14, 251). Mean = 14/265 ≈ 5,28%. 95% credible interval ≈ (2,9%, 8,2%). (c) Kedua kubu setengah benar: MLE mengabaikan 2.000 data historis; 5% mengabaikan 165 data baru. Posterior 5,28% adalah kompromi berbobot bukti. Keputusan pricing: pakai PD konservatif 7% (di dalam CI, di atas mean), dengan review trigger jika 6 bulan lagi posterior bergeser.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `a_post` = 5 + 9" },
        { id: "t2", text: "Hitung `b_post` = 95 + 156" },
        { id: "t3", text: "Hitung `mean_post` = a_post/(a_post+b_post) × 100 (2 desimal)" },
      ],
      expected: "a_post=14  b_post=251  mean_post=5.28",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pricing memakai batas atas yang didiskon (7%), bukan mean posterior — karena ketidakpastian (CI 2,9–8,2%) adalah risiko yang harus dihargai. Dan tetapkan review trigger: posterior diperbarui tiap data masuk, keputusan pricing ikut diperbarui.",
      },
      hints: [
        "a_post = 5 + 9; b_post = 95 + 156.",
        "mean = a/(a+b) × 100.",
        "mean_post = round(14/265*100, 2)",
      ],
      code: {
        starter: `# prior Beta(5,95), data: 9 default dari 165\n\n# TULIS KODEMU\na_post = \nb_post = \nmean_post = \n\nprint(f"a_post={a_post}  b_post={b_post}  mean_post={mean_post}")`,
        lockLines: 1,
        solution: `# prior Beta(5,95), data: 9 default dari 165\n\n# TULIS KODEMU\na_post = 5 + 9\nb_post = 95 + 156\nmean_post = round(a_post/(a_post+b_post)*100, 2)\n\nprint(f"a_post={a_post}  b_post={b_post}  mean_post={mean_post}")`,
        checks: [
          { kind: "equal", task: "t1", name: "a_post", value: 14, tol: 1e-9, label: "`a_post` seharusnya 14", msg: "5 + 9 = 14." },
          { kind: "equal", task: "t2", name: "b_post", value: 251, tol: 1e-9, label: "`b_post` seharusnya 251", msg: "95 + 156 = 251." },
          { kind: "equal", task: "t3", name: "mean_post", value: 5.28, tol: 0.01, label: "`mean_post` seharusnya 5.28", msg: "14/265 × 100% ≈ 5,28% — kompromi 5,45% dan 5%." },
          { kind: "stdout_matches", task: "t3", pattern: "a_post=14\\s+b_post=251\\s+mean_post=5\\.28", label: "`print` menampilkan ketiganya", msg: "Format: a_post=...  b_post=...  mean_post=... ." },
        ],
      },
      reference: "Posterior hari ini = prior besok — akumulasi pengetahuan yang natural.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Teorema Bayes: posterior ∝ likelihood × prior — keyakinan baru menimbang bukti dengan keyakinan lama.",
        "Base-rate fallacy: tes 99% akurat pada penyakit 1/10.000 → peluang sakit ≈ 1%.",
        "Beta-Binomial: posterior = Beta(α+x, β+n−x) — updating semudah penjumlahan.",
        "Credible interval 95% = 95% peluang θ di interval itu — benar secara harfiah.",
        "Prior penting untuk n kecil (laporkan sensitivitas); data besar menghapus perbedaan prior.",
      ],
      next: { label: "A2.13 — Berpikir Kausal", href: "/v2/learn/a213-kausalitas" },
      quiz: [
        {
          q: "Tes 99% akurat, hasil positif, tapi penyakitnya 1/10.000. Peluang benar-benar sakit?",
          options: [
            { text: "99%", why: "Itu akurasi tes, bukan peluang sakit — base rate belum dihitung." },
            { text: "~1% — base rate (prior) mendominasi: 100 false positive vs 1 true positive", why: "P(sakit|positif) ≈ 1%. Bukti kuat dikalahkan prior yang sangat kecil.", correct: true },
            { text: "50%", why: "Tidak ada dasar 50/50 — base rate-nya 1/10.000." },
            { text: "0,01%", why: "Itu base rate sebelum tes — tes positif menaikkannya ke ~1%." },
          ],
        },
        {
          q: "Prior Beta(2,38), data 8 sukses dari 200. Posterior?",
          options: [
            { text: "Beta(10, 230)", why: "α+x = 10; β+(n−x) = 230. Updating konjugat semudah penjumlahan.", correct: true },
            { text: "Beta(8, 200)", why: "Itu mengabaikan prior — bukan updating Bayesian." },
            { text: "Beta(2, 38)", why: "Itu prior yang tidak diupdate — datanya diabaikan." },
            { text: "Beta(10, 238)", why: "β salah: 38+192 = 230, bukan 238." },
          ],
        },
        {
          q: "95% credible interval (2,9%, 8,2%) untuk PD. Pernyataan yang benar?",
          options: [
            { text: "95% data ada di rentang itu", why: "Interval ini soal parameter θ, bukan soal data." },
            { text: "Ada 95% peluang PD sebenarnya di antara 2,9% dan 8,2% — benar secara harfiah", why: "θ diperlakukan sebagai distribusi, sehingga pernyataan probabilitas tentang θ valid.", correct: true },
            { text: "Sama saja dengan confidence interval", why: "Berbeda filosofi: CI frequentist melarang kalimat ini." },
            { text: "PD pasti 5,55% (tengahnya)", why: "Posterior adalah distribusi — bukan titik pasti." },
          ],
        },
        {
          q: "Dengan n=20, tiga prior berbeda memberi posterior 26%, 40%, 43%. Dengan n=2.000 proporsi sama, ketiganya → ~40%. Pelajarannya?",
          options: [
            { text: "Prior tidak pernah penting", why: "Untuk n kecil prior sangat penting — 26% vs 43%." },
            { text: "Prior penting untuk n kecil (laporkan sensitivitasnya); data besar menghapus perbedaan prior", why: "Bobot data w = n/(α+β+n) → 1 saat n besar.", correct: true },
            { text: "Selalu pakai prior netral", why: "Prior informatif yang defensibel lebih baik untuk n kecil." },
            { text: "Bayesian tidak konsisten", why: "Justru konsisten: semua prior wajar konvergen dengan data cukup." },
          ],
        },
        {
          q: "Kapan Bayesian jelas mengungguli frequentist?",
          options: [
            { text: "Selalu — lebih modern", why: "Modern bukan alasan — untuk n besar tanpa prior keduanya konvergen." },
            { text: "n kecil + prior kuat & defensibel; monitoring berkala; butuh pernyataan probabilitas langsung", why: "Tiga keunggulan praktis Bayesian. Selain itu frequentist lebih simpel.", correct: true },
            { text: "Tidak pernah", why: "Ada: n kecil, monitoring, dan pernyataan probabilitas langsung." },
            { text: "Hanya untuk data normal", why: "Beta-Binomial untuk proporsi adalah contoh non-normal." },
          ],
        },
      ],
      note: {
        title: "Intuisi: Bayesian memaksamu menulis firasat sebagai angka",
        body: "Lima heuristik. Satu: prior bukan tebakan liar — ia adalah ringkasan pengetahuan domain yang ditulis sebagai angka; prior yang tidak bisa kamu pertahankan di depan skeptis adalah opini berkedok matematika. Dua: dengan data melimpah prior lenyap, dengan data sedikit prior berkuasa — selalu uji sensitivitas di beberapa prior; bila kesimpulan berganti, datamu belum cukup kuat dan kejujuran mewajibkanmu mengatakannya. Tiga: posterior hari ini adalah prior besok — monitoring Bayesian memaafkan “peeking” yang menghukum frequentist, karena updating berurutan adalah cara kerja yang sah, bukan curang. Empat: credible interval menjawab pertanyaan manusia (“seberapa yakin saya?”), bukan pertanyaan prosedur — untuk komunikasi ke pengambil keputusan, ia jauh lebih jujur. Lima: jangan Bayesian-kan masalah yang frequentist-nya sudah cukup — kompleksitas prior harus dibayar dengan wawasan; bila n besar dan tidak ada pengetahuan awal, kedua kubu tiba di tempat yang sama. Enam: prior informatif adalah aset yang bisa diaudit — tulis sumbernya (data historis 2.000 pinjaman, konsensus ahli) di samping angkanya; prior tanpa provenance adalah opini.",
      },
    },
  ],
};

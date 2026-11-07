import type { V2Lesson } from "../lib/types";

export const a37: V2Lesson = {
  slug: "a37-imbalanced-data",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.7 Imbalanced Data: Ketika 3% Menentukan Nasib Model",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-fraud-kosong",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "10.000 transaksi aman, 3 penipu lolos",
      prose: [
        "Tim fraud bank meluncurkan model ML baru. Di data uji: akurasi 99,97 persen. Semua orang merayakan — sampai kepala fraud memeriksa daftar tangkapan: kosong. Dari 10.000 transaksi uji berisi 3 fraud aktual, model tidak menandai satu pun.",
        "Yang terjadi: model belajar strategi paling aman — tebak selalu aman. Dengan fraud rate 0,03 persen, strategi malas itu benar 99,97 persen dan loss function-nya sangat puas. Model tidak rusak; ia rasional — diberi insentif yang salah, ia memilih kemalasan yang optimal.",
        "Solusinya bukan data lebih banyak (10 juta transaksi aman tidak membantu jika hanya 3.000 fraud), melainkan mengubah insentif: membuat kesalahan pada kelas langka lebih mahal daripada kesalahan pada kelas umum.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Fraud/ML Analytics, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model fraud yang malas = kerugian fraud yang tidak terdeteksi. Akurasi tinggi di dashboard menyembunyikan kegagalan total misi model.",
      },
      reference: "Ubah insentif, bukan cuma tambah data. Buat salah di kelas langka lebih mahal.",
    },
    {
      id: "tiga-mekanisme",
      eyebrow: "Langkah 2 · Tiga mekanisme",
      title: "Mengapa imbalance merusak",
      prose: [
        "Satu, gradient didominasi mayoritas: saat training, 97 persen sinyal gradient berasal dari kelas umum — model mengoptimalkan yang umum dan mengabaikan yang langka. Dua, akurasi menipu: strategi malas selalu benar sebesar proporsi mayoritas. Tiga, threshold default 0,5 salah: threshold itu asumsi biaya simetris dan base rate 50:50 — keduanya salah di sini.",
        "Urutan kerja yang benar: ganti metrik dulu (PR-AUC, expected cost), lalu class weight (murah dan aman), lalu threshold tuning, SMOTE terakhir jika belum cukup. SMOTE sebagai langkah pertama berisiko merusak kalibrasi dan validasi tanpa menyelesaikan akar masalah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Langsung SMOTE 50:50 sebagai langkah pertama. Urutan: metrik dulu, class weight, threshold tuning, SMOTE terakhir. SMOTE duluan = merusak kalibrasi sebelum insentif diperbaiki.",
      },
      reference: "Metrik -> class weight -> threshold -> SMOTE. Jangan dibalik.",
    },
    {
      id: "lab-class-weight",
      eyebrow: "Langkah 3 · Lab: class weight",
      title: "Membuat model peduli pada minoritas",
      prose: [
        "Class weight: tanpa mengubah data, ubah insentif — kesalahan pada kelas langka dikali bobot (misal 1:7 mengikuti rasio imbalance). Di bawah: n=3000, default rate 12,7 persen. Tanpa bobot: precision 39,3 persen, recall 77,9 persen. Dengan class weight 1:7: precision 19,9 persen, recall 97,6 persen.",
        "Class weight mendorong model peduli kelas minoritas: recall naik (lebih banyak default tertangkap), precision turun (lebih banyak alarm palsu). Tidak ada makan siang gratis — ini tradeoff yang harganya ditentukan biaya bisnis, bukan statistik.",
        "Tugasmu: hitung rasio imbalance, latih dengan bobot itu, ukur precision/recall di threshold operasional 0,15.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ratio` = mayoritas/minoritas" },
        { id: "t2", text: "Latih dengan `w1=ratio`, hitung `prec`, `rec` di thr=0.15, lalu `print`" },
      ],
      expected: "prec=19.9% rec=97.6%",
      note: {
        title: "Sering salah",
        body: "Mengira bobot harus selalu sama dengan rasio imbalance. Rasio adalah titik awal, bukan jawaban — bobot optimal dipilih dari expected cost bisnis.",
      },
      hints: [
        "ratio = (n - sum(y)) / sum(y).",
        "fit_logreg(x1, x2, y, w1=ratio) mengembalikan (b0,b1,b2).",
        "pr_at(y, p2, thr=0.15) mengembalikan (prec, rec).",
      ],
      code: {
        starter: `import random, math\nrandom.seed(13)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 3000\nx1 = [random.gauss(0,1) for _ in range(n)]\nx2 = [random.gauss(0,1) for _ in range(n)]\ny = [1 if random.random() < sigmoid(-3.0 - 1.6*a + 1.1*b) else 0 for a, b in zip(x1, x2)]\n\ndef fit_logreg(xs1, xs2, ys, w1=1.0, iters=400, lr=0.5):\n    b0, b1, b2 = 0.0, 0.0, 0.0\n    for _ in range(iters):\n        g0=g1=g2=0.0\n        for a, c, yi in zip(xs1, xs2, ys):\n            p = sigmoid(b0+b1*a+b2*c)\n            w = w1 if yi==1 else 1.0\n            g0 += w*(yi-p); g1 += w*(yi-p)*a; g2 += w*(yi-p)*c\n        tot = sum(w1 if yi==1 else 1.0 for yi in ys)\n        b0 += lr*g0/tot; b1 += lr*g1/tot; b2 += lr*g2/tot\n    return b0, b1, b2\n\ndef pr_at(y, p, thr=0.15):\n    pred = [1 if v > thr else 0 for v in p]\n    tp = sum(1 for a,b in zip(y,pred) if a==1 and b==1)\n    fp = sum(1 for a,b in zip(y,pred) if a==0 and b==1)\n    fn = sum(1 for a,b in zip(y,pred) if a==1 and b==0)\n    return tp/(tp+fp) if tp+fp else 0, tp/(tp+fn) if tp+fn else 0\n\n# TULIS KODEMU: class weight mengikuti rasio imbalance\nratio = \nb0, b1, b2 = \np2 = [sigmoid(b0+b1*a+b2*c) for a, c in zip(x1, x2)]\nprec, rec = \n\nprint(f"prec={prec:.1%} rec={rec:.1%}")`,
        lockLines: 31,
        solution: `import random, math\nrandom.seed(13)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 3000\nx1 = [random.gauss(0,1) for _ in range(n)]\nx2 = [random.gauss(0,1) for _ in range(n)]\ny = [1 if random.random() < sigmoid(-3.0 - 1.6*a + 1.1*b) else 0 for a, b in zip(x1, x2)]\n\ndef fit_logreg(xs1, xs2, ys, w1=1.0, iters=400, lr=0.5):\n    b0, b1, b2 = 0.0, 0.0, 0.0\n    for _ in range(iters):\n        g0=g1=g2=0.0\n        for a, c, yi in zip(xs1, xs2, ys):\n            p = sigmoid(b0+b1*a+b2*c)\n            w = w1 if yi==1 else 1.0\n            g0 += w*(yi-p); g1 += w*(yi-p)*a; g2 += w*(yi-p)*c\n        tot = sum(w1 if yi==1 else 1.0 for yi in ys)\n        b0 += lr*g0/tot; b1 += lr*g1/tot; b2 += lr*g2/tot\n    return b0, b1, b2\n\ndef pr_at(y, p, thr=0.15):\n    pred = [1 if v > thr else 0 for v in p]\n    tp = sum(1 for a,b in zip(y,pred) if a==1 and b==1)\n    fp = sum(1 for a,b in zip(y,pred) if a==0 and b==1)\n    fn = sum(1 for a,b in zip(y,pred) if a==1 and b==0)\n    return tp/(tp+fp) if tp+fp else 0, tp/(tp+fn) if tp+fn else 0\n\n# TULIS KODEMU: class weight mengikuti rasio imbalance\nratio = (n-sum(y))/sum(y)\nb0, b1, b2 = fit_logreg(x1, x2, y, w1=ratio)\np2 = [sigmoid(b0+b1*a+b2*c) for a, c in zip(x1, x2)]\nprec, rec = pr_at(y, p2, thr=0.15)\n\nprint(f"prec={prec:.1%} rec={rec:.1%}")`,
        checks: [
          { kind: "equal", task: "t2", name: "prec", value: 0.199, tol: 0.01, label: "`prec` sekitar 19.9%", msg: "Precision turun — harga recall yang naik." },
          { kind: "equal", task: "t2", name: "rec", value: 0.976, tol: 0.01, label: "`rec` sekitar 97.6%", msg: "Recall naik — model kini agresif menandai." },
          { kind: "stdout_matches", task: "t2", pattern: "prec=19\\.9%\\s+rec=97\\.6%", label: "`print` menampilkan tradeoff", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Class weight = ubah insentif tanpa ubah data. Kalibrasi relatif terjaga.",
    },
    {
      id: "lab-smote",
      eyebrow: "Langkah 4 · Lab: SMOTE",
      title: "Interpolasi, bukan informasi baru",
      prose: [
        "SMOTE membuat titik sintetis di antara titik minoritas yang bertetangga: pilih titik, pilih tetangga terdekatnya, interpolasi acak di antaranya. Dari 6 titik minoritas lahir 12 titik sintetis — contoh: (8,02, 8,01).",
        "Catatan penting: SMOTE hanya interpolasi — ia tidak menciptakan informasi baru. Jika minoritas asli tidak representatif, SMOTE hanya memperbanyak ketidakrepresentatifan itu. Dari 40 titik tidak lahir informasi baru; solusinya kumpulkan data, libatkan pakar, atau pakai anomaly detection.",
        "Aturan keras: SMOTE hanya di dalam fold latih — tidak pernah sebelum train-test split. Titik sintetis di test set yang bocor dari train set membuat validasi terlihat bagus palsu.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan `smote(minor)` dan hitung `n_syn`" },
        { id: "t2", text: "Ambil titik pertama `x0`, `y0`, lalu `print`" },
      ],
      expected: "n_syn=12 x0=8.02 y0=8.01",
      note: {
        title: "Sering salah",
        body: "Menerapkan SMOTE sebelum train-test split. Itu leakage: titik sintetis adalah interpolasi titik train — test set terkontaminasi dan performa terlihat bagus palsu.",
      },
      hints: [
        "smote(minor) memakai k=3, n_new=12 secara default.",
        "Titik pertama: syn[0][0], syn[0][1].",
        "syn = smote(minor)",
      ],
      code: {
        starter: `import random, math\nrandom.seed(8)\n\nminor = [(8.0,8.0),(8.5,8.3),(9.0,7.8),(8.2,7.5),(8.8,8.5),(7.8,8.2)]\n\ndef dist(a, b): return math.hypot(a[0]-b[0], a[1]-b[1])\n\ndef smote(minor, k=3, n_new=12):\n    new_pts = []\n    for _ in range(n_new):\n        i = random.randrange(len(minor))\n        neigh = sorted(range(len(minor)), key=lambda j: dist(minor[i], minor[j]))[1:k+1]\n        j = random.choice(neigh)\n        t = random.random()\n        new_pts.append((minor[i][0]+t*(minor[j][0]-minor[i][0]),\n                        minor[i][1]+t*(minor[j][1]-minor[i][1])))\n    return new_pts\n\n# TULIS KODEMU\nsyn = \nn_syn = \nx0, y0 = \n\nprint(f"n_syn={n_syn} x0={x0:.2f} y0={y0:.2f}")`,
        lockLines: 18,
        solution: `import random, math\nrandom.seed(8)\n\nminor = [(8.0,8.0),(8.5,8.3),(9.0,7.8),(8.2,7.5),(8.8,8.5),(7.8,8.2)]\n\ndef dist(a, b): return math.hypot(a[0]-b[0], a[1]-b[1])\n\ndef smote(minor, k=3, n_new=12):\n    new_pts = []\n    for _ in range(n_new):\n        i = random.randrange(len(minor))\n        neigh = sorted(range(len(minor)), key=lambda j: dist(minor[i], minor[j]))[1:k+1]\n        j = random.choice(neigh)\n        t = random.random()\n        new_pts.append((minor[i][0]+t*(minor[j][0]-minor[i][0]),\n                        minor[i][1]+t*(minor[j][1]-minor[i][1])))\n    return new_pts\n\n# TULIS KODEMU\nsyn = smote(minor)\nn_syn = len(syn)\nx0, y0 = syn[0]\n\nprint(f"n_syn={n_syn} x0={x0:.2f} y0={y0:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_syn", value: 12, tol: 1e-9, label: "`n_syn` seharusnya 12", msg: "smote(minor) menghasilkan 12 titik sintetis." },
          { kind: "equal", task: "t2", name: "x0", value: 8.02, tol: 0.05, label: "`x0` sekitar 8.02", msg: "Titik pertama hasil interpolasi dua tetangga." },
          { kind: "stdout_matches", task: "t2", pattern: "n_syn=12\\s+x0=8\\.02\\s+y0=8\\.01", label: "`print` menampilkan hasil SMOTE", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "SMOTE = interpolasi tetangga. Hanya di fold latih. Bukan sumber informasi baru.",
    },
    {
      id: "threshold-stratified",
      eyebrow: "Langkah 5 · Threshold & validasi",
      title: "Threshold dari biaya, validasi berstrata",
      prose: [
        "Threshold bukan 0,5 dan bukan dari akurasi — ia dipilih dari biaya bisnis atau kapasitas operasional (contoh: tandai tepat 5.000 transaksi per bulan sesuai kapasitas investigasi — top-k ranking, bukan threshold probabilitas).",
        "Stratified CV wajib untuk data imbalance: tanpa stratifikasi, satu fold bisa kebetulan berisi nol sampel positif — metrik jadi NaN atau gaduh. Proporsi kelas harus dijaga di tiap fold. Untuk data berkelompok (satu kartu banyak transaksi): stratified group k-fold agar kartu yang sama tidak bocor antar fold.",
        "Jika model butuh probabilitas untuk pricing (PD x LGD): teknik yang aman adalah class weight + threshold tuning — menjaga kalibrasi relatif. Hindari sampling yang merusak base rate.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Threshold dari default 0,5 di fraud rate 0,1 persen berarti hampir tidak ada yang ditandai — tim investigasi menganggur sementara fraud lolos.",
      },
      reference: "Threshold dari biaya/kapasitas. Stratified CV wajib. Group k-fold untuk data berkelompok.",
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
          q: "Fraud rate 0,1%. Strategi pertama yang paling tepat?",
          options: [
            { text: "Langsung SMOTE 50:50", why: "Salah. SMOTE langkah terakhir, bukan pertama." },
            { text: "Ganti metrik ke PR-AUC/expected cost + class weight; SMOTE hanya jika belum cukup", why: "Benar. Urutan: metrik, class weight, threshold, SMOTE terakhir.", correct: true },
            { text: "Kumpulkan 10x data lagi", why: "Salah. Data aman tambahan tidak menambah informasi fraud." },
            { text: "Naikkan akurasi dengan model lebih kompleks", why: "Salah. Akurasi bukan metrik yang tepat." },
          ],
        },
        {
          q: "SMOTE diterapkan sebelum train-test split. Akibat?",
          options: [
            { text: "Tidak ada masalah", why: "Salah. Ini leakage klasik." },
            { text: "Leakage: titik sintetis di test set bocor dari titik train — performa terlihat bagus palsu", why: "Benar. Sampling hanya di dalam fold latih.", correct: true },
            { text: "Model jadi lebih cepat", why: "Salah. Tidak ada hubungan." },
            { text: "Akurasi pasti turun", why: "Salah. Justru terlihat naik palsu." },
          ],
        },
      ],
      reference: "Metrik dulu. SMOTE hanya di fold latih.",
    },
    {
      id: "mini-case-fraud",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Model fraud 0,1 persen",
      prose: [
        "Bank ingin model deteksi fraud kartu kredit: 2 juta transaksi per bulan, fraud rate 0,1 persen (2.000 kasus). Tim investigasi mampu memeriksa 5.000 transaksi per bulan. Vendor mengusulkan: SMOTE 50:50, akurasi 99 persen.",
        "Tiga kesalahan usulan vendor: akurasi 99 persen tidak bermakna di base rate 0,1 persen; SMOTE 50:50 tanpa menyebut validasi di data asli dan probabilitasnya tidak terkalibrasi; tidak ada pembahasan kapasitas investigasi — model yang menandai 50.000 transaksi per bulan tidak berguna walau akurat.",
        "Strategi yang benar: class weight + gradient boosting; metrik = PR-AUC + precision/recall; threshold dipilih dari kapasitas — tandai tepat sekitar 5.000 per bulan (top-k ranking, bukan threshold probabilitas); evaluasi stratified group CV (satu kartu = satu grup). Target operasional: tangkap 60 persen x 2.000 = 1.200 fraud dari 5.000 yang diperiksa — precision minimum = 1.200/5.000 = 24 persen. Ini target yang jujur, jauh lebih bermakna daripada akurasi 99 persen.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Target operasional (precision 24% pada kapasitas 5.000) menghubungkan model ke realitas tim — model yang tidak bisa dioperasionalkan adalah biaya, bukan aset.",
      },
      reference: "Top-k sesuai kapasitas. Precision minimum = target tangkapan / kapasitas.",
    },
    {
      id: "pendalaman-smote-gagal",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Kapan SMOTE berbohong & threshold dari biaya",
      prose: [
        "SMOTE punya tiga mode kegagalan yang jarang dibahas. Satu, kelas tumpang tindih (overlap): bila wilayah minoritas dan mayoritas berbaur, interpolasi antar titik minoritas menciptakan titik sintetis yang sebenarnya berada di wilayah mayoritas — memperburuk batas keputusan, bukan memperbaikinya. Dua, noise yang diperbanyak: titik minoritas yang sebenarnya noise ikut diinterpolasi — SMOTE tidak bisa membedakan sinyal dari sampah. Tiga, ilusi informasi: dari 40 titik tidak lahir informasi baru apapun tekniknya. Aturan: SMOTE hanya membantu bila minoritas membentuk gugusan yang jelas dan terpisah — cek visualisasi dulu sebelum percaya.",
        "Secara matematis, class weight dan resampling mengubah insentif dengan cara yang mirip — tapi class weight tidak mengubah distribusi data. Konsekuensinya besar: validasi tetap jujur (distribusi evaluasi = distribusi produksi) dan kalibrasi relatif terjaga. Itulah alasan class weight didahulukan dalam urutan kerja: ia memperbaiki insentif tanpa merusak dunia tempat model dievaluasi.",
        "Threshold kemudian dipilih dari biaya, bukan dari 0,5: t* = C_FP/(C_FP + C_FN). Di fraud, C_FN (fraud lolos) biasanya jauh lebih besar dari C_FP (investigasi sia-sia) — threshold optimal jauh di bawah 0,5. Alternatif operasional yang sering lebih jujur: top-k ranking — tandai tepat k transaksi berskor tertinggi sesuai kapasitas investigasi. Ini bukan threshold probabilitas; ini alokasi sumber daya.",
        "Jebakan validasi yang harus dihindari: stratified CV wajib (fold tanpa sampel positif = metrik gaduh), group k-fold untuk data berkelompok (satu kartu = satu grup — jangan biarkan kartu yang sama di train dan test), dan metrik SELALU dihitung di distribusi asli, bukan di fold yang di-resample. Pipeline yang benar: split dulu (stratified, by group), resample HANYA di dalam fold latih, evaluasi di fold validasi yang utuh.",
      ],
      formula: String.raw`t^* = \frac{C_{FP}}{C_{FP} + C_{FN}}`,
      formulaNote: "t* = threshold optimal dari biaya; C_FP = biaya alarm palsu (investigasi sia-sia); C_FN = biaya miss (fraud lolos). Alternatif operasional: top-k sesuai kapasitas investigasi — tandai k skor tertinggi, bukan threshold probabilitas tetap.",
      tasks: [],
      reference: "SMOTE hanya untuk gugusan jelas. Class weight dulu. Threshold dari biaya/kapasitas. Evaluasi di distribusi asli.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: imbalance adalah soal insentif, bukan soal data",
        body: "Model selalu rasional terhadap insentif yang kamu beri — bila ia memilih kemalasan, salahkan fungsi loss-mu, bukan modelnya. Tiga heuristik. Pertama: urutan kerja tidak bisa dibalik — metrik dulu, lalu insentif (class weight), lalu keputusan (threshold), terakhir data (SMOTE). Membalik urutan = mengobati gejala sebelum diagnosis. Kedua: tanyakan kapasitas operasional SEBELUM memilih threshold. Model yang menandai 10x kapasitas tim investigasi adalah model yang tidak akan dipakai — secanggih apapun PR-AUC-nya. Ketiga: evaluasi SELALU di distribusi asli. Metrik yang dihitung di data hasil resample adalah fiksi — ia mengukur dunia yang tidak ada. Aturan praktis: bila kelas minoritas di bawah 50 sampel, tidak ada teknik sampling yang menciptakan informasi. Kembali ke pengumpulan data, libatkan pakar domain, atau beralih ke anomaly detection. SMOTE dari 40 titik = fotokopi dari sedikit bukti — bukan bukti baru.",
      },
      summary: [
        "Imbalance merusak via gradient mayoritas, akurasi menipu, dan threshold 0,5 yang salah.",
        "Urutan kerja: metrik dulu, class weight, threshold tuning, SMOTE terakhir.",
        "Class weight mengubah insentif tanpa merusak data; sampling merusak base rate dan kalibrasi.",
        "SMOTE = interpolasi (bukan informasi baru), hanya di dalam fold latih.",
        "Threshold dari biaya/kapasitas; stratified CV wajib; group k-fold untuk data berkelompok.",
      ],
      next: { label: "A3.8 — Validasi Model", href: "/learn/a38-validasi-model" },
      quiz: [
        {
          q: "Model butuh probabilitas untuk pricing (PD x LGD). Data imbalance 2%. Teknik yang aman?",
          options: [
            { text: "SMOTE 50:50 lalu pakai probabilitasnya langsung", why: "Salah. Base rate berubah, probabilitas bias." },
            { text: "Class weight + threshold tuning — menjaga kalibrasi relatif; hindari sampling yang merusak base rate", why: "Benar. Pisahkan estimasi jujur dari keputusan optimal.", correct: true },
            { text: "Undersampling 50:50", why: "Salah. Sama merusaknya untuk kalibrasi." },
            { text: "Akurasi sebagai metrik", why: "Salah. Bukan metrik yang tepat." },
          ],
        },
        {
          q: "Kenapa stratified CV wajib untuk data imbalance?",
          options: [
            { text: "Agar lebih cepat", why: "Salah. Bukan soal kecepatan." },
            { text: "Tanpa stratifikasi, fold bisa berisi nol sampel positif — metrik jadi NaN/gaduh", why: "Benar. Proporsi kelas harus dijaga tiap fold.", correct: true },
            { text: "Agar akurasi naik", why: "Salah. Bukan itu tujuannya." },
            { text: "Tidak wajib", why: "Salah. Wajib untuk hasil yang stabil." },
          ],
        },
        {
          q: "Minoritas hanya 40 sampel. Klaim SMOTE akan menyelesaikan masalah — tanggapan?",
          options: [
            { text: "Setuju — SMOTE menciptakan data baru", why: "Salah. SMOTE tidak menciptakan informasi." },
            { text: "Tidak — SMOTE hanya interpolasi; dari 40 titik tidak lahir informasi baru. Fokus: data, pakar, anomaly detection", why: "Benar. Tidak ada teknik yang menciptakan informasi dari ketiadaan.", correct: true },
            { text: "Setuju — asal k besar", why: "Salah. k tidak menambah informasi." },
            { text: "Tidak — pakai undersampling saja", why: "Salah. Itu membuang informasi mayoritas." },
          ],
        },
        {
          q: "Class weight 1:32 membuat recall naik tapi precision anjlok ke 8%. Interpretasi?",
          options: [
            { text: "Model rusak", why: "Salah. Ini tradeoff yang diharapkan." },
            { text: "Tradeoff yang diharapkan: pilih bobot/threshold dari biaya bisnis, bukan maksimalkan satu metrik", why: "Benar. Tidak ada bobot benar secara statistik.", correct: true },
            { text: "Bobot harus selalu = rasio imbalance", why: "Salah. Rasio hanya titik awal." },
            { text: "Kembali ke tanpa bobot", why: "Salah. Keputusan dari biaya, bukan dari nostalgia." },
          ],
        },
        {
          q: "Visualisasi menunjukkan titik minoritas berbaur dengan mayoritas (overlap parah), lalu SMOTE 50:50 diterapkan. Apa yang terjadi?",
          options: [
            { text: "Batas keputusan membaik — SMOTE selalu membantu", why: "Salah. SMOTE bukan obat universal." },
            { text: "Interpolasi di wilayah abu-abu menciptakan titik sintetis yang sebenarnya wilayah mayoritas — memperburuk batas. SMOTE hanya untuk gugusan yang jelas", why: "Benar. Cek visualisasi dulu sebelum percaya.", correct: true },
            { text: "Model jadi lebih cepat", why: "Salah. Tidak ada hubungan." },
            { text: "Akurasi pasti naik", why: "Salah. Bisa naik palsu di data resample." },
          ],
        },
        {
          q: "Model butuh probabilitas jujur untuk pricing. Pilih class weight atau SMOTE 50:50?",
          options: [
            { text: "SMOTE 50:50 — data seimbang = probabilitas seimbang", why: "Salah. Itu justru merusak base rate." },
            { text: "Class weight — distribusi data tidak berubah sehingga kalibrasi relatif terjaga; sampling merusak base rate", why: "Benar. Pisahkan estimasi jujur dari keputusan optimal.", correct: true },
            { text: "Keduanya sama saja", why: "Salah. Dampak ke distribusinya beda." },
            { text: "Tidak ada yang cocok", why: "Salah. Class weight cocok untuk kebutuhan ini." },
          ],
        },
        {
          q: "Kapasitas investigasi 5.000 transaksi/bulan, tapi model menandai 50.000. Solusi operasional?",
          options: [
            { text: "Naikkan threshold sampai tepat 5.000 tertandai", why: "Salah arah berpikir — itu tetap threshold probabilitas yang rapuh." },
            { text: "Top-k ranking: tandai 5.000 skor tertinggi sesuai kapasitas. Ini alokasi sumber daya, bukan threshold probabilitas", why: "Benar. Kapasitas menentukan k, bukan sebaliknya.", correct: true },
            { text: "Turunkan kapasitas tim", why: "Salah. Itu bukan solusi statistik." },
            { text: "Abaikan model", why: "Salah. Modelnya berguna; pemakaiannya yang harus disesuaikan." },
          ],
        },
      ],
    },
  ],
};

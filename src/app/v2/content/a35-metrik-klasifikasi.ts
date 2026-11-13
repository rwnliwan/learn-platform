import type { V2Lesson } from "../lib/types";

export const a35: V2Lesson = {
  slug: "a35-metrik-klasifikasi",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.5 Metrik Klasifikasi: Akurasi yang Menipu",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-fraud-97",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Akurasi 97 persen yang tidak menangkap satu pun penipu",
      prose: [
        "Vendor AI mempresentasikan model deteksi fraud ke bank: akurasi 97 persen — angka besar terpampang di slide. Direksi terkesan. Kontrak ditandatangani.",
        "Di minggu pertama produksi, tim fraud sadar ada yang aneh: tidak satu pun transaksi ditandai mencurigakan. Investigasi 10 menit menemukan jawabannya: fraud rate hanya 3 persen. Model yang selalu menjawab bukan fraud otomatis benar 97 persen — tanpa menangkap satu pun penipu. Akurasi 97 persen itu bukan prestasi; itu kemalasan yang dinilai.",
        "Metriknya tidak berbohong — ekspektasi kitalah yang salah. Akurasi menjawab berapa persen tebakan benar, padahal pertanyaan bisnisnya: berapa persen penipu tertangkap, dan berapa nasabah jujur yang terganggu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kontrak vendor ditandatangani berdasar metrik yang salah. Model malas lolos pengadaan karena tidak ada yang menanyakan recall-nya.",
      },
      reference: "Selalu tanya: metrik ini menjawab pertanyaan bisnis yang mana?",
    },
    {
      id: "lab-confusion",
      eyebrow: "Langkah 2 · Lab: confusion matrix",
      title: "Empat kotak kebenaran",
      prose: [
        "Untuk threshold tertentu, setiap prediksi jatuh ke empat kotak: TP (default tertangkap), TN (lancar benar), FP (bagus ditolak — alarm palsu), FN (default lolos — yang paling mahal). Dari sini: precision = TP/(TP+FP) — dari yang ditandai, berapa persen benar; recall = TP/(TP+FN) — dari yang seharusnya tertangkap, berapa persen tertangkap.",
        "Di bawah: 1000 nasabah. Model A selalu memprediksi lancar. Model B model jujur tapi tak sempurna. Hitung akurasi dan recall keduanya — lalu lihat siapa yang sebenarnya berguna.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `accA` dan `recA` model A" },
        { id: "t2", text: "Hitung `recB` model B, lalu `print`" },
      ],
      expected: "accA=79.3% recA=0.0% recB=93.7%",
      note: {
        title: "Sering salah",
        body: "Membandingkan model dengan akurasi di data imbalance. Akurasi mengukur kemalasan di sini — model A 79,3 persen akurat dengan recall nol. Tanya precision dan recall dulu.",
      },
      hints: [
        "Fungsi metrics(y, p) mengembalikan (acc, prec, rec, f1, tp, fp, fn).",
        "Ambil elemen 0 (acc) dan 2 (rec).",
        "accA, _, recA, _, _, _, _ = metrics(y, predA)",
      ],
      code: {
        starter: `import random, math\nrandom.seed(9)\n\nn = 1000\nskor = [random.gauss(0, 1) for _ in range(n)]\ny = [1 if random.random() < 1/(1+math.exp(1.5 + 1.2*s)) else 0 for s in skor]\n\npredA = [0]*n                                            # selalu "lancar"\npredB = [1 if 1/(1+math.exp(1.5+1.2*s)) > 0.10 else 0 for s in skor]\n\ndef metrics(y, p):\n    tp = sum(1 for a,b in zip(y,p) if a==1 and b==1)\n    tn = sum(1 for a,b in zip(y,p) if a==0 and b==0)\n    fp = sum(1 for a,b in zip(y,p) if a==0 and b==1)\n    fn = sum(1 for a,b in zip(y,p) if a==1 and b==0)\n    acc = (tp+tn)/len(y)\n    prec = tp/(tp+fp) if tp+fp else 0\n    rec = tp/(tp+fn) if tp+fn else 0\n    f1 = 2*prec*rec/(prec+rec) if prec+rec else 0\n    return acc, prec, rec, f1, tp, fp, fn\n\n# TULIS KODEMU: akurasi & recall kedua model\naccA, _, recA, _, _, _, _ = \n_, _, recB, _, _, _, _ = \n\nprint(f"accA={accA:.1%} recA={recA:.1%} recB={recB:.1%}")`,
        lockLines: 19,
        solution: `import random, math\nrandom.seed(9)\n\nn = 1000\nskor = [random.gauss(0, 1) for _ in range(n)]\ny = [1 if random.random() < 1/(1+math.exp(1.5 + 1.2*s)) else 0 for s in skor]\n\npredA = [0]*n                                            # selalu "lancar"\npredB = [1 if 1/(1+math.exp(1.5+1.2*s)) > 0.10 else 0 for s in skor]\n\ndef metrics(y, p):\n    tp = sum(1 for a,b in zip(y,p) if a==1 and b==1)\n    tn = sum(1 for a,b in zip(y,p) if a==0 and b==0)\n    fp = sum(1 for a,b in zip(y,p) if a==0 and b==1)\n    fn = sum(1 for a,b in zip(y,p) if a==1 and b==0)\n    acc = (tp+tn)/len(y)\n    prec = tp/(tp+fp) if tp+fp else 0\n    rec = tp/(tp+fn) if tp+fn else 0\n    f1 = 2*prec*rec/(prec+rec) if prec+rec else 0\n    return acc, prec, rec, f1, tp, fp, fn\n\n# TULIS KODEMU: akurasi & recall kedua model\naccA, _, recA, _, _, _, _ = metrics(y, predA)\n_, _, recB, _, _, _, _ = metrics(y, predB)\n\nprint(f"accA={accA:.1%} recA={recA:.1%} recB={recB:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "accA", value: 0.793, tol: 0.005, label: "`accA` sekitar 79.3%", msg: "Model A benar 79,3% — dengan cara tidak pernah menandai." },
          { kind: "equal", task: "t1", name: "recA", value: 0.0, tol: 1e-9, label: "`recA` seharusnya 0%", msg: "TP=0 berarti recall=0 — tidak satu pun default tertangkap." },
          { kind: "equal", task: "t2", name: "recB", value: 0.937, tol: 0.005, label: "`recB` sekitar 93.7%", msg: "Model B menangkap 93,7% default — jauh lebih berguna." },
          { kind: "stdout_matches", task: "t2", pattern: "accA=79\\.3%\\s+recA=0\\.0%\\s+recB=93\\.7%", label: "`print` menampilkan perbandingan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Precision: dari yang ditandai, berapa % benar. Recall: dari target, berapa % tertangkap.",
    },
    {
      id: "lab-auc",
      eyebrow: "Langkah 3 · Lab: AUC",
      title: "Metrik ranking tanpa threshold",
      prose: [
        "Kurva ROC memplot TPR vs FPR untuk semua threshold; AUC = luas di bawahnya. Interpretasi yang tepat: AUC 0,85 berarti jika ambil 1 default dan 1 lancar acak, 85 persen model memberi skor lebih tinggi ke yang default. Bukan persen akurasi, bukan recall.",
        "AUC buta terhadap kalibrasi: kalikan semua probabilitas dengan 0,1 — ranking tak berubah, AUC tetap sama (0,831), padahal probabilitasnya kini bohong — DENGAN ASUMSI probabilitas awalnya sudah terkalibrasi (jujur): bila skor awalnya memang sudah bohong, ×0,1 hanya membuatnya bohong dengan cara lain. Itulah kenapa AUC saja tidak cukup untuk pricing.",
        "Di bawah, hitung AUC model bagus vs model acak dari skor yang sudah disiapkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `auc_good` dan `auc_rand` via `auc_from_scores`" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "auc_good=0.831 auc_rand=0.505",
      note: {
        title: "Sering salah",
        body: "Membaca AUC 0,85 sebagai model 85 persen akurat. AUC = probabilitas ranking benar untuk pasangan acak — bukan akurasi, bukan recall, dan buta kalibrasi.",
      },
      hints: [
        "auc_from_scores(y, s) membandingkan tiap pasangan pos-neg.",
        "Model bagus memakai p_good; model acak memakai p_rand.",
        "auc_good = auc_from_scores(y, p_good)",
      ],
      code: {
        starter: `import random, math\nrandom.seed(21)\n\ndef auc_from_scores(y, s):\n    pos = [sc for a, sc in zip(y, s) if a == 1]\n    neg = [sc for a, sc in zip(y, s) if a == 0]\n    win = tie = 0\n    for p in pos:\n        for q in neg:\n            if p > q: win += 1\n            elif p == q: tie += 1\n    return (win + 0.5*tie)/(len(pos)*len(neg))\n\nn = 2000\ns_good = [random.gauss(0,1) for _ in range(n)]\ny = [1 if random.random() < 1/(1+math.exp(1.0 + 1.5*s)) else 0 for s in s_good]\np_good = [1/(1+math.exp(1.0 + 1.5*s)) for s in s_good]\np_rand = [random.random() for _ in range(n)]\n\n# TULIS KODEMU\nauc_good = \nauc_rand = \n\nprint(f"auc_good={auc_good:.3f} auc_rand={auc_rand:.3f}")`,
        lockLines: 20,
        solution: `import random, math\nrandom.seed(21)\n\ndef auc_from_scores(y, s):\n    pos = [sc for a, sc in zip(y, s) if a == 1]\n    neg = [sc for a, sc in zip(y, s) if a == 0]\n    win = tie = 0\n    for p in pos:\n        for q in neg:\n            if p > q: win += 1\n            elif p == q: tie += 1\n    return (win + 0.5*tie)/(len(pos)*len(neg))\n\nn = 2000\ns_good = [random.gauss(0,1) for _ in range(n)]\ny = [1 if random.random() < 1/(1+math.exp(1.0 + 1.5*s)) else 0 for s in s_good]\np_good = [1/(1+math.exp(1.0 + 1.5*s)) for s in s_good]\np_rand = [random.random() for _ in range(n)]\n\n# TULIS KODEMU\nauc_good = auc_from_scores(y, p_good)\nauc_rand = auc_from_scores(y, p_rand)\n\nprint(f"auc_good={auc_good:.3f} auc_rand={auc_rand:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "auc_good", value: 0.831, tol: 0.01, label: "`auc_good` sekitar 0.831", msg: "Model bagus me-ranking dengan benar 83% pasangan." },
          { kind: "equal", task: "t1", name: "auc_rand", value: 0.505, tol: 0.02, label: "`auc_rand` sekitar 0.5", msg: "Model acak = 0,5 — tidak lebih baik dari koin." },
          { kind: "stdout_matches", task: "t2", pattern: "auc_good=0\\.831\\s+auc_rand=0\\.50", label: "`print` menampilkan kedua AUC", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "AUC = P(skor+ > skor-). Buta kalibrasi: ranking sama, angka bisa bohong.",
    },
    {
      id: "ks-pr",
      eyebrow: "Langkah 4 · KS & PR-AUC",
      title: "Daya pisah dan imbalance ekstrem",
      prose: [
        "KS (Kolmogorov-Smirnov) = jarak vertikal maksimum antara kurva kumulatif bad vs good — daya pisah model dalam poin. KS 0,42 berarti ada threshold di mana selisih kumulatifnya mencapai 42 poin. Titik maksimumnya juga kandidat threshold natural. (Gini = 2 x AUC - 1 — bukan KS.)",
        "Untuk kelas positif yang sangat langka, ROC-AUC bisa terlihat bagus sementara precision operasional jeblok: FPR = FP/(FP+TN) — dengan TN raksasa, FP besar pun terlihat kecil. Kurva PR (precision-recall) langsung menunjukkan precision — tidak bisa bersembunyi di balik base rate. Baseline PR-AUC = base rate, bukan 0,5.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Bangga dengan ROC-AUC 0,9 di fraud rate 0,1 persen tanpa melihat kurva PR. TN raksasa mengecilkan FPR — precision operasionalnya bisa jauh lebih buruk dari yang disangka AUC.",
      },
      reference: "KS = daya pisah (poin). PR-AUC untuk langka; baseline = base rate.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Fraud rate 0,5%. Model selalu prediksi bukan fraud: akurasi 99,5%. Penilaian tepat?",
          options: [
            { text: "Model sangat bagus", why: "Salah. Akurasinya mengukur kemalasan." },
            { text: "Akurasi menipu — recall 0%, tidak menangkap satu pun fraud. Pakai precision/recall atau PR-AUC", why: "Benar. TP=0 berarti recall=0.", correct: true },
            { text: "Model perlu lebih banyak data", why: "Salah. Masalahnya metrik, bukan data." },
            { text: "Naikkan threshold", why: "Salah. Model tidak pernah menandai apa pun." },
          ],
        },
        {
          q: "AUC = 0,85. Interpretasi yang tepat?",
          options: [
            { text: "Model 85% akurat", why: "Salah. AUC bukan akurasi." },
            { text: "Jika ambil 1 default dan 1 lancar acak, 85% model memberi skor lebih tinggi ke yang default", why: "Benar. AUC = P(skor+ > skor-) — probabilitas ranking benar.", correct: true },
            { text: "85% probabilitas prediksi benar", why: "Salah. Itu bukan arti AUC." },
            { text: "Model menangkap 85% default", why: "Salah. Itu recall, bukan AUC." },
          ],
        },
      ],
      reference: "Akurasi di imbalance = kemalasan dinilai. AUC = ranking, bukan akurasi.",
    },
    {
      id: "mini-case-threshold",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Memilih threshold penolakan kredit",
      prose: [
        "Model PD KTA: AUC 0,82, kalibrasi baik. Kamu harus menetapkan threshold penolakan. Data validasi (10.000 pengajuan, base rate 8 persen). Threshold 5 persen: TP=680, FP=2.760, FN=120 — precision 19,8 persen, recall 85 persen. Threshold 15 persen: TP=480, FP=920, FN=320 — precision 34,3 persen, recall 60 persen. Biaya: tiap FN (default lolos) = Rp15 jt; tiap FP (bagus ditolak) = Rp1,5 jt.",
        "Expected cost threshold 5 persen: 120 x 15 + 2.760 x 1,5 = 1.800 + 4.140 = Rp5.940 jt. Threshold 15 persen: 320 x 15 + 920 x 1,5 = 4.800 + 1.380 = Rp6.180 jt. Pilih threshold 5 persen — lebih murah Rp240 jt meski menolak lebih banyak orang. Intuisi: FN 10x lebih mahal dari FP, jadi kita toleran terhadap alarm palsu.",
        "Peran AUC di keputusan ini: tidak ada. AUC hanya bilang model bisa me-ranking — threshold dipilih dari biaya, bukan dari metrik ranking. Pelajaran terbesar: metrik evaluasi bukan aturan keputusan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Threshold dari default 0,5 atau dari AUC — bukan dari biaya — berarti menolak keputusan bisnis yang seharusnya dihitung. Selisih Rp240 jt adalah harga metrik yang salah.",
      },
      reference: "Threshold = argmin expected cost. AUC tidak memilih threshold.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Metrik untuk pertanyaan yang benar",
      prose: [
        "Satu, seberapa baik model me-ranking (tanpa threshold): ROC-AUC. Dua, kelas positif sangat langka: PR-AUC — baseline-nya base rate, bukan 0,5. Tiga, butuh probabilitas jujur untuk pricing atau cadangan: Brier score / kalibrasi — AUC buta terhadap ini.",
        "Empat, memilih titik operasi: expected cost dari precision/recall di threshold kandidat — bukan dari AUC, bukan dari akurasi. Lima, daya pisah dalam poin: KS — titik maksimumnya kandidat threshold natural.",
        "Aturan 10 detik: ranking -> AUC; langka -> PR-AUC; angka jujur -> Brier; threshold -> expected cost; daya pisah -> KS. Metrik evaluasi bukan aturan keputusan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: metrik adalah lensa, bukan kebenaran",
        body: "Metrik adalah lensa — setiap lensa mempertajam satu hal dan mengaburkan yang lain. Tiga heuristik. Pertama: bila metrikmu membaik tapi keputusan bisnisnya tidak berubah, kamu sedang mengoptimasi lensa yang salah. Metrik yang baik mengubah keputusan; sisanya dekorasi dashboard. Kedua: jangan pernah percaya satu angka agregat sendirian. AUC 0,9 bisa menyembunyikan precision 5 persen di wilayah operasimu — selalu lihat kurvanya (ROC, PR, kalibrasi), karena kurva menunjukkan DI MANA modelmu kuat dan di mana ia rapuh. Ketiga: uji stres metrikmu — bagaimana ia berperilaku bila base rate berubah 2x lipat, atau bila biaya false negative naik 10x? Metrik yang runtuh saat kondisi berubah bukan metrik untuk keputusan jangka panjang. Aturan praktis untuk presentasi ke direksi: bawa tiga lensa minimum — satu untuk ranking (AUC), satu untuk kejujuran angka (kalibrasi/Brier), satu untuk keputusan (expected cost). Bila ketiganya bercerita sama, keputusanmu kokoh; bila bertentangan, itulah diskusi yang paling berharga.",
      },
      reference: "AUC ranking. PR-AUC langka. Brier angka. Cost threshold. KS daya pisah.",
    },
    {
      id: "pendalaman-mcc-biaya",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "MCC & threshold dari biaya: menutup lingkaran",
      prose: [
        "Ada satu metrik agregat yang lebih jujur dari F1 di data imbalance: MCC (Matthews correlation coefficient) — korelasi antara prediksi dan aktual, memakai keempat sel confusion matrix. F1 mengabaikan TN sepenuhnya; di fraud rate 0,1 persen, TN raksasa yang diabaikan F1 justru menentukan biaya operasional. MCC = 0 berarti tidak lebih baik dari acak; MCC = 1 sempurna; MCC negatif berarti lebih buruk dari acak. Aturan praktis: bila bingung memilih satu angka tunggal di data imbalance, MCC menipu lebih jarang daripada F1 atau akurasi.",
        "Tapi metrik evaluasi bukan aturan keputusan. Jembatan antara keduanya adalah biaya — DENGAN ASUMSI: probabilitas input terkalibrasi, biaya C_FP dan C_FN konstan dan diketahui, dan keputusan meminimalkan expected cost satu periode (tanpa biaya investigasi lanjutan atau efek berantai). Di bawah asumsi itu: klasifikasikan positif bila P(y=1|x) > C_FP/(C_FP + C_FN). Logikanya: prediksi positif layak bila expected cost-nya lebih kecil — p x C_FN > (1-p) x C_FP, selesaikan untuk p. Dengan C_FN = 10x C_FP (default lolos 10x lebih mahal dari menolak nasabah bagus), threshold = 1/11 = 0,09 — bukan 0,5. Threshold 0,5 diam-diam mengasumsikan biaya simetris dan base rate 50:50 — dua hal yang salah di hampir semua kasus risiko.",
        "Rumus ini punya satu syarat keras: probabilitas input harus TERKALIBRASI. Threshold optimal dari probabilitas yang bohong = keputusan yang bohong secara optimal. Urutan kerja yang benar: latih model untuk ranking, kalibrasi ulang untuk angka yang jujur, baru terapkan aturan biaya. Membalik urutan — threshold dari probabilitas mentah boosting yang overconfident — menghasilkan keputusan yang presisi tapi salah.",
        "Biaya jarang diketahui pasti. Praktik senior: uji sensitivitas — hitung threshold dan expected cost untuk rasio biaya 5x, 10x, 20x. Bila keputusan (threshold 0,09 vs 0,05) tidak mengubah tindakan operasional secara material, estimasi kasar cukup. Bila mengubah, itulah angka yang harus didiskusikan dengan bisnis — bukan disembunyikan di balik default 0,5.",
      ],
      formula: String.raw`t^* = \frac{C_{FP}}{C_{FP} + C_{FN}}`,
      formulaNote: "t* = threshold optimal; C_FP = biaya false positive (menolak nasabah bagus / investigasi sia-sia); C_FN = biaya false negative (default atau fraud lolos). Contoh: C_FN = 10xC_FP → t* = 1/11 ≈ 0,09. Syarat: probabilitas input harus terkalibrasi.",
      tasks: [],
      reference: "MCC untuk satu angka yang jujur. Threshold dari biaya, bukan dari 0,5. Kalibrasi dulu, baru putuskan.",
    },
    {
      id: "gap-g15-metrik-prevalensi-biaya",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G15)",
      title: "Metrik yang bergerak: prevalensi dan biaya mengubah segalanya kecuali ranking",
      prose: [
        "Model yang sama, metrik yang berbeda — hanya karena populasinya berubah. Ambil model dengan sensitivitas 80% dan spesifisitas 90%, diuji pada 1.000 orang. Pada prevalensi 5% (50 sakit, 950 sehat): TP 40, FN 10, FP 95, TN 855. Presisi = 40 / 135 = 29,6% — dari tiap 10 alarm, 7 salah. Akurasi = 89,5%. Sekarang prevalensi naik ke 20% (200 sakit, 800 sehat), model TIDAK berubah: TP 160, FN 40, FP 80, TN 720. Presisi melonjak ke 160 / 240 = 66,7%, akurasi turun tipis ke 88,0%. Sensitivitas dan spesifisitas tetap 80% dan 90% — mereka sifat model. Presisi dan akurasi sifat POPULASI.",
        "Inilah jebakan deployment: model yang presisinya 66,7% di rumah sakit rujukan (prevalensi tinggi) bisa jatuh ke 29,6% saat dipakai skrining massal (prevalensi rendah) — tanpa satu baris kode pun berubah. AUC tidak bergerak karena ia hanya peduli ranking, bukan prevalensi. Karena itu laporan model wajib menulis prevalensi validasi di samping presisi — presisi tanpa prevalensi adalah angka tanpa konteks.",
        "Sisi kedua: biaya. Threshold optimal bukan 0,5 — ia ditentukan rasio biaya: threshold naik bila false positive mahal, turun bila false negative mahal. Bila biaya FN sepuluh kali FP (misal kanker terlewat vs biopsi tambahan), threshold optimal bergeser jauh ke bawah dan presisi sengaja dikorbankan demi recall. Rumus keputusan: klasifikasikan positif bila P × biaya-FN lebih besar dari (1 − P) × biaya-FP. Dan ingat langkah sebelumnya: rumus ini hanya jujur bila probabilitasnya terkalibrasi — kalibrasi dulu, baru terapkan aturan biaya.",
      ],
      formula: String.raw`\text{Presisi} = \frac{TP}{TP+FP} \qquad \text{positif bila } P \times C_{FN} > (1-P) \times C_{FP}`,
      formulaNote: "Prevalensi 5% → presisi 29,6%; prevalensi 20% → presisi 66,7%. Model sama, populasi beda.",
      tasks: [
        { id: "t1", text: "Hitung `presisi_5` (prevalensi 5%) dan `presisi_20` (prevalensi 20%)" },
        { id: "t2", text: "Hitung `akurasi_5` dan `akurasi_20` pada 1.000 orang" },
      ],
      expected: "presisi_5=0.296  presisi_20=0.667  akurasi_5=0.895  akurasi_20=0.880",
      hints: [
        "Sensitivitas 80%: TP = 0,8 × jumlah sakit. Spesifisitas 90%: FP = 0,1 × jumlah sehat.",
        "Prevalensi 5%: 50 sakit, 950 sehat. Prevalensi 20%: 200 sakit, 800 sehat.",
        "Presisi = TP/(TP+FP); akurasi = (TP+TN)/1000. Bulatkan 3 desimal di print.",
      ],
      code: {
        starter: `# Model sama (sens 80%, spes 90%), populasi berbeda. N = 1000.\n\ndef metrik(prev):\n    sakit = prev * 1000\n    sehat = 1000 - sakit\n    tp = 0.8 * sakit\n    fn = 0.2 * sakit\n    fp = 0.1 * sehat\n    tn = 0.9 * sehat\n    return tp / (tp + fp), (tp + tn) / 1000\n\n# TULIS KODEMU: presisi dan akurasi di dua prevalensi.\npresisi_5, akurasi_5 = \npresisi_20, akurasi_20 = \n\nprint(f"presisi_5={presisi_5:.3f}  presisi_20={presisi_20:.3f}  akurasi_5={akurasi_5:.3f}  akurasi_20={akurasi_20:.3f}")`,
        lockLines: 9,
        solution: `# Model sama (sens 80%, spes 90%), populasi berbeda. N = 1000.\n\ndef metrik(prev):\n    sakit = prev * 1000\n    sehat = 1000 - sakit\n    tp = 0.8 * sakit\n    fn = 0.2 * sakit\n    fp = 0.1 * sehat\n    tn = 0.9 * sehat\n    return tp / (tp + fp), (tp + tn) / 1000\n\n# TULIS KODEMU: presisi dan akurasi di dua prevalensi.\npresisi_5, akurasi_5 = metrik(0.05)\npresisi_20, akurasi_20 = metrik(0.20)\n\nprint(f"presisi_5={presisi_5:.3f}  presisi_20={presisi_20:.3f}  akurasi_5={akurasi_5:.3f}  akurasi_20={akurasi_20:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "presisi_5", value: 0.296, tol: 0.001, label: "`presisi_5` = 29,6%", msg: "40/(40+95) = 29,6% — 7 dari 10 alarm salah pada prevalensi rendah." },
          { kind: "equal", task: "t1", name: "presisi_20", value: 0.667, tol: 0.001, label: "`presisi_20` = 66,7%", msg: "160/(160+80) = 66,7% — model sama, populasi beda." },
          { kind: "equal", task: "t2", name: "akurasi_5", value: 0.895, tol: 0.001, label: "`akurasi_5` = 89,5%", msg: "(40+855)/1000 = 89,5%." },
          { kind: "equal", task: "t2", name: "akurasi_20", value: 0.88, tol: 0.001, label: "`akurasi_20` = 88,0%", msg: "(160+720)/1000 = 88,0% — akurasi TURUN walau presisi naik." },
          { kind: "stdout_matches", task: "t2", pattern: "presisi_5=0.296\\s+presisi_20=0.667\\s+akurasi_5=0.895\\s+akurasi_20=0.880", label: "`print` menampilkan keempat metrik", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Model presisi 66,7% di rumah sakit rujukan dipakai untuk skrining massal (prevalensi jauh lebih rendah). Apa yang terjadi?",
          options: [
            { text: "Presisi jatuh tajam — presisi sifat populasi, bukan hanya sifat model", why: "Tepat: pada prevalensi 5%, presisi model yang sama hanya 29,6%.", correct: true },
            { text: "Tidak ada yang berubah — presisi adalah sifat model", why: "Salah: sensitivitas/spesifisitas sifat model; presisi/akurasi ikut prevalensi." },
            { text: "AUC ikut jatuh sama tajamnya", why: "Salah: AUC hanya peduli ranking dan tidak bergantung prevalensi." },
            { text: "Threshold harus dinaikkan agar presisi kembali 66,7%", why: "Salah: menaikkan threshold menaikkan presisi dengan mengorbankan recall — itu keputusan biaya, bukan perbaikan model." },
          ],
        },
      ],
      reference: "Sensitivitas/spesifisitas/AUC = sifat model. Presisi/akurasi = sifat populasi (ikut prevalensi). Threshold optimal ikut rasio biaya FN vs FP.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Akurasi menipu di data imbalance — tanya precision dan recall dulu.",
        "AUC = probabilitas ranking benar untuk pasangan acak; bukan akurasi, bukan recall, buta kalibrasi.",
        "KS = daya pisah (poin); Gini = 2xAUC-1. PR-AUC untuk kelas langka.",
        "Threshold dipilih dari expected cost, bukan dari AUC atau akurasi.",
        "Untuk ECL/pricing: butuh probabilitas terkalibrasi, bukan cuma ranking bagus (Brier rendah mendukung kualitas probabilistik; kalibrasi dicek via reliability diagram).",
      ],
      next: { label: "A3.6 — Kalibrasi", href: "/v2/learn/a36-kalibrasi" },
      quiz: [
        {
          q: "Semua probabilitas model dikali 0,1 (jadi jauh kekecilan). Apa yang terjadi dengan AUC dan Brier?",
          options: [
            { text: "Keduanya tetap", why: "Salah. Brier menghukum probabilitas bohong." },
            { text: "AUC tetap (ranking tak berubah), Brier memburuk (probabilitas jadi tidak jujur)", why: "Benar. Transformasi monotonik tidak mengubah urutan.", correct: true },
            { text: "AUC memburuk, Brier tetap", why: "Salah. Arahnya terbalik." },
            { text: "Keduanya membaik", why: "Salah. Tidak ada yang membaik." },
          ],
        },
        {
          q: "KS = 0,42. Artinya?",
          options: [
            { text: "Akurasi 42%", why: "Salah. KS bukan akurasi." },
            { text: "Ada threshold di mana selisih kumulatif bad vs good mencapai 42 poin — daya pisah model", why: "Benar. Titik maksimumnya kandidat threshold natural.", correct: true },
            { text: "42% default tertangkap", why: "Salah. Itu recall." },
            { text: "Gini = 0,42", why: "Salah. Gini = 2xAUC-1, bukan KS." },
          ],
        },
        {
          q: "Kapan PR-AUC lebih informatif daripada ROC-AUC?",
          options: [
            { text: "Selalu", why: "Salah. Di data seimbang ROC-AUC cukup." },
            { text: "Saat kelas positif sangat langka — TN raksasa mengecilkan FPR sehingga ROC terlihat bagus", why: "Benar. Kurva PR tidak bisa bersembunyi di balik base rate.", correct: true },
            { text: "Saat data seimbang", why: "Salah. Di situlah ROC-AUC baik-baik saja." },
            { text: "Tidak pernah", why: "Salah. Justru untuk kasus langka ia penting." },
          ],
        },
        {
          q: "Model A: AUC 0,88, Brier 0,20. Model B: AUC 0,84, Brier 0,09. Untuk perhitungan cadangan kerugian (ECL), pilih?",
          options: [
            { text: "Model A — AUC lebih tinggi", why: "Salah. ECL butuh probabilitas jujur, bukan ranking." },
            { text: "Model B — cadangan butuh probabilitas yang jujur; Brier mengukurnya", why: "Benar. ECL = PD x LGD x EAD — PD bohong = rupiah salah.", correct: true },
            { text: "Rata-ratakan keduanya", why: "Salah. Ensemble tidak menjawab kebutuhan kalibrasi." },
            { text: "Tolak keduanya", why: "Salah. Model B cukup baik untuk kebutuhan ini." },
          ],
        },
        {
          q: "F1 = 0,92 di data fraud 0,1% terlihat hebat, tapi tim operasional kecewa. Mengapa MCC bisa lebih jujur di sini?",
          options: [
            { text: "MCC selalu lebih tinggi dari F1", why: "Salah. Tidak ada hubungan seperti itu." },
            { text: "F1 mengabaikan TN sepenuhnya — padahal di base rate ekstrem, TN raksasa menentukan biaya. MCC memakai keempat sel", why: "Benar. Satu angka yang memakai seluruh confusion matrix menipu lebih jarang.", correct: true },
            { text: "MCC tidak butuh threshold", why: "Salah. Keduanya dihitung pada threshold tertentu." },
            { text: "F1 tidak bisa dihitung di imbalance", why: "Salah. F1 bisa dihitung; masalahnya ia menipu." },
          ],
        },
        {
          q: "Biaya miss (FN) 20x biaya alarm palsu (FP). Threshold optimal?",
          options: [
            { text: "0,5 — default standar", why: "Salah. 0,5 mengasumsikan biaya simetris." },
            { text: "t* = 1/(1+20) ≈ 0,048 — miss yang sangat mahal berarti threshold sangat rendah: toleran alarm palsu", why: "Benar. Rumus t* = C_FP/(C_FP + C_FN).", correct: true },
            { text: "0,95 — harus yakin dulu", why: "Salah. Arahnya terbalik: miss mahal = threshold rendah." },
            { text: "Tidak bisa dihitung tanpa AUC", why: "Salah. Rumus threshold butuh biaya, bukan AUC." },
          ],
        },
        {
          q: "Threshold dihitung dari rumus biaya memakai probabilitas mentah model yang belum dikalibrasi. Risikonya?",
          options: [
            { text: "Tidak ada — rumus biaya memperbaiki segalanya", why: "Salah. Rumus tidak memperbaiki input yang bohong." },
            { text: "Keputusan yang bohong secara optimal: threshold presisi dari angka yang tidak jujur. Kalibrasi dulu, baru terapkan aturan biaya", why: "Benar. Urutan: ranking, kalibrasi, keputusan.", correct: true },
            { text: "AUC akan turun", why: "Salah. Threshold tidak mengubah AUC (ranking)." },
            { text: "Model jadi overfit", why: "Salah. Ini soal kalibrasi, bukan overfit." },
          ],
        },
      ],
    },
  ],
};

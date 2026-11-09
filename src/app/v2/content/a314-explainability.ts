import type { V2Lesson } from "../lib/types";

export const a314: V2Lesson = {
  slug: "a314-explainability",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.14 Explainability & Fairness: Membuka Kotak Hitam",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-apple-card",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Komputer bilang tidak",
      prose: [
        "2019, Apple Card diluncurkan. Tak lama keluhan meledak: seorang programmer mendapat limit 20 kali lebih kecil dari istrinya — padahal mereka berbagi rekening, aset, dan riwayat kredit yang lebih buruk darinya. Algoritma seksis, tuduhnya. Regulator New York membuka investigasi.",
        "Goldman Sachs bersikeras: model tidak memakai gender sebagai variabel. Dan itu mungkin benar — tapi tidak cukup. Model bisa mempelajari proksi: pola belanja, nama depan, kode pos yang berkorelasi dengan gender. Menghapus kolom gender tidak menghapus informasi gender dari 100 variabel lain yang saling berkaitan.",
        "Investigasi 2 tahun akhirnya tidak menemukan diskriminasi ilegal — tapi kerusakan reputasi sudah terjadi. Pelajarannya permanen: kami tidak memakai variabel sensitif bukan pertahanan. Yang dibutuhkan: pengujian fairness yang sistematis plus kemampuan menjelaskan tiap keputusan individual.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Fraud/ML Analytics, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko reputasi dan hukum model tidak ditentukan oleh niat pembuatnya, melainkan oleh dampak yang bisa diukur. Tanpa audit fairness, kamu tidak tahu apa yang akan ditemukan regulator duluan.",
      },
      reference: "Fairness through unawareness gagal: proksi membawa informasi sensitif via korelasi.",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Taksonomi",
      title: "Global vs lokal, intrinsik vs post-hoc",
      prose: [
        "Penjelasan global menjawab model ini bekerja bagaimana secara umum (misal: DPD adalah pendorong utama). Penjelasan lokal menjawab kenapa nasabah X ditolak (misal: tunggakan 12 bulan menaikkan risikonya 0,56 logit). Keduanya dibutuhkan: global untuk validasi, lokal untuk keputusan individual dan keberatan nasabah.",
        "Model intrinsik interpretable dari sananya: regresi logistik, scorecard, pohon kecil — koefisiennya langsung bisa dibaca. Post-hoc menjelaskan model kotak hitam setelah jadi: SHAP, LIME. Hierarki kejujuran: intrinsik lebih baik dari SHAP, SHAP lebih baik dari LIME.",
        "Aturan praktis: jika selisih akurasi kecil (di bawah 1-2 poin AUC), pilih model intrinsik. Interpretabilitas adalah aset regulasi; kompleksitas harus membayar dirinya — bukan cuma di metrik, tapi juga di risiko penjelasan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira penjelasan post-hoc sama jujurnya dengan model intrinsik. SHAP adalah aproksimasi penjelasan model — ia menjelaskan prediksi model, bukan kausalitas di dunia nyata.",
      },
      reference: "Intrinsik > SHAP > LIME. Selisih AUC kecil -> pilih yang interpretable.",
    },
    {
      id: "lab-shap",
      eyebrow: "Langkah 3 · Lab: SHAP",
      title: "Shapley value dari nol",
      prose: [
        "SHAP membagi selisih prediksi dari baseline ke tiap fitur secara adil memakai Shapley value: rata-rata kontribusi marginal di semua urutan koalisi. Untuk model linear ada rumus tertutup yang elegan: phi = beta x (x - rata-rata populasi).",
        "Sifat kunci efficiency: jumlah semua kontribusi = selisih prediksi dari baseline — tidak ada yang hilang atau ganda. Inilah fondasi kepercayaan SHAP: penjelasannya menjumlah dengan tepat ke prediksi model. Tapi ingat: ia menjelaskan model, bukan dunia.",
        "Di bawah: model logit PD dengan baseline populasi. Nasabah X: skor buruk (-1,5), ada tunggakan (1), util tinggi (0,9). Hitung kontribusi tiap fitur dalam logit dan verifikasi efficiency.",
      ],
      formula: String.raw`\phi_j = \beta_j \cdot (x_j - E[x_j]), \qquad \sum_j \phi_j = f(x) - E[f(x)]`,
      formulaNote: "phi_j = kontribusi fitur j (dalam logit); beta_j = koefisien model; E[x_j] = rata-rata populasi (baseline). Jumlah semua phi = selisih prediksi nasabah dari prediksi baseline — sifat efficiency. Rumus tertutup ini eksak untuk model linear; untuk model nonlinear SHAP memakai aproksimasi (KernelSHAP/TreeSHAP).",
      tasks: [
        { id: "t1", text: "Hitung `phi_skor`, `phi_tunggakan`, `phi_util`" },
        { id: "t2", text: "Hitung `total` dan verifikasi `cek` = z_x - z_base" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "phi=1.800,0.560,0.200 total=2.560 cek=2.560",
      note: {
        title: "Sering salah",
        body: "Menulis faktor penyebab di laporan berdasar SHAP. SHAP besar untuk kode pos tidak berarti kode pos menyebabkan default — bisa jadi proksi kemiskinan wilayah. Tulis faktor pendorong prediksi model, bukan faktor penyebab. Beda satu kata, beda tanggung jawab hukum.",
      },
      hints: [
        "phi = beta[k] * (nasabah[k] - mean_x[k]) untuk tiap fitur.",
        "total = jumlah ketiga phi. cek = z_x - z_base.",
        "phi_skor = beta['skor']*(nasabah['skor']-mean_x['skor'])",
      ],
      code: {
        starter: `import math\n\n# Model PD (logit): logit = -2.0 - 1.2*skor + 0.8*tunggakan + 0.5*util\nbeta = {"skor": -1.2, "tunggakan": 0.8, "util": 0.5}\nb0 = -2.0\nmean_x = {"skor": 0.0, "tunggakan": 0.3, "util": 0.5}   # baseline populasi\nnasabah = {"skor": -1.5, "tunggakan": 1, "util": 0.9}    # nasabah X\n\nz_base = b0 + sum(beta[k]*mean_x[k] for k in beta)\nz_x = b0 + sum(beta[k]*nasabah[k] for k in beta)\n\n# TULIS KODEMU: kontribusi SHAP tiap fitur (ruang logit)\nphi_skor = \nphi_tunggakan = \nphi_util = \ntotal = \ncek = \n\nprint(f"phi={phi_skor:.3f},{phi_tunggakan:.3f},{phi_util:.3f} total={total:.3f} cek={cek:.3f}")`,
        lockLines: 10,
        solution: `import math\n\n# Model PD (logit): logit = -2.0 - 1.2*skor + 0.8*tunggakan + 0.5*util\nbeta = {"skor": -1.2, "tunggakan": 0.8, "util": 0.5}\nb0 = -2.0\nmean_x = {"skor": 0.0, "tunggakan": 0.3, "util": 0.5}   # baseline populasi\nnasabah = {"skor": -1.5, "tunggakan": 1, "util": 0.9}    # nasabah X\n\nz_base = b0 + sum(beta[k]*mean_x[k] for k in beta)\nz_x = b0 + sum(beta[k]*nasabah[k] for k in beta)\n\n# TULIS KODEMU: kontribusi SHAP tiap fitur (ruang logit)\nphi_skor = beta["skor"]*(nasabah["skor"]-mean_x["skor"])\nphi_tunggakan = beta["tunggakan"]*(nasabah["tunggakan"]-mean_x["tunggakan"])\nphi_util = beta["util"]*(nasabah["util"]-mean_x["util"])\ntotal = phi_skor + phi_tunggakan + phi_util\ncek = z_x - z_base\n\nprint(f"phi={phi_skor:.3f},{phi_tunggakan:.3f},{phi_util:.3f} total={total:.3f} cek={cek:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "phi_skor", value: 1.8, tol: 0.01, label: "`phi_skor` seharusnya 1.8", msg: "-1,2 x (-1,5 - 0,0) = 1,8. Skor buruk menaikkan risiko." },
          { kind: "equal", task: "t1", name: "phi_tunggakan", value: 0.56, tol: 0.01, label: "`phi_tunggakan` seharusnya 0.56", msg: "0,8 x (1 - 0,3) = 0,56." },
          { kind: "equal", task: "t1", name: "phi_util", value: 0.2, tol: 0.01, label: "`phi_util` seharusnya 0.2", msg: "0,5 x (0,9 - 0,5) = 0,2." },
          { kind: "equal", task: "t2", name: "total", value: 2.56, tol: 0.01, label: "`total` seharusnya 2.56", msg: "Jumlahkan ketiga phi — efficiency: harus sama dengan cek." },
          { kind: "stdout_matches", task: "t3", pattern: "phi=1\\.800,0\\.560,0\\.200\\s+total=2\\.560\\s+cek=2\\.560", label: "`print` menampilkan kontribusi + verifikasi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Efficiency: jumlah SHAP = selisih dari baseline. Berlaku lokal per nasabah.",
    },
    {
      id: "lab-fairness",
      eyebrow: "Langkah 4 · Lab: metrik fairness",
      title: "Tiga definisi keadilan yang bertengkar",
      prose: [
        "Tiga definisi fairness yang umum: demographic parity — tingkat keputusan sama antar grup; equal opportunity — TPR (recall) sama antar grup; sufficiency — kalibrasi/precision sama antar grup (skor berarti hal yang sama di tiap grup).",
        "Impossibility theorem: ketiganya tidak bisa dipenuhi bersamaan kecuali kasus khusus. Model bisa terkalibrasi sempurna per grup (sufficiency terpenuhi) tapi tingkat penolakan grup B 2 kali grup A (parity dilanggar). Memilih definisi adalah keputusan nilai dan hukum, bukan statistik.",
        "Di bawah: dua grup dengan default aktual sama (8 persen), tapi model curiga ke grup B. Hitung tingkat penolakan tiap grup dan gap-nya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rA` dan `rB` = tingkat penolakan tiap grup" },
        { id: "t2", text: "Hitung `gap` = rB - rA, lalu `print`" },
      ],
      expected: "tolakA=35.4% tolakB=56.8% gap=21.4%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Gap 21,4 poin dengan risiko aktual yang sama adalah disparate impact yang nyata — terlepas dari niat. Di banyak yurisdiksi, proksi dihitung sebagai diskriminasi tidak langsung.",
      },
      hints: [
        "Fungsi metrics(y, s) sudah mengembalikan (tingkat_tolak, tpr, fpr, precision).",
        "Ambil elemen pertama dari tiap hasil.",
        "rA, _, _, _ = metrics(yA, sA)",
      ],
      code: {
        starter: `import random\nrandom.seed(122)\n\ndef gen(n, base, bias_skor):\n    y = [1 if random.random() < base else 0 for _ in range(n)]\n    s = [random.gauss(0.5 if yi else -0.5, 1) + bias_skor for yi in y]\n    return y, s\n\nyA, sA = gen(2000, 0.08, 0.0)\nyB, sB = gen(2000, 0.08, 0.6)   # model 'curiga' ke grup B\n\ndef metrics(y, s, thr=0.0):\n    p = [1 if v > thr else 0 for v in s]\n    tp = sum(1 for a, b in zip(y, p) if a == 1 and b == 1)\n    fp = sum(1 for a, b in zip(y, p) if a == 0 and b == 1)\n    fn = sum(1 for a, b in zip(y, p) if a == 1 and b == 0)\n    tn = sum(1 for a, b in zip(y, p) if a == 0 and b == 0)\n    return (tp+fp)/len(y), tp/(tp+fn), fp/(fp+tn), tp/(tp+fp)\n\n# TULIS KODEMU: tingkat penolakan tiap grup + gap demographic parity\nrA = \nrB = \ngap = \n\nprint(f"tolakA={rA:.1%} tolakB={rB:.1%} gap={gap:.1%}")`,
        lockLines: 20,
        solution: `import random\nrandom.seed(122)\n\ndef gen(n, base, bias_skor):\n    y = [1 if random.random() < base else 0 for _ in range(n)]\n    s = [random.gauss(0.5 if yi else -0.5, 1) + bias_skor for yi in y]\n    return y, s\n\nyA, sA = gen(2000, 0.08, 0.0)\nyB, sB = gen(2000, 0.08, 0.6)   # model 'curiga' ke grup B\n\ndef metrics(y, s, thr=0.0):\n    p = [1 if v > thr else 0 for v in s]\n    tp = sum(1 for a, b in zip(y, p) if a == 1 and b == 1)\n    fp = sum(1 for a, b in zip(y, p) if a == 0 and b == 1)\n    fn = sum(1 for a, b in zip(y, p) if a == 1 and b == 0)\n    tn = sum(1 for a, b in zip(y, p) if a == 0 and b == 0)\n    return (tp+fp)/len(y), tp/(tp+fn), fp/(fp+tn), tp/(tp+fp)\n\n# TULIS KODEMU: tingkat penolakan tiap grup + gap demographic parity\nrA, _, _, _ = metrics(yA, sA)\nrB, _, _, _ = metrics(yB, sB)\ngap = rB - rA\n\nprint(f"tolakA={rA:.1%} tolakB={rB:.1%} gap={gap:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rA", value: 0.354, tol: 0.008, label: "`rA` sekitar 35.4%", msg: "Tingkat penolakan grup A = elemen pertama metrics(yA, sA)." },
          { kind: "equal", task: "t1", name: "rB", value: 0.568, tol: 0.008, label: "`rB` sekitar 56.8%", msg: "Tingkat penolakan grup B = elemen pertama metrics(yB, sB)." },
          { kind: "equal", task: "t2", name: "gap", value: 0.214, tol: 0.01, label: "`gap` sekitar 21.4%", msg: "gap = rB - rA. Risiko aktual sama, penolakan beda jauh." },
          { kind: "stdout_matches", task: "t2", pattern: "tolakA=35\\.4%\\s+tolakB=56\\.8%\\s+gap=21\\.4%", label: "`print` menampilkan gap parity", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Parity: tingkat keputusan sama. Equal opportunity: TPR sama. Sufficiency: kalibrasi sama.",
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
          q: "Model kami adil karena tidak memakai gender sebagai variabel. Kelemahan argumen ini?",
          options: [
            { text: "Tidak ada — sudah cukup", why: "Salah. Kasus Apple Card membuktikan sebaliknya." },
            { text: "Proksi: variabel lain (kode pos, pola belanja) membawa informasi gender. Keadilan butuh pengukuran disparitas, bukan kebutaan", why: "Benar. Fairness through unawareness gagal; ukur metrik per grup.", correct: true },
            { text: "Gender harus dipakai sebagai variabel", why: "Salah. Memakai atribut sensitif justru berisiko disparate treatment." },
            { text: "Model pasti adil tanpa gender", why: "Salah. Tidak ada jaminan seperti itu." },
          ],
        },
        {
          q: "Sifat efficiency SHAP menyatakan?",
          options: [
            { text: "SHAP cepat dihitung", why: "Salah. Itu soal komputasi, bukan sifat matematis." },
            { text: "Jumlah semua kontribusi = selisih prediksi dari baseline — tidak ada yang hilang atau ganda", why: "Benar. Akuntansi lengkap = fondasi kepercayaan SHAP.", correct: true },
            { text: "SHAP selalu kausal", why: "Salah. SHAP menjelaskan model, bukan dunia." },
            { text: "SHAP hanya untuk tree", why: "Salah. Berlaku umum; TreeSHAP hanya implementasi cepat." },
          ],
        },
      ],
      reference: "Proksi > kebutaan. Efficiency = akuntansi lengkap.",
    },
    {
      id: "mitigasi",
      eyebrow: "Langkah 6 · Mitigasi bias",
      title: "Pra, dalam, dan pasca pemrosesan",
      prose: [
        "Tiga titik intervensi: pre-processing — perbaiki data (reweighting, hapus proksi); in-processing — tambahkan constraint fairness saat training; post-processing — sesuaikan threshold per grup setelah model jadi.",
        "Peringatan untuk post-processing: threshold berbeda per grup demi equal opportunity kontroversial secara hukum — perlakuan eksplisit berbeda per grup bisa dibaca sebagai disparate treatment. Konsultasikan legal dulu; fairness adalah wilayah hukum, bukan sekadar statistik.",
        "Selalu ada tradeoff fairness-accuracy. Dokumentasikan kurva tradeoff-nya, pilih titiknya sebagai keputusan bisnis dan legal yang sadar — bukan sebagai default diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Memperbaiki keadilan dengan aturan beda per grup tanpa konsultasi legal bisa menimbulkan masalah hukum baru yang lebih besar dari masalah statistik yang diperbaiki.",
      },
      reference: "Pre: perbaiki data. In: constraint saat training. Post: threshold — hati-hati hukum.",
    },
    {
      id: "mini-case-audit",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Audit fairness model KTA",
      prose: [
        "Kamu auditor independen model KTA. Temuan: AUC 0,85 dan kalibrasi baik secara agregat; SHAP global top-3: DPD, rasio utang, kode pos; tingkat penolakan wilayah X 18 persen vs wilayah Y 7 persen — padahal default aktual X 9 persen vs Y 8 persen; tim model membela: kode pos penting untuk risiko geografis dan mereka tidak pakai variabel sensitif.",
        "Masalah: kode pos adalah proksi wilayah yang berkorelasi dengan kelompok dilindungi (pola permukiman tersegregasi). SHAP membuktikan ia pendorong top-3 — model memakai geografi secara material. Penolakan 18 vs 7 persen dengan risiko aktual hampir sama adalah disparate impact yang nyata. Demographic parity dilanggar; equal opportunity kemungkinan juga; sufficiency mungkin terpenuhi karena kalibrasi agregat baik — inilah impossibility theorem.",
        "Rekomendasi audit: tidak pakai variabel sensitif bukan pembelaan — proksi dihitung sebagai diskriminasi tidak langsung di banyak yurisdiksi. Uji: buang kode pos, berapa AUC hilang? Jika di bawah 1 poin, buang (kompleksitas tidak membayar dirinya). Jika material, cari pengganti yang tidak berkorelasi dengan grup dilindungi dan dokumentasikan business necessity bersama legal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "SHAP yang menempatkan kode pos di top-3 adalah alarm, bukan vonis. Langkah analis: cek korelasi dengan atribut dilindungi, uji materialitas (AUC tanpa fitur itu), diskusikan business necessity dengan legal.",
      },
      reference: "Uji materialitas: buang fitur -> AUC hilang berapa? <1 poin -> buang.",
    },
    {
      id: "pendalaman-shap-lime-jebakan",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Aksioma Shapley, LIME & jebakan interpretasi",
      prose: [
        "SHAP berdiri di atas fondasi matematika, bukan heuristik: empat aksioma Shapley. Efficiency — jumlah kontribusi = selisih prediksi dari baseline (akuntansi lengkap). Symmetry — dua fitur yang selalu berkontribusi sama mendapat nilai sama. Dummy — fitur yang tidak pernah mengubah prediksi mendapat nol. Additivity — konsisten saat model digabung. SHAP adalah satu-satunya metode alokasi yang memenuhi keempatnya — itulah klaim keunggulannya, bukan sekadar popularitas.",
        "Tapi SHAP punya satu pilihan yang mengubah hasil: interventional vs observational. Interventional memutus korelasi antar fitur (apa jadinya bila fitur ini diubah, lainnya tetap) — lebih dekat ke kausal. Observational menghormati korelasi data (kredit dibagi antar fitur yang berkorelasi). Untuk fitur yang sangat berkorelasi, keduanya bisa bercerita sangat berbeda. Tidak ada jawaban benar universal — yang ada hanya pilihan yang didokumentasikan dan bisa dipertahankan di depan validator.",
        "LIME menempuh jalur lain: aproksimasi lokal linear. Di sekitar titik x, ia mengambil sampel titik-titik tetangga (dibobot kedekatan), lalu mem-fit model sederhana g yang meniru model asli f di wilayah itu. Tujuannya: minimumkan L(f,g,pi_x) + Omega(g) — tradeoff antara kesetiaan (fidelity) meniru model asli vs kesederhanaan agar bisa dibaca manusia. Jebakan: sampling tetangga acak membuat penjelasan tidak stabil antar run; dan definisi lokalitas (lebar kernel) mengubah jawaban — lokalitas yang terlalu lebar = penjelasan global yang menyamar.",
        "Empat jebakan interpretasi yang harus dihafal. Satu: fitur berkorelasi membagi kredit — SHAP bisa menolkan fitur yang penting secara bisnis hanya karena redundan; jangan baca nol sebagai tidak penting. Dua: baseline menentukan cerita — ganti baseline, ganti narasi. Tiga: penjelasan adversarial — penelitian menunjukkan penjelasan (termasuk SHAP) bisa dimanipulasi tanpa mengubah prediksi; penjelasan bukan sertifikat keamanan. Empat: SHAP untuk model yang salah = penjelasan yang fasih tentang model yang salah. Urutan kerja tidak bisa dibalik: validasi model dulu, jelaskan kemudian.",
      ],
      formula: String.raw`\arg\min_{g} \; L(f, g, \pi_x) + \Omega(g)`,
      formulaNote: "Tujuan LIME: g = model lokal sederhana; f = model asli; pi_x = bobot kedekatan ke titik x; L = seberapa setia g meniru f di sekitar x; Omega = penalti kompleksitas g. Tradeoff: makin sederhana g, makin mudah dibaca tapi makin tidak setia pada model asli.",
      tasks: [],
      reference: "SHAP = 4 aksioma; pilih interventional vs observational secara eksplisit. LIME = fidelity vs simplicity. Validasi dulu, jelaskan kemudian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: penjelasan adalah cerita tentang model, bukan tentang dunia",
        body: "Setiap penjelasan menjawab kenapa MODEL memutuskan begitu — bukan kenapa dunia begitu. Mencampuradukkan keduanya = lompatan kausal yang berbahaya secara hukum. Tiga heuristik. Pertama: penjelasan yang tidak stabil (sedikit ubah input, penjelasan berubah drastis) = penjelasan yang tidak bisa dipercaya. Uji stabilitas sebelum sajikan ke regulator — penjelasan yang goyang lebih buruk daripada tidak ada penjelasan. Kedua: bila penjelasan global dan lokal bertentangan, percayai lokal untuk keputusan individual. Global adalah rata-rata yang bisa menyembunyikan perilaku aneh di subgrup. Ketiga: baseline SHAP bukan pilihan netral. Mengganti baseline (populasi vs subgrup) mengubah cerita kontribusi — pilih secara eksplisit dan dokumentasikan. Aturan praktis: untuk keputusan teregulasi, penjelasan terbaik seringkali bukan SHAP yang bagus, melainkan model intrinsik yang cukup bagus. Hierarki kejujuran bukan pajangan — ia urutan yang harus diikuti kecuali selisih akurasinya material.",
      },
      summary: [
        "Global vs lokal, intrinsik vs post-hoc. Hierarki kejujuran: intrinsik > SHAP > LIME.",
        "SHAP: phi = beta x (x - rata-rata); efficiency = jumlah kontribusi sama dengan selisih dari baseline.",
        "SHAP menjelaskan prediksi model, bukan kausalitas dunia nyata.",
        "Tiga definisi fairness bisa bertengkar (impossibility theorem); memilih definisi = keputusan nilai dan hukum.",
        "Mitigasi: pre/in/post-processing. Threshold beda per grup butuh konsultasi legal.",
      ],
      next: { label: "A3.15 — Tree & Boosting", href: "/v2/learn/a315-tree-boosting" },
      quiz: [
        {
          q: "Model terkalibrasi sempurna per grup (sufficiency terpenuhi) tapi tingkat penolakan grup B 2x grup A (parity dilanggar). Mungkin?",
          options: [
            { text: "Tidak mungkin — kontradiksi", why: "Salah. Justru ini inti teoremanya." },
            { text: "Mungkin — impossibility theorem: ketiga definisi fairness tidak bisa dipenuhi bersamaan", why: "Benar. Model bisa adil menurut satu definisi dan tidak menurut yang lain.", correct: true },
            { text: "Berarti kalibrasi salah hitung", why: "Salah. Kalibrasinya bisa benar dan parity tetap dilanggar." },
            { text: "Berarti datanya salah", why: "Salah. Ini sifat matematis definisi, bukan kesalahan data." },
          ],
        },
        {
          q: "Kapan model intrinsik (logistik/scorecard) lebih baik dari boosting + SHAP?",
          options: [
            { text: "Tidak pernah — boosting selalu menang", why: "Salah. Kemenangan metrik bukan satu-satunya kriteria." },
            { text: "Jika selisih akurasi kecil (<1-2 poin AUC): interpretabilitas adalah aset regulasi", why: "Benar. Kompleksitas harus membayar dirinya termasuk risiko penjelasan.", correct: true },
            { text: "Hanya untuk data kecil", why: "Salah. Alasannya regulasi dan risiko, bukan ukuran data." },
            { text: "SHAP selalu cukup sebagai pengganti", why: "Salah. SHAP aproksimasi; intrinsik lebih jujur." },
          ],
        },
        {
          q: "Post-processing threshold berbeda per grup untuk equal opportunity. Peringatan?",
          options: [
            { text: "Tidak ada — solusi sempurna", why: "Salah. Ada dimensi hukumnya." },
            { text: "Kontroversial secara hukum: perlakuan eksplisit berbeda per grup bisa = disparate treatment. Konsultasikan legal dulu", why: "Benar. Fairness adalah wilayah hukum, bukan sekadar statistik.", correct: true },
            { text: "Selalu menaikkan akurasi", why: "Salah. Biasanya ada tradeoff." },
            { text: "Tidak perlu diukur ulang", why: "Salah. Setiap intervensi wajib diukur ulang." },
          ],
        },
        {
          q: "SHAP menempatkan kode pos di top-3 pendorong default. Tindakan analis?",
          options: [
            { text: "Langsung buang kode pos", why: "Salah. Keputusan butuh uji materialitas dulu." },
            { text: "Investigasi: apakah proksi grup dilindungi? Uji kontribusi marginalnya + diskusikan business necessity dengan legal", why: "Benar. SHAP adalah alarm, bukan vonis.", correct: true },
            { text: "Abaikan — SHAP pasti benar", why: "Salah. SHAP menjelaskan model; tindak lanjutnya butuh judgment." },
            { text: "Tambah lebih banyak fitur geografis", why: "Salah. Itu memperparah risiko proksi." },
          ],
        },
        {
          q: "Dua fitur berkorelasi 0,95; SHAP memberi satu nilai besar dan satunya nol. Kesimpulan?",
          options: [
            { text: "Fitur bernilai nol tidak penting — buang", why: "Salah. Itu kesimpulan yang berbahaya." },
            { text: "Fitur berkorelasi membagi kredit — nol berarti redundan di sampel ini, bukan tidak penting secara bisnis. Jangan hapus dari kamus teori", why: "Benar. SHAP menjelaskan kontribusi marginal, bukan pentingnya konsep.", correct: true },
            { text: "SHAP salah hitung", why: "Salah. Pembagian kredit adalah sifat metode, bukan bug." },
            { text: "Naikkan jumlah sampel", why: "Salah. Korelasi struktural tidak hilang dengan sampel." },
          ],
        },
        {
          q: "Baseline SHAP diganti dari rata-rata populasi ke rata-rata subgrup — dan cerita kontribusi berubah. Bagaimana menyikapinya?",
          options: [
            { text: "Pilih yang hasilnya paling bagus", why: "Salah. Itu cherry-picking penjelasan." },
            { text: "Baseline bukan netral: pilih secara eksplisit sesuai pertanyaan (vs populasi umum? vs kelompok sebanding?), dokumentasikan, dan laporkan sensitivitasnya", why: "Benar. Penjelasan tanpa baseline yang dinyatakan = cerita tanpa konteks.", correct: true },
            { text: "Selalu pakai populasi — tidak boleh diganti", why: "Salah. Untuk keputusan individual, baseline subgrup sebanding sering lebih relevan." },
            { text: "Abaikan — perbedaannya kecil", why: "Salah. Bisa sangat besar untuk fitur yang berkorelasi dengan subgrup." },
          ],
        },
        {
          q: "LIME memberi penjelasan berbeda setiap kali dijalankan pada nasabah yang sama. Masalah dan solusi?",
          options: [
            { text: "Normal — penjelasan memang subjektif", why: "Salah. Ketidakstabilan = tidak bisa dipercaya." },
            { text: "Sampling tetangga acak membuat LIME tidak stabil. Stabilkan (seed/sampel lebih besar) atau pindah ke SHAP yang deterministik", why: "Benar. Penjelasan yang goyah lebih buruk daripada tidak ada.", correct: true },
            { text: "Modelnya yang rusak", why: "Salah. Ini soal metode penjelasan, bukan model." },
            { text: "Naikkan kompleksitas model lokal", why: "Salah. Itu mengurangi interpretabilitas — tujuan LIME." },
          ],
        },
      ],
    },
  ],
};

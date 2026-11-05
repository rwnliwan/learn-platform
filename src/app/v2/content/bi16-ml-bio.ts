import type { V2Lesson } from "../lib/types";

export const bi16: V2Lesson = {
  slug: "bi16-ml-bio",
  track: "Bioinformatika",
  module: "Machine Learning",
  title: "BI16 · Machine Learning untuk Biologi: Prediksi & Overfitting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "99% “akurasi” yang salah total",
      prose: [
        "2019: sebuah tim melaporkan model prediksi respons kanker dengan akurasi 99%. Media heboh. Setahun kemudian model gagal total di rumah sakit lain. Investigasi: model menghafal artefak BATCH scanner, bukan biologi. 99% akurasi = 99% hafalan.",
        "Twist-nya: overfitting tidak berbunyi. Ia tidak error, tidak warning — ia justru terlihat SEMPURNALAH di data training. Dan di biologi, kebocoran data (leakage) ada di mana-mana: homolog protein di train dan test, pasien yang sama di dua lipatan, batch yang berkorelasi dengan label. ML di biologi adalah olahraga pertahanan melawan diri sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa akurasi 99% bisa jadi kabar buruk" },
        { id: "t2", text: "Sebutkan tiga sumber leakage khas data biologi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengevaluasi model pada data training (atau validasi yang bocor) lalu mengklaim performa. Aturan keras: evaluasi final HANYA pada test set yang tidak pernah disentuh selama training dan tuning. Yang lain = self-deception.",
      },
      reference: "ML biologi = pertahanan melawan leakage. Test set tak tersentuh.",
    },
    {
      id: "kapan",
      eyebrow: "Langkah 2 · Kapan ML",
      title: "Tiga pertanyaan sebelum ML",
      prose: [
        "ML = belajar pola dari contoh, bukan dari aturan. Sinyal lemah + dimensi tinggi = zona ML (prediksi struktur, fungsi protein, respons obat). Sinyal kuat + sederhana = statistik klasik cukup (uji-t untuk DMR).",
        "Sebelum training, jawab tiga pertanyaan: (1) Apakah ada pola yang bisa dipelajari — atau noise murni? (2) Apakah data cukup — deep learning butuh ribuan sampel; n<100 pakai model sederhana. (3) Apakah ada leakage — pisahkan homolog/pasien/batch DULU.",
        "Deep learning = model dalam dengan BANYAK parameter. Ia kuat untuk pola kompleks (struktur, gambar) tapi rakus data, sulit diinterpretasi, dan mahal. Di biologi, sering kalah dari model sederhana pada n kecil.",
      ],
      tasks: [
        { id: "t1", text: "n=60 pasien, 20 fitur: model apa?" },
        { id: "t2", text: "Prediksi struktur dari sekuens: model apa?" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model deep learning dengan 50 sampel klinis = overfitting yang dijamin. Di risiko model (model risk), kompleksitas harus sebanding dengan data: model yang tidak bisa divalidasi = risiko operasional. Mulai sederhana, naikkan hanya jika validasi mendukung.",
      },
      reference: "Sinyal lemah + dimensi tinggi = ML. n kecil = model sederhana.",
    },
    {
      id: "lab-bocor",
      eyebrow: "Langkah 3 · Lab",
      title: "Tangkap leakage: akurasi jatuh",
      prose: [
        "Simulasi: fitur “info_batch” berkorelasi dengan label di TRAIN (artefak scanner), tapi acak di TEST. Model k-NN sederhana mencapai ~100% di train — lalu jatuh di test. Itulah wajah leakage.",
        "Di lab ini kamu menjalankan evaluasi train dan test, lalu menyimpulkan: apakah model belajar biologi atau artefak?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi k-NN 1-tetangga (jarak Euclidean)" },
        { id: "t2", text: "Evaluasi akurasi train vs test" },
        { id: "t3", text: "Simpulkan: leakage atau generalisasi?" },
      ],
      expected: "train ~100% · test ~50% → LEAKAGE (model hafal batch!)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Normalisasi/seleksi fitur memakai SELURUH data sebelum split. Itu leakage: informasi test merembes ke training. Split DULU, fit preprocessing HANYA di train, terapkan ke test.",
      },
      hints: [
        "Jarak Euclidean = akar jumlah kuadrat selisih.",
        "1-NN: label = label tetangga terdekat di train.",
        "Akurasi = fraksi prediksi benar.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(7)\n\ndef buat(n, bocor):\n    d = []\n    for _ in range(n):\n        y = 1 if random.random() < 0.5 else 0\n        info = y if bocor else (1 if random.random() < 0.5 else 0)  # artefak batch!\n        noise = [random.gauss(0, 1) for _ in range(4)]\n        d.append(([info] + noise, y))\n    return d\n\ntrain, test = buat(80, True), buat(40, False)\n\ndef jarak(a, b):\n    return  # TULIS KODEMU\n\ndef prediksi(x):\n    # TULIS KODEMU: label tetangga terdekat di train\n    return \n\ndef akurasi(data):\n    return sum(1 for x, y in data if prediksi(x) == y)/len(data)\n\nprint(f'akurasi train: {akurasi(train):.0%}')\nprint(f'akurasi test : {akurasi(test):.0%}')\nprint('train ~100%, test ~50% -> LEAKAGE: model hafal batch, bukan biologi!')`,
        lockLines: 9,
        solution: `import random, math\nrandom.seed(7)\n\ndef buat(n, bocor):\n    d = []\n    for _ in range(n):\n        y = 1 if random.random() < 0.5 else 0\n        info = y if bocor else (1 if random.random() < 0.5 else 0)  # artefak batch!\n        noise = [random.gauss(0, 1) for _ in range(4)]\n        d.append(([info] + noise, y))\n    return d\n\ntrain, test = buat(80, True), buat(40, False)\n\ndef jarak(a, b):\n    return math.sqrt(sum((p-q)**2 for p, q in zip(a, b)))\n\ndef prediksi(x):\n    # TULIS KODEMU: label tetangga terdekat di train\n    return min(train, key=lambda t: jarak(x, t[0]))[1]\n\ndef akurasi(data):\n    return sum(1 for x, y in data if prediksi(x) == y)/len(data)\n\nprint(f'akurasi train: {akurasi(train):.0%}')\nprint(f'akurasi test : {akurasi(test):.0%}')\nprint('train ~100%, test ~50% -> LEAKAGE: model hafal batch, bukan biologi!')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "akurasi train: 10?0%", label: "akurasi train ~100%", msg: "Fitur artefak = label di train → 1-NN hampir sempurna." },
          { kind: "stdout_matches", task: "t2", pattern: "akurasi test : [3-6]\\d%", label: "akurasi test ~50%", msg: "Artefak acak di test → model jatuh ke level tebakan. Itulah leakage." },
        ],
      },
      reference: "Train ≫ test = red flag. Cari leakage sebelum merayakan.",
    },
    {
      id: "lab-cv",
      eyebrow: "Langkah 4 · Lab",
      title: "Cross-validation yang benar (group-aware)",
      prose: [
        "Cross-validation: putar peran train/validasi k kali — estimasi performa yang jujur untuk n kecil. TAPI: kalau pasien yang sama muncul di train dan test fold (duplikat pengukuran), CV ikut bocor!",
        "Di lab ini: 5-fold CV biasa vs group-CV (semua pengukuran satu pasien di fold yang sama). Lihat perbedaan estimasinya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi akurasi 1-NN per fold" },
        { id: "t2", text: "Bandingkan CV biasa vs group-CV" },
      ],
      expected: "CV biasa 100% (bocor) · CV group ~50% (jujur)",
      hints: [
        "Fold i = sampel dengan indeks % 5 == i.",
        "Group fold: pasien p masuk fold p % 5.",
        "Akurasi per fold dirata-ratakan.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(21)\n# 40 pasien x 3 pengukuran; tiap pasien punya artefak unik (signature)\n# yang TIDAK terkait label -> model hanya bisa menghafal, bukan generalisasi\npasien = []\nfor p in range(40):\n    s = p * 2.0\n    y = 1 if random.random() < 0.5 else 0\n    for _ in range(3):\n        pasien.append((p, [s + random.gauss(0, 0.02)] +\n                       [random.gauss(0, 0.1) for _ in range(2)], y))\n\ndef jarak(a, b):\n    return math.sqrt(sum((p-q)**2 for p, q in zip(a, b)))\n\ndef akurasi_fold(tr, va):\n    # TULIS KODEMU: akurasi 1-NN (train=tr, validasi=va)\n    benar = \n    return benar/len(va)\n\ndef cv_biasa():\n    skor = []\n    for i in range(5):\n        va = [s for k, s in enumerate(pasien) if k % 5 == i]\n        tr = [s for k, s in enumerate(pasien) if k % 5 != i]\n        skor.append(akurasi_fold([(f, y) for _, f, y in tr],\n                                 [(f, y) for _, f, y in va]))\n    return sum(skor)/len(skor)\n\ndef cv_group():\n    skor = []\n    for i in range(5):\n        va = [s for s in pasien if s[0] % 5 == i]\n        tr = [s for s in pasien if s[0] % 5 != i]\n        skor.append(akurasi_fold([(f, y) for _, f, y in tr],\n                                 [(f, y) for _, f, y in va]))\n    return sum(skor)/len(skor)\n\nprint(f'CV biasa  : {cv_biasa():.0%} (bocor: pasien sama di train+test)')\nprint(f'CV group  : {cv_group():.0%} (jujur: generalisasi antar pasien)')`,
        lockLines: 7,
        solution: `import random, math\nrandom.seed(21)\n# 40 pasien x 3 pengukuran; tiap pasien punya artefak unik (signature)\n# yang TIDAK terkait label -> model hanya bisa menghafal, bukan generalisasi\npasien = []\nfor p in range(40):\n    s = p * 2.0\n    y = 1 if random.random() < 0.5 else 0\n    for _ in range(3):\n        pasien.append((p, [s + random.gauss(0, 0.02)] +\n                       [random.gauss(0, 0.1) for _ in range(2)], y))\n\ndef jarak(a, b):\n    return math.sqrt(sum((p-q)**2 for p, q in zip(a, b)))\n\ndef akurasi_fold(tr, va):\n    # TULIS KODEMU: akurasi 1-NN (train=tr, validasi=va)\n    benar = sum(1 for x, y in va if min(tr, key=lambda t: jarak(x, t[0]))[1] == y)\n    return benar/len(va)\n\ndef cv_biasa():\n    skor = []\n    for i in range(5):\n        va = [s for k, s in enumerate(pasien) if k % 5 == i]\n        tr = [s for k, s in enumerate(pasien) if k % 5 != i]\n        skor.append(akurasi_fold([(f, y) for _, f, y in tr],\n                                 [(f, y) for _, f, y in va]))\n    return sum(skor)/len(skor)\n\ndef cv_group():\n    skor = []\n    for i in range(5):\n        va = [s for s in pasien if s[0] % 5 == i]\n        tr = [s for s in pasien if s[0] % 5 != i]\n        skor.append(akurasi_fold([(f, y) for _, f, y in tr],\n                                 [(f, y) for _, f, y in va]))\n    return sum(skor)/len(skor)\n\nprint(f'CV biasa  : {cv_biasa():.0%} (bocor: pasien sama di train+test)')\nprint(f'CV group  : {cv_group():.0%} (jujur: generalisasi antar pasien)')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "CV biasa  : 100%", label: "CV biasa 100% (bocor)", msg: "Pengukuran pasien yang sama ada di train dan test fold → model menghafal artefak." },
          { kind: "stdout_matches", task: "t2", pattern: "CV group  : [3-6]\\d%", label: "CV group ~50% (jujur)", msg: "Pasien dipisah per fold → artefak tak dikenal → tinggal tebakan." },
        ],
      },
      note: {
        title: "Intuisi: di ML biologi, angka bagus adalah tersangka — bukan prestasi",
        body: "Praktisi ML bio menyimpan lima heuristik defensif. Satu: angka yang terlalu bagus (AUC > 0,95 di masalah sulit) adalah undangan mencari leakage, bukan alasan merayakan — mulai dari batch, pasien ganda, lalu homolog. Dua: split berdasarkan UNIT INDEPENDEN, bukan baris data — pisahkan per pasien, per batch, per cluster homologi; split acak baris pada data berstruktur adalah kebocoran yang dilembagakan. Tiga: seleksi fitur dan preprocessing HARUS di dalam loop CV, bukan sebelumnya — apa pun yang menyentuh seluruh data sebelum split (normalisasi global, seleksi gen, augmentasi) merembeskan informasi test ke train. Empat: baseline sederhana dulu — bila random forest dangkal sudah AUC 0,9, deep learning-mu mungkin hanya menghafal dengan lebih mahal; model kompleks harus mengalahkan baseline sederhana dengan margin yang layak, bukan sekadar mengalahkannya. Lima: validasi eksternal (kohort lain, lab lain, waktu lain) adalah satu-satunya ujian yang dipercaya regulator dan klinisi — CV internal yang sempurna tanpa validasi eksternal adalah janji tanpa jaminan. Heuristik gabungannya: sebelum memercayai satu angka performa, jawab tiga pertanyaan — apa unit independennya, apa yang menyentuh data sebelum split, dan di mana validasi eksternalnya.",
      },
      reference: "Group-CV untuk data berulang. Desain split = separuh ilmu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: ML atau bukan, dan bagaimana memvalidasi?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Sinyal kuat dan sederhana (beda dua kelompok jelas). → Statistik klasik, bukan ML. Alasan: uji-t yang transparan mengalahkan black box untuk sinyal yang memang sederhana. Contoh nyata: DMR dengan beda beta 0,7 tidak butuh neural network.",
        "Skenario 2 — Sinyal lemah + dimensi tinggi (struktur protein, respons obat). → ML. Alasan: di sinilah pola non-linear yang tak terlihat statistik klasik berada. Contoh nyata: prediksi struktur dari sekuens.",
        "Skenario 3 — Data <100 sampel. → Model sederhana; deep learning butuh ribuan. Alasan: model besar pada data kecil menghafal, bukan belajar. Contoh nyata: random forest kecil mengalahkan transformer pada 80 sampel.",
        "Skenario 4 — Protein train dan test berhomologi tinggi. → Homology-aware split, bukan split acak. Alasan: kerabat 90% identik bukan contoh independen — split acak = leakage. Contoh nyata: akurasi 99% runtuh ke 70% setelah split homologi.",
        "Skenario 5 — SNP sebagai fitur prediksi. → Split per blok genomik (LD-aware), bukan per SNP acak. Alasan: SNP tetangga dalam LD saling membocorkan informasi. Contoh nyata: model “memprediksi” lewat korelasi tetangga, bukan sinyal.",
        "Aturan praktis 10 detik: tiga pertanyaan dulu: ada pola? data cukup? ada leakage? — baru training."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Akurasi 99% dengan split acak pada data homolog — model menghafal kerabat, bukan belajar fungsi; homology-aware CV menjatuhkannya ke 70%, dan itulah angka jujur yang harus dilaporkan.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Klaim ML “revolusioner” yang bocor",
      prose: [
        "Startup klaim model prediksi sepsis dari RNA-seq: AUC 0,97, “siap klinis”. Audit menemukan tiga dosa: (1) seleksi gen memakai SEMUA data sebelum split — informasi test merembes; (2) sampel train-test dari batch sekuensing yang sama berkorelasi dengan outcome; (3) tidak ada validasi kohort independen.",
        "Re-analisis dengan split by-batch + group-CV: AUC jatuh ke 0,62. Rekomendasi: tarik klaim “siap klinis”; validasi prospektif multi-situs; laporkan interval kepercayaan AUC, bukan angka tunggal.",
        "Pelajaran: di ML biologi, skeptisisme adalah fitur. Setiap angka performa yang “terlalu bagus” adalah undangan untuk mencari leakage — bukan untuk merayakan.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga dosa validasi pada kasus ini" },
        { id: "t2", text: "Tulis rekomendasi untuk startup" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model “siap klinis” dengan AUC bocor = risiko keselamatan pasien + risiko regulasi. Di risiko model, validasi independen adalah gerbang wajib: tidak ada model yang naik produksi tanpa bukti generalisasi di luar data pembuatnya.",
      },
      reference: "AUC 0,97 → 0,62 setelah audit. Validasi independen = gerbang.",
    },
    {
      id: "homology-cv",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Leakage genomik, homology-aware CV, dan kotak hitam",
      prose: [
        "Leakage punya tiga wajah khas di data genomik — dan ketiganya lolos dari split acak standar. Wajah pertama: homologi. Protein train dan test yang 90% identik bukan dua contoh independen — model tidak belajar fungsi, ia menghafal keluarga. Split acak pada dataset protein adalah kebocoran yang dilembagakan: dengan identitas di atas 40%, model “memprediksi” test set yang sebenarnya sudah dilihatnya. Solusi: homology-aware split — cluster sekuens (CD-HIT/MMseqs2 pada 40% identitas), lalu assign SELURUH cluster ke train atau test. Laporkan identitas maksimum train-test sebagai bagian dari metode; reviewer yang baik akan menanyakannya.",
        "Wajah kedua: kedekatan genomik. SNP yang berdekatan berada dalam linkage disequilibrium — split acak SNP membuat SNP tetangga (yang berkorelasi kuat) tersebar di train dan test, sehingga model “memprediksi” lewat korelasi, bukan kausalitas. Solusi: split berdasarkan wilayah — per kromosom atau per blok LD. Wajah ketiga: augmentasi dan preprocessing sebelum split. Menambah data augmentasi (mutasi sintetis) SEBELUM split = kembaran sampel ada di dua sisi; normalisasi memakai mean seluruh data = statistik test merembes ke train. Aturan besi: SEMUA yang menyentuh data (seleksi fitur, normalisasi, augmentasi, imputasi) terjadi DI DALAM fold, setelah split — tanpa kecuali.",
        "Homology-aware cross-validation adalah prosedur standarnya: (1) cluster semua sekuens pada ambang identitas (mis. 40% untuk fungsi protein); (2) bagi cluster — bukan sekuens — ke dalam fold; (3) latih dan evaluasi. Efeknya brutal dan jujur: studi prediksi fungsi protein yang melaporkan AUC 0,95 dengan split acak sering jatuh ke 0,70–0,75 dengan homology split — dan angka kedua itulah performa yang akan kamu lihat pada protein yang benar-benar baru. Aturan pelaporan: selalu sebutkan skema split (acak / by-cluster / by-chromosome) di samping setiap angka performa; angka tanpa skema split = tidak bisa dinilai.",
        "Lalu pertanyaan yang lebih sulit: bila modelmu akurat, bolehkah ia tetap menjadi kotak hitam? Jawabannya tergantung taruhannya. Untuk skrining throughput (memprioritaskan ribuan kandidat obat untuk uji lab), black box boleh — asal ada validasi eksternal dan keputusan final tetap di tangan eksperimen. Untuk keputusan yang menyentuh pasien (diagnosis, rekomendasi terapi), “model berkata begitu” tidak cukup — regulator, dokter, dan pasien butuh ALASAN: fitur apa yang mendorong keputusan (SHAP values), contoh mana yang paling mirip, dan kapan model tidak yakin (kalibrasi ketidakpastian). Trade-off praktis: model sederhana yang bisa dijelaskan (regresi logistik teregularisasi + fitur terkurasi domain) sering hanya kalah sedikit dari deep learning pada n kecil — dan kemenangan kecil akurasi jarang sepadan dengan kehilangan akuntabilitas.",
        "Checklist lima pertanyaan sebelum memercayai angka ML bio: (1) Apa unit independennya — pasien, batch, atau cluster homologi? (2) Apa yang menyentuh seluruh data sebelum split? (3) Berapa performa baseline sederhana — apakah kompleksitasmu layak? (4) Apakah ada validasi eksternal (kohort, lab, atau waktu lain)? (5) Bila dipakai untuk keputusan klinis — bisakah kamu menjelaskan KENAPA model memutuskan begitu, dalam bahasa yang dipahami dokter? Satu jawaban “tidak/belum” = angka itu belum boleh keluar dari lab.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan tiga wajah leakage khas data genomik dan solusinya" },
        { id: "t2", text: "Kapan black box boleh dipakai dan kapan tidak" },
      ],
      quiz: [
        {
          q: "Dataset 1.000 protein, split acak 80/20, banyak pasangan train-test beridentitas >90%. Masalah dan solusinya?",
          options: [
            { text: "Tidak masalah — split acak itu adil", why: "Adil secara baris, bocor secara biologi: homolog bukan contoh independen." },
            { text: "Homology leakage — split by cluster identitas, laporkan identitas maks train-test", why: "Model harus diuji pada keluarga yang belum dilihat, bukan sepupu yang sudah dihafal.", correct: true },
            { text: "Tambah data augmentasi untuk menutup celah", why: "Augmentasi sebelum split justru menambah kebocoran, bukan menutupnya." },
            { text: "Pakai model lebih dalam agar generalisasi", why: "Model lebih dalam menghafal lebih baik — memperparah, bukan memperbaiki." },
          ],
        },
        {
          q: "Model DL AUC 0,99 memprediksi respons kemoterapi, tanpa penjelasan fitur. Boleh dipakai klinis?",
          options: [
            { text: "Boleh — AUC 0,99 sudah membuktikan diri", why: "AUC tanpa skema split dan validasi eksternal bukan bukti; tanpa penjelasan, tidak ada akuntabilitas." },
            { text: "Belum — butuh validasi eksternal + interpretabilitas sebelum menyentuh keputusan pasien", why: "Taruhan klinis menuntut alasan yang bisa diaudit, bukan sekadar angka.", correct: true },
            { text: "Boleh asal kodenya open-source", why: "Keterbukaan kode tidak menjelaskan keputusan per pasien." },
            { text: "Ganti ke random forest agar otomatis aman", why: "Random forest tanpa split yang benar bocor dengan cara yang sama." },
          ],
        },
        {
          q: "Seleksi 50 gen terbaik memakai SEMUA data, lalu CV 5-fold memberi AUC 0,93. Masalahnya?",
          options: [
            { text: "Tidak ada — CV sudah memvalidasi", why: "Salah: CV memvalidasi model yang fiturnya dipilih memakai informasi test — validasinya palsu." },
            { text: "Seleksi fitur sebelum split = leakage; seleksi harus di dalam tiap fold", why: "Benar: test set “bocor” ke pemilihan fitur; AUC 0,93 mengukur optimisme, bukan generalisasi.", correct: true },
            { text: "CV harus 10-fold, bukan 5-fold", why: "Salah: jumlah fold tidak memperbaiki kebocoran informasi." },
            { text: "50 gen terlalu sedikit", why: "Salah: jumlah fitur bukan masalahnya — urutan operasinya." },
          ],
        },
      ],
      reference: "Split by unit independen · semua preprocessing di dalam fold · taruhan tinggi = butuh penjelasan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Overfitting = hafal, bukan belajar. Sunyi tapi mematikan.",
        "Leakage biologi: homolog, pasien sama, batch ≈ label.",
        "Tiga pertanyaan: pola? data cukup? leakage?",
        "CV jujur: group-aware; split dulu, preprocessing setelah.",
        "Evaluasi final hanya di test tak tersentuh.",
        "Mulai sederhana; naikkan kompleksitas bila validasi mendukung.",
      ],
      next: { label: "BI17 · Reprodusibilitas & Etika", href: "/learn/bi17-reprodusibilitas" },
      quiz: [
        {
          q: "Model train 99%, test 52%. Diagnosis?",
          options: [
            { text: "Model hebat", why: "Hebat di train tapi gagal di test = tidak berguna." },
            { text: "Overfitting/leakage — cari kebocoran, jangan rayakan", why: "Gap train-test = red flag klasik. Audit split & fitur dulu.", correct: true },
            { text: "Butuh lebih banyak epoch", why: "Lebih banyak training justru memperparah overfitting." },
            { text: "Test set salah", why: "Menyalahkan test adalah denial; audit model dulu." },
          ],
        },
        {
          q: "Seleksi fitur memakai seluruh data sebelum split adalah…",
          options: [
            { text: "Praktik baik", why: "Ini justru praktik buruk yang umum." },
            { text: "Leakage: info test merembes ke training", why: "Split dulu, fit preprocessing hanya di train.", correct: true },
            { text: "Tidak masalah", why: "Sangat masalah: estimasi performa jadi optimis palsu." },
            { text: "Wajib", why: "Tidak wajib; yang wajib adalah split bersih." },
          ],
        },
        {
          q: "Kapan deep learning tepat di biologi?",
          options: [
            { text: "Selalu", why: "n kecil + DL = overfitting dijamin." },
            { text: "Ribuan+ sampel & pola kompleks (struktur, citra)", why: "DL butuh data besar. n=60 → model sederhana.", correct: true },
            { text: "n=50", why: "Terlalu sedikit untuk puluhan ribu parameter." },
            { text: "Tidak pernah", why: "AlphaFold membuktikan DL bisa revolusioner — dengan data cukup." },
          ],
        },
        {
          q: "Group-CV dibutuhkan ketika…",
          options: [
            { text: "Data sedikit", why: "Itu alasan CV biasa, bukan group-CV." },
            { text: "Sampel berulang per pasien/homolog — unit independen harus utuh per fold", why: "Pasien sama di train+test = bocor. Group-CV memisahkan unit.", correct: true },
            { text: "Selalu", why: "Tanpa struktur grup, CV biasa cukup." },
            { text: "Tidak pernah", why: "Data longitudinal/replikat membutuhkannya." },
          ],
        },
        {
          q: "Metrik performa yang dilaporkan harus…",
          options: [
            { text: "Angka tunggal terbaik", why: "Angka tunggal tanpa konteks = cherry-picking." },
            { text: "Dari test tak tersentuh + interval kepercayaan", why: "Kejujuran = test bersih + ketidakpastian dilaporkan.", correct: true },
            { text: "Dari training", why: "Training = optimis palsu." },
            { text: "Tanpa baseline", why: "Tanpa baseline, angka tidak bermakna." },
          ],
        },
      ],
    },
  ],
};

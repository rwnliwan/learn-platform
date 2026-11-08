import type { V2Lesson } from "../lib/types";

export const cr46: V2Lesson = {
  slug: "cr46-ml-credit-scoring",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR46 — ML Credit Scoring: XGBoost dan Walk-Forward Validation",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model dengan Gini 0,72 — yang ambruk setahun kemudian",
      prose: [
        "Vendor menawarkan model credit scoring 'Gini 0,72, sudah lolos validasi' seharga Rp5 miliar. Bank Nusantara membelinya. Setahun kemudian, model itu ambruk: Gini out-of-time 0,48, kalibrasi meleset (PD prediksi 4 persen, aktual 7 persen), populasi bergeser (PSI 0,31). CR19 sudah menceritakan kegagalan ini — dan pelajaran pertamanya: Gini training bukan validasi. Tetapi CR19 berhenti di validasi; ia tidak pernah MEMBANGUN model machine learning-nya.",
        "Lesson ini membangunnya: gradient boosting (keluarga XGBoost) untuk credit scoring, dengan walk-forward validation — validasi yang menghormati WAKTU. Data kredit punya urutan waktu: aplikan 2023 berbeda dari aplikan 2025 (populasi bergeser, kebijakan berubah). Validasi acak (random split) mencampur masa depan ke dalam training — kebocoran waktu (look-ahead bias) yang membuat Gini terlihat bagus dan model ambruk saat dipakai. Walk-forward melatih pada masa lalu dan menguji pada masa depan — seperti model akan dipakai di dunia nyata.",
        "Lesson ini membangun topik yang hanya disinggung: CR19 menyebut gradient boosting sebagai challenger (Gini +1,5 poin vs champion logistik — ditolak karena tidak membayar hilangnya explainability) dan CR36 memakai Python untuk analitik kredit — tetapi tidak ada lesson yang membangun model boosting dan walk-forward-nya. PM-B3 membahas ML untuk investasi — bukan untuk credit scoring. Setelah lesson ini kamu bisa: (1) menjelaskan cara kerja gradient boosting (stump demi stump); (2) menerapkan walk-forward validation; (3) menghitung akurasi per fold dan rata-ratanya; (4) membaca feature importance; (5) memutuskan kapan boosting mengalahkan logistik — dan kapan tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "CR19 membahas validasi model kredit (Gini out-of-time, kalibrasi, PSI, champion-challenger dengan gradient boosting sebagai challenger yang DITOLAK karena selisih 1,5 poin tidak membayar hilangnya explainability) dan CR36 memakai Python untuk analitik kredit. Tidak ada lesson yang MEMBANGUN model boosting: tidak ada stump, tidak ada boosting iteratif, tidak ada walk-forward validation. Lesson ini membangun ketiganya — dengan gradient boosting stump (logika yang sama dengan XGBoost) dan walk-forward 2 fold.",
      },
      reference: "30 aplikan sintetis (seed 3), 17 default. Walk-forward: fold 1 akurasi 0,80; fold 2 akurasi 0,90; rata-rata 0,85. Fitur terpenting: DTI (6 split di kedua fold).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun model credit scoring machine learning — dan membuktikan bahwa ia bekerja di masa depan, bukan hanya di masa lalu.",
        "(1) Menjelaskan cara kerja gradient boosting (stump demi stump, residu demi residu);",
        "(2) Menerapkan walk-forward validation yang menghormati urutan waktu;",
        "(3) Menghitung akurasi per fold dan rata-ratanya;",
        "(4) Membaca feature importance dari jumlah split;",
        "(5) Memutuskan kapan boosting mengalahkan regresi logistik — dan kapan champion bertahan.",
      ],
      tasks: [],
    },
    {
      id: "boosting",
      eyebrow: "Langkah 3 · Teori",
      title: "Gradient boosting: stump demi stump",
      prose: [
        "Gradient boosting membangun model dari banyak pohon KECIL (stump — pohon dengan satu split) yang masing-masing memperbaiki kesalahan pendahulunya. Langkahnya: mulai dari prediksi dasar (rata-rata default, misalnya 17/30 = 0,57). Hitung residu (aktual dikurangi prediksi). Latih stump untuk memprediksi RESIDU — bukan labelnya. Tambahkan stump itu ke model dengan learning rate kecil (0,3). Ulangi 12 ronde. Tiap ronde, residu mengecil — model belajar dari kesalahannya sendiri, sedikit demi sedikit.",
        "Stump adalah pohon yang bertanya satu pertanyaan: 'Apakah DTI di bawah 0,35?' — dan memberi dua jawaban (nilai daun untuk 'ya' dan 'tidak'). Stump yang baik adalah yang paling menurunkan jumlah kuadrat residu (SSE). Learning rate 0,3 berarti tiap stump hanya menyumbang 30 persen dari sarannya — mencegah satu stump yang buruk merusak model. 12 ronde dengan learning rate 0,3 memberi model yang kuat tetapi tidak overfitting — seperti belajar dengan langkah kecil, bukan lompatan besar.",
        "XGBoost adalah gradient boosting dengan tiga tambahan: regularisasi (hukuman untuk pohon yang terlalu kompleks), handling missing value bawaan, dan optimasi komputasi (histogram, paralel). Logikanya SAMA dengan yang dibangun di lab ini — hanya lebih cepat dan lebih teratur. Analis yang memahami stump boosting memahami XGBoost; analis yang hanya memanggil library tanpa memahami stump sedang memakai kotak hitam yang tidak bisa ia jelaskan ke OJK (CR24: fairness dan explainability).",
        "Feature importance dibaca dari jumlah split: fitur yang paling sering dipakai stump untuk membelah data adalah fitur yang paling informatif. Di lab ini, DTI dipakai 6 kali di kedua fold — jauh di atas pendapatan (0 dan 2 kali) dan masa kerja (6 dan 4 kali). Artinya: rasio utang terhadap penghasilan adalah sinyal default terkuat di data ini — temuan yang masuk akal secara ekonomi dan bisa dijelaskan ke komite kredit. Model yang feature importance-nya tidak masuk akal (misalnya 'nomor aplikasi' yang paling penting) adalah model yang bocor — ia menghafal, bukan belajar.",
      ],
      tasks: [],
      formula: String.raw`F_m = F_{m-1} + \eta \cdot h_m \qquad h_m = \arg\min_h \sum (r_i - h(x_i))^2`,
      formulaNote: "F m = model setelah ronde m; eta = learning rate (0,3); h m = stump ronde m yang memprediksi residu r. 12 ronde. Feature importance = jumlah split per fitur: DTI 6 kali di kedua fold.",
      reference: "12 ronde, learning rate 0,3. DTI 6 split di kedua fold — fitur terpenting.",
    },
    {
      id: "walk-forward",
      eyebrow: "Langkah 4 · Teori",
      title: "Walk-forward: validasi yang menghormati waktu",
      prose: [
        "Validasi acak (random split) membagi data secara acak: 80 persen training, 20 persen testing. Untuk data kredit, ini BOCOR: aplikan 2025 bisa masuk training sementara aplikan 2023 masuk testing — model 'belajar dari masa depan' untuk memprediksi masa lalu. Gini yang dihasilkan terlihat bagus — dan ambruk saat dipakai, seperti vendor CR19. Walk-forward memperbaiki ini: latih pada 10 aplikan PERTAMA (masa lalu), uji pada 10 BERIKUTNYA (masa depan); lalu latih pada 20 pertama, uji pada 10 terakhir. Masa depan tidak pernah masuk training.",
        "Hasil lab: fold 1 (latih 10, uji 10) akurasi 0,80; fold 2 (latih 20, uji 10) akurasi 0,90; rata-rata 0,85. Dua hal yang perlu dibaca. Pertama, fold 2 lebih baik dari fold 1 — wajar: training 20 data memberi model lebih banyak untuk dipelajari daripada 10 data. Kedua, rata-rata 0,85 dengan 2 fold BUKAN bukti model itu hebat — 20 data uji terlalu sedikit untuk kesimpulan kuat. Yang dibuktikan walk-forward bukan 'model ini hebat' — melainkan 'model ini diuji dengan cara yang benar'.",
        "Tiga jebakan walk-forward. Pertama, fold terlalu sedikit: 2 fold memberi gambaran, tetapi 5+ fold (dengan jendela bergeser) memberi keyakinan. Kedua, populasi bergeser antar fold: bila fold 2 berisi segmen baru (gig worker, CR19), akurasi turun — dan itu INFORMASI, bukan kegagalan: model harus di-retraining atau ditolak. Ketiga, tuning pada hasil walk-forward: bila kamu memilih hyperparameter (ronde, learning rate) berdasarkan akurasi walk-forward, lalu melaporkan akurasi yang sama sebagai 'hasil' — kamu overfitting pada validasi. Solusinya: nested walk-forward (tuning di fold dalam, evaluasi di fold luar) — atau terima bahwa akurasi yang dilaporkan sedikit optimis.",
        "Keputusan champion vs challenger (CR19) memakai walk-forward sebagai wasit: challenger boosting menang hanya bila selisihnya MATERIAL (praktik umum: lebih dari 3 poin Gini out-of-time, konsisten 2 periode) DAN lolos semua pilar lain (kalibrasi, stabilitas, explainability). Di lab ini, boosting memberi akurasi 0,85 — tetapi dengan 30 data sintetis, tidak ada klaim 'mengalahkan logistik' yang bisa dibuat. Lab ini mengajarkan CARA membandingkan — bukan HASIL perbandingan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai random split untuk data berurutan waktu. Random split mencampur masa depan ke training — kebocoran waktu yang membuat Gini terlihat bagus dan model ambruk saat dipakai. Untuk data kredit, walk-forward bukan pilihan — ia keharusan.",
      },
      reference: "Fold 1: 0,80 (latih 10, uji 10). Fold 2: 0,90 (latih 20, uji 10). Rata-rata 0,85.",
    },
    {
      id: "lab-boosting",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin gradient boosting dan walk-forward",
      prose: [
        "Lab ini membangun mesin gradient boosting stump (logika XGBoost) dan walk-forward validation. Mesin boosting-nya (stump_fit, latih, prediksi) sudah disediakan sebagai referensi terkunci — tugasmu adalah menulis walk-forward-nya: latih pada masa lalu, uji pada masa depan, hitung akurasi tiap fold.",
        "Hitung dulu di kepala — atau lebih tepatnya, pahami apa yang akan keluar. Data: 30 aplikan sintetis (seed 3), 17 default. Fold 1: latih 10 pertama, uji 10 berikutnya → 8 benar dari 10 → akurasi 0,80. Fold 2: latih 20 pertama, uji 10 terakhir → 9 benar dari 10 → akurasi 0,90. Rata-rata: (0,80 + 0,90) dibagi 2 = 0,85. Feature importance: DTI 6 split di kedua fold — fitur terpenting.",
        "Tugas lab: tulis fungsi walk_forward yang melatih pada data[:10] dan menguji data[10:20], lalu melatih data[:20] dan menguji data[20:30] — lalu cetak akurasi fold 1 (dengan feature importance-nya), fold 2, dan rata-ratanya. Tiga baris ini adalah bukti validasi yang menghormati waktu.",
        "Setelah lolos, coba eksperimen: ubah ronde boosting dari 12 menjadi 3 dan lihat akurasi turun — model underfit. Ubah menjadi 50 dan lihat akurasi fold 1 turun — model overfit pada training kecil. Lalu tanyakan: berapa ronde yang optimal — dan bagaimana kamu mengetahuinya tanpa mengintip data uji?",
      ],
      tasks: [
        { id: "t1", text: "Jalankan walk-forward fold 1 (latih 10, uji 10) dan hitung `acc1`" },
        { id: "t2", text: "Jalankan walk-forward fold 2 (latih 20, uji 10) dan hitung `acc2`" },
        { id: "t3", text: "Hitung `mean_acc` (rata-rata acc1 dan acc2)" },
      ],
      expected: "fold1=0.80 penting=[0, 6, 6]\nfold2=0.90 penting=[2, 6, 4]\nrata-rata=0.85",
      hints: [
        "Fold 1: latih data[:10], uji data[10:20]. Fold 2: latih data[:20], uji data[20:30].",
        "Akurasi = benar / jumlah uji.",
        "Gunakan latih(X, y) dan prediksi(base, stumps, fitur) yang sudah disediakan.",
      ],
      code: {
        starter: `# 30 aplikan sintetis (seed 3): pendapatan, DTI, masa kerja, default.\nimport random\nrandom.seed(3)\ndata = []\nfor i in range(30):\n    pend = random.choice([36, 48, 60, 72, 96, 120, 150, 180])\n    dti = round(random.uniform(0.1, 0.7), 2)\n    tenure = random.choice([1, 2, 3, 5, 8, 12])\n    skor = 0.35 * (pend / 100) - 1.2 * dti + 0.06 * tenure + random.uniform(-0.25, 0.25)\n    default = 1 if skor < 0.15 else 0\n    data.append((pend, dti, tenure, default))\n\ndef stump_fit(X, resid):\n    best = None\n    for f in range(3):\n        vals = sorted(set(r[f] for r in X))\n        for k in range(len(vals) - 1):\n            t = (vals[k] + vals[k + 1]) / 2\n            for arah in (1, -1):\n                pred = [1.0 if (r[f] <= t) == (arah == 1) else -1.0 for r in X]\n                kiri = [resid[i] for i in range(len(X)) if pred[i] == 1.0]\n                kanan = [resid[i] for i in range(len(X)) if pred[i] == -1.0]\n                if not kiri or not kanan:\n                    continue\n                mk = sum(kiri) / len(kiri)\n                mn = sum(kanan) / len(kanan)\n                sse = sum((resid[i] - (mk if pred[i] == 1.0 else mn)) ** 2 for i in range(len(X)))\n                if best is None or sse < best[0]:\n                    best = (sse, f, t, arah, mk, mn)\n    return best\n\ndef latih(X, y, ronde=12, lr=0.3):\n    base = sum(y) / len(y)\n    stumps = []\n    penting = [0, 0, 0]\n    for _ in range(ronde):\n        pred = [base + sum(lr * (s[4] if (r[s[1]] <= s[2]) == (s[3] == 1) else s[5]) for s in stumps) for r in X]\n        resid = [y[i] - pred[i] for i in range(len(y))]\n        s = stump_fit(X, resid)\n        if s is None:\n            break\n        stumps.append(s)\n        penting[s[1]] += 1\n    return base, stumps, penting\n\ndef prediksi(base, stumps, r, lr=0.3):\n    p = base\n    for s in stumps:\n        p += lr * (s[4] if (r[s[1]] <= s[2]) == (s[3] == 1) else s[5])\n    return 1 if p >= 0.5 else 0\n\n# TULIS KODEMU: walk-forward 2 fold (latih 10 uji 10; latih 20 uji 10).\n# Hitung acc1, acc2, mean_acc dan cetak fold1, fold2, rata-rata.\n\n\nwalk_forward(data)`,
        lockLines: 50,
        solution: `# 30 aplikan sintetis (seed 3): pendapatan, DTI, masa kerja, default.\nimport random\nrandom.seed(3)\ndata = []\nfor i in range(30):\n    pend = random.choice([36, 48, 60, 72, 96, 120, 150, 180])\n    dti = round(random.uniform(0.1, 0.7), 2)\n    tenure = random.choice([1, 2, 3, 5, 8, 12])\n    skor = 0.35 * (pend / 100) - 1.2 * dti + 0.06 * tenure + random.uniform(-0.25, 0.25)\n    default = 1 if skor < 0.15 else 0\n    data.append((pend, dti, tenure, default))\n\ndef stump_fit(X, resid):\n    best = None\n    for f in range(3):\n        vals = sorted(set(r[f] for r in X))\n        for k in range(len(vals) - 1):\n            t = (vals[k] + vals[k + 1]) / 2\n            for arah in (1, -1):\n                pred = [1.0 if (r[f] <= t) == (arah == 1) else -1.0 for r in X]\n                kiri = [resid[i] for i in range(len(X)) if pred[i] == 1.0]\n                kanan = [resid[i] for i in range(len(X)) if pred[i] == -1.0]\n                if not kiri or not kanan:\n                    continue\n                mk = sum(kiri) / len(kiri)\n                mn = sum(kanan) / len(kanan)\n                sse = sum((resid[i] - (mk if pred[i] == 1.0 else mn)) ** 2 for i in range(len(X)))\n                if best is None or sse < best[0]:\n                    best = (sse, f, t, arah, mk, mn)\n    return best\n\ndef latih(X, y, ronde=12, lr=0.3):\n    base = sum(y) / len(y)\n    stumps = []\n    penting = [0, 0, 0]\n    for _ in range(ronde):\n        pred = [base + sum(lr * (s[4] if (r[s[1]] <= s[2]) == (s[3] == 1) else s[5]) for s in stumps) for r in X]\n        resid = [y[i] - pred[i] for i in range(len(y))]\n        s = stump_fit(X, resid)\n        if s is None:\n            break\n        stumps.append(s)\n        penting[s[1]] += 1\n    return base, stumps, penting\n\ndef prediksi(base, stumps, r, lr=0.3):\n    p = base\n    for s in stumps:\n        p += lr * (s[4] if (r[s[1]] <= s[2]) == (s[3] == 1) else s[5])\n    return 1 if p >= 0.5 else 0\n\n\ndef walk_forward(data):\n    hasil = []\n    for akhir in (10, 20):\n        lat = data[:akhir]\n        uji = data[akhir:akhir + 10]\n        X = [d[:3] for d in lat]\n        y = [d[3] for d in lat]\n        base, stumps, penting = latih(X, y)\n        benar = sum(1 for d in uji if prediksi(base, stumps, d[:3]) == d[3])\n        hasil.append((benar, len(uji), penting))\n    return hasil\n\n\nhasil = walk_forward(data)\nacc1 = hasil[0][0] / hasil[0][1]\nacc2 = hasil[1][0] / hasil[1][1]\nmean_acc = (acc1 + acc2) / 2\nprint(f"fold1={acc1:.2f} penting={hasil[0][2]}")\nprint(f"fold2={acc2:.2f} penting={hasil[1][2]}")\nprint(f"rata-rata={mean_acc:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "acc1", value: 0.8, tol: 0.01, label: "Fold 1 akurasi 0,80", msg: "8 benar dari 10. Latih 10 data — model masih lapar data." },
          { kind: "equal", task: "t2", name: "acc2", value: 0.9, tol: 0.01, label: "Fold 2 akurasi 0,90", msg: "9 benar dari 10. Latih 20 data — lebih banyak untuk dipelajari." },
          { kind: "equal", task: "t3", name: "mean_acc", value: 0.85, tol: 0.01, label: "Rata-rata akurasi 0,85", msg: "(0,80 + 0,90) / 2 = 0,85. Diuji dengan cara yang benar — bukan bukti model hebat." },
        ],
      },
      reference: "Fold 1: 0,80 (8/10). Fold 2: 0,90 (9/10). Rata-rata 0,85. DTI 6 split di kedua fold.",
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 6 · Teori",
      title: "Keputusan: kapan boosting menang — dan kapan champion bertahan",
      prose: [
        "Aturan champion-challenger (CR19) berlaku penuh di sini. Challenger boosting menang hanya bila tiga syarat terpenuhi. Pertama, selisih MATERIAL: lebih dari 3 poin Gini out-of-time (walk-forward), konsisten 2 periode — bukan satu fold yang kebetulan bagus. Kedua, kalibrasi lolos: PD prediksi vs aktual per desil (uji Hosmer-Lemeshow) — model yang diskriminasinya bagus tetapi kalibrasinya meleset akan merusak ECL (CR14). Ketiga, explainability: model harus bisa menjelaskan 'kenapa aplikan ini ditolak' — dengan SHAP atau feature importance yang masuk akal — kepada OJK dan kepada aplikan yang dirugikan (CR24).",
        "Dua jebakan khusus boosting. Pertama, overfitting pada fitur bocor: fitur yang mengandung informasi masa depan (misalnya 'jumlah hari keterlambatan SETELAH pengajuan' — yang belum terjadi saat scoring) akan memberi Gini spektakuler dan model yang tidak berguna. Audit fitur sebelum training: tiap fitur harus tersedia PADA SAAT keputusan dibuat. Kedua, bias yang diperkuat: bila data historis mengandung diskriminasi (misalnya penolakan berdasarkan wilayah yang berkorelasi dengan suku), boosting akan MEMPELAJARI dan MEMPERKUAT pola itu — lebih efisien dari logistik. Fairness audit (CR24) wajib untuk model ML — bukan opsional.",
        "Aturan penutup: model ML terbaik untuk credit scoring sering bukan yang paling akurat — melainkan yang paling bisa dijelaskan, paling stabil, dan paling adil. Champion logistik dengan 12 variabel yang bisa dijelaskan ke OJK dalam 10 menit (CR19) sering mengalahkan challenger boosting 200 variabel — bukan karena logistik lebih pintar, melainkan karena bank adalah lembaga yang diatur, bukan laboratorium. Boosting menang bila ia membayar kompleksitasnya — dengan selisih yang material DAN explainability yang terjaga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih model dari Gini training. Gini training adalah cermin yang memuji — model yang menghafal selalu terlihat bagus di data yang ia hafal. Satu-satunya Gini yang berarti adalah Gini walk-forward out-of-time — dan itupun harus disertai kalibrasi dan stabilitas.",
      },
      reference: "Challenger menang bila: selisih Gini > 3 poin (2 periode), kalibrasi lolos, explainability terjaga.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: vendor kedua — dengan walk-forward",
      prose: [
        "Setahun setelah kegagalan vendor pertama, vendor kedua datang dengan klaim yang sama: 'Gini 0,75'. Kali ini, Bank Nusantara tidak bertanya 'berapa Gini-nya' — melainkan 'bagaimana kamu mengukurnya?' Vendor kedua menjawab: 'Walk-forward 5 fold, 2 tahun data, Gini out-of-time 0,71–0,75 konsisten, kalibrasi Hosmer-Lemeshow lolos, PSI 0,08.' Tim validasi memeriksa sendiri: mereka menjalankan walk-forward independen pada data bank — dan mendapat Gini 0,70. Selisih 5 poin dari klaim — masih dalam batas wajar (perbedaan definisi fold) — dan kalibrasi lolos.",
        "Keputusan: bank membeli model itu — tetapi sebagai CHALLENGER, bukan champion. Selama 6 bulan, challenger berjalan paralel (shadow mode): memprediksi tanpa memutuskan. Hasilnya: Gini out-of-time 0,69, kalibrasi lolos, PSI 0,12 — stabil. Setelah 6 bulan, challenger dipromosikan menjadi champion untuk segmen KTA — dengan syarat: validasi ulang tiap kuartal, dan rollback otomatis bila Gini turun 5 poin atau PSI melewati 0,25.",
        "Pelajaran mini-case ini: vendor yang baik tidak takut walk-forward independen — ia menyambutnya. Dan bank yang baik tidak membeli klaim — ia membeli BUKTI yang bisa ia ulangi sendiri. Model Rp5 miliar yang dibeli tanpa validasi independen adalah donasi; model yang dibeli setelah shadow mode 6 bulan adalah investasi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, klaim diuji dengan walk-forward INDEPENDEN — bukan dipercaya. Kedua, challenger berjalan shadow mode 6 bulan sebelum promosi — bukti di data nyata, bukan di slide vendor. Ketiga, ada aturan rollback tertulis (Gini turun 5 poin atau PSI di atas 0,25) — bukan 'nanti kalau sempat'.",
      },
      reference: "Klaim Gini 0,75 → verifikasi independen 0,70 → shadow mode 6 bulan 0,69 → promosi dengan rollback otomatis.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Fold 1: 0,80 (8/10). Fold 2: 0,90 (9/10). Rata-rata 0,85. DTI 6 split di kedua fold.",
        "Gradient boosting: stump demi stump memperbaiki residu; learning rate 0,3; 12 ronde.",
        "Walk-forward menghormati waktu — latih masa lalu, uji masa depan. Random split bocor.",
        "Challenger menang bila: selisih Gini > 3 poin (2 periode), kalibrasi lolos, explainability terjaga.",
        "Fitur bocor dan bias yang diperkuat adalah dua jebakan khusus boosting.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Walk-forward 2 fold: fold 1 (latih 10, uji 10) 8 benar; fold 2 (latih 20, uji 10) 9 benar. Berapa akurasi tiap fold dan rata-ratanya?",
          options: [
            { text: "Fold 1: 0,80; fold 2: 0,90; rata-rata 0,85", why: "Tepat: 8/10 = 0,80; 9/10 = 0,90; (0,80 + 0,90)/2 = 0,85.", correct: true },
            { text: "Fold 1: 0,80; fold 2: 0,90; rata-rata 0,90 — rata-rata adalah fold terbaik", why: "Salah: rata-rata adalah rata-rata — bukan nilai terbaik. (0,80 + 0,90)/2 = 0,85." },
            { text: "Fold 1: 0,08; fold 2: 0,09; rata-rata 0,085", why: "Salah: 8/10 = 0,80, bukan 0,08. Kesalahan desimal." },
            { text: "Fold 1: 0,90; fold 2: 0,80; rata-rata 0,85", why: "Salah: tertukar. Fold 1 (latih 10) yang 0,80; fold 2 (latih 20) yang 0,90 — lebih banyak data training memberi akurasi lebih baik." },
          ],
        },
        {
          q: "Kenapa random split BOCOR untuk data kredit — dan apa penggantinya?",
          options: [
            { text: "Karena random split terlalu lambat — penggantinya adalah validasi manual", why: "Salah: bukan soal kecepatan. Random split mencampur masa depan ke training — kebocoran waktu." },
            { text: "Karena random split mencampur masa depan ke training — model belajar dari masa depan; penggantinya walk-forward", why: "Tepat: walk-forward melatih masa lalu dan menguji masa depan — seperti model akan dipakai.", correct: true },
            { text: "Karena random split tidak bisa dipakai untuk boosting", why: "Salah: random split bisa dipakai secara teknis untuk boosting apa pun — masalahnya adalah KEBOCORAN WAKTU, bukan kompatibilitas algoritma." },
            { text: "Random split tidak bocor — ia standar industri untuk semua data", why: "Salah: random split standar untuk data TANPA urutan waktu. Data kredit punya urutan waktu — dan itu mengubah segalanya." },
          ],
        },
        {
          q: "Gradient boosting dengan 12 ronde dan learning rate 0,3. Apa peran learning rate?",
          options: [
            { text: "Menentukan jumlah stump — semakin besar semakin banyak stump", why: "Salah: jumlah stump ditentukan ronde (12). Learning rate menentukan BESAR KONTRIBUSI tiap stump." },
            { text: "Tiap stump hanya menyumbang 30 persen dari sarannya — mencegah satu stump buruk merusak model", why: "Tepat: langkah kecil, 12 ronde. Learning rate besar (1,0) membuat model melompat dan overfit.", correct: true },
            { text: "Menentukan akurasi akhir secara langsung — 0,3 berarti akurasi 30 persen", why: "Salah: learning rate bukan akurasi. Akurasi diukur dari hasil — di lab ini 0,85." },
            { text: "Tidak ada peran — hanya parameter formalitas", why: "Salah: learning rate adalah salah satu hyperparameter terpenting boosting — ia mengendalikan kecepatan belajar dan overfitting." },
          ],
        },
        {
          q: "Challenger boosting Gini out-of-time 0,615 vs champion logistik 0,60 — selisih 1,5 poin, 200+ variabel vs 12 variabel. Apa keputusan yang benar?",
          options: [
            { text: "Promosikan challenger — Gini lebih tinggi berarti model lebih baik", why: "Salah: selisih 1,5 poin di bawah ambang material 3 poin — dan tidak membayar hilangnya explainability (CR19)." },
            { text: "Champion bertahan — selisih 1,5 poin tidak membayar hilangnya explainability dan stabilitas", why: "Tepat: aturan CR19 — challenger menang hanya bila selisih MATERIAL (> 3 poin, 2 periode) DAN lolos semua pilar.", correct: true },
            { text: "Gabungkan keduanya — rata-rata prediksinya", why: "Salah: ensemble tanpa alasan bukan jawaban. Ensemble 200 variabel + 12 variabel tetap tidak bisa dijelaskan ke OJK." },
            { text: "Buang keduanya dan beli model vendor", why: "Salah: membeli vendor tanpa validasi independen adalah kesalahan CR19 yang pertama — Gini 0,72 yang ambruk." },
          ],
        },
        {
          q: "Fitur 'jumlah hari keterlambatan SETELAH pengajuan' memberi Gini spektakuler. Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — fitur yang bagus harus dipakai", why: "Salah: fitur itu belum terjadi SAAT keputusan dibuat — ia bocor dari masa depan. Modelnya tidak berguna di produksi." },
            { text: "Fitur bocor — mengandung informasi masa depan yang belum ada saat scoring; audit fitur wajib sebelum training", why: "Tepat: tiap fitur harus tersedia PADA SAAT keputusan dibuat. Fitur bocor memberi Gini palsu.", correct: true },
            { text: "Fitur itu ilegal", why: "Salah: bukan ilegal — melainkan tidak tersedia saat scoring. Masalahnya adalah ketersediaan waktu, bukan hukum." },
            { text: "Fitur itu terlalu akurat sehingga overfitting", why: "Salah: bukan overfitting biasa — ini kebocoran target (target leakage). Modelnya 'benar' dengan cara yang curang." },
          ],
        },
      ],
    },
  ],
};

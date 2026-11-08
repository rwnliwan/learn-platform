import type { V2Lesson } from "../lib/types";

export const fr10: V2Lesson = {
  slug: "fr10-drift",
  track: "Fraud & AML Analytics",
  module: "Operasi Model",
  title: "FR10 — Drift & Validasi Temporal",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang mati dalam 8 bulan",
      prose: [
        "Model fraud \"PayKu\" diluncurkan Januari dengan PR-AUC validasi 0,93. Perayaan. Bonus. Lalu grafik produksinya: Februari 0,91… April 0,84… Agustus 0,65. Model yang sama, data yang \"sama\" — tapi performanya mati pelan-pelan.",
        "Yang terjadi bukan bug. Penipu belajar: bulan 1–2 mereka pakai nominal besar (ditangkap). Bulan 3 mereka pecah jadi nominal kecil (lolos sebagian). Bulan 5 mereka sewa mule dengan device \"bersih\" (lolos banyak). Setiap kekalahan mereka adalah pelajaran gratis — dan model PayKu tidak pernah ikut les.",
        "Validasi 0,93 itu sendiri bohong sejak awal — dihitung dengan random split, di mana data \"validasi\" berisi pola dari bulan-bulan yang sama dengan training. Model tidak diuji pada masa depan; ia diuji pada masa lalu yang diacak. Di fraud, waktu bukan sekadar kolom — ia adalah musuh.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Validasi menjawab \"bagaimana model ini menghadapi masa depan?\" Satu-satunya cara jujur mensimulasikannya: uji pada masa depan betulan (data yang terjadi setelah training). Random split menjawab pertanyaan yang salah — dan jawaban yang salah itu berbahaya karena terlihat meyakinkan.",
      },
      reference: "Random split untuk fraud = tidak valid. Time split + embargo, selalu.",
    },
    {
      id: "split",
      eyebrow: "Langkah 2 · Validasi temporal",
      title: "Jangan biarkan model mencontek masa depan",
      prose: [
        "Simulasi: pola fraud berubah di bulan 7 (penipu adaptasi — skor fraud turun). Threshold dipelajari dari bulan 1–6. Validasi random split (campuran semua bulan): F1 = 0,89 — terlihat bagus. Validasi time split (hanya bulan 9–12, masa depan betulan): F1 = 0,76. Selisih 0,13 = ukuran kebohongan random split.",
        "Aturan: train di masa lalu, validasi di masa depan, dengan gap/embargo di antaranya = maturation window (label validasi harus matang juga!). Angka validasi dari random split untuk fraud = tidak valid. Titik.",
      ],
      tasks: [
        { id: "t1", text: "Pelajari `t` (threshold) dari bulan 1–6 dengan F1 maksimal" },
        { id: "t2", text: "Evaluasi di validasi random split vs time split (bulan 9–12)" },
        { id: "t3", text: "Cetak precision/recall/F1 keduanya" },
      ],
      expected: "Random split: F1=0.89 | Time split: F1=0.76 — selisih = ukuran kebohongan",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model yang bagus akan tetap bagus — kan sudah divalidasi.\" Di fraud, model yang tidak di-retrain = target latihan bagi penipu. Mereka justru belajar dari modelmu: tiap transaksi yang lolos mengajari mereka \"di sinilah batasnya\". Model statis melawan musuh adaptif = kalah pasti, hanya soal waktu.",
      },
      hints: [
        "f1_at(t, data): hitung tp/fp/fn dari aturan skor > t.",
        "Pilih t dari 0.30–0.89 yang F1-nya maksimal di data train (bulan 1-6).",
        "val_random = 20% data acak; val_time = bulan 9-12 saja.",
      ],
      code: {
        starter: `# Pola fraud BERGESER di bulan 7 (penipu adaptasi). Buktikan kebocoran masa depan.\nimport random\nrandom.seed(17)\ndata = []\nfor m in range(1, 13):\n    for _ in range(200):\n        is_fraud = random.random() < 0.05\n        if is_fraud:\n            s = random.uniform(0.7, 1.0) if m < 7 else random.uniform(0.4, 0.7)\n        else:\n            s = random.uniform(0.0, 0.5)\n        data.append((m, s, is_fraud))\n\ndef f1_at(t, d):\n    tp = sum(1 for _, s, y in d if s > t and y)\n    fp = sum(1 for _, s, y in d if s > t and not y)\n    fn = sum(1 for _, s, y in d if s <= t and y)\n    prec = tp/(tp+fp) if tp+fp else 0\n    rec = tp/(tp+fn) if tp+fn else 0\n    f1 = 2*prec*rec/(prec+rec) if prec+rec else 0\n    return f1, prec, rec\n\n# TULIS KODEMU: pelajari threshold dari bulan 1-6, lalu evaluasi dua validasi\ntrain = [d for d in data if d[0] <= 6]\nt =\n\nrandom.shuffle(data)\nval_random = data[:480]\nval_time = [d for d in data if d[0] >= 9]\nfor nama, v in [("Random split", val_random), ("Time split", val_time)]:\n    f1, prec, rec = f1_at(t, v)\n    print(f"{nama}: precision={prec:.2f} recall={rec:.2f} F1={f1:.2f}")`,
        lockLines: 12,
        solution: `# Pola fraud BERGESER di bulan 7 (penipu adaptasi). Buktikan kebocoran masa depan.\nimport random\nrandom.seed(17)\ndata = []\nfor m in range(1, 13):\n    for _ in range(200):\n        is_fraud = random.random() < 0.05\n        if is_fraud:\n            s = random.uniform(0.7, 1.0) if m < 7 else random.uniform(0.4, 0.7)\n        else:\n            s = random.uniform(0.0, 0.5)\n        data.append((m, s, is_fraud))\n\ndef f1_at(t, d):\n    tp = sum(1 for _, s, y in d if s > t and y)\n    fp = sum(1 for _, s, y in d if s > t and not y)\n    fn = sum(1 for _, s, y in d if s <= t and y)\n    prec = tp/(tp+fp) if tp+fp else 0\n    rec = tp/(tp+fn) if tp+fn else 0\n    f1 = 2*prec*rec/(prec+rec) if prec+rec else 0\n    return f1, prec, rec\n\n# TULIS KODEMU: pelajari threshold dari bulan 1-6, lalu evaluasi dua validasi\ntrain = [d for d in data if d[0] <= 6]\nf1_terbaik = max(f1_at(c/100, train)[0] for c in range(30, 90))\nt = next(c/100 for c in range(30, 90) if f1_at(c/100, train)[0] == f1_terbaik)\n\nrandom.shuffle(data)\nval_random = data[:480]\nval_time = [d for d in data if d[0] >= 9]\nfor nama, v in [("Random split", val_random), ("Time split", val_time)]:\n    f1, prec, rec = f1_at(t, v)\n    print(f"{nama}: precision={prec:.2f} recall={rec:.2f} F1={f1:.2f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "t", label: "`t` terdefinisi", msg: "Pelajari threshold t dari bulan 1-6 (maksimalkan F1)." },
          { kind: "stdout_matches", task: "t3", pattern: "Random split: precision=1\\.00 recall=0\\.81 F1=0\\.89", label: "Random split F1=0.89", msg: "Random split terlihat bagus karena 'mencontek' pola masa lalu." },
          { kind: "stdout_matches", task: "t3", pattern: "Time split: precision=1\\.00 recall=0\\.61 F1=0\\.76", label: "Time split F1=0.76", msg: "Time split jujur: recall anjlok karena pola fraud bergeser di bulan 7." },
        ],
      },
      reference: "Satu-satunya validasi jujur: uji pada masa depan betulan. Gap/embargo = maturation window.",
    },
    {
      id: "drift",
      eyebrow: "Langkah 3 · Jenis drift",
      title: "Concept, data, label — dan musuh yang sengaja",
      prose: [
        "Tiga jenis drift. Concept drift: P(y|x) berubah — arti fitur yang sama berubah. Contoh: \"device baru dulu 80% fraud, kini 30% fraud\" (orang makin sering ganti HP). Data drift: P(x) berubah — distribusinya bergeser (mis. promo mengubah pola nominal). Label drift: P(y) berubah — base rate fraud naik/turun.",
        "Yang membuat fraud berbeda dari semua domain ML lain: drift-nya disengaja oleh lawan yang cerdas — adversarial adaptation. Siklusnya (biasanya 2–6 bulan per putaran): eksploitasi (penipu menemukan celah, mis. ambang velocity 5/jam) → deteksi kita (rule/model menangkap pola → loss mereka naik) → adaptasi mereka (pecah jadi 4/jam dari 2 device) → deteksi kita lagi (analis melihat pola baru → rule baru). Selamanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pertahanan melawan musuh adaptif: jangan publikasikan ambangmu (penipu membaca juga — jangan tulis \"transaksi >Rp1 juta ditahan\" di FAQ!), randomisasi pertahanan (ambang sedikit acak membuat adaptasi lebih mahal), retraining terjadwal dengan data matang, dan fitur \"fisika\" yang lebih tahan lama (penipu bisa mengubah nominal, tidak bisa mengubah hukum fisika).",
      },
      reference: "Tiga drift: concept P(y|x), data P(x), label P(y). Adversarial = musuh belajar dari modelmu.",
    },
    {
      id: "psi",
      eyebrow: "Langkah 4 · PSI",
      title: "Alarm asap, bukan pemadam",
      prose: [
        "PSI (Population Stability Index) mengukur pergeseran distribusi. Yang dipantau: distribusi skor model, fitur kunci (velocity, device age), dan base rate (fraud rate). Contoh: distribusi nominal training (Januari) vs produksi (Oktober), 4 bin. Bin D (>Rp2jt): exp 5%, act 10% → kontribusi (0,10−0,05)×ln(0,10/0,05) = 0,0347. Total PSI = 0,045.",
        "Aturan umum: < 0,1 = aman; 0,1–0,25 = waspada; > 0,25 = drift signifikan. 0,045 = aman — tapi perhatikan: 77% PSI disumbang bin D (transaksi > Rp2jt berlipat ganda). PSI total \"aman\" bisa menyembunyikan pergeseran berbahaya di ekor distribusi — dan ekor itulah tempat fraud tinggal. Selalu lihat kontribusi per bin.",
      ],
      formula: String.raw`PSI = \sum_i (a_i - e_i) \ln\left(\frac{a_i}{e_i}\right)`,
      formulaNote: "e_i = proporsi expected (training), a_i = proporsi actual (produksi) per bin.",
      tasks: [
        { id: "t1", text: "Implementasikan `psi(expected, actual)`" },
        { id: "t2", text: "Hitung PSI + kontribusi tiap bin, cetak" },
      ],
      expected: "PSI=0.0453 (aman) — tapi 77% disumbang bin D (>Rp2jt berlipat ganda)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"PSI > 0,25 = model harus di-retrain sekarang.\" PSI tinggi = investigasi, bukan retrain otomatis. Retrain pada data yang sedang diserang pola baru (label belum matang!) bisa mengajari model pola serangan sebagai \"normal\". Urutan benar: investigasi → pahami → putuskan (rule darurat? retrain? tunggu label matang?).",
      },
      hints: [
        "Tiap bin: (a - e) * math.log(a / e). Jumlahkan.",
        "Jaga dari nol: max(x, 1e-6) sebelum log.",
        "def psi(expected, actual): return sum((a-e)*math.log(a/e) ...).",
      ],
      code: {
        starter: `# PSI: <0.1 aman, 0.1-0.25 waspada, >0.25 drift signifikan.\nimport math\n\n# TULIS KODEMU\ndef psi(expected, actual):\n    total = 0.0\n    for e, a in zip(expected, actual):\n        e = max(e, 1e-6); a = max(a, 1e-6)\n        total += \n    return total\n\nexp = [0.40, 0.35, 0.20, 0.05]  # training Januari\nact = [0.38, 0.30, 0.22, 0.10]  # produksi Oktober\nprint(f"PSI = {psi(exp, act):.4f}")\nfor label, e, a in zip(["A", "B", "C", "D"], exp, act):\n    e2, a2 = max(e, 1e-6), max(a, 1e-6)\n    print(f"  bin {label}: kontribusi={(a2-e2)*math.log(a2/e2):.4f}")`,
        lockLines: 3,
        solution: `# PSI: <0.1 aman, 0.1-0.25 waspada, >0.25 drift signifikan.\nimport math\n\n# TULIS KODEMU\ndef psi(expected, actual):\n    total = 0.0\n    for e, a in zip(expected, actual):\n        e = max(e, 1e-6); a = max(a, 1e-6)\n        total += (a - e) * math.log(a / e)\n    return total\n\nexp = [0.40, 0.35, 0.20, 0.05]  # training Januari\nact = [0.38, 0.30, 0.22, 0.10]  # produksi Oktober\nprint(f"PSI = {psi(exp, act):.4f}")\nfor label, e, a in zip(["A", "B", "C", "D"], exp, act):\n    e2, a2 = max(e, 1e-6), max(a, 1e-6)\n    print(f"  bin {label}: kontribusi={(a2-e2)*math.log(a2/e2):.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "psi", label: "`psi` terdefinisi", msg: "Buat fungsi psi(expected, actual)." },
          { kind: "stdout_matches", task: "t2", pattern: "PSI = 0\\.0453", label: "PSI = 0.0453", msg: "Jumlahkan (a-e)*ln(a/e) keempat bin = 0,0453." },
          { kind: "stdout_matches", task: "t2", pattern: "bin D: kontribusi=0\\.0347", label: "Bin D kontribusi terbesar", msg: "Bin D (>Rp2jt) menyumbang 0,0347 = 77% dari PSI." },
        ],
      },
      reference: "PSI = alarm asap. Bedakan drift wajar (promo/musim) vs drift musuh (adaptasi) — responsnya beda.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Strategi validasi & monitoring",
      prose: [
        "Satu: model baru mau launch → time-based split + embargo. Satu-satunya validasi jujur; random split = angka hiburan. Dua: model sudah produksi → monitor PSI mingguan + PR-AUC bulanan (label matang). Aksi: PSI 0,1–0,25 → investigasi; >0,25 → war-room; PR-AUC turun 10%+ → retrain. Tiga: serangan pola baru terdeteksi → rule darurat dulu, retrain kemudian. Rule darurat = jembatan 90 hari menunggu label matang. Empat: musuh adaptif kronis → pertahanan berlapis + randomisasi + fitur fisika.",
        "Kasus nyata: model kaget saat Ramadan — flag harian normal 2.000 melonjak ke 13.000, precision anjlok 22%→4%, tim 30 investigator butuh 6 hari membersihkan backlog. Solusi tahun berikutnya: regime calendar (2 minggu sebelum Ramadan, threshold dilonggarkan 30%) + fitur \"deviasi dari pola Ramadan tahun lalu\".",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Retrain tiap bulan pasti bikin model tetap segar.\" Retrain buta tiap bulan bisa merusak: melatih dengan data terkontaminasi label-lag, menghafal serangan sementara sebagai normal, dan menutupi bug pipeline. Retrain adalah obat dengan dosis — perlu diagnosis (jenis drift apa?) sebelum resep, bukan vitamin harian.",
      },
      reference: "Rancang monitoring dengan pertanyaan: \"jika angka ini merah jam 3 pagi, siapa yang bangun dan melakukan apa?\"",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Model anjlok bulan ke-5 — apa yang terjadi?",
      prose: [
        "Model fraud diluncurkan Januari (PR-AUC validasi 0,93). Februari 0,91, Maret 0,88, April 0,84, Mei 0,79, Juni 0,72, Juli 0,68, Agustus 0,65. Tidak ada perubahan kode, tidak ada insiden infra. Apa yang terjadi — dan apa responsmu minggu ini?",
        "Pembahasan: ini adversarial adaptation klasik — penurunan gradual 8 bulan = musuh belajar, bukan bug (bug = anjlok tiba-tiba). Respons minggu ini: (1) investigasi — bandingkan distribusi skor & fitur kunci vs training (PSI per fitur), cari pola baru yang lolos; (2) rule darurat untuk pola yang ditemukan — jangan tunggu retrain; (3) jadwalkan retrain dengan data matang terbaru via time split; (4) catat pelajaran: model ini tidak punya jadwal retrain — perbaiki prosesnya, bukan cuma modelnya.",
      ],
      tasks: [],
      reference: "Penurunan gradual = drift/adaptasi. Anjlok tiba-tiba = bug pipeline (cek lapis data dulu).",
    },
    {
      id: "psi-device",
      eyebrow: "Langkah 7 · PSI kategorikal",
      title: "Device_id: PSI 0,08 menjadi 0,34 dalam semalam",
      prose: [
        "Selasa, 14 Oktober 2026: aplikasi PayKu rilis v4.2. Rabu pagi dashboard monitoring merah — PSI fitur device_id melompat dari 0,08 (baseline minggu lalu, aman) menjadi 0,34 (drift signifikan). Insting pertama tim: serangan device farming besar-besaran. Insting pertama hampir selalu salah — dan di kasus ini, salahnya mahal.",
        "Device_id itu kategorikal dengan ratusan nilai unik — PSI tidak bisa dihitung per nilai mentah karena bin yang terlalu ramping membuat PSI berisik dan tidak stabil. Praktik standarnya: top-K binning — tiga versi aplikasi teratas jadi bin sendiri, sisanya digabung ke bucket \"unknown\". Distribusi expected (data training, September): v3.x 45%, v4.0 30%, v4.1 17%, unknown 8%. Distribusi actual (15 Oktober): v3.x 31%, v4.0 24%, v4.1 17%, unknown 28%.",
        "Hitung kontribusinya satu per satu. Bucket unknown: (0,28 − 0,08) × ln(0,28/0,08) = 0,20 × 1,253 ≈ 0,251. Tiga bin versi lama menyumbang gabungan ≈ 0,09. Total PSI ≈ 0,34 — dan 74%-nya berasal dari SATU bucket: unknown. Pelajaran operasionalnya: jangan pernah membaca angka PSI total sendirian; baca kontribusi per bin. Satu bucket yang meledak dan tiga bucket yang tenang adalah cerita yang sangat berbeda dari empat bucket yang bergeser merata.",
        "Investigasi 2 jam kemudian menemukan penyebabnya: SDK fingerprint di v4.2 mem-hash device dengan cara baru, sehingga ID lama tidak terpetakan dan jatuh ke bucket unknown. Ini bukan penipu baru — ini nasabah lama yang identitas device-nya tiba-tiba \"bisu\". Jenis drift-nya: instrumentasi (cara mengukur berubah), bukan adversarial (musuh berubah), bukan musiman (kalender berubah). Tiga jenis, tiga respons yang bertolak belakang — salah mengira jenisnya = salah mengobati.",
        "Skenario kesalahan termahalnya: panik lalu retrain. Retrain sekarang berarti melatih model dengan 28% trafik berlabel unknown — model akan belajar bahwa \"device tidak dikenal = normal\". Fitur device age, senjata terbaik melawan farming yang menaikkan AUC 0,81 ke 0,89 di cerita KreditGo, menjadi tumpul permanen. Biayanya: Rp350–500 juta untuk label dan compute retrain, 3–4 bulan waktu tunggu label matang — untuk menghasilkan model yang LEBIH buruk dari yang sekarang. Meracuni aset sehat dengan obat yang salah.",
        "Respons yang benar justru tidak menyentuh model sama sekali. Satu: freeze retrain sampai instrumentasi diperbaiki. Dua: bangun tabel pemetaan fingerprint lama ke baru, lalu backfill 2 minggu data historis agar unknown kembali ke 8%. Tiga: rule darurat sementara — unknown + velocity tinggi diarahkan ke step-up authentication, bukan auto-block, karena bucket unknown saat ini tercampur nasabah legit. Empat: hitung PSI terstratifikasi per versi aplikasi, agar rilis berikutnya tidak memicu alarm palsu yang sama.",
        "Aturan keputusan yang bisa ditempel di dinding: setiap PSI > 0,25 wajib menjawab dulu \"apakah cara kita MENGUKUR yang berubah?\" sebelum \"apakah DUNIA yang berubah?\". Cek log deploy 14 hari terakhir — drift yang lahir berbarengan dengan rilis adalah bug instrumentasi sampai terbukti sebaliknya. Investigasi 2 jam menghemat Rp500 juta.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: PSI adalah termometer, bukan diagnosis",
        type: "risk",
        body: "Investigator senior tidak pernah bereaksi terhadap angka PSI — ia bereaksi terhadap penyebabnya, dan angka hanyalah undangan untuk mencari penyebab. Kebiasaan yang membedakan: pertama, baca kontribusi per bin sebelum totalnya; satu bucket yang meledak menunjuk ke satu penyebab yang bisa ditemukan dalam hitungan jam, sedangkan pergeseran merata menunjuk ke perubahan perilaku yang butuh minggu untuk dipahami. Kedua, selalu tanyakan tiga kandidat penyebab dengan urutan probabilitas yang benar: alat ukurmu (deploy? migrasi? SDK baru?), kalendermu (promo? gajian? Ramadan?), lalu musuhmu — urutan ini terbalik dari insting kebanyakan orang yang langsung menuduh penipu. Ketiga, ingat bahwa retrain adalah operasi besar yang butuh anestesi berupa label matang; tidak ada investigator waras yang menjadwalkan operasi hanya karena termometer berbunyi. Keempat, catat setiap alarm palsu instrumentasi dan perbaiki monitornya (stratifikasi per versi, per kanal) — alarm yang ketiga kalinya palsu akan diabaikan tim, dan alarm keempat yang asli akan lolos tanpa ada yang peduli. Reputasi sistem monitoring dibangun dari presisi, bukan dari volume bunyinya.",
      },
      reference: "PSI > 0,25 → cek deploy log dulu. Drift + rilis = instrumentasi sampai terbukti sebaliknya.",
    },
    {
      id: "retrain-vs-kalibrasi",
      eyebrow: "Langkah 8 · Keputusan drift",
      title: "Retrain, kalibrasi ulang, atau jangan sentuh apa-apa",
      prose: [
        "Alarm PSI sudah dipahami penyebabnya. Sekarang pilih obatnya — dan tiap obat punya harga. Opsi A, retrain penuh: butuh label matang 10.000 sampel × Rp35 ribu = Rp350 juta, plus 3 analis selama 6 minggu dan biaya compute; total ±Rp500 juta, hasil baru terlihat 3–4 bulan. Opsi B, kalibrasi ulang threshold: 2 hari kerja analis (±Rp5 juta), tanpa label baru, tanpa training ulang. Opsi C, perbaiki instrumentasi + rule darurat: 1 sprint engineer (±Rp30 juta). Selisih harga A dan B seratus kali lipat — maka keputusan ini tidak boleh diambil dengan firasat.",
        "Opsi B cukup ketika yang terjadi adalah covariate shift murni: distribusi fitur bergeser, tetapi hubungan fitur-target P(y|x) tetap sama. Contoh klasik: promo 11.11 menggandakan transaksi kecil yang legit — skor rata-rata turun, threshold lama jadi terlalu agresif, false positive naik. Tidak ada yang salah dengan modelnya; yang berubah hanya komposisi trafiknya. Tandanya: PSI fitur tinggi, tetapi precision yang diukur pada sampel berlabel matang TETAP stabil. Kalibrasi ulang threshold di data periode promo, selesai dalam 2 hari.",
        "Opsi A wajib ketika yang terjadi adalah concept drift: makna fitur berubah. Contoh: \"velocity tinggi\" tiga bulan lalu berarti carding, kini berarti flash sale TikTok Shop yang memang ramai. Model lama membaca sinyal yang benar dengan kamus yang kedaluwarsa. Tandanya: precision anjlok pada data berlabel matang, PSI fitur tinggi, dan pola baru terkonfirmasi investigasi. Syarat mutlaknya: retrain hanya dengan label yang sudah matang (embargo!) — retrain di tengah serangan aktif berarti mengajari model bahwa pola musuh adalah \"normal\".",
        "Opsi C — jangan sentuh model — adalah jawaban untuk drift instrumentasi seperti kasus device_id v4.2. Tandanya: drift berkorelasi dengan deploy, migrasi, atau perubahan SDK, bukan dengan pola serangan. Memperbaiki model untuk bug pipeline sama dengan mengobati termometer karena pasien demam: angkanya membaik, penyakitnya tetap.",
        "Biaya salah pilih itu asimetris dan perlu dihitung eksplisit. Retrain padahal cukup kalibrasi: Rp500 juta + 4 bulan untuk hasil yang sebenarnya bisa dicapai Rp5 juta dalam 2 hari. Kalibrasi padahal butuh retrain: model buta terhadap pola baru selama berbulan-bulan, loss berjalan terus. Retrain saat penyebabnya instrumentasi: yang paling mahal — meracuni model yang tadinya sehat, lalu butuh retrain KEDUA untuk memperbaikinya. Setiap keputusan drift sebaiknya ditulis sebagai satu paragraf: jenis drift apa (bukti), opsi apa (alasan), biaya apa (angka).",
        "Jadikan ini SOP: setiap alarm PSI > 0,25 wajib menghasilkan satu dokumen keputusan — retrain, kalibrasi, atau perbaiki pipeline — dalam 48 jam. Alarm tanpa keputusan adalah alarm yang melatih tim untuk mengabaikan alarm berikutnya. Monitoring yang baik bukan yang paling sering berbunyi, melainkan yang setiap bunyinya berujung pada tindakan yang tercatat.",
      ],
      tasks: [],
      reference: "Covariate shift → kalibrasi (Rp5 jt). Concept drift → retrain (Rp500 jt, tunggu label matang). Instrumentasi → perbaiki pipeline, jangan sentuh model.",
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
        "Random split tidak valid untuk fraud — pakai time-based split + embargo.",
        "Tiga drift: concept P(y|x), data P(x), label P(y).",
        "Adversarial adaptation: musuh belajar dari modelmu — siklus 2–6 bulan, selamanya.",
        "PSI = alarm asap (<0,1 aman; 0,1–0,25 waspada; >0,25 drift) — investigasi sebelum retrain.",
        "Serangan pola baru → rule darurat dulu (jembatan 90 hari), retrain setelah label matang.",
      ],
      next: { label: "FR11 — Threshold", href: "/v2/learn/fr11-threshold" },
      quiz: [
        {
          q: "Mengapa random split TIDAK valid untuk validasi model fraud?",
          options: [
            { text: "Terlalu lambat", why: "Kecepatan bukan masalahnya — kejujurannya." },
            { text: "Data validasi mengandung pola dari periode yang sama dengan training — model 'mencontek masa depan', angka validasi bohong", why: "Validasi harus mensimulasikan 'menghadapi masa depan' — hanya time split yang jujur.", correct: true },
            { text: "Tidak bisa dihitung", why: "Bisa dihitung — hanya hasilnya menipu." },
            { text: "Hanya untuk data kecil", why: "Berlaku untuk semua ukuran — ini soal dimensi waktu." },
          ],
        },
        {
          q: "\"Device baru dulu 80% fraud, kini 30% fraud.\" Ini jenis drift apa?",
          options: [
            { text: "Data drift — P(x) berubah", why: "Distribusi device baru belum tentu berubah — yang berubah artinya." },
            { text: "Concept drift — P(y|x) berubah: arti fitur yang sama berubah", why: "Fitur yang sama (device baru), makna yang berbeda. Model lama yang 'percaya' device baru = curiga akan salah arah.", correct: true },
            { text: "Label drift — P(y) berubah", why: "Base rate belum tentu berubah — yang berubah hubungan fitur-target." },
            { text: "Bukan drift", why: "Ini drift yang klasik: makna fitur berubah seiring waktu." },
          ],
        },
        {
          q: "Apa yang membuat drift di fraud BERBEDA dari drift di domain lain (mis. prediksi cuaca)?",
          options: [
            { text: "Tidak ada bedanya", why: "Ada: cuaca tidak belajar dari modelmu." },
            { text: "Adversarial adaptation — drift disengaja oleh lawan cerdas yang belajar dari modelmu; tiap kekalahan mereka = pelajaran gratis", why: "Cuaca tidak 'belajar' dari model prediksimu; penipu ya. Model statis = target latihan.", correct: true },
            { text: "Drift fraud lebih lambat", why: "Justru bisa lebih cepat — siklus adaptasi 2–6 bulan." },
            { text: "Drift fraud tidak bisa dideteksi", why: "Bisa dideteksi dengan PSI dan monitoring performa." },
          ],
        },
        {
          q: "PSI = 0,31 pada distribusi skor model. Tindakan tepat?",
          options: [
            { text: "Retrain otomatis sekarang juga", why: "Retrain buta bisa mengajari model pola serangan sebagai 'normal' (label belum matang)." },
            { text: "Investigasi dulu: pahami apa yang berubah (wajar vs musuh), lalu putuskan — jangan retrain buta pada label yang belum matang", why: "PSI = alarm asap, bukan perintah retrain.", correct: true },
            { text: "Abaikan", why: "0,31 > 0,25 = drift signifikan — mengabaikan = model membusuk." },
            { text: "Matikan model", why: "Terlalu ekstrem sebelum investigasi — mungkin cuma drift musiman." },
          ],
        },
        {
          q: "Pola serangan baru terdeteksi hari ini; label matang butuh 90 hari. Respons terbaik?",
          options: [
            { text: "Tunggu 90 hari lalu retrain", why: "Menunggu = 90 hari kebobolan." },
            { text: "Matikan semua pertahanan", why: "Mematikan pertahanan = menyerah total." },
            { text: "Rule darurat sekarang (tahan serangan) + investigasi + retrain setelah label matang", why: "Rule darurat = jembatan 90 hari. Retrain sekarang = label bohong.", correct: true },
            { text: "Naikkan threshold model lama", why: "Model lama buta terhadap pola baru — menaikkan threshold tidak menangkap yang tak dikenalnya." },
          ],
        },
      ],
    },
  ],
};

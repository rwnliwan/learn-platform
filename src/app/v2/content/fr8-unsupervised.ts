import type { V2Lesson } from "../lib/types";

export const fr8: V2Lesson = {
  slug: "fr8-unsupervised",
  track: "Fraud & AML Analytics",
  module: "Machine Learning",
  title: "FR8 — Unsupervised Anomaly Detection",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Serangan yang tak ada di buku",
      prose: [
        "Januari 2026, e-wallet \"DanaKita\" meluncurkan fitur \"Patungan Online\". Tiga minggu kemudian, Rp340 juta hilang lewat pola yang belum pernah ada: 300 akun membuat 1.500 \"patungan\" fiktif Rp200–300 ribu, mengundang akun-akun boneka sebagai peserta, lalu menarik dananya sebelum \"acara\" tiba.",
        "Model supervised mereka — yang hebat menangkap carding dan ATO — skornya 0,12 untuk semua transaksi ini. \"Normal,\" katanya. Tentu saja: ia tidak pernah dilatih melihat pola ini. Label untuk serangan baru butuh 3 bulan matang. Selama 3 bulan itu, siapa yang menjaga?",
        "Yang akhirnya menangkap adalah Isolation Forest 20 baris yang dipasang \"sementara\" saat peluncuran — yang menemukan anomali \"300 akun dengan pola patungan identik\" di minggu ke-2. Supervised menjaga dari musuh yang dikenal; unsupervised menjaga dari musuh yang belum punya nama. Keduanya dibutuhkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Batas jujurnya: unsupervised tidak tahu apa itu \"fraud\" — ia hanya tahu \"aneh\". Transaksi aneh-tapi-legit (mahar pernikahan Rp50 juta sekali seumur hidup) ikut ketangkap. Unsupervised = mesin kandidat, bukan mesin vonis. Vonis tetap butuh investigator atau label.",
      },
      reference: "Supervised bertanya \"apakah ini seperti fraud yang pernah kulihat?\"; unsupervised bertanya \"apakah ini seperti apapun yang pernah kulihat?\"",
    },
    {
      id: "kapan",
      eyebrow: "Langkah 2 · Kapan unsupervised",
      title: "4 situasi tanpa label",
      prose: [
        "Satu: produk/fitur baru, nol label — supervised tidak bisa jalan tanpa label. Dua: serangan baru (zero-day fraud) — pola belum ada di training data; supervised buta. Tiga: eksplorasi — \"ada apa di data kami yang belum kami ketahui?\" Clustering anomali menemukan pola untuk dijadikan rule baru. Empat: pelapis (ensemble) — skor anomali sebagai fitur untuk model supervised; \"seberapa aneh transaksi ini menurut IF?\" adalah fitur yang kuat.",
        "Tiga metode utama. Isolation Forest: anomali = mudah diisolasi (sedikit split). LOF: anomali = tetangga yang jauh (kepadatan lokal). Autoencoder: latih \"meniru\" normal; anomali = gagal ditiru (reconstruction error besar).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Isolation Forest tidak butuh parameter — unsupervised = bebas tuning.\" Contamination adalah parameter yang menentukan segalanya dan tidak bisa dipelajari dari data (tidak ada label!). \"Unsupervised\" bukan berarti \"tanpa asumsi\" — asumsinya hanya disembunyikan di parameter.",
      },
      reference: "Unsupervised = mesin kandidat, bukan mesin vonis. Hasil terbaiknya = rule baru atau fitur baru.",
    },
    {
      id: "iforest",
      eyebrow: "Langkah 3 · Isolation Forest",
      title: "Anomali = mudah diisolasi",
      prose: [
        "Ide inti satu kalimat: bangun pohon dengan split acak; titik yang terisolasi dalam sedikit split = anomali, karena ia \"berdiri sendiri\" jauh dari kerumunan. Analogi: di kelas 200 murid berseragam, \"siswa bertopi merah\" teridentifikasi dalam 1 pertanyaan. Siswa normal butuh banyak pertanyaan bertingkat.",
        "Parameter terpenting: contamination = perkiraan % anomali di data (mis. 0,01 untuk 1%). Ini menentukan ambang: \"anggap 1% skor tertinggi sebagai anomali.\" Contoh: anomali sejati 2%. Set contamination 0,1% → hanya tangkap 28% (terlalu sempit). Set 10% → 58% tapi banjir false positive. Set 2% (tebakan benar) → 74%, terbaik. Contamination bukan hyperparameter untuk grid-search buta — ia asumsi bisnis yang harus dijustifikasi.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `kedalaman_isolasi(x, data)` (split acak rekursif)" },
        { id: "t2", text: "Bandingkan kedalaman rata-rata 5 anomali vs 3 titik normal" },
        { id: "t3", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "Anomali: kedalaman ~3 (mudah diisolasi) | Normal: kedalaman ~11-15 (sulit diisolasi)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Unsupervised bisa menggantikan supervised — tidak butuh label sama sekali.\" Unsupervised tidak mengenal \"fraud\" — hanya \"aneh\". Tanpa label, kamu tidak bisa mengukur precision/recall, tidak bisa tuning threshold secara prinsipil, dan tidak bisa membedakan \"aneh jahat\" dari \"aneh wajar\". Peran tepatnya: deteksi dini + eksplorasi + fitur untuk supervised.",
      },
      hints: [
        "Base case: len(data) <= 1 atau depth > 20 → return depth.",
        "Pilih split acak antara min dan max; simpan sisi yang sama dengan x.",
        "Rekursi: kedalaman_isolasi(x, sisa, depth + 1).",
      ],
      code: {
        starter: `# Isolation Forest INTI: anomali = mudah diisolasi (sedikit split).\n# 200 normal (sekitar 0), 5 anomali (jauh).\nimport random\nrandom.seed(3)\nnormal = [random.gauss(0, 1) for _ in range(200)]\nanomali = [8.5, -7.2, 9.1, -8.8, 7.9]\nsemua = [(x, "normal") for x in normal] + [(x, "ANOMALI") for x in anomali]\n\n# TULIS KODEMU: kedalaman isolasi via split acak\ndef kedalaman_isolasi(x, data, depth=0):\n    if len(data) <= 1 or depth > 20:\n        return depth\n    lo, hi = min(d for d, _ in data), max(d for d, _ in data)\n    if hi == lo:\n        return depth\n    split =\n    sisa =\n    return \n\nprint("Anomali (harusnya kedalaman KECIL):")\nfor x in anomali:\n    d = sum(kedalaman_isolasi(x, semua) for _ in range(10)) / 10\n    print(f"  x={x:+5.1f}  kedalaman={d:4.1f}")\nprint("Normal (harusnya kedalaman BESAR):")\nfor x in [0.1, -0.5, 0.8]:\n    d = sum(kedalaman_isolasi(x, semua) for _ in range(10)) / 10\n    print(f"  x={x:+5.1f}  kedalaman={d:4.1f}")`,
        lockLines: 8,
        solution: `# Isolation Forest INTI: anomali = mudah diisolasi (sedikit split).\n# 200 normal (sekitar 0), 5 anomali (jauh).\nimport random\nrandom.seed(3)\nnormal = [random.gauss(0, 1) for _ in range(200)]\nanomali = [8.5, -7.2, 9.1, -8.8, 7.9]\nsemua = [(x, "normal") for x in normal] + [(x, "ANOMALI") for x in anomali]\n\n# TULIS KODEMU: kedalaman isolasi via split acak\ndef kedalaman_isolasi(x, data, depth=0):\n    if len(data) <= 1 or depth > 20:\n        return depth\n    lo, hi = min(d for d, _ in data), max(d for d, _ in data)\n    if hi == lo:\n        return depth\n    split = random.uniform(lo, hi)\n    sisa = [(d, l) for d, l in data if (d <= split) == (x <= split)]\n    return kedalaman_isolasi(x, sisa, depth + 1)\n\nprint("Anomali (harusnya kedalaman KECIL):")\nfor x in anomali:\n    d = sum(kedalaman_isolasi(x, semua) for _ in range(10)) / 10\n    print(f"  x={x:+5.1f}  kedalaman={d:4.1f}")\nprint("Normal (harusnya kedalaman BESAR):")\nfor x in [0.1, -0.5, 0.8]:\n    d = sum(kedalaman_isolasi(x, semua) for _ in range(10)) / 10\n    print(f"  x={x:+5.1f}  kedalaman={d:4.1f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "kedalaman_isolasi", label: "`kedalaman_isolasi` terdefinisi", msg: "Buat fungsi kedalaman_isolasi(x, data, depth=0)." },
          { kind: "stdout_matches", task: "t2", pattern: "x=\\s*\\+8\\.5\\s+kedalaman=\\s*3\\.3", label: "Anomali x=8.5 mudah diisolasi", msg: "Anomali terisolasi dalam ~3 split — jauh di bawah titik normal." },
          { kind: "stdout_matches", task: "t2", pattern: "x=\\s*\\+0\\.1\\s+kedalaman=\\s*11\\.0", label: "Titik normal sulit diisolasi", msg: "Titik normal butuh ~11 split — bergerombol dengan 200 titik lain." },
        ],
      },
      reference: "Contamination = asumsi bisnis, bukan hyperparameter buta. Salah tebak = salah ambang total.",
    },
    {
      id: "lof-ae",
      eyebrow: "Langkah 4 · LOF & Autoencoder",
      title: "Tetangga yang jauh, dan yang gagal ditiru",
      prose: [
        "LOF (Local Outlier Factor) membandingkan kepadatan lokal suatu titik dengan kepadatan tetangganya. Titik di daerah jarang yang dikelilingi daerah padat = anomali. Kapan mengalahkan Isolation Forest: data multi-densitas — transaksi ritel (padat, kecil-kecil) vs korporat (jarang, besar-besar). IF dengan satu ambang global akan menandai semua transaksi korporat sebagai anomali; LOF menilai \"aneh dibanding tetangganya\". Harganya: mahal komputasi (O(n²) naif) — untuk batch/offline, bukan real-time.",
        "Autoencoder: latih neural network untuk meniru inputnya (kompres → rekonstruksi) hanya pada data normal, lalu ukur reconstruction error. Anomali = \"tidak bisa ditiru\" apa yang tidak pernah dipelajarinya. Syarat mati-hidup: data latih harus (cukup) bersih. Latih pada data kotor (campur fraud) = mengajari model meniru fraud = buta.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mu` dari `train_normal` (data bersih!)" },
        { id: "t2", text: "Implementasikan `reconstruction_error(x)` = |x - mu|" },
        { id: "t3", text: "Tandai ANOMALI jika error > 40, cetak 8 data uji" },
      ],
      expected: "nominal 500, 20, 1000 = ANOMALI; sisanya normal",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analogi pemalsu uang: ia hanya pernah melihat Rp100 ribu asli. Disodori Rp100 ribu palsu yang bagus — ia menirunya dengan baik (lolos!). Disodori uang Monopoli — ia gagal total (tertangkap). Autoencoder hanya pandai meniru yang pernah dilihatnya.",
      },
      hints: [
        "mu = st.mean(train_normal) — latih HANYA pada data normal.",
        "reconstruction_error(x) = abs(x - mu).",
        "status = 'ANOMALI' jika err > 40 else 'normal'.",
      ],
      code: {
        starter: `# Autoencoder INTI: latih 'meniru' normal; anomali = gagal ditiru.\n# Model super-sederhana: prediksi = mean. Error = |x - mean|.\nimport random, statistics as st\nrandom.seed(8)\n\ntrain_normal = [random.gauss(100, 10) for _ in range(500)]  # nominal normal (rb Rp)\n\n# TULIS KODEMU\nmu =\n\ndef reconstruction_error(x):\n    return \n\nuji = [95, 105, 110, 90, 500, 20, 1000, 98]\nambang = 40\nfor x in uji:\n    err = reconstruction_error(x)\n    status = "ANOMALI" if err > ambang else "normal"\n    print(f"nominal={x:4d}  error={err:6.1f}  {status}")`,
        lockLines: 6,
        solution: `# Autoencoder INTI: latih 'meniru' normal; anomali = gagal ditiru.\n# Model super-sederhana: prediksi = mean. Error = |x - mean|.\nimport random, statistics as st\nrandom.seed(8)\n\ntrain_normal = [random.gauss(100, 10) for _ in range(500)]  # nominal normal (rb Rp)\n\n# TULIS KODEMU\nmu = st.mean(train_normal)\n\ndef reconstruction_error(x):\n    return abs(x - mu)\n\nuji = [95, 105, 110, 90, 500, 20, 1000, 98]\nambang = 40\nfor x in uji:\n    err = reconstruction_error(x)\n    status = "ANOMALI" if err > ambang else "normal"\n    print(f"nominal={x:4d}  error={err:6.1f}  {status}")`,
        checks: [
          { kind: "defined", task: "t2", name: "reconstruction_error", label: "`reconstruction_error` terdefinisi", msg: "Buat fungsi reconstruction_error(x)." },
          { kind: "stdout_matches", task: "t3", pattern: "nominal=\\s*500\\s+error=\\s*399\\.9\\s+ANOMALI", label: "nominal 500 = ANOMALI", msg: "|500 - 100| ≈ 400 > 40 → ANOMALI." },
          { kind: "stdout_matches", task: "t3", pattern: "nominal=\\s*98\\s+error=\\s*2\\.1\\s+normal", label: "nominal 98 = normal", msg: "|98 - 100| ≈ 2 < 40 → normal." },
        ],
      },
      reference: "Autoencoder wajib latih pada data bersih. Untuk tabel sederhana, Isolation Forest cukup.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Metode apa, kapan",
      prose: [
        "Satu: butuh cepat, murah, real-time → Isolation Forest. Contoh: \"penjaga sementara\" DanaKita saat peluncuran fitur baru. Dua: data multi-densitas (ritel vs korporat) → LOF. Tiga: pola kompleks, data latih bersih tersedia → Autoencoder. Empat: sudah ada label matang → supervised (kembali ke FR7) — unsupervised turun jadi fitur pelapis.",
        "Kasus nyata: merchant fiktif mendaftarkan toko abal-abal, menggesek kartu curian di tokonya sendiri. Yang ditemukan clustering + IF: settlement velocity ekstrem (merchant umur 12 hari, settlement Rp380jt vs median seumur Rp4jt = 95x lipat), ticket size seragam (95% transaksi tepat Rp1.850.000), jam transaksi 80% di 01.00–04.00, refund rate 0%. Angka ilustratif: 35 merchant fiktif x Rp380jt = Rp13,3 miliar settlement fraud dalam 1 kuartal — lolos dari rule & supervised karena tidak ada label saat itu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Anomali ≠ fraud — anomali = \"tidak biasa\", fraud = \"jahat\". Sultan yang belanja Rp500jt/tahun adalah anomali statistik tapi pelanggan terbaikmu. Unsupervised menemukan yang aneh; investigator (dan label) menentukan yang jahat. Jangan pernah auto-block dari skor unsupervised murni.",
      },
      reference: "Nilai unsupervised terbesar bukan di skornya — tapi di eksplorasinya. Jadwalkan \"jam eksplorasi\" mingguan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Produk baru, nol label, 30 hari",
      prose: [
        "Kamu Head of Fraud di bank yang meluncurkan transfer BI-FAST ke e-wallet minggu depan. Nol histori, nol label. Direksi bertanya: \"Bagaimana kita tidak kebobolan seperti DanaKita?\" Kamu punya 30 hari sebelum peluncuran untuk menyiapkan pertahanan. Rancang rencana 30 hari: apa yang dipasang hari H-30, H-7, H+1, H+30?",
        "Pembahasan: H-30: rule pakar dari produk sejenis (velocity, nominal, device baru) — ditulis dari pengalaman investigator, bukan data. H-7: Isolation Forest dilatih pada transaksi normal produk sejenis terdekat (transfer antarbank) sebagai \"penjaga sementara\" + definisi contamination awal (asumsi 0,5%). H+1 (peluncuran): semua rule + IF jalan dalam mode monitor + hold selektif; investigator siaga dengan guideline \"kasus baru\". H+7 s.d. H+30: tiap anomali IF yang terkonfirmasi investigator → jadi rule baru atau label pertama untuk supervised mini.",
        "Pertahanan produk baru = tangga: rule (hari 1) → unsupervised (minggu 1) → label terkumpul → supervised (bulan 3+). Tidak ada lompatan.",
      ],
      tasks: [],
      reference: "Unsupervised untuk minggu pertama, supervised untuk bulan berikutnya.",
    },
    {
      id: "gagal-produksi",
      eyebrow: "Langkah 7 · Kegagalan unsupervised di produksi",
      title: "Contamination 0,1% vs anomali 2%: Rp312 juta sehari",
      prose: [
        "E-wallet 'DanaKita', 200.000 transaksi per hari, fraud rate aktual 0,3% = 600 fraud per hari. Tim data science men-deploy Isolation Forest dengan contamination=0,1% — nilai default library, 'kelihatannya konservatif'. Model menandai 200 transaksi per hari. Dengan precision realistis 40%: 80 true positive, 120 false positive. Recall = 80/600 = 13%. Artinya 520 fraud lolos setiap hari × Rp600 ribu = Rp312 juta loss per hari — sambil dashboard memamerkan 'precision 40%, sistem berjalan normal'. Kata 'konservatif' di sini berarti: konservatif dalam menandai, boros dalam kehilangan. Default parameter bukan keputusan netral; ia adalah keputusan yang dibuat oleh orang yang tidak tahu bisnismu.",
        "Skenario baliknya sama buruknya. Misal tim panik melihat recall 13% lalu menaikkan contamination ke 5%: 10.000 alert per hari. Kapasitas investigator 1.500 per hari. Antrean meledak — alert basi 7 hari sebelum dibaca; fraud yang terdeteksi hari Senin baru ditindak Senin depan, saat dananya sudah di bulan. Investigator berhenti percaya pada sistem ('toh 95% sampah') dan mulai skip massal; precision efektif anjlok ke 5%. Biaya: 9.500 FP × Rp25 ribu = Rp237,5 juta per hari untuk review sia-sia. Dua sisi jurang: contamination terlalu kecil = buta; terlalu besar = tenggelam. Dan jurangnya tidak terlihat dari notebook — hanya dari operasi.",
        "Akar masalahnya: contamination BUKAN parameter teknis — ia adalah prior belief tentang dunia. Menulis contamination=0,1% artinya mengklaim '99,9% data ini normal' — klaim tentang dunia yang dibuat tanpa melihat dunia. Di fraud, klaim itu hampir selalu salah: fraud rate 0,3%, anomali non-fraud (sultan belanja, error sistem, promo) 1–2% — total 'aneh' yang wajar 2–3%, bukan 0,1%. Model yang diberi prior salah tidak 'sedikit bias' — ia menjawab pertanyaan yang salah dengan percaya diri. Maka aturan pertama kalibrasi: contamination adalah hipotesis bisnis, bukan konstanta library. Tulis alasannya di dokumentasi: 'kami set 1% karena fraud historis 0,3% + anomali non-fraud estimasi 0,7%'. Bila tidak bisa menulis kalimat itu, jangan deploy.",
        "Aturan kalibrasi yang bekerja di produksi. Satu: mulai dari fraud rate historis produk sejenis (0,3% di contoh ini) — data, bukan default. Dua: contamination ≈ 2–3x fraud rate — beri ruang untuk anomali non-fraud yang juga ingin ditemukan (error sistem, bug promo). Tiga: threshold AKHIR ditentukan oleh KAPASITAS, bukan oleh contamination — alert per hari ≤ 80% kapasitas investigator; bila contamination 1% menghasilkan 2.000 alert vs kapasitas 1.500, naikkan threshold (bukan turunkan contamination secara membabi buta). Empat: kalibrasi ulang tiap kuartal dan tiap ada drift produk (fitur baru = distribusi baru = prior lama kedaluwarsa). Lima: jangan pernah auto-block dari skor unsupervised murni (FR8 langkah 5) — skornya untuk triage, keputusannya untuk manusia + threshold ekonomis (FR9).",
        "Contoh kalibrasi yang benar, langkah demi langkah. Data: 200.000 trx/hari, fraud historis 0,3%, kapasitas 1.500 review/hari. Set contamination=1% (3x fraud rate — ruang untuk anomali non-fraud). Model menandai 2.000/hari — melebihi kapasitas. Naikkan threshold skor hingga alert = 1.200/hari (80% kapasitas, buffer 20% untuk spike). Ukur precision pada 1.200 itu via sampling investigasi 2 minggu: misal 35% → 420 TP/hari, recall = 420/600 = 70%. Bandingkan dengan contamination 0,1%: recall 13%. Kenaikan recall 57 poin 'hanya' dengan mengganti prior dan threshold — tanpa menyentuh algoritma sama sekali. Pelajaran yang mahal: kebanyakan 'kegagalan model' adalah kegagalan kalibrasi; algoritmanya tidak bersalah.",
        "Praktik terbaik yang jarang dilakukan: jangan pakai LABEL unsupervised — pakai SKOR-nya sebagai fitur. Ambil skor anomaly Isolation Forest sebagai salah satu fitur untuk model supervised (atau untuk triage FR14). Efeknya: supervised yang menentukan threshold ekonomisnya (dengan label dan harga FP/FN yang benar), sementara skor unsupervised menyumbang sinyal 'keanehan' yang tidak ditangkap fitur lain. Hasil tipikal: recall naik 5–8 poin tanpa menambah alert — karena yang dioptimalkan adalah kombinasi, bukan threshold buta. Unsupervised sebagai fitur = discovery yang jujur. Unsupervised sebagai keputusan = tebakan yang mahal.",
        "Checklist pre-produksi untuk setiap model unsupervised — tempel di template deploy. ☐ Contamination dibenarkan data historis (bukan default library) — tertulis alasannya. ☐ Alert per hari ≤ 80% kapasitas investigator — dihitung, bukan diasumsikan. ☐ Ada jalur label balik: investigasi → label → kalibrasi ulang kuartalan (tanpa ini, model membusuk diam-diam). ☐ Tidak ada auto-block dari skor murni — keputusan selalu lewat threshold ekonomis atau manusia. ☐ Monitoring drift: distribusi skor dipantau harian; bila median skor bergeser > 20% dalam seminggu, investigasi (bukan tuning buta). ☐ Dokumentasi 'apa yang TIDAK ditangkap model ini' — untuk mengelola ekspektasi bisnis. Enam kotak; satu saja kosong = belum layak produksi.",
        "Kasus nyata pola kegagalan: merchant fiktif (FR8 langkah 5) hampir lolos BUKAN karena algoritmanya salah — Isolation Forest sebenarnya memberi skor tinggi pada merchant-merchant itu. Ia lolos karena contamination 0,05% memotong tepat di bawah skor mereka: 35 merchant fiktif × Rp380 juta = Rp13,3 miliar settlement fraud dalam 1 kuartal tidak masuk 0,05% teratas karena 'terlalu banyak' untuk prior yang salah. Ironisnya, modelnya BENAR dan keputusannya SALAH — dipisahkan oleh satu parameter. Setelah contamination dikalibrasi ke 0,5% + threshold dari kapasitas, 31 dari 35 tertangkap kuartal berikutnya. Pelajarannya: audit parameter sebelum mengganti algoritma.",

        "Setiap algoritma punya 'contamination'-nya sendiri — nama yang berbeda, dosa yang sama. LOF: n_neighbors=20 default — mengasumsikan kepadatan lokal seragam; di data campuran ritel+korporat (multi-densitas, FR8 langkah 4), tetangga korporat selalu 'jauh' → false positive massal. Autoencoder: threshold reconstruction error — 'berapa error yang dianggap gagal ditiru' — tanpa kalibrasi dari data bersih, threshold ini tebakan buta; terlalu ketat = sultan yang belanja Rp500 juta ditandai (ia pelanggan terbaikmu, bukan fraud). Aturannya universal: setiap hyperparameter yang menentukan 'berapa banyak yang ditandai' adalah prior bisnis — kalibrasikan dari data, dokumentasikan alasannya, tinjau berkala. Tidak ada default yang netral.",
        "Drift membunuh kalibrasi yang tadinya benar. Contoh: contamination 1% terkalibrasi Januari (fraud 0,3%). Juni: peluncuran fitur 'cicilan 0%' mengubah distribusi transaksi — anomali non-fraud naik ke 2,5% (perilaku cicilan baru terlihat 'aneh' bagi model lama). Tiba-tiba 1% teratas penuh sesak oleh cicilan normal; fraud tenggelam di dalamnya; precision anjlok 35% → 12% dalam 3 minggu — tanpa satu baris kode pun berubah. Solusinya bukan 'naikkan contamination' (tebakan baru), melainkan kalibrasi ulang terjadwal: tiap peluncuran fitur besar = rekalibrasi wajib 2 minggu setelahnya, dengan jendela data baru. Kalibrasi adalah langganan, bukan pembelian sekali bayar.",
        "Cara menjelaskan contamination ke direksi (tanpa kata 'hyperparameter'). 'Bayangkan satpam mal diperintah: tahan 0,1% pengunjung yang paling mencurigakan. Mal dikunjungi 200.000 orang sehari — ia menahan 200. Padahal copetnya 600. Ia menahan 200 orang (80 copet + 120 pembeli sah yang tersinggung), 520 copet lolos. Perintah 'tahan 0,1%' kedengarannya tegas — tapi ia salah hitung jumlah copetnya. Tugas kita bukan mengganti satpamnya (algoritmanya bagus) — tapi memperbaiki perintahnya: tahan 1%, dan prioritaskan yang paling mencurigakan.' Analogi ini bekerja karena memindahkan masalah dari 'model bodoh' ke 'instruksi salah' — dan instruksi bisa diperbaiki Senin pagi tanpa proyek 6 bulan.",
        "Ringkasnya, kegagalan unsupervised di produksi. Satu: contamination adalah prior belief tentang dunia — 0,1% default vs 2% realita = Rp312 juta/hari. Dua: terlalu kecil = buta (recall 13%), terlalu besar = tenggelam (10.000 alert vs 1.500 kapasitas). Tiga: kalibrasi dari fraud rate historis (2–3x), threshold akhir dari kapasitas (≤80%). Empat: kalibrasi ulang kuartalan + tiap drift produk. Lima: pakai skor sebagai fitur supervised, bukan sebagai vonis. Enam: tidak ada auto-block dari skor murni — pernah, titik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: unsupervised bukan tanpa label — ia meminjam label dari masa lalu",
        type: "risk",
        body: "Kata 'unsupervised' terdengar seperti 'tanpa asumsi' — dan itu menipu. Parameter contamination adalah asumsi yang diselundupkan: ia mendeklarasikan tingkat anomali SEBELUM melihat data. Setiap model unsupervised sebenarnya disupervisi oleh prior-mu tentang dunia. Maka saat model gagal di produksi, jangan sentuh algoritmanya dulu — interogasi prior-nya: 'apa yang kami asumsikan tentang dunia, dan seperti apa dunia sebenarnya?' Sembilan dari sepuluh kegagalan unsupervised yang saya lihat adalah prior yang salah, bukan algoritma yang salah. Kedua, penggunaan jujur dari unsupervised adalah discovery, bukan decision: ia menemukan kandidat; ekonomi (kapasitas, harga FP/FN) yang memutuskan. Ketiga, prior yang tidak tertulis = prior yang tidak bisa dikalibrasi — tulis 'kami set 1% karena...' di dokumentasi, atau prior itu akan membusuk diam-diam sementara semua orang mengira modelnya 'baik-baik saja'. Keempat, curigai skor yang 'terlalu stabil': distribusi skor anomaly yang tidak berubah selama 6 bulan di produk yang aktif hampir pasti berarti modelnya tidak lagi melihat dunia — entah datanya stale atau pipelinenya rusak; model yang hidup berdenyut mengikuti drift. Kelima, ingat hierarki bukti: skor unsupervised = petunjuk, label investigasi = kesaksian, pola terkonfirmasi = vonis. Jangan menghukum berdasarkan petunjuk; gunakan petunjuk untuk menemukan kesaksian. Itulah seluruh etika unsupervised dalam dua kalimat.",
      },
      reference: "Contamination = tebakanmu tentang dunia. Kalibrasi dari fraud rate historis; threshold dari kapasitas.",
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
        "Supervised = \"seperti fraud yang pernah kulihat?\"; unsupervised = \"seperti apapun yang pernah kulihat?\" — untuk pola baru & nol label.",
        "Isolation Forest: anomali = cepat terisolasi; contamination = asumsi bisnis penentu ambang.",
        "LOF: anomali = kepadatan jauh di bawah tetangga — untuk data multi-densitas; mahal komputasi.",
        "Autoencoder: reconstruction error — wajib latih pada data bersih; untuk pola kompleks non-linear.",
        "Unsupervised = mesin kandidat, bukan vonis. Output terbaik: rule baru atau fitur baru untuk supervised.",
      ],
      next: { label: "FR9 — Evaluasi", href: "/v2/learn/fr9-evaluasi" },
      quiz: [
        {
          q: "Ide inti Isolation Forest dalam satu kalimat?",
          options: [
            { text: "Menghitung jarak ke tetangga terdekat", why: "Itu LOF, bukan Isolation Forest." },
            { text: "Split acak berulang — titik yang terisolasi dalam sedikit split = anomali", why: "Anomali 'berdiri sendiri' sehingga cepat terisolasi oleh split acak. Normal butuh banyak split untuk dipisahkan dari kerumunan.", correct: true },
            { text: "Meniru data normal dengan neural network", why: "Itu autoencoder, bukan Isolation Forest." },
            { text: "Menghitung rata-rata", why: "Rata-rata tidak mendeteksi anomali multivariat." },
          ],
        },
        {
          q: "Kamu set contamination=0,1% padahal anomali sejati 2%. Akibatnya?",
          options: [
            { text: "Tidak ada efek", why: "Contamination menentukan ambang — selalu ada efek." },
            { text: "Hanya 28% anomali tertangkap — ambang terlalu sempit karena asumsi salah", why: "Contamination menentukan ambang ('anggap X% teratas sebagai anomali'). Salah asumsi = salah ambang total. Ini asumsi bisnis, bukan angka ajaib.", correct: true },
            { text: "Semua tertangkap", why: "Ambang 0,1% justru terlalu sempit untuk anomali 2%." },
            { text: "Model error", why: "Model tidak error — ia menjalankan asumsi yang salah dengan benar." },
          ],
        },
        {
          q: "Data punya dua kepadatan: ritel (padat, kecil) dan korporat (jarang, besar). Metode terbaik?",
          options: [
            { text: "Isolation Forest dengan ambang global", why: "Ambang global akan menandai seluruh transaksi korporat (Rp1 M yang normal di dunianya) sebagai anomali." },
            { text: "LOF — menilai 'aneh dibanding tetangganya', tidak menandai semua korporat sebagai anomali", why: "LOF relatif terhadap lingkungan lokal.", correct: true },
            { text: "Rata-rata", why: "Rata-rata global justru sumber masalahnya di data multi-densitas." },
            { text: "Hapus data korporat", why: "Menghapus data = membuang bisnis, bukan solusi." },
          ],
        },
        {
          q: "Autoencoder dilatih pada data campur fraud (kotor). Apa yang terjadi?",
          options: [
            { text: "Makin pintar", why: "Ia justru belajar meniru yang salah." },
            { text: "Model belajar meniru fraud juga → reconstruction error fraud mengecil → buta terhadap anomali", why: "Syarat mati-hidup autoencoder = data latih (cukup) bersih. 'Gagal meniru' hanya bermakna jika yang ditiru adalah normal.", correct: true },
            { text: "Tidak ada efek", why: "Efeknya fatal: model buta terhadap anomali." },
            { text: "Training lebih cepat", why: "Kecepatan training tidak berubah; yang berubah kualitas deteksinya." },
          ],
        },
        {
          q: "Peran PALING tepat unsupervised dalam arsitektur fraud dewasa?",
          options: [
            { text: "Menggantikan supervised sepenuhnya", why: "Unsupervised tidak mengenal 'fraud' — hanya 'aneh'. Tidak bisa menggantikan." },
            { text: "Deteksi dini pola baru + eksplorasi + skor anomali sebagai fitur untuk supervised; temuan terbaik jadi rule baru", why: "Unsupervised = jembatan. Ia menemukan 'musuh yang belum punya nama', lalu temuan itu dimatangkan jadi rule atau label untuk supervised.", correct: true },
            { text: "Hanya untuk laporan", why: "Perannya operasional: deteksi dini dan triage, bukan sekadar laporan." },
            { text: "Tidak ada peran", why: "Tanpanya, serangan zero-day lolos 3 bulan menunggu label matang." },
          ],
        },
      ],
    },
  ],
};

import type { V2Lesson } from "../lib/types";

export const fr2: V2Lesson = {
  slug: "fr2-fraud-vs-aml",
  track: "Fraud & AML Analytics",
  module: "Lanskap Fraud",
  title: "FR2 — Fraud vs AML vs Cyber",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu kasus, tiga tim, saling lempar",
      prose: [
        "Bank \"NusaBank\" kehilangan Rp800 juta. Kronologinya: nasabah menerima WA \"undangan pernikahan digital\" (APK), menginstal, lalu 20 menit kemudian saldonya terkuras lewat 14 transfer ke rekening-rekening baru. Tim cyber berkata: \"Ini malware, ranah kami.\" Tim fraud berkata: \"Ini ATO, ranah kami.\" Tim AML berkata: \"Dana diteruskan ke 14 rekening lalu ke luar negeri — ini layering, ranah kami.\"",
        "Ketiganya benar — dan ketiganya salah. Ini satu serangan, tiga lensa. Cyber melihat cara masuknya (malware). Fraud melihat pencurian dananya (uang nasabah hilang). AML melihat pelariannya (uang dicuci). Perusahaan yang tidak paham bedanya akan membangun tiga pertahanan yang tidak nyambung — dan penyerang lewat di celahnya.",
        "Yang bikin mereka berantem bukan egonya, tapi KPI-nya: kemenangan tiap tim diukur dengan metrik yang berbeda, bahkan bertentangan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Kalau fraud-nya ketangkap, otomatis AML-nya beres.\" Menghentikan fraud = menghentikan pencurian; AML = melacak hasilnya dan melapor ke PPATK. Kamu bisa menggagalkan 99% pencurian tapi tetap didenda OJK karena tidak melaporkan 1% yang lolos.",
      },
      reference: "Satu serangan, tiga lensa: cara masuk (cyber), pencurian dana (fraud), pelarian dana (AML).",
    },
    {
      id: "definisi",
      eyebrow: "Langkah 2 · Definisi",
      title: "Tiga perang, tiga musuh, tiga kemenangan",
      prose: [
        "Fraud adalah pemadam kebakaran — uang terbakar sekarang, padamkan sekarang. Kemenangannya diukur dengan rupiah terselamatkan. AML adalah detektif arsip — menelusuri jejak uang berbulan-bulan untuk laporan ke PPATK; kemenangannya diukur dengan kepatuhan pelaporan. Cyber adalah penjaga gerbang — memastikan tembok tidak jebol; kemenangannya diukur dengan MTTR dan tidak adanya breach ulang.",
        "Fraud adalah perlombaan kecepatan: siapa lebih cepat — pencuri mencairkan, atau sistem memblokir. Kasus card-not-present: dari serangan pertama sampai chargeback cuma ±3 jam — keputusan harus otomatis dalam milidetik. AML adalah perlombaan kelengkapan: layering properti butuh 8 bulan direkonstruksi — yang dibutuhkan rantai bukti utuh untuk PPATK, bukan kecepatan.",
        "Dua jam dinding: jam fraud berdetak dalam milidetik — setiap detik penundaan = rupiah hilang. Jam AML berdetak dalam bulan — setiap kesimpulan terburu-buru = jaringan gagal dipetakan + laporan lemah. Analis yang dipindah tim tanpa adaptasi membuat dua kesalahan: di fraud ia terlalu lambat (menunggu \"kepastian\"), di AML ia terlalu cepat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tanyakan pada setiap kasus: \"apakah saya berlomba dengan waktu atau berlomba dengan kelengkapan?\" Jawabannya menentukan segalanya: tools, kecepatan, dokumentasi, bahkan siapa yang harus dibangunkan tengah malam.",
      },
      reference: "Fraud = permainan jumlah (statistik bagus). AML = permainan cerita (bukti utuh untuk PPATK/pengadilan).",
    },
    {
      id: "bayes",
      eyebrow: "Langkah 3 · Base rate fallacy",
      title: "Kenapa 95% alert-mu false positive",
      prose: [
        "Konsep paling penting untuk bertahan hidup sebagai analis fraud. Modelmu punya recall 99% dan false positive rate cuma 1% — terdengar hebat. Tapi base rate fraud 0,2%. Hitung: P(alert) = 0,99 x 0,002 + 0,01 x 0,998 = 0,01196. Presisi = 0,99 x 0,002 / 0,01196 ≈ 17%.",
        "Artinya: dari 100 alert, hanya ~17 yang benar fraud. Model \"99% akurat\" menghasilkan 83% sampah — bukan karena modelnya jelek, tapi karena fraud-nya langka. Inilah base rate fallacy: intuisi manusia mengabaikan kelangkaan. Presisi alert = kualitas model x base rate. Base rate 10x lipat (saat serangan terkoordinasi) membuat alert yang sama 10x lebih bisa dipercaya — tanpa model berubah sedikit pun.",
      ],
      formula: String.raw`P(\text{fraud} \mid \text{alert}) = \frac{P(\text{alert} \mid \text{fraud}) \cdot P(\text{fraud})}{P(\text{alert})}`,
      formulaNote: "Pembilang = recall x base rate. Penyebut = peluang alert berbunyi dari semua transaksi.",
      tasks: [
        { id: "t1", text: "Hitung `p_alert` dari `recall`, `p_fraud`, dan `fpr`" },
        { id: "t2", text: "Hitung `precision` = P(fraud | alert)" },
        { id: "t3", text: "Cetak `p_alert` dan `precision` dengan `print`" },
      ],
      expected: "P(alert)=1.20%  P(fraud|alert)=16.6%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model dengan akurasi 99% pasti menghasilkan sedikit false positive.\" Pada base rate 0,2%, model 99% akurat pun menghasilkan 5x lebih banyak false positive daripada true positive (83 vs 17 dari 100 alert). \"Akurasi\" adalah metrik yang menipu untuk data imbalance — yang relevan adalah presisi.",
      },
      hints: [
        "p_alert = recall*p_fraud + fpr*(1-p_fraud).",
        "precision = recall*p_fraud / p_alert.",
        "precision = recall * p_fraud / p_alert",
      ],
      code: {
        starter: `# Model: recall 99%, FPR 1%. Base rate fraud 0,2%.\np_fraud = 0.002\nrecall  = 0.99\nfpr     = 0.01\n\n# TULIS KODEMU: peluang alert berbunyi, lalu presisi alert\np_alert =\nprecision =\n\nprint(f"P(alert)={p_alert*100:.2f}%  P(fraud|alert)={precision*100:.1f}%")`,
        lockLines: 4,
        solution: `# Model: recall 99%, FPR 1%. Base rate fraud 0,2%.\np_fraud = 0.002\nrecall  = 0.99\nfpr     = 0.01\n\n# TULIS KODEMU: peluang alert berbunyi, lalu presisi alert\np_alert = recall * p_fraud + fpr * (1 - p_fraud)\nprecision = recall * p_fraud / p_alert\n\nprint(f"P(alert)={p_alert*100:.2f}%  P(fraud|alert)={precision*100:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_alert", value: 0.01196, tol: 1e-6, label: "`p_alert` seharusnya 0.01196", msg: "0,99x0,002 + 0,01x0,998 = 0,01196. Cek rumusnya." },
          { kind: "equal", task: "t2", name: "precision", value: 0.1655, tol: 0.002, label: "`precision` sekitar 0.166", msg: "0,99x0,002 / 0,01196 ≈ 0,166. Cek pembaginya." },
          { kind: "stdout_matches", task: "t3", pattern: "P\\(fraud\\|alert\\)=16\\.6%", label: "`print` menampilkan presisi", msg: "Format: P(fraud|alert)=...% seperti contoh." },
        ],
      },
      reference: "Presisi = recall x base rate / P(alert). Analis senior membaca alert dengan konteks base rate.",
    },
    {
      id: "killchain",
      eyebrow: "Langkah 4 · Kill chain",
      title: "7 tahap serangan, 1 titik cukup digagalkan",
      prose: [
        "Cyber Kill Chain memecah serangan menjadi 7 tahap berurutan. Versi fraud-nya: Reconnaissance (pengintaian), Weaponization (siapkan APK/situs phishing), Delivery (WA blast), Exploitation (korban klik, kredensial dicuri), Installation (malware menetap / ATO), Command & Control (kendali jarak jauh), Actions on Objectives / Monetize (kuras dana, pecah ke mule, tarik tunai).",
        "Aturan emas: penyerang harus berhasil di semua tahap; defender cukup menggagalkan satu tahap. 40% loss \"matang\" di tahap monetize — tapi saat itu uang sudah bergerak dan paling mahal dicegah (hold dana = gesekan ke nasabah legit). Tahap kiri (recon–delivery) murah dicegah tapi berisik. Strategi dewasa: pertahanan berlapis — filter murah di kiri untuk volume, kontrol mahal di kanan untuk yang lolos.",
        "Siklus fraud berputar: hasil monetize (uang + data curian) menjadi modal recon berikutnya. Jangan analisis kasus sebagai kejadian tunggal — tanyakan selalu: \"kasus ini output dari siklus apa, dan akan jadi input untuk siklus apa?\"",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dicegah` (serangan terhenti) tiap tahap dari `tahapan`" },
        { id: "t2", text: "Cetak tabel tahap, lolos, biaya, dan dicegah" },
      ],
      expected: "Recon: lolos=600 dicegah=400 | ... | Monetize: lolos=100 dicegah=900",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Cegah di kiri = murah tapi berisik (banyak false positive). Cegah di kanan = tepat tapi mahal dan berisiko telat. Menaikkan biaya 'Monetize' dalam simulasi menunjukkan trade-off-nya: makin ke kanan makin mahal intervensinya, tapi makin sedikit yang perlu ditangani.",
      },
      hints: [
        "lolos = serangan * fraksi_lolos; dicegah = serangan - lolos.",
        "Loop tiap tuple (nama, biaya, lolos) di list tahapan.",
        "dicegah = serangan - serangan * lolos",
      ],
      code: {
        starter: `# (nama tahap, biaya intervensi Rp jt, fraksi serangan yang lolos)\ntahapan = [\n    ("Recon",    5, 0.60),\n    ("Deliver", 10, 0.50),\n    ("Exploit", 25, 0.30),\n    ("Monetize", 60, 0.10),\n]\nserangan = 1000\n\n# TULIS KODEMU: untuk tiap tahap hitung yang lolos & yang dicegah\nfor nama, biaya, lolos in tahapan:\n    lolos_n =\n    dicegah =\n    print(f"{nama}: lolos={lolos_n:.0f} dicegah={dicegah:.0f} biaya=Rp{biaya}jt")`,
        lockLines: 8,
        solution: `# (nama tahap, biaya intervensi Rp jt, fraksi serangan yang lolos)\ntahapan = [\n    ("Recon",    5, 0.60),\n    ("Deliver", 10, 0.50),\n    ("Exploit", 25, 0.30),\n    ("Monetize", 60, 0.10),\n]\nserangan = 1000\n\n# TULIS KODEMU: untuk tiap tahap hitung yang lolos & yang dicegah\nfor nama, biaya, lolos in tahapan:\n    lolos_n = serangan * lolos\n    dicegah = serangan - lolos_n\n    print(f"{nama}: lolos={lolos_n:.0f} dicegah={dicegah:.0f} biaya=Rp{biaya}jt")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "Recon: lolos=600 dicegah=400", label: "Baris Recon benar", msg: "1000 x 0,60 = 600 lolos; 1000 - 600 = 400 dicegah." },
          { kind: "stdout_matches", task: "t2", pattern: "Monetize: lolos=100 dicegah=900", label: "Baris Monetize benar", msg: "1000 x 0,10 = 100 lolos; 1000 - 100 = 900 dicegah." },
        ],
      },
      reference: "Penyerang harus lolos semua tahap; defender cukup gagalkan satu. Kiri murah-berisik, kanan mahal-tepat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kasus ini milik tim mana?",
      prose: [
        "Satu: uang nasabah hilang sekarang, transaksi tidak sah → Fraud (pemadam). Aksi: blokir akun, hold dana, blokir device dalam hitungan menit; metrik: loss terselamatkan. Contoh: nasabah lapor saldo terkuras → tim fraud hold 14 rekening tujuan dalam 20 menit, selamat Rp500 juta dari Rp800 juta.",
        "Dua: dana bergerak mencurigakan antar rekening, asal tidak jelas → AML (detektif). Aksi: investigasi mendalam, kumpulkan bukti, ajukan STR ke PPATK; metrik: laporan tepat waktu dan berkualitas. Tiga: sistem dibobol / malware menyebar → Cyber (penjaga gerbang). Aksi: isolasi, forensik, patch, takedown; metrik: MTTR.",
        "Empat: ketiganya sekaligus (kasus NusaBank) → meja bersama, satu komandan. Urutan: fraud selamatkan uang dulu (menit), cyber tutup vektor (jam), AML susun STR (hari/minggu). Uang dulu, forensik kemudian, laporan terakhir. War-room gabungan 3 tim selama 72 jam pertama — bukan tiga tiket yang saling lempar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"AML itu fraud yang nilainya besar.\" Beda objektif, bukan beda skala. Fraud = mencuri uang (korbannya pemilik dana). AML = menyembunyikan asal uang. Pencucian Rp50 juta tetap AML; pencurian Rp50 miliar tetap fraud. Skala tidak menentukan kategori — arah aliran dan tujuannya yang menentukan.",
      },
      reference: "Tanya dulu: uang hilang? (fraud) / asal uang? (AML) / sistem jebol? (cyber). Jangan ukur tim AML dengan metrik fraud.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rp800 juta hilang — siapa bertanggung jawab?",
      prose: [
        "Kasus NusaBank: 14 transfer (total Rp800 juta) dari rekening korban ke rekening-rekening baru, dalam 20 menit, setelah korban menginstal APK \"undangan nikah\". Tim fraud berhasil hold Rp500 juta. Rp300 juta sudah ditarik tunai dan diteruskan.",
        "Pertanyaan: (a) Petakan ke 7 tahap kill chain — di tahap mana intervensi paling murah seharusnya bisa menggagalkan ini? (b) Rp300 juta yang hilang: kegagalan fraud, AML, atau cyber? (c) Satu perbaikan proses apa yang paling berdampak untuk 90 hari ke depan?",
        "Pembahasan: (a) Tahap Delivery/Exploitation. APK disebar via WA blast — operator + tim cyber bisa memblokir nomor/URL penyebar jauh sebelum korban menginstal; biayanya murah. Yang terjadi: tidak ada yang memonitor vektor WA karena \"bukan kanal resmi bank\". (b) Kegagalan berlapis, bukan satu tim. Cyber gagal menutup vektor, fraud telat 20 menit (velocity rule seharusnya menahan transfer ke-3, bukan ke-14), AML tidak punya daftar mule (14 rekening baru tanpa riwayat seharusnya flag). Menyalahkan satu tim = mengulanginya. (c) Velocity rule + hold otomatis: \"lebih dari 3 transfer ke rekening <7 hari dalam 1 jam → tahan 30 menit + notifikasi\". Murah, memotong tahap monetize langsung.",
      ],
      tasks: [],
      reference: "Dalam 24 jam pertama: selamatkan dulu (logika fraud), klasifikasikan kemudian (logika AML).",
    },
    {
      id: "sla-unit",
      eyebrow: "Langkah 7 · Operasional",
      title: "SLA menit vs hari: dua mesin yang berbeda",
      prose: [
        "Fraud operations berjalan seperti UGD: shift 24/7, SLA auto-block di bawah 200 milidetik, review manual maksimal 4 jam untuk kasus prioritas. Metriknya: rupiah terselamatkan per shift, false positive rate, dan waktu rata-rata dari alert ke hold dana. Ketika Rp800 juta NusaBank bergerak dalam 20 menit, tidak ada yang menunggu \"rapat koordinasi\" — analis shift malam punya wewenang mem-hold 14 rekening tanpa persetujuan atasan. Kecepatan adalah produknya; birokrasi adalah musuhnya.",
        "Tim AML berjalan seperti kantor kejaksaan: jam kerja normal, SLA dihitung dalam HARI. Satu Suspicious Transaction Report (STR) ke PPATK butuh 5–15 hari kerja penyusunan — bukan karena lambat, tetapi karena isinya harus tahan uji: kronologi aliran dana, profil nasabah, dokumen pendukung, dan kesimpulan yang ditandatangani compliance officer. Metriknya: ketepatan waktu pelaporan, kualitas STR (berapa yang ditindaklanjuti PPATK), dan nol denda regulator. Ketelitian adalah produknya; kecepatan yang sembrono adalah musuhnya.",
        "Unit yang menangani pun berbeda bahasa. Fraud ops diisi analis transaksi yang berpikir dalam milidetik dan pola; tim AML diisi compliance officer yang berpikir dalam dokumen dan regulasi; SOC (cyber) diisi engineer yang berpikir dalam log. Tiga bahasa, tiga definisi \"selesai\". Kasus yang dilempar antar unit tanpa penerjemah akan mati di perbatasan — masing-masing mengira unit lain yang bertanggung jawab.",
        "Konsekuensi praktis untuk analis: kenali JAM berapa kasusmu hidup. Kasus fraud hidup di menit-menit pertama — setiap jam penundaan adalah uang yang semakin jauh. Kasus AML hidup di minggu-minggu berikutnya — setiap kesimpulan terburu-buru adalah STR lemah yang merusak kredibilitas bank di mata PPATK. Analis yang dipindah tim tanpa adaptasi membuat kesalahan khas: di fraud ia terlalu lambat menunggu \"kepastian\", di AML ia terlalu cepat menutup investigasi padahal yang dibutuhkan adalah rantai bukti yang utuh.",
        "Satu detail operasional yang sering luput: jalur eskalasi malam hari. Fraud punya hotline 24 jam; AML tidak — STR tidak disusun jam 3 pagi. Maka kasus irisan yang meledak tengah malam harus ditangani hibrida: tim fraud menahan uang malam itu juga, dan paket bukti awal disiapkan dalam template serah terima (kronologi, daftar rekening, nominal per hop, status hold) yang bisa langsung dipakai tim AML pagi harinya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: klasifikasikan berdasarkan pertanyaan yang dijawab, bukan besarnya uang",
        type: "risk",
        body: "Refleks paling berbahaya di meja analis adalah mengklasifikasikan kasus berdasarkan nominalnya — \"Rp800 juta, pasti AML\" atau \"Rp50 ribu, pasti fraud\". Nominal tidak pernah menentukan domain; pertanyaan yang dijawab yang menentukannya. Tanyakan tiga pertanyaan dalam 60 detik pertama: apakah ada uang nasabah yang hilang SEKARANG dan bisa diselamatkan? (ya = fraud, bertindak dalam menit). Apakah asal-usul dana disamarkan melalui lapisan transaksi? (ya = AML, dokumentasikan dalam hari). Apakah sistemnya yang dibobol? (ya = cyber, isolasi dalam jam). Satu kasus bisa menjawab \"ya\" untuk ketiganya — seperti NusaBank — dan itu bukan alasan untuk bingung, melainkan sinyal untuk membagi kasus menjadi tiga workstream dengan tiga jam yang berbeda. Kebiasaan kedua: waspadai kasus yang BERPINDAH domain di tengah jalan — pencurian Rp50 juta yang ternyata dananya diteruskan ke jaringan layering bukan lagi \"kasus fraud Rp50 juta\", ia adalah pintu masuk ke kasus AML. Analis yang mengunci klasifikasi di menit pertama dan tidak pernah meninjaunya kembali akan melewatkan transisi ini. Klasifikasi adalah hipotesis kerja, bukan vonis — tinjau ulang setiap ada fakta aliran dana baru.",
      },
      reference: "Fraud: SLA menit, metrik Rp terselamatkan. AML: SLA hari, metrik kualitas STR. Klasifikasi = hipotesis, tinjau tiap fakta baru.",
    },
    {
      id: "transisi-kasus",
      eyebrow: "Langkah 8 · Transisi domain",
      title: "Kapan kasus pindah dari fraud ke AML — dan harga salah kamar",
      prose: [
        "Ambil lagi kasus NusaBank: Rp800 juta, 14 transfer, 20 menit. Menit 0–60: murni fraud — uang bergerak, wewenang penuh di tim fraud, 14 rekening di-hold, Rp500 juta terselamatkan. Hari ke-2: investigasi menemukan Rp300 juta yang lolos sudah dipecah ke 22 rekening baru, masing-masing transit kurang dari 24 jam, lalu mengarah ke penarikan tunai terkoordinasi di 3 kota. Polanya bukan lagi \"pencurian\" — ini layering: pemecahan, transit cepat, konsolidasi. Di titik inilah kasus PINDAH kamar: dari fraud (uang hilang) ke AML (asal dana disamarkan). Pemicu transisinya konkret: dana sudah di luar jangkauan hold + pola berlapis terdeteksi.",
        "Aturan transisinya bisa ditulis sebagai checklist. Kasus pindah ke AML bila DUA syarat terpenuhi: (1) dana tidak lagi bisa diselamatkan langsung (sudah cair/berpindah ≥2 hop), dan (2) ada indikasi penyamaran — pemecahan nominal (structuring di bawah ambang lapor), rekening transit berumur <30 hari, atau hop lintas negara. Jika hanya syarat (1): itu kegagalan fraud, bukan kasus AML — catat sebagai loss, perbaiki deteksi. Jika hanya syarat (2) tanpa kerugian nasabah: itu murni AML sejak awal (misalnya setoran tunai besar berlapis tanpa korban jelas).",
        "Harga salah kamar itu dua arah dan sama-sama nyata. Arah pertama: tim fraud menahan kasus yang seharusnya sudah jadi AML — sibuk \"mengejar\" dana yang sudah 5 hop jauhnya, tidak menyusun STR, tenggat pelaporan ke PPATK lewat. Dendanya bukan teoritis: keterlambatan/kegagalan lapor transaksi mencurigakan berujung sanksi administratif OJK yang nilainya jauh melampaui Rp300 juta yang dikejar. Arah kedua: tim AML mengambil alih terlalu dini — prosedur dokumentasi 5 hari diterapkan pada uang yang masih bisa di-hold dalam 20 menit; Rp500 juta yang seharusnya terselamatkan ikut lolos karena \"menunggu kelengkapan berkas\".",
        "Desain yang benar: serah terima berjenjang, bukan lempar tanggung jawab. Protokolnya: tim fraud memegang komando 72 jam pertama (fase penyelamatan), dengan kewajiban menghasilkan paket bukti standar; pada jam ke-72 (atau saat checklist transisi terpenuhi, mana yang dulu), komando investigasi resmi pindah ke tim AML/FCU dengan berita acara serah terima — daftar rekening, status hold, peta hop yang diketahui. Fraud tidak \"selesai\" (mereka tetap memonitor recovery), AML tidak \"mulai dari nol\" (mereka menerima paket bukti). Satu kasus, satu komandan per fase, tidak pernah vakum.",
        "Uji akhirnya sederhana: untuk setiap kasus irisan, harus bisa dijawab \"siapa komandannya JAM INI?\" Jika jawabannya \"sedang dikoordinasikan\" lebih dari 4 jam, kasus itu tidak punya komandan — dan uangnya sedang berjalan tanpa ada yang mengejar, sementara laporannya sedang menunggu tanpa ada yang menulis.",
      ],
      tasks: [],
      reference: "Transisi bila: dana tak terselamatkan + indikasi layering. 72 jam pertama = komando fraud, lalu serah terima berjenjang ke AML.",
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
        "Fraud = transaksi tidak sah (uang hilang sekarang); AML = asal dana disamarkan (lapor ke PPATK); Cyber = sistem dibobol. Tiga pertanyaan, tiga metrik, tiga horizon.",
        "Base rate fallacy: presisi = model x base rate — model 99% pun menghasilkan 83% false positive saat fraud 0,2%.",
        "Kill chain 7 tahap: penyerang harus lolos semua tahap, defender cukup gagalkan satu — kiri murah-berisik, kanan mahal-tepat.",
        "Siklus fraud berputar: output serangan ini = modal serangan berikutnya. Analisis aliran, bukan titik.",
        "Kasus irisan butuh meja bersama dengan urutan: selamatkan uang → tutup vektor → susun laporan.",
      ],
      next: { label: "FR3 — Data Fraud", href: "/v2/learn/fr3-data-fraud" },
      quiz: [
        {
          q: "Model recall 99%, FPR 1%, base rate fraud 0,2%. Berapa presisi alert (P(fraud|alert))?",
          options: [
            { text: "99% — sesuai recall", why: "Recall mengukur 'dari fraud, berapa yang tertangkap' — bukan 'dari alert, berapa yang benar'." },
            { text: "Sekitar 17% — mayoritas alert adalah false positive", why: "P(alert) = 0,99x0,002 + 0,01x0,998 = 0,01196; presisi = 0,00198/0,01196 ≈ 17%. Inilah base rate fallacy.", correct: true },
            { text: "50%", why: "Tidak ada dasarnya — angkanya dihitung, bukan ditebak." },
            { text: "1%", why: "Itu FPR-nya, bukan presisinya. FPR dan presisi mengukur hal berbeda." },
          ],
        },
        {
          q: "Dana hasil penipuan dipecah ke 20 rekening lalu dikirim ke luar negeri. Ini ranah utama…",
          options: [
            { text: "Fraud — karena uangnya hasil tipu", why: "Uang hasil tipu = asal mula; yang ditangani sekarang adalah penyamaran asal-usulnya." },
            { text: "Cyber — karena pakai internet banking", why: "Kanal tidak menentukan domain; internet banking dipakai semua kejahatan." },
            { text: "AML — karena ini layering, fokusnya asal-usul dan pelaporan dana", why: "Pertanyaan AML: 'apakah asal dana ini disamarkan?' — jawabannya menuntut investigasi + STR ke PPATK.", correct: true },
            { text: "Customer service", why: "Ini kejahatan finansial serius, bukan keluhan layanan." },
          ],
        },
        {
          q: "Dalam kill chain, mengapa tahap 'monetize' paling mahal untuk diintervensi?",
          options: [
            { text: "Karena butuh antivirus mahal", why: "Antivirus tidak relevan di tahap monetize." },
            { text: "Karena uang sudah bergerak — menahannya berarti menggesek nasabah legit dan berpacu dengan waktu", why: "Tiap detik = uang hilang, dan intervensi (hold dana) mengganggu nasabah normal. Tahap kiri murah tapi berisik; tahap kanan tepat tapi mahal.", correct: true },
            { text: "Karena tahap ini tidak penting", why: "Justru di sinilah 40% loss 'matang' — sangat penting, tapi mahal." },
            { text: "Karena tidak ada datanya", why: "Data justru paling lengkap di tahap ini — masalahnya biaya intervensinya." },
          ],
        },
        {
          q: "\"Fraud = hacker membobol server bank.\" Pernyataan ini…",
          options: [
            { text: "Benar sepenuhnya", why: "Pembobolan sistem adalah ranah cyber, bukan definisi fraud." },
            { text: "Salah — sebagian besar fraud tidak membobol sistem; ia mengeksploitasi kepercayaan", why: "Fraud modern mayoritas memakai jalur 'sah' — OTP yang diberikan korban sendiri, akun yang dibajak via phishing, transfer sukarela.", correct: true },
            { text: "Benar untuk APP scam", why: "APP scam justru contoh paling jelas fraud TANPA pembobolan — korban transfer sendiri." },
            { text: "Tidak bisa ditentukan", why: "Bisa ditentukan: pernyataan ini salah sebagai definisi umum." },
          ],
        },
        {
          q: "Tiga tim (fraud/AML/cyber) menangani satu kasus berlapis. Urutan respons yang benar…",
          options: [
            { text: "AML dulu (laporan), baru fraud", why: "Laporan butuh minggu; uang hilang dalam menit. Uang dulu." },
            { text: "Cyber forensik dulu sampai tuntas, baru yang lain", why: "Forensik tuntas butuh jam–hari; penyerang menarik uangnya dalam menit." },
            { text: "Fraud selamatkan uang (menit) → cyber tutup vektor (jam) → AML susun laporan (hari)", why: "Uang dulu, forensik kemudian, laporan terakhir. Menunda hold demi forensik = memberi penyerang waktu.", correct: true },
            { text: "Bersamaan tanpa koordinasi", why: "Tanpa koordinasi = tiga pertahanan tidak nyambung = penyerang lewat di celah." },
          ],
        },
      ],
    },
  ],
};

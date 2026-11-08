import type { V2Lesson } from "../lib/types";

export const hd15: V2Lesson = {
  slug: "hd15-imaging-medis",
  track: "Health Data Science",
  module: "Data Non-Tabular",
  title: "HD15 DICOM & Klasifikasi Citra: Melihat Seperti Radiolog",
  estMinutes: 50,
  steps: [
    {
      id: "foto-dua-bahasa",
      eyebrow: "Langkah 1 · Shortcut learning",
      title: "AI 95% akurat yang tidak belajar apa-apa",
      prose: [
        "Dua foto rontgen dada terlihat identik bagi mata awam. Radiolog membaca yang pertama: “Infiltrat di paru kanan bawah — curiga pneumonia.” Yang kedua: normal. Kini AI bisa dilatih melihat pola yang sama — dalam seminggu, dari 100.000 contoh.",
        "Tapi ada kisah horornya: model pendeteksi COVID dari rontgen yang ternyata hanya membaca merek mesin rontgen di sudut gambar (shortcut learning). Akurasinya 95% — kepintarannya nol. Pembongkarannya: (1) crop sudut gambar (hilangkan teks mesin) → AUC anjlok dari 0,95 ke 0,62; (2) Grad-CAM: heatmap menyala di sudut kiri atas (tempat merek mesin), bukan di paru.",
        "Twist-nya: AI itu tidak berbohong soal akurasinya — 95% memang 95%. Yang berbohong adalah asumsi kita tentang apa yang dipelajarinya. Model tidak belajar “pola COVID di paru”; ia belajar “foto dari RS rujukan COVID (mesin merek X) vs foto kontrol (mesin merek Y)” — jalan pintas yang valid di data latih, bunuh diri di dunia nyata. Untuk AI citra medis, pertanyaan pertama bukan “berapa akurasinya” melainkan “tunjukkan padaku apa yang dilihatnya”.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira akurasi 95% pada citra berarti siap dipakai klinis. Akurasi didominasi kelas mayoritas; yang penting sens/spes pada prevalensi target + validasi eksternal + uji shortcut. Model 95% yang membaca merek mesin = 0% berguna.",
        type: "pitfall",
      },
      reference: "Grad-CAM sebelum deployment, selalu. Crop test untuk artefak.",
    },
    {
      id: "dicom",
      eyebrow: "Langkah 2 · DICOM",
      title: "Amplop pos untuk foto medis",
      prose: [
        "DICOM adalah standar file citra medis: berisi piksel (data gambar) + metadata (pasien, modalitas, parameter akuisisi, rumah sakit) dalam tag terstandar. Contoh tag: (0010,0010) = nama pasien, (0008,0060) = modalitas (CR/DX/MG), (0008,0070) = merek mesin, (0028,0010/11) = dimensi 2048×2048.",
        "Metadata sama pentingnya dengan gambar: kelompokkan performa model per modalitas dan merek mesin — jika model bagus di mesin A tapi jeblok di mesin B, kamu menemukan shortcut learning sebelum deploy, bukan sesudah. Tapi metadata = PII: DICOM menyimpan nama, tanggal lahir, bahkan kadang wajah. Anonimisasi DICOM harus membersihkan tag + burned-in annotation (teks yang terbakar di piksel).",
        "CNN untuk klasifikasi bekerja bertingkat: kernel kecil yang dipelajari digeser ke seluruh gambar — lapisan awal belajar tepi/garis, lapisan dalam mengkombinasikannya menjadi “infiltrat” atau “nodul”. Transfer learning (model pra-latih lalu fine-tune) adalah standar karena data medis berlabel mahal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Split data citra per gambar secara acak. Gambar dari pasien yang sama di train dan test = leakage yang menggelembungkan performa. Selalu split di level pasien dan RS — dan minta label dari radiolog (multi-reader + adjudikasi), bukan dari kode billing.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "DICOM berisi…",
          options: [
            { text: "Piksel + metadata terstandar (pasien, modalitas, mesin)", why: "Benar: amplop lengkap. Metadata penting untuk arsip, stratifikasi evaluasi — dan PII yang wajib dianonimisasi.", correct: true },
            { text: "Hanya piksel gambar", why: "Salah: metadata adalah separuh nilainya (dan separuh risikonya)." },
            { text: "Hanya teks", why: "DICOM intinya adalah citra + metadata, bukan dokumen teks." },
            { text: "Hanya video", why: "DICOM mencakup citra statis dan sekuens, bukan “hanya video”." },
          ],
        },
      ],
      reference: "Metadata = PII. Anonimisasi tag + burned-in annotation.",
    },
    {
      id: "lab-confusion",
      eyebrow: "Langkah 3 · Lab metrik",
      title: "Dari confusion matrix ke keputusan deploy",
      prose: [
        "Model deteksi TB dari rontgen dada, diuji pada 10.000 pasien puskesmas. Prevalensi TB 5% (500 kasus). Confusion matrix pada threshold 0,5: TP=440, FN=60, FP=480, TN=9.020. Akurasi = 94,6% — terlihat hebat. Tapi hitung metrik yang penting.",
        "PPV = 440/(440+480) = 47,8%: dari 920 “positif AI”, lebih dari separuh palsu — 480 orang dirujuk untuk TCM/sputum yang tidak perlu. Kapasitas TCM puskesmas 50 tes/hari: 920 rujukan = 18 hari kerja, separuhnya sia-sia. Untuk AI skrining, hafalkan urutan: prevalensi → PPV → kapasitas tindak lanjut → keputusan. Akurasi tidak ada di urutan itu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sens` = TP/(TP+FN)" },
        { id: "t2", text: "Hitung `spes` = TN/(TN+FP)" },
        { id: "t3", text: "Hitung `ppv` = TP/(TP+FP)" },
      ],
      expected: "sens=0.88  spes=0.95  ppv=0.478",
      note: {
        title: "Sering salah",
        body: "Berhenti di “akurasi 94,6%” dan merekomendasikan deploy. Confusion matrix bukan jawaban — ia bahan mentah keputusan operasional. Yang menentukan adalah PPV pada prevalensi lokal dan kapasitas tindak lanjut.",
        type: "pitfall",
      },
      hints: [
        "Sensitivitas memakai baris “sakit”: TP/(TP+FN).",
        "Spesifisitas memakai baris “sehat”: TN/(TN+FP).",
        "sens = TP/(TP+FN)\nspes = TN/(TN+FP)\nppv = TP/(TP+FP)",
      ],
      code: {
        starter: `TP, FN, FP, TN = 440, 60, 480, 9020  # model TB-rontgen, 10.000 pasien puskesmas\n\n# TULIS KODEMU: sensitivitas, spesifisitas, PPV\nsens = \nspes = \nppv = \n\nprint(f"sens={sens:.3f}  spes={spes:.3f}  ppv={ppv:.3f}")`,
        lockLines: 1,
        solution: `TP, FN, FP, TN = 440, 60, 480, 9020  # model TB-rontgen, 10.000 pasien puskesmas\n\n# TULIS KODEMU: sensitivitas, spesifisitas, PPV\nsens = TP/(TP+FN)\nspes = TN/(TN+FP)\nppv = TP/(TP+FP)\n\nprint(f"sens={sens:.3f}  spes={spes:.3f}  ppv={ppv:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sens", value: 0.88, tol: 1e-9, label: "`sens` seharusnya 0.88", msg: "440/500 = 0,88. Pembaginya total yang benar-benar sakit (TP+FN)." },
          { kind: "equal", task: "t2", name: "spes", value: 0.9495, tol: 0.001, label: "`spes` sekitar 0.95", msg: "9.020/9.500 ≈ 0,95. Pembaginya total yang benar-benar sehat (TN+FP)." },
          { kind: "equal", task: "t3", name: "ppv", value: 0.4783, tol: 0.001, label: "`ppv` sekitar 0.478", msg: "440/920 ≈ 0,478 — lebih dari separuh “positif” adalah palsu." },
          { kind: "stdout_matches", task: "t3", pattern: "sens=0\\.880\\s+spes=0\\.949\\s+ppv=0\\.478", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Skrining: sensitivitas primer (SnNout) + PPV lokal.",
    },
    {
      id: "evaluasi-klinis",
      eyebrow: "Langkah 4 · Evaluasi & mini-case",
      title: "Data-centric: modelnya cukup, datanya belum",
      prose: [
        "Mayoritas kegagalan AI citra medis bukan karena arsitektur kurang canggih — melainkan datanya. Label noise: dua radiolog sepakat hanya ~80% untuk kasus sulit; melatih hingga “100% akurasi training” = menghafal ketidaksepakatan manusia. Augmentasi yang melanggar fisika: flip horizontal rontgen dada memindahkan jantung ke kanan (dekstrokardia palsu!). Spectrum bias: latih di kasus rujukan tersier (jelas sakit/sehat), pakai di skrining puskesmas (banyak borderline) → performa anjlok.",
        "Mini-case: model deteksi retinopati diabetik akurasi 97% di lab (kamera mahal, RS tersier), anjlok ke 70% di puskesmas (kamera murah, operator tak terlatih) — banyak false negative, pasien buta yang seharusnya tertangkap. Tanpa validasi eksternal, tanpa monitoring. Akar: domain shift tanpa validasi; metrik akurasi menyembunyikan FN yang fatal untuk skrining.",
        "Perbaikan: kumpulkan data puskesmas berlabel (multi-reader), adaptasi domain, evaluasi dengan sensitivitas sebagai metrik primer (skrining!), alur AI triase → yang positif/meragukan ke dokter via telemedicine, monitoring bulanan per puskesmas. Dan ingat: heatmap Grad-CAM yang menyala di paru menunjukkan korelasi area-keputusan, bukan bukti kausal — ia alat investigasi, bukan sertifikat tidak-adanya-shortcut.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Deploy AI retinopati tanpa validasi eksternal = uji coba pada pasien: false negative berarti kebutaan yang sebenarnya bisa dicegah. AI citra adalah second reader/triase — diagnosis final tetap dokter, dengan quality gate (“foto tidak layak → minta ulang”).",
        type: "risk",
      },
      reference: "Sebelum tuning model 1 jam, audit data 10 jam: label, spektrum, artefak.",
    },
    {
      id: "studi-pembaca",
      eyebrow: "Langkah 5 · Validasi",
      title: "Studi pembaca & tiga mode deploy",
      prose: [
        "Akurasi 97% di lab, 70% di puskesmas — jurang yang dibahas di lesson ini bukan nasib, melainkan kegagalan validasi. Validasi eksternal yang benar: uji di situs yang TIDAK terlibat dalam training, dengan kamera, operator, dan populasi yang berbeda, lalu laporkan performa per subgroup (modalitas, merek mesin, kelompok usia). Aturan praktis: bila performa turun >5 poin antar situs, model belum siap — itu bukan “variasi wajar”.",
        "Untuk klaim “setara radiolog”, standar emas evaluasinya adalah multi-reader multi-case (MRMC) study: beberapa radiolog × banyak kasus, tiap kasus dibaca dengan dan tanpa AI (crossover), diukur AUC/ROC per pembaca. Yang diuji bukan “AI vs manusia” — melainkan “manusia+AI vs manusia”. Hasil yang jujur sering berbunyi: AI menaikkan sensitivitas radiolog junior mendekati senior, tapi tidak mengubah senior — implikasi deploy-nya: AI sebagai asisten, bukan pengganti.",
        "Tiga mode deploy — dan metriknya beda: (a) triase (AI memilah antrean; yang kritis didahulukan): metrik = sensitivitas pada spesifisitas operasional + waktu tunggu kasus kritis; (b) second reader (AI memeriksa setelah radiolog): metrik = incremental yield — berapa kasus yang terlewat manusia tapi tertangkap AI, dan berapa false alarm tambahannya; (c) autonomous (AI memutuskan sendiri): butuh bukti setara/non-inferior vs standar + monitoring ketat — dan payung regulasi yang jelas sebelum diklaim.",
        "Kuantifikasi ketidakpastian: model yang hanya mengeluarkan label tanpa confidence tidak bisa dioperasikan — butuh ambang “ragu” yang melempar kasus ke radiolog (selective prediction). Kalibrasi confidence + kurva risk-coverage: pada coverage 80% (20% kasus paling ragu dilempar ke manusia), berapa akurasinya? Deploy yang aman = AI menangani yang ia yakini, manusia menangani yang meragukan — bukan AI memutuskan semuanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: evaluasi seperti pembeli, bukan seperti penjual",
        body: "Penjual AI menjual akurasi; pembeli AI harus membeli bukti. Heuristik pertama: tanyakan “diuji di mana, oleh siapa, pada populasi seperti apa?” — bila jawabannya hanya “di lab kami”, anggap akurasinya fiksi sampai ada validasi eksternal. Heuristik kedua: minta angka pada populasiMU — prevalensi, kamera, dan operator puskesmasmu, bukan RS tersier penjualnya; model yang tidak diuji di tempatmu belum terbukti di tempatmu. Heuristik ketiga: uji manusia+AI, bukan AI vs manusia — yang di-deploy adalah kombinasi keduanya, dan interaksi manusianya (automation bias: radiolog menjadi malas memeriksa saat AI “yakin”) bisa menghapus seluruh keunggulan teknis. Minta studi pembaca, bukan leaderboard. Heuristik keempat: tetapkan ambang “ragu” sebelum kontrak — berapa persen kasus boleh dilempar ke radiolog, dan siapa membayar waktu mereka? AI tanpa jalur eskalasi = AI yang memaksa keputusan pada kasus yang seharusnya tidak ia putuskan. Empat kebiasaan — validasi eksternal, angka di populasiku, uji kombinasinya, ambang ragu dikontrak — mengubah pengadaan AI dari judi menjadi investasi.",
      },
      quiz: [
        {
          q: "Studi MRMC: radiolog+AI sensitivitas 88% vs radiolog saja 79%, spesifisitas sama. Kesimpulan deploy?",
          options: [
            { text: "Deploy sebagai asisten — bukti pada kombinasi manusia+AI, bukan AI mandiri", why: "Benar: yang terbukti adalah kombinasinya; klaim “pengganti” butuh studi autonomous terpisah.", correct: true },
            { text: "Ganti radiolog dengan AI", why: "Studi tidak menguji AI mandiri — klaim pengganti tak berdasar." },
            { text: "Tidak berguna — hanya +9 poin", why: "+9 poin sensitivitas TB = ratusan kasus tertangkap; itu besar." },
            { text: "Ulangi studi sampai AI menang telak", why: "Berburu kemenangan = p-hacking manajerial." },
          ],
        },
        {
          q: "Vendor mengklaim “akurasi 97%” tanpa menyebut sensitivitas, prevalensi, atau lokasi uji. Respons?",
          options: [
            { text: "Minta bukti lengkap: validasi eksternal + metrik per subgroup + studi pembaca", why: "Benar: akurasi tanpa konteks = brosur, bukan evidence.", correct: true },
            { text: "Terima — 97% sudah tinggi", why: "Tinggi di populasi apa? Dengan kamera apa? Tidak diketahui." },
            { text: "Tolak langsung tanpa evaluasi", why: "Minta bukti dulu; penolakan buta sama buruknya dengan penerimaan buta." },
            { text: "Minta diskon harga", why: "Harga tidak memperbaiki bukti yang tidak ada." },
          ],
        },
        {
          q: "Model turun 8 poin (97% → 89%) saat diuji di puskesmas mitra. Kesimpulan?",
          options: [
            { text: "Belum siap deploy — selidiki per subgroup sebelum lanjut", why: "Benar: >5 poin = sinyal dataset shift; cari tahu di kamera/populasi mana ia gagal.", correct: true },
            { text: "Variasi wajar, deploy saja", why: "8 poin bukan variasi wajar — itu jurang validasi." },
            { text: "Training ulang dengan data puskesmas lalu langsung deploy", why: "Retraining tanpa evaluasi ulang yang benar = mengulang kesalahan." },
            { text: "Turunkan threshold agar akurasi naik", why: "Akurasi bukan metrik deploy; threshold tidak memperbaiki shift." },
          ],
        },
      ],
      reference: "Yang diuji = yang di-deploy: manusia+AI. Akurasi tanpa konteks = brosur.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: AI pencitraan medis yang layak beli",
      prose: [
        "Lima situasi keputusan yang dihadapi evaluator setiap kali AI bantu-baca citra ditawarkan — dengan bukti yang wajib diminta:",
        "Skenario 1 — “Vendor mengklaim akurasi 97%?” → Minta sensitivitas + spesifisitas + prevalensi populasinya — “akurasi” tanpa ketiganya tidak bisa dinilai dan biasanya menutupi prevalensi rendah. Contoh: Vendor A “akurasi 97% (uji internal, n=5.000)” = brosur, bukan evidence; belum ada validasi eksternal sama sekali.",
        "Skenario 2 — “Modelnya bagus di RS — berlaku di 40 puskesmasku?” → Minta validasi eksternal di populasi DAN perangkat deploy (merek mesin rontgen!). Curigai shortcut learning: model yang “mendeteksi TB” bisa jadi hanya membaca penanda merek mesin atau posisi pasien — uji dengan data beda mesin dan beda site sebelum percaya.",
        "Skenario 3 — “Mana bukti ia membantu dokter, bukan cuma skornya bagus?” → Minta studi pembaca (reader study): radiolog+AI vs radiolog saja pada kasus yang sama. Contoh: Vendor C menunjukkan 88% vs 79% — satu-satunya bukti efek kombinasi manusia-AI di antara tiga penawar tender Rp3,2 miliar.",
        "Skenario 4 — “Data citra tak boleh keluar dari RS?” → Federated learning: model dilatih lintas site tanpa data mentah berpindah. Tetapi ini bukan alasan melewatkan validasi — domain shift antar-site (mesin, protokol, populasi) tetap harus diukur, dan performa per site wajib dilaporkan, bukan cuma rata-rata.",
        "Skenario 5 — “Syarat kontrak pengadaannya apa?” → Tulis SLA yang bisa diukur: sensitivitas ≥85% pada data populasi deploy (bukan RS rujukan), diukur 6-bulanan; ambang “ragu” ≤25% kasus dieskalasi ke radiolog; hak terminasi bila SLA gagal 2 periode berturut-turut; larangan klaim “pengganti radiolog”. Tanpa ini, tender dimenangkan brosur termurah.",
        "Aturan praktis 10 detik: klaim → minta sens/spes + prevalensi → validasi eksternal di mesin & populasimu → curigai shortcut → minta reader study → kontrak = SLA terukur + eskalasi + terminasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih vendor termurah dengan “akurasi 97%” lalu menemukan di lapangan bahwa modelnya membaca merek mesin, bukan TB — 40 puskesmas membaca rontgen dengan keyakinan palsu berstempel resmi. Selisih harga 40% tidak sebanding dengan satu KLB yang terlewat.",
        type: "pitfall",
      },
      reference: "Tender AI dimenangkan bukti, bukan brosur. SLA di populasi deploy.",
    },
    {
      id: "minicase-tender",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case 1: Tender AI radiologi Rp3,2 miliar",
      prose: [
        "Dinkes provinsi membuka tender AI bantu-baca rontgen TB senilai Rp3,2 miliar (3 tahun, 40 puskesmas). Tiga vendor menawar. Vendor A: “akurasi 97% (uji internal, n=5.000)”. Vendor B: “sensitivitas 90%, spesifisitas 85% (uji di 2 RS mitra)”. Vendor C: “AUC 0,91 pada validasi eksternal 3 RS + studi pembaca: radiolog+AI sensitivitas 88% vs radiolog saja 79%”. Kamu ketua tim evaluasi teknis.",
        "Analisismu: Vendor A — akurasi tanpa prevalensi/sensitivitas = tidak bisa dinilai (brosur, bukan evidence); uji internal = belum validasi eksternal. Vendor B — metrik lengkap tapi hanya 2 RS mitra (kemungkinan mirip distribusi training); tanpa studi pembaca. Vendor C — validasi eksternal + bukti manusia+AI; minta tambahan: performa per merek mesin yang dipakai 40 puskesmas + kurva risk-coverage (berapa persen dilempar ke radiolog?) + harga per pembacaan.",
        "Pertanyaan: (1) siapa yang kamu rekomendasikan dan mengapa? (2) syarat kontrak apa yang kamu tulis? (3) bagaimana menjawab direktur yang tergiur harga Vendor A yang 40% lebih murah?",
        "Pembahasan: (1) Vendor C — satu-satunya dengan bukti pada populasi relevan + efek kombinasi manusia-AI. (2) Syarat kontrak: SLA sensitivitas ≥85% pada data puskesmas (bukan RS), diukur 6-bulanan; ambang “ragu” ≤25% kasus dilempar ke radiolog; hak terminasi bila SLA gagal 2 periode berturut-turut; larangan klaim “pengganti radiolog”. (3) Jawaban ke direktur: “Rp3,2 miliar untuk akurasi brosur = Rp3,2 miliar untuk risiko misdiagnosis massal; selisih harga 40% tidak sebanding dengan biaya satu KLB TB yang terlewat ditambah kepercayaan publik.” Pelajaran: tender AI adalah ujian evaluasi — yang menang harusnya bukti, bukan brosur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Memenangkan tender berbasis brosur berarti 40 puskesmas membaca rontgen dengan model yang belum terbukti di populasi mereka — misdiagnosis massal yang sistematis, dengan stempel resmi Dinkes. Biaya kegagalannya bukan Rp3,2 miliar, melainkan nyawa dan kepercayaan.",
        type: "risk",
      },
      reference: "Tender AI dimenangkan bukti, bukan brosur. SLA di populasi deploy.",
    },
    {
      id: "domain-shift-federasi",
      eyebrow: "Langkah 8 · Lanjutan advanced",
      title: "Domain shift antar-RS & evaluasi federasi: model yang sama, rumah sakit yang berbeda",
      prose: [
        "Model yang lolos validasi eksternal di 3 RS mitra belum tentu bertahan di 40 puskesmas. Setiap RS adalah domain berbeda: merek mesin rontgen berbeda (kontras dan noise khas per vendor), protokol pengambilan berbeda (posisi pasien, dosis), dan populasi berbeda (prevalensi TB di puskesmas ≠ prevalensi di RS rujukan). Literatur menamainya domain shift — dan untuk citra medis, shift antar-institusi adalah aturan, bukan pengecualian. Model yang “95% akurat” di RS A bisa jatuh ke 80-an di RS B tanpa satu baris kode pun berubah.",
        "Tiga sumber shift yang paling sering menggigit. Pertama, acquisition shift: karakteristik perangkat. Solusi praktisnya adalah stratifikasi evaluasi per merek mesin dan per protokol — persis seperti syarat kontrak yang kamu tulis di mini-case tender: minta performa per merek, bukan angka agregat. Kedua, population shift: prevalensi dan spektrum penyakit. Ingat rantai PPV dari lab metrik: prevalensi 2% vs 10% mengubah PPV drastis walau sens/spes tetap. Model yang di-deploy ke puskesmas dengan prevalensi lebih rendah akan menghasilkan PPV lebih rendah — artinya lebih banyak false alarm per kasus benar, dan beban konfirmasi ke radiolog membengkak. Ketiga, label shift: definisi “kasus positif” bisa berbeda antar fasilitas (kriteria klinis vs hasil kultur).",
        "Di Indonesia ada kendala tambahan yang membuat evaluasi multi-RS sulit: data citra pasien tidak boleh keluar dari RS (UU PDP + etika). Di sinilah evaluasi federasi masuk — bukan melatih model secara federasi (itu proyek besar), melainkan mengirim MODEL ke data, bukan data ke model. Skemanya: paket evaluasi terstandar (model + skrip inferensi + definisi metrik yang sama) dijalankan di tiap RS oleh tim lokal; yang kembali ke pusat hanya angka agregat: sens/spes/PPV per strata, bukan citra pasien. Ini murah, legal, dan menjawab pertanyaan yang benar: “bagaimana model ini di populasi SAYA?”",
        "Aturan keputusan level senior untuk rollout multi-fasilitas. (1) Jangan deploy ke 40 fasilitas sekaligus — mulai dari 3–5 fasilitas pilot dengan spektrum mesin dan populasi berbeda, ukur shift-nya, baru putuskan. (2) Tetapkan ambang rollback per fasilitas, bukan agregat: satu puskesmas dengan sensitivitas 72% tidak boleh disembunyikan di balik rata-rata 88%. (3) Monitoring pasca-deploy bersifat kontinu: prevalensi berubah (musim, KLB), mesin diganti, protokol berubah — jadwalkan re-evaluasi 6-bulanan dengan paket yang sama. (4) Catat versi model + versi paket evaluasi seperti versi obat: “model v2.3 dievaluasi dengan paket v1.1 di 12 fasilitas, sens 84–91%” adalah bahasa yang bisa diaudit regulator.",
        "Jebakan yang membedakan praktisi senior: mengira validasi eksternal sekali = selesai. Validasi eksternal adalah foto; deployment adalah film. Shift tidak berhenti setelah go-live — ia justru dimulai di sana, karena populasi deploy selalu berbeda dari populasi uji. Itulah kenapa kontrak AI yang baik (lihat mini-case tender) mengikat SLA pada data populasi deploy yang diukur berkala, bukan pada angka brosur pra-tender.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira model yang sama bisa di-copy-paste ke semua RS. Di citra medis, “model yang sama” bukan “performa yang sama” — tiap fasilitas adalah domain baru yang wajib dievaluasi sendiri. Rollout massal tanpa evaluasi per fasilitas adalah shortcut learning di level organisasi.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Model TB mencapai sensitivitas 92% di 2 RS mitra. Puskesmas target punya prevalensi TB separuh dari RS mitra dan merek mesin berbeda. Risiko terbesar?",
          options: [
            { text: "Domain shift ganda: PPV turun (prevalensi lebih rendah) + performa bisa jatuh (mesin berbeda)", why: "Benar: dua shift independen — population shift menekan PPV via rumus PPV, acquisition shift bisa menurunkan sens/spes aktual.", correct: true },
            { text: "Model pasti tetap 92%", why: "92% diukur di domain RS mitra; tidak ada jaminan transfer ke domain berbeda." },
            { text: "Hanya PPV yang berubah, sensitivitas aman", why: "Sensitivitas juga bisa jatuh karena karakteristik mesin berbeda — keduanya harus diukur ulang." },
            { text: "Solusinya menambah data training", why: "Menambah data dari domain LAMA tidak memperbaiki shift ke domain BARU; yang dibutuhkan evaluasi di domain target." },
          ],
        },
        {
          q: "Evaluasi federasi (model dikirim ke RS, bukan data ke pusat) menyelesaikan masalah apa?",
          options: [
            { text: "Evaluasi multi-RS tanpa memindahkan data pasien — patuh UU PDP, tetap menjawab performa per populasi", why: "Benar: yang kembali hanya angka agregat per strata; tiap RS dievaluasi di populasinya sendiri.", correct: true },
            { text: "Melatih model lebih cepat", why: "Ini evaluasi federasi, bukan training federasi — tujuannya pengukuran, bukan kecepatan latih." },
            { text: "Menghapus domain shift", why: "Shift tetap ada; evaluasi federasi mengukurnya, bukan menghilangkannya." },
            { text: "Menggantikan studi pembaca", why: "Studi pembaca mengukur efek manusia+AI; evaluasi federasi mengukur performa teknis per fasilitas — keduanya dibutuhkan." },
          ],
        },
      ],
      reference: "Tiap fasilitas = domain baru. Evaluasi federasi: model ke data, bukan data ke model. Rollout bertahap + ambang rollback per fasilitas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "DICOM = piksel + metadata; metadata = PII yang wajib dianonimisasi.",
        "Label dari radiolog (multi-reader), bukan kode billing; split per pasien/RS.",
        "Shortcut learning adalah mode gagal #1 — uji crop + Grad-CAM + eksternal.",
        "Metrik klinis: sens/spes + PPV pada prevalensi target, bukan cuma akurasi.",
        "AI citra = second reader/triase; performa lab ≠ lapangan.",
      ],
      next: { label: "HD16 — SIR & Deteksi Wabah", href: "/v2/learn/hd16-surveilans-wabah" },
      quiz: [
        {
          q: "Shortcut learning pada model COVID-rontgen artinya…",
          options: [
            { text: "Model memakai artefak (merek mesin di sudut) bukan pola penyakit", why: "Benar: korelasi artefak-label dieksploitasi. Terdeteksi via crop test + Grad-CAM + validasi eksternal.", correct: true },
            { text: "Model terlalu cepat", why: "Kecepatan inferensi bukan masalahnya." },
            { text: "Model curang disengaja", why: "Tidak ada niat — model hanya mengoptimasi korelasi yang ada di data." },
            { text: "Data terlalu sedikit", why: "Datanya banyak (100.000); masalahnya adalah apa yang dipelajari." },
          ],
        },
        {
          q: "Split data citra yang benar?",
          options: [
            { text: "Per pasien dan per RS (hindari leakage antar split)", why: "Benar: gambar pasien yang sama di train+test = bocoran.", correct: true },
            { text: "Per gambar acak", why: "Itu justru menciptakan leakage antar split." },
            { text: "Per piksel", why: "Piksel bukan unit sampel yang bermakna." },
            { text: "Tidak perlu split", why: "Tanpa split tidak ada estimasi generalisasi yang jujur." },
          ],
        },
        {
          q: "Untuk skrining TB dari rontgen, metrik primer?",
          options: [
            { text: "Sensitivitas (jangan sampai lolos) + PPV lokal", why: "Benar (SnNout): skrining butuh tangkap semua; PPV menentukan beban konfirmasi.", correct: true },
            { text: "Akurasi", why: "Akurasi didominasi kelas mayoritas dan tidak menjawab beban operasional." },
            { text: "Spesifisitas saja", why: "Spesifisitas saja mengorbankan sensitivitas — kasus terlewat untuk skrining." },
            { text: "Kecepatan", why: "Kecepatan penting tapi bukan metrik klinis primer." },
          ],
        },
        {
          q: "Transfer learning untuk citra medis berguna karena…",
          options: [
            { text: "Data berlabel mahal/sedikit — fitur visual umum dari pra-latih menghemat data", why: "Benar: 3.000 foto + fine-tune sering mengalahkan training dari nol.", correct: true },
            { text: "Selalu lebih akurat", why: "Tidak selalu — tapi efisien data untuk dataset kecil." },
            { text: "Wajib regulasi", why: "Tidak ada regulasi yang mewajibkan transfer learning." },
            { text: "Gratis", why: "Tetap butuh komputasi fine-tune dan data berlabel." },
          ],
        },
        {
          q: "Grad-CAM heatmap menyala di paru. Kesimpulan?",
          options: [
            { text: "Korelasi area-keputusan, bukan bukti kausal — tetap butuh uji eksternal/crop", why: "Benar: heatmap = alat investigasi, bukan sertifikat. Shortcut lain bisa tetap ada.", correct: true },
            { text: "Terbukti tidak ada shortcut", why: "Salah: heatmap tidak membuktikan ketiadaan shortcut lain." },
            { text: "Model sempurna", why: "Tidak ada model yang sempurna — evaluasi tetap wajib." },
            { text: "Tidak perlu evaluasi lagi", why: "Validasi eksternal tetap wajib sebelum klaim klinis." },
          ],
        },
      ],
    },
  ],
};

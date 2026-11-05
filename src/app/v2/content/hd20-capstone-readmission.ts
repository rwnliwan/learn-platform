import type { V2Lesson } from "../lib/types";

export const hd20: V2Lesson = {
  slug: "hd20-capstone-readmission",
  track: "Health Data Science",
  module: "Etika, Pelaporan & Capstone",
  title: "HD20 Capstone: Model Risiko Readmission End-to-End",
  estMinutes: 65,
  steps: [
    {
      id: "brief-direktur",
      eyebrow: "Langkah 1 · Brief",
      title: "Email Senin pagi dari direktur",
      prose: [
        "“Tim Data, readmission 30-hari kita 18% — di atas rata-rata nasional 14%. Direksi minta model prediksi readmission agar perawat bisa intervensi dini. Deadline 1 bulan. Budget: akses EHR 3 tahun. Tolong presentasikan ke direksi.”",
        "Ini capstone-mu: semua lesson HD1–HD19 dipakai sekaligus. Tidak ada jawaban tunggal yang benar — yang dinilai adalah proses yang defensibel: definisi yang jelas, leakage yang dicegah, kalibrasi yang jujur, fairness yang diaudit, dan laporan yang bisa dipertanggungjawabkan.",
        "Twist-nya: email itu terlihat seperti permintaan model — padahal yang diminta direksi sebenarnya adalah kepercayaan. Model yang akurat tapi tidak terkalibrasi, bocor leakage, bias terhadap pasien miskin, dan dilaporkan dengan grafik menipu lebih berbahaya daripada tidak punya model sama sekali. Standarnya: apakah seorang dokter berani mempertaruhkan pasiennya pada proses kerjamu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira capstone dinilai dari AUC tertinggi. Yang dinilai adalah proses defensibel: definisi jelas, leakage dicegah, kalibrasi jujur, fairness diaudit, laporan transparan. AUC 0,76 yang jujur mengalahkan AUC 0,93 yang bocor — di dunia nyata, yang kedua dipecat setelah audit.",
        type: "pitfall",
      },
      reference: "Kerjakan berurutan tahap 1→4; jangan loncat ke modeling sebelum definisi dikunci.",
    },
    {
      id: "tahap-definisi-leakage",
      eyebrow: "Langkah 2 · Definisi & leakage",
      title: "Kontrak definisi dan gerbang leakage",
      prose: [
        "Tahap 1 — Definisi (minggu 1). Tetapkan: outcome (readmission tak terencana <30 hari pasca-pulang — readmission terencana seperti kemoterapi terjadwal dieksklusi, bukan kegagalan kualitas); populasi (dewasa, rawat inap ≥24 jam, eksklusi meninggal/pindah); prediction time (saat discharge); fenotipe kovariat (komorbid via HD11). Meninggal <30 hari tanpa readmit adalah competing risk (HD6): analisis sensitivitas. Dokumentasikan semua dalam protokol 2 halaman ditandatangani klinisi. Kontrak definisi mahal di awal, murah di akhir.",
        "Tahap 2 — Wrangling & leakage check (minggu 2). Bangun fitur dari EHR (demografi, komorbid, lab terakhir, LOS, riwayat kunjungan), tangani missing (MICE, HD8), harmonisasi unit (HD11). Lalu audit leakage: untuk tiap fitur, tulis t_ketersediaan — pastikan tak ada fitur dari masa depan. Contoh yang tertangkap: fitur “jumlah diagnosis saat readmission” lolos ke training — AUC 0,93! Diagnosis itu dicatat saat readmit (masa depan relatif terhadap discharge). Setelah dibuang: AUC 0,76 — jujur dan masih berguna. Satu fitur bocor bisa menggelembungkan AUC 0,75 → 0,95.",
        "Prosedur audit: tulis t_ketersediaan tiap fitur; uji ablasi (buang fitur top, lihat apakah AUC anjlok tidak wajar). Leakage check adalah gerbang, bukan hiasan — sterilisasi alat operasi yang membosankan tapi menentukan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Langsung memilih algoritma ML sebagai langkah pertama. 80% kegagalan proyek analitik lahir di tahap definisi dan wrangling, bukan di modeling. Model yang dibangun di atas definisi kabur = istana pasir.",
        type: "pitfall",
      },
      reference: "Prediction time = jam discharge. Fitur hanya yang tersedia SEBELUM itu.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 3 · Lab audit",
      title: "Audit kalibrasi & fairness model readmission",
      prose: [
        "Model selesai dilatih. Diberikan ringkasan evaluasi per grup pembiayaan: Grup PBI (n=500) — rata-rata prediksi 0,30, outcome aktual 0,28, TP=90, FN=60. Grup umum (n=500) — rata-rata prediksi 0,22, outcome aktual 0,24, TP=84, FN=36.",
        "Hitung: (1) TPR per grup = TP/(TP+FN); (2) gap TPR antar grup; (3) calibration-in-the-large per grup = rata-rata prediksi − outcome aktual. Tentukan: lolos deploy atau perlu mitigasi? (Acuan: gap TPR >5 poin = lampu kuning.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tpr_pbi` dan `tpr_umum`" },
        { id: "t2", text: "Hitung `gap_tpr` = tpr_umum − tpr_pbi" },
        { id: "t3", text: "Hitung `citl_pbi` dan `citl_umum` (calibration-in-the-large)" },
      ],
      expected: "tpr_pbi=0.60 tpr_umum=0.70 gap_tpr=0.10 | citl_pbi=0.02 citl_umum=-0.02",
      note: {
        title: "Kaitan ke risk",
        body: "Gap TPR 10 poin berarti model sistematis melewatkan pasien miskin yang butuh intervensi — kelompok yang paling rentan justru paling dirugikan. Menyembunyikan temuan ini dan deploy diam-diam adalah malapraktik analitik; mitigasi (threshold per grup, audit label) + lapor transparan adalah standarnya.",
        type: "risk",
      },
      hints: [
        "TPR = TP / (TP + FN) untuk tiap grup.",
        "Gap = selisih TPR kedua grup (nilai absolut).",
        "Calibration-in-the-large = rata-rata prediksi − rata-rata outcome aktual.",
      ],
      code: {
        starter: `# Evaluasi model readmission per grup pembiayaan\npbi  = {"n": 500, "pred": 0.30, "outcome": 0.28, "TP": 90, "FN": 60}\numum = {"n": 500, "pred": 0.22, "outcome": 0.24, "TP": 84, "FN": 36}\n\n# TULIS KODEMU: TPR per grup, gap, dan calibration-in-the-large\ntpr_pbi = \ntpr_umum = \ngap_tpr = \ncitl_pbi = \ncitl_umum = \n\nprint(f"tpr_pbi={tpr_pbi:.2f} tpr_umum={tpr_umum:.2f} gap_tpr={gap_tpr:.2f}")\nprint(f"citl_pbi={citl_pbi:+.2f} citl_umum={citl_umum:+.2f}")`,
        lockLines: 3,
        solution: `# Evaluasi model readmission per grup pembiayaan\npbi  = {"n": 500, "pred": 0.30, "outcome": 0.28, "TP": 90, "FN": 60}\numum = {"n": 500, "pred": 0.22, "outcome": 0.24, "TP": 84, "FN": 36}\n\n# TULIS KODEMU: TPR per grup, gap, dan calibration-in-the-large\ntpr_pbi = pbi["TP"]/(pbi["TP"]+pbi["FN"])\ntpr_umum = umum["TP"]/(umum["TP"]+umum["FN"])\ngap_tpr = abs(tpr_umum - tpr_pbi)\ncitl_pbi = pbi["pred"] - pbi["outcome"]\ncitl_umum = umum["pred"] - umum["outcome"]\n\nprint(f"tpr_pbi={tpr_pbi:.2f} tpr_umum={tpr_umum:.2f} gap_tpr={gap_tpr:.2f}")\nprint(f"citl_pbi={citl_pbi:+.2f} citl_umum={citl_umum:+.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tpr_pbi", value: 0.6, tol: 1e-9, label: "`tpr_pbi` seharusnya 0.60", msg: "90/(90+60) = 0,60." },
          { kind: "equal", task: "t1", name: "tpr_umum", value: 0.7, tol: 1e-9, label: "`tpr_umum` seharusnya 0.70", msg: "84/(84+36) = 0,70." },
          { kind: "equal", task: "t2", name: "gap_tpr", value: 0.1, tol: 1e-9, label: "`gap_tpr` seharusnya 0.10", msg: "|0,70 − 0,60| = 0,10 — di atas ambang 5 poin: perlu mitigasi." },
          { kind: "equal", task: "t3", name: "citl_pbi", value: 0.02, tol: 1e-9, label: "`citl_pbi` seharusnya 0.02", msg: "0,30 − 0,28 = +0,02 (sedikit overpredict)." },
          { kind: "equal", task: "t3", name: "citl_umum", value: -0.02, tol: 1e-9, label: "`citl_umum` seharusnya -0.02", msg: "0,22 − 0,24 = −0,02 (sedikit underpredict)." },
          { kind: "stdout_matches", task: "t3", pattern: "gap_tpr=0\\.10", label: "`print` menampilkan gap_tpr", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Urutan evaluasi: diskriminasi → kalibrasi → utilitas → fairness.",
    },
    {
      id: "tahap-laporan",
      eyebrow: "Langkah 4 · Threshold & laporan",
      title: "Threshold dari kapasitas, laporan ala TRIPOD",
      prose: [
        "Tahap 3 — Model & evaluasi (minggu 3). Hasil lengkap: AUC temporal 0,78 (latih 2021–22, uji 2023); calibration slope 0,92 → rekalibrasi isotonic → 0,99; Brier 0,15; decision curve: net benefit positif pada threshold 15–40% (rentang operasional perawat). Fairness: TPR BPJS 72% vs swasta 81% — disparitas 9 poin, akar di fitur “kunjungan kontrol” yang bias ke swasta (informed presence). Mitigasi: threshold per grup + tambah fitur klinis murni.",
        "Mini-case threshold: direksi minta threshold 10% (“tangkap semua!”). Pada 10%: sensitivitas 90%, PPV 12%. Kapasitas perawat: 50 intervensi/bulan; pasien risiko >10%: 400/bulan. 400 alarm yang 88%-nya palsu = alarm fatigue dalam 2 minggu, perawat berhenti percaya. Rekomendasi: threshold 25% → ~60 pasien/bulan (sesuai kapasitas), PPV 35%, sensitivitas 65%. Pada kapasitas terbatas, presisi mengalahkan recall — 50 intervensi tepat sasaran mengalahkan 400 alarm yang diabaikan. Berani menolak permintaan direksi yang salah (dengan data!) adalah momen yang menentukan reputasimu.",
        "Tahap 4 — Laporan & serah terima (minggu 4). Laporan TRIPOD satu halaman: partisipan (n=40.000, eksklusi terdokumentasi), prediktor (24 fitur, 3 kandidat dibuang karena leakage), missing (skor nyeri 30% MNAR — indikator + sensitivitas), hasil (AUC 0,78; kalibrasi; Brier 0,15), fairness (gap diakui sebagai open issue), threshold 25% dengan alasan, keterbatasan jujur (single-center, outcome undercount ~15%, drift). Keputusan: pilot terbatas 2 bangsal 3 bulan — bukan roll-out penuh. Checklist serah terima: repo reproducible, dashboard monitoring bulanan (AUC, kalibrasi, fairness per grup), SOP drift + kriteria rollback (Brier >0,18), jadwal review 6 bulanan dengan klinisi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira setelah deploy proyek selesai. Deploy adalah tengah proyek, bukan akhir: drift, perubahan protokol, dan EHR baru menggerogoti performa. Tanpa monitoring + owner yang jelas, model menjadi fosil dalam 1–2 tahun.",
        type: "pitfall",
      },
      reference: "Satu halaman TRIPOD: data, metode, hasil (diskriminasi + kalibrasi!), keterbatasan, keputusan.",
    },
    {
      id: "premortem",
      eyebrow: "Langkah 5 · Pre-mortem",
      title: "Bunuh proyekmu sebelum ia bunuh kariermu",
      prose: [
        "Teknik dari psikolog Gary Klein: bayangkan proyekmu sudah gagal total — lalu tulis mengapa. Pre-mortem 1 jam menemukan lebih banyak risiko daripada review 1 minggu, karena ia memberi izin untuk pesimis.",
        "Pre-mortem proyek readmission: “Satu tahun kemudian, model dibatalkan direksi. Mengapa?” (1) Alarm fatigue: threshold 10% membanjiri perawat → mereka matikan alert → model “tidak dipakai”. (2) Drift tak terdeteksi: tidak ada monitoring → kalibrasi basi 8 bulan tanpa sadar → dokter kehilangan kepercayaan. (3) Skandal fairness: jurnalis menemukan model merugikan pasien miskin → proyek dibekukan. (4) Leakage terlambat ketahuan: auditor eksternal menemukan fitur bocor → semua hasil dibatalkan. (5) Outcome salah: ternyata “readmission” yang diprediksi sebagian besar terencana (kemoterapi terjadwal) → intervensi sia-sia.",
        "Ubah tiap skenario menjadi pencegahan: threshold berbasis kapasitas + pilot; dashboard monitoring + kriteria rollback sebelum launch; audit fairness sebelum deploy + dokumentasi; audit waktu tiap fitur + review independen; definisi outcome “tak terencana” dengan validasi chart review. Lakukan di awal proyek, libatkan orang luar, tulis 5 skenario + pencegahan di dokumen proyek. Analis junior bertanya “bagaimana agar proyek ini berhasil?” — analis senior bertanya “bagaimana proyek ini bisa gagal, dan apa yang kulakukan hari ini untuk mencegahnya?”",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Setiap skenario pre-mortem di atas pernah terjadi di dunia nyata — alarm fatigue, drift, skandal fairness, leakage. Dokumen pre-mortem adalah asuransi karier: jika gagal, kamu bisa tunjukkan kamu mengantisipasi, bukan lalai.",
        type: "risk",
      },
      reference: "Nilai proyek = berapa jebakan yang kamu temukan sendiri sebelum reviewer menemukannya.",
    },
    {
      id: "evaluasi-lanjut",
      eyebrow: "Langkah 6 · Evaluasi",
      title: "Kalibrasi, net benefit, dan threshold dari kapasitas",
      prose: [
        "AUC 0,78 menjawab “bisakah model mengurutkan?” — tapi direksi tidak membayar ranking; mereka membayar keputusan. Dua evaluasi yang menentukan nasib deploy: kalibrasi dan utilitas klinis. Kalibrasi: apakah angka 30% berarti 30 dari 100 pasien seperti ini benar-benar readmit? Calibration-in-the-large = rata-rata prediksi − rata-rata outcome (di lesson ini: 0,30 vs 0,28 → overestimasi 2 poin — kecil, tapi pada 40.000 pasien = 800 intervensi yang salah sasaran). Calibration slope <1 (0,92) = prediksi terlalu ekstrem — yang tinggi terlalu tinggi, yang rendah terlalu rendah; perbaiki dengan rekalibrasi (Platt/isotonic), BUKAN dengan training ulang.",
        "Utilitas klinis diukur dengan decision curve analysis. Idenya: setiap threshold p_t menyiratkan trade-off — berapa false positive yang rela ditukar untuk 1 true positive? Net benefit menggabungkan keduanya dalam satu angka. Plot NB vs threshold untuk tiga strategi: pakai model, intervensi semua pasien, tidak intervensi siapa pun. Model berguna hanya pada rentang threshold di mana kurvanya tertinggi. Evaluasi temporal dua kandidat threshold: pada p_t=10%, NB model 0,126 mengalahkan “intervensi semua” (0,089) — model menghemat sumber daya; pada p_t=30%, NB turun ke 0,064 — masih positif, tapi marginnya menipis.",
        "Threshold bukan angka statistik — ia angka operasional. “Tangkap semua di 10%” dengan PPV rendah membanjiri perawat → alarm fatigue → model diabaikan → proyek mati (itulah pre-mortem di lesson ini). Pilih threshold dari KAPASITAS: berapa intervensi yang bisa dieksekusi dengan kualitas baik per bulan? 50 intervensi/bulan dari ~800 pasien pulang ≈ 6% teratas → threshold ≈ persentil ke-94 skor. Lalu validasi: pada threshold itu, PPV dan NB masih masuk akal? Jika tidak, masalahnya bukan threshold — melainkan model atau kapasitasnya.",
        "Terakhir, ingat model menua: drift populasi, perubahan praktik klinis, dan — yang paling ironis — intervensi yang berhasil menurunkan readmission membuat data training berikutnya terlihat “model semakin tidak akurat” (performative prediction). Itu tanda model bekerja, bukan gagal. Tetapkan sejak awal: dashboard kalibrasi bulanan, ambang rollback (mis. calibration-in-the-large bergeser >5 poin), dan jadwal retraining. Model tanpa rencana monitoring = model tanpa tanggal kedaluwarsa — dan semua model kedaluwarsa.",
      ],
      tasks: [],
      formula: String.raw`NB = \frac{TP}{N} - \frac{FP}{N} \cdot \frac{p_t}{1 - p_t}`,
      formulaNote: "NB = net benefit — manfaat bersih per pasien dari memakai model pada threshold p_t, dalam satuan true positive. TP, FP = true/false positive pada threshold itu; N = total pasien; p_t = threshold probabilitas (risiko di atas ini diintervensi). Suku kedua = “biaya” false positive, dibobot odds threshold: makin rendah threshold, makin mahal setiap FP. Interpretasi: NB 0,05 = setara menemukan 5 TP per 100 pasien tanpa FP. Bandingkan kurva NB model vs “intervensi semua” vs “tidak intervensi” — model berguna hanya bila NB-nya tertinggi pada threshold kapasitasmu.",
      note: {
        title: "Intuisi: kalibrasi dulu, threshold dari kapasitas, rencanakan kesuksesan",
        body: "Bedakan dua pertanyaan yang sering dicampur: “apakah modelnya pintar?” (diskriminasi/AUC) dan “apakah angkanya bisa dipercaya?” (kalibrasi). Dokter tidak butuh ranking — mereka butuh angka yang jujur untuk satu pasien di depan mereka. Heuristik praktisi: sebelum memamerkan AUC, jawab dulu “kalau model bilang 30%, berapa persen yang benar-benar kejadian?” — bila kamu tidak tahu jawabannya, evaluasimu belum selesai. Heuristik kedua: threshold dipilih dari kapasitas, bukan dari kurva. Tanyakan “berapa pasien bisa kita intervensi dengan baik bulan ini?” lalu turunkan threshold-nya dari angka itu; threshold dari Youden index atau “maksimalkan F1” adalah jawaban untuk soal ujian, bukan untuk bangsal. Heuristik ketiga: model yang dipakai mengubah dunia yang diprediksinya — intervensi yang berhasil menurunkan readmission membuat data training berikutnya terlihat “model semakin tidak akurat”. Jangan panik; itu tanda model bekerja, bukan gagal. Rencanakan metrik monitoring yang tahan terhadap kesuksesanmu sendiri. Tiga kebiasaan — kalibrasi dulu, threshold dari kapasitas, rencanakan kesuksesan — memisahkan model yang dipresentasikan dari model yang dipakai.",
      },
      quiz: [
        {
          q: "Calibration-in-the-large = 0,30 (prediksi) vs 0,28 (aktual). Artinya?",
          options: [
            { text: "Model overestimasi 2 poin — pada 40.000 pasien = 800 intervensi salah sasaran", why: "Benar: rata-rata prediksi di atas outcome. Kecil per pasien, besar pada skala RS.", correct: true },
            { text: "Model sudah sempurna", why: "2 poin bias sistematis — bukan nol, dan ia konsisten satu arah." },
            { text: "AUC-nya pasti rendah", why: "Kalibrasi dan diskriminasi independen — AUC bisa tinggi dengan kalibrasi buruk." },
            { text: "Harus training ulang dari nol", why: "Bias sistematis kecil diperbaiki dengan rekalibrasi, bukan training ulang." },
          ],
        },
        {
          q: "Net benefit model pada threshold kapasitasmu LEBIH RENDAH dari strategi “intervensi semua”. Keputusan?",
          options: [
            { text: "Jangan pakai model pada threshold itu — strategi sederhana lebih baik", why: "Benar: NB adalah pembanding jujur. Model yang kalah dari “intervensi semua” tidak menambah nilai.", correct: true },
            { text: "Tetap pakai karena AUC-nya 0,78", why: "AUC tidak membayar biaya false positive — NB yang melakukannya." },
            { text: "Naikkan threshold sampai NB menang", why: "Threshold harus dari kapasitas operasional, bukan dioptimasi agar kurva terlihat bagus." },
            { text: "Buang modelnya", why: "Terlalu cepat: cek dulu rentang threshold lain — model bisa berguna di kapasitas berbeda." },
          ],
        },
      ],
      reference: "AUC = kepintaran. Kalibrasi = kejujuran. NB = kegunaan. Threshold = kapasitas.",
    },
    {
      id: "lab-netbenefit",
      eyebrow: "Langkah 7 · Lab",
      title: "Hitung net benefit dua threshold",
      prose: [
        "Evaluasi temporal (N=1.000, prevalensi readmission 18%) menghasilkan dua kandidat threshold. Threshold 10%: sensitivitas 85%, spesifisitas 70%. Threshold 30%: sensitivitas 55%, spesifisitas 90%. Tugasmu: tulis fungsi `nb(tp, fp, pt)` dan hitung net benefit keduanya. Lalu jawab: pada threshold mana model memberi nilai tambah terbesar?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `nb_10` (net benefit pada threshold 10%)" },
        { id: "t2", text: "Hitung `nb_30` (net benefit pada threshold 30%)" },
      ],
      expected: "nb_10≈0.126 nb_30≈0.064",
      note: {
        title: "Kaitan ke risk",
        body: "Memilih threshold dari “kelihatan bagus di ROC” alih-alih dari NB pada kapasitas nyata berarti mengorbankan ratusan jam perawat untuk false positive — dan ketika perawat berhenti percaya pada alert, seluruh investasi model hangus.",
        type: "risk",
      },
      hints: [
        "TP = sens × prevalensi × N; FP = (1 − spes) × (1 − prevalensi) × N.",
        "NB = TP/N − (FP/N) × (pt/(1−pt)). Bobot FP = odds threshold.",
        "Threshold 10%: TP=153, FP=246. Threshold 30%: TP=99, FP=82.",
      ],
      code: {
        starter: `# N=1000, prevalensi 18%; th 10%: sens 85% spes 70%; th 30%: sens 55% spes 90%
# TULIS KODEMU: fungsi nb(tp, fp, pt), lalu nb_10 dan nb_30
nb_10 = 
nb_30 = 
print(f"nb_10={nb_10:.3f} nb_30={nb_30:.3f}")`,
        lockLines: 1,
        solution: `# N=1000, prevalensi 18%; th 10%: sens 85% spes 70%; th 30%: sens 55% spes 90%
# TULIS KODEMU: fungsi nb(tp, fp, pt), lalu nb_10 dan nb_30
N, prev = 1000, 0.18
def nb(tp, fp, pt):
    return tp / N - (fp / N) * (pt / (1 - pt))
tp10, fp10 = 0.85 * prev * N, (1 - 0.70) * (1 - prev) * N
tp30, fp30 = 0.55 * prev * N, (1 - 0.90) * (1 - prev) * N
nb_10 = nb(tp10, fp10, 0.10)
nb_30 = nb(tp30, fp30, 0.30)
print(f"nb_10={nb_10:.3f} nb_30={nb_30:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nb_10", value: 0.126, tol: 0.002, label: "`nb_10` seharusnya ≈ 0.126", msg: "0,153 − 0,246×(0,1/0,9) — mengalahkan “intervensi semua” (0,089)." },
          { kind: "equal", task: "t2", name: "nb_30", value: 0.064, tol: 0.002, label: "`nb_30` seharusnya ≈ 0.064", msg: "0,099 − 0,082×(0,3/0,7) — masih positif, margin menipis." },
          { kind: "stdout_matches", task: "t2", pattern: "nb_10=0\\.126 nb_30=0\\.064", label: "`print` menampilkan kedua net benefit", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "NB pada threshold 10% (0,126) vs 30% (0,064). Jika kapasitas perawat longgar (bisa intervensi banyak), threshold mana?",
          options: [
            { text: "10% — NB lebih tinggi, tiap intervensi memberi nilai tambah lebih besar", why: "Benar: NB sudah memperhitungkan biaya FP. Pilih threshold dengan NB tertinggi dalam batas kapasitas.", correct: true },
            { text: "30% — lebih sedikit false positive", why: "FP sudah dihargai di dalam NB via bobot odds; 0,064 < 0,126." },
            { text: "50% — tengah-tengah selalu aman", why: "Tidak ada yang “aman” tanpa hitungan; tengah-tengah bukan metode." },
            { text: "0% — intervensi semua pasien", why: "NB “intervensi semua” pada 10% hanya 0,089 < 0,126 — model lebih baik." },
          ],
        },
      ],
      reference: "NB membandingkan model vs strategi sederhana pada threshold yang sama.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: dari model ke keputusan direksi",
      prose: [
        "Lima situasi keputusan yang merangkum seluruh capstone — dari data mentah hingga tanda tangan direksi:",
        "Skenario 1 — “Mulai proyek prediksi readmission?” → Tetapkan definisi outcome dan prediction time SEBELUM menyentuh data, lalu audit leakage: fitur dari masa depan = model yang memprediksi masa lalu. Tidak ada metrik yang bisa menyelamatkan definisi yang bocor.",
        "Skenario 2 — “Threshold operasionalnya berapa?” → Dari kapasitas intervensi dan net benefit — bukan default 0,5. Contoh: kapasitas 50 intervensi/bulan → threshold persentil-94 (PPV 38%, sensitivitas 55%). Threshold adalah keputusan sumber daya, bukan statistik.",
        "Skenario 3 — “Pitch Rp850 juta ke direksi?” → Sajikan aritmetika keputusan lengkap: ekspektasi true positive (50 × 0,38 = 19/bulan) × efektivitas intervensi (25%) = 57 readmission dicegah/tahun × Rp18 juta = Rp1.026 juta penghematan vs Rp850 juta biaya → impas bulan ke-10. Model tidak menyelamatkan proyek — aritmetika yang menyelamatkan.",
        "Skenario 4 — “Bagaimana bila asumsinya meleset?” → Jalankan analisis sensitivitas SEBELUM pitch: bila PPV riil 25% (bukan 38%), penghematan turun ke Rp670 juta < Rp850 juta — tidak impas. Tetapkan kriteria stop/go pra-spesifikasi: lanjutkan bila PPV ≥30% dan kalibrasi stabil; hentikan bila tidak. Tulis asumsi terlemah di halaman yang SAMA dengan angka ROI-nya.",
        "Skenario 5 — “Setelah deploy, lalu apa?” → Monitor drift: kalibrasi-in-the-large dan PPV dipantau berkala; populasi, praktik klinis, dan definisi coding berubah — model yang tidak dimonitor adalah model yang diam-diam kedaluwarsa. Jadwalkan rekalibrasi dan evaluasi ulang threshold.",
        "Aturan praktis 10 detik: definisi + anti-leakage dulu → threshold dari kapasitas → pitch = aritmetika lengkap + asumsi terlemah tertulis → sensitivitas asumsi + kriteria stop/go → monitor drift selamanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Pitch Rp850 juta tanpa analisis sensitivitas — direksi menandatangani cek berdasarkan skenario terbaik, satu asumsi meleset dan proyek merugi, dan yang disalahkan adalah “model AI yang gagal” padahal yang gagal adalah aritmetika keputusannya. Lakukan premortem sebelum pitch: bayangkan proyek gagal setahun kemudian, lalu tulis penyebabnya hari ini.",
        type: "pitfall",
      },
      reference: "Tulis asumsi terlemah di halaman yang sama dengan ROI.",
    },
    {
      id: "minicase-pitch",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case 1: Pitch Rp850 juta ke direksi",
      prose: [
        "Direksi menyetujui pilot intervensi readmission: Rp850 juta/tahun untuk tim perawat khusus (kapasitas 50 intervensi/bulan). Mereka minta satu halaman: “berapa readmission yang dicegah, dan kapan impas?” Modelmu: AUC 0,78, terkalibrasi, threshold operasional persentil-94 (PPV 38%, sensitivitas 55%).",
        "Hitunganmu: 800 pasien pulang/bulan → 50 intervensi (6,25% teratas). Dari 50, ekspektasi true positive = 50 × 0,38 = 19 pasien yang benar-benar berisiko. Intervensi (kunjungan rumah + edukasi obat) menurunkan readmission 25% (angka dari trial). Readmission dicegah ≈ 19 × 0,25 ≈ 4,75/bulan ≈ 57/tahun. Biaya satu readmission (INA-CBG + denda mutu): Rp18 juta. Penghematan ≈ 57 × 18 = Rp1.026 juta/tahun vs biaya Rp850 juta → ROI positif, impas sekitar bulan ke-10.",
        "Pertanyaan: (1) asumsi mana yang paling rapuh? (2) apa syarat yang kamu ajukan agar pilot dilanjutkan? (3) bagaimana bila PPV riil ternyata 25%?",
        "Pembahasan: (1) Efektivitas intervensi 25% — diambil dari trial di populasi lain; butuh validasi pilot lokal. (2) Syarat: pilot 3 bulan dengan kalibrasi dan PPV termonitor; kriteria stop bila PPV <30% atau calibration-in-the-large bergeser >5 poin. (3) Pada PPV 25%: TP = 12,5 → dicegah 3,1/bulan → 37/tahun × Rp18 juta = Rp670 juta < Rp850 juta → TIDAK impas; opsi: naikkan threshold, perbaiki model, atau turunkan biaya intervensi. Pelajaran capstone: model tidak menyelamatkan proyek — aritmetika keputusan yang menyelamatkan. Dan aritmetika itu hanya sekuat asumsi terlemahnya: tulislah asumsi itu di halaman yang sama dengan angka ROI-nya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Pitch Rp850 juta tanpa analisis sensitivitas asumsi (PPV, efektivitas intervensi) berarti direksi menandatangani cek berdasarkan skenario terbaik. Satu asumsi meleset dan proyek merugi — dan yang disalahkan bukan asumsinya, melainkan “model AI yang gagal”.",
        type: "risk",
      },
      reference: "Tulis asumsi terlemah di halaman yang sama dengan ROI.",
    },
    {
      id: "monitoring-drift",
      eyebrow: "Langkah 10 · Monitoring",
      title: "Model menua: deteksi drift dan kriteria rollback",
      prose: [
        "Deploy bukan garis finis — ia awal dari penitipan. Tiga penuaan yang mengintai model readmission: (a) drift populasi — case-mix berubah (mis. RS membuka layanan jantung baru → pasien lebih berat); (b) drift praktik — protokol discharge berubah sehingga prediktor kehilangan makna; (c) performative prediction — intervensi yang berhasil menurunkan readmission membuat model terlihat “memburuk” padahal ia bekerja.",
        "Monitoring minimal yang defensibel: tiap bulan hitung calibration-in-the-large, calibration slope, dan AUC temporal pada data bulan berjalan. Tetapkan ambang aksi SEBELUM launch — mis. |calibration-in-the-large| > 0,05 dua bulan berturut-turut → investigasi; >0,08 → rollback ke skor manual sementara. Tanpa ambang yang ditulis di awal, setiap penurunan akan didebat (“cuma fluktuasi”) sampai terlambat.",
        "Tugasmu: dari 8 bulan calibration-in-the-large [0,01, 0,02, 0,00, 0,03, 0,02, 0,06, 0,07, 0,05], tentukan `bulan_breach` (bulan pertama |cal| > 0,05) dan `tren` (“memburuk” bila rata-rata 3 bulan terakhir > 3 bulan pertama, selain itu “stabil”).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bulan_breach` (1-based)" },
        { id: "t2", text: "Tentukan `tren` (“memburuk”/“stabil”)" },
      ],
      expected: "bulan_breach=6 tren=memburuk",
      note: {
        title: "Sering salah",
        body: "Mengira monitoring = melihat AUC tiap bulan. AUC bisa stabil sementara kalibrasi bergeser — model tetap mengurutkan dengan benar tapi angkanya berbohong, dan keputusan berbasis angka (threshold!) yang rusak duluan.",
        type: "pitfall",
      },
      hints: [
        "Breach = |cal| > 0,05. Cari indeks pertama yang memenuhi, lalu +1 (1-based).",
        "Tren: bandingkan rata-rata 3 terakhir vs 3 pertama.",
        "Bulan ke-6 = 0,06 → breach pertama.",
      ],
      code: {
        starter: `# calibration-in-the-large per bulan (prediksi - aktual)
cal = [0.01, 0.02, 0.00, 0.03, 0.02, 0.06, 0.07, 0.05]
# TULIS KODEMU: bulan_breach dan tren
bulan_breach = 
tren = 
print(f"bulan_breach={bulan_breach} tren={tren}")`,
        lockLines: 1,
        solution: `# calibration-in-the-large per bulan (prediksi - aktual)
cal = [0.01, 0.02, 0.00, 0.03, 0.02, 0.06, 0.07, 0.05]
# TULIS KODEMU: bulan_breach dan tren
AMBANG = 0.05
bulan_breach = next(i + 1 for i, c in enumerate(cal) if abs(c) > AMBANG)
tren = "memburuk" if sum(cal[-3:]) / 3 > sum(cal[:3]) / 3 else "stabil"
print(f"bulan_breach={bulan_breach} tren={tren}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bulan_breach", value: 6, tol: 1e-9, label: "`bulan_breach` seharusnya 6", msg: "Bulan ke-6: |0,06| > 0,05 — investigasi dimulai." },
          { kind: "contains", task: "t2", name: "tren", value: "memburuk", label: "`tren` seharusnya “memburuk”", msg: "Rata-rata 3 terakhir (0,06) > 3 pertama (0,01) — bukan fluktuasi sesaat." },
          { kind: "stdout_matches", task: "t2", pattern: "bulan_breach=6 tren=memburuk", label: "`print` menampilkan hasil monitoring", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "AUC stabil 0,78 selama 6 bulan tapi calibration-in-the-large bergeser ke +0,07. Tindakan?",
          options: [
            { text: "Investigasi/rekalibrasi — angka model berbohong walau ranking benar", why: "Benar: keputusan memakai angka (threshold), bukan ranking. Kalibrasi yang rusak = keputusan yang rusak.", correct: true },
            { text: "Tidak apa-apa, AUC stabil", why: "AUC buta terhadap bias sistematis — justru jebakan monitoring yang umum." },
            { text: "Training ulang total segera", why: "Mulai dari investigasi + rekalibrasi; training ulang adalah opsi terakhir." },
            { text: "Naikkan threshold", why: "Mengakali gejala tanpa memahami penyebab — kalibrasi harus diperbaiki dulu." },
          ],
        },
      ],
      reference: "Tulis ambang rollback SEBELUM launch. Model menua — rencanakan tanggal kedaluwarsanya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan selamat",
      prose: [
        "Lima pertanyaan terakhir dari track ini. Setiap opsi punya alasan kenapa benar atau salah. Setelah ini, kamu punya portofolio end-to-end Health Data Science: dari sumber data (HD1) hingga laporan yang dipercaya direksi (HD20).",
      ],
      tasks: [],
      summary: [
        "Capstone = proses defensibel, bukan AUC tertinggi.",
        "Tahap 1: definisi + prediction time dikunci bersama klinisi.",
        "Tahap 2: wrangling + leakage audit per fitur.",
        "Tahap 3: empat lensa — diskriminasi, kalibrasi, utilitas, fairness.",
        "Tahap 4: TRIPOD + slide direksi + repo + monitoring. Deploy = tengah proyek.",
      ],
      next: { label: "BI1 — Biologi Molekuler", href: "/learn/bi1-biologi-molekuler" },
      quiz: [
        {
          q: "Langkah PERTAMA proyek model klinis yang benar?",
          options: [
            { text: "Kunci definisi outcome/populasi/prediction time bersama klinisi", why: "Benar: kontrak definisi dulu. 80% kegagalan lahir di tahap 1–2, bukan di modeling.", correct: true },
            { text: "Pilih algoritma ML", why: "Algoritma adalah tahap 3 — definisi dan data harus beres dulu." },
            { text: "Kumpulkan semua fitur", why: "Fitur tanpa definisi outcome yang jelas = istana pasir." },
            { text: "Tuning hyperparameter", why: "Hyperparameter adalah optimasi tahap akhir, bukan fondasi." },
          ],
        },
        {
          q: "Fitur “jumlah diagnosis saat readmission” untuk prediksi saat discharge adalah…",
          options: [
            { text: "Target leakage — dari masa depan relatif terhadap prediction time", why: "Benar: t_fitur > t_prediction. Audit ketersediaan per fitur adalah gerbang wajib.", correct: true },
            { text: "Fitur terbaik", why: "Terbaik secara statistik justru karena bocor — ia “tahu” jawabannya." },
            { text: "Wajib dipakai", why: "Memakainya berarti memprediksi masa lalu." },
            { text: "Netral", why: "Tidak netral: ia menggelembungkan AUC secara artifisial." },
          ],
        },
        {
          q: "Urutan evaluasi model klinis yang benar?",
          options: [
            { text: "Diskriminasi → kalibrasi → utilitas (decision curve) → fairness", why: "Benar: empat lensa berurutan. Satu lensa = buta tiga sisi.", correct: true },
            { text: "AUC saja cukup", why: "AUC hanya satu dari empat lensa — tanpa kalibrasi angkanya tak bisa dipercaya." },
            { text: "Fairness dulu", why: "Fairness penting tapi butuh model yang sudah terkalibrasi untuk diaudit bermakna." },
            { text: "Tergantung mood", why: "Urutan ini prinsipil, bukan preferensi." },
          ],
        },
        {
          q: "Disparitas TPR 9 poin antar grup pembiayaan ditemukan. Tindakan?",
          options: [
            { text: "Investigasi akar (fitur bias), mitigasi (threshold per grup/fitur adil), laporkan transparan", why: "Benar: audit → mitigasi → lapor. Fairness adalah bagian deliverable, bukan lampiran.", correct: true },
            { text: "Sembunyikan", why: "Menyembunyikan = malapraktik analitik; skandal fairness menghancurkan proyek." },
            { text: "Hapus grup minoritas", why: "Menghapus grup yang dirugikan justru memperparah ketidakadilan." },
            { text: "Naikkan threshold global", why: "Threshold global tidak menutup gap antar grup — butuh mitigasi per grup." },
          ],
        },
        {
          q: "Direksi minta threshold 10% (tangkap semua) tapi kapasitas 50/bulan vs 400 pasien. Rekomendasi?",
          options: [
            { text: "Threshold 25% sesuai kapasitas: presisi > recall saat sumber daya terbatas + decision curve", why: "Benar: 400 alarm yang diabaikan < 50 intervensi tepat sasaran. Tawarkan bertahap.", correct: true },
            { text: "Ikuti saja", why: "Penurut tidak dipercaya; penolak berdasar data dihormati — dan 400 alarm akan dibanjiri lalu diabaikan." },
            { text: "Threshold 50%", why: "Terlalu tinggi tanpa dasar; 25% sudah dihitung dari kapasitas + decision curve." },
            { text: "Tanpa threshold", why: "Tanpa threshold tidak ada aturan operasional yang jelas." },
          ],
        },
      ],
    },
  ],
};

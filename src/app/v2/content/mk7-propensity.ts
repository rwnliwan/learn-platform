import type { V2Lesson } from "../lib/types";

export const mk7: V2Lesson = {
  slug: "mk7-propensity",
  track: "Marketing Analytics",
  module: "Propensity & NBA",
  title: "MK7 — Propensity & Next-Best-Action",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-propertiku",
      eyebrow: "Langkah 1 · Cerita PropertiKu",
      title: "10.000 lead teratas, 200 pembeli",
      prose: [
        "PropertiKu punya 100.000 leads — sales tidak mungkin menelepon semuanya. Model propensity mengurutkan mereka; 10.000 teratas (decile 10) ditelepon, menghasilkan 200 pembeli.",
        "Decile 10 convert 2% vs rata-rata 0,4% — lift 5x. Artinya: menelepon 10% leads terbaik sama produktifnya dengan menelepon 50% secara acak. Sales 5x lebih efisien.",
        "Tapi ada syarat yang sering dilupakan: skor harus terkalibrasi. Skor 0,8 harus berarti \u201C8 dari 10 seperti ini benar-benar convert\u201D — bukan sekadar ranking. Tanpa kalibrasi, threshold dan EV-mu bohong.",
      ],
      formula: String.raw`\text{lift} = \frac{\text{conversion decile teratas}}{\text{conversion rata-rata}} = \frac{2\%}{0{,}4\%} = 5`,
      formulaNote: "lift = ukuran konsentrasi model: conversion decile teratas = conversion rate di 10% skor tertinggi (2%); conversion rata-rata = baseline seluruh populasi (0,4%). Lift 5 = menelepon 10% teratas sama produktifnya dengan menelepon 50% secara acak. Lift mengukur efisiensi targeting, bukan akurasi prediksi.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai skor propensity yang tidak terkalibrasi untuk threshold. Ranking benar belum tentu probabilitasnya benar — kalibrasi (Platt/isotonic atau cek decile) wajib sebelum dipakai sebagai probabilitas.",
        type: "pitfall",
      },
      reference: "Propensity = P(convert|X). Kalibrasi dulu, baru pakai sebagai probabilitas.",
    },
    {
      id: "kalibrasi-cutoff",
      eyebrow: "Langkah 2 · Kalibrasi & cutoff",
      title: "Dari skor ke keputusan: p* = c/m",
      prose: [
        "Propensity observasional: ia memprediksi siapa yang akan convert, bukan siapa yang convert karena aksimu. Jangan tertukar dengan uplift (MK11) — propensity bilang \u201Csiapa panas\u201D, uplift bilang \u201Csiapa berubah karena disentuh\u201D.",
        "Cutoff ekonomis: hubungi jika p > c/m, di mana c = biaya aksi, m = margin jika convert. Biaya telepon Rp50rb, margin Rp5jt → cutoff 1%. Di bawah itu, expected value negatif — diam lebih baik.",
        "Untuk aksi multi-pilihan (email vs telepon vs diam), cutoff tunggal tidak cukup — butuh Next-Best-Action.",
      ],
      formula: String.raw`p^* = \frac{c}{m}`,
      formulaNote: "p* = cutoff probabilitas ekonomis: c = biaya aksi per pelanggan (mis. Rp50rb telepon); m = margin kontribusi jika pelanggan convert (mis. Rp5jt). Hubungi hanya jika p > c/m — di bawah itu expected value negatif. Ini versi sederhana dari threshold EV (MK6) untuk satu aksi.",
      tasks: [],
      reference: "Propensity = observasional (bukan kausal). Cutoff = biaya/margin.",
    },
    {
      id: "nba-lab",
      eyebrow: "Langkah 3 · NBA & lab",
      title: "Next-Best-Action: argmax atas expected value",
      prose: [
        "NBA = untuk tiap pelanggan, pilih aksi dengan expected value tertinggi: NBA = argmax_a [P(respons|a,X) × V − C(a)]. \u201CDiam\u201D adalah aksi yang valid — kadang EV tertinggi adalah tidak melakukan apa-apa.",
        "Worked example, lead Andi: email (p=10%, V=Rp1jt, C=Rp2rb) → EV Rp98rb. Telepon (p=8%, V=Rp5jt, C=Rp50rb) → EV Rp350rb. Diam (p=0,5%, V=Rp5jt, C=0) → EV Rp25rb. NBA = telepon.",
        "Perhatikan: telepon menang bukan karena probabilitasnya tertinggi (8% < 10%), melainkan karena value-nya besar. NBA menyeimbangkan probabilitas, value, dan biaya sekaligus.",
      ],
      formula: String.raw`\text{NBA} = \arg\max_a \big[P(\text{respons} \mid a, X) \times V - C(a)\big]`,
      formulaNote: "NBA = next-best-action: untuk tiap pelanggan pilih aksi a yang memaksimalkan expected value. P(respons|a,X) = probabilitas respons jika diberi aksi a (X = fitur pelanggan); V = value jika respons terjadi; C(a) = biaya aksi a. 'Diam' adalah aksi valid dengan C = 0.",
      tasks: [
        { id: "t1", text: "Hitung `ev_email`, `ev_telp`, `ev_diam`" },
        { id: "t2", text: "Tentukan `nba` = nama aksi dengan EV tertinggi" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "ev_email=98000 ev_telp=350000 ev_diam=25000 nba=telepon",
      note: {
        title: "Sering salah",
        body: "Memilih aksi dengan probabilitas respons tertinggi. Email 10% > telepon 8%, tapi EV telepon 3,5x lipat — probabilitas tanpa value dan biaya menyesatkan.",
        type: "pitfall",
      },
      hints: [
        "EV = p × V − C. Contoh: ev_email = 0.10 * 1000000 - 2000.",
        "ev_diam: C = 0, jadi EV = p × V.",
        "nba = \"telepon\" jika ev_telp terbesar — bandingkan ketiganya.",
      ],
      code: {
        starter: `# Lead Andi: (p respons, value Rp, biaya Rp)\nemail   = (0.10, 1000000, 2000)\ntelepon = (0.08, 5000000, 50000)\ndiam    = (0.005, 5000000, 0)\n\n# TULIS KODEMU: EV tiap aksi + pilih NBA\nev_email =\nev_telp =\nev_diam =\nnba =\n\nprint(f"ev_email={ev_email:.0f} ev_telp={ev_telp:.0f} ev_diam={ev_diam:.0f} nba={nba}")`,
        lockLines: 4,
        solution: `# Lead Andi: (p respons, value Rp, biaya Rp)\nemail   = (0.10, 1000000, 2000)\ntelepon = (0.08, 5000000, 50000)\ndiam    = (0.005, 5000000, 0)\n\n# TULIS KODEMU: EV tiap aksi + pilih NBA\nev_email = email[0] * email[1] - email[2]\nev_telp = telepon[0] * telepon[1] - telepon[2]\nev_diam = diam[0] * diam[1] - diam[2]\nnba = "telepon" if ev_telp >= ev_email and ev_telp >= ev_diam else ("email" if ev_email >= ev_diam else "diam")\n\nprint(f"ev_email={ev_email:.0f} ev_telp={ev_telp:.0f} ev_diam={ev_diam:.0f} nba={nba}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ev_email", value: 98000, tol: 1, label: "`ev_email` seharusnya 98000", msg: "0,10 × 1.000.000 − 2.000 = 98.000." },
          { kind: "equal", task: "t1", name: "ev_telp", value: 350000, tol: 1, label: "`ev_telp` seharusnya 350000", msg: "0,08 × 5.000.000 − 50.000 = 350.000." },
          { kind: "equal", task: "t1", name: "ev_diam", value: 25000, tol: 1, label: "`ev_diam` seharusnya 25000", msg: "0,005 × 5.000.000 − 0 = 25.000." },
          { kind: "equal", task: "t2", name: "nba", value: "telepon", label: "`nba` seharusnya telepon", msg: "350.000 adalah EV tertinggi." },
          { kind: "stdout_matches", task: "t3", pattern: "nba=telepon", label: "`print` menampilkan nba", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NBA = argmax EV. \u201CDiam\u201D aksi valid.",
    },
    {
      id: "diam-valid",
      eyebrow: "Langkah 4 · Diam itu aksi",
      title: "Keberanian untuk tidak melakukan apa-apa",
      prose: [
        "Budaya sales: \u201Csemua lead harus di-follow up\u201D. Matematika: follow-up ke lead dengan EV negatif = membakar uang + mengganggu calon pelanggan. \u201CDiam\u201D bukan kemalasan — ia keputusan dengan EV tertinggi untuk segmen itu.",
        "Praktiknya: buat tier. Tier 1 (EV tinggi) → telepon personal. Tier 2 → email otomatis. Tier 3 (EV negatif) → diam, masuk nurturing massal murah. Sales fokus di tier 1 — inilah sumber lift 5x PropertiKu.",
        "Fallback rule: jika model down atau data tidak lengkap, fallback ke aksi termurah (email), bukan termahal. Jangan pernah fallback ke \u201Ctelepon semua\u201D.",
      ],
      tasks: [],
      reference: "Tier by EV. Fallback selalu ke aksi termurah.",
    },
    {
      id: "lookalike",
      eyebrow: "Langkah 5 · Lookalike",
      title: "Seed lookalike = CLV tertinggi",
      prose: [
        "Lookalike: beri platform \u201Cseed\u201D pelanggan terbaik, ia cari orang mirip. Kesalahan umum: seed = semua pembeli. Yang benar: seed = pelanggan dengan CLV tertinggi (MK5).",
        "Kenapa: lookalike meniru seed-mu. Seed pembeli diskonan → dapat pemburu diskon. Seed Champions → dapat calon Champions. Kualitas seed = kualitas hasil — sampah masuk, sampah keluar.",
        "Ukuran seed: 1.000–5.000 terbaik biasanya cukup. Terlalu kecil = noise; terlalu besar = mengencerkan \u201Cterbaik\u201D-nya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Lookalike memperkuat bias seed. Seed yang bias gender/usia/wilayah → targeting yang bias → masalah fairness (MK18). Audit komposisi seed sebelum diserahkan ke platform.",
        type: "risk",
      },
      reference: "Seed = top CLV, bukan semua pembeli. Audit bias seed.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek judgment propensity-mu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Model propensity baru selesai dilatih, AUC 0,85. Sebelum dipakai untuk cutoff, apa yang wajib?",
          options: [
            { text: "Kalibrasi — pastikan skor 0,8 ≈ 80% convert", why: "AUC hanya soal ranking. Cutoff butuh probabilitas yang benar.", correct: true },
            { text: "Langsung pakai, AUC sudah bagus", why: "Ranking bagus ≠ probabilitas benar. Cutoff dari skor tak terkalibrasi = salah." },
            { text: "Naikkan threshold ke 0,9", why: "Threshold dari EV (c/m), bukan angka cantik." },
          ],
        },
        {
          q: "Propensity tinggi (p=0,9) tapi margin kecil dan biaya telepon besar. Aksi?",
          options: [
            { text: "Hitung EV — bisa jadi \u201Cdiam\u201D yang menang", why: "Probabilitas tinggi tidak menjamin EV positif.", correct: true },
            { text: "Telepon — 90% pasti convert", why: "0,9 bukan 1,0; dan biaya bisa melampaui expected value." },
            { text: "Email massal ke semua", why: "Tanpa hitung EV, ini tebak-tebakan." },
          ],
        },
        {
          q: "Lift decile teratas = 5x. Artinya?",
          options: [
            { text: "10% teratas convert 5x rata-rata — fokus effort di sana", why: "2% vs 0,4%. Itulah efisiensi targeting.", correct: true },
            { text: "Model 5x lebih akurat", why: "Lift ≠ akurasi. Lift soal konsentrasi, bukan kebenaran prediksi." },
            { text: "Revenue naik 5x", why: "Lift conversion di segmen ≠ lift revenue total." },
          ],
        },
      ],
    },
    {
      id: "adv-overlap",
      eyebrow: "Langkah 7 · Overlap & positivity",
      title: "Kapan propensity tidak bisa dipakai: pelanggaran positivity",
      prose: [
        "Propensity score juga dipakai untuk estimasi kausal: P(diobati|X). Syaratnya disebut positivity (overlap): untuk setiap X, probabilitas diobati harus di antara 0 dan 1 — ada yang diobati DAN tidak di tiap segmen. Jika VIP selalu ditelepon (p=1) dan lead dingin tidak pernah (p=0), tidak ada matematika yang bisa mempelajari efek telepon untuk VIP: tidak ada pembandingnya.",
        "Contoh PropertiKu: 10.000 VIP selalu ditelepon (convert 8%), 90.000 lainnya tidak pernah (convert 2%). Selisih 6 poin BUKAN efek telepon — VIP memang lebih panas sejak awal. Tanpa overlap, selisih observasional = bias seleksi murni.",
        "Solusi praktis: (a) batasi analisis ke daerah overlap (common support) — buang segmen dengan p ekstrem; (b) matching — untuk tiap yang diobati, cari kembaran tak-diobati dengan X mirip, bandingkan outcome; (c) IPW — boboti dengan 1/p agar sampel menyerupai populasi acak. Ketiganya gagal jika overlap-nya nol — tidak ada trik statistik yang menciptakan pembanding yang tidak ada.",
      ],
      tasks: [],
      quiz: [
        {
          q: "VIP selalu ditelepon (8% convert), non-VIP tidak pernah (2%). Klaim 'telepon menaikkan conversion 6 poin' — sah?",
          options: [
            { text: "Tidak — positivity dilanggar, selisihnya bias seleksi murni", why: "Tidak ada VIP tak-ditelepon sebagai pembanding; 6 poin mencampur efek telepon dengan 'VIP memang panas'.", correct: true },
            { text: "Sah — datanya 100.000 leads", why: "Banyak data tidak memperbaiki tidak-adanya pembanding." },
            { text: "Sah jika memakai IPW", why: "IPW butuh p di (0,1); p=1/0 = pembagi nol/tak hingga. IPW juga gagal." },
            { text: "Sah — 8% > 2% sudah jelas", why: "Jelas beda, tetapi bedanya bukan efek kausal telepon." },
          ],
        },
        {
          q: "Matching mengatasi confounding dengan cara?",
          options: [
            { text: "Memasangkan tiap treated dengan kontrol ber-X mirip, lalu membandingkan outcome", why: "Kembaran = pembanding buatan; selisihnya mendekati efek kausal jika X mencakup semua confounder.", correct: true },
            { text: "Menghapus data yang tidak cocok", why: "Membuang data = mengurangi informasi; matching memakai semua yang punya pasangan." },
            { text: "Menambah fitur ke model", why: "Itu feature engineering, bukan matching." },
            { text: "Mengacak treatment setelah data terkumpul", why: "Tidak bisa mengacak masa lalu; matching adalah koreksi observasional." },
          ],
        },
      ],
      reference: "Tanpa overlap, tidak ada estimasi kausal — hanya bias seleksi.",
    },
    {
      id: "adv-doubly-robust",
      eyebrow: "Langkah 8 · Doubly robust & lab",
      title: "Dua jaring pengaman: IPW + model outcome",
      prose: [
        "IPW (inverse propensity weighting) mengoreksi bias seleksi dengan memboboti tiap observasi 1/p: yang jarang diobati tetapi diobati diberi bobot besar — seolah-olah sampel berasal dari eksperimen acak. Kelemahannya: jika p salah estimasi (atau mendekati 0/1), bobot meledak dan estimasi liar.",
        "Doubly robust (DR) memakai dua model: model outcome (prediksi Y dari X per grup treatment) DAN propensity. Sifatnya: jika SALAH SATU dari keduanya benar, estimasi efek tetap konsisten. Dua jaring pengaman — hanya gagal jika keduanya salah bersamaan.",
        "Di lab ini kamu menghitung efek naive vs IPW pada data PropertiKu yang confounding (VIP 90% diobati). Lihat sendiri: naive melebih-lebihkan 2x lipat, IPW mengembalikan angka yang benar (0,100).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `naive` = selisih conversion mentah (treated − kontrol)" },
        { id: "t2", text: "Hitung `ipw` = E[Y(1)] − E[Y(0)] dengan bobot 1/p" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "naive=0.222 ipw=0.100",
      hints: [
        "nt = A[0]*A[1] + B[0]*B[1]; nc = N - nt.",
        "conv_t = total convert treated / nt; conv_c = total convert kontrol / nc.",
        "E[Y(1)] = (A[0]*A[2] + B[0]*B[2]) / N — bobot 1/p membatalkan p.",
        "E[Y(0)] = (A[0]*A[3] + B[0]*B[3]) / N.",
      ],
      code: {
        starter: `# (n, p_treat, conv_treated, conv_control) per segmen
A = (100, 0.9, 0.40, 0.30)   # VIP: 90% diobati
B = (900, 0.1, 0.15, 0.05)   # lainnya: 10% diobati
N = A[0] + B[0]

# TULIS KODEMU: efek naive dan efek IPW
naive =
ipw =

print(f"naive={naive:.3f} ipw={ipw:.3f}")`,
        lockLines: 3,
        solution: `# (n, p_treat, conv_treated, conv_control) per segmen
A = (100, 0.9, 0.40, 0.30)   # VIP: 90% diobati
B = (900, 0.1, 0.15, 0.05)   # lainnya: 10% diobati
N = A[0] + B[0]

# TULIS KODEMU: efek naive dan efek IPW
nt = A[0]*A[1] + B[0]*B[1]
nc = N - nt
conv_t = (A[0]*A[1]*A[2] + B[0]*B[1]*B[2]) / nt
conv_c = (A[0]*(1-A[1])*A[3] + B[0]*(1-B[1])*B[3]) / nc
naive = conv_t - conv_c
ey1 = (A[0]*A[2] + B[0]*B[2]) / N
ey0 = (A[0]*A[3] + B[0]*B[3]) / N
ipw = ey1 - ey0

print(f"naive={naive:.3f} ipw={ipw:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "naive", value: 0.222, tol: 0.002, label: "`naive` sekitar 0,222", msg: "Selisih mentah melebih-lebihkan karena VIP mendominasi grup treated." },
          { kind: "equal", task: "t2", name: "ipw", value: 0.1, tol: 1e-9, label: "`ipw` seharusnya 0,100", msg: "Efek sebenarnya 0,10 di kedua segmen — IPW mengembalikannya." },
          { kind: "stdout_matches", task: "t3", pattern: "ipw=0.100", label: "`print` menampilkan ipw", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "IPW: bobot 1/p. DR: benar satu dari dua model = cukup.",
    },
    {
      id: "intuisi-panas",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Skor yang bagus menjawab pertanyaan yang salah = penyesatan yang presisi",
      prose: [
        "Propensity adalah alat yang tajam — dan alat tajam melukai jika dipakai untuk pertanyaan yang salah. Tiga heuristik menjaga ketajamannya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: propensity memprediksi siapa yang panas — bukan siapa yang butuh apimu",
        body: "Heuristik pertama: bedakan 'akan convert' dari 'convert karena aku'. Propensity menjawab yang pertama — ia hebat untuk efisiensi (telepon 10% terbaik = 50% hasil), tetapi buta terhadap kausalitas. Jika tujuanmu mengubah perilaku — retensi, upsell, win-back — propensity saja mengarahkanmu ke sure things: orang yang convert tanpa disentuh. Itu bukan targeting; itu panen. Untuk mengubah perilaku, butuh uplift. Heuristik kedua: skor tanpa kalibrasi = ranking tanpa makna probabilitas. AUC 0,85 tidak memberimu izin memakai 0,8 sebagai '80%' — kalibrasi (atau minimal cek conversion aktual per decile) adalah jembatan dari ranking ke keputusan. Cutoff c/m dari skor tak terkalibrasi = keputusan dari angka bohong. Heuristik ketiga: saat treatment tidak acak, waspadai positivity. Jika VIP selalu ditelepon dan lead dingin tidak pernah, tidak ada matematika yang mempelajari efek telepon untuk VIP — karena tidak ada pembandingnya. Di sinilah matching dan IPW masuk: mereka membangun pembanding buatan, tetapi hanya bekerja jika overlap-nya cukup. Dan heuristik terakhir: doubly robust adalah asuransi murah. Estimasi efek dengan dua cara — model outcome dan pembobotan propensity. Jika keduanya sepakat, tidurlah nyenyak. Jika berbeda jauh, salah satu asumsimu bocor — dan lebih baik tahu sekarang, sebelum budget habis, daripada sesudahnya.",
      },
      reference: "Panaskan yang panas untuk efisiensi; ubah perilaku butuh uplift.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: skor propensity dipakai untuk apa — dan untuk apa tidak",
      prose: [
        "Skenario satu — skor tinggi tidak berarti butuh aksi: VIP PropertiKu convert 8% dengan telepon, tetapi mungkin convert 7,5% tanpanya. Propensity menjawab 'siapa akan membeli', bukan 'siapa butuh ditelepon' — itu ranah uplift di MK11.",
        "Skenario dua — memilih cutoff: bukan 0,5 default. Pilih dari expected value (margin × lift − biaya aksi). Cutoff adalah keputusan bisnis, bukan statistik.",
        "Skenario tiga — skor tidak terkalibrasi: kalibrasi dulu — skor 0,8 harus berarti sekitar 80% kejadian. Model yang diskriminatif tetapi tak terkalibrasi menyesatkan alokasi budget.",
        "Skenario empat — lookalike untuk akuisisi: seed dari pelanggan terbaik (CLV tinggi), bukan dari semua pembeli. Lookalike dari pemburu diskon melahirkan pemburu diskon.",
        "Skenario lima — next-best-action: pilih satu aksi per pelanggan dengan EV tertinggi, bukan lima aksi sekaligus. Lima notifikasi adalah satu alasan untuk uninstall.",
        "Aturan praktis 10 detik: skor terkalibrasi? Cutoff dari EV, bukan 0,5? Aksi untuk persuadable? Satu aksi terbaik, bukan semua?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca korelasi sebagai kausalitas. 'Yang ditelepon convert 6 poin lebih tinggi' — padahal yang ditelepon memang VIP yang sudah niat beli. Tanpa kelompok pembanding, skor propensity hanya mengukur siapa yang sudah panas.",
      },
      reference: "Kalibrasi → cutoff dari EV → aksi untuk persuadable → satu aksi terbaik.",
    },
    {
      id: "minicase-propertiku2",
      eyebrow: "Langkah 11 · Mini-case",
      title: "PropertiKu, bagian 2: VIP selalu ditelepon",
      prose: [
        "Audit PropertiKu menemukan: 10.000 VIP selalu ditelepon (convert 8%), 90.000 non-VIP tidak pernah ditelepon (convert 2%). Tim sales mengklaim 'telepon menaikkan conversion 6 poin'. Direksi siap melipatgandakan tim telemarketing: Rp2 miliar/tahun.",
        "Analis menghitung ulang dengan IPW: efek sebenarnya telepon = +1,5 poin (bukan 6). Dari 6 poin selisih, 4,5 poin adalah bias seleksi — VIP memang lebih panas sejak awal. Nilai sebenarnya: 100.000 × 1,5% × Rp5jt margin = Rp7,5 miliar? Tidak — hanya untuk yang ditelepon: 10.000 × 1,5% × Rp5jt = Rp750jt nilai vs biaya Rp500jt (10.000 × Rp50rb). Masih positif, tetapi bukan Rp2 miliar yang dibayangkan.",
        "Pertanyaan: (1) Mengapa klaim 6 poin salah? (2) Keputusan budget telemarketing yang benar? (3) Eksperimen apa yang menguji klaim ini secara definitif?",
        "Pembahasan: (1) Positivity dilanggar — tidak ada VIP tak-ditelepon; selisih 6 poin = efek + bias seleksi. (2) Scale bertahap dengan guardrail: tambah 2.000 panggilan, ukur incremental via holdout kecil — bukan lompatan Rp2 miliar. (3) RCT kecil: acak 2.000 VIP menjadi ditelepon vs tidak — satu-satunya jangkar kebenaran untuk efek kausal.",
      ],
      tasks: [],
      quiz: [
        {
          q: "PropertiKu: klaim 'telepon +6 poin', IPW bilang +1,5 poin. Keputusan budget Rp2 miliar?",
          options: [
            { text: "Tolak lompatan — scale bertahap 2.000 panggilan dengan holdout untuk menguji", why: "Efek sebenarnya 4x lebih kecil dari klaim; keputusan Rp2 miliar butuh bukti kausal, bukan selisih observasional.", correct: true },
            { text: "Setujui — 1,5 poin masih positif", why: "Positif belum berarti cukup untuk Rp2 miliar; butuh EV lengkap + validasi." },
            { text: "Setujui — sales sudah yakin", why: "Keyakinan bukan bukti; bias seleksi 4,5 poin sudah terbukti." },
            { text: "Hentikan telemarketing total", why: "Efek +1,5 poin masih positif — yang salah klaimnya, bukan channelnya." },
          ],
        },
        {
          q: "Eksperimen definitif untuk menguji efek telepon?",
          options: [
            { text: "RCT kecil: acak VIP menjadi ditelepon vs tidak", why: "Randomisasi = positivity sempurna; selisihnya = efek kausal murni.", correct: true },
            { text: "Naikkan sampel observasional ke 1 juta", why: "Sampel besar tidak menciptakan pembanding yang tidak ada." },
            { text: "Ganti model ke deep learning", why: "Model lebih canggih tidak memperbaiki pelanggaran positivity." },
            { text: "Tanya VIP kenapa mereka convert", why: "Survei ≠ kausalitas; orang pandai merasionalisasi." },
          ],
        },
      ],
      reference: "Klaim kausal dari data observasional wajib diuji RCT kecil.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Propensity menjawab \u201Csiapa\u201D — NBA menjawab \u201Capa yang kulakukan ke mereka\u201D.",
      ],
      tasks: [],
      summary: [
        "Propensity = P(convert|X), observasional; lift D10 PropertiKu = 5x.",
        "Kalibrasi wajib sebelum skor dipakai sebagai probabilitas.",
        "Cutoff ekonomis p* = c/m; multi-aksi → NBA = argmax EV.",
        "\u201CDiam\u201D aksi valid; fallback selalu ke aksi termurah.",
        "Seed lookalike = top CLV; audit bias seed.",
        "Positivity: tanpa overlap treatment, tidak ada estimasi kausal — hanya bias seleksi.",
        "IPW mengoreksi via bobot 1/p; doubly robust aman jika satu dari dua model benar.",
      ],
      next: { label: "MK8 — Rekomendasi", href: "/learn/mk8-rekomendasi" },
      quiz: [
        {
          q: "Bedanya propensity (MK7) dan uplift (MK11)?",
          options: [
            { text: "Propensity: siapa akan convert. Uplift: siapa berubah karena aksiku", why: "Observasional vs kausal. Beda pertanyaan, beda model.", correct: true },
            { text: "Sama saja, beda nama", why: "Fatal: targeting by propensity bisa menyasar sure things yang convert tanpa aksi." },
            { text: "Uplift untuk akuisisi, propensity untuk retensi", why: "Keduanya bisa untuk keduanya; bedanya di kausalitas." },
          ],
        },
        {
          q: "EV email Rp98rb, telepon Rp350rb, diam Rp25rb. NBA dan kenapa?",
          options: [
            { text: "Telepon — EV tertinggi walau probabilitasnya bukan yang tertinggi", why: "NBA = argmax EV, bukan argmax p.", correct: true },
            { text: "Email — probabilitas 10% tertinggi", why: "Probabilitas tanpa value/biaya = setengah cerita." },
            { text: "Diam — paling murah", why: "Murah tapi EV-nya terendah di sini." },
          ],
        },
        {
          q: "Model propensity down saat kampanye berjalan. Fallback?",
          options: [
            { text: "Email otomatis (aksi termurah)", why: "Fallback aman = biaya terkecil. Jangan fallback ke telepon massal.", correct: true },
            { text: "Telepon semua lead", why: "Itu fallback termahal — bakar uang tanpa model." },
            { text: "Hentikan kampanye", why: "Berlebihan; aksi murah masih bisa jalan." },
          ],
        },
        {
          q: "Seed lookalike terbaik?",
          options: [
            { text: "Pelanggan dengan CLV tertinggi", why: "Lookalike meniru seed — tiru yang paling berharga.", correct: true },
            { text: "Semua pembeli pernah ada", why: "Mengencerkan kualitas; termasuk pemburu diskon sekali beli." },
            { text: "Semua leads", why: "Leads belum terbukti bernilai — seed jadi noise." },
          ],
        },
        {
          q: "Kapan \u201Cdiam\u201D menjadi NBA yang benar?",
          options: [
            { text: "Ketika EV semua aksi < EV diam (biasanya segmen EV negatif)", why: "Tidak melakukan apa-apa = keputusan optimal, bukan kemalasan.", correct: true },
            { text: "Tidak pernah — selalu ada aksi", why: "Aksi dengan EV negatif merugikan; diam mengalahkan mereka." },
            { text: "Hanya saat budget habis", why: "Bukan soal budget — soal EV per pelanggan." },
          ],
        },
      ],
    },
  ],
};

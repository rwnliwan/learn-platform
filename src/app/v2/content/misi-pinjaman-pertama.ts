import type { V2Mission } from "../lib/types";

// ── MISI PINJAMAN PERTAMA: Keputusan Kredit ──────────────────────────────
// Misi A (core) — Credit Risk. Dataset: Statlog German Credit (UCI, CC BY 4.0;
// OpenML credit-g: licence "Public"), 1.000 pengajuan historis, 20 atribut
// ter-decode + class good/bad. File: public/misi/misi-pinjaman-pertama/
// kredit.csv (bersih) + kredit_audit.csv (7 injeksi terdokumentasi).
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-pinjaman-pertama";

export const misiPinjamanPertama: V2Mission = {
  slug: "misi-pinjaman-pertama",
  track: "Credit Risk",
  module: "Misi",
  title: "Keputusan Kredit: Nasabah Ini Layak atau Tidak?",
  estMinutes: 135,
  role: "Credit Analyst (analis kredit)",
  client:
    "Komite Kredit bank menengah — 1.000 berkas pengajuan menunggu keputusan, dan komite butuh rekomendasi cut-off scorecard + bukti angka, bukan firasat",
  xp: 550,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Seribu berkas, satu angka cut-off, nol firasat",
      prose: [],
      tasks: [],
      briefing: {
        role: "Credit Analyst di divisi risiko bank menengah",
        client:
          "Komite Kredit. Di meja mereka menumpuk 1.000 berkas pengajuan pinjaman yang menunggu keputusan ya/tidak. Komite tidak mau dengar firasat analis senior — mereka mau satu angka: cut-off scorecard. Di bawah skor berapa pengajuan ditolak? Dan mereka mau buktinya: berapa default rate yang bisa ditekan, berapa bisnis bagus yang ikut terbuang, dan seberapa bisa dipercaya data di balik angka itu.",
        story: [
          "Rabu pagi, 08:15. Kepala Komite Kredit menggeser map tebal ke arahmu. “Seribu berkas. Kami mau putusan berbasis data, bukan insting. Kamu punya riwayat 1.000 pengajuan lama — lengkap dengan akhirnya: lunas atau macet. Kalibrasi scorecard dari situ, lalu beri kami rekomendasi cut-off yang bisa dipertahankan di depan direksi.” Ia berhenti sejenak. “Satu hal: tim data mengirim dua file. File audit-nya katanya sudah bersih — tapi minggu lalu ada anomali yang lolos ke laporan NPL. Percayai, tapi verifikasi.”",
          "Kamu membuka file pertamanya: 1.000 baris pengajuan historis Jerman — 20 atribut per debitur (riwayat kredit, tujuan pinjaman, plafon, usia, pekerjaan…) dan satu kolom kebenaran: good (lunas) atau bad (macet). Inilah bahan baku scorecard. Tapi ada catatan jujur yang wajib kamu pegang sejak awal: data ini dari Jerman era Deutsche Mark, puluhan tahun lalu. Ekonomi, mata uang, dan perilaku debiturnya beda dengan Indonesia 2026. Kamu boleh mengkalibrasi di atasnya — asal di laporan akhirmu tertulis jelas apa yang TIDAK bisa digeneralisasi.",
          "Misi ini mensimulasikan alur kerja analis kredit yang sesungguhnya: bangun baseline default rate per segmen dari data bersih, audit salinan file yang diklaim bersih, hadapi komite yang memberimu tiga arah kebijakan yang semuanya berbiaya, lalu tulis memo rekomendasi yang berani berkata “data ini belum layak” bila memang begitu. Cut-off yang kamu rekomendasikan akan menolak orang sungguhan — jadi setiap angka harus punya bukti.",
        ],
        objectives: [
          "Membangun baseline default rate (PD empiris) keseluruhan dan per segmen riwayat kredit, lalu mengkuantifikasi trade-off cut-off: NPL yang ditekan vs bisnis bagus yang terbuang.",
          "Menemukan sabotase data di file audit (duplikat, nilai mustahil, kode tak valid) dengan bukti kuantitatif — bukan firasat.",
          "Menulis memo rekomendasi untuk Komite Kredit: angka cut-off + bukti, temuan kualitas data, keputusan yang tidak diambil, dan batas-batas data — lengkap dengan rubrik penilaian diri.",
        ],
        prereqSummary:
          "PD (probability of default) = peluang debitur macet; di misi ini diestimasi secara empiris sebagai bad rate = proporsi class bad dari total pengajuan. Scorecard memberi tiap pengajuan skor; cut-off = ambang skor: di bawahnya ditolak, di atasnya disetujui. Menaikkan cut-off menekan NPL tetapi ikut menolak debitur yang sebenarnya akan lunas (opportunity cost). Matriks biaya di kamus data ini tegas: menyetujui debitur yang ternyata macet biayanya 5x lipat dibanding menolak debitur yang sebenarnya lunas — asimetris, tetapi matriks itu TIDAK memuat biaya bisnis yang hilang, jadi angka “optimal” statistik belum tentu keputusan bisnis yang benar.",
        datasetNote:
          "Sumber: Statlog German Credit Data (Prof. Dr. Hans Hofmann, via UCI Machine Learning Repository). Lisensi: halaman dataset UCI menyatakan CC BY 4.0; salinan identik di OpenML (credit-g, d/31) berlisensi “Public”. Atribusi: “Data: Prof. Dr. Hans Hofmann, Statlog German Credit Data (UCI ML Repository)”.\nIsi: 1.000 pengajuan, 20 atribut ter-decode dari kamus german.doc (A11..A410) + class good/bad. Mata uang = Deutsche Mark (DM).\nKejujuran: (1) data historis Jerman era DM — generalisasi ke Indonesia 2026 wajib disertai caveat; (2) kolom application_id (APP-0001..APP-1000) adalah ID sintetis dari urutan baris, bukan data asli — ditambahkan agar duplikat “ID aplikasi identik” bisa dideteksi; (3) file kredit.csv = data bersih ter-decode; file kredit_audit.csv = salinan yang SENGAJA disabotase (3 pasang duplikat, 2 installment_rate mustahil, 2 kode purpose tak valid, 1 umur mustahil). Detail injeksi: METODE.md — membacanya sekarang sama dengan mengintip kunci jawaban. Jangan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali medan sebelum menyentuh angka",
      prose: [
        "Dua file menunggumu di data room. File kredit.csv adalah versi bersih: 1.000 baris, 22 kolom — application_id, 20 atribut ter-decode (checking_account, duration_months, credit_history, purpose, credit_amount, savings, employment_since, installment_rate, personal_status, debtors, residence_since, property, age, installment_plans, housing, existing_credits, job, dependents, telephone, foreign_worker), dan class (good/bad). Ini fondasimu mengkalibrasi baseline — kolom class adalah “kebenaran historis”: good berarti lunas, bad berarti macet.",
        "File kredit_audit.csv adalah versi yang dikirim tim data dengan klaim “sudah bersih” — dan yang akan kamu audit. Isinya “sama”, tetapi seseorang menyuntikkan 7 sabotase tanpa pengumuman: baris duplikat ber-ID aplikasi identik, installment_rate yang mustahil, kode purpose yang tidak ada di kamus, dan umur yang mustahil. Detail tiap sabotase ada di METODE.md — tetapi membacanya sekarang sama dengan mengintip kunci jawaban. Jangan.",
        "Aturan main data room: (1) bangun baseline HANYA dari file bersih; (2) kecurigaan HANYA dari file audit; (3) setiap tuduhan anomali wajib punya bukti angka — “kelihatannya berisiko” bukan bukti. Ingat juga: class di file ini adalah hasil AKHIR yang sudah diketahui — dalam produksi, itulah yang justru harus kamu prediksi.",
      ],
      tasks: [
        { id: "t1", text: "Buka kredit.csv dan catat: berapa baris, berapa kolom, dan apa arti nilai class" },
        { id: "t2", text: "Identifikasi kolom mana yang berkode kamus (sudah ter-decode) dan mana yang numerik — catat satu contoh tiap jenis" },
      ],
      note: {
        title: "Miskonsepsi #1: data dari sistem bank pasti sudah bersih",
        type: "pitfall",
        body: "“Kan dari core banking, pasti sudah divalidasi.” Kenyataannya: rantai data kredit itu panjang — input cabang, migrasi sistem, impor batch, merge vendor. Tiap simpul bisa menggandakan baris, salah ketik kode, atau meloloskan nilai mustahil. File audit misi ini adalah buktinya: diklaim bersih, isinya disabotase. Tugas analis bukan memercayai stempel “bersih”, melainkan memverifikasi polanya.",
      },
      reference:
        "kredit.csv (bersih, 1.000 baris, 22 kolom) vs kredit_audit.csv (7 sabotase). Baseline dari yang bersih; audit pada yang diklaim bersih.",
    },
    {
      id: "lab-eda",
      eyebrow: "Langkah 3 · Lab 1 — Baseline default rate",
      title: "Berapa “normal”-nya angka kemacetan?",
      prose: [
        "Sebelum merekomendasikan cut-off, kamu butuh jangkar: berapa sih default rate di data historis ini — keseluruhan dan per segmen riwayat kredit? Inilah PD empiris, fondasi setiap scorecard. Lab ini memakai file BERSIH (kredit.csv). Data dimuat langsung dari server dengan open_url — URL-nya path relatif ke situs ini, jadi tidak perlu token apa pun.",
        "Ada satu temuan yang menunggu di langkah ini — dan ia melawan intuisi kebanyakan analis. Jangan hanya menghitung angkanya; tanyakan juga: segmen mana yang PALING berisiko, dan apakah ukuran sampelnya cukup untuk dipercaya?",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke df; hitung n_baris dan bad_rate (proporsi class == bad)" },
        { id: "t2", text: "Hitung bad rate per credit_history; simpan bad rate kategori no credits / all paid duly di bad_rate_tipis" },
        { id: "t3", text: "Hitung median credit_amount per class; simpan median kelas bad di median_plafon_bad, lalu print ketiganya" },
      ],
      expected:
        "n_baris=1000, bad_rate=0.30 (300 dari 1.000 pengajuan macet), bad rate riwayat no credits / all paid duly = 0.625 (TERTINGGI dari semua kategori!), median plafon kelas bad = 2574.5 DM",
      note: {
        title: "Miskonsepsi #2: riwayat kredit “bersih” = risiko rendah",
        type: "pitfall",
        body: "Intuisi berkata debitur tanpa riwayat kredit macet itu aman. Data berkata sebaliknya: bad rate TERTINGGI (62,5%) justru ada di kategori no credits / all paid duly — debitur thin-file yang belum pernah diuji. Tanpa riwayat = tanpa informasi, bukan tanpa risiko. Tetapi jujurlah juga soal ketidakpastian: kategori ini hanya berisi 40 debitur. Bad rate 62,5% dari n=40 jauh lebih goyah dibanding 17% dari n=293. Di memo, laporkan angkanya BESERTA ukuran sampelnya.",
      },
      hints: [
        "Muat CSV: from pyodide.http import open_url lalu pd.read_csv(open_url(URL)).",
        "Bad rate: (df[\"class\"] == \"bad\").mean() — rata-rata boolean = proporsi.",
        "Per kategori: df.groupby(\"credit_history\")[\"class\"].apply(lambda s: (s == \"bad\").mean()) — lalu ambil kunci no credits / all paid duly. Median per kelas: df.groupby(\"class\")[\"credit_amount\"].median().",
      ],
      requires: ["pandas"],
      formula: String.raw`\text{bad rate} = \frac{n_{\text{macet}}}{n_{\text{total}}} = \frac{300}{1000} = 0{,}30`,
      formulaNote: "Bad rate = PD empiris: proporsi pengajuan yang macet (class bad) dari seluruh pengajuan historis.",
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-pinjaman-pertama/kredit.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...          # banyak baris",
          "bad_rate = ...         # proporsi class == \"bad\"",
          "",
          "bad_rate_riwayat = ... # bad rate per credit_history",
          "bad_rate_tipis = ...   # bad rate kategori \"no credits / all paid duly\"",
          "",
          "median_plafon = ...    # median credit_amount per class",
          "median_plafon_bad = ...# median credit_amount untuk class \"bad\"",
          "",
          "print(\"baris:\", n_baris, \"| bad rate:\", bad_rate)",
          "print(\"bad rate thin-file:\", bad_rate_tipis)",
          "print(\"median plafon (bad):\", median_plafon_bad)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-pinjaman-pertama/kredit.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "bad_rate = (df[\"class\"] == \"bad\").mean()",
          "",
          "bad_rate_riwayat = df.groupby(\"credit_history\")[\"class\"].apply(lambda s: (s == \"bad\").mean())",
          "bad_rate_tipis = bad_rate_riwayat[\"no credits / all paid duly\"]",
          "",
          "median_plafon = df.groupby(\"class\")[\"credit_amount\"].median()",
          "median_plafon_bad = float(median_plafon[\"bad\"])",
          "",
          "print(\"baris:\", n_baris, \"| bad rate:\", bad_rate)",
          "print(\"bad rate thin-file:\", bad_rate_tipis)",
          "print(\"median plafon (bad):\", median_plafon_bad)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "df termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "n_baris = 1000", name: "n_baris", value: 1000, msg: "File bersih punya tepat 1.000 baris pengajuan historis." },
          { kind: "equal", task: "t1", label: "bad_rate = 0.30", name: "bad_rate", value: 0.3, tol: 1e-9, msg: "Hitung proporsi baris dengan class == \"bad\" (300 dari 1.000)." },
          { kind: "equal", task: "t2", label: "bad_rate_tipis = 0.625", name: "bad_rate_tipis", value: 0.625, tol: 1e-9, msg: "Kelompokkan per credit_history, hitung bad rate tiap kategori, lalu ambil kategori \"no credits / all paid duly\" (25 macet dari 40)." },
          { kind: "equal", task: "t3", label: "median_plafon_bad = 2574.5", name: "median_plafon_bad", value: 2574.5, tol: 1, msg: "Median credit_amount untuk class \"bad\" — kelompokkan per class dulu." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Jejak duplikat & cicilan mustahil",
      title: "Satu berkas, dua kali catat: siapa yang menggandakan?",
      prose: [
        "Baseline sudah di tangan. Sekarang senjata keduamu: SQL. Dua pola klasik di data pengajuan: (1) berkas duplikat — operator mengimpor batch yang sama dua kali tanpa constraint unik; (2) installment_rate mustahil — cicilan di atas 50% dari disposable income praktis tidak bisa dilunasi, jadi angka 99% pasti salah input. Di tabel kecil ini (12 berkas), keduanya ada. Temukan dengan GROUP BY + HAVING untuk duplikat, dan filter ambang untuk cicilan mustahil.",
        "Tabel pengajuan(application_id, nama, tujuan, plafon, installment_rate, usia, riwayat). Tulis SATU query yang mengembalikan semua temuan beserta jenisnya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang menemukan berkas duplikat persis DAN berkas dengan installment_rate mustahil (>50)" },
      ],
      expected: "3 temuan: APP-2201 dan APP-2207 duplikat (masing-masing 2x), APP-2211 cicilan 99% (mustahil)",
      sqlLab: {
        task: "Temukan (a) berkas duplikat persis: kelompokkan per semua kolom dan saring yang muncul lebih dari sekali; (b) berkas dengan installment_rate > 50 (mustahil dilunasi). Gabungkan keduanya dengan kolom temuan.",
        schema: "CREATE TABLE pengajuan (application_id TEXT, nama TEXT, tujuan TEXT, plafon INTEGER, installment_rate INTEGER, usia INTEGER, riwayat TEXT);",
        seedData: [
          "INSERT INTO pengajuan VALUES",
          "('APP-2201', 'Sari Wulandari', 'modal usaha', 12000000, 4, 38, 'existing credits paid duly'),",
          "('APP-2201', 'Sari Wulandari', 'modal usaha', 12000000, 4, 38, 'existing credits paid duly'),",
          "('APP-2207', 'Budi Santoso', 'kendaraan', 85000000, 3, 45, 'no credits / all paid duly'),",
          "('APP-2207', 'Budi Santoso', 'kendaraan', 85000000, 3, 45, 'no credits / all paid duly'),",
          "('APP-2211', 'Dewi Anggraini', 'renovasi rumah', 60000000, 99, 52, 'delay in paying off'),",
          "('APP-2214', 'Agus Pratama', 'pendidikan', 25000000, 2, 29, 'all credits at this bank paid duly'),",
          "('APP-2218', 'Rina Marlina', 'furniture', 18000000, 4, 33, 'existing credits paid duly'),",
          "('APP-2223', 'Joko Susilo', 'modal usaha', 45000000, 3, 47, 'critical account / other credits elsewhere'),",
          "('APP-2229', 'Fitri Handayani', 'kesehatan', 15000000, 2, 26, 'no credits / all paid duly'),",
          "('APP-2231', 'Hendra Gunawan', 'kendaraan', 72000000, 4, 55, 'existing credits paid duly'),",
          "('APP-2235', 'Nina Kurnia', 'pendidikan', 30000000, 3, 31, 'delay in paying off'),",
          "('APP-2240', 'Dedi Supriadi', 'renovasi rumah', 55000000, 2, 60, 'all credits at this bank paid duly');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT application_id, nama\nFROM pengajuan\n",
        solution: [
          "SELECT application_id, nama, COUNT(*) AS bukti, 'duplikat' AS temuan",
          "FROM pengajuan",
          "GROUP BY application_id, nama, tujuan, plafon, installment_rate, usia, riwayat",
          "HAVING COUNT(*) > 1",
          "UNION ALL",
          "SELECT application_id, nama, installment_rate AS bukti, 'cicilan_mustahil' AS temuan",
          "FROM pengajuan",
          "WHERE installment_rate > 50",
          "ORDER BY application_id;",
        ].join("\n"),
        expectedColumns: ["application_id", "nama", "bukti", "temuan"],
        expectedRows: [
          ["APP-2201", "Sari Wulandari", 2, "duplikat"],
          ["APP-2207", "Budi Santoso", 2, "duplikat"],
          ["APP-2211", "Dewi Anggraini", 99, "cicilan_mustahil"],
        ],
      },
    },
  ],
};

export default misiPinjamanPertama;

// ── lanjutan misiPinjamanPertama: append langkah 5–12 ke array steps ──
import type { V2Step } from "../lib/types";

const LANJUTAN_Pinjaman: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Komite memberimu tiga arah — semuanya berbiaya",
    prose: [
      "Kepala Komite menelepon sebelum rapat direksi: “Kami butuh sikap, bukan spektrum. Tiga arah kebijakan di meja — pilih satu untuk direkomendasikan. Tidak ada yang gratis.” Kamu sudah punya baseline: bad rate 30% keseluruhan, 62,5% di segmen thin-file (n=40), median plafon kelas macet 2.574,5 DM. Keputusanmu mengubah bukti apa yang kamu lihat di langkah berikut — seperti rekomendasi yang sudah dikirim ke klien, final.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Arah kebijakan cut-off mana yang kamu rekomendasikan ke Komite Kredit? (Keputusan final — seperti rekomendasi yang sudah dikirim ke klien.)",
      options: [
        {
          id: "opt-konservatif",
          label: "Cut-off konservatif tinggi — tolak lebih banyak, NPL minim",
          rationale:
            "Naikkan ambang persetujuan. Matriks biaya mendukung: menyetujui debitur macet biayanya 5x lipat dibanding menolak debitur yang sebenarnya lunas. NPL turun, direksi tenang.",
          nextStepId: "temuan-konservatif",
          consequenceNote:
            "NPL memang turun — tetapi bank ikut menolak sebagian besar debitur thin-file yang sebenarnya akan lunas. Penyaluran kredit UMKM menyusut semester berikutnya, dan tim bisnis protes: cut-off-mu membunuh pertumbuhan. Biaya bisnis yang hilang tidak ada di matriks biaya.",
        },
        {
          id: "opt-longgar",
          label: "Cut-off longgar + risk-based pricing — setujui, tapi hargai risikonya",
          rationale:
            "Tetap setujui segmen berisiko, tetapi bebankan bunga sesuai PD segmennya. Bisnis jalan, risiko “dihargai”. Secara teori semua orang menang.",
          nextStepId: "temuan-longgar",
          consequenceNote:
            "Penyaluran naik — tetapi harga risk-based dihitung dari PD RATA-RATA 30%, bukan PD segmen 62,5%. Segmen thin-file tetap disubsidi silang oleh debitur bagus. Setahun kemudian NPL segmen itu meledak dan harga yang dipungut tidak menutup kerugian.",
        },
        {
          id: "opt-eskalasi",
          label: "Segmen abu-abu → manual review — manusia yang putuskan",
          rationale:
            "Pengajuan di zona abu-abu (termasuk seluruh thin-file) tidak diputus mesin, melainkan di-review analis satu per satu. Tidak ada yang lolos otomatis tanpa mata manusia.",
          nextStepId: "temuan-eskalasi",
          consequenceNote:
            "Kualitas putusan per berkas membaik — tetapi 1.000 berkas × 45 menit review = antrean berminggu-minggu. SLA pengajuan jebol, debitur bagus kabur ke bank sebelah, dan biaya per keputusan meledak. Manual review tidak berskala.",
        },
      ],
    },
  },
  {
    id: "temuan-konservatif",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Satu semester setelah cut-off konservatif",
    prose: [
      "Angka NPL kuartal berikutnya turun sesuai janjimu — direksi puas, presentasimu dikutip di rapat. Tetapi tiga bulan kemudian tim bisnis datang dengan datanya sendiri: penyaluran kredit UMKM menyusut 18% semester itu. Cut-off tinggimu menolak hampir seluruh segmen thin-file — termasuk mayoritas yang sebenarnya akan lunas. Matriks biaya 5:1 yang kamu jadikan tameng memang benar untuk SATU keputusan, tetapi ia tidak pernah menghitung pendapatan bunga yang hilang dari ratusan penolakan.",
      "Yang lebih menyakitkan: bank sebelah justru menyerap debitur-debitur yang kamu tolak — dengan harga yang sedikit lebih tinggi — dan NPL mereka tetap terkendali. Ternyata “konservatif” bukan sinonim “benar”; itu hanya satu titik di kurva trade-off, dan kamu memilihnya tanpa menghitung sisi bisnisnya.",
      "Sementara itu, sabotase di file audit tetap belum tersentuh. Duplikat APP-0026 dan kawan-kawannya masih menggandakan bobot debitur dalam kalibrasi — artinya cut-off “konservatif” yang kamu banggakan pun dihitung di atas data yang kotor.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: cut-off adalah keputusan bisnis, bukan statistik",
      body: "Matriks biaya memberimu asimetri 5:1 — tetapi ia diam soal opportunity cost. Analis yang dewasa menyajikan KEDUA sisi: NPL yang ditekan DAN bisnis yang dikorbankan, lalu membiarkan komite memilih dengan mata terbuka. Di memo-mu nanti, tulis eksplisit: berapa persen debitur bagus yang ikut terbuang di tiap level cut-off.",
    },
  },
  {
    id: "temuan-longgar",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Satu tahun setelah cut-off longgar + risk-based pricing",
    prose: [
      "Penyaluran naik, tim bisnis merayakannya. Harga “berbasis risiko” terlihat canggih di slide. Tetapi setahun kemudian datanya bicara: NPL segmen thin-file menyentuh 58% — dan bunga risk-based yang dipungut tidak menutup kerugian. Akar masalahnya memalukan: harga dihitung dari PD rata-rata portofolio (30%), bukan PD segmen (62,5%). Debitur bagus diam-diam mensubsidi debitur thin-file — subsidi silang yang tidak pernah disetujui siapa pun.",
      "Lebih buruk lagi: debitur bagus yang sadar mereka “kemahalan” mulai pindah ke bank sebelah. Portofolio yang tersisa makin terkonsentrasi di segmen berisiko — spiral seleksi merugikan (adverse selection) yang klasik. Risk-based pricing yang tidak berbasis segmen BUKAN risk-based pricing; itu tebakan mahal.",
      "Dan seperti biasa, sabotase file audit belum tersentuh: installment_rate 99% milik APP-0282 ikut masuk perhitungan rasio cicilan — menggeser statistik segmennya tanpa ada yang sadar.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: satu harga untuk semua risiko = subsidi silang",
      body: "Risk-based pricing hanya “berbasis risiko” bila harganya mengikuti PD SEGMEN, bukan PD rata-rata. Pelajaran lab-mu (bad rate per credit_history) seharusnya menjadi tabel harga, bukan sekadar temuan menarik. Di memo-mu, tunjukkan: harga wajar per segmen vs harga seragam — dan siapa mensubsidi siapa.",
    },
  },
  {
    id: "temuan-eskalasi",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Dua bulan setelah semua zona abu-abu di-review manual",
    prose: [
      "Kualitas putusan per berkas memang membaik — analis senior menangkap beberapa aplikasi dengan dokumen janggal yang mesin akan loloskan. Tetapi matematikanya kejam: 1.000 berkas × 45 menit review = 750 jam kerja. Tim review yang hanya berempat tenggelam dalam antrean berminggu-minggu. SLA 3 hari jebol menjadi 21 hari.",
      "Debitur bagus — yang punya banyak pilihan bank — tidak menunggu. Mereka pindah ke bank sebelah yang putusannya keluar dalam 2 hari. Yang tersisa antre justru debitur yang ditolak di tempat lain. Portofolio pelan-pelan terisi oleh sisa pasar. Manual review yang dimaksudkan sebagai tameng kualitas berubah menjadi filter yang meloloskan justru risiko terburuk.",
      "Pelajaran pahitnya: eskalasi manual bukan strategi — itu penundaan strategi. Tanpa aturan triase otomatis (siapa yang layak review manusia, siapa yang bisa diputus mesin), kamu hanya memindahkan kemacetan dari scorecard ke meja analis.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: yang tidak berskala bukan solusi",
      body: "Manual review adalah sumber daya langka — perlakukan seperti itu. Desain yang benar: mesin memutus 80% kasus jelas (terima/tolak otomatis), manusia hanya menangani 20% zona abu-abu dengan nilai tertinggi. Di memo-mu, hitung kapasitas: berapa berkas per analis per hari, dan berapa persen pengajuan yang realistis di-review.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 20 berkas: temukan 4 sabotase yang disuntikkan",
    prose: [
      "Sekarang misi auditnya. Di bawah ini 20 berkas pengajuan terbaru — dossier yang diklaim “sudah lolos verifikasi awal komite” (cuplikan kredit_audit.csv). Seseorang menyuntikkan 4 jenis sabotase ke dalamnya tanpa pengumuman. Tandai berkas yang janggal, lalu buka debrief.",
      "Senjatamu: baseline Lab 1 (bad rate 30%; rentang wajar installment_rate 1–4% dan usia 19–75 tahun), teknik duplikat dari Lab 2 (GROUP BY + HAVING), dan kamus kode purpose german.doc (hanya A40–A49 dan A410 yang valid). Klaim “terverifikasi” di dossier boleh jadi bohong — seperti di dunia nyata.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-pinjaman-pertama-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim berisi 20 berkas pengajuan terbaru yang sudah lolos verifikasi awal komite (cuplikan kredit_audit.csv). Plafon dalam Deutsche Mark (DM), mata uang data sumber.",
      columns: ["Debitur", "Tujuan", "Plafon", "Riwayat"],
      rows: [
        { rowId: 1, cells: { "Debitur": "Hans Müller", "Tujuan": "car (used)", "Plafon": "DM 8.500", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0341" }, { label: "Cicilan (% pendapatan)", value: "3" }, { label: "Usia", value: "41" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 2, cells: { "Debitur": "Anna Schmidt", "Tujuan": "furniture / equipment", "Plafon": "DM 4.200", "Riwayat": "all credits at this bank paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0355" }, { label: "Cicilan (% pendapatan)", value: "2" }, { label: "Usia", value: "33" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 3, cells: { "Debitur": "Klaus Weber", "Tujuan": "radio / television", "Plafon": "DM 2.800", "Riwayat": "delay in paying off" }, claims: [{ label: "ID aplikasi", value: "APP-0362" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "47" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 4, cells: { "Debitur": "Petra Fischer", "Tujuan": "education", "Plafon": "DM 6.100", "Riwayat": "no credits / all paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0377" }, { label: "Cicilan (% pendapatan)", value: "2" }, { label: "Usia", value: "24" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        // ── I1a: duplikat terselubung (ID aplikasi identik) ──
        { rowId: 5, cells: { "Debitur": "Thomas Wagner", "Tujuan": "car (new)", "Plafon": "DM 21.000", "Riwayat": "critical account / other credits elsewhere" }, claims: [{ label: "ID aplikasi", value: "APP-0026" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "52" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 6, cells: { "Debitur": "Thomas Wagner", "Tujuan": "car (new)", "Plafon": "DM 21.000", "Riwayat": "critical account / other credits elsewhere" }, claims: [{ label: "ID aplikasi", value: "APP-0026" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "52" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 7, cells: { "Debitur": "Sabine Becker", "Tujuan": "repairs", "Plafon": "DM 3.900", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0390" }, { label: "Cicilan (% pendapatan)", value: "3" }, { label: "Usia", value: "39" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 8, cells: { "Debitur": "Jürgen Hoffmann", "Tujuan": "business", "Plafon": "DM 15.400", "Riwayat": "all credits at this bank paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0404" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "58" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        // ── I2: installment_rate mustahil ──
        { rowId: 9, cells: { "Debitur": "Monika Schulz", "Tujuan": "domestic appliances", "Plafon": "DM 5.600", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0282" }, { label: "Cicilan (% pendapatan)", value: "99" }, { label: "Usia", value: "36" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 10, cells: { "Debitur": "Andreas Koch", "Tujuan": "car (used)", "Plafon": "DM 9.800", "Riwayat": "delay in paying off" }, claims: [{ label: "ID aplikasi", value: "APP-0418" }, { label: "Cicilan (% pendapatan)", value: "3" }, { label: "Usia", value: "44" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 11, cells: { "Debitur": "Claudia Richter", "Tujuan": "retraining", "Plafon": "DM 7.300", "Riwayat": "no credits / all paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0425" }, { label: "Cicilan (% pendapatan)", value: "2" }, { label: "Usia", value: "27" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 12, cells: { "Debitur": "Michael Wolf", "Tujuan": "other", "Plafon": "DM 11.200", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0433" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "51" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        // ── I1b: duplikat terselubung (ID aplikasi identik) ──
        { rowId: 13, cells: { "Debitur": "Renate Schröder", "Tujuan": "furniture / equipment", "Plafon": "DM 12.000", "Riwayat": "delay in paying off" }, claims: [{ label: "ID aplikasi", value: "APP-0115" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "36" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 14, cells: { "Debitur": "Renate Schröder", "Tujuan": "furniture / equipment", "Plafon": "DM 12.000", "Riwayat": "delay in paying off" }, claims: [{ label: "ID aplikasi", value: "APP-0115" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "36" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 15, cells: { "Debitur": "Elke Braun", "Tujuan": "radio / television", "Plafon": "DM 3.200", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0447" }, { label: "Cicilan (% pendapatan)", value: "1" }, { label: "Usia", value: "29" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        // ── I3: kode purpose tak valid ──
        { rowId: 16, cells: { "Debitur": "Dieter Krüger", "Tujuan": "A412", "Plafon": "DM 6.700", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0229" }, { label: "Cicilan (% pendapatan)", value: "3" }, { label: "Usia", value: "44" }, { label: "Kode tujuan valid", value: "Ya" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 17, cells: { "Debitur": "Ursula Hartmann", "Tujuan": "car (new)", "Plafon": "DM 18.900", "Riwayat": "critical account / other credits elsewhere" }, claims: [{ label: "ID aplikasi", value: "APP-0452" }, { label: "Cicilan (% pendapatan)", value: "4" }, { label: "Usia", value: "63" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 18, cells: { "Debitur": "Frank Lehmann", "Tujuan": "business", "Plafon": "DM 22.500", "Riwayat": "all credits at this bank paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0460" }, { label: "Cicilan (% pendapatan)", value: "3" }, { label: "Usia", value: "49" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        // ── I4: usia mustahil ──
        { rowId: 19, cells: { "Debitur": "Ingrid Schmid", "Tujuan": "education", "Plafon": "DM 9.100", "Riwayat": "no credits / all paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0143" }, { label: "Cicilan (% pendapatan)", value: "2" }, { label: "Usia", value: "120" }, { label: "Usia terverifikasi", value: "Ya" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
        { rowId: 20, cells: { "Debitur": "Wolfgang Meyer", "Tujuan": "repairs", "Plafon": "DM 4.800", "Riwayat": "existing credits paid duly" }, claims: [{ label: "ID aplikasi", value: "APP-0471" }, { label: "Cicilan (% pendapatan)", value: "2" }, { label: "Usia", value: "55" }, { label: "Status verifikasi", value: "Terverifikasi Komite" }] },
      ],
      injections: [
        { key: "duplikat", rowIds: [5, 6, 13, 14], title: "Berkas duplikat terselubung", clue: "Dua pasang baris identik persis — termasuk ID aplikasinya (APP-0026 dan APP-0115). Di file nyata, ini hasil impor batch ganda tanpa constraint unik.", danger: "Satu debitur terhitung dua kali: PD segmennya bergeser dan cut-off dikalibrasi di atas bobot palsu. Di pembukuan nyata, pola yang sama menggandakan NPL yang dilaporkan." },
        { key: "cicilan-mustahil", rowIds: [9], title: "Installment rate mustahil", clue: "Cicilan 99% dari disposable income — padahal rentang wajar di data ini 1–4%. Di atas 50% saja praktis tidak bisa dilunasi.", danger: "Rasio mustahil yang lolos ikut menggeser statistik segmen cicilan; scorecard belajar dari angka yang tidak mungkin terjadi." },
        { key: "kode-tak-valid", rowIds: [16], title: "Kode purpose tak ada di kamus", clue: "Tujuan tertulis mentah sebagai A412 — padahal kamus german.doc hanya mengenal A40–A49 dan A410. Klaim dossier Kode tujuan valid: Ya adalah bohong.", danger: "Kode tak dikenal lolos validasi = fitur purpose tercemar kategori sampah; model belajar pola dari kode yang tidak berarti apa-apa." },
        { key: "usia-mustahil", rowIds: [19], title: "Usia mustahil", clue: "120 tahun — rentang data asli 19–75. Klaim Usia terverifikasi: Ya di dossier adalah bohong.", danger: "Satu outlier ekstrem menggeser rata-rata dan sebaran segmen usia; validasi rentang sederhana di pintu masuk menangkapnya dalam sedetik." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo rekomendasi untuk Komite Kredit",
    prose: [
      "Semua bukti di tangan. Sekarang tulis seperti profesional: memo rekomendasi satu halaman untuk Komite Kredit. Ini artefak portofoliomu — tulis seolah akan dibaca direksi sungguhan, yang akan menolak orang sungguhan berdasarkan angkamu.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): apa temuan terpentingmu — bad rate, segmen paling berisiko, dan satu kalimat sikap cut-off?",
        "Rekomendasi cut-off + bukti: arah kebijakan mana yang kamu pilih, berapa NPL yang ditekan, berapa persen debitur bagus yang ikut terbuang, dan bagaimana harga per segmen bila memakai risk-based pricing.",
        "Temuan kualitas data: sabotase apa yang kamu temukan di file audit, dengan bukti per berkas (ID aplikasi + jenis anomali).",
        "Keputusan yang TIDAK kamu ambil: dua arah kebijakan yang kamu tolak — dan apa risiko dari masing-masing bila ternyata komite memilihnya.",
        "Batas data (kejujuran): apa yang TIDAK bisa disimpulkan — data Jerman era DM vs Indonesia 2026, application_id sintetis, n=40 di segmen thin-file, anomali statistik bukan bukti kausal, dan cut-off butuh revalidasi berkala.",
      ],
      rubric: [
        { criterion: "Deteksi anomali", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa bukti per berkas", "Semua jenis sabotase disebut dengan ID aplikasi + bukti"] },
        { criterion: "Kebenaran analisis", weight: 25, levels: ["Baseline PD salah/tidak ada", "Baseline ada tetapi tidak dipakai menilai cut-off", "Bad rate per segmen dipakai menilai trade-off cut-off"] },
        { criterion: "Kualitas keputusan", weight: 20, levels: ["Pilihan tanpa alasan", "Alasan ada tetapi biaya peluang tidak diakui", "Alasan + biaya peluang + rencana susulan eksplisit"] },
        { criterion: "Kejujuran batas data", weight: 30, levels: ["Mengklaim lebih dari yang didukung data", "Menyebut sebagian batas", "Batas (konteks DM, sampel kecil, kausalitas, revalidasi) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan ke dossier — semuanya berasal dari pola nyata di rantai data perbankan:",
      "1) **Duplikat terselubung** (berkas 5–6 dan 13–14): dua pasang baris identik termasuk ID aplikasi (APP-0026, APP-0115). Di dunia nyata: impor batch ganda tanpa constraint unik di database. Obatnya murah — UNIQUE(application_id) — tetapi mahalnya adalah tidak ada yang memeriksa. Di file audit misi ini ada TIGA pasang; dossier hanya menampilkan dua.",
      "2) **Installment rate mustahil** (berkas 9): cicilan 99% dari disposable income, padahal rentang wajar 1–4%. Validasi ambang sederhana (mis. tolak > 50%) di pintu masuk menangkapnya dalam sedetik. Tanpa validasi, angka mustahil ikut menggeser statistik segmen cicilan — dan cut-off yang dikalibrasi di atasnya.",
      "3) **Kode purpose tak valid** (berkas 16): tujuan tertulis mentah A412 — kode yang tidak ada di kamus german.doc. Klaim dossier Kode tujuan valid: Ya adalah kebohongan yang hanya bisa dibantah kalau kamu memeriksa kamusnya. Inilah kenapa data dictionary bukan dokumentasi pajangan: ia adalah alat validasi.",
      "4) **Usia mustahil** (berkas 19): 120 tahun vs rentang data 19–75, dengan klaim Usia terverifikasi: Ya. Satu outlier ekstrem cukup untuk menggeser rata-rata segmen usia — dan “terverifikasi” ternyata hanya stempel.",
      "Skor deteksimu (x/4) bukan nilai ujian — itu cerminan sistem verifikasi yang kamu bawa. Di pekerjaan nyata, tiap sabotase yang lolos = cut-off yang dikalibrasi di atas angka palsu = orang yang salah ditolak atau risiko yang salah disetujui. Dan ingat keputusan bercabangmu tadi: tidak ada opsi yang gratis. Analis yang dewasa menuliskan apa yang TIDAK dipilih dan kenapa — karena komite berhak tahu harga dari pilihannya.",
      "Bahaya nyata terakhir: cut-off yang “optimal” di data historis Jerman era DM belum tentu optimal untuk Indonesia 2026. Perilaku debitur berubah, ekonomi berubah, produk berubah — itulah concept drift. Scorecard yang tidak direvalidasi berkala bukan alat ukur risiko; ia fosil. Rekomendasi cut-off tanpa jadwal revalidasi adalah rekomendasi yang belum selesai.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: cut-off yang optimal di data historis = keputusan benar selamanya",
      type: "risk",
      body: "Scorecard dikalibrasi pada MASA LALU dan dipakai untuk MASA DEPAN — dua populasi yang tidak identik. Tanpa revalidasi berkala (backtesting PD aktual vs prediksi, monitoring populasi), cut-off-mu melapuk diam-diam sementara semua orang mengira risiko terkendali. Di perbankan nyata, regulator mewajibkan validasi model berkala justru karena alasan ini.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Baseline dulu, rekomendasi kemudian: bad rate 30% keseluruhan adalah jangkar PD empiris; segmen thin-file (no credits / all paid duly) mencatat 62,5% — TERTINGGI — tetapi dari n=40, jadi laporkan beserta ketidakpastiannya.",
      "Empat pola sabotase data kredit: duplikat ber-ID identik (tangkap dengan GROUP BY + HAVING), installment_rate mustahil (validasi ambang di pintu masuk), kode tak ada di kamus (validasi lawan data dictionary), usia mustahil (validasi rentang).",
      "Cut-off adalah keputusan bisnis berbiaya asimetris (matriks 5:1), bukan sekadar statistik: tiap arah — konservatif, longgar + pricing, eskalasi manual — punya harga yang wajib dihitung dan dinyatakan.",
      "Risk-based pricing hanya valid bila mengikuti PD SEGMEN; harga dari PD rata-rata adalah subsidi silang. Manual review tidak berskala — desain triase: mesin untuk kasus jelas, manusia untuk zona abu-abu.",
      "Data: Statlog German Credit (Prof. Dr. Hans Hofmann; UCI CC BY 4.0 / OpenML credit-g Public), 1.000 pengajuan Jerman era Deutsche Mark, ter-decode dari german.doc. Batas: konteks ekonomi berbeda dengan Indonesia 2026, application_id sintetis, cut-off wajib direvalidasi berkala (concept drift).",
    ],
  },
];

(misiPinjamanPertama.steps as V2Step[]).push(...LANJUTAN_Pinjaman);

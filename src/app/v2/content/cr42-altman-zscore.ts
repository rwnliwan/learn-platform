import type { V2Lesson } from "../lib/types";

export const cr42: V2Lesson = {
  slug: "cr42-altman-zscore",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR42 — Altman Z-Score: dari Skor Kebangkrutan ke PD dan Internal Rating",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu angka dari lima rasio — dan komite kredit akhirnya punya bahasa yang sama",
      prose: [
        "Tahun 1968, Edward Altman mengajukan pertanyaan sederhana: bisakah lima rasio keuangan digabung menjadi satu skor yang memprediksi kebangkrutan dua tahun ke depan? Jawabannya, dari 66 perusahaan manufaktur, adalah ya — dengan akurasi sekitar 95 persen untuk satu tahun ke depan dan 72 persen untuk dua tahun. Skor itu bernama Z-Score, dan hingga hari ini ia masih dipakai di meja kredit di seluruh dunia.",
        "Di track ini, Z-Score dipakai untuk satu tujuan: mengubah skor kebangkrutan menjadi PD dan internal rating — bahasa yang dipakai untuk pricing, pencadangan, dan modal. Sudut ini berbeda dari pemakaian Z-Score sebagai alat forensik untuk mendeteksi manipulasi laporan keuangan, yang dibahas di tempat lain: di sini pertanyaannya bukan apakah laporannya jujur, melainkan berapa peluang debitur ini gagal bayar, dan rating internal apa yang pantas ia sandang.",
        "Setelah lesson ini kamu bisa: (1) menghitung Z-Score original, Z-prime untuk perusahaan privat, dan Z-double-prime untuk non-manufaktur; (2) membaca tiga zona — aman, abu-abu, distress — beserta artinya; (3) memetakan skor ke PD dan internal rating lewat kalibrasi; (4) menjelaskan keterbatasan Z-Score dan kapan ia harus divalidasi ulang.",
      ],
      tasks: [],
      note: {
        title: "Satu skor, dua profesi",
        body: "Auditor forensik memakai Z-Score untuk bertanya apakah laporan keuangan menyembunyikan masalah. Analis kredit memakai Z-Score untuk bertanya berapa PD debitur dan berapa spread yang pantas. Rumusnya sama, pertanyaannya berbeda — dan jawaban yang satu tidak menggantikan jawaban yang lain.",
      },
      reference: "Lima rasio, satu skor, satu bahasa: dari Z ke PD ke rating internal.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengambil laporan keuangan debitur dan pulang dengan tiga hal: skor Z, zona risikonya, dan PD terkalibrasi yang bisa masuk ke model pricing.",
        "(1) Menghitung Z-Score original dari lima rasio beserta bobotnya;",
        "(2) Memilih varian yang benar: Z original untuk manufaktur terbuka, Z-prime untuk perusahaan privat, Z-double-prime untuk non-manufaktur dan emerging market;",
        "(3) Memetakan skor ke zona dan ke PD lewat tabel kalibrasi internal, lalu ke grade internal rating;",
        "(4) Menjelaskan keterbatasan: sensitivitas terhadap manipulasi akuntansi, perbedaan sektor, dan kebutuhan kalibrasi ulang berkala.",
      ],
      tasks: [],
    },
    {
      id: "rumus-z",
      eyebrow: "Langkah 3 · Teori",
      title: "Rumus Z dan tiga zona",
      prose: [
        "Z-Score original (1968) untuk perusahaan manufaktur terbuka: Z = 1,2 × modal kerja dibagi total aset, ditambah 1,4 × laba ditahan dibagi total aset, ditambah 3,3 × EBIT dibagi total aset, ditambah 0,6 × nilai pasar ekuitas dibagi total liabilitas, ditambah 1,0 × penjualan dibagi total aset. Bobot terbesar ada pada EBIT dibagi total aset (3,3) — profitabilitas adalah prediktor kebangkrutan yang paling kuat — dan pada penjualan dibagi total aset (1,0).",
        "Tiga zona membagi skor menjadi keputusan. Z di atas 2,99: zona aman — perusahaan sehat, peluang kebangkrutan kecil. Z 1,81 sampai 2,99: zona abu-abu — tidak bisa diputuskan dari skor saja, perlu analisis lanjutan. Z di bawah 1,81: zona distress — peluang kebangkrutan tinggi, kreditur harus bertindak. Zona abu-abu adalah tempat analis bekerja paling keras: di sanalah tren, arus kas, dan kualitas manajemen menentukan vonis.",
        "Dua varian menutup celah varian original. Z-prime (1983) untuk perusahaan privat mengganti nilai pasar ekuitas dengan nilai buku ekuitas dan mengubah bobot: 0,717, 0,847, 3,107, 0,420, 0,998 — dengan zona aman di atas 2,90, abu-abu 1,23 sampai 2,90, distress di bawah 1,23. Z-double-prime untuk non-manufaktur dan emerging market membuang rasio penjualan dibagi total aset (yang menyesatkan di luar manufaktur) dan memakai empat rasio: 6,56, 3,26, 6,72, 1,05 — zona aman di atas 2,60, distress di bawah 1,10.",
      ],
      tasks: [],
      formula: String.raw`Z = 1.2\frac{WC}{TA} + 1.4\frac{RE}{TA} + 3.3\frac{EBIT}{TA} + 0.6\frac{MVE}{TL} + 1.0\frac{S}{TA}`,
      formulaNote: "WC = modal kerja; RE = laba ditahan; TA = total aset; MVE = nilai pasar ekuitas; TL = total liabilitas; S = penjualan. Zona: di atas 2,99 aman; 1,81 sampai 2,99 abu-abu; di bawah 1,81 distress.",
      reference: "Bobot terbesar: EBIT dibagi aset (3,3). Profitabilitas adalah prediktor kebangkrutan yang paling kuat.",
    },
    {
      id: "z-ke-pd",
      eyebrow: "Langkah 4 · Teori",
      title: "Dari skor ke PD dan internal rating",
      prose: [
        "Skor saja belum bisa dipakai untuk pricing — bank butuh PD. Caranya adalah kalibrasi: ambil portofolio historis bank, hitung Z tiap debitur di awal periode, lalu amati berapa persen dari tiap kelompok skor yang benar-benar default dalam setahun. Hasilnya adalah tabel pemetaan — dan tabel ini milik bank itu sendiri, karena kalibrasi tergantung portofolio dan definisi default yang dipakai.",
        "Tabel kalibrasi ilustratif lesson ini — yang harus diganti dengan kalibrasi internal bank sebelum dipakai nyata: Z di atas 2,99 memetakan ke PD 0,4 persen (grade internal 1–3, setara investment grade); Z 1,81 sampai 2,99 memetakan ke PD 4,5 persen (grade 4–6, watchlist); Z di bawah 1,81 memetakan ke PD 22 persen (grade 7–9, substandard ke bawah). Angka-angka ini ilustratif: yang penting adalah metodenya — skor dipetakan lewat frekuensi default historis, bukan lewat rumus universal.",
        "Pemetaan ini kemudian mengalir ke seluruh mesin kredit: PD masuk ke expected loss (PD dikali LGD dikali EAD), ke pricing (spread harus menutup expected loss ditambah biaya modal), ke pencadangan IFRS 9 (staging memakai perubahan PD), dan ke modal (bobot risiko Basel memakai PD). Satu skor yang dikalibrasi dengan benar memberi makan empat keputusan sekaligus.",
        "Keterbatasannya harus dihafal. Satu, Z memakai angka akuntansi — bila laporan dimanipulasi, skornya ikut termanipulasi. Dua, bobot Altman dikalibrasi dari manufaktur Amerika tahun 1960-an — sektor dan negara lain butuh kalibrasi ulang. Tiga, Z adalah potret titik waktu: perusahaan yang membaik dari Z 1,4 ke 2,1 dalam tiga tahun bercerita sangat berbeda dari perusahaan yang jatuh dari 2,8 ke 2,1. Tren adalah separuh dari vonis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai angka PD dari tabel ilustratif — atau dari buku teks mana pun — untuk pricing nyata. PD hasil pemetaan hanya benar untuk portofolio tempat ia dikalibrasi. Bank yang memakai tabel orang lain untuk portofolionya sendiri sedang memakai baju orang lain: ukurannya belum tentu pas, dan yang longgar akan ketahuan saat krisis.",
      },
      reference: "Z ke PD lewat frekuensi default historis — kalibrasi milik bank sendiri, bukan angka universal.",
    },
    {
      id: "lab-altman",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung Z dan memetakan ke PD",
      prose: [
        "Hitung Z-Score original untuk dua perusahaan, tentukan zonanya, lalu petakan ke PD memakai tabel kalibrasi ilustratif lesson ini: Z di atas 2,99 → PD 0,4 persen; Z 1,81 sampai 2,99 → PD 4,5 persen; Z di bawah 1,81 → PD 22 persen.",
        "Perusahaan Sehat: modal kerja dibagi aset 0,12; laba ditahan dibagi aset 0,18; EBIT dibagi aset 0,09; nilai pasar ekuitas dibagi liabilitas 1,4; penjualan dibagi aset 1,1. Hitung: 1,2 × 0,12 = 0,144; 1,4 × 0,18 = 0,252; 3,3 × 0,09 = 0,297; 0,6 × 1,4 = 0,84; 1,0 × 1,1 = 1,1. Total Z = 2,633 — zona abu-abu, PD 4,5 persen.",
        "Perusahaan Rapuh: modal kerja dibagi aset -0,05; laba ditahan dibagi aset -0,10; EBIT dibagi aset -0,04; nilai pasar ekuitas dibagi liabilitas 0,3; penjualan dibagi aset 0,8. Hitung: 1,2 × (-0,05) = -0,06; 1,4 × (-0,10) = -0,14; 3,3 × (-0,04) = -0,132; 0,6 × 0,3 = 0,18; 1,0 × 0,8 = 0,8. Total Z = 0,648 — zona distress, PD 22 persen. Perhatikan: tiga rasio pertama negatif — perusahaan ini membakar modal kerja, laba ditahan, dan profitabilitas sekaligus.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `z_sehat` dan `z_rapuh` dari lima rasio masing-masing" },
        { id: "t2", text: "Petakan ke `pd_sehat` dan `pd_rapuh` (dalam persen) lewat tabel kalibrasi, lalu cetak semuanya" },
      ],
      expected: "Z sehat=2.633 (abu-abu) PD=4.5 persen | Z rapuh=0.648 (distress) PD=22.0 persen",
      hints: [
        "Z = 1,2×WC + 1,4×RE + 3,3×EBIT + 0,6×MVE + 1,0×S — semua rasio sudah dalam desimal.",
        "Zona: di atas 2,99 aman; 1,81 sampai 2,99 abu-abu; di bawah 1,81 distress.",
        "Pemetaan PD: aman → 0,4; abu-abu → 4,5; distress → 22,0 (persen, ilustratif).",
        "Pakai if dan elif untuk pemetaan — tiga cabang, tiga PD.",
      ],
      code: {
        starter: `# Altman Z-Score original + pemetaan PD (tabel kalibrasi ilustratif lesson)\n# Rasio dalam desimal: WC/TA, RE/TA, EBIT/TA, MVE/TL, S/TA\nsehat = [0.12, 0.18, 0.09, 1.4, 1.1]\nrapuh = [-0.05, -0.10, -0.04, 0.3, 0.8]\nbobot = [1.2, 1.4, 3.3, 0.6, 1.0]\n\ndef zona(z):\n    if z > 2.99:\n        return "aman"\n    elif z >= 1.81:\n        return "abu-abu"\n    return "distress"\n\ndef pd_map(z):\n    if z > 2.99:\n        return 0.4\n    elif z >= 1.81:\n        return 4.5\n    return 22.0\n\n# TULIS KODEMU\nz_sehat = \nz_rapuh = \npd_sehat = \npd_rapuh = \n\nprint(f"Z sehat={z_sehat:.3f} ({zona(z_sehat)}) PD={pd_sehat:.1f} persen | Z rapuh={z_rapuh:.3f} ({zona(z_rapuh)}) PD={pd_rapuh:.1f} persen")`,
        lockLines: 17,
        solution: `# Altman Z-Score original + pemetaan PD (tabel kalibrasi ilustratif lesson)\n# Rasio dalam desimal: WC/TA, RE/TA, EBIT/TA, MVE/TL, S/TA\nsehat = [0.12, 0.18, 0.09, 1.4, 1.1]\nrapuh = [-0.05, -0.10, -0.04, 0.3, 0.8]\nbobot = [1.2, 1.4, 3.3, 0.6, 1.0]\n\ndef zona(z):\n    if z > 2.99:\n        return "aman"\n    elif z >= 1.81:\n        return "abu-abu"\n    return "distress"\n\ndef pd_map(z):\n    if z > 2.99:\n        return 0.4\n    elif z >= 1.81:\n        return 4.5\n    return 22.0\n\n# TULIS KODEMU\nz_sehat = sum(b * r for b, r in zip(bobot, sehat))\nz_rapuh = sum(b * r for b, r in zip(bobot, rapuh))\npd_sehat = pd_map(z_sehat)\npd_rapuh = pd_map(z_rapuh)\n\nprint(f"Z sehat={z_sehat:.3f} ({zona(z_sehat)}) PD={pd_sehat:.1f} persen | Z rapuh={z_rapuh:.3f} ({zona(z_rapuh)}) PD={pd_rapuh:.1f} persen")`,
        checks: [
          { kind: "equal", task: "t1", name: "z_sehat", value: 2.633, tol: 0.001, label: "`z_sehat` = 2,633", msg: "0,144 + 0,252 + 0,297 + 0,84 + 1,1 = 2,633 — zona abu-abu." },
          { kind: "equal", task: "t1", name: "z_rapuh", value: 0.648, tol: 0.001, label: "`z_rapuh` = 0,648", msg: "-0,06 - 0,14 - 0,132 + 0,18 + 0,8 = 0,648 — zona distress." },
          { kind: "equal", task: "t2", name: "pd_sehat", value: 4.5, tol: 0.01, label: "`pd_sehat` = 4,5 persen", msg: "Z 2,633 masuk zona abu-abu → PD 4,5 persen." },
          { kind: "equal", task: "t2", name: "pd_rapuh", value: 22.0, tol: 0.01, label: "`pd_rapuh` = 22,0 persen", msg: "Z 0,648 masuk zona distress → PD 22 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "Z sehat=2\\.633 \\(abu-abu\\) PD=4\\.5 persen", label: "`print` menampilkan Z dan PD perusahaan Sehat", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Z Sehat 2,633 (abu-abu, PD 4,5 persen). Z Rapuh 0,648 (distress, PD 22 persen).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: Z 2,10 yang sedang membaik",
      prose: [
        "Debitur D mengajukan perpanjangan kredit. Z-Score-nya 2,10 — zona abu-abu, PD terpetakan 4,5 persen. Aturan mekanis berkata: watchlist, naikkan spread, perketat covenant. Tetapi tren tiga tahunnya bercerita lain: Z 1,4, lalu 1,8, lalu 2,1. EBIT dibagi aset naik dari 0,02 menjadi 0,07. Modal kerja yang dulu negatif kini positif. Manajemen baru menjual aset non-inti dan melunasi utang jangka pendek.",
        "Pertanyaan: apakah komite menurunkan grade-nya? Jawabannya: tidak — tetapi juga tidak menaikkannya. Keputusan yang benar adalah mempertahankan grade watchlist dengan monitoring kuartalan dan satu syarat: bila Z menembus 2,99 dan bertahan dua kuartal, grade naik dan spread turun. Skor adalah titik awal, bukan vonis: tren tiga tahun adalah separuh dari vonis, dan arahnya di sini membaik.",
        "Bandingkan dengan debitur yang Z-nya juga 2,10 tetapi trennya menurun dari 2,8: skor yang sama, vonis yang berlawanan. Yang pertama dipertahankan dengan syarat; yang kedua diturunkan dan fasilitasnya ditinjau ulang. Inilah kenapa model internal rating yang baik selalu menyimpan tren — bukan hanya skor terakhir.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Z 2,10 dengan tren naik (1,4 → 1,8 → 2,1) dipertahankan di watchlist dengan syarat kenaikan grade bila menembus 2,99 selama dua kuartal. Z yang sama dengan tren turun diturunkan. Skor tanpa tren adalah setengah cerita.",
      },
      reference: "Skor sama, tren berlawanan, vonis berlawanan. Tren adalah separuh dari vonis.",
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
        "Z original = 1,2 WC/TA + 1,4 RE/TA + 3,3 EBIT/TA + 0,6 MVE/TL + 1,0 S/TA.",
        "Zona: di atas 2,99 aman; 1,81–2,99 abu-abu; di bawah 1,81 distress. Z-prime untuk privat, Z-double-prime untuk non-manufaktur.",
        "Lab: Z Sehat 2,633 (abu-abu, PD 4,5 persen); Z Rapuh 0,648 (distress, PD 22 persen).",
        "PD dari pemetaan frekuensi default historis — kalibrasi milik bank sendiri, bukan angka universal.",
        "Skor tanpa tren adalah setengah cerita: Z 2,10 yang membaik berbeda vonisnya dari Z 2,10 yang memburuk.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Perusahaan Sehat punya Z 2,633. Apa zona dan PD terpetakannya?",
          options: [
            { text: "Aman, PD 0,4 persen", why: "Salah: zona aman butuh Z di atas 2,99. Z 2,633 masih di bawah ambang itu." },
            { text: "Abu-abu, PD 4,5 persen — perlu analisis lanjutan, bukan vonis otomatis", why: "Tepat: 2,633 masuk 1,81–2,99. Zona abu-abu berarti skor saja tidak cukup untuk memutuskan.", correct: true },
            { text: "Distress, PD 22 persen", why: "Salah: distress butuh Z di bawah 1,81. Z 2,633 jauh di atas itu." },
            { text: "Aman, PD 22 persen", why: "Salah: zona dan PD-nya tidak cocok — PD 22 persen adalah pemetaan zona distress, bukan zona aman." },
          ],
        },
        {
          q: "Perusahaan privat (tidak terbuka) mengajukan kredit. Varian Altman mana yang dipakai?",
          options: [
            { text: "Z original — sama untuk semua perusahaan", why: "Salah: Z original memakai nilai pasar ekuitas, yang tidak ada pada perusahaan privat." },
            { text: "Z-prime — memakai nilai buku ekuitas dan bobot yang dikalibrasi ulang untuk perusahaan privat", why: "Tepat: Z-prime mengganti MVE dengan nilai buku dan mengubah bobot (0,717, 0,847, 3,107, 0,420, 0,998).", correct: true },
            { text: "Z-double-prime — karena perusahaan privat selalu non-manufaktur", why: "Salah: Z-double-prime untuk non-manufaktur, bukan untuk privat. Perusahaan privat manufaktur memakai Z-prime." },
            { text: "Tidak ada — Altman tidak berlaku untuk perusahaan privat", why: "Salah: Altman menyediakan Z-prime persis untuk kasus ini." },
          ],
        },
        {
          q: "Kenapa PD hasil pemetaan Z-Score tidak boleh diambil dari buku teks untuk pricing nyata?",
          options: [
            { text: "Karena buku teks selalu salah hitung", why: "Salah: bukan soal salah hitung — soal kalibrasi. Pemetaan bergantung pada portofolio dan definisi default bank itu sendiri." },
            { text: "Karena PD hanya benar untuk portofolio tempat ia dikalibrasi — tiap bank harus memakai frekuensi default historisnya sendiri", why: "Tepat: tabel ilustratif lesson ini pun harus diganti dengan kalibrasi internal sebelum dipakai nyata.", correct: true },
            { text: "Karena PD tidak dipakai dalam pricing", why: "Salah: PD justru masuk ke expected loss dan menentukan spread minimum." },
            { text: "Karena Z-Score tidak ada hubungannya dengan PD", why: "Salah: Z-Score dipetakan ke PD lewat frekuensi default historis — itulah isi lesson ini." },
          ],
        },
        {
          q: "Dua debitur sama-sama ber-Z 2,10. Yang satu trennya naik dari 1,4; yang lain turun dari 2,8. Apa vonisnya?",
          options: [
            { text: "Sama — skor yang sama berarti risiko yang sama", why: "Salah: skor tanpa tren adalah setengah cerita. Arah pergerakan mengubah vonis." },
            { text: "Yang naik dipertahankan dengan syarat kenaikan grade; yang turun diturunkan dan fasilitasnya ditinjau ulang", why: "Tepat: tren adalah separuh vonis. Z 2,10 yang membaik dan Z 2,10 yang memburuk adalah dua debitur yang berbeda.", correct: true },
            { text: "Keduanya dinaikkan — 2,10 sudah cukup dekat dengan 2,99", why: "Salah: yang trennya turun justru bergerak menjauhi zona aman — menaikkan grade-nya adalah kesalahan." },
            { text: "Keduanya ditolak — zona abu-abu berarti tolak", why: "Salah: zona abu-abu berarti analisis lanjutan, bukan penolakan otomatis." },
          ],
        },
        {
          q: "Rasio mana yang bobotnya paling besar dalam Z-Score original, dan kenapa?",
          options: [
            { text: "Penjualan dibagi aset (1,0) — karena penjualan adalah ukuran perusahaan", why: "Salah: bobot penjualan 1,0 — bukan yang terbesar." },
            { text: "EBIT dibagi aset (3,3) — profitabilitas adalah prediktor kebangkrutan yang paling kuat", why: "Tepat: Altman menemukan EBIT/TA membedakan perusahaan bangkrut dan sehat paling tajam — karena itu bobotnya 3,3.", correct: true },
            { text: "Nilai pasar ekuitas dibagi liabilitas (0,6) — karena pasar selalu benar", why: "Salah: bobotnya hanya 0,6 — dan pasar tidak selalu benar, ia hanya salah satu sinyal." },
            { text: "Modal kerja dibagi aset (1,2) — karena likuiditas adalah segalanya", why: "Salah: bobot modal kerja 1,2 — besar, tetapi masih di bawah EBIT/TA 3,3." },
          ],
        },
      ],
    },
  ],
};

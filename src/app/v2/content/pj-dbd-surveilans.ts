import type { V2Lesson, V2Step } from "../lib/types";

// ── PROYEK TERPANDU E1: Surveilans & Peringatan Dini DBD ─────────────────
// Capstone track Health Data Science — level advanced. Setting: Dinkes Kota
// Makassar, 6 kecamatan, 130 minggu data mingguan.
// Dataset: 100% SINTETIS deterministik (seed 42) — kasus_dbd.csv (780 baris),
// cuaca.csv (130 baris), laporan_puskesmas.csv (kotor disengaja: 12 duplikat,
// minggu 55-56 hilang, 6 salah eja), fitur_vendor.csv (kolom bocor rawat_inap).
// Snapshot: public/proyek/pj-dbd-surveilans/ (+ METODE.md).
// Ground truth (dari harness scripts/harness_dbd.py, SEMUA PASS):
// aturan "hujan[w] > 100 mm" -> 5 peringatan, TP=4, FP=1 (event 108),
// precision 0,80, recall 1,00, lead time 7 minggu; puncak korelasi lag 7
// (r=0,63); vendor: akurasi 95,35% (bocor) vs 78,29% (jujur), gap 17,1pp.
// Impostor: dashboard vendor "NusaHealth Analytics" — klaim 95% dengan
// leakage fitur rawat_inap minggu berjalan; 5 pelanggaran terukur.

const BASE = "/proyek/pj-dbd-surveilans";

export const pjDbdSurveilansMeta = {
  role: "Analis epidemiologi & data surveilans — Dinkes Kota Makassar",
  client: "Kepala Bidang P2P Dinkes: sistem peringatan dini DBD 6 kecamatan yang bisa dipertahankan angkanya",
  tagline:
    "Dari tiga sumber berantakan sampai aturan peringatan yang terukur — lalu bongkar dashboard vendor 'AI 95%' yang bocor.",
};

export const pjDbdSurveilans: V2Lesson = {
  slug: "pj-dbd-surveilans",
  track: "Health Data Science",
  module: "Proyek Terpandu",
  title: "Proyek: Surveilans & Peringatan Dini DBD — Dari Data Kotor ke Alarm yang Jujur",
  estMinutes: 300,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing proyek",
      title: "Wabah yang selalu datang 'tiba-tiba'",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis epidemiologi & data surveilans di Dinas Kesehatan Kota Makassar — kamu merancang sistem peringatan dini DBD untuk 6 kecamatan, dan mempertahankan angkanya di depan Kepala Bidang P2P.",
        client:
          "Kepala Bidang P2P (Pencegahan & Pengendalian Penyakit) Dinkes Kota Makassar. Masalahnya: setiap musim hujan, kasus DBD meledak dan respons selalu reaktif — fogging datang setelah puskesmas penuh. Datanya ada (laporan mingguan puskesmas + data cuaca), tetapi tercerai-berai, kotor, dan tidak pernah dihubungkan. Di tengah proyek, vendor 'NusaHealth Analytics' akan menawarkan dashboard AI dengan klaim akurasi 95% — tugasmu mengujinya dengan angka, bukan brosur.",
        story: [
          "Senin, 07:30. Telepon dari Puskesmas Tamalate: 'IGD penuh, dok. Kasus DBD naik tiga kali lipat dalam dua minggu.' Kamu buka file laporan — dan yang kamu temukan: minggu 55 dan 56 kosong total, 12 baris duplikat, dan satu kecamatan tertulis 'Panakukang'. Data untuk mengambil keputusan darurat, kondisinya seperti ini.",
          "Tiga minggu sebelumnya, hujan turun deras empat hari berturut-turut. Tidak ada yang menghubungkan kedua peristiwa itu — padahal jeda antara hujan ekstrem dan ledakan kasus BISA diukur, dan jeda itulah modal satu-satunya sistem peringatan dini: waktu untuk fogging, PSN, dan menyiagakan puskesmas SEBELUM kurva naik.",
          "Proyek ini multi-sesi (±300 menit): kamu membersihkan tiga sumber data sampai bisa direkonsiliasi, mengukur lag hujan-ke-kasus dari data (bukan dari teori), membangun aturan peringatan yang dievaluasi dengan precision/recall terhadap onset wabah yang diketahui, lalu menghadapi dashboard vendor: akurasi 95% yang runtuh saat satu kolom dibuang. Lima pelanggarannya terukur. Temukan semuanya.",
        ],
        objectives: [
          "Merekonsiliasi tiga sumber data (kasus, cuaca, laporan puskesmas) sampai totalnya cocok — duplikat, minggu hilang, dan salah eja ditangani eksplisit.",
          "Mengukur lag dominan hujan-ke-kasus dengan korelasi silang (lag 0–12) dan menjelaskan rantai biologis di balik angka itu.",
          "Membangun aturan peringatan dini dan mengevaluasinya: precision, recall, dan lead time terhadap onset wabah — bukan sekadar 'akurasi'.",
          "Membongkar klaim vendor dengan reproduksi: mengidentifikasi leakage, mengukur keruntuhan akurasi tanpa fitur bocor, dan menulis rekomendasi berbasis bukti.",
        ],
        prereqSummary:
          "Surveilans = pengumpulan, analisis, dan interpretasi data kesehatan secara sistematis dan berkelanjutan untuk perencanaan dan evaluasi program. Karena ada jeda biologis antara hujan dan kasus (disebut lag), kita memakai korelasi silang: korelasi curah hujan minggu ini dengan kasus N minggu kemudian, untuk N = 0 sampai 12 — lag dengan korelasi tertinggi adalah jeda dominan. Aturan peringatan dinilai seperti klasifikasi biner: precision = peringatan benar / semua peringatan (TP/(TP+FP)), recall = wabah tertangkap / semua wabah (TP/(TP+FN)). Ambang (threshold) = nilai pemicu peringatan; menaikkannya mengurangi false alarm tetapi berisiko melewatkan wabah. Lead time = jeda antara peringatan dan onset — waktu yang tersisa untuk intervensi.",
        datasetNote:
          "Sumber: 100% SINTETIS untuk proyek ini (generator deterministik, seed 42) — 130 minggu x 6 kecamatan.\nIsi: `kasus_dbd.csv` (kasus mingguan per kecamatan) + `cuaca.csv` (curah hujan, suhu, kelembapan mingguan) + `laporan_puskesmas.csv` (sumber ketiga yang KOTOR disengaja — duplikat, minggu hilang, salah eja) + `fitur_vendor.csv` (tabel fitur vendor, termasuk kolom bocor untuk Lab 4).\nKejujuran: (1) parameter diset menyerupai orde-besaran musiman DBD — BUKAN data surveilans nyata Dinkes; (2) nama kecamatan = geografi asli Makassar, angkanya fiktif; (3) onset wabah dan event hujan ditanam generator sebagai ground truth; (4) aturan 'hujan > 100 mm' adalah ilustrasi yang disengaja sederhana — sistem nyata memakai model yang lebih kaya. Detail + ground truth: METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga sumber, tiga kepribadian",
      prose: [
        "`kasus_dbd.csv`: 780 baris — 130 minggu (minggu 1–130) x 6 kecamatan (Panakkukang, Tamalate, Rappocini, Manggala, Biringkanaya, Tallo), kolom `minggu, kecamatan, kasus`. Ini 'sumber kebenaran' proyek: data yang sudah dibersihkan. `cuaca.csv`: 130 baris, `minggu, curah_hujan_mm, suhu_c, kelembapan_pct` — hujan dalam milimeter per minggu. `laporan_puskesmas.csv`: 780 baris mentah, `minggu, kecamatan, kasus_lapor` — inilah yang sampai ke mejamu tiap Senin pagi: ada duplikat, ada minggu yang hilang, ada salah ketik. `fitur_vendor.csv`: 129 baris, `minggu, hujan_mm, kasus_total, suhu_c, rawat_inap` — tabel fitur milik vendor, baru dibuka di Lab 4.",
        "Aturan main: (1) tidak ada angka proyek yang 'datang dari langit' — semua bisa dihitung ulang dari file-file ini; (2) sebelum satu korelasi pun dihitung, sumber kotor HARUS dibersihkan sampai totalnya cocok dengan sumber kebenaran; (3) setiap klaim — termasuk klaim vendor nanti — diverifikasi terhadap data dan definisi yang tertulis.",
      ],
      tasks: [
        { id: "t1", text: "Buka `kasus_dbd.csv`: catat jumlah baris dan 3 nama kolom" },
        { id: "t2", text: "Buka `cuaca.csv`: catat rentang minggu dan 4 kolomnya" },
        { id: "t3", text: "Buka `laporan_puskesmas.csv`: cari 1 contoh duplikat dan 1 contoh salah eja" },
      ],
      note: {
        title: "Miskonsepsi #1: data dari banyak sumber pasti lebih baik",
        type: "pitfall",
        body: "Multi-sumber tanpa rekonsiliasi = multi-noise. Laporan puskesmas, rekap Dinkes, dan data cuaca memakai definisi minggu, ejaan wilayah, dan keterlambatan yang berbeda — digabung mentah-mentah, kamu mendapat angka ganda, minggu berlubang, dan kecamatan hantu. Lab 1 membuktikan: 'lebih banyak data' hanya menang setelah dibersihkan sampai totalnya cocok.",
      },
      reference:
        "kasus_dbd.csv (780 baris) + cuaca.csv (130 baris) + laporan_puskesmas.csv (780 baris mentah) + fitur_vendor.csv (129 baris). Ground truth lengkap: METODE.md.",
    },
  ],
};

// ── Lanjutan A: lab pembersihan, deskriptif, konsep lag, lab korelasi ──
const LANJUTAN_DBD_A: V2Step[] = [
  {
    id: "lab-pembersihan",
    eyebrow: "Langkah 3 · Lab 1 — Pembersihan & rekonsiliasi",
    title: "Percayai, tapi verifikasi — baris per baris",
    prose: [
      "Pekerjaan paling tidak glamor dan paling menentukan: buktikan bahwa laporan puskesmas — setelah dibersihkan — bercerita sama dengan sumber kebenaran. Tiga cacatnya terukur: baris duplikat persis (semua kolom sama), minggu yang hilang total, dan salah eja nama kecamatan. Tugasmu menemukan ketiganya sebagai ANGKA, bukan firasat.",
      "Definisi bersih di proyek ini: (1) tidak ada baris duplikat, (2) ejaan kecamatan baku, (3) total kasus per minggu SAMA dengan `kasus_dbd.csv` untuk minggu-minggu yang datanya ada (selisih total = 0). Minggu 55–56 yang hilang tidak bisa 'diisi' dari sumber ini — ia dicatat sebagai lubang, bukan ditambal diam-diam.",
    ],
    tasks: [
      { id: "t1", text: "Hitung `n_baris_kasus` (kasus_dbd.csv) dan `n_duplikat` (baris persis sama di laporan)" },
      { id: "t2", text: "Hitung `n_minggu_hilang` dari 130 minggu dan `n_salah_eja` ('Panakukang')" },
      { id: "t3", text: "Bersihkan (dedupe + betulkan ejaan), lalu hitung `selisih_total` per minggu vs sumber kebenaran" },
    ],
    expected:
      "n_baris_kasus=780, n_duplikat=12, n_minggu_hilang=2 (minggu 55, 56), n_salah_eja=6, selisih_total=0",
    hints: [
      "Muat CSV: `pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))` — BASE sudah disiapkan di starter.",
      "Duplikat persis: `lap.duplicated().sum()`. Minggu hilang: `130 - lap['minggu'].nunique()`.",
      "Setelah `drop_duplicates()` + `replace('Panakukang', 'Panakkukang')`, bandingkan groupby('minggu').sum() di minggu yang sama-sama ada.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "kasus = pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))",
        "lap = pd.read_csv(open_url(BASE + \"/laporan_puskesmas.csv\"))",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "n_baris_kasus = ...",
        "n_duplikat = ...            # lap.duplicated().sum()",
        "n_minggu_hilang = ...       # 130 - lap['minggu'].nunique()",
        "n_salah_eja = ...           # (lap['kecamatan'] == 'Panakukang').sum()",
        "",
        "bersih = ...                # drop_duplicates + betulkan ejaan",
        "g1 = ...                    # total per minggu dari 'bersih'",
        "g2 = ...                    # total per minggu dari 'kasus'",
        "umum = g1.index.intersection(g2.index)",
        "selisih_total = ...         # jumlah selisih absolut di minggu bersama",
        "",
        "print(\"baris kasus:\", n_baris_kasus, \"| duplikat:\", n_duplikat)",
        "print(\"minggu hilang:\", n_minggu_hilang, \"| salah eja:\", n_salah_eja)",
        "print(\"selisih total vs sumber kebenaran:\", selisih_total)",
      ].join("\n"),
      lockLines: 6,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "kasus = pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))",
        "lap = pd.read_csv(open_url(BASE + \"/laporan_puskesmas.csv\"))",
        "",
        "n_baris_kasus = len(kasus)",
        "n_duplikat = int(lap.duplicated().sum())",
        "n_minggu_hilang = 130 - lap[\"minggu\"].nunique()",
        "n_salah_eja = int((lap[\"kecamatan\"] == \"Panakukang\").sum())",
        "",
        "bersih = lap.drop_duplicates().copy()",
        "bersih[\"kecamatan\"] = bersih[\"kecamatan\"].replace(\"Panakukang\", \"Panakkukang\")",
        "g1 = bersih.groupby(\"minggu\")[\"kasus_lapor\"].sum()",
        "g2 = kasus.groupby(\"minggu\")[\"kasus\"].sum()",
        "umum = g1.index.intersection(g2.index)",
        "selisih_total = int((g1[umum] - g2[umum]).abs().sum())",
        "",
        "print(\"baris kasus:\", n_baris_kasus, \"| duplikat:\", n_duplikat)",
        "print(\"minggu hilang:\", n_minggu_hilang, \"| salah eja:\", n_salah_eja)",
        "print(\"selisih total vs sumber kebenaran:\", selisih_total)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t1", label: "`n_baris_kasus` = 780", name: "n_baris_kasus", value: 780, msg: "130 minggu x 6 kecamatan." },
        { kind: "equal", task: "t1", label: "`n_duplikat` = 12", name: "n_duplikat", value: 12, msg: "12 baris duplikat persis — jebakan klasik rekap manual." },
        { kind: "equal", task: "t2", label: "`n_minggu_hilang` = 2", name: "n_minggu_hilang", value: 2, msg: "Minggu 55–56 hilang total — dicatat sebagai lubang, bukan ditambal." },
        { kind: "equal", task: "t2", label: "`n_salah_eja` = 6", name: "n_salah_eja", value: 6, msg: "Enam baris 'Panakukang' — kecamatan hantu." },
        { kind: "equal", task: "t3", label: "`selisih_total` = 0", name: "selisih_total", value: 0, msg: "Setelah bersih, laporan puskesmas cocok dengan sumber kebenaran." },
      ],
    },
    quiz: [
      {
        q: "Minggu 55–56 hilang dari laporan puskesmas. Perlakuan yang benar…",
        options: [
          { text: "Isi dengan rata-rata minggu 53–54 dan 57–58 agar deret mulus", why: "Salah — menambal diam-diam = memalsukan data. Lubang yang ditambal tanpa catatan akan dibaca sebagai 'kasus rendah' oleh model.", correct: false },
          { text: "Catat sebagai minggu tanpa data; analisis yang butuh deret kontinu memakai sumber kebenaran dengan catatan eksplisit", why: "Benar. Data hilang adalah FAKTA yang dicatat, bukan masalah yang disembunyikan. Setiap tambalan harus eksplisit dan beralasan.", correct: true },
          { text: "Hapus minggu 53–58 sekalian agar tidak ada yang bertanya", why: "Salah — membuang data valid untuk menutupi lubang adalah kebalikan dari kejujuran analitis.", correct: false },
        ],
      },
    ],
  },
  {
    id: "pola-musiman",
    eyebrow: "Langkah 4 · Eksplorasi deskriptif",
    title: "Musim hujan menulis, DBD menandatangani",
    prose: [
      "Data bersih. Sekarang baca polanya sebelum menghitung yang rumit: total kasus kota per minggu bergerak mengikuti musim — naik di bulan-bulan hujan, surut di kemarau. Puncak kota: minggu 74 dengan 473 kasus — dan minggu 74 berada 7 minggu setelah hujan ekstrem minggu 67. Kebetulan? Lab 2 akan mengujinya sebagai angka.",
      "Per kecamatan (total 130 minggu): Panakkukang 2.659 kasus — tertinggi, diikuti Biringkanaya 2.270, Tamalate 2.092, Rappocini 1.708, Tallo 1.493, Manggala 1.358. Tetapi 'tertinggi' dalam kasus absolut BELUM berarti prioritas tertinggi — itu butuh pembagi populasi (kasus per 100.000 penduduk), yang tidak ada di dataset ini. Analis yang baik tahu kapan ANGKA yang ia punya belum cukup untuk kesimpulan operasional.",
    ],
    tasks: [
      { id: "t1", text: "Hitung total kasus per kecamatan dari `kasus_dbd.csv` — verifikasi Panakkukang tertinggi (2.659)" },
      { id: "t2", text: "Cari minggu dengan total kota tertinggi dan hujan 7 minggu sebelumnya" },
      { id: "t3", text: "Tuliskan satu kesimpulan yang TIDAK boleh diambil dari angka absolut ini" },
    ],
    note: {
      title: "Miskonsepsi #2: angka absolut = prioritas",
      type: "risk",
      body: "Panakkukang 2.659 vs Manggala 1.358 — tetapi tanpa populasi, kamu tidak tahu apakah itu karena risikonya lebih tinggi atau penduduknya lebih banyak. Fogging berbasis kasus absolut bisa salah sasaran total. Prinsipnya: laporkan angkanya, NYATAKAN keterbatasannya, dan minta data pembagi sebelum prioritas ditetapkan.",
    },
    quiz: [
      {
        q: "Kabid bertanya: 'Kecamatan mana yang harus difogging duluan?' Data yang kamu punya: kasus absolut per kecamatan. Jawaban profesional…",
        options: [
          { text: "Panakkukang — angkanya tertinggi, 2.659 kasus", why: "Salah — kasus absolut tanpa populasi bisa menyesatkan. Kecamatan padat penduduk wajar punya kasus absolut lebih tinggi meski risikonya sama.", correct: false },
          { text: "Minta data populasi dulu untuk hitung incidence rate; sementara itu fogging berbasis klaster kasus aktif, bukan total historis", why: "Benar. Jawaban jujur: 'data saya belum cukup untuk prioritas final'. Keputusan darurat memakai sinyal yang tepat (klaster aktif), bukan proksi yang salah.", correct: true },
          { text: "Bagi rata ke 6 kecamatan agar adil", why: "Salah — 'adil' bukan strategi epidemiologi. Sumber daya terbatas harus mengikuti risiko, bukan dibagi rata.", correct: false },
        ],
      },
    ],
  },
  {
    id: "konsep-lag",
    eyebrow: "Langkah 5 · Konsep inti",
    title: "Tujuh minggu yang bisa dihitung",
    prose: [
      "Mengapa hujan hari ini menjadi kasus dua bulan lagi? Rantai biologisnya: hujan ekstrem → genangan air (telur nyamuk menetas) → jentik → nyamuk dewasa (±8–10 hari) → gigitan menularkan virus → masa inkubasi dalam tubuh (±4–7 hari) → gejala → pasien ke puskesmas → tercatat. Total: sekitar 6–8 minggu dari hujan ke 'kasus tercatat'. Inilah lag — dan karena ia biologis, ia STABIL dari tahun ke tahun: modal yang bisa dipakai untuk peringatan dini.",
      "Korelasi silang mengukurnya dari data: untuk setiap lag N = 0..12, hitung korelasi antara hujan minggu w dan kasus minggu w+N. Lag dengan korelasi tertinggi = jeda dominan sistem ini. Kalau teori benar, puncak harus muncul di sekitar 6–8 — dan data (Lab 2) yang akan menjadi hakimnya, bukan intuisi.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan rantai biologis hujan → kasus dengan perkiraan durasi tiap tahap" },
      { id: "t2", text: "Jelaskan dengan kata-katamu: apa yang diukur korelasi silang pada lag N?" },
      { id: "t3", text: "Prediksi SEBELUM Lab 2: di lag berapa puncak akan muncul? Tulis alasanmu" },
    ],
    note: {
      title: "Miskonsepsi #3: korelasi lag = bukti sebab-akibat",
      type: "pitfall",
      body: "Korelasi 0,63 di lag 7 TIDAK membuktikan hujan 'menyebabkan' DBD — ia hanya konsisten dengan rantai biologis yang sudah diketahui. Yang bisa mematahkan hubungan ini: intervensi (fogging massal setelah hujan ekstrem — lihat event minggu 108 nanti), perubahan perilaku, atau kekebalan populasi. Korelasi = petunjuk kuantitatif, bukan vonis kausal.",
    },
    quiz: [
      {
        q: "Setelah fogging massal, hujan ekstrem TIDAK diikuti lonjakan kasus. Apa artinya bagi sistem peringatan?",
        options: [
          { text: "Model lag rusak — buang dan cari yang baru", why: "Salah — modelnya tidak rusak; DUNIAnya berubah karena intervensi. Justru ini bukti sistem bekerja: peringatan memicu tindakan yang memutus rantai.", correct: false },
          { text: "False alarm itu justru sinyal keberhasilan: peringatan memicu intervensi yang mencegah wabah — catat konteksnya, jangan hapus datanya", why: "Benar. Paradoks peringatan dini yang baik: semakin efektif ia memicu tindakan, semakin banyak 'false alarm' yang tercatat. Evaluasi harus mencatat konteks intervensi.", correct: true },
          { text: "Naikkan ambang agar fogging tidak terpicu lagi", why: "Salah — menaikkan ambang karena intervensi berhasil adalah menghukum keberhasilan. Ambangnya benar; yang berubah adalah outcome karena tindakan.", correct: false },
        ],
      },
    ],
  },
  {
    id: "lab-korelasi",
    eyebrow: "Langkah 6 · Lab 2 — Korelasi silang",
    title: "Biarkan data menunjuk lag-nya",
    prose: [
      "Teori memprediksi puncak di 6–8 minggu. Sekarang uji: hitung korelasi Pearson antara deret hujan dan deret total kasus kota untuk lag 0 sampai 12. Kalau puncak muncul jauh dari 6–8, teorimu (atau datamu) yang salah — dan kamu harus tahu yang mana.",
    ],
    tasks: [
      { id: "t1", text: "Agregatkan kasus per minggu (total 6 kecamatan) → deret 130 minggu" },
      { id: "t2", text: "Hitung korelasi untuk lag 0–12 → `corrs` (dict lag → korelasi)" },
      { id: "t3", text: "Tentukan `lag_puncak` dan `r_lag7`; bandingkan dengan prediksimu di Langkah 5" },
    ],
    expected: "lag_puncak=7, r_lag7≈0,63 (dominan — >2x korelasi lag lain)",
    hints: [
      "Total per minggu: `kasus.groupby('minggu')['kasus'].sum().values` (pastikan urut minggu 1–130).",
      "Untuk lag N: korelasikan `hujan[:130-N]` dengan `total[N:]` — hujan minggu w vs kasus minggu w+N.",
      "`pd.Series(a).corr(pd.Series(b))` = korelasi Pearson.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "kasus = pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))",
        "cuaca = pd.read_csv(open_url(BASE + \"/cuaca.csv\"))",
        "",
        "total = kasus.groupby(\"minggu\")[\"kasus\"].sum().values",
        "hujan = cuaca[\"curah_hujan_mm\"].values",
        "",
        "# TUGASMU: lengkapi korelasi silang lag 0..12",
        "corrs = {}",
        "for lag in range(13):",
        "    corrs[lag] = ...",
        "lag_puncak = ...",
        "r_lag7 = ...",
        "",
        "print(\"korelasi per lag:\", {l: round(c, 2) for l, c in corrs.items()})",
        "print(\"puncak di lag\", lag_puncak, \"dengan r =\", round(r_lag7, 2))",
      ].join("\n"),
      lockLines: 8,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "kasus = pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))",
        "cuaca = pd.read_csv(open_url(BASE + \"/cuaca.csv\"))",
        "",
        "total = kasus.groupby(\"minggu\")[\"kasus\"].sum().values",
        "hujan = cuaca[\"curah_hujan_mm\"].values",
        "",
        "corrs = {}",
        "for lag in range(13):",
        "    corrs[lag] = float(pd.Series(hujan[:130 - lag]).corr(pd.Series(total[lag:])))",
        "lag_puncak = max(corrs, key=corrs.get)",
        "r_lag7 = corrs[7]",
        "",
        "print(\"korelasi per lag:\", {l: round(c, 2) for l, c in corrs.items()})",
        "print(\"puncak di lag\", lag_puncak, \"dengan r =\", round(r_lag7, 2))",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t3", label: "`lag_puncak` = 7", name: "lag_puncak", value: 7, msg: "Jeda dominan hujan → kasus = 7 minggu — sesuai rantai biologis." },
        { kind: "equal", task: "t3", label: "`r_lag7` ≈ 0,63", name: "r_lag7", value: 0.63, tol: 0.05, msg: "Korelasi 0,63 di lag 7 — dominan, >2x lag lainnya." },
      ],
    },
    quiz: [
      {
        q: "Korelasi di lag 0 (hujan vs kasus minggu yang sama) ≈ −0,12. Interpretasi yang benar…",
        options: [
          { text: "Hujan menurunkan kasus DBD minggu itu juga", why: "Salah — korelasi ≈ 0 (negatif kecil = noise) artinya tidak ada hubungan seketika. Jangan membaca kausalitas dari angka yang praktis nol.", correct: false },
          { text: "Tidak ada hubungan seketika — sesuai teori: butuh 6–8 minggu bagi hujan menjadi kasus tercatat", why: "Benar. Lag 0 yang datar justru MENGUATKAN cerita lag: kalau hujan dan kasus berkorelasi di minggu yang sama, rantai biologisnya patut dicurigai.", correct: true },
          { text: "Datanya salah — hujan pasti langsung menaikkan kasus", why: "Salah — 'pasti' adalah intuisi, bukan bukti. Data + biologi sepakat: tidak ada efek seketika.", correct: false },
        ],
      },
    ],
  },
];

(pjDbdSurveilans.steps as V2Step[]).push(...LANJUTAN_DBD_A);

// ── Lanjutan B: keputusan ambang, lab aturan, operasional, dossier vendor ──
const LANJUTAN_DBD_B: V2Step[] = [
  {
    id: "keputusan-ambang",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Ambang 100 atau 150 — siapa yang kamu korbankan?",
    prose: [
      "Lag 7 memberi lead time 7 minggu — tetapi peringatan butuh PEMICU. Aturan kandidat: 'peringatan di minggu w bila curah hujan minggu itu > AMBANG'. Dua nilai ambang, dua filosofi — dan keduanya mengorbankan sesuatu. Pilih dengan sadar, karena konsekuensinya terukur di Lab 3.",
      "Ambang 100 mm: 5 peringatan (minggu 27, 67, 89, 108, 115) — menangkap SEMUA 4 onset wabah (34, 74, 96, 122), precision 0,80, recall 1,00. Harganya: 1 false alarm (minggu 108 — hujan ekstrem tanpa wabah susulan). Ambang 150 mm: 3 peringatan (67, 108, 115) — precision 0,67, recall 0,50: onset minggu 34 dan 96 TERLEWAT tanpa peringatan.",
    ],
    tasks: [],
    decision: {
      prompt: "Ambang mana yang kamu tetapkan untuk sistem peringatan Dinkes?",
      options: [
        {
          id: "opt-100",
          label: "Ambang 100 mm — sensitif: tidak ada wabah yang lolos",
          rationale:
            "5 peringatan, precision 0,80, recall 1,00, lead time 7 minggu. False alarm minggu 108 adalah harga yang dibayar.",
          nextStepId: "lab-aturan",
          consequenceNote:
            "Peringatan minggu 108 memicu fogging — dan wabah tidak terjadi. Sebagian staf menyebutnya 'alarm palsu yang buang anggaran'. Kamu tunjukkan catatannya: hujan 162 mm (tertinggi kedua), intervensi fogging 48 jam setelah peringatan, dan rantai yang terputus. False alarm dengan konteks intervensi BUKAN kegagalan model — ia adalah bukti sistem memicu tindakan. Tetapi kamu juga mencatat: bila false alarm terjadi tiap bulan, kelelahan siaga (alert fatigue) akan membunuh kepatuhan — ambang perlu dievaluasi tiap musim.",
        },
        {
          id: "opt-150",
          label: "Ambang 150 mm — spesifik: hanya hujan paling ekstrem yang berbunyi",
          rationale:
            "3 peringatan, precision 0,67, recall 0,50. Lebih sedikit alarm, tetapi 2 dari 4 wabah datang tanpa peringatan.",
          nextStepId: "lab-aturan",
          consequenceNote:
            "Tenang selama 8 bulan — hanya 3 alarm. Lalu minggu 34: puskesmas penuh tanpa peringatan sebelumnya. Investigasi menunjukkan hujan minggu 27 (141,8 mm) tidak melewati ambang 150 — padahal ia memicu wabah terbesar kedua. Pelajarannya mahal: ambang yang 'bersih dari false alarm' membeli ketenangan semu dengan harga wabah yang tak terantisipasi. Recall 0,50 berarti setengah wabah datang tiba-tiba — dan 'tiba-tiba' adalah kegagalan sistem peringatan itu sendiri.",
        },
      ],
    },
  },
  {
    id: "lab-aturan",
    eyebrow: "Langkah 8 · Lab 3 — Aturan peringatan & evaluasi",
    title: "Alarm yang bisa diaudit",
    prose: [
      "Apapun pilihanmu di Langkah 7, sekarang buktikan angkanya: implementasikan aturan 'hujan[w] > 100 mm', daftarkan minggu-minggu peringatannya, lalu evaluasi terhadap onset wabah hasil validasi retrospektif (minggu 34, 74, 96, 122). Definisi di proyek ini: peringatan di minggu w DINILAI BENAR (TP) bila w + 7 adalah minggu onset — peringatan yang datang tepat 7 minggu sebelum wabah.",
      "Perhatikan: evaluasi ini memakai onset yang DIKETAHUI dari data historis. Di dunia nyata, kamu tidak punya daftar onset masa depan — itulah kenapa evaluasi jujur memakai data masa lalu (backtest) atau menunggu musim berikutnya.",
    ],
    tasks: [
      { id: "t1", text: "Terapkan aturan: `peringatan` = minggu dengan hujan > 100 mm" },
      { id: "t2", text: "Hitung `tp` (peringatan w dengan w+7 di ONSET) dan `fp`" },
      { id: "t3", text: "Hitung `precision` dan `recall`; nyatakan lead time-nya" },
    ],
    expected:
      "n_peringatan=5 (minggu 27, 67, 89, 108, 115), TP=4, FP=1, precision=0,80, recall=1,00, lead time 7 minggu",
    hints: [
      "`peringatan = [w for w in range(1, 131) if hujan[w-1] > 100]` — hujan adalah array 130 elemen (indeks 0 = minggu 1).",
      "TP: `sum(1 for w in peringatan if (w + 7) in ONSET)` dengan ONSET = [34, 74, 96, 122].",
      "precision = tp / len(peringatan); recall = tp / len(ONSET).",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "cuaca = pd.read_csv(open_url(BASE + \"/cuaca.csv\"))",
        "hujan = cuaca[\"curah_hujan_mm\"].values",
        "",
        "ONSET = [34, 74, 96, 122]   # minggu onset wabah (validasi retrospektif)",
        "AMBANG = 100.0",
        "",
        "# TUGASMU: lengkapi evaluasi aturan peringatan",
        "peringatan = ...",
        "n_peringatan = ...",
        "tp = ...          # peringatan w benar bila (w + 7) ada di ONSET",
        "fp = ...",
        "precision = ...",
        "recall = ...",
        "",
        "print(\"peringatan di minggu:\", peringatan)",
        "print(f\"TP={tp} FP={fp} | precision={precision:.2f} recall={recall:.2f} | lead time 7 minggu\")",
      ].join("\n"),
      lockLines: 7,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "cuaca = pd.read_csv(open_url(BASE + \"/cuaca.csv\"))",
        "hujan = cuaca[\"curah_hujan_mm\"].values",
        "",
        "ONSET = [34, 74, 96, 122]",
        "AMBANG = 100.0",
        "",
        "peringatan = [w for w in range(1, 131) if hujan[w - 1] > AMBANG]",
        "n_peringatan = len(peringatan)",
        "tp = sum(1 for w in peringatan if (w + 7) in ONSET)",
        "fp = n_peringatan - tp",
        "precision = tp / n_peringatan",
        "recall = tp / len(ONSET)",
        "",
        "print(\"peringatan di minggu:\", peringatan)",
        "print(f\"TP={tp} FP={fp} | precision={precision:.2f} recall={recall:.2f} | lead time 7 minggu\")",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t1", label: "`n_peringatan` = 5", name: "n_peringatan", value: 5, msg: "Peringatan di minggu 27, 67, 89, 108, 115 — tepat di 5 event hujan ekstrem." },
        { kind: "equal", task: "t3", label: "`precision` = 0,80", name: "precision", value: 0.8, tol: 0.01, msg: "4 dari 5 peringatan benar — 1 false alarm (minggu 108)." },
        { kind: "equal", task: "t3", label: "`recall` = 1,00", name: "recall", value: 1.0, tol: 0.01, msg: "Semua 4 onset tertangkap — tidak ada wabah yang datang tiba-tiba." },
      ],
    },
    quiz: [
      {
        q: "Vendor mengklaim 'akurasi 95%' untuk modelnya. Mengapa precision/recall lebih tepat daripada akurasi untuk sistem peringatan wabah?",
        options: [
          { text: "Karena akurasi selalu lebih rendah dari precision", why: "Salah — tidak ada hubungan tetap begitu. Masalahnya bukan besar-kecilnya angka.", correct: false },
          { text: "Karena wabah jarang (class imbalance): model yang selalu memprediksi 'tidak ada wabah' bisa berakurasi >95% sambil melewatkan SEMUA wabah — recall-nya 0", why: "Benar. Akurasi didominasi minggu-minggu normal yang memang mudah diprediksi. Yang mahal adalah wabah yang terlewat (FN) — dan itu hanya terlihat di recall.", correct: true },
          { text: "Karena precision lebih mudah dihitung", why: "Salah — kemudahan hitung bukan alasan metodologis.", correct: false },
        ],
      },
    ],
  },
  {
    id: "operasional",
    eyebrow: "Langkah 9 · Operasionalisasi",
    title: "Tujuh minggu itu dipakai untuk apa",
    prose: [
      "Lead time 7 minggu bukan angka pajangan — ia adalah ANGGARAN WAKTU intervensi. SOP yang diturunkan dari aturan ini: minggu 0 (peringatan): verifikasi curah hujan di 6 kecamatan + rapat cepat P2P. Minggu 1–2: fogging fokus di kecamatan dengan kasus mulai naik + distribusi abate. Minggu 3–5: PSN 3M Plus massal (menguras, menutup, mendaur ulang) — memutus rantai SEBELUM nyamuk dewasa menetas massal. Minggu 6–7: siaga puskesmas (stok cairan infus, jadwal jaga) — bersiap untuk kasus yang lolos.",
      "Dua disiplin operasional: (1) SETIAP peringatan dicatat dengan konteksnya (apakah diikuti intervensi? hasilnya?) — tanpa catatan ini, evaluasi musim depan buta; (2) ambang DIEVALUASI tiap akhir musim hujan, bukan diukir di batu — pola hujan bergeser, kota berubah.",
    ],
    tasks: [
      { id: "t1", text: "Susun timeline SOP 0–7 minggu untuk satu peringatan (aksi + penanggung jawab)" },
      { id: "t2", text: "Tuliskan format catatan peringatan (minimal 5 kolom)" },
      { id: "t3", text: "Jawab: kapan ambang 100 mm harus ditinjau ulang?" },
    ],
    quiz: [
      {
        q: "Dua musim berjalan, tidak ada wabah sama sekali tetapi ada 3 peringatan (semua FP). Respons yang benar…",
        options: [
          { text: "Sistem gagal — matikan, kembali ke respons reaktif", why: "Salah — 3 FP dalam 2 musim tanpa wabah bisa berarti: (a) ambang terlalu sensitif, ATAU (b) intervensi pasca-peringatan berhasil mencegah. Bedakan dulu sebelum mematikan.", correct: false },
          { text: "Audit tiap FP: apakah diikuti intervensi? Jika ya dan wabah tidak terjadi, itu keberhasilan yang tercatat sebagai FP — lalu tinjau ambang dengan data 2 musim", why: "Benar. Evaluasi peringatan dini TIDAK bisa dibaca dari metrik saja — ia butuh catatan intervensi. Baru setelah itu ambang direvisi berbasis bukti.", correct: true },
          { text: "Naikkan ambang ke 200 mm agar tidak ada peringatan lagi", why: "Salah — menghilangkan peringatan = menghilangkan sistem. Itu bukan kalibrasi, itu menyerah.", correct: false },
        ],
      },
    ],
  },
  {
    id: "dossier-vendor",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Membedah dashboard 'DengueGuard AI'",
    prose: [
      "Map terbuka. 'NusaHealth Analytics' — vendor yang rapi, presentasi meyakinkan — menawarkan dashboard DengueGuard AI ke Dinkes: 'Akurasi 95% memprediksi wabah. Fitur unggulan kami: integrasi data rawat inap real-time.' Harganya Rp 450 juta/tahun. Kabid tergoda: '95% — jauh lebih canggih dari aturan hujan > 100 mm kita.'",
      "Kamu punya keunggulan yang tidak dimiliki brosur: definisi evaluasi yang jujur (precision/recall/lead time), pemahaman leakage, dan tabel fitur vendor itu sendiri (`fitur_vendor.csv`). Lima hal di klaim ini bermasalah secara TERUKUR. Temukan semuanya sebelum Dinkes menandatangani kontrak.",
    ],
    tasks: [
      { id: "t1", text: "Periksa fitur `rawat_inap`: apa isinya dan KAPAN ia tersedia?" },
      { id: "t2", text: "Periksa klaim 95%: dengan fitur apa angka itu dihitung?" },
      { id: "t3", text: "Periksa metode validasi dan lead time: apa yang hilang?" },
      { id: "t4", text: "Buka `fitur_vendor.csv` — catat 5 kolomnya untuk Lab 4" },
    ],
    auditDossier: {
      version: "nusahealth-dengueguard-2.1",
      snapshotDate: "2026-10-16",
      intro: "Dossier penawaran dashboard DengueGuard AI (NusaHealth Analytics): klaim akurasi 95% prediksi wabah DBD. Audit terhadap definisi evaluasi yang jujur sebelum kontrak Rp 450 juta/tahun ditandatangani.",
      columns: ["#", "Klaim vendor", "Nilai", "Catatan kaki"],
      rows: [
        { rowId: 1, cells: { "#": "1", "Klaim vendor": "Akurasi prediksi wabah", "Nilai": "95%", "Catatan kaki": "Evaluasi internal pada data historis" }, claims: [] },
        { rowId: 2, cells: { "#": "2", "Klaim vendor": "Fitur unggulan", "Nilai": "Rawat inap real-time", "Catatan kaki": "Integrasi feed RS: jumlah pasien DBD rawat inap minggu berjalan" }, claims: [] },
        { rowId: 3, cells: { "#": "3", "Klaim vendor": "Metode validasi", "Nilai": "Cross-validation 5-fold", "Catatan kaki": "Fold acak pada seluruh periode data" }, claims: [] },
        { rowId: 4, cells: { "#": "4", "Klaim vendor": "Lead time prediksi", "Nilai": "1 minggu", "Catatan kaki": "Memprediksi status wabah minggu depan" }, claims: [] },
        { rowId: 5, cells: { "#": "5", "Klaim vendor": "Definisi wabah (target)", "Nilai": "Total kasus > 130", "Catatan kaki": "Ambang wabah kota per minggu" }, claims: [] },
        { rowId: 6, cells: { "#": "6", "Klaim vendor": "Garansi operasional", "Nilai": "Peringatan 2 minggu sebelum wabah", "Catatan kaki": "Berdasarkan lead time model" }, claims: [] }
      ],
      injections: [
        { key: "I1", rowIds: [2], title: "Fitur `rawat_inap` = target yang menyamar", clue: "Baris 2 — 'rawat inap minggu berjalan' = 0,85 × kasus minggu berjalan + noise. Pasien dirawat KARENA tercatat sebagai kasus: fitur ini tersedia hanya SETELAH kasus diketahui. Memprediksi wabah dengan fitur ini = memprediksi masa kini dengan masa kini.", danger: "Leakage klasik: fitur yang merupakan proksi target. Model terlihat pintar karena ia 'mengintip' jawaban. Aturan: setiap fitur harus lolos uji 'apakah ini tersedia SEBELUM momen prediksi?'. rawat_inap minggu berjalan: tidak." },
        { key: "I2", rowIds: [1, 2], title: "95% runtuh menjadi 78% tanpa fitur bocor", clue: "Baris 1–2 — reproduksi di Lab 4: skor yang sama, akurasi 95,35% DENGAN rawat_inap vs 78,29% TANPANYA. Gap 17,1pp = seluruh 'kecanggihan' model.", danger: "Klaim akurasi tanpa daftar fitur = angka tanpa konteks. Pelajaran abadi: minta daftar fitur dan definisinya SEBELUM percaya angka akurasi. Model 78% yang jujur lebih berguna dari model 95% yang bocor — karena yang 95% tidak akan pernah terulang di lapangan." },
        { key: "I3", rowIds: [3], title: "Cross-validation ACAK pada data deret waktu", clue: "Baris 3 — fold acak pada data temporal = data MASA DEPAN masuk ke training fold dan 'memprediksi' masa lalu di fold validasi. Validasi deret waktu yang benar: split temporal (train = masa lalu, test = masa depan).", danger: "Pelanggaran metodologi yang terukur: CV acak pada data waktu melebih-lebihkan akurasi secara sistematis. Ini bukan detail teknis — ini perbedaan antara 'model yang bekerja' dan 'model yang terlihat bekerja'." },
        { key: "I4", rowIds: [1], title: "'Evaluasi internal' tanpa out-of-sample", clue: "Baris 1 — catatan kaki: 'evaluasi internal pada data historis'. Tidak ada evaluasi pada periode yang benar-benar belum terlihat model (out-of-sample jujur). Angka 95% dihitung di wilayah yang sudah dijelajahi model.", danger: "In-sample accuracy = nilai ulangan dengan kunci jawaban di tangan. Standar minimum: evaluasi pada periode waktu yang tidak dipakai training SAMA SEKALI — atau tunggu satu musim berjalan." },
        { key: "I5", rowIds: [4, 6], title: "Lead time 1 minggu = peringatan yang terlambat", clue: "Baris 4 & 6 — 'memprediksi wabah minggu depan' dengan 'garansi 2 minggu' yang kontradiktif (1 vs 2 minggu — bahkan brosurnya tidak konsisten). Bandingkan: aturan hujan > 100 mm memberi 7 minggu. Fogging butuh 2–3 minggu persiapan.", danger: "Akurasi tanpa lead time yang operasional = angka hiasan. Peringatan yang datang 1 minggu sebelum wabah tidak memberi waktu intervensi — ia hanya memberi waktu untuk panik. Nilai peringatan dini = akurasi × lead time yang bisa dipakai." }
      ],
    },
  },
];

(pjDbdSurveilans.steps as V2Step[]).push(...LANJUTAN_DBD_B);

// ── Lanjutan C: lab leakage, keputusan vendor, monitoring, deliverable ───
const LANJUTAN_DBD_C: V2Step[] = [
  {
    id: "lab-leakage",
    eyebrow: "Langkah 11 · Lab 4 — Membongkar leakage",
    title: "Satu kolom dibuang, 17 poin hilang",
    prose: [
      "Klaim 95% itu dihitung DENGAN kolom `rawat_inap`. Sekarang uji integritasnya: bangun ulang skor vendor dua kali — sekali dengan semua fitur (seperti brosur), sekali TANPA `rawat_inap` (seperti dunia nyata, di mana angka rawat inap minggu berjalan belum ada saat prediksi dibuat). Targetnya sama persis dengan definisi vendor: wabah = total kasus kota minggu depan > 130.",
      "Skor vendor (dari dokumentasi teknis yang mereka serahkan setelah didesak): skor_jujur = 0,5·z(hujan) + 0,3·z(kasus) + 0,2·z(hujan_lag1); skor_bocor = 0,6·z(rawat_inap) + 0,25·z(kasus) + 0,15·z(hujan). Prediksi 'wabah' bila skor > 0,6. z() = standardisasi (kurangi mean, bagi std).",
    ],
    tasks: [
      { id: "t1", text: "Bangun `target`: wabah minggu depan = total kasus minggu+1 > 130 (129 minggu)" },
      { id: "t2", text: "Hitung `skor_jujur` dan `skor_bocor` sesuai rumus dokumentasi" },
      { id: "t3", text: "Hitung `acc_jujur` dan `acc_bocor`; nyatakan gap-nya dalam poin persen" },
    ],
    expected:
      "acc_jujur=78,29%, acc_bocor=95,35%, gap=17,1pp — klaim 95% = angka DENGAN leakage",
    hints: [
      "Target: `total = kasus.groupby('minggu')['kasus'].sum().values` lalu `target = (total[1:] > 130).astype(int)` — 129 elemen.",
      "`fitur_vendor.csv` punya 129 baris (minggu 1–129): kolomnya sejajar dengan target.",
      "z(v) = (v - v.mean()) / (v.std() + 1e-9); `np.roll(hujan, 1)` untuk hujan_lag1.",
      "Akurasi: `(((skor > 0.6).astype(int)) == target).mean()`.",
    ],
    requires: ["pandas", "numpy"],
    code: {
      starter: [
        "import pandas as pd",
        "import numpy as np",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "kasus = pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))",
        "fit = pd.read_csv(open_url(BASE + \"/fitur_vendor.csv\"))",
        "",
        "total = kasus.groupby(\"minggu\")[\"kasus\"].sum().values",
        "target = (total[1:] > 130).astype(int)",
        "",
        "hujan = fit[\"hujan_mm\"].values",
        "kas = fit[\"kasus_total\"].values",
        "rawat = fit[\"rawat_inap\"].values",
        "",
        "def z(v):",
        "    v = v.astype(float)",
        "    return (v - v.mean()) / (v.std() + 1e-9)",
        "",
        "# TUGASMU: lengkapi kedua skor dan akurasinya",
        "skor_jujur = ...",
        "skor_bocor = ...",
        "acc_jujur = ...",
        "acc_bocor = ...",
        "",
        "print(f\"jujur: {acc_jujur:.2%} | bocor: {acc_bocor:.2%} | gap: {(acc_bocor - acc_jujur):.1%}\")",
      ].join("\n"),
      lockLines: 19,
      solution: [
        "import pandas as pd",
        "import numpy as np",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-dbd-surveilans\"",
        "kasus = pd.read_csv(open_url(BASE + \"/kasus_dbd.csv\"))",
        "fit = pd.read_csv(open_url(BASE + \"/fitur_vendor.csv\"))",
        "",
        "total = kasus.groupby(\"minggu\")[\"kasus\"].sum().values",
        "target = (total[1:] > 130).astype(int)",
        "",
        "hujan = fit[\"hujan_mm\"].values",
        "kas = fit[\"kasus_total\"].values",
        "rawat = fit[\"rawat_inap\"].values",
        "",
        "def z(v):",
        "    v = v.astype(float)",
        "    return (v - v.mean()) / (v.std() + 1e-9)",
        "",
        "skor_jujur = 0.5 * z(hujan) + 0.3 * z(kas) + 0.2 * z(np.roll(hujan, 1))",
        "skor_bocor = 0.6 * z(rawat) + 0.25 * z(kas) + 0.15 * z(hujan)",
        "acc_jujur = float((((skor_jujur > 0.6).astype(int)) == target).mean())",
        "acc_bocor = float((((skor_bocor > 0.6).astype(int)) == target).mean())",
        "",
        "print(f\"jujur: {acc_jujur:.2%} | bocor: {acc_bocor:.2%} | gap: {(acc_bocor - acc_jujur):.1%}\")",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t3", label: "`acc_jujur` = 78,29%", name: "acc_jujur", value: 0.7829, tol: 0.005, msg: "Tanpa fitur bocor: 78,29% — inilah kemampuan model yang sebenarnya." },
        { kind: "equal", task: "t3", label: "`acc_bocor` = 95,35%", name: "acc_bocor", value: 0.9535, tol: 0.005, msg: "Dengan rawat_inap: 95,35% — persis klaim brosur. Klaimnya benar ANGKAnya, salah KONTEKSnya." },
      ],
    },
    quiz: [
      {
        q: "Vendor membela diri: 'Tapi rawat_inap memang tersedia real-time di dashboard RS!' Mengapa argumen ini tetap tidak menyelamatkan model?",
        options: [
          { text: "Karena dashboard RS lambat", why: "Salah — kecepatan feed bukan masalahnya.", correct: false },
          { text: "Karena 'real-time' di sini = data minggu BERJALAN, sedangkan prediksi dibutuhkan SEBELUM minggu berjalan berakhir — fitur ini adalah proksi target itu sendiri (0,85 × kasus + noise), bukan prediktor", why: "Benar. Leakage bukan soal kecepatan data — soal URUTAN WAKTU: fitur harus tersedia sebelum momen prediksi. rawat_inap minggu berjalan baru lengkap setelah kasus minggu itu tercatat.", correct: true },
          { text: "Karena korelasinya terlalu tinggi", why: "Salah — korelasi tinggi bukan masalah; masalahnya adalah ia mengintip jawaban.", correct: false },
        ],
      },
    ],
  },
  {
    id: "keputusan-vendor",
    eyebrow: "Langkah 12 · Checkpoint keputusan",
    title: "Tolak, atau beri kesempatan kedua?",
    prose: [
      "Lima pelanggaran terukur ada di mejamu, dan Lab 4 baru saja membuktikan yang paling fatal: 17,1 poin akurasi adalah leakage. Kabid masih menatap brosur '95%' itu. Keputusanmu sekarang bukan soal statistik — soal SIKAP PROFESIONAL: bagaimana merespons vendor di depan pengambil keputusan yang tergoda angka besar?",
    ],
    tasks: [],
    decision: {
      prompt: "Bagaimana kamu merespons penawaran NusaHealth Analytics?",
      options: [
        {
          id: "opt-tolak",
          label: "Tolak & dokumentasikan — 5 pelanggaran tertulis",
          rationale:
            "Penolakan formal dengan memo: tiap pelanggaran dirujuk ke baris dossier + angka reproduksi Lab 4. Dinkes mendapat penjelasan kenapa 95% tidak relevan.",
          nextStepId: "monitoring",
          consequenceNote:
            "Kabid awalnya kecewa — 'tapi 95%…'. Kamu tunjukkan Lab 4: buang satu kolom, 95,35% → 78,29%. Lalu bandingkan: aturan hujan > 100 mm memberi precision 0,80/recall 1,00 dengan lead time 7 minggu — transparan, gratis, dan bisa diaudit siapa pun. Ia mengerti — dan untuk pertama kalinya MEMAHAMI kenapa 'akurasi' tanpa definisi adalah angka kosong. Memo penolakanmu menjadi lampiran pengadaan.",
        },
        {
          id: "opt-audit",
          label: "Tunda & minta uji independen — 'boleh, jika lolos protokol kami'",
          rationale:
            "Beri kesempatan: vendor boleh diuji ulang ASALKAN tanpa fitur bocor, dengan split temporal, dan dievaluasi dengan precision/recall/lead time versi Dinkes. Syarat tertulis.",
          nextStepId: "monitoring",
          consequenceNote:
            "Vendor tidak pernah kembali dengan hasil uji independen — karena modelnya memang tidak dirancang untuk lolos protokol itu. Ketidakhadirannya adalah konfirmasi: klaim 95% hanya hidup di dalam metodologi mereka sendiri. Syarat tertulismu menjadi filter pengadaan yang bekerja bahkan saat kamu tidak ada di ruangan.",
        },
      ],
    },
  },
  {
    id: "monitoring",
    eyebrow: "Langkah 13 · Disiplin berjalan",
    title: "Sistem yang tidak dievaluasi = sistem yang mati",
    prose: [
      "Aturan peringatan bukan produk sekali-jadi. Disiplin berjalannya: (1) SETIAP musim hujan berakhir, hitung ulang precision/recall/lead time aturan terhadap onset yang terjadi — dengan catatan intervensi tiap peringatan; (2) ambang 100 mm ditinjau bila pola hujan bergeser (2 musim beruntun precision < 0,6 ATAU recall < 1,0 = pemicu review); (3) korelasi lag dihitung ulang tiap 2 tahun — bila puncak bergeser dari 7, rantai biologisnya berubah (mis. intervensi rutin menggeser dinamika) dan SOP harus ikut berubah.",
      "Dan satu prinsip yang mengikat semuanya: tidak ada angka sistem peringatan yang dilaporkan tanpa konteksnya — precision tanpa catatan false alarm, recall tanpa daftar wabah yang terlewat, akurasi tanpa daftar fitur. Angka tanpa konteks adalah brosur; angka dengan konteks adalah akuntabilitas.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan jadwal evaluasi tahunan sistem (apa dihitung, kapan, pemicu revisi apa)" },
      { id: "t2", text: "Tuliskan 3 pemicu kuantitatif untuk meninjau ulang ambang 100 mm" },
      { id: "t3", text: "Jawab: mengapa korelasi lag perlu dihitung ulang tiap 2 tahun?" },
    ],
    quiz: [
      {
        q: "Tiga musim berjalan, recall tetap 1,00 tetapi precision turun ke 0,50 (banyak false alarm, tak ada wabah terlewat). Diagnosis yang benar…",
        options: [
          { text: "Sistem membaik — tidak ada wabah yang lolos", why: "Salah — recall sempurna dengan precision 0,50 berarti separuh alarm adalah palsu. Itu bukan 'membaik', itu alarm yang berteriak terlalu sering.", correct: false },
          { text: "Alarm fatigue mengancam: audit apakah false alarm berkorelasi dengan intervensi yang berhasil; bila tidak, kalibrasi ulang ambang dengan data 3 musim — mungkin 110–120 mm", why: "Benar. Precision yang merosot = biaya operasional (anggaran fogging, kelelahan staf) tanpa manfaat. Kalibrasi ulang berbasis data, bukan firasat.", correct: true },
          { text: "Turunkan ambang ke 80 mm agar lebih sensitif", why: "Salah — masalahnya KELEBIHAN sensitivitas. Menurunkannya memperparah.", correct: false },
        ],
      },
    ],
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 14 · Deliverable",
    title: "Protokol peringatan dini untuk Kabid",
    prose: [
      "Semua angka sudah di tangan: 780 baris yang direkonsiliasi sampai selisih 0, lag 7 minggu (r = 0,63), aturan hujan > 100 mm (precision 0,80, recall 1,00, lead time 7 minggu), SOP 0–7 minggu, 5 pelanggaran vendor yang terdokumentasi, dan skema monitoring. Sekarang ubah menjadi SATU dokumen yang dibaca Kabid dan bisa dipertahankan di depan inspektorat: protokol peringatan dini DBD.",
      "Protokol yang baik menjawab: data apa yang dipakai (dan sebersih apa), aturan apa yang memicu (dan bagaimana ia dievaluasi), apa yang terjadi dalam 7 minggu setelah peringatan, mengapa vendor ditolak (dengan angka), dan bagaimana sistem dijaga tetap jujur.",
    ],
    tasks: [
      { id: "t1", text: "Tulis protokol ≤ 4 halaman mengikuti template" },
      { id: "t2", text: "Cantumkan angka kunci: lag, ambang, precision/recall/lead time, hasil audit vendor" },
      { id: "t3", text: "Tulis penolakan vendor (5 pelanggaran + angka Lab 4)" },
      { id: "t4", text: "Tulis skema monitoring & pemicu revisi ambang" },
    ],
    deliverable: {
      template: [
        "PARAGRAF 1 — DATA & KEBERSIHAN: tiga sumber, 780 baris direkonsiliasi (12 duplikat, minggu 55–56 hilang dicatat, 6 salah eja dibetulkan, selisih total 0). Nyatakan keterbatasan: tanpa data populasi, prioritas kecamatan belum final.",
        "PARAGRAF 2 — ATURAN & EVALUASI: lag 7 minggu (r = 0,63, dari korelasi silang lag 0–12); aturan 'hujan > 100 mm'; evaluasi retrospektif: 5 peringatan, TP=4, FP=1, precision 0,80, recall 1,00, lead time 7 minggu. Sertakan definisi TP yang dipakai.",
        "PARAGRAF 3 — OPERASIONAL: SOP 0–7 minggu (verifikasi → fogging → PSN → siaga puskesmas); format catatan peringatan; jadwal evaluasi akhir musim.",
        "PARAGRAF 4 — PENOLAKAN VENDOR: 5 pelanggaran terukur (leakage rawat_inap; akurasi 95,35% → 78,29% tanpa fitur bocor, gap 17,1pp; CV acak pada data temporal; evaluasi in-sample; lead time 1 minggu tak operasional) + rekomendasi: tolak / uji independen bersyarat.",
        "PARAGRAF 5 — DISIPLIN BERJALAN: evaluasi tiap akhir musim hujan; pemicu revisi ambang (precision < 0,6 atau recall < 1,0 dua musim beruntun); hitung ulang lag tiap 2 tahun.",
      ],
      rubric: [
        { criterion: "Data terekonsiliasi & keterbatasan dinyatakan", weight: 25, levels: ["Angka dikutip tanpa verifikasi", "Pembersihan disebut tanpa angka", "12 duplikat + 2 minggu hilang + 6 salah eja + selisih 0; keterbatasan populasi dinyatakan"] },
        { criterion: "Aturan peringatan terukur (bukan klaim)", weight: 25, levels: ["Aturan tanpa evaluasi", "Evaluasi tanpa definisi TP", "Lag 7 (r=0,63); ambang 100 mm; precision 0,80/recall 1,00/lead 7 minggu dengan definisi TP eksplisit"] },
        { criterion: "Audit vendor: 5 pelanggaran terukur", weight: 25, levels: ["Penolakan tanpa angka", "Sebagian pelanggaran tanpa bukti", "5 pelanggaran + reproduksi Lab 4 (gap 17,1pp) + rekomendasi tertulis"] },
        { criterion: "Operasional & monitoring konkret", weight: 25, levels: ["Tidak ada SOP lanjutan", "SOP tanpa timeline/pemicu", "SOP 0–7 minggu + format catatan + pemicu revisi kuantitatif"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 15 · Debrief",
    title: "Ground truth dibuka — dan cermin untuk angkamu sendiri",
    prose: [
      "Lima pelanggaran vendor tadi — semuanya versi 'profesional' dari jebakan yang sudah kamu hadapi sendiri di proyek ini:",
      "I1 — Fitur `rawat_inap` minggu berjalan = 0,85 × kasus minggu berjalan + noise: proksi target yang menyamar sebagai prediktor. Leakage bukan soal kecepatan data — soal urutan waktu.",
      "I2 — 95,35% → 78,29% saat satu kolom dibuang: gap 17,1 poin persentase. Seluruh 'kecanggihan' model = satu kolom bocor. Minta daftar fitur SEBELUM percaya angka akurasi.",
      "I3 — Cross-validation acak pada data deret waktu: masa depan bocor ke masa lalu lewat fold. Validasi temporal = train masa lalu, test masa depan. Tanpa kecuali.",
      "I4 — 'Evaluasi internal pada data historis': in-sample accuracy = ulangan dengan kunci jawaban di tangan. Standar minimum: periode yang benar-benar belum terlihat model.",
      "I5 — Lead time 1 minggu (bahkan brosurnya kontradiktif: klaim 'garansi 2 minggu'): peringatan tanpa waktu intervensi = waktu untuk panik. Nilai peringatan = akurasi × lead time yang bisa dipakai. Aturan hujan > 100 mm memberi 7 minggu — gratis.",
      "Dan cerminnya — untuk angkamu SENDIRI: precision 0,80, recall 1,00, lag 7 — semuanya angka LAB dari dataset sintetis. Mereka membuktikan metodologimu bekerja, bukan bahwa Makassar aman. Ground truth proyek ini: 5 event hujan ekstrem (minggu 27, 67, 89, 108, 115); 4 onset wabah (34, 74, 96, 122); aturan 100 mm → precision 0,80/recall 1,00/lead 7 minggu; vendor 95,35% vs 78,29%. Di dunia nyata, semua harus dihitung ulang tiap musim — karena sistem peringatan yang usang adalah sistem yang berbohong.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #4: model kompleks = model lebih baik",
      type: "risk",
      body: "Dashboard AI 95% vs aturan 'hujan > 100 mm' — yang pertama 'menang' jika yang dinilai hanya akurasinya. Tetapi sistem peringatan profesional tidak menilai akurasi sendirian: ia menilai precision/recall TERHADAP definisi wabah, lead time TERHADAP kebutuhan intervensi, dan transparansi TERHADAP audit. Aturan satu baris yang bisa diaudit siapa pun mengalahkan model 95% yang bocor — setiap saat. Di kariermu, setiap kali seseorang menyodorkan akurasi tinggi, pertanyaan pertamamu selalu sama: 'dengan fitur apa, divalidasi bagaimana, dan lead time-nya berapa?'",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 16 · Rangkuman",
    title: "Yang kamu bawa pulang",
    prose: [],
    tasks: [],
    summary: [
      "Data kotor adalah kondisi awal, bukan alasan: 780 baris laporan direkonsiliasi (12 duplikat, minggu 55–56 hilang dicatat, 6 salah eja) sampai selisih total vs sumber kebenaran = 0. Lubang data dicatat, bukan ditambal diam-diam.",
      "Lag hujan→kasus DIUKUR, bukan diasumsikan: korelasi silang lag 0–12 memuncak di lag 7 (r = 0,63) — konsisten dengan rantai biologis 6–8 minggu. Lag 0 yang datar justru menguatkan cerita.",
      "Aturan peringatan dievaluasi seperti klasifikasi: 'hujan > 100 mm' → 5 peringatan, TP=4, FP=1, precision 0,80, recall 1,00, lead time 7 minggu. Akurasi saja tidak cukup — wabah yang terlewat (FN) adalah kegagalan sistem.",
      "Ambang adalah pilihan filosofis yang terukur: 100 mm (recall 1,00, 1 false alarm) vs 150 mm (recall 0,50 — 2 wabah tanpa peringatan). Tidak ada ambang tanpa korban; yang ada hanya korban yang dipilih sadar.",
      "Lead time 7 minggu = anggaran intervensi: SOP 0–7 minggu (verifikasi → fogging → PSN → siaga puskesmas). False alarm yang memicu intervensi berhasil adalah keberhasilan yang tercatat sebagai FP — catat konteksnya.",
      "Audit vendor menemukan 5 pelanggaran terukur: leakage rawat_inap (proksi target), akurasi runtuh 95,35% → 78,29% (gap 17,1pp), CV acak pada data temporal, evaluasi in-sample, lead time 1 minggu yang tak operasional.",
      "Angka absolut bukan prioritas: Panakkukang 2.659 kasus tertinggi — tetapi tanpa populasi, incidence rate tak bisa dihitung. Laporkan angka, nyatakan keterbatasan.",
      "Disiplin berjalan: evaluasi tiap akhir musim; pemicu revisi ambang (precision < 0,6 atau recall < 1,0 dua musim beruntun); hitung ulang lag tiap 2 tahun.",
      "Deliverable-mu: protokol peringatan dini ≤ 4 halaman (data & keterbatasan, aturan & evaluasi, SOP, penolakan vendor berangka, monitoring) — dokumen yang siap dibaca Kabid dan dipertahankan di depan inspektorat.",
    ],
  },
];

(pjDbdSurveilans.steps as V2Step[]).push(...LANJUTAN_DBD_B, ...LANJUTAN_DBD_C);

import type { V2Mission } from "../lib/types";

// ── MISI Badai: Ketika Semua Korelasi Menuju Satu ─────────────────────────
// M1 — Market Risk Misi B (edge: data lebih kotor, sinyal konflik, ambiguitas).
// Dataset: FRED SP500 + VIXCLS + DGS10 harian 2019-01-01 s.d. 2021-06-30
// (data publik pemerintah federal AS), dibekukan 2026-10-15.
// File: public/misi/misi-stress-korelasi/pasar_stress.csv (598 baris).
// Metode: METODE.md.

const BASE = "/misi/misi-stress-korelasi";

export const misiStress: V2Mission = {
  slug: "misi-stress-korelasi",
  track: "Market Risk",
  module: "Misi",
  title: "Misi Badai: Ketika Semua Korelasi Menuju Satu",
  estMinutes: 150,
  role: "Analis risiko pasar senior",
  client:
    "Komite Risiko — verifikasi independen atas klaim desk trading bahwa portofolio “terlindungi” menjelang gejolak, di tengah sinyal yang saling bertentangan",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Lindung nilai yang katanya bekerja",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis risiko pasar senior — pemeriksa independen klaim desk",
        client:
          "Komite Risiko. Desk trading mengklaim portofolio ekuitas “terlindungi” oleh lindung nilai VIX dan akan baik-baik saja bila pasar bergejolak. Masalahnya: VIX baru saja menyentuh 82 — level panik — sementara catatan strategi desk bernada tenang. Komite tidak butuh opini; komite butuh angka: benarkah lindung nilai itu bekerja saat badai datang?",
        story: [
          "Kamis, 16:20. Kamu menerima dua dokumen yang tidak akur. Dokumen pertama: “Catatan Strategi” dari desk trading — tiga klaim yang menenangkan: korelasi SPX-VIX stabil, VIX tidak pernah melewati 60, penurunan Maret “terkonsentrasi dua hari”. Dokumen kedua: data mentah pasar — dan VIX di angka 82,69.",
          "Kamu sudah cukup lama di risiko untuk tahu polanya: catatan yang menenangkan + data yang panik = salah satunya bohong. Dan dalam krisis, yang berbohong biasanya bukan data.",
          "Misi ini lebih kotor dari misi VaR kemarin. Tiga seri pasar (S&P 500, VIX, yield 10-tahun AS) dari Januari 2019 sampai Juni 2021 — termasuk kejatuhan tercepat dalam sejarah Maret 2020. Tugasmu: ukur sendiri volatilitas, korelasi, dan drawdown-nya; uji tiga klaim desk satu per satu; putuskan apakah lindung nilai itu nyata atau dongeng; dan temukan sabotase di “Laporan Efektivitas Lindung Nilai” mereka.",
        ],
        objectives: [
          "Mengukur volatilitas terealisasi, korelasi SPX–VIX (tenang vs krisis), dan maximum drawdown dari data mentah tiga seri.",
          "Memverifikasi tiga klaim “Catatan Strategi” desk terhadap angka — klaim per klaim, dengan bukti.",
          "Menemukan 4 sabotase di Laporan Efektivitas Lindung Nilai dan menulis memo stress dengan rekomendasi eksposur.",
        ],
        prereqSummary:
          "Korelasi mengukur seberapa serempak dua hal bergerak (−1 sampai +1); dalam krisis, korelasi antar aset berisiko cenderung “menuju satu” — semuanya jatuh bersamaan, sehingga diversifikasi gagal tepat saat paling dibutuhkan. VIX adalah indeks ketakutan: naik tajam saat pasar panik. Drawdown = penurunan dari puncak ke lembah — ukuran “seberapa dalam lukanya”. Lindung nilai (hedge) hanya “bekerja” bila terbukti pada data krisis, bukan pada data tenang.",
        datasetNote:
          "Sumber: FRED, Federal Reserve Bank of St. Louis — data publik pemerintah federal AS.\nSeri: SP500 (S&P 500 harian), VIXCLS (VIX harian), DGS10 (yield obligasi 10-thn AS harian); 2019-01-01 s.d. 2021-06-30 → 598 baris gabungan (hanya tanggal yang ada di ketiga seri).\nKolom: tanggal, spx, spx_ret (imbal log %), vix, vix_chg (perubahan poin), y10, y10_chg (perubahan pp).\nKejujuran: angka mentah tanpa smoothing; tiga seri makro = proksi kondisi pasar, bukan portofolio spesifik. Metode: METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga seri, satu badai",
      prose: [
        "Satu file: `pasar_stress.csv`, 598 baris. Tiap baris = satu hari perdagangan dengan tiga wajah pasar: `spx` (harga indeks), `spx_ret` (imbal harian %), `vix` (level ketakutan), `vix_chg` (perubahan poin VIX), `y10` (yield obligasi 10-tahun %), `y10_chg`.",
        "Periode ini sengaja dipilih karena memuat dua rezim: 2019 yang tenang (VIX rata-rata belasan) dan Februari–April 2020 yang brutal. Semua analisis rezim di misi ini membandingkan keduanya — jangan pernah menghitung satu angka untuk seluruh periode lalu mengklaim itu “kondisi pasar”.",
        "Peringatan data room: kolom `vix_chg` dan `y10_chg` adalah PERUBAHAN (bisa negatif), bukan level. Salah membaca ini = salah membaca seluruh misi.",
      ],
      tasks: [
        { id: "t1", text: "Buka `pasar_stress.csv`: catat jumlah baris dan 7 kolomnya" },
        { id: "t2", text: "Catat: satuan `spx_ret` (%) vs `vix_chg` (poin) — kenapa keduanya tidak bisa dibandingkan langsung?" },
      ],
      note: {
        title: "Miskonsepsi #1: satu angka untuk semua rezim",
        type: "pitfall",
        body: "“Korelasi SPX-VIX = −0,83” — angka tunggal untuk 2,5 tahun yang memuat krisis terdalam dalam sejarah. Itu seperti bilang “suhu rata-rata pasien 37°C” padahal kemarin 41°C. Risiko hidup di REZIM, bukan di rata-rata. Misi ini memaksamu selalu bertanya: “angka ini untuk periode kapan?”",
      },
      reference:
        "pasar_stress.csv (598 baris). Rezim tenang = 2019; rezim krisis = 2020-02-20 s.d. 2020-04-30. Jangan campur keduanya tanpa label.",
    },
    {
      id: "lab-rezim",
      eyebrow: "Langkah 3 · Lab 1 — Anatomi badai",
      title: "Ukur paniknya dengan angka",
      prose: [
        "Bongkar data mentahnya. Dari `pasar_stress.csv`: (1) hari terburuk S&P 500 dan level VIX tertinggi — dua wajah hari yang sama; (2) korelasi imbal SPX vs perubahan VIX di rezim tenang (2019) dan rezim krisis (2020-02-20 s.d. 2020-04-30) — apakah “korelasi menuju satu” terjadi?; (3) volatilitas terealisasi 21-hari TERAKHIR (jendela 2021 yang tenang) sebagai pembanding.",
        "Catatan jujur sebelum kamu kaget: korelasi SPX–VIX memang negatif di kedua rezim (VIX naik saat pasar jatuh — itu definisinya). Yang berubah saat krisis bukan ARAHnya, melainkan MAGNITUDEnya: VIX bergerak +24 poin dalam sehari. Lindung nilai yang “bekerja secara korelasi” tetap bisa gagal secara ukuran.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`" },
        { id: "t2", text: "Hari terburuk SPX (`tgl_terburuk`, `ret_terburuk`) dan VIX tertinggi (`vix_max`)" },
        { id: "t3", text: "Korelasi SPX–VIX: `corr_tenang` (2019) vs `corr_krisis` (2020-02-20 s.d. 2020-04-30)" },
        { id: "t4", text: "Volatilitas 21-hari terakhir: `vol_terakhir` (std `spx_ret`, jendela 21, nilai terakhir)" },
      ],
      expected:
        "n=598; terburuk 2020-03-16 (−12,77%), VIX maks 82,69; corr tenang −0,856 vs krisis −0,800; vol 21-hari terakhir 0,54%",
      note: {
        title: "Miskonsepsi #2: korelasi negatif = lindung nilai aman",
        type: "pitfall",
        body: "Korelasi −0,86 terdengar seperti “VIX melindungi portofolio”. Tapi korelasi tidak bilang SEBERAPA BESAR gerakannya: saat SPX −12,77% sehari, VIX +24,86 poin — lindung nilai berukuran “normal” (dikalibrasi di masa tenang) tidak cukup menutup lubang sebesar itu. Inilah bedanya risiko ARAH vs risiko UKURAN — dan yang membunuh portofolio adalah ukuran.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url`; kolom tanggal string — bandingkan sebagai string \"2020-01-01\" (format YYYY-MM-DD aman untuk perbandingan leksikografis).",
        "Korelasi: `df[df[\"tanggal\"] < \"2020-01-01\"][\"spx_ret\"].corr(df[...][\"vix_chg\"])` — samakan filternya di kedua sisi.",
        "Volatilitas: `df[\"spx_ret\"].rolling(21).std().iloc[-1]`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-stress-korelasi/pasar_stress.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "",
          "i = df[\"spx_ret\"].idxmin()",
          "tgl_terburuk = ...",
          "ret_terburuk = ...",
          "vix_max = ...",
          "",
          "tenang = ...   # filter tanggal < \"2020-01-01\"",
          "krisis = ...   # filter 2020-02-20 s.d. 2020-04-30",
          "corr_tenang = ...",
          "corr_krisis = ...",
          "",
          "vol_terakhir = ...",
          "",
          "print(\"baris:\", n_baris)",
          "print(\"terburuk:\", tgl_terburuk, round(ret_terburuk, 2), \"| VIX maks:\", vix_max)",
          "print(\"corr tenang:\", round(corr_tenang, 4), \"| corr krisis:\", round(corr_krisis, 4))",
          "print(\"vol 21-hari terakhir:\", round(vol_terakhir, 4))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-stress-korelasi/pasar_stress.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "",
          "i = df[\"spx_ret\"].idxmin()",
          "tgl_terburuk = df.loc[i, \"tanggal\"]",
          "ret_terburuk = float(df.loc[i, \"spx_ret\"])",
          "vix_max = float(df[\"vix\"].max())",
          "",
          "tenang = df[df[\"tanggal\"] < \"2020-01-01\"]",
          "krisis = df[(df[\"tanggal\"] >= \"2020-02-20\") & (df[\"tanggal\"] <= \"2020-04-30\")]",
          "corr_tenang = float(tenang[\"spx_ret\"].corr(tenang[\"vix_chg\"]))",
          "corr_krisis = float(krisis[\"spx_ret\"].corr(krisis[\"vix_chg\"]))",
          "",
          "vol_terakhir = float(df[\"spx_ret\"].rolling(21).std().iloc[-1])",
          "",
          "print(\"baris:\", n_baris)",
          "print(\"terburuk:\", tgl_terburuk, round(ret_terburuk, 2), \"| VIX maks:\", vix_max)",
          "print(\"corr tenang:\", round(corr_tenang, 4), \"| corr krisis:\", round(corr_krisis, 4))",
          "print(\"vol 21-hari terakhir:\", round(vol_terakhir, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 598", name: "n_baris", value: 598, msg: "598 hari yang ada di ketiga seri." },
          { kind: "equal", task: "t2", label: "terburuk = 2020-03-16", name: "tgl_terburuk", value: "2020-03-16", msg: "16 Maret 2020." },
          { kind: "equal", task: "t2", label: "`vix_max` = 82,69", name: "vix_max", value: 82.69, tol: 0.01, msg: "Level VIX tertinggi — juga 16 Maret 2020." },
          { kind: "equal", task: "t3", label: "`corr_tenang` ≈ −0,856", name: "corr_tenang", value: -0.8563, tol: 0.005, msg: "Korelasi 2019 — filter tanggal < \"2020-01-01\" di KEDUA sisi corr." },
          { kind: "equal", task: "t3", label: "`corr_krisis` ≈ −0,800", name: "corr_krisis", value: -0.8, tol: 0.005, msg: "Korelasi 2020-02-20 s.d. 2020-04-30." },
          { kind: "equal", task: "t4", label: "`vol_terakhir` ≈ 0,54", name: "vol_terakhir", value: 0.5393, tol: 0.01, msg: "Std 21 hari TERAKHIR — bandingkan dengan hari-hari Maret 2020." },
        ],
      },
    },
    {
      id: "lab-drawdown",
      eyebrow: "Langkah 4 · Lab 2 — Seberapa dalam lukanya",
      title: "Drawdown: angka yang tidak bisa di-smoothing",
      prose: [
        "Volatilitas bicara tentang goyangan harian; drawdown bicara tentang LUKA: dari puncak 19 Februari 2020 ke lembah 23 Maret 2020, berapa persen nilai yang hilang — dan berapa lama? Hitung maximum drawdown seluruh periode, tanggal puncak & lembahnya, plus: berapa hari dalam sampel ini S&P jatuh lebih dari 5% dalam sehari.",
        "Drawdown adalah metrik kejujuran: ia tidak bisa disembunyikan di balik rata-rata, tidak bisa di-smoothing. Setiap klaim “terlindungi” harus bertahan menghadapi angka ini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `max_dd_pct` (negatif, %), `tgl_puncak`, `tgl_lembah`" },
        { id: "t2", text: "Hitung `n_hari_jatuh5` = hari dengan `spx_ret` < −5" },
      ],
      expected:
        "max drawdown −33,92% (puncak 2020-02-19 → lembah 2020-03-23); 6 hari jatuh >5%",
      hints: [
        "Puncak berjalan: `df[\"spx\"].cummax()`; drawdown = `df[\"spx\"]/puncak_berjalan - 1`.",
        "Lembah = indeks nilai drawdown minimum; puncak = tanggal harga maksimum SEBELUM lembah.",
        "Hari jatuh: `(df[\"spx_ret\"] < -5).sum()`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-stress-korelasi/pasar_stress.csv\"",
          "df = pd.read_csv(open_url(URL))",
          "",
          "# TUGASMU: lengkapi ... di bawah",
          "puncak_berjalan = ...",
          "drawdown = ...",
          "i = int(drawdown.idxmin())",
          "max_dd_pct = ...",
          "tgl_lembah = ...",
          "tgl_puncak = ...  # harga maksimum SEBELUM lembah",
          "n_hari_jatuh5 = ...",
          "",
          "print(\"max DD:\", round(max_dd_pct, 2), \"% |\", tgl_puncak, \"->\", tgl_lembah)",
          "print(\"hari jatuh >5%:\", n_hari_jatuh5)",
        ].join("\n"),
        lockLines: 6,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-stress-korelasi/pasar_stress.csv\"",
          "df = pd.read_csv(open_url(URL))",
          "",
          "# TUGASMU: lengkapi ... di bawah",
          "puncak_berjalan = df[\"spx\"].cummax()",
          "drawdown = df[\"spx\"]/puncak_berjalan - 1",
          "i = int(drawdown.idxmin())",
          "max_dd_pct = float(drawdown.iloc[i]*100)",
          "tgl_lembah = df.loc[i, \"tanggal\"]",
          "tgl_puncak = df.loc[:i][\"spx\"].idxmax()",
          "tgl_puncak = df.loc[tgl_puncak, \"tanggal\"]",
          "n_hari_jatuh5 = int((df[\"spx_ret\"] < -5).sum())",
          "",
          "print(\"max DD:\", round(max_dd_pct, 2), \"% |\", tgl_puncak, \"->\", tgl_lembah)",
          "print(\"hari jatuh >5%:\", n_hari_jatuh5)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`drawdown` terhitung", name: "drawdown", msg: "drawdown = spx/cummax(spx) - 1." },
          { kind: "equal", task: "t1", label: "`max_dd_pct` ≈ −33,92", name: "max_dd_pct", value: -33.92, tol: 0.05, msg: "Drawdown maksimum seluruh periode (negatif, dalam persen)." },
          { kind: "equal", task: "t1", label: "puncak = 2020-02-19", name: "tgl_puncak", value: "2020-02-19", msg: "Puncak = harga maksimum SEBELUM lembah, bukan maksimum global." },
          { kind: "equal", task: "t1", label: "lembah = 2020-03-23", name: "tgl_lembah", value: "2020-03-23", msg: "Lembah = indeks drawdown minimum." },
          { kind: "equal", task: "t2", label: "`n_hari_jatuh5` = 6", name: "n_hari_jatuh5", value: 6, msg: "Enam hari dengan kejatuhan >5% — “terkonsentrasi dua hari”? Tidak." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 5 · Lab 3 — Hari-hari panik",
      title: "Cluster kepanikan: kapan semuanya terjadi bersamaan",
      prose: [
        "Panik yang berbahaya bukan satu hari buruk — melainkan HARI-HARI buruk yang bergerombol, saat likuiditas kering dan tidak ada yang mau membeli. Saring hari-hari di mana S&P jatuh lebih dari 3% DAN VIX melonjak lebih dari 5 poin — lalu lihat polanya di kalender.",
        "Tabel `hari(tanggal TEXT, spx_ret REAL, vix_chg REAL)` — 14 baris kandidat. Tampilkan yang memenuhi kedua syarat, urut tanggal.",
      ],
      tasks: [
        { id: "t1", text: "Query hari panik: `spx_ret` < −3 DAN `vix_chg` > 5, urut tanggal" },
      ],
      expected: "11 baris — 8 di antaranya bergerombol Februari–April 2020",
      sqlLab: {
        task: "Temukan hari panik: spx_ret < -3 DAN vix_chg > 5. Tampilkan tanggal + spx_ret, urut dari tanggal terawal.",
        schema: "CREATE TABLE hari (tanggal TEXT, spx_ret REAL, vix_chg REAL);",
        seedData: [
          "INSERT INTO hari VALUES",
          "('2019-08-05',-3.02,6.98),",
          "('2020-02-24',-3.41,7.95),",
          "('2020-02-27',-4.52,11.6),",
          "('2020-03-05',-3.45,7.63),",
          "('2020-03-09',-7.9,12.52),",
          "('2020-03-11',-5.01,6.6),",
          "('2020-03-12',-9.99,21.57),",
          "('2020-03-16',-12.77,24.86),",
          "('2020-06-11',-6.08,13.22),",
          "('2020-09-03',-3.58,7.03),",
          "('2020-10-28',-3.59,6.93),",
          "('2020-01-08',-0.29,1.1),",
          "('2021-01-27',-2.57,4.2),",
          "('2021-05-12',-2.2,3.8);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT tanggal, spx_ret\nFROM hari\n",
        solution: [
          "SELECT tanggal, spx_ret",
          "FROM hari",
          "WHERE spx_ret < -3 AND vix_chg > 5",
          "ORDER BY tanggal;",
        ].join("\n"),
        expectedColumns: ["tanggal", "spx_ret"],
        expectedRows: [
          ["2019-08-05", -3.02],
          ["2020-02-24", -3.41],
          ["2020-02-27", -4.52],
          ["2020-03-05", -3.45],
          ["2020-03-09", -7.9],
          ["2020-03-11", -5.01],
          ["2020-03-12", -9.99],
          ["2020-03-16", -12.77],
          ["2020-06-11", -6.08],
          ["2020-09-03", -3.58],
          ["2020-10-28", -3.59],
        ],
        orderMatters: true,
      },
    },
    {
      id: "komentar-pasar",
      eyebrow: "Langkah 6 · Uji klaim",
      title: "Catatan Strategi vs data: tiga klaim, tiga vonis",
      prose: [
        "Sekarang buka “Catatan Strategi” dari desk — tiga klaim yang menenangkan itu. Kamu sudah memegang semua angka untuk mengadilinya. Untuk tiap klaim, tulis vonis BERDASARKAN hasil lab-mu (bukan opini): BENAR, SALAH, atau MENYESATKAN — beserta angka pembandingnya.",
        "Klaim 1: “Korelasi SPX–VIX stabil di −0,93 — lindung nilai kami bekerja konsisten.”",
        "Klaim 2: “VIX tidak pernah melewati 60 dalam periode ini — level panik tidak terjadi.”",
        "Klaim 3: “Penurunan Maret 2020 terkonsentrasi pada dua hari — di luar itu pasar normal.”",
      ],
      tasks: [
        { id: "t1", text: "Vonis Klaim 1 dengan angka korelasi tenang vs krisis dari Lab 1" },
        { id: "t2", text: "Vonis Klaim 2 dengan VIX maks dari Lab 1" },
        { id: "t3", text: "Vonis Klaim 3 dengan drawdown (Lab 2) dan hari panik (Lab 3)" },
      ],
      note: {
        title: "Miskonsepsi #3: nada tenang = analisis tenang",
        type: "pitfall",
        body: "Catatan strategi ditulis dengan bahasa yang meyakinkan — “stabil”, “tidak pernah”, “terkonsentrasi”. Bahasa bukan bukti. Di risiko pasar, setiap kata sifat dalam sebuah klaim harus bisa diganti dengan angka — dan angka itu harus bisa diverifikasi orang lain dari data mentah. Itulah yang baru saja kamu lakukan.",
      },
      reference:
        "Vonis yang benar: (1) MENYESATKAN — korelasi −0,86/−0,80, bukan −0,93; dan korelasi tidak menjamin ukuran lindung cukup. (2) SALAH — VIX 82,69. (3) SALAH — drawdown −33,92% sebulan penuh; 11 hari panik, 8 di antaranya Feb–Apr 2020.",
    },
  ],
};

export default misiStress;

// ── lanjutan misiStress: langkah 7–12 ────────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_STRESS: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Lindung nilai dongeng — eksposur mau diapakan?",
    prose: [
      "Tiga klaim desk runtuh semua. Lindung nilai VIX mereka dikalibrasi di masa tenang, tidak cukup besar untuk badai, dan laporannya — seperti akan kamu lihat — disabotase. Komite bertanya satu hal: dengan kondisi seperti ini, apa yang harus dilakukan terhadap eksposur ekuitas SEKARANG? Tidak ada opsi yang nyaman.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi eksposur apa yang kamu sampaikan ke Komite? (Keputusan final.)",
      options: [
        {
          id: "opt-hedge",
          label: "Tambah lindung nilai — tapi yang diukur ulang",
          rationale:
            "Krisis belum tentu selesai (VIX masih 40+). Tambah hedge VIX berukuran 3× dari kalibrasi tenang, dengan trigger lepas otomatis bila VIX < 25.",
          nextStepId: "temuan-hedge",
          consequenceNote:
            "Hedge tambahan memakan premi mahal selama 3 bulan — P&L desk tergerus. Tapi saat gelombang kedua datang (Oktober 2020, −3,59% sehari), portofolio bertahan. Komite mengingat siapa yang membayar premi saat semua orang bilang “sudah aman”.",
        },
        {
          id: "opt-tahan",
          label: "Tahan — pasar sudah menemukan dasarnya",
          rationale:
            "Drawdown −33,92% sudah dalam; stimulus moneter mengalir; menambah hedge di puncak ketakutan = membeli asuransi setelah rumah terbakar.",
          nextStepId: "temuan-tahan",
          consequenceNote:
            "Keputusanmu benar secara arah — pasar rebound. Tapi dua minggu kemudian volatilitas kembali (Juni: −6,08% sehari) dan tanpa hedge tambahan, portofolio ikut terseret penuh. “Benar secara arah, salah secara ukuran” — pelajaran klasik manajemen risiko.",
        },
        {
          id: "opt-kurangi",
          label: "Kurangi eksposur 30% sampai volatilitas normal",
          rationale:
            "Angka tidak mendukung “tenang”: 11 hari panik, korelasi menuju satu. Kurangi eksposur adalah satu-satunya lindung yang tidak bergantung pada model siapa pun.",
          nextStepId: "temuan-kurangi",
          consequenceNote:
            "Eksposur turun 30% tepat sebelum rebound April (+12% dalam sebulan). Desk kehilangan upside besar — dan kamu disalahkan. Tapi komite mencatat: keputusanmu satu-satunya yang tidak bergantung pada klaim desk yang terbukti bohong.",
        },
      ],
    },
  },
  {
    id: "temuan-hedge",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: tambah lindung nilai",
    prose: [
      "Komite menyetujui hedge tambahan berukuran 3×. Premi yang dibayar terasa mahal — tiga bulan P&L desk tergerus dan setiap rapat kamu ditanya “kapan hedge ini dilepas?”. Lalu Oktober 2020 datang: −3,59% dalam sehari, VIX melonjak lagi. Portofolio bertahan; hedge membayar dirinya sendiri dalam seminggu.",
      "Pelajaran: lindung nilai yang benar itu MAHAL dan TIDAK POPULER — karena dibeli saat semua orang merasa aman, dan dipertahankan saat semua orang bilang “buang-buang uang”. Kalau hedge-mu murah dan populer, kemungkinan besar ia tidak melindungi apa-apa.",
    ],
    tasks: [],
    note: {
      title: "Trigger lepas itu wajib",
      body: "Hedge tanpa trigger lepas = premi abadi. Kamu memasang “lepas otomatis bila VIX < 25” — tanpa itu, keputusan beranimu akan berubah menjadi beban permanen yang menggerogoti return tahunan.",
    },
  },
  {
    id: "temuan-tahan",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: tahan",
    prose: [
      "Arahmu benar — pasar memang rebound dari lembah 23 Maret. Tapi “benar secara arah” tidak sama dengan “aman”. Juni 2020: −6,08% dalam sehari, VIX +13,22 poin. Tanpa hedge tambahan, portofolio menelan penuh hari itu. Drawdown kedua −12% dari posisi “tahan”-mu.",
      "Ini jebakan paling umum di manajemen risiko: mengira “sudah di dasar” berarti “sudah aman”. Dasar adalah soal harga; aman adalah soal volatilitas — dan volatilitas masih 2–3× normal berbulan-bulan setelah lembah.",
    ],
    tasks: [],
    note: {
      title: "Bedakan call arah vs manajemen risiko",
      body: "“Pasar akan naik” adalah call arah (tugas manajer investasi). “Berapa besar luka bila salah” adalah manajemen risiko (tugasmu). Kamu boleh benar soal arah dan tetap gagal soal risiko — dan yang kedua itulah pekerjaanmu.",
    },
  },
  {
    id: "temuan-kurangi",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: kurangi eksposur",
    prose: [
      "Eksposur turun 30% — dan pasar rebound 12% di April. Di atas kertas kamu “salah”: portofolio kehilangan upside besar, dan lantai trading tidak akan melupakan siapa yang menyuruh jual di dasar. Tapi komite melihat hal lain: keputusanmu adalah satu-satunya yang TIDAK bergantung pada klaim desk yang terbukti bohong.",
      "Risiko bukan tentang memaksimalkan return; ini tentang bertahan hidup untuk bermain esok hari. Mengurangi eksposur saat model orang lain terbukti bohong bukanlah kepengecutan — itu satu-satunya keputusan yang sepenuhnya berada dalam kendalimu.",
    ],
    tasks: [],
    note: {
      title: "Biaya peluang adalah harga kejujuran",
      body: "Setiap keputusan risiko yang jujur punya biaya peluang yang terlihat (upside yang hilang) dan manfaat yang tidak terlihat (kebangkrutan yang tidak terjadi). Jangan biarkan yang terlihat menghapus yang tidak terlihat — catat keduanya di memo.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 14 baris: laporan lindung nilai yang “efektif”",
    prose: [
      "Misi audit. Di bawah ini 14 baris “Laporan Efektivitas Lindung Nilai — H1 2020” dari desk: klaim lindung nilai BEKERJA. Empat sabotase disuntikkan. Senjatamu: korelasi −0,86/−0,80 (bukan −0,93), VIX 82,69, drawdown −33,92%, 11 hari panik.",
    ],
    tasks: [],
    auditDossier: {
      version: "stress-m1b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Efektivitas Lindung Nilai H1 2020 yang menyatakan lindung nilai VIX BEKERJA dengan baik.",
      columns: ["Metrik", "Nilai laporan", "Periode"],
      rows: [
        { rowId: 1, cells: { "Metrik": "Korelasi SPX–VIX", "Nilai laporan": "−0,86", "Periode": "2019" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 2, cells: { "Metrik": "Korelasi SPX–VIX", "Nilai laporan": "−0,80", "Periode": "Feb–Apr 2020" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 3, cells: { "Metrik": "VIX tertinggi", "Nilai laporan": "82,69", "Periode": "2020-03-16" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 4, cells: { "Metrik": "Drawdown maks", "Nilai laporan": "−33,92%", "Periode": "19 Feb–23 Mar 2020" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I1: smoothing 60 hari ──
        { rowId: 5, cells: { "Metrik": "Korelasi SPX–VIX (laporan)", "Nilai laporan": "−0,93 stabil", "Periode": "2019–2020" }, claims: [{ label: "Metode", value: "Rata-rata gerak 60 hari, lalu korelasi" }] },
        // ── I2: hari krisis dikeluarkan ──
        { rowId: 6, cells: { "Metrik": "Sampel backtest hedge", "Nilai laporan": "540 hari", "Periode": "2019–2020" }, claims: [{ label: "Catatan", value: "9–18 Mar 2020 dikeluarkan (data libur)" }] },
        { rowId: 7, cells: { "Metrik": "Hari panik terdata", "Nilai laporan": "3 hari", "Periode": "2020" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I3: rasio lindung salah tanda ──
        { rowId: 8, cells: { "Metrik": "Rasio lindung VIX", "Nilai laporan": "−0,4× eksposur", "Periode": "Berjalan" }, claims: [{ label: "Arah", value: "Short VIX sebagai proteksi" }] },
        // ── I4: cherry-pick jendela ──
        { rowId: 9, cells: { "Metrik": "Return hedge", "Nilai laporan": "+18%", "Periode": "Apr–Jun 2020" }, claims: [{ label: "Kesimpulan", value: "Hedge efektif" }] },
        { rowId: 10, cells: { "Metrik": "Hari panik (audit)", "Nilai laporan": "11 hari", "Periode": "2019–2021" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 11, cells: { "Metrik": "Vol 21-hari terakhir", "Nilai laporan": "0,54%", "Periode": "Jun 2021" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 12, cells: { "Metrik": "Sumber data", "Nilai laporan": "FRED", "Periode": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 13, cells: { "Metrik": "Kesimpulan laporan", "Nilai laporan": "LINDUNG EFEKTIF", "Periode": "—" }, claims: [{ label: "Rekomendasi", value: "Pertahankan hedge berjalan" }] },
        { rowId: 14, cells: { "Metrik": "Ukuran hedge", "Nilai laporan": "1× kalibrasi 2019", "Periode": "Berjalan" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
      ],
      injections: [
        { key: "smoothing", rowIds: [5], title: "Korelasi dari seri yang di-smoothing", clue: "“Rata-rata gerak 60 hari, lalu korelasi” — smoothing 60 hari menghapus tepat anomali yang ingin diukur. Korelasi −0,93 yang “stabil” adalah artefak metode, bukan sifat pasar.", danger: "Metode yang menghaluskan data sebelum mengukur risiko = mengukur bayangan, bukan bendanya. Selalu tanya: dihitung dari data mentah atau yang sudah diolah?" },
        { key: "sampel-dikurangi", rowIds: [6, 7], title: "Hari krisis dikeluarkan dari sampel", clue: "“9–18 Mar 2020 dikeluarkan (data libur)” — padahal 9–18 Maret adalah hari-hari perdagangan TERSIBUK dalam sejarah (lihat 11 hari panik versimu). Mengeluarkan krisis dari backtest hedge = menguji payung di hari cerah.", danger: "Sampel yang membuang periode stres membuat SETIAP strategi terlihat aman. Aturan: backtest lindung nilai WAJIB mencakup episode stres." },
        { key: "tanda-rasio", rowIds: [8], title: "Rasio lindung salah tanda", clue: "“Short VIX sebagai proteksi” — VIX NAIK saat pasar jatuh; posisi SHORT VIX justru RUGI saat dibutuhkan. Proteksi yang benar = LONG VIX (atau ekuivalennya). Satu tanda minus = lindung nilai menjadi penambah risiko.", danger: "Salah tanda pada hedge = kamu membayar untuk memperbesar kerugianmu. Ini kesalahan yang pernah menenggelamkan dana sungguhan." },
        { key: "cherry-pick", rowIds: [9, 13], title: "Jendela cherry-pick + kesimpulan", clue: "Return +18% hanya untuk Apr–Jun 2020 (rebound) — lalu disimpulkan “LINDUNG EFEKTIF” untuk seluruh periode. Jendela dipilih setelah melihat hasilnya.", danger: "Cherry-picking jendela adalah cara paling sopan untuk berbohong dengan data benar. Selalu minta: tunjukkan jendela PENUH, termasuk yang buruk." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Memo stress untuk Komite Risiko",
    prose: [
      "Tulis memo stress satu halaman untuk Komite: apakah klaim desk bertahan, sabotase apa yang kamu temukan di laporan mereka, dan rekomendasi eksposurmu — lengkap dengan angka yang tidak bisa dibantah.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): vonis atas klaim “terlindungi” + angka kuncinya.",
        "Bukti rezim: korelasi tenang vs krisis, VIX maks, drawdown, hari panik — dengan tanggal.",
        "Vonis tiga klaim Catatan Strategi: tiap klaim + angka pembanding dari lab-mu.",
        "Temuan audit laporan: 4 sabotase di Laporan Efektivitas Lindung Nilai, baris per baris.",
        "Rekomendasi eksposur: rujuk keputusan Langkah 7 + trigger/ambang (kapan dievaluasi ulang).",
        "Batas: apa yang tidak dicakup (mis. proksi indeks ≠ portofolio aktual; korelasi ≠ kecukupan ukuran hedge).",
      ],
      rubric: [
        { criterion: "Kebenaran angka rezim", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian tepat", "Korelasi, VIX 82,69, drawdown −33,92%, 11 hari panik — semua tepat"] },
        { criterion: "Vonis klaim", weight: 20, levels: ["Klaim tidak diuji", "Diuji sebagian", "Ketiga klaim divonis dengan angka pembanding"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Sebagian tanpa baris bukti", "Keempat sabotase dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi", weight: 30, levels: ["Rekomendasi tanpa trigger evaluasi ulang", "Ada rekomendasi, trigger kabur", "Rekomendasi + trigger/ambang eksplisit + biaya peluang diakui"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di Laporan Efektivitas Lindung Nilai:",
      "1) **Smoothing 60 hari** (baris 5): korelasi −0,93 “stabil” dihitung dari seri yang dirata-ratakan 60 hari dulu. Smoothing menghapus spike — padahal spike itulah risikonya. Korelasi mentahmu: −0,86/−0,80.",
      "2) **Sampel dikurangi** (baris 6–7): 9–18 Maret 2020 “dikeluarkan (data libur)”. Itu bukan libur — itu 6 dari 11 hari panikmu, termasuk −12,77% dan VIX +24,86. Tanpa mereka, “3 hari panik” versi laporan.",
      "3) **Tanda rasio terbalik** (baris 8): short VIX “sebagai proteksi”. VIX naik saat pasar jatuh — short VIX = rugi saat krisis. Proteksi yang terbalik tanda bukan proteksi.",
      "4) **Cherry-pick** (baris 9, 13): +18% hanya Apr–Jun 2020 (rebound), lalu kesimpulan “LINDUNG EFEKTIF”. Jendela dipilih sesudah melihat hasil.",
      "Skor deteksimu (x/4) mengukur apakah kamu membaca METODEnya, bukan hanya angkanya. Dan pelajaran terbesar misi ini — yang membuatnya “edge”: dalam krisis, yang gagal bukan cuma model, tapi BAHASA. “Stabil”, “tidak pernah”, “terkonsentrasi” — kata-kata yang menenangkan, angka-angka yang panik. Tugas analis risiko senior adalah menerjemahkan bahasa menjadi angka, setiap saat.",
      "Bahaya nyata terakhir: Maret 2020, dana-dana dengan “lindung nilai” yang dikalibrasi di masa tenang menemukan bahwa hedge mereka menutupi 30% dari lubang 34%. Sisanya ditutup dengan... tidak ada apa-apa. Korelasi menuju satu bukan teori — itu tagihan.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #4 (bonus): lindung nilai = beli lalu lupa",
      type: "risk",
      body: "Hedge yang tidak diukur ulang tiap rezim = jimat, bukan instrumen. Kalibrasi 2019 untuk badai 2020 = payung kertas. Aturan praktis: ukuran hedge ditinjau tiap kali volatilitas terealisasi 2× dari asumsi kalibrasi.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Rezim dulu, rata-rata kemudian: korelasi SPX–VIX −0,86 (tenang) vs −0,80 (krisis); VIX maks 82,69; drawdown −33,92% (19 Feb → 23 Mar 2020); 11 hari panik.",
      "Korelasi negatif ≠ hedge cukup: yang membunuh adalah UKURAN gerakan (VIX +24,86 poin sehari), bukan arahnya.",
      "Tiga klaim desk runtuh oleh angka: korelasi bukan −0,93; VIX melewati 60; penurunan tidak “terkonsentrasi dua hari”.",
      "Empat sabotase laporan: smoothing sebelum korelasi, hari krisis dibuang dari sampel, rasio hedge salah tanda, jendela cherry-pick.",
      "Keputusan eksposur (tambah hedge / tahan / kurangi) selalu punya biaya peluang — catat trigger evaluasi ulangnya.",
      "Data: FRED SP500/VIXCLS/DGS10 harian 2019-01-01–2021-06-30 (data publik pemerintah federal AS), dibekukan 2026-10-15; proksi makro, bukan portofolio aktual.",
    ],
  },
];

(misiStress.steps as V2Step[]).push(...LANJUTAN_STRESS);

import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Atribusi: Model yang Mengklaim Semua Kredit ──────────────────────
// CAPSTONE kombinasi: Marketing Analytics × ML Engineer.
// Dataset SINTETIS 100% (seed 42) — BUKAN data asli. Perusahaan "PT Sinar
// Ritel" fiksi. File: public/misi/misi-gabung-atribusi-model/
// (kinerja_mingguan.csv, geo_experiment.csv, METODE.md).

const BASE = "/misi/misi-gabung-atribusi-model";

export const misiGabungAtribusi: V2Mission = {
  slug: "misi-gabung-atribusi-model",
  track: "Marketing Analytics",
  module: "Misi",
  title: "Misi Atribusi: Model yang Mengklaim Semua Kredit",
  estMinutes: 180,
  role: "Analis marketing analytics",
  client:
    "CMO PT Sinar Ritel (fiksi) — tim marketing mengklaim ROAS 4,2 dari atribusi last-touch, tim ML mengklaim model uplift memberi +15% incremental lift; CEO menuntut satu vonis sebelum alokasi budget Q4 Rp 12 miliar",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Dua klaim, satu budget",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis marketing analytics — penasihat pengukuran yang tidak memihak tim mana pun",
        client:
          "CMO PT Sinar Ritel (perusahaan fiksi). Rapat Q3 memanas: tim marketing memegang laporan atribusi last-touch — ROAS 4,2 — dan minta budget Q4 Rp 12 miliar dialokasikan mengikuti peta ROAS itu (Search dan Email jadi prioritas). Tim ML memegang model uplift yang katanya memberi +15% incremental lift, dan minta spend dinaikkan 15% mengikuti rekomendasi model. CEO memotong perdebatan: “Saya tidak mau dua presentasi. Saya mau satu vonis — angka mana yang benar, dan berapa rupiah yang boleh kita pertaruhkan.” Vonis itu tugasmu.",
        story: [
          "Kamis, 09:40. Kamu dipanggil ke ruang rapat lantai 21 — bukan untuk presentasi, melainkan untuk menjadi hakim. Di layar kiri: dashboard atribusi tim marketing, angka ROAS 4,2 berkedip hijau di semua channel. Di layar kanan: kurva lift model tim ML, +15% dengan interval kepercayaan yang rapi. Dua tim, dua metodologi, dua angka yang sama-sama “meyakinkan” — dan keduanya meminta keputusan yang berlawanan arah.",
          "Kamu pernah melihat pola ini: tiga kuartal lalu, sebuah channel “berkinerja terbaik” ternyata hanya menumpang musim liburan — budget digeser, revenue tidak bergerak. Sejak itu kamu punya prinsip: tidak ada angka yang dipercaya sebelum dihitung ulang dari data mentah, dan tidak ada model yang diskalakan sebelum lolos uji eksperimen.",
          "Pagi ini seseorang juga menyelipkan “Laporan Pengukuran Q3” ke mejamu — dokumen yang merangkum kedua klaim menjadi satu vonis siap tanda tangan. Kamu mencium sesuatu yang aneh dari presisinya. Misi ini: hitung ulang semuanya dari data mentah, uji modelnya terhadap eksperimen, putuskan alokasi budget — lalu audit laporan “siap tanda tangan” itu, karena vonis Rp 12 miliar tidak boleh ditandatangani buta.",
        ],
        objectives: [
          "Menghitung ulang ROAS per channel dari data mentah dan mengukur berapa besar inflasi akibat musiman (seasonality) pada atribusi last-touch.",
          "Menghitung incremental ROAS dari geo-experiment holdout sebagai ground truth kausal, lalu menguji apakah prediksi model uplift berkorelasi dengan hasil eksperimen.",
          "Memutuskan alokasi budget Q4 (tiga opsi bercabang dengan konsekuensi), menemukan 4 sabotase di Laporan Pengukuran Q3, dan menulis memo strategi pengukuran ber-rubrik.",
        ],
        prereqSummary:
          "Atribusi menjawab “kredit diberikan ke siapa” dari data observasi — ia TIDAK bisa membuktikan sebab-akibat: iklan yang muncul sebelum pembelian belum tentu menyebabkan pembelian itu. Eksperimen kausal (mis. geo holdout — iklan dimatikan di sebagian wilayah) mengukur efek incremental: konversi yang terjadi KARENA iklan, bukan yang memang akan terjadi. Uplift model = prediksi efek incremental per segmen; klaimnya hanya sahih bila model dilatih tanpa bocoran data pasca-treatment dan divalidasi terhadap HASIL EKSPERIMEN — bukan terhadap konversi mentah.",
        datasetNote:
          "Data 100% SINTETIS: dibangkitkan generator acak (numpy, seed 42) — BUKAN data perusahaan nyata, BUKAN data PT Sinar Ritel (fiksi).\nFile: kinerja_mingguan.csv — 96 baris (4 channel × 24 minggu): channel, minggu, spend_rp_jt, konversi_teratribusi (last-touch), nilai_teratribusi_rp_jt (Rp 250.000/konversi). File: geo_experiment.csv — 60 baris (5 pasang geo × 6 minggu × perlakuan/kontrol): pair_id, geo_id, grup, minggu, spend_rp_jt (spend search+social yang diuji; kontrol = 0), konversi, prediksi_uplift (prediksi model ML).\nMetode & batas jujur: file METODE.md di folder yang sama. Ground truth kausal diketahui HANYA karena data ini simulasi — di dunia nyata ia harus dibuktikan lewat eksperimen.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file, tiga cerita",
      prose: [
        "`kinerja_mingguan.csv` adalah bahan bakar klaim tim marketing: 96 baris, 4 channel (search, social, display, email) × 24 minggu. Kolom kuncinya `konversi_teratribusi` — hasil metode last-touch: setiap konversi dikreditkan ke channel sentuhan terakhir. Dari file inilah angka ROAS 4,2 dihitung — dan kamu akan menghitung ulangnya di Lab 1.",
        "`geo_experiment.csv` adalah senjata pengujimu: 60 baris dari eksperimen 6 minggu di 5 pasang wilayah. Di grup kontrol, spend search+social DIMATIKAN total (spend = 0); di grup perlakuan berjalan normal. Selisih konversi antar pasangan = efek incremental yang sebenarnya — ground truth yang tidak bisa dipalsukan oleh metode atribusi apa pun. Kolom `prediksi_uplift` berisi prediksi model tim ML untuk tiap geo-minggu: inilah yang akan kamu uji di Lab 2.",
        "Perhatikan baik-baik: dua file ini bercerita tentang DUNIA YANG SAMA tetapi dengan bahasa yang berbeda. File pertama berbicara dalam bahasa kredit (siapa dapat nama). File kedua berbicara dalam bahasa sebab-akibat (apa yang berubah karena iklan). Misi ini adalah tentang kapan kedua bahasa itu sepakat — dan kapan salah satunya berbohong.",
      ],
      tasks: [
        { id: "t1", text: "Buka kedua CSV: catat jumlah baris, kolom, dan rentang minggu di masing-masing file" },
        { id: "t2", text: "Di geo_experiment.csv: untuk satu pasang geo, bandingkan spend grup perlakuan vs kontrol — apa yang “dimatikan”?" },
      ],
      note: {
        title: "Miskonsepsi #1: angka di file = fakta yang netral",
        type: "pitfall",
        body: "“Datanya mentah, jadi objektif.” Tidak. Kolom `konversi_teratribusi` BUKAN observasi mentah — ia adalah HASIL sebuah metode (last-touch) yang sudah mengambil keputusan: mengkreditkan 100% konversi ke sentuhan terakhir dan 0% ke organik maupun sentuhan sebelumnya. File ini tidak berbohong tentang aritmetikanya, tetapi ia sudah “memihak” sebelum kamu membacanya. Data mentah yang jujur = kolom spend dan konversi total; kolom “teratribusi” = interpretasi yang menyamar sebagai data.",
      },
      reference:
        "kinerja_mingguan.csv (96 baris SINTETIS, seed 42) — bahan klaim ROAS 4,2; kolom konversi_teratribusi = output metode last-touch, bukan fakta kausal. geo_experiment.csv (60 baris SINTETIS) — ground truth eksperimental: kontrol = spend search+social dimatikan.",
    },
    {
      id: "teori-atribusi",
      eyebrow: "Langkah 3 · Teori — Lensa atribusi",
      title: "Siapa mendapat kredit?",
      prose: [
        "Lensa pertama: atribusi. Rumusnya sederhana dan memikat — ROAS (Return on Ad Spend) = nilai yang dikreditkan ke iklan dibagi spend iklan. Tim marketing menghitungnya per channel dari kolom `konversi_teratribusi`, dan hasilnya memang 4,2 secara keseluruhan. Aritmetikanya benar. Pertanyaannya bukan “apakah hitungannya benar”, melainkan “apakah yang dihitung itu memang disebabkan oleh iklan”.",
        "Di sinilah musiman (seasonality) menyusup. Bayangkan musim liburan: orang memang berbelanja lebih banyak — dengan atau tanpa iklan. Last-touch tidak peduli: setiap pembelian yang didahului satu klik iklan dikreditkan penuh ke iklan. Konversi organik yang “menumpang” klik itu tercatat sebagai kemenangan iklan. Hasilnya: ROAS membengkak tepat di minggu-minggu ketika iklan paling tidak berjasa.",
        "Contoh konkret dari data misi ini (kamu verifikasi di Lab 1): channel search mencatat ROAS 4,74 pada minggu normal — lalu 6,11 pada minggu 20–24 (musim liburan), SEMENTARA SPEND-NYA DATAR. Tidak ada tambahan rupiah iklan, tetapi “kinerjanya” naik 29%. Itu bukan kinerja; itu kalender.",
      ],
      tasks: [],
      formula: String.raw`\text{ROAS} = \frac{\text{nilai teratribusi}}{\text{spend}}`,
      formulaNote:
        "nilai teratribusi = konversi_teratribusi × Rp 250.000 (nilai per konversi di misi ini); spend = belanja iklan channel itu, satuan sama. Contoh: search — total nilai teratribusi Rp 5.408 juta dibagi spend Rp 1.075 juta = 5,03. Interpretasi jujur: “setiap Rp 1 spend dikaitkan dengan Rp 5,03 nilai” — kata kuncinya DIKAITKAN, bukan DISEBABKAN. ROAS atribusi mengukur korelasi yang diberi nama seolah kausalitas.",
    },
    {
      id: "teori-ml",
      eyebrow: "Langkah 4 · Teori — Lensa ML",
      title: "Siapa yang benar-benar terpengaruh?",
      prose: [
        "Lensa kedua: uplift. Model tim ML tidak memprediksi “siapa akan membeli” — ia mengklaim memprediksi “siapa yang MEMBELI KARENA IKLAN”. Secara formal itu selisih dua dunia: dunia di mana seseorang melihat iklan vs dunia di mana ia tidak. Selisih itulah efek incremental — dan ia tidak pernah teramati langsung pada individu yang sama, karena seseorang tidak bisa sekaligus melihat dan tidak melihat iklan.",
        "Karena efek incremental tidak teramati, model uplift dilatih dengan trik: membandingkan kelompok yang mirip. Trik ini runtuh total bila fitur training-nya BOCOR — yaitu mengandung informasi yang hanya ada SETELAH treatment terjadi. Contoh klasik: fitur “add-to-cart setelah klik iklan” atau “checkout initiated”. Model yang diberi fitur seperti itu tidak belajar “siapa terpengaruh iklan”; ia belajar “siapa yang sudah hampir checkout” — lalu mengklaimnya sebagai prediksi uplift. Validasi terhadap konversi mentah akan terlihat cantik (korelasi 0,9+), karena model itu pada dasarnya menebak siapa yang memang mau beli.",
        "Satu-satunya validasi yang sahih: bandingkan prediksi model dengan HASIL EKSPERIMEN. Geo-minggu yang modelnya memprediksi uplift besar harus menunjukkan selisih perlakuan−kontrol yang besar. Kalau korelasinya nol, model itu buta terhadap kausalitas — secantik apa pun angka validasinya.",
      ],
      tasks: [],
      formula: String.raw`\tau(x) = E[Y(1) - Y(0) \mid X = x]`,
      formulaNote:
        "τ(x) = uplift (efek incremental) untuk segmen berkarakteristik x; Y(1) = outcome bila diberi iklan; Y(0) = outcome bila tidak; X = fitur pra-treatment (boleh dipakai), BUKAN fitur pasca-klik (bocor). Contoh: bila model memprediksi τ = 40 konversi untuk sebuah geo-minggu, artinya model mengklaim iklan MENAMBAH 40 konversi di sana — klaim yang hanya bisa diuji dengan membandingkan geo perlakuan vs kontrolnya, bukan dengan melihat total konversinya.",
      echart: {
        option: {
          title: { text: "Nilai teratribusi vs spend, mingguan (Rp juta)" },
          tooltip: { trigger: "axis" },
          legend: { data: ["nilai teratribusi", "spend"] },
          xAxis: {
            type: "category",
            data: ["M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","M13","M14","M15","M16","M17","M18","M19","M20","M21","M22","M23","M24"],
          },
          yAxis: { type: "value", name: "Rp juta" },
          series: [
            {
              name: "spend",
              type: "bar",
              data: [104.4,109.2,103.9,110.0,102.5,108.8,104.8,107.7,107.5,101.7,103.3,106.0,101.3,107.4,99.1,111.2,102.9,108.5,103.2,99.7,106.6,109.2,107.3,103.0],
            },
            {
              name: "nilai teratribusi",
              type: "line",
              data: [409.0,414.0,425.4,429.8,408.1,425.5,403.3,425.8,413.1,404.3,410.5,399.5,408.9,435.9,413.7,408.1,394.0,406.9,437.0,551.6,565.8,579.2,544.8,527.2],
              markArea: { data: [[{ xAxis: "M20" }, { xAxis: "M24" }]] },
            },
          ],
        },
        caption:
          "Cara membaca: sumbu X = minggu 1–24; batang = total spend semua channel (Rp juta); garis = total nilai teratribusi (Rp juta); area berbayang = minggu 20–24 (musim liburan). Interpretasi: spend DATAR sepanjang 24 minggu, tetapi nilai teratribusi MELONJAK ~35% tepat di area berbayang. Iklan tidak bekerja lebih keras di minggu 20–24 — kalender yang bekerja. Inilah inflasi musiman yang diklaim dossier “sudah dinetralkan”.",
      },
      note: {
        title: "Miskonsepsi #2: korelasi prediksi–konversi 0,91 = model bagus",
        type: "pitfall",
        body: "“Model kami tervalidasi — korelasi prediksi vs konversi aktual 0,91!” Itu validasi untuk model PREDIKSI KONVERSI, bukan model uplift. Model yang diberi fitur pasca-klik (add-to-cart, checkout initiated) WAJIB berkorelasi tinggi dengan konversi — ia membaca jejak orang yang sudah hampir beli. Pertanyaan uplift bukan “apakah prediksinya dekat dengan konversi”, melainkan “apakah prediksinya dekat dengan SELISIH perlakuan−kontrol”. Di misi ini jawabannya: 0,01. Modelnya bukan jelek dalam memprediksi — ia salah alamat total dalam mengklaim.",
      },
    },
    {
      id: "lab-roas",
      eyebrow: "Langkah 5 · Lab 1 — Hitung ulang ROAS",
      title: "Angkanya benar. Maknanya yang bohong.",
      prose: [
        "Waktunya menjadi mesin hitung yang tidak bisa dibujuk. Tugas lab ini tiga lapis: (1) hitung ulang ROAS total dan per channel dari `kinerja_mingguan.csv` — verifikasi apakah klaim 4,2 memang cocok dengan data mentah; (2) belah ROAS search menjadi minggu normal (1–19) vs musim liburan (20–24) — ukur inflasi musimannya; (3) hitung incremental ROAS dari `geo_experiment.csv` — selisih perlakuan−kontrol per pasang geo, lalu nilai incremental dibagi spend. Inilah momen kebenaran: satu angka dari bahasa kredit, satu angka dari bahasa sebab-akibat.",
        "Catatan: `selisih_musiman` yang kamu hitung adalah amunisi untuk audit — dossier mengklaim angka search “sudah dinetralkan dari efek musiman”. Data mentah akan bersaksi sebaliknya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `roas_total` dan `roas_search` dari data mentah" },
        { id: "t2", text: "Hitung `roas_search_normal`, `roas_search_holiday`, dan `selisih_musiman`" },
        { id: "t3", text: "Dari geo_experiment: hitung `incr_roas`, `lift_pct`, dan `ci95_halfwidth_pp`" },
      ],
      expected:
        "ROAS total 4,21 (klaim cocok — aritmetika benar); ROAS search 5,03, tetapi 4,74 di minggu normal vs 6,11 di musim liburan (selisih 1,37 dengan spend datar); incremental ROAS dari eksperimen hanya 2,47 — lift +19,0% ±2,2 pp. Kesimpulan sementara: klaim 4,2 benar dihitung, salah dimaknai.",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "ROAS per baris: `df[\"roas\"] = df[\"nilai_teratribusi_rp_jt\"] / df[\"spend_rp_jt\"]`; ROAS total = jumlah nilai / jumlah spend (rata-rata TERTIMBANG, bukan rata-rata kolom roas).",
        "Belah search: `s = df[df[\"channel\"] == \"search\"]`, lalu saring `s[s[\"minggu\"] < 20]` vs `s[s[\"minggu\"] >= 20]`.",
        "Eksperimen: set index [\"pair_id\",\"minggu\"] untuk perlakuan & kontrol, `lift = t[\"konversi\"] - c[\"konversi\"]`; incr_roas = (lift.sum() * 250_000 / 1e6) / t[\"spend_rp_jt\"].sum().",
        "CI 95%: `se = lift.std(ddof=1) / np.sqrt(len(lift))` — butuh `import numpy as np`; ubah ke poin persen terhadap rata-rata konversi kontrol.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-atribusi-model/kinerja_mingguan.csv\"",
          "URL_GEO = \"/misi/misi-gabung-atribusi-model/geo_experiment.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "df[\"roas\"] = ...  # nilai_teratribusi_rp_jt / spend_rp_jt",
          "roas_total = ...    # jumlah nilai / jumlah spend (tertimbang!)",
          "s = df[df[\"channel\"] == \"search\"]",
          "roas_search = ...   # tertimbang, khusus search",
          "",
          "roas_search_normal = ...    # minggu < 20",
          "roas_search_holiday = ...   # minggu >= 20",
          "selisih_musiman = ...",
          "",
          "import numpy as np",
          "geo = pd.read_csv(open_url(URL_GEO))",
          "t = geo[geo[\"grup\"] == \"perlakuan\"].set_index([\"pair_id\", \"minggu\"])",
          "c = geo[geo[\"grup\"] == \"kontrol\"].set_index([\"pair_id\", \"minggu\"])",
          "lift = ...  # konversi perlakuan - konversi kontrol, pasangan yg sama",
          "se = lift.std(ddof=1) / np.sqrt(len(lift))",
          "incr_roas = ...          # (lift.sum() * 250_000 / 1e6) / t[\"spend_rp_jt\"].sum()",
          "lift_pct = ...           # 100 * lift.mean() / c[\"konversi\"].mean()",
          "ci95_halfwidth_pp = ...  # 100 * 1.96 * se / c[\"konversi\"].mean()",
          "",
          "print(\"ROAS total:\", round(roas_total, 2))",
          "print(\"ROAS search:\", round(roas_search, 2), \"| normal:\", round(roas_search_normal, 2), \"| liburan:\", round(roas_search_holiday, 2))",
          "print(\"Incremental ROAS (eksperimen):\", round(incr_roas, 2))",
          "print(\"Lift:\", round(lift_pct, 1), \"% ±\", round(ci95_halfwidth_pp, 1), \"pp (CI 95%)\")",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-atribusi-model/kinerja_mingguan.csv\"",
          "URL_GEO = \"/misi/misi-gabung-atribusi-model/geo_experiment.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "df[\"roas\"] = df[\"nilai_teratribusi_rp_jt\"] / df[\"spend_rp_jt\"]",
          "roas_total = df[\"nilai_teratribusi_rp_jt\"].sum() / df[\"spend_rp_jt\"].sum()",
          "s = df[df[\"channel\"] == \"search\"]",
          "roas_search = s[\"nilai_teratribusi_rp_jt\"].sum() / s[\"spend_rp_jt\"].sum()",
          "",
          "roas_search_normal = s[s[\"minggu\"] < 20][\"nilai_teratribusi_rp_jt\"].sum() / s[s[\"minggu\"] < 20][\"spend_rp_jt\"].sum()",
          "roas_search_holiday = s[s[\"minggu\"] >= 20][\"nilai_teratribusi_rp_jt\"].sum() / s[s[\"minggu\"] >= 20][\"spend_rp_jt\"].sum()",
          "selisih_musiman = roas_search_holiday - roas_search_normal",
          "",
          "import numpy as np",
          "geo = pd.read_csv(open_url(URL_GEO))",
          "t = geo[geo[\"grup\"] == \"perlakuan\"].set_index([\"pair_id\", \"minggu\"])",
          "c = geo[geo[\"grup\"] == \"kontrol\"].set_index([\"pair_id\", \"minggu\"])",
          "lift = t[\"konversi\"] - c[\"konversi\"]",
          "se = lift.std(ddof=1) / np.sqrt(len(lift))",
          "incr_roas = (lift.sum() * 250_000 / 1e6) / t[\"spend_rp_jt\"].sum()",
          "lift_pct = 100 * lift.mean() / c[\"konversi\"].mean()",
          "ci95_halfwidth_pp = 100 * 1.96 * se / c[\"konversi\"].mean()",
          "",
          "print(\"ROAS total:\", round(roas_total, 2))",
          "print(\"ROAS search:\", round(roas_search, 2), \"| normal:\", round(roas_search_normal, 2), \"| liburan:\", round(roas_search_holiday, 2))",
          "print(\"Incremental ROAS (eksperimen):\", round(incr_roas, 2))",
          "print(\"Lift:\", round(lift_pct, 1), \"% ±\", round(ci95_halfwidth_pp, 1), \"pp (CI 95%)\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame kinerja_mingguan.csv." },
          { kind: "equal", task: "t1", label: "`roas_total` = 4,21", name: "roas_total", value: 4.21, tol: 0.02, msg: "Jumlah nilai / jumlah spend = 4,21 — klaim tim marketing cocok dengan data mentah." },
          { kind: "equal", task: "t1", label: "`roas_search` = 5,03", name: "roas_search", value: 5.03, tol: 0.05, msg: "Search: total nilai / total spend channel itu (tertimbang, bukan rata-rata kolom roas)." },
          { kind: "equal", task: "t2", label: "`selisih_musiman` = 1,37", name: "selisih_musiman", value: 1.37, tol: 0.15, msg: "ROAS search 6,11 (liburan) − 4,74 (normal) dengan spend datar = inflasi musiman murni." },
          { kind: "equal", task: "t3", label: "`incr_roas` = 2,47", name: "incr_roas", value: 2.47, tol: 0.08, msg: "Incremental ROAS dari eksperimen: nilai lift dibagi spend perlakuan. Jauh di bawah 4,21." },
          { kind: "equal", task: "t3", label: "`ci95_halfwidth_pp` = 2,2", name: "ci95_halfwidth_pp", value: 2.2, tol: 0.4, msg: "Lebar CI 95% lift ≈ ±2,2 poin persen — simpan angka ini untuk audit (dossier mengklaim ±0,8%)." },
        ],
      },
    },
    {
      id: "lab-uplift",
      eyebrow: "Langkah 6 · Lab 2 — Uji model uplift",
      title: "Cantik di validasi, buta di eksperimen",
      prose: [
        "Sekarang giliran klaim tim ML. Model mereka membanggakan korelasi 0,91 antara prediksi dan konversi aktual — angka yang memang akan kamu replikasi di lab ini. Lalu uji yang sebenarnya: untuk tiap geo-minggu perlakuan, hitung lift aktual (konversi perlakuan − konversi kontrol pasangannya), dan korelasikan DENGAN PREDIKSI MODEL. Inilah ujian yang tidak bisa dilewati dengan fitur bocor.",
        "Dua korelasi, dua cerita. Yang pertama mengukur “bisakah model menebak siapa membeli”. Yang kedua mengukur “bisakah model menebak siapa yang membeli KARENA iklan”. Model uplift yang sah hanya peduli pada yang kedua.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lift_aktual` per geo-minggu (perlakuan − kontrol pasangan yang sama)" },
        { id: "t2", text: "Hitung `corr_pred_conv` dan `corr_pred_lift`; bandingkan keduanya" },
      ],
      expected:
        "korelasi prediksi vs konversi = 0,912 (klaim 0,91 terkonfirmasi — dan tidak berarti apa-apa); korelasi prediksi vs lift aktual = 0,013 ≈ nol. Vonis: model memprediksi SIAPA membeli, bukan SIAPA yang terpengaruh iklan — pola khas leakage fitur post-treatment (add-to-cart pasca-klik, checkout initiated).",
      hints: [
        "Set index [\"pair_id\",\"minggu\"] seperti Lab 1 agar pengurangan sejajar pasangan: `t[\"konversi\"] - c[\"konversi\"]`.",
        "Korelasi: `t[\"prediksi_uplift\"].corr(t[\"konversi\"])` dan `.corr(t[\"lift_aktual\"])`.",
        "Jangan lupa `.copy()` setelah set_index bila menambah kolom baru — menghindari SettingWithCopyWarning.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_GEO = \"/misi/misi-gabung-atribusi-model/geo_experiment.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "geo = pd.read_csv(open_url(URL_GEO))",
          "",
          "t = geo[geo[\"grup\"] == \"perlakuan\"].set_index([\"pair_id\", \"minggu\"]).copy()",
          "c = geo[geo[\"grup\"] == \"kontrol\"].set_index([\"pair_id\", \"minggu\"])",
          "t[\"lift_aktual\"] = ...  # konversi perlakuan - konversi kontrol pasangan yg sama",
          "",
          "corr_pred_conv = ...  # prediksi_uplift vs konversi",
          "corr_pred_lift = ...  # prediksi_uplift vs lift_aktual",
          "",
          "print(\"korelasi prediksi vs konversi:\", round(corr_pred_conv, 3))",
          "print(\"korelasi prediksi vs lift aktual:\", round(corr_pred_lift, 3))",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_GEO = \"/misi/misi-gabung-atribusi-model/geo_experiment.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "geo = pd.read_csv(open_url(URL_GEO))",
          "",
          "t = geo[geo[\"grup\"] == \"perlakuan\"].set_index([\"pair_id\", \"minggu\"]).copy()",
          "c = geo[geo[\"grup\"] == \"kontrol\"].set_index([\"pair_id\", \"minggu\"])",
          "t[\"lift_aktual\"] = t[\"konversi\"] - c[\"konversi\"]",
          "",
          "corr_pred_conv = t[\"prediksi_uplift\"].corr(t[\"konversi\"])",
          "corr_pred_lift = t[\"prediksi_uplift\"].corr(t[\"lift_aktual\"])",
          "",
          "print(\"korelasi prediksi vs konversi:\", round(corr_pred_conv, 3))",
          "print(\"korelasi prediksi vs lift aktual:\", round(corr_pred_lift, 3))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`lift_aktual` terhitung", name: "t", msg: "t harus memuat kolom lift_aktual hasil pengurangan sejajar pasangan." },
          { kind: "equal", task: "t2", label: "`corr_pred_conv` = 0,912", name: "corr_pred_conv", value: 0.912, tol: 0.02, msg: "Korelasi prediksi vs konversi memang tinggi — inilah angka “validasi” yang dibanggakan tim ML." },
          { kind: "equal", task: "t2", label: "`corr_pred_lift` ≈ 0,01", name: "corr_pred_lift", value: 0.013, tol: 0.08, msg: "Korelasi prediksi vs lift aktual ≈ nol — model buta total terhadap kausalitas. Inilah vonisnya." },
        ],
      },
    },
  ],
};

export default misiGabungAtribusi;

// ── lanjutan: keputusan bercabang → audit → deliverable → debrief ─────────

const LANJUTAN_ATRIBUSI: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Ke mana Rp 12 miliar pergi?",
    prose: [
      "Bukti di tangan: ROAS atribusi 4,21 (benar dihitung, terinflasi musiman — search 4,74 vs 6,11), incremental ROAS eksperimen 2,47, dan model uplift yang korelasinya 0,01 terhadap lift aktual. CEO menunggu vonis. Peta keputusan 10 detik sebelum kamu memilih: (1) klaim tanpa ground truth eksperimental → JANGAN jadikan dasar alokasi; (2) model tanpa validasi terhadap eksperimen → JANGAN diskalakan; (3) bila ragu antara dua klaim yang sama-sama rapuh → beli buktinya dulu, bukan asetnya.",
      "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut, dan tidak ada opsi yang gratis.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Vonis apa yang kamu sampaikan ke CEO untuk alokasi budget Q4 Rp 12 miliar?",
      options: [
        {
          id: "opt-atribusi",
          label: "Percaya atribusi — alokasikan mengikuti peta ROAS last-touch (Search & Email prioritas)",
          rationale:
            "ROAS 4,2 terverifikasi dari data mentah; search 5,03 dan email 11,04 adalah channel paling efisien. Eksperimen hanya 5 geo kecil — terlalu sempit untuk mengalahkan 24 minggu data nasional.",
          nextStepId: "kons-atribusi",
          consequenceNote:
            "Q4 berjalan: musim liburan usai, ROAS search anjlok ke ~3 dan email kembali ke ~5 — revenue tidak naik sebanding spend. Rp miliar terbuang untuk membayar “kredit” yang sebenarnya milik kalender, bukan iklan.",
        },
        {
          id: "opt-model",
          label: "Percaya model — naikkan spend 15% mengikuti rekomendasi uplift (+15% lift)",
          rationale:
            "Model tervalidasi dengan korelasi 0,91 — jauh lebih canggih dari atribusi last-touch yang kuno. Uplift +15% berarti setiap rupiah tambahan menghasilkan lebih.",
          nextStepId: "kons-model",
          consequenceNote:
            "Spend +15% dibelanjakan; lift aktual NOL. Model hanya menemukan “orang yang memang mau beli” via fitur pasca-klik — menaikkan spend berdasarkan model bocor = membakar uang dengan presisi statistik.",
        },
        {
          id: "opt-eksperimen",
          label: "Eksperimen dulu — tahan alokasi 6 minggu, jalankan geo holdout yang benar (cakup musim liburan)",
          rationale:
            "Kedua klaim rapuh: atribusi terinflasi musiman, model gagal uji eksperimen. Satu-satunya angka yang punya ground truth adalah incremental ROAS 2,47 — dan itu pun dari 6 minggu di luar musim. Beli buktinya dulu.",
          nextStepId: "kons-eksperimen",
          consequenceNote:
            "Keputusan tertunda 6 minggu — biaya peluang nyata, CEO tidak senang menunggu. Tetapi vonis berikutnya berbasis bukti: incremental ROAS 2,47, model dinyatakan tidak valid, alokasi Q4 ditulis ulang. Dua klaim palsu gagal menelan Rp 12 miliar.",
        },
      ],
    },
  },
  {
    id: "kons-atribusi",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: percaya atribusi",
    prose: [
      "Memo terkirim: budget Q4 mengikuti peta ROAS — Search 40%, Email 25%, sisanya Social dan Display. Kuartal berjalan. Januari: musim liburan usai, ROAS search longsor dari 6,11 ke ~3, email dari 11,04 ke ~5. Revenue tidak naik sebanding spend — karena “kinerja” yang kamu beli adalah kinerja kalender Oktober–Desember, bukan kinerja iklan.",
      "Di rapat evaluasi, CMO bertanya kenapa angka tidak mereplikasi. Jawaban yang tidak bisa kamu ucapkan dengan nyaman: karena angka yang kamu alokasikan tidak pernah mengukur sebab-akibat sejak awal. Atribusi last-touch menjawab “siapa dapat kredit”, dan kamu memakainya untuk menjawab “ke mana uang harus pergi” — dua pertanyaan berbeda dengan jawaban yang kebetulan mirip di musim liburan.",
    ],
    tasks: [],
    note: {
      title: "Harga sebuah kredit yang salah alamat",
      body: "Selisih ROAS atribusi (4,21) vs incremental (2,47) pada budget Rp 12 miliar ≈ Rp 5 miliar nilai yang “diharapkan” tetapi tidak pernah ada. Itu bukan biaya iklan yang buruk — itu biaya memakai metrik yang salah untuk keputusan alokasi.",
    },
  },
  {
    id: "kons-model",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: percaya model",
    prose: [
      "Memo terkirim: spend naik 15% mengikuti rekomendasi uplift, dengan proyeksi +15% incremental lift. Enam minggu kemudian angkanya masuk: konversi naik persis sebesar baseline musiman — lift incremental NOL. Model memprediksi dengan tepat siapa yang membeli, dan gagal total memprediksi siapa yang membeli KARENA iklan.",
      "Audit fitur yang terlambat: `add_to_cart_pasca_klik`, `checkout_initiated` — model itu tidak pernah belajar kausalitas; ia belajar membaca jejak orang yang sudah hampir checkout, lalu menjualnya sebagai “uplift”. Korelasi validasi 0,91 adalah cermin, bukan jendela: ia memantulkan masa lalu, bukan meneropong efek iklan.",
    ],
    tasks: [],
    note: {
      title: "Leakage tidak terlihat dari metrik validasi",
      body: "Inilah yang membuat leakage mematikan: semua metrik konvensional (korelasi, AUC, MAE terhadap konversi) terlihat BAGUS — bahkan lebih bagus dari model yang jujur. Satu-satunya tes yang menangkapnya adalah validasi terhadap eksperimen, tes yang tim ML lewati.",
    },
  },
  {
    id: "kons-eksperimen",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: eksperimen dulu",
    prose: [
      "Memo terkirim — dan CEO tidak senang: “Kita bayar analis untuk vonis, bukan untuk menunda.” Enam minggu holdout yang benar berjalan, mencakup awal musim liburan. Hasilnya dingin dan jelas: incremental ROAS stabil di ~2,4, model uplift dinyatakan tidak valid dan ditarik dari produksi, dan klaim “sudah dinetralkan dari musiman” terbukti fiktif.",
      "Alokasi Q4 ditulis ulang berbasis bukti: budget mengikuti incremental, bukan atribusi; 15% kenaikan spend DIBATALKAN; dana yang “dihemat” dari dua klaim palsu dialihkan ke eksperimen lanjutan. Keputusan ini tidak memenangkan tepuk tangan di rapat — ia memenangkan sesuatu yang lebih mahal: tidak membakar Rp 12 miliar.",
    ],
    tasks: [],
    note: {
      title: "Menunda juga sebuah keputusan — dengan harga",
      body: "Opsi ini bukan tanpa biaya: 6 minggu peluang, kepercayaan CEO yang terkikis sementara, dan tim yang menunggu. Bedanya: biayanya TERLIHAT dan TERUKUR — tidak seperti biaya vonis yang salah, yang baru terlihat setelah uang hangus.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 7 baris: laporan yang siap ditandatangani itu berbohong 4 kali",
    prose: [
      "Sebelum menulis memo final, satu misi audit. Di bawah ini “Laporan Pengukuran Q3 — siap tanda tangan”, dokumen yang diselipkan ke mejamu pagi ini. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil kedua lab-mu — ROAS 4,21 vs incremental 2,47, selisih musiman 1,37, korelasi model 0,91 vs 0,01, dan CI lift ±2,2 pp.",
      "Cara kerja: untuk setiap baris yang mencurigakan, hitung ulang dari data MENTAH (bukan dari angka dossier) dan lihat di mana mereka berbohong — pada angka, pada klaim, atau pada keduanya.",
    ],
    tasks: [],
    auditDossier: {
      version: "atribusi-model-cap1-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Pengukuran Q3 final — dasar alokasi budget Rp 12 miliar, “siap tanda tangan”. Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
      columns: ["No", "Item", "Spend (Rp jt)", "Konversi Teratribusi", "ROAS / Metrik Klaim", "Klaim"],
      rows: [
        { rowId: 1, cells: { "No": "1", "Item": "Search", "Spend (Rp jt)": "1.074,9", "Konversi Teratribusi": "21.633", "ROAS / Metrik Klaim": "5,03", "Klaim": "ROAS tertinggi non-email; sudah dinetralkan dari efek musiman" }, claims: [{ label: "Klaim", value: "Seasonally adjusted" }] },
        { rowId: 2, cells: { "No": "2", "Item": "Social", "Spend (Rp jt)": "725,2", "Konversi Teratribusi": "10.994", "ROAS / Metrik Klaim": "3,79", "Klaim": "Kinerja stabil sepanjang kuartal" }, claims: [{ label: "Klaim", value: "Sesuai hitungan" }] },
        { rowId: 3, cells: { "No": "3", "Item": "Display", "Spend (Rp jt)": "607,7", "Konversi Teratribusi": "7.258", "ROAS / Metrik Klaim": "2,99", "Klaim": "Kandidat pengurangan budget" }, claims: [{ label: "Klaim", value: "Sesuai hitungan" }] },
        // ── I4: konversi email digandakan (double-counted) ──
        { rowId: 4, cells: { "No": "4", "Item": "Email", "Spend (Rp jt)": "121,3", "Konversi Teratribusi": "5.360", "ROAS / Metrik Klaim": "11,04", "Klaim": "Termasuk konversi assisted (email + brand search)" }, claims: [{ label: "Klaim", value: "Termasuk assisted" }] },
        // ── I2: model bocor diklaim tervalidasi ──
        { rowId: 5, cells: { "No": "5", "Item": "Model uplift", "Spend (Rp jt)": "—", "Konversi Teratribusi": "—", "ROAS / Metrik Klaim": "+15% lift; korelasi 0,91 vs konversi aktual", "Klaim": "Tervalidasi. Fitur: klik, add-to-cart pasca-klik, checkout initiated" }, claims: [{ label: "Klaim", value: "Tervalidasi" }] },
        // ── I3: holdout kecil diklaim besar ──
        { rowId: 6, cells: { "No": "6", "Item": "Geo-experiment", "Spend (Rp jt)": "—", "Konversi Teratribusi": "—", "ROAS / Metrik Klaim": "Lift +19,0% ±0,8% (CI 95%); search +12%, social +7%", "Klaim": "Mengonfirmasi klaim model; cukup bukti untuk alokasi Q4" }, claims: [{ label: "Klaim", value: "Mengonfirmasi model" }] },
        { rowId: 7, cells: { "No": "7", "Item": "TOTAL", "Spend (Rp jt)": "2.529,1", "Konversi Teratribusi": "42.565", "ROAS / Metrik Klaim": "4,21", "Klaim": "Dasar alokasi budget Q4 Rp 12 miliar" }, claims: [{ label: "Klaim", value: "Final" }] },
      ],
      injections: [
        { key: "musiman-diklaim-bersih", rowIds: [1], title: "Atribusi diklaim sudah dinetralkan dari musiman", clue: "Dossier menulis search “sudah dinetralkan dari efek musiman”. Data mentah: ROAS search minggu 1–19 = 4,74 vs minggu 20–24 = 6,11 dengan spend yang DATAR — tidak ada penetralan apa pun; lonjakan konversi mengikuti kalender liburan, bukan iklan. Klaim “seasonally adjusted” adalah stempel, bukan prosedur.", danger: "Budget Q4 dialokasikan memakai ROAS musim liburan untuk memprediksi musim normal — seperti memakai payung saat hujan untuk meramalkan kemarau. Selisihnya: miliaran rupiah ekspektasi yang tidak pernah ada." },
        { key: "kebocoran-fitur", rowIds: [5], title: "Model uplift dilatih dengan data post-treatment (leakage)", clue: "Dossier membanggakan korelasi 0,91 prediksi vs konversi — dan jujur menyebut fiturnya: add-to-cart PASCA-KLIK, checkout initiated. Itu bukan prediksi; itu membaca masa depan. Uji yang sahih (Lab 2): korelasi prediksi vs lift aktual eksperimen = 0,01. Modelnya tidak rusak — ia memang tidak pernah belajar kausalitas.", danger: "Model bocor memberi rasa aman palsu lewat angka validasi yang cantik, lalu gagal total saat dipakai memutuskan budget. Yang diskalakan bukan uplift — melainkan keyakinan buta." },
        { key: "holdout-kekecilan", rowIds: [6], title: "Sampel holdout terlalu kecil untuk klaim yang dibuat", clue: "Tiga kebohongan dalam satu baris: (1) 60 geo-minggu TANPA rincian channel dipakai mengklaim lift PER CHANNEL (search +12%, social +7%) — mustahil, kolom channel tidak ada di file; (2) presisi ±0,8% mustahil dari data ini — hitung ulang memberi ±2,2 poin persen; (3) 6 minggu di LUAR musim liburan dipakai membenarkan alokasi budget musim liburan.", danger: "Eksperimen kecil yang diklaim besar = vonis Rp 12 miliar di atas fondasi 5 geo kecil di luar musim. Presisi palsu lebih berbahaya daripada ketidakpastian yang jujur." },
        { key: "double-count", rowIds: [4], title: "Satu channel double-counted", clue: "Konversi email di dossier (5.360) = 2× total di CSV (2.680) — “assisted” dihitung dua kali: sekali di email, sekali di search. Bukti aritmetika: jumlahkan Konversi Teratribusi baris 1–4 = 45.245, tetapi baris TOTAL = 42.565. Selisih 2.680 = tepat satu konversi email mentah. Dossier bahkan tidak konsisten dengan dirinya sendiri.", danger: "Double counting membuat channel termurah terlihat paling hebat (ROAS 11,04 vs 5,52) — persis channel yang paling mudah dibela di rapat. Keputusan alokasi pun miring ke ilusi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Memo strategi pengukuran",
    prose: [
      "Semua bukti di tangan: ROAS atribusi 4,21 vs incremental 2,47, inflasi musiman search 1,37 poin, model uplift yang gagal uji eksperimen (0,01), dan 4 sabotase di laporan “siap tanda tangan”. Tulis memo strategi pengukuran untuk CEO — artefak portofoliomu. Memo yang baik bukan ringkasan angka, melainkan vonis yang bisa DIPERTAHANKAN: setiap klaim punya angka pembanding dari data mentah, dan setiap rekomendasi punya harga yang diakui.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan vonis (1 paragraf): klaim mana yang bertahan (ROAS atribusi / model uplift / keduanya / tidak ada) + angka final yang kamu pertahankan (incremental ROAS 2,47) + rekomendasi alokasi Q4 dalam 2 kalimat.",
        "Bukti per klaim: (a) ROAS atribusi vs incremental — angka, selisih, dan sumber inflasi (musiman + double count); (b) validitas model uplift — 0,91 vs 0,01 dan mekanisme leakage-nya; (c) kekuatan & batas geo-experiment — apa yang bisa dan tidak bisa disimpulkan dari 5 geo × 6 minggu.",
        "Temuan audit: 4 sabotase di Laporan Pengukuran Q3, masing-masing dengan nomor baris dossier dan angka pembanding dari data mentah.",
        "Rencana pengukuran Q4: desain holdout yang benar — cakupan musim liburan, ukuran sampel minimum yang kamu sarankan (dengan alasan), metrik sukses, dan kriteria kapan model uplift boleh kembali dipakai.",
        "Batas & risiko sisa: apa yang TIDAK bisa dijawab data ini (mis. efek jangka panjang brand, interaksi antar-channel) + skenario terburuk bila vonismu salah.",
      ],
      rubric: [
        { criterion: "Diagnosis atribusi vs kausal", weight: 30, levels: ["Menyamakan ROAS atribusi dengan return kausal", "Menyebut selisih tanpa mengukur sumbernya", "4,21 vs 2,47 terukur + inflasi musiman (1,37) & double count email teridentifikasi dengan angka"] },
        { criterion: "Evaluasi model uplift & leakage", weight: 25, levels: ["Menerima klaim validasi 0,91", "Menolak model tanpa bukti eksperimen", "0,91 vs 0,01 dibuktikan + mekanisme leakage (fitur post-treatment) dijelaskan"] },
        { criterion: "Desain eksperimen lanjutan", weight: 25, levels: ["Tanpa rencana pengukuran", "Rencana tanpa ukuran sampel/musim", "Holdout mencakup musim liburan + justifikasi ukuran sampel + kriteria kelayakan model"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim vonis final tanpa batas", "Menyebut sebagian batas", "Batas data (SINTETIS, 5 geo, tanpa efek jangka panjang) + skenario terburuk dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan harga sebuah vonis",
    prose: [
      "Debrief dibuka. Empat sabotase di Laporan Pengukuran Q3:",
      "1) **Musiman diklaim bersih** (baris 1): stempel “sudah dinetralkan dari efek musiman” tanpa prosedur apa pun di baliknya — ROAS search 4,74 vs 6,11 dengan spend datar adalah buktinya. Ini sabotase paling sopan: tidak mengubah satu angka pun, hanya menambahkan satu kalimat yang membuat angka itu terlihat aman.",
      "2) **Model bocor diklaim valid** (baris 5): korelasi 0,91 memang benar — dan memang tidak relevan. Fitur pasca-klik membuat model itu cermin (memantulkan siapa yang hampir checkout), bukan jendela (meneropong efek iklan). Uji eksperimen 0,01 adalah vonisnya.",
      "3) **Holdout kecil diklaim besar** (baris 6): rincian per channel dari file tanpa kolom channel, presisi ±0,8% dari data yang memberi ±2,2 pp, dan 6 minggu di luar musim untuk vonis musim liburan. Tiga lapis klaim berlebihan dalam satu baris.",
      "4) **Double count** (baris 4): email 5.360 = 2× 2.680 mentah; dossier tidak konsisten dengan totalnya sendiri (45.245 vs 42.565). Sabotase paling malas — dan paling mudah ditangkap siapa pun yang mau menjumlahkan.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel “siap tanda tangan”.",
      "Bahaya nyata: ini bukan fiksi yang jauh. eBay pernah mematikan iklan search brand-nya dan menemukan penjualannya TIDAK BERGERAK — bertahun-tahun mereka membayar untuk klik yang memang akan terjadi (studi kasus klasik eksperimen vs atribusi). Di misi ini taruhannya Rp 12 miliar; di perusahaan nyata, taruhannya bisa puluhan kali lipat — dan mekanismenya sama persis: kredit yang salah alamat, model yang membaca masa depan, eksperimen kecil yang diklaim besar.",
      "Refleksi keputusan: bila kamu memilih “percaya atribusi” atau “percaya model”, lihat konsekuensinya — keduanya membakar uang dengan cara yang berbeda tetapi dengan akar yang sama: memakai metrik yang menjawab pertanyaan yang SALAH. “Eksperimen dulu” pun berbiaya (6 minggu + kepercayaan CEO). Tidak ada vonis gratis; yang ada hanya vonis yang harganya terlihat vs yang harganya tersembunyi.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: satu eksperimen = kebenaran final",
      type: "pitfall",
      body: "“Kita sudah punya geo-experiment, jadi vonisnya pasti benar.” Belum. Eksperimen di misi ini: 5 geo kecil, 6 minggu, di luar musim liburan, hanya menguji search+social. Ia cukup untuk MENOLAK dua klaim palsu — tetapi belum cukup untuk menetapkan alokasi Q4 yang presisi. Eksperimen yang baik tidak memberi kepastian; ia memberi tahu seberapa besar ketidakpastianmu — dan vonis yang jujur menyebut angkanya (±2,2 pp), bukan menyembunyikannya.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "ROAS atribusi (4,21) benar dihitung tetapi terinflasi: musiman mengangkat ROAS search 4,74 → 6,11 dengan spend datar, dan konversi email double-counted (5.360 vs 2.680 mentah).",
      "Ground truth eksperimental: incremental ROAS 2,47 (lift +19,0% ±2,2 pp) — jauh di bawah klaim atribusi; inilah satu-satunya angka yang layak jadi dasar alokasi.",
      "Model uplift gagal uji kausal: korelasi prediksi vs konversi 0,91 tetapi vs lift aktual 0,01 — pola khas leakage fitur post-treatment (add-to-cart pasca-klik).",
      "Empat pola sabotase laporan: stempel musiman fiktif, model bocor diklaim valid, holdout kecil diklaim besar (rincian per channel mustahil + presisi palsu), double counting yang inkonsisten dengan total dossier sendiri.",
      "Aturan praktis: atribusi menjawab “siapa dapat kredit”, eksperimen menjawab “apa yang berubah karena iklan” — jangan alokasikan budget memakai jawaban dari pertanyaan yang salah. Data: SINTETIS (seed 42); detail di METODE.md.",
    ],
  },
];

(misiGabungAtribusi.steps as V2Step[]).push(...LANJUTAN_ATRIBUSI);

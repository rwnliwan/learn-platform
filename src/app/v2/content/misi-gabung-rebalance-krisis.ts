import type { V2Mission } from "../lib/types";

// ── MISI Rebalance: Keputusan 30 Menit di Tengah Kepanikan ───────────────
// CAPSTONE C — Financial Markets × Portfolio Management (kombinasi).
// Sudut: rebalancing saat event pasar — keputusan di bawah tekanan waktu.
// Dataset SINTETIS 100% (generator.py, seed 42) — meniru POLA FRED 2020,
// BUKAN data FRED asli. Dibekukan 2026-10-15.
// File: public/misi/misi-gabung-rebalance-krisis/sp500_vix.csv (125 hari bursa)
//   + holdings.csv (8 kelas aset, target vs aktual).

const BASE = "/misi/misi-gabung-rebalance-krisis";

export const misiGabungRebalanceKrisis: V2Mission = {
  slug: "misi-gabung-rebalance-krisis",
  track: "Financial Markets",
  module: "Misi",
  title: "Misi Rebalance: Keputusan 30 Menit di Tengah Kepanikan",
  estMinutes: 150,
  role: "Manajer portofolio — pengambil keputusan alokasi di tengah krisis",
  client:
    "Komite investasi — meminta keputusan rebalance dalam 30 menit, 17 Maret 2020",
  xp: 640,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Telepon dari komite: 30 menit",
      prose: [],
      tasks: [],
      briefing: {
        role: "Manajer portofolio — pengambil keputusan alokasi di tengah krisis",
        client:
          "Komite investasi. Pasar jatuh tiga minggu berturut-turut, alokasi portofolio meleset jauh dari target, dan ketua komite meneleponmu: keputusan rebalance — penuh sekarang, tunggu sampai tenang, atau parsial — harus keluar DALAM 30 menit, hari ini juga.",
        story: [
          "Selasa, 17 Maret 2020, 14:00. Telepon dari ketua komite investasi — suaranya tegang. Tiga minggu terakhir pasar seperti lift yang putus talinya: S&P 500 sudah jatuh lebih dari 30% dari puncaknya, dan VIX — pengukur ketakutan pasar — menyentuh 79, level yang terakhir terlihat saat krisis finansial 2008. “Alokasi kita meleset jauh dari target,” katanya. “Ekuitas anjlok, obligasi dan kas membengkak. Kami butuh keputusanmu dalam 30 menit: rebalance penuh sekarang, tunggu sampai tenang, atau rebalance parsial?”",
          "Kamu menatap layar: drift total 24,6 poin persen. Setiap opsi punya harga. Rebalance penuh SEKARANG berarti membeli ekuitas yang mungkin masih jatuh — tapi menunggu berarti membiarkan alokasi hanyut tepat saat pasar berbalik. Dan pasar 2020 tidak memberi aba-aba: ia jatuh seperti batu, lalu naik seperti roket.",
          "Misi capstone ini menggabungkan dua lensa: Financial Markets (membaca kepanikan pasar: drawdown, VIX) dan Portfolio Management (disiplin alokasi: drift, turnover, biaya). Tugasmu: ukur lukanya, hitung harga tiap opsi, putuskan dalam kerangka 30 menit, temukan sabotase di memo post-mortem desk, dan tulis memo komite yang berani mempertanggungjawabkan WAKTU keputusanmu.",
        ],
        objectives: [
          "Menghitung drawdown maksimum S&P 500 dan VIX maksimum dari data harian, serta drift tiap kelas aset dari target alokasi.",
          "Membandingkan biaya turnover rebalance PENUH vs PARSIAL (spread krisis 30 bps) dan memetakan pemicu serta harga tiap opsi keputusan.",
          "Memutuskan dalam kerangka 30 menit, menemukan 4 suntikan di memo post-mortem desk, dan menulis memo komite + justifikasi waktu + protokol krisis.",
        ],
        prereqSummary:
          "Rebalancing = mengembalikan bobot portofolio ke target karena pergerakan harga membuat bobot melar. Di tengah krisis, tiga hal berubah: drift membesar, biaya transaksi membengkak karena spread melebar, dan keputusan harus diambil cepat — dengan risiko whipsaw (pasar berbalik arah setelah kamu bergerak). Drawdown = penurunan dari puncak terakhir, dalam persen. Misi ini memakai data SINTETIS berpola 2020 — bukan pasar nyata — jadi yang dinilai adalah KERANGKA keputusanmu, bukan ramalanmu.",
        datasetNote:
          "SINTETIS 100% — BUKAN data FRED asli. `sp500_vix.csv`: 125 hari bursa 2020-01-02 s.d. 2020-06-30 (kolom tanggal, sp500, vix) — dibangkitkan dengan seed 42 meniru POLA FRED 2020: puncak Februari, kejatuhan Maret (VIX > 80), pemulihan April–Juni.\n`holdings.csv`: 8 kelas aset, target vs aktual per 2020-03-16 (kolom kelas_aset, target_pct, aktual_pct).\nKejujuran: pola meniru, angka bukan angka FRED; spread krisis 30 bps adalah asumsi misi, bukan estimasi empiris. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Medan perang dan korbannya",
      prose: [
        "`sp500_vix.csv` adalah medan perangnya: 125 baris harga S&P 500 dan VIX harian, Januari–Juni 2020 — termasuk Maret, bulan ketika VIX menyentuh 82,69 dan indeks jatuh −34,08% dari puncaknya. Grafik di bawah menunjukkan drawdown (seberapa dalam luka pasar) per akhir bulan.",
        "`holdings.csv` adalah korbannya: 8 kelas aset dengan target vs aktual per 16 Maret 2020. Ekuitas menyusut, obligasi pemerintah dan kas membengkak — drift total 24,6 poin persen dari mandat.",
        "Aturan main: (1) keputusan dibangun dari file mentah, bukan dari ingatan tentang 2020 — kamu tidak boleh memakai pengetahuan “nanti pasar rebound”; (2) biaya SELALU dihitung — spread krisis 30 bps, bukan spread normal; (3) drawdown diukur dari puncak berjalan, bukan dari awal tahun.",
      ],
      tasks: [
        { id: "t1", text: "Buka `sp500_vix.csv`: catat rentang tanggal dan baca grafik drawdown di bawah" },
        { id: "t2", text: "Buka `holdings.csv`: kelas aset mana yang paling meleset dari target, dan ke arah mana?" },
      ],
      echart: {
        option: {
          title: { text: "Drawdown S&P 500 akhir bulan, Jan–Jun 2020 (%)" },
          tooltip: { trigger: "axis" },
          xAxis: {
            type: "category",
            data: ["2020-01", "2020-02", "2020-03", "2020-04", "2020-05", "2020-06"],
          },
          yAxis: { type: "value", name: "persen" },
          series: [
            {
              type: "line",
              data: [0.0, -12.96, -23.85, -14.19, -10.3, -8.65],
              markLine: { data: [{ yAxis: 0 }] },
            },
          ],
        },
        caption:
          "Cara membaca: sumbu X = akhir bulan; sumbu Y = drawdown dalam persen (0 = tepat di puncak, negatif = di bawah puncak terakhir). Interpretasi: Januari masih di puncak (0%); Februari −12,96%; Maret −23,85% — luka terdalam (intraday sempat −34,08% pada 23 Maret); April–Juni luka menutup perlahan ke −8,65%. Inilah “medan perang” tempat keputusan 30 menit harus diambil — tanpa tahu bahwa Juni akan jauh lebih tenang.",
      },
      note: {
        title: "Miskonsepsi #1: rebalance saat krisis selalu benar — “beli saat murah”",
        type: "pitfall",
        body: "Kadang benar, kadang bunuh diri. “Beli saat murah” berasumsi kamu tahu itu murah — 17 Maret 2020 pasar “murah” −30%, lalu jatuh ke −34% seminggu kemudian. Rebalance di tengah badai bisa berarti membeli pisau jatuh; dan setiap putaran whipsaw (bergerak lalu berbalik) membayar 3,69 bps. Disiplin alokasi BUKAN menebak bottom — ia adalah aturan yang bekerja tanpa perlu tahu di mana bottom.",
      },
      reference:
        "sp500_vix.csv (125 hari bursa, SINTETIS berpola FRED) vs holdings.csv (8 kelas aset, drift 24,6 pp). Keputusan dari yang mentah; biaya selalu 30 bps; vonis selalu dari angka.",
    },
    {
      id: "lab-1",
      eyebrow: "Langkah 3 · Lab 1 — Ukur luka & harga disiplin",
      title: "Seberapa dalam lukanya, seberapa mahal obatnya",
      prose: [
        "Ukur dua hal. PERTAMA, lukanya: drawdown maksimum S&P 500 (dari puncak berjalan ke lembah terdalam) dan VIX maksimum — seberapa panik pasar pada titik tergelapnya. KEDUA, harga disiplin: drift tiap kelas aset dari target, lalu turnover dan biaya rebalance PENUH (kembalikan semua ke target) vs PARSIAL (tutup separuh drift tiap kelas) dengan spread krisis 30 bps.",
        "Definisi kerja: drawdown hari t = harga_t / puncak_tertinggi_sampai_t − 1 (negatif = di bawah puncak). Turnover satu event = 0,5 × jumlah |perubahan bobot| — dua sisi, seperti biasa.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV; hitung `n_baris`, `tgl_awal`, `tgl_akhir`" },
        { id: "t2", text: "Hitung `dd_maks`, `tgl_dd_maks`, `tgl_puncak`, `vix_maks`, `tgl_vix_maks`" },
        { id: "t3", text: "Hitung `drift_total_pp`, `kelas_drift_maks`, `drift_maks_pp` dari holdings.csv" },
        { id: "t4", text: "Hitung `turnover_penuh`, `biaya_penuh_bps`, `turnover_parsial`, `biaya_parsial_bps`" },
      ],
      expected:
        "125 hari (2020-01-02 s.d. 2020-06-30); drawdown maks −34,08% (puncak 2020-02-14 → lembah 2020-03-23); VIX maks 82,69 (2020-03-16); drift total 24,6 pp — Kas meleset +6,0 pp; turnover penuh 12,3% → biaya 3,69 bps (≈ Rp738 jt dari Rp2 T); parsial (50% drift): 6,15% → 1,845 bps",
      formula: String.raw`\text{DD}_t = \frac{P_t}{\max_{s \le t} P_s} - 1`,
      formulaNote:
        "DD_t = drawdown hari t (desimal negatif); P_t = harga S&P 500 hari t; max_{s ≤ t} P_s = puncak tertinggi SEJAK AWAL data sampai hari t (puncak BERJALAN — ia naik setiap ada rekor baru, tidak pernah turun). Interpretasi: DD_t = −0,34 berarti pasar 34% di bawah puncak terakhirnya. Contoh konkret: puncak 2020-02-14 = 3393,94; lembah 2020-03-23 = 2237,40 → DD = 2237,40/3393,94 − 1 ≈ −0,3408 (−34,08%). Turnover: 0,5 × 24,6% = 12,3% (penuh); biaya = turnover × 30 bps = 0,123 × 0,003 = 3,69 bps dari nilai portofolio (≈ Rp738 juta dari Rp2 triliun).",
      note: {
        title: "Miskonsepsi #2: VIX 82 berarti pasar akan naik — “ketakutan = sinyal beli”",
        type: "pitfall",
        body: "VIX mengukur EKSPEKTASI gejolak, bukan arah. VIX 82 bilang “pasar yakin akan ada guncangan besar” — bisa ke bawah dulu sebelum ke atas. Yang memakai VIX sebagai sinyal beli buta pada 16 Maret 2020 membeli tepat sebelum −5% tambahan menuju 23 Maret. VIX adalah termometer demam, bukan kompas: ia bilang seberapa sakit, bukan ke mana jalan pulang.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))` — kolom tanggal bertipe string di file ini.",
        "Puncak berjalan: `runmax = df[\"sp500\"].cummax()`; drawdown: `(df[\"sp500\"] / runmax - 1.0) * 100.0`.",
        "Tanggal puncak SEBELUM lembah: cari idxmax pada runmax yang dipotong sampai baris lembah.",
        "Drift: `h[\"drift_pp\"] = h[\"aktual_pct\"] - h[\"target_pct\"]`; total = jumlah nilai absolutnya.",
        "Biaya dalam bps: turnover (fraksi) × 0,003 × 10000. Parsial = separuh turnover penuh.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-rebalance-krisis/sp500_vix.csv\"",
          "URL_H = \"/misi/misi-gabung-rebalance-krisis/holdings.csv\"",
          "BIAYA = 0.003  # 30 bps — spread krisis",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "tgl_awal = ...",
          "tgl_akhir = ...",
          "",
          "runmax = ...",
          "dd = ...  # dalam persen",
          "i = int(dd.idxmin())",
          "dd_maks = ...",
          "tgl_dd_maks = ...",
          "tgl_puncak = ...  # tanggal puncak berjalan sebelum lembah",
          "",
          "j = int(df[\"vix\"].idxmax())",
          "vix_maks = ...",
          "tgl_vix_maks = ...",
          "",
          "h = pd.read_csv(open_url(URL_H))",
          "h[\"drift_pp\"] = ...",
          "drift_total_pp = ...",
          "k = int(h[\"drift_pp\"].abs().idxmax())",
          "kelas_drift_maks = ...",
          "drift_maks_pp = ...",
          "",
          "turnover_penuh = ...    # fraksi, dua sisi",
          "biaya_penuh_bps = ...",
          "turnover_parsial = ...  # tutup 50% drift",
          "biaya_parsial_bps = ...",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"drawdown maks:\", round(dd_maks, 2), \"% pada\", tgl_dd_maks, \"(puncak\", tgl_puncak, \")\")",
          "print(\"VIX maks:\", vix_maks, \"pada\", tgl_vix_maks)",
          "print(\"drift total:\", round(drift_total_pp, 2), \"pp | kelas:\", kelas_drift_maks, drift_maks_pp)",
          "print(\"penuh: turnover\", round(turnover_penuh, 4), \"| biaya\", round(biaya_penuh_bps, 4), \"bps\")",
          "print(\"parsial: turnover\", round(turnover_parsial, 4), \"| biaya\", round(biaya_parsial_bps, 4), \"bps\")",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-rebalance-krisis/sp500_vix.csv\"",
          "URL_H = \"/misi/misi-gabung-rebalance-krisis/holdings.csv\"",
          "BIAYA = 0.003  # 30 bps — spread krisis",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "tgl_awal = df[\"tanggal\"].min()",
          "tgl_akhir = df[\"tanggal\"].max()",
          "",
          "runmax = df[\"sp500\"].cummax()",
          "dd = (df[\"sp500\"] / runmax - 1.0) * 100.0",
          "i = int(dd.idxmin())",
          "dd_maks = float(dd.min())",
          "tgl_dd_maks = df.loc[i, \"tanggal\"]",
          "tgl_puncak = df.loc[int(runmax.iloc[:i + 1].idxmax()), \"tanggal\"]",
          "",
          "j = int(df[\"vix\"].idxmax())",
          "vix_maks = float(df.loc[j, \"vix\"])",
          "tgl_vix_maks = df.loc[j, \"tanggal\"]",
          "",
          "h = pd.read_csv(open_url(URL_H))",
          "h[\"drift_pp\"] = h[\"aktual_pct\"] - h[\"target_pct\"]",
          "drift_total_pp = float(h[\"drift_pp\"].abs().sum())",
          "k = int(h[\"drift_pp\"].abs().idxmax())",
          "kelas_drift_maks = h.loc[k, \"kelas_aset\"]",
          "drift_maks_pp = float(abs(h.loc[k, \"drift_pp\"]))",
          "",
          "turnover_penuh = float(drift_total_pp / 2 / 100)",
          "biaya_penuh_bps = float(turnover_penuh * BIAYA * 10000)",
          "turnover_parsial = float(turnover_penuh / 2)",
          "biaya_parsial_bps = float(biaya_penuh_bps / 2)",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"drawdown maks:\", round(dd_maks, 2), \"% pada\", tgl_dd_maks, \"(puncak\", tgl_puncak, \")\")",
          "print(\"VIX maks:\", vix_maks, \"pada\", tgl_vix_maks)",
          "print(\"drift total:\", round(drift_total_pp, 2), \"pp | kelas:\", kelas_drift_maks, drift_maks_pp)",
          "print(\"penuh: turnover\", round(turnover_penuh, 4), \"| biaya\", round(biaya_penuh_bps, 4), \"bps\")",
          "print(\"parsial: turnover\", round(turnover_parsial, 4), \"| biaya\", round(biaya_parsial_bps, 4), \"bps\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari sp500_vix.csv." },
          { kind: "equal", task: "t1", label: "`n_baris` = 125", name: "n_baris", value: 125, msg: "125 hari bursa (2020-01-02 s.d. 2020-06-30)." },
          { kind: "equal", task: "t1", label: "`tgl_awal` = 2020-01-02", name: "tgl_awal", value: "2020-01-02", msg: "Hari bursa pertama 2020 (1 Januari libur)." },
          { kind: "equal", task: "t1", label: "`tgl_akhir` = 2020-06-30", name: "tgl_akhir", value: "2020-06-30", msg: "Hari bursa terakhir semester I 2020." },
          { kind: "equal", task: "t2", label: "`dd_maks` ≈ −34,08", name: "dd_maks", value: -34.08, tol: 0.05, msg: "Drawdown = harga / puncak_berjalan − 1, dalam persen; ambil nilai minimumnya." },
          { kind: "equal", task: "t2", label: "`tgl_dd_maks` = 2020-03-23", name: "tgl_dd_maks", value: "2020-03-23", msg: "Lembah terdalam periode ini." },
          { kind: "equal", task: "t2", label: "`tgl_puncak` = 2020-02-14", name: "tgl_puncak", value: "2020-02-14", msg: "Puncak berjalan SEBELUM lembah — potong runmax sampai baris lembah, lalu idxmax." },
          { kind: "equal", task: "t2", label: "`vix_maks` = 82,69", name: "vix_maks", value: 82.69, tol: 0.05, msg: "Puncak kepanikan pasar pada data ini." },
          { kind: "equal", task: "t2", label: "`tgl_vix_maks` = 2020-03-16", name: "tgl_vix_maks", value: "2020-03-16", msg: "Sehari sebelum keputusan 30 menit — pasar sedang di titik didih." },
          { kind: "equal", task: "t3", label: "`drift_total_pp` = 24,6", name: "drift_total_pp", value: 24.6, tol: 0.01, msg: "Jumlah |aktual − target| semua kelas aset, dalam poin persen." },
          { kind: "equal", task: "t3", label: "`kelas_drift_maks` = Kas", name: "kelas_drift_maks", value: "Kas", msg: "Kas membengkak ke 9% vs target 3% — pelarian ke aset aman." },
          { kind: "equal", task: "t3", label: "`drift_maks_pp` = 6,0", name: "drift_maks_pp", value: 6.0, tol: 0.01, msg: "Nilai absolut drift kelas Kas." },
          { kind: "equal", task: "t4", label: "`turnover_penuh` = 0,123", name: "turnover_penuh", value: 0.123, tol: 0.001, msg: "0,5 × 24,6% — dua sisi, dalam fraksi." },
          { kind: "equal", task: "t4", label: "`biaya_penuh_bps` = 3,69", name: "biaya_penuh_bps", value: 3.69, tol: 0.01, msg: "turnover × 30 bps × 10000. Spread krisis, bukan spread normal!" },
          { kind: "equal", task: "t4", label: "`turnover_parsial` = 0,0615", name: "turnover_parsial", value: 0.0615, tol: 0.001, msg: "Tutup 50% drift = separuh turnover penuh." },
          { kind: "equal", task: "t4", label: "`biaya_parsial_bps` = 1,845", name: "biaya_parsial_bps", value: 1.845, tol: 0.01, msg: "Separuh biaya penuh — Rp369 jt dari Rp2 triliun." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Hari-hari tergelap",
      title: "Kepanikan datang borongan, bukan cicilan",
      prose: [
        "Tabel `hari(tanggal TEXT, dd_pct REAL, vix REAL)` — 10 hari dengan drawdown TERDALAM periode ini, langsung dari perhitungan Lab 1. Komite ingin tahu: pada hari-hari tergelap, seberapa panik pasar? Tampilkan 5 hari drawdown terdalam: tanggal, dd_pct, vix — urut dari yang terdalam.",
        "Renungkan selagi query berjalan: 5 hari ini semuanya terjadi dalam rentang 17–23 Maret — tujuh hari kalender. Kepanikan tidak datang cicilan; ia datang borongan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query 5 hari drawdown terdalam (tanggal + dd_pct + vix, urut dari terdalam)" },
      ],
      expected:
        "5 baris — 2020-03-23 (−34,08; VIX 61,59), 2020-03-20 (−32,09), 2020-03-19 (−31,54), 2020-03-18 (−31,12), 2020-03-17 (−30,20; VIX 79,18)",
      sqlLab: {
        task: "Tampilkan 5 hari dengan drawdown TERDALAM: kolom tanggal + dd_pct + vix, urut dari yang terdalam (dd_pct paling negatif dulu).",
        schema: "CREATE TABLE hari (tanggal TEXT, dd_pct REAL, vix REAL);",
        seedData: [
          "INSERT INTO hari VALUES",
          "('2020-03-23',-34.08,61.59),",
          "('2020-03-20',-32.09,65.94),",
          "('2020-03-19',-31.54,69.98),",
          "('2020-03-18',-31.12,74.32),",
          "('2020-03-17',-30.20,79.18),",
          "('2020-03-16',-29.69,82.69),",
          "('2020-03-24',-27.89,60.35),",
          "('2020-03-12',-26.91,75.47),",
          "('2020-03-25',-25.00,58.72),",
          "('2020-03-31',-23.85,53.54);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT tanggal, dd_pct, vix\nFROM hari\n",
        solution: [
          "SELECT tanggal, dd_pct, vix",
          "FROM hari",
          "ORDER BY dd_pct ASC",
          "LIMIT 5;",
        ].join("\n"),
        expectedColumns: ["tanggal", "dd_pct", "vix"],
        expectedRows: [
          ["2020-03-23", -34.08, 61.59],
          ["2020-03-20", -32.09, 65.94],
          ["2020-03-19", -31.54, 69.98],
          ["2020-03-18", -31.12, 74.32],
          ["2020-03-17", -30.2, 79.18],
        ],
        orderMatters: true,
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta 30 menit",
      title: "Tiga jalan, tiga harga",
      prose: [
        "Tiga puluh menit. Tiga jalan. Setiap jalan punya PEMICU (kenapa ia masuk akal) dan HARGA (apa yang dipertaruhkan). Isi peta ini dengan ANGKA lab-mu — bukan firasat. Peta yang jujur tidak menyembunyikan harga opsi favoritmu.",
        "**PENUH SEKARANG** — Pemicu: drift 24,6 pp sudah jauh dari mandat; komite menuntut aksi; “beli saat murah” (−30%!). Harga: biaya 3,69 bps (≈ Rp738 jt dari Rp2 T) dibayar di spread TERMAHAL; risiko membeli pisau jatuh bila pasar terus turun.",
        "**TUNGGU TENANG** — Pemicu: VIX 79 = pasar belum menemukan dasar; jangan menangkap pisau jatuh; keputusan terburu-buru di kepanikan jarang bagus. Harga: drift 24,6 pp dibiarkan hanyut; risiko ketinggalan rebound berbentuk V yang datang SEBELUM kata “tenang” berani diucapkan.",
        "**PARSIAL (50%)** — Pemicu: drift besar menuntut aksi, TAPI ketidakpastian ekstrem melarang all-in ke arah mana pun. Harga: biaya 1,845 bps (≈ Rp369 jt); tidak ada skenario sempurna, tidak ada skenario bencana — diversifikasi atas keputusan itu sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Untuk opsi PENUH: tulis ulang pemicu & harganya dengan angkamu sendiri (2 kalimat)" },
        { id: "t2", text: "Untuk opsi TUNGGU: tulis ulang pemicu & harganya dengan angkamu sendiri (2 kalimat)" },
        { id: "t3", text: "Untuk opsi PARSIAL: tulis ulang pemicu & harganya dengan angkamu sendiri (2 kalimat)" },
      ],
      note: {
        title: "Peta keputusan yang baik memuat harga, bukan cuma janji",
        body: "Kebanyakan “analisis opsi” hanya berisi alasan kenapa tiap opsi bagus. Peta 30 menit membaliknya: tiap opsi WAJIB memuat harganya dalam angka (biaya, risiko, apa yang dikorbankan). Opsi yang harganya tidak bisa dituliskan dengan angka biasanya adalah opsi yang harganya paling mahal.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "17 Maret 2020, pukul 14:30",
      prose: [
        "Telepon komite masuk — 30 menit dimulai SEKARANG. Di layar: VIX 79,18; drawdown hari ini −30,20%; drift 24,6 pp; biaya penuh Rp738 jt vs parsial Rp369 jt. Tidak ada waktu untuk model baru — hanya untuk keputusan. Lima hari tergelap semuanya terjadi minggu ini; tidak ada yang tahu apakah besok −34% atau +9%.",
        "Tugas mini-case: tulis rekomendasi sementaramu — 3 kalimat: opsi yang kamu pilih, SATU angka pendukung terkuat, dan SATU risiko terbesar yang kamu sadari. Ini draf mentah; keputusan final ada di langkah berikutnya. Kejujuran di sini lebih penting dari keberanian.",
      ],
      tasks: [
        { id: "t1", text: "Tulis rekomendasi sementara 3 kalimat (opsi + 1 angka pendukung + 1 risiko terbesar)" },
        { id: "t2", text: "Tulis SATU hal yang akan kamu cek ulang bila diberi 24 jam, bukan 30 menit" },
      ],
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 7 · Checkpoint keputusan",
      title: "30 menit hampir habis — putuskan",
      prose: [
        "Ketua komite menunggu di ujung telepon. Angka-angka sudah di tangan: drawdown −34,08%, VIX 82,69, drift 24,6 pp, biaya penuh 3,69 bps vs parsial 1,845 bps. Tidak ada opsi yang gratis — dan “tidak memutuskan” juga sebuah keputusan (drift yang dibiarkan = opsi TUNDA tanpa keberanian mengakuinya). Pilih — seperti memo yang sudah dikirim.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Keputusan rebalance apa yang kamu sampaikan ke komite dalam 30 menit ini? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-penuh",
            label: "Rebalance PENUH sekarang — kembalikan semua bobot ke target hari ini juga",
            rationale:
              "Drift 24,6 pp adalah pelanggaran mandat; “beli saat murah” (−30%!); komite menuntut aksi nyata, bukan setengah hati. Menunggu = membiarkan mandat dilanggar lebih lama.",
            nextStepId: "temuan-penuh",
            consequenceNote:
              "Komite lega — keputusan cepat dan tegas. Biaya Rp738 jt dibayar di spread termahal. Tapi pasar belum selesai jatuh: S&P 500 masih turun −5,5% lagi ke 23 Maret — kamu membeli ekuitas yang masih jatuh. Lalu rebound V-shape datang; portofoliomu ikut naik, tapi peluru sudah habis di harga yang lebih mahal.",
          },
          {
            id: "opt-tunda",
            label: "TUNGGU sampai pasar tenang — jangan rebalance di tengah badai",
            rationale:
              "VIX 79 = pasar belum menemukan dasar; menangkap pisau jatuh itu mahal; keputusan terburu-buru di tengah kepanikan jarang berakhir bagus.",
            nextStepId: "temuan-tunda",
            consequenceNote:
              "Awalnya terlihat bijak. Tapi 2020 berbentuk V: pasar naik +25% dalam 3 minggu setelah 23 Maret — SEBELUM ada yang berani bilang “tenang”. Kamu menunggu kepastian yang datang terlambat; ekuitas murah sudah mahal lagi saat kamu akhirnya bergerak. Komite bertanya: “bukankah tugasmu membeli saat murah?”",
          },
          {
            id: "opt-parsial",
            label: "Rebalance PARSIAL — tutup separuh drift tiap kelas aset",
            rationale:
              "Drift besar menuntut aksi, ketidakpastian ekstrem melarang all-in; biaya separuh (Rp369 jt); tidak ada skenario bencana. Diversifikasi atas keputusan itu sendiri.",
            nextStepId: "temuan-parsial",
            consequenceNote:
              "Tidak ada yang bersorak — komite ingin kepastian, bukan “separuh”. Tapi 3 bulan kemudian angkanya bicara: biaya Rp369 jt, drift turun ke 12,3 pp, ikut sebagian rebound, tidak ada bencana di skenario mana pun. Keputusan yang tidak memuaskan semua orang — dan paling bertahan.",
          },
        ],
      },
    },
  ],
};

export default misiGabungRebalanceKrisis;

// ── lanjutan misiGabungRebalanceKrisis: langkah 8–13 ─────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_REBALANCE_KRISIS: V2Step[] = [
  {
    id: "temuan-penuh",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: rebalance penuh, sekarang juga",
    prose: [
      "Komite menyetujui dalam 4 menit — kecepatanmu dipuji. Perintah eksekusi keluar sore itu juga: turnover 12,3%, biaya Rp738 juta dibayar di spread krisis 30 bps, spread TERMAHAL dalam sejarah data ini.",
      "Lalu pasar melakukan yang tidak ada di petamu: S&P 500 jatuh lagi −5,5% menuju 23 Maret. Kamu baru saja membayar Rp738 juta untuk membeli ekuitas yang seminggu kemudian lebih murah. Ini whipsaw ronde pertama — dan biayanya bukan cuma uang: kredibilitasmu sebagai pengambil keputusan ikut tergerus setiap kali pasar “membuktikan” kamu terburu-buru.",
      "Rebound V-shape kemudian menyelamatkan angkanya — tapi tidak menyelamatkan pelajarannya: kecepatan tanpa aturan = membayar mahal untuk menebak bottom. “Beli saat murah” hanya benar bila kamu tahu itu murah; 17 Maret tidak ada yang tahu.",
    ],
    tasks: [],
    note: {
      title: "Whipsaw: pasar menghukum yang bergerak tanpa aturan",
      body: "Whipsaw = kamu bergerak, pasar berbalik, kamu “salah” dua arah. Rebalance penuh 17 Maret → pasar jatuh lagi (kamu terburu-buru) → lalu rebound (kamu benar, tapi peluru habis di harga mahal). Setiap putaran membayar 3,69 bps. Obatnya bukan “jangan pernah rebalance”, melainkan ATURAN yang ditulis sebelum krisis: ambang drift, jendela waktu, kapan penuh vs parsial — bukan firasat tanggal.",
    },
  },
  {
    id: "temuan-tunda",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: tunggu sampai tenang",
    prose: [
      "Komite mengangguk — “bijaksana”. Kamu menunda; drift 24,6 pp dibiarkan hanyut. Seminggu pertama terasa seperti validasi: pasar jatuh lagi ke −34,08% pada 23 Maret. “Untung tidak beli kemarin,” gumammu.",
      "Tiga minggu kemudian S&P 500 sudah naik +25% dari lembah. Tidak ada pengumuman “pasar sudah tenang” — ketenangan tidak pernah mengetuk pintu. Saat VIX akhirnya turun ke 30-an dan kamu berani rebalance, ekuitas yang “murah” sudah mahal lagi, dan drift yang dibiarkan berarti kamu membeli lebih sedikit di harga lebih tinggi.",
      "Pelajaran yang mahal: “tunggu tenang” terdengar seperti manajemen risiko, padahal sering kali = keputusan yang ditunda sampai opsinya basi. Drift yang dibiarkan adalah keputusan juga — hanya tanpa keberanian mengakuinya.",
    ],
    tasks: [],
    note: {
      title: "“Tenang” bukan sinyal — ia adalah hasil",
      body: "VIX turun SETELAH pasar naik, bukan sebelum. Menunggu VIX tenang = menunggu rebound selesai, lalu membeli di harga yang sudah pulih. Kalau strategimu “tunggu tenang”, tulis dulu angkanya: tenang = VIX di bawah berapa, selama berapa hari? Tanpa ambang itu, “tunggu” = menunda sampai terlambat.",
    },
  },
  {
    id: "temuan-parsial",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: rebalance parsial",
    prose: [
      "Komite mengernyit — “cuma separuh?” Tapi mereka menyetujui; tidak ada yang punya argumen lebih baik dalam 30 menit. Eksekusi sore itu: biaya Rp369 juta (separuh), drift turun dari 24,6 ke 12,3 pp.",
      "Pasar jatuh −5,5% lagi ke 23 Maret — kamu ikut terluka, tapi hanya separuh. Lalu rebound V-shape — kamu ikut naik, separuh. Tidak ada ronde yang membuatmu terlihat brilian; tidak ada ronde yang membuatmu terlihat bodoh.",
      "Tiga bulan kemudian tidak ada yang membahas keputusanmu lagi — dan itulah pujian tertingginya. Di tengah ketidakpastian ekstrem, keputusan yang “tidak memuaskan semua orang” adalah yang paling bertahan. Parsial bukan kompromi lemah: ini diversifikasi atas keputusan itu sendiri — pengakuan eksplisit bahwa pada VIX 79, tidak ada yang tahu.",
    ],
    tasks: [],
    note: {
      title: "Parsial = diversifikasi atas keputusan",
      body: "Kamu tidak tahu apakah 17 Maret itu “murah” atau “masih mahal” — tidak ada yang tahu. Parsial mengakui ketidaktahuan itu secara eksplisit: separuh keyakinan ke tiap arah. Ini bukan kelemahan; ini satu-satunya sikap jujur saat VIX 79. Manajer yang baik bukan yang selalu benar, melainkan yang tidak pernah hancur oleh satu keputusan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 16 baris: memo post-mortem yang “menang” itu bohong",
    prose: [
      "Sebelum menulis memo komite, satu misi audit. Di bawah ini 16 baris “Memo Post-Mortem Desk — Rebalance Maret 2020”, dokumen internal yang mengklaim keputusan rebalance 17 Maret sebagai keberhasilan gemilang. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: drawdown −34,08%, VIX 82,69, drift 24,6 pp, turnover 12,3%, biaya 3,69 bps. Empat suntikan, empat pola kebohongan klasik laporan pasca-krisis. Temukan semuanya — karena memo yang akan kamu tulis harus lebih jujur dari memo ini.",
    ],
    tasks: [],
    auditDossier: {
      version: "rebalance-krisis-capstone-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Memo Post-Mortem desk yang menyatakan keputusan rebalance 17 Maret 2020 sebagai KEBERHASILAN.",
      columns: ["No", "Pernyataan", "Status"],
      rows: [
        // ── I1: waktu ditulis dengan hindsight ──
        { rowId: 1, cells: { "No": "1", "Pernyataan": "Rebalance PENUH dieksekusi 23 Maret 2020 — tepat di titik terendah pasar", "Status": "Klaim waktu" }, claims: [{ label: "Waktu eksekusi", value: "Bottom 23 Mar" }] },
        { rowId: 2, cells: { "No": "2", "Pernyataan": "Drawdown S&P 500 pada hari keputusan (17 Mar): −30,20%", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "No": "3", "Pernyataan": "VIX pada hari keputusan: 79,18 — level kepanikan ekstrem", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: biaya dihilangkan ──
        { rowId: 4, cells: { "No": "4", "Pernyataan": "Biaya transaksi rebalance: nihil — eksekusi internal desk, tanpa broker", "Status": "Biaya" }, claims: [{ label: "Biaya", value: "Rp0" }] },
        { rowId: 5, cells: { "No": "5", "Pernyataan": "Drift total portofolio sebelum rebalance: 24,6 poin persen", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 6, cells: { "No": "6", "Pernyataan": "Turnover rebalance penuh: 12,3% dari nilai portofolio", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I3: benchmark diganti ──
        { rowId: 7, cells: { "No": "7", "Pernyataan": "Benchmark kinerja: indeks campuran kustom desk (60% ekuitas global / 40% obligasi)", "Status": "Benchmark" }, claims: [{ label: "Benchmark", value: "Kustom desk" }] },
        { rowId: 8, cells: { "No": "8", "Pernyataan": "Hasil vs benchmark: +1,2 pp — rebalance “menambah nilai”", "Status": "Klaim" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 9, cells: { "No": "9", "Pernyataan": "Porsi kas dikembalikan ke target 3,0% setelah rebalance", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I4: cash drag diabaikan ──
        { rowId: 10, cells: { "No": "10", "Pernyataan": "Return 30 hari pasca-rebalance: +8,4% — sudah NETO", "Status": "Kinerja" }, claims: [{ label: "Neto", value: "+8,4%" }] },
        { rowId: 11, cells: { "No": "11", "Pernyataan": "Keputusan diambil dalam 30 menit sesuai mandat komite", "Status": "Proses" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 12, cells: { "No": "12", "Pernyataan": "Drawdown maksimum periode: −34,08% (23 Mar 2020)", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 13, cells: { "No": "13", "Pernyataan": "VIX maksimum periode: 82,69 (16 Mar 2020)", "Status": "Fakta" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 14, cells: { "No": "14", "Pernyataan": "Metode: data SINTETIS berpola FRED (seed 42), dibekukan 2026-10-15", "Status": "Metode" }, claims: [{ label: "Kejujuran", value: "Dinyatakan" }] },
        // ── I2 lanjutan: asumsi spread normal ──
        { rowId: 15, cells: { "No": "15", "Pernyataan": "Lampiran biaya: spread normal 5 bps (kondisi pasar tenang)", "Status": "Asumsi" }, claims: [{ label: "Asumsi spread", value: "5 bps (normal)" }] },
        { rowId: 16, cells: { "No": "16", "Pernyataan": "Rekomendasi: pertahankan prosedur rebalance 30 menit untuk krisis berikutnya", "Status": "Rekomendasi" }, claims: [{ label: "Usulan", value: "Pertahankan" }] },
      ],
      injections: [
        { key: "waktu-hindsight", rowIds: [1], title: "Waktu eksekusi ditulis dengan hindsight", clue: "Keputusan 30 menit dibuat 17 MARET — saat itu 23 Maret masih masa depan. Tidak ada yang tahu itu bottom. Memo menuliskannya seolah desk “membeli tepat di titik terendah”.", danger: "Hindsight membuat keputusan buruk terlihat brilian; komite belajar pelajaran yang salah (“kita jago timing”) dan mengulanginya di krisis berikutnya — dengan keyakinan yang lebih besar." },
        { key: "biaya-dihilangkan", rowIds: [4, 15], title: "Biaya transaksi dihilangkan", clue: "Ringkasan: “nihil”; lampiran: spread normal 5 bps. Hitunganmu: turnover 12,3% × spread KRISIS 30 bps = 3,69 bps ≈ Rp738 jt dari Rp2 T. Biaya krisis ≠ biaya normal — spread MELEBAR tepat saat kamu paling butuh likuiditas.", danger: "Biaya yang “kecil” di kondisi normal membengkak di krisis; keputusan rebalance yang mengabaikannya membayar dengan uang nasabah — Rp738 juta yang tidak pernah muncul di memo." },
        { key: "benchmark-diganti", rowIds: [7], title: "Benchmark diganti diam-diam", clue: "IPS menetapkan benchmark 65% ekuitas global / 35% obligasi. Memo memakai “indeks campuran kustom desk” 60/40 TANPA pengungkapan — komposisi yang lebih ringan ekuitasnya, lebih mudah dikalahkan setelah kejatuhan ekuitas.", danger: "Benchmark yang bisa diganti = nilai tambah yang bisa dikarang. “+1,2 pp” (baris 8) adalah kemenangan atas lawan yang dipilih sendiri — komite menilai manajer dari angka yang manajernya sendiri tentukan." },
        { key: "cash-drag-diabaikan", rowIds: [10], title: "Cash drag diabaikan", clue: "“+8,4% NETO” — tapi kas 9% (vs target 3%) selama hari-hari sebelum rebalance tidak dimasukkan dalam hitungan; drag-nya hilang dari angka “neto”.", danger: "“Neto” yang tidak memasukkan semua biaya bukan neto — itu bruto berbaju neto. Komite mengira ia melihat hasil bersih, padahal melihat hasil yang sudah disisir." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Memo komite: keputusan + justifikasi waktu",
    prose: [
      "Semua bukti di tangan. Tulis memo komite investasi satu halaman — artefak portofoliomu sebagai manajer portofolio. Memo yang baik tidak hanya bilang “saya memilih parsial”, tapi menunjukkan ANGKA pilihannya, apa yang disembunyikan memo desk — dan yang paling penting, MEMPERTANGGUNGJAWABKAN WAKTU keputusanmu: kenapa tanggal itu, bukan menunggu bottom, bukan menunda sampai tenang.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): drift 24,6 pp, biaya penuh 3,69 bps vs parsial 1,845 bps, keputusanmu + tanggal eksekusi.",
        "Bukti kuantitatif: drawdown maks −34,08% (23 Mar), VIX maks 82,69 (16 Mar), drift 8 kelas aset, turnover & biaya kedua opsi, 5 hari drawdown terburuk.",
        "Temuan audit memo post-mortem: 4 suntikan + nomor barisnya.",
        "Justifikasi WAKTU: kenapa eksekusi pada tanggal itu (bukan menunggu bottom, bukan menunda sampai tenang); aturan jendela keputusan untuk krisis berikutnya (ambang VIX/drawdown + batas waktu).",
        "Batas & risiko sisa: data SINTETIS (bukan pasar nyata); biaya 30 bps adalah asumsi spread krisis; risiko whipsaw; parsial bukan jaminan.",
      ],
      rubric: [
        { criterion: "Kebenaran hitung", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Drawdown −34,08%, drift 24,6 pp, turnover 12,3%, biaya 3,69 bps — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut suntikan", "Menyebut sebagian tanpa baris bukti", "Keempat suntikan disebut dengan nomor baris"] },
        { criterion: "Justifikasi waktu", weight: 25, levels: ["Waktu tidak dibahas", "Ada tanggal eksekusi, tanpa alasan", "Tanggal + alasan + aturan jendela keputusan untuk krisis berikutnya"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim hasil berlaku umum", "Menyebut sebagian batas", "Batas (SINTETIS, asumsi 30 bps, whipsaw) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di memo post-mortem desk:",
      "1) **Waktu ditulis dengan hindsight** (baris 1): “dieksekusi tepat di titik terendah 23 Maret”. Keputusan 30 menit dibuat 17 Maret — saat itu 23 Maret masih MASA DEPAN. Tidak ada yang tahu itu bottom. Memo menulis sejarah seolah desk bisa melihat masa depan — dan komite yang percaya akan menuntut “timing seperti itu lagi” di krisis berikutnya.",
      "2) **Biaya dihilangkan** (baris 4, 15): ringkasan bilang “nihil”, lampiran memakai spread normal 5 bps. Hitunganmu: 12,3% × 30 bps = 3,69 bps ≈ Rp738 juta dari Rp2 triliun. Biaya krisis BUKAN biaya normal — spread melebar tepat saat kamu paling butuh likuiditas, dan Rp738 juta itu tidak pernah muncul di memo.",
      "3) **Benchmark diganti** (baris 7): IPS menetapkan 65% ekuitas global / 35% obligasi; memo memakai “indeks campuran kustom desk” 60/40 tanpa pengungkapan. Setelah kejatuhan ekuitas, benchmark yang lebih ringan ekuitasnya lebih mudah dikalahkan — “+1,2 pp” (baris 8) adalah kemenangan atas lawan yang dipilih sendiri.",
      "4) **Cash drag diabaikan** (baris 10): “+8,4% neto” — tapi kas 9% (vs target 3%) selama hari-hari sebelum rebalance tidak dihitung. “Neto” yang tidak memasukkan semua biaya bukan neto — itu bruto berbaju neto.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim memo terhadap data mentah, atau memercayai kop surat desk. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — penuh membayar di spread termahal, tunda membayar dengan rebound yang terlewat, parsial membayar dengan ketidakpuasan semua orang.",
      "Bahaya nyata terakhir: **whipsaw**. Rebalance penuh 17 Maret membeli ekuitas yang masih jatuh −5,5% ke 23 Maret — lalu rebound. Bergerak dua kali (beli, lalu sesali, lalu kejar) membayar 3,69 bps per putaran. Di krisis, whipsaw bukan kemungkinan — ia adalah pajak atas keputusan tanpa aturan. Dan aturan itu tidak ditulis saat krisis; ia ditulis SEBELUM krisis — itulah gunanya Langkah 12.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: “rebalance di bottom” adalah strategi",
      type: "risk",
      body: "Bottom hanya terlihat dari kaca spion. Strategi yang bergantung pada “beli di bottom” = strategi yang bergantung pada meramal — dan meramal bukan pekerjaan manajer portofolio. Pekerjaannya: ATURAN (ambang drift, jendela waktu, kapan penuh vs parsial vs tunda) yang bekerja TANPA perlu tahu di mana bottom. Kalau rencanamu butuh tahu masa depan agar berhasil, itu bukan rencana.",
    },
  },
  {
    id: "protokol",
    eyebrow: "Langkah 12 · Protokol krisis",
    title: "Keputusan 30 menit yang baik ditulis sebelum krisis",
    prose: [
      "Keputusan 30 menit yang baik bukan keputusan tercepat — melainkan keputusan yang ATURANNYA sudah ditulis sebelum krisis datang. Saat VIX 79 dan telepon berdering, kamu tidak punya waktu berpikir dari nol; kamu hanya menjalankan protokol.",
      "Tulis protokol rebalance krisis versimu — 3 baris: (1) AMBANG: pada drift/VIX/drawdown berapa komite harus dikumpulkan; (2) JENDELA: berapa lama waktu keputusan dan siapa yang memutuskan bila ketua tidak bisa dihubungi; (3) ATURAN OPSI: kapan penuh, kapan parsial, kapan tunda — dalam angka, bukan firasat. Protokol ini adalah deliverable keduamu: yang akan menyelamatkanmu di krisis berikutnya.",
    ],
    tasks: [
      { id: "t1", text: "Tulis 3 baris protokol (ambang + jendela waktu + penanggung jawab)" },
      { id: "t2", text: "Tulis aturan “penuh vs parsial vs tunda” dalam 2 kalimat berangka" },
    ],
    note: {
      title: "Protokol adalah keputusan yang dibayar di muka",
      body: "Menulis “bila drift > 20 pp DAN VIX > 60: kumpulkan komite dalam 24 jam, putuskan dalam 30 menit, default = parsial” terasa birokratis di hari tenang. Tapi pada 17 Maret 2020, satu kalimat itu bernilai Rp369 juta — selisih antara panik dan prosedur. Krisis tidak memberi waktu berpikir; ia hanya memberi waktu menjalankan apa yang sudah dipikirkan.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Drawdown S&P 500 −34,08% (puncak 2020-02-14 → lembah 2020-03-23); VIX maks 82,69 (2020-03-16) — kepanikan ekstrem; data SINTETIS berpola FRED, bukan pasar nyata.",
      "Drift total 24,6 pp (Kas +6,0 pp terbesar); turnover rebalance penuh 12,3% → biaya 3,69 bps (≈ Rp738 jt dari Rp2 T) dengan spread krisis 30 bps; parsial (50% drift) = separuhnya.",
      "Lima hari drawdown terdalam semuanya dalam 17–23 Maret 2020 — kepanikan datang borongan, bukan cicilan.",
      "Tiga opsi, tiga harga: penuh (bayar mahal di spread termahal + risiko pisau jatuh), tunda (risiko ketinggalan rebound V-shape), parsial (tidak ada bencana, tidak ada sempurna).",
      "Empat pola sabotase memo pasca-krisis: waktu ditulis dengan hindsight, biaya dihilangkan, benchmark diganti, cash drag diabaikan.",
      "Bahaya nyata: whipsaw — pajak atas keputusan tanpa aturan. Keputusan 30 menit yang baik aturannya ditulis SEBELUM krisis (protokol: ambang + jendela + aturan opsi).",
    ],
  },
];

(misiGabungRebalanceKrisis.steps as V2Step[]).push(...LANJUTAN_REBALANCE_KRISIS);

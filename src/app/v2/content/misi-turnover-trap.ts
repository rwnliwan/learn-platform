import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── Misi Turnover: Sharpe Tinggi yang Menipu ──────────────────────────────
// M2 — WorldQuant Brain Misi B (solo). Dataset SINTETIS: 15 kandidat alpha
// fiksi ber-Sharpe tinggi (seed 42) — BUKAN data asli, TANPA ekspresi alpha
// mentah. File: public/misi/misi-turnover-trap/kandidat_turnover.csv.
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-turnover-trap";

export const misiTurnover: V2Mission = {
  slug: "misi-turnover-trap",
  track: "WorldQuant Brain",
  module: "Misi",
  title: "Misi Turnover: Sharpe Tinggi yang Menipu",
  estMinutes: 135,
  role: "Analis kuantitatif",
  client:
    "Kepala riset — 15 kandidat ber-Sharpe tinggi harus dievaluasi setelah biaya sebelum ada yang disubmit",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Sharpe 2,35 seharusnya kabar baik",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis kuantitatif — evaluator kelayakan ekonomi kandidat alpha",
        client:
          "Kepala riset. Batch ini istimewa: 15 kandidat dengan Sharpe kotor 1,70–2,40 — angka yang biasanya langsung masuk antrean submit. Tapi dua kandidat terbaik punya turnover di atas 45%, dan tim pernah terbakar tahun lalu: alpha dengan Sharpe 2,1 yang setelah dikurangi biaya broker ternyata return bersihnya negatif. Tugasmu: hitung Sharpe EFEKTIF (setelah biaya) untuk semua kandidat dengan model biaya sederhana, terapkan aturan triase yang sama seperti misi sebelumnya, dan putuskan nasib 3 kandidat borderline. Tidak ada yang disubmit sebelum lolos saringanmu.",
        story: [
          "Kamis, 10:40. Kepala riset meletakkan printout di mejamu — 15 baris, semuanya hijau. “Lihat ini,” katanya, “Sharpe tertinggi 2,38. Kalau angka ini jujur, kita submit lima hari ini juga.” Kamu menatap kolom turnover: 53,4%. 46,6%. 46,6%. Senyummu memudar. Kamu ingat alpha tahun lalu — Sharpe 2,1 di atas kertas, minus setelah biaya. Tim menertawakannya selama sebulan.",
          "Masalahnya sederhana dan mematikan: Sharpe yang dilaporkan platform adalah Sharpe KOTOR — sebelum biaya transaksi. Setiap kali posisi berganti, broker mengambil bagiannya. Alpha yang berganti posisi 50%+ per hari membayar “pajak” yang begitu besar sehingga Sharpe 2,35-nya tinggal kenangan.",
          "Misi ini mengajarkan perhitungan yang memisahkan analis junior dari analis senior: bukan “berapa Sharpe-nya”, melainkan “berapa Sharpe-nya SETELAH biaya”. Dan seperti biasa, seseorang sudah menyiapkan “laporan evaluasi” yang mengklaim semuanya beres — lengkap dengan 4 sabotase untuk kamu temukan.",
        ],
        objectives: [
          "Menghitung Sharpe efektif (Sharpe kotor − biaya turnover) untuk 15 kandidat dengan model biaya sederhana k=2, lalu menerapkan aturan triase yang konsisten.",
          "Memeringkat kandidat berdasarkan Sharpe efektif dan mengidentifikasi kandidat “Sharpe tinggi yang menipu” (kotor tinggi, bersih jatuh).",
          "Memutuskan nasib 3 kandidat borderline (antrekan / tahan / buang) dan menemukan 4 sabotase di laporan evaluasi.",
        ],
        prereqSummary:
          "Alpha = sebuah formula sinyal trading (aturan “kapan beli/jual” yang bisa diuji). Sharpe = ukuran return per unit risiko — makin tinggi makin bagus, TAPI angka yang umum dilaporkan adalah Sharpe kotor (sebelum biaya). Turnover = seberapa sering posisi berganti; makin tinggi, makin besar biaya yang menggerogoti return. Self-correlation = kemiripan sebuah alpha dengan alpha yang sudah ada; aturan praktisnya: kemiripan di atas 0,7 = duplikat, jangan submit.",
        datasetNote:
          "Data 100% SINTETIS: 15 kandidat alpha fiksi ber-Sharpe tinggi hasil generator acak (seed 42) — BUKAN data asli, BUKAN kandidat submit siapa pun, TANPA ekspresi alpha mentah, TANPA kredensial/data akun.\nFile: kandidat_turnover.csv — kolom id, sharpe (kotor), fitness, turnover (persen), decay, universe (satu kandidat memakai universe “TEST” yang tak terverifikasi — disengaja, bahan audit).\nModel biaya (k=2) & ambang disederhanakan untuk latihan. Metode & batas jujur: file METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Lima belas kandidat, satu kolom yang hilang",
      prose: [
        "File `kandidat_turnover.csv`: 15 baris kandidat fiksi — `id`, `sharpe` (KOTOR, sebelum biaya), `fitness`, `turnover` (persen), `decay` (parameter penghalusan sinyal; decay lebih tinggi biasanya = turnover lebih rendah), dan `universe`. Perhatikan: TIDAK ADA kolom Sharpe bersih. Kolom itu tidak diberikan — karena menghitungnya adalah PEKERJAANMU.",
        "Data ini SINTETIS (seed 42) — dinyatakan eksplisit. Satu detail disengaja: kandidat BT-015 memakai universe “TEST” — universe yang tak terverifikasi. Catat baik-baik; ia akan muncul lagi di audit.",
        "Model biaya misi ini (sederhana, ilustratif): setiap 1 poin turnover memakan 0,02 Sharpe (k=2). Rumusnya ada di Lab 1 — lengkap dengan contoh angka dan interpretasinya.",
      ],
      tasks: [
        { id: "t1", text: "Buka `kandidat_turnover.csv`: catat Sharpe kotor tertinggi dan turnover tertinggi" },
        { id: "t2", text: "Temukan kandidat ber-universe “TEST” — catat ID-nya" },
      ],
      note: {
        title: "Miskonsepsi #1: Sharpe yang dipamerkan = Sharpe yang kamu dapat",
        type: "pitfall",
        body: "“BT-006 Sharpe 2,38 — submit sekarang!” Tunggu. Angka 2,38 adalah Sharpe KOTOR: return dibagi risiko SEBELUM biaya transaksi dikurangi. Setelah biaya (turnover 14,5%), Sharpe efektifnya 2,09 — masih bagus, tapi bukan 2,38. Dan untuk BT-012 (Sharpe 2,35, turnover 46,6%), koreksinya jauh lebih brutal. Aturan main misi ini: tidak ada keputusan sebelum kolom “Sharpe bersih” terisi.",
      },
      reference:
        "kandidat_turnover.csv (15 baris SINTETIS, seed 42). Sharpe di file = KOTOR; Sharpe bersih dihitung di lab dengan S_eff = S − 2×TO/100.",
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 3 · Lab 1 — Sharpe setelah biaya",
      title: "Berapa yang tersisa setelah broker mengambil bagiannya?",
      prose: [
        "Hitung Sharpe efektif untuk semua 15 kandidat: S_efektif = S − k × TO/100 dengan k=2. Lalu terapkan aturan triase yang SAMA seperti misi triase — tetapi memakai Sharpe EFEKTIF sebagai S (urutan prioritas tetap: BUANG > PENALTI > ANTRIAN > TAHAN). Terakhir: temukan kandidat dengan Sharpe KOTOR tertinggi yang jatuh ke BUANG — ia adalah poster anak misi ini.",
        "Contoh perhitungan (BT-006): S=2,38, TO=14,5% → S_eff = 2,38 − 2×14,5/100 = 2,38 − 0,29 = 2,09. Setiap 10 poin turnover memakan ~0,2 Sharpe.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `s_eff` (Sharpe efektif) untuk semua kandidat dengan k=2" },
        { id: "t2", text: "Terapkan aturan triase memakai `s_eff`; hitung `n_antrian`, `n_tahan`, `n_buang`, `n_penalti`" },
        { id: "t3", text: "Temukan `id_buang_top` (Sharpe kotor tertinggi yang BUANG) dan `id_penalti_top` (Sharpe kotor tertinggi yang PENALTI)" },
      ],
      expected:
        "n_antrian=6, n_tahan=4, n_buang=3, n_penalti=2; BT-006: 2,38 → 2,09; Sharpe kotor tertinggi yang BUANG: BT-002 (2,01 → 0,94); yang PENALTI: BT-012 (2,35, TO 46,6%)",
      formula: String.raw`S_{\text{efektif}} = S - k \cdot \frac{TO}{100}`,
      formulaNote:
        "S = Sharpe kotor (sebelum biaya), TO = turnover dalam persen, k = 2 (konstanta biaya model sederhana misi ini). Contoh BT-012: 2,35 − 2×46,6/100 = 2,35 − 0,93 = 1,42 — nyaris 1 poin Sharpe hilang untuk biaya. Interpretasi: model ini bilang setiap 50 poin turnover menghapus ~1,0 Sharpe.",
      note: {
        title: "Miskonsepsi #2: turnover tinggi = alpha aktif = alpha bagus",
        type: "pitfall",
        body: "“Turnover 53% artinya sinyalnya responsif terhadap pasar — bagus dong?” Responsif iya; gratis tidak. Setiap pergantian posisi membayar spread + komisi. BT-002 (Sharpe kotor 2,01, turnover 53,4%) kehilangan 1,07 Sharpe untuk biaya → bersih 0,94 → BUANG. Turnover tinggi bukan dosa — tapi ia punya harga, dan harga itu harus dikurangkan SEBELUM kamu jatuh cinta pada angkanya.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Sharpe efektif: `df[\"s_eff\"] = (df[\"sharpe\"] - K * df[\"turnover\"] / 100).round(2)` dengan K = 2.0.",
        "Fungsi `kategori` sudah disediakan — ia memakai kolom `s_eff` sebagai S. Terapkan dengan `df.apply(kategori, axis=1)`.",
        "Sharpe kotor tertinggi yang BUANG: saring `df[df[\"kategori\"]==\"BUANG\"]`, urut `sharpe` menurun, ambil id baris pertama.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-turnover-trap/kandidat_turnover.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "K = ...                 # konstanta biaya model (lihat rumus)",
          "df[\"s_eff\"] = ...     # Sharpe efektif, bulatkan 2 desimal",
          "s_eff_bt006 = ...       # Sharpe efektif BT-006 (untuk cek)",
          "",
          "def kategori(r):",
          "    if r[\"s_eff\"] < 1.25 or r[\"fitness\"] < 1.0:",
          "        return \"BUANG\"",
          "    if r[\"turnover\"] > 40:",
          "        return \"PENALTI\"",
          "    if r[\"s_eff\"] >= 1.4 and r[\"fitness\"] >= 1.1:",
          "        return \"ANTRIAN\"",
          "    return \"TAHAN\"",
          "",
          "df[\"kategori\"] = ...",
          "",
          "n_antrian = ...",
          "n_tahan = ...",
          "n_buang = ...",
          "n_penalti = ...",
          "",
          "df_buang = ...         # hanya baris BUANG, urut sharpe KOTOR menurun",
          "id_buang_top = ...     # id baris pertama",
          "df_penalti = ...       # hanya baris PENALTI, urut sharpe KOTOR menurun",
          "id_penalti_top = ...   # id baris pertama",
          "",
          "print(\"komposisi:\", n_antrian, n_tahan, n_buang, n_penalti)",
          "print(\"BUANG tersharpe:\", id_buang_top, \"| PENALTI tersharpe:\", id_penalti_top)",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-turnover-trap/kandidat_turnover.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "K = 2.0",
          "df[\"s_eff\"] = (df[\"sharpe\"] - K * df[\"turnover\"] / 100).round(2)",
          "s_eff_bt006 = float(df.loc[df[\"id\"] == \"BT-006\", \"s_eff\"].iloc[0])",
          "",
          "def kategori(r):",
          "    if r[\"s_eff\"] < 1.25 or r[\"fitness\"] < 1.0:",
          "        return \"BUANG\"",
          "    if r[\"turnover\"] > 40:",
          "        return \"PENALTI\"",
          "    if r[\"s_eff\"] >= 1.4 and r[\"fitness\"] >= 1.1:",
          "        return \"ANTRIAN\"",
          "    return \"TAHAN\"",
          "",
          "df[\"kategori\"] = df.apply(kategori, axis=1)",
          "",
          "n_antrian = int((df[\"kategori\"] == \"ANTRIAN\").sum())",
          "n_tahan = int((df[\"kategori\"] == \"TAHAN\").sum())",
          "n_buang = int((df[\"kategori\"] == \"BUANG\").sum())",
          "n_penalti = int((df[\"kategori\"] == \"PENALTI\").sum())",
          "",
          "df_buang = df[df[\"kategori\"] == \"BUANG\"].sort_values(\"sharpe\", ascending=False)",
          "id_buang_top = df_buang.iloc[0][\"id\"]",
          "df_penalti = df[df[\"kategori\"] == \"PENALTI\"].sort_values(\"sharpe\", ascending=False)",
          "id_penalti_top = df_penalti.iloc[0][\"id\"]",
          "",
          "print(\"komposisi:\", n_antrian, n_tahan, n_buang, n_penalti)",
          "print(\"BUANG tersharpe:\", id_buang_top, \"| PENALTI tersharpe:\", id_penalti_top)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t2", label: "`n_antrian` = 6", name: "n_antrian", value: 6, msg: "6 kandidat lolos S_eff≥1.4 & F≥1.1 & TO≤40." },
          { kind: "equal", task: "t2", label: "`n_buang` = 3", name: "n_buang", value: 3, msg: "3 kandidat S_eff<1.25 — semuanya korban biaya, bukan sinyal jelek." },
          { kind: "equal", task: "t2", label: "`n_penalti` = 2", name: "n_penalti", value: 2, msg: "2 kandidat turnover >40%: BT-001 (42,2%) dan BT-012 (46,6%)." },
          { kind: "equal", task: "t2", label: "`n_tahan` = 4", name: "n_tahan", value: 4, msg: "Sisanya 4 TAHAN. Total harus 15." },
          { kind: "equal", task: "t1", label: "s_eff BT-006 = 2,09", name: "s_eff_bt006", value: 2.09, tol: 0.01, msg: "2,38 − 2×14,5/100 = 2,09. Definisikan s_eff_bt006 dari baris BT-006." },
          { kind: "equal", task: "t3", label: "`id_buang_top` = BT-002", name: "id_buang_top", value: "BT-002", msg: "Sharpe kotor 2,01 → bersih 0,94. Urut kolom sharpe (KOTOR), bukan s_eff." },
          { kind: "equal", task: "t3", label: "`id_penalti_top` = BT-012", name: "id_penalti_top", value: "BT-012", msg: "Sharpe kotor 2,35 (tertinggi kedua batch!) tapi TO 46,6% → PENALTI." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Peringkat setelah biaya",
      title: "Urutkan ulang dunia berdasarkan yang bersih",
      prose: [
        "Kepala riset ingin satu tabel peringkat untuk rapat: 5 kandidat teratas berdasarkan Sharpe EFEKTIF. Kamu harus menghitung Sharpe efektif DI DALAM SQL (kolomnya tidak ada di tabel) — `ROUND(sharpe - 2*turnover/100, 2)` — lalu mengurutkannya menurun. Perhatikan dua kandidat dengan Sharpe efektif sama (1,87): pemecah seri = id terkecil dulu, agar peringkat deterministik.",
        "Tabel `kandidat(id TEXT, sharpe REAL, fitness REAL, turnover REAL, decay INTEGER, universe TEXT)` — 15 baris data SINTETIS yang sama.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query 5 teratas: hitung sharpe_efektif di SQL, urut menurun (seri → id)" },
      ],
      expected: "5 baris — BT-006 (2,09), BT-007 (2,00), BT-003 (1,87), BT-014 (1,87), BT-004 (1,72)",
      sqlLab: {
        task: "Peringkat 5 teratas: hitung sharpe_efektif = ROUND(sharpe - 2*turnover/100, 2) di SQL. Tampilkan id + sharpe + turnover + sharpe_efektif, urut sharpe_efektif menurun (seri: id terkecil dulu), LIMIT 5.",
        schema: "CREATE TABLE kandidat (id TEXT, sharpe REAL, fitness REAL, turnover REAL, decay INTEGER, universe TEXT);",
        seedData: [
          "INSERT INTO kandidat VALUES",
          "('BT-001',2.24,1.05,42.2,5,'ASI'),",
          "('BT-002',2.01,1.27,53.4,3,'USA'),",
          "('BT-003',2.3,1.03,21.3,1,'USA'),",
          "('BT-004',2.19,1.36,23.5,3,'ASI'),",
          "('BT-005',1.77,1.19,28.5,1,'ASI'),",
          "('BT-006',2.38,1.17,14.5,1,'USA'),",
          "('BT-007',2.23,1.08,11.5,1,'USA'),",
          "('BT-008',2.25,1.42,28.8,5,'USA'),",
          "('BT-009',1.79,1.17,16.3,3,'USA'),",
          "('BT-010',2.02,1.12,38.5,5,'USA'),",
          "('BT-011',1.96,1.14,26.9,5,'USA'),",
          "('BT-012',2.35,1.3,46.6,3,'USA'),",
          "('BT-013',2.15,1.27,40.0,3,'EUR'),",
          "('BT-014',2.28,1.27,20.6,1,'USA'),",
          "('BT-015',2.01,1.28,46.6,1,'TEST');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT id, sharpe, turnover\nFROM kandidat\n",
        solution: [
          "SELECT id, sharpe, turnover,",
          "       ROUND(sharpe - 2*turnover/100, 2) AS sharpe_efektif",
          "FROM kandidat",
          "ORDER BY sharpe_efektif DESC, id",
          "LIMIT 5;",
        ].join("\n"),
        expectedColumns: ["id", "sharpe", "turnover", "sharpe_efektif"],
        expectedRows: [
          ["BT-006", 2.38, 14.5, 2.09],
          ["BT-007", 2.23, 11.5, 2.0],
          ["BT-003", 2.3, 21.3, 1.87],
          ["BT-014", 2.28, 20.6, 1.87],
          ["BT-004", 2.19, 23.5, 1.72],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiTurnover;

// ── lanjutan misiTurnover: langkah 5–12 ────────────────────────────────────

const LANJUTAN_TURNOVER: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Tiga kandidat di garis batas",
    prose: [
      "Sebagian besar batch sudah jelas nasibnya: 6 ANTRIAN, 3 BUANG, 2 PENALTI. Tapi tiga kandidat duduk tepat di garis batas — dan garis batas adalah tempat analis dibayar mahal:",
      "BT-001: turnover 42,2% (PENALTI) tapi Sharpe efektif 1,40 — di atas ambang antrean. Kalau turnover-nya turun sedikit saja, ia lolos.",
      "BT-010: Sharpe efektif TEPAT 1,25 (batas BUANG), turnover 38,5% (hampir penalti). Satu angka di dua garis batas sekaligus.",
      "BT-013: Sharpe efektif 1,35 (di bawah 1,4 — TAHAN), turnover TEPAT 40,0% (di bawah penalti — lolos 0,0 poin).",
      "Keputusan ini tercatat seperti memo yang sudah dikirim. Pilih strategimu untuk ketiganya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Apa keputusanmu untuk tiga kandidat borderline (BT-001, BT-010, BT-013)?",
      options: [
        {
          id: "opt-ketat",
          label: "Ikuti aturan apa adanya — BT-001 PENALTI, BT-010 & BT-013 TAHAN",
          rationale:
            "Aturan tidak mengenal “hampir”. BT-001 dikembalikan untuk diperbaiki (naikkan decay → turnover turun); BT-010 dan BT-013 menunggu bukti tambahan. Penalti dan tahan bukan vonis mati.",
          nextStepId: "kons-ketat",
          consequenceNote:
            "BT-001 diperbaiki (decay naik, turnover turun ke 31%) → Sharpe efektif naik ke 1,62 → ANTRIAN. BT-010/BT-013 tetap TAHAN menunggu bukti.",
        },
        {
          id: "opt-longgar",
          label: "Longgarkan ambang — BT-001 & BT-013 masuk antrean (S_eff ≥1,35 ≈ 1,4; TO ≤42% ≈ 40%)",
          rationale:
            "Ambang 1,4 dan 40% itu angka bulat manusia, bukan hukum fisika. BT-001 (S_eff 1,40) dan BT-013 (S_eff 1,35, TO tepat 40%) “cukup dekat” — jangan biarkan birokrasi membunuh dua kandidat bagus.",
          nextStepId: "kons-longgar",
          consequenceNote:
            "BT-001 disubmit; biaya aktual ternyata lebih besar dari model k=2 → return bersih negatif. Slot submit hangus + penalti turnover.",
        },
        {
          id: "opt-buang",
          label: "Buang ketiganya — fokus pada 6 ANTRIAN yang bersih",
          rationale:
            "Kandidat borderline = kandidat bermasalah. Enam ANTRIAN sudah cukup untuk minggu ini; menghabiskan energi untuk yang “hampir” adalah pemborosan.",
          nextStepId: "kons-buang",
          consequenceNote:
            "BT-010 diperbaiki tim lain (turnover turun ke 24%, S_eff naik ke 1,53) dan disubmit — kamu sudah membuangnya. TAHAN ≠ BUANG.",
        },
      ],
    },
  },
  {
    id: "kons-ketat",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: aturan apa adanya",
    prose: [
      "Keputusanmu dikirim. BT-001 dikembalikan ke meja periset dengan catatan: “turnover 42,2% — naikkan decay, kirim ulang.” Dua hari kemudian ia kembali: decay naik, turnover turun ke 31%, Sharpe efektif naik ke 1,62 — lolos ANTRIAN dengan bersih, tanpa drama. BT-010 dan BT-013 tetap TAHAN, menunggu bukti tambahan; tidak ada yang memprotes karena aturannya tertulis dan sama untuk semua.",
      "Pelajaran: PENALTI dan TAHAN bukan vonis mati — keduanya berarti “perbaiki dulu, datang lagi”. Aturan yang ditegakkan konsisten justru MELINDUNGI kandidat borderline: mereka dapat jalur perbaikan yang jelas, bukan penolakan misterius.",
    ],
    tasks: [],
    note: {
      title: "Jalur perbaikan > pengecualian",
      body: "Ketika seseorang memintamu “melonggarkan sedikit” untuk kandidat favoritnya, tawarkan jalur perbaikan sebagai gantinya: “naikkan decay-nya, kalau turnover turun di bawah 40% ia otomatis masuk antrean.” Kamu tidak menolak orangnya — kamu menegakkan aturannya.",
    },
  },
  {
    id: "kons-longgar",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: ambang dilonggarkan",
    prose: [
      "BT-001 dan BT-013 masuk antrean. BT-001 bahkan disubmit minggu itu juga — Sharpe efektif 1,40, “cukup dekat” ke 1,4. Tiga minggu kemudian laporan P&L datang: return bersih BT-001 NEGATIF. Model biaya k=2 yang kamu pakai ternyata masih OPTIMISTIS — biaya aktual (spread + slippage di jam sibuk) setara k=2,8. Ambang 40% yang kamu sebut “birokrasi” ternyata adalah garis pertahanan terakhir sebelum zona itu.",
      "Pelajaran yang mahal: ambang memang angka bulat manusia — tapi ia ditaruh di sana karena seseorang pernah terbakar tepat di seberangnya. “Cukup dekat” ke ambang biaya = masih di dalam zona biaya.",
    ],
    tasks: [],
    note: {
      title: "Model sederhanamu hampir pasti optimistis",
      type: "risk",
      body: "Model biaya k=2 di misi ini adalah PENYEDERHANAAN — biaya nyata hampir selalu lebih besar (slippage, market impact, jam sibuk). Analis senior memperlakukan model biaya sebagai BATAS BAWAH, bukan estimasi tepat. Kalau kandidat hanya “cukup dekat” di model yang optimistis, ia gagal di dunia nyata.",
    },
  },
  {
    id: "kons-buang",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: ketiganya dibuang",
    prose: [
      "Tiga kandidat borderline dibuang; enam ANTRIAN diproses. Bersih dan cepat — sampai dua minggu kemudian tim riset sebelah mempresentasikan “temuan menarik”: BT-010, kandidat yang kamu buang, setelah decay-nya dinaikkan turnover-nya turun ke 24% dan Sharpe efektifnya naik ke 1,53. Mereka mensubmit-nya. Kamu membuang kandidat yang hanya butuh satu perbaikan kecil.",
      "Pelajaran yang mahal: TAHAN ≠ BUANG. TAHAN berarti “belum cukup bukti, perbaiki dulu”; BUANG berarti “selesai”. Mencampuradukkan keduanya = membuang opsi yang masih hidup. Konservatisme yang malas (buang semua yang tidak jelas) sama berbahayanya dengan kelonggaran yang ceroboh.",
    ],
    tasks: [],
    note: {
      title: "Bedakan “belum” dari “tidak”",
      body: "BT-010 (S_eff tepat 1,25) adalah “belum” — satu perbaikan kecil mengubah nasibnya. BT-002 (S_eff 0,94, TO 53,4%) adalah “tidak” — tidak ada perbaikan wajar yang menyelamatkannya. Analis yang baik membedakan keduanya; analis yang malas membuang keduanya.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 12 baris: laporan evaluasi yang “beres” itu bohong",
    prose: [
      "Sebelum menulis rekomendasi final, satu misi audit. Di bawah ini 12 baris “Laporan Evaluasi Kandidat — semua beres, siap submit”, dokumen yang mengklaim sudah menghitung Sharpe bersih dengan benar untuk semua kandidat. Empat sabotase disuntikkan. Senjatamu: hasil lab-mu — Sharpe efektif versi k=2 dan tabel mentah 15 baris.",
      "Cara kerja: hitung ulang Sharpe bersih setiap baris yang mencurigakan dari data MENTAH, dan periksa kolom universe satu per satu.",
    ],
    tasks: [],
    auditDossier: {
      version: "turnover-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Evaluasi Kandidat yang menyatakan semua kandidat “beres, siap submit” setelah perhitungan Sharpe bersih. Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
      columns: ["ID", "Sharpe", "Turnover", "Sharpe bersih", "Universe", "Keputusan"],
      rows: [
        { rowId: 1, cells: { "ID": "BT-003", "Sharpe": "2,30", "Turnover": "21,3%", "Sharpe bersih": "1,87", "Universe": "USA", "Keputusan": "TAHAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 2, cells: { "ID": "BT-004", "Sharpe": "2,19", "Turnover": "23,5%", "Sharpe bersih": "1,72", "Universe": "ASI", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 3, cells: { "ID": "BT-006", "Sharpe": "2,38", "Turnover": "14,5%", "Sharpe bersih": "2,09", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 4, cells: { "ID": "BT-007", "Sharpe": "2,23", "Turnover": "11,5%", "Sharpe bersih": "2,00", "Universe": "USA", "Keputusan": "TAHAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 5, cells: { "ID": "BT-009", "Sharpe": "1,79", "Turnover": "16,3%", "Sharpe bersih": "1,46", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 6, cells: { "ID": "BT-011", "Sharpe": "1,96", "Turnover": "26,9%", "Sharpe bersih": "1,42", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 7, cells: { "ID": "BT-014", "Sharpe": "2,28", "Turnover": "20,6%", "Sharpe bersih": "1,87", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        { rowId: 8, cells: { "ID": "BT-002", "Sharpe": "2,01", "Turnover": "53,4%", "Sharpe bersih": "0,94", "Universe": "USA", "Keputusan": "BUANG" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
        // ── I1: turnover dihitung pada decay yang salah ──
        { rowId: 9, cells: { "ID": "BT-008", "Sharpe": "2,25", "Turnover": "16,2% (decay=1)", "Sharpe bersih": "1,93", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Turnover dihitung pada decay=1" }] },
        // ── I2: model biaya terlalu optimistis ──
        { rowId: 10, cells: { "ID": "BT-010", "Sharpe": "2,02", "Turnover": "38,5%", "Sharpe bersih": "1,64", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Model biaya k=1 (asumsi broker murah)" }] },
        // ── I3: Sharpe dilaporkan sebelum biaya ──
        { rowId: 11, cells: { "ID": "BT-012", "Sharpe": "2,35", "Turnover": "46,6%", "Sharpe bersih": "2,35", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sharpe final — siap submit" }] },
        // ── I4: universe tak terverifikasi ──
        { rowId: 12, cells: { "ID": "BT-015", "Sharpe": "2,01", "Turnover": "46,6%", "Sharpe bersih": "1,08", "Universe": "USA", "Keputusan": "ANTRIAN" }, claims: [{ label: "Klaim", value: "Sudah dihitung setelah biaya" }] },
      ],
      injections: [
        { key: "decay-salah", rowIds: [9], title: "Turnover dihitung pada decay yang salah", clue: "Dossier menghitung turnover BT-008 pada decay=1 (16,2%) → Sharpe bersih 1,93. Data mentah: BT-008 terdaftar dengan decay=5, turnover 28,8% → Sharpe bersih 1,67. Turnover turun saat decay naik — memakai angka decay 1 untuk kandidat decay 5 = biaya diremehkan.", danger: "Decay dan turnover adalah pasangan yang tidak bisa dipisahkan. Salah decay = salah biaya = salah keputusan. Di produksi, kandidat seperti ini lolos submit lalu return-nya habis dimakan biaya yang “tidak terlihat” di laporan." },
        { key: "biaya-optimistis", rowIds: [10], title: "Model biaya terlalu optimistis", clue: "Dossier memakai k=1 (“asumsi broker murah”) → Sharpe bersih BT-010 = 1,64 (ANTRIAN). Hitungan lab-mu dengan k=2: 1,25 (TAHAN). Selisih 0,39 Sharpe — lebih besar dari selisih antar kandidat — berasal dari SATU asumsi yang diganti diam-diam.", danger: "Asumsi biaya adalah tuas paling ampuh untuk memanipulasi peringkat: kecilkan k, semua kandidat terlihat bagus. Itulah kenapa model biaya harus ditulis eksplisit dan tidak boleh diganti tanpa jejak." },
        { key: "sharpe-kotor", rowIds: [11], title: "Sharpe dilaporkan sebelum biaya", clue: "Kolom “Sharpe bersih” BT-012 = 2,35 — SAMA PERSIS dengan Sharpe kotornya. Tidak ada pengurangan biaya sama sekali, padahal turnover-nya 46,6% (biaya = 0,93 Sharpe). Bonus: turnover >40% seharusnya = PENALTI, tapi dossier menulis ANTRIAN.", danger: "Ini sabotase paling berani: tidak menghitung sama sekali sambil mengklaim sudah menghitung. BT-012 adalah kandidat dengan Sharpe kotor tertinggi kedua di batch — justru yang paling menggoda untuk “tidak usah dihitung”." },
        { key: "universe-test", rowIds: [12], title: "Kandidat memakai universe tak terverifikasi", clue: "Dossier menulis universe BT-015 = USA. Data mentah: “TEST” — universe yang tak terverifikasi (kamu mencatatnya di Langkah 2). Sharpe bersihnya pun sebenarnya 1,08 (BUANG), tapi dossier menulis ANTRIAN.", danger: "Universe tak terverifikasi = datanya bisa apa saja — hasil backtest di universe mainan tidak berarti apa-apa di pasar nyata. Meloloskan kandidat TEST ke antrean submit = mempertaruhkan slot submit pada angka fantasi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Rekomendasi evaluasi + peringatan biaya",
    prose: [
      "Semua bukti di tangan: Sharpe efektif 15 kandidat, peringkat 5 teratas, keputusan 3 borderline, dan 4 sabotase dari audit. Tulis rekomendasi evaluasi — artefak portofoliomu. Rekomendasi yang baik tidak hanya bilang “siapa lolos”, tapi menunjukkan BERAPA biaya yang dimakan tiap kandidat dan di mana laporan internal berbohong.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Tabel evaluasi: 15 kandidat dengan Sharpe kotor → Sharpe efektif (k=2) → kategori (6 ANTRIAN / 4 TAHAN / 3 BUANG / 2 PENALTI).",
        "Peringkat 5 teratas berdasarkan Sharpe efektif + “biaya yang dimakan” tiap kandidat (S − S_eff) — soroti BT-012 sebagai kasus Sharpe tinggi yang menipu.",
        "Keputusan 3 borderline (BT-001, BT-010, BT-013): antrekan / tahan / buang + alasan + jalur perbaikan bila ada.",
        "Temuan audit: 4 sabotase di laporan evaluasi, masing-masing dengan nomor baris dossier dan hitungan pembanding dari data mentah.",
        "Batas & risiko sisa: model biaya k=2 adalah penyederhanaan (biaya nyata cenderung LEBIH besar); data SINTETIS; Sharpe efektif ≠ jaminan return masa depan.",
      ],
      rubric: [
        { criterion: "Kebenaran Sharpe efektif & kategori", weight: 30, levels: ["Angka salah/tidak konsisten", "Sebagian benar", "15 kandidat: S_eff tepat (k=2) + kategori sesuai prioritas BUANG > PENALTI > ANTRIAN > TAHAN"] },
        { criterion: "Peringkat & analisis biaya", weight: 25, levels: ["Peringkat memakai Sharpe kotor", "Peringkat benar, analisis biaya dangkal", "5 teratas tepat + biaya per kandidat dihitung + BT-012 dianalisis sebagai kasus menipu"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa bukti baris", "Keempat sabotase disebut dengan nomor baris + hitungan pembanding"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim model biaya = biaya nyata", "Menyebut sebagian batas", "Batas (k=2 penyederhanaan, biaya nyata > model; data SINTETIS) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan evaluasi yang “beres”:",
      "1) **Decay salah** (baris 9): turnover BT-008 dihitung pada decay=1 (16,2%), padahal kandidat terdaftar decay=5 (28,8%). Sharpe “bersih” 1,93 vs 1,67 yang sebenarnya — selisih 0,26 Sharpe dari satu parameter yang salah.",
      "2) **Biaya optimistis** (baris 10): model biaya diganti diam-diam dari k=2 menjadi k=1 (“asumsi broker murah”). BT-010: 1,64 (ANTRIAN) vs 1,25 (TAHAN) yang sebenarnya. Satu asumsi mengubah nasib — dan asumsi itu ditulis kecil di klaim, bukan di angka.",
      "3) **Sharpe kotor** (baris 11): kolom “Sharpe bersih” BT-012 = 2,35 = angka kotornya. Tidak dikurangi apa-apa. Plus: turnover 46,6% seharusnya PENALTI, ditulis ANTRIAN. Dua kebohongan dalam satu baris, pada kandidat yang paling menggoda.",
      "4) **Universe TEST** (baris 12): BT-015 ditulis “USA”, padahal data mentah “TEST” — universe tak terverifikasi. Kamu sudah mencatatnya di Langkah 2; dossier berharap kamu lupa.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu menghitung ulang dari data mentah, atau memercayai kolom “Sharpe bersih” yang sudah jadi.",
      "Bahaya nyata terakhir: alpha berbiaya tinggi yang lolos submit = return bersih negatif di dunia nyata + slot submit harian hangus + penalti turnover dari platform. Biaya adalah satu-satunya komponen return yang PASTI terjadi — return-nya belum tentu, biayanya sudah pasti. Analis yang mengabaikan biaya bukan optimis; ia sedang berhalusinasi dengan spreadsheet.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: “nanti biaya diurus belakangan”",
      type: "pitfall",
      body: "“Submit dulu, optimasi biaya kemudian.” Tidak bisa — biaya adalah SIFAT dari sinyal (seberapa sering ia berganti posisi), bukan aksesori yang bisa ditempel belakangan. Menurunkan turnover biasanya berarti mengubah sinyalnya sendiri (mis. menaikkan decay), yang mengubah Sharpe kotornya juga. Biaya harus masuk SEBELUM keputusan submit, bukan sesudah.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Sharpe efektif = Sharpe kotor − biaya turnover (model sederhana: S − 2×TO/100); 15 kandidat SINTETIS → 6 ANTRIAN / 4 TAHAN / 3 BUANG / 2 PENALTI.",
      "Kasus “Sharpe tinggi yang menipu”: BT-012 (kotor 2,35, TO 46,6% → PENALTI) dan BT-002 (kotor 2,01 → bersih 0,94 → BUANG) — biaya menghapus >0,9 Sharpe.",
      "Tiga borderline mengajarkan: aturan ditegakkan konsisten (ketat), ambang tidak dinegosiasi (longgar = return negatif), dan TAHAN ≠ BUANG (buang = opsi hangus).",
      "Empat sabotase laporan: decay salah, model biaya optimistis, Sharpe kotor dilaporkan sebagai bersih, universe TEST disamarkan jadi USA.",
      "Biaya adalah komponen return yang PASTI terjadi — model k=2 adalah penyederhanaan yang cenderung optimistis; data SINTETIS (seed 42), TANPA ekspresi alpha mentah — file METODE.md.",
    ],
  },
];

(misiTurnover.steps as V2Step[]).push(...LANJUTAN_TURNOVER);

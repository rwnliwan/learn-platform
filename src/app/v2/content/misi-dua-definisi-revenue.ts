import type { V2Mission } from "../lib/types";

// ── MISI Dua Definisi Revenue: Dua Definisi, Satu Kebohongan ─────────────
// M2 — Business Intelligence Misi B (edge). Dataset 100% SINTETIS, seed 42.
// File: public/misi/misi-dua-definisi-revenue/kas_masuk.csv (140 order) +
// pengakuan.csv (317 baris jadwal pengakuan) + definisi_metrik.csv.
// Metode: METODE.md.

const BASE = "/misi/misi-dua-definisi-revenue";

export const misiDuaDefinisi: V2Mission = {
  slug: "misi-dua-definisi-revenue",
  track: "Business Intelligence",
  module: "Misi",
  title: "Misi Metrik: Dua Definisi, Satu Kebohongan",
  estMinutes: 150,
  role: "Analis Business Intelligence (audit metrik)",
  client:
    "CFO — dashboard pertumbuhan H1 2026 akan dipresentasikan ke dewan; dua tim memakai definisi “revenue” yang berbeda",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tren yang naik terus itu mencurigakan",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis Business Intelligence — auditor metrik independen",
        client:
          "CFO. Deck pertumbuhan H1 2026 akan dipresentasikan ke dewan minggu depan. Slide 1: “Pendapatan Q1 tumbuh +81,8%.” Slide 2: “Pendapatan Q2 tumbuh +24,5%.” Tren naik terus — terlalu rapi untuk bisnis yang baru saja kehilangan sepertiga pipeline-nya di Q2. Finance mendefinisikan “revenue” sebagai kas masuk; Product mendefinisikannya sebagai pengakuan (recognized revenue). Dashboard memakai keduanya — bergantian — dan entah bagaimana hasilnya selalu naik. Kamu diminta mengaudit deck itu sebelum dewan melihatnya: rekonsiliasi dua definisi, tunjukkan selisihnya, dan tetapkan single source of truth.",
        story: [
          "Kamis, 16:40. CFO meneruskan deck ke kamu dengan satu kalimat: “Rapikan datanya sebelum dewan.” Kamu membuka slide 1: Q1 +81,8%. Slide 2: Q2 +24,5%. Kenaikan dua kuartal berturut-turut — di kuartal ketika tim sales justru mengeluh pipeline Q2 kering kerontang. Sesuatu tidak beres, dan kamu tahu di mana biasanya letak “sesuatu” itu: bukan di angkanya, melainkan di definisinya.",
          "Kamu menelepon Finance. “Revenue kami = kas masuk, diakui saat deal ditandatangani.” Kamu menelepon Product. “Revenue kami = pengakuan, diakui saat layanan diserahkan — langganan dibagi 4 bulan.” Dua definisi, dua angka, satu label: “pendapatan”. Dan dashboard — dengan polosnya — memakai definisi Finance di Q1 dan definisi Product di Q2. Kebetulan? Hasilnya selalu naik.",
          "Misi ini memakai data order sintetis H1 2026 (140 order) dalam dua file yang turun dari order yang SAMA: `kas_masuk.csv` (definisi Finance) dan `pengakuan.csv` (definisi Product). Tugasmu: rekonsiliasi keduanya dengan SQL, visualisasikan tren di bawah kedua definisi dengan Python, uji klaim pertumbuhan terhadap baseline yang jujur, temukan 3 sabotase di deck, dan tetapkan single source of truth sebelum dewan mengambil keputusan dari grafik yang berbohong.",
        ],
        objectives: [
          "Merekonsiliasi dua definisi revenue (kas masuk vs pengakuan) per bulan dan mengukur selisihnya.",
          "Memvisualisasikan tren H1 di bawah KEDUA definisi secara terpisah dan membuktikan klaim “naik terus” hanya mungkin dengan definisi bergantian.",
          "Menemukan 3 sabotase di deck pertumbuhan dan menulis nota single source of truth + dashboard yang diperbaiki.",
        ],
        prereqSummary:
          "“Revenue” bukan satu angka objektif — ia jawaban atas pertanyaan yang berbeda. Kas masuk (cash-in) menjawab “berapa uang yang masuk bulan ini?” (diakui saat order ditandatangani). Pengakuan (recognized revenue) menjawab “berapa nilai layanan yang diserahkan bulan ini?” (langganan dibagi sepanjang masa layanan). Keduanya benar; yang berbahaya adalah memakai keduanya bergantian dengan SATU label “pendapatan” — seolah-olah mereka angka yang sama.",
        datasetNote:
          "Status data: 100% SINTETIS — tidak ada pendapatan perusahaan nyata. Dibangkitkan oleh skrip build-misi/misi-dua-definisi-revenue/gen.py dengan seed tetap 42 (deterministik).\nFile: kas_masuk.csv (140 order: order_id, tanggal_order, nominal, tipe) = definisi Finance; pengakuan.csv (317 baris: order_id, bulan_pengakuan, nominal_diakui) = definisi Product; definisi_metrik.csv (D1 vs D2).\nRancangan jebakan: Q1 deal besar bertipe langganan (kas tinggi, pengakuan tersebar 4 bulan); Q2 deal kecil sekali bayar (kas jatuh, tapi sisa pengakuan Q1 mengalir ke Q2). Baseline Q4-2025 ditetapkan di misi (kas = 55% kas Q1; diakui = 90% diakui Q1). Metode lengkap: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file, satu kebenaran, dua cerita",
      prose: [
        "`kas_masuk.csv`: 140 order, satu baris per order. Kolom `tanggal_order` = kapan deal ditandatangani (uang masuk). Inilah definisi Finance (D1): revenue diakui SEKALI, penuh, di bulan order.",
        "`pengakuan.csv`: 317 baris jadwal pengakuan. Order `sekali` diakui penuh di bulan order; order `langganan` dibagi rata ke 4 bulan (bulan order + 3 bulan berikut). Inilah definisi Product (D2): revenue diakui saat layanan “diserahkan”. Kedua file turun dari order yang SAMA — selisihnya murni soal WAKTU pengakuan, bukan data berbeda.",
        "`definisi_metrik.csv` mencatat D1 vs D2 secara resmi. Aturan main: (1) jangan pernah mencampur dua definisi dalam satu tren tanpa label; (2) setiap klaim pertumbuhan wajib menyebut definisi + periode pembandingnya; (3) total H1 kedua definisi HARUS sama (semua pengakuan terjadi di dalam semester) — kalau tidak sama, ada yang salah hitung.",
      ],
      tasks: [
        { id: "t1", text: "Buka `kas_masuk.csv` dan `pengakuan.csv`: bandingkan jumlah baris dan pahami kenapa berbeda" },
        { id: "t2", text: "Buka `definisi_metrik.csv`: catat D1 vs D2 — ini dua definisi yang bersaing" },
      ],
      note: {
        title: "Miskonsepsi #1: revenue itu satu angka objektif",
        type: "pitfall",
        body: "“Pendapatan Q1 kan tinggal dijumlah.” Dijumlah DARI APA? Kas masuk Q1 = Rp 48,5 juta (uang masuk saat deal ditandatangani). Diakui Q1 = Rp 31,4 juta (nilai layanan yang diserahkan). Selisih Rp 17 juta bukan kesalahan — itu langganan Q1 yang pengakuannya mengalir ke Q2. Dua-duanya “pendapatan Q1” menurut definisinya masing-masing. Deck yang tidak menulis definisinya sedang membiarkan pembaca mengira mereka angka yang sama.",
      },
      reference:
        "kas_masuk.csv (140 order, D1) + pengakuan.csv (317 baris, D2) + definisi_metrik.csv. Keduanya SINTETIS, turun dari order yang sama.",
    },
    {
      id: "lab-sql-rekonsiliasi",
      eyebrow: "Langkah 3 · Lab 1 — Rekonsiliasi dua definisi",
      title: "Selisihnya bukan kesalahan — tapi harus diukur",
      prose: [
        "Sebelum menuduh deck berbohong, ukur dulu faktanya. Di bawah ini tabel bulanan kedua definisi (Jan–Jun 2026, dari file sumber). Tugasmu: gabungkan keduanya dan hitung selisih per bulan. Perhatikan polanya — selisih positif di Q1, negatif di Q2. Itu bukan bug; itu waktu pengakuan yang bekerja. Tapi pola itulah yang dieksploitasi deck.",
        "Tabel `kas(bulan TEXT, kas_masuk INTEGER)` dan `diakui(bulan TEXT, diakui INTEGER)`. Hasilkan: bulan, kas_masuk, diakui, selisih — urut per bulan.",
      ],
      tasks: [
        { id: "t1", text: "JOIN kedua tabel per bulan; hitung `selisih = kas_masuk - diakui`, urut per bulan" },
      ],
      expected: "6 baris — selisih positif di Q1 (kas > diakui), negatif di Q2 (diakui > kas): pola waktu pengakuan",
      sqlLab: {
        task: "Rekonsiliasi dua definisi revenue: gabungkan tabel kas dan diakui per bulan, hitung selisih (kas_masuk − diakui). Urutkan per bulan.",
        schema: "CREATE TABLE kas (bulan TEXT, kas_masuk INTEGER);\nCREATE TABLE diakui (bulan TEXT, diakui INTEGER);",
        seedData: [
          "INSERT INTO kas VALUES",
          "('2026-01',18881373),('2026-02',12871330),('2026-03',16781467),",
          "('2026-04',9132977),('2026-05',7400662),('2026-06',5515468);",
          "INSERT INTO diakui VALUES",
          "('2026-01',10675099),('2026-02',9779585),('2026-03',10989467),",
          "('2026-04',17300713),('2026-05',12832989),('2026-06',9005424);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT k.bulan\nFROM kas k\n",
        solution: [
          "SELECT k.bulan, k.kas_masuk, d.diakui,",
          "       k.kas_masuk - d.diakui AS selisih",
          "FROM kas k JOIN diakui d ON k.bulan = d.bulan",
          "ORDER BY k.bulan;",
        ].join("\n"),
        expectedColumns: ["bulan", "kas_masuk", "diakui", "selisih"],
        expectedRows: [
          ["2026-01", 18881373, 10675099, 8206274],
          ["2026-02", 12871330, 9779585, 3091745],
          ["2026-03", 16781467, 10989467, 5792000],
          ["2026-04", 9132977, 17300713, -8167736],
          ["2026-05", 7400662, 12832989, -5432327],
          ["2026-06", 5515468, 9005424, -3489956],
        ],
        orderMatters: true,
      },
    },
    {
      id: "lab-tren",
      eyebrow: "Langkah 4 · Lab 2 — Dua tren, dua cerita",
      title: "Satu label, dua garis: mana yang “naik terus”?",
      prose: [
        "Sekarang gambarkan kedua tren dari file sumber — bukan dari klaim deck. Hitung total Q1 dan Q2 di bawah MASING-MASING definisi, lalu pertumbuhan Q2 vs Q1-nya. Kamu akan melihat triknya dengan mata kepala sendiri: di bawah definisi kas, Q2 ANJLOK; di bawah definisi diakui, Q2 naik. Deck mengambil yang naik dari masing-masing kuartal — dan menyebutnya satu tren.",
        "Tidak ada visualisasi mewah di sini — angka-angkanya sendiri sudah cukup menjadi dakwaan. Yang penting: kedua garis dihitung dari order yang sama.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV; hitung total bulanan per definisi" },
        { id: "t2", text: "Hitung `kas_q1`, `kas_q2`, `aku_q1`, `aku_q2`" },
        { id: "t3", text: "Hitung `tumbuh_kas_pct` dan `tumbuh_aku_pct` (Q2 vs Q1, %)" },
      ],
      expected:
        "kas: Q1 Rp 48.534.170 → Q2 Rp 22.049.107 (−54,57%); diakui: Q1 Rp 31.444.151 → Q2 Rp 39.139.126 (+24,47%) — “naik terus” hanya mungkin dengan definisi bergantian",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/kas_masuk.csv\"))` — BASE sudah didefinisikan.",
        "Kelompokkan per bulan: `kas[\"bulan\"] = kas[\"tanggal_order\"].str[:7]` lalu `groupby(\"bulan\")[\"nominal\"].sum()`; untuk pengakuan groupby kolom `bulan_pengakuan`.",
        "Q1 = jumlah bulan 2026-01 s.d. 2026-03; Q2 = 2026-04 s.d. 2026-06. Jumlahkan sebagai integer.",
        "Pertumbuhan %: `(q2 - q1) / q1 * 100`, bulatkan 2 desimal. Tanda negatif adalah temuan, bukan kesalahan.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-dua-definisi-revenue\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kas = pd.read_csv(open_url(BASE + \"/kas_masuk.csv\"))",
          "aku = pd.read_csv(open_url(BASE + \"/pengakuan.csv\"))",
          "",
          "kas[\"bulan\"] = ...",
          "kas_m = ...",
          "aku_m = ...",
          "",
          "kas_q1 = ...",
          "kas_q2 = ...",
          "aku_q1 = ...",
          "aku_q2 = ...",
          "",
          "tumbuh_kas_pct = ...   # (kas_q2 - kas_q1) / kas_q1 * 100",
          "tumbuh_aku_pct = ...   # (aku_q2 - aku_q1) / aku_q1 * 100",
          "",
          "print(\"kas Q1:\", kas_q1, \"| kas Q2:\", kas_q2, \"| tumbuh:\", tumbuh_kas_pct, \"%\")",
          "print(\"diakui Q1:\", aku_q1, \"| diakui Q2:\", aku_q2, \"| tumbuh:\", tumbuh_aku_pct, \"%\")",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-dua-definisi-revenue\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kas = pd.read_csv(open_url(BASE + \"/kas_masuk.csv\"))",
          "aku = pd.read_csv(open_url(BASE + \"/pengakuan.csv\"))",
          "",
          "kas[\"bulan\"] = kas[\"tanggal_order\"].str[:7]",
          "kas_m = kas.groupby(\"bulan\")[\"nominal\"].sum()",
          "aku_m = aku.groupby(\"bulan_pengakuan\")[\"nominal_diakui\"].sum()",
          "",
          "kas_q1 = int(kas_m[[\"2026-01\", \"2026-02\", \"2026-03\"]].sum())",
          "kas_q2 = int(kas_m[[\"2026-04\", \"2026-05\", \"2026-06\"]].sum())",
          "aku_q1 = int(aku_m[[\"2026-01\", \"2026-02\", \"2026-03\"]].sum())",
          "aku_q2 = int(aku_m[[\"2026-04\", \"2026-05\", \"2026-06\"]].sum())",
          "",
          "tumbuh_kas_pct = round((kas_q2 - kas_q1) / kas_q1 * 100, 2)",
          "tumbuh_aku_pct = round((aku_q2 - aku_q1) / aku_q1 * 100, 2)",
          "",
          "print(\"kas Q1:\", kas_q1, \"| kas Q2:\", kas_q2, \"| tumbuh:\", tumbuh_kas_pct, \"%\")",
          "print(\"diakui Q1:\", aku_q1, \"| diakui Q2:\", aku_q2, \"| tumbuh:\", tumbuh_aku_pct, \"%\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`kas_m` termuat", name: "kas_m", msg: "kas_m harus berisi total bulanan kas masuk." },
          { kind: "equal", task: "t2", label: "`kas_q1` = 48534170", name: "kas_q1", value: 48534170, msg: "Jumlah kas_masuk Jan–Mar 2026." },
          { kind: "equal", task: "t2", label: "`kas_q2` = 22049107", name: "kas_q2", value: 22049107, msg: "Jumlah kas_masuk Apr–Jun 2026 — kurang dari separuh Q1." },
          { kind: "equal", task: "t2", label: "`aku_q1` = 31444151", name: "aku_q1", value: 31444151, msg: "Jumlah diakui Jan–Mar 2026." },
          { kind: "equal", task: "t2", label: "`aku_q2` = 39139126", name: "aku_q2", value: 39139126, msg: "Jumlah diakui Apr–Jun 2026 — naik karena sisa pengakuan langganan Q1." },
          { kind: "equal", task: "t3", label: "`tumbuh_kas_pct` = −54,57", name: "tumbuh_kas_pct", value: -54.57, tol: 0.05, msg: "Di bawah definisi kas, Q2 ANJLOK 54,57% — tidak ada “naik terus” di sini." },
          { kind: "equal", task: "t3", label: "`tumbuh_aku_pct` = +24,47", name: "tumbuh_aku_pct", value: 24.47, tol: 0.05, msg: "Di bawah definisi diakui, Q2 naik 24,47% — inilah angka yang dipakai deck untuk Q2." },
        ],
      },
    },
    {
      id: "lab-qoq",
      eyebrow: "Langkah 5 · Lab 3 — Uji klaim “tumbuh vs kuartal lalu”",
      title: "Baseline yang jujur mengubah segalanya",
      prose: [
        "Deck mengklaim Q1 “tumbuh +81,8% vs kuartal lalu”. Klaim pertumbuhan selalu punya dua komponen: angka SEKARANG dan angka PEMBANDING. Kamu sudah punya angka sekarang (Lab 2). Baseline Q4-2025 ditetapkan di misi ini: kas = Rp 26.693.794 (55% dari kas Q1), diakui = Rp 28.299.736 (90% dari diakui Q1). Hitung pertumbuhan Q1 vs Q4 dan Q2 vs Q1 — KONSISTEN per definisi, tanpa berganti-ganti.",
        "Rumus pertumbuhan kuartal-ke-kuartal disiapkan — sederhananya: selisih dibagi baseline. Yang menentukan kejujurannya bukan rumus, melainkan baseline-nya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ulang `kas_q1`, `kas_q2`, `aku_q1`, `aku_q2` dari file sumber" },
        { id: "t2", text: "Hitung `g_kas_q1`, `g_aku_q1` (vs baseline Q4-2025) dan `g_kas_q2`, `g_aku_q2` (vs Q1)" },
      ],
      expected:
        "Q1 vs Q4: kas +81,82% vs diakui +11,11% — klaim +81,8% hanya hidup di bawah definisi kas dengan baseline Q4 terlemah; Q2 vs Q1: kas −54,57% vs diakui +24,47%",
      formula: String.raw`g = \frac{x_t - x_{t-1}}{x_{t-1}} \times 100\%`,
      formulaNote:
        "g = pertumbuhan %; x_t = nilai kuartal berjalan; x_{t-1} = baseline (kuartal pembanding). Angka ini artinya: berapa persen nilai berubah RELATIF terhadap baseline — baseline kecil membuat persentase terlihat besar.",
      note: {
        title: "Miskonsepsi #2: persentase pertumbuhan selalu jujur",
        type: "pitfall",
        body: "+81,8% terdengar spektakuler — sampai kamu melihat baseline-nya: Q4-2025, kuartal terlemah tahun itu (program diskon besar-besaran). Persentase adalah pecahan: pembilang boleh jujur, tapi penyebut yang dipilih-pilih membuat hasilnya meledak. Inilah cherry-picking periode pembanding: tidak ada angka yang dipalsukan, hanya baseline yang dipilih agar ceritanya bagus. Selalu tanya: “tumbuh DIBANDINGKAN DENGAN APA?”",
      },
      hints: [
        "Baseline sudah disediakan sebagai kas_q4 / aku_q4 — jangan dihitung dari data H1, karena H1 tidak memuat Q4-2025.",
        "Struktur kode sama seperti Lab 2 untuk kas_q1 … aku_q2 — salin polanya, lalu terapkan rumus g.",
        "g_kas_q1 memakai baseline kas_q4; g_aku_q1 memakai aku_q4. Jangan tertukar — definisi harus konsisten dengan baseline-nya.",
        "Bandingkan hasilmu dengan klaim deck: klaim mana yang hanya benar di bawah SATU definisi + SATU baseline?",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-dua-definisi-revenue\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kas = pd.read_csv(open_url(BASE + \"/kas_masuk.csv\"))",
          "aku = pd.read_csv(open_url(BASE + \"/pengakuan.csv\"))",
          "",
          "kas_q4 = 26693794   # baseline Q4-2025 (ditetapkan di briefing)",
          "aku_q4 = 28299736",
          "",
          "kas[\"bulan\"] = kas[\"tanggal_order\"].str[:7]",
          "kas_m = kas.groupby(\"bulan\")[\"nominal\"].sum()",
          "aku_m = aku.groupby(\"bulan_pengakuan\")[\"nominal_diakui\"].sum()",
          "",
          "kas_q1 = ...",
          "kas_q2 = ...",
          "aku_q1 = ...",
          "aku_q2 = ...",
          "",
          "g_kas_q1 = ...   # (kas_q1 - kas_q4) / kas_q4 * 100",
          "g_aku_q1 = ...   # (aku_q1 - aku_q4) / aku_q4 * 100",
          "g_kas_q2 = ...   # vs kas_q1",
          "g_aku_q2 = ...   # vs aku_q1",
          "",
          "print(\"Q1 vs Q4-2025: kas\", g_kas_q1, \"% | diakui\", g_aku_q1, \"%\")",
          "print(\"Q2 vs Q1:      kas\", g_kas_q2, \"% | diakui\", g_aku_q2, \"%\")",
        ].join("\n"),
        lockLines: 12,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-dua-definisi-revenue\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kas = pd.read_csv(open_url(BASE + \"/kas_masuk.csv\"))",
          "aku = pd.read_csv(open_url(BASE + \"/pengakuan.csv\"))",
          "",
          "kas_q4 = 26693794   # baseline Q4-2025 (ditetapkan di briefing)",
          "aku_q4 = 28299736",
          "",
          "kas[\"bulan\"] = kas[\"tanggal_order\"].str[:7]",
          "kas_m = kas.groupby(\"bulan\")[\"nominal\"].sum()",
          "aku_m = aku.groupby(\"bulan_pengakuan\")[\"nominal_diakui\"].sum()",
          "",
          "kas_q1 = int(kas_m[[\"2026-01\", \"2026-02\", \"2026-03\"]].sum())",
          "kas_q2 = int(kas_m[[\"2026-04\", \"2026-05\", \"2026-06\"]].sum())",
          "aku_q1 = int(aku_m[[\"2026-01\", \"2026-02\", \"2026-03\"]].sum())",
          "aku_q2 = int(aku_m[[\"2026-04\", \"2026-05\", \"2026-06\"]].sum())",
          "",
          "g_kas_q1 = round((kas_q1 - kas_q4) / kas_q4 * 100, 2)",
          "g_aku_q1 = round((aku_q1 - aku_q4) / aku_q4 * 100, 2)",
          "g_kas_q2 = round((kas_q2 - kas_q1) / kas_q1 * 100, 2)",
          "g_aku_q2 = round((aku_q2 - aku_q1) / aku_q1 * 100, 2)",
          "",
          "print(\"Q1 vs Q4-2025: kas\", g_kas_q1, \"% | diakui\", g_aku_q1, \"%\")",
          "print(\"Q2 vs Q1:      kas\", g_kas_q2, \"% | diakui\", g_aku_q2, \"%\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`kas_m` termuat", name: "kas_m", msg: "kas_m harus berisi total bulanan kas masuk." },
          { kind: "equal", task: "t2", label: "`g_kas_q1` = +81,82", name: "g_kas_q1", value: 81.82, tol: 0.05, msg: "Klaim deck +81,8% — TAPI hanya di bawah definisi kas dengan baseline Q4 terlemah." },
          { kind: "equal", task: "t2", label: "`g_aku_q1` = +11,11", name: "g_aku_q1", value: 11.11, tol: 0.05, msg: "Di bawah definisi diakui, Q1 hanya +11,11% — “ledakan” Q1 runtuh begitu definisinya konsisten." },
          { kind: "equal", task: "t2", label: "`g_kas_q2` = −54,57", name: "g_kas_q2", value: -54.57, tol: 0.05, msg: "Di bawah definisi kas, Q2 anjlok — deck tidak pernah menunjukkan angka ini." },
          { kind: "equal", task: "t2", label: "`g_aku_q2` = +24,47", name: "g_aku_q2", value: 24.47, tol: 0.05, msg: "Di bawah definisi diakui, Q2 naik — inilah satu-satunya “pertumbuhan” yang tersisa." },
        ],
      },
    },
  ],
};

export default misiDuaDefinisi;

// ── lanjutan misiDuaDefinisi: langkah 6–13 ───────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_DUADEFINISI: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "Satu label, dua definisi — pilih satu",
    prose: [
      "Faktanya sudah di atas meja: kas Q2 anjlok −54,57%; diakui Q2 naik +24,47%; klaim +81,8% hanya hidup di bawah definisi kas dengan baseline terlemah. Deck “naik terus” hanya mungkin karena definisinya bergantian tiap kuartal. CFO menunggumu menetapkan single source of truth SEBELUM deck sampai ke dewan. Keputusan ini final, seperti angka yang sudah dipresentasikan.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Definisi “revenue” mana yang menjadi single source of truth di dashboard — dan bagaimana kamu mengumumkannya?",
      options: [
        {
          id: "opt-finance",
          label: "Menangkan Finance: revenue = kas masuk",
          rationale:
            "Kas adalah uang nyata yang masuk — pajak, arus kas, dan bonus sales semuanya memakai ini. “Diakui” hanya akuntansi; dewan butuh angka yang bisa dibelanjakan.",
          nextStepId: "cabang-finance",
          consequenceNote:
            "Dewan melihat Q2 −54,57% apa adanya. Panik sesaat — lalu pertanyaan yang benar muncul: kenapa pipeline Q2 kering? Diskusi dewan akhirnya membahas bisnis, bukan grafik. Hargane: narasi “tumbuh terus” mati hari itu juga.",
        },
        {
          id: "opt-product",
          label: "Menangkan Product: revenue = pengakuan",
          rationale:
            "Sesuai standar akuntansi: pendapatan diakui saat layanan diserahkan. Kas menyesatkan karena timing deal — Q1 terlihat meledak hanya karena banyak deal ditandatangani, bukan karena layanan diserahkan.",
          nextStepId: "cabang-product",
          consequenceNote:
            "Q1 direvisi dari +81,8% menjadi +11,11%. Finance protes keras — bonus sales Q1 terancam. Tapi angka kini konsisten dengan standar akuntansi, dan auditor eksternal mengangguk. Hargane: perang dingin dengan Finance selama dua kuartal.",
        },
        {
          id: "opt-dual",
          label: "Keduanya — dengan label jujur + kontrak definisi",
          rationale:
            "Kas dan pengakuan menjawab pertanyaan BERBEDA (likuiditas vs kinerja). Yang berbahaya bukan dua angka — melainkan dua angka dengan SATU label. Tetapkan keduanya sebagai metrik resmi, masing-masing dengan label dan definisinya sendiri.",
          nextStepId: "cabang-dual",
          consequenceNote:
            "Dashboard kini menampilkan dua garis berlabel jelas: “Kas masuk” dan “Pendapatan diakui”. Dewan akhirnya paham bedanya — dan mulai bertanya “kenapa kas turun tapi diakui naik?” — pertanyaan bisnis yang tepat. Hargane: kamu harus menjaga disiplin label selamanya; satu slide tanpa label dan kebohongan kembali.",
        },
      ],
    },
  },
  {
    id: "cabang-finance",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: revenue = kas masuk",
    prose: [
      "Kamu menetapkan kas masuk sebagai satu-satunya “revenue”. Deck direvisi: Q2 −54,57%, terpampang tanpa make-up. Ruang dewan hening tiga detik — lalu pertanyaan yang benar akhirnya muncul: “Kenapa pipeline Q2 kering? Apa yang terjadi dengan tim sales?”",
      "Diskusi dewan hari itu membahas bisnis yang sebenarnya, bukan grafik yang dipercantik. Narasi “tumbuh terus” mati — dan itu hal baik: dewan yang tahu masalahnya bisa mengalokasikan solusi; dewan yang dibohongi grafik hanya bisa terkejut belakangan.",
      "Tapi ingat harganya: definisi pengakuan kini “kalah” — tim Product merasa metodenya didiskreditkan, dan laporan ke auditor eksternal tetap harus memakai basis akrual. Single source of truth untuk dewan bukan berarti menghapus definisi lain dari perusahaan.",
    ],
    tasks: [],
    note: {
      title: "Kebenaran yang menyakitkan vs kebohongan yang nyaman",
      body: "−54,57% adalah angka yang jujur dan tidak populer. Analis BI yang baik menyampaikan keduanya: angkanya (jujur) DAN konteksnya (kenapa turun, apa rencananya). Menyembunyikan penurunan tidak membuat masalah hilang — hanya membuat dewan tidak siap.",
    },
  },
  {
    id: "cabang-product",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: revenue = pengakuan",
    prose: [
      "Kamu menetapkan pendapatan diakui sebagai satu-satunya “revenue”. Deck direvisi: Q1 bukan +81,8% melainkan +11,11% — “ledakan” Q1 ternyata sebagian besar deal yang pengakuannya mengalir ke Q2. Finance meledak: bonus sales Q1 dihitung dari kas, dan kamu baru saja mengecilkan pencapaian mereka di depan dewan.",
      "Dua kuartal perang dingin dengan Finance. Tapi auditor eksternal — yang memakai basis akrual — mengangguk puas: akhirnya dashboard internal selaras dengan laporan keuangan. Dan Q2 +24,47% kini berdiri di atas definisi yang sama dengan Q1.",
      "Pelajaran: single source of truth selalu punya “pihak yang kalah”. Tugasmu bukan membuat semua senang — melainkan memastikan yang kalah pun paham ALASANNYA, tertulis di kontrak definisi.",
    ],
    tasks: [],
    note: {
      title: "Standar akuntansi bukan “pihak yang netral”",
      body: "Memilih definisi pengakuan terdengar paling “benar” secara teori — tapi ia mengabaikan bahwa kas menggerakkan bonus, pajak, dan likuiditas. Tidak ada definisi yang netral; setiap definisi melayani keputusan tertentu. Tulis di kontrak: definisi ini untuk KEPUTUSAN APA.",
    },
  },
  {
    id: "cabang-dual",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: dua metrik, label jujur, kontrak definisi",
    prose: [
      "Kamu menolak memilih satu — dan justru itu keputusan tersulit. Dashboard kini menampilkan DUA garis: “Kas masuk (D1)” dan “Pendapatan diakui (D2)”, masing-masing dengan definisi tertulis di footer setiap slide. Dewan akhirnya melihat gambar utuh: kas turun tajam (masalah pipeline), diakui naik (layanan tetap terserahkan) — dua fakta yang SAMA-SAMA benar dan SAMA-SAMA penting.",
      "Untuk pertama kalinya, dewan bertanya: “Kenapa kas turun tapi diakui naik?” — pertanyaan bisnis yang tepat, yang tidak akan pernah muncul dari grafik “naik terus” yang lama. Kontrak definisi D1/D2 ditandatangani CFO dan kedua kepala tim.",
      "Tapi ingat: kemenangan ini rapuh. Satu slide masa depan yang lupa menulis label, satu analis baru yang menyingkat “pendapatan” tanpa definisi — dan kebohongan lama kembali. Single source of truth bukan dokumen; ia disiplin yang dijaga setiap hari.",
    ],
    tasks: [],
    note: {
      title: "Dua angka jujur > satu angka ambigu",
      body: "Kontrak definisi yang baik tidak memaksa satu angka untuk semua keputusan. Ia memetakan: kas masuk → keputusan likuiditas & bonus; diakui → keputusan kinerja & laporan akuntansi. Yang dilarang keras: memakai keduanya bergantian dengan satu label.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 14 baris: deck yang “naik terus” itu dijahit",
    prose: [
      "Sebelum menulis nota, satu misi audit. Di bawah ini 14 baris “Kutipan Deck Pertumbuhan H1 2026” — draf yang akan dipresentasikan ke dewan. Seseorang menyuntikkan 3 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu: kas Q2 −54,57%, diakui Q2 +24,47%, Q1 vs Q4: kas +81,82% vs diakui +11,11%, dan total H1 kedua definisi SAMA (Rp 70.583.277).",
      "Senjatamu: dua garis tren yang sudah kamu hitung sendiri dari order yang sama.",
    ],
    tasks: [],
    auditDossier: {
      version: "duadefinisi-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Deck Pertumbuhan H1 2026 yang akan dipresentasikan ke dewan.",
      columns: ["Slide", "Klaim", "Periode", "Angka", "Definisi dipakai", "Catatan kaki"],
      rows: [
        // ── I2a: cherry-pick ──
        { rowId: 1, cells: { "Slide": "1", "Klaim": "Pendapatan Q1 tumbuh", "Periode": "Q1 vs Q4-2025", "Angka": "+81,8%", "Definisi dipakai": "Kas masuk", "Catatan kaki": "Pembanding: Q4-2025" }, claims: [{ label: "Status", value: "Klaim utama deck" }] },
        { rowId: 2, cells: { "Slide": "1", "Klaim": "Pendapatan Q2 tumbuh", "Periode": "Q2 vs Q1", "Angka": "+24,5%", "Definisi dipakai": "Diakui", "Catatan kaki": "—" }, claims: [{ label: "Status", value: "Klaim utama deck" }] },
        { rowId: 3, cells: { "Slide": "2", "Klaim": "Tren 6 bulan naik konsisten", "Periode": "Jan–Jun", "Angka": "—", "Definisi dipakai": "Bergantian per kuartal", "Catatan kaki": "Q1: kas masuk; Q2: diakui" }, claims: [{ label: "Status", value: "Grafik utama" }] },
        // ── I1: sumbu dipotong ──
        { rowId: 4, cells: { "Slide": "2", "Klaim": "Momentum Q2 menguat", "Periode": "Q2", "Angka": "+38%", "Definisi dipakai": "Diakui", "Catatan kaki": "Sumbu Y grafik mulai dari 80%" }, claims: [{ label: "Status", value: "Callout grafik" }] },
        // ── I3a: segmen dibuang ──
        { rowId: 5, cells: { "Slide": "3", "Klaim": "Segmen Enterprise tumbuh", "Periode": "Q2", "Angka": "+12%", "Definisi dipakai": "Diakui", "Catatan kaki": "Enterprise-Kecil dikeluarkan (outlier)" }, claims: [{ label: "Status", value: "Klaim segmen" }] },
        // ── I3b: segmen dibuang (pasangan tersembunyi) ──
        { rowId: 6, cells: { "Slide": "3 (arsip)", "Klaim": "Enterprise-Kecil (tidak tampil di slide)", "Periode": "Q2", "Angka": "−18,4%", "Definisi dipakai": "Diakui", "Catatan kaki": "Dikeluarkan dari slide" }, claims: [{ label: "Status", value: "Data arsip" }] },
        { rowId: 7, cells: { "Slide": "Data", "Klaim": "Kas masuk Januari", "Periode": "2026-01", "Angka": "Rp 18.881.373", "Definisi dipakai": "Kas masuk", "Catatan kaki": "—" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 2" }] },
        { rowId: 8, cells: { "Slide": "Data", "Klaim": "Diakui Januari", "Periode": "2026-01", "Angka": "Rp 10.675.099", "Definisi dipakai": "Diakui", "Catatan kaki": "—" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 2" }] },
        { rowId: 9, cells: { "Slide": "Data", "Klaim": "Kas masuk Juni", "Periode": "2026-06", "Angka": "Rp 5.515.468", "Definisi dipakai": "Kas masuk", "Catatan kaki": "—" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 2" }] },
        { rowId: 10, cells: { "Slide": "Data", "Klaim": "Diakui Juni", "Periode": "2026-06", "Angka": "Rp 9.005.424", "Definisi dipakai": "Diakui", "Catatan kaki": "—" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 2" }] },
        { rowId: 11, cells: { "Slide": "Data", "Klaim": "Selisih kas vs diakui H1", "Periode": "H1", "Angka": "Rp 0", "Definisi dipakai": "Keduanya", "Catatan kaki": "Total sama — beda waktu pengakuan" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 2" }] },
        { rowId: 12, cells: { "Slide": "Glosarium", "Klaim": "Definisi “revenue” di deck", "Periode": "—", "Angka": "Tidak ada", "Definisi dipakai": "—", "Catatan kaki": "Tidak didefinisikan" }, claims: [{ label: "Status", value: "Temuan" }] },
        // ── I2b: cherry-pick (pasangan) ──
        { rowId: 13, cells: { "Slide": "Data", "Klaim": "Kas Q4-2025 (baseline)", "Periode": "Q4-2025", "Angka": "Rp 26.693.794", "Definisi dipakai": "Kas masuk", "Catatan kaki": "Kuartal terlemah 2025" }, claims: [{ label: "Status", value: "Data arsip" }] },
        { rowId: 14, cells: { "Slide": "Rekomendasi", "Klaim": "Lanjutkan definisi bergantian", "Periode": "—", "Angka": "—", "Definisi dipakai": "—", "Catatan kaki": "Diusulkan tim dashboard" }, claims: [{ label: "Status", value: "Temuan" }] },
      ],
      injections: [
        { key: "sumbu-dipotong", rowIds: [4], title: "Sumbu Y dipotong", clue: "Callout mengklaim “momentum +38%” — padahal hitunganmu (Lab 3): diakui Q2 hanya +24,47%. Catatan kakinya mengaku: sumbu Y grafik mulai dari 80%. Kenaikan moderat terlihat seperti roket.", danger: "Sumbu terpotong membuat dewan “melihat” momentum yang tidak ada; keputusan investasi dan bonus didasarkan pada ilusi visual, bukan angka." },
        { key: "cherry-pick", rowIds: [1, 13], title: "Periode pembanding cherry-picked", clue: "+81,8% dihitung terhadap Q4-2025 — yang diakui sendiri sebagai “kuartal terlemah 2025” (baris 13). Di bawah definisi diakui dengan baseline yang sama, Q1 hanya +11,11%. Tidak ada angka yang dipalsukan — hanya baseline yang dipilih agar ceritanya bagus.", danger: "Baseline yang dipilih-pilih adalah cara termurah memanipulasi narasi: spektakuler di slide, kosong di substansi. Selalu tanya “tumbuh DIBANDINGKAN DENGAN APA?”" },
        { key: "segmen-dibuang", rowIds: [5, 6], title: "Segmen dibuang sebagai “outlier” tanpa catatan", clue: "Slide mengklaim Enterprise +12% dengan catatan “Enterprise-Kecil dikeluarkan (outlier)” — tanpa kriteria tertulis apa itu outlier. Data arsip (baris 6): Enterprise-Kecil −18,4%, tidak tampil di slide. Outlier tanpa definisi = data yang tidak disukai.", danger: "Mengeluarkan segmen yang menurun sebagai “outlier” menyembunyikan masalah bisnis riil; dewan tidak pernah tahu ada segmen yang berdarah — sampai ia menular ke segmen lain." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 9 · Deliverable",
    title: "Nota single source of truth",
    prose: [
      "Semua bukti di tangan. Tulis nota single source of truth + rancangan dashboard yang diperbaiki — artefak portofoliomu. Nota yang baik tidak hanya memilih definisi, tapi memastikan tidak ada lagi slide masa depan yang bisa mengulang kebohongan ini: label wajib, definisi berversi, dan baseline yang dinyatakan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Kontrak definisi: D1 (kas masuk) dan D2 (diakui) — definisi kata-per-kata, versi, untuk keputusan APA masing-masing dipakai (likuiditas/bonus vs kinerja/akuntansi).",
        "Tabel kebenaran: tren H1 di bawah KEDUA definisi konsisten (kas Q2 −54,57%; diakui Q2 +24,47%) + bukti total H1 sama (Rp 70.583.277).",
        "Temuan audit deck: sabotase apa yang kamu temukan, baris per baris, termasuk definisi bergantian antar kuartal.",
        "Rancangan dashboard yang diperbaiki: dua garis berlabel jelas (atau satu definisi resmi) + footer definisi di setiap slide + aturan baseline pembanding.",
        "Batas & risiko sisa: apa yang TIDAK dicakup nota ini (mis. data sintetis latihan; di produksi, selisih kas vs diakui juga dipengaruhi piutang tak tertagih & refund — tidak dimodelkan di sini).",
      ],
      rubric: [
        { criterion: "Kebenaran rekonsiliasi", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Kas Q2 −54,57%, diakui Q2 +24,47%, total H1 sama Rp 70.583.277 — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Ketiga sabotase disebut dengan nomor baris (4; 1+13; 5+6) plus pola definisi bergantian"] },
        { criterion: "Kualitas single source of truth", weight: 25, levels: ["Tidak menetapkan definisi", "Memilih definisi tanpa alasan keputusan", "Kontrak D1/D2: definisi + untuk keputusan apa + aturan label & baseline"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim satu definisi menyelesaikan segalanya", "Menyebut sebagian batas", "Batas (piutang/refund tak dimodelkan; data sintetis) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 10 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Tiga sabotase di deck:",
      "1) **Sumbu Y dipotong** (baris 4): callout “momentum +38%” vs hitungan sebenarnya +24,47% (Lab 3). Catatan kaki mengaku sumbu Y mulai dari 80% — kenaikan moderat digambar seperti roket. Dewan tidak membaca catatan kaki; dewan membaca gambar.",
      "2) **Cherry-pick baseline** (baris 1 & 13): +81,8% vs Q4-2025, “kuartal terlemah 2025”. Di bawah definisi diakui, Q1 hanya +11,11%. Tidak satu pun angka dipalsukan — hanya baseline yang dipilih agar ceritanya spektakuler.",
      "3) **Segmen dibuang** (baris 5–6): Enterprise-Kecil −18,4% dikeluarkan sebagai “outlier” tanpa kriteria tertulis, lalu slide mengklaim Enterprise +12%. Outlier tanpa definisi adalah sensor dengan nama lain.",
      "Dan pola induknya — yang bukan suntikan, melainkan arsitektur kebohongannya: definisi BERGANTIAN tiap kuartal (baris 3 mengakuinya dengan polos: “Q1: kas masuk; Q2: diakui”). Q1 memakai angka yang besar (+81,8% kas), Q2 memakai angka yang naik (+24,5% diakui). Hasilnya “naik terus” — dari dua angka yang tidak bisa dibandingkan.",
      "Skor deteksimu (x/3) mengukur satu hal: apakah kamu memeriksa sumbu grafik, baseline pembanding, dan catatan kaki — atau hanya membaca angka besarnya. Dan ingat keputusan bercabangmu: single source of truth bukan tentang memilih angka yang paling menyenangkan, melainkan tentang label yang tidak bisa disalahpahami.",
      "Bahaya nyata terakhir: dewan yang mengambil keputusan dari grafik berbohong tidak membuat keputusan yang salah karena bodoh — melainkan karena DIBOHONGI. Analis BI adalah garis pertahanan terakhir antara data dan keputusan. Garis itu bernama definisi.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: single source of truth = satu angka",
      type: "risk",
      body: "Single source of truth BUKAN berarti hanya boleh ada satu angka revenue. Kas masuk dan diakui sama-sama “sumber kebenaran” — untuk pertanyaan yang berbeda. Yang tunggal harusnya adalah DEFINISI per label: setiap angka “pendapatan” di setiap slide memakai definisi yang sama, tertulis, berversi. Satu label, satu definisi — selalu.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 11 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Dua definisi, dua angka: kas masuk Q2 −54,57% vs diakui Q2 +24,47% — “naik terus” hanya mungkin dengan definisi bergantian tiap kuartal.",
      "Total H1 kedua definisi SAMA (Rp 70.583.277): selisihnya murni waktu pengakuan (langganan Q1 mengalir ke Q2), bukan data berbeda.",
      "Tiga pola sabotase deck: sumbu Y dipotong (+38% vs +24,47%), baseline cherry-picked (+81,8% vs Q4 terlemah), segmen dibuang sebagai “outlier” tanpa kriteria (−18,4% disembunyikan).",
      "Keputusan single source of truth selalu punya pihak yang kalah: menangkan kas (jujur tapi panik), menangkan diakui (akurat tapi perang dengan Finance), atau dua metrik berlabel jujur (benar tapi butuh disiplin selamanya).",
      "Data: 100% SINTETIS (seed 42), 140 order H1 2026 dalam dua file definisi + kamus definisi_metrik.csv; metode di METODE.md — bukan pendapatan perusahaan nyata.",
    ],
  },
];

(misiDuaDefinisi.steps as V2Step[]).push(...LANJUTAN_DUADEFINISI);

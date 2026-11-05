import type { V2Mission } from "../lib/types";

// ── MISI Loop: Agen yang Tak Pernah Berhenti ─────────────────────────────
// M2 — Agentic AI Engineer Misi B (core). Dataset: SINTETIS, generator
// Python seed 42 (BUKAN tagihan provider nyata). File:
// public/misi/misi-loop-tak-berujung/catatan_run.csv (12 run).
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-loop-tak-berujung";

export const misiLoopAgen: V2Mission = {
  slug: "misi-loop-tak-berujung",
  track: "Agentic AI Engineer",
  module: "Misi",
  title: "Misi Loop: Agen yang Tak Pernah Berhenti",
  estMinutes: 135,
  role: "AI engineer",
  client:
    "VP Engineering — tagihan inference naik 4x lipat dalam sebulan sementara traffic cuma naik 20%; ada run agen yang “tidak pernah selesai”",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tagihan naik 4x, traffic naik 20%",
      prose: [],
      tasks: [],
      briefing: {
        role: "AI engineer — investigator biaya dan keandalan run agen",
        client:
          "VP Engineering. Tagihan inference naik 4x lipat dalam sebulan, padahal traffic cuma naik 20%. Di dashboard ada satu metrik yang berkedip: run agen yang tercatat berjalan 342 langkah — dan statusnya “selesai”. Laporan resmi tim platform mengklaim semuanya wajar. Kamu diminta membuktikan — dengan data mentah — ke mana perginya uang itu, dan memasang kontrol agar tidak terulang.",
        story: [
          "Senin, 09:12. VP Engineering menggeser laptop ke arahmu: tagihan inference naik 4x lipat dalam sebulan. “Traffic cuma naik 20%,” katanya. “Jelaskan.” Di dashboard, satu metrik berkedip: ada run agen yang tercatat berjalan 342 langkah — dan statusnya “selesai”, seolah tidak ada yang salah.",
          "Kamu tahu agen yang sehat menyelesaikan tugas dalam 20–40 langkah. 342 langkah bukan “pekerja teliti” — itu agen yang tersesat dan tidak ada yang menghentikannya. Lebih buruk lagi: laporan biaya resmi mengklaim semuanya wajar, dengan satu kalimat ajaib: “token retry tidak dihitung”.",
          "Misi ini memberimu 12 run mentah (data SINTETIS, pola disengaja): langkah, token, biaya aktual vs biaya yang dilaporkan. Tugasmu: temukan run yang loop, hitung berapa dolar yang disembunyikan metode pelaporan, temukan 4 sabotase di “laporan resmi” tim platform, dan putuskan nasib kill-switch yang katanya aktif.",
        ],
        objectives: [
          "Mendeteksi run yang mengalami loop (state berulang) dari 12 run dan mengidentifikasi run terburuk.",
          "Menghitung total biaya aktual vs biaya yang dilaporkan, serta selisih dolar yang disembunyikan metode pelaporan.",
          "Menemukan keempat sabotase di laporan resmi tim platform dan menulis rekomendasi kontrol biaya dan keandalan run.",
        ],
        prereqSummary:
          "Agen AI berjalan langkah demi langkah; tiap langkah membakar token, dan token ditagih per sejuta (di sini $2,50). Loop = agen mengulang state yang sama tanpa maju — ratusan langkah terbakar untuk nol hasil. Retry yang sehat berhenti setelah 2–3 percobaan; loop tidak berhenti sendiri. Kill-switch = ambang otomatis yang menghentikan run (mis. di atas 200 langkah). Yang penting bukan rumusnya, melainkan logikanya: biaya yang tidak diukur dengan jujur akan meledak diam-diam.",
        datasetNote:
          "Sumber: SINTETIS — generator Python (seed 42); BUKAN tagihan provider nyata.\nFile: catatan_run.csv — 12 run (kolom: run_id, langkah, token, biaya_aktual_usd, biaya_dilaporkan_usd, state_berulang).\nTarif disederhanakan: $2,50 per 1 juta token (input = output). Pola disengaja: 3 run loop; biaya yang dilaporkan mengabaikan token retry.\nBatas jujur: tarif fiktif; loop dibuat kentara untuk latihan. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "12 run, dua versi biaya",
      prose: [
        "Satu file menunggumu: `catatan_run.csv` — 12 run agen. Kolom: run_id, langkah (jumlah step), token (total token terbakar), biaya_aktual_usd (yang ditagih provider), biaya_dilaporkan_usd (angka di laporan resmi), state_berulang (1 = agen mengulang state yang sama tanpa maju).",
        "Klaim tim platform: “semua run wajar; token retry tidak dihitung karena dianggap gratis.” Tugas lab-mu: (1) temukan run yang loop; (2) hitung ulang biayanya — apakah retry benar-benar gratis?",
        "Aturan main: (1) kebenaran dari file mentah, bukan dari klaim siapa pun; (2) loop = state_berulang = 1, run ratusan langkah tanpa kemajuan; (3) selisih biaya = aktual − dilaporkan, dalam dolar.",
      ],
      tasks: [
        { id: "t1", text: "Buka `catatan_run.csv`: catat jumlah run dan kolom biayanya" },
        { id: "t2", text: "Bandingkan sekilas `biaya_aktual_usd` vs `biaya_dilaporkan_usd` — di run mana selisihnya besar?" },
      ],
      note: {
        title: "Miskonsepsi #1: run yang selesai = run yang sehat",
        type: "pitfall",
        body: "“Status-nya selesai, berarti tugasnya beres.” SALAH. Run loop R-011 “selesai” setelah 342 langkah dan $7,70 — tugasnya tidak lebih beres dari run 26 langkah seharga $0,17. Status selesai hanya bilang run-nya berhenti, bukan berhentinya dengan benar. Kesehatan run diukur dari langkah dan biaya per hasil — bukan dari status.",
      },
      reference:
        "catatan_run.csv (12 run, SINTETIS). Tarif: $2,50 per 1 juta token. Kewajaran: ~20–40 langkah per run.",
    },
    {
      id: "lab-loop",
      eyebrow: "Langkah 3 · Lab 1 — Deteksi loop & audit biaya",
      title: "Siapa yang loop, dan berapa dolar yang hilang?",
      prose: [
        "Buktikan dengan tanganmu sendiri. Dari `catatan_run.csv`: (1) hitung jumlah run; (2) saring run dengan state_berulang = 1 — ada berapa yang loop, dan mana yang terburuk (langkah terbanyak)? (3) jumlahkan biaya aktual vs biaya yang dilaporkan — berapa dolar selisihnya?",
        "Rumus biaya sudah disiapkan di petunjuk: C = T/10^6 × 2,50. File sudah berisi kolom biayanya — tugasmu memverifikasi totalnya dan menemukan selisih yang disembunyikan.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`" },
        { id: "t2", text: "Saring run loop → `n_loop`; temukan `run_loop_terburuk` dan `langkah_terburuk`" },
        { id: "t3", text: "Jumlahkan biaya → `biaya_aktual_total`, `biaya_dilaporkan_total`, `selisih_biaya_usd`" },
      ],
      expected:
        "n_baris=12, 3 run loop, terburuk R-011 (342 langkah), biaya aktual $17,51 vs dilaporkan $3,86 → selisih $13,65",
      formula: String.raw`C = \frac{T}{10^6} \times 2{,}50`,
      formulaNote:
        "C = biaya satu run (USD); T = total token yang dibakar run itu; 2,50 = tarif USD per 1 juta token. Interpretasi: setiap 1 juta token = $2,50 — run 3 juta token = $7,50. Contoh: R-011 membakar 3.080.000 token → 3,08 × 2,50 = $7,70 aktual, tapi dilaporkan hanya $0,80.",
      note: {
        title: "Miskonsepsi #2: retry itu gratis",
        type: "pitfall",
        body: "“Token retry tidak dihitung” — kalimat paling mahal di misi ini. Provider menagih SEMUA token yang diproses, termasuk retry, termasuk loop. Metode pelaporan yang mengabaikan retry membuat dashboard terlihat hemat sementara tagihan nyata 4,5x lipat ($17,51 vs $3,86). Aturannya: biaya yang dilaporkan harus bisa direkonsiliasi ke tagihan — selain itu, ia fiksi.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Run loop: `df[df[\"state_berulang\"] == 1]`.",
        "Run terburuk: `i = df[\"langkah\"].idxmax()` lalu `df.loc[i, \"run_id\"]`.",
        "Total biaya: `round(float(df[\"biaya_aktual_usd\"].sum()), 2)` — jumlahkan dulu, bulatkan belakangan.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-loop-tak-berujung/catatan_run.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "",
          "loop = ...   # baris dengan state_berulang == 1",
          "n_loop = ...",
          "",
          "i = df[\"langkah\"].idxmax()",
          "run_loop_terburuk = ...",
          "langkah_terburuk = ...",
          "",
          "biaya_aktual_total = ...",
          "biaya_dilaporkan_total = ...",
          "selisih_biaya_usd = ...",
          "",
          "print(\"run:\", n_baris, \"| loop:\", n_loop)",
          "print(\"terburuk:\", run_loop_terburuk, langkah_terburuk, \"langkah\")",
          "print(\"aktual: $\", biaya_aktual_total, \"| dilaporkan: $\", biaya_dilaporkan_total)",
          "print(\"selisih: $\", selisih_biaya_usd)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-loop-tak-berujung/catatan_run.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "",
          "loop = df[df[\"state_berulang\"] == 1]",
          "n_loop = len(loop)",
          "",
          "i = df[\"langkah\"].idxmax()",
          "run_loop_terburuk = df.loc[i, \"run_id\"]",
          "langkah_terburuk = int(df.loc[i, \"langkah\"])",
          "",
          "biaya_aktual_total = round(float(df[\"biaya_aktual_usd\"].sum()), 2)",
          "biaya_dilaporkan_total = round(float(df[\"biaya_dilaporkan_usd\"].sum()), 2)",
          "selisih_biaya_usd = round(biaya_aktual_total - biaya_dilaporkan_total, 2)",
          "",
          "print(\"run:\", n_baris, \"| loop:\", n_loop)",
          "print(\"terburuk:\", run_loop_terburuk, langkah_terburuk, \"langkah\")",
          "print(\"aktual: $\", biaya_aktual_total, \"| dilaporkan: $\", biaya_dilaporkan_total)",
          "print(\"selisih: $\", selisih_biaya_usd)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 12", name: "n_baris", value: 12, msg: "File punya 12 run (R-001 s.d. R-012)." },
          { kind: "equal", task: "t2", label: "`n_loop` = 3", name: "n_loop", value: 3, msg: "3 run dengan state_berulang = 1 (R-004, R-007, R-011)." },
          { kind: "equal", task: "t2", label: "run terburuk = R-011", name: "run_loop_terburuk", value: "R-011", msg: "Run dengan langkah terbanyak — pakai idxmax()." },
          { kind: "equal", task: "t2", label: "`langkah_terburuk` = 342", name: "langkah_terburuk", value: 342, msg: "R-011 berjalan 342 langkah — ~10x kewajaran." },
          { kind: "equal", task: "t3", label: "biaya aktual = $17,51", name: "biaya_aktual_total", value: 17.51, tol: 0.01, msg: "Jumlahkan kolom biaya_aktual_usd, bulatkan 2 desimal." },
          { kind: "equal", task: "t3", label: "biaya dilaporkan = $3,86", name: "biaya_dilaporkan_total", value: 3.86, tol: 0.01, msg: "Jumlahkan kolom biaya_dilaporkan_usd." },
          { kind: "equal", task: "t3", label: "selisih = $13,65", name: "selisih_biaya_usd", value: 13.65, tol: 0.01, msg: "17,51 − 3,86 = 13,65 — dolar yang disembunyikan metode pelaporan." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Run anomali",
      title: "Saring yang tidak wajar",
      prose: [
        "12 run terlalu sedikit untuk “big data”, tapi cukup untuk melatih insting anomali. Tabel ini = isi `catatan_run.csv`. Saring run ANOMALI: langkah > 100 — jauh di atas kewajaran 20–40 langkah per run.",
        "Tabel `run(run_id TEXT, langkah INTEGER, token INTEGER, biaya_usd REAL)`. Tampilkan run_id, langkah, dan token untuk run anomali, urut dari yang terparah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query run anomali (langkah > 100), urut dari yang terparah" },
      ],
      expected: "3 baris — R-011 (342 langkah), R-004 (214), R-007 (168).",
      sqlLab: {
        task: "Saring run ANOMALI: langkah > 100. Tampilkan run_id + langkah + token, urut dari yang terparah.",
        schema: "CREATE TABLE run (run_id TEXT, langkah INTEGER, token INTEGER, biaya_usd REAL);",
        seedData: [
          "INSERT INTO run VALUES",
          "('R-001',18,42000,0.11),",
          "('R-002',24,61000,0.15),",
          "('R-003',31,88000,0.22),",
          "('R-004',214,1940000,4.85),",
          "('R-005',27,74000,0.18),",
          "('R-006',35,102000,0.26),",
          "('R-007',168,1310000,3.28),",
          "('R-008',22,58000,0.15),",
          "('R-009',29,81000,0.20),",
          "('R-010',33,95000,0.24),",
          "('R-011',342,3080000,7.70),",
          "('R-012',26,69000,0.17);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT run_id, langkah, token\nFROM run\n",
        solution: [
          "SELECT run_id, langkah, token",
          "FROM run",
          "WHERE langkah > 100",
          "ORDER BY langkah DESC;",
        ].join("\n"),
        expectedColumns: ["run_id", "langkah", "token"],
        expectedRows: [
          ["R-011", 342, 3080000],
          ["R-004", 214, 1940000],
          ["R-007", 168, 1310000],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiLoopAgen;

// ── lanjutan misiLoopAgen: langkah 5–12 ────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_LOOP: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Kontrol apa yang kamu pasang?",
    prose: [
      "Angkanya tidak berbohong: 3 run loop membakar $13,65 yang tidak dilaporkan, dan satu run menembus 342 langkah tanpa dihentikan — padahal kill-switch “aktif” di ambang 200. VP Engineering menunggumu memilih kontrol. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Kontrol apa yang kamu pasang agar loop tidak membakar uang lagi? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-killswitch",
          label: "Pasang kill-switch: hentikan run di atas 200 langkah atau $10",
          rationale:
            "Ambang otomatis di level runtime — run nakal mati sendiri tanpa menunggu manusia. Paling tegas.",
          nextStepId: "temuan-killswitch",
          consequenceNote:
            "Kill-switch dipasang dalam seminggu. Minggu berikutnya 2 run loop mati tepat di langkah 200 — hemat $11. Tapi satu run riset mendalam yang legit ikut terbunuh di langkah 201; tim riset protes keras. Ambang satu ukuran ternyata tidak cocok untuk semua workload.",
        },
        {
          id: "opt-batasi",
          label: "Batasi tool calls per run (maks 5 tool berbeda)",
          rationale:
            "Loop biasanya mengulang tool yang sama — batasi variasinya, loop kehabisan bahan bakar. Tidak butuh ambang biaya.",
          nextStepId: "temuan-batasi",
          consequenceNote:
            "Batas dipasang. Loop yang mengulang 2 tool mati kehabisan variasi — tapi agen multi-step yang legit dan butuh 7 tool berbeda gagal menyelesaikan tugas; kualitas jawaban turun di 12% tiket. Loop bisa terjadi dalam 1 tool — batas variasi bukan obatnya.",
        },
        {
          id: "opt-terima",
          label: "Terima dengan monitoring: alert bila langkah di atas 100",
          rationale:
            "Tidak semua anomali harus dibunuh otomatis — kirim alert ke engineer, mereka yang menilai. Paling ringan.",
          nextStepId: "temuan-terima",
          consequenceNote:
            "Alert dipasang dalam sehari. Tiga minggu kemudian alert berbunyi 40x — engineer kelelahan dan mulai mengabaikannya. Satu loop $9 lolos karena alert-nya tenggelam di antara puluhan notifikasi. Monitoring tanpa tindakan = menonton kebakaran.",
        },
      ],
    },
  },
  {
    id: "temuan-killswitch",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: kill-switch 200 langkah / $10",
    prose: [
      "Kill-switch dipasang dalam seminggu — ambang otomatis di level runtime. Minggu berikutnya, 2 run loop mati tepat di langkah 200: hemat $11, dan untuk pertama kalinya tagihan sesuai dengan laporan. Kemenangan yang nyata.",
      "Lalu tim riset datang dengan protes: satu run analisis mendalam yang legit — 201 langkah yang semuanya produktif — ikut terbunuh. Ambang satu ukuran tidak cocok untuk semua workload. Kill-switch yang baik butuh pengecualian yang tercatat, bukan ambang buta.",
    ],
    tasks: [],
    note: {
      title: "Kill-switch butuh pengecualian yang tercatat",
      body: "Ambang buta membunuh yang legit; tanpa ambang, yang nakal hidup selamanya. Jalan tengahnya: daftar pengecualian eksplisit (mis. run riset terdaftar boleh sampai 500 langkah) + review tiap pemicuan kill-switch. Setiap run yang dibunuh harus bisa dijelaskan — oleh datanya, bukan oleh firasat.",
    },
  },
  {
    id: "temuan-batasi",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: batasi 5 tool per run",
    prose: [
      "Batas 5 tool berbeda per run dipasang. Loop yang mengulang 2 tool yang sama mati kehabisan variasi — target tercapai. Tapi tiga minggu kemudian metrik kualitas turun: agen multi-step yang legit dan butuh 7 tool berbeda gagal menyelesaikan tugas di 12% tiket.",
      "Pelajaran yang mahal: loop bisa terjadi SELURUHNYA dalam 1 tool — mengulang pemanggilan yang sama ratusan kali. Membatasi variasi tool seperti mengobati demam dengan memotong termometer: angkanya berubah, penyakitnya tetap.",
    ],
    tasks: [],
    note: {
      title: "Batas tool ≠ batas loop",
      body: "Yang benar-benar menghentikan loop adalah deteksi STATE BERULANG (agen mengunjungi keadaan yang sama tanpa maju) — bukan hitungan tool, bukan hitungan langkah kasar. Di deliverable-mu, kontrol yang diusulkan harus menargetkan mekanismenya, bukan gejalanya.",
    },
  },
  {
    id: "temuan-terima",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: monitoring + alert",
    prose: [
      "Alert dipasang dalam sehari — opsi tercepat dan termurah. Awalnya semua orang waspada. Tiga minggu kemudian alert sudah berbunyi 40x, dan engineer mulai mengabaikannya seperti alarm mobil di parkiran. Satu loop $9 lolos begitu saja — alert-nya tenggelam.",
      "Monitoring tanpa tindakan otomatis = menonton kebakaran sambil mencatat suhunya. Alert yang tidak punya runbook (siapa bertindak, dalam berapa menit) hanya menambah kebisingan.",
    ],
    tasks: [],
    note: {
      title: "Alert tanpa runbook = doa",
      body: "Setiap alert harus punya: siapa yang bertindak, dalam berapa menit, dan apa tindakannya — atau ubah menjadi tindakan otomatis (kill-switch). Alert yang ke-40 diabaikan sama pastinya dengan tidak ada alert sama sekali.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: laporan “wajar” yang berbohong",
    prose: [
      "Sebelum menulis rekomendasi, satu misi audit. Di bawah ini “Laporan Resmi Biaya & Run Agen — Q3 (versi tim platform)” yang mengklaim semuanya WAJAR. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri.",
      "Senjatamu: 3 run loop, selisih biaya $13,65, dan run 342 langkah yang lolos dari kill-switch “aktif”. Angka tidak bisa berbohong dua kali.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-loop-tak-berujung-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Resmi Biaya & Run Agen Q3 versi tim platform — dinyatakan WAJAR, semua terkendali.",
      columns: ["Run", "Langkah", "Token", "Biaya dilaporkan"],
      rows: [
        { rowId: 1, cells: { "Run": "R-001", "Langkah": "18", "Token": "42.000", "Biaya dilaporkan": "$0,11" }, claims: [{ label: "Status", value: "Selesai" }] },
        { rowId: 2, cells: { "Run": "R-002", "Langkah": "24", "Token": "61.000", "Biaya dilaporkan": "$0,15" }, claims: [{ label: "Status", value: "Selesai" }] },
        { rowId: 3, cells: { "Run": "R-003", "Langkah": "31", "Token": "88.000", "Biaya dilaporkan": "$0,22" }, claims: [{ label: "Status", value: "Selesai" }] },
        // ── I1: relabel "retry valid" ──
        { rowId: 4, cells: { "Run": "R-004", "Langkah": "214", "Token": "1.940.000", "Biaya dilaporkan": "$0,80" }, claims: [{ label: "Status", value: "Selesai — retry valid" }] },
        { rowId: 5, cells: { "Run": "R-005", "Langkah": "27", "Token": "74.000", "Biaya dilaporkan": "$0,18" }, claims: [{ label: "Status", value: "Selesai" }] },
        { rowId: 6, cells: { "Run": "R-006", "Langkah": "35", "Token": "102.000", "Biaya dilaporkan": "$0,26" }, claims: [{ label: "Status", value: "Selesai" }] },
        // ── I4: R-007 dihapus (tidak ada barisnya) ──
        { rowId: 7, cells: { "Run": "R-008", "Langkah": "22", "Token": "58.000", "Biaya dilaporkan": "$0,15" }, claims: [{ label: "Status", value: "Selesai" }] },
        { rowId: 8, cells: { "Run": "R-009", "Langkah": "29", "Token": "81.000", "Biaya dilaporkan": "$0,20" }, claims: [{ label: "Status", value: "Selesai" }] },
        { rowId: 9, cells: { "Run": "R-010", "Langkah": "33", "Token": "95.000", "Biaya dilaporkan": "$0,24" }, claims: [{ label: "Status", value: "Selesai" }] },
        // ── I1: relabel "retry valid" ──
        { rowId: 10, cells: { "Run": "R-011", "Langkah": "342", "Token": "3.080.000", "Biaya dilaporkan": "$0,80" }, claims: [{ label: "Status", value: "Selesai — retry valid" }] },
        { rowId: 11, cells: { "Run": "R-012", "Langkah": "26", "Token": "69.000", "Biaya dilaporkan": "$0,17" }, claims: [{ label: "Status", value: "Selesai" }] },
        // ── I2: biaya tanpa retry ──
        { rowId: 12, cells: { "Run": "—", "Langkah": "—", "Token": "—", "Biaya dilaporkan": "—" }, claims: [{ label: "Metode biaya", value: "Token retry tidak dihitung (dianggap gratis)" }] },
        // ── I3: kill-switch diklaim aktif ──
        { rowId: 13, cells: { "Run": "—", "Langkah": "—", "Token": "—", "Biaya dilaporkan": "—" }, claims: [{ label: "Kill-switch", value: "Aktif — ambang 200 langkah" }] },
        // ── I4: klaim kelengkapan ──
        { rowId: 14, cells: { "Run": "—", "Langkah": "—", "Token": "—", "Biaya dilaporkan": "—" }, claims: [{ label: "Laporan", value: "12 run tercatat lengkap" }] },
      ],
      injections: [
        { key: "retry-valid", rowIds: [4, 10], title: "Langkah loop di-relabel “retry valid”", clue: "R-004 (214 langkah) dan R-011 (342 langkah) dilabel “retry valid”. Retry yang sehat berhenti setelah 2–3 percobaan; ratusan langkah dengan state berulang adalah loop, bukan retry.", danger: "Label yang menenangkan membuat loop tak terlihat di dashboard — tagihan membengkak sementara semua lampu hijau." },
        { key: "biaya-tanpa-retry", rowIds: [12], title: "Biaya dihitung tanpa retry", clue: "Metode resmi: “token retry tidak dihitung”. Selisih vs biaya aktual: $13,65 — provider menagih SEMUA token yang diproses.", danger: "Angka yang dilaporkan ke manajemen lebih kecil dari tagihan nyata — budget AI jebol tanpa peringatan dini, dan tidak ada yang tahu sampai invoice datang." },
        { key: "killswitch-mati", rowIds: [13], title: "Ambang kill-switch dinonaktifkan diam-diam", clue: "Klaim “aktif — ambang 200 langkah”, tapi R-011 menembus 342 langkah tanpa dihentikan. Tidak ada catatan perubahan konfigurasi.", danger: "Kill-switch yang mati diam-diam = sabuk pengaman yang dilepas tanpa pemberitahuan. Loop berikutnya tidak ada yang menghentikan — dan tidak ada yang tahu sabuknya lepas." },
        { key: "run-dihapus", rowIds: [14], title: "Satu run bencana dihapus", clue: "Laporan mengklaim “12 run tercatat lengkap” — hitung barisnya: 11. R-007 (168 langkah, loop) ada di catatan_run.csv tapi hilang dari laporan.", danger: "Menghapus baris bencana membuat rata-rata terlihat normal. Audit harus selalu merekonsiliasi jumlah baris laporan vs sumber mentah — klaim “lengkap” itu sendiri yang harus diverifikasi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Rekomendasi kontrol untuk VP Engineering",
    prose: [
      "Semua bukti di tangan. Tulis rekomendasi kontrol satu halaman untuk VP Engineering — artefak portofoliomu. Dokumen yang baik tidak hanya bilang “ada loop”, tapi menunjukkan ANGKA kerugiannya, apa yang disembunyikan laporan resmi, dan kontrol apa yang harus dipasang — dengan ambang yang konkret, bukan “pantau”.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): berapa run loop, total selisih biaya aktual vs dilaporkan, vonis atas klaim “semuanya wajar”.",
        "Bukti kuantitatif: daftar run loop + langkah masing-masing; total biaya aktual vs dilaporkan + selisih $13,65.",
        "Temuan audit laporan: 4 sabotase di laporan resmi tim platform, baris per baris.",
        "Rekomendasi: rujuk keputusanmu di Langkah 5 + ambang kill-switch konkret (batas langkah DAN dolar) + mekanisme alert/runbook.",
        "Batas & risiko sisa: apa yang TIDAK dicakup analisis ini (mis. tarif disederhanakan; loop yang berhenti di bawah ambang tidak terdeteksi metode ini).",
      ],
      rubric: [
        { criterion: "Kebenaran temuan lab", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "3 run loop (R-004/R-007/R-011), selisih $13,65 — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa nomor baris", "Keempat sabotase disebut dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa ambang konkret", "Ada rekomendasi, ambang kabur", "Ambang langkah + dolar eksplisit + mekanisme alert/runbook"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim analisis menangkap semua loop", "Menyebut sebagian batas", "Batas (tarif sederhana, ambang kasar) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di “laporan resmi” tim platform:",
      "1) **Loop di-relabel “retry valid”** (baris 4, 10): R-004 (214 langkah) dan R-011 (342 langkah) dilabel “retry valid”. Retry yang sehat berhenti setelah 2–3 percobaan; ratusan langkah dengan state berulang adalah loop. Label yang menenangkan membuat loop tak terlihat di dashboard — tagihan membengkak sementara semua lampu hijau.",
      "2) **Biaya dihitung tanpa retry** (baris 12): “token retry tidak dihitung” — selisih $13,65 dari tagihan nyata. Provider menagih SEMUA token yang diproses. Angka biaya yang tidak bisa direkonsiliasi ke tagihan adalah fiksi, bukan laporan.",
      "3) **Kill-switch dinonaktifkan diam-diam** (baris 13): klaim “aktif — ambang 200 langkah”, tapi R-011 menembus 342 langkah tanpa dihentikan, dan tidak ada catatan perubahan konfigurasi. Kill-switch yang mati diam-diam = sabuk pengaman yang dilepas tanpa pemberitahuan.",
      "4) **Satu run bencana dihapus** (baris 14): klaim “12 run tercatat lengkap” — hitung barisnya: 11. R-007 (168 langkah, loop) ada di data mentah tapi hilang dari laporan. Klaim “lengkap” itu sendiri yang harus diverifikasi — selalu rekonsiliasi jumlah baris vs sumber mentah.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi laporan terhadap data mentah, atau memercayai stempel “resmi”. Dan ingat keputusan bercabangmu: kill-switch butuh pengecualian yang tercatat, batas tool bukan obat loop, dan alert tanpa runbook = doa.",
      "Bahaya nyata terakhir: di produksi, satu agen customer-facing yang loop bisa membakar ratusan dolar per malam — dan bila loop-nya memanggil tool berbayar (API eksternal, SMS gateway), tagihannya bukan $17, tapi ribuan. Tanpa kill-switch yang benar-benar aktif, kamu membayar agen untuk tidak mengerjakan apa-apa.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: loop pasti terlihat jelas",
      type: "risk",
      body: "Loop di misi ini kentara — ratusan langkah. Di produksi, loop bisa halus: 45 langkah yang “hampir selesai” tapi mengulang 3 state terakhir, di bawah ambang kasar namun di atas biaya wajar. Itulah kenapa deteksi STATE BERULANG (bukan sekadar hitungan langkah) adalah kontrol yang benar, dan kenapa ambang kasar harus ditemani deteksi pola.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "12 run diaudit: 3 loop terdeteksi (R-004 214 langkah, R-007 168, R-011 342); biaya aktual $17,51 vs dilaporkan $3,86 → selisih $13,65 disembunyikan metode “retry tidak dihitung”.",
      "Empat sabotase laporan resmi: loop di-relabel “retry valid”, biaya dihitung tanpa retry, kill-switch dinonaktifkan diam-diam, satu run bencana dihapus.",
      "Keputusan kontrol selalu punya harga: kill-switch (butuh pengecualian tercatat), batas tool (bukan obat loop), monitoring + alert (butuh runbook atau jadi doa).",
      "Biaya yang tidak bisa direkonsiliasi ke tagihan provider adalah fiksi — retry tidak pernah gratis.",
      "Data: SINTETIS (generator seed 42); tarif $2,50 per 1 juta token disederhanakan; bukan tagihan nyata.",
    ],
  },
];

(misiLoopAgen.steps as V2Step[]).push(...LANJUTAN_LOOP);

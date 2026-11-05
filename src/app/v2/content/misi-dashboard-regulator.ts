import type { V2Mission } from "../lib/types";

// ── MISI Dashboard Regulator: Angka yang Bisa Dipertahankan ─────────────
// M2 — Business Intelligence Misi A (core). Dataset 100% SINTETIS, seed 42.
// File: public/misi/misi-dashboard-regulator/transaksi.csv (1.871 baris) +
// definisi_metrik.csv (kamus definisi v1). Metode: METODE.md.

const BASE = "/misi/misi-dashboard-regulator";

export const misiDashboardRegulator: V2Mission = {
  slug: "misi-dashboard-regulator",
  track: "Business Intelligence",
  module: "Misi",
  title: "Misi Dashboard: Angka yang Bisa Dipertahankan",
  estMinutes: 135,
  role: "Analis Business Intelligence",
  client:
    "Kepala Kepatuhan — dashboard kepatuhan Q1 2026 akan diaudit regulator; setiap angka harus bisa ditelusuri kembali ke baris sumber",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Regulator akan bertanya: dari mana angka ini?",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis Business Intelligence di sebuah perusahaan jasa keuangan — pemilik dashboard kepatuhan",
        client:
          "Kepala Kepatuhan. Setiap kuartal, perusahaanmu mengirim dashboard kepatuhan ke regulator: total transaksi, pengguna aktif, tingkat validitas, nilai transaksi. Kuartal lalu, regulator mengajukan satu pertanyaan sederhana ke satu angka — “dari mana angka ini?” — dan timmu butuh TIGA HARI untuk menjawabnya, karena tidak ada yang tahu query mana yang menghasilkan angka itu, dari tabel mana, dengan filter apa. Tahun ini regulator datang dengan tim audit yang lebih besar. Kamu diminta membangun ulang fondasi dashboard: definisi metrik yang dikunci, agregasi berlapis yang bisa ditelusuri, dan nota metodologi yang berani ditandatangani.",
        story: [
          "Senin, 09:12. Email dari Kepala Kepatuhan, subjeknya hanya tiga kata: “Mereka datang lagi.” Isinya: jadwal audit regulator atas dashboard kepatuhan Q1, dua minggu dari sekarang. Tahun lalu, satu pertanyaan — “dari mana angka pengguna aktif ini?” — membuat seluruh tim lembur tiga hari menelusuri spreadsheet, query lama, dan satu file CSV yang ternyata dibuat manual oleh seseorang yang sudah resign.",
          "Kamu membuka dashboard yang sekarang. “Pengguna aktif Q1: 394.” Kedengarannya meyakinkan — sampai kamu bertanya ke diri sendiri: 394 itu distinct user sepanjang kuartal, atau rata-rata bulanan, atau pengguna bulan terakhir? Tidak ada yang tahu. Definisi tidak tertulis di mana pun. Angka ini sedang menunggu untuk ditanyai — dan kali ini, kamulah yang harus menjawabnya.",
          "Misi ini memakai data transaksi sintetis (1.871 baris, Q1 2026) beserta kamus definisi resmi v1. Tugasmu: hitung ulang semua metrik dari baris mentah, buktikan agregasimu auditable lewat dua jalur perhitungan independen, temukan sabotase di paket panel yang akan dikirim ke regulator, dan tulis nota metodologi yang membuat pertanyaan “dari mana angka ini?” bisa dijawab dalam tiga menit — bukan tiga hari.",
        ],
        objectives: [
          "Mendefinisikan metrik secara konsisten dari kamus v1 (pengguna aktif, transaksi valid, total nominal valid) dan menghitungnya langsung dari baris sumber.",
          "Membangun agregasi berlapis yang auditable: total yang dihitung dari baris mentah SAMA PERSIS dengan total yang dihitung dari agregasi harian (selisih nol).",
          "Menemukan 3 sabotase di paket panel dashboard dan menulis nota metodologi + tabel rekonsiliasi untuk regulator.",
        ],
        prereqSummary:
          "Dashboard kepatuhan = ringkasan angka yang dikirim ke regulator (transaksi, pengguna, nilai). “Auditable” artinya setiap angka bisa ditelusuri balik: angka → query → tabel → baris sumber. “Definisi metrik” = aturan tertulis tentang apa yang dihitung (mis. pengguna aktif = distinct user_id dengan minimal 1 transaksi valid dalam satu bulan kalender). Tanpa definisi tertulis, dua orang bisa menghitung “pengguna aktif” dan mendapat dua angka berbeda — dan keduanya merasa benar.",
        datasetNote:
          "Status data: 100% SINTETIS — tidak ada transaksi, nasabah, atau regulator yang nyata. Dibangkitkan oleh skrip build-misi/misi-dashboard-regulator/gen.py dengan seed tetap 42 (deterministik).\nFile: transaksi.csv (1.871 baris: transaksi_id, tanggal, user_id, nominal, status, kanal, wilayah; periode 2026-01-01 s.d. 2026-03-31) + definisi_metrik.csv (kamus definisi resmi v1).\nKejujuran: ±20% baris berstatus void diberi nominal 0 (entri rusak, disengaja) — perlakukan sesuai definisi, bukan firasat. Metode lengkap: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file: kebenaran mentah dan kamus kebenaran",
      prose: [
        "`transaksi.csv` adalah kebenaran mentah: 1.871 baris transaksi Q1 2026 — setiap baris punya ID, tanggal, pengguna, nominal, status (`valid`, `gagal`, `pending`, `void`), kanal, dan wilayah. Tidak ada agregat, tidak ada klaim. Hanya baris.",
        "`definisi_metrik.csv` adalah kamus kebenaran: empat definisi resmi v1 yang berlaku sejak 2026-01-01. M1: pengguna aktif = distinct `user_id` dengan minimal 1 transaksi berstatus `valid` dalam satu bulan kalender. M2: transaksi valid = baris dengan `status = 'valid'`. M3: total nominal valid = jumlah `nominal` untuk baris valid. M4: tingkat validitas = `n_valid / n_total`.",
        "Aturan main misi ini: (1) semua angka dashboard dihitung dari baris mentah memakai definisi v1 — bukan dari ingatan, bukan dari dashboard lama; (2) setiap total wajib bisa direkonsiliasi lewat dua jalur independen; (3) apa pun yang tidak bisa ditelusuri ke baris sumber tidak boleh masuk ke paket regulator.",
      ],
      tasks: [
        { id: "t1", text: "Buka `transaksi.csv`: catat jumlah baris, rentang tanggal, dan nilai-nilai unik kolom `status`" },
        { id: "t2", text: "Buka `definisi_metrik.csv`: hafalkan M1–M4 — ini kontrak yang mengikat seluruh misimu" },
      ],
      note: {
        title: "Miskonsepsi #1: definisi itu sepele, yang penting angkanya",
        type: "pitfall",
        body: "“Pengguna aktif kan jelas maksudnya.” TIDAK jelas — dan di situlah semua bencana dashboard bermula. Distinct user sepanjang kuartal (394) vs distinct user Januari saja (288) vs rata-rata bulanan: ketiganya bisa disebut “pengguna aktif Q1” oleh tiga orang berbeda, dan ketiganya “benar” menurut definisinya masing-masing. Definisi yang tidak tertulis = tiga angka berbeda untuk satu label. Regulator tidak menanyakan angkamu; regulator menanyakan DEFINISImu.",
      },
      reference:
        "transaksi.csv (1.871 baris mentah, SINTETIS) + definisi_metrik.csv (M1–M4, v1). Semua lab dihitung dari dua file ini.",
    },
    {
      id: "lab-definisi",
      eyebrow: "Langkah 3 · Lab 1 — Definisi yang konsisten",
      title: "Hitung ulang dari baris mentah, pakai kamus v1",
      prose: [
        "Sekarang buktikan kamu bisa menghitung seperti auditor. Dari `transaksi.csv`, terapkan definisi v1 kata per kata: saring baris `valid`, hitung distinct pengguna aktif Januari, jumlahkan nominal valid, pecah per bulan. Lalu lakukan hal yang membedakan analis BI dari pembuat chart: hitung total nominal valid lewat DUA jalur — langsung dari baris, dan dari agregasi harian yang dijumlahkan. Kalau fondasimu benar, selisihnya NOL.",
        "Rumus tingkat validitas (M4) sudah disiapkan — simbolnya sederhana, tapi maknanya adalah kontrak: pembilang dan penyebut harus memakai definisi yang sama dengan semua panel lain.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`, `tgl_awal`, `tgl_akhir`" },
        { id: "t2", text: "Terapkan M1–M3: `n_valid`, `n_user_aktif_jan`, `total_nominal_valid`" },
        { id: "t3", text: "Agregasi berlapis: `jan_valid`, `feb_valid`, `mar_valid`, lalu `selisih_dua_jalur` (target: 0)" },
      ],
      expected:
        "n_baris=1871, n_valid=1458 (tingkat validitas 77,93%), user aktif Jan=288, total nominal valid Rp 320.815.338, per bulan 512/477/469 (jumlah = 1458), selisih dua jalur = 0",
      formula: String.raw`v = \frac{n_{valid}}{n_{total}}`,
      formulaNote:
        "v = tingkat validitas (M4); n_valid = baris dengan status 'valid'; n_total = seluruh baris. Angka ini artinya: dari setiap 100 baris transaksi, ~78 lolos sebagai transaksi valid.",
      note: {
        title: "Miskonsepsi #2: baris void nominal 0 harus “dibersihkan” dulu",
        type: "pitfall",
        body: "Ada 16 baris `void` ber-nominal 0 di data ini. Insting berkata “hapus saja, itu sampah”. Definisi v1 berkata: metrik valid (M2/M3) hanya menghitung `status = 'valid'` — baris void SUDAH tersaring oleh definisi, tanpa perlu dihapus manual. Membersihkan data di luar definisi justru merusak audit trail: baris yang kamu hapus diam-diam tidak bisa dijelaskan ke regulator. Saring sesuai definisi, jangan “bersihkan” sesuai firasat.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — kolom tanggal bertipe string di file ini.",
        "Baris valid: `valid = df[df[\"status\"] == \"valid\"]` — terapkan M2 kata per kata.",
        "Pengguna aktif Jan (M1): saring `valid` ke tanggal berawalan \"2026-01\", lalu `nunique()` pada `user_id`.",
        "Dua jalur: jalur A = `valid[\"nominal\"].sum()`; jalur B = `valid.groupby(\"tanggal\")[\"nominal\"].sum().sum()`. Selisih keduanya harus 0.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-dashboard-regulator/transaksi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah (pakai definisi v1!)",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "tgl_awal = ...",
          "tgl_akhir = ...",
          "",
          "valid = ...            # M2: status == 'valid'",
          "n_valid = ...",
          "n_user_aktif_jan = ... # M1: distinct user_id, >=1 transaksi VALID di 2026-01",
          "total_nominal_valid = ...  # M3: jumlah nominal baris valid",
          "",
          "jan_valid = ...",
          "feb_valid = ...",
          "mar_valid = ...",
          "",
          "harian = ...           # agregasi: total nominal valid PER TANGGAL",
          "total_jalur_b = ...",
          "selisih_dua_jalur = ...  # target: 0",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"valid:\", n_valid, \"| user aktif Jan:\", n_user_aktif_jan)",
          "print(\"total nominal valid:\", total_nominal_valid)",
          "print(\"per bulan:\", jan_valid, feb_valid, mar_valid)",
          "print(\"selisih dua jalur:\", selisih_dua_jalur)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-dashboard-regulator/transaksi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah (pakai definisi v1!)",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "tgl_awal = df[\"tanggal\"].min()",
          "tgl_akhir = df[\"tanggal\"].max()",
          "",
          "valid = df[df[\"status\"] == \"valid\"]",
          "n_valid = len(valid)",
          "n_user_aktif_jan = int(valid[valid[\"tanggal\"].str.startswith(\"2026-01\")][\"user_id\"].nunique())",
          "total_nominal_valid = int(valid[\"nominal\"].sum())",
          "",
          "jan_valid = int(((valid[\"tanggal\"] >= \"2026-01-01\") & (valid[\"tanggal\"] <= \"2026-01-31\")).sum())",
          "feb_valid = int(((valid[\"tanggal\"] >= \"2026-02-01\") & (valid[\"tanggal\"] <= \"2026-02-28\")).sum())",
          "mar_valid = int(((valid[\"tanggal\"] >= \"2026-03-01\") & (valid[\"tanggal\"] <= \"2026-03-31\")).sum())",
          "",
          "harian = valid.groupby(\"tanggal\")[\"nominal\"].sum()",
          "total_jalur_b = int(harian.sum())",
          "selisih_dua_jalur = total_nominal_valid - total_jalur_b",
          "",
          "print(\"baris:\", n_baris, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"valid:\", n_valid, \"| user aktif Jan:\", n_user_aktif_jan)",
          "print(\"total nominal valid:\", total_nominal_valid)",
          "print(\"per bulan:\", jan_valid, feb_valid, mar_valid)",
          "print(\"selisih dua jalur:\", selisih_dua_jalur)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari transaksi.csv." },
          { kind: "equal", task: "t1", label: "`n_baris` = 1871", name: "n_baris", value: 1871, msg: "File punya 1.871 baris (90 hari, 2026-01-01 s.d. 2026-03-31)." },
          { kind: "equal", task: "t1", label: "`tgl_awal` = 2026-01-01", name: "tgl_awal", value: "2026-01-01", msg: "Ambil min kolom tanggal." },
          { kind: "equal", task: "t1", label: "`tgl_akhir` = 2026-03-31", name: "tgl_akhir", value: "2026-03-31", msg: "Ambil max kolom tanggal." },
          { kind: "equal", task: "t2", label: "`n_valid` = 1458", name: "n_valid", value: 1458, msg: "M2: hanya baris status = 'valid' — bukan 'gagal'/'pending'/'void'." },
          { kind: "equal", task: "t2", label: "`n_user_aktif_jan` = 288", name: "n_user_aktif_jan", value: 288, msg: "M1: distinct user_id dengan >=1 transaksi VALID di Januari saja (bukan sepanjang Q1)." },
          { kind: "equal", task: "t2", label: "`total_nominal_valid` = 320815338", name: "total_nominal_valid", value: 320815338, msg: "M3: jumlahkan nominal HANYA untuk baris valid." },
          { kind: "equal", task: "t3", label: "`jan_valid` = 512", name: "jan_valid", value: 512, msg: "Transaksi valid Januari (batas tanggal 2026-01-01 s.d. 2026-01-31)." },
          { kind: "equal", task: "t3", label: "`feb_valid` = 477", name: "feb_valid", value: 477, msg: "Transaksi valid Februari." },
          { kind: "equal", task: "t3", label: "`mar_valid` = 469", name: "mar_valid", value: 469, msg: "Transaksi valid Maret. 512+477+469 harus = 1458." },
          { kind: "equal", task: "t3", label: "`selisih_dua_jalur` = 0", name: "selisih_dua_jalur", value: 0, msg: "Total dari baris langsung vs dari agregasi harian harus SAMA PERSIS — ini bukti agregasimu auditable." },
        ],
      },
    },
    {
      id: "lab-sql-lapis",
      eyebrow: "Langkah 4 · Lab 2 — Rekonsiliasi panel",
      title: "Panel boleh salah; baris tidak",
      prose: [
        "Dashboard lama punya panel “Rata-rata transaksi valid harian (Januari)” yang angkanya tidak bisa dijelaskan siapa pun. Kamu akan membangun ulang panel itu dari tabel agregat harian — dan yang lebih penting, membuktikan panel itu konsisten dengan baris sumber. Di bawah ini 10 hari agregat Januari (seperti tabel `harian` di data warehouse).",
        "Tabel `harian(tanggal TEXT, n_valid INTEGER, nominal_valid INTEGER)`. Tulis query yang menghasilkan SATU baris rekonsiliasi: bulan, total nominal, total transaksi, dan jumlah hari — fondasi yang bisa ditandatangani.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query rekonsiliasi: total nominal + total transaksi + jumlah hari untuk 2026-01" },
      ],
      expected: "1 baris: 2026-01 | 38174504 | 166 | 10 — cocok dengan agregat harian Januari",
      sqlLab: {
        task: "Rekonsiliasi panel: dari tabel harian, hitung total nominal valid, total transaksi valid, dan jumlah hari untuk bulan 2026-01. Satu baris hasil.",
        schema: "CREATE TABLE harian (tanggal TEXT, n_valid INTEGER, nominal_valid INTEGER);",
        seedData: [
          "INSERT INTO harian VALUES",
          "('2026-01-05',20,4350552),",
          "('2026-01-06',16,2748256),",
          "('2026-01-07',17,4549676),",
          "('2026-01-08',12,2651665),",
          "('2026-01-09',19,4324087),",
          "('2026-01-10',20,4549191),",
          "('2026-01-11',20,4730303),",
          "('2026-01-12',18,5553434),",
          "('2026-01-13',10,1549584),",
          "('2026-01-14',14,3167756);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT '2026-01' AS bulan\nFROM harian\n",
        solution: [
          "SELECT '2026-01' AS bulan,",
          "       SUM(nominal_valid) AS total_nominal,",
          "       SUM(n_valid) AS n_transaksi,",
          "       COUNT(*) AS n_hari",
          "FROM harian;",
        ].join("\n"),
        expectedColumns: ["bulan", "total_nominal", "n_transaksi", "n_hari"],
        expectedRows: [
          ["2026-01", 38174504, 166, 10],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiDashboardRegulator;

// ── lanjutan misiDashboardRegulator: langkah 5–12 ────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_REGULATOR: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Angka lama 394 itu mau kamu apakan?",
    prose: [
      "Masalah. Dashboard yang sudah dipublikasikan internal menampilkan “Pengguna aktif Q1: 394” — dihitung dengan definisi LAMA pra-v1 (distinct user sepanjang kuartal, tanpa memandang bulan). Definisi resmi v1 yang baru kamu terapkan menghitung per bulan (Januari = 288). Kedua angka “benar” menurut definisinya masing-masing — tapi regulator akan melihat DUA angka berbeda untuk label yang sama. Keputusan ini final, seperti angka yang sudah dikirim.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Dashboard lama (394, definisi pra-v1) vs hitungan barumu (definisi v1). Apa yang kamu lakukan sebelum paket dikirim ke regulator?",
      options: [
        {
          id: "opt-lama",
          label: "Pertahankan angka lama (394) demi konsistensi publikasi",
          rationale:
            "Angka sudah dipublikasikan internal; mengubahnya membingungkan stakeholder. Definisi lama “tidak salah, hanya berbeda” — konsistensi lebih penting.",
          nextStepId: "konsekuensi-lama",
          consequenceNote:
            "Regulator membandingkan dashboard Q1 dengan kamus definisi v1 yang kamu lampirkan — dan menemukan angka 394 tidak bisa dihasilkan oleh definisi mana pun di kamus. Kamu tidak bisa menjelaskan asal-usulnya tanpa mengakui memakai definisi yang sudah kedaluwarsa.",
        },
        {
          id: "opt-diam",
          label: "Perbaiki diam-diam ke definisi v1, tanpa catatan perubahan",
          rationale:
            "Yang penting angkanya benar sekarang. Catatan perubahan hanya mengundang pertanyaan yang tidak perlu.",
          nextStepId: "konsekuensi-diam",
          consequenceNote:
            "Audit internal menemukan angka Q1 berubah dari 394 menjadi 288 tanpa jejak. Tidak ada yang bisa membuktikan kapan, oleh siapa, dan kenapa — dan “perbaikan diam-diam” terlihat persis seperti manipulasi dari sudut pandang auditor.",
        },
        {
          id: "opt-jujur",
          label: "Perbaiki + nota metodologi + tabel rekonsiliasi lama-vs-baru",
          rationale:
            "Regulator menghargai koreksi yang terdokumentasi lebih dari konsistensi yang tidak bisa dijelaskan. Jejak audit adalah buktinya.",
          nextStepId: "konsekuensi-jujur",
          consequenceNote:
            "Regulator justru memuji: “koreksi metodologi yang transparan”. Tabel rekonsiliasi lama-vs-baru menjadi template untuk semua metrik — dan kamu tidak pernah lagi ditanya “dari mana angka ini?” tanpa jawaban siap.",
        },
      ],
    },
  },
  {
    id: "konsekuensi-lama",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: angka lama dipertahankan",
    prose: [
      "Kamu mempertahankan 394 demi konsistensi. Dua minggu kemudian, di ruang audit, regulator membuka kamus definisi v1 yang kamu lampirkan sendiri — lalu menunjuk angka 394 di dashboard. “Tolong tunjukkan query yang menghasilkan angka ini dengan definisi di kamus.” Tidak ada. Definisi pra-v1 tidak tertulis di mana pun; ia hidup di ingatan seseorang yang sudah resign.",
      "Pelajaran yang mahal: konsistensi dengan masa lalu tidak ada nilainya bila masa lalu itu sendiri tidak terdokumentasi. Angka yang tidak bisa direproduksi dari definisi tertulis bukanlah “konsisten” — ia yatim.",
    ],
    tasks: [],
    note: {
      title: "Konsistensi tanpa definisi = konsistensi semu",
      body: "“Angka kita konsisten dengan kuartal lalu” hanya bermakna bila definisinya juga sama — dan tertulis. Tanpa itu, kamu konsisten dengan sesuatu yang tidak bisa kamu buktikan. Di nota metodologimu, setiap angka wajib mencantumkan versi definisinya (v1, v2, …).",
    },
  },
  {
    id: "konsekuensi-diam",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: diperbaiki diam-diam",
    prose: [
      "Angka di dashboard berubah dari 394 menjadi 288 dalam semalam — tanpa catatan, tanpa tanggal, tanpa nama. Seminggu kemudian auditor internal menanyaimu: “Kenapa angka Q1 berubah? Siapa yang mengubah? Atas dasar apa?” Kamu menjelaskan panjang lebar tentang definisi v1 — tapi tidak ada satu dokumen pun yang mencatat perubahan itu terjadi.",
      "Dari sudut pandang auditor, “perbaikan diam-diam” dan “manipulasi diam-diam” terlihat IDENTIK: angka berubah, tidak ada jejak. Niat baikmu tidak tercatat di mana pun — dan yang tidak tercatat, tidak ada.",
    ],
    tasks: [],
    note: {
      title: "Perubahan tanpa jejak = tidak terjadi (bagi auditor)",
      body: "Auditor tidak menilai niat; auditor menilai bukti. Setiap perubahan angka setelah publikasi wajib dicatat: tanggal, definisi lama → baru, alasan, dan siapa yang menyetujui. Itu bukan birokrasi — itu satu-satunya pembeda antara koreksi dan manipulasi.",
    },
  },
  {
    id: "konsekuensi-jujur",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: perbaiki + dokumentasikan",
    prose: [
      "Kamu memperbaiki angka menjadi 288 (definisi v1), melampirkan nota metodologi satu halaman, dan tabel rekonsiliasi yang menunjukkan persis dari mana selisih 394 → 288 berasal (106 user yang aktif di Februari/Maret tapi tidak di Januari). Di ruang audit, regulator membaca nota itu — lalu mengangguk. “Ini yang kami harapkan dari semua bank.”",
      "Koreksi yang terdokumentasi ternyata bukan pengakuan kelemahan — ia bukti kedewasaan. Dan tabel rekonsiliasi itu menjadi template: setiap metrik dashboard kini punya pasangan “angka + jejak”-nya sendiri.",
    ],
    tasks: [],
    note: {
      title: "Transparansi adalah strategi, bukan sekadar etika",
      body: "Regulator menghukum yang menyembunyikan, bukan yang mengoreksi. Nota metodologi yang jujur (“definisi berubah dari pra-v1 ke v1 pada tanggal X, dampaknya −106 user”) mengubah pertanyaan jebakan menjadi momen kepercayaan. Tulis koreksimu SEBELUM ditanya.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: paket panel yang “siap kirim” itu bocor",
    prose: [
      "Sebelum menulis nota metodologi, satu misi audit. Di bawah ini 14 baris “Paket Panel Dashboard Kepatuhan Q1 2026” — draf yang akan dikirim ke regulator. Seseorang menyuntikkan 3 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri: 1.458 transaksi valid, 288 pengguna aktif Januari, Rp 320.815.338 total nominal valid, selisih dua jalur = 0.",
      "Senjatamu: definisi v1 dan angka-angka yang sudah kamu buktikan dari baris mentah.",
    ],
    tasks: [],
    auditDossier: {
      version: "regulator-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai paket panel Dashboard Kepatuhan Q1 2026 yang siap dikirim ke regulator.",
      columns: ["Panel", "Metrik", "Periode", "Angka", "Definisi", "Sumber"],
      rows: [
        { rowId: 1, cells: { "Panel": "Ringkasan", "Metrik": "Total transaksi valid", "Periode": "Q1 (1 Jan–31 Mar)", "Angka": "1.458", "Definisi": "status = 'valid' (M2)", "Sumber": "transaksi.csv" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 1" }] },
        // ── I1a: definisi berubah ──
        { rowId: 2, cells: { "Panel": "Ringkasan", "Metrik": "Pengguna aktif", "Periode": "Q1", "Angka": "394", "Definisi": "distinct user_id sepanjang Q1", "Sumber": "transaksi.csv" }, claims: [{ label: "Definisi", value: "pra-v1 (tidak tertulis)" }] },
        { rowId: 3, cells: { "Panel": "Ringkasan", "Metrik": "Tingkat validitas", "Periode": "Q1", "Angka": "77,93%", "Definisi": "n_valid / n_total (M4)", "Sumber": "transaksi.csv" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 1" }] },
        // ── I1b: definisi berubah (pasangan) ──
        { rowId: 4, cells: { "Panel": "Tren", "Metrik": "Pengguna aktif", "Periode": "Q1", "Angka": "288", "Definisi": "distinct user_id (filter bulan: Januari)", "Sumber": "transaksi.csv" }, claims: [{ label: "Definisi", value: "M1 v1" }] },
        { rowId: 5, cells: { "Panel": "Tren", "Metrik": "Transaksi valid per bulan", "Periode": "Jan / Feb / Mar", "Angka": "512 / 477 / 469", "Definisi": "status = 'valid' (M2)", "Sumber": "transaksi.csv" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 1" }] },
        // ── I2: filter tanggal tidak konsisten ──
        { rowId: 6, cells: { "Panel": "Efisiensi", "Metrik": "Rata-rata transaksi valid harian", "Periode": "15 Jan–15 Mar", "Angka": "18,2", "Definisi": "n_valid / n_hari", "Sumber": "transaksi.csv" }, claims: [{ label: "Periode", value: "Disesuaikan (libur akhir tahun)" }] },
        { rowId: 7, cells: { "Panel": "Efisiensi", "Metrik": "Total nominal valid", "Periode": "Q1", "Angka": "Rp 320.815.338", "Definisi": "sum nominal status='valid' (M3)", "Sumber": "transaksi.csv" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 1" }] },
        { rowId: 8, cells: { "Panel": "Kanal", "Metrik": "Transaksi valid per kanal", "Periode": "Q1", "Angka": "728 / 435 / 295", "Definisi": "aplikasi / web / agen", "Sumber": "transaksi.csv" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        // ── I3: angka manual tanpa sumber ──
        { rowId: 9, cells: { "Panel": "Keuangan", "Metrik": "Nilai transaksi bersih Januari", "Periode": "Jan", "Angka": "Rp 41.250.000.000", "Definisi": "input manual", "Sumber": "manual (tim finance)" }, claims: [{ label: "Jejak", value: "Tidak ada" }] },
        { rowId: 10, cells: { "Panel": "Keuangan", "Metrik": "Nilai transaksi bersih Februari", "Periode": "Feb", "Angka": "Rp 38.900.000.000", "Definisi": "input manual", "Sumber": "manual (tim finance)" }, claims: [{ label: "Jejak", value: "Tidak ada" }] },
        { rowId: 11, cells: { "Panel": "Kamus", "Metrik": "Versi definisi metrik", "Periode": "—", "Angka": "v1 (Jan 2026)", "Definisi": "—", "Sumber": "definisi_metrik.csv" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
        { rowId: 12, cells: { "Panel": "Kualitas", "Metrik": "Baris void nominal 0", "Periode": "Q1", "Angka": "16 baris", "Definisi": "status='void' → di luar metrik valid", "Sumber": "transaksi.csv" }, claims: [{ label: "Perlakuan", value: "Tersaring oleh M2, tidak dihapus" }] },
        { rowId: 13, cells: { "Panel": "Ringkasan", "Metrik": "Total baris sumber", "Periode": "Q1", "Angka": "1.871", "Definisi": "semua status", "Sumber": "transaksi.csv" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 1" }] },
        { rowId: 14, cells: { "Panel": "Validasi", "Metrik": "Jejak audit agregasi berlapis", "Periode": "Q1", "Angka": "selisih 0", "Definisi": "dua jalur agregasi independen", "Sumber": "Lab internal" }, claims: [{ label: "Terverifikasi", value: "Ya — cocok Lab 1" }] },
      ],
      injections: [
        { key: "definisi-berubah", rowIds: [2, 4], title: "Definisi metrik berubah di tengah dashboard", clue: "Label “Pengguna aktif” muncul dua kali (baris 2: 394, baris 4: 288) dengan definisi berbeda — tanpa nomor versi. Baris 4 mewarisi filter bulan Januari secara diam-diam; baris 2 memakai definisi pra-v1 yang tidak tertulis di kamus.", danger: "Regulator yang menemukan dua angka berbeda untuk satu label akan mengasumsikan yang terburuk. Satu label = satu definisi berversi, selalu dicantumkan." },
        { key: "filter-tanggal", rowIds: [1, 6], title: "Filter tanggal tidak konsisten antar panel", clue: "Panel Ringkasan memakai 1 Jan–31 Mar (baris 1), panel Efisiensi memakai 15 Jan–15 Mar (baris 6) dengan alasan “disesuaikan”. Rata-rata harian dihitung dari periode yang lebih pendek — metrik tidak bisa dibandingkan antar panel.", danger: "Periode yang berbeda-beda adalah cara halus mempercantik angka tanpa mengubah satu baris data pun. Semua panel pembanding wajib memakai periode yang sama, atau perbedaannya dinyatakan eksplisit." },
        { key: "angka-manual", rowIds: [9, 10], title: "Angka “manual” tanpa sumber", clue: "Rp 41,25 miliar untuk Januari — padahal total nominal VALID seluruh Q1 hanya Rp 320,8 juta (baris 7). Tidak ada baris sumber, tidak ada rumus, hanya “input manual tim finance”. Selisih 128× lipat tidak bisa dijelaskan.", danger: "Angka tanpa jejak ke baris sumber tidak bisa diaudit dan tidak bisa dibela. Inilah tepatnya pertanyaan “dari mana angka ini?” yang tidak terjawab — dan alasan dashboard tahun lalu butuh tiga hari untuk satu jawaban." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Nota metodologi untuk regulator",
    prose: [
      "Semua bukti di tangan. Tulis nota metodologi satu halaman + tabel rekonsiliasi untuk regulator — artefak portofoliomu. Nota yang baik membuat pertanyaan “dari mana angka ini?” terjawab dalam tiga menit: definisi berversi, query, dan jejak ke baris sumber — untuk setiap angka.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Daftar metrik + definisi berversi: setiap metrik (M1–M4) dengan definisi kata-per-kata, versi, dan tanggal berlaku.",
        "Tabel rekonsiliasi: untuk setiap angka dashboard — nilai, query/sumber, jumlah baris sumber, dan hasil cek dua jalur (selisih harus 0).",
        "Perubahan vs publikasi lama: angka mana yang berubah dari dashboard lama (394 → 288), kenapa (pra-v1 → v1), dan dampaknya.",
        "Temuan audit paket panel: sabotase apa yang kamu temukan di draf paket, baris per baris, dan perbaikannya.",
        "Batas & risiko sisa: apa yang TIDAK dicakup nota ini (mis. data sintetis latihan; di produksi, butuh kontrol akses ke tabel sumber + versioning query).",
      ],
      rubric: [
        { criterion: "Kebenaran metrik", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "1.458 valid, 288 user aktif Jan, Rp 320.815.338, 512/477/469 — semua tepat dari definisi v1"] },
        { criterion: "Keterlacakan (traceability)", weight: 25, levels: ["Angka tanpa sumber", "Sebagian angka punya sumber", "Setiap angka: definisi berversi + query + jumlah baris sumber + selisih dua jalur = 0"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Ketiga sabotase disebut dengan nomor baris (2+4, 6, 9+10)"] },
        { criterion: "Kejujuran perubahan & batas", weight: 25, levels: ["Menyembunyikan perubahan 394→288", "Menyebut perubahan tanpa alasan", "Perubahan didokumentasikan (alasan + dampak) dan batas nota dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Tiga sabotase di paket panel:",
      "1) **Definisi berubah** (baris 2 & 4): “Pengguna aktif” = 394 di panel Ringkasan (distinct sepanjang Q1, definisi pra-v1 yang tidak tertulis) dan 288 di panel Tren (distinct Januari, filter bulan terbawa diam-diam). Label sama, definisi beda, versi tidak dicantumkan. Hitunganmu yang benar menurut v1: 288 untuk Januari.",
      "2) **Filter tanggal tidak konsisten** (baris 6): rata-rata harian dihitung dari 15 Jan–15 Mar — periode yang lebih pendek dan “lebih bersih” — sementara panel lain memakai kuartal penuh. Alasan “disesuaikan (libur akhir tahun)” bukan metodologi, itu kosmetik.",
      "3) **Angka manual** (baris 9–10): Rp 41,25 miliar “input manual tim finance” untuk Januari — 128× lipat dari total nominal valid seluruh Q1 (Rp 320,8 juta). Tidak ada baris sumber. Tidak ada rumus. Tidak bisa diaudit.",
      "Skor deteksimu (x/3) mengukur satu hal: apakah kamu memverifikasi setiap angka terhadap baris sumber dan kamus definisi, atau memercayai label panel. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — tapi hanya satu yang meninggalkan jejak yang bisa kamu bela.",
      "Bahaya nyata terakhir: dashboard yang tidak auditable bukan sekadar masalah teknis — ia masalah kepercayaan. Regulator yang tidak bisa menelusuri satu angka akan meragukan SEMUA angka. Tiga hari lembur tahun lalu adalah harga yang murah; denda dan pembekuan produk adalah harga yang sebenarnya.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: audit = mencari kesalahan orang",
      type: "risk",
      body: "Audit bukan perburuan kesalahan — audit adalah pembuktian bahwa angka bisa dipercaya. Dashboard yang lolos audit bukan yang “tidak ada masalahnya”, melainkan yang setiap masalahnya terdokumentasi: definisi berversi, perubahan tercatat, selisih direkonsiliasi. Bangun dashboard untuk diaudit, bukan untuk dipuji.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Definisi tertulis (v1) adalah fondasi: 1.458 transaksi valid, 288 pengguna aktif Januari, Rp 320.815.338 total nominal valid, 512/477/469 per bulan — semua dari baris mentah.",
      "Agregasi auditable = dua jalur independen memberi hasil sama persis (selisih 0): langsung dari baris vs dari agregasi harian.",
      "Tiga pola sabotase dashboard: definisi berubah tanpa versi (394 vs 288), filter tanggal tidak konsisten antar panel, angka “manual” tanpa baris sumber (Rp 41,25 M vs Rp 320,8 jt).",
      "Keputusan atas angka lama: pertahankan (tak terbela), perbaiki diam-diam (terlihat seperti manipulasi), perbaiki + dokumentasikan (satu-satunya yang bisa dibela).",
      "Data: 100% SINTETIS (seed 42), 1.871 baris transaksi Q1 2026 + kamus definisi_metrik.csv; metode di METODE.md — bukan data perusahaan nyata.",
    ],
  },
];

(misiDashboardRegulator.steps as V2Step[]).push(...LANJUTAN_REGULATOR);

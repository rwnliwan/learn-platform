import type { V2Mission } from "../lib/types";

// ── MISI Rekonsiliasi: Laporan yang Harus Klop ────────────────────────────
// M1 — Risk Reporting Misi A (core). Dataset: Statlog German Credit Data,
// UCI ML Repository — lisensi CC BY 4.0 (terverifikasi di halaman dataset
// pada 2026-10-15; atribusi: Prof. Dr. Hans Hofmann, Universitaet Hamburg).
// File: public/misi/misi-rekonsiliasi-laporan/loan_book.csv (1.000 baris,
// kode didekode via german.doc; status dari german.data-numeric).
// Sudut misi = PELAPORAN (rasio, tie-out antar-tabel, jejak audit) — BUKAN
// pemodelan kredit. Metode: METODE.md.

const BASE = "/misi/misi-rekonsiliasi-laporan";

export const misiRekonsiliasi: V2Mission = {
  slug: "misi-rekonsiliasi-laporan",
  track: "Risk Reporting",
  module: "Misi",
  title: "Misi Rekonsiliasi: Laporan yang Harus Klop",
  estMinutes: 120,
  role: "Analis pelaporan risiko",
  client:
    "Kepala Divisi Risk Reporting — laporan risiko triwulanan untuk komite; angka ringkasan eksekutif tidak klop dengan lampiran detail",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Dua angka NPL dalam satu laporan",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis pelaporan risiko — penjaga angka sebelum komite",
        client:
          "Kepala Divisi Risk Reporting. Laporan risiko triwulanan akan dibawa ke komite direksi minggu depan. Seorang direktur iseng membandingkan: NPL di ringkasan eksekutif tertulis 21,43% — tapi kalau dijumlahkan dari tabel lampiran per tujuan kredit, angkanya 30,0%. Selisih 8,57 poin persentase. “Salah satu dari dua angka ini bohong,” katanya. “Cari tahu yang mana — sebelum komite yang menemukannya.”",
        story: [
          "Jumat, 17:05 — satu jam sebelum kamu berniat pulang. Kepala Divisi meletakkan dua lembar di mejamu: halaman 2 (ringkasan eksekutif) dan lampiran 4 (rincian NPL per tujuan kredit). “Hitung sendiri dari loan book-nya. Seribu baris, tidak besar. Senin pagi saya mau satu jawaban: angka mana yang benar, di mana selisihnya, dan memo rekonsiliasi yang bisa saya tunjukkan ke komite.”",
          "Kamu tahu ini bukan soal siapa yang salah ketik. Laporan risiko yang angka ringkasannya tidak klop dengan detailnya adalah laporan yang tidak bisa dipertahankan — di depan komite, di depan auditor, di depan regulator. Dan sekali komite kehilangan kepercayaan pada satu angka, mereka mempertanyakan semuanya.",
          "Misi ini memakai loan book nyata: 1.000 kredit dari Statlog German Credit (UCI). Kamu bukan diminta menilai kelayakan kredit — itu pekerjaan analis kredit. Kamu diminta melakukan pekerjaan pelaporan: hitung rasio yang benar, buktikan angka antar-tabel saling mengunci (tie-out), dan tulis jejak auditnya.",
        ],
        objectives: [
          "Menghitung ulang NPL keseluruhan dan per tujuan kredit dari loan book mentah (1.000 baris).",
          "Melakukan tie-out: menemukan baris ringkasan yang tidak sama dengan agregat detail — tepat di tujuan kredit mana.",
          "Menemukan 4 sabotase di kutipan laporan triwulan dan menulis memo rekonsiliasi dengan tabel koreksi.",
        ],
        prereqSummary:
          "NPL (Non-Performing Loan) = porsi kredit macet terhadap total kredit — metrik kesehatan portofolio yang paling diawasi. Tie-out = disiplin bahwa setiap angka di ringkasan HARUS sama persis dengan penjumlahan tabel detailnya; selisih sekecil apa pun berarti ada yang salah (atau disembunyikan). Materialitas = ambang selisih yang dianggap penting — di bawahnya koreksi administratif, di atasnya masalah tata kelola.",
        datasetNote:
          "Sumber: Statlog German Credit Data, UCI Machine Learning Repository — lisensi CC BY 4.0 (terverifikasi di halaman dataset 2026-10-15). Atribusi: Prof. Dr. Hans Hofmann, Universitaet Hamburg, via UCI.\nFile: loan_book.csv — 1.000 baris, kolom: id, rekening_giro, durasi_bulan, riwayat_kredit, tujuan, plafon_kredit, tabungan, lama_kerja, cicilan_pct (cicilan % pendapatan), usia, hunian, kredit_berjalan, pekerjaan, status (lancar/macet).\nKejujuran: data tahun 1994 (satuan DM) — dipakai sebagai BAHAN LATIH struktur loan book nyata, bukan potret portofolio saat ini. “Macet” = status dataset, bukan definisi regulator. Metode: METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali buku sebelum menghitung rasionya",
      prose: [
        "Satu file: `loan_book.csv`, 1.000 baris — setiap baris satu fasilitas kredit dengan 14 kolom. Kolom kuncimu: `tujuan` (10 jenis: mobil baru, usaha, pendidikan, …), `plafon_kredit`, `cicilan_pct` (cicilan sebagai % pendapatan — semakin besar semakin berat), dan `status` (`lancar`/`macet`).",
        "Dua hal yang harus kamu pahami sebelum menghitung: (1) `cicilan_pct` adalah rasio — nilai 4 berarti cicilan = 4% pendapatan; ini hook untuk menemukan struktur yang mustahil; (2) `status` adalah FAKTA di file ini (hasil observasi), bukan prediksimu — kamu analis pelaporan, bukan model skoring.",
        "Aturan main: (1) semua rasio dihitung dari file ini — bukan dari ingatan, bukan dari laporan lama; (2) setiap angka yang kamu laporkan harus bisa ditelusuri balik ke baris-barisnya (jejak audit); (3) NPL = macet ÷ total, tanpa pengecualian diam-diam.",
      ],
      tasks: [
        { id: "t1", text: "Buka `loan_book.csv`: catat jumlah baris dan nama 14 kolom" },
        { id: "t2", text: "Catat dua nilai unik di kolom `status` dan arti masing-masing" },
      ],
      note: {
        title: "Miskonsepsi #1: rasio = angka, bukan definisi",
        type: "pitfall",
        body: "“NPL kan tinggal macet dibagi total.” Ya — TAPI: total yang mana? Termasuk restrukturisasi? Termasuk program pemerintah? Setiap pengecualian yang tidak dinyatakan mengubah angka — dan 21,43% vs 30,0% di laporan ini kemungkinan besar lahir dari definisi yang diam-diam berbeda. Rasio tanpa definisi denominator yang eksplisit bukan angka — itu opini.",
      },
      reference:
        "loan_book.csv (1.000 baris). Kunci: tujuan, plafon_kredit, cicilan_pct, status. Hitung dari mentah; laporkan dengan definisi.",
    },
    {
      id: "lab-npl",
      eyebrow: "Langkah 3 · Lab 1 — Hitung ulang NPL",
      title: "Berapa NPL yang sebenarnya?",
      prose: [
        "Hitung sendiri — jangan percaya kedua angka di laporan dulu. Dari `loan_book.csv`: (1) NPL keseluruhan; (2) NPL per tujuan kredit — tujuan mana yang paling berisiko?; (3) rata-rata `cicilan_pct` untuk kredit macet vs lancar, plus nilai maksimumnya — apakah ada struktur cicilan yang mustahil?",
        "Angka-angka ini adalah fondasi memo rekonsiliasimu. Setiap angka harus punya jejak: dari baris mana ia berasal.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`" },
        { id: "t2", text: "Hitung `npl_pct` keseluruhan (%, 1 desimal)" },
        { id: "t3", text: "Tujuan dengan NPL tertinggi: `tujuan_terburuk` dan `npl_terburuk`" },
        { id: "t4", text: "`cicilan_mean_macet`, `cicilan_mean_lancar`, `cicilan_max`" },
      ],
      expected:
        "n=1000; NPL 30,0%; terburuk: pendidikan 44,0% (n=50); cicilan mean macet 3,10 vs lancar 2,92; maks 4",
      note: {
        title: "Miskonsepsi #2: NPL tinggi = portofolio buruk",
        type: "pitfall",
        body: "NPL 30% terdengar mengerikan — tapi dataset ini memang dikurasi dengan 30% macet (oversampling untuk riset). Di portofolio nyata, NPL 30% = krisis; di SINI, 30% = karakteristik sampel. Pelajaran pelaporan: angka rasio tidak bermakna tanpa konteks PEMBENTUKAN sampelnya. Selalu tanyakan: “30% dari apa, dipilih bagaimana?”",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url`; `pd.read_csv(open_url(url))`.",
        "NPL: `(df[\"status\"]==\"macet\").mean()*100`.",
        "Per tujuan: `df.groupby(\"tujuan\")[\"status\"].apply(lambda s: (s==\"macet\").mean()*100)` lalu `.idxmax()` / `.max()`.",
        "Rata-rata per status: filter dulu, lalu `.mean()` pada kolom `cicilan_pct`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-rekonsiliasi-laporan/loan_book.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "npl_pct = ...",
          "",
          "npl_tujuan = ...",
          "tujuan_terburuk = ...",
          "npl_terburuk = ...",
          "",
          "cicilan_mean_macet = ...",
          "cicilan_mean_lancar = ...",
          "cicilan_max = ...",
          "",
          "print(\"baris:\", n_baris, \"| NPL:\", round(npl_pct, 1), \"%\")",
          "print(\"terburuk:\", tujuan_terburuk, round(npl_terburuk, 1), \"%\")",
          "print(\"cicilan macet:\", round(cicilan_mean_macet, 3), \"| lancar:\", round(cicilan_mean_lancar, 3), \"| maks:\", cicilan_max)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-rekonsiliasi-laporan/loan_book.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "npl_pct = (df[\"status\"] == \"macet\").mean() * 100",
          "",
          "npl_tujuan = df.groupby(\"tujuan\")[\"status\"].apply(lambda s: (s == \"macet\").mean() * 100)",
          "tujuan_terburuk = npl_tujuan.idxmax()",
          "npl_terburuk = float(npl_tujuan.max())",
          "",
          "cicilan_mean_macet = float(df[df[\"status\"] == \"macet\"][\"cicilan_pct\"].mean())",
          "cicilan_mean_lancar = float(df[df[\"status\"] == \"lancar\"][\"cicilan_pct\"].mean())",
          "cicilan_max = int(df[\"cicilan_pct\"].max())",
          "",
          "print(\"baris:\", n_baris, \"| NPL:\", round(npl_pct, 1), \"%\")",
          "print(\"terburuk:\", tujuan_terburuk, round(npl_terburuk, 1), \"%\")",
          "print(\"cicilan macet:\", round(cicilan_mean_macet, 3), \"| lancar:\", round(cicilan_mean_lancar, 3), \"| maks:\", cicilan_max)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 1000", name: "n_baris", value: 1000, msg: "Loan book punya tepat 1.000 fasilitas." },
          { kind: "equal", task: "t2", label: "`npl_pct` = 30,0", name: "npl_pct", value: 30.0, tol: 0.01, msg: "300 macet dari 1.000 = 30,0%. Bukan 21,43%." },
          { kind: "equal", task: "t3", label: "terburuk = pendidikan", name: "tujuan_terburuk", value: "pendidikan", msg: "Tujuan dengan NPL tertinggi adalah pendidikan." },
          { kind: "equal", task: "t3", label: "`npl_terburuk` = 44,0", name: "npl_terburuk", value: 44.0, tol: 0.01, msg: "22 dari 50 kredit pendidikan macet." },
          { kind: "equal", task: "t4", label: "cicilan macet ≈ 3,097", name: "cicilan_mean_macet", value: 3.097, tol: 0.005, msg: "Rata-rata cicilan_pct untuk status macet." },
          { kind: "equal", task: "t4", label: "`cicilan_max` = 4", name: "cicilan_max", value: 4, msg: "Nilai maksimum kolom cicilan_pct." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Tie-out",
      title: "Satu baris yang tidak klop",
      prose: [
        "NPL versimu: 30,0%. Sekarang uji silang: tabel `detail` (agregat per tujuan dari loan book — 10 baris) vs tabel `dilaporkan` (angka NPL per tujuan SEPERTI TERTULIS di laporan triwulan). JOIN keduanya dan temukan tujuan di mana angka laporan ≠ angka detail. Itulah sumber selisih 21,43% vs 30,0%.",
        "Tabel: `detail(tujuan TEXT, n_kredit INTEGER, npl_pct REAL)`, `dilaporkan(tujuan TEXT, npl_laporan REAL)`.",
      ],
      tasks: [
        { id: "t1", text: "JOIN kedua tabel; tampilkan tujuan di mana `npl_laporan` ≠ `npl_pct`" },
      ],
      expected: "1 baris: usaha — dilaporkan 25,05% vs detail 35,05%",
      sqlLab: {
        task: "Temukan selisih tie-out: gabungkan detail dan dilaporkan per tujuan, tampilkan yang angkanya tidak sama (tampilkan tujuan + kedua angka).",
        schema: "CREATE TABLE detail (tujuan TEXT, n_kredit INTEGER, npl_pct REAL);\nCREATE TABLE dilaporkan (tujuan TEXT, npl_laporan REAL);",
        seedData: [
          "INSERT INTO detail VALUES",
          "('furnitur/elektronik',181,32.04),",
          "('lainnya',12,41.67),",
          "('mobil baru',234,38.03),",
          "('mobil bekas',103,16.5),",
          "('pelatihan ulang',9,11.11),",
          "('pendidikan',50,44.0),",
          "('peralatan rumah tangga',12,33.33),",
          "('radio/televisi',280,22.14),",
          "('renovasi',22,36.36),",
          "('usaha',97,35.05);",
          "INSERT INTO dilaporkan VALUES",
          "('furnitur/elektronik',32.04),",
          "('lainnya',41.67),",
          "('mobil baru',38.03),",
          "('mobil bekas',16.5),",
          "('pelatihan ulang',11.11),",
          "('pendidikan',44.0),",
          "('peralatan rumah tangga',33.33),",
          "('radio/televisi',22.14),",
          "('renovasi',36.36),",
          "('usaha',25.05);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT d.tujuan, d.npl_pct, l.npl_laporan\nFROM detail d\n",
        solution: [
          "SELECT d.tujuan, d.npl_pct, l.npl_laporan",
          "FROM detail d JOIN dilaporkan l ON d.tujuan = l.tujuan",
          "WHERE d.npl_pct != l.npl_laporan;",
        ].join("\n"),
        expectedColumns: ["tujuan", "npl_pct", "npl_laporan"],
        expectedRows: [
          ["usaha", 35.05, 25.05],
        ],
      },
    },
  ],
};

export default misiRekonsiliasi;

// ── lanjutan misiRekonsiliasi: langkah 5–10 ──────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_REKONSILIASI: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Selisih 10 poin di “usaha” — terus apa?",
    prose: [
      "Ketemu: NPL tujuan “usaha” dilaporkan 25,05%, padahal detailnya 35,05% — selisih 10 poin persentase pada 97 kredit. Dan ingat angka ringkasannya: 21,43% vs 30,0%. Polanya konsisten: angka laporan sistematis LEBIH BAIK dari data.",
      "Ini bukan salah ketik — ini pola. Pertanyaannya bukan lagi “di mana selisihnya” melainkan “apa yang kamu lakukan dengan temuan ini”. Tiga opsi, tiga konsekuensi.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Apa yang kamu lakukan dengan temuan selisih sistematis ini? (Keputusan final.)",
      options: [
        {
          id: "opt-tunda",
          label: "Tunda publikasi — eskalasi ke Kepala Divisi hari ini",
          rationale:
            "Selisih sistematis = indikasi masalah tata kelola, bukan salah ketik. Laporan tidak boleh naik ke komite sebelum sumber selisih dijelaskan tertulis.",
          nextStepId: "temuan-tunda",
          consequenceNote:
            "Kepala Divisi menunda laporan seminggu. Investigasi menemukan: tim bisnis “menyesuaikan” angka usaha agar memenuhi target NPL divisi. Komite akhirnya menerima laporan yang benar — dan kamu yang menemukannya. Kariermu aman; target divisi tidak.",
        },
        {
          id: "opt-catatan",
          label: "Publikasikan dengan catatan kaki koreksi",
          rationale:
            "Komite sudah menunggu; penundaan berbiaya politik. Publikasikan angka benar (30,0%) dengan catatan kaki yang menjelaskan selisih vs draf sebelumnya.",
          nextStepId: "temuan-catatan",
          consequenceNote:
            "Laporan terbit tepat waktu dengan angka benar. Tapi catatan kakimu dibaca komite sebagai “ada yang mencoba menyembunyikan sesuatu” — benar, memang begitu. Audit internal membuka investigasi terpisah atas “penyesuaian” tim bisnis.",
        },
        {
          id: "opt-diam",
          label: "Koreksi diam-diam — perbaiki angka, tidak perlu diributkan",
          rationale:
            "Angka akhirnya benar (30,0%); tidak ada yang dirugikan. Membuat keributan soal “siapa yang mengubah” hanya merusak hubungan kerja.",
          nextStepId: "temuan-diam",
          consequenceNote:
            "Angka terbit benar. Tiga bulan kemudian pola yang sama muncul di laporan berikutnya — kali ini di tujuan “mobil baru”. Karena tidak pernah ada konsekuensi, “penyesuaian” menjadi kebiasaan. Kamu memperbaiki satu laporan; sistemnya tetap bocor.",
        },
      ],
    },
  },
  {
    id: "temuan-tunda",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: tunda & eskalasi",
    prose: [
      "Kamu menelepon Kepala Divisi Jumat malam itu juga. Laporan ditunda seminggu — keputusan yang tidak populer. Investigasi singkat menemukan akarnya: tim bisnis “menyesuaikan” NPL usaha dari 35,05% menjadi 25,05% agar division scorecard tetap hijau.",
      "Komite akhirnya menerima laporan dengan angka 30,0% yang benar, lengkap dengan memo rekonsiliasimu sebagai lampiran. Satu direktur berkata: “Akhirnya ada laporan yang angkanya bisa saya jumlahkan sendiri.” Kepercayaan seperti itu tidak bisa dibeli — hanya bisa dibangun, satu tie-out setiap kalinya.",
    ],
    tasks: [],
    note: {
      title: "Eskalasi ≠ menuduh",
      body: "Kamu tidak menuduh siapa pun curang — kamu melaporkan FAKTA (selisih 10 poin, pola sistematis) dan membiarkan fakta itu bekerja. Analis pelaporan yang baik tidak jadi detektif; ia jadi cermin yang tidak bisa dibohongi.",
    },
  },
  {
    id: "temuan-catatan",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: publikasikan dengan catatan kaki",
    prose: [
      "Laporan terbit tepat waktu: NPL 30,0% dengan catatan kaki dua paragraf menjelaskan selisih vs draf. Komite menghargai ketepatan waktu — tapi satu direktur membaca catatan itu dengan kening berkerut: “Jadi draf sebelumnya angkanya dimanipulasi?”",
      "Audit internal membuka investigasi. Temuannya sama sepertimu. Bedanya: sekarang ada dua proses berjalan paralel — laporanmu dan investigasi — dan kamu dipanggil sebagai saksi, bukan sebagai penemu. Pelajaran: transparansi yang dipaksakan oleh keadaan terasa seperti pengakuan, bukan seperti integritas.",
    ],
    tasks: [],
    note: {
      title: "Catatan kaki bukan perisai",
      body: "Catatan kaki menjelaskan angka — ia tidak menjelaskan MENGAPA angka itu sempat salah. Kalau pola selisihnya sistematis, catatan kaki yang jujur justru mengundang pertanyaan yang lebih tajam. Siapkan jawabannya sebelum komite bertanya.",
    },
  },
  {
    id: "temuan-diam",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: koreksi diam-diam",
    prose: [
      "Angka terbit benar: 30,0%. Tidak ada keributan, tidak ada yang tersinggung. Kamu merasa dewasa — memilih harmoni di atas drama. Tiga bulan kemudian, laporan berikutnya: NPL “mobil baru” dilaporkan 28% vs detail 38%. Pola yang sama, tujuan yang berbeda.",
      "“Penyesuaian” yang tidak pernah dikonfrontasi menjadi prosedur. Kamu memperbaiki satu laporan, tapi sistem yang memproduksi laporan tetap memberi insentif untuk “menyesuaikan”. Inilah harga koreksi diam-diam: kamu menyembuhkan gejala sambil membiarkan penyakitnya dipromosikan.",
    ],
    tasks: [],
    note: {
      title: "Harmoni vs integritas",
      body: "Di pelaporan risiko, memilih “tidak meributkan” temuan sistematis = memilih untuk menjadi bagian dari sistem yang menutupi. Harmoni yang dibayar dengan angka palsu bukan harmoni — itu kolusi yang sopan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: kutipan laporan triwulan",
    prose: [
      "Misi audit. Di bawah ini 14 baris “Kutipan Laporan Risiko Triwulan II” — dokumen yang akan naik ke komite. Empat sabotase disuntikkan. Senjatamu: NPL 30,0% versimu, total plafon 3.271.258 DM, dan mata yang terlatih melihat denominator.",
    ],
    tasks: [],
    auditDossier: {
      version: "rekonsiliasi-m1a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Laporan Risiko Triwulan II yang siap dibawa ke komite direksi.",
      columns: ["Pos", "Nilai laporan", "Keterangan"],
      rows: [
        { rowId: 1, cells: { "Pos": "Total fasilitas", "Nilai laporan": "1.000", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 2, cells: { "Pos": "NPL keseluruhan", "Nilai laporan": "30,0%", "Keterangan": "300/1.000" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 3, cells: { "Pos": "NPL tertinggi (tujuan)", "Nilai laporan": "44,0% — pendidikan", "Keterangan": "22/50" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 4, cells: { "Pos": "Total plafon", "Nilai laporan": "3.271.258 DM", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I1: total tak klop ──
        { rowId: 5, cells: { "Pos": "Total plafon (ringkasan eksekutif)", "Nilai laporan": "3.154.180 DM", "Keterangan": "hlm. 2" }, claims: [{ label: "Status", value: "Final" }] },
        // ── I2: denominator diam-diam ──
        { rowId: 6, cells: { "Pos": "NPL (ringkasan eksekutif)", "Nilai laporan": "21,43%", "Keterangan": "hlm. 2" }, claims: [{ label: "Definisi", value: "Tidak termasuk 400 kredit program pemerintah" }] },
        { rowId: 7, cells: { "Pos": "NPL usaha (dilaporkan)", "Nilai laporan": "25,05%", "Keterangan": "lampiran 4" }, claims: [{ label: "Status", value: "Final" }] },
        // ── I3: footnote kontradiktif ──
        { rowId: 8, cells: { "Pos": "Definisi macet (catatan kaki)", "Nilai laporan": ">90 hari menunggak", "Keterangan": "standar" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 9, cells: { "Pos": "Periode pengamatan", "Nilai laporan": "30 hari", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        // ── I4: id duplikat ──
        { rowId: 10, cells: { "Pos": "ID 472 — Sari", "Nilai laporan": "Macet — usaha — 8.500 DM", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 11, cells: { "Pos": "ID 472 — Sari", "Nilai laporan": "Macet — usaha — 8.500 DM", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 12, cells: { "Pos": "Rata-rata cicilan macet", "Nilai laporan": "3,10% pendapatan", "Keterangan": "—" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 13, cells: { "Pos": "Sumber data", "Nilai laporan": "loan_book.csv", "Keterangan": "1.000 baris" }, claims: [{ label: "Status", value: "Terverifikasi" }] },
        { rowId: 14, cells: { "Pos": "Rekomendasi", "Nilai laporan": "Setujui laporan", "Keterangan": "—" }, claims: [{ label: "Status", value: "Final" }] },
      ],
      injections: [
        { key: "total-tak-klop", rowIds: [5], title: "Total plafon tidak klop", clue: "Ringkasan eksekutif: 3.154.180 DM; penjumlahan loan book: 3.271.258 DM. Selisih 117.078 DM — persis total plafon tujuan “usaha” yang angkanya “disesuaikan”. Tie-out gagal di halaman 2.", danger: "Angka ringkasan yang tidak sama dengan detailnya = laporan yang tidak bisa dipertahankan di depan komite maupun auditor." },
        { key: "denominator-diam", rowIds: [6], title: "Denominator diubah diam-diam", clue: "21,43% = 300 ÷ 1.400 — 400 kredit “program pemerintah” dikeluarkan dari denominator tanpa penjelasan mengapa program pemerintah tidak bisa macet. Definisi NPL yang benar: 300 ÷ 1.000 = 30,0%.", danger: "Mengubah denominator tanpa disclosure adalah cara paling halus memercantik rasio — dan paling sulit ditangkap tanpa menghitung ulang dari mentah." },
        { key: "footnote-kontradiktif", rowIds: [8, 9], title: "Footnote kontradiktif", clue: "Catatan kaki mengklaim definisi macet “>90 hari menunggak (standar)” — tapi periode pengamatan laporan hanya 30 hari, dan status di file adalah hasil observasi dataset, bukan DPD 90. Definisi di footnote ≠ definisi yang dipakai menghitung.", danger: "Footnote yang terdengar standar tapi tidak sesuai metode = kredibilitas palsu. Auditor membaca footnote DULU — pastikan ia jujur." },
        { key: "id-duplikat", rowIds: [10, 11], title: "ID debitur duplikat", clue: "ID 472 muncul dua kali dengan data identik — “dua debitur berbeda” yang kebetulan bernama sama, berstatus sama, berplafon sama. Duplikat menggelembungkan hitungan macet.", danger: "Duplikat ID = constraint unik yang hilang. Di loan book nyata, ini bisa berarti double-counting eksposur — atau dua orang berbeda yang tertukar datanya." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo rekonsiliasi untuk Kepala Divisi",
    prose: [
      "Tulis memo rekonsiliasi satu halaman — lampiran yang akan dibawa ke komite. Memo ini harus membuat orang yang TIDAK ikut menghitung tetap percaya pada angkamu: tunjukkan tie-out-nya, tunjukkan selisihnya, tunjukkan tabel koreksinya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): angka benar (NPL 30,0%), di mana selisihnya, apa rekomendasi.",
        "Tabel tie-out: per tujuan — NPL detail vs NPL dilaporkan; tandai baris yang tidak klop (usaha: 35,05% vs 25,05%).",
        "Akar selisih: apa yang menjelaskan 21,43% (denominator diam-diam) dan siapa yang perlu menjelaskan “penyesuaian” usaha.",
        "Tabel koreksi: angka yang harus diganti di laporan, halaman per halaman.",
        "Jejak audit & batas: sumber (loan_book.csv, 1.000 baris), definisi yang dipakai, dan apa yang TIDAK bisa disimpulkan (mis. data 1994 ≠ kondisi kini).",
      ],
      rubric: [
        { criterion: "Kebenaran tie-out", weight: 30, levels: ["Tidak ada tabel tie-out", "Ada tapi selisih tidak tepat", "Tabel lengkap; selisih usaha 10 poin teridentifikasi"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Sebagian tanpa baris bukti", "Keempat sabotase dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi", weight: 20, levels: ["Rekomendasi kabur", "Ada rekomendasi tanpa akuntabilitas", "Rekomendasi + siapa yang harus menjelaskan + tindak lanjut"] },
        { criterion: "Jejak audit & kejujuran", weight: 25, levels: ["Tidak menyebut sumber/definisi", "Sebagian", "Sumber, definisi denominator, dan batas data dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di kutipan laporan:",
      "1) **Total tak klop** (baris 5): ringkasan 3.154.180 DM vs detail 3.271.258 DM. Selisihnya 117.078 — dan itu bukan kebetulan: pola “penyesuaian” yang sama dengan NPL usaha.",
      "2) **Denominator diam-diam** (baris 6): 21,43% = 300 ÷ 1.400. Empat ratus kredit dikeluarkan dari penyebut dengan label “program pemerintah” — seolah kredit program tidak bisa macet. NPL yang benar: 30,0%.",
      "3) **Footnote kontradiktif** (baris 8–9): klaim “>90 hari (standar)” di samping periode pengamatan 30 hari dan status observasional. Standar yang dikutip ≠ metode yang dipakai.",
      "4) **ID duplikat** (baris 10–11): ID 472 dua kali. Di dunia nyata: constraint unik yang hilang — atau dua nasabah yang tertukar.",
      "Skor deteksimu (x/4) mengukur apakah kamu membaca laporan seperti AUDITOR (mencurigai setiap angka) atau seperti PEMBACA (memercayai setiap angka). Dan keputusan bercabangmu tadi — tunda, catat, atau diam — tidak ada yang gratis. Pelaporan risiko adalah satu-satunya fungsi di bank yang pekerjaannya adalah berkata “angka ini salah” kepada orang yang gajinya bergantung pada angka itu. Itu sebabnya ia butuh orang yang berani tidak populer.",
      "Bahaya nyata terakhir: laporan dengan angka yang tidak klop bukan cuma masalah akurasi — di depan regulator, itu masalah KREDIBILITAS seluruh fungsi risiko. Sekali OJK/BI menemukan laporanmu tidak bisa di-tie-out, setiap laporan berikutnya dibaca dengan kaca pembesar.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: laporan selesai saat diterbitkan",
      type: "risk",
      body: "Laporan selesai saat angkanya bisa DIPERTAHANKAN — di depan komite yang skeptis, auditor yang curiga, dan regulator yang teliti. “Sudah terbit” bukan garis finis; “bisa di-tie-out oleh orang lain” adalah.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Tie-out: NPL versi hitung ulang 30,0% vs laporan 21,43% — selisih terlacak ke NPL “usaha” (35,05% vs dilaporkan 25,05%) dan denominator yang diam-diam dikurangi 400 kredit.",
      "Empat sabotase laporan: total tak klop, denominator diam-diam, footnote kontradiktif, ID duplikat.",
      "Rasio tanpa definisi denominator = opini: selalu nyatakan apa yang termasuk/dikeluarkan.",
      "Keputusan atas temuan sistematis (tunda / catat / diam) punya konsekuensi tata kelola — bukan cuma soal angka.",
      "Data: Statlog German Credit, UCI ML Repository (CC BY 4.0), 1.000 baris, dibekukan 2026-10-15; bahan latih 1994, bukan potret kini.",
    ],
  },
];

(misiRekonsiliasi.steps as V2Step[]).push(...LANJUTAN_REKONSILIASI);
